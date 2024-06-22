---
title: "라즈베리 파이에서 구글 드라이브 마운트하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-MountingGoogleDriveonRaspberryPi_0.png"
date: 2024-06-22 19:22
ogImage: 
  url: /assets/img/2024-06-22-MountingGoogleDriveonRaspberryPi_0.png
tag: Tech
originalTitle: "Mounting Google Drive on Raspberry Pi"
link: "https://medium.com/@artur.klauser/mounting-google-drive-on-raspberry-pi-dd15193d8138"
---


<img src="/assets/img/2024-06-22-MountingGoogleDriveonRaspberryPi_0.png" />

안녕하세요! 이 글은 제가 처음으로 작성한 것은 2019년 봄이었어요. 그 이후로 세상은 계속 변화하고 있죠. 그래서 새로운 변경 사항을 반영하기 위해 이 설명을 업데이트하려고 생각했어요.

라즈베리 파이는 집 네트워크에서 다양한 서비스를 실행하는데 훌륭한 장치에요. 사용자 제공 SD 카드나 USB 스틱에 파일을 저장할 수 있어요. 하지만 만약 디바이스 외부에 파일을 저장하고 싶다면, 라즈베리 파이에 설정한 서비스를 안전하게 유지하고 싶다면 어떻게 해야 할까요? 여러 개의 라즈베리 파이 사이에서 파일을 공유하고 싶다면요? 또는 이미 구름에 사는 사진과 같은 파일들을 두고, 라즈베리 파이에서 쉽게 접근하고 싶다면 어떻게 해야 할까요? 이 글은 Google 드라이브를 라즈베리 파이에 연결하여 위와 같은 사용 사례와 더 많은 용도로 사용하는 방법을 보여줍니다.

# 어떤 소프트웨어를 사용해야 할까요?

<div class="content-ad"></div>

먼저 결정해야 할 것은 어떤 소프트웨어를 사용할지입니다. Linux 환경에서 Google 드라이브를 연결하기 위한 소프트웨어를 찾을 때 여러 가지 다른 기능과 요구 사항을 가진 프로젝트들을 만날 수 있습니다. 일부는 다른 것보다 더 잘 관리됩니다. 저는 여기서 꾸준히 관리되고 많은 기능을 제공하는 rclone을 선택했습니다. 특히 FUSE 사용자 영역 파일 시스템 계층의 도움으로 Google 드라이브를 Linux 파일 시스템의 일부로 마운트하여 Pi에서 클라우드 스토리지를 간단하게 사용할 수 있습니다. 이 지침은 대부분의 다른 Debian Linux 기반 배포판에서도 적용될 것으로 예상되며 거의 또는 전혀 변경하지 않고 사용할 수 있습니다.

이 문서에서 설명된 제한된 용도 이상으로 Rclone은 훨씬 다양한 용도에 사용될 수 있습니다. Google 드라이브뿐만 아니라 Amazon Drive, Dropbox 또는 Microsoft OneDrive와 같은 다른 대형 클라우드 스토리지 제공업체를 비롯한 여러 클라우드 스토리지 제공업체도 지원합니다. 이 클라우드 스토리지 서비스 중 하나를 파일 시스템에 마운트할 뿐만 아니라 이러한 서비스의 파일을 직접 조작하는 일련의 CLI 명령도 제공합니다. 그러나 본 문서에서는 그것들을 사용하지 않고 rclone mount를 사용하는 데 집중할 것입니다.

아래의 설치 지침은 로그인한 Raspberry Pi에서 모든 지시 사항을 실행하고 있다고 가정합니다. (그렇지 않은 경우 별도로 언급됩니다)

# 라즈비안(Raspbian)에 Rclone 설치

<div class="content-ad"></div>

rclone을 설치하는 가장 쉬운 방법은 사전 컴파일된 Debian 패키지를 사용하는 것입니다:

```js
sudo apt-get install rclone
```

