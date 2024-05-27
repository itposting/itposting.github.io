---
title: "사이버렌즈 - TryHackMe 후기"
description: ""
coverImage: "/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_0.png"
date: 2024-05-27 12:37
ogImage:
  url: /assets/img/2024-05-27-CyberLens-TryHackMeWriteup_0.png
tag: Tech
originalTitle: "CyberLens - TryHackMe Writeup"
link: "https://medium.com/bugbountywriteup/cyberlens-tryhackme-writeup-d3320449ce41"
---


![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_0.png)

이 방은 Windows 해킹 및 웹 애플리케이션 취약점을 알려드립니다. 그럼, 바로 시작해봅시다 🥂.

방 링크: https://tryhackme.com/r/room/cyberlensp6

참고: 이 문서는 꽤 직관적이며 현실적으로 마주치게 될 많은 막다른 곳을 건너뛰고 있습니다. 시간이 오래 걸리거나 윤리적 해킹에 완전히 새로운 경우에만 사용하는 것이 좋습니다.


<div class="content-ad"></div>


![사진](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_1.png)

# 해결 방법

## 열거

nmap 스캔을 시작하기 전에 방 노트에 표시된 대로 호스트 파일에 cyberlens.thm 항목을 추가해야 합니다.


<div class="content-ad"></div>

약 5분 후, 다음과 같은 전체 포트 nmap 스캔을 실행해 주세요:

```js
nmap -sV -T5 -Pn -p- -oN ./nmap_scan <IP> -vv
```

이는 서비스 버전을 확인하는 비교적 빠른 TCP 스캔이며 결과를 나중에 확인할 수 있도록 저장하며 상세합니다.

포트 80의 웹 서버를 조사하려면 브라우저를 열고 해당 웹 사이트로 이동하세요. 다음과 같은 내용을 볼 수 있어야 합니다:

<div class="content-ad"></div>

사이트를 둘러보다 보면 '사이버렌즈 이미지 추출기'를 찾을 수 있어요. 이 기능을 테스트하면 이미지를 가져와 메타데이터를 보여줍니다. 페이지 소스를 보면 모든 마법이 일어나는 JavaScript를 볼 수 있어요.

사이트를 둘러보다 보면 '사이버렌즈 이미지 추출기'를 찾을 수 있어요. 이 기능을 테스트하면 이미지를 가져와 메타데이터를 보여줍니다. 페이지 소스를 보면 모든 마법이 일어나는 JavaScript를 볼 수 있어요.

추출기는 작업을 수행하기 위해 다른 포트와 통신하는 것으로 보입니다. 브라우저에서 조금 더 자세히 살펴보자고요.

<div class="content-ad"></div>

http://cyberlens.thm:61777에 Apache Tika 1.17이 실행 중인 것을 확인할 수 있어요.

![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_4.png)

Metasploit에서 Apache Tika를 검색하면 Apache Tika Header Command Injection이라는 모듈이 나올 거에요. 서버를 공격해 봅시다.

## 공격

<div class="content-ad"></div>

Metasploit을 열고 위의 Apache Tika 모듈을 검색해보세요. RHOSTS, RPORT, SRVHOST, 그리고 LHOST를 설정해야 합니다 (마지막 두 개에는 OpenVPN 또는 Attackbox IP를 사용하세요).

Exploit을 실행하면 셸을 얻을 수 있습니다. C:\Users\CyberLens\Desktop로 이동해보세요. 거기에 유저 플래그가 있을 거에요 🚩.

![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_5.png)

## 권한 상슨

<div class="content-ad"></div>

세션을 백그라운드로 전환하고 Multi Recon Local Exploit Suggester 모듈을 검색해보세요. 이 모듈은 관리자 권한을 얻기 위한 일부 로컬 익스플로잇을 제공할 것입니다. SESSION을 설정한 다음 실행하세요.

![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_6.png)

첫 번째 제안을 선택하여 always_install_elevated 모듈을 사용하세요. SESSION 및 LHOST 옵션을 구성하는 것을 잊지 마세요. 그러면 익스플로잇을 진행할 수 있을 겁니다.

![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_7.png)

<div class="content-ad"></div>

지금은 관리자 권한을 갖고 있습니다. 이를 확인하려면 쉘을 열고 whoami를 입력하세요.

![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_8.png)

