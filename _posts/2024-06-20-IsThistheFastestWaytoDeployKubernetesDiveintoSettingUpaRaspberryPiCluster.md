---
title: "가장 빠른 쿠버네티스 배포 방법일까요 라즈베리 파이 클러스터 구축에 대해 알아봅시다"
description: ""
coverImage: "/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_0.png"
date: 2024-06-20 17:38
ogImage: 
  url: /assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_0.png
tag: Tech
originalTitle: "Is This the Fastest Way to Deploy Kubernetes? Dive into Setting Up a Raspberry Pi Cluster!"
link: "https://medium.com/@michael-tissen/is-this-the-fastest-way-to-deploy-kubernetes-dive-into-setting-up-a-raspberry-pi-cluster-16113ccce02b"
---


최근에 라즈베리 파이 4 싱글보드 컴퓨터를 사용하여 쿠버네티스 클러스터를 빠르고 쉽게 부트스트랩 할 수 있는 솔루션을 발견했어요. 이 솔루션은 다른 베어 메탈 클러스터에도 훌륭하게 작동해요.

![이미지](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_0.png)

# 문제점 - 왜 이것을 해야 할까요?

쿠버네티스 클러스터를 설정하고 필요한 모든 단계를 수행하는 방법에 대한 이전 자습서를 확인할 수 있어요:

<div class="content-ad"></div>

k3sup를 사용하더라도 아직 시간이 많이 소요되고 오류가 발생하기 쉬운 것 같아요.

# 더 나은 방법

