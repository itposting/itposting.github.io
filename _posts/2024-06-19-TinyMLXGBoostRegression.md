---
title: "작은 머신러닝  XGBoost 회귀"
description: ""
coverImage: "/assets/img/2024-06-19-TinyMLXGBoostRegression_0.png"
date: 2024-06-19 05:58
ogImage: 
  url: /assets/img/2024-06-19-TinyMLXGBoostRegression_0.png
tag: Tech
originalTitle: "TinyML — XGBoost (Regression)"
link: "https://medium.com/@thommaskevin/tinyml-xgboost-regression-d2b513a0d237"
---


수학적 기초부터 엣지 구현까지

# 소셜 미디어:

👨🏽‍💻 Github: thommaskevin/TinyML (github.com)
👷🏾 Linkedin: Thommas Kevin | LinkedIn
📽 Youtube: Thommas Kevin — YouTube
👨🏻‍🏫 연구 그룹: Conecta.ai (ufrn.br)

![이미지](/assets/img/2024-06-19-TinyMLXGBoostRegression_0.png)

<div class="content-ad"></div>

## 요약

### 1 - XGBoost 회귀 이론

보완적으로, 부스팅은 일련의 모델 집합 𝑡가 순차적으로 훈련되는 앙상블 접근 방식을 나타냅니다. 각 모델 𝑡는 이전 모델, 𝑡−1에서 발견된 결함을 보정하는 목적으로 설계되었습니다.

타겟 값 yᵢ와 샘플 xᵢ에 대한 모델 𝑡의 예측 ŷᵢᵗ을 고려하고, 평균 제곱 오차 (MSE) 등의 일반적인 오류 함수 l로 나타내고, 총 샘플 수를 n으로 표시할 때, 반복 t에서의 모델의 오류(또는 손실)는 다음과 같이 정의됩니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TinyMLXGBoostRegression_1.png" />

모델이 단계적으로 구축되었다는 것을 관찰할 수 있습니다. t 단계에서의 예측은 t-1 단계에서의 예측에 새 모델 fₜ의 예측을 더한 결과입니다:

<img src="/assets/img/2024-06-19-TinyMLXGBoostRegression_2.png" />

우리는 모델의 복잡성을 조절하는 데 기여하는 정규화항을 도입할 것이며(나중에 이 항의 구체적인 기능이 명확해질 것입니다).

<div class="content-ad"></div>

XGBoost의 기본 개념은 각 트리의 포함이 전략적이라는 것을 전제로 합니다: 목표는 항상 오차를 최소화하는 최적의 트리를 구축하는 것입니다. 이를 위해, 우리는 함수 L을 최적화 문제로 다룰 것이며, 결국 L을 최소화하는 fₜ를 결정하려고 합니다. 그러나 이 작업의 복잡성은 오차 함수 l을 선택하는 데 따라 다를 수 있습니다.

따라서 우리는 이 함수를 Taylor 전개를 통해 간소화하기로 결정했습니다. 어떤 무한 차별화 가능한 함수도 다음 형식으로 표현할 수 있다는 것이 널리 인정받았습니다:

![수식](/assets/img/2024-06-19-TinyMLXGBoostRegression_3.png)

중간 단계에서 시리즈를 자르면 함수의 근사치를 얻을 수 있습니다. 현재 상황에서는 확장을 둘째 차수에서 중지하기로 선택했습니다.

<div class="content-ad"></div>

![image1](/assets/img/2024-06-19-TinyMLXGBoostRegression_4.png)

gᵢ (gradient)와 hᵢ (Hessian)로 도함수를 대체할 것입니다:

![image2](/assets/img/2024-06-19-TinyMLXGBoostRegression_5.png)

만약 이 방정식을 최소화하는 fₜ를 찾는 것이 목적이라면, 상수항인 l은 필요하지 않습니다. 따라서 l을 버리면 다음과 같이 됩니다:

<div class="content-ad"></div>


![링크 텍스트](/assets/img/2024-06-19-TinyMLXGBoostRegression_6.png)

