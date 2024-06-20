---
title: "로스 2에서 확장 칼만 필터를 활용한 센서 융합"
description: ""
coverImage: "/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_0.png"
date: 2024-06-19 06:22
ogImage: 
  url: /assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_0.png
tag: Tech
originalTitle: "Sensor Fusion with the Extended Kalman Filter in ROS 2"
link: "https://medium.com/@kidargueta/sensor-fusion-with-the-extended-kalman-filter-in-ros-2-d33dbab1829d"
---


![Sensor Fusion with the Extended Kalman Filter in ROS2](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_0.png)

안녕하세요! 이 글은 가우시안 필터를 소개하는 시리즈 중 두 번째 글입니다. 구체적으로, 이 글은 칼만 필터 패밀리에 대한 세 번째 세부 소개입니다. 이미 칼만 필터에 대해 익숙하지 않다면, 계속하기 전에 첫 번째 글을 읽기를 권장합니다. 다음 글에서는 언센티드 칼만 필터를 소개할 예정입니다. 이 글의 결과를 재현하는 데 사용된 데이터와 코드는 이 글의 끝 부분에 찾을 수 있습니다.

# 소개

이전 글에서 소개된 대로, 성공적인 로봇 시스템은 유용한 작업을 수행하기 위해 물리적 세계를 인식하고 조작할 수 있어야 합니다. 이를 달성하기 위해 로봇은 환경의 중요한 불확실성을 고려해야 합니다. 현대 로봇 공학에서 가장 기본적인 문제 중 하나는 상태 추정입니다. 상태 추정은 로봇과 환경(랜드마크 및 기타 객체의 위치 등)의 가장 확률적인 상태(예: 위치, 방향, 속도)를 불확실한(잡음이 있는) 및 아마도 불완전한 정보를 기반으로 결정하는 것을 포함합니다.

<div class="content-ad"></div>

칼만 필터는 불확실한 환경에서 상태 추정에 대응합니다. 필터는 상태의 각 요소 (예: x, y 좌표, 헤딩)을 가우시안 확률 변수로 모델링합니다. 가우시안은 상태 x에 대한 확률 밀도를 벡터 μ (뮤)와 공분산 행렬 Σ (시그마)만 사용하여 표현할 수 있게 합니다. 이 매개변수화에서 우리의 상태 x는 기대값 μ에 의해 표현되며, Σ는 제어, 이동 및 관측 잡음으로 인한 상태의 내재적 불확실성을 포착합니다.

칼만 필터가 사용하는 베이지안 프레임워크에서는 전체 상태를 믿음(belief)이라고 합니다. 가우시안 (또는 정규분포)을 사용하는 장점은 그들의 수학적 성질에 있습니다. 이 성질은 칼만 필터 방정식을 단순화합니다. 가우시안 믿음이 선형 변환을 겪을 때의 특징 중요한데, 가우시안 믿음이 선형 변환을 겪으면 결과는 여전히 가우시안 확률 변수로 유지됩니다. 이 성질은 칼만 필터의 방정식이 우아하고 다루기 쉬운 상태를 유지하도록 보장합니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_1.png)

사후 믿음을 계산하기 위해 칼만 필터는 이전 믿음을 시간을 경과함에 따라 전달하는 모션 모델을 사용합니다. 그런 다음 관측 모델은 로봇 센서에서의 데이터를 통합하여 예측된 믿음을 업데이트하고 이를 사후로 변환합니다. 칼만 필터 알고리즘은 아래에서 요약됩니다:

<div class="content-ad"></div>

![Linearity of the Linear Kalman Filter](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_2.png)

선형 칼만 필터의 "선형성"은 알고리즘의 2번째와 5번째 줄에서 가장 명백합니다. 2번째 줄에서 예측된 상태는 이전 상태 μ_t−1과 제어 입력 u_t의 선형 함수입니다. 5번째 줄에서 예측된 관측값 (y = Cμ)은 인수 μ^bar_t의 선형 함수입니다. 이 선형성은 가우시안 특성을 유지하여 필터를 구현하기 쉽게 만듭니다. 그러나 이것은 또한 주요 약점 중 하나를 나타냅니다.

선형 칼만 필터가 실제 문제에 부적합한 이유는 실제 문제가 종종 선형적이지 않기 때문입니다. 이전 글에서 도입했던 간단한 상태 추정의 경우, 상태가 모바일 로봇의 2차원 포즈 (x, y, θ)로 표현되었지만 정확히 선형적이지 않았습니다. 아래에 다시 소개되는 이동 모델에서 확인할 수 있습니다.

![Motion Model](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_3.png)

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_4.png)

모델이 쉽게 알아볼 수 있듯이, 삼각 함수가 사용되어 로봇의 좌표를 업데이트하는데 사용되며, 이러한 함수들은 선형이 아닙니다. 이 모델에서 선형 칼만 필터는 어느 순간 발산할 가능성이 있습니다. 이 이유로 선형 칼만 필터를 소개한 후, 대부분의 실제 현상의 비선형성을 고려하기 위해 확장 방법을 고안하는 작업이 즉시 시작되었습니다.

# 확장 칼만 필터

## 비선형성의 문제

<div class="content-ad"></div>

비선형성에 관한 문제를 더 자세히 설명하기 위해 다음 애니메이션을 살펴볼 수 있습니다. 첫 번째 애니메이션에서는 선형 칼만 필터의 가정이 성립하는 세계에 있으며, 새로운 상태가 인수에 대해 단순하게 선형인 경우를 살펴봅니다. 시각화를 이해하기 쉽게 하기 위해 1차원 상태 x를 가정합니다. 이 애니메이션은 가우스를 선형 함수 g를 통과시켰을 때 다른 가우스가 되는 과정을 보여줍니다. 이 경우 g = -0.5*x+1입니다.

x의 가우시안 표현에서 시작하지만 비선형 함수 g를 선택하는 경우, 결과 확률 밀도 함수는 더 이상 가우시안이 아닙니다. 새로운 밀도를 계산하기 위한 폐쇄형 방법이 없습니다. 대신 입력 분포에서 점들을 샘플링하고 이를 g를 통과시켜 출력 히스토그램을 구축하여 출력 분포를 만들어야 합니다. 아래에 표시된 출력의 형태에서 확인할 수 있듯이, 이는 가우시안이 아닌 것을 알 수 있습니다. 또한 이 출력 분포는 칼만 필터의 단봉성 가정을 위배하며, 단일 피크를 요구합니다. P(y)의 가우시안 근사는 출력 데이터에 가우시안을 맞추어 얻었습니다. 이는 실제 모델의 비선형성을 다루기 위한 선형 칼만 필터의 한계를 강조합니다.

