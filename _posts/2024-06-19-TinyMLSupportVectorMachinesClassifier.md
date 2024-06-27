---
title: "작고 빠른 머신 러닝 TinyML  서포트 벡터 머신 분류기"
description: ""
coverImage: "/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_0.png"
date: 2024-06-19 02:27
ogImage: 
  url: /assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_0.png
tag: Tech
originalTitle: "TinyML — Support Vector Machines (Classifier)"
link: "https://medium.com/@thommaskevin/tinyml-support-vector-machines-classifier-c391b54f3ab8"
---


수학적 기초부터 엣지 구현까지

## 소셜 미디어:

👨🏽‍💻 Github: thommaskevin/TinyML (github.com)
👷🏾 Linkedin: Thommas Kevin | LinkedIn
📽 Youtube: Thommas Kevin — YouTube
👨🏻‍🏫 연구 그룹: Conecta.ai (ufrn.br)

![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_0.png)

<div class="content-ad"></div>

서포트 벡터 머신(SVMs) 또는 머신 러닝에서는 서포트 벡터 네트워크라고도 하는 SVMs는 학습 알고리즘을 갖춘 지도형 최대 마진 모델입니다. 이들은 분류와 회귀 분석을 위해 데이터를 분석합니다. Vladimir Vapnik과 동료들은 AT&T 벨 연구소에서 SVMs를 개발했습니다. SVMs는 Vapnik과 Chervonenkis가 1974년에 제안한 VC 이론과 통계 학습 프레임워크에 근거한 매우 연구된 모델 중 하나입니다.

# 1 — 서포트 벡터 머신 이론

## 1.1 — 선형 이진 분류

기본적으로 SVM의 역할은 분리 가능한 데이터 집합에 대해 클래스나 레이블 간의 가장 효율적인 분리 경계를 식별하는 것입니다. SVM의 맥락에서 클래스를 완전히 분리할 수 있는 다양한 초평면들이 잠재적인 분리 경계로 간주됩니다.

<div class="content-ad"></div>

우리는 각 입력 xi가 D개의 속성(즉, D 차원으로 구성)을 가지고 있고 -1 또는 +1 중 하나의 클래스에 속하는 값 yi를 갖는 L개의 학습 포인트가 있습니다. 즉, 우리의 훈련 데이터는 다음과 같습니다.

![training data](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_1.png)