XGBoost의 주목할만한 특성 중 하나는 손실 함수가 두 번 미분 가능해야 한다는 요구사항입니다. 특정 문제에 대해 사용자 정의 오류 함수를 이용하여 XGBoost를 적용하려는 경우, 오류 계산 뿐만 아니라 그레이디언트(일차 도함수) 및 헤시안(이차 도함수)에 대한 정보도 필요하다는 점을 명심하는 것이 중요합니다.

## 1.1 — 의사 결정 트리

의사 결정 트리의 작동을 고려할 때, 방정식 L을 다시 쓸 필요가 있습니다. 각 샘플 xᵢ가 leaf j와 연관되어 있음을 알 수 있습니다. 따라서 각 leaf에 대해 샘플이 포함된 집합 인덱스 Iⱼ를 만들 수 있습니다. 


<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_7.png)

Iⱼ가 정의되어 있으며, Iⱼ에 속하는 각 인덱스 i에 대해 샘플 xᵢ가 통과한 결정 경로 q는 잎 j로 이어진다.

또한, 모델이 샘플 xᵢ에 대해 응답하는 것이 xᵢ가 속한 잎에서 관련된 가중치임을 알 수 있습니다:

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_8.png)


<div class="content-ad"></div>

그 결과, 방정식의 일부 용어를 다시 정의할 수 있습니다:

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_9.png)

대체를 수행하면 다음과 같이 얻을 수 있습니다:

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_10.png)

<div class="content-ad"></div>

정규화 항도 확장할 거에요:

![](/assets/img/2024-06-19-TinyMLXGBoostRegression_11.png)

## 1.2 — 예측 오류 최적화

나무의 모든 리프를 고려하는 대신에, 특정 리프에 초점을 맞출 거에요. 이 리프는 j로 표시돼요.

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-19-TinyMLXGBoostRegression_12.png)

The objective is to find the set of weights w that minimizes L. This may seem challenging at first glance, but let’s analyze it more closely.

![Image 2](/assets/img/2024-06-19-TinyMLXGBoostRegression_13.png)

As previously noted, our error function for a leaf is quadratic, implying that the minimum is determined by the inflection point of the curve, where the first derivative is equal to zero.


<div class="content-ad"></div>

<table>
  <tr>
    <td><img src="/assets/img/2024-06-19-TinyMLXGBoostRegression_14.png" /></td>
  </tr>
</table>

wᵈ를 고립시키면 다음과 같이 됩니다:

<table>
  <tr>
    <td><img src="/assets/img/2024-06-19-TinyMLXGBoostRegression_15.png" /></td>
  </tr>
</table>

이제 임의의 리프에 대해 최적 가중치를 제공하는 식을 확인했습니다. 따라서 L에 대한 우리의 식에 이 식을 대입함으로써 우리는 다음을 얻습니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_16.png)

이전 방정식은 각 새 트리의 각 분리를 평가하는 데 사용됩니다. 엔트로피나 지니 계수가 전통적으로 의사결정 트리 구성에 사용되는 방법과 마찬가지로 분리에서 양쪽 노드인 왼쪽 노드와 오른쪽 노드가 생성됩니다. 분할별 이득은 새로운 리프인 Lₗ(왼쪽)과 Lᵣ(오른쪽)의 합을 이전 오차인 Lₜ에서 뺀 것으로 정의됩니다. (우리가 Leaf가 하나만 분석하므로 T=1이라고 가정합니다.)

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_17.png)


<div class="content-ad"></div>

## 1.3 — 하이퍼파라미터 튜닝

이러한 방정식을 이해하면 XGBoost의 하이퍼파라미터와 기능을 더 잘 이해할 수 있습니다.

reg_lambda: 이 파라미터는 잎의 가중치에 영향을 미치며, 값이 클수록 가중치의 절대값이 작아집니다. 이러한 이유로 𝜆은 모델의 복잡성을 제어하는 매개변수로, 가중치가 너무 커지는 것을 방지합니다. 보다 정확히는 L2 정규화입니다.

![이미지](/assets/img/2024-06-19-TinyMLXGBoostRegression_18.png)

<div class="content-ad"></div>

- reg_alpha: 분모를 제로에 가깝게 만들어서 중요성이 적은 트리 또는 분할을 제외하는 효과가 있습니다. 유도된 값의 모듈리(0보다 작을 때 -1, 0보다 클 때 1)의 행동으로 인해 가중 함수가 두 가지 경우로 나누어짐을 언급해야 합니다.

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_19.png)