요약하면 비선형 모델을 다룰 때 출력 밀도는 가우시안이 아니며 폐쇄형으로 계산할 수 없으며 종종 다중 피크를 갖기 때문에 칼만 필터 방정식이 무용지물이 됩니다. 이 문제를 해결하기 위해 확장 칼만 필터(EKF)는 선형성 가정을 버립니다. 대신 상태 전이 확률과 측정 확률은 비선형 함수 g 및 h에 따라 결정됨을 수용합니다.

<img src="/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_5.png" />

<div class="content-ad"></div>

![그림](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_6.png)

모든 것이 잘 진행되고 있어요. 칼만 필터의 우아한 방정식을 활용하려면 여전히 우리의 신뢰를 가우시안으로 표현해야 합니다. 이 필수성은 정확한 사후분포를 계산하는 것에서 EKF의 초점을 이동시켜 실제 신뢰의 좋은 가우시안 근사값을 찾게 됩니다. 아래 그림에서 보듯, 몬테칼로를 사용하여 출력 분포를 계산한 후, 그에 대한 가우시안을 fitting하고 필요한 매개변수 μ (뮤)와 Σ (시그마)를 얻을 수 있습니다. 그러나 아직도 가우시안을 닫힌 형태로 계산할 수 없는 문제가 남아 있습니다.

## 테일러 전개를 통한 선형화

이 문제를 해결하기 위해 확장 칼만 필터는 선형화라는 추가 근사값을 적용합니다. 선형화의 핵심 아이디어는 비선형 함수 g를 해당 관심점에서 g에 접하는 접선인 선형 함수로 근사하는 것입니다. 비선형 함수를 선형화하는 다양한 기술 중, EKF가 사용하는 것은 일차 테일러 전개입니다. 함수의 테일러 전개는 함수의 도함수를 하나의 점 a에서 표현된 다항식 항들의 무한 합입니다.

<div class="content-ad"></div>

위의 이미지에서 높은 차수의 테일러 전개가 점 a = 0 주변에서 g를 더 가까운 근사로 제공하는 것을 볼 수 있습니다. 그러나 고차 다항식이 늘어날수록 요구되는 계산도 증가하며, 문제가 빠르게 풀기 어려워집니다. 다행히도 Kalman 필터가 자주 업데이트되는 경우(작은 Δt), 관심점 a의 차이가 매우 작아야합니다. 따라서 우리는 다음 (매우 가까운) 각 지점 a에서의 함수 g의 값을 및 기울기(점 a에서의 미분)를 사용하여 함수 g의 선형 근사를 얻기 위해 1차 다항식(선)을 사용할 수 있습니다. 이 문제는 본질적으로 아래와 같이 간소화됩니다:


![2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_9.png](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_9.png)


<div class="content-ad"></div>

이 동작이 왜 잘 작동하는지 설명하기 위해 g라는 함수를 가정해 볼게요.

![그림](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_10.png)

점 a에서 함수 g의 일차 테일러 전개는 아래 그림에서 빨간색으로 표시되어 있어요. 큰 x 값 범위를 관찰하면 좋은 근사치를 제공하지 않음이 명백해요.

![그림](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_11.png)

<div class="content-ad"></div>

그러나 우리가 사후 분포의 값들에 대한 근사치에만 주의를 기울이기 때문에, 새로운 사후 분포에 대해 그러한 근사치를 매우 짧은 시간 이후에 다시 계산할 것을 알고 있기 때문에, 아래 그래프에서 볼 수 있듯이, 우리의 근사치가 관심 지점 주변에서 매우 좋다는 것을 알 수 있습니다. 이는 첫 번째 차수 테일러 전개가 우리의 목적에 대해 충분한 근사치를 제공하며, 시스템 내부의 비선형성에도 불구하고 확장 칼만 필터를 효과적으로 적용할 수 있도록 합니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_12.png)

마지막으로, 아래 이미지는 두 프로세스를 비교하려고 합니다: 첫 번째는 원래의 가우시안으로 시작하여 비선형 함수 g를 통과시키고, 몬테카를로를 사용하여 비가우시안 출력 분포를 얻은 후, 이 출력에 가우시안을 적합시킵니다. 두 번째로, EKF가 사용하는 프로세스는 g를 선형화시키고, 원래의 가우시안을 이 선형 근사치를 통해 통과시킨 후, 선형화를 통해 닫힌 형태로 출력을 직접 얻습니다. 이 비교는 비선형 시스템 다루기에 대한 EKF 접근 방식의 효율성과 실용성을 강조합니다.

명확성을 위해, 아래에서는 출력만 표시됩니다. 보시다시피, EKF 가우시안이 몬테카를로 시뮬레이션에서 적합된 가우시안과 정확히 같지는 않지만, 충분히 가깝습니다. 이 작은 차이는 실제 분포의 닫힌 형태의 추정치를 효율적으로 얻기 위해 지불하는 대가입니다.

<div class="content-ad"></div>

위에서 설명한 간단한 예제는 스칼라 경우에 대한 것이었지만, 우리의 상태는 벡터입니다. 따라서 기울기를 구하기 위해 우리는 상태에 대한 g의 편미분을 계산합니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_13.png)

g와 그 기울기 g′의 값은 그들의 인자 (u_t와 x_t-1)에 따라 달라지는데요, 이는 우리의 관심 지점입니다 (스칼라 경우의 a와 대조적입니다). u_t의 값에 대해서는 로봇에 제공된 제어 명령을 사용합니다. x_t-1에 대해서는 선형화할 시기에서 가장 가능성이 높은 상태의 값으로 선택할 수 있습니다. 가우시안의 경우, 최대 가능성 값은 이전 시간 단계에서 계산된 사후값의 평균인 μ_t-1로 표시됩니다. 이 선형화는 업데이트 속도가 매우 빠른 필터 (매우 작은 Δt)에 대해 잘 작동하며, 이때 μ_t-1의 값과 우리가 추정하려는 현재 상태 간의 차이가 크지 않을 때 잘 작동합니다.

이제 기울기를 계산했기 때문에 g를 다음과 같이 추정할 수 있습니다:

<div class="content-ad"></div>


![sensor fusion](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_14.png)

가우시안에서, 모션 모델 또는 상태 전이 확률은 아래와 같이 표기됩니다. 여기서 R_t는 보통의 프로세스 노이즈 공분산입니다.

![motion model](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_15.png)

기울기가 숫자인 스칼라 케이스와는 달리, g'(u_t, μ_t-1)으로 알려진 G_t는 행렬입니다. 비선형 함수 g에 대한 상태 x의 일차 편미분값을 모두 포함하는 이 행렬은 야코비안이라고 합니다. 이 야코비안 행렬은 상태의 차원인 n×n의 크기를 가지며, 현재 제어 및 이전 사후 평균에 따라 값이 달라집니다. 따라서 야코비안 값은 시간이 지남에 따라 변합니다.