여기서 데이터가 선형적으로 분리 가능하다고 가정합니다. 즉, D = 2 일 때 x1 대 x2 그래프에 두 클래스를 분리하는 선을 그릴 수 있고, D ` 2 일 때 x1, x2...xD 그래프에 초평면을 그릴 수 있습니다.

이 초평면은 w · x + b = 0으로 설명할 수 있습니다. 여기서:

<div class="content-ad"></div>

- w는 초평면에 수직입니다.
- b/||w||은 초평면으로부터 원점까지의 수직 거리입니다.

서포트 벡터(Support Vectors)는 분리 초평면에 가장 가까운 예제들을 의미하며, 서포트 벡터 머신(SVM)의 목표는 이 초평면을 가능한 한 두 클래스의 가장 가까운 멤버와 멀리떨어지도록 방향을 조절하는 것입니다.

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_2.png)

그림 1을 참조하면, SVM을 구현하는 것은 변수 w와 b를 선택하여 학습 데이터를 아래와 같이 설명할 수 있도록 하는 것으로 요약됩니다:

<div class="content-ad"></div>

- xi · w + b ≥ +1 for yi = +1
- xi · w + b ≤ −1 for yi = −1

이러한 방정식은 다음과 같이 결합될 수 있습니다:

yi(xi · w + b) − 1 ≥ 0 ∀i

이제 분리 초평면에 가장 가까이 있는 점, 즉 서포트 벡터(도표에서 원으로 표시됨)만 고려한다면, 이 점이 있는 두 평면 H1과 H2는 다음과 같이 나타낼 수 있습니다:

<div class="content-ad"></div>

표를 마크다운 형식으로 변경해주세요.


| xi · w + b = +1 for H1 |
|------------------------|
| xi · w + b = −1 for H2 |

Figure 1을 참고하여, d1은 H1로부터 초평면까지의 거리를 나타내고, d2는 H2로부터의 거리를 나타냅니다. H1과 H2로부터의 초평면의 등거리는 d1 = d2로 정의되며, 이를 SVM의 여백이라고 합니다. 초평면을 가능한 한 Support Vectors로부터 최대한 멀리 위치시키기 위해 이 여백을 최대화해야 합니다.

간단한 벡터 기하학에 따르면, 여백은 (1/||w||)와 같고, 이를 최대화하기 위해서는 (1.3)의 제약 조건 하에 찾아야 할 것입니다.


<div class="content-ad"></div>


![TinyMLSupportVectorMachinesClassifier_3](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_3.png)

kwk을 최소화하는 것은 (0.5*||w||²)을 최소화하는 것과 동일한 것이며, 이 용어의 사용은 나중에 이차 프로그래밍(QP) 최적화를 수행할 수 있게 합니다. 따라서 우리는 다음을 찾아야 합니다:

![TinyMLSupportVectorMachinesClassifier_4](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_4.png)

이 최소화의 제약 사항을 고려하기 위해 Lagrange 배수 α를 할당해야 합니다. 여기서 αi ≥ 0 ∀i 여야 합니다.


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_5.png)

우리는 최소화하는 w와 b 및 최대화하는 α를 찾고 싶습니다 (αi ≥ 0 ∀i를 유지하면서). 이를 위해 LP를 w와 b에 대해 미분하여 도함수를 0으로 설정할 수 있습니다:

![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_6.png)

![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_7.png)


<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_8.png)

이 새로운 제약 조건 LD는 주 기본 LP의 이중 형식으로 참조됩니다. 중요한 점은 이 이중 형식이 각 입력 벡터 xi의 내적만 계산하면 되므로 커널 트릭에서 중요하다는 점입니다.

LP를 최소화하는 것에서 LD를 최대화하는 것으로 전환한 후, 우리는 다음을 찾아야 합니다:

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_9.png)


<div class="content-ad"></div>

이것은 볼록 이차 최적화 문제이며 QP 솔버를 실행하여 α를 반환하고 (1.10)로부터 w를 제공받습니다. 남은 것은 b를 계산하는 것입니다.

(1.11)을 만족하는 어떤 데이터 포인트는 지지 벡터 xs가 될 것이며 다음과 같은 형식을 갖습니다:

![Support Vector](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_10.png)

(1.10)을 대입하는 것입니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_11.png)

서포트 벡터의 지수 집합을 나타내는 S입니다. S는 αi ` 0인 지수 i를 찾아 결정됩니다. ys로 곱하고 (1.1) 및 (1.2)에서 ys² = 1을 사용하여:

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_12.png)

임의의 서포트 벡터 xs를 사용하는 대신, S에 속하는 모든 서포트 벡터를 평균하는 것이 더 나은 방법입니다.


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_13.png)

우리는 이제 서포트 벡터 머신을 정의하는 분리 초평면의 최적 방향을 결정하는 변수 w와 b를 가지고 있습니다.

## 1.2 — 선형적으로 분리되지 않는 데이터의 분류

완전히 선형적으로 분리되지 않는 데이터를 다룰 수 있도록 SVM 방법론을 확장하기 위해 (1.1)과 (1.2)의 제약 조건을 약간 완화하여 잘못 분류된 포인트를 허용합니다. 이는 긍정적인 slack 변수 ξi, i = 1, . . . L을 도입함으로써 수행됩니다:

<div class="content-ad"></div>

아래의 내용을 다음과 같이 결합할 수 있어요:


![img](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_15.png)

![img](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_16.png)


<div class="content-ad"></div>

이 소프트 마진 SVM에서, 마진 경계의 잘못된 쪽에 있는 데이터 포인트는 그로부터의 거리에 따라 증가하는 패널티를 받습니다. 우리는 오분류의 수를 줄이려고 하기 때문에, 이전의 목적 함수(1.6)를 적응하기 위한 합리적인 방법은 다음과 같습니다:

![그림](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_17.png)

여기서 매개변수 C는 여유 변수의 패널티와 마진의 크기 사이의 교환을 제어합니다. 라그랑지안으로 재정립하는 것은, w, b 및 ξi에 대해 최소화하고 α에 대해 최대화해야하는 함수를 찾아야 합니다 (여기서 αi ≥ 0, µi ≥ 0 ∀i):

![그림](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_18.png)

<div class="content-ad"></div>

w, b 및 ξi에 대해 미분하고 도함수를 0으로 설정합니다:

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_19.png)

이를 대입하면, LD는 이전의 (1.14)와 동일한 형식을 가집니다. 그러나 (2.9)와 µi ≥ 0 ∀i 함께하면, α ≥ C를 함의합니다. 따라서 우리는 다음을 찾아야 합니다:

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_20.png)

