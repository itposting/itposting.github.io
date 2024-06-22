---
title: "Stable Diffusion 설치 및 실행 방법 MacOS용"
description: ""
coverImage: "/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_0.png"
date: 2024-06-22 16:15
ogImage: 
  url: /assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_0.png
tag: Tech
originalTitle: "How to Install and Run Stable Diffusion on your MacOS"
link: "https://medium.com/generative-ai/how-to-install-and-run-stable-diffusion-on-your-macos-90eedfa62a48"
---


안녕하세요, 독자 여러분! 저는 AI 및 LLM(언어 모델) 기술의 흥미로운 세계를 안내해 드리는 탈립입니다. 이것은 흥미진진한 여정이며, 제가 여러분과 제 경험과 발견을 공유할 수 있어 정말 기쁩니다.

# 목차

- Stable Diffusion이란 무엇인가요?
- 맥에 Stable Diffusion 웹 UI 설치하기
- 맥에서 Stable Diffusion 웹 UI 실행하기
- 맥에서 Stable Diffusion 웹 UI 종료하기
- 맥에서 Stable Diffusion 웹 UI 업데이트하기

# Stable Diffusion이란 무엇인가요?

<div class="content-ad"></div>

안정적인 확산은 Stability AI에서 2022년에 출시된 텍스트-이미지 확산 모델입니다. 이 모델은 이미지에 점진적으로 잡음을 추가하여 완전히 무작위로 만들어지는 확산 과정에 기반을 두고 있습니다. 안정적인 확산은 반대 방향으로 작동하여, 잡음이 많이 섞인 이미지에서 시작하여 점진적으로 잡음을 제거하여 선명한 이미지를 생성합니다.

이 모델은 텍스트와 이미지의 대량 데이터셋으로 훈련되어 있어 텍스트 설명으로 실제적이고 고품질의 이미지를 생성할 수 있습니다. 안정적인 확산은 매우 다재다능하며, 사실적인, 예술적인 및 추상적인 이미지 스타일 등 다양한 이미지 스타일을 생성하는 데 사용할 수 있습니다.

![이미지](/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_0.png)

# 맥에서 안정적인 확산 웹 UI 설치

<div class="content-ad"></div>

## 단계 1 — Homebrew 설치하기

- 먼저 터미널 애플리케이션을 열어주세요. 이 앱은 Applications 디렉토리 내의 Utilities 하위폴더에 있습니다. 또는 Spotlight 검색을 이용하여 Command + Space를 눌러 "터미널"을 입력해도 됩니다.
- 터미널을 열었으면, 다음 명령어를 붙여넣어 실행합니다. 이 명령어는 Homebrew 설치 스크립트를 다운로드하고 실행합니다.

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- 스크립트는 설치를 계속할지 여부를 묻고, Homebrew를 설치하려면 관리자 권한이 필요하므로 비밀번호를 요청합니다. 비밀번호를 입력하고 (입력할 때는 보이지 않습니다) Enter 키를 누릅니다. 설치 과정은 몇 분 정도 소요되며 필요한 파일과 종속성을 다운로드하고 설치합니다.
- 설치가 완료되면, Homebrew가 성공적으로 설치되었다는 메시지가 표시됩니다.
- 터미널에서 어느 디렉토리에서든 Homebrew 명령어를 인식하고 사용할 수 있도록 하려면, PATH 환경 변수를 조정해야 합니다. 프롬프트에서 제공된 명령어를 복사하여 붙여넣고 Enter 키를 눌러 환경 변수를 설정할 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_1.png" />

## 단계 2 — Homebrew를 사용하여 필요한 애플리케이션 설치하기

터미널 앱에서 다음 명령어를 실행하세요:

```js
brew install cmake protobuf rust python@3.10 git wget
```

<div class="content-ad"></div>

홈브루가 Mac에 다운로드하고 설치할 패키지 목록입니다:

- CMake: CMake은 오픈 소스이며 크로스 플랫폼 빌드 시스템입니다. 이를 통해 소프트웨어 프로젝트의 빌드 프로세스를 관리하는 것이 간편화되며, 플랫폼 독립적인 방법으로 소프트웨어를 구성, 빌드 및 테스트할 수 있습니다.
- Protocol Buffers (protobuf): Protocol Buffers는 Google에서 개발한 언어에 상관없는 직렬화 포맷입니다. 간단한 언어를 사용하여 데이터 구조를 정의한 다음 다양한 프로그래밍 언어의 코드를 생성할 수 있습니다. 생성된 코드를 통해 효율적으로 직렬화, 역직렬화 및 데이터 조작을 수행할 수 있습니다.
- Rust: Rust는 메모리 안정성, 동시성 및 성능에 중점을 둔 시스템 프로그래밍 언어로 유명합니다. 운영 체제, 장치 드라이버 및 임베디드 시스템을 포함한 저수준 소프트웨어를 개발하는 신뢰할 수 있고 효율적인 방법을 제공합니다.
- Python@3.10: 이 패키지는 Homebrew를 사용하여 Python 버전 3.10을 설치합니다. Python은 간결함과 다재다능성으로 유명한 인기 있는 프로그래밍 언어입니다. 이 경우의 특정 버전 번호인 3.10은 시간이 지남에 따라 변경될 수 있으며 필요에 따라 다른 버전으로 대체할 수 있습니다.
- Git: Git은 다수의 개발자가 프로젝트에서 동시에 작업하고 코드의 다른 버전을 관리하며 변경 사항을 원활하게 병합할 수 있도록 돕는 널리 사용되는 버전 관리 시스템입니다.
- Wget: Wget은 웹에서 파일을 다운로드하는 명령 줄 유틸리티입니다. HTTP, HTTPS 및 FTP를 포함한 다양한 프로토콜을 지원하며 재귀적 다운로드, 중단된 다운로드 재개, 백그라운드 파일 검색 등의 기능을 제공합니다.

## 단계 3 - 안정적인 확산 웹 UI 설치

Mac에서 GitHub 저장소 AUTOMATIC1111/stable-diffusion-webui에서 "Stable Diffusion Web UI"를 설치하려면 다음 단계를 따라주십시오:

<div class="content-ad"></div>

1. 맥에서 터미널 애플리케이션을 엽니다.

2. 리포지토리를 복제할 디렉토리를 선택하려면 cd 명령을 사용하세요. 예를 들어, 리포지토리를 "문서" 폴더에 복제하려는 경우 다음 명령을 실행하십시오:

```js
cd Documents
```

3. 이 명령을 실행하면 "문서" 디렉토리로 이동합니다. 그러나 리포지토리를 복제할 다른 디렉토리로 경로를 대체할 수 있습니다.

<div class="content-ad"></div>

