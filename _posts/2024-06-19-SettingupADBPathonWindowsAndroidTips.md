---
title: "윈도우에서 ADB 경로 설정하기 안드로이드 팁"
description: ""
coverImage: "/assets/img/2024-06-19-SettingupADBPathonWindowsAndroidTips_0.png"
date: 2024-06-19 15:37
ogImage: 
  url: /assets/img/2024-06-19-SettingupADBPathonWindowsAndroidTips_0.png
tag: Tech
originalTitle: "Setting up ADB Path on Windows: Android Tips."
link: "https://medium.com/@theflutterist/setting-up-adb-path-on-windows-android-tips-5b5cdaa9084b"
---


ADB(Android Debug Bridge)는 안드로이드 앱 개발자들에게 필수적인 도구로, 컴퓨터에서 안드로이드 기기와 통신할 수 있게 해줍니다. ADB를 효과적으로 사용하려면 Windows 환경에서 ADB 경로를 설정해야 합니다. 아래 단계별 안내를 따라 시작해보세요:

![이미지](/assets/img/2024-06-19-SettingupADBPathonWindowsAndroidTips_0.png)

## 단계 1: Android SDK Platform Tools 다운로드

- 웹 브라우저를 열고 공식 Android SDK Platform Tools 다운로드 페이지에 방문하세요: Android SDK Platform Tools.
- 페이지를 스크롤하여 "SDK Platform-Tools for Windows" 섹션을 찾으세요.
- "Windows 플랫폼 도구 다운로드" 링크를 클릭하여 ADB 및 기타 도구가 포함된 ZIP 파일을 다운로드하세요.

<div class="content-ad"></div>

## 단계 2: ZIP 파일 추출

- 컴퓨터의 다운로드 폴더에서 다운로드한 ZIP 파일 (예: “platform-tools_r32.0.0-windows.zip”)을 찾아주세요.
- ZIP 파일을 마우스 오른쪽 버튼으로 클릭하고 “모두 추출”을 선택해주세요.
- 파일을 추출하고 싶은 대상 폴더를 선택하고 “추출”을 클릭해주세요. 이렇게 하면 ADB 및 기타 도구가 포함된 폴더가 생성됩니다.

## 단계 3: ADB 폴더 경로 복사

- ZIP 파일의 내용을 추출한 폴더로 이동해주세요. 이 폴더에는 “adb.exe” 파일이 포함되어 있어야 합니다.
- 상단에 있는 폴더의 주소 표시줄을 클릭해주세요. 해당 폴더의 전체 경로가 표시됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-SettingupADBPathonWindowsAndroidTips_1.png" />

## 단계 4: 환경 변수에 ADB 경로 추가하기

- Windows 검색 창에 "환경 변수"를 입력한 다음 "시스템 환경 변수 편집"을 선택합니다.
- "시스템 속성" 창에서 하단에 있는 "환경 변수" 버튼을 클릭합니다.

## 단계 5: "Path" 변수 편집하기

<div class="content-ad"></div>

- “환경 변수” 창에서 “시스템 변수” 섹션 아래에서 “Path” 변수를 찾아 선택하세요.
- “편집” 버튼을 클릭하세요.

## 단계 6: ADB 경로 추가

- “환경 변수 편집” 창에서 “새로 만들기” 버튼을 클릭하세요.
- 이전에 복사한 ADB 폴더 경로를 입력란에 붙여넣으세요.
- 각 창을 닫으려면 “확인”을 클릭하세요.

## 단계 7: ADB 설치 확인

<div class="content-ad"></div>

- 명령 프롬프트(cmd) 또는 PowerShell을 엽니다.
- "adb"를 입력하고 Enter 키를 누릅니다.
- ADB 명령과 옵션이 표시되면 ADB가 성공적으로 설치되고 구성된 것을 알 수 있습니다.

![이미지](/assets/img/2024-06-19-SettingupADBPathonWindowsAndroidTips_2.png)

축하합니다! Windows 환경에서 ADB 경로를 성공적으로 설정했습니다. 이제 전체 경로를 지정하지 않고 명령 프롬프트나 PowerShell에서 ADB 명령을 사용할 수 있습니다. 이것은 Windows 기기에서 안드로이드 앱 개발 및 디버깅에 필수적입니다.

# 결론

<div class="content-ad"></div>

Windows 환경에서 ADB 경로를 설정하는 것은 안드로이드 앱 개발자에게 매우 중요한 단계입니다. 이를 통해 컴퓨터에서 안드로이드 기기와 원활하게 통신할 수 있어 앱 개발 및 디버깅 작업이 훨씬 효율적으로 진행됩니다.

이 단계별 안내를 따라, 안드로이드 SDK 플랫폼 도구를 다운로드하고 필요한 파일을 추출하여 시스템 환경 변수에 ADB 경로를 추가하는 방법을 배웠습니다. 이 간단한 과정을 통해 ADB 명령을 명시적으로 전체 경로를 지정하지 않고도 명령 프롬프트나 PowerShell에서 직접 사용할 수 있습니다.

이제 ADB를 올바르게 구성했으므로 안드로이드 앱 개발을 더욱 발전시킬 준비가 되었습니다. 물리 기기나 가상 에뮬레이터에서 앱을 테스트하든지 상관없이, 디버깅 및 안드로이드 기기와 상호 작용하는 데 ADB가 필수적인 도우미 역할을 할 것입니다. 즐거운 코딩하세요!

# 다음 단계: