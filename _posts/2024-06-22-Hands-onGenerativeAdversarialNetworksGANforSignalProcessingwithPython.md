---
title: "파이썬을 사용한 신호처리를 위한 생성적 적대 신경망GAN 실습 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_0.png"
date: 2024-06-22 21:43
ogImage: 
  url: /assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_0.png
tag: Tech
originalTitle: "Hands-on Generative Adversarial Networks (GAN) for Signal Processing, with Python"
link: "https://medium.com/towards-data-science/hands-on-generative-adversarial-networks-gan-for-signal-processing-with-python-ff5b8d78bd28"
---


## 몇 줄의 코드로 신호 처리를 위한 생성형 딥러닝 모델을 만드는 방법

![이미지](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_0.png)

저는 연구에서 머신(딥)러닝을 많이 사용합니다. 이틀 전에, 생성적 적대 신경망(GAN)에 대해 작업하고 제 작업에 어떻게 적용할 수 있는지 살펴보았습니다.

코드가 완성되면, 제가 Medium에 이 기사를 쓰기 시작했고, 항상 하는 것처럼 적절한 소개로 시작하는 최상의 문구를 찾으려 했습니다.

<div class="content-ad"></div>

자, 이제부터 질문을 스스로에게 던지기 시작합니다:

물론, 저는 내가 쓰는 것이 의미 있고 재미있기 때문에 독자들이 이것을 읽어야 한다고 믿습니다.

하지만 사실은, 저는 시그널 처리를 사랑하고, 시그널 처리에 대해 글을 쓰는 것을 사랑하기 때문에 그렇게 합니다. 이 글은 제가 가장 사랑하는 두 가지에 대한 것입니다: 시그널 처리와 인공지능. 이 두 가지에 제 모든 사랑, 에너지, 열정을 쏟았으며 (사실 한 바다를 건너가서 연구까지 했습니다), 여러분이 이 주제를 흥미롭게 생각해주길 바랍니다.

제목에서 짐작하실 수 있듯이, 우리는 시그널 처리를 위해 생성적 적대 신경망(Generative Adversarial Networks)을 사용할 것입니다. 이번에 할 게임은 다음과 같습니다:

<div class="content-ad"></div>

한 실험을 진행하고 있다고 상상해보세요. 이 실험의 설치는 생성기에 의해 이루어집니다. 이 생성기의 출력물은 시계열 데이터(즉, 신호)입니다.

![이미지](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_1.png)

이 실험이 비싸고 많은 에너지와 계산 노력이 필요하다고 상상해보세요. 우리는 결국 이 실험을 중단하고 싶습니다. 이를 위해서 생성기를 대리 생성기(surrogate)로 바꿔야 합니다.

![이미지](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_2.png)

<div class="content-ad"></div>

저희 대리 모델인 연핑크 뇌를 보십시오. 특히, 이 대리 모델은 기계 학습 모델입니다. 이름에서 알 수 있듯이, 이 기계 학습 모델은 적대적 생성 신경망(GAN)입니다.

이 글은 이런 내용을 담고 있을 거에요:

- 실험 구축하기: 우리는 통제된 데이터셋을 생성하고 설명할 거에요.
- 기계 학습 모델 정의하기: 우리 GAN 모델의 특정 기능을 설명할 거에요.
- 결과 탐색하기: 우리 생성 모델을 실행하고, 대리 모델을 사용하여 신호를 추출할 거에요.

제가 기대되는 만큼 당신도 신나길 바라요. 함께해요!

<div class="content-ad"></div>

# 1. 실험에 관하여

전기/기계 공학자가 설정한 대부분의 신호는 사인 파형 신호입니다.*

즉, 출력 신호는 이렇게 어떤 모양인 것입니다:

![image](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_3.png)

<div class="content-ad"></div>

위와 같은 표를 Markdown 형식으로 변경합니다.

| Variable | Description                              |
|----------|------------------------------------------|
| A        | 신호의 진폭                               |
| omega    | 주파수                                   |
| b        | 편향                                    |

실제 세계 실험에서는 노이즈 요소가 있습니다.
지금은 다양한 종류의 노이즈가 있으며, 각각 색상이 지정되어 있습니다(white noise, pink noise, blue noise, green noise 등). 가장 전형적인 노이즈 중 하나는 가우시안 백색 소음으로, 모든 주파수에서 존재하며 가우시안 분포를 갖는 노이즈입니다.