```js
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

Git이 복제 작업을 시작하여 저장소를 가져와 현재 디렉토리에 저장할 것입니다.

4. 터미널에서 프로세스를 확인할 수 있습니다. 복제가 완료되면 Mac에 "Stable Diffusion Web UI" 저장소의 로컬 복제본이 생성됩니다.

축하합니다! 이제 Mac에 "stable-diffusion-webui" 저장소를 복제하였습니다. 내용을 살펴보려면 `cd` 명령을 사용하여 복제된 저장소로 이동하여 필요한 파일 및 폴더에 액세스할 수 있습니다.

<div class="content-ad"></div>

# 모델 다운로드

- 링크를 클릭하여 안정적인 확산 모델 버전 1.5를 다운로드하세요.
- 다운로드한 파일을 클론한 GitHub 저장소의 다음 폴더에 넣어주세요.

```js
stable-diffusion-webui/models/Stable-diffusion
```

잘 했어요! 이제 Mac에 Stable Diffusion Web UI를 성공적으로 설치하였으며 이미지 생성을 시작할 준비가 되었습니다.

<div class="content-ad"></div>

# Mac에서 Stable Diffusion Web UI 실행하기

- Mac에서 터미널 애플리케이션을 엽니다.
- 복제한 저장소가 있는 디렉토리에 액세스하려면 현재 디렉토리를 변경하려면 `cd` 명령을 사용합니다. 예를 들어, "stable-diffusion-webui" 폴더로 이동하려면 아래 명령을 실행하세요:

```bash
cd stable-diffusion-webui
```

3. 원하는 디렉토리에 들어간 후에는 다음 명령을 실행하여 Stable Diffusion Web UI를 시작합니다:

<div class="content-ad"></div>

```sh
./webui.sh
```

이 명령은 안정적인 확산을 웹 브라우저에서 실행할 수 있는 Python 가상 환경을 설정합니다. 이 가상 환경에 직접 액세스할 수 있는 링크가 터미널 앱에서 제공됩니다.

4. 터미널 앱에서 제공된 URL을 복사하여 웹 브라우저에 붙여넣기합니다. Python은 항상 동일한 URL을 생성하므로 이를 즐겨찾기로 저장할 수 있습니다. 그러나 이 가상 환경이 활성화된 경우에만 기능합니다.

![이미지](/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_2.png)


<div class="content-ad"></div>

# 맥에서 Stable Diffusion Web UI 종료

Stable Diffusion Web UI를 사용 중인 가상 환경은 단순히 브라우저 창을 닫는 것으로는 종료되지 않습니다. 이를 올바르게 종료하려면 다음 단계를 따라주십시오:

- 맥에서 여전히 열려 있는 터미널 애플리케이션으로 돌아갑니다.
- 키보드에서 CONTROL + C를 동시에 누릅니다. 이 동작은 가상 환경 세션을 중단시켜 종료할 것입니다.

# 맥에서 Stable Diffusion Web UI 업데이트하기

<div class="content-ad"></div>

Mac에서 Stable Diffusion 웹 UI를 업데이트하려면 GitHub 저장소 AUTOMATIC1111/stable-diffusion-webui에서 최신 변경 사항을 가져오는 다음 단계를 따르세요:

1. Mac에서 Terminal 애플리케이션을 엽니다.

2. 원래 복제된 저장소가 있는 디렉토리로 이동합니다. `cd` 명령을 사용하여 디렉토리를 변경할 수 있습니다. 예를 들어 "stable-diffusion-webui" 폴더로 이동하려면 다음 명령을 사용하세요:

```sh
cd stable-diffusion-webui
```

<div class="content-ad"></div>

진행하기 전에 올바른 디렉토리에 있는지 확인해주세요.

3. 원하는 디렉토리에 들어간 후 (이 경우 "stable-diffusion-webui"), 다음 명령을 실행하여 최신 변경 사항이 반영된 Stable Diffusion Web UI를 GitHub 저장소에서 업데이트하세요:

```js
git pull
```

이 명령은 Stable Diffusion Web UI의 로컬 사본에 가장 최근 업데이트를 가져와 적용합니다.

<div class="content-ad"></div>

이제 맥에서 Stable Diffusion Web UI를 성공적으로 업데이트했습니다. 로컬 사본이 GitHub 리포지토리의 최신 변경 사항과 동기화됩니다.

블로그를 마무리하며, 다음에 어떤 주제를 탐구하고 싶은지 알고 싶습니다. 여러분의 의견은 중요하니 댓글로 의견을 자유롭게 공유해 주세요. 함께해 주셔서 감사합니다. 호기심을 유지하세요!

즐겁게 보내세요!!

LinkedIn에서 연락해요.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_3.png" />

<img src="/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_4.png" />

이 이야기는 Generative AI에서 발행되었습니다. 최신 AI 이야기에 대해 알아가기 위해 LinkedIn에서 저희와 연락을 유지하고 Zeniteq를 팔로우해 주세요.

최신 뉴스 및 Generative AI 업데이트를 받으려면 뉴스레터를 구독해 주세요. 함께 AI의 미래를 함께 만들어 가요!


<div class="content-ad"></div>


![HowtoInstallandRunStableDiffusiononyourMacOS_5.png](/assets/img/2024-06-22-HowtoInstallandRunStableDiffusiononyourMacOS_5.png)
