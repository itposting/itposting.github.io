---
title: "2024년 개발자를 위한 macOS에서 반드시 필요한 도구 및 앱"
description: ""
coverImage: "/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_0.png"
date: 2024-06-19 08:52
ogImage: 
  url: /assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_0.png
tag: Tech
originalTitle: "Must-have tools and apps for macOS for developers in 2024"
link: "https://medium.com/@sumitsahoo/must-have-tools-and-apps-for-macos-for-developers-in-2023-6cc43dd83bcc"
---



![매체 기사](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_0.png)

여기가 내 첫 번째 매체 기사야.

10년 이상 동안 macOS를 활용해온 나는 아키텍처, 클라우드, 모바일 앱, 웹 앱에 집중하며 반드시 필요한 다음과 같은 도구들을 소개하고 싶다.
VS Code, Intellij IDEA, Xcode, Android Studio, Docker와 같이 흔히 쓰는 것들은 건너뛰겠어. 그런데 Fleet에 관심 있는 사람 있나요? 나한테 알려줘.


<div class="content-ad"></div>

# 개발자 도구

Brew (무료)

Homebrew는 Apple의 운영 체제인 macOS에 소프트웨어를 설치하는 작업을 단순화하는 무료 오픈 소스 소프트웨어 패키지 관리 시스템입니다. 사용하기 쉽고 몇 가지 간단한 단계로 설치할 수 있습니다. Homebrew를 설치하면 Homebrew 리포지토리에서 소프트웨어를 설치할 수 있습니다. Homebrew 리포지토리에는 수천 가지 패키지가 포함되어 있습니다. GitHub와 같은 다른 소스에서 소프트웨어를 설치하는 데도 Homebrew를 사용할 수 있습니다. Homebrew는 macOS를 최신 소프트웨어로 유지하고 macOS 앱 스토어에 없는 소프트웨어를 설치하는 좋은 방법입니다.

이것은 macOS를 새로 설치한 후 맨 처음 설치하는 앱입니다.

<div class="content-ad"></div>

이제 아래 명령어를 사용하여 Homebrew를 설치해보세요.

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Homebrew가 설치되면 매우 간단하게 대부분의 앱을 Homebrew로 설치할 수 있어요. 아래는 몇 가지 IDE 예시입니다:

```js
# VS Code 설치
brew install --cask visual-studio-code

# Intellij IDEA Community Edition 설치
brew install --cask intellij-idea-ce

# Android Studio 설치
brew install --cask android-studio
```

<div class="content-ad"></div>

brew 앱을 업데이트하려면 아래 명령어를 사용하세요 (또는 MacUpdater, Latest app을 사용하세요). 자동화하려면 크론 작업을 설정할 수도 있어요 :)

```js
brew update && brew upgrade && brew cleanup
```

Warp Terminal (무료/유료)

Warp Terminal은 macOS용 현대적이고 빠르며 사용자 정의가 가능한 터미널 에뮬레이터입니다. Rust로 개발되었으며 GPU 가속을 사용하여 부드럽고 반응이 빠른 경험을 제공합니다. Warp Terminal은 탭, 분할 창 및 다중 프로필을 포함한 다양한 기능을 지원합니다. 또한 내장 파일 관리자와 강력한 검색 도구를 갖추고 있습니다. Warp Terminal은 개발자와 강력하고 사용자 정의 가능한 터미널 에뮬레이터를 원하는 모든 사람들에게 좋은 선택입니다.

<div class="content-ad"></div>



![Image](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_1.png)

요즘 모든 도구와 마찬가지로 이것도 AI (GPT ahem ahem) 기능을 갖추고 있습니다. Mac에서 숨겨진 파일을 표시하는 명령을 요청할 수 있어요. 가장 좋아하는 기능은 구문 강조, 자동 제안 및 북마크 옵션으로 시간을 많이 절약할 수 있습니다.

brew를 사용하여 설치해보세요

```js
brew install --cask warp
``` 


<div class="content-ad"></div>

CotEditor (무료)

CotEditor는 웹 페이지 (HTML, CSS), 프로그램 소스 코드 (Python, Ruby, Perl 등), 구조화된 텍스트 (Markdown, Textile, TeX 등) 또는 기타 종류의 일반 텍스트를 편집하기 위해 설계된 오픈 소스 경량이면서 강력한 텍스트 편집기입니다. macOS용으로 만들어져 macOS 응용 프로그램이 가져야 할 외관과 기능을 갖추고 있습니다.

![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_2.png)

