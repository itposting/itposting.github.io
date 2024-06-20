---
title: "여러 브라우저 창 간에 실시간 WebSocket 데이터 공유하기"
description: ""
coverImage: "/assets/img/2024-06-19-Sharingreal-timeWebSocketdataacrossmultiplebrowserwindows_0.png"
date: 2024-06-19 09:22
ogImage: 
  url: /assets/img/2024-06-19-Sharingreal-timeWebSocketdataacrossmultiplebrowserwindows_0.png
tag: Tech
originalTitle: "Sharing real-time WebSocket data across multiple browser windows"
link: "https://medium.com/itnext/sharing-real-time-websocket-data-across-multiple-browser-windows-4e0538dd7563"
---


# 멀티 스크린 앱이나 여러 창에서 병행하여 실행되는 앱을 만들 때, 모든 연결된 참가자가 동일한 데이터를 공유할 때 트래픽을 많이 절약할 수 있습니다.

스포일러: 우리는 로컬 스토리지를 사용하지 않습니다.

# 내용:

- 소개
- 데모 비디오
- 저장소
- 백엔드
- RPC 정의 파일
- 프론트엔드
- 자식 앱용 셸
- 브라우저 창 간 위젯 이동
- Chrome 개발 도구로 앱 검사하기
- 성능을 더 높일 수 있을까?
- neo.mjs 프로젝트 업데이트

<div class="content-ad"></div>

# 1. 소개

우리의 데모 앱은 일부러 미니멀리즘한 디자인을 가지고 있습니다. 3가지 위젯(테이블, 파이 차트 및 막대 차트)이 있는 대시보드가 포함되어 있어요. 이 위젯들은 별도의 브라우저 창으로 분리할 수 있습니다.

우리는 데이터 SharedWorker를 사용하여 모든 연결된 창에 대한 데이터를 한 번에 로드하고 있으며, "스트리밍 모드"를 사용하여 초당 60번의 새 데이터를 가져오고 있어요.

또한 창을 변경하더라도 동일한 구성 요소 인스턴스를 재사용할 수 있도록 해주는 앱 SharedWorker를 사용하고 있습니다. 이를 통해 상태를 동기화하는 데 도움이 될 거예요.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-Sharingreal-timeWebSocketdataacrossmultiplebrowserwindows_0.png)

## 2. 데모 비디오

이상적으로 큰 화면에서 비디오를 시청하세요.

## 3. 저장소


<div class="content-ad"></div>

다음 저장소에서 찾을 수 있습니다:

데모 코드는 MIT 라이선스를 사용하므로 마음대로 사용하고 확장할 수 있습니다. README 파일에는 앱을 로컬에서 실행하기 위한 필요한 단계가 포함되어 있습니다.

온라인에서 직접 테스트해보려면 배포된 버전을 보고 싶다면 미리 알려주세요!

# 4. 백엔드

<div class="content-ad"></div>

우리는 백엔드 코드를 가능한 간단하게 유지하려고 합니다.

우리는 익스프레스와 ws를 사용하여 포트 3001에서 소켓 연결을 받을 수 있는 최소한의 서버를 만들고 있습니다. 또한 neo.mjs 코어를 우리의 Node.js 백엔드 코드에 가져와 내부 유틸리티 함수 및 클래스 구성 시스템을 사용할 수 있도록 합니다.

전체 코드는 여기에 있습니다: ColorService.mjs

우리의 서비스는 read() 메서드만 노출하며, 이 메서드는 우리가 opts 객체 내의 속성으로 전달하는 3가지 매개변수를 기반으로 무작위 데이터를 생성할 것입니다.

<div class="content-ad"></div>

- amountColors
- amountColumns
- amountRows

# 5. RPC 정의 파일

실제 앱에서는 각 서비스 내에서 CRUD를 사용하고, 복잡성에 따라 사용 가능한 서비스로 JSON 파일을 동적으로 생성할 것입니다. 특정 사용자 역할이나 권한에 따라 다를 수 있습니다.

우리의 프론트엔드 코드는 이 파일을 fetch()하여 원하는 네임스페이스를 우리에게 노출시킬 것입니다.

<div class="content-ad"></div>

물론 원하신다면 async / await을 사용할 수도 있어요.

여기서 좋은 점은 frontend 코드베이스 내에서 JavaScript 프라미스로 Service 메소드를 직접 사용할 수 있다는 거예요.

진짜 편리하죠 :)

<img src="/assets/img/2024-06-19-Sharingreal-timeWebSocketdataacrossmultiplebrowserwindows_1.png" />

<div class="content-ad"></div>

만약 애플리케이션 SharedWorker(프론트엔드 코드) 내에서 Colors.backend.ColorService.read()를 사용한다면, neo.mjs는 데이터 SharedWorker로 메시지를 보낼 것입니다. 관심사의 분리입니다. 데이터 워커는 소켓 연결이 이미 존재하는지 확인하고 필요한 경우 (재)연결합니다. 그런 다음 소켓을 통해 메시지를 보내고 백엔드 코드 내에서 ColorService.read()를 실행할 것입니다. 특정 소켓 연결 메시지의 응답은 App-Worker로 다시 전송됩니다. 초기 호출자에게 매핑된 후 우리의 Promise를 해결할 것입니다.

개발자로서 여러분은 여기에서 일어나는 마법에 대해 걱정할 필요가 없습니다.

# 6. 프론트엔드

npx neo-app을 사용하여 앱 셸을 자동으로 생성했습니다.

<div class="content-ad"></div>

