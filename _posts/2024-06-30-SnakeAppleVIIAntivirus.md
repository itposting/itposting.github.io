---
title: "스네이크, 애플 VII  2024년 최고의 안티바이러스 프로그램 리뷰"
description: ""
coverImage: "/assets/img/2024-06-30-SnakeAppleVIIAntivirus_0.png"
date: 2024-06-30 23:15
ogImage: 
  url: /assets/img/2024-06-30-SnakeAppleVIIAntivirus_0.png
tag: Tech
originalTitle: "Snake,Apple VII — Antivirus"
link: "https://medium.com/@karol-mazurek/snake-apple-vii-antivirus-0a57acc10185"
---


게이트키퍼, 격리, 그리고 XProtect에 대한 macOS 소개

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_0.png)

# 소개

macOS 보안 내부에 대한 시리즈의 또 다른 기사에 오신 것을 환영합니다!

<div class="content-ad"></div>

지난 에피소드에서는 필수 액세스 제어 프레임워크(MACF)가 Apple Mobile File Integrity(AMFI)에 중점을 둔 정책을 어떻게 시행하는지에 대해 설명했어요.

이번 에피소드에서는 또 다른 MACF 정책인 Quarantine에 대해 배웁니다. Gatekeeper와 XProtect와 함께 작동하여 안티바이러스 삼위일체를 형성합니다.

이 기사는 "역공학" 방식으로 구성되어 있어요. GUI에서 볼 수 있는 내용부터 시작하여 Gatekeeper의 작동 방식에 대한 개요를 제공하고 Quarantine 속성에 대한 의존성을 설명할 거예요.

파일 시스템에서 Quarantine 관련 데이터를 활용하는 Launch Services 데이터베이스 중 하나를 찾아볼 거예요. 이 데이터를 설명하기 위해 Launch Services 프레임워크를 디컴파일하고 Quarantine이 어떻게 사용되는지 검토할 거예요.

<div class="content-ad"></div>

랜치 서비스와 론치드 간의 연결 및 이 데몬이 격리 커널 확장과 상호 작용하는 방법에 대해 배울 것입니다.

시스템 정책 구성 요소에 대해 간단히 다루고 Gatekeeper 화이트리스트 추가가 작동하지 않는 소규모 실험도 진행할 예정입니다.

엑스프로텍트 안티 맬웨어 스캐너가 어떻게 작동하며 CoreServicesUIAgent를 통해 다른 백신 삼핼력 구성 요소와 어떻게 연결되는지 살펴볼 것입니다.

마지막으로, 게이트키퍼 바이패스 일반 개요와 제가 학습하는 과정에서 읽은 유익한 자료에 대한 링크를 제공할 예정입니다. 함께 읽어보면 좋을 것입니다.

<div class="content-ad"></div>

아래 표는 모두를 요약합니다. 주요 목표는 게이트키퍼가 사용하는 격리 차단 메커니즘의 논리를 분석하는 것입니다.

![표](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_1.png)

앞으로의 기사에서 몇 가지 주제가 의도적으로 생략되었음을 유의해 주세요. 하지만 읽는 동안 여기에 쓰여진 내용에 대해 궁금한 점이 있거나 설명이 필요한 경우, 의견을 남겨주세요. 제가 답변해 드리겠으며 피드백을 향후 기사에 활용하겠습니다.

# 게이트키퍼

<div class="content-ad"></div>

알 수없는 앱의 실행을 차단하는 안티맬웨어 소프트웨어입니다. '알 수 없음'은 개인정보 및 보안의 게이트키퍼 설정에 따라 다릅니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_2.png)

앱 스토어 및 식별된 개발자 옵션을 선택하면, 앱이 앱 스토어 외부에서 배포되기 전에 노타라이즈(notarized)되었는지에 관계없이 게이트키퍼가 팝업 창을 표시하지 않습니다.

타인에게 코드를 배포하려면, Apple 개발자 계정의 개발자 ID 인증서를 사용하여 서명하고 노타라이즈해야 합니다:

<div class="content-ad"></div>

- 개발자 ID로 Mac 소프트웨어 서명
- macOS 소프트웨어 배포 전에 노터라이징

자체 서명 또는 ad-hoc 이진 파일은 로컬에서만 작동하며 다른 곳에서 Gatekeeper 검증을 통과하지 못할 것입니다. 예를 들어, Mac mini에서 앱을 컴파일하고 MacBook으로 복사한 다음 처음 실행해 보겠습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_3.png)

또한 두 가지 다른 개발자 ID를 사용하고 있습니다. 이 앱은 Mac mini의 개발자 ID를 사용하여 Xcode에서 자동으로 컴파일 중에 서명되었습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_4.png" />

## 애플리케이션 화이트리스트

이러한 앱을 실행하려면 사용자는 추가 동작을 수행해야 합니다. 애플리케이션을 마우스 오른쪽으로 두 번 클릭한 후 두 번 '열기'를 눌러주시면 됩니다. 아래 스크린샷을 참고해주세요:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_5.png" />

<div class="content-ad"></div>

터미널에서 실행 파일이 거부될지 평가할 수 있어요:

![executable rejection](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_6.png)

게이트키퍼가 활성화되어 있는지 확인할 수도 있어요:

![Gatekeeper check](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_7.png)

<div class="content-ad"></div>

게이트키퍼 검사에서 제외하고 싶은 응용 프로그램의 화이트리스트를 만들 수 있는 옵션이 있습니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_8.png)

이 단계 이후, spctl 명령을 입력하여 해당 응용 프로그램이 허용된 것을 확인할 수 있습니다. 또한 아래 명령을 실행하여 데이터베이스에서 게이트키퍼 허용 응용 프로그램을 확인할 수 있습니다:

그러나 Quarantine 속성이 아직 설정되어 있고 해당 플래그로 인해 실행이 허용되지 않는 경우에는 실행할 때 동일한 메시지가 표시됩니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_9.png)

## Quarantine attribute

It is an extended attribute that indicates the file is from an untrusted source whose fully resolved name is com.apple.quarantine:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_10.png)


<div class="content-ad"></div>

맥OS로 외부에서 전송된 파일에 자동으로 설정됩니다. Info.plist를 통해 애플리케이션에서 LSFileQuarantineEnabled 키를 true 값으로 설정하여 우리 애플리케이션에서 격리를 시행할 수 있습니다. 이러한 구성은 애플리케이션 프로세스에 의해 생성된 모든 파일이 맥OS에 의해 격리됨을 강제합니다.

![snakeapple](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_11.png)

## 격리 해제

비인증 앱을 열기 위한 두 번째 방법은 com.apple.quarantine 확장 속성을 제거하는 것입니다.

<div class="content-ad"></div>


![SnakeAppleVIIAntivirus_12.png](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_12.png)

```js
# 단일 파일에서
xattr -d com.apple.quarantine file_name

# 번들에서 재귀적으로
for f in $(fd . app_name); do xattr -d 'com.apple.quarantine' $f ; done
```

위에서 볼 수 있듯이, quarantine 속성을 제거한 후에는 터미널에서 앱을 정상적으로 실행할 수 있습니다. 더블클릭으로도 실행 가능합니다. 게이트키퍼 경고가 표시되지 않습니다. 다음은 GUI 앱의 예시입니다:

