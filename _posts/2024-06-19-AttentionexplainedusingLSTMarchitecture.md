---
title: "LSTM 구조를 사용하여 설명하는 어텐션"
description: ""
coverImage: "/assets/img/2024-06-19-AttentionexplainedusingLSTMarchitecture_0.png"
date: 2024-06-19 02:58
ogImage: 
  url: /assets/img/2024-06-19-AttentionexplainedusingLSTMarchitecture_0.png
tag: Tech
originalTitle: "Attention explained using LSTM architecture"
link: "https://medium.com/@shreya.verma.ananya/attention-explained-using-lstm-architecture-afbd83c90e2d"
---


![이미지](/assets/img/2024-06-19-AttentionexplainedusingLSTMarchitecture_0.png)

NLP 엔지니어로서 자주 들어본 말 중 하나가 'Attention(주의)!‘입니다. 트랜스포머(Transformer)와 GPT에 대해 배우기 시작한 사람들에게는 혼란스러울 수 있습니다. 그러나 기계가 보다 긴 시퀀스에서도 맥락 정보를 유지하는 방법을 알아야 합니다. 

이 블로그에서는 먼저 LSTM이 무엇인지, 그 단점들은 무엇이었는지, 그리고 어떻게 attention 메커니즘이 이를 극복하는 데 도움이 되었는지 알아보겠습니다.

# Attention이 필요한 이유?

<div class="content-ad"></div>


신경망 기술인 트랜스포머가 등장하기 전에 사용되던 기본 빌딩 블록은 인코더-디코더 LSTM 아키텍처였어요.

LSTM 아키텍처는 주로 3개의 게이트로 구성돼 있어요. 각 게이트는 셀 상태로의 정보 흐름을 제어하는 역할을 합니다. 각 게이트와 그 기능에 대한 간단한 개요는 다음과 같아요:

- 입력 게이트: 현재 입력에서 얼마나 많은 새로운 정보가 셀 상태에 추가돼야 하는지를 제어합니다. 현재 입력과 이전 숨겨진 상태를 가져와서 시그모이드 활성화 함수를 통과시켜 0과 1 사이의 값을 생성하고, 이 값을 현재 입력과 이전 숨겨진 상태를 통과시켜 생성된 후보 셀 상태에 곱해줍니다(이 값은 tanh 활성화 함수를 거칩니다).
- 잊기 게이트: 이전 셀 상태 중 어느 부분을 유지하거나 잊을지를 결정합니다. 이전 숨겨진 상태와 현재 입력을 가져와서 시그모이드 활성화 함수를 통과시킵니다. 0과 1 사이의 결과값을 얻어 이전 셀 상태에 곱해줍니다. 이는 이전 셀 상태를 얼마나 유지할지를 결정합니다.
- 출력 게이트: LSTM 셀의 출력과 다음 숨겨진 상태에 노출돼야 하는 셀 상태 얼마나 많은지를 결정합니다. 현재 입력과 이전 숨겨진 상태를 가져와서 시그모이드 활성화 함수를 통과시킵니다. 이 값은 현재 셀 상태의 tanh 값에 곱해져 다음 숨겨진 상태를 생성합니다.

![LSTM 아키텍처를 이용한 어텐션](/assets/img/2024-06-19-AttentionexplainedusingLSTMarchitecture_1.png) 


<div class="content-ad"></div>

위 표는 LSTM이 장기 의존성을 효과적으로 포착하기 위해 시간이 지남에 따라 셀 상태를 유지하고 조정할 수 있도록 함께 작동하는 게이트를 보여줍니다. 그러나 위 구조에서 입력의 문맥 길이가 증가하면 LSTM이 이러한 게이트에 모든 필요한 문맥을 저장하는 것이 어려워집니다. 예를 들어, "자주 피우지 마세요, 이것은 당신의 폐에 강력한 영향을 미치고 더 심각한 합병증으로 이어질 것입니다." 라는 문장을 생각해보십시오. 위 문장에서 모델이 "자주"를 잊어버리면 문장 전체의 의미가 변경될 수 있습니다.