현재 라즈베리 파이 OS(이하 Raspbian으로도 알려짐)의 최신 릴리스는 Debian v.11 (Bullseye)를 기반으로 합니다. 저는 데스크톱이 포함된 32비트 라즈베리 파이 OS의 일반적인 설치를 위해 이 내용을 작성했습니다. 다른 버전을 설치했다면, 소프트웨어를 설치하기 위해 적정한 조치를 취해야 합니다. 예를 들어, 64비트 OS를 사용 중이라면 64비트 버전을 사용해야 합니다. apt-get을 통해 받는 rclone의 버전은 1.53.3입니다. 그러나 그동안 rclone은 1.59.2 버전으로 진보했습니다. 더 최신 버전을 얻기 위해, 라즈베리 파이 OS의 기본 패키지 저장소에 포함된 apt 패키지 대신, rclone의 다운로드 페이지에서 최신 rclone 패키지를 설치할 것입니다:

```js
cd /tmp
wget https://downloads.rclone.org/v1.59.2/rclone-v1.59.2-linux-arm-v7.deb
sudo apt install ./rclone-v1.59.2-linux-arm-v7.deb
rm rclone-v1.59.2-linux-arm-v7.deb
```

<div class="content-ad"></div>

# Rclone 구성하기

원격 파일에 액세스할 때 특정 사용자에게 개인적인 파일이 있는 경우, rclone은 각 사용자에게 별도의 구성 파일을 유지합니다. 구름 저장소와 상호 작용하는 데 필요한 모든 비밀 액세스 토큰은 각 사용자의 구성 파일에 저장됩니다. 따라서 서로 다른 사용자가 서로의 클라우드 저장소에 액세스할 수 없습니다. 기본적으로 구성 파일은 $HOME/.config/rclone/rclone.conf에 있으며, 액세스 토큰이 개인적으로 유지되도록 파일 소유자에게는 읽기 및 쓰기 전용 (0600 권한)이 있어야 합니다.

Google 드라이브의 경우 추가 사항이 있습니다. 기본 구성을 사용하는 경우, rclone 애플리케이션에 해당하는 client_id를 사용하고 있습니다. Google은 Google 드라이브와의 상호 작용에 대한 클라이언트 당 속도 제한을 부과합니다. 즉, rclone 기본 client_id를 사용하면 Google Drive의 작업 대역폭을 위해 전 세계의 모든 rclone 사용자와 경쟁하게 됩니다. rclone 개발자들이 Google에 더 높은 할당량을 요청하여 이를 완화하려고 하지만, 기본 설정을 사용하는 것은 이상적인 상황이 아닙니다. 이러한 이유로 Google 드라이브 클라이언트 ID를 설정하고 동시에 문제가 발생하지 않도록 합니다.

## Google 드라이브 클라이언트 ID 가져오기

<div class="content-ad"></div>

브라우저에서 Google 개발자 콘솔로 이동하여 Google 계정으로 로그인하세요. 이 작업을 Raspberry Pi에서 할 필요는 없습니다. 어떤 컴퓨터에서든 괜찮아요.

- 상단 바에서 Project list(프로젝트 목록)를 선택하세요 → New Project(새 프로젝트)
- — — 프로젝트 이름을 입력하세요: my-rclone-gdrive-access
- — — 생성 버튼을 클릭하세요
- 프로젝트 목록(프로젝트 선택)으로 돌아가서 my-rclone-gdrive-access 프로젝트를 선택하세요.
- 왼쪽 패널에서 Enable APIs & services(API 및 서비스 활성화)를 선택하세요
- 상단에서 + ENABLE APIS AND SERVICES를 선택하세요
- — — 검색란에 Drive를 입력하세요
- — — Google Drive API를 선택하세요
- — — 활성화 버튼을 클릭하세요
- 왼쪽 패널에서 OAuth consent screen을 선택하세요
- — — 사용자 유형을 선택하세요: 외부
- — — 생성을 클릭하세요
- — — 앱 이름을 입력하세요: my-rclone
- — — 지원 이메일을 입력하세요: `your-gmail-address`
- — — 개발자 연락처 정보를 입력하세요: 이메일: `your-gmail-address`
- — — 이 화면의 다른 필드는 모두 기본 설정으로 남겨두세요
- — — SAVE AND CONTINUE을 클릭하세요
- — — ADD OR REMOVE SCOPES를 클릭하세요
- — — Google Drive API, ../auth/drive(모든 Google Drive 파일을 볼 수 있고 편집, 생성 및 삭제할 수 있습니다)를 선택하세요
- — — UPDATE를 클릭하세요
- — — SAVE AND CONTINUE을 클릭하세요
- — — Test users: + ADD USERS를 클릭하세요
- — — Gmail 사용자를 입력하세요 (또는 Google 드라이브 파일에 액세스할 때 사용하려는 다른 Google 사용자 ID를 입력하세요)
- — — ADD를 두 번 클릭하세요
- — — 방금 입력한 사용자가 이제 User information 목록에 표시되어야 합니다
- — — SAVE AND CONTINUE을 클릭하세요
- 왼쪽 패널에서 Credentials(자격 증명)을 선택하세요
- — — 메인 패널 내 상단 메뉴에 있는 + CREATE CREDENTIALS를 선택하세요
- — — OAuth client ID를 선택하세요
- — — 애플리케이션 유형을 선택하세요: Desktop(데스크톱)
- — — 합리적인 이름을 지정하세요: my rclone client
- — — CREATE을 클릭하세요
- — — OAuth client created가 포함된 확인 팝업이 표시됩니다. 클라이언트 ID와 클라이언트 시크릿을 복사하세요. rclone 구성에 필요합니다.

