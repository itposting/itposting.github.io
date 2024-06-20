---
title: "Docker 컨테이너의 심층 탐구  아키텍처와 기능"
description: ""
coverImage: "/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_0.png"
date: 2024-06-20 14:21
ogImage: 
  url: /assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_0.png
tag: Tech
originalTitle: "Deep Dive into Docker Containers | Architecture and Features"
link: "https://medium.com/@dmosyan/deep-dive-into-docker-containers-architecture-and-features-530a937f4c87"
---



![Container Architecture](/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_0.png)

# 개요

컨테이너는 코드와 모든 의존성을 포장하여 응용 프로그램이 한 컴퓨팅 환경에서 다른 환경으로 빠르고 신뢰성 있게 실행되도록 하는 표준 소프트웨어 단위입니다. VM과의 주요 차이점은 컨테이너가 자체 완전한 OS를 필요로하지 않는다는 것입니다. 사실, 동일 호스트의 모든 컨테이너는 호스트의 OS를 공유합니다. 이로써 CPU, RAM 및 저장소와 같은 대규모 시스템 리소스가 확보됩니다.

![Container Features](/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_1.png)


<div class="content-ad"></div>

컨테이너는 시작 속도가 빠르고 매우 휴대적입니다. 노트북에서 클라우드로 컨테이너 워크로드를 이동하고, 그리고 VM이나 데이터 센터의 베어 메탈로 이동하는 것도 쉽습니다.

마이크로소프트는 윈도우 플랫폼에 Docker와 컨테이너 기술을 도입하기 위해 매우 노력했습니다. 그러나, 윈도우 컨테이너를 개발하는 데 모든 노력을 기울였지만, 대부분의 컨테이너는 Linux 컨테이너입니다. 이는 Linux 컨테이너가 더 작고 빠르기 때문이며, 대부분의 도구가 Linux용으로 제공되기 때문입니다.

# Docker 기술

대부분의 사람들이 Docker에 대해 이야기할 때, 그들은 컨테이너를 실행하는 기술을 의미합니다. 그러나 Docker 기술이라고 언급할 때 주의해야 할 적어도 세 가지 사항이 있습니다.

<div class="content-ad"></div>

- 런타임
- 데몬 (엔진)
- 오케스트레이터

![Diagram](/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_2.png)

이 다이어그램을 살펴보겠습니다:

- 런타임은 가장 낮은 수준에서 작동하며 컨테이너의 시작 및 중지를 담당합니다(이 과정에는 namespaces 및 cgroups와 같은 모든 OS 구성요소를 작성하는 것이 포함됩니다).
- 하위 수준 런타임은 runc라고 하며 Open Containers Initiative (OCI) 런타임 사양의 참조 구현입니다. 그 역할은 기저 OS와 상호 작용하고 컨테이너를 시작 및 중지하는 것입니다. Docker 노드의 모든 컨테이너는 runc의 인스턴스에 의해 생성되고 시작되었습니다.
- 상위 수준 런타임은 containerd라고 합니다. 이것은 이미지를 가져오고 runc 인스턴스를 관리하는 등 전체 컨테이너 라이프사이클을 관리합니다.
- 전형적인 Docker 설치에는 runc에게 컨테이너의 시작 및 중지를 지시하는 단일 장기 프로세스인 containerd 프로세스가 있습니다. runc는 장기 프로세스가 아니며 컨테이너가 시작되자마자 종료됩니다.
- Docker 데몬 (dockerd)은 containerd 상위에 있으며 Docker API 노출, 이미지 관리, 볼륨 관리, 네트워크 관리 등과 같은 상위 수준 작업을 수행합니다. Docker 데몬의 주요 역할 중 하나는 하위 수준을 추상화하는 사용하기 쉬운 표준 인터페이스를 제공하는 것입니다.
- Docker는 또한 Docker를 실행하는 노드 클러스터를 관리하기 위한 기본 지원을 제공합니다. 이 클러스터들을 Docker Swarm이라고 하며 해당 기술은 Docker Swarm입니다. Docker Swarm은 사용하기 쉽고 많은 회사가 실제 제품에서 사용하고 있습니다. Kubernetes보다 간단하게 설치하고 관리할 수 있지만, Kubernetes의 고급 기능과 생태계를 많이 포함하지는 않습니다.

