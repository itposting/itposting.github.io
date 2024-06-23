---
title: "트랜스포머 쉽게 이해하기 Part 3 멀티-헤드 어텐션 심층 분석"
description: ""
coverImage: "/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_0.png"
date: 2024-06-23 20:02
ogImage: 
  url: /assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_0.png
tag: Tech
originalTitle: "Transformers Explained Visually (Part 3): Multi-head Attention, deep dive"
link: "https://medium.com/towards-data-science/transformers-explained-visually-part-3-multi-head-attention-deep-dive-1c1ff1024853"
---


## 직관적인 트랜스포머 시리즈 NLP

이것은 트랜스포머에 관한 제 시리즈에서 세 번째 글입니다. 우리는 위에서 아래로의 방식으로 그 기능을 다루고 있습니다. 이전 글에서는 트랜스포머가 무엇인지, 그 구조, 그리고 어떻게 작동하는지 배웠습니다.

이번 글에서는 한 발 더 나아가 Multi-head Attention에 대해 더 자세히 파고들 것입니다. 이것이 트랜스포머의 두뇌라고 할 수 있습니다.

시리즈에서 이전 및 다음 글에 대한 간단한 요약입니다. 내 목표는 무엇이 어떻게 작동하는지만 아는 것이 아니라, 왜 그런 방식으로 작동하는지 이해하는 것입니다.

<div class="content-ad"></div>

- 기능 개요 (Transformer의 사용 방법 및 RNN보다 우수한 점. 아키텍처 구성 요소 및 훈련 및 추론 중의 동작)
- 작동 방식 (내부 운영 end-to-end. 데이터 흐름 및 수행되는 계산, 행렬 표현 등)
- Multi-head Attention - 이 기사 (Transformer 전체에서 Attention 모듈의 작동 방식)
- 왜 Attention이 성능을 향상시키는가 (Attention이 하는 일뿐만 아니라 왜 잘 작동하는지. Attention이 문장 내 단어 간의 관계를 어떻게 파악하는지)

그리고 자연어 처리 응용 프로그램에 관심이 있다면, 좋아할만한 기사가 몇 개 더 있습니다.

- Beam Search (음성인식 및 자연어 처리 응용프로그램에서 일반적으로 사용되는 알고리즘으로 예측을 향상하는 방법)
- Bleu Score (Bleu Score 및 Word Error Rate는 자연어 처리 모델의 두 가지 필수적인 메트릭스입니다)

# Transformer에서 어떻게 Attention이 사용되는가

<div class="content-ad"></div>

Part 2에서 논의한 대로, 어텐션은 Transformer에서 세 곳에서 사용됩니다:

- 인코더의 셀프 어텐션 - 입력 시퀀스가 자신에게 주의를 기울임
- 디코더의 셀프 어텐션 - 대상 시퀀스가 자신에게 주의를 기울임
- 디코더의 인코더-디코더 어텐션 - 대상 시퀀스가 입력 시퀀스에 주의를 기울임

![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_0.png)

어텐션 입력 매개변수 - 쿼리(Query), 키(Key), 값(Value)

<div class="content-ad"></div>

주의 계층은 Query, Key 및 Value로 알려진 세 매개변수 형식으로 입력을 받습니다.

세 매개변수는 각 단어가 벡터로 표현된 시퀀스와 유사한 구조를 갖습니다.

인코더 셀프 어텐션

입력 시퀀스는 입력 임베딩 및 위치 인코딩에 공급되어 각 입력 시퀀스의 각 단어에 대한 의미와 위치를 캡처하는 인코딩 표현을 생성합니다. 이것은 모두 Query, Key 및 Value 매개변수에 공급되며, 첫 번째 인코더의 셀프 어텐션에서 각 입력 시퀀스의 각 단어에 대한 인코딩 표현을 생성합니다. 이제 각 단어에 대한 어텐션 점수도 포함된 새 인코딩 표현입니다. 이것이 스택 내의 모든 인코더를 통과할 때마다 각 셀프 어텐션 모듈은 각 단어의 표현에 자체 어텐션 점수를 추가합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_1.png)

디코더 셀프 어텐션

디코더 스택으로 오는 경우, 목표 시퀀스가 출력 임베딩과 위치 인코딩으로 전달됩니다. 이는 목표 시퀀스의 각 단어에 대한 의미와 위치를 캡처한 인코딩 표현을 생성합니다. 이것은 첫 번째 디코더의 Self-Attention에서 모든 세 가지 매개변수인 Query, Key, Value로 전달되며, 목표 시퀀스의 각 단어에 대한 인코딩 표현을 생성하고 각 단어의 주의 점수를 반영합니다.

