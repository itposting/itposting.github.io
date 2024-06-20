---
title: "리눅스에서 도커를 사용하여 키바나 설정하기 단계별 안내"
description: ""
coverImage: "/assets/img/2024-06-20-SettingUpKibanaonLinuxUsingDockerAStep-by-StepGuide_0.png"
date: 2024-06-20 15:20
ogImage: 
  url: /assets/img/2024-06-20-SettingUpKibanaonLinuxUsingDockerAStep-by-StepGuide_0.png
tag: Tech
originalTitle: "Setting Up Kibana on Linux Using Docker: A Step-by-Step Guide"
link: "https://medium.com/@rahulbpawar123/setting-up-kibana-on-linux-using-docker-a-step-by-step-guide-8b499e43975a"
---


![이미지](/assets/img/2024-06-20-SettingUpKibanaonLinuxUsingDockerAStep-by-StepGuide_0.png)

Kibana은 Elasticsearch 데이터를 탐색하고 시각화할 수 있는 강력한 시각화 도구입니다. 이 안내서를 통해 Linux 시스템에서 Docker를 사용하여 Kibana를 설정하고 사용하는 방법을 안내해 드리겠습니다. 튜토리얼을 완료하면 Kibana가 실행되고 Elasticsearch 인스턴스에 연결되어 데이터 탐색 및 시각화에 준비될 것입니다.

## 필수 조건

시작하기 전에 다음 사항을 확인하세요:

<div class="content-ad"></div>

- Linux 시스템 (Ubuntu, CentOS 등)
- Docker가 설치되어 실행 중인 상태
- 이미 실행 중인 Elasticsearch 컨테이너

## 단계 1: Elasticsearch 버전 확인

호환성을 보장하기 위해 현재 실행 중인 Elasticsearch 버전을 알아야 합니다. 다음 명령어를 실행하여 확인할 수 있습니다:

```js
curl -X GET "localhost:9200"
```

<div class="content-ad"></div>

JSON 응답에서 version 필드를 찾아보세요. 예를 들어:

```js
{
  "name" : "elasticsearch-node",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "UUID",
  "version" : {
    "number" : "7.10.0",
    ...
  },
  ...
}
```

## 단계 2: Kibana 도커 이미지 다운로드

찾은 Elasticsearch 버전을 기반으로 해당하는 Kibana 도커 이미지를 다운로드하세요. 이 안내서에서는 버전이 7.10.0인 것으로 가정합니다.

<div class="content-ad"></div>

```js
sudo docker pull docker.elastic.co/kibana/kibana:7.10.0
```

## 단계 3: 키바나 실행하기

Elasticsearch가 실행 중이라면 이제 키바나 컨테이너를 실행하고 Elasticsearch 인스턴스에 연결할 수 있습니다. Elasticsearch 컨테이너의 이름이 elasticsearch이고 http://localhost:9200에서 접근 가능한 경우 다음 명령을 실행할 수 있습니다:

```js
sudo docker run -d --name kibana -p 5601:5601 --link elasticsearch:elasticsearch -e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 docker.elastic.co/kibana/kibana:7.10.0
```

<div class="content-ad"></div>

## 단계 4: 키바나에 접속하기

지금 키바나가 실행 중이며 웹 브라우저를 통해 접속할 수 있습니다. 브라우저를 열고 다음 주소로 이동하세요:

```js
http://localhost:5601
```

![이미지](/assets/img/2024-06-20-SettingUpKibanaonLinuxUsingDockerAStep-by-StepGuide_1.png)

<div class="content-ad"></div>

Kibana 인터페이스가 준비된 것을 확인할 수 있을 거예요.

이 글을 즐겁게 읽으셨다면, 공유하고 팔로우하며 더 많은 업데이트를 받기 위해 이메일 구독도 잊지 마세요!