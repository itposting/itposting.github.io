---
title: "프록시목스Proxmox LXC에 포토프리즘Photoprism 설치하기"
description: ""
coverImage: "/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_0.png"
date: 2024-06-20 17:14
ogImage: 
  url: /assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_0.png
tag: Tech
originalTitle: "Proxmox: Installing Photoprism in LXC"
link: "https://medium.com/@rar1871/proxmox-installing-photoprism-in-lxc-5c9d71c25b43"
---


![이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_0.png)

Photoprism은 AI 기반의 멋진 사진 관리 서비스로, 여러분의 사진을 색인화, 보기 및 공유할 수 있습니다. 해당 기능에 대해 자세히 알아볼 수 있는 공식 웹사이트가 있습니다. 오늘은 가정 환경에서 Proxmox의 LXC 컨테이너에 이를 설치해 보겠습니다.

## 요구 사항:

- Proxmox가 완전히 설치되고 구성되어 있으며 GUI에 액세스할 수 있어야 합니다.
- 정적 IP 주소를 설정하고 정적 IP, DHCP 범위에 대한 기본적인 지식이 있는 라우터 제어 패널에 액세스해야 합니다.
- 사진 및 섬네일에 충분한 스토리지 공간이 있어야 합니다. (대부분의 컬렉션은 총 200GB까지 용량을 차지할 수 있다고 알려져 있습니다. 이 강좌에서는 NAS의 네트워크 공유를 사용할 것이지만, 원하는 경우 로컬 디스크의 폴더를 사용할 수도 있습니다.)
- 터미널에 대한 기본 지식이 필요합니다. (파일을 열고 저장하는 등)
- Proxmox 컨테이너에 대한 기본 지식이 필요합니다. (LXC 템플릿 다운로드, 컨테이너 설정 등)

<div class="content-ad"></div>

## 컨테이너 생성:

다음 리소스를 사용하여 컨테이너를 생성하세요:

- 선택한 호스트 이름 (컨테이너 이름)을 가진 관리자 권한이 있는 컨테이너를 만듭니다.

![이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_1.png)

<div class="content-ad"></div>

-  당신이 좋아하는 리눅스 플레이버는 무엇인가요? 저는 여기서 Debian 11을 사용했어요.
- ~16GB의 루트 저장공간입니다. (사진을 저장하기에는 절대 충분하지 않아요. 외부 저장공간을 꼭 사용하시길 강력히 추천드려요. 제 개인 NAS에서 저장 공간을 사용하겠습니다.)

![첨부된 이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_2.png)

- 시스템의 모든 코어를 사용하세요 (4~8개가 좋습니다).

![첨부된 이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_3.png)

<div class="content-ad"></div>

- 8GB RAM 이상, 4GB 스왑 이상이 필요합니다.

![이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_4.png)

- DHCP IPv4 주소를 선택하시고, 나중에 라우터에서 설정할 수 있습니다.

![이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_5.png)

<div class="content-ad"></div>

- 나머지는 기본값으로 둔 채로 컨테이너를 시작하지 마세요.
- 컨테이너 측면 표시줄의 옵션으로 이동하여 다음을 활성화하세요:

```js
nesting=1
SMB/CIFS=1 # 외부 공유를 사용하는 경우에만 선택적으로 필요
```

![이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_6.png)

- 이제 컨테이너를 시작하세요.

<div class="content-ad"></div>

## IP 주소 설정하기:

정적 IP 주소를 설정하면 서비스에 더 쉽게 액세스할 수 있습니다.

이 단계는 라우터마다 다를 수 있습니다. 제어 패널에 로그인해야 합니다. 일반적으로 192.168.xxx.1을 통해 액세스할 수 있습니다. 그리고 컨테이너에 정적 IP 주소를 추가하셔야 합니다. 정적 IP 할당이 DHCP 할당 범위와 겹치지 않도록 주의하셔야 합니다. 일반적으로 정적 IP에는 192.168.xxx.1~192.168.xxx.50을 추천합니다.

참고: 만약 컨테이너가 라우터 장치 목록에 나타나지 않으면, 컨테이너로 돌아가 apt update를 실행하고 라우터 화면을 새로고침하세요.

<div class="content-ad"></div>

