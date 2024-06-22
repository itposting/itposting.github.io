---
title: "안드로이드에서 Network Service DiscoveryNSD 알아보기 및 LAN에서 서비스 발견하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-KnowmoreaboutNetworkServiceDiscoveryNSDinAndroidandapproachestodiscoverservicesinLAN_0.png"
date: 2024-06-22 18:08
ogImage: 
  url: /assets/img/2024-06-22-KnowmoreaboutNetworkServiceDiscoveryNSDinAndroidandapproachestodiscoverservicesinLAN_0.png
tag: Tech
originalTitle: "Know more about Network Service Discovery(NSD) in Android and approaches to discover services in LAN"
link: "https://medium.com/@mangesh.sambare/know-more-about-network-service-discovery-nsd-in-android-and-approaches-to-discover-services-in-2e474dbbd858"
---


**테이블** 태그를 마크다운 형식으로 변경해주세요.

<div class="content-ad"></div>

Fing과 NetX Network Tools 앱과 같이, 우리 앱도 로컬 네트워크의 동적 IP 주소를 찾아내고(동일한 로컬 Wi-Fi 네트워크), 개인 IP 주소를 사용하여 로컬 네트워크 서버에 연결할 수 있습니다.

어떤 일을 시작하기 전에, 우리는 주제의 기초를 알아야 합니다. 그러니 로컬 영역 네트워크(LAN)에서 시작하겠습니다.

Cisco에 따르면 로컬 영역 네트워크(LAN)는 건물, 사무실 또는 가정과 같이 한 곳에서 함께 연결된 장치의 집합입니다. LAN은 한 명의 사용자가 있는 홈 네트워크부터 수천 명의 사용자와 장치가 있는 사무실이나 학교의 기업 네트워크까지 다양할 수 있습니다. 더 많은 정보를 보려면 여기를 확인하세요.

# 접근 방법 1

<div class="content-ad"></div>

대부분의 개발자들은 로컬 네트워크 내의 IP 주소를 찾기 위해 리눅스 머신에서 이 방법을 따릅니다. 안드로이드 플랫폼 아키텍처는 리눅스 커널에 기반합니다. 안드로이드 앱에서 안드로이드 개발자들은 이 방법을 사용할 수 있습니다. 이 방법은 더 나은 방법은 아니지만, 어떤 안드로이드 개발자들에게는 유용할 수도 있습니다. 이 질문에 대한 답변은 스택 오버플로우에서 찾아볼 수 있습니다. 이를 살펴보기 전에, 자세한 내용을 알아보기 위해 이 질문들을 방문해보시기를 권장합니다.

- 로컬 네트워크 내 시스템(서버)의 IP 주소를 찾는 방법은?
- 호스트 이름을 통해 로컬 네트워크에서 IP 주소를 찾는 방법은?

```js
String commandToRun = "adb shell netcfg";//장치 IP 주소 찾기
Runtime.getRuntime().exec(commandToRun);
```

이를 달성하기 위해 저는 스택 오버플로우의 답변을 추천합니다. 아래 스택 오버플로우 질문을 확인해보세요.

<div class="content-ad"></div>

- 안드로이드에서 IP를 스캔하는 방법은 무엇인가요?

이 방법은 IP 주소와 호스트 이름을 얻는 좋지 않은 접근 방식입니다. 몇몇 안드로이드 개발자들에게 도움이 될 수 있도록 설명했습니다.

# 접근 방법 2

첫 번째 방법에서는 애플리케이션이 LAN에서 각 IP 주소를 핑합니다. 실행하는 데 너무 많은 시간이 걸립니다. 때로는 첫 번째 방법이 호스트 이름을 구성하는 데 실행을 10회 중 2-3회 실패합니다.

<div class="content-ad"></div>

