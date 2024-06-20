---
title: "안녕하세요, 지그비 월드 25화  OTA 펌웨어 업데이트"
description: ""
coverImage: "/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_0.png"
date: 2024-06-19 17:13
ogImage: 
  url: /assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_0.png
tag: Tech
originalTitle: "Hello Zigbee World, Part 25 — OTA Firmware Updates"
link: "https://medium.com/@omaslyuchenko/hello-zigbee-world-part-25-ota-firmware-updates-20b154b4a23b"
---


<img src="/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_0.png" />

만약 당신의 장치에 마이크로컨트롤러가 포함되어 있다면, 언젠가는 펌웨어 업데이트를 고려할 것입니다. 장치가 USB 또는 SD 카드 업데이트와 같은 쉬운 업데이트 방법을 지원하는 경우에는 보너스입니다. 또한 플래싱 도구를 가지고 이 도구를 장치에 연결할 수 있는 가능성도 좋은 선택지입니다. 그렇지 않다면 어떻게 해야 할까요?

다행히도 이에 대한 해결책이 있습니다: Zigbee의 표준화된 무선 업데이트(OTA). NXP JN5169 마이크로컨트롤러에는 OTA 펌웨어 업데이트를 구현하기에 충분한 플래시 메모리가 있습니다. 이 글에서 설명하는 지침은 Zigbee 사양을 준수하며 OTA 업데이트를 적용할 수 있지만, OTA 업데이트를 구현하는 것에는 복잡함이 딸립니다.

이 글은 Hello Zigbee 시리즈를 계속해서, 바닥부터 Zigbee 장치 펌웨어를 개발하는 데 초점을 맞춘 내용입니다. 저는 NXP JN5169 마이크로컨트롤러가 장착된 EBYTE E75-2G4M10S 모듈을 활용하여, 이 시리즈 이전 글에서 구축된 코드를 기반으로 구축할 것입니다.

<div class="content-ad"></div>

자 이제 함께 알아봅시다.

# Zigbee OTA 이론

## OTA 업데이트 프로토콜

OTA 클러스터는 꽤 복잡합니다. 메인 펌웨어와 다중 마이크로컨트롤러를 가진 장치의 보조 프로세서 펌웨어를 업데이트하기 위한 상세한 설정을 제공합니다. 프로세스에는 네트워크 혼잡을 피하기 위해 다운로드 속도를 관리하는 방법이 포함되어 있습니다. 또한 업데이트 절차는 다른 타임아웃 및 오류 코드에 의해 원활한 운영이 보장됩니다.

<div class="content-ad"></div>

복잡해 보이지만 펌웨어 업데이트 프로세스는 더 높은 수준에서는 간단합니다. 다음 다이어그램으로 요약할 수 있습니다.

![Hello Zigbee World Part 25 OTA Firmware Updates](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_1.png)

프로세스에는 두 장치가 관여됩니다. 코디네이터가 될 수 있지만 꼭 그럴 필요는 없는 서버가 다양한 클라이언트 장치의 펌웨어를 보관합니다. 클라이언트 장치는 업데이트 준비가 되면 서버에게 이용 가능한 펌웨어 업데이트 정보 및 펌웨어 데이터의 다음 부분을 요청합니다.

클라이언트가 펌웨어 업데이트 프로세스를 관리합니다. 새로운 정보를 받을 준비가 되면서 서버는 수동적인 역할을 합니다. 서버는 중간 업데이트 상태를 유지하지 않으며 모든 정보는 클라이언트에 저장됩니다. 그러나 펌웨어 업데이트 프로세스를 시작하는 것은 서버의 책임에 속할 수 있습니다.

<div class="content-ad"></div>

펌웨어 업데이트 프로세스 단계는 다음과 같습니다:

- 이미지 알림 메시지를 통해 서버는 기기에 새로운 펌웨어가 사용 가능하다는 정보를 전달할 수 있습니다. 재미있는 점은 이 메시지가 펌웨어 자체에 대한 구체적인 정보를 포함하지 않을 수 있다는 것입니다. 이는 더 많이 "알려드립니다, 나에게 궁금증이 있는 것이 있어"라는 메시지로, 클라이언트 기기에게 정확히 무엇인지 서버에게 문의하도록 유도합니다.
- 서버는 특정 기기 또는 특정 유형 및 제조업체의 여러 기기들에 대해 한 번에 알림을 보낼 수 있습니다. 대량 업데이트의 경우, 최종 기기들은 동시 업데이트와 네트워크 혼잡을 피하기 위해 임의 지연 후 펌웨어 업데이트를 시작합니다.
- 쿼리 넥스트 이미지 메시지를 통해 기기는 서버로부터 펌웨어의 구체적인 정보(버전, 크기 및 기타 매개변수)를 요청할 수 있으며, 현재 펌웨어 및 하드웨어 버전을 언급합니다.
- 특정 기기 모델 및 하드웨어 버전에 대한 새로운 펌웨어가 있으면 서버는 쿼리 넥스트 이미지 응답 메시지로 응답합니다.
- 이미지 블록 요청 메시지를 사용하여 기기는 펌웨어의 시작으로부터의 오프셋 및 필요한 바이트 수를 지정하여 작은 데이터 청크를 요청합니다. 서버는 요청된 바이트를 이미지 블록 응답 메시지로 전송합니다.
- Zigbee 메시지 크기 제한으로 한 번에 너무 많은 바이트를 전송하는 것을 방지합니다. NXP 기기의 경우, 전형적인 값은 48바이트입니다. 이론적으로 더 많은 바이트를 전송할 수도 있지만, 그러면 메시지가 단편화되어 조각조각 전송되어야 하며, 중간 기기가 이 전송 형식을 이해하고 단편화된 패킷을 재조립하기 위해 추가 논리 및 리소스를 사용해야 합니다. 이것은 전송 속도를 높이는 것이 아닐 수 있으므로 피하는 것이 좋습니다.
- 펌웨어를 다운로드한 후, 기기는 업그레이드 엔드 요청 메시지로 서버에 보고합니다. 클라이언트 기기는 무결성, 체크섬 및 요청에 언급된 대로 디지털 서명을 확인해야 합니다. 메시지는 또한 기기가 업데이트할 준비가 되었는지 또는 펌웨어를 다시 다운로드해야 하는지 또는 기기의 다른 마이크로컨트롤러에 대한 추가 펌웨어를 다운로드해야 하는지를 나타냅니다.
- 서버는 엔드 업그레이드 응답 메시지로 응답하여, 실제로 펌웨어를 플래시 메모리에 기록할 때를 지정합니다. 이는 여러 기기 간의 조정된 펌웨어 업데이트 또는 별도의 펌웨어를 필요로 하는 다중 마이크로컨트롤러가 있는 기기 내에서 업데이트를 조정하는 데 필요할 수 있습니다.

Zigbee2mqtt는 일반적으로 이 프로세스를 따르며, 사용 가능한 펌웨어를 확인하고 실제로 펌웨어 업데이트를 구현하는 두 가지 시나리오를 실행합니다.

사용 가능한 업데이트를 확인하는 방법에 대해 이야기해 봅시다. 나는 zigbee2mqtt가 외부 서버에서만 펌웨어 업데이트를 찾는 줄 알았고, 기기 자체가 이 프로세스에 참여해야 하는 이유를 이해하지 못했습니다. 작동 방식은 다음과 같습니다.

<div class="content-ad"></div>

기본적으로 Zigbee2mqtt(Z2M)는 장치의 현재 펌웨어 버전이나 하드웨어 버전을 알지 못합니다(다른 하드웨어 버전은 다른 펌웨어가 필요할 수 있습니다). 게다가 펌웨어 파일은 외부 서버에 위치해 있으며, Z2M은 언제든 사용 가능한 펌웨어 버전을 미리 알지 못합니다. 모든 필요한 정보를 알아내기 위해 다음과 같은 과정이 진행됩니다:

