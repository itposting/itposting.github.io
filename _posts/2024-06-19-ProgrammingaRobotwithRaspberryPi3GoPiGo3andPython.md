---
title: "라즈베리 파이 3, GoPiGo3 및 Python으로 로봇 프로그래밍하기"
description: ""
coverImage: "/assets/img/2024-06-19-ProgrammingaRobotwithRaspberryPi3GoPiGo3andPython_0.png"
date: 2024-06-19 18:13
ogImage: 
  url: /assets/img/2024-06-19-ProgrammingaRobotwithRaspberryPi3GoPiGo3andPython_0.png
tag: Tech
originalTitle: "Programming a Robot with Raspberry Pi 3, GoPiGo3 and Python"
link: "https://medium.com/@athicharttangpong/programming-a-robot-with-raspberry-pi-3-gopigo3-and-python-592bd8e41530"
---


대학 시절, 25년 전, 나는 테니스 공을 모으는 간단한 로봇을 제작했었습니다. 그러나 그 지식은 시간이 흘러서 잊혀졌습니다. 2020년의 글로벌 대유행으로 인한 봉쇄와 재택근무의 전환은 내가 잊고 있던 로봇공학에 대한 관심을 다시 일으켰습니다. 즐거워하는 것을 넘어, 이것을 제기회로 나의 기술을 향상시키고 내 아이들에게 영감을 줄 수 있는 좋은 기회라고 생각했습니다. 나는 로봇공학에 대한 나의 이해를 더 깊게 하고 나만의 로봇을 만들기 위한 여정에 나서기로 결정했습니다. 본 기사는 내가 로봇공학에 대해 배운 것을 공유하는 시리즈의 첫 번째 글입니다.

나는 플랫폼과 프로그래밍 언어로 Raspberry Pi와 Python을 선택했습니다. 그 이유는 그들의 인기와 확장된 커뮤니티 지원 때문입니다. 로봇 하드웨어에 대해선 두 가지 선택지가 있었습니다: Arduino, 모터 드라이버, 그리고 다른 구성 요소를 사용해 모든 것을 처음부터 만들거나, 이미 구성되어있는 소프트웨어 개발 키트(SDK)가 함께 제공되는 로봇 키트를 구매하는 것입니다. 나는 주로 소프트웨어 개발에 관심이 있기 때문에 후자를 선택했습니다.

# 로봇 키트

나의 조사 결과, Dexter Industries는 두 가지 매력적인 옵션을 제공합니다. GoPiGo3는 간단한 로봇 챠시와 함께 모터와 센서를 제어하기 위한 HAT가 포함된 완전한 로봇 키트입니다. 반면에 BrickPi3는 레고 EV3 모터와 센서를 제어하기 위해 설계된 Raspberry Pi HAT입니다. 두 제품 모두 Python SDK를 제공합니다. GoPiGo3는 저렴하고 완성도가 높아 초보자에게 가장 적합한 플랫폼입니다; 나는 단지 Raspberry Pi를 추가하면 작동하는 로봇을 갖게 됩니다.

<div class="content-ad"></div>

업데이트: 저는 2020년에 Raspberry Pi 3가 최고 모델이었던 때 이 프로젝트를 시작했습니다. 그 당시 사용 가능한 HAT은 GoPiGo, BrickPi, PiStorm이 있었습니다. GoPiGo는 전통적인 모터와 호환되었고, BrickPi와 PiStorm은 레고 EV3 모터용으로 설계되었습니다. 또한 시도해보지 않은 중국 제작 로봇 키트도 있었습니다. 이제 2024년에는 Raspberry Pi 5가 출시되었고, Lego SPIKE Prime 모터 또는 센서 4개를 제어할 수 있는 Raspbery Pi Build Hat도 함께 출시되었습니다.

