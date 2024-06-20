---
title: "작은 기계 학습 - 포아송 회귀"
description: ""
coverImage: "/assets/img/2024-06-20-TinyMLPoissonRegression_0.png"
date: 2024-06-20 16:45
ogImage: 
  url: /assets/img/2024-06-20-TinyMLPoissonRegression_0.png
tag: Tech
originalTitle: "TinyML — Poisson Regression"
link: "https://medium.com/@thommaskevin/tinyml-poisson-regression-5174d88479f5"
---


수학적 기초부터 엣지 구현까지

# 소셜 미디어:

👨🏽‍💻 Github: thommaskevin/TinyML (github.com)
👷🏾 Linkedin: Thommas Kevin | LinkedIn
📽 Youtube: Thommas Kevin — YouTube
👨🏻‍🏫 Research group: Conecta.ai (ufrn.br)

![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_0.png)

<div class="content-ad"></div>

## 요약

# 1 — 포아송 회귀 이론

포아송 회귀 모형은 결과가 발생 횟수인 이벤트를 묘사하는 데 사용됩니다: 무양한 정수 값의 이산 데이터로, 어떤 일이 어느 기간 동안 몇 번 발생하는지나 슈퍼마켓 대기 줄에 있는 사람 수와 같이 무양한 것을 계산합니다.

계수 데이터는 비율 데이터로도 표현될 수 있으며, 어떤 일이 특정 기간 내에 몇 번 발생하는지를 순수한 개수로 표현할 수 있습니다. 예를 들어, 하루에 세 끼 식사를 합니다.

<div class="content-ad"></div>

Poisson 회귀는 카운트 데이터와 비율 데이터를 분석하는 데 도움이 되며, 특정 응답 변수 Y에 영향을 미치는 설명 변수가 무엇인지를 확인할 수 있습니다. 예를 들어, 슈퍼마켓은 포아송 회귀를 사용하여 대기줄에 있는 사람 수를 더 잘 이해하고 예측할 수 있습니다.

포아송 분포는 특정 시간 동안 이벤트 또는 이벤트 Y가 발생할 확률을 모델링하며, 이때 발생하는 Y는 이전 Y의 발생 시기에 영향을 받지 않는다고 가정합니다. 이를 수학적으로 표현하면 다음과 같습니다:

\[P(Y = y) = \frac{e^{-\lambda}\lambda^y}{y!}\]

여기서 y = 0,1,2,⋯.

<div class="content-ad"></div>

여기서 μ는 노출 단위당 이벤트가 발생할 평균 횟수입니다. Poisson 분포 매개 변수로도 언급됩니다. 노출은 시간, 공간, 인구 규모, 거리 또는 면적이 될 수 있지만 일반적으로 시간으로 가정되며, (t)로 표시됩니다. 노출 값이 제공되지 않으면 1로 가정됩니다.

## 1.1 — 가정

Poisson 회귀는 통계 모델과 마찬가지로 모델 사용 및 결과 해석 시 고려해야 할 특정 가정이 있습니다. 다음은 Poisson 회귀의 주요 가정입니다:

A. 관측치의 독립성: 관측치는 서로 독립적이어야 합니다. 이것은 한 관측치에서 이벤트의 발생이 다른 관측치에서 이벤트의 발생에 영향을 미치지 않아야 함을 의미합니다. 관측치 간의 의존성이 있으면 편향된 매개변수 추정치와 잘못된 추론으로 이어질 수 있습니다.

<div class="content-ad"></div>

B. 매개변수의 선형성: 독립 변수와 포아송 분포의 로그 변환된 평균 간의 관계는 선형이어야 합니다. 이 가정은 각 독립 변수가 종속 변수에 미치는 효과가 독립 변수의 다른 값에 걸쳐 일정함을 의미합니다.

