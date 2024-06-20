---
title: "Coral Dual Edge TPU를 Frigate를 위해 설정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_0.png"
date: 2024-06-19 18:15
ogImage: 
  url: /assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_0.png
tag: Tech
originalTitle: "How to Setup the Coral Dual Edge TPU for Frigate"
link: "https://medium.com/@timothydmoody/how-to-setup-the-coral-dual-edge-tpu-for-frigate-9a7f645dc915"
---



![이미지](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_0.png)

# 전체 비디오 튜토리얼

# Coral AI PCIe 가속기 드라이버 설치

여기서부터 모든 것을 간소화하는 이 스크립트를 사용하시면 됩니다.


<div class="content-ad"></div>

```js
curl -sS https://gist.githubusercontent.com/dataslayermedia/8676e010a9121adaaab8e6dc98bca383/raw/f208dbb5e3efda51b75183c67e8dc857e375234e/Install-Coral-PCIe-Accelerator-TPU-Linux.sh | bash
```

재부팅

```js
sudo reboot
```

장치 확인

<div class="content-ad"></div>

```js
lspci -nn | grep 089a
```

![Link](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_1.png)

Apex 장치를 확인하세요

```js
ls /dev/apex_*
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_2.png" />

도커 설치

<img src="/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_3.png" />

```js
# 도커의 공식 GPG 키 추가:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Apt 소스에 저장소 추가:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

<div class="content-ad"></div>

```js
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

다음 명령어로 설치를 테스트해보세요.

```js
docker ps -a
```

<img src="/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_4.png" />

<div class="content-ad"></div>

# MQTT(Mosquitto) 설치

MQTT 프로토콜은 발행/구독 모델을 사용하여 메시지를 전달하는 가벼운 방법을 제공합니다. 이는 저전력 센서나 휴대폰과 같은 모바일 장치, 임베디드 컴퓨터, 또는 마이크로컨트롤러와 같은 사물인터넷 메시징에 적합합니다.

```js
sudo apt install mosquitto mosquitto-clients
```

```js
sudo systemctl is-enabled mosquitto
sudo systemctl status mosquitto
```

<div class="content-ad"></div>

아래와 같이 테이블 태그를 Markdown 형식으로 변경해주세요.


![이미지](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_5.png)

MQTT 구성 파일을 편집합니다.

```sh
vim /etc/mosquitto/mosquitto.conf
```

이 두 줄을 추가하세요...


<div class="content-ad"></div>


allow_anonymous true
listener 1883


설정 파일은 다음과 같이 보일 것입니다...

![이미지](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_6.png)

VIM에서 “:x” 입력 후 엔터 키를 눌러 저장하고 종료하세요.

<div class="content-ad"></div>

서비스를 저장하고 다시 시작하세요

```js
systemctl restart mosquitto
```

# Frigate 설정

![이미지](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_7.png)

<div class="content-ad"></div>

루트 디렉터리에서 "frigate"라는 디렉터리를 만들어 config.yml 파일을 추가하세요.

```js
cd /
mkdir frigate
cd /frigate
touch config.yml
```

config.yml 파일을 편집하세요.

```js
mqtt:
  enabled: True
  host: 192.168.X.XXX
  port: 1883
cameras:
  eyeofsauron:
    ffmpeg:
      # hwaccel_args: preset-vaapi
      #hwaccel_args:
      #  - vf:v "fps=15"
      inputs:
        - path: rtsp://192.168.X.XXX:554/mystream
          input_args: preset-rtsp-generic
          roles:
            - detect
            - record
            - rtmp
    detect:
      fps: 25
      enabled: True
      width: 1280
      height: 720
detectors:
  coral1:
    type: edgetpu
    device: pci:0
  coral2:
    type: edgetpu
    device: pci:1
objects:
  track:
    - person

