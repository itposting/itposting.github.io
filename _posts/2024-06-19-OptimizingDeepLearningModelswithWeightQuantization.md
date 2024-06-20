---
title: "딥 러닝 모델 최적화를 위한 가중치 양자화"
description: ""
coverImage: "/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_0.png"
date: 2024-06-19 06:40
ogImage: 
  url: /assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_0.png
tag: Tech
originalTitle: "Optimizing Deep Learning Models with Weight Quantization"
link: "https://medium.com/towards-data-science/optimizing-deep-learning-models-with-weight-quantization-c786ffc6d6c1"
---


![Image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_0.png)

# 📚딥러닝에서 양자화란?

딥러닝에서 양자화에 대해 이야기해보겠습니다. 딥러닝에서 양자화가 왜 중요한지 궁금했던 적이 있나요? 딥러닝과 대규모 언어 모델(LLMs)이 아주 강력하다고는 하지만 많은 도전 과제를 가지고 있어요. 이러한 모델들이 크기 때문에, 많은 계산 성능과 메모리가 필요하여 자원이 제한된 곳에서 사용하기 어려워집니다. 게다가, 예측을 할 때 많은 에너지를 소비할 수 있어서, 한정된 컴퓨팅 자원으로 추론을 하는 것이 불가능해질 수도 있어요.

양자화는 이러한 문제를 해결하기 위해 모델의 크기를 줄여 더 쉽게 다루고, 거의 동일한 성능을 유지할 수 있도록 돕습니다. 이 과정은 모델의 매개변수 수와 데이터 유형의 정밀도를 수정하는 것을 포함합니다. 이를 통해 모델은 가볍고 빠르게 되어, 더 많은 곳에서 실행되고 더 적은 에너지를 사용할 수 있게 됩니다.

<div class="content-ad"></div>

모델의 크기는 매개변수(크기)의 수를 값들의 정밀도(데이터 형식)로 곱해서 계산됩니다.

![image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_1.png)

그래서 모델의 크기를 효율적으로 줄이는 방법에 대한 중요한 질문은 무엇일까요? 음, 이를 위한 몇 가지 방법이 있습니다. 매개변수의 수를 줄이거나 데이터 형식을 낮추는 것이 가능합니다. 그러나 매개변수의 수를 줄이는 것은 모델을 더 작고 단순하게 만드는 것을 의미하며, 이는 모델의 품질에 상당한 영향을 줄 수 있어 매우 tricky할 수 있습니다. 더 나은 옵션은 데이터 형식의 정밀도를 조절하는 것입니다. 이것이 양자화가 등장하는 이유입니다 - 이를 통해 모델 가중치를 낮은 정밀도 형식으로 저장할 수 있습니다. 이 방법은 모델의 효과를 유지하면서 가볍고 빠르게 만들어줍니다.

아래는 양자화가 딥러닝에서 중요한 이유인 몇 가지 주요 이유입니다.

<div class="content-ad"></div>

- 효율성: 양자화는 모델 내의 숫자 값의 정밀도를 부동 소수점에서 정수로 줄입니다. 이겈 간단해 보이지만, 계산을 훨씬 쉽고 빠르게 만들어주어 일을 빨리 처리할 수 있게 해줍니다!
- 메모리 절약: 부동 소수점에서 정수로 변환할 때 비트 수를 줄이면, 모델 크기를 크게 축소할 수 있습니다. 이것은 저장 공간과 메모리가 제한된 스마트폰이나 임베디드 시스템과 같은 기기에 모델을 배포할 때 아주 유용합니다.
- 에너지 소비: 모델 크기가 작아지면 모델을 실행하는 데 더 적은 계산 능력이 필요합니다. 이는 특히 배터리로 작동하는 기기에 모델을 배포할 때 유용합니다.
- 모델 배포: 모델이 작고 더 빠르게 실행될 때, 전용 대규모 서버 대신 다양한 장소에서 모델을 사용하기 쉬워집니다. 이는 자율 주행 자동차나 실시간 번역 서비스와 같이 빠른 응답이 필요한 작업에 중요합니다.

