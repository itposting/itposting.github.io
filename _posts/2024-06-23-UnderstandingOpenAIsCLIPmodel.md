---
title: "OpenAI의 CLIP 모델 이해하기 2024 최신 분석 및 기능 소개"
description: ""
coverImage: "/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_0.png"
date: 2024-06-23 20:08
ogImage: 
  url: /assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_0.png
tag: Tech
originalTitle: "Understanding OpenAI’s CLIP model"
link: "https://medium.com/@paluchasz/understanding-openais-clip-model-6b52bade3fa3"
---


CLIP은 2021년 OpenAI에 의해 출시되어 그 이후로 많은 다중 모달 AI 시스템의 핵심 구성 요소 중 하나가 되었습니다. 이 기사는 CLIP에 대한 심층적인 내용을 다룹니다. CLIP이 무엇이며, 어떻게 작동하는지, 어떻게 사용되는지, 그리고 어떻게 구현되는지에 대해 소개합니다.

# 소개

CLIP은 Contrastive Language-Image Pre-training의 약자로, 자연어 감독에서 학습하기 위한 효율적인 방법으로 2021년에 소개되었습니다. 이 방법은 Learning Transferable Visual Models From Natural Language Supervision 논문에서 소개되었습니다.

요약하면, CLIP은 4억 개의 이미지와 텍스트 쌍을 이용하여 자가 감독 방식으로 훈련된 공통 이미지 및 텍스트 임베딩 모델입니다. 이는 텍스트와 이미지를 동일한 임베딩 공간에 매핑한다는 것을 의미합니다. 예를 들어, 개의 이미지와 "개의 이미지"라는 문장은 매우 유사한 임베딩을 갖게 되고 벡터 공간에서 서로 가까이 위치하게 됩니다. 이는 이미지 데이터베이스를 설명으로 검색하거나 그 반대의 응용 프로그램을 구축할 수 있다는 점에서 매우 중요합니다.

<div class="content-ad"></div>

저자들은 CLIP이 훈련되지 않은 다양한 작업에 사용될 수 있음을 발견했습니다. 예를 들어, CLIP은 ImageNet과 같은 이미지 분류 데이터셋에서 놀라운 제로샷 성능을 거뒀다. 제로샷 러닝은 모델이 ImageNet 데이터셋의 1.28백만 개의 훈련 예시 중 어느 것도 명시적으로 훈련받지 않았다는 사실을 가리킵니다. 그럼에도 불구하고, CLIP은 이미지와 텍스트가 동일한 임베딩 공간에 있고 도트 곱이 임베딩 간 유사성을 계산하기 때문에 "강아지의 사진"과의 도트 곱이 가장 높을 가능성이 큽니다. 따라서 이미지를 강아지로 예측할 수 있습니다. CLIP을 진정한 분류기로 바꾸고 싶다면 도트 곱을 소프트맥스 함수를 통해 각 클래스에 대한 예측 확률을 얻을 수 있습니다.

위 과정은 다음 그림의 2단계와 3단계에서 확인할 수 있습니다.

![CLIP 모델 이해](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_0.png)

<div class="content-ad"></div>

이제 CLIP가 어떻게 작동하는지 자세히 살펴보겠습니다.

# 모델 세부정보

## 아키텍처

CLIP 모델에는 텍스트 인코더(텍스트를 임베드하는 부분)와 이미지 인코더(이미지를 임베드하는 부분) 두 가지 주요 구성 요소가 있습니다. 텍스트 인코더에는 Transformer가 사용되었습니다. 이 아키텍처는 2017년 이후부터 NLP 분야를 혁신시켜 왔으며 당연히 사용되었다고 할 수 있습니다. 시각적인 설명이 필요하시면 아래 블로그를 참조하세요.

<div class="content-ad"></div>

이미지 인코더에 대해 작성자는 두 가지 다른 모델을 시도했습니다. ResNet-50 및 Vision Transformer (ViT)입니다. ResNet-50은 이미지 분류에 사용되는 컨볼루션 신경망 (CNN)을 사용한 원래의 최신 아키텍처이며, ViT는 이미지를 위한 원본 Transformer의 최근적인 적응으로 각 이미지를 패치 시퀀스로 분할하고 토큰 시퀀스로 유사하게 모델에 전달합니다. 작성자는 ViT가 더 빠르게 훈련되었음을 발견했습니다.

