---
title: "ESP8266로 만드는 나만의 공기질 모니터링 시스템 만들기"
description: ""
coverImage: "/assets/img/2024-06-22-CreatingYourOwnAirQualityMonitoringSystemwithESP8266_0.png"
date: 2024-06-22 18:55
ogImage: 
  url: /assets/img/2024-06-22-CreatingYourOwnAirQualityMonitoringSystemwithESP8266_0.png
tag: Tech
originalTitle: "Creating Your Own Air Quality Monitoring System with ESP8266"
link: "https://medium.com/@manuel.kienlein/creating-your-own-air-quality-monitoring-system-with-esp8266-3c75fe4b828a"
---


<img src="/assets/img/2024-06-22-CreatingYourOwnAirQualityMonitoringSystemwithESP8266_0.png" />

깨끗하고 신선한 공기는 건강한 생활 환경의 기본 요소입니다. 그런데 실제로 우리가 무엇을 호흡하고 있는지 얼마나 자주 알고 있을까요? 주변의 공기 품질을 모니터링하고 실시간으로 온도, 습도 등의 업데이트를 받을 수 있다면 어떨까요?

사물인터넷(IoT) 시대에 우리는 주변 환경을 더 잘 이해하기 위한 기술을 손에 넣었습니다. 다재다능하고 가격이 적당한 ESP8266 마이크로컨트롤러는 지능적인 공기 센서 시스템을 구축하는 열쇠입니다.

방 안의 공기 품질에 대한 데이터를 수집하는 장치뿐만 아니라 슬릭한 LCD 디스플레이와 편리한 웹 기반 대시보드에서 그 정보를 공유하는 장치가 있다고 상상해보세요. 당신은 환경에 대해 인식할 뿐만 아니라 건강에 대한 판단도 내릴 권리를 갖게 될 것입니다.

<div class="content-ad"></div>

이 글에서는 여러분께 자신만의 대기질 모니터링 시스템을 만드는 여정에 참여해 보시도록 하겠습니다. 하드웨어 설정, ESP8266 마이크로컨트롤러 프로그래밍, 그리고 수집된 데이터에 액세스하기 위한 RESTful API 개발에 대해 알아보겠습니다. 기술에 능통하신 분이든, IoT 여정을 막 시작한 분이든, 이 프로젝트는 여러분이 지금껏 경험하지 못한 방식으로 주거 공간을 관찰하고 분석할 수 있도록 돕기 위해 설계되었습니다.

대기질을 제어하고 DIY IoT 장치의 세계로 나아가는 준비가 되셨나요? 함께 시작해 신뢰성 있고 유익하며 비용 효율적인 대기질 모니터링 시스템을 만들어보세요.

# 프로젝트 개요

이 프로젝트의 목표는 대기질 데이터를 수집하고 분석하는 IoT 장치를 만드는 것입니다. 구체적으로 환경에서 온도, 습도 및 가끔은 대기질 매개변수를 추적하고 이 데이터를 Thingspeak 같은 플랫폼이나 화면에 전송하는 것을 추구합니다. 또한 간단한 웹 서버를 설정하여 REST API를 통해 센서 데이터를 제공하는 방법에 대해서도 알아볼 것입니다.

<div class="content-ad"></div>

# 하드웨어 요구 사항

![하드웨어 요구 사항](/assets/img/2024-06-22-CreatingYourOwnAirQualityMonitoringSystemwithESP8266_1.png)

위 사진에 있는 모든 기기가 필요하지는 않아요😀.
다음 부품이 필요해요:

- NodeMCU ESP8266 보드
- 4.7k 옴 저항
- DHT11 센서
- MQ135 센서
- 16x2 LCD 디스플레이
- I2C LCD 인터페이스 어댑터
- 와이어
- 브레드보드

<div class="content-ad"></div>

## ESP8266의 힘

이 프로젝트의 핵심은 ESP8266 마이크로컨트롤러에 있습니다. 이 작고 강력한 장치는 내장 Wi-Fi 기능을 갖춘 IoT(Internet of Things) 프로젝트에 이상적인 후보입니다. 이 장치는 우리에게 대기 질 데이터를 수집하고 전송하는 일을 쉽게 해줍니다.

## 센서의 역할

이 프로젝트에서는 두 가지 주요 센서인 DHT-11과 MQ-135 센서가 사용됩니다.

<div class="content-ad"></div>

