---
title: "리눅스 디렉터리 구조"
description: ""
coverImage: "/assets/img/2024-06-19-LinuxDirectoryStructure_0.png"
date: 2024-06-19 14:55
ogImage: 
  url: /assets/img/2024-06-19-LinuxDirectoryStructure_0.png
tag: Tech
originalTitle: "Linux Directory Structure"
link: "https://medium.com/@dheeruthedeployer/linux-directory-structure-03ab5c23e993"
---


# Linux 디렉토리 구조에 대한 자세한 설명

# 부팅 프로세스

부팅 로더 (/boot)

- Linux 시스템이 시작되면 BIOS 또는 UEFI 펌웨어가 하드웨어를 초기화하고 부팅로더(예: GRUB)를 /boot 디렉토리에서 불러옵니다.
- 부팅로더는 커널(/boot/vmlinuz)과 초기 RAM 디스크(/boot/initrd.img)를 메모리에 불러옵니다.

<div class="content-ad"></div>

커널 초기화 (/proc, /sys)

- 커널은 시스템 구성 요소를 초기화하고 루트 파일 시스템을 마운트합니다.
- 초기화 과정에서 커널은 프로세스와 시스템 하드웨어에 관한 정보를 /proc 및 /sys에 채웁니다.

# 시스템 초기화

시스템 및 서비스 초기화 (/etc, /lib, /sbin, /run)

<div class="content-ad"></div>

- 커널이 초기화된 후에는 부팅 프로세스를 담당하는 init 프로세스(또는 현대의 Linux 시스템에서는 systemd)가 시작됩니다.
- systemd는 /etc/systemd 및 /etc의 다른 디렉토리에서 구성 파일을 읽어 필요한 시스템 서비스를 시작합니다.
- 부팅 및 시스템 서비스 실행에 필요한 필수 라이브러리는 /lib에 위치합니다.
- 시스템 관리 이진 파일은 /sbin 및 /usr/sbin에 있어 서비스를 관리하는 데 도움이 됩니다.
- /run은 시스템 작동 중에 일시적인 시스템 정보를 저장하는 데 사용됩니다.

# 사용자 환경 설정

사용자 환경 (/home, /usr, /opt)

- 시스템 서비스가 시작되면 사용자가 로그인하여 개인 환경이 설정됩니다.
- 각 사용자는 /home 아래에 홈 디렉토리를 갖고 있어 개인 파일과 설정이 저장됩니다.
- 사용자 응용 프로그램 및 도구는 일반적으로 /usr/bin 및 /usr/local/bin에 저장됩니다.
- 선택적 및 제3자 응용 프로그램은 /opt에 설치됩니다.

<div class="content-ad"></div>

# 시스템 작동

장치 관리 (/dev)

- /dev는 하드 드라이브, 터미널, 프린터 등의 하드웨어 구성 요소를 나타내는 장치 파일을 포함합니다.
- 장치 파일을 통해 소프트웨어가 표준 입력/출력 작업을 사용하여 하드웨어와 상호 작용할 수 있습니다.

구성 및 관리 (/etc)

<div class="content-ad"></div>

- /etc에 있는 설정 파일들은 시스템 동작, 네트워크 설정, 사용자 계정 정보, 서비스 구성을 정의합니다.
- 관리자들은 이러한 파일을 편집하여 시스템 설정을 관리합니다.

변수 데이터 (/var)

- 시스템과 애플리케이션이 생성한 로그, 캐시, 스풀 파일 등과 같은 동적 데이터는 /var에 저장됩니다.
- 로그 파일 (/var/log)은 시스템 및 애플리케이션 활동을 기록하여 모니터링 및 문제 해결을 위해 사용됩니다.
- 메일 스풀 (/var/spool/mail)은 수신된 이메일을 저장합니다.

임시 파일 (/tmp, /var/tmp)

<div class="content-ad"></div>

- 애플리케이션이 /tmp 및 /var/tmp에 임시 파일을 저장합니다.
- /tmp에있는 파일은 일반적으로 재부팅 시 삭제되지만, /var/tmp에있는 파일은 다시 부팅해도 유지됩니다.

# 예: 사용자 애플리케이션 실행

애플리케이션 실행

- 사용자는 /usr/bin이나 /usr/local/bin에서 애플리케이션을 실행합니다.
- 해당 애플리케이션은 /lib이나 /usr/lib에서 공유 라이브러리를 로드할 수 있습니다.

<div class="content-ad"></div>

하드웨어와 상호 작용하기

- 애플리케이션이 하드웨어와 상호 작용해야 할 때, /dev 디렉토리에 해당 장치 파일에 접근합니다.

