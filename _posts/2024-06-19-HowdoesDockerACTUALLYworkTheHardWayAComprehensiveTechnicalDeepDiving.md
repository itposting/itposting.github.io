---
title: "도커는 실제로 어떻게 작동하나요 하드웨이 포괄적인 기술적 심층 탐구"
description: ""
coverImage: "/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_0.png"
date: 2024-06-19 00:52
ogImage: 
  url: /assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_0.png
tag: Tech
originalTitle: "How does Docker ACTUALLY work? The Hard Way: A Comprehensive Technical Deep Diving"
link: "https://medium.com/@furkan.turkal/how-does-docker-actually-work-the-hard-way-a-technical-deep-diving-c5b8ea2f0422"
---


도커. 컨테이너. 오케스트레이션의 혁명. 산업을 선도하는 PaaS 제품. 빌드, 공유 및 실행. 어떤 앱이든 어디에서든... 그냥 그렇게. “도커는 어떻게 작동할까?”라고 궁금해 해 본 적 있나요? 마법이 아니에요. 재능과 땀 머금은 기술이랍니다.

![이미지](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_0.png)

이 기사에서는 다음 질문에 대한 답을 찾아보겠습니다:

- 컨테이너화가 세계를 어떻게 바꿨는가?
- 컨테이너가 클라우드 생태계를 어떻게 장악했는가?
- “컨테이너”가 정확히 무엇을 의미하는가?
- “도커”는 실제로 무엇인가요?

<div class="content-ad"></div>

본 기사의 목적은 "도커"에 대해 더 많이 배우고 이해하고 싶어하는 개발자들을 위해 고수 수준에서 초보 수준까지 포괄적인 학습 경로를 만드는 것입니다. 대상 독자는 다음을 원하는 분들입니다:

- 도커가 내부적으로 어떻게 사용되는지 배우기
- 컨테이너화에 대해 깊게 이해하기
- 구성 요소 간의 관계 파악하기
- 전반적인 멘탈 모델 습득하기
- 전체적인 그림을 보기

4년 전에는 컨테이너에 대해 거의 아무것도 몰랐습니다. 요즘에는 컨테이너 세계에 푹 빠져 있습니다. 4년 간의 지식을 한 자리에 모아 도커에 관심이 있는 모든 분들이 정렬되어 있도록 도와주기로 결심했습니다. 저는 4년 이상 Trendyol에서 컨테이너에 청년했습니다. 

# 이 기사를 읽는 방법

<div class="content-ad"></div>

이 기사는 조금 길 수 있습니다. 여기에서는 읽는 방법에 대한 안내가 있습니다:

- 높은 수준의 개요로 시작하여 컨셉을 간단히 설명합니다.
- 그런 다음 디자인 세부 정보를 소개하면서 전체 개념을 설명합니다.
- 높은 수준의 디자인이 완전히 설명된 후에는 일부 구성 요소를 살펴보고 구현과 관련된 몇 가지 이슈와 PR을 제공하며, 기사와 저자에 대한 교차 참조를 제공합니다.
- 이어서 내부의 저평가된 구성 요소, 명세, 뒷면, 내부 세부 정보에 대한 깊은 탐구를 합니다.
- 기사를 기존 정리하며 다룬 주요 포인트를 요약합니다.

# 노트

- 버즈워드 주의: 외부 소스 및 중요 키워드에 대한 교차 참조가 많이 나옵니다. 각각은 자세히 살펴볼 가치가 있습니다.
- No-AI: 이 문서에는 GPT 또는 AI로 생성된 내용이 포함되어 있지 않습니다! 커피를 한 잔 들고 즐겁게 읽으세요!
- 그림: 모든 그림은 저가 Excalidraw에서 직접 그린 것이며, 모든 권리를 보유합니다.

<div class="content-ad"></div>

# 개요

최근 몇 년 동안 컨테이너 관련 기술은 몇 가지 명령어로 빠르게 소프트웨어를 전달하기 위해 다양한 맥락에서 사용되어왔습니다. 본 문서는 컨테이너화 기술을 깊이 있게 개념화하고 검토합니다. 특정 용어들을 단계적으로 설명하고, 전반적인 아키텍처, 동기 및 사고 모델을 설명합니다. 우리는 Docker 아키텍처와 구성 요소를 질적으로 조사합니다. 본 문서에서는 모든 작은 세부사항을 다루지 않겠지만, 대신 뒷면에서 무슨 일이 일어나는지에 대해 알려드릴 것입니다. 이 문서에서는 많은 언급, 외부 리다이렉션, 교차 참조가 있을 것입니다.

# 동기

객관적으로 양적으로 측정하기 어려우며 주관적 해석에 크게 개방되어 있지만, 원숭이처럼 문서를 뛰어넘는 것보다 더 유익한 것은 전체 코드베이스를 이해하는 것입니다. 우리가 엔지니어로써 미래를 구축하려는 길에 있다면, 우리가 사용하는 기술이 어떻게 만들어졌는지 알아야 한다고 생각합니다. 누가 만들었는지. 어디에서. 어떻게. 그래서 어떠한 것이든 깊게 파고들어야 하는데, 아무데서나 어디서든지요.

<div class="content-ad"></div>

컨테이너 세계에 심취해본 적이 없어요. 여기서 중요한 점은 교육적인 목적으로 무언가를 할 수 있는 능력을 갖추는 것이며, 전체 아키텍처를 이해하고 모든 다양한 맥락을 하나의 장소에 편하게 정리하는 것입니다! 함께, 우리는 이를 하는 법을 배우게 될 거예요. 게다가, 이 편지를 쓰며 가치 있는 정보를 배울 수 있을 거예요. 게다가, 이는 기여할 수 있는 좋은 기회가 될 수 있어요. 커뮤니티에서 새로운 사람들을 만나고, 뒷담화를 듣는 분들, 건축가들, 의사 결정을 내리는 사람들도 만날 수 있는 기회일 거예요!

기술은 변화합니다. 늘 그렇죠. 우리의 지식이 바로 우리의 가치입니다. 최신 기술 변화와 업데이트를 따라가야 합니다. 그래서, 암기 대신에 이해하고, 듣는 대신에 보고, 무시하는 대신에 배우고, 가정 대신에 증명해 봅시다. 이러한 동기 부여는 여기서부터 더 나아갈 충분한 이유가 될 거예요!

# 1. 소개

컨테이너는 오늘날 인프라에서 언어를 제공하는 정말 유용한 존재가 되었어요. 다양한 환경의 복잡성을 초월하며 매끄러운 배포와 확장성을 제공하는 보편적인 언어를 제공하죠. 가벼우면서도 모듈식 디자인 덕분에 컨테이너는 응용 프로그램과 그 의존성을 캡슐화하여 다양한 플랫폼 간의 일관성과 이식성을 보장합니다. 컨테이너의 채택은 계속해서 급격히 증가하며 오늘날의 동적이고 빠른 기술적 환경에서 응용 프로그램이 개발되고 배포되고 관리되는 방식을 재정의하고 있습니다.

<div class="content-ad"></div>

우리가 애플리케이션을 개발, 배포 및 실행하는 방식을 혁신한 솔루션 중 하나가 Docker입니다. 소프트웨어를 컨테이너라고 불리는 자체 포함 단위로 패키징할 수 있는 능력으로, Docker는 소프트웨어 개발 및 배포의 세계를 변화시켰습니다.

Docker가 부상하는 원동력과 개발자, 운영팀 및 모든 크기의 기관들 사이에서 엄청난 인기를 얻게 된 이유를 알아봅시다.

## 2. Docker란?

Docker는 컨테이너 내부에서 애플리케이션을 개발, 배포 및 실행하기 위한 오픈 플랫폼입니다. Docker는 컨테이너화 기술을 활용하여 애플리케이션을 생성, 배포 및 실행하는 프로세스를 간소화합니다. Docker를 사용하면 애플리케이션을 인프라에서 분리하여 소프트웨어를 신속하게 전달할 수 있습니다. Docker를 통해 인프라와 애플리케이션을 동일한 방식으로 관리할 수 있습니다. Docker는 기저 인프라를 추상화하고 소프트웨어를 패키징하고 배포하는 표준화된 방법을 제공합니다. Docker의 배포, 테스트 및 코드 신속 배포 방법을 활용하여 코드 작성과 프로덕션에서 실행 간의 지연을 크게 줄일 수 있습니다.

<div class="content-ad"></div>

## 2.1. 컨테이너의 부상

