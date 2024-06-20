---
title: "분석력을 향상시키는 5가지 유용한 시각화 방법"
description: ""
coverImage: "/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_0.png"
date: 2024-06-19 09:34
ogImage: 
  url: /assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_0.png
tag: Tech
originalTitle: "5 Useful Visualizations to Enhance Your Analysis"
link: "https://medium.com/towards-data-science/5-useful-visualizations-to-enhance-your-analysis-022a5dd67912"
---


아래는 Markdown 형식으로 표를 변경한 코드입니다.


![Visualization](/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_0.png)

# 소개

Seaborn은 오랫동안 사용되어 왔습니다.

비전문가들도 강력한 그래픽을 구축할 수 있도록 도와주기 때문에, 데이터 시각화 라이브러리 중에서 가장 유명하고 많이 사용되는 것 중 하나라고 생각합니다. 또한 통계에 근거한 통찰력을 얻는 데 도움이 되기 때문입니다.


<div class="content-ad"></div>

저는 통계학자가 아닙니다. 데이터 과학에 관심을 가지고 있어서 그 분야에 대한 통계 개념을 배워 직무를 더 잘 수행하기 위해 노력하고 있어요. 그래서 히스토그램, 신뢰구간, 그리고 선형 회귀 분석에 매우 적은 양의 코드로 간단하게 접근할 수 있어서 정말 좋아해요.

Seaborn의 구문은 매우 기본적입니다: sns.type_of_plot(data, x, y)요. 이 간단한 템플릿을 사용하여 막대 그래프, 히스토그램, 산점도, 선 그래프, 상자 그림 등 다양한 시각화를 만들 수 있어요.

하지만 이 게시물은 그것들에 대해 이야기하려는 것이 아니에요. 여러분의 분석에 차이를 만들어 줄 다른 향상된 종류의 시각화에 대해 이야기할 거예요.

어떤 시각화들이 있는지 함께 살펴보겠습니다.

<div class="content-ad"></div>

# 시각화

이 시각화를 만들고 이 연습과 함께 코드를 작성하려면 seaborn을 import합니다. import seaborn as sns.

여기에서 사용된 데이터셋은 Paulo Cortez가 작성하고 크리에이티브 커먼즈 라이센스하에 UCI 저장소에 기즐한 학생 성적 데이터입니다. 아래 코드를 사용하여 파이썬에서 바로 가져올 수 있습니다.

```js
# UCI Repo 설치
pip install ucimlrepo

# 데이터셋 로딩
from ucimlrepo import fetch_ucirepo 
  
# 데이터셋 가져오기 
student_performance = fetch_ucirepo(id=320) 
  
# 데이터 (팬더스 데이터프레임 형식) 
X = student_performance.data.features 
y = student_performance.data.targets

# 시각화를 위해 X와 Y 수집
df = pd.concat([X,y], axis=1)

df.head(3)
```

<div class="content-ad"></div>


![](/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_1.png)

Now let's talk about the 5 visualizations.

## 1. Stripplot

The first plot picked is the stripplot. And you will quickly see why this is interesting. If we use this simple line of code, it will display the following viz.


<div class="content-ad"></div>

```js
# 플롯
sns.stripplot(data=df);
```

<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_2.png" />

와우! 거의 Pandas의 `df.describe()`와 같은 차트입니다. x축에는 모든 수치 변수가 나타납니다. y축은 해당 변수의 범위 값입니다. 따라서 그림을 보면 몇 가지 흥미로운 통찰력을 빠르게 얻을 수 있습니다.

- 시각적으로 적어도 이상치 실례가 적습니다.
- 대부분의 수치 변수는 0에서 5 사이로 범위가 있습니다. 이는 데이터의 설명에 해당 변수가 범주화되었음을 보여줍니다. 따라서 여기서 가장 좋은 방법은 해당 변수를 범주형으로 변환하는 것입니다.
- 이 데이터셋의 학생들은 15 ~ 23세 사이입니다.
- 첫 번째 학기(G1)와 두 번째 학기(G2) 성적의 분포는 매우 유사합니다.