<div class="content-ad"></div>

확장 칼만 필터(Extended Kalman Filter)는 함수 h에 의해 표현되는 비선형 관측 모델을 다룹니다. 특히, 타일러 전개(Taylor Expansion)는 새롭게 예측된 믿음 μ^bar_t을 중심으로 진행되며, 이는 h를 선형화하는 시점에서 가장 가능성이 높은 상태입니다.

![이미지](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_16.png)

![이미지](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_17.png)

가우시안으로, 측정 모델은 아래와 같이 표기됩니다. 여기서 Q_t는 전통적인 측정 잡음 공분산입니다. 여기서 야코비안 H_t는 관측 모델의 비선형 함수 h에 대한 상태 x에 대한 일차 편미분의 m×n 행렬입니다. 따라서 m은 관측의 차원이고, n은 상태의 차원입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_18.png" />

## Extended Kalman Filter Algorithm

요약하면, 아래에 표시된 EKF 알고리즘은 이 기사의 앞부분에 표시된 LKF 알고리즘과 매우 유사하지만, 주요한 차이점은 모션 및 관측 모델의 선형화가 2번 줄과 5번 줄에서 이루어진다는 것입니다.

<img src="/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_19.png" />

<div class="content-ad"></div>

아래 이미지는 EKF 알고리즘을 LKF와 나란히 재진 다음 주요 차이점을 강조합니다. 예측 단계에서 EKF는 선형 시스템 행렬 A 및 B 대신 상태를 시간에 따라 진화시키는 비선형 함수 g를 사용합니다. Unscented Kalman Filter는 EKF보다 더 나은 정확도를 제공합니다. Unscented Kalman Filter는 EKF보다 더 나은 정확도를 제공합니다. Unscented Kalman Filter는 EKF보다 더 나은 정확도를 제공합니다. Unscented Kalman Filter는 EKF보다 더 나은 정확도를 제공합니다. Unscented Kalman Filter는 EKF보다 더 나은 정확도를 제공합니다. Unscented Kalman Filter�...

<div class="content-ad"></div>

## 모델 선형화

선형 칼만 필터와 사용된 모션 모델은 정확히 선형은 아니지만 여전히 단순하여 LKF가 처리할 수 있는 간단한 상수 속도 모델이었습니다. 참고로, 아래에 다시 표시해 드립니다. 이 모델은 확장 칼만 필터의 능력을 보여주기 위해 사용될 더 복잡한 변형을 소개하는 기초 역할을 할 것입니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_21.png)

이 방정식들은 다음과 같이 LKF에서 요구하는 선형 시스템 행렬로 변환되었습니다:

<div class="content-ad"></div>

아래는 Markdown 형식입니다.


![sensorfusion1](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_22.png)

EKF를 사용하여 동일한 모델을 사용하려면 선형화해야 합니다. 먼저로봇의 상태 형식을 재정의합니다.

![sensorfusion2](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_23.png)

이후 비선형 함수 g를 정의합니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_24.png" />

다음으로, 우리는 각 상태 변수 x, y, 그리고 θ에 대한 함수 g의 편도함수를 포함하는 야코비안 행렬 G를 정의합니다. 이 행렬은 상태 변수의 변화가 운동 모델에 어떻게 영향을 미치는지를 포착합니다. 야코비안 행렬 G는 EKF 알고리즘에서 공분산 행렬을 업데이트하는 데 사용될 것이며, 우리에게 운동 모델의 비선형성들을 고려하면서도 칼만 필터 프레임워크의 계산 효율성을 유지할 수 있게 해줍니다.

<img src="/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_25.png" />

x 업데이트 방정식의 x, y, 그리고 θ에 대한 도함수를 나타내는 야코비안 행렬 G의 첫 번째 행을 살펴보면, 다음과 같은 것을 볼 수 있습니다:

<div class="content-ad"></div>

- 첫 번째 항목은 x에 대한 부분 도함수이기 때문에 1입니다.
- 두 번째 항목은 x가 y에 의존하지 않음을 나타내는 0입니다.
- 세 번째 항목은 −vsin(θ)Δt이며, 이것은 x가 θ에 −vsin(θ)Δt항으로 의존함을 보여줍니다. 이것은 θ의 변화가 x 좌표에 미치는 영향을 반영합니다.

다음으로 측정 함수 h가 필요합니다. 이전 Linear Kalman Filter의 구현과 유사하게, 사용할 측정은 로봇의 오도메트리 시스템에서 제공하는 것만 사용할 것입니다. 이 시스템은 바퀴 엔코더에서 계산된 로봇의 추정 자세를 직접 제공합니다. 그 데이터 형식이 우리의 상태 형식과 일치하기 때문에, h(μ^bar_t)는 단순히 μ^bar_t를 반환합니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_26.png)

그리고 상태에 대한 측정 함수의 부분 미분을 포함하는 Jacobian 행렬 H는 단위 행렬이며 아래와 같이 표시됩니다.

<div class="content-ad"></div>


![sensor fusion](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_27.png)

이전 그림에서 EKF와 LKF를 비교한 것처럼, 선형화가 두 알고리즘의 주요 차이점입니다. 관련 기능 및 해당 야코비안을 확인한 후, EKF의 구현은 LKF의 구현을 밀접하게 따릅니다. 아래는 선형화된 속도 모션 모델의 Python 구현입니다. 행렬 g와 야코비안 G를 모두 반환합니다.

```python
def velocity_motion_model_linearized_1():

 def state_transition_function_g(mu = None, u = None, delta_t = None):
  x = mu[0]
  y = mu[1]
  theta = mu[2]
  
  v = u[0]       
  w = u[1]       
  
  g = np.array([
            x + v * np.cos(theta) * delta_t,
            y + v * np.sin(theta) * delta_t,
            theta + w * delta_t
        ])

  return g

 def jacobian_of_g_wrt_state_G(mu = None, u = None, delta_t = None):
  theta = mu[2]
  v = u[0]       
  w = u[1]       
  
  G = np.array([
   [1, 0, -v * np.sin(theta) * delta_t],
   [0, 1, v * np.cos(theta) * delta_t],
   [0, 0, 1]
  ])

  return G

 return state_transition_function_g, jacobian_of_g_wrt_state_G
```

다음으로, 다음과 같이 간단한 관측 모델을 구현합니다.


<div class="content-ad"></div>

```js
def odometry_observation_model_linearized():
 def observation_function_h(mu):
  return mu
 
 def jacobian_of_h_wrt_state_H(mu):
  return np.eye(3)

 return observation_function_h, jacobian_of_h_wrt_state_H
```

마지막으로, 아래에 구현된 Extended Kalman Filter 코드를 확인해보세요. 직전 게시물에서 소개된 Linear Kalman Filter 코드와 얼마나 비슷한지 주목하세요.

```js
import numpy as np 

from rse_motion_models.velocity_motion_models import velocity_motion_model_linearized_1
from rse_observation_models.odometry_observation_models import odometry_observation_model_linearized

class KalmanFilter:

 def __init__(self, initial_state, initial_covariance, proc_noise_std = [0.02, 0.02, 0.01], obs_noise_std = [0.02, 0.02, 0.01]):

  self.mu = initial_state # 초기 상태 추정
  self.Sigma = initial_covariance # 초기 불확실성

  self.g, self.G = velocity_motion_model_linearized_1() # 사용할 액션 모델

  # 과정 모델 노이즈의 표준 편차
  self.proc_noise_std = np.array(proc_noise_std)
  # 과정 노이즈 공분산 (R)
  self.R = np.diag(self.proc_noise_std ** 2) 

  self.h, self.H = odometry_observation_model_linearized() # 사용할 관측 모델

  # 관측 모델 노이즈의 표준 편차
  self.obs_noise_std = np.array(obs_noise_std)
  # 관측 노이즈 공분산 (Q)
  self.Q = np.diag(self.obs_noise_std ** 2)

 def predict(self, u, dt):
  # 상태 추정 (mu) 예측
  self.mu = self.g(self.mu, u, dt)
  # 공분산 (Sigma) 예측
  self.Sigma = self.G(self.mu, u, dt) @ self.Sigma @ self.G(self.mu, u, dt).T + self.R

  return self.mu, self.Sigma

 def update(self, z, dt):
  # 칼만 이득 (K) 계산
  K = self.Sigma @ self.H(self.mu).T @ np.linalg.inv(self.H(self.mu) @ self.Sigma @ self.H(self.mu).T + self.Q)
  
  # 상태 추정 (mu) 업데이트
  self.mu = self.mu + K @ (z - self.h(self.mu))

  # 공분산 (Sigma) 업데이트
  I = np.eye(len(K)) 
  self.Sigma = (I - K @ self.H(self.mu)) @ self.Sigma

  return self.mu, self.Sigma
```

성능:


<div class="content-ad"></div>

Extended Kalman Filter(EKF)의 성능을 평가하기 위해, 동일한 상수 속도 모델과 오도메트리 관측 모델을 사용하는 선형 칼만 필터(LKF)의 성능과 비교할 것입니다. 먼저, 초기 과정 노이즈를 크게 설정하고 관측 노이즈를 매우 낮게 설정할 것입니다. 이 설정은 사실상 필터에게 행동 모델보다는 관측을 신뢰하도록 지시합니다. 예상했듯이, 두 버전의 칼만 필터는 관측을 따라가며 비슷한 성능을 발휘합니다. 관측 모델의 간단함과 선형성을 고려하면 이 결과가 예상된 것입니다.

다음 테스트는 더 어려울 것입니다. 과정 노이즈를 매우 낮게 설정하고 관측 노이즈를 매우 높게 설정할 것입니다. 이 설정은 필터가 대부분의 관측을 무시하고 상태 추정에 운동 모델에 크게 의존하게 만듭니다. 운동 방정식이 같더라도, EKF가 적용한 선형화 때문에 크게 다른 결과를 예상할 것입니다.

예상대로, 차이는 상당합니다. 이러한 노이즈 설정 하에서 LKF는 성능이 저조합니다. 비선형 운동 모델에 완전히 의존할 때, LKF의 결과는 실제 값과 로봇 센서에서 보고된 오도메트리에서 크게 벗어납니다. 반면에, EKF는 관측 데이터에 더 가까이 머물며 훨씬 나은 성능을 발휘합니다. 또한 오른쪽 그림의 큰 타원에서 나타나는 바와 같이 EKF는 높은 불확실성을 정확히 나타냅니다. 반면에, LKF는 낮은 불확실성을보고하는데, 이것은 부정확합니다.

## 대안 운동 모델

<div class="content-ad"></div>

과거 두 필터에서 사용된 모션 모델은 꽤 간단하며 로봇이 헤딩 각도 θ(세타)의 방향으로 직선으로 이동한다고 가정합니다. 보다 정교한 모션 모델이 존재하며, 그 모델이 더 나은 성능을 발휘할 수 있는지 확인하는 것이 중요합니다. 다음에 탐구할 새로운 상수 속도 모션 모델은 로봇을 변환(직선) 및 회전(각도) 속도 v 및 ω를 통해 제어할 수 있도록 합니다. 직선 이동을 가정하는 대신, 이 모델은 아래에 나와 있는 것처럼 반지름이 r인 원 위를 로봇이 이동한다고 가정합니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_28.png)

직선 모션 가정과 같이 원형 모션 가정도 근사값일 뿐이며, 시간 간격이 매우 작은 경우에만 유효합니다(움직임이 원이건 직선이건 구분할 수 없을 정도로 아주 작을 때). ω 값이 0에 가까워질수록, 반지름은 아주 크게되어 거의 직선 상에서의 움직임을 나타내게 됩니다. 시간에 따라 상태를 진화시키기 위해 이 모델을 따르는 비선형 함수 g에 해당하는 방정식 벡터는 아래에 나와 있습니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_29.png)

<div class="content-ad"></div>

이제이 모델을 선형화하기 위해 g의 자코비안을 계산해야 합니다. 이는 상태에 대한 g의 편도함수에 해당합니다. 우리의 상태는 다음과 같습니다:

![State](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_30.png)

따라서 자코비안 G는 다음과 같이 표현됩니다:

![Jacobian](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_31.png)

<div class="content-ad"></div>

위에서 보았듯이, 관련 행렬을 결정한 후에 구현은 간단합니다. 먼저, 아래 속도 모델 코드를 정의합니다.

```js
def velocity_motion_model_linearized_2():

 def state_transition_function_g(mu = None, u = None, delta_t = None):
  x = mu[0]
  y = mu[1]
  theta = mu[2]
  
  v = u[0]       
  w = u[1]       
  if w == 0:
   w = 1e-6   # 직선 이동의 경우 0으로 나누는 것을 피하기 위해

  g = np.array([
     x + -v/w * np.sin(theta) + v/w * np.sin(theta + w * delta_t),
     y + v/w * np.cos(theta) - v/w * np.cos(theta + w * delta_t),
     theta + w * delta_t
  ])

  return g

 def jacobian_of_g_wrt_state_G(mu = None, u = None, delta_t = None):
  theta = mu[2]
  v = u[0]       
  w = u[1]       
  if w == 0:
   w = 1e-6   # 직선 이동의 경우 0으로 나누는 것을 피하기 위해

  G = np.array([
   [1, 0, -v / w * np.cos(theta) + v / w * np.cos(theta + w * delta_t)],
   [0, 1, -v / w * np.sin(theta) + v / w * np.sin(theta + w * delta_t)],
   [0, 0, 1]
  ])

  return G

 return state_transition_function_g, jacobian_of_g_wrt_state_G
```

