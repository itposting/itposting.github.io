---
title: "GPT-4o로 데이터 분석 무기한 변경 2024년 최신 동향 분석"
description: ""
coverImage: "/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_0.png"
date: 2024-06-22 20:26
ogImage: 
  url: /assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_0.png
tag: Tech
originalTitle: "GPT-4o Changed Data Analysis Indefinitely"
link: "https://medium.com/gitconnected/gpt-4o-changed-data-analysis-indefinitely-e528dd7d6aa1"
---


예, 이 요소는 데이터 과학입니다. 이 기사에서는 데이터 분석이 어떻게 완전히 변화되었는지 살펴보겠습니다.

ChatGPT는 다양한 영역에 영향을 미치지만, 가장 많은 영향을 미치는 영역이 무엇인지 궁금해하시나요? ChatGPT의 최신 및 가장 발전된 모델인 GPT-4를 사용하여 데이터 분석 방법을 자동화할 수 있는 방법을 볼 수 있습니다. 시작해 봅시다!

<div class="content-ad"></div>

# NVIDIA 주식 가격

![이미지](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_1.png)

NVIDIA는 현재 매우 인기가 있습니다. 여기서 NVIDIA 주식가격 데이터셋을 사용해보죠. 이 데이터셋을 다운로드한 후 Google 드라이브에 업로드하고 거기서 ChatGPT에서 불러올 수 있지만, 드래그 앤 드롭으로 업로드하는 것이 더 쉽습니다.

![이미지](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_2.png)

<div class="content-ad"></div>

# 데이터 탐색

지금은 이 데이터셋을 탐색해보겠습니다. 아래 프롬프트를 사용할 수 있어요.

- 이 데이터셋의 처음과 끝을 보여줘.
- 이 데이터의 샘플을 임의로(10개) 보여줘.
- 이 데이터의 형태(shape)는 무엇인가?
- 이 열의 데이터 유형은 무엇인가?
- 열에 대한 통계 정보를 알려줘.(describe)

이제 이를 적용해 봅시다. 첫 번째 프롬프트가 여기 있어요.

<div class="content-ad"></div>

```js
이 데이터 세트의 첫 부분과 끝 부분을 보여주세요.
```

![이미지](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_3.png)

또한, 오른쪽 상단의 확장 버튼을 클릭하면 이 테이블들을 확장할 수 있습니다.

![이미지](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_4.png)

<div class="content-ad"></div>

한 번 클릭하면 테이블이 이렇게 확장되고, 여전히 아래의 대화 전체를 볼 수 있어요.

![이미지](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_5.png)

두 번째 프롬프트를 사용해 보겠습니다.

```js
이 데이터의 샘플을 무작위로 보여줘(10).
```

<div class="content-ad"></div>


![불러오기 실패](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_6.png)

다른 프롬프트를 사용해보세요.

```js
각 열의 통계 정보를 제공해주세요.(describe)
```

![불러오기 실패](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_7.png)


<div class="content-ad"></div>

뭔가 알아차렸어요? 네, GPT-4o가 이미 이 데이터셋을 시각화하는 옵션을 제안했어요. 그러니 기다릴 필요가 없겠죠? 데이터 시각화로 계속 진행합시다. 놀라움이 더 있을 거예요.

# 데이터 시각화

우리가 데이터 시각화를 어떻게 자동화할 수 있는지 살펴봐요.

## 월간 수익률 막대 그래프

<div class="content-ad"></div>

만약 당신이 달의 시작에 주식을 사고, 달의 끝에 판매한다면 얼마를 벌 수 있을까요?

자, 문제를 봐봅시다;

```js
다음을 제공하세요: Bar Plot of Monthly Returns in percentage Daily over time, 
date column should include this Month- Year instead of dates day by day.
```

여기가 결과물입니다.

<div class="content-ad"></div>

![Change the table tag to Markdown format](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_8.png)  

You can change the column by clicking on the second button on the top right, and here, you can easily adjust the plot.

![Change the table tag to Markdown format](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_9.png)  

Also, when you click on the first button on the top right-switch to static chart, you can not change the plot now.

<div class="content-ad"></div>

<table>
  <tr>
    <td><img src="/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_10.png" /></td>
  </tr>
</table>

"차트를 다운로드하시려면 오른쪽 상단의 3번 버튼을 클릭하시면 됩니다."

## 트렌드 이벤트와 함께 라인 플롯

주식 가격을 분석하는 것은 멋진 일이죠. 모두들 어떻게 시간이 지남에 따라 가격이 어떻게 변화되었는지 궁금해합니다. 하지만 저희에게 멋진 도구(GPT 4-o)가 있으니까요, 주요 이벤트가 가격에 어떤 영향을 미치는지 확인해봅시다. 여기에 프롬프트가 있습니다;

<div class="content-ad"></div>

```js
중요 이벤트에 대한 주석이 있는 조정 종가 시간대별 그래프입니다.
데이터셋에는 '날짜' 및 '조정 종가' 열이 포함되어 있습니다.
주식 가격의 주요 변동에 기반하여 중요 이벤트를 식별하고 그래프에 주석을 추가하세요.
```

이 그래프를 확인해주세요.

<img src="/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_11.png" />

하지만 중요한 이벤트가 상당한 가격 변동과 연관이 있는지 궁금해서 이를 사용합니다;


<div class="content-ad"></div>


네, 이러한(상승 및 하강)을 세계의 중요한 사건들과 연관시킬 수 있을까요?


여기에 결과입니다.

멋지네요, 계속 진행되지만 이해하셨죠. 이제 이 프롬프트로 그래프에 이러한 이벤트를 쓰세요.


각 이벤트에 대해 2단어씩 그래프에 작성해주세요.
단어가 겹치지 않도록 유의하세요.


<div class="content-ad"></div>

여기에 결과가 있습니다.

![이미지](/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_12.png)

## 한 번에 여러 그래프

이제 빠른 결과를 원하신다면, 이건 정말 좋아요.

<div class="content-ad"></div>

```js
다양하고 많은 정보를 제공하는 그래프 3개를 제공해주세요.
```

다음은 출력입니다.

또한 이 그래프들에 대한 정보도 여기 있습니다.

<img src="/assets/img/2024-06-22-GPT-4oChangedDataAnalysisIndefinitely_13.png" />

<div class="content-ad"></div>

# 마무리

이 글을 읽어주셔서 감사합니다. ChatGPT가 처음 출시되었을 때, 아무것도 변하지 않았다고 설명하려는 많은 기사를 읽었지만, 그때부터 데이터 과학이 영원히 변화했다고 믿어요.

이러한 변화를 따라가고 싶다면, 제 substack의 유료 구독자가 되는 것을 고려해보세요.

여기에서는 팔로워들에게 특별한 GPT를 제공하며, ChatGPT와 같은 LLM을 사용한 데이터 프로젝트, 주간 인공지능 뉴스레터 등을 제공합니다!

<div class="content-ad"></div>

이미지 태그를 마크다운 형식으로 변경하였습니다.

이곳에 무료 자료들이 있습니다.

ChatGPT 치트 시트가 이곳에 있습니다.

NumPy 치트 시트가 이곳에 있습니다.

<div class="content-ad"></div>

여기가 "How to be a Billionaire" 데이터 프로젝트의 소스 코드입니다.

여기가 "Classification Task with 6 Different Algorithms using Python" 데이터 프로젝트의 소스 코드입니다.

여기가 "Decision Tree in Energy Efficiency Analysis" 데이터 프로젝트의 소스 코드입니다.

여기가 "DataDrivenInvestor 2022 Articles Analysis" 데이터 프로젝트의 소스 코드입니다.