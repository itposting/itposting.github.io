---
title: "macOS M1 M2 ARM64 CPU에서 Docker Desktop을 Podman으로 바꾸는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-SwitchingfromDockerDesktoptoPodmanonmacOSM1M2ARM64CPU_0.png"
date: 2024-06-23 15:31
ogImage: 
  url: /assets/img/2024-06-23-SwitchingfromDockerDesktoptoPodmanonmacOSM1M2ARM64CPU_0.png
tag: Tech
originalTitle: "Switching from Docker Desktop to Podman on macOS M1 M2 ARM64 CPU"
link: "https://medium.com/rahasak/switching-from-docker-desktop-to-podman-on-macos-m1-m2-arm64-cpu-7752c02453ec"
---


## 친절한 쿠버네티스 클러스터와 함께

![이미지](/assets/img/2024-06-23-SwitchingfromDockerDesktoptoPodmanonmacOSM1M2ARM64CPU_0.png)

# 배경

이전 글에서는 macOS에서 이전 AMD64 아키텍처 기반 머신에 Minikube와 Hyperkit을 사용하여 Docker Desktop을 대체하는 방법에 대해 논의했습니다. 그러나 ARM64 아키텍처 CPU를 사용하는 새로운 M1/M2 머신이 등장하면서 Hyperkit은 이러한 새로운 머신과 호환되지 않습니다. 이 문제를 해결하기 위해 macOS M1/M2 머신에서 Docker Desktop을 Podman으로 대체하고 Kind를 사용하여 쿠버네티스 로컬 클러스터를 생성했습니다.

<div class="content-ad"></div>

# macOS M1/M2 ARM64 아키텍처

macOS M1/M2는 최신 Apple 맥인토시 컴퓨터 라인으로, ARM64 아키텍처를 기반으로 합니다. ARM64 아키텍처는 컴퓨팅 세계에서 점차 인기를 끌고 있는 새로운 유형의 프로세서 아키텍처입니다. 대부분의 데스크톱 및 랩톱 컴퓨터에서 사용되는 전통적인 x86 아키텍처와 비교하면, ARM64 아키텍처는 저전력을 위해 설계되었으며 모바일 기기용으로 최적화되어 있습니다.

ARM64 아키텍처의 주요 장점 중 하나는 와트 당 성능 향상입니다. 이는 ARM64 아키텍처를 기반으로 한 컴퓨터가 더 적은 전력을 사용하면서도 유사하거나 더 나은 성능을 제공할 수 있음을 의미합니다. 이는 노트북의 배터리 수명 연장 및 데스크탑의 에너지 소비 감소로 이어질 수 있습니다. 또한, ARM64 아키텍처는 머신러닝과 같은 특정 작업을 위한 하드웨어 가속화와 같은 기능을 포함하고 있어, 이러한 작업 부하의 성능을 향상시킬 수 있습니다.

AMD64/x86 인텔 아키텍처와 비교하면, ARM64 아키텍처는 더 새롭고 확립되지 않은 아키텍처입니다. AMD64/x86은 많은 해 동안 주도적인 아키텍처이지만, ARM64는 특히 모바일 기기와 서버에서 더 많은 인기를 얻고 있습니다. 그러나 ARM64 아키텍처에 대한 더 많은 응용 프로그램과 소프트웨어의 최적화가 이루어지면, 앞으로 더 많은 ARM64 기반 컴퓨터를 볼 수 있을 것입니다. 성능 측면에서, ARM64 아키텍처는 특정 작업 부하에 대해 AMD64/x86 아키텍처와 비교 가능하거나 더 빠를 수 있지만, 이는 구체적인 사용 사례 및 소프트웨어 최적화에 따라 다를 수 있습니다. 최종적으로 두 아키텍처 모두 강점과 약점을 가지고 있으며, 그것들 사이의 선택은 사용자나 조직의 구체적인 요구 사항에 달려 있습니다.

<div class="content-ad"></div>

맥OS M1/M2 기기는 ARM64 아키텍처에서 실행되도록 특별히 설계되었으며, 이 아키텍처에 최적화된 소프트웨어와 도구가 필요하여 효율적으로 실행할 수 있습니다. x86 아키텍처에서 실행되도록 설계된 일부 소프트웨어는 macOS M1/M2 기기에서 제대로 작동하지 않을 수 있으므로, 개발자와 사용자는 호환성과 최적 성능을 보장하기 위해 ARM64 아키텍처용 도구와 소프트웨어를 사용해야 합니다.

# Docker Desktop

macOS에서 Docker Desktop은 Docker 컨테이너를 사용하여 애플리케이션을 쉽게 빌드, 테스트 및 배포할 수 있도록 합니다. 컨테이너, 이미지 및 네트워크를 관리하기 위한 간단하고 사용자 친화적인 인터페이스를 제공하며, 다양한 플랫폼 및 운영 체제에서 사용할 수 있습니다. ARM64 아키텍처 기반의 최신 macOS M1/M2 기기가 출시된 가운데, Docker는 ARM64 아키텍처에 최적화된 새로운 Docker Desktop 버전을 출시했습니다. 이 버전은 Apple의 Hypervisor.framework를 활용하여 가상화 환경에서 컨테이너를 실행하며, 이를 통해 Docker Desktop을 사용하는 개발자와 IT 전문가에게 매끄러운 경험을 제공합니다.

