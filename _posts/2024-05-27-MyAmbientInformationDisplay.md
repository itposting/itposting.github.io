---
title: "내 앰비언트 정보 디스플레이"
description: ""
coverImage: "/assets/img/2024-05-27-MyAmbientInformationDisplay_0.png"
date: 2024-05-27 13:55
ogImage:
  url: /assets/img/2024-05-27-MyAmbientInformationDisplay_0.png
tag: Tech
originalTitle: "My Ambient Information Display"
link: "https://medium.com/@nextjeff/my-ambient-information-display-e3c026a2d325"
---

유용한 정보에 몰두하는 것을 좋아하고 종종 상상하여 새롭고 흥미로운 것을 보고 싶을 때 상층에 떠다니는 정보를 바라보고 싶다고 꿈꿔 왔어요.

몇 년 전에 나는 책상 위에 43인치 Fire TV를 설치했고, Raspberry Pi를 묶어서 뒷면에 붙였습니다. 그리고 MagicMirror를 사용하여 꿈꾸던 표시를 만들었어요. 몇 년간 디스플레이를 개선해왔고 이제 여러분께 알려드릴 준비가 됐어요!

MagicMirror는 매우 활발한 커뮤니티를 가진 성숙한 오픈 소스 코드입니다. 기본 패키지에는 기본 모듈 세트가 포함되어 있고 수백 개의 모듈이 더 있어요. 이러한 대부분의 모듈은 개발자들이 '자신의 문제'를 해결하기 위해 만들어졌으며, 그 결과 많은 사람들과 공유하기도 했고, 오픈 소스 형태로 이용할 수 있어요.

원래의 MagicMirror 개념은 반반 반사 유리 뒤에 모니터를 부착하여 전반적인 프로젝트가 거울처럼 보이도록 하는 것이었어요. 이렇게 MagicMirror를 사용하는 방법도 있지만, 표준 모니터에 표시할 수도 있어요. 제 것은 이렇게 생겼어요:

<div class="content-ad"></div>

![My Ambient Information Display](/assets/img/2024-05-27-MyAmbientInformationDisplay_0.png)

키보드 오른쪽에는 Elgato Stream Deck이 있습니다. 비디오 스트림 및 조명을 제어하는 것 외에도 내 강력한 Stream Deck은 MagicMirror를 제어하여 버튼 하나로 페이지를 전환할 수 있게 해줍니다.

당신만의 MagicMirror를 설정하고 구성하는 데 도움이 되는 상세 가이드가 수십 개 있지만, 이 문서는 아닙니다. 대신, 내 계속 발전하는 설정의 독특한 세부 정보를 주로 공유할 것입니다.

이 프로젝트에서 특히 좋아했던 점은 (결과물 외에) TV를 안전하게 부착하기 위해 스터드 파인더 사용법, 리눅스 명령 줄 사용법(새로운 기술은 아니지만 항상 연습해야 하는 기술 중 하나), 효과적인 소스 코드 제어 시스템 설정, JavaScript 및 Node 디버깅 등 다양한 기술을 사용할 수 있었다는 것입니다. 이러한 기술이 전혀 없어도 시작할 수 있도록 하는 데 마음을 멈추지 마세요!

<div class="content-ad"></div>

들어가기 전에, 몇 달 동안 내 MagicMirror를 점진적으로 발전시켜 현재의 형태로 만들었다는 점을 강조하고 싶어요. 모듈을 추가하고, 설정하고, 재설정하고, 제거하고, 업데이트하고, 심지어 필요에 맞게 수정하면서 요구 사항에 맞게 맞춰 왔어요. 당신에게 제안드리는 것은 간단히 시작하고, 압도되지 않도록 천천히 진행하면서 자신의 속도로 움직이는 것이 좋다는 거에요. 이 곳에는 많은 기능과 유연성이 있지만, 한 걸음씩 가십시오.

## 소스 코드 제어

이것을 처음부터 소프트웨어 프로젝트로 다루었어요. 내 변경 사항을 추적하고 필요 시 되돌릴 수 있도록 하고, 미래에 더 강력하고 성능이 더 좋은 Pi로 쉽게 업그레이드할 수 있도록 하고 싶었어요.

