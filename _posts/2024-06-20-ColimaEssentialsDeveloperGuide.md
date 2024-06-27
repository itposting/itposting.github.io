---
title: "콜리마 에센셜 개발자 안내"
description: ""
coverImage: "/assets/img/2024-06-20-ColimaEssentialsDeveloperGuide_0.png"
date: 2024-06-20 14:33
ogImage: 
  url: /assets/img/2024-06-20-ColimaEssentialsDeveloperGuide_0.png
tag: Tech
originalTitle: "Colima Essentials Developer Guide"
link: "https://medium.com/java-nibble/colima-essentials-guide-e5b969f74b62"
---


## macOS에서 Colima 컨테이너 런타임을 사용하는 개발자 안내서.

![Colima Essentials Developer Guide](/assets/img/2024-06-20-ColimaEssentialsDeveloperGuide_0.png)

Colima 세계에 뛰어들어 시작하는 데 완벽한 필수 안내서입니다.

쉬운 설치 단계부터 편리한 명령줄 트릭까지, macOS 또는 Linux 기기에서 로컬 컨테이너 런타임을 설정하는 방법을 배울 수 있습니다.

<div class="content-ad"></div>

Colima를 사용하여 개발 환경을 더 스무스하고 효율적으로 만들어 보세요!

# 콜리마란?

콜리마는 macOS(및 Linux)에서 사용할 수 있는 무료 컨테이너 런타임으로, Lima VM에서 Docker 컨테이너 런타임을 설정할 수 있는 최소한의 설정이 필요합니다. Colima는 간단하고 쉽게 사용할 수 있는 명령줄 인터페이스(CLI)를 제공하며, Intel 및 M1 프로세서를 모두 지원합니다.

Colima의 다른 기능으로는 docker 및 containerd 런타임 지원, 포트 전달, 볼륨 마운트, 쿠버네티스 및 여러 인스턴스 지원이 있습니다.

<div class="content-ad"></div>

콜리마는 Docker Desktop의 대체로 사용할 수 있습니다. 특히 특정 조건에서 Docker Desktop은 무료가 아닙니다.

# 리마(Lima)란?

리마는 콜리마가 기능을 달성하는 데 사용하는 기술입니다. 리마는 macOS에서 리눅스 가상 머신(VM)을 만들어주는 오픈 소스 프로젝트입니다. 이를 통해 Mac에서 리눅스 환경을 제공합니다.

리마는 자동 파일 공유, 포트 포워딩 및 컨테이너드를 지원하는 리눅스 가상 머신을 시작합니다. 리마의 목적은 사용자들에게 네르드컨테이너(nerdctl)를 포함한 컨테이너드를 소개하는 것입니다.

<div class="content-ad"></div>

리마는 컨테이너가 아닌 애플리케이션에도 사용할 수 있어요. 리마는 게스트 머신을 실행하는 qemu 및 vz를 지원하며, 이는 인스턴스 생성 중에만 지정될 수 있어요.

# 설치

콜리마는 Homebrew에서 제공되며 macOS에 다음 명령어로 설치할 수 있어요:

```js
# Homebrew를 사용하여 Colima 설치
$ brew install colima
```

<div class="content-ad"></div>

Colima를 설치하려면 MacPorts, Nix, Arch, 이진 파일 또는 소스에서 빌드하는 방법을 사용하여 공식 Colima Github 페이지의 설치 안내를 따르세요.

Colima를 Docker Desktop 대체로 사용할 수 있으므로 다음 소프트웨어가 필요합니다:

```js
$ brew install docker 
$ brew install docker-compose 
$ brew install docker-credential-helper
$ brew install kubectl
```

# Colima 구성

<div class="content-ad"></div>

## Colima 기본 구성

기본 구성을 편집하는 두 가지 방법이 있습니다. 첫 번째는 colima를 --edit 플래그와 함께 시작하여 일회성 구성을 하는 것이며, 두 번째는 새로운 인스턴스의 기본 구성 템플릿을 편집하는 것입니다.

일회성 구성