대부분 인기있는 라우터에 대해 이 작업을 하는 방법을 다루는 YouTube 동영상이 많이 있습니다. 이 작업을 완료한 후 컨테이너를 다시 부팅하십시오. Proxmox를 다시 부팅할 필요는 없습니다.

## 스토리지 설정:

이전에 언급했던 대로 16Gb의 부팅 디스크 공간은 대량의 섬네일이나 사진을 저장하기에 부족합니다. Proxmox 호스트 디스크에 충분한 공간이 있고 lvm 스토리지로 적절히 구성된 경우, 부팅 디스크에 200-300GB의 스토리지를 추가하고 계속 진행할 수 있습니다.

저는 컨테이너 부팅 디스크에 파일을 저장하는 것을 좋아하지 않으며 가능한 한 작게 유지합니다. Proxmox 호스트 디스크가 가득 차는 경우... 복구는 가능하지만 절대로 처지고 싶지 않은 상황입니다.

<div class="content-ad"></div>

이 경우에는 NAS가 있어서 192.168.xxx.yy에 위치한 appdata라는 SMB 공유 폴더를 노출시킵니다.

필요한 패키지를 설치하십시오:

```js
apt install cifs-utils
```

마운트 폴더를 생성하세요:

<div class="content-ad"></div>

```js
/media/appdata를 만들기
```

SMB 자격 증명 파일을 만들기:

```js
/root/.smb에 nano 사용
```

다음과 같이 자격 증명을 파일에 추가하세요:

<div class="content-ad"></div>

```js
사용자 이름=당신의_사용자_이름
비밀번호=당신의_비밀번호
```

fstab 설정하기:

```js
nano /etc/fstab
```

다음 줄을 추가하십시오:
설정에 맞게 192.168.xxx.yy/appdata를 변경하십시오.

<div class="content-ad"></div>

```js
//192.168.xxx.yy/appdata /media/appdata cifs credentials=/root/.smb,uid=0,gid=0,dir_mode=0777,file_mode=0777,users,rw,iocharset=utf8,noperm 0 0
```

이제 `mount -a`를 실행하여 공유를 마운트하세요.

## Photoprism 설치:

이제 컨테이너와 저장소가 설정되었으므로 Photoprism을 설치할 준비가 되었습니다.

<div class="content-ad"></div>

기존 패키지를 업데이트하세요:

```bash
apt update && apt upgrade
```

필요한 패키지를 설치하세요:

```bash
apt install -y gcc g++ git gnupg make zip unzip ffmpeg exiftool darktable libpng-dev libjpeg-dev libtiff-dev imagemagick libheif-examples
```

<div class="content-ad"></div>

Node.js 설치하기:

```js
wget https://deb.nodesource.com/setup_18.x -O node_setup.sh
chmod +x node_setup.sh
./node_setup.sh
apt install -y nodejs
rm node_setup.sh
```

GoLang 설치하기:
본 안내서 작성 시점에서 1.20.6 버전이 최신입니다. 최신 버전을 확인하려면 웹 사이트를 방문하여 URL을 변경해 주세요.

```js
wget https://golang.org/dl/go1.20.6.linux-amd64.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.20.6.linux-amd64.tar.gz
ln -s /usr/local/go/bin/go /usr/local/bin/go
rm go1.20.6.linux-amd64.tar.gz
```

<div class="content-ad"></div>

텐서플로우 설치:
이 버전은 AVX2 호환 CPU용입니다 (현대적인 CPU 대부분이 해당됩니다). Photoprism 웹사이트에서 단순히 AVX 용이나 AVX를 지원하지 않는 CPU 용 버전을 찾을 수 있습니다.

```js
wget https://dl.photoprism.org/tensorflow/linux/libtensorflow-linux-avx2-1.15.2.tar.gz
sudo tar -C /usr/local -xzf libtensorflow-linux-avx2-1.15.2.tar.gz
sudo ldconfig
rm libtensorflow-linux-avx2-1.15.2.tar.gz
```

Photoprism 다운로드 및 설치:
Photoprism을 빌드하는 과정에서 많은 메모리가 사용될 수 있습니다. 여기서처럼 컨테이너를 구성한 경우 오류가 발생하지 않아야 합니다. 메모리 부족(OOM) 오류가 발생하면 이를 확인하고 각 make 단계를 개별적으로 실행하세요.

