---
title: "텍스트 임베딩 종합 가이드 2024 최신"
description: ""
coverImage: "/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_0.png"
date: 2024-06-23 19:53
ogImage: 
  url: /assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_0.png
tag: Tech
originalTitle: "Text Embeddings: Comprehensive Guide"
link: "https://medium.com/towards-data-science/text-embeddings-comprehensive-guide-afd97fce8fb5"
---


## 텍스트 임베딩의 진화, 시각화, 그리고 응용

우리 인간은 텍스트를 읽고 이해할 수 있습니다 (적어도 일부분은요). 컴퓨터는 반대로 "숫자로 생각"하기 때문에 단어와 문장의 의미를 자동으로 파악할 수 없습니다. 만약 우리가 컴퓨터가 자연어를 이해하도록 하려면, 이 정보를 컴퓨터가 작업할 수 있는 형식인 숫자 벡터로 변환해야 합니다.

수십 년 전에 사람들은 텍스트를 기계가 이해할 수 있는 형식으로 변환하는 방법을 배웠습니다 (그 중 하나는 ASCII였습니다). 이러한 방식은 텍스트를 렌더링하고 전송하는 데 도움이 되지만 단어의 의미를 부호화하지는 않습니다. 당시에는 키워드 검색 기술이 표준 검색 기술이었으며 특정 단어나 N-gram을 포함하는 모든 문서를 찾는 방식이었습니다.

그 후 몇 10년이 지난 후, 임베딩이 등장했습니다. 우리는 단어, 문장, 심지어 이미지에 대한 임베딩을 계산할 수 있습니다. 임베딩도 숫자의 벡터입니다만, 의미를 포착할 수 있습니다. 그래서 의미 검색을 수행하거나 다양한 언어로 된 문서를 다루는 데 사용할 수 있습니다.

<div class="content-ad"></div>

이 글에서는 임베딩 주제를 깊이 있게 다루어보고자 합니다:

- 임베딩이 만들어지기 전의 역사와 진화에 대해,
- OpenAI 도구를 사용하여 임베딩을 계산하는 방법,
- 문장이 서로 가까운지 판단하는 방법,
- 임베딩을 시각화하는 방법,
- 가장 흥미로운 부분은 임베딩을 실제로 활용하는 방법입니다.

이어서 나아가서 임베딩의 진화에 대해 배워보겠습니다.

# 임베딩의 진화

<div class="content-ad"></div>

우리는 텍스트 표현의 역사로 간단한 여행을 시작할 것입니다.

## 단어 가방

텍스트를 벡터로 변환하는 가장 기본적인 방법은 단어 가방입니다. 리처드 P. 페이만의 유명한 명언 중 하나를 살펴보겠습니다. "우리는 아직 발견들을 만들어내는 시대에 살고 있다". 이를 통해 단어 가방 접근법을 설명해보겠습니다.

단어 가방 벡터를 얻는 첫 번째 단계는 텍스트를 단어(토큰)로 나눈 다음, 단어를 기본 형태로 줄이는 것입니다. 예를 들어, "running"은 "run"으로 변환됩니다. 이 과정을 어간 추출(stemming)이라고 합니다. NLTK Python 패키지를 사용할 수 있습니다.

<div class="content-ad"></div>

```js
from nltk.stem import SnowballStemmer
from nltk.tokenize import word_tokenize

text = 'We are lucky to live in an age in which we are still making discoveries'

# 토큰화 - 텍스트를 단어로 나누기
words = word_tokenize(text)
print(words)
# ['We', 'are', 'lucky', 'to', 'live', 'in', 'an', 'age', 'in', 'which',
#  'we', 'are', 'still', 'making', 'discoveries']

stemmer = SnowballStemmer(language="english")
stemmed_words = list(map(lambda x: stemmer.stem(x), words))
print(stemmed_words)
# ['we', 'are', 'lucki', 'to', 'live', 'in', 'an', 'age', 'in', 'which',
#  'we', 'are', 'still', 'make', 'discoveri']
```

자, 이제 우리 단어들의 기본 형태 리스트가 있습니다. 다음 단계는 이들 빈도를 계산하여 벡터를 만드는 것입니다.

```js
import collections
bag_of_words = collections.Counter(stemmed_words)
print(bag_of_words)
# {'we': 2, 'are': 2, 'in': 2, 'lucki': 1, 'to': 1, 'live': 1, 
# 'an': 1, 'age': 1, 'which': 1, 'still': 1, 'make': 1, 'discoveri': 1}
```

사실, 만약 텍스트를 벡터로 변환하고 싶다면, 텍스트에 있는 단어뿐만 아니라 전체 어휘를 고려해야 합니다. "i", "you", "study"도 어휘에 있다고 가정하고, 파인만의 명언에서 벡터를 만들어 봅시다.


<div class="content-ad"></div>

![image](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_0.png)

이 방법은 꽤 기본적이며 단어의 의미를 고려하지 않기 때문에 "그 여자는 데이터 과학을 공부하고 있다"와 "젊은 여성이 AI와 ML을 배우고 있다."라는 문장이 서로 가까운 위치에 있지 않을 수 있습니다.

## TF-IDF

단어 가방 접근법의 약간 개선된 버전인 TF-IDF(Term Frequency — Inverse Document Frequency)입니다. 이것은 두 가지 지표의 곱셈입니다.

<div class="content-ad"></div>

![Markdown Table](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_1.png)

- 용어 빈도는 문서에서 단어의 빈도를 보여줍니다. 이를 계산하는 가장 흔한 방법은 이 문서에서 용어의 로우 카운트(단어 가방에 있는 것처럼)을 전체 용어(단어) 수로 나누는 것입니다. 그러나 로우 카운트, 부욜리언 "빈도", 정규화에 대한 다양한 접근 방법이 많이 있습니다. 위키피디아에서 다양한 접근 방법에 대해 더 배울 수 있습니다.

![Markdown Table](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_2.png)

- 역문서 주파수는 단어가 얼마나 많은 정보를 제공하는지를 나타냅니다. 예를 들어, "a"나 "that" 같은 단어는 문서 주제에 대해 추가 정보를 제공하지 않습니다. 대조적으로, "ChatGPT"나 "생물정보학" 같은 단어는 도메인을 정의하는 데 도움이 될 수 있습니다 (하지만 이 문장에는 해당하지 않음). 이는 전체 문서 수와 해당 단어를 포함하는 문서 수의 비율의 로그함수로 계산됩니다. IDF가 0에 가까울수록 단어가 흔하고 제공하는 정보가 더 적습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_3.png" />

그래서 결과적으로 우리는 일반적인 단어 ("I"나 "you"와 같은)이 낮은 가중치를 갖는 벡터를 얻게됩니다. 한편, 문서에서 여러 번 발생하는 드문 단어들은 더 높은 가중치를 갖게 됩니다. 이 전략은 약간 더 나은 결과를 제공하지만 여전히 의미적 의미를 잡아내기는 어렵습니다.

이 방법론의 다른 어려움은 상당히 희소한 벡터를 생성한다는 점입니다. 벡터의 길이는 말뭉치 크기와 동일합니다. 영어에는 약 470,000개의 고유 단어가 있습니다(출처). 그러므로 우리는 거대한 벡터를 갖게 될 것입니다. 하지만 문장에는 50개 이상의 고유 단어가 나타나지 않을 것이므로 벡터의 값 중 99.99%는 0일 것입니다. 이는 어떤 정보도 인코딩하지 않습니다. 이에 대해 과학자들은 밀도 있는 벡터 표현에 대해 고민하기 시작했습니다.

## Word2Vec

<div class="content-ad"></div>

가장 유명한 밀집 표현 방법 중 하나는 구글이 2013년에 Mikolov 등이 제안한 "효율적인 단어 표현 추정을 위한 Word2Vec" 논문에서 소개한 word2vec입니다.

논문에서 언급된 두 가지 word2vec 접근 방식은 Continuous Bag of Words(주변 단어를 기반으로 단어를 예측하는 방법)와 Skip-gram(반대 작업인 단어를 기반으로 문맥을 예측하는 방법)입니다.

밀집 벡터 표현의 핵심 아이디어는 두 모델을 훈련하는 것입니다: 인코더와 디코더. 예를 들어, Skip-gram의 경우 "christmas"라는 단어를 인코더에 전달할 수 있습니다. 그런 다음, 인코더가 "merry", "to", "you"와 같은 단어를 얻을 것으로 예상하여 디코더에 전달할 수 있는 벡터를 생성할 것입니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_5.png)

이 모델은 이제 단어의 의미를 고려하기 시작했습니다. 단어의 맥락에서 훈련되었기 때문입니다. 그러나 형태학(예: "-less"는 무언가의 부족을 의미함)을 무시합니다. 나중에는 GloVe에서 서브워드 스킵-그램을 살펴봄으로써 이 단점을 개선했습니다.

또한, word2vec은 단어와만 작동할 수 있었지만, 우리는 전체 문장을 인코딩하고 싶습니다. 그러니, 트랜스포머로 다음 진화 단계로 넘어가 봅시다.

## 트랜스포머와 문장 임베딩


<div class="content-ad"></div>

다음 진화는 Vaswani 등이 발표한 "Attention Is All You Need" 논문에서 소개된 트랜스포머 접근 방식과 관련이 있었습니다. 트랜스포머는 정보가 풍부한 밀집 벡터를 생성할 수 있었고 현대 언어 모델의 주요 기술로 자리 잡게 되었습니다.

저는 트랜스포머의 구조 세부 사항에 대해 다루지 않겠습니다. 왜냐하면 이것은 우리 주제와 관련이 그리 크지 않고 많은 시간이 소요되기 때문입니다. 더 배우고 싶다면 "Transformers, Explained" 또는 "The Illustrated Transformer"와 같은 다양한 자료가 많이 있습니다.

트랜스포머를 사용하면 동일한 "핵심" 모델을 사용하여 다른 사용 사례에 대해 미세 조정할 수 있으며, 핵심 모델을 다시 학습시킬 필요가 없습니다(시간이 많이 소요되고 상당한 비용이 듭니다). 이것은 사전 훈련된 모델의 등장으로 이어졌습니다. 가장 인기 있는 최초의 모델 중 하나는 Google AI가 개발한 BERT(Bidirectional Encoder Representations from Transformers)였습니다.