"또 다른 텍스트 편집기가 필요한 이유가 뭐냐구요?"라고 궁금해하실 수도 있습니다. 그런데 때로는 파일을 저장하지 않아도 문법 강조를 할 수 있는 곳에 코드를 복사하여 붙여넣고 싶을 때도 있거든요 (이것이 Sublime에서 잘 되지 않는 부분입니다). CotEditor는 바로 그런 상황에 유용하죠.

<div class="content-ad"></div>

맥 앱 스토어에서 설치하거나 간단히 brew를 사용할 수 있어요.

```js
brew install --cask coteditor
```

Fork (유료)

Fork는 맥과 윈도우용 빠르고 친근한 Git 클라이언트에요. 사용하기 쉽도록 설계되어 깔끔하고 직관적인 인터페이스를 갖췄어요. Fork는 기본적인 Git 명령뿐만 아니라 더 고급 기능인 병합 충돌 해결 및 대화식 리베이스도 지원해요. 내장된 차이점 뷰어와 강력한 검색 도구도 있어요. Fork는 강력하면서 사용하기 쉬운 Git 클라이언트를 원하는 개발자들에게 좋은 선택이에요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_3.png)

Fork를 사용하는 이유는 macOS 앱 같은 느낌이 들기 때문이에요 :) SourceTree나 Tower와 같은 대안이 있지만, 난 항상 간단함 때문에 Fork로 돌아오게 되죠.

일반적으로 brew를 사용하여 설치하세요.

```js
brew install --cask fork
```

<div class="content-ad"></div>

새 파일 메뉴(유료)

새 파일 메뉴는 Finder 확장 프로그램으로, Finder 콘텍스트 메뉴를 통해 손쉽고 빠르게 새 파일을 만들 수 있습니다. Finder 창이나 데스크톱에서 마우스 오른쪽 버튼을 클릭하여 새 파일을 생성하거나 한꺼번에 여러 파일을 만들 수 있습니다. 새 파일 메뉴는 텍스트 파일, 문서, 스프레드시트, 프레젠테이션 등 다양한 파일 유형을 지원하며 html, dart, go 등을 위한 새 템플릿을 추가할 수도 있습니다.

Mac App Store에서 다운로드하세요.

<div class="content-ad"></div>

ColorSlurp (무료/유료)

맥OS와 iOS용 컬러 피커 앱인 ColorSlurp은 화면에서 색상을 선택하고 편집하고, 컬러 팔레트를 만들고, 다양한 형식으로 색상을 내보낼 수 있습니다. 디자이너와 개발자들에게 강력한 도구로 만드는 다양한 기능을 갖고 있습니다. 초정밀 확대 도구, 다양한 컬러 선택 도구, 사진에서 자동으로 팔레트 만드는 기능 등이 있습니다. ColorSlurp은 사용하기 쉽고, 세련된 모던한 인터페이스를 갖추고 있습니다.

![이미지](/assets/img/2024-06-19-Must-have-tools-and-apps-for-macOS-for-developers-in-2024_5.png)

맥 앱 스토어에서 받아보세요.

<div class="content-ad"></div>

UTM (무료)

이것은 macOS용 무료 오픈소스 가상 머신 앱입니다. 인기 있는 시스템 에뮬레이터인 QEMU를 기반으로하며 사용자 친화적 인터페이스를 제공하여 가상 머신을 만들고 관리할 수 있습니다. UTM은 Mac에서 Windows, Linux, macOS를 포함한 다양한 운영 체제를 실행하는 데 사용할 수 있습니다. macOS에서 지원되지 않는 새 소프트웨어를 테스트하거나 예전 운영 체제를 실행하려는 개발자와 사용자들에게 강력한 도구입니다.

M1/M2 기반 Mac에 최적화되어 있습니다.

대안으로는 Parallels ($$$), VMware Fusion (무료/유료), VirtualBox (무료)가 있습니다. 개인적으로 저는 Parallels와 같은 구독 기반 앱을 선호하지 않습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_6.png" />

brew를 사용하여 설치하세요

```js
brew install --cask utm
```

ShellHistory (유료)

<div class="content-ad"></div>

백업, 동기화 및 쉘 히스토리를 정리하는 데 도움을 줍니다. 이 도구는 쉘 히스토리를 SQLite 데이터베이스에 Write-Ahead-Log로 저장하여 단순한 텍스트 파일이 아니라 iCloud에 백업합니다. 전체 텍스트 검색을 사용하여 명령을 쉽게 찾을 수 있습니다. 또한 ShellHistory는 종료 코드, 작업 디렉토리, 호스트, 사용자, 명령의 경과 시간 및 세션 ID를 포함하여 히스토리를 확장합니다. 쉘 히스토리에서 명령을 노트북에 정리할 수 있습니다.

