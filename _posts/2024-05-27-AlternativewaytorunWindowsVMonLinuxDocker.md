---
title: "리눅스에서 Windows 가상 머신Docker을 실행하는 대안적인 방법"
description: ""
coverImage: "/assets/img/2024-05-27-AlternativewaytorunWindowsVMonLinuxDocker_0.png"
date: 2024-05-27 12:15
ogImage: 
  url: /assets/img/2024-05-27-AlternativewaytorunWindowsVMonLinuxDocker_0.png
tag: Tech
originalTitle: "Alternative way to run Windows VM on Linux (Docker)"
link: "https://medium.com/@elnurbda/alternative-way-to-run-windows-vm-on-linux-docker-6d9828b3586c"
---


리눅스 사용자로서 주로 윈도우용 소프트웨어를 실행하거나 다양한 윈도우 전용 애플리케이션을 테스트해야 하는 경우가 많이 있어요.

안타깝게도 VMware와 VirtualBox를 사용해 윈도우 가상 머신을 실행하는 것이 이상적이지 않다고 느꼈습니다. 제 노트북에서 이러한 애플리케이션을 사용할 때 성능이 꽤 느린 것을 경험했는데, 부드러운 경험을 보장하기에 필요한 자원이 부족했거든요. 그래서 리눅스에서 윈도우를 실행하기 위한 대안적인 방법을 찾기 시작했습니다.

# 해결책

그래서 발견한 해결책을 소개하려고 해요: 도커(Docker)에서 윈도우를 실행하는 방법이 바로 그것이에요.

<div class="content-ad"></div>

## 도커

도커는 컨테이너화 기술을 사용하여 애플리케이션을 격리된 환경인 컨테이너에서 실행하는 플랫폼입니다. 전통적인 가상 머신과 달리 도커 컨테이너는 호스트 시스템의 커널을 공유하므로 무게가 가볍고 효율적이며 최소한의 오버헤드로 애플리케이션을 실행할 수 있습니다. 시스템에 설치하려면:

```js
# Debian / Ubuntu
sudo apt install docker.io
# 저는 아치를 사용합니다
yay -S docker
# 다른 배포판의 경우, 다음 링크를 확인하세요
# https://docs.docker.com/engine/install/
```

그리고 다음 이미지를 사용할 것입니다:

<div class="content-ad"></div>

- https://hub.docker.com/r/dockurr/windows

도커 컨테이너 내에서 실행되는 Windows!

## Windows 설치

docker-compose.yml이라는 파일을 만든 다음 (선택 사항으로) Windows 이미지 파일을 저장할 storage 폴더를 만들고 호스트 및 가상 머신간에 공유되는 폴더를 위한 shared 폴더를 만듭니다.

<div class="content-ad"></div>

다음으로, docker-compose.yml을 수정해야 합니다. 제 구성은 아래와 같습니다:

```js
services:
  windows:
    image: dockurr/windows
    container_name: windows
    environment:
      VERSION: "win10" # 실행할 Windows 버전을 지정합니다
      DISK_SIZE: "25G" # 선택 사항입니다. 할당할 디스크 크기를 지정할 수 있습니다
      RAM_SIZE: "3G" # RAM도 마찬가지로 지정할 수 있습니다
      CPU_CORES: "2" # CPU 코어도 지정 가능합니다
    devices:
      - /dev/kvm # KVM이 있을 경우
    volumes:
      - ./storage:/storage # 윈도우 이미지는 이 폴더에 저장됩니다 (호스트 머신과 컨테이너 모두)
      - ./shared:/shared # 공유 폴더도 동일합니다
    cap_add:
      - NET_ADMIN # 컨테이너에 네트워크 관련 작업을 위한 관리자 권한을 부여합니다
    ports:
      - 8006:8006 # 웹 인터페이스
      - 3389:3389/tcp # 원격 데스크톱 연결 (RDP)
      - 3389:3389/udp
    stop_grace_period: 2m
```

다음 명령어로 실행해 주세요:

```js
docker compose up -d
```

<div class="content-ad"></div>

( 이 테이블 태그를 Markdown 형식으로 변경하세요. )

개발자가 되신 것을 축하드립니다! 여기서는 한국어 번역을 지원해 드립니다.

<div class="content-ad"></div>

웹에서 머신을 사용하거나 더 선호되는 RDP로 연결할 수 있습니다. 도커로 머신의 IP를 가져오려면 도커 inspect 47bb78f908a0 | grep IPAddress를 사용하시면 됩니다.

![이미지](/assets/img/2024-05-27-AlternativewaytorunWindowsVMonLinuxDocker_0.png)

저는 xfreerdp 도구를 사용하여 RDP를 통해 연결할 것입니다. 사용자 이름은 docker이며, 아래 명령어를 사용하세요:

```js
xfreerdp /u:docker /v:172.18.0.2 /dynamic-resolution
```

<div class="content-ad"></div>

여기, 도커 컨테이너에서 Windows를 실행하는 법입니다:

![Image](/assets/img/2024-05-27-AlternativewaytorunWindowsVMonLinuxDocker_1.png)

공유 폴더는 \\host.lan 입니다.

# 결론

<div class="content-ad"></div>

마지막으로, 다른 구성을 위한 도커 이미지의 설명서를 확인하는 것을 제안합니다. 또한, Windows를 시작 및 중지하는 두 개의 스크립트를 포함하는 https://github.com/ElnurBDa/win10dockerconfig 레포지토리를 확인해보세요. 이를 키보드 단축키에 바인딩할 수 있습니다.

읽어 주셔서 감사합니다!! Linux에서 Windows를 실행하는 다른 대안이 있다면 댓글로 알려주세요 :)