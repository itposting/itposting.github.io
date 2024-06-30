---
title: "5분 안에 알아보는 비전 트랜스포머와 마스크드 오토인코더"
description: ""
coverImage: "/assets/img/2024-06-30-FromVisionTransformerstoMaskedAutoencodersin5Minutes_0.png"
date: 2024-06-30 19:07
ogImage: 
  url: /assets/img/2024-06-30-FromVisionTransformerstoMaskedAutoencodersin5Minutes_0.png
tag: Tech
originalTitle: "From Vision Transformers to Masked Autoencoders in 5 Minutes"
link: "https://medium.com/towards-data-science/from-vision-transformers-to-masked-autoencoders-in-5-minutes-cfd2fa1664ac"
---


## 컴퓨터 비전으로 일반화된 NLP 작업을 안내하는 간단한 가이드

2017년 transformer 아키텍처가 등장하면서 언어 모델링, 가려진 단어 예측, 번역 및 질의 응답과 같은 대부분의 자연어 처리 작업들이 혁신을 이루었습니다. Transformers가 컴퓨터 비전 작업에서도 뛰어난 성과를 거뒀다는 데는 2~3년이 걸리지 않았습니다. 이 이야기에서는 transformers가 컴퓨터 비전 분야로 진출할 수 있게 된 두 가지 기본 아키텍처를 탐구합니다.

## 목차

- Vision Transformer
  - 주요 아이디어
  - 운영
  - 혼합 아키텍처
  - 구조의 손실
  - 결과
  - 가려진 자가 반복 학습
- 가려진 오토인코더 비전 Transformer
  - 주요 아이디어
  - 아키텍처
  - 최종 결론 및 예제

<div class="content-ad"></div>

# 비전 트랜스포머

![이미지](/assets/img/2024-06-30-FromVisionTransformerstoMaskedAutoencodersin5Minutes_0.png)

## 주요 아이디어

비전 트랜스포머는 단순히 표준 트랜스포머 구조를 이미지 입력을 처리하고 학습하기 위해 일반화하는 것을 의미합니다. 저자들이 강조한 아키텍처에 대한 중요한 아이디어가 있습니다:

<div class="content-ad"></div>

## 동작

“가능한 수정을 가장 적게 하는 것”을 말 그대로 받아들이는 것은 옳습니다. 사실 그들은 거의 수정을 하지 않습니다. 그들이 실제로 수정하는 것은 입력 구조입니다:

- NLP의 transformer encoder는 입력 문장/문단을 나타내는 원핫 벡터 시퀀스(또는 동등한 토큰 인덱스)를 가져와 문맥 임베딩 벡터 시퀀스를 반환합니다. 이는 나중에 사용될 수 있는 벡터들이며(예: 분류)
- CV를 일반화하기 위해, vision transformer는 입력 이미지를 나타내는 패치 벡터 시퀀스를 가져와 문맥 임베딩 벡터 시퀀스를 반환합니다. 이는 나중에 사용될 수 있는 벡터들입니다(예: 분류)

특히, 입력 이미지의 차원이 (n, n, 3)이라고 가정할 때, 이를 transformer에 입력으로 전달하기 위해 vision transformer가 수행하는 작업은 다음과 같습니다:

<div class="content-ad"></div>

- 위의 그림과 같이 k (예: k=3)로 k² 패치로 나눕니다.
- 이제 각 패치는 (n/k, n/k, 3)이고, 다음 단계는 각 패치를 벡터로 평평하게 만드는 것입니다.

패치 벡터는 3*(n/k)*(n/k) 차원입니다. 예를 들어, 이미지가 (900,900,3)이고 k=3을 사용한다면, 패치 벡터는 평평화된 패치의 픽셀 값을 나타내는 300*300*3 차원이 될 것입니다. 논문에서는 k=16을 사용하고 있습니다. 따라서, 제목에 "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale"이라고 표시됩니다. 단어를 나타내는 one-hot 벡터를 주지 않고 이미지의 패치를 나타내는 픽셀 벡터로 대신합니다.

나머지 작업은 원래 트랜스포머 인코더와 동일합니다:

- 이러한 패치 벡터는 훈련 가능한 임베딩 레이어를 통과합니다.
- 각 벡터에 위치 임베딩이 추가되어 이미지의 공간 정보를 유지합니다.
- 출력은 각 패치에 대한 인코더 표현 (패치 또는 이미지 수준의 분류에 사용 가능)이 될 수 있습니다.
- 더 자주 (및 논문에서처럼), CLS 토큰이 전단에 추가되고 해당 표현을 사용하여 전체 이미지에 대한 예측을 수행합니다 (BERT와 유사).

<div class="content-ad"></div>

Transformer Decoder에 대해 어떻게 생각하시나요?

기억해두세요, Transformer Encoder와 마찬가지로 Transformer Decoder도 마찬가지로 작동합니다; 차이점은 self-attention 대신 masked self-attention을 사용한다는 것입니다 (하지만 동일한 입력 signature를 유지합니다). 어쨌든, 단순히 다음 패치를 예측하는 것은 큰 흥미를 불러일으키는 작업이 아닐 수 있으므로 대부분의 경우 decoder-only Transformer 아키텍처를 드물게 사용할 것으로 기대됩니다.

## 하이브리드 아키텍처

작가들은 또한 이미지 자체 대신 CNN feature map으로 시작하여 하이브리드 아키텍처를 형성하는 것이 가능하다고 언급합니다 (CNN이 비전 Transformer에 출력을 전달). 이 경우 입력을 일반적인 (n,n,p) feature map으로 생각하고 패치 벡터는 차원이 (n/k)*(n/k)*p로 생각합니다.

<div class="content-ad"></div>

## 구조 손실

당신이 생각할 수도 있겠지만, 이미지를 선형 구조로 처리하는 것이 아니기 때문에 이 아키텍처가 그리 좋지 않다고 생각할 수 있습니다. 저자가 의도적으로 이를 언급하여 이 구조가 의도적임을 나타내려고 노력한 것을 알 수 있습니다.

저희는 이를 증명하기 위해 transformer가 이를 학습할 수 있는 능력을 가지고 있음을 그들의 실험에서 좋은 성능을 보여줌으로써, 그리고 더 중요한 것은 다음 논문의 아키텍처를 통해 확인할 것입니다.

## 결과

<div class="content-ad"></div>

결과에서 주요 결론은 비전 트랜스포머가 작은 데이터셋에서 CNN 기반 모델보다 우월한 성능을 내지 않지만, 큰 데이터셋에서는 접근하거나 능가할 수 있으며 어느 쪽이든 상당히 적은 계산량이 필요하다는 것입니다:

![이미지](/assets/img/2024-06-30-FromVisionTransformerstoMaskedAutoencodersin5Minutes_1.png)

여기서 JFT-300M 데이터셋(300M개의 이미지)을 사용한 경우, 해당 데이터셋에서 사전 훈련된 ViT 모델들이 ResNet 기반 베이스라인보다 우수한 성능을 보이면서 훈련에 필요한 계산 자원이 상당히 적다는 것을 볼 수 있었습니다. 사용된 큰 비전 트랜스포머인 ViT-Huge(632M 개의 매개변수 및 k=16)는 ResNet 기반 모델에 사용된 계산량의 약 25%만을 사용하고 여전히 우수한 성능을 발휘했습니다. 계산량의 6.8%만을 사용하는 ViT-Large를 사용했을 때에도 성능이 크게 저하되지 않았습니다.

한편, ImageNet-1K(단 1.3M개의 이미지)에서 훈련된 경우 ResNet이 더 우수한 성과를 냈다는 결과도 있습니다.

<div class="content-ad"></div>

## 마스킹에 의한 자가-지도학습

저자들은 자가-지도학습을 위해 가리기된 패치 예측에 대한 예비 탐구를 수행했습니다. 이는 BERT에서 사용된 가리기된 언어 모델링 작업을 모방하며 (즉, 패치를 가리고 예측하는 것), 자가-지도학습을 위한 것입니다.

자가-지도 사전 훈련을 통해, 작은 ViT-Base/16 모델은 ImageNet에서 79.9%의 정확도를 달성했습니다. 이는 처음부터 훈련하는 것보다 2%의 중요한 향상을 보입니다. 그러나 여전히 지도된 사전 훈련보다 4% 뒤에 있습니다.

