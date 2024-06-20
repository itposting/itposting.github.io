---
title: "라즈베리 파이 AI 키트를 사용한 비구조화 데이터 처리 - Hailo Edge AI"
description: ""
coverImage: "/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_0.png"
date: 2024-06-20 17:27
ogImage: 
  url: /assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_0.png
tag: Tech
originalTitle: "Unstructured Data Processing with a Raspberry Pi AI Kit — Hailo Edge AI"
link: "https://medium.com/@tspann/unstructured-data-processing-with-a-raspberry-pi-ai-kit-c959dd7fff47"
---


비구조화된 데이터 처리, Raspberry Pi 5, Raspberry Pi AI-Kit, Milvus, Zilliz, 데이터, 이미지, 컴퓨터 비전, 딥 러닝, 파이썬

![이미지](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_0.png)

# 엣지에서 라이브 카메라 스트림에서 이미지를 감지, 표시 및 저장하기

Raspberry Pi 5와 NVIDIA Jetson Orin Nano와 같은 장치의 성능 덕분에 소규모 예산으로도 Edge AI 사용 사례를 구축할 수 있습니다. 최근에 Raspberry Pi AI Kit이 RPI5 플랫폼용으로 출시되었으므로 한 번 사용해보기로 했습니다.

<div class="content-ad"></div>

AI 키트는 초당 13 테라 오퍼레이션(TOPS)을 처리할 수 있는 신경망 추론 가속기를 추가합니다. 이것은 70달러에 구매할 수 있어서 정말 좋은 거죠. 이 M.2 Hat에 부착된 Hailo-8L M.2 Entry-Level 가속 모듈은 우리에게 AI 기능을 제공할 겁니다.

첫 번째 데모에서는 제가 제공된 RPI5 Hailo AI Python 예제 중 하나를 수정하여 웹캠에서 실시간 이미지 감지를 수행한 다음 검출된 내용을 Slack 채널로 보내고 중요한 메타데이터를 Milvus로 벡터화했습니다.

![이미지](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_1.png)

![이미지](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_2.png)

<div class="content-ad"></div>

# 라즈베리 파이 5에서 진행 중인 라이브 실행

우리는 Hailo의 예제 RPI5 객체 탐지 프로그램을 사용 중입니다. 이 프로그램은 Slack, MiNio 및 Milvus로 보내기 위해 향상시켰습니다.

따라서 예제 객체 탐지 프로그램을 사용 중인데, 먼저 Slack, Milvus, S3, TIMM, Sci-Kit Learn, Pytorch 및 UUID를 위한 내 라이브러리를 임포트하기 위해 일부 임포트를 추가했습니다. 나중에 사용할 몇 가지 상수를 설정했습니다. 그런 다음 Milvus 서버와 Slack 채널에 연결하고 GStreamer 루프를 시작했습니다. 시간을 확인하고 무언가를 감지한 경우 카메라 프레임을 파일에 저장하여 S3에 업로드하고 Slack 채널로 보냈습니다. 마지막으로 S3 경로, 파일 이름, 레이블 및 신뢰도의 중요한 메타데이터와 벡터화된 이미지를 추가했습니다. 각 항목에 대해 자동 생성된 ID를 받았습니다.

우리의 이미지는 MinIO에 업로드되었습니다:

<div class="content-ad"></div>

![image 1](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_3.png)

우리는 또한 텍스트 메시지와 함께 #reports 슬랙 채널로 보냈습니다.

![image 2](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_4.png)

가장 중요한 것은 메타데이터와 벡터를 업로드했고 이미 매우 빠른 검색을 위해 사용 가능합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_5.png)

Now, we can begin querying our vectors, and I will demonstrate how to do it using a Jupyter notebook.

## Querying the Database and Displaying Images

![image](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_6.png)


<div class="content-ad"></div>

저는 이 데모 실행 화면을 녹화했으니, 실시간으로 무슨 일이 일어나는지 확인해 보실 수 있습니다.

![Demo Screenshot](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_7.png)

만약 하나를 구매하셔서 나의 데모를 복제하고 싶으시다면, 이 기사의 끝에 있는 단계들을 확인해 주세요.

# 데모 패킹 목록

<div class="content-ad"></div>

