---
title: "라즈베리 파이 완벽한 헤드리스 설정 안내"
description: ""
coverImage: "/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_0.png"
date: 2024-06-19 18:26
ogImage: 
  url: /assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_0.png
tag: Tech
originalTitle: "Raspberry Pi Full Headless Setup Guide"
link: "https://medium.com/@imthedanger/raspberry-pi-full-headless-setup-guide-6e3c9ebed710"
---


안녕하세요 여러분! 며칠 전에 처음으로 라즈베리 파이 4를 구입했고, 설정하는 방법을 여러분과 나누고 싶어서 기쁩니다. 함께 따라와서 오류가 발생하면 언제든지 연락해 주세요.

시작해봅시다!

![라즈베리파이 이미지](/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_0.png)

# 필요한 것들

<div class="content-ad"></div>

- 라즈베리 파이 4
- MicroSD 카드 (16GB 이상)
- 라즈베리 파이 전원 어댑터
- 이더넷 케이블 또는 Wi-Fi 연결
- 라즈베리 파이를 설정하기 위한 컴퓨터

# MicroSD 카드 준비하기

먼저 공식 웹사이트에서 라즈베리 파이 이미저를 다운로드하세요:

https://www.raspberrypi.com/software/

<div class="content-ad"></div>

라즈베리 파이 OS를 MicroSD 카드에 설치하세요. SSH를 활성화하고 사용자 정의 설정에서 SSID 및 Wi-Fi 비밀번호를 입력하는 것을 잊지 마세요!

![Raspberry Pi OS 설치](/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_1.png)

MicroSD 카드를 라즈베리 파이에 삽입하고 전원을 켜세요(5W/3A).

# 초기 설정

<div class="content-ad"></div>

그의 IP 주소를 찾아봅시다.

[이미지](/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_2.png)

여기 있어요!

이제 IP 주소를 찾았으니 SSH를 통해 로그인해 봅시다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_3.png" />

좋아요!

이제 장치에 CLI 액세스 권한이 생겼습니다.

# 그래픽 액세스

<div class="content-ad"></div>

라즈베리 파이에 그래픽 액세스를 원하시면, 라즈베리 파이에 VNC 서버를 설치해야 해요.

다음 단계:

인터페이스 옵션으로 이동 → VNC → 예

나가기하고 재부팅하기.

<div class="content-ad"></div>

VNC 뷰어를 노트북에 설치하세요:

좋아요! 이제 VNC 서버에 연결해 봅시다!

노트북에서 VNC 뷰어를 열고 라즈베리 파이의 IP 주소를 입력하세요:

![이미지](/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_4.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_5.png" />

사용자 이름과 비밀번호를 입력해주세요:

<img src="/assets/img/2024-06-19-RaspberryPiFullHeadlessSetupGuide_6.png" />

그리고 들어왔습니다!

<div class="content-ad"></div>

<img src="https://miro.medium.com/v2/resize:fit:960/1*DlPOOFxupci14OKPJn5OVw.gif" />

# 결론

그게 다야! 이제 라즈베리 파이를 사용하여 멋진 프로젝트를 많이 할 수 있어요. 제 글이 즐거우셨고 도움이 되었으면 좋겠어요. 질문이 있으시면 언제든지 연락주세요.

주목해 주셔서 감사합니다. 더 많은 흥미진 직업을 위해 팔로우하지 않으시면 안돼요!