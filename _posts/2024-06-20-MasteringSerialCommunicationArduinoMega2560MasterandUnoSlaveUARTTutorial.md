---
title: "시리얼 통신 마스터하기 아두이노 메가 2560 마스터와 우노 슬레이브 UART 튜토리얼"
description: ""
coverImage: "/assets/img/2024-06-20-MasteringSerialCommunicationArduinoMega2560MasterandUnoSlaveUARTTutorial_0.png"
date: 2024-06-20 16:52
ogImage: 
  url: /assets/img/2024-06-20-MasteringSerialCommunicationArduinoMega2560MasterandUnoSlaveUARTTutorial_0.png
tag: Tech
originalTitle: "Mastering Serial Communication: Arduino Mega 2560 (Master) and Uno (Slave) UART Tutorial"
link: "https://medium.com/@lekushlev/mastering-serial-communication-arduino-mega-2560-master-and-uno-slave-uart-tutorial-975ca9b165c6"
---



![이미지](/assets/img/2024-06-20-MasteringSerialCommunicationArduinoMega2560MasterandUnoSlaveUARTTutorial_0.png)

# 소개

아두이노 프로젝트의 영역에서 시리얼 통신은 기본적인 기술입니다. 이것은 새로운 언어로 대화하는 것을 배우는 것과 같습니다. 하지만 단어 대신에 전기 신호를 사용합니다. 이 튜토리얼에서는 두 가지 인기 있는 아두이노 보드인 메가 2560을 마스터로, 그리고 우노를 슬레이브로하여 UART (Universal Asynchronous Receiver-Transmitter) 통신을 설정하는 방법을 알아볼 것입니다. 이 안내서를 끝까지 따라오면 이 두 보드가 서로 '대화'할 수 있는 방법에 대해 명확히 이해하게 될 것입니다.

# 필요한 것


<div class="content-ad"></div>

- 1 x 아두이노 메가 2560
- 1 x 아두이노 우노
- 점퍼 와이어
- 아두이노 IDE

# 마스터 이해하기: 아두이노 메가 2560

# 설정

시리얼 포트 초기화: 우리의 메가 2560은 두 개의 시리얼 포트를 사용합니다. 디버깅용으로 Serial을 사용하고 Uno와 통신하기 위해 Serial1을 사용합니다.

<div class="content-ad"></div>

```js
Serial.begin(9600);
Serial1.begin(9600);
```

LED로 표시기 사용: 내장 LED를 사용하여 받은 데이터를 시각적으로 표현합니다.

```js
pinMode(LED_BUILTIN, OUTPUT);
digitalWrite(LED_BUILTIN, HIGH);
```

# 루프


<div class="content-ad"></div>

데이터 수신: Mega는 시리얼 포트에서 데이터를 기다립니다.

```js
if (Serial.available() > 0) {
   char received = Serial.read();
   ...
}
```

데이터 전달: 데이터를 수신하면 Mega는 동일한 데이터를 Serial1을 통해 Uno로 전달합니다.

```js
Serial1.write(received);
```

<div class="content-ad"></div>

데이터에 따른 조치: 받은 데이터가 '1'이면 LED가 꺼지고, '2'이면 켜집니다.

```js
if (received == '1') {
   digitalWrite(LED_BUILTIN, LOW);
} else if (received == '2') {
   digitalWrite(LED_BUILTIN, HIGH);
}
```

# 슬레이브 이해하기: 아두이노 우노

# 설정

<div class="content-ad"></div>

소프트웨어 시리얼: Uno는 하드웨어 시리얼 포트가 하나뿐이기 때문에, 우리는 SoftwareSerial을 사용하여 가상 시리얼 포트를 생성합니다.

```js
SoftwareSerial Serial1(10, 9); // RX, TX
```

시리얼 포트 초기화: 하드웨어 및 소프트웨어 시리얼 포트가 모두 초기화됩니다.

```js
Serial.begin(9600);
Serial1.begin(9600);
```

<div class="content-ad"></div>

# 루프

데이터 수신: Uno는 Mega로부터 소프트웨어 시리얼 포트에서 데이터를 수신합니다.

```js
if (Serial1.available() > 0) {
   char received = Serial1.read();
   ...
}
```

데이터 응답: Mega와 유사하게, Uno는 수신한 데이터를 사용하여 LED를 제어합니다.

<div class="content-ad"></div>


```js
if (received == '1') {
   digitalWrite(LED_BUILTIN, LOW);
} else if (received == '2') {
   digitalWrite(LED_BUILTIN, HIGH);
}
```

# 함께 모두 넣어봅시다

# 아두이노 메가 2560 (마스터)

```js
#include <SoftwareSerial.h>

void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.begin(9600);
    Serial1.begin(9600);
}

void loop() {
    if (Serial.available() > 0) {
        char received = Serial.read();
        Serial1.write(received);

        if (received == '1') {
            digitalWrite(LED_BUILTIN, LOW);
        } else if (received == '2') {
            digitalWrite(LED_BUILTIN, HIGH);
        }
    }
}
```


<div class="content-ad"></div>

# 아두이노 Uno (슬레이브)

```js
#include <SoftwareSerial.h>

SoftwareSerial Serial1(10, 9); // RX, TX

void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.begin(9600);
    Serial1.begin(9600);
}

void loop() {
    if (Serial1.available() > 0) {
        char received = Serial1.read();

        if (received == '1') {
            digitalWrite(LED_BUILTIN, LOW);
        } else if (received == '2') {
            digitalWrite(LED_BUILTIN, HIGH);
        }
    }
}
```

# 배선

5V to 5V 연결:

<div class="content-ad"></div>

- 아두이노 메가의 5V 핀을 아두이노 우노의 5V 핀에 연결하십시오. 이 단계에서 우노를 메가로부터 전원을 공급합니다.

그라운드 연결:

- 아두이노 메가의 GND(그라운드) 핀을 아두이노 우노의 GND 핀에 연결하십시오. 이 공통 그라운드는 올바른 통신을 위해 중요합니다.

TX에서 RX로 연결:

<div class="content-ad"></div>

- 아두이노 메가의 TX1 (송신) 핀을 아두이노 우노의 10번 핀에 연결하세요. 코드에서 우노의 SoftwareSerial에서 10번 핀을 RX (수신) 핀으로 설정해주세요.

컴퓨터 연결 및 시리얼 모니터:

- USB 케이블을 사용하여 아두이노 메가를 컴퓨터에 연결하세요.
- 아두이노 IDE를 열고 메가에 대한 올바른 COM 포트를 선택하세요.
- 아두이노 IDE에서 시리얼 모니터를 열어주세요. 이것은 메가에서 우노로 데이터를 보내는 데 사용될 것입니다.

이제 실험을 위한 설정이 완료되었습니다. 아두이노 IDE의 시리얼 모니터에 '1' 또는 '2'를 입력하면 (메가를 선택한 상태에서), 메가는 TX1을 통해 10번 핀에 데이터를 보내고, 우노는 수신된 데이터에 따라 LED를 켜거나 끌 것입니다.