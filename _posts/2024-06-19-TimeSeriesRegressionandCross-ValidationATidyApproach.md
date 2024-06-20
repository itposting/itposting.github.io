---
title: "시계열 회귀 및 교차 검증 깔끔한 접근 방식"
description: ""
coverImage: "/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_0.png"
date: 2024-06-19 20:22
ogImage: 
  url: /assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_0.png
tag: Tech
originalTitle: "Time Series Regression and Cross-Validation: A Tidy Approach"
link: "https://medium.com/towards-data-science/time-series-regression-and-cross-validation-a-tidy-approach-8bc31d5a31f2"
---


![Image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_0.png)

시계열 예측 방법은 항상 발전하고 있습니다. ARIMA가 오랫동안 기초를 이루어 왔지만, 머신러닝 모델도 큰 약속을 보여줍니다. 다양한 산업 분야에서 자료를 시간에 따라 더 정확하게 모델링할 수 있는 경우가 있습니다. 이 글에서는 그 중 하나인 매출 예측을 다루어 보겠습니다. 소중한 시간을 아끼기 위해, 바로 본문으로 넘어가겠습니다.

# 코드

이 글에서 모든 것을 재현하는 코드는 제 GitHub 저장소에서 찾을 수 있습니다.

<div class="content-ad"></div>

# 데이터 세트

이 연습에서는 Kaggle에서 Samuel Cortinhas가 공개한 CC0: Public 도메인으로 제공되는 시계열 데이터 연습 데이터 세트를 사용합니다. 이 데이터 세트는 10년(2010년부터 2019년) 동안의 모의 시계열 데이터를 포함하며 날짜, 상점 ID, 제품 ID 및 매출 기능이 포함되어 있습니다. 이 분석에서는 회귀 구성 요소에 초점을 맞추기 위해 단일 상점과 제품을 선택했습니다.

![](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_1.png)

# 시계열 분석

<div class="content-ad"></div>

## 단계 0: 설정하기

나는 데이터 탐색과 회귀를 위해 다음 패키지들을 사용할 것입니다. 로딩하기 전에 아래 명령어를 사용하여 설치할 수 있습니다: install.packages("package_name").

```js
# 필요한 라이브러리 로딩하기
library(tidyverse)
library(lubridate)
library(tidymodels)
library(modeltime)
library(timetk)
library(viridis)
``` 

## Step 1: 날짜 및 해당할 수 있는 모든 것들!!

<div class="content-ad"></div>

날짜는 제가 가장 좋아하는 변수입니다. 하나의 날짜 열은 많은 정보를 담고 있어요. 이 시나리오에서는 판매와의 관계를 탐색하기 위해 날짜 열에서 새로운 특징들을 만들 거에요. 하지만 먼저, 날짜 열을 문자열로만 사용하는 것보다는 as.Date()를 사용하여 정리할 거에요.

```r
data <- data %>%
  mutate(date = as.Date(date, format = "%m/%d/%Y"))
```

다음으로 회귀 분석을 위해 이 날짜 열에서 새로운 특징들을 만들 거에요. Lubridate 패키지는 이 작업을 간단하게 만들어 주는 편리한 함수들로 구성돼 있어요.

```r
# 시간과 관련된 요소를 포함하기 위해 데이터 전처리
df <- data %>%
  mutate(
    year = year(date),
    semester = factor(semester(date)),
    quarter = factor(quarter(date)),
    day_in_week = factor(wday(date, label = TRUE)),
    week_in_year = factor(week(date)),
    day_in_year = factor(yday(date)),
    month = factor(month(date, label = TRUE))
  )
```

<div class="content-ad"></div>

이제 데이터가 다음과 같이 보입니다:

![image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_2.png)

## 단계 2: 탐색적 데이터 분석

단일 날짜 열에서 생성된 모든 이러한 새로운 흥미로운 기능들과 매출과의 관골을 탐색해 볼 것입니다. 연간 계절성부터 시작하겠습니다.

<div class="content-ad"></div>

```js
df %>%
  ggplot(aes(date, sales)) +
  geom_line(alpha = 1, size = 1, color = "darkblue") +  
  theme_bw() +
  labs(title = "일별 매출 분포 변화", x = "날짜", y = "매출") +
  scale_x_date(date_labels = "%Y", date_breaks = "2 years") +  
  scale_y_continuous(labels = scales::comma) 
```

<img src="/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_3.png" />

매출 데이터에는 명확한 계절성과 특정한 추세가 있습니다. 이제 요일과의 관계를 살펴보겠습니다.

```js
df %>%
  ggplot(aes(day_in_week, sales, color = day_in_week)) +
  geom_boxplot() +
  geom_jitter(alpha = 0.1) +
  theme_bw() +
  scale_colour_viridis_d() +
  labs(title = "요일별 일일 매출 분포", x = "요일", y = "매출") +
  scale_x_discrete() +
  scale_y_continuous(labels = scales::comma)
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_4.png)

이제 월별 분포를 살펴보겠습니다.

```js
df |> 
  ggplot(aes(month, sales)) +
  geom_violin(color = "darkgreen") +  
  geom_jitter(alpha = 0.2, aes(color = sales)) +  
  theme_light() +
  geom_smooth(method = "loess", se = FALSE) +  
  scale_colour_viridis_c() +
  labs(title = "Daily Sales Distribution by Month", x = "", y = "Sales", color= "Sales")
