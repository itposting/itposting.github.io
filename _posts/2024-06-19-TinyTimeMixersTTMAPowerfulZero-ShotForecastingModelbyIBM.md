---
title: "작은 시간 혼합기 TTM IBM의 강력한 제로샷 예측 모델"
description: ""
coverImage: "/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_0.png"
date: 2024-06-19 03:07
ogImage: 
  url: /assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_0.png
tag: Tech
originalTitle: "Tiny Time Mixers (TTM): A Powerful Zero-Shot Forecasting Model by IBM"
link: "https://medium.com/towards-data-science/tiny-time-mixers-ttm-a-powerful-zero-shot-forecasting-model-by-ibm-576b0e0af583"
---


![이미지](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_0.png)

LLM(Large Language Models)에 대한 최신 연구를 따라가보면 주로 두 가지 주요 접근 방식을 볼 수 있어요:

첫째, 연구자들은 가능한 가장 큰 모델을 구축하는 데 주력합니다. 단어 예측을 통한 사전 학습은 성능 향상에 중요한 역할을 합니다(그리고 수백만 달러가 소비되는 곳이기도 합니다!).

둘째, 연구자들은 양자화와 같은 기술을 사용하여 작고 빠른 모델을 만들어냅니다 — 강력한 일반적인 성능을 유지하면서요.

<div class="content-ad"></div>

그러나 일부 작업에서 더 작은 모델이 훨씬 큰 모델보다 더 나은 성과를 내는 흥미로운 일이 발생합니다. 예를 들어, Llama 3-8B는 MMLU 작업에서 더 큰 Llama 2-70B보다 우수한 성과를 냈습니다!

IBM에서 소개한 Tiny Time Mixers (TTM)[1]은 두 번째 접근 방식을 따릅니다. 더 큰 SOTA 모델 — MOIRAI를 포함하여 —을 능가하는 가벼운 모델로, M4 데이터셋에서 우수한 성과를 거둡니다. 게다가, 이는 오픈 소스입니다!

이 기사에서는 다음을 논의합니다:

- TTM의 아키텍처 및 기능.
- TTM을 특별하게 만드는 혁신적인 기능.
- 다른 모델과의 벤치마킹 결과를 비교한 결과.

<div class="content-ad"></div>

시작해요!

# Enter Tiny Time Mixer (TTM)

TTM의 주요 특징은 다음과 같습니다:

- Non-Transformer Architecture: TTM은 Attention 메커니즘을 사용하지 않기 때문에 매우 빠릅니다. 완전 연결된 NN 계층만 사용합니다.
- TSMixer Foundation: TTM은 아키텍처에서 TSMixer[2] (IBM의 혁신적인 시계열 모델)을 활용합니다.
- 다양한 입력: 다변량 예측이 가능한 TTM은 추가 채널, 외부 변수 및 알려진 미래 입력을 수용하여 예측 다양성을 향상시킵니다.
- 빠르고 강력함: TTM은 Monash 데이터 세트의 244백만개 샘플로 사전 훈련되었으며, 6대의 A100 GPU를 사용하여 8시간 이내에 훈련되었습니다.
- 우수한 제로샷 예측: TTM은 사전 훈련되어 있으며, 미처 본 적 없는 데이터에 대한 우수한 제로샷 예측을 수행하여 큰 SOTA 모델을 능가합니다.

<div class="content-ad"></div>

중요한 사항:

# TTM 혁신

TTM은 여러 혁신적인 기능을 소개합니다:

- 다중 수준 모델링: TTM은 먼저 채널 독립적 방식(일변량 시퀀스)으로 사전 훈련을 받은 후, 세밀 조정 중에 여러 변수 종속성을 학습하기 위해 교차 채널 혼합을 사용합니다.
- 적응형 패치 적용: 단일 패치 길이 대신 TTM은 서로 다른 레이어 간에 여러 패치 길이를 학습합니다. 각 시계열이 특정 패치 길이에서 최적으로 작동하기 때문에 적응형 패치는 모델이 다양한 데이터에 대해 더 잘 일반화되도록 도와줍니다.
- 해상도 접두사 튜닝: 다른 주파수(예: 주간, 일별 데이터)는 전통적인 시계열 모델에 어려운 부분입니다. TTM은 시계열 주파수를 인코딩하기 위한 추가 임베딩 레이어를 사용하여 모델이 신호의 주파수에 따라 정확하게 예측을 조건부로 설정할 수 있도록 합니다.

