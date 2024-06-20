---
title: "윈도우에서 Kali Linux로의 원격 SSH 연결 설정하기"
description: ""
coverImage: "/assets/img/2024-06-19-EstablishingRemoteSSHConnectionsfromWindowstoKaliLinux_0.png"
date: 2024-06-19 04:57
ogImage: 
  url: /assets/img/2024-06-19-EstablishingRemoteSSHConnectionsfromWindowstoKaliLinux_0.png
tag: Tech
originalTitle: "Establishing Remote SSH Connections from Windows to Kali Linux"
link: "https://medium.com/bugbountywriteup/establishing-remote-ssh-connections-from-windows-to-kali-linux-545c71793fae"
---


리모트 Kali Linux VM에 SSH 키 설정하기

![이미지](/assets/img/2024-06-19-EstablishingRemoteSSHConnectionsfromWindowstoKaliLinux_0.png)

인증을 위해 SSH 키를 설정하는 것은 단독으로 비밀번호를 사용하는 것보다 더 안전한 방법일 수 있습니다. SSH 키는 강력한 비밀번호조차도 해독하기 어려운 복잡한 구조를 가지고 있습니다. 또한 이를 통해 비밀번호를 입력하지 않고 원격으로 Kali Linux 시스템에 안전하게 로그인할 수 있습니다. 제대로 구성되었을 때 SSH 키 기반의 인증은 브루트 포스 비밀번호 공격을 사실상 무용지물로 만들어줍니다. 암호화 키는 해독하기가 더 어렵기 때문입니다. 또한 SSH 에이전트를 사용하면 편리함을 더할 수 있습니다. 보안을 희생하지 않고 한 번 비밀 키로 인증하면 자격 증명을 매번 입력하지 않고 서버에 자유롭게 연결할 수 있습니다.

Windows 상의 PowerShell에서 키 생성하기

<div class="content-ad"></div>

어드민 PowerShell을 열고 다음을 입력해주세요.

```js
ssh-keygen
```

cat 명령어를 사용하여 공개 키를 확인해보실 수 있습니다. 공개 키는 다음 경로에 위치해 있어야 합니다.

```js
C:\Users\<username>/.ssh/id_rsa.pub
```

<div class="content-ad"></div>

이 공개 키는 Kali Linux 상에서 인증을 하는 데 사용될 것입니다. 이를 복사하여 Kali Linux 상의 authorized_keys 파일에 붙여넣으시면 됩니다. 사용자가 이미 상자에 접속한 경우이고 sudo 사용자로 SSH 키를 설정할 수 있는 권한이 있으시면 이 과정은 쉽습니다. 그냥 텍스트 편집기를 사용하여 파일을 수정하면 됩니다.

Markdown 형식으로 표를 변경해주시기 바랍니다:

```bash
nano ~/.ssh/authorized_keys
```

Windows에서 Kali Box에 연결하기

이제 Windows 상의 PowerShell을 열고, -i 옵션을 사용하여 키 파일 (id_rsa)이 어디에 있는지 지정하여 Kali 상자에 연결하실 수 있습니다.

<div class="content-ad"></div>

```js
ssh -i C:\Users\<username>/.ssh/id_rsa <username>@<Server_IP>
```

이 명령어를 입력하면 Kali 상자에 연결됩니다. 그러나 이것을 기억하는 것은 많을 수 있습니다. 이를 효율적으로 실행하기 위해 함수와 별칭을 만드는 것이 더 실용적일 수 있습니다.

효율성을 위한 함수 및 별칭 만들기

PowerShell에서 새 함수와 별칭을 만드는 것은 간단한 프로세스입니다. 새 함수를 정의하려면 function 명령어를 사용하고 실행할 코드가 포함된 스크립트 블록을 사용하면 됩니다. 예를 들어, Connect-Kali라는 함수를 생성하려면 다음 구문을 사용하면 됩니다.

<div class="content-ad"></div>

```js
function Connect-Kali { ssh -i C:\Users\<username>/.ssh/id_rsa <username>@<Server_IP> }
```

새 별칭을 생성하려면 먼저 PowerShell 프로필이 있는지 확인해야 합니다. PowerShell 인스턴스를 열고 다음 명령을 사용하세요.

```js
Test-Path $PROFILE 
```

명령이 False를 반환하면 다음 문법을 사용하여 프로필을 만들어야 합니다.

<div class="content-ad"></div>

```js
New-Item -type file -path $PROFILE -force 
```

<img src="/assets/img/2024-06-19-EstablishingRemoteSSHConnectionsfromWindowstoKaliLinux_1.png" />

이제 프로필을 편집할 수 있습니다:

```js
notepad.exe $PROFILE
```

<div class="content-ad"></div>

프로필에 다음 함수 및 별칭 라인을 추가하세요 (경로 세부 정보로 수정)

```js
function Connect-Kali { ssh -i C:\Users\<사용자이름>/.ssh/id_rsa <사용자이름>@<서버IP> } New-Alias -Name kali -Value Connect-Kali
```

구문 분석:

- New-Alias: PowerShell에서 새 별칭을 생성합니다.
- -Name kali: 별칭 kali의 이름을 지정합니다.
- -Value Connect-Kali: 이는 앞서 정의된 Connect-Kali 함수의 값입니다.

<div class="content-ad"></div>

프로필을 다시 불러오세요:

```js
. $PROFILE
```

이제 PowerShell에서 단순히 kali를 입력하여 Connect-Kali 함수를 실행하면 지정된 원격 기계로의 SSH 연결이 시작됩니다.

맺음말:

<div class="content-ad"></div>

여기 있습니다. SSH 키를 사용하여 인증하는 것이 패스워드보다 더 안전하며 복잡하고 더 어렵게 해킹할 수 있습니다. 이 방법을 사용하면 Kali Linux 시스템으로의 안전한 패스워드 없는 원격 로그인이 가능해져 브루트포스 공격을 무력화시킵니다. 또한, SSH 에이전트를 사용하면 여러분의 개인 키로 일회성 인증을 허용하여 자격 증명을 반복해서 입력하지 않고도 매끄럽고 안전한 연결을 구현할 수 있습니다.

링크:

- 구독하기! [https://medium.com/@ekiser_48014/subscribe](https://medium.com/@ekiser_48014/subscribe)