Neo 앱의 인덱스 파일은 MicroLoader 모듈만 포함하게 됩니다. 이 모듈은 우리 앱 폴더 안의 neo-config.json 파일을 가져와 neo 메인 스레드를 시작할 것입니다. 이 스레드는 워커 설정을 생성하고 완료되면 우리 앱 폴더 안의 app.mjs 파일을 동적으로 로드할 것입니다.

우리 앱 SharedWorker에 로드되는 Viewport 파일:

Viewport에는 3개의 위젯과 HeaderToolbar가 직접 items 배열에 들어갑니다. 또한 view controller와 view model을 가져옵니다.

Neo에서의 view model은 상태 제공자(다른 라이브러리/프레임워크에서는 "store"로 불림)로서, 자식 뷰가 데이터 속성에 바인딩할 수 있도록 허용합니다. 부모 체인 내에서 여러 데이터 속성에 바인딩할 수도 있습니다. 이 데모 앱에 중요한 부분은: 우리의 상태 트리가 모든 브라우저 창에서 작동한다는 것입니다.

<div class="content-ad"></div>

# 7. 자식 앱을 위한 쉘

주 앱과 마찬가지로 MicroLoader가 들어 있는 index 파일과 Viewport을 가져오는 app.mjs 파일이 있는 인덱스 파일이 있습니다:

Viewport은 완전히 비어 있어서, 주 앱을 로드하지 않고 앱을 열면 다음과 같이 나타날 것입니다:

![이미지](/assets/img/2024-06-19-Sharingreal-timeWebSocketdataacrossmultiplebrowserwindows_2.png)

<div class="content-ad"></div>

# 8. 브라우저 창 간 위젯 이동

저희 주 앱 ViewportController 내에서는 앱 SharedWorker에 연결된 각 브라우저 창에 대해 발생하는 connect 이벤트에 구독하고 있습니다.

연결된 창이 주 앱 창이 아닌 경우 다음을 호출합니다:

```javascript
widgetParent.remove(widget, false);
```

<div class="content-ad"></div>

우리는 메인 창 안의 뷰포트에서 원하는 위젯(테이블, 파이 차트 또는 바 차트)를 제거하고 있어요. 두 번째 매개변수 false는 컴포넌트 인스턴스를 파괴하지 않도록 하는 플래그입니다.

mainView.add(widget);

그런 다음 위젯을 메인 뷰 → 다른 브라우저 창의 뷰포트에 추가하고 있어요. 동일한 컴포넌트 인스턴스를 재사용하기 때문에 최신 상태를 손쉽게 얻을 수 있어요.

정말로 이렇게 간단해요.

<div class="content-ad"></div>

컴포넌트 인스턴스 재사용에 대한 주제는 메모리 누수를 줄이고 런타임 성능을 향상시키는 매우 강력한 기술이기 때문에 개별 블로그 게시물이 필요합니다.

# 9. Chrome 개발 도구로 앱 검사하기

Neo에서 단일 창 앱을 만들 때 프레임워크는 Dedicated Workers를 사용하며, 이를 주 창 콘솔에서 직접 확인할 수 있습니다.

"neo-config.json" 파일에 "useSharedWorkers”: true를 추가하면 프레임워크가 SharedWorkers로 전환되며, 브라우저 창 콘솔에서는 더 이상 확인할 수 없습니다.

<div class="content-ad"></div>

Neo.mjs는 Worker를 위한 추상화 계층을 제공하여 개발자의 API가 정확히 동일하게 유지됩니다. 우리는 언제든지 1줄의 구성을 변경할 수 있습니다. SharedWorker를 검사하려면 다음을 열어야 합니다:

chrome://inspect/#workers

![이미지](/assets/img/2024-06-19-Sharingreal-timeWebSocketdataacrossmultiplebrowserwindows_3.png)

앱의 SharedWorker를 검사하고 콘솔에 다음 코드를 입력하세요:

<div class="content-ad"></div>

# 10. 성능을 더 향상시킬 수 있을까요?

데모 앱은 매우 빠르게 느껴지지만 아직은 성능을 최적화하지 않은 상태입니다. 그러므로 이 질문에 대한 답변은 명확히 "네!"입니다. 여전히 우리는 AmCharts 주요 스레드 애드온을 버전 5로 업그레이드(재작성)해야 합니다. 이에 우선 순위를 부여해야 할 필요가 있다면 미리 알려주세요.

또한 여러 가지 앱 설정을 시험해볼 수도 있습니다. 예를 들어, 데이터 워커 대신 앱 워커 내에서 소켓 연결을 직접 생성하여 내부 포스트 메시지의 양을 줄일 수 있습니다.

# 11. neo.mjs 프로젝트 업데이트

<div class="content-ad"></div>

1.5년 만에 올린 첫 블로그 포스트였어요. 마음에 드셨으면 좋겣어요! 궁금한 점이 있으시면 언제든지 물어보세요.

그동안 프레임워크는 많이 발전했어요. 가장 중요한 업데이트는 새 제품 웹사이트를 준비 중이라는 점이에요. 이 사이트에는 오랫동안 기다리셨던 자기 학습 섹션이 첫 번째 버전으로 포함될 예정이에요. 이를 완성하는 대략적인 시간은 한 달 정도 남았어요.

우리는 아직 매주 목요일 오후 5시 30분(CEST 기준)에 무료 워크숍을 진행하고 있어요. 참여하고 싶다면 슬랙 채널에서 연락해주세요.

회사에서 더 많은 도움이 필요하다면, neo.mjs 코어 팀은 전문 강사가 진행하는 인도주도 훈련(40시간, 6~12명 참가자)뿐만 아니라 전문 서비스(예: 차세대 앱 개발 지원)도 제공하고 있어요.

<div class="content-ad"></div>

피드백을 매우 환영합니다!

진심으로, 즐거운 코딩하세요,
토비아스