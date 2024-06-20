---
title: "Niels, 러스트를 배우다 4 - VM을 모듈화하는 세 가지 다른 방법"
description: ""
coverImage: "/assets/img/2024-06-20-NielslearnsRust4ThreedifferentwaysmaketheVMmodular_0.png"
date: 2024-06-20 17:07
ogImage: 
  url: /assets/img/2024-06-20-NielslearnsRust4ThreedifferentwaysmaketheVMmodular_0.png
tag: Tech
originalTitle: "Niels learns Rust 4 — Three different ways make the VM modular"
link: "https://medium.com/@nielsreijers/niels-learns-rust-4-three-different-ways-make-the-vm-modular-e2dd6216d204"
---


이 문서는 '루스트(Rust)'를 배우면서 내장형 자바 가상 머신을 이식하는 과정의 네 번째 단골입니다. 전체 시리즈를 보려면 여기를 클릭하세요.

이전 VM 버전은 Darjeeling 가상 머신의 변경 버전이었습니다. 모듈식으로 설정되어 다양한 구성 요소 세트로 쉽게 컴파일할 수 있었습니다.

이러한 구성 요소는 무선 프로그래밍, 장치 UART 액세스, Java 기본 라이브러리 등과 같은 다양한 기능을 제공했습니다. 이를 사용한 연구 프로젝트는 이종적인 사물 인터넷(IoT) 장치 네트워크를 조정하는 데 사용되었습니다. 이 프로젝트에서는 심지어 자바 가상 머신 자체를 선택적 구성 요소로 만들어 가장 작은 장치용 버전을 작성할 수 있었으므로 자바 코드를 실행할 수 없어도 네트워크에 참여할 수 있었습니다.

# 프로젝트 레이아웃

<div class="content-ad"></div>

VM을 빌드하기 전에 프로젝트 레이아웃을 먼저 설정해 봅시다. 목표는 VM을 구축할 때 설정 옵션에 따라 선택적으로 포함될 수 있는 구성 요소를 갖는 것입니다. 각 구성 요소는 코어 VM에서 노출된 여러 훅에 대한 콜백을 등록할 수 있어야 합니다. 이를 통해 구성 요소를 초기화하고 가비지 컬렉터와 상호 작용하게 하며 네트워크 메시지를 수신할 수 있어야 합니다. 이 단계에서 우리는 init()라는 훅을 정의할 것입니다. 이 훅은 시작할 때 호출됩니다.

다양한 옵션을 설명하기 위해 두 개의 구성 요소로 시작해 봅시다.

- jvm : 실제 Java 가상 머신을 포함할 것입니다.
- uart : CPU의 UART(유니버설 비동기 수신기/발신기)를 제어하는 코드를 포함할 것입니다.

프로젝트 레이아웃은 이렇게 보일 것입니다:

<div class="content-ad"></div>

```rust
.
├── avrora.rs
├── main.rs
└── components
    ├── mod.rs
    ├── jvm
    │   └── mod.rs
    └── uart
        └── mod.rs

4 directories, 5 files
```

러스트는 세 가지 방법으로 모듈을 정의하여 계층적으로 범위를 지정합니다:

- mod modname ' ... ' 블록,
- modname.rs 파일로, 이 프로젝트에는 avrora라는 모듈이 있습니다,
- 그리고 mod.rs가 포함된 하위 디렉토리로, 해당 하위 디렉토리의 이름을 따르는 모듈이 정의됩니다. 여기에서는 components, components::jvm, 그리고 components::uart 모듈이 있습니다.

컴파일은 main.rs 또는 라이브러리의 경우 lib.rs에서 시작됩니다. 다른 파일이나 디렉토리의 모듈은 명시적으로 프로젝트에 포함되어야 합니다. 그렇지 않을 경우 무시됩니다. 이 경우 mod avrora;와 mod components; 라인은 avrora 및 components 모듈을 가져와서 전체 크레이트에서 사용할 수 있도록 만듭니다.


<div class="content-ad"></div>

목표는 구성 설정에 따라 components::uart 및 components::vm을 선택적으로 포함하고, 활성화되어 있는 경우 init() 함수를 호출하는 것입니다.

이를 수행하는 세 가지 방법을 고려해 보았는데, 각각이 저에게 몇 가지 흥미로운 Rust 기능을 가르쳐 주었습니다. 따라서 모두 살펴보도록 하겠습니다:

# 옵션 A: build.rs

Cargo에는 코드를 빌드하기 전에 Rust 스크립트를 실행할 수 있는 옵션이 있습니다. 스크립트는 build.rs로 불리며 프로젝트의 루트 디렉토리에 배치되어야 합니다.

<div class="content-ad"></div>

