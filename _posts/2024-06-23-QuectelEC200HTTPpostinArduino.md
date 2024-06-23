---
title: "Arduino에서 Quectel EC200을 사용해 HTTP POST 요청 보내는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-QuectelEC200HTTPpostinArduino_0.png"
date: 2024-06-23 17:38
ogImage: 
  url: /assets/img/2024-06-23-QuectelEC200HTTPpostinArduino_0.png
tag: Tech
originalTitle: "Quectel EC200 HTTP post in Arduino"
link: "https://medium.com/@gmainapro/quectel-ec200-http-post-in-arduino-f70166a11376"
---


![image](/assets/img/2024-06-23-QuectelEC200HTTPpostinArduino_0.png)

Quectel HTTP 애플리케이션 노트에서는 데이터를 보내는 두 가지 방법을 제공합니다.
옵션 1. POST 본문에서 포스트 데이터와 함께 요청 헤더를 보냅니다. 따라서 데이터 길이에는 헤더와 포스트 데이터 크기가 모두 포함됩니다.
옵션 2: HTTPCFG를 사용하여 요청 헤더를 설정하고 QHTTPPOST AT 명령을 사용하여 포스트 데이터만을 보냅니다.

# HTTP POST 요청을 보내는 방법

## 1. HTTP 구성

<div class="content-ad"></div>

1. HTTP context id를 설정하세요: AT+QHTTPCFG="contextid",1
2. 포스트 URL을 설정하세요: AT+QHTTPCFG="url","`URL`"
URL은 꼭 프로토콜인 HTTP 또는 HTTPS를 포함해야 합니다. 그렇지 않으면 에러 메시지가 전송됩니다.
3. 요청 헤더를 설정하세요: AT+QHTTPCFG="header","`header`"

## 2. 포스트 데이터 전송

- 포스트 본문의 데이터 길이를 구하고 AT+QHTTPPOST=`data_length`를 통해 설정하세요.

추가로 입력 시간 초과 및 응답 시간 초과를 설정하는 데 사용할 수 있는 선택적 매개변수로 AT+QHTTPPOST=`data_length`[,`input_time`,`rsptime`]을 사용할 수 있습니다.

<div class="content-ad"></div>

2. 만약 위 단계에서의 응답이 "CONNECT"인 경우, 페이로드를 입력하시면 됩니다.

# 아두이노 예제 코드

```js
#include <SoftwareSerial.h>

#define MCU_RXD D5 // EC200U_TXD에 연결됨
#define MCU_TXD D6 // EC200U_RXD에 연결됨

SoftwareSerial quectel_serial(MCU_RXD, MCU_TXD);

String myurl = "api.example.com/post-endpoint/"; // 이 예제에서는 프로토콜이 포함되어 있지 않습니다
String token = "8434jn3i2sdhsy32uau3tjna";
String node_id = "dev-12345";
String user_agent= "Quectel Modem";

void QUECTEL_POST(String url, String headers[], int header_size, const String &data, int data_length);

void setup()
{ 
  delay(10000); // 모뎀이 네트워크에 등록될 때까지 대기

  Serial.begin(57600);
  quectel_serial_serial.begin(115200);

  // HTTP 헤더 설정
  String Quectel_headers[4];
  Quectel_headers[0] = "User-Agent" + user_agent;
  Quectel_headers[1] = "Authorization: Token " + token;   
  Quectel_headers[2] = "X-node: " + node_id;
  Quectel_headers[3] = "Content-Type: " + String(contentType); // 30

  int header_size = sizeof(Quectel_headers) / sizeof(Quectel_headers[0]);

  String data= "{\"sensor_data\":[{\"data_type\":\"CO\",\"value":\"7.80\"},{\"data_type\":\"temperature\",\"value\":\"32.780\"},{\"data_type\":\"humidity\",\"value\":\"13.40\"}]}";

  QUECTEL_POST(myurl, Quectel_headers, header_size, data, data.length());

}

void loop(){
// 아무 작업도 수행하지 않음
}


void QUECTEL_POST(String url, String headers[], int header_size, const String &data, int data_length)
{
   
    String HTTP_CFG = "AT+QHTTPCFG=\"url\",\"http://" + url + "\""; // URL 앞에 프로토콜을 설정해야 함
    Serial.print("Quectel URL 설정: ");
    Serial.println(HTTP_CFG);
    quectel_serial.println(HTTP_CFG);

    quectel_serial.println("AT+QHTTPCFG=\"contextid\",1");      // 컨텍스트 ID 설정
    quectel_serial.println("AT+QHTTPCFG=\"requestheader\",0");  // POST 본문에 요청 헤더 비활성화
    quectel_serial.println("AT+QHTTPCFG=\"responseheader\",1"); // 응답 헤더 사용
    quectel_serial.println("AT+QHTTPCFG=\"rspout/auto\",1");    // 자동 응답 및 HTTPREAD "비활성화"
    
    // 사용자 지정 헤더 설정
    for (int i = 0; i < header_size; i++)
    {
        HTTP_CFG = "AT+QHTTPCFG=\"header\",\"" + headers[i] + "\"";
        quectel_serial.println(HTTP_CFG);
    }

    // 데이터 전송
    HTTP_CFG = "AT+QHTTPPOST=" + String(data_length) + ",30,60";
    quectel_serial(HTTP_CFG);
    Serial.print("Quectel POST 본문: ");
    Serial.println(data);
    quectel_serial(data);
}
```

문제가 없다면 20x HTTP 응답 코드를 수신해야 합니다.

<div class="content-ad"></div>

## 참고 자료

- EC200U 및 EG915U 시리즈 HTTP(S) 애플리케이션 노트
- EC200T-CN AT 명령어 메뉴얼