![SnakeAppleVIIAntivirus_13.png](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_13.png)


<div class="content-ad"></div>

## xattr

xattr을 사용하면 quarantine 속성에 대한 추가 정보를 얻을 수 있습니다. 본 글에서는 각 부분을 설명하겠습니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_14.png)

또한 최신 CrimsonUroboros 버전에 xattr을 구현했습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-Snjson꿀kMw21perVII백Antivirus_15.png)

## LaunchServices.QuarantineEvents

quarantine이라는 이름으로 파일 시스템을 검색할 때 가장 먼저 발견한 파일은 사용자 홈 디렉터리에 있는 LaunchServices 데이터베이스였습니다:

```js
~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV*
```  

<div class="content-ad"></div>

위의 예제에서 본 것처럼 데이터베이스에는 현재 사용자 세션(다운로드 시) 중요한 정보를 저장하는 LSQUarantineEvent 테이블이 있습니다. 

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_16.png)

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_17.png)

그러나 화면 공유를 통해 전송되거나 Chromium 엔진을 사용하여 다운로드하는 파일은 Quarantine 속성이 설정되어 있더라도 이 데이터베이스에 추가되지 않습니다. 아래에서 이에 대한 예시를 확인할 수 있습니다:

<div class="content-ad"></div>


![Image1](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_18.png)

데이터베이스는 추적 목적으로만 사용되며 보안 문제는 아닙니다. 그래도 제가 Apple에 신고했고, 그들은 비취약한 것으로 플래그 지정했습니다.

![Image2](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_19.png)

이 데이터베이스 안에는 오직 LSQUarantineEvent 테이블 하나만 있으며, 아래 열을 저장합니다 (대부분이 요즘은 사용되고 있지 않음을 보실 수 있습니다): 


<div class="content-ad"></div>

```js
# 모든 열
LSQuarantineEventIdentifier       # 테이블 고유 레코드 ID
LSQuarantineTimeStamp             # 다운로드된 시간
LSQuarantineAgentBundleIdentifier # 예: org.mozilla.firefox
LSQuarantineAgentName             # 예: Firefox
LSQuarantineDataURLString         # - 사용되지 않음
LSQuarantineSenderName            # - 사용되지 않음
LSQuarantineSenderAddress         # - 사용되지 않음
LSQuarantineTypeNumber            # 유형 (WebDownload|OtherDownload|EmailAttachment|InstantMessageAttachment|CalendarEventAttachment|OtherAttachment)
LSQuarantineOriginTitle           # - 사용되지 않음
LSQuarantineOriginURLString       # - 사용되지 않음
LSQuarantineOriginAlias           # - 사용되지 않음
```

이 테이블에서 모든 데이터를 나열하려면 다음 명령을 사용할 수 있습니다:

```js
# 모든 값 나열:
sqlite3 ~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV* 'select * from LSQuarantineEvent;'
```

재미로 말씀드리면, 예전에 하나의 열인 LSQuarantineDataURLString에 URL 내에서 API 토큰의 정보 유출이 있었습니다:

<div class="content-ad"></div>

```js
# LSQuarantineDataURLString에서 모든 값을 나열합니다:
sqlite3 ~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV* 'select LSQuarantineDataURLString from LSQuarantineEvent'
```

## LSQuarantine.h

데이터베이스는 LaunchServices의 일부이므로 해당 헤더 파일을 다음에서 찾을 수 있습니다:

```js
/Library/Developer/CommandLineTools/SDKs/MacOSX14.4.sdk/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Headers/LSQuarantine.h
```

<div class="content-ad"></div>

여기에서는 다운로드한 파일에 xattr -l을 사용하여 본 격리 값 중 두 가지에 대한 설명을 얻을 수 있습니다.

첫 번째 LSQuarantineEventIdentifier는 데이터베이스에서 인덱스로 사용되며 (해당 속성에 설정된 경우) 격리 속성에 설정된 UUID와 일치합니다:

```js
UUID: E5DDD103-83BF-4CAB-A6C3-08F5433CBD85 # LSQuarantineEventIdentifier - LSQuarantine.h에는 문서화되어 있지 않음
```

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_20.png)

<div class="content-ad"></div>

```js
Timestamp: 6658ca71 # kLSQuarantineTimeStampKey
```

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_21.png" />

```js
Agent: Screen Sharing # kLSQuarantineAgentNameKey
```

# LAUNCH SERVICES


<div class="content-ad"></div>

이 API를 사용하면 앱이 다른 앱 및 파일과 상호 작용할 수 있습니다. Launch Services를 사용하면 앱이 아래에 설명된 여러 작업을 수행할 수 있습니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_22.png)

이는 앱을 더블 클릭하여 실행할 때 Finder를 간접적으로 사용하고, 그 하위에서 Launch Services API를 활용한다는 것을 의미합니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_23.png)

<div class="content-ad"></div>

이 작업을 프로그래밍적으로도 NSWorkspace를 사용하여 달성할 수 있습니다 (하지만 나중에 설명할 중단점을 트리거하지는 않습니다!):

```js
//swiftc -o OpenApp OpenApp.swift -framework AppKit
import AppKit
let workspace = NSWorkspace.shared
let appURL = URL(fileURLWithPath: "/Users/karmaz/Desktop/Hi.app")
workspace.open(appURL)
```

```js
//clang -o OpenApp OpenApp.m -framework AppKit
#import <AppKit/AppKit.h>
int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [[NSWorkspace sharedWorkspace] openURL:[NSURL fileURLWithPath:@"/Users/karmaz/Desktop/Hi.app"]];
    }
    return 0;
}
```

마지막에 launchd가 있는지 어떻게 알 수 있을까요? macOS의 모든 프로세스의 부모는 launchd이며 이것은 프로세스 생성 흐름에 관여합니다.

<div class="content-ad"></div>



![SnakeAppleVIIAntivirus_24](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_24.png)

시각적으로 보려면 시스템에서 exec|fork|exit 활동을 추적하기 위해 eslogger를 사용하여 JSON 형식으로 저장한 다음 SpriteTree를 사용하여 그래프를 만들 수 있습니다:

![SnakeAppleVIIAntivirus_25](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_25.png)

```js
sudo eslogger exec fork exit > eslogger.json
``` 


<div class="content-ad"></div>

새로운 프로세스가 생성된 방식을 디버깅하려면, lldb를 Finder에 연결하고 _spawn_via_launchd 또는 _LSLaunch에 중단점을 설정할 수 있습니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_26.png)

```js
# SIP must be disabled
lldb -p $(pgrep Finder)
breakpoint set -n _LSLaunch
breakpoint set -n _spawn_via_launchd
```

그런 다음 어떤 앱이든 더블 클릭하여 실행하면, 해당 중단점에 도달하게 될 것입니다 (Desktop이나 /Applications 디렉터리에서 Finder에서 실행해야 함):

<div class="content-ad"></div>


<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_27.png" />

디버깅 중에는 두 개의 중단점에 도달할 수 있지만, 이 기사를 작성하는 동안 더 이상 _spawn_via_launchd 중단점을 복제할 수 없었으며, 그 이유를 모르겠습니다. 또한 정보를 검색하여 2015년 Patrick Wardle의 발표 'Exposing Gatekeeper'에도 언급이 있었는데요:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_28.png" />

