---
title: "라즈베리 파이 파일 및 미디어 서버 구축하기 홈 콘텐츠 공유를 위한 DIY 가이드"
description: ""
coverImage: "/assets/img/2024-06-20-BuildingaRaspberryPiFileandMediaServerADIYGuideforSeamlessHomeContentSharing_0.png"
date: 2024-06-20 17:33
ogImage: 
  url: /assets/img/2024-06-20-BuildingaRaspberryPiFileandMediaServerADIYGuideforSeamlessHomeContentSharing_0.png
tag: Tech
originalTitle: "Building a Raspberry Pi File and Media Server: A DIY Guide for Seamless Home Content Sharing"
link: "https://medium.com/@jayant.walvekar/building-a-raspberry-pi-file-and-media-server-a-diy-guide-for-seamless-home-content-sharing-edb9e275454c"
---


집 컴퓨터에 흩뿌려진 동영상과 사진들의 바다 속에서, 가족 간 콘텐츠 공유와 접근이 조금 꼬였죠. Windows, Linux, macOS, Android, 심지어 우리 TV와 호환되는 파일 및 미디어 서버 역할을 할 수 있는 중앙 허브가 필요했습니다.

처음에는 상용 NAS 솔루션을 눈여겨 봤지만, 가격이 부담스러워 금방 포기했어요. 그래서 Raspberry Pi 4와 오래된 외장 하드 드라이브를 활용해 나만의 파일 및 미디어 서버를 만들기로 결심했습니다.

가장 어려웠던 부분은 외장 하드 드라이브를 Windows, Raspberry Pi 그리고 때로는 macOS에 매끄럽게 연결할 수 있는 것이었죠. 제가 선택한 exFAT 파일 시스템으로 하드 드라이브를 포맷하고 하나의 깔끔한 파티션을 이용할 준비를 마쳤습니다.

이후, OpenMediaVault를 우연히 발견했는데 처음에는 유망해 보였습니다. 알고 보니 exFAT과 잘 어우러지지 않았어요. 시간이 지날수록 오류를 다루고, 포맷을 하고, RaspberryOS를 다시 설치하는 등의 번거로움에 좌절했죠. 연결 문제의 연속 끝에, OpenMediaVault를 포기하고 파일 공유에는 SMB를, 미디어는 MiniDLNA를 활용해 직접 설정하기로 결심했습니다.

<div class="content-ad"></div>

리눅스 터미널에 익숙해지긴 했지만, 좀 더 사용자 친화적인 것을 찾고 있었어요. 그래서 Cockpit 프로젝트를 발견하게 되었죠. "파일 공유"로 Samba와 NFS를 관리하는 편리한 애드온과, 세련된 파일 관리자인 "Navigator", 그리고 웹 기반 터미널 에뮬레이터까지 함께 사용하니 정말 편리했어요. 이제 Cockpit과 MiniDLNA로 만든 솔루션이 원활하게 작동하며, 라즈베리 파이가 가족들을 위한 콘텐츠 허브로 변모했어요.

결국, exFAT을 사용해 불복종적인 라즈베리 파이 4가 가족들이 파일과 미디어를 찾는 곳이 되었고, Cockpit을 통해 깔끔하게 관리되는 모습이었어요. 하나의 개인 서버 이야기 — 만들고, 다듬고, 받아들이는 과정이에요.

처음에는 최신 라즈베리 파이 OS인 Bookworm 데스크톱 버전을 획득하려 했어요. 그러나 소프트웨어 호환성 문제에 직면하여, "Bullseye" 릴리스 서버 이미지가 요구사항을 충족하는 더 실용적인 선택이라는 결론에 도달했어요.

내 솔루션은 다음과 같은 하드웨어와 소프트웨어를 사용해요.

<div class="content-ad"></div>

- Raspberry Pi 4 Model B Rev 1.4, 쿼드 코어 CPU, 8GB RAM
- 라즈베리 파이 OS Lite Legacy (Bullseye, Server)가 설치된 32GB SD 카드
- 라즈베리 파이 전용 전원 어댑터
- exFAT 파일 시스템이 적용된 외장 USB 하드 디스크
- 라즈베리 파이 USB 포트에 직접 연결 시 전원이 부족하여 작동하지 않아서 필요한 파워드 USB 3.0 허브
- 라즈베리 파이에 SSH로 연결하기 위한 PuTTY 소프트웨어

라즈베리 파이 설정 및 exFAT로 하드 디스크를 포맷하는 과정은 수많은 자원에서 자세히 설명되어 있어서 이 기사에서는 해당 부분에 대해 다루지 않습니다.

