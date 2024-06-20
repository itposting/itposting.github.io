---
title: "트라이햅미 케노비 라이트업"
description: ""
coverImage: "/assets/img/2024-06-19-TryHackMeKenobiWriteup_0.png"
date: 2024-06-19 15:01
ogImage: 
  url: /assets/img/2024-06-19-TryHackMeKenobiWriteup_0.png
tag: Tech
originalTitle: "TryHackMe: Kenobi Writeup"
link: "https://medium.com/@zaynahsd/tryhackme-kenobi-writeup-93953817d7da"
---


리눅스 머신을 해킹해 봅시다.

![TryHackMeKenobiWriteup_0](/assets/img/2024-06-19-TryHackMeKenobiWriteup_0.png)

**Task 1** 취약한 머신 배포하기

열려 있는 포트: 7 (nmap `머신의 IP 주소`-vvv)

<div class="content-ad"></div>

과제 2 Samba 공유 목록 열거

Samba는 Linux 및 Unix 용 표준 Windows 상호 운용성 프로그램 스위트입니다. 회사의 내부망 또는 인터넷에서 파일, 프린터 및 기타 공유 리소스에 대한 액세스 및 사용을 끝 사용자에게 허용합니다. 이는 종종 네트워크 파일 시스템으로 불립니다.

Samba는 Server Message Block (SMB)의 공통 클라이언트/서버 프로토콜에 기반을 두고 있습니다. SMB는 Windows 전용으로 개발되었으며, Samba가 없으면 같은 네트워크에 속해 있더라도 다른 컴퓨터 플랫폼이 Windows 기계로부터 격리될 수 있습니다.

nmap을 사용하여 기계를 SMB 공유에 대해 열거할 수 있습니다.

<div class="content-ad"></div>

Nmap은 다양한 네트워킹 작업을 자동화하여 실행할 수 있는 능력을 가지고 있어요. 공유를 열거하는 스크립트가 있어요!


nmap -p 445 --script=smb-enum-shares.nse,smb-enum-users.nse 10.10.3.132


SMB에는 445번과 139번이라는 두 개의 포트가 있어요.

![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_1.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TryHackMeKenobiWriteup_2.png" />

위의 nmap 명령어를 사용하여 찾은 공유는 몇 개인가요?

발견된 공유: 3

대부분의 Linux 배포판에는 이미 smbclient가 설치되어 있습니다. 공유 중 하나를 검사해 봅시다.

<div class="content-ad"></div>

smbclient //`machine’s ip`/anonymous

당신의 컴퓨터를 사용하여, 해당 컴퓨터의 네트워크 공유에 연결하세요.

![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_3.png)

연결되었으면 공유된 파일 목록을 나열하세요. 어떤 파일을 볼 수 있나요?

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_4.png)

파일: log.txt

SMB 공유를 재귀적으로 다운로드할 수도 있습니다. 아이디와 비밀번호를 'nothing'으로 제출하실 수 있습니다.

smbget -R smb://`머신의 아이피`/anonymous


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_5.png)

공유된 파일을 열어보세요. 발견된 몇 가지 흥미로운 정보들이 있습니다.

유저를 위해 SSH 키를 생성할 때 Kenobi에 대한 생성된 정보

ProFTPD 서버에 관한 정보.


<div class="content-ad"></div>

FTP는 어떤 포트에서 실행되나요?

![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_6.png)

포트: 21

이전에 실행한 nmap 포트 스캔에서 포트 111에서 rpcbind 서비스가 실행 중인 것을 확인했을 것입니다. 이 서비스는 원격 프로시저 호출(RPC) 프로그램 번호를 유니버설 주소로 변환하는 서버에 불과합니다. RPC 서비스가 시작되면 rpcbind에게 해당 서비스가 수신 대기하고 있는 주소 및 제공할 RPC 프로그램 번호를 알려줍니다.

<div class="content-ad"></div>

우리 경우에는 포트 111은 네트워크 파일 시스템에 액세스하는 것입니다. 이를 열어보기 위해 nmap을 사용합시다.

nmap -p 111 — script=nfs-ls,nfs-statfs,nfs-showmount 10.10.3.132

어떤 mount를 볼 수 있나요?

![네트워크 파일 시스템](/assets/img/2024-06-19-TryHackMeKenobiWriteup_7.png)

<div class="content-ad"></div>

`Mount: /var`

**Task 3: ProFtpd를 사용하여 초기 액세스 얻기**

ProFtpd는 Unix 및 Windows 시스템과 호환되는 무료 오픈 소스 FTP 서버입니다. 과거 소프트웨어 버전에서 취약점이 발견되기도 했습니다.

아래의 질문에 답해주세요.

<div class="content-ad"></div>

ProFtpd의 버전을 확인해 봅시다. FTP 포트에 머신에 netcat을 사용하여 연결하세요.

```bash
nc `머신의 IP` 21
```

버전은 무엇인가요?

버전: 1.3.5

<div class="content-ad"></div>

searchsploit을 사용하여 특정 소프트웨어 버전에 대한 취약점을 찾을 수 있어요.