C. 오버디스퍼전스의 부재: 포아송 회귀는 종속 변수의 분산이 평균과 동일하다는 것을 가정합니다. 그러나 현실 세계에서는 분산이 평균을 초과하는 오버디스퍼전스라고 알려진 상황을 자주 만납니다. 만약 오버디스퍼전스가 존재한다면, 비효율적인 매개변수 추정과 과소평가된 표준 오차로 이어질 수 있습니다.

D. 모델의 올바른 명세: 모델에 모든 관련 독립 변수를 포함하고 모델의 기능적 형태를 올바르게 명세하는 것이 중요합니다. 중요한 변수를 빠뜨리거나 잘못된 기능적 형태를 사용하는 경우 편향된 매개변수 추정과 부정확한 예측을 유발할 수 있습니다.

E. 계수 데이터: 포아송 회귀는 발생 이벤트 수를 나타내는 종속 변수가 고정된 시간 또는 공간 단위 내에 발생하는 경우에 대한 계수 데이터를 모델링하는 데 적합합니다. 비계수 데이터에 포아송 회귀를 사용하는 것은 모델의 기본 가정을 위반하고 신뢰할 수 없는 결과를 초래할 수 있습니다.

<div class="content-ad"></div>

F. 다중공선성 없음: 독립 변수들 간에 다중공선성이 없어야 합니다. 다중공선성은 두 개 이상의 독립 변수가 높은 상관 관계를 가질 때 발생하며, 종속 변수에 대한 개별적인 영향을 추정하기 어렵게 만듭니다. 높은 다중공선성은 표준 오차를 과대폭으로 증폭시키고 추정 매개변수를 불안정하게 만들 수 있습니다.

G. 이상치 없음: 데이터의 이상치는 매개변수 추정치에 불필요한 영향을 미치고 모형의 전체적인 적합도에 영향을 줄 수 있습니다. 회귀 결과의 타당성을 보장하기 위해 이상치를 식별하고 적절히 처리하는 것이 중요합니다.

## 1.2— 모형

Generalized Linear Models(GLM)은 반응 변수가 정규 분포가 아닌 분포를 따르는 모형입니다. 이는 반응 변수가 Yes, No와 같이 범주형이며 −∞부터 +∞까지 범위가 아닌 모형에서 선형 회귀 모형과 대조적입니다.

<div class="content-ad"></div>

따라서, 응답과 예측 변수 간의 관계가 선형일 필요는 없을 수 있습니다. 일반화 선형 모형에서는:

![image](/assets/img/2024-06-20-TinyMLPoissonRegression_2.png)

여기서 g(⋅)는 선택한 링크 함수를 나타냅니다.

포아송 회귀 모형은 카운트 데이터 및 분할표를 모델링하는 데 사용되는 일반화 선형 모형입니다. 출력인 Y(카운트)는 포아송 분포를 따르는 값입니다. 이는 예상 값(평균)의 로그를 전제로 하며, 이를 일부 알려지지 않은 매개변수로 선형 형태로 모델링할 수 있습니다.

<div class="content-ad"></div>

비선형 관계를 선형 형태로 변환하기 위해 링크 함수가 사용됩니다. 이 함수는 포아송 회귀의 로그입니다. 이로 인해 포아송 회귀 모델은 종종 로그-선형 모델이라고도 불립니다. 포아송 회귀 모델의 일반적인 수학적 형태는 다음과 같습니다:


<img src="/assets/img/2024-06-20-TinyMLPoissonRegression_3.png" />


여기서 μi는 반응 변수 Yi의 기대값입니다.

계수 α와 β는 수치이며, 여기서 α는 절편을 나타내며 때로는 α는 β0으로도 표시됩니다. x는 예측 변수 또는 설명 변수입니다.

<div class="content-ad"></div>

한 개의 예측 변수(predictor variable)와 한 개의 응답 변수(response variable)를 갖는 방정식을 고려해 봅시다:

![equation1](/assets/img/2024-06-20-TinyMLPoissonRegression_4.png)

이는 다음과 동일합니다:

![equation2](/assets/img/2024-06-20-TinyMLPoissonRegression_5.png)

<div class="content-ad"></div>

포아송 회귀 모형에서 설명변수는 수치값 또는 범주값의 조합을 가질 수 있습니다.

포아송 분포와 포아송 회귀의 가장 중요한 특징 중 하나는 등분산성입니다. 이는 분포의 평균과 분산이 같음을 의미합니다.

평균을 μ라고 가정해보겠습니다. 포아송 회귀에서는 평균과 분산이 다음과 같이 관련되어 있습니다:

![equation](/assets/img/2024-06-20-TinyMLPoissonRegression_6.png)

<div class="content-ad"></div>

여기서 σ²은 분산 파라미터를 나타냅니다. 포아송 모델이 완전히 적합되려면 분산이 평균과 동일해야 합니다(var(Y) = E(Y)) 즉, σ² 값은 1이 되어야 합니다.

분산이 평균보다 클 때에는 이를 초과분산(overdispersion)이라고 하며, σ² 값이 1보다 큽니다. 반면 σ² 값이 1보다 작을 때에는 이를 미달분산(underdispersion)이라고 합니다.

## 1.3 — 계수 추정

포아송 회귀에서는 모델 파라미터를 추정하여 독립 변수와 종속 계수 변수 간의 최적 관계를 찾습니다. 이 추정은 주로 최대 우도법을 사용하여 수행됩니다.

<div class="content-ad"></div>

## 1.3.1 — 최대 우도 방법 (Maximum Likelihood Method, MLM)

최대 우도 방법은 통계 모델의 매개 변수를 추정하기 위한 널리 사용되는 통계 기법입니다. 이 방법은 관측된 데이터의 우도를 극대화하는 매개 변수 값을 찾습니다. 즉, 우리는 제안된 모델에 의해 생성되었을 가능성이 가장 높은 관측된 데이터를 만드는 매개 변수를 찾습니다.

포아송 회귀 분석에서 우도 함수는 각 개별 관측을 위한 관측된 횟수를 관측 확률의 곱으로 정의됩니다. 형식적으로, 우도 함수 L(β0, β1,…, βp)는 다음과 같이 주어집니다:

<div class="content-ad"></div>

여기에 있습니다:

- n은 총 관측값의 수입니다.
- yi는 i번째 관측값의 관측된 수입니다.
- μi는 i번째 관측값에 해당하는 이론적 평균으로, 로그 링크 함수에 의해 주어집니다.

파라미터 추정의 목표는 우도 함수를 최대화하는 계수 β0, β1,..., βp의 값을 찾는 것입니다. 다시 말해, 우리는 관측된 데이터가 포아송 회귀 모델에 의해 생성되었을 가능성이 가장 높은 매개변수를 찾습니다.

# 2 — TinyML 구현

<div class="content-ad"></div>

위의 예시를 통해 ESP32, Arduino, Arduino Portenta H7 with Vision Shield, Raspberry 및 다른 다양한 마이크로컨트롤러 또는 IoT 기기에서 머신러닝 알고리즘을 구현할 수 있습니다.

2.0 — requirements.txt 파일에 나열된 라이브러리를 설치하세요

```js
!pip install -r requirements.txt
```

2.1 — 라이브러리 가져오기

<div class="content-ad"></div>

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import PoissonRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_poisson_deviance,
    mean_squared_error,
)

import m2cgen as m2c
import numpy as np
import pandas as pd
import seaborn as sns

from matplotlib import pyplot as plt