<div class="content-ad"></div>

그런 후에 b는 (1.6)과 동일한 방법으로 계산됩니다. 그러나 이 경우 b를 계산하기 위해 사용된 Support Vectors 집합은 0 ` αi ` C인 i의 인덱스를 찾아 결정됩니다.

# 2. 하이퍼파라미터 조정: 커널, 정규화, 감마 및 마진.

## 2.1 — 커널

선형 분리 가능한 데이터에 SVM을 적용할 때 입력 변수의 내적으로 행렬 H를 생성하는 방식부터 시작했습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_21.png)

k(xi, xj)는 Kernel Functions라는 함수 패밀리의 예시입니다 (k(xi, xj) = (xi^T)*(xj)가 선형 커널로 알려져 있습니다). 커널 함수의 집합은 두 벡터의 내적을 계산하는 것을 기반으로 하고 있어서 (4.2)의 변형으로 구성되어 있습니다. 이것은 함수들이 어떤 잠재적으로 비선형 특징 매핑 함수 x → φ(x)에 의해 더 높은 차원의 공간으로 다시 구성될 수 있다는 것을 의미합니다. 이는 매핑된 입력들의 내적만 계산하면 되기 때문에 우리는 명시적으로 φ를 계산할 필요가 없다는 것을 뜻합니다.

이 커널 트릭이 유용한 이유는 입력 x의 공간에서 선형적으로 분류/회귀할 수 없는 많은 문제들이 존재하기 때문입니다. 이는 적합한 매핑 x→ φ(x)가 주어진 상태에서 더 높은 차원의 특징 공간에 있을 수 있기 때문입니다.

![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_22.png)


<div class="content-ad"></div>

Figure 3를 참조하면, 우리가 우리의 커널을 다음과 같이 정의한다면:

![Kernel](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_23.png)

그러면 2차원 데이터 공간 x에서 선형적으로 분리되지 않는 데이터 집합(그림 3의 좌측)은 이 비선형 커널 함수에 의해 암시적으로 정의된 비선형 피처 공간(그림 3의 우측)에서 분리될 수 있습니다. 이 커널 함수는 Radial Basis Kernel로 알려져 있습니다.

분류 및 회귀를 위한 다른 인기 있는 커널로는 다항식 커널이 있습니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 [TinyMLSupportVectorMachinesClassifier_24.png] 이미지가 있는 표입니다.

![TinyMLSupportVectorMachinesClassifier_24.png](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_24.png)

아래는 Markdown 형식으로 [TinyMLSupportVectorMachinesClassifier_25.png] 이미지가 있는 표입니다.

![TinyMLSupportVectorMachinesClassifier_25.png](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_25.png)

여기서 a와 b는 커널의 동작을 정의하는 매개변수입니다.

## 2.2 — 정규화

<div class="content-ad"></div>

정규화 매개변수(파이썬의 sklearn 라이브러리에서 C 매개변수로 자주 표현됨)는 SVM 최적화에 각 훈련 예제를 잘못 분류하고 싶지 않은 정도를 알려줍니다.

C 값이 큰 경우 최적화는 모든 훈련 포인트를 올바르게 분류하는 더 나은 작은 마진의 초평면을 선택할 것입니다. 반대로, C 값이 매우 작으면 옵티마이저는 더 큰 마진 분리 초평면을 찾아 더 많은 포인트를 잘못 분류하더라도 선택할 것입니다.

아래 이미지는 두 가지 다른 정규화 매개변수의 예시입니다. 왼쪽 이미지는 낮은 정규화 값으로 인해 일부 오분류가 있습니다. 높은 값은 오른쪽 이미지와 같은 결과를 낳습니다.

<div class="content-ad"></div>

## 2.3 — 감마

감마 매개변수는 단일 학습 예제의 영향이 얼마나 멀리 미치는지를 정의하며, 낮은 값은 '멀리', 높은 값은 '가까이'를 의미합니다. 다시 말해, 낮은 감마 값에서는 확실한 분리 선에서 멀리 떨어진 점들이 분리 선 계산에 고려됩니다. 반면 높은 감마는 분리 선에 가까운 점들이 계산에 고려된다는 것을 의미합니다.

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_27.png)

## 2.4 — 여백

<div class="content-ad"></div>

표 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>

```js
!pip install micromlgen
```

2. 라이브러리 가져오기

```js
from micromlgen import port
import pandas as pd
import plotly.graph_objects as go
import numpy as np
import plotly.express as px
```