# 라즈베리 파이 설정 시작

![라즈베리 파이 설정](/assets/img/2024-06-20-BuildingaRaspberryPiFileandMediaServerADIYGuideforSeamlessHomeContentSharing_0.png)

<div class="content-ad"></div>

모든 연결이 안전하게 완료되었는지 확인하고 라즈베리 파이를 켭니다. 최적의 안정성을 위해 WiFi보다는 유선 LAN 연결을 선택하는 것이 좋습니다. 왜냐하면 WiFi 연결은 추가적인 문제 해결 단계를 요구하는 구성에서 도전이 될 수 있습니다. 라즈베리 파이가 가동된 후에는 SSH 연결을 설정하기 위해 해당 IP 주소를 찾아야 합니다. 집 라우터에 액세스할 수 있다면, 라우터의 DHCP 클라이언트 목록에서 손쉽게 라즈베리 파이의 IP 주소를 찾을 수 있습니다.

또는 모니터와 키보드를 라즈베리 파이에 직접 연결하여 SSH를 필요로하지 않게 할 수도 있습니다. 그러나 설정을 실행하는 컴퓨터에서 SSH를 활용하거나 PuTTY와 같은 도구를 사용하면 더욱 간편한 접근 방법이 제공됩니다. 이 방법은 편리할 뿐만 아니라 온라인 소스에서 명령을 복사하고 붙여넣는 프로세스를 간소화하여 설정 경험을 더욱 효율적으로 만들어줍니다.

라즈베리 파이에 SSH를 사용하여 IP 주소 또는 호스트 이름(제 경우에는 "rpi-home") 및 SD 카드 준비 시 설정한 사용자 ID(제 경우에는 "admin")로 접속합니다. 문서의 나머지 부분은 이 사용자 ID 및 호스트 이름을 전제로 합니다. 사용자 ID 및 호스트 이름에 따라 바꿔주시기 바랍니다.

# 라즈베리 파이 OS 업데이트

<div class="content-ad"></div>

먼저 확인해야 할 사항으로 운영 체제가 완전히 최신 상태인지 확인하는 것이 중요합니다.

```js
sudo apt-get update
sudo apt-get upgrade
```

# exFAT 지원 추가

exFAT는 Microsoft에서 플래시 메모리용으로 개발한 파일 시스템입니다. 이는 프로프리어터리 파일 시스템으로 Linux의 공식적인 부분이 아닙니다. FUSE를 통해 exFAT 포맷을 사용할 수 있습니다.

<div class="content-ad"></div>

아래 명령어를 사용하여 FUSE를 설치하세요.

```js
sudo apt-get install exfat-fuse
sudo apt-get install exfat-utils
```

# 외장 하드 디스크 마운트

하드 디스크가 RPi에 전원 USB 허브를 통해 연결되었는지 확인하고 RPi의 USB 3 포트에 연결되었는지 확인하세요.

<div class="content-ad"></div>

첫 번째 단계는 하드 디스크가 감지되었는지 확인하는 것입니다. 다음 명령어는 연결된 모든 디스크를 나열합니다.

```js
lsblk
```

저는 USB 하드 디스크 하나만 가지고 있으며 "sda"로 나타납니다. 이 디스크에는 하나의 파티션이 있고 "sda1"로 나타납니다.

이 디스크를 어떤 폴더에 장착하여 디스크에 액세스할 수 있게 합니다. 폴더를 생성하고 소유권을 현재 사용자 "admin"에게 변경해줍시다.

<div class="content-ad"></div>

```bash
sudo mkdir /media/exthdd
sudo chown -R admin:admin /media/exthdd
```

첫째로 파일 시스템을 수동으로 마운트하여 모든 것이 잘 작동하는지 확인하십시오.

```bash
sudo mount -t exfat /dev/sda1 /media/exthdd
```

모든 것이 잘 되면 다음 명령어를 사용하여 디스크의 내용을 볼 수 있어야 합니다:

<div class="content-ad"></div>

```js
ls /media/exthdd
```

라즈베리 파이 부팅 시 이 디스크를 자동으로 마운트하도록 구성할 것입니다. 먼저 디스크를 언마운트하세요.

```js
sudo umount /media/exthdd
```

구성에 필요한 UUID를 알아내야 합니다. 아래 명령어를 실행해주세요.

<div class="content-ad"></div>

```js
sudo blkid
```

이 명령어를 실행하면 다음과 같은 출력이 표시됩니다.