## 양자화 종류

딥러닝에서 양자화는 일반적으로 세 가지 주요 유형으로 구분됩니다:

- 사후 학습 정적 양자화 (PTQ): PTQ는 이미 훈련된 모델을 추가로 훈련하지 않고(가중치 및 활성화 모두) 줄이는 작업을 수행합니다. 사용하기 매우 간단하고, 훈련을 마친 후 모델을 빠르게 작게 만들어주는 데 도움이 됩니다. 단지 기억해 두세요! 훈련 중에 모델을 양자화하지 않기 때문에 원본 모델과 성능에 차이가 있을 수 있습니다.

<div class="content-ad"></div>

![그림](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_2.png)

- 집행 후 다이나믹 양자화 또는 다이나믹 양자화: 이 방법은 훈련이 완료된 후에 모델 가중치를 줄이고, 활성화를 동적으로 처리합니다(추론 중에). 이 방법은 다른 유형과 크기의 입력을 다루는 모델에 아주 편리합니다. 그러나 모델이 실행되는 동안 활성화를 실시간으로 조정하기 때문에 정적 양자화보다 약간 느릴 수 있습니다. 또한, 이 방법의 또 다른 단점은 모든 장치가 이 동적 접근을 처리할 수 없다는 점이므로 어디에 이 방법을 사용할지 계획할 때 고려해야 합니다.

![그림](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_3.png)

- 양자화 인식 훈련(QAT): 마지막 공통 방법은 QAT입니다. 이는 양자화를 직접 훈련 과정에 통합하여 모델 성능을 유지합니다. 이것은 모델 최적화 중 양자화 효과를 고려함으로써 위 두 가지 방법보다 성능을 더 잘 보존할 수 있습니다. 결과적으로, QAT는 조금 더 많은 시간과 에너지를 요구합니다. 학습 작업 및 양자화를 동시에 조정하기 때문에 더 오래 훈련에 걸리고 구현하기는 훨씬 복잡합니다. 정확도가 필요한 경우, QAT는 모델을 효과적이고 효율적으로 유지하는 데 큰 차이를 만들 수 있습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_4.png)

# 📖 부동 소수점 숫자 구성

데이터 형식을 변경하면 모델 크기를 줄이는 이유에 대해 자세히 살펴보겠습니다. 컴퓨터에서 숫자에 대해 이야기할 때, 0과 1에 대해 모두 이야기합니다. 이진 인코딩 시스템은 컴퓨터 작업의 기초이며, 정수 및 부동 소수점 숫자와 같은 다양한 숫자 표현은 이러한 비트를 구성하는 특정 방법을 갖고 있습니다.

## 정수 표현


<div class="content-ad"></div>

정수에 대한 가장 일반적인 형식은 부호 있는 정수와 부호 없는 정수입니다.

부호 없는 정수:

* 비트: 모든 비트가 숫자의 크기를 나타냅니다.
* 범위: 0부터 2n-1까지 (여기서 n은 비트의 수)입니다.

부호 있는 정수:

<div class="content-ad"></div>

- 첫 번째 비트는 숫자가 양수 (0)인지 음수 (1)인지를 나타냅니다.
- 나머지 비트는 숫자의 크기 또는 이른바 크기를 보여줍니다. 여기서 이진값은 음수 숫자에 대해 반전되고 1이 더해집니다.
- 범위: -2ⁿ⁻¹ ~ 2ⁿ⁻¹-1

## 부동 소수점 표현

- 부호 비트 (1 비트): 숫자의 부호를 나타냅니다; 0은 양수이고 1은 음수입니다.
- 지수: 바이어스로 조정된 지수를 나타냅니다. 저장된 지수에서 바이어스를 빼면 실제 지수가 계산됩니다. 지수는 사실적으로 숫자의 중요한(또는 가수) 부분을 2의 거듭제곱으로 확장하여 부동 소수점 숫자가 매우 크거나 매우 작은 값을 간결한 형식으로 표현할 수 있도록 합니다.

![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_5.png)

<div class="content-ad"></div>

- 유의적/맨티사: 숫자의 정밀도를 나타냅니다.

