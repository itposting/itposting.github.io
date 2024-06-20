---
title: "기계 학습을 위한 재생 커널 힐버트 공간"
description: ""
coverImage: "/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_0.png"
date: 2024-06-19 20:17
ogImage: 
  url: /assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_0.png
tag: Tech
originalTitle: "Reproducing Kernel Hilbert Space for Machine Learning"
link: "https://medium.com/@jonathan-hui/reproducing-kernel-hilbert-space-for-machine-learning-c9a4228136b5"
---


# 커널

머신 러닝(ML)에서 커널 기계는 SVM과 같은 선형 분류기를 사용하여 비선형 문제를 해결합니다. 이를 위해 커널 함수를 활용하여 데이터를 더 높은 차원의 공간으로 암시적으로 매핑하여 선형으로 분리할 수 있습니다.

X를 비어 있지 않은 집합이라고 하고, 커널 k가 다음과 같이 정의됩니다:

![커널 함수](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_0.png)

<div class="content-ad"></div>

위 정의에 따르면, 커널 함수 k: X x X → ℝ은 데이터 포인트 x와 x' 사이의 유사성을 측정합니다. k가 유효한 커널이 되려면, k(x, x') = ⟨φ(x), φ(x')⟩ 조건을 만족해야 합니다. 여기서 φ는 입력 공간 X에서 특징 공간 H로의 매핑이며, ⟨・ ,・⟩는 힐베르트 공간 H에서의 내적을 나타냅니다. 이는 커널 값이 특징 공간에서 데이터 포인트의 표현의 내적과 동일함을 의미합니다.

하지만, 다른 많은 머신 러닝 알고리즘과 달리 입력 데이터를 특징 벡터로 명시적으로 변환해야 하는 기능 맵을 사용하지 않고, 커널 방법은 사용자가 지정한 커널 함수를 통해 직접 유사성을 계산합니다. 이 커널 함수는 잠재적으로 무한 차원의 고차원 특징 공간에서 작동하더라도, 커널 트릭을 통해 특징 표현을 명시적으로 계산하는 것을 피할 수 있습니다. 이 기술은 이러한 계산에 수반되는 상당한 계산 비용을 피할 수 있도록 도와줍니다. 이러한 암묵적 작업을 통해 커널 방법은 복잡한 데이터 관계를 효율적으로 분석하고, 효과적인 패턴 인식 및 분석을 용이하게 합니다.

## 함수 공간

함수 분석에서, f (・)는 함수 자체를 나타내며, f(x)는 입력 x에서 함수가 취하는 특정 값을 나타냅니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_1.png" />

입력 x를 사용하는 함수 f를 고려해 봅시다. 여기서 x는 (x₁, x₂)로 정의된 벡터입니다.

<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_2.png" />

함수 f(・)는 ℝ²를 ℝ에 매핑하는 함수 공간의 원소입니다. 이 예제에서는 이 함수 공간에서 f(・)를 ℝ³로 표현할 수 있습니다.


<div class="content-ad"></div>


![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_3.png)

Given the function

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_4.png)

The linear functional f can be represented as:


<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_5.png" />

보통 임의의 함수는 피처 𝜙(𝑥)의 선형 조합으로 나타낼 수 있습니다. x에서 f를 평가하는 𝑓(𝑥)는 피처 공간에서의 내적입니다:

<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_6.png" />

예를 들어, x = (-1, 4)에서 평가된 f는


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_7.png)

## 무한 차원의 특성 공간

이 개념은 자연스럽게 무한 차원의 특성 공간으로 확장됩니다. 예를 들어, 우리는 지수 함수 eˣ를 이용하여 그의 테일러 급수 표현을 확장할 수 있습니다.

![이미지](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_8.png)


<div class="content-ad"></div>

그리고 e³가 되면

![Image 1](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_9.png)

여기서 피처 공간은 무한한 차원에 있습니다.

![Image 2](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_10.png)

<div class="content-ad"></div>

# 평가 기능

평가 기능은 함수를 입력으로 받아 스칼라(하나의 숫자)를 출력으로 생성하는 특별한 유형의 함수입니다. 좀 더 간단히 말하면, 일반적인 함수가 숫자를 숫자로(또는 벡터를 벡터로) 매핑하는 반면, 함수적으로는 함수를 숫자로 매핑합니다.

X의 x에서의 평가 기능 L은 다음과 같이 정의됩니다.


<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_11.png" />


<div class="content-ad"></div>

이 정의는 𝐿이 x에 의해 매개변수화된 함수로, 입력으로 함수 f를 사용하고 실수 ℝ을 생성하는 기능입니다.

선형 함수는 아래와 같이 벡터 덧셈 및 스칼라 곱셈 연산을 보존하는 기능입니다:

![이미지](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_12.png)

# 이중 공간

<div class="content-ad"></div>

벡터 공간 V의 쌍대 공간은 V 상의 모든 선형 함수인 집합입니다.

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_13.png)

친숙한 3차원 공간을 고려해보겠어요. ℝ³로 표시되며, 각 점은 세 가지 구성 요소 (x, y, z)를 가진 벡터로 나타낼 수 있어요. 이것이 바로 우리의 원래 벡터 공간 V에요. ℝ³에서의 선형 함수는 3차원 벡터를 입력으로 받아 하나의 실수를 출력하는 선형 매핑입니다. 예를 들어, 선형 함수는 다음과 같이 정의될 수 있어요: f(x, y, z) = 2x + 3y + 4z. ℝ³의 쌍대 공간인 V*는 ℝ³에서의 모든 가능한 선형 함수의 집합이에요. 이 쌍대 공간의 각 함수는 3차원 벡터로 고유하게 표현될 수 있어요. 예를 들어, 함수 f(x, y, z) = 2x + 3y + 4z는 벡터 (2, 3, 4)로 나타낼 수 있어요.

# Riesz Representation Theorem

<div class="content-ad"></div>

리즈 표현 정리는 힐버트 공간에서의 모든 연속 선형 함수 L이 F의 고정된 요소와의 내적으로 표현될 수 있다는 것을 명시합니다. 공식적으로, 힐버트 공간 F에서 어떤 연속 선형 함수 𝐿에 대해,


![리즈 표현 정리](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_14.png)


리즈 표현 정리는 선형 함수의 추상적 세계를 보다 익숙한 내적 개념으로 이어주어, 선형 함수를 내적의 기하학적 직관을 사용해 이해하고 조작할 수 있게 합니다. 본질적으로, 리즈 표현 정리는 힐버트 공간 H의 모든 연속 선형 함수에 대해, 그 함수를 완전히 나타내는 동일한 H 내의 고유 요소가 존재함을 명시합니다. 이는 선형 함수를 고정된 "대표" 벡터와의 내적으로 생각할 수 있다는 것을 의미합니다. 이는 힐버트 공간에서 선형 함수와 내적 사이의 근본적인 연결을 확립합니다. 복제 커널 힐버트 공간(RKHS)의 맥락에서, 이 개념은 함수의 평가가 커널 함수와의 내적을 사용하여 계산될 수 있음을 보여주기 위해 확장됩니다.

# 복제 커널


<div class="content-ad"></div>

평가 기능과 Riesz 표현 정리를 결합하면 다음을 얻을 수 있습니다:

![식 15](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_15.png)

어떤 함수 f ∈ F가 x에서 평가되면 f를 F 내의 고유 기능 kₓ와의 내적으로 표현할 수 있습니다. 여기서 kₓ는 다음과 같이 쓸 수 있습니다:

![식 16](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_16.png)

<div class="content-ad"></div>

테이블 태그를 마크다운 형식으로 변경해보세요.

<div class="content-ad"></div>

이것은 결국 커널의 개념으로 돌아가게 됩니다.

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_19.png)

요약하면, 평가 기능 Lₓ는 k( ⋅ , x )로 표현할 수 있습니다.

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_20.png)

<div class="content-ad"></div>

내부 곱으로 이를 계산할 수 있습니다. 이 함수는 Hilbert 공간 𝐻의 커널 함수와의 내적으로 계산됩니다. 함수 𝑘(⋅, 𝑥) 또는 kₓ는 재생 커널로 불립니다.

그러므로,

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_21.png)

여기에 사용된 표기법은 모두 동일한 객체를 가리킵니다:

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_22.png)

# 복제 커널 힐버트 공간 (RKHS)

복제 커널 힐버트 공간(RKHS)은 각 지점에서의 평가가 연속 선형 기능적인 함수들의 힐버트 공간입니다. 이는 공간 안의 임의의 함수 f와 임의의 점 𝑥에 대해 𝑓(𝑥) = ⟨𝑓,𝑘(⋅, 𝑥)⟩가 성립하는 커널 함수 k가 존재한다는 의미입니다. 커널 함수 𝑘(⋅,𝑥)는 복제 커널로 알려져 있으며, 함수와 특징 공간 간의 다리 역할을 하여 함수를 특정 지점에서 평가할 수 있게 합니다.

본질적으로, f(x)는 f와 복제 커널 함수 k(⋅, x)의 내적으로 나타낼 수 있습니다. 함수 k(⋅, x)는 복제 커널이라고 불립니다. 개념적으로, 평가 함수는 f와 x의 특징 공간 표현의 내적으로 계산할 수 있습니다.

<div class="content-ad"></div>

# 예시

푸리에 변환은 다음과 같은 형태를 가지고 있습니다.

<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_23.png" />

놀랍게도, 우리가 커널의 재현 특성을 논의할 때에도 똑같은 형태를 가지고 있습니다.

<div class="content-ad"></div>


![Reproducing Kernel Hilbert Space for Machine Learning](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_24.png)

Functional analysis has traditionally been utilized to examine the characteristics of transformational functions like the Fourier transform. To demonstrate this, let's take a look at an aperiodic pulse function.

![Aperiodic Pulse Function](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_25.png)

The Fourier transform of the aperiodic pulse function 𝑓(𝑥) is:


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_26.png)

예를 들어,

![이미지](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_27.png)

아래 예시에서 우리는 함수(1, cos(𝑥), cos(2𝑥), cos(3𝑥), ...)를 기저로 사용하여 계단 함수를 나타냅니다.


<div class="content-ad"></div>

아래는 코싸인 함수로 특징 공간에 나타낸 특징들을 보여줍니다. 이것이 우리가 왜 함수를 사용하여 특징 공간을 모델링할 수 있는지 효과적으로 보여줍니다.

# 무한 차원 RKHS

두 번째 예제에서는 가우시안 함수로 구성된 특징 공간을 설명하겠습니다. 아래 f(x)를 고려해보세요.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_29.png" />

'𝑓(𝑥)'가 어떻게 커널 'k'를 복제하는지 알아봅시다.

<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_30.png" />

이를 위해 '𝑓(𝑥)'를 특정 포인트의 커널들의 선형 결합으로 표현합니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_31.png" />

이 예시에서는 가우시안 커널을 사용할 것입니다. 이 커널은 다음과 같이 정의됩니다:

<img src="/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_32.png" />

우리는 𝑓(𝑥)를 k(・, xᵢ)의 선형 조합으로 표현할 것입니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_33.png)

이 과정에서는 가우시안 커널을 직접적으로 다룹니다. 아래의 함수 f는 다음으로 구성됩니다:

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_34.png)

![image](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_35.png)

<div class="content-ad"></div>

![2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_36](/assets/img/2024-06-19-ReproducingKernelHilbertSpaceforMachineLearning_36.png)