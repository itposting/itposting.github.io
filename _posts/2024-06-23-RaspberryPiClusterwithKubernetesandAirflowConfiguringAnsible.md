---
title: "라즈베리 파이 클러스터 설정 Kubernetes와 Airflow, Ansible 사용 방법"
description: ""
coverImage: "/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_0.png"
date: 2024-06-23 18:09
ogImage: 
  url: /assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_0.png
tag: Tech
originalTitle: "Raspberry Pi Cluster with Kubernetes and Airflow: Configuring Ansible"
link: "https://medium.com/@robronayne/raspberry-pi-cluster-with-kubernetes-and-airflow-configuring-ansible-a713476d9b87"
---


<img src="/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_0.png" />

아래는 Ansible을 Raspberry Pi 클러스터에서 작동시키기 위해 취한 단계를 요약한 것입니다. 이 프로젝트의 동기는 Kubernetes 및 Airflow를 실행하는 작은 규모이면서 효율적이고 유연한 클러스터 환경을 만드는 것입니다. 목표는 다양한 웹 스크래핑 스크립트를 자동으로 예약하고 서핑 조건을 확인하는 스크래핑을 포함한 DAG 스케줄링을 자동화하는 것입니다.

시작하기 전에 필요한 하드웨어 구성 요소를 모두 준비했는지 확인해 주세요. 자세한 목록 및 설정 지침은 다음에서 확인할 수 있습니다:

# 시작하기

<div class="content-ad"></div>

## 초기화 스크립트에 접근하기 위해 Git 저장소를 복제하세요

- 저장소를 복제하고 해당 폴더로 이동하세요:

```js
git clone https://github.com/robronayne/PiClusterFlow.git
cd PiClusterFlow
```

## microSD 카드에 Raspberry Pi OS 설치하기

<div class="content-ad"></div>

1. Raspberry Pi Imager 다운로드하기:

- 먼저 raspberrypi.org/software에서 Raspberry Pi Imager를 다운로드하세요.

2. Imager를 사용하여 OS 설치하기:

- SanDisk 32GB microSD 카드를 컴퓨터에 삽입하세요.
- microSD 카드를 boot로 이름을 변경하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_1.png" />
  
- Raspberry Pi Imager를 열고 Raspberry Pi OS (32비트)를 선택합니다.
- 삽입된 SD 카드를 선택합니다.

3. 호스트, 사용자 이름 및 비밀번호 구성:

- Pi OS의 최근 변경 사항은 SSH용 비밀번호 설정을 필요로 합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_2.png" />

- OS 맞춤 설정 메뉴에서 호스트 이름, 사용자 이름 및 암호 구성하세요.
- 모든 Raspberry Pi 노드의 사용자 이름을 "pi"로 설정하고 각각의 암호를 일관되게 유지하세요. 호스트 이름도 노드의 의도된 역할과 일치하도록 설정해주세요.
- 프롬프트가 나타날 때 기존 데이터를 지울 것인지 확인하세요.
- 각각의 microSD 카드에 대해 이 프로세스를 반복하세요.

## Prepare microSD Cards

1. microSD 카드 장착:

<div class="content-ad"></div>

- 컴퓨터에 microSD 카드를 삽입하세요.
- diskutil list를 사용하여 디스크 식별자(/dev/diskX)를 확인하세요.

![이미지](/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_3.png)

- /Volumes/에 카드의 부트 파티션을 마운트하세요. 다음 명령어를 사용하여 마운트하고 마운트를 확인할 수 있습니다:

```js
diskutil mountDisk /dev/diskX
ls /Volumes
```

<div class="content-ad"></div>

2. setup_node.sh 스크립트 실행

- setup_node.sh에 실행 권한을 부여하세요:

```js
chmod +x setup_node.sh
```

- 각 microSD 카드가 어떤 노드에 해당하는 지에 따라 스크립트를 한 번씩 실행하세요.

<div class="content-ad"></div>

```js
# 마스터 노드 마이크로SD 카드용
sudo ./setup_node.sh master 
```

```js
# 워커 노드 마이크로SD 카드용
sudo ./setup_node.sh worker1 
sudo ./setup_node.sh worker2 
sudo ./setup_node.sh worker3
```

![이미지](/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_4.png)

3. 마이크로SD 카드를 추출하세요.

<div class="content-ad"></div>

- 스크립트가 완료되면 마이크로SD 카드를 제거해 주세요

```js
diskutil unmountDisk /dev/diskX
```

## 라즈베리 파이 기기에 마이크로SD 카드 삽입

- 각 준비된 마이크로SD 카드를 해당 라즈베리 파이 기기에 넣어주세요.
- 각 라즈베리 파이를 켜고 이더넷으로 네트워크에 연결해 주세요.

<div class="content-ad"></div>

# 의존성 설치

1. Homebrew 설치: Homebrew가 설치되어 있지 않은 경우, Homebrew를 설치하세요:

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Ansible 설치:

<div class="content-ad"></div>

```js
brew install ansible
```

3. 라즈베리 파이 IP 주소를 가져 오기 위해 nmap 설치:

```js
brew install nmap
```

3. Ansible과의 SSH 인증을 위해 sshpass 설치하기:

<div class="content-ad"></div>

```js
brew install sshpass
```

4. Ansible을 초기화합니다:

- 각 Raspberry Pi에 대한 Ansible 호스트 파일 및 SSH 액세스를 구성해야 합니다.
- init_ansible.sh 스크립트를 실행해주세요.

```js
chmod +x ./init_ansible.sh
sudo ./init_ansible.sh
```

<div class="content-ad"></div>

- 이 스크립트는 Pi의 IP 주소를 동적으로 검색하여 ansible/hosts 파일에 저장합니다. 또한 각 IP 주소의 SSH 키를 ~/.ssh/known_hosts 파일에 추가합니다.

![이미지](/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_5.png)

- 마지막으로, 우리가 만든 Raspberry Pi 암호를 환경 변수에 추가할 수 있습니다. 스크립트는 이미 ansible/hosts 파일이 SSH 암호를 위한 환경 변수를 참조하도록 하였습니다. 이렇게 함으로써 Ansible 명령을 실행할 때마다 암호를 입력할 필요가 없어집니다.

```js
export ANSIBLE_SSH_PASS='여러분의_ssh_암호_여기에'
```

<div class="content-ad"></div>

# 확인

## 모든 노드에 핑 보내기

- 이제 Ansible이 구성되었으므로 호스트 파일에 존재하는 모든 노드에 핑을 시도할 수 있습니다. 다음 명령어를 사용하여 디렉토리로 이동한 후 노드에 핑을 보낼 수 있습니다:

```js
cd ansible
ansible all -m ping
```

<div class="content-ad"></div>


아래는 마크다운 형식으로 변경한 표입니다.


![Raspberry Pi Cluster](/assets/img/2024-06-23-RaspberryPiClusterwithKubernetesandAirflowConfiguringAnsible_6.png)

지금까지 여러 Pi 노드를 구성하고 Ansible을 사용하여 설정 작업을 자동화하여 Raspberry Pi Cluster를 성공적으로 구축했습니다. 이러한 단계를 따라, 추가적인 사용자 정의 및 자동화를 위한 준비가 된 일관된 클러스터 환경을 만들었습니다. 각 Raspberry Pi 노드는 협력하여 작동할 수 있도록 준비되었으며, 분산 컴퓨팅 및 자동화에 대한 미래 프로젝트와 실험을 위한 길을 열었습니다.

이 프로젝트의 현재 상태는 GitHub에서 확인할 수 있습니다:
