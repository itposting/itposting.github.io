---
title: "MLX로부터 GPT를 처음부터 만들어보기"
description: ""
coverImage: "/assets/img/2024-06-19-GPTfromScratchwithMLX_0.png"
date: 2024-06-19 03:00
ogImage: 
  url: /assets/img/2024-06-19-GPTfromScratchwithMLX_0.png
tag: Tech
originalTitle: "GPT from Scratch with MLX"
link: "https://medium.com/towards-data-science/gpt-from-scratch-with-mlx-acf2defda30e"
---


## MacBook에서 GPT-2 정의 및 훈련하기

![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_0.png)

이 게시물의 목표는 MLX, Apple 실리콘을 위한 Apple의 기계 학습 라이브러리를 사용하여 GPT-2를 처음부터 정의하고 훈련하는 과정을 안내하는 것입니다. 토크나이저에서 샘플링까지 모든 과정을 상세히 다루고자 합니다. Karpathy의 훌륭한 GPT 처음부터 튜토리얼 영감을 받아, 우리는 Shakespeare의 작품에 대해 모델을 훈련할 것입니다. 우리는 비어 있는 Python 파일로 시작하여 Shakespeare 스타일 텍스트를 작성할 수 있는 소프트웨어로 끝낼 것입니다. 그리고 이 모든 것을 훨씬 빠르게 가능하게 하는 MLX에서 모두 구축할 것입니다.

본 게시물은 따라하며 체험하는 것이 가장 좋습니다. 코드는 아래 리포지토리에 포함되어 있으며 이를 열어 참조하는 것을 권장합니다.

<div class="content-ad"></div>

# 목차

- 데이터 준비
- GPT-2 코딩
- 입력 임베딩
- 위치 임베딩
- 셀프 어텐션
- 키, 쿼리 및 값
- 멀티헤드 어텐션
- MLP
- 블록
- 레이어 정규화 및 스킵 연결
- 순방향 패스
- 샘플링
- 초기화
- 훈련 루프
- 참고 자료

# 데이터 준비

mlx를 설치하고 다음 임포트를 실행하십시오.

<div class="content-ad"></div>

```js
import mlx.core as mx
import mlx.nn as nn
import mlx.optimizers as optim
import mlx.utils as utils
import numpy as np
import math
```

LLM 훈련의 첫 번째 단계는 큰 텍스트 데이터 코퍼스를 수집한 다음 토큰화하는 것입니다. 토큰화는 텍스트를 정수로 매핑하는 작업으로, LLM에 공급할 수 있습니다. 이 모델의 훈련 코퍼스는 셰익스피어의 작품들을 연결한 것입니다. 이는 대략 100만 글자이며 다음과 같습니다:

```js
First Citizen:
Before we proceed any further, hear me speak.

All:
Speak, speak.

First Citizen:
You are all resolved rather to die than to famish?

All:
Resolved. resolved.

First Citizen:
First, you know Caius Marcius is chief enemy to the people.
...
```

먼저 파일을 하나의 긴 문자열로 읽어 text 변수에 저장합니다. 그런 다음 set() 함수를 사용하여 텍스트에 있는 모든 고유한 문자를 얻어서 우리의 어휘가 됩니다. vocab을 출력하여 우리의 어휘에 있는 모든 문자를 하나의 문자열로 볼 수 있으며, 우리는 총 65개의 문자가 있어서 이것이 우리의 토큰이 될 것입니다.

<div class="content-ad"></div>


# 단어장 생성하기
with open('input.txt', 'r', encoding='utf-8') as f:
    text = f.read()
vocab = sorted(list(set(text)))
vocab_size = len(vocab)

print(''.join(vocab))
# !$&',-.3:;?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
print(vocab_size)
# 65


생산 모델은 바이트 페어 인코딩과 같은 토큰화 알고리즘을 사용하여 하위 단어 청크의 더 큰 어휘를 생성할 것입니다. 오늘 우리의 초점은 아키텍처에 있기 때문에, 문자 수준의 토큰화를 계속할 것입니다. 다음으로, 단어장을 정수로 매핑하여 토큰 ID로 알려진 것으로 이동할 것입니다. 그런 다음 텍스트를 토큰으로 인코딩하고 문자열로 다시 디코딩할 수 있습니다.


# 단어장을 정수로 매핑하기
itos = {i:c for i,c in enumerate(vocab)} # int to string
stoi = {c:i for i,c in enumerate(vocab)} # string to int
encode = lambda x: [stoi[c] for c in x]
decode = lambda x: ''.join([itos[i] for i in x])

print(encode("hello world"))
# [46, 43, 50, 50, 53, 1, 61, 53, 56, 50, 42]
print(decode(encode("hello world")))
# hello world


모든 문자 및 해당 어휘의 인덱스를 반복하여 숫자를 문자에 매핑하는 itos와 문자를 숫자에 매핑하는 stoi 사전을 생성하기 위해 enumerate() 함수를 사용합니다. 그런 다음 이러한 매핑을 사용하여 encode 및 decode 함수를 만듭니다. 이제 전체 텍스트를 인코딩하고 훈련 및 검증 데이터로 나눌 수 있습니다.


<div class="content-ad"></div>

```js
데이터 = 인코딩(텍스트)
분할 = int(0.9 * len(데이터))
훈련_데이터 = 데이터[:분할]
검증_데이터 = 데이터[분할:]
```

현재 훈련 데이터는 토큰들의 매우 긴 문자열입니다. 그러나 이전 토큰들이 주어졌을 때 다음 토큰을 예측하는 모델을 훈련하려고 합니다. 따라서 데이터셋은 입력이 토큰 문자열이고 레이블이 올바른 다음 토큰인 예제로 구성되어야 합니다. 다음 토큰을 예측하는 데 사용되는 최대 토큰 수인 context length라는 모델 매개변수를 정의해야 합니다. 훈련 예제는 우리의 context length의 길이가 될 것입니다.

처음 ctx_len+1 개의 토큰을 살펴봅시다.

```js
ctx_len = 8
print(훈련_데이터[:ctx_len + 1])
# [18, 47, 56, 57, 58,  1, 15, 47, 58]
# x: [18, 47, 56, 57, 58,  1, 15, 47] | y: 58
```

<div class="content-ad"></div>

이 예제는 인풋이 "18, 47, 56, 57, 58, 1, 15, 47"이고, 원하는 아웃풋이 "58"인 트레이닝 예제입니다. 이는 8 토큰의 컨텍스트를 가지고 있습니다. 그러나 생성 중에 필요한 7, 6, 5 ... 0개의 토큰만을 가지고 다음 토큰을 예측할 수 있도록 모델을 훈련시키고 싶습니다. 따라서 이 예제에 포함된 8개의 하위 예제를 고려합니다:

```js
ctx_len = 8
print(train_data[:ctx_len + 1])
# [18, 47, 56, 57, 58,  1, 15, 47, 58]
# 8 sub examples
# [18] --> 47
# [18, 47] --> 56
# [18, 47, 56] --> 57
# [18, 47, 56, 57] --> 58
# [18, 47, 56, 57, 58] --> 1
# [18, 47, 56, 57, 58, 1] --> 15
# [18, 47, 56, 57, 58, 1, 15] --> 47
# [18, 47, 56, 57, 58, 1, 15, 47] --> 58
```

라벨은 간단히 왼쪽으로 이동한 인풋입니다.

```js
print("inputs: ", train_data[:ctx_len])
print("labels: ", train_data[1:ctx_len+1]) # labels = inputs indexed 1 higher
# inputs: [18, 47, 56, 57, 58,  1, 15, 47]
# labels: [47, 56, 57, 58,  1, 15, 47, 58]
```

<div class="content-ad"></div>

인덱스 0에서 입력은 18이고 라벨은 47입니다. 인덱스 1에서 입력은 인덱스 1을 포함하여 그 이전 모든 것, 즉 [18, 47]이고 라벨은 56입니다. 등등. 이제 라벨이 입력 순서에서 한 단계 상위로 색인화됨을 이해했으므로 데이터셋을 구축할 수 있습니다.