GoPiGo 샤시 조립 부분은 건너뛰고 GoPiGo 로봇 키트가 준비되어 있다고 가정할게요. 판매업자 웹사이트에서 매우 좋은 설명서가 이미 있기 때문입니다. 소프트웨어 측면에서, 저는 2020년에 Raspbian OS Buster와 GoPiGo3 SDK를 설치했습니다. 지금은 무료 Dexter OS를 사용할 수도 있습니다. 제 이해로는 미리 설치된 GoPiGo3 소프트웨어를 가진 사용자 정의 Raspbian OS입니다. 이것은 더 간단하고 빠른 방법일 수 있습니다. 파이썬과 기타 프로그래밍 언어 외에도, GoPiGo3는 그래픽 기반 프로그래밍 언어인 Scratch도 지원합니다. 나중에 아이들과 함께 그 쪽을 더 탐구할 계획입니다.

이것은 제 GoPiGo3 로봇의 하드웨어 요약입니다.

- Raspberry Pi 3
- GoPiGo3 HAT
- 이동을 위한 두 개의 모터
- 팬 및 틸트를 위해 두 개의 서보 모터에 연결된 Pi 카메라
- 거리 센서
- 라인 추적 센서
- 12V 충전식 배터리
- 커스텀 레고 케이스에 수납된 미니 블루투스 스피커
- 키보드 및 게임 패드용 USB 수신기

<div class="content-ad"></div>

# 소프트웨어 설치

로봇 키트를 조립한 후에 라즈베리 파이에 운영 체제와 GoPiGo3 SDK를 설치해야 합니다.

- 무료 소프트웨어인 Etcher와 같은 프로그램을 사용하여 Raspbian Buster 이미지를 마이크로 SD 카드에 다운로드하고 불러옵니다. 이 소프트웨어는 매우 직관적입니다.
- 라즈베리 파이를 부팅하고 화면 안내에 따라 초기 설정을 완료합니다.
- 다음 명령어를 사용하여 GoPiGo3 SDK를 설치합니다.

```js
# GoPiGo3 SDK를 최신 버전으로 설치하거나 업데이트합니다
curl -kL dexterindustries.com/update_gopigo3 | bash
# Dexter 센서(예: 라인 팔로워, 거리 센서)를 설치하거나 업데이트합니다
curl -kL dexterindustries.com/update_sensors | bash
```

<div class="content-ad"></div>

# 프로그래밍

이제 재미있는 부분인 로봇을 Python을 사용하여 프로그래밍하는 방법으로 넘어가 봅시다. 다음 코드는 로봇을 움직이고 카메라를 팬 및 틸트하는 방법을 보여줍니다.

마무리하기 전에, 다음 기사에서 사용할 GoPiGoRobot이라는 Python 클래스를 만들어 봅시다. 우리 코드의 요약은 다음과 같습니다.

- GoPiGo3 SDK 호출을 친숙한 클래스 메서드로 캡슐화합니다.
- try-except 문을 사용하여 하드웨어 액세스 예외를 처리합니다.
- 코드가 다중 스레드가 될 것으로 예상되므로 코드가 스레드로부터 안전하게 접근하도록 하드웨어 액세스를 상호 배타적으로 제공합니다. 이를 위해 하드웨어 액세스 코드를 _lockAndExceptionHandler 데코레이터로 꾸밈으로써 간결함과 편리함을 위해 목적을 달성합니다.

<div class="content-ad"></div>

# 결론

우리는 이 기사를 라즈베리 파이용 로봇 키트에 대한 토론으로 시작했습니다. 우리는 프로젝트에 GoPiGo를 사용하기로 결정했습니다. 그런 다음 Raspbian 운영 체제와 GoPiGo SDK를 설치하는 방법을 보여주었습니다. 마지막으로, 우리는 우리 로봇에 약간의 운동을 시키는 간단한 프로그램을 시연했습니다. 다음 기사에서는 로봇에 대한 더 많은 옵션을 탐구할 것입니다.