따라서 대상 신호는 다음과 같이 보입니다:

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_4.png)

Now, in practice:

- The mean is usually 0
- The standard deviation can vary, but it is safe to assume it is 1 and fixed for our experiment.
- Another constant can be considered to be in front of the noise factor as a sort of amplitude of the noise

So at the end of the day, it looks more like this:


<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_5.png" />

이것이 바로 우리의 완벽한 세계, 아바타에서 말하는 대로 우리의 판도라입니다 😄

현실에서는 상황이 조금 다를 수 있습니다.
예를 들어, 우리가 진폭을 고정했다고 해봅시다. 그러나 그 진폭은 많이 변할 수 있습니다.
예를 들어, 다음과 같이 말씀드릴 수 있습니다:

- 진폭은 0.1부터 10까지의 범위 내에서 0.1씩 증가합니다.
- 편향은 0.1부터 10까지의 범위 내에서 0.1씩 증가합니다.
- 주파수는 1부터 2까지의 범위 내에서 0.001씩 증가합니다.
- 잡음의 진폭은 고정되어 있으며 0.3입니다 (잡음의 랜덤성은 그 확률 분포에 있습니다)

<div class="content-ad"></div>

모든 이러한 무작위성을 통합하려면 다음 코드 라인을 사용할 수 있습니다:

다음은 일부 출력입니다:

이 시점에서 목표가 충분히 명확해야 합니다:

그러면 머신 러닝부터 시작합시다 🤗

<div class="content-ad"></div>

# 2. 머신 러닝에 대해

저희가 사용하는 머신 러닝 모델은 Generative Adversarial Network (GAN)입니다.

GAN에 대한 설명과 함께 신호 처리에 관한 이 기사를 정말 원합니다. 간단히 소개해보겠습니다. 주의: 어떤 사람들은 저보다 훨씬 잘 설명합니다 (이번에 Joseph Rocca에게 큰 찬사를 드립니다: Understanding Generative Adversarial Networks (GANs))

GAN이 Deepfake에 사용되는 모델이라고 생각해보세요.
이것은 이름에서 느낄 수 있듯이 생성 모델로, 생성 부분과 구별자를 훈련시켜 구현됩니다.

<div class="content-ad"></div>

생성 부분은 실제 모델과 가능한 가까운 모델을 생성하려고 노력합니다. 그게 전부라면 일반적인 인코더-디코더와 다르지 않을 것입니다. "진짜 거래"는 식별 부분의 존재입니다.

식별 부분은 실제와 "가짜" (생성된 생성 모델에서 생성된) 인스턴스를 구분하려고 시도하는 분류기입니다.

따라서 게임은 훈련 데이터 객체와 유사한 가짜 객체를 구축하려고 하는 생성 모델과 훈련 데이터 객체와 가짜 객체를 구분하려고 하는 식별 모델 사이의 경쟁입니다. 이 "게임"은 최소-최대 손실 함수와 Ian J. Goodfellow의 뛰어난 마음에 의해 만들어진 우아하면서 간단한 알고리즘으로 실현됩니다 (Generative Adversarial Nets 논문).

지금, GAN의 매우 흔한 사용은 조건부 GAN입니다. 조건부 GAN은 특정 입력과 관련된 생성 모델입니다.
입력이 문자열이라고 말해봅시다.

<div class="content-ad"></div>

그리고 출력물은 다음 이미지입니다:

![Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_6](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_6.png)

이 예에서 모델은 더 단순하며 생성 모델은 특정 입력과 관련이 없습니다.
이 생성 모델의 입력은 지금 잡음이므로 모델은 잡음에서 소스에서 생성된 것으로 추정되는 신호로 가려고 합니다.

생성 모델의 구조는 다음과 같습니다:

<div class="content-ad"></div>

다음은 식별 모델의 아키텍처입니다:

![discriminative model](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_8.png)

생성 모델은 다음과 같이 설명할 수 있습니다:
LSTM 모델은 무작위 잡음 벡터(3차원 벡터)를 입력으로 받고, 이상적으로는 원하는 신호인 300개의 요소로 이루어진 벡터를 출력합니다.