Talos-Linux 및 Kubernetes 및 Talos-Linux 커뮤니티의 놀라운 작업 덕분에 빠르고 쉬운 해결책을 얻을 수 있어요. (https://www.talos.dev/)

## Talos Linux이란?

<div class="content-ad"></div>

태로스는 컨테이너를 최적화한 리눅스 배포판입니다. 쿠버네티스와 같은 분산 시스템을 위해 리눅스를 새롭게 상상해 만든 제품입니다. 실용성을 유지하면서 최대한 최소화된 디자인으로 제작되었습니다. 이러한 이유로 탈로스에는 몇 가지 고유한 기능들이 있습니다:

- 변경할 수 없습니다
- 원자적입니다
- 일시적입니다
- 최소화되어 있습니다
- 기본적으로 보안이 설정되어 있습니다
- 단일 선언 구성 파일과 gRPC API를 통해 관리됩니다

탈로스는 컨테이너, 클라우드, 가상화, 그리고 베어 메탈 플랫폼에 배포할 수 있습니다.

출처: https://www.talos.dev/v1.7/introduction/what-is-talos/

<div class="content-ad"></div>

## 왜 Talos Linux를 사용해야 할까요?

주로 API를 통해 제어할 수 있는 Kubernetes용 운영 체제입니다.

- Kubernetes를 사용하려면 구성해야 할 우분투 또는 유사한 배포판을 사용할 필요가 없습니다. Talos는 오직 Kubernetes를 위해 만들어졌습니다!
- Kubernetes 노드로 사용할 모든 장치는 Talos 이미지로 간편하게 로드됩니다.
- 부팅 과정 이후, 모든 장치는 유지 보수 모드에서 시작되어 추가 명령을 실행할 준비가 됩니다.
- talosctl 도구를 사용하여 Kubernetes 클러스터의 각 개별 노드가 어떻게 동작해야 하는지 구성할 수 있습니다.
- 모든 노드에 SSH를 설정할 필요가 없습니다.
- 모든 노드에 k3s 또는 유사한 것을 설치할 필요가 없습니다.
- 제어 노드에서 토큰을 복사하고 작업자 노드를 설정하기 위해 초기화할 때 고려해야 하는 번거로움이 없습니다.
- 호스트 컴퓨터로 kubectl 파일을 복사해야 하는 걱정을 할 필요가 없습니다.

## Talos-Bootstrap

<div class="content-ad"></div>

Talos-Linux과 talosctl은 Kubernetes 클러스터 초기화를 매우 간단하게 만듭니다. Talos의 API 중심적인 특성으로 인해 다른 도구들은 이러한 API를 사용하여 초기화를 더욱 간단하게 할 수 있습니다.

aenix-io의 놀라운 팀에서 만든 도구인 talos-bootstrap이 있습니다.

우리는 이 도구를 사용하여 기록 시간 안에 Kubernetes를 설정할 것입니다.

## 파이들을 준비하세요

<div class="content-ad"></div>

아래 명령어를 사용하여 Talos 이미지를 다운로드하세요. (https://www.talos.dev/v1.7/talos-guides/install/single-board-computers/rpi_generic/#download-the-image)

```bash
curl -LO https://factory.talos.dev/image/ee21ef4a5ef808a9b7484cc0dda0f25075021691c8c09a276591eedb638ea1f9/v1.7.0/metal-arm64.raw.xz
xz -d metal-arm64.raw.xz
```

라즈베리 파이 장치에 이미지를 플래싱하세요.

저는 Balena Etcher를 사용하고 있지만 별도의 플래시 도구를 사용할 수도 있습니다. 한 장치마다 요렇게 하세요.

<div class="content-ad"></div>

다운로드한 탈로스 이미지를 라즈베리 파이용으로 선택해주세요.

![Talos Image 1](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_1.png)

![Talos Image 2](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_2.png)

대상 드라이브를 선택하세요.

<div class="content-ad"></div>


![Image 3](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_3.png)

Finally flash the image

![Image 4](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_4.png)

![Image 5](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_5.png)


<div class="content-ad"></div>

## Talos Tools 준비 사항

먼저 talosctrl 도구를 설치해야 합니다.

```js
curl -sL https://talos.dev/install | sh
```

다음 단계에서는 talos-bootstrap 도구를 설치하세요.

<div class="content-ad"></div>

```bash
curl -LO https://github.com/aenix-io/talos-bootstrap/raw/master/talos-bootstrap
chmod +x ./talos-bootstrap
sudo mv ./talos-bootstrap /usr/local/bin/talos-bootstrap
```

## 보너스

전체 과정을 간편화하기 위해 개발 컨테이너 환경을 만들었습니다.

- devcontainers 확장 프로그램을 설치하세요 (https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
- 위의 저장소를 복제하세요.
- VSCode로 이 저장소를 열어보세요.

<div class="content-ad"></div>

제 Macbook Pro M1에서 Orbstack을 Docker 런타임으로 사용하여 전체 프로세스를 테스트했어요. 그러나 MacOS와 Linux에서 다른 Docker 런타임을 사용해도 잘 작동해야 합니다.

## 클러스터 부트스트랩

클러스터를 부트스트랩하려면 다음 명령을 실행하세요:

```js
talos-bootstrap install
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_6.png)

![Image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_7.png)

After some time, the talos-bootstrap should find your Raspberry Pi nodes in talos maintenance mode. Select your first node:

![Image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_8.png)


<div class="content-ad"></div>

그럼 역할을 선택할 수 있어요, 먼저 controlplane으로 시작할게요.

![control node](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_9.png)

해당 control 노드에 대한 호스트명을 입력해주세요.

![hostname](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_10.png)

<div class="content-ad"></div>

탈로스를 설치할 디스크를 선택해주세요:

![이미지](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_11.png)

저는 HDD와 USB 스틱이 연결되어 있습니다. 더 큰 240GB 디스크를 선택했습니다.

탈로스가 사용해야 할 네트워크 인터페이스를 선택해주세요:

<div class="content-ad"></div>


![Node custom address](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_12.png)

Select a custom address for your node.

![Gateway address](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_13.png)

Set your gateway address. In most cases, it's your router address.


<div class="content-ad"></div>


아래는 Markdown 형식으로 변경한 텍스트입니다.

![이미지](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_14.png)

기본 DNS 서버를 선택하세요.

![이미지](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_15.png)

다음 단계에서 클러스터에 대한 VIP(가상 공유 IP)를 선택할 수 있습니다.

<div class="content-ad"></div>


아래는 데모를 위해 두 개의 노드 클러스터를 설정한 주소입니다:

- 192.168.2.81
- 192.168.2.82

VIP 주소로 192.168.2.240를 선택했습니다. 또한 이는 DHCP 범위를 벗어난 곳에 있습니다.

<div class="content-ad"></div>

이것은 탈로스와 함께 제공되는 항목입니다. 아래와 같이 설명되어 있습니다.

원본

간단히 말해서, 클러스터 액세스를 위한 주소를 정의할 수 있습니다. 이는 실제 노드 주소와는 독립적입니다. 탈로스-리눅스의 매우 편리한 기능입니다.

Kubernetes 엔드포인트를 사용자 정의하십시오:

<div class="content-ad"></div>

아래와 같이 설정이 되었는지 확인해 주세요:

![Configuration 1](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_17.png)

다음 대화 상자에서 "예"를 선택해주세요.

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_19.png)

![image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_20.png)

다이얼로그를 완료하면 talos-boostrap을 실행하는 경로에 kubeconfig 파일이 생성됩니다.

![image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_21.png)


<div class="content-ad"></div>

## 테스트

```js
export KUBECONFIG=./kubeconfig
kubectl get nodes
```

다음과 같이 출력됩니다:

```js
NAME          STATUS   ROLES           AGE     VERSION
k8s-control   Ready    control-plane   4m55s   v1.30.1
```

<div class="content-ad"></div>

컨트롤 플레인이 성공적으로 생성되었습니다!

## 워커 노드

워커 노드의 경우, 대부분의 경우 작업 노드 역할을 선택하는 것을 제외하고 대부분 동일한 단계가 수행됩니다:

![이미지](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_22.png)

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_23.png)

![image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_24.png)

![image](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_25.png)

## Testing


<div class="content-ad"></div>

워커 노드에 시간을 주고 다시 다음을 실행해보세요:

```js
export KUBECONFIG=./kubeconfig
kubectl get nodes
```

이렇게 하면 클러스터 내 양쪽 노드를 볼 수 있을 겁니다:

![노드 이미지](/assets/img/2024-06-20-IsThistheFastestWaytoDeployKubernetesDiveintoSettingUpaRaspberryPiCluster_26.png)

<div class="content-ad"></div>

# 요약

지침을 읽어보면 모든 단계에 대해 설명이나 주석을 다 해 놓았기 때문에 클러스터 설정이 길어 보일 수 있지만, 제가 말하건대로 (모든 것이 순조롭게 진행된다면 🤞🏻) 5~10분 안에 설정이 완료됩니다. 🚀

이제 완전히 작동하는 클러스터를 갖추었으므로 인그레스, 스토리지, 인증서 또는 flux-cd와 같은 다른 유용한 구성 요소를 설치할 수 있습니다.