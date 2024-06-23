---
title: "포트 포워딩 없이 어디서든 라즈베리 파이에 원격 접속하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-AccessRaspberryPiRemotelyFromAnywhereWithoutPortForwarding_0.png"
date: 2024-06-23 18:17
ogImage: 
  url: /assets/img/2024-06-23-AccessRaspberryPiRemotelyFromAnywhereWithoutPortForwarding_0.png
tag: Tech
originalTitle: "Access Raspberry Pi Remotely From Anywhere Without Port Forwarding"
link: "https://medium.com/@ganeshvelrajan/access-raspberry-pi-remotely-from-anywhere-403074333249"
---


<img src="/assets/img/2024-06-23-AccessRaspberryPiRemotelyFromAnywhereWithoutPortForwarding_0.png" />

안녕하세요! 이 블로그에서는 포트 포워딩 없이 인터넷을 통해 어디서나 안전하게 Raspberry Pi나 IoT 장치에 원격으로 연결하는 방법에 대해 알아보겠습니다. 이를 통해 장치를 더 효과적으로 원격으로 관리할 수 있습니다.

Raspberry Pi는 인기 있는 싱글 보드 컴퓨터(SBC)로 다양한 프로젝트에 적합한 소형, 저전력 장치입니다.

하지만 제대로 관리되지 않으면 이러한 장치는 부담이 될 수 있고 고객 이탈을 야기하여 수익 손실로 이어질 수 있습니다.

<div class="content-ad"></div>

NAT 라우터나 방화벽을 통한 포트 포워딩은 외부 네트워크에서 인터넷을 통해 라즈베리 파이에 원격으로 액세스하는 것에 안전하지 않은 방법입니다. 포트 스캐너와 해커들이 당신의 라즈베리 파이나 IoT 디바이스에 접근할 수도 있습니다.

이 글에서는 다음을 설정하지 않고 원격 액세스를 위한 라즈베리 파이를 구성하는 방법을 설명하겠습니다:

- 포트 포워딩 없이 인터넷을 통해 SSH를 이용한 라즈베리 파이 원격 액세스
- 포트 포워딩 없이 VNC를 이용한 라즈베리 파이 GUI 데스크톱 원격 액세스
- 포트 포워딩 없이 RDP를 이용한 라즈베리 파이 GUI 데스크톱 원격 액세스
- 포트 포워딩 없이 웹 애플리케이션을 통한 라즈베리 파이 원격 액세스
- 포트 포워딩 없이 라즈베리 파이에 원격으로 명령어 실행
- 포트 포워딩 없이 라즈베리 파이에 원격으로 명령어 실행

우리는 SocketXP IoT 관리 및 원격 액세스 플랫폼을 사용하여 포트 포워딩 없이 인터넷을 통해 라즈베리 파이에 원격으로 연결할 것입니다.

<div class="content-ad"></div>

SocketXP를 사용하면 NAT 라우터 및 방화벽 뒤에 있는 Raspberry Pi에 대해 외부 네트워크(인터넷과 같은)에서 원격으로 연결할 수 있어요.

# SocketXP란

SocketXP는 Raspberry Pi, Nvidia Jetson 또는 IoT 기기와 같은 임베디드 리눅스 장치를 인터넷을 통해 엑세스, 관리 및 디버그할 수 있도록 하는 클라우드 기반 안전한 원격 액세스 솔루션입니다. SocketXP는 안전한 SSL/TLS 연결을 통해 Raspberry Pi에 안전한 원격 액세스를 제공해요.

SocketXP 솔루션을 작동시키려면 집이나 사무실 라우터에서 구성 변경이 필요하지 않아요. 공용 IP가 필요하지 않아요.

<div class="content-ad"></div>

그냥 상자에서 작동합니다.

SocketXP는 SSL/TLS 역방향 프록시 터널을 만들어 원격 장치에 안전하게 연결합니다.

SocketXP는 라즈베리 파이에 원격 액세스를 제공하기 위해 포트 포워딩 기술이나 다이내믹 DNS(DDNS)와 같은 보안이 취약한 방법을 사용하지 않습니다.

SocketXP는 안정된 원격 액세스를 제공하기 위해 전 세계 수천 명의 고객에게 신뢰받는 기업용 IoT 원격 액세스 및 관리 플랫폼입니다.네트워크 외부의 어디에서나 인터넷을 통해 라즈베리 파이에 안전하게 원격 액세스할 수 있습니다.

<div class="content-ad"></div>

시작해 봅시다.

## 1. NAT 라우터 또는 방화벽 뒤에 있는 Raspberry Pi에 SSH를 사용하여 인터넷을 통해 원격으로 연결하기