![image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_6.png)

## 다른 데이터 유형의 생성

Float32: 숫자를 나타내는 데 32비트를 사용합니다.

<div class="content-ad"></div>

- 부호에는 1 비트가 사용됩니다
- 지수에는 8 비트가 사용됩니다
- 나머지 23 비트는 유효숫자를 나타냅니다
- FP32는 높은 정밀도를 제공하지만, 계산 및 메모리 사용량이 많은 것이 단점입니다.

이미지 링크:
![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_7.png)

Float16: 숫자를 저장하는 데 16 비트를 사용합니다

- 부호에는 1이 사용됩니다
- 지수에는 5가 사용됩니다
- 유효숫자에 10이 사용됩니다
- 이로 인해 더 효율적인 메모리 사용 및 빠른 연산이 가능하지만, 범위 및 정밀도가 줄어들어 숫자의 불안정성을 초래할 수 있고, 이는 모델 정확도에 영향을 줄 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_8.png" />

"float"이 종종 "전체 정밀도"(4 바이트)로 불리는 반면, "float16"은 "반 정밀도"(2 바이트)로 불립니다.

## 일반적인 하위 정밀도 데이터 유형

양자화를 수행하는 두 가지 일반적인 방법이 있습니다:

<div class="content-ad"></div>

- float32 -` float16
- float32 -` int8

## 양자화의 효과

대규모 모델인 BLOOM과 같은 경우, 약 1760억 개의 파라미터를 갖고 있는 모델을 다룬다고 상상해봅시다. float32를 사용하면 모델 크기는 176*10**9 x 4 바이트 = 704GB가 됩니다. 그러나 float16로 전환하면 352GB로 줄어들고, int8로 전환하면 176GB로 줄어듭니다. 이는 메모리 공간에서 굉장한 절감을 의미합니다. 176GB라도 여전히 많은 개인 컴퓨터에 대한 큰 도전이 될 수 있습니다.

float32에서 float16으로 양자화

<div class="content-ad"></div>

float32에서 float16로 변경하는 것은 꽤 간단합니다. 왜냐하면 두 형식 모두 숫자를 표현하는 방식이 비슷하기 때문이죠. 그러나 양자화를 구현하기 전에 몇 가지 고려해야 할 사항이 있습니다:

- 소프트웨어 및 하드웨어 호환성: 먼저, 사용 중인 패키지가 float16을 처리할 수 있는지 확인해보세요. 또한, 하드웨어가 지원하는지도 확인해야 합니다. NVIDIA의 튜링 및 암페어 또는 구글의 TPU와 같은 현대 GPU 및 TPU는 float16과 잘 작동하도록 제작되었기 때문에 학습 및 추론 프로세스가 속도가 향상됩니다. 그러나 Intel CPU는 저장 유형으로 float16을 지원하고 있지만, 연산은 float32로 변환한 후에 수행됩니다.
- 정밀도 요구 사항: 모델이 얼마나 정밀해야 하는지를 고려해보세요. 다른 말로, 낮은 정밀도에 얼마나 민감한지 생각해보세요. 일부 의료 영상 처리와 같이 모든 작은 세부 사항이 중요한 작업/모델의 경우, float16과 같은 낮은 정밀도로 내려가면 중요한 세부 사항이 손실되어 모델의 성능에 영향을 줄 수 있습니다.

float32에서 int8로의 양자화

float32에서 int8로의 양자화는 더 어렵습니다. 왜냐하면 int8은 256가지만 다룰 수 있고, 이는 float32가 다루는 광대한 범위와는 비교할 수 없이 작습니다. float32는 약 -3.4e38 ~ 3.4e38 범위에서 약 40억 개의 숫자를 처리합니다. 이 과제는 float32 값의 특정 범위를 int8의 매우 제한된 공간에 어떻게 압축할지 찾는 것입니다.

<div class="content-ad"></div>

계속해서 진행하고, 우리가 int8로 효과적으로 양자화하는 방법에 대해 자세히 살펴볼 거예요.

# int8로 양자화하는 방법

## 균일 양자화