텍스트 및 이미지 인코더 모두 처음부터 훈련되었습니다.

모든 아키텍처에 대해 논문에서 설명한 대로 소량의 수정이 가해졌습니다.

## 훈련

<div class="content-ad"></div>

저자들은 초기에 이미지 캡션 모델을 훈련시켜보려고 했는데, 이미지를 주면 정확한 캡션/설명을 예측하는 모델이었습니다.

그러나 4억(이미지, 텍스트) 쌍을 훈련시키기에는 규모가 맞지 않다고 판단하여, 비교 표현 학습 접근 방식으로 바꾸기로 결정했습니다. 비교적 표현 학습의 목표는 비슷한 샘플 쌍이 서로 가깝게 유지되고 다른 샘플 쌍이 멀리 떨어지도록 하는 임베딩 공간을 학습하는 것입니다.

표준 비교 학습 접근 방식에서는 모델에 (앵커, 양성, 음성) 형식의 예제를 제공합니다. 여기서 앵커는 한 클래스(예: 개)의 이미지이고, 양성은 같은 클래스(개)의 다른 이미지, 음성은 다른 클래스(예: 새)의 이미지입니다. 그런 다음, 이미지를 임베딩하고 같은 클래스(개)에 대한 두 임베딩 사이의 거리(distance(anchor, positive))를 최소화하고, 서로 다른 클래스(개와 새)에 대한 두 임베딩 사이의 거리(distance(anchor, negative))를 최대화하도록 모델을 훈련합니다. 이는 모델이 동일한 객체에 대해 매우 유사한 임베딩을 출력하고, 서로 다른 객체에 대해 서로 다른 임베딩을 출력하도록 격려합니다.

<div class="content-ad"></div>

동일한 방식은 텍스트와 텍스트와 이미지의 조합에도 적용할 수 있습니다. 예를 들어, CLIP의 경우 단일 훈련 예제에 대해 앵커는 개의 이미지일 수 있으며, 양성은 "개의 이미지"라는 캡션일 수 있으며, 부정은 "새의 이미지"라는 캡션일 수 있습니다.

CLIP는 다중 클래스 N-pair loss를 사용하여 이를 더 확장하며, 이는 앵커마다 여러 개의 부정과 양성이 있을 때의 상황입니다. 논문에 설명된 바에 따르면:

논문에서 제공된 아래 의사 코드는 핵심 세부 정보를 잘 캡슐화합니다:

![이미지](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_2.png)

<div class="content-ad"></div>

다음은 순서입니다:

- 이미지 인코더로 이미지를 포함하고, 텍스트 인코더로 텍스트를 포함합니다.
- 이미지 및 텍스트 임베딩은 서로 다른 모델에서 나오며 차원이 다르기 때문에, 학습된 프로젝션 매트릭스와의 곱셈을 통해 동일한 합성 다중 모달 임베딩 공간으로 변환합니다. 예를 들어, np.dot(I_f, W_i)는 크기가 [n, d_i]인 행렬을 크기가 [d_i, d_e]인 행렬과 곱하여 크기가 [n, d_e]인 프로젝트된 행렬을 생성합니다.
- 새로운 임베딩 벡터를 정규화합니다. 이렇게 하면 단위 벡터로 변환됩니다.
- 도트 곱의 행렬을 계산합니다.
- 각 행 및 열에 대한 교차 엔트로피 손실을 계산하고, 각 쌍이 두 번씩 계산되므로 2로 나눕니다.

## 프롬프트 엔지니어링 및 앙상블링

언어 모델의 부상 이후 프롬프트 엔지니어링은 생성 모델에서 좋은 출력을 얻기 위한 매우 흔한 실천법이 되었습니다. CLIP의 텍스트 인코더가 트랜스포머 모델인 만큼 제로샷 성능을 얻기 위해서 매우 중요하다는 점을 저자들이 발견했습니다. 저자들은 사진과 텍스트가 단어 하나로만 이루어진 경우인 경우가 그리 흔하지 않았다는 것을 발견했습니다. 예를 들어, "개"와 같이 클래스 레이블을 나타내는 경우입니다. 대신, 이미지와 함께 매칭되는 텍스트가 이미지의 캡션 또는 설명과 같이 전체 문장인 경우가 더 흔했습니다. 따라서 저자들은 " 'object'의 사진"이 좋은 기본 프롬프트이지만 특정 경우에는 더 전문화된 프롬프트가 더 잘 작동한다고 발견했습니다. 예를 들어, 위성 이미지의 경우 " 'object'의 위성 사진"이 잘 작동했습니다.

