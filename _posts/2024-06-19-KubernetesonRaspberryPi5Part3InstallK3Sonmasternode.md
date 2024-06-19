---
title: "라즈베리 파이 5에서 쿠버네티스 - 3부 마스터 노드에 K3S 설치하기"
description: ""
coverImage: "/assets/img/2024-06-19-KubernetesonRaspberryPi5Part3InstallK3Sonmasternode_0.png"
date: 2024-06-19 18:16
ogImage: 
  url: /assets/img/2024-06-19-KubernetesonRaspberryPi5Part3InstallK3Sonmasternode_0.png
tag: Tech
originalTitle: "Kubernetes on Raspberry Pi 5 — Part 3 Install K3S on master node"
link: "https://medium.com/@ionutbanu/kubernetes-on-raspberry-pi-5-part-3-install-k3s-on-master-node-f95ea35a8b1c"
---


래즈베리 파이 4를 쿠버네티스 호스트로 약 두 년간 사용해 왔어요. 최근에 새로운 라즈베리 파이 5를 구매했어요. 새로 구매한 라즈베리 파이 5에도 쿠버네티스를 설정해 클러스터를 구성할 계획이에요.

# 라즈베리 파이 5에서 K3s 설정하기

부분 1 라즈베리 파이 OS Lite 64비트 설치하기

부분 2 외부 저장소 연결하기

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-KubernetesonRaspberryPi5Part3InstallK3Sonmasternode_0.png" />

- 커널 구성 파일 업데이트

cmdline.txt 파일에는 부팅 프로세스 중에 커널에 전달되는 명령줄 매개변수가 포함되어 있습니다. 이 파일에 몇 가지 매개변수를 추가해야 합니다. 다음 명령을 사용하여 파일을 열어보세요:

```js
sudo nano /boot/firmware/cmdline.txt
```

<div class="content-ad"></div>

한 줄에 매개변수 세트가 포함되어 있습니다. 줄 끝에 다음 매개변수를 추가하세요:

```js
cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory
```

파일을 저장하고 재부팅하세요:

```js
sudo reboot
```

<div class="content-ad"></div>

2. 마스터 노드 설정

k3s 마스터 노드가 될 장치에 연결하세요. k3s를 설치하기 전에 먼저 몇 가지 환경 변수를 추가해야 합니다.

다음은 제가 사용 중인 환경 변수입니다. `MASTER_NODE_IP` 자리 표시자를 교체해야 합니다.

- node-ip: k3s 에이전트 또는 서버가 실행 중인 노드(기계)의 IP 주소입니다. 이 IP 주소는 Kubernetes 제어 평면에서 노드를 식별하고 클러스터 내 통신을 용이하게 합니다.
- bind-address: k3s 클러스터 내 Kubernetes API 서버가 수신하는 IP 주소입니다. 특히 여러 네트워크 인터페이스가 있는 시나리오에서 API 서버가 특정 네트워크에서 접근 가능한지 확인하려는 경우 유용합니다.
- advertise-address: Kubernetes API 서버가 클러스터의 다른 구성원에게 광고하는 IP 주소입니다. 이 주소는 다른 노드 및 구성 요소가 API 서버에 연결하기 위해 사용됩니다.
- flannel-backend: Kubernetes 클러스터 내 팟 간 네트워킹을 제공하는 Flannel 네트워크 오버레이의 백엔드입니다. Flannel은 Kubernetes용으로 설계된 레이어 3 네트워크 패브릭을 구성하는 간단하고 쉬운 방법이며, 네트워크 트래픽이 어떻게 관리되고 경로 지정되는지를 결정하는 여러 백엔드를 지원합니다.
- disable=servicelb: 내장된 klipper-lb 서비스 로드 밸러서를 비활성화합니다. 외부 로드 밸런서를 사용하거나 사용자 정의 로드 밸런서 솔루션을 배치하거나 불필요한 구성 요소를 비활성화하여 리소스 사용량을 최적화하려는 경우 유용합니다. 저는 MetalLB를 사용할 것입니다.
- disable=traefik: k3s와 번들링된 기본 Traefik Ingress 컨트롤러를 비활성화합니다. 이 옵션은 다른 인그레스 컨트롤러를 사용하려는 경우, 인그레스 기능이 필요하지 않은 경우 또는 사용자 정의 인그레스 설정이 필요한 경우 유용합니다. 저는 nginx를 사용할 것입니다.
- disable-cloud-controller: 클라우드 컨트롤러 매니저를 비활성화합니다. 이 매니저는 Kubernetes를 클라우드 제공 업체 서비스와 통합하는 역할을 합니다. 이 옵션은 온프레미스 배포, 엣지 컴퓨팅, IoT 시나리오 또는 클라우드 제공 업체 통합이 필요하지 않은 상황에서 특히 유용합니다.
- disable-helm-controller: k3s가 Helm 컨트롤러를 배포하고 사용하는 것을 방지합니다. Kubernetes 애플리케이션을 관리하는 데 Helm 차트를 수동으로 관리하거나 Helm을 사용하지 않는 경우 유용합니다.
- cluster-init: 첫 번째 서버 노드를 설정해 새로운 Kubernetes 클러스터를 초기화하는 데 사용됩니다. 이 노드는 초기 제어 평면 노드 역할을 하고 클러스터를 위해 etcd 데이터 저장소를 준비합니다. 이 옵션은 새 클러스터를 생성할 때 중요하며, 고 가용성 설정이나 클러스터를 복구할 때 특히 유용합니다. --cluster-init로 클러스터를 초기화한 후 추가 서버 및 에이전트 노드가 클러스터에 참여하여 완전히 기능하는 Kubernetes 환경을 구성할 수 있습니다.

