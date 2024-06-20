---
title: "Raspberry Pi 5 비디오 스트림 지연 시간 비교 UDP, TCP, RTSP, 그리고 WebRTC"
description: ""
coverImage: "/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_0.png"
date: 2024-06-19 06:05
ogImage: 
  url: /assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_0.png
tag: Tech
originalTitle: "Raspberry Pi 5 Video Stream Latencies: Comparing UDP, TCP, RTSP, and WebRTC"
link: "https://medium.com/@gektor650/comparing-video-stream-latencies-raspberry-pi-5-camera-v3-a8d5dad2f67b"
---


라즈베리 파이 5를 위한 최적의 라이브 스트리밍 옵션을 발견해보세요. 비디오 라이브 스트림 지연 시간을 테스트하고 목록 중에서 최고를 선택하겠습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_0.png)

라즈베리 파이와 관련된 많은 프로젝트는 "눈", 다시 말해 카메라가 필요합니다. 로봇이나 원격 제어 자동차와 같은 것을 조종하기 위해서죠.

본문에서는 비디오 라이브 스트리밍의 지연 시간을 테스트할 것입니다. 궁극적으로, 우리는 200ms 정도의 지연을 가진 솔루션을 갖게 될 것입니다.

<div class="content-ad"></div>

비디오 형식의 기사를 실시간으로 시청하는 것이 더 좋습니다:

왜 영상 스트림의 레이턴시가 중요한가요?

물론, 그것은 작업에 따라 다릅니다. 창문 밖에있는 새를 녹음한다면 레이턴시는 중요하지 않습니다. 아니면 아름다운 폭포 영상을 시청할 때도요.

그러나 FPV 드론 조종, 레이싱 카, 또는 원격 제어 박싱 로봇을 조정할 때 레이턴시는 중요합니다.

<div class="content-ad"></div>

이 기사는 각 프로토콜이 작동하는 방식이나 이러한 지연이 왜 발생하는지에 대한 내용은 아닙니다.

이 기사는 우리의 옵션을 검토하고 최소한의 산란 없이 구현하는 방법을 살펴볼 것입니다. 심층적인 프로그래밍 지식이 없는 사람도 설정하고 사용할 수 있습니다.

# 하드웨어

하드웨어에 대해 말할 것이 별로 없습니다. 가능한 한 간단합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_1.png)

- 라즈베리 파이 5
- 카메라 케이블
- 카메라 모듈 3 (와이드 에디션)

운영 체제로는 최신 공식 Debian Bookworm 포트를 사용하고 있습니다. 사용자 지정 설정은 없으며 모든 것은 공식 라즈베리 스토어와 라즈베리 파이 이미저에서 찾을 수 있습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_2.png)


<div class="content-ad"></div>

공식 라즈베리 카메라 문서로 시작해서 네트워크 스트림 권장 사항을 시도해 봅시다.

![image](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_3.png)

[라즈베리 파이 카메라 소프트웨어 문서](https://www.raspberrypi.com/documentation/computers/camera_software.html)에 접속해 봅시다.

왼쪽 메뉴에 rpicam-vid 아이템이 있습니다. 해당 항목을 누르면 페이지가 필요한 정보로 스크롤됩니다. '네트워크 스트리밍' 섹션으로 조금 내려가서 UDP 스트림을 시도해 봅시다.

<div class="content-ad"></div>

두 개의 터미널을 사용할 거에요. 하나는 SSH를 통해 라즈베리 파이에 연결하고, 다른 하나는 로컬 머신에서 명령을 실행할 거에요.

# Raspberry PI에서 네이티브 코덱을 사용한 UDP 비디오 스트림

https://www.raspberrypi.com/documentation/computers/camera_software.html#udp

라즈베리 파이에서 스트림을 시작하는 명령어는 다음과 같아요:

<div class="content-ad"></div>

```js
rpicam-vid -t 0 --width 1280 --height 720 --framerate 30 --inline -o udp://노트북_IP_여기에:5555
```

라즈베리 파이의 LAPTOP_IP_HERE를 노트북의 IP 주소로 대체해야 합니다.

포트는 임의로 설정할 수 있습니다. 여기서는 5555를 사용했습니다.

위와 같이 라즈베리 파이가 몇 프레임을 노트북으로 보내주는 것을 볼 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_4.png" />

비디오를 재생하려면 노트북에서 다음 명령어를 실행할 수 있어요:

```js
ffplay udp://RASPBERRY_PI_IP_HERE:5555 -fflags nobuffer -flags low_delay -framedrop
```

이제 성능을 확인해 볼 시간이에요.

<div class="content-ad"></div>

실시간으로 타이머를 기록하고 지역 네트워크를 통해 스트림을 전송하는 카메라가 있습니다.

![image](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_5.png)

UDP 비디오 전송 방식은 3,400밀리초의 지연이 있다는 것을 알 수 있습니다.

큰 지연입니다. 예를 들어, 초속 40마일(약 64킬로미터)로 이동하는 차량은 3.4초 동안 66.49야드(60미터)를 이동합니다.

<div class="content-ad"></div>

여기 축구장에서 66야드가 어떻게 보이는지에 대한 내용이에요. 정말 인상적죠.

![66 yards on a football field](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_6.png)

드론과 같은 고속 장치를 제어할 때 신뢰할 수 있는 것은 아닙니다.

# Raspberry PI 5 TCP 비디오 스트림 네이티브 코덱

<div class="content-ad"></div>

라즈베리 파이에서 스트리밍하는 명령어는 다음과 같습니다:

```js
rpicam-vid -t 0 --width 1280 --height 720 --framerate 30 --inline --listen -o tcp://0.0.0.0:5556
```

라즈베리 파이는 자체 포트(5556으로 설정함)로 스트리밍을 생성하며, 클라이언트는 연결하여 스트림을 받을 수 있습니다.

<div class="content-ad"></div>

보시다시피, 일부 프레임을 보내고 수신자가 스트림을 받을 때까지 멈춰있습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_7.png)

