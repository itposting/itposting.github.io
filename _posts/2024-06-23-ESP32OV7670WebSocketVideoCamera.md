---
title: "ESP32OV7670  WebSocket 비디오 카메라 설정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_0.png"
date: 2024-06-23 17:41
ogImage: 
  url: /assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_0.png
tag: Tech
originalTitle: "ESP32+OV7670 — WebSocket Video Camera"
link: "https://medium.com/@mudassar.tamboli/esp32-ov7670-websocket-video-camera-26c35aedcc64"
---


# 소개

지난 몇 주 동안 OV7670에서 첫 의미 있는 명확한 이미지를 얻으려고 노력했습니다. 그리고 오늘, 드디어 소규모 감시 비디오 카메라를 만들었습니다. OV7670은 온라인에서 가장 저렴한 카메라 모듈입니다. 그래서 실험해볼 첫 번째 선택이었습니다. 사실, 작은 감시 비디오 카메라를 만드는 데 더 관심이 있었습니다. OV7670의 해상도는 0.3mp 이므로 HD 품질을 기대하고 있지는 않았습니다 :). 하지만 0.3mp 해상도에서 물체/사람 또는 움직임을 구분할 수 있다면 그것만으로도 충분히 좋을 것 같았습니다. 이 프로젝트를 진행하면서 많은 어려움을 인지하고 있었습니다. 그래서 이를 목표로 나열해 봅시다.

# 목표

- 저렴한 카메라 모듈 사용
- WiFi에 연결할 수 있는 능력
- PC 및 스마트폰에서 비디오 스트림 보기 가능
- 플랫폼에 독립적인 표시 소프트웨어
- 저전력 소모. 배터리 사용 가능
- 휴대용
- 쉽게 구성 가능

<div class="content-ad"></div>

# 마이크로컨트롤러

라즈베리 파이

카메라 프로젝트를 위해 라즈베리 파이가 가장 인기 있는 선택이 됩니다. RAM이 많고 우수한 CPU를 가지고 있습니다. 그러나 설정을 완료하기 위해 추가로 SD 카드, 와이파이 동글(라즈베리 파이 2)과 같은 액세서리가 필요합니다. 이는 비용을 늘려서 좀 더 비싸지게 만듭니다. 저는 더 저렴한 대안이 필요했습니다.

아두이노 우노

<div class="content-ad"></div>

아두이노 Uno를 실험해 보았어요. 하드웨어에서 이미지를 가져오는 것은 복잡한 작업이에요. Ethernet Shield가 없으면 캡처된 프레임을 SD 카드에 먼저 쓰고 Serial 포트를 통해 전송해야 해요... 그러면 비디오를 만들기에는 너무 느려요. 또한 8MHZ에서 이미지를 가져오는 것도 조심스러워요.

ESP32

ESP32는 제 상황에 매우 유망해 보였어요. CPU는 카메라 클럭 (XCLK)인 10MHZ 이상의 클럭 신호를 제공하기에 충분히 빠르고, QQVGA(160x120x2)의 전체 프레임을 캡처하기에 충분한 RAM을 가지고 있어요. 또한 Wifi 기능을 갖추고 있어요.

ESP32에서 OV7670을 사용하는 우수한 라이브러리를 제공하는 http://bitluni.net/esp32-i2s-camera-ov7670/를 발견했어요.

<div class="content-ad"></div>

하지만 비디오 기능이 없으며 메모리 제약으로 320x240 프레임을 지원하지 않습니다.

OV7670+ESP32 회로 인터페이스 및 라이브러리 구현에 대한 세부 정보는 다루지 않겠습니다. 대신 열악한 연속 이미지 촬영에서 캡처된 이미지로 비디오 스트림을 어떻게 만들 수 있는지에 초점을 맞출 거에요.

# 비디오 스트리밍 사전 준비 사항

- 비디오 스트리밍에는 캡처된 이미지 프레임의 고속 전송이 필요할 것입니다.

<div class="content-ad"></div>

2. 지연 시간을 낮추려면 데이터 전송은 비동기적이어야 합니다.

3. 데이터는 FIFO 방식으로 표시 장치에 도달해야 합니다.

4. 화면 장치는 깜박임을 방지하기 위해 변경된 픽셀을 매우 빨리 새로고쳐야 합니다.

# 웹소켓

<div class="content-ad"></div>

- 웹소켓은 실시간으로 데이터를 전송할 수 있어서 오버헤드가 낮습니다.
- 클라이언트나 서버는 서로 기다릴 필요 없이 대화를 시작할 수 있습니다.
- 텍스트와 바이너리 데이터 전송을 지원합니다. 이는 사용자 정의 명령 및 바이너리 이미지를 교환하는 데 도움이 됩니다.
- 통신 암호화도 가능합니다.

