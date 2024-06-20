---
title: "인공지능의 마법 구슬 신경망이 인플레이션을 예측하는 방법"
description: ""
coverImage: "/assets/img/2024-06-20-AIsCrystalBallHowNeuralNetworksForecastInflation_0.png"
date: 2024-06-20 18:18
ogImage: 
  url: /assets/img/2024-06-20-AIsCrystalBallHowNeuralNetworksForecastInflation_0.png
tag: Tech
originalTitle: "AI’s Crystal Ball: How Neural Networks Forecast Inflation"
link: "https://medium.com/@kaabar-sofien/ais-crystal-ball-how-neural-networks-forecast-inflation-e2c1704332fe"
---


`<img src="/assets/img/2024-06-20-AIsCrystalBallHowNeuralNetworksForecastInflation_0.png" />`

인플레이션 예측에 대한 전통적인 방법은 과거 데이터와 복잡한 계량 경제 모델에 크게 의존하지만, 종종 빠르게 변화하는 경제 상황의 세세한 점을 포착하지 못할 때가 있습니다. (일부 우수한 모델을 제외하고) 이제는 신경망, 특히 LSTM 신경망이 예측 분석에 접근하는 방식을 혁신하고 있습니다.

이 기사는 LSTM 모델을 핵심부터 만들고, 미국의 월별 인플레이션 지표 변화를 예측하는 데 사용하는 방법을 보여줍니다.

# LSTM 부트캠프

<div class="content-ad"></div>

어떤 것을 이해하는 가장 좋은 방법은 단순하게 생각하는 것입니다. 수학이나 복잡한 그래프가 필요하지 않고 순수한 직관과 논리만 있으면 돼요. 책을 읽고 있다고 상상해봐요. 한 장을 넘겨 다음 장으로 넘어갈 때, 이전 장의 중요한 내용을 기억해야 현재 장을 이해할 수 있어요. 이전 장에서의 정보를 상기시킬 수 있는 능력은 이야기를 따라가는 데 도움을 줍니다. 이제 컴퓨터가 이 책을 어떻게 읽을 수 있을지 생각해봐요.

인간과 달리 컴퓨터는 새로운 정보를 처리할 때 이전 정보를 기억하는 데 어려움을 겪는 경향이 있어요 (미래에 우리를 지배하기 전에 컴퓨터들에게 우리의 이점을 남겨둘 수 있어 다행이죠). 여기서 장기 단기 기억망(LSTM) 네트워크가 등장합니다 — 이들은 당신이 책을 읽을 때와 같이 컴퓨터가 중요한 세부 정보를 시간을 초월하여 기억하는 데 도움을 줍니다. 그래서 LSTM 네트워크에서 중요한 키워드는 기억입니다. 하지만 LSTMs가 정말 무엇인가요?

이들은 데이터 시퀀스를 처리하기 위해 설계된 특별한 종류의 인공 신경망입니다. 이들은 오랜 기간동안 정보를 기억하는 문제를 해결하기 위해 만들어졌는데, 일반적인 신경망은 이를 다루기 어렵습니다.

LSTMs는 역사를 공부하면서 중요한 사건을 메모할 수 있는 노트북을 가지고 있는 것과 같아요. 언제든 필요할 때 이러한 노트를 다시 참고하여 이전 정보를 상기시킬 수 있습니다. 이 노트북이 바로 LSTM의 기억입니다.

<div class="content-ad"></div>

`LSTM`의 기능에 대해 이해해야 할 내용이 대부분입니다. 재미있는 세부사항은 전문가들에게 맡기고, 우리의 목표인 기계 학습 알고리즘을 사용한 인플레이션 예측으로 넘어가 보겠습니다.

# LSTM을 이용한 인플레이션 예측

우선, 분석하려는 데이터 유형을 이해해야 합니다. 미국 소비자 물가지수(CPI)는 도시 소비자가 일상적으로 소비하는 장바구니의 상품 및 서비스에 대한 가격 변동의 평균 변화를 측정하는 중요한 경제 지표입니다. 기본적으로 CPI는 음식, 의류, 주거, 연료, 교통, 의료 서비스 및 사람들이 일상적으로 구입하는 다른 상품 및 서비스에 대한 가격 변동을 모니터링하여 생활비 변동을 추적합니다.

작업 계획은 다음과 같습니다:

<div class="content-ad"></div>