- Zigbee2mqtt는 Image Notify 메시지를 장치에 보냅니다("장치야, 뭔가 가지고 왔는데, 이 메시지에서는 뭔지 말하지 않겠어").
- 장치는 현재 펌웨어 및 하드웨어 버전을 알리는 Query Next Image Request를 서버에 보냅니다.
- Zigbee2mqtt는 응답하지 않습니다(Query Next Image Response 메시지 전송 없음)​ ​, 그리고 시간이 초과되면 장치는 초기 상태로 돌아갑니다.
- 그러나 이제 Z2M은 장치에 설치된 펌웨어와 하드웨어를 알고, 외부 펌웨어 서버에서 업데이트를 확인할 수 있습니다.
- 업데이트를 찾고 해당 장치의 하드웨어 버전과 호환되면 Zigbee2mqtt 대시보드에 이 정보를 빨간색 "장치 펌웨어 업데이트" 버튼과 함께 표시합니다.

사용자가 "장치 펌웨어 업데이트" 버튼을 클릭하면, 설명한 과정이 진행됩니다: Image Notify - Query Next Image Request - Image Block Request - End Update Request.

일반적인 OTA 펌웨어 업데이트 체계에 대한 설명을 마치며, 몇 가지 Wireshark 스크린샷을 보여드리겠습니다. 여기에는 현재 펌웨어 버전을 확인하는 부분이 포함되어 있습니다(나중에 업데이트가 있는지 확인하기 위해).

<div class="content-ad"></div>

아래는 펌웨어 업데이트 과정에 대한 몇 개의 스크린샷이 있습니다.

![image1](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_3.png)

![image2](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_4.png)

<div class="content-ad"></div>

업데이트 전체 구조는 명확해 보입니다. 그러나 사실은 그렇게 간단하지 않아요. 이제 세부 사항에 대해 자세히 살펴보려고 해요.

## 속도 제한

위 스크린샷에서 OTA 메시지가 일반 지그비 메시지와 동일하다는 것을 알 수 있어요. 메시지가 직접 전달되지 못할 경우 중간 라우터를 통해 전달됩니다. 펌웨어 데이터 메시지는 네트워크를 통해 일반 장치의 메시지와 함께 이동합니다. 패킷이 손실되면 메시지가 다시 전송됩니다.

항상 절전 모드인 최종 장치에 대한 펌웨어 업데이트도 작동해요. 장치는 다음 메시지를 받기 위해 부모 라우터를 계속 폴링해야 해요. 이 과정은 매우 활동적이며 에너지를 많이 소비해요. 그래서 배터리 구동 장치의 경우 배터리 수준을 지속적으로 확인하고 충전량이 충분하지 않은 경우 업데이트를 시작하지 않아야 합니다.

<div class="content-ad"></div>

또한, Zigbee 네트워크의 대역폭이 매우 높지 않다는 것을 기억해주세요. 이 네트워크는 250 kBaud 속도로 작동하지만 실제로는 실제 처리량이 낮습니다:

- 여러 장치가 동일한 주파수를 공유하며, 한 장치가 업데이트되는 동안 나머지는 정상적으로 작동하여 메시지를 송수신합니다.
- 대부분의 메시지에는 네트워크 수준의 확인 응답이 전송되며 때로는 응용 프로그램 수준의 응답도 채널을 잠시 사용합니다.
- 데이터가 중간 라우터를 통해 전송되는 경우, 각 메시지는 적어도 두 번 전송됩니다. 발신자에서 라우터로, 그리고 라우터에서 수신자로. 이 모든 것이 동일한 대역폭을 공유합니다.

펌웨어 업데이트에는 수십 또는 수백 킬로바이트로 측정되는 상당한 양의 데이터가 포함됩니다. 계속해서 스트리밍되는 경우 다른 장치들은 메시지를 보낼 수 없게 됩니다. 그래서 펌웨어 전송 중 데이터 흐름 속도를 제한하기 위한 절차가 개발되었습니다.

여기 작동 방식입니다. 장치는 Image Block Request 메시지로 다음 데이터 블록을 요청합니다. 네트워크가 비교적 자유로울 때, 서버는 SUCCESS 상태와 데이터 바이트를 포함한 Image Block Response를 보냅니다. 그러나 네트워크가 현재 바쁜 상태인 경우, 서버는 기다려야 하는 시간을 나타내며 Image Block Response 메시지를 WAIT_FOR_DATA 상태로 보냅니다.

<div class="content-ad"></div>

또한 빈 메시지를 주고 받지 않도록 하기 위해, 서버는 OTA 클러스터에서 클라이언트에게 MinBlockRequestDelay 속성을 설정할 수 있습니다. 이는 디바이스가 요청 간에 기다려야 하는 최소 시간을 지정합니다. 이를 위해 OTA 클러스터는 밀리초 타이머 메시지를 구독해야 하며, 클러스터는 필요한 시간 간격을 측정할 것입니다.

그러나 패키지 속도 제한은 펌웨어 측면에서 다루지 않을 것입니다. 이 기능은 이미 zigbee2mqtt (더 정확히는 herdsman-converters)에 내장되어 있습니다. 서버 자체가 요청 빈도를 모니터링하고, Image Block Response 패킷을 간단히 지연함으로써 250ms 간격을 유지할 것입니다.

## 상태 지속성

패킷 간에 일시 중지를 포함한 작은 청크로 데이터를 전송하기 때문에, 펌웨어 업데이트는 수십 분 단위로 측정될 수 있는 상당한 시간이 소요될 수 있습니다. 이 기간 동안 다양한 문제가 발생할 수 있습니다 — 배터리가 소진될 수 있고, 전기가 차단될 수 있으며, 네트워크가 사라질 수도 있고, 서버가 고장날 수도 있습니다. 이러한 경우에는 마이크로컨트롤러의 EEPROM에 중간 상태를 저장하여 사용합니다. 따라서 이 상태를 복원하고 펌웨어 다운로드를 계속할 수 있어야 합니다.

<div class="content-ad"></div>

다행히도 대부분의 이 기능은 SDK에서 구현이 되어 있습니다. 우리는 상태를 저장하고 복원하기 위한 함수만 제공하면 됩니다.

## [Optional] 서버 발견 업그레이드

이전에 업데이트 가능 여부를 확인하고 서버에서 시작된 업데이트 프로세스를 검토한 적이 있습니다. 실제로, 디바이스가 직접 서버에 쿼리 다음 이미지 요청을 보내어 펌웨어 업데이트를 시작할 수 있는 업데이트 시나리오도 있습니다.

일반적으로 OTA 업데이트 서버와 코디네이터는 같은 디바이스일 필요는 없습니다. 업데이트 서버는 다른 주소에 있을 수도 있습니다. 디바이스는 보통 업데이트 서버가 어디에 있는지 알지 못하기 때문에 클라이언트 디바이스를 구성하기 위해 몇 가지 예비 단계가 필요합니다. 이것이 업데이트 서버 발견 절차가 필요한 이유입니다.

<div class="content-ad"></div>

일반적인 개발 과정에요. 클라이언트 기기는 OTA 서버 클러스터를 지원하는지 묻는 방송 Match Descriptor Request를 보냅니다. 서버는 Match Descriptor Response를 보내 응답합니다.

하지만 여기서 끝이 아닙니다. 클라이언트 기기는 서버의 16비트 주소만 알게 되는데 이는 변경될 수 있습니다. 그래서 추가로 IEEE 주소 조회 요청이 필요합니다.

이는 JavaScript 또는 Python과 같은 고수준 언어로 쉽게 구현할 수 있는 선형 알고리즘처럼 보일 수 있습니다. 그러나 펌웨어에는 await이 없기 때문에 요청, 응답 및 그들 사이의 타임아웃을 주의 깊게 처리하는 상태 기계를 만들어야 합니다. 이는 표준의 선택적 부분이며 SDK에 구현되어 있지 않습니다. NXP의 예제에서 이러한 상태 기계는 약 천 줄 정도의 코드로 구현됩니다.

하지만 좋은 소식도 있습니다. 디바이스가 업데이트를 시작하는 기능을 포기하고 zigbee2mqtt가 코디네이터 및 업데이트 서버로 동작한다고 가정하면 Update Server Discovery 절차를 생략할 수 있습니다. 서버가 이미지 알림 메시지로 디바이스에 접근할 것입니다.