레이어 정규화를 거친 후, 이것은 첫 번째 디코더의 인코더-디코더 어텐션에서 Query 매개변수로 전달됩니다.


<div class="content-ad"></div>

에 대한 관심

이에 더불어 스택 내 최종 인코더의 출력은 Encoder-Decoder Attention의 Value 및 Key 매개변수로 전달됩니다.

따라서 Encoder-Decoder Attention은 디코더 Self-Attention의 대상 시퀀스와 인코더 스택의 입력 시퀀스의 표현을 받게 됩니다. 이로써 입력 시퀀스의 관심 점수의 영향을 포착하는 대상 시퀀스 단어마다 관심 점수를 포함하는 표현을 생성합니다.

이것은 스택 내 모든 디코더를 통해 전달되므로, 각 Self-Attention 및 각 Encoder-Decoder Attention은 각 단어의 표현에 고유한 관심 점수를 추가합니다.

<div class="content-ad"></div>

# 다중 어텐션 헤드

Transformer에서 어텐션 모듈은 병렬로 동시에 여러 번 계산을 반복합니다. 각각을 어텐션 헤드라고 합니다. 어텐션 모듈은 쿼리(Query), 키(Key), 값(Value) 매개변수를 N개로 분할하고 각 분할을 별도로 헤드를 통해 전달합니다. 모든 이 유사한 어텐션 계산은 그런 다음 합쳐져 최종 어텐션 점수를 생성합니다. 이를 다중 헤드 어텐션이라고 하며, 이를 통해 Transformer는 단어마다 여러 관계와 뉘앙스를 인코딩하는 강력한 능력을 갖게 됩니다.

![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_2.png)

내부에서 데이터가 어떻게 처리되는지 정확히 이해하기 위해 Transformer를 훈련하여 번역 문제를 해결하는 과정에서 어텐션 모듈의 작동 방식을 살펴보겠습니다. 영어로 된 입력 시퀀스('You are welcome')와 스페인어로 된 대상 시퀀스('De nada')로 구성된 훈련 데이터의 샘플을 사용하겠습니다.

<div class="content-ad"></div>

# 주목해야 할 하이퍼파라미터

데이터 차원을 결정하는 세 가지 하이퍼파라미터가 있습니다:

- 임베딩 크기 — 임베딩 벡터의 너비입니다 (예시에서는 너비 6을 사용합니다). 이 차원은 Transformer 모델 전반에서 전달되며 때로는 '모델 크기'와 같은 다른 이름으로 불리기도 합니다.
- 쿼리 크기 (키 및 값 크기에 동일) — 쿼리, 키 및 값 행렬을 만들기 위해 세 개의 선형 레이어에서 사용되는 가중치의 크기입니다 (예시에서는 쿼리 크기를 3으로 사용합니다).
- 어텐션 헤드의 수 (예시에서는 2개의 헤드를 사용합니다)

또한 샘플의 수를 나타내는 배치 크기가 있습니다.

<div class="content-ad"></div>

# 입력 레이어

입력 임베딩 및 위치 인코딩 레이어는 (샘플 수, 시퀀스 길이, 임베딩 크기) 형태의 행렬을 생성하여 스택 내 첫 번째 인코더의 쿼리, 키 및 값에 공급됩니다.

![](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_3.png)

시각화를 간단하게 만들기 위해 이미지에서 배치 차원을 제거하고 나머지 차원에 초점을 맞추겠습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_4.png)

## 선형 레이어

쿼리(Query), 키(Key), 값(Value)에 대한 세 개의 별개의 선형 레이어가 있습니다. 각 선형 레이어는 고유한 가중치를 가지고 있습니다. 입력은 이러한 선형 레이어를 거쳐 Q, K, V 행렬을 생성합니다.

## 어텐션 헤드별 데이터 분할


<div class="content-ad"></div>

이제 데이터가 여러 개의 Attention head로 분할되어 각각 독립적으로 처리됩니다.

그러나 이해해야 할 중요한 점은 이것이 논리적인 분할임을 주의해야 합니다. Query, Key 및 Value는 물리적으로 분리된 행렬로 분할되지 않습니다. Query, Key 및 Value에 대해 각 Attention head마다 하나의 데이터 행렬이 사용되며, 각 Attention head의 논리적으로 분리된 섹션이 행렬에 있습니다. 마찬가지로 Attention head마다 별도의 Linear layer가 없습니다. 모든 Attention head가 동일한 Linear layer를 공유하지만 각자의 논리적인 데이터 행렬 섹션에 작용합니다.

Linear layer의 가중치는 head별로 논리적으로 분할됩니다.

