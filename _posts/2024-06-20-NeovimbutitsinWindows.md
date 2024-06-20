---
title: "네오빔, 하지만 윈도우에서 실행하기"
description: ""
coverImage: "/assets/img/2024-06-20-NeovimbutitsinWindows_0.png"
date: 2024-06-20 14:53
ogImage: 
  url: /assets/img/2024-06-20-NeovimbutitsinWindows_0.png
tag: Tech
originalTitle: "Neovim, but it’s in Windows"
link: "https://medium.com/nerd-for-tech/neovim-but-its-in-windows-f39f181afaf9"
---


![Neovim in Windows](/assets/img/2024-06-20-NeovimbutitsinWindows_0.png)

얼마 전, 저는 아마도 다시는 Neovim에 관한 글을 쓰지 않을 것이라고 스스로에게 말했습니다... 그러나 여기 있군요.

![Neovim in Windows](/assets/img/2024-06-20-NeovimbutitsinWindows_1.png)

하지만 이전 포스트와 달리, 이번엔 10분 미만으로 읽을 수 있도록 이 포스트를 작성할 거에요. 그리고 이번에는 윈도우용 Neovim 설정에 대해 이야기할 걵니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-NeovimbutitsinWindows_2.png" />

# 놀랍도록 쉬웠어요

본래 Neovim을 내장된 Windows 환경에 설정하는 것이 Linux와 비교해 상당히 어렵고 일관성이 없을 것이라고 믿었었어요. 하지만 Ubuntu에서 구성된 Neovim 설정을 몇 분 만에 복제한 후, 전체 프로세스가 매우 간단하다는 사실을 발견해서 매우 기뻤어요.

그래서 이곳에서 시간을 많이 절약한 것은 이미 준비된 설정 파일 세트가 있기 때문이지만, 이것은 윈도우즈에서 Neovim을 처음부터 설정하는 것이 리눅스에서 하는 것과 거의 같은 프로세스라는 것을 보여주기도 합니다. 이에 대해서는 이 기사에서 언급했었어요:

<div class="content-ad"></div>

Vim 기반 편집기를 사용해 본 적이 없다면, 위에 링크된 기사를 포함하여 몇 가지 자료를 찾아보시는 것을 강력히 권장합니다. 결국 여기서 우리가 하는 것은 이미 존재하는 Neovim 구성을 복제하는 작업이니 말이죠. 하지만 대부분의 사람들이 fully-fledged 코드 편집기를 즐기기 때문에, 여러분이 사용하시는 것에 더 힘을 줍시다.

# Chocolatey 설치하기

![이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_3.png)

Linux와는 다르게 macOS와 유사하게, Windows에는 내장된 패키지 관리자가 없습니다 (winget에 대해 언급하지 마세요). Ubuntu 사용자는 apt를 기본으로 사용하고, Arch 사용자는 pacman을 선호하며, macOS 사용자는 대부분 brew를 선택하는 반면, Windows의 패키지 관리자인 choco (또는 Chocolatey)가 있습니다.

<div class="content-ad"></div>

네오빔을 설치하기 위해 Chocolatey를 사용하겠습니다. 

- 관리자 권한으로 실행한 명령 프롬프트 또는 PowerShell을 엽니다 (마우스 오른쪽 버튼 - "관리자 권한으로 실행")
- Get-ExecutionPolicy를 실행합니다. Restricted가 반환되면 Set-ExecutionPolicy AllSigned 또는 Set-ExecutionPolicy Bypass -Scope Process 중 하나를 실행합니다.
- 다음을 실행합니다:

```js
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

그리고 이제 Chocolatey가 설치되어 있어야 합니다! choco를 실행하면 다음과 같은 출력이 표시될 것입니다:

<div class="content-ad"></div>

![Neovim in Windows](/assets/img/2024-06-20-NeovimbutitsinWindows_4.png)

# Neovim 설치 및 PATH에 추가

이제 Chocolatey가 준비되었으니, choco install neovim을 사용하여 Neovim을 설치할 수 있습니다. Chocolatey가 Neovim을 설치하면, 바로 작동하지 않을 수 있습니다(nvim을 실행하면 인식되지 않는 명령어 오류가 표시될 수 있습니다). 이 경우, Neovim을 PATH 환경 변수에 추가해야 합니다.

이를 위해 Windows 키를 누르고 "시스템 환경 변수 편집" 옵션을 찾아야 합니다.

<div class="content-ad"></div>

아래 화면에 있을 때 "환경 변수..."를 선택하면 다른 창이 열립니다.

PATH 환경 변수를 선택한 다음 그 아래에 있는 "편집..." 버튼을 선택하세요.

<div class="content-ad"></div>

아래 Markdown 형식을 이용하여 표 태그를 변경해주세요.


![Neovim을 Windows에 설치하는 이미지 1](/assets/img/2024-06-20-NeovimbutitsinWindows_7.png)

여기서 "새로 만들기"를 선택하고 Neovim이 설치된 경로를 추가하세요. 저의 경우, C:\tools\neovim\nvim-win64\bin에 설치되었는데, 다른 경로도 조금씩 다를 수 있으니 확인해보세요.

말할 필요도 없이, 이미 열려 있는 터미널에서는 여전히 nvim을 사용할 수 없습니다. 새로운 터미널을 열기보다는 Chocolatey를 통해 환경 변수를 새로 고칠 수 있는 이 명령어를 실행하세요: RefreshEnv.cmd. 이제 nvim 명령어를 실행하면 Neovim이 열릴 것입니다!

![Neovim을 Windows에 설치하는 이미지 2](/assets/img/2024-06-20-NeovimbutitsinWindows_8.png)


<div class="content-ad"></div>

# 복제하기

이제 Neovim 설정을 복제할 때입니다. 적절한 경로는 Win + R (Windows 실행)를 눌러 %appdata%를 입력하고 ENTER 키를 눌러 탐색할 수 있습니다. Roaming에서 한 디렉토리 뒤로 이동한 후 Local로 이동하세요.

![이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_9.png)

Local에서 Neovim은 nvim이라는 이름의 폴더를 찾을 것이므로 지금 할 일은 현재 디렉토리에서 터미널을 열고 선택한 깃허브 저장소를 복제한 다음, 복제된 폴더의 이름을 이미 nvim으로 지정하지 않았다면 nvim으로 변경하는 것뿐입니다.

<div class="content-ad"></div>

만약 내 설정을 원한다면, 다음을 실행해보세요:

```js
git clone https://github.com/kevinfengcs88/neovim-config
```

그러면 neovim-config라는 폴더가 생성됩니다. 해당 폴더를 nvim으로 변경하고, 다음에 Neovim을 열 때 모든 것이 제대로 로드되어야 합니다.

![이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_10.png)

<div class="content-ad"></div>

하지만 작은 문제가 하나 있어요... 우리 멋진 아이콘들은 어디에 있나요? Nerd 폰트가 없으면 Neovim을 정리하고 깔끔하게 보이게 하는 멋진 글리프와 기호들을 렌더링할 수 없겠어요. 파일 트리 탐색기가 특히 싫어 보이네요...

![Neovim in Windows](/assets/img/2024-06-20-NeovimbutitsinWindows_11.png)

# Windows 터미널 설치하기

![Installing Windows Terminal](/assets/img/2024-06-20-NeovimbutitsinWindows_12.png)

<div class="content-ad"></div>

네드 폰트를 설치하기 전에는 네드 폰트와 호환되는 터미널이 필요합니다. 안타깝게도 명령 프롬프트와 파워쉘은 네드 폰트를 지원하지 않을 뿐만 아니라 조금 못생겼어요 (죄송해요).

Windows 터미널은 멀티탭 터미널 에뮬레이터로 파워쉘, 명령 프롬프트, 심지어 Azure 클라우드 쉘을 실행할 수 있습니다. 무엇보다도, 네드 폰트를 지원합니다. Microsoft Store에 액세스할 수 있다면, GUI를 사용하여 간단히 설치할 수 있습니다. 안타깝게도 제 데스크탑은 Microsoft Store에 문제가 있어서 약간의 조사를 해야 했어요.

Windows 터미널의 GitHub 릴리스로 이동하여 "Latest" 릴리스를 찾아보세요.

![Windows Terminal Latest Release](/assets/img/2024-06-20-NeovimbutitsinWindows_13.png)

<div class="content-ad"></div>

“에셋” 섹션으로 스크롤하여 .msixbundle로 끝나는 파일을 다운로드하세요. 파일을 다운로드했다면 Windows 터미널을 설치하는 몇 가지 다른 방법이 있습니다.

하나는 .msixbundle 파일을 실행하는 것인데, 이를 통해 GUI를 통해 Windows 터미널을 설치할 수 있어요:

![이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_14.png)

다른 방법은 PowerShell 명령어를 사용하는 것인데 (물론 “Downloads” 디렉토리에 있는 경우):

<div class="content-ad"></div>

```js
Add-AppxPackage [이름]
```

다운로드한 .msixbundle 파일의 전체 이름으로 [이름]을 대체하세요.

Windows 터미널을 설치한 후에는 Windows 시작 메뉴를 열 때 "최근 추가된" 섹션에서 찾을 수 있습니다. 쉽게 찾을 수 있도록 시작 메뉴에 고정하는 것을 추천합니다.

# Nerd 폰트 설치하기


<div class="content-ad"></div>

이제 Windows 터미널이 있으니 Nerd 폰트를 설치해보겠습니다. 이 작업은 여러 가지 방법으로 할 수 있는데, 하나는 nerdfonts.com을 방문하는 것이고, 다른 하나는 해당 GitHub 리포지토리를 이용하는 것입니다. 제가 이전 기사의 한 부분에서 후자를 다루었기 때문에, 이번에는 Nerd Fonts 웹사이트에서 설치하겠습니다.

[Nerd Fonts 웹사이트의 "다운로드" 페이지](https://www.nerdfonts.com)로 이동하면 다양한 폰트들이 나타납니다.

<div class="content-ad"></div>

선호하는 글꼴을 찾아 다운로드하고 다운로드한 글꼴의 ZIP 파일로 이동한 후 글꼴의 "regular" 변형을 찾아보세요:

![참조 이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_17.png)

해당 파일을 열어서 Windows에 글꼴을 설치하세요.

![참조 이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_18.png)

<div class="content-ad"></div>

폰트가 설치되었는지 확인하려면 Windows의 "폰트 설정"으로 이동하여 검색할 수 있어요.

![이미지](/assets/img/2024-06-20-NeovimbutitsinWindows_19.png)

# 마무리하며

마지막으로, Nerd Fonts를 지원하는 터미널과 Nerd 폰트가 설치된 상태에서 몇 가지 더 실행 단계만 거치면 Neovim을 그 모든 영광으로 볼 수 있어요.

<div class="content-ad"></div>

Windows Terminal을 열고 창 헤더 어디든 마우스 오른쪽 버튼을 클릭하세요:

![image](/assets/img/2024-06-20-NeovimbutitsinWindows_20.png)

“Settings”를 클릭한 후 사이드바에서 “Defaults” 탭으로 전환하세요:

![image](/assets/img/2024-06-20-NeovimbutitsinWindows_21.png)

<div class="content-ad"></div>

"외형"으로 스크롤을 내려주세요:


<img src="/assets/img/2024-06-20-NeovimbutitsinWindows_22.png" />


마지막으로 "글꼴" 옵션을 변경해주세요:


<img src="/assets/img/2024-06-20-NeovimbutitsinWindows_23.png" />


<div class="content-ad"></div>

그리고 마침내 끝났어요!

![Neovim in Windows](/assets/img/2024-06-20-NeovimbutitsinWindows_24.png)

# 결론

Windows용 Neovim 설정은 Linux 환경에서 Neovim을 경험한 사람으로서 매우 원활한 경험입니다. 대부분의 것들이 동일합니다. 단지 설정 파일을 저장하는 경로가 약간 다를 뿐입니다.

<div class="content-ad"></div>

Windows에서 Neovim은 Linux 환경과 비교하여 시작 시 약 3배 정도 느립니다. 그리고 "차가운" 시작(수 시간 동안 Neovim을 열지 않아 리소스가 할당되지 않은 상태)에서는 10배 이상 느립니다.

저의 Linux에서의 차가운 시작은 대략 200 또는 250밀리초이며, 일반적인 시작은 100밀리초 또는 그 이하입니다. 그러나 Windows에서는 일반적인 시작이 대략 280밀리초이며, 차가운 시작은 상당히 느리게 2000밀리초 이상(네, 2초 이상)이 소요됩니다. 이 부분은 확실히 확인하고 최적화할 필요가 있습니다. 왜냐하면 이제 Windows에서 작업을 할 때 Neovim을 사용할 것이기 때문입니다.

읽어 주셔서 감사합니다! 다음에 또 뵙겠습니다, 친구들 :)

Kevin Feng || 웹사이트 || GitHub || LinkedIn || Medium (이미 여기 있으시네요!)

<div class="content-ad"></div>

# 소스

- [Windows Report](https://windowsreport.com/windows-terminal-windows-10/)
- [Chocolatey](https://chocolatey.org/install#individual)