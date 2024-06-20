---
title: "R에서 Caret 패키지로 분류 모델 생성하기"
description: ""
coverImage: "/assets/img/2024-06-20-ClassificationModelinRwithCaretPackage_0.png"
date: 2024-06-20 15:59
ogImage: 
  url: /assets/img/2024-06-20-ClassificationModelinRwithCaretPackage_0.png
tag: Tech
originalTitle: "Classification Model in R with Caret Package"
link: "https://medium.com/@andiyudha/classification-model-in-r-with-caret-package-373f20e31dd"
---



Classification And Regression Training, 또는 caret으로 줄여서 부르는 것은 R 프로그래밍 패키지로, 예측 모델을 만드는 과정을 간소화하려는 함수를 포함하고 있어요. 이 패키지에는 다음과 같은 기능들이 포함되어 있어요:

- 데이터 분할
- 데이터 전처리
- 특성 선택
- 리샘플링을 이용한 모델 튜닝
- 변수 중요도 추정

또한 다른 기능들도 있답니다.

![image](/assets/img/2024-06-20-ClassificationModelinRwithCaretPackage_0.png)

<div class="content-ad"></div>

이 예시에서는 R 프로그래밍 언어를 사용하여 https://www.kaggle.com/datasets/deepcontractor/smoke-detection-dataset 사이트에서 제공하는 데이터셋을 사용하여 Smoke detection을 예측합니다.

# 라이브러리

이 모델에서 사용할 라이브러리는 다음과 같습니다:

```js
library(tidyverse)
library(caret)
library(rpart.plot)
library(corrplot)
library(ggcorrplot)
```

<div class="content-ad"></div>

Tidyverse 패키지를 사용하여 데이터 세트를 수정하고 조작하며, 변수들 간의 상관 관계를 찾기 위해 corrplot을 사용할 수 있어요.

# 데이터 세트

데이터 세트는 다음과 같이 구성되어 있어요:

| 변수명          | 데이터 형태                | 예시                          |
|----------------|-------------------------|-------------------------------|
| UTC            | 날짜 및 시간 형식(dttm)    | 2022-06-09 00:08:51, 2022-06-09 00:08:52, 2022-06-09... |
| Temperature[C] | 실수형(double)             | 20.000, 20.015, 20.029, 20.044, 20.059, 20.073...         |
| Humidity[%]    | 실수형(double)             | 57.36, 56.67, 55.96, 55.28, 54.69, 54.12...            |
| TVOC[ppb]      | 실수형(double)             | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0...               |
| eCO2[ppm]      | 실수형(double)             | 400, 400, 400, 400, 400, 400, 400, 400, 400, 400...      |
| Raw H2         | 실수형(double)             | 12306, 12345, 12374, 12390, 12403, 12419...           |
| Raw Ethanol    | 실수형(double)             | 18520, 18651, 18764, 18849, 18921, 18998...           |
| Pressure[hPa]  | 실수형(double)             | 939.735, 939.744, 939.738, 939.736, 939.744...        |
| PM1.0          | 실수형(double)             | 0.00, 0.00, 0.00, 0.00, 0.00, 0.00...              |
| 그 외 변수들     | ...                       | ...                           |

<div class="content-ad"></div>

지시하신 데이터셋에 결측 데이터가 없는지 확인하시고 이 데이터셋에 대해 데이터 처리를 수행할 수 있습니다. 데이터셋은 다음과 같은 변수로 구성되어 있습니다:

1. UTC: 실험이 수행된 시간
2. Temperature[C]: 환경 온도, 섭씨로 측정
3. Humidity[%]: 실험 중의 대기 습도
4. TVOC[ppb]: 총 휘발성 유기 화합물, ppb(십억분의 1) 단위로 측정
5. eCO2[ppm]: CO2 동등 농도, ppm(백만분의 1) 단위로 측정
6. Raw H2: 주위에 존재하는 생수소의 양 [보정되지 않은 생 분자수소; 바이어스, 온도 등을 보정한 것이 아님]
7. Raw Ethanol: 주위에 존재하는 생 에탄올의 양
8. Pressure[hPa]: 대기압, hPa로 측정
9. PM1.0: 지름이 1.0 마이크로미터 미만인 미립자
10. PM2.5: 지름이 2.5 마이크로미터 미만인 미립자
11. NC0.5: 지름이 0.5 마이크로미터 미만인 미립자의 농도
12. NC1.0: 지름이 1.0 마이크로미터 미만인 미립자의 농도
13. NC2.5: 지름이 2.5 마이크로미터 미만인 미립자의 농도
14. CNT: 샘플 카운트. 화재 경보(실제) 화재가 발생했을 경우 값은 1, 그렇지 않으면 0
15. Fire Alarm: 1은 양성, 0은 양성이 아님

# 데이터 처리

모델링을 수행하기 전 데이터셋 처리. 필요한 변수 선택하고 CNT, Sample Count 변수는 선택하지 않습니다.

<div class="content-ad"></div>

```js
raw_data %>%
  select(
         temp_c = `Temperature[C]`,
         humidity = `Humidity[%]`,
         tvoc = `TVOC[ppb]`,
         co2 = `eCO2[ppm]`,
         h2 = `Raw H2`,
         ethanol = `Raw Ethanol`,
         pressure = `Pressure[hPa]`,
         pm1 = PM1.0,
         pm2_5 = PM2.5,
         fire_alarm = `Fire Alarm`
         ) %>%
  mutate(
    fire_alarm = factor(fire_alarm, levels = c(1,0), labels = c("yes", "no"))
  ) %>%
  glimpse() -> df_data
```

```js
Rows: 62,630
Columns: 10
$ temp_c     <dbl> 20.000, 20.015, 20.029, 20.044, 20.059, 20.073, 20.08…
$ humidity   <dbl> 57.36, 56.67, 55.96, 55.28, 54.69, 54.12, 53.61, 53.2…
$ tvoc       <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,…
$ co2        <dbl> 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400…
$ h2         <dbl> 12306, 12345, 12374, 12390, 12403, 12419, 12432, 1243…
$ ethanol    <dbl> 18520, 18651, 18764, 18849, 18921, 18998, 19058, 1911…
$ pressure   <dbl> 939.735, 939.744, 939.738, 939.736, 939.744, 939.725,…
$ pm1        <dbl> 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,…
$ pm2_5      <dbl> 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,…
$ fire_alarm <fct> no, no, no, no, no, no, no, no, no, no, no, no, no, n…
```

상관 관계 플롯을 수행

<img src="/assets/img/2024-06-20-ClassificationModelinRwithCaretPackage_1.png" />

<div class="content-ad"></div>

상관 행렬을 기반으로 통찰력을 얻을 수 있습니다:

- 대상 특징과 다른 특징 간에는 높은 상관 관계가 없습니다. 대상 특징과 습도, 압력 사이에 약한 양의 상관 관계가 있습니다. 또한 대상 특징과 TVOC, 원무 에탄올 간에는 약한 음의 상관 관계가 있습니다.
- eCO2와 TVOC, PM1.0 간에는 높은 양의 상관 관계가 있습니다. 또한 압력과 습도, 원시 H2와 원시 에탄올, PM1.0과 eCO2, PM2.5 간에도 높은 양의 상관 관계가 있습니다.

# 데이터 분할

데이터를 학습 및 테스트 데이터셋으로 8:2의 비율로 분할합니다. 일반적으로 더 큰 데이터셋에서 학습하는 모델이 더 정확해지지만, 더 많은 학습 데이터는 모델을 학습하는 데 더 많은 시간이 걸릴 수 있습니다.

<div class="content-ad"></div>

우리의 데이터를 나누기 위해 caret 패키지의 createDataPartition()를 사용할 거에요. 이 함수는 넘겨주는 벡터의 인덱스들을 비례에 따라 랜덤하게 샘플링합니다. 그런 다음 이러한 인덱스를 사용하여 전체 데이터셋을 테스트 및 트레이닝 데이터셋으로 나눌 수 있어요.

