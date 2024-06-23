---
title: "모든 찬사를 기울여 DIY 프라이버시 강화 장치 만들기 방법"
description: ""
coverImage: "/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_0.png"
date: 2024-06-23 17:05
ogImage: 
  url: /assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_0.png
tag: Tech
originalTitle: "All hail Pi: A DIY privacy enhancement device."
link: "https://medium.com/@codezen/all-hail-pi-a-diy-privacy-enhancement-device-ea39b234b629"
---


우리 모두는 웹 사이트에서 정보를 읽고 이해하려고 노력하던 중 갑자기 이것을 만난 귀찮은 상황에 있었을 것입니다.

![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_0.png)

뭐... 약간 과장한 것 같네요 😁, 근데 제가 하려는 말은 우리 모두가 원하지 않는 제품을 사게 만들려고 억지로 밀어붙이는 귀찮은 판매원에게 밀려나는 걸 싫어합니다.

그렇죠? 이게 많은 웹 사이트에서 하는 일이고, 더 덜 공격적이지는 않아요.

<div class="content-ad"></div>

## 타겟 광고

우리 모두가 한 번쯤 경험해 본 적이 있을 것입니다. 이커머스 플랫폼에서 제품을 캐주얼하게 둘러보다가, 전혀 관련 없는 다른 사이트에서 광고 형태로 다시 마주하는 그 순간을요.

![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_1.png)

여러분은 아무생각 없이 웹 브라우징을 하면서 이 광고들이 여러분을 따라다니는 것을 어떻게 하는지 궁금했던 적이 있었나요?

<div class="content-ad"></div>

다양한 방법이 있지만, 가장 흔한 방법 중 하나는 "트래커(trackers)"를 사용하는 것입니다. 이름에서 알 수 있듯이, 이것은 디지털 식별자로 웹 브라우징 습관을 식별하고 회사가 "당신이 누구인지?"에 대한 대략적인 프로필을 작성하는 데 사용될 수 있는 것입니다.

현대 웹 브라우저를 잘 알고 있다면, 광고 차단기(Ad-Blocker) 확장 프로그램을 설치하여 이를 방지할 수 있다고 할 수 있을 겁니다.

실제로, 브라우저의 확장 프로그램 스토어에서 많은 이러한 확장 프로그램을 찾을 수 있습니다.

개인 정보 보호를 강화하기 위해 이러한 확장 프로그램을 의지하고 있다면, 그것은 좋은 첫 걸음입니다. 그러나, 곧 출시될 Chrome/Chromium의 다가오는 버전에서 "Manifest V3"라는 기능이 도입된다는 사실이 밝혀지고 있습니다.

<div class="content-ad"></div>

이 기능은 브라우저 확장 프로그램을 위한 많은 보안 기능을 제공하지만, 브라우저와의 상호 작용에 심각한 제약 사항을 만들기도 합니다. 이에 대한 주요 논란이 개인 정보 중심의 기술 커뮤니티 사이에서 벌어지고 있어요.

그러니 "우리의 개인 정보를 어떻게 되찾을까요?"

![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_2.png)

## DNS로 들어가보세요!

<div class="content-ad"></div>

도메인 이름 시스템은 인터넷이나 다른 인터넷 프로토콜 네트워크의 컴퓨터, 서비스 및 기타 리소스에 대한 명명 시스템을 제공하는 계층적이고 분산된 이름 서비스입니다.

웹사이트에 연결하려면 위치를 알아야합니다. 이 주소는 일반적으로 142.250.195.206과 같이 숫자 시퀀스 형태로 나타납니다 (기술적으로 IPV4 주소로 알려져 있음).

하지만 사람들은 이러한 숫자 시퀀스를 기억하기 어려워합니다. DNS는 www.apple.com과 같은 사람이 읽을 수 있는 이름을 17.253.144.10과 같은 기계가 이해할 수 있는 주소로 변환하는 역할을 맡습니다. 

<div class="content-ad"></div>

만약 DNS 수준에서 일부 필터링을 수행할 수 있다면 어떨까요?
예를 들어, 어떤 웹사이트가 광고/트래커를 호스팅하기 위해 전용 서버를 사용한다는 것을 알았다고 가정해봅시다. tracker.bigbrother.com에서 (그곳을 방문하려 하지 마세요 🤣)
그럼 이를 차단할 수 있을까요?

DNS 수준에서 필터링을 기반으로 하는 이러한 시스템을 DNS 필터링 시스템이라고 부릅니다.

![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_3.png)

DNS 필터를 사용하는 장점 중 하나는 DNS 필터를 사용하는 클라이언트 장치가 자체적으로 추가 소프트웨어를 설치할 필요가 없다는 것입니다.

<div class="content-ad"></div>

DNS 수준에서 차단된 URL의 경우, 장치는 IP 주소를 해결하기 위해 DNS 시스템에 쿼리를 보낼 때 응답을 받지 못합니다.