import warnings
warnings.filterwarnings('ignore')
```

2.2 — 데이터셋 로드

“차량 속성 및 배출 데이터셋”은 2000년에 제조된 다양한 차량에 대한 포괄적인 정보를 포함하고 있습니다. 이 데이터셋에는 제조사, 모델, 차량 클래스, 엔진 크기, 실린더 수, 변속기 유형 및 연료 유형과 같은 세부 정보가 포함되어 있습니다. 또한 연료 소비 및 이산화탄소 배출에 대한 범위를 제공하여 각 차량의 환경 영향에 대한 통찰을 제공합니다. 이 데이터셋은 소형부터 중형까지 다양한 차종을 포함하며, 전통적인 모델부터 고성능 모델까지 모두 포함하고 있습니다. 이 정보를 통해 분석가와 연구자는 차량 특성, 연료 효율성 및 배출 추세를 연구할 수 있습니다. 이 데이터셋은 자동차 산업 환경을 이해하고 환경 지속 가능성 및 교통 정책에 대한 논의에 정보를 제공하는 소중한 자료원으로 사용됩니다.

링크: https://www.kaggle.com/datasets/krupadharamshi/fuelconsumption/data


<div class="content-ad"></div>

```python
df = pd.read_csv('./data/FuelConsumption.csv')
df.head()
```

<img src="/assets/img/2024-06-20-TinyMLPoissonRegression_8.png" />

```python
df.info()
```

<img src="/assets/img/2024-06-20-TinyMLPoissonRegression_9.png" />


<div class="content-ad"></div>

```js
df.describe()
```

![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_10.png)

2.3 — 데이터 정리

```js
# 1. 결측값이 있는 행 제거
df.dropna(inplace=True)
# 2. 중복값 제거
df.drop_duplicates(inplace=True)
```

<div class="content-ad"></div>


# 데이터 프레임 정리 후에 결과 표시
df.describe()


![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_11.png)

2.4 — 탐색적 데이터 분석

```python
sns.pairplot(df[['ENGINE SIZE','CYLINDERS','FUEL CONSUMPTION','COEMISSIONS ']])
plt.savefig('.\\figures\\pairplot.png', dpi=300, bbox_inches='tight')
```

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-TinyMLPoissonRegression_12.png" />

```js
corr = df[['ENGINE SIZE','CYLINDERS','FUEL CONSUMPTION','COEMISSIONS ']].corr('spearman')
```

```js
# 그림 크기 조절
plt.figure(figsize=(18,10))
# 히트맵 생성을 위한 기존 코드
heatmap = sns.heatmap(corr, xticklabels=corr.columns, yticklabels=corr.columns, cmap='coolwarm')
# 히트맵에 값 추가
for i in range(len(corr.columns)):
    for j in range(len(corr.columns)):
        plt.text(j + 0.5, i + 0.5, f"{corr.iloc[i, j]:.2f}", ha='center', va='center', color='black', fontsize=18)

plt.xticks(fontsize=20, rotation=45)
plt.yticks(fontsize=20, rotation=0)
cbar = heatmap.collections[0].colorbar
cbar.ax.tick_params(labelsize=20)

plt.savefig('.\\figures\\heatmap.png', dpi=300, bbox_inches='tight')

# 히트맵 표시
plt.show()
```

<img src="/assets/img/2024-06-20-TinyMLPoissonRegression_13.png" />


<div class="content-ad"></div>

2.5— 훈련 및 테스트 데이터로 분할하기

```js
X=df[['엔진 크기','실린더', 'CO2 배출량']]
y=df[['연료 소비']]
```

```js
# 데이터를 훈련 세트와 테스트 세트로 분할하기
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
```

2.6 — 회귀 모델 생성하기

<div class="content-ad"></div>

```js
def score_estimator(y_pred , y_true):

    print(
        "MSE: %.3f"
        % mean_squared_error(
            y_true, y_pred
        )
    )
    print(
        "MAE: %.3f"
        % mean_absolute_error(
            y_true, y_pred, 
        )
    )

    # 푸아송 손실을 계산할 때, 유효하지 않은 비 양수 예측을 무시합니다.
    mask = y_pred > 0
    if (~mask).any():
        n_masked, n_samples = (~mask).sum(), mask.shape[0]
        print(
            "경고: 추정자가 푸아송 손실을 계산할 때, %s개의 샘플 중 %s개의 비 유효한, 비 양수 예측 값이 있습니다. 이러한 예측 값은 푸아송 손실을 계산할 때 무시됩니다."
            % (n_samples, n_masked)
        )

    print(
        "평균 푸아송 손실: %.3f"
        % mean_poisson_deviance(
            y_true ,
            y_pred  
        )
    )
