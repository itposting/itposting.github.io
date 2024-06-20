---
title: "러스트 배우기 베어 쓰레딩"
description: ""
coverImage: "/assets/img/2024-06-19-LearningRustBareThreading_0.png"
date: 2024-06-19 00:46
ogImage: 
  url: /assets/img/2024-06-19-LearningRustBareThreading_0.png
tag: Tech
originalTitle: "Learning Rust: Bare Threading"
link: "https://medium.com/gitconnected/learning-rust-bare-threading-1defb65038c9"
---



![이미지](/assets/img/2024-06-19-LearningRustBareThreading_0.png)

리눅스에서 스레드를 생성하는 방법을 아시나요? CPU에서 작업을 스케줄링하기 위해 원시 파이프를 사용하는 방법은 어떤가요? 스레드 간에 클로저를 전달할 수 있을까요?

시스템 프로그래밍에서 Concurrency와 Multi-threading은 중요합니다. Concurrency는 여러 I/O 바운드 작업을 동시에 관리하는 능력을 가리키며, 하나의 스레드 내에서 실행되더라도 동시에 진행 중인 것처럼 보이게 합니다. Multi-threading은 CPU 바운드 작업을 처리하기 위해 여러 스레드를 생성하는 것을 의미하며, CPU가 여러 코어를 가지고 있는 경우 진정한 병렬성을 달성할 수 있습니다. 이 두 용어는 종종 혼동되는데, 둘 다 작업을 동시에 실행하는 문제를 다루기 때문입니다.

Concurrency를 만드는 한 가지 방법은 이벤트 루프입니다. 최근에 리눅스의 uring을 사용하여 작업한 경험이 있습니다. no-std 환경에서 async/await 런타임의 작동 버전을 만들었습니다. 이것은 주 스레드에서 실행되며 병렬로 실행되는 작업의 느낌을 줍니다. 다음 예시를 살펴보겠습니다:


<div class="content-ad"></div>

```rust
pub struct HelloCommand {
    pub msg: &'static [u8],
}

impl HelloCommand {
    pub async fn execute(self) -> Option<&'static [u8]> {
        let stdout = open_stdout();
        let written = match write_stdout(&stdout, self.msg).await {
            StdOutWriteResult::Succeeded(_, written) => written,
            StdOutWriteResult::OperationFailed(_, _) => return Some(APP_STDOUT_FAILED),
            StdOutWriteResult::InternallyFailed() => return Some(APP_INTERNALLY_FAILED),
        };

        if written as usize != self.msg.len() {
            return Some(APP_STDOUT_INCOMPLETE);
        }

        None
    }
}
```

이 예제에서는 표준 출력에 메시지를 출력하는 것을 보여줍니다. 주목할만한 중요한 점은 이것이 비동기 함수로 실행되며 차단되지 않는다는 것입니다. 내부적으로 I/O Ring 런타임을 사용합니다.

이미 std-out에 쓰는 방법을 알고 있으므로 쉽게 파이프에 쓸 수 있습니다. Linux의 많은 구성 요소는 Linux에서 파일 디스크립터로 추상화되어 있기 때문에 유사한 메커니즘을 공유합니다. 그렇다면 파이프는 무엇일까요.

파이프는 메시지를 한 방향으로만 전달할 수 있는 마법 버퍼 터널입니다. 구체적으로 작성자와 리더 엔드포인트가 있습니다. 두 엔드포인트 모두 별도의 파일 디스크립터를 가지고 있습니다. pipe2 시스템 호출을 사용하여 이를 만들 수 있습니다. 만들어진 디스크립터에 대한 두 개의 32비트 정수 배열을 인수로 받습니다. 선택적으로 플래그도 사용할 수 있습니다.

<div class="content-ad"></div>

```rust
pub fn sys_pipe2(pipefd: *mut u32, flags: u32) -> isize {
    unsafe {
        let ret: isize;

        asm!(
            "syscall",
            in("rax") 293,
            in("rdi") pipefd,
            in("rsi") flags,
            lateout("rcx") _,
            lateout("r11") _,
            lateout("rax") ret,
            options(nostack)
        );

        ret
    }
}
```

시스템 호출은 두 개의 파일 기술자로 파이프를 전달합니다. 첫 번째 파일 기술자는 리더이며, 다른 한쪽은 라이터여야 합니다. 파이프에 메시지를 쓸 때 커널에 의해 버퍼링됩니다. 커널 설정 뒤에 기본 크기를 확인할 수 있습니다:

```bash
# cat /proc/sys/fs/pipe-max-size
1048576
```

위의 사실들을 고려하여 Hello World 응용 프로그램을 작성할 수 있습니다. 이 응용 프로그램은 메시지를 파이프에 쓰고, 해당 메시지를 읽어서 최종적으로 std-out에 인쇄합니다.

<div class="content-ad"></div>

```rust
pub struct PipeCommand {
    pub msg: &'static [u8],
}

impl PipeCommand {
    pub async fn execute(self) -> Option<&'static [u8]> {
        let stdout = open_stdout();
        let (reader, writer) = match create_pipe() {
            CreatePipe::Succeeded((reader, writer)) => (reader, writer),
            _ => return Some(APP_PIPE_CREATING_FAILED),
        };

        let reader = spawn(async move {
            let buffer = match mem_alloc(1 * 4096) {
                MemoryAllocation::Failed(_) => return Some(APP_MEMORY_ALLOC_FAILED),
                MemoryAllocation::Succeeded(value) => value.droplet(),
            };

            let (buffer, cnt) = match read_pipe(&reader, buffer).await {
                PipeReadResult::Succeeded(buffer, cnt) => (buffer, cnt),
                _ => return Some(APP_PIPE_READING_FAILED),
            };

            let slice = match buffer.between(0, cnt as usize) {
                HeapSlicing::Succeeded(value) => value,
                _ => return Some(APP_MEMORY_SLICE_FAILED),
            };

            let written = match write_stdout(&stdout, &slice).await {
                StdOutWriteResult::Succeeded(_, written) => written,
                _ => return Some(APP_STDOUT_FAILED),
            };

            if written as usize != self.msg.len() {
                return Some(APP_STDOUT_INCOMPLETE);
            }

            match close_pipe(reader).await {
                PipeCloseResult::Succeeded() => None,
                _ => Some(APP_PIPE_CLOSING_FAILED),
            }
        });

        let writer = spawn(async move {
            match write_pipe(&writer, self.msg).await {
                PipeWriteResult::Succeeded(_, _) => (),
                _ => return Some(APP_PIPE_WRITING_FAILED),
            }

            match close_pipe(writer).await {
                PipeCloseResult::Succeeded() => None,
                _ => Some(APP_PIPE_CLOSING_FAILED),
            }
        });

        match reader.await {
            SpawnResult::Succeeded() => (),
            _ => return Some(APP_IO_SPAWNING_FAILED),
        }

        match writer.await {
            SpawnResult::Succeeded() => (),
            _ => return Some(APP_IO_SPAWNING_FAILED),
        }

        None
    }
}
```

위 목록은 내가 개발한 비동기/대기 런타임에 완전히 의존하기 때문에 조금 혼란스러울 수 있습니다. 이는 파이프가 I/O Ring과 잘 작동한다는 것을 보여줍니다.

파이프는 동기화 도구에 의존하지 않고 간소화된 IPC에 좋습니다. 몇 개의 스레드가 있으면 주 스레드와 워커 스레드 간에 메시지를 전달할 수 있습니다. 리눅스에서 스레드는 흥미로운 것입니다. 우리는 스레드를 만들지 않습니다. 우리 자신의 프로세스를 복제하고 가상 메모리, 파일 디스크립터, 시그널 핸들러 또는 스레드 그룹을 공유할 것임을 커널에 지시합니다.