지난 수십 년 동안 거의 모든 소프트웨어 애플리케이션들은 큰 단일 모노리틱으로 구축되었습니다. 목표는 모든 과정과 모든 기능을 하나의 서비스 내에서 처리하는 것이었습니다. 전체 시스템은 단일 시스템 방식으로 관리되고 사용되었기 때문에 모노리틱 빌드가 드물게 업데이트되었던 것입니다. 모든 시스템은 동시에 패키징되어 운영팀에 전달되어야 했습니다. 전체 시스템은 건강 서비스를 개발하고 모니터링한 운영팀에 의해 완전하게 운영되었습니다. 이 유산 방식은 여전히 소규모 프로젝트와 팀에 사용되고 있습니다.

배포하는 데 어려움을 겪고 새로운 기능에 대응하지 못하는 오래된 구조는 개발자들이 새로운 서비스 디자인을 찾도록 강요하게 만들었습니다. 이 때, 마이크로서비스가 나타납니다. 마이크로서비스 아키텍처는 사실 상을 더 작은 부분으로 분할한 모노리틱 구조입니다. 모든 서비스가 독립적으로 작동합니다. 마이크로서비스는 서로 분리되어 실행되며, 개별적으로 업데이트, 활용 및 확장될 수 있습니다. 이것은 개발팀과 운영팀이 소프트웨어를 최신 상태로 유지하고 제품을 신속히 배포할 수 있는 기회를 제공합니다. 이러한 구조를 사용하는 회사의 수는 날이 갈수록 증가하고 있습니다. 넷플릭스, 구글, 아마존 등이 가장 일반적으로 사용하는 사용자입니다.

마이크로서비스에는 긍정적인 측면이 있지만, 작은 서비스의 수가 더 많아지면서 업무량이 증가하고 이를 하나의 소프트웨어처럼 제어하고 병합하기가 어려워집니다. 이를 원활하게 운영하고 하드웨어 비용을 절감하는 것이 훨씬 어려워집니다. 그 때, 운영팀의 임무는 인간의 실수나 실패를 방지하고 확장 가능한 소프트웨어를 개발하기 위해 자동화를 극대화하는 것입니다. [17]

<div class="content-ad"></div>

## 2.2. 컨테이너 대 가상 머신

가상화는 컴퓨터 시스템의 가상 인스턴스를 하드웨어 시스템으로부터 추상화된 레이어에서 실행하는 프로세스입니다. 가상화는 가상 머신(Virtual Machines)을 통해 한 컴퓨터에서 동시에 여러 가상 운영 체제를 실행할 수 있도록 한다.

가상 머신(VMs)은 하나의 서버를 여러 대로 변환하는 물리 하드웨어의 추상화입니다. VM은 하나의 기계에서 여러 VM을 실행할 수 있게 한다. 각 VM은 완전한 운영 체제, 응용 프로그램, 필요한 바이너리 및 라이브러리 및 모든 종속성을 포함한다. 각 VM을 관리하고 구성해야 하기 때문에 VM은 비용을 절감하고 낭비되는 하드웨어 자원을 피하는 최선의 방법은 아니다. 이러한 이유로 가상화에서 컨테이너 기술로의 이전이 날이 갈수록 증가하고 있다.

리눅스 컨테이너 기술은 각 서비스에 대해 별도의 환경을 준비하지 않고도 개발자들이 동일한 기계에서 여러 마이크로서비스를 실행할 수 있게 한다. 또한 컨테이너를 사용하여 서로를 격리시킬 수 있다.

<div class="content-ad"></div>

"Learning Containers From The Bottom Up" 기사를 읽어보세요. 그 기사는 컨테이너 학습 경로를 제시합니다.


![2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_1](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_1.png)


## 3. Docker 아키텍처

도커 아키텍처는 클라이언트-서버 모델로, 컨테이너화된 응용 프로그램의 생성, 배포, 및 배포를 가능하게 합니다.

<div class="content-ad"></div>

## 3.1. 고수준 아키텍처

도커의 고수준 아키텍처는 클라이언트-서버 모델을 중심으로 구성되어 있습니다. 여기서 클라이언트는 컨테이너 및 관련 리소스를 관리하기 위해 도커 데몬(서버)과 상호 작용합니다. 도커의 핵심 구성 요소로는 클라이언트, 데몬, 그리고 이미지가 있습니다. 클라이언트와 데몬은 REST API를 사용하여 통신하며 UNIX 소켓이나 네트워크 인터페이스를 통해 통신합니다.

![도커 아키텍처](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_2.png)

- 도커 클라이언트: 사용자가 명령어를 입력하고 도커 리소스를 관리하기 위해 상호 작용하는 명령줄 도구, API 또는 그래픽 인터페이스입니다. 클라이언트는 도커 데몬에 요청을 보내고 해당 명령어를 실행하게끔 조율합니다.
- 도커 데몬: 도커 엔진이라고도 불리며 호스트 머신에서 실행되는 백그라운드 서비스 및 장기 실행 프로세스로서 컨테이너 및 컨테이너 이미지를 실행하고 관리하는 작업을 실제로 수행합니다. 도커 데몬은 컨테이너의 수명주기를 관리하고 작동을 조율하는 역할을 담당합니다. 도커 클라이언트로부터 요청을 수신하고 컨테이너를 관리하며 다양한 도커 작업을 조율합니다. 데몬은 호스트 운영 체제의 커널과 상호 작용하여 컨테이너화, 네트워킹 및 저장소를 위한 커널 기능 및 모듈을 활용합니다.
- 도커 데스크톱: 맥, 윈도우 또는 리눅스 환경에 쉽게 설치할 수 있는 응용 프로그램으로, 컨테이너화된 애플리케이션 및 마이크로서비스를 빌드하고 공유할 수 있습니다. Docker Extensions를 사용하면 제3자 도구를 Docker 데스크톱 내에서 확장하여 기능을 추가할 수 있습니다.
- 도커 레지스트리: 컨테이너 이미지를 저장하는 레지스트리입니다. Docker Hub는 누구나 사용할 수 있는 공개 레지스트리이며, Docker는 기본적으로 Docker Hub에서 이미지를 찾도록 설정되어 있습니다.

<div class="content-ad"></div>

## 3.2. Low-level Architecture

각 기술에 대해 자세히 알아볼 것이지만, 먼저 30,000피트의 시점에서 아키텍처를 살펴보겠습니다:

![Architecture](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_3.png)

- Docker Desktop은 필요한 Linux 환경을 제공하기 위해 가상 머신(VM)을 사용합니다.
- VM 내에서 Docker 클라이언트는 RESTful API를 통해 Docker 데몬(dockerd)과 상호작용합니다.
- 그것은 컨테이너를 실행하는 데 사용되는 Containerd를 내부적으로 사용합니다. Containerd는 물리적 또는 가상 머신에서 컨테이너의 수명 주기를 관리하는 산업 표준 런타임입니다. 컨테이너를 생성하고 시작하며 중지하고 제거하는 데 사용되는 데몬 프로세스입니다.
- Containerd 플러그인을 추가하여 기능을 확장할 수 있습니다.
- 컨테이너가 시작되면 containerd의 일부인 shim (runtime v2) API가 containerd와 OCI 런타임 사이에 중개자 역할을 합니다.
- OCI 런타임은 컨테이너의 네임스페이스, 제어 그룹(cgroups), 기능 및 컨테이너화에 필요한 기타 설정을 설정하는 역할을 담당합니다. Linux 커널의 능력을 활용하여 리소스를 격리하고 제어하며 보안을 강화하고 컨테이너의 동작을 관리합니다. 프로세스에 대한 고도로 세분화된 리소스 할당 및 제어를 가능케 하는 Linux 커널 기능인 Cgroups은 컨테이너에 권한을 부여하여 권한과 시스템 자원에 대한 액세스를 정의하는 Linux 커널 내에서 권한을 제공합니다.

<div class="content-ad"></div>

## Docker CLI

Docker CLI 도구는 dockerd 데몬과 상호 작용하는 데 사용되는 명령줄 응용 프로그램입니다. 여러 유용한 기능을 포함하고 있습니다. 표준 UNIX 스타일의 인수를 처리하며 많은 경우 짧은 형식과 긴 형식을 모두 제공합니다.

깊이 관심이 있는 경우 저장소에서 모든 명령을 찾을 수 있습니다.

![이미지](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_4.png)

<div class="content-ad"></div>

## 도커 레지스트리

도커 레지스트리는 사용자가 컨테이너 이미지를 저장하고 배포할 수 있는 서비스입니다. 사용자는 이미지를 푸시하여 다른 팀 멤버나 시스템이 배포할 수 있도록 공개적으로 이용할 수 있는 중앙화된 또는 분산된 위치로 레지스트리를 활용할 수 있습니다.

