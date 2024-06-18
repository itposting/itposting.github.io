---
title: "작별, NymConnect 반가워, NymVPN"
description: ""
coverImage: "/assets/img/2024-06-19-GoodbyeNymConnecthelloNymVPN_0.png"
date: 2024-06-19 04:28
ogImage: 
  url: /assets/img/2024-06-19-GoodbyeNymConnecthelloNymVPN_0.png
tag: Tech
originalTitle: "Goodbye NymConnect, hello NymVPN"
link: "https://medium.com/nymtech/goodbye-nymconnect-hello-nymvpn-914defc96201"
---


## NymVPN 출시를 앞두고 NymConnect 앱 단계적 중단

NymConnect 및 믹스넷 사용자를 위한 중요한 변경 사항입니다.

![이미지](/assets/img/2024-06-19-GoodbyeNymConnecthelloNymVPN_0.png)

NymVPN 앱의 상용화 출시를 대비하여 Nym은 NymConnect 인터페이스를 4주 내에 점진적으로 중단할 예정입니다. SOCKS5 클라이언트는 개발자 및 특정 응용 프로그램을 통해 프록시를 수동으로 실행하고자 하는 사용자들을 위해 활성 상태로 유지됩니다. 한 번 클릭으로 모든 사용자 트래픽을 보호함으로써, NymVPN 앱은 믹스넷 접근을 크게 개선하며 사용자에게 더 포괄적인 개인 정보 보호 기능을 제공할 것입니다.

<div class="content-ad"></div>

NymConnect에서 NymVPN으로의 전환 및 SOCKS5 클라이언트 계속 사용 가능성에 대해 알아야 할 사항이 있습니다.

# 지금까지의 NymConnect

지금까지 SOCKS5는 사용자가 Nym 믹스넷에 원하는 응용 프로그램을 통해 액세스하는 데 사용된 프록시 프로토콜이었습니다. NymConnect는 SOCKS5 프록시용 프런트 엔드 그래픽 인터페이스로 설계되었습니다. NymConnect는 Bitcoin Electrum 지갑, Monero 지갑, Telegram 등의 앱을 사용하는 사용자가 해당 앱에서 SOCKS5를 통해 트래픽을 Nym 믹스넷을 통해 라우팅할 수 있도록 하는 쉽게 클릭하여 연결하는 인터페이스를 제공했습니다. 메시지와 거래를 익명으로 원격 애플리케이션 서버로 전송하고 수신할 수 있었습니다. 메타데이터가 유출되지 않도록 합니다.

지금까지 어떻게 작동했나요? 호환되는 응용 프로그램이 SOCKS5로 구성된 경우, 해당 응용 프로그램에서 TCP 데이터 스트림이 Nym 네트워크에서 승인된 네트워크 요청자에게 보내기 전에 Sphinx 암호화된 패킷으로 분할됩니다. 데이터 패킷은 그 후 Nym 믹스넷 노드의 3개 계층에서 혼합된 다음 출구 게이트웨이에서 재조립됩니다.

<div class="content-ad"></div>

지금까지 NymConnect 클라이언트에는 여러 가지 제한 사항이 있었습니다:

- Application Specific: 사용자는 매번 포트와 IP 주소를 지정하여 NymConnect를 사용할 각 응용 프로그램을 수동으로 구성해야 합니다.
- 호환성: SOCKS5를 지원하는 응용 프로그램에서만 작동합니다.
- 네트워크: TCP 스트림만 지원합니다.
- 유지보수: 시간이 지남에 따라 NymConnect가 Nym 개발팀에게 리소스를 많이 사용하게되어 유지하기가 어려워졌습니다. NymVPN 및 믹스넷을 미세 조정하는 더 중요한 작업을 늦출 것입니다.

네 주일 후에 NymConnect가 연결이 끊겨질 것입니다. 다행히도, 새로운 NymVPN 앱은 그 기능을 완전히 대체할 뿐만 아니라 모든 사용자의 트래픽, 응용 프로그램 및 네트워크 연결을 쉽게 보호하는 클릭 앤 고 개인 정보 보호 기능을 제공합니다. 사용자와 개발자들은 여전히 원하는 응용 프로그램에 대해 Nym의 SOCKS5 클라이언트를 수동으로 구성할 수 있습니다.

# NymVPN의 장점

<div class="content-ad"></div>

NymVPN은 사용자가 모든 트래픽을 기본적으로 믹스넷을 통해 라우팅할 수 있는 새로운 클라이언트입니다 (TCP, SOCKS4–5 등만 아니라). 특정 애플리케이션을 프록시로 구성하거나 네트워크 요청자를 선택할 필요가 더 이상 없습니다.

NymVPN에는 여러 가지 주요 기능이 있습니다:

- Nym의 5-홉 믹스넷 모드를 통한 고급 프라이버시 선택 또는 빠른 연결을 위한 WireGuard 2-홉 dVPN 모드 선택
- 국가별 입구 및 출구 게이트웨이 선택
- 곧 제공될 커스텀 구성을 통한 스플릿 터널링을 통해 믹스넷을 사용하는 트래픽과 그렇지 않은 트래픽을 구성할 수 있음

이 모든 것이 이제 한 앱을 통해 가능해졌습니다.

<div class="content-ad"></div>

# 안녕하세요 NymConnect, NymVPN으로 바뀜

NymVPN은 현재 대기 명단에서 초대된 사용자를 대상으로한 알파 테스트 단계에 있습니다. NymVPN 알파를 테스트하고 피드백을 제공할 기회를 위해 오늘 가입하세요 — 아직 기회가 있습니다! 알파 테스트 단계 이후에 NymVPN은 Nym 믹스넷에서 실행되는 최초의 상용 앱으로 출시될 것입니다.

# Nym 커뮤니티에 참여하세요

Discord // Telegram // Element // Twitter

<div class="content-ad"></div>

# Privacy loves company

영어 // 중국어 // 러시아어 // 터키어 // 베트남어 // 일본어 // 프랑스어 // 스페인어 // 포르투갈어 // 한국어