이를 위해 Amazon CodeCommit을 사용하여 내 Git 리포지토리를 설정했죠. 이것은 AWS Free Tier의 일부로 제공되며, AWS 직원이 아니더라도 사용했을 것 같아요.

<div class="content-ad"></div>

저는 Git 전문가는 아니지만 상대적으로 간단한 명령어로 대부분의 작업을 수행할 수 있습니다: git checkout, git add, git commit 및 git push.

주요 MagicMirror 구성 파일(config.js 및 custom.css)을 소스 코드 관리하고 있을 뿐만 아니라, Git 관리하에 진행 상황을 추적하는 진행중인 README 파일을 유지합니다:

![매직미러 설정 파일](/assets/img/2024-05-27-MyAmbientInformationDisplay_1.png)

다시 읽어보니, 초기 설정을 Amazon EC2 인스턴스에서 했다는 것을 상기했습니다. 이는 중요한 사항입니다: MagicMirror는 단순히 리눅스 서버에서 실행되는 프로그램이며, 라즈베리 파이에서 실행할 필요가 없습니다.

<div class="content-ad"></div>

# 반복 가능한 시스템 설정

매일 새로운 시스템을 설정하지는 않기 때문에, 사용할 때마다 필요한 모든 단계를 추적하고 작동하는지 확인해야 한다는 것을 깨달았어요. 이 프로젝트에는 구글 문서를 사용했어요. 이 문서에는 22개의 단계가 있고, 이를 통해 원시적인 Pi로부터 MagicMirror가 설치되어 실행되는 Pi까지 가는 과정이 나와 있어요:

![이미지](/assets/img/2024-05-27-MyAmbientInformationDisplay_2.png)

# MagicMirror 구성

<div class="content-ad"></div>

마법 거울의 설정 프로세스는 긴 시리즈의 git clone 및 npm install 명령으로 구성되어 있습니다. 프로세스를 완전히 반복 가능하고 완전히 자동화하는 것이 제 목표이기 때문에 Bash 스크립트를 만들어 모든 설정 단계를 수행하도록 하고 있습니다. 이 스크립트는 디렉토리를 생성하고 모든 준비 작업을 마무리합니다 (이 작업에는 20~40분 정도 소요됩니다):

![마법 거울 설정](/assets/img/2024-05-27-MyAmbientInformationDisplay_3.png)

## 디렉토리 / 파일 구조

제 디렉토리 구성은 다음과 같습니다:

<div class="content-ad"></div>

Source/MagicMirror — 이건 내 Git 저장소에서 체크아웃한 내용이야.

Source/MagicMirror/mm_setup.sh — 설정 스크립트야.

Source/MagicMirror/config.js — 설정 파일이야.

Source/MagicMirror/custom.css — 사용자 정의 CSS 파일이야.

<div class="content-ad"></div>

Source/MagicMirror/MagicMirror — 이는 github.com에서 가져온 sub-repo입니다. MagicMirror 코드가 실제로 포함되어 있습니다.

Source/MagicMirror/MagicMirror/modules — 각각이 github.com의 별도 sub-repo 인 모든 모듈이 여기에 있습니다.

MagicMirror를 실행하려면 로그인한 후에 다음 명령을 실행합니다:

```js
cd ~/Source/MagicMirror/MagicMirror/ ; cp ../config.js config ; cp ../custom.css css ; npm run start
```

<div class="content-ad"></div>

# 모듈별 리뷰

마법거울(MagicMirror)을 작동하기 위해 사용하는 각 모듈을 살펴보겠습니다. 앞서 언급한 대로, 저는 간단히 시작해서 시간이 지남에 따라 추가해왔고, 당신도 마찬가지로 해야 합니다.

보이는 모듈들에 대해 자세히 살펴보기 전에 보이지 않는 하나에 대해 말씀드릴게요! MMM-Pages를 통해 여러 페이지를 만들 수 있고, 각 페이지는 하나 이상의 모듈들로 구성됩니다. 특정 시간 간격마다 페이지를 전환할 수 있는 옵션이 있으며, Stream Deck을 설정하여 명령으로 동일하게 전환할 수도 있습니다.

여기가 제 첫 번째 페이지입니다:

<div class="content-ad"></div>


![My Ambient Information Display](/assets/img/2024-05-27-MyAmbientInformationDisplay_4.png)

The left column uses the following modules:

- clock
- MMM-OpenWeatherForecast
- MMM-SORT — Tides for Vashon Island.
- MMM-Countdown — A countdown to my ultimate retirement day.
- MMM-SystemStats — Pi stats.
- MMM-WorldClock — World clock, with time in Seattle and Ankara (Turkey).

The center column uses the newsfeed module to display the latest AWS news via an RSS feed.


<div class="content-ad"></div>

및 오른쪽 열에는 다음 모듈이 사용됩니다:

- calendar — 개인, 가족 및 소셜 세 가지 Google 캘린더의 이벤트를 표시합니다.
- MMM-EmbedURL — 내 3D 프린터에 연결된 카메라의 라이브 비디오 피드를 제공합니다.
- MMM-Parcel — tracktry.com의 데이터를 사용하여 송장 추적을 제공합니다. 전자상거래 사이트에서 송장 통지를 받을 때마다 추적 번호를 입력하여 속편하게 나의 소포가 어디에 있는지 확인할 수 있습니다.
- MMM-SpeedTest — 라즈베리 파이의 (다소 제한된) 시각에서 제공하는 인터넷 속도 테스트입니다.

다음은 두 번째 페이지입니다:

![이미지](/assets/img/2024-05-27-MyAmbientInformationDisplay_5.png)

<div class="content-ad"></div>

이 페이지는 여러 실험의 결과입니다. MMM-Webview를 사용하여 PiAware를 실행 중인 Pi에 있는 HTML 페이지를 열고 있습니다. 페이지는 워싱턴 주 페리 카메라에서 이미지를 왼쪽에 로드하고 Pi에서 FlightAware 지도를 오른쪽에 로드합니다. 내 집은 시애틀-타코마 국제공항에 접근하는 길 가에 있습니다. 때때로 밖에서 비행기 소리가 들리고 지도 상에서 움직이는 비행기를 볼 수 있습니다. 이 페이지를 동작하고 멋지게 보이도록 만드는 데 시간이 걸렸지만 정말 좋아합니다!

여기 사용한 HTML입니다:

```js
  <body class="outer">
    <div class="container">
      <div class"ferries">
        <div class="inner"><img src="https://images.wsdot.wa.gov/wsf/fauntleroy/terminal/fauntleroy.jpg"  /></div>
        <div class="inner"><img src="https://images.wsdot.wa.gov/wsf/fauntleroy/terminal/fauntterminal.jpg"  /></div>
        <div class="inner"><img src="https://images.wsdot.wa.gov/wsf/fauntleroy/terminal/faunttrenton.jpg"  /></div>
        <div class="inner"><img src="https://images.wsdot.wa.gov/wsf/fauntleroy/terminal/fauntlincoln.jpg"  /></div>
      </div>

      <div class="skyaware">
        <iframe class="skyaware-iframe" src="http://192.168.7.242/skyaware/?aircraftTrails=show" />
      </div>
    </div>
  </body>
```

세 번째 페이지는 여기 있습니다. 이 페이지는 새롭게 만들었고 설정하는 데 많은 재미를 느끼고 있습니다. 목표는 다양한 교육적이고 유익한 인포그래픽을 표시하여 새로운 정보를 찾고 배울 수 있는 것입니다.

<div class="content-ad"></div>


![2024-05-27-MyAmbientInformationDisplay_6.png](/assets/img/2024-05-27-MyAmbientInformationDisplay_6.png)

This page uses MMM-WebView. This infographic is from the brand new AWS Fundamentals book, and is shared with their permission. The book contains 13 infographics, each one jam-packed with very useful info:

![2024-05-27-MyAmbientInformationDisplay_7.png](/assets/img/2024-05-27-MyAmbientInformationDisplay_7.png)

I am still building up my collection of infographics; here’s what I have so far, and your suggestions are welcome:


<div class="content-ad"></div>

- 물리 포스터
- 이진 포스터
- NASA 태양계 이상 (앞면 파일만)

아직 이러한 것들을 검토하고 다운로드해야 합니다:

- 무료 과학 포스터
- 2023년 집을 화사하게 하는 9개의 최고의 과학 포스터
- 세상에서 가장 좋은 책 아이디어 하나

그리고 여기가 네 번째 페이지입니다 (이미지는 ezgif.com을 사용하여 만들어졌습니다):

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*mnHtyQjE8smDHDM7eLXwYQ.gif)

