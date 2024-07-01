---
title: "PTPL 110 macOS  수정 키를 쉽게 입력하는 방법"
description: ""
coverImage: "/assets/img/2024-07-01-PTPL110HowtoEasilyTypemacOSModifierKeys_0.png"
date: 2024-07-01 17:25
ogImage: 
  url: /assets/img/2024-07-01-PTPL110HowtoEasilyTypemacOSModifierKeys_0.png
tag: Tech
originalTitle: "PTPL 110: How to Easily Type  macOS ⌘ Modifier Keys"
link: "https://medium.com/produclivity/ptpl-110-how-to-easily-type-macos-modifier-keys-1356e753a8c6"
---


## 일반 텍스트; 적은 종이 — 생산성 다이제스트

![이미지](/assets/img/2024-07-01-PTPL110HowtoEasilyTypemacOSModifierKeys_0.png)

이번 주는 macOS 수정자 키를 입력하는 간단한 두 가지 방법에 대해 이야기하고, Obsidian 플러그인 CalcCraft에서 겪고 있는 문제에 대해 보고합니다. 그리고 명령 줄 학습 4주차입니다.

여기에는 인공 지능이 없습니다. 모든 말과 아이디어, 결함은 모두 100% 인간이 만들었습니다. 유료 구독자들은 매우 격려를 줘서 글쓰는 것을 돕지만, 비구독자들도 언제든지 무료로 읽을 수 있습니다.

<div class="content-ad"></div>

## 쉽게  macOS 수정자 키를 입력하는 방법 ⏎

이 Keyboard Maestro 매크로는 macOS 수정자 키를 입력하는 데 도움이 됩니다. 마음껏 사용하여 상사와 친구들을 감탄시키세요 (또는 짜증내게 만드세요)! (오, 가능성이 매우 많아요... ⌥⌥ 가 부족해요! 나의 펜을 ⌘합니다. 나는 ⌃에 괴로워합니다!)

Keyboard Maestro를 사용하지 않는 Mac 사용자라면, 꼭 알아보길 권장합니다. 가성비가 좋지만 절대로 후회하지 않을 것입니다.

나는 프로그래머는 아니지만, Keyboard Maestro에서 간단한 자동화를 성공적으로 설정하여 반복되는 작업을 훨씬 빠르고 즐겁게 처리할 수 있었습니다. 어플리케이션 주위에는 어떻게 작동하는지 배우고 이와 같은 매크로를 다운로드할 수 있는 좋은 커뮤니티가 있습니다. (이 매크로는 HTML 문자 옵션도 제공합니다.)

<div class="content-ad"></div>


![image](/assets/img/2024-07-01-PTPL110HowtoEasilyTypemacOSModifierKeys_1.png)

당연히 Apple 기기에 내장된 키보드 단축키를 사용하여 동일한(그렇게 멋지지는 않지만) 결과를 얻을 수 있습니다. iOS와 Mac에서 기호를 필요로 할 경우 이 방법을 권장합니다.

## 데이터를 신뢰하기 전에 CalcCraft 플러그인에 대해 알아야 할 두 가지

저는 CalcCraft 플러그인이 Obsidian에서 간단한 스프레드시트를 실행하는 완벽한 방법이라고 생각했지만, 지난 달에 여러 번 날렵히 했다. 다음 내용이 동일한 문제를 피하는 데 도움이 되기를 바랍니다.


<div class="content-ad"></div>

데이터 손상
최근 50개 이상의 행을 가진 내 테이블(각 행의 마지막 열에 계산이 들어 있음)이 데이터 손상을 겪었습니다. 정말 이상한 일이었어요! 한 순간에는 괜찮아 보였는데, 그 다음 순간에는 많은 추가 열이 생기고 데이터가 섞여 있었어요. Obsidian Sync 덕분에 Obsidian 보관고의 버전 백업이 있어서 쉽게 문제를 해결할 수 있었습니다. 발생해서 좋은 일은 아니었지만, 두 번이나 일어났어요.