<div class="content-ad"></div>

# Rclone 구성 설정하기

라즈베리 파이로 돌아가서 Google 드라이브 파일에 액세스해야 하는 Linux 사용자로 로그인하고 다음을 실행하세요:

```js
rclone config
```

다음 답변을 선택하세요:

<div class="content-ad"></div>

```js
원격이 발견되지 않았습니다 - 새로 만드시겠어요?
n) 새 원격
s) 구성 암호 설정
q) 구성 종료
n/s/q> n
새 원격의 이름을 입력해주세요.
name> gdrive
구성할 저장 유형을 선택해주세요.
문자열 값을 입력하세요. 기본값을 사용하려면 엔터 키를 누르세요 ("").
아래 번호 중 하나를 선택하거나 직접 값을 입력하세요
... 생략 ...
18 / 구글 드라이브
   \ (드라이브)
... 생략 ...
Storage> 18
client_id 옵션.
구글 애플리케이션 클라이언트 ID
직접 설정하는 것을 권장합니다.
자체 ID를 만드는 방법은 https://rclone.org/drive/#making-your-own-client-id에서 확인하세요.
값을 입력하세요. 빈칸으로 두려면 엔터 키를 누르세요.
client_id> 103XXXXXXXXXXXXXXXXXuso.apps.googleusercontent.com
```

이게 앞서 저장한 클라이언트 ID입니다. 저장을 잊었다면 언제든지 Credentials → OAuth 2.0 클라이언트 ID → `id-이름`으로 이동하여 정보를 다시 확인할 수 있습니다.

```js
client_secret 옵션.
OAuth 클라이언트 시크릿.
보통은 비워두세요.
값을 입력하세요. 빈칸으로 두려면 엔터 키를 누르세요.
client_secret> GOCXXXXXXXXXXXXXXXXXyXc
```

이게 앞서 저장한 클라이언트 시크릿입니다.

<div class="content-ad"></div>


옵션 스코프.
드라이브에서 액세스를 요청할 때 rclone이 사용해야 하는 스코프.
아래 숫자 중 하나를 선택하거나 직접 값을 입력하십시오.
비워두고 Enter를 눌러두십시오.
1 / 애플리케이션 데이터 폴더를 제외한 모든 파일에 대한 전체 액세스.
  \ (drive)
... 생략 ...
스코프> 1
옵션 service_account_file.
서비스 계정 자격 증명 JSON 파일 경로.
일반적으로 비워둠.
인터랙티브 로그인 대신 서비스 계정(SA)을 사용하려는 경우에만 필요합니다.
파일 이름에서 `~`는 확장되며 `${RCLONE_CONFIG_DIR}`와 같은 환경 변수도 사용됩니다.
값을 입력하십시오. 비워두고 Enter를 눌러두십시오.
service_account_file>
고급 구성을 편집하시겠습니까? (y/n)
y) Yes
n) No (기본값)
y/n> n
자동 구성을 사용하시겠습니까?
 * 확신이 없으면 Y를 선택하십시오
 * 리모트나 무화면 기기에서 작업 중이라면 N을 선택하십시오
