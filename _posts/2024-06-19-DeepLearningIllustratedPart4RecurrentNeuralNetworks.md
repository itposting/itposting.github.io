---
title: "딥러닝 그림으로 쉽게 이해하기, 제4부 순환 신경망"
description: ""
coverImage: "/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_0.png"
date: 2024-06-19 03:14
ogImage: 
  url: /assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_0.png
tag: Tech
originalTitle: "Deep Learning Illustrated, Part 4: Recurrent Neural Networks"
link: "https://medium.com/towards-data-science/deep-learning-illustrated-part-4-recurrent-neural-networks-d0121f27bc74"
---


저희의 그림으로 보여주는 딥러닝 여정 Part 4에 오신 것을 환영합니다! 오늘은 순환 신경망(Recurrent Neural Networks)에 대해 자세히 살펴보겠습니다. 입력, 출력, 활성화 함수 같은 익숙한 개념들에 대해 이야기할 건데, 조금씩 다른 면을 발견할 거에요. 그리고 이번이 여정의 첫 스탑이라면, 특히 Part 1과 Part 2를 읽어보시길 추천드립니다.

순환 신경망(RNN)은 이전 상태에 의존하는 다음 위치에 영향을 받는 순서 기반 문제를 처리하기 위해 명시적으로 설계된 독특한 모델입니다.

간단한 MIT 강의 예시로, 시간 tn에 특정 지점에 있는 공을 상상해보세요.

<div class="content-ad"></div>

만약 우리가 볼의 방향을 예측하라는 요청을 받았다면, 추가 정보 없이는 추측의 일입니다. 볼은 아무 방향으로 움직일 수 있습니다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_1.png)

하지만 만약 볼의 이전 위치에 대한 데이터가 제공된다면 어떨까요?

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_2.png)

<div class="content-ad"></div>

이제 우리는 공이 오른쪽으로 계속 움직일 것이라고 자신 있게 예측할 수 있습니다.

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_3.png)

이 예측 시나리오는 우리가 순차적 문제라고 부르는 것입니다 — 여기서 답은 이전 데이터에 강력하게 영향을 받습니다. 이러한 순차적 문제는 모든 곳에 있으며, 과거 온도 데이터에 기반한 내일의 온도 예측부터 감정 분석, 명명된 개체 인식, 기계 번역 및 음성 인식을 포함한 다양한 언어 모델에 이르기까지 다양합니다. 오늘은 감정 탐지에 초점을 맞추어 시퀀스 기반 문제의 간단한 예제를 살펴보겠습니다.

감정 탐지에서는 텍스트 조각을 가져와 해당 텍스트가 긍정적인지 부정적인지 여부를 결정합니다. 오늘은 영화 리뷰를 입력으로 받아 그것이 긍정적인지 아닌지를 예측하는 RNN을 구축할 것입니다. 따라서 이 영화 리뷰를 고려해 봅시다...

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_4.png)

우리의 신경망이 이것이 긍정적인 감정을 가지고 있다고 예측하길 원합니다.

이것은 간단한 분류 문제처럼 들릴 수 있지만, 여기서 표준 신경망이 직면한 두 가지 주요 도전 과제가 있습니다.

첫째, 우리는 가변 입력 길이를 다루고 있습니다. 표준 신경망은 길이가 다른 입력을 처리하는 데 어려움을 겪습니다. 예를 들어, 만약 우리가 세 단어로 이루어진 영화 리뷰로 신경망을 훈련한다면, 우리의 입력 크기는 세 개로 고정될 것입니다. 그러나 더 긴 리뷰를 입력하고 싶다면 어떻게 해야 할까요?


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_5.png)

위의 리뷰를 12개의 입력값으로 처리하는 데 어려워하고 처리하지 못할 수 있습니다. 지난 글들과 달리 입력값의 개수가 고정된 게 아닙니다(아이스크림 수익 모델은 온도와 요일 2개의 입력값이 있었습니다). 이 경우에는 모델이 유연하게 동작하고 얼마든지 많은 단어들에 적응할 수 있어야 합니다.

또한 연속적인 입력값을 가지고 있습니다. 일반적인 신경망은 입력값의 방향성을 완전히 이해하지 못하는데, 이것은 여기서 중요합니다. 두 문장이 정확히 같은 단어를 포함할지라도 순서가 다르면 완전히 반대의 의미를 가질 수 있습니다.

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_6.png)


