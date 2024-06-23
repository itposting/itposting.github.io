---
title: "파이썬으로 감성 분석 모델 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_0.png"
date: 2024-06-23 18:40
ogImage: 
  url: /assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_0.png
tag: Tech
originalTitle: "How to Create a Sentiment Analysis Model in Python"
link: "https://medium.com/@kaabar-sofien/how-to-create-a-sentiment-analysis-model-in-python-cf03cb9988e0"
---


<img src="/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_0.png" />

이 글에서는 예측 분석의 영역에 대해 탐구하며, COT 보고서에서 제공되는 다양한 통찰력을 활용하여 기계 학습 모델의 기능을 향상시킬 수 있는 방법을 살펴봅니다. 트레이더 포지션 내의 패턴을 해석함으로써, 우리는 금융 세계에서 더 정확하고 데이터 기반의 의사 결정을 내릴 수 있는 잠재력을 발견할 수 있습니다.

# KNN 알고리즘과 COT 보고서 소개

K-Nearest Neighbors (KNN)은 분류 및 회귀 작업에 모두 사용되는 간단하고 직관적인 기계 학습 알고리즘입니다. 하지만 먼저, 분류와 회귀가 무엇을 의미하는지 알아야 합니다.

<div class="content-ad"></div>

- 분류(Classification)는 지도 학습의 한 유형으로, 데이터 포인트를 미리 정의된 클래스나 레이블로 분류하는 것을 목표로 합니다. 분류에서 모델은 입력의 특징에 기반하여 클래스나 범주를 지정하는 방법을 학습합니다. 분류의 출력은 이산적이며 범주나 클래스 레이블을 나타냅니다. 예를 들어, 이메일을 스팸 또는 비스팸으로 분류하는 것입니다.
- 반면에 회귀(Regression)는 지도 학습의 한 유형으로, 연속적인 수치 값을 예측하는 것을 목표로 합니다. 회귀에서 모델은 입력 특징과 출력 간의 관계를 수립하는 것을 학습하며, 출력은 연속적인 범위의 값이며 양이나 수치 값을 나타냅니다. 예를 들어, 집의 가격을 예측하거나 주가를 예측하는 것입니다.

KNN은 게으른 학습(lazy learning)의 한 유형으로, 훈련 중에 모델을 구축하지 않고 대신 전체 훈련 데이터 집합을 기억하고 새 데이터 포인트와 기존 데이터 포인트 간의 유사성을 바탕으로 예측합니다.

그래서 KNN의 핵심 아이디어는 유사한 특징을 가진 객체(데이터 포인트)이 특징 공간에서 서로 가깝다는 것입니다. KNN은 특징 공간에서 특정 테스트 데이터 포인트와 가장 가까운 K개의 훈련 예제를 찾아서 그 주변 이웃들의 레이블이나 값에 따라 테스트 포인트에 레이블이나 값을 할당합니다. 이는 K가 훈련 단계에서 조절할 수 있는 변수라는 것을 의미합니다.

다음 그림을 살펴보세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_1.png" />

두 가지 클래스가 있습니다. 클래스 A(바나나)와 클래스 B(사과)입니다. 우리는 파란색 물체의 클래스(또는 레이블)를 식별하려고 합니다. 가장 가까운 이웃은 바나나로 보이기 때문에 클래스 A입니다. 이것이 KNN 알고리즘의 작동 방식입니다.

<img src="/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_2.png" />

KNN은 회귀 작업에도 사용될 수 있습니다. KNN 회귀에서 목표는 새로운 데이터 포인트의 연속 값을 예측하는 것입니다. 이 값은 이웃 K개의 값에 기반하여 예측됩니다. KNN 회귀의 단계는 KNN 분류와 유사하지만 클래스 레이블을 세는 대신, K개 이웃의 대상 값들의 평균 또는 가중 평균을 계산하여 테스트 포인트의 값을 예측합니다.

<div class="content-ad"></div>

