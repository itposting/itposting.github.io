---
title: "제목 Debian12에서 자체 호스팅 Kubernetes 스택 만들기 및 kube-prometheus-stack로 모니터링하기"
description: ""
coverImage: "/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_0.png"
date: 2024-06-20 14:13
ogImage: 
  url: /assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_0.png
tag: Tech
originalTitle: "Creating a Self Hosted Kubernetes Stack on Debian12 and monitoring with kube-prometheus-stack"
link: "https://medium.com/@safewebbox/creating-a-self-hosted-kubernetes-stack-on-debian12-and-monitoring-with-kube-prometheus-stack-9fac44126d2a"
---


아래는 가정에서 Debian12 서버에서 Proxmox에 세 개 노드 Kubernetes 클러스터를 구축하는 지침입니다.

이 문서의 목적은 저희가 집에서 실행 중인 도커 서비스를 도커에서 Kubernetes 클러스터로 옮기고 kube-Prometheus-stack을 사용하여 전체 시스템을 모니터링하고 경보를 설정하는 것입니다.

<div class="content-ad"></div>

이 가이드는 저에게 도움이 되었고, 웹의 다양한 위치에서 뽑았습니다 (모든 참고자료는 아래에 있습니다).

# 3 노드 클러스터 구축하기

## 소개

모든 것은 어디선가 시작되어야 하며, Kubernetes로 테스트/실행할 환경을 갖고 있는 것은 좋은 생각입니다. 하이퍼스케일러와 같은 타사 업체들은 인그레스와 영구 저장소가 모두 설정된 환경을 제공해줄 것입니다. 하지만 아래 정보는 Debian 12를 사용하여 로컬 베어 메탈 테스트 환경을 만드는 데 사용됩니다. 제 경우에는 Proxmox에서 가상 플랫폼을 사용하고 있습니다.

<div class="content-ad"></div>

안녕하세요!

위의 내용을 한국어로 번역해 드리겠습니다.

참고:

이 작업은 이상적으로는 Ansible 코드로 실행되어야 하지만, 저는 아직 Ansible 코드를 작성하는 데 시간을 들이지 못해 수동 단계를 여기에 남겼습니다.

## 빌드

## 요구 사항

도움이 되었기를 바랍니다. 추가로 도와드릴 내용이 있으면 언제든지 말씀해 주세요.

<div class="content-ad"></div>

3대의 서버가 구축되어 실행 중이며 다음과 같은 사양을 갖추고 있습니다.

| 항목 | 설명 | 비고 |
|---|---|---|
| OS | Debian 12 | |
| CPU/vCPU | 4 | 최소 2 |
| RAM | 4GB | 최소 2GB |
| 디스크 | 100GB | 최소 20GB |
| IP | 정적 | DHCP 예약 |
| 기타 | 각 노드는 다른 노드의 IP에 핑을 보낼 수 있습니다. |

## 서버 설정

이 환경에서는 다음과 같이 3대의 서버가 설정되어 있습니다.

<div class="content-ad"></div>


Master Node - kube-master - 10.10.0.100 
Worker Node 1 - kube-worker01 - 10.10.0.101 
Worker Node 2 - kube-worker02 - 10.10.0.102


## 기본 OS 설정

다음 명령어는 기본 OS 설정을하고 로컬 DNS와 통신하는 데 사용됩니다.

외부 DNS 설정이있는 경우이를 사용하십시오. 이것은 테스트 환경이므로 서버가 어느 정도 자립 할 수 있도록하려고합니다.

<div class="content-ad"></div>

## sudo 설치

Debian 12에는 기본으로 sudo가 설치되어 있지 않습니다. 다음 단계를 따라 설치하고 사용자를 sudo 그룹에 추가하세요.

```js
su -
apt install sudo
usermod -aG sudo <사용자명>
```

## 호스트 이름 설정

<div class="content-ad"></div>

```js
kube-master - sudo hostnamectl set-hostname "kube-master.local" kube 
worker01 - sudo hostnamectl set-hostname "kube-worker01.local" kube 
worker02 - sudo hostnamectl set-hostname "kube-worker02.local"
```

Set /etc/hosts

On all three nodes run

```js
sudo nano /etc/hosts
```

<div class="content-ad"></div>

파일 끝에 다음을 추가해주세요

```js
10.10.0.100    kube-master.local    kube-master
10.10.0.101    kube-worker01.local    kube-worker01
10.10.0.102    kube-worker02.local    kube-worker02
```

## Swap 비활성화

Kubernetes는 Linux 스왑을 선호하지 않습니다. 모든 노드에서 스왑을 비활성화해주세요.

<div class="content-ad"></div>

```js
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

## 방화벽

UFW 또는 FirewallD가 기본적으로 설치되어 있지 않거나 활성화되어 있지 않습니다. 테스트 환경에서 실행하지 않았으므로 방화벽/UFW를 실행하려면 다음 명령을 실행하십시오. 이 가이드의 나머지 부분은 방화벽에 대해 다루지 않을 것입니다.

마스터 노드에서 실행하세요.

<div class="content-ad"></div>

```bash
sudo ufw allow 6443/tcp
sudo ufw allow 2379/tcp
sudo ufw allow 2380/tcp
sudo ufw allow 10250/tcp
sudo ufw allow 10251/tcp
sudo ufw allow 10252/tcp
sudo ufw allow 10255/tcp
sudo ufw reload
```

Worker Nodes,

```bash
sudo ufw allow 10250/tcp
sudo ufw allow 30000:32767/tcp
sudo ufw reload
```

## Containerd 설치하기

<div class="content-ad"></div>

Containerd는 Kubernetes의 컨테이너 지원을 제공해요.

이 명령어들은 모든 3개의 노드에서 실행되어야 해요.

다음과 같은 커널 매개변수를 설정하세요

```js
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF
```

<div class="content-ad"></div>

```shell
sudo modprobe overlay
sudo modprobe br_netfilter
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
```

위 변경 사항을 적용하세요.

```shell
sudo sysctl --system
```

containerd 패키지를 설치하세요.

<div class="content-ad"></div>

```js
sudo apt update
sudo apt -y install containerd
```

Kubernetes를 containerd를 사용하도록 설정합니다.

```js
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
```

마지막 명령어로 생성된 config.toml을 systemd를 사용하도록 수정하세요.

<div class="content-ad"></div>

```sh
sudo nano /etc/containerd/config.toml
```

아래와 같이 변경해주세요.

```sh
‘SystemdCgroup = false’
```

<div class="content-ad"></div>


시스템디C그룹 = true


저장하고 나가기

컨테이너디 다시 시작 및 활성화


sudo systemctl restart containerd
sudo systemctl enable containerd


<div class="content-ad"></div>

# Kubernetes 설정

모든 노드에서 실행하세요

## 리포지토리 추가

Kubernetes 패키지는 기본 리포지토리에 포함되어 있지 않으므로 추가해야 합니다

<div class="content-ad"></div>

```js
에코 "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] <https://pkgs.k8s.io/core:/stable:/v1.28/deb/> /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
curl -fsSL <https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key> | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

## Kube 도구 설치

```js
sudo apt update
sudo apt install kubelet kubeadm kubectl -y
sudo apt-mark hold kubelet kubeadm kubectl
```

# Kubernetes 클러스터 설치

<div class="content-ad"></div>

과거에는 kubelet이 명령줄 옵션을 허용했지만, 이러한 기능이 제거되었고 이제 YAML 파일을 사용하여 입력 옵션을 제공합니다.

마스터 노드에서만 실행하도록 설정해주세요.

