---
title: "ESP32와 BME280을 이용한 웹 서버"
description: ""
coverImage: "/assets/img/2024-06-19-ESP32WebServerwithBME280_0.png"
date: 2024-06-19 05:53
ogImage: 
  url: /assets/img/2024-06-19-ESP32WebServerwithBME280_0.png
tag: Tech
originalTitle: "ESP32 Web Server with BME280"
link: "https://medium.com/@raflyhendrakusuma/esp32-web-server-with-bme280-ac98a4bda18a"
---


이 튜토리얼에서는 ESP32를 사용하여 BME280 센서 모듈의 측정 값을 표시하기 위한 웹 서버를 만드는 방법을 배울 것입니다. BME280 센서는 온도, 습도 및 기압을 측정하여 소형 기상 관측소를 구축하고 이러한 측정 값을 웹 서버를 통해 실시간으로 모니터링할 수 있게 합니다.

## 필요한 부품

- ESP32 DOIT DEVKIT V1 보드
- BME280 센서 모듈
- 브레드보드
- 점퍼 와이어

## BME280 센서 배선

<div class="content-ad"></div>

BME280 센서는 I2C 또는 SPI 통신 프로토콜을 사용할 수 있습니다. 간편하게 I2C를 사용하겠습니다. 다음과 같이 센서를 ESP32에 연결해 주세요:

- BME280 SCL을 ESP32 GPIO 22에 연결
- BME280 SDA를 ESP32 GPIO 21에 연결
- BME280 VCC를 ESP32 3.3V에 연결
- BME280 GND를 ESP32 GND에 연결

![image](/assets/img/2024-06-19-ESP32WebServerwithBME280_0.png)

## 필요한 라이브러리 설치

<div class="content-ad"></div>

BME280 센서에서 데이터를 읽으려면 Arduino IDE에 Adafruit_BME280 및 Adafruit_Sensor 라이브러리를 설치해야 합니다.

- Arduino IDE를 열고 스케치 `Include Library` Manage Libraries로 이동합니다.
- "Adafruit BME280"를 검색하여 라이브러리를 설치합니다.
- "Adafruit Unified Sensor"를 검색하여 라이브러리를 설치합니다.

![image](/assets/img/2024-06-19-ESP32WebServerwithBME280_1.png)

## BME280 센서 테스트

<div class="content-ad"></div>

센서가 올바르게 작동하는지 확인하기 위해 예제 스케치를 로드해주세요. 파일로 이동해서 `Examples` -> `Adafruit BME280 Library` -> `bme280test`로 이동해주세요.

```cpp
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BME280 bme; // I2C

void setup() {
    Serial.begin(9600);
    if (!bme.begin(0x76)) {
        Serial.println("유효한 BME280 센서를 찾을 수 없습니다. 연결을 확인해주세요!");
        while (1);
    }
}

void loop() {
    Serial.print("Temperature = ");
    Serial.print(bme.readTemperature());
    Serial.println(" *C");
    Serial.print("Pressure = ");
    Serial.print(bme.readPressure() / 100.0F);
    Serial.println(" hPa");
    Serial.print("Approx. Altitude = ");
    Serial.print(bme.readAltitude(SEALEVELPRESSURE_HPA));
    Serial.println(" m");
    Serial.print("Humidity = ");
    Serial.print(bme.readHumidity());
    Serial.println(" %");
    delay(1000);
}
```

코드를 업로드하고 센서의 값을 확인하려면 9600 보드로 속성 설정된 시리얼 모니터를 열어주세요.

## 웹 서버 생성

<div class="content-ad"></div>

이제 웹 서버를 만들어 센서 읽기를 테이블 형식으로 표시해 보겠습니다.

라이브러리 추가 및 변수 정의 포함

```js
cpp

#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>

#define SEALEVELPRESSURE_HPA (1013.25)
const char* ssid = "여러분의 SSID";
const char* password = "여러분의 비밀번호";
WiFiServer server(80);
Adafruit_BME280 bme; // I2C
void setup() {
  Serial.begin(115200);
  if (!bme.begin(0x76)) {
    Serial.println("유효한 BME280 센서를 찾을 수 없습니다. 연결을 확인하세요!");
    while (1);
  }
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi 연결됨.");
  Serial.println("IP 주소:");
  Serial.println(WiFi.localIP());
  server.begin();
}
void loop() {
  WiFiClient client = server.available();
  if (client) {
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            client.println("<style>body { font-family: \"Trebuchet MS\", Arial; text-align: center; }");
            client.println("table { margin-left:auto; margin-right:auto; border-collapse: collapse; width:35%; }");
            client.println("th, td { padding: 12px; border: 1px solid #ddd; }");
            client.println("th { background-color: #0043af; color: white; }");
            client.println("tr:hover { background-color: #bcbcbc; }");
            client.println("</style></head>");
            client.println("<body><h1>ESP32 with BME280</h1>");
            client.println("<table><tr><th>측정 항목</th><th>값</th></tr>");
            client.println("<tr><td>온도 섭씨</td><td>" + String(bme.readTemperature()) + " *C</td></tr>");
            client.println("<tr><td>온도 화씨</td><td>" + String(1.8 * bme.readTemperature() + 32) + " *F</td></tr>");
            client.println("<tr><td>압력</td><td>" + String(bme.readPressure() / 100.0F) + " hPa</td></tr>");
            client.println("<tr><td>대략적 고도</td><td>" + String(bme.readAltitude(SEALEVELPRESSURE_HPA)) + " m</td></tr>");
            client.println("<tr><td>습도</td><td>" + String(bme.readHumidity()) + " %</td></tr>");
            client.println("</table></body></html>");
            client.println();
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    client.stop();
    Serial.println("클라이언트 연결 해제됨.");
  }
}
```

코드를 업로드하고 실행해 주세요.

<div class="content-ad"></div>

ESP32에 코드를 업로드하고, 시리얼 모니터를 115200의 보레이트로 열어주세요. 표시된 IP 주소를 메모해주세요.

웹 서버에 액세스하기

브라우저를 열고 시리얼 모니터에 표시된 IP 주소를 입력해주세요. 표 형식의 웹 페이지에서 온도, 습도, 기압, 고도 정보가 표시될 것입니다. 

![ESP32 Web Server](/assets/img/2024-06-19-ESP32WebServerwithBME280_2.png)

<div class="content-ad"></div>

## 결론

ESP32를 사용하여 실시간 기상 데이터를 표시하는 웹 서버를 성공적으로 만들었습니다. 이 미니 기상 관측소는 홈 자동화, 환경 모니터링 및 교육 목적을 포함한 다양한 응용 프로그램에 사용할 수 있습니다. 웹 페이지의 모양과 기능을 향상시키기 위해 HTML 및 CSS를 자유롭게 사용해보세요. 즐거운 빌딩하세요!