```

![Image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_5.png)


<div class="content-ad"></div>

이제 모델링으로 넘어가겠습니다.

## 단계 3: 데이터 분할 및 교차 검증 설정

tidymodels에서 제공하는 initial_time_split() 함수를 사용하여 데이터를 학습 및 테스트 세트로 나누겠습니다.

```R
df_split <- df |> 
  initial_time_split(prop=0.9)  # 90% 데이터를 학습에, 10%를 테스트에 할당

df_train <- training(df_split)
df_test <- testing(df_split)
```

<div class="content-ad"></div>

이것이 분할의 모습입니다:

<img src="/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_6.png" />

교차 검증은 입력 데이터의 하위 집합에서 모델을 학습시키고 나머지 데이터에서 평가하여 모델을 평가하는 데 사용할 수 있습니다. 일반적인 교차 검증 방법은 데이터 포인트를 무작위로 선택하여 학습 데이터 집합에 할당합니다. 그러나 이 방법은 데이터가 순차적이어야하기 때문에 시계열에 적합하지 않습니다. Timetk 패키지에는 시계열 데이터 세트에 대한 교차 검증 폴드를 특별히 생성하고 해당 분할을 시각화하는 데 사용할 수있는 멋진 함수인 time_series_cv()가 있습니다.

```R
# 교차 검증 분할 생성
df_folds <- 
  time_series_cv(
    df_train, 
    initial = "3 years", 
    assess = "1 year", 
    skip = "6 months",
    slice_limit = 5)  

# 분할 시각화
plot_time_series_cv_plan(df_folds, date, sales)
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_7.png" />

## 단계 4: 모델링을 위한 데이터 준비

레시피는 새로운 예측 변수를 만들고 모델에서 필요한 몇 가지 전처리를 수행할 수 있는 객체입니다. 저는 auto ARIMA 및 랜덤 포레스트 두 모델을 시도하고 싶기 때문에 두 레시피 객체를 만들 것입니다. 레시피()의 첫 번째 단계는 회귀 분석을 위한 공식입니다.

```js
recipe_autoarima <- 
  recipe(sales ~ date,
         data = df_train)
```

<div class="content-ad"></div>

두 번째 랜덤 포레스트 레시피에는 step_holiday()를 사용하여 date 데이터를 공휴일에 대한 하나 이상의 이진 지표 변수로 변환하는 기능을 추가할 것입니다. 또한 step_rm()을 사용하여 date 열을 제거하고 step_dummy()를 사용하여 모든 명목 예측 변수를 더미 변수로 변환할 것입니다.

```js
recipe_rf <- 
  recipe(sales ~ ., data = df_train) |>
  step_holiday(date, holidays = timeDate::listHolidays("US")) |>  
  step_rm(date) |>  
  step_dummy(all_nominal_predictors())
```

다음은 recipe 객체가 보이는 모습입니다:

![Recipe Object](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_8.png)

<div class="content-ad"></div>

레시피 객체는 학습 및 테스트 데이터셋에서 반복 가능한 단계 시퀀스를 만들어주어 긴 피처 엔지니어링 코드를 작성하지 않고도 사용할 수 있습니다. 저는 이를 피처 엔지니어링의 단축키로 생각해요!

아래 명령은 레시피 객체가 데이터셋을 업데이트하고 새로 생성된 열을 이해하는 데 사용될 수 있습니다.

```js
recipe_rf |> prep() |> bake(new_data = NULL)
```

## 단계 5: 모델 사양 및 재표본화

<div class="content-ad"></div>

레시피를 만들면, 각각의 두 모델에 대한 명세서를 작성할 것입니다. ARIMA에 Modeltime을 사용하고 랜덤 포레스트에는 Tidymodels를 사용할 예정이에요. 이것들은 일관된 단계적 흐름으로 여러 모델에 대한 명세를 만드는 훌륭한 방법을 제공합니다.

```js
# Auto ARIMA 모델 명세
auto_arima_spec <- arima_boost() |> 
  set_mode("regression") |> 
  set_engine('auto_arima_xgboost')

# Random Forest 모델 명세
rf_spec <- 
  rand_forest(trees = 500) |>  
  set_mode("regression") |> 
  set_engine("ranger")
```

## 단계 6: Workflow 세트

workflow()는 전처리, 모델링, 후처리 요청을 함께 묶을 수 있는 객체입니다. 여러 모델과 리샘플링을 사용할 때, workflow 세트를 사용하는 것이 더 편리하다고 발견했어요.

<div class="content-ad"></div>