새 스레드를 생성하면 가장 흥미로운 부분은 자식 스레드가 시작하는 곳입니다. 우리가 고수준 라이브러리가 우리를 위해 추상화한 대로 함수 포인터를 전달하지 않습니다. 새 스레드는 정확히 우리가 자신을 복제하는 시스템 콜을 호출한 시점에서 계속됩니다. 부모 스레드와 자식 스레드를 구분짓는 것은 무엇인가요? 스택과 시스템 콜 결과입니다. 시스템 콜을 호출하기 전에 스택을 미리 생성해야 하며, 시스템 콜은 부모 스레드에서는 양수를 반환하고 자식 스레드에서는 0을 반환합니다.


<div class="content-ad"></div>

클론 생성 및 쓰레드를 구별하기 위해 코드에서 if 문을 사용하는 아이디어가 약간 이상하고 안타깝게도 권장되는 방법 중 하나입니다. 이 경우 부모 스택에서만 사용할 수 있는 일부 변수를 사용하려 하면 문제가 발생할 수 있습니다. 컴파일러가 이를 올바르게 처리하지 못할 수 있습니다. 다행히 Chris Wellons의 멋진 블로그 포스트가 있습니다. 그는 사용자 코드 분기를 피하고 프로세서가 자동으로 올바른 함수를 호출하고 점프하도록 스택을 준비하는 훌륭한 속임수를 설명합니다.

더 깊게 설명해 드리겠습니다. 클론 후 두 스택을 생각해 보겠습니다:

```js
       +-----------------------------+  +-----------------------------+
       |          부모               |  |           자식              |
0x1000 +-----------------------------+  +-----------------------------+ 0xa000
       |                             |  |                             |
       |                             |  |                             |
   RSP |                             |  |                             |
0x1d00 |-----------------------------|  |                             |
       | 반환: 0xb700                |  |                             |
0x1e00 |-----------------------------|  |                             |
       | 반환: 0xb980                |  |                             |
       |   변수: val3               |  |                             |
       |   변수: val4               |  |                             |
0x1f00 |-----------------------------|  |                             |
       | 반환: 0xb120                |  |                             |
       |   변수: val1               |  |                             |
       |   변수: val2               |  |                             | RSP
0x2000 +-----------------------------+  +-----------------------------+ 0xb000
```

스택이 아래쪽으로 성장한다는 것을 기억하면, 현재 부모 RSP 레지스터가 0x1d00을 가리키는 것을 관찰할 수 있습니다. 이 위치에는 모든 로컬 스택 변수가 들어 있고 RET 명령이 실행될 경우 계속할 함수(0xb700)를 가리키는 포인터가 저장되어 있습니다. RET 명령은 스택에서 값을 팝하여 RIP 레지스터에 넣습니다. 자식 쪽에는 아무 것도 없으므로 자식 코드는 어떤 변수도 참조하거나 호출자에게 반환할 수 없습니다.

<div class="content-ad"></div>

위의 표를 마크다운 형식으로 변경해드릴게요.


|       Parent       |       Child       |
|---------------------|-------------------|
| 0x1000             | 0xa000               |
|---------------------|-------------------|
|                     |                   |
|                     |                   |
|                     |                   |
|                     |                   |
| return: 0xb700      |                   |
|---------------------|                   |
| return: 0xb980      |                   |
| variable: val3      |                   |
| variable: val4      |                   |
|---------------------|                   |
| return: 0xb120      |                   |
| variable: val1      |                   |
| variable: val2      |                   |
|---------------------|-------------------|


리턴(call) 명령을 실행할 때 0xb700부터 실행될 것이라는 정보가 0x1d00에 저장되어 있다고 상상해봐요. 현재 부모 호출에 있으며 스택이 0x1d00을 가리키고 있습니다. 우리가 현재 실행 중인 코드가 쓰레드로 프로세스를 복제하고, 새로운 RSP로 0xaf80을 전달한다면, 새로운 스택도 RET 명령을 만날 것이지만, 이번에는 0xb800부터 계속될 것입니다. 스택이 가리키고 있기 때문이죠. 아름다운 것 같죠?

<div class="content-ad"></div>

우리는 한 걸음 더 나아가서 스택을 더 깊게 준비할 수 있습니다. 0xb800 뒤에 있는 코드도 워커 인자를 포함하는 구조체에 대한 포인터를 사용할 수 있으면 좋겠습니다. 구조체를 스택의 끝에 (바닥에) 배치하고, 그 포인터를 RDI 레지스터에 넣고 싶습니다 (System V ABI). 최종 메모리 레이아웃은 다음과 같이 보일 것입니다:

```js
       +-----------------------------+  +-----------------------------+
       |          Parent             |  |           Child             |
0x1000 +-----------------------------+  +-----------------------------+ 0xa000
       |                             |  |                             |
   RSP |                             |  |                             |
0x1c00 |-----------------------------|  |                             |
       | current RDI value           |  |                             | RSP
0x1d00 |-----------------------------|  |-----------------------------| 0xad00
       | return: 0xb700              |  | 0xae80                      |
0x1e00 |-----------------------------|  |-----------------------------| 0xae00
       | return: 0xb980              |  | return: 0xb800              |
       |   variable: val3            |  |-----------------------------| 0xae80
       |   variable: val4            |  | struct:                     |
0x1f00 |-----------------------------|  |   field: val1               |
       | return: 0xb120              |  |   field: val2               |
       |   variable: val1            |  |   field: val3               |
       |   variable: val2            |  |   field: val4               |
0x2000 +-----------------------------+  +-----------------------------+ 0xb000
```

현재 스택의 맨 위에는 반환하기 전에 RDI 레지스터에 넣을 값이 포함되어 있습니다. 이런 방식으로, 부모 스레드의 이전 변경되지 않은 RDI 값과 0xae80 메모리 주소에 있는 함수의 첫 번째 매개변수로 볼 구조체에 대한 포인터가 포함됩니다.

이제 rust와 어셈블리 코드를 작성할 수 있습니다:

<div class="content-ad"></div>

```rust
arch::global_asm!(
    "
    .global _start_thread;

    _start_thread:
        push rdi;           // flags
        sub rsi, 16;        // stack
        mov [rsi], rcx;     // seed
        mov [rsi + 8], rdx; // func
        mov rax, 56;
        syscall;
        pop rdi;
        ret
"
);

#[repr(C)]
struct WorkerArgs {
    ...
}

extern "C" {
    fn _start_thread(flags: u64, stack: *mut (), func: extern "C" fn(&WorkerArgs) -> !, seed: u64) -> isize;
}

unsafe fn start_thread(heap: &Heap, func: extern "C" fn(&WorkerArgs) -> !, args: WorkerArgs) -> isize {
    // 쓰레드로 복제하기 위해 플래그 준비
    let flags = CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND | CLONE_THREAD;

    // 생성된 스택의 끝을 가리킴
    let size = mem::size_of::<WorkerArgs>();
    let stack = (heap.ptr as *mut u8).add(heap.len - size);

    // 새 스택에 작업자 매개변수 복사
    *(stack as *mut WorkerArgs) = args;

    // 여기서 음수 결과 처리에 대해서는 신경 쓰지 않음
    _start_thread(flags, stack as *mut (), func, stack as u64)
}
```

시스템 V ABI를 기억한다면, 네 개의 매개변수가 RDI, RSI, RDX, 그리고 RCX 레지스터에 배치될 것을 알 수 있습니다. 따라서 메모리를 마법같이 재배열할 수 있습니다. 부모 쓰레드는 start_thread 함수 호출자에게 반환하고, 자식 쓰레드는 전달된 함수를 시작하고 결코 반환하지 않을 것입니다.