```js
# 훈련 및 검증 데이터 세트 생성
ctx_len = 8
X_train = mx.array([train_data[i:i+ctx_len] for i in range(0, len(train_data) - ctx_len, ctx_len)])
y_train = mx.array([train_data[i+1:i+ctx_len+1] for i in range(0, len(train_data) - ctx_len, ctx_len)])
X_val = mx.array([val_data[i:i+ctx_len] for i in range(0, len(val_data) - ctx_len, ctx_len)])
y_val = mx.array([val_data[i+1:i+ctx_len+1] for i in range(0, len(val_data) - ctx_len, ctx_len)])
```

우리는 데이터를 반복하고 입력(X)으로 ctx_len 크기의 청크를 가져와서 같은 청크를 라벨(y)로 하나 높은 색인에서 가져옵니다. 그런 다음 이 Python 리스트를 mlx 배열 객체로 만듭니다. 모델 내부로 mlx를 사용할 것이므로 입력을 mlx 배열로 만들고 싶습니다.

그리고 한 가지 더. 훈련 중에 모델에 한 번에 하나의 예제만 전달하고 싶지 않습니다. 효율성을 위해 병렬로 여러 예제를 한꺼번에 전달하고 싶습니다. 이 예제 그룹을 우리의 배치라고 하며, 그룹 내의 예제 수가 배치 크기입니다. 따라서 훈련용 배치를 생성하는 함수를 정의합니다.

<div class="content-ad"></div>

```js
def get_batches(X, y, b_size, shuffle=True):
    if shuffle:
        ix = np.arange(X.shape[0])
        np.random.shuffle(ix)
        ix = mx.array(ix)
        X = X[ix]
        y = y[ix]
    for i in range(0, X.shape[0], b_size):
        input = X[i:i+b_size]
        label = y[i:i+b_size]
        yield input, label
```

만약 shuffle=True라면, 데이터를 임의로 섞은 인덱스로 인덱싱하여 데이터를 섞습니다. 그런 다음 데이터 세트를 반복하고 입력 및 레이블 데이터 세트에서 배치 크기 청크를 반환합니다. 이 청크는 미니 배치로 알려져 있으며 병렬로 처리하는 예제를 쌓은 것입니다. 이러한 미니 배치는 모델 훈련 중에 우리의 입력이 될 것입니다.

다음은 컨텍스트 길이가 8 인 4 개의 예제의 미니 배치 예제입니다.

![2024-06-19-GPTfromScratchwithMLX_1.png](/assets/img/2024-06-19-GPTfromScratchwithMLX_1.png)


<div class="content-ad"></div>

32 개의 다음 토큰 예측 문제가 포함된 미니배치입니다. 모델은 입력의 각 토큰에 대해 다음 토큰을 예측하고 레이블은 손실을 계산하는 데 사용됩니다. 입력의 각 색인에 대한 다음 토큰이 포함된 것을 주목해주세요.

이 텐서들의 형태가 복잡해질 것을 염두에 두시면 좋겠어요. 지금은 일단, 우리가 모델에 (배치 크기, ctx_len) 모양의 텐서를 입력할 것이라는 것만 기억해주세요.

# 코딩 GPT-2

GPT-2 아키텍처를 살펴보고 구현하려는 것에 대한 개요를 파악해봅시다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_2.png)

이게 혼란스러워 보이더라도 걱정하지 마세요. 우리는 바닥부터 꼭대기로 한 단계씩 구현할 거에요. 먼저 입력 임베딩을 구현하는 것부터 시작해봅시다.

## 입력 임베딩

입력 임베딩 레이어의 목적은 토큰 ID를 벡터로 매핑하는 것입니다. 각 토큰은 모델을 통해 전달될 때 그것에 대한 표현으로 사용될 벡터로 매핑됩니다. 각 토큰에 대한 벡터는 모델을 통해 전달되면서 정보를 축적 및 교환하고, 결국 다음 토큰을 예측하는 데 사용될 것입니다. 이러한 벡터들을 임베딩(embedding)이라고 합니다.

<div class="content-ad"></div>

토큰 ID를 벡터로 매핑하는 가장 간단한 방법은 조회 테이블을 통해 할 수 있습니다. 각 토큰에 대한 임베딩 벡터가 있는 (vocab_size, n_emb) 크기의 행렬을 만듭니다. 이 행렬을 임베딩 가중치라고 합니다.

![image](/assets/img/2024-06-19-GPTfromScratchwithMLX_3.png)

다이어그램은 크기가 (65, 6)인 임베딩 레이어의 예시를 보여줍니다. 이는 어휘 사전에 65개의 토큰이 있고 각각이 길이가 6인 임베딩 벡터로 표현됨을 의미합니다. 입력된 시퀀스는 임베딩 가중치를 색인하여 각 토큰에 해당하는 벡터를 얻는 데 사용됩니다. 모델에 입력하는 미니배치를 기억하십니까? 원래 미니배치는 크기가 (batch_size, ctx_len)입니다. 임베딩 레이어를 통과한 후 크기는 (batch_size, ctx_len, n_emb)입니다. 각 토큰이 단일 정수가 아니라 길이가 n_emb인 벡터임을 의미합니다.

이제 코드에서 임베딩 레이어를 정의해봅시다.

<div class="content-ad"></div>

```python
n_emb = 6 # 파일 맨 위에 이러한 하이퍼파라미터를 추가할 수 있어요
class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.wte = nn.Embedding(vocab_size, n_emb)
```

우리의 구현을 정리하기 위한 클래스를 정의할 거예요. mlx의 기능을 활용하기 위해 nn.Module을 서브클래스화할 거예요. 그럼 init 함수에서는 슈퍼클래스 생성자를 호출하고 wte라고 불리는 토큰 임베딩 레이어를 초기화할 거예요.

## 위치 임베딩

다음은 위치 임베딩이에요. 위치 임베딩의 목적은 시퀀스에서 각 토큰의 위치에 대한 정보를 인코딩하는 거예요. 이걸 우리의 입력 임베딩에 추가해서 각 토큰의 완전한 표현을 얻을 수 있어요. 그 표현에는 시퀀스에서 토큰의 위치에 대한 정보가 담겨있어요.


<div class="content-ad"></div>

```python
class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.wte = nn.Embedding(vocab_size, n_emb) # 토큰 임베딩
        self.wpe = nn.Embedding(ctx_len, n_emb) # 위치 임베딩
```

위치 임베딩은 토큰 임베딩과 동일한 방식으로 작동합니다. 하지만 각 토큰마다 행이 있는 것 대신, 각 가능한 위치 인덱스마다 행이 있습니다. 이는 임베딩 가중치의 모양이 (ctx_len, n_emb)가 됨을 의미합니다. 이제 GPT 클래스에 __call__ 함수를 구현해보겠습니다. 이 함수에는 모델의 forward pass가 포함될 것입니다.

```python
# 텐서 모양 주석
def __call__(self, x):
    B, T = x.shape # (B = 배치 크기, T = ctx_len)
    tok_emb = self.wte(x) # (B, T, n_emb)
    pos_emb = self.wpe(mx.arange(T)) # (T, n_emb)
    x = tok_emb + pos_emb # (B, T, n_emb)
```

먼저, 입력의 차원을 B와 T 변수로 나누어 보다 쉽게 처리합니다. 시퀀스 모델링 맥락에서 B와 T는 일반적으로 "배치"와 "시간" 차원을 나타내는 약어로 사용됩니다. 이 경우, 시퀀스의 "시간" 차원은 컨텍스트 길이입니다.

<div class="content-ad"></div>

