---
title: "라즈베리 파이 Cloudflare 터널 - DNS 라우팅을 사용해 내부 웹 서비스를 외부에 공개하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_0.png"
date: 2024-06-23 18:11
ogImage: 
  url: /assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_0.png
tag: Tech
originalTitle: "Raspberry Pi: How to expose Web Services in Private to Public with Cloudflare Tunnel — DNS routing"
link: "https://medium.com/@life-is-short-so-enjoy-it/raspberry-pi-how-to-expose-web-services-in-private-to-public-with-cloudflare-tunnel-dns-routing-000e8792cff2"
---


클라우드플레어 터널을 사용하여 홈랩에 있는 서비스를 공용으로 노출할 수 있습니다. 이것은 포트 포워딩의 대안이 될 수 있습니다.

![이미지](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_0.png)

# 중요 사항!!

자신이 하는 일의 결과와 위험을 알지 못한 채, 개인 서비스를 노출하는 것은 위험합니다!!

<div class="content-ad"></div>

위 지침을 따를 때 주의하세요.

Cloudflare 터널은 구성된 DNS 또는 IP에 대해서만 트래픽을 라우팅하지만, 트래픽은 클라우드플레어 터널 구성에 따라 개인 네트워크 어디에서든 발생할 수 있습니다.

보안을 높이기 위해 방화벽을 사용하여 클라우드플레어 터널이 설치된 Raspberry Pi의 네트워크를 격리했습니다.

# 소개

<div class="content-ad"></div>

HomeLab를 운영하는 주된 이유 중 하나는 자체 구축한 웹 서비스를 사설 네트워크에서 호스팅하는 것입니다. 이 웹 서비스를 구축하고 나면 많은 사용자들이 사용할 수 있도록 공용 네트워크에 노출되어야 합니다. (그것이 제 목표입니다.)

과거에는 포트 포워딩이 사설 웹 서비스를 공개 네트워크에 노출하는 유일한 옵션이라고 생각했습니다.

최근에 몇몇 영상과 기사를 보고 클라우드플레어 터널이 포트 포워딩 대안으로 사용될 수 있다는 것을 알게 되었습니다.

# 클라우드플레어는 어떻게 작동하나요?

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_1.png)

안녕하세요! 클라우드플레어 터널은 클라우드플레어가 제공하는 서비스로, 웹 서버나 다른 리소스와 같은 인프라를 클라우드플레어의 글로벌 네트워크에 안전하게 연결할 수 있게 해줍니다. 이런 방식으로 작동합니다:

- 설치: 클라우드플레어 터널 클라이언트 소프트웨어를 웹 서버나 연결하고자 하는 장치에 설치합니다. 이 클라이언트 소프트웨어는 클라우드플레어 네트워크와 안전한 연결을 설정합니다.
- 인증: 설치 후 클라이언트 소프트웨어는 API 토큰이나 다른 인증 방법을 사용하여 클라우드플레어와 인증을 수행합니다. 이를 통해 권한이 있는 클라이언트만 클라우드플레어와 연결을 설정할 수 있습니다.
- 연결 설정: 클라이언트 소프트웨어는 클라우드플레어의 엣지 위치 중 하나로 안전하고 암호화된 터널을 설정합니다. 이 터널은 인프라와 클라우드플레어 네트워크 간의 개인 연결 역할을 합니다.
- 라우팅: 터널이 설정되면 인프라로의 트래픽이 클라우드플레어 네트워크를 통해 라우팅됩니다. 클라우드플레어의 글로벌 네트워크는 콘텐츠 전달을 최적화하여 성능과 신뢰성을 향상시킵니다.
- 보안: 터널은 인프라와 클라우드플레어 간의 모든 트래픽을 암호화하여 제3자에 의한 가로채기나 변조로부터 보호합니다. 추가로, 클라우드플레어 네트워크는 DDoS 보호 및 다른 보안 기능을 제공하여 인프라를 공격으로부터 안전하게 보호합니다.
- 관리: 클라우드플레어 대시보드를 통해 터널을 관리하고 모니터링할 수 있습니다. 이는 터널 상태 모니터링, 라우팅 설정 구성, 로그 및 분석에 접근하는 것을 포함합니다.

요약하면, 클라우드플레어 터널은 프라이빗 인프라를 클라우드플레어의 글로벌 네트워크에 안전하고 효율적으로 연결하는 방법을 제공하여 성능, 신뢰성 및 보안을 향상시킵니다. (물론 여러분의 기대에 따라 달라집니다!)

<div class="content-ad"></div>

# DNS 라우트와 IP 라우트 비교

Cloudflare 터널은 DNS 라우트와 IP 라우트 두 가지 라우팅 옵션을 제공합니다. 아래는 두 가지의 비교입니다:

## DNS 라우트 동작 방식