그래서 이를 피하기 위해 어텐션(Attention)이 도입되었습니다. 이 기법을 도입한 주된 목적은 디코더가 다음 토큰을 예측할 때 인코더의 각 입력 토큰의 영향을 받도록 하는 것입니다. 이렇게 하면 입력의 문맥 길이에 관계없이 디코더가 모든 단어에 액세스할 수 있습니다. 유사도 점수에 따라 특정 입력 토큰이 다른 것보다 예측에 더 많은 영향을 미치도록 허용됩니다.

# 어텐션은 어떻게 작동하나요?

![LSTM 아키텍처를 사용하여 어텐션이 설명된 그림](/assets/img/2024-06-19-AttentionexplainedusingLSTMarchitecture_2.png)

<div class="content-ad"></div>

위의 아키텍처 다이어그램에서는 영어에서 스페인어로 번역 작업에 인코더-디코더 모델이 사용됩니다. 인코더는 LSTM의 단일 레이어를 사용하며 해당 레이어에 2개의 LSTM 셀이 있습니다. LSTM이 다음 단어를 인코딩할 때, 각 LSTM 레이어에 동일한 가중치와 편향이 사용됩니다. 디코더에는 다른 가중치와 편향 세트가 있습니다. 이 인코더-디코더 아키텍처의 구분은 가변 길이의 입력과 출력을 번역하는 데 도움이 됩니다. 예를 들어, "Let's go"가 "Vamos"로 번역됩니다. 디코더는 'EOS' 토큰에 도달하거나 최대 출력 단어 제한에 도달했을 때 단어 생성을 중지합니다.

인코더에서 나오는 컨텍스트 벡터는 해당 LSTM 레이어의 각 단어인 "let's"와 "go"에 대한 정보를 제공하는 추가 데이터와 함께 디코더로 전달됩니다.

이를 위해 LSTM 인코더의 단기 메모리에서 가져온 값은 현재 디코더 상태와 코사인 유사도를 사용하여 비교됩니다. 마찬가지로, 두 번째로 펼쳐진 LSTM 네트워크의 출력은 현재 디코더 상태와 다시 계산됩니다. 이 유사도 점수는 각 입력 토큰에서 각 출력 토큰과 계산되며 이 점수는 Softmax 함수를 통과하여 확률로 변환됩니다.

Softmax 함수 공식:

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-AttentionexplainedusingLSTMarchitecture_3.png)

이 확률 점수는 각 입력 토큰이 해당 출력 토큰에 미치는 영향의 양을 나타냅니다. 그런 다음 인코더 출력은 해당 확률 점수에 따라 조정되어 인코더 출력의 가중 합인 컨텍스트 벡터를 계산합니다. 마지막으로 이 벡터는 현재 디코더 상태 벡터에 추가되어 다음 상태의 확률 점수를 생성하기 위해 완전 연결 네트워크를 통과합니다. 디코더 어휘에서 가장 높은 확률 점수를 가진 토큰이 예측되고, `EOS` 토큰이 예측되거나 출력 단어 제한이 도달할 때까지 디코더의 다음 레이어로 전달됩니다.

이 아이디어를 통해 LSTM 모델의 필요성이 결국 사라지고 Transformer가 대세가 되었습니다.

# 결론

<div class="content-ad"></div>

이 기사에서는 어텐션(Attention)이 언어 모델이 입력에서 각 단어의 중요성을 이해하는 데 어떻게 도와주는지 설명합니다. 트랜스포머(Transformer) 아키텍처에서, 셀프-어텐션(Self-Attention)과 마스크드 셀프-어텐션(Masked Self-Attention)에 대해 이해할 수 있습니다.

# 참고 자료

Statquest: Joshua Starmer https://youtube.com/@statquest?si=sX9sq6vUnjzVbhCr

Vaswani, Ashish, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin. “Attention Is All You Need.” arXiv, August 1, 2023. https://doi.org/10.48550/arXiv.1706.03762.

<div class="content-ad"></div>

LST Architecture Diagram – [Link](https://towardsdatascience.com/lstm-recurrent-neural-networks-how-to-teach-a-network-to-remember-the-past-55e54c2ff22e)