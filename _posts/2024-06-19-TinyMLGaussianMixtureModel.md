---
title: "작고 강력한 TinyML  가우시안 혼합 모델"
description: ""
coverImage: "/assets/img/2024-06-19-TinyMLGaussianMixtureModel_0.png"
date: 2024-06-19 02:22
ogImage: 
  url: /assets/img/2024-06-19-TinyMLGaussianMixtureModel_0.png
tag: Tech
originalTitle: "TinyML — Gaussian Mixture Model"
link: "https://medium.com/@thommaskevin/tinyml-gaussian-mixture-model-9730693fb8a4"
---


수학적 기초부터 엣지 구현까지

# 소셜 미디어:

👨🏽‍💻 Github: thommaskevin/TinyML (github.com)
👷🏾 Linkedin: Thommas Kevin | LinkedIn
📽 Youtube: Thommas Kevin — YouTube
👨🏻‍🏫 연구 그룹: Conecta.ai (ufrn.br)

![이미지](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_0.png)

<div class="content-ad"></div>

## 개요

# 1 — 가우시안 혼합 모델 이론

가우시안 혼합 모델(GMM)은 넓은 인구군 내에서 정규 분포를 따르는 하위 그룹을 묘사하기 위한 확률적인 프레임워크로 작용합니다. 기존의 모델과는 달리 혼합 모델은 데이터 점이 어떤 특정 하위 그룹에 속하는지를 확인할 필요가 없으며, 이러한 하위 그룹들을 자율적으로 학습할 수 있습니다. 이러한 특성으로 인해 GMM은 비지도 학습의 우수한 예시로 인식됩니다.

예를 들어, 사람들의 키 데이터를 모델링한다고 가정해 봅시다. 일반적으로, 키는 성별별로 정규 분포로 모델링되며, 남성은 평균적으로 약 5`10"이고 여성은 5`5"입니다. 개별 데이터 포인트의 성별 할당을 미리 알 수 없는 경우, 모든 키의 분포는 두 개의 정규 분포의 결합으로 개념화됩니다. 각각 다르게 스케일되고(서로 다른 분산을 가짐) 이동(다른 평균을 가짐)된 두 개의 정규 분포를 포함하는 모델은 가우시안 혼합 모델(GMM)의 예시입니다. 물론, GMM은 두 가지 이상의 구성 요소를 포함할 수 있습니다. GMM을 데이터 모델링에 사용할 때, 개별 정규 분포 구성 요소의 매개변수를 추정하는 것이 핵심적인 도전입니다.

<div class="content-ad"></div>

GMM은 음성 데이터에서의 특징 추출을 포함한 다양한 분야에서 응용 프로그램을 찾습니다. 또한 GMM은 여러 객체가 포함된 객체 추적 시나리오에서 널리 사용됩니다. 이러한 경우에서 혼합 구성 요소의 수와 각각의 평균은 비디오 시퀀스 내 각 프레임에서 객체 위치를 예측하는 데 도움이 됩니다.

## 1.1 — 수학적 기초

가우시안 혼합 모델은 두 세트의 매개변수로 특징 지어집니다: 혼합 구성 요소 가중치 및 구성 요소 평균 및 분산/공분산. K개의 구성 요소가 있는 가우시안 혼합 모델의 경우, k번째 구성 요소는 1차원 경우 μk의 평균과 (σ_k)²의 분산, 다변량 경우에는 평균 벡터 μk와 공분산 행렬 Σk를 가집니다. 혼합 구성 요소 가중치는 구성 요소 Ck에 대한 ϕk로 표시되며 다음 제약 조건을 갖습니다

![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_1.png)

<div class="content-ad"></div>

만약 구성 요소의 가중치가 학습되지 않은 경우, 그들은 구성 요소에 대한 사전 분포로 해석될 수 있으며, 데이터 점 x가 구성 요소 Ck에 의해 생성될 확률인 ϕk로 표현될 수 있습니다. 그러나 학습된 경우, 그들은 데이터를 통해 주어진 구성 요소 확률의 사후 추정치를 나타냅니다.