<div class="content-ad"></div>

# Tiny Time Mixers — 아키텍처

TSMixer은 TTM의 전신입니다. TSMixer는 견고한 모델이지만, 기본 모델로 사용하거나 외부 변수를 처리하는 데 사용할 수는 없습니다.

TTM은 TSMixer를 구성 요소로 사용하여 새로운 기능을 도입함으로써, 저자들이 보지 못한 데이터에 대해 일반화된 비-트랜스포머 모델을 만들었습니다.

TTM의 아키텍처는 그림 1에 나와 있습니다. 우리는 두 단계, 사전 훈련(왼쪽)과 파인튜닝(오른쪽)에 대해 설명할 것입니다:

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_1.png)

**의미론적 지식**: sl=context_size, fl=forecasting_length, c = 입력 기능의 채널 수, c’= 예측 채널의 수.

## 사전 훈련

- 사전 훈련 중에는 모델이 단변량 시계열로만 학습됩니다.
- 먼저 개별 시계열을 정규화합니다. 마지막 출력은 역정규화됩니다 (표준적인 방법).
- 패칭은 시계열에서 널리 성공한 기술이며 여기서도 사용됩니다. 단변량 시퀀스를 크기가 pl인 n 패치로 나눕니다.
- TTM 백본 모듈은 적응형 패칭을 적용하고 패치를 크기 p에서 hf로 사상합니다. TTM 백본은 TTM의 핵심이며 나중에 자세히 설명하겠습니다.
- TTM 디코더는 TTM 백본과 동일한 아키텍처를 갖고 있지만 훨씬 작아서 매개변수가 80% 적습니다.
- 예측 선형 헤드에는 1개의 완전 연결 계층이 있으며 최종 예측을 생성합니다 (그런 다음 역정규화됨).
- MSE 손실은 예측 기간 fl 동안 계산됩니다.

<div class="content-ad"></div>

## Feat-Tuning

- 여기서는 TTM 백본이 동결되어 있고 TTM 디코더 및 Forecast 선형 헤드의 가중치만 업데이트됩니다.
- 우리는 소수 데이터만으로 학습하는 후속 예측(few-shot forecasting) 또는 전체 데이터셋을 사용하는 후속 예측(full-shot forecasting)을 수행할 수 있습니다.
- Feat-Tuning 단계에서는 다변량 데이터셋을 사용할 수 있습니다. 이 경우 TTM 디코더에서 채널 혼합이 활성화됩니다.
- 선택적으로, 미래의 알려진 변수를 모델링하기 위해 외생 혼합 블록(그림 1에 나와 있음)을 활성화할 수도 있습니다.

# TTM 백본

TTM의 핵심 구성 요소는 TTM 백본입니다. 이는 Resolution Prefix Tuning과 Adaptive Patching을 가능하게 합니다.

<div class="content-ad"></div>

이 컴포넌트를 자세히 살펴보자면 그 기능을 이해할 수 있어요 (그림 2에 표시됨):

![이미지](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_2.png)