OpenRegistry와 같이 분산된 레지스트리도 있습니다. 몇 달 전에 @kotokunaga.mail이 "P2P Container Image Distribution on IPFS With Containerd"에 관한 블로그 글을 작성했습니다. IPFS 지원은 nerdctl v0.14에서 소개되었습니다.

레지스트리 API와 상호 작용할 수 있는 다양한 도구가 있습니다:

<div class="content-ad"></div>

- 크레인: 원격 이미지 및 레지스트리와 상호 작용하는 도구입니다.
- 스코페오: 컨테이너 이미지 및 이미지 저장소에서 다양한 작업을 수행하는 명령 줄 유틸리티입니다.
- 레지스트리 API를 위한 클라이언트 인터페이스인 레그컨트롤입니다.

## BuildKit

BuildKit은 동시성, 캐시 효율성, Dockerfile에 독립적인 빌더 툴킷입니다.

BuildKit을 통합함으로써 사용자는 성능, 저장 공간 관리, 기능 기능성 및 보안 측면에서 개선을 볼 수 있어야 합니다.

<div class="content-ad"></div>

BuildKit 빌드를 활성화하려면 클라이언트 측에서 $ docker build를 호출할 때 DOCKER_BUILDKIT=1 환경 플래그를 전달하거나 /etc/docker/daemon.json 파일에서 '“features”: ' “buildkit”: true '를 설정한 후 데몬을 다시 시작하면 됩니다. 현재 리눅스 컨테이너 빌드만 지원됩니다.

BuildKit에는 두 가지 주요 구성 요소가 있습니다: buildctl과 buildkitd. buildctl은 gRPC 서버를 통해 buildkitd와 통신합니다. 시작할 때 sdnotify를 통해 init 데몬 (systemd)에 메시지를 보냅니다. 서비스 관리자에 서비스 시작이 완료되었음을 알리기 위해 sddaemon.SdNotify(거짓, sddaemon.SdNotifyReady)를 보내며 나중에 SdNotifyStopping을 보냅니다.

BuildKit은 여러 플랫폼용 빌드에서 잘 작동하도록 설계되었으며, 사용자가 빌드를 실행하는 아키텍처 및 운영 체제뿐만 아니라 여러 플랫폼을 위한 빌드도 지원합니다.

BuildKit은 실행하는 빌드에 대한 SLSA Provenance의 생성을 지원합니다. BuildKit이 생성하는 provenance 형식은 SLSA Provenance 형식에 의해 정의됩니다.

<div class="content-ad"></div>

## Buildx

도커 Buildx는 Moby BuildKit 빌더 툴킷에서 제공하는 기능을 완벽히 지원하는 도커 명령어를 확장하는 CLI 플러그인입니다. 도커 Buildx는 항상 BuildKit을 활성화합니다. 도커 빌드와 동일한 사용자 경험을 제공하며 생성된 스코프 빌더 인스턴스를 만들거나 여러 노드에 동시에 빌드하는 기능과 같은 많은 새로운 기능을 제공합니다.

아래는 예시 멀티 플랫폼 멀티 스테이지 이미지를 빌드하는 방법입니다:

```js
docker buildx build --platform <platform1>,<platform2>,... --tag <이미지_이름> --file <Dockerfile> .
```

<div class="content-ad"></div>

컨테이너 이미지를 만드는 대안 방법

컨테이너 이미지를 만들기 위해 오직 "Docker"만 사용할 필요는 없습니다. OCI 규격을 준수하는 컨테이너 이미지를 만드는 다양한 방법이 있습니다:

- google/ko

GitLab CI/CD 파이프라인에서 ko를 사용하고 싶으신가요? 아주 간단합니다:

<div class="content-ad"></div>

```js
$ KO_DEFAULTBASEIMAGE: gcr.io/distroless/static:nonroot
$ KO_DOCKER_REPO: ${CI_REGISTRY}/${CI_PROJECT_NAMESPACE}
$ ko login $CI_REGISTRY -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD
$ ko apply -B --bare -f your_deployment.yaml
```

취약점이 없는 컨테이너 이미지를 생성하고 싶나요? apko로 간단하게 만들 수 있어요!

여기 컨테이너 이미지 빌더 목록입니다:

- GoogleContainerTools/kaniko
- GoogleContainerTools/jib
- containers/podman (데몬 없이!)
- containers/buildah (데몬 없이!)
- moby/buildkit
- docker/buildx
- genuinetools/img
- uber/makisu (사용 중단)
- pivotal/kpack
- openshift/source-to-image
- buildpacks
- nix/ocitools
- rancher/kim
- shipwright
- earthly
- bazelbuild (rules_docker)

<div class="content-ad"></div>

보너스: 도커를 사용하지 않고 go-containerregistry 모듈을 사용하여 레이어 및 이미지 매니페스트를 프로그래밍 방식으로 작성하여 OCI 컨테이너 이미지를 작성하는 데 관심이 있다면 @ahmetb의 블로그 포스트를 확인해보세요.

## 컨테이너 런타임 인터페이스 (CRI)

Kubernetes (K8s)에 대해 들어봤나요? 아니라면 괜찮아요. 이 기사에서는 지금까지 이에 대해 언급하지 않았어요. Kubernetes에 대해 들어보지 못했다면 이 섹션을 건너뛰세요.

Kubernetes에는 "kubelet"이라는 구성 요소가 있습니다. 이는 Kubernetes 클러스터의 모든 노드(물리적인 머신)에서 실행되는 에이전트입니다. 컨테이너 런타임은 현대적인 컨테이너화된 아키텍처의 기본 구성 요소입니다.

<div class="content-ad"></div>

컨테이너 런타임 인터페이스(CRI)를 통해 Kubernetes는 CRI 규격을 준수하는 런타임을 사용할 수 있습니다. 모든 도커 이미지는 모든 컨테이너 런타임에서 실행할 수 있습니다.

다양한 컨테이너 런타임이 있습니다. 각각은 특별한 기능을 갖고 있으며 성능, 보안 및 기능성 사이에서 한정된 선택을 내립니다.

- containerd (CNCF 기준화)
- CRI-O (CNCF 인큐베이팅)
- gVisor
- Firecracker
- kata
- lxd
- Singularity (apptainer)
- SmartOS

dockershim

<div class="content-ad"></div>

도커셈은 도커를 위한 CRI 지원을 구현합니다. 과거에 쿠버네티스에는 도커셈이라 불리는 브릿지가 포함되어 있었는데, 이는 도커가 CRI와 함께 작동할 수 있도록 했습니다. v1.20부터 도커셈은 더 이상 유지되지 않을 것이며, 이는 쿠버네티스에서 도커가 더 이상 지원되지 않는다는 것을 의미합니다. 현재 쿠버네티스는 앞으로의 버전(아마도 v1.22)에서 도커에 대한 지원을 완전히 제거할 계획입니다.

## 컨테이너드

컨테이너드는 간단함, 견고함, 이식성에 중점을 둔 산업 표준 컨테이너 런타임입니다. 컨테이너드는 호스트 시스템의 완전한 컨테이너 라이프사이클을 관리할 수 있습니다: 이미지 전송 및 저장, 컨테이너 실행 및 감독, 저수준 저장 및 네트워크 연결 등을 포함합니다.

컨테이너드는 개발자나 최종 사용자가 직접 사용하는 대신, 더 큰 시스템에 임베드된 형태로 설계되었습니다.

<div class="content-ad"></div>

containerd는 Docker 데몬에서 사용하도록 설계되었으며, 컨테이너 런타임을 새 프로젝트로 분리했습니다.

containerd에 의해 컨테이너가 직접 스케줄링되므로 Docker에서 볼 수 없습니다.

![이미지](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_5.png)

crictl

<div class="content-ad"></div>

컨테이너 런타임 명령줄 인터페이스(CLI)는 시스템 및 응용 프로그램 문제 해결에 유용한 도구입니다. 컨테이너드 및 모든 다른 CRI 호환 컨테이너 런타임을 위해, 예를 들어 dockershim인 경우, 도커 CLI 대신 사용할 수 있는 대체 CLI로 crictl을 권장합니다. crictl은 모든 CRI 호환 컨테이너 런타임에서 일관되게 작동합니다. crictl은 사용자에게 더 나은 전환 경험을 제공하기 위해 도커 CLI와 유사하게 디자인되었지만 정확히 동일하지는 않습니다. 

많은 명령어는 이름까지 직접 매핑됩니다. 출력 형식도 유사합니다. 일부 실험적인 도커 명령어는 아직 매핑되지 않았습니다.