가우시안 혼합 모델의 확률 밀도 함수 p(x)는 다음과 같이 표현될 수 있습니다:

![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_2.png)

<div class="content-ad"></div>

아래에 표가 있습니다:

- N(x∣μi,σi)은 평균이 μi이고 표준편차가 σi인 i번째 가우시안 구성 요소의 확률 밀도 함수를 나타냅니다.
- ϕi는 i번째 구성 요소와 관련된 가중치입니다.

가우시안 확률 밀도 함수를 대체하면:

<div class="content-ad"></div>

확률의 합이 11이 되도록 확인하였습니다:

![이미지](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_4.png)

## 1.2 — 모델

혼합 모델의 구성 요소 K가 알려진 경우, 기대 최대화 (EM)는 모델의 매개변수를 추정하는 데 사용되는 주요 기술입니다. 빈도론적 확률 이론에서 모델은 일반적으로 최대 우도 추정 방법을 통해 학습됩니다. 이러한 방법은 모델 매개변수가 주어진 경우 데이터를 관찰할 가능성 또는 확률을 최대화하기 위해 노력합니다. 그러나 혼합 모델에 대한 최대 우도 솔루션을 로그 우도의 미분을 통해 얻고 영의 값을 구하는 것은 흔히 분석적으로 불가능합니다.

<div class="content-ad"></div>

Expectation maximization (EM)는 최대 우도 추정을 위한 수치적 접근을 제공합니다. 해당 방법은 모델 파라미터를 업데이트하는 닫힌 형식의 표현이 유도될 때 사용됩니다. EM은 각 반복에서 데이터의 최대 우도가 꾸준히 향상되는 유리한 특성을 갖는 반복적인 알고리즘입니다. 이러한 특성은 알고리즘이 지역 최댓값 또는 안장점으로 수렴하게 함을 보장합니다.

## 1.2.1— 가우시안 혼합 모델에 대한 EM

혼합 모델의 Expectation maximization (EM)은 두 가지 반복 단계로 구성됩니다:

- Expectation 단계 (E 단계): 이 단계에서 알고리즘은 현재의 모델 파라미터인 ϕk, μk, σk를 고려하여 각 데이터 지점 xi에 대한 구성 요소 할당의 기대값 p(Ck∣xi)을 계산합니다.
- Maximization 단계 (M 단계): 이 단계는 E 단계에서 계산된 기대값을 모델 파라미터에 대해 최대화하는 것을 포함합니다. 이는 ϕk, μk, σk의 값을 업데이트하는 것을 의미합니다.

<div class="content-ad"></div>

반복적인 과정은 알고리즘이 수렴할 때까지 계속되며 최대 우도 추정치를 생성합니다. 이 알고리즘의 합리적인 근거는 구성 요소 할당인 p(Ck∣xi)를 알고 있으면 ϕk, μk, σk를 해결하는 작업을 단순화하고, 이러한 매개변수를 알면 p(Ck∣xi)의 추론을 용이하게 합니다. E 단계는 후자의 경우에 해당하며, M 단계는 전자에 해당합니다. 특정 값을 고정된 값이나 이미 알려진 값으로 처리하며 알고리즘은 미지의 매개변수의 최대 우도 추정치를 효율적으로 계산합니다.

## 1.2.2 — 단변량 가우시안 혼합 모델을 위한 알고리즘

단변량 가우시안 혼합 모델에 대한 Expectation-Maximization (EM) 알고리즘은 다음과 같이 진행됩니다:

![이미지](https://miro.medium.com/v2/resize:fit:720/0*UFmfHWAXR3iI-xz5.gif)

<div class="content-ad"></div>

- 초기화: 데이터를 기반으로 모델 매개변수 ϕk, μk 및 σk를 합리적인 값으로 초기화합니다.
- 반복적인 E 단계: 각 데이터 점 xi에 대해 현재 매개변수 추정치를 사용하여 각 구성 요소 Ck에 대한 사후 확률 p(Ck∣xi)를 계산합니다:

![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_5.png)

- 반복적인 M 단계: 계산된 사후 확률을 기반으로 매개변수 추정치 ϕk, μk 및 σk를 업데이트합니다:

![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_6.png)

<div class="content-ad"></div>

- 수렴 확인: 매개변수 추정치가 수렴할 때까지 E 단계와 M 단계를 반복합니다. 즉, 모든 매개변수 θ^t에 대해 ∣θ^t−θ^t−1∣≤ϵ이 될 때까지 반복합니다. 여기서 ϵ은 사용자가 정의한 허용 오차입니다.

EM 알고리즘은 E와 M 단계 사이를 반복하면서 수렴합니다. 이는 모델 매개변수의 최대 우도 추정치를 얻습니다. 이 프로세스는 두 성분으로 구성된 이차 가우시안 혼합 모델을 나타내는 그림 우측에 그래픽으로 표시되어 있습니다.

## 1.3— 평가 방법

지도 학습과 달리 군집 분석에는 다양한 군집화 알고리즘의 결과를 평가하는 데 적용할 수 있는 견고한 평가 메트릭이 부족합니다.

<div class="content-ad"></div>

## 1.3.1 - Likelihood Ratio Test

우도비 검정 (Likelihood Ratio Test, LRT)은 클러스터링 모델의 맥락에서도 적용할 수 있으며, 서로 다른 클러스터링 솔루션의 적합성을 비교하는 데 사용될 수 있습니다. 

k개 클러스터를 갖는 하나의 클러스터링 솔루션(더 간단한 모델)과 k+1개 클러스터를 갖는 다른 클러스터링 솔루션(더 복잡한 모델)이 있다고 가정해 보겠습니다. LRT를 사용하여 더 복잡한 모델이 더 간단한 모델에 비해 데이터 적합성을 유의하게 향상시키는지 확인할 수 있습니다.

다음과 같이 표기해 봅시다:

<div class="content-ad"></div>

- k 클러스터를 갖는 더 간단한 모델의 데이터 가능성인 L(θ0).
- k+1 클러스터를 갖는 더 복잡한 모델의 데이터 가능성인 L(θ).

이 경우의 우도비 검정 통계량은 다음과 같습니다:

![Likelihood Ratio Test statistic](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_7.png)

이전과 마찬가지로, 어떤 가정 하에 카이제곱 분포를 따르는 통계량을 구하기 위해 -2ln을 사용합니다.

<div class="content-ad"></div>

- 데이터에 두 클러스터링 모델을 적합시켜 보세요.
- 각 모델에서 데이터의 가능도를 계산하세요.
- 위의 공식을 사용하여 가능도 비율 검정 통계량을 계산하세요.
- 카이제곱 분포의 자유도를 결정하세요. 클러스터링 문맥에서, 이는 종종 두 모델 간의 매개변수 수의 차이로 계산됩니다.
- 계산된 Λ값을 선택한 유의수준에서 카이제곱 분포의 임계값과 비교해 보세요. 만약 Λ 값이 임계값을 초과한다면, 더 복잡한 클러스터링 솔루션이 간단한 솔루션보다 데이터에 더 적합하다는 것을 시사합니다.

클러스터링을 위한 가능도 비율 검정은 데이터가 클러스터 내에서 독립적이고 동일하게 분포되어야 하며, 특정 분포(예: 다변량 가우시안)를 따를 것으로 가정합니다. 또한 이 검정은 가능도 비율 통계의 점근 특성이 성립하기 위해 표본 크기가 충분히 크다고 가정합니다.

## 1.3.2 —베이지안 정보 기준

베이지안 정보 기준(BIC)은 한정된 모델 집합 사이의 모델 선택 기준입니다. 이는 모델의 적합도와 사용된 매개변수 수를 균형있게 고려합니다. BIC는 모델 내의 매개변수 수가 표본 크기에 비해 크지 않은 상황에서 특히 유용합니다.

<div class="content-ad"></div>

BIC 공식은 다음과 같습니다:

![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_8.png)

여기서:

- L은 모델의 가능도 함수의 최대화된 값입니다.
- k는 모델 내의 매개변수 수입니다.
- n은 샘플 크기입니다.

<div class="content-ad"></div>

BIC은 더 많은 매개변수를 가진 모델을 벌점을 부여하여 오버피팅을 억제합니다. 벌점 항인 k⋅log(n)은 매개변수 수와 샘플 크기 둘 다에 비례하여 증가하며, 샘플 크기가 크지 않은 경우에는 간단한 모델을 선호하도록 합니다.

BIC는 기준값을 최소화하는 모델을 선택하는 것을 목표로 합니다. 따라서 후보 모델 집합 중 BIC가 가장 낮은 모델이 최적으로 간주되며, 모델 적합성과 복잡성을 균형있게 고려합니다.

BIC는 베이지안 원리에서 유도되었지만 베이지안 모델 선택 이론에서 나온 것이며, 실제 모델 선택 목적으로 자주 사용되는 빈도주의적 방법입니다. 회귀, 군집, 시계열 모델링을 포함한 다양한 통계 분석에서 오버피팅을 피하고 모델을 비교하는 체계적인 방법을 제공하여, 가치 있는 도구로 활용됩니다.

# 2 — TinyML 구현

<div class="content-ad"></div>

이 예시를 통해 ESP32, Arduino, Raspberry 및 기타 다양한 마이크로컨트롤러 또는 IoT 장치에서 머신러닝 알고리즘을 구현할 수 있습니다.

2.1 — 라이브러리 가져오기

```js
import numpy as np 
import pandas as pd 
import matplotlib.pyplot as plt 
import seaborn as sns
import plotly as py
import plotly.graph_objs as go
from sklearn.mixture import GaussianMixture
from sklearn.discriminant_analysis import StandardScaler
import warnings
warnings.filterwarnings('ignore')
```

2.2 — 데이터셋 불러오기

<div class="content-ad"></div>

```python
df = pd.read_csv('./data/Mall_Customers.csv')
df.head()
```

![Image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_9.png)

```python
df.info()
```

![Image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_10.png)

<div class="content-ad"></div>


---
```js
df.describe()
```

![Visualization](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_11.png)

### 2.3 — Dataset Visualization

```python
plt.figure(1, figsize=(15, 6))
n = 0
for x in ['Age', 'Annual Income (k$)', 'Spending Score (1-100)']:
    n += 1
    plt.subplot(1, 3, n)
    plt.subplots_adjust(hspace=0.5, wspace=0.5)
    sns.distplot(df[x], bins=15)
    plt.title('Distplot of {}'.format(x))
    plt.grid()
plt.show()
```


<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_12.png)