사용자 데이터 저장 및 접근

- 사용자별 데이터 및 구성은 사용자의 홈 디렉토리 (/home/사용자이름)의 파일에서 읽거나 쓰여집니다.

<div class="content-ad"></div>

로그 및 임시 데이터

- 애플리케이션은 활동을 /var/log에 있는 파일에 기록할 수 있습니다.
- 애플리케이션이 생성한 임시 데이터는 /tmp 또는 /var/tmp에 저장됩니다.

# 시스템 유지 보수

소프트웨어 업데이트

<div class="content-ad"></div>

- 시스템 및 응용 프로그램 업데이트는 /bin, /sbin, /lib, /usr/bin, /usr/sbin 또는 /opt에 새 파일을 설치할 수 있습니다.

구성 변경

시스템 관리자는 시스템 또는 서비스 동작을 변경하기 위해 /etc에 있는 구성 파일을 편집할 수 있습니다.

모니터링 및 문제 해결

<div class="content-ad"></div>

`/var/log`에 있는 로그는 시스템 상태를 모니터링하고 문제를 해결하기 위해 검토됩니다.

아키텍처

![Image](/assets/img/2024-06-19-LinuxDirectoryStructure_0.png)

디렉토리 구조 개요

<div class="content-ad"></div>


/
├── bin
├── boot
├── dev
├── etc
├── home
│ └── user
├── lib
├── media
├── mnt
├── opt
├── proc
├── root
├── run
├── sbin
├── srv
├── sys
├── tmp
├── usr
│ ├── bin
│ ├── lib
│ ├── local
│ └── sbin
└── var
 ├── log
 ├── spool
 └── tmp



|- / (Root)

설명: 모든 다른 디렉토리가 뻗어나온 최상위 디렉토리입니다.
예시: /bin, /etc, /home은 모두 /의 하위 디렉토리입니다.



|- /bin

설명: 모든 사용자가 필요로 하는 기본 명령어와 도구를 위한 필수 바이너리 실행 파일이 들어 있습니다.
예시:
/bin/ls (디렉토리 내용 나열)
/bin/bash (Bourne Again Shell)
/bin/cp (파일과 디렉토리 복사)



|- /boot

설명: 부트로더 파일과 커널 이미지가 들어 있습니다.
예시:
/boot/vmlinuz (리눅스 커널)
/boot/initrd.img (초기 RAM 디스크 이미지)
/boot/grub/grub.cfg (GRUB 부트로더 구성 파일)


<div class="content-ad"></div>

```js
| - /dev 

설명: 하드웨어 장치를 나타내는 장치 파일이 포함되어 있습니다.
예시:
/dev/sda1 (첫 번째 하드 드라이브의 첫 번째 파티션)
/dev/tty1 (터미널 장치)
/dev/null (데이터를 버리는 널 장치)

```

```js
| - /etc 

설명: 시스템 전체의 구성 파일 및 초기화를 위한 쉘 스크립트가 포함되어 있습니다.
예시:
/etc/passwd (사용자 계정 정보)
/etc/fstab (파일 시스템 마운트 포인트)
/etc/hosts (호스트 이름의 정적 테이블 조회)

```

```js
| - /home 

설명: 시스템에 존재하는 각 사용자의 개인 디렉토리가 포함되어 있습니다. (사용자별 데이터)
예시:
/home/alice (앨리스의 홈 디렉토리)
/home/bob (밥의 홈 디렉토리)

```

```js
| - /lib 

설명: 시스템 이진 파일이 필요로 하는 공유 라이브러리가 포함되어 있습니다.
예시:
/lib/libc.so.6 (C 표준 라이브러리)
/lib/modules (커널 모듈)

```  

<div class="content-ad"></div>


|- /media

Description: USB 드라이브, CD 및 DVD와 같은 탈착식 미디어를 연결하는 데 사용됩니다.
예시:
/media/cdrom (CD-ROM을 연결하는 마운트 포인트)
/media/usb (USB 드라이브를 연결하는 마운트 포인트)



|- /mnt

Description: 임시로 파일 시스템을 마운트하는 일반적인 마운트 포인트입니다.
예시:
관리자는 다음과 같이 파일 시스템을 임시로 마운트할 수 있습니다:
sudo mount /dev/sdb1 /mnt



|- /opt

Description: 선택적 소프트웨어 패키지 및 타사 응용 프로그램이 포함됩니다.
예시:
/opt/google (Google 애플리케이션의 설치 디렉토리)
/opt/vmware (VMware 애플리케이션의 설치 디렉토리)



|- /proc