이제 recipe 객체와 해당하는 모델 사양을 workflow_set()을 사용하여 결합할 것입니다. 기본적으로 cross 파라미터는 TRUE로 설정되어 있어서 각 recipe 객체가 각 모델 사양과 일치하도록 합니다. 이 경우에는 각 recipe 객체가 해당하는 모델 사양과 일치하도록 FALSE로 설정할 것입니다.

```js
workflowset_df <- 
  workflow_set(
    list(recipe_autoarima, recipe_rf),
    list(auto_arima_spec, rf_spec),
    cross=FALSE
  )
```

이것이 workflow 객체입니다. 현재 결과가 없지만, 교차 검증이 완료되면 결과를 저장하기 위한 자리 표시자가 있습니다.

![그림](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_9.png)

<div class="content-ad"></div>

## 단계 7: 모델 학습 시간입니다

지금까지 새로운 특성을 만들고 데이터를 전처리하고 모델 사양을 만들고 워크플로 세트를 구축했습니다. 이제 훈련 세트 및 리샘플링 폴드를 사용하여 모델을 적합시키겠습니다. 결과를 나중에 분석할 df_results에 결과를 저장할 것입니다.

```js
df_results <-
  workflow_map(
    workflowset_df,
    "fit_resamples",
    resamples = df_folds
  )
```

이렇게 하면 workflowset_df의 모든 워크플로에 대해 루프를 반복하고 각각에 fit_resamples 함수를 적용하여 df_folds 교차 검증 객체를 사용합니다. 각 실행의 결과는 df_results의 해당 모델 행 아래에 저장됩니다. 결과 열이 이제 교차 검증 결과로 채워졌음을 유의하십시오. 이러한 결과는 필요한 경우 unnest()를 사용하여 추출할 수 있습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_10.png)

결과는 tidymodels의 정말 멋진 기능인 autoplot() 명령을 사용하여 신속하게 시각화할 수도 있습니다.

```js
autoplot(df_results)
```

![image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_11.png)


<div class="content-ad"></div>

모든 리샘플에서 랜덤 포레스트가 ARIMA와 비교했을 때 더 낮은 RMSE(평균 제곱근 오차)와 R-제곱을 보여주고 있습니다.

## 단계 8: 테스트 데이터 적합

이제 df_results의 결과를 순위 매겨 가장 낮은 RMSE를 기준으로 가장 성능이 좋은 모델을 식별하겠습니다. 해당 모델의 ID 및 매개변수를 검색하고 이 최적화된 모델을 훈련 데이터에 맞출 것입니다. 그런 다음, 이 모델을 사용하여 테스트 데이터셋에서 판단하고 새로운 지표를 확인하겠습니다.

```r
# 최고의 rmse를 가진 workflow의 ID 가져오기
best_workflow_id <- df_results %>%
  rank_results(rank_metric = "rmse") %>%
  head(1) %>%
  pull(wflow_id)  

## best_workflow_id와 관련된 매개변수 가져오기
best_params <- df_results %>%
  extract_workflow_set_result(id = best_workflow_id) %>%
  select_best(metric = "rmse")  

## best_workflow_id와 관련된 workflow 가져오기
best_workflow <- df_results %>%
  extract_workflow(id = best_workflow_id)  

# 최적화된 매개변수로 workflow 완성
finalized_workflow <- finalize_workflow(best_workflow, best_params) 

finalized_workflow
```

<div class="content-ad"></div>

다음은 최종 워크플로우의 모습입니다:

![image](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_12.png)

이제 이 워크플로우를 사용하여 fit() 및 augment()를 사용하여 테스트 데이터 세트에서 예측하겠습니다. 이 예측을 기반으로 지표를 측정할 것입니다.

```R
predictions <- finalized_workflow %>%
  fit(df_train) %>%
  augment(df_test)  

## 평가 지표 계산
evaluation_metrics <- metric_set(rmse, mae, rsq)
results <- evaluation_metrics(predictions, truth = sales, estimate = .pred) 
print(results)  
```

<div class="content-ad"></div>

다음은 최종 지표가 표시되는 모습입니다:

![Final Metrics](/assets/img/2024-06-19-TimeSeriesRegressionandCross-ValidationATidyApproach_13.png)

정말 잘 했어요!

# 성공했어요!

<div class="content-ad"></div>

이 기사를 통해 tidymodels, modeltime 및 timetk가 시계열 회귀 모델을 구축하는 강력한 프레임워크를 제공하는 방법에 대해 명확해졌으면 좋겠고, 여러분이 한 번 시도해볼 것으로 바랍니다! 이 기사는 한 가게와 제품 ID를 위해 만들어 졌지만, 이것은 어떤 가게와 제품 조합에 대해 이를 복제할 수 있는 Shiny 웹 애플리케이션을 구축하기 위한 좋은 사례가 될 수 있습니다. 즐거운 코딩하세요!

# 코드

이 기사의 모든 내용을 다시 만들기 위한 코드는 제 GitHub 저장소에서 찾을 수 있습니다.

마음껏 찾아주세요. LinkedIn에서 저를 찾아보세요.

<div class="content-ad"></div>

글에서 언급되지 않는 한, 모든 이미지는 저자가 찍은 것입니다.