그러나 이 발표 자료가 조금 오래되었습니다. 호출 스택에는 새로운 함수가 몇 가지 추가되어 있고 일부 함수는 제거되었습니다. 또한 아래 명령들을 사용하여 DTrace로 확인해 보았는데, 특정 프로세스에서 주어진 함수가 사용되었는지 확인하려고 하니 _LSLaunch만 호출되었음을 확인했습니다:


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_29.png)

```js
sudo dtrace -n 'pid$target::_spawn_via_launchd:entry { trace("함수 _spawn_via_launchd를 호출했습니다"); }' -p $(pgrep Finder)
```

```js
sudo dtrace -n 'pid$target::_LSLaunch:entry { trace("함수 _LSLaunch를 호출했습니다"); }' -p $(pgrep Finder)
```

복잡한 _LSLaunch에 대해 자세히 분석하지는 않겠습니다. 디컴파일된 코드에서 볼 수 있는 몇 가지 함수를 간단히 소개할게요:

<div class="content-ad"></div>

- _LSBundleGet – 앱을 시작하는 데 필요한 정보를 검색합니다.
- _LSBundleMeetsMinimumVersionRequirement – 앱이 시작하기 위해 필요한 최소 버전 요구 사항을 충족하는지 확인합니다. 이 단계에서 macOS 버전이 너무 오래되었다면 시작을 방지합니다.
- _LSLaunchWithRunningboard – macOS의 실행 보드 메커니즘을 사용하여 앱의 실제 시작을 시작합니다.

이 중에서 _LSLaunchWithRunningboard에는 대부분의 앱 시작 로직이 포함되어 있습니다. 그 내용이 너무 크기 때문에 lldb에서 강제로 분해해야 합니다 :D

![SnakeAppleVIIAntivirus](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_30.png)

## DSC 역방향: Quarantine과의 Launch Services 연결?

<div class="content-ad"></div>

LSQuarantine.h를 이전에 본 바에 의하면, Launch Services 프레임워크는 전역 변수 집합을 통해 격리 속성을 이해합니다.

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_31.png)

따라서 프레임워크의 어딘가에서 이를 활용해야 합니다. 그러나 Launch Services는 헤더 파일 이외에는 공개 소스 코드를 가지고 있지 않기 때문에, grep을 사용하여 이러한 변수들을 쉽게 찾기는 어렵습니다. 디컴파일된 코드를 조사해야 합니다.

요한 바오로 2세가 생존 중이던 시기에는, 프레임워크 이진 파일을 이 위치에서 찾을 수 있었습니다:

<div class="content-ad"></div>

```js
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/
```

지금은 모든 시스템 2진 파일이 Dyld Shared Cache에서 미리 컴파일되어 있습니다:

```js
/System/Volumes/Preboot/Cryptexes/OS/System/Library/dyld/dyld_shared_cache_arm64e
```

이 기사에서 DSC에서 dylib를 추출하는 또 다른 방법을 찾을 수 있습니다.

<div class="content-ad"></div>

다음은 DSC에서 하나의 dylib를 열기 위해 Ida를 사용할 것입니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_32.png)

```js
ida64 /System/Volumes/Preboot/Cryptexes/OS/System/Library/dyld/dyld_shared_cache_arm64e
```

우리가 여기서 하나의 이진 파일만 선택한다면, 다른 이진 파일에서 가져온 함수에 액세스할 수 없습니다. 이제 예제로 보여드리겠습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_33.png)

Now we can grep the decompiled code to find out where, for instance, the kLSQuarantineAgentBundleIdentifierKey is used:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_34.png)

Let’s check now one of the functions where the variable we search for is used. For instance the _LSSetProcessQuarantineProperties code:


<div class="content-ad"></div>


<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_35.png" />

_qtn_proc_alloc 함수가 있는 것을 볼 수 있습니다. Ida에 하나의 이진파일만을 로드했기 때문에 해당 메모리만 볼 수 있습니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_36.png" />

로드된 DSC에서 주소를 수동으로 검색하여 함수 코드와 수입처를 확인할 수 있지만, 여기에서는 Ida에서 분석을 위해 전체 DSC를 로드하겠습니다:


<div class="content-ad"></div>


![SnakeAppleVIIAntivirus_37](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_37.png)

로드하는 데는 약 24 시간이 걸리고 분석하는 데는 약 7일이 걸리지만, 분석 중에도 작업을 진행할 수 있습니다. 운영 체제 버전당 한 번만 수행하면 나중에 사용할 수 있습니다.

이후 _qtn_proc_alloc의 코드를 명확하게 볼 수 있으며, 아래 이미지에서 확인할 수 있듯이 _qtn_proc_alloc_0 위에 래퍼(wrapper)임을 유추할 수 있습니다:

![SnakeAppleVIIAntivirus_38](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_38.png)


<div class="content-ad"></div>

_qtn_proc_alloc_0를 더블 클릭하면 해당 코드를 볼 수 있으며 해당 함수가 libquarantine.dylib에서 가져온 것임을 볼 수 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_39.png)

## libquarantine.dylib

큐리틴 속성을 조작하기 위한 사용자 모드 인터페이스입니다. 이 게시물의 이전 부분에서 본 바와 같이 Dyld Shared Cache 안에 있을 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_40.png)

앱이 시작될 때 lldb에서 아래의 중단점 regex를 사용하여 dylib에서 함수를 사용하는 모든 위치를 디버그할 수 있습니다:

```js
br set --func-regex ".*" -s libquarantine.dylib
```

다음은 Finder에서 프로그램 시작 중에 일반적으로 직면하는 함수 목록입니다 (란치 서비스 및 보안 호출 포함):

<div class="content-ad"></div>

```js
_qtn_file_alloc
_qtn_file_init_with_path
__qtn_syscall_quarantine_getinfo_path
_qtn_file_free
_LSLaunch
_LSLaunchWithRunningboard
_qtn_file_alloc
_LSGetTranslocatedAppNodeAndSecureDirectory
SecTranslocateCreateSecureDirectoryForURL
Security::SecTranslocate::TranslocationPath::TranslocationPath
Security::SecTranslocate::TranslocationPath::init
Security::SecTranslocate::ExtendedAutoFileDesc::isQuarantined
Security::SecTranslocate::ExtendedAutoFileDesc::fetchQuarantine
_qtn_file_init_with_fd
__qtn_syscall_quarantine_getinfo_fd
_qtn_file_free
_qtn_file_alloc
_qtn_file_init_with_path
__qtn_syscall_quarantine_getinfo_path
qtn_file_free
qtn_proc_alloc
qtn_proc_init_with_self
qtn_proc_init_with_pid
__qtn_syscall_quarantine_getprocinfo
qtn_proc_free
```

- _qtn_file* 및 __qtn_syscall_quarantine_getinfo_fd는 파일(경로 또는 파일 디스크립터로 식별)에 대한 격리 작업과 관련이 있습니다.
- 이전에 본 _LSLaunch 및 _LSLaunchWithRunningboard입니다.
- Security 프레임워크에서 많은 호출을 발견할 수 있습니다. 이러한 함수는 격리된 앱에만 작동하는 App Translocation을 지원합니다.
- 마지막 그룹인 _qtn_proc_* 및 __qtn_syscall_quarantine_getprocinfo는 프로세스와 해당 프로세스가 생성한 모든 파일과 관련된 격리 정보를 관리합니다.