**Secure Shell (SSH)**는 인터넷과 같은 보안되지 않은 네트워크를 통해 라즈베리 파이의 터미널에 안전하게 연결할 수 있는 네트워크 프로토콜입니다.

SSH는 클라이언트 서버 모델을 따릅니다. SSH 서버는 라즈베리 파이에서 실행되고 SSH 클라이언트는 사용자 노트북이나 PC에서 실행됩니다. SSH 서버는 기본적으로 TCP 포트 22에서 수신 대기합니다.

<div class="content-ad"></div>

OpenSSH은 SSH 서버 및 클라이언트 소프트웨어의 오픈 소스 구현을 제공합니다.

참고: 라즈베리 파이에는 SSH 서버 소프트웨어가 설치되어 있습니다.

SSH 클라이언트는 SSH 서버가 실행되는 기기의 IP 주소를 알아야하므로 해당 기기에 연결할 수 있습니다.

인터넷에서 라즈베리 파이의 터미널에 SSH를 통해 원격으로 연결하려면 NAT 라우터와 방화벽 뒤에 설치된 라즈베리 파이 장치는 인터넷에서 액세스할 수 없습니다. SocketXP 라즈베리 파이 원격 액세스 솔루션을 사용하여 어디서든 인터넷을 통해 라즈베리 파이 터미널에 원격으로 연결할 수 있습니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-AccessRaspberryPiRemotelyFromAnywhereWithoutPortForwarding_1.png)

자세한 내용을 알아보려면 인터넷을 통해 Raspberry Pi에 대한 원격 SSH 액세스를 설정하고 구성하는 방법을 참조하십시오.

# 2. VNC를 사용하여 인터넷을 통해 Raspberry Pi에 원격으로 연결하기

가상 네트워크 연결(VNC)은 Raspberry Pi의 그래픽 사용자 인터페이스(GUI) 또는 데스크톱에 안전하게 액세스하는 프로토콜입니다. VNC는 일반적으로 Raspberry Pi와 같은 Linux 기반 플랫폼의 GUI에 원격으로 액세스하는 데 사용됩니다.

<div class="content-ad"></div>

VNC은 클라이언트 서버 모델을 따릅니다. VNC 서버는 라즈베리 파이에서 실행되고 VNC 클라이언트는 사용자 노트북이나 PC에서 실행됩니다. VNC 서버는 기본적으로 TCP 포트 5901에서 수신 대기합니다.

TightVNC은 라즈베리 파이에 설치할 수 있는 오픈 소스 기반 VNC 소프트웨어입니다. 원격 데스크톱 액세스를 위해 사용됩니다.

인터넷에서 어디에서나 VNC를 통해 라즈베리 파이 GUI 데스크톱에 원격으로 연결하려면 네트워크 주소 변환 라우터(NAT router)와 방화벽 뒤에 설치된 라즈베리 파이 장치에 대한 액세스를 SocketXP 라즈베리 파이 원격 액세스 솔루션을 사용하여 실행해야 합니다.

![이미지](/assets/img/2024-06-23-AccessRaspberryPiRemotelyFromAnywhereWithoutPortForwarding_2.png)

<div class="content-ad"></div>

아래와 같이 참조하세요: Raspberry Pi를 인터넷을 통해 원격 VNC 접속을 설정하고 구성하는 방법에 대해 알아보세요.

# 3. xrdp를 사용하여 인터넷을 통해 Raspberry Pi 원격 데스크톱(RDP)에 연결하기

원격 데스크톱 프로토콜(RDP)은 마이크로소프트에서 발명한 프로토콜로, 지역 네트워크에서 한 Windows 기기의 Windows 데스크톱에 다른 Windows 기기에서 액세스하는 데 사용됩니다.

RDP는 클라이언트-서버 모델을 따릅니다 - RDP 서버는 라즈베리 파이에서 실행되며 RDP 클라이언트는 사용자의 노트북이나 PC에서 실행됩니다. RDP 서버는 기본적으로 TCP 포트 3389에서 수신 대기합니다.

<div class="content-ad"></div>

마이크로소프트가 타사가 동일한 것을 구현할 수 있도록 RDP를 개방했습니다. xrdp는 Microsoft RDP의 오픈 소스 구현입니다. xrdp는 주로 라즈베리 파이와 같은 리눅스 기반 플랫폼의 GUI 데스크톱에 원격으로 접속하는 데 사용됩니다.

