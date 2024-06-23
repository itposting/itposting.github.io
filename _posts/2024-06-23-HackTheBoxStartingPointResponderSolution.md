---
title: "Hack The Box - Responder 초반 해결 방법"
description: ""
coverImage: "/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_0.png"
date: 2024-06-23 15:27
ogImage: 
  url: /assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_0.png
tag: Tech
originalTitle: "Hack The Box — Starting Point “Responder” Solution"
link: "https://medium.com/rakulee/hack-the-box-starting-point-responder-solution-d0fa2ea77a56"
---



![image](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_0.png)

Responder는 Hack The Box 플랫폼의 Starting Point 시리즈에서 Tier 1 중 4번째 머신입니다. 랩 중에는 Penetration Testing 능력을 향상시키기 위해 일부 중요하고 최신 도구들을 활용했습니다. 이 중에는 Responder, John the Ripper 및 evil-winrm이 있습니다.

하나의 머신을 더 pwed해 봅시다!

TASK 1 — IP 주소를 사용하여 웹 서비스를 방문할 때, 우리가 리디렉트되는 도메인은 무엇입니까?


<div class="content-ad"></div>

웹 브라우저를 통해 IP 주소에 액세스하려고 하면 unika.htb로 리디렉션되지만 연결이 성공하지 않을 것입니다.


![image1](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_1.png)


웹 페이지를 보려면 대상 IP를 /etc/hosts 파일에 추가해야 합니다. 그런 다음 터미널에서 텍스트 파일 편집기를 열고 페이지의 호스트 이름과 IP 주소를 입력하십시오.


![image2](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_2.png)


<div class="content-ad"></div>

아래는 Markdown 형식의 텍스트입니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_3.png)

웹 브라우저에서 페이지가 불러와집니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_4.png)

TASK 2 — 서버에서 웹페이지를 생성하는데 사용된 스크립팅 언어는 무엇인가요?

<div class="content-ad"></div>

Nmap 스캔을 실행하여 사용 가능한 포트 목록을 생성 중입니다. 결과에 따르면, 웹 서비스용 포트 80이 활성화되어 있으며 서비스에 대한 세부 정보가 제공되었습니다. 또한, 아파치가 PHP를 사용하여 웹 페이지를 생성하고 있다고 언급했습니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_5.png)

작업 3 - 웹페이지의 다른 언어 버전을로드하는 데 사용되는 URL 매개 변수 이름은 무엇입니까?

다른 언어로 전환하려면 페이지 매개 변수를 사용합니다. 언어가 변경되면 주소 표시줄의 URL이 변경되는 것을 확인할 수 있습니다. 아래 예시를 참고하세요.

<div class="content-ad"></div>

![2024-06-23-HackTheBoxStartingPointResponderSolution_6.png](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_6.png)

### TASK 4 — 다음 `page` 매개변수 값 중 로컬 파일 포함(LFI) 취약점을 악용할 수 있는 예시는 무엇인가요?: “french.html,” “//10.10.14.6/somefile”, “../../../../../../../../windows/system32/drivers/etc/hosts”, “minikatz.exe”

로컬 파일 포함 취약점을 악용하려면 ../../../../../../../../windows/system32/drivers/etc/hosts와 같은 매개변수를 사용해야 합니다. " ../ /"을 이용하면 "etc/hosts"에 액세스할 수 있습니다.

![2024-06-23-HackTheBoxStartingPointResponderSolution_7.png](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_7.png)

<div class="content-ad"></div>

**TASK 5** — `page` 매개변수에 다음 중 어떤 값이 원격 파일 포함(Remote File Include, RFI) 취약점을 악용한 예시인가요: “french.html,” “//10.10.14.6/somefile”, “../../../../../../../../windows/system32/drivers/etc/hosts”, “minikatz.exe”?

원격 파일 포함을 악용하기 위해서는 대상 기계의 IP 주소를 가져야 하며, 이 경우에는 //10.10.14.6/somefile이 있어야 합니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_8.png)

**TASK 6** — NTLM은 무엇의 약자인가요?

<div class="content-ad"></div>