노트북에서 스트림을 표시하려면 다음을 사용할 수 있습니다:

```js
ffplay tcp://라즈베리파이_IP_여기에:5556 -vf "setpts=N/30" -fflags nobuffer -flags low_delay -framedrop
```

<div class="content-ad"></div>

이 TCP 비디오 스트리밍 방법은 UDP보다 훨씬 나은 반초의 지연만 있습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_8.png)

이 지연을 초당 40마일 주행하는 자동차에 적용해보겠습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_9.png)

<div class="content-ad"></div>

5 초 동안, 자동차는 10야드(또는 9미터)만 이동합니다.

# Raspberry PI 5 RTSP 비디오 스트림 네이티브 코덱

이제 RTSP 스트림을 테스트해 보겠습니다.

문서에서 제공된 명령어:

<div class="content-ad"></div>

```js
rpicam-vid -t 0 --inline -o - | cvlc stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8554/stream1}' :demux=h264
```

그리고.....

![image](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_10.png)

...... 네. 작동하지 않아요.

<div class="content-ad"></div>

테이블 태그를 마크다운 형식으로 변경해주세요.

<div class="content-ad"></div>

# Raspberry PI 5에서 libav 코덱(mpegts)을 사용한 TCP 비디오 스트리밍

https://www.raspberrypi.com/documentation/computers/camera_software.html#network-streaming-with-libav

이것은 다른 비디오 코덱이며, 지연에 영향을 줄 수 있습니다.

Raspberry PI에서 실행할 명령어:

<div class="content-ad"></div>

```js
rpicam-vid -t 0 --width 1280 --height 720 --framerate 30 --codec libav --libav-format mpegts --libav-audio -o "tcp://0.0.0.0:1234?listen=1"
```

노트북에서 재생하는 명령어:

```js
ffplay tcp://라즈베리파이IP주소:1234 -vf "setpts=N/30" -fflags nobuffer -flags low_delay -framedrop
```

의외로 LibAv는 큰 딜레이가 있습니다 — 약 10.5초가 됩니다. 기본 코덱과 TCP로는 0.5초였으나, 이제 10.5초가 소요됩니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_11.png)

차량에 적용하면 그 지연 시간으로 인해 차량이 필드 밖으로 멀리 나갈 것을 볼 수 있습니다. 200야드 또는 190미터입니다. 농담이 아닙니다.

![Image](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_12.png)

# Raspberry PI 5 UDP 비디오 스트림과 libav 코덱 (mpegts)


<div class="content-ad"></div>

라즈베리 파이에서 실행해야 하는 명령어:

```js
rpicam-vid -t 0 --width 1280 --height 720 --framerate 30 --codec libav --libav-format mpegts --libav-audio  -o "udp://REPLACE_WITH_LAPTOP_IP:5555"
```

라이플랩을 위한 플레이어:

```js
ffplay tcp://RASPBERRY_PI_IP_HERE:1234 -vf "setpts=N/30" -fflags nobuffer -flags low_delay -framedrop
```

<div class="content-ad"></div>

이제 UDP에 대한 지연 시간은 반으로 줄었습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_13.png)

이 모든 정보를 축구장에 추가합시다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_14.png)

<div class="content-ad"></div>

이 결과들이 정말 이상해요. 원시 코덱을 사용하면 UDP에서는 큰 지연이 있고 TCP에서는 작은 지연이 있었고, LibAV를 사용하면 그 반대로 되었어요.

하지만 여전히 0.5초보다 빠른 속도를 내볼 수 있어요.

# Raspberry PI 5 MediaMTX 설정

마침내, 우리는 Raspberry PI에서 스트림 지연 우승자에 가까워졌어요: MediaMTX입니다. 이 소프트웨어는 이전 비디오에서 언급된 모든 프로토콜과 몇 가지 더 사용하여 스트림을 전송할 수 있어요. 설정부터 시작해봐요.

<div class="content-ad"></div>

설치하려면 정말 간단한 단계를 따라야 해요:

- 먼저 GitHub의 릴리스 페이지를 열어주세요.
- 두 번째로, ARM64 아카이브 링크를 복사해주세요. 적절한 버전을 선택하는 것이 중요해요.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_15.png)

- 세 번째로, Raspberry PI에 해당 폴더를 생성해주세요.

<div class="content-ad"></div>

```sh
mkdir mediamtx && cd mediamtx
```

다음으로, GitHub에서 최신 링크를 찾아 WGET 명령어를 사용하여 다운로드합니다.

```sh
wget https://github.com/bluenviron/mediamtx/releases/download/v1.7.0/mediamtx_v1.7.0_linux_arm64v8.tar.gz
```

그 다음, 동일한 폴더에 압축을 푸세요.

<div class="content-ad"></div>

```js
tar -xvzf mediamtx_v1.7.0_linux_arm64v8.tar.gz
```

- 여섯 번째로, YML 구성 파일을 편집하려면 엽니다.

```js
nano mediamtx.yml
```

- 일곱 번째로, 아래로 스크롤하고 이 구성을 붙여넣습니다.


<div class="content-ad"></div>

```js
cam1:
    runOnInit: bash -c 'rpicam-vid -t 0 --camera 0 --nopreview --codec yuv420 --width 1280 --height 720 --inline --listen -o - | ffmpeg -f rawvideo -pix_fmt yuv420p -s:v 1280x720 -i /dev/stdin -c:v libx264 -preset ultrafast -tune zerolatency -f rtsp rtsp://localhost:$RTSP_PORT/$MTX_PATH'
    runOnInitRestart: yes
```

간단히 말해서, MediaMTX 소프트웨어는 이 명령어를 bash에서 실행할 겁니다.

그 다음 RPICAM-VID 명령어에게 (이전에 다뤘던 것과 동일하게) 스트림을 FFMPEG로 보내도록 요청할 겁니다.

FFMPEG은 그것을 RTSP 프로토콜을 통해 로컬로 MediaMTX로 보낼 겁니다.

<div class="content-ad"></div>

구성을 저장하고 MediaMTX를 실행할 수 있어요.

```js
./mediamtx
```

처음 실행 시 프로토콜 및 사용 가능한 포트에 대한 유용한 정보가 표시될 거예요.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_16.png)

<div class="content-ad"></div>

# Raspberry PI 5 RTSP 비디오 스트림 및 mediaMTX

VLC 플레이어 및 RTSP 스트림으로 시도해 봅시다.

노트북에서 다음 명령을 사용하여 vlc 플레이어를 실행할 수 있습니다:

```js
vlc rtsp://라즈베리파이_IP_주소_여기에:8554/cam1
```

<div class="content-ad"></div>

당신은 개발자이다. 위의 텍스트를 친근하게 한국어로 번역해주시겠어요?

잠시 후에는 스트림이 표시됩니다.

![stream](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_17.png)

이 유형의 스트림은 1.3초의 지연이 있습니다. 이 번호를 축구장에 추가해 봅시다.

![football field](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_18.png)

<div class="content-ad"></div>

# Raspberry PI 5 WebRTC 비디오 스트림과 mediaMTX

드디어, 당첨에 한 발짝 더 다가갔습니다. 콘솔로 돌아가서 WebRTC용 포트를 확보해 봅시다. 제 경우에는 8889번 포트를 사용하고 있습니다.

![이미지](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_19.png)

이를 재생하려면, 브라우저에서 이 스트림을 열어보세요:

<div class="content-ad"></div>

```js
http://RASPBERRY_PI_IP_HERE:8889/cam1
```

금방 스트림이 제공될 예정이에요. 

전체 화면으로 변경해보고, 지연 시간을 확인해 보세요.

![Raspberry Pi Video Stream Latencies Comparing UDP, TCP, RTSP, and WebRTC](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_20.png)


<div class="content-ad"></div>

테이블 태그를 마크다운 형식으로 변경하세요.

<div class="content-ad"></div>

여기서 모든 결과가 하나의 표에 있습니다.

![표](/assets/img/2024-06-19-RaspberryPi5VideoStreamLatenciesComparingUDPTCPRTSPandWebRTC_22.png)

FPV 드론과 함께 스트림을 사용할 예정이라면, 200밀리초보다 10배 낮은 지연 시간이 필요합니다. 약 20-30밀리초 정도어야 합니다.

제 필요성에 따라 200밀리초의 지연은 무의미하며, MediaMTX를 사용하여 계획을 실행할 수 있습니다.

<div class="content-ad"></div>

더 낮은 지연을 원하신다면 WebRTC 스트림 조정이나 프레임 속도 감소, 그리고 다른 매개변수 조작을 시도해보세요.

이 글이 낮은 지연 라이브 스트림을 갖춘 흥미로운 프로젝트를 구축하는 데 도움이 되기를 바랍니다.

YouTube 채널의 댓글에서 의견을 남겨주세요. 또한 이와 유사한 정보가 필요하다면 말씀해주세요!

읽어주셔서 감사합니다!