```js
from sklearn.svm import SVC
from sklearn.calibration import LabelEncoder
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn import metrics
```

<div class="content-ad"></div>

3 - 데이터셋 로드

아이리스 데이터셋은 머신 러닝과 통계 분야에서 고전적인 데이터셋입니다. 이는 1936년 Sir Ronald A. Fisher에 의해 도입되었으며 판별 분석의 예시로 사용되었습니다. 이 데이터셋은 교육 목적으로 자주 사용되며 패턴 분류 실습의 일반적인 시작 지점입니다.

속성:

- 꽃받침 길이 (센티미터)
- 꽃받침 너비 (센티미터)
- 꽃잎 길이 (센티미터)

<div class="content-ad"></div>

종:

- 0 — 세토사
- 1 — 버시컬러

```js
# 아이리스 데이터셋 불러오기
data = load_iris()
```

```js
# 데이터프레임 생성
df_iris = pd.DataFrame(data.data, columns=data.feature_names)
```

<div class="content-ad"></div>

```js
# DataFrame에 대상 변수를 추가합니다
df_iris['target'] = data.target
```

```js
# NaN 값을 제거합니다
df = df_iris.dropna(axis='rows') # NaN 제거
```

```js
# DataFrame을 표시합니다
print(df_iris.head())
```

```js
df = df_iris.iloc[:100, 1:4]
```

<div class="content-ad"></div>

```js
X=df.to_numpy()
```

```js
# 레이블을 정수 유형으로 변환합니다: Setosa = 0, Versicolor = 1
y=df_iris.iloc[:100,-1]
y = LabelEncoder().fit_transform(y)
```

4 - 데이터셋 시각화

```js
fig = go.Figure()
```

<div class="content-ad"></div>


```js
fig.add_trace(go.Scatter3d(x=df['sepal width (cm)'], y= df['petal length (cm)'], z=df['petal width (cm)'], mode='markers', marker=dict(color='blue')))
```

```js
fig.update_layout(scene=dict(xaxis_title='꽃 받침 길이 (cm)', yaxis_title='꽃 받침 너비 (cm)', zaxis_title='꽃 잎 너비 (cm)'),
                  scene_camera=dict(eye=dict(x=1.87, y=0.88, z=-0.64)),
                  width=1000, height=600)
```

<img src="/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_29.png" />

5 — 훈련 및 테스트 데이터로 분할


<div class="content-ad"></div>

```js
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
```

6. Create the classification model

```js
model = SVC(gamma=0.0000001, kernel='linear')
```

7. Train the model


<div class="content-ad"></div>

```js
model.fit(X_train, y_train)
```

8 — 훈련 데이터를 사용하여 모델 평가

```js
training_predict = model.predict(X_train)
```

```js
print(metrics.classification_report(y_train, training_predict, digits = 3))
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_30.png" />

```js
print(metrics.confusion_matrix(y_train, training_predict))
```

<img src="/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_31.png" />

```js
print(f'Model accuracy: {round(metrics.accuracy_score(y_train, training_predict)*100,2)}%')
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_32.png)

9 — Hyperlane Train Data Visualization

```js
x_grid, y_grid = np.meshgrid(np.linspace(X_train[:, 0].min(), X_train[:, 0].max(), 100),
                             np.linspace(X_train[:, 1].min(), X_train[:, 1].max(), 100))
z_grid = np.zeros_like(x_grid)
```

```js
for i in range(len(x_grid)):
    for j in range(len(y_grid)):
        z_grid[i, j] = model.decision_function([[x_grid[i, j], y_grid[i, j], 0]])
```

<div class="content-ad"></div>

```js
fig = go.Figure()
```

```js
fig.add_trace(go.Scatter3d(x=X_train[:, 0], y=X_train[:, 1], z=X_train[:, 2], mode='markers',
                           marker=dict(size=5, color=y_train, opacity=0.7), name='Training Data'))
```

```js
fig.add_trace(go.Surface(z=z_grid, x=x_grid, y=y_grid, opacity=0.5, colorscale='Bluered_r'))
```

```js
fig.update_layout(scene=dict(xaxis_title='Sepal Width (cm)',
                             yaxis_title='Petal Length (cm)',
                             zaxis_title='Petal Width (cm)'))
```

<div class="content-ad"></div>

```js
fig.update_layout(width=1000, height=600)
```

```js
fig.show()
```

<img src="/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_33.png" />