<div class="content-ad"></div>

이러한 도전에 직면할 때, 우리는 동적으로 입력을 순차적으로 처리할 수 있는 방법이 필요하다. 여기서 RNN이 빛을 발한다.

이 문제에 접근하는 방법은 먼저 리뷰의 첫 단어 "that"을 처리하는 것이다:

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_7.png)

그런 다음 이 정보를 사용하여 두 번째 단어 "was"를 처리한다:

<div class="content-ad"></div>

이제 위의 모든 정보를 사용하여 마지막 단어 "현저한(phenomenal)"을 처리하고 리뷰의 감정에 대한 예측을 제공해보겠습니다:

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_9.png)

신경망을 구성하기 전에 입력에 대해 논의해야 합니다. 신경망에 입력되는 값은 숫자여야 합니다. 그러나 여기서의 입력값은 단어이므로 이러한 단어를 숫자로 변환해야 합니다. 이를 수행하는 여러 가지 방법이 있지만, 오늘은 기본적인 방법을 사용하겠습니다.

<div class="content-ad"></div>

지금은 10,000개의 단어로 이루어진 큰 사전이 있다고 상상해 봅시다. 우리는 (순진하게) 리뷰에 나오는 어떤 단어라도 이 10,000단어 사전 안에서 찾을 수 있다고 가정할 것입니다. 각 단어는 해당하는 숫자로 매핑되어 있습니다.

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_10.png)

단어 "that"을 숫자들의 묶음으로 변환하려면, "that"이 매핑된 숫자를 확인해야 합니다...

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_11.png)

<div class="content-ad"></div>

이것을 10,000 개의 0으로 이루어진 행렬로 표현하되 8600번째 요소만 1인 형태로 나타내면 됩니다:

![Matrix](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_12.png)

비슷하게, 다음 두 단어 "was" (사전에서 9680번째 단어)와 "phenomenal" (사전에서 4242번째 단어)의 수치적 표현은 다음과 같습니다:

![Matrix](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_13.png)

<div class="content-ad"></div>

이제 우리는 단어를 신경망 친화적인 입력으로 변환하는 방법을 알아봤습니다.

이제 우리의 주의를 신경망의 디자인으로 돌려봅시다. 간단히 설명하기 위해, 네트워크가 10,000개의 입력(= 1단어), 하나의 뉴런으로 이루어진 단일 은닉층 및 하나의 출력 뉴런을 가정해봅시다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_14.png)

물론, 이것이 완전히 훈련된 신경망인 경우, 각 입력마다 연관된 가중치가 있고 뉴런들은 편향(bias) 항을 가지게 될 것입니다.

<div class="content-ad"></div>

![신규 이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_15.png)

이 네트워크에서 입력 가중치는 i가 입력을 나타내는 곳에 wᵢ로 표시됩니다. 숨겨진 레이어 뉴런의 편향 항은 bₕ로 나타냅니다. 숨겨진 레이어와 출력 뉴런을 연결하는 가중치는 wₕᵧ입니다. 마지막으로, 출력 뉴런의 편향은 y가 결과를 나타내므로 bᵧ로 표시됩니다.

우리는 활성화 함수로 숨겨진 뉴런에 대해 쌍곡선 탄젠트 함수 (tanh)를 사용할 것입니다.

![신규 이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_16.png)

<div class="content-ad"></div>

첫 번째 기사에서 다룬 내용을 다시 상기해보자면, tanh 함수는 입력값을 받아 -1부터 1 사이의 출력값을 생성합니다. 큰 양수 입력은 1에 가까워지고, 큰 음수 입력은 -1에 가까워집니다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_17.png)

텍스트의 감정을 판단하기 위해, 우리는 출력 뉴런에서 시그모이드 활성화 함수를 사용할 수 있습니다. 이 함수는 숨겨진 레이어에서 출력을 받아 긍정적 감정의 확률을 나타내는 0부터 1까지의 값을 출력합니다. 1에 가까운 예측은 긍정적인 리뷰를 나타내며, 0에 가까운 예측은 긍정적이지 않을 확률이 높다는 것을 시사합니다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_18.png)

<div class="content-ad"></div>

이 활성화 함수들을 사용하면, 우리의 신경망은 다음과 같이 나타납니다:

![neural network](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_19.png)

