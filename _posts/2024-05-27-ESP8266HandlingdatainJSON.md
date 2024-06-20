---
title: "ESP8266 JSON 데이터 다루기"
description: ""
coverImage: "/assets/img/2024-05-27-ESP8266HandlingdatainJSON_0.png"
date: 2024-05-27 13:17
ogImage:
  url: /assets/img/2024-05-27-ESP8266HandlingdatainJSON_0.png
tag: Tech
originalTitle: "ESP8266: Handling data in JSON"
link: "https://medium.com/@punnyarthabanerjee/esp8266-handling-data-in-json-7c6f62c9062e"
---


![ESP8266 handling data in JSON](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_0.png)

ESP8266는 가장 많이 사용되는 WiFi 마이크로컨트롤러 보드 중 하나입니다. JSON을 사용하는 REST API와 같이 데이터를 다루어야 하는 프로젝트를 작업했었거든요 (저는 대부분 소프트웨어를 다루는 사람이에요 :) ).

이 튜토리얼에서는 ESP8266을 사용하여 서버를 설정하고 JSON을 통해 데이터를 전달하는 방법을 보여드릴게요.

# 먼저 해야 할 일


<div class="content-ad"></div>


![ESP8266HandlingdatainJSON](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_1.png)

이 강좌는 ESP, 아두이노 또는 유사한 보드에 대한 일부 지식을 요구합니다.

아직 아두이노 IDE를 설치하지 않았다면, 최신 버전의 아두이노 IDE를 다운로드하려면 여기를 클릭하세요.

또한 REST API 및 그들이 어떻게 만들어지는지에 대해 알고 있는 것이 도움이 될 것입니다. 저는 대부분 Node, FastAPI 및 Django로 REST API를 작성했습니다.


<div class="content-ad"></div>

최신 Arduino IDE를 다운로드하고 설치한 후, 이렇게 보일 것입니다.

![이미지](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_2.png)

도구로 이동하여 `라이브러리 관리`를 선택하세요.

Arduino JSON을 입력하고 라이브러리를 설치하세요.

<div class="content-ad"></div>

[참고: 이 작업에는 여러 라이브러리가 있지만, 나는 Benoit의 것을 선호합니다]

<img src="/assets/img/2024-05-27-ESP8266HandlingdatainJSON_3.png" />

그런 다음 도구로 이동하여 '보드' '보드 관리자'로 이동하십시오.

esp8266을 입력하고 보드를 설치하십시오.

<div class="content-ad"></div>

이제 모든 준비가 끝났으니 코딩을 시작할 수 있어요.

## WIFI에 연결하기

당신의 esp8266 보드는 스테이션(당신의 집 라우터에 연결되는 클라이언트)이나 액세스 포인트(연결하는 라우터가 되는)가 될 수 있어요.

이 튜토리얼에서는 제 보드를 스테이션으로 간주하고 집 WiFi 라우터에 연결할 거에요.

<div class="content-ad"></div>

컴퓨터에 보드를 연결하세요.

스케치 파일에 다음 라이브러리를 포함하세요.

```js
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
```

그런 다음 집 WiFi의 이름과 암호를 정의하세요.

<div class="content-ad"></div>

```js
#define SSID "당신의_와이파이_이름"
#define PASSWORD "당신의_와이파이_비밀번호"
```

이후에, 서버 객체를 정의합니다.

```js
ESP8266WebServer server(80); // 포트 80을 사용하며, 다른 포트를 사용할 수도 있습니다
```

그런 다음, 설정 메서드를 작성하기 시작합니다.

<div class="content-ad"></div>

설정 메소드에서 먼저 WiFi에 연결해보세요.

```js
void setup(){
    Serial.begin(9600);
    WiFi.begin(SSID, PASSWORD);
    while(WiFi.status() != WL_CONNECTED){
        Serial.println("연결 중");
        delay(1000);
    }
    Serial.println("연결됨");
    Serial.println(WiFi.localIP());
}
```

코드를 보드에 업로드한 후 시리얼 모니터를 확인해보세요.

출력 내용은 Ctrl + Shift + M을 누르거나 도구 탭을 통해 시리얼 모니터에서 확인할 수 있습니다.

<div class="content-ad"></div>


![Server Setup](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_4.png)

# Creating the server

Let's update the setup function

```js
void setup() {
    Serial.begin(9600);
    WiFi.begin(SSID, PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.println("Connecting");
        delay(1000);
    }
    Serial.println("Connected to");
    Serial.println(WiFi.localIP());
    // GET METHOD
    server.on("/test", HTTP_GET, sendData); // Setting the GET endpoint and callback which we define later
    // POST METHOD
    server.on("/test", HTTP_POST, receiveData); // Setting the POST endpoint and callback which we define later

    server.begin();
}
```

<div class="content-ad"></div>

루프 함수

```js
void loop() {
  server.handleClient();
}
```

## 파트 1: JSON을 변환하여 서버를 통해 데이터 전송