우리 방정식의 세 번째 구성 요소는 Rust의 클로저입니다. Rust에서 이를 다룰 때, 함수 포인터와 같다는 인상을 받을 수 있습니다. 그러나 실제로 클로저는 트레이트 뒤에 제공된 단일 함수와 함께 조금 더 구조체와 유사합니다. 이를 곰곰이 생각해보면, 그들이 Rust의 futures와 비슷한 상태를 갖고 있다는 것을 상상할 수 있습니다. 상태는 주변 환경으로부터 컴파일러에 의해 자동으로 가로채어지며, 때로는 참조로, 때로는 값으로 나타납니다. 이것이 우리에게 무슨 의미인가요? 정확히 futures와 같이, 우리는 그들을 힙에 복사하려고 시도할 수 있습니다. 다음 데이터가 포함된 힙을 상상해보세요:

```rust
#[repr(C)]
struct CallableHeader {
    data: [usize; 4],
    call: fn(&Heap) -> Option<&'static [u8]>,
}

#[repr(C)]
struct CallableArgs<F, R, E>
where
    F: FnOnce() -> Result<R, E>,
{
    header: CallableHeader,
    target: Option<F>,
    result: Option<Result<R, E>>,
}
```

<div class="content-ad"></div>

헤더에 임의의 32바이트와 함수 포인터가 포함되어 있습니다. 이것은 힙의 맨 위에 고정됩니다. 이는 캡처된 클로저로 확장되며 실행이 끝날 때 결과가 모여집니다. 헤더는 고정된 크기를 가지며 클로저의 유형이나 반환 값 크기에 의존하지 않습니다.

힙의 데이터는 다음 구조체로 래핑될 수 있습니다:

```js
pub struct CallableTarget {
    target: Heap,
    call: fn(&Heap) -> Option<&'static [u8]>,
}

pub enum CallableTargetAllocate {
    Succeeded(CallableTarget),
    AllocationFailed(isize),
}

impl CallableTarget {
    pub fn allocate<F, R, E>(target: F) -> CallableTargetAllocate
    where
        F: FnOnce() -> Result<R, E> + Send,
    {
        fn call<F, R, E>(target: &Heap) -> Option<&'static [u8]>
        where
            F: FnOnce() -> Result<R, E>,
        {
            let mut args: View<CallableArgs<F, R, E>> = target.view();
            let result: Option<&[u8]> = args.call();

            result
        }

        let len = mem::size_of::<CallableArgs<F, R, E>>();
        trace1(b"allocating callable; size=%d\n", len);

        let ((ptr, len), mut data) = match mem_alloc(len) {
            MemoryAllocation::Succeeded(heap) => (heap.as_ptr(), heap.boxed::<CallableArgs<F, R, E>>()),
            MemoryAllocation::Failed(err) => return CallableTargetAllocate::AllocationFailed(err),
        };

        data.result = None;
        data.target = Some(target);
        data.header = CallableHeader {
            data: [ptr, len, 0, 0],
            call: call::<F, R, E>,
        };

        CallableTargetAllocate::Succeeded(Self {
            target: data.into(),
            call: call::<F, R, E>,
        })
    }
}

impl<F, R, E> CallableArgs<F, R, E>
where
    F: FnOnce() -> Result<R, E>,
{
    pub fn call(&mut self) -> Option<&'static [u8]> {
        self.result = match self.target.take() {
            None => return Some(b"calling callable; failed"),
            Some(target) => Some(target.call_once(())),
        };

        None
    }
}
```

이 구조체는 새로운 호출 가능한 것을 할당하며, 두 구조체에 대해 충분한 메모리를 할당하고 클로저를 힙으로 이동시킵니다. 모든 유형을 지워버리지만 모든 일반 유형을 기억하는 함수 포인터는 보존합니다. 호출 가능한 것을 호출하고 수집된 결과를 가져올 수도 있습니다:

<div class="content-ad"></div>

```rust
impl CallableTarget {
    pub fn call(&mut self) -> Option<&'static [u8]> {
        trace2(
            b"dispatching callable; target=%x, size=%d\n",
            self.target.ptr,
            self.target.len,
        );

        (self.call)(&mut self.target)
    }

    pub fn result<F, R, E>(self) -> Option<Result<R, E>>
    where
        F: FnOnce() -> Result<R, E>,
    {
        let value = self.target.view::<CallableArgs<F, R, E>>().result.take();
        self.release();
        value
    }

    pub fn release(mut self) {
        trace1(b"releasing callable; addr=%x\n", self.target.ptr);
        mem_free(&mut self.target);
    }
}
```

지금까지 바이트를 보낼 수 있는 파이프가 있다는 것을 알게 되었습니다. 같은 스레드 내 또는 I/O 링과 함께 작동할 수 있음을 확인했지만, 파이프는 여러 스레드에서도 작동할 것입니다. 시스템 호출을 사용하여 새 스레드를 생성하는 방법을 배웠습니다. 스마트 어셈블리 코드를 작성함으로써 분기를 피할 수 있었습니다. 마지막으로, 호출 가능한 것을 가져와서 타입을 지운 다음에도 호출할 수 있는 구조체를 만들었습니다. 이제 이들을 모두 연결하여 사용 가능한 스레드에서 클로저를 실행시킬 수 있는 엔진을 구축하는 준비가 되었습니다.

작업 스레드에서 호출 가능한 작업을 실행해 봅시다. 다음과 같은 구조체로 시작하겠습니다:

```rust
pub struct Worker {
    incoming: u32,
    outgoing: u32,
}

#[repr(C)]
struct WorkerArgs {
    stack_ptr: usize,
    stack_len: usize,
    incoming: u32,
    outgoing: u32,
}
```

<div class="content-ad"></div>

한 작업자는 두 파이프에 대한 파일 디스크립터를 포함하고 있습니다. 하나는 쓰레드로 페이로드를 전송하기 위한 것이고, 다른 하나는 쓰레드로부터 페이로드를 수신하기 위한 것입니다. 두 쌍의 파이프를 가지고 있으면 양방향 통신이 가능해집니다. 쓰레드를 만들 때, 쓰레드 관점에서 두 개의 파일 디스크립터도 받게 됩니다. 작업자 쓰레드는 자신의 스택을 관리하는 것도 책임져야 합니다. 왜냐하면 작업자의 수명이 끝나면 스택을 파괴해야 하기 때문입니다. 그렇다면 작업자를 어떻게 생성할까요? 함께 분석해봅시다:

```js
pub enum WorkerStart {
    Succeeded(Worker),
    StartFailed(isize),
    StackFailed(isize),
    PipesFailed(isize),
}

impl Worker {
    pub fn start() -> WorkerStart {
        let mut pipefd = [0; 4];
        let ptr = pipefd.as_mut_ptr();

        fn release_pipes(result: isize, pipefd: [u32; 4]) -> WorkerStart {
            for fd in pipefd {
                if fd > 0 {
                    sys_close(fd);
                }
            }

            WorkerStart::PipesFailed(result)
        }

        match sys_pipe2(unsafe { ptr.add(0) }, O_DIRECT) {
            result if result < 0 => return release_pipes(result, pipefd),
            _ => (),
        }

        match sys_pipe2(unsafe { ptr.add(2) }, O_DIRECT) {
            result if result < 0 => return release_pipes(result, pipefd),
            _ => (),
        }

        // we need to have a stack
        let mut heap = match mem_alloc(4096) {
            MemoryAllocation::Succeeded(heap) => heap,
            MemoryAllocation::Failed(err) => {
                release_pipes(err, pipefd);
                return WorkerStart::StackFailed(err);
            }
        };

        // args will be passed directly to newly created thread
        // and must contain incoming and outgoing pipes
        let args = WorkerArgs {
            stack_ptr: heap.ptr,
            stack_len: heap.len,
            incoming: pipefd[0],
            outgoing: pipefd[3],
        };

        // now we can start a thread
        let tid = match unsafe { start_thread(&heap, worker_callback, args) } {
            result if result > 0 => result as u32,
            result => {
                mem_free(&mut heap);
                release_pipes(result, pipefd);

                return WorkerStart::StartFailed(result);
            }
        };

        trace4(
            b"worker spawned; tid=%d, heap=%x, in=%d, out=%d\n",
            tid,
            heap.ptr,
            pipefd[3],
            pipefd[1],
        );

        let worker = Worker {
            incoming: pipefd[2],
            outgoing: pipefd[1],
        };

        WorkerStart::Succeeded(worker)
    }

    pub fn release(self) {
        sys_close(self.incoming);
        sys_close(self.outgoing);
    }
}
```

이 코드는 두 쌍의 파이프, 4096바이트의 스택, 그리고 작업자 인자를 만듭니다. 그리고 마법같은 함수가 호출되어 스택을 재배치하고 인자를 복사하며 커널을 호출합니다. 모든 것이 예상대로 작동하면, 아래 함수가 쓰레드의 진입점이 됩니다:

```js
extern "C" fn worker_callback(args: &WorkerArgs) -> ! {
    ...

    let res = sys_close(args.incoming);
    trace2(b"terminating thread; in=%d, res=%d\n", args.incoming, res);

    let res = sys_close(args.outgoing);
    trace2(b"terminating thread; out=%d, res=%d\n", args.outgoing, res);

    // releasing stack memory and exiting current thread
    trace2(b"terminating thread; heap=%x, len=%d\n", args.stack_ptr, args.stack_len);
    unsafe { _stop_thread(args.stack_ptr, args.stack_len) }
}
```

<div class="content-ad"></div>

여기서 어떤 일이 일어날까요? 결과를 검사하지 않고 두 파이프를 모두 닫습니다. 결과가 부정적인 경우 전혀 반응할 수가 없어요. 주어진 어셈블리 코드 스니펫을 살펴봐서 어떻게 해야 하는지 알아보아요.

아래 어셈블리 코드는 메모리 할당 해제를 담당하며 munmap (11) 시스템 호출을 사용하여 메모리를 해제 한 후에 exit (60) 시스템 호출을 통해 스레드를 종료합니다. 스택이 한 번 해제되면 스택에 의도치 않은 액세스를 피하기 위해 어셈블리로 수행됩니다.

작업자 스레드에 무엇을 놓을 수 있을까요? 비동기 코드를 넣지는 않겠어요. 모든 것을 복잡하게 만들 것이기 때문이죠. 그렇다면 호출 가능한 작업이 실행될 때까지 기다리는 간단한 루프를 놓는 것은 어떨까요? 이 아이디어를 다음 스니펫에서 확인해보겠습니다:

<div class="content-ad"></div>

해당 스니펫은 거의 무한 루프에 진입하여 16바이트의 데이터를 기다립니다. 이는 힙 포인터와 힙 길이의 쌍이 호출 가능한 구조체를 재구성할 것으로 기대합니다. 실제로 가능합니다. 쉽죠, 호출 가능한 구조체를 호출하고 1바이트를 반환 파이프로 다시 씁니다. 이 1바이트는 준비되었다는 신호로만 사용됩니다. 호출 가능한 객체를 해제하지 않고 결과를 해석하지 않습니다. 그런데 포인터만 가지고 호출 가능한 구조체를 재구성하는 방법은 무엇일까요? 이를 살펴보겠습니다:

```js
#[repr(C)]
struct CallableHeader {
    data: [usize; 4],
    call: fn(&Heap) -> Option<&'static [u8]>,
}

#[repr(C)]
struct CallableArgs<F, R, E>
where
    F: FnOnce() -> Result<R, E>,
{
    header: CallableHeader,
    target: Option<F>,
    result: Option<Result<R, E>>,
}

impl CallableTarget {
    fn new(target: Heap, call: fn(&Heap) -> Option<&'static [u8]>) -> Self {
        Self { target, call }
    }

    pub fn from(heap: Heap) -> Self {
        let header: View<CallableHeader> = heap.view();
        let target: CallableTarget = CallableTarget::new(heap, header.call);

        target
    }
}
```

헤더가 고정된 크기이며 힙의 시작 부분에 있는 것을 기억하시나요? 단순히 그것을 읽어서 호출 필드를 추출할 수 있어서 힙과 함께 호출 가능한 타겟을 나타냅니다.

<div class="content-ad"></div>

우리는 무한 루프를 포함하는 워커를 생성하는 방법과, 이를 포함한 익명 함수를 감싼 콜러블 타겟 오브젝트를 받는 방법을 배웠어요. 이제 그 워커에 일을 몇 가지 보내는 시간이에요. 우리의 워커 구조는 두 개의 파일 디스크립터가 있는 것을 기억하고 있죠? 이들은 이전 단락에서 구성한 루프와 통신할 목적으로 사용됩니다.

```js
pub enum WorkerExecute {
    Succeeded(IORingSubmitEntry<*const u8>),
    OutgoingPipeFailed(isize)
}

impl Worker {
    pub fn execute(&mut self, callable: &CallableTarget) -> WorkerExecute {
        let ((ptr, _), len) = (callable.as_ptr(), 16);

        // 여기서는 블로킹 작업이 없을 것으로 예상되며, 워커는 이를 기다립니다.
        trace2(b"worker sends bytes; ptr=%x, len=%d\n", ptr, len);
        let res = sys_write(self.outgoing, ptr as *mut (), len);

        // (ptr, len) 값을 갖고 있는 16바이트를 정확히 전송합니다.
        trace3(b"worker sends bytes; fd=%d, size=%d, res=%d\n", self.outgoing, len, res);
        if res != len as isize {
            return WorkerExecute::OutgoingPipeFailed(res);
        }

        // 비동기 작업은 콜러블의 헤더를 참조하여 반환되어야 합니다.
        WorkerExecute::Succeeded(IORingSubmitEntry::read(self.incoming, (ptr + 16) as *const u8, 1, 0))
    }
}
```

우선적으로 호출 가능한 함수의 힙에 대한 포인터를 얻은 다음, 첫 16바이트를 외부 파이프로 전송합니다. 그런데 왜 16바이트인 걸까요? 아마도 파이프의 다른 끝에서 읽을 때도 이 숫자를 사용하는 것을 기억하실 겁니다. 파이프의 다른 끝은 16바이트가 힙의 포인터와 길이의 쌍임을 예상하고 있습니다. 이 값들은 어디에서 설정되나요? 이는 호출 가능한 함수가 할당될 때 이루어집니다.

```js
impl CallableTarget {
    pub fn allocate<F, R, E>(target: F) -> CallableTargetAllocate
    where
        F: FnOnce() -> Result<R, E> + Send,
    {
        ...

        let ((ptr, len), mut data) = match mem_alloc(len) {
            MemoryAllocation::Succeeded(heap) => (heap.as_ptr(), heap.boxed::<CallableArgs<F, R, E>>()),
            MemoryAllocation::Failed(err) => return CallableTargetAllocate::AllocationFailed(err),
        };

        data.result = None;
        data.target = Some(target);
        data.header = CallableHeader {
            data: [ptr, len, 0, 0],
            call: call::<F, R, E>,
        };

        CallableTargetAllocate::Succeeded(Self {
            target: data.into(),
            call: call::<F, R, E>,
        })
    }
}
```

<div class="content-ad"></div>

스케줄 중 최종으로 반환된 작업은 호출 가능한 힙의 어딘가로의 비동기 읽기 작업입니다. 우리는 해석될 것이 아니라 단지 uring을 트리거하는 신호인 하나의 바이트만 읽어야 합니다. 이는 어떠한 동기화 도구도 사용하지 않도록 합니다. 어떻게 할까요? I/O Ring은 작업이 완료되었을 때 우리에게 알립니다.

단일 워커를 어떻게 관리하는지 알고 있다면 풀 구조체를 사용하여 해당 워커를 인스턴스화해 봅시다. 이 풀은 여러 워커를 관리하고 작업이 블로킹되지 않는 방식으로 대기열에 들어가고 나오도록 보장합니다. 다음 목록과 같이 시작할 수 있습니다:

```js
const WORKERS_COUNT: usize = 8;

pub struct IORuntimePool {
    workers_completers: [Option<u64>; WORKERS_COUNT],
    workers_array: [Option<Worker>; WORKERS_COUNT],
    workers_slots: [usize; WORKERS_COUNT],
    workers_count: usize,
    queue_incoming: u32,
    queue_outgoing: u32,
    queue_counter: usize,
}
```

이 코드는 8개의 스레드를 사용한다고 가정합니다. 또한 카운터와 내부 파이프를 갖는 대기열을 선언합니다. 왜 파이프를 사용할까요? 더 많은 CPU 작업이 요청되었을 때 사용 가능한 워커보다 더 많은 작업이 스케줄링되지 않도록 블로킹되는 작업을 피하기 위해 사용됩니다. 어떻게 할당하는지 살펴봅시다:

<div class="content-ad"></div>

```rust
pub enum IORuntimePoolAllocation {
    Succeeded(Boxed<IORuntimePool>),
    AllocationFailed(isize),
    ThreadingFailed(isize),
    QueueFailed(isize),
}

impl IORuntimePool {
    pub fn allocate() -> IORuntimePoolAllocation {
        let queue = match PipeChannel::create() {
            Ok(value) => value,
            Err(err) => return IORuntimePoolAllocation::QueueFailed(err),
        };

        let mut instance: Boxed<IORuntimePool> = match mem_alloc(mem::size_of::<IORuntimePool>()) {
            MemoryAllocation::Succeeded(heap) => heap.boxed(),
            MemoryAllocation::Failed(err) => return IORuntimePoolAllocation::AllocationFailed(err),
        };

        for i in 0..WORKERS_COUNT {
            let worker = match Worker::start() {
                WorkerStart::Succeeded(worker) => worker,
                WorkerStart::StartFailed(err) => return IORuntimePoolAllocation::ThreadingFailed(err),
                WorkerStart::PipesFailed(err) => return IORuntimePoolAllocation::ThreadingFailed(err),
                WorkerStart::StackFailed(err) => return IORuntimePoolAllocation::AllocationFailed(err),
            };

            instance.workers_array[i] = Some(worker);
            instance.workers_slots[i] = i;
        }

        let (incoming, outgoing) = queue.extract();

        instance.queue_counter = 0;
        instance.workers_count = 0;

        instance.queue_incoming = incoming;
        instance.queue_outgoing = outgoing;

        IORuntimePoolAllocation::Succeeded(instance)
    }
}
```

함수는 먼저 파이프를 생성한 다음 자체를 위해 힙에 메모리를 할당하고 마지막으로 N개의 워커를 시작합니다. 파괴에 대해서는 넘어가고 어떻게 일정 작업을 예약할 수 있는지에 초점을 맞춰봅시다. 예약 알고리즘은 두 단계로 수행될 것입니다. 첫 번째는 워커를 획득하는 것이고, 두 번째 단계는 작업을 실행하는 것입니다. 두 단계 모두 블로킹될 수 있으며, 이것은 이벤트 루프에서 실행되어야 하기 때문에 우리는 이를 원치 않습니다. 블로킹을 피하기 위해 I/O Ring을 사용할 것입니다.

첫 번째 케이스를 고려해봅시다. 워커가 사용 가능하고 callable을 실행하도록 호출하면 됩니다. 이 함수는 I/O Ring 제출자(submitter), 이미 준비된 두 완료자(completers) 및 호출할 callable을 인자로 받습니다. 완료자는 I/O 런타임에서 소개한 가벼운 구조체로, 예약된 진행 중인 I/O 작업에 대한 정보를 전달하기 위한 것입니다. 항상 각 I/O Ring 작업에서 사용자 데이터로 전달됩니다. 첫 번째 완료자는 작업을 대기열에 넣는 것이 완료된 것을 알립니다. 두 번째 것은 callable이 실행된 경우에만 완료됩니다.

```rust
pub enum IORuntimePoolExecute {
    Queued(),
    Executed(),
    ScheduleFailed(),
    ExecutionFailed(),
    InternallyFailed(),
}

impl IORuntimePool {
    pub fn execute(
        &mut self,
        submitter: &mut IORingSubmitter,
        completers: [&IORingCompleterRef; 2],
        callable: &CallableTarget,
    ) -> IORuntimePoolExecute {
        // 워커 획득
        if let Some(slot) = self.workers_slots.get(self.workers_count) {
            let worker = match self.workers_array.get_mut(*slot) {
                Some(Some(worker)) => worker,
                _ => return IORuntimePoolExecute::InternallyFailed(),
            };

            // 대기열 확인
            let op = IORingSubmitEntry::noop();
            match submitter.submit(completers[0].encode(), [op]) {
                IORingSubmit::Succeeded(_) => (),
                _ => return IORuntimePoolExecute::ScheduleFailed(),
            }

            // 실행 작업 준비
            let op = match worker.execute(callable) {
                WorkerExecute::Succeeded(op) => op,
                _ => return IORuntimePoolExecute::InternallyFailed(),
            };

            // 실행 확인
            match submitter.submit(completers[1].encode(), [op]) {
                IORingSubmit::Succeeded(_) => (),
                _ => return IORuntimePoolExecute::ExecutionFailed(),
            }

            // 내부 카운터 업데이트 및 워커와 완료자 연결
            self.workers_count += 1;
            self.workers_completers[*slot] = Some(completers[1].encode());

            return IORuntimePoolExecute::Executed();
        }

        ...
    }
}
```

<div class="content-ad"></div>

위의 코드에서는 worker를 성공적으로 획득한 후, 첫 번째 completor와 함께 noop 작업을 예약합니다. worker를 기다릴 필요는 없지만 완료해야 합니다. 실제 작업 - worker의 execute 함수가 반환한 I/O Ring 작업을 두 번째 completor와 연결하여 즉시 예약할 수 있습니다.

사용 가능한 worker가 없는 경우, 내부 파이프를 사용하여 callable을 대기열에 넣어야 합니다. worker가 준비되면 나중에 읽히게 됩니다:

```js
impl IORuntimePool {
    pub fn execute(
        &mut self,
        submitter: &mut IORingSubmitter,
        completors: [&IORingCompleterRef; 2],
        callable: &CallableTarget,
    ) -> IORuntimePoolExecute {
        ...

        // callable 헤더에 completer를 추가
        let (ptr, len) = unsafe {
            let (ptr, _) = callable.as_ptr();
            let encoded = (ptr + 16) as *mut u64;

            *encoded = completors[1].encode();
            (ptr as *const u8, 24)
        };

        // 대기열화 작업을 알림
        let op = IORingSubmitEntry::write(self.queue_outgoing, ptr, len, 0);
        match submitter.submit(completors[0].encode(), [op]) {
            IORingSubmit::Succeeded(_) => (),
            _ => return IORuntimePoolExecute::ScheduleFailed(),
        }

        return IORuntimePoolExecute::Queued();
    }
}
```

이 코드는 completer를 callable의 힙 헤더에 추가하고 메시지가 소비될 때 I/O Ring을 사용하여 알립니다. worker의 가용성을 감지하면 대칭적인 읽기가 발생합니다:

<div class="content-ad"></div>