DNS를 기반으로 이 필터링을 수행할 수 있는 소프트웨어를 DNS 싱크홀이라고 합니다.
AdGuardHome과 Pi-Hole은 이를 달성할 수 있는 매우 인기 있는 무료 오픈 소스 소프트웨어 중 두 가지입니다.

보너스로 라우터의 DNS를 이러한 사용자 정의 DNS 필터로 지정하면 네트워크 전역에서 광고 및 추적자 차단을 받을 수 있습니다. 이는 에어컨, 콘센트 등의 IOT 기기를 포함합니다.

이제 이 모든 게 멋지지만, DNS 필터링 시스템을 어디에서 실행해야 하며, 어떻게 신뢰성 있게 작동하고 다운타임 없이 운영할 수 있는지 알아야 합니다.

<div class="content-ad"></div>

## 파이를 찬양합시다

파이 제로 2W(일명 라즈베리 파이 제로 2W)는 라즈베리 파이 팀이 개발한 저가형 싱글 보드 컴퓨터(SBC)입니다.

![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_4.png)

레트로 게임, 홈 오토메이션 등 많은 프로젝트에 활용할 수 있지만, DNS 필터링 시스템을 구동하는 데 가장 적합하며, 제일 좋은 점은 자체 호스팅할 수 있다는 점입니다.

<div class="content-ad"></div>

## 직접 해 보세요!

이 프로젝트는 여러 가지 방법으로 할 수 있지만, 저에게 효과적으로 작동한 방법을 공유하겠습니다.

일반적으로 장치가 무선 또는 유선 메커니즘을 사용하여 인터넷에 연결될 때, 라우터에 연결됩니다.

라우터는 이름에서 알 수 있듯이, 스마트폰, 텔레비전, 컴퓨터 등 다양한 장치의 요청을 인터넷으로 전달해주며, 그 역방향으로도 도와줍니다.

<div class="content-ad"></div>

요청/응답을 경로 지정하는 방법은 각 장치에 지역 IP를 할당함으로써 수행됩니다. 예를 들어, 노트북에는 IP 주소 192.168.0.231이 할당될 수 있고, 게임 콘솔에는 IP 주소 192.168.0.145가 할당될 수 있습니다.

너무 자세하게 들어가지 않고, 이 지역 IP를 결정하는 데 도움이 되는 프로토콜은 Dynamic Host Configuration Protocol (DHCP)라고 합니다.

장치가 라우터와의 연결을 끊고 다시 연결할 때 다른 IP 주소가 할당될 수 있습니다. 장치가 특정 IP 주소에 잠겨 있지 않기 때문에 보안상 좋습니다. 그 IP 주소를 기반으로 지속적으로 대상화할 수 없습니다.

라즈베리 파이 상에 실행 중인 사용자 정의 DNS 필터의 경우, 라우터 자체가 DNS 쿼리를 해결하기 위해 라즈베리 파이에 쿼리해야 하므로 정적 IP 주소를 가지는 것이 합리적입니다.

<div class="content-ad"></div>

특정 장치의 정적 IP를 설정하는 방법은 라우터 제조업체에 따라 다를 수 있습니다. 이 작업을 수행하는 방법에 대한 지침은 라우터 설명서를 확인하는 것이 좋습니다.

일반적으로 라우터의 관리 소프트웨어에 액세스하여 IP 주소가 192.168.X.1인 몇 가지 제어를 설정하는 것이 포함됩니다. (여기서 X는 0, 1, 2 중 하나입니다.)

더 상세한 정보는 아래와 같습니다:

<div class="content-ad"></div>

라즈베리 파이에 정적 IP를 설정했다고 가정하고, 필요한 모든 하드웨어를 구비한 상태라 가정합니다.

- 라즈베리 파이 제로 2W
- 마이크로 SD 카드
- 전원 공급 장치
- 카드 리더

다음 단계를 수행하여 시작할 수 있습니다:

- 먼저, DNS 필터링 소프트웨어를 실행할 좋은 운영 체제가 필요합니다. 우리는 이를 위해 DietPi를 선택했습니다. 이는 응용 프로그램이 최대한의 리소스를 확보하도록 한 최적화된 운영 체제입니다.
- 라즈베리 파이용 DietPi 이미지를 다운로드하고, Etcher를 사용하여 Micro SD 카드에 이미지를 불러옵니다.
- 그런 다음, SD 카드의 dietpi.txt를 사용자 정의하여 headless 설정을 가능하게하십시오. AUTO_SETUP_HEADLESS=1 및 AUTO_SETUP_NET_WIFI_ENABLED=1로 설정하여 모니터/키보드 설정 없이도 파이가 자동으로 와이파이 네트워크에 연결되도록합니다.
- 다음으로, 정적 IP 주소를 설정합니다.
AUTO_SETUP_NET_USESTATIC=1
AUTO_SETUP_NET_STATIC_IP=`라즈베리파이의 정적 IP 주소`
AUTO_SETUP_NET_STATIC_MASK=255.255.255.0
AUTO_SETUP_NET_STATIC_GATEWAY=`라우터의 IP 주소`
AUTO_SETUP_NET_STATIC_DNS=8.8.8.8 8.8.4.4
- 마지막으로, SD 카드의 dietpi-wifi.txt에 와이파이 네트워크 자격 증명을 설정하십시오. pi 제로 2W는 2.4GHz 와이파이 네트워크만 지원합니다.
aWIFI_SSID[0]=’와이파이 네트워크 이름’
aWIFI_KEY[0]=’와이파이 암호’
aWIFI_KEYMGR[0]=’WPA-PSK’
- 이제 SD 카드를 파이에 연결하고 전원에 연결하십시오.
- 파이가 부팅되고 설정이 완료되면 터미널에서 ssh root@`라즈베리파이의 정적 IP 주소`를 실행하여 파이에 로그인할 수 있습니다. 기본 비밀번호는 dietpi입니다.
- 모든 것이 순조롭게 진행되면 diet pi의 설정 화면이 나타날 것이고, 대부분의 사용자에게 일반적으로 작동하는 기본 설정을 선택할 수 있습니다.
- 그 후, 파이의 관리를 크게 간편화해주는 dietpi-dashboard를 설치하는 것을 강력히 추천합니다.
- 다음은 ssh 터미널에서 다음 명령을 실행하여 설치할 수 있습니다.
먼저 dietpi-software list | grep dietpi-dashboard를 실행하여 소프트웨어 ID를 추출합니다.
그런 다음 dietpi-software install `ID`를 실행합니다.
- dietpi 대시보드가 설치되면 `라즈베리파이 IP 주소`:5252로 이동하여 파이 대시보드를 시작할 수 있습니다.
- 통계 페이지에서 메모리 사용량, 공간 사용량, CPU 사용률 등과 같은 유용한 정보를 찾을 수 있습니다.
- Software-`Not Installed`-`AdGuard Home`으로 이동하여 AdGuard Home을 설치할 수 있습니다.

<div class="content-ad"></div>


![alt text](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_6.png)

다이어트파이의 가장 좋은 점은 카탈로그에 나열된 소프트웨어를 설치하면 해당 소프트웨어의 최적 설정이 자동으로 구성된다는 것입니다.

AdGuard Home를 설치하면 `PI_IP`:8083로 이동하여 웹 인터페이스에 액세스할 수 있으며, 기본 사용자 이름과 암호는 AD Guard 페이지에 나와 있습니다.

로그인하면 다음 인터페이스가 표시됩니다.


<div class="content-ad"></div>


![Screenshot 1](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_7.png)

First, you will need to configure upstream DNS servers as per our preference so that the non-ads/trackers DNS queries are resolved properly. You can do this by heading to Settings > DNS Settings > Upstream DNS Servers and choosing any DNS provider which is ideal for your privacy needs. I’ve chosen Cloudflare as it works with DNS over HTTPS, which is another bonus for enhancing privacy.

![Screenshot 2](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_8.png)

Then you will need to configure DNS blocklist filters. While Adguard comes with some defaults, you should certainly customize the blacklists according to your privacy needs. I’d recommend adding open-sourced and community-maintained blacklists like Steven Black’s List and OISD Blocklist.


<div class="content-ad"></div>

다 했다면, 변경 사항을 적용하고 라우터로 이동하여 DNS를 `PI_IP`로 지정하세요.

이제 네트워크 전반에 걸친 필터링이 작동하는 것을 볼 수 있습니다. 이미 라즈베리 파이에 정적 IP 주소를 구성했고, adguard는 Pi에서 DNS 쿼리를 해결하기 위해 53번 포트(DNS 포트)에서 청취하도록 시스템 서비스로 구성되어 있습니다.

Google과 같은 인기 있는 웹 사이트로 이동하여 광고/트래커 차단 설정을 테스트할 수 있습니다. 대시보드에서 표시된 대로 특정 DNS 요청이 Pi에 의해 차단되는 것을 알게 될 것입니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_10.png)

이것은 완벽한 광고/트래커 차단 솔루션이 아니지만, 인터넷에서 개인 정보를 개선하기 위한 좋은 첫 걸음입니다. 설정은 이렇게 간단한 것뿐입니다.

![이미지](/assets/img/2024-06-23-AllhailPiADIYprivacyenhancementdevice_11.png)

내가 보통 하는 글과는 조금 다르지만, 이 프로젝트를 만들면서 좋은 경험을 쌓았고, 여러분도 새로운 것을 배우셨으면 좋겠어요.


<div class="content-ad"></div>

그럼 이것을 찾아 흥미로운 부분을 공유하고 싶어서 글을 마칠게요. 여기까지 읽어 주셔서 감사합니다 😄.

더 많은 흥미로운 내용을 보려면 LinkedIn과 X에서 저와 연락해보세요.

참고 자료:
https://dietpi.com/
https://adguard.com/en/adguard-home/overview.html