내부적으로 BERT는 여전히 word2vec과 유사한 토큰 수준에서 작동하지만, 우리는 여전히 문장 임베딩을 얻고 싶습니다. 따라서, 모든 토큰 벡터의 평균을 취하는 단순한 방법을 적용할 수 있습니다. 유감스럽게도, 이 방법은 좋은 성능을 보여주지 않습니다.

<div class="content-ad"></div>

2019년에 이 문제는 Sentence-BERT가 출시되면서 해결되었습니다. 이는 의미론적 텍스트 유사성 작업에서 이전 방법들을 모두 능가하며 문장 포함 벡터의 계산을 가능하게 했습니다.

이 주제는 매우 방대하기 때문에 이 기사에서 모두 다 다룰 수는 없을 거예요. 그러니 진지하게 관심이 있다면 이 기사에서 문장 포함 벡터에 대해 더 배울 수 있습니다.

우리는 임베딩의 발전을 간략히 다뤘고 이론에 대한 고수준 이해를 얻었습니다. 이제 실습으로 넘어가서 OpenAI 도구를 사용하여 어떻게 임베딩을 계산하는지 배워보겠습니다.

# 임베딩 계산

<div class="content-ad"></div>

이 기사에서는 OpenAI 임베딩을 사용할 것입니다. 최근에 출시된 새로운 모델인 text-embedding-3-small을 시도해볼 것입니다. 이 새로운 모델은 text-embedding-ada-002보다 성능이 더 좋게 나타났습니다:

- 널리 사용되는 다국어 검색 (MIRACL) 벤치마크의 평균 점수가 31.4%에서 44.0%로 상승했습니다.
- 영어 작업에 대한 자주 사용되는 벤치마크인 MTEB의 평균 성능도 향상되어 61.0%에서 62.3%로 상승했습니다.

OpenAI는 또한 새로운 큰 모델인 text-embedding-3-large를 출시했습니다. 이제 이것이 가장 우수한 임베딩 모델입니다.

데이터 소스로는 Stack Exchange Data Dump의 작은 샘플을 사용할 것입니다. 이는 Stack Exchange 네트워크에서 모든 사용자 기여 콘텐츠의 익명화된 덤프입니다. 저는 흥미로운 주제를 선택하고 각각에서 100개의 질문을 샘플링했습니다. 주제는 생성적 AI부터 커피 또는 자전거까지 다양합니다. 그래서 다양한 주제를 볼 수 있을 겁니다.

<div class="content-ad"></div>

먼저, 모든 스택 오버플로우 질문에 대한 임베딩을 계산해야 합니다. 한 번 실행하고 결과를 로컬로 저장하는 것이 좋습니다(파일이나 벡터 저장소에). OpenAI Python 패키지를 사용하여 임베딩을 생성할 수 있습니다.

```python
from openai import OpenAI
client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model)\
       .data[0].embedding

get_embedding("We are lucky to live in an age in which we are still making discoveries.")
```

결과적으로, 우리는 부동 소수점 숫자로 이루어진 1536차원 벡터를 얻습니다. 이제 이를 모든 데이터에 대해 반복하고 값을 분석할 수 있습니다.

가장 궁금할 수 있는 주요 질문은 의미적으로 문장들이 얼마나 가까운지입니다. 답을 발견하기 위해 벡터 간의 거리 개념을 논의해 보겠습니다.

<div class="content-ad"></div>

# 벡터 간 거리

임베딩은 사실 벡터입니다. 따라서 두 문장이 얼마나 가까운지 이해하려면 벡터 간 거리를 계산할 수 있습니다. 더 작은 거리는 더 가까운 의미를 나타낼 것입니다.

두 벡터 간의 거리를 측정하는 데 사용할 수 있는 다양한 메트릭이 있습니다:

- 유클리디안 거리 (L2),
- 맨하탄 거리 (L1),
- 내적 (Dot product),
- 코사인 거리.

<div class="content-ad"></div>

그들에 대해 이야기해 봅시다. 간단한 예로, 우리는 두 개의 2D 벡터를 사용할 것입니다.

```js
vector1 = [1, 4]
vector2 = [2, 2]
```

## 유클리디안 거리 (L2)

두 지점(또는 벡터) 사이의 거리를 정의하는 가장 표준적인 방법은 유클리디안 거리 또는 L2 norm입니다. 이 측정 기준은 일상생활에서 가장 많이 사용되며, 예를 들어 2개의 도시 사이의 거리를 언급할 때 사용됩니다.

<div class="content-ad"></div>

L2 거리에 대한 시각적 표현과 공식이 있습니다.

![Image](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_6.png)

파이썬 또는 numpy 함수를 사용하여 이 메트릭을 계산할 수 있습니다.

```python
import numpy as np

sum(list(map(lambda x, y: (x - y) ** 2, vector1, vector2))) ** 0.5
# 2.2361

np.linalg.norm((np.array(vector1) - np.array(vector2)), ord = 2)
# 2.2361
```