필수는 아니지만 유용합니다. 기억하지 못하는 명령을 사용한 경우 UI에서 빠르게 검색하고 복사할 수 있습니다.

맥 앱 스토어에서 다운로드하세요.

![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_7.png)

<div class="content-ad"></div>

# 유틸리티

사각형 (무료/유료)

우리가 정말로 인정해야 할 것은, macOS에서의 창 관리가 없다는 것입니다. 그래서 이 앱이 필요한 것입니다. 우리는 항상 코드를 작성하고 미리보기를 나란히 표시하는 간단한 해결책을 찾고 있었고, 이 앱은 정확히 그 역할을 해주며 더 많은 일도 할 수 있습니다. 더 많은 기능이 있는 프로 버전도 있습니다.

![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_8.png)

<div class="content-ad"></div>

brew을 사용하여 설치하세요.

```js
brew install --cask rectangle
```

MacUpdater (유료)

Mac App Store 앱이 아닌 앱을 최신 상태로 유지하는 필수 앱입니다. 이 앱은 유료이지만 모든 돈을 할 가치가 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_9.png)

brew를 사용하여 설치하세요

```js
brew install --cask macupdater
```

최신 버전 (무료)


<div class="content-ad"></div>

맥업데이터의 대안으로 오픈 소스이며, 모든 앱의 업데이트를 보여주지 않는 유일한 제한이 있습니다. 그러나 맥업데이터보다 한 가지 장점이 있습니다. 맥 앱 스토어 앱의 업데이트를 정확히 보여주며, 한 번 클릭으로 모두 업데이트할 수 있습니다. 솔직히 말해서, 저는 두 앱 모두 사용합니다 :)

![image](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_10.png)

brew를 사용하여 설치할 수 있습니다

```js
brew install --cask latest
```

<div class="content-ad"></div>

Shottr (무료)

Shottr은 macOS용 무료 경량화면 캡처 앱입니다. M1/M2 맥에 최적화되어 있고 프리미엄 도구에서 기대할 수 있는 기능을 제공합니다. 캡처 모드에서 Shottr 앱은 스크롤링 스냅샷 및 창 스냅샷과 함께 배경을 추가한 고급 캡처를 수행할 수 있습니다. 또한 스크린샷에 주석을 추가하거나 텍스트를 넣고 민감한 정보를 흐릴 수 있는 내장 편집기도 있습니다. Shottr은 가격표가 부착되지 않은 강력한 스크린샷 앱을 찾고 있는 사용자들에게 좋은 선택지입니다.

![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_11.png)

Homebrew를 사용하여 설치하세요

<div class="content-ad"></div>

```js
brew install --cask shottr
```

OpenIn (유료)

OpenIn은 macOS용 앱으로, 링크, 이메일 및 파일을 선택한 애플리케이션에서 열 수 있게 해줍니다. 링크, 이메일 및 파일을 위한 선택 목록을 사용자 정의하여 업무 흐름을 간소화할 수 있습니다.

예를 들어, Teams 앱에서 클릭한 링크를 Edge 브라우저에서 열도록 구성할 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_12.png" />

맥 앱 스토어에서 설치하세요.

OnyX (무료)

OnyX는 macOS용의 다기능 유틸리티로, 부팅 디스크와 시스템 파일 구조를 확인하고 미사용 파일을 정리하며 기타 유지 보수 작업을 수행할 수 있습니다. Apple 애플리케이션의 숨겨진 매개변수를 구성하고 다양한 기능을 제공합니다. OnyX는 복잡한 명령어를 사용하여 입력해야 할 작업을 많이 처리할 수 있는 신뢰할 수 있는 응용 프로그램으로서, 명령 줄 인터페이스를 통해 작업할 필요가 없도록 깔끔한 인터페이스를 제공합니다.

<div class="content-ad"></div>

아래의 표를 마크다운 형식으로 변경해 주세요.

![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_13.png)

brew를 사용하여 설치하실 수 있습니다.

```js
brew install --cask onyx
```

Hand Mirror (무료/유료)

<div class="content-ad"></div>

