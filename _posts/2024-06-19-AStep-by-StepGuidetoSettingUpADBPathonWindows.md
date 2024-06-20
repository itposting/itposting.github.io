---
title: "윈도우에서 ADB 경로 설정하는 단계별 가이드"
description: ""
coverImage: "/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_0.png"
date: 2024-06-19 15:21
ogImage: 
  url: /assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_0.png
tag: Tech
originalTitle: "A Step-by-Step Guide to Setting Up ADB Path on Windows"
link: "https://medium.com/@yadav-ajay/a-step-by-step-guide-to-setting-up-adb-path-on-windows-0b833faebf18"
---


![사진](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_0.png)

# 소개:

Android Debug Bridge (ADB)는 컴퓨터와 안드로이드 기기 간 통신을 용이하게 하는 다목적 명령 줄 도구입니다. 안드로이드 개발자이든 열정적인 사용자이든 기기를 사용자 정의하려는 경우, ADB를 올바르게 설정하는 것이 중요합니다. 이 안내서에서는 Windows에서 ADB 경로를 설정하는 단계를 안내하여 안정적이고 번거로움 없는 경험을 보장합니다.

단계 1: Android SDK Platform Tools 다운로드 첫 번째 단계는 공식 Android 개발자 웹사이트에서 ADB를 포함한 Android SDK Platform Tools를 다운로드하는 것입니다. 다음과 같습니다:

<div class="content-ad"></div>

Android 개발자 웹사이트로 이동하세요: [https://developer.android.com/studio/releases/platform-tools](https://developer.android.com/studio/releases/platform-tools). 여러분의 Windows 버전과 호환되는 최신 SDK 플랫폼 도구를 다운로드하세요.

![Step 1](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_1.png)

약관 및 조건에 동의하신 후 편의를 위해 다운로드 버튼이 제공됩니다.

![Step 2](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_2.png)

<div class="content-ad"></div>

컴퓨터의 편리한 위치, 예를 들어 C:\adb와 같이 다운로드한 ZIP 파일을 압축해제하세요.

![이미지](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_3.png)

2단계: ADB를 시스템 경로에 추가합니다. SDK 플랫폼 도구를 다운로드하고 adb 폴더에 압축 해제한 후 시스템의 PATH 환경 변수에 ADB 디렉토리를 추가하세요.

다음 단계를 따라 진행하세요: 시작 메뉴를 마우스 오른쪽 버튼으로 클릭하고 "시스템"을 선택하세요.

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_4.png)

Click on “Advanced system settings” on the left panel.

![Image 2](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_5.png)

In the System Properties window, click the “Environment Variables” button.


<div class="content-ad"></div>

아래 시스템 변수에서 "Path" 변수를 찾아 선택한 후 "편집"을 클릭해주세요.

"신규"를 클릭하고 ADB 디렉토리 경로를 추가해주세요 (예: C:\adb).

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_8.png" />

모든 창을 닫고 변경 사항을 저장하려면 "확인"을 클릭하세요.

단계 3: ADB 설치 확인
ADB가 올바르게 설정되었는지 확인하려면 명령 프롬프트 창을 열고 다음 명령을 실행하여 설치를 확인할 수 있습니다:

```js
adb version
```

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-AStep-by-StepGuidetoSettingUpADBPathonWindows_9.png)

ADB가 제대로 구성되었다면 명령 프롬프트 창에 버전 정보가 표시됩니다.

단계 4: Android 장치 연결
Windows 시스템에 ADB가 설정되어 있으므로 이제 USB 케이블로 Android 장치를 연결할 수 있습니다. Android 장치에서 USB 디버깅이 활성화되어 있는지 확인하려면,

1. 설정으로 이동합니다.
2. 개발자 옵션으로 이동합니다 (표시되지 않는 경우, 전화 정보로 이동하여 빌드 번호를 여러 번 탭하여 개발자 옵션을 활성화합니다).
3. USB 디버깅을 활성화합니다.
4. 그 후 컴퓨터에서 USB 디버깅 액세스를 허용하도록 메시지가 표시되면 허용합니다.

<div class="content-ad"></div>

단계 5: ADB 연결 테스트 Android 장치와 ADB가 통신하는지 확인하려면 Command Prompt 창에서 다음 명령을 실행하십시오:

```js
adb devices
```

모든 것이 올바르게 설정되었다면, 장치와 해당 고유 식별자가 목록에 표시됩니다.

# 결론:

<div class="content-ad"></div>

Windows 운영 체제에서 ADB 경로를 설정하는 것은 안드로이드 개발, 디버깅 및 사용자 정의에 필요합니다. 이 안내 메뉴얼에 기술된 절차에 따르면, ADB를 개발 프로세스에 쉽게 통합하고 컴퓨터를 통해 안드로이드 기기와 다양한 기회를 활용할 수 있습니다.