```js
sns.pairplot(df, vars=['Spending Score (1-100)', 'Annual Income (k$)', 'Age'])
```

![image](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_13.png)

2.4 — Evaluation Methods


<div class="content-ad"></div>

```js
X = df[['나이', '지출 점수 (1-100)']].iloc[:, :].values
```

2.4.1 — 우도 비율 검정

```js
# 서로 다른 구성 요소 수로 GMM 학습
n_components_range = range(1, 20)
models = [GaussianMixture(n, random_state=42).fit(X) for n in n_components_range]
bic_scores = [model.bic(X) for model in models]  # 베이지안 정보 기준 (BIC) 점수

# 우도 비율 검정
lrts = []
for i in range(len(bic_scores) - 1):
    lr = 2 * (models[i].score(X) - models[i + 1].score(X))  # 우도 비율 통계량
    lrts.append(lr)
```

```js
plt.figure(figsize=(16, 6))
plt.subplot(1, 2, 1)
plt.plot(range(1, len(lrts) + 1), lrts, marker='o')
plt.xlabel('구성 요소 수')
plt.ylabel('우도 비율 검정 통계량')
plt.title('우도 비율 검정')
plt.grid()
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TinyMLGaussianMixtureModel_14.png" />

2.4.2 — Bayesian Information Criterion

```js
# BIC 점수 플롯하기
plt.figure(figsize=(16, 6))
plt.plot(n_components_range, bic_scores, marker='o')
plt.xlabel('구성 요소 수')
plt.ylabel('BIC 점수')
plt.title('베이지안 정보 기준 (BIC)')
plt.grid()
```

<img src="/assets/img/2024-06-19-TinyMLGaussianMixtureModel_15.png" />  

<div class="content-ad"></div>


# 가설 검정 수행
threshold = 3.84 # 자유도가 1이고 유의수준 alpha=0.05 일 때 카이제곱 분포의 임계값
num_components = np.argmax(lrts) + 1 # 최대 우도를 갖는 구성 요소의 수
print("선택된 구성 요소(클러스터) 수:", num_components)


2.5 — 가우시안 혼합 모델


algorithm = (GaussianMixture(n_components=num_components, init_params='k-means++', max_iter=300, 
                        tol=0.0001, random_state=42))
algorithm.fit(X)


![이미지](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_16.png)


<div class="content-ad"></div>

```js
y_GMM = algorithm.fit_predict(X)
```

```js
df['cluster'] = pd.DataFrame(y_GMM)
df.head()
```

<img src="/assets/img/2024-06-19-TinyMLGaussianMixtureModel_17.png" />

2D Visualization

<div class="content-ad"></div>

```js
# 클러스터 레이블 예측
라벨 = y_GMM