```js
mkdir -p /opt/photoprism/bin
git clone https://github.com/photoprism/photoprism.git
cd photoprism
git checkout release
make all
./scripts/build.sh prod /opt/photoprism/bin/photoprism
cp -a assets/ /opt/photoprism/assets/
```

<div class="content-ad"></div>

## 구성:

Photoprism의 작업 디렉토리를 만들고 구성 파일을 추가하세요.
전체 구성 옵션은 여기를 참조하세요.

```js
mkdir /var/lib/photoprism
nano /var/lib/photoprism/.env
```

다음을 구성 파일에 추가하세요:
기본 SQLite 데이터베이스를 작은 컬렉션 이외의 것에는 권장하지 않습니다. 이를 위해 MariaDB를 사용하는 것을 고려해보세요. MariaDB를 설치하는 방법에 대한 별도 가이드가 있습니다.

<div class="content-ad"></div>

저장 요소를 변경하려면 Photoprism 저장 경로를 마운트된 폴더로 변경해야 합니다. 저의 경우에는 /media/appdata가 될 것입니다.

```js
# 초기 admin 사용자의 비밀번호
PHOTOPRISM_AUTH_MODE="password"
PHOTOPRISM_ADMIN_PASSWORD="photoprism"

# Photoprism 저장 디렉터리
PHOTOPRISM_STORAGE_PATH="/var/lib/photoprism"
PHOTOPRISM_ORIGINALS_PATH="/var/lib/photoprism/photos/Originals"
PHOTOPRISM_IMPORT_PATH="/var/lib/photoprism/photos/Import"

# SQLite 대신 MariaDB/MySQL을 사용하는 경우 아래 주석 해제 (기본 설정값)
# PHOTOPRISM_DATABASE_DRIVER="mysql"
# PHOTOPRISM_DATABASE_SERVER="MYSQL_IP_HERE:PORT"
# PHOTOPRISM_DATABASE_NAME="DB_NAME"
# PHOTOPRISM_DATABASE_USER="USER_NAME"
# PHOTOPRISM_DATABASE_PASSWORD="PASSWORD"
```

Photoprism 서비스 설정:
Photoprism이 부팅될 때 시작되도록 설정합니다.

서비스 정의 파일 생성:

<div class="content-ad"></div>

```js
nano /etc/systemd/system/photoprism.service
```

서비스 파일에 다음을 추가하세요:

```js
[Unit]
Description=PhotoPrism 서비스
After=network.target
StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
WorkingDirectory=/opt/photoprism
EnvironmentFile=/var/lib/photoprism/.env
ExecStart=/opt/photoprism/bin/photoprism up
ExecStop=/opt/photoprism/bin/photoprism down

[Install]
WantedBy=multi-user.target
```

이제 데몬을 다시로드하고 서비스를 시작하세요!

<div class="content-ad"></div>

```js
systemctl daemon-reload
systemctl start photoprism
systemctl enable photoprism
```

서비스 상태를 확인하세요:

```js
systemctl status photoprism
```

모든 것이 잘 실행됐다면 (활성화된 상태는 녹색으로 표시됩니다):

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-ProxmoxInstallingPhotoprisminLXC_7.png)

지금은 이전에 설정한 IP 주소와 포트 2342를 통해 서버에 액세스할 수 있어야 합니다.

```js
http://YOUR-IP:2342
```

## 크레딧:


<div class="content-ad"></div>

포토프리즘 설치는 아래 안내서를 기반으로 진행되었고, 제게는 너무나 귀중한 정보입니다. 문제 해결이 필요할 때 대비하여 읽어보는 것을 고려해보세요.

고지사항:

이 문서는 프로덕션 또는 비즈니스 환경에서의 설정을 위한 안내서가 아니며, 공개 인터넷에 노출할 준비가 된 상태가 아닙니다.

저는 IT 전문가가 아닙니다. 기술 지원도 제공하지 않습니다. 서버를 가진 대학생입니다. 시스템에서 실행하는 모든 명령어에 대한 최종 책임은 여러분에게 있습니다.

<div class="content-ad"></div>

질문이 있으면 댓글을 남겨주세요. 즐거운 시간 보내세요!