```js
/dev/sda1: LABEL="Data" UUID="0AC8-A364" BLOCK_SIZE="512" TYPE="exfat" PARTLABEL="Basic data partition" PARTUUID="6ad9b0ee-2ecc-4b70–99b5-dce69e214493"
```

다음 단계를 위해 UUID인 “0AC8-A364”가 필요합니다. /etc/fstab 파일을 수정하고 마운트를 구성하십시오.

<div class="content-ad"></div>

```js
sudo vi /etc/fstab
```

이 파일의 끝에 다음 줄을 추가하고 저장하세요. 디스크 UUID를 사용해야 합니다.

```js
UUID=0AC8-A364 /media/exthdd exfat rw,user,dmask=0000,fmask=0000,nosuid,nodev,nofail 0 0
```

이번에는 fstab을 사용하여 다시 마운트해 보세요.

<div class="content-ad"></div>

```js
sudo mount -a
```

다시 한 번 디스크에 접근할 수 있는지 확인해 봅시다. 또한 테스트 파일을 생성하고 삭제하여 디스크에 쓰기 작업이 가능한지도 확인해 봅시다.

```js
ls /media/exthdd
touch /media/exthdd/test.txt
rm -f /media/exthdd/test.txt
```

모든 작업이 잘 되었다면, 재부팅 후에도 디스크가 마운트되어 접근 가능한 것입니다.

<div class="content-ad"></div>

# Samba 설정

이제 네트워크를 통해 폴더를 공유할 수 있는 Samba 서버를 설정해보겠습니다. 이 설정을 통해 이 서버의 폴더를 읽기/쓰기 권한으로 공유할 수 있게 될 거에요.

다음 명령어를 실행하여 Samba를 설치해보세요.

```js
sudo apt-get install samba samba-common-bin
```

<div class="content-ad"></div>

우리는 모든 사람들과 함께 전체 폴더 /media/exthdd를 공유할 수 있지만, 공유를 원하지 않는 다른 데이터를 저장할 수 있도록 별도의 공유 폴더를 유지하는 것이 좋습니다. "media-library"라는 이름의 공유 폴더를 만들어봅시다.

```bash
mkdir /media/exthdd/media-library
```

이 공유 폴더에 특정 사용자들에게 액세스 권한을 부여해야 합니다. 이 사용자들은 리눅스 사용자여야 합니다. 가족 구성원마다 쓰기 액세스 권한이 있는 사용자를 만들고, 읽기 전용 액세스 권한만 있는 "guest" 사용자를 만들 수 있습니다. 우선, 가족 구성원 모두가 사용할 수 있는 쓰기 액세스 권한이 있는 "family"라는 공통 사용자를 만들고 이 사용자에게 비밀번호를 설정해봅시다.

```bash
sudo adduser family
sudo passwd family
```

<div class="content-ad"></div>

사용자 "admin"과 "family"에 Samba 액세스 권한을 부여할 것입니다. 이 명령어들은 Samba 액세스용 별도의 비밀번호를 입력하도록 요청할 것입니다.

```js
sudo smbpasswd -a admin
sudo smbpasswd -a family
```

우리는 Samba 서비스에게 이 폴더를 네트워크 상에서 노출해야 한다고 알려줘야 합니다. Samba 구성을 업데이트해야 합니다. 구성 파일을 편집해봅시다.

```js
sudo vi /etc/samba/smb.conf
```

<div class="content-ad"></div>

아래는 현재 파일에 추가할 섹션입니다. 파일을 저장해주세요.

```js
[media-library]
path = /media/exthdd/media-library
valid users = admin family
writeable=Yes
create mask=0777
directory mask=0777
public=no
```

본 폴더는 "valid users" 목록의 사용자에게 접근 가능합니다. 곧 "family"라는 새 사용자를 추가할 예정입니다. 폴더는 쓰기 가능하며, 모든 로그인한 사용자에게 권한이 부여됩니다(777). 하지만 공개 접속은 "no"입니다.

서비스를 재시작해주세요.

<div class="content-ad"></div>

```js
sudo systemctl restart smbd
```

이제 Windows 파일 탐색기에서 \\rpi-home\media-library 폴더에 액세스할 수 있습니다. 이 폴더를 탐색기 또는 명령 프롬프트를 사용하여 다음 명령으로 드라이브에 매핑할 수 있습니다.

```js
net use Z: "\\rpi-home\media-library /user:<username> <password>
```

