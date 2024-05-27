---
title: "SOFTS 시리즈-코어 퓨전을 활용한 효율적인 다변수 시계열 예측"
description: ""
coverImage: "/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_0.png"
date: 2024-05-27 14:15
ogImage:
  url: /assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_0.png
tag: Tech
originalTitle: "SOFTS: Efficient Multivariate Time Series Forecasting with Series-Core Fusion"
link: "https://medium.com/towards-artificial-intelligence/softs-efficient-multivariate-time-series-forecasting-with-series-core-fusion-0ac40d2adcd2"
---

## 새로운 MLP 기반 모델인 SOFTS는 혁신적인 STar Aggregate-Dispatch (STAD) 모듈을 활용하여 계산 복잡성을 이차 방정식에서 선형으로 줄여 놀라운 효율성과 확장성으로 다변량 시계열 예측에서 최첨단 성능을 달성합니다.

'와우, 시계열은 중요하지만 어렵다! 그리고...' 라고 말하는 부분을 건너 뜁니다. 이는 독자가 시계열 예측의 섬세함을 알고 핵심을 쉽게 이해하길 원한다고 가정한 것이죠!

이 논문은 무엇에 중점을 두나요?

# 기여

<div class="content-ad"></div>

이 논문의 주요 기여는 두 가지이며, "SOFT"와 "STAD"가 있습니다.

## SOFT

SOFT: Series-cOre Fused Time Series forecaster

이는 다변량 시계열 예측을 위해 설계된 것으로, 채널 독립성과 상관관계를 균형있게 유지하기 위해 STAD 모듈을 사용합니다. 이는 채널 상호작용을 전역 중심 표현으로 집중시킴으로써 선형 복잡성으로 우수한 성능을 달성하는 데 도움이 되었습니다.

<div class="content-ad"></div>

## STAD

STAD: STar Aggregate Dispatch 모듈

STAD는 SOFT의 기초가 되는 곳입니다. 여기서 SOFT는 간단한 MLP 기반 모델입니다. STAD는 다변량 시계열의 채널 간 종속성을 포착하는 중앙 집중식 구조입니다. 결과는 이 방법이 효과적이고 확장 가능하다는 것을 보여줍니다.

![이미지](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_0.png)

<div class="content-ad"></div>

## Reversible Instance Normalization

연구자들은 이 방법을 사용했습니다. 이는 ITRANSFORMER 논문에서 채택되어 정규화를 하이퍼파라미터로 고려했기 때문입니다.

iTransformer의 Reversible Instance Normalization은 단순히 역 치수에 대해 주의와 피드포워드 네트워크를 적용하여 다변량 상관 관계를 포착하고 비선형 표현을 효과적으로 학습할 수 있게 합니다.

## Series Embedding

<div class="content-ad"></div>

시리즈 임베딩은 패치 임베딩보다 덜 복잡합니다. 이를 전체 시리즈의 길이로 패치 길이를 설정하는 것과 같다고 말할 수 있습니다. 연구자들은 각 채널의 시리즈를 임베딩하기 위해 선형 투사를 사용했습니다:

![이미지](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_1.png)

## STar Aggregate Dispatch (STAD) 모듈

여러 STAD 모듈을 사용하여 시리즈 임베딩을 미세 조정합니다:

<div class="content-ad"></div>


![image1](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_2.png)

## Linear Predictor

After N layer of STAD, there is a linear predictor for our task (forecasting), if S_N is the output representation of layer n, the prediction will be as follows:

![image2](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_3.png)


<div class="content-ad"></div>

# 별 집합 디스패치 모듈

STar Aggregate Dispatch (STAD) 모듘은 다변량 시계열 예측에서 채널 간 종속성을 포착하기 위해 설계된 중앙 집중식 메커니즘입니다. 주의 메커니즘과 같은 전통적인 분산 구조와 달리 STAD는 각 채널 쌍의 특성을 직접 비교하여 이차 복잡성을 초래하는 것이 아닌, 중앙 집중식 전략을 사용하여 이러한 복잡성을 선형으로 줄입니다. 모든 시리즈에서 정보를 집계하여 전역 중심 표현으로 변환한 다음 이 핵심 정보를 다시 개별 시리즈 표현에 보내어 비정상 채널에 대한 개선된 강건성을 갖는 효율적인 채널 상호 작용이 가능하게 합니다.

이 중앙 집중 구조는 소프트웨어 엔지니어링에서의 별 모양 시스템에서 영감을 받았습니다. 여기서 중앙 서버가 직접 피어 간 통신이 아닌 정보를 집계하고 교환합니다. 이 설계를 통해 STAD는 채널 독립성의 혜택을 유지하면서 예측 정확도를 향상시키기 위해 필요한 상관 관계를 포착합니다. 채널 통계를 단일 핵심 표현으로 집계함으로써 STAD는 비정상적인 시계열에서 신뢰할 수 없는 상관 관계에 의존하는 위험을 완화합니다.

![이미지](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_4.png)

<div class="content-ad"></div>

적용된 결과에 따르면 STAD 모듈은 기존의 최첨단 방법보다 우수한 성능을 보여주며, 그럼에도 불구하고 상당히 낮은 계산 요구량으로 그 성과를 이룹니다. 이는 많은 다른 트랜스포머 기반 모델들에 대한 도전이었던 채널 수가 많거나 긴 lookback 창을 가진 데이터셋에 대해 확장 가능하게 만듭니다. 게다가 STAD 모듈의 일반성 덕분에 다양한 트랜스포머 기반 모델들에서 어텐션 메커니즘을 대체로 사용할 수 있으며, 그 효율성과 효과를 한층 더 입증하고 있습니다.

STAD의 입력은 각 채널에 대한 시리즈 표현이며, MLP를 통해 처리한 후 풀링합니다 (여기서는 확률적 풀링을 사용합니다):

![image](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_5.png)

이제 우리는 코어 표현(O)을 계산했으며, 코어와 모든 시리즈의 표현을 퓨전합니다:

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_6.png)

The Repeat_Concat concatenates the core representation O to each series representation to get Fi. Then we give this Fi to another MLP and add the output to the previous hidden dimension to calculate the next one.

- Note that there’s also a residual connection from the input to the output.

# Results


<div class="content-ad"></div>

메소드가 간단해 보이지만, 복잡성이 크게 줄었어요 (이차 함수에서 선형 함수로) 그런데 대단하죠 😅😉

![이미지1](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_7.png)

연구자들은 다양한 데이터셋을 실험하고 대부분의 선배들과 비교해보았는데, 아래에서 확인할 수 있어요:

![이미지2](/assets/img/2024-05-27-SOFTSEfficientMultivariateTimeSeriesForecastingwithSeries-CoreFusion_8.png)

<div class="content-ad"></div>

그들은 다른 실험도 수행했지만, 이 문서를 너무 길게 만들지 않기 위해 원래 연구 논문을 읽는 것을 추천합니다.

면책사항: 이 문서를 작성하는 데 Nouswise를 사용했는데, 이는 문서를 통해 정보를 찾을 수 있는 검색 엔진과 같은 것입니다. 보통 일반적으로 이용할 수는 없지만, 직접 저에게 연락하여 접근 권한을 부여받을 수 있습니다. 연락처는 X(이전 트위터) 또는 우리 디스코드 서버에 있을 수 있습니다.
