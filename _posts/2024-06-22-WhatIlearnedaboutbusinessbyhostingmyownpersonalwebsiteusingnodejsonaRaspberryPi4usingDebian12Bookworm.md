---
title: "Raspberry Pi 4과 Debian 12 Bookworm에 Nodejs를 사용하여 개인 웹사이트를 운영하며 배운 비즈니스 인사이트"
description: ""
coverImage: "/assets/img/2024-06-22-WhatIlearnedaboutbusinessbyhostingmyownpersonalwebsiteusingnodejsonaRaspberryPi4usingDebian12Bookworm_0.png"
date: 2024-06-22 19:29
ogImage:
  url: /assets/img/2024-06-22-WhatIlearnedaboutbusinessbyhostingmyownpersonalwebsiteusingnodejsonaRaspberryPi4usingDebian12Bookworm_0.png
tag: Tech
originalTitle: "What I learned about business by hosting my own personal website using node.js on a Raspberry Pi 4 using Debian 12 Bookworm"
link: "https://medium.com/@capjmk/what-i-learned-about-business-by-hosting-my-own-personal-website-using-node-js-4ffa34170920"
---

TL;DR: 네, 확인해보세요 https://julianmkleber.com 시리즈 기사를 따라오면서 몇 일 동안 게임 속으로 빨려 들어갔군요. 멋지네요. 포식자들이 있더라도, 노력한다면 작은 (모델) 회사를 그들로부터 방어할 수 있다는 것을 배웠을 겁니다. 그래서 전 세계에 우리가 XMR을 채굴하여 돈을 버는 인프라를 구축할 수 있다는 것을 증명한 후, 웹사이트를 호스팅하는 것을 시작할 수 있습니다. 이 블로그 글에서는 node.js, podman, vue.js, certbot, fail2ban 및 nginx을 사용하여 정적 웹사이트를 호스팅하는 방법에 대해 설명하고 있습니다. 제 설정은 회사 설정에서 하나의 웹 프로젝트마다 연간 최소 $666을 절약합니다.

![이미지](/assets/img/2024-06-22-WhatIlearnedaboutbusinessbyhostingmyownpersonalwebsiteusingnodejsonaRaspberryPi4usingDebian12Bookworm_0.png)

# 서문

이는 자체 호스팅된 산업 생산 환경에서 웹사이트를 개발, 유지 및 배포하기 위한 인프라를 설정할 것이기 때문에 매우 복잡합니다. APT(그래, 아직 약간의 공격성이 있습니다)에 의해 많은 사이버 공격을 받는 환경이라고 합니다.

<div class="content-ad"></div>

# 네트워크 준비하기

네트워크를 분할하여 방화벽 및 라우터를 사용하고 웹 사이트를 호스팅하는 서버를 분리하는 것을 권장합니다. 예를 들어 Forgejo 인스턴스가 위치한 세그먼트 외부에 위치시킵니다.

# Raspberry OS 준비하기

최대 성능을 위해 64비트 Debian의 최소 설치판을 선택합니다. 이미지 생성 과정에서 다음을 확인해주세요:

<div class="content-ad"></div>

- SSH 설정하기
- 라즈베리 파이에 적절한 이름 지정하기
- 라우터에서 MAC 주소를 사용하여 내부 IP 주소에 묶어 컴퓨터의 스푸핑 방지하기

# Bookworm으로 업그레이드하기

아직 Bookworm을 사용 중이 아니라면, 다른 문서에서 설명한 대로 라즈베리를 Bookworm으로 업그레이드하려 합니다.

그래서 저희들

<div class="content-ad"></div>

```js
sudo nano /etc/apt/sources.list
```

그리고 저희의 sources.list를 삽입해주세요. 최근에 변경되었으니 무엇을 삽입해야 하는지 문서를 참고해주시기 바랍니다.

그리고 아래 명령어를 입력해주세요.

```js
sudo apt upgrade && sudo apt update
```