인터넷에서 Raspberry Pi 장치에 액세스 할 수 없는 NAT 라우터 및 방화벽 뒤에 설치된 경우, SocketXP Raspberry Pi 원격 액세스 솔루션을 사용하여 어디에서나 인터넷을 통해 xrdp를 사용하여 Raspberry Pi GUI 데스크톱에 원격으로 연결할 수 있습니다.

자세한 내용은 다음을 참조하십시오: xrdp를 사용하여 인터넷을 통한 라즈베리 파이 원격 데스크톱 액세스 설정 및 구성 방법

<div class="content-ad"></div>

# 4. 웹 앱을 사용하여 NAT 라우터 또는 방화벽 뒤에 있는 Raspberry Pi 원격 제어하기

라즈베리 파이에 IoT 웹 애플리케이션을 설치하고 실행하면 웹 클라이언트를 사용하여 Raspberry Pi에 원격으로 연결하고 제어할 수 있습니다.

예를 들어, 간단한 파이썬 Flask 웹 서버 애플리케이션을 작성하여 원격으로 파일에 액세스할 수 있습니다. 이미지, 웹캠에서 비디오, 구성 파일, 로그 파일 등을 가져올 수 있습니다.

```js
$ cat get_files.py
from flask import Flask, send_from_directory

app = Flask(__name__) @app.route('/')

def send_report(path):
    return send_from_directory('/', path)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)
```

<div class="content-ad"></div>

라즈베리 파이에서 실행 중인 웹 서버 애플리케이션에 로컬 네트워크에서 웹 브라우저를 사용하여 액세스할 수 있습니다. http://localhost:3000 주소로 브라우저를 열어보세요.

다만, NAT 라우터와 방화벽 뒤에 설치된 라즈베리 파이는 인터넷에서 액세스할 수 없습니다.

SocketXP 라즈베리 파이 원격 액세스 솔루션을 사용하여 어디서나 인터넷을 통해 파이썬 플라스크 웹 서버 애플리케이션에 원격으로 연결할 수 있습니다.

SocketXP는 라즈베리 파이에서 실행 중인 로컬 웹 앱을 위한 안전한 공개 웹 URL(HTTPS)을 생성합니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 변경되었습니다.


![Raspberry Pi Remote Access](/assets/img/2024-06-23-AccessRaspberryPiRemotelyFromAnywhereWithoutPortForwarding_4.png)

To learn more, refer to: [how to remote access Raspberry Pi web app over the internet]

## 5. Send Remote Commands to Raspberry Pi over the Internet from Outside Network

Remote Command Execution: the ability to send one-off shell commands to your Raspberry Pi to quickly fetch crucial information or take some corrective action on your remote Raspberry Pi is immensely important.


<div class="content-ad"></div>

라즈베리 파이에 항상 로그인하고 명령이나 프로그램을 실행하기 위해 로그인과 비밀번호를 사용하는 것은 번거로울 수 있습니다.

특히 라즈베리 파이 편대에 동일한 스크립트나 명령을 실행해야 하는 경우 더욱 귀찮아집니다.

SocketXP 라즈베리 파이 원격 액세스 솔루션을 통해 인터넷을 통해 하나의 라즈베리 파이나 라즈베리 파이 편대에 대해 원격으로 셸 스크립트, 명령 또는 Python 프로그램을 실행할 수 있습니다.

자세한 내용은 인터넷을 통한 원격 명령 실행을 위해 라즈베리 파이를 설정하고 구성하는 방법을 참조하세요.

<div class="content-ad"></div>

# 결론:

이 글에서는 SSH, VNC, RDP, 웹 앱 및 원격 명령 실행을 사용하여 포트 포워딩 없이 어디서든 Raspberry Pi에 원격으로 액세스할 수 있는 5가지 다양한 옵션을 살펴보았습니다.

또한 SocketXP의 Raspberry Pi 원격 액세스 솔루션이 포트 포워딩을 활성화하지 않고 Raspberry Pi 기기를 원격으로 관리하고 제어하는 안전하고 강력하며 편리한 방법을 제공한다는 것에 대해 논의했습니다.

사용하기 쉬운 인터페이스, 고급 기능 및 타의 추종을 불허하는 유연성을 갖춘 이 혁신적인 솔루션은 Raspberry Pi 애호가에게 꼭 필요한 도구입니다.

<div class="content-ad"></div>

이 절삭 즉석 솔루션을 활용하고 Raspberry Pi 장치의 모든 잠재력을 발휘해보세요. 어디에서나 Raspberry Pi 프로젝트를 제어할 수 있는 SocketXP의 Raspberry Pi 원격 액세스 솔루션을 시도해보세요.

원문은 https://www.socketxp.com/iot/access-raspberry-pi-remotely-over-the-internet/에서 확인하실 수 있습니다.