다음으로 토큰 및 위치 임베딩을 계산합니다. 위치 임베딩의 경우 입력이 mx.arange(T)임에 유의하십시오. 이는 우리가 임베딩하고자 하는 위치인 0부터 T-1까지의 연속 정수 배열을 출력합니다. 임베딩 레이어를 통과한 후에는 각 위치에 대해 n_emb 길이의 벡터를 추출하므로 모양이 (T, n_emb)인 텐서가 생성됩니다. pos_emb가 tok_emb과 형태가 다르더라도 mlx가 브로드캐스트 또는 배치 차원을 통해 pos_emb을 복제하여 요소별 덧셈을 허용하기 때문에 두 값을 더할 수 있습니다. 마지막으로 덧셈을 수행하여 토큰의 새로운 표현을 얻습니다.

## 셀프 어텐션

지금까지 각 토큰의 표현 벡터는 독립적으로 계산되었습니다. 그들은 어떠한 정보를 교환할 기회도 가지지 못했습니다. 이는 주변 맥락에 따라 단어의 의미와 사용이 의존되므로 언어 모델링에서 직관적으로 나쁜 접근입니다. 셀프 어텐션은 이전 토큰으로부터 정보를 현재 토큰으로 통합하는 방법입니다.

먼저, 가장 단순한 접근 방식을 살펴보겠습니다. 만약 각 토큰을 단순히 해당 표현 벡터의 평균으로 표현하고 그 이전의 모든 토큰의 벡터를 더한다면 어떨까요? 이렇게 하면 이전 토큰들로부터 정보를 현재 토큰의 표현에 담을 수 있습니다. 어떻게 보이게 될까요?

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_4.png)

하지만 self-attention은 for-loop를 사용하지 않습니다. 핵심 아이디어는 이전 토큰의 평균을 행렬 곱셈으로 얻을 수 있다는 것입니다!

![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_5.png)

입력 시퀀스를 특별한 행렬로 왼쪽부터 곱하면 원하는 결과를 얻을 수 있습니다. 이 행렬을 주목해보면 이는 어텐션 가중치라고 알려져 있습니다. 어텐션 가중치 행렬의 각 행은 주어진 토큰의 표현에 각 다른 토큰이 얼마나 많이 기여하는지를 나타냅니다. 예를 들어, 두 번째 행의 경우 [0.5, 0.5, 0, 0]입니다. 이것은 두 번째 행의 결과가 0.5*토큰1 + 0.5*토큰2 + 0*토큰3 + 0*토큰4, 즉 토큰1과 토큰2의 평균이 됨을 의미합니다. 어텐션 가중치는 하삼각 행렬입니다 (우상단 항목이 0). 이는 미래 토큰이 주어진 토큰의 표현에 포함되지 않도록 보장합니다. 이는 토큰이 이전 토큰과만 통신할 수 있도록 하며, 생성 중에 모델은 이전 토큰에만 액세스할 수 있는 것이 보장됩니다.


<div class="content-ad"></div>

어떻게 주의 집중 가중치 행렬을 생성할 수 있는지 살펴봅시다.

![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_6.png)

주의 가중치 행렬을 구성하는 배열을 만들고 오른쪽 상단 항목에 -inf를 넣은 다음 행별 softmax를 수행하면 원하는 주의 가중치를 얻을 수 있습니다. 이 작업을 수행하는 것으로 이 작업이 작동하는 방법을 확인하는 것이 좋습니다. 핵심은 (ctx_len, ctx_len) 크기의 배열을 가지고 각 행에 softmax를 수행하여 합계가 1이 되는 주의 가중치를 얻을 수 있다는 것입니다.

이제 naive 자기 주의 영역을 벗어나 볼 수 있습니다. 이전 토큰을 간단히 평균화하는 대신 이전 토큰에 대한 임의의 가중 합계를 사용합니다. 임의의 행렬의 분포 소프트맥스를 수행할 때 어떻게 되는지 주목하세요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_7.png)

각 행의 합이 1인 가중치를 계속 얻습니다. 훈련 중에는 왼쪽 행렬의 숫자를 학습하여 각 토큰이 다른 토큰의 표현에 얼마나 많이 참여하는지를 지정할 수 있습니다. 이것이 토큰이 서로에게 "주의"를 기울이는 방법입니다. 그러나 여전히 이 왼쪽 행렬이 어디에서 나왔는지 이해하지 못했습니다. 이러한 사전 소프트맥스 주의 가중치는 토큰 자체에서 계산되지만 간접적으로 세 개의 선형 변환을 통해 수행됩니다.

## Keys, Queries, and Values

![이미지](/assets/img/2024-06-19-GPTfromScratchwithMLX_8.png)


<div class="content-ad"></div>

우리 시퀀스의 각 토큰은 3개의 새로운 벡터를 생성합니다. 이러한 벡터를 키(key), 쿼리(query) 및 값(value)라고합니다. 한 토큰의 쿼리 벡터와 다른 토큰의 키 벡터의 내적을 사용하여 두 토큰 간의 "유사성"을 측정합니다. 우리는 각 토큰과 각 다른 토큰 사이의 쌍별 유사성을 계산하고 싶어합니다. 따라서 쿼리 벡터(4x3)를 키 벡터의 전치(3x4)와 곱하여 원시 어텐션 가중치(4x4)를 얻습니다. 행렬 곱셈이 작동하는 방식으로 인해 원시 어텐션 가중치의 (i,j) 항목은 토큰 i의 쿼리와 토큰 j의 키의 내적 또는 두 가지 사이의 "유사성"이됩니다. 따라서 우리는 모든 토큰 간의 상호 작용을 계산했습니다. 그러나 과거 토큰이 미래 토큰과 상호 작용하는 것을 원하지 않기 때문에 상단 우측 항목들에 -inf 마스크를 적용하여 소프트맥스 후에 제로아웃되도록합니다. 그런 다음 행별 소프트맥스를 수행하여 최종 어텐션 가중치를 얻습니다. 이러한 가중치를 입력과 직접 곱하는 대신 값 프로젝션과 곱합니다. 결과적으로 새로운 표현이 생성됩니다.

이제 우리는 주의를 개념적으로 이해했으니, 구현해 봅시다.

```js
class Attention(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.head_size = head_size
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
  
```

키, 쿼리 및 값 프로젝션 레이어를 정의하여 시작합니다. n_emb에서 진행하는 대신 n_emb에서 head_size로 프로젝션합니다. 아무것도 변경되지 않으며, 주의를 통해 계산된 새로운 표현이 차원 head_size가됨을 의미합니다.

<div class="content-ad"></div>