## kubelet.yaml 파일 생성

홈 폴더에 파일을 생성하세요.

<div class="content-ad"></div>

```js
나노 kubelet.yaml
```

다음 내용 추가

```js
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: "1.28.0" 
controlPlaneEndpoint: "k8s-master"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
```

참고:

<div class="content-ad"></div>

라인 kubernetesVersion: "1.28.0"에는 더 최근 버전이 있을 수 있습니다. 1.30.0으로 시도해 봤지만 kube 패키지가 충분히 최신 상태가 아니라는 메시지를 받았습니다.

## Kubernetes Cluster 초기화

다음 명령어는 마스터 Kubernetes 노드를 설정합니다.

마스터 노드에서만 실행하세요

<div class="content-ad"></div>

```sh
sudo kubeadm init --config kubelet.yaml
```

위와 같이 출력이 나와야 합니다.

이와 유사한 출력은 마스터 노드에 성공적으로 제어 평면이 설치되었음을 확인합니다.

참고:

<div class="content-ad"></div>

## Kubectl 액세스 설정

친구야, Kubernetes 제어 평면에 kubectl 명령어 액세스를 활성화하기 위해 다음 설정을 완료해야 돼.

마스터 노드에서만 실행해.

<div class="content-ad"></div>

루트(root)로 실행하지 마세요

```js
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## Kubectl 명령어 테스트

kubectl 명령어를 테스트할 수 있습니다

<div class="content-ad"></div>

마스터 노드에서만 실행되요 :)

```js
kubectl get nodes
kubectl cluster-info
```

비슷한 출력이 표시돼요

```js
NAME                          STATUS   ROLES           AGE   VERSION
k8s-master.safewebbox.com     Ready    control-plane   24h   v1.28.11
```

<div class="content-ad"></div>

그리고

```js
Kubernetes 제어 평면은 <https://k8s-master:6443>에서 실행 중입니다.
CoreDNS는 <https://k8s-master:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy>에서 실행 중입니다.
```

## 워커 노드를 클러스터에 연결

이전에 마스터 노드에서 kubeadm init 명령을 실행했을 때 고유한 문자열이 포함된 kubectl join 명령이 제공되었습니다. 이 kubeadm join 명령이 지금 사용될 것입니다.

<div class="content-ad"></div>

## Join Command

워커 노드 01과 02에서 실행하세요

참고

당신의 명령어는 다를 것입니다. 이것을 그대로 복사하지 마세요. 이것은 마스터 노드에서의 출력을 예로 든 것입니다.

<div class="content-ad"></div>

```js
sudo kubeadm k8s-master:6443에 가입 --token 21nm87.x1lgd4jf0lqiiiau \\
--discovery-token-ca-cert-hash sha256:28b503f1f2a2592678724c482776f04b445c5f99d76915552f14e68a24b78009
```

성공 메시지는 다음과 같이 표시됩니다.

# 테스트 워커 노드가 올바르게 가입되었습니다.

마스터 노드에서 실행하기

<div class="content-ad"></div>

```js
kubectl get nodes
```

위 명령어를 입력하면 다음과 유사한 출력이 반환됩니다.

```js
NAME                          STATUS   ROLES           AGE   VERSION
k8s-master.safewebbox.com     Ready    control-plane   24시간   v1.28.11
k8s-worker01.safewebbox.com   Ready    <none>          23시간   v1.28.11
k8s-worker02.safewebbox.com   Ready    <none>          23시간   v1.28.11
```

# Pod Networking


<div class="content-ad"></div>

친구야, 
팟 네트워킹, 프록시 등을 돕기 위해 calico를 설치해야 해요.

## Calico 설치

마스터 노드에서 실행하세요.

```js
kubectl apply -f <https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml>
```

<div class="content-ad"></div>

## Calico 설치 확인

마스터 노드에서 실행

다음 명령을 실행하여 Calico를 위한 설정된 팟(컨테이너)을 확인하세요.

```js
kubectl get pods -n kube-system
```

<div class="content-ad"></div>

모든 파드의 실행 상태를 확인하려면 약 5분이 소요될 수 있습니다. 아래 명령어를 실행해 주세요.

```js
watch kubectl get pods -n kube-system
```

이 명령어는 변경 사항이 있을 때 명령어의 출력을 업데이트해 줍니다.

모든 파드가 실행 중일 때 준비됩니다.

<div class="content-ad"></div>


이름                                                준비됨   상태    재시작      나이
**calico-kube-controllers-7ddc4f45bc-sfjh5            1/1     실행중   0             24시간
calico-node-r5x4f                                   1/1     실행중   0             24시간
calico-node-wqmdq                                   1/1     실행중   0             24시간
calico-node-x6r45                                   1/1     실행중   0**             24시간
coredns-5dd5756b68-2mkb7                            1/1     실행중   0             24시간
coredns-5dd5756b68-l4b7j                            1/1     실행중   0             24시간
etcd-k8s-master.safewebbox.com                      1/1     실행중   0             24시간
kube-apiserver-k8s-master.safewebbox.com            1/1     실행중   0             24시간
kube-controller-manager-k8s-master.safewebbox.com   1/1     실행중   3 (23시간 전)   24시간
kube-proxy-5t2sj                                    1/1     실행중   0             24시간
kube-proxy-89ldw                                    1/1     실행중   0             24시간
kube-proxy-ckwl2                                    1/1     실행중   0             24시간
kube-scheduler-k8s-master.safewebbox.com            1/1     실행중   3 (23시간 전)   24시간


## 노드 확인

마스터 노드에서 실행

실행


<div class="content-ad"></div>

```js
kubectl get node
```

```js
이름                         상태     역할            시간    버전
k8s-master.safewebbox.com    준비     컨트롤 플레인    24시간 v1.28.11
k8s-worker01.safewebbox.com  준비     <없음>          24시간 v1.28.11
k8s-worker02.safewebbox.com  준비     <없음>          24시간 v1.28.11
```

# 원격 Kubernetes 클러스터에 로컬 액세스 설정하기

## 사전 요구 사항

<div class="content-ad"></div>

이 여정을 시작하기 전에 다음 사전 조건들을 갖추었는지 확인해주세요:

- 실행 중인 쿠버네티스 클러스터: 원격 쿠버네티스 클러스터가 kubeadm을 사용하여 배포되어 운영 중인지 확인하세요.
- 로컬에 kubectl 설치: 로컬 머신에 쿠버네티스 명령줄 도구인 kubectl을 설치하세요.
- 로컬 머신에서 kube-master.local 서버로의 SSH 접근

## 로컬 서버 설정

로컬 머신에서

<div class="content-ad"></div>

로컬 홈 폴더 아래에 .kube라는 폴더를 만들어 주세요.

```bash
cd
mkdir .kube
```

## 클러스터 구성 가져오기

로컬 머신에서

<div class="content-ad"></div>

파일 admin.conf을 /etc/kubernetes/ 디렉토리에서 kube-master.local 서버로 가져와야 합니다.

kube-master.local 서버의 원격 사용자가 user1이라고 가정하고 로컬 사용자가 해당 사용자로 kube-master.local에 ssh 할 수 있다면 다음 명령어를 사용해야 합니다.

```js
scp user1@kube-master.local:/etc/kubernetes/admin.conf .kube/config
```

참고:

<div class="content-ad"></div>

이 방법을 사용하면 로컬 머신을 사용하는 모든 사용자가 구성 파일을 가져와야 합니다.

## .kube/config 확인

로컬 머신에서

구성 파일이 올바르게 보이는지 확인하세요

<div class="content-ad"></div>

```yaml
apiVersion: v1
clusters:
- cluster:
    server: https://k8s-master:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDQVF8NC9FQS9FQURHQ0NBZ0VHQmJhbEJnVzJzZ0pzSERFUEhBdmrvUW9zYUM4bS9BTkJ3SUlxbnhBQVFWXjQKR0VBR01CRUdKQVNVQ0NRUWdVRHFKV3AwOUJMUWpRaXhxTU93WkljNW5kUU42MVl6TVJqVDlnREVzZUVJdEM0UkdBaktnZVFMUgpVZnlVeEIzVk1WOWJXRkpSRWh6UkVaUllXbDZiR0Y2YjJ4cGJteGhZMlJ2SUY5cmRYbDFZaTVZX2djaENjODBRakp0ClI5R1o2eG1KRXQ3R0cvaVd0WmMwRWdzY0d4Y00vM21jc1RuVFFJU1VUYkc2RUN0WTR6VEtxOW93bDBiTFJiYW1wbjRBUHMKZmxIcEt4ZFZYVDRNWGpGUHhnYWtaQkpIT01Iam5TWGlDRVdRcXE3WDdOYUdsS3ptN1FXX2tWeWw2Sjh3VHluNkJFbVd2cgp6SjIvUmdTc2J3TjU2V2JaSkJKUzFwTWJ5NCtpdG00OEVZdG1YaDduZW8vdGI2dURYNGJaeU85Ujgwb2I0YXNPM1pVcHoKTENHaFN3bUQ4ekRNNnpVSG1ubnNkMlRJVk42TDhYZXFqMVRBR0lJUVQ2TE02c0J6K1dxV1ppZjV6QU9VQ3pVSEFhCnbvNFNmVWlsbGc2NVVSVmNkbDZTaGZuN0ZpdjJOSGFiRW9aQnF3cG45bHZWYnkyNERhVDIvbFhQbDA0QkNpMWFDUk4KdEw4Z1FlbDBtTkhicGwrd3pFRno2b2hkN25ucGpHWHoxSW44Z3RwdnNnWWVnOGszbEd5NFgxTVJjM0krMFN6QmdrbAp6cUdaTVFqVnBzdkJkMzJSWTcxNmRlV3FJSEVEV1UyMjRBZmRoM3BRd0xHbUEyd1dEQjBHT3preUNYcTFFQWtMN2JICmJDcVdWcktOVTNpOGw5SktXQ2tML3dhMEdMOTNJMnNIVURRWHlXQmc0WUlvWTdPYURnOFB4bHlEbitqQlozb2RvTEIKalVXdmVYMjJ5TzMzT3BZVFN0cUErMDdIZjBiY0NmVVhCbnVTr1M2YUxMUDVkajQyb3BFbWttOGhxMUZUcTRRZwpHckpLMWtvR3lFdWVsM2VMMW01Qi9WL3RReWtZY1cwb0c3UVNudHIzY1RLcE1GSXFyQk81aTB0bmFzb3QzK3V3ClBWZVVGMmM3cG5hTnI0QmxsbzF2eE42T2dHczFNcndUb2lGSW1YK2NTMmZNL1NQckV3NUN4R0V6LzRYNDJGNFVCR25pCld0bzRWdFM3VUIyUmVvRDNZZUJaYkFNdnRYRExvT0QzNnczcTBtMllTWGorVU5WUjBYTk1aZ2tCQzdITWN2L29SQUkKS3I1VkpDM2ZRUGNjWURGcmVBd0tLb3hNdGd0SUpZMlBhZityaEV4cVZjYVJzQmZPMEVabGJPVTd1Mk5vMFQrUgp0Qlpnc29JdkozZFlUZktsZkZaNXg1NlE0Nk8rVWM4WC9kS1BzWkYweTVSNU9jWFFESmZkc3JGeWxRcWxzWmd3CmpiVEU5Qkhlb3p6cUR4V254Y1k2ZWNHcjFkeXpURE5yU2laekxHcHYwb1hwL3krajU2ZHRZbUJtUVJvUUFrN2kBWR7blEwcEt1eEkvNTZzNVlPcjRaZml2eThqbApmNDRMWEMraStSWWRRdWIzQ1NGQ0l3VVA1WE9VSFRPYk5HRkd3PS0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCgLwRG9jdW1lbnQ=
    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFUREPLDd5OHjRFAErlk;sdjgghjkl;sjkl;dfhgjwlk;sjkl;dfghjkl;sdfghkl;sdghjkl;lsdfgjkl;sdfghklsdafgjhkjldfhgjlksdfghjlk;sdfghjlk;sdfgsFWlWaXpQdVjRUdjgMmR6YWV5Q2hh