y) Yes (기본값)
n) No
y/n> y


Google은 더 이상 클라이언트를 구성하는 외부 밴드(Out-of-Band, OOB) 방법을 제공하지 않습니다. 과거에는 이 방법이 가장 편리한 옵션이었지만, rclone 설명서에서도 좋은 개요를 찾을 수 있습니다. 여기서 여러 옵션이 가능합니다:

- 1a) GUI에서 Raspberry Pi에서 작업 중이라면 설정이 완료된 상태입니다. Yes (자동 구성)를 선택하고 프롬프트를 따르기만 하면 됩니다.
- 1b) SSH를 통해 무화면 Raspberry Pi에 로그인 중이라면, 즉 연결된 디스플레이도 없고 GUI도 없는 경우, SSH 포트 포워딩을 사용하여 이 인증 단계를 거칠 수 있습니다.
- 2 ) 위의 어느 것과도 일치하지 않는 경우, 해당 버전의 rclone이 설치된 다른 데스크톱 머신이 필요하며, 원격 인증 단계를 수행해야 합니다. 이 경우 이전 질문에서 No를 선택하고 프롬프트를 따라야 합니다.

여기서 여러분이 1b 상태, 즉 SSH로 로그인하고 이전 질문에서 Yes(자동 구성)를 선택한 것으로 가정하겠습니다. Rclone 구성 계속:

<div class="content-ad"></div>

```js
알림: 사용자 정의 구성에서 리디렉션 URL을 "http://127.0.0.1:53682/"로 설정했는지 확인하세요.
알림: 브라우저가 자동으로 열리지 않으면 다음 링크로 이동하십시오: http://127.0.0.1:53682/auth?state=5l4XXXXXXXXX-Iw
알림: 로그인하고 rclone에 대한 액세스 권한을 승인하세요
알림: 코드를 기다리는 중...
```

Rclone 설정은 웹 브라우저가 Raspberry Pi 포트 53682에 연결하도록 대기 중입니다. 그러나 Raspberry Pi에서 GUI와 웹 브라우저를 실행 중이지 않다고 가정합니다. 호스트 컴퓨터에서 Raspberry Pi로 SSH를 실행하여 해당 호스트 컴퓨터에서 전체 데스크톱과 GUI를 실행하고 해당 호스트 컴퓨터의 웹 브라우저를 사용한다고 가정하고 SSH 포트 포워딩을 사용할 것입니다. 이를 위해 호스트에서 Raspberry Pi로 두 번째 SSH 세션을 열어 해당 포트를 전달하는 방법을 사용하십시오. 호스트에서 다음을 입력하십시오:

```js
ssh -L localhost:53682:localhost:53682 <your-pi-user>@<your-pi-host>
```

로그인한 후 이 두 번째 터미널 창을 그냥 두어 두십시오.