- 임베딩 레이어는 크기 pl에서 패치를 투영하여 크기 hf의 입력 임베딩을 만든답니다.
- Resolution Prefix Tuning 모듈은 시간-주파수/해상도를 나타내는 hf 크기의 임베딩을 만들고 이를 입력 임베딩에 연결합니다 (그림 2의 n=n+1 연산을 주목해주세요).
- TTM 블록은 3개의 하위 모듈을 포함합니다: 패치 분할 모듈, 베니라 TSMixer 블록 및 패치 병합 블록:
- 패치 분할 모듈은 패치 수를 K만큼 증가시키고 패치 길이를 다시 K만큼 감소시킵니다. 예를 들어, 첫 번째 수준에서 크기 [c,n, hf]의 입력은 [c, 4*n, hf//4]로 변화합니다.
- TSMixer 블록이 변환된 입력에 적용되며 패치 병합 블록이 [c, 4*n, hf//4] 입력을 다시 [c,n, hf]로 변형합니다.

# 외부 믹서

<div class="content-ad"></div>

미래의 알려진 변수가 있는 경우, Exogenous Mixer를 활성화할 수 있습니다. 이 모듈은 Figure 3에 표시되어 있으며, TTM 아키텍처에서의 위치는 Figure 1에 표시되어 있습니다:

![Exogenous Mixer](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_3.png)

Exogenous Mixer 블록은 간단합니다: 시계열의 미래 값(y3와 y4; Figure 3, 녹색)이 알려진 경우, 이를 사용하여 대상 변수(y1과 y2; Figure 4, 보라색)의 예측을 안내합니다.

# TTM 교육 세부 정보 및 데이터세트

<div class="content-ad"></div>

저자들은 다양한 문맥과 예측 길이에 대해 5가지 TTM 버전을 만들었습니다. 이는 (512,96), (512,192), (512, 336), (512,720), (96,24) 입니다.

교육에 관해서, 저자들은 모델 사전 훈련을 위해 Monash 데이터베이스의 하위 집합(244k 샘플)을 사용했고, 파인튜닝 성능을 평가하기 위해 Informer 데이터셋을 사용했습니다. 또한, 저자들은 외부 혼합기 블록의 효과를 평가하고 알려진 미래 변수를 추가함으로써 성능이 얼마나 향상되는지 조사하기 위해 다른 데이터셋을 사용했습니다.

이러한 데이터셋에 대해 더 자세한 내용은 원본 논문에서 확인할 수 있습니다. 아래는 (512,96) 변형을 위한 교육 하이퍼파라미터입니다:

- pl(패치 길이) = 64
- 백본 수준 수 = 6
- 각 수준 당 TTM 블록 수 = 2
- 배치 크기 = 3천
- 에폭 = 20

<div class="content-ad"></div>

학습 및 파인 튜닝 구성에 대한 자세한 내용은 원 논문을 참조해 주세요.

# 평가 벤치마크

TTM 대 최신 기법 모델

그 다음, 저자들은 Zero-shot 및 5% Few-shot 버전의 TTM을 다른 최신 기법 모델과 비교했습니다. 이때 사용된 평가 메트릭은 MSE였습니다. 결과는 다음과 같은 표 1에서 확인할 수 있습니다:

<div class="content-ad"></div>

아래는 너무 인상적입니다:

평균적으로, Few-shot TTM이 모든 다른 모델을 능가했습니다. 심지어 Zero-shot TTM이 일부 모델을 능가할 수 있었습니다! 기억하세요, Zero-shot TTM은 이러한 데이터에 대해 학습을 받지 않고 예측을 생성합니다.

또한 TTM은 작년에 소개된 새로운 기반 시계열 모델인 GPT4TS를 앞서 나갔습니다.

<div class="content-ad"></div>

TMT 이외에도 다음으로 높은 순위의 모델은 GPT4TS, PatchTST 및 TSMixer입니다. 모두 패치(patching)를 활용합니다. 최근 시계열 예측 연구에서 패치(patching)가 매우 유익한 기술임이 입증되었습니다.

TTM 대 foundation 모델

저자들은 TTM을 독립적으로 평가하며 특히 GPT4TS와 LLMTime과 비교합니다.
- LLMTime은 GPT-3과 LLaMa-2를 사용하여 시계열 예측을 위해 특정 수정을 가한 모델입니다.
- GPT4TS는 다양한 작업(예측, 분류 등)을 위해 범용 시계열 모델이며, 기본 모델로 GPT-2를 사용합니다.

<div class="content-ad"></div>

비교 결과는 표시됩니다. Table 2 (LLMTime)와 Table 3 (GPT4TS):

![LLMTime](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_5.png)

![GPT4TS](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_6.png)

LLMTime은 제로샷 예측 시나리오에서 평가되었고, GPT4TS는 퓨샷 예측기로 동작했습니다.

<div class="content-ad"></div>

- 두 가지 비교에서 TTM이 명확한 승자입니다.
- 게다가 TTM은 훨씬 빠르며 리소스를 상당히 적게 필요로 합니다. 이는 TTM이 GPT4TS와 같은 무거운 트랜스포머 계산을 사용하지 않기 때문에 예상된 결과입니다.

## 외생 변수의 효과성

현대 실제 세계 데이터셋은 가능한 경우 외생 변수를 사용하므로 예측 애플리케이션에서 이를 활용하는 것이 합리적입니다.

TTM의 저자들은 이와 같은 변수를 사용함으로써 TTM이 어떻게 향상되는지 조사했습니다 (해당하는 경우). 구체적으로 제로샷 TTM, 일반 TTM 및 외생 변수를 사용하는 채널 혼합 (TTM-CM)을 비교했습니다.

<div class="content-ad"></div>

그들은 TSMixer와 그 채널 혼합 변형을 평가했습니다. 결과는 다음과 같이 Table 4에 표시되어 있습니다:

![Table 4](/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_7.png)

다시 한 번, 결과는 매우 흥미로워요: 먼저, TTM-CM이 1위를 차지하여 외생 변수가 모델에 도움이 되는 것을 의미합니다.

채널 혼합 속성을 사용하는 TSMixer 변형은 2위를 차지했습니다. 또한, 제로-샷 TTM이 최악의 성능을 보입니다. 보조 변수가 있는 경우 모델 성능을 향상시키는 데 사용되어야 함이 명백합니다.

<div class="content-ad"></div>

# Tiny Time Mixers 실무 활용

모델 버전 512-96과 1024-96의 가중치를 HuggingFace에서 다운로드하여 다음과 같이 세밀 조정할 수 있습니다:

```js
!git clone https://github.com/IBM/tsfm.git
!pip install transformers
!pip install datasets

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from tsfm_public.models.tinytimemixer.utils import (
    count_parameters,
    plot_preds,
)

from tsfm_public.models.tinytimemixer import TinyTimeMixerForPrediction
from tsfm_public.toolkit.callbacks import TrackingCallback

zeroshot_model = TinyTimeMixerForPrediction.from_pretrained("ibm/TTM", revision='main')
finetune_forecast_model = TinyTimeMixerForPrediction.from_pretrained("ibm/TTM", revision='main', head_dropout=0.0,dropout=0.0,loss="mse")
```

따라서 transformers 라이브러리의 익숙한 Trainer 모듈을 사용하여 TTM을 세밀 조정할 수 있습니다:

<div class="content-ad"></div>

```js
finetune_forecast_trainer = Trainer(
model=finetune_forecast_model,
args=finetune_forecast_args,
train_dataset=train_dataset,
eval_dataset=valid_dataset,
callbacks=[early_stopping_callback, tracking_callback],
optimizers=(optimizer, scheduler))

# Fine tune
finetune_forecast_trainer.train()
```

<img src="/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_8.png" />

predictions_test = finetune_forecast_trainer.predict(test_dataset)

이후에는 사적 데이터셋을 통해 예측을 받은 후 결과를 플롯합니다:

<div class="content-ad"></div>

아래는 테이블 태그를 마크다운 형식으로 변경하도록 했습니다.


<img src="/assets/img/2024-06-19-TinyTimeMixersTTMAPowerfulZero-ShotForecastingModelbyIBM_9.png" />

# 마무리 말씀

Tiny Time Mixer (TTM)은 다른 접근 방식을 따른 혁신적인 모델로서, 더 작지만 효율적인 모델들을 위한 길을 열어두었습니다.

특히, TTM은 어텐션을 사용하지 않았고 여전히 강력한 시계열(Time Series) 기반 모델을 구축할 수 있다는 것을 입증했습니다.


<div class="content-ad"></div>

최초로 MLP만 사용한 메타러닝 기능을 갖춘 시계열 모델은 N-BEATS와 N-HITS였어요. 이 트렌드가 어떻게 이어지는지 한번 살펴봐요.

최근에는 NLP 모델에서도 이러한 트렌드를 관측하고 있어요. 우리는 Mamba(State Space) xLSTM(기반 RNN)과 Hyena(CNN 기반)을 보았는데, 이들은 언어 모델이지만 트랜스포머는 아니며 다양한 벤치마크에서 인상적인 결과를 얻고 있어요.

시계열 모델에 대한 이런 접근 방식이 어떻게 전개될지도 한번 살펴봅시다. 결국, 시계열에 대한 기초 모델 연구는 아직 새로운 상황이에요!

# 읽어주셔서 감사합니다!

<div class="content-ad"></div>

- 제 LinkedIn 팔로우해 주세요!
- 제 뉴스레터, AI Horizon Forecast를 구독해 주세요!

## 참고 자료

[1] Ekambaram 등, Tiny Time Mixers (TTMs): Fast Pre-trained Models for Enhanced Zero/Few-Shot Forecasting of Multivariate Time Series (2024년 4월)

[2] Ekambaram 등, TSMixer: Lightweight MLP-Mixer Model for Multivariate Time Series Forecasting (2023년 6월)