이 신경망은 텍스트 입력을 받아 해당 텍스트가 긍정적인 감정을 가질 확률을 예측합니다. 위 예시에서, 신경망은 입력으로 "that"을 처리하고 이것이 긍정적인 경우일 확률을 예측합니다. 솔직히 말해서, "that"이라는 단어 자체로는 감정을 예측하는 데 큰 힌트를 주지는 않습니다. 이제 다음 단어를 신경망에 어떻게 통합할지 알아야 합니다. 이것이 순환 신경망의 순환적 측면이 작용하고, 기본 구조가 수정되는 시기입니다.

리뷰의 두 번째 단어 "was"를 입력으로 넣기 위해, 위의 신경망을 정확하게 복사하여 새로 만듭니다. 그러나, 입력으로 "that" 대신 "was"를 사용합니다:

<div class="content-ad"></div>

![Deep Learning Illustrated Part 4 Recurrent Neural Networks 20](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_20.png)

앞 단어인 "this"에서의 정보도 이 신경망에서 사용하려고 합니다. 따라서, 이전 신경망의 은닉층에서의 출력을 가져와 현재 신경망의 은닉층으로 전달합니다:

![Deep Learning Illustrated Part 4 Recurrent Neural Networks 21](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_21.png)

이건 중요한 단계니까 천천히 살펴봅시다.

<div class="content-ad"></div>

첫 번째 기사에서 우리는 각 뉴런의 처리가 두 단계로 이루어진다는 것을 배웠어요: 합산과 활성화 함수 (이 용어가 무엇을 의미하는지 잘 모르겠다면 첫 번째 기사를 읽어보세요). 이러한 과정이 첫 번째 신경망에서 어떻게 이루어지는지 살펴봅시다.

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_22.png)

첫 번째 신경망의 은닉층 뉴런에서 첫 번째 단계는 합산입니다:

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_23.png)

<div class="content-ad"></div>

여기서 입력값들을 각각의 가중치로 곱하고 편향 항을 모든 곱의 합에 더합니다:

![equation1](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_24.png)

이 방정식을 단순화하기 위해 입력 가중치를 wₓ로, 입력값을 x로 나타냅시다:

![equation2](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_25.png)

<div class="content-ad"></div>

그 다음, 2단계에서는 이 합계를 활성화 함수 tanh를 통해 전달합니다:

![Image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_26.png)

![Image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_27.png)

이로써 첫 번째 신경망의 은닉층에서 출력 h₁을 생성합니다. 여기서 두 가지 옵션이 있습니다. h1을 출력 뉴론으로 전달하거나 다음 신경망의 은닉층으로 전달할 수 있습니다.

<div class="content-ad"></div>

(option 1) 만약 "that"에 대한 감성 예측을 하려면, h₁을 가져와서 출력 뉴런에 전달할 수 있습니다:

![image1](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_28.png)

출력 뉴런에 대해서는 합산 단계를 진행합니다...

![image2](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_29.png)

<div class="content-ad"></div>

<table>
  <tr>
    <td><img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_30.png" /></td>
  </tr>
</table>

…그리고 이 합계에 시그모이드 함수를 적용합니다…

<table>
  <tr>
    <td><img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_31.png" /></td>
  </tr>
</table>

…이것으로 우리가 예측한 긍정적인 감정 값이 나옵니다:

<div class="content-ad"></div>

![Image 1](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_32.png)

So, y₁_hat here shows us the predicted probability that "that" has a positive sentiment.

However, that's not what we aim for. Instead of passing h₁ to the output neuron, we transfer this information to the next neural network in the following way:

![Image 2](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_33.png)

<div class="content-ad"></div>

신경망의 다른 부분과 마찬가지로 우리는 한 숨김층에서 다른 숨김층으로의 입력에 대한 입력 가중치 wₕₕ를 가지고 있습니다. 숨김층은 h₁을 h₁과 wₕₕ의 곱을 합산 단계에 추가함으로써 통합합니다. 따라서 두 번째 신경망 뉴런의 숨김층의 업데이트된 합산 단계는 다음과 같습니다:

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_34.png)

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_35.png)

그런 다음이 합산은 tanh 함수를 통과합니다...

<div class="content-ad"></div>

아래는 두 번째 신경망의 은닉 레이어에서 출력되는 h₂를 생성합니다:

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_37.png)

여기서 다시, h₂를 출력 뉴런을 통해 전달하여 감성 예측을 얻을 수 있습니다:

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_38.png)

