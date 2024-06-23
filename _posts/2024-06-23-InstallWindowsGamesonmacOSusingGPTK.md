---
title: "GPTK를 사용해 macOS에 윈도우 게임 설치하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-InstallWindowsGamesonmacOSusingGPTK_0.png"
date: 2024-06-23 15:45
ogImage: 
  url: /assets/img/2024-06-23-InstallWindowsGamesonmacOSusingGPTK_0.png
tag: Tech
originalTitle: "Install Windows Games on macOS using GPTK"
link: "https://medium.com/@chandrus03/install-windows-games-on-macos-using-gptk-63caddc219aa"
---


맥북을 사용하는 동안 주변 사람들이 AAA 타이틀을 즐기는 동안 Asphalt 9만 플레이할 수 있다는 것은 후회스러울 수 있어요.

오랜 시간 동안 macOS를 지원하지 않는 게임들이 많았습니다. 맥북이 성능 부족 때문이 아니라 Mac 사용자들이 게이머 중 작은 비율을 차지하기 때문입니다. 그 결과로 게임 개발사들은 macOS 게임 개발을 위한 자원을 할당하는 것이 경제적으로 어려웠습니다.

최근 Apple은 macOS에서 게임 경험을 향상시키기 위해 중요한 조치를 취했습니다. 최신 macOS 키노트에서 Apple은 Game Porting Toolkit을 발표했는데, 이 도구를 이용하면 새로운 Sonoma 업데이트를 적용한 Mac에서 DirectX 12가 필요한 Windows 게임을 실행할 수 있습니다. 이 발전으로 인해 게임 개발자들은 macOS를 위해 게임을 이식하고 최적화하는 과정을 간단하게 할 수 있습니다.

이전에 Apple Silicon을 사용하는 Mac에서 Windows 게임을 플레이할 수 있는 두 가지 옵션이 있었습니다. 하나는 Parallels를 사용하여 Windows 가상 머신 (VM)을 만들고 가상 플랫폼에 게임을 설치하는 것이었습니다. 하지만 이 방법은 대개 하드웨어 자원을 상당히 많이 사용하기 때문에 게임 플레이가 최적화되지 않는 경우가 흔합니다. 두 번째 옵션은 CodeWeavers의 CrossOver를 사용하여 Windows 게임을 macOS에 직접 설치하는 것이었습니다. CrossOver는 Windows 명령을 Mac 명령으로 번역하는 역할을 하면서 사용자들이 Windows 소프트웨어를 마치 Mac용으로 디자인된 것처럼 실행할 수 있게 해줍니다. CrossOver는 생산성 도구, 유틸리티 프로그램, 게임 등 다양한 종류의 소프트웨어를 하나의 애플리케이션 내에서 작동시킬 수 있는 다재다능한 기능을 제공합니다. 하지만 무료로 사용할 수 없고 매년 구독료가 부과됩니다. 여러분과 함께 Apple이 소개한 Game Porting Toolkit을 사용하여 macOS에 Windows 게임을 설치하는 프로세스에 대해 자세히 알아보겠습니다.

<div class="content-ad"></div>


![Game Porting Toolkit](/assets/img/2024-06-23-InstallWindowsGamesonmacOSusingGPTK_0.png)

Game Porting Toolkit은 2023년 6월 6일에 출시된 Apple의 새로운 번역 계층입니다. Game Porting Toolkit(GPTK)은 Wine과 Apple의 자체 D3DMetal을 결합하여 DirectX 11 및 12를 지원합니다. CrossOver나 Parallels에 비해 Apple Silicon Mac에 Windows 게임을 설치하는 덜 사용자 친화적인 방법이지만, DirectX 12 게임을 플레이할 수 있는 기능을 해제합니다. GPTK를 사용하면 더 많은 게임이 작동하지만, 치트 방지 또는 공격적인 DRM을 사용하는 게임과 AVX/AVX 2를 요구하는 게임(예: The Last of Us Part I)은 일반적으로 작동하지 않습니다.

# Toolkit 설치

Game Porting Toolkit을 설치하려면 Mac이 새로운 macOS Sonoma 버전이어야 합니다. 이전 macOS Ventura에서 Game Porting Toolkit을 사용하면 오류가 발생할 수 있습니다.


<div class="content-ad"></div>

- Apple 개발자 다운로드 사이트를 방문해보세요. 이 파일들은 이제 로그인한 Apple 계정으로 무료로 다운로드하여 사용할 수 있습니다.
- Xcode 15용 Command Line Tools를 검색해서 dmg 파일을 다운로드하고 포함된 pkg 파일을 실행해보세요.
- 이전 버전의 Xcode를 설치했다면, 다음 명령어를 따라 제거하세요

```js
xcode-select -p

sudo rm -rf /Library/Developer/CommandLineTools
```

- Game Porting Toolkit를 검색하고 다운로드하세요. dmg 파일을 열거나 마운트하세요 (일부 명령어는 마운트되어 있어야 합니다)

# Homebrew

<div class="content-ad"></div>

- 터미널을 열어주세요 (macOS에서는 Spotlight에서 검색).

## Rosetta 설치하기

```js
softwareupdate --install-rosetta
```

다음 단계를 Rosetta 환경에서 진행하려면 x86_64 쉘로 들어가세요. 이후의 모든 명령어는 이 쉘 안에서 실행되어야 합니다.

<div class="content-ad"></div>

```js
arch -x86_64 zsh
```

