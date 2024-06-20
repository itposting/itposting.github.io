---
title: "씨본 객체 소개"
description: ""
coverImage: "/assets/img/2024-06-20-IntroducingSeabornObjects_0.png"
date: 2024-06-20 15:16
ogImage: 
  url: /assets/img/2024-06-20-IntroducingSeabornObjects_0.png
tag: Tech
originalTitle: "Introducing Seaborn Objects"
link: "https://medium.com/towards-data-science/introducing-seaborn-objects-aa40406acf3d"
---


## QUICK SUCCESS DATA SCIENCE

![Seaborn Objects](/assets/img/2024-06-20-IntroducingSeabornObjects_0.png)

2022년 말에 소개된 새로운 Seaborn Objects 시스템을 이미 사용해보셨나요? 꼭 사용해보시길 권합니다; 정말 멋진 것입니다.

이 새로운 시스템은 Tableau와 R의 ggplot2에서 사용되는 그래픽 문법 패러다임을 기반으로 하고 있어 더 유연하고 모듈화되어 있으며 직관적입니다. Python을 사용한 플로팅이 이제 더욱 좋아졌습니다.

<div class="content-ad"></div>

빠른 성공 데이터 과학 프로젝트에서, 새로운 시스템의 기본을 빠르게 익힐 수 있는 튜토리얼을 받을 거에요. Seaborn Objects 공식 문서에서 컴파일된 여러 유용한 치트 시트도 받게 될 거에요.

## 라이브러리 설치

이 프로젝트에서는 다음 오픈 소스 라이브러리를 사용할 거예요: pandas, Matplotlib, seaborn. 각 링크에서 설치 지침을 찾을 수 있어요. 이 프로젝트 전용 가상 환경에 설치하거나, Anaconda 사용자라면 이 프로젝트 전용 conda 환경에 설치하는 것을 추천해요.

## 새로운 Seaborn Objects 인터페이스

<div class="content-ad"></div>

Seaborn의 목표는 항상 파이썬의 주요 플로팅 라이브러리인 Matplotlib을 사용하기 쉽고 보기 좋게 만드는 것이었습니다. 이를 위해 Seaborn은 선언적 플로팅에 의존해 왔습니다. 이 방식은 플로팅 코드의 많은 부분을 추상화하여 감춥니다.

새로운 시스템은 더 직관적이고 어려운 Matplotlib 구문을 덜 의존하도록 설계되었습니다. 플롯은 교환 가능한 마커 유형을 사용하여 점진적으로 작성됩니다. 이는 기억해야 할 항목의 수를 줄이면서 논리적이고 반복 가능한 작업 흐름을 가능하게 합니다.

## 모든 것은 Plot()으로 시작합니다

모듈식 접근 방식을 사용하면 플롯을 작성하기 위해 barplot() 또는 scatterplot()과 같은 열두 가지 이상의 메서드 이름을 기억할 필요가 없습니다. 이제 모든 플롯은 단일 Plot() 클래스로 초기화됩니다.

<div class="content-ad"></div>


![Plot](/assets/img/2024-06-20-IntroducingSeabornObjects_1.png)

Plot() 클래스는 그래픽을 위한 빈 캔버스를 설정합니다. 다음 코드를 입력하여 예제를 확인하세요 (JupyterLab을 사용하여 표시됨):

```js
import seaborn.objects as so
so.Plot()
```

![Plot](/assets/img/2024-06-20-IntroducingSeabornObjects_2.png)


<div class="content-ad"></div>

현재 데이터가 없으므로 Seaborn의 내장 오픈소스 팁 데이터셋을 사용해봅시다. 이 데이터셋은 식당 데이터인 총 청구액, 팁 금액, 요일, 파티 규모 등을 기록합니다. 다음은 이를 판다스 DataFrame으로 로드하는 방법입니다:

```js
import pandas as pd
import seaborn as sns

# 팁 데이터셋 로드하기:
tips = sns.load_dataset('tips')

tips.head(3)
```

<img src="/assets/img/2024-06-20-IntroducingSeabornObjects_3.png" />