우리 개발자들은 항상 프로그램을 실행하면 빠른 결과를 얻을 수 있는 좋은 알고리즘을 작성하고 싶어합니다. 이 접근법을 통해 어떻게 성취할 수 있는지 배울 수 있습니다. Network Service Discovery (NSD)는 LAN에서 호스트 이름, 서비스를 제공합니다. NSD에서 개발자들은 각 IP 주소 인스턴스를 핑하거나 호스트 이름을 구성하는 데 신경 쓸 필요가 없습니다. Network Service Discovery (NSD)에 대해 알기 전에 mDNS, ZeroConfig 및 Bonjour에 대해 알아야 합니다.

StackOverflow 질문에서는 mDNS 구성에 대해 알아야 했습니다.

컴퓨터 네트워킹에서 멀티캐스트 DNS (mDNS) 프로토콜은 로컬 이름 서버를 포함하지 않는 소규모 네트워크 내에서 호스트 이름을 IP 주소로 해석합니다. 이는 제로 구성 서비스로, 유니캐스트 도메인 이름 서비스 (DNS)와 본질적으로 동일한 프로그래밍 인터페이스, 패킷 형식 및 작동 의미론을 사용합니다. 독립 프로토콜로 작동하거나 표준 DNS 서버와 호환되도록 설계되었습니다.

더 많은 정보를 위해 위키피디아를 참조하세요.

<div class="content-ad"></div>

인터넷 프로토콜 스위트(TCP/IP)를 기반으로 사용 가능한 컴퓨터 네트워크를 자동으로 생성하는 기술 세트입니다. 컴퓨터나 네트워크 주변 장치들이 연결될 때 수동 운영자 개입이나 특별한 구성 서버가 필요하지 않습니다.

더 많은 정보는 위키피디아에서 확인해보세요.

로컬 네트워크에서 산업 표준 IP 프로토콜을 사용하여 장치와 서비스를 자동으로 발견할 수 있게 해주는 것으로 알려진 제로-구성 네트워킹(Zero-configuration networking)입니다. Bonjour는 Cocoa, Ruby, Python 및 기타 언어에서 접근할 수 있는 정교하고 사용하기 쉬운 프로그래밍 인터페이스로 네트워크 서비스를 발견, 발행 및 해결하기 쉽게 만들어 줍니다.

Bonjour은 Apple의 Zero-configuration networking(zeroconf) 구현입니다.

<div class="content-ad"></div>

위키백과를 더 자세히 읽어보세요. 

그래서 mDNS, Zeroconfig, Bonjour과 같은 것을 Android에서 검색했어요. 여기서 더 나은 방법을 발견했어요. NSD(Network Service Discovery).

NSD를 알기 전에, 개발자는 시스템의 로컬 서버 서비스 구성에 대해 알아야 해요. Avahi는 Linux/Ubuntu 시스템에 설치되어 실행되는 발견 서비스 중 하나에요.

Avahi는 mDNS/DNS-SD 프로토콜 스위트를 통해 로컬 네트워크에서 서비스 검색을 용이하게 해주는 시스템이에요. 이는 노트북이나 컴퓨터를 네트워크에 연결하면 즉시 다른 사람들을 볼 수 있고 채팅할 수도 있고, 프린터를 찾아서 인쇄할 수도 있고, 파일을 공유하고 있는 사람들을 찾을 수 있게 해줘요.

<div class="content-ad"></div>

더 많은 정보를 얻으려면 Avahi와 위키피디아를 참조하세요. 

개발자는 프린터를 찾는 것과 같은 사용자 정의 검색 서비스를 개발하고 실행할 수 있습니다. 이러한 검색 서비스는 매우 가벼워요. 이를 위해 개발자는 서비스를 발견하기 위해 서비스 유형을 정의해야 합니다. 국제 할당 번호 기관(IANA)은 NSD와 Bonjour와 같은 서비스 검색 프로토콜에서 사용하는 서비스 유형의 중앙 집중식, 권위 있는 목록을 관리합니다. IANA 서비스 이름 및 포트 번호 목록에서 이 목록을 다운로드할 수 있습니다. 새로운 서비스 유형을 사용할 계획이라면, IANA 포트 및 서비스 등록 양식을 작성하여 예약해야 합니다.