class Attention(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.head_size = head_size
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
    def __call__(self, x): # shapes commented
        B, T, C = x.shape # (batch_size, ctx_len, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)


앞서로부터 전달받은 값으로 key, query, value를 계산한 뒤, 입력 모양을 미래의 편리함을 위해 변수 B, T, C로 나눕니다.


class Attention(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.head_size = head_size
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
    def __call__(self, x):
        B, T, C = x.shape # (batch_size, ctx_len, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        attn_weights = (Q @ K.transpose([0, 2, 1])) / math.sqrt(self.head_size)
        # attn_weights.shape = (B, T, T)


이어서, 어텐션 가중치를 계산합니다. 키 텐서의 마지막 두 차원만 바꿔야 하므로 차원 변환은 마지막 두 차원에 대해서만 이루어집니다. 배치 차원은 여러 학습 예제를 병렬로 전달하기 위한 것뿐입니다. mlx의 전치 함수는 차원의 새로운 순서를 입력으로 받기 때문에, 마지막 두 차원을 전치하기 위해 [0, 2, 1]을 전달합니다. 그리고 여기에 주목할 점: 어텐션 가중치들은 head_size의 제곱근에 역수를 적용합니다. 이는 스케일드 어텐션이라 불리며, 목적은 Q와 K가 단위 분산을 가질 때, attn_weights도 단위 분산을 가지게 하는 것입니다. attn_weights의 분산이 높으면 softmax가 이 작은 값과 큰 값을 0 또는 1로 매핑하여 복잡성이 적은 표현을 얻도록 합니다.


<div class="content-ad"></div>

다음 단계는 미래 토큰에 주의를 기울이지 않는 인과 언어 모델링, 즉 토큰이 미래 토큰에 주의를 기울이지 않도록 마스크를 적용하는 것입니다.

```js
class Attention(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.head_size = head_size
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # broadcasting trick
        self._causal_mask = mask * -1e9
    def __call__(self, x):
        B, T, C = x.shape # (batch_size, ctx_len, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        attn_weights = (Q @ K.transpose([0, 2, 1])) / math.sqrt(self.head_size)
        # attn_weights.shape = (B, T, T)
```

우리는 미리 설정한 ctx_len=4와 같은 다이어그램에서 indices 변수를 [0, 1, 2, 3]으로 설정하기 위해 mx.arange(4)을 사용한다.

<div class="content-ad"></div>

그럼 indices[:, None]와 같이 인덱스 값을 가진 열 벡터를 생성할 수 있어요. 마찬가지로 indices[None]을 사용하면 행 벡터를 얻을 수 있어요. 그리고 ` 비교를 수행할 때 mlx는 벡터들을 브로드캐스트합니다. 그 이유는 형태가 맞지 않아 요소별로 비교할 수 없기 때문이에요. 브로드캐스팅은 mlx가 부족한 차원에 따라 벡터를 복제한다는 것을 의미해요. 그 결과, (4, 4) 행렬 간의 요소별 비교가 이루어집니다. 그게 이해가 되죠. 참고로, 텐서 처리할 때 브로드캐스팅 세부 정보에 익숙해지는 것을 권장드립니다. 이 링크를 읽어보세요. 튜토리얼 등장횟수가 많을 거에요.

요소별 비교 후, 다음 텐서가 남아 있어요:

```js
[[False,  True,  True,  True],
 [False, False,  True,  True],
 [False, False, False,  True],
 [False, False, False, False]]
```

이 텐서에 -1e9를 곱하면 값을 구할 수 있어요:

<div class="content-ad"></div>

```js
[[-0e+00, -1e+09, -1e+09, -1e+09],
 [-0e+00, -0e+00, -1e+09, -1e+09],
 [-0e+00, -0e+00, -0e+00, -1e+09],
 [-0e+00, -0e+00, -0e+00, -0e+00]]
```

이제 추가적인 마스크가 있습니다. 이 행렬을 어텐션 가중치에 추가하여 모든 오른쪽 상단 항목을 매우 큰 음수로 만들 수 있습니다. 이렇게 하면 소프트맥스 연산 후에 이들이 0이 될 것입니다. 또한, _causal_mask 속성 이름에 "_"를 접두사로 추가하여 개인 변수로 표시합니다. 이것은 mlx에게 이것이 매개변수가 아니며 교육 중에 업데이트되지 않아야 함을 나타냅니다.

```js
class Attention(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.head_size = head_size
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # broadcasting trick
        self._causal_mask = mask * -1e9
    def __call__(self, x):
        B, T, C = x.shape # (batch_size, ctx_len, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        attn_weights = (Q @ K.transpose([0, 2, 1])) / math.sqrt(self.head_size)
        # attn_weights.shape = (B, T, T)
        attn_weights = attn_weights + self._causal_mask
        attn_weights = mx.softmax(attn_weights, axis=-1)
        o = (attn_weights @ V) # (B, T, head_size)
```

이제 최종 어텐션 가중치를 얻기 위해 행별로 softmax 처리하고 이러한 가중치를 값에 곱하여 출력을 얻을 수 있습니다. softmax에 axis=-1을 전달하여 행이 있는 마지막 차원을 따라 softmax를 수행하려는 것을 지정합니다.

<div class="content-ad"></div>

최종 단계는 선형 투영 및 드롭아웃을 출력하는 것입니다.

```js
드롭아웃 = 0.1 # 파일 상단의 하이퍼파라미터와 함께 추가
class Attention(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.head_size = head_size
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # 브로드캐스팅 트릭
        self._causal_mask = mask * -1e9
        self.c_proj = nn.Linear(head_size, n_emb) # 출력 투영
        self.resid_dropout = nn.Dropout(드롭아웃)
    def __call__(self, x):
        B, T, C = x.shape # (배치 크기, ctx 길이, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        attn_weights = (Q @ K.transpose([0, 2, 1])) / math.sqrt(self.head_size)
        # attn_weights.shape = (B, T, T)
        attn_weights = attn_weights + self._causal_mask
        attn_weights = mx.softmax(attn_weights, axis=-1)
        o = (attn_weights @ V) # (B, T, head_size)
        o = self.c_proj(self.resid_dropout(o))
        return o
```

출력 투영과 잔차 드롭아웃인 c_proj 및 resid_dropout 두 개의 새 계층을 추가했습니다. 출력 투영은 벡터를 원래 차원인 n_emb로 반환하는 역할을 합니다. 드롭아웃은 정규화 및 훈련 안정성을 위해 추가되었으며, 트랜스포머 블록을 쌓으면서 심층 네트워크를 구축하는 것이 중요합니다. 이것으로 하나의 어텐션 헤드를 구현하는 것이 끝났습니다!

## 다중 헤드 어텐션

<div class="content-ad"></div>

하나의 주의 헤드만 있는 LLM보다는 여러 개의 주의 헤드를 병렬로 사용하고 그 출력을 연결하여 최종 표현을 만들곤 합니다. 예를 들어, 하나의 head_size=64를 가진 attention head가 있다고 가정해봅시다. 각 토큰에 대해 생성된 벡터는 64 차원입니다. 우리는 head_size=16인 4개의 병렬 attention head로 동일한 결과를 얻을 수 있습니다. 이들의 출력을 연결하여 16x4 = 64 차원의 출력을 생성할 수 있습니다. Multi-head attention은 모델이 더 복잡한 표현을 학습할 수 있도록 합니다. 각 head가 다른 projection 및 attention 가중치를 학습하기 때문입니다.

```js
n_heads = 4
class MultiHeadAttention(nn.Module): # 단순한 구현
    def __init__(self):
        super().__init__()
        self.heads = [Attention(head_size // n_heads) for _ in range(n_heads)]
    def __call__(self, x):
        return mx.concatenate([head(x) for head in self.heads], axis=-1)
```

간단한 구현은 n_heads의 attention head 목록을 생성하고, 각각의 크기를 최종 head 크기로 나눈 것입니다. 그리고 각 헤드의 출력을 마지막 축을 기준으로 연결하는 것입니다. 그러나 이 구현은 비효율적이며 텐서의 속도를 활용하지 못합니다. 텐서의 성능을 활용한 multi-head attention을 구현해 봅시다.

```js
head_size = 64 # 파일 상단에 넣기
class MultiHeadAttention(nn.Module):
    def __init__(self):
        super().__init__()
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # broadcasting trick
        self._causal_mask = mask * -1e9
        self.c_proj = nn.Linear(head_size, n_emb) # 출력 projection
        self.resid_dropout = nn.Dropout(dropout)
    def __call__(self, x):
        B, T, C = x.shape # (batch_size, ctx_len, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
```

<div class="content-ad"></div>

우선, 단일 헤드 어텐션 구현부터 시작해보겠습니다. __init__() 함수는 변경되지 않았어요. forward pass는 키(key), 쿼리(query), 값(value) 프로젝션을 생성하는 것으로 일반적으로 시작합니다.

```js
head_size = 64 # 파일 맨 위에 배치
n_heads = 8 # 파일 맨 위에 배치
class MultiHeadAttention(nn.Module):
    def __init__(self):
        super().__init__()
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # 브로드캐스팅 트릭
        self._causal_mask = mask * -1e9
        self.c_proj = nn.Linear(head_size, n_emb) # 출력 프로젝션
        self.resid_dropout = nn.Dropout(dropout)
    def __call__(self, x):
        B, T, C = x.shape # (배치 크기, ctx_len, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        mha_shape = (B, T, n_heads, head_size//n_heads)
        K = mx.as_strided(K, (mha_shape)) # (B, T, n_heads, head_size//n_heads)
        Q = mx.as_strided(Q, (mha_shape)) # (B, T, n_heads, head_size//n_heads)
        V = mx.as_strided(V, (mha_shape)) # (B, T, n_heads, head_size//n_heads)
```

다음으로 수행해야 할 일은 헤드 수를 나타내는 새로운 차원을 추가하는 것이에요. 기존의 부자연스러운 구현에서는 각각 고유한 키, 쿼리 및 값 텐서를 가진 별도의 어텐션 객체를 사용했었지만, 이제 이 모든 요소를 하나의 텐서에 모두 가지고 있기 때문에 헤드를 위한 차원이 필요합니다. 우리가 원하는 새로운 모양을 mha_shape에 정의합니다. 그런 다음 각 텐서를 헤드 차원을 가지도록 재구성하기 위해 mx.as_strided()를 사용합니다. 이 함수는 파이토치의 view와 동등하며 mlx에게 이 배열을 다른 모양으로 다루도록 지시합니다. 그러나 아직 문제가 있어요. 이전과 같이 Q @ K_t(K의 마지막 2 차원을 전치한 K_t)를 곱하여 어텐션 가중치를 계산하려고 하면 다음과 같은 모양을 곱하게 됩니다.

```js
(B, T, n_heads, head_size//n_heads) @ (B, T, head_size//n_heads, n_heads)
결과 모양: (B, T, n_heads, n_heads)
```

<div class="content-ad"></div>

이제 (B, T, n_heads, n_heads) 모양의 텐서가 생성됩니다. 이는 올바른 결과가 아닙니다. 한 개의 헤드에서 우리의 어텐션 가중치는 (B, T, T) 모양이어야 합니다. 각 토큰 쌍 간의 상호 작용을 제공하기 때문에 이는 의미가 있습니다. 따라서 이제 우리의 모양은 똑같아야 하지만 헤드 차원이 추가되어야 합니다: (B, n_heads, T, T). 이를 위해 키, 쿼리 및 값의 차원을 변환하고, n_heads 차원을 2가 아닌 1로 만든 다음 재구성하는 방식으로 이를 달성합니다.

```js
head_size = 64 # 파일 상단에 배치
n_heads = 8 # 파일 상단에 배치
class MultiHeadAttention(nn.Module):
    def __init__(self):
        super().__init__()
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # 브로드캐스팅 트릭
        self._causal_mask = mask * -1e9
        self.c_proj = nn.Linear(head_size, n_emb) # 출력 프로젝션
        self.attn_dropout = nn.Dropout(dropout)
        self.resid_dropout = nn.Dropout(dropout)
    def __call__(self, x):
        B, T, C = x.shape # (배치 크기, 문맥 길이, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        mha_shape = (B, T, n_heads, head_size//n_heads)
        K = mx.as_strided(K, (mha_shape)).transpose([0, 2, 1, 3]) # (B, n_heads, T, head_size//n_heads)
        Q = mx.as_strided(Q, (mha_shape)).transpose([0, 2, 1, 3]) # (B, n_heads, T, head_size//n_heads)
        V = mx.as_strided(V, (mha_shape)).transpose([0, 2, 1, 3]) # (B, n_heads, T, head_size//n_heads)
        attn_weights = (Q @ K.transpose([0, 1, 3, 2])) / math.sqrt(Q.shape[-1]) # (B, n_heads, T, T)
        attn_weights = attn_weights + self._causal_mask[:T, :T]
        attn_weights = mx.softmax(attn_weights, axis=-1)
        attn_weights = self.attn_dropout(attn_weights)
        o = (attn_weights @ V) # (B, n_heads, T, head_size//n_heads)
        
```

이제 올바른 어텐션 가중치를 계산할 수 있습니다. 각 개별 어텐션 헤드의 크기로 어텐션 가중치를 조정합니다. 연결 이후의 크기인 head_size가 아닌 각 개별 어텐션 헤드의 크기로 어텐션 가중치를 조정합니다. 또한 어텐션 가중치에 드롭아웃을 적용합니다.

마지막으로, 연결을 수행하고 출력 프로젝션 및 드롭아웃을 적용합니다.

<div class="content-ad"></div>

```js
head_size = 64 # 파일 상단에 넣어 둬요
n_heads = 8 # 파일 상단에 넣어 둬요
class MultiHeadAttention(nn.Module):
    def __init__(self):
        super().__init__()
        self.k_proj = nn.Linear(n_emb, head_size, bias=False)
        self.q_proj = nn.Linear(n_emb, head_size, bias=False)
        self.v_proj = nn.Linear(n_emb, head_size, bias=False)
        indices = mx.arange(ctx_len)
        mask = indices[:, None] < indices[None] # broadcasting trick
        self._causal_mask = mask * -1e9
        self.c_proj = nn.Linear(head_size, n_emb) # 출력 프로젝션
        self.attn_dropout = nn.Dropout(dropout)
        self.resid_dropout = nn.Dropout(dropout)
    def __call__(self, x):
        B, T, C = x.shape # (배치 크기, ctx 길이, n_emb)
        K = self.k_proj(x) # (B, T, head_size)
        Q = self.q_proj(x) # (B, T, head_size)
        V = self.v_proj(x) # (B, T, head_size)
        mha_shape = (B, T, n_heads, head_size//n_heads)
        K = mx.as_strided(K, (mha_shape)).transpose([0, 2, 1, 3]) # (B, n_heads, T, head_size//n_heads)
        Q = mx.as_strided(Q, (mha_shape)).transpose([0, 2, 1, 3]) # (B, n_heads, T, head_size//n_heads)
        V = mx.as_strided(V, (mha_shape)).transpose([0, 2, 1, 3]) # (B, n_heads, T, head_size//n_heads)
        attn_weights = (Q @ K.transpose([0, 1, 3, 2])) / math.sqrt(Q.shape[-1]) # (B, n_heads, T, T)
        attn_weights = attn_weights + self._causal_mask[:T, :T]
        attn_weights = mx.softmax(attn_weights, axis=-1)
        attn_weights = self.attn_dropout(attn_weights)
        o = (attn_weights @ V) # (B, n_heads, T, head_size//n_heads)
        o = o.transpose([0, 2, 1, 3]).reshape((B, T, head_size)) # 헤드 연결
        o = self.c_proj(self.resid_dropout(o))
        return o
```

모든 것을 하나의 텐서로 가지고 있기 때문에 형태 조작을 통해 연결을 수행할 수 있어요. 먼저, `transpose` 함수를 사용하여 `n_heads`를 두 번째로 마지막 차원으로 이동합니다. 그런 다음, 앞서 수행한 헤드 분할을 되돌리기 위해 원래 크기로 다시 형태를 변환합니다. 이는 각 헤드에서 최종 벡터를 연결하는 것과 동일합니다. 그리고 이게 멀티 헤드 어텐션에 대한 모든 것이에요! 가장 집중력이 필요한 구현 부분을 처리했어요.

# MLP

아키텍처의 다음 부분은 멀티레이어 퍼셉트론 또는 MLP입니다. 이는 2개의 쌓인 선형 레이어를 의미합니다. 여기에 말할 것은 많지 않아요, 이것은 표준 신경망입니다.


<div class="content-ad"></div>

```python
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.c_fc = nn.Linear(n_emb, 4 * n_emb)
        self.gelu = nn.GELU()
        self.c_proj = nn.Linear(4 * n_emb, n_emb)
        self.dropout = nn.Dropout(dropout)
    def __call__(self, x):
        x = self.gelu(self.c_fc(x))
        x = self.c_proj(x)
        x = self.dropout(x)
        return x
```

입력을 받아 c_fc를 사용하여 고차원으로 프로젝션합니다. 그런 다음 gelu 비선형성을 적용하고 c_proj를 사용하여 임베딩 차원으로 다시 프로젝션합니다. 마지막으로 드롭아웃을 적용하고 반환합니다. MLP의 목적은 주의를 통해 벡터가 통신한 후 일부 계산을 허용하는 것입니다. 이러한 통신 레이어(주의) 및 계산 레이어(mlp)를 블록에 쌓겠습니다.

# 블록

GPT 블록은 주의가 뒤따르는 MLP로 구성됩니다. 이러한 블록은 구조를 깊게 만들기 위해 반복됩니다.


<div class="content-ad"></div>

```python
class Block(nn.Module):
    def __init__(self):
        super().__init__()
        self.mlp = MLP()
        self.mha = MultiHeadAttention()
    
    def __call__(self, x):
        x = self.mha(x)
        x = self.mlp(x)
        return x
```

이제 훈련 안정성을 향상시키기 위해 두 가지 기능을 추가해야 합니다. 아키텍처 다이어그램을 다시 살펴보겠습니다.

## 레이어 정규화 및 스킵 연결

![GPTfromScratchwithMLX_10](/assets/img/2024-06-19-GPTfromScratchwithMLX_10.png)


<div class="content-ad"></div>

아직도 빨간색으로 표시된 구성 요소를 구현해야 합니다. 화살표는 skip 연결을 나타냅니다. 입력이 직접 변환되는 대신, 어텐션 및 MLP 레이어의 효과는 가산적입니다. 이들 결과는 입력에 직접적으로 대체하는 대신 추가됩니다. 이는 깊은 신경망의 훈련 안정성에 도움이 됩니다. 왜냐하면 역전파에서 덧셈 연산의 피연산자들은 합과 동일한 기울기를 받게 됩니다. 그러므로 기울기가 자유롭게 역방향으로 흐를 수 있어서 깊은 신경망을 괴롭히는 사라지거나 폭주하는 기울기와 같은 문제를 방지할 수 있습니다. 또한 레이어 정규화는 활성화 함수들이 정규 분포를 보이도록 하여 훈련 안정성을 돕습니다. 아래는 최종 구현입니다.

```js
class Block(nn.Module):
    def __init__(self):
        super().__init__()
        self.mlp = MLP()
        self.mha = MultiHeadAttention()
        self.ln_1 = nn.LayerNorm(dims=n_emb)
        self.ln_2 = nn.LayerNorm(dims=n_emb)
    def __call__(self, x):
        x = x + self.mha(self.ln_1(x))
        x = x + self.mlp(self.ln_2(x))
        return x
```

레이어 정규화는 멀티헤드 어텐션 및 MLP 이전에 적용됩니다. skip 연결은 x = x + ...와 같이 추가를 의미합니다.

# Forward Pass

<div class="content-ad"></div>

블록을 정의했으니, GPT-2의 전방 향 과정을 완료할 수 있습니다.

```python
n_layers = 3 # 파일 맨 위에 배치
class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.wte = nn.Embedding(vocab_size, n_emb) # 토큰 임베딩
        self.wpe = nn.Embedding(ctx_len, n_emb) # 위치 임베딩
        self.blocks = nn.Sequential(
            *[Block() for _ in range(n_layers)],
        ) # 트랜스포머 블록들
        self.ln_f = nn.LayerNorm(dims=n_emb) # 최종 레이어 정규화
        self.lm_head = nn.Linear(n_emb, vocab_size) # 출력 프로젝션
    # 텐서 모양 주석
    def __call__(self, x):
        B, T = x.shape # (B = 배치 크기, T = ctx_len)
        tok_emb = self.wte(x) # (B, T, n_emb)
        pos_emb = self.wpe(mx.arange(T)) # (T, n_emb)
        x = tok_emb + pos_emb # (B, T, n_emb)
        x = self.blocks(x) # (B, T, n_emb)
        x = self.ln_f(x) # (B, T, b_emb)
        logits = self.lm_head(x) # (B, T, vocab_size)
        return logits
```

nn.Sequential을 사용해 블록을 담는 컨테이너를 만들어서 입력을 순차적으로 전달할 수 있습니다. 그런 다음 self.blocks(x)를 사용하여 모든 블록을 적용할 수 있습니다. 마지막으로 레이어 정규화를 적용하고 lm_head를 적용합니다. lm_head 또는 언어 모델링 헤드는 임베딩 차원에서 어휘 크기로 매핑하는 단순한 선형 레이어입니다. 모델은 어휘 내 각 단어에 대한 값이 포함된 벡터를 출력하며, 이를 로짓이라고 합니다. 로짓에 소프트맥스를 적용하여 어휘 전체에 대한 확률 분포를 얻을 수 있으며, 다음 토큰을 샘플링하거나 훈련 중 손실을 계산하는 데 사용할 수 있습니다. 학습을 시작하기 전에 구현해야 할 두 가지 사항만 더 남았습니다.

# 샘플링

<div class="content-ad"></div>

훈련이 완료된 후 모델에서 한 번 sampling하기 위해 generate 함수를 작성해야 합니다. 아이디어는 우리가 선택한 일련의 시퀀스로 시작하고, 그 다음 토큰을 예측하여 이를 시퀀스에 추가하는 것입니다. 그런 다음 새로운 시퀀스를 입력하고 다시 다음 토큰을 예측합니다. 이를 멈출 때까지 반복합니다.

```js
# GPT 클래스의 메서드
def generate(self, max_new_tokens):
  ctx = mx.zeros((1, 1), dtype=mx.int32)
```

우리는 모델에 단일 토큰 'zero'로 프롬프트를 제공합니다. Zero는 새 줄 문자이므로 모델이 얼마나 셰익스피어와 유사한지 확인하고 싶으므로 세대를 시작하는 자연스러운 장소입니다. 참고로, (1, 1) 형태로 초기화하여 시퀀스 길이가 하나인 단일 배치를 시뮬레이션합니다.

```js
# GPT 클래스의 메서드
def generate(self, max_new_tokens):
  ctx = mx.zeros((1, 1), dtype=mx.int32)
  for _ in range(max_new_tokens):
    logits = self(ctx[:, -ctx_len:]) # 마지막 ctx_len 문자열 전달
    logits = logits[:, -1, :] # 다음 토큰에 대한 로짓 얻기
    next_tok = mx.random.categorical(logits, num_samples=1)
    ctx = mx.concatenate((ctx, next_tok), axis=1)
return ctx
```

<div class="content-ad"></div>

다음 토큰에 대한 로짓을 얻으려면 마지막 ctx_len 문자열을 모델에 전달합니다. 그러나 모델 출력은 (B, T, vocab_size) 모양입니다. 왜냐하면 입력의 각 토큰에 대한 다음 토큰의 로짓을 예측하기 때문입니다. 학습 중에는 이를 전부 사용하지만 이제는 새 토큰을 샘플링하기 위해 마지막 토큰의 로짓만 원합니다. 이를 위해 로짓을 인덱싱하여 순서 차원인 첫 번째 차원에서 마지막 요소를 얻습니다. 그런 다음 mx.random.categorical() 함수를 사용하여 다음 토큰을 샘플합니다. 이 함수는 로짓을 softmax를 통해 확률 분포로 변환하고 확률에 따라 토큰을 무작위로 샘플링합니다. 마지막으로 새 토큰을 문맥에 연결하고 max_new_tokens 횟수만큼 프로세스를 반복합니다.

# 초기화

마지막으로 중요한 훈련 다이내믹스를 위해 가중치 초기화를 처리해야 합니다.

```js
# GPT의 방법
def _init_parameters(self):
    normal_init = nn.init.normal(mean=0.0, std=0.02)
    residual_init = nn.init.normal(mean=0.0, std=(0.02 / math.sqrt(2 * n_layers)))
```

<div class="content-ad"></div>

먼저, 두 가지 서로 다른 nn.init.normal 함수를 정의합니다. 첫 번째는 모든 선형 및 임베딩 레이어를 초기화하는 함수입니다. 두 번째는 특히 잔여 투영인 선형 레이어를 초기화하는 함수이며, 이는 다중 헤드 어텐션과 MLP 내부의 마지막 선형 레이어를 말합니다. 이 특별한 초기화의 이유는 GPT-2 논문에 따르면 모델 깊이가 증가함에 따라 잔여 경로를 따라 누적을 확인하기 때문입니다 [2].

mlx에서는 mx.update() 함수를 사용하여 모델의 매개변수를 변경할 수 있습니다. 문서를 확인해보면, 새로운 모델 매개변수의 완전한 또는 부분적인 사전을 예상합니다. 이 사전이 어떻게 구성되는지는 GPT 클래스 내에서 self.parameters()을 출력하여 확인할 수 있습니다.

```js
{'wte': {'weight': array([[-0.025084, -0.0197523, -0.0341617, ..., -0.0979123, -0.0830218, -0.0784692],
       [-0.00777913, -0.117002, -0.0310708, ..., 0.0128591, 0.122941, 0.000414443],
       [0.0240044, -0.0859084, 0.0253116, ..., 0.108967, 0.0767123, 0.0221565],
       ...,
       [0.050729, -0.04578, 0.0685943, ..., -0.0496998, -0.00350879, -0.00631825],
       [0.00518804, 0.0499818, 0.0330045, ..., 0.0300661, 0.0431054, 0.000958906],
       [-0.0323007, 0.0132046, 0.0208218, ..., -0.0785159, 0.00436121, -0.00726994]], dtype=float32)}, 'wpe': {'weight': array([[0.000797923, -0.0396898, -0.029047, ..., -0.0132273, 0.00684483, -0.0067624],
       [-0.0247021, -0.0274349, 0.0310587, ..., -0.100099, 0.0301566, -0.0178732],
       [0.0929172, -0.0468649, 0.0101506, ..., -0.0341086, -0.0516283, 0.0447596],
       ...,
       [-0.0508172, 0.0892201, -0.00183612, ..., -0.00341944, 0.023437, 0.0296461],
       [0.0105829, 0.0688093, 0.146744, ..., -0.0836337, 0.0206679, 0.0184166],
       [-0.00578717, -0.0606196, -0.0917056, ..., -0.0641549, -0.0490424, 0.0998114]], dtype=float32)}, 'blocks': {'layers': [{'mlp': {'c_fc': {'weight': array([[0.0169199, 0.00264431, 0.0316978, ..., -0.0596867, -0.0153549, 0.0176386],
       ...
```

모든 모델 가중치를 mx.array로 포함하는 중첩된 사전입니다. 따라서 모델의 매개변수를 초기화하려면 새 매개변수로 이와 같은 사전을 구성하고 self.update()에 전달해야 합니다. 이를 위해 다음과 같이 수행할 수 있습니다:

<div class="content-ad"></div>

```js
# GPT의 방법
def _init_parameters(self):
    normal_init = nn.init.normal(mean=0.0, std=0.02)
    residual_init = nn.init.normal(mean=0.0, std=(0.02 / math.sqrt(2 * n_layers)))
    new_params = []
    for name, module in self.named_modules():
        if isinstance(module, nn.layers.linear.Linear):
            new_params.append((name + '.weight', normal_init(module.weight)))
        elif isinstance(module, nn.layers.embedding.Embedding):
            new_params.append((name + '.weight', normal_init(module.weight))
```

new_params 라는 튜플 목록을 유지합니다. 이 목록에는 (parameter_name, new_value)의 튜플이 포함됩니다. 다음으로 self.named_modules()를 사용하여 model의 각 nn.Module 객체를 반복하며 (name, module) 튜플을 반환합니다. 루프 내에서 모듈 이름을 인쇄하면 다음과 같이 보입니다.

```js
lm_head
blocks
blocks.layers.4
blocks.layers.3
blocks.layers.3.ln_2
blocks.layers.3.ln_1
blocks.layers.3.mha
blocks.layers.3.mha.resid_dropout
blocks.layers.3.mha.c_proj
blocks.layers.3.mha.attn_dropout
blocks.layers.3.mha.c_attn
...
blocks.layers.0.mlp.dropout
blocks.layers.0.mlp.c_proj
blocks.layers.0.mlp.gelu
blocks.layers.0.mlp.c_fc
wpe
wte
```

isinstance() 함수를 사용하여 linear 및 embedding 레이어를 찾은 다음 목록에 추가합니다. 예를 들어, "blocks.layers.0.mlp.c_fc"에 도달하는 경우, 이는 MLP의 첫 번째 linear 레이어입니다. 이 경우 첫 번째 if 문이 트리거되어 ("block.layers.0.mlp.c_fc.weight", [`초기화된 weight 값 여기에 추가`])의 튜플이 목록에 추가됩니다. 우리는 특정한 이 방법으로 가중치를 초기화하고자 하기 때문에 이름에 ".weight"를 추가해야 합니다. 이제 잔류 투영 초기화를 처리해야 합니다.

<div class="content-ad"></div>

```python
# GPT의 메서드
def _init_parameters(self):
    normal_init = nn.init.normal(mean=0.0, std=0.02)
    residual_init = nn.init.normal(mean=0.0, std=(0.02 / math.sqrt(2 * n_layers)))
    new_params = []
    for name, module in self.named_modules():
        if isinstance(module, nn.layers.linear.Linear):
            if 'c_proj' in name: # 잔차 투영
                new_params.append((name + '.weight', residual_init(module.weight)))
            else:
                new_params.append((name + '.weight', normal_init(module.weight)))
            if hasattr(module, 'bias'):
                new_params.append((name + '.bias', mx.zeros(module.bias.shape)))
        elif isinstance(module, nn.layers.embedding.Embedding):
            new_params.append((name + '.weight', normal_init(module.weight)))
    self = self.update(utils.tree_unflatten(new_params))
```

선형 레이어인지 확인한 후 "c_proj"가 이름에 있는지 확인하고, 잔차 투영이라고 명명한 대로 특별한 초기화를 적용할 수 있습니다. 마지막으로 편향을 0으로 초기화해야 합니다.

선형 브랜치 아래에 다른 if 문을 추가하여 nn.Module 객체가 편향 특성을 가지고 있는지 확인합니다. 그런 경우 해당 값을 0으로 초기화된 목록에 추가합니다. 마지막으로 튜플 목록을 중첩된 딕셔너리로 변환해야 합니다. 다행히 mlx에는 매개변수 딕셔너리를 처리하는 기능이 구현되어 있으며,이 목록을 중첩 된 매개변수 딕셔너리로 변환하기 위해 util.tree_unflatten() 함수를 사용할 수 있습니다. 이를 매개변수를 초기화하기 위해 update 메서드에 전달합니다. 이제 생성자에서 _init_parameters()를 호출할 수 있습니다.


<div class="content-ad"></div>

```python
class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.wte = nn.Embedding(vocab_size, n_emb)  # 토큰 임베딩
        self.wpe = nn.Embedding(ctx_len, n_emb)  # 위치 임베딩
        self.blocks = nn.Sequential(
            *[Block() for _ in range(n_layers)],
        )  # 트랜스포머 블록들
        self.ln_f = nn.LayerNorm(dims=n_emb)  # 최종 레이어 정규화
        self.lm_head = nn.Linear(n_emb, vocab_size)  # 출력 프로젝션
        self._init_parameters()  # <-- 파라미터 초기화
        # 초기화 시 전체 파라미터 수 출력
        total_params = sum([p.size for n, p in utils.tree_flatten(self.parameters())])
        print(f"총 파라미터 수: {(total_params / 1e6):.3f}M")
    
    # 텐서 모양 주석
    def __call__(self, x):
        B, T = x.shape  # (B = 배치 크기, T = ctx_len)
        tok_emb = self.wte(x)  # (B, T, n_emb)
        pos_emb = self.wpe(mx.arange(T))  # (T, n_emb)
        x = tok_emb + pos_emb  # (B, T, n_emb)
        x = self.blocks(x)  # (B, T, n_emb)
        x = self.ln_f(x)  # (B, T, b_emb)
        logits = self.lm_head(x)  # (B, T, vocab_size)
        return logits
    
    def generate(self, max_new_tokens):
        ctx = mx.zeros((1, 1), dtype=mx.int32)
        for _ in range(max_new_tokens):
            logits = self(ctx[:, -ctx_len:])
            logits = logits[:, -1, :]
            next_tok = mx.random.categorical(logits, num_samples=1)
            ctx = mx.concatenate((ctx, next_tok), axis=1)
        return ctx
    
    def _init_parameters(self):
        normal_init = nn.init.normal(mean=0.0, std=0.02)
        residual_init = nn.init.normal(mean=0.0, std=(0.02 / math.sqrt(2 * n_layers)))
        new_params = []
        for name, module in self.named_modules():
            if isinstance(module, nn.layers.linear.Linear):
                if 'c_proj' in name:
                    new_params.append((name + '.weight', residual_init(module.weight)))
                else:
                    new_params.append((name + '.weight', normal_init(module.weight)))
                if 'bias' in module:
                    new_params.append((name + '.bias', mx.zeros(module.bias.shape)))
            elif isinstance(module, nn.layers.embedding.Embedding):
                new_params.append((name + '.weight', normal_init(module.weight))
        self = self.update(utils.tree_unflatten(new_params))
```

생성자에 총 파라미터 수를 출력하는 코드를 추가했습니다. 마지막으로 훈련 루프를 구축할 준비가 되었습니다.

# 훈련 루프

모델을 훈련하기 위해서는 손실 함수가 필요합니다. 다음 토큰을 예측하므로 교차 엔트로피 손실을 사용합니다.

<div class="content-ad"></div>

```js
def loss_fn(model, x, y):
    logits = model(x)
    B, T, C = logits.shape # (batch_size, seq_len, vocab_size)
    logits = logits.reshape(B*T, C)
    y = y.reshape(B*T)
    loss = nn.losses.cross_entropy(logits, y, reduction='mean')
    return loss
```

먼저, 모델에서 로짓을 얻습니다. 그런 다음 로짓을 vocab_size 길이의 배열 목록으로 재구성합니다. 또한 정확한 토큰 ID 인 y를 동일한 길이로 재구성합니다. 그런 다음 내장된 교차 엔트로피 손실 함수를 사용하여 각 예제의 손실을 계산한 다음 이를 평균 내어 단일 값으로 얻습니다.

```js
model = GPT()
mx.eval(model.parameters()) # 모델 파라미터 생성 (mlx는 게으른 평가)
loss_and_grad = nn.value_and_grad(model, loss_fn)
lr = 0.1
optimizer = optim.AdamW(learning_rate=lr)
```

다음으로, 모델을 인스턴스화합니다. 그러나 mlx는 게으르게 평가되기 때문에 파라미터가 할당되고 생성되지 않습니다. 파라미터에 mx.eval을 호출하여 생성되도록 보장해야 합니다. 그런 다음 nn.value_and_grad()를 사용하여 손실 및 모델 파라미터의 그래디언트를 반환하는 함수를 얻을 수 있습니다. 이것이 우리가 최적화하는 데 필요한 모든 것입니다. 마지막으로 AdamW 옵티마이저를 초기화합니다.


<div class="content-ad"></div>

nn.value_and_grad()에 대한 간단한 설명입니다. PyTorch를 사용해 보신 분이라면 loss.backward()를 사용할 것을 기대할 수 있습니다. 이 명령은 계산 그래프를 통과하며 모델 내 각 텐서의 .grad 속성을 업데이트합니다. 그러나 mlx의 자동 미분은 계산 그래프가 아닌 함수에 적용됩니다 [3]. 따라서 mlx에는 nn.value_and_grad()와 같이 함수를 입력받아 기울기 함수를 반환하는 내장 함수가 있습니다.

이제 학습 루프를 정의해 보겠습니다.

```js
num_epochs=20
batch_size=32
for epoch in range(num_epochs):
    model.train(True)
    running_loss = 0
    batch_cnt = 0
    for input, label in get_batches(X_train, y_train, batch_size):
        batch_cnt += 1
        loss, grads = loss_and_grad(model, input, label)
        optimizer.update(model, grads)
        running_loss += loss.item()
        # 새로운 매개변수 및 옵티마이저 상태 계산
        mx.eval(model.parameters(), optimizer.state)
    avg_train_loss = running_loss / batch_cnt
    model.train(False) # 평가 모드로 설정
    running_loss = 0
    batch_cnt = 0
    for input, label in get_batches(X_val, y_val, batch_size):
        batch_cnt += 1
        loss = loss_fn(model, input, label)
        running_loss += loss.item()
    avg_val_loss = running_loss / batch_cnt
    print(f"Epoch {epoch:2} | train = {avg_train_loss:.4f} | val = {avg_val_loss:.4f}")
```

외부 루프는 에포크를 거칩니다. 먼저 일부 모듈이 드롭아웃과 같이 학습 및 테스트 중에 다른 동작을 하는 경우가 있으므로 모델을 학습 모드로 설정합니다. 그런 다음 이전에 사용한 get_batches 함수를 사용하여 학습 데이터 배치를 반복합니다. 배치 단위로 손실과 기울기를 얻습니다. 그런 다음 모델과 기울기를 옵티마이저에 전달하여 모델 매개변수를 업데이트합니다. 마지막으로 매개변수 및 옵티마이저 상태가 업데이트되도록 mx.eval을 호출합니다(mx는 지연 평가를 수행하는 것을 기억하세요). 그런 다음 데이터의 평균 학습 손실을 계산하여 나중에 인쇄합니다. 이는 학습 데이터 한 번 통과입니다. 비슷하게 검증 손실을 계산하고 나서 에포크에서 평균 학습 및 검증 손실을 인쇄합니다.

<div class="content-ad"></div>


completion = decode(model.generate(1000)[0].tolist())
print(completion)
with open('completions.txt', 'w') as f:
    f.write(completion)


마지막으로, 모델에서 생성하는 코드를 추가합니다. 생성 결과는 여전히 (B, T) 형태이므로 0에서 색인화하여 1차원으로 만든 다음 mlx 배열을 Python 리스트로 변환해야 합니다. 그런 다음 앞서 설명한 decode 함수에 전달하고 파일에 쓸 수 있습니다.

다음은 학습에 사용할 매개변수입니다 (이를 변경해보실 수 있습니다):


ctx_len = 128
n_emb = 128
dropout = 0.1
head_size = 128
n_heads = 4 
n_layers = 3 
num_epochs = 20
batch_size = 64
lr = 1e-3


<div class="content-ad"></div>

이제 파일을 실행하여 훈련을 시작할 수 있습니다. 위의 설정으로 훈련을 진행하면 m2 맥북에서 약 10분이 걸렸어요. 지난 에포크에서 다음과 같은 훈련 손실을 얻었어요.

```js
에포크 19 | 훈련 = 1.6961 | 검증 = 1.8143
```

일부 출력을 살펴보겠습니다.

```js
GLOUCESTER:
But accomes mo move it.

KING EDWARD:
Where our that proclaim that I curse, or I sprithe.

CORIOLANUS:
Not want:
His bops to thy father
At with hath folk; by son and fproathead:
The good nor may prosperson like it not,
What, the beggares
More hath, when that made a,
Your vainst Citizen:
Let here are go in queen me and knife
To my deserved me you promise: not a fettimes,
That one the will not.

CORIOLANUS:
And been of queens,
Thou to do we best!

JULIET:
Not, brother recourable this doth our accuse
Into fight!
```

<div class="content-ad"></div>

아주 작은 모델로 10분 동안의 훈련만으로 이 정도면 꽤 좋지 않나요? 문자를 예측하는데 셰익스피어 형식 같네요, 비록 무의미하긴 하지만요. 우리 모델과 실제 GPT-2의 유일한 차이는 이제 규모 뿐이에요! 이제 실험해보고 싶네요 — 다양한 설정을 시도해보거나 아키텍처를 잠시 건드려서 얼마나 낮은 손실을 달성할 수 있는지 확인해보세요.

# 참고 문헌

[1] Karpathy A (2015). Tiny Shakespeare [데이터 세트]. https://github.com/karpathy/char-rnn (MIT 라이선스)

[2] A. Radford, J. Wu, R. Child, D. Luan, D. Amodei, I. Sutskever, 언어 모델은 비지도 멀티태스크 학습자입니다 (2019), OpenAI

<div class="content-ad"></div>

[3] Automatic Differentiation — mlx docs