<div class="content-ad"></div>

## OTA 파일 형식

지그비 장치는 다양한 제조업체와 아키텍처의 마이크로컨트롤러를 사용하여 구축할 수 있습니다. 당연히, 이러한 마이크로컨트롤러용 펌웨어 형식은 다를 것입니다. 그럼에도 불구하고, zigbee2mqtt는 서로 다른 기기에 올바른 펌웨어 버전을 제공하기 위해 각 펌웨어 파일을 어떤 식으로든 구별해야 합니다.

따라서 Zigbee OTA는 모든 제조업체와 마이크로컨트롤러 아키텍처를 위해 통합된 펌웨어 형식을 사용합니다. 이 형식은 Zigbee ZCL 명세서에 자세히 기술되어 있습니다.

![이미지](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_5.png)

<div class="content-ad"></div>

이 형식은 컴파일러 및 링커가 생성하는 것과 다릅니다. 게다가 OTA 펌웨어 파일을 생성할 수 있는데, 예를 들어, 장치에 여러 개의 마이크로컨트롤러가 있는 경우 해당 펌웨어를 업데이트해야 합니다.

좋은 소식은 이것이 실제로 컴파일러에 의해 생성된 펌웨어 파일 위에 덧씌운 것에 불과하다는 점입니다. 그러나 이러한 래퍼를 생성하기 위해서는 여전히 약간의 노력이 필요할 것입니다.

## 플래시 메모리 리매핑 기능

Zigbee 프로토콜 측면을 더 잘 이해하려면 JN-AN-1003: JN51xx 부트로더 동작 문서를 참조하시기 바랍니다. 이 문서는 실제로 펌웨어를 마이크로컨트롤러로 로드하는 방법과 해당 펌웨어의 형식, 그리고 UART 펌웨어 업로드 작업에 대해 설명합니다.

<div class="content-ad"></div>

마이크로컨트롤러에는 32KB씩 16개의 섹터로 나누어진 512KB의 플래시 메모리가 포함되어 있습니다. 이 섹터 중 일부는 현재 마이크로컨트롤러의 펌웨어를 호스팅합니다. 나머지 블록은 다운로드한 펌웨어를 저장하는 데 사용될 수 있습니다. 그러나 마이크로컨트롤러를 새 펌웨어로 전환하는 방법은 무엇일까요?

JN5169 마이크로컨트롤러에는 섹터 리매핑 기능이 있습니다. 현재 펌웨어가 들어 있는 섹터와 새 펌웨어를 다운로드할 위치를 지정할 수 있습니다. 새 펌웨어로 전환하는 것은 단순히 섹터를 리매핑하는 것입니다.

물리적 및 논리적 섹터가 어떻게 매치되는지에 대한 예제를 살펴보겠습니다. 처음에는 물리적 및 논리적 섹터의 번호 매기기가 일치할 것입니다.

![이미지](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_6.png)

<div class="content-ad"></div>

새 firmware이 물리적 섹터 0x8부터 0xF까지 다운로드되면, 마이크로컨트롤러는 섹터 리매핑 프로시저를 수행할 수 있습니다 — 논리적 섹터 0은 그 후 물리적 섹터 8을 가리킬 것이고, 섹터 1은 섹터 9를, 이와 같이 계속됩니다 (그 반대도 마찬가지). Firmware은 논리적 주소에서 작동하기 때문에 새 firmware은 재부팅 후에 로드될 것입니다.

![이미지](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_7.png)

위 예시는 firmware 크기가 약 256k이고 8개 섹터를 차지하는 경우를 개요로 합니다. JN-AN-1003 문서와 JN-UG-3115 문서의 부록 F에서는 firmware 크기가 8개 섹터보다 작은 경우의 특별한 노트가 있습니다. 예를 들어, firmware 크기가 딱 6개 섹터인 경우를 살펴보겠습니다. 이 경우, 섹터 0x8부터 0xD에 다운로드되고, 0xE와 0xF 섹터는 사용되지 않습니다.

![이미지](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_8.png)

<div class="content-ad"></div>

재부팅 중에 부트로더는 섹터를 다시 매핑하지만 다운로드한 펌웨어 데이터를 포함하는 섹터에 대해서만 수행합니다 (0x8부터 0xD까지의 섹터). 이것은 섹터 0xE와 0xF에 일부 데이터를 보존하고 싶을 때 유용할 수 있습니다.

![이미지](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_9.png)

펌웨어를 다시 업데이트하기로 결정하면, 논리적인 섹터 0x8부터 0x0F에 다운로드됩니다. 하지만, 다음 펌웨어가 더 크고 6개 대신 7개의 섹터를 사용하는 경우, 물리적인 섹터 0부터 5와 0xE에 쓰여질 것입니다. 이는 펌웨어가 연속적이지 않은 섹터에 기록될 것을 의미합니다. 먼저, 이는 보존하고 싶었던 섹터 0xE의 가치 있는 데이터를 덮어쓸 수 있습니다. 그리고 부트로더는 펌웨어가 연속적인 섹터에 위치해야 하므로, 그렇지 않으면 펌웨어가 올바르게 로드되지 않을 수 있습니다.

저희 예제에서는 어떠한 데이터도 저장하기 위해 플래시 섹터를 사용하지 않을 것입니다 — 마이크로컨트롤러에는 PDM으로 지속되는 값들에 충분한 4k 이프롬이 있습니다. 우리 모델에서는 펌웨어 업데이트를 수행할 때 항상 섹터 0부터 7을 섹터 8부터 0xF로 교체할 예정입니다. 이렇게 함으로써 섹터 번호의 단편화를 피하고 펌웨어 코드를 간단하게 만들 수 있을 것입니다. 따라서 현재 펌웨어는 항상 물리적인 섹터 0부터 7까지 차지하고 있으며, 새로운 펌웨어는 섹터 8부터 0xF에 다운로드된 후 역할이 변경될 것입니다.

<div class="content-ad"></div>

단연코, 펌웨어는 플래시 메모리의 절반인 256 KB보다 커서는 안 됩니다. 그러나 마이크로컨트롤러(그리고 OTA 구현)는 보드에 외부 SPI 플래시 메모리가 있다면 해당 플래시 메모리로 펌웨어를 로드할 수 있습니다. 그래서 256 KB보다 많은 공간이 필요한 사람들은 이 옵션을 탐색하는 것이 유용할 수 있습니다.

# 구현

## OTA 클러스터 추가

그래서 코드 작업을 진행해 봅시다. OTA 클러스터 자체를 추가하는 방법은 다른 클러스터를 추가하는 것과 크게 다르지 않습니다. 먼저, Zigbee 구성 편집기에 OTA 클러스터를 추가합니다.

<div class="content-ad"></div>

위의 GUI에서 변경된 사항은 빌드 프로세스의 일부로 실행되는 ZPSConfig 도구를 사용하여 zps_gen.c/h 파일로 변환됩니다.

다음으로 zcl_options.h에서 클러스터 및 해당 설정을 활성화하세요.

```js
#define CLD_OTA
#define OTA_CLIENT
#define OTA_NO_CERTIFICATE
#define OTA_CLD_ATTR_FILE_OFFSET
#define OTA_CLD_ATTR_CURRENT_FILE_VERSION
#define OTA_CLD_ATTR_CURRENT_ZIGBEE_STACK_VERSION
#define OTA_MAX_BLOCK_SIZE 48
#define OTA_TIME_INTERVAL_BETWEEN_RETRIES 10
#define OTA_STRING_COMPARE
#define OTA_UPGRADE_VOLTAGE_CHECK
```

<div class="content-ad"></div>

이제 재미있는 부분이 시작됩니다. 이러한 설정들은 몇 가지 설명이 필요합니다. 그렇지 않으면 OTA 클러스터가 컴파일되지 않습니다:

- CLD_OTA 및 OTA_CLIENT는 OTA 클러스터를 클라이언트 모드로 구현하는 기능을 활성화합니다.
- OTA_NO_CERTIFICATE — 암호화 인증서를 사용하지 않을 것입니다. 이러한 인증서가 없으며 디지털 서명 검증에 사용되는 라이브러리가 없습니다.
- OTA_CLD_ATTR_*는 여러 OTA 클러스터 속성을 활성화합니다. zigbee2mqtt에서 사용되지 않을 수 있지만 일부 속성을 포함하겠습니다. 흥미로운 것으로 간주되는 일부 속성을 활성화했습니다.
- OTA_MAX_BLOCK_SIZE는 다운로드 블록 크기를 48바이트로 설정합니다. 이 매개변수는 데이터를 플래시 메모리에 쓰기 위해 16의 배수여야 합니다. 또한 최대 Zigbee 패킷 크기를 초과하지 않도록 너무 크지 않아야 합니다.
- OTA_TIME_INTERVAL_BETWEEN_RETRIES — 서버 요청 재시도 간의 간격(예: 서버와의 연결이 끊어졌을 때). 클라이언트가 너무 자주 서버에 요청을 보내지 않도록 간격을 설정합니다.
- OTA_STRING_COMPARE는 특히 OTA 펌웨어 헤더의 32바이트 문자열 식별자를 통한 펌웨어 유효성 검사를 활성화합니다. 기대하는 값과 일치하지 않으면 펌웨어 업데이트가 오류와 함께 중지됩니다. 또한 이 검사는 펌웨어 다운로드의 맨 처음에 수행됩니다: 헤더와 함께 작은 부분이 다운로드되며 문자열 식별자가 체크되며, 일치하지 않으면 펌웨어가 심지어 다운로드되지 않습니다.
- OTA_UPGRADE_VOLTAGE_CHECK는 펌웨어를 업데이트하기 전에 배터리 잔량을 확인하고 (배터리가 낮으면 업데이트를 방지) 적용합니다. 라우터에는 관련성이 없지만 전원이 배터리로 공급되는 장치에 유용할 수 있습니다.

또한, `OTA_INTERNAL_STORAGE` 정의를 추가하십시오 — 이 설정은 마이크로콘트롤러의 내부 플래시 메모리에 쓰기를 활성화합니다 (외부 플래시 드라이브가 아닌). 이 define은 OTA 클러스터 코드에서만 사용되지만, 이 설정은 OTA 클러스터 설정이 아닌 보드 및 마이크로컨트롤러의 물리적 특성과 관련이 있다고 생각되어 CMakeList.txt에 배치하기로 결정했습니다.

```js
ADD_DEFINITIONS(
...
        -DOTA_INTERNAL_STORAGE
```

<div class="content-ad"></div>

## OTA 클러스터 초기화

일반 프로젝트 설정이 끝났으니, 추가적인 코드 작성을 시작해봅시다. 문서에는 초기화 프로세스에 대해 상세히 설명되어 있습니다. 흥미로운 점은 NXP 예제에서 몇 가지 측면을 약간 다르게 처리한다는 것입니다. 특히 문서와 다르게 몇 가지 부정확한 정보가 있기 때문에 우리는 문서에서 벗어나 허용하려고 합니다.

문서는 초기화 프로세스를 다음과 같이 설명합니다.

![2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_11.png](/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_11.png)

<div class="content-ad"></div>

1~3단계에 문제가 없어요. 이미 Main.cpp에서 우리의 펌웨어를 처리했어요. 하지만 4번째 단계의 설명이 약간 부정확해 보여요. 문서에는 eOTA_Create()를 호출한 후에 즉시 eOTA_UpdateClientAttributes()를 호출하라고 합니다. 하지만 이 방법은 작동하지 않아요. 왜냐하면 eOTA_UpdateClientAttributes()를 호출하려면 OTA 엔드포인트가 먼저 등록되어 있어야 해요. 즉, 6단계(엔드포인트 등록)를 eOTA_Create()와 eOTA_UpdateClientAttributes() 사이에 완료해야 해요.

내 구현에서 OTA 클러스터는 BasicClusterEndpoint 클래스의 다른 기본 장치 클러스터들과 함께 사용될 거예요.

```js
void BasicClusterEndpoint::init()
{
    registerBasicCluster();
    registerIdentifyCluster();
    registerOtaCluster();
    registerEndpoint();
...
    // OTA 초기화
    otaHandlers.initOTA(getEndpointId());
}
```

OTA 클러스터는 eOTA_Create() 함수로 등록되어요.

<div class="content-ad"></div>

```cpp
void BasicClusterEndpoint::registerOtaCluster()
{
    DBG_vPrintf(TRUE, "BasicClusterEndpoint::registerOtaCluster(): Registering ota cluster\n");
    // 클라이언트로서 OTA 클러스터의 인스턴스를 생성합니다
    teZCL_Status status = eOTA_Create(&clusterInstances.sOTAClient,
                                      FALSE,  /* 클라이언트 */
                                      &sCLD_OTA,
                                      &sOTAClientCluster,  /* 클러스터 정의 */
                                      getEndpointId(),
                                      NULL,
                                      &sOTACustomDataStruct);

    if(status != E_ZCL_SUCCESS)
        DBG_vPrintf(TRUE, "BasicClusterEndpoint::registerOtaCluster(): OTA 클러스터 인스턴스 생성에 실패했습니다. 상태=%d\n", status);
}
```

이제 OTA 초기화를 진행해야 합니다. OTA와 관련된 모든 것(클러스터 등록을 제외하고)를 단순히 기능을 그룹화하기 위해 별도의 클래스인 `OTAHandlers`로 이동했습니다.

```cpp
class OTAHandlers
{
    uint8 otaEp;
    PersistedValue<tsOTA_PersistedData, PDM_ID_OTA_DATA> sPersistedData;
...
```

지침의 4단계에서 제안한 대로, OTA 클러스터 속성을 초기화해야 합니다. 언급했듯이 OTA 구현은 펌웨어 업데이트 상태가 EEPROM에 저장되고 재부팅 후에 복원될 것을 가정합니다. 저는 이를 다음과 같이 구현했습니다.

<div class="content-ad"></div>

```cpp
void resetPersistedOTAData(tsOTA_PersistedData * persistedData)
{
    memset(persistedData, 0, sizeof(tsOTA_PersistedData));
}

void OTAHandlers::restoreOTAAttributes()
{
    // 클러스터 속성을 초기값으로 설정합니다.
    teZCL_Status status = eOTA_UpdateClientAttributes(otaEp, 0);
    if(status != E_ZCL_SUCCESS)
        DBG_vPrintf(TRUE, "OTAHandlers::restoreOTAAttributes(): OTA 클러스터 속성 생성 실패. 상태=%d\n", status);

    // 이전 값 복원 또는 제로 리셋
    sPersistedData.init(resetPersistedOTAData, "OTA 데이터");
    status = eOTA_RestoreClientData(otaEp, &sPersistedData, TRUE);
    if(status != E_ZCL_SUCCESS)
        DBG_vPrintf(TRUE, "OTAHandlers::restoreOTAAttributes(): OTA 데이터 복원 실패. 상태=%d\n", status);
}
```

eOTA_UpdateClientAttributes() 함수는 클러스터 속성을 일부 초기값으로 설정합니다.

펌웨어 업그레이드 진행 상황은 tsOTA_PersistedData 구조체에 저장됩니다. 이는 펌웨어 업그레이드 프로세스가 재부팅 후 일시 중지 및 재개할 수 있는 모든 정보를 포함합니다. 현재 다운로드된 펌웨어 메타데이터, 크기, 현재 파일 오프셋, 재시도 횟수 등이 포함됩니다. OTA ZCL 구현은 현재 상태를 주기적으로 EEPROM에 저장합니다.

두 번째 코드 블록은 플래시 메모리에서 상태를 읽고 이 정보를 OTA 클러스터 내부 구조에 복원합니다. 첫 번째 장치 시작이며 EEPROM에 상태 레코드가 없는 경우, resetPersistedOTAData() 함수가 호출되어 구조체를 제로값으로 초기화합니다.