커밋먼츠 오브 트레이더스(COT) 보고서는 미국 상품 선물 거래위원회(CFTC)가 매주 발간하는 보고서로, 선물 시장의 다양한 참여자들의 포지션에 대한 통찰을 제공합니다. 이러한 참여자들에는 상업 헤지거들, 대형 투기자들, 그리고 소규모 거래자들이 포함됩니다.

보고서는 이러한 그룹들의 순 포지션을 보여주어 그들이 상승을 기대하고 있는지(매수 포지션) 또는 하락을 예상하고 있는지(매도 포지션)를 나타냅니다. 순 COT 값은 각 그룹의 총 매수 및 매도 포지션의 차이를 통해 계산됩니다.

순 COT 값을 분석하면 잠재적인 미래 가격 움직임에 대한 어떤 단서를 제공할 수 있습니다. 예를 들어, 대형 투기자들이 상당히 많은 순 매수 포지션을 보유하고 있다면 시장에서 매수 센티먼트가 있다는 것을 시사할 수 있습니다. 그러나 다른 요소들을 고려하고 COT 보고서를 예측의 여러 도구 중 하나로 활용하는 것이 중요합니다. 트렌드는 변할 수 있고, 시장 역학은 COT 데이터 이상의 다양한 요인에 영향을 받습니다.

간단히 말하면, COT 보고서는 시장에서 어떤 그룹들의 거래자들이 어떻게 베팅을 하고 있는지 요약해줍니다. 그들의 포지션에 주목할 만한 변화가 있다면, 시장 트렌드의 가능성 있는 변화를 나타낼 수 있습니다. 그러나 이것이 마법구슬은 아니며, 더 포괄적인 분석을 위해 다른 요소들을 고려해야 합니다.

<div class="content-ad"></div>


![Sentiment Analysis Model in Python](/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_3.png)

If you want to see more of my work, you can visit my website for the books catalogue by simply following the link attached the picture:

![Books Catalogue](/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_4.png)

# Creating the Algorithm


<div class="content-ad"></div>

KNN 회귀 예제 코드를 시도해봅시다. 주요 작업은 GBP의 순 COT 값 변화를 예측하는 것입니다. 아래 코드를 사용하여 작업을 수행해보세요:

```js
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.neighbors import KNeighborsRegressor

data = pd.read_excel('COT_GBP.xlsx')
data = np.reshape(np.array(data), (-1))
data = np.diff(data)

def data_preprocessing(data, num_lags, train_test_split):
    # 훈련용 데이터 준비
    x = []
    y = []
    for i in range(len(data) - num_lags):
        x.append(data[i:i + num_lags])
        y.append(data[i + num_lags])
    x = np.array(x)
    y = np.array(y)

    split_index = int(train_test_split * len(x))
    x_train = x[:split_index]
    y_train = y[:split_index]
    x_test = x[split_index:]
    y_test = y[split_index:]

    return x_train, y_train, x_test, y_test

num_lags = 20
train_test_split = 0.80
x_train, y_train, x_test, y_test = data_preprocessing(data, num_lags, 0.85)

model = KNeighborsRegressor(n_neighbors=2)
model.fit(x_train, y_train)
y_pred = model.predict(x_test)

plt.plot(y_pred[-100:], label='예측 데이터', linestyle='--', marker='.', color='red')
plt.plot(y_test[-100:], label='실제 데이터', marker='.', alpha=0.7, color='blue')
plt.legend()
plt.grid()
plt.axhline(y=0, color='black', linestyle='--')
same_sign_count = np.sum(np.sign(y_pred) == np.sign(y_test)) / len(y_test) * 100
print('일치율 =', same_sign_count, '%')
```

CFTC 웹사이트에서 COT GBP 데이터를 찾을 수 있습니다. 다음 차트는 실제 데이터와 예측 데이터를 비교한 것입니다:

K 값이 2이고 입력값으로 20개의 래그 값을 사용한 알고리즘의 일치율(정확도)은 다음과 같습니다:

<div class="content-ad"></div>


Hit Ratio =  67.92 %

![Image](/assets/img/2024-06-23-HowtoCreateaSentimentAnalysisModelinPython_5.png)