Docker Desktop은 컨테이너화에 강력한 도구를 제공하지만, 단점도 있습니다. Docker Desktop 사용의 주요 단점 중 하나는 백그라운드에서 실행되는 별도의 데몬 프로세스를 필요로 한다는 점인데, 이는 상당한 시스템 리소스를 소비할 수 있습니다. 또한, Docker Desktop은 일부 애플리케이션 및 운영 체제와 가끔 호환성 문제가 있어 사용자들에게 다운타임과 귀찮음을 초래할 수 있습니다. 게다가, 최근 Docker Desktop의 라이선스 요구사항 변경으로 많은 사용자가 대안을 찾고 있습니다. 결과적으로, Podman과 같은 대체 솔루션들이 이 기기에서 컨테이너화 요구를 충족하는 데 더 인기를 얻고 있습니다.

<div class="content-ad"></div>

# Podman

Podman은 빌드, 관리 및 실행을 위한 Docker의 대체제로 제공되는 인기 있는 컨테이너 관리 도구입니다. ARM64 아키텍처 기반의 새로운 macOS M1/M2 기계가 출시되면서, Podman은 컨테이너화 요구 사항에 대한 Docker Desktop의 대안으로 나타나고 있습니다.

Podman은 ARM64 아키텍처에 최적화되어 개발자와 IT 전문가들에게 뛰어난 경험을 제공합니다. Docker와 달리, Podman은 Linux 커널의 컨테이너화 기능을 사용하므로 별도의 백그라운드 데몬 프로세스가 실행되어야 하는 필요가 없습니다. 이는 성능 향상과 리소스 소비의 감소로 이어질 수 있습니다.

macOS M1/M2 기계에서 Podman을 사용하는 주요 이점 중 하나는 가상 머신을 사용하지 않아도 된다는 점입니다. 대신, Podman은 ARM64 아키텍처의 네이티브 컨테이너화 기능을 활용하여 더 효율적이고 간소화된 경험을 제공합니다. Podman은 ARM64 아키텍처를 기반으로 하는 macOS M1/M2 기계에서 Docker Desktop에 대한 유망한 대안입니다. 최적화된 성능과 간소화된 컨테이너화 기능을 갖춘 Podman은 이러한 기계에서 컨테이너를 빌드, 관리 및 실행해야 하는 개발자와 IT 전문가들에게 강력한 도구를 제공합니다.

<div class="content-ad"></div>

새로운 macOS M1/M2 기기에서 ARM64 아키텍처를 사용하는 Podman을 설정하는 가이드입니다. 이를 통해 더 가벼우면서도 효율적인 컨테이너화 도구로 Docker 및 Docker Desktop을 대체할 수 있습니다.

## 1. Podman 설치 및 구성

macOS에는 Homebrew 패키지 관리자를 사용하여 Podman을 설치할 수 있습니다. 설치한 후, Podman을 루트 없는 컨테이너와 함께 사용할 수 있도록 구성할 수 있습니다. 이때 주의해야 할 점은 Linux 시스템과는 달리 macOS(그리고 Windows)에서는 Podman 사용 시 가상 머신을 사용해야 한다는 것입니다. 가상 머신은 QEMU 에뮬레이터를 사용하여 Linux 런타임 환경을 제공합니다. MacOS와 Windows는 Podman이 의존하는 Linux 네임스페이스 및 cgroups를 네이티브로 지원하지 않기 때문입니다.

```js
# Podman 설치
❯❯ brew install podman

# 새로운 Linux 런타임 환경 초기화 (이를 'podman machine'이라고 합니다)
# Podman은 quem 에뮬레이터를 사용하여 Linux 런타임 환경을 제공합니다
# --cpus 4 (CPU 코어 수 지정)
# --memory=6144 (메모리 용량 지정)
❯❯ podman machine init --cpus 4 --memory=6144

# Podman 머신 목록 표시
# 기본 Podman 머신은 `podman-machine-default*`입니다
❯❯ podman machine ls
NAME                     VM TYPE     CREATED     LAST UP     CPUS        MEMORY      DISK SIZE
podman-machine-default*  qemu        4 days ago  4 days ago  2           2.147GB     107.4GB

# 런타임 시작
# Podman은 /Users, /private, /var/folders 디렉터리에 볼륨 매핑을 사용합니다
❯❯ podman machine start
"podman-machine-default" 머신 시작 중
VM 대기 중...
볼륨 마운트... /Users:/Users
볼륨 마운트... /private:/private
볼륨 마운트... /var/folders:/var/folders

현재 이 머신은 루트 없는 모드로 구성되어 있습니다. 컨테이너에 루트 권한이 필요한 경우(예: 포트 < 1024) 또는 비-Podman 클라이언트와의 호환성 문제가 발생한 경우, 다음 명령을 사용하여 전환할 수 있습니다:

 podman machine set --rootful

API 전달 Listening: /Users/lambda.eranga/.local/share/containers/podman/machine/podman-machine-default/podman.sock

시스템 도우미 서비스가 설치되어 있지 않습니다; podman에서는 기본 Docker API 소켓 주소를 사용할 수 없습니다. 설치하려면 다음 명령을 실행하세요:

 sudo /opt/homebrew/Cellar/podman/4.4.2/bin/podman-mac-helper install
 podman machine stop; podman machine start

터미널 세션에서 다음 몤령을 사용하여 여전히 Docker API 클라이언트에 연결할 수 있습니다:

 export DOCKER_HOST='unix:///Users/lambda.eranga/.local/share/containers/podman/machine/podman-machine-default/podman.sock'

"podman-machine-default" 머신이 성공적으로 시작되었습니다
podman machine start

# Podman 머신이 실행 중
❯❯ podman machine ls
NAME                     VM TYPE     CREATED     LAST UP            CPUS        MEMORY      DISK SIZE
podman-machine-default*  qemu        4 days ago  Currently running  2           2.147GB     107.4GB

# 정보 확인
❯❯ podman info

# Podman 연결
❯❯ podman system connection ls
Name                         URI                                                         Identity                                          Default
podman-machine-default       ssh://core@localhost:50985/run/user/501/podman/podman.sock  /Users/lambda.eranga/.ssh/podman-machine-default  true
podman-machine-default-root  ssh://root@localhost:50985/run/podman/podman.sock           /Users/lambda.eranga/.ssh/podman-machine-default  false

# 머신 정지
❯❯ podman machine stop

# 머신 재시작
❯❯ podman machine stop; podman machine start

# Podman 머신에 SSH 접속
❯❯ podman machine ssh

# 머신 제거
❯❯ podman machine rm -f podman-machine-default
```

<div class="content-ad"></div>

## 2. Podman Commands

Podman은 Docker와 유사한 명령줄 인터페이스를 제공합니다. 사실, Podman에서 사용하는 많은 명령어는 Docker에서 사용하는 것과 동일하여 Docker에 익숙한 사용자가 Podman으로 쉽게 전환할 수 있습니다. Podman에서 다양한 명령어를 실행하려면 원하는 특정 명령어 뒤에 podman 명령어를 사용할 수 있습니다. 예를 들어, 모든 실행 중인 컨테이너를 나열하려면 podman ps 명령어를 사용할 수 있습니다. 마찬가지로 Dockerfile에서 이미지를 빌드하려면 podman build -t image_name -f Dockerfile_path와 같은 명령어를 사용할 수 있습니다. Podman은 컨테이너 시작 및 중지, 실행 중인 컨테이너에 연결 및 이미지 및 볼륨 관리와 같은 일반적인 컨테이너화 작업을 지원합니다.

```js
# 이미지 목록
❯❯ podman images
REPOSITORY                           TAG             IMAGE ID      CREATED       SIZE
docker.io/hashicorp/envconsul        0.13.0          42307d16e023  8 months ago  18.7 MB
docker.io/library/vault              <none>          aac433bb6835  2 years ago   147MB

# PostgreSQL 이미지 다운로드
❯❯ podman pull postgres:latest
...

# PostgreSQL 실행
❯❯ podman run --name postgres -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres
6ee93adb00d1f1a468308b50a044002e2f7da116614ebb8d092d8236ae6542d6

# 실행 중인 컨테이너 목록
❯❯ podman ps
CONTAINER ID  IMAGE                              COMMAND     CREATED        STATUS        PORTS                   NAMES
6ee93adb00d1  docker.io/library/postgres:latest  postgres    4 seconds ago  Up 4 seconds  0.0.0.0:5432->5432/tcp  postgres

# 명령어 실행 시 디버그 로그 보기
❯❯ podman --log-level=debug ps
...

## 3. Create Docker Alias
```

<div class="content-ad"></div>

Podman은 Docker와 매우 유사한 명령줄 인터페이스를 제공하여 Docker에서 Podman으로 쉽게 전환할 수 있습니다. 실제로 Podman과 Docker를 동일하게 사용할 수 있도록 Docker에 대한 별칭을 Podman으로 만들 수 있습니다. 예를 들어, 다음 Alias를 ~/.zshrc 파일에 추가하여 Podman의 docker alias를 만들 수 있습니다.

```js
# alias to docker, run podman commands as docker
alias docker=podman
```