<div class="content-ad"></div>

# 맨해튼 거리 (L1)

다른 일반적으로 사용되는 거리 측정 방법은 L1 노름 또는 맨해튼 거리입니다. 이 거리는 뉴욕의 맨해튼 섬에서 명명되었습니다. 이 섬은 거리가 격자 레이아웃으로 되어 있고, 맨해튼에서 두 지점 사이의 가장 짧은 경로는 격자 모양을 따라야 하므로 L1 거리가 됩니다.

![image](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_7.png)

우리는 이를 처음부터 구현하거나 numpy 함수를 사용하여 구현할 수도 있습니다.

<div class="content-ad"></div>

```js
sum(list(map(lambda x, y: abs(x - y), vector1, vector2)))
# 3

np.linalg.norm((np.array(vector1) - np.array(vector2)), ord = 1)
# 3.0
```

## 내적(Dot product)

벡터 간 거리를 계산하는 다른 방법은 내적 또는 스칼라 곱을 계산하는 것입니다. 다음은 해당 공식이며 쉽게 구현할 수 있습니다.

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_8.png" />

<div class="content-ad"></div>

```python
sum(list(map(lambda x, y: x*y, vector1, vector2)))
# 11

np.dot(vector1, vector2)
# 11
```

이 메트릭은 해석하기가 조금 까다로운 편이에요. 한편으로는 벡터가 한 방향을 향하고 있는지를 보여줍니다. 다른 한편으로는 결과는 벡터들의 크기에 크게 의존합니다. 예를 들어 두 쌍의 벡터 간의 내적을 계산해볼게요:

- (1, 1) vs (1, 1)
- (1, 1) vs (10, 10).

두 경우 모두 벡터가 일직선상에 있지만, 두 번째 경우에 내적은 10배 크게 나와요: 2 대 20.

<div class="content-ad"></div>

## 코사인 유사도

많은 경우, 코사인 유사도가 사용됩니다. 코사인 유사도는 벡터의 크기(또는 노름)에 의해 정규화된 내적입니다.

![Image](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_9.png)

이전처럼 직접 모든 것을 계산하거나 sklearn의 함수를 사용할 수 있습니다.

<div class="content-ad"></div>

```js
dot_product = sum(list(map(lambda x, y: x*y, vector1, vector2)))
norm_vector1 = sum(list(map(lambda x: x ** 2, vector1))) ** 0.5
norm_vector2 = sum(list(map(lambda x: x ** 2, vector2))) ** 0.5

dot_product/norm_vector1/norm_vector2

# 0.8575

from sklearn.metrics.pairwise import cosine_similarity

cosine_similarity(
  np.array(vector1).reshape(1, -1), 
  np.array(vector2).reshape(1, -1))[0][0]

# 0.8575
```

cosine_similarity 함수는 2차원 배열을 기대합니다. 그래서 numpy 배열을 reshape 해주어야 합니다.

이 메트릭의 물리적 의미에 대해 조금 이야기해 봅시다. Cosine similarity는 두 벡터 사이의 코사인 값과 같습니다. 벡터가 서로 가까울수록 메트릭 값이 높아집니다.

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_10.png" />


<div class="content-ad"></div>

우리는 심지어 벡터 사이의 정확한 각도를 도 단위로 계산할 수도 있어요. 약 30도 정도의 결과를 얻었고, 꽤 합리적으로 보이네요.

```js
import math
math.degrees(math.acos(0.8575))

# 30.96
```

## 어떤 측정 지표를 사용할까요?

우리는 두 벡터 사이의 거리를 계산하는 다양한 방법에 대해 토론해 왔고, 여러분은 어떤 방법을 사용할지 고려하기 시작할 수 있을 거예요.

<div class="content-ad"></div>

내가 가진 임베딩을 비교하기 위해 어떤 거리든 사용할 수 있어요. 예를 들어, 다른 클러스터 사이의 평균 거리를 계산했어요. L2 거리와 코사인 유사도 모두 비슷한 결과를 보여줘요:

- 클러스터 내의 객체들은 다른 클러스터보다 서로 더 가까워요. L2 거리에 대해 가까울수록 낮은 거리를 의미하지만 코사인 유사도에서는 가까운 객체일수록 값이 높아져요. 헷갈리지 마세요.
- "정치"와 "경제" 또는 "ai"와 "데이터과학"과 같이 일부 주제들이 서로 아주 가까운 것을 알 수 있어요.

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_11.png" />

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_12.png" />

<div class="content-ad"></div>

그러나 NLP 작업에 대해서는 일반적으로 코사인 유사도를 사용하는 것이 최선의 방법입니다. 몇 가지 그 이유는:

- 코사인 유사도는 -1과 1 사이에 있으며, L1과 L2는 무제한이기 때문에 해석하기 쉽습니다.
- 실용적인 측면에서 유클리드 거리의 제곱근보다 내적을 계산하는 것이 더 효과적입니다.
- 코사인 유사도는 차원의 저주에 영향을 덜 받습니다 (이에 대해 뒤에서 더 얘기할 것입니다).

