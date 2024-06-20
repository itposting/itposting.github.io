---
title: "언데드의 정체 노출하기 리눅스에서의 좀비 프로세스 이해 및 제거"
description: ""
coverImage: "/assets/img/2024-06-19-UnmaskingtheUndeadUnderstandingandEliminatingZombieProcessesinLinux_0.png"
date: 2024-06-19 08:42
ogImage: 
  url: /assets/img/2024-06-19-UnmaskingtheUndeadUnderstandingandEliminatingZombieProcessesinLinux_0.png
tag: Tech
originalTitle: "Unmasking the Undead: Understanding and Eliminating Zombie Processes in Linux"
link: "https://medium.com/it-security-in-plain-english/unmasking-the-undead-understanding-and-eliminating-zombie-processes-in-linux-6ce70fc6e009"
---


![링크 텍스트](/assets/img/2024-06-19-UnmaskingtheUndeadUnderstandingandEliminatingZombieProcessesinLinux_0.png)

좀비 프로세스는 Linux를 포함한 Unix류 운영 체제에서 흔히 발생하는 현상입니다. 스포키한 이름을 가졌지만, 소수의 좀비 프로세스는 해로울 만큼은 아니지만 관리되지 않으면 시스템 성능 문제를 일으킬 수 있습니다. 이 글에서는 좀비 프로세스가 무엇인지, 어떻게 생성되는지, 다양한 명령어, 스크립트 및 예제를 사용하여 그것들을 어떻게 제거하는지 설명하겠습니다.

## 좀비 프로세스란 무엇인가요?

좀비 프로세스 또는 defunct 프로세스는 실행을 완료했지만 프로세스 테이블에 여전히 기록이 남아 있는 프로세스입니다. 이것은 부모 프로세스가 종료된 프로세스의 종료 상태를 아직 읽지 않았기 때문에 발생합니다. 결과적으로, 프로세스는 "좀비" 상태에 있습니다.

<div class="content-ad"></div>

## 좀비 프로세스는 어떻게 생성되나요?

프로세스가 종료되면 부모 프로세스에게 SIGCHLD 시그널을 보냅니다. 부모 프로세스는 wait() 또는 waitpid() 시스템 호출을 사용하여 자식 프로세스의 종료 상태를 읽어야 합니다. 부모 프로세스가 이를 하지 않으면 종료된 프로세스가 좀비로서 프로세스 테이블에 남게 됩니다.

## 좀비 프로세스 식별하기

좀비 프로세스를 식별하기 위해 ps, top, htop 등의 명령어를 사용할 수 있습니다.

<div class="content-ad"></div>

사용하실 때는 아래와 같이 Markdown 형식의 테이블로 변환해주시면 됩니다.


| 명령어 |
| --- |
| ps aux | grep Z |


출력 결과에서 STAT 열에 "Z"가 있는 경우에는 좀비 프로세스를 나타냅니다.

Using top

<div class="content-ad"></div>

top 명령에서 좀비 프로세스는 Z 상태로 표시됩니다.

```js
top
```

Shift + z를 눌러 top 인터페이스에서 좀비 프로세스를 강조할 수 있습니다.

htop을 사용하여

<div class="content-ad"></div>

htop에서 좀비 프로세스는 상태 열에 Z로 표시됩니다.

```js
htop
```

## 예시와 시나리오

예시 1: 좀비 프로세스 생성하기

<div class="content-ad"></div>