```

## kubectl 설정 업데이트

로컬 머신에서

내보내기 설정

<div class="content-ad"></div>


export KUBECONFIG=~/.kube/config


## kubectl 명령어 테스트

로컬 머신에서

다음 명령어를 로컬 사용자(user1)로 실행하세요.

<div class="content-ad"></div>

```js
kubectl config view
```

비슷한 내용이 표시될 것입니다.

```js
apiVersion: v1
clusters:
- cluster:
certificate-authority-data: DATA+OMITTED
server: <https://k8s-master:6443>
name: kubernetes
contexts:
- context:
cluster: kubernetes
user: kubernetes-admin
name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
user:
client-certificate-data: DATA+OMITTED
client-key-data: DATA+OMITTED
```

## Lens 설정


<div class="content-ad"></div>

## 렌즈란 무엇인가요?

렌즈는 Mirantis에서 개발한 크로스 플랫폼 GUI로, Kubernetes 클러스터를 보고 상호 작용하는 데 사용됩니다. Kubernetes를 학습하는 동안 (테스트) 클러스터 내에서 무슨 일이 벌어지고 있는지 확인하는 데 매우 유용합니다.

https://k8slens.dev/

## 렌즈 실행하기

<div class="content-ad"></div>

로컬 머신에서

선호하는 플랫폼에 Lens를 설치하세요

Lens 설정을 실행하세요

Lens 클라우드 계정 설정

<div class="content-ad"></div>

## Lens에 Kubernetes 클러스터 추가하기

로컬 머신에서

렌즈를 열면, 파일 → 클러스터 추가를 클릭해주세요.

.kube/config 파일의 내용을 붙여넣어주세요.

<div class="content-ad"></div>

```yaml
apiVersion: v1
clusters:
- cluster:sgsOQVFFTEJRQXdGVEVUTUJFR0EffhssdfghfhsdfgsgGN6QWVGdzB5TkRBMk1UZ3hNREEyTkRWYUZ3MHpOREEyTVRZeE1ERXhORFZhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUNybmJsem12dnV6UmVDYnUrSThHQ2VleWk3Tkc0eGFlQnNrcTlzUDBYM3ptUW1WZDlsQkdoNzRmeEEKSkRJOGJJSFArK2I2RTJJSW9OMXo4ODFqWXNSNkVpc0UzMkFpUmVyM2FHbEVtM2Z5N29VY1VGcFVxUG9ZYldzQQpUZlhWTlRHWVJBZmRhL25JZU4vbVZQZmNYU215WWoreEpKSnJwQzlaZDk3UzY4NzF3KzFhRTBmNnhUN1YrU2EwCjhGWTZpem5udWowVU5sQWpRcG9HL2xWdTZaYUlvR1Npdm1rT0NWLzNtaFpKZ1FEVFJpb2dsUG9rTGNkeFNHcm8KR0dHL3dJMXB0b2JJMVA1cXUyVmQrY3pIQmtMOXhodm1jMHVoa2dvTmhIMVowa2MxbERBSlk5clRtT0ZBMVNuMQphL00yWTNFS1BJNFgwdjF2UFEwSzNoeWVhbDV4QWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJUVHY2SWxTQU5CZVBuU3llM0hTZVRvRVdDTDZqQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQkx1MW5nVDd6dApwZWZMMDVSRERQbEljWWd6NWVjcU9hb2FzMkd5SEtkZHhXK1IwdDRXanZIUVFoS3pzOE5JVW1GcTlndm80dUxECkx6dDRGTWFOL3RhUEsyM0pPVUp1RDhjNE1TdmpZenZCK2NOb2FIQThjWmRodXBIYy9ydzFJQUhaSWxaZ3M1NjEKK0VVUzlwNDd6cU1BbHQ1QmxBREwreGxLUExuZEdzSzhBTVJRMVAzVkNxS1QyN2dieEZnRFYwU3VWRDRoUEF4UApZaVRKWkhTaTVpbTg1RFFsSTdiQ0hseTIyblg3UXZuRjNCNngvWjl5YjdjSUJYZXZpcEhTaHFGVUlrOXFCeFE2CjE0dnFGVHZFYVZRU1FxcEgyZUh1R21WbXJYekpjMytUWENzQ1BENjd0aGUxZGdMblBEaGRTWDcvY1JBS0NWa0gKaVMwMHBBUUducWM2Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: <https://k8s-master:6443>
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDfhjldfhjdfghjkl;dghjkl;szdg;hjzg;hjzdg;hjklzgZ0F3SUJBZ0lJSlFqYzlrb2hqZHN3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRBMk1UZ3hNREEyTkRWYUZ3MHlOVEEyTVRneE1ERXhORGRhTURReApGekFWQmdOVkJBb1REbk41YzNSbGJUcHRZWE4wWlhKek1Sa3dGd1lEVlFRREV4QnJkV0psY201bGRHVnpMV0ZrCmJXbHVNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXQ5c2dNeGt3Z0h1UTYrcU0KTTZ2VmlBY2Vmd1BCK0NGZzRkeVltelYxcEsrOEdBRWZ2Qjg1bmNhT1lVZzNPZHVPZXQ4V2JBcnBXM3JqZXVIRgpXQzlvd2hBRTVEeGNEK1h0TlZVaVZpelB1VkxMOEZ0REtCb1hwV3h5SFdIK2lNNkZFRmVrbVdiVDFlY3NJaXVMCkFlNWN3QkUrNitFa2VxUUtpWC9VdE9mNDlGaVJtdmhaS1BCYVlsZ1pjREdFYTVoeDNRM3JxYjcxYVB4Z0w3YUQKdURGNnpSRE5NUkt4VVZ1TjFROFJIei9Ia1FvNVNaUE1Lc1JtYzJ6MHpHN3gwWEVVM0s2cXA4UjJmMEFaT25LegpjdWFITkp3MFV2T25nYlpESUxQYTlXQ3dFclJKb2xxa0E2Zk1tRFRWY2dtYllYN0ZIWFMrZkg1YXB4engvK0Y4CkhDazlBUUlEQVFBQm8xWXdWREFPQmdOVkhROEJBZjhFQkFNQ0JhQXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUgKQXdJd0RBWURWUjBUQVFIL0JBSXdBREFmQmdOVkhTTUVHREFXZ0JUVHY2SWxTQU5CZVBuU3llM0hTZVRvRVdDTDZqQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQkx1MW5nVDd6dApwZWZMMDVSRERQbEljWWd6NWVjcU9hb2FzMkd5SEtkZHhXK1IwdDRXanZIUVFoS3pzOE5JVW1GcTlndm80dUxECkx6dDRGTWFOL3RhUEsyM0pPVUp1RDhjNE1TdmpZenZCK2NOb2FIQThjWmRodXBIYy9ydzFJQUhaSWxaZ3M1NjEKK0VVUzlwNDd6cU1BbHQ1QmxBREwreGxLUExuZEdzSzhBTVJRMVAzVkNxS1QyN2dieEZnRFYwU3VWRDRoUEF4UApZaVRKWkhTaTV