libquarantine은 사용자에게 _qtn_syscall*을 사용하여 Quarantine 커널 확장에 액세스 할 수있는 인터페이스를 제공합니다. 이 메커니즘은 이전에 소개 된 AMFI와 비슷하게 sandbox_ms를 통해 작동합니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_41.png" />


<div class="content-ad"></div>


![2024-06-30-SnakeAppleVIIAntivirus_42.png](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_42.png)

![2024-06-30-SnakeAppleVIIAntivirus_43.png](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_43.png)

## 앱 이동
Gatekeeper Path Randomization (Translocation)은 WWDC16에서 소개되었습니다. 이 기능은 앱을 실행된 위치에서 무작위 위치로 이동시킵니다:


<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_44.png" />

```js
$TMPDIR/AppTranslocatiom/$UUID
```

번들된 파일에서만 작동합니다. quarantine 속성이 설정되어 있을 때에만 작동합니다. 상대 경로를 사용하여 앱이 외부 리소스를 불러오는 것을 방지합니다.

## QUARANTINE KEXT

<div class="content-ad"></div>

맥 앱 청구 규정이 파일에 부여된 quarantine 속성에서 시행되는 정책입니다. 그것의 완전히 해결된 이름은 com.apple.security.quarantine입니다. 위에서 보았듯이 사용자 모드에서는 _qtn_syscall*를 통해 통신됩니다.

그러나 이것이 유일한 방법은 아닙니다. 다른 시스템 작업 중에 quarantine 정책을 시행하는 커널 트랩(훅)도 있습니다.

커널 사이트에서 구현된 모든 훅 목록을 얻기 위해 이전 글에서 설명한 대로 커널 익스텐션 이진 추출을 할 수 있습니다:

그러나 Twitter에서 Csaba Fitzl이 가리키는 또 다른 방법이 있습니다.

<div class="content-ad"></div>


![랜덤 텍스트](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_45.png)

이 솔루션의 장점은 한 커널 익스텐션에서 운영할 수 있는 속도와 간결함입니다. 그러나 한 커널 익스텐션이 다른 익스텐션의 기능에 의존하는 경우 메모리 갭을 채울 수있는 ida64 kernelcache.decompressed를 사용하여 모든 kext를 한번에 로드하는 것이 좋습니다.

![랜덤 텍스트](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_46.png)

커널 디버그 키트에 대해 궁금하다면 여기에 소개했습니다:


<div class="content-ad"></div>

설치 후에는 다음 경로에서 kext를 찾을 수 있습니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_47.png)

```js
/Library/Developer/KDKs/*/System/Library/Extensions/
```

Ida에서 Quarantine.kext를 디컴파일하고 후크 심볼을 검색해 보겠습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_48.png" />

```js
# /Library/Developer/KDKs/KDK_14.5_23F79.kdk/System/Library/Extensions/Quarantine.kext/Contents/MacOS/Quarantine
_hook_cred_check_label_update_execve
_hook_cred_check_label_update
_hook_cred_label_associate
_hook_cred_label_destroy
_hook_cred_label_update_execve
_hook_cred_label_update
_hook_vnode_notify_truncate
_hook_vnode_notify_swap
_hook_mount_label_associate
_hook_mount_label_destroy
_hook_mount_label_internalize
_hook_policy_init
_hook_policy_syscall
_hook_proc_notify_exec_complete
_hook_vnode_check_deleteextarr
_hook_vnode_check_exec
_hook_vnode_check_setextattr
_hook_vnode_notify_create
_hook_vnode_notify_rename
_hook_vnode_notify_open
_hook_vnode_notify_link
```

## 추적 후크

아쉽게도 Apple Silicon에서는 lldb를 사용한 액티브 커널 디버깅 가이드를 제공할 수 없습니다. 그러나 dtrace를 사용하여 프로세스 실행 뒤의 후크 호출을 추적하는 방법을 찾았습니다:

<div class="content-ad"></div>

```js
#!/usr/sbin/dtrace -s
#pragma D option flowindent

// execve 또는 __mac_execve 시스템 호출이 입력될 때 추적 활성화
syscall::execve:entry { self->tracing = 1; }
syscall::__mac_execve:entry { self->tracing = 1; }
// execve 또는 __mac_execve 시스템 호출이 반환될 때 추적 비활성화 및 종료
syscall::execve:return { self->tracing = 0; exit(0); }
syscall::__mac_execve:return { self->tracing = 0; exit(0); }
// 추적이 활성화된 경우 시스콜 인수 출력
fbt::: /self->tracing/ {
    // 시스콜의 첫 번째 세 인수를 16진수 형식으로 출력
    printf("%x, %x, %x", arg0, arg1, arg2);
}
```

커널 공간에서 호출 스택 로그를 만들려면 SIP를 비활성화하고 root로 스크립트를 터미널에서 실행한 후 앱을 시작해야 합니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_49.png" />

출력을 확인해보면 hook_vnode_check_exec이 두 번 호출된 것을 볼 수 있습니다 (4번 발생하는 이유는 입력과 반환을 모두 나타내기 때문입니다).


<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_50.png)

The first occurrence is because of the Sandbox kext, which is a different implementation with the same name. We can see the difference in Ida:

![Image 2](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_51.png)

The second occurrence comes from Quarantine kext. It is called just after finishing the one from Sandbox kext. We can use this output to understand better how each function is called in order.


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_52.png)

아래 이미지는 앱을 열 때 지금까지 이러한 구성 요소가 상호 작용하는 고수준 개요를 보여줍니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_53.png)

## hook_vnode_check_exec


<div class="content-ad"></div>

디컴파일된 코드를 기반으로하면 해당 함수는 여덟 개의 인수를 가져야하지만, 일반적으로 처음 세 개만 사용됩니다. 나머지는 /bin/sh test.sh와 같은 인터프리터를 사용하여 스크립트를 실행할 때 예약됩니다 (이후 설명 예정).

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_54.png)

이전 DTrace 출력을 기반으로하면, hook_vnode_check_exec가 mac_vnode_check_exec 이후에 호출되며, 세 번째 인수가 0으로 설정되었습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_55.png)

<div class="content-ad"></div>

답을 찾으려면 a1과 a2 인수가 무엇인지 확인해야 합니다. 이를 위해 부모 함수 mac_vnode_check_exec를 확인할 수 있습니다. 우리는 보안 정책을 통해 확인한 do 반복문을 찾습니다(20번째 줄) 해당 후크 함수들을 호출합니다.

여기서 첫 번째 인자인 v37은 우리의 a1이기 때문에, 이는 vfs_context_t입니다. 그리고 a2는 실행 중인 파일의 vnode인 vp입니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_56.png)

여기서는 또한 a3~a8 인수에 대한 image_params에 대한 참조를 찾을 수 있습니다.

<div class="content-ad"></div>

## sandbox_enforce