```

```js
model = PoissonRegressor(alpha=1e-12)
```

2.7 — 모델 학습

```js
model.fit(X_train, y_train)
```

<div class="content-ad"></div>

2.8 — 모델 평가

```js
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)
```

```js
# 잔차 계산
train_residuals = y_train.values.reshape(1,-1).tolist()[0] - y_train_pred
# 잔차의 평균과 표준 편차 계산
train_residuals_mean = np.mean(train_residuals)
train_residuals_std = np.std(train_residuals)
# 잔차 계산
test_residuals = y_test.values.reshape(1,-1).tolist()[0] - y_test_pred
# 잔차의 평균과 표준 편차 계산
test_residuals_mean = np.mean(test_residuals)
test_residuals_std = np.std(test_residuals)


# 잔차 시각화
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.scatter(y_train_pred, train_residuals, c='blue', marker='o', label=f'학습 데이터')
plt.axhline(y=0, color='r', linestyle='-')
plt.axhline(y=train_residuals_mean, color='k', linestyle='--', label=f'평균: {train_residuals_mean:.3f}')
plt.axhline(y=train_residuals_mean + 2 * train_residuals_std, color='g', linestyle='--', label=f'+2 표준 편차: {2*train_residuals_std:.2f}')
plt.axhline(y=train_residuals_mean - 2 * train_residuals_std, color='g', linestyle='--', label=f'-2 표준 편차: {-2*train_residuals_std:.2f}')  
plt.xlabel('예측 값')
plt.ylabel('잔차')
plt.title('잔차 대 예측 값 (학습 데이터)')
plt.legend(loc='upper left')
plt.grid(True)

plt.subplot(1, 2, 2)
plt.scatter(y_test_pred, test_residuals, c='green', marker='s', label=f'테스트 데이터')
plt.axhline(y=0, color='r', linestyle='-')
plt.axhline(y=test_residuals_mean, color='k', linestyle='--', label=f'평균: {test_residuals_mean:.3f}')
plt.axhline(y=test_residuals_mean + 2 * test_residuals_std, color='g', linestyle='--', label=f'+2 표준 편차: {2*test_residuals_std:.2f}')
plt.axhline(y=test_residuals_mean - 2 * test_residuals_std, color='g', linestyle='--', label=f'-2 표준 편차: {-2*test_residuals_std:.2f}')  
plt.xlabel('예측 값')
plt.ylabel('잔차')
plt.title('잔차 대 예측 값 (테스트 데이터)')
plt.legend(loc='upper left')
plt.grid(True)

plt.tight_layout()
plt.show()



# 정규성 확인
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.hist(train_residuals, bins=20, color='blue', alpha=0.6)
plt.title('잔차 히스토그램 (학습 데이터)')
plt.xlabel('잔차')
plt.ylabel('빈도')
plt.axvline(x=train_residuals_mean, color='k', linestyle='--', label=f'평균: {train_residuals_mean:.3f}')
plt.axvline(x=train_residuals_mean + 2 * train_residuals_std, color='g', linestyle='--', label=f'+2 표준 편차: {2*train_residuals_std:.3f}')
plt.axvline(x=train_residuals_mean - 2 * train_residuals_std, color='g', linestyle='--', label=f'-2 표준 편차: {-2*train_residuals_std:.3f}')  
plt.legend(loc='upper right')
plt.grid(True)

