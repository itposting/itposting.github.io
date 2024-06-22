---
title: "PowerShell을 사용한 Windows 바로가기 만들기, 커스터마이징 및 위치 지정 방법"
description: ""
coverImage: "/assets/img/2024-06-22-WindowsShortcutsWithPowerShellHowToMakeCustomizeAndPointThemToPlaces_0.png"
date: 2024-06-22 16:35
ogImage: 
  url: /assets/img/2024-06-22-WindowsShortcutsWithPowerShellHowToMakeCustomizeAndPointThemToPlaces_0.png
tag: Tech
originalTitle: "Windows Shortcuts With PowerShell — How To Make, Customize And Point Them To Places"
link: "https://medium.com/@dbilanoski/how-to-tuesdays-shortcuts-with-powershell-how-to-make-customize-and-point-them-to-places-1ee528af2763"
---


이제와서 당신이 손에 가장 흔한 작업인 것처럼 확신을 갖고 "응, 30분 만에 끝낼 거야!" 라고 생각할 때 상황이 발생할 것입니다. 그리고 2시간 후에 일부 희미한 문서를 찾아보며, 코드 예제를 보면서 "이게 정말 이런 건가?" 라고 생생히 느낄 수도 있죠.

얼마 전, Windows 11의 제어판 소리 설정의 "녹음" 패널에 데스크톱 바로 가기를 생성하고 배포해야 하는 상황이 발생했습니다. PowerShell에는 바로 가기를 생성하는 "기본" 방법이 없다는 것을 이미 알고 있어서 몇 가지 쉘 방법을 탐색할 예정이었습니다. 그런데 만약에 해당 바로 가기를 제어판 항목의 하위 메뉴로 가리키고 싶거나, 이미 컴퓨터에 존재하지만 동적 라이브러리 안에 저장된 사용자 정의 아이콘을 사용하고 싶다면 어떨까요?

좋아요, 친애하는 독자 여러분, 해결 방법은 있습니다. 때로는 운영 체제의 내부를 살펴 경로를 찾아야 할 때도 있습니다. Windows 바로 가기를 생성하고 사용자 정의하는 방법에 대해 자세히 알아봅시다.

<div class="content-ad"></div>

# 단축키, 심볼릭 링크 및 PowerShell

우선 중요한 것은 PowerShell에 내장된 New-Item cmdlet을 사용하여 심볼릭 링크를 만들 수 있는 방법이 있다는 것입니다.

```js
New-Item -ItemType SymbolicLink -Path "C:\example-link.lnk" -Target "C:\Users\dbilanoski\Documents\some-text.txt"
```

다른 곳에서 이와 같은 단축키를 생성하는 방법을 제안하는 지침을 만날 수 있습니다. 그러나 주의해야 할 점은 이러한 것들이 정확히 동일한 것이 아니라는 것입니다.

<div class="content-ad"></div>

Symbolic links(심볼릭 링크)는 파일 시스템 자체에서 해석된 다른 파일로의 직접적인 링크입니다. 일반 파일과 다르며 크기가 없으며 응용 프로그램이 이를 내재적으로 인식합니다. 사용할 때 실제로 링크된 대상을 직접 사용하는 것처럼 사용됩니다.

한편 바로 가기(Shortcuts)는 Windows 사용자 인터페이스에서 해석된 참조된 객체의 경로를 포함하는 일반 파일입니다. 크기가 있으며 아이콘으로 구성될 수 있으며 사용할 때 이를 읽고 있는 무언가와 대상 경로를 갖고 있어야 합니다(Windows 사용자 인터페이스).

Windows에서 바로 가기가 필요할 때는 바로 가기를 원할 것입니다. 왜냐하면?

- 바로 가기는 참조하는 파일을 추적하여 변경 사항이 발생할 때 업데이트되어 깨질 가능성이 줄어듭니다.
- 파일과 폴더 외에도 네트워크 위치, 구성 패널, 파일 시스템에 있는 파일 경로로 존재하지 않는 특수 폴더를 엽니다.
- 특정 폴더의 컨텍스트에서 시작되도록 구성된 바로 가기를 사용할 수 있습니다.
- 심볼릭 링크를 사용하면 대상 경로에 실행 파일에 대한 명령줄 인수를 포함할 수 없습니다.
- 아이콘을 심볼릭 링크에 구성할 수 없습니다.

