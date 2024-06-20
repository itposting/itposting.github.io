---
title: "시계열 분할 기술 정확한 모델 유효성 검증 보장하기"
description: ""
coverImage: "/assets/img/2024-06-19-TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation_0.png"
date: 2024-06-19 18:56
ogImage: 
  url: /assets/img/2024-06-19-TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation_0.png
tag: Tech
originalTitle: "Time Series Splitting Techniques: Ensuring Accurate Model Validation"
link: "https://medium.com/@mouadenna/time-series-splitting-techniques-ensuring-accurate-model-validation-5a3146db3088"
---


시계열 데이터 작업 중이시군요. 멋지네요! 그러나 모델 훈련에 들어가기 전에 데이터를 나누는 방법에 대해 이야기해보죠. 시계열 데이터를 나눌 때는 날짜 순서를 유지하고 데이터 누수를 피하는 것이 중요합니다. 모델이 정확하고 신뢰할 수 있도록 유지하는 효과적인 시계열 분할 기술을 살펴봅시다.

# 1. TimeSeriesSplit

`TimeSeriesSplit`을 데이터 분할의 믿음직한 타임키퍼로 생각해보세요. 이는 데이터를 연속적인 폴드로 나누어, 각 훈련 세트가 과거 데이터에서 형성되고 각 테스트 세트가 미래 데이터에서 형성되도록 보장합니다.

![Time Series Splitting Techniques Ensuring Accurate Model Validation](/assets/img/2024-06-19-TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation_0.png)

<div class="content-ad"></div>

```python
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)
for train_index, test_index in tscv.split(X):
 X_train, X_test = X[train_index], X[test_index]
 y_train, y_test = y[train_index], y[test_index}
```

# 2. Sliding/Rolling Window Split

In the rolling window approach, your model moves forward in time with a fixed-size training window that slides along your dataset. It’s like taking steps into the future while always keeping an eye on the past.

![TimeSeriesSplittingTechniques](/assets/img/2024-06-19-TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation_1.png)


<div class="content-ad"></div>


파이썬 코드:

```python
for date in pd.date_range('2021-01-01', '2021-12-31', freq='M'):
    delta = date - pd.offsets.MonthBegin(1)
    train = series.loc[delta:date-pd.offsets.Day(1)]
    valid = series.loc[date:date+pd.offsets.MonthEnd(1)]
```

## 3. 확장 창 분할

확장 창 분할을 사용하면 모델은 오래된 학습 세트로 시작하여 점차적으로 더 많은 관측 값을 포함하게 됩니다. 시간이 흐름에 따라 더 많은 데이터를 통합하여 지식을 축적하는 것과 같습니다.


![시각](/assets/img/2024-06-19-TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation_2.png)


<div class="content-ad"></div>

```python
for date in pd.date_range('2021-01-01', '2021-12-31', freq='M'):
 train = series.loc[:date-pd.offsets.Day(1)]
 valid = series.loc[date:date+pd.offsets.MonthEnd(1)]
```

# 4. Sliding Window with Gap Split

The sliding window with a gap introduces a buffer zone between your training and validation sets, ensuring no information from the future leaks into your model’s training. It’s like building a fence to keep your model focused on the present.

![TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation](/assets/img/2024-06-19-TimeSeriesSplittingTechniquesEnsuringAccurateModelValidation_3.png)

<div class="content-ad"></div>

```js
for date in pd.date_range('2021–01–01', '2021–12–31', freq='M'):
 delta = date - pd.offsets.MonthBegin(1)
 train = series.loc[delta:date-pd.offsets.Day(1)]
 valid = series.loc[date+pd.offsets.MonthEnd(1)+pd.offsets.Day(1):date+pd.offsets.MonthEnd(2)]
```

# 결론

내 경험상, 시계열 데이터의 올바른 분할 기술을 선택하는 것은 견고하고 신뢰할 수 있는 모델을 구축하는 데 중요합니다. 개인적으로 증가하는 창 분할이 장기적인 추세를 포착하는 데 특히 효과적이라고 생각합니다. 이는 모델이 점차적으로 더 많은 데이터 포인트로부터 배울 수 있기 때문입니다. 그러나 계산 리소스를 관리하기 위해 고정 크기의 학습 세트를 유지하고 싶은 경우, 슬라이딩 창 접근 방식이 잘 작동합니다. 궁극적으로, 최적의 기술은 특정 사례와 데이터의 특성에 따라 다릅니다. 시계열 예측 요구 사항에 가장 적합한 방법을 찾기 위해 다양한 방법을 실험해보세요.

# 참고 자료:

<div class="content-ad"></div>

https://robjhyndman.com/hyndsight/tscv/
https://otexts.com/fpp3/tscv.html
https://forecastegy.com/posts/time-series-cross-validation-python/