---
title: "라즈베리 파이 제로 W로 WiFi 카메라 직접 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_0.png"
date: 2024-06-22 19:32
ogImage: 
  url: /assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_0.png
tag: Tech
originalTitle: "Building your own WiFi camera with Raspberry Pi Zero W"
link: "https://medium.com/@celecavac/building-your-own-wifi-camera-with-raspberry-pi-zero-w-6d59b494e0c9"
---


넓은 선택지를 가진 소비자용 WiFi 카메라가 있습니다. 아기 모니터나 가정 감시와 같은 용도로는 적합할 수 있지만, 몇 가지 단점이 있습니다. 매우 자주 소유권 애플리케이션을 사용해야 할 수도 있지만 그러한 애플리케이션은 전혀 유지보수되지 않을 수 있고 또한 클라우드 서비스와 통합될 수도 있어 편리하지만 여전히 보안 위험이 될 수 있습니다. 네트워크 구성에 따라 카메라가 전체 인터넷 액세스를 받아 악의적인 행동을 할 수 있습니다.

만약 이러한 사항들이 걱정이 된다면, 그리고 더 높은 수준의 신뢰성을 가진 WiFi 카메라를 원한다면, 대안으로 자체 제작해보는 것도 좋은 경험이 될 수 있습니다. 선택한 하드웨어에 따라 예산을 유지하는 동시에 저렴하고 신뢰할 수 있는 장치를 얻을 수 있습니다. 이 기사에서는 Raspberry Pi Zero W를 사용하여 어떻게 만드는지 보여줄 것입니다. 하지만 이 일반적인 개념은 WiFi를 지원하는 대부분의 Linux 장치에서도 작동할 것입니다.

## 하드웨어 선택