<div class="content-ad"></div>

단축키를 친숙하고 편리하게 만드는 이유는 Windows 사용자 인터페이스(셸)에서 처리하기 때문입니다. Windows 사용자 인터페이스는 추가 기능과 편의성을 제공합니다. 그러나 PowerShell에서 이를 만들기 위해서는 셸 메소드에 접근해야 하며, 이로 인해 프로세스가 조금 더 복잡해지게 됩니다.

# 서둘러야 할 때를 위해

PowerShell을 사용하여 단축키를 만들고 고유 아이콘을 사용자 정의하려면 아래의 기본 예시를 참고하세요. 특정 상황에 맞게 경로와 파일 이름을 수정해야 합니다.

```js
$ShortcutTarget= "타겟-경로\타겟-이름"
$ShortcutFile = "단축키-경로\단축키-이름.lnk"
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$Shortcut.TargetPath = $ShortcutTarget
$Shortcut.IconLocation = "아이콘-경로\아이콘-이름.ico"
$Shortcut.Save()
```

<div class="content-ad"></div>

한 줄로 된 스크립트가 필요하시면:

```js
# PowerShell 스크립트용
$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('실행할-바로가기-파일-경로\바로가기-파일명.lnk'); $s.TargetPath = '대상-파일-경로\대상-파일명'; $s.IconLocation = '아이콘-파일-경로\아이콘-파일명.ico'; $s.Save()

# 배치 (CMD) 스크립트용
powershell -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('실행할-바로가기-파일-경로\바로가기-파일명.lnk'); $s.TargetPath = '대상-파일-경로\대상-파일명'; $s.IconLocation = '아이콘-파일-경로\아이콘-파일명.ico'; $s.Save()"
```

## 구체적인 예시

서로 다른 바로가기 대상 유형에 대한 적합한 TargetPath 및 필요시 Arguments 구성.

<div class="content-ad"></div>

```js
# 파일 지정하기
$Shortcut.TargetPath = "C:\Windows\System32\notepad.exe"

# 폴더 지정하기
$Shortcut.TargetPath = "C:\Users\Public\Documents"

# 네트워크 공유 지정하기
$Shortcut.TargetPath = "C:\Windows\explorer.exe"
$Shortcut.Arguments = "\\192.168.10.2\shares"

# 환경 변수를 사용하여 지정하기
$Shortcut.TargetPath = $env:userprofile + "\Downloads"

# .cpl 파일을 지정하기
$Shortcut.TargetPath = "C:\Windows\System32\mmsys.cpl"

# MS:SETTINGS URI 스킴을 사용하여 지정하기
$Shortcut.TargetPath = "ms-settings:installed-apps"

# 이름으로 shell 명령어를 사용하여 지정하기
$Shortcut.TargetPath = "C:\Windows\explorer.exe"
$Shortcut.Arguments = "shell:NetworkPlacesFolder"

# CLSID GUID로 shell 명령어를 사용하여 지정하기
$Shortcut.TargetPath = "C:\Windows\explorer.exe"
$Shortcut.Arguments = "shell:::{BB06C0E4-D293-4f75-8A90-CB05B6477EEE}"

# rundll32를 사용하여 dll 탐색으로 지정하기
$Shortcut.TargetPath = "C:\Windows\System32\rundll32.exe"
$Shortcut.Arguments = "shell32.dll,Control_RunDLL inetcpl.cpl,,4"
```

# 세부 정보

## Powershell로 바로 가기 생성

PowerShell을 사용하여 바로 가기를 생성하려면, WScript.Shell 클래스의 인스턴스를 포함할 컨테이너로 작동할 COM 객체를 생성해야 합니다. 이는 아마도 초기에 Visual Basic 스크립트를 위해 고안된 꽤 오래된 COM 인터페이스의 일부인 WScript.Shell 클래스의 인스턴스를 담을 객체를 만들 것입니다. 즉, 코드로 바로 가기를 처리하기 위해 필요한 모든 좋은 기능이 구비된 객체를 만들 것입니다. 이는 변수와 속성을 다루는 작업을 포함하므로, 이를 단계적으로 나누어 설명하겠습니다.


<div class="content-ad"></div>

컴퓨터의 각 사용자에 대해 notepad.exe(Windows에서 널리 사용되는 텍스트 편집 도구)에 대한 데스크탑 바로 가기를 만들고자 합니다.

