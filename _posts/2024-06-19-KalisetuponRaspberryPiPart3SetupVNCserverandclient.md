---
title: "라즈베리 파이에 Kali 설정하기 파트 3, VNC 서버 및 클라이언트 설정하기"
description: ""
coverImage: "/assets/img/2024-06-19-KalisetuponRaspberryPiPart3SetupVNCserverandclient_0.png"
date: 2024-06-19 06:18
ogImage: 
  url: /assets/img/2024-06-19-KalisetuponRaspberryPiPart3SetupVNCserverandclient_0.png
tag: Tech
originalTitle: "Kali setup on Raspberry Pi: Part 3, Setup VNC server and client"
link: "https://medium.com/@VarshaChahal/kali-setup-on-raspberry-pi-part-3-setup-vnc-server-and-client-18a3f55776de"
---


x11vnc 서버와 RealVNC 뷰어 클라이언트를 사용했어요.
Kali에 VNC 서버를 설치하려면 다음 명령어를 실행하세요,

```js
sudo apt install x11vnc
```

다음으로, VNC 서버를 위한 암호를 생성하고 다음 명령어를 실행하여 /etc/vncserver.pass 파일에 저장할 거에요,

```js
sudo x11vnc -storepasswd
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-KalisetuponRaspberryPiPart3SetupVNCserverandclient_0.png" />

만일 VNC 서버를 systemd 서비스로 실행하고 관리하려면, /etc/systemd/system/ 디렉토리 아래에서 해당 서비스를 정의할 수 있습니다. 이를 통해 Linux 운영 체제를 위한 시스템 및 서비스 관리자 인 systemd를 사용하여 VNC 서버를 쉽게 관리하고 구성할 수 있습니다.
다음 명령을 실행하여 서비스를 만듭니다.

```js
sudo nano /etc/systemd/system/vncserver.service
```

아래 스크립트를 vncserver.service 파일에 붙여넣으세요:

<div class="content-ad"></div>


[Unit]
Description=start vnc at boot
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/x11vnc -display :0 -auth guess -forever -loop -noxdamage -repeat -rfbauth /etc/vncserver.pass -rfbport 5900 -shared

[Install]
WantedBy=multi-user.target


“After=multi-user.target”는 서비스가 활성화된 모든 서비스 이후에 실행되도록합니다. 이것은 시스템이 비그래픽 다중 사용자 세션을 수용할 준비가 된 상태를 나타냅니다. 

/boot/config.txt 파일에서 다음 플래그를 주석 처리 해제하세요.


framebuffer_width=1280
framebuffer_height=720
hdmi_force_hotplug=1


<div class="content-ad"></div>

framebuffer_width과 framebuffer_height는 디스플레이 해상도를 조절하는 데 사용됩니다.
hdmi_force_hotplug=1은 HDMI 모니터가 감지되지 않아도 HDMI 모드를 활성화하는 데 사용됩니다.

다음 명령을 실행하여 VNC 서버를 시작하세요.

```js
sudo systemctl enable vncserver
sudo systemctl start vncserver
```

다음 명령으로 VNC 서버 상태를 확인하세요.

<div class="content-ad"></div>

```js
systemctl status vncserver
```

현재 VNC 서버가 실행 중이며 기본적으로 포트 5900을 사용하고 있습니다.

이제 VNC 서버가 가동 중이므로 클라이언트를 준비해봅시다.
여러 가지 클라이언트가 있지만, 저는 RealVNC를 사용하고 있습니다. 다음 링크에서 다운로드할 수 있습니다: [https://www.realvnc.com/en/connect/download/viewer/](https://www.realvnc.com/en/connect/download/viewer/)

설치가 완료되면 "File"을 클릭한 후 "New Connection"을 클릭하여 새로운 VNC 연결을 만들어보세요. 다음과 같은 창이 표시될 것입니다,

<div class="content-ad"></div>


![](/assets/img/2024-06-19-KalisetuponRaspberryPiPart3SetupVNCserverandclient_1.png)

VNC 서버 IP 주소 또는 호스트명을 입력해주세요. 원하는대로 다른 설정도 사용자 정의할 수 있어요.
"확인"을 클릭하면 연결이 주소록에 나열되어 있을 거에요.
연결을 두 번 클릭하면 연결이 암호화되지 않았다는 대화 상자가 나타날 거에요.

![](/assets/img/2024-06-19-KalisetuponRaspberryPiPart3SetupVNCserverandclient_2.png)

나중에 VNC 서버와의 암호화된 연결을 수립하기 위해 SSH 터널을 설정하겠어요. 그 전에 VNC 연결이 성공적으로 설정되었는지 테스트해볼게요. "계속"을 클릭하고, 이전에 구성한 VNC 서버 암호를 제공해주세요. 이제 그래픽 사용자 인터페이스(GUI)를 통해 Kali 상자에 액세스할 수 있어야 해요.


<div class="content-ad"></div>

만약 VNC 뷰어 창에서 검은 화면이 나타나면, 라즈베리 파이의 해상도 설정을 조정해야 할 수도 있습니다. Kali 상자에 미리 설치된 kalipi-config을 사용하여 라즈베리 파이의 디스플레이 설정과 VNC 뷰어의 설정을 호환되도록 조정할 수 있습니다.
디스플레이 설정을 구성하려면 다음을 실행하세요:

```bash
sudo kalipi-config
```

그러면 다음과 같은 대화 상자가 표시됩니다,

![dialog box](/assets/img/2024-06-19-KalisetuponRaspberryPiPart3SetupVNCserverandclient_3.png)

<div class="content-ad"></div>

"“고급 옵션” 섹션으로 이동하여 해상도 설정을 귀하의 요구에 맞게 구성하세요.
구성을 수정한 후 시스템을 재부팅하겠느냐는 질문이 표시될 것입니다. "예"를 선택하세요.

Kali가 재부팅될 때까지 기다리세요. 그런 다음 SSH를 통해 Kali에 연결하고 VNC 서버 상태를 확인하여 장치와 함께 부팅되었는지 확인하세요. RealVNC에서 Kali 상자에 연결을 시도하면 이제 GUI 인터페이스를 볼 수 있어야 합니다.

이제 GUI를 통해 원격으로 Kali 상자를 관리할 수 있습니다.

VNC 트래픽은 기본적으로 암호화되어 있지 않습니다. 데이터의 개인 정보보호와 안전을 보장하기 위해 VNC를 사용할 때 SSH 터널을 설정하는 것이 좋습니다. VNC 연결을 보호하기 위해 SSH 터널을 설정하는 방법은 다음 시리즈에서 확인할 수 있습니다."