crictl의 범위는 문제 해결에 제한되어 있으며, 도커 CLI를 대체하는 것은 아닙니다. 도커의 CLI는 다양한 명령어 세트를 제공하여 매우 유용한 개발 도구인 반면, crictl은 노드 문제 해결에 충분한 명령어만을 제공합니다. 이는 생산 노드에서 사용하기에 더 안전할 것으로 생각됩니다.

<div class="content-ad"></div>

nerdctl (contaiNERD CTL)는 containerd를 위한 Docker 호환 CLI로, compose, rootless, lazy pulling (eStargz), OCIcrypt, P2P 이미지 배포 (IPFS), 이미지 서명 및 검증 지원이 포함되어 있습니다...

nerdctl의 목적은 Docker에 없는 containerd의 최첨단 기능을 실험하는 것을 용이하게 하는 것입니다. 부차적인 목표는 Kubernetes 클러스터의 디버깅에 유용할 수도 있습니다.

ctr

containerd 명령 줄 클라이언트는 ctr입니다.

<div class="content-ad"></div>

- 컨테이너 이미지를 가져오기:
`$ ctr images pull nginx:latest`

- 보유한 이미지 목록 표시:
`$ ctr images list`

- 이미지를 기반으로 컨테이너 실행:
`$ ctr container create nginx:latest nginx`

- 실행 중인 컨테이너 목록 표시:
`$ ctr container list`

- 컨테이너를 중지:
`$ ctr container delete nginx`

hands-on 경험으로 ctr에 대해 더 알아보세요!

## 컨테이너드 알아보기

containerd에 대해 더 알고 싶다면, /docs 폴더로 이동하세요.

<div class="content-ad"></div>

✨ 이미지 첨부:

![Docker image](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_6.png)

**서비스**

- containerd는 몇 가지 서비스를 초기화하고 클라이언트를 위해 gRPC 서비스 API를 제공합니다.

**플러그인**

<div class="content-ad"></div>

containerd는 사용자 지정 런타임, 스냅샷터, 콘텐츠 스토어 및 gRPC와 같이 정의된 인터페이스를 사용하여 기능을 확장할 수 있습니다.

containerd는 내부적으로 플러그인을 사용하여 내부 구현을 분리하고 안정적이며 외부 플러그인과 동등하게 처리할 수 있도록 합니다. containerd에 설치된 모든 플러그인을 확인하려면 다음 명령을 사용하십시오: $ ctr plugins ls:

```js
TYPE                            ID                PLATFORMS   STATUS
io.containerd.content.v1        content           -           ok
io.containerd.snapshotter.v1    btrfs             linux/amd64 ok
io.containerd.snapshotter.v1    aufs              linux/amd64 error
io.containerd.snapshotter.v1    native            linux/amd64 ok
io.containerd.snapshotter.v1    overlayfs         linux/amd64 ok
io.containerd.snapshotter.v1    zfs               linux/amd64 error
io.containerd.metadata.v1       bolt              -           ok
io.containerd.differ.v1         walking           linux/amd64 ok
...
```

위 출력에서 모든 플러그인과 로드하지 못한 플러그인을 확인할 수 있습니다. 특정 플러그인에 대한 자세한 정보를 얻으려면 다음 명령을 사용하십시오: $ ctr plugins ls -d id==aufs id==zfs

<div class="content-ad"></div>

containerd는 서버에서 모든 플러그인을 가져오기 위해 Introspectation Service를 호출합니다. 서비스 서버의 초기화 중에 LoadPlugins() 함수를 통해 모든 플러그인이 설정됩니다. Overlayfs 플러그인 등록이 작동하는 예시를 찾을 수 있습니다.

ttrpc

저 메모리 환경을 위한 GRPC입니다. HTTP, HTTP2, TLS를 필요로 하지 않는 가벼운 프로토콜입니다. Go stdlib context 패키지를 사용합니다.

ttrpc 클라이언트를 초기화하고 싶으신가요? 이렇게 하면 됩니다:

<div class="content-ad"></div>

```js
conn, err := dialer.ContextDialer(context.TODO(), timeout)
client := ttrpc.NewClient(conn)
```

연속성

연속성은 전송에 중립적인 파일 시스템 메타데이터 매니페스트 시스템 저장에 대한 실험을 위한 스테이징 영역입니다.

연속성을 사용하여 AtomicWriteFile()를 호출하는 간단한 예제가 여기 있습니다:

<div class="content-ad"></div>

```js
// AtomicWriteFile은 먼저 임시 파일에 데이터를 쓰고 rename을 호출하여 파일에 원자적으로 쓰는 함수입니다.
continuity.AtomicWriteFile(filename, bytes, 0666)
```

# 컴포넌트 깊은 탐구

이미 알고 계실 수도 있지만, Docker는 하드웨어 아래에서 수행되는 모든 마법을 하는 유일한 컴포넌트가 아닙니다.

## 컨테이너 이미지

<div class="content-ad"></div>

컨테이너 이미지가 무엇인지, Docker가 이미지를 빌드하고 저장하는 방식, 이러한 이미지가 컨테이너에서 어떻게 사용되는지를 알아야 합니다.

컨테이너 이미지는 실행 가능한 코드를 포함한 변경할 수 없는, 즉 정적인 파일이며, 일관되게 배포되어 임의의 환경에서 격리된 프로세스를 실행할 수 있도록 해줍니다. 부모-자식 관계와 이미지 레이어링의 개념이 있습니다. 이것은 파일 시스템이 내장된 아카이브로 볼 수 있습니다.

컨테이너 이미지는 JSON 매니페스트와 개별 파일 시스템 레이어의 조합으로, 부모 또는 기본 이미지 위에 구축됩니다. 이러한 레이어는 다양한 구성 요소 및 환경 설정을 재사용할 수 있도록 하여 사용자가 모든 것을 다시 만들 필요가 없게 합니다. 최적의 방식으로 레이어를 구성하면 컨테이너 크기를 줄이고 성능을 향상시킬 수 있습니다.

컨테이너 이미지는 클래스/객체 개념과 약간 유사합니다. 이미지는 클래스 또는 템플릿과 같으며 해당 템플릿의 인스턴스를 여러 개 생성할 수 있으며 OCI Runtime Specification이 있습니다. 이는 표준 컨테이너의 정의입니다.

<div class="content-ad"></div>

컨테이너 이미지는 오픈 표준을 사용하며 태그가 지정될 수도 있고 되지 않을 수도 있어서 진정한 식별자를 통해서만 검색될 수 있습니다.

![이미지](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_7.png)

기술적으로 이미지 없이 컨테이너를 실행할 필요는 없습니다! 궁금하신가요? 더 자세히 다룰 예정입니다.

저장소

<div class="content-ad"></div>

`containers/storage`는 Go 라이브러리로, 레이어, 이미지 및 컨테이너를 저장하고 관리하기 위한 메서드를 제공하는 것을 목표로 합니다.

도커 이미지는 여러 레이어로 구성됩니다. 각 레이어는 Dockerfile에서 특정 명령에 해당합니다.

Dockerfile

기본적으로 텍스트 파일에서 환경을 나타냅니다. 우리는 FROM으로 구성하려는 원하는 것들을 실행할 수 있습니다. Dockerfile은 최종적으로 우리가 컨테이너를 생성하는 데 사용할 수 있는 컨테이너 이미지를 만듭니다.

<div class="content-ad"></div>

도커 이니셜라이즈 명령어로 새로운 도커 파일을 쉽게 만들 수 있어요.

위의 개요는 최소한의 Dockerfile을 시각화한 것입니다:

![도커 파일](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_8.png)

레이어는 Copy-on-Write(CoW) 파일 시스템입니다. 각 레이어는 이전 레이어와의 차이점 집합입니다. 어떤 레이어든 서로 쌓을 수 있어요. 파일을 추가하거나 제거하면 새로운 레이어가 생성돼요.

<div class="content-ad"></div>

이미지는 여러 개의 레이어로 구성됩니다. 각 레이어는 Dockerfile에서의 한 명령을 나타냅니다. 여러 이미지가 동일한 레이어를 참조할 수 있습니다. 매우 마지막 레이어를 제외한 각 레이어는 읽기 전용입니다. 이미지는 상태를 저장하지 않습니다.

