---
title: "윈도우용 ARM용 Go 패키지 빌드하기"
description: ""
coverImage: "/assets/img/2024-06-19-BuildingGopackagesforWindowsonARM_0.png"
date: 2024-06-19 15:34
ogImage: 
  url: /assets/img/2024-06-19-BuildingGopackagesforWindowsonARM_0.png
tag: Tech
originalTitle: "Building Go packages for Windows on ARM"
link: "https://medium.com/@x1unix/building-go-packages-for-windows-on-arm-d181fa4e3bfc"
---


<img src="/assets/img/2024-06-19-BuildingGopackagesforWindowsonARM_0.png" />

최근 Qualcomm이 새로운 Snapdragon X Elite 칩을 장착한 노트북 목록을 발표했습니다. 이 칩은 Apple의 M3 프로세서와 동등한 성능을 가진다고 주장하고 있습니다.

이는 곧 시장에서 더 많은 Windows on ARM 노트북이 출시될 것이라는 뜻이며, 우리 개발자로서는 그에 대비할 준비를 해두어야 합니다.

본 기사는 Q&A 섹션으로 구성되어 있어 해당 주제를 간략히 설명하고 있습니다.

<div class="content-ad"></div>

# WoA는 x86을 에뮬레이션할 수 있나요?

Windows on ARM(WoA)는 x86 및 x86-64 에뮬레이션을 지원하지만, AVX2와 같은 벡터 명령어와 같은 일부 기능이 지원되지 않을 수 있으며, 에뮬레이션은 성능에 약간의 페널티를 가져올 수 있습니다.

simdjson과 같은 라이브러리를 사용하는 사람들은 위험에 노출될 수 있습니다.

# Go는 이미 크로스 컴파일을 지원하지 않나요?

<div class="content-ad"></div>

Go는 ARM64를 Windows용으로 포함한 즉시 교차 컴파일 지원을 제공합니다. 그러나 이에는 CGO가 포함되지 않습니다.

즉, sqlite3와 같은 CGO 라이브러리를 사용하는 모든 프로그램은 교차 컴파일을 위해 C 및/또는 C++ 도구 체인이 필요합니다.

# 알겠어요, MinGW가 이미 그것을 다루고 있지 않나요?

윈도우 및 리눅스에서의 교차 컴파일을 위한 가장 인기 있는 솔루션은 MinGW입니다.

<div class="content-ad"></div>

안타깝게도 MinGW는 ARM64 타겟을 지원하지 않습니다.

MSYS2 툴체인은 ARM을 지원하지만 Windows 전용이기 때문에 사용할 수 있습니다.

즉, Linux 기기에서 Windows ARM을 위한 프로그램을 빌드하려면 MinGW가 ARM64 타겟을 지원하지 않기 때문에 다른 옵션을 고려해야 합니다.

# 그렇다면 CGO를 통해 WoA용 프로그램을 어떻게 빌드할까요?

<div class="content-ad"></div>

걱정 마세요, 이미 대응되었습니다.

WoA를 지원하는 llvm-mingw라는 대안 도구 체인이 있습니다.

안타깝게도 Arch Linux를 제외한 대부분의 배포판에는 이용할 수 없지만, 여전히 릴리스 페이지에서 미리 빌드된 이진 파일을 다운로드할 수 있습니다.

llvm-mingw를 더 편리하게 사용할 수 있는 방법이 있을까요?

<div class="content-ad"></div>

네, 확실해요!

모든 Windows 아키텍처용 특별한 도커 이미지가 있어요 — amd64, x86, 그리고 arm64 이에요.

이 이미지는 x1unix/go-mingw 라고 불리며, go 1.21부터 arm64 타겟을 지원해요.

이 이미지는 x86용으로 MinGW를 사용하고, arm64 타겟용으로는 llvm-mingw를 사용해요.

<div class="content-ad"></div>

# 사용 방법

아주 간단해요. 이미지를 가져와서 GOARCH=arm64 환경 변수와 함께 go build 명령을 호출하면 됩니다.

예를 들어, 여기서 간단한 WinAPI CGO 예제를 살펴보겠습니다:

```js
package main

/*
#cgo LDFLAGS: -lkernel32
#include <windows.h>
#include <stdio.h>

// CGO가 작동하는지 테스트하기 위해 WinAPI를 사용하여 MessageBox를 표시하는 함수.
void hello() {
  SYSTEM_INFO si;
  ZeroMemory( & si, sizeof(SYSTEM_INFO));
  GetSystemInfo( & si);
  char * arch;
  switch (si.wProcessorArchitecture) {
  case PROCESSOR_ARCHITECTURE_AMD64:
    arch = "AMD64";
    break;
  case PROCESSOR_ARCHITECTURE_INTEL:
    arch = "x86";
    break;
  case PROCESSOR_ARCHITECTURE_ARM:
    arch = "ARM";
    break;
  case PROCESSOR_ARCHITECTURE_ARM64:
    arch = "ARM64";
    break;
  case PROCESSOR_ARCHITECTURE_IA64:
    arch = "IA";
    break;
  default:
    arch = "Unknown";
    break;
  }

  char message[30];
  sprintf(message, "CGO에서 %s에서 안녕하세요", arch);

  MessageBox(NULL, message, "안녕, 세계", MB_OK);
}
*/
import "C"
import "fmt"

func main() {
    fmt.Println("MessageBox를 열기 위해 C 함수 호출 중입니다...")
    C.hello()
}
```

<div class="content-ad"></div>

이제 도커 이미지를 사용한 예제를 만들어 봅시다:

```js
# 사용할 Go 버전. Go 1.21부터 WoA를 지원합니다.
export GO_VERSION=1.22

docker run --rm -it -e GOARCH=arm64 \
    -v .:/go/work -w /go/work \
    x1unix/go-mingw:$GO_VERSION \
    go build -o hello.exe .
```

# 결과

프로그램을 빌드한 후에는 Windows on Arm이 설치된 어떤 VM 안에서 실행해 보세요.

<div class="content-ad"></div>


![그림](/assets/img/2024-06-19-BuildingGopackagesforWindowsonARM_1.png)

이 예제에서는 Parallels Workstation을 사용합니다.

# CI에 어떻게 통합할 수 있을까요?

이것은 일반적인 Docker 이미지이기 때문에 GitHub Actions 및 Gitlab CI에서 손쉽게 사용할 수 있습니다.


<div class="content-ad"></div>

CI 템플릿은 여기에서 확인하실 수 있습니다.