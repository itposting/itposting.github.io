---
title: "맥OS 앱을 업데이트하는 데 도움이 되는 무료 앱들을 소개합니다"
description: ""
coverImage: "/assets/img/2024-06-20-KeepyourmacOSappsupdatedwiththesefreeapps_0.png"
date: 2024-06-20 14:34
ogImage: 
  url: /assets/img/2024-06-20-KeepyourmacOSappsupdatedwiththesefreeapps_0.png
tag: Tech
originalTitle: "Keep your macOS apps updated with these free apps"
link: "https://medium.com/@ulysess/keep-your-macos-apps-updated-with-these-free-apps-1c5983e2ea99"
---


![image](/assets/img/2024-06-20-KeepyourmacOSappsupdatedwiththesefreeapps_0.png)

저는 제 macOS 소프트웨어에 문제가 있어요, 아마도 그게 병일지도 몰라요. 원인:

내 모든 앱을 최신 상태로 유지해야 해요

많은 앱을 가지려 하지 않지만, 설치한 앱들은 최신 업데이트가 필요해요. 어떻게 해야 할까요? 그 임무를 도와주는 앱들이 있어요. 어떤 앱들인지 알고 싶나요? 계속 읽어보세요!

<div class="content-ad"></div>

# 최신 정보

![최신 정보 이미지](/assets/img/2024-06-20-KeepyourmacOSappsupdatedwiththesefreeapps_1.png)

최신 정보는 모든 앱이 최신 상태인지 확인해 주는 무료 오픈 소스 앱입니다. 설치된 모든 앱과 최신 버전을 보여주는 간단한 앱입니다.

한 번에 한 번의 클릭으로 업데이트하거나 하나씩 업데이트할 수 있습니다. Mac App Store에서 다운로드한 앱과 업데이트를 위해 Sparkle을 사용하는 앱을 지원하며, 시장의 대부분의 앱을 커버합니다.

<div class="content-ad"></div>

앱이 지원되지 않을 경우 Latest를 통해 앱을 열어 수동으로 업데이트를 확인할 수 있습니다.

링크: [github.com](github.com) ` Latest

# Cork

![이미지](/assets/img/2024-06-20-KeepyourmacOSappsupdatedwiththesefreeapps_2.png)

<div class="content-ad"></div>

그것은 홈브루 앱을 빠르게 관리할 수 있는 GUI입니다!

과거에는 터미널을 사용하여 앱을 업데이트했지만, Cork를 사용하면 한 번의 클릭으로 처리할 수 있습니다 (심지어 터미널을 사랑해도요).

유료 앱이지만 무료로 컴파일하고 사용할 수 있는 기회가 있습니다. 시각적으로 홈브루 앱을 관리할 수 있는 다른 다양한 기능을 제공합니다: 검색, 수정, 설치, 삭제,...

그냥 잘 작동합니다 & 앱을 최신 상태로 유지하는 훌륭한 도구입니다. 점.

<div class="content-ad"></div>

링크: github.com ` Cork

# macOS용 Python 정리 스크립트

![이미지](/assets/img/2024-06-20-KeepyourmacOSappsupdatedwiththesefreeapps_3.png)

mac-cleanup-py는 macOS용 강력한 정리 스크립트입니다. 다음 작업에서 도움을 줍니다: 휴지통 비우기, 불필요한 로그 및 파일 삭제, OS 또는 일부 앱에서 캐시 지우기. Xcode나 Android Studio와 같은 특정 앱들을 지우도록 설정할 수 있습니다. 실행하기 전에 무엇을 할 지 미리 보는 매우 유용한 dry 모드가 있습니다.

<div class="content-ad"></div>

링크: github.com ` mac-cleanup-py

# 사용자 정의 함수

저는 모든 개발자가 자신의 .*rc 파일에 가져야 할 것 같은 간단한 함수가 있다고 생각해요: 설치된 앱들의 업데이트 가능 여부를 확인하는 함수. 예를 들어, 저는 이 함수를 제 .zshrc 파일에서 사용해요:

```js
update_all() {
    if [[ -f /usr/local/bin/composer ]]; then
        composer self-update
        composer global update
    fi

    softwareupdate --all --install --force
    brew outdated && brew update && brew upgrade && brew cleanup
    ## 여기에 본인 것을 추가하세요!
}
```

<div class="content-ad"></div>

# 결론

이제 macOS를 최신 상태로 유지할 핑계는 없어졌어요. 물론 수동 방식을 계속 사용할 수 있지만, 이러한 앱들을 사용하면 더 적은 시간 안에 프로세스를 더 잘 제어할 수 있어요. 당신은 이 목적을 달성하기 위해 다른 앱을 사용하나요? 알려주세요! 😃

이 기사는 라즈베리 파이, 리눅스, macOS, 데브옵스, 개발과 같은 주제에 관한 뉴스/튜토리얼을 읽을 수 있는 블로그 misapuntesde.com에서 처음으로 발행되었습니다. 저는 취직을 찾고 있으니 제 LinkedIn 프로필을 방문해주세요! 감사합니다!