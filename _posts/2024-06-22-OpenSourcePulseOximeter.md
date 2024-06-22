---
title: "오픈 소스 맥박산소측정기, 직접 만들어보기"
description: ""
coverImage: "/assets/img/2024-06-22-OpenSourcePulseOximeter_0.png"
date: 2024-06-22 17:55
ogImage: 
  url: /assets/img/2024-06-22-OpenSourcePulseOximeter_0.png
tag: Tech
originalTitle: "Open Source Pulse Oximeter"
link: "https://medium.com/@nandasiddhardha/open-source-pulse-oximeter-90c0e3b89628"
---


이 프로젝트에서 사용된 항목

전체 장치는 44mm x 30mm 퍼프 보드에 부착된 Arduino Nano를 중심으로 설계되었습니다. 먼저, 센서의 VIN, GND, SDA 및 SCL 핀에 전선을 납땜한 다음, 그 전선은 침대 부품 아래를 따라 Arduino Nano로 연결됩니다.

<div class="content-ad"></div>

다음으로, OLED에 대한 커넥터를 Nano에 연결한 다음 디스플레이에 연결합니다. 마지막으로, 전체 전자 어셈블리를 하우징에 밀어 넣고 몇 개의 3mm 나사로 고정합니다.

![이미지](/assets/img/2024-06-22-OpenSourcePulseOximeter_2.png)

전자기기가 삽입된 후에 OLED 화면을 상단 부분에 연결하고 나머지 샤시에 몇 개의 3mm 나사로 고정합니다. 뚜껑을 부드럽게 위아래로 움직여 움직임을 테스트할 수 있습니다.

포함된 스케치는 사용자의 현재 심박수와 산소 포화도를 표시하기 위해 몇 가지 작업을 수행합니다. 업로드하려면 필요한 라이브러리를 설치하고 도구 메뉴에서 Arduino Nano를 보드 목록에서 선택한 다음 업로드를 클릭하면 됩니다. 스케치 자체는 OLED 및 MAX30102를 초기화하고 에러가 발생할 경우 보고합니다. 그런 다음 센서를 보정하기 위해 100개의 값을 읽고 이를 표시하기 시작합니다. 장치는 그런 다음 25개의 새 값들을 읽고 이들로 이동 평균을 계산하는 루프에 진입합니다. 마지막으로 값이 유효한지 확인하고 유효하다면 화면에 인쇄합니다.

<div class="content-ad"></div>

펄스 옥시미터를 사용하려면 손가락 끝을 센서 위에 올려놓고 부드럽게 뚜껑을 닫으세요. 그런 다음 전원 공급원을 꽂고 데이터가 표시될 때까지 기다리기만 하면 됩니다.

![이미지](/assets/img/2024-06-22-OpenSourcePulseOximeter_3.png)

![이미지](/assets/img/2024-06-22-OpenSourcePulseOximeter_4.png)

![이미지](/assets/img/2024-06-22-OpenSourcePulseOximeter_5.png)

<div class="content-ad"></div>

# 펄스 옥시미터 코드

C/C++

```js
/*
  하드웨어 연결 (Breakoutboard to Arduino):
  -5V = 5V (3.3V 사용 가능)
  -GND = GND
  -SDA = A4 (또는 SDA)
  -SCL = A5 (또는 SCL)
  -INT = 연결하지 않음

  MAX30105 브레이크아웃은 5V 또는 3.3V I2C 로직을 처리할 수 있습니다. 보드를 5V로 전원 공급하는 것을 권장하지만 3.3V에서도 작동합니다.
*/

#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include "SSD1306Ascii.h"
#include "SSD1306AsciiWire.h"

MAX30105 particleSensor;
SSD1306AsciiWire oled;

#define MAX_BRIGHTNESS 255

#if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)
// 아두이노 Uno에는 50개의 IR LED 데이터 및 빨간 LED 데이터를 32비트 형식으로 저장할 충분한 SRAM이 없습니다.
// 이 문제를 해결하기 위해 샘플 데이터의 16비트 MSB가 잘립니다. 샘플이 16비트 데이터로 변환됩니다.
uint16_t irBuffer[50]; // 적외선 LED 센서 데이터
uint16_t redBuffer[50];  // 빨간색 LED 센서 데이터
#else
uint32_t irBuffer[50]; // 적외선 LED 센서 데이터
uint32_t redBuffer[50];  // 빨간색 LED 센서 데이터
#endif

int32_t spo2; // SPO2 값
int8_t validSPO2; // SPO2 계산이 유효한지를 나타내는 표시기
int32_t heartRate; // 심박수 값
int8_t validHeartRate; // 심박수 계산이 유효한지를 나타내는 표시기

void setup()
{
  Serial.begin(115200); // 초당 115200비트로 시리얼 통신 초기화:

  oled.begin(&Adafruit128x64, 0x3C);
  oled.setFont(Arial14);

  // 센서 초기화
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) // 기본 I2C 포트, 400kHz 속도 사용
  {
    Serial.println(F("MAX30105를 찾을 수 없습니다. 배선/전원을 확인하세요."));
    while (1);
  }

  particleSensor.setup(55, 4, 2, 200, 411, 4096); // 이러한 설정으로 센서 구성
}

void loop()
{

  // 처음 50개 샘플을 읽고 신호 범위를 결정합니다.
  for (byte i = 0 ; i < 50 ; i++)
  {
    while (particleSensor.available() == false) // 새 데이터가 있는지 확인
      particleSensor.check(); // 새 데이터가 있는지 확인

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); // 이 샘플은 완료되었으므로 다음 샘플로 이동
    Serial.print(F("빨강="));
    Serial.print(redBuffer[i], DEC);
    Serial.print(F(", 적외선="));
    Serial.println(irBuffer[i], DEC);
  }

  // 처음 50개 샘플(총 4초의 샘플) 후에 심박수 및 SpO2 계산
  maxim_heart_rate_and_oxygen_saturation(irBuffer, 50, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  // MAX30102에서 지속적으로 샘플을 채취합니다. 1초마다 심박수와 SpO2를 계산합니다.
  while (1)
  {
    // 메모리에 처음 25개 세트의 샘플을 버리고 마지막 25개 세트의 샘플을 맨 위로 이동합니다.
    for (byte i = 25; i < 50; i++)
    {
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }

    // 심박수를 계산하기 전에 25개 세트의 샘플을 채취합니다.
    for (byte i = 25; i < 50; i++)
    {
      while (particleSensor.available() == false) // 새 데이터가 있는지 확인
        particleSensor.check(); // 새 데이터가 있는지 확인

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample(); // 이 샘플은 완료되었으므로 다음 샘플로 이동
      Serial.print(F("빨강="));
      Serial.print(redBuffer[i], DEC);
      Serial.print(F(", 적외선="));
      Serial.print(irBuffer[i], DEC);

      Serial.print(F(", 심박수="));
      Serial.print(heartRate, DEC);

      Serial.print(F(", 심박수유효="));
      Serial.print(validHeartRate, DEC);

      Serial.print(F(", SPO2="));
      Serial.print(spo2, DEC);

      Serial.print(F(", SPO2유효="));
      Serial.println(validSPO2, DEC);
      
    }

    // 25개의 새로운 샘플을 수집한 후 HR 및 SP02를 재계산합니다.
    maxim_heart_rate_and_oxygen_saturation(irBuffer, 50, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
    printToScreen();
  }
}

void printToScreen() {
  oled.clear();
  oled.setCursor(0,0);
  if(validSPO2 && validHeartRate) {
    oled.print(F("HR: ")); oled.println(heartRate, DEC);
    oled.print(F("SPO2: ")); oled.println(spo2, DEC);
  } else {
    oled.print(F("유효하지 않습니다"));
  }
}
```