![Image 2](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_39.png)

여기서, y₂_hat은 "그것이"가 긍정적인 감정을 가졌을 확률을 예측합니다.

하지만 리뷰는 여기서 끝나지 않는다는 것을 알고 있습니다. 그래서 이전의 숨겨진 레이어 출력 값을 현재의 숨겨진 레이어에 전달하여 이 프로세스를 한 번 더 복제할 것입니다.


<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_40.png)

We process the hidden layer neuron...

![Image 2](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_41.png)

...to an output, h₃:


<div class="content-ad"></div>

아래는 리뷰에서 마지막 단어이자 마지막 입력이기 때문에, 우리는 이 데이터를 외부 뉴런에 전달합니다...

아래는 리뷰에서 마지막 단어이자 마지막 입력이기 때문에, 우리는 이 데이터를 외부 뉴런에 전달합니다...

... 그리고 이를 통해 감정의 최종 예측을 제공합니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_44.png" />

이 y₃_hat은 우리가 원하는 영화 리뷰의 감성으로, 처음에 그려 놓은 것을 얻는 방법입니다!

<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_45.png" />

## 형식적 표현

<div class="content-ad"></div>

위의 다이어그램을 자세히 설명하면 다음과 같습니다:

![다이어그램](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_46.png)

각 단계마다 입력 x가 숨겨진 레이어를 통해 흐르고 출력 h를 생성합니다. 이 출력은 다음 신경망의 숨겨진 레이어로 이동하거나 감정 예측인 y_hat으로 이어집니다. 각 단계에는 가중치(weight)와 편향(bias) 용어가 포함되어 있습니다(다이어그램에는 편향이 표시되지 않음). 강조할 중요한 점은 모든 숨겨진 레이어를 하나의 조밀한 상자로 통합하고 있다는 것입니다. 모델에는 하나의 숨겨진 레이어와 단일 뉴런이 있는 것만 포함되어 있지만, 더 복잡한 모델에는 여러 숨겨진 레이어와 다수의 뉴런이 포함될 수 있고, 이러한 모든 요소가 이 상자(숨겨진 상태)로 압축됩니다. 이 숨겨진 상태는 숨겨진 레이어의 추상적인 개념을 담고 있습니다.

본질적으로, 이것은 이 신경망의 단순화된 버전입니다:

<div class="content-ad"></div>


![딥러닝 일러스트레이티드 파트 4: 순환 신경망 (RNN)](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_47.png)

이미지에서도 볼 수 있듯이 이 과정을 단순화한 다이어그램으로 표현할 수 있습니다:

![딥러닝 일러스트레이티드 파트 4: 순환 신경망 (RNN)](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_48.png)

이 프로세스의 본질은 출력값을 은닉층으로 순환해서 되돌린다는 점이며, 이것이 왜 순환 신경망이라고 불리는지에 대한 이유입니다. 이는 종종 교과서에서 신경망이 어떻게 표현되는지 보여주는 방식입니다.


<div class="content-ad"></div>

수학적으로 이 문제를 두 가지 기본 방정식으로 요약할 수 있어요:


![equation1](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_49.png)


첫 번째 방정식은 숨겨진 상태 내에서 발생하는 전체 선형 변환을 포함해요. 이 경우, 이 변환은 개별 뉴런 내에서의 tanh 활성화 함수예요. 두 번째 방정식은 출력 층에서 발생하는 변환을 나타내며, 이는 저희 예시에서 시그모이드 활성화 함수에 해당돼요.


![equation2](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_50.png)


<div class="content-ad"></div>

# RNN이 해결하는 문제 유형

## 많은 것들을 하나로

우리는 이전에 여러 입력(우리의 경우에는 리뷰 안의 모든 단어)이 RNN에 공급되는 시나리오를 논의했습니다. 그러면 RNN은 리뷰의 감정을 나타내는 단일 출력을 생성합니다. 각 단계마다 출력을 가질 수 있지만, 우리의 주된 관심사는 최종 출력에 있습니다. 왜냐하면 이는 전체 리뷰의 감정을 담고 있기 때문입니다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_51.png)

<div class="content-ad"></div>

다른 예는 텍스트 완성입니다. 단어 문자열을 제공하면 RNN이 다음 단어를 예측하도록 원합니다.


<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_52.png" />


## One-To-Many


<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_53.png" />


<div class="content-ad"></div>

