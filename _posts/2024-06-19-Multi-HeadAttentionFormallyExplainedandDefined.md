---
title: "다중 헤드 어텐션  공식적으로 설명하고 정의하기"
description: ""
coverImage: "/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_0.png"
date: 2024-06-19 19:01
ogImage: 
  url: /assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_0.png
tag: Tech
originalTitle: "Multi-Head Attention — Formally Explained and Defined"
link: "https://medium.com/towards-data-science/multi-head-attention-formally-explained-and-defined-89dc70ce84bd"
---


![이미지](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_0.png)

다중 헤드 어텐션은 자연어 처리를 혁신적으로 바꾼 트랜스포머에서 중요한 역할을 합니다. 이 메커니즘을 이해하는 것은 현재 최첨단 언어 모델의 명확한 그림을 그리는 데 필수적인 단계입니다.

몇 년 전에 소개되었고 그 후 널리 사용되고 논의되었음에도 불구하고 모호한 표기법과 형식적인 정의의 부족으로 인해 새로운 이들이 빠르게 다중 헤드 어텐션 메커니즘을 해소할 수 없었습니다.

이 기사에서는 다중 헤드 어텐션의 포관적이고 모호하지 않은 형식화를 제시하여 이 메커니즘을 쉽게 이해할 수 있도록하는 것이 목표입니다.

<div class="content-ad"></div>

새로운 개념을 더 잘 이해하기 위해서는 스스로 사용하는 것이 중요합니다. 이 기사에는 다중 헤드 어텐션에 대해 정확히 이해하기 위한 여러 연습 문제/질문과 해결책이 함께 제시됩니다.

참고: 다중 헤드 어텐션의 정의와 설명을 시작하기 전에, 라텍스 지원 부족으로 수식을 이미지로 변환하여 수학적 객체를 표시했습니다.

## 입력

먼저, 다중 헤드 어텐션 메커니즘의 입력이 무엇인지 명확히 합시다. 우리는 다중 헤드 어텐션 레이어의 입력을 다음과 같이 정의합니다:

<div class="content-ad"></div>

이곳이 있어요! 

X는 n개의 행과 d개의 열로 이루어진 행렬이에요. 그 두 차원은 다음과 같이 대응되어요:

- n: 입력 시퀀스의 길이 (토큰 수)
- d: 토큰 벡터의 차원.

## 시퀀스 길이

<div class="content-ad"></div>

일반적으로 모든 시퀀스에 대해 기본 고정 길이 n을 설정합니다. 일반적으로 "Attention Is All You Need" (Vaswani et al., 2017에서 사용된 값과 같은) 256 또는 512와 같은 값이 사용됩니다. 그런 다음, 모든 입력 시퀀스는 정확히 n개의 토큰을 가지도록 패딩되거나 자르게됩니다.

이것은 시퀀스의 단어 수로 볼 수 있습니다.

따라서 X의 각 행은 입력 시퀀스의 토큰에 해당합니다.

## 토큰 차원

<div class="content-ad"></div>

텍스트를 토큰화하면 각각의 토큰이 특성 벡터로 표현된 시퀀스로 변환됩니다.

토큰 벡터의 가장 간단한 예시는 원핫 인코딩입니다. 예를 들어, 1,000개의 가능한 토큰 세트가 있다면, 각 토큰은 1,000차원의 이진 벡터로 모델링될 수 있습니다. 여기서 각 토큰은 0으로 설정된 999개의 구성 요소와 주어진 토큰에 연결된 구성 요소에 1로 설정된 1개를 가지게 됩니다. 여기서 d는 1,000입니다.

따라서 입력 시퀀스의 n개의 각 토큰은 X의 행으로 표시되며 d개의 열이 있습니다.

## 연습문제 1 — 입력 시퀀스 모델링

<div class="content-ad"></div>

아래의 가정에 따라 문장 "attention is all you need"을 모델링하고자 합니다:

- 입력 시퀀스의 고정된 길이는 n = 8입니다.
- 모델링될 수 있는 토큰의 집합 T = '“all”, “attention”, “cat”, “is”, “need”, “transformer”, “you”'입니다.
- 토큰 벡터는 가능한 토큰 집합 T를 기반으로 한 원핫 인코딩 표현입니다.
- "End-of-Sequence" 토큰과 같은 특수 토큰은 고려하지 않습니다. (만약 이 가정을 이해하지 못한다면, 괜찮습니다.)

Q1: 여기서 토큰 벡터의 차원 d는 무엇인가요?

Q2: 방금 전에 한 가정에 따라 "attention is all you need"의 입력 행렬 X를 제시해주세요.

<div class="content-ad"></div>

## 요약

## 해결책 — 연습 문제 1

Q1: 여기서 가능한 토큰 집합 T에는 일곱 개의 토큰이 있고, 토큰을 원핫 인코딩으로 모델링한다고 가정했습니다. 따라서 d = 7 (T에있는 토큰 수).

<div class="content-ad"></div>

Q2: 먼저, n = 8이고 d = 7인 것을 알았기 때문에, 여덟 개의 행과 일곱 개의 열을 가진 행렬 X를 얻어야 한다는 것을 알 수 있습니다.