MinIO/S3, Milvus, Slack, Python, Boto3, OpenCV2, Pytorch, Sci-Kit Learn, TIMM, Hailo, YOLOv6n, Object Detection, Raspberry Pi AI Kit, Raspberry Pi 5 with 8GB RAM, logi webcam, resnet34, Torchvision, PyMilvus, Hailo8L M.2 module, M.2 M-Key Hat, Heat Sink.

# 시작하기

하드웨어를 추가한 후 (아래의 비디오 및 링크를 참조하세요), 라이브러리를 설치하고 재부팅하시면 준비가 된 것입니다.

```js
tspann@five:/opt/demo $ 
hailortcli fw-control identify

장치에서 실행 중: 0000:01:00.0
보드 식별 중
제어 프로토콜 버전: 2
펌웨어 버전: 4.17.0 (릴리스, 앱, 확장 컨텍스트 스위치 버퍼)
로거 버전: 0
보드 이름: Hailo-8
장치 아키텍처: HAILO8L
일련 번호: HLDDLBB241601635
파트 번호: HM21LB1C2LAE
제품 이름: HAILO-8L AI ACC M.2 B+M KEY MODULE EXT TMP

tspann@five:/opt/demo $ 
dmesg | grep -i hailo

[    3.155152] hailo: 모듈 초기화. 드라이버 버전 4.17.0
[    3.155295] hailo 0000:01:00.0: Probing on: 1e60:2864...
[    3.155301] hailo 0000:01:00.0: Probing: 장치 확장용 메모리 할당, 11600
[    3.155321] hailo 0000:01:00.0: 장치 활성화 (0000 -> 0002)
[    3.155327] hailo 0000:01:00.0: Probing: 장치 활성화됨
[    3.155350] hailo 0000:01:00.0: Probing: 매핑된 바 0 - 0000000095e362ea 16384
[    3.155357] hailo 0000:01:00.0: Probing: 매핑된 바 2 - 000000005e2b2b7e 4096
[    3.155362] hailo 0000:01:00.0: Probing: 매핑된 바 4 - 000000008db50d03 16384
[    3.155365] hailo 0000:01:00.0: Probing: 최대_desc_page_size를 4096로 강제 설정 (권장값은 16384)
[    3.155375] hailo 0000:01:00.0: Probing: 64비트 dma 활성화
[    3.155378] hailo 0000:01:00.0: Probing: 사용자 공간 할당 VDMA 버퍼 사용
[    3.155382] hailo 0000:01:00.0: ASPM L0s 비활성화
[    3.155385] hailo 0000:01:00.0: ASPM L0s 성공적으로 비활성화
[    3.417111] hailo 0000:01:00.0: 펌웨어가 성공적으로 로드되었습니다
[    3.427885] hailo 0000:01:00.0: Probing: 보드 1e60-2864 추가, /dev/hailo0
```

<div class="content-ad"></div>



![이미지](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_8.png)

# 예제 코드

![이미지](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_9.png)

# 모델 동물원


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-20-UnstructuredDataProcessingwithaRaspberryPiAIKitHailoEdgeAI_10.png)

동영상 안내

# 추가 명령어

```js
gst-inspect-1.0 hailotools
lspci | grep Hailo
uname -a
v4l2-ctl --list-formats-ext -d /dev/video0
ls /dev/video*
ffplay -f v4l2 /dev/video0
```

<div class="content-ad"></div>

# 자료

- [Raspberry Pi AI Kit 제품](https://www.raspberrypi.com/products/ai-kit/)
- [Raspberry Pi AI Kit 관련 문서](https://www.raspberrypi.com/documentation/accessories/ai-kit.html)

보시는 것이 마음에 드셨다면, 어떻게 개선할 수 있는지 댓글로 알려주세요. 또 다음에 어떤 것을 보여드려야 할지도 알려주시면 감사하겠습니다. 프린스턴, 필라델피아, 뉴욕시에서의 밋업이나 유튜브에서 뵙기를 기대합니다.👋

<div class="content-ad"></div>

Milvus로 오세요!

매주 제 뉴스레터를 읽어보세요!

더 많은 멋진 비구조화 데이터, AI 및 Vector Database 비디오를 보려면 Milvus 벡터 데이터베이스 비디오를 여기에서 확인하세요:

https://www.linkedin.com/company/zilliz/

<div class="content-ad"></div>

https://www.linkedin.com/in/timothyspann/

https://milvusio.medium.com