sandbox_enforce은 격리가 강제로 적용되어야 하는지 여부를 결정합니다. 이 값이 1로 하드코딩되어 있는 것을 알 수 있습니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_57.png" />

만약 이 값을 0으로 설정하면, 함수가 즉시 반환되어 추가적인 격리 확인을 실행하지 않으며, 이는 격리가 강제되지 않는다는 것을 의미합니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_58.png)

이것은 하드코딩되어 있지만 sysctl을 사용하여 변경할 수 있습니다. 이 값을 Management Information Base (MIB)에서 찾을 수 있습니다:

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_59.png)

## apply_exec_quarantine의 이중 호출 미스터리


<div class="content-ad"></div>

apply_exec_quarantine 함수는 격리 관련 정책을 적용하고 그에 따라 파일이 실행 허용되어야 하는지 여부를 결정합니다.

![사진](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_60.png)

이 함수는 일반적인 상황에서는 한 번만 호출됩니다. 그러나 만약 첫 번째 결과가 0이 아니라면(격리가 강제 적용됨을 의미) 두 번 호출될 수 있으며, 또한 a3(ip_scriptvp)가 사용되었다면, 즉 인터프리터에서 실행된 스크립트(ip_vp로 설명됨)와 관련이 있다면 두 번 호출될 수 있습니다.

저는 간단한 bash 스크립트를 실행하여 whoami 명령을 실행하고 이전 DTrace 스크립트를 사용하여 추적한 실험을 진행했습니다.

<div class="content-ad"></div>

아래에서 볼 수 있듯이 apply_exec_quarantine이 두 번째 호출되었고, 이번에는 ip_scriptvp에 대한 참조가 포함되어 있습니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_62.png)

ip_scriptvp 필드는 스크립트 vnode를 가리키며, 시스템이 인터프리터와 별도로 스크립트 파일을 관리하고 참조할 수 있게 합니다.

<div class="content-ad"></div>

예리한 눈은 apply_exec_quarantine이 세 번째 호출되었음을 발견했습니다. 아마도 이는 스크립트에서 whoami 명령어를 확인하는 마지막 단계일 것입니다.

```js
# apply_exec_quarantine 체크 순서 (아마도):
/bin/sh
hello_script.sh
whoami
```
## quarantine_get_flags

apply_exec_quarantine의 맨 처음인 quarantine_get_flags에서는 quarantine 플래그를 가져옵니다. (a2는 우리가 실행하는 파일의 vnode을 가리키는 포인터입니다.)

<div class="content-ad"></div>

플래그를 추출한 후, 함수에서는 flag_retrival_status_code가 0이 아닌지 확인하는 오류 처리 로직이 16-23 라인에 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_63.png)

quarantine_get_flags 함수는 quarantine_getinfo를 호출하여 세미콜론으로 구분된 속성 데이터를 얻은 다음 quarantine_info_parse를 사용하여 이 데이터를 파싱하여 관련 플래그를 추출합니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_64.png)

<div class="content-ad"></div>

`quarantine_getinfo`은 대부분의 경우 `mac_vnop_getxattr`를 사용하여 확장 속성에서 vnode과 관련된 격리 메타데이터를 읽습니다:

또한 볼륨에 플래그 0x400이 설정되어 있지 않은지 확인할 수 있습니다. 그것은 전체 파일 시스템이 격리된 MNT_QUARANTINE으로 마운트되었음을 의미할 것입니다.

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_65.png)

`vfs_flags` (34번째 라인)은 `mount_t` 구조체에서 플래그를 검색하고, 비트마스크를 사용하여 특정 비트를 지웁니다 (`| MNT_VISFLAGMASK & MNT_CMDFLAGS`):

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_66.png" />

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_67.png" />

만약 위 작업으로 0x400 플래그를 반환하지 않으면(즉, 격리된 마운트된 볼륨에 있는 파일에 대해 작업하지 않음을 의미합니다) 파일 vnode에서 com.apple.quarantine 확장 속성과 관련된 데이터를 검색합니다.

## getxattr

<div class="content-ad"></div>

`mac_vnop_getxattr` 함수는 현재 VFS 컨텍스트를 검색하고 UIO 구조체를 설정한 다음 `vn_getxattr` 함수를 호출합니다.

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_68.png)

`vn_getxattr` 함수는 확장 속성이 vnode에서 지원되는지 확인하고(named stream은 getxattr을 지원하지 않음), MAC를 확인한 다음 속성 이름을 유효성 검사하고 읽기 확장 속성을 위해 vnode를 인가한 후 최종적으로 속성 데이터를 검색하는 `VNOP_GETXATTR`를 호출합니다.

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_69.png)

<div class="content-ad"></div>

VNOP_GETXATTR은 인수 구조체 a를 설정합니다. 5972번 라인에서는 vnop_getxattr_desc.vdesc_offset에 제공된 오프셋을 사용하여 vnode의 작업 벡터 v_op 내의 함수를 호출하고, 이때 인수로 구조체 a를 사용합니다:

![image1](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_70.png)

![image2](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_71.png)

여기에는 이 작업이 어떻게 작동할 수 있는지에 대한 간소화된 예제의 유사 코드도 있습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_72.png" />

## 격리된 볼륨의 플래그 기본 값

위에서 언급한 것처럼 대부분의 경우 getxattr이 사용됩니다(파일 시스템에 0x400 플래그가 mount_info에 설정되어 있지 않은 경우):

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_73.png" />

<div class="content-ad"></div>

제 경우에 해당하는 파일이 58번 라인의 격리된 볼륨에 있는 경우, vfs_mntlabel을 사용하여 파일 시스템에 마운트 레이블이 있는지 확인합니다.

- 마운트 레이블이 있는 경우, 해당 마운트 레이블에서 격리 플래그를 복사합니다.
- 마운트 레이블이 없는 경우, 기본 격리 정보를 사용합니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_74.png)

격리된 볼륨의 플래그에 대한 기본 값은 0x0001입니다.

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_75.png)

```js
0001;00000000;;
```

It allows the execution, but only from the terminal with SIP disabled:

![Image 2](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_76.png)


<div class="content-ad"></div>


![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_77.png)

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_78.png)

우리는 quarantine_get_flags 헤딩으로 돌아가 quarantine_info_parse에서 세미콜론으로 구분된 확장 어트리뷰트에서 플래그를 추출합니다:

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_79.png)


<div class="content-ad"></div>

## 격리 플래그 논리

저희는 qtn_flags를 검색한 후 apply_exec_quarantine으로 돌아가서 먼저 구문 분석 중에 오류가 없는지 확인합니다:

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_80.png)

플래그 추출 중에 오류가 발생한 경우 실행이 금지됩니다 (예외 코드 0x5D는 어떻게 설정되었는지 왜 설정되었는지 모르겠습니다):

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_81.png" />

하지만 터미널에서만 가능이에요!! 파일을 더블 클릭하거나 open을 사용해서 Finder에서 실행하면 실행이 안돼요 (SIP enabled):

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_82.png" />

연구에서 저와 가장 친한 친구인 ChatGPT와 함께 apply_exec_quarantine의 의사 코드를 조금 더 보기 쉽게 만들었어요. 저장소에서 찾아볼 수 있어요:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_83.png)

