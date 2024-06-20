---
title: "Traefik 역방향 프록시 만들기 쉽게 이해하기 - 궁극의 안내"
description: ""
coverImage: "/assets/img/2024-05-27-TraefikReverseProxyMadeEasyUltimateGuide_0.png"
date: 2024-05-27 12:08
ogImage:
  url: /assets/img/2024-05-27-TraefikReverseProxyMadeEasyUltimateGuide_0.png
tag: Tech
originalTitle: "Traefik Reverse Proxy Made Easy— Ultimate Guide"
link: "https://medium.com/the-self-hoster/traefik-reverse-proxy-made-easy-ultimate-guide-211f0edc284c"
---

![Traefik 설치하기 쉽게 만든 Reverse Proxy의 최종 가이드](/assets/img/2024-05-27-TraefikReverseProxyMadeEasyUltimateGuide_0.png)

셀프 호스팅 세계에서 많은 사람들이 Traefik의 설정이 어렵고 문서를 이해하기 어렵다고 불평한다는 것을 알았어요. 또한 기존 가이드 중 많은 것들이 Traefik가 어떻게 작동하는지 설명하지 않고 구성 예시만 제공하는 것을 알았어요.

Traefik 가이드에 대한 저의 접근 방식은 ELI5 스타일로 Traefik에 대해 절대 모든 것을 이해하게 해줄 테니 기대해주세요.

Medium 유료 회원이 아니신가요? 무료로 여기서 읽어보세요.

<div class="content-ad"></div>

## 기초로 돌아가 — 반전 프록시란 무엇인가요?

반전 프록시는 다른 서버들 앞에 위치한 서버로, 요청을 이러한 서버들로 전달할 수도 있고 수정하거나 거부할 수도 있습니다.

예를 들어, 밥이가 있습니다. 밥이는 라즈베리 파이에 웹사이트를 배포했습니다. 그 라즈베리의 IP는 192.168.0.50이며, 그의 사이트는 http://192.168.0.50:8080 페이지로 접속할 수 있습니다. 그러나 그는 https://mysite.imbob.com을 입력하여 접속하고 싶어합니다. "imbob.com" 도메인을 소유하고 있다면, 반전 프록시를 이용하여 이를 할 수 있습니다. 더불어 IP를 화이트리스트로 추가하거나 인증을 추가하는 등의 보안 메커니즘을 추가할 수도 있습니다.

<img src="/assets/img/2024-05-27-TraefikReverseProxyMadeEasyUltimateGuide_1.png" />

<div class="content-ad"></div>

역방향 프록시는 로드 밸런서 역할을 할 수도 있습니다. 단일 서버가 처리할 수 있는 트래픽보다 많은 트래픽을 받으면, 역방향 프록시는 요청을 다른 서버들 사이에 분배할 수 있습니다.

## Traefik 최소 구성

당신이 Traefik을 설정할 때 Docker Compose를 사용한다고 가정하겠습니다. 여기 Traefik 문서에서 가져온 최소 예제가 있습니다:

services:
reverse-proxy: # The official v3 Traefik docker image
image: traefik:v3.0 # Enables the web UI and tells Traefik to listen to docker
command: --api.insecure=true --providers.docker
ports: # The HTTP port - "80:80" # The Web UI (enabled by --api.insecure=true) - "8080:8080"
volumes: # So that Traefik can listen to the Docker events - /var/run/docker.sock:/var/run/docker.sock

<div class="content-ad"></div>

여기, 이해해야 할 몇 가지 사항이 있어요. --api.insecure=true은 API를 traefik 엔트리포인트에서 사용 가능하게 만들고 (--entrypoint에 대한 더 자세한 내용은 몇 분 후에 있습니다), --providers.docker은 도커 프로바이더를 활성화시켜 호스트에서 도커 서비스를 자동으로 발견할 수 있게 합니다. 이를 위해 Traefik 컨테이너에 도커 소켓을 마운트해야 하는데, 이는 볼륨 섹션에서 수행됩니다. 마지막으로 몇 가지 포트를 노출해야도 해요:

- 80: 표준인 포트 80에서 HTTP 트래픽을 전달하기 위해
- 8080: 웹 UI에 액세스하기 위해

