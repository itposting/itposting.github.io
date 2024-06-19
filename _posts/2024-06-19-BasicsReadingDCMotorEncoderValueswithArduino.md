---
title: "기초 아두이노로 DC 모터 인코더 값을 읽는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-BasicsReadingDCMotorEncoderValueswithArduino_0.png"
date: 2024-06-19 17:46
ogImage: 
  url: /assets/img/2024-06-19-BasicsReadingDCMotorEncoderValueswithArduino_0.png
tag: Tech
originalTitle: "Basics: Reading DC Motor Encoder Values with Arduino"
link: "https://medium.com/@chrishio/basics-reading-dc-motor-encoder-values-with-arduino-2c185f3601ef"
---


본 예제는 동력 모터 인코더 값을 모니터링하는 방법을 학습하는 내용입니다. 제가 시작한곳은 https://www.electroniclinic.com/arduino-dc-motor-speed-control-with-encoder-arduino-dc-motor-encoder/ 인데, 이 예제에는 모터가 실제로 회전하지 않고 디지털 읽기 값을 아날로그 A2D 값인 것처럼 스케일링한다는 것을 발견했습니다.

아두이노는 처음이라서 이 과정의 모든 단계를 정말 이해하고 싶었습니다. 아래는 튜토리얼을 업데이트한 내용입니다.

우선, 좋은 자료가 있습니다. 무료로 직접 실행할 수 있습니다:

![이미지](/assets/img/2024-06-19-BasicsReadingDCMotorEncoderValueswithArduino_0.png)

<div class="content-ad"></div>

레이아웃 개요:

- 모터 전원 배선: 모터의 빨간색과 검은색 선은 12V 전원 공급원에 연결됩니다. 시뮬레이션된 모터는 완전한 속도로 작동하기 위해 시뮬레이션된 12V가 필요합니다.
- 인코더의 접지: 인코더의 접지는 녹색 선입니다.
- 인코더 출력: 보라색과 노란색 선은 인코더의 디지털 출력으로, 펄스를 아두이노에 보내어 모터의 위치에 따른 정보를 제공합니다. 핀 7 및 8에 특별한 기능이 있는 것은 아닙니다. 이것은 그냥 제가 사용하기로 선택한 핀입니다.
- 인코더 전원: 주황색 선은 인코더에 5V 전원을 공급합니다.

마크다운 형식으로 표를 변경하였습니다.

```js
// Define pins for encoder channels
#define encoder_ChA 7  // Channel A of the encoder connected to Digital Pin 7
#define encoder_ChB 8  // Channel B of the encoder connected to Digital Pin 8

// Variables to store the current state of encoder channels
int encoder_ChA_value;
int encoder_ChB_value;

void setup() {
   Serial.begin(9600); // Initialize serial communication at 9600 baud rate

   // Set encoder pins as inputs with internal pull-up resistors 
   // to avoid floating states and provide stable readings
   pinMode(encoder_ChA, INPUT_PULLUP); 
   pinMode(encoder_ChB, INPUT_PULLUP);
}

void loop() {
    // Read the current state of encoder channels
   encoder_ChA_value = digitalRead(encoder_ChA); 
   encoder_ChB_value = digitalRead(encoder_ChB); 
 
    // Print the encoder values to the serial monitor
   Serial.print(encoder_ChA_value); 
   Serial.print(" ");  // Separate the values with a space
   Serial.println(encoder_ChB_value);  // Print the second value and move to a new line
}
```

코드 개요:

<div class="content-ad"></div>

인코더 채널 정의: 코드의 시작부분에서 우리는 인코더 채널(encoder channels)을 위한 두 개의 상수(encoder_ChA와 encoder_ChB)를 정의합니다. 이렇게 하면 코드를 더 읽기 쉽게 만들고, 필요한 경우 핀을 전환해야 할 때 쉽게 수정할 수 있습니다. 핀 7과 8에 특별한 것은 없습니다. 그저 사용하기로 결정한 것뿐입니다.

- 변수 초기화: encoder_ChA_value와 encoder_ChB_value 변수는 각 인코더 채널로부터 현재 디지털 읽기(0 또는 1)를 저장하는 데 사용됩니다.
- 설정 함수: setup() 함수 안에서 시리얼 통신을 초기화하고, Arduino IDE의 시리얼 모니터에 인코더 읽기를 출력할 수 있습니다. 또한 인코더 핀들을 INPUT_PULLUP 모드로 입력 설정합니다. 풀업 저항을 사용하는 것은 `플로팅(floating)` 핀을 방지하여 일그러지거나 예측할 수 없는 읽기를 방지하는 데 중요합니다.
- 메인 루프: 프로그램의 핵심은 loop() 함수 안에 있습니다. digitalRead() 함수를 사용하여 계속해서 인코더 채널의 값을 읽습니다. 이러한 값은 시리얼 모니터에 출력되어, 우리는 실시간으로 인코더 출력을 볼 수 있습니다.

여기까지입니다. 시뮬레이션을 실행하면 모터가 회전함에 따라 2개의 디지털 핀이 0 또는 1의 값을 반환하는 것을 보게 될 것입니다. 이 인코더 데이터를 얻으면 모터 방향 감지, 위치 추적 및 속도 측정과 같은 작업을 수행할 수 있습니다.