macOS에서는 “smb:\\rpi-home\media-library” URL을 사용하여 Finder에서 서버에 연결할 수 있습니다.


<div class="content-ad"></div>

# 미디어 서버 설정하기

미디어 서버를 설정하기 위해 miniDLNA를 사용할 것입니다. 먼저 miniDLNA를 설치하세요.

```js
sudo apt-get install minidlna
```

미디어 서버의 이름을 설정하고 폴더를 노출시키기 위해 miniDLNA를 구성해야 합니다. 구성 파일을 편집해주세요.

<div class="content-ad"></div>

```js
sudo vi /etc/minidlna.conf
```

이 파일에서 서버의 friendly name을 찾아 수정하세요. 파일 내에 media_dir로 시작하는 줄을 찾아서 아래와 같이 추가하세요.

```js
friendly_name=rpi-mediaserver

media_dir=A,/media/exthdd/media-library/music
media_dir=P,/media/exthdd/media-library/photos
media_dir=V,/media/exthdd/media-library/videos
```

이 예시에서는 데이터를 이러한 방식으로 구조화했기 때문에 음악, 사진 및 비디오를 위한 별도 폴더를 추가했습니다. A, P 및 V는 해당 폴더를 각각 오디오, 이미지 및 비디오로 노출할 것을 미디어 서버에 전달하는 파일 유형입니다.

<div class="content-ad"></div>

서비스를 다시 시작해 주세요.

```js
sudo systemctl restart minidlna
```

만약 TV가 DLNA에 연결할 수 있고 동일한 네트워크에 연결되어 있다면 "rpi-mediaserver"가 TV에 표시됩니다. Windows Media Player도 이 서버를 볼 수 있고 파일을 재생할 수 있습니다.

<img src="/assets/img/2024-06-20-BuildingaRaspberryPiFileandMediaServerADIYGuideforSeamlessHomeContentSharing_1.png" />

<div class="content-ad"></div>

이 단계들로 충분히 시작할 수 있지만, 모든 설정 및 유지 관리는 터미널과 ssh를 통해 진행해야 합니다. 그러나 cockpit을 사용하면 웹 UI를 통해 모든 작업을 관리할 수 있는 도구들이 있습니다.

# Cockpit 설정하기

Cockpit은 리눅스 서버를 관리하기 위해 설계된 사용자 친화적인 웹 기반 인터페이스입니다. 시스템 관리자를 위한 중앙 통합형 대시보드를 제공하여 실시간 모니터링, 설정, 문제 해결 기능을 제공합니다. 깔끔하고 직관적인 인터페이스로, Cockpit은 사용자 관리, 소프트웨어 업데이트, 네트워크 구성 등과 같은 작업을 간편하게 처리합니다. 모듈식 디자인으로 다양한 플러그인을 지원하며, Linux 배포판 간 서버 관리를 위한 다양한 기능을 지원하는 다목적 도구로 만들어졌습니다.

우선 cockpit을 설치하고 다음 명령어로 정상 작동하는지 확인해봅시다.

<div class="content-ad"></div>

```js
sudo apt install cockpit
systemctl status cockpit.socket
```

이제 http://rpi-home:9090에서 cockpit에 액세스할 수 있습니다. 셀프 사인된 인증서 때문에 나타나는 보안 경고를 무시해주세요. 로그인할 때는 Linux 사용자로 cockpit에 로그인해야 합니다. "admin"으로 로그인해보세요.

추가 보너스로, 다양한 서비스를 관리할 수 있는 많은 cockpit 응용 프로그램 (애드인)이 있습니다. 실제로 cockpit (파일 공유 애드인)에서 Samba(및 NFS)를 관리하고 파일 시스템 (Navigator 애드인)도 관리할 수 있습니다. 이러한 애드인들은 라즈베리파이 OS 저장소에서 직접적으로 사용할 수 없습니다. 먼저 저장소를 설정하고 그 후 설치해야 합니다. 다음 명령어로 이 모든 것을 할 수 있습니다.

```js
curl -sSL https://repo.45drives.com/setup -o setup-repo.sh
sudo bash setup-repo.sh
sudo apt install cockpit-navigator
sudo apt install cockpit-file-sharing
```

<div class="content-ad"></div>

Cockpit 콘솔의 파일 공유 메뉴에서 기존의 samba.conf 파일을 가져와서 Samba를 Cockpit에서 관리할 수 있습니다.

이제 Cockpit 콘솔에서 웹 기반 SSH 터미널을 사용할 수 있습니다.

공유와 스트리밍을 즐기세요!