이 방법은 입력을 출력으로 매핑하는 간단한 선형 함수를 사용합니다. 선에 놓인 간격이 동일한 점들을 상상해보세요 — 균일 양자화는 이들이 변환될 때 모두 잘 정렬되어 있도록 유지합니다. 빠르고 쉽지만, 여기 주목할 점이 있어요: 데이터가 처음부터 고르게 분포되어 있지 않다면, 데이터의 분포를 항상 잘 보존하지는 못할 수도 있어요.

<div class="content-ad"></div>

모든 부동 소수점 값을 두 숫자 α와 β 사이에 매핑하는 것이 균일 양자화의 작동 원리입니다. 이 두 값을 α와 β라고 부르겠습니다. 그리고 그 값을 [-2ᵇ⁻¹, 2ᵇ⁻¹–1]의 일정 범위로 변환합니다. 이 범위를 벗어나는 값이 있다면 가장 가까운 한계값으로 잘립니다 — 이것을 클리핑이라고 합니다.

부동 소수점 숫자(xf)를 8비트 표현(xq)으로 변환할 때에는 스케일 팩터(S)를 사용합니다. 이는 원본 데이터를 int8의 새로운 형식 [-128, 127]에 맞춰주는 데 도움을 줍니다. 그리고 원본 데이터의 0은 새 데이터의 0과 일치하게 됩니다. 이것이 대칭 양자화라고 부르는 개념입니다.

![image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_9.png)

## 양자화 스케일(S)를 계산하는 방법?

<div class="content-ad"></div>

아래는 Markdown 형식으로 바뀐 텍스트입니다:

Compute the max value of xf:

![image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_10.png)

Compute the quantization scale (S):

![image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_11.png)

<div class="content-ad"></div>

컨버팅 비티에이엘 테이블:


| 값       | 양자화된 값 |
|----------|------------|
|   3.14   |    3.0     |
|  -2.718  |   -2.5     |
|   6.626  |    6.5     |


오리지널 값으로 돌아가기:


| 양자화된 값 | 값       |
|------------|----------|
|    3.0     |   3.14   |
|   -2.5     |  -2.718  |
|    6.5     |   6.626  |


<div class="content-ad"></div>

대칭 양자화는 제로 주변을 균일하게 취급합니다. 즉, 데이터의 상승 및 하락(양수 및 음수 값)을 균형 있게 처리하여 모든 것이 균형을 이룹니다. 데이터가 제로 중심이거나 즉, 제로 양쪽으로 고르게 퍼져있을 때 특히 유용합니다.

하지만 여기서 중요한 점은 대칭 양자화가 제로 주변에 깔끔하게 정렬되지 않은 데이터에는 부적합할 수 있다는 것입니다. 데이터가 더 치우쳐져 있다면, 이 방법은 범위의 모든 부분을 동일하게 처리하기 때문에 더 많은 양자화 오류를 발생시킬 수 있습니다.

이 문제를 해결하기 위해, 비균일 또는 비대칭 양자화가 있습니다. 때로는 이를 아핀 양자화라고도 부릅니다. 이 기술은 데이터의 다른 부분에 대해 서로 다른 방식으로 스케일과 제로 포인트를 조정하기 때문에 대칭적으로 분포되지 않은 데이터 집합에 더 적합합니다.

간단한 예제로 이를 시도해 봅시다. 우리가 NumPy의 랜덤 정규 함수를 사용하여 가중치 배열을 만들었기 때문에 배열은 제로 중심입니다.

<div class="content-ad"></div>

```js
# 원본 가중치 배열
weights = np.random.normal(size=(20000)).astype(np.float32)
weights = torch.from_numpy(weights)
print(weights.mean(), weights.min(), weights.max())
>>> tensor(0.0057) tensor(-3.9224) tensor(4.4791)
```

![Image](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_14.png)