이것은 MMM-RAIN-MAP 및 RainViewer API의 데이터를 사용하여 내 지역의 과거 및 예측 강우량을 보여줍니다.

지금까지 이렇게 준비한 것이며, 더 많은 것들은 메모리와 컴퓨팅 성능이 더 강력한 Pi 4B를 손에 넣을 때 더할 예정입니다.

그리고 다섯 번째 페이지가 더 있지만, 시간당 회전에는 없습니다. Stream Deck에서 키를 누르면 MMM-MonthlyCalendar의 도움으로 전체 화면 형식으로 캘린더를 볼 수 있습니다(개인 항목은 파란 막대로 가려졌습니다):


<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-MyAmbientInformationDisplay_8.png" />

# 모듈에 관해 몇 마디

내가 언급한 각 모듈은 선의의 의도를 갖고 만든 개발자에 의해 만들어졌음을 인지하십시오. 이제 그 모듈을 유지 및 향상시킬 수 있는지 여부는 확실하지 않을 수 있습니다.

몇 년이 지나면 모듈이 더 이상 유지되지 않을 수도 있고, 다른 유지자가 나타날 수도 있습니다. 모듈이 고장나 있고 더 이상 관리되지 않는다면 분기점을 확인하고 문제를 해결하는 분기점을 찾아볼 수 있습니다. 혹은, 더 나아가서 버그를 수정하고 풀 요청을 제출해보세요.

<div class="content-ad"></div>

사용 사례 및 원하는 반복 가능성에 따라 각 모듈의 개인 포크를 만들고 해당 포크를 프로젝트에 복제하는 것이 좋을 수 있습니다. 이렇게하면 필요할 때마다 사본을 업데이트해야 합니다.

# 스트림 데크 / 원격 제어

알아야 할 모듈이 하나 더 있습니다. MMM-RemoteControl. MMM-Pages를 사용하는 경우 원격 제어를 고정 페이지로 구성해야 합니다.

```js
fixed:
[
    "MMM-Remote-Control",
],
```

<div class="content-ad"></div>

MMM-RemoteControl은 REST API를 구현하여 Stream Deck에서 MagicMirror를 제어할 수 있게 합니다. config 파일에는 (로컬) 장난으로부터 보호하기 위한 apiKey가 포함되어 있습니다:

```js
  /* 원격 제어 */
  {
      module: "MMM-Remote-Control",
      position: "bottom_left",
      config:
      {
          customCommand: {},
          showModuleApiMenu: true,
          secureEndpoints: false,
          apiKey: "XYZ"
      }
  },
```

물론 XYZ는 실제 키가 아닙니다!

Stream Deck은 키를 누를 때 비동기 HTTP GET 요청을 수행하도록 구성되어 있습니다; 하단 왼쪽의 6개 키가 이와 같이 설정되어 있습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-MyAmbientInformationDisplay_9.png)

예를 들어, Home 키를 누를 때 다음 요청이 발생합니다:

```js
http://192.168.7.217:8080/api/notification/HOME_PAGE?apiKey=XYZ
```

각 모듈은 특정 종류의 알림에 응답합니다. 이들은 일반적으로 문서화되어 있지만 가끔 소스 코드를 살펴봐야 할 수도 있습니다.



<div class="content-ad"></div>

# 전반적인 정보 흐름

여기는 다양한 외부 소스에서 내 MagicMirror로 흐르는 정보가 어떻게 표시되는지 보여주기 위한 내 시도입니다 (Dendron 및 Mermaid로 생성함):

![Information Flow](/assets/img/2024-05-27-MyAmbientInformationDisplay_10.png)

# 다음은 무엇인가요?

<div class="content-ad"></div>

그래서 여기에요! 현재 구성에 매우 만족하고 있지만 계속해서 새로운 모듈을 찾아 시도해 볼 예정입니다.

# 직접 만들어 보는 것을 권장합니다

앞서 말했듯이, MagicMirror를 설정하는 과정에서 다양한 기술을 활용하게 되어 매우 만족스러웠습니다. 이러한 프로젝트에서는 새로운 기술을 습득하고 현재 기술을 향상시키는 것이 불가피하게 발생하는 긍정적인 부작용입니다.

여러분도 직접 만들어 보고 제게 소식 주세요!

