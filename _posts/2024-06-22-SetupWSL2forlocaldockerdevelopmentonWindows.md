---
title: "윈도우에서 로컬 도커 개발을 위한 WSL2 설정 방법"
description: ""
coverImage: "/assets/img/2024-06-22-SetupWSL2forlocaldockerdevelopmentonWindows_0.png"
date: 2024-06-22 16:31
ogImage: 
  url: /assets/img/2024-06-22-SetupWSL2forlocaldockerdevelopmentonWindows_0.png
tag: Tech
originalTitle: "Setup WSL2 for local docker development on Windows"
link: "https://medium.com/@sociable_flamingo_goose_694/setup-wsl-for-local-docker-development-on-windows-f0767e0a72d4"
---


안녕하세요! 혹시 업무 중에 도커가 필요하고 관리해야 하는 상황이신가요?

윈도우 기기를 사용 중이지만, 회사 보안 정책, 자금 부족, 또는 기기에 더 많은 소프트웨어를 추가하고 싶지 않아서 Docker Desktop과 같은 라이선스를 확보할 수 없는 상황이신가요?

이 글은 여러분을 위한 것입니다. 개발자들이 리눅스 환경을 실행할 수 있도록 Windows의 기능인 WSL2(Windows 하위 시스템 for Linux)을 사용하여 로컬 기기를 도커 개발에 활성화하는 방법을 단계별로 안내해 드릴 거예요.

<div class="content-ad"></div>


![Screenshot](/assets/img/2024-06-22-SetupWSL2forlocaldockerdevelopmentonWindows_0.png)

# Setting up the host machine

# Installing WSL2

Navigate on Windows to %UserProfile% in Windows Explorer


<div class="content-ad"></div>


Add, .wslconfig document (note: DOT (.) is in the front → .wslconfig)

```js
# Settings apply across all Linux distros running on WSL 2
# Can see memory in wsl2 with "free -m"
# Goes in windows home directory as .wslconfig
[wsl2]

# Limits VM memory to use no more than 48 GB, defaults to 50% of ram
memory=4GB

# Sets the VM to use 8 virtual processors
processors=8

# Sets the amount of swap storage space to 8GB, default is 25% of available RAM
swap=1GB
```

Open the command prompt and execute the following commands:

Choose Linux distro


<div class="content-ad"></div>

```js
wsl --list --online
```

리눅스 배포판 설치

```js
wsl --install -d Ubuntu-20.04
```

설치 확인하기

<div class="content-ad"></div>


wsl --list --verbose


버전 2로 업그레이드하세요.


wsl --set-default-version 2
wsl --set-version Ubuntu-20.04 2


버전이 2로 설정되었는지 확인하세요.

<div class="content-ad"></div>


다음 명령어를 실행해 WSL 목록을 볼 수 있어요.


wsl --list --verbose


WSL을 다시 시작할 수 있어요.


wsl --shutdown


바시 셸 (Ubuntu)을 열 수 있어요. Windows 시작 → Ubuntu 검색해보세요.

<div class="content-ad"></div>

애플리케이션을 열어서 도커 엔진을 설치하러 이동해주세요.

루트 사용자 이름과 암호를 설정하라는 메시지가 표시될 것입니다.

# 도커 엔진 설치

리눅스 배포판에 로그인하신 후에요.

<div class="content-ad"></div>

사용자를 sudo(관리자)로 추가하세요.

```js
grep -E 'sudo|wheel' /etc/group
```

확인:

```js
sudo grep -E '%sudo|%wheel' /etc/sudoers
```

<div class="content-ad"></div>

위의 내용은 다음과 같이 번역됩니다:

"테이블 태그를 마크다운 형식으로 변경해주세요."

<div class="content-ad"></div>

```js
sudo apt remove docker docker-engine docker.io containerd runc
```

저장소를 이용해서 Docker를 설치해보세요.

apt를 업데이트하고 저장소를 HTTPS로 사용할 수 있도록 패키지를 설치해주세요.

```js
sudo apt-get update

sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

<div class="content-ad"></div>

도커 공식 GPG 키를 추가하세요.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

안정적인 저장소를 설정하세요.

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

<div class="content-ad"></div>

도커 엔진 설치하기

```js
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

사용자를 도커 그룹에 추가하기

```js
sudo groupadd docker
sudo usermod -aG docker $USER
```

<div class="content-ad"></div>

도커 서비스를 실행하세요.

```sh
sudo service docker start
```

상태를 확인하세요. ("docker is running"이어야 함)

```sh
sudo service docker status
```

<div class="content-ad"></div>

도커 컴포즈 (글 쓰는 시점의 최신 버전은 2.5.0입니다)를 설치해보세요.

```js
sudo curl -L https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

실행 권한 부여하기

```js
sudo chmod +x /usr/local/bin/docker-compose
```

<div class="content-ad"></div>

버전 확인

```js
docker-compose --version
```

출력: docker-compose version 1.27.4, build 40524192

이제 "wsl"을 사용하여 CMD/Powershell을 통해 도커를 사용할 수 있습니다.

<div class="content-ad"></div>

```js
wsl docker image ls
```

# 도커를 로컬 머신에 노출시키기

etc/docker/daemon.json 위치에서 daemon.json을 편집하세요.

<div class="content-ad"></div>

"hosts": [ "unix:///var/run/docker.sock","tcp://0.0.0.0:2375"]를 입력하고 저장하세요.

![이미지](/assets/img/2024-06-22-SetupWSL2forlocaldockerdevelopmentonWindows_1.png)

머신을 재시작하고 dockerd로 도커를 시작하세요.

로그를 확인하여 위 사진의 호스트를 확인하세요.

<div class="content-ad"></div>

잘 했어요! 도커와 도커 컴포즈를 사용하여 로컬 환경을 설정하고 생산적으로 사용할 수 있도록 세팅했네요 :)!

참고 자료:
https://learn.microsoft.com/en-us/windows/wsl/install
https://dev.to/_nicolas_louis_/how-to-run-docker-on-windows-without-docker-desktop-hik
https://dev.to/bowmanjd/install-docker-on-windows-wsl-without-docker-desktop-34m9
https://medium.com/geekculture/run-docker-in-windows-10-11-wsl-without-docker-desktop-a2a7eb90556d