Description: 프로세스 및 시스템에 대한 정보를 제공하는 가상 파일 시스템입니다.
예시:
/proc/cpuinfo (CPU 정보)
/proc/meminfo (메모리 사용량 정보)
/proc/1234 (PID가 1234인 프로세스에 대한 정보를 포함하는 디렉토리)


<div class="content-ad"></div>

```js
|- /root

설명: 시스템 관리자를 위한 홈 디렉토리입니다.
예시:
/root/.bashrc (루트 사용자용 Bash 구성 파일)
/root/scripts (관리 작업을 위한 사용자 정의 스크립트)
```

```js
|- /run

설명: 시스템 프로세스 및 서비스의 런타임 데이터를 포함합니다.
예시:
/run/lock (락 파일)
/run/user/1000 (UID 1000을 가진 사용자를 위한 런타임 데이터)
```

```js
|- /sbin

설명: 시스템 관리에 사용되는 필수 시스템 이진 파일이 포함되어 있습니다.
예시:
/sbin/reboot (시스템 재부팅)
/sbin/ifconfig (네트워크 인터페이스 구성)
/sbin/fdisk (디스크 파티셔닝 도구)
```

```js
|- /srv

설명: 시스템에서 제공하는 서비스에 대한 데이터가 포함되어 있습니다.
예시:
/srv/ftp (FTP 서버 데이터)
/srv/www (웹 서버 데이터)
```

<div class="content-ad"></div>

```js
|- /sys

설명: 커널, 장치 및 시스템 하드웨어에 대한 정보를 제공하는 가상 파일 시스템입니다.
예시:
/sys/class/net (네트워크 인터페이스)
/sys/devices (시스템 장치)
```

```js
|- /tmp

설명: 애플리케이션에서 사용하는 임시 파일을 저장하는 디렉토리입니다.
예시:
애플리케이션 실행 시 생성되는 임시 파일로, 종종 재부팅 시 정리됩니다.
/tmp/install.log (소프트웨어 설치 중 생성된 임시 로그 파일)
```

```js
|- /usr

설명: 사용자 관련 프로그램 및 데이터를 포함합니다. 중요한 하위 디렉토리가 여러 개 있습니다:
/usr/bin: 사용자 실행 파일.
예시:
/usr/bin/python (Python 인터프리터)
/usr/bin/gcc (GNU C 컴파일러)
```

```js
|- /usr/sbin: 시스템 관리 이진 파일.
예시:
/usr/sbin/apache2 (아파치 웹 서버)

|- /usr/lib: 사용자 응용프로그램을 위한 라이브러리.
예시:
/usr/lib/libssl.so (OpenSSL 라이브러리)
```

<div class="content-ad"></div>

```js
|- /usr/local

Description: 로컬에 설치된 소프트웨어 및 사용자 지정 스크립트입니다.
예시:
/usr/local/bin/myscript.sh (사용자 지정 스크립트)
/usr/local/lib/mylib.so (사용자 지정 공유 라이브러리)
```

```js
|- /var

Description: 로그, 데이터베이스 및 스풀 파일과 같은 변수 데이터 파일이 포함되어 있습니다.
예시:
/var/log: 로그 파일.
예시:
/var/log/syslog (시스템 로그)
/var/log/auth.log (인증 로그)
```

```js
|- /var/spool 
Description: 메일 및 인쇄와 같은 작업을 위한 스풀 디렉토리입니다.
예시:
/var/spool/mail (사용자 메일함)
```

```js
|- /var/tmp: 

Description: 재부팅 간에 유지되는 임시 파일입니다.
예시:
세션 당보다 오래 지속되어야 하는 응용 프로그램이 생성하는 임시 파일.
```

<div class="content-ad"></div>

# 요약

- Root (/): 최상위 디렉토리.
- 시스템 이진 파일 (/bin, /sbin): 중요한 명령 줄 유틸리티 및 시스템 이진 파일.
- 부팅 파일 (/boot): 부트로더 및 커널 파일.
- 장치 파일 (/dev): 하드웨어 장치와의 인터페이스.
- 설정 파일 (/etc): 시스템 및 애플리케이션 설정.
- 홈 디렉토리 (/home): 사용자 데이터 및 설정.
- 라이브러리 (/lib, /usr/lib): 공유 라이브러리.
- 임시 파일 (/tmp, /var/tmp): 애플리케이션의 임시 저장소.
- 사용자 프로그램 (/usr): 사용자 애플리케이션과 도구.
- 로그 및 변수 데이터 (/var): 로그, 수동 파일 및 기타 변수 데이터.
- 선택적 소프트웨어 (/opt): 제3자 애플리케이션 및 패키지.