별칭을 설정한 후에는 docker 명령을 podman 명령처럼 사용할 수 있으며, docker 명령을 사용하여 Podman 명령을 실행할 수 있습니다. Docker에서 작업하는 데 익숙하고 새로운 명령어를 배우지 않고 Podman으로 전환하려는 경우 도움이 될 수 있습니다. 그러나 Docker와 Podman 사이에 동작에 차이가 있을 수 있으므로 docker alias를 Podman과 함께 사용할 때 작업 흐름을 충분히 테스트해야 합니다.

```js
# list images with docker alias
❯❯ docker images
REPOSITORY                           TAG             IMAGE ID      CREATED       SIZE
docker.io/library/postgres           latest          61d0571c2f7b  2 weeks ago   368 MB
docker.io/hashicorp/envconsul        0.13.0          42307d16e023  8 months ago  18.7 MB
docker.io/library/vault              <none>          aac433bb6835  2 years ago   147 MB

# list containers
❯❯ docker ps
CONTAINER ID  IMAGE                              COMMAND     CREATED        STATUS        PORTS                   NAMES
6ee93adb00d1  docker.io/library/postgres:latest  postgres    4 minutes ago  Up 4 minutes  0.0.0.0:5432->5432/tcp  postgres
```

<div class="content-ad"></div>

## 4. Podman REST API에 액세스하기

podman.sock은 Podman 데몬이 Podman 클라이언트로부터 요청을 수신하기 위해 사용하는 유닉스 도메인 소켓입니다. Podman 명령을 실행할 때 Podman 클라이언트는 podman.sock 소켓을 통해 Podman 데몬에 요청을 보내고, 데몬은 요청을 처리하고 클라이언트에 응답을 보냅니다. 기본적으로 podman.sock 소켓은 Podman이 실행 중인 기기에서 로컬로만 액세스할 수 있습니다. 그러나 socat을 사용하여 podman.sock 소켓을 TCP 소켓에 바인딩하여 HTTP REST API를 통해 Podman에 원격 액세스할 수 있도록 설정할 수 있습니다.

다음 예제에서는 podman.sock 유닉스 소켓을 socat을 사용하여 TCP 포트 2375에 바인딩하는 방법을 보여줍니다. 이를 통해 호스트 기기에서 이 포트에 연결하고 podman REST API를 외부에 노출시킬 수 있습니다. 설정이 완료되면 REST 클라이언트가 포트 2375에 연결하여 Podman REST API에 액세스할 수 있습니다.

<div class="content-ad"></div>

## 5. ARM64 CPU 아키텍처 이미지 실행하기

Podman을 사용하여 컨테이너 이미지를 실행할 때, 컨테이너는 호스트 머신과 동일한 CPU 아키텍처에서 실행됩니다. 즉, 호스트 머신이 ARM64 CPU 아키텍처를 가지고 있다면, Podman은 ARM64 아키텍처를 사용하여 컨테이너를 실행합니다. 만약 호스트 머신이 AMD64 또는 x86 아키텍처를 가지고 있다면, 컨테이너는 해당 아키텍처로 실행됩니다.

주의할 점은 호스트 머신의 아키텍처와 다른 아키텍처의 컨테이너 이미지를 실행하려고 한다면, Podman이 해당 컨테이너를 실행할 수 없다는 것입니다. 예를 들어, AMD64 또는 x86 아키텍처를 가진 호스트 머신에서 ARM64 컨테이너 이미지를 실행하려고 하면, Podman은 해당 컨테이너를 실행할 수 없습니다.

이 제한을 극복하기 위해, multi-architecture 컨테이너 이미지를 사용할 수 있습니다. 이러한 이미지에는 여러 CPU 아키텍처의 이진 파일과 라이브러리가 포함되어 있어, 동일한 이미지가 다른 아키텍처의 머신에서 실행될 수 있습니다. Docker와 Podman은 모두 multi-architecture 이미지를 지원합니다. multi-architecture 이미지를 가져올 때, Podman은 자동으로 호스트 머신에 맞는 올바른 아키텍처를 선택하고 해당 아키텍처로 컨테이너를 실행합니다.

<div class="content-ad"></div>

mquery 도구를 사용하면 공개 컨테이너 저장소의 모든 공개 이미지를 쿼리하여 미디어 유형, 다이제스트 및 플랫폼 지원을 확인할 수 있습니다. 또한 도커 이미지의 사용 가능한 CPU 아키텍처를 확인하는 데 사용할 수 있습니다. 이 도구는 estesp/mquery라는 이름의 Docker 이미지로 제공됩니다. 해당 이미지를 실행하여 어떤 도커 이미지의 CPU 아키텍처를 확인할 수 있습니다. 결과에는 이미지를 지원하는 플랫폼이 표시되며, 해당 아키텍처, 운영 체제 및 버전이 포함됩니다. 시스템의 CPU 아키텍처와 호환되는지 확인하는 데 유용할 수 있습니다.

