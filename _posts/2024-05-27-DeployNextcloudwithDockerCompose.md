---
title: "도커 컴포즈로 Nextcloud를 배포하기"
description: ""
coverImage: "/assets/img/2024-05-27-DeployNextcloudwithDockerCompose_0.png"
date: 2024-05-27 13:46
ogImage: 
  url: /assets/img/2024-05-27-DeployNextcloudwithDockerCompose_0.png
tag: Tech
originalTitle: "Deploy Nextcloud with Docker Compose"
link: "https://medium.com/@chrisgrime/deploy-nextcloud-with-docker-compose-935a76a5eb78"
---


DIY, 실험, 그리고 학습을 즐기며, Google Drive와 One Drive를 대체하기 위해 Nextcloud 서버를 설정했어요. 몇 년 동안 제 Nextcloud 인스턴스는 백업된 파일, 연락처, 캘린더, 노트 등이 모두 모여 있는 집이 되었고, Collabora 덕분에 서버에는 사무실 스위트도 갖췄네요.

Nextcloud는 여러 서비스에 대한 멋진 오픈 소스 대안일 수 있어요.

좋은 점이든 나쁜 점이든, 저는 도커 컨테이너를 사용해 홈 서버에 Nextcloud를 배포하기로 결정했어요. 도커 경험을 쌓고자 하거나 Nextcloud 배포를 위한 도커 컴포즈 파일을 설정하는 방법을 찾고 있다면, 여기가 바로 옳은 장소에요.

다음은 docker-compose.yml입니다.

<div class="content-ad"></div>

```yaml
---
version: '3'

services:
  nextcloud:
    image: nextcloud
    container_name: nextcloud
    restart: unless-stopped
    networks: 
      - cloud
    depends_on:
      - nextclouddb
      - redis
    ports:
      - 8081:80
    volumes:
      - ./html:/var/www/html
      - ./custom_apps:/var/www/html/custom_apps
      - ./config:/var/www/html/config
      - ./data:/var/www/html/data
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=dbpassword
      - MYSQL_HOST=nextclouddb
      - REDIS_HOST=redis

  nextclouddb:
    image: mariadb
    container_name: nextcloud-db
    restart: unless-stopped
    command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW
    networks: 
      - cloud
    volumes:
      - ./nextclouddb:/var/lib/mysql
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
      - MYSQL_RANDOM_ROOT_PASSWORD=true
      - MYSQL_PASSWORD=dbpassword
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      
  collabora:
    image: collabora/code
    container_name: collabora
    restart: unless-stopped
    networks: 
      - cloud
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
      - password=password
      - username=nextcloud
      - domain=example.com
      - extra_params=--o:ssl.enable=true
    ports:
      - 9980:9980

  redis:
    image: redis:alpine
    container_name: redis
    volumes:
      - ./redis:/data  
    networks: 
      - cloud
  
  nginx-proxy:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: nginx-proxy
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt

networks:
  cloud:
    name: cloud
    driver: bridge
```

알겠어요. 이제 한 번 살펴볼게요.

이 Docker Compose 파일은 5개의 컨테이너를 배포합니다. 그들은 다음과 같습니다:

- Nextcloud
- Nextcloud에 필요한 MySQL 데이터베이스
- Collabora - 구글 문서와 유사한 멋진 오픈 소스 오피스 스위트입니다. Collabora Office에는 모바일 앱도 있습니다.
- Redis - 메모리 캐싱입니다. 중요한 파일을 다음 클라우드에 의존할 계획이라면 Redis를 설정하는 것을 강력히 권장합니다.
- Nginx Proxy Manager - 서버로 들어오는 요청을 처리하는 리버스 프록시 매니저입니다.


<div class="content-ad"></div>

## 도커 컴포즈

각 줄이 하는 일에 대한 간단한 설명.

Nextcloud:

```js
nextcloud:
    image: nextcloud # 사용할 이미지입니다. 공식 Nextcloud 도커 이미지
    container_name: nextcloud # 컨테이너의 이름입니다. 식별하는 데 도움이 됩니다
    restart: unless-stopped # 컨테이너가 충돌하는 등의 문제가 발생하면 다시 시작되도록 설정
    networks: # 모든 컨테이너를 "cloud" 네트워크를 통해 연결합니다
      - cloud
    depends_on: # Nextcloud를 시작하기 전에 데이터베이스와 레디스 컨테이너가 준비될 때까지 기다립니다
      - nextclouddb 
      - redis
    ports: # 서버에 여러 웹 서비스가 있다면 포트를 변경해야 합니다. 저는 Nextcloud를 포트 80에서 8081로 연결하고 있습니다
      - 8081:80
    volumes: # 이 부분은 중요합니다. 컨테이너 내의 파일 디렉토리를 실제 컴퓨터의 디렉토리에 매핑합니다
      - ./html:/var/www/html # 컨테이너 내의 /var/www/html 디렉토리를 docker-compose.yml 파일이 있는 폴더 내의 html 폴더에 매핑합니다
      - ./custom_apps:/var/www/html/custom_apps # 이러한 볼륨을 사용하면 컨테이너 내의 파일에 쉽게 액세스할 수 있습니다
      - ./config:/var/www/html/config
      - ./data:/var/www/html/data
    environment: # 환경 변수 설정
      - PUID=1000 # 사용자 ID입니다. 아마도 둘 다 1000이어야 합니다. 이를 잘못 설정하면 파일 권한 문제가 발생할 수 있습니다
      - PGID=1000 # 사용자 ID를 설정하세요.
      - TZ=America/Los_Angeles # 사용하는 시간대를 설정하세요
      - MYSQL_DATABASE=nextcloud # 다음 섹션에서 설정할 데이터베이스 정보입니다
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=dbpassword
      - MYSQL_HOST=nextclouddb
      - REDIS_HOST=redis # 사용할 Redis 컨테이너
```