관리자 권한 플래그를 얻으려면 C:\Users\Administrator\Desktop로 이동하세요 🚩. 마무리할 때 /etc/hosts 파일에서 CyberLens 항목을 제거하는 것을 잊지 마세요.

![이미지](/assets/img/2024-05-27-CyberLens-TryHackMeWriteup_9.png)

<div class="content-ad"></div>

실제로는 모든 것이 이렇게 쉽지 않을 수도 있습니다. 중요한 건 인내심이에요. 실제로 처음으로 시도했을 때의 개인 노트입니다 📝:

```js
Name: CyberLens
Description: CyberLens 웹 서버를 공격하고 숨겨진 플래그를 발견할 수 있을까요?

참고: 아마도 Windows 기기일 것으로 예상됩니다.

[+] 절차:
 - 서버에 기본, 전체 및 udp 스캔을 실행했습니다.
 - 포트 80에서 nikto 스캔 실행
 - 웹사이트 살펴보기
 - /about.html에 메타데이터를 추출하는 이미지 추출기가 있는 것 같습니다.
 - /contact.html에 양식이 있습니다.
 - 이미지 추출기가 정적인 것 같습니다. 브루스위트를 사용해 사이트 살펴보기 시도
 - 그 전에 apache 버전에 대한 취약점을 찾아보기
 - 취약점을 찾지 못했습니다
 - 브루스위트를 열어 살펴봄
 - 소스 코드를 살펴보니 도메인 이름 cyberlens.thm을 발견했습니다. /etc/hosts 파일에 추가를 잊지 않았어야 했는데
 - 이제 추출기가 작동 중입니다. 파일 업로드 취약점에 취약할 수 있음
 - 사이버렌즈 /aboutus 안의 사진을 사용해보려고 합니다. 무언가 흥미로운 것이 있을지 모르겠죠?
 - 이건 왜 이렇게 많은 정보가 있죠?
 - 페이지 소스를 살펴보면 61777 포트를 통해 파일이 서버로 전송되고 해당 파일에 대한 메타데이터를 반환한다는 것을 알 수 있습니다. 이것을 악용할 수 있을까요?
 - Nikto는 /css, /images 디렉토리를 발견했습니다
 - 이 두 디렉토리에는 흥미로운 것이 없었습니다
 - 숨겨진 디렉토리를 찾기 위해 gobuster 사용
 - 그 과정 동안 다른 포트를 확인해보고 있습니다
 - 기다리세요. 전체 스캔을 살펴보니 61777 포트에서 실행되는 서비스를 발견했습니다 - Jetty 8.y.z-SNAPSHOT
 - Port 139를 열거하는 데 metasploit 사용
 - 로컬 smb 열거를 통해 사용자를 찾으려 했지만 아무 것도 발견되지 않았습니다
 - 해당 61777 포트를 다시 살펴봄
 - 61777 포트는 PUT 메서드를 사용하기 때문에 웹 서버인 것으로 보입니다
 - Apache Tika 1.17 서버를 발견했습니다. 취약점을 찾아봄
 - 취약점을 찾았습니다. 실행을 시도해봅니다
 - '들어왔어요'
 - 플래그를 찾기
 - 관리자 액세스를 얻기 위해 열거하는 중이지만 여기서는 경험이 없습니다. 구글을 시도해보고 있습니다
 - multi/recon/local_exploit_suggester 모듈을 사용해보려고 합니다
 - 매우 유용했고 5가지 취약점을 제공했습니다
 - 첫 번째 것을 사용해보려고 합니다
 - 작동했습니다
 - C:/User/Administrator/Desktop에 플래그를 찾는 중입니다

[+] 가능한 벡터:
 - Apache 2.4.57 (Win 64) - 취약점을 발견하지 못했습니다
 - /about.html
 - /contact.html - 가능한 XSS
 - cyberlens 사이트 이미지의 메타데이터
 - Jetty 8.y.z-SNAPSHOT - 가능한 디렉터리 탐색
 - 135 포트로 RCE 가능성 - 자격 증명 필요
 - SMB 3.1.1 발견
 - Apache Tika 1.17
```

이 글이 마음에 드신다면 박수와 팔로우, 친구들과 공유하는 것을 잊지 마세요. 다른 글도 읽어보거나 Twitter/X에서 제 다른 글을 팔로우하셔서 사이버 보안 팁, 트릭 및 정보를 더 받아보세요.

그리고 항상 말씀드리는 대로, Happy Hacking 🙃.