```js
# 랜덤 시드 설정
set.seed(123)

# 데이터 분할
train_index <- createDataPartition(df_data$fire_alarm, times = 1, p = 0.8, list = FALSE)

train_data <- df_data[train_index, ] %>% glimpse
```

```js
# 테스트 데이터
test_data <- df_data[-train_index, ] %>% glimpse
```

# 모델 개발

<div class="content-ad"></div>

저희가 데이터에 어떤 알고리즘이 잘 동작할지 미리 알 수 없어요. 다양한 방법을 시험해보고 어떤 것이 잘되는지 보고, 그런 방법을 두드려야 해요.

## 선형 알고리즘:
1. 로지스틱 회귀 (LG),
2. 선형 판별 분석 (LDA)
3. 정규화된 로지스틱 회귀 (GLMNET)

<div class="content-ad"></div>

## 비선형 알고리즘:
1. k-최근접 이웃 알고리즘(KNN),

2. 분류 및 회귀 트리(CART),

3. 나이브 베이즈(NB),

4. 방사 기저 함수를 사용한 서포트 벡터 머신(SVM).

<div class="content-ad"></div>

데이터가 많으므로 10-fold 교차 검증과 3회 반복을 사용할 것입니다. 이는 표준 테스트 하네스 구성입니다. 여러분의 이진 분류 문제에 대해 간단하게 정확도와 Kappa 지표를 사용할 것입니다. AUC(ROC 곡선 아래 영역)를 선택하고 민감도 및 특이도를 살펴 최적의 알고리즘을 선택할 수도 있었습니다.

```js
# 10-fold cross validation with 3 repeats
trainControl <- trainControl(method="repeatedcv", number=10, repeats=3, verboseIter = TRUE)

metric <- "Accuracy"
```

그런 다음, 각 알고리즘에 대한 모델을 작성합니다.

```js
# Bagged CART
set.seed(7)
fit.treebag <- train(fire_alarm~., data = train_data, method = "treebag", metric = metric,trControl = trainControl)

# RF
set.seed(7)
fit.rf <- train(fire_alarm~., data = train_data, method = "rf", metric = metric,trControl = trainControl)

# GBM - Stochastic Gradient Boosting
set.seed(7)
fit.gbm <- train(fire_alarm~., data = train_data, method = "gbm",metric = metric,trControl = trainControl, verbose = FALSE)

# C5.0
set.seed(7)
fit.c50 <- train(fire_alarm~., data = train_data, method = "C5.0", metric = metric,trControl = trainControl)

# LG - Logistic Regression
set.seed(7)
fit.glm <- train(fire_alarm~., data = train_data, method="glm",
                 metric=metric,trControl=trainControl)
# LDA - Linear Discriminate Analysis
set.seed(7)
fit.lda <- train(fire_alarm~., data = train_data, method="lda",
                 metric=metric,trControl=trainControl)

# GLMNET - Regularized Logistic Regression
set.seed(7)
fit.glmnet <- train(fire_alarm~., data = train_data, method="glmnet",
                 metric=metric,trControl=trainControl)

# KNN - k-Nearest Neighbors 
set.seed(7)
fit.knn <- train(fire_alarm~., data = train_data, method="knn",
                 metric=metric,trControl=trainControl)

# CART - Classification and Regression Trees (CART), 
set.seed(7)
fit.cart <- train(fire_alarm~., data = train_data, method="rpart",
                 metric=metric,trControl=trainControl)

# NB - Naive Bayes (NB) 
set.seed(7)
Grid = expand.grid(usekernel=TRUE,adjust=1,fL=c(0.2,0.5,0.8))
fit.nb <- train(fire_alarm~., data = train_data, method="nb",
                 metric=metric,trControl=trainControl,
                tuneGrid=Grid)
```

<div class="content-ad"></div>

모델을 구축한 후에는 모델을 비교하여 더 나은 정확도를 찾을 수 있어요! 😊