원 대 다 문제의 고전적인 예는 이미지 캡션입니다. 여기서 하나의 입력은 이미지이고 출력은 여러 단어로 구성된 캡션이 됩니다.

## 다 대 다

![RNN Example](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_54.png)

이 유형의 RNN은 기계 번역과 같은 작업에 사용됩니다. 예를 들어 영어 문장을 힌디어로 번역하는 작업입니다.

<div class="content-ad"></div>

# 단점

이제 RNN이 작동하는 방식을 자세히 살펴보았으니, 왜 그들이 널리 사용되지 않는지 살펴볼 가치가 있습니다 (스토리 전환!). 잠재력이 있음에도 불구하고, RNN은 특히 Vanishing Gradient Problem이라고 하는 것 때문에 교육 과정 중에 중요한 도전에 직면합니다. 이 문제는 RNN을 더 많이 펼치면서 더욱 악화되며, 결국 교육 과정을 복잡하게 만듭니다.

이상적인 세상에서는 RNN이 현재 단계 입력과 이전 단계의 입력을 모두 동등하게 고려하는 것을 원합니다: 

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_55.png)

<div class="content-ad"></div>

그러나 실제로는 다음과 같이 보입니다:

`<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_56.png" />`

각 단계는 약간 전 단계를 잊어버리는 경향이 있어서, 그 결과 단기 기억 문제인 사라지는 기울기 문제가 발생합니다. RNN이 더 많은 단계를 처리할수록, 이전 단계에서의 정보를 유지하는 데 어려움을 겪을 수 있습니다.

입력이 세 개인 경우에는 이 문제가 그리 두드러지지 않습니다. 그렇다면 입력이 여섯 개인 경우는 어떨까요?

<div class="content-ad"></div>

첫 두 단계에서의 정보가 마지막 단계에서는 거의 없음을 발견했습니다. 이는 중요한 문제입니다.

다음은 텍스트 완성 작업을 사용하여 이 점을 설명하는 예시입니다. 이 문장을 완성하는 것에 성공할 수 있는 RNN이 있습니다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_57.png)

그러나 단어가 추가될수록 RNN은 다음 단어를 정확하게 예측하기 어려워 질 수 있습니다. 처음 단어에서 예측해야 할 단어 사이의 거리가 늘어나면서 RNN이 초기 단어들이 제공하는 문맥을 잊어버리기도 할 수 있기 때문입니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_58.png" />

이것은 RNN이 이론상으로 훌륭해 보이지만 실제로는 종종 부족하다는 사실을 강조합니다. 단기 기억 문제를 해결하기 위해 우리는 Long Short-Term Memory (LSTM) 네트워크라고 불리는 특수 유형의 신경망을 사용합니다. 하지만 그것은 다음 파트에서 다루도록 하겠습니다. 그러니 기대해 주세요!

# 보너스: Softmax 활성화 함수

이전에 우리는 감성 예측을 다루는 다른, 훨씬 더 나은 방법에 대해 이야기했습니다. 출력 뉴런에 대한 활성화 함수를 결정했을 때로 돌아가보겠습니다.


<div class="content-ad"></div>


![Deep Learning Illustrated](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_59.png)

하지만 이번에는 조금 다른 것에 집중합니다. 순환 요소를 제외하고 기본 신경망에 초점을 맞춰 봅시다. 이제 우리의 목표는 무엇일까요? 영화 리뷰 전체가 아닌 단일 입력 단어의 감성을 예측하는 것입니다.

이전에, 우리의 예측 모델은 입력이 양수일 확률을 출력하도록 목표로 했습니다. 이를 위해 출력 뉴런에서 시그모이드 활성화 함수를 사용하여 이를 성취했습니다. 이 함수는 긍정적 감정의 가능성에 대한 확률 값을 생성합니다. 예를 들어, "terrible"라는 단어를 입력하면, 우리 모델은 이상적으로 긍정적인 가능성이 낮음을 나타내는 낮은 값을 출력할 것입니다.

![Deep Learning Illustrated](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_60.png)


<div class="content-ad"></div>

그러나 다시 한번 생각해보면, 이 결과가 크게 만족스럽지는 않습니다. 긍정적 감정의 낮은 확률은 반드시 부정적이라는 것을 의미하는 것은 아닙니다. 입력이 중립적이었을 수도 있습니다. 그렇다면 이를 어떻게 개선할 수 있을까요?