- gamma: 𝛾는 분할이 발생하는 최솟값으로, 𝛾보다 낮은 값은 결과적으로 부정적인 이득이 발생하여 실제 결과를 악화시킬 수 있으므로 고려되지 않습니다.

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_20.png)

<div class="content-ad"></div>

- learning_rate: 문 개선을 위해 각 가중치에 0에서 1 사이의 값을 곱하여 나무의 개별적인 중요성을 감소시키고 학습 과정을 늦춰 미래 나무의 포함 여지를 늘립니다.

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_21.png)

여기서 η는 트리 ft의 전체 예측에 미치는 영향을 직접 조절하며 가중치 계산 방식을 수정하지 않습니다.

- max_delta_step: 각 반복의 최대 절대 가중치를 상수 𝛿로 제한하여 가중치의 부호를 항상 보존합니다.

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-19-TinyMLXGBoostRegression_22.png)

- max_child_weight: 자식 노드마다 ℎ의 합이 이 매개변수로 설정된 값보다 크기 때문에 분할이 수행됩니다. ℎ는 오차 함수(𝑙)의 도함수에 의해 결정됩니다. 따라서 ℎ의 값이 낮을 때는 해당 리프가 이미 충분히 "순수"하며 더 이상 분할할 필요가 없다는 것을 나타냅니다.

![Image 2](/assets/img/2024-06-19-TinyMLXGBoostRegression_23.png)

여기서 Python 구현에 사용 가능한 매개변수 전체 목록을 찾을 수 있습니다.


<div class="content-ad"></div>

# 2— TinyML 구현

위 예제를 통해 ESP32, Arduino, Raspberry 및 기타 다양한 마이크로컨트롤러 또는 IoT 장치에서 머신러닝 알고리즘을 구현할 수 있습니다.

2.0 — requirements.txt 파일에 나열된 라이브러리 설치

```js
!pip install -r requirements.txt
```

<div class="content-ad"></div>

2.1 — 라이브러리 가져오기

```js
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import RandomizedSearchCV
import m2cgen as m2c
import numpy as np
from scipy.stats import uniform, randint
import matplotlib.pyplot as plt
import xgboost as xgb
from xgboost import plot_tree
```

2.2— 데이터셋 로드

당뇨병 데이터셋은 Bradley Efron, Trevor Hastie, Iain Johnstone 및 Robert Tibshirani가 스탠포드 대학에서 만들었습니다. 그들의 당뇨병 진행 예측 연구에 사용되었습니다.

<div class="content-ad"></div>

- 데이터셋은 임상 및 인구 통계 변수인 열 개의 기준 변수로 구성되어 있습니다:

1. 나이

2. 성별

3. 체질량 지수 (BMI)

<div class="content-ad"></div>

4. 평균 혈압

5. S1 — TC, T-세포 (백혈구의 일종)

6. S2 — LDL, 저밀도 리포닛

7. S3 — HDL, 고밀도 리포닛

<div class="content-ad"></div>

8. S4 - TCH, 총 콜레스테롤

9. S5 - LTG, 혈청 트리글리세리드 수준의 로그 가능성

10. S6 - 포도당, 혈당 수준

- 데이터셋에는 442개의 인스턴스(환자)가 있습니다.

<div class="content-ad"></div>

- 대상 변수는 기준선 이후 1년 후의 질병 진행의 양을 양적으로 측정한 것입니다. 데이터 집합에 명시적으로 언급되지 않은 요소를 기반으로 질병 진행을 표현합니다. 이는 연속 변수입니다.

```python
# 데이터셋 불러오기
data = load_diabetes() # 데이터 불러오기

# DataFrame 생성
df_diabetes = pd.DataFrame(data.data, columns=data.feature_names)

# 대상 변수를 DataFrame에 추가
df_diabetes['target'] = data.target

# NaN 값 제거
df = df_diabetes.dropna(axis='rows') # NaN 값 제거

# DataFrame 표시
df_diabetes.head()
```

![이미지](/assets/img/2024-06-19-TinyMLXGBoostRegression_24.png)

