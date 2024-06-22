---
title: "AWS IoT Core  꼭 알아야 할 모든 것"
description: ""
coverImage: "/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_0.png"
date: 2024-06-22 17:59
ogImage: 
  url: /assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_0.png
tag: Tech
originalTitle: "AWS IoT Core — Everything You Need To Know."
link: "https://medium.com/@umerfarooqai/exploring-internet-of-things-iot-with-aws-iot-core-in-depth-part-i-overview-and-provisioning-20f914e195f"
---


<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_0.png" />

## 사물 인터넷 / AWS / IoT 코어 / 파트 I

인터넷의 사물은 계속해서 증가하고 그 영향이 모든 산업에서 느껴지고 있습니다. 2025년까지 기대되는 가치가 1.6조 달러가 넘는 인터넷의 사물이 기업에 어떤 이점을 제공할 수 있는지 탐색하기 시작하는 것이 중요합니다. 그리고 그것이 AWS IoT 코어와 같은 IoT 플랫폼이 등장하는 곳입니다.

창립자로써, 우리는 항상 제품을 빠르게 시장에 출시하길 원합니다. 백만 달러 제품으로 변할 아이디어가 떠오르면, 그 아이디어를 실현으로 바꿔야 합니다. 그리고 빨리! 기술은 시간이 지남에 따라 발전해 왔습니다. 요즘에는 기술적 발전 덕분에 비즈니스가 제품을 과거보다 훨씬 빠르게 시장에 출시할 수 있습니다. 특히 클라우드 기술은 응용 프로그램을 배포하는 데 더 간단하고 빠르게 만들어 주었습니다. 이제는 어디에서나 컴퓨팅 파워 및 다양한 저장소에 액세스할 수 있어 제품을 신속하게 시장에 출시하기가 더 쉬워졌습니다. 따라서 제품 개발 주기를 단축하려면 더 이상 볼 것이 없습니다 - 클라우드가 해답입니다!

<div class="content-ad"></div>

비슷하게, 센서와 같은 물리적 장치가 있는 경우 다른 장치와 데이터를 교환하고 싶다면, 해당 센서와 동일한 위치에 존재할 수도 있고 그렇지 않을 수도 있는 다른 장치와 데이터를 교환하고 싶다면, 다시 말하면 — 클라우드가 해답입니다! 세계 한쪽에 센서를 설치하고 세계 다른 지역에 설치된 장치와 손쉽게 통신할 수 있습니다. 이것이 "사물 인터넷"의 세계입니다.

클라우드 서비스 사용의 추세는 제품 개발 방식의 변화로 이어졌습니다. 몇 년 전에 사물 인터넷을 기반으로 한 제품에 착수했을 때, 우리는 모든 서비스를 처음부터 개발해야 했습니다. 인증, 권한 부여, 보안 등의 서비스를 만들어야 했습니다. 그러나 이제는 클라우드 서비스를 사용하면 모든 서비스를 개발할 필요가 없습니다. 대부분은 클라우드 상에서 구성하고 응용 프로그램과 통합하는 것뿐입니다.

이 블로그에서는 AWS IoT Core에 대해 모두 가르쳐드립니다. 이 서비스를 사용하면 IoT 인프라를 빠르게 설정할 수 있습니다. AWS IoT Core를 사용하면 IoT 인프라와 관련된 거의 모든 것을 걱정할 필요가 없습니다. 백엔드이든 인증, 보안 등의 프로세스든, AWS IoT Core에서 제공하는 기능을 자세히 살펴볼 것입니다. 이 블로그의 개요는 다음과 같습니다:

- 사물 인터넷 인프라
- 사물 인터넷 인프라와 관련된 문제
- AWS IoT Core
- AWS IoT Core 기능 탐색
- 장치 모니터링 — 사용자 친화적 대시보드
- 워드파드 사용하여 IoT 노드 프로비저닝 — 쉬운 방법
- 다중 노드 프로비저닝 — 대량 등록
- 단일 노드 프로비저닝의 대체 방법 — 모든 단계 구성
- 정책 문서 — 장치 권한 부여
- 장치 쉐도우

<div class="content-ad"></div>

# 사물 인터넷 인프라

사물 인터넷에서 가장 일반적으로 사용되는 아키텍처는 다른 기기나 노드 간에 데이터를 교환하기 위한 발행-구독 또는 Pub-Sub 모델입니다. Pub-Sub 모델에서 데이터를 생성하거나 발생시키는 모든 기기는 게시자(Publishers)라고 합니다. 온도 센서, 움직임 센서 등과 같은 센서 노드일 수 있습니다. 이러한 기기는 HumiditySensor\Sensor1과 같은 다양한 주제에 데이터를 발행합니다. 반면에, 발행된 데이터를 원하는 기기나 노드는 구독자(Subscribers)라고합니다. 이들은 어떤 주제에든 구독하고 해당 노드로부터 데이터를 검색할 수 있습니다. 이를 가능하게 하기 위해서 우리는 Pub-Sub 모델의 핵심인 MQTT 브로커를 사용합니다.

모든 노드가 MQTT 브로커에 데이터를 발행하고, 해당 주제에 구독한 다른 노드에게 데이터를 전송한다는 점을 명심해 주세요. 특정 주제에 구독한 모든 노드는 브로커에 알려주어야 합니다. 노드가 한번 구독하면 해당 주제에 발행된 데이터를 수신하기 시작합니다. MQTT 브로커가 다운되면 통신이 중단되어 노드는 데이터를 교환할 수 없게 됩니다.