<div class="content-ad"></div>

```js
export K3S_NODE_NAME="pi-master"
export K3S_KUBECONFIG_MODE="600"
export INSTALL_K3S_EXEC="server --node-ip=<MASTER_NODE_IP> \
                                --bind-address=<MASTER_NODE_IP> \
                                --advertise-address=<MASTER_NODE_IP> \
                                --flannel-backend=host-gw \
                                --disable=servicelb \
                                --disable=traefik \
                                --disable-cloud-controller \
                                --disable-helm-controller \
                                --cluster-init"
```

설정 중인 K3S_KUBECONFIG_MODE="600"를 사용합니다. 이 환경 변수를 설정함으로써 생성된 kubeconfig 파일의 권한을 제어할 수 있습니다. 이것은 접근 제어를 관리하고 적절한 보안 설정을 적용하는 데 유용합니다. 600은 소유자 사용자가 파일 또는 디렉토리를 읽고 쓸 수 있고 다른 사용자는 액세스할 수 없음을 의미합니다.

이러한 변수를 설정한 후에는 다음 명령을 실행해야합니다:

```js
curl -sfL https://get.k3s.io | sh -
```

<div class="content-ad"></div>

k3s 서비스가 실행 중인지 확인하려면 다음 명령을 실행하십시오:

```js
sudo systemctl status k3s
```

출력은 아래와 유사한 텍스트 블록으로 시작됩니다:

```js
● k3s.service - 경량 Kubernetes
     Loaded: loaded (/etc/systemd/system/k3s.service; enabled; preset: enabled)
     Active: active (running) since Sat 2024-06-08 12:55:15 EEST; 20h ago
```

<div class="content-ad"></div>

K3S_KUBECONFIG_MODE="600을 사용했기 때문에 아직 kubectl을 사용할 수 없습니다. 환경 변수로 설정한 구성 파일을 복사해야 합니다.

```js
export KUBECONFIG=~/.kube/config
mkdir ~/.kube 2> /dev/null
sudo k3s kubectl config view --raw > "$KUBECONFIG"
chmod 600 "$KUBECONFIG"
```

환경 변수가 다시 시작 후에도 유지되려면 ~/.bashrc 파일 끝에 export KUBECONFIG=~/.kube/config 라인을 추가해야 합니다. 그런 다음 재시작하거나 이 명령어를 실행하면 됩니다: `source ~/.bashrc`.

이제 kubectl을 사용할 수 있습니다:

<div class="content-ad"></div>

```js
kubectl get pods -A
```

다음과 같은 출력을 보게 될 거에요:

```js
NAME                                      READY   STATUS    RESTARTS      AGE
coredns-6799fbcd5-246w2                   1/1     Running   3 (31m ago)   44h
local-path-provisioner-6c86858495-kmn7s   1/1     Running   5 (31m ago)   44h
metrics-server-54fd9b65b-kv4s4            1/1     Running   4 (31m ago)   44h
```

3. 원격으로 kubectl 설정하기

<div class="content-ad"></div>

귀하의 머신에서 K3S 클러스터에 연결하려면 kube 구성 파일이 필요합니다.

머신 터미널에서 마스터 노드에서 kube 구성 파일을 귀하의 머신으로 복사하는 다음 명령을 실행하십시오(`MASTER_NODE_IP` 플레이스홀더를 꼭 바꾸지 마십시오):

```js
scp pi@<MASTER_NODE_IP>:~/.kube/config ~/.kube/config
```

이제 원격으로 kubectl 명령을 실행할 수 있을 것입니다.

<div class="content-ad"></div>

# 완료했습니다!