```python
df_diabetes.info()
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_25.png)

```js
df_diabetes.describe()
```

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_26.png)

2.3— Exploratory Data Analysis


<div class="content-ad"></div>

```js
sns.pairplot(df_diabetes)
```

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_27.png)

2.4— 데이터를 학습 및 테스트 세트로 분할

```js
df = df_diabetes.iloc[:100,0:10]
```

<div class="content-ad"></div>

```js
X=df.to_numpy()

y=df_diabetes.iloc[:100,-1}
```

```js
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3, random_state=42)
```

2.5 — Create the regressor model

```js
model = xgb.XGBRegressor(objective="reg:linear", random_state=42)
```

<div class="content-ad"></div>

2.6 — 모델 훈련

```js
model.fit(X_train, y_train)
```

2.7 — 모델 최적화

RandomizedSearchCV는 scikit-learn 라이브러리에서 제공하는 함수로, 머신 러닝 모델의 하이퍼파라미터 튜닝을 위해 교차 검증을 통해 주로 사용됩니다. 이 기술은 하이퍼파라미터의 폭넓은 탐색 영역을 다룰 때 유용하며, 가장 효과적인 값을 결정하는 데 도움이 됩니다.

<div class="content-ad"></div>

단계별 설명

1. 매개변수 공간 정의:

RandomizedSearchCV를 활용하기 전에, 모델의 하이퍼파라미터를 위한 탐색 공간을 지정해야 합니다. 특정 값의 그리드를 제공하는 대신, 각 하이퍼파라미터에 대해 분포를 정의합니다.

2. 무작위 샘플링:

<div class="content-ad"></div>

GridSearchCV와 같이 모든 가맹 별로 동시에 평가하는 것이 아니라, RandomizedSearchCV는 평가를 위해 일정한 조합을 무작위로 선택합니다. 이는 큰 탐색 공간을 다룰 때 유리합니다.

3. 모델 훈련:

랜덤으로 선택된 각 하이퍼파라미터 집합에 대해 RandomizedSearchCV는 교차 검증을 사용하여 모델을 훈련합니다. 데이터는 폴드로 나누어지며, 모델은 일부 폴드에서 훈련되고 나머지 폴드에서 평가됩니다.

4. 성능 평가:

<div class="content-ad"></div>

성능은 특정 메트릭(예: 정확도, F1 점수)을 사용하여 측정됩니다. 목표는 주어진 문제에 따라 이 메트릭을 최대화하거나 최소화하는 하이퍼파라미터를 찾는 것입니다(예: 분류 문제에서 정확도를 최대화).

5. 최적 모델 선택:

랜덤 서치를 완료하면 RandomizedSearchCV가 교차 검증 중 가장 우수한 평균 성능을 보인 하이퍼파라미터 세트를 반환합니다.

RandomizedSearchCV를 사용하면 대규모 탐색 공간을 다룰 때 특히 모든 가능한 조합을 평가하는 그리드 서치(GridSearchCV)와 비교하여 계산 시간을 단축할 수 있습니다. 이 효율성은 모든 가능한 조합을 평가하는 대신 하이퍼파라미터 공간의 무작위 샘플을 탐색하는 데서 비롯됩니다.

<div class="content-ad"></div>

```js
params = {
    "colsample_bytree": uniform(0.7, 0.3),
    "gamma": uniform(0, 0.5),
    "learning_rate": uniform(0.03, 0.3), # 기본값 0.1 
    "max_depth": randint(2, 6), # 기본값 3
    "n_estimators": randint(100, 150), # 기본값 100
    "subsample": uniform(0.6, 0.4)
}

best_model = RandomizedSearchCV(model, param_distributions=params, random_state=42, n_iter=200, cv=3, verbose=1, n_jobs=1, return_train_score=True)

best_model.fit(X_train, y_train, early_stopping_rounds=5, eval_set=[(X_test, y_test)]
```

![이미지](/assets/img/2024-06-19-TinyMLXGBoostRegression_28.png)

```js
def report_best_scores(results, n_top=3):
    for i in range(1, n_top + 1):
        candidates = np.flatnonzero(results['rank_test_score'] == i)
        for candidate in candidates:
            print("순위 {0}인 모델".format(i))
            print("평균 검증 점수: {0:.3f} (표준편차: {1:.3f})".format(
                results['mean_test_score'][candidate],
                results['std_test_score'][candidate]))
            best_params = results['params'][candidate]
            print("찾은 최적의 매개변수:")
            for param, value in best_params.items():
                print("  {0}: {1}".format(param, value))
            print("")
```

```js
report_best_scores(best_model.cv_results_, 1)
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-TinyMLXGBoostRegression_29.png)