각 행은 입력 문장의 토큰에 대응해야 합니다. 그러나 알 수 있듯이, “attention is all you need”에는 다섯 개의 토큰만 포함되어 있습니다. 행렬 X에 여덟 개의 행을 어떻게 채울 수 있을까요?

한 가지 옵션은 입력 시퀀스를 빈 토큰으로 채우는 것입니다. 이렇게 하면 X의 맨 아래에 세 개의 빈 행이 생기게 됩니다.

참고: 또 다른 접근 방식은 빈 토큰을 가능한 토큰 집합에 포함하는 것입니다. 즉, T = '“all”, “attention”, “cat”, “is”, need”, “transformer”, “you”, ∅'와 같이 ∅가 빈 토큰을 나타냅니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_2.png" />

이제 한-hot 벡터를 올바르게 작성하여 X를 완료했습니다. 최종적으로 다음 행렬이 나와야 합니다:

<img src="/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_3.png" />

# Query, Key, Value

<div class="content-ad"></div>

"다중 헤드 어텐션”에서는 “다중 헤드”가 있습니다. 이는 이러한 메커니즘을 사용하는 레이어가 여러 개의 헤드를 사용한다는 것을 의미합니다.

만일 “헤드”라는 용어가 이해되지 않는다면, 이를 “매핑”이나 “레이어”로 생각하실 수 있습니다.

h를 다중 헤드 어텐션 레이어에서 사용될 어텐션 헤드의 수로 정의해봅시다.

이제 쿼리(질의), 키(검색어), 값에 대해 정의해보겠습니다."

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_4.png)

서로 다른 이름을 가지고 있지만, 쿼리, 키, 값은 본질적으로 동일한 정의를 가지고 있습니다: 입력 행렬과 가중치 행렬의 곱입니다.

여기서 k와 v가 양의 정수일 때, 가중치 행렬은 다음 행렬 공간에 있습니다:

![image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_5.png)


<div class="content-ad"></div>

가중 행렬은 h 개의 헤드 간에 다릅니다. 따라서 아래 첨자는 i이며, i는 1에서 h까지 범위입니다.

쿼리, 키 및 값 사이에는 가중 행렬이 다르므로 "Q", "K" 및 "V"의 지수가 있어서 이들을 구별합니다.

논문 "Attention Is All You Need" (Vaswani et al., 2017)에서는 일반적으로 k 및 v가 k = v = d / h로 설정됩니다.

## 문제 2 — 쿼리, 키 및 값

<div class="content-ad"></div>

쿼리 Q의 차원은 무엇인가요? 키 K의 차원은 무엇인가요? 값 V의 차원은 무엇인가요?

(아래 "요약" 이후에 솔루션 있음.)

## 요약

<div class="content-ad"></div>

## 해결책 — 연습문제 2

행렬 곱셈을 주의 깊게 읽은 후, 쿼리, 키, 밸류 행렬의 다음 차원을 얻어야 합니다:

![Matrix Dimensions](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_6.png)

# 어텐션

<div class="content-ad"></div>

주의는 다음 매핑으로 정의될 수 있습니다:

![매핑](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_7.png)

여기서 softmax 함수가 행을 따라 실행됩니다:

![softmax](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_8.png)

<div class="content-ad"></div>

알림으로써, 소프트맥스 함수는 벡터의 값을 정규화하는 방법입니다. 이 함수를 사용하면 합이 1이 되도록 벡터를 변환하여 소프트맥스의 출력이 확률 분포를 나타낼 수 있게 합니다.

## Exercise 3 — 어텐션과 행렬의 차원

다음 행렬들의 차원은 무엇인가요?

![행렬 이미지](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_9.png)

<div class="content-ad"></div>

## Exercise 4 — 주의 집중 해석

다음 구절을 해당 수식과 일치시키세요. 주어진 구절은 이전에 소개된 적은 없지만, 수학적 표현을 해석함으로써 여기서 추측할 수 있습니다.

이미지 태그를 Markdown 형식으로 변경하세요.

## Exercise 5 — 행렬 해석

<div class="content-ad"></div>

Q1: 주어진 쿼리 Q에 대해,

- Q의 한 행은 무엇을 나타내나요?
- Q의 한 열은 무엇을 나타내나요?

(동일한 해석은 키 K 및 값 V에 대해서도 가능합니다.)

Q2: 주어진 쿼리 Q와 주어진 키 K, 행 i, 열 j에 대해, 아래와 같은 계수가 나타내는 것은 무엇인가요?

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_11.png)

Q3: 특정 쿼리 Q와 주어진 키 K에 대해 다음 매트릭스의 한 행을 어떻게 해석할 수 있나요?

![Image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_12.png)

(아래 "Recap" 이후에 해답이 있습니다.)


<div class="content-ad"></div>

## 요약

![image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_13.png)

## 해결책 — 연습 문제 3

아래 행렬들에 대한 차원을 순차적으로 얻습니다:

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_14.png)

## Solution — Exercise 4

![Image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_15.png)