```rust
pub enum IORuntimePoolTrigger {
    Succeeded(bool),
    ExecutionFailed(),
    InternallyFailed(),
}

impl IORuntimePool {
    pub fn trigger(&mut self, submitter: &mut IORingSubmitter) -> IORuntimePoolTrigger {
        if self.queue_counter <= 0 {
            return IORuntimePoolTrigger::Succeeded(false);
        }

        if let Some(slot) = self.workers_slots.get(self.workers_count) {
            trace1(b"acquired worker; slot=%d\n", *slot);

            // worker still theoretically may fail
            let worker = match self.workers_array.get_mut(*slot) {
                Some(Some(worker)) => worker,
                _ => return IORuntimePoolTrigger::InternallyFailed(),
            };

            // buffer is needed to collect data from the pipe
            let mut buffer: [u8; 24] = [0; 24];
            let ptr = buffer.as_mut_ptr() as *mut ();

            // we expect to read ptr, len, encoded completer triple from a queue
            let result = sys_read(self.queue_incoming, ptr, 24);
            trace1(b"acquired callable; res=%d\n", result);

            if result != 24 {
                return IORuntimePoolTrigger::InternallyFailed();
            } else {
                self.queue_counter -= 1;
            }

            // decoding payload
            let ptr = ptr as *const usize;
            let len = unsafe { ptr.add(1) };
            let encoded = unsafe { ptr.add(2) as *const u64 };

            // rebuilding callable
            let heap = unsafe { Heap::at(*ptr, *len) };
            let callable: CallableTarget = CallableTarget::from(heap);

            // then we try to follow known path
            let op = match worker.execute(&callable) {
                WorkerExecute::Succeeded(op) => op,
                _ => return IORuntimePoolTrigger::InternallyFailed(),
            };

            // by registering it within I/O Ring
            match submitter.submit(unsafe { *encoded }, [op]) {
                IORingSubmit::Succeeded(_) => (),
                _ => return IORuntimePoolTrigger::ExecutionFailed(),
            }

            // not forgetting about maintaining the state
            self.workers_completers[*slot] = unsafe { Some(*encoded) };
            self.workers_count += 1;
        }

        IORuntimePoolTrigger::Succeeded(true)
    }
}
```

This code reads 24 bytes from a pipe and decodes them as a callable to directly send it to a worker with an already walked path.

You might be curious if reading and writing to a pipe could lead to message fragmentation. No worries, it won’t. Linux pipes are POSIX.1 compliant and offer guarantees about certain behaviors. Let's take a look at what the `man 7 pipe` manual says about it:
```rust
PIPE_BUF
   POSIX.1 says that writes of less than PIPE_BUF bytes  must  be  atomic:
   the  output  data  is  written  to  the  pipe as a contiguous sequence.
   Writes of more than PIPE_BUF bytes may be nonatomic: the kernel may in‐
   terleave the data with data written by other  processes.   POSIX.1  re‐
   quires  PIPE_BUF to be at least 512 bytes.  (On Linux, PIPE_BUF is 4096
   bytes.)  The precise semantics depend on whether the file descriptor is
   nonblocking (O_NONBLOCK), whether there are  multiple  writers  to  the
   pipe, and on n, the number of bytes to be written:

   O_NONBLOCK disabled, n <= PIPE_BUF
          All  n bytes are written atomically; write(2) may block if there
          is not room for n bytes to be written immediately

   O_NONBLOCK enabled, n <= PIPE_BUF
          If there is room to write n bytes to  the  pipe,  then  write(2)
          succeeds  immediately,  writing  all n bytes; otherwise write(2)
          fails, with errno set to EAGAIN.

   O_NONBLOCK disabled, n > PIPE_BUF
          The write is nonatomic: the data given to write(2) may be inter‐
          leaved with write(2)s by other process; the write(2) blocks  un‐
          til n bytes have been written.

   O_NONBLOCK enabled, n > PIPE_BUF
          If  the pipe is full, then write(2) fails, with errno set to EA‐
          GAIN.  Otherwise, from 1 to n bytes  may  be  written  (i.e.,  a
          "partial  write"  may  occur; the caller should check the return
          value from write(2) to see how many bytes  were  actually  writ‐
          ten),  and  these  bytes may be interleaved with writes by other
          processes.
```

<div class="content-ad"></div>

패킷이 나뉘는 것에 대해 걱정할 필요가 없습니다. 왜냐하면 PIPE_BUF가 페이지보다 작지 않고(4096바이트) 우리는 딱 24바이트를 보내기 때문입니다.

풀이 작동하면 I/O 런타임 내에서 사용할 수 있습니다. 아래와 같이 몇 가지 바인딩을 컨텍스트에 정의해야 합니다:

```js
impl IORingRuntime {
    fn trigger(&mut self, completer: &IORingCompleterRef) {
        // 먼저 완료자 뒤에 있는 워커를 해제합니다
        self.pool.release_worker(completer);

        // 그런 다음 아마도 대기 중인 호출 가능을 트리거합니다
        self.pool.trigger(&mut self.submitter);
    }
}

impl IORingRuntimeContext {
    pub fn trigger(&mut self, completer: &IORingCompleterRef) {
        unsafe { (*self.runtime).trigger(completer) }
    }
}

pub enum IORingRuntimeExecute {
    Queued(IORingCompleterRef, IORingCompleterRef),
    Executed(IORingCompleterRef, IORingCompleterRef),
    NotEnoughSlots(),
    InternallyFailed(),
}

impl IORingRuntime {
    fn execute(&mut self, task: &IORingTaskRef, callable: &CallableTarget) -> IORingRuntimeExecute {
        let queued = match self.registry.append_completer(task.clone()) {
            IORingRegistryAppend::Succeeded(completer) => completer,
            IORingRegistryAppend::NotEnoughSlots() => return IORingRuntimeExecute::NotEnoughSlots(),
            IORingRegistryAppend::InternallyFailed() => return IORingRuntimeExecute::InternallyFailed(),
        };

        let executed = match self.registry.append_completer(task.clone()) {
            IORingRegistryAppend::Succeeded(completer) => completer,
            IORingRegistryAppend::NotEnoughSlots() => return IORingRuntimeExecute::NotEnoughSlots(),
            IORingRegistryAppend::InternallyFailed() => return IORingRuntimeExecute::InternallyFailed(),
        };

        match self.pool.execute(&mut self.submitter, [&queued, &executed], callable) {
            IORuntimePoolExecute::Queued() => IORingRuntimeExecute::Queued(queued, executed),
            IORuntimePoolExecute::Executed() => IORingRuntimeExecute::Executed(queued, executed),
            IORuntimePoolExecute::ScheduleFailed() => IORingRuntimeExecute::InternallyFailed(),
            IORuntimePoolExecute::ExecutionFailed() => IORingRuntimeExecute::InternallyFailed(),
            IORuntimePoolExecute::InternallyFailed() => IORingRuntimeExecute::InternallyFailed(),
        }
    }
}

impl IORingRuntimeContext {
    pub fn execute(&mut self, callable: &CallableTarget) -> IORingRuntimeExecute {
        unsafe { (*self.runtime).execute(&self.task, callable) }
    }
}
```

이러한 바인딩을 사용하면 I/O Ring Task Token을 조절할 수 있습니다:

<div class="content-ad"></div>

```rust
impl IORingTaskToken {
    pub fn execute(waker: &Waker, task: &CallableTarget) -> Option<(IORingTaskToken, IORingTaskToken)> {
        match Self::context(waker).execute(task) {
            IORingRuntimeExecute::Queued(queued, executed) => Some((
                IORingTaskToken::from_queue(queued),
                IORingTaskToken::from_execute(executed),
            )),
            IORingRuntimeExecute::Executed(queued, executed) => Some((
                IORingTaskToken::from_op(queued),
                IORingTaskToken::from_execute(executed),
            )),
            IORingRuntimeExecute::NotEnoughSlots() => None,
            IORingRuntimeExecute::InternallyFailed() => None,
        }
    }

    pub fn extract(self, waker: &Waker) -> IORingTaskTokenExtract {
        let context = Self::context(waker);
        let value = match context.extract(&self.completer) {
            IORingRuntimeExtract::Succeeded(value) => value,
            IORingRuntimeExtract::NotCompleted() => return IORingTaskTokenExtract::Failed(self),
            IORingRuntimeExtract::NotFound() => return IORingTaskTokenExtract::Failed(self),
        };

        if let IORingTaskTokenKind::Queue = self.kind {
            // enqueue sent callable
            context.enqueue(&self.completer);
        }

        if let IORingTaskTokenKind::Execute = self.kind {
            // trigger awaiting callable
            context.trigger(&self.completer);
        }

        IORingTaskTokenExtract::Succeeded(value)
    }
}
```

