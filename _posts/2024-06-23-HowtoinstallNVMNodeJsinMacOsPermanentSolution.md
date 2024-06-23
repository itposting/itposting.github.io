---
title: "Mac에서 NVM과 Nodejs 설치하는 방법  영구적인 솔루션"
description: ""
coverImage: "/assets/img/2024-06-23-HowtoinstallNVMNodeJsinMacOsPermanentSolution_0.png"
date: 2024-06-23 15:41
ogImage: 
  url: /assets/img/2024-06-23-HowtoinstallNVMNodeJsinMacOsPermanentSolution_0.png
tag: Tech
originalTitle: "How to install NVM , Node Js in MacOs | Permanent Solution"
link: "https://medium.com/@rohanbhatotiya/how-to-install-nvm-node-js-in-macos-permanent-solution-dc3b24616ecb"
---


참고: 생각 많이 하지 마세요, 그냥 복사해서 붙여 넣으세요.

먼저 아래 명령어를 사용하여 Homebrew를 설치해야합니다:

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

이 명령어가 작동하지 않으면 네트워크를 변경해보세요.
이미 Homebrew가 설치되어있는 경우에는 위의 명령어를 무시하세요.

<div class="content-ad"></div>

이제 다음 명령어를 실행해주세요 :

```js
brew install nvm
```

그 다음에는 다음 명령어를 실행하여 NVM을 위한 디렉토리를 생성해주세요 :

```js
mkdir ~/.nvm
```

<div class="content-ad"></div>

디렉터리를 생성한 후에는 다음의 라인을 셸 구성 파일에 추가해주세요 (nano ~/.zshrc 또는 nano ~/.bashrc) :

```js
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/VERSION/nvm.sh" ] && . "/usr/local/opt/nvm/VERSION/nvm.sh"
```

위 코드에서 VERSION 부분을 원하는 버전으로 바꾼 후 ctrl O를 눌러 저장하고, 그런 다음 ctrl X로 종료하세요.

오류 없이 작업하기 위해서 usr/local/opt/nvm 으로 이동한 후, 특정 버전이 있는지 확인하고 VERSION을 실제 버전으로 교체하세요.

<div class="content-ad"></div>

만약 버전이 없고 nvm.sh가 nvm 폴더 안에 있으면 상단 명령어에서 VERSION을 제거하세요.

아직 작동하지 않는다면 nvm.sh를 수동으로 찾아보세요 (보통 /usr/local/opt/에 남아 있습니다) 그리고 해당 경로를 찾아서 상단 명령어의 경로로 대체하세요.

그리고 터미널을 다시 시작하세요.

Node Js를 설치하려면 이렇게 입력하세요:

<div class="content-ad"></div>

```js
nvm 20 설치
```

실제로 설치하려는 버전으로 "버전"을 대체하여 특정 버전을 설치할 수 있습니다 (안정적이고 기본 값인 20을 사용하고 있습니다) :

```js
nvm install <version>
```

이제 노드 JS 및 NVM 버전 또는 설치를 확인하려면 다음을 사용하세요 :

<div class="content-ad"></div>

```js
nvm ls
```

또한 nvm -v 또는 node -v을 사용할 수 있습니다. 이 명령어들은 NVM 또는 Node의 버전 정보만 표시할 것입니다. 하지만 nvm ls 명령어는 모든 정보를 표시할 것입니다.

<img src="/assets/img/2024-06-23-HowtoinstallNVMNodeJsinMacOsPermanentSolution_0.png" />