모든 것이 작동하는지 확인할 수 있어요. 웹 UI를 열어 http://your-ip:8080 (http://192.168.0.50:8080은 Bob의 경우)으로 접속할 수 있어요.

## 설정 파일

<div class="content-ad"></div>

Traefik을 구성하는 방법은 많이 있어요. 여기서 우리는 설정 매개변수를 컨테이너에 명령으로 전달했음을 볼 수 있어요. 이를 구성 파일을 통해 전달하거나 환경 변수를 통해 전달할 수도 있어요.

우리의 간단한 예제를 위한 구성 파일은 다음과 같아요:

```js
api: insecure: true;

providers: docker: endpoint: "unix:///var/run/docker.sock";
```

이건 YAML 파일이에요. 이 파일을 사용하려면 간단히 컨테이너에 마운트하시면 돼요:

<div class="content-ad"></div>

```yaml
services:
  reverse-proxy:
    image: traefik:latest
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - ./traefik.yml:/traefik.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock
```

그리고 모든 것이 이전과 같이 작동해야 합니다. 설정을 원하는대로 자유롭게 할 수 있으며, 이를 컨테이너 설정 파일을 통해하거나 Traefik 설정 파일을 통해하거나 환경 변수를 통해 할 수 있습니다. 개인적으로 Traefik 설정 파일을 통해 하는 것을 선호하므로 그대로 진행할 겁니다.

그런데 말이야, 지금 이야기하고 있는 설정은 정적 설정이라고 알려져 있어요. 이 설정을 변경할 때마다 Traefik을 재시작해야 합니다. 나중에 동적 설정에 대해 이야기할 거에요.

## EntryPoints

<div class="content-ad"></div>

EntryPoints의 역할은 특정 포트의 트래픽을 캡처하는 것입니다. 일반적인 Traefik 설치에서는 보통 포트 80과 포트 443의 트래픽을 캡처하고 싶을 것입니다. 하지만 가능한 모든 것이 있습니다. 예를 들어, 저는 포트 222를 통해 통과하는 SSH 트래픽을 리다이렉트하는 데에도 Traefik을 사용합니다.

EntryPoints는 정적 구성에서 정의됩니다. 예를 들어:

```js
entryPoints: web: address: ":80";

websecure: address: ":443";

ssh: address: ":222";
```

EntryPoints의 이름은 원하는 대로 지정할 수 있습니다. 표준은 없습니다. EntryPoints를 구성하는 다양한 옵션들이 많이 있습니다. 이 안내서에서 모든 세부 내용을 다룰 수는 없으니, 기본 사항을 설명해 드리겠습니다. 더 알고 싶다면 문서를 참조해야 합니다.

<div class="content-ad"></div>

일반적으로 HTTP 트래픽을 모두 HTTPS 트래픽으로 리디렉션하여 연결을 보안하는 것이 좋습니다. 이를 수행하는 한 가지 방법은 EntryPoint에 리디렉션을 추가하는 것입니다:

```js
entryPoints: web: address: ":80";
http: redirections: entryPoint: to: websecure;
```

여기서 모든 HTTP 트래픽이 websecure EntryPoint로 리디렉션되어야 함을 나타냅니다. 현재 TLS 인증서를 구성하지 않았으므로 이것을 구성에 유지하지 않는 것이 좋습니다.

또한, 각 EntryPoint에 대해 컴퓨터의 포트를 열어야 합니다. 그래서 우리의 새로운 docker-compose.yml 파일은 다음과 같습니다:

<div class="content-ad"></div>

```yaml
services:
  reverse-proxy:
    image: traefik:latest
    ports:
      - "80:80" # web
      - "443:443" # websecure
      - "1234:222" # ssh
      - "8080:8080"
    volumes:
      - ./traefik.yml:/traefik.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock
```

알 수 있듯이, ssh 엔트리 포인트의 포트 매핑은 1234입니다. 즉, 포트 1234로 전송된 트래픽은 ssh 엔트리 포인트를 통해 전송됩니다. 제가 보여주려는 것은 포트를 원하는 대로 매핑할 수 있으며, 다른 포트를 80번 포트와 443번 포트로 매핑할 수도 있지만, 이는 표준이 아니므로 서비스에 액세스할 때 포트를 지정해야 합니다. 예를 들어, https://radarr.imbob.com:4430이라고 지정해야 하며, 443번 포트가 아닌 다른 포트로 매핑한 경우에는 https://radarr.imbob.com 대신에 이렇게 지정해야 할 것입니다.

