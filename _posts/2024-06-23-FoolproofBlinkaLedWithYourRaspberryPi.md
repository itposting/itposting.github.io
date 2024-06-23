---
title: "라즈베리 파이로 LED 깜빡이기 초보자용 간단 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-FoolproofBlinkaLedWithYourRaspberryPi_0.png"
date: 2024-06-23 18:14
ogImage: 
  url: /assets/img/2024-06-23-FoolproofBlinkaLedWithYourRaspberryPi_0.png
tag: Tech
originalTitle: "Foolproof: Blink a Led With Your Raspberry Pi"
link: "https://medium.com/nerd-for-tech/blink-led-with-raspberry-pi-foolproof-7f2584fd552a"
---


## 스텝별 가이드

라즈베리 파이를 설정한 후, 흥미로운 프로젝트에 착수할 수 없을 정도로 설레이고 있었어요. 그런데, 한 가지 큰 문제가 있었어요:

이 작은 컴퓨터를 어떻게 상호 작용해야 할까요?

IT 학생으로써, 시스템이 튜링 완전한지 여부를 감지하는 것과 같은 유용한 것들을 배웠어요. 하지만 라즈베리 파이를 제어하는 것? 그건 정말 너무 복잡해 보였어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-FoolproofBlinkaLedWithYourRaspberryPi_0.png" />

의문을 해결하기 위해 나는 확실한 작업으로 시작하기로 결정했다: LED 깜박임.

이 프로젝트는 초보자에게 좋은 과제인데, Pi의 핀 및 기본 프로그래밍에 익숙해지게되며, 시간이나 돈을 많이 소비하지 않는다. 모든 재료(PI 및 멀티미터 제외)는 약 10유로 정도 든다. 그리고 기술 수준(및 발생하는 버그에 따라)에 따라 최대 1시간 30분 정도 소요된다.

# 요구 사항

<div class="content-ad"></div>

- 라즈베리 파이 설정이 완료된 상태
- 솔더가 필요 없는 브레드보드
- 2개의 메스-퍼더 메일 점퍼 와이어
- 1개의 LED
- 작은 저항기 (330Ω 사용)
- 멀티미터 (디버깅에 옵션)

![이미지](/assets/img/2024-06-23-FoolproofBlinkaLedWithYourRaspberryPi_1.png)

저는 라즈베리 파이 제로 W를 사용했지만, 이 튜토리얼은 GPIO 핀이 있는 모든 파이에 작동합니다. 파이 제로의 경우, 핀을 직접 납땜해야 합니다. 작업이 편리해지도록 다채로운 핀을 추천합니다.

아직 라즈베리 파이를 설정하지 않았다면, 머릿속 작은 컴퓨터를 사용하는 방법에 대한 내 튜토리얼을 읽어보세요. 모니터로 시작하려면 공식 문서를 확인해보세요.

<div class="content-ad"></div>

# 자극으로 바쁜 손들을 준비하고 회로를 설치하는 방법

## Raspberry Pi의 GPIO 핀들:

회로를 설명하기 전에, 먼저 Raspberry Pi의 중요한 부분인 GPIO 핀을 살펴보겠습니다.

<img src="/assets/img/2024-06-23-FoolproofBlinkaLedWithYourRaspberryPi_2.png" />

<div class="content-ad"></div>

GPIO는 General-Purpose Input/Output의 약자입니다. 이 핀들을 사용하면 Raspberry Pi와 전기 구성 요소를 연결하여 소프트웨어를 통해 상호 작용할 수 있습니다. 그림에서 보듯이, 모든 40개의 핀은 특정한 역할을 합니다.

우리의 회로를 위해 GND(0V)와 녹색, 파란색 또는 빨간색 GPIO 핀이 필요합니다. GPIO 핀은 전압을 켜고 끌 수 있도록 도와줍니다.

## 회로:

마지막으로, 회로를 살펴보겠습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-FoolproofBlinkaLedWithYourRaspberryPi_3.png)

우리는 LED를 GND에 연결하고 어떤 GPIO 핀에도 연결해야 합니다 (저는 GPIO 4를 사용했습니다).

안전을 위해, GPIO 핀과 LED 사이에 저항을 연결해야 합니다. 너무 많은 전기는 좋은 경험이 아닙니다 — 특히 작은 LED에게는 특히 그렇습니다. 하지만 기억하세요: 저항이 강할수록 LED가 약하게 켜집니다.

그렇지만, 330Ω로 저항을 선택하면 안전합니다. LED에 필요한 적절한 저항값을 계산하는 방법에 대해 더 알아보려면 다음 비디오를 확인해보세요:


<div class="content-ad"></div>

잘 했어요, 회로는 여기까지입니다!

# 파티 시작: 깜박이는 LED

LED가 1초 간격으로 깜박이는 리듬을 만들어주는 것이 이번 스크립트의 작업입니다. 스크립팅에 매우 편리한 파이썬으로 프로그램을 선택했어요.

우선, 라즈베리 파이에 연결하고 터미널을 엽니다. 코딩을 시작하기 전에 라즈베리 파이의 핀과 상호작용할 수 있게 해주는 라이브러리를 설치해요. 항상처럼, 패키지를 업데이트해주어요.

<div class="content-ad"></div>

```js
$ sudo apt update && sudo apt upgrade
$ sudo apt install python-rpi.gpio python3-rpi.gpio
```

그런 다음 좋아하는 편집기로 빈 파일을 엽니다. 저는 ‘vim’을 선호합니다.

