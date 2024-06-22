---
title: "깊게 배우는 딥러닝 일러스트, Part 5 LSTM Long Short-Term Memory 이해하기"
description: ""
coverImage: "/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_0.png"
date: 2024-06-22 19:49
ogImage: 
  url: /assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_0.png
tag: Tech
originalTitle: "Deep Learning Illustrated, Part 5: Long Short-Term Memory (LSTM)"
link: "https://medium.com/towards-data-science/deep-learning-illustrated-part-5-long-short-term-memory-lstm-d379fbbc9bc6"
---


우리의 색다른 신경망 Deep Learning 여정의 제5 부분에 오신 것을 환영합니다!

오늘은 일반적인 순환 신경망(RNN)을 업그레이드한 Long Short-Term Memory(LSTM)에 대해 이야기할 것입니다. 이전 글에서 다룬 RNN은 순차 기반 문제를 해결하는 데 사용되지만 멀리 떨어진 정보를 기억하는 데 어려움을 겪어 단기 기억 문제가 발생합니다. 여기에서 LSTM이 등장하여 해결책을 제시합니다. LSTM은 RNN의 순환적 측면을 사용하지만 약간의 차별성을 갖고 있습니다. 이렇게 어떻게 이루어지는지 함께 알아보겠습니다.

추신 — 이 글은 제가 쓴 중에서 제일 좋아하는 글 중 하나이니 이 여정을 함께 할 수 있는 것을 기다리지 않을 수가 없어요!

먼저, 이전에 우리 RNN에서 무슨 일이 벌어지고 있었나 살펴보겠습니다. 우리는 입력 x와 하나의 은닉층이 있었는데, 이 은닉층은 tanh 활성화 함수를 가진 뉴런 하나로 이루어져 있었으며, 출력 뉴런은 시그모이드 활성화 함수를 가지고 있었습니다. 그래서 RNN의 첫 번째 단계는 이렇게 보입니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_0.png)

Here, we first pass our first input, x₁, to the hidden neuron to get h₁.

![image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_1.png)

From here we have two options:


<div class="content-ad"></div>

(option 1) 이 h₁를 출력 뉴런에 전달하여 이 하나의 입력만 사용하여 예측을 얻을 수 있습니다. 수학적으로:

![image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_2.png)

(option 2) 다음 숨겨진 상태로 이 h₁를 전달함으로써, 이 값을 다음 네트워크의 숨겨진 뉴런으로 전달합니다.

그렇게 되면 두 번째 숨겨진 상태는 다음과 같이 보일 것입니다:

<div class="content-ad"></div>


![Deep Learning Illustrated Part 5](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_3.png)

첫 번째 네트워크의 숨겨진 뉴런에서 출력을 가져와 현재 네트워크의 두 번째 입력 x₂와 함께 전달합니다. 이렇게 함으로써 두 번째 숨겨진 레이어 출력 h₂를 얻을 수 있습니다.

![Deep Learning Illustrated Part 5](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_4.png)

여기서 h₂로 두 가지 작업을 수행할 수 있습니다:


<div class="content-ad"></div>

(option 1) 첫 번째 x₁와 두 번째 x₂의 결과인 예측을 얻기 위해 출력 뉴런에 전달합니다.

![image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_5.png)

(option 2) 또는 그대로 다음 네트워크로 전달할 수도 있습니다.

그리고 이 프로세스는 계속됩니다. 각 상태는 이전 네트워크의 숨겨진 뉴런에서(새 입력과 함께) 출력을 가져와 현재 상태의 숨겨진 뉴런에 전달하면서 현재 숨겨진 레이어의 출력을 생성합니다. 이 출력을 다음 네트워크로 전달하거나 출력 뉴런에 전달하여 예측을 생산할 수 있습니다.

<div class="content-ad"></div>

아래의 핵심 방정식들로 이 프로세스 전체를 포착할 수 있습니다:

![equations](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_6.png)

간단함에도 불구하고, 이 방법론에는 제한이 있습니다: 우리가 마지막 단계로 나아감에 따라, 초기 단계에서의 정보가 사라지기 시작하며, 네트워크가 많은 정보를 유지하지 못하기 때문입니다. 입력 순서가 클수록 이 문제가 더욱 두드러집니다. 분명히, 이 기억을 향상시키기 위한 전략이 필요합니다.

## LSTMs의 등장

<div class="content-ad"></div>

그들은 각 단계마다 입력과 이전 단계에서 불필요한 정보를 버리면서 간단하고 효과적인 전략을 구현하여 이를 달성합니다. 이를 통해 중요하지 않은 정보는 잊고 중요한 정보만 보존함으로써 동작합니다. 우리 뇌가 정보를 처리하는 방식과 비슷합니다. 우리는 모든 세부 사항을 기억하지 않고 필요한 세부 정보만 기억하고 나머지는 버립니다.

## LSTM 아키텍처

기본 RNN의 hidden state를 고려해보세요.

![LSTM](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_7.png)

<div class="content-ad"></div>

각 상태는 두 개의 플레이어로 시작합니다: 이전 숨겨진 상태 값 hₜ₋₁과 현재 입력 xₜ입니다. 그리고 최종 목표는 숨겨진 상태 출력 hₜ를 생성하는 것인데, 이는 다음 숨겨진 상태로 전달되거나 출력 뉴런에 전달되어 예측을 생성할 수 있습니다.

LSTM은 약간 복잡성이 증가한 유사한 구조를 가지고 있습니다.

이 다이어그램은 처음에는 복잡해 보일 수 있지만 실제로 직관적입니다. 천천히 이해해 보겠습니다.

RNN에는 두 명의 플레이어가 있어서 숨겨진 상태 출력을 생성하는 최종 목표가 있었습니다. 이제 LSTM에는 세 명의 플레이어가 처음에 있으며, 이전 장기 기억 Cₜ₋₁, 이전 숨겨진 상태 출력 hₜ₋₁ 및 입력 xₜ가 LSTM에 입력됩니다.

<div class="content-ad"></div>

최종 목표는 두 가지 출력물 — 새로운 장기 기억 Cₜ와 새로운 은닉 상태 출력 hₜ을 만드는 것입니다:

LSTM의 주요 목표는 필요 없는 정보를 최대한 버리는 것이며, 이는 세 부분에서 구현됩니다 —

i) 잊기 부분

ii) 입력 부분

<div class="content-ad"></div>

iii) 그리고 출력 섹션

우리는 그들이 모두 공통적으로 보라색 셀을 가지고 있다는 것을 알 수 있습니다:

이러한 셀을 '게이트'라고 합니다. LSTM은 어떤 정보가 중요한지 아닌지를 결정하기 위해 시그모이드 활성화 함수를 사용하는 뉴런인 게이트를 활용합니다.

![이미지](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_8.png)

<div class="content-ad"></div>

이러한 게이트들은 각자의 부분에 정보를 유지할 비율을 결정하고, 그들이 통과시킬 정보의 비율을 제한함으로써 효과적으로 문지기 역할을 합니다.

이러한 맥락에서 시그모이드 함수를 사용하는 것은 전략적입니다. 이 함수는 0에서 1까지의 값을 출력하여 보관하려는 정보의 비율에 직접 대응됩니다. 예를 들어, 값이 1이면 모든 정보가 보존되고, 0.5면 정보의 절반만 유지되며, 값이 0이면 모든 정보가 버려집니다.

이제 이러한 게이트들에 대한 공식을 살펴보겠습니다. 은닉 상태 다이어그램을 자세히 살펴보면 모두 동일한 입력인 xₜ와 hₜ₋₁을 가지고 있지만, 다른 가중치와 편향 용어를 가지고 있습니다.

모두 동일한 수학적 공식을 가지고 있지만, 가중치와 편향 값을 적절히 교체해주어야 합니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_9.png)

각각의 이것들은 시그모이드 함수가 작동하는 방식이기 때문에 0과 1 사이의 값을 생성할 것입니다. 이 값은 우리가 각 섹션에서 유지하려는 특정 정보의 비율을 결정합니다.

## Forget 섹션

이 섹션의 주요 목적은 장기 기억의 어느 정도를 잊을지 판단하는 것입니다. 따라서 여기서 우리가 하는 일은 간단히 말해서 forget gate로부터 이 비율(0~1의 값)를 가져오는 것뿐입니다.


<div class="content-ad"></div>


![Deep Learning Illustrated Part 5 LSTM 10 Image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_10.png)

...and multiplying that with the previous long-term memory:

![Deep Learning Illustrated Part 5 LSTM 11 Image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_11.png)

This product gives us the exact previous long-term memory that the forget gate thinks is important and forgets the rest. So the closer the forget gate proportion, fₜ, is to 1, the more of the previous long-term memory we’re going to retain.


<div class="content-ad"></div>

![Image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_12.png)

## 입력 섹션

이 섹션의 주요 목적은 새로운 장기 기억을 만드는 것이며, 이를 2단계로 수행합니다.

(단계 1) 새로운 장기 기억을 위한 후보인 C(tilda)ₜ를 생성합니다. 이 신경원은 하이퍼볼릭 탄젠트 활성화 함수를 사용하여 이 새로운 장기 기억 후보를 얻습니다:

<div class="content-ad"></div>

여기서 볼 수 있듯이이 뉴런의 입력은 게이트와 유사하게 xₜ 및 hₜ₋₁입니다. 그래서 이를 뉴런을 통과시키면...

![image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_13.png)

...우리는 새로운 장기 기억을 위한 후보인 출력을 얻습니다.

이제 우리는 그 후보에서 필요한 정보만 유지하고 싶습니다. 이것이 입력 게이트가 작용하는 곳입니다. 우리는 입력 게이트에서 얻은 비율을 사용합니다...

<div class="content-ad"></div>


![DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_14](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_14.png)

…필요한 데이터만 유지하기 위해 입력 게이트 비율과 후보 사이의 곱을 통해 후보를 구합니다:

![DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_15](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_15.png)

(단계 2) 이제 최종 장기 기억을 얻기 위해 우리는 잊기 섹션에 유지하기로 결정한 이전 장기 기억을 가져옵니다…


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_16.png)

…그리고 이 입력 섹션에 유지하기로 결정한 새 후보의 양을 추가하십시오:

![이미지](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_17.png)

그리고 와! 우리는 게임의 미션 1을 완수했습니다. 새로운 장기 기억을 만들었습니다! 이제 새로운 숨겨진 상태 출력을 생성해야 합니다.


<div class="content-ad"></div>

## 출력 섹션

이 섹션의 주요 목적은 새로운 숨겨진 상태 출력을 만드는 것입니다. 이것은 꽤 간단합니다. 여기서 하는 일은 새로운 장기 기억인 Cₜ를 tanh 함수를 통과시키는 것뿐입니다...

![이미지](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_18.png)

...그리고 출력 게이트 비율과 곱하는 것입니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_19.png)

새로운 숨겨진 상태 출력이 생성됩니다!

그렇게해서 미션 2를 완료했어요 — 새로운 숨겨진 상태 출력을 생성했어요!

이제 우리는 이러한 새로운 출력을 다음 숨겨진 상태로 전달하여 동일한 프로세스를 계속 반복할 수 있어요.

<div class="content-ad"></div>

우리는 각 hidden state가 output neuron을 가지고 있는 것을 확인할 수 있습니다:

RNN과 마찬가지로 이러한 각 상태는 자체 개별적인 출력을 생성할 수 있습니다. 그리고 RNN과 유사하게, 우리는 hidden state의 출력인 hₜ를 사용하여 예측을 생성합니다. 따라서 hₜ를 output neuron에 전송하면...

![image](/assets/img/2024-06-22-DeepLearningIllustratedPart5LongShort-TermMemoryLSTM_20.png)

...우리는 이 hidden state에 대한 예측을 얻습니다!

<div class="content-ad"></div>

그리고 이로써 마무리 지을게요. 우리가 본 것처럼, LSTM은 순차 데이터에서 장기 의존성을 더 잘 다루어 RNN을 끌어올립니다. 우리는 LSTM이 핵심 정보를 유지하고 관련 없는 정보를 버리는 독특한 방식을 보았는데, 이는 우리 뇌가 하는 것과 유사합니다. 확장된 시퀀스에서 중요한 세부 정보를 기억하는 이 능력으로 LSTM은 자연어 처리, 음성 인식 및 시계열 예측과 같은 작업에 특히 강력합니다.