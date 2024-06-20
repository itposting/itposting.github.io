---
title: "Nginx 리버스 프록시를 드디어 이해했어요"
description: ""
coverImage: "/assets/img/2024-06-19-IFinallyFiguredoutNginxReverseProxy_0.png"
date: 2024-06-19 08:38
ogImage: 
  url: /assets/img/2024-06-19-IFinallyFiguredoutNginxReverseProxy_0.png
tag: Tech
originalTitle: "I Finally Figured out Nginx Reverse Proxy"
link: "https://medium.com/dev-genius/i-finally-figured-out-nginx-reverse-proxy-b9c050f16db7"
---


## 무료 SSL 인증서로 내 웹 앱을 서버에 호스팅하는 방법

![이미지](/assets/img/2024-06-19-IFinallyFiguredoutNginxReverseProxy_0.png)

첫 클라우드 서버를 얻은 후, 자연스러운 첫 단계는 웹사이트(또는 웹 앱!)를 구축하고 호스팅하는 것이었습니다.

이 과정에서 프록시, 역 프록시, A 레코드, SSL 인증서 등에 대해 배우는 굴레에 빠졌습니다.

<div class="content-ad"></div>

아주 밀도 높은 컴퓨터 네트워킹 및 인터넷 라우팅 블로그 글을 몇 시간 동안 살펴보느라 애를 썼지만, 결국 문제를 해결하는 데 성공했어요.

이제, irtizahafiz.com 또는 www.irtizahafiz.com으로 이동하시면, 디지털 오션 서버에서 바로 확인할 수 있는 NextJS 예제 앱의 작동 버전을 볼 수 있어요!

이 블로그 글에서는, 제가 한 것과 동일한 작업을 성공적으로 완료하는 데 도움이 되는 단계별 자습서를 안내할 계획이에요. 제가 겪었던 학습 시간에 비해 2-3시간을 들이지 않고도 도움이 될 거예요.

# 무엇을 배우게 될까요?

<div class="content-ad"></div>

누군가 소중한 시간을 낭비하고 싶지 않아요. 그래서 아래에서 다룰 주제들을 확인하고 가치있는 부분이라면 계속 읽어주세요.

- 도메인을 서버에 연결하는 방법
- Nginx 설치 및 구성
- 내부 웹 앱(NextJS, ReactJS, Python Flask 등)을 인터넷에 노출하는 방법
- 프록시 및 리버스 프록시
- 도메인을 위한 SSL 인증서 생성
- 웹사이트를 안전한 HTTPS를 통해 제공하기

아직도 관심이 있다면, 시작해봐요.

# 서버에 도메인 연결하기

<div class="content-ad"></div>

첫 번째 단계는 가장 적은 단계가 필요해요.

두 가지가 필요해요:

- 도메인 대시보드 액세스 (고다디, Namecheap 등)
- 서버 기계의 공용 IP 주소

그런 다음, 도메인 대시보드의 DNS 관리로 이동하여 값이 서버의 IP 주소로 설정된 "A" 레코드를 추가하세요.

<div class="content-ad"></div>

다음 내용은 더 흥미로운 부분입니다.

로컬에서 웹 앱을 실행하는 데 사용하는 프레임워크는 중요하지 않아요. NextJS, ReactJS, Python Flask, Python Django 등을 사용하던 상관 없어요.

<div class="content-ad"></div>

모든 경우에, 당신이 하는 일은 같습니다. 주어진 포트에서 웹 앱을 당신의 기기에서 실행합니다.

제 경우에는 NextJS 앱을 3000번 포트에서 실행하는 것이었습니다.

다음과 같이 간단한 작업을 할 수 있습니다:

```js
npm run start
```

<div class="content-ad"></div>

그리고 로컬 컴퓨터에서 웹 앱을 실행할 수 있게 됩니다. WiFi 네트워크 내에서 액세스할 수 있지만 외부에서는 액세스할 수 없습니다.

# Nginx 웹 서버 설치

웹 앱을 공개 인터넷 사용자에게 제공하려면 웹 서버를 사용해야 합니다. 그런 다음들어오는 웹 서버 요청을 로컬에서 실행되는 앱으로 프록시해야 합니다.

자세히 설명드리겠습니다.

<div class="content-ad"></div>

먼저, 서버에 Nginx를 설치해 보겠습니다.

```js
sudo apt update
sudo apt install nginx
```

성공적으로 설치되면, 아래 해당 Nginx 구성 파일을 찾을 수 있습니다:

작동 중인 Nginx로 서버에 오는 모든 요청은 기본적으로 포트 80에서 정적 Nginx HTML 페이지를 제공합니다.

<div class="content-ad"></div>

안녕하세요! 아래의 정적 페이지를 로컬에서 실행 중인 웹 앱으로 교체할 예정입니다.

# Nginx 구성

기본 Nginx 구성 파일은 다음 디렉토리에 위치해 있습니다:

첫 번째 단계로, 기본 구성 파일을 삭제하고 myserver.config라는 파일에 사용자 정의 구성을 만들겠습니다.

<div class="content-ad"></div>

여기 명령어 시퀀스입니다:

```js
sudo unlink /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
cd /etc/nginx/sites-available
touch myserver.config
```

우리가 하는 일입니다:

- 기본 설정의 링크를 해제합니다.
- 기본 설정의 미러 버전을 삭제합니다.
- 우리가 만드는 사용자 정의 설정 파일인 myserver를 만듭니다 (곧 채워질 것입니다).

<div class="content-ad"></div>

# 웹 앱으로의 요청 프록시하기

그런 다음, 새롭게 생성한 myserver.config 파일 내에 다음 Nginx 구성을 작성하십시오.

```js
server{
  server_name irtizahafiz.com;
  location / {
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:3000;
  }
}
```

이 작업을 수행하면 다음이 실행됩니다:

<div class="content-ad"></div>

- irtizahafiz.com 도메인으로 온 요청을 받습니다.
- 요청을 기기의 포트 3000(웹 앱이 실행 중인 포트)으로 프록시합니다.
- 웹 앱에서 사용자 응답을 반환합니다.

# 마지막으로 Nginx 재시작

모든 단계가 완료되면 Nginx를 재시작하세요:

```js
sudo systemctl restart nginx
```

<div class="content-ad"></div>

이제 irtizahafiz.com으로 오는 모든 HTTP 요청은 로컬에서 실행 중인 웹 응용 프로그램에 의해 경로 지정되고 제공됩니다.

# 작동 중… 그러나 HTTPS를 통해 작동하지 않음

잘 따라오셨다면 SSL 인증서에 대해 아직 언급하지 않은 것을 알 수 있을 것입니다.

또한 내 경우와 같이 연결된 웹 사이트인 irtizahafiz.com에 가면 HTTP가 아니라 HTTPS를 통해 제공되고 있음을 알 수 있습니다.

<div class="content-ad"></div>

일부 브라우저(예: Safari)는 보안 문제로 인해 웹 페이지를 표시하지 않을 수도 있습니다.

그 문제를 해결해 보겠습니다.

## 무료 SSL 인증서 얻기

항상 SSL 인증서에 돈을 내야 한다는 인상을 가지고 있었는데요.

<div class="content-ad"></div>

도메인 관리 웹사이트인 GoDaddy, Namecheap 같은 사이트들이 SSL 인증서를 매월 $8, $10 등 판매하려고 해서 도움이 되지 않았죠.

자신의 컴퓨터에서 웹 앱을 호스팅할 때는 대신 무료 SSL 인증서를 받을 수 있어요!

Certbot이라는 블로그에서 무료로 자동 갱신되는 SSL 인증서를 얻는 방법에 대해 잘 작성된 게시물이 있어요.

링크된 블로그 포스트를 확인해 보세요. 그러나 따라하기 쉽게 하기 위해 아래에 bash 명령어 순서를 나열해 놓을게요:

<div class="content-ad"></div>

```sh
sudo snap install - classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot - nginx
```

Certbot는 Nginx 구성 파일을 수정합니다. 튜토리얼에서는 'myserver.config' 파일을 만들었습니다.

이 프로세스는 개인 키를 생성하고 그것들을 Keychain에 저장한 다음 도메인에 링크합니다.

이제 귀하의 트래픽은 기본 포트 80이 아닌 보안 포트 443에서 제공됩니다.


<div class="content-ad"></div>

# 마무리

위 구성을 통해 irtizahafiz.com으로의 모든 트래픽이 HTTPS로 리디렉션되고 포트 3000에서 실행되는 백엔드 서버로 프록시됨이 보장됩니다.

본 안내서가 도움이 되었기를 바랍니다.

더 궁금한 사항이 있으시다면 아래에 코멘트를 남겨주세요. 이 내용이 유용했다면 팔로우해주시고 제 뉴스레터를 구독해주세요.