- DHT-11 센서: 이 센서는 온도 및 습도 데이터를 제공하여 환경의 편안함 수준을 더 포괄적으로 파악하는 데 도움을 줍니다.
- MQ-135 센서: MQ-135 센서는 공기 품질에 집중합니다. 암모니아, 이산화탄소, 메탄을 포함한 다양한 가스를 감지할 수 있어 실내 공기 품질을 측정하는 데 탁월한 선택지입니다.

## LCD 디스플레이

이 프로젝트에서 사용된 LCD 디스플레이는 I2C(Inter-Integrated Circuit) 인터페이스가 장착된 Arduino 호환 디스플레이입니다. I2C는 다양한 구성 요소의 연결을 단순화하는 통신 프로토콜로, ESP8266와 같은 마이크로컨트롤러와의 통합에 이상적입니다. 원활한 호환성과 기능을 보장하기 위해 I2C 인터페이스 어댑터도 사용합니다. 나중에 소스 코드 조각을 작성하여 이 16x2 (16 문자 및 2 줄) 디스플레이를 사용하여 온도, 습도 및 공기 입자 정보를 표시합니다.

# 배선 및 연결

<div class="content-ad"></div>

프로젝트의 하드웨어 요구 사항은 최소한이며, 따라서 배선은 간단합니다. 회로도에 표시된 대로 부품을 브레드보드에 쉽게 설정할 수 있습니다. 전문적인 전자 기술 지식이 필요하지 않는 초보자 친화적인 프로젝트입니다.

센서를 마이크로컨트롤러에 연결하는 것부터 시작해 봅시다.

마지막 단계는 LCD 디스플레이를 마이크로컨트롤러에 연결하는 것입니다. 더 자세한 배선 테이블과 다이어그램은 Github 저장소에서 확인할 수 있습니다.

![이미지](/assets/img/2024-06-22-CreatingYourOwnAirQualityMonitoringSystemwithESP8266_2.png)

<div class="content-ad"></div>

# 소프트웨어 작성하기

다음 섹션에서는 저희의 공기 센서 프로젝트 소스 코드를 찾을 수 있습니다. 아두이노 스튜디오를 사용하여 프로그래밍 및 코드를 마이크로컨트롤러에 업로드 하는 데 익숙하다고 가정합니다. 이 C++ 코드는 제 GitHub 저장소에 있으며, https://github.com/manuelkienlein/ESP8266-AirSensor에서 접근할 수 있습니다. 자유롭게 탐색하고 수정하며, ESP8266에 코드를 업로드하여 자신만의 공기 품질 모니터링 시스템을 설정할 수 있습니다. 이제 코드 구현을 살펴보겠습니다:

```js
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include "MQ135.h"

// Thingspeak 및 WiFi
String apiKey = "apiKey";
const char* wifi_ssid = "WIFI-SSID";
const char* wifi_password = "WIFI-Password";

// 변수와 상수
#define PIN_DHT 3 // DHT11 핀
#define PIN_MQ 0 // MQ-135 핀
#define LCD_COLUMNS 16
#define LCD_ROWS 2
const char* server = "api.thingspeak.com";
#define INTERVAL_THINGSPEAK 20 // Thingspeak 지연

// 초기화
DHT dht(PIN_DHT, DHT11);
MQ135 gasSensor = MQ135(PIN_MQ);
LiquidCrystal_I2C lcd(0x27, LCD_COLUMNS, LCD_ROWS);

WiFiClient client;
ESP8266WebServer webserver(80);

float humidity;
float temperature;
float rzero;
float ppm;
unsigned long previousMillis;
unsigned long currentMillis;

void setup() {
  Serial.begin(115200);
  Serial.println("시작...");

  lcd.begin(LCD_COLUMNS, LCD_ROWS);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("시작...");

  dht.begin();

  lcd.setCursor(0, 1);
  lcd.print("WiFi 연결");
  setupWiFi();
  lcd.clear();
  lcd.print("IP 주소:");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  delay(10000);

  webserver.on("/", handleWebserverRequest_index);
  webserver.on("/dht11", handleWebserverRequest_dht11);
  webserver.on("/mq135", handleWebserverRequest_mq135);
  webserver.begin();

  int warmup = 30;
  lcd.clear();
  lcd.print(" IoT 공기센서 ");
  for(int i = warmup; i > 0; i--){
    lcd.setCursor(0, 1);
    lcd.print("열기중: "+String(i)+"초 ");
    delay(1000);
  }

  lcd.clear();
  delay(1000);
}

void loop() {
  // 센서 값 갱신
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  rzero = gasSensor.getRZero();
  ppm = gasSensor.getPPM();

  // 현재 사용하지 않음
  float rzero_corrected = gasSensor.getCorrectedRZero(temperature, humidity);
  float ppm_corrected = gasSensor.getCorrectedPPM(temperature, humidity);
  float resistance = gasSensor.getResistance();
  float resistance_corrected = gasSensor.getCorrectedResistance(temperature, humidity);
  int sensorValue = analogRead(PIN_MQ);

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT 센서 데이터를 읽는 데 실패했습니다!");
    return;
  }

  // Thingspeak 업데이트 사이에 최소 15초 지연이 필요하기 때문에 20초 대기
  currentMillis = millis();
  if(currentMillis - previousMillis >= INTERVAL_THINGSPEAK*1000){
    previousMillis = currentMillis;
    sendToThingspeak();
  }

  // 웹서버 요청 처리
  webserver.handleClient();

  // 디스플레이 업데이트
  updateDisplay();

  //Serial.println("온도:"+String(t)+" "+"습도:"+String(h));
  Serial.println("온도:"+String(temperature)+" "+"습도:"+String(humidity)+" "+"rZero:"+String(rzero)+" "+"rZeroC:"+String(rzero_corrected)+" "+"PPM:"+String(ppm)+" "+"PPMC:"+String(ppm_corrected));
  //Serial.println("온도:"+String(temperature)+" "+"습도:"+String(humidity)+" "+"rZero:"+String(rzero)+" "+"rZeroC:"+String(rzero_corrected)+" "+"PPM:"+String(ppm)+" "+"PPMC:"+String(ppm_corrected)+" "+"저항:"+String(resistance)+" "+"저항C:"+String(resistance_corrected));

  delay(1000);
}

void setupWiFi(){
  WiFi.begin(wifi_ssid, wifi_password);

  Serial.println();
  Serial.println();
  Serial.print("연결 중: ");
  Serial.println(wifi_ssid);

  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi 연결됨");

  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());
}

void sendToThingspeak(){
  if (client.connect(server,80)) { // "184.106.153.149" 또는 "api.thingspeak.com"
    String postStr = apiKey;
    postStr +="&field1=";
    postStr += String(temperature);
    postStr +="&field2=";
    postStr += String(humidity);
    postStr +="&field3=";
    postStr += String(ppm);
    postStr +="&field4=";
    postStr += String(rzero);
    postStr += "\r\n\r\n";

    client.print("POST /update HTTP/1.1\n");
    client.print("Host: "+String(server)+"\n");
    client.print("Connection: close\n");
    client.print("X-THINGSPEAKAPIKEY: "+apiKey+"\n");
    client.print("Content-Type: application/x-www-form-urlencoded\n");
    client.print("Content-Length: ");
    client.print(postStr.length());
    client.print("\n\n");
    client.print(postStr);
  }
  client.stop();
}

void handleWebserverRequest_index(){
  String message = "{\"temperature\":"+String(temperature)+", \"humidity\":"+String(humidity)+", \"ppm\":"+String(ppm)+", \"rzero\":"+String(rzero)+"}";
  webserver.send(200, "application/json", message);
}

void handleWebserverRequest_dht11(){
  String message = "{\"temperature\":"+String(temperature)+", \"humidity\":"+String(humidity)+"}";
  webserver.send(200, "application/json", message);
}

void handleWebserverRequest_mq135(){
  String message = "{\"ppm\":"+String(ppm)+", \"rzero\":"+String(rzero)+"}";
  webserver.send(200, "application/json", message);
}

void updateDisplay(){
  // 첫 번째 줄 출력
  lcd.setCursor(0, 0);
  lcd.print("T: "+String(int(temperature))+(char)223+"C | H: "+String(int(humidity))+"%");

  // 두 번째 줄 출력
  lcd.setCursor(0, 1);
  lcd.print("PPM: "+String(int(ppm)));
}
```

위의 소스 코드를 통해 대략적으로 우리가 무엇을 하려고 하는지 알 수 있을 것입니다. 그러나 간단히 시작해보겠습니다. 이제 한 단계씩 모든 것을 설명하겠습니다.

<div class="content-ad"></div>

Thingspeak