```js
model =  xgb.XGBRegressor(objective="reg:linear", max_depth= 5, learning_rate= 0.29302969102852483, gamma = 0.38122934287034527)
model.fit(X_train, y_train)
```

2.8 — Visualization

```js
fig, ax = plt.subplots(figsize=(20, 10))
plot_tree(model, num_trees=0, ax=ax)
plt.show()
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_30.png)

2.9— 훈련 데이터로 모델 평가

```js
score = model.score(X_train, y_train)
training_predict = model.predict(X_train)
mse = mean_squared_error(y_train, training_predict)

print("R-squared:", score)
print("MSE: ", mse)
print("RMSE: ", mse**(1/2.0))
```

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_31.png)


<div class="content-ad"></div>

```js
x_ax = range(len(y_train))
plt.plot(x_ax, y_train, label="원본")
plt.plot(x_ax, training_predict, label="예측된 값")
plt.title("훈련 및 예측된 데이터")
plt.xlabel('X축')
plt.ylabel('Y축')
plt.legend(loc='best', fancybox=True, shadow=True)
plt.grid(True)
plt.show()
```

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_32.png)

2.10— 테스트 데이터로 모델 평가

```js
score = model.score(X_test, y_test)
test_predict = model.predict(X_test)
mse = mean_squared_error(y_test, test_predict)

print("R-squared:", score)
print("MSE: ", mse)
print("RMSE: ", mse**(1/2.0))
```

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-TinyMLXGBoostRegression_33.png" />

```js
x_ax = range(len(y_test))
plt.plot(x_ax, y_test, label="original")
plt.plot(x_ax, test_predict, label="predicted")
plt.title("Testing and predicted data")
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.legend(loc='best',fancybox=True, shadow=True)
plt.grid(True)
plt.show()
```

<img src="/assets/img/2024-06-19-TinyMLXGBoostRegression_34.png" />

2.11 — 테스트 데이터를 사용하여 모델 평가하기


<div class="content-ad"></div>

```js
code = m2c.export_to_c(model)
print(code)
```

![Image](/assets/img/2024-06-19-TinyMLXGBoostRegression_35.png)

2.12 — 템플릿을 .h 파일에 저장합니다.

```js
with open('./XGBRegressor.h', 'w') as file:
    file.write(code)
```

<div class="content-ad"></div>

2.13 — 모델 배포

이 예제를 통해 ESP32, 아두이노, 아두이노 Portenta H7 with Vision Shield, 라즈베리 파이 및 기타 다양한 마이크로컨트롤러 또는 IoT 장치에서 머신 러닝 알고리즘을 구현할 수 있습니다.

2.13.1 — 완성된 아두이노 스케치

```js
#include "XGBRegressor.h"


void setup() {
  Serial.begin(115200);
}

void loop() {
  double X_1[] = { 2.71782911e-02,  5.06801187e-02,  1.75059115e-02,
                  -3.32135761e-02, -7.07277125e-03,  4.59715403e-02,
                  -6.54906725e-02,  7.12099798e-02, -9.64332229e-02,
                  -5.90671943e-02};
  double result_1 = score(X_1);
  Serial.print("입력 X1로 예측 결과 (실제 값 = 69):");
  Serial.println(String(result_1, 7));
  delay(2000);
}
```

<div class="content-ad"></div>

3.12 — 결과

![image](/assets/img/2024-06-19-TinyMLXGBoostRegression_36.png)

전체 프로젝트: [TinyML/14_XGBRegression at main · thommaskevin/TinyML](github.com)

## 만약 마음에 드셨다면, 제 커피 한 잔 사주세요 ☕️💰 (Bitcoin)

<div class="content-ad"></div>

```plaintext
코드: bc1qzydjy4m9yhmjjrkgtrzhsgmkq79qenvcvc7qzn

![Image](/assets/img/2024-06-19-TinyMLXGBoostRegression_37.png)
```