---
title: "아두이노 우노와 초음파 센서를 연결하기"
description: ""
coverImage: "/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_0.png"
date: 2024-05-27 13:36
ogImage:
  url: /assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_0.png
tag: Tech
originalTitle: "Interfacing Ultrasonic Sensor with Arduino Uno"
link: "https://medium.com/@nprajwal40/interfacing-ultrasonic-sensor-with-arduino-uno-522eccc3c930"
---

# 소개

초음파 센서는 정확한 거리 측정 기능을 제공하여 전자 분야를 혁신했습니다. 이 블로그 포스트에서는 다재다능한 아두이노 Uno 보드와 초음파 센서를 어떻게 연결하는지 살펴보겠습니다. 센서와 마이크로컨트롤러의 세계로 들어가 이 기술의 전체 잠재력을 펼쳐 봅시다.

![Ultrasonic Sensor with Arduino Uno](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_0.png)

# 초음파 센서란 무엇인가요?

<div class="content-ad"></div>

초음파 센서는 거리 측정과 장애물 감지에 사용되는 장치입니다. 초음파 센서는 소리 파장을 사용하여 센서와 물체 사이의 거리를 확인합니다. 이들은 전기 신호를 고주파 초음파로 변환합니다. 초음파의 주파수는 인간의 청각 범위를 넘어갑니다. 그들은 고주파수 소리 펄스를 방출하고 소리 파장이 튕겨 돌아오는 데 걸리는 시간을 측정하여 소리의 속도를 기반으로 거리를 계산합니다.

## 초음파 센서의 간략한 작동 방식

![이미지](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_1.png)

센서는 송신기와 수신기로 구성되어 있습니다. 송신기는 초음파를 발사하고, 해당 파장이 물체에서 반사된 후 수신기에 의해 감지됩니다. 발사와 수신 사이의 시간을 측정함으로써 센서는 정확하게 거리를 결정할 수 있습니다.

<div class="content-ad"></div>

트리거 핀에 10us의 짧은 펄스가 주어지면 거리 측정을 시작합니다. 그런 다음 송신기가 40KHz 펄스의 8주기를 보내고 수신기를 사용하여 반사된 펄스(Echo 신호)를 청취하기 시작합니다. 트리거 신호를 보내고 에코 신호를 수신하는 시간 간격을 측정하여 거리를 계산합니다.

# 초음파 센서 개요

HC-SR04 초음파 센서는 2cm에서 400cm까지의 거리를 측정할 수 있는 저비용이면서 신뢰할 수 있는 센서입니다. VCC, Trig, Echo 및 GND 네 개의 핀으로 구성되어 있습니다.

기술 사양:

<div class="content-ad"></div>


![Arduino Uno Overview](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_2.png)

# Arduino Uno에 대한 개요

![Arduino Uno](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_3.png)

Arduino Uno는 디지털 및 아날로그 입출력 핀이 장착된 인기 있는 마이크로컨트롤러 보드입니다. 간편함과 다양성으로 인해 프로토타입 및 DIY 프로젝트에 널리 사용됩니다.


<div class="content-ad"></div>

- 1단계: 배선 설정 ... (초음파 센서 핀에 해당하는 아두이노 핀 연결)

![Image](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_4.png)

1. VCC를 아두이노 우노의 5V에 연결합니다.
2. GND를 아두이노 우노의 GND에 연결합니다.

<div class="content-ad"></div>

3. 아두이노 우노에 트리그 핀을 디지털 핀 7에 연결하세요.

4. 아두이노 우노에 에코 핀을 디지털 핀 6에 연결하세요.

2단계: 초음파 센서와 통신하는 코드 작성하기

- 아두이노 IDE를 열기
- `파일` 새로운 스케치 `` 아래에 제공된 코드를 붙여넣기.
- `도구` 보드 `아두이노 AVR 보드` 아두이노 우노 클릭.
- `도구` 포트 `` 적절한 포트를 선택.
- 왼쪽 상단의 " -` " 버튼을 클릭하거나 코드를 업로드하려면 "Ctrl + U""를 누르세요.

<div class="content-ad"></div>

Step 3: 테스팅 및 유효성 검사:

![image](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_5.png)

핀을 올바르게 연결한 후 Arduino Uno를 켭니다. 시리얼 모니터를 사용하여 초음파 센서에서 거리 측정 값을 표시합니다. 이 단계에서 배선이 정확히 완료되었는지 확인할 수 있습니다.

- `도구` 및 `시리얼 모니터`를 클릭하여 Baud rate를 9600으로 설정합니다.
- 이제 PC에서 읽기를 모니터링할 수 있습니다.