```js
# 대칭 방식을 사용하여 양자화
weights_sym_quant, weights_sym_dequant = symmetric_quantize(weights)
print(weights_sym_quant.double().mean(), weights_sym_quant.double().min(), weights_sym_quant.double().max())
print(weights_sym_dequant.double().mean(), weights_sym_dequant.double().min(), weights_sym_dequant.double().max())
>>> tensor(0.1585, dtype=torch.float64) tensor(-111., dtype=torch.float64) tensor(127., dtype=torch.float64)
>>> tensor(0.0056, dtype=torch.float64) tensor(-3.9148, dtype=torch.float64) tensor(4.4791, dtype=torch.float64)
```
그런 다음 대칭 양자화 함수를 적용하면, 새로 양자화된 배열도 거의 0에 가까운 평균값을 가지며, 최솟값은 -111이고 최댓값은 127입니다.

<div class="content-ad"></div>

이제, 우리는 데이터를 원래의 부동 소수점 범위로 되돌리는 시도를 할 것입니다. 이것이 바로 양자화 해제(dequantization)라고 불리는 과정입니다. 양자화를 해제한 후에는, 양자화 해제된 배열의 평균, 최소값 및 최대값이 대략 원래 값과 동일해야 합니다.

## 비균일 양자화

비대칭 양자화의 경우, 양자화 값을 계산할 때 정수가 추가됩니다. 이것을 제로 포인트 (Z)라고 합니다. Z는 float32 영역에서 0의 값과 대응합니다.

양자화된 값 계산:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_15.png)

스케일(S) 값을 계산하세요:

![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_16.png)

제로포인트(Z) 값을 계산하세요:


<div class="content-ad"></div>

![Optimizing Deep Learning Model with Weight Quantization](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_17.png)

비대칭 양자화는 범위의 다른 부분에 대해 스케일과 제로 포인트를 다르게 조정하여 비대칭 데이터 분포를 효과적으로 처리할 수 있습니다. 그러나 스케일과 제로 포인트 2개의 매개변수가 필요하기 때문에 구현 및 최적화 과정이 복잡해질 수 있고, 양자화 및 역양자화 단계에서 추가적인 계산 능력이 필요할 수 있습니다.

비대칭 양자화는 데이터 분포를 조정함으로써 데이터 범위 내에서 스케일과 제로 포인트를 다르게 조정하여 불규칙한 데이터 분포를 훌륭히 처리할 수 있습니다. 데이터가 양자화 다리를 건널 때 더 편안하게 걷도록 데이터의 신발을 맞춤 제작하는 것과 같은 원리입니다!

하지만 여기서 중요한 점은 두 가지 매개변수 - 스케일과 제로 포인트 - 를 사용자 정의하기 때문에 설정 및 세밀한 조정이 약간 까다로울 수 있습니다. 게다가, 양자화 및 역양자화 시에 조금 더 많은 계산 노력이 필요할 수 있습니다.

<div class="content-ad"></div>


# 비대칭 방식을 사용하여 양자화하기 - 정규 분포 데이터
weights_assym_quant, weights_assym_dequant = assymmetric_quantize(weights)
print(weights_assym_quant.double().mean(), weights_assym_quant.double().min(), weights_assym_quant.double().max())
>>> tensor(-8.8287, dtype=torch.float64) tensor(-128., dtype=torch.float64) tensor(127., dtype=torch.float64)
>>> tensor(0.0056, dtype=torch.float64) tensor(-3.9207, dtype=torch.float64) tensor(4.4808, dtype=torch.float64)


![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_18.png)

정규 분포 배열 예제를 살펴보았지만, 이것은 간단한 경우입니다. 좀 더 어려운 비정규 분포를 가진 경우를 시도해 보겠습니다.

```python
# 비정규 분포 데이터 생성
skewed_weights = np.random.exponential(scale=2, size=20000) - 7 # 데이터를 음수 값과 양수 값을 모두 가지도록 이동
skewed_weights = torch.from_numpy(skewed_weights)
print(skewed_weights.mean(), skewed_weights.min(), skewed_weights.max())
>>> tensor(-5.0192, dtype=torch.float64) tensor(-6.9999, dtype=torch.float64) tensor(16.4827, dtype=torch.float64)
```


<div class="content-ad"></div>

