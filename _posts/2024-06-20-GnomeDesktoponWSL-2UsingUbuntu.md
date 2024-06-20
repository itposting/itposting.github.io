---
title: "WSL-2에서 Ubuntu를 사용하여 Gnome 데스크톱 설정하기"
description: ""
coverImage: "/assets/img/2024-06-20-GnomeDesktoponWSL-2UsingUbuntu_0.png"
date: 2024-06-20 14:39
ogImage: 
  url: /assets/img/2024-06-20-GnomeDesktoponWSL-2UsingUbuntu_0.png
tag: Tech
originalTitle: "Gnome Desktop on WSL-2 Using Ubuntu"
link: "https://medium.com/@avivarma1/gnome-desktop-on-wsl-2-using-ubuntu-db77635ed2aa"
---


<img src="/assets/img/2024-06-20-GnomeDesktoponWSL-2UsingUbuntu_0.png" />

이전에는 WSL-2에서 SystemD를 활성화한 Debain을 설정하는 방법을 보여드렸습니다. 이번에는 한 발짝 더 나아가 GNOME 데스크톱을 설치하고 WSL2 VM을 완전한 GUI로 사용해 봅시다!

- 우선 다음 명령어를 사용하여 WSL2에 Ubuntu를 설치해 보세요: wsl --install -d ubuntu
- Ubuntu를 설정한 후에는 다음 명령어를 실행하세요:

```js
sudo apt update
sudo apt-mark hold acpid acpi-support
sudo apt upgrade
```

<div class="content-ad"></div>

- 이제 유용한 systemd 설정 스크립트를 실행하여 WSL 내에서 systemd 환경을 설정할 수 있습니다. 이 스크립트는 필요한 패키지를 설치하고 스크립트를 복사하여 sudoers를 구성하며 bash.bashrc를 수정하고 Windows에서 환경 변수를 설정하여 WSL 내에서 systemd를 사용할 수 있게 합니다. 이를 통해 WSL 내에서 서비스 및 기타 기능을 활성화할 수 있습니다. 기본 이닛 시스템에서는 사용할 수 없는 기능들을 사용할 수 있습니다.

```js
cd ~
git clone https://github.com/DamionGans/ubuntu-wsl2-systemd-script.git
cd ubuntu-wsl2-systemd-script/
./ubuntu-wsl2-systemd-script.sh
```

- 이제 WSL을 종료하고 powershell이나 cmd 터미널에서 다음 명령을 실행하여 WSL을 다시 시작하고 업데이트할 수 있습니다:

```js
wsl.exe -d ubuntu --shutdown
wsl.exe -d ubuntu
```

<div class="content-ad"></div>

- WSL에서 Ubuntu 명령줄에 다시 돌아오면 다음 환경 변수를 내보냅니다:

```js
export DISPLAY="$(ip route | awk '{print $3; exit}')":0;
export XDG_CONFIG_HOME=$HOME/.config
export XDG_CONFIG_DIRS=/etc/xdg/xdg-ubuntu:/etc/xdg
export XDG_SESSION_DESKTOP=ubuntu
export XDG_SESSION_TYPE=x11
export XDG_CURRENT_DESKTOP=ubuntu:GNOME
export XDG_SESSION_CLASS=user
export XDG_DATA_DIRS=/usr/share/ubuntu:/usr/local/share/:/usr/share/:/var/lib/snapd/desktop
export GNOME_SHELL_SESSION_MODE=ubuntu
export XDG_RUNTIME_DIR="/run/user/1000"
```

- 이제 다음 명령을 실행합니다:

```js
sudo mkdir -p /run/user/1000
sudo chmod 700 /run/user/1000
sudo chown $(whoami): /run/user/1000
```

<div class="content-ad"></div>

- 모든 설정이 완료되었으니 이제 GNOME 데스크톱을 설치해봅시다:

```js
sudo apt install ubuntu-desktop gnome
```

- https://sourceforge.net/projects/vcxsrv/ 에서 VcXsrv Windows X Server를 다운로드하세요. 저는 1.20.14.0 버전을 사용 중입니다. Windows에서 설치하세요.
- Windows에서 XLaunch를 실행하여 VcXsrv를 시작하세요 (이미 실행 중인 VcXsrv가 있을 경우 종료하세요. VcXsrv의 설정이 중요합니다). 첫 번째 페이지에서 "Fullscreen"을 선택하세요. 세 번째 페이지의 "VcXsrv의 추가 매개변수" 필드에 -ac -wgl -dpms를 입력하세요.

![이미지](/assets/img/2024-06-20-GnomeDesktoponWSL-2UsingUbuntu_1.png)

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-GnomeDesktoponWSL-2UsingUbuntu_2.png)

VcXsrv를 시작하면 전체 검은 화면이 표시될 수 있습니다. 이는 아직 내용이 채워지지 않은 전체 화면의 효과입니다. Alt-Tab을 눌러 WSL의 Ubuntu 명령줄로 전환할 수 있습니다.

- dbus-launch --exit-with-session gnome-session를 실행합니다.
- 전체 화면 VcXsrv 창으로 이동합니다. 이제 Ubuntu GNOME 데스크톱이 나타날 것입니다. 즐기세요!
- 사용하지 않을 때는 GNOME을 그냥 둘 수 있습니다. 그러나 GNOME을 종료하려면 VcXsrv 창을 닫거나 WSL의 Ubuntu 명령줄에서 Ctrl-C를 누르면 됩니다.

성능이 조금 느릴 수 있습니다. 지금은 GPU 가속화를 활성화하는 방법을 모르겠지만, 이것이 시작점입니다!