Searchsploit은 기본적으로 exploit-db.com의 명령 줄 검색 도구에요.

ProFTPd를 실행 중인 시스템에 대한 exploit이 얼마나 있죠?

searchsploit ProFTPD `버전 번호`

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_8.png)

Exploits running: 4

ProFtpd의 mod_copy 모듈(http://www.proftpd.org/docs/contrib/mod_copy.html)에서 exploit을 발견했어요.

mod_copy 모듈은 SITE CPFR 및 SITE CPTO 명령을 구현하며, 이를 사용하여 서버의 한 곳에서 다른 곳으로 파일/디렉터리를 복사할 수 있습니다. 인증되지 않은 클라이언트는 이러한 명령을 이용하여 파일을 파일 시스템의 어디서든 원하는 대상으로 복사할 수 있습니다.


<div class="content-ad"></div>

FTP 서비스가 Kenobi 사용자로 실행되고 (공유 파일에서) 그 사용자를 위해 SSH 키가 생성되었다는 것을 알고 있습니다.

이제 SITE CPFR 및 SITE CPTO 명령을 사용하여 Kenobi의 개인 키를 복사할 것입니다.

![image](/assets/img/2024-06-19-TryHackMeKenobiWriteup_9.png)

우리는 /var 디렉토리가 우리가 볼 수 있는 마운트임을 알고 있었습니다(task 2, question 4). 이제 Kenobi의 개인 키를 /var/tmp 디렉토리로 이동했어요.

<div class="content-ad"></div>

'/var/tmp' 디렉토리를 우리의 머신에 연결해 봅시다.


sudo mkdir /mnt/kenobiNFS
sudo mount machine_ip:/var /mnt/kenobiNFS
ls -la /mnt/kenobiNFS


<div class="content-ad"></div>


![Screenshot 10](/assets/img/2024-06-19-TryHackMeKenobiWriteup_10.png)

We now have a network mount on our deployed machine! We can go to `/var/tmp` and get the private key then login to Kenobi’s account.

![Screenshot 11](/assets/img/2024-06-19-TryHackMeKenobiWriteup_11.png)

![Screenshot 12](/assets/img/2024-06-19-TryHackMeKenobiWriteup_12.png)


<div class="content-ad"></div>

케노비의 사용자 플래그(/home/kenobi/user.txt)는 무엇인가요?

![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_13.png)

사용자 플래그: d0b0f3f53b6caa532a83915e19224899

작업 4 경로 변수 조작을 통한 권한 상승

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TryHackMeKenobiWriteup_14.png" />

우선 SUID, SGID 및 Sticky Bits가 무엇인지 이해해 봅시다.

파일 권한

<div class="content-ad"></div>

디렉토리에 대해서

SUID 비트

사용자가 파일 소유자의 권한으로 파일을 실행합니다.

-


<div class="content-ad"></div>

SGID 비트

사용자가 그룹 소유자의 권한으로 파일을 실행합니다.

디렉토리에 만들어진 파일은 동일한 그룹 소유자를 가집니다.

Sticky Bit

<div class="content-ad"></div>

아래 명령어를 사용하여 시스템에서 이 유형의 파일을 검색할 수 있습니다:

<div class="content-ad"></div>

다음 명령어를 사용하여 특이한 파일을 찾을 수 있습니다: 
```bash
find / -perm -u=s -type f 2>/dev/null
```

찾은 파일 중에서 특이한 것은 다음과 같습니다:

![특이한 파일](/assets/img/2024-06-19-TryHackMeKenobiWriteup_15.png)

파일: /usr/bin/menu

<div class="content-ad"></div>

바이너리를 실행하면 몇 개의 옵션이 나타납니까?

![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_16.png)

옵션: 3

`strings`는 리눅스에서 바이너리 파일에서 사람이 읽을 수 있는 문자열을 찾는 명령어입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TryHackMeKenobiWriteup_17.png" />

여기에서 볼 수 있듯이, 해당 이진 파일은 전체 경로를 사용하지 않고 (예: /usr/bin/curl 또는 /usr/bin/uname를 사용하지 않음) 실행 중입니다.

<img src="/assets/img/2024-06-19-TryHackMeKenobiWriteup_18.png" />

이 파일은 루트 사용자 권한으로 실행되므로, 경로를 조작하여 루트 셸을 얻을 수 있습니다.

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-19-TryHackMeKenobiWriteup_19.png)

![이미지2](/assets/img/2024-06-19-TryHackMeKenobiWriteup_20.png)

우리는 /bin/sh 쉘을 복사하여 curl이라고 이름 지었으며 올바른 권한을 부여한 다음 그 위치를 경로에 넣었습니다. 이는 /usr/bin/menu 이진 파일이 실행될 때 경로 변수를 사용하여 "curl" 이진 파일을 찾게 한다는 것을 의미합니다. 실제로 이는 /usr/sh의 버전이며 이 파일이 root로 실행되는 동안 우리의 쉘도 root로 실행됩니다!

루트 플래그(/root/root.txt)는 무엇인가요?


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TryHackMeKenobiWriteup_21.png)

Root Flag: 177b3cd8562289f37382721c28381f02