<div class="content-ad"></div>

# 도커 CLI 명령을 실행할 때 무슨 일이 벌어지나요

도커를 설치하면 두 가지 주요 구성 요소를 얻게 됩니다:

- 도커 클라이언트
- 도커 엔진 (가끔 "도커 데몬"이라고도 함)

엔진은 컨테이너를 실행하는 데 필요한 런타임, API 및 기타 모든 것을 구현합니다. 기본적인 리눅스 설치에서 클라이언트는 /var/run/docker.sock에있는 로컬 IPC/Unix 소켓을 통해 데몬과 통신합니다. 윈도우에서는 npipe:////./pipe/docker_engine을 통해 통신합니다.

<div class="content-ad"></div>

"Docker run"과 같은 명령을 Docker CLI에 입력할 때:

![image](/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_3.png)

1. Docker 클라이언트는 이를 적절한 API 데이터로 변환하여 Docker 데몬이 노출한 API 엔드포인트에 POST합니다. API는 데몬에 구현되어 있으며 로컬 소켓(리눅스 및 Windows에 대해 앞서 언급한 것과 같이) 또는 네트워크를 통해 노출될 수 있습니다.

2. 데몬이 새 컨테이너를 생성하는 명령을 받으면, containerd에 요청합니다. 더 이상 데몬에는 컨테이너를 생성하는 코드가 포함되어 있지 않습니다! 데몬은 gRPC를 통해 CRUD 스타일 API를 통해 containerd와 통신합니다.

<div class="content-ad"></div>

3. 이름에서 알 수 있듯이 containerd는 실제로 컨테이너를 만들 수 없어요. 그 작업은 runc가 처리해요. containerd는 필요한 Docker 이미지를 OCI 번들로 변환하고 이를 사용하여 새 컨테이너를 만들도록 runc에 알려줍니다.

4. runc은 OS 커널과 상호작용하여 컨테이너를 만들기 위해 필요한 모든 구성요소(네임스페이스, cgroups 등)를 모아냅니다. 컨테이너 프로세스는 runc의 하위 프로세스로 시작되며 시작되자마자 runc는 종료됩니다.

데몬으로부터 컨테이너 시작 및 관리 로직 및 코드를 모두 제거함으로써 전체 컨테이너 런타임이 Docker 데몬으로부터 분리되었습니다. 때로는 이를 "데몬 없는 컨테이너"라고 부르며, Docker 데몬을 유지보수 및 업그레이드할 때 실행 중인 컨테이너에 영향을주지 않도록 합니다.

이전 모델에서는 모든 컨테이너 런타임 로직이 데몬에 구현된 곳에서 데몬을 시작하고 중지하면 호스트의 모든 실행 중인 컨테이너가 제거되었습니다. 이것은 프로덕션 환경에서 큰 문제였어요.

<div class="content-ad"></div>

# 네임스페이스, cgroups 및 쉼은 무엇인가요?

**쉼**

위 다이어그램에서 쉼이라는 구성 요소를 주목했을 것입니다.

쉼은 데몬 없는 컨테이너의 구현에 필수적입니다 - 데몬 업그레이드와 같은 작업을 위해 실행 중인 컨테이너와 데몬을 분리하는 것을 방금 언급한 것입니다.

<div class="content-ad"></div>

우리는 이전에 containerd가 새로운 컨테이너를 만들 때 runc를 사용한다고 언급했습니다. containerd는 생성되는 각 컨테이너에 대해 runc의 새로운 인스턴스를 포크합니다. 그러나 각 컨테이너가 생성되면 runc 프로세스가 종료됩니다. 이는 수백 개의 컨테이너를 실행할 수 있지만 수백 개의 runc 인스턴스를 실행할 필요가 없다는 것을 의미합니다. 컨테이너의 부모인 runc 프로세스가 종료되면 관련된 containerd-shim 프로세스가 컨테이너의 부모가 됩니다.

컨테이너의 부모인 shim이 수행하는 책임 중 일부는 다음과 같습니다:

- 데몬이 다시 시작되어도 컨테이너가 파이프가 닫히는 등의 이유로 종료되지 않도록 STDIN 및 STDOUT 스트림을 열어두는 것
- 컨테이너의 종료 상태를 데몬에 다시 보고하는 것.

