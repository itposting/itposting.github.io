---
title: "더 나은 데이터 스토리텔링 탐구적 연구를 통해 시각물을 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_0.png"
date: 2024-06-19 01:31
ogImage: 
  url: /assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_0.png
tag: Tech
originalTitle: "Better Data Storytelling: Creating Visuals Through Exploratory Research"
link: "https://medium.com/data-storytelling-corner/better-data-storytelling-creating-visuals-through-exploratory-research-113578707996"
---



![Better Data Storytelling - Creating Visuals Through Exploratory Research](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_0.png)

데이터 시각화와 스토리텔링을 통해 명확하고 간결한 이미지를 제시하면 의견을 전달하는 데 큰 가치가 있습니다.
내닌 Yau가 그의 새 책(Visualize This, 2판)에서 강조한 것처럼, 데이터를 효율적이고 정확하게 제시하기 위해 항상 노력한다면 대부분의 경우 막대 차트를 사용해야 합니다. 대부분의 사람들이 막대 차트를 보고 비교적 쉽게 해석할 수 있습니다. 양적으로 매우 효과적입니다.

하지만 어떻게 하면 당신의 데이터를 돋보이게 만들 수 있을까요? 춤추게 할 수 있을까요? 청중을 행동으로 이끄는 데 무엇을 할 수 있을까요?


<div class="content-ad"></div>

어쩌면 좀 더 흥미로운 것을 찾아볼 필요가 있을지도 몰라요. 처음 단계로, 우리는 탐구적 연구를 수행하여 데이터를 다양한 방식으로 시각화하여 우리의 청중을 정말로 사로잡을 시각이나 시각 집합을 찾을 수 있습니다.

탐구적 연구란 무엇일까요? 설명해 드리겠습니다. 또한 데이터 집합을 살아있게 만들기 위해 다양한 시각화를 사용하는 방법에 대한 유용한 예시도 제공해 드리겠습니다.

# 탐구적 연구

데이터 집합으로 이야기를 전할 수 있는 지점에 도달하려면 탐구적 연구 과정을 거쳐야 할 수도 있습니다.

<div class="content-ad"></div>

여기에 자연적인 호기심이 담긴 기회가 있어요. 데이터에 관한 어떤 질문이 있나요? 데이터에 대해 알아보고 싶으신 점이 무엇인가요?

Cole Nussbaumer-Knaflic은 2015년에 출간된 대표적인 책인 'Storytelling With Data'에서 탐색 단계를 전복 속에서 진주를 찾는 것과 유사하다고 설명합니다. 100개의 전복 중에서 2개의 진주를 찾을 수 있다고 가정해보세요. 탐색 단계에서 성공하기 위한 핵심은 데이터를 여러 다양한 방법으로 바라보는 것입니다.

그리고 Nathan Yau(2024)가 제시한 유용한 질문 목록이 있습니다. 몇 가지 유용한 질문 중 일부는 다음과 같아요:

- 이 데이터는 무엇에 관한가요?
- 시간이 지남에 따라 어떻게 변했나요?
- 어떤 관련성이 있나요?
- 무엇이 돋보이나요?
- 이것이 정상인가요?

<div class="content-ad"></div>

큰 데이터 집합인 유엔 난민고등판데사(UNHCR)의 글로벌 망명자 데이터 집합을 사용한 몇 가지 예시를 살펴봅시다.

## 데이터셋

유엔 난민고등판데사(UNHCR)는 전 세계 난민 이동에 대한 통계를 추적합니다.

그 데이터는 [여기](링크)에서 자유롭게 액세스할 수 있습니다.

<div class="content-ad"></div>

링크를 클릭해서 다운로드 페이지로 이동한 후에, 선택하는 데이터를 자세히 살펴볼 수 있습니다:

![다운로드 이미지](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_1.png)

이 프로젝트에서는 각 난민의 출신 국가와 피난처 국가를 살펴봅시다:

- 출신 국가에서 — 피난민이 이주하는 국가
- 피난처 국가에서 — 피난민이 출신하는 국가

<div class="content-ad"></div>

데이터셋을 다운로드한 후에는 스프레드시트 형식으로 열어서 어떤 내용을 다루고 있는지 살펴볼 수 있어요:

![Spreadsheet](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_2.png)

이 프로젝트에서 주로 관심 있는 데이터 필드는 다음과 같아요:

- 출신 국가 (3자리 ISO 코드 포함) - 망명을 찾는 사람이 어디서 왔는지
- 망명 국가 (3자리 ISO 코드 포함) - 실제로 망명을 찾으려는 사람이 있는 곳
- 인정된 결정 - 망명을 찾는 사람이 수용되었는지 여부 (국가별 숫자 총계)

<div class="content-ad"></div>

원산지와 망명국 두 곳은 신뢰할 수 있는 고유 식별을 위해 사용할 수 있는 3자리 ISO 코드를 갖고 있어요.

# 어떤 이야기들을 할 수 있을까요?

데이터셋이 어떤 내용을 포함하고 있는지 아는 것으로 우리는 다음 단계를 진행할 때 호기심을 안내할 수 있습니다.

저는 캐나다인으로써, 캐나다로 오는 망명 신청자에 관심이 있어요. 반면 캐나다에서 떠나 다른 곳으로 망명을 찾는 사람들보다는 그 수가 많지 않아요.

<div class="content-ad"></div>

마음에 떠오르는 질문들:

- 사람들이 어디서 왔는지?
- 캐나다가 난민을 받아들이는 면에서 다른 나라들과 어떻게 비교되는가?
- 그들의 출신지가 시간이 지남에 따라 변했는가?
- 총 인원이 시간이 지남에 따라 변했는가?

이러한 질문에 대답하기 위해 가장 매력적인 방법으로 가능한 시각화 옵션들을 살펴볼 수 있습니다.

한 번 더 말하지만, 2024년에 출간된 Dr. Yau의 Visualize This에서는 60가지 시각화 옵션이 제공되므로 선택할 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_3.png" />

오늘의 탐색적 연습에서는 주황색으로 강조된 5가지 다양한 탐색 옵션을 살펴보겠습니다:

- 막대 차트
- 시계열 선 그래프
- 쌓인 영역 차트
- 등치지도
- 선채우기 차트 (원형 차트처럼 비율에 따라 크기가 조절되지만 두 가지 수준이 있음)

본문에 포함된 모든 5가지 예시는 Python Plotly 라이브러리를 사용하여 생성되었습니다(Github에서 모든 파일을 확인할 수 있습니다).

<div class="content-ad"></div>

시작해봅시다!

# 탐사 1. 막대 차트

막대 차트는 오늘날 가장 인기 있는 데이터 시각화 중 하나입니다. 데이터를 처음 탐색할 때 좋은 시작점이 됩니다.

![Bar Chart](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_4.png)

<div class="content-ad"></div>

이 막대 차트를 통해 수용된 망명자 수가 2021년까지 상승 추세였으며 (2020년 코로나19 예외), 그 이후로는 하락 추세임을 알 수 있습니다. 이 차트는 캐나다로의 망명자의 숫자를 매우 명확하게 보여줍니다.

좋아요, 좋아요, 이제 캐나다에서 망명을 찾는 사람들의 구성에 대해 어떻게 생각하세요? 그들은 어디에서 오고 있나요?

우리는 데이터 집합의 범위 (2015–2023)에 대한 숫자를 보여주는 막대 차트로 시작할 수 있습니다:

![차트](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_5.png)

<div class="content-ad"></div>

가로 막대 차트를 사용하면 각 국가를 쉽게 읽고 서로 비교할 수 있어요. 멋지네요!