```js
Call:
summary.resamples(object = ensembleResults)

Models: BAG, RF, GBM, C50, LG, KNN, NB, CART, GLMNET 
Number of resamples: 30 

정확도 
            Min.   1st Qu.    Median      Mean   3rd Qu.      Max. NA's
BAG    0.9994013 0.9998004 0.9998004 0.9998337 1.0000000 1.0000000    0
RF     0.9996008 0.9998004 1.0000000 0.9999202 1.0000000 1.0000000    0
GBM    0.9986028 0.9996008 0.9998004 0.9996407 0.9998004 1.0000000    0
C50    0.9992014 0.9996009 0.9998004 0.9998071 1.0000000 1.0000000    0
LG     0.8467372 0.8629515 0.8861393 0.8797790 0.8933134 0.9030134    0
KNN    0.9990018 0.9996007 0.9998004 0.9996341 0.9998004 1.0000000    0
NB     0.9417282 0.9443613 0.9463074 0.9470978 0.9505089 0.9527041    0
CART   0.9590900 0.9654244 0.9809419 0.9754183 0.9829849 0.9896208    0
GLMNET 0.8848303 0.8931245 0.8957294 0.8954128 0.8985681 0.9026142    0

카파 
            Min.   1st Qu.    Median      Mean   3rd Qu.      Max. NA's
BAG    0.9985319 0.9995105 0.9995106 0.9995922 1.0000000 1.0000000    0
RF     0.9990214 0.9995107 1.0000000 0.9998043 1.0000000 1.0000000    0
GBM    0.9965712 0.9990210 0.9995105 0.9991189 0.9995106 1.0000000    0
C50    0.9980418 0.9990214 0.9995107 0.9995269 1.0000000 1.0000000    0
LG     0.6691273 0.6941347 0.7051705 0.7105437 0.7312704 0.7512402    0
KNN    0.9975507 0.9990206 0.9995106 0.9991025 0.9995106 1.0000000    0
NB     0.8632215 0.8695786 0.8735418 0.8754793 0.8834493 0.8880163    0
CART   0.8997615 0.9156698 0.9523262 0.9397203 0.9575309 0.9747781    0
GLMNET 0.7052235 0.7262274 0.7346055 0.7332479 0.7403128 0.7496404    0
```

<img src="/assets/img/2024-06-20-ClassificationModelinRwithCaretPackage_2.png" />

랜덤 포레스트가 가장 높은 정확도(99.99%)를 보이며, 그 다음으로 BAG (Bagged CART) (99.98%)와 C5.0 (99.93%)이 뒤를 이어요! 🚀🌟

<div class="content-ad"></div>

# 모델 완성

높은 정확도를 가진 트리 알고리즘인 Random Forest, BAG, 그리고 C5.0를 선택하여 예측을 진행할 것이며, 테스트 데이터셋으로 모델 및 정확도를 테스트할 예정입니다.

```js
# 모델 저장
saveRDS(fit.c50, here::here("finalModel_c50.rds"))
saveRDS(fit.rf, here::here("finalModel_rf.rds"))
saveRDS(fit.treebag, here::here("finalModel_treebag.rds"))
```

```js
predict_c50 <- predict(model_c50, test_data)
summary(predict_c50)

# 혼동 행렬
cf_c50 <- confusionMatrix(predict_c50, test_data$fire_alarm)

cf_c50
```

<div class="content-ad"></div>

```js
예   아니요 
8950 3575 
혼동 행렬 및 통계

          참조
예측     예    아니요
       예 8949    1
       아니요     2 3573
                                     
              정확도 : 0.9998     
                 95% 신뢰구간 : (0.9993, 1)
    정보 부재율 : 0.7147     
    P-값 [정확도 > 정보 부재율] : <2e-16     
                                     
                  카파 : 0.9994     
                                     
 맥네마의 검정 P-값 : 1          
                                      
            민감도 : 0.9998     
            특이도 : 0.9997     
         양성 예측치 : 0.9999     
         음성 예측치 : 0.9994     
             유병률 : 0.7147     
         발견 비율 : 0.7145     
   발견 유병률 : 0.7146     
      균형 정확도 : 0.9997     
                                     
     '양성' 클래스 : 예
```