![](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_1.png)

<div class="content-ad"></div>

MQTT 브로커는 컴퓨터에 설치할 수 있는 애플리케이션입니다. 장치들은 MQTT 프로토콜을 사용하여 MQTT 브로커에 연결할 수 있습니다. "Mosquito MQTT 브로커"는 매우 일반적으로 사용되는 서비스로, 여러분의 컴퓨터에 설치할 수 있습니다. 설치하고 한 번 시도해보고 싶다면 이 링크를 따를 수 있습니다. 서버와 통신하기 위해 여러 라이브러리가 사용 가능하며(MQTT 프로토콜을 구현하는 여러 프로그래밍 언어에 따라), 예를 들어, Python을 좋아한다면 "paho-mqtt"를 설치하고 브로커와 통신을 시작할 수 있습니다. 아래는 MQTT 브로커에 연결하고 그런 다른 노드에서 데이터를 수신하기 시작할 Python 코드의 예시입니다. 

```js
import paho.mqtt.client as mqtt

# 이 함수는 이 기기나 노드가 MQTT 브로커와 성공적으로 연결되었을 때 호출됩니다.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # 다른 노드가 데이터를 게시할 토픽을 구독합니다.
    client.subscribe("HumiditySensor\Sensor1")

# 이 함수는 이 기기가 구독한 토픽에 데이터가 게시될 때 호출됩니다.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
# MQTT 클라이언트 구성
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
# MQTT 브로커를 로컬 머신의 192.168.0.13에 구성했다고 가정
# 1883 --> MQTT 포트
# 60   --> 타임아웃 인터벌
client.connect("192.168.0.13", 1883, 60)
# 서버가 계속 실행되도록 유지
client.loop_forever()
```

# IoT 인프라의 관련 문제

위에서 설명한 대로 MQTT 브로커를 사용하여 수백만 달러 짜리 IoT 아이디어를 구현하려는 것에 너무 마음이 고요해지기 전에 고려해야 할 사항이 여러 가지 있습니다.

<div class="content-ad"></div>

- 모든 노드는 통신하기 위해 MQTT 브로커에 액세스해야 합니다. 브로커가 설치된 기계는 공개되어 있고 보안이 강화되어 있어야 합니다. 일반적으로, 우리는 이를 위해 AWS EC2 인스턴스와 같은 가상 머신을 사용합니다.
- 가상 서버를 사용할 때에도 서버 보안은 중요합니다. 서버가 공개되어 있다면 아무나 연결하여 남용할 수 있어 매달 큰 클라우드 요금이 발생할 수 있습니다.
- 서버 보안 이외에도, IoT 노드의 보안은 어떻게 보장하시나요? 기기가 정품이고 인가된 것임을 어떻게 확인하시겠습니까? MQTT 브로커는 비밀번호 인증을 지원합니다. 그러나 노드에 암호를 하드 코딩하는 것은 좋은 해결책이 아닙니다. 누군가가 MQTT 서버 비밀번호에 액세스하면 시스템 전체가 위험에 처할 수 있습니다.
- 시스템의 확장성은 어떻게 되나요? 각 EC2 인스턴스나 가상 서버는 제한된 컴퓨팅 및 메모리 양을 가지고 있습니다. 수백만 대의 기기를 수용하기 위해 서버를 확장하려면 더 많은 서버를 추가해야 하며, 이로 인해 추가 비용이 발생할 수 있습니다.
- 가상 서버가 다운되면 MQTT 브로커와 기기가 데이터 교환을 중지합니다. 서버는 지속적인 유지보수가 필요하며 팀은 항상 서버가 건강한지 확인해야 합니다.
- IoT 기기 중 일부가 침해됐을 때는 어떻게 대응하시겠습니까? Mosquito MQTT 브로커는 기기를 블랙리스트에 올릴 수 있지만, 이를 위해 일부 파일을 수정해야 합니다. 이는 최상의 해결책이 아닙니다.
- IoT 노드가 게시할 수 있는 주제를 제한하고 싶다면 어떻게 할까요? 예를 들어, 움직임 센서가 MotionSensor\Sensor1에서만 데이터를 게시하길 원하고, 습도 센서가 HumiditySensor\Sensor1에서만 게시하길 원한다고 가정해보죠. 또한 움직임 센서가 HumiditySensor\Sensor1에서 데이터를 게시하지 못하도록 하고 싶습니다. — 기기가 많다면 이를 관리하기 어려울 수 있습니다.
- 노드 정보를 모두 볼 수 있는 대시보드를 만들고 싶다면 어떻게 할까요? 예를 들어, 게시된 메시지 수, 연결 실패 횟수 등을 볼 수 있는 대시보드가 있다면 좋겠죠. 물론 모든 것을 직접 개발할 수 있지만, 그 개발에 들어갈 비용과 시간도 고려해야 합니다.
- 노드 정보나 통계를 추적하고 싶다면 어떻게 할까요? 예를 들어, 게시된 메시지 수나 연결 실패 횟수를 추적하고 싶을 때 언제든 React/Angular 등의 기술로 나만의 대시보드를 개발할 수 있습니다. 그러나 이러한 개발에 필요한 비용과 시간을 염두에 두어야 합니다.
- IoT 기기의 주요 요구 사항 중 하나는 원격으로 펌웨어 업데이트가 가능해야 한다는 것인데, 이를 "오버 더 에어 (OTA)" 펌웨어 업데이트라고 합니다. 이는 보안, 신뢰성 및 필요한 경우 업데이트 롤백 능력을 신중하게 고려해야 하는 어려운 작업일 수 있습니다.