위의 결과에서 인트라 및 인터 클러스터 거리 간의 차이가 크지 않다는 점을 알 수 있을 것입니다. 이 현상의 원인은 벡터의 고차원성 때문입니다. 이 효과는 "차원의 저주"라고 불리며, 차원이 높을수록 벡터 간 거리 분포가 좁아진다는 것을 알 수 있습니다. 이에 대해 더 자세히 알아보려면 이 글을 참조해보세요.

간단히 설명드리겠습니다. OpenAI 임베딩 값의 분포를 계산하고 차원이 다른 300개의 벡터 집합을 생성했습니다. 그런 다음, 모든 벡터 사이의 거리를 계산하고 히스토그램을 그렸습니다. 차원이 증가함에 따라 벡터의 거리 분포가 좁아진다는 것을 쉽게 확인할 수 있습니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_13.png)

임베딩 사이의 유사성을 측정하는 방법을 배웠어요. 여기서 이론적인 부분은 마쳤고, 더 실용적인 부분(시각화 및 실용적인 응용)으로 넘어가겠습니다. 데이터를 보는 것이 가장 중요하니, 시각화부터 시작해봐요.

# 임베딩 시각화

데이터를 이해하는 가장 좋은 방법은 시각적으로 나타내는 것이에요. 아쉽지만, 임베딩은 1536차원이 있어서 데이터를 살펴보기가 꽤 어려워요. 그러나, 한 가지 방법이 있어요: 차원 축소 기술을 사용하여 벡터를 이차원 공간에 투영하는 것이에요.

<div class="content-ad"></div>

## PCA

가장 기본적인 차원 축소 기술은 PCA(주성분 분석)입니다. 이를 사용해 봅시다.

먼저, sklearn에 전달하기 위해 임베딩을 2D numpy 배열로 변환해야 합니다.

```python
import numpy as np
embeddings_array = np.array(df.embedding.values.tolist())
print(embeddings_array.shape)
# (1400, 1536)
```

<div class="content-ad"></div>

그럼, 우리는 PCA 모델을 n_components = 2로 초기화해야 해요 (2D 시각화를 생성하고 싶기 때문에), 전체 데이터에서 모델을 학습하고 새로운 값을 예측해야 해요.

```js
from sklearn.decomposition import PCA

pca_model = PCA(n_components = 2)
pca_model.fit(embeddings_array)

pca_embeddings_values = pca_model.transform(embeddings_array)
print(pca_embeddings_values.shape)
# (1400, 2)
```

결과적으로, 우리는 각 질문에 대해 두 개의 특성을 가진 행렬을 얻었으므로, scatter plot에서 쉽게 시각화할 수 있어요.

```js
fig = px.scatter(
    x = pca_embeddings_values[:,0], 
    y = pca_embeddings_values[:,1],
    color = df.topic.values,
    hover_name = df.full_text.values,
    title = 'PCA embeddings', width = 800, height = 600,
    color_discrete_sequence = plotly.colors.qualitative.Alphabet_r
)

fig.update_layout(
    xaxis_title = 'first component', 
    yaxis_title = 'second component')
fig.show()
```

<div class="content-ad"></div>

![img](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_14.png)

각 주제의 질문들이 서로 꽤 가까이 위치해 있는 것을 볼 수 있어 좋습니다. 그러나 모든 클러스터가 혼재되어 있어서 개선할 부분이 있습니다.

## t-SNE

PCA는 선형 알고리즘이지만, 대부분의 관계는 실제로는 비선형입니다. 그래서 비선형성 때문에 클러스터를 분리할 수 없을 수도 있습니다. 비선형 알고리즘인 t-SNE을 사용해보고 더 나은 결과를 보여줄 수 있는지 확인해봅시다.

<div class="content-ad"></div>

거의 동일한 코드를 사용했습니다. PCA 대신 t-SNE 모델을 사용했어요.

```js
from sklearn.manifold import TSNE
tsne_model = TSNE(n_components=2, random_state=42)
tsne_embeddings_values = tsne_model.fit_transform(embeddings_array)

fig = px.scatter(
    x = tsne_embeddings_values[:,0], 
    y = tsne_embeddings_values[:,1],
    color = df.topic.values,
    hover_name = df.full_text.values,
    title = 't-SNE embeddings', width = 800, height = 600,
    color_discrete_sequence = plotly.colors.qualitative.Alphabet_r
)

fig.update_layout(
    xaxis_title = 'first component', 
    yaxis_title = 'second component')
fig.show()
```

t-SNE 결과가 훨씬 좋아 보여요. 대부분의 클러스터가 분리되어 있지만 "genai", "datascience", "ai" 는 분리되지 않았어요. 그러나 이건 예상한대로에요 - 이러한 주제를 내가 분리할 수 있을지 의심스러워요.

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_15.png" />

<div class="content-ad"></div>

이 시각화를 보면 임베딩이 의미적 의미를 인코딩하는 데 상당히 효과적임을 확인할 수 있어요.

또한, 데이터를 3D로 시각화할 수 있는 사영(projection)을 만들어볼 수 있어요. 실용적일지는 확실하지 않지만, 데이터를 3D로 살펴보는 것은 흥미롭고 관심을 끌 수 있어요.