<div class="content-ad"></div>

# 2FA를 통해 시스템을 안전하게 유지하세요

서버를 유지하는 것을 쉽게 만들면서도 원치 않는 방문자를 차단하기 위해 SSH 서버에 내부적으로 키와 비밀번호를 사용하여 인증할 것입니다.

# 다수의 키 보유

다수의 키를 보유하고 있다면 문제에 직면할 수 있습니다.

<div class="content-ad"></div>

따라서 올바른 인증 방법을 수동으로 추가해야 합니다. 자세한 내용은 블로그 게시물을 확인해 주세요.

2단계 인증을 추가하려면 "Standard behaviour" 부분을 참고하시면 됩니다.

# Standard behaviour

저의 코드베르그에서 다음 명령을 따라할 수 있습니다. 먼저 컴퓨터에 추가하세요:

<div class="content-ad"></div>

```js
ssh-keygen
cat ~/.ssh/id_rsa.pub | ssh username@remote_host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh-add path-to-priv-key
```

라즈베리 파이에서

```js
sudo nano /etc/ssh/sshd_config
```

라인 2에 삽입하세요.

<div class="content-ad"></div>

```js
AuthenticationMethods publickey,password
```

그런 다음 즐겨 사용하는 명령어를 실행하세요

```js
sudo systemctl daemon-reload && sudo systemctl restart sshd && sudo systemctl status sshd
```

# 컨테이너 만들기

<div class="content-ad"></div>

우리는 Vuepress 웹사이트를 호스팅하려고 합니다. 그를 위해서는 node.js가 필요합니다. 컨테이너를 사용하여 노드 배포에 대한 실습을 해보기 위해 컨테이너를 설정할 것입니다.

이를 위해 컨테이너를 만들고 레지스트리에 푸시한 다음 라즈베리 파이 4에서 다운로드할 것입니다.

운이 좋게도, 이 작업은 간단하며 Codium을 사용할 수 있습니다.

<div class="content-ad"></div>

```js
sudo apt install podman
```

그런 다음, 저장소에 다음을 추가해줍니다.

```js
touch Containerfile
```

그리고 구성을 추가합니다.

<div class="content-ad"></div>

```js
FROM docker.io/node:lts-alpine
ENV NODE_ENV=production
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
RUN npm install -g serve
COPY ./docs/.vuepress/dist .
EXPOSE 3000
USER node
CMD serve ./dist
```

# harp00n을 사용하여 스테이징 서버 설정하기

가끔씩 우리는 응용 프로그램을 개발하기 위해 시스템에서 노드를 사용할 수 있습니다. 이는 보안 취약점을 유발할 수 있어 프로덕션 서버에서는 그렇게 하고 싶지 않습니다.

하지만, 이제 어떻게 애플리케이션을 레지스트리에 배포할 수 있을까요? 워크플로우는 꽤 단순합니다. 우리는 개발 머신에서 개발합니다 (보안 상의 이유로 웹 서비스와 통신할 수 없을 수 있음). 그리고 코드를 리포지토리에 푸시합니다. 그런 다음 코드 리뷰를 하고 코드를 스테이징 브랜치에 커밋합니다 (메인일 수도 있고 아닐 수도 있음 — 당신의 취향에 따라 다름). 그런 다음 스테이징 서버의 웹 후크가 트리거되어 컨테이너를 빌드하고 레지스트리에 컨테이너를 푸시하게 됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-WhatIlearnedaboutbusinessbyhostingmyownpersonalwebsiteusingnodejsonaRaspberryPi4usingDebian12Bookworm_1.png" />

이상적으로는 프로덕션 머신의 웹 후크가 트리거되어 컨테이너 레지스트리에서 새 웹사이트를 가져 오게됩니다.

그것은 꽤 간단한 일이죠? 오케이, 아마도 자체 블로그 기사가 필요할지도 모르겠네요... :)

## 보안 고려 사항