이 문제가 CalcCraft 자체에 문제가 있는지, 아니면 다른 플러그인과 충돌하는 등의 외부 문제가 있는지 알 수 없어요.

해결책: 플러그인을 완전히 사용 중지하거나 숫자를 확인해야 할 때에만 공식을 삭제해 보세요. (목적엔 어긋나지만, 해결방안 중 하나일지도요?)

물론 쿠미코의 예산 관리 시스템은 플러그인 없이도 따라갈 수 있어요. Markdown 테이블(인쇄하여 하이라이트 처리할 수 있는)은 종이에 손으로 쓰는 것보다 선호되는 이유가 있어요. 열을 재정렬하고 엉망으로 만들었을 때 다시 출력할 수 있기 때문이죠.

<div class="content-ad"></div>

좀 더 편리하게 하려고 마크다운 테이블 형식에서 단순한 재무 기록을 Numbers로 옮겼어요. 만약 나도 Kumiko가 주장하는 수동 예산 편성 방법에 따라 디지털화만 하려 했다면, 마크다운 테이블이 아주 적합했을 거에요. 지금 하는 건 특별한 예산 앱을 사용하지 않아 여전히 수동이긴 하지만, 계산을 자동화 할 필요를 느끼지 않아요.

라인 넘버
가족 구성원이 보관 상자 안에 무엇이 있는지 추적하도록 돕기 위해 Obsidian에 간단한 테이블을 만들었어요. 수정 모드에서 테이블이 멋있게 보였지만 PDF 내보내기 시에 행과 열 번호가 표시됐어요. CalcCraft 플러그인 설정이 아닌, Minimal 테마 설정이 아니라 CalcCraft 플러그인 설정을 변경해야 하는 줄 알기까지 꽤나 많은 시간과 답답함이 필요했어요!

교훈: 플러그인 설정을 변경할 때 주의하세요! 흥미로운 기능을 켠다면 그로 인해 향후에 많은 답답함을 초래할 수 있기 때문에, 어디서 했는지 잊지 않도록 주의하세요.

마크다운 테이블 실험이 원하는 대로 작동하지 않아서 죄송합니다. 그러나 이 경우 스프레드시트가 적합한 도구에요. 최소한 평문 회계를 완전히 익힐 때까지는요.

<div class="content-ad"></div>

## 명령 줄 배우기 — 4주차

존니 데시멀이 명령 줄을 가르치고 있어요. 그는 이미 익숙한 사람들로부터 한번 간단하게 해주는 방법에 대한 의견을 환영하고 있어요. 이 신비한 초능력을 해독하고 있는 과정에서 대화에 참여해주세요.

이번 주에는 새로운 영역으로 나아가는 것을 방해하는 삶의 아름다움을 경험했어요. 그래서 지금까지 배운 내용을 다시 살펴보기로 했어요. 놀랍게도, 명령어들이 아직 익숙해지지 않았네요!

어디에 ls와 less를 사용해야 하는지 다시 공부해야 했어요. 지금 이 글을 쓰는 파일로 이동했어요 (Obsidian에서) — 당신의 사용자 이름으로부터 7단계 떨어진 위치에 있어요 — 이정도로 멀리까지 도달해서 기분이 좋네요! 텍스트를 편집하는 방법을 배우면서 단순히 읽는 것뿐만 아니라 내용을 수정하는 것도 배울 거에요. 이 세그먼트를 Obsidian이 아닌 터미널에서 쓰게 되면 당신에게 알려드릴게요.

<div class="content-ad"></div>

마크다운 형식으로 표 태그를 변경하십시오.


I love hearing from readers, and I’m always looking for feedback. Why do you read Plain Text. Paper, Less? Is there anything you’d like to see more, or less of? Which aspects do you enjoy the most? Found an error? Let me know in the comments, on Mastodon, or hit reply if you received this as an email.

No AI content: 100% human made. Download productivity goodies, including a soon-to-be-released updated Obsidian Planner demo vault, here.
