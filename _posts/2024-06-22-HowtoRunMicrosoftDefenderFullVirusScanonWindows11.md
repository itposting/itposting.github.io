---
title: "윈도우 11에서 Microsoft Defender로 전체 바이러스 검사를 실행하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_0.png"
date: 2024-06-22 16:33
ogImage: 
  url: /assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_0.png
tag: Tech
originalTitle: "How to Run Microsoft Defender Full Virus Scan on Windows 11"
link: "https://medium.com/@khalilullah1/how-to-run-microsoft-defender-full-virus-scan-on-windows-11-dbe4cd1f2cfa"
---


Microsoft Defender의 전체 바이러스 스캔을 PC에서 실행하는 세 가지 쉬운 방법을 알아보세요. Windows Security 앱, Powershell 및 명령 프롬프트를 사용하는 방법이 포함되어 있습니다.

![이미지](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_0.png)

컴퓨터를 악성 코드로부터 보호하는 데 관한 경우, 빠른 스캔은 종종 충분하지 않아 잠재적인 위협을 간과할 수 있습니다. 여기서 전체 바이러스 스캔이 필요한데요. 이는 PC의 각 모서리와 모퉁이를 악성 침입자를 위해 철저히 검사하는 철저한 스윕입니다. 이 과정은 일반적으로 몇 시간 정도 소요되므로 약간의 인내심이 필요하지만 결과는 가치 있을 수 있습니다.

다행히 Windows 11의 내장 안티바이러스 프로그램인 Microsoft Defender를 사용하여 제3자 앱이 필요하지 않은 PC에서 효과적인 전체 바이러스 스캔을 실행할 수 있습니다. 또한 Windows Security 앱, Powershell 및 명령 프롬프트를 사용하여 다양한 방법으로 스캔을 시작할 수 있습니다. 자세한 방법을 알아보려면 계속 읽어보세요.

<div class="content-ad"></div>

# 윈도우 보안 앱에서 전체 바이러스 검사 실행하는 방법

윈도우 11에서 전체 바이러스 검사를 실행하는 가장 쉬운 방법은 Windows 보안 앱을 통해 실행하는 것입니다. 다음 단계를 따라 진행해보세요:

- 시작 버튼을 클릭하여 메뉴를 엽니다.

![이미지](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_1.png)

<div class="content-ad"></div>

2. "Windows Security"을 검색하여 앱을 엽니다.

![Windows Security](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_2.png)

3. 왼쪽 사이드바에서 "Virus & threat protection"을 선택하세요.

![Virus & threat protection](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_3.png)

<div class="content-ad"></div>

4. "Current threats" 섹션 아래에 있는 "Scan options"를 클릭하세요.

![Scan options](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_4.png)

5. "Full Scan"을 선택하고 "Scan now"를 클릭하세요.

![Full Scan](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_5.png)

<div class="content-ad"></div>

스캔 프로세스가 시작됩니다. 마이크로소프트 디펜더가 악성 소프트웨어를 스캔하고 감지되면 수행 중인 것을 격리하거나 제거합니다. 스캔 프로세스가 완료되면 특정 앱이나 파일을 수동으로 격리, 제거 또는 허용할 수 있습니다.

참고: PC에 저장된 데이터 양에 따라 스캔 프로세스에 시간이 걸릴 수 있으니 기다려 주시기 바랍니다.

# 명령 프롬프트를 사용하여 전체 바이러스 스캔하는 방법

다음 단계를 따라 마이크로소프트 디펜더 전체 바이러스 스캔을 명령 프롬프트를 통해 실행하는 방법을 알아보세요:

<div class="content-ad"></div>

- 시작 메뉴를 열고 "명령 프롬프트"를 검색한 후 "관리자로 실행"을 선택하세요.

![이미지](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_6.png)

2. 명령 프롬프트에서 다음 명령어를 입력하고 "Enter"를 눌러 Microsoft Defender 바이러스 백신에 액세스하세요:


cd C:\ProgramData\Microsoft\Windows Defender\Platform\4*


<div class="content-ad"></div>


<img src="/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_7.png" />

3. Next, type the following command and press “Enter” to initiate a full scan in Microsoft Defender:

mpcmdrun -scan -scantype 2

<img src="/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_8.png" />


<div class="content-ad"></div>

이 명령들을 실행하면 Microsoft Defender가 바이러스를 스캔하고 감지된 악성 코드를 제거할 것입니다. 스캔이 완료되면 화면에 "스캔 완료" 메시지가 표시됩니다.

# PowerShell을 사용한 전체 바이러스 스캔 실행 방법

아래 단계를 따라 PowerShell을 사용하여 Microsoft Defender 전체 바이러스 스캔을 실행할 수 있습니다:

- 시작 메뉴를 열고 "PowerShell"을 검색한 후 "관리자 권한으로 실행"을 클릭하십시오.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_9.png" />

2. In Powershell, input the following command and hit “Enter” to initiate a Microsoft Defender full virus scan on your PC:

start-mpscan -scantype fullscan

<img src="/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_10.png" />


<div class="content-ad"></div>

해당 명령을 실행하면 전체 바이러스 스캔이 시작됩니다. PowerShell 화면에서 스캔 진행 상황을 백분율 바로 알려줄 거에요.

# Microsoft Defender로 특정 파일이나 폴더를 스캔하는 방법

전체 바이러스 스캔은 보통 몇 시간이 걸리기 때문에, 일부 사용자는 컴퓨터에서 악성 코드를 스캔하고 제거하는 보다 빠르고 효율적인 방법을 찾습니다. 만약 당신도 그 중 하나라면, "사용자 정의 스캔" 기능을 사용해 어떤 파일과 위치를 악성 코드를 확인할지 선택해볼 수 있습니다. 아래 단계를 따라해보세요:

- 시작 메뉴를 열고 설정 아이콘을 클릭하세요.

<div class="content-ad"></div>

아래는 Markdown 형식으로 변환된 내용입니다.


![이미지1](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_11.png)

2. Privacy & Security를 선택하고 Windows Security로 이동합니다.

![이미지2](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_12.png)

3. 그 다음, Virus & Threat protection을 클릭하고 Scan options 아래의 Customized scan을 클릭하세요.


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_13.png)

4. '커스터마이즈된 스캔'을 클릭하면 탐색기 창이 열리고 특정 폴더를 선택할 수 있습니다. 창에서 개별 파일을 볼 수는 없지만 해당 폴더를 선택하고 '폴더 선택'을 클릭하여 스캔을 시작할 수 있습니다. 스캔이 완료되면 스캐닝이 시작됩니다. 해당 폴더의 모든 하위 폴더와 파일이 포함됩니다.

![이미지](/assets/img/2024-06-22-HowtoRunMicrosoftDefenderFullVirusScanonWindows11_14.png)

# 데이터를 잃기 전에 데이터를 보호하세요!


<div class="content-ad"></div>

귀하의 PC에서 정기 바이러스 스캔을 수행하여 파일을 훼손하고 문제를 일으킬 수 있는 악성 소프트웨어를 발견하고 제거하는 것이 매우 중요합니다. 이 가이드에서는 Windows Security 앱, 명령 프롬프트 및 PowerShell을 사용하여 Microsoft Defender 전체 바이러스 스캔을 실행하는 세 가지 간단한 방법을 소개했습니다. 전체 바이러스 스캔이 완료될 때까지 몇 시간을 기다리기 싫다면 대신 특정 파일 및 폴더를 확인하여 시간을 적게 들이고 실용적인 검사용 옵션을 고려해보세요.