<div class="content-ad"></div>

배포 파이프라인은 우리 인프라의 마지막 구성 요소 중 하나로, 클라우드의 많은 표준 도구의 오버헤드와 보안 문제 없이 어느 정도 알찬 파이프라인을 실행할 수 있습니다. 어떻게냐고요? 제한된 종속성을 사용하여 필요한 최소한의 것들만 구축했기 때문입니다.

우리 인프라의 공격 표면은 상당히 낮습니다. 유지 보수 비용 문제라고 주장할 수도 있겠지만, 지원 요원에게 전화하고 티켓을 기다리며 한 달에 여러 번 이를 반복하는 것 또한 유지 보수 비용으로 볼 수 있습니다. 예를 들면 저는 이로 인해 프리랜싱 플랫폼에서 떠나고 마케팅 인프라를 직접 운영하게 되었습니다.

꼭 확인해 보세요!

먼저, 웹 서버 애플리케이션을 설정하여 웹훅 상호작용을 처리합니다.

<div class="content-ad"></div>

# 배포

그런 다음 배포 스크립트를 설정합니다.

```js
touch deploy.sh
```

필요한 명령어를 삽입합니다.

<div class="content-ad"></div>

```js
podman build -t personal-website
podman
```

위 명령어는 vuepress 사이트를 분배(dist)로 컴파일하고, node-alpine-LTS 이미지에서 노드 컨테이너를 만들어 레지스트리에 푸쉬하는 작업을 수행합니다.

자주 사용하려면, 다음을 실행하세요.

```js
chmod u+x deploy.sh
./deploy.sh
```

<div class="content-ad"></div>

이제 레지스트리에서 RPi4에서 그것을 가져올 수 있습니다.

## 웹사이트 호스팅을 위한 데몬 설정

따라서 라즈베리파이가 종료된 경우, 다시 부팅될 때 데몬을 다시 시작하여 다운타임을 최소화하려고 합니다.

만약 더 적은 다운타임을 원한다면, 로드 밸런서와 여러 대의 기기가 웹사이트를 호스팅하는 환경을 구축할 수도 있습니다. 이 프로젝트에는 다소 복잡해 보일 수 있지만, 더 큰 프로젝트들이 곧 그런 요구사항이 필요할 수도 있습니다.

<div class="content-ad"></div>

# 역방향 프록시 설정

```js
sudo apt install nginx
sudo systemctl enable nginx && sudo systemctl status nginx
```

DDoS 보호를 위해 다음을 추가하려고 합니다:

```js
server {
    ...
    limit_req zone=perip burst=5 nodelay;
    limit_req zone=perserver burst=10;
}
```

<div class="content-ad"></div>

따라서, 우리의 구성은 다음과 같습니다:

```js
server {
    limit_req zone=perip burst=5 nodelay;
    limit_req zone=perserver burst=10;

    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;

    ssl_certificate /etc/ssl/certs/julianmkleber.crt;
    ssl_certificate_key /etc/ssl/private/julianmkleber.key;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;

    server_name hostname ipaddress;

    location / {
        proxy_pass http://127.0.0.1:3000;
        include proxy_params;
    }
}

server {
    limit_req zone=perip burst=5 nodelay;
    limit_req zone=perserver burst=10;
    listen 80;
    server_name ipaddress hostname;

    # 모든 서브도메인에 대한 HTTP에서 HTTPS로의 리다이렉션
    return 301 https://$host$request_uri;
}
```

# 방화벽 설정

네, 방화벽 없이 서버를 외부 세계에 노출시킬 수 없습니다.

<div class="content-ad"></div>

우리는 이미 좋은 방화벽 규칙을 알고 있어요. 이번에는 iptables-persistent 패키지를 사용하지 않고 방화벽 서비스를 직접 만들 거에요 (방화벽을 설정하는 다른 관점을 얻기 위해서죠). 솔직히 말해서, 이 방법이 더 유연하게 보이기 때문에 나는 이 접근 방식을 더 좋아해요.