게이트키퍼가 격리 플래그에 따라 작동하는 흐름을 보여드립니다:

- 비트 1 (0x0002) 및 비트 2 (0x0004)가 설정되지 않은 경우 → 격리가 적용되지 않습니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_84.png)


<div class="content-ad"></div>


![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_85.png)

- If Bit 2 (0x0004) is set, quarantine is enforced immediately.

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_86.png)

![Image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_87.png)


<div class="content-ad"></div>

계속하기 전, require_user_approved_exec는 기본적으로 1로 설정되어 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_88.png)

sandbox_enforce와 같이 sysctl을 사용하여 MIB에서 이를 확인할 수 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_89.png)

<div class="content-ad"></div>

- 만우절(0x0040)이 설정되어 있으면 → 격리가 강제되지 않습니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_90.png)

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_91.png)

라인 80의 컨텍스트는 vfs_context_t입니다. 처음에 a1로 hook_vnode_check_exec에 전달되었습니다. vfs_context에 대해 더 많이 알려면 OS Internals II(230쪽)를 참조하십시오. 다른 기사에서 자세히 다루겠습니다.

<div class="content-ad"></div>

다음 체크는 아마도 App Translocation과 관련이 있을 것으로 예상됩니다. 왜냐하면 해당 볼륨은 읽기 전용으로 마운트되어 있습니다. 만약 mount_flags 비트 0이 설정되어 있다면, 우리는 읽기 전용 볼륨을 다룹니다.

- 읽기 전용 볼륨에서 파일이 실행된 경우 → 검역(Quarantine)이 꺼져 있습니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_92.png)

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_93.png)

<div class="content-ad"></div>

- 만약 MAC 레이블이 설정되지 않은 경우 → 격리 모드가 꺼져 있습니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_94.png)

MAC 레이블은 MACF 정책에서 사용되는 구조체로, 프로세스의 권한을 정의하는 곳입니다. MACF 기반 메커니즘(예: amfi)을 위한 프로세스의 권한을 정의하며, ucred 자격 증명 구조체의 오프셋 0x78에서 찾을 수 있습니다.

- 레이블 검색(mac_label_get)이 실패한 경우 → 격리 모드가 강제됩니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_95.png)

여기서 우리가 검색한 정책 번호를 가져 오지 못했습니다. label_slot은 동적으로 설정됩니다 (Ida에서는 0으로 설정됨), 이것이 Syspolicy인지 아무도 모릅니다.

잔여 로직은 label_flags (offset 56의 라벨 데이터의 값)의 1 비트 (0x02)가 설정되었는지 확인합니다 → 격리가 강제됩니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_96.png)


<div class="content-ad"></div>

그렇지 않다면, label_flags의 비트 1이 꺼져 있다면 → 격리가 강제되지 않습니다.

# 시스템 정책

이전에 설명한 논리에 대한 레이블을 설정할 수 있다고 생각했지만 실험 중에 백리스트 파일들을 거부하는 spctl 함수가 없다는 것을 알게 되었습니다.

이 논리와 충돌이 발생할 수 있으므로, 레이블이 존재하는지 여부를 확인하여 격리를 강제하는 논리를 검사하고, 레이블이 없으면 파일을 실행할 수 있도록 허용합니다.

<div class="content-ad"></div>

이 가정을 확인하기 위해 그러한 시나리오를 시뮬레이션해 보았습니다. 아래는 Hi.app 레이블을 설정하여 syspolicyd에서 활성화하는 내 시도를 보여주는 화면입니다.

격리 속성에는 2번째와 6번째 비트가 끄여져 있습니다 (0b10000010) 그리고 앱은 읽기 전용 볼륨에서 실행되므로 이를 이동시키고 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_97.png)

이것은 Syspolicyd에서 앱이 화이트리스트에 올라가 있더라도 위의 apply_exec_quarantine 논리 때문에 실행되지 않음을 증명합니다.

<div class="content-ad"></div>

아마 LaunchServices 목적을 위해 spctl 화이트리스트 앱을 사용하는 것 때문이지 않을까 싶어요. 나중에 활성화된 quarantine 로직 검사를 일으키는 것입니다.

## 시스템 정책 데이터베이스

게이트키퍼 설정은 시스템 정책 데이터베이스에 저장되어 있어요. 이 데이터베이스는 syspolicyd가 시행하는 정책을 담당하는 루트 소유의 데이터베이스입니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_98.png)

<div class="content-ad"></div>


```js
/private/var/db/SystemPolicy
```

데이터베이스 안에는 Gatekeeper (GKE) 규칙이 많이 들어 있을 수 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_99.png)

```js
sudo sqlite3 /private/var/db/SystemPolicy "SELECT requirement,allow,disabled,label from authority where label = 'GKE';"
```    


<div class="content-ad"></div>

이 Code Directory 해시 (cdhash)는 다음에서 가져옵니다:

```js
/var/db/SystemPolicyConfiguration/gke.bundle/Contents/Resources/gke.auth
/var/db/gke.bundle/Contents/Resources/gk.db
/var/db/gkopaque.bundle/Contents/Resources/gkopaque.db
```

사용자 정의 규칙을 데이터베이스에 추가하려면 spctl 대신 시스템 정책 규칙 형식을 사용할 수 있습니다. Tom Bridge의 '구성 프로필을 사용한 시스템 정책 데이터베이스 조작'에서 자세히 설명되어 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_100.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_101.png" />

커스텀 프로필을 추가한 후에 아래 쿼리를 실행하여 해당 프로필을 볼 수 있습니다:

```js
// 정책 데이터베이스에서 권한 보기
sudo sqlite3 /private/var/db/SystemPolicy "SELECT requirement, allow, disabled, label FROM authority WHERE label != 'GKE' AND disabled=0;"
```

문제가 발생했을 때는 --reset-default 옵션을 사용하여 이 데이터베이스를 기본값으로 재설정할 수 있습니다 (man spctl에 나와 있음):

<div class="content-ad"></div>

아래는 가져올 수 있는 테이블 태그의 명단입니다:

```css
.*<table>.*
```

언제든지 도움이 필요하시면 알려주세요!

<div class="content-ad"></div>

```js
sudo cp /var/db/.SystemPolicy-default /var/db/SystemPolicy
```

## 시스템 정책 데몬

저는 이 데몬에 대해 자세히 다루지는 않겠어요. 20분 전에 글이 이미 너무 길어져버렸거든요 :D 그래도, man syspolicyd와 해당 위치에 대한 간단한 소개는 여기 있어요:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_104.png)

<div class="content-ad"></div>

```js
/usr/libexec/syspolicyd
```

## 시스템 정책 관리자 (spctl)

게이트키퍼와 상호작용하는 명령어 목록입니다:

```js
# GateKeeper 상태 확인
spctl --status

# GateKeeper 규칙 확인
sudo spctl --list

# GateKeeper 비활성화
spctl --global-disable
spctl --master-disable

# GateKeeper 활성화
spctl --global-enable
spctl --master-enable

# 앱 격리
xattr -w com.apple.quarantine "0001;$(printf %x $(date +%s));crimson;$(/usr/bin/uuidgen)" app_name

# 앱 검역 해제
codesign --sign - --force --deep app_name
xattr -d com.apple.quarantine app_name

# 앱 허용
spctl --add --label "gke_whitelist" app_name
spctl --enable --label "gke_whitelist"
spctl --disable --label "gke_whitelist"
spctl --remove --label "gke_whitelist"

# 규칙 초기화
sudo spctl --reset-default
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_105.png)

# XProtect

앱을 실행할 때 알려진 악성 코드 데이터베이스와 대조하여 일치하는 것이 실행되지 않도록하기 위해 격리가 설정되어 있는지 여부에 관계없이 확인합니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_106.png)


<div class="content-ad"></div>

아래는 Markdown 형식의 표입니다: 

그것은 모든 XProtect 데이터베이스 업데이트에서도 실행되며 아래 명령을 사용하여 수동으로 실행할 수 있습니다. 그러나 sudo 없이는 현재 사용자의 컨텍스트에서 스캔이 실행되므로 모든 위치를 스캔하지 않을 수 있습니다:

```js
/Library/Apple/System/Library/CoreServices/XProtect.app/Contents/MacOS/XProtect
```

디렉토리 안에는 Yara 규칙 외에 XProtect에서 사용하는 스캐너인 모든 remediators 바이너리 파일을 찾을 수 있습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_108.png" />

```js
/Library/Apple/System/Library/CoreServices/XProtect.app/Contents/MacOS/
```

XProtect가 사용하는 Yara 규칙 및 기타 파일은 다음 디렉토리에서 찾을 수 있습니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_109.png" />

<div class="content-ad"></div>

```js
/Library/Apple/System/Library/CoreServices/XProtect.bundle/Contents/Resources/
```

Apple은 XProtect 및 해당 데이터베이스를 업데이트하며, 각 업데이트 시 스캔이 수행됩니다. 최근 업데이트를 확인할 수 있습니다:

```js
system_profiler SPInstallHistoryDataType 2>/dev/null | grep -A 4 "XProtectPlistConfigData" | tail -n 5
```

## gk.db


<div class="content-ad"></div>

데이터베이스에는 실행 파일의 해시 및 블랙리스트 팀 ID가 저장되어 있습니다. Gatekeeper에 대해 이야기할 때 다른 곳에서 동일한 이름을 본 적이 있습니다. 그러나 이 두 데이터베이스는 다릅니다:

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_110.png)

이 데이터베이스는 XProtect에서 사용되지 않으며, 이름이 시사하는 대로 Gatekeeper에서 사용되는 것이 아니라, 사실은 syspolicyd에서 사용됩니다.

![image](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_111.png)

<div class="content-ad"></div>

## XProtect.meta.plist

이 파일은 Safari 확장 프로그램 및 오래된 애플리케이션 플러그인의 블랙리스트입니다:

![SnakeAppleVIIAntivirus_112](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_112.png)

검출은 CFBundleIdentifier 및 개발자 ID를 기반으로 합니다.

<div class="content-ad"></div>

`<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_113.png" />`

Code Signature IDs에 대한 블랙리스트도 있습니다:

`<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_114.png" />`

Java 구성 요소의 최소 버전이 지정되었습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_115.png)

또한, 각 플러그인의 최소 버전:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_116.png)

## LegacyEntitlementAllowlist.plist


<div class="content-ad"></div>

이것은 레거시 엔터티틀먼트를 사용할 수 있는 이진 파일들의 cdhashes가 base64로 인코딩된 매우 긴 목록입니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_117.png)

## XProtect.yara

Adload, Dok, HiddentLotus 등의 유명한 악성 코드와 연관된 Yara 규칙을 포함하고 있습니다. 이 규칙들은 MACOS_644e18d와 같이 숨겨진 형식으로 명명됩니다.

<div class="content-ad"></div>


![SnakeAppleVIIAntivirus](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_118.png)

## XProtect.plist

XProtect.plist은 파일을 차단하는 강력한 규칙 목록이며, URI, 파일 유형, 크기, 이름 및 서명을 기반으로합니다. 아래는 그런 규칙 중 하나인 OSX.28a9883(가령 숨겨진 악성 코드 이름)의 예시입니다:

```js
<dict>
	<key>Description</key>
	<string>OSX.28a9883</string>
	<key>LaunchServices</key>
	<dict>
		<key>LSItemContentType</key>
		<string>com.apple.application-bundle</string>
	</dict>
	<key>Matches</key>
	<array>
		<dict>
			<key>MatchFile</key>
			<dict>
				<key>NSURLTypeIdentifierKey</key>
				<string>public.unix-executable</string>
			</dict>
			<key>MatchType</key>
			<string>Match</string>
			<key>Pattern</key>
			<string>3A6C6162656C3A706C697374506174683A</string>
		</dict>
		<dict>
			<key>MatchFile</key>
			<dict>
				<key>NSURLTypeIdentifierKey</key>
				<string>public.unix-executable</string>
			</dict>
			<key>MatchType</key>
			<string>Match</string>
			<key>Pattern</key>
			<string>3A62696E3A706C6973743A</string>
		</dict>
		<dict>
			<key>MatchFile</key>
			<dict>
				<key>NSURLTypeIdentifierKey</key>
				<string>public.unix-executable</string>
			</dict>
			<key>MatchType</key>
			<string>Match</string>
			<key>Pattern</key>
			<string>214023247E5E262A28295B5D7B7D3A3B3C3E2C2E31713277336534723574367937753869396F3070415A5358444346564742484E4A4D4B4C5157455254595549</string>
		</dict>
	</array>
</dict>
<dict>
```


<div class="content-ad"></div>

- LauchServices — 시그니처를 트리거하는 URI 유형을 정의합니다.
- LSItemContentType — LauchServices를 위한 콘텐츠 유형 값입니다.

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_119.png" />

```js
xmllint --format XProtect.plist | grep -A 1 '<key>LSItemContentType</key>' | grep '<string>' | sed -E 's/.*<string>(.*)<\/string>.*/\1/' | sort -u
```

- Matches — 탐지 시그니처 패턴을 포함하는 사전 배열입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_120.png" />

- MatchFile — 파일 타입(NSURLTypeIdentifierKey), 크기(NSURLFileSizeKey), 이름(NSURLNameKey), 파일 다운로드 중인 파일의 콘텐츠 유형(LSDownloadContentTypeKey) 및 확인되는 시그니처 패턴에 대한 정보입니다.

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_121.png" />

```js
xmllint --xpath '//key[text()="MatchFile"]/following-sibling::dict/key/text()' XProtect.plist | sort -u
```

<div class="content-ad"></div>

## 로깅

언제나처럼, 우리는 로그 스트림을 사용하여 XProtect라는 이름을 가진 모든 레코드를 필터링할 수 있습니다. Console.app을 사용하거나 아래 명령어를 사용하여 백트레이스를 볼 수도 있습니다:

```js
log show -info -backtrace -debug -loss -signpost -predicate 'subsystem == "com.apple.xprotect"'
```

Console에서 앱의 시작 시 검역 및 xprotect 문자열을 검색할 때 XProtectService가 Yara 규칙을 사용하고 malwareCheckEnded를 통해 CoreServicesUIAgent에서 초기화된 악성 코드를 스캔하는 것을 확인할 수 있습니다.