```js
# postgres:latest 이미지의 사용 가능한 CPU 아키텍처 보기
# postgres:latest 이미지는 arm64를 포함한 모든 CPU 아키텍처로 제공됩니다
# macOS M1에서 postgres:latest를 실행하는 경우 arm64 이미지가 선택됩니다
❯❯ docker run --rm mplatform/mquery postgres:latest
Image: postgres:latest (digest: sha256:50a96a21f2992518c2cb4601467cf27c7ac852542d8913c1872fe45cd6449947)
 * Manifest List: Yes (Image type: application/vnd.docker.distribution.manifest.list.v2+json)
 * Supported platforms:
   - linux/amd64
   - linux/arm/v5
   - linux/arm/v7
   - linux/arm64/v8
   - linux/386
   - linux/mips64le
   - linux/ppc64le
   - linux/s390x

# 실행 중인 postgres:latest 이미지의 CPU 아키텍처 보기
# macOS M1에서 postgres:latest를 실행하는 경우 arm64 이미지가 선택됩니다
❯❯ docker image inspect postgres:latest | grep Architecture
          "Architecture": "arm64",
```

## 6. AMD64 CPU 아키텍처 이미지 실행

Podman에서 AMD64와 같은 다른 CPU 아키텍처용으로 빌드된 도커 이미지를 macOS M1/M2 ARM64 CPU에 실행하려고 하면 에러가 발생하여 실패할 것입니다. 이는 이미지가 호스트 머신의 CPU 아키텍처와 호환되지 않기 때문입니다.

<div class="content-ad"></div>

```js
# mysql:8.0.23은 amd64 아키텍처 이미지만 사용 가능합니다
❯❯ docker run --rm mplatform/mquery mysql:8.0.23
이미지: mysql:8.0.23 (다이제스트: sha256:6e0014cdd88092545557dee5e9eb7e1a3c84c9a14ad2418d5f2231e930967a38)
 * Manifest List: Yes (이미지 유형: application/vnd.docker.distribution.manifest.list.v2+json)
 * 지원하는 플랫폼:
   - linux/amd64

# mac m1 arm64 머신에서 mysql:8.0.23 실행 시 발생하는 오류입니다
❯❯ docker run mysql:8.0.23
"mysql"을 미지정 검색 레지스트리를 사용하여 해석 중 (/etc/containers/registries.conf.d/999-podman-machine.conf)
docker.io/library/mysql:8.0.23에서 가져오려고 시도 중...
오류: 아키텍처 arm64, 변형 "v8", OS linux에 대한 매니페스트 목록에서 이미지를 찾을 수 없음

그러나 Podman은 이 문제에 대한 다중 아키텍처 지원으로 해결책을 제공합니다. --arch 옵션을 사용하여 실행하려는 플랫폼을 지정할 수 있고, 해당 플랫폼에 대해 사용 가능한 경우 Podman은 자동으로 이미지의 올바른 버전을 가져옵니다. 이를 통해 macOS M1/M2 ARM64 CPU에서 다른 CPU 아키텍처용 이미지를 문제 없이 실행할 수 있습니다.

# amd64 아키텍처를 지정하여 mysql 이미지 실행
# 그럼 podman은 amd64 아키텍처로 docker 이미지를 가져와 실행합니다
❯❯ docker run --arch=amd64 mysql:8.0.23
"mysql"을 미지정 검색 레지스트리를 사용하여 해석 중 (/etc/containers/registries.conf.d/999-podman-machine.conf)
docker.io/library/mysql:8.0.23에서 가져오려고 시도 중...
이미지 소스 서명 가져옴
blob sha256:15f235e0d7eefe6c5153946a57daebaf2d0744fb1d0676642f269554fc68ba2a 복사 중
(중략)
config sha256:cbe8815cbea8fb86ce7d3169a82d05301e7dfe1a8d4228941f23f4f115a887f2 복사 중
이미지 목적지에 매니페스트 쓰는 중
서명 저장 중
2023-03-18 01:58:56+00:00 [Note] [Entrypoint]: MySQL Server 8.0.23-1debian10용 입구점 스크립트 시작됨.
(중략)
2023-03-18 01:58:57+00:00 [ERROR] [Entrypoint]: 데이터베이스가 초기화되지 않았으며 암호 옵션이 지정되지 않았습니다
    다음 중 하나를 지정해야 합니다:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD

--arch 옵션이 작동하지 않는 경우, multiarch/qemu-user-static을 사용한 해결책이 있습니다. 이 글에서 그 해결책에 대해 자세히 설명합니다.
``` 

<div class="content-ad"></div>

```js
podman machine ssh
sudo -i
rpm-ostree install qemu-user-static
systemctl reboot
```

## 7. 다른 CPU 아키텍처로 이미지 빌드하기

Podman으로 이미지를 빌드할 때 --arch 플래그를 사용하여 이미지에 원하는 CPU 아키텍처를 선택할 수 있습니다. 기본적으로 Podman은 실행 중인 기기의 CPU 아키텍처를 사용합니다. 이를 통해 Podman을 사용하여 멀티 아키텍처 이미지를 빌드할 수 있으며, 동일한 응용 프로그램을 다양한 CPU 아키텍처에서 실행하는 데 유용할 수 있습니다. 아래는 다른 아키텍처 이미지를 빌드하는 데 사용되는 예시 golang 응용프로그램(main.go)과 Dockerfile입니다.

```js
package main

import "fmt"

func main() {
 fmt.Println("vim-go")
}
```

<div class="content-ad"></div>

```js
FROM golang:1.16-alpine as builder
WORKDIR /app
COPY . .

RUN go build -o main *.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
CMD [ "./main" ]
```

AMD64 아키텍처를 사용하여 이미지를 빌드하려면 Podman을 사용하여 다음 명령을 --arch=amd64 매개변수와 함께 사용할 수 있습니다. 이는 AMD64 아키텍처 기본 이미지를 사용하고 그 위에 새 이미지를 빌드합니다.

```js
# amd64 cpu 아키텍처로 도커 이미지 빌드
# 빌드할 때 주어진 cpu 아키텍처의 기반 이미지 및 라이브러리를 가져옵니다
❯❯ docker build --arch=amd64 --rm -t erangaeb/hello .
[1/2] 단계 1/4: FROM golang:1.16-alpine AS builder
"golang"를 unqualified-search 레지스트리(../../containers/registries.conf.d/999-podman-machine.conf)를 사용하여 해석 중
docker.io/library/golang:1.16-alpine를 가져오려는 중...
이미지 소스 서명 가져오는 중
blob sha256:0435e09637941e35cccdf9cf9171571811d2fdfe72c27e39543a718d38d28668 복사 중
blob sha256:59bf1c3509f33515622619af21ed55bbe26d24913cedbca106468a5fb37a50c3 복사 중
blob sha256:666ba61612fd7c93393f9a5bc1751d8a9929e32d51501dba691da9e8232bc87b 복사 중
blob sha256:8ed8ca4862056a130f714accb3538decfa0663fec84e635d8b5a0a3305353dee 복사 중
blob sha256:ca4bf87e467a8cacf62c9b01c7d6d43f6ca4bb9b0fc9146fbb906b05aee56cc1 복사 중
config sha256:7642119cd16177d874dcbfe1c550affd336dbe4cabb3339ef685ac1d6ec71ccc 복사 중
이미지 목적지에 매니페스트 작성 중
서명 저장 중
[1/2] 단계 2/4: WORKDIR /app
--> 캐시 푸시 []:220abc07870fcc2e449b7b03384b2e4c219f7c32b28546f90067c1488ea63ba0
--> 663c9d6f7ea
[1/2] 단계 3/4: COPY . .
--> 캐시 푸시 []:e7db7815e4762b218ab81c3f93cdf789c4961c783825470c3c2edb55000b1844
--> ce3d882f4c8
[1/2] 단계 4/4: RUN go build -o main *.go
--> 캐시 푸시 []:95b5a69b661a646895b2a2bc6b313e0f5fd2cc83a4d7dcd1e5f2594be34c3d4d
--> 54d84331cf2
사용자 정의 erangaeb/hello 이미지가 성공적으로 빌드되었습니다
c1329ead22a2cf66cd4a47b06aa0d406aba34798d26e79d666e1d855cd920028

# 이미지 실행
# 이미지를 arm64 cpu로 빌드한 후 --arch=amd64를 명시해야 함
# 그렇지 않으면 amd64 cpu 아키텍처 이미지를 가져와 실패할 것입니다
❯❯ docker run --arch=amd64 localhost/erangaeb/hello
경고: 이미지 플랫폼(리눅스/amd64)이 예상 플랫폼(리눅스/arm64)과 일치하지 않습니다
vim-go
```

다음은 Podman을 사용하여 arm64 아키텍처로 이미지를 빌드하는 예제 명령입니다. 이 명령은 --arch 플래그를 사용하여 ARM64 아키텍처를 지정합니다.

<div class="content-ad"></div>

```js
# arm64 CPU 아키텍처로 도커 이미지 빌드
❯❯ docker build --arch=arm64 --rm -t erangaeb/hello:arm64 .
[1/2] 단계 1/4: golang:1.16-alpine을 빌드 중
... (중략) ...
[2/2] 단계 1/4: alpine:latest으로 빌드 중
... (중략) ...
erangaeb/hello:arm64 이미지 구축 완료
4d98d25ec13db2b9c25c149a0c3f5996829029026a6fd295e55c78acc9cef89e

# arm64 이미지 실행
# CPU 아키텍처와 일치하여 경고 없이 실행됩니다.
❯❯ docker run localhost/erangaeb/hello:arm64
vim-go
```

## 8. 쿠버네티스 클러스터 실행

로컬 쿠버네티스 클러스터를 생성하기 위해 Kind와 Podman을 함께 사용했습니다. Kind는 로컬 머신에서 도커 컨테이너로 작동하는 클러스터 노드로서 쿠버네티스 클러스터를 운영할 수 있게 해주는 오픈소스 도구입니다. 아래는 Podman을 활용하여 Kind 클러스터를 설정하는 단계입니다.