The (scaled) attention scores are the dot products between the projections of the input tokens both in the query space and the key space. They provide a raw score of “how much each input token attends to each input token”.


<div class="content-ad"></div>

위 균도 가중치는 이전에 언급한 주의 점수에서 확률 분포를 만듭니다.

스케일링 닷-프로덕트 주의는 값 공간에서 주의 가중치와 입력 투영을 기반으로 입력 시퀀스의 새로운 잠재 표현을 제공합니다.

## 해결책 — 연습 문제 5

질문 1: 쿼리 Q가 쿼리 공간에서 입력 X의 투영이며, Q의 치수에 기초하여 추론할 수 있는 내용은 무엇입니까?

<div class="content-ad"></div>

- Q의 한 행은 질의 공간에서 표현된 입력 토큰 벡터를 나타냅니다.
- Q의 한 열은 질의 공간의 잠재적 차원을 나타냅니다.

Q2: Q와 K의 전치(Transpose)의 곱셈에서 i번째 행과 j번째 열의 계수는 입력 시퀀스의 i번째 토큰이 j번째 토큰과 얼마나 관련되어 있는지를 나타냅니다.

이 계수가 높을수록, i번째 토큰과 j번째 토큰이 더 연관되어(~유사하게) 있습니다.

Q3: 먼저, 어텐션 가중치 행렬의 각 행에 대한 합이 1과 같아집니다.

<div class="content-ad"></div>

해당 행렬의 i행은 입력 시퀀스 토큰이 시퀀스 의미에 기여하는 정도를 모델링한 확률 분포로 해석할 수 있습니다. 토큰 i를 살펴보는 경우 시퀀스 의미에 어떤 기여를 하는지를 나타냅니다.

# 다중 헤드 어텐션

이제, 다중 헤드 어텐션 메커니즘에서 각 헤드들은 어떻게 작용할까요?

## 연결

<div class="content-ad"></div>

서로 다른 헤드의 출력은 행을 따라 연결되고 출력 가중치 행렬과 곱해집니다:

![image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_16.png)

다시 말해, 이것은 기술적인 내용이 아니며, 가장 어려운 부분은 여러 행렬의 차원을 명심하는 것입니다.

## Exercise 6 — Multi-head dimensions

<div class="content-ad"></div>

다음 행렬의 차원은 무엇입니까?

![image](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_17.png)

## Exercise 7 — 결과 해석

여러 헤드 어텐션은 처음에 기계 번역에 적용되어 영어와 독일어 간의 문장을 번역했습니다.

<div class="content-ad"></div>

입력 X와 출력 Y = MultiHead(X)의 차원을 주석으로 남겨주세요.

## 연습 8 — 왜 여러 개?

왜 여러 개의 어텐션 헤드가 필요할까요? 특히, 서로 다른 헤드가 어디에서 상호 작용하는지 확인할 수 있나요?

(아래의 "요약" 이후 답안이 제시됩니다.)

<div class="content-ad"></div>

## 요약

## 해결책 — 연습문제 6

다중 헤드 어텐션에 개입하는 이 행렬들의 차원은 다음과 같습니다:

![이미지](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_18.png)

<div class="content-ad"></div>

## 해결 방법 — 연습문제 7

입력 X의 차원과 출력 Y = MultiHead(X)의 차원이 일치하는 것을 알아채셨을 것입니다. 둘 다 n x d입니다.

따라서, 다중 헤드 어텐션의 출력은 입력의 재구성으로 해석될 수 있거나, 적어도 동일한 고정 길이의 다른 시퀀스로 해석될 수 있습니다.

다중 헤드 어텐션이 머신 번역을 위해 처음에 소개되었기 때문에, 출력은 다음과 같이 해석할 수 있습니다: 영어로 모델링된 입력 시퀀스에 대한 입력이 주어지면, 다중 헤드 어텐션 레이어는 독일어(또는 다른 어떤 언어든)로의 입력 시퀀스 번역을 모델링하는 행렬 Y를 출력합니다.

<div class="content-ad"></div>

## 해결책 — 연습문제 8

먼저, 여러 다른 헤드를 사용하는 아이디어는 토큰 간에 다른 관계에 대해 여러 헤드가 참석하도록하는 것입니다.

실제로, 다양한 헤드들은 다중 헤드 어텐션의 매우 끝에서 함께 상호작용합니다:

![다중 헤드 어텐션](/assets/img/2024-06-19-Multi-HeadAttentionFormallyExplainedandDefined_19.png)

<div class="content-ad"></div>

각 토큰에 대해 모든 헤드의 출력 값을 합산합니다. 이는 서로 다른 헤드가 상호 작용하는 곳입니다.

# 결론

종합하면, 다중 헤드 어텐션은 입력 시퀀스 X를 출력 시퀀스 Y로 변환하기 위해 두 가지를 활용하는 구성 요소로 이루어져 있습니다:

- 어텐션 메커니즘
- 여러 어텐션 헤드의 연결

<div class="content-ad"></div>

이 메커니즘을 올바르게 이해하기 위해서는 계산 중 사용된 모든 행렬의 차원을 명확히 확인하는 것이 가장 중요합니다.