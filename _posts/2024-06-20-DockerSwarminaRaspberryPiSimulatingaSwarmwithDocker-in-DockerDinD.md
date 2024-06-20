---
title: "라즈베리 파이에서 도커 스웜 도커 인 도커DinD로 스웜 시뮬레이션하기"
description: ""
coverImage: "/assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_0.png"
date: 2024-06-20 17:31
ogImage: 
  url: /assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_0.png
tag: Tech
originalTitle: "Docker Swarm in a Raspberry Pi: Simulating a Swarm with Docker-in-Docker (DinD)"
link: "https://medium.com/@josejgp/docker-swarm-in-a-raspberry-pi-simulating-a-swarm-with-docker-in-docker-dind-04957770f8ca"
---


![이미지](/assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_0.png)

이 프로젝트에서는 Raspberry Pi 4B 4Gb Raspberry Pi OS Lite 64비트 및 도커를 사용하여 놀고 있었어요. 가이드가 아닌 과정 보고서이니 먼저 전체 내용을 읽어보시는 걸 추천해요.

## 1) Raspberry Pi OS Lite 64비트에 도커 설치하기

## 2) 매니저 설정하기

<div class="content-ad"></div>

## 3) 작업자를 배포하세요.

## 4) Docker Swarm을 Docker-in-Docker (DinD)로 시뮬레이션하는 단계

## 1) Raspberry Pi OS Lite 64비트에 Docker 설치하기

```js
sudo apt-get update && sudo apt-get upgrade -y
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
# 도커의 공식 GPG 키 추가:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# Apt 소스에 저장소 추가:
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world
```

<div class="content-ad"></div>

## 매니저 설정하기

다음 단계에서는 tmux를 사용하는 것이 좋습니다.

![이미지](/assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_1.png)

저는 호스트 머신을 위해 하나의 큰 수평 창을 사용했고, 워커들을 위해 두 개의 수직 창을 사용했어요.

<div class="content-ad"></div>

이 명령어 중 하나를 사용하여 IP를 확인해보세요.

```js
docker swarm init --advertise-addr <매니저-IP>
```

```js
docker swarm init --advertise-addr 192.168.99.100
스웜이 초기화되었습니다: 현재 노드 (dxn1zf6l61qsb1josjja83ngz)가 이제 매니저가 되었습니다.
```

```js
이 스웜에 워커를 추가하려면 다음 명령어를 실행하세요:
    docker swarm join \
    --token SWMTKN-1-49nj1cmql0jkz5s954yi3oex3nedyz0fb0xx14ie39trti4wxv-8vxv8rssmk743ojnwacrr2e7c \
    192.168.99.100:2377
매니저를 추가하려면 'docker swarm join-token manager'를 실행하고 안내를 따르세요.
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_2.png)

## 워커들을 배포하세요.

먼저 워커들을 위한 OS 이미지가 필요합니다:

```js
sudo docker pull alpine
```

<div class="content-ad"></div>

안녕하세요! 아치를 사용해보려고 했는데 아치64용 빌드가 없었어요.

(참고: 알파인 이미지는 종종 /bin/bash 대신에 /bin/sh를 사용합니다.)

![이미지](/assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_3.png)

운영 체제 이미지를 받은 후에 워커들을 배포해야 해요. 여기서 두 가지 상황이 있어요. `sudo docker run alpine`으로 컨테이너를 만드는 경우 랜덤한 이름이 생성되므로, 이름을 얻으려면 `docker ps -a`를 사용하고, 그 후 새 이름으로 변경해야 해요.

<div class="content-ad"></div>


```js
sudo docker rename helloworld.1.6mwtenk3wdxik9kpposg6hd3j Worker1
sudo docker start Worker1
sudo docker exec -it Worker1 /bin/sh
```

두 번째 시나리오에서는 사용자 정의 이름으로 컨테이너를 직접 설정했습니다:

```js
sudo docker run -itd --name worker2 alpine /bin/sh
sudo docker exec -it worker2 /bin/sh
```

이 방법은 VM이나 클러스터를 사용하는 경우에 적합하지만, 제 경우에는 도커 내부에서 도커를 실행해야 합니다:


<div class="content-ad"></div>

## 도커 인 디 도커 (DinD)를 사용하여 도커 스웜 시뮬레이션하기

도커 스웜을 설정하려면 워커 노드는 도커 컨테이너가 아닌 물리적 또는 가상 머신이어야 합니다. 도커 스웜은 각 호스트 머신(물리 서버, VM 또는 클라우드 인스턴스)의 도커 데몬이 통신하여 스웜을 형성하는 방식으로 작동합니다. 컨테이너 자체는 도커 데몬을 실행하지 않으며 직접 스웜에 참여할 수 없습니다.

그러나 도커 스웜 환경을 도커 컨테이너를 사용하여 단일 호스트에서 시뮬레이션하려고 합니다. 따라서 도커 인 디 도커 (DinD)를 사용할 것입니다. 이는 도커 컨테이너 내부에서 도커를 실행하는 것을 의미합니다.

```js
#호스트 머신
sudo docker pull docker:19.03-dind
docker swarm init --advertise-addr Your_IP #만약 이전에 수행했다면 다시 수행할 필요가 없습니다

#워커 추가 토큰을 잊어버린 경우 다음을 사용하세요:
sudo docker swarm join-token worker

#워커1 창:
sudo docker run -d --privileged --name worker1 docker:19.03-dind
sudo docker exec -it worker1 /bin/sh
docker swarm join --token YOUR_TOKEN YOUR_IP_PORT

#워커2 창:
sudo docker run -d --privileged --name worker2 docker:19.03-dind
sudo docker exec -it worker2 /bin/sh
docker swarm join --token YOUR_TOKEN YOUR_IP_PORT
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-DockerSwarminaRaspberryPiSimulatingaSwarmwithDocker-in-DockerDinD_4.png" />

이제 중첩된 도커 컨테이너가 작동 중이지만 몇 번의 시도 끝에 각 워커에 작업을 제대로 배포할 수 없었습니다.

이것은 실험으로써 도커 명령어와 스왐 관리 방법을 배우는 흥미로운 방법이지만, 경험을 통해 굴러간 뒤에는, 하나의 라즈베리파이에 도커를 중첩하는 대신 세 개 이상의 라즈베리파이를 사용하는 것을 권장드립니다. 그러나 DinD는 다른 많은 작업에 유용할 수 있으며 하나의 싱글 보드 컴퓨터에서 도커를 사용하여 여러 개의 운영 체제를 실행할 수 있다는 것은 정말 놀라운 일이죠.

# 참고사항:

<div class="content-ad"></div>

아래는 Alpine 컨테이너에 neofetch를 설치하는 방법입니다. Alpine의 커뮤니티 저장소를 활성화해야 합니다.

```sh
echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
apk update
apk add neofetch
```

기존 컨테이너를 중지하고 제거하는 방법은 다음과 같습니다.

```sh
sudo docker ps -a
sudo docker stop worker1 worker2
sudo docker rm worker1 worker2
```

<div class="content-ad"></div>

가상 머신/머신에 작업자를 배포하는 방법 안내서

https://docs.docker.com/engine/swarm/swarm-tutorial/