---
title: "Docker로 Redis 클러스터 설정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-RedisClusterusingDocker_0.png"
date: 2024-06-23 15:44
ogImage: 
  url: /assets/img/2024-06-23-RedisClusterusingDocker_0.png
tag: Tech
originalTitle: "Redis Cluster using Docker"
link: "https://medium.com/@ahmettuncertr/redis-cluster-using-docker-1c8458a93d4b"
---



![이미지](/assets/img/2024-06-23-RedisClusterusingDocker_0.png)

우리는 특히 윈도우에서 도커를 사용하여 Redis 클러스터를 만드는 방법에 대해 이야기할 것입니다.

6개 노드(3개 마스터 + 3개 레플리카)로 Redis 클러스터를 생성할 것이며, Redis가 어떤 노드가 마스터인지 레플리카인지를 결정할 것입니다.

자세한 내용에 대해 파고들기 전에 몇 가지 제약사항을 알아야 합니다;


<div class="content-ad"></div>

- Redis Cluster 및 Docker

2. Docker 호스트 네트워크 드라이버

Windows에서 이러한 제한 사항을 고려할 때, 모든 노드 앞에 TCP 프록시를 설정하여 클러스터를 구성할 수 있습니다. 노드로의 모든 통신은 TCP 프록시를 통해 이루어질 것입니다. 이 예시에서는 HAProxy를 선택했습니다.

이제 설정으로 넘어갈 수 있습니다. 3개의 파일이 준비되어 있습니다;

<div class="content-ad"></div>

- docker-compose.yaml
- redis.sh
- haproxy.cfg

이 파일들을 가지고 명령어를 사용하여 모든 클러스터, 프록시 및 UI를 실행할 수 있어요;

```js
docker compose up
```

# docker-compose.yaml

<div class="content-ad"></div>

```js
서비스 : 
  redis-node-1 : 
    이미지 : redis:7.2.3
    명령 : ["/tmp/redis.sh", "10.11.12.13", "7001"]
    볼륨 : 
      - ./redis.sh:/tmp/redis.sh
  redis-node-2 : 
    이미지 : redis:7.2.3
    명령 : ["/tmp/redis.sh", "10.11.12.13", "7002"]
    볼륨 : 
      - ./redis.sh:/tmp/redis.sh
  redis-node-3 : 
    이미지 : redis:7.2.3
    명령 : ["/tmp/redis.sh", "10.11.12.13", "7003"]
    볼륨 : 
      - ./redis.sh:/tmp/redis.sh
  redis-node-4 : 
    이미지 : redis:7.2.3
    명령 : ["/tmp/redis.sh", "10.11.12.13", "7004"]
    볼륨 : 
      - ./redis.sh:/tmp/redis.sh
  redis-node-5 : 
    이미지 : redis:7.2.3
    명령 : ["/tmp/redis.sh", "10.11.12.13", "7005"]
    볼륨 : 
      - ./redis.sh:/tmp/redis.sh
  redis-node-6 : 
    이미지 : redis:7.2.3
    명령 : ["/tmp/redis.sh", "10.11.12.13", "7006"]
    볼륨 : 
      - ./redis.sh:/tmp/redis.sh
  redis-cluster-creator : 
    이미지 : redis:7.2.3
    명령 : redis-cli -a 'SUPER_SECRET_PASSWORD' --cluster create 10.11.12.13:7001 10.11.12.13:7002 10.11.12.13:7003 10.11.12.13:7004 10.11.12.13:7005 10.11.12.13:7006 --cluster-replicas 1 --cluster-yes
    depends_on : 
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
      - redis-node-6
      - redis-proxy
  redis-proxy : 
    이미지 : haproxytech/haproxy-alpine:2.4
    볼륨 : 
      - ./haproxy:/usr/local/etc/haproxy:ro
    포트 : 
      - 8404:8404
      - 7001-7006:9001-9006
      - 7101-7106:9101-9106
    depends_on : 
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
      - redis-node-6
  redis-insight : 
    container_name : redis-insight
    이미지 : redislabs/redisinsight:1.14.0
    포트 : 
      - 8001:8001
    depends_on : 
      - redis-proxy
```

다음을 참고하세요:
- 6개의 서버 노드
- 1개의 클러스터 생성 노드. 이 컨테이너의 상태는 클러스터 생성 후에 "중지"되어야 합니다. (원한다면 어떤 컨테이너로 들어가서 클러스터 명령을 실행할 수 있습니다.)
- TCP 프록시
- UI (Redis Insight)

