---
title: "IoT ESP32가 MQTT Broker에 연결하기 위해 SSL TLS 인증서를 사용하는 방법 파트 2"
description: ""
coverImage: "/assets/img/2024-06-20-IoTESP32usingssltlscertificatetoconnectwidthMQTTBrokerPart2_0.png"
date: 2024-06-20 17:06
ogImage: 
  url: /assets/img/2024-06-20-IoTESP32usingssltlscertificatetoconnectwidthMQTTBrokerPart2_0.png
tag: Tech
originalTitle: "IoT ESP32 using ssl tls certificate to connect width MQTT Broker (Part 2 )"
link: "https://medium.com/@rbeloncle/iot-esp32-using-ssl-tls-certificate-to-connect-width-mqtt-broker-part-2-fce78fae7310"
---


시작부터 따라오고 싶다면 다음 링크를 확인하세요 (Part 1)

[Part 1](/assets/img/2024-06-20-IoTESP32usingssltlscertificatetoconnectwidthMQTTBrokerPart2_0.png)

## 개요

이 기사에서는 ESP32를 사용하여 SSL/TLS 프로토콜에서 MQTT 통신을 하는 방법을 보여줍니다. 암호화된 메시지를 발행하고 주제를 구독하는 방법에 대해 설명합니다.

<div class="content-ad"></div>

우리는 똑같은 Raspberry Pi 3에 설치된 Mosquitto 브로커를 사용할 것입니다. 이 브로커는 모든 메시지를 수신하고, 메시지를 필터링하며, 누가 관심이 있는지 결정하고 구독한 모든 클라이언트에게 메시지를 게시하는 역할을 합니다.

# 준비 사항

- Raspberry Pi에 익숙해야 합니다 — Getting Started with Raspberry Pi와 Arduino IDE를 읽어보세요.
- Raspberry Pi에 Raspbian 운영 체제가 설치되어 있어야 합니다 — Raspbian Lite 설치와 SSH로 연결하는 방법에 대한 유튜브 비디오를 시청하세요.
- esp32 컨트롤러가 필요합니다.
- MQTT가 무엇이고 어떻게 작동하는지 배워보세요.

여기가 전체 코드입니다:

<div class="content-ad"></div>

```json
#include "WiFiClientSecure.h"
#include <PubSubClient.h>
#include "credentials.h"

// WiFi credentials
const char* ssid = "<와이파이 라우터 이름>";
const char* password = "<와이파이 비밀번호>";

// MQTT Broker credentials
const char* mqtt_broker = "<브로커의 IP 주소>";
const char* topic = "test";
const int mqtt_port = 8883 ;

// SSL 인증서 설정
const char* root_ca =  CA_CRT;
const char* server_cert = SERVER_CERT;
const char* server_key  = SERVER_KEY;

// WiFiClient espClient;
WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup() {
  // 소프트웨어 시리얼 보드레이트 설정: 115200
  Serial.begin(115200);
  // WiFi 네트워크에 연결
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("WiFi에 연결 중..");
  }
  Serial.println("WiFi 네트워크에 연결되었습니다.");
  // SSL을 사용하여 MQTT 브로커에 연결
  espClient.setCACert(root_ca);
  espClient.setCertificate(server_cert);  // 클라이언트 확인을 위해
  espClient.setPrivateKey(server_key);    // 클라이언트 확인을 위해

  // 원격 MQTT 브로커에 연결
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected()) {
    // 클라이언트 ID 생성
    String client_id = "esp32-client";
    client_id += String(WiFi.macAddress());
    // esp32 컨트롤러의 이름과 ID 출력
    Serial.printf("클라이언트 %s가 공개 MQTT 브로커에 연결합니다\n", client_id.c_str());
    if (client.connect( client_id.c_str())) {
      Serial.println("Public emqx mqtt 브로커에 연결되었습니다");
    } else {
      Serial.print("연결 실패, 상태: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // 게시 및 구독
  client.publish(topic, "안녕, 나는 ESP32^^");
  client.subscribe(topic);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("주제에서 메시지 도착: ");
  Serial.println(topic);
  Serial.print("메시지:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  Serial.println("-----------------------");
}

void loop() {
  client.loop();

  client.publish(topic, "ESP32가 MQTT 브로커로 암호화된 메시지를 보냅니다");

  // 10초마다 메시지 전송
  delay(10000);
}
```

SSL 인증서를 설정하려면 credentials.h 파일을 작성해야 합니다.

아래와 같은 형태여야 합니다:

```js
#define CA_CRT                                                           \
    "-----BEGIN CERTIFICATE-----\n"                                      \
    "MIIDVzCCAj+gAwIBAgIUIwOnfZCxwCKrQXHpbI0rVksEcaMwDQYJKoZIhvcNAQEL\n" \
    // 중략
#define SERVER_CERT                                                      \
    "-----BEGIN CERTIFICATE-----\n"                                      \
    "MIIDBTCCAe0CFHjJN1GNHVnqXiMyngV3yvLg/70FMA0GCSqGSIb3DQEBCwUAMDsx\n" \
    // 중략
#define SERVER_KEY                                                       \
    "-----BEGIN RSA PRIVATE KEY-----\n"                                  \
    "MIIEpQIBAAKCAQEAvsxvL0H8M9HjGplper2/oRtQQTFfBYLX3JfBrTJIXD6A5HFJ\n" \
    // 중략
```

<div class="content-ad"></div>

그런 다음 자격 증명 파일을 업로드하려는 메인 파일에 자격 증명.h 파일을 가져와서 사용할 수 있습니다.

## 마지막으로 MQTT 브로커에서 나타나는 다음 메시지를 확인해야합니다.

![이미지](/assets/img/2024-06-20-IoTESP32usingssltlscertificatetoconnectwidthMQTTBrokerPart2_1.png)

# 정리

<div class="content-ad"></div>

요약하면, 저는 브로커 부분과 컨트롤러 부분을 포함한 가정용 IOT 시스템의 기본 개념을 보여드렸습니다.