이제 Plot()을 데이터에 지정하고 x 및 y 축에 값을 할당할 수 있습니다. Seaborn Objects 인터페이스는 예상대로 판다스 DataFrame과 매우 잘 작동합니다.

<div class="content-ad"></div>


so.Plot(data=tips, x="total_bill", y="tip")


![Image](/assets/img/2024-06-20-IntroducingSeabornObjects_4.png)

이전 플롯보다 훨씬 나아진 것은 아니지만 x축과 y축을 주목해보세요. 이 플롯은 기본 데이터를 인식하고 있습니다. 이제 우리가 할 일은 Plot()에게 플롯 유형을 명시하는 방법을 알려주기만 하면 됩니다. 이것은 플롯 유형을 위해 전용 메소드를 호출해야 하는 것보다 직관적입니다.

```js
fig = so.Plot(data=tips, x='total_bill', y='tip').add(so.Dot(), color='sex')
# fig.show() 
```

<div class="content-ad"></div>


![그림](/assets/img/2024-06-20-IntroducingSeabornObjects_5.png)

여기에서는 먼저 Plot()을 호출하여 플롯을 초기화한 다음 Dot()을 호출하여 점 표시기를 추가하여 산점도를 생성했습니다! 직관적으로 산점도에는 점이 사용되기 때문에 이로써 산점도가 생성되었습니다.

이 시점에서 새 시스템으로 플롯을 구축하는 데 필요한 기본 구문을 사용했습니다:

- Plot() 호출,
- 데이터 인수 할당,
- 좌표 인수 할당 (예: x 및/또는 y),
- add() 메서드를 사용하여 플롯에 레이어 추가,
- add() 내부의 메서드를 호출하여 마커/플롯 유형 지정.


<div class="content-ad"></div>

여기 가장 기본적인 형태로 표시된 내용이 있어요:

```js
so.Plot(data=tips, x='total_bill', y='tip').add(so.Dot())
```

add() 메서드에 일부 mark를 전달해야하지만, 반드시 Dot()이어야 하는 것은 아닙니다. 다른 옵션들을 곧 살펴보겠어요.

## Plot() 메서드

<div class="content-ad"></div>

Plot() 클래스에는 표시물을 추가하고 데이터를 조정하며, 서브플롯을 만들고 크기를 조절하며, 서브플롯 간에 라벨을 공유하고 플롯을 저장하는 등을 할 수 있게 해주는 더 더러운 메서드가 12개 이상 포함되어 있습니다. 아래의 표에서 공식 문서에서 요약된 내용을 확인할 수 있어요.

![표](/assets/img/2024-06-20-IntroducingSeabornObjects_6.png) 

이러한 메서드는 점 표기법을 사용하여 호출됩니다. 이것이 전체 구문입니다 (가져오기 시 별칭을 사용하지 않았다고 가정):

seaborn.objects.Plot.add()

<div class="content-ad"></div>

## 괄호 사용하여 가독성 향상하기

Seaborn 객체를 사용하여 플롯을 작성할 때는 점 표기법(dot notation)을 사용하여 여러 가지 메소드를 연쇄적으로 호출합니다. 이는 코드를 약간 읽기 어렵게 만들 수 있습니다. 이를 완화하기 위해 플로팅 코드를 괄호로 묶는 것이 좋습니다. 이렇게 하면 새로운 메소드를 각각 다른 줄에 호출할 수 있습니다. 다음은 회귀선과 제목을 추가하는 예시입니다:

```js
fig = (so.Plot(data=tips, x='total_bill', y='tip')
       .add(so.Dot(), color='sex')
       .add(so.Line(color='red'), so.PolyFit())
       .label(title='팁 vs. 계산서'))

fig.show()    
```

<img src="/assets/img/2024-06-20-IntroducingSeabornObjects_7.png" />

<div class="content-ad"></div>

회귀 선을 레이어로 추가하려면 Line() 및 PolyFit() 클래스를 다시 add() 메서드로 호출했습니다. 그런 다음 Plot() 클래스의 label() 메서드를 사용하여 제목을 추가했습니다. 전체 플로팅 코드를 괄호로 묶어서 각 클래스 및 메서드 호출을 한 줄에 표시하면 쉽게 찾을 수 있습니다.