먼저, 모든 규칙들을 설정해봐요.

```js
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT #http 포트
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT #https 포트
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 5000 -j ACCEPT
sudo iptables -A INPUT -p icmp --icmp-type 0 -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -j DROP
sudo iptables -A INPUT -s 192.168.178.0/24  -j ACCEPT #공개 접근 피하기
sudo iptables -I OUTPUT -d 192.168.1.0/24  -p tcp --dport 22 -j REJECT #서브넷으로 SSH 발신 차단
```

이 규칙들이 무엇을 하는지 궁금하죠?

<div class="content-ad"></div>

- 서버로의 로컬 액세스를 ssh를 통해 제한합니다.
- 외부 통신을 위한 리버스 프록시 포트 이외의 모든 포트의 모든 연결을 차단합니다.
- 외부 ssh 제한

그런 다음 덤프 결과를 파일에 저장합니다.

```js
sudo mkdir -p /usr/share/iptables/
sudo touch /usr/share/iptables/iptables.conf
```

그런 다음 덤프를 복사합니다.

<div class="content-ad"></div>

```js
sudo iptables-save
```

위 명령어를

```js
sudo nano /usr/share/iptables/iptables.conf
```

에 붙여넣기하세요. 먼저 실행 파일을 만듭니다.

<div class="content-ad"></div>

```bash
sudo nano /usr/share/iptables/restore.sh
```

그리고 다음 내용을 추가하세요.

```bash
#!/bin/sh
/usr/bin/flock /run/.iptables-restore /sbin/iptables-restore < /usr/share/iptables/iptables.conf
```

그리고 실행 가능하도록 변경하세요.

<div class="content-ad"></div>

```js
sudo chmod u+x /usr/share/iptables/restore.sh
```

그런 다음, 다음과 같이 서비스를 설정합니다.

```js
sudo nano /etc/systemd/system/iptables-persistent.service
```

그리고 다음을 삽입하십시오.

<div class="content-ad"></div>

[Unit]
Description=부팅 시 iptables restore를 실행합니다.
ConditionFileIsExecutable=/usr/share/iptables/restore.sh
After=network.target

[Service]
Type=forking
ExecStart=/usr/share/iptables/restore.sh
TimeoutStartSec=0
RemainAfterExit=yes
GuessMainPID=no

[Install]
WantedBy=multi-user.target

마지막으로, 세 가지 좋아하는 명령어를 실행해봅시다.

sudo systemctl daemon-reload && sudo systemctl enable iptables-persistent.service && sudo systemctl start iptables-persistent.service && sudo systemctl status iptables-persistent.service

이제 작동하는지 확인해보세요.

<div class="content-ad"></div>

작동 여부를 확인하기 위해 시스템을 다시 시작하고 규칙을 확인해요

```js
sudo reboot
sudo iptables -S
```

# Fail2Ban 설정

DDoS 공격 및 기타 보안 위협을 피하기 위해 fail2ban을 설치할 거에요.

<div class="content-ad"></div>

이것은 꽤 쉬워요. 다음과 같이 입력하세요.

```js
sudo apt install fail2ban -y
```

fail2ban이 오류와 함께 시작되지만, 우리는 이 오류를 수정하기 위해 구성을 수정하기만 하면 됩니다.

우리에게 있어서 중요한 것은 SSH 브루트포스 공격자의 원격 IP와 내부 IP 모두에 대한 차단입니다 — 방화벽을 통해 그것을 제한할 예정이지만, 다른 서버에서 사고가 발생했을 경우를 대비해서요.

<div class="content-ad"></div>

그럼, 먼저 테이블 태그를 Markdown 형식으로 바꿔보세요.