```js
# asdf를 사용하여 kind 설치
❯❯ asdf plugin add kind
❯❯ asdf install kind 0.17.0
❯❯ asdf global kind 0.17.0

# ~/.zshrc 파일에 아래 구성 추가하여 rootless podman으로 kind 실행
KIND_EXPERIMENTAL_PROVIDER=podman

# 클러스터 생성
# 클러스터 이름은 'kind'로 지정됩니다.
❯❯ kind create cluster 

# kubectl 컨텍스트인 kind-kind가 추가됩니다.
❯❯ kubectl config get-contexts
... (중략) ...

# kind 클러스터 조회
❯❯ kind get clusters
... (중략) ...

# 클러스터 노드에 이미지 로드
# 비공개 도커 레지스트리(예: Google Container Registry/GCR)에 있는 이미지 실행에 도움이 됩니다.
❯❯ kind load docker-image eu.gcr.io/rahasak-build/lambdaops:1.0

# kind-kind 컨텍스트로 kind 클러스터 사용
❯❯ kubectl --context=kind-kind get pods

# 클러스터 삭제
❯❯ kind delete cluster
```

<div class="content-ad"></div>

## 9. Google Container Registry 인증

Google Container Registry(GCR)와 통합하고 싶을 수 있습니다. 이는 Google Cloud가 제공하는 Docker 이미지를 저장하고 관리하는 호스팅 서비스입니다. GCR 문서에는 Docker와의 인증에 대한 훌륭한 안내가 제공됩니다. 첫 번째 인증 방법은 gcloud 자격 증명 도우미를 사용하는 것인데, 이는 gcloud CLI를 사용하여 Cloud Shell 또는 Google Cloud CLI가 설치된 모든 환경에서 인증을 구성합니다. Docker의 gcloud 자격 증명 도우미 방법을 통해 한 번 인증을 받으면 같은 인증 방법을 Podman에서도 사용할 수 있습니다. 먼저 Google Cloud 계정으로 gcloud auth login 명령을 실행하여 인증하십시오. 다음으로, gcloud auth configure-docker `registry host` 명령을 사용하여 Docker가 GCR과 인증하도록 구성하십시오. 이 작업이 완료되면 Podman은 Docker 자격 증명을 재사용할 수 있습니다.

```js
# 웹 플로우를 통해 gcloud 서비스에 로그인
❯❯ gcloud auth login

# 자격 증명을 ~/.config/gcloud/credentials.db SQLite 데이터베이스에 저장합니다
❯❯ sqlite3 credentials.db "SELECT value FROM credentials"
{
  "client_id": "<id>.apps.googleusercontent.com",
  "client_secret": "<secret>",
  "refresh_token": "<token>",
  "revoke_uri": "https://accounts.google.com/o/oauth2/revoke",
  "scopes": [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/appengine.admin",
    "https://www.googleapis.com/auth/sqlservice.login",
    "https://www.googleapis.com/auth/compute",
    "https://www.googleapis.com/auth/accounts.reauth"
  ],
  "token_uri": "https://oauth2.googleapis.com/token",
  "type": "authorized_user"
}

# Docker가 GCR과 인증하도록 구성
# 그럼 Podman이 해당 자격 증명을 재사용할 수 있습니다
# 명령어
❯❯ gcloud auth configure-docker <registry host>

# 예시
❯❯ gcloud auth configure-docker eu.gcr.io
Adding credentials for: eu.gcr.io
업데이트 후 다음이 Docker 구성 파일에 작성될 것입니다
[/Users/lambda.eranga/.docker/config.json]:
 {
  "credHelpers": {
    "eu.gcr.io": "gcloud"
  }
}
계속하시겠습니까 (Y/n)?  Y

# 원하는 경우 더 많은 레지스트리 호스트를 추가할 수 있습니다
❯❯ gcloud auth configure-docker europe-docker.pkg.dev
❯❯ gcloud auth configure-docker europe-north1-docker.pkg.dev

# 생성된 구성은 홈 디렉토리 ~/.docker/config.json에 저장됩니다
❯❯ cat ~/.docker/config.json
{
  "credHelpers": {
    "eu.gcr.io": "gcloud",
    "europe-docker.pkg.dev": "gcloud",
    "europe-north1-docker.pkg.dev": "gcloud"
  }
}

# 이제 Podman은 Docker 자격 증명을 사용하여 credential helper gcloud를 통해 GCR에 접근할 수 있습니다
❯❯ docker pull eu.gcr.io/rahasak-build/aplos:0.1 --log-level=debug
INFO[0000] podman filtering at log level debug
⋮
```