NTLM은 Microsoft Windows를 위해 설계된 보안 프로토콜 그룹인 New Technology LAN Manager의 약자입니다. NTLM은 클라이언트 및 서버를 인증하기 위해 도전-응답 메커니즘을 사용합니다. 그러나 현재의 응용 프로그램에서는 암호화 부족 때문에 NTLM 사용을 권장하지 않습니다.

TASK 7 — Responder 유틸리티에서 네트워크 인터페이스를 지정하는 데 사용하는 플래그는 무엇인가요?

Responder는 네트워킹 인터페이스를 지정하기 위해 -I로 표시된 플래그를 사용하며 인터페이스 이름이 이어집니다.

![Resonder Flag](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_9.png)

<div class="content-ad"></div>

먼저, "ip a |grep + 네트워크 인터페이스" 명령어를 사용하여 IP를 확인하세요.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_10.png)

Responder가 제대로 작동하는지 확인하기 위해 Responder가 이벤트를 잡았는지 확인할 수 있습니다. 이를 위해 IP와 공유 폴더 이름을 사용하여 웹 브라우저에서 공유 파일을 열어보세요. 그러나 이 작업은 폴더가 사용 가능하고 권한이 필요하기 때문에 거부될 가능성이 높습니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_11.png)

<div class="content-ad"></div>

Responder가 작동 중인 터미널에서 NTLM 정보에는 클라이언트의 IP, 사용자 이름 및 암호 해시가 포함되어 있습니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_12.png)

태스크 8 - NetNTLMv2 챌린지/응답을 이용하여 수백만 개의 암호를 시도하여 같은 응답을 생성하는지 확인하는 여러 도구들이 있습니다. 이러한 도구 중 하나는 종종 `john`이라고 불리지만, 전체 이름은 무엇인가요?

암호 해독 도구 John의 전체 이름은 John the Ripper입니다. 이 랩에서 사용자 암호를 찾는 데 곧 사용될 것입니다.

<div class="content-ad"></div>

해시를 복사한 후 "echo" 명령어를 사용하여 파일로 전송하세요. 그런 다음 "ls" 명령어를 사용하여 디렉터리를 확인하여 파일이 저장되었는지 확인하세요.

![image](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_13.png)

다음으로 "RockYou" 워드리스트 파일을 압축 해제하는 단계를 따르세요.

![image](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_14.png)

<div class="content-ad"></div>

"john" 명령을 사용하여 워드리스트를 실행하고 해당 패스워드 해시 파일과 일치시켰어요.


![image](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_15.png)


할일 9 — 관리자 사용자의 비밀번호는 뭔가요?

1단계에서 착안한 단계별 지시 사항을 통해 관리자 사용자의 비밀번호는 "badminton"이에요.

<div class="content-ad"></div>

**TASK 10** — 윈도우 서비스(즉, 상자에서 실행 중인)를 사용하여 복구한 비밀번호를 사용하여 Responder 머신에 원격으로 액세스할 것입니다. 이 서비스가 청취하는 TCP 포트는 무엇인가요?

이 TCP 포트는 5985이며, Nmap으로 스캔하면 쉽게 정보를 얻을 수 있습니다.

![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_16.png)

**플래그 제출**

<div class="content-ad"></div>

악성-winrm을 활용하여 플래그 사냥을 진행해봅시다. 해당 패키지에는 대상 컴퓨터에 액세스하기 위한 Windows 원격 관리가 포함되어 있습니다. 마침내 IP 주소, 사용자 이름 및 비밀번호를 포함한 모든 필요한 정보를 모았습니다.


![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_17.png)


디렉터리 및 폴더 간 이동에는 "cd" 명령을 사용할 수 있으며, 폴더 내용은 "dir"을 사용하여 나열할 수 있습니다. 사용자 Mike에게 숨겨진 플래그가 있습니다.


![이미지](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_18.png)


<div class="content-ad"></div>

깃발을 확인하려면 "type" 명령어를 사용하세요.

![flag1](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_19.png)

![flag2](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_20.png)

제공된 이미지의 모든 작업에 대한 답안을 가지고 있어요. Pweding Responder 머신은 정말 재미있는 경험이었습니다!

<div class="content-ad"></div>


![HackTheBoxStartingPointResponderSolution_21.png](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_21.png)

![HackTheBoxStartingPointResponderSolution_22.png](/assets/img/2024-06-23-HackTheBoxStartingPointResponderSolution_22.png)