<div class="content-ad"></div>

## 플래시 메모리 초기화

이제 펌웨어가 다운로드될 플래시 메모리를 초기화하는 데 집중할 시간입니다.

```js
void OTAHandlers::initFlash()
{
    // 잘못된 또는 비연속적인 플래시 리매핑을 수정하고 최적화
    if (u32REG_SysRead(REG_SYS_FLASH_REMAP) & 0xf)
    {
        vREG_SysWrite(REG_SYS_FLASH_REMAP,  0xfedcba98);
        vREG_SysWrite(REG_SYS_FLASH_REMAP2, 0x76543210);
    }
...
```

이 코드는 논리적인 섹터 0–7 및 8–0xF가 연속적인 물리적 섹터를 사용하도록 섹터 매핑을 준비합니다. 리매핑 과정은 위의 전용 섹션에 설명되어 있습니다.

<div class="content-ad"></div>

다음으로, 새 펌웨어가 쓰여질 플래시 메모리 공간을 초기화하는 시간입니다. 말씀드렸듯이, 마이크로컨트롤러는 펌웨어용 외부 메모리를 지원합니다. 그러나 현재는 내부 메모리만으로도 충분합니다. (네, 이미 OTA_INTERNAL_STORAGE를 정의했지만, NXP 개발자들에게는 그게 충분하지 않은 것 같습니다).

Markdown 형식으로 표를 변경합니다.

```js
    // 다운로드된 펌웨어를 저장하기 위한 플래시 메모리 초기화
    tsNvmDefs sNvmDefs;
    sNvmDefs.u32SectorSize = 32*1024; // 섹터 크기 = 32K
    sNvmDefs.u8FlashDeviceType = E_FL_CHIP_INTERNAL;
    vOTA_FlashInit(NULL, &sNvmDefs);
```

여기 또 하나 흥미로운 코드 조각이 있습니다.

```js
    // 엔드포인트에 대한 일부 OTA 관련 레코드 작성
    uint8 au8CAPublicKey[22] = {0};
    uint8 u8StartSector[1] = {8};
    teZCL_Status status = eOTA_AllocateEndpointOTASpace(
                            otaEp,
                            u8StartSector,
                            OTA_MAX_IMAGES_PER_ENDPOINT,
                            8,                                 // 이미지당 최대 섹터 수
                            FALSE,
                            au8CAPublicKey);
    if(status != E_ZCL_SUCCESS)
        DBG_vPrintf(TRUE, "OTAHandlers::initFlash(): 엔드포인트 OTA 공간 할당 실패 (OTA 빌드가 아닌 경우 무시할 수 있습니다). status=%d\n", status);
```

<div class="content-ad"></div>

이 코드는 새 펌웨어를 다운로드할 위치(논리 섹터 8부터 시작) 및 최대 펌웨어 크기(8개 섹터, 즉 256k)를 지정합니다.

## ZCL 타이머

이어서 펌웨어 업데이트 프로토콜은 외관상 간단해 보이지만 여러 잠재적인 고장 지점이 있습니다. 메시지가 도착하지 않을 수도 있고, 늦게 도착할 수도 있으며, 잘못된 데이터를 포함할 수도 있습니다. 내부 상태 기계는 이러한 상황을 처리하기 위해 가능한 신뢰성 있어야 합니다. 일관되지 않은 상태가 발생하거나 타임아웃이 발생하면 상태 기계는 장치를 정상 작동 상태로 되돌려야 합니다. 실제로 이러한 상황은 상당히 자주 발생합니다. 제 테스트 네트워크에서는 펌웨어 업데이트 중에 3~4회 발생합니다.

지금까지 사용한 대부분의 클러스터는 시간과 독립적으로 작동합니다. 그들은 들어오는 요청을 처리하거나 내부 이벤트가 발생하면 상태 알림을 보냅니다. 그러나 OTA 클러스터는 타임아웃을 세어내려가기 위해 시간을 알아야 합니다. 이를 위해 OTA 클러스터는 한 번에 한 번씩 틱하는 ZCL 타이머를 사용합니다.

<div class="content-ad"></div>

그 전에 다음과 같이 ZCLTimer 클래스를 추가했습니다. 그래서 새로운 코드가 필요하지 않습니다. 내용은 다음과 같습니다.

```js
class ZCLTimer: public PeriodicTask
{
    uint32 tick1s;
    uint32 tick100ms;

public:
    ZCLTimer();
    void init();

protected:
    virtual void timerCallback();
};

void ZCLTimer::init()
{
    PeriodicTask::init(10);
    tick1s = 0;
    tick100ms = 0;
}

void ZCLTimer::timerCallback()
{
    tick1s++;
    tick100ms++;

    if(tick100ms >= 10)
    {
        eZCL_Update100mS();

        tick100ms = 0;
    }

    if(tick1s >= 100)
    {
        // Process ZCL timers
        tsZCL_CallBackEvent sCallBackEvent;
        sCallBackEvent.pZPSevent = NULL;
        sCallBackEvent.eEventType = E_ZCL_CBET_TIMER;
        vZCL_EventHandler(&sCallBackEvent);

        tick1s = 0;
    }
}
```

내부 타이머는 매 10ms마다 틱하게 됩니다. 1초 주기가 도달하면 코드가 E_ZCL_CBET_TIMER를 생성하고, ZCL이 OTA 작업을 모두 처리합니다.

## OTA 이벤트 처리

<div class="content-ad"></div>

OTA 클러스터는 펌웨어 업데이트 프로세스를 완전히 구현합니다. 때때로 ZCL은 업데이트 진행 상황에 관한 알림을 보냅니다. OTA 관련 작업은 별도의 클래스에서 처리되므로 이벤트 리다이렉션을 OTAHandlers 클래스로 설정했습니다.

```js
void BasicClusterEndpoint::handleClusterUpdate(tsZCL_CallBackEvent *psEvent)
{
    uint16 clusterId = psEvent->psClusterInstance->psClusterDefinition->u16ClusterEnum;
    switch(clusterId)
    {
...
        case OTA_CLUSTER_ID:
            handleOTAClusterUpdate(psEvent);
            break;
...

void BasicClusterEndpoint::handleOTAClusterUpdate(tsZCL_CallBackEvent *psEvent)
{
    // OTA 메시지 파싱 및 처리
    tsOTA_CallBackMessage *psCallBackMessage = (tsOTA_CallBackMessage *)psEvent->uMessage.sClusterCustomMessage.pvCustomData;
    otaHandlers.handleOTAMessage(psCallBackMessage);
}

...

void OTAHandlers::handleOTAMessage(tsOTA_CallBackMessage * pMsg)
{
    vDumpOTAMessage(pMsg);
...
}
```

이러한 이벤트 대부분은 우리에게 정보 제공을 위한 것이며 별도의 처리가 필요하지 않습니다. 실제로 이러한 이벤트에 대한 핸들러를 구현하지 않고도 안정적인 펌웨어 업데이트를 성공적으로 달성했습니다.

그러나 이러한 이벤트는 사용자 정의 가능한 가능성을 제공합니다. 예를 들어, NXP의 예시는 OTA 이벤트를 사용하여 장치의 업데이트 필요 여부, 다운로드된 펌웨어의 무결성, 추가적인 타임아웃, 다운로드 상태 모니터링을 확인하는 데 사용합니다(표준 구현 위에 많이 구축하였습니다).

<div class="content-ad"></div>

## [Optional] 컨텍스트 저장 및 복원

핸들링이 필요한 유일한 이벤트는 컨텍스트 저장입니다. OTA 클러스터 구현은 때때로 상태를 저장하여 예기치 않은 재부팅 후 펌웨어 다운로드를 재개할 수 있도록 합니다.

상태를 저장하는 코드는 다음과 같습니다. 상태 자체는 OTA 클러스터 인스턴스 내부에 저장되며 거기서 추출해야 합니다. NXP 예제에서는 OTA의 내부에 직접 액세스하지만, 저는 모듈 간 경계를 유지하고 예의와 존중을 유지하려고 노력했습니다.