NSD는 로컬 네트워크에서 다른 장치가 제공하는 서비스에 앱 액세스를 제공합니다. NSD를 지원하는 장치에는 프린터, 웹캠, HTTPS 서버 및 기타 모바일 장치가 포함됩니다.

NSD는 DNS 기반 서비스 검색(DNS-SD) 메커니즘을 구현하며, 이를 통해 앱은 서비스 유형과 원하는 서비스 유형을 제공하는 장치 인스턴스의 이름을 지정하여 서비스를 요청할 수 있습니다. DNS-SD는 Android 및 다른 모바일 플랫폼에서 모두 지원됩니다.

<div class="content-ad"></div>

ZeroConfig, Bonjour, 그리고 NSD의 정의를 읽어 보신 후에 알겠죠? 이 세 가지는 비슷한 기능을 하지만 서로 다른 아키텍처에서 사용됩니다. Bonjour은 주로 Apple 기기에서 사용되고, NSD는 안드로이드 기기에서 사용됩니다.
NSD 개발을 위해 안드로이드는 개발자 가이드라인을 제공합니다.

- 네트워크 서비스 검색 사용

개발자들은 위 안드로이드 문서를 사용하여 안드로이드 애플리케이션에서 NSD를 구현할 수 있습니다.

로컬 네트워크에서 NSD 구현을 테스트할 때, 안드로이드 5.0 (롤리팝 - API 레벨 21) 및 이 버전보다 낮은 버전에서는 로컬 네트워크에서 서비스를 발견하는 문제가 있습니다. 이에 대해 StackOverflow에서 질문을 했습니다.

<div class="content-ad"></div>

- 네트워크 서비스 탐색(Network Service Discovery)이 발견 서비스 유형이 아닌가요?

안드로이드는 각 버전 수준마다 개선되고 있어요. 구글은 안드로이드 6.0(마시멜로 - API 레벨 23) 이상에서 위 문제를 해결했어요(이 부분은 확실하지 않아서 직접 테스트를 해봐야 해요). 어떻게 이 문제를 해결할 수 있을까요, 다음 접근법에서 설명할게요.
# 접근법 3

위 접근법에서 언급한대로, 안드로이드 5.0 및 이하 버전에서는 NSD가 잘 작동하지 않아요. 이 접근법은 위 문제를 해결할 거예요. 클라이언트 애플리케이션은 UDP(Universal Datagram Protocol)를 사용하여 서버를 LAN에서 찾을 수 있어요. 이를 위해 둘 다 특정 키를 알아야 하며 발행-구독 기능을 사용하여 이를 달성할 수 있어요.

<div class="content-ad"></div>

컴퓨터 네트워킹에서, User Datagram Protocol (UDP)은 인터넷 프로토콜 슈트의 주요 구성원 중 하나입니다. UDP를 사용하면 컴퓨터 애플리케이션은 데이터그램이라고 불리는 메시지를 다른 호스트에게 인터넷 프로토콜(IP) 네트워크에서 전송할 수 있습니다. 통신 경로나 데이터 경로를 설정하기 위해 이전에 통신할 필요는 없습니다.

더 많은 정보를 위해 위키피디아를 참조하세요.

UDP를 사용하면 지역 네트워크에서 특정 호스트 이름의 IP 주소를 즉시 찾을 수 있습니다. 이를 위해 한 가지 간단한 UDP 서버 코드를 작성해 보겠습니다(Python을 선호합니다. Linux/Ubuntu에는 이미 패키지가 설치되어 있기 때문입니다. Java 언어의 경우, JDK를 설치하고 JRE를 구성해야 합니다). 아래의 Python 코드를 살펴보세요.