```js
# 시작하기 전에 기본 구성을 일회성으로 사용자 정의합니다
$ colima start --edit
```

<div class="content-ad"></div>

구성 파일은 $HOME/.colima/default/colima.yaml에 있습니다. 이 파일은 수동으로 구성할 수 있습니다. 다른 프로필의 구성은 $HOME/.colima/`프로필명`/colima.yaml에서 찾을 수 있습니다.

기본 구성용 템플릿

```js
# 새로운 인스턴스의 기본 구성 템플릿을 편집하세요.
$ colima template
```

템플릿 파일은 $HOME/.colima/_templates/default.yaml에 있습니다.

<div class="content-ad"></div>

## 도커 로그인 구성

도커 로그인이 올바르게 구성되어 있는지 확인하려면 docker-credential-helper를 설치해야 합니다. docker-credential-helpers는 도커 자격 증명을 안전하게 보관하기 위해 네이티브 저장소를 사용하는 프로그램 모음입니다.

이미 이 작업을 수행하지 않았다면 macOS에서 다음 명령을 사용하여 docker-credential-helper를 설치할 수 있습니다.

```js
$ brew install docker-credential-helper
```

<div class="content-ad"></div>

/usr/local/bin에 심볼릭 링크가 생성되었습니다. 심볼릭 링크를 확인하고 올바르게 구성되었는지 확인하려면 다음 명령을 실행하면 됩니다. 아래와 같이 표시되어야 합니다:

```js
$ ls -l /usr/local/bin/docker-credential-osxkeychain
/usr/local/bin/docker-credential-osxkeychain -> ../Cellar/docker-credential-helper/0.7.0/bin/docker-credential-osxkeychain
```

다음 단계는 ~/.docker/config.json 구성 파일 내에서 credstore 속성을 사용하려는 프로그램의 접미사로 설정하는 것입니다. 예를 들어, docker-credential-osxkeychain을 사용하려면 osxkeychain으로 설정하십시오. desktop과 같은 다른 값으로 설정할 수도 있습니다.

속성을 설정한 후, 구성은 다음과 같이 보여야 합니다:

<div class="content-ad"></div>

```json
{
  "credsStore": "osxkeychain"
}
```

## 도커 컴포즈 및 볼륨 구성

도커 컴포즈가 올바르게 구성되도록 하려면 다음 명령어를 사용하여 cli-plugin 폴더를 만들어주십시오:

```sh
$ mkdir -p $HOME/.docker/cli-plugins
$ ln -sfn /usr/local/opt/docker-compose/bin/docker-compose $HOME/.docker/cli-plugins/docker-compose
```

<div class="content-ad"></div>

## 구성 확인

Colima가 성공적으로 설치되고 구성되었는지 확인하려면 다음 명령을 사용하여 구성을 검증할 수 있습니다.

지정된 컨테이너 런타임과 함께 Colima를 시작하고 Colima에서 상태 명령어를 실행합니다. Colima가 성공적으로 시작된 후, 도커 버전 명령을 실행하여 도커가 colima 런타임으로 작동하는지 확인합니다.

자격 증명 설정이 작동하는지 확인하려면 도커 로그인 명령을 실행하세요. 도커 Compose가 작동하는지 확인하려면 도커-컴포즈 버전 명령을 사용합니다.

<div class="content-ad"></div>

```sh
$ colima start; colima status
$ docker version
$ docker login
$ docker-compose version
```

## Colima 사용 시나리오

### 기본적인 Colima 사용

기본적인 사용 시나리오는 colima를 통해 컨테이너 런타임을 시작하는 것입니다. 이것이 colima를 사용하는 첫 번째 경우라면, 모든 기본 구성이 템플릿에 따라 새로운 기본 프로필로 생성됩니다.

<div class="content-ad"></div>

가상 머신에 할당되는 기본 구성 속성은 다음과 같습니다:

```js
# 가상 머신에 할당되는 CPU 개수.
cpu: 2
# 가상 머신에 할당되는 디스크 크기(기가바이트).
disk: 60
# 가상 머신에 할당되는 메모리 크기(기가바이트).
memory: 2
# 가상 머신의 아키텍처(x86_64, aarch64, host).
arch: host
# 사용할 컨테이너 런타임(docker, containerd).
runtime: docker
# 가상 머신을 위한 Kubernetes 구성.
kubernetes:
  enabled: false
```

Docker를 처음 사용하는 경우 Docker 레지스트리에도 로그인해야 합니다. docker run 명령어를 사용하여 'hello-world' 도커 이미지를 기반으로 실행할 수 있습니다.

Docker 사용이 끝나면 colima stop 명령어를 사용하여 Docker 런타임을 중지해야 합니다. colima list 명령어를 실행하여 모든 colima 인스턴스가 정지되었는지 확인할 수 있습니다.

<div class="content-ad"></div>

다음 명령어는 Colima의 기본 사용법을 수행하는 데 사용됩니다:

```js
# 기본 colima 인스턴스 시작 또는 새로운 기본 생성
$ colima start

# 모든 Colima 인스턴스 목록
$ colima status

# Docker 레지스트리에 로그인
$ docker login

# hello-world라는 이름의 Docker 컨테이너 실행
$ docker run hello-world

# 기본 colima 인스턴스 중지
$ colima stop

# 모든 colima 인스턴스 목록
$ colima list
```

# Lima CLI를 통해 Colima 관리

Colima 도구가 응답하지 않을 경우 limactl을 사용하여 linux 가상 머신 내에서 colima 컨테이너 런타임을 관리할 수 있습니다.

<div class="content-ad"></div>


# 리눅스 가상 머신의 인스턴스 목록을 나열합니다.
$ limactl ls

# Colima 리눅스 가상 머신을 중지합니다.
$ limactl stop colima

# Colima 리눅스 가상 머신을 삭제합니다.
$ limactl delete colima

# Lima에 대한 도움말 정보를 표시합니다.
$ limactl --help


# Colima 명령어

다음 명령어는 colima 버전 0.5.2를 기반으로 합니다. 이 섹션의 목적은 기존 colima 명령어 설명을 대체하는 것이 아니라 저가 자주 사용하는 명령어로 구성된 명령어 집합으로 제공하는 것입니다.

이 섹션에는 예제와 함께 colima 명령어 목록이 포함되어 있습니다.


<div class="content-ad"></div>

- colima completion - 다양한 쉘용 완성 스크립트 생성.
- colima delete - Colima 및 모든 설정 삭제 및 해체.
- colima help - 다양한 colima 명령어에 대한 도움말 정보 표시.
- colima kubernetes - Kubernetes 클러스터 관리.
- colima list - 생성된 모든 인스턴스 나열.
- colima nerdctl - containerd 런타임이 필요한 nerdctl을 실행하여 상호작용.
- colima ssh - VM으로 SSH하는 데 사용하거나 추가 명령어를 추가하여 해당 명령어를 실행.
- colima ssh-config - VM으로의 SSH 연결 구성 표시.
- colima start - 지정된 컨테이너 런타임 및 선택적 쿠버네티스로 Colima 시작.
- colima status - Colima의 상태 표시.
- colima stop - 자원을 해제하기 위해 Colima 인스턴스 중지. VM의 상태는 중지될 때 유지됨.
- colima template - 새로운 인스턴스의 기본 구성을 위한 템플릿 수정.
- colima version - Colima 버전 출력.

# 요약

마침내, 당신은 Colima의 상세 탐험에 착수하여 macOS에 컨테이너 런타임을 효율적으로 설정할 지식을 얻었습니다.

이 안내서는 동반자 역할을 하며, Colima의 전체 잠재력을 발휘하여 컨테이너화 노력에서 발생하는 모든 개발적인 어려움을 보다 쉽고 자신감 있게 극복하는 데 도움을 줄 것입니다.

<div class="content-ad"></div>

이 기사에 열 번 👏을 치면서 공유 🤝해 주시고 도움을 받을 수 있는 사람들에게 알려주세요. 더 이상 이와 같은 게시물을 보려면 저(👥 André Maré)를 팔로우해 주세요.