네임스페이스

<div class="content-ad"></div>

커널 네임스페이스는 컨테이너를 구축하는 데 사용되는 주요 기술입니다. 이 기술은 하이퍼바이저가 물리 자원(예: CPU 및 디스크)을 가상화하는 방식과 같이 운영 체제 구성 요소인 프로세스 트리와 파일 시스템을 가상화합니다.

컨테이너 모델에서 네임스페이스는 가상 프로세스 트리, 가상 파일 시스템 및 가상 네트워크 인터페이스와 같은 것들을 묶어 가상 운영 체제를 생성합니다. 각 가상 운영 체제는 컨테이너라고 불리며 일반적인 운영 체제와 똑같이 보이고 느껴집니다.

이 가상 운영 체제("컨테이너")를 사용하면 동일한 호스트에서 여러 웹 서버를 포트 충돌 없이 실행할 수 있는 멋진 기능을 제공합니다. 또한 동일한 호스트에서 여러 앱을 실행하면서 공유 구성 파일 및 라이브러리 간의 충돌 문제를 피할 수 있습니다.

![image](/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_4.png)

<div class="content-ad"></div>

리눅스의 도커는 현재 다음 커널 네임스페이스를 활용합니다:

- 프로세스 ID (pid)
- 네트워크 (net)
- 파일 시스템/마운트 (mnt)
- 프로세스 간 통신 (ipc)
- 사용자 (user)
- UTS (uts)

그러나 가장 중요한 것은 컨테이너가 네임스페이스의 조직화된 모음이라는 점을 이해하는 것입니다. 예를 들어, 각 컨테이너는 자체 pid, net, mnt, ipc, uts 및 아마도 사용자 네임스페이스를 갖습니다. 실제로 이러한 네임스페이스의 조직화된 모음을 우리는 "컨테이너"라고 부릅니다.

호스트는 "루트 네임스페이스"라고 하는 자체 네임스페이스 모음을 갖고 있습니다. 각 컨테이너에는 격리된 네임스페이스 모음이 있습니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_5.png" />

지배 그룹 (cgroups)

네임스페이스가 격리에 관한 것이라면, 제어 그룹(cgroups)은 제한에 관한 것입니다. 컨테이너를 호텔의 객실과 유사하다고 생각해보세요. 각각의 객실은 격리되어 있는 것처럼 보일 수 있지만, 모든 객실은 공통의 인프라 자원을 공유합니다. 즉, 수도 공급, 전기 공급, 수영장, 체육관, 엘리베이터, 조식 바와 같은 것들입니다.

Cgroups를 사용하면 (호텔 비유를 계속 사용할 때) 단일 컨테이너가 모든 물을 사용하거나 조식 바에서 모든 음식을 다 먹는 것을 막을 수 있습니다. 실제 세계에서 호텔 비유가 아닌 컨테이너는 서로 격리되어 있지만 CPU, RAM, 네트워크 및 디스크 I/O와 같은 공통의 리소스를 공유합니다. Cgroups를 사용하면 단일 컨테이너가 모든 리소스를 소비하고 서비스 거부(DoS) 공격을 유발하지 못하게 제한을 설정할 수 있습니다.

<div class="content-ad"></div>

# 보안 계층 개요

모든 좋은 컨테이너 플랫폼은 이름 공간과 cgroups를 사용하여 컨테이너를 구축합니다. 최상의 컨테이너 플랫폼은 기능(Capabilities), SELinux 및 AppArmor와 같은 의무적 접근 제어 시스템, 그리고 seccomp과 같은 다른 리눅스 보안 기술과 통합됩니다. 당연히 Docker도 이러한 기술들과 통합됩니다.

![이미지](/assets/img/2024-06-20-DeepDiveintoDockerContainersArchitectureandFeatures_6.png)

이미 지네임스페이스와 cgroups에 대해 논의했지만, 살펴볼 사항이 더 많습니다. 더 자세히 알아보고 싶다면 제공된 출처를 사용해보세요.

<div class="content-ad"></div>

소스: What is a Container? | Docker
Nigel Poulton의 "Docker Deep Dive"