이전에 화면에 출력된 URL(http://127.0.0.1:53682/auth?state=5l4XXXXXXXXX-Iw)을 데스크톱 컴퓨터의 새 브라우저 창에 복사하여 붙여넣으십시오. 이어지는 페이지에서 사용자 계정을 선택한 후(필요한 경우) Google 드라이브에 애플리케이션 액세스를 부여하고자 하는지 확인하십시오. 마침내 Google 드라이브에 액세스할 수 있는 웹 페이지로 이동하게 될 것입니다.

<div class="content-ad"></div>

```js
성공!
모두 완료되었습니다. 이제 rclone으로 돌아가주세요.

브라우저 창을 닫고 SSH 포트 포워딩을 위해 열었던 두 번째 터미널 창을 닫을 수 있습니다. 한편, 첫 번째 터미널 창에서 rclone 구성이 계속 진행됩니다:

NOTICE: 코드를 받았습니다.
공유 드라이브 (팀 드라이브)로 구성하시겠습니까?
y) 예
n) 아니오 (기본값)
y/n> n
구성 완료.
옵션:
- 유형: 드라이브
- 클라이언트 ID: 103XXXXXXXXXXXuso.apps.googleusercontent.com
- 클라이언트 시크릿: GOCXXXXXXXXXXXXXXyXc
- 범위: 드라이브
- 토큰: {"access_token":"ya2XXXXXXXXX163","token_type":"Bearer","refresh_token":"1//06_XXXXXXXXXXXXjb8","expiry":"2022-09-21T22:42:18.157766331-07:00"}
- 팀 드라이브:
```

위의 마지막 섹션은 $HOME/.config/rclone/rclone.conf 구성 파일에 입력될 정보의 복사본입니다. 모든 것이 올바르게 보인다면 이를 수락하고 구성 메뉴를 종료할 것입니다.

<div class="content-ad"></div>

```js
"gdrive" 원격을 유지하시겠습니까?
y) 네, 이대로 괜찮아요 (기본값)
e) 이 원격을 편집
d) 이 원격 삭제
y/e/d> y
현재 원격:
이름                 유형
====                 ====
gdrive               drive
e) 기존 원격 편집
n) 새로운 원격
d) 원격 삭제
r) 원격 이름 변경
c) 원격 복사
s) 구성 암호 설정
q) 구성 종료
e/n/d/r/c/s/q> q
```

이제 설정을 올바르게 완료했는지 확인할 수 있습니다 <br> 다음 명령을 사용하여:

```js
rclone ls --max-depth 1 gdrive:
```

이 rclone 명령은 Google 드라이브의 최상위 디렉토리에 있는 모든 일반 파일을 표시해야 합니다. 다음 단계는 Google 드라이브를 파일 시스템으로 마운트하여 테스트하는 것입니다:

<div class="content-ad"></div>

```js
cd ~
mkdir -p mnt/gdrive
rclone mount gdrive: $HOME/mnt/gdrive
```

라즈베리 파이에서 두 번째 터미널에서 다음을 실행하십시오:

```js
ls -l ~/mnt/gdrive
```

이제 Google 드라이브의 최상위 디렉토리에 있는 모든 파일을 다시 나열해야 합니다. 이제 클라우드 스토리지가 일반 파일 시스템의 일부이므로 Pi의 모든 프로그램이 다른 파일과 마찬가지로 액세스할 수 있습니다. 이 테스트를 완료한 후 첫 번째 터미널에서 위의 rclone 명령을 Ctrl-C로 중지하세요.

<div class="content-ad"></div>

# Google 드라이브 자동 마운트

위에 설정된 내용은 rclone mount 명령을 사용하여 필요할 때 손쉽게 Google 드라이브를 파일 시스템에 마운트하는 데 필요한 모든 것입니다. 그러나 약간은 번거롭습니다. 사용자가 Google 드라이브에 로그인할 때마다 자동으로 마운트되면 더 좋을 것입니다. 이를 systemd로 달성할 수 있습니다. systemd는 필요할 때 서비스를 시작하고 중지하는 데몬으로 작동합니다. systemd는 machine-wide 서비스를 처리하는 --system 모드와 사용자별 서비스를 다루는 --user 모드 중 하나로 운영됩니다. 이 경우에는 rclone FUSE 파일 시스템을 Google 드라이브에 마운트하려고 합니다. 더 자세히 알아보려면 사용자별 systemd에 대한 archlinux 위키를 참조하는 것이 좋습니다.

## Systemd 구성

systemd에게 무엇을 해야 하는지 알려주려면 일부 표준 위치의 구성 파일에 의존합니다. systemd가 사용자 구성 파일을 찾는 위치 중 하나는 $HOME/.config/systemd/user입니다. 로그인시 rclone FUSE 파일 시스템이 자동으로 마운트되도록 하려면 다음 내용을 포함하는 ~/.config/systemd/user/rclone@.service 파일을 만드세요.

<div class="content-ad"></div>

```js
[Unit]
Description=rclone: 클라우드 스토리지 구성 %i용 원격 FUSE 파일시스템
Documentation=man:rclone(1)
[Service]
Type=notify
ExecStartPre=/bin/mkdir -p %h/mnt/%i
ExecStart= \
  /usr/bin/rclone mount \
    --vfs-cache-mode writes \
    --vfs-cache-max-size 100M \
    %i: %h/mnt/%i
[Install]
WantedBy=default.target
```

여기 구성 파일의 특별한 @ 구문은 하나의 구성 파일을 여러 번 인스턴스화하여 사용할 수 있는 서비스 템플릿을 정의합니다. 단순한 사용 사례에는 서비스 템플릿이 필요 없지만, 다른 클라우드 스토리지 제공업체에도 사용하고 싶은 경우를 고려하여 구성을 지원하도록 합니다. 파일 이름에서 파생된 systemd 서비스 이름을 사용할 때는 @ 뒤에 인스턴스 이름을 추가하면 되며, systemd는 구성 파일에서 %i의 모든 발생을 해당 인스턴스 이름으로 바꿉니다. 우리의 경우, 인스턴스 이름은 위의 rclone.conf 파일에 구성한 rclone 원격 이름을 나타냅니다. 즉, gdrive입니다.

위의 rclone mount 명령줄에서는 Google 드라이브에서 지원되는 특정 마운트 옵션 집합을 사용합니다. 전체 옵션 목록은 rclone Google 드라이브 문서에서 찾을 수 있습니다. 일반 마운트 옵션에 대한 자세한 내용은 rclone 마운트 문서에서 찾을 수 있습니다.

구성 파일을 작성한 후에는 새로운 gdrive rclone 원격 구성에 대한 새 구성에 대해 systemd에 알리는 작업이 필요합니다.


<div class="content-ad"></div>

```js
systemctl --user enable rclone@gdrive
```

이 명령어는 `~/.config/systemd/user/default.target.wants/` 디렉토리에 심볼릭 링크 rclone@gdrive.service -` $HOME/.config/systemd/user/rclone@.service를 설치해야 합니다.

이제 systemd가 새로운 서비스를 알게 되었으므로, 다음 단계는 서비스를 실행하는 것입니다:

```js
systemctl --user start rclone@gdrive
```

<div class="content-ad"></div>

한번 켜지면, 마운트된 디렉토리 목록을 확인하려면

```js
ls -l ~/mnt/gdrive
```

을 입력하면 Google Drive 디렉토리의 내용이 다시 나타날 것입니다.

이 시점에서 우리가 이룬 것은 대화식 사용자 세션에 아주 잘 작동합니다. Raspberry Pi에 사용자로 로그인할 때마다 Google Drive를 설정한 사용자로 자동으로 마운트하여 클라우드 저장소의 내용에 액세스할 수 있게 해줍니다.

<div class="content-ad"></div>

## 부팅 시 사용자 시스템디 시작하기

몇 가지 경우에는 사용자 로그인 시간에 마운트하는 것만으로는 충분하지 않을 수 있습니다. 예를 들어, 저는 R 프로그래밍 언어를 위한 웹 IDE 인 RStudio Server를 실행하는 시스템을 사용합니다. RStudio Server 웹 인터페이스는 사용자를 인증하기 위해 먼저 로그인 페이지를 제시합니다. 사용자 자격 증명을 확인한 후에는 사용자를 위해 rsession을 시작합니다. 그러나 인증된 사용자의 UID로 rsession을 시작하는 것은 사용자의 로그인 또는 세션이 아닙니다. 따라서 systemd 사용자 세션이 시작되지 않고 클라우드 스토리지를 마운트하는 작업이 수행되지 않아 RStudio IDE가 사용자의 클라우드 스토리지 디렉토리에 액세스할 수 없습니다.

그러나 이 문제에 대한 해결책이 있습니다. 다음 명령을 사용하여 systemd에 부팅 시간에 로그인 시간이 아닌 사용자 세션을 시작하도록 지시할 수 있습니다: 

```js
loginctl enable-linger $USER
```

<div class="content-ad"></div>

이제 라즈베리 파이가 부팅될 때마다 해당 사용자에 대한 systemd 사용자 세션이 즉시 시작되며, 구성된 구글 드라이브가 장착되고 위에서 언급한 RStudio Server와 같은 사용 사례가 활성화됩니다.

여기까지 설정을 따라 왔다면, 축하합니다! 라즈베리 파이를 구글 드라이브에 연결했으며 $HOME/mnt/gdrive 하위의 파일을 통해 Pi에서 실행 중인 프로그램에서 클라우드 저장소의 파일에 쉽게 액세스할 수 있습니다.

2022년 9월 20일 - 엔트로피 속의 에디