이전 방법은 Podman이 Docker GCR 인증 구성을 사용하여 Google Container Registry와 인증하는 방법을 설명했습니다. 그러나 Podman은 직접 컨테이너 레지스트리에 로그인하기 위한 podman login이라는 명령도 제공합니다. 이 명령은 Container Registry와 함께 사용할 수 있는 단기간의 OAuth 액세스 토큰을 사용하여 인증합니다. 이 토큰은 60분 동안만 유효하므로 Container Registry에 연결하기 전 1시간 이전에 요청해야 합니다. 토큰이 만료되면 다시 로그인해야 하며, 그렇지 않으면 권한 없음: 인증 실패 오류가 발생할 수 있습니다.

<div class="content-ad"></div>

```yaml
# 웹 플로우를 통해 gcloud 서비스에 로그인해주세요
❯❯ gcloud auth login

# 이전에 생성된 도커 자격 증명을 제거해주세요
❯❯ rm -rf ~/.docker

# 짧게 유지되는 액세스 토큰을 생성하고 sqlite db ~/.config/gcloud/access_tokens.db에 저장됩니다
❯❯ sqlite3 access_tokens.db "select * from access_tokens"

# 액세스 토큰 확인
❯❯ gcloud auth print-access-token

# 액세스 토큰으로 gcr에 로그인
# 이렇게 짧게 유지되는 OAuth 액세스 토큰을 사용하여 Container Registry와 인증합니다. 
# 토큰은 60분 동안 유효하며, Container Registry에 연결하기 전에 한 시간 이내에 요청해야 합니다.
# 토큰 만료 시, 아래 명령어를 다시 실행하고 다시 로그인해야 합니다. 그렇지 않으면 권한이 없음: 인증 실패 오류가 발생합니다.
❯❯ gcloud auth print-access-token | podman login -u oauth2accesstoken --password-stdin eu.gcr.io

# ~/.config/containers/auth.json에 인증 파일이 생성됩니다
❯❯ cat .config/containers/auth.json
```
{
 "auths": {
  "eu.gcr.io": {
   "auth": "<액세스 토큰>"
  }
 }
}

# 이제 podman은 docker 자격 증명을 사용하여 gcr에 액세스할 수 있습니다(자격 증명 도우미 gcloud 사용)
❯❯ docker pull eu.gcr.io/rahasak-build/aplos:0.1 --log-level=debug
INFO[0000] log level debug에서 podman 필터링
DEBU[0000] pull.PersistentPreRunE(podman pull eu.gcr.io/rahasak-build/aplos:0.1 --log-level=debug) 호출
DEBU[0000] DoRequest 메서드: GET URI: http://d/v4.4.2/libpod/_ping
DEBU[0000] "/etc/containers/registries.conf"에서 레지스트리 구성로드
DEBU[0000] 자격 증명 도우미 containers-auth.json에서 /Users/lambda.eranga/.config/containers/auth.json 파일의 eu.gcr.io 자격 증명 찾음
DEBU[0000] DoRequest 메서드: POST URI: http://d/v4.4.2/libpod/images/pull
eu.gcr.io/rahasak-build/aplos:0.1 끌어오기 시도 중...
이미지 소스 서명 가져오는 중
blob sha256:9fa0fafc404b18044192115d295424237056a9296da9fe07f3f493f714d7c6fb 복사 중
blob sha256:b9fd7cb1ff8f489cf082781b0e1fe0c13b840e20147e8fc8204b4592da7c2f70 복사 중
blob sha256:f25ad21146dc80e14a651d9f59707ccab21bd3749aee1177faf72329661f19eb 복사 중
blob sha256:e92ed755c008afc1863a616a5ba743b670c09c1698f7328f05591932452a425f 복사 중
blob sha256:53e3366ec435596bed2563cc882ba47ec25df6be2b1027e3243e83589c667c1e 복사 중
blob sha256:ee690f2d57a128744cf4c5b52646ad0ba7a5af113d9d7e0e02b62c06d35fd14c 복사 중
blob sha256:e83609f677899ddd7e01f03fd3f797d98fb18e3307a236b55b218a59f5cf7b9b 복사 중
blob sha256:88c7c603b3faedd122305543eb17d6968a16399c7a93f67b3486196b2440c846 복사 중

# 로그인 취소
❯❯ podman logout eu.gcr.io


# 참고

- https://medium.com/rahasak/replace-docker-desktop-with-minikube-and-hyperkit-on-macos-783ce4fb39e3
- https://dev.to/docker/choosing-the-right-docker-image-for-your-apple-m1-pro-440l
- https://zenn.dev/sbk0716/articles/d9235b78b97615
- https://itnext.io/using-minikube-on-m1-macs-416da593ba0c
- https://itnext.io/goodbye-docker-desktop-hello-minikube-3649f2a1c469
- https://0to1.nl/post/minikube-m1-pro-issues/
- https://www.redhat.com/sysadmin/podman-python-bash
- https://edofic.com/posts/2021-09-12-podman-m1-amd64/
- https://xphyr.net/post/podman_on_osx/
- https://www.redhat.com/sysadmin/specify-architecture-pulling-podman-images
- https://itnext.io/kubernetes-kind-cheat-shee-2605da77984