하지만 만약 이 기간 동안 캐나다를 전 세계와 비교하려면 어떻게 해야 할까요? 막대 차트로는 그것을 보여주기가 어려울 수 있어요. 시계열 차트가 더 나을 수도 있으니 한 번 시도해보죠.

# 2번째 탐색. 시계열 선 그래프

먼저, 이전 예시의 막대 차트를 선 그래프로 변환해봅시다.

<div class="content-ad"></div>

만약 우리가 캐나다만을 대표하는 선 그래프로 연도별 신청자 총 수를 보여준다면:

![line chart](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_6.png)

우리는 코로나 이전에 상승세를 보이다가 코로나 기간 동안 짧은 하락세를 보이는 것을 확인할 수 있습니다 (캐나다는 매우 엄격한 입국 규정을 가지고 있었습니다). 그러나 이 시기 동안 캐나다는 다른 나라들과 어떻게 비교되는 걸까요?

데이터 시각화의 최상의 방법을 활용하여 데이터 세트의 나머지 국가들을 (연한 회색으로) 추가할 수 있습니다.

<div class="content-ad"></div>

![Better Data Storytelling](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_7.png)

이제 캐나다를 주황색으로 표시하고 다른 국가들을 연한 회색으로 표현하면, 캐나다의 다른 나라들에 비한 위치를 알 수 있습니다.

이 차트에서 우리는 많은 다른 국가들에 비해 캐나다가 실제로 많은 난민들을 받아들인다는 것을 볼 수 있습니다. 우리가 2016년에 볼 수 있는 큰 증가는 그때 독일이 많은 수의 시리아 난민을 받아들였던 것입니다.

멋져요!

<div class="content-ad"></div>

지금은 캐나다가 전 세계와 비교되는 방법과 어디서 사람들이 왔는지에 대한 전체 숫자를 알게 되었습니다.

하지만 캐나다의 경우 (출신 국가별로) 연간 변화를 추적하고 싶다면 어떨까요?

여기서 좀 더 세부적으로 파고들어야 합니다. 스택된 면적 차트를 사용하면 시각적으로 이를 파악할 수 있습니다.

# Exploration 3. 스택된 면적 차트

<div class="content-ad"></div>

스택된 영역 차트는 시간이 지남에 따른 체적 변화를 살펴보는 뛰어난 방법입니다. 우리 데이터셋의 경우, 체적 변화는 캐나다로 매년 망명을 찾는 각 출신 국가의 사람 수일 것입니다.

![영역 차트](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_8.png)

이 특정 차트는 캐나다로 이주하는 사람들이 어디에서 망명을 찾고 있는지를 보여줍니다. 사용자가 세부사항에 빠져들지 않도록 상위 10개 국가로 좁혀졌습니다.

자세히 살펴보면, 주황색 영역은 캐나다에서 망명을 찾는 이란 사람들의 많은 수를 나타냅니다.

<div class="content-ad"></div>

적절한 데이터로 스택된 영역 차트는 시간에 따른 변화에 대해 확실한 시각적 효과를 제공할 수 있습니다.

이 특정 차트는 Python Plotly express 라이브러리를 사용하여 생성되었습니다. 이 라이브러리에는 이 스타일의 차트를 생성하는 area()라는 내장 함수가 있습니다.

이제 이 3가지 훌륭한 시각화를 통해도, 우리가 아직 부족한 것은 캐나다로의 국가별 양민 신청자의 명확한 전체적 인식을 제공해주는 유용한 시각화입니다.

이를 위해 우리에게 제공하는 유용한 표현은 코로플레스 지도입니다.

<div class="content-ad"></div>

# 4. 코로플레스 맵 고찰

코로플레스 맵은 지리적 영역(예: 국가별) 전체의 데이터 변화를 보여주기 위해 음영 처리된 영역을 제공합니다.

저희 데이터셋과 함께 코로플레스 맵을 사용하면 각 국가별 신청자 수에 대한 전체적인 시각화를 얻을 수 있습니다:

![이미지](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_9.png)

<div class="content-ad"></div>

이 예에서, 더 어두운 색조와 음영은 캐나다로의 많은 수의 난민 신청자를 대표합니다. 이 예에서 대상 국가인 캐나다는 녹색 원(마치 "녹색 빛"처럼)으로 강조되어 있습니다.

이전의 시각화(스택된 면적 차트)에서 2023년에 난민 신청을 한 이란 국민들의 수가 많다는 것을 알 수 있었습니다. 우리는 이 지도에서 이란이 가장 어두운 색인 것을 볼 수 있습니다. 이는 이전의 예시와 일치하는 멋진 부분입니다!

추가 기능으로, 코로플레스 맵은 Streamlit(파이썬용)과 같은 현대적인 코딩 라이브러리와 결합하여, 년도를 선택할 수 있게 하는 상호작용성을 제공할 수 있습니다:

![이미지](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_10.png)

<div class="content-ad"></div>

파이썬 Plotly를 사용하여 생성된 코로플레스 맵으로 각 나라 위를 마우스 오버하여 추가 정보(즉, 정확한 숫자)를 확인할 수 있습니다.

# 탐험 5. 썬버스트 차트

썬버스트 차트는 데이터를 표현하는 아름다운 방법입니다. 다양한 형태의 데이터를 시각화하는 가장 효과적인 방법은 아니지만, 썬버스트 차트는 항상 눈길을 끕니다. 나는 그것들을 주시하고 항상 표현하고 있는 데이터 포인트가 무엇인지 궁금해합니다.

우리 데이터셋에서 각 해의 각 나라에 대한 캐나다의 망명 신청 국가 데이터를 나타낼 수 있습니다.

<div class="content-ad"></div>


![Better Data Storytelling: Creating Visuals Through Exploratory Research](/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_11.png)

매우 다채롭고 인상적이지만 동시에 매우 복잡합니다. 이런 차트를 소화하는 데는 많은 시간이 걸릴 수 있습니다.

하지만 Python Plotly와 같은 현대 데이터 시각화 도구의 큰 이점 중 하나는 사용자 상호작용을 허용한다는 점입니다. 이 시각화(다시 말해 Python Plotly로 만든 것)에서 각 연도를 클릭하여 데이터를 자세히 살펴볼 수 있습니다.

예를 들어, 2023년을 클릭하면 해당 연도의 데이터만 볼 수 있습니다:


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-BetterDataStorytellingCreatingVisualsThroughExploratoryResearch_12.png" />

그리고 특정 국가(예: 인도) 위로 마우스를 올리면 해당 국가에 대한 추가 데이터를 볼 수 있습니다. 매우 유용합니다.

# 요약

이 글의 목표는 독자들에게 데이터 집합에서 탐색 분석을 수행하는 다양한 차트 및 매핑 기술을 사용하는 방법에 대한 예시를 제공하는 것입니다.

<div class="content-ad"></div>

이 과정을 통해 데이터에 대해 궁금한 점이 있으면 답변할 수 있습니다. 혹은 아직 질문이 없다면 질문을 세우는 데 도움을 줄 수도 있습니다.

이 연습이 유용하고 즐거우셨기를 바랍니다.

읽어 주셔서 감사합니다!

참고: 이 글의 예시는 모두 Python 코드를 사용하여 (Plotly express 및 Streamlit 라이브러리를 활용하여) 작성되었습니다.

<div class="content-ad"></div>

위 코드 파일과 CSV 파일은 GitHub 저장소에 있습니다. 

만약 이 유형의 이야기가 당신의 취향이고 작가로서 저를 지원하고 싶다면, 제 Substack를 구독해주세요.

Substack에서는 2주에 한 번 뉴스레터와 다른 플랫폼에서 찾을 수 없는 기사들을 게시합니다.