---
title: "모든 데브옵스 엔지니어가 숙달해야 할 123가지 필수 Linux 명령어"
description: ""
coverImage: "/assets/img/2024-06-19-123EssentialLinuxCommandsEveryDevOpsEngineerShouldMaster_0.png"
date: 2024-06-19 04:38
ogImage: 
  url: /assets/img/2024-06-19-123EssentialLinuxCommandsEveryDevOpsEngineerShouldMaster_0.png
tag: Tech
originalTitle: "123 Essential Linux Commands Every DevOps Engineer Should Master"
link: "https://medium.com/@nidhiashtikar/essential-linux-commands-every-developer-should-master-a86905726d4a"
---


![이미지](https://miro.medium.com/v2/resize:fit:1400/1*BD9mlZ9FUpq8_NjXR-HPVQ.gif)

## 리눅스는 1991년 Linus Torvalds가 개발한 오픈 소스 운영 체제 커널이다. 우분투(Ubuntu) 및 페도라(Fedora)와 같은 다양한 리누스 배포판의 기반으로 사용된다. 안정성, 보안, 유연성으로 유명하며, 서버, 데스크톱 및 임베디드 시스템에서 널리 사용된다.

- 오픈 소스 소프트웨어는 사용자가 소스 코드를 자유롭게 볼 수 있고 수정하고 배포할 수 있게 한다.
- 리눅스 커널은 리눅스 운영 체제의 핵심 구성 요소이다.
- GNU 일반 공준(GPL) 하에 라이선스가 부여되어 개방성과 협력을 촉진한다.

# 파일 시스템 탐색 기본 (ls, cd, pwd):

<div class="content-ad"></div>

- ls: 현재 디렉토리의 내용을 나열합니다.
- cd: 현재 디렉토리를 변경합니다. 예를 들어, cd Documents는 "Documents" 디렉토리로 이동합니다.
- pwd: 현재 작업 중인 디렉토리를 출력하여 파일 시스템에서 어디에 있는지 보여줍니다.

## 파일 조작 명령어 (mkdir, touch, rm, cp, mv):

- mkdir: 새 디렉토리를 생성합니다. 예를 들어, mkdir my_folder는 "my_folder"라는 디렉토리를 생성합니다.
- touch: 새로운 빈 파일을 생성하거나 기존 파일의 타임스탬프를 업데이트합니다. 예를 들어, touch my_file.txt는 "my_file.txt"라는 새로운 텍스트 파일을 생성합니다.
- rm: 파일이나 디렉토리를 제거합니다. 이 명령어를 사용할 때 조심하세요. 파일을 영구적으로 삭제합니다. 예를 들어, rm my_file.txt는 "my_file.txt" 파일을 삭제합니다.
- cp: 파일이나 디렉토리를 복사합니다. 예를 들어, cp file1.txt file2.txt는 "file1.txt"를 "file2.txt"로 복사합니다.
- mv: 파일이나 디렉토리를 이동하거나 이름을 바꿉니다. 예를 들어, mv old_file.txt new_file.txt는 "old_file.txt"를 "new_file.txt"로 이름을 변경하고, mv file.txt directory/는 "file.txt"를 "directory" 디렉토리로 이동시킵니다.

## 기본 텍스트 편집 (nano, vim):

<div class="content-ad"></div>

- nano: 사용하기 간편한 텍스트 편집기입니다. 파일을 편집하려면 nano 파일이름을 사용하세요. 기본 작업에 대한 화면 설명을 제공합니다.
- vim: 강력하고 사용자 정의가 가능한 텍스트 편집기이지만 학습 곡선이 가파릅니다. 파일을 열려면 vim 파일이름을 사용하세요. 편집을 위해 삽입 모드로 진입하려면 i를 누르세요. 삽입 모드를 나가려면 Esc를 누르세요. 저장하고 나가려면 :wq를 입력하세요.

# 사용자 관리:

사용자 추가:

- useradd: 시스템에 새 사용자 계정을 추가합니다. 구문: useradd 사용자명.
- adduser: 사용자 친화적인 인터페이스로 사용자를 추가하며 추가 구성 옵션을 제공하기도 합니다.

<div class="content-ad"></div>

사용자 삭제:

- userdel: 시스템에서 사용자 계정을 삭제합니다. 구문: userdel 사용자명.
- deluser: 사용자 삭제를 위한 사용자 친화적 인터페이스로, 종종 추가 정리 작업을 처리합니다.

사용자 속성 수정:

- usermod: 사용자 계정 속성을 수정합니다. 예: 사용자명, 홈 디렉토리 또는 그룹 멤버십. 구문: usermod 옵션 사용자명.

<div class="content-ad"></div>

사용자 암호 변경하기:

- passwd: 사용자가 자신의 암호를 변경할 수 있도록 합니다. 관리자로서 다른 사용자의 암호를 변경하려면 passwd 사용자명을 입력하세요.

사용자 정보 보기:
   
- id: 사용자 및 그룹 ID와 특정 사용자에 대한 추가 정보를 표시합니다. 구문: id 사용자명.
- finger: 로그인 이름, 실제 이름, 터미널 등 자세한 사용자 정보를 제공합니다. 구문: finger 사용자명.

<div class="content-ad"></div>

사용자 전환:

- su: 다른 사용자 계정으로 전환하거나 다른 사용자로 명령을 실행할 수 있습니다. 구문: su 사용자이름.

사용자 목록 나열:

- who: 현재 로그인한 사용자에 대한 정보를 표시합니다.
- w: 현재 로그인한 사용자에 대해 자세한 정보를 제공하며, 그들이 무엇을 하는지도 포함합니다.

<div class="content-ad"></div>

# 시스템 정보:

기본 시스템 정보 표시:

- uname: 시스템 정보를 표시하는 uname에는 커널 이름, 네트워크 노드 호스트 이름, 커널 릴리스, 커널 버전, 기계 하드웨어 이름 및 프로세서 유형이 포함됩니다. 예를 들어 uname -a는 모든 사용 가능한 시스템 정보를 표시합니다.

시스템 하드웨어 정보보기:

<div class="content-ad"></div>

- lscpu: CPU 아키텍처 및 프로세서 세부 정보를 제공합니다.
- lshw: 메모리, 프로세서, 디스크 및 네트워크 정보를 포함한 자세한 하드웨어 구성을 나열합니다. 루트 권한 또는 sudo 액세스가 필요합니다.
- lspci: PCI 버스 및 연결된 장치에 대한 정보를 표시합니다.
- lsusb: USB 버스 및 연결된 장치에 대한 정보를 표시합니다.
- lsblk: 하드 드라이브 및 파티션과 마운트 포인트를 포함한 블록 장치를 나열합니다.

시스템 성능 모니터링:

- top: 시스템 프로세스, CPU 사용량, 메모리 사용량 등에 대한 동적 실시간 정보를 표시합니다.
- htop: 시스템 리소스 개요 및 쉬운 프로세스 관리를 제공하는 대화식 프로세스 뷰어입니다.

시스템 메모리 사용량 확인하기:

<div class="content-ad"></div>

- free: 시스템에서 사용 가능한 메모리 및 사용 중인 메모리 양을 표시합니다. 전체, 사용 중 및 빈 메모리뿐만 아니라 버퍼 및 캐시에 대한 정보도 표시합니다.
- vmstat: 프로세스, 메모리, 페이징, 블록 IO, 트랩 및 CPU 활동에 대한 정보를 보고합니다.

디스크 사용량 확인:

- df: 모든 마운트된 파일 시스템의 디스크 공간 사용량을 표시합니다.
- du: 디렉토리 및 파일의 디스크 사용량을 추정합니다.

네트워크 정보 보기:

<div class="content-ad"></div>

- ifconfig 또는 ip addr: IP 주소, MAC 주소 및 네트워크 구성을 포함한 네트워크 인터페이스 정보를 표시합니다.
- netstat: 네트워크 연결, 라우팅 테이블, 인터페이스 통계, 마스커레이드 연결 및 멀티캐스트 멤버십을 표시합니다.
- ss: netstat보다 더 상세한 정보를 표시하는 소켓을 조사하기 위한 도구입니다.

# 패키지 관리:

Debian/Ubuntu 기반 시스템 (APT 사용):

- apt update: 로컬 패키지 인덱스를 업데이트하여 저장소에서 최신 변경 사항을 반영합니다.
- apt upgrade: 모든 설치된 패키지를 최신 버전으로 업그레이드합니다.
- apt install `패키지`: 지정된 패키지를 설치합니다.
- apt remove `패키지`: 지정된 패키지 및 해당 구성 파일을 제거합니다.
- apt purge `패키지`: 지정된 패키지 및 해당 구성 파일을 완전히 제거합니다.
- apt search `키워드`: 지정된 키워드와 일치하는 패키지를 검색합니다.
- apt list --installed: 모든 설치된 패키지를 나열합니다.

<div class="content-ad"></div>

Red Hat/CentOS 기반 시스템(YUM 또는 DNF 사용):

- yum update 또는 dnf update: 설치된 모든 패키지를 최신 버전으로 업데이트합니다.
- yum install `package` 또는 dnf install `package`: 지정된 패키지를 설치합니다.
- yum remove `package` 또는 dnf remove `package`: 지정된 패키지를 제거합니다.
- yum search `keyword` 또는 dnf search `keyword`: 지정된 키워드와 일치하는 패키지를 검색합니다.
- yum list installed 또는 dnf list installed: 설치된 모든 패키지를 나열합니다.

모든 시스템에 적용되는 일반적인 패키지 관리 명령어:

- apt-cache search `keyword`: 데비안/우분투 기반 시스템에서 지정된 키워드와 일치하는 패키지를 검색합니다.
- rpm -qa: Red Hat/CentOS 기반 시스템에서 설치된 모든 패키지를 나열합니다.
- dpkg -l: 데비안/우분투 기반 시스템에서 설치된 모든 패키지를 나열합니다.

<div class="content-ad"></div>

# 파일 관리:

- find: 다양한 기준에 따라 이름, 크기 또는 권한과 같은 기준을 기반으로 디렉터리 계층 구조에서 파일 및 디렉토리를 검색합니다.
- grep: 파일이나 표준 입력에서 패턴을 검색합니다. 특정 패턴을 포함하는 줄을 필터링하는 데 자주 사용됩니다.
- awk: 입력 라인에서 작동하는 다재다능한 텍스트 처리 도구로 패턴에 따라 동작을 수행할 수 있습니다.
- sed: 입력 스트림에서 텍스트 변환을 수행하는 스트림 편집기입니다. 주로 검색 및 치환 작업에 사용됩니다.
- tar: 파일을 하나의 파일(일반적으로 "tarball"이라고 함)로 아카이브화하고 선택적으로 압축합니다.
- gzip: gzip 압축 알고리즘을 사용하여 파일을 압축합니다. 압축된 버전으로 원본 파일을 대체합니다.
- zip: 파일을 zip 아카이브로 압축하여 여러 파일과 디렉터리를 포함할 수 있습니다.

# 네트워킹:

네트워크 구성:

<div class="content-ad"></div>

- ifconfig 또는 ip addr: IP 주소, MAC 주소 및 네트워크 구성을 포함한 네트워크 인터페이스를 표시하거나 구성합니다.
- iwconfig: 무선 네트워크 인터페이스를 구성합니다.

네트워크 연결:

- ping: ICMP 에코 요청 패킷을 보내어 원격 호스트와의 연결을 테스트합니다.
- traceroute 또는 traceroute6: 목적지 호스트에 도달하는 경로를 추적합니다.
- mtr: ping 및 traceroute의 기능을 결합하여 실시간 네트워크 진단을 제공합니다.
- netcat 또는 nc: 네트워크 연결을 통해 데이터를 읽고 씁니다. 주로 디버깅 및 네트워크 탐색에 사용됩니다.
- telnet: Telnet 프로토콜을 사용하여 원격 시스템과 통신할 수 있습니다.
- ssh: SSH 프로토콜을 사용하여 안전하게 원격 시스템에 연결합니다.

DNS 구성 및 해상도:

<div class="content-ad"></div>

- dig: 다양한 DNS 레코드를 조회하고 DNS 서버를 쿼리하는 유틸리티입니다.
- nslookup: 도메인 이름을 해결하기 위해 DNS 서버를 쿼리하는 또 다른 DNS 조회 유틸리티입니다.

네트워크 서비스 및 포트:

- netstat: 네트워크 연결, 라우팅 테이블, 인터페이스 통계, 마스커레이드 연결 및 멀티캐스트 멤버십을 표시합니다.
- ss: netstat보다 더 자세한 정보를 제공하는 소켓을 조사하기 위한 다른 유틸리티입니다.
- nmap: 네트워크 호스트 및 서비스를 발견하는 강력한 네트워크 스캐닝 도구입니다.

네트워크 진단:

<div class="content-ad"></div>

- arp: IP-to-MAC 주소 변환 테이블을 표시하거나 조작합니다.
- tcpdump: 리얼타임으로 네트워크 패킷을 캡처하고 분석합니다.
- wireshark: 네트워크 트래픽을 심층적으로 검사할 수 있는 그래픽 네트워크 프로토콜 분석기입니다.

방화벽 및 보안:

- iptables: 패킷 필터링, 네트워크 주소 변환(NAT) 및 기타 방화벽 관련 작업을 제어합니다.
- ufw: iptables 방화벽 규칙을 관리하기 위한 사용자 친화적 인터페이스입니다.
- fail2ban: 시스템 로그를 모니터링하고 악의적인 행동을 보이는 IP 주소를 동적으로 차단합니다.

기타 유틸리티:

<div class="content-ad"></div>

- 호스트 이름: 시스템의 호스트 이름을 표시하거나 설정합니다.
- 라우트: IP 라우팅 테이블을 표시하거나 조작합니다.
- ifup 및 ifdown: 각각 네트워크 인터페이스를 활성화하거나 비활성화합니다.

# 프로세스 관리:

프로세스 보기:

- ps: 활성 프로세스에 대한 정보를 표시합니다. -aux는 모든 프로세스의 상세 목록을, -ef는 모든 프로세스의 전체 목록을 제공합니다.
- top: 시스템 프로세스, CPU 사용량 및 메모리 사용량의 동적 실시간 보기를 제공합니다.
- htop: 시스템 리소스 개요를 제공하고 쉬운 프로세스 관리를 가능하게 하는 대화형 프로세스 뷰어입니다.
- pgrep: 이름 또는 다른 속성에 기반하여 프로세스를 찾고 해당 프로세스 ID를 출력합니다.
- pstree: 프로세스의 계층적 관계를 보여주는 프로세스의 트리 다이어그램을 표시합니다.

<div class="content-ad"></div>

프로세스 종료하기:

- kill: 프로세스를 시그널을 보내어 종료시킵니다. 기본적으로 TERM 시그널을 보내지만, KILL이나 HUP과 같은 다른 시그널도 지정할 수 있습니다.
- killall: PID 대신 프로세스 이름으로 프로세스를 종료합니다.
- pkill: killall과 유사하지만, 정규 표현식을 사용하여 이름이나 다른 속성으로 프로세스를 지정할 수 있는 더 유연한 기능을 제공합니다.
- xkill: 사용자가 클릭하여 창이나 프로세스를 종료할 수 있게 해주는 그래픽 도구입니다.

백그라운드와 포그라운드 프로세스:

- bg: 멈춘 프로세스나 백그라운드로 전환된 프로세스를 백그라운드로 보냅니다.
- fg: 백그라운드로 전환된 프로세스를 포그라운드로 가져옵니다.
- jobs: 현재 쉘과 연관된 활성 작업(백그라운드 프로세스)을 나열합니다.

<div class="content-ad"></div>

프로세스 우선순위 및 제어:

- nice: 특정 우선순위 수준으로 프로세스를 시작합니다.
- renice: 기존 프로세스의 우선순위를 변경합니다.
- ionice: 프로세스의 I/O 스케줄링 우선순위를 설정합니다.

모니터링 및 디버깅:

- strace: 프로세스가 만든 시스템 호출과 신호를 추적하며 디버깅에 유용합니다.
- lsof: 열린 파일과 해당 파일을 열었던 프로세스를 나열하며 문제 해결에 유용합니다.
- pidof: 실행 중인 프로그램의 프로세스 ID를 반환합니다.
- pgrep: 이름 및 기타 속성에 따라 프로세스를 검색하고 해당 프로세스 ID를 출력합니다.
- killall: PID가 아닌 이름으로 프로세스를 종료합니다.

<div class="content-ad"></div>

시스템 리소스 사용량:

- free: 시스템의 빈 메모리 및 사용 중인 메모리 양을 표시합니다.
- vmstat: 프로세스, 메모리, 페이징, 블록 IO, 트랩 및 CPU 활동에 관한 정보를 보고합니다.
- sar: CPU, 메모리, 디스크 및 네트워크 사용량을 포함한 시스템 활동 정보를 수집, 보고 및 저장합니다.

# 시스템 관리:

시스템 서비스 관리하기:

<div class="content-ad"></div>

systemctl: systemd 서비스를 제어하는 명령어로, 서비스를 시작하고 중지하며, 다시 시작하고, 활성화하고 비활성화하며, 서비스 상태를 확인할 수 있습니다. 예를 들어:

- 서비스 시작: sudo systemctl start 서비스명
- 서비스 중지: sudo systemctl stop 서비스명
- 서비스 다시 시작: sudo systemctl restart 서비스명
- 서비스 활성화: sudo systemctl enable 서비스명
- 서비스 비활성화: sudo systemctl disable 서비스명
- 서비스 상태 확인: sudo systemctl status 서비스명

service: 전통적인 SysVinit 시스템에서 자주 사용되는 시스템 서비스를 관리하는 커맨드 라인 도구입니다. 서비스를 시작, 중지, 다시 시작, 다시로드, 활성화하고 비활성화할 수 있습니다. 예를 들어:

- 서비스 시작: sudo service 서비스명 start
- 서비스 중지: sudo service 서비스명 stop
- 서비스 다시 시작: sudo service 서비스명 restart
- 서비스 다시로드: sudo service 서비스명 reload
- 서비스 활성화: sudo service 서비스명 enable
- 서비스 비활성화: sudo service 서비스명 disable

<div class="content-ad"></div>

시스템 백업과 복원:

백업:

- tar: 파일을 단일 파일(타 볼)로 아카이빙하고 선택적으로 압축하는 명령입니다. 예를 들어:
    - 타볼 생성: tar -cvf backup.tar /백업/경로
- rsync: 파일 및 디렉토리를 다양한 위치간에 동기화하는 명령으로, 주로 백업용으로 사용됩니다. 예를 들어:

백업 파일: rsync -av /원본/디렉토리/ /대상/디렉토리/

<div class="content-ad"></div>

다음은 복구를 위해 파일을 복원하는 방법입니다:

- tar: tarball에서 파일을 추출합니다. 예를 들어,
  - 파일 추출: tar -xvf backup.tar -C /복원할/경로
- rsync: 백업 위치에서 파일을 복원합니다. 예를 들어,

파일 복원: rsync -av /백업/소스/ /복원/대상/

디스크 관리:

<div class="content-ad"></div>

- fdisk: 디스크 파티션을 조작하는 명령줄 유틸리티입니다. 디스크 파티션을 생성, 삭제 및 관리할 수 있습니다. 예를 들어:

fdisk 시작하기: sudo fdisk /dev/sdX

- mkfs: 디스크 파티션에 파일 시스템을 생성합니다. 다양한 파일 시스템 유형으로 파티션을 포맷하는 데 사용됩니다. 예를 들어:

ext4 파일 시스템으로 파티션 포맷: sudo mkfs.ext4 /dev/sdX1

<div class="content-ad"></div>

- mount: 파일 시스템을 디렉터리 트리에 장착하여 접근 가능하게 합니다. 예를 들어:

파일 시스템 장착하기: sudo mount /dev/sdX1 /mnt

- df: 모든 장착된 파일 시스템의 디스크 공간 사용량을 표시합니다. 예를 들어:

디스크 공간 사용량 표시: df -h

<div class="content-ad"></div>

# 주제:

쉘 스크립팅 (Bash 스크립팅 기본):

- Bash 스크립팅을 사용하면 사용자가 명령을 실행하고 작업을 수행하는 스크립트를 작성하여 작업을 자동화할 수 있습니다.
- 기본 요소로는 변수, 루프, 조건문, 함수 및 명령 치환이 포함됩니다.
- 예시:

```js
#!/bin/bash
# 이것은 간단한 Bash 스크립트입니다.

# 변수 정의
greeting="Hello, world!"

# 인사말 출력
echo $greeting
```

<div class="content-ad"></div>

원격 관리 (SSH, rsync):

- Secure Shell (SSH)을 사용하면 사용자가 네트워크를 통해 안전하게 원격 시스템에 액세스하고 관리할 수 있습니다.
- 예시:

```js
ssh username@hostname
```

- Rsync는 파일과 디렉토리를 효율적으로 동기화하는 유틸리티입니다.
- 예시:

<div class="content-ad"></div>

```js
rsync -av /로컬/경로/ username@원격호스트:/원격/경로/
```

시스템 보안 (방화벽 구성, SELinux, AppArmor):

방화벽 구성:

- 방화벽 규칙을 구성하기 위해 iptables (레거시) 또는 firewalld (현대)와 같은 도구가 사용됩니다.


<div class="content-ad"></div>

SELinux (보안 강화된 리눅스):

- 의무적 액세스 제어 (MAC)를 포함한 액세스 제어 보안 정책을 제공합니다.
- 상태를 확인하기 위한 sestatus 및 적용 모드를 변경하기 위한 setenforce와 같은 명령어가 있습니다.

AppArmor:

- 프로그램 기능을 제한하는 의무적 액세스 제어 프레임워크입니다.
- 상태를 확인하기 위한 apparmor_status 및 정책을 시행하기 위한 aa-enforce와 같은 명령어가 있습니다.

<div class="content-ad"></div>

가상화 및 컨테이너화 (VirtualBox, Docker):

VirtualBox:

- 사용자가 호스트 시스템에서 가상 머신(VM)을 생성하고 관리할 수 있습니다.
- 그래픽 사용자 인터페이스(GUI) 및 명령줄 인터페이스(CLI) 도구를 제공합니다.

Docker:

<div class="content-ad"></div>

- 컨테이너에서 응용 프로그램을 개발, 배포 및 실행하는 플랫폼입니다.
- 명령어에는 컨테이너가 실행되는 도커 런, 이미지를 빌드하는 도커 빌드, 여러 컨테이너 응용 프로그램을 위한 도커 컴포즈가 포함됩니다.

이러한 고급 토픽은 리눅스 환경에서 스크립팅, 원격 관리, 시스템 보안 및 가상화/컨테이너화와 같은 중요한 개념 및 명령어를 다룹니다. 이를 통해 사용자는 작업을 자동화하고 원격 시스템을 관리하며 보안을 강화하고 효율적으로 응용 프로그램을 배포할 수 있습니다.

# 만약 이 안내서가 도움이 되었다면 👏 버튼을 클릭해주세요.

더 많은 학습을 원하시면 이렇게 🤗 함께하세요.

<div class="content-ad"></div>

특정 주제에 대해 궁금한 점이 있으면 개인적인 노트나 코멘트를 남겨주세요. 당신의 관심사를 더 탐구하는 데 도움을 드리기 위해 여기 있어요!

# 소중한 시간을 들여 지식을 향상시키기 위해 고생해 주셔서 감사합니다!