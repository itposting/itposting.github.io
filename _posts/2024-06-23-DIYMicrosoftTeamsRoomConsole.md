---
title: "2024년 DIY Microsoft Teams Room Console 구축 방법"
description: ""
coverImage: "/assets/img/2024-06-23-DIYMicrosoftTeamsRoomConsole_0.png"
date: 2024-06-23 17:58
ogImage: 
  url: /assets/img/2024-06-23-DIYMicrosoftTeamsRoomConsole_0.png
tag: Tech
originalTitle: "DIY Microsoft Teams Room Console"
link: "https://medium.com/@thorstenjanssen/diy-microsoft-teams-room-console-e53ee259526e"
---


옛날 얘기지만... 약 2년 전, 저는 Crestron Teams Room 장치를 만져봤어요. 그리고 그것이 '그냥' 일부 주변 기기가 붙은 Intel NUC라는 사실에 놀랐죠. 그래서 우리가 실제로 인텔 NUC를 손에 쥐고 난 후(사실 유행병 기간중에 우리의 모든 NUC를 노트북으로 교체했죠), '나는 그 Microsoft Teams Room 콘솔을 처음부터 다시 만들 수 있을까?' 라는 생각이 들었어요.

스포일러 주의: 예, 만들었습니다. 그래서 이 블로그 포스트를 작성하게 되었습니다.

## 필요한 것:

- Teams Room 콘솔을 설치하기 위한 최소 8GB USB 스틱
- 나중에 필요한 구성 XML을 저장할 다른 크기의 USB 스틱
- Microsoft의 이 문서 요건

<div class="content-ad"></div>

## 일부 하드웨어:

- 최대 3개의 디스플레이를 제공하고 실시간 비디오를 인코딩 및 디코딩할 수 있는 충분한 컴퓨팅 파워와 메모리를 갖춘 Intel NUC. 저는 8GB RAM을 가진 NUC7i5BNK를 사용 중이며 이 일에 완전히 적합하다고 생각합니다.
- 터치 디스플레이, Viewsonic TD1655를 사용 중입니다.
- 충분한 USB-A / USB-C 포트와 두 개의 4k 디스플레이를 연결할 수 있는 기능을 갖춘 USB 도킹 스테이션, Raidsonic ICY BOX IB-DK2245AC를 사용 중입니다.
- USB 스피커폰, Teams 인증된 Jabra Speak 시리즈를 추천드립니다. 예를 들어 Jabra Speak 750 MS-Teams를 사용할 수 있습니다.
- USB HD 웹캠, 저는 간단한 Logitech C920 HD Pro를 사용했습니다.
- 노트북에서 비디오 공유를 가능하게 하는 USB HDMI 그랩버, 저는 아마존에서 Pengu 1080p USB HDMI 그랩버를 구입했습니다.

## 그리고 Microsoft 365 테넌트를 위한 일부 라이선스:

- Windows 10 엔터프라이즈
- Teams Room Standard

<div class="content-ad"></div>

## 이제 모든 것을 준비했네요: 행운을 빕니다!

무슨 뜻이죠? '어떻게 해서 그걸 해냈니?'라고요. 알았어 알았어... 설명할게요.

- 컴퓨터에 모든 작업을 할 폴더를 만들어주세요. 저는 이 d:\teams-room\ 폴더를 만들어서 사용했어요.
- Windows 10 Enterprise 1909 원본 릴리스 ISO를 다운로드해주세요 (2020년 3월에 모든 업데이트가 포함된 것이 아니라, 2019년 10월에 발매된 것을 다운로드해야 해요). 전체 공개: 이 단계에서 1909의 로컬화된 버전을 시도해보지 않았어요. 항상 영어 버전을 선택했죠. 만약 이걸 시도해보게 된다면, 이 게시물을 업데이트할 거예요. 시도해보시면, 댓글을 남겨 다른 이들에게 알려주세요.
- ISO 파일을 작업 디렉토리에 폴더를 만들어 압축 풀어주세요. 저는 d:\teams-room\win10-Enterprise-1909-iso\라고 창의적으로 이름 짓고 사용했어요.
- CreateSrsMedia.ps1 스크립트를 다운로드하여 d:\teams-room\ 등의 해당 폴더로 이동시켜주세요.
- 관리자 권한으로 PowerShell을 열고 d:\teams-room\ 폴더로 이동해주세요.
- 스크립트를 실행해주세요:
a. 첫 번째 질문에 답해주실 때... OEM 사용자면, 어째서 이 블로그를 읽고 계신 거죠? 'Enterprise'라는 대답을 선택해주세요. 그것이 당신의 특성입니다. 그런데 말이지: 이는 설치 프로세스에 필요한 Windows 10 버전에 영향을 줍니다. OEM 사용자들은 계속 진행하기 위해 Windows 10 IoT Enterprise ISO를 사용해야 하지만, 평범한 기업 사용자는 액세스할 수 없어요.
b. 스크립트가 어떤 드라이버를 설치할지 물으면, 'none'을 선택해주세요.
c. 스크립트가 완료되기까지 기다려주세요 (약 20분 정도 소요될 거예요).
- 스크립트가 설치 미디어를 생성하는 동안, Microsoft 365 관리 센터로 가셔서 'Resources - Rooms & Equipment(자원 - 방 및 장비)'에서 '룸'을 만든 뒤, 'Teams Room Standard' 라이선스를 해당 룸에 할당해주세요.
여기 작은 조언 하나: 룸의 주소를 표준 @[회사명].onmicrosoft.com 주소 이외의 다른 도메인 주소로 변경했다면, Teams 룸 콘솔을 인증할 때 이후에 작업을 해야 할 수 있어요. 대부분의 경우 로그인은 onmicrosoft로 할 거에요. 의문이 생기면, Azure AD에서 사용자 주체 이름을 확인해주세요.
- 설정 루틴은 몇몇 장치에서 조금 까다로울 수 있어요 (설치 프로세스의 끝에 Teams Room 콘솔을 도킹 스테이션에 놓으라고 권고하는데, 그때 실패할 수도 있어요). 우리는 여기서 설명된 것처럼 Teams Room Console 구성을 위한 구성 XML을 준비하고 있어요.
제가 작업한 것은 아래와 같아요:

```js
<SkypeSettings>
...생략...
</SkypeSettings>
```

<div class="content-ad"></div>

- 설치 절차를 시작하기 전에 NUC를 네트워크에서 분리하세요. 왜 그런지는 모르겠는데, 설치는 처음 몇 단계에서 네트워크가 없는 것이 신뢰할만 하다고 합니다. Microsoft도 장치를 분리하라고 권장하네요. 그냥 따르고 연결을 끊어보세요.
- USB 스틱을 사용하여 기계에 설치하세요. 정말 할 일은 없어요. 그냥 구경하고 마음을 편히 하세요. 아직 7번에서 계정을 만들지 않았다면, 지금 만들어 보세요. 지금 할 일이 없을 테니까요.
- Windows가 설치되면 USB 스틱을 뽑고, Windows가 준비되는 동안 우리 행성에서 지각 변동을 관찰하세요. 어느 순간 기계가 자동으로 꺼집니다.
- 네트워크에 연결하고 다시 켜면, 모든 것을 준비하고 이번에는 스스로 다시 시작할 거에요.
- 갑자기 야생의 Out-Of-Box-Experience가 나타나 지역 및 키보드 설정을 요청합니다. 완료되면 Teams 룸 어플리케이션이 첫 번째로 시작됩니다. 천천히. 아주 천천히. 그런 다음 기계가 다시 재부팅되면서 여러분의 희망을 모두 무너뜁니다.
- Teams 룸 설정 화면이 나타날 텐데 무시하고 준비된 XML 파일을 예상 위치인 C:\Users\Skype\AppData\Local\Packages\Microsoft.SkypeRoomSystem_8wekyb3d8bbwe\LocalState에 넣어주세요.
  a. "종료"를 누르면 Windows 로그인 화면이 표시됩니다.
  b. 관리자 계정을 선택하고 "sfb"라는 비밀번호를 입력하세요 (Skype For Business의 약자)
  c. Explorer에서 해당 경로를 열면 C:\Users\Skype\에 대한 액세스 권한을 부여하라는 메시지가 표시됩니다. 당연히 동의해야겠죠.
  d. 준비된 파일을 복사해서 기계를 다시 시작하세요.
- 다시 시작되면 필요한 매개변수를 수정하고 완성했어요: 기본 Teams 룸 콘솔이 준비되었습니다.

그리고: 기본 관리자 비밀번호를 변경하는 것을 잊지 마세요.

"어떤 말씀? 과정을 보여주는 비디오가 도움이 될까요?"라고요? 그럼 제가 준비해둔 영상이 도움이 될 거에요. 한 번 확인해보세요:

기본 콘솔이 준비되면 나머지 장비와 함께 설정을 시작할 수 있습니다. 작은 허들 룸과 중간 규모의 회의실의 배선을 설명한 간단한 다이어그램을 함께 제공했습니다.

<div class="content-ad"></div>


![DIY Microsoft Teams Room Console 0](/assets/img/2024-06-23-DIYMicrosoftTeamsRoomConsole_0.png)

가격은 다를 수 있고, 소형 컴퓨터와 여분의 TV를 이미 보유하고 있는지에 따라 다르지만, 간단한 허들 룸을 위한 추가 하드웨어 비용은 1000달러 미만이어야 합니다.

![DIY Microsoft Teams Room Console 1](/assets/img/2024-06-23-DIYMicrosoftTeamsRoomConsole_1.png)

더 큰 회의실용으로는 추가로 유선 마이크로폰이 있는 AVer 비디오-사운드바를 선택했습니다. 하지만 Logitech Rally나 Poly Studio와 같은 제품들도 잘 작동합니다. 원하는 대로 Jabra 750을 Jabra Speak 810 MS 솔루션으로 업그레이드할 수도 있습니다. 당신의 방, 당신의 선택입니다!


<div class="content-ad"></div>

그리고 큰 USB-C 독 덕분에 이중 디스플레이 솔루션으로 갈아탈 수도 있어요. 이렇게 하면 모든 참가자를 한 화면에 넣고 다른 화면에 프레젠테이션을 볼 수 있어요.

이 DIY 매뉴얼이 도움이 되었기를 바라며, 피드백을 기다리고 있겠어요!