---
title: "선형 회귀를 사용한 비농업 부문 고용 예측"
description: ""
coverImage: "/assets/img/2024-06-19-ForecastingNon-FarmPayrollsWithLinearRegression_0.png"
date: 2024-06-19 06:38
ogImage: 
  url: /assets/img/2024-06-19-ForecastingNon-FarmPayrollsWithLinearRegression_0.png
tag: Tech
originalTitle: "Forecasting Non-Farm Payrolls With Linear Regression"
link: "https://medium.com/@kaabar-sofien/forecasting-non-farm-payrolls-with-linear-regression-11ca69f8b0b8"
---



![image](/assets/img/2024-06-19-ForecastingNon-FarmPayrollsWithLinearRegression_0.png)

선형 회귀는 가끔 단숨함과 선형 종속적 결과 때문에 무시당하기도 합니다. 그러나 많은 복잡한 예측 작업을 선형 회귀를 사용하여 해결할 수 있습니다. 한 번 매우 성공한 헤지 펀드 관리자로부터 들은 적이 있는데, 그들의 정교한 거래 모델 중 하나는 간단한 선형 회귀 모델에 의존했다고 말씀하셨습니다.

이 기사에서는 파이썬을 사용하여 간단한 선형 회귀를 통해 미국의 고용 데이터를 예측하는 방법을 보여줍니다.

# 비농업 실업자수란 무엇인가요?


<div class="content-ad"></div>

비농업 실업률(NFP)은 미국에서 중요하게 살펴보고 있는 경제 지표로, 미국 노동 시장의 건강 상태를 판단하는 중요한 기준 역할을 합니다. 매달 발표되는 이 취업 보고서는 미국의 고용 상황을 종합적으로 보여줍니다. 이 보고서에서는 농업 부문, 가정부 및 비영리 기관의 일자리를 제외한 미국 내 유료 종업원 수의 순 증가량이 공개됩니다.

이 NFP 보고서는 지난 달 동안 특정 부문을 제외한 미국 내 유료 종업원 수의 순 증감을 보여줍니다. 이는 미국 경제의 전반적인 강도와 방향에 대한 통찰력을 제공하기 때문에 특히 중요합니다. 데이터를 분석함으로써 경제학자, 정책 결정자, 투자자 및 기업은 노동 시장의 건강 상황을 평가하고 취업 트렌드를 추적하며 경제 정책, 투자, 채용 관행에 관한 판단을 내릴 수 있습니다.

또한, NFP 보고서는 금융 시장을 넘어서 통화 환율, 이자율 결정 및 기타 금융 상품 등에도 영향을 미칩니다. 매달 예측을 시도하며 우리만의 모델을 적용해 보고 나온 결과를 살펴봅시다.

우리는 방향성 정확도 및 RMSE를 이용하여 예측을 평가할 것입니다. 이들이 의미하는 것은 다음과 같습니다:

<div class="content-ad"></div>

- 방향성 정확도는 NFP가 상승인 경우와 NFP가 하락인 경우를 비교하여 올바른 예측 수와 예측 수를 비교하는 단순한 이진 측정입니다.
- RMSE는 평균 제곱근 오차를 의미합니다. 데이터 세트에서 예측 값과 실제 값 사이의 오차의 평균 크기를 측정하는 지표입니다.

더 많은 작업을 보고 싶으시면, 제 웹사이트에서 PDF 도서 카탈로그를 확인하실 수 있습니다. 아래 그림에 첨부된 링크를 따라가시면 됩니다:

![PDF books catalogue](/assets/img/2024-06-19-ForecastingNon-FarmPayrollsWithLinearRegression_1.png)

# 알고리즘 만들기

<div class="content-ad"></div>

알고리즘을 생성하기 전에 선형 회귀 알고리즘이 어떻게 작동하는지 알아보겠습니다.

선형 회귀는 데이터 점들의 산점도를 통해 직선을 그리는 것과 같습니다. 집의 크기와 가격에 관한 데이터가 있다고 상상해보세요. 이 정보를 수집하여 대부분의 점을 지나가는 최적의 선을 찾는 데 사용합니다. 이 선은 일반적인 추세를 나타냅니다: 집이 커질수록 가격도 올라가는 경향이 있습니다.

