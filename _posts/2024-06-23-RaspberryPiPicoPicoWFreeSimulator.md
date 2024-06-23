---
title: "라즈베리 파이 피코 W 무료 시뮬레이터 사용 방법"
description: ""
coverImage: "/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_0.png"
date: 2024-06-23 18:16
ogImage: 
  url: /assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_0.png
tag: Tech
originalTitle: "Raspberry Pi Pico Pico W Free Simulator"
link: "https://medium.com/@shilleh/raspberry-pi-pico-pico-w-free-simulator-899fbec34aaf"
---


<img src="/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_0.png" />

요즘, 라즈베리 파이 Pico 및 Pico W에서 코딩을 더 쉽게할 수 있는 유용한 도구를 발견했어요. wokwi.com에서 제공하는 무료 온라인 시뮬레이터인 Wokwi를 이용하면 물리 하드웨어가 필요하지 않은 채로 프로젝트를 쉽게 시뮬레이션할 수 있어요.

이 시뮬레이터를 통해 코드를 작성하고 테스트할 뿐만 아니라 다양한 외부장치 추가, 인터넷 연결, 그리고 어느 정도 실제 환경을 모방하여 전체적인 리얼 라이프 설정을 시뮬레이션할 수 있어요. 이는 프로젝트를 실제 하드웨어에 배포하기 전 가상 환경에서 실험하고 디버깅하여 완벽하게 만들 수 있게 해줍니다. 때로는 시간과 자원을 절약할 수도 있어요. 초보자든 숙련된 개발자든, Wokwi는 라즈베리 파이 Pico와 Pico W 개발 경험을 향상시킬 수 있는 강력한 플랫폼을 제공해요.

이 주제를 탐구하기 전, 우리의 지속적인 노력을 지원하고 여러분의 IoT 프로젝트를 향상시키기 위해 전용 플랫폼을 탐험해보라고 여러분을 초대해요:

<div class="content-ad"></div>

- YouTube 채널을 구독해주세요: Shilleh의 YouTube 채널에서 최신 튜토리얼과 프로젝트 통찰력을 확인하고 업데이트 받아보세요.
- 저희를 지원해주세요: 여러분의 지원은 소중합니다. Buy Me A Coffee에서 커피 한 잔 사주시면 품질 높은 콘텐츠 제작을 이어갈 수 있습니다.
- 전문 IoT 서비스를 고용해보세요: IoT 프로젝트에 대한 맞춤 지원이 필요하시다면 UpWork에서 저를 고용해주세요.

ShillehTek 웹사이트 (특별 할인):

[ShillehTek 웹사이트로 이동](https://shillehtek.com/collections/all)

ShillehTek 아마존 스토어:

<div class="content-ad"></div>

ShillehTek 아마존 스토어 — 미국

ShillehTek 아마존 스토어 — 캐나다

ShillehTek 아마존 스토어 — 일본

# 단계 1: Wokwi에 접속하기

<div class="content-ad"></div>

- Wokwi 방문: wokwi.com에 방문하여 무료 계정을 생성하세요. 이미 한 번도 방문한 적이 없다면 계정없이 시작할 수도 있습니다.
- Simulator 살펴보기: 인터페이스를 익히세요. 새 프로젝트 생성, 템플릿 보기, 예제 탐색 옵션을 볼 수 있습니다. Pico만 선택해야 하는 것은 아니며 다른 컨트롤러도 선택할 수 있습니다.

![그림](/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_1.png)

# 단계 2: 프로젝트 만들기

다양한 템플릿 프로젝트를 선택할 수 있습니다. 이 중 하나는 Pico SDK를 사용한 Blink LED 프로젝트입니다. C 언어를 위한 Pico SDK 설정은 초보자에게는 어려울 수 있지만 설정이 쉽게 가능한 환경에 액세스할 수 있다면, 시작하는 사람들에게 상당한 이점이 됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_2.png" />

<img src="/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_3.png" />

스크립트를 실행하면 오른쪽의 라즈베리 파이가 코드 지시에 따라 주기적으로 깜빡입니다.

그런 다음 IDE에서 MicroPython으로 동일한 기능을 만들 수 있습니다.

<div class="content-ad"></div>

1-) 다음 코드를 복사하여 붙여넣으세요:

```js
# Raspberry Pi Pico에서 LED를 깜박이게 하는 MicroPython 스크립트

from machine import Pin
import time

# 기본 LED 핀을 사용할 수 있는지 확인합니다.
try:
    LED_PIN = Pin(Pin.PICO_DEFAULT_LED_PIN, Pin.OUT)
except AttributeError:
    # PICO_DEFAULT_LED_PIN이 정의되어 있지 않으면 Pico의 기본 LED 핀인 핀 25를 사용합니다.
    LED_PIN = Pin(25, Pin.OUT)

# LED를 깜박입니다.
while True:
    LED_PIN.value(1)  # LED 켜기
    time.sleep(0.25)  # 250밀리초 동안 기다리기
    LED_PIN.value(0)  # LED 끄기
    time.sleep(0.25)  # 250밀리초 동안 기다리기
```

2-) 파일 이름을 .py 확장자로 변경해주세요

<img src="/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_4.png" />

<div class="content-ad"></div>

이제 동일한 결과를 확인하고 쉽게 코딩 언어를 전환할 수 있게 되었어요! 이것은 실제 Raspberry Pi Pico로는 쉽게 할 수 없는 일이죠.

# 단계 3: 주변 기기 사용하기

이 시뮬레이터의 멋진 점은 LED, 저항, 가속도계 등과 같은 다양한 일반 센서와 부품을 추가할 수 있다는 것이에요. 플러스 버튼을 사용하여 이러한 부품을 쉽게 추가하거나 이미 포함된 다른 프로젝트를 탐색할 수도 있어요.

![Raspberry Pi Pico with Free Simulator](/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_5.png)

<div class="content-ad"></div>

예를 들어, 간단한 프로젝트인 NeoPixel 링을 선택할 수 있습니다. 작동 방식은 다음을 참조해 보세요: [이 링크](https://wokwi.com/projects/314265138001609280)

![image1](/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_6.png)

![image2](/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_7.png)

실행을 시작하면 색상이 변경되는 것을 확인할 수 있습니다. 이는 아직 장치를 가지고 있지 않거나 NeoPixels를 구매하고 싶지 않은 초보자들에게 좋은 기회입니다.

<div class="content-ad"></div>

마지막으로, 또 다른 흥미로운 기능은 가속도계 입력 또는 일반적인 물리적 입력을 시뮬레이션하는 기능입니다. 가속도계는 데이터를 생성하기 위해 움직임이 필요하므로, 시뮬레이터는 수동으로 입력을 조절할 수 있는 슬라이딩 바를 제공합니다. 이 기능은 유용하지만, 실제 프로토 타입처럼 장치를 물리적으로 움직이지 못하는 제한점을 강조합니다. 아두이노와 MPU6050를 사용한 예제를 여기에서 볼 수 있습니다. 이 예제는 외부 코드를 가져오기도 하며, 시뮬레이터를 사용하여 모든 프로젝트에서 활용할 수 있는 기능입니다. 이 예제는 아두이노를 사용하지만, Pico 또는 Pico W로 동일한 기능을 달성할 수 있습니다. 코드가 실행되는 동안 MPU6050을 클릭하여 가속도 값을 조절하고 실제 생활 변화를 시뮬레이할 수 있습니다.

https://wokwi.com/projects/305937156771152449c

![image](/assets/img/2024-06-23-RaspberryPiPicoPicoWFreeSimulator_8.png)

# 결론

<div class="content-ad"></div>

마지막으로, 시뮬레이터는 가속도계, LED 등 다양한 센서와 구성 요소를 사용하기 편리하고 유연한 방법을 제공합니다. 외부 코드를 가져오고 센서 입력을 수동으로 시뮬레이션하는 기능은 소중한 학습 및 프로토타입 기회를 제공합니다. 그러나 정확한 물리적 움직임을 재현할 수 없는 등 제한 사항이 있습니다. 이러한 단점들을 감안해도, 이것은 초보자와 숙련된 개발자 모두에게 강력한 도구로 남아 있습니다.
만약 이 정보가 유용하다고 생각된다면, 더 많은 자습서 및 통찰력을 위해 저의 Medium과 YouTube를 팔로우하세요!