이 논리적인 분할은 입력 데이터와 Linear layer의 가중치를 Attention head별로 균등하게 분할함으로써 이뤄집니다. 위와 같이 Query Size를 선택함으로써 이를 달성할 수 있습니다:

<div class="content-ad"></div>


Query Size = Embedding Size / Number of heads

![Image 1](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_5.png)

In our example, that is why the Query Size = 6/2 = 3. Even though the layer weight (and input data) is a single matrix we can think of it as ‘stacking together’ the separate layer weights for each head.

![Image 2](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_6.png)


<div class="content-ad"></div>

모든 헤드에 대한 계산은 N 개의 별도 연산이 필요한 대신 단일 행렬 연산을 통해 달성할 수 있습니다. 이렇게 하면 계산이 효율적으로 이루어지고 모델이 단순해지며 선형 레이어가 더 적게 필요하지만 독립적인 어텐션 헤드의 힘을 여전히 발휘할 수 있습니다.

Q, K 및 V 행렬 재구성

선형 레이어에서 출력된 Q, K 및 V 행렬을 명시적인 헤드 차원이 포함된 모양으로 재구성합니다. 이제 각 '슬라이스'가 하나의 헤드당 하나의 행렬에 해당합니다.

이 행렬은 다시 헤드와 시퀀스 차원을 교체하여 재구성됩니다. 배치 차원은 그림에 표시되지 않았지만, Q의 차원은 이제 (Batch, Head, Sequence, Query size)입니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_7.png)

아래 그림에서는 Linear 레이어에서 나온 예제 Q 매트릭스를 분할하는 전체 과정을 확인할 수 있습니다.

최종 단계는 시각화용입니다 — Q 매트릭스는 단일 매트릭스이지만, 논리적으로 독립된 각 head마다 별도의 Q 매트릭스로 생각할 수 있습니다.

![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_8.png)

<div class="content-ad"></div>

우리는 어텐션 점수를 계산할 준비가 되어 있어요.

# 각 헤드에 대한 어텐션 점수 계산

이제 우리는 헤드 간에 분할된 3개의 행렬인 Q, K 및 V를 소유하고 있어요. 이들은 어텐션 점수를 계산하는 데 사용돼요.

우리는 하나의 헤드에 대한 연산을 보여줄 거에요. 이때는 마지막 두 차원(시퀀스 및 쿼리 크기)만 사용하고 처음 두 차원(배치 및 헤드)은 건너뛸 거에요. 본질적으로, 우리는 보고 있는 연산이 각 헤드와 각 배치 샘플마다 "반복"되는 것으로 상상할 수 있어요 (물론 실제로는 반복문이 아니라 단일 행렬 작업으로 이루어지고 있어요).

<div class="content-ad"></div>

첫 번째 단계는 Q와 K 사이의 행렬 곱셈을 수행하는 것입니다.

![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_9.png)

결과에 Mask 값이 추가됩니다. 인코더 셀프 어텐션에서는 패딩 값을 마스킹하여 주의 점수에 참여하지 않도록합니다.

다른 마스크가 디코더 셀프 어텐션 및 디코더 인코더 어텐션에서 적용되며, 이에 대해서는 흐름에서 조금 뒤에 다룹니다.

<div class="content-ad"></div>


![Transformers Explained Visually Part 3](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_10.png)

The result is now scaled by dividing by the square root of the Query size, and then a Softmax is applied to it.

![Transformers Explained Visually Part 3](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_11.png)

Another matrix multiplication is performed between the output of the Softmax and the V matrix.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_12.png" />

인코더 Self-attention의 완전한 어텐션 점수 계산은 다음과 같습니다:

<img src="/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_13.png" />

# 각 헤드의 어텐션 점수를 병합합니다

<div class="content-ad"></div>

각 헤드에 대해 별도의 주의 점수가 있습니다. 이것들을 한 가지 점수로 결합해야 합니다. 이 병합 작업은 본질적으로 분할 작업의 반대입니다.

헤드 차원을 제거하여 결과 행렬을 단순히 재구성함으로써 수행됩니다. 이 과정은 다음과 같습니다:

- Attention Score 행렬을 재구성하여 헤드 및 시퀀스 차원을 교환합니다. 다시 말해, 행렬 모양이 (배치, 헤드, 시퀀스, 쿼리 크기)에서 (배치, 시퀀스, 헤드, 쿼리 크기)로 변경됩니다.
- 헤드 차원을 축소하여 (배치, 시퀀스, 헤드 * 쿼리 크기)로 재구성합니다. 이를 통해 각 헤드의 주의 점수 벡터를 단일 병합된 주의 점수로 연결합니다.