이 과정에는 수학적 계산이 필요하여 선이 가능한 모든 데이터 점에 가장 가깝게 위치하도록 합니다. 이 선을 갖고 나면 집의 크기를 알고 있다면 집의 가격을 예측할 수 있습니다. 이 선은 기울기(크기에 따라 가격이 얼마나 변하는지)와 y절편(크기가 0일 때의 가격, 집에 대해서는 의미가 없음)을 갖고 있습니다. 따라서 이는 두 가지 사이의 관계를 이해하고 예측하는 방법입니다.

작업 계획은 다음과 같습니다:

<div class="content-ad"></div>

- 해당 GitHub 저장소에서 NFP 데이터를 다운로드하고 Python에 업로드하세요.
- NFP 데이터의 차이를 취하세요. 이미 stationary 상태이지만 방향성 정확성을 측정하기 위해 이를 수행합니다.
- 데이터를 학습 세트와 테스트 세트로 분할하세요.
- 모델을 학습시키는 데에는 마지막 다섯 개의 NFP 변경 사항을 특성으로 사용하세요. 그런 다음 테스트 세트의 이전에 본 적이 없는 데이터에 대해 예측하세요.
- 예측된 데이터와 실제 데이터를 평가하고 비교하세요.

아래 코드를 사용하여 프로세스를 구현하세요 (저장소에서 NFP 데이터를 다운로드해야 함):

```js
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import pandas as pd

def data_preprocessing(data, num_lags, train_test_split):
    # 데이터 처리를 위해 준비
    x = []
    y = []
    for i in range(len(data) - num_lags):
        x.append(data[i:i + num_lags])
        y.append(data[i+ num_lags])
    # 데이터를 넘파이 배열로 변환
    x = np.array(x)
    y = np.array(y)
    # 데이터를 학습 및 테스트 세트로 분할
    split_index = int(train_test_split * len(x))
    x_train = x[:split_index]
    y_train = y[:split_index]
    x_test = x[split_index:]
    y_test = y[split_index:]
    
    return x_train, y_train, x_test, y_test 
# 시간 인덱스가 설정되지 않았다면 설정하세요
data = pd.read_excel('NFP.xlsx').values
data = np.reshape(data, (-1))
data = np.diff(data)
x_train, y_train, x_test, y_test = data_preprocessing(data, 5, 0.80)
# CatBoostRegressor 모델 생성
model = LinearRegression()
# 데이터에 모델 학습
model.fit(x_train, y_train)
# 학습에 사용된 데이터에 대해 예측
y_pred = model.predict(x_test)  # 예측을 위해 X 대신 X_new 사용
# 오리지널 사인파와 예측값 플롯
plt.plot(y_pred[-50:], label='예측 데이터', linestyle='--', marker='o')
plt.plot(y_test[-50:], label='실제 데이터', marker='o')
plt.legend()
plt.grid()
plt.axhline(y=0, color='black', linestyle='--')
import math
from sklearn.metrics import mean_squared_error
rmse_test = math.sqrt(mean_squared_error(y_pred, y_test))
print(f"테스트의 RMSE: {rmse_test}")
same_sign_count = np.sum(np.sign(y_pred) == np.sign(y_test)) / len(y_test) * 100
print('방향성 정확도 = ', same_sign_count, '%')
```

다음 그림은 실제 데이터와 예측 데이터를 비교합니다.

<div class="content-ad"></div>

위 코드의 출력은 다음과 같습니다:

```js
테스트의 RMSE: 188.81
방향 정확도 = 69.65%
```

69.65%의 방향 정확도로 보아, 모델은 마지막 변화에서 긍정적 또는 부정적 변화가 발생할지를 예측할 수 있는 것으로 보입니다. RMSE는 예측이 약 188의 오류 항을 가지고 있음을 보여줍니다. 이는 개선할 여지가 많이 남아 있다는 것을 의미합니다.

개선은 특성을 더 추가하거나 래깅된 입력의 수를 변경하고 다른 조건을 추가하는 방식으로 이루어질 수 있습니다.

<div class="content-ad"></div>


![Graph](/assets/img/2024-06-19-ForecastingNon-FarmPayrollsWithLinearRegression_2.png)