```js
tsne_model_3d = TSNE(n_components=3, random_state=42)
tsne_3d_embeddings_values = tsne_model_3d.fit_transform(embeddings_array)

fig = px.scatter_3d(
    x = tsne_3d_embeddings_values[:,0], 
    y = tsne_3d_embeddings_values[:,1],
    z = tsne_3d_embeddings_values[:,2],
    color = df.topic.values,
    hover_name = df.full_text.values,
    title = 't-SNE embeddings', width = 800, height = 600,
    color_discrete_sequence = plotly.colors.qualitative.Alphabet_r,
    opacity = 0.7
)
fig.update_layout(xaxis_title = 'first component', yaxis_title = 'second component')
fig.show()
```

![3D 시각화](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_16.png)

<div class="content-ad"></div>

## 바코드

임베딩을 이해하는 방법은 몇 개를 바코드처럼 시각화하여 상관 관계를 확인하는 것입니다. 나는 세 가지 임베딩 예시를 선택했습니다: 두 개는 서로에게 가장 가깝고, 나머지 하나는 데이터 세트에서 가장 멀리 떨어져 있는 예시입니다.

```js
embedding1 = df.loc[1].embedding
embedding2 = df.loc[616].embedding
embedding3 = df.loc[749].embedding
```

```js
import seaborn as sns
import matplotlib.pyplot as plt
embed_len_thr = 1536

sns.heatmap(np.array(embedding1[:embed_len_thr]).reshape(-1, embed_len_thr),
    cmap = "Greys", center = 0, square = False, 
    xticklabels = False, cbar = False)
plt.gcf().set_size_inches(15,1)
plt.yticks([0.5], labels = ['AI'])
plt.show()

sns.heatmap(np.array(embedding3[:embed_len_thr]).reshape(-1, embed_len_thr),
    cmap = "Greys", center = 0, square = False, 
    xticklabels = False, cbar = False)
plt.gcf().set_size_inches(15,1)
plt.yticks([0.5], labels = ['AI'])
plt.show()

sns.heatmap(np.array(embedding2[:embed_len_thr]).reshape(-1, embed_len_thr),
    cmap = "Greys", center = 0, square = False, 
    xticklabels = False, cbar = False)
plt.gcf().set_size_inches(15,1)
plt.yticks([0.5], labels = ['바이오인포매틱스'])
plt.show()
```  

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_17.png)

우리 경우에는 고차원 때문에 벡터가 서로 가까운지 쉽게 보기 어려울 수 있습니다. 그래도 나는 이 시각화를 좋아합니다. 몇 가지 경우에 도움이 될 수도 있으니, 나는 이 아이디어를 당신과 공유하고자 합니다.

우리는 임베딩을 시각화하는 방법을 배웠고, 텍스트의 의미를 파악하는 능력에 대한 의문은 남지 않았습니다. 이제 실제로 임베딩을 어떻게 활용할 수 있는지에 대해 논의하는 가장 흥미로운 부분으로 넘어가 보겠습니다.

# 실용적인 응용

<div class="content-ad"></div>

물론, 임베딩의 주요 목표는 텍스트를 숫자의 벡터로 인코딩하거나 시각화하기 위해서만 하는 것이 아닙니다. 우리는 텍스트의 의미를 포착하는 능력에서 많은 이점을 얻을 수 있습니다. 실용적인 예제들을 함께 살펴보겠습니다.

## 클러스터링

먼저 클러스터링부터 시작해보죠. 클러스터링은 초기 레이블 없이 데이터를 그룹으로 분할할 수 있는 비지도학습 기술입니다. 클러스터링을 통해 데이터의 내부 구조적 패턴을 이해하는 데 도움을 받을 수 있습니다.

가장 기본적인 클러스터링 알고리즘 중 하나인 K-평균을 사용할 것입니다. K-평균 알고리즘을 위해서는 클러스터의 개수를 지정해야 합니다. 실루엣 스코어를 사용하여 최적의 클러스터 수를 정의할 수 있습니다.

<div class="content-ad"></div>

2부터 50까지의 k (클러스터 수)를 시도해 보겠습니다. 각 k에 대해 모델을 훈련하고 실루엣 점수를 계산할 것입니다. 실루엣 점수가 높을수록, 더 좋은 클러스터링 결과를 얻을 수 있습니다.

```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import tqdm

silhouette_scores = []
for k in tqdm.tqdm(range(2, 51)):
    kmeans = KMeans(n_clusters=k, 
                    random_state=42, 
                    n_init='auto').fit(embeddings_array)
    kmeans_labels = kmeans.labels_
    silhouette_scores.append(
        {
            'k': k,
            'silhouette_score': silhouette_score(embeddings_array, 
                                                 kmeans_labels, metric='cosine')
        }
    )

fig = px.line(pd.DataFrame(silhouette_scores).set_index('k'),
              title='<b>K-means 클러스터링을 위한 실루엣 점수</b>',
              labels={'value': '실루엣 점수'}, 
              color_discrete_sequence=plotly.colors.qualitative.Alphabet)
fig.update_layout(showlegend=False)
```