<div class="content-ad"></div>

## 뷰

초기 뷰는 다음과 같이 보입니다.

참고:

통계는 즉시 표시되지 않지만 Prometheus 설정이 설치되면 이 데이터가 표시됩니다.

<div class="content-ad"></div>

```
![Image](/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_1.png)

# 쿠버네티스 로드 밸런싱을 위해 MetaLB 설치

하이퍼스케일러 또는 제공된 버전의 Kubernetes와 자체 호스팅/온프렘 Kubernetes 설치의 주요 차이점은 간단합니다. Kubernetes 서비스 모델은 인그레스 포인트, 로드 밸런서, 지속적인 데이터 및 기타 여러 가지를 포함한 전체 설정을 제공할 것입니다.

하지만 자체 호스팅된 구성에서는 이러한 것들을 설정해주어야 합니다.


<div class="content-ad"></div>

이 지침은 MetaLB를 인그레스 포인트로 설정하고 사용하는 방법을 다룹니다. 이것은 basically 서비스(nginx, haproxy, grafana, prmetheus 등)가 쿠버네티스에서 MetaLB를 사용하여 인터넷/외부에서 액세스할 수 있도록 설정하는 것을 의미합니다.

# MetaLB란 무엇인가요?

chatGPT의 말을 인용하면,

MetaLB는 클라우드 환경이 아닌 베어메탈에서 실행되는 Kubernetes 클러스터용 로드 밸런서 구현체입니다(클라우드 환경에서는 일반적으로 클라우드 제공업체가 로드 밸런서를 제공합니다). MetaLB는 온프레미스 Kubernetes 환경 내에서 로드 밸런서를 생성할 수 있는 필수 구성 요소를 제공하여 클라우드 기반 로드 밸런서가 작동하는 방식과 유사하게 클러스터 외부에 서비스를 노출할 수 있도록 합니다.

<div class="content-ad"></div>

# MetalLB의 주요 기능

- 베어 메탈 클러스터용 로드 밸런서: MetalLB는 베어 메탈 하드웨어에서 실행되거나 로드 밸런서 지원이 없는 환경에서 Kubernetes 클러스터에서 LoadBalancer 유형 서비스를 사용할 수 있게 해줍니다.
- 다중 프로토콜 지원: MetalLB는 Layer 2(데이터 링크 계층) 및 BGP(Border Gateway Protocol) 모두를 지원하여 네트워크 내에서 IP 주소를 어떻게 관리하고 경유할지에 대한 유연성을 제공합니다.
- 구성 유연성: MetalLB를 사용자 고유의 네트워크 요구에 맞게 구성할 수 있습니다. 주소 풀 지정, 로드 밸런서의 동작 정의 등이 포함됩니다.
- Kubernetes 통합: MetalLB는 Kubernetes와 완벽하게 통합되어 있습니다. LoadBalancer 유형의 서비스 생성을 수신하고 미리 구성된 풀에서 해당 서비스에 IP 주소를 할당합니다.

# MetalLB 작동 방식

- Layer 2 모드: 이 모드에서 MetalLB는 ARP(Address Resolution Protocol)를 사용하여 IP 주소를 로컬 네트워크에 알리게 합니다. 이를 통해 Kubernetes 서비스 IP가 네트워크에서 로컬 IP처럼 보이도록 합니다.
- BGP 모드: BGP 모드에서 MetalLB는 BGP 프로토콜을 사용하여 서비스의 IP 주소를 네트워크 라우터에 광고합니다. 이를 통해 더 고급 라우팅 구성이 가능하며 대규모 및 복잡한 네트워크 환경에 적합합니다.

<div class="content-ad"></div>

# 전형적인 사용 사례

- 설치: MetaLB를 Kubernetes 클러스터에 설치하려면 필요한 매니페스트를 적용하거나 Helm과 같은 패키지 관리자를 사용하십시오.
- 구성: MetaLB를 구성하려면 주소 풀과 운영 모드(Layer 2 또는 BGP)를 정의하는 ConfigMap을 만듭니다.
- 서비스 생성: LoadBalancer 유형의 Kubernetes 서비스를 만들 때, MetaLB는 풀에서 IP 주소를 할당하고 접근 가능하게 만듭니다.

# 전제 조건

## IP 서브넷

<div class="content-ad"></div>

설정 중에는 네트워크에서 액세스할 수 있는 IP 주소 범위가 필요합니다.

이 지침에서는 내부 LAN의 10 IP 범위를 사용할 것입니다.

```js
10.10.0.240-10.10.0.250
```

## 쿠버네티스 클러스터 설정

<div class="content-ad"></div>

여기에서 해당 작업에 대한 지침을 찾을 수 있습니다.

**Kubernetes 3 노드 클러스터 구축 방법**

### 테스트 배포

Kubernetes 외부의 인그레스가 올바르게 작동하는지 테스트하기 위해 테스트 nginx 서비스를 설정합니다.

<div class="content-ad"></div>

## NginX 배포 생성

배포를 생성합니다.

```js
kubectl create deploy nginx --image=nginx:1.20
```

다음과 같이 배포, 레플리카셋 및 파드를 나열합니다.

<div class="content-ad"></div>

```yaml
kubectl get deploy,rs,po
```

예상 출력은

```yaml
kubectl get deploy,rs,po
```

```yaml
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx   1/1     1            1           39sNAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-6d777db949   1         1         1       38sNAME                         READY   STATUS    RESTARTS   AGE
pod/nginx-6d777db949-sr8x6   1/1     Running   0          38s
```

<div class="content-ad"></div>

Nginx 배포를 확장하려면

```bash
kubectl scale deploy/nginx --replicas=3
```

Nginx 배포를 3개 복제본으로 확장한 후, 예상 출력은

```bash
kubectl get deploy,rs,po
```

<div class="content-ad"></div>


**이름                    준비 상태   최신 상태   이용 가능   나이**
deployment.apps/nginx   3/3        3           3           2분 8초

이름                               원하는 상태   현재 상태   준비 상태   나이
replicaset.apps/nginx-6d777db949   3            3          3          2분 8초

이름                         **준비 상태                        상태               다시 시작   나이**
pod/nginx-6d777db949-jttpw   1/1         실행 중       0          23초
pod/nginx-6d777db949-qmdk8   1/1         실행 중       0          23초
pod/nginx-6d777db949-sr8x6   1/1         실행 중       0          2분 8초


위 배포에 대한 로드 밸런서 서비스를 생성해주세요


kubectl expose deploy/nginx --type=LoadBalancer --port=80


우리가 만든 nginx 서비스에 대해 설명해주세요


<div class="content-ad"></div>


```js
kubectl get svc
kubectl describe svc/nginx
```

다음과 같은 결과가 예상됩니다.

```js
**kubectl get svc**
```

```js
NAME         TYPE           CLUSTER-IP    **EXTERNAL-IP**   PORT(S)        AGE
kubernetes   ClusterIP      10.96.0.1     **<none>**        443/TCP        28m
nginx        LoadBalancer   10.103.19.189 **<pending>**     80:32019/TCP   5s
**kubectl describe svc/nginx**
Name:                     nginx
Namespace:                default
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx
Type:                     LoadBalancer
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.103.19.189
IPs:                      10.103.19.189
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  32019/TCP
Endpoints:                192.168.145.193:80,192.168.145.194:80,192.168.72.129:80
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

