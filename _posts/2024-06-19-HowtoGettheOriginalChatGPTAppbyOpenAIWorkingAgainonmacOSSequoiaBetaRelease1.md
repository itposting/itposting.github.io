---
title: "맥OS Sequoia 베타 릴리스 1에서 OpenAI의 원본 ChatGPT 앱을 다시 작동시키는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoGettheOriginalChatGPTAppbyOpenAIWorkingAgainonmacOSSequoiaBetaRelease1_0.png"
date: 2024-06-19 01:04
ogImage: 
  url: /assets/img/2024-06-19-HowtoGettheOriginalChatGPTAppbyOpenAIWorkingAgainonmacOSSequoiaBetaRelease1_0.png
tag: Tech
originalTitle: "How to Get the Original ChatGPT App by OpenAI Working Again on macOS Sequoia Beta Release 1"
link: "https://medium.com/@kristoffer.sodersten/how-to-get-the-original-chatgpt-app-by-openai-working-again-on-macos-sequoia-beta-release-1-e7b03f5b9257"
---


소개

애플은 WWDC 2024에서 발표한 macOS 15의 최신 베타 버전인 "Sequoia"를 개발자 베타로 제공했습니다. 공개 베타 버전은 이번 여름 후반에 나오고, 최종 버전은 2024년 가을에 제공될 예정입니다.

macOS 15 Sequoia의 새로운 기능

macOS 15 Sequoia는 여러 가지 새로운 기능과 개선 사항을 소개했습니다.

<div class="content-ad"></div>

- 아이폰 미러링: 사용자가 맥을 통해 아이폰을 미러링하고 상호작용할 수 있게 해주며 키보드와 마우스를 사용하여 아이폰 앱을 제어할 수 있습니다.
- Safari 기능 업그레이드: "하이라이트"와 같은 기능을 통해 기계 학습을 사용하여 웹 페이지에서 관련 정보를 강조하고, 기사에 대한 요약과 목차를 제공하는 최신 "리더" 기능 등이 있습니다.
- 창 타일링: 화면에 창을 자동으로 정리하여 멀티태스킹이 더 편리해집니다.
- 암호 앱: 키체인을 대체하는 새로운 앱으로, 암호와 보안 키를 Apple 기기 전반에 걸쳐 관리하고 동기화하기 쉽게 합니다.
- AI 및 기계 학습: Safari, Siri 및 노트와 같은 기능을 향상시키기 위해 AI를 더 깊게 통합한 것으로, Apple Intelligence와 OpenAI ChatGPT 4.0을 활용합니다.

macOS Sequoia는 Apple 실리콘 (M1, M2 등)을 탑재한 모든 기기와 iMac Pro (2017) 및 MacBook Pro (2018)과 같은 일부 오래된 인텔 기반 모델과 호환됩니다.

호환성 문제

첫 사용자이자 개발자로서 저는 기술의 최전선에 머무르려고 항상 노력합니다. 그러나 이번에는 OpenAI가 개발한 음성 채팅 기능이 포함된 ChatGPT 앱이 ChatGPT 로고만 있는 링크로 대체되었습니다. 처음에는 이것이 Apple과 OpenAI 사이의 통합의 일환인 줄 알았지만, 실망스러운 사실을 발견하게 되었습니다. 게다가, 저의 이전에 사용하던 기능적인 앱이 삭제되었습니다.

<div class="content-ad"></div>

해결책

ChatGPT를 일찍 사용한 충실한 고객으로서, 베타 버전에 일찍 접속할 수 있었는데, 그 때는 완벽히 작동했어요. 이메일 아카이브를 절반 시간 동안 검색해보았지만, 포함된 베타 버전의 이메일을 찾을 수 없었어요.

그 후 온라인으로 검색하여 OpenAI의 다운로드 페이지를 찾았어요: OpenAI ChatGPT 다운로드.

다운로드는 원활히 진행되었지만, 앱을 설치하려고 할 때 문제가 발생했어요. macOS에서 ChatGPT_Desktop_public_latest.dmg 파일을 열 수 없었습니다. 대신 DAEMON Tools를 사용하여 이미지를 열어야 했어요. 그러면 앱을 Applications 폴더로 끌어다 놓을 수 있었어요. 이전 앱을 덮어쓸 것인지 확인하는 메시지가 나왔을 때, 그렇게 하려고 했지만 작동하지 않았어요. 기능이 있는 이전 앱을 추가하기 위해 둘 다 유지하도록 수락해야 했어요.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-HowtoGettheOriginalChatGPTAppbyOpenAIWorkingAgainonmacOSSequoiaBetaRelease1_0.png)

결론

이 문제는 향후 업데이트로 해결될 것으로 예상되지만, 현재로서는 제가 찾은 해결책입니다. 이 가이드가 동일한 문제를 겪을 수 있는 다른 사람들에게 도움이 되고, 작동 중간 솔루션을 찾는 데 내가 소비한 시간을 절약해 드리기를 바랍니다.

행동 요구

<div class="content-ad"></div>

비슷한 문제를 겪은 적이 있거나 추가 팁이 있다면, 아래 댓글에 여러분의 경험을 공유해 주세요. 함께 macOS 업그레이드를 최대한 활용하도록 서로 도와줍시다!