## DNS 레코드

도메인을 소유하고 있다고 가정하겠습니다. 소유하고 있지 않다면, PiHole과 같은 DNS 서버로 자체 도메인을 만들고 여기에 DNS 레코드를 추가할 수 있습니다.

<div class="content-ad"></div>

"저는 원하는 것이 'something.mydomain'을 입력하면 Traefik이 호스팅된 머신에 도달하도록 하고 싶어요. 어디에서든 서비스를 이용할지, 또는 집에서만 이용할지에 따라 사용해야 하는 IP가 다릅니다. 예를 들어, 저는 집에서만 서비스에 접속하고 싶다고 가정해봅시다.

해야 할 일은 로컬로 서버에 접속할 때 사용하는 IP를 가져와서 도메인 호스트에서 이 IP를 가리키는 A 레코드를 생성하는 것뿐입니다.

예를 들어, Bob은 DNS에 다음 레코드를 가지고 있습니다:

```js
A  *.imbob.com  192.168.0.50

<div class="content-ad"></div>

만약 Bob이 자신의 서비스를 어디서든 접근할 수 있게 하고 싶다면, 공용 IP를 사용하고 라우터 구성에서 포트 80 및 443을 전달해야 했을 것입니다. 예를 들어 다음과 같은 결과가 나오게 됩니다:

A  *.imbob.com  84.154.65.110

84.154.65.110이 그의 공용 IP인 것으로 가정합니다.

또 다른 예를 들어보겠습니다. 저는 VPN을 사용합니다. 이 VPN에 연결되어 있을 때, VPN에 할당된 다른 IP를 통해 내 기기에 접근할 수 있습니다. VPN에서 연결될 때 보이는 IP를 사용하여 내 서비스를 VPN에 속한 누구에게든 접근 가능하게 하고 싶다면, 다음과 같이 할 수 있습니다:

<div class="content-ad"></div>

A  *.imbob.com  100.81.0.50

## 첫 번째 서비스 추가하기

예를 들어, Dozzle를 사용해보겠습니다. Dozzle에 http://dozzle.imbob.com에서 액세스하고 싶습니다.

이제 docker-compose.yml에 Dozzle를 추가하겠습니다:

<div class="content-ad"></div>

services:
  reverse-proxy:
    image: traefik:latest
    ports:
      - "80:80"
      - "443:443"
      - "1234:222"
      - "8080:8080"
    volumes:
      - ./traefik.yml:/traefik.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock

  dozzle:
    container_name: dozzle
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8081:8080
    labels:
      - traefik.enable=true # 해당 서비스를 위해 Traefik를 활성화합니다
      - traefik.http.routers.dozzle.entrypoints=web # 엔트리포인트를 명시합니다
      - traefik.http.routers.dozzle.rule=Host(`dozzle.imbob.com`) # 서비스에 액세스하는 규칙을 명시합니다

또한, Traefik 구성 파일을 아래에서 확인하실 수 있습니다:

api:
  insecure: true

entryPoints:
  web:
    address: ":80"

  websecure:
    address: ":443"

  ssh:
    address: ":222"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"

이제 http://dozzle.imbob.com을 열어 사용하실 수 있습니다.

<div class="content-ad"></div>

하지만 왜 이것이 작동하는 걸까요? 저희 서비스는 Traefik 서비스와 동일한 파일에 있기 때문에 동일한 Docker 네트워크에 속합니다. 이 네트워크는 포트 80과 443을 통해 노출되어 있습니다. 따라서 우리가 컴퓨터의 포트 80으로 요청을 보내면, 이는 Dozzle이 속한 Docker 네트워크로 진입하게 됩니다.

이제 우리가 우리의 서비스를 해당 서비스를 자체 파일로 옮기고 싶다고 상상해 봅시다. 이 서비스를 Traefik의 Docker 네트워크에 연결해야 합니다. 다음과 같이 생성해 시작해 보죠:

docker network create traefik

이제 우리의 두 서비스, Traefik과 Dozzle이 이 네트워크에 속한다는 것을 밝혀야 합니다:

<div class="content-ad"></div>

services:
  reverse-proxy:
    image: traefik:latest
    ports:
      - "80:80"
      - "443:443"
      - "1234:222"
      - "8080:8080"
    volumes:
      - ./traefik.yml:/traefik.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock
    networks:  # required
      - traefik

networks:
  traefik:
    external: true

services:
  dozzle:
    container_name: dozzle
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8081:8080
    labels:
      - traefik.enable=true  # 해당 서비스에 대해 Traefik을 활성화합니다.
      - traefik.http.routers.dozzle.entrypoints=web  # 엔트리포인트를 지정합니다.
      - traefik.http.routers.dozzle.rule=Host(`dozzle.imbob.com`)  # 서비스에 액세스하는 규칙을 지정합니다.
    networks:  # required
      - traefik

networks:
  traefik:
    external: true

그러면 작동합니다. 그렇지 않으면, Traefik은 Dozzle 컨테이너의 IP로 리다이렉팅하겠지만, 이 IP는 서버에서 노출된 네트워크 바깥에 있는 Dozzle 컨테이너로 이어지지 않습니다.

## 라우터

<div class="content-ad"></div>

라우터는 적절한 서비스로 요청을 전달하는 역할을 합니다. 이는 동적 구성의 일환입니다.

도즐(Dozzle)의 경우, 다음 라우터를 정의했습니다:

- traefik.http.routers.dozzle.entrypoints=web  # 우리는 엔트리포인트를 지정합니다
- traefik.http.routers.dozzle.rule=Host(`dozzle.imbob.com`)  # 저희 서비스에 접근하는 규칙을 지정합니다

또한 Docker 레이블 대신 파일에서도 구성할 수 있습니다:

<div class="content-ad"></div>

http: routers: dozzle: entrypoints: -web;
rule: Host(`dozzle.imbob.com`);

그런 다음 정적 구성 파일에서 파일 제공자로 추가하십시오:

providers:
  docker:
    ...
  file:
    filename: /dynamic.yml

당연히 이 파일을 컨테이너에 마운트해야 합니다:

<div class="content-ad"></div>

services:
  reverse-proxy:
    ...
    volumes:
      - ./dynamic.yml:/dynamic.yml:ro

Traefik을 사용하는 것은 Docker 레이블을 사용하는 큰 장점이죠. 그러니 일단 이것을 사용하도록 하겠습니다. Middleware를 정의할 때 이 파일을 다시 살펴볼 거에요.

EntryPoints와 마찬가지로, Routers에도 많은 구성 옵션이 있습니다. 가장 중요한 것은 Rule 옵션입니다. 이 옵션을 사용하면 라우터가 요청을 서비스로 전달하기 위한 규칙을 정의할 수 있습니다.

Dozzle에 사용한 규칙은 다음과 같았습니다:

<div class="content-ad"></div>

호스트(`dozzle.imbob.com`);

예를 들어 다음과 같이 사용할 수 있습니다:

호스트(`dozzle1.imbob.com`) || 호스트(`dozzle2.imbob.com`);

Dozzle에 http://dozzle1.imbob.com 또는 http://dozzle2.imbob.com에서 액세스할 수 있습니다. 규칙에 대한 자세한 내용은 Traefik 문서를 참조하십시오.

<div class="content-ad"></div>

## 미들웨어

미들웨어는 서비스로 전송되기 전에 요청을 조정하는 데 사용됩니다. 미들웨어는 동적 구성에 정의됩니다.

도즐에 인증을 추가해 보겠습니다. 먼저, 패키지 apache2-utils에 포함된 htpasswd를 사용하여 비밀번호를 생성해야 합니다.

htpasswd -nB test
새 암호:
새 암호 다시 입력:
test:$2y$05$kLDHhc5ntBoHwAyp5S48U.wN.u2eQJYWpfYvRWSilayuAe5oF2xqy

<div class="content-ad"></div>

참고: docker-compose.yml에서 사용할 때 해시 내의 모든 달러 기호는 이스케이핑을 위해 두 배로 사용되어야 합니다. 따라서 대신 다음 명령을 사용하여 이를 자동으로 수행할 수 있습니다:

echo $(htpasswd -nB test) | sed -e s/\\$/\\$\\$/g
새 암호:
새 암호 다시 입력:
test:$$2y$$05$$uo7dTQpudzoJtmAhXLesxudke9edoGlxC6oaOL9zStHVayoVZ6xwm

이제 docker-compose.yml 파일에 인증 미들웨어를 추가할 수 있습니다:

services:
  dozzle:
    ...
    labels:
      ...
        # 패스워드는 "test" 입니다
      - traefik.http.middlewares.my-middleware.basicauth.users=test:$$2y$$05$$x4VT4lRFCy2.z/Ic3BQYbOgEzDILEqyhaStkuzykurT9KAuWKTSF.

<div class="content-ad"></div>

여기서는 미들웨어를 만들라고만 되어 있어요. 라우터에 그것을 사용하도록 지시해야 해요. 그래서 다음 레이블을 추가해요:

- traefik.http.routers.dozzle.middlewares=my-middleware

참고로 동적 구성 파일을 사용해서도 똑같은 작업을 할 수 있어요.

전체 Docker compose 파일은 다음과 같아요:

<div class="content-ad"></div>

services:
  reverse-proxy:
    image: traefik:latest
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - ./traefik.yml:/traefik.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock

  dozzle:
    container_name: dozzle
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8081:8080
    labels:
      - traefik.enable=true
      - traefik.http.routers.dozzle.entrypoints=web
      - traefik.http.routers.dozzle.rule=Host(`dozzle.imbob.com`)
      - traefik.http.middlewares.my-middleware.basicauth.users=test:$$2y$$05$$x4VT4lRFCy2.z/Ic3BQYbOgEzDILEqyhaStkuzykurT9KAuWKTSF.
      - traefik.http.routers.dozzle.middlewares=my-middleware

그리고 이제 http://dozzle.imbob.com 으로 이동하여 웹앱에 액세스하려면 기본 HTTP 인증을 요구할 것입니다.

참고: Traefik이 이해하는 설정을 언제든지 웹 UI를 통해 확인할 수 있습니다:

![Traefik Reverse Proxy 설정 화면](/assets/img/2024-05-27-TraefikReverseProxyMadeEasyUltimateGuide_2.png)

<div class="content-ad"></div>

## HTTPS 활성화

오늘날, 사용자들에게 신뢰감을 줄 수 있는 가장 기본적인 작업은 암호화된 연결을 제공하는 것입니다. Traefik을 사용하면 HTTPS 트래픽을 쉽게 제공할 수 있습니다.

Traefik을 구성하여 정적 인증서를 사용하거나 ACME 공급자에 의해 자동으로 생성된 인증서를 사용하도록 설정할 수 있습니다.

두 번째 옵션인 자동 생성 인증서를 사용하는 것이 가장 좋고 간단합니다. 그러니 이렇게 설정해 봅시다. Traefik의 정적 구성에 추가할 구성은 다음과 같습니다:

<div class="content-ad"></div>

certificatesResolver:
  letsEncrypt:
    acme:
      email: bob@gmail.com  # 여러분의 이메일을 입력해주세요
      storage: /tls/acme.json
      httpChallenge:
        entryPoint: web

여기서 "letsEncrypt"라는 인증서 리졸버를 선언하고 있습니다. 우리는 이를 위해 이메일 주소, 인증서를 저장할 위치 및 이 리졸버와 관련된 엔트리포인트를 제공해야 합니다.

기본적으로 우리는 무료이면서 접근성이 좋은 Let's Encrypt를 사용하고 있습니다. 위의 구성은 일반적으로 여러분의 도메인에 관계없이 작동할 것입니다. 하지만 Porkbun과 같은 다른 제공업체를 지정할 수도 있습니다:

certificatesResolvers:
  porkbun:
    acme:
      email: bob@gmail.com
      storage: /tls/porkbun.json
      dnsChallenge:
        provider: porkbun
        delayBeforeCheck: 0

<div class="content-ad"></div>

사용하는 공급업체에 따라 특정 옵션을 수정할 수 있어요. 예를 들어 Porkbun의 경우 환경 변수로 전달하는 API 키와 비밀 값을 제공해야 해요:

services:
  reverse-proxy:
    ...
    environment:
      PORKBUN_SECRET_API_KEY: my-secret
      PORKBUN_API_KEY: my-key

자세한 내용은 문서에서 확인해주세요.

컨테이너가 종료되어도 인증서가 유지되어야 여러 API에서 제한을 받지 않아요. 그래서 docker-compose.yml 파일에 볼륨을 추가해봅시다:

<div class="content-ad"></div>

서비스:
  reverse-proxy:
    ...
    볼륨:
      - tls:/tls

볼륨:
  tls:

마지막으로, 우리는 인증서 리졸버를 사용하고자 한다고 명시해야 합니다 (이것은 자동으로 이루어지지 않습니다). 그리고 우리의 EntryPoint를 HTTPS 트래픽과 관련된 하나를 사용하도록 수정해야 합니다 (우리의 경우에는 websecure), 그래서 우리의 라우터를 수정합니다:

서비스:
  dozzle:
    ...
    레이블:
    ...
      - traefik.http.routers.dozzle.entrypoints=websecure
      - traefik.http.routers.dozzle.tls.certresolver=letsEncrypt

그래서 이제, 여기가 전체 파일이에요, docker-compose.yml:

<div class="content-ad"></div>

services:
  reverse-proxy:
    image: traefik:latest
    ports:
      - "80:80"
      - "8080:8080"
      - "443:443"
    volumes:
      - ./traefik.yml:/traefik.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock
      - tls:/tls

  dozzle:
    container_name: dozzle
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8081:8080
    labels:
      - traefik.enable=true
      - traefik.http.routers.dozzle.entrypoints=websecure
      - traefik.http.routers.dozzle.rule=Host(`dozzle.imbob.com`)
      - traefik.http.routers.dozzle.middlewares=my-middleware
      - traefik.http.middlewares.my-middleware.basicauth.users=test:$$2y$$05$$x4VT4lRFCy2.z/Ic3BQYbOgEzDILEqyhaStkuzykurT9KAuWKTSF.
      - traefik.http.routers.dozzle.tls.certresolver=letsEncrypt

volumes:
  tls:

그리고 traefik.yml:

api:
  insecure: true

entryPoints:
  web:
    address: ":80"

  websecure:
    address: ":443"

  ssh:
    address: ":222"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"

certificatesResolver:
  letsEncrypt:
    acme:
      email: bob@gmail.com
      storage: /tls/acme.json
      httpChallenge:
        entryPoint: web

## 마무리하는 손짓

<div class="content-ad"></div>

완료하려면 먼저 Traefik을 우리 도메인 이름을 통해 쉽게 접근할 수 있도록 만들어야 합니다. 몇 가지 레이블을 추가하겠습니다:

services:
  reverse-proxy:
    ...
    labels:
      - traefik.enable=true
      - traefik.http.routers.traefik-secure.entrypoints=websecure
      - traefik.http.routers.traefik-secure.rule=Host(`traefik.imbob.com`)
      - traefik.http.routers.traefik-secure.service=api@internal
      - traefik.http.routers.traefik-secure.tls.certresolver=letsEncrypt

Traefik의 장점은 초기 구성이 완료된 후 리버스 프록시 뒤에 서비스를 쉽게 추가할 수 있다는 것입니다. 몇 가지 Docker 레이블로 가능합니다.

traefik.yml에서 api.insecure를 비활성화하고 api.dashboard를 활성화할 수도 있습니다:

<div class="content-ad"></div>

api:
  insecure: false
  dashboard: true

마지막으로, HTTP 트래픽을 HTTPS로 리디렉션하는 설정 블록을 추가해봅시다. traefik.yml에서 web 엔트리포인트를 수정하면 됩니다:

web:
  address: ":80"
  http:
    redirections:
      entryPoint:
        to: websecure

## TCP 트래픽 전달하기

<div class="content-ad"></div>

시작 부분의 예시를 다시 가져오겠습니다. SSH EntryPoint와 함께:

entrypoints: ssh: address: ":222";

도메인 이름 뒤에 SSH 트래픽을 전달하려고 합니다. EntryPoint가 있습니다. 호스트에서 포트를 노출해야 합니다:

services:
  reverse-proxy:
    ...
    ports:
      - 222:222

<div class="content-ad"></div>

이제, 우리는 SSH 서버를 정의하는 docker-compose.yml 파일에 TCP 라우터를 정의할 수 있습니다:

services:
  server:
    ...
    ports:
      - 222:22
    labels:
      - traefik.enable=true
      - traefik.tcp.routers.ssh.entrypoints=ssh
      - traefik.tcp.routers.ssh.rule=HostSNI(`*`)

HostSNI(\*)은 모든 요청을 일치시킬 것이라고 말합니다. 올바른 엔트리 포인트로 전송된다면 모든 요청을 일치시킵니다. 따라서 이는 example.mydomain.com:222뿐만 아니라 anything.mydomain.com:222도 일치시킵니다. 이는 TCP 트래픽에 대해 TLS를 사용하지 않는 경우 필수적이며, HTTP 및 HTTPS 포트가 아닌 표준 TCP 포트를 사용하지 않는 경우에는 실제로 문제가 되지 않습니다.

이것으로 끝입니다! 참고로, 저는 이를 Gitea와 함께 사용하여 다음과 같은 원격 URL을 가지고 있습니다: ssh://git@gitea.mydomain.com:222/estebanthi/my-repo.git.

<div class="content-ad"></div>

아무것이나 원하는 대로 할 수 있습니다. 저는 SQL 데이터베이스와 함께도 이를 사용해요.

## 보너스: 여러 호스트

이 부분은 여러 대의 서버를 사용하는 사람들에게만 관련됩니다.

서비스가 Traefik을 통해 접근 가능하도록 하려면 도커 네트워크에 속해 있어야 한다고 말씀드렸죠? 만약 여러 대의 서버를 가지고 있다면 이것이 문제가 될 수 있습니다. 적어도 도커 레이블을 더 이상 사용할 수 없게 되며, 서비스를 노출하고 파일 공급자를 통해 Traefik에 추가해야 합니다.

<div class="content-ad"></div>

대안으로 traefik-kop을 사용할 수 있습니다. 이제 "서버 1" (192.168.0.50)에 Traefik이 있고 "서버 2" (192.168.0.51)에 Dozzle이 있다고 가정해 봅시다.

먼저 Traefik에 Redis 공급자를 추가해 보겠습니다.

providers:
  docker:
    ...
  redis:
    endpoints:
      - "redis:6379"

여기에서 Traefik을 실행 중인 호스트와 동일한 호스트에 Redis를 만들어 보겠습니다.

<div class="content-ad"></div>

services:
  reverse-proxy: ...

  redis:
    image: redis:latest
    restart: unless-stopped
    ports:
      - "6379:6379"

이제 "서버 2"에서 traefik-kop을 배포할 것입니다.

services:
  traefik-kop:
    image: "ghcr.io/jittering/traefik-kop:latest"
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - "REDIS_ADDR=192.168.0.50:6379" # Redis 호스트의 IP
      - "BIND_IP=192.168.0.51" # 현재 호스트의 IP

그러면 이제 "server 2"에서 계속해서 사용해오던 라벨들을 사용할 수 있게 됩니다.

<div class="content-ad"></div>

그런데 Redis 호스트의 TCP 트래픽을 노출하고 redis.mydomain.com:6379을 통해 접근할 수 있도록 설정할 수 있어요. 그러면 "REDIS_ADDR"이 "redis.mydomain.com:6379"로 변경돼요 (저는 이렇게 했어요). 이제는 알고 계시잖아요.

## 마지막으로

제가 설명을 명확히 전달했기를 바랍니다. Traefik은 처음에는 조금 혼란스러울 수 있지만 최대한 간단하게 설명하려고 노력했어요. 이해에 어려움이 있다면 언제든지 댓글을 달아 주세요!

읽어 주셔서 감사합니다! 더 많은 내용을 보고 싶으시다면 아래에서 제 모든 게시물을 찾아보세요.