<div class="content-ad"></div>

Nginx 로드 밸런서 서비스의 외부 IP가 '보류 중'임을 알려드립니다. MetalLB 또는 유사한 로드 밸런서가 없는 경우 베어 메탈 K8s 클러스터에서 로드 밸런서 서비스는 외부 IP를 가져오지 못하므로 NodePort 서비스와 똑같이 작동하게 됩니다.

이는 예상하지 못한 일일지도 모릅니다. MetalLB가 로컬 K8s 클러스터의 이 문제를 해결해 줄 것입니다.

nginx 배포를 0으로 축소하세요.

```shell
kubectl scale deploy/nginx --replicas=0
```

<div class="content-ad"></div>

Kubernetes NGINX 배포가 완료되었습니다. 이것은 나중에 사용될 것입니다.

# MetalLB 설정

참고:

MetalLB에는 BGP 및 Layer2 모드가 있습니다. 이 안내서는 Layer2 모드를 설정합니다.

<div class="content-ad"></div>

## 네임스페이스 생성

MetaLB를 위한 네임스페이스를 만들어보세요.

```js
kubectl apply -fhttps://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/namespace.yaml
```

## 참고:

<div class="content-ad"></div>

Metal LB의 내부 사용을 위해 일부 IP 주소를 할당해야 합니다. IP 주소가 이미 사용 중이지 않도록 확인해야 합니다.

로드밸런서 서비스를 생성할 때마다 Kubernetes는 MetalLB 로드밸런서의 인스턴스를 생성합니다. Kubernetes는 구성 맵에 지정된 IP 주소 범위에서 사용 가능한 IP 주소를 선택하고 MetalLB 로드밸런서에 할당합니다. 그런 다음 MetalLB 로드밸런서는 우리의 응용 프로그램 배포를 위해 생성한 LB 서비스에 연결된 여러 Pod EndPoints를 로드 밸런싱합니다.

## 구성 파일 생성

로컬 머신에서

<div class="content-ad"></div>

메탈로드밸런서 설정을 위한 YAML 파일을 생성하세요.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - **10.10.0.240-10.10.0.250**
```

<div class="content-ad"></div>

아래 섹션은 위의 사전 준비 섹션에서 선택한 IP 범위를 사용합니다.

```js
addresses:
      - **10.10.0.240-10.10.0.250**
```

## 방화벽 설정

<div class="content-ad"></div>

3 노드 클러스터는 로컬 방화벽을 사용하지 않습니다. 여기에 참고용으로 추가했습니다.

```js
sudo firewall-cmd --permanent --add-port=7472/tcp --zone=trusted
sudo firewall-cmd --permanent --add-port=7472/udp --zone=trusted
sudo firewall-cmd --permanent --add-port=7946/tcp --zone=trusted
sudo firewall-cmd --permanent --add-port=7946/udp --zone=trusted
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

위 포트는 Metal LB에서 사용하는 기본 포트입니다. 수정했다면 해당 포트를 변경해야 합니다.

## 클러스터에 MetaLB 배포하기

<div class="content-ad"></div>

로컬 머신에서

```js
kubectl apply -f **metal-lb-cm.ymlkubectl** apply -f <https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/metallb.yaml>
```

metallb-system 네임스페이스 내에서 실행 중인 pod 목록을 나열해주세요.

```js
kubectl get pod -n metallb-system
```

<div class="content-ad"></div>

```js
이름                        준비 상태   상태      재시작    시간
controller-7fbf768f66-m66ph   1/1     실행 중   0          30초
speaker-hj669                 1/1     실행 중   0          30초
speaker-l9sbp                 1/1     실행 중   0          30초
speaker-q9jjf                 1/1     실행 중   0          30초
```