우리의 경우, k가 11일 때 실루엣 점수가 최대치에 도달합니다. 따라서 최종 모델에는 이 클러스터 수를 사용합시다.

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_18.png" />

<div class="content-ad"></div>

클러스터를 시각화해 보는 t-SNE를 이용한 차원 축소를 이미 이전에 수행한 것처럼 해보겠습니다.

```js
tsne_model = TSNE(n_components=2, random_state=42)
tsne_embeddings_values = tsne_model.fit_transform(embeddings_array)

fig = px.scatter(
    x = tsne_embeddings_values[:,0], 
    y = tsne_embeddings_values[:,1],
    color = list(map(lambda x: '클러스터 %s' % x, kmeans_labels)),
    hover_name = df.full_text.values,
    title = '클러스터링을 위한 t-SNE 임베딩', width = 800, height = 600,
    color_discrete_sequence = plotly.colors.qualitative.Alphabet_r
)
fig.update_layout(
    xaxis_title = '첫 번째 성분', 
    yaxis_title = '두 번째 성분')
fig.show()
```

시각적으로 알고리즘이 클러스터를 상당히 잘 정의했음을 확인할 수 있습니다 — 그들은 꽤 잘 분리되어 있습니다.

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_19.png" />

<div class="content-ad"></div>

우리는 사실적인 주제 라벨을 가지고 있으므로, 클러스터링이 얼마나 좋은지를 심층적으로 판단할 수도 있어요. 각 클러스터에 대한 주제 혼합을 살펴봅시다.

```js
df['cluster'] = list(map(lambda x: '클러스터 %s' % x, kmeans_labels))
cluster_stats_df = df.reset_index().pivot_table(
    index='cluster', values='id',
    aggfunc='count', columns='topic').fillna(0).applymap(int)

cluster_stats_df = cluster_stats_df.apply(
  lambda x: 100*x/cluster_stats_df.sum(axis=1))

fig = px.imshow(
    cluster_stats_df.values, 
    x=cluster_stats_df.columns,
    y=cluster_stats_df.index,
    text_auto='.2f', aspect="auto",
    labels=dict(x="클러스터", y="팩트 주제", color="비율, %"),
    color_continuous_scale='pubugn',
    title='<b>각 클러스터의 주제 비율</b>', height=550)

fig.show()
```

<img src="/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_20.png" />

대부분의 경우, 클러스터링은 완벽하게 작동했어요. 예를 들어, 클러스터 5에는 거의 자전거에 관한 질문만 있고, 클러스터 6은 커피에 관한 것이에요. 그러나 유사한 주제를 구별하지 못했어요:

<div class="content-ad"></div>

- "ai," "genai," and "datascience"은 동일한 클러스터에 있습니다.
- "economics"와 "politics"은 같은 그룹에 속합니다.

이 예제에서는 피처로써 임베딩만 사용했지만, 질문을 한 사용자의 나이, 성별 또는 국가와 같은 추가 정보가 있다면 모델에 포함시킬 수도 있습니다.

## 분류

임베딩을 분류 또는 회귀 작업에 사용할 수 있습니다. 예를 들어 고객 리뷰 감정을 예측하는 (분류)이나 NPS 점수를 예측하는 (회귀) 등 다양한 작업에 활용할 수 있습니다.

<div class="content-ad"></div>

분류 및 회귀는 지도 학습이므로 레이블이 필요합니다. 다행히도, 우리는 질문의 주제를 알고 있으므로 모델을 적합시켜 예측할 수 있습니다.

저는 랜덤 포레스트 분류기를 사용할 것입니다. 랜덤 포레스트에 대해 간단히 상기하고 싶다면 여기에서 확인할 수 있어요. 분류 모델의 성능을 올바르게 평가하려면 데이터 세트를 학습 및 테스트 세트(80% 대 20%)로 분할할 것입니다. 그런 다음 학습 데이터 세트에서 모델을 훈련하고 테스트 데이터 세트에서 품질을 측정할 수 있습니다(모델이 이전에 보지 못한 질문).

```js
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
class_model = RandomForestClassifier(max_depth = 10)

# 특징 및 대상 정의
X = embeddings_array
y = df.topic

# 데이터를 학습 및 테스트 세트로 분할
X_train, X_test, y_train, y_test = train_test_split(
    X, y, random_state = 42, test_size=0.2, stratify=y
)

# 적합 및 예측
class_model.fit(X_train, y_train)
y_pred = class_model.predict(X_test)
```

모델의 성능을 추정하기 위해 혼동 행렬을 계산해 보겠습니다. 이상적인 상황에서는 비대각 요소가 모두 0이어야 합니다.

<div class="content-ad"></div>

```js
from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_test, y_pred)

fig = px.imshow(
  cm, x = class_model.classes_,
  y = class_model.classes_, text_auto='d', 
  aspect="auto", 
  labels=dict(
      x="predicted label", y="true label", 
      color="cases"), 
  color_continuous_scale='pubugn',
  title = '<b>혼동 행렬</b>', height = 550)

fig.show()
```

![이미지](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_21.png)

군집화와 유사한 결과를 확인할 수 있습니다. 일부 주제는 쉽게 분류되고 정확도가 100%인 반면, 다른 주제들은 구별하기 어려운 경우도 있습니다(특히 "ai" 주제).