<div class="content-ad"></div>


![image1](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_9.png)

The discriminative model distinguishes a real (from the training data) and a fake (generated by the generative model) output:

![image2](/assets/img/2024-06-22-Hands-onGenerativeAdversarialNetworksGANforSignalProcessingwithPython_10.png)

The hands-on implementation of this GAN is the following:


<div class="content-ad"></div>

이제 입력의 길이는 모델의 매개변수입니다:

```js
LENGHT_INPUT = 300
```

그리고 노이즈 벡터의 차원은 latent_dim 매개변수입니다.

이제 데이터셋을 생성해야 합니다. 이는 n개의 신호를 생성하는 함수를 작성하는 것을 의미합니다. 또한 주어진 차원의 n개의 무작위 노이즈 입력을 생성해야 하며, n개의 무작위 노이즈 신호를 사용하여 가짜 신호를 생성하는 코드를 작성해야 합니다.

<div class="content-ad"></div>

마지막으로, 저희는 기차 함수를 구축해야 합니다.

이 코드는 우리의 생성 모델을 훈련할 것입니다. 또한 n_eval 단계마다 생성 모델의 진행 상황을 보여줄 것이고, 진짜 데이터와 가짜 데이터(여기서 가짜란 "우리 모델에 의해 생성된" 것을 말합니다)를 플로팅할 것입니다.

# 3. 전체 코드

전체 스크립트입니다.

<div class="content-ad"></div>

- 데이터셋을 생성합니다
- GAN 모델을 구축합니다
- GAN을 학습합니다

다음과 같습니다:

진행 상황을 보여드릴게요:

이제 100,000개의 랜덤 신호를 생성해볼게요.

<div class="content-ad"></div>

대박이에요. 각 실험이 0.5달러 든다고 가정해보세요. 그러면 50,000달러를 "절약"한 셈이에요. 또한 각 실험이 1분이 걸린다고 가정해보세요. 그러면 70일을 "절약"한 셈이죠. 이것이 GANs 모델을 사용하는 목적입니다: "시간과 노력을 절약하기 위해".

이제 100,000개의 실제 신호를 생성합시다.

결과를 몇 개 그래프로 나타내 보겠습니다:

## 4. 요약



<div class="content-ad"></div>

이 기사에서는:

- 인공 지능과 신호 처리가 멋지다는 것을 확인하고, 그래서 이 둘을 합치기로 결정했습니다.
- 우리는 신호 처리 시나리오를 만들었습니다. 여기서는 소음이 있는 사인 발생기가 있습니다. 이 사인에는 다른 진폭, 다른 주파수 및 다른 바이어스가 있을 수 있습니다.
- 우리는 GAN 모델에 대해 간단히 설명했습니다. 모델의 생성 부분, 식별 부분 및 손실이 무엇인지 설명했습니다. 생성 모델의 입력은 3차원 노이즈이며, 출력은 학습 데이터 중 하나와 비슷한 신호입니다.
- 우리는 GAN 모델을 훈련시키고 일부 무작위 신호를 생성했습니다.

이 모델의 핵심 부분은 생성 능력이며, 훈련된 생성 모델은 시간, 비용 및 에너지를 절약할 수 있습니다. 이는 실험을 진행하는 대신 파이썬 환경에서 "실행" 버튼만 누르면 되기 때문입니다 🚀

# 5. 결론

<div class="content-ad"></div>

만약 이 기사를 좋아하셨고 머신 러닝에 대해 더 알고 싶거나, 단순히 저에게 질문을 하고 싶다면 아래 방법으로 연락해 주세요:

1. LinkedIn에서 팔로우하기 - 모든 이야기를 공개하고 있습니다.
2. 뉴스레터 구독하기 - 새로운 이야기에 대한 최신 정보를 받을 수 있으며, 궁금한 사항 또는 수정 사항을 받아 볼 수 있습니다.
3. 추천 회원 가입하기 - 월별 "이야기의 최대 개수" 제한 없이 읽을 수 있으며, 최신 기술에 관한 저와 수천 명의 다른 머신 러닝 및 데이터 과학 최고의 작가들이 쓴 내용을 읽을 수 있습니다.