# 확률 밀도를 플로팅하기 위한 메시 그리드 생성
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100), np.linspace(y_min, y_max, 100))
Z = -algorithm.score_samples(np.vstack([xx.ravel(), yy.ravel()]).T)
Z = Z.reshape(xx.shape)

# 클러스터별로 색칠된 데이터 포인트 플로팅
plt.figure(figsize=(16, 6))
plt.scatter(X[:, 0], X[:, 1], c=라벨, s=50, cmap='viridis', alpha=0.5)

# 알고리즘의 등고선 플로팅
plt.contour(xx, yy, Z, norm=LogNorm(vmin=1.0, vmax=1000.0), levels=np.logspace(0, 3, 10), cmap='viridis')

# 컴포넌트의 평균값 플로팅
plt.scatter(algorithm.means_[:, 0], algorithm.means_[:, 1], marker='x', s=100, c='red', label='평균값')

plt.xlabel('X')
plt.ylabel('Y')
plt.title('클러스터링이 포함된 가우시안 혼합 모델')
plt.colorbar(label='클러스터')
plt.legend()
plt.grid()

plt.show()
```

<img src="/assets/img/2024-06-19-TinyMLGaussianMixtureModel_18.png" />

3D 시각화

```js
trace1 = go.Scatter3d(
    x= df['나이'],
    y= df['소비 점수 (1-100)'],
    z= df['연간 소득 (k$)'],
    mode='markers',
     marker=dict(
        color = df['클러스터'], 
        size= 10,
        line=dict(
            color= df['클러스터'],
            width= 18
        ),
        opacity=0.8
     )
)
data = [trace1]
layout = go.Layout(
    title= '나이, 소득 및 소비 점수에 대한 클러스터',
    scene = dict(
            xaxis = dict(title  = '나이'),
            yaxis = dict(title  = '소비 점수'),
            zaxis = dict(title  = '연간 소득')
        ),
    width=1200,  
    height=800,  
)
fig = go.Figure(data=data, layout=layout)
py.offline.iplot(fig)
```

<div class="content-ad"></div>

마크다운 형식으로 코드를 옮기기 위해 테이블 태그를 변경할게요. 아래는 C++ 코드를 JavaScript로 변환하는 함수입니다. 

<div class="content-ad"></div>

```js
means = algorithm.means_
covariances = algorithm.covariances_
coefficients = algorithm.weights_
cpp_code = convert_to_cpp_code(means, covariances, coefficients)
```

```js
#include <math.h>
using namespace std;

const int num_components = 7;
const int num_features = 2;