```js
void OTAHandlers::saveOTAContext(tsOTA_PersistedData * pData)
{
    DBG_vPrintf(TRUE, "OTA 컨텍스트 저장 중... ");

    // 데이터 저장
    sPersistedData = *pdData;

    DBG_vPrintf(TRUE, "완료\n");
}

void OTAHandlers::handleOTAMessage(tsOTA_CallBackMessage * pMsg)
{
    vDumpOTAMessage(pMsg);

    switch(pMsg->eEventId)
    {
    case E_CLD_OTA_INTERNAL_COMMAND_SAVE_CONTEXT:
        saveOTAContext(&pMsg->sPersistedData);
        break;
    default:
        break;
    }
}
```

<div class="content-ad"></div>

로딩 및 복원 상태도 일부 개선이 필요합니다 (NXP의 예시에서 영감을 받았어요).

```js
void OTAHandlers::restoreOTAAttributes()
{
    // 속성을 기본 값으로 재설정합니다
    teZCL_Status status = eOTA_UpdateClientAttributes(otaEp, 0);
    if(status != E_ZCL_SUCCESS)
        DBG_vPrintf(TRUE, "OTAHandlers::restoreOTAAttributes(): OTA 클러스터 속성 생성에 실패했습니다. status=%d\n", status);

    // 이전 값 복원 또는 0으로 재설정
    sPersistedData.init(resetPersistedOTAData, "OTA 데이터");

    // 10초 후 다시 시도되도록 재시도 타이머를 수정합니다
    if((&sPersistedData)->u32RequestBlockRequestTime != 0)
    {
        DBG_vPrintf(TRUE, "OTAHandlers::restoreOTAAttriutes(): 현재 작업을 10초 후 다시 시도할 것입니다 (이전 값 %d)\n", (&sPersistedData)->u32RequestBlockRequestTime);
        (&sPersistedData)->u32RequestBlockRequestTime = 10;
    }

    status = eOTA_RestoreClientData(otaEp, &sPersistedData, TRUE);
    if(status != E_ZCL_SUCCESS)
        DBG_vPrintf(TRUE, "OTAHandlers::restoreOTAAttributes(): OTA 데이터 복원에 실패했습니다. status=%d\n", status);
}
```

u32RequestBlockRequestTime 변수를 조정하는 코드가 추가되었습니다. 기본적으로 긴 시간 초과 (예: 1시간)으로 설정되어 있지만, 재부팅 후 펌웨어 다운로드를 더 빨리 재개하고자 합니다 (10초 이내).

솔직히 말해서, 이 코드에 대해 자신감이 많이 없어요. 한 번 이 설정 전체가 일관성 없는 상태에 갇혔던 적이 있어요. 이게 어떻게 발생했는지 알려드릴게요.

<div class="content-ad"></div>

테스트 목적으로 펌웨어 업데이트 중에 디바이스를 끄고 zigbee2mqtt에서 타임아웃이 발생할 때 어떤 일이 일어날지 확인해봤어요. 다시 켜니까, 디바이스가 이전 상태를 복원했어요. 디바이스는 다음 블록을 요청하려고 시도했지만 물론 받지 못했죠. 여러 차례 시도한 후, 디바이스는 포기하고 정상 작동으로 돌아갔어요.

문제는 이 "정상 상태"가 EEPROM에 저장되지 않았고, 내 코드는 이에 대해 전혀 알지 못했어요. 디바이스가 재부팅되면 EEPROM에서 잘못된 상태를 다시 읽고 펌웨어 업데이트를 계속하려고 시도했어요.

NXP 사에서는 이 문제를 해결하기 위해 예제에 추가적인 타임아웃을 넣었더라고 해요. 이 타임아웃이 트리거되면, OTA 클러스터 깊숙한 곳에서 무언가를 강제로 수정하여 원래 상태로 돌아가게 했어요.

아직 이 행동을 처리하거나 컨텍스트 저장을 완전히 비활성화할지 결정하지 않았어요. 디바이스가 리부팅 후 깨끗한 상태로 시작하고, 단순히 펌웨어 업데이트 프로세스를 다시 시작하는게 나을지도 모르겠네요.

<div class="content-ad"></div>

## 펌웨어 바이너리 크기 수정

플래시 메모리에 쓰기 위해서는 데이터가 16바이트의 배수인 블록으로 이루어져야 합니다. 그러나 컴파일러의 펌웨어는 항상 이 크기 요구 사항을 충족시키지 않을 수 있습니다.

이상적으로는 필요한 경우 코드를 조정하여 추가 바이트를 추가하는 것이 간단할 것입니다. 그러나 NXP의 OTA 구현에서 한 가지 문제가 있습니다: 펌웨어가 16바이트의 배수가 아닌 경우, 장치가 실제 크기를 넘어선 블록을 추가로 요청하는 버그가 발생합니다.

OTA 코드에서 이 버그를 수정하는 것이 가능하지만, SDK 코드를 수정하는 것은 제 선택이 아니었습니다. 대신, 이진 크기를 16바이트의 배수로 반올림하는 방법을 찾았으나, 이를 달성하는 방법을 모르겠습니다 (파이썬 스크립트를 사용하여 바이트를 추가하는 방법 뿐일지도 모릅니다).

<div class="content-ad"></div>

결국 특정 스크립트를 사용하여 링커를 조정하는 데 성공했습니다.

```js
INCLUDE AppBuildZBPro.ld

SECTIONS
{
...
        /*
         * 이전 섹션이 16바이트 경계로 패딩되도록 더미 섹션을 만듭니다.
         */
        .pad ((LOADADDR(.text) + SIZEOF(.text) + SIZEOF(.data) + 15) & ~ 15 ):
        {
            . = ALIGN (16);
            LONG(0x00000000)
            LONG(0x00000000)
            LONG(0x00000000)
            LONG(0x00000000)
        } > flash
}
```

펌웨어 크기를 조정하는 마법은 SDK의 AppBuildZBPro.ld 스크립트를 먼저 실행하는 데 있습니다. 이 스크립트는 필요한 섹션을 삽입하고 모든 것을 마이크로컨트롤러 메모리에 올바르게 배치하여 완전한 이진 파일을 빌드합니다.

핵심은 16개의 0으로 구성된 "pad" 섹션을 추가하는 것입니다. 이 섹션은 .text 및 .data 섹션 다음에 16바이트로 정렬됩니다. 이 정렬로 링커는 .pad 섹션 앞에 충분한 바이트를 추가하여 펌웨어의 총 크기가 16바이트의 배수가 되도록합니다. OTA 업데이트용으로 파일 서명이 시작할 때 추가 4바이트도 있지만 이것은 펌웨어의 일부로 간주되지 않습니다.

<div class="content-ad"></div>

링커 스크립트는 다음과 같이 CMakeList.txt에 포함되어 있습니다:

```js
SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -T${HelloZigbee_SOURCE_DIR}/HelloZigbee.ld")
```

컴파일러 및 링커는 .elf 파일을 생성하며, 이 파일은 마이크로컨트롤러에 직접로드할 수 없습니다. .elf 파일을 플래시 가능한 이진 파일로 변환하기 위해 `objcopy` 유틸리티를 사용합니다. 이 유틸리티를 호출하는 것은 이미 빌드 스크립트의 일부이지만, 우리는 .pad 섹션을 유지하도록 지시해야 합니다. 그렇지 않으면 섹션이 삭제되고 그 앞의 추가 바이트가 제거됩니다. 이를 objcopy 명령에 " -j .ota" 옵션을 추가하여 해결합니다.

## OTA 헤더 추가하기

<div class="content-ad"></div>

모두 해결되었다고 생각했을 때, 그 이상이 있습니다! 이 코드가 작동하려면 또 다른 링커 매직이 필요합니다.