- 필요한 Python 라이브러리 및 미국 세인트루이스 연방준비은행에서 공개한 인플레이션(CPI) 데이터를 가져옵니다.
- 데이터를 정리하고 훈련 세트와 테스트 세트로 분할합니다.
- 설명 변수(예측 변수)를 선택합니다. 이 경우 미래 값을 예측하기 위해 과거 값을 사용하는 지연 변화가 사용됩니다. 이는 데이터에서 자기 상관성과 예측 가능성의 형태를 의미합니다.
- 데이터를 훈련하고 테스트 데이터에서 예측합니다.
- 정확도(적중률)와 평균 제곱근 오차(RMSE)를 사용하여 모델을 평가합니다.

아래 코드를 사용하여 알고리즘을 구현하세요:

```js
# 필요한 라이브러리 가져오기
import pandas_datareader as pdr
import matplotlib.pyplot as plt

# 히스토리컬 데이터의 시작 및 끝 날짜 설정
start_date = '1950-01-01'
end_date = '2024-01-23'

# 데이터프레임 생성 및 CPI 데이터 다운로드
data = pdr.DataReader('CPIAUCSL', 'fred', start_date, end_date)

# CPI 데이터프레임에 nan 값이 있는지 확인
count_nan = data['CPIAUCSL'].isnull().sum()

# 결과 출력
print('CPI 데이터프레임에 있는 nan 값의 수: ' + str(count_nan))

# CPI를 연간 변화율로 변환
data = data.pct_change(periods=12, axis=0) * 100

# 행에서 nan 값을 제거
data = data.dropna()

# 라이브러리 가져오기
from keras.models import Sequential
from keras.layers import Dense, LSTM
import numpy as np
import pandas_datareader as pdr
from sklearn.metrics import mean_squared_error

# 데이터 전처리 함수 정의
def data_preprocessing(data, num_lags, train_test_split):
    # 훈련을 위한 데이터 준비
    x = []
    y = []
    for i in range(len(data) - num_lags):
        x.append(data[i:i + num_lags])
        y.append(data[i + num_lags])
    # 데이터를 넘파이 배열로 변환
    x = np.array(x)
    y = np.array(y)
    # 데이터를 훈련 및 테스트 세트로 분할
    split_index = int(train_test_split * len(x))
    x_train = x[:split_index]
    y_train = y[:split_index]
    x_test = x[split_index:]
    y_test = y[split_index:]

    return x_train, y_train, x_test, y_test

# 훈련 및 테스트 값을 그래프로 그리는 함수 정의
# 나머지 코드는 생략합니다.
``` 

이 코드는 제가 최신 딥러닝 도서에서 가져온 것입니다.

<div class="content-ad"></div>

플로팅 함수는 다음 차트를 제공해야 합니다:

![차트](/assets/img/2024-06-20-AIsCrystalBallHowNeuralNetworksForecastInflation_1.png)

이전에 정의한 함수를 사용하여 알고리즘을 평가해 봅시다:

```js
# 성능 평가
print('---')
print('정확도(학습) = ', round(calculate_accuracy(y_predicted_train, y_train), 2), '%')
print('정확도(테스트) = ', round(calculate_accuracy(y_predicted, y_test), 2), '%')
print('RMSE(학습) = ', round(np.sqrt(mean_squared_error(y_predicted_train, y_train)), 10))
print('RMSE(테스트) = ', round(np.sqrt(mean_squared_error(y_predicted, y_test)), 10))
print('상관관계(시계열 예측/학습) = ', round(np.corrcoef(np.reshape(y_predicted_train, (-1)), y_train)[0][1], 3))
print('상관관게(예측/테스트) = ', round(np.corrcoef(np.reshape(y_predicted, (-1)), np.reshape(y_test, (-1)))[0][1], 3))
print('---')
```

<div class="content-ad"></div>

이전 코드의 출력은 다음과 같습니다:

```js
---
Accuracy Train =  62.58 %
Accuracy Test =  70.51 %
RMSE Train =  0.3287812546
RMSE Test =  0.3275757807
Correlation In-Sample Predicted/Train =  0.522
Correlation Out-of-Sample Predicted/Test =  0.509
---
```

예측 모델을 개발하고 배포할 때, 특히 금융과 같은 중요한 분야에서는 어떤 모델에 의존하기 전에 광범위한 연구를 수행하는 것이 중요합니다. 꼼꼼히 공부해보세요!