DNS 라우팅을 사용하면 Cloudflare 터널 클라이언트가 호스트 이름을 Cloudflare에 등록하고 해당 호스트 이름에 대한 DNS 요청이 가장 가까운 Cloudflare 데이터 센터로 라우팅됩니다.

<div class="content-ad"></div>

## DNS 라우트의 장점

- 간편한 구성: IP 주소를 관리할 필요가 없습니다; DNS가 라우팅을 자동으로 처리합니다.
- 동적 IP 주소: 서버의 IP 주소가 변경되어도 구성을 업데이트할 필요가 없습니다; Cloudflare가 동적 IP 변경을 처리합니다.
- 부하 분산: Cloudflare의 글로벌 애니캐스트 네트워크가 트래픽을 자동으로 가장 가까운 데이터 센터로 라우팅하여 성능과 신뢰성을 향상시킵니다.

## DNS 라우트 고려 사항

- DNS 전파: DNS 레코드의 변경 사항은 전파되는 데 시간이 걸 수 있으며, 라우팅 변경이 적용되는 데 걸리는 시간에 영향을 줄 수 있습니다.
- 제한된 제어: IP 라우트와 비교하여 라우팅에 대한 세밀한 제어가 적습니다.

<div class="content-ad"></div>

## IP 경로 작동 방식

IP 라우팅을 사용하면 Cloudflare 터널 클라이언트가 특정 IP 주소를 Cloudflare에 등록하고, 해당 IP 주소로 전송된 트래픽은 Cloudflare 네트워크를 통해 서버로 라우팅됩니다.

## IP 경로의 장점

- 직접 라우팅: 트래픽이 서버의 IP 주소로 직접 라우팅되어 DNS 라우팅보다 지연 시간을 단축할 수 있습니다.
- 상세한 제어: 라우팅에 대해 더 많은 제어권을 가지고 서버에 연결할 수 있는 IP 주소를 지정할 수 있습니다.
- 즉시 트래픽: IP 경로에 대한 변경 사항이 DNS 전파를 기다리지 않고 즉시 적용됩니다.

<div class="content-ad"></div>

## IP 경로 고려 사항

- 정적 IP 주소: 서버에 정적 IP 주소가 필요합니다. IP 경로는 특정 IP 주소에 연결되어 있기 때문입니다.
- 구성 관리: 서버의 IP 주소가 변경되면 IP 경로를 수동으로 업데이트해야 합니다.
- DNS 해결 문제 가능성: 클라이언트의 DNS 해결에 실패하면 서버에 연결할 수 없게 됩니다.

## DNS 경로 또는 IP 경로를 사용해야 하는 경우

- DNS 경로: 간편함, 동적 IP 주소, 그리고 클라우드플레어가 부하 분산과 트래픽 라우팅을 자동으로 처리하길 원하는 경우 DNS 라우팅을 사용하세요.
- IP 경로: 라우팅 제어가 필요하거나 정적 IP 주소가 필요하거나 DNS 전파를 기다릴 필요 없이 즉시 트래픽 라우팅 변경이 필요한 경우 IP 라우팅을 사용하세요.

<div class="content-ad"></div>

최종적으로 DNS 라우팅과 IP 라우팅 사이의 선택은 특정 사용 사례, 요구 사항 및 제어, 유연성 및 관리 용이성에 대한 선호도에 따라 다릅니다.

# DNS 라우팅 또는 cloudflared CLI를 사용하기로 결정했습니다

먼저, 홈랩의 정적 IP를 노출시키고 싶지 않았습니다 (심지어 정적 IP조차 아닙니다). ISP에서 할당한 IP는 변경되지 않을 수 있지만, 이것이 정적 IP라는 것은 아닙니다. ISP가 원하는 경우 언제든지 IP가 변경될 수 있습니다.

둘째, 저는 단순히 특정 도메인 이름으로의 트래픽을 홈랩으로 라우팅하길 원했습니다.

<div class="content-ad"></div>

세 번째로, 클라우드플레어 터널 구성을 만들기 위해 클라우드플레어 클라이언트 명령줄 인터페이스(cloudflared CLI)를 사용하기로 결정했어요. 어떻게 작동하는지 알아내는 데 조금 더 시간이 걸렸지만, 구성을 자동화하는 데 도움이 되었어요 (실제로는 클라우드플레어 패키지 설치뿐이지만). 안시블 플레이북에서 자동화되고 스크립팅된 것들이 있었지만, 내가 개입해야 했던 몇 가지 단계들이 있었기 때문에 많이 도움이 되지는 않았어요.

# 클라우드플레어 터널은 어떻게 구성되나요?

클라우드플레어에 대한 게시물과 문서를 읽고, 비디오를 시청한 후, 내가 가지고 있는 라즈베리 파이 5 중 하나에 클라우드플레어 터널을 설치하고 구성했어요.