<div class="content-ad"></div>

작가들은 다른 모델들을 앙상블하는 실험도 진행했습니다. 앙상블은 여러 다른 모델들의 예측을 결합하여 최종 출력을 얻는 것으로, 머신러닝에서 고분산 및 저편향(과적합) 모델의 문제를 해결하는 일반적인 기술입니다. CLIP의 경우, 작가들은 여러 다양한 프롬프트를 사용하여 분류기를 구성하여 앙상블을 만들었습니다.

프롬프트 엔지니어링과 앙상블 모두 ImageNet에서 상당한 성능 향상을 보여주었습니다.

## 한계

논문은 더 많은 실험과 결과에 대해 논하고 있지만, CLIP가 완벽하지 않으며 다양한 한계가 있다는 점을 언급하는 것도 중요합니다.

<div class="content-ad"></div>

- 앞서 언급한 설계 결정으로 이 모델은 생성 모델이 아니며 이미지 캡셔닝을 할 수 없습니다.
- 저자는 CLIP가 여전히 최신 기술 수준에서는 멀리 떨어져 있음을 언급하며 (위에 선형 레이어가 있는 ResNet과만 비교 가능함) 일부 작업에 대해 매우 안좋은 일반화 성능을 보입니다. 예를 들어, 쉬운 MNIST 손글씨 숫자 인식 데이터셋에서는 88% 정도만 달성합니다. Training 데이터에 유사한 이미지가 없기 때문일 가능성이 높지만, CLIP는 그런 측면에 대해 거의 다루지 않습니다.
- CLIP는 인터넷에 있는 이미지와 텍스트의 쌍으로 훈련되었습니다. 이러한 이미지-텍스트 쌍들은 필터링되지 않고 정리되지 않았으며, CLIP 모델은 여러 사회적 편향을 학습하게 됩니다. (현재 LLM들과 유사한 우려사항이 있으며, RLFHF와 직접 선호도 최적화와 같은 기술이 이를 해결하려고 노력하고 있습니다.)
- 트랜스포머 텍스트 인코더의 최대 시퀀스 길이(전달할 수 있는 토큰의 최대 수)는 원본 구현에서 76으로 제한되었는데, 이는 대부분 이미지와 일반적으로 짧은 문장인 캡션으로 이루어진 데이터셋 때문입니다. 따라서 오프더셸프 사전 훈련 모델은 긴 텍스트와 잘 작동하지 않을 것이며, 76개의 토큰 이후로 잘릴 것이므로, 짧은 텍스트로 훈련되었습니다. 

# 구현 세부 사항

## HuggingFace Transformers를 사용한 추론

HuggingFace Transformers 라이브러리를 사용하여 몇 줄의 코드로 자신의 컴퓨터에서 CLIP를 사용할 수 있습니다! 먼저 라이브러리를 가져와서 사전 훈련된 모델을 로드하세요.

<div class="content-ad"></div>

```js
import transformers

model = transformers.CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = transformers.CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
```

그런 다음 캡션/설명 목록과 이미지 목록을 만듭니다. 이미지는 url 또는 PIL 이미지일 수 있습니다.

```js
import PIL.Image

images = [PIL.Image("for_example_a_dog_image.jpeg")]
possible_classes = ["새 이미지", "개 이미지", "고양이 이미지"]
```

텍스트와 이미지을 토큰화하고 모델로 전달할 준비를 단계를 수행하는 processor를 호출합니다. 이는 일반적인 텍스트만 사용하는 경우에 토큰화 도구를 호출하는 것과 매우 유사합니다. 설명의 배치가 있으므로 모두 동일한 길이로 "패딩"하여 텐서로 저장하고 최대 시퀀스 길이(이전에 설명한대로 76)에서 긴 문장을 자르기 위해 자른다. 그런 다음 토큰화된 입력을 모델로 전달하고 텍스트 및 이미지 인코더를 통해 전파시킵니다.


<div class="content-ad"></div>