다음을 고려해보세요. 만약 영화 리뷰가 긍정적인지, 중립적인지, 부정적인지 알고 싶다면 어떻게 될까요?

그래서, 입력이 긍정적인지 예측하는 확률을 반환하는 하나의 출력 뉴런 대신, 세 개의 출력 뉴런을 사용할 수 있습니다. 각각이 리뷰가 긍정적, 중립적, 부정적일 확률을 예측할 것입니다.

![이미지](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_61.png)

<div class="content-ad"></div>

현재 네트워크의 각 뉴런에 시그모이드 함수를 적용하여, 확률을 출력하기 위해 단일 출력 뉴런 네트워크에서 사용한 것과 동일한 원리를 적용할 수 있습니다.

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_62.png)

각 뉴런은 각자에게 해당하는 확률 값을 출력할 것입니다:

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_63.png)

<div class="content-ad"></div>

그러나 문제가 있습니다: 확률이 올바르게 합산되지 않습니다 (0.1 + 0.2 + 0.85 != 1) 그래서 이것은 그다지 좋은 해결책이 아닙니다. 출력 뉴런 모두에 시그모이드 함수를 간단히 적용하는 것으로는 문제를 해결할 수 없습니다. 세 개의 출력 간에 이러한 확률을 정규화하는 방법을 찾아야 합니다.

여기서 우리의 무기에 강력한 활성화 함수를 소개합니다 — 소프트맥스 활성화. 소프트맥스 활성화 함수를 사용하면 우리의 신경망은 새로운 모습을 취합니다:

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_64.png)

처음에는 복잡해 보일 수 있지만, 소프트맥스 함수는 실제로 매우 직관적입니다. 간단히 말해 출력 뉴런에서 출력 값 (y_hat)을 가져와 정규화합니다.

<div class="content-ad"></div>

그러나 이 세 개의 출력 뉴런에 대해서는 어떤 활성화 함수도 사용하지 않아야 한다는 것이 중요합니다. 출력 (y_hats)은 합산 단계 직후에 직접 얻는 결과가 될 것입니다.

우리는 이 y_hat 출력을 소프트맥스 공식을 통해 정규화합니다. 이 공식은 긍정적인 감정의 확률 예측을 제공해줍니다:

![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_65.png)

마찬가지로, 부정적인 결과와 중립 결과의 확률 예측을 얻을 수도 있습니다:

<div class="content-ad"></div>

아래와 같이 작동해 봅시다. 예를 들어, "terrible"가 입력으로 주어지면 다음과 같은 y_hat 값들이 나타날 것입니다:


![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_66.png)


그런 다음이 값을 가져와 softmax 공식에 대입하여 "terrible"라는 단어가 긍정적인 함축을 가질 확률을 계산할 수 있습니다.


![image](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_67.png)


<div class="content-ad"></div>

이 의미는 감성 뉴런에서 출력된 결합된 결과를 사용하면 "terrible"이 긍정적인 감정을 가진다는 확률이 0.05인 것을 의미합니다.

만약 입력이 중립적인지의 확률을 계산하려면 비슷한 공식을 사용하되 분자를 바꿔야 합니다. 따라서, "terrible"이 중립적인지의 가능성은 다음과 같습니다:

![probability formula](/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_68.png)

그리고 "terrible"이 부정적이라고 예측되는 확률은:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-DeepLearningIllustratedPart4RecurrentNeuralNetworks_69.png" />

그러면 뭐, 이제 확률이 1에 합쳐져서 모델이 더 설명 가능하고 논리적입니다.

그래서 우리가 신경망에게 "“terrible”라는 단어가 부정적인 감정이 있는 확률이 얼마나 되냐?"고 물으면, 꽤 직관적인 답을 받게 됩니다. "terrible"이라는 단어가 부정적인 감정이라는 것에 대해 확률적으로 85%가 있다고 자신있게 말합니다. 이것이 바로 softmax 활성화 함수의 매력입니다!

오늘은 여기까지! 우리는 순환 신경망과 소프트맥스 활성화 함수라는 두 가지 큰 주제를 다뤘습니다. 이것들은 나중에 더 깊게 다룰 많은 고급 개념들의 기초입니다. 그러니 시간을 내어 천천히 생각해보시고, 계속 질문하거나 의견을 나누고 싶다면 언제든지 LinkedIn에서 연락 주시거나 shreya.statistics@gmail.com으로 이메일 보내 주세요!