```js
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

그 다음 아래에 아래와 같이 삽입해 주세요.

```js
[sshd]
enabled = true
port = ssh
filter = sshd
backend=systemd
logpath = /var/log/auth.log
maxretry = 4
bantime = 366
ignoreip = whitelist-IP
```

<div class="content-ad"></div>

다음으로, nginx 웹 서버에서 DDoS 공격을 차단하려고 합니다:

그래서, 아래 내용을 추가합니다.

```js
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

<div class="content-ad"></div>

```ini
[nginx-req-limit]

enabled = true
filter = nginx-req-limit
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/*error.log
findtime = 600
bantime = 7200
maxretry = 10
```

Nginx 구성 파일 편집

우리는 다음을 삽입합니다.

```sh
sudo nano /etc/nginx/nginx.conf
```

<div class="content-ad"></div>

```js
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
limit_req_zone $server_name zone=perserver:10m rate=100r/s;
```

I increased the parameters, so that even if many people visit my website at the same time (like when I give talks and the traffic spikes), it can handle the load.

In the server configuration block of our reverse proxy, we need to add another line (details are also provided in the respective section).

<div class="content-ad"></div>

```js
server {
    ...
    limit_req zone=perip burst=5 nodelay;
    limit_req zone=perserver burst=10;
}
```

# 신뢰할 수 있는 SSL 인증서 생성하기

## 인증서 제공업체에서 인증서 설치

그럼 이제 이전과는 다르게 셀프 사인한 인증서를 생성하는 게 아니라, 인증서 기관(CA)에서 인증서를 얻는 방법에 대해 알아봅시다. 안전하다고 느껴진다면 제공업체에서 제공하는 인증서를 선택해보세요.

<div class="content-ad"></div>

## Letsencrypt에서 SSL 인증서 설치하기

이 과정에서는 서버가 이미 기능적이고 인터넷에서 접근 가능해야 합니다.

보안상의 이유로 Letsencrypt를 사용할 것입니다(도메인 제공업체의 인증서가 손상됐을 지 모르기 때문에). 우리는 우리가 "신뢰할 수 없는" 인증서를 사용한다고 웹 브라우저를 달래기 위해 CA가 필요합니다. 저는 그것이 큰 헛소리라고 생각하고, 사실로 인해 상황을 더 복잡하게 만드는 것 같아요.

## 자체 서명 인증서는 정말로 안전할 수 있어요

<div class="content-ad"></div>

"신뢰할 수없는 인증서의 개념에는 많은 결함이 있다는 것을 고려하는 것은 가치가 있습니다. 실제로, 저는 위에서 설명한대로 훼손된 신뢰할 수 있는 인증서를 가질 수 있으며 그 반대도 가능합니다. 그러나 사이버 보안은 돈이 관련될 때 항상 의미가 있는 것은 아니죠…

## Let'sencrypt에서 민주적 인증서 요청하기

솔직히 말해서, 이 워크플로우는 정말 복잡하다고 생각합니다.

이 작업을 수행하려면 도메인의 소유권을 확인해야 합니다. 한 가지 방법은 HTTP 서버를 호스팅하는 것입니다. 배포 서버에 추가 소프트웨어를 설치하는 것을 원하지 않으므로 nginx를 사용합니다. 우리는 분명히 http-port가 필요하지 않습니다. 따라서 다음과 같이 합니다:"

<div class="content-ad"></div>

```js
    server {
        listen 80;
        server_name apis.lemariva.com;
        location ^~ /.well-known {
            root /etc/nginx/ssl/bot;
        }
        location / {
            return 301 https://$host$request_uri;
        }
    }
```

- \*주의: 확인 후에 이 연결을 닫으세요\*\*

데몬이 실행 중인 경우에만 사용하고 서비스가 인증서를 갱신할 때 사용하지 않는 두 개의 백업된 nginx 설정 파일을 보유하는 방식으로 이 작업을 수행할 수 있습니다.

Certbot로 돌아가 봅시다. Let's encrypt가 인증서를 수동으로 설치할 수 있도록 certbot을 제공합니다.

<div class="content-ad"></div>