record:
  # Optional: 녹화 기능 활성화 (기본값은 아래와 같습니다)
  # 주의: 설정에서 녹화를 비활성화한 경우, 나중에 UI나 MQTT를 통해 녹화를 켜도 영향이 없습니다.
  enabled: True
  # Optional: 정리 실행 간격(분) 설정 (기본값은 아래와 같습니다)
  # I/O를 최소화하기 위해 디스크에서 녹화 세그먼트를 삭제하는 빈도를 줄이려면 사용할 수 있습니다.
  expire_interval: 60
  # Optional: 녹화 보관 설정
  retain:
    # Optional: 이벤트와 관계없이 녹화 보관일 수 (기본값은 아래와 같습니다)
    #참고: 이벤트의 녹화만 유지하려면 이 값을 0으로 설정하고 아래 이벤트 섹션에서 보관을 정의해야 합니다.
    days: 0
    # Optional: 보관 모드. 가능한 옵션은 다음과 같습니다: all, motion, active_objects
    #   all - 모든 활동에 관계없이 모든 녹화 세그먼트를 저장
    #   motion - 감지된 모션을 가진 모든 녹화 세그먼트를 저장합니다.
    #   active_objects - 활동/움직이는 객체를 가진 모든 녹화 세그먼트를 저장합니다.
    #NOTE: 이 모드는 위의 days 설정이 0보다 클 때만 적용됩니다.
    mode: all
  # Optional: 이벤트 녹화 설정
  events:
    # Optional: 이벤트 이전 시점을 포함할 초 수 (기본값은 아래와 같습니다)
    pre_capture: 5
    # Optional: 이벤트 후속 시점을 포함할 초 수 (기본값은 아래와 같습니다)
    post_capture: 5
    # Optional: 녹화를 위해 저장할 객체 (기본값: 추적되는 모든 객체)
    objects:
      - person
    # Optional: 지정된 모든 존에 들어간 객체로 녹화를 제한 (기본값: 필수 존 없음)
    required_zones: []
    # Optional: 이벤트 녹화 보관 설정
    retain:
      # 필수: 기본 보관 일 수 (기본값은 아래와 같습니다)
      default: 10
      # Optional: 보관 모드 (기본값은 아래와 같습니다)
      #   all - 활동 여부에 관계없이 이벤트를 위한 모든 녹화 세그먼트를 저장
      #   motion - 감지된 모션을 가진 이벤트를 위한 모든 녹화 세그먼트를 저장
      #   active_objects - 활동/움직이는 객체를 가진 이벤트를 위한 모든 녹화 세그먼트를 저장
      #NOTE: 카메라의 보관 모드가 여기에서 구성된 모드보다 제한적이면 이 모드가 적용되는 시점에 세그먼트는 이미 삭제됩니다.
      #       예를 들어, 카메라의 보관 모드가 "motion"이면 모션 없는 세그먼트는 저장되지 않으므로 여기에서 모드를 "all"로 설정해도 복구되지 않습니다.
      mode: motion
      # Optional: 객체별 보관 일 수
      objects:
        person: 15

# Optional: 이벤트별 클립 디렉터리에 작성된 jpg 스냅샷에 대한 구성
#NOTE: 카메라 수준에서 재정의할 수 있음
snapshots:
  # Optional: jpg 스냫샷을 /media/frigate/clips에 작성 활성화 (기본값은 아래와 같습니다)
  enabled: False
  # Optional: 스냅샷 이미지의 깨끗한 PNG 복사 저장 (기본값은 아래와 같습니다)
  clean_copy: True
  # Optional: 스냅샷에 타임스탬프 추가 (기본값은 아래와 같습니다)
  timestamp: False
  # Optional: 스냅샷에 바운딩 박스 그리기 (기본값은 아래와 같습니다)
  bounding_box: False
  # Optional: 스냅샷 자르기 (기본값은 아래와 같습니다)
  crop: False
  # Optional: 스냅샷 크기 조정을 위한 높이 (기본값: 원본 크기)
  height: 175
  # Optional: 지정된 모든 존에 들어간 객체로 제한된 스냅샷 (기본값: 필수 존 없음)
  required_zones: []
  # Optional: 보관 설정을 위한 카메라 오버라이드 (기본값: 전역 값)
  retain:
    # 필수: 기본 보관 일 수 (기본값은 아래와 같습니다)
    default: 10
    # Optional: 객체별 보관 일 수
    objects:
      person: 15

birdseye:
  # Optional: 전방향 보기 활성화 (기본값은 아래와 같습니다)
  enabled: True
  # Optional: RTSP를 통해 전방향 보기 다시 전송 (기본값은 아래와 같습니다)
  #NOTE: 이를 활성화하면 전방향 보기가 항상 실행되어 CPU 사용량이 어느 정도 증가할 수 있습니다.
  restream: False
  # Optional: 출력 해상도의 너비 (기본값은 아래와 같습니다)
  width: 1280
  # Optional: 출력 해상도의 높이 (기본값은 아래와 같습니다)
  height: 720
  # Optional: mpeg1 피드의 인코딩 품질 (기본값은 아래와 같습니다)
  # 1이 가장 높은 품질이고 31이 가장 낮습니다. 품질이 낮은 피드는 CPU 리소스를 적게 사용합니다.
  quality: 1
  # Optional: 뷰 모드. 가능한 옵션은 다음과 같습니다: objects, motion, continuous
  #   objects - 마지막 30초 내에 추적된 객체가 있는 경우 카메라가 포함됨
  #   motion - 마지막 30초 내에 모션을 감지한 경우 카메라가 포함됨
  #   continuous - 모든 카메라가 항상 포함됨
  mode: continuous