모든 문제에는 해결책이 있습니다. 팀원들과 함께 모여 상기된 모든 문제를 해결할 방법을 찾아보세요. 많은 시간과 노력이 필요할 것입니다. 그렇지만 AWS IoT Core가 모든 것을 처리해줄 수 있다면 어떻게 될까요? 아마도 AWS의 이 놀라운 서비스를 탐구해볼 예정입니다. 이 블로그의 파트-I에서는 노드 프로비저닝 및 노드 관리 방법을 살펴볼 것입니다.

상기된 모든 문제에 해결책이 있습니다. 팀원들이 모여서 의심 없이 모든 문제를 해결할 방법을 고안할 수 있습니다. 그러나 이는 많은 노력과 비용이 필요할 것이며, 원하는 바가 아닐 수 있습니다 — 맞나요? 그래서 AWS IoT Core를 탐구할 것인데, 이는 AWS의 놀라운 서비스입니다.

# AWS IoT Core

<div class="content-ad"></div>

AWS IoT Core의 랜딩 페이지에 따르면 "AWS IoT Core를 사용하면 인프라를 관리하지 않고 수조 개의 IoT 장치를 연결하고 수십억 개의 메시지를 AWS 서비스로 라우팅할 수 있습니다." 이 개념은 "서버리스(Serverless)"라고도 합니다.

AWS IoT Core는 당신에게 IoT 네트워크 전반에 걸쳐 복잡한 기능을 신속하게 구현할 수 있는 기능을 제공합니다.

## AWS IoT Core 기능 탐색

AWS IoT에 액세스하려면 AWS 계정에 로그인해야 합니다. AWS를 처음 사용하는 경우 무료로 새 계정을 등록할 수 있습니다. 그러나 등록에는 신용카드가 필요합니다. 등록하면 대부분의 서비스에 무료로 액세스할 수 있는 12개월 무료 티어 계정을 받게 됩니다.

<div class="content-ad"></div>

당신의 계정에 로그인 한 후, 검색 창에서 "IoT Core"를 검색할 수 있어요. 그런 다음 "IoT Core"를 클릭하세요.

![AWS IoT Core 이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_2.png)

이렇게 하면 여기에 표시된대로 AWS IoT Core 콘솔 화면으로 이동하게 됩니다. 좌측 네비게이션 바에서 다양한 옵션이 기능에 따라 그룹화되어 있어요.

![AWS IoT Core 이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_3.png)

<div class="content-ad"></div>

AWS IoT Core은 본질적으로 추가 기능을 갖춘 MQTT 브로커입니다. 이전에 MQTT 브로커를 다뤘던 것처럼 AWS IoT Core는 저지연과 고처리량을 제공하는 관리형 MQTT 브로커를 제공합니다. 이 브로커의 설치, 유지 보수 또는 보안을 관리할 필요가 없습니다. 장치가 인가되면 안전하게 메시지를 송수신할 수 있습니다. IoT 네트워크의 확장성을 걱정할 필요가 없습니다. AWS에 의해 자동으로 관리되기 때문에 기본 리소스의 용량을 늘릴 필요 없이 IoT 장치의 수를 늘릴 수 있습니다. AWS IoT Core에서 제공하는 다양한 기능에 대한 개요는 다음과 같습니다:

- Connect: 몇 번의 클릭으로 단일 또는 여러 장치를 프로비저닝/구성하는 데 도움이 되는 위저드를 제공합니다.
- Manage: 여러 가지 옵션을 제공하여 장치를 관리하고, 새로운 장치를 생성하며, 노드 그룹을 만들어 노드 청구를 관리하고, IoT 장치에서 실행할 작업을 생성할 수 있습니다.
- Fleet Hub: 노드 또는 그룹을 선택하여 모든 통계를 볼 수 있는 플릿 허브 애플리케이션을 생성할 수 있습니다. 대시보드를 볼 수 있는 외부 사용자 계정을 생성할 수 있습니다.
- Greengrass: 이 서비스를 사용하면 IoT 노드가 엣지 장치로 변할 수 있습니다. 클라우드에서 다른 작업이나 기능을 생성한 다음 엣지 노드에서 실행할 수 있습니다. 분산 컴퓨팅을 찾고 있다면 Greengrass가 완벽한 해결책이 될 것입니다.
- 무선 연결: LoRaWAN 기술을 사용하는 경우 이 기능이 적합합니다. 이를 사용하면 LoRaWAN을 AWS 클라우드와 연결하여 관리할 수 있습니다. AWS에서 선택한 지역에 따라 이 기능이 표시되지 않을 수 있습니다.
- 보안: 인증서, 정책, 권한 등과 같이 다양한 옵션을 제공합니다. 이러한 기능은 IoT 노드가 클라우드와 인증되고, 발행할 수 있는 토픽 및 구독할 수 있는 토픽과 같은 권한을 제공하며, AWS 람다 함수를 사용하여 사용자 정의 인증을 생성할 수 있습니다.