관측 모델은 이전 예제에서 사용한 것과 정확히 동일하며 완전성을 위해 여기에 다시 제시하겠습니다.

```js
def odometry_observation_model_linearized():
 def observation_function_h(mu):
  return mu
 
 def jacobian_of_h_wrt_state_H(mu):
  return np.eye(3)

 return observation_function_h, jacobian_of_h_wrt_state_H
```

<div class="content-ad"></div>

마침내 두 번째 확장 칼만 필터가 아래에 구현되었습니다. 코드는 이전 것과 정확히 동일하지만 움직임 모델을 정의하는 라인만 예외입니다.

```js
class KalmanFilter:

 def __init__(self, initial_state, initial_covariance, proc_noise_std = [0.02, 0.02, 0.01], obs_noise_std = [0.02, 0.02, 0.01]):

  self.mu = initial_state # 초기 상태 추정
  self.Sigma = initial_covariance # 초기 불확실성

  self.g, self.G = velocity_motion_model_linearized_2() # 사용할 액션 모델
  
  # 프로세스 또는 액션 모델 노이즈의 표준 편차
  self.proc_noise_std = np.array(proc_noise_std)
  # 프로세스 노이즈 공분산 (R)
  self.R = np.diag(self.proc_noise_std ** 2) 

  self.h, self.H = odometry_observation_model_linearized() # 사용할 관측 모델

  # 관측 또는 센서 모델 노이즈의 표준 편차
  self.obs_noise_std = np.array(obs_noise_std)
  # 관측 노이즈 공분산 (Q)
  self.Q = np.diag(self.obs_noise_std ** 2)

 def predict(self, u, dt):
  # 상태 추정 (mu) 예측
  self.mu = self.g(self.mu, u, dt)
  # 공분산 (Sigma) 예측
  self.Sigma = self.G(self.mu, u, dt) @ self.Sigma @ self.G(self.mu, u, dt).T + self.R 

  return self.mu, self.Sigma

 def update(self, z, dt):
  # 칼만 이득 (K) 계산
  K = self.Sigma @ self.H(self.mu).T @ np.linalg.inv(self.H(self.mu) @ self.Sigma @ self.H(self.mu).T + self.Q)
  
  # 상태 추정 (mu) 업데이트
  self.mu = self.mu + K @ (z - self.h(self.mu))

  # 공분산 (Sigma) 업데이트
  I = np.eye(len(K)) 
  self.Sigma = (I - K @ self.H(self.mu)) @ self.Sigma

  return self.mu, self.Sigma
```

성능:

이 시점에서 EKF가 LKF보다 우월함이 명확하며, 이제는 더 정교한 움직임 모델이 뚜렷한 향상을 가져오는지를 결정하는 것에 중점을 두고 연구를 계속할 것입니다. 관측 모델이 명백히 움직임 모델보다 우선하는 잡음 설정에서 평가를 수행하지 않을 것이며, 이렇게 하면 모든 필터에 대해 단순히 관측 결과와 일치할 것으로 예상됩니다. 따라서 여기서는 관측을 대부분 무시하고 움직임 모델에 더 집중하는 잡음 설정으로 결과를 제시합니다.

<div class="content-ad"></div>

놀랍게도 더 고급 모델이 더 간단한 모델보다 우수한 성능을 내지 못했습니다. 위의 두 개의 도표에서는 순수한 눈으로는 중요한 성능 차이를 알아차리기 힘듭니다. 심지어 보고된 잡음 타원도 거의 같아 보입니다.

이전의 기사에서 얻은 결론 중 하나는 우리도 이곳에서 도출하는 것인데, 어떻게 소위 세련되고 고급스러운 필터를 사용하더라도 잘못된 데이터를 입력하면 잘못된 추정값을 제공할 것이라는 것입니다. 우리의 오도메트리 관측에 문제가 있다는 사실을 조정할 방법이 없네요. 이전의 모든 도표에서 주요 문제가 헤딩인 것처럼 보입니다. 올바른 헤딩 데이터가 없으면 어떤 고급 움직임 모델도 이를 보상할 수 없을 겁니다. 로봇이 헤딩의 대안 소스를 제공한다면 (그리고 다른 유용한 센서 데이터도 제공한다면), 필터를 사용하여 서로 다른 소스를 융합하고 더 나은 추정값을 얻을 수 있습니다. 다음에는 센서 융합을 살펴보겠습니다.

## 센서 융합의 힘

센서 융합에는 다양한 종류가 있으며, 우리가 적용할 유형은 저수준 융합으로 알려져 있습니다. 저수준 데이터 융합의 목표는 함께 더 유익한 여러 소스의 기본 센서 데이터를 결합하는 것입니다. 이 아이디어는 서로 다른 소스의 강점을 활용하여 더 나은 추정값을 만들어내는 것입니다.

<div class="content-ad"></div>

이 기사에서는 원래 오도메트리 데이터와 관성 측정 장치(IMU)에서 오는 데이터를 어떻게 결합하는지에 대해 연구할 것입니다. IMU는 일반적으로 우리에게 방향, 각속도 및 선형 가속도를 제공할 수 있습니다. 이는 우리가 부정확한 추정이 나쁜 방향 정보 때문인 것으로 의심하기 때문에 매우 유익합니다. IMU는 이러한 종류의 정보에 대해 오도메터보다 정확할 경향이 있기 때문에, IMU 데이터가 오도메트리와 어떻게 융합되어 더 나은 결과를 얻을 수 있는지 알아보겠습니다.

우리가 할 첫 번째 일은 상태와 모델을 확장하는 것입니다. 이전에는 추가 데이터의 좋은 소스가 없었기 때문에 로봇의 자세 이상을 고려하는 것이 별 의미가 없었습니다. 그러나 이제 우리에게 각속도와 선형 가속도를 제공할 수 있는 센서가 있기 때문에, 새로운 정보를 상태에 통합하는 것이 로봇의 상태를 더 잘 추정하는 데 도움이 될 것입니다. 이는 또한 우리의 동작 및 센서 모델을 확장할 것이기 때문에 필수적입니다. 이 기사에서는 새로운 7차원 상태로 시작하는 두 가지 다른 확장을 시도할 것입니다.

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_32.png)