10 — 테스트 데이터로 모델 평가하기

<div class="content-ad"></div>

```js
test_predict = model.predict(X_test)
```

```js
print(metrics.classification_report(y_test, test_predict, digits = 3))
```

![Image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_34.png)

```js
print(metrics.confusion_matrix(y_test, test_predict))
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_35.png)

```js
print(f'모델 정확도: {round(metrics.accuracy_score(y_test, test_predict)*100,2)}%')
```

![image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_36.png)

11 — 하이퍼플레인 테스트 데이터 시각화


<div class="content-ad"></div>

```js
x_grid, y_grid = np.meshgrid(np.linspace(X_test[:, 0].min(), X_test[:, 0].max(), 100),
                             np.linspace(X_test[:, 1].min(), X_test[:, 1].max(), 100))
z_grid = np.zeros_like(x_grid)
```

```js
for i in range(len(x_grid)):
    for j in range(len(y_grid)):
        z_grid[i, j] = model.decision_function([[x_grid[i, j], y_grid[i, j], 0]])
```

```js
fig = go.Figure()
```

```js
fig.add_trace(go.Scatter3d(x=X_test[:, 0], y=X_test[:, 1], z=X_test[:, 2], mode='markers',
                           marker=dict(size=5, color=y_test), name='Training Data'))
```

<div class="content-ad"></div>

```js
fig.add_trace(go.Surface(z=z_grid, x=x_grid, y=y_grid, opacity=0.5, colorscale='Bluered_r'))
```

```js
fig.update_layout(scene=dict(xaxis_title='꽃받침 너비 (cm)',
                             yaxis_title='꽃잎 길이 (cm)',
                             zaxis_title='꽃잎 너비 (cm)'))
```

```js
fig.update_layout(width=1000, height=600)
```

```js
fig.show()
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_37.png" />

12 — 마이크로컨트롤러에 구현될 모델 얻기

```js
print(port(model))
```

```cpp
#pragma once
#include <cstdarg>
namespace Eloquent {
    namespace ML {
        namespace Port {
            class SVM {
                public:
                    /**
                    * 특징 벡터에 대한 클래스 예측
                    */
                    int predict(float *x) {
                        float kernels[3] = { 0 };
                        float decisions[1] = { 0 };
                        int votes[2] = { 0 };
                        kernels[0] = compute_kernel(x,   3.4  , 1.9  , 0.2 );
                        kernels[1] = compute_kernel(x,   3.3  , 1.7  , 0.5 );
                        kernels[2] = compute_kernel(x,   2.4  , 3.3  , 1.0 );
                        float decision = -0.833910342285;
                        decision = decision - ( + kernels[0] * -0.31945543931  + kernels[1] * -0.240101867421 );
                        decision = decision - ( + kernels[2] * 0.559557306731 );
                        return decision > 0 ? 0 : 1;
                    }
                protected:
                    /**
                    * 특징 벡터와 서포트 벡터 사이의 커널 계산.
                    * 커널 유형: 선형
                    */
                    float compute_kernel(float *x, ...) {
                        va_list w;
                        va_start(w, 3);
                        float kernel = 0.0;
                        for (uint16_t i = 0; i < 3; i++) {
                            kernel += x[i] * va_arg(w, double);
                        }
                        return kernel;
                    }
                };
            }
        }
    }
```

<div class="content-ad"></div>

다음은 테이블 태그를 마크다운 형식으로 변경합니다.

13 — .h 파일에 템플릿을 저장합니다

```js
with open('./SVMClassifier/SVMClassifier.h', 'w') as file:
    file.write(port(model))
```

14 — 아두이노 스케치 완료

아래와 같이 아두이노 스케치에 "SVMClassifier.h" 파일을 포함하세요:

<div class="content-ad"></div>


```js
#include "SVMClassifier.h"
```

```js
Eloquent::ML::Port::SVM classifier;
```

```js
void setup() {
  Serial.begin(115200);
```


<div class="content-ad"></div>

```js
void loop() {
  float X_1[] = {3.6, 1. , 0.2};
  int result_1 = classifier.predict(X_1);
  Serial.print("Result of predict with input X1:");
  Serial.println(result_1);
  delay(2000);
```

```js
float X_2[] = {2.9, 4.7, 1.4};
  int result_2 = classifier.predict(X_2);
  Serial.print("Result of predict with input X2:");
  Serial.println(result_2); 
  delay(2000);
```

```js
}
```

결과:

<div class="content-ad"></div>