선택한 구성 요소를 가져오는 데 필요한 코드를 생성하는 데 사용할 수 있습니다. 구성 요소가 활성화되는 설정을 따로 저장할 것이며, 이는 프로젝트 루트에 있는 vm-config.toml 파일에 저장됩니다:

```js
[capevm]
components = ["jvm"]
```

이 예에서는 jvm이 활성화되었지만 uart 구성 요소는 비활성화되었습니다. 그럼 우리의 빌드 스크립트는 다음 코드를 포함한 파일을 생성해야 합니다:

```js
#[path = "/home/niels/git/capevm-rust/capevm/src/components/jvm/mod.rs"]
mod jvm;

pub fn init() {
    jvm::init();
}
```

<div class="content-ad"></div>

러스트는 프로젝트에 명시적으로 임포트되지 않는 코드를 무시하므로 최종 빌드에는 jvm 모듈만 포함되고 uart 모듈은 건너뛰게 됩니다.

생성된 코드는 일시적인 파일이며 소스 제어에 포함되지 않아야 합니다. 따라서 Cargo의 출력 디렉토리에 생성하고 components/mod.rs에서 포함시키겠습니다. 이 파일은 이제 다음과 같이 한 줄만 포함하고 있습니다:

```js
include!(concat!(env!("OUT_DIR"), "/enabled_components.rs"));
```

생성된 코드의 #[path] 속성이 필요한 이유는 모듈 임포트가 가져오는 파일의 위치를 기준으로 상대적이기 때문입니다. 그러나 Rust의 include! 매크로는 C의 #include 전처리기 지시문과 다르게 작동합니다. 포함된 코드는 단순히 파일에 붙여넣는 것이 아니라 해당 소스 위치에 따라 구문 분석되는데, 이 경우에는 Cargo 출력 디렉토리입니다. 만약 #[path] 속성을 사용하지 않고 Rust에게 해당 컴포넌트가 다른 위치에 있다고 알리지 않으면 아래와 같은 오류가 발생할 것입니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-NielslearnsRust4ThreedifferentwaysmaketheVMmodular_0.png" />

다음은 완전한 빌드 스크립트입니다:

```js
extern crate toml;

use std::fs;
use std::path::Path;
use toml::Value;

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=vm-config.toml");

    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let out_dir = std::env::var("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("enabled_components.rs");

    let contents: String = fs::read_to_string("vm-config.toml").unwrap();
    let cargo_toml = contents.parse::<Value>().unwrap();

    let vm_components =
        if let Some(capevm_components) = cargo_toml.get("capevm")
                                        .and_then(Value::as_table)
                                        .and_then(|table| table.get("components"))
                                        .and_then(Value::as_array) {
            capevm_components.iter().filter_map(|v| v.as_str()).collect::<Vec<&str>>()
        } else {
            Vec::<&str>::default()
        };

    let mod_imports =
        vm_components.iter()
            .map(|name| format!(r#"
                #[path = "{manifest_dir}/src/components/{name}/mod.rs"]
                mod {name};"#, manifest_dir=manifest_dir, name=name))
            .collect::<Vec<_>>().join("\n");
    let mod_inits =
        vm_components.iter()
            .map(|name| format!("
                {}::init();", name))
            .collect::<Vec<_>>().join("\n");

    let generated_code =
        format!("{}
            
            pub fn init() {
                {}
            }", mod_imports, mod_inits);

    fs::write(dest_path, generated_code.as_bytes()).unwrap();
}
```

조금 주목해야 할 사항이 있습니다:

<div class="content-ad"></div>

- extern crate toml; 메인 애플리케이션과 마찬가지로 build.rs 스크립트는 외부 크레이트를 사용할 수 있습니다. 다른 크레이트와 마찬가지로 Cargo.toml에 선언해야 하지만, [dependencies] 대신 [build-dependencies] 섹션에 선언해야 합니다.
- println!("cargo:rerun-if-changed=..."); 표준 출력에 쓰는 것으로 Cargo가 빌드 스크립트를 실행하는 시점(그리고 다른 여러 가지 것들)을 제어할 수 있습니다. 여기서 두 줄은 Cargo에게 build.rs 또는 vm-config.toml이 변경되면 빌드 스크립트를 다시 실행하도록 지시합니다.
- std::env::var("CARGO_MANIFEST_DIR"): Cargo는 환경 변수를 통해 빌드 프로세스의 여러 매개변수를 스크립트에 노출시킵니다. 이 경우 OUT_DIR을 사용하여 생성된 파일이 위치해야 하는 곳을 결정하고, CARGO_MANIFEST_DIR을 사용하여 구성 요소의 위치를 파악합니다.
- unwrap(): Rust의 주요 오류 처리 방식은 Result<T, E>를 반환하는 것입니다. 이는 T 값이나 E 오류 중 하나를 포함할 수 있습니다. 일반적으로 오류를 처리하거나 전달해야 하지만, 오류가 발생할 가능성이 없거나 코드가 패닉 상황이라고 생각하면 unwrap을 사용하여 Result에서 값을 가져올 수 있습니다.
- .and_then(): toml 크레이트는 toml 파일의 내용을 나타내는 Value 객체를 제공합니다. 이는 이름으로 검색할 수 있습니다. 이는 Option<&Value>를 반환하며, 이름을 찾지 못하면 None일 수 있습니다. .and_then() 호출을 사용하면 값을 포함하는 경우에는 Option에서 작업을 연결하고, 그렇지 않은 경우에는 None을 유지할 수 있습니다. 다른 언어에서는 이를 flatmap 또는 bind라고도 부르기도 합니다.