<div class="content-ad"></div>

정말 대단하죠! 코드 한 줄로 생성된 이 플롯에서 우리가 얻은 정보의 양을 보세요!

이 그래픽에 대해 더 탐구할 만한 다른 부분이 많이 있어요. 몇 가지 다른 인수를 추가하고 개선할 수 있어요. 실수와 최종 성적 G3에 대한 그래픽을 만들어서 학교별로 분리해 봅시다.

이렇게요!

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_3.png" />

좋아요! 실패 횟수가 적은 학생들이 높은 성적을 받고 있는 것을 예상대로 확인할 수 있어요. 그리고 두 학교 모두 성적면에서 꽤 유사해 보여요.

이제 다음으로 넘어가 봅시다.

## 2. Catplot

<div class="content-ad"></div>

음-음... 우리는 stripplot을 만들었지만, 그것은 숫자형 변수에만 해당해요. 그럼 범주형 변수는 어떨까요?

여기서 catplot이 유용합니다. 이것은 카테고리별 관측치를 플롯으로 나타내줄 거에요. 학교별 성적을 확인하고 싶다면, 이렇게 간단해요.

```js
#CatPlot
sns.catplot(data=df, x='school', y='G3');
```

![이미지](/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_4.png)

<div class="content-ad"></div>

기본적으로 카테고리별로 산점도가 표시됩니다. 그러나 kind 인수를 사용하여 막대, 상자, 바이올린과 같은 다른 유형으로 변경할 수 있습니다.

```js
#플롯
sns.catplot(data=df, x='school', y='G3', kind='box');
sns.catplot(data=df, x='school', y='G3', kind='bar');
```

![이미지](/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_5.png)

이제 상자 그림이 분포를 정확하게 보여주지 않는다는 점을 살펴봅니다. 이것은 요즘 이야기가 되고 있는 주제입니다. 사람들은 통계에 익숙하지 않은 사람들을 포함해 상자 플롯을 이해하는 데 어려움을 겪는다. 따라서 이 유형의 플롯에 대한 기본값은 산점도입니다.

<div class="content-ad"></div>

하지만 백분위수 개념을 알고 상자 그림을 보는 데 편한 사람조차도 상자의 선안에 얼마나 많은 데이터가 있는지 파악하기 어려울 수 있습니다.

그래서 seaborn 팀은 이 문제를 해결하려고 다음에 제시될 향상된 상자 그림을 사용했습니다.

## 3. Boxenplot

Boxenplot은 향상된 상자 그림입니다. 왜냐하면 상자 그림의 선분이 없으며 상자의 크기가 각 백분위수의 데이터 양에 따라 다르기 때문입니다. 한 개를 그려봅시다.

<div class="content-ad"></div>

```js
# BoxenPlot
sns.boxenplot(data=df, x='traveltime', y='G3');
```

다음 그림을 보면 상자의 너비가 각 백분위별 관측치의 양에 따라 변하는 것을 볼 수 있습니다. 여행 시간 범주 1(15분 이하)은 대부분의 데이터 포인트가 중간인 10에서 14 사이에 있으며, 분포는 매우 정규와 유사합니다.

<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_6.png" />

Travel Time == 1의 학점만을 분리해 보면 다음과 같은 그래픽을 볼 수 있습니다.

<div class="content-ad"></div>

```js
sns.displot(df.query('traveltime == 1'),
              x='G3', kind='kde', aspect=2)
plt.title('Distribution KDE of Final Grade on Travel Time == 1');
```

왼쪽의 첫 번째 상자 그림과 매우 관련이 있는 것을 관찰할 수 있습니다: 하단에서 격리된 몇 개의 점에 이어 거의 정규 분포에 가까운 분포가 있습니다.

<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_7.png" />

실제로 상자 그림을 향상시킨 것입니다. 그러나 더 많은 그래픽 유형을 공부할 필요가 있습니다. 계속 전진하겠습니다.

<div class="content-ad"></div>

## 4. lmplot