- Defend: 인프라 및 구성의 보안을 감사하고, 클라우드에서 장치 활동을 모니터링하고, 사용자 정의 규칙에 따라 이상을 감지하는 옵션을 제공합니다. 이상 감지에 머신 러닝 모델을 사용할 수도 있습니다.
- Act: 클라우드에서 다양한 규칙을 구성하고 클라우드에서 다양한 기능을 실행할 수 있습니다. 예를 들어, `HumiditySensor\Sensor1`에 디바이스가 발행할 때마다 데이터베이스에 레코드를 삽입하거나 람다 함수를 실행하거나 REST API를 호출하는 규칙을 쉽게 구성할 수 있습니다. 룰을 작성하기 위해 SQL 기반의 구문을 사용합니다. 예를 들어, 다음 규칙을 고려해 보세요: `topic/subtopic`에 있는 색상과 온도에 대해 `50보다 큼`의 값을 갖는 경우 규칙은 일치합니다. 이 경우 AWS CloudWatch에 로그를 기록하는 AWS Lambda 함수(임의의 사용자 정의 백엔드 기능을 구현할 수 있음)를 호출합니다.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_4.png" />

<div class="content-ad"></div>

- 테스트: 이 카테고리의 기능들은 미리 제공된 또는 사용자 정의 테스트 스위트로 IoT 노드를 테스트할 수 있습니다. 또한 원하는 페이로드를 어떤 주제로든 게시할 수 있는 인터페이스를 제공합니다. 구독을 직접 설정할 수도 있습니다. 이는 테스트용으로만 사용됩니다.

![AWS IoT Core](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_5.png)

## 기기 모니터링 — 사용자 친화적 기본 대시보드

AWS IoT Core는 매우 사용자 친화적인 대시보드를 제공하여 기본적인 IoT 메트릭을 제공합니다. 좌측 탐색 막대에서 "모니터"를 클릭하여 성공적인 연결, 실행된 규칙 등과 같은 통계를 제공하여 IoT 네트워크의 문제를 식별하는 데 도움이 되는 다양한 메트릭을 확인할 수 있습니다.

<div class="content-ad"></div>

![AWS IoT Core](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_6.png)

## 마법사를 사용한 기기 프로비저닝

첫 번째 노드를 설정하는 것부터 시작해보겠습니다. 이러한 마법사들은 사용자로부터 노드를 프로비저닝하기 위해 필요한 모든 추가 옵션을 숨깁니다. 단일 기기 또는 여러 기기를 동시에 프로비저닝할 수 있습니다. "연결"을 네비게이션 바에서 확장하고 "시작하기"를 클릭하면 두 가지 옵션이 제공됩니다.

- 디바이스에 등록 — 노드를 하나씩 설정하려면 이 옵션을 선택하십시오. 단일 기기를 프로비저닝하려면 하단의 "시작하기" 버튼을 클릭할 수 있습니다.
- 여러 기기에 등록 — 한 번에 여러 노드를 설정하려면 "템플릿"을 생성하여 노드가 어떻게 프로비저닝될지에 대한 모든 세부 정보를 제공할 수 있습니다. "템플릿 생성"을 클릭하여 프로세스를 시작할 수 있습니다.

<div class="content-ad"></div>

![2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_7.png]

한 기기를 등록해 보겠습니다. "기기 등록" 아래의 "시작" 버튼을 클릭하세요. 지침 화면이 표시됩니다. 원한다면 읽어보세요. 화면 우측 하단의 "시작" 버튼을 클릭하여 계속 진행하세요.

![2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_8.png]

다음 화면에서 플랫폼과 SDK를 선택할 수 있습니다. 이러한 옵션들은 필요한 라이브러리를 구성하고 설치하는 데 도움이 되도록 스크립트를 생성합니다. 마이크로 컨트롤러를 사용 중이라면 필요한 조합을 선택하고 "다음"을 클릭하세요.

<div class="content-ad"></div>

![2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_9.png](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_9.png)

다음 화면에서는 노드를 식별하기 위한 다양한 구성을 제공합니다. 가장 중요한 것은 기기의 이름입니다. 현재는 "MyFirstThingName"이라고 부르도록 합시다.

![2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_10.png](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_10.png)

기본적으로 일부 선택적 구성은 숨겨져 있습니다. 이를 확장하려면 "선택적 구성 보기"를 클릭하면 됩니다. 이러한 옵션은 이 프로세스를 완료한 후에도 수정할 수 있습니다. 따라서 지금은 안심하고 무시해도 됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_11.png" />

- 장치 유형: 비슷한 장치를 그룹화하려면 유형을 만들 수 있습니다. 예를 들어 “모션 센서”라는 그룹을 만들어 해당 유형에 해당하는 모션 센서를 모두 배치할 수 있습니다.
- 검색 가능한 장치 속성: 이는 장치 정보, 공장 데이터 등을 저장하는 데 사용할 수 있는 키-값 쌍입니다. 라이트 불(전구)의 예를 들어보면, "제조사", "와트수", "카테고리" 등과 같은 다양한 속성 또는 속성 키가 있을 수 있습니다. 이 정보는 구현 중에 비즈니스 로직을 작성하는 동안 언제든지 검색할 수 있습니다.
- 장치 그림자: 이는 다른 노드에서 조회할 수 있는 정보를 저장하기 위해 장치에 연결된 작은 데이터베이스입니다. 이 섹션인 "장치 그림자"에서 이 주제에 대해 자세히 알아보려면 이동하세요.

“다음 단계”를 클릭하세요. 잠시 후, 장치가 성공적으로 프로비저닝되었다는 화면이 표시됩니다.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_12.png" />

<div class="content-ad"></div>

화면에서 확인하실 수 있듯이, 자동으로 "MyFirstThingName-Policy"라는 정책 문서가 생성되었습니다.이 문서는 노드가 MQTT 브로커에 연결하고 허용된 주제에 발행/구독할 수 있는 권한을 제공합니다. 정책 문서에 대해 더 알고 싶다면, 이 블로그의 "정책 문서 — 장치 인가" 섹션으로 이동해 보세요.

