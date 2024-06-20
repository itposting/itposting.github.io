---
title: "단계별 안내 라즈베리 파이 4 클러스터에 K3s 설치하기"
description: ""
coverImage: "/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_0.png"
date: 2024-06-19 18:27
ogImage: 
  url: /assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_0.png
tag: Tech
originalTitle: "Step-By-Step Guide: Installing K3s on a Raspberry Pi 4 Cluster"
link: "https://medium.com/@stevenhoang/step-by-step-guide-installing-k3s-on-a-raspberry-pi-4-cluster-8c12243800b9"
---


이 게시물을 읽는 데 어려움이 있으면 여기를 확인하십시오.

이 안내서에서는 Raspberry Pi 4 클러스터에 K3s를 원활하게 설치하는 데 도움이 되는 유용한 팁을 공유하고 있습니다. 시작해 보겠습니다.

# Raspberry Pi4 클러스터 그림.

설치 프로세스를 시작하기 전에 라즈베리 파이 4 클러스터에서 각 노드에 할당된 대응하는 IP 주소와 클러스터 설정을 검토해 보겠습니다.

<div class="content-ad"></div>


![](/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_0.png)

우리 구성에서는 3대의 Raspberry Pi 4 장치가 스위치에 연결되어 있습니다. 이 스위치는 저의 인터넷 공급업체에서 제공한 라우터에 연결되어 있습니다. 추가로, 인터넷 접속을 위한 정적 공개 IP 주소가 제공되었습니다.

아래 표는 우리 Raspberry Pi 클러스터의 각 노드에 대한 특정 IP 구성을 요약합니다:

제가 192.168.1.85에서 실행 중인 Pi를 마스터 모드로 선택하여 아래 지침에 따라 설치를 시작하겠습니다.


<div class="content-ad"></div>


![Step-By-Step Guide Installing K3s on a Raspberry Pi 4 Cluster](/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_1.png)

# K3s Installation

# Pi Os installation

프로젝트에서 K3s 클러스터가 필요하다고 생각하여 Raspberry Pi OS Lite 64비트를 선택했습니다. 이 OS 변형은 데스크톱 환경이 포함되어 있지 않기 때문에 노드 설치에는 SSH가 주요 방법이 될 것입니다.


<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_2.png" />

SD 카드에 OS를 플래시하기 전에 각 노드의 노드 이름과 로그인 세부 정보를 구성하는 것이 매우 중요합니다.

<img src="/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_3.png" />

각 노드의 OS 준비가 완료되면 다음 클러스터를 설정했습니다:


<div class="content-ad"></div>

- pi-master: 192.168.1.85 (Pi OS Lite 64비트 실행 중)
- pi-node-1: 192.168.1.86 (Pi OS Lite 64비트 실행 중)
- pi-node-2: 192.168.1.87 (Pi OS Lite 64비트 실행 중)

클러스터에 연결하고 설치를 위해 Termius를 사용하고 있어요. 무료로 다운로드할 수 있어요.

# I. Pi를 위한 정적 IP 설정

기본적으로 Pi OS는 라우터로부터 무작위 IP를 받기 위해 DHCP를 사용하므로 노드 간 안정적인 연결을 보장하려면 각 노드에 대한 정적 IP를 설정해야 해요. 아래 단계를 따라 정적 IP를 구성할 거에요.

<div class="content-ad"></div>

```js
# 1. dhcpcd.conf 파일 열기
sudo nano /etc/dhcpcd.conf

# 2. 아래 매개변수를 라우터 IP 주소에 맞게 업데이트하세요.
interface eth0
static ip_address=192.168.1.85/24
static routers=192.168.1.254

# 3. 변경 사항을 저장하려면 Ctrl + X를 누릅니다.

# II. 스왑 비활성화

리눅스에 Kubernetes를 설치할 때는 Kubernetes가 리소스를 관리하는 방식 때문에 스왑을 비활성화하는 것이 좋습니다.

- 메모리 관리: Kubernetes는 리소스(메모리 포함)를 효율적으로 관리하고 할당합니다. 운영 체제가 스왑하도록 허용하면 Kubernetes의 메모리 관리 과정이 중단될 수 있습니다.
- 성능 이슈: 스왑은 성능 저하로 이어질 수 있습니다. Kubernetes가 디스크로 스왑된 내용에 액세스해야 할 때 지연이 발생할 수 있습니다.
- 예측성: 스왑을 비활성화하면 예측 가능한 성능을 보장하고 Kubernetes 프로세스가 시스템에서 스왑되지 않기 때문에 시스템의 프로세스가 스왑되는 경우가 없어집니다.
- Kubernetes 설계: Kubernetes는 스왑 활동 없이 작동하도록 설계되었습니다. Kubernetes는 애플리케이션이 메모리에 상주하는 것을 가정하며, 애플리케이션이 항상 메모리에 머물러 있다고 예상합니다.
```

<div class="content-ad"></div>

리눅스에서 스왑을 비활성화하려면 다음 명령을 사용할 수 있어요:

```js
# 1. 일시적으로 스왑 비활성화
sudo swapoff -a

# 2. 스왑을 영구적으로 비활성화하려면 `dphys-swapfile` 파일의 `CONF_SWAPSIZE`를 `0`으로 업데이트해야해요
sudo nano /etc/dphys-swapfile

# 3. 설정하기
  CONF_SWAPSIZE=0

# 4. 제어 + X를 눌러 변경 사항을 저장해 주세요.
```

# III. Cgroup 구성

만약 k3s 설치 중 FATA[0000] 메모리 cgroup (v2)를 찾지 못해 실패하는 오류가 발생한다면, Raspberry Pi OS에 필요한 cgroup 구성이 부족할 수 있어요. 이 문제를 해결하기 위해 필요한 단계는 아래와 같아요:

<div class="content-ad"></div>

```js
# 1. cmdline.txt 파일을 엽니다
sudo nano /boot/cmdline.txt

# 2. 현재 줄의 끝에 아래 내용을 추가합니다
cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory

# 3. 파일을 저장하고 시스템을 재부팅합니다
sudo reboot
```

# IV. 마스터 노드 설치

다음 명령을 실행하여 K3s 마스터 노드를 설치합니다. 클러스터 구성에 따라 IP 주소를 교체해주세요:

```js
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable=traefik --flannel-backend=host-gw --tls-san=192.168.1.85 --bind-address=192.168.1.85 --advertise-address=192.168.1.85 --node-ip=192.168.1.85 --cluster-init" sh -s -
```

<div class="content-ad"></div>

K3s 매개변수 검토:

- 서버: k3s를 서버 모드로 실행하도록 지시합니다 (에이전트 모드와는 반대). 서버 모드에서 k3s는 Kubernetes 마스터 구성 요소를 시작하고 관리합니다.
- — disable=traefik: 이 명령은 k3s에 Traefik 인그레스 컨트롤러를 비활성화하도록 지시합니다. 기본적으로 k3s에는 Traefik이 포함되어 활성화되어 있습니다. 이 플래그는 그것을 방지합니다.
- — flannel-backend=host-gw: 이 플래그는 Flannel (k3s의 기본 네트워크 공급자)의 백엔드를 설정합니다. host-gw 옵션은 클러스터의 각 노드에 대한 경로를 생성하여 고성능 네트워킹을 제공합니다.
- — tls-san=192.168.1.85: — tls-san 플래그는 자동으로 생성된 Kubernetes API 서버의 TLS 인증서에 포함되어야 하는 추가 IP 또는 DNS 이름을 지정할 수 있습니다. 이 플래그를 반복하여 여러 SAN을 추가할 수 있습니다. 값 192.168.1.85은 Kubernetes API 서버의 인증서에 대한 추가 대체 이름(SAN)입니다.
- — bind-address=192.168.1.85: k3s API 서버가 수신 대기할 IP 주소입니다.
- — advertise-address=192.168.1.85: k3s API 서버가 클러스터의 다른 노드에 알리기 위해 사용할 IP 주소입니다. 다른 노드는 API 서버에 연결하기 위해 이 IP를 사용합니다.
- — node-ip=192.168.1.85: 이것은 노드에서 Kubernetes 서비스에 사용해야 할 IP를 정의합니다.
- — cluster-init: 이 플래그는 k3s에 새로운 Kubernetes 클러스터를 초기화하도록 지시합니다. 이 플래그가 제공되지 않으면, k3s는 사용 가능한 기존 클러스터에 가입합니다.

설치 후, k3s 구성 파일은 /etc/rancher/k3s/k3s.yaml에 있어야 합니다. 이 구성을 사용하여 K8s Lend로 K3s 클러스터에 액세스할 수 있습니다.

아래는 예상되는 모습입니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_4.png" />

# V. Worker 노드 설치

워커 노드를 설치하려면 먼저 마스터 노드에서 K3S_TOKEN을 얻어야 합니다. 아래에 표시된 명령을 실행하여 토큰을 검색하세요:

```js
# 마스터 노드에서 노드 토큰 가져오기
sudo cat /var/lib/rancher/k3s/server/node-token

# 결과는 다음과 같습니다
  `THIS19937008cbde678aeaf200517f07c0ccd67dc80bdf4df6f746IS4780e15ebcd::server:40fc2cc2fnode81cdacc0b9bb1231token
```

<div class="content-ad"></div>

노드 토큰을 검색한 후, 아래에 표시된 스크립트에 삽입해야 합니다. 이 스크립트를 이전에 지정한 모든 Pi 노드에서 실행해야 합니다. 필요에 따라 K3S_URL과 관련된 IP 주소를 업데이트해 주세요.

```js
# 노드를 설치하려면 이 명령을 실행하세요
curl -sfL https://get.k3s.io | K3S_URL=https://192.168.1.85:6443 \
  K3S_TOKEN="THIS19937008cbde678aeaf200517f07c0ccd67dc80bdf4df6f746IS4780e15ebcd::server:40fc2cc2fnode81cdacc0b9bb1231token" sh -
```

축하합니다, 이제 K3s 클러스터를 사용할 준비가 되었습니다.

<img src="/assets/img/2024-06-19-Step-By-StepGuideInstallingK3sonaRaspberryPi4Cluster_5.png" />

<div class="content-ad"></div>

시간 내어 주셔서 정말 감사합니다! 감사합니다!

Steven Github