이미 보유하고 있지 않다면 x86_64 버전의 Homebrew를 설치해보세요.

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

경로를 설정하세요.

<div class="content-ad"></div>

```js
(echo; echo 'eval "$(/usr/local/bin/brew shellenv)"') >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

brew 명령어가 path에 있도록 확인해주세요.

```js
which brew
```

만약 이 명령어가 /usr/local/bin/brew를 출력하지 않는다면, 다음 명령어를 사용해야 합니다:

<div class="content-ad"></div>

```bash
export PATH=/usr/local/bin:${PATH}
```

# 빌드

이 명령어를 실행해서 Apple tap을 다운로드하세요

```bash
brew tap apple/apple http://github.com/apple/homebrew-apple
```

<div class="content-ad"></div>

게임 이식 툴킷 공식 버전을 설치해보세요. 이 공식 버전은 여러 대형 소프트웨어 프로젝트를 다운로드하고 컴파일합니다. 이 작업은 컴퓨터의 속도에 따라 시간이 달라집니다. Mac의 속도에 따라 1시간 이상 소요될 수 있습니다. M1 기기의 경우 스펙에 따라 90분 정도가 걸릴 수 있습니다.

```js
brew -v install apple/apple/game-porting-toolkit
```

만약 설치 중에 다음과 같은 오류가 발생한다면:

```js
brew update ; brew -v install apple/apple/game-porting-toolkit
```

<div class="content-ad"></div>

# 툴킷이 이미 최신 버전인지 확인해주세요

다음 단계를 Rosetta 환경에서 계속하기 위해 x86_64 셸에 있는지 확인하세요. 이후의 명령은 모두 이 셸 내에서 실행되어야 합니다. 올바른 셸에 있는지 확신이 없거나 그냥 업데이트를 수행하려면 다시 실행하세요.

```js
arch -x86_64 zsh
```

Homebrew를 실행하여 가능한 업데이트를 수집하고 Apple의 GPTK 공식을 업그레이드하세요

<div class="content-ad"></div>

```js
brew update && brew upgrade apple/apple/game-porting-toolkit
```

이 단계는 스펙에 따라 M1 기기에서 약 48분 정도 소요될 수 있습니다.

# 툴킷 준비하기

이전에 다운로드한 게임 포팅 툴킷 dmg 파일이 /Volumes/Game Porting Toolkit-1.1에 마운트되어 있는지 확인해주세요. 이 스크립트를 사용하여 게임 포팅 툴킷 라이브러리 디렉토리를 Wine의 라이브러리 디렉토리로 복사하세요.

<div class="content-ad"></div>

```js
/Volumes/Game\ Porting\ Toolkit-1.1/redist/lib/를 `brew --prefix game-porting-toolkit`/lib/로 복사하세요.

위의 명령어에서 Toolkit의 버전을 다운로드한 버전으로 수정해주세요. 저는 Toolkit-1.1을 사용했습니다.

이 게임 포팅 툴킷의 이전 버전을 설치하는 경우에는, D3DMetal 라이브러리를 복사하기위한 올바른 명령어를 알아보기 위해 해당 디스크 이미지의 Read Me.rtf 파일을 참조하세요.

다음 명령어를 사용하여 Game Porting Toolkit DMG의 3개 스크립트를 /usr/local/bin에 넣으세요.
```

<div class="content-ad"></div>

```sh
cp /Volumes/Game\ Porting\ Toolkit*/gameportingtoolkit* /usr/local/bin
```

# 와인 프리픽스

와인 프리픽스는 크로스오버의 병(Bottle)과 유사한 가상 C: 드라이브를 포함하고 있어요. 툴킷과 게임을 이 가상 C: 드라이브에 설치할 거예요. 다음 명령어를 실행하여 홈 디렉터리에 my-game-prefix라는 새로운 와인 프리픽스를 생성하세요. 이 명령어는 my-game-prefix라는 와인 프리픽스를 만들지만 다른 이름으로 변경할 수도 있어요.

```sh
WINEPREFIX=~/my-game-prefix $(brew --prefix game-porting-toolkit)/bin/wine64 winecfg
```

<div class="content-ad"></div>

- "Wine configuration" 창이 화면에 나타날 것입니다.
- Windows 버전을 Windows 10으로 변경하세요.
- Apply를 선택한 후 winecfg를 나가려면 OK를 선택하세요.

# Epic Games 설치하기

Epic Games에서 게임을 설치하려면 https://heroicgameslauncher.com/에서 다운로드할 수 있는 Heroic Games Launcher를 사용합니다.

설치 후 Epic Games 계정에 로그인하거나 새로 만드세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-InstallWindowsGamesonmacOSusingGPTK_1.png" />

그냥 설치를 클릭하면 시작할 수 있어요!

# Steam 설치

윈도우 버전의 Steam을 다운로드하여 다운로드 폴더에 넣어주세요.

<div class="content-ad"></div>

```js
gameportingtoolkit ~/my-game-prefix ~/Downloads/SteamSetup.exe
```

## 스팀 실행

```js
gameportingtoolkit ~/my-game-prefix 'C:\Program Files (x86)\Steam\steam.exe'
```

이번 개발은 macOS로의 게임 이식을 개발자들에게 더 쉽게 만들 것으로 예상되며, 앞으로 맥에서 AAA 게임을 출시하는 희망을 제기하고 있습니다. 윈도우 게임을 맥에서 설치하는 데 도움이 되기를 바랍니다. 감사합니다 :)