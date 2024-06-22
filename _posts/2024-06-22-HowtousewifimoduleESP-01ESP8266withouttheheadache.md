---
title: "두통 없이 WiFi 모듈 ESP-01 ESP8266 사용하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HowtousewifimoduleESP-01ESP8266withouttheheadache_0.png"
date: 2024-06-22 18:43
ogImage: 
  url: /assets/img/2024-06-22-HowtousewifimoduleESP-01ESP8266withouttheheadache_0.png
tag: Tech
originalTitle: "How to use wifi module ESP-01 ESP8266 without the headache"
link: "https://medium.com/@codyexho/how-to-use-wifi-module-esp-01-esp8266-without-the-headache-fa69ab83c06c"
---


요즘, ESP32와 Arduino UNO 보드를 통합하여 스마트 홈 시스템을 만드는 것을 시도해보고 있어요. 집의 식물을 위한 보습 장치 같은 거 말이죠. 여기에는 그 여정과 그 과정에서 주요한 고충 포인트에 대해 설명하겠어요. 그리고 왜 NodeMCU의 ESP8266을 사용하게 된 이유에 대해서도 언급할게요.

그래서 원하던 흐름은 다음과 같아요:

- 시스템을 처음 시작할 때, 액세스 포인트 시작.
- AP에 연결하고 로컬 네트워크의 SSID와 비밀번호를 요청하는 웹 페이지를 열기.
- 데이터가 전달된 후, 시스템은 SSID와 비밀번호를 EEPROM에 저장하고 액세스 포인트를 중지하고 로컬 Wi-Fi에 클라이언트로 연결해야 해요.

# ESP-01

<div class="content-ad"></div>

이것을 조사하기 시작했을 때, ESP-01에 대한 아주 좋은 아이디어라고 생각했어요. 작고 저렴하면서 필요한 기능을 모두 갖추고 있거든요.

ESP-01은 Arduino를 이용해 RX/TX 핀을 통해 AT 프로토콜을 사용하여 제어할 수 있어요.

하지만 UART AT 명령어를 사용하는 동안 약간의 조사를 한 후, Arduino의 메모리는 코딩을 끝내기 전에 사라질 것 같다는 사실을 알게 되었어요. ESP8266은 훨씬 더 많은 메모리를 가지고 있어요. 비교해 보면 ESP8266은 80kB의 메모리를 가지고 있고, Arduino Uno는 2kB를 갖고 있어요. 이는 계산기로부터 PC를 제어하려는 것과 비슷해요. 이런 방식은 작동하지 않아요.

게다가, ESP 기반 컨트롤러는 IO 핀을 가지고 있어요. 이러한 핀을 Arduino에 연결하는 수고를 덜며 문제를 해결할 수 있어요. 그래서 ESP를 Arduino에서 제어해야 할까요? 그렇지 마세요! 이렇게 하지 마세요. 반드시 그렇게 해야 하는 것은 아니에요. 이 글이 다른 사람들이 제 실수를 반복하는 것을 막아줄 수 있기를 바라요.

<div class="content-ad"></div>

아래에서 ESP를 올바르게 사용하는 방법을 볼 수 있습니다.

![이미지](/assets/img/2024-06-22-HowtousewifimoduleESP-01ESP8266withouttheheadache_0.png)

# NodeMCU의 ESP8266

ESP-01의 사용은 Arduino와 함께 여러 문제가 위에서 설명된 것과 맞닿아 있습니다 !!!!!

<div class="content-ad"></div>

반면에, NodeMCU의 ESP8266은 쉽게 다가갈 수 있는 친구에요. ESP 모듈이 내장되어 있고 좋은 컴퓨팅 성능을 갖추고 있습니다. 또한 배선이 필요하지 않아요.

## 단계 1. 설정.

가장 먼저, NodeMCU 칩과 작업할 수 있도록 Arduino IDE와 OS를 설정해야 합니다.

시스템에서 시리얼을 보이도록 CH340G 드라이버를 설치해주세요.

<div class="content-ad"></div>

- macOS
- Linux
- Windows

도구 - 보드 - 보드 관리자로 이동하세요. esp8266 보드 관리자를 설치하세요.

<img src="/assets/img/2024-06-22-HowtousewifimoduleESP-01ESP8266withouttheheadache_1.png" />

그 후, ESPAsyncTCP와 ESPAsyncWebServer 라이브러리를 설치해야 합니다. 저장소를 복제하고 이름에서 "-master"를 제거하세요. 그 폴더들을 Arduino/libraries/ 폴더로 이동하세요.

<div class="content-ad"></div>

코딩을 시작할 준비가 모두 완료되었어요.

## 단계 2. 코딩.

접속 지점 SSID/비밀번호를 설정 중입니다.

```js
const char* ssid = "ESP8266-Access-Point";
const char* password = "123456789";
```

<div class="content-ad"></div>

서버 액세스시 반환할 HTML 페이지:

```js
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html {
        font-family: Arial;
        display: inline-block;
        margin: 0px auto;
        text-align: center;
      }
      h2 {
        font-size: 3.0rem;
      }
      p { 
        font-size: 3.0rem;
      }
      .units {
        font-size: 1.2rem;
      }
      .input {
        font-size: 20px;
        margin-bottom: 10px;
      }
      .wifi-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }
    </style>
  </head>
  <body>
    <div class="wifi-form">
      <h1>테스트</h1>
      <input id="ssid" class="input" type="text" maxlength="32">
      <input id="password" class="input" type="password">
      <button onclick="connectToWifi()">연결</button>
    </div>
  </body>
  <script>
    function connectToWifi() {
      var ssid = document.getElementById("ssid").value;
      var password = document.getElementById("password").value;
      var xhr = new XMLHttpRequest(); xhr.open("POST", "/", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(ssid + ":" + password);
    }
  </script>
</html>)rawliteral";
```