# MetaLB로 NginX 테스트 계속

MetaLB를 설치한 후에 Nginx 테스트를 계속 진행하여 이 작동 방식을 확인하세요.

## 레플리카 세트 확장하기

<div class="content-ad"></div>

Nginx 배포를 확장했습니다.

```js
kubectl scale deploy nginx --replicas=3
```

결과 출력:

```js
deployment.apps/nginx scaled
```

<div class="content-ad"></div>

로드 밸런서 서비스를 설명하고 외부 IP가 할당되었는지 확인해보세요.

```js
kubectl expose deploy nginx --type=LoadBalancer --port=80
```

출력 결과

```js
service/nginx가 노출되었습니다
```

<div class="content-ad"></div>

외부 IP가 할당되었는지 확인해 보세요

```js
kubectl get svc nginx
```

결과 값은 다음과 같아야 합니다

```js
NAME    TYPE           CLUSTER-IP    **EXTERNAL-IP**       PORT(S)        AGE
nginx   LoadBalancer   10.102.5.84   **10.10.0.240**       80:31829/TCP   5s
```

<div class="content-ad"></div>

이번에는 서비스를 보면 MetaLB가 해당 서비스에 대해 범위/풀에서 IP를 할당했습니다.

더 많은 세부 정보를 보려면 kubectl describe 명령을 사용해보세요.

```js
kubectl describe svc/nginx
```

```js
Name:                     nginx
Namespace:                default
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx
Type:                     LoadBalancer
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.102.5.84
IPs:                      10.102.5.84
**LoadBalancer Ingress:     110.10.0.240**
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  31829/TCP
**Endpoints:                192.168.145.195:80,192.168.145.196:80,192.168.72.132:80**
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason        Age   From                Message
  ----    ------        ----  ----                -------
  Normal  IPAllocated   31s   metallb-controller  Assigned IP "192.168.254.240"
  Normal  nodeAssigned  16s   metallb-speaker     announcing from node "master.tektutor.org"
```

<div class="content-ad"></div>

위에서 볼 수 있듯이, nginx 로드밸런서 서비스는 metallb 구성 맵에서 언급한 범위의 ExternalIP로 할당되었습니다.

이제 아래와 같이 서비스에 액세스할 수 있습니다.

```js
curl <http://10.10.0.240>
```

표시

<div class="content-ad"></div>

```js
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p><p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p><p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

# 완료

메타LB는 LoadBalancer로 정의된 서비스에 대해 외부 IP 주소를 할당합니다. ClusterIP와 달리, prometheus monitoring을 배포할 때 이를 기억하는 것이 중요합니다.

# 쿠버네티스 프로메테우스 모니터링 스택 설치

<div class="content-ad"></div>

3 노드 클러스터를 생성하고 Ingress를 위해 MetaLB를 클러스터에 설치하고 로컬 Linux 서버에서 클러스터에 원격 액세스를 설정했다면, 다음 단계는 모니터링을 배포하는 것입니다.

Prometheus 커뮤니티는 HELM을 사용하여 전체 모니터링 스택을 배포합니다. 배포는 쿠버네티스 클러스터에 Prometheus, AlertManager 및 Grafana를 설치하고 이러한 서비스를 경고, 대시보드, API 엔드포인트로 채워서 즉시 전체적인 개요를 얻을 수 있도록 합니다.

## 전제 조건

## Helm

<div class="content-ad"></div>

Helm이 설치되었습니다!

Helm을 설치하는 자세한 내용은 여기에서 확인할 수 있어요.

[https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)

## Helm이란 무엇인가요?

<div class="content-ad"></div>

헬름은 쿠버네티스용 패키지 매니저로, 쿠버네티스 클러스터에 애플리케이션 및 서비스를 배포, 관리, 구성하는 데 사용됩니다. 헬름 차트를 사용하여 사용자가 복잡한 쿠버네티스 애플리케이션을 정의, 설치, 업그레이드할 수 있어 배포 프로세스를 단순화합니다.

## 헬름의 주요 기능

- 패키지 관리: 헬름은 사용자가 쿠버네티스 리소스를 차트로 패키징할 수 있도록 해 주는데, 이는 일련의 쿠버네티스 리소스를 설명하는 파일 모음입니다.
- 버전 관리: 헬름 차트는 버전을 매길 수 있어 애플리케이션 업데이트와 롤백을 쉽게 관리할 수 있습니다.
- 템플릿화: 헬름은 템플릿을 사용하여 쿠버네티스 리소스를 정의하는데, 동적이고 재사용 가능한 구성을 가능하게 합니다. 템플릿은 다양한 배포 환경을 수용할 수 있도록 매개변수화될 수 있습니다.
- 릴리스 관리: 헬름은 차트의 인스턴스인 릴리스를 관리합니다. 이를 통해 쉽게 설치, 업그레이드, 롤백할 수 있습니다.
- 의존성 관리: 헬름 차트는 다른 차트에 대한 의존성을 지정할 수 있어 복잡한 애플리케이션 스택을 단일 단위로 배포할 수 있습니다.

## URL

<div class="content-ad"></div>

서비스는 GitHub을 통해 제공됩니다.

- <https://github.com/prometheus-community/helm-charts/tree/6f1bc9ed3f7eb9a8cb4711ca538fd0ddf71fcb96/charts/kube-prometheus-stack>
- <https://github.com/prometheus-community/helm-charts/tree/6f1bc9ed3f7eb9a8cb4711ca538fd0ddf71fcb96>

# Kube-Prometheus-stack 설치

## 네임스페이스 생성

<div class="content-ad"></div>

```bash
# 모니터링 스택을 위한 네임스페이스 생성

kubectl create ns monitoring
```

## 새로운 Helm 저장소 추가

helm을 사용하여 프로메테우스 스택을 위한 저장소를 추가해야 합니다.

<div class="content-ad"></div>

```js
helm repo add prometheus-community <https://prometheus-community.github.io/helm-charts>
```

```js
helm repo update
```

## values.yaml 편집

Helm 설치에는 helm 패키지에 내장된 values.yaml 파일이 있습니다. 이 설치를 사용하면 기본값을 재정의할 수 있는 values.yaml 파일을 생성해야 합니다. 이 값을 install 명령어에 전달하여 기본값을 재정의할 수 있습니다.

<div class="content-ad"></div>

알림

**기본 values.yaml 파일은 여기에서 찾을 수 있습니다: https://github.com/prometheus-community/helm-charts/blob/f5e395597054cc94ee7d9d92813552501c22266e/charts/kube-prometheus-stack/values.yaml#L4**

```js
nano values.yaml
```

다음을 추가하세요.

<div class="content-ad"></div>

```js
ruleSelectorNilUsesHelmValues: false
serviceMonitorSelectorNilUsesHelmValues: false
podMonitorSelectorNilUsesHelmValues: false
probeSelectorNilUsesHelmValues: false
scrapeConfigSelectorNilUsesHelmValues: false
```

```js
grafana:
  service:
    type: LoadBalancer
prometheus:
  service:
    type: LoadBalancer
alertmanager:
  service:
    type: LoadBalancer