컨테이너는 읽기-쓰기 (RW) 레이어입니다. 이미지의 최상위 쓰기 가능한 레이어의 자식입니다. 컨테이너에 새로운 데이터를 추가하거나 기존 데이터를 수정하는 모든 쓰기 작업은 이 쓰기 가능한 레이어에 저장됩니다. 컨테이너가 삭제되면 쓰기 가능한 레이어도 삭제됩니다. 기본 이미지는 변경되지 않습니다. 각 컨테이너는 자체의 쓰기 가능한 컨테이너 레이어를 갖습니다. 하나의 이미지에서 여러 컨테이너를 파생할 수 있습니다. 모든 변경 사항(새 파일 작성, 기존 파일 수정, 파일 삭제 등)은 이 얇은 쓰기 가능한 컨테이너 레이어에 저장되며, 여러 컨테이너가 동일한 기본 이미지에 접근할 수 있으면서 자체 데이터 상태를 갖게 됩니다.

컨테이너 레이어에서는 Docker가 저장 드라이버를 사용하여 이미지 레이어 및 쓰기 가능한 컨테이너 레이어의 내용을 관리합니다. 각 저장 드라이버는 구현을 다르게 처리하나, 모든 드라이버는 쌓을 수 있는 이미지 레이어와 복사-온-라이트(CoW) 전략을 사용합니다.

레이어들은 내부적으로 이미지와 유사하게 저장됩니다. 각 레이어는 /var/lib/docker/`driver`/layerdb/`algorithm`에 별도의 디렉토리를 갖습니다. Docker는 모든 캐시를 /var/lib/docker/`driver`에 저장하며, 여기서 `driver`는 다시 저장 드라이버 overlay2를 가리킵니다. 자세한 내용은 여기를 참조하세요.

<div class="content-ad"></div>

$ docker ps -s 명령을 사용하여 실행 중인 컨테이너의 크기를 확인할 수 있습니다.

각 컨테이너의 쓰기 가능한 레이어에 사용된 디스크의 총 데이터 양은 크기이고, 가상 크기는 컨테이너에 의해 사용되는 읽기 전용 이미지 데이터와 컨테이너의 쓰기 가능한 레이어 크기의 데이터 양입니다.

다음은 최소한의 Go 파일을 작성해 봅시다:

```go
package main

func main() {
    println("Hello, World!")
}
```

<div class="content-ad"></div>

다음 명령을 실행하여 이미지를 빌드하세요:

```js
$ docker image build --tag minimal .
```

그러면 이 이미지를 미래의 예제에서 사용할 수 있습니다.

도커 매니페스트

<div class="content-ad"></div>

도커 Manifest는 이미지를 설명하고 태그, 이미지의 원본을 확인하기 위한 디지턼 서명, 그리고 문서와 같은 메타데이터를 제공하는 JSON 형식의 파일입니다. Manifest는 컨테이너 런타임에서 사용하기 위해 만들어졌습니다.

Manifest Lists(또는 “fat manifest”)는 v2.2 이미지 명세서에서 정의되었으며, 이미지 레지스트리 내에서 다중 아키텍처 및 다중 플랫폼 이미지를 지원하는 주된 목적으로 존재합니다. 도커가 현재 지원하는 IANA 미디어 유형이 여러 가지 있습니다. 새로운 manifest 목록 객체 유형을 보고, 생성하고, 푸시하려면 manifest-tool이 당신이 찾고 있는 도구입니다.

온라인에서 컨테이너 이미지와 해당 Manifest를 검사하려면 다음 링크를 사용하세요: https://oci.dag.dev/

더 깊이 이해하고 싶다면, dive 도구를 사용하여 컨테이너 이미지를 살펴볼 수 있습니다. $ dive minimal 명령을 실행하여 이미지에 대한 다음 정보를 얻을 수 있습니다:

<div class="content-ad"></div>

이미지의 총 크기가 316MB인 것은 golang:1.17.3-alpine3.14 이미지의 불필요한 종속성 때문입니다. 이미지를 최적화하기 위해 다중 단계 빌드를 사용할 수 있습니다.

여기서 scratch를 사용하고 있음을 주목해 주세요. FROM scratch는 Dockerfile에서 no-op이며 이미지에 추가적인 레이어를 만들지 않습니다. Docker에서 가장 작은 가능한 이미지이며 비어 있습니다 (폴더나 파일이 포함되어 있지 않음) 이미지를 빌드하기 위한 시작점입니다. scratch 이미지를 가져오거나 실행하거나 이름을 달아 다른 이미지에 태그를 붙일 수 없습니다.

<div class="content-ad"></div>

다이브 도구를 다시 실행하여 새 이미지 크기를 확인해보세요. 이제 1.2MB입니다!

또한, 디스트로리스 이미지에 대해 언급해보는 것이 좋습니다:

Drawbacks of Container Images

Security

<div class="content-ad"></div>

컨테이너 보안은 컨테이너 세계에서 중요한 역할을 합니다. IT 조직들은 사기성 이미지를 모니터링하고, 개발자들에게 최상의 실행 방법을 가르쳐야 합니다. 이미지에 대한 엔터프라이즈 강화를 원하신다면 Docker CIS 보안 기준을 확인해보세요. 보안을 위해 컨테이너 이미지를 분석하고 최상의 실행 방법 이미지를 만들기 위해 dockle, hadolint 등과 같은 도구를 사용할 수 있습니다.

예를 들어, 이미지의 사용자 라이브러리에 특정 취약점이 발견되었다고 가정해봅시다. 어떻게 스캔하고 어떻게 수정할 수 있을까요? 영향을 받는 영역은 무엇인가요?

감염된 베이스 이미지를 찾아 교체해야 합니다. 노드의 모든 하위 자식은 그 취약점에 영향을 받을 것입니다. 우리는 모든 이러한 레이어가 해당 레이어에서 상속되었음을 알고 있습니다. 따라서, 취약점에 영향을 받을 컨테이너들을 모두 이해해야 합니다.

컨테이너 이미지의 보안 취약점을 찾기 위해서는 정의된 패키지와 의존성을 분석하고, 알려진 보안 취약점을 확인해야 합니다. Aqua Security의 Trivy와 Quay의 Clair과 같은 스캐너는 최신 vuln-list를 사용하고 적극적으로 개발 중이므로 훌륭한 선택입니다.

<div class="content-ad"></div>

도커 스카우트는 이미지 내용을 분석하고 감지된 패키지와 취약점에 대한 자세한 보고서를 생성합니다. 또한 이미지 분석에서 발견된 문제를 해결하는 방법에 대한 제안도 제공할 수 있습니다.

@lizrice의 Container Security 도서도 꼭 확인해보세요! Batuhan은 보안 및 클라우드 네이티브 관점에서 도커 뉴스를 자신의 substack에서 공유하고 있어요.

기본적으로 안전한 컨테이너 이미지를 사용하세요: Chainguard Images by Chainguard는 최소주의와 보안을 위해 설계된 컨테이너 이미지 모음입니다. 이러한 이미지 중 많은 이미지는 distroless입니다. 즉, 애플리케이션 및 런타임 종속성만 포함하고 있으며 셸이나 패키지 관리자가 없습니다.

저장 요구량

<div class="content-ad"></div>

이미지는 컨테이너 레지스트리에 저장됩니다. 컨테이너 레지스트리는 Open Container Initiative (OCI) 규격을 준수하는 레지스트리입니다. 개발자로서 컨테이너 이미지를 저장, 공유 및 관리하기 쉽게 만들어줍니다. 컨테이너 레지스트리는 사실상 "Tarballs As A Service"입니다.

도커 레지스트리 HTTP API V2 규격은 Open Container Initiative (OCI)에서 distribution-spec으로 채택되었습니다.

스토리지 자원을 최적화하기 위해 사용하지 않는 컨테이너 이미지를 제거하는 것이 좋을 것입니다. 완료된 컨테이너는 자동으로 제거되지 않습니다.

컨테이너 이미지를 다운로드 크기를 줄이고 속도를 높이기 위해 eStargz를 사용하여 게으른 다운로드를 할 수 있습니다. (여기에 깊이 파헤친 노트가 있습니다.)

<div class="content-ad"></div>

가비지 수집은 컨테이너 자원을 효율적으로 관리하는 중요한 측면이며, containerd에는 사용되지 않는 리소스를 회수하기 위한 가비지 수집 메커니즘이 포함되어 있습니다.

또한, 컨테이너 이미지의 레이어를 암호화함으로써 빌드부터 런타임까지 끝간의 암호화를 보장할 수 있는 엄격한 신뢰 요구 사항을 얻을 수 있습니다. @lumjjb가 오픈컨테이너/image-spec에 Encrypted Layer Mediatype를 추가하는 아이디어를 제안했습니다. 이에 대해 더 알아보고 싶으시다면 CNCF 웨비나를 확인해보세요!

결국, 우리는 왜 컨테이너 레지스트리에서 레이어 암호화를 지원하지 않을까 생각했고, Harbor 레지스트리를 위한 제안서를 작성하기로 결정했습니다! SBOM 지원을 위해 다른 제안서를 제출했습니다.