또한 인증 및 안전한 통신에 필요한 인증서, 공개 및 개인 키를 생성했습니다. 선택한 OS에서 실행할 수 있는 스크립트 파일도 제공됩니다. 이 스크립트 파일은 AWS IoT Core와 통신하기 위해 필요한 종속성을 설치하는 데 사용할 수 있습니다. 연결 키트를 컴퓨터로 다운로드하세요. 이 ZIP 파일은 어느 폴더에든 추출할 수 있습니다. 내용은 다음과 같습니다:

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_13.png" />

네 개의 파일이 있습니다:

<div class="content-ad"></div>

- MyFirstThingName.cert.pem — 인증용 클라이언트 인증서
- MyFirstThingName.private.key — IoT Core와의 안전한 통신을 위한 개인 키
- MyFirstThingName.public.key — IoT Core와의 안전한 통신을 위한 공개 키
- start.ps1 — 이는 모든 필수 라이브러리를 설치하고 AWS IoT Core와 디바이스를 테스트할 수 있는 샘플 코드를 생성하는 파워셸 스크립트입니다. 핵심 라이브러리는 AWS IoT Core와 통신하는 데 필요한 모든 기능을 제공하는 aws-iot-device-sdk입니다. 스크립트 파일의 내용은 다음과 같습니다:

![이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_14.png)

파일을 다운로드하면 "다음 단계" 버튼이 사용 가능해지며 이를 클릭하면 안내 화면으로 이동합니다. "완료"를 클릭하세요.

축하합니다! 몇 번의 클릭만으로 첫 번째 IoT 디바이스를 성공적으로 프로비저닝했습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_15.png) 

만약 자체 IoT 인프라를 구축한다면, 기기의 인증 및 보안이 꽤 어려울 수 있습니다. 보셨듯이, AWS IoT Core에서 기기 프로비저닝은 매우 쉽습니다. IoT 코어에 등록되거나 프로비저닝되지 않은 기기는 AWS IoT Core와 통신할 수 없습니다.

## 여러 노드 프로비저닝 — 대량 등록

수백 대 또는 수백만 대의 기기가 있다면, 각 기기를 개별적으로 프로비저닝하는 것은 고통스럽고 시간이 많이 소요될 수 있습니다. 주로 AWS IoT Core는 여러 기기를 프로비저닝하는 두 가지 방법을 제공합니다:


<div class="content-ad"></div>

- Just-in-time provisioning (JITP): JITP는 장치가 처음으로 AWS IoT에 연결될 때 장치를 프로비저닝하는 템플릿과 함께 이루어집니다. 많은 장치를 등록해야 하지만 대량 프로비저닝 목록으로 구성할 수 있는 정보가 없는 경우 이 옵션이 좋습니다. 이를 구성하려면 인증서, 인증서 서명 요청 및 AWS Lambda 함수에 대한 좋은 이해가 필요합니다. JITP에 대해 자세히 설명하는 곳이 있는데 이 블로그를 참고해보세요.
- Bulk registration: 이 옵션을 사용하면 S3 버킷에 저장된 파일에서 단일 항목 프로비저닝 템플릿 값 목록을 지정할 수 있습니다. 이 접근 방식은 원하는 특성이 알려진 많은 장치들이 목록으로 구성될 때 잘 작동합니다.

대량 등록 화면에 접근하려면 “Activity” → “Start registration”을 클릭하시면 됩니다.

![이미지1](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_16.png)

![이미지2](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_17.png)

<div class="content-ad"></div>

한 가지씩 모든 필드에 대해 이야기해봐요.

- 매개변수 파일: 매개변수 파일은 노드의 모든 속성을 포함한 JSON 파일입니다. 예를 들어, 두 개의 장치를 프로비저닝할 매개변수 파일 예시가 있습니다. "foo"와 "bar"라는 두 장치를 프로비저닝하겠다는 내용이 담겨 있습니다. 사용되는 변수 두 가지는 "일련번호"와 "인증서 ID"입니다. 이 파일을 AWS S3 버킷에 업로드해야 합니다. AWS S3는 파일 저장 서비스입니다. S3에 파일을 업로드한 후 "S3 검색" 버튼을 클릭하여 JSON 파일을 선택할 수 있습니다. JSON 파일의 내용은 다음과 같습니다:

```js
{"ThingName": "foo", "SerialNumber": "123", "CertificateId": "1805e1f631a11fa4097d9307ec103d343111902ef29ba3e3fa00e63d570fa47a"}
{"ThingName": "bar", "SerialNumber": "456", "CertificateId": "294cd70210ab6a1000069882d1f8ba33b8075825176569770031b5b9c329b283"}
```

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_18.png" />

<div class="content-ad"></div>

- IAM Role: 이 옵션은 AWS의 작동 방식에 특화되어 있습니다. IAM 콘솔에 이동하여 새 역할을 생성하고 AWSIoTThingRegistration 및 AmazonS3FullAccess 정책을 연결할 수 있습니다. 역할의 이름을 자유롭게 지정할 수 있습니다. 이 예시에서는 역할 이름을 "TestRole"로 사용합니다. IAM 콘솔에서 TestRole의 세부 정보는 다음과 같습니다:

![TestRole](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_19.png)