<div class="content-ad"></div>

Step 4: 시리얼 모니터에서 출력하세요.

![이미지](/assets/img/2024-05-27-InterfacingUltrasonicSensorwithArduinoUno_6.png)

## 코드:

```js
// RoboElectra_Innovations

const int trigPin = 7;
const int echoPin = 6;
long duration;
int distance;

void setup()
{
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop()
{
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = (duration * 0.0343) / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(500);
}
```

<div class="content-ad"></div>

# 코드 설명:

```js
const int trigPin = 7;
const int echoPin = 6;
long duration;
int distance;
```

- 'trigPin'과 'echoPin'은 각각 초음파 센서의 트리거 핀과 에코 핀에 연결된 아두이노의 디지털 핀을 정의하는 상수입니다.
- 'duration'은 물체까지 초음파 파동이 이동하는 데 걸린 시간을 저장하는 변수입니다.
- 'distance'는 계산된 물체까지의 거리를 저장하는 변수입니다.

```js
void setup();
{
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}
```

<div class="content-ad"></div>

- 'Void Setup' 함수 안의 코드는 한 번만 실행됩니다.
- pinMode(trigPin, OUTPUT)은 초음파 펄스를 보내기 위해 트리거 핀을 출력으로 설정합니다.
- pinMode(echoPin, INPUT)은 물체로부터 반사된 신호를 읽기 위해 에코 핀을 입력으로 설정합니다.
- Serial.begin(9600)은 아두이노가 컴퓨터로 데이터를 보낼 수 있도록 전송 속도가 9600 비트로 설정하는 시리얼 통신을 초기화합니다.

```js
void loop()
 {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
```

- 이 코드 섹션은 트리거 핀을 10uS 동안 펄스로 발생시킵니다.

```js
duration = pulseIn(echoPin, HIGH);
distance = (duration * 0.0343) / 2;
```

<div class="content-ad"></div>

- duration = pulseIn(echoPin, HIGH) 함수는 에코 핀이 고조파로 유지되는 시간(마이크로초)을 측정하여, 초음파 펄스가 물체까지 이동한 시간을 의미합니다.
- 소리의 속도는 대략 1초에 343미터, 즉 1마이크로초당 0.0343센티미터입니다. 물체까지의 거리는 펄스의 총 이동 거리의 절반이므로, 2로 나누어야 합니다.

```js
Serial.print("거리: ");
Serial.print(distance);
Serial.println(" 센티미터");
delay(500);
```

- 아두이노 IDE의 시리얼 모니터에 데이터를 출력합니다.

# 실용적 응용분야

<div class="content-ad"></div>

**초음파 센서를 사용한 거리 측정:**
초음파 센서는 주차 센서, 수위 모니터링 및 로봇 과 같은 자동화 시스템에서 널리 사용되며 정밀한 거리 측정 요구 사항을 충족합니다.

**로봇 프로젝트에 센서 적용하기:**
로봇 프로젝트에서 초음파 센서를 통합하면 로봇이 알 수 없는 환경에서 항해하고 장애물을 피하며 자율성을 향상시킬 수 있습니다.

**센서의 추가 기능 탐구:**
거리 측정 이상으로 초음파 센서는 물체 추적, 제스처 인식 및 스마트 시스템에서의 장애물 감지에 활용되어 기능성을 향상시킬 수 있습니다.

# 자주 묻는 질문 (FAQs)

<div class="content-ad"></div>

**질문: 다른 Arduino 보드와 함께 어떤 종류의 초음파 센서를 사용할 수 있나요?**

- 대부분의 초음파 센서는 Arduino Uno 및 해당 모든 변형과 호환되지만, 프로젝트를 시작하기 전에 호환성을 확인하는 것이 좋습니다.

**질문: 센서를 연결할 때 피해야 할 일반적인 실수는 무엇인가요?**

- 일반적인 실수에는 부정확한 배선 연결, Arduino Uno의 잘못된 핀 사용 및 코딩 오류가 포함됩니다. 모든 연결 및 코드를 두 번 확인하면 이러한 문제를 방지할 수 있습니다.

<div class="content-ad"></div>

- 초음파 센서로 탐색할 수 있는 고급 기능이 있나요?

* 네, 초음파 센서는 거리 측정 이상의 응용 프로그램을 갖고 있습니다. 장애물 감지, 물체 추적, 제스처 인식 등이 그 예시입니다. 다양한 코드와 설정을 실험해보면 센서의 최대 잠재력을 발휘할 수 있습니다.