```js
torch.no_grad()을 사용하여:

    inputs = processor(text=descriptions, images=images, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
```

이제 두 가지 다른 함수를 사용하여 내적 결과 행렬을 검색할 수 있습니다. logits_per_image를 사용하면 [이미지 수, 텍스트 수] 형태의 내적 결과 행렬을 얻을 수 있고, logits_per_text를 사용하면 [텍스트 수, 이미지 수] 형태의 행렬을 얻을 수 있습니다.

```js
dot_products_per_image = outputs.logits_per_image
dot_products_per_text = outputs.logits_per_text
```

마지막으로, 각 이미지에 대한 확률 분포를 얻고 싶다면 softmax 함수를 통과시킬 수 있습니다.

<div class="content-ad"></div>

```js
probabilities = dot_products_per_image.softmax(dim=1)
```

## 구현 내부의 깊은 이해

transformers CLIP의 소스 코드는 깃허브에서 찾을 수 있습니다. 모듈식으로 잘 구현되어 있어서 좋았어요. 주요 모델은 CLIPModel 클래스에 구현되어 있으며, 아래에서 볼 수 있는 forward 메서드에서 주요 로직을 확인할 수 있어요.

<img src="/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_3.png" />


<div class="content-ad"></div>

이미지를 통해 알 수 있듯이 비전 모델과 텍스트 모델은 임베딩과 레이어 노름에 약간의 차이가 있습니다.

![이미지1](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_4.png)

![이미지2](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_5.png)
  
그러나 두 모델 모두 동일한 CLIPEncoder를 공유합니다. 이 CLIPEncoder는 주요 트랜스포머 인코더이며 많은 하위 블록으로 구성된 CLIPEncoderLayer라고 부릅니다. 트랜스포머 아키텍처에서는 각 인코더와 디코더가 N번 쌓입니다. CLIP에서는 텍스트를 생성하지 않기 때문에 디코더를 사용하지 않습니다.

<div class="content-ad"></div>


![UnderstandingOpenAIsCLIPmodel_6](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_6.png)

Each `CLIPEncoderLayer` is then comprised of the attention mechanism, a normalization layer, and a simple feedforward layer/multi-layer perceptron (MLP).

![UnderstandingOpenAIsCLIPmodel_7](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_7.png)

Finally, I went through and annotated the implementation for the multi-head attention mechanism in the following gist - enjoy!


<div class="content-ad"></div>

# 추가 작업

시작부터 언급한대로 CLIP는 다양한 방법으로 활용할 수 있으며 특히 의미 검색 유형의 응용 프로그램에서 유용하게 사용할 수 있습니다. 예를 들어, 이미지의 설명으로 검색하여 데이터베이스에서 이미지를 검색하는 데 CLIP를 사용할 수 있습니다.

CLIP 및 대안들은 이후에 등장한 많은 다중 모달 모델들의 구성 요소이기도 합니다. 예를 들어 Flamingo의 Vision Language Model에서는 텍스트 및 이미지 시퀀스를 한꺼번에 사용하여 텍스트를 생성할 수 있습니다. Flamingo는 이미지를 텍스트와 동일한 임베딩 공간으로 변환하기 위해 Vision 인코더를 사용합니다.

![image](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_8.png)

<div class="content-ad"></div>

작가들은 CLIP와 비슷한 방식으로 훈련된 자체 버전을 실험했습니다.

마지막으로 Google의 Gemini와 같은 모델은 우리가 잘 알지 못해도, 오디오와 비디오를 포함한 다양한 모달리티의 입력 데이터를 결합하는 유사한 접근법을 사용하고 있을 가능성이 높습니다!

![이미지](/assets/img/2024-06-23-UnderstandingOpenAIsCLIPmodel_9.png)

# 결론

<div class="content-ad"></div>

요약하면, CLIP은 여러 응용 프로그램에 사용할 수 있는 텍스트와 임베딩 모델로, 다중 모달 AI 시스템을 구축하는 데 사용할 수 있습니다. 또한 Python에서 CPU 상에서 몇 줄의 코드로 쉽게 실행할 수도 있습니다.

도움이 되었기를 바랍니다. 읽어 주셔서 감사합니다! 만약 즐겁게 보셨다면, 'Flamingo'에 관한 제 논문도 확인해보시는 것을 권해드립니다!