이제 모든 준비가 완료되었으니, AWS IoT Core에 JSON 템플릿을 사용하여 새 장치를 프로비저닝하는 방법을 알려주어야 합니다. "Ref" 키워드는 프로비저닝 템플릿에서 값들을 참조하는 데 사용됩니다. 이 템플릿은 AWS가 노드를 프로비저닝하고 인증에 사용되는 인증서 및 권한 부여에 사용되는 정책을 자동으로 연결하는 데 사용됩니다. 이 예시에서 사용할 프로비저닝 템플릿은 다음과 같습니다:

```javascript
{
    "Parameters" : {
        "ThingName" : {
            "Type" : "String"
        },
        "SerialNumber" : {
            "Type" : "String"
        },
        "Location" : {
            "Type" : "String",
            "Default" : "LA"
        },
        "CertificateId" : {
            "Type" : "String"    
        }
    },
    "Resources" : {
        "thing" : {
            "Type" : "AWS::IoT::Thing",
            "Properties" : {
                "ThingName" : {"Ref" : "ThingName"},
                "AttributePayload" : { "version" : "v1", "serialNumber" :  {"Ref" : "SerialNumber"}
            },
            "OverrideSettings" : {
                "AttributePayload" : "MERGE",
                "ThingTypeName" : "REPLACE",
                "ThingGroups" : "DO_NOTHING"
            }
        },  
        "certificate" : {
            "Type" : "AWS::IoT::Certificate",
            "Properties" : {
                "CertificateId": {"Ref" : "CertificateId"}
            }
        },
        "policy" : {
            "Type" : "AWS::IoT::Policy",
            "Properties" : {
                "PolicyDocument" : "{ \"Version\": \"2012-10-17\", \"Statement\": [{ \"Effect\": \"Allow\", \"Action\":[\"iot:Publish\"], \"Resource\": [\"arn:aws:iot:<YourRegion>:<AccountID>:topic/foo/bar\"] }] }"
            }
        }
    }
}
```

<div class="content-ad"></div>

다음 화면처럼 최종 구성이 보입니다. 작업을 완료하면 "등록 시작"을 클릭하세요.

![이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_20.png)

모든 정보를 올바르게 입력했다면 프로비저닝 프로세스가 시작될 것입니다. 노드 수에 따라 시간이 소요될 수 있습니다. 우리는 두 개의 노드만 프로비저닝하고 있으므로 거의 즉시 완료될 것입니다. 언제든지 "활동" 페이지로 돌아가서 대량 등록 상태를 확인할 수 있습니다. 오류가 있는 경우 TaskID를 선택하고 작업 → 실패 로그를 클릭하세요. 이를 통해 오류 이유가 포함된 텍스트 파일이 다운로드됩니다. 최신 TaskID에는 노드 프로비저닝 원하는 수와 동일한 두 개의 성공 카운트가 포함되어 있기 때문에 성공한 것을 확인할 수 있습니다.

![이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_21.png)

<div class="content-ad"></div>

확인하려면 "foo"와 "bar"가 성공적으로 생성되었는지를 확인할 수 있습니다. Manage → Things로 이동해주세요.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_22.png" />

프로비저닝 템플릿의 세부 정보를 확인하려면 https://docs.aws.amazon.com/iot/latest/developerguide/provision-template.html을 참조해주세요.

## 노드 프로비저닝을 위한 대체 방법 — 모든 단계를 구성하기

<div class="content-ad"></div>

특정한 요구 사항이 있고 각 항목을 수동으로 구성하려면 '관리 → 사물'로 이동한 후 '사물 만들기' 버튼을 클릭해야 합니다. 이전에 따라한 과정과 유사하지만 더 많고 유연한 구성 옵션을 제공합니다. 이는 더 고급 사용자를 위한 것입니다.

![이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_23.png)

다음 화면에서는 단일 항목 또는 여러 항목을 생성할 수 있는 두 가지 옵션이 제공됩니다. '다수의 사물 만들기'를 선택하면 이미 살펴본 '대량 등록' 옵션으로 이동하게 됩니다.

![이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_24.png)

<div class="content-ad"></div>

"하나의 항목 생성"으로 진행해보겠습니다. 새 장치의 이름을 입력해주세요. "MySecondDevice"라고 부르겠습니다. 나머지 옵션은 기본값으로 남겨두세요.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_25.png" />

장치 섀도우를 확인할 수 있는 부분까지 스크롤 다운해주세요. 단순히 기능을 살펴보기 때문에 지금은 "섀도우 없음"으로 남겨둘게요. 나중에 장치에 섀도우를 연결할 수 있어요. "다음"을 클릭해서 계속 진행해주세요.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_26.png" />

<div class="content-ad"></div>

다음 화면에서는 인증서를 구성해야 합니다. 여기서는 AWS가 인증서를 생성하거나 사용자 지정 인증서를 사용하거나 별도의 인증서 기관을 등록하고 인증서를 생성할 수 있는 옵션이 있습니다. 이 과정이 비용이 많이든다고 하니 AWS가 새로운 인증서를 자동으로 생성하게 두는 것이 좋습니다. 나중에 인증서를 생성하고 Thing에 연결할 수 있습니다. 계속하려면 "다음"을 클릭하세요.

![AWS IoT Core](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_27.png)

다음 화면에서는 장치에 정책을 연결해야 합니다. 새로운 정책을 생성하려면 "정책 생성" 버튼을 누르세요. 이전에 마법사가 자동으로 정책 문서를 생성했었는데, 우리는 이 새로운 장치에 동일한 정책을 사용할 것입니다. "MyFirstThingName-Policy"를 선택하려면 왼쪽에 있는 확인란을 클릭하고 "Thing 생성"을 클릭하세요.

