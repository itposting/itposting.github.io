---
title: "맥 macOS  Apple Silicon M1, M2 에 Java 21을 설치하고 JAVA_HOME 경로를 설정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_0.png"
date: 2024-06-20 14:31
ogImage: 
  url: /assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_0.png
tag: Tech
originalTitle: "How to install Java 21 and setup JAVA_HOME Path in macOS 🍏 (Apple Silicon M1 , M2)"
link: "https://medium.com/@aniketvishal/how-to-install-java-and-setup-java-home-path-in-macos-apple-silicon-m1-m2-2edf185b992c"
---


Apple Silicon M1 또는 M2 Mac의 자랑스러운 소유자라면 Java를 설치하고 JAVA_HOME 경로를 설정하는 방법에 대해 궁금할 수 있습니다. Java는 다양한 애플리케이션에서 사용되는 유연한 프로그래밍 언어로, macOS에 올바르게 설치하는 것은 개발자와 기술 애호가들에게 필수적입니다. 이 안내서에서는 Apple Silicon Mac에서 Java를 설치하고 실행하는 단계를 안내해 드리겠습니다.

![Java 설치 및 JAVA_HOME 경로 설정 가이드](/assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_0.png)

# 단계 1: 적합한 Java 버전 다운로드 ☕

Apple Silicon Mac은 Intel 기반 이전 제품과 다른 아키텍처를 사용합니다. 따라서 Apple Silicon과 호환되는 Java 버전을 다운로드해야 합니다.

<div class="content-ad"></div>

- 웹 브라우저를 열고 오라클 웹 사이트의 Java 다운로드 섹션을 엽니다.
- macOS용 "최신 Java 릴리스"를 선택합니다.
- ARM64 DMG 설치 프로그램 다운로드 링크를 클릭하여 파일을 컴퓨터에 저장합니다.

![이미지](/assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_1.png)

# 단계 2: Java 설치하기 🛠️

적절한 Java 버전을 다운로드했으므로, 이제 Mac에 설치하는 시간입니다.

<div class="content-ad"></div>

- 다운로드한 파일을 찾으세요 (보통 "Downloads" 폴더에 있습니다) 그리고 두 번 클릭하여 설치 패키지를 엽니다.
- 설치 프로세스를 완료하기 위해 화면에 나타나는 지침에 따라주세요. 이 과정에는 라이센스 동의가 포함됩니다.

# 단계 3: Java 설치 확인하기 ✔️

Java가 올바르게 설치되었는지 확인하려면 터미널을 열어서 다음을 입력하세요:

```js
java --version
```

<div class="content-ad"></div>

화면에 Java 버전이 표시되어 있어야 합니다.

![Java Version](/assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_2.png)

# 단계 4: JAVA_HOME 설정 🏠

개발 목적으로 Java를 쉽게 이용할 수 있도록 하려면 JAVA_HOME 환경 변수를 설정해야 합니다. macOS에서 JAVA_HOME 경로를 설정하는 단계를 따라주세요.

<div class="content-ad"></div>

- 터미널 애플리케이션을 엽니다("Applications" 폴더 내 "Utilities" 폴더에 있습니다).
- zShell 환경 파일을 만들어보세요. 환경 파일은 맥의 루트 디렉토리에 있어야 하며 이름은 ".zshenv" 여야 합니다. 아래 코드를 사용하여 zShell 환경 파일을 만드세요.

```js
touch ~/.zshenv
```

- 아래 코드를 사용하여 zShell 환경 파일을 열어보세요.

```js
open ~/.zshenv
```  

<div class="content-ad"></div>

- 아래 경로를 zShell 환경 파일에 추가하고 저장해주세요.

```js
export JAVA_HOME=$(/usr/libexec/java_home)
```

![이미지](/assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_3.png)

- 환경 파일을 저장하고 닫은 후에 아래 코드를 터미널에 입력하여 변경 사항을 적용하고 프로필을 새로 고침해주세요.

<div class="content-ad"></div>


source ~/.zshenv


자바 홈 경로가 zShell 환경 파일에 성공적으로 설정되었습니다. 건배🍻

# 단계 5: JAVA_HOME 설정 확인 ✔️

Java가 올바르게 설치되었고 JAVA_HOME 경로가 설정되었는지 확인하려면 터미널을 열고 다음을 입력하세요:


<div class="content-ad"></div>

```js
echo $JAVA_HOME
```

![Java Installation Guide](/assets/img/2024-06-20-HowtoinstallJava21andsetupJAVA_HOMEPathinmacOSAppleSiliconM1M2_4.png)

# 결론 🎉

축하합니다! Java를 성공적으로 설치하고 Apple Silicon M1 또는 M2 Mac에서 JAVA_HOME 경로를 설정했습니다. 이제 쉽게 Java 응용 프로그램을 개발하고 코딩할 준비가 되었습니다.

<div class="content-ad"></div>

Java 설치를 최신 상태로 유지하고 강력한 Apple Silicon Mac에서 Java 개발의 흥미로운 세계를 탐험해보세요! 💻🍏✨

설치 과정 중 궁금한 점이나 문제가 발생하면 Java 커뮤니티에 문의하거나 공식 문서를 참고하여 도움을 받을 수 있습니다. 즐거운 코딩하세요! 🚀👨‍💻👩‍💻