1. 먼저 대상 객체와 해당 바로 가기의 경로를 저장할 변수를 만듭니다.

```js
# 내 바로 가기가 가리키는 위치
$ShortcutTarget = "C:\Windows\System32\notepad.exe"
# 내 바로 가기가 저장될 곳 및 이름 설정
$ShortcutFile = "C:\Users\Public\Desktop\notepad.lnk"
```

2. New-Object cmdlet을 사용하여 COM 개체로 WScript.Shell 클래스의 인스턴스를 생성합니다.

<div class="content-ad"></div>


```js
$WScriptShell = New-Object -ComObject WScript.Shell
```

3. WScript.Shell 인스턴스에서 CreateShortcut() 메서드를 사용하여 바로 가기를 만듭니다.

```js
$shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
```

자, 이제 잠시 멈추고 바로 가기 객체의 속성과 메서드를 살펴보면서 우리가 할 수 있는 작업을 살펴보겠습니다.


<div class="content-ad"></div>


![Shortcut Image](/assets/img/2024-06-22-WindowsShortcutsWithPowerShellHowToMakeCustomizeAndPointThemToPlaces_1.png)

우리는 단축키를 생성하기 위해 TargetPath 속성에 Notepad.exe를 지정하고 Save() 메서드를 사용해야 합니다.

우리의 단축키에 아이콘을 할당하려면 IconLocation 속성이 관련됩니다. TargetPath에 참조된 실행 파일에 명령줄 인수를 전달하려면 Arguments 속성이 관련됩니다.

WorkingDirectory는 상대 경로 사용시 때로 필요하지만, 단축키를 다룰 때 상대 경로는 피하는 것이 좋습니다.


<div class="content-ad"></div>

4. 기본 사항으로 계속해서, 앞서 설정한 변수를 사용하여 Target.Path 속성을 위치와 대상의 이름에 할당하십시오.

```js
$Shortcut.TargetPath = $ShortcutTarget
```

5. ShortcutFile 변수에 지정된 경로에 바로 가기를 저장하기 위해 Save() 메서드를 호출하여 프로세스를 완료하세요.

```js
$Shortcut.Save()
```

<div class="content-ad"></div>

당신의 바로 가기는 $ShortcutFile 변수에 정의된 위치에 준비될 것입니다.

## 장소들을 가리키는 바로 가기

파워쉘을 사용하여 프로그래밍적으로 바로 가기를 만드는 방법을 알게 되었으니, 파일 이외의 것을 가리킬 때는 어떻게 보이는지 살펴보겠습니다. 불행하게도 항상 명확하지는 않습니다.

한두 개의 속성만 변경할 때는 주석이 있는 코드 블록에서 실제 예제를 사용할 것입니다. — TargetPath와 Arguments가 필요할 때 변경합니다.

<div class="content-ad"></div>

폴더로의 바로 가기

```js
$Shortcut.TargetPath = "C:\Users\Public\Documents"
```

네트워크 공유로의 바로 가기

여기서는 Arguments 속성을 사용하여 TargetPath 속성에서 구성된 explorer.exe로 UNC 형식의 경로를 전달하고 있습니다.

<div class="content-ad"></div>

주로 단축키 생성 프로시저에서 문제를 피하기 위한 것이며, 그렇지 않으면 명령이 실행된 문맥 내에서 경로에 액세스할 수 없는 경우 프로세스가 실패할 수 있습니다.

```js
$Shortcut.TargetPath = "C:\Windows\explorer.exe"
$Shortcut.Arguments = "\\192.168.10.2\shares"
```

환경 변수와 함께 사용되는 단축키 대상 경로

```js
# 표준 연결 방식인 + 기호를 사용하여
$Shortcut.TargetPath = $env:userprofile + "\Downloads"

# Join-Path cmdlet을 사용하여
$Shortcut.TargetPath = Join-Path -Path $env:userprofile -ChildPath "Downloads"
```

<div class="content-ad"></div>

컨트롤 패널 파일로의 바로 가기

이 파일들은 C:\Windows\System32 폴더에 있으며, 컨트롤 패널 항목에 접근하기가 편리합니다. 그러나 대부분 다른 방법으로 그 곳에 도달하려고 할 것입니다.

```js
$Shortcut.TargetPath = "C:\Windows\System32\mmsys.cpl"
```

Windows 설정 앱을 통한 패널로의 바로 가기

<div class="content-ad"></div>

Windows 설정 응용 프로그램의 특정 페이지를 지정하는 방법을 제공합니다. ms-settings:`페이지 이름` 형식을 따라 이동할 수 있습니다.

```js
$Shortcut.TargetPath = "ms-settings:installed-apps"
```

셸 명령을 통한 위치 바로 가기

Windows의 많은 위치는 파일과 유사한 절대 경로 접근이 없어서, 특정 패널이나 폴더에 프로그래밍적으로 어떻게 도달할지가 명확하지 않을 수 있습니다. 이러한 위치를 셸 폴더 또는 가상 폴더라고 하며 알려진 이름을 사용하거나 CLSID 고유 식별자 키 (GUID)를 사용하여 접근할 수 있습니다. CLSID는 레지스트리에서 직접 항목을 열 수 있도록 사용할 수 있는 특별한 키입니다.

<div class="content-ad"></div>

그들에 대해 더 자세히 알고 싶거나 사용 가능한 Windows 11 바로 가기의 완전한 목록을 보고 싶다면, 여기에서 더 깊게 다루었어요.

```js
# 이름으로 셸 명령어를 사용하여
$Shortcut.TargetPath = "C:\Windows\explorer.exe"
$Shortcut.Arguments = "shell:NetworkPlacesFolder"

# CLSID GUID로 셸 명령어를 사용하여
$Shortcut.TargetPath = "C:\Windows\explorer.exe"
$Shortcut.Arguments = "shell:::{BB06C0E4-D293-4f75-8A90-CB05B6477EEE}"
```

## 아이콘으로 바로 가기 맞춤 설정

만약 당신의 바로 가기가 이미 아이콘이 있는 항목을 가리키고 있다면, 해당 아이콘의 경로는 IconLocation 속성에 저장됩니다.

<div class="content-ad"></div>

PowerShell을 사용하여 단축키에 사용자 정의 아이콘을 할당하려면, 단축키를 만들 때 추가 단계로 IconLocation 속성을 구성하여 기존 아이콘에 도달 가능한 경로를 설정한 후 단축키를 저장하면 됩니다.

```js
$Shortcut.IconLocation = "\\path-to-your-icon.ico"
```

이제 사용자 정의 아이콘으로 구성된 단축키를 가지고 있으므로, 스크립트가 다른 곳에 배포되어야 할 경우 아이콘의 가용성을 확인해야 할 것입니다. 항상 컴퓨터에 이미 있는 요소를 활용하는 것이 좋은 접근 방식일 것입니다.

Windows OS에는 일반 UI 아이콘이 저장되고 사용되는 곳이 있습니다. 일반적으로 이러한 아이콘은 여러 프로그램에서 동시에 공유되는 데이터를 포함하는 동적 링크 라이브러리(DLL)에 패킹되어 있습니다.

<div class="content-ad"></div>

시스템 주변에는 많은 것들이 있지만, OS에서 가장 일반적으로 사용되는 DLL에는 다음과 같은 아이콘이 포함되어 있습니다:

- C:\Windows\system32\imageres.dll
- C:\Windows\system32\shell32.dll
- C:\Windows\system32\ddores.dll

이러한 아이콘들은 표준 파일이 아니며, 적절한 인덱스 번호를 사용하여 DLL 파일 내에서 참조해야 합니다. 이러한 아이콘들은 쉽게 볼 수 없다는 것이 함정입니다. 따라서 텍스트의 시작 부분에 있는 2시간의 줄서기가 필요합니다.

서드 파티 소프트웨어를 사용하지 않고 시간을 낭비하지 않고 DLL의 중첩된 아이콘 인덱스 번호를 확인하려면, 기존 바로 가기의 "속성" 패널을 사용하여 DLL 파일을 검색하십시오. 그곳에서 원하는 아이콘을 선택하고 변경 내용을 저장한 다음 해당 인덱스 번호를 코드에서 사용할 수 있도록 PowerShell의 WScriptShell의 COM 인스턴스에 바로 가기를 추가하십시오. IconLocation 속성을 검사하여 코드에서 사용할 수 있는 인덱스 번호를 식별할 수 있습니다.

<div class="content-ad"></div>

DLL 아이콘 참조하기