plt.subplot(1, 2, 2)
plt.hist(test_residuals, bins=20, color='green', alpha=0.6)
plt.title('잔차 히스토그램 (테스트 데이터)')
plt.xlabel('잔차')
plt.ylabel('빈도')
plt.axvline(x=test_residuals_mean, color='k', linestyle='--', label=f'평균: {test_residuals_mean:.3f}')
plt.axvline(x=test_residuals_mean + 2 * test_residuals_std, color='g', linestyle='--', label=f'+2 표준 편차: {2*test_residuals_std:.3f}')
plt.axvline(x=test_residuals_mean - 2 * test_residuals_std, color='g', linestyle='--', label=f'-2 표준 편차: {-2*test_residuals_std:.3f}')  
plt.legend(loc='upper right')
plt.grid(True)

plt.tight_layout()
plt.show()
```

<div class="content-ad"></div>

안녕하세요! 요청하신 내용을 한국어로 번역해 드리겠습니다.

![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_15.png)

2.8.1 — 훈련 데이터로 모델 평가하기

```js
print("PoissonRegressor 평가:")
score_estimator(y_train_pred, y_train)
```

![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_16.png)

<div class="content-ad"></div>

```js
plt.plot(y_train.values, label="원본")
plt.plot(y_train_pred, label="예측")
plt.legend(loc='best', fancybox=True, shadow=True)
plt.grid()
```

![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_17.png)

2.8.2 — 테스트 데이터로 모델 평가

```js
print("PoissonRegressor 평가:")
score_estimator(y_test_pred, y_test)
```

<div class="content-ad"></div>

![2024-06-20-TinyMLPoissonRegression_18.png](/assets/img/2024-06-20-TinyMLPoissonRegression_18.png)

```js
plt.plot(y_test.values, label="original")
plt.plot(y_test_pred, label="predicted")
plt.legend(loc='best', fancybox=True, shadow=True)
plt.grid()
```

![2024-06-20-TinyMLPoissonRegression_19.png](/assets/img/2024-06-20-TinyMLPoissonRegression_19.png)

2.9 — Microcontroller에 구현될 모델 얻기

<div class="content-ad"></div>

```js
code = m2c.export_to_c(model)
print(code)
```

```js
#include <math.h>
double score(double *input)
{
    return exp(1.7347124654302846 + input[0] * 0.011406244946132144 + input[1] * 0.01010646886054758 + input[2] * 0.0028201461971878914);
}
```

2.10— .h 파일에 템플릿 저장

```js
with open('./PoissonRegressor.h', 'w') as file:
    file.write(code)
```

<div class="content-ad"></div>

## 2.11 — 모델 배포

2.11.1 — 아두이노 스케치 완성

```js
#include "PoissonRegressor.h"

Eloquent::ML::Port::PoissonRegressor PoissonRegressor;

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  float X_1[] = {6., 2.7, 5.1, 1.6};
  int result_1 = PoissonRegressor.predict(X_1);
  Serial.print("X1을 입력으로 한 예측 결과(실제 값 = 1):");
  Serial.println(result_1);
  delay(2000);

  float X_2[] = {4.8, 3.1, 1.6, 0.2};
  int result_2 = PoissonRegressor.predict(X_2);
  Serial.print("X2을 입력으로 한 예측 결과(실제 값 = 0):");
  Serial.println(result_2);
  delay(2000);
}
```

2.12 — 결과

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-20-TinyMLPoissonRegression_20.png)

전체 프로젝트: TinyML/15_Poisson_Regressor at main · thommaskevin/TinyML (github.com)

## 만약 마음에 드신다면 제게 커피 한 잔 사주세요 ☕️💰 (Bitcoin)

코드: bc1qzydjy4m9yhmjjrkgtrzhsgmkq79qenvcvc7qzn

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-TinyMLPoissonRegression_21.png)