우리는 언제나 두 개의 토큰을 받고, 둘 다 완료를 보고할 것입니다. 두 번째 토큰은 대기 중인 호출 가능한 것들이 스케줄링을 위해 사용 가능하다는 것을 알리려고 할 것입니다.

이것으로 어떻게 이득을 얻을 수 있을까요? CPU에 미래 생성 작업을 작성했다고 상상해 봅시다:

```rust
pub fn spawn_cpu<'a, F, R, E>(target: F) -> Option<SpawnCPU<'a, F, R, E>>
where
    F: FnOnce() -> Result<R, E> + Unpin + Send + 'a,
    R: Unpin + Send,
    E: Unpin + Send,
{
    let task = match CallableTarget::allocate(target) {
        CallableTargetAllocate::Succeeded(target) => target,
        CallableTargetAllocate::AllocationFailed(_) => return None,
    };

    Some(SpawnCPU {
        queued: None,
        executed: None,
        phantom: PhantomData,
        task: Some(task),
    })
}

pub struct SpawnCPU<'a, F, R, E>
where
    F: Unpin,
    R: Unpin,
{
    task: Option<CallableTarget>,
    queued: Option<IORingTaskToken>,
    executed: Option<IORingTaskToken>,
    phantom: PhantomData<(&'a F, R, E)>,
}
```

<div class="content-ad"></div>

나중에 토큰을 사용하여 투표를 할 수 있습니다:

```js
pub enum SpawnCPUResult<R, E> {
    Succeeded(Option<Result<R, E>>),
    OperationFailed(),
    InternallyFailed(),
}

impl<'a, F, R, E> Future for SpawnCPU<'a, F, R, E>
where
    F: FnOnce() -> Result<R, E> + Unpin,
    R: Unpin,
    E: Unpin,
{
    type Output = SpawnCPUResult<R, E>;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let this = self.get_mut();
        trace0(b"# polling spawn-cpu\n");

        if let Some(token) = this.queued.take() {
            trace0(b"# polling spawn-cpu; extracting queued\n");
            let result = match token.extract(cx.waker()) {
                IORingTaskTokenExtract::Succeeded(value) => Some(value),
                IORingTaskTokenExtract::Failed(token) => {
                    this.queued = Some(token);
                    None
                }
            };

            if let Some(result) = result {
                return if result < 0 {
                    Poll::Ready(SpawnCPUResult::OperationFailed())
                } else {
                    trace1(b"# polling spawn-cpu; stage=queued, res=%d\n", result);
                    Poll::Pending
                };
            }
        }

        if let Some(token) = this.executed.take() {
            trace0(b"# polling spawn-cpu; extracting executed\n");
            let result = match token.extract(cx.waker()) {
                IORingTaskTokenExtract::Succeeded(value) => Some(value),
                IORingTaskTokenExtract::Failed(token) => {
                    this.executed = Some(token);
                    return Poll::Pending;
                }
            };

            if let Some(result) = result {
                return if result < 0 {
                    Poll::Ready(SpawnCPUResult::OperationFailed())
                } else {
                    trace1(b"# polling spawn-cpu; stage=executed, res=%d\n", result);
                    let result = match this.task.take() {
                        None => SpawnCPUResult::InternallyFailed(),
                        Some(task) => SpawnCPUResult::Succeeded(task.result::<F, R, E>()),
                    };

                    Poll::Ready(result)
                };
            }
        }

        if this.queued.is_some() || this.executed.is_some() {
            return Poll::Pending;
        }

        let task = match &this.task {
            Some(task) => task,
            None => return Poll::Ready(SpawnCPUResult::InternallyFailed()),
        };

        match IORingTaskToken::execute(cx.waker(), task) {
            Some((queued, executed)) => {
                trace2(b"callable; scheduled, qid=%d, eid=%d\n", queued.cid(), executed.cid());
                this.queued = Some(queued);
                this.executed = Some(executed);
                Poll::Pending
            }
            None => {
                trace0(b"callable not scheduled\n");
                Poll::Ready(SpawnCPUResult::OperationFailed())
            }
        }
    }
}

impl<'a, F, R, E> Drop for SpawnCPU<'a, F, R, E>
where
    F: Unpin,
    R: Unpin,
{
    fn drop(&mut self) {
        if let Some(task) = self.task.take() {
            let (ptr, len) = task.as_ptr();
            trace2(b"callable; releasing task, heap=%x, size=%d\n", ptr, len);
            task.release();
        }
    }
}
```

이를 통해 비동기/대기 코드 내에서 단일 스레드 동시성 모델을 유지하면서 스레드에 직접 코드 일부를 예약할 수 있게 해줍니다. 다음 예제를 살펴보겠습니다:

```js
pub struct ThreadCommand {
    pub ios: u32,
    pub cpus: u32,
}

impl ThreadCommand {
    pub async fn execute(self) -> Option<&'static [u8]> {
        for j in 0..self.ios {
            let task = spawn(async move {
                for i in 0..self.cpus {
                    let value = match spawn_cpu(move || -> Result<u32, ()> { Ok(i + j) }) {
                        None => return Some(APP_CPU_SPAWNING_FAILED),
                        Some(task) => match task.await {
                            SpawnCPUResult::Succeeded(value) => value,
                            SpawnCPUResult::OperationFailed() => return Some(APP_INTERNALLY_FAILED),
                            SpawnCPUResult::InternallyFailed() => return Some(APP_INTERNALLY_FAILED),
                        },
                    };

                    if let Some(Ok(val)) = value {
                        trace3(b"completed %d %d %d\n", i, j, val);
                    }
                }

                None
            });

            match task.await {
                SpawnResult::Succeeded() => (),
                SpawnResult::OperationFailed() => return Some(APP_INTERNALLY_FAILED),
                SpawnResult::InternallyFailed() => return Some(APP_INTERNALLY_FAILED),
            }
        }

        None
    }
}
```

<div class="content-ad"></div>

위의 코드 조각은 시각적 결과에서는 뚜렷한 변화를 주지 않습니다. 두 매개변수가 모두 100과 같을 때, 10,000개의 기본 합계를 계산합니다. 각 작업 내에서 100번의 스레드 호출을 가진 100개의 비동기 작업을 시도합니다. 가장 중요한 관찰은 이 작업이 이벤트 루프를 실행하는 주 스레드를 차단하지 않아 우리 애플리케이션을 매우 반응적으로 만든다는 것입니다.

CPU 및 I/O에서 동시에 이점을 얻을 수 있는 코드를 만들어 보겠습니다. sha1sum을 알고 계십니까? 여러 파일의 해시를 계산하기 위한 명령 줄 도구입니다. 다음과 같이 사용될 수 있습니다:

```js
vscode ➜ /workspaces/learning-rust (async-await-pipes) $ ls -la en*
-rw-r--r-- 1 vscode vscode  1013471918 Sep  2  2023 enwiki-20230901-pages-articles-multistream1.xml-p1p41242
-rw-r--r-- 1 vscode vscode  3854846248 Sep  6  2023 enwiki-20230901-pages-meta-history10.xml-p5136726p5137515.7z
-rw-r--r-- 1 vscode vscode   259750638 May  2 04:25 enwiki-20240501-pages-articles-multistream-index.txt.bz2
-rw-r--r-- 1 vscode vscode 23184900944 May  2 04:23 enwiki-20240501-pages-articles-multistream.xml.bz2
-rw-r--r-- 1 vscode vscode 23648605741 Jun  8 16:01 enwiki-20240601-pages-articles-multistream.xml.bz2
-rw-r--r-- 1 vscode vscode 41513214739 Jun  8 20:27 enwiki-20240601-pages-meta-current.xml.bz2

vscode ➜ /workspaces/learning-rust (async-await-pipes) $ time sha1sum en*
55375e89bccfb6851c9a60b933c6e1e458114ca3  enwiki-20230901-pages-articles-multistream1.xml-p1p41242
f020288be05a1e18da944b8df154ce84976f9b2a  enwiki-20230901-pages-meta-history10.xml-p5136726p5137515.7z
134239721b29faa9264ecb7f59740444f640ec77  enwiki-20240501-pages-articles-multistream-index.txt.bz2
1412bbb2eb36d7d119b2f13a93ff9818db14cd3f  enwiki-20240501-pages-articles-multistream.xml.bz2
54ee62ce7111daffd5be267ec863dc5f54360ed8  enwiki-20240601-pages-articles-multistream.xml.bz2
450dba4f17de7870cc088d800632e385fd6524a6  enwiki-20240601-pages-meta-current.xml.bz2

real    2m20.681s
user    1m54.684s
sys     0m25.853s
```

현재 디렉토리에는 상당히 큰 위키피디아 파일이 몇 개 있습니다. 이 도구는 한 개의 코어를 100% 사용하여 매우 빠르게 해시를 계산할 수 있습니다. 파일 시스템은 병목이 되지 않는 한 파일 단위로 읽습니다. 이론적으로 더 빠르게 수행할 수 있습니다. 대안을 살펴보겠습니다:

<div class="content-ad"></div>

```rust
pub struct Sha1Command {
    pub args: &'static ProcessArguments,
}

impl Sha1Command {
    pub async fn execute(self) -> Option<&'static [u8]> {
        for arg in 2..self.args.len() {
            // 각 인수마다 작업이 생성됩니다.
            let task = spawn(async move {
                // 버퍼에 대한 자동 해제 메모리
                let buffer: Droplet<Heap> = match mem_alloc(32 * 4096) {
                    MemoryAllocation::Succeeded(value) => value.droplet(),
                    MemoryAllocation::Failed(_) => return Some(APP_MEMORY_ALLOC_FAILED),
                };

                // 해시할 파일 경로
                let path: ProcessArgument = match self.args.get(arg) {
                    None => return Some(APP_ARGS_FAILED),
                    Some(value) => value,
                };

                // 열린 파일에 대한 파일 디스크립터
                let file: FileDescriptor = match open_file(&path).await {
                    FileOpenResult::Succeeded(value) => value,
                    _ => return Some(APP_FILE_OPENING_FAILED),
                };

                let mut file_offset = 0;
                let mut buffer_offset = 0;
                let mut sha1 = Sha1::new();

                loop {
                    while buffer_offset < buffer.len {
                        // 버퍼를 슬라이스하여 끝까지 채우려고 시도합니다.
                        let buffer: HeapSlice = match buffer.between(buffer_offset, buffer.len) {
                            HeapSlicing::Succeeded(value) => value,
                            _ => return Some(APP_MEMORY_SLICE_FAILED),
                        };

                        // 파일 오프셋에서 슬라이스된 메모리로부터 바이트를 읽습니다.
                        let read = match read_file(&file, buffer, file_offset).await {
                            FileReadResult::Succeeded(_, read) => read as usize,
                            _ => return Some(APP_FILE_READING_FAILED),
                        };

                        // 두 카운터 모두 증가해야 합니다.
                        buffer_offset += read;
                        file_offset += read as u64;

                        // 파일 끝에 도달한 경우 읽은 양을 반환합니다.
                        if read == 0 {
                            break;
                        }
                    }

                    // sha1이 필요로 하는 512비트 경계까지 슬라이스합니다.
                    let slice = match buffer.between(0, buffer_offset / 64 * 64) {
                        HeapSlicing::Succeeded(val) => val,
                        _ => return Some(APP_MEMORY_SLICE_FAILED),
                    };

                    // 이를 이벤트 루프 외부에서 처리합니다.
                    let task = spawn_cpu(move || -> Result<Sha1, ()> {
                        // 슬라이스를 처리하고 새로운 sha1을 반환합니다.
                        Ok(sha1.update(slice.ptr() as *const u8, slice.len()))
                    });

                    // cpu 작업을 대기합니다.
                    sha1 = match task {
                        None => return Some(APP_CPU_SPAWNING_FAILED),
                        Some(task) => match task.await {
                            SpawnCPUResult::Succeeded(Some(Ok(sha1))) => sha1,
                            _ => return Some(APP_CPU_SPAWNING_FAILED),
                        },
                    };

                    // 버퍼가 완전히 채워지지 않은 경우 파일이 완료된 것으로 간주합니다.
                    if buffer_offset < buffer.len {
                        break;
                    }

                    // 그렇지 않은 경우 버퍼를 처음부터 다시 채우기 시작합니다.
                    buffer_offset = 0;
                }

                // 버퍼에 남은 바이트 양이 0과 63 사이일 수 있습니다.
                let slice: HeapSlice = match buffer.between(buffer_offset / 64 * 64, buffer_offset) {
                    HeapSlicing::Succeeded(slice) => slice,
                    _ => return Some(APP_MEMORY_SLICE_FAILED),
                };

                // 완료해야 할 작업
                let task = move || -> Result<[u32; 5], ()> {
                    // 최종 해시를 [u32; 5]로 반환합니다.
                    Ok(sha1.finalize(slice.ptr() as *mut u8, slice.len(), file_offset))
                };

                // cpu 작업을 대기합니다.
                let hash: [u32; 5] = match spawn_cpu(task) {
                    None => return Some(APP_CPU_SPAWNING_FAILED),
                    Some(task) => match task.await {
                        SpawnCPUResult::Succeeded(Some(Ok(hash))) => hash,
                        _ => return Some(APP_CPU_SPAWNING_FAILED),
                    },
                };

                // sha1sum 출력과 유사한 메시지가 구성됩니다.
                let mut msg = [0; 160];
                let len = format6(
                    &mut msg,
                    b"%x%x%x%x%x  %s\n",
                    hash[0],
                    hash[1],
                    hash[2],
                    hash[3],
                    hash[4],
                    path.as_ptr(),
                );

                // stdout에 비동기적으로 출력됩니다.
                let stdout = open_stdout();
                match write_stdout(&stdout, (msg, len)).await {
                    StdOutWriteResult::Succeeded(_, _) => (),
                    _ => return Some(APP_STDOUT_FAILED),
                }

                // 파일을 닫습니다.
                match close_file(file).await {
                    FileCloseResult::Succeeded() => (),
                    _ => return Some(APP_FILE_CLOSING_FAILED),
                }

                None
            });

            // 작업을 실행하기 위해 대기합니다.
            match task.await {
                SpawnResult::Succeeded() => (),
                _ => return Some(APP_IO_SPAWNING_FAILED),
            }
        }

        None
    }
}
```

<div class="content-ad"></div>

우리는 높은 목표를 가진 PoC를 끝냈어요. No-std와 no-main 환경을 유지하면서 작동하는 예제를 만들었죠. 우리는 pipes를 다루는 법과 스레드를 실행하기 위해 우리 자신을 복제하는 방법을 배웠어요. 마지막으로, 우리는 클로저에 손을 대고 그것을 스레드 간에 이동시켜 I/O에 전념한 실행 이벤트 루프를 차단하지 않고 CPU 집약적 작업을 수행하는 방법을 알아냈어요. 이 모든 기능을 사용하면서 우리는 동기화 도구를 전혀 사용하지 않았어요! 이게 바로 이상적인 동시성 모델이 아닌가요?

https://github.com/amacal/learning-rust/tree/async-await-pipes