---
title: "NodeMCU ESP8266과 LM35 온도 센서를 사용해 웹 서버 구축하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_0.png"
date: 2024-06-23 17:43
ogImage: 
  url: /assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_0.png
tag: Tech
originalTitle: "Building a Web Server with NodeMCU ESP8266 and LM35 Temperature Sensor"
link: "https://medium.com/@bernard.adhitya/building-a-web-server-with-nodemcu-esp8266-and-lm35-temperature-sensor-d4db54bf6113"
---


환경 데이터를 간단한 웹 인터페이스를 통해 모니터링할 수 있는 능력은 굉장히 유용할 수 있습니다. 이 기사에서는 저가 참여한 프로젝트에 대해 소개하려고 합니다. NodeMCU ESP8266 모듈과 LM35 온도 센서를 사용하여 온도를 표시하는 웹 서버를 만들었습니다. 이 프로젝트는 IoT 원칙의 실용적인 응용뿐만 아니라 센서, 마이크로컨트롤러 및 웹 기술을 통합하는 쉬움을 보여줍니다.

# 프로젝트 개요

![프로젝트 이미지](/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_0.png)

이 프로젝트의 목표는 LM35 센서에서 온도 데이터를 읽고 해당 데이터를 지역 네트워크 내에서 접근 가능한 웹 페이지에 표시할 수 있는 NodeMCU ESP8266 웹 서버를 설정하는 것이었습니다. LM35 센서는 섭씨 온도에 직접 상응하는 간단한 출력으로 선택되어, 복잡한 보정이 필요하지 않은 우리의 요구에 이상적입니다.

<div class="content-ad"></div>

# 필요한 재료

- NodeMCU ESP8266 보드
- LM35 온도 센서
- 브레드보드와 연결용 와이어
- 프로그래밍 및 전원 공급을 위한 미니 USB 케이블

# LM35 온도 센서 이해

LM35 온도 센서는 사용 편의성과 정확한 온도 측정으로 널리 애용되는 정밀 통합 회로 장치입니다. 복잡한 계산이나 교정 없이 온도를 직접 출력하기 때문에 저희 프로젝트와 같은 작업에 매우 유용합니다.

<div class="content-ad"></div>

LM35 센서는 섭씨 온도에 비례하는 아날로그 전압을 출력하여 온도를 측정합니다. 스케일 팩터는 10 mV/°C이며, 이는 1도 섭씨 증가당 출력 전압이 10 밀리볼트 증가한다는 것을 의미합니다. 이 특성은 NodeMCU ESP8266과 같은 마이크로콘트롤러와 간편하게 통합할 수 있습니다.

# 전압을 온도로 변환하기

LM35에서의 아날로그 전압 측정값을 온도로 변환하기 위해 우리는 다음 공식을 사용합니다:


![이미지](/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_1.png)


<div class="content-ad"></div>

저희 NodeMCU ESP8266 세팅에서 ADC(아날로그-디지털 변환기) 참조 전압이 3.3V이고 해상도가 10비트인 경우, 최대 읽을 수 있는 전압은 3.3V(또는 3300mV)이며 1024등분(2¹⁰ = 1024)할 수 있습니다. 따라서 각 ADC 값을 나타내는 단위는 3300/1024 mV가 됩니다. 아래는 코드에서 이를 구현하는 방법입니다:

A0 핀에 연결된 LM35에서 아날로그 값을 읽습니다.

이 값을 전압으로 변환합니다:

<img src="/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_2.png" />

<div class="content-ad"></div>

전압을 온도로 변환해 주세요:

![온도 변환 참조 이미지](/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_3.png)

이 계산 결과는 섭씨로 온도를 나타내며 웹 서버에 표시할 수 있습니다.

# LM35 대체 옵션

<div class="content-ad"></div>

LM35 센서는 간단하고 정확한 온도 감시가 필요한 프로젝트에 우수한 선택입니다. 이는 우리가 단순성과 비용 효율성이 주요 고려 사항인 시나리오에 완벽하게 맞습니다.

LM35는 많은 응용 분야에 적합하지만 DS18B20 및 DHT11 / DHT22 센서와 같은 대체품도 온도 측정 기능을 제공합니다:

- DS18B20: 이 센서는 디지털 온도 측정 값을 제공하며 1-선 버스를 통해 통신하여 아날로그-디지털 변환을 필요로하지 않습니다. 정확하고 디지털 통신이 필요한 응용프로그램에 적합합니다.
- DHT11/DHT22: 이러한 센서는 온도와 습도를 모두 측정하여 환경 모니터링에 유용합니다. 그러나 LM35와 비교해 응답 속도가 느리고 온도 측정에서는 덜 정확합니다.

# 단계 1: 회로 조립

<div class="content-ad"></div>

LM35를 NodeMCU에 연결하는 방법:

![LM35 Wiring](/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_4.png)

- LM35의 첫 번째 핀(평평한 쪽을 보고 왼쪽 핀)을 NodeMCU의 3V 핀에 연결합니다.
- LM35의 중간 핀을 NodeMCU의 A0(아날로그 입력) 핀에 연결합니다.
- LM35의 세 번째 핀(오른쪽 핀)을 NodeMCU의 GND 핀에 연결합니다.