```

마지막 세 개의 "서비스"인 그라파나, 프로메테우스, 알람매니저는 기본 설정인 ClusterIP를 재정의하여 외부 IP를 LoadBalancer로 설정했습니다. MetaLB를 사용하여 우리가 정의한 범위/풀에서 외부 IP를 이 서비스에 할당할 수 있습니다.

## Helm 배포

<div class="content-ad"></div>

kube-prometheus-stack을 Helm 업데이트 명령을 사용하여 배포하세요.

```js
helm upgrade --install -f **values.yaml** kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring
```

Kube-Prometheus 스택을 배포한 후에는 다음과 같은 기본 앱들을 얻습니다:

- Grafana
- Prometheus
- Alert Manager.

<div class="content-ad"></div>

# 배포 확인

## 파드가 실행 중인지 확인

```js
kubectl get pod -n monitoring
```

반응이 있어야 해요

<div class="content-ad"></div>

```js
이름                                                        준비 상태    상태    재시작    시간
alertmanager-kube-prometheus-stack-alertmanager-0           2/2         실행 중   0        21시간
kube-prometheus-stack-grafana-76858ff8dd-nnh94              3/3         실행 중   0        21시간
kube-prometheus-stack-kube-state-metrics-7f6967956d-tzrkm   1/1         실행 중   0        21시간
kube-prometheus-stack-operator-79b45fdb47-ccqc6             1/1         실행 중   0        21시간
kube-prometheus-stack-prometheus-node-exporter-bxbtc        1/1         실행 중   0        21시간
kube-prometheus-stack-prometheus-node-exporter-j9gjg        1/1         실행 중   0        21시간
kube-prometheus-stack-prometheus-node-exporter-r2fqw        1/1         실행 중   0        21시간
prometheus-kube-prometheus-stack-prometheus-0               2/2         실행 중   0        21시간
```

만약 파드가 계속 생성 중이라면

```js
watch kubectl get pod -n monitoring
```

위 명령을 사용해 주세요. 이 명령은 출력이 변경될 때마다 위의 결과를 업데이트합니다.

<div class="content-ad"></div>

## 서비스 확인하기

다음 명령어를 실행해 주세요

```js
kubectl get svc -n monitoring
```

출력 결과 확인해보세요 (좌우 스크롤 바 유의)

<div class="content-ad"></div>

```js
이 이름들은 존경스러운! 

각각의 접근 가능한 서비스는 외부 범위/풀에서 IP를 할당받아 TYPE = LoadBalancer로 지정되어야 합니다.

## 서비스 모니터 적용

서비스 모니터는 쿠버네티스에서 메트릭을 스크래핑하는 응용 프로그램을 정의합니다.
```

<div class="content-ad"></div>

아래와 같이 YAML 파일을 만들어주세요.


nano servicemonitor.yaml


다음 내용을 추가해주세요.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: prometheus-self
  labels:
    app: kube-prometheus-stack-prometheus
spec:
  endpoints:
  - interval: 30s
    port: web
  selector:
    matchLabels:
      app: kube-prometheus-stack-prometheus
```

<div class="content-ad"></div>

아래와 같이 코드를 실행해주세요.

```bash
kubectl apply -f servicemonitor.yaml -n monitoring
```

예상 결과는 다음과 같습니다.

```bash
servicemonitor.monitoring.coreos.com/prometheus-self가 생성되었습니다.
```

<div class="content-ad"></div>

# 인터페이스 보기

필요한 3가지 인터페이스가 설정되었으며 공개 인터페이스에 이용 가능합니다.

## 프로메테우스

### URL

<div class="content-ad"></div>

10.10.0.243에서 확인부탁드립니다.

## 홈페이지

<img src="/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_2.png" />

## 사전 정의된 알림

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_3.png)

# Alert Manager

## URL

http://10.10.0.242:9093


<div class="content-ad"></div>

## 홈

![이미지](/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_4.png)

# 그라파나

## URL

<div class="content-ad"></div>

http://10.10.0.241

## 기본 접근

- 사용자 이름: admin
- 비밀번호: prom-operator

## 사전 설치된 경고 규칙

<div class="content-ad"></div>


![PreInstalled Dashboards](/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_6.png)

![PreInstalled Dashboards](/assets/img/2024-06-20-CreatingaSelfHostedKubernetesStackonDebian12andmonitoringwithkube-prometheus-stack_7.png)


<div class="content-ad"></div>

# 시스로그를 위한 Promtail과 Loki 설치하기

# Helm Repos 설치

Grafana Helm 차트를 Helm cli에 추가하세요:

```js
helm repo add grafana <https://grafana.github.io/helm-charts>
helm repo update
```

<div class="content-ad"></div>

# Loki 설치하기

다음 명령어를 실행해주세요.

```js
helm upgrade --install loki grafana/loki-distributed -n monitoring --set service.type=LoadBalancer
```

# 포드 확인

<div class="content-ad"></div>

```js
watch kubectl get pods -n monitoring
```

원하는 출력

```js
NAME                                                        READY   STATUS    RESTARTS   AGE
alertmanager-kube-prometheus-stack-alertmanager-0           2/2     Running   0          23시간
kube-prometheus-stack-grafana-76858ff8dd-nnh94              3/3     Running   0          23시간
kube-prometheus-stack-kube-state-metrics-7f6967956d-tzrkm   1/1     Running   0          23시간
kube-prometheus-stack-operator-79b45fdb47-ccqc6             1/1     Running   0          23시간
kube-prometheus-stack-prometheus-node-exporter-bxbtc        1/1     Running   0          23시간
kube-prometheus-stack-prometheus-node-exporter-j9gjg        1/1     Running   0          23시간
kube-prometheus-stack-prometheus-node-exporter-r2fqw        1/1     Running   0          23시간
**loki-loki-distributed-distributor-b8448bd4b-2twdh           1/1     Running   0          3분15초
loki-loki-distributed-gateway-9d8b76d6d-mvxps               1/1     Running   0          3분15초
loki-loki-distributed-ingester-0                            1/1     Running   0          3분15초
loki-loki-distributed-querier-0                             1/1     Running   0          3분15초
loki-loki-distributed-query-frontend-6db884fbdd-zfs2s       1/1     Running   0          3분15초**
prometheus-kube-prometheus-stack-prometheus-0               2/2     Running   0          23시간
```

시작할 때 변경 사항을 보기 위해 watch 명령어를 사용하세요.

<div class="content-ad"></div>

```js
watch kubectl get pods -n monitoring
```

# 서비스 확인하기

실행하세요

```js
kubectl get services -n monitoring
```

<div class="content-ad"></div>

예상 결과

```js
NAME                                             TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
alertmanager-operated                            ClusterIP      None            <none>        9093/TCP,9094/TCP,9094/UDP      23h
kube-prometheus-stack-alertmanager               LoadBalancer   10.108.18.33    10.10.0.242   9093:31456/TCP,8080:31493/TCP   23h
kube-prometheus-stack-grafana                    LoadBalancer   10.105.8.65     10.10.0.241   80:31941/TCP    23h
kube-prometheus-stack-kube-state-metrics         ClusterIP      10.97.4.3       <none>        8080/TCP        23h
kube-prometheus-stack-operator                   ClusterIP      10.107.254.83   <none>        443/TCP         23h
kube-prometheus-stack-prometheus                 LoadBalancer   10.108.245.2    10.10.0.243   9090:30518/TCP,8080:31169/TCP   23h
kube-prometheus-stack-prometheus-node-exporter   ClusterIP      10.105.24.16    <none>        9100/TCP        23h
**loki-loki-distributed-distributor                ClusterIP      10.102.78.123   <none>        3100/TCP,9095/TCP               4m9s
loki-loki-distributed-gateway                    ClusterIP      10.97.122.135   <none>        80/TCP          4m9s
loki-loki-distributed-ingester                   ClusterIP      10.110.15.213   <none>        3100/TCP,9095/TCP               4m9s
loki-loki-distributed-ingester-headless          ClusterIP      None            <none>        3100/TCP,9095/TCP               4m9s
loki-loki-distributed-memberlist                 ClusterIP      None            <none>        7946/TCP        4m9s
loki-loki-distributed-querier                    ClusterIP      10.108.56.75    <none>        3100/TCP,9095/TCP               4m9s
loki-loki-distributed-querier-headless           ClusterIP      None            <none>        3100/TCP,9095/TCP               4m9s
loki-loki-distributed-query-frontend             ClusterIP      10.100.183.25   <none>        3100/TCP,9095/TCP,9096/TCP      4m9s
loki-loki-distributed-query-frontend-headless    ClusterIP      None            <none>        3100/TCP,9095/TCP,9096/TCP      4m9s
pro**metheus-operated                              ClusterIP      None            <none>        9090/TCP        23h
```

