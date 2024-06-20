---
title: "장기 단기 메모리 LSTM  RNN 개선하기"
description: ""
coverImage: "/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_0.png"
date: 2024-06-19 18:53
ogImage: 
  url: /assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_0.png
tag: Tech
originalTitle: "Long Short Term Memory (LSTM)— Improving RNNs"
link: "https://medium.com/towards-data-science/long-short-term-memory-lstm-improving-rnns-40323d1c05f8"
---



![그림](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_0.png)

이 글에서는 Long-Short-Term Memory Networks (LSTM)에 대해 소개하겠습니다. 이는 일반적인 바닐라 순환 신경망(RNN)의 변형으로서 장기 의존성을 처리하는 데 능숙합니다.

이들은 의사결정에 필요하거나 중요하지 않다고 판단되는 특정 정보를 기억하거나 잊는 서로 다른 "게이트"를 사용합니다.

LSTM은 RNN의 최신 버전으로, 산업 내에서 폭넓게 사용되며 우리가 오늘날 보는 모든 멋진 대형 언어 모델 (LLMs)의 기반이 됩니다.


<div class="content-ad"></div>

RNN 개요

Recurrent Neural Networks(RNN)은 일반적인 피드포워드 신경망의 변형으로, 자연어나 시계열 데이터와 같은 순차 데이터를 더 잘 처리할 수 있도록 합니다.

이는 이전 입력과 출력을 다음 레이어로 전달하는 숨겨진 순환 뉴런을 가지고 수행됩니다. 아래는 예시입니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_1.png)

네트워크를 통해 전달되는 벡터 h를 주목해보세요. 이것이 순환 신경망(RNNs) 뒤에 숨겨진 주요 기능인 은닉 상태입니다. 이것이 시퀀스 데이터에 대해 잘 작동하는 이유입니다.

은닉 상태는 이전에 계산된 은닉 상태와 해당 시간 단계에서의 새 입력을 결합합니다. 그런 다음 해당 시간 단계의 최종 출력을 계산하기 위해 시그모이드 활성화 함수가 적용됩니다. 수학적으로 표현하면:

![image](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_2.png)


<div class="content-ad"></div>

아래에서:

- Y: 출력 벡터
- X: 기능의 입력 벡터
- h: 숨겨진 상태
- V: 출력을 위한 가중 행렬
- U: 입력을 위한 가중 행렬
- W: 숨겨진 상태를 위한 가중 행렬

V, U 및 W의 가중 행렬은 시간에 걸쳐 백프로파게이션을 통해 찾아집니다. 이는 백프로파게이션 알고리즘의 한 변형에 불과합니다.
시각적으로는 이렇게 보입니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_3.png)

For example, when predicting Y_1, the RNN would use the inputs of X_1 plus the output from the previous time step from Y_0. As Y_0 influences Y_1, we can then see that Y_0 will also indirectly influence Y_2, demonstrating the recurrent nature.

If you want a full intro to RNNs then check out my previous blog.

# Vanishing & Exploding Problem


<div class="content-ad"></div>

RNN의 긍정적인 측면 중 하나는 각 계층이 U, W 및 V의 가중 행렬을 공유하지만, 정규 피드포워드 신경망은 각 계층마다 자체 가중 행렬을 갖는다는 것입니다. 이로 인해 RNN은 더 메모리를 효율적으로 사용할 수 있습니다.

그러나 이 가중 행렬 공유는 그들의 중요한 결함 중 하나인 사라지는 그래디언트와 폭주하는 그래디언트 문제를 야기합니다.

RNN은 backpropagation through time (BPTT)라는 backpropagation 알고리즘의 변형을 사용하여 학습합니다. 이 알고리즘은 일반적인 backpropagation과 유사하지만, 각 시간 단계에서 업데이트해야 하는 계층 간의 공유 가중 행렬로 인해 더 '중첩된' 계산이 필요합니다.

BPTT의 일반적인 공식은 다음과 같습니다:

<div class="content-ad"></div>


![image 1](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_4.png)

RNN에서 J는 임의의 가중치 행렬이며 U, W 또는 V일 수 있으며 E는 총 오차입니다.

RNN은 일반적인 신경망보다 더 깊은 경향이 있습니다(각 시간 단계는 하나의 레이어입니다). 따라서 그래디언트가 1보다 작거나 큰 경우에는 역방향으로 전파될 때 그래디언트가 소멸되거나 폭발될 수 있습니다.

![image 2](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_5.png)


<div class="content-ad"></div>

관심 있는 독자를 위해, 왜 이런 일이 발생하는지의 수학적인 전체 분석은 여기서 찾을 수 있어요. 이것은 고유값과 야코비안 행렬과 같은 재미있는 것들이 관련돼 있습니다!

만약 역전파를 통한 시간 알고리즘 (BTTP)과 그라디언트가 사라지거나 폭발하는 문제의 전체적인 분석을 원한다면, 제 이전 게시물을 확인해보세요.

사라지는 그라디언트와 폭발하는 그라디언트 문제를 잘 보여주는 좋은 예시는 Stanford의 CS224D 수업에서 제시되었습니다. 두 개의 문장을 생각해보세요:

- "제인이 방으로 들어갔어요. 존도 들어왔어요. 제인이 ___에게 안녕했어요."
- "제인이 방으로 들어갔어요. 존도 들어왔어요. 늦었고, 모두가 긴 하루 일과를 마치고 집으로 향했어요. 제인이 ___에게 안녕했어요."

<div class="content-ad"></div>

어떤 경우에도 빈 공간은 아마도 존을 가리키는 것입니다. RNN은 이 맥락을 학습하여 두 문장 모두 출력이 존임을 이해해야 합니다.

그러나 실험 결과, 문장 1이 문장 2보다 정확하게 예측되는 경향이 있었습니다. 이는 문장 2에서 그래디언트가 소멸되어 예측을 할 때 먼 맥락을 효율적으로 인식하지 못하기 때문입니다.

이것은 분명히 문제입니다. RNN은 이와 같은 시나리오에 대한 "기억"을 갖도록 설계되었기 때문입니다.

그래서, 이 문제에 대해 어떻게 해결할까요?

<div class="content-ad"></div>

# 롱-숏텀 메모리

## 개요

LSTMs는 1997년 Hochreiter & Schmidhuber에 의해 소개되었으며, 그 기본 아이디어는 순환 셀 내부에 "게이트"가 있다는 것입니다. 이러한 게이트는 순환 셀이 장기 기억을 구축할 때 무엇을 기억하고 잊어야 하는지를 제어합니다.

일반적인 RNN에서는 순환 셀이 다음과 같이 보입니다:


|  Table  |  Tag   |
|---------|--------|


<div class="content-ad"></div>


![Long Short Term Memory - LSTM Improving RNNs](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_6.png)

However, the LSTM cell is a lot more complicated:

![LSTM Cell](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_7.png)

I appreciate there is a lot going on here, but lets break it down step by step.


<div class="content-ad"></div>

## 셀 상태

핵심적인 차이 중 하나는 셀 상태 C의 도입입니다. 이 셀 상태에는 컨텍스트 및 과거 패턴과 같이 기본적인 정보가 포함되어 있습니다. 바로 메모리입니다. 이 셀 상태는 셀을 통과하며 선형 상호 작용을 하는 여러 개의 게이트에 의해 조정될 수 있습니다.

셀 상태와 은닉 상태를 혼동하기 쉽지만, 일반적으로 셀 상태는 네트워크의 전체 메모리를 포함하도록 설계되었으며, 은닉 상태는 단기 의존성을 위해 사용되고 실제로 최근 정보만을 가지고 있습니다. 또한 예측을 위해 셀의 출력에 사용됩니다.

## 잊기 게이트

<div class="content-ad"></div>

LSTM의 첫 번째 단계는 forget gate입니다. 이 게이트는 이전 셀 상태 C_'t-1'에서 어떤 이전 정보를 삭제할지 결정하는 역할을 합니다.

![이미지](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_8.png)

여기서:

- σ: 시그모이드 활성화 함수.
- W_f: forget gate의 가중치 행렬.
- h_'t−1': 이전 시간 단계의 출력.
- x_t: 시간 단계 t의 입력.
- b_f: forget gate의 편향.
- f_t: 0과 1 사이의 값을 가지는 forget gate 출력.
- X_t: 현재 입력.

<div class="content-ad"></div>

출력 f_t는 이전 셀 상태 C_'t-1'에 곱해져 어떤 요소를 잊어야 하는지 수정합니다. 시그모이드 함수 덕분에 값은 0과 1 사이에 있으며, 0은 잊기를 의미하고 1은 기억에 추가됩니다.

W_f 행렬에서 올바른 값을 찾아 역전파를 통해 이 정보를 학습합니다. 이를 통해 우리는 기억할지 잊을지를 결정할 수 있습니다.

## 입력 게이트 및 후보 셀 상태

입력 게이트 i_t는 다음 단계이지만 현재 시간 단계에서 셀 상태에 추가할 새로운 기억을 결정합니다. 후보 셀 상태 C*_t는 셀 상태에 추가할 가능한 모든 정보를 보유합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_9.png)

Where:

- σ: 시그모이드 활성화 함수.
- tanh⁡: 쌍곡 탄젠트 활성화 함수.
- W_i: 입력 게이트용 가중치 행렬.
- W_c: 후보 셀 상태용 가중치 행렬.
- b_i: 입력 게이트용 편향
- b_c: 후보 셀 상태용 편향.
- C*_t: 후보 셀 상태, -1과 1 사이의 출력 값.
- i_t: 0과 1 사이의 입력 게이트 출력.
- h_'t-1': 이전 숨은 상태.
- X_t: 현재 입력.

tanh을 사용하면 셀 상태를 증가시키거나 감소시킬 수 있습니다. tanh는 출력을 -1과 1 사이로 압축하기 때문입니다. 시그모이드는 기억에 새로운 것을 추가하기 위해 이전 게이트와 유사한 이유로 사용됩니다.


<div class="content-ad"></div>

입력 게이트는 특히 이전 셀 상태C_'t-1'입니다.

## 셀 상태 업데이트

우리는 후보 셀 상태 C*_t 에서 새로운 셀 상태 C_t로 관련 정보만 추가하려고 합니다. 이를 위해 후보 셀 상태를 입력 게이트 i_t 와 곱하고 이를 잊어버린 게이트 f_t 와 이전 셀 상태 C_'t-1' 의 곱과 더할 수 있습니다.

![image](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_10.png)

<div class="content-ad"></div>

모든 작업은 좀 더 친숙한 느낌을 주려고 세포 상태를 갱신했습니다. 관련 없는 정보는 잊어버리고 필요한 새로운 정보를 추가했어요.

## 출력 게이트

마지막 단계는 셀에서 어떤 것을 예측으로 출력할지 결정하는 것이었지요. 먼저 출력 게이트 o_t를 계산하고, 이는 우리가 출력할 셀 상태의 어느 부분을 결정하는데 사용됩니다. 이는 기본적으로 일반 RNN의 일반적인 숨겨진 상태 반복 셀과 비슷한 역할을 해요.

그 출력값은 새로운 셀 상태의 tanh 값과 곱해져서 원하는 값만을 출력합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-LongShortTermMemoryLSTMImprovingRNNs_11.png)

Where:

- σ: 시그모이드 함수.
- tanh: 쌍곡선 탄젠트 활성화 함수.
- W_o: 가중치 행렬.
- b_o: 편향.
- o_t: 출력 상태.
- h_t: 새로운 은닉 상태.
- h_'t-1': 이전 은닉 상태.
- X_t: 현재 입력.
- C_t: 새로운 셀 상태.

그게 전부에요! 언급할 중요한 점은 모든 가중치 행렬이 BPTT를 사용하여 어떤 요소를 잊고 기억할지 학습해야 한다는 것입니다.


<div class="content-ad"></div>

# 변형

이것은 표준 LSTM일 뿐이고 다른 변형들이 있습니다. 그중 가장 흔한 것은 다음과 같습니다:

- 양방향
- 합성곱
- 쌓인
- 청구 접속
- 게이트 순환 유닛

이 글에서 이러한 모두를 다루는 것은 범위를 벗어나지만, 관심 있는 독자는 위에 제공된 링크에서 자세히 알아볼 수 있습니다. 다음 글에서는 게이트 순환 유닛에 대해 다룰 예정입니다.

<div class="content-ad"></div>

# 요약 및 더 깊은 생각

LSTMs는 처음에는 무서워 보일 수 있지만, 이 글을 통해 조금 더 친숙해졌으면 좋겠어요! 다양한 계산이 있지만, 이 모든 것들은 매우 유사합니다. 잊어버릴 것을 결정하는 forget gate와 기억에 추가할 새로운 정보를 결정하는 input gate 두 가지 기본 구성 요소가 있습니다. LSTMs의 장점은 이러한 gate들 덕분에 장기 기억력이 더 나은 것입니다.

# 추가로!

저는 '데이터 소스 공유', 매주 공유하는 더 나은 데이터 과학자가 되는 팁, 업계에서의 일반적인 경험, 지난 주에 한 생각들을 나누는 무료 뉴스레터를 운영하고 있어요.

<div class="content-ad"></div>

# 나와 소통해요!

- 링크드인, 트위터, 또는 인스타그램에서 연락해요.
- 내 YouTube 채널에서는 기술적인 데이터 과학과 머신러닝 개념을 배우세요!

# 참고 자료

- LSTM에 대한 훌륭한 블로그 포스트
- 스탠포드 RNN 체트시트
- Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 2nd Edition. Aurélien Géron. 2019년 9월. 출판사: O'Reilly Media, Inc. ISBN: 9781492032649.