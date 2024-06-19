---
title: "2일차 상호작용형 데이터 시각화  라이브러리 선택하기 "
description: ""
coverImage: "/assets/img/2024-06-19-Day2InteractiveDataVisualisationChoosingALibrary_0.png"
date: 2024-06-19 09:30
ogImage: 
  url: /assets/img/2024-06-19-Day2InteractiveDataVisualisationChoosingALibrary_0.png
tag: Tech
originalTitle: "Day 2: Interactive Data Visualisation — Choosing A Library 📊"
link: "https://medium.com/@cubode/day-2-interactive-data-visualisation-choosing-a-library-a31f8df094e7"
---


![Data visualisation](/assets/img/2024-06-19-Day2InteractiveDataVisualisationChoosingALibrary_0.png)

데이터 시각화, 이 주제는 다양한 산업에서 실험되어 왔고, 많은 분들이 이미 경험해 보셨을 거에요, 그런가요? 음, 여전히 많은 사람들이 자신의 데이터를 시각화하는 데 어려움을 겪고 있다는 사실에 놀라실 겁니다. 데이터를 시각화하는 차트를 만들기 위해서는 눈에 잘 띄고 원하는 모든 요소를 포함할 수 있는 새로운 코딩 기술이 필요합니다. 파이썬이라는 말을 들어본 적이 있나요? 코딩을 배우는 데에는 상당한 노력과 땀, 그리고 눈물이 필요해요. 하지만 우리는 좀 다르게 하고 싶어요.

그래서 우리의 첫 번째 글에서는 업로드된 데이터를 처리하고 다른 웹 앱에 포함될 수 있는 멋진 대화 형 그래프를 토출하기를 원하는 에이전트를 원했다는 이야기를 나눴어요. 두 가지 선택지가 있었어요. 우리만의 그래프 라이브러리를 만드는 불편함을 감수할 건지, 아니면 이미 있는 오픈 소스를 사용할 건지 말이죠. 삶을 어렵게 만들 이유가 없죠? 그래서 우리는 오픈 소스 옵션을 선택했어요. 우리가 선택한 라이브러리를 보여드릴게요. 만약 데이터 시각화가 당신의 분야라면 꼭 한 번 확인해보세요...

# 선택된 라이브러리

<div class="content-ad"></div>

생성된 차트가 상호작용적이 되려면 클라이언트 측(브라우저 내)에서 렌더링되어야 했습니다. 서버 측에서 차트를 생성하려면 차트를 정적 png 또는 jpeg 파일로 저장한 다음 해당 파일을 클라이언트에 제공하여 표시해야 합니다. 문제는 이러한 차트가 정적이 된다는 점입니다. ChatGPT가 데이터를로드하면 시각화 차트를 생성하는 방식과 유사합니다. 우리가 커뮤니티를 위해 만들고자 했던 것은 이것보다 더 뛰어난 것이었습니다. 그래서 몇 차례의 연구 끝에 우리는 결정을 내렸습니다.👇

## ECharts

# ECharts란?

ECharts는 멋진 오픈 소스 자바스크립트 데이터 시각화 라이브러리로, 강력한 렌더링 엔진을 제공하여 디자인이 우아하고 브라우저에서 표시될 때 상호작용적인 다양한 데이터 시각화 차트를 만들 수 있습니다. 📈🙌

<div class="content-ad"></div>

ECharts의 각 차트에는 다른 데이터 구조가 있어서 차트가 제대로 표시됩니다. 놀라운 다양한 차트뿐만 아니라 활기찬 커뮤니티도 자랑합니다, 그래서 지원이 필요할 때 언제나 단기간에 부족함이 없습니다 💪.

아래의 예시들을 확인해보세요👇

![Example 1](/assets/img/2024-06-19-Day2InteractiveDataVisualisationChoosingALibrary_1.png)

![Example 2](/assets/img/2024-06-19-Day2InteractiveDataVisualisationChoosingALibrary_2.png)

<div class="content-ad"></div>

# 이것이 AI 에이전트와 어떤 관련이 있는지 알아보겠어요.

알겠어요, ECharts를 선택했죠? ✅ 다음 단계는 에이전트의 인프라를 설정해야 해요. 앱의 클라이언트 측에 전달할 수 있는 구성요소를 만들어야 해요. 이를 통해 ECharts가 제공하는 모든 차트 유형을 보여줄 수 있어요 🤝. 그래서 계획은 이렇습니다: 에이전트는 업로드된 데이터의 스키마에 따라 차트를 선택할 거예요. 그런 다음 차트가 필요로 하는 데이터 구조를 결정하고, 원시 데이터를 처리하여 해당 구조를 채우고, 마지막으로 브라우저에서 렌더링할 수 있는 형태로 패키지화해야 해요. 계획처럼 듣긴 하죠 🎯? AI 에이전트를 위한 시스템 아키텍처를 설계해 봅시다. Article 3에서 만납시다 🤝.

![image](/assets/img/2024-06-19-Day2InteractiveDataVisualisationChoosingALibrary_3.png)

# 함께 참여하세요!

<div class="content-ad"></div>

계속 주목해주세요! 앞으로 30일 동안 매일 글을 게시할 예정이에요. 저희 진행 상황에 대한 업데이트도 있을 거예요 🚀. 만약 이 에이전트의 첫 사용자 중 한 명이 되고 싶다면 www.cubode.com 으로 이동해서 첫 액세스를 받으세요.