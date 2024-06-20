---
title: "Times Up, 타임랩스 HackTheBox에서 어드민으로 가는 길, 브루트포스터 해킹과 라프스 해킹으로 웃음을 전해보았어"
description: ""
coverImage: "/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_0.png"
date: 2024-06-20 14:41
ogImage: 
  url: /assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_0.png
tag: Tech
originalTitle: "Time’s Up, “Timelapse”: How I Brute-Forced, LAPS-ed, and Laughed My Way to Admin on HackTheBox"
link: "https://medium.com/@sanskarkalra121/times-up-timelapse-how-i-brute-forced-laps-ed-and-laughed-my-way-to-admin-on-hackthebox-fa13f4752fdc"
---


그 테이블 태그를 마크다운 형식으로 변경하십시오.

<div class="content-ad"></div>

가장 먼저, 저는 어떤 것을 다루고 있는지 확인하기 위해 nmap 스캔을 실행했습니다. Nmap, 믿을 수 있는 네트워크 매퍼,는 smb, ldap 및 Kerberos와 같은 여러 개의 오픈 포트를 보여주었는데, 이는 '블루 스크린 오브 데스'보다 더 '윈도우 머신'을 크게 외치고 있습니다.

![이미지](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_1.png)

SMB 공유 열거

SMB 포트가 열려 있어서, null 자격 증명을 사용하여 smbclient를 통해 smb 공유를 열거할 억제할 수 없는 욕구가 생겼습니다. 그리고 'Shares'라는 이름이 붙은 드문한 공유가 있었습니다.

<div class="content-ad"></div>

![image1](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_2.png)

Shares 디렉토리에 대해 궁금증을 느껴 'Shares' 디렉토리로 들어가 보았고, DEV 디렉토리 안에 winrm 백업을 찾아내었습니다. 파일을 다운로드했지만, 파일이 암호로 보호되어 있는 것을 깨닫자 흥분이 잠시 가셨어요.

![image2](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_3.png)

<div class="content-ad"></div>

집 비밀번호를 크랙하기

비밀번호가 없어? 문제 없어요. 저는 zip2john을 사용하여 zip을 크랙 가능한 형식으로 변환하고 그런 다음 록유(wordlist)를 사용하여 존 더 리퍼(john the ripper)를 실행했어요. 바로 그래요! 비밀번호가 크랙되었어요.

![이미지](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_4.png)

![이미지](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_5.png)

<div class="content-ad"></div>

PFX 파일 잠금 해제하기

Zip 파일 안에는 .pfx 파일이 있었는데, 이 파일도 비밀번호가 필요했습니다. 궁금해하는 분들을 위해 .pfx 파일은 암호화와 인증에 사용되는 인증서와 개인 키가 들어 있습니다. pfx2john을 사용하여 해시 값을 얻었고 다시 한 번 john과 rockyou를 사용하여 해독했습니다.

[이미지1](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_6.png)

[이미지2](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_7.png)

<div class="content-ad"></div>

인증서 및 키 생성

pfx 패스워드를 손에 쥐고 openssl을 사용하여 인증서와 키를 추출했습니다.

![이미지](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_8.png)

"Legacyy"로 로그인하기

<div class="content-ad"></div>

이 키와 인증서를 사용하여 이블 윈알엠으로 세션을 시작하여 "legacyy" 사용자로 액세스를 얻었습니다.


<img src="/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_9.png" />


콘솔 히스토리 분석

안으로 들어가서 PowerShell 콘솔 히스토리를 살펴보고 또 다시 행운을 가졌습니다. svc_deploy 사용자의 자격 증명을 발견했습니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 변환해 보겠습니다.


<img src="/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_10.png" />

<img src="/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_11.png" />

Logging in as svc_deploy

With new credentials, I logged in as the svc_deploy user. Now, it was time to gather some serious intel.


<div class="content-ad"></div>

![/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_12.png](<img src="/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_12.png" />)

샤프 하운드 배포하기

저는 머신에 SharpHound를 다운로드하고 데이터 수집을 위해 실행했습니다. SharpHound는 미첵된 사용자를 위한 BloodHound에 사용되는 도구로, Active Directory 데이터를 수집하는 도구입니다.

![/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_13.png](<img src="/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_13.png" />)

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_14.png)

BloodHound 분석

BloodHound를 실행하여 SharpHound 데이터를 업로드하고 svc_deploy 사용자를 소유로 표시했습니다. "Outbound Object Control"에 대한 빠른 검색에서 svc_deploy가 Timelapse 도메인의 dc01의 로컬 관리자 비밀번호를 읽을 수 있는 LAPS Readers 그룹의 구성원임을 확인했습니다.

![이미지2](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_15.png)


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_16.png)

다이어그램에서 svc_deploy 사용자가 LAPS_READERS 그룹의 구성원이며 DC01.TIMELAPSE.HTB의 암호를 읽을 수 있음을 보여줍니다.

LAPS 악용

Active Directory의 LAPS(Local Administrator Password Solution)는 도메인 가입된 컴퓨터의 로컬 관리자 암호를 관리하는 기능입니다. AdmPwd 모듈을 사용하여 LAPS Readers 그룹의 구성원이 실제로 dc01의 LAPS 암호를 읽을 수 있음을 확인했습니다.


<div class="content-ad"></div>


![image1](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_17.png)

![image2](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_18.png)

Using AdmPWD module to extract password of Administrator user:

![image3](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_19.png)


<div class="content-ad"></div>

관리자 액세스 획들하기

로컬 관리자 암호로 무장하고 마지막으로 evil-winrm을 사용했습니다. 이번에는 관리자 사용자로 로그인했습니다. 성공!

![이미지](/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_20.png)

루트 플래그 -`

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TimesUpTimelapseHowIBrute-ForcedLAPS-edandLaughedMyWaytoAdminonHackTheBox_21.png" />

결론:

nmap 스캔부터 LAPS 이용까지, "Timelapse" 정복 여정은 도전과 승리의 롤러코스터였습니다. 각 단계마다 무차별 대입, 교묘한 열거 및 전략적 이용이 필요했습니다. 경험 많은 해커든 호기심 많은 초보자든, 이 가이드가 가치 있는 통찰과 재미로운 순간을 제공해줄 것으로 기대합니다. 해킹 즐겁게 하세요!