OTA 업데이트 서버는 마이크로컨트롤러에 로드된 펌웨어를 식별해야 합니다. 이는 펌웨어 버전, 하드웨어 버전, 펌웨어 파일 유형 및 기타 세부 정보를 포함합니다. 이 모든 정보를 상수나 정의로 컴파일하여 펌웨어에 포함시킬 수 있지만, NXP 개발자들은 펌웨어에 완전한 OTA 헤더를 포함하기로 선택했습니다. 이 구조의 모든 필드가 컴파일 시간에 알려지지 않기 때문에 펌웨어 코드는 .ro_ota_header 섹션에 구조체에 대한 공간을 예약하여 이를 처리합니다. 이 구조체는 완성된 펌웨어 이진 파일에서 외부 Jennic 암호화 도구(JET)를 통해 직접 채워집니다.

하지만 문제가 있습니다. JET은 펌웨어 내 OTA 구조의 정확한 위치를 알아야 합니다. 이를 위해 링커는 파일 시작점으로부터 특정 오프셋에 .ro_ota_header 섹션을 배치해야 합니다.

그 외에도 이 섹션 앞에 다른 섹션이 필요합니다. 즉, .ro_mac_address가 있어야 합니다. 각 칩은 공장에서 고유한 MAC 주소가 할당되지만 때로는 JET 도구를 사용하여 이 주소를 재정의해야 할 수도 있습니다. 재정의 MAC 주소 기능을 사용하지는 않지만, .ro_mac_address 섹션이 펌웨어에 있어야 합니다. 그렇지 않으면 JET이 .ro_ota_header를 놓칠 수 있습니다.

<div class="content-ad"></div>

사용되지 않더라도 파일에 모든 섹션이 유지되도록 하려면 다른 링커 기술을 사용할 수 있습니다. 링커 스크립트의 KEEP 키워드는 모든 필요한 섹션을 보존하여 이를 달성하는 데 도움을 줍니다.

```js
SECTIONS
{
        .ro_mac_address :
        {
            KEEP(*(.ro_mac_address));
        } > flash

        .ro_ota_header :
        {
            KEEP(*(.ro_ota_header));
        } > flash
        
        .ro_se_lnkKey :
        {
            KEEP(*(.ro_se_lnkKey));
        } > flash
...
```

이전에 결과 이진 파일에서 모든 섹션을 유지하도록 objcopy 유틸리티에 알려야 한다고 언급했습니다. 이를 위해 "objcopy"의 command line 옵션에 "-j .ro_mac_address -j .ro_ota_header"를 추가합니다.

SDK에 포함된 JET 유틸리티에 대해 이해해야 합니다. 해당 작업은 JN-UG-3081 문서에 자세히 설명되어 있습니다. 불행히도 이 문서는 내재적인 프로세스를 충분히 명확히 하지 않습니다. 기존 지식을 전제로 한 세부 정보를 생략합니다. 그래서 올바른 설정을 찾기 위해 시행착오 방법을 사용해야 했습니다.

<div class="content-ad"></div>


C:\NXP\bstudio_nxp\sdk\JN-SW-4170\Tools\OTAUtils\JET.exe -m otamerge --embed_hdr -c HelloZigbee.bin -o HelloZigbee.ota.bin -v JN516x -n 1 -t 1 -u 0x1037 -j "HelloZigbee2021                 "


위 명령어에서 각 옵션의 의미는 다음과 같습니다:

- -m otamerge는 다양한 OTA 정보를 단일 이진 파일로 병합하는 모드를 활성화합니다.
- --embed_hdr는 OTA 헤더를 이진 파일에 포함하는 서브 모드를 활성화합니다.
- -c HelloZigbee.bin은 objcopy에서 얻은 소스 펌웨어 파일을 지정합니다. -c는 펌웨어가 OTA 클라이언트용으로 빌드되었음을 나타냅니다.
- -o HelloZigbee.ota.bin은 결과 파일의 이름을 지정합니다. 이 파일은 아직 서버에 배치될 수 없지만 이미 마이크로컨트롤러에 플래시될 수 있습니다.
- -v JN516x는 마이크로컨트롤러 패밀리명을 나타냅니다 (다른 마이크로컨트롤러는 다른 펌웨어 형식을 갖습니다).
- -n 1은 펌웨어 파일 버전을 설정합니다.
- -t 1은 펌웨어 파일 유형을 설정합니다 (보드에 여러 마이크로컨트롤러가 있고 각각이 자체 펌웨어를 필요로 하는 경우 해당됨. 여기서는 하나의 유형만 사용할 것입니다).
- -u 0x1037은 제조사 ID를 지정합니다. 현재는 NXP의 ID를 사용합니다.
- -j “HelloZigbee2021 “ (위 명령줄과 같이 정확히 많은 공백이 있는 상태) — OTA 헤더에 32바이트 문자열을 플래시합니다. 이 문자열은 펌웨어 업데이트 중에 확인되며 (업데이트할 펌웨어는 동일한 헤더 문자열을 가져야 함) 펌웨어가 로드되지 않습니다.

참고로, OTA 헤더에 포함된 펌웨어 버전은 기본 클러스터에서 보고되고 Z2M 장치 정보 페이지에 표시되는 펌웨어 버전 문자열과 동일하지 않습니다. 이는 단순히 업데이트 프로세스에 참여하지 않는 문자열일 뿐입니다.


<div class="content-ad"></div>

## OTAP 펌웨어

이러한 단계를 따르면 마이크로컨트롤러에 플래시할 준비가 된 적절한 펌웨어를 생성할 수 있습니다. 완료되면 펌웨어 내부의 OTAP 헤더에 액세스해야 하는 모든 기능이 의도대로 작동합니다. 그러나 올바른 펌웨어를 생성하는 것만으로는 서버에 업로드하여 OTAP 업데이트를 할 수 없습니다.

이전에 설명했듯이 OTAP 업데이트용 펌웨어의 구조는 지그비 표준에 의해 지정됩니다. 이 펌웨어는 주요 마이크로컨트롤러 펌웨어 주변을 감싸며 무선 업데이트에 적합한 형식을 제공합니다.

이러한 유형의 파일을 준비하기 위해 JET 유틸리티를 다시 사용하지만 다른 설정으로 사용합니다. 이전에 사용한 -- embed_hdr 대신 -- ota 옵션을 사용합니다. 이 방법을 통해 펌웨어가 OTAP 배포를 위한 올바른 형식으로 되어 있음을 보장합니다.

<div class="content-ad"></div>

```js
JET.exe -m otamerge --ota -v JN516x -n 2 -t 1 -u 0x1037 -p 1 -c HelloZigbee.bin -o HelloZigbee.ota
```

다음은 매개변수 설명입니다.

- -m otamerge는 서로 다른 OTA 정보를 하나의 이진 파일로 병합하는 모드를 활성화합니다.
- --ota는 하나 또는 여러 이진 파일에서 OTA 형식 펌웨어를 컴파일하는 하위 모드를 활성화합니다.
- -c HelloZigbee.bin은 이전 단계에서 얻은 소스 펌웨어 파일을 지정합니다. (임베디드 OTA 헤더가 포함됨). -c는 OTA 클라이언트용이므로 사용됩니다.
- -o HelloZigbee.ota는 생성된 파일의 이름을 지정하며, 이후 서버에 배치할 수 있습니다.
- -v JN516x는 마이크로컨트롤러 패밀리 이름을 나타냅니다. (다른 마이크로컨트롤러는 다른 펌웨어 형식을 가지고 있습니다).
- -n 2는 펌웨어 파일 버전을 설정합니다.
- -t 1은 펌웨어 파일 유형을 설정합니다 (보드에 여러 마이크로컨트롤러가 있고 각각의 펌웨어가 필요한 경우 해당됩니다. 여기서는 하나의 유형만 사용합니다).
- -u 0x1037은 제조사 ID를 지정합니다. 현재는 NXP의 ID를 사용합니다.
- -p 1은 매우 중요한 스위치입니다. 파일의 시작 부분에 4바이트 서명을 추가합니다. 이를 사용하지 않으면 zigbee2mqtt가 이러한 펌웨어를 거부합니다.