클라우드플레어 터널을 통한 DNS 라우트를 위해 나에게는 세 가지 엔티티가 있었어요.

<div class="content-ad"></div>

- 도메인 이름의 CNAME 레코드
- Cloudflare의 Cloudflare 터널 데몬/구성
- 내 HomeLab 기기에 Cloudflare 터널 데몬/구성

클라우드플레어 터널은 사용한 라즈베리 파이와 클라우드플레어 간의 VPN처럼 보였어요.

# Ansible Playbook을 작성했습니다

라즈베리 파이에 클라우드플레어드(클라이언트)를 여러 번 설치했습니다. 이 작업은 간단했지만 실험 중에 반복되어 수행되었기 때문에, 라즈베리 파이에 클라우드플레어드를 설치하는 Ansible Playbook을 작성했어요.

<div class="content-ad"></div>

앤서블 플레이북을 사용하면 GPG 키와 Cloudflared가 간단히 설치됩니다. (현재 Debian + Bookworm만 지원됩니다.)

```js
# moon-rapi 레포지토리 클론
git clone https://github.com/Gatsby-Lee/moon-rapi.git

# 하위 디렉토리로 이동
cd ansible_playbook

# 1. 대상 머신 IP 주소, 로그인 사용자 이름, 개인 SSH 키를 변경하세요.
# 2. 플레이북 실행
# 이 작업은 cloudflared를 설치합니다. (아직 구성하지는 않음)
ansible-playbook --inventory <대상 머신 IP 주소>, \
  --user <로그인 사용자 이름> \
  --private-key ~/.ssh/<개인 SSH 키> \
  install-cloudflared-on-debian.yaml
```

![라즈베리파이와 Cloudflare Tunnel 및 DNS 라우팅을 사용하여 2024년 6월 23일에 개인 웹 서비스를 공개하는 방법](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_2.png)

# Cloudflared CLI를 사용하여 Cloudflare 터널 구성하기

<div class="content-ad"></div>

## 단계 1: 로그인하고 루트로 전환하기

저는 Cloudflare Tunnel이 인프라의 일부였기 때문에 서비스를 구성하고 시작하기 위해 "root" 사용자를 사용했습니다.

```js
# 설치된 cloudflared 버전 확인
cloudflared --version
# root 사용자로 전환
sudo -s
# root 사용자의 홈 디렉토리로 이동
cd ~ 
```

![이미지](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_3.png)

<div class="content-ad"></div>

## 단계 2: 클라우드플레어에 로그인하여 클라우드플레어 터널 승인하기

Cloudflared CLI를 사용하려면 클라우드플레어 로그인 및 승인을 거쳐 클라우드플레어 터널을 활성화해야 했습니다.

시작 명령어는 "cloudflared login"입니다.

해당 명령은 아래 스크린샷과 같은 https 링크를 출력했습니다. URI는 복사하여 브라우저에 붙여넣어 클라우드플레어 터널 승인을 진행해야 했습니다.

<div class="content-ad"></div>

과정 중에 Cloudflare Tunnel과 구성하고 싶은 도메인을 선택해야 했어요. (저는 소유한 도메인 중 하나를 선택했어요.)

과정이 끝난 후에, 로그인을 수행한 기기에 /root/.cloudflared/cert.pem 파일이 제공되었어요.

```js
cloudflared login
```

<img src="/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_4.png" />

<div class="content-ad"></div>


![Step 3: Create Cloudflare Tunnel](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_5.png)

![Step 3: Create Cloudflare Tunnel](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_6.png)

![Step 3: Create Cloudflare Tunnel](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_7.png)

## Step 3: Create Cloudflare Tunnel


<div class="content-ad"></div>

"wowamazon"이라는 이름의 터널을 생성했어요. Cloudflare 터널을 생성한 후에는 `/root/.cloudflared` 경로 아래에 `uuid`.json 형식의 터널 전용 자격 증명이 생성되었어요.

Cloudflare 웹 UI에서 아래 스크린샷처럼 생성된 터널을 확인할 수 있었어요.

```js
cloudflared tunnel list
cloudflared tunnel create <터널 이름>

# 터널 정보 가져오기
cloudflared tunnel info <터널 이름>

# 터널을 삭제해야 하는 경우.
# -f를 사용하여 강제로 삭제할 수 있어요
cloudflared tunnel delete <터널 이름>
cloudflared tunnel delete <터널 이름> -f
```

<img src="/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_8.png" />

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_9.png)

## 단계 4: DNS 경로 만들기 — 공개 도메인을 통한 트래픽 라우팅

Cloudflare 터널을 생성한 후, Cloudflare 터널을 통해 라우팅하고자 하는 도메인으로 DNS 경로를 만들었습니다.