![AWS IoT Core](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_28.png)

<div class="content-ad"></div>

새로운 팝업이 나타납니다. 제공된 모든 인증서를 컴퓨터의 안전한 위치에 다운로드해야 합니다.

중요: 공개 및 개인 키는 이 화면에서만 다운로드할 수 있습니다. 이러한 키 중 하나를 분실한 경우, 새로운 장치를 처음부터 설정해야 합니다.

![이미지](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_29.png)

모든 인증서와 키를 다운로드한 후 “완료” 버튼을 누르세요. 이제 새로운 장치를 수동으로 성공적으로 생성했습니다.

<div class="content-ad"></div>

만약 따라오셨다면, 지금 화면에 4개의 장치가 보일 것입니다.

![Device Authorization](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_30.png)

# 정책 문서 — 장치 승인

AWS IoT Core에서 장치를 프로비저닝 할 때, 프로비저닝되는 모든 Thing 또는 노드에 "정책" 문서를 첨부합니다. 정책 문서는 단순히 해당 장치에 연결하는 JSON 구조의 파일로, 해당 장치가 다음 작업을 수행하도록 승인합니다:

<div class="content-ad"></div>

- AWS IoT Core 브로커에 연결합니다 (iot:Connect 동작) — 필요에 따라 클라이언트ID 형식 등 다양한 조건을 추가할 수 있습니다.
- 특정 노드가 MQTT 브로커에서 주어진 주제에서 발행/구독/수신할 수 있게 합니다. 동일한 노드가 발행할 수 없는 주제에 구독하는 동안 다른 주제에 발행할 수 있습니다.
- AWS는 '$'iot:Connection.Thing.ThingName'과 같은 일부 IoT 변수를 제공하여 정책 문서에 추가하여 노드가 다른 노드에 발행하는 것을 제한할 수 있습니다.

다음은 정책의 예시입니다. 이 예시 정책에서 노드는 $'iot:Connection.Thing.ThingName'/room*에서 데이터를 발행, 구독 및 수신할 수 있습니다.

```js
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iot:Connect"
            ],
            "Resource": [
                "arn:aws:iot:us-east-1:123456789012:client/${iot:Connection.Thing.ThingName}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iot:Subscribe"
            ],
            "Resource": [
                "arn:aws:iot:us-east-1:123456789012:topicfilter/${iot:Connection.Thing.ThingName}/room*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iot:Receive"
            ],
            "Resource": [
                "arn:aws:iot:us-east-1:123456789012:topic/${iot:Connection.Thing.ThingName}/room*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iot:Publish"
            ],
            "Resource": [
                "arn:aws:iot:us-east-1:123456789012:topic/${iot:Connection.Thing.ThingName}/room*"
            ]
        }
    ]
}
```

이미 생성된 정책을 확인하려면 Secure → Policies로 이동하세요. 따라왔다면, "MyFirstThingName-Policy"는 위자드를 사용하여 단일 장치를 프로비저닝할 때 생성된 정책입니다. 두 번째 정책은 대량 등록 프로세스를 통해 생성된 정책입니다.

<div class="content-ad"></div>

이미지 태그를 다음과 같이 변경해주세요.


![AWS IoT Core](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_31.png)


"MyFirstThingName-Policy"를 클릭하세요. 다음 화면에서 "JSON" 토글 버튼을 클릭하여 정책 문서를 JSON 형식으로 볼 수 있습니다. 여기에서 정책을 수정하고 새 버전의 정책 문서를 게시할 수 있습니다. 이를 통해 이전 버전으로 되돌아가는 것이 가능합니다.

![AWS IoT Core](/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_32.png)

"MyFirstThingName-Policy"의 정책 문서를 수정하지 않았다면 다음과 같이 나타날 것입니다.