<div class="content-ad"></div>

서명

보안 중심 단계를 포함하는 것이 중요합니다. 이미지를 스캔하여 이미지의 무결성을 확인하여 변조로부터 보호합니다. 이미지 내용을 빌드 시 디지털로 서명하고 사용 전에 서명된 데이터를 확인하여 빌드와 실행 시의 이미지 데이터를 변조로부터 보호하여 발행자와 소비자 간의 무결성과 출처를 보장합니다. 여기서 도커의 Content Trust가 필요하며, Sigstore/Cosign 및 Notary와 같은 도구들이 등장하는 이유입니다! cosign에 대해 자세히 알고 싶다면 @dlorenc의 "Signed Container Images"를 읽어보세요! Notary와 Cosign의 차이가 궁금하신가요?

Linux Foundation, BastionZero 및 Docker가 최근 발표한 OpenPubkey 프로젝트에 대해 자세히 알아보세요 - OpenPubkey와 Sigstore에 대해 더 알아보세요.

cosign, rekor, fulcio 및 gitsign에 대해 더 알아보세요!

<div class="content-ad"></div>

Software 구성품 목록

소프트웨어 공급망을 보호하기 위해서는 반드시 사용 중인 소프트웨어를 파악하는 것부터 시작해야 합니다. 라이브러리, 의존성, 패키지 등으로 구성된 소프트웨어 구성요소 목록을 작성해야 합니다. 우리는 이를 소프트웨어 재료라고 부를 수 있습니다. 이 "재료" 목록은 소프트웨어 부품 목록(Software Bill of Materials, SBOM)이라고 알려져 있습니다. SBOM은 주어진 소프트웨어를 빌드(컴파일 및 링크)하는 데 필요한 컴포넌트, 라이브러리 및 모듈의 완전하고 형식적인 구성 목록이며 공급망입니다.

Anchore의 syft 도구를 사용하여 컨테이너 이미지의 SBOM을 쉽게 생성한 후 grype로 취약점을 찾아 스캔할 수 있습니다!

실험적인 docker sbom 명령을 사용하여 컨테이너 이미지의 SBOM을 생성할 수 있습니다.

<div class="content-ad"></div>

## 컨테이너

리눅스 컨테이너는 리눅스에서 실행되는 하나 이상의 프로세스를 실행하기 위한 격리되고 제약된 상자일 뿐입니다. 여기서 '상자'라는 말은 독립된 프로세스가 자체 프로세스 이름공간을 가지고 시작한다는 것을 의미합니다. 컨테이너화된 프로세스는 시스템 호출을 통해 커널과 상호작용하며, 일반적인 프로세스와 마찬가지로 권한이 필요합니다. 컨테이너는 호스트 시스템의 커널을 공유하며 (선택적으로) 시스템 내의 다른 컨테이너로부터 격리됩니다. 최소한의 컨테이너는 그 안에 단일 실행 파일만 포함하고 있습니다.

컨테이너로 진입하면 해당 컨테이너 내에서 실행 중인 프로세스만 볼 수 있습니다. 일반적으로 컨테이너 당 한 프로세스를 사용합니다. 컨테이너 프로세스는 컨테이너 자체의 수명주기와 바인딩되어 있습니다: 컨테이너 시작/종료 시 컨테이너 프로세스도 시작/종료됩니다. 전체 수명주기가 엄격하게 결합되어 있습니다.

컨테이너를 사용하면 모든 종속성이 포함됩니다. 커널 상위에 필요한 것들이 모두 컨테이너 내에 패키지화되어 있습니다. 컨테이너는 호스트의 커널을 공유합니다. 컨테이너 내에서는 호스트의 전체 파일 시스템을 볼 수 없으며, 대신 루트 디렉토리가 만들어진 컨테이너에 맞게 변경됩니다. 컨테이너를 OS에서 실행할 때, 실제로는 아무 것도 설치하지 않습니다. 컨테이너는 OS 위에 위치하고 자체의 세계에서 실행됩니다.

<div class="content-ad"></div>

멋진 참고 자료: 컨테이너는 리눅스 프로세스가 아닙니다!

**네임스페이스**

리눅스 커널은 많은 응용 프로그램들이 시스템 상에서 실행될 수 있도록 공통 기능을 제공하는 개념을 갖고 있습니다. 이 개념은 네임스페이스라고 불립니다. 이것은 컨테이너 기술의 기반이 됩니다.

리눅스 네임스페이스는 파일 시스템, 사용자 관리, 마운트된 장치, 프로세스, 네트워크를 포함한 다양한 추상화를 위해 존재합니다.

<div class="content-ad"></div>

Namespace는 6 + 1단계에서 컨테이너가 격리를 가지도록 합니다. 각 네임스페이스의 목적은 특정 전역 시스템 자원을 추상화하여 네임스페이스 내 프로세스들이 전역 자원의 격리된 인스턴스를 갖는 것처럼 보이게 하는 것입니다.

![이미지](/assets/img/2024-06-19-HowdoesDockerACTUALLYworkTheHardWayAComprehensiveTechnicalDeepDiving_11.png)

사용자(USER): [CLONE_NEWUSER]: 사용자와 그룹 ID를 격리합니다. 프로세스의 사용자 ID와 그룹 ID는 사용자 네임스페이스 내외에서 다를 수 있습니다.

PID: (프로세스 ID): [CLONE_NEWPID]: 프로세스 ID를 격리하여 각 컨테이너가 자체 init을 갖도록 합니다. 프로세스는 네임스페이스 내부와 호스트 시스템 외부에서 두 개의 PID를 갖습니다. Docker 컨테이너 내에서 Init 시스템을 확인하세요. - @BeNitinAgarwal

<div class="content-ad"></div>

UTS(UNIX 시간 공유 시스템): [CLONE_NEWUTS]: 호스트 이름 (uname() 시스템 콜)과 네트워크 정보 서비스 (NIS) 도메인 이름을 격리합니다.

NET(네트워크): [CLONE_NEWNET]: 네트워크 인터페이스 컨트롤러를 격리합니다. (예: 장치, IP 주소, IP 라우팅 테이블, /proc/net 디렉토리, 포트 번호 등)

MNT(마운트): [CLONE_NEWNS]: 파일 시스템 마운트 지점을 격리합니다. (mount() 및 umount() 시스템 콜)

IPC(프로세스 간 통신): [CLONE_NEWIPC]: 시스템 V IPC 객체 및 POSIX 메시지 큐를 격리합니다.

<div class="content-ad"></div>

시간 네임스페이스에 대해 논의가 있었습니다.

네임스페이스 격리는 프로세스 그룹이 분리되어 다른 그룹의 리소스를 "보지" 못하게 하는 것을 의미합니다: [11]

- 다른 UTS 네임스페이스의 프로세스는 각각의 전용 호스트 이름을 볼 수 있고 독립적으로 호스트 이름을 편집할 수 있습니다.
- 다른 사용자 네임스페이스의 프로세스는 사용자 목록을 각자 가지고 있고 다른 프로세스에 영향을 주지 않고 사용자를 추가하거나 제거할 수 있습니다.
- 각 PID 네임스페이스의 프로세스는 해당 네임스페이스에 속한 각 PID에 대해 다른 PID를 받으며, 각 PID 네임스페이스는 자체 PID 트리를 가지고 있습니다.
- 프로세스는 항상 각 유형의 하나의 네임스페이스에 정확히 속해 있습니다.

프로세스를 네임스페이스에 넣음으로써 해당 프로세스에 표시되는 리소스를 제한할 수 있습니다. 네임스페이스의 기원은 Plan 9로 거슬러 올라갑니다.

<div class="content-ad"></div>

네임스페이스 개념은 리소스 관리와 우선 순위 설정을 적용하기 위해 cgroups의 도움으로 확장되었습니다: Linux 컨테이너는 제한된 리소스(예: 메모리, CPU, I/O, 네트워크 등)를 사용하도록 제어 그룹(cgroups)을 활용합니다. 이를 통해 컨테이너가 호스트 리소스를 모두 소비하는 것을 방지할 수 있습니다. 따라서 적절히 조정된 cgroups가 보안 관점에서 중요합니다.

제어 그룹 (cgroups)

Cgroups를 사용하면 격리의 특정 정도를 적용하고 프로세스가 수행할 수 있는 작업을 제한할 수 있습니다: 기능, 리소스 한도 등. 이것은 컨테이너의 런타임 정의의 기본 개념입니다. 컨테이너를 시작할 때 런타임은 새 cgroups를 생성합니다.