```python
import socket
localIP = "127.0.0.1"
localPort = 20001
bufferSize = 1024
msgFromServer = "Hello UDP Client"
bytesToSend = str.encode(msgFromServer)
# Datagram 소켓 생성
UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
# 주소와 IP에 bind
UDPServerSocket.bind((localIP, localPort))
print("UDP 서버 실행 중")
# 수신 대기
while True:
    bytesAddressPair = UDPServerSocket.recvfrom(bufferSize)
    message = bytesAddressPair[0]
    address = bytesAddressPair[1]
    clientMsg = "클라이언트로부터 메시지: {}".format(message)
    clientIP = "클라이언트 IP 주소: {}".format(address)
    
    print(clientMsg)
    print(clientIP)
    # 클라이언트에 응답 보내기
    UDPServerSocket.sendto(bytesToSend, address)
```

DefaultCellStyle를 테이블 태그에서 Markdown 형식으로 변경해보세요.

<div class="content-ad"></div>

로컬 시스템에서 이 코드를 실행하여 IP 주소를 찾으세요. 이 코드는 호스트명/IP 주소 예: server-hostname을 브로드캐스트합니다. 위 코드는 여기에서 확인할 수 있습니다.

이제 안드로이드에서 로컬 네트워크에서 IP 주소나 호스트명을 찾기 위해 UDP 클라이언트 애플리케이션을 작성해야 합니다. 코드 작성을 위해서는 스택 오버플로우 질문과 답변을 확인하세요.

- 안드로이드 — 네트워크에서 서버 찾기?

이 기능은 100% 작동합니다. 1~5초 안에 IP 주소, 호스트명, 서비스를 함께 제공합니다. 이 접근 방식을 사용할 수도 있습니다.

<div class="content-ad"></div>

# 결론

로컬 네트워크에서 서버의 IP 주소를 찾거나 시스템에서 실행 중인 서비스를 발견하려면 Fing 및 NetXnetwork 도구 앱과 같은 NSD, Zeroconfig, Bonjour 구성을 사용하면 번거로움이 없습니다.

그러나 서비스 이름과 서비스 유형을 사용하여 올바른 IP 주소를 구성하지 못하는 경우가 있습니다. 그런 경우 UDP를 통해 이동하십시오. NSD와 UDP를 결합하여 모든 문제를 극복하는 최상의 접근 방식입니다. 이 구현에 대해 백엔드 개발자도 동의해야 합니다. Rosemary Wang가 잘 설명해 주었습니다. 한 번 확인해 보세요.

# 참고  

<div class="content-ad"></div>

위의 모든 방법에 대해,

- 코루틴, WorkManager, RxJava, RxAndroid와 같은 백그라운드 스레드에서 코드를 실행합니다.
- Android 기기 WiFi가 Wifi 라우터에 연결되어 있는 경우에만 이 코드를 실행합니다. 이를 위해 Android Manifest 파일에 애플리케이션의 ACCESS_NETWORK_STATE 및 ACCESS_WIFI_STATE를 추가합니다 (모바일 데이터에서는 로컬 서버를 찾을 수 없습니다).
- IP 주소 또는 서비스 검색 결과를 얻는 데 시간이 걸립니다. Wifi 네트워크나 인터넷 사용 가능 여부에 따라 달라집니다.

이 연구를 공유했습니다. 이를 통해 사람들이 사물 인터넷 (IoT) 구현 문제를 해결하는 데 도움이 되기를 바랍니다. Fing은 이미 사물 인터넷 (IoT)에 착수했습니다. 현재 사물 인터넷은 정보 기술 분야에서 급속히 발전하고 있습니다. 많은 기업이 이에 대해 연구하고 있습니다. 이 분야에 대해 더 많은 이해를 얻으려면 여기를 읽어보실 수 있습니다.

이 기사가 마음에 드시기를 바랍니다. 제 작품을 좋아해 주시면 치얼소리를 낼 수 있습니다. 의견을 남겨주시면 감사하겠습니다.

<div class="content-ad"></div>

LinkedIn에서 저와 연결하고 전문적인 관계를 형성할 수 있어요.

내 게시물을 더 많이 보고 싶다면 Mangesh Sambare Profile을 방문해주세요.