핸드 미러는 메뉴 바에 위치한 무료 맥 유틸리티입니다. 클릭할 때마다 셀피 카메라의 작은 미리보기가 표시됩니다. 비디오 통화에 참여하기 전에 외모를 확인하거나 프레임에 부끄러운 것이 없는지 확인하는 데 유용합니다. 핸드 미러에는 유료 애드온이 있어 미리보기 창을 화면 다른 곳으로 이동하고 외관을 변경하거나 다른 앱 아이콘을 선택하는 기능과 같은 보너스 기능들을 잠금 해제할 수 있습니다.

맥 앱 스토어에서 설치하세요.

Raycast (무료/유료)

<div class="content-ad"></div>

Raycast은 macOS용 생산성 앱으로, 작업을 완료하고 계산하며 공통 링크를 공유하며 등 손쉽게 할 수 있게 해줍니다. 이 앱은 앱을 실행하거나 파일을 검색하고 어떤 일이든 키보드 단축키를 만들 수 있는 확장 가능한 런처로 사용할 수 있습니다. Raycast에는 질문에 대답하거나 채팅하고 작업을 간소화할 수 있는 내장 AI 어시스턴트도 포함되어 있습니다.

brew를 사용하여 설치하세요

```js
brew install --cask raycast
```

<div class="content-ad"></div>

TinkerTool (무료)

TinkerTool은 macOS용 무료 오픈 소스 시스템 유틸리티로, 사용자들이 macOS의 숨겨진 환경 설정과 일부 시스템과 함께 제공되는 애플리케이션의 환경 설정을 변경할 수 있습니다. macOS의 룩앤필을 사용자 정의하고 macOS에서 발생할 수 있는 일부 문제를 해결하는 데 사용할 수 있는 강력한 도구입니다. TinkerTool은 사용이 쉽고 관리자 권한이 필요하지 않습니다. macOS 시스템에서 더 많이 활용하고 싶은 사람들에게 좋은 도구입니다.

<img src="/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_16.png" />

그들의 웹사이트에서 다운로드하세요.

<div class="content-ad"></div>

Numi (유료)

Numi은 macOS용 계산기 앱으로, 자연스럽게 작업을 설명하고 정확한 답변을 즉시 얻을 수 있게 해줍니다. 예를 들어 "9달러를 유로로" 입력하면 Numi가 대신 정확히 계산해줍니다. Numi는 단위 변환, 날짜 및 시간 처리, Alfred 통합도 지원합니다.

![이미지](/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_17.png)

brew를 사용하여 설치하세요.

<div class="content-ad"></div>

```js
brew install --cask numi
```

## AltTab (무료)

AltTab의 개발자로써, 이 앱은 macOS에 윈도우의 "alt-tab" 창 전환기능을 가져옵니다. 윈도우에서 앱 전환 중 미리 보기를 그리워한 적이 있나요? macOS에서 창을 찾는 고통을 알고 계시겠죠. 동일한 앱에 대해 여러 창이 있는 경우 cmd+tab로는 그것들이 표시되지도 않아요. 이상한 이동을 해야만 하는데요. 즉, cmd+tab 그리고 cmd+~입니다. 하지만 더 이상 그럴 필요가 없어요. AltTab은 이러한 모든 문제를 해결하면서 멋지게 보여줍니다. 내 의견으로는 반드시 필요한 도구이며, 무료입니다!

<img src="/assets/img/2024-06-19-Must-havetoolsandappsformacOSfordevelopersin2024_18.png" />


<div class="content-ad"></div>

brew를 사용하여 설치해 보세요

```js
brew install --cask alt-tab
```

다른 인기 있는 어플로는 Bartender, iStat Menus, 그리고 Amphetamine이 있어요.

여기까지입니다. 이 어플들은 저가 거의 매일 사용하는 것들이에요. 다른 개발자들이 작업을 더 빨리 할 수 있도록 이들이 도움이 됐으면 좋겠네요.

<div class="content-ad"></div>

다음 기사에서 VS Code 플러그인을 다룐다면 알려주세요. 또한 목록에 추가해야 할 애플리케이션이 있으면 아래 댓글로 알려주세요.

2023년 8월 12일 업데이트: AltTab을 목록에 추가했습니다. 이 앱이 정말 좋으니까요.

2024년 1월 12일 업데이트: 2024년에 앱들이 여전히 관련성이 있기 때문에 제목을 업데이트했어요 🤓

2024년 3월 13일 업데이트: Fig를 삭제했습니다. 이제 Fig 팀은 명령줄을 위해 Amazon CodeWhisperer을 권장하고 있습니다.

<div class="content-ad"></div>

감사합니다!