# HTML5 캔버스

- HTML5 캔버스를 통해 화소 조작을 통해 HTML 웹 페이지에서 이미지를 표시하고 직접 업데이트할 수 있습니다.
- 캔버스는 연결된 ImageData 객체를 가진 HTML 요소입니다.
- ImageData의 화소 조작은 HTML 캔버스에 변경 사항을 반영합니다.

# 웹소켓을 사용한 비디오 스트리밍 알고리즘

<div class="content-ad"></div>

- 브라우저 클라이언트와 ESP32 간에 웹소켓 연결을 설정합니다.
- 브라우저가 "start" 메시지를 ESP32로 보냅니다. 시작 메시지에는 이미지 해상도 유형인 80x60, 160x120 또는 320x240가 포함됩니다.
- ESP32는 프레임을 캡처하고 webSocket.sendBIN을 사용하여 브라우저로 보냅니다. 이미지 형식은 RGB565입니다. 따라서 전체 프레임 크기는 (픽셀 당 프레임 크기) X 2바이트입니다. 이 솔루션에서는 160x120x2 바이트(QQVGA) 크기의 프레임을 수용할 수 있는 메모리가 할당됩니다.
- 320x240 해상도의 경우 프레임이 2번 캡처됩니다. 첫 번째 캡처에서는 프레임의 전반부가 전송되고, 두 번째 캡처에서는 나머지 부분이 웹소켓을 통해 전송됩니다. 부분적인 프레임 순서에 대해 브라우저에 알리기 위해 시작 플래그와 종료 플래그가 사용됩니다.
- 종료 플래그를 수신한 후, 브라우저가 다음 프레임을 요청하기 위해 ESP32에 요청합니다. ESP32는 단계 3과 같이 계속됩니다.

# 구현 세부사항

- ESP32를 5V 전원에 연결합니다. ESP32가 부팅되고 액세스 포인트 및 워크 스테이션으로 자신을 구성합니다. 제공된 옵션 중 가장 좋은 Wi-Fi 네트워크에 연결합니다.
- PC/스마트폰을 Esp32AP 액세스 포인트에 연결합니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_0.png" />

3. Open Google Chrome browser and type 192.168.4.1.

QQ-VGA (120x160) is the default display canvas.

<img src="/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_1.png" />


<div class="content-ad"></div>

4. ESP32는 웹 서버 역할을 하며, 웹 페이지를 제공하여 JavaScript 프로그램을 포함하고 있습니다. 이 프로그램은 웹 소켓을 통해 ESP32에 연결하고 바이너리 이미지 데이터를 캡처하여 HTML5 캔버스에 표시합니다.

웹 소켓이 열릴 때 ESP32에서 Wi-Fi Station IP 주소가 제공됩니다. ESP32는 스테이션 IP 주소를 웹 클라이언트에 보냅니다.

따라서 카메라에는 두 개의 IP가 있을 수 있습니다. AP를 생성할 때 고정된 192.168.4.1과 ESP32가 다른 Wi-Fi 네트워크에 연결할 때 라우터에서 할당한 스테이션 IP가 있습니다.

웹 소켓 클라이언트는 웹 브라우저입니다. 따라서 표시 장치는 크로스 플랫폼입니다. PC와 HTML5 캔버스를 지원하는 스마트폰에서 볼 수 있습니다. 아래 코드는 웹 클라이언트가 웹 소켓을 처리하는 방법을 보여줍니다.

<div class="content-ad"></div>

마침내 HTML 캔버스가 픽셀 조작을 통해 이진 데이터를 표시하는 방법을 확인해 봅시다. 캡처 형식은 RGB565입니다. 따라서 각 픽셀은 16비트로 표시됩니다. RGB565은 픽셀을 조작하기 전에 RGB888 형식으로 변환됩니다.

![이미지](/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_2.png)

5. 이제 Wifi 인터넷 네트워크로 전환해 봅시다.

비디오는 80x60(QQQ-VGA), 160x120(QQ-VGA), 320x240(Q-VGA)입니다.

<div class="content-ad"></div>


![ESP32OV7670WebSocketVideoCamera_3](/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_3.png)

# Screenshot from Android Phone

![ESP32OV7670WebSocketVideoCamera_4](/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_4.png)

# PCB Board


<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-ESP32OV7670WebSocketVideoCamera_5.png" />

# 비디오 데모

이 글에서는 모든 목표를 달성했습니다. 저렴한 하드웨어, 크로스 플랫폼 디스플레이 장치(웹 브라우저), 웹 소켓을 통한 빠른 비동기 데이터 전송, 와이파이 연결, 사용 편의성 및 휴대성을 구현했습니다.