하지만 전체적으로 91.8%의 정확도를 달성했으며, 이는 꽤 좋은 성과입니다.

<div class="content-ad"></div>

## 이상 징후 찾기

데이터에서 이상 징후를 찾기 위해 임베딩을 사용할 수도 있습니다. 예를 들어, t-SNE 그래프에서 "여행" 주제에 대한 몇 가지 질문이 군집에서 꽤 멀리 떨어져 있는 것을 볼 수 있었습니다. 이 테마를 살펴보고 이상 징후를 찾아보겠습니다. 이를 위해 이상 탐지 알고리즘인 Isolation Forest를 사용할 것입니다.

```js
from sklearn.ensemble import IsolationForest

topic_df = df[df.topic == 'travel']
topic_embeddings_array = np.array(topic_df.embedding.values.tolist())

clf = IsolationForest(contamination=0.03, random_state=42)
topic_df['is_anomaly'] = clf.fit_predict(topic_embeddings_array)

topic_df[topic_df.is_anomaly == -1][['full_text']]
```

여기에서, 여행 주제에 대한 가장 흔하지 않은 댓글을 찾았습니다 (원본).

<div class="content-ad"></div>

```js
로마 구역의 곳곳에 있는 분수에서 물을 마셔도 안전한가요?

로마를 방문했을 때 오래된 지역을 거닐며 다양한 종류의 분수를 보았습니다. 물이 끊임없이 흘러나오는 분수들이 많았는데, 땅으로 흘러가는 분수도 있고, 대야에 모이는 분수도 있었습니다.

이런 분수에서 나오는 물을 마셔도 괜찮을까요? 방문객이 마실 수 있는 안전한 물일까요? 분수 사용에 대한 방문자들이 알아야 할 예절이 있을까요?
```

물에 관한 이야기이기 때문에 이 주석의 기능은 사람들이 물을 따르는 커피 주제와 밀접하게 관련되어 있습니다. 그래서 이 주석의 삽입 표현은 커피 클러스터와 꽤 가까운 것으로 보입니다.

t-SNE 시각화에서 찾아보면 실제로 커피 클러스터에 가까운 것을 확인할 수 있습니다.

![이미지](/assets/img/2024-06-23-TextEmbeddingsComprehensiveGuide_22.png)


<div class="content-ad"></div>

## RAG — 검색 증가 생성

최근 LLM의 인기가 높아지면서, 임베딩이 RAG 사용 사례에서 널리 사용되고 있습니다.

우리는 많은 문서가 있는 경우(예: 스택 오버플로우의 모든 질문)에 검색 증가 생성이 필요합니다. 그리고 모든 정보를 항상 LLM에 전달할 수 없기 때문에

- LLM은 컨텍스트 크기에 제한이 있습니다(현재 GPT-4 Turbo의 경우 128K입니다).
- 우리는 토큰을 구매해야 하므로 모든 정보를 항상 전달하는 것이 더 비십니다.
- LLM은 더 큰 컨텍스트에서 성능이 떨어집니다. 자세한 내용은 "바늘 찾기" - LLM의 압력 테스트를 확인할 수 있습니다.

<div class="content-ad"></div>

대규모 지식 베이스와 함께 작업할 수 있도록 RAG 방법론을 활용할 수 있어요:

- 모든 문서에 대한 임베딩을 계산하고 벡터 저장소에 저장합니다.
- 사용자 요청을 받으면 해당 요청의 임베딩을 계산하여 저장소에서 관련 문서를 검색할 수 있어요.
- 최종 답변을 얻기 위해 LLM에게 관련 문서만 전달하면 돼요.

RAG에 대해 더 자세히 알고 싶다면 여기에 더 많은 내용을 담은 제 논문을 읽어보세요.

# 요약

<div class="content-ad"></div>

이 기사에서는 텍스트 임베딩에 대해 많은 세부 내용을 논의했습니다. 이제 여러분은 이 주제에 대해 완전하고 심도 있는 이해를 가졌을 것입니다. 저희 여정을 간단히 요약하면 다음과 같습니다:

- 먼저, 텍스트 작업 방법의 진화를 살펴보았습니다.
- 그 다음으로, 텍스트 간에 유사한 의미를 가지고 있는지를 이해하는 방법에 대해 논의했습니다.
- 그 후에는 텍스트 임베딩 시각화의 다양한 접근 방법을 살펴보았습니다.
- 마지막으로, 임베딩을 클러스터링, 분류, 이상 탐지 및 RAG와 같은 다양한 실용적인 작업에서 특징으로 사용해 보았습니다.

# 참고

이 기사에서는 크리에이티브 커먼즈 라이센스 하에 공개된 스택 엑스체인지 데이터 덤프에서 데이터 세트를 사용했습니다.

<div class="content-ad"></div>

이 글은 다음 강좌에서 영감을 받았습니다:

- DeepLearning.AI와 Google Cloud의 협력으로 진행되는 "Understanding and Applying Text Embeddings",
- DeepLearning.AI와 Weaviate의 협력으로 진행되는 "Vector Databases: From Embeddings to Applications".