namespace TKSF
{
  namespace ML
  {
    namespace Port
    {
      class GMM
      {
      private:
        float means[num_components][num_features] = {
            {56.60931459453662, 49.92251390822188},
            {29.264921745717615, 74.5990614961554},
            {43.54207887008299, 10.496799818644392},
            {41.078202034837176, 34.79082042618642},
            {31.101406340255828, 90.2290512000496},
            {31.37324943091291, 61.64977286632278},
            {22.872325540804805, 49.948720505624074},
        };

        float covariances[num_components][num_features][num_features] = {
            {83.24599787684558, 2.890435963609233}, {2.890435963609235, 35.68617486791098},
            {29.310245867234695, -3.6811694981292513}, {-3.68116949812925, 11.065658605910743},
            {176.1500923010437, 13.01774646138936}, {13.017746461389358, 29.65985065852867},
            {75.42208070910617, -6.070541531090654}, {-6.0705415310906545, 97.8692020437219},
            {29.297433369873897, 4.575820469751143}, {4.575820469751143, 23.020446452070658},
            {33.43445449031923, -13.501586578314814}, {-13.501586578314813, 6.152388053936477},
            {16.965821015319975, -2.507134562074277}, {-2.507134562074276, 45.30126223322478},
        };

        float coefficients[num_components] = {0.1984245445224706, 0.14337213895448095, 0.1649683239019345, 0.1911025085379841, 0.1413696101261269, 0.036998614584665225, 0.12376425937233766};

        float component_pdf(float x[num_features], float mean[num_features], float covariance[num_features][num_features])
        {
          float det = covariance[0][0] * covariance[1][1] - covariance[0][1] * covariance[1][0];
          float inv_cov[num_features][num_features] = {covariance[1][1] / det, -covariance[0][1] / det}, {-covariance[1][0] / det, covariance[0][0] / det};
          float exponent = -0.5 * (inv_cov[0][0] * (x[0] - mean[0]) * (x[0] - mean[0]) + 2 * inv_cov[0][1] * (x[0] - mean[0]) * (x[1] - mean[1]) + inv_cov[1][1] * (x[1] - mean[1]) * (x[1] - mean[1]));
          float coefficient = 1.0 / sqrt(2 * M_PI * det);
          return coefficient * exp(exponent);
        }

      public:
        int predict(float x[num_features])
        {
          float probabilities[num_components] = {0};
          for (int i = 0; i < num_components; ++i)
          {
            probabilities[i] = coefficients[i] * component_pdf(x, means[i], covariances[i]);
          }
          int maxIndex = 0;
          for (int i = 1; i < num_components; ++i)
          {
            if (probabilities[i] > probabilities[maxIndex])
            {
              maxIndex = i;
            }
          }
          return maxIndex;
        }
      };
    }
  }
}
```

2.7 — Saves the template in a .h file

```js
with open('./GMM/GMM.h', 'w') as file:
    file.write(cpp_code)
```

<div class="content-ad"></div>

2.8 — Arduino 스케치 완성

아래와 같이 아두이노 스케치에 "GMM.h" 파일을 포함하세요:

```cpp
#include "GMM.h"
Eloquent::ML::Port::KMeans k_means;
void setup() {
  Serial.begin(9600);
}
void loop() {
  // 입력 값
  float input[] = {15, 39}; 
  // 예측
  int cluster = k_means.predict(input);
  // 찾은 클러스터 출력
  Serial.print("클러스터 맴버 (실제 값은 2): ");
  Serial.println(cluster);
  delay(2000);
}
```

2.9 — 결과

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TinyMLGaussianMixtureModel_20.png" />

[TinyML/11_GMM project on GitHub](https://github.com/thommaskevin/TinyML)

## If you found it helpful, how about treating me to a cup of coffee? ☕️💰 (Bitcoin)

Bitcoin address: bc1qzydjy4m9yhmjjrkgtrzhsgmkq79qenvcvc7qzn

<div class="content-ad"></div>

![TinyML Gaussian Mixture Model](/assets/img/2024-06-19-TinyMLGaussianMixtureModel_21.png)