# 가리기된 오토인코더 비전 트랜스포머

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-FromVisionTransformerstoMaskedAutoencodersin5Minutes_2.png" />

## 주요 아이디어

비전 트랜스포머 논문에서 볼 수 있듯이, 입력 이미지의 패치를 마스킹하여 사전 훈련의 이득은 일반적인 NLP와 비교했을 때 그다지 중요하지 않았습니다. 반면 일부 파인튜닝 작업에서 마스킹 전 사전 훈련이 우수한 결과를 낼 수 있는 일반 NLP와는 다르게 이득이 크게 나타나지 않았습니다.

본 논문에서는 인코더와 디코더를 포함한 비전 트랜스포머 아키텍처를 제안하며, 이를 마스킹하여 사전 훈련하면 기본 비전 트랜스포머 모델 대비 상당한 개선이 나타납니다(기본 크기의 비전 트랜스포머를 지도 학습하는 것과 비교하여 최대 6%의 향상을 보임).

<div class="content-ad"></div>


![image](/assets/img/2024-06-30-FromVisionTransformerstoMaskedAutoencodersin5Minutes_3.png)

다음은 샘플(입력, 출력, 실제 레이블)입니다. 입력을 재구성하면서 누락된 패치를 채우려고 시도한 오토인코더입니다.

## 아키텍처

그들의 인코더는 이전에 설명한 일반적인 비전 트랜스포머 인코더입니다. 교육 및 추론에서는 "관측된" 패치만 사용합니다.


<div class="content-ad"></div>

한편, 그들의 디코더는 보통 비전 트랜스포머 인코더와 동일하지만 다음을 사용합니다:

- 누락된 패치를 위한 마스크된 토큰 벡터
- 알려진 패치를 위한 인코더 출력 벡터

따라서 누락된 패치가 있는 이미지 [ [ A, B, X], [C, X, X], [X, D, E]]에서 X는 누락된 패치를 나타냅니다. 디코더는 패치 벡터 시퀀스를 가져와야 합니다 [Enc(A), Enc(B), Vec(X), Vec(X), Vec(X), Enc(D), Enc(E)]. Enc는 패치 벡터가 주어졌을 때 인코더 출력 벡터를 반환하고 X는 누락된 토큰을 나타내는 벡터입니다.

디코더의 마지막 레이어는 비전 트랜스포머 인코더에서 생성된 문맥 임베딩을 패치 크기와 동일한 길이의 벡터로 매핑하는 선형 레이어입니다. 손실 함수는 오차 제곱을 사용하는 평균 제곱 오차입니다. 이 손실 함수에서 우리는 마스크된 토큰으로 인한 디코더 예측만 고려하며 현재 존재하는 토큰에 해당하는 예측은 무시합니다 (예: Dec(A), Dec(B), Dec(C) 등).

<div class="content-ad"></div>

## 최종 설명 및 예시

저자들이 이미지의 패치 중 약 75%를 가리는 것을 제안한다는 것이 놀라울 수도 있습니다. 반면 BERT는 단어의 약 15%만 가리게 됩니다. 그들은 다음과 같이 이를 정당화합니다:

스스로 해보고 싶으신가요? NielsRogge의 데모 노트북을 확인해보세요.

여기까지 입니다. 우리는 컴퓨터 비전 세계로 일반화되는 기본 트랜스포머 모델을 이해하기 위한 여정을 함께해 왔습니다. 이 내용이 명확하고 통찰력 있으며 여러분의 시간을 가치 있게 보내게 되었기를 바랍니다.

<div class="content-ad"></div>

참고 자료:

[1] Dosovitskiy, A. et al. (2021) 'An image is worth 16x16 words: Transformers for image recognition at scale', arXiv.org. [온라인] Available at: https://arxiv.org/abs/2010.11929 (방문 날짜: 2024년 6월 28일).

[2] He, K. et al. (2021) 'Masked autoencoders are scalable vision learners', arXiv.org. [온라인] Available at: https://arxiv.org/abs/2111.06377 (방문 날짜: 2024년 6월 28일).