Cgroup은 CPU 및 메모리 사용량을 제한하는 것뿐만 아니라 /dev/sda1과 같은 장치 파일에 대한 액세스를 제한합니다.

<div class="content-ad"></div>

프로세스 그룹 내에서 허용된 총 프로세스 수를 제한하려면 pid라는 제어 그룹이 있습니다. 이는 포크 폭탄의 효과를 방지할 수 있습니다.

리눅스 커널은 cgroups에 관한 정보를 /sys/fs/cgroup에 주로 위치하는 의사 파일 시스템 세트를 통해 송수화합니다. 컨테이너 내부에서는 /proc에서 사용 가능한 자체 cgroup 목록이 있습니다. 각 cgroup은 cgroup.procs라는 인터페이스 파일을 갖고 있는데, 이 파일은 cgroup에 속한 모든 프로세스의 PID를 한 줄씩 나열합니다. [12]

루트리스 컨테이너
기본적으로 컨테이너는 루트로 실행됩니다. 그러나 컨테이너 내의 프로세스를 제어할 수 있는 공격자도 어떤 식으로든 컨테이너를 탈출해야 하며, 결국 호스트 머신에서 루트 권한을 가질 수밖에 없습니다.

Linux 커널의 사용자 네임스페이스(UserNS)를 사용하여 가짜 권한을 에뮬레이션하는 루트리스 컨테이너가 생성됩니다.

<div class="content-ad"></div>

Rootless containers는 권한이 없는 사용자가 컨테이너를 생성, 실행 및 관리할 수 있는 능력을 의미합니다. 권한이 없는 사용자는 관리자 권한이 없고 추가 권한을 요청할 수도 없습니다. 권한이 없는 사용자는 컨테이너가 실행될 사용자 및 그룹 범위를 관리합니다.

도커 19.03에서는 루트리스 모드 (루트리스 runc, containerd 및 BuildKit)의 거의 모든 기능을 제공하며 포트 포워딩 및 다중 컨테이너 네트워킹을 지원합니다. 리소스 제한 기능은 도커 20.10에서 Control Group v2를 사용하여 구현되었습니다. 즉, Control Group v1에서는 루트리스 컨테이너를 관리할 수 없습니다. cgroup v2 컨트롤러를 비루트 사용자에게 활성화하고 위임하는 것은 최신 버전 (≥ 244)의 systemd를 권장합니다. 이전 systemd는 cpuset 컨트롤러의 위임을 지원하지 않습니다. 버전 5.2보다 낮은 커널은 freezer 부족으로 권장되지 않습니다.

사용자 공간에서 특권 작업을 제한하는 몇 가지 라이브러리가 있습니다.

- rootless-containers/slirp4netns: 루트리스 네트워크 네임스페이스에 대한 사용자 모드 네트워킹("slirp")을 제공하여 네트워크 생성/상호 작용을 제한합니다.
- containers/fuse-overlayfs: rootless 컨테이너용 FUSE에서 overlay+shiftfs의 구현: 루트 파일 시스템 및 사용자 ID, 그룹 ID 처리를 상호 작용합니다.

<div class="content-ad"></div>

도커와 다른 컨테이너 엔진은 가능한 컨테이너 탈출 공격으로부터 호스트의 실제 루트를 보호하기 위해 RootlessKit을 사용합니다.

## 네임스페이스

네임스페이스는 리눅스 컨테이너의 기본적인 측면입니다!

리눅스 네임스페이스는 2002년 2.4.19 커널에서 원본이 되었습니다! 2006년부터 시작되어 미래에 이르기까지 추가 네임스페이스가 계속해서 추가되었습니다.

<div class="content-ad"></div>

적절한 컨테이너 지원 기능은 사용자 네임스페이스의 도입을 통해 커널 버전 3.8에서 완료되었습니다.

## 커널

커널은 "항상 메모리에 상주하는 운영 체제 코드 부분"으로, 하드웨어와 소프트웨어 구성 요소 간의 상호 작용을 용이하게 합니다. 전체 커널은 장치 드라이버를 통해 모든 하드웨어 리소스(예: I/O, 메모리, 암호화)를 제어하며, 이러한 리소스에 관한 프로세스 간 충돌을 조정하고 CPU 및 캐시 사용, 파일 시스템 및 네트워크 소켓의 공통 리소스 활용을 최적화합니다.

커널의 인터페이스는 저수준 추상화 계층입니다. 프로세스가 커널에 서비스를 요청할 때는 일반적으로 래퍼 함수를 통해 시스템 호출을 호출해야 합니다.

<div class="content-ad"></div>

도커 커널 모듈

커널 모듈은 Linux 커널에 동적으로 로드되어 기능을 확장하거나 특정 기능을 제공하는 코드 조각입니다. 도커의 경우 컨테이너화 및 저장 기능을 구현하기 위해 커널 기능과 모듈을 활용합니다.

overlay2 스토리지 드라이버는 여러 레이어의 컨테이너 이미지를 서로 쌓을 수 있는 복사본-쓰기(CoW) 메커니즘입니다. 이 드라이버는 Linux 커널이 제공하는 overlay 파일 시스템을 활용하여 여러 디렉토리를 단일 마운트 포인트 위에 쌓아서 파일 시스템의 통합적이고 레이어드된 뷰를 만듭니다.

모듈 overlay 경로를 확인하려면: $ modprobe overlay. 모듈 폴더는 /lib/modules/5.11.0–38-generic와 같은 위치에 저장됩니다.

<div class="content-ad"></div>

## 오픈 컨테이너 이니셔티브

오픈 컨테이너 이니셔티브(OCI)는 컨테이너 형식과 런타임에 대한 오픈 산업 표준을 만들기 위한 목적으로 구성된 경량의 오픈 거버넌스 구조(프로젝트)로, 리눅스 재단의 보호 아래 형성되었습니다. OCI는 2015년 6월 22일 Docker, CoreOS 및 기타 컨테이너 산업의 선도 업체들에 의해 시작되었습니다.

OCI는 현재 두 가지 명세를 포함하고 있습니다: 런타임 명세(runtime-spec) 및 이미지 명세(image-spec). 런타임 명세는 디스크에 풀어 헤처진 "파일 시스템 번들"을 실행하는 방법에 대해 기술합니다. 상위 수준에서, OCI 구현은 OCI 이미지를 다운로드한 다음 그 이미지를 OCI 런타임 파일 시스템 번들로 풀어 헤칩니다. 이 시점에서 OCI 런타임 번들은 OCI 런타임에 의해 실행됩니다.

OCI Slack 채널에 가입하여 최신 정보를 받아보세요!

<div class="content-ad"></div>

## OCI Runtime Spec

오픈 컨테이너 이니셔티브는 운영 체제 프로세스 및 응용 프로그램 컨테이너에 대한 표준 사양을 개발합니다. 오픈 컨테이너 이니셔티브 런타임 사양(opencontainers/runtime-spec)은 컨테이너의 구성, 실행 환경 및 수명 주기를 명시하는 것을 목표로 합니다.

컨테이너의 구성은 지원되는 플랫폼의 config.json으로 지정되며, 컨테이너를 생성할 수 있게 하는 필드를 설명합니다. 구성에 대한 JSON 스키마를 유효성 검사하려면 validate.go 파일을 사용하세요. 여기에는 일부 스키마 레이아웃이 있습니다:

- config-schema.json — 구성 스키마의 주요 진입점
- state-schema.json — 상태 JSON 스키마의 주요 진입점
- defs.json — 일반 유형에 대한 정의

<div class="content-ad"></div>

실행 환경은 컨테이너 내에서 실행되는 응용 프로그램이 런타임 중에 일관된 환경을 갖도록 지정되었으며, 컨테이너의 라이프사이클을 정의하는 공통 작업이 포함되어 있습니다. 

런타임은 다음 작업을 반드시 지원해야 합니다:

- 상태 `container-id`
- 생성 `container-id` `path-to-bundle`
- 시작 `container-id`
- 종료 `container-id` `signal`
- 삭제 `container-id`

runc

<div class="content-ad"></div>

runc은 OCI 사양에 따라 Linux 컨테이너를 생성하고 실행하는 CLI 도구입니다. runc는 컨테이너 이미지에 포함된 파일을 사용하여 컨테이너를 시작하고, Linux 커널에게 적절한 네임스페이스, cgroups 컨텍스트 등에서 프로세스를 시작하도록 지시합니다.

도커는 OCI에 그 새로운 노력의 중심이 되기 위해 컨테이너 형식 및 런타임인 runc을 기부하고 있습니다.