## Seaborn 객체 시스템 클래스

새 시스템에는 플롯을 생성하고 마커 유형을 추가하고 오차 막대 및 범위를 그리고 텍스트를 추가하고 값들을 집계하고 포스트된 포인트를 이동시키는 두 다섯 개 이상의 클래스가 포함되어 있습니다. 이 내용은 아래 표에서 공식 문서를 요약한 것입니다.

![IntroducingSeabornObjects_8](/assets/img/2024-06-20-IntroducingSeabornObjects_8.png)

<div class="content-ad"></div>

더 자세한 내용과 예시 플롯을 확인하려면 문서를 참조하세요. 마커 유형 스타일링에 대한 자세한 내용은 "마크 객체의 속성"을 참조하세요.

## 패싯 그리드 생성

새 시스템은 패싯 그리드 및 페어 플롯과 같은 다중 패널 플롯을 준비하는 데 탁월합니다. 패싯 그리드는 다중 플롯 그리드입니다. 데이터를 하위 집합으로 만들어 데이터 범위가 비교 가능한 플롯 열을 사용하여 하위 집합을 비교(시각화)할 수 있습니다.

Seaborn 객체를 사용하여 패싯 그리드를 생성하려면 Plot() 클래스의 메서드를 사용하세요.

<div class="content-ad"></div>

```js
fig = (so.Plot(tips, 'total_bill', 'tip')
       .add(so.Dot(), color='sex')        
       .add(so.Line(color='red'), so.PolyFit()))

fig.facet("sex")
```

<img src="/assets/img/2024-06-20-IntroducingSeabornObjects_9.png" />

우리는 지금 이전 그림을 '남성'과 '여성' 데이터 포인트가 섞이지 않도록 분리했습니다. 각 조건부 데이터 세트에서의 추세와 한계를 더 쉽게 파악할 수 있습니다.

Seaborn Objects는 선언적 그래픽 시스템이며, 일반적인 플롯을 만들기 위해 필요한 많은 오버헤드를 추상화하는 데 설계되었습니다. 그러나 이로 인해 융통성이 약간 부족할 수 있습니다. 또한, 이 시스템은 아직 개발 중이므로 일부 작업은 이전 시스템보다 직관적이지 않을 수 있습니다.

<div class="content-ad"></div>

예를 들어, facet 그리드 맨 위에 "super" 제목을 추가하려면 Matplotlib의 pyplot 모듈을 활용해야 합니다. 먼저 이를 import하고 사용하여 figure (fig)의 인스턴스를 만든 다음, 이전 suptitle() 메서드를 호출하여 제목을 입력합니다.

그 후, 새 Plot() 클래스의 on(fig) 메서드를 사용하여 데이터를 figure에 "post"합니다. 아래는 어떻게 보이는지에 대한 예시입니다:

```js
import matplotlib.pyplot as plt

fig = plt.Figure(figsize=(5, 6))
fig.suptitle("Tips vs. Total Bill by Gender")

(
    so.Plot(tips, 'total_bill', 'tip')
           .add(so.Dot(), color='sex')  
           .add(so.Line(color='red'), so.PolyFit())
           .facet(col='sex')
           .on(fig)
)   
```

<img src="/assets/img/2024-06-20-IntroducingSeabornObjects_10.png" />

<div class="content-ad"></div>

## 쌍 플롯 만들기

쌍 플롯 또는 산점도 매트릭스라고도 불리는 것은 데이터 집합 내에서 여러 변수 간의 쌍별 관계를 비교하는 데이터 시각화 기술입니다.

Seaborn 객체를 사용하여 쌍 플롯을 만들려면 Plot()을 사용하여 데이터 집합과 y축 값을 지정한 다음, pair() 메서드를 사용하여 DataFrame에서 x축 열을 선택한 후, add() 메서드를 사용하여 마크 유형과 마커를 열의 값으로 색칠할지 여부를 지정해야 합니다. 다음은 예시입니다:

```js
(
    so.Plot(tips, y='tip')
    .pair(x=['total_bill', 'size', 'sex'])
    .add(so.Dots(), color='sex')
)
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-IntroducingSeabornObjects_11.png" />

Dots() 대신 Dot()을 사용하는 것에 유의하십시오. 목표는 마커를 비워 놓은 점으로 자동으로 사용하여 과다 게시된 포인트를 보다 명확히 표시하는 것입니다.

## 막대와 계수

tips 데이터 세트에서 탐색적 분석을 수행 중이라면 남성과 여성 고객의 비율을 알고 싶을 것입니다. 이 작업은 Count() 및 Bar() 클래스를 사용하는 것입니다. 다시 한 번 전체적인 괄호를 사용하면 코드를 최대 가독성을 위해 구조화할 수 있다는 점에 주목하세요:

<div class="content-ad"></div>

```js
(
so.Plot(tips, x='sex')
    .add(so.Bar(), 
         so.Count(), 
         color='sex')
)
```

<img src="/assets/img/2024-06-20-IntroducingSeabornObjects_12.png" />

데이터셋에는 여성보다 남성이 거의 2배 많이 있어 보입니다.

# Summary


<div class="content-ad"></div>

시본(Seaborn)이 맷플롯립(Matplotlib)을 더 좋게 만드는 것처럼, 시본 객체 시스템은 시본을 향상시킵니다. 가장 큰 변화 중 하나는 이전 플로팅 방법을 Plot() 클래스로 대체하는 것입니다. 이 클래스는 "모든 일을 다 하는 반지" 역할을 합니다. 이제 모든 그림은 Plot()을 사용하여 초기화됩니다.

이전에는 각 플롯 유형마다 다른 메서드가 있었으며, 막대 차트의 경우 sns.barplot(), 산점도의 경우 sns.scatterplot()과 같은 메서드가 있었습니다. 더 많은 정보를 더하려면 종종 다른 유사한 메서드가 필요했었는데, 예를 들어 회귀선을 위한 sns.regplot()이 그중 하나입니다. 이러한 방식은 복잡한 플롯을 선언적으로 구축하기 어렵게 만들었습니다.

시본 객체의 모듈식 접근 방식으로, 이제 add()와 같은 직관적인 메서드를 사용하여 점(dot), 선(line) 및 막대(bar)와 같이 직관적으로 명명된 마커를 추가할 수 있습니다. 이 "그래픽 문법" 접근 방식을 사용하면 일관적이고 논리적인 방법으로 플롯을 빌드할 수 있습니다.

새 시스템은 선언적 플로팅을 사용하여 빠르고 "표준화된" 플롯을 만들도록 설계되었습니다. 더 복잡한 플롯을 위해서는 맷플롯립의 명령형 플로팅에 의존해야 할 것입니다 (다시 한번, 선언적 vs. 명령적 플로팅 참고).

<div class="content-ad"></div>

마지막으로, 새로운 시스템이 완전히 개발되지 않았음을 인지해야 합니다. Seaborn 문서를 인용하면 "새 인터페이스는 현재 실험적이며 완전하지 않습니다. 심각한 용도로 충분히 안정적이지만, 몇 가지 문제점과 누락된 기능이 있을 수 있습니다."

## 추가 자료

Seaborn Objects를 파악하는 데 유용한 몇 가지 추가 참고 자료입니다:

Anaconda: Seaborn Objects 시스템 소개

<div class="content-ad"></div>

시본 버전 0.12.0은 ggplot2와 유사한 인터페이스를 가지고 있어요.

시본 0.12: 객체 인터페이스 및 선언적 그래픽에 대한 통찰력 있는 가이드

시본 객체 시스템에 대한 빠른 소개

시본.objects 인터페이스

<div class="content-ad"></div>

그래픽의 문법

# 감사합니다!

읽어 주셔서 감사합니다. 미래에 더 많은 빠른 성공 데이터 과학 프로젝트를 위해 제 팔로우를 부탁드립니다.