이상적으로는 빌드마다 증가하는 버전 번호를 자동으로 생성하는 CI를 설정하는 것이 좋습니다. 하지만 현재 CI를 설정하기 귀찮아서 다음과 같은 해킹을 사용합니다. 플래시 도구를 통해 플래시될 펌웨어를 빌드할 때는 버전 #1을 지정하고, 서버에 배치할 펌웨어를 컴파일할 때는 #2를 포함합니다 (-n 2 키를 보십시오). 이렇게 하면 서버의 버전이 마이크로컨트롤러의 버전보다 항상 최신 상태가 됩니다. 물론 실제 장치에 대해서는 더 전문적으로 처리해야 합니다.

<div class="content-ad"></div>

저는 상기 설명된 모든 마법같은 기능들을 여러 개의 CMake 함수로 캡슐화했습니다.

```js
FUNCTION(ADD_HEX_BIN_TARGETS TARGET)
    IF(EXECUTABLE_OUTPUT_PATH)
      SET(FILENAME "${EXECUTABLE_OUTPUT_PATH}/${TARGET}")
    ELSE()
      SET(FILENAME "${TARGET}")
    ENDIF()
    ADD_CUSTOM_TARGET(OUTPUT "${TARGET}.hex"
        DEPENDS ${TARGET}
        COMMAND ${CMAKE_OBJCOPY} -Oihex ${FILENAME} ${FILENAME}.hex
    )
    ADD_CUSTOM_TARGET("${TARGET}.bin"
        DEPENDS ${TARGET}
        COMMAND ${CMAKE_OBJCOPY} -j .version -j .bir -j .flashheader -j .vsr_table -j .vsr_handlers -j .rodata -j .text -j .data -j .bss -j .heap -j .stack -j .ro_mac_address -j .ro_ota_header -j .pad -S -O binary ${FILENAME} ${FILENAME}.tmp.bin
        COMMAND "${SDK_PREFIX}\\Tools\\OTAUtils\\JET.exe" -m otamerge --embed_hdr -c ${FILENAME}.tmp.bin -v JN516x -n 1 -t 1 -u 0x1037 -o ${FILENAME}.bin
    )
ENDFUNCTION()

FUNCTION(ADD_OTA_BIN_TARGETS TARGET)
    IF(EXECUTABLE_OUTPUT_PATH)
      SET(FILENAME "${EXECUTABLE_OUTPUT_PATH}/${TARGET}")
    ELSE()
      SET(FILENAME "${TARGET}")
    ENDIF()
    ADD_CUSTOM_TARGET(${TARGET}.ota
        DEPENDS ${TARGET}.bin
 # HACK/TODO: setting file version to 2 (-n 2), so that OTA image is always newer than current version
        COMMAND "${SDK_PREFIX}\\Tools\\OTAUtils\\JET.exe" -m otamerge --ota -v JN516x -n 2 -t 1 -u 0x1037 -p 1 -c ${FILENAME}.bin -o ${FILENAME}.ota
    )
ENDFUNCTION()
```

생성된 OTA 파일에는 두 개의 OTA 헤더가 포함되어 있는 점을 중요하게 고려해야 합니다:

- 첫 번째는 Zigbee 표준을 준수하는 펌웨어를 보장하는 외부 래퍼입니다. 이 헤더는 zigbee2mqtt에게 펌웨어 파일의 특성에 대한 정보를 제공합니다.
- 두 번째는 펌웨어 자체에 내장된 헤더입니다. OTA 업데이트 과정에서 외부 래퍼는 삭제되고, 내장 OTA 헤더가 펌웨어가 자체 세부 사항을 이해하는 소스로 남게 됩니다. 버전, 이름 문자열, 제조업체 코드 등에 대한 정보가 포함됩니다.

<div class="content-ad"></div>

## OTA 펌웨어 업데이트 with zigbee2mqtt

zigbee2mqtt 대시보드를 통해 OTA 펌웨어 업그레이드를 시작하려면, 먼저 장치 변환기를 구성하여 해당 장치가 OTA 업데이트를 지원함을 인식하도록 설정해야 합니다. 이를 위해 herdsman-converter가 제공하는 표준 OTA 프로시저를 활용할 것입니다.

```js
const ota = require('zigbee-herdsman-converters/lib/ota')

const device = {
...
    ota: ota.zigbeeOTA
};
```

OTA 펌웨어 업데이트는 z2m 대시보드의 OTA 탭에서 수행됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_12.png" />

지그비2mqtt 대시보드에서 '새 업데이트 확인' 버튼을 클릭하면, 지그비 허즈맨이 온라인 목록을 쿼리하여 사용 가능한 펌웨어 업데이트를 확인합니다. 당연히, 이 목록에는 사용자 정의 펌웨어가 포함되지 않을 것입니다. 그러나 지그비 허즈맨은 인덱스 오버라이드 파일의 사용을 허용하여 로컬 파일을 지정할 수 있습니다. 이러한 로컬 파일의 경우, 모든 세부 정보를 입력할 필요는 없습니다 — 파일 위치만 필요합니다. 따라서, 우리의 인덱스 파일은 이에 맞게 설정될 것입니다.

```js
[
    {
        "url": "HelloZigbee.ota",
        "force": true
    }
]
```

지그비2mqtt는 서버에 있는 펌웨어 버전을 기기에 현재 있는 버전과 비교하여 업그레이드가 제안되는지 확인하고, 서버 버전이 더 최신일 때에만 업그레이드 제안을 합니다. 개발 중에는 버전 비교와 관계없이 특정 펌웨어로 업그레이드를 강제로 실행하는 것이 유용할 수 있습니다. 이를 위해, 인덱스 파일에 "force": true 옵션을 포함합니다. 이 설정은 기기에 있는 버전이 서버에 있는 버전과 동일하거나 더 최신해도 zigbee2mqtt가 업데이트를 계속 진행하도록 지시합니다.

<div class="content-ad"></div>

이제 이 인덱스가 configuration.yaml에서 활성화되어야 합니다.

```yaml
ota:
    zigbee_ota_override_index_location: index.json
```

HelloZigbee.ota 펌웨어 파일과 index.json 파일은 데이터 디렉토리 안에 configuration.yaml 파일과 함께 위치해야 합니다. 다시 시작한 후, zigbee2mqtt는 인덱스 파일을 인식하고 사용 가능한 업데이트 목록에 펌웨어를 포함시킵니다.

'새 업데이트 확인' 버튼을 클릭하면 zigbee2mqtt가 디바이스의 현재 펌웨어 버전을 문의합니다. 서버의 펌웨어가 디바이스의 것보다 최신이거나 "force" 옵션이 활성화된 경우, zigbee2mqtt는 펌웨어 업데이트를 제안할 것입니다.

<div class="content-ad"></div>

## 요약

우후, 아마도 가장 어려운 부분이었을 것 같아요. 정보가 부족하다는 게 아니에요 — 오히려, 한꺼번에 너무 많은 정보를 소화해야 했어요. 그러나 이해하고 모든 것이 정리되면 그리 어려운 게 아니라는 걸 알게 되었죠.

이 기사에서는 Zigbee 기기에 대한 무선 펌웨어 업데이트를 수행하는 방법을 보여드렸어요. 단계별 안내뿐만 아니라 각 단계의 목적과 다르게 처리할 경우 어떤 일이 발생할지에 대해서도 설명하려고 노력했어요.

# 링크

<div class="content-ad"></div>

- 깃허브 프로젝트
- JN-UG-3115 지그비 클러스터 라이브러리 (지그비 3.0용) 사용자 가이드
- JN-UG-3113 지그비 3.0 스택 사용자 가이드
- 응용 프로그램 노트: JN-AN-1003: JN51xx 부트로더 작동
- JN-UG-3081 JN51xx 암호화 도구 (JET) 사용자 가이드
- 지그비 클래스 라이브러리 명세서
- 지그비 트래픽을 스니핑하는 방법
- zigbee2mqtt에 새 기기 추가

# 지원

이 프로젝트는 취미 프로젝트로 무료로 개발 중입니다. 동시에 작은 기부로 프로젝트를 지원해주시면 감사하겠습니다.

<img src="/assets/img/2024-06-19-HelloZigbeeWorldPart25OTAFirmwareUpdates_13.png" />