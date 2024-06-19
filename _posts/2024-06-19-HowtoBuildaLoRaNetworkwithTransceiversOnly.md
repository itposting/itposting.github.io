---
title: "로라 트랜시버만 사용하여 LoRa 네트워크 구축하기 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoBuildaLoRaNetworkwithTransceiversOnly_0.png"
date: 2024-06-19 17:40
ogImage: 
  url: /assets/img/2024-06-19-HowtoBuildaLoRaNetworkwithTransceiversOnly_0.png
tag: Tech
originalTitle: "How to Build a LoRa Network with Transceivers Only"
link: "https://medium.com/@qiweimao/lorawan-vs-lora-0eda63a88034"
---


제 개인 웹사이트에서도 이 기사를 확인하실 수 있어요: [https://www.qiweimao.dev/lora-network-protocol](https://www.qiweimao.dev/lora-network-protocol)

Github 저장소: [https://github.com/qiweimao/ESP32-Datalogger](https://github.com/qiweimao/ESP32-Datalogger)

# LoRaWAN vs LoRa

안녕하세요! 멀리 떨어져 있는 다수의 센서에서 데이터를 수집하고 싶은데, 인터넷에서는 대부분 LoRaWAN에 대해 이야기하는 것 같죠. 간단히 말해, LoRa는 라디오를 뜻하고, LoRaWAN은 LoRa 물리 계층 위에 구축된 멋진 프로토콜입니다. 일반적으로 LoRaWAN을 구현하려면 LoRa 게이트웨이가 필요합니다. LoRa 게이트웨이는 LoRaWAN 네트워크에서 핵심 역할을 하는데요, 이는 최종 기기와 네트워크 서버 사이의 다리 역할을 합니다. 게이트웨이는 여러 개의 LoRa 종단 장치로부터 데이터를 수신하며, 이들은 LoRa 라디오 프로토콜을 사용하여 통신한 후, Ethernet 또는 셀룰러와 같은 표준 IP 연결을 통해 이 데이터를 중앙 네트워크 서버로 전송합니다. LoRa 게이트웨이는 여러 채널을 지원하도록 설계되어 있으며 여러 신호를 동시에 해석할 수 있는 기능을 제공하여, LoRaWAN 네트워크의 확장성과 견고성에 매우 중요합니다.

<div class="content-ad"></div>

<table>
  <tr>
    <td><img src="/assets/img/2024-06-19-HowtoBuildaLoRaNetworkwithTransceiversOnly_0.png" /></td>
  </tr>
</table>

하지만 항상 LoRa 게이트웨이를 원하는 것은 아닙니다. 그것은 추가 하드웨어, 더 많은 전력 사용, 더 비싼 (쉽게 200달러 이상) 것이에요. 아마 당신은 간단한 네트워크를 관리하려고 하는 것이며 오로지 노드마다 5달러씩 살테니, 트랜시버만으로 작동할 수 있는 방법이 있을까요?

<table>
  <tr>
    <td><img src="/assets/img/2024-06-19-HowtoBuildaLoRaNetworkwithTransceiversOnly_1.png" /></td>
  </tr>
</table>

그렇습니다! 각 단말 장치에 트랜시버만 사용하여 사용자 정의 LoRa 네트워크를 구축할 수 있습니다. 그 중 하나를 마스터 또는 노드로 구성할 수 있어요. 그런데 이러한 설정은 제약이 따르며, 이들 트랜시버는 동시에 데이터를 수신하고 송신할 수 없어 같은 모드에서 작동해야 해요. 또한, 여러 장치와의 동시 통신을 지원하지 않아요. 이에 따라 시스템을 구축하려면 장치들이 서로 충돌하지 않도록 해야하고 타이밍을 조율해야 합니다.

<div class="content-ad"></div>

# 네트워크 아키텍처

우리가 ESP32와 무선 송수신기를 갖춘 데이터 수집 노드 30개가 있다고 가정해 봅시다. 이들은 서로 어떻게 대화하고, 언제 말해야 할까요? 동시에 듣고 말할 수 없다면, 어떻게 하면 정보를 놓치지 않게 할 수 있을까요?

이러한 문제들을 해결하기 위해, LoRa 장치에 대한 규칙을 만들어야 합니다!

타이밍 조정:

<div class="content-ad"></div>

옵션 1:

- 각 노드가 데이터를 전송할 특정 시간 슬롯을 갖는 간단한 시분할 다중화 (TDM) 방식을 사용합니다.
- 게이트웨이로부터 공통 시작 신호 또는 주기적 동기화 메시지와 같은 동기화 메커니즘을 구현합니다.

옵션 2:

- 마스터 노드가 (거의) 모든 것을 지시하도록하고, 슬레이브 노드는 마스터가 패킷을 전송하도록 요청할 때만 말할 수 있습니다. 저는 이것이 더 쉽다고 생각합니다!

<div class="content-ad"></div>

충돌 방지:

- 한 번에 하나의 노드만 전송되도록 확인하세요.
- 성공적인 데이터 전송 및 수신을 확인하기 위해 확인 메시지를 사용하세요.

고유 식별자:

- 각 노드는 항상 메시지에 고유 식별자(예: 이름 또는 MAC 주소)를 첨부해야 합니다.
- 마스터는 메시지의 출처를 확인하고 쓰레기 메시지나 미인가된 노드의 메시지를 폐기할 수 있습니다.
- 노드는 마스터가 특정하게 그들을 대상으로 하는지 또는 다른 노드를 대상으로 하는지 확인할 수 있습니다.

<div class="content-ad"></div>

# 아두이노 LoRa 라이브러리 이해하기

우리만의 LoRa 프로토콜(규칙)이나 LoRa 네트워크를 구현하기 전에, 우리는 변조기 하드웨어와 상호 작용할 수 있게 해주는 멋진 https://github.com/sandeepmistry/arduino-LoRa 라이브러리를 이해해야 합니다. 이 라이브러리의 API는 LoRa API에서 매우 잘 문서화되어 있습니다.

# 안녕, 세상!

## 여기 LoRa 라이브러리를 사용한 간단한 송신기와 수신기 스케치 예제가 있습니다.

<div class="content-ad"></div>

보낸이 코드:

```cpp
#include <SPI.h>
#include <LoRa.h>
const int csPin = 18;          // LoRa 라디오 칩 선택
const int resetPin = 14;       // LoRa 라디오 리셋
const int irqPin = 26;         // 보드에 따라 변경; 하드웨어 인터럽트 핀이어야 함

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("LoRa 보낸이");
  // 기본 CS, 리셋 및 IRQ 핀 오버라이드(선택 사항)
  LoRa.setPins(csPin, resetPin, irqPin);
  if (!LoRa.begin(915E6)) { // 915 MHz 주파수
    Serial.println("LoRa 시작 실패!");
    while (1);
  }
}

void loop() {
  Serial.print("패킷 전송 중: ");
  Serial.println(counter);
  
  // 패킷 전송
  LoRa.beginPacket();
  LoRa.print("안녕하세요 ");
  LoRa.print(counter);
  LoRa.endPacket();
  
  counter++;
  delay(1000);
}
```

수신기 코드:

```cpp
#include <SPI.h>
#include <LoRa.h>
const int csPin = 18;          // LoRa 라디오 칩 선택
const int resetPin = 14;       // LoRa 라디오 리셋
const int irqPin = 26;         // 보드에 따라 변경; 하드웨어 인터럽트 핀이어야 함

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("LoRa 수신기");
  
  // 기본 CS, 리셋 및 IRQ 핀 오버라이드(선택 사항)
  LoRa.setPins(csPin, resetPin, irqPin);
  
  if (!LoRa.begin(915E6)) { // 915 MHz 주파수
    Serial.println("LoRa 시작 실패!");
    while (1);
  }
}

void loop() {
  // 패킷 파싱 시도
  int packetSize = LoRa.parsePacket();
  
  if (packetSize) {
    // 패킷 수신
    Serial.print("수신한 패킷 '");
    
    // 패킷 읽기
    while (LoRa.available()) {
      Serial.print((char)LoRa.read());
    }
    
    // 패킷 RSSI 출력
    Serial.print("' RSSI가 ");
    Serial.println(LoRa.packetRssi());
  }
}
```

<div class="content-ad"></div>

발신자 배터리나 USB 중 하나로 전원을 공급하고, 컴퓨터의 시리얼 모니터를 통해 수신기를 검사할 수 있습니다. 그뿐만 아니라요! 안녕하세요, LoRa에서의 안녕!

# 연속 수신 및 송신

다음 두 가지 시나리오를 고려해보세요:

- 슬레이브 노드는 항상 새로운 패킷을 수신 대기해야 하며, 마스터의 요청이 있을 때만 데이터를 전송해야 합니다.
- 마스터 노드는 항상 새로운 패킷을 수신 대기해야 하며, 슬레이브 노드와 연락해야 할 필요가 있을 때만 데이터를 전송해야 합니다.

<div class="content-ad"></div>

안녕하세요! 같은 논리로 작동해요! Lora 라이브러리를 사용하여 이 논리를 설정하는 방법을 알아볼까요? LoRa.onReceive가 해답입니다! 아래 코드 조각에서는 콜백 함수인 onReceive을 등록합니다. 이 함수의 이름은 원하는 대로 지을 수 있어요.

```js
void setup() {
// 다른 설정 코드
  if (!LoRa.begin(915E6)) {             // 915MHz 주파수로 레이트 설정
    Serial.println("LoRa init failed. Check your connections.");
    while (true);                       // 실패 시 아무것도 안 함
  }
  LoRa.onReceive(onReceive); // 콜백 등록
  LoRa.receive(); // 수신 모드 활성화
  Serial.println("LoRa init succeeded.");
}
void loop() {
 sendMessage(String outgoing);
 delay(10000);
}
void onReceive(int packetSize) {
  if (packetSize == 0) return;          // 패킷이 없으면 반환
  
  // 수신된 데이터로 수행할 작업을 입력하세요.
    
}
void sendMessage(String outgoing) {
  LoRa.beginPacket();
  LoRa.print("hello");
  LoRa.endPacket();
  LoRa.receive();                     // 다시 수신 모드로 전환
}
```

중요! 메시지를 보낸 후에는 반드시 LoRa 모듈을 수신 모드로 돌려 놔야 해요. 그래서 sendMessage 함수 안에 LoRa.receive()를 호출한 거에요.

# 결론

<div class="content-ad"></div>

이제 LoRa를 사용하여 메시지를 보내고 받는 기본적인 사항을 이해했으니, 다음 글에서 게이트웨이 없는 LoRa 네트워크에 복잡한 로직을 구현하는 방법에 대해 이야기해 보겠습니다.

하지만 잠깐만 기다려주세요! 제공된 onReceive 예제는 좋은 시작점이지만, 제대로 처리되지 않으면 쉽게 충돌할 수 있다는 점을 꼭 기억해야 합니다. 이것은 라이브러리의 문제인가요? 그렇지 않습니다. onReceive 메서드의 섬세함은 잠재적인 충돌을 피하기 위해 신중하게 처리해야 한다는 점을 의미합니다. 늦기 전에 The Delicacy of LoRa.onReceive() 을 꼭 읽어보세요.

저는 우리가 논의한 사용자 정의 LoRa 프로토콜 구현에 작업 중입니다. 제 저장소를 확인해보세요: https://github.com/qiweimao/ESP32-Datalogger. 이 프로젝트는 ESP32가 LoRa를 통해 대용량 파일을 전송하고 주소 지정을 사용하여 슬레이브 모듈을 제어하는 것을 가능하게 합니다. 현재 보다 흥미로운 기능들이 개발 중입니다.

# 나에 대해

<div class="content-ad"></div>

안녕하세요! 제 이름은 Qiwei Mao이고 지반공학 기술자입니다. IoT 시스템에 열정을 갖고 있습니다. 취미로 사용되는 원격 모니터링 솔루션부터 산업용 모니터링 또는 제어 시스템까지 가능하도록 저전력 마이크로컨트롤러와 LoRa 통신 시스템을 탐구하고 있습니다.

[LinkedIn](LinkedIn 링크) | [Github](Github 링크) | [Reddit](Reddit 링크) | X | [Blog](Blog 링크)

Qiwei Mao