# 그라파나에 Loki 추가하기

그라파나의 홈 → 연결 → 데이터 소스로 이동하여 Loki 데이터 소스를 추가하세요.

<div class="content-ad"></div>

로키를 데이터 소스로 선택하세요

다음 URL을 사용하세요

```js
[http://loki-loki-distributed-query-frontend.monitoring:3100](http://loki-loki-distributed-query-frontend.monitoring:3100)
```

# 이 작업은 자동으로 수행됩니다

<div class="content-ad"></div>

요고를 values.yaml에 추가하면 Loki를 자동으로 설정할 수 있을 것 같아요.

```yaml
grafana:
  sidecar:
    datasources:
      defaultDatasourceEnabled: true
  additionalDataSources:
    - name: Loki
      type: loki
      url: <http://loki-loki-distributed-query-frontend.monitoring:3100>
```

# Promtail 설치

Promtail은 데이터를 Loki로 푸시합니다.

<div class="content-ad"></div>

A values 파일이 promtail 구성에 필요합니다.

```yaml
nano promtail-values.yaml
```

다음을 추가하세요.

```yaml
---
config:
clients:
- url: "<http://loki-loki-distributed-gateway/loki/api/v1/push>"
---
```

<div class="content-ad"></div>

해당 명령을 실행해보세요:

```js
helm upgrade --install promtail grafana/promtail -f promtail-values.yaml -n monitoring
```

# Pod 확인

```js
kubectl get pods -n monitoring
```

<div class="content-ad"></div>

원하는 표시

```js
NAME                                                        READY   STATUS    RESTARTS   AGE
alertmanager-kube-prometheus-stack-alertmanager-0           2/2     Running   0          23h
kube-prometheus-stack-grafana-76858ff8dd-nnh94              3/3     Running   0          23h
kube-prometheus-stack-kube-state-metrics-7f6967956d-tzrkm   1/1     Running   0          23h
kube-prometheus-stack-operator-79b45fdb47-ccqc6             1/1     Running   0          23h
kube-prometheus-stack-prometheus-node-exporter-bxbtc        1/1     Running   0          23h
kube-prometheus-stack-prometheus-node-exporter-j9gjg        1/1     Running   0          23h
kube-prometheus-stack-prometheus-node-exporter-r2fqw        1/1     Running   0          23h
loki-loki-distributed-distributor-b8448bd4b-2twdh           1/1     Running   0          22m
loki-loki-distributed-gateway-9d8b76d6d-mvxps               1/1     Running   0          22m
loki-loki-distributed-ingester-0                            1/1     Running   0          22m
loki-loki-distributed-querier-0                             1/1     Running   0          22m
loki-loki-distributed-query-frontend-6db884fbdd-zfs2s       1/1     Running   0          22m
prometheus-kube-prometheus-stack-prometheus-0               2/2     Running   0          23h
**promtail-25bjr                                              1/1     Running   0          3m21s
promtail-5kmlt                                              1/1     Running   0          3m21s
promtail-h9mrf                                              1/1     Running   0          3m21s**
```

변경 사항을 보면서 시작할 때 watch로 사용해보세요

```js
watch kubectl get pods -n monitoring
```

<div class="content-ad"></div>

# 서비스 확인

실행

```js
kubectl get services -n monitoring
```

예상 결과

<div class="content-ad"></div>

```js
이름                                               유형            클러스터 IP       외부 IP         포트       생성된 시간
alertmanager-operated                            ClusterIP      없음            없음           9093/TCP,9094/TCP,9094/UDP      23시간
kube-prometheus-stack-alertmanager               로드 밸런서     10.108.18.33    10.10.0.242    9093:31456/TCP,8080:31493/TCP   23시간
kube-prometheus-stack-grafana                    로드 밸런서     10.105.8.65     10.10.0.241    80:31941/TCP    23시간
kube-prometheus-stack-kube-state-metrics         ClusterIP      10.97.4.3       없음           8080/TCP        23시간
kube-prometheus-stack-operator                   ClusterIP      10.107.254.83   없음           443/TCP         23시간
kube-prometheus-stack-prometheus                 로드 밸런서     10.108.245.2    10.10.0.243    9090:30518/TCP,8080:31169/TCP   23시간
kube-prometheus-stack-prometheus-node-exporter   ClusterIP      10.105.24.16    없음           9100/TCP        23시간
loki-loki-distributed-distributor                ClusterIP      10.102.78.123   없음           3100/TCP,9095/TCP               24분
loki-loki-distributed-gateway                    ClusterIP      10.97.122.135   없음           80/TCP          24분
loki-loki-distributed-ingester                   ClusterIP      10.110.15.213   없음           3100/TCP,9095/TCP               24분
loki-loki-distributed-ingester-headless          ClusterIP      없음            없음           3100/TCP,9095/TCP               24분
loki-loki-distributed-memberlist                 ClusterIP      없음            없음           7946/TCP        24분
loki-loki-distributed-querier                    ClusterIP      10.108.56.75    없음           3100/TCP,9095/TCP               24분
loki-loki-distributed-querier-headless           ClusterIP      없음            없음           3100/TCP,9095/TCP               24분
loki-loki-distributed-query-frontend             ClusterIP      10.100.183.25   없음           3100/TCP,9095/TCP,9096/TCP      24분
loki-loki-distributed-query-frontend-headless    ClusterIP      없음            없음           3100/TCP,9095/TCP,9096/TCP      24분
prometheus-operated                              ClusterIP      없음            없음           9090/TCP        23시간
```

# 결과

이 결과를 통해

Grafana를 열 수 있습니다.

<div class="content-ad"></div>

해당 테이블 태그를 마크다운 형식으로 변경해주세요.

<div class="content-ad"></div>

# 생각

이것들은 조잡하고 대충 적은 메모입니다. 그러나, 나는 이 홈랩을 운영하는 방법으로 모든 것을 구현한 것이며, 다음 단계는 도커에서 실행 중인 것을 이 Kubernetes 클러스터로 마이그레이션하는 것입니다.

# 참고 자료

- https://www.linuxtechi.com/install-kubernetes-cluster-on-debian/
- https://k21academy.com/docker-kubernetes/accessing-remote-kubeadm-cluster/
- https://medium.com/tektutor/using-metal-lb-on-a-bare-metal-onprem-kubernetes-setup-6d036af1d20c
- https://medium.com/israeli-tech-radar/how-to-create-a-monitoring-stack-using-kube-prometheus-stack-part-1-eff8bf7ba9a9
- https://github.com/prometheus-community/helm-charts/tree/6f1bc9ed3f7eb9a8cb4711ca538fd0ddf71fcb96/charts/kube-prometheus-stack
- https://docs.appsealing.com/guide/4.%20On-Premise/7.%20Logging_and_monitoring_with_Prometheus_Grafana_Loki.html#what-is-this-content-based-on