<div class="content-ad"></div>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish",
        "iot:Receive",
        "iot:RetainPublish"
      ],
      "Resource": [
        "arn:aws:iot:us-east-2:906961234567:topic/sdk/test/java",
        "arn:aws:iot:us-east-2:906961234567:topic/sdk/test/Python",
        "arn:aws:iot:us-east-2:906961234567:topic/topic_1",
        "arn:aws:iot:us-east-2:906961234567:topic/topic_2"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:us-east-2:906961234567:topicfilter/sdk/test/java",
        "arn:aws:iot:us-east-2:906961234567:topicfilter/sdk/test/Python",
        "arn:aws:iot:us-east-2:906961234567:topicfilter/topic_1",
        "arn:aws:iot:us-east-2:906961234567:topicfilter/topic_2"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": [
        "arn:aws:iot:us-east-2:906961234567:client/sdk-java",
        "arn:aws:iot:us-east-2:906961234567:client/basicPubSub",
        "arn:aws:iot:us-east-2:906961234567:client/sdk-nodejs-*"
      ]
    }
  ]
}
```

위 정책의 요약은 다음과 같습니다:

- AWS IoT Core에 연결하기 위해서는 디바이스의 clientID는 sdk-java, basicPubSub 또는 sdk-nodejs-* 여야 합니다. 여기서 *는 와일드카드 문자로, sdk-nodejs- 뒤에 문자 조합이 허용된다는 것을 의미합니다.
- 디바이스는 지정된 주제(topic)만 구독할 수 있습니다. 즉, sdk/test/java, sdk/test/Python, topic_1 및 topic_2 주제만 가능합니다.
- 디바이스는 지정된 주제만 발행할 수 있습니다. 즉, sdk/test/java, sdk/test/Python, topic_1 및 topic_2 주제만 가능합니다.

AWS IoT Core 정책을 사용하면 각 노드에 대해 별도의 정책을 생성하거나 응용 프로그램의 필요에 따라 여러 노드에 동일한 정책을 공유할 수 있습니다. 이 기능은 매우 유용하며 콘솔을 사용하여 이러한 정책을 쉽게 관리할 수 있습니다.

<div class="content-ad"></div>

# 장치 그림자

AWS IoT Core의 매우 유용한 기능 중 하나는 장치 그림자입니다. 그림자는 각각의 독립된 노드에 특화된 데이터베이스입니다. 이는 장치의 최신 (보고된) 상태를 저장하는 데 사용될 수 있으며 필요할 때 인프라 내의 다른 장치에서 읽거나 액세스할 수 있습니다. 따라서 노드가 오프라인 상태가 되더라도 다른 노드는 여전히 해당 그림자에서 보고된 상태를 액세스할 수 있습니다. 그림자의 정보는 "원하는" 상태와 "보고된" 상태로 저장됩니다. 특정 노드의 상태를 변경하려는 장치가 있는 경우, 그 장치는 그림자에서 원하는 상태에 키-값 쌍을 추가하여 요청을 보냅니다. 그림자 문서가 변경되면 해당 IoT 노드는 그림자에서 원하는 정보를 읽어들여 정보를 처리하고 보고된 상태의 업데이트를 보냅니다. 데이터 요청을 초기에 한 장치는 보고된 상태가 업데이트되었음을 알립니다. 이 데이터는 수동으로 삭제되거나 어떤 프로세스에 의해 삭제될 때까지 계속 유지됩니다. 그림자에 데이터가 저장되는 일반적인 예시는 다음과 같습니다.

```js
{
    "state": {
        "desired": {
            "attribute1": integer2,
            "attribute2": "string2",
            ...
            "attributeN": boolean2
        },
        "reported": {
            "attribute1": integer1,
            "attribute2": "string1",
            ...
            "attributeN": boolean1
        }
    },
    "clientToken": "토큰",
    "version": 버전
}
```

"Thing"에 그림자를 추가하려면, 관리 → Things로 이동하여 이미 프로비저닝한 장치 중에서 선택하십시오. "장치 그림자"를 클릭하십시오. 이 서비스 없이 "MySecondDevice"를 만든 경우 기존의 그림자를 찾을 수 없습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_33.png" />

"Create Shadow"을 클릭하면 새로운 것이 추가됩니다. 두 가지 옵션이 포함된 팝업이 표시됩니다:

- 이름 지정된 Shadow: 여러 장치 쉐도우를 생성하고 다른 이름으로 식별할 수 있습니다. 노드의 기능에 따라 문서를 분류하려면 유용합니다.
- 이름 지정되지 않은 (고전적인) Shadow: 이것은 고전적인 쉐도우라고도 불립니다. 장치당 하나의 이름이 지정되지 않은 쉐도우만 생성할 수 있습니다.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_34.png" />

<div class="content-ad"></div>

"Unnamed (classic) Shadow"을 선택하고 "만들기"를 클릭하세요.

<img src="/assets/img/2024-06-22-AWSIoTCoreEverythingYouNeedToKnow_35.png" />

또한 MQTT 주제 $aws/things/MySecondDevice/shadow가 생성되었습니다. 이 주제를 통해 장치가 "MySecondDevice" 노드의 이 그림자 서비스와 통신할 수 있습니다. 즉, 정책문에 의해 허용된 디바이스는 이 그림자에 발행하거나 구독할 수 있습니다. 그림자 서비스에 대해 더 알고 싶다면, 아래 링크를 참조하여 API 및 자세한 내용을 확인하세요. https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html

# 결론

<div class="content-ad"></div>

AWS IoT 코어는 제품을 위한 IoT 인프라를 신속하게 배포할 수 있도록 하는 여러 기능을 제공합니다. 인프라, 보안 및 관리에 대해 걱정할 필요 없이 제품의 핵심 비즈니스 로직에 집중하세요. 이 블로그에서는 노드 프로비저닝, 대량 등록, 정책 구성, 그림자 등과 같은 중요한 기능을 논의했습니다.

AWS IoT Core의 요금 페이지에 따르면, 유럽(아일랜드) 지역에서 매일 AWS IoT Core에 지속적으로 연결된 10만대의 기기가 있고 각 기기가 사이즠 1KB의 325개의 메시지를 보내는 경우 한 달에 대략 $1,876.60의 비용이 발생합니다. 이는 매우 합리적인 가격입니다. 매일 보내는 325개의 메시지 중 100개는 장치 그림자 업데이트를 트리거하고 200개는 규칙을 실행하여 한 가지 작업을 실행합니다.

이 블로그에 나열된 모든 혜택을 고려할 때, 기술 회사의 CEO 또는 CTO라면 다음 백만 달러 제품에 AWS IoT Core를 고려해야 합니다.

## 저자와 연락하기

<div class="content-ad"></div>

👋 만나서 반가워요! 저랑 소통하고 싶으시면 저의 LinkedIn 계정에서 연락해주세요: [https://www.linkedin.com/in/umerfarooqai/](https://www.linkedin.com/in/umerfarooqai/). 질문이 있으면 언제든지 물어봐주세요! 함께 소통해요! ✨