DNS 경로 생성은 wowamazon.party와 같은 도메인 아래 CNAME 레코드를 생성했습니다. 아래 스크린샷을 참조해주세요.

<div class="content-ad"></div>

또한, 방금 추가한 Routes로 Cloudflare Tunnel이 업데이트되었습니다. 아래 스크린샷처럼요.

```js
cloudflared tunnel route dns <tunnel-name> <domain>

# for myself.
cloudflared tunnel route dns wowamazon wowamazon.party
cloudflared tunnel route dns wowamazon *.wowamazon.party
```

![이미지1](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_10.png)

![이미지2](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_11.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_12.png" />

생성된 CNAME의 내용은 아래의 형식을 따릅니다.

```js
<tunnle-uuid>.cfargotunnel.com
```

## 단계 5: Cloudflare 터널 구성 파일 생성

<div class="content-ad"></div>

클라우드플레어 터널 구성 파일을 생성했어요. 경로는 /root/.cloudflared/config.yml 입니다.

다음과 같은 내용을 사용했어요. 인그레스를 구성하여 모든 트래픽을 로컬 "http://127.0.0.1:8080"으로 보내도록 설정했어요. 도커가 실행되고 수신 대기 중인 곳이에요. (내용은 당신의 환경에 맞게 변경해주세요.)

```js
tunnel: <터널-ID>
credentials-file: /root/.cloudflared/<터널-ID>.json

# ref: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/configuration-file/
ingress:
  - hostname: wowamazon.party
    service: http://127.0.0.1:8080
  - hostname: "*.wowamazon.party"
    service: http://127.0.0.1:8080

  - service: http_status:404
```

![이미지](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_13.png)

<div class="content-ad"></div>

## 단계 6: 구성으로 클라우드플레어 터널 실행하기

클라우드플레어 터널 구성이 완료되고 나서, 아래 명령어로 수동으로 클라우드플레어 터널을 시작할 수 있었습니다.

클라우드플레어 터널이 시작되면, 웹 UI에서 클라우드플레어 터널 상태가 "정상"으로 표시됩니다.

또한, https://wowamazon.party로 이동하여 아래 스크린샷처럼 클라우드플레어 터널이 귀하의 홈랩에서 서비스로 트래픽을 라우팅하기 시작했음을 확인할 수 있었습니다.

<div class="content-ad"></div>

```js
cloudflared 터널 --config /root/.cloudflared/config.yml 실행 <터널-이름>

# 모든 구성이 기본 이름을 사용하므로 이 축약된 명령어도 가능합니다.
cloudflared 터널 실행

# 제 경우에는 구성과 터널 이름을 명시하는 것이 더 좋습니다.
cloudflared 터널 --config /root/.cloudflared/config.yml 실행 wowamazon
```

![이미지 1](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_14.png)

![이미지 2](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_15.png)

![이미지 3](/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_16.png)


<div class="content-ad"></div>

## 단계 7: 클라우드플레어 터널을 서비스로 실행하기

이전 단계인 6단계에서 특정 구성과 클라우드플레어 터널 이름으로 클라우드플레어드를 수동으로 시작했습니다. (수동 방식은 모든 것이 예상대로 작동하는지 확인하기 쉽고 간단했습니다)

클라우드플레어 터널 시작은 내장된 "서비스로 클라우드플레어드"로 자동화할 수 있습니다.

"cloudflared service install" 명령어를 사용하여 cloudflared 서비스를 설치할 수 있습니다. "cloudflared service"가 설치되면 /root/.cloudflared/config.yml의 사본이 /etc/cloudflared/config.yml로 복사됩니다. 아래 스크린샷과 같이요.

<div class="content-ad"></div>

만약 "cloudflared service"가 문제없이 설치되었다면, 서비스는 자동으로 실행됩니다. 아래 명령어를 사용하여 서비스 상태를 확인할 수 있습니다.

```js
cloudflared service install

# 서비스를 제거하려면,
cloudflared service uninstall
rm /etc/cloudflared/config.yml

===

# cloudflared 서비스 상태 확인
systemctl status cloudflared.service
# cloudflared 서비스 수동 정지/시작
systemctl stop cloudflared.service
systemctl start cloudflared.service
```

<img src="/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_17.png" />

<img src="/assets/img/2024-06-23-RaspberryPiHowtoexposeWebServicesinPrivatetoPublicwithCloudflareTunnelDNSrouting_18.png" />

<div class="content-ad"></div>

# 마무리

몇 주 전에 라즈베리 파이 5대에 클라우드플레어 터널을 설치했어요. 그런데 이 단계별 포스트를 작성하는 데 시간이 걸렸네요. 몇 가지가 제게 명확하지 않아서 그랬던 것 같아요.

이 게시물이 클라우드플레어 터널에 참여하는 데 도움이 되길 바래요 😃

# 다음부턴