간단한 시나리오를 만들어 좀비 프로세스가 어떻게 생성되는지 이해해봅시다. 다음과 같은 C 프로그램을 고려해보세요:

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid > 0) {
        // 부모 프로세스
        sleep(30); // 좀비를 관찰할 시간을 줍시다
    } else if (pid == 0) {
        // 자식 프로세스
        exit(0); // 자식 프로세스는 즉시 종료됩니다
    } else {
        perror("fork");
        exit(1);
    }
    return 0;
}
```

```bash
이 프로그램을 컴파일하고 실행합니다:
```

```bash
gcc -o zombie_example zombie_example.c
./zombie_example
```

<div class="content-ad"></div>

부모 프로세스가 sleep 중일 때, 좀비 프로세스를 관찰하기 위해 ps 또는 top을 사용해보세요.

예시 2: 좀비 프로세스 제거하기

좀비 프로세스를 제거하려면, 부모 프로세스가 자식 프로세스의 종료 상태를 읽도록 해야 합니다. 이는 부모 프로세스를 수정하여 SIGCHLD 시그널을 처리하거나 wait()를 사용하는 방법으로 수행할 수 있습니다.

이전 프로그램을 수정하여 SIGCHLD 시그널을 처리하는 예시를 아래에 제시합니다:

<div class="content-ad"></div>

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

void handle_sigchld(int sig) {
    (void)sig; // 사용되지 않는 매개변수 경고 억제
    while (waitpid(-1, NULL, WNOHANG) > 0) {
        // 모든 종료된 자식 프로세스를 처리
    }
}

int main() {
    signal(SIGCHLD, handle_sigchld);
    pid_t pid = fork();
    if (pid > 0) {
        // 부모 프로세스
        sleep(30);
    } else if (pid == 0) {
        // 자식 프로세스
        exit(0);
    } else {
        perror("fork");
        exit(1);
    }
    return 0;
}
```

이제 변경된 프로그램을 다시 컴파일하여 실행하여 좀비 프로세스가 올바르게 처리되는지 확인하세요.

## 좀비 프로세스 관리 스크립트

실제 시나리오에서 여러 응용 프로그램에 의해 생성된 좀비 프로세스를 만날 수 있습니다. 아래는 좀비 프로세스를 관리하고 제거하는 데 도움이 되는 몇 가지 스크립트입니다.

<div class="content-ad"></div>

스크립트 1: 좀비 프로세스 감시 및 보고

좀비 프로세스를 모니터링하고 보고하는 스크립트를 만들어보세요:

```bash
#!/bin/bash

while true; do
    ZOMBIES=$(ps aux | awk '{if ($8 == "Z") print $2}')
    if [ -n "$ZOMBIES" ]; then
        echo "좀비 프로세스가 감지되었습니다: $ZOMBIES"
    fi
    sleep 5
done
```

이 스크립트를 monitor_zombies.sh로 저장하고, 실행 가능하도록 만든 후 실행하세요:

<div class="content-ad"></div>


```js
chmod +x monitor_zombies.sh
./monitor_zombies.sh
```

Script 2: Killing Parent Processes of Zombies

If you need to eliminate zombie processes quickly, you can kill their parent processes. Use this script with caution, as it will terminate the parent processes:

```js
#!/bin/bash
ZOMBIE_PARENTS=$(ps -eo ppid,stat | awk '$2 ~ /Z/ {print $1}' | sort -u)
for ppid in $ZOMBIE_PARENTS; do
    echo "Killing parent process $ppid of zombie processes"
    kill -9 $ppid
done
``` 


<div class="content-ad"></div>

이 스크립트를 kill_zombie_parents.sh로 저장하고 실행 가능하게 만들어서 실행하세요:

```js
chmod +x kill_zombie_parents.sh
./kill_zombie_parents.sh
```

좀비 프로세스는 즉시 해로운 것은 아니지만 확인되지 않으면 리소스 누출과 시스템의 불안정성으로 이어질 수 있습니다. 이러한 프로세스가 어떻게 생성되는지 이해하고 식별하여 제거하는 방법을 알아두는 것은 건강한 Linux 시스템을 유지하는 데 중요합니다. 제공된 명령어, 예시, 스크립트를 사용하여 효과적으로 좀비 프로세스를 관리하고 시스템이 원할하게 실행되도록 할 수 있습니다.