```js
$ vim partyLED.py
```

이제 실제 프로그램으로 넘어갑니다. GPIO 핀의 초기화 및 LED 구성으로 나뉘어집니다.

<div class="content-ad"></div>

먼저 초기화를 살펴봅시다. 필요한 라이브러리를 스크립트에 가져온 후, GPIO 핀을 위한 변수를 만듭니다.

다른 GPIO 핀을 연결했다면 4를 해당 GPIO 핀 번호로 바꿔주세요.

더불어 GPIO 핀 대신 물리적 핀을 사용하도록 지정하고 전압을 제어하기 위해 GPIO 핀을 출력 핀으로 설정합니다.

```js
import RPi.GPIO as GPIO         # 라즈베리파이 GPIO 라이브러리 가져오기
from time import sleep          # sleep 함수 가져오기 

pinLED = 4                      # LED GPIO 핀 번호

GPIO.setmode(GPIO.BCM)          # GPIO 핀 번호 사용
GPIO.setwarnings(False)         # 경고 무시
GPIO.setup(pinLED, GPIO.OUT)    # GPIO 핀을 출력 핀으로 설정
```

<div class="content-ad"></div>

LED가 실제로 깜박이도록 하려면 GPIO 핀을 HIGH(전압이 켜짐)으로 설정한 후 LOW(전압이 꺼짐)으로 설정하는 루프를 만듭니다. while 루프로 인해 우리의 프로그램은 콘솔을 통해 중지할 때까지 실행됩니다.

```js
while True:                          # 무한 루프
    GPIO.output(pinLED, GPIO.HIGH)   # 켜기
    print(LED 켜짐)                   # 상태를 콘솔에 출력
    sleep(1)                         # 1초 동안 일시정지
    GPIO.output(pinLED, GPIO.LOW)    # 끄기
    print(LED 꺼짐)                  # 상태를 콘솔에 출력
    sleep(1)                         # 1초 동안 일시정지
```

모두 함께 넣으면 프로그램은 다음과 같이 보입니다:

```js
import RPi.GPIO as GPIO         # 라즈베리파이 GPIO 라이브러리 import
from time import sleep          # sleep 함수 import

pinLED = 4                      # LED GPIO 핀

GPIO.setmode(GPIO.BCM)          # GPIO 핀 번호 사용
GPIO.setwarnings(False)         # 우리 경우 경고 무시
GPIO.setup(pinLED, GPIO.OUT)    # GPIO 핀을 출력 핀으로 설정

while True:                          # 무한 루프
    GPIO.output(pinLED, GPIO.HIGH)   # 켜기
    print(LED 켜짐)                   # 상태를 콘솔에 출력
    sleep(1)                         # 1초 동안 일시정지
    GPIO.output(pinLED, GPIO.LOW)    # 끄기
    print(LED 꺼짐)                  # 상태를 콘솔에 출력
    sleep(1)                         # 1초 동안 일시정지
```

<div class="content-ad"></div>

그리고 다 됐어요! 이 몇 줄이 모든 마법을 부릅니다.

이제 파일을 저장하고 Pi에서 실행하세요:

```js
$ python partyLED.py
```

<img src="https://miro.medium.com/v2/resize:fit:800/1*t3lO_bC7qHuqHf5sYxsXiA.gif" />

<div class="content-ad"></div>

프로그램을 중지하려면 터미널에서 CTRL+C를 눌러주세요.

# 일반적인 문제

- LED의 긴 다리(+)를 GPIO 핀에 연결하고 짧은 다리(-)를 GND에 연결해야 합니다. 전기는 한 방향으로만 흐릅니다.
- 멀티미터가 있다면 각 전기 부품의 전압을 확인하고 LED와 저항기를 통해 전류가 흐르는지 확인할 수 있습니다.
- 저항을 더 약한 것으로 바꿔보세요 (하지만 100Ω 미만은 사용하지 마세요). 전압이 너무 낮아지면 LED가 꺼집니다.

만약 멀티미터가 없다면, LED가 제대로 작동하는지 확인하려면 플러스극을 GPIO 핀 대신 3.3V에 연결해보세요. 그러면 LED가 계속 켜질 것입니다.

<div class="content-ad"></div>

# 결론

요컨대: Pi로 시작하는 것은 예상했던 것보다 훨씬 쉽습니다. 작은 회로, 약간의 Python 프로그래밍 — 그게 다 필요한 것뿐이에요!

전자 부품을 다뤄본 것이 즐거우셨다면, 회로에 더 많은 LED를 추가하거나 각기 다른 간격으로 깜박이게 하거나 작은 신호등을 만들어보세요. 이 과정은 Pi와 코딩을 더 익숙하게 만들어줄 거예요.

또한, 처음에 잘 되지 않았다고 걱정하지 마세요. 믿으시든지 말든지 저는 저도 내 저항이 너무 강하다는 걸 알지 못해서 모든 것을 작동시키기 위해 1시간 이상이 걸렸어요(... 알겠어요). 고난을 겪는 것도 괜찮아요.

<div class="content-ad"></div>

어쨌든, LED 깜박임을 마스터해서 기뻐요. 라즈베리 파이를 시작하는 방법을 알아내고 나니, 더 멋진 프로젝트에 더 흥분하고 있어요.

그리고 당신도 그렇기를 바라요.

더 멋진 프로젝트를 찾고 계신가요? 초보자를 위한 내 간단한 자동식 식물 관수 시스템 만들기 튜토리얼에서 배워보세요.