<div class="content-ad"></div>

Xprotect 유효성 검사가 설정된 방지 속성이 없는 파일들에 대해서도 작동하는 가정을 확인할 수도 있습니다. 아래 실험에서는 앱을 다운로드하고 전체 번들에서 속성을 삭제했습니다 (어떤 이유로 xattr의 재귀 옵션이 동작하지 않았습니다 -r):

```js
for f in $(fd . Hello.app); do xattr -d 'com.apple.quarantine' $f ; done
```

터미널을 통해 다운로드한 파일에 방역 속성이 추가되지 않기 때문에 curl 또는 wget을 사용하여 앱을 다운로드할 수도 있습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_122.png)

<div class="content-ad"></div>

```js
wget -nH -np -R "index.html*" -r "http://de.afine.com:1234/Hello.app/" >/dev/null 2>&lt;1
```

그러나 다운로드 후에 앱의 권한이 변경되어 실행할 수 없습니다. 이를 방지하기 위해 zipped 앱을 다운로드할 수 있습니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_123.png" />

위의 경우 XProtect가 작동하지 않는 것으로 보입니다. 파일이 실행되지 않습니다. 권한을 원래대로 변경해야 합니다 (실행 권한으로 변경):

<div class="content-ad"></div>

```js
chmod 755 Hello.app/Contents/Info.plist Hello.app/Contents/MacOS/HelloApp Hello.app/Contents/PkgInfo Hello.app/Contents/_CodeSignature/CodeResources
```

## CoreSerivcesUIAgent

이것은 CoreService Framework의 일부이며 백그라운드에서 작동하며 사용자 인터페이스 요소를 처리합니다. 예를 들어 보안 대화 상자:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_124.png" />


<div class="content-ad"></div>

앱에서 quarantine 속성이 없는 경우, Console 로그에서 CoreServicesUIAgent의 호출을 볼 수 없습니다. 왜냐하면 UI가 관련되지 않았기 때문입니다. quarantine 속성이 설정된 경우, 최종 흐름은 다음과 같습니다:

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_125.png)

## Eicar 테스트

XProtect가 가짜 악성 코드에서 작동하는지 확인하기 위해 /tmp 디렉토리에 eicar 파일을 준비하고 XProtect를 실행하여 스캔을 수행할 수 있습니다.

<div class="content-ad"></div>

```js
# 샘플 준비
echo -n 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' >/tmp/eicar
# 다른 터미널에서 로그 기록 시작하기:
sudo eslogger xp_malware_remediated | jq .
# 스캔 시작
/Library/Apple/System/Library/CoreServices/XProtect.app/Contents/MacOS/XProtect
```

/tmp에서 eicar가 성공적으로 제거되었음을 확인할 수 있습니다:

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_126.png" />

## 악성 코드 생성자 테스트


<div class="content-ad"></div>

앱에서는 $HOME/Library/Containers/macmini.eicar-app/Data/Documents/eicar.com에 eicar 파일을 생성합니다.

```js
import SwiftUI

구조 ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, World!")
        }
        .padding()
        .onAppear {
            createEicarFile()
        }
    }
    
    func createEicarFile() {
        let eicarString = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"
        let fileName = "eicar.com"
        
        // 문서 디렉토리의 URL 가져오기
        if let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            let fileURL = documentDirectory.appendingPathComponent(fileName)
            
            do {
                // EICAR 문자열을 파일에 쓰기
                try eicarString.write(to: fileURL, atomically: true, encoding: .utf8)
                print("EICAR 테스트 파일이 \(fileURL.path)에 생성되었습니다.")
            } catch {
                print("EICAR 테스트 파일 생성 실패: \(error)")
            }
        }
    }
}
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

- 파일 시스템에서 실행할 때 XProtect는 함수 내부의 eicar 문자열에도 불구하고 아무 것도 표시하지 않습니다.
- 생성된 eicar.com 파일은 XProtect 스캔에 감지되지 않을 것입니다.
- tmp 디렉토리가 아닌 eicar.com을 생성해도 XProtect 스캔에서 감지되지 않습니다.

이는 XProtect 스캔에서 사용되는 XProtectRemediatorEicar이 특정 경로와 이름만 확인하기 때문입니다. 일반적인 악성 코드로는 시도하지 않겠지만, 나머지 리미디에이터에 대해서도 비슷하거나 동일할 것이다.

<div class="content-ad"></div>

# GKE 바이패스

게이트키퍼(Gatekeeper)는 기본 보안 설정에서 앱 스토어 외부에서 macOS로 전송된 모든 파일의 실행을 금지해야 합니다.

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_127.png)

맥OS로 전송된 앱 스토어 외부에서 유효하게 노터라이즈(notarized)된 앱에도 동일하게 적용됩니다. 그렇지 않으면 게이트키퍼 바이패스로 간주됩니다.

<div class="content-ad"></div>

게이트키퍼 우회 방지에 대한 간단한 설명을 제공하려고 했지만, 그 대신 이를 대신할 훌륭한 기사를 발견했습니다. 아래 화면은 해당 기사에서 빌려왔습니다:

![SnakeAppleVIIAntivirus_128.png](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_128.png)

# 마지막으로

이 기사의 결과로 'CrimsonUroboros'의 특성을 조작하고 쿼리하는 몇 가지 기능만 작성했습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SnakeAppleVIIAntivirus_129.png" />

그런데, 저는 "Antivirus Trinity"에서 문제점을 발견했고, 이를 Apple에 보고했습니다. 이 중 하나는 흥미로운데, 나중에 설명할 기회를 얻으면 좋겠네요.

이 주제를 아직 다 다룬 것은 아닙니다. 이것은 단지 Apple 악성 코드 방지 시스템에 대한 소개에 불과합니다. 시작점으로 활용하시기 바랍니다.

## 참고문헌

<div class="content-ad"></div>

여기서 논의된 주제에 대한 링크 목록이 있습니다. 내 의견으로는 첫 번째 세 가지가 특별한 주목을 받을 가치가 있다고 생각합니다:

- Jonathan Bar Or의 "macOS 게이트키퍼의 약점"
- Csaba Fitzl의 "게이트키퍼 - 우회 또는 우회 안 함"
- Patrick Wardle의 "게이트키퍼 노출"
- Patrick Wardle의 "기쁨의 번들"
- Jonathan Levin의 "Launchd - 당신의 서비스에"
- macOS 보안의 발전 - WWDC19
- "번역 요망!? (CVE-2021–30853)" - Objective-See의 블로그
- Howard Oakley의 "macOS는 기회가 있을 때마다 악성 소프트웨어를 스캔합니다"
- Stuart Ashenbrenner의 "dmXProtect: 열기 전에 악성 소프트웨어를 중단하고 매장을 오픈하지 않습니다"

![이미지](/assets/img/2024-06-30-SnakeAppleVIIAntivirus_130.png)

## 다음은 무엇인가요?

<div class="content-ad"></div>

다가오는 기사에서는 최근 여러 번 나온 보안 확장 프로그램인 Sandbox를 탐구할 것입니다.

만약 이 기사를 즐겼다면, 공유해 주시기 바랍니다. 제안 사항이 있거나 버그를 발견했다면 댓글로 알려주세요.