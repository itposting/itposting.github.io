---
title: "시그모이드 신경망을 이용한 다항식 제조  일반화 관점에서의 새로운 접근"
description: ""
coverImage: "/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_0.png"
date: 2024-06-23 18:48
ogImage: 
  url: /assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_0.png
tag: Tech
originalTitle: "Manufacturing polynomials using a sigmoid neural network — a new look from a ‘generalization’ perspective"
link: "https://medium.com/@snaveenmathew/manufacturing-polynomials-using-a-sigmoid-neural-network-a-new-look-from-a-generalization-68a1b42e4be7"
---


면허가 있는 거래처 선정이 기존에서 5년 이상된 기사에 대한 후속 내용입니다:

- 시그모이드 신경망을 사용한 다항식 제조
- 시그모이드 신경망을 사용한 다항식 제조 - 실습

이 실습은 신경망의 인내 성능을 다루었습니다. 간단한 기저(알려진) 모델에 대해: y = 1 + 2*x + 3*x². 실습을 마치며, 1계층 출력 간의 높은 상관 관계가 수렴을 늦추고, 제약이 없는 모델이 훨씬 더 좋은 샘내내 성능을 보였다는 결론을 내렸습니다. 추가로 다항회귀 분석도 제약이 없는 모델의 샘내내 정확성(진정한 모델 기반)을 입증했습니다. 신경망의 스플라인 이론 관점에서 이 모든 것이 직관적으로 맞는 것이며, 두 모델 모두 유용합니다. 그러나 모델의 범위 외 성능을 놓치고 있었음을 인정하지 못했습니다. 스플라인 이론적 관점에서 이는 큰 누락이었습니다.

이 기사는 범위 외 성능, 진정한 모델과 일치 정도, 및 '일반화'에 대한 일부 상위 추론에 초점을 맞추겠습니다. '일반화'는 다음을 기반으로 평가됩니다:

<div class="content-ad"></div>

- 다양한 유형의 테스트 데이터 포인트(전체, 훈련 데이터 내 범위, 훈련 데이터 외 범위)별 총 오차(MSE)
- 전체 모델의 적합성(확장된 테스트 데이터 세트에서 실제 모델과의 유사성) 

## 테스트 데이터의 범위 외 부분 생성

훈련 데이터 세트의 x1은 표준 정규 분포에서 무작위 샘플링하여 생성되었습니다. x1을 3배로 곱하여 범위를 확장한 테스트 데이터 세트가 생성되었습니다. 이로 인해 원래 훈련 세트의 범위 내에 속하는 데이터 포인트가 총 7990개, 원래 훈련 세트의 범위 외에 속하는 데이터 포인트가 2010개 생성되었습니다.

## 모델들

<div class="content-ad"></div>

모델 구조는 실습과 동일합니다

![image](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_0.png)

# 학습 및 평가

모델은 실습에서 사용된 학습 예제를 사용하여 훈련되었습니다. 따라서 모델의 가중치는 변경되지 않았습니다. 그러나 제한된 및 제한되지 않은 모델의 기저 (다항식) 표현은 새로운 테스트 데이터 집합 범위 내에서 변할 수 있습니다. 또한, 모델의 범위를 벗어난 성능은 범위 내 성능에서 예측하기 어려울 수 있습니다(두 모델 모두 학습 데이터 범위 내에서 매우 좋은 적합도를 나타냄, MSE ` 0.045).

<div class="content-ad"></div>

## 에폭별 모델 추적

![이미지](https://miro.medium.com/v2/resize:fit:1280/1*jygr4njGNjkNL3enCQNVyg.gif)

![이미지](https://miro.medium.com/v2/resize:fit:1280/1*hUfYQ21PQZkbE40NcVwuPA.gif)

두 그래프에 대한 키: 파란 선 - 실제 값, 파란 점 - 훈련 범위 내에서 확장 테스트 예제에 대한 모델 예측, 빨간 점 - 훈련 범위를 벗어난 확장 테스트 예제에 대한 모델 예측.

<div class="content-ad"></div>

(bias) 무제한 모델이 (bias) 제한 모델보다 최종 솔루션으로 수렴하는 속도가 훨씬 빠르다는 사실은 명백하다. 그러나 모델의 가중치는 크게(직역하지 않는 용어, 통계 용어 아님) 다르다. 특히, 제한 모델 가중치가 무제한 모델의 가중치보다 거의 1차 크다는 점은 매우 명백하다. 이것은 중요한 관찰이다. 왜냐하면 편향이 없는 모델은 편향 제한 모델로 수렴할 수 있는 기회가 있었지만, 대신 샘플 내 솔루션으로 더 나은 수렴했기 때문이다.

# 모델 (메타) 분석 - 범위 내 및 범위 외

- 랜덤 초기화로 인해 교육 MSE는 약 28에서 출발하여 두 모델 모두 `0.045로 점진적으로 감소한다.
- 제한 모델은 활성화된 레이어 1 출력이 교육 중에 높은 상관 관계가 있기 때문에 그레이디언트가 노이즈를 일으키는 것으로 추정되므로 훨씬 느리게 수렴한다. (코드에서 실험적으로 유효성이 검증되어야 함)
- 질적으로 제한된 최종 모델은 범위 밖에서(범위 외 MSE=1699.82) 무제한 최종 모델(범위 외 MSE=2905.67)보다 훨씬 더 우수한 성능을 발휘한다. 이 향상된 외부 범위 성능은 범위 내 성능에 큰 하락이 오지 않고 (제한 모델의 범위 내 MSE=1.38 대 무제한 모델의 범위 내 MSE=0.41) 테스트 데이터에 대한 총 성능(MSE=342.77 대 무제한 모델의 MSE=584.37)에서도 비슷하게 유지된다. 이 간접는 근려에 편향 제약이 실무에서 가치를 더하는 것으로 보이지 않았기에 저에게는 매우 놀랍다.
- 새로운 테스트 데이터에 대한 모델 적합도도 제한 모델이 무제한 모델에 비해 훨씬 우수하다.

# 확장 테스트 데이터 세트에서 모델 적합 결과 (x1_extended = 2*x1 및 실제 모델 y_extended = 1 + 2*x1_extended + 3*x1_extended²)

<div class="content-ad"></div>

## 제약이 없는 모델

제약이 없는 모델 레이어 1: f1_u, f2_u = f_u(x)

![이미지1](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_1.png)

![이미지2](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_2.png)

<div class="content-ad"></div>

그래서, f1_u는 0.1094 - 0.0882*x + 0.0102*x² + 0.0002*x³입니다.

![그림1](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_3.png)

![그림2](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_4.png)

그래서, f2_u는 0.1031 + 0.0799*x + 0.0091*x² - 0.0003*x³입니다.

<div class="content-ad"></div>

Unconstrained model layer 2: y_pred_u = g_u(f1_u, f2_u); g_u is linear
y_pred_u ~ 7.16 + 2.66*x + 2.31*x² - 0.023*x³

## Constrained model

Constrained model layer 1: f1_c, f2_c = f_c(x)

![Image](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_5.png)

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_6.png)

