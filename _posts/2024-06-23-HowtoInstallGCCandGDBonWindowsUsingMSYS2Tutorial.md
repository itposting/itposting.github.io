---
title: "MSYS2를 사용하여 Windows에서 GCC와 GDB 설치하는 방법  튜토리얼"
description: ""
coverImage: "/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_0.png"
date: 2024-06-23 15:47
ogImage: 
  url: /assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_0.png
tag: Tech
originalTitle: "How to Install GCC and GDB on Windows Using MSYS2 — Tutorial"
link: "https://medium.com/@sajidifti/how-to-install-gcc-and-gdb-on-windows-using-msys2-tutorial-0fceb7e66454"
---


<img src="/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_0.png" />

개발자들이 Windows 환경으로 전환하거나 Windows 환경에서 작업하는 경우, C 및 C++ 프로그래밍을 위한 견고한 도구 체인 설정이 매우 중요합니다. 본 자습서에서는 MSYS2를 사용하여 Windows에 GCC (GNU Compiler Collection) 및 GDB (GNU Debugger)를 설치하는 과정을 안내하겠습니다. MSYS2는 소프트웨어 배포 및 빌딩 플랫폼입니다.

# 단계 1: MSYS2 다운로드 및 설치

먼저 공식 웹사이트에서 MSYS2 설치 프로그램을 다운로드하세요. 설치 지침을 따라 시스템에 적합한 아키텍처(32비트 또는 64비트)를 선택하는 것이 중요합니다.

<div class="content-ad"></div>

다운로드 링크: MSYS2

![이미지](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_1.png)

## 단계 2: 시스템 업데이트 및 기본 패키지 설치

MSYS2를 설치한 후, MSYS2 MinGW 터미널을 열고 아래 명령어를 차례대로 사용하여 패키지 데이터베이스를 업데이트하고 기본 패키지를 설치합니다:

<div class="content-ad"></div>

```js
pacman -Syu
pacman -Su
```

팁: Msys2 셸 창에서는 Ctrl+V 또는 Ctrl+Shift+V가 작동하지 않을 수 있습니다. 붙여넣기하려면 오른쪽 클릭을 사용하세요. 또한 터미널에서 프롬프트가 나타날 때는 그냥 Enter 키를 누르세요. 이 경우 기본적으로 Y 또는 Yes가 됩니다. Y를 입력한 후 Enter 키를 누르는 방법도 있습니다. 둘 다 동작합니다.

![이미지](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_2.png)

# 단계 3: C 및 C++용 GCC 설치하기




<div class="content-ad"></div>

다시 한 번 MSYS2 셸을 열어주세요. 32비트와 64비트 아키텍처용 GCC를 설치하려면 다음 명령어를 사용하세요:

64비트용:

```js
pacman -S mingw-w64-x86_64-gcc
```

32비트용:

<div class="content-ad"></div>

```js
pacman -S mingw-w64-i686-gcc
```

# 단계 4: C 및 C++용 GDB 설치하기 (선택 사항)

디버깅을 위해 GDB를 설치하려면 다음 명령어를 사용하세요:

64-bit용:

<div class="content-ad"></div>

```js
pacman -S mingw-w64-x86_64-gdb
```

32비트용:

```js
pacman -S mingw-w64-i686-gdb
```

# 단계 5: MSYS2에 설치 확인하기

<div class="content-ad"></div>

GCC 및 GDB를 설치한 후 MSYS2에서 성공적으로 설치되었는지 확인하려면 버전을 확인하세요:

```js
gcc --version
g++ --version
gdb --version
```

# 단계 6: 경로 환경 변수 설정

명령 프롬프트에서 설치된 도구를 전역적으로 접근할 수 있도록 하려면 시스템의 PATH 환경 변수에 MSYS2 이진 디렉토리를 추가하십시오. 그 작업을 수행하려면-

<div class="content-ad"></div>

## 6.1. MSYS2 MINGW64 바이너리 위치 찾기

mingw64 바이너리 폴더(bin)의 경로를 찾아 복사하세요. 일반적으로 MSYS2를 설치한 위치에 있습니다. 대개 C 드라이브에 위치해 있습니다.

샘플 경로:

```js
C:\msys64\mingw64\bin
```

<div class="content-ad"></div>

## 6.2. 환경 변수 편집 패널 열기

시작 메뉴를 열고 '당신의 계정을 위한 환경 변수 편집'을 검색하세요. 열어주세요.

![이미지](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_3.png)

## 6.3. 환경 변수 버튼 클릭

<div class="content-ad"></div>

환경 변수를 편집하려면 환경 변수 버튼을 클릭하세요.

![이미지](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_4.png)

## 6.4. PATH 변수 편집

시스템 변수 탭에서 Path를 선택한 다음 편집 버튼을 클릭하세요.

<div class="content-ad"></div>

![그림](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_5.png)

## 6.5. 복사한 경로 추가하기

새로 만들기를 클릭합니다. 복사한 경로 (C:\msys64\mingw64\bin)를 붙여넣습니다.

![그림](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_6.png)

<div class="content-ad"></div>

이제 열린 창의 OK 버튼을 클릭해주세요.

## 6.6. Windows에서 설치 확인

PowerShell 또는 Windows 터미널 창을 열고 다음 명령을 실행해주세요:

```js
gcc --version
g++ --version
gdb --version
```

<div class="content-ad"></div>

모든 단계를 제대로 따르셨다면, 버전 정보를 설명하는 출력물이 나타날 것입니다.

![이미지](/assets/img/2024-06-23-HowtoInstallGCCandGDBonWindowsUsingMSYS2Tutorial_7.png)

모든 준비가 완료되었습니다! 이제 윈도우 기기에서 GCC와 GDB를 사용할 준비가 되었습니다.