10.11.12.13은 로컬 머신의 IP입니다 (사실상 TCP 프록시의 IP). 이를 변경해주세요 (예를 들어 PC 이름으로 변경할 수 있습니다).

<div class="content-ad"></div>

# redis.sh

각 노드마다 별도의 redis.conf 파일을 만드는 대신, 주어진 매개변수에 따라 redis.conf 파일을 생성하는 sh 파일을 만들었습니다. 이 파일을 사용하여 서버를 시작합니다. 이는 데모에 더 유연합니다.

```js
ANNOUNCE_IP=$1
ANNOUNCE_PORT=$(expr $2)
ANNOUNCE_BUS_PORT=$(expr $ANNOUNCE_PORT + 100)

CONF_FILE="/tmp/redis.conf"

# redis.conf 파일 생성
echo "port 6379
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
loglevel debug
requirepass SUPER_SECRET_PASSWORD
masterauth SUPER_SECRET_PASSWORD
protected-mode no
cluster-announce-ip $ANNOUNCE_IP
cluster-announce-port $ANNOUNCE_PORT
cluster-announce-bus-port $ANNOUNCE_BUS_PORT
" >> $CONF_FILE

# 서버 시작
redis-server $CONF_FILE
```

각 Redis 서버는 포트 6379에서 실행되지만 클러스터 알림 IP 및 포트는 다릅니다.

<div class="content-ad"></div>

# haproxy.cfg

```js
global
  stats socket /var/run/api.sock user haproxy group haproxy mode 660 level admin expose-fd listeners
  log stdout format raw local0 info

defaults
  mode tcp
  timeout client 600s
  timeout connect 5s
  timeout server 600s
  timeout http-request 10s
  log global

frontend stats
  mode http
  bind *:8404
  stats enable
  stats uri /stats
  stats refresh 10s
  stats admin if LOCALHOST

# frontend
frontend redisfe
  bind :9001-9006
  bind :9101-9106
  use_backend redisbe1 if { dst_port 9001 }
  use_backend redisbe2 if { dst_port 9002 }
  use_backend redisbe3 if { dst_port 9003 }
  use_backend redisbe4 if { dst_port 9004 }
  use_backend redisbe5 if { dst_port 9005 }
  use_backend redisbe6 if { dst_port 9006 }
  use_backend redisbusbe1 if { dst_port 9101 }
  use_backend redisbusbe2 if { dst_port 9102 }
  use_backend redisbusbe3 if { dst_port 9103 }
  use_backend redisbusbe4 if { dst_port 9104 }
  use_backend redisbusbe5 if { dst_port 9105 }
  use_backend redisbusbe6 if { dst_port 9106 }

# Server 1
backend redisbe1
  server be1 redis-node-1:6379 check

backend redisbusbe1
  server busbe1 redis-node-1:16379 check

# Server 2
backend redisbe2
  server be2 redis-node-2:6379 check

backend redisbusbe2
  server busbe2 redis-node-2:16379 check

# Server 3
backend redisbe3
  server be3 redis-node-3:6379 check

backend redisbusbe3
  server busbe3 redis-node-3:16379 check

# Server 4
backend redisbe4
  server be4 redis-node-4:6379 check

backend redisbusbe4
  server busbe4 redis-node-4:16379 check

# Server 5
backend redisbe5
  server be5 redis-node-5:6379 check

backend redisbusbe5
  server busbe5 redis-node-5:16379 check

# Server 6
backend redisbe6
  server be6 redis-node-6:6379 check

backend redisbusbe6
  server busbe6 redis-node-6:16379 check
```

HAProxy는 클라이언트 접근을 위해 9001-9006 포트를 수신하며(클라이언트-서버 간), 서버 간 접근을 위해 9101-9106 포트를 수신합니다. HAProxy 통계 정보는 http://localhost:8404/stats에서 확인할 수 있습니다.

접근 순서:

<div class="content-ad"></div>

- client =` haproxy-container:700x =` haproxy:900x =` redis-node-x:6379
- redis-node-* =` haproxy-container:710x =` haproxy:910x =` redis-node-x:16379

# Redis Insight

레디스 인사이트는 레디스를 위한 정말 좋은 UI입니다. 이 설정에서 http://localhost:8001/에서 액세스할 수 있습니다.