에제로 살펴보겠습니다. 제 노트패드 바로 가기를 특정 라이브러리 중 하나로부터 가져온 독특한 아이콘과 함께 배포하고 싶다고 가정해 보겠습니다. 예를 들어, imageres.dll 라이브러리의 키보드 아이콘을 사용하고 싶다면 어떨까요?

제 데스크탑에 있는 크롬 바로 가기의 현재 IconLocation을 살펴보면 chrome.exe(녹색 선) 패키지 내부의 아이콘(녹색 선)이 사용되고 있으며, 해당 아이콘의 인덱스 번호는 0(분홍색 선)입니다. 이 인덱스는 경로의 일부로 표시되며, 파일 경로와 인덱스 번호는 쉼표로 구분됩니다.

![이미지](/assets/img/2024-06-22-WindowsShortcutsWithPowerShellHowToMakeCustomizeAndPointThemToPlaces_2.png)

<div class="content-ad"></div>

또한 chrome.exe 패키지 내부에는 사용할 수 있는 다른 아이콘들이 있다는 것을 알 수 있습니다.

우리는 동일한 Chrome 바로 가기를 사용하여 imageres.dll 라이브러리를 살펴보고 원하는 바로 가기를 선택하고 해당 인덱스 번호를 확인할 수 있습니다.

1. 속성 페이지에 액세스하여 "아이콘 변경" 버튼을 클릭하고 "C:\Windows\system32\imageres.dll"로 이동한 후 "Enter"를 눌러 사용 가능한 아이콘을 확인할 수 있습니다.

여기에서 사용하고자 하는 키보드 아이콘을 선택했습니다.

<div class="content-ad"></div>

Markdown 형식으로 테이블 태그를 변경해주세요.

<div class="content-ad"></div>

```js
$Shortcut.IconLocation = "C:\Windows\system32\imageres.dll,173"
```

## 원라이너

간단하게 사용하기 위해 이를 한 줄로 표현하려면, "첫 번째 명령; 두 번째 명령; 세 번째 명령"과 같이 세미콜론을 사용하여 명령을 연결할 수 있습니다. 여기서는 경로 변수를 사용하지 않고 직접 속성과 메소드에 넣어줍니다.

```js
$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut("C:\Users\Public\Desktop\notepad.lnk"); $s.TargetPath = "C:\Windows\System32\notepad.exe"; $s.IconLocation = "C:\Windows\system32\imageres.dll,173"; $s.Save()
```

<div class="content-ad"></div>

cmd를 통해 작업하는 우리에게:

```js
powershell -ExecutionPolicy bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('C:\Users\Public\Desktop\notepad.lnk'); $s.TargetPath = 'C:\Windows\System32\notepad.exe'; $s.IconLocation = 'C:\Windows\system32\imageres.dll,173'; $s.Save()"
```

# 결론

PowerShell을 사용하여 바로 가기를 만드는 것은 COM 객체를 사용하여 WScript.Shell 클래스를 인스턴스화하여 바로 가기 생성 기능에 액세스하는 복잡성을 도입하지만, 프로퍼티 값을 구성하는 루틴 작업으로 단순화됩니다. 배포 전 철저한 테스트, 절대 경로 정확성에 대한 주의 및 아이콘이나 특정 경로와 같은 기존 시스템 요소를 재사용하는 마인드는 중요한 고려 사항입니다.

<div class="content-ad"></div>

당신이 시간을 쏟을 수 있는 곳은 운영 체제의 복잡성에 깊이 파고들어 특정 패널이나 가상 폴더를 대상으로 하는 방법을 알아내는 것입니다. 그러나 대부분의 경우에는 결과적으로 필요한 배포 가능한 한 줄의 코드로 축약될 수 있습니다.

# 작성자의 노트

여기까지 오셨네요! 잘 하셨어요 친구들 — 제가 꽤 괜찮은 작가라서 그런지, 아니면 당신이 훌륭한 독자라서 그런 건지요. 우리는 후자를 택하도록 합시다😅.

나는 기업의 혼돈을 탐내는 경험 많은 IT 서비스 전달 엔지니어 다닐로입니다. 저는 스크립팅, 시스템 관리자 관련 내용, 그리고 다른 곳에서 제대로 문서화되지 않은 주제들에 대해 글을 씁니다. 지식을 공유하고 글쓰기 기술을 향상시키기 위한 목적을 가지고요.

<div class="content-ad"></div>

만졌더니 반복의 경우 피드백을 주세요!