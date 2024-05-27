---
title: "어디서나 Tailscale을 통해 Immich 라이브러리에 접근하고 동기화하기"
description: ""
coverImage: "/assets/img/2024-05-27-AccessingandSyncingYourImmichLibraryfromAnywherewithTailscale_0.png"
date: 2024-05-27 13:49
ogImage: 
  url: /assets/img/2024-05-27-AccessingandSyncingYourImmichLibraryfromAnywherewithTailscale_0.png
tag: Tech
originalTitle: "Accessing and Syncing Your Immich Library from Anywhere with Tailscale"
link: "https://medium.com/@lennart.dde/accessing-and-syncing-your-immich-library-from-anywhere-with-tailscale-84c5d5c23a11"
---


<img src="/assets/img/2024-05-27-AccessingandSyncingYourImmichLibraryfromAnywherewithTailscale_0.png" />

이전 글에서 Raspberry Pi에 추가 SSD 저장 공간을 이용해 오픈 소스 사진 백업 솔루션인 Immich를 자체 호스팅하는 방법에 대해 이야기했습니다. 자신의 미디어 서버를 호스팅함으로써 데이터에 완전한 제어권을 갖는 장점 중 하나는 있습니다. 그러나 어디서든 라이브러리에 액세스하고 동기화하는 것은 견고하고 안전한 방법 없이는 어려울 수 있습니다. 이때 Tailscale이 등장합니다. Tailscale은 어디에 있든 안전하게 디바이스를 인터넷을 통해 연결할 수 있게 해주는 망 VPN 서비스입니다.

# Tailscale이란?

Tailscale은 WireGuard를 기반으로 한 현대적인 VPN 솔루션으로, 쉽게 설정하고 사용할 수 있도록 설계되었습니다. 디바이스 간에 안전하고 암호화된 네트워크를 만들어주어 전 세계 어디에서나 로컬 네트워크에 연결된 것처럼 Immich 라이브러리에 액세스할 수 있습니다. Tailscale은 NAT 트래버셜을 처리해주므로 라우터 구성이나 복잡한 네트워크 설정에 대해 걱정할 필요가 없습니다.

<div class="content-ad"></div>

# Tailscale와 Immich 함께 사용하는 이점

- 사용 편의성: 네트워킹 지식이 제한된 사용자도 쉽게 설정하고 사용할 수 있는 Tailscale입니다.
- 보안성: 모든 연결은 WireGuard를 사용하여 암호화되어 데이터가 안전하게 전송됩니다.
- 이용 편의성: 세계 어디에서나 어떤 기기에서든 Immich 라이브러리에 액세스할 수 있습니다.
- 포트 포워딩 불필요: Tailscale은 포트 포워딩이나 동적 DNS 설정이 필요없어요.

# Immich의 주요 이점: 자동 동기화 기능

Immich의 주목할 만한 기능 중 하나는 모바일 앱의 통합 자동 동기화 기능입니다. 이 기능을 사용하면 동기화할 폴더를 선택할 수 있고 Immich가 사진과 비디오를 자동으로 업로드합니다. 사용자는 장치가 충전 중이거나 Wi-Fi에 연결되어 있을 때에만 업로드하도록 설정할 수 있어 데이터 사용량과 배터리 수명을 효율적으로 관리할 수 있습니다.

<div class="content-ad"></div>

일반적으로 집 네트워크에 연결된 상태일 때만 작동하지만, Tailscale을 사용하면 RaspberryPi에 어디서나 안전하게 액세스할 수 있습니다. 해외 여행 중일 때도 이미지를 업로드하고 저장할 수 있습니다. 이것은 구글 포토와 같은 클라우드 서비스와 비교했을 때 하드웨어 제한을 제외하고 저장 용량 제한이 없어서 특히 유용합니다. 

# Immich와 Tailscale 설정 방법

## 전제 조건

- Raspberry Pi에 Immich가 정상적으로 설치되어 있어야 합니다.
- 무료로 Tailscale 계정을 만들 수 있습니다 (Tailscale에서 가입할 수 있습니다).

<div class="content-ad"></div>

## 단계별 안내

라즈베리 파이에 Tailscale 설치하기:

- 라즈베리 파이에서 터미널을 엽니다.
- Tailscale 설치하기:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

<div class="content-ad"></div>

Tailscale를 시작하고 로그인하세요:


sudo tailscale up


- 기기를 인증하기 위해 지침을 따르세요. 웹 브라우저에서 URL을 열고 Tailscale 계정으로 로그인해야 합니다.

다른 기기에 Tailscale 설치하기:

<div class="content-ad"></div>

- 다른 기기(예: 휴대폰, 노트북 또는 데스크톱)에 Tailscale을 다운로드하고 설치하세요.
- 동일한 계정을 사용하여 각 기기에서 Tailscale에 로그인하세요.

라즈베리 파이에 액세스:

- 모든 기기에 Tailscale이 설정되면 Tailscale 대시보드에서 각 기기에서 라즈베리 파이가 나열될 것입니다.
- 라즈베리 파이에 할당된 Tailscale IP 주소를 기록하세요. IP 주소는 100.x.x.x와 같은 형식일 것입니다.

어디서나 Immich에 액세스하세요:

<div class="content-ad"></div>

- Tailscale에 연결된 장치의 웹 브라우저를 엽니다.
- http://100.x.x.x:2283 으로 이동합니다 (100.x.x.x를 Raspberry Pi의 Tailscale IP 주소로 교체합니다).
- Immich 인터페이스가 표시되어 사진 및 비디오 라이브러리에 액세스하고 관리할 수 있습니다.

Immich 모바일 앱을 사용하여 라이브러리 동기화하기:

- 모바일 장치에 Immich 앱을 다운로드하고 설치합니다.
- 앱을 열고 서버 설정을 Tailscale IP 주소로 구성합니다.
- 앱 내 설정으로 이동하여 자동 동기화할 폴더를 선택합니다.
- 배경 업로드 설정을 활성화하고 충전 중이거나 Wi-Fi에 연결되어 있는 경우에만 업로드하는 환경 설정을 선택합니다.

# 결론

<div class="content-ad"></div>

Tailscale을 Immich와 함께 사용하면 전 세계 어디에서나 미디어 라이브러리에 안전하고 쉽게 액세스하고 동기화할 수 있는 솔루션을 제공합니다. Immich의 모바일 애플리케이션의 자동 동기화 기능은 배경 업로드를 원활하게하며 수동 개입없이 미디어가 항상 백업되도록 보장합니다. 이 설정은 원격 액세스의 편리함을 유지하면서 데이터에 대한 완전한 제어를 보장합니다. Tailscale의 강력한 보안 기능과 간편한 구성을 통해 전통적인 VPN이나 포트 포워딩 설정의 번거로움없이 자체 호스팅 미디어 서버의 이점을 즐길 수 있습니다.
Tailscale을 활용하여 라즈베리 파이를 강력하고 접근성이 있는 미디어 허브로 변신시킬 수 있으며 상용 클라우드 서비스와 견줄 만한 라이벌이 될 수 있습니다. Immich의 자동 동기화 기능과 Tailscale의 안전한 연결이 결합되어 개인 미디어 라이브러리를 효과적이고 효율적으로 관리할 수 있는 포괄적인 솔루션을 제공합니다.