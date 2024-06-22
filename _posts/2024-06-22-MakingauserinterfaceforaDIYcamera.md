---
title: "DIY 카메라를 위한 사용자 인터페이스 만들기 쉽게 따라하는 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_0.png"
date: 2024-06-22 18:32
ogImage: 
  url: /assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_0.png
tag: Tech
originalTitle: "Making a user interface for a DIY camera"
link: "https://medium.com/@jdc-cunningham/making-a-user-interface-for-a-diy-camera-9c1bde515836"
---


면허 : 이 문서는 라즈베리 파이 관련 하드웨어, 파이썬 프로그래밍 언어 및 SPI 기반 디스플레이를 위한 것입니다. 이는 무작위 주제/생각들에 대한 머리 속 내용입니다.

# 소개

요즘 나는 "내 카메라 만들기"에 집착하고 있어요. 현재 만든 현재의 사용자 인터페이스로 만족스러운 지점에 있진 않지만, 적어도 몇 가지를 이해하고 영감을 주기 위해 공유할 수 있어요.

![카메라 인터페이스 만들기](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_0.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_1.png" />

왼쪽부터 순서대로 만들었습니다. Pi Zero HQ Cam 및 모듈러 Pi Cam (v1 오렌지, v2)입니다. 모두 Pi Zero 2 W를 사용합니다.

버튼/홈 UI 화면의 클로즈 업입니다.

주요 기능:

<div class="content-ad"></div>

- 라이브 카메라 미리 보기/통과
- 크롭-줌 팬
- 사진 촬영
- 비디오 녹화
- 기타 (예: IMU를 통한 텔레메트리)
- 파일 보기 (구현이 잘못됨)

# 이 카메라들에 대한 배경

첫 번째 카메라에는 가장 많은 기능이 있습니다. 예를 들어, 내부에 10축(기압계) IMU가 있습니다. 물론 저는 가속도계 및 자이로스코프 같은 6개의 값을만 가져 왔습니다. OLED 디스플레이를 사용합니다. 제가 시험해보고 싶은 오렌지 카메라는 5D 조이스틱 로커를 가지고 있는 라운드 디스플레이를 시도하고, v3 카메라 모듈을 시도하고자 했습니다. 그리고 모듈성에 대해, 카메라는 원래 페이스 플레이트에 의해 모듈화되어야 합니다. 카메라는 샌드위치처럼 구성되어 있으며, 모듈식 파이 카메라 v2도 동일합니다.

이 앞판에는 서로 다른 카메라 모듈이 장착되어 있습니다. 하단에는 v2 모듈(8MP)이 장착되어 있습니다.

<div class="content-ad"></div>

The modular pi cam v2 version has swappable cameras and the largest display.

**Disclaimer!** Uses Type A cables (silver tabs on the same side, 15 pin cable)

## Start up

In this case, I am using a systemd service and threading for running things in parallel. A `main.py` script runs everything, for example, starts a thread to listen for button pushes, starts a picamera2 thread, etc…

<div class="content-ad"></div>

# 메뉴 탐색

여기를 보시면 주황색 카메라에는 뒤로 가기 버튼(오른쪽 상단, d-pad의 일부가 아님)이 없다는 것을 빠르게 알 수 있습니다. 주황색 카메라는 5D 네비게이션 조이스틱 로커를 사용합니다 (내 센터 클릭이 고장 났던 것). 나중에 이것은 실수였다는 것을 깨달았고, 그래서 3번째 카메라에는 별도의 뒤로 가기 버튼이 있습니다. 이것은 네스티드 UI 상태에서 뒤로 나가야 하는 크롭-줌 패닝과 같은 상황에서 특히 중요합니다.

주황색 카메라의 소프트웨어에는 많은 시간을 투자하지 않았습니다. 그냥 작동하게 만들기만 했기 때문에 해당 메뉴 시스템은 기본적이며 아이콘을 계속해서 좌/우로 순환하고 작동하는 유일한 것은 카메라입니다.

<img src="https://miro.medium.com/v2/resize:fit:1400/1*t_j6NdMo8emURcyfhHOCxQ.gif" />

<div class="content-ad"></div>

라즈베리 파이 제로 HQ 카메라는 배터리 프로파일러(단순히 sqlite에 작동 시간을 녹화하는 것)와 같이 여러 기능이 있습니다. Pi Zero HQ 카메라와 모듈러 Pi 카메라 v2는 18650 셀을 사용하여 약 6~7시간의 사용 시간을 제공하는 반면, 모듈러 Pi 카메라 v1(주황색)은 700mAh의 단일 셀 리포밧을 사용하여 2시간 이상 사용할 수 있습니다.

![이미지](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_2.png)

메뉴에 대해 언급하고 싶은 주요 사항은 구성 가능하도록하려는 것입니다. 현재 메뉴 상태를 관리하는 방법이 정말 복잡하며 페이지를 더 추가하는 것도 문제입니다. 일정한 패턴을 발견하기 시작했습니다.

페이지에 무엇이 있는지와 해당 기능을 정의하기 위해 JSON 객체/딕셔너리를 사용할 수 있습니다. 이 기능은 아직 완성되지 않았습니다. 여러분은 이러한 카메라 기능을 섞어 사용하는 복합 소프트웨어를 만들어 UI를 변경하는 것에 대해 작업 중입니다.

<div class="content-ad"></div>

좌표 시스템

![Coordinate System](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_3.png)

여기서 페이지가 -1, 0, 1을 통해 (위, 아래, 왼쪽, 오른쪽) 탐색되는 방식을 볼 수 있습니다.

# 실시간 패스스루

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_4.png" />

라이브 패스스루는 화면에 작은 사진을 찍어 보여주는 루프일 뿐입니다.

# 메뉴 레이어링

저는 PIL을 사용하여 스프라이트(예: 기어 아이콘)를 가져와 Image Draw를 통해 기본 이미지 위에 붙이고 있습니다. 라이브 카메라 미리보기의 오버레이에 대해서도, 단순히 사진 위에 텍스트를 추가하는 것입니다.

<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>

내 코드에서 카메라 설정을 변경할 수 있어요. 예를 들어 라이브 미리보기에는 작은 사진을 찍어요.

![image](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_5.png)

예를 들어 Pi Zero HQ 카메라의 OLED 디스플레이는 128x128 픽셀이에요. HQ 카메라의 센서는 4056x3040 픽셀의 이미지를 생성해요. 위에서 왼쪽에 보이는 것은 라이브 디스플레이에서 보일 수 있는 내용이에요. 찍을 준비가 되면 카메라 모드/설정이 잠시 변경되고 사진이 파일로 저장돼요.

크롭-줌 팬은 더 큰 이미지의 일부를 보여줘요. 지금은 4배까지인데 16배까지로 갈 거예요. 초점을 확인하는 데 유용해요.

<div class="content-ad"></div>

# 전자 조리개

v3 카메라 모듈의 정말 멋진 기능 중 하나입니다. 코드를 통해 초점 깊이를 변경할 수 있습니다. 이는 디옵터 미터를 사용합니다. 예를 들어 1/1은 초점이 맞춰진 곳이 1-3 미터이며 숫자가 커질수록 좁아집니다. 예를 들어 1/10(최대)은 초점이 맞춰진 곳이 10 센티미터(매크로) 입니다.

<img src="/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_6.png" />

오렌지 카메라에서는 사용 중인 값이 표시되도록 오버레이를 설정했습니다.

<div class="content-ad"></div>


![2024-06-22-MakingauserinterfaceforaDIYcamera_7](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_7.png)

오른쪽 스틱을 위/아래로 누르면 피사계 심도가 변경됩니다. 주황색 카메라는 멋있었어요, 마치 포인트 앤 샷처럼. 자동 초점 및 무한 초점(0)도 설정할 수 있어요.

# 파일 보기

사실 이건 만들어 봤는데, 썸네일을 만드는 백그라운드 작업이 없어 로딩하는 데 시간이 걸려요. 그래도 아이디어를 보여주고 싶었어요.


<div class="content-ad"></div>

![Remote control](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_8.png)

<img src="/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_9.png" />

처음에는 블루투스(리액트 네이티브 앱)를 사용하여 이 기기를 만들어보려고 했지만 BL/BLE 부분을 해결하기가 어려웠어요. 그래서 대신 접속 지점 접근 방식으로 바꿨어요(RPi는 연결할 수 있는 WiFi이며 웹 앱을 호스팅합니다). 이 방법은 잘 작동하고 Bookworm OS(Debian)는 기본적으로 네트워크 관리자를 사용하며 핫스팟을 쉽게 열 수 있어요. 다만, 켜면 SSH 액세스가 없어지니(지금까지는) 소프트웨어에서 이를 끄는 방법이 필요할 거예요. 부팅 속도도 더 빨라졌어요. 그리고 카메라 화면을 스트리밍할 수 있고 포커스 조절 및 다른 기능을 수행할 수 있어요. 모듈러 파이 캠 v2에는 삼각대 나사 구멍(1-4/20)이 있어서 촬영할 때 카메라가 회전하는 현상을 줄일 수 있어요.

<div class="content-ad"></div>

# 타임랩스

이것은 진부한 기능이지만 Pi Zero HQ 캠에서 이를 사용했습니다. 시간이 걸리는 타임랩스 때문에 그렇게 자주 사용하지는 않았어요. 일몰을 찍는 것은 멋질 거에요.

여기서는 호수를 잠깐 볼 수 있지만, 제가 거기에 머무른 시간은 몇 분밖에 되지 않았어요.

# 부정점

<div class="content-ad"></div>

최대 해상도는 12MP입니다. 좋은 렌즈와 함께 사용하면 꽤 좋습니다. 예를 들어 Canon FD 마운트를 통해 적용해보세요.

밝은 조건 외부에서는 LCD 화면이 잘 보이지 않습니다. LCD 화면은 약간 더 좋고, 라이트 모드 메뉴를 사용하면 좀 더 나아집니다.

센서 픽셀 크기/렌즈 품질... 이는 Sony Alpha와 같은 것과는 비교할 수 없습니다. 큰 것/가까이서 볼수록 작은 것/멀리서 보다 나아보입니다. 예를 들어 나무 가지의 가까운 모습.

# 샘플 사진

<div class="content-ad"></div>

이 카메라들로 재미를 느끼고 있어요. 전문 카메라맨은 아니지만, 기본 사항은 할 수 있어요. 현재는 자동 설정을 사용하고 있어요. 나중에 그것에 대해 더 알아보기 전까지 자동 설정을 사용하고 있어요. ISO가 아니라 picamera2에서 등가이득 값을 사용하고 있어요.

![Image 1](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_10.png)

![Image 2](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_11.png)

![Image 3](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_12.png)

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_13.png)

![Image 2](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_14.png)

![Image 3](/assets/img/2024-06-22-MakingauserinterfaceforaDIYcamera_15.png)

Full resolution links


<div class="content-ad"></div>

[테이블 레이아웃 변경]