<div class="content-ad"></div>

Nextcloud 데이터베이스:

```yaml
nextclouddb:
    image: mariadb # 공식 mariadb 이미지
    container_name: nextcloud-db 
    restart: unless-stopped 
    command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW # 정말 기억이 나지 않아요. 알고 계시면 알려주세요.
    networks: 
      - cloud
    volumes:
      - ./nextclouddb:/var/lib/mysql
    environment:
      - PUID=1000 # 다른 컨테이너와 동일해야 함
      - PGID=1000
      - TZ=America/Los_Angeles
      - MYSQL_RANDOM_ROOT_PASSWORD=true
      - MYSQL_PASSWORD=dbpassword # Nextcloud 부분에 입력한 정보와 같아야 함
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
```

Collabora (선택 사항, 하지만 정말 멋짐):

```yaml
collabora:
    image: collabora/code:latest
    container_name: collabora
    restart: unless-stopped
    networks: 
      - cloud
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles # 다른 것과 동일해야 함
      - password=password 
      - username=nextcloud
      - domain=example.com # Nextcloud가 있는 도메인
      - extra_params=--o:ssl.enable=true # SSL을 사용하는 경우에 사용합니다. 꼭 사용해야 합니다.
    ports:
      - 9980:9980
```

<div class="content-ad"></div>

Redis (선택 사항이지만, 진지하게, 추가하세요. 파일 잠금 문제가 나타날 수 있으며 Redis가 이를 방지해줄 것입니다):

```js
redis:
    image: redis:alpine
    container_name: redis
    volumes:
      - ./redis:/data  
    networks: 
      - cloud
```

Nginx Proxy Manager:

```js
nginx-proxy:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: nginx-proxy
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

<div class="content-ad"></div>

Nginx Proxy Manager는 서버로 들어오는 트래픽을 Nextcloud로 전달하는 멋진 프로그램이에요. 새 호스트를 추가해보세요.

세부 정보 패널에 도메인 이름을 입력해주세요.

Scheme = http, Forward Hostname = 이용 중인 기기의 로컬 IP 주소(예: 192.168.1.35), 전달할 포트 = 80.

자산 캐시, 일반적인 공격 차단, 웹소켓 지원은 모두 켜두시는 게 좋아요.

<div class="content-ad"></div>

"맞춤 위치" 탭에서 caldav와 carddav를 활성화하여 캘린더와 연락처에 대한 원격 액세스를 허용할 예정입니다.

위치 1:

- 위치 = /.well-known/caldav
- 스킴 = html
- 전방 호스트 이름 = `로컬 IP`/ remote.php/dav
- 전방 포트 80

위치 2:

<div class="content-ad"></div>

- 위치 = /.well-known/carddav
- scheme = html
- 전달 호스트 이름 = `로컬 IP`/ remote.php/dav
- 전달 포트 80

## 추가 구성

이제 Nextcloud를 사용자 정의 도메인과 함께 사용하도록 설정하는 경우 config.php 파일을 열어 신뢰할 수있는 도메인을 사용자의 도메인으로 변경해야합니다.

Nextcloud를 네트워크에서 액세스하려는 경우 Nextcloud의 로컬 IP 주소를 추가하는 것이 유용할 수 있습니다.

<div class="content-ad"></div>

```js
'trusted_domains' => 
array (
 0 => 'example.com',
 1 => '192.168.1.12:8081',
),
'overwritehost' => 'example.com',
'overwriteprotocol' => 'https',
```

Niginx Proxy Manager이 설정되어 있으므로 config.php 파일에 다음을 추가해야 합니다:

```js
'default_phone_region' => 'US',
'trustedproxies' => 
array (
 0 => 'NginxProxyManager',
 1 => '192.168.0.145',
),
```

일부 경고를 해결하려면 다음을 수행해야 합니다:
  

<div class="content-ad"></div>

```js
 'default_phone_region' => 'US', 
```

메일 알림을 설정하려면 구성 파일에 다음을 추가해야 합니다. 필요한 값은 이메일 공급업체에서 얻어야 합니다.

```js
 'mail_from_address' => 'user', # 이메일 사용자를 입력하세요
 'mail_smtpmode' => 'smtp',
 'mail_sendmailmode' => 'smtp',
 'mail_domain' => 'example.com', # 귀하의 이메일 도메인
 'mail_smtphost' => 'smtp.example.com',
 'mail_smtpport' => '465',
 'mail_smtpauth' => 1,
 'mail_smtpsecure' => 'ssl',
 'mail_smtpname' => 'user@example.com',
 'mail_smtppassword' => '비밀번호',
```

## 컨테이너 실행하기


<div class="content-ad"></div>

```yaml
docker-compose up -d
```

축하합니다! Docker 컨테이너와 docker compose를 사용하여 Nextcloud를 설정했습니다! 궁금한 점이 있으면 언제든지 물어보세요.

## 잠재적인 문제점

- 502 Gateway 오류가 발생하면 호스트 서버의 도메인에 대한 브라우저 쿠키를 지워보세요. 대부분의 경우에 도움이 됩니다.
- 정기적으로 Docker 이미지를 업데이트해야 합니다. Docker에서는 Nextcloud의 버전을 한 번에 건너뛸 수 없습니다. 예를 들어, 현재 버전이 24이고 가장 최신 버전이 26인 경우, 바로 26으로 업데이트하지 마세요. 저는 이를 까다로운 방법으로 배웠습니다. 먼저 25로 업데이트하세요. 그래서 정기적으로 `docker-compose pull` 명령을 실행해 주세요.