여기서 x, y 및 θ는 친숙한 로봇 자세에 해당합니다. 과거 구현과는 달리, 속도 v와 각속도 ω가 제어 입력에서만 얻어졌던 경우, 이제 이들의 추정치도 상태의 일부로 유지합니다. 상태에는 x 및 y의 선형 가속도도 포함됩니다. 확장된 상태를 고려할 때, 동작 모델도 각 상태 구성 요소를 계산하기 위해 확장되어야 합니다. 가속도를 고려하는 동작 모델은 더 이상 상수 속도 모델이 될 수 없습니다. 따라서 속도는 추정 사이에 변화하고, 가속도는 일정하게 유지된다는 새로운 가속도 일정 모델을 사용할 것입니다. 이 새로운 가속도 상수 모델은 아래 표시된 함수 g와 야코비안 행렬 G에 의해 표현됩니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_33.png)

![image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_34.png)

지금부터 조금 복잡해집니다. 이 큰 야코비안 행렬을 계산하는 것은 매우 에러가 발생하기 쉽습니다. 수동으로 시도해보는 것도 재미있지만, 항상 결과를 확인하기 위해 소프트웨어를 사용하는 것이 좋은 생각입니다. 계산이 올바르다고 확신하고 구현한 후에도 해당 구현이 정확한지 확인할 방법이 있어야 합니다. 이 기사에 구현된 모든 야코비안에 대해, 테스트 스크립트가 잡아낸 적어도 하나의 작은 오류가 있었습니다. 야코비안을 계산하고 구현이 올바른지 확인하는 데 소프트웨어를 사용하지 않으면 코드에 버그를 도입할 확률이 높습니다.

상태 및 운동 모델을 성공적으로 확장했습니다. 이제 센서 퓨전을 가능하게 하려면 관찰 모델도 확장해야 합니다. 확장된 상태 및 운동 모델과 결합하여 퓨전을 수행할 수 있도록 두 센서의 데이터를 연결하려 할 것입니다. 새로운 관찰 모델은 아래에 표시된 벡터의 첫 세 요소인 보통의 로봇 자세와 IMU 센서에서 파생된 방향 θ_imu, 각 속도 ω, 그리고 x 및 y 구성 요소에서의 가속도 a_x 및 a_y와 조합된 것입니다. 우리가 선속도 v를 직접 관측하지는 않지만 여전히 상태에 있을 수 있으며, Kalman 필터에 의해 운동 모델을 통해 추론될 것입니다. 이와 같은 관측되지 않는 변수를 숨겨진 또는 잠재 변수라고 부르는 경우가 종종 있습니다.

<div class="content-ad"></div>

다음은 아래에 정의된 자코비안 행렬입니다. 관측값에서 상태 변수로의 직접적인 매핑이 있으므로, 자코비안에서 관측값(행)이 상태 변수(열)에 해당될 때는 1이 있습니다. 자코비안에서 상태 변수 θ에 해당하는 3열에는 두 개의 1이 있음을 주목해 주세요 — odometry에서 θ에 대한 행과 IMU에서 θ에 대한 행이 각각 하나씩 있습니다. 또한, 선형 속도에 해당하는 4열은 직접 관측하지 않기 때문에 모두 0입니다.

구현된 모션 및 관측 모델은 아래에 나와 있습니다. 필터의 구현은 이전 것과 매우 유사하므로 간결함을 위해 생략하겠습니다.

<div class="content-ad"></div>

```js
def acceleration_motion_model_linearized_1():

 def state_transition_function_g(mu = None, u = None, delta_t = None):
  
  x, y, theta, v, w, a_x, a_y = mu

  v = u[0]      
  w = u[1] 
  
  g = np.array([
   x + v * np.cos(theta) * delta_t + 0.5 * a_x * delta_t**2,      
      y + v * np.sin(theta) * delta_t + 0.5 * a_y * delta_t**2,    
      theta + w * delta_t,
      v + a_x * np.cos(theta) * delta_t + a_y * np.sin(theta) * delta_t,
      w,                                                      
      a_x,                                                              
      a_y
  ])

  return g

 def jacobian_of_g_wrt_state_G(mu = None, u = None, delta_t = None):
  x, y, theta, v, w, a_x, a_y = mu

  v = u[0]       
  w = u[1]       

  G = np.array([[1.0, 0.0, -delta_t * v * np.sin(theta), delta_t  * np.cos(theta), 0.0, 0.5*delta_t**2, 0.0],   
                   [0.0, 1.0, delta_t * v * np.cos(theta), delta_t * np.sin(theta), 0.0, 0.0, 0.5*delta_t**2],       
                   [0.0, 0.0, 1.0, 0.0, delta_t, 0.0, 0.0],                                      
                   [0.0, 0.0, -delta_t * a_x * np.sin(theta) + delta_t * a_y * np.cos(theta), 
                   1.0, 0.0, delta_t * np.cos(theta), delta_t * np.sin(theta)],                  
                   [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],                                          
                   [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],                                          
                   [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]])                                         
  
  return G

 return state_transition_function_g, jacobian_of_g_wrt_state_G
```

```js
def odometry_imu_observation_model_with_acceleration_motion_model_linearized_1():
 def observation_function_h(mu):
  x, y, theta, v, w, ax, ay = mu
  return np.array([[x], [y], [theta], [theta], [w], [ax], [ay]]
 
 def jacobian_of_h_wrt_state_H():
  return np.array([[1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],    
                    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0],         
                    [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],         
                    [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],        
                    [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],         
                    [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],         
                    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]])

 return observation_function_h, jacobian_of_h_wrt_state_H
```

성능:

더 정교한 모션 모델을 사용하고 오도메트리 데이터와 IMU 데이터를 퓨즈하는 개선된 EKF를 평가하는 시간입니다. 특히, 노이즈 매개변수를 다음과 같이 설정하겠습니다:

<div class="content-ad"></div>

```js
proc_noise_std = [0.1, 0.1, 0.05, 0.1, 0.1, 0.1, 0.1] # [x, y, theta, v, w, a_x, a_y]
obs_noise_std = [100.0, 100.0, 1000.0, 6.853891945200942e-06, 1.0966227112321507e-06, 0.0015387262937311438, 0.0015387262937311438] #[x, y, theta, theta_imu, w, a_x, a_y]
```