# 옵션 B: Cargo 피쳐

두 번째 옵션은 Rust 피쳐를 사용하는 것입니다. 이 방법은 훨씬 간단하지만 한계가 있습니다. 먼저 다음과 같이 Cargo.toml에 [features] 섹션을 선언합니다:

```js
[features]
default = ["jvm"]
jvm = []
uart = []
```

<div class="content-ad"></div>

각 기능은 종속성 목록이 포함된 이름에 해당합니다. 기본 기능은 기본적으로 포함됩니다. 예를 들어 이 예시에서 기본 기능은 jvm에 의존하므로 해당 기능은 활성화되지만 uart는 활성화되지 않습니다.

그런 다음 조건부 컴파일에 사용할 수 있는 이름이 지정된 기능이 있습니다. #[cfg(feature = "...")] 속성을 사용하여 구성요소/mod.rs를 다음과 같이 구현할 수 있습니다:

```js
#[cfg(feature = "jvm")]
mod jvm;
#[cfg(feature = "uart")]
mod uart;

pub fn init() {
    #[cfg(feature = "jvm")]
    jvm::init();
    #[cfg(feature = "uart")]
    uart::init();
}
```

이 접근 방식의 장점은 빌드 스크립트보다 훨씬 간단하다는 것입니다. 또한 명령줄에서 선택된 기능을 제어할 수 있습니다. 예를 들어, --features="uart"은 uart 기능을 활성화하며, --no-default-features는 기본 기능을 무시합니다.

<div class="content-ad"></div>

단점 중 하나는 해당 기능이 활성화되어 있는 경우 그 모든 컴포넌트를 가져오기 위해 components/mod.rs에 수동으로 목록을 작성해야 한다는 것입니다. 게다가, 현재 init() 함수만 있어야 하는데 이 함수는 모든 활성화된 기능을 위해 호출되어야 합니다. 그러나 쓰레기 수집 및 네트워킹과 같은 항목을 추가할 때 가능한 후크 목록이 늘어나게 됩니다. 그래서 일부 컴포넌트는 수신 메시지를 듣거나 힙에 자체 객체를 등록하려는 것일 수 있습니다.

이것은 꽤 강한 결합이며, 모듈 및/또는 후크의 수가 계속해서 늘어난다면 이 접근법은 유지하기 어려워질 수 있습니다.

# 옵션 C: 기능 + 인벤토리 크레이트

이제 옵션 C로 넘어가봅시다: 인벤토리 크레이트입니다. 이를 통해 컴포넌트와 코어 VM 간의 강한 결합을 줄일 수 있습니다. 안타깝게도 AVR에서는 작동하지 않지만, 학습할 가치가 있는 내용입니다.

<div class="content-ad"></div>

크레이트를 사용하면 데이터 형식을 정의하고 해당 데이터 형식의 인스턴스를 코드의 한 부분에서 등록하고 다른 곳에서 수집할 수 있습니다. 저희 경우에는 데이터 형식이 init() 함수 포인터를 포함하는 구조체일 수 있습니다:

```rust
pub struct Component {
    init: fn()
}
```

이제 컴포넌트의 구현은 아래와 같습니다:

```rust
pub fn init() {
    println!("jvm 초기화 중...");
}

inventory::submit! {
    crate::components::Component { init }
}
```

<div class="content-ad"></div>

구성 요소/components/mod.rs의 구현부는 다음과 같습니다:

```js
#[cfg(feature = "jvm")]
mod jvm;
#[cfg(feature = "uart")]
mod uart;

pub struct Component {
    init: fn()
}

inventory::collect!(Component);

pub fn init() {
    for component in inventory::iter::<Component> {
        (component.init)();
    }
}
```

collect! 매크로는 submit!()를 통해 등록된 모든 Component 객체를 순회할 수 있는 반복자를 생성합니다. 이 반복자는 main() 함수에 진입하기 전에 초기화되며, 우리가 수동으로 초기화 코드를 실행할 필요가 없습니다.

이 동작이 가능하게 하는 핵심은 submit! 매크로에 있습니다. 매크로가 어떻게 확장되는지 볼 수 있다는 점은 종종 유용하거나 그냥 재미있을 수 있습니다. cargo-expand라는 Cargo 확장 프로그램을 사용하여 확장된 소스를 표시할 수 있습니다. 설치한 후(cargo install cargo-expand), cargo expand components::jvm: 명령을 통해 확장된 소스를 확인할 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-NielslearnsRust4ThreedifferentwaysmaketheVMmodular_1.png)

특정 링크된 섹션에 코드를 배치하여 마법이 일어납니다. 인벤토리 크레이트의 소스를 살펴보면(조밀하지만 500줄 미만이고 그 중 절반은 주석입니다), 생성될 링커 섹션이 운영 체제에 따라 다르다는 것을 알 수 있습니다. 리눅스의 경우 .init_array가 되고, 윈도우의 경우 .CRT$XCU가 되며 macOS의 경우 __DATA,__mod_init_func가 됩니다. 각각은 main() 함수에 진입하기 전에 실행될 코드를 포함하고 있습니다.

AVR의 경우 이러한 종류의 코드가 .initN 섹션으로 들어가지만, 안타깝게도 인벤토리 크레이트는 AVR에서 작동하지 않습니다:

![이미지](/assets/img/2024-06-20-NielslearnsRust4ThreedifferentwaysmaketheVMmodular_2.png)


<div class="content-ad"></div>

에러 메시지가 약간 암호화되어 있어서 이 문제는 조금 어렵게 느껴질 수도 있어요. 특히 `ptr` 피처 부분이 숨겨져 있는 것이요. 이 크레이트는 core::sync::atomic::AtomicPtr라는 유형을 사용하는데, 어떤 이유 때문에 사용할 수 없네요. 이 유형의 구현을 살펴보면 플랫폼이 원자 포인터 작업을 지원하는 경우에만 설정되는 #[cfg(target_has_atomic_load_store = "ptr")]라는 조건부 컴파일 속성이 있다는 것을 알게 됩니다.

AVR은 그 작업을 지원하지 않아요. 이는 8비트 CPU이며 포인터는 16비트이기 때문에 포인터 조작은 항상 여러 번의 읽기 또는 쓰기가 필요해요.

# 비교와 결정

우리는 아마도 인벤토리 크레이트가 하는 것을 AtomicPtr이 없이도 일부 코드를 복사하고 수정하여 재생산할 수 있을 거예요. 그러나 여기서 최종적으로 가장 좋은 선택이 아닌 이유가 하나 더 있어요.

<div class="content-ad"></div>

이 방식은 iterator가 루프를 돌 수 있는 정적 inventory::Node 객체의 링크드 리스트를 만들어 작동합니다. 이것은 RAM을 사용하므로, 객체당 4바이트가 필요한 경우에도 RAM이 단 4KB만 있는 장치에서 정적 목록에 낭비하고 싶지 않습니다.

그러므로 옵션 A와 B 중에서 선택해야 합니다. 옵션 A는 핵심 vm 코드가 구성 요소에 대해 알 필요가 없어 보이지만, 옵션 B는 각 구성 요소를 해당 기능 플래그와 등록해야 한다는 점이 필요합니다.

옵션 A의 단점은 각 구성 요소가 초기화할 것이 없더라도 init()에 대한 구현을 정의해야 한다는 것입니다. 빌드 스크립트는 항상 호출을 생성하므로 말입니다. 러스트 컴파일러는 죽은 코드를 제거하는 데 매우 뛰어나기 때문에, 컴파일 시간에 이 코드들이 제거될 가능성이 높지만, 나중에 사용할 쓰레기 수집기를 위해 비슷한 후크를 추가할 때마다, 적어도 빈 구현을 제공해야 하는데 이는 추가 작업이 필요합니다.

구성 요소와 후크의 수가 제한될 것이므로, 두 옵션 모두 잘 작동할 것으로 보입니다. 옵션 A는 더 많은 요소가 움직이며, 마법이 적으면 항상 좋은 것이므로, 일단 옵션 B를 선택하겠습니다.

<div class="content-ad"></div>

보통 이번 단계의 코드 상태는 Github에서 확인하실 수 있어요. 세 가지 옵션을 업로드했어요:

- 옵션 A: build.rs
- 옵션 B: features
- 옵션 C: features + inventory (AVR에서 컴파일되지 않아요)
- 데스크탑에서 작동하는 옵션 C의 최소 예제.

2024년 5월 23일에 https://nielsreijers.com에서 최초로 게시되었어요.