임베딩 크기 = 헤드 * 쿼리 크기이므로 병합된 점수는 (배치, 시퀀스, 임베딩 크기)입니다. 아래 그림에서는 예제 점수 행렬에 대한 병합 과정을 자세히 볼 수 있습니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_14.png" />

# End-to-end Multi-head Attention

Putting it all together, this is the end-to-end flow of the Multi-head Attention.

<img src="/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_15.png" />


<div class="content-ad"></div>

# 다중 헤드 분할은 더 풍부한 해석을 제공합니다

임베딩 벡터는 단어의 의미를 포착합니다. 다중 헤드 어텐션의 경우, 입력(및 대상) 시퀀스의 임베딩 벡터가 여러 헤드에 걸쳐 논리적으로 분할된다는 것을 보았습니다. 이것의 의미는 무엇인가요?

![image](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_16.png)

이것은 임베딩의 별도 섹션들이 시퀀스 내 다른 단어와의 관련성에 따라 각 단어의 의미의 다른 측면을 학습할 수 있다는 것을 의미합니다. 이를 통해 트랜스포머는 시퀀스의 보다 풍부한 해석을 제공할 수 있습니다.

<div class="content-ad"></div>

이것은 현실적인 예시가 아닐 수도 있지만 직관을 키우는 데 도움이 될 수 있습니다. 예를 들어, 하나의 섹션은 명사의 ‘성별’(남성, 여성, 중성)을 포함할 수 있고, 다른 하나는 명사의 ‘수’(단수 대 복수)를 포함할 수 있습니다. 이는 번역 중에 중요할 수 있는데, 많은 언어에서 사용해야 하는 동사가 이러한 요인에 따라 달라질 수 있습니다.

# 디코더 셀프 어텐션 및 마스킹

디코더 셀프 어텐션은 인코더 셀프 어텐션과 마찬가지로 작동하지만 대상 시퀀스의 각 단어에 대해 작동합니다.

![이미지](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_17.png)

<div class="content-ad"></div>

같은 방법으로, Masking은 대상 시퀀스에서 패딩 단어를 가려냅니다.

# 디코더 인코더-디코더 어텐션 및 마스킹

디코더 인코더-디코더 어텐션은 두 개의 소스에서 입력을 받습니다. 따라서, 각 입력 단어 간 상호 작용을 계산하는 인코더 자가 어텐션과 달리, 각 대상 단어 간 상호 작용을 계산하는 디코더 자가 어텐션은 각 대상 단어와 각 입력 단어 간의 상호 작용을 계산합니다.

![image](/assets/img/2024-06-23-TransformersExplainedVisuallyPart3Multi-headAttentiondeepdive_18.png)

<div class="content-ad"></div>

따라서 결과 Attention Score의 각 셀은 하나의 Q (즉, 대상 시퀀스 단어)와 모든 다른 K (즉, 입력 시퀀스) 단어 및 모든 V (즉, 입력 시퀀스) 단어 간 상호 작용을 나타냅니다.

이와 유사하게, Masking은 대상 출력의 후속 단어를 마스킹하여 시리즈의 두 번째 기사에서 자세히 설명했던 대로 수행됩니다.

# 결론

이를 통해 트랜스포머의 어텐션 모듈이 무엇을 하는지에 대한 좋은 감을 제공했기를 바랍니다. 두 번째 기사에서 확인한 트랜스포머의 end-to-end 흐름과 함께 조합하면 이제 전체 트랜스포머 아키텍처의 상세 운영을 다루었습니다.

<div class="content-ad"></div>

이제 우리는 Transformer가 정확히 무엇을 하는지 이해했습니다. 그러나 Transformer의 Attention이 왜 그런 계산을 수행하는지에 대한 질문에 완전히 대답하지 않았습니다. 왜 Query, Key 및 Value 개념을 사용하고, 방금 본 것처럼 왜 행렬 곱셈을 수행하는 걸까요?

우리는 '각 단어 간의 관계를 포착한다'는 희미한 직관을 가지고 있지만, 이게 정확히 무엇을 의미하는지는 무엇일까요? Transformer의 Attention이 앞의 각 단어의 미묘한 차이를 이해하는 능력을 가지도록 하는 방법은 무엇일까요?

그것은 흥미로운 질문이며이 시리즈의 마지막 글에 대한 주제입니다. 그것을 이해하면 우리는 진정으로 Transformer 아키텍처의 우아함을 이해할 것입니다.

마지막으로, 이 기사를 좋아하셨다면, 오디오 딥 러닝, 지리 위치 기계 학습 및 이미지 캡션 아키텍처에 대한 다른 시리즈도 즐기실 수 있을 것입니다.

<div class="content-ad"></div>

계속해서 배워봐요!