Hence, f1_c ~ 0.5 + 0.044*x - 0.00005*x²

![Image 2](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_7.png)

![Image 3](/assets/img/2024-06-23-Manufacturingpolynomialsusingasigmoidneuralnetworkanewlookfromageneralizationperspective_8.png)


<div class="content-ad"></div>

따라서, f2_c ~ 0.2237 + 0.0676*x + 0.0041*x² - 0.0002*x³

제한된 모델 레이어 2: y_pred_c = g_c(f1_c, f2_c); g_c는 선형입니다.
y_pred_c ~ 2.95 + 6.4*x + 2.79*x² - 0.134*x³

참고: 실습에 포함된 추가 진단은 수행되었지만, 간결함을 위해 이 글에서는 생략되었습니다. 이러한 진단에 관심이 있는 독자는 다음 스크립트를 실행해주세요:

- 제한된 모델을 위한 test_quadratic.py
- 제한되지 않은 모델을 위한 test_quadratic_unconstrained.py

<div class="content-ad"></div>

## 추가적인 추론

참고: *로 표시된 추론은 세 논문 중 어느 것에도 입증되지 않았지만 이론적으로나 경험적으로 보여질 수 있으며, **로 표시된 추론은 향후 논문을 위한 가능성 있는 후보들이다.

- 비제약 모델에 대해 f1_u와 f2_u 모두 조각선형 함수 형태*를 띄며 ReLU와 유사하다*
- 제약이 있는 모델과 제약이 없는 모델에 대해 이차적합을 강제하면 다음과 같은 형태가 나온다:
y_pred_u ~ 7.22 + 2.18*x + 2.31*x²
y_pred_c ~ 3.56 + 1.98*x + 2.72*x²
- 최종 가중치가 크게 다르더라도 두 모델의 훈련 오차 차이가 크지 않다. 그러므로 MSE vs. (w1, w2, W1, W2)의 곡선은 모델의 가중치 사이에 오랜 기울기를 보인다**.

# 결론

<div class="content-ad"></div>

제약이 있는 모델은 (MSE 및 모델 계수가 실제 모델과 얼마나 가까운지) 자유로운 모델보다 훨씬 더 일반화되는 것으로 보입니다. 이 논리를 심층 신경망에서 오버피팅을 넘어서는 일반화에 적용한다면 - 모델 아키텍처가 충분히 좋은 귀납적 편향이라고 가정하면,
- 초기 오버피팅은 가중치 벡터가 초기화된 지점에서 최단 경로(최적화 알고리즘이 지배하는)를 통해 먼저 '가능한 해'로 수렴하기 때문에 발생할 수 있습니다.
- 그 이후에 발생하는 일반화가 더 나은 해로의 전이는 최적화 알고리즘이 가중치 벡터를 (오차 측정, 가중치의) 공간에서 새로운 영역으로 완전히 이동시키도록 강요하기 때문으로 설명될 수 있습니다.