로컬 Wi-Fi의 SSID와 비밀번호를 요청하는 간단한 양식입니다.

connectToWifi 함수는 POST 요청으로 데이터를 서버로 전송합니다.

<div class="content-ad"></div>

요청을 처리할 서버를 설정해 봅시다.

다음을 글로벌 변수로 추가해 주세요.

```js
AsyncWebServer server(80);
```

접속 지점 함수를 만들어 주세요.

<div class="content-ad"></div>

```js
void createAccessPoint() {
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);
  // Print ESP8266 Local IP Address
  Serial.println(WiFi.localIP());
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/html", index_html);
  });
  server.on("/", HTTP_POST, [](AsyncWebServerRequest *request){},NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    ssidWifi = "";
    passwordWifi = "";
    String res((char *)data);
    int sepIndex = -1;
    for (int i = 0; i < len; ++i) {
      if (res[i] != ':') {
        if (sepIndex == -1) {
          ssidWifi.concat(res[i]);
        }
        if (i > sepIndex && sepIndex != -1) {
          passwordWifi.concat(res[i]);
        }
      }
      else {
        sepIndex = i;
      }
    }
    writeEEPROM(ssidWifi, ssidIndex);
    writeEEPROM(passwordWifi, passwordIndex);
    request->send(200, "text/plain", "SUCCESS");
  });
  server.begin();
}
```

우리가 이걸 살펴보자.

```js
WiFi.softAP(ssid, password);
```

이 부분은 시작 시 SSID 및 비밀번호가 전달되어 액세스 포인트를 생성합니다.

<div class="content-ad"></div>

```js
IPAddress IP = WiFi.softAPIP();
Serial.print("AP IP 주소: ");
Serial.println(IP);
// ESP8266 로컬 IP 주소 출력
Serial.println(WiFi.localIP());
```

로그 기능입니다. 디버깅에 필요합니다.

```js
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/html", index_html);
});
```

HTTP GET 요청을 처리하고 HTML 페이지를 반환합니다.

<div class="content-ad"></div>

```js
server.on("/", HTTP_POST, [](AsyncWebServerRequest *request){},NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    ssidWifi = "";
    passwordWifi = "";
    String res((char *)data);
    int sepIndex = -1;
    for (int i = 0; i < len; ++i) {
      if (res[i] != ':') {
        if (sepIndex == -1) {
          ssidWifi.concat(res[i]);
        }
        if (i > sepIndex && sepIndex != -1) {
          passwordWifi.concat(res[i]);
        }
      }
      else {
        sepIndex = i;
      }
    }
    writeEEPROM(ssidWifi, ssidIndex);
    writeEEPROM(passwordWifi, passwordIndex);
    request->send(200, "text/plain", "SUCCESS");
  });
```

위 코드는 포스트 요청을 처리합니다. AsyncWebServer 요청을 받아들이기 위해 다섯 번째 매개변수를 AsyncWebServer 요청으로 추가해야 합니다. 알고리즘은 매우 간단합니다. 글로벌 변수인 ssidWifi와 passwordWifi를 지웁니다. SSID:password를 이런 형식으로 구문 분석하고 데이터를 EEPROM에 저장합니다.

그 후에 서버를 시작합니다.

ssidIndex는 0이며, 이는 데이터의 시작 주소입니다.

<div class="content-ad"></div>

패스워드 인덱스는 33입니다. 이는 SSID 최대 길이가 32바이트이며, 하나의 바이트가 문자열의 길이로 예약되어 있기 때문입니다. 이를 writeEEPROM 함수에서 확인할 수 있습니다:

```js
void writeEEPROM(String value, int address) {
  int len = value.length();
  EEPROM.put(address, len);
  for (int i = address + 1; i < len + address + 1; ++i) {
    EEPROM.put(i, value[i - address - 1]);
  }
  EEPROM.commit();
}
```

이제 이러한 데이터를 EEPROM에서 읽을 수 있어야 합니다:

```js
String readEEPROM(int address) {
  uint8_t len = EEPROM.read(address);
  if (len == 255) return "";
  String res;
  for (int i = address + 1; i < len + address + 1; ++i) {
    char c = (char)EEPROM.read(i);
    res.concat(c);
  }
  return res;
}
```

<div class="content-ad"></div>

255- 이는 비어 있는 데이터를 나타냅니다. 여기서는 먼저 데이터 길이에 할당된 첫 번째 바이트를 받아 그 후의 데이터를 읽고 결과를 반환합니다.

이제 모든 것을 함께 묶어 보겠습니다.

```js
void setup() {
  Serial.begin(9600);
  EEPROM.begin(128);
  ssidWifi = readEEPROM(ssidIndex);
  passwordWifi = readEEPROM(passwordIndex);
  if (ssidWifi.length() > 0 && passwordWifi.length() > 0 && WiFi.status() != WL_CONNECTED) {
    WiFi.softAPdisconnect(true);
    server.end();
    WiFi.begin(ssidWifi, passwordWifi);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
    }
  }
  else
  {
    createAccessPoint();
  }
}
void loop() {
  if (ssidWifi.length() > 0 && passwordWifi.length() > 0 && WiFi.status() != WL_CONNECTED) {
    WiFi.softAPdisconnect(true);
    server.end();
    WiFi.begin(ssidWifi, passwordWifi);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
    }
  }
}
```

여기까지입니다. 하드코딩 없이 wifi 자격 증명을 설정할 수 있는 웹페이지가 있는 서버를 시작하는 작동하는 시스템이 준비되었습니다.

<div class="content-ad"></div>

그리고 GitHub의 작동 예제 링크를 변경하십시오.