logger:
  # Optional: 기본 로그 상세도 (기

<div class="content-ad"></div>

이 구성은 PCIe TPU에 모두 준비가 되어 있으며 프레임에서 사람을 감지하면 녹화를 합니다. 해상도는 HD이고 프레임 속도는 높습니다(25 FPS). 이 모든 것은 필요에 맞게 조정할 수 있습니다.

IP 주소를 교체해야 합니다.

hostname -I

IP 카메라가 있다면이 프로세스가 훨씬 쉽습니다. 하지만 제가 저렴한 웹캠을 사용하고 있습니다.

<div class="content-ad"></div>

```
![이미지](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_8.png)

프리게이트 도커 컨테이너 실행

```js
docker run -d \
  --name frigate \
  --restart=unless-stopped \
  --mount type=tmpfs,target=/tmp/cache,tmpfs-size=1000000000 \
  --device /dev/apex_0:/dev/apex_0 \
  --device /dev/apex_1:/dev/apex_1 \
  --shm-size=512m \
  -v /frigate/storage:/media/frigate \
  -v /frigate/config.yml:/config/config.yml \
  -v /etc/localtime:/etc/localtime:ro \
  -p 5000:5000 \
  -p 8555:8555/tcp \
  -p 8555:8555/udp \
  ghcr.io/blakeblackshear/frigate:stable
```

노트: 우리는 apex 장치를 컨테이너로 모두 전달하고 있습니다.


<div class="content-ad"></div>

로컬 네트워크에서 Frigate 웹 UI를 열어보세요.

192.168.X.XXX:5000

![이미지](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_9.png)

# RTSP 서버 만들기

<div class="content-ad"></div>

```js
wget https://github.com/aler9/rtsp-simple-server/releases/download/v0.16.0/rtsp-simple-server_v0.16.0_linux_amd64.tar.gz
```

```js
tar -xzvf rtsp-simple-server_v0.16.0_linux_amd64.tar.gz
```

```js
RTSP_RTSPADDRESS=192.168.XXX.XXX:554 ./rtsp-simple-server
```

![How to Setup the Coral Dual Edge TPU for Frigate](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_10.png)


<div class="content-ad"></div>

# RTSP 서버로 웹캠 피드 스트리밍하기

```js
apt-get install ffmpeg
```

```js
sudo ffmpeg -f v4l2 -framerate 25 -video_size 1280x720 -i /dev/video0 -pix_fmt yuv420p -b:v 2000k -f rtsp -rtsp_transport tcp rtsp://192.168.X.XXX:554/mystream
```

IP 주소를 교체하는 것을 기억해 주세요.

<div class="content-ad"></div>

# 브라우저에서 Frigate 열기

192.168.X.XXX:5000

코랄 장치의 온도를 모니터링하고 싶다면 해당 작업을 수행할 수 있는 스크립트가 있어요.

[해당 스크립트는 여기에서 확인할 수 있어요](https://gist.github.com/dataslayermedia/fb20aae9dea64bca286b5e6d189027b8)

<div class="content-ad"></div>

```bash
curl -sS https://gist.githubusercontent.com/dataslayermedia/fb20aae9dea64bca286b5e6d189027b8/raw/a4f264ee7be546bdf5c3363bfafdc9597f9edd5c/real-time-temperature-output-coral-ai-pcie-accelerators.sh | bash
```

![Demo](https://miro.medium.com/v2/resize:fit:1280/1*S-F-NGRpvd9eVHcbkeB7RA.gif)

## 제품 하드웨어 링크

1080P 웹캠


<div class="content-ad"></div>

아래는 표 형식을 변경한 것입니다.


<img src="/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_11.png" />

Coral AI Dual Edge TPU

<img src="/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_12.png" />

Zima Board


<div class="content-ad"></div>


![Dual Edge TPU Adapter Low Profile](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_13.png)

![Dual Edge TPU Adapter Low Profile](/assets/img/2024-06-19-HowtoSetuptheCoralDualEdgeTPUforFrigate_14.png)