이 설정은 우리의 모션 모델에 대해 높은 신뢰를 가지고 있지만 관측 모델에 대해서는 IMU 데이터를 오도메트리 데이터보다 더 신뢰한다고 필터에 알려줍니다. 특히, 우리는 필터에게 오도메트리에서의 헤딩이 미친 것이라고 생각하고 IMU에서의 헤딩이 매우 정확하다고 말하고 있습니다. 이는 IMU가 매우 정밀할 수 있고 오도메트리 데이터가 악명 높게 나쁠 수 있기 때문에 종종 사실입니다. 이 설정은 우리가 예측한 궤적을 수정하는 데 도움이 될 수 있는데, 이전에 본 것처럼 모양은 그리 나쁘지 않지만 방향은 매우 잘못된 경우가 많습니다.

아래 비디오와 이어지는 두 그림에서 볼 수 있듯이 가속도 모델과 센서 퓨전이 포함된 새 필터는 이전 필터보다 훨씬 더 잘 수행됩니다. 특히 IMU로부터 제공된 더 나은 방향성 덕분에 추정 궤적이 초기에 실제 궤적에 훨씬 가까웠음을 볼 수 있습니다. 그러나 마지막에는 지그재그 패턴을 따르기 시작했습니다.

더 나은 결과를 얻기 위한 레시피는 없습니다. 이것이 필터를 설계하는 것을 과학보다는 예술로 만드는 것입니다. 위의 지그재그 궤적을 개선할 수 있는 더 나은 모션 모델로 수정할 수 있을 것이라고 생각할 수 있습니다. 이 결과를 본 것처럼 나도 같은 방식으로 느꼈습니다. 모션 모델을 개선해 보겠습니다.

<div class="content-ad"></div>

## 모션 모델 개선하기

센서 퓨전은 도움이 되고 있지만, 아직 개선할 부분이 많이 남아 있습니다. 상태 추정을 위한 필터를 설계하려면 매우 교육된 추측을 하고 직관을 따라야 합니다. 앞서 논의한 대로, 최근 얻은 결과는 격려적이며 우리가 모델을 개선해 보아야 한다는 제안이 있습니다. 특히 상태를 모델링할 때 글로벌 선속도만을 고려하고, 가속도와 같이 다른 축을 따른 속도를 고려하지 않는 것으로 보입니다. 우리의 상태 벡터를 확장하여 이를 고려해보겠습니다.

![이미지](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_37.png)

새로운 상태 벡터에는 로봇의 움직임에 대한 더 자세한 정보를 제공할 x와 y 성분의 속도가 포함되어 있습니다. 이 확장이 필터의 성능에 어떤 영향을 미치는지 알아보겠습니다. g 함수와 해당 야코비안 G을 이용하여 표현된 확장된 모션 모델은 아래와 같습니다:

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_38.png)

![Image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_39.png)

The observation model function h remains the same, but the Jacobian H now has two columns filled with zeros corresponding to the unobserved state variables v_x and v_y.

![Image](/assets/img/2024-06-19-SensorFusionwiththeExtendedKalmanFilterinROS2_40.png)


<div class="content-ad"></div>

모델과 사용된 잡음 매개변수에 대한 코드는 다음과 같습니다. 여기서 추가적으로 필터 코드는 이전에 소개된 코드와 매우 유사하므로 생략될 것입니다.

```js
def acceleration_motion_model_linearized_2():

 def state_transition_function_g(mu = None, u = None, delta_t = None):
  
  x, y, theta, v_x, v_y , w, a_x, a_y = mu

  v = u[0]       
  w = u[1]       
  
  g = np.array([
      x + v * np.cos(theta) * delta_t + 0.5 * a_x * delta_t**2,  
      y + v * np.sin(theta) * delta_t + 0.5 * a_y * delta_t**2,  
      theta + w * delta_t,                                   
      v * np.cos(theta) + a_x * delta_t,                         
      v * np.sin(theta) + a_y * delta_t,                         
      w,                                                         
      a_x,                                                       
      a_y                                                        
  ])

  return g

 def jacobian_of_g_wrt_state_G(mu = None, u = None, delta_t = None):
  x, y, theta, v_x, v_y, w, a_x, a_y = mu

  v = u[0]       
  w = u[1]       

  G = np.array([[1.0, 0.0, -delta_t * v * np.sin(theta), 0.0, 0.0, 0.0, 0.5*delta_t**2, 0.0],   
                   [0.0, 1.0, delta_t * v * np.cos(theta), 0.0, 0.0, 0.0, 0.0, 0.5*delta_t**2],        
                   [0.0, 0.0, 1.0, 0.0, 0.0, delta_t, 0.0, 0.0],                                      
                   [0.0, 0.0, -v * np.sin(theta), 0.0, 0.0, 0.0, delta_t, 0.0],                       
                   [0.0, 0.0, v * np.cos(theta), 0.0, 0.0, 0.0, 0.0, delta_t],                        
                   [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],                                          
                   [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],                                          
                   [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]])                                         
  
  return G
 
 return state_transition_function_g, jacobian_of_g_wrt_state_G
```

```js
def odometry_imu_observation_model_with_acceleration_motion_model_linearized_2():
 def observation_function_h(mu):
  x, y, theta, v_x, v_y, w, ax, ay = mu
  return np.array([[x], [y], [theta], [theta], [w], [ax], [ay]]
 
 def jacobian_of_h_wrt_state_H():
  return np.array([[1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],       
                    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],         
                    [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0],         
                    [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0],            
                    [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],         
                    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],         
                    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]])
 
 return observation_function_h, jacobian_of_h_wrt_state_H
```

```js
proc_noise_std = [0.1, 0.1, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1] # [x, y, theta, v_x, v_y, w, a_x, a_y]
obs_noise_std = [100.0, 100.0, 1000.0, 6.853891945200942e-06, 1.0966227112321507e-06, 0.0015387262937311438, 0.0015387262937311438] #[x, y, theta, theta_imu, w, a_x, a_y]
```

<div class="content-ad"></div>

성능:

새로운 필터는 이전 동영상과 아래 그림에서 명백히 확인할 수 있듯이 인상적인 성과를 보여주었습니다. 예측된 궤적이 이제 센서 퓨전과 더 정교한 모델의 덕분에 실제 지면에 매우 가까워졌습니다. 게다가 그림의 최신 자세에서 타원으로 표시된 최종 불확실성은 이전 필터 버전보다 훨씬 작습니다. 이는 센서 퓨전이 잘 설계된 EKF의 효과를 보여줍니다. 추가로 소음 매개변수를 조정하면 더 많은 개선이 가능하지만, 이는 기사의 길이 때문에 여기서 탐구되지 않을 것입니다.

## 직접 시도해보세요

이전 기사와 마찬가지로, 코드는 전체 코드를 검사하거나 단순히 알고리즘을 실행하고 결과를 실시간으로 확인하려는 사람들을 위해 제공됩니다. 코드를 실행하려면 아래 지시사항을 따르십시오.