위 코드 조각에서 본 "sendData" 함수를 만들어봐요. 이 함수는 서버로 GET 요청을 처리하고 JSON 메시지로 응답합니다.

<div class="content-ad"></div>

```js
void sendData(){
    StaticJsonDocument<300> JSONData;
    // 자바스크립트 객체나 파이썬 딕셔너리와 같이 객체를 사용합니다.
    JSONData["key"] = "Value";
    // 추가 필드를 추가할 수 있습니다.
    char data[300];
    // JSON 객체를 문자열로 변환하여 data 변수에 저장합니다.
    serializeJson(JSONData,data);
    // 상태 코드를 200으로 설정하고, 콘텐츠 유형을 application/json으로 설정한 후 데이터를 전송합니다.
    server.send(200,"application/json",data);
}
```

`your IP: your port`/test 주소로 GET 요청이 발생할 때(예: 192.168.0.106:80), 이 함수가 실행됩니다.

## 파트 2: JSON 데이터 수신 및 JSON 객체로 변환

우리는 서버에 POST 요청을 보낼 때 처리할 "receiveData" 함수를 작성합시다. 이 함수는 서버로 JSON을 보내고, 서버는 문자열에서 숫자를 파싱하고 해당 숫자를 응답으로 보냅니다.

<div class="content-ad"></div>

저희 요청 바디는 이렇게 생겼을 거에요

```js
{
  "number":5
}
```

그리고 저희 함수는 이렇게 생겼을 거에요

```js
void receiveData(){
   StaticJsonDocument<300> JSONData;
   // JSON 문서 역직렬화
   String jsonString = server.arg("plain");
  DeserializationError error = deserializeJson(JSONData, jsonString);

  // 파싱이 성공했는지 테스트합니다.
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    server.send(500,"application/json","파싱 중 오류 발생"); // 오류가 발생했을 때 오류 응답을 전송합니다.
    return;
  }else{
   if(JSONData.containsKey("number")){ // 여기서는 JSON에 'number' 키가 있는지 확인합니다.
    server.send(200,"application/json",String(JSONData["number"].as<int>())+" 받았습니다");
   }
   else{
     server.send(400,"application/json","유효하지 않은 JSON");
   }
  }
}
```

<div class="content-ad"></div>

이제 Esp8266에서 JSON 객체를 직렬화하고 역질렬화하는 방법을 알게 되었어요!

## 전체 코드

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

#define SSID "당신의 SSID"
#define PASSWORD "비밀번호는 알려주지 않을 거에요"

String id = SSID;
String pass = PASSWORD ;

ESP8266WebServer server(80);

void sendData(){
    StaticJsonDocument<300> JSONData;
    // JSON 객체를 자바스크립트 객체나 파이썬 딕셔너리처럼 사용할 수 있어요
    JSONData["key"] = "Value";
    // 추가 필드를 넣을 수도 있어요
    char data[300];
    // JSON 객체를 문자열로 변환하여 data 변수에 저장해요
    serializeJson(JSONData, data);
    // content type을 application/json으로 설정하고 데이터를 보냅니다
    server.send(200, "application/json", data);
}

void receiveData(){
   StaticJsonDocument<300> JSONData;
   // JSON 문서를 역직렬화해요
   String jsonString = server.arg("plain");
   DeserializationError error = deserializeJson(JSONData, jsonString);

   // 파싱이 성공했는지 테스트해요.
   if (error) {
       Serial.print(F("deserializeJson() failed: "));
       Serial.println(error.f_str());
       server.send(500, "application/json", "파싱 오류");
       return;
   } else {
       if (JSONData.containsKey("number")) {
           server.send(200, "application/json", String(JSONData["number"].as<int>()) + " 받았어요");
       } else {
           server.send(400, "application/json", "잘못된 JSON 형식");
       }
   }
}

void setup() {
    Serial.begin(9600);
    WiFi.begin(SSID, PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.println("연결 중");
        delay(1000);
    }
    Serial.println("연결됨");
    Serial.println(WiFi.localIP());
    delay(500);
    server.on("/test", HTTP_GET, sendData);
    server.on("/test", HTTP_POST, receiveData);
    server.begin();
}

void loop() {
    server.handleClient();
}
```

## 파트 3: 테스트해보세요!

<div class="content-ad"></div>

제가 매우 편리한 VS-Code 확장 프로그램인 ThunderClient를 사용하여 요청을 보내고 있어요.

- 직렬화 확인

![image](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_5.png)

2. 역직렬화 확인

<div class="content-ad"></div>


![Image](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_6.png)

## It Works!

![Image](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_7.png)

# Final Words


<div class="content-ad"></div>

ESP 모듈로 할 수 있는 가능성은 무한합니다. 아티클을 좋아해 주셨기를 바랍니다.

저의 프로필이 처음이라면 LinkedIn에서 팔로우 부탁드립니다☺. 시간 내 주셔서 감사합니다. 최고의 IOT 프로젝트를 이뤄내길 바랍니다!

![이미지](/assets/img/2024-05-27-ESP8266HandlingdatainJSON_8.png)