내 설정에서는 Raspberry Pi Zero W와 5MP Raspberry Pi 카메라를 선택했고, 비용은 약 24유로였습니다. 또한 SD 카드와 마이크로 USB 전원 어댑터를 구입했는데, 이것은 추가 9유로였습니다. 주의해야 할 점은 풀 사이즈 Raspberry Pi와 Raspberry Pi Zero에는 다른 CSI 포트가 있으므로 다른 종류의 평평한 케이블이 필요하다는 것입니다. 카메라 모듈을 주문할 때 적절한 종류를 선택해야 합니다. [Link Text](https://www.arducam.com/raspberry-pi-camera-pinout/)

![이미지](/assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_0.png)

<div class="content-ad"></div>

필요에 따라 프리미엄 구성품으로 선택할 수도 있습니다. 목록에 있는 설정은 스트림 처리량과 품질 면에서 놀라운 성능을 제공하지는 않을 거예요.
마지막으로 하드웨어용 케이스도 구입하거나 가장 마음에 드는 3D 모델을 찾아서 인쇄할 수도 있어요.

## OS 설정

기본적으로 리눅스 OS가 실행되어 WiFi에 연결되고 SSH를 통해 로그인할 수 있어야 해요. 이 단계에 도달하기 위해서 https://medium.com/@celecavac/setting-up-a-headless-raspberry-pi-the-hard-way-15e78e644d50 에 방문해보세요.

## RTSP

<div class="content-ad"></div>

이 카메라 설정에서는 실시간 스트리밍 프로토콜(RTSP)을 사용할 것입니다. 과거에는 rtsp-simple-server가 이를 위한 인기 있는 도구였습니다. 현재도 사용 가능하지만 미디어MTX 프로젝트의 일부로 이용할 예정입니다.

이를 실행하기 위해 라즈베리 파이에서 다음 명령을 실행하여 libcamera0 및 libfreetype6 패키지를 설치해야 합니다:

```js
sudo apt update
sudo apt upgrade -y
sudo apt install -y libcamera0 libfreetype6
```

그런 다음 https://github.com/bluenviron/mediamtx/releases 에서 최신 릴리스를 선택할 수 있습니다. 저는 현재 v1.1.1 버전을 선택하여 armv6 변형을 사용했습니다. 나중에 'Illegal instruction' 오류가 발생하면 적합하지 않은 CPU 아키텍처를 사용하여 릴리스를 다운로드했을 가능성이 큽니다.
아카이브를 다운로드하려면 다운로드 링크를 복사하여 `wget url` 명령을 사용할 수 있습니다. 다운로드가 완료되면 명령 `tar -xzf archive-name --one-top-level`를 사용하여 내용을 추출할 수 있습니다. 이 과정은 다음과 비슷해야 합니다:

<div class="content-ad"></div>


![Wi-Fi Camera](/assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_1.png)

생성된 디렉토리의 이름을 변경하고 아카이브를 삭제할 수도 있습니다:

```js
mv mediamtx_v1.1.1_linux_armv6 mediamtx
rm mediamtx_v1.1.1_linux_armv6.tar.gz
```

이 시점에서 우리는 단지 mediamtx.yml 파일을 업데이트하여 Wi-Fi 카메라를 실행할 수 있습니다. 파일을 살펴보고 필요없는 설정 및 프로토콜을 비활성화할 수 있지만, paths: 섹션 하위의 모든 것을 삭제하고 다음을 입력하는 것이 주요 작업입니다:


<div class="content-ad"></div>

```yaml
paths:
  cam:
    source: rpiCamera
    rpiCameraWidth: <width>
    rpiCameraHeight: <height>
```

내 상황에 가장 잘 작동한다는 것을 발견하여 width=1280 및 height=720으로 설정하면 다음과 같이 보입니다:

![image](/assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_2.png)

이제 바이너리를 실행하고 YAML 파일 경로를 제공하여 서버를 시작할 수 있습니다. `./mediamtx mediamtx.yml`

<div class="content-ad"></div>


![](/assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_3.png)

내 네트워크의 다른 모든 기기에서 스트림을 사용할 수 있게 됩니다. 테스트를 위해 ffplay rtsp://`rpi-ip-address`:8554/cam 및 ffplay rtsp://raspberrypi.local:8554/cam을 사용할 수 있습니다. Debian 기반 시스템에서는 sudo apt install ffmpeg을 사용하여 ffplay를 설치할 수 있습니다.

![](/assets/img/2024-06-22-BuildingyourownWiFicamerawithRaspberryPiZeroW_4.png)

## 자동 시작


<div class="content-ad"></div>

현재 설정에서는 Raspberry Pi에 로그인하고 매번 재부팅할 때마다 ./mediamtx mediamtx.yml을 수동으로 실행해야 합니다.
이를 피하기 위해 mediamtx 서비스를 정의하고 RTSP 서버를 자동으로 시작할 수 있습니다.

mediamtx 서비스 파일을 생성하고 아래 내용을 입력하려면 sudo nano /etc/systemd/system/mediamtx.service를 실행할 수 있습니다:

```js
[Unit]
Description=MediaMTX service
Wants=network.target

[Service]
ExecStart=/home/pi/mediamtx/mediamtx /home/pi/mediamtx/mediamtx.yml

[Install]
WantedBy=multi-user.target
```

서비스는 아직 활성화되지 않았으며, 이를 달성하려면 다음 명령을 실행하면 됩니다:

<div class="content-ad"></div>

```js
sudo systemctl daemon-reload
sudo systemctl enable mediamtx.service
```

앞으로 라즈베리 파이를 다시 부팅할 때마다 RTSP 서버가 자동으로 시작됩니다.

## 보안

이제 WiFi 카메라가 사용 가능하며 쉽게 사용할 수 있는 핵심 기능을 갖추고 있습니다. 그러나 누구든지 네트워크에 액세스할 수 있는 경우 완전히 노출됩니다. 인증이 없으며 비디오 스트림이 암호화되지 않은 상태로 전송됩니다.
이 문제를 한 가지 해결책으로 다루기 위해 직접 액세스를 차단하고 모든 것을 SSH 터널을 통해 전송하도록 설정할 수 있습니다. SSH는 이미 활성화되어 있어 연결이 기본적으로 인증되고 암호화됩니다.

<div class="content-ad"></div>

어떤 일을 하기 전에 mediamtx.yml 파일로 돌아가서 # RTSP 설정 섹션을 수정해 봅시다. 여기서는 프로토콜을 [udp, multicast, tcp] 에서 TCP로만 제한하려고 합니다. 따라서 protocols [tcp]로 변경해야 합니다.

RTSP 포트에 대한 액세스를 비활성화하려면 간단히 Uncomplicated Firewall을 설치하고 SSH를 화이트리스트에 추가하고 실행해 봅시다:

```js
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw enable
```

그런 다음 `ffplay rtsp://rpi-ip-address:8554/cam` 또는 `ffplay rtsp://raspberrypi.local:8554/cam` 을 사용하여 스트림에 다시 액세스해 보고 더 이상 액세스할 수 없는지 확인할 수 있습니다.

<div class="content-ad"></div>

SSH 터널을 통해 스트림을 보내려면 라즈베리 파이의 포트를 로컬 머신에 바인딩할 수 있습니다. 동일한 포트 8554를 사용할 수 있지만 필수는 아닙니다. 로컬로 동일한 포트를 사용하는 여러 카메라를 바인딩하려면 다른 포트 번호를 사용하는 것이 더 간단합니다.
원격 포트 8554를 8601로 바인딩하려면 다음 명령을 실행할 수 있습니다: ssh -NL 8601:localhost:8554 pi@raspberrypi.local 또는 ssh -NL 8601:localhost:8554 pi@`라즈베리파이-IP주소`.
어쩌면 각 부팅 시에 이 명령을 자동으로 실행하고 싶을 수도 있습니다. 그렇다면 비슷한 방식으로 Auto-start 섹션에 표시된대로 사용자 지정 서비스 이름을 사용하고 이 명령을 ExecStart= 옆에 추가할 수 있습니다.

명령이 실행 중이면 해당 기기에 포트가 바인딩되어 있어야 합니다. 우리가 이 명령을 실행하는 기기로 ffplay 명령을 직접 라즈베리 파이로 방향 전환하지 않아도 되며 현재 액세스하려는 기기로 직접 전환해야 합니다. 포트 번호도 변경되었음을 유의하세요: ffplay rtsp://localhost:8601/cam

마지막으로, 이것은 당연한 일일 수 있지만, 기본 비밀번호를 사용했다면 비밀번호를 변경해야 합니다. sudo raspi-config를 실행한 다음 System Options로 이동하여 Password로 이동하여 변경할 수 있습니다.