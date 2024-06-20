---
title: "안녕하세요 Ansible을 사용하여 Docker 설치하는 방법에 관해 안내해 드리겠습니다 함께 시작해 보도록 하죠"
description: ""
coverImage: "/assets/img/2024-06-19-HowToInstallDockerUsingAnsible_0.png"
date: 2024-06-19 18:18
ogImage: 
  url: /assets/img/2024-06-19-HowToInstallDockerUsingAnsible_0.png
tag: Tech
originalTitle: "How To Install Docker Using Ansible"
link: "https://medium.com/@GarisSpace/how-to-install-docker-using-ansible-01a674086f8c"
---


<img src="/assets/img/2024-06-19-HowToInstallDockerUsingAnsible_0.png" />

이 게시물에서는 macOS에 Ansible을 설치하고 Docker를 설치하는 방법을 살펴볼 것입니다. Ansible은 서버 및 응용 프로그램 구성을 조직화하고 반복 가능한 방식으로 관리할 수 있는 강력한 자동화 도구입니다.

단계 1: macOS에 Ansible 설치하기
macOS에 Ansible을 설치하는 가장 간단한 방법은 macOS의 패키지 관리자 인 Homebrew를 사용하는 것입니다. 터미널을 열고 다음 명령어를 입력하세요:

```js
brew install ansible

# 또는 도커 이미지를 사용하여 플레이북 실행하기, 예시:
docker run --rm -it -v $PWD:/app -v ~/.ssh/id_rsa:/root/.ssh/id_rsa alpinelinux/ansible ansible-playbook -i app/inventory.ini app/playbooks/docker.yml
```

<div class="content-ad"></div>

### 단계 2: Ansible 구성
Ansible 작업을 실행하려는 기계의 IP 주소를 포함하는 inventory.ini 파일을 준비하십시오. 파일의 샘플 내용은 다음과 같습니다:


[all]
# 이 경우, node1은 192.168.18.131 IP 주소를 가진 호스트명이며 garis는 sudo 사용자입니다.
node1 ansible_host=192.168.18.131 ansible_user=garis ansible_ssh_common_args='-o StrictHostKeyChecking=no'


### 단계 3: Docker 설치용 Ansible 플레이북 생성
다음으로, playbooks라는 디렉토리 아래 docker.yml이라는 플레이북을 생성하십시오. 이 플레이북에는 원격 Ubuntu 서버에 Docker를 설치하는 데 필요한 모든 작업이 포함되어 있습니다. 플레이북은 다음과 같습니다:


---
- name: Ubuntu에 Docker 설치
  hosts: all
  remote_user: garis  # 원격 사용자를 sudo 사용자로 변경하세요!
  become: true
  vars:
    arch_mapping:  # Ansible 아키텍처 { ansible_architecture } 이름을 Docker 아키텍처 이름으로 매핑
      x86_64: amd64
      aarch64: arm64

  tasks:
    - name: 모든 패키지를 최신 버전으로 업데이트 및 업그레이드
      ansible.builtin.apt:
        update_cache: true
        upgrade: dist
        cache_valid_time: 3600

    - name: 필요한 패키지 설치
      ansible.builtin.apt:
        pkg:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg
          - software-properties-common

    - name: Docker의 GPG 키를 생성하기 위한 디렉터리 생성
      ansible.builtin.file:
        path: /etc/apt/keyrings
        state: directory
        mode: '0755'

    - name: Docker의 공식 GPG 키 추가
      ansible.builtin.apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        keyring: /etc/apt/keyrings/docker.gpg
        state: present

    - name: 아키텍처 변수 출력
      ansible.builtin.debug:
        msg: "아키텍처: { ansible_architecture }, Codename: { ansible_lsb.codename }"

    - name: Docker 저장소 추가
      ansible.builtin.apt_repository:
        repo: >-
          deb [arch={ arch_mapping[ansible_architecture] | default(ansible_architecture) }
          signed-by=/etc/apt/keyrings/docker.gpg]
          https://download.docker.com/linux/ubuntu { ansible_lsb.codename } stable
        filename: docker
        state: present

    - name: Docker 및 관련 패키지 설치
      ansible.builtin.apt:
        name: "{ item }"
        state: present
        update_cache: true
      loop:
        - docker-ce
        - docker-ce-cli
        - containerd.io
        - docker-buildx-plugin
        - docker-compose-plugin

    - name: Docker 그룹 추가
      ansible.builtin.group:
        name: docker
        state: present

    - name: 사용자를 Docker 그룹에 추가
      ansible.builtin.user:
        name: "{ ansible_user }"
        groups: docker
        append: true

    - name: Docker 서비스 활성화 및 시작
      ansible.builtin.systemd:
        name: "{ item }"
        enabled: true
        state: started
      loop:
        - docker.service
        - containerd.service


<div class="content-ad"></div>

이 플레이북에는 패키지 업데이트, 필요한 종속성 설치, Docker의 GPG 키 추가, Docker 저장소 설정, Docker 및 관련 패키지 설치, Docker 그룹 추가, Docker 서비스가 활성화되고 실행되도록 하는 등 다양한 작업이 포함되어 있습니다.

단계 4: 플레이북 실행
마지막으로 다음 명령을 사용하여 플레이북을 실행할 수 있습니다:

```js
ansible-playbook -i inventory.ini playbooks/docker.yml

# 또는 도커 사용
docker run --rm -it -v $PWD:/app -v ~/.ssh/id_rsa:/root/.ssh/id_rsa alpinelinux/ansible ansible-playbook -i app/inventory.ini app/playbooks/docker.yml
```

이 명령은 inventory.ini 파일에서 지정된 호스트에 플레이북을 실행하여 Docker를 설치합니다.

<div class="content-ad"></div>

결론
위 단계를 따라서 macOS 노트북에 Ansible을 성공적으로 설치하고 원격 서버에 Docker 설치를 자동화했습니다. 이는 Ansible이 다양한 시스템 간 작업을 자동화하는 데 얼마나 강력하고 간단한지를 보여줍니다.