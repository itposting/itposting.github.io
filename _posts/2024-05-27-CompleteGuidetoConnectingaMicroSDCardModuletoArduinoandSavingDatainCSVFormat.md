---
title: "아두이노에 마이크로SD 카드 모듈을 연결하고 CSV 형식으로 데이터를 저장하는 완벽한 가이드"
description: ""
coverImage: "/assets/img/2024-05-27-CompleteGuidetoConnectingaMicroSDCardModuletoArduinoandSavingDatainCSVFormat_0.png"
date: 2024-05-27 13:38
ogImage:
  url: /assets/img/2024-05-27-CompleteGuidetoConnectingaMicroSDCardModuletoArduinoandSavingDatainCSVFormat_0.png
tag: Tech
originalTitle: "Complete Guide to Connecting a MicroSD Card Module to Arduino and Saving Data in CSV Format"
link: "https://medium.com/@madhurajayashanka/complete-guide-to-connecting-a-microsd-card-module-to-arduino-and-saving-data-in-csv-format-1f30a163cab"
---

# 소개

아두이노 프로젝트의 세계에서 데이터 기록은 시간에 따라 다양한 매개변수를 기록하고 분석하는 데 중요한 역할을 합니다. 이를 달성하는 인기있는 방법 중 하나는 MicroSD 카드 모듈을 사용하여 CSV (쉼표로 구분된 값)와 같은 구조화된 형식으로 데이터를 저장하는 것입니다. 이 포괄적인 안내서에서는 MicroSD 카드 모듈을 아두이노 보드에 연결하는 과정, CSV 파일에 데이터를 생성하고 저장하는 코드 작성 방법, 그리고 데이터 기록 프로젝트가 원할하게 실행되도록 하는 방법을 안내해 드리겠습니다.

# 목차

- MicroSD 카드 모듈 이해하기
- MicroSD 카드 모듈이란?
- 데이터 저장을 위한 MicroSD 선택 이유
- 호환 가능한 아두이노 보드
- MicroSD 카드 모듈 연결하기
- 필요한 구성품
- 핀 연결(다이어그램)
- 연결 지침
- MicroSD 카드 초기화하기
- 필요한 라이브러리 설치
- MicroSD 카드 모듈 초기화
- 초기화 오류 처리
- 데이터 구조 생성
- 데이터 필드 선택
- CSV 형식에 맞춤 데이터 구성
- CSV 형식의 장점
- 아두이노 코드 작성
- 전역 변수 설정
- 시리얼 통신 초기화
- MicroSD 카드 초기화
- CSV 파일에 데이터 생성 및 저장
- 샘플 코드 조각들
- 테스트 및 디버깅
- 아두이노에 코드 업로드
- 시리얼 출력 모니터링
- CSV 파일의 데이터 확인
- 결론

<div class="content-ad"></div>

# 마이크로SD 카드 모듈 이해

마이크로SD 카드 모듈은 작은 전자 장치로, 마이크로SD 카드에 데이터를 읽고 쓸 수 있게 해줍니다. 아두이노 프로젝트의 데이터 저장 용량을 확장하는 간편한 방법을 제공합니다. 마이크로SD 카드는 여러 저장 용량으로 다양하게 제공되며, 다양한 데이터 기록 애플리케이션에 적합합니다.

# 마이크로SD 카드 모듈 배선

프로젝트를 시작하려면 다음 구성 요소가 필요합니다:

<div class="content-ad"></div>

- 아두이노 보드
- MicroSD 카드 모듈
- 점퍼 와이어

정확한 핀 구성을 위해서 MicroSD 카드 모듈의 데이터 시트를 참조하세요. 일반적으로 연결은 모듈 핀을 적절한 아두이노 핀에 연결하는 것을 포함합니다. 예를 들면:

- 모듈 CS (Chip Select) 핀을 아두이노 디지털 핀 10에 연결
- 모듈 MOSI (Master Out Slave In) 핀을 아두이노 디지털 핀 11에 연결
- 모듈 MISO (Master In Slave Out) 핀을 아두이노 디지털 핀 12에 연결
- 모듈 SCK (Serial Clock) 핀을 아두이노 디지털 핀 13에 연결
- 모듈 VCC를 아두이노 5V 핀에 연결
- 모듈 GND를 아두이노 GND 핀에 연결

![이미지](/assets/img/2024-05-27-CompleteGuidetoConnectingaMicroSDCardModuletoArduinoandSavingDatainCSVFormat_0.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-CompleteGuidetoConnectingaMicroSDCardModuletoArduinoandSavingDatainCSVFormat_1.png" />

# MicroSD 카드 초기화하기

MicroSD 카드 모듈을 사용하려면 Arduino IDE에 필요한 라이브러리를 포함해야 합니다. 인기 있는 라이브러리로는 "SD.h"와 "SPI.h"가 있습니다. 라이브러리를 초기화한 후에는 MicroSD 카드를 올바르게 초기화하고 카드의 존재 여부를 확인하는 코드를 작성할 수 있습니다.

```js
#include <SPI.h>
#include <SD.h>

const int chipSelect = 10;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(chipSelect)) {
    Serial.println("카드 초기화 실패!");
    return;
  }
  Serial.println("카드 초기화됨.");
}

void loop() {
  // 여기에 데이터 기록 코드를 추가하세요
}
```

<div class="content-ad"></div>

# 데이터 구조 생성

데이터 기록을 시작하기 전에 기록하려는 필드를 결정하는 것이 중요합니다. 센서 읽기, 타임스탬프 및 기타 관련 정보를 포함할 수 있습니다. 데이터를 구조화하는 것은 가독성과 분석에 중요합니다. CSV 형식은 인간이 읽을 수 있고 널리 지원되는 훌륭한 선택입니다.

# 아두이노 코드 작성

데이터에 대한 전역 변수를 설정하고 디버깅을 위해 시리얼 통신을 초기화합니다. 또한 MicroSD 카드에 CSV 파일에 데이터를 기록하는 함수를 정의해야 합니다. 다음은 간단화된 예시입니다:

<div class="content-ad"></div>


#include <SPI.h>
#include <SD.h>

const int chipSelect = 10;
File dataFile;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(chipSelect)) {
    Serial.println("Card initialization failed!");
    return;
  }
  Serial.println("Card initialized.");

  dataFile = SD.open("data.csv", FILE_WRITE);
  if (dataFile) {
    dataFile.println("Timestamp, SensorValue1, SensorValue2");
    dataFile.close();
  }
}

void loop() {
  // Read sensor values and get timestamp
  String data = getTimeStamp() + "," + String(sensorValue1) + "," + String(sensorValue2);
  writeDataToCSV(data);
  delay(1000);
}

void writeDataToCSV(String data) {
  dataFile = SD.open("data.csv", FILE_WRITE);
  if (dataFile) {
    dataFile.println(data);
    dataFile.close();
  }
}

String getTimeStamp() {
  // Implement your timestamp logic here
}

# Testing and Debugging

Upload your code to the Arduino board and open the Serial Monitor. Ensure that the initialization messages are displayed without errors. As your code logs data, you should see the CSV file being populated on the MicroSD card.

# Conclusion


<div class="content-ad"></div>

축하합니다! 아두이노 보드와 MicroSD 카드 모듈을 인터페이스하는 방법을 성공적으로 배우셨습니다. CSV 형식으로 데이터를 저장하는 데이터 로깅 시스템을 만들었습니다. 이 다재다능한 설정은 환경 모니터링부터 산업 자동화까지 다양한 응용 프로그램을 열어줍니다. 아두이노와 데이터 로깅의 세계를 계속 탐험하면서 여러분이 여기서 배운 내용을 미래 프로젝트에 적응하고 확장해 나가길 기억해 주세요. 즐거운 창조 활동 되세요!