<div class="content-ad"></div>

먼저 필요한 것은 ROS 2입니다. ROS 2 Humble을 Ubuntu Jammy Jellyfish (22.04)에 설치하는 방법은 여기에서 찾을 수 있습니다. Ubuntu의 다른 버전이나 다른 운영 체제의 경우 공식 ROS 2 문서를 참고하십시오.

데이터를 얻으려면 이 링크에서 ROS 2 가방을 다운로드해야 합니다. 사용하기 전에 파일을 압축 해제해야 합니다.

마지막으로 ROS 2 패키지를 복제하고 빌드해야 합니다. 아래 단계를 따라 진행할 수 있습니다. ros2_ws를 실제 ROS 2 작업 공간으로 교체해야 합니다.


# 종속성 설치
sudo apt install python3-pykdl

# 패키지를 복제하고 빌드
cd ros2_ws/src
git clone https://github.com/carlos-argueta/rse_prob_robotics.git
cd ..
colcon build --symlink-install


<div class="content-ad"></div>

확장 칼만 필터를 실행하려면 3개의 다른 터미널을 열어야 합니다.

터미널 1에서 (ros2_ws를 실제 워크스페이스로 교체해주세요) 다음 명령을 실행하여 Rviz를 열고 로봇이 보고 있는 것을 확인하세요.

```js
source ~/ros2_ws/install/setup.bash
ros2 launch rse_gaussian_filters rviz_launch.launch.py
```

터미널 2에서 확장 칼만 필터의 버전에 따라 다음 명령 중 하나를 실행하세요. 먼저 아무 출력도 나오지 않을 것이며, ROS 2 가방(bag)을 실행할 때까지 기다리세요.

<div class="content-ad"></div>

```js
source ~/ros2_ws/install/setup.bash

# 아래 명령어 중 하나 실행

# 3D 상태, 기본 속도 모델
ros2 run rse_gaussian_filters ekf_estimation_3d_v1 

# 3D 상태, 고급 속도 모델
ros2 run rse_gaussian_filters ekf_estimation_3d_v2 

# 7D 상태, 가속 모델, 센서 퓨전
ros2 run rse_gaussian_filters ekf_estimation_7d 

# 8D 상태, 가속 모델, 센서 퓨전
ros2 run rse_gaussian_filters ekf_estimation_8d 
```

터미널 3에서 ROS 2 가방이 추출된 위치로 이동하여 다음 명령어로 재생하십시오. "Ignoring a topic '/navrelposned', reason: package 'ublox_msgs' not found"와 같은 경고 메시지를 무시해도 됩니다.

```js
ros2 bag play linkou-2023-12-27-2-med --clock
```

위 단계를 따르면 확장 칼만 필터를 실행하고 결과를 실시간으로 확인할 수 있습니다.


<div class="content-ad"></div>

# 실용적인 고려사항 및 마지막으로

이 글은 확장 칼만 필터 (EKF)를 기본적인 선형 칼만 필터 (LKF)의 확장으로 소개했습니다. EKF는 대부분의 실세계 시스템의 비선형성을 근사화를 통해 다룹니다. 이는 사후 평균 주변의 비선형 함수를 일차 테일러 전개를 이용하여 선형화합니다. 선형화된 후, EKF는 LKF와 유사하게 작동합니다.

보여진 대로, 센서 퓨전과 결합된 EKF는 놀라운 결과를 얻을 수 있습니다. 그러나 좋은 필터를 설계하는 것은 어렵고 오류를 범하기 쉽습니다. 종종 과학과 예술 사이의 균형을 요구합니다. 적합한 움직임 및 관측 모델을 찾는 것이 첫 번째 난관입니다. 이동 로봇에 대한 사용 가능한 모델이 있더라도, 다른 시나리오는 좋은 모델이 부족할 수 있습니다. 자코비안 계산 또한 어렵고 실수하기 쉬우며, 소프트웨어 확인이 필요함을 강조합니다.

효과적인 EKF 설계를 위해 여러 다른 고려사항과 결정이 중요합니다. 한 가지 중요한 측면은 올바른 시간 간격(delta_t)을 선택하는 것으로, 효과적인 선형화를 위해 충분히 작아야 합니다. 이 경우, 고정값 대신 동적 delta_t가 사용되었습니다. 필터의 업데이트 단계를 수행할 때 언제, 어떻게 결정하는지도 중요합니다. 특히 서로 다른 속도로 측정 값을 제공하는 다른 센서가 있을 때 (예: IMU는 보통 오도메트리보다 높은 주파수로), 적절한 노이즈 매개 변수 선택도 여러 가지 방법이 가능한 복잡한 작업입니다.

<div class="content-ad"></div>

요약하자면, 확장 칼만 필터는 특히 센서 퓨전과 함께 사용될 때 우수한 상태 추정 결과를 제공할 수 있습니다. 그러나 견고한 EKF를 설계하려면 상당한 노력과 연습이 필요합니다. 다음 글에서는 Unscented Kalman Filter (UKF)를 소개할 예정입니다. UKF는 EKF보다 여러 장점을 제공합니다. Unscented Transform을 사용하여 비선형 변환의 평균과 공분산을 더 정확하게 캡처합니다. UKF는 Jacobian을 필요로하지 않아 구현을 간단하게 만들어줍니다. 선형화로 인한 근사 오차를 줄이므로 매우 비선형 시스템에 더 효과적입니다. 또한 UKF는 비가우시안 분포를 더 잘 처리하여 견고성과 다양성을 향상시킵니다.

# 독후감

다음은 칼만 필터 패밀리에 대해 학습하기 위해 참고한 훌륭한 자료 목록입니다:

- Optimal State Estimation: Kalman, H∞, and Nonlinear Approaches
- State Estimation for Robotics
- Kalman and Bayesian Filters in Python
- Probabilistic Robotics

<div class="content-ad"></div>

이 기사가 도움이 되셨기를 바랍니다. 피드백이 있으시면 언제든지 댓글을 남겨주세요. 또한, 이후의 주제를 다룬 보다 심도 있는 강좌 시리즈를 시작하려고 합니다. 이 강좌는 비디오, 코딩 프로젝트 등이 포함될 예정이며 유료로 운영될 가능성이 높습니다. 이런 강좌에 관심이 있다면 댓글로 알려주시면 참여 의향을 파악할 수 있습니다.

저와 소통하고 싶다면 LinkedIn에서 저를 찾아보세요: https://www.linkedin.com/in/carlos-argueta

저와 함께 ROS 2를 이용한 로보틱스를 배우고 싶으신가요? 제 라이브 강의에 참여해보세요!