랜덤 포레스트 모델을 로드하고 테스트 데이터로 예측을 생성합니다.

```js
# 의사결정 트리 랜덤 포레스트
model_rf <- readRDS(here::here("finalModel_rf.rds"))
print(model_rf)
```

```js
랜덤 포레스트 

50105 개 샘플
    9 예측 변수
    2 클래스: '예', '아니요' 

사전 처리 없음
샘플링: 교차 검증 (10-fold, 3회 반복) 
샘플 크기 요약: 45095, 45094, 45094, 45094, 45095, 45094, ... 
튜닝 매개변수에 따른 샘플링 결과:

  mtry  정확도   카파    
  2     0.9999202  0.9998043
  5     0.9999202  0.9998043
  9     0.9998736  0.9996901

가장 큰 값을 사용하여 최적 모델을 선택하는 데 정확도가 사용되었습니다.
모델에 사용된 최종 값은 mtry = 2입니다.
```

<div class="content-ad"></div>

```R
predict_rf <- predict(model_rf, test_data)
summary(predict_rf)

# Confusion Matrix
cf_rf <- confusionMatrix(predict_rf, test_data$fire_alarm)

cf_rf
```

```R
yes   no 
8952 3573 
Confusion Matrix and Statistics

          Reference
Prediction  yes   no
       yes 8951    1
       no     0 3573
                                     
               Accuracy : 0.9999     
                 95% CI : (0.9996, 1)
    No Information Rate : 0.7147     
    P-Value [Acc > NIR] : <2e-16     
                                     
                  Kappa : 0.9998     
                                     
 Mcnemar's Test P-Value : 1          
                                     
            Sensitivity : 1.0000     
            Specificity : 0.9997     
         Pos Pred Value : 0.9999     
         Neg Pred Value : 1.0000     
             Prevalence : 0.7147     
         Detection Rate : 0.7147     
   Detection Prevalence : 0.7147     
      Balanced Accuracy : 0.9999     
                                     
       'Positive' Class : yes
```

Bagged CART 모델 로드하기

```R
# 분류 및 회귀 트리 (CART)
model_treebag <- readRDS(here::here("finalModel_treebag.rds"))

print(model_treebag)
```

<div class="content-ad"></div>

```js
Bagged CART 

50105 개의 샘플
    9 개의 예측 변수
    2 개의 클래스: 'yes', 'no' 

사전 처리 없음
리샘플링: 교차 확인(10 폴드, 3회 반복) 
샘플 크기 요약: 45095, 45094, 45094, 45094, 45095, 45094, ... 
리샘플링 결과:

  정확도   카파    
  0.9998337  0.9995922
```

```js
predict_treebag <- predict(model_treebag, test_data)
summary(predict_treebag)

# 혼동 행렬
cf_treebag <- confusionMatrix(predict_treebag, test_data$fire_alarm)

cf_treebag
```

```js
Confusion Matrix and Statistics

          실제값
예측값   yes   no
       yes 8951    2
       no     0 3572
                                     
               정확도 : 0.9998     
                 95% 신뢰 구간 : (0.9994, 1)
    정보 없는 비율 : 0.7147     
    P-값 [정확도 > 정보 없는 비율] : <2e-16     
                                     
                  카파 : 0.9996     
                                     
 맥네머의 테스트 P-값 : 0.4795     
                                     
            민감도 : 1.0000     
            특이도 : 0.9994     
         양성 예측 값 : 0.9998     
         음성 예측 값 : 1.0000     
             유병률 : 0.7147     
         감지율 : 0.7147     
   감지 유병률 : 0.7148     
      균형 정확도 : 0.9997     
                                     
       '양성' 클래스 : yes
```

자세한 내용은 깃허브 저장소를 방문해 주세요. 이 절을 읽어 주셔서 감사합니다.