```js
# 대칭 방식을 사용하여 양자화
weights_sym_quant, weights_sym_dequant = symmetric_quantize(skewed_weights)
print(weights_sym_quant.double().mean(), weights_sym_quant.double().min(), weights_sym_quant.double().max())
>>> tensor(-38.6737, dtype=torch.float64) tensor(-54., dtype=torch.float64) tensor(127., dtype=torch.float64)
```

이 분포는 정규분포가 아니기 때문에 양자화된 가중치의 평균 값은 -38.67, 최솟값은 -54이며 최대값은 127입니다. 문제는 전체 int8의 범위가 완전히 활용되지 않는다는 것입니다. 최솟값이 -64인데 이는 양자화가 사용 가능한 비트를 최대로 활용하지 못한다는 것을 의미합니다. 이로 인해 많은 서로 다른 값을 동일한 양자화된 값으로 반올림하여 고유성과 데이터 내의 세부 정보를 상실할 수 있습니다.

가중치를 다시 부동소수점으로 역양자화할 때, 평균값은 대략적으로 원래 가중치의 값에 도달합니다.

<div class="content-ad"></div>

```js
# 비대칭 방법을 사용하여 양자화 - 정상 분포 데이터
weights_assym_quant, weights_assym_dequant = assymmetric_quantize(skewed_weights)
print(weights_assym_quant.double().mean(), weights_assym_quant.double().min(), weights_assym_quant.double().max())
>>> tensor(-106.5096, dtype=torch.float64) tensor(-128., dtype=torch.float64) tensor(127., dtype=torch.float64)
```

![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_20.png)

양자화된 값들을 원래의 부동 소수점 범위로 돌리면 어떻게 되는지 알아보겠습니다. 대칭 방법에서의 값들은 원래 데이터와 비교했을 때 그렇게 고른 분포를 보여주지 않는데, 비대칭 방법의 경우와는 다르게 퍼져 있는 것이 흥미롭습니다.

![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_21.png)


<div class="content-ad"></div>

# 📝 코드 구현

파이토치 양자화를 사용하여 양자화 예제를 작업해 보겠습니다.

이 예제에서는 MobileNetV2 모델과 MINIST 데이터셋을 사용할 것입니다. 데이터셋에 대한 자세한 내용은 여기에서, 그리고 데이터셋을 로드하는 방법은 여기에서 확인할 수 있습니다.

MobileNetV2를 양자화하려면 네트워크에 일부 수정을 구현해야 합니다.

<div class="content-ad"></div>

- In InvertedResidual 블록의 torch.add가 nn.quantized.FloatFunctional()로 대체되었습니다.

```js
- self.skip_add = torch.add()
+ self.skip_add = nn.quantized.FloatFunctional()
```

- 양자화 전에 Conv+BN 및 Conv+BN+Relu 모듈을 결합하는 fuse_model() 메서드가 추가되어 메모리 액세스를 줄이고 수치 정확도를 향상시켜 모델의 효율성을 높입니다. 이 실천은 양자화된 모델에서 일반적입니다.

```js
class MobileNetV2(nn.Module):
    def __init__(self, num_classes=10, width_mult=1.0, inverted_residual_setting=None, round_nearest=8):
+     self.quant = QuantStub()
+     self.dequant = DeQuantStub()
```

<div class="content-ad"></div>

PyTorch 프레임워크를 사용하여 모델을 양자화하는 일반적인 흐름은 다음과 같습니다:

```python
# 양자화하기 전에 Conv+BN 및 Conv+BN+Relu 모듈을 퓨즈합니다 (이 작업은 숫자를 변경하지 않습니다)
def fuse_model(self, is_qat=False):
    fuse_modules = torch.ao.quantization.fuse_modules_qat if is_qat else torch.ao.quantization.fuse_modules
    for m in self.modules():
        if type(m) == ConvBNReLU:
            fuse_modules(m, ['0', '1', '2'], inplace=True)
        if type(m) == InvertedResidual:
            for idx in range(len(m.conv)):
                if type(m.conv[idx]) == nn.Conv2d:
                    fuse_modules(m.conv, [str(idx), str(idx + 1)], inplace=True)
```