snap은 권장하지 않습니다(사용하기 어렵다고 생각하기 때문에). 대신 podman에서 certbot을 사용할 거에요(certbot을 podman에서 사용하는 방법이 문서화되지 않았으니 제가 문서로 만들었어요).

```js
sudo apt install podman
```

그리고 podman으로 실행해봐요

```js
sudo mkdir -p /etc/letsencrypt
sudo mkdir -p /var/lib/letsencrypt
sudo podman run -it --rm --name certbot \
            -v "/etc/letsencrypt:/etc/letsencrypt" \
            -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
            docker.io/certbot/certbot certonly
```

<div class="content-ad"></div>

그러나 그 방법이 실패한다면 수동 모드를 시도해 볼 수 있어요.

```js
sudo apt install certbot
sudo certbot certonly --manual
```

그 후 안내에 따라 진행해주세요.

반드시 매 90일마다 해당 작업을 수행하도록 하세요. 더 나은 방법은 프로시저를 자동화하는 것이겠죠.

<div class="content-ad"></div>

다른 방법은 DNS를 통해 확인하는 것입니다. 하지만, 이 방법을 사용하려면 서드 파티 패키지가 필요하며, 개발 프로세스 초기에 가능한 한 많은 위험을 줄이기 위해 서버를 가능한 깨끗하게 유지하려 합니다.

## 인증서 자동 갱신을 위한 certbot.service 설정

프로시저를 자동화하기 위해 데몬을 설정하겠습니다. 이 시리즈를 따라오셨다면, 다음 단계는 이미 표준 작업 목록에 포함되어 있어야 합니다.

```js
sudo nano /etc/systemd/system/cerbot.service
```

<div class="content-ad"></div>

그리고 아래의 작업을 추가해 주세요.

```sh
#!/bin/sh

certbot renew
systemctl restart nginx
```

그리고 아래의 명령어를 실행해 주세요.

```sh
sudo systemctl enable certbot.service && sudo systemctl start certbot.service && sudo systemctl status cerbot.service
```

<div class="content-ad"></div>

# 결론

오케이, 와아 휴😅. 정말 많았지요. 여러분이 실제로 돈을 내고 사는 소프트웨어 제품들을 만들었습니다💪. 그러나 괜찮아요 — 돈도 부족하고 시간도 부족해서 우리 일이죠. 우리는 비양식되고 비획기적인 소프트웨어 도구들을 사용할 시간이나 돈이 충분하지 않다는 거죠.

## 혜택:

세 명으로 이루어진 회사를 운영한다고 가정했을 때, 백엔드 작업 및 내부 웹 애플리케이션용으로 8코어 미니 서버를 350달러에 구입했습니다. 라즈베리 파이는 약 130달러했어요.

<div class="content-ad"></div>

저는 단순한 혜택 계산을 하고 싶을 뿐입니다: 매년 사용자 당 $252을 지불하면 코드 호스팅과 CI를 위한 Github 통합($756)을 이용할 수 있습니다. 8 코어 머신에서 백엔드로 업그레이드 가능한 웹사이트 호스팅은 AWS에서 $867.90 입니다. $169/y에 웹플로우 호스팅도 제공됩니다. SSL 인증서 구매시 약 $10/y의 비용이 발생합니다. 해당 설정으로 연간 약 $666의 비용을 절안할 수 있습니다(이 숫자는 우연히 나온 숫자에 불과합니다). 물론 전기비는 포함되지 않았습니다. 이 비용으로 한 달 동안 주당 10시간씩 일하는 직원을 고용할 수 있습니다. 지수적으로 증가하기 때문에, 새로운 웹사이트를 추가하는 데 거의 비용이 들지 않으며, GitHub 수준의 연간 요금을 내야하는 내부 및 외부 서비스를 호스팅할 수도 있습니다.

# 도움이 되는 기사

https://easyengine.io/tutorials/nginx/fail2ban/