이 간단한 설정을 통해 LM35는 감지한 온도에 비례하는 아날로그 전압을 NodeMCU로 전송할 수 있습니다.

<div class="content-ad"></div>

# 단계 2: NodeMCU 프로그래밍

## 설정 및 네트워크 연결

ESP8266 모듈은 내장 WiFi 기능을 이용하여 WiFi 네트워크에 연결하도록 프로그래밍될 수 있습니다. 이는 Arduino IDE를 사용하여 간단한 프로그래밍 단계를 거쳐 수행됩니다. 아래는 일반적인 작업 흐름입니다:

- 필요한 WiFi 네트워크에 연결하기 위한 함수를 제공하는 ESP8266WiFi 라이브러리를 포함합니다.
- WiFi 자격 증명 설정: 네트워크 이름 (SSID)과 암호를 코드에서 상수로 설정합니다.
- 연결을 시작합니다: WiFi.begin() 함수를 사용하여 SSID 및 암호를 매개변수로 사용합니다.
- 연결 상태를 모니터링합니다: 연결 시도를 WiFi.status()를 사용하여 연결이 설정될 때까지 반복문에서 관찰합니다.
- 웹 서버의 인스턴스를 특정 포트에 생성하고, HTTP의 경우 보통 포트 80을 사용합니다.
- ESP8266가 전송된 연결을 수신하기 위해 server.begin()을 사용하여 서버를 시작합니다.

<div class="content-ad"></div>

```cpp
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "여러분의_WIFI_SSID";
const char* password = "여러분의_WIFI_비밀번호";
ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("연결된 WiFi: ");
  Serial.println(ssid);
  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS 응답기 시작됨");
  }

  server.on("/", handleRoot);
  server.begin();
  Serial.println("HTTP 서버 시작됨");
}
```

## 웹 서버로 설정하는 방법

ESP8266는 ESP8266WebServer 라이브러리를 사용하여 웹 서버로 작동할 수 있습니다. 이는 서버가 HTTP 요청에 어떻게 응답할지를 결정하는 다른 엔드포인트에 대한 핸들러를 정의하는 것을 포함합니다. 저희 프로젝트에서는 루트 URL에 액세스할 때 온도 데이터를 제공하는 handleRoot() 핸들러 함수가 사용됩니다.

웹 서버는 온도를 표시하는 간단한 HTML 페이지를 제공합니다.


<div class="content-ad"></div>

```js
const char MAIN_page[] PROGMEM = R"=====(
<HTML>
  <HEAD>
    <meta http-equiv="refresh" content="2">
    <TITLE>Temperature Sensor LM35</TITLE>
  </HEAD>
  <BODY>
    <CENTER>
      <p1><b>Temperature Sensor LM35</b></p1>
      <br/>
      <p2>Temperature: #TEMPERATURE_VAL# &deg;C</p2>
    </CENTER>  
  </BODY>
</HTML>
)=====";

void handleRoot() {
  float reading = analogRead(A0);
  float voltage = reading * (3.30 / 1024.0);
  temperatureC = voltage * 100;

  Serial.print("analog read -> ");
  Serial.print(reading);

  Serial.print(" | voltage -> ");
  Serial.print(voltage);

  Serial.print(" | temperature (celcius) -> ");
  Serial.println(temperatureC);

  String s = MAIN_page;
  s.replace("#TEMPERATURE_VAL#", String(temperatureC));

  server.send(200, "text/html", s);
}
```

웹페이지 헤더의 HTML meta 태그인 `meta http-equiv="refresh" content="2"`은 웹페이지를 2초마다 새로고침하여 가장 최신의 온도를 표시합니다.

작업이 완료되면, 서버에게 웹 서버를 호스팅하도록 지시하기 위해 server.handleClient()와 MDNS.update()를 반복하도록 하세요. 서버에 약간의 500ms 딜레이를 제공해야 합니다.

```js
void loop(void) {
  server.handleClient();
  MDNS.update();
  delay(500);
}
```

<div class="content-ad"></div>

# 단계 3: 회로 및 웹 서버 실행

![이미지](/assets/img/2024-06-23-BuildingaWebServerwithNodeMCUESP8266andLM35TemperatureSensor_5.png)

결과적으로, ESP8266 웹 서버의 IP 주소를 입력하면 LM35 센서에 의해 감지된 온도 값이 표시되고 0.5초마다 새로고침됩니다.

이 프로젝트는 IoT 하드웨어 및 소프트웨어에 대한 실습 경험이 제공되었을뿐만 아니라 NodeMCU ESP8266과 같은 마이크로컨트롤러가 유용한 웹 기반 응용 프로그램을 생성하는 데 어떻게 사용될 수 있는지를 보여주었습니다. 실시간 온도 데이터를 제공하는 웹 서버를 배포함으로써, 동일한 네트워크에 연결된 어떤 기기를 통해 환경 상황을 편리하게 모니터링할 수 있습니다. 이는 가정 자동화, 환경 모니터링 및 더 많은 가능성을 열어줍니다.

<div class="content-ad"></div>

"table" 태그를 Markdown 형식으로 변경해주세요.