Go 자체의 런타임은 멀티 스레드입니다. setns(2)는 멀티 스레드 프로세스에 사용할 수 없습니다. 따라서 runC는 언어 런타임이 시작되기 전에 C 프로세스를 실행합니다. 그러나 이 작업은 Go의 main 함수에 도달하기 전에 수행되어야 합니다. 따라서 create 하위 명령어는 init 하위 명령어를 호출하고, init 하위 명령어는 init() 함수에서 C 프로세스를 호출합니다. nsenter 패키지는 Go 런타임이 부팅될 기회가 생기기 전에 호출되는 특별한 init 생성자를 등록합니다.

runc은 컨테이너 프로세스가 시작되기 전에 환경 설정을 위해 C로 작성된 libcontainer 모듈을 사용하여 자체를 다시 실행합니다.

<div class="content-ad"></div>

## crun

crun은 컨테이너를 실행하는 빠르고 가볍고 완전한 기능을 제공하는 OCI 런타임 및 C 라이브러리입니다. Red Hat이 주도하는 C로 완전히 작성된 OCI Runtime Spec의 또 다른 구현체입니다. 수 년간 함께해 왔으며, cri-o의 기본 런타임입니다.

crun은 OCI 컨테이너를 관리하는 외부 프로세스를 필요로 하지 않고도 프로그램에 쉽게 포함될 수 있는 라이브러리로도 사용할 수 있도록 목표로 합니다.

crun은 /bin/true를 100번 실행하는 데 runc보다 49.4% 빠르며, 훨씬 낮은 메모리 풋프린트를 갖추고 있습니다.

<div class="content-ad"></div>


railcar (archieved)

railcar은 OCI 런타임 사양의 Rust 구현입니다. 참조 구현인 runc과 유사하지만, Rust로 완전히 구현되어 있어 메모리 안전성을 위해 가비지 컬렉터나 여러 스레드가 필요하지 않습니다.

@vishvananda의 "Rust로 컨테이너 런타임 빌드하는 방법" 기사를 놓치지 않는 것이 좋습니다.

youki


<div class="content-ad"></div>

youki는 Rust에서 OCI 런타임 사양을 구현한 프로젝트입니다! 프로젝트의 동기는 정말 멋집니다: 메모리 안정성, 더 빠르고 덜 메모리를 사용할 수 있는 가능성! 이 프로젝트는 railcar에서 영감을 받았습니다. 프로젝트의 설계 및 구현 세부 정보를 확인하는 것을 잊지 마세요.

## OCI 런타임 도구

runtime-tools는 OCI 런타임 사양과 함께 작업하는 도구 모음입니다:

-  $ oci-runtime-tool generate: OCI 번들을 위한 구성 JSON을 생성합니다. runc와 같은 OCI 호환 런타임은 구성을 config.json에서 읽을 것으로 예상합니다.
-  $ oci-runtime-tool validate: OCI 번들을 검증합니다. OCI 번들이 유효성 검사 과정에 실패하면 오류 메시지가 인쇄됩니다.
-  $ sudo RUNTIME=runc validation/default/default.t: 런타임 검증 스위트를 실행합니다. 예를 들어, youki의 integration_test.sh로 이동하여 테스트 케이스를 실행하는 방법을 확인할 수 있습니다. crun은 테스트를 실행하기 위해 oci-runtime-validation을 사용합니다. runc는 대부분 통합 테스트 케이스를 실행하기 위해 bats-core를 사용합니다.

<div class="content-ad"></div>

# 결론

도커의 내부 작업을 탐구하면 복잡하고 복잡한 기술 생태계와 협력이 드러나게 됩니다. 도커 데스크톱부터 리눅스 cgroups까지 고수준과 저수준 아키텍처에 대한 심층적인 탐구를 통해 컨테이너 세계가 처음에 보이던 것보다 간단하지 않음이 분명해졌습니다.

도커를 이해하는 여정은 다음과 같은 많은 가치 있는 통찰과 배움으로 가득했습니다:

- 컨테이너를 강력하고 다양하게 만드는 다양한 구성 요소를 원활하게 통합하기 위해 필요한 노력과 전문 지식에 대한 깊은 이해를 얻었습니다.
- 이 기술에 대한 이해력이 향상되었을 뿐만 아니라 끝에서 끝까지 프로세스를 원활하게 만드는 데 끊임없이 노력하는 무수히 많은 개인들의 협력을 강조했습니다.
- 복잡성을 수용하고 지속적인 학습에 투자하는 것은 우리가 컨테이너의 힘을 이용하고 번성하는 컨테이너화 생태계에 기여하는 데 도움이 될 것입니다.

<div class="content-ad"></div>

바투한 아페이딘과 야신 타하 에롤에게 기여해줘서 감사합니다!

# 다음 단계

최신 업계 뉴스, 프로젝트 및 새로운 릴리스에 대해 계속해서 최신 정보를 유지하는 중요성을 강조하는 것이 중요합니다. 컨테이너화 분야는 지속적으로 발전하고 있으며 개선과 혁신이 지속적으로 이루어지고 있습니다. 업계 트렌드를 적극적으로 따라가면 우리의 지식이 현재의 것이며 관련성을 유지할 수 있습니다.

뉴스를 따르고 Slack 및 메일 그룹에 참여하여 항상 최신 상태를 유지하세요:

<div class="content-ad"></div>

- Docker: [Blog](https://www.aquasec.com/cloud-native-academy/docker-container/docker-containers-vs-virtual-machines/) — [GitHub](https://www.tiejiang.org/23394.html) — [Twitter](https://www.pngegg.com/en/png-pbils) — [Slack](https://stackoverflow.com/a/47023753/5685796) — [HNRSS](https://ops.tips/blog/dockerfile-golang/) — [Reddit](https://blog.ramlot.eu/containers/)
- OCI: [GitHub](https://github.com/opencontainers/runtime-spec/blob/main/spec.md) — [Twitter](https://iximiuz.com/en/posts/oci-containers/) — [Slack](https://www.oreilly.com/library/view/kubernetes-in-action/9781617293726/) — [Mail Group](https://www.oreilly.com/library/view/container-security/9781492056690/)
- Containerd: [GitHub](https://github.com/containerd/containerd) — [Twitter](https://twitter.com/containerd) — [CNCF Slack](https://kubernetes.io/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/#crictl)

쿠버네티스와 같은 컨테이너 오케스트레이션 플랫폼을 배우면서 여러분의 스킬셋을 확장해보세요. 제가 강력히 권장하는 부분이죠. 이를 통해 실무 능력을 더욱 향상하고 복잡한 환경 내에서 컨테이너를 효율적으로 관리하고 오케스트레이션하는 방법에 대한 더 깊은 이해를 얻을 수 있을 거에요.

# 참고 자료

[0]: https://www.aquasec.com/cloud-native-academy/docker-container/docker-containers-vs-virtual-machines/
[1]: https://www.tiejiang.org/23394.html
[2]: https://www.pngegg.com/en/png-pbils
[3]: https://opencontainers.org/about/overview/
[4]: https://stackoverflow.com/a/47023753/5685796
[5]: https://ops.tips/blog/dockerfile-golang/
[6]: https://iximiuz.com/en/posts/oci-containers/
[7]: https://en.wikipedia.org/wiki/Linux_namespaces
[8]: https://man7.org/linux/man-pages/man7/namespaces.7.html
[9]: https://rootlesscontaine.rs/
[10]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux_atomic_host/7/html/managing_containers/signing_container_images
[11]: https://blog.ramlot.eu/containers/
[12]: https://facebookmicrosites.github.io/cgroup2/docs/create-cgroups.html
[13]: https://github.com/opencontainers/runtime-spec/blob/main/spec.md
[14]: https://www.reddit.com/r/rust/comments/pweqkb/comment/hejdot0
[15]: https://www.aquasec.com/cloud-native-academy/container-security/container-runtime-interface/
[16]: https://kubernetes.io/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/#crictl
[17]: https://www.oreilly.com/library/view/kubernetes-in-action/9781617293726/
[18]: https://developpaper.com/practice-of-docker-file-system/
[19]: https://www.alibabacloud.com/blog/cri-and-shimv2-a-new-idea-for-kubernetes-integrating-container-runtime_594783
[20]: https://vitalflux.com/docker-images-containers-internals-for-beginners/
[21]: https://www.oreilly.com/library/view/container-security/9781492056690/

<div class="content-ad"></div>

이 게시물이 유익했고 도커의 내부 작업을 종합적으로 탐구하는 것을 즐겁게 경험하셨기를 바랍니다. 언제든지 트위터나 GitHub에서 연락주세요.

![image](https://miro.medium.com/v2/resize:fit:292/0*KGm2_fqSSkfEfZbJ.gif)

푸르칸 튀르칼