우리는 무료 IoT 데이터 플랫폼인 thingspeak.com을 사용하고 있어요. 먼저 계정을 만들어야 해요. 그런 다음에 새로운 API 토큰을 생성하고 그 토큰을 "apiKey" 변수에 입력해야 해요. 그 작업을 완료하면 센서 데이터를 위한 개별 대시보드를 만들 수 있어요.

![이미지](/assets/img/2024-06-22-CreatingYourOwnAirQualityMonitoringSystemwithESP8266_3.png)

Wi-Fi

<div class="content-ad"></div>

인터넷을 통해 데이터를 송수신하려면 Wi-Fi 네트워크 이름과 암호를 입력해야 합니다:

```js
const char* wifi_ssid = "WIFI-SSID";
const char* wifi_password = "WIFI-Password";
```

Connections & Pins

일반적으로 esp 보드를 센서와 디스플레이에 연결할 때 동일한 하드웨어와 동일한 포트를 사용했다면 코드에서 포트 구성을 조정할 필요가 없습니다. 제 I2C 디스플레이 주소는 0x27입니다. 그러나 표시기의 주소가 제 것과 다를 수도 있습니다.

<div class="content-ad"></div>

```js
LiquidCrystal_I2C lcd(0x27, LCD_COLUMNS, LCD_ROWS);
```

해당 소스 코드를 이 저장소에서 찾을 수 있습니다:

# 센서의 테스트와 보정

첫 번째 단계는 센서를 보정하는 것입니다. 이를 위해서 센서를 회로에 연결하고 보정 프로세스를 완료하려면 센서를 24시간동안 전원에 연결한 채로 두어야 합니다. 이후 약 1시간 동안 20°C 정도의 외부 공기에 노출시켜 상대 습도가 35% 정도 되도록 합니다. 이 작업이 완료되면 보정 값이 잘 설정될 것입니다.

<div class="content-ad"></div>

이 보정값을 얻으려면 다음 코드를 사용하십시오: rzero = gasSensor.getRZero();. 다음으로 중요한 단계는 보정 중에 결정한 값으로 기본 RZero 상수를 교체하는 것입니다. 이 값을 MQ135 센서 라이브러리의 파일 MQ135.h에서 찾고 #define RZERO 뒤에 특정 RZero 값을 넣어 교체하십시오. 각 센서마다 고유한 RZero 값이 있음을 기억하는 것이 중요합니다.

여기서 반드시 말씀드리고 싶은 것은, 특히 MQ-135 센서가 매우 정확하지 않다는 것입니다. 그러나 이러한 단계를 따르면 센서 읽기의 최상의 정확도를 보장할 수 있습니다.

## HTTP API

이는 JSON 형식으로 센서 데이터를 제공하는 웹 서버를 포함합니다.
이 장치를 연결하면, 열화 후 IP 주소가 표시됩니다. 이 IP 주소를 즐겨 사용하는 브라우저에 넣으면 JSON 형식의 HTTP-API를 통해 센서 데이터를 수집할 수 있습니다.

<div class="content-ad"></div>

```js
GET http://<IP-Address>/

{
  "temperature": 23.6,
  "humidity": 31,
  "ppm": 443.96,
  "rzero": 979.75
}
```

# 사용자 정의 기회

프로젝트의 유연성을 통해 추가적인 향상이 가능합니다. 예를 들어 공기 품질이 미리 정의된 임계 값 이하로 떨어질 때 경고 메시지를 보내는 알림 시스템을 설정할 수 있습니다. 집 안의 공기 질이 나빠질 경우 폰으로 알림을 받는 상상을 해보세요.

이 프로젝트를 통해 주변 공기의 품질을 파악할뿐만 아니라 맞춤화 및 개선 가능성에 대한 무한한 가능성을 열 수 있습니다. 전자 취미로 활동하시는 분이든, 단순히 더 깨끗한 공기를 들이쉬고 싶은 분이든, 직접 Arduino 공기 센서를 제작하는 것은 재미있고 보람차며 깨달음을 얻을 수 있는 여정입니다.

<div class="content-ad"></div>

DIY 아두이노 프로젝트에 대해 어떻게 생각하세요? 다른 멋진 프로젝트를 이미 만들어 보셨나요?

의견을 댓글로 남겨 주시고, 이 글이 마음에 드셨다면 아래에 있는 ♥ 버튼을 클릭하여 세계에 전파해주세요.