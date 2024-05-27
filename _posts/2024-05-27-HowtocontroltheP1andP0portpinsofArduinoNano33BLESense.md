---
title: "아두이노 나노 33 BLE Sense의 P1 및 P0 포트 핀을 제어하는 방법"
description: ""
coverImage: "/assets/img/2024-05-27-HowtocontroltheP1andP0portpinsofArduinoNano33BLESense_0.png"
date: 2024-05-27 13:42
ogImage:
  url: /assets/img/2024-05-27-HowtocontroltheP1andP0portpinsofArduinoNano33BLESense_0.png
tag: Tech
originalTitle: "How to control the P1 and P0 port pins of Arduino Nano 33 BLE Sense"
link: "https://medium.com/@samueladesola/how-to-control-the-p1-and-p0-port-pins-of-arduino-nano-33-ble-sense-86d0b7002b97"
---

안녕하세요! 이 간단한 안내서에 오신 것을 환영합니다. 바로 시작해 봅시다. 기존의 아두이노 보드인 UNO, 나노 등은 핀 번호매기기를 기준으로 배치되어 있습니다. 디지털 및 아날로그 핀을 쉽게 다룰 수 있으며 아두이노 스케치에서 GPIO 핀을 쉽게 다룰 수 있어요. 매핑(mapping)이나 핀 가용성에 대해 걱정할 필요가 없습니다.

아두이노 나노 33 BLE Sense가 등장하면서 함께 공부해야할 것이 몇 가지 있습니다. 첫째, 이 보드는 마이크로컨트롤러 nrf52840을 사용하며 다양한 핀(약 48핀)을 가지고 있습니다. 우리는 이 중에서 아두이노 나노 33 BLE Sense가 지원하는 핀들을 제어할 수 있습니다. 둘째, 이 보드에는 Port 0 및 Port 1과 같이 두 가지 포트 핀이 있습니다. 마지막으로, 이 보드를 프로그래밍하는 두 가지 방법이 있습니다: 전통적인 아두이노 방법 또는 Real-Time Operating System (RTOS)을 사용하는 방법입니다. 이 방법이 더 나은 방법이며 권장되는 방법입니다.

이제 아래 다이어그램을 살펴보세요.

<div class="content-ad"></div>


![Arduino Nano 33 BLE Sense Pinout](/assets/img/2024-05-27-HowtocontroltheP1andP0portpinsofArduinoNano33BLESense_1.png)

This information was sourced from the board’s pinout: [Pinout-NANOsense_latest.pdf](https://content.arduino.cc/assets/Pinout-NANOsense_latest.pdf)

One interesting aspect you'll notice is the pins labeled with D and A, such as D1, D2, and so on. These labels map the original nRF52840 pins to an Arduino-like naming convention. Essentially, this allows us to write Arduino code and refer to the pins using these D and A designations, following the traditional Arduino approach. For instance, if we want to make an LED connected to D6 blink, we can use the following code:

```js
int led = 6;

void setup(){
  pinMode(led, OUTPUT);
}

void loop(){
  digitalWrite(led, HIGH);
  delay(1000);
  digitalWrite(led, LOW);
  delay(1000);
}
```

<div class="content-ad"></div>

위 대화는 기본적으로 일을 처리하는 간단한 방법이긴 하지만, Nano 33 BLE Sense 보드에는 권장되지 않습니다. 따라서 RTOS의 방식을 따라야 합니다. 현재 발생한 문제는 mbed.h 헤더 파일을 통해 RTOS를 사용하여 보드를 프로그래밍할 때 Arduino 핀 번호를 사용할 수 없다는 것입니다. 그렇다면 핀 번호를 어떻게 얻을까요? 위에서 언급한 도표로 돌아가 보겠습니다. P0.13 형태의 0번 포트 핀과 P1.02 형태의 1번 포트 핀을 사용할 것입니다.

## 핀 번호를 어떻게 얻을까요?

예를 들어 P1.14 핀 (D6)을 사용하려면 32를 1 (P1 부분)로 곱하고 14 (.14 부분)를 더해야 합니다.

다시 말씀드리면:

<div class="content-ad"></div>

P1.14 = 32 \* 1 + 14 = 46 = p46;

P0.13 = 32\*0 + 13 = 13 = p13;

선행하는 "p" 즉 p46와 같은 것을 추가해야 합니다. mbed.h RTOS 라이브러리를 사용하여 LED를 튜닝하는 예제를 살펴보겠습니다:

```js
#include "mbed.h"

// D6 - P1.14
//D13 - P0.13 = 32 * 0 + 13 = 13 = p13
// 32 * 1 + 14 = 32 + 14 = 46 = p46

static const PinName led = p46 //계산 결과를 확인하세요, D6 핀과 동일한 것입니다

static mbed::DigitalOut myLed(led);

void setup() {

}

void loop() {
myLed = 1;
}
```

<div class="content-ad"></div>

그게 다에요. 올바른 계산만 하면 Nano 33 BLE Sense 보드의 모든 GPIO 핀을 제어할 수 있어요.

더 배우고 데모를 보려면 이 TinyML 튜토리얼 시리즈의 영상을 확인해보세요: [https://youtu.be/VDJx7d4BaVg](https://youtu.be/VDJx7d4BaVg)