0 — 셋토사 — 입력: '3.6, 1. , 0.2'

1 — 버시컬러 — 입력: '2.9, 4.7, 1.4'

![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_38.png)

👀😲(보너스) 하이퍼파라미터 튜닝

<div class="content-ad"></div>

RandomizedSearchCV는 Python의 scikit-learn 라이브러리에서 제공하는 함수로, 머신 러닝 모델의 하이퍼파라미터 튜닝을 위해 일반적으로 사용됩니다. 이 기술은 하이퍼파라미터의 다양한 값을 탐색할 때 유용하며, 가장 효과적인 조합을 식별하는 것을 목표로 합니다.

a) 파라미터 공간의 정의:

RandomizedSearchCV를 활용하기 전에, 모델의 하이퍼파라미터를 위한 탐색 공간을 지정해야 합니다. 특정 값의 그리드를 제공하는 대신, 각 하이퍼파라미터에 대해 분포가 정의됩니다.

b) 랜덤 샘플링:

<div class="content-ad"></div>

예를 들어 GridSearchCV의 모든 가상 하이퍼파라미터 조합을 평가하는 대신, RandomizedSearchCV은 평가를 위해 일정한 하이퍼파라미터 조합을 무작위로 선택합니다. 이는 큰 탐색 공간을 다룰 때 유리합니다.

c) 모델 훈련:

무작위로 선택된 각 하이퍼파라미터 세트에 대해 RandomizedSearchCV는 교차 검증을 사용하여 모델을 훈련시킵니다. 데이터는 폴드로 나뉘며, 모델은 일부 폴드에서 훈련을 받고 나머지 폴드에서 평가를 받습니다.

d) 성능 평가:

<div class="content-ad"></div>

성능은 지정된 메트릭(예: 정확도, F1 점수)을 사용하여 측정됩니다. 목표는 주어진 문제에 따라 이 메트릭을 최대화하거나 최소화하는 하이퍼파라미터를 찾는 것입니다(예: 분류 문제에서 정확도를 최대화).

e) 최적 모델 선택:

랜덤 탐색이 완료되면, RandomizedSearchCV는 교차 검증 중 최상의 평균 성능을 보인 하이퍼파라미터 세트를 반환합니다.

RandomizedSearchCV를 사용하면, 특히 큰 탐색 공간을 다룰 때 모든 가능한 조합을 평가하는 완전한 그리드 탐색(GridSearchCV)과 비교하여 계산 시간을 절약할 수 있습니다. 이 효율성은 모든 가능한 조합을 평가하는 대신 하이퍼파라미터 공간의 무작위 샘플을 탐색하는 데서 오게 됩니다.

<div class="content-ad"></div>

1. **라이브러리 가져오기**

```python
from sklearn.metrics import make_scorer, roc_auc_score
from sklearn.model_selection import RandomizedSearchCV
```

2. **파라미터 조합을 위한 그리드 탐색 설정**

```python
params = {
    "C": np.arange(2, 10, 2),
    "gamma": np.arange(0.1, 1, 0.01),
    "kernel": ['rbf', 'linear', 'poly']}
```

<div class="content-ad"></div>

3- 성능 측정 지표 정의

```js
auc = make_scorer(roc_auc_score)
```

4- 최적 모델을 탐색합니다.

```js
best_model = RandomizedSearchCV(model, param_distributions=params, random_state=42, n_iter=200, cv=3, verbose=1, n_jobs=1, return_train_score=True, scoring = auc)
best_model.fit(X_train, y_train)
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_39.png)

5-가장 좋은 모델 보고

```python
def report_best_scores(results, n_top=3):
    for i in range(1, n_top + 1):
        candidates = np.flatnonzero(results['rank_test_score'] == i)
        for candidate in candidates:
            print("순위가 {0}인 모델".format(i))
            print("평균 검증 점수: {0:.3f} (표준편차: {1:.3f})".format(
                results['mean_test_score'][candidate],
                results['std_test_score'][candidate]))
            best_params = results['params'][candidate]
            print("찾은 최적 파라미터:")
            for param, value in best_params.items():
                print("  {0}: {1}".format(param, value))
            print("")
```

```python
report_best_scores(best_model.cv_results_, 1)
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-TinyMLSupportVectorMachinesClassifier_40.png)

Full project in: [TinyML/05_support_vector_machine](https://github.com/thommaskevin/TinyML)

References:

FLETCHER, Tristan. Support vector machines explained. Tutorial paper, p. 1–19, 2009.
