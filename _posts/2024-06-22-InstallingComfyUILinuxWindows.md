---
title: "ComfyUI 설치 가이드 Linux, Windows"
description: ""
coverImage: "/assets/img/2024-06-22-InstallingComfyUILinuxWindows_0.png"
date: 2024-06-22 21:48
ogImage: 
  url: /assets/img/2024-06-22-InstallingComfyUILinuxWindows_0.png
tag: Tech
originalTitle: "Installing ComfyUI (Linux , Windows)"
link: "https://medium.com/@yushantripleseven/installing-comfyui-linux-windows-b59a57af61b6"
---


친절한 마음으로 설치 방법 알려드립니다.

Linux 또는 Windows에 ComfyUI를 수동으로 설치하세요.

![이미지](/assets/img/2024-06-22-InstallingComfyUILinuxWindows_0.png)

오랫동안 미게시 상태로 남아있었기 때문에 이를 새로 공유하려 합니다. 쉽게 설치할 수 있는 휴대용 Windows 버전이 있지만, 이 가이드에서는 수동 설치 방법을 다룹니다.

## 전제조건

<div class="content-ad"></div>

Python 3.10
Git

## 단계 1: 레포지토리 복제하기

명령 프롬프트(Windows)나 터미널(Linux)을 열고 레포지토리를 설치할 위치로 이동합니다. 윈도우의 C 드라이브 루트 디렉토리에 ai라는 폴더를 생성하고, 리눅스에서는 사용자의 홈 디렉토리에 해당 폴더를 생성합니다.

![이미지](/assets/img/2024-06-22-InstallingComfyUILinuxWindows_1.png)

<div class="content-ad"></div>

아래 Markdown 형식으로 표태그를 변경해주세요.


<img src="/assets/img/2024-06-22-InstallingComfyUILinuxWindows_2.png" />


Git을 사용하여 레포지토리를 클론해주세요. 클론이 완료되면 현재 작업 디렉토리를 ComfyUI로 설정해주세요.

```js
git clone https://github.com/comfyanonymous/ComfyUI.git
```

```js
cd ComfyUI
```

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-22-InstallingComfyUILinuxWindows_3.png)

![이미지](/assets/img/2024-06-22-InstallingComfyUILinuxWindows_4.png)

## 단계 2: 가상 환경 만들기

이제 가상 환경(venv)을 생성할 것입니다. 이 저장소의 설치 지침은 시스템 전역 수준에서 종속성을 설치하는 것을 제안하지만, 종속성 같은 것들은 다른 프로젝트들과 겹치는 영역을 피하기 위해 자체 venv 내에서 격리시키는 것이 더 나은 것 같아요. 다음 명령어를 사용할 거에요:

<div class="content-ad"></div>

python -m venv을 사용하여 새로운 가상 환경을 만들 수 있어요. 가상 환경의 이름을 venv로 지정할게요. 가장 간단하게 설정하기 위해요.

```js
REM: Windows용

REM: 가상 환경 생성
python -m venv venv

REM: 가상 환경 활성화
venv\Scripts\activate.bat
```

```js
# Linux용

# 가상 환경 생성 (참고: python3 사용)
python3 -m venv venv

# 가상 환경 활성화
source venv/bin/activate
```

![이미지](/assets/img/2024-06-22-InstallingComfyUILinuxWindows_5.png)

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-InstallingComfyUILinuxWindows_6.png)

(venv)가 접두어로 있는 프롬프트를 볼 때, 활성화되었음을 의미합니다.

venv가 활성화된 상태에서는 설치된 파이썬 패키지가 venv 내에서만 작동합니다.

## 단계 3: 의존성 설치


<div class="content-ad"></div>

먼저 Torch를 설치해 주세요. 몇 분 정도 소요될 거에요.

```js
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu121
```

다음으로 requirements.txt 파일에 나열된 나머지 종속성을 설치해 주세요:

```js
pip install -r requirements.txt
```

<div class="content-ad"></div>

## 단계 4: ComfyUI 실행하기

ComfyUI를 실행하려면 먼저 venv가 활성화되어 있는지 확인해야 합니다.

```js
REM: Windows

REM: venv를 활성화합니다.
venv\Scripts\activate.bat

REM: comfyui 시작
python main.py
```

```js
# Linux

# venv를 활성화합니다.
source venv/bin/activate

# comfyui 시작
python3 main.py
```

<div class="content-ad"></div>

작업을 간편하게 하기 위해 위 두 가지를 배치 파일(Windows)이나 셸 스크립트(Linux) 안에 넣을 수 있습니다.

Windows에서: 새 텍스트 파일을 만들고 launch.bat로 이름을 지정하십시오. 그 안에 다음과 같이 작성하십시오:

```js
REM: venv 활성화
call venv\Scripts\activate.bat

REM: comfyui 시작
python main.py --listen
```

파일을 저장한 후, launch.bat 파일을 더블 클릭하여 ComfyUI를 간편하게 시작할 수 있습니다.

<div class="content-ad"></div>

리눅스용: 새 텍스트 파일을 만들어 launch.sh라는 이름을 지어주세요. 그 안에 다음 내용을 넣어주세요:

```bash
#!/bin/bash

# 가상 환경 활성화
source venv/bin/activate

# comfyui 시작
python3 main.py
```

파일을 저장해주세요. 다음으로 해당 파일을 실행 가능하게 만들기 위해 아래 명령어를 입력해주세요:

```bash
chmod +x launch.sh
```

<div class="content-ad"></div>

아래와 같이 입력하여 실행하세요:

```js
./launch.sh
```

또는 GUI에서 직접 실행할 수도 있지만, 파일 관리자에 따라 다를 수 있습니다.