![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_22.png)

- QConfig를 사용하여 연산자가 어떻게 관찰되어야 하는지 구성합니다. 이 코드에서는 단순한 최소/최대 관찰자를 사용하여 양자화 매개변수를 결정합니다.

<div class="content-ad"></div>

```js
quantized_model.qconfig = torch.ao.quantization.default_qconfig
```

2. 준비하기: 지정된 qconfig를 기반으로 Observer/FakeQuantize 모듈을 모델에 삽입합니다.

```js
torch.ao.quantization.prepare(quantized_model, inplace=True)
```

3. 모델을 캘리브레이션하여 가중치와 활성화에 대한 양자화 매개변수를 결정합니다. 이는 훈련 데이터셋으로 수행됩니다.

<div class="content-ad"></div>


evaluate(quantized_model, criterion, data_loader, neval_batches=num_calibration_batches)


4. Convert the calibrated model to a quantized model.


torch.ao.quantization.convert(quantized_model, inplace=True)


We will load the pretrained model for the MNIST dataset as the original model, quantize this model, and compare the results in both size and performance. Performance is evaluated using Top 1 and Top 5 Accuracy.


<div class="content-ad"></div>

## 👑결과👑

![결과 이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_23.png)

모델 크기가 8.9MB에서 2.35MB로 줄어든 건 정말 놀라운 일이에요! 거의 4배나 크기가 줄었어요! 🌟

성능도 매우 좋아서, 양자화된 모델의 최상위 1위와 최상위 5위 정확도는 원본과 비슷합니다. 최대/최소 옵서버만 사용해서 양자화 매개변수를 선택한 것에도 불구하고요. 그래서 거의 공간을 차지하지 않으면서도 약속받는 결과를 확인할 수 있어요!

<div class="content-ad"></div>

다른 옵저버의 결과를 확인해보면, 이 옵저버와 비교하여 성능이 어떤지 알 수 있어요. 새 옵저버는 자동으로 양자화 매개변수를 결정할 거에요.

디폴트 qconfig를 사용하는 대신에, 구성을 x86 아키텍처로 설정할 거에요. 이 아키텍처는 가중치를 채널 단위로 양자화하고, 활성화도를 수집하고 최적의 양자화 매개변수를 선택하는 히스토그램을 사용해요. 나머지 흐름은 동일하게 유지돼요.

```js
per_channel_quantized_model.qconfig = torch.ao.quantization.get_default_qconfig('x86')
```

![이미지](/assets/img/2024-06-19-OptimizingDeepLearningModelswithWeightQuantization_24.png)

<div class="content-ad"></div>

새 양자화 아키텍처로 얻는 결과는 Top 1 및 Top 5 성능 모두 강력한 출력을 유지한다는 것을 관찰할 수 있습니다. 그리고 가장 좋은 부분은 또 다른 양자화 방법과 모델 크기를 거의 동일하게 유지할 수 있다는 것입니다.

**Notebook**: [링크]

# 📕 최종 생각

마무리하며, 사후 훈련 동적 양자화는 머신러닝 모델을 배포하기 위해 최적화하는 편리하고 효율적인 요령입니다. 이 방법은 모든 훈련이 완료된 후 가중치와 활성화를 조정함으로써 원래의 부동 소수점 모델과 가끔 수용 가능한 성능을 보장하며 동등한 성능을 나타낼 수 있습니다. AI 프로젝트를 빠르고 가벼워 만들고 싶다면, 이 방법이 진정한 게임 체인저가 될 수 있을 것입니다!

<div class="content-ad"></div>

# 참고 자료

- [Achieving FP32 Accuracy for INT8 Inference Using Quantization Aware Training with TensorRT](https://developer.nvidia.com/blog/achieving-fp32-accuracy-for-int8-inference-using-quantization-aware-training-with-tensorrt/)
  
- [PyTorch 공식 문서 - 양자화](https://pytorch.org/docs/stable/quantization.html)
  
- MNIST 상업적 이용을 위한 라이선스: GNU General Public License v3.0. 링크: [MNIST 라이선스](#)