lmplot은 Linear Model plot의 줄임말로, 데이터셋의 간단한 선형 모델을 시각화하는 가장 쉬운 방법입니다. Grade 1과 최종 학년 점수 간의 관계를 확인하고 싶다면, 다음 코드로 선형 모델을 시각화할 수 있습니다.

```js
sns.lmplot(data=df, x="G1", y='G3')
```

결과가 표시됩니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_8.png" />

하지만 이 함수의 장점이 최고라고 할 수는 없어요. 우리는 색조를 추가하여 다중 수준 회귀를 모의할 수 있어요. 이 경우에는 두 성별이 유사한 성능을 발휘하고 있어서, 그 범주에 기반한 계층 선형 모델을 만드는 것이 의미가 없겠죠.

```js
sns.lmplot(data=df, x="G1", y= 'G3', hue='sex')
```

<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_9.png" />


<div class="content-ad"></div>

게다가, 대상 변수와 비교하는 다양한 선형 모델을 추가하는 것도 간단합니다. 예를 들어, col 인수를 사용하여 서로 다른 학교에 대한 모델을 추가해봅시다.

```js
sns.lmplot(data=df, x="G1", y='G3', hue='sex', col='school')
```

<img src="/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_10.png" />

보다 깊은 분석을 위한 매우 유용한 플롯입니다.

<div class="content-ad"></div>

자, 이 글의 마지막 유형을 살펴보겠습니다.

## 5. residplot

residplot은 선형 회귀의 잔차를 그리는 것입니다. 하지만, 그것이 왜 중요한지요?

음, 선형 모델의 잔차로 하는 테스트 중 하나는 등분산성입니다. 즉, 잔차가 균일해야 한다는 것을 확인하는 것이죠. 우리가 선 (linear)을 따르는 관계를 분석한다면, 오류도 일정 범위 내에서 선을 따를 것이라는 것이 합리적입니다. 그래서 residplot을 볼 때에는 유사한 분산을 가진 직사각형 모양을 보고 싶습니다.

<div class="content-ad"></div>

```js
sns.residplot(data=df, x="G1", y= 'G3')
```

Grade 1로 최종 성적을 예측하는 선형 모델의 잔차를 보면 거의 균일한 집합을 볼 수 있지만 몇 가지 예외가 있습니다.

![residual plot](/assets/img/2024-06-19-5UsefulVisualizationstoEnhanceYourAnalysis_11.png)

# 떠나시기 전에


<div class="content-ad"></div>

좋아요. 이제 우리는 분석에 사용할 수 있는 또 다른 5가지 그래픽 유형을 갖추었습니다.

좋은 탐색적 데이터 분석은 시간이 걸립니다. 그 과정에서 많은 질문들이 나타나고 데이터에 대한 이해를 풍부하게 만들어줍니다. 그래서 더 많은 작업이 필요한 질문들에 대해 심층적으로 파고들기 위한 향상된 도구 몇 개를 가지고 있는 것이 중요합니다.

- stripplot: 데이터 포인트를 전체로 시각화하는 데 도움이 됩니다. describe 함수 시각화와 유사합니다.
- catplot: stripplot과 비슷하지만 범주에 대한 것입니다. 점, 막대, 상자와 같은 여러 형태로 나타낼 수 있습니다.
- boxenplot: 상자 그림의 향상된 버전으로 "수염에 얼마나 많은 데이터가 있는지"와 같은 공백을 채웁니다.
- lmplot: 두 변수에 대한 빠르고 간단한 선형 모델을 생성할 수 있습니다. hue 인수를 사용하여 다중 수준 회귀를 시각화하거나 col 인수로 facet grid를 생성할 수도 있습니다.
- residplot: 선형 모델의 잔차를 살펴보고 잔차의 등분산성에 대한 이탈이 어디서 발생하는지 확인하는 데 유용합니다.

이 내용이 마음에 들면 팔로우해주세요.

<div class="content-ad"></div>

또한, LinkedIn에서 나를 찾을 수 있습니다. 

# 참고문헌