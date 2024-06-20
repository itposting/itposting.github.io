---
title: "임베딩 크기를 줄이고 RAG 검색 속도 높이는 방법"
description: ""
coverImage: "/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_0.png"
date: 2024-05-27 14:56
ogImage:
  url: /assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_0.png
tag: Tech
originalTitle: "How to Reduce Embedding Size and Increase RAG Retrieval Speed"
link: "https://medium.com/towards-data-science/how-to-reduce-embedding-size-and-increase-rag-retrieval-speed-7f903d3cecf7"
---

<img src="/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_0.png" />

# 소개

텍스트 임베딩은 단일 단어나 전체 문장의 고차원 벡터 표현입니다.

이 숫자 배열로 이루어진 벡터는 기본 텍스트에 대한 풍부한 정보를 포착함으로써 의미 이해, 분류, 군집화, 정보 검색 (RAG), 재정렬 및 더 많은 하류 작업에 사용할 수 있습니다.

<div class="content-ad"></div>

보통 임베딩 벡터의 차원 d는 고정됩니다. 임베딩 차원은 일반적으로 64에서 4096까지의 2의 제곱수로 구성됩니다.

매트료시카 임베딩을 사용하면 응용 프로그램에 따라 임베딩의 차원을 변경할 수 있습니다. 이를 통해 저장 공간을 줄이고 비용을 절약하며 검색 속도를 높일 수 있습니다.

# 텍스트 임베딩이란?

![이미지](/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_1.png)

<div class="content-ad"></div>

저희는 모든 가능한 입력 문자를 정수 값으로 매핑하는 어휘를 정의하여 시작합니다. 이 어휘에는 알파벳 문자 뿐만 아니라 특수 문자, 짧은 단어 및 하위 단어도 포함됩니다:

```js
{
  "a": 1,
  "b": 2,
  "c": 3,
  ...
  "z": 26,
  "the": 27,
  " ": 28
}
```

토큰화 후에는 토큰 목록을 인코더 모델에 전달할 수 있습니다. 인코더는 대량의 훈련 데이터로부터 학습하여 각 토큰을 고차원 숫자 벡터 임베딩으로 변환합니다.

예를 들어, OpenAI의 text-embedding-3-large 모델의 임베딩의 출력 차원 d는 3072입니다.

<div class="content-ad"></div>

단일 문장 임베딩을 얻으려면 여러 토큰 임베딩에서 정보를 압축해야 합니다. 이를 위한 한 가지 방법은 단순히 모든 토큰 임베딩을 평균내는 것입니다.

# 마트료시카 임베딩

마트료시카 임베딩은 워싱턴 대학, 구글 리서치, 하버드 대학의 연구자들에 의해 2022년에 발표된 "Matryoshka Representation Learning" 논문에서 소개되었습니다.

마트료시카 임베딩은 서로 다른 세기의 정보를 하나의 임베딩 벡터에 인코딩하는 데 훈련되었습니다.

<div class="content-ad"></div>

예를 들어, MRL을 사용하여 단순히 크기 d = 1024의 전체 임베딩 벡터를 학습하는 대신, 우리는 동일한 시간에 최적화하려는 손실 함수를 위해 matryoshka_dims = [1024,512,256,128,64] 차원 목록을 사용합니다[2].

이렇게 하면 처음 몇 차원에 가장 덜 구체적인 정보가 저장되고 나중 차원에는 점점 더 많은 세부 정보가 저장된 임베딩 벡터가 생성됩니다.

![이미지](/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_2.png)

이는 우리가 원하는 곳에서 임베딩 벡터를 잘라도 성능을 너무 많이 희생하지 않고 사용할 수 있다는 효과가 있습니다.

<div class="content-ad"></div>

## 왜 중요한가요?

만약 우리가 텍스트 임베딩 벡터를 벡터 데이터베이스에 저장하려고 한다고 가정해봅시다. 각 임베딩은 d 차원을 가지고 있습니다. 그리고 각 숫자는 일반적으로 32비트 부동 소수점 수입니다. 그래서 우리는 저장을 위해 n _ d _ 4 바이트가 필요합니다.

그리고 만약 우리가 점곱이나 코사인 유사성과 같은 유사성 지표를 계산하려고 한다면 (코사인 유사성은 단지 정규화된 점곱일 뿐입니다), 차원 d가 클수록 수학적 계산을 더 많이 해야 합니다.

![image](/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_3.png)

<div class="content-ad"></div>

MRL을 사용하면 작은 메모리 공간, 빠른 처리 속도 및 따라서 비용 절약에 관심이 있다면, 첫 64차원만 사용할 수도 있습니다. 최상의 하류 성능을 원한다면 모든 차원을 사용합니다. 그리고 그 중간을 선택할 수도 있습니다.

따라서, MRL은 LLM 사용자들에게 내려보기 성능의 작은 저하에 대한 임베딩 크기(비용)의 대가를 거래할 수 있는 능력을 제공합니다.

# Nomic AI에서 MRL 사용하기

Nomic의 Matryoshka 텍스트 임베딩 모델 nomic-embed-text-v1.5은 matryoshka_dims = [768,512,256,128,64]로 훈련되었습니다. 해당 모델은 Hugging Face에서 공개적으로 사용할 수 있습니다 [3].

<div class="content-ad"></div>

또 다른 이 인코더 모델의 멋진 기능은 다른 접두사를 지원한다는 것입니다. 이 모델은 [search_query, search_document, classification, clustering] 접두사를 지원하여 각 특정 하류 작업에 대해 더 나은 임베딩을 얻을 수 있습니다.

nomic-embed-text-v1.5 모델이 Massive Text Embedding Benchmark (MTEB)에서 어떻게 수행되는지 살펴보겠습니다:

![image](/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_4.png)

Python에서 PyTorch와 Sentence Transformers 라이브러리를 사용하여 모델을 구현해 봅시다:

<div class="content-ad"></div>


!pip install torch sentence_transformers einops



import torch
from sentence_transformers import SentenceTransformer

device = "cuda" if torch.cuda.is_available() else "cpu"



model = SentenceTransformer(
    "nomic-ai/nomic-embed-text-v1.5",
    device=device,
    trust_remote_code=True,
    prompts={
        "search_query": "search_query: ",
        "search_document": "search_document: ",
        "classification": "classification: ",
        "clustering": "clustering: ",
    },
)


def embed_sentences(
    model: SentenceTransformer,
    sentences: list[str],
    prompt_name: str,
    matryoshka_dim: int,
    device: str,
):
    assert matryoshka_dim <= 768, "maximum dimension for nomic-embed-text-v1.5 is 768"
    embeddings = model.encode(
        sentences, prompt_name=prompt_name, device=device, convert_to_tensor=True
    )
    embeddings = torch.nn.functional.layer_norm(
        embeddings, normalized_shape=(embeddings.shape[1],)
    )
    embeddings = embeddings[:, :matryoshka_dim]
    embeddings = torch.nn.functional.normalize(embeddings, p=2, dim=1)
    return embeddings.cpu()


matryoshka_dim 매개변수를 사용하여 768차원 임베딩 벡터를 자릅니다. 그런 다음 새로운 임베딩 벡터를 정규화합니다.



<div class="content-ad"></div>

이제 원하는 차원을 설정하고 위키피디아 텍스트와 RAG(검색 증강 생성)용 쿼리를 인코딩할 수 있습니다.

```js
matryoshka_dim = 64

wikipedia_texts = [
    "개(Canis familiaris 또는 Canis lupus familiaris)는 늑대의 길들여진 후손입니다.",
    "알베르트 아인슈타인은 1879년 3월 14일 독일 제국의 뷔르템베르크 왕국 울름에서 태어났습니다.",
    "아인슈타인은 어린 시절부터 물리학과 수학에서 뛰어나며, 곧 같은 나이의 아이들만이 보유한 수학적 전문 지식을 습득했습니다.",
    "베르너 칼 하이젠베르크는 독일의 이론 물리학자로 양자역학 이론의 주요 선구자 중 한 명이며, 제2차 세계대전 중 나치 핵무기 프로그램의 주요 과학자였습니다.",
    "스티븐 폴 잡스(1955년 2월 24일 - 2011년 10월 5일)는 기술 거장 애플 주식회사를 공동 창업하여 가장 잘 알려진 미국 사업가, 발명가, 투자가였습니다.",
    "고양이(Felis catus), 일반적으로 가정 고양이 또는 집고양이로 불리는 것은 고양이과에서 유일하게 길들인 종입니다.",
]

question = ["알베르트 아인슈타인은 어디에서 태어났나요?"]

question_embedding = embed_sentences(
    model,
    sentences=question,
    prompt_name="search_query",
    matryoshka_dim=matryoshka_dim,
    device=device,
)

document_embeddings = embed_sentences(
    model,
    sentences=wikipedia_texts,
    prompt_name="search_document",
    matryoshka_dim=matryoshka_dim,
    device=device,
)
```

```js
print(f"document_embeddings.shape: {document_embeddings.shape}")
print(f"question_embedding.shape:  {question_embedding.shape}")
>> document_embeddings.shape: torch.Size([6, 64])
>> question_embedding.shape:  torch.Size([1, 64])
```

우리는 Matryoshka 텍스트 임베딩의 첫 번째 두 차원을 산포도로 시각화할 수 있습니다. 그러나 이 임베딩 모델은 명시적으로 2차원의 Matryoshka 차원에 최적화되지는 않았습니다.

<div class="content-ad"></div>

md
![image](/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_5.png)

다음으로, 문서 임베딩을 벡터 데이터베이스에 저장할 수 있습니다. 저는 Faiss를 사용하고 있어요. Faiss는 밀집 벡터의 효율적인 유사성 검색 및 클러스터링을 위한 Meta Research의 오픈 소스 라이브러리입니다 [4].

```bash
!pip install faiss-cpu
```




```python
import faiss

index = faiss.IndexFlatIP(matryoshka_dim)
index.add(document_embeddings)
```



<div class="content-ad"></div>

이 코드는 내적 제품을 사용하여 "정확한 검색"을 통해 벡터 데이터베이스를 만듭니다. 이때 IndexFlatIP를 사용하는데, 이는 내적 유사도 측정 방법입니다. 정규화된 임베딩을 사용하고 있기 때문에, 내적과 코사인 유사도는 동일합니다.

이제 index는 여섯 개의 텍스트 임베딩으로 구성된 벡터 데이터베이스입니다:

```js
print(index.ntotal)
>> 6
```

질문과 가장 유사한 임베딩을 검색하고 상위 k개 결과를 검색해보겠습니다:

<div class="content-ad"></div>

```js
distances, indices = index.search(question_embedding, k=6)
print(indices)
print(distances)
>> [[1 2 3 4 0 5]]
>> [[0.9633528  0.729192   0.63353264 0.62068397 0.512541   0.43155164]]
```

저희 데이터베이스에서 가장 유사한 텍스트는 인덱스 1이며 유사도 점수는 0.96입니다 (최대 점수는 1.0입니다).

```js
# d=64인 결과
print(question)
print(wikipedia_texts[1])
>> ['알버트 아인슈타인은 어디에서 태어났나요?']
>> '알버트 아인슈타인은 독일 제국의 퀴르템베르크 왕국 울름에서 1879년 3월 14일에 태어났습니다.'
```

저는 matryoshka_dim=768로 코드를 다시 실행했고 유사한 결과를 얻었습니다. 그러나 더 높은 차원은 더 많은 메모리와 계산이 필요합니다.

<div class="content-ad"></div>


```js
# 결과 d=768일 때
print(indices)
print(distances)
>> [[1 2 4 3 0 5]]
>> [[0.92466116 0.645744   0.54405797 0.54004824 0.39331824 0.37972206]]
```

# MRL 및 양자화

더욱 압축된 임베딩을 원한다면, MRL과 이진 벡터 양자화를 함께 사용할 수 있습니다. 이진 양자화는 임베딩 벡터에서 0보다 큰 모든 숫자를 1로 변환하고 그 외의 숫자를 0으로 변환합니다 [5].

<img src="/assets/img/2024-05-27-HowtoReduceEmbeddingSizeandIncreaseRAGRetrievalSpeed_6.png" />


<div class="content-ad"></div>

이진 양자화를 사용하면 d 차원의 임베딩 벡터는 오직 d / 8 바이트의 메모리만 필요합니다. 이는 float32 형식의 d \* 4 바이트와 비교해 크기가 32배로 줄어든 것을 의미합니다 [4]. 그러나 이 축소는 성능 저하와 함께 발생합니다.

# 결론

Matryoshka 손실을 사용하는 임베딩 모델은 훈련 중에 동시에 여러 임베딩 차원에 최적화되어 있습니다.

Matryoshka 표현 학습을 사용하면 LLM 사용자가 텍스트 임베딩 크기를 작게 조정하여 성능 저하를 감수할 수 있습니다.

<div class="content-ad"></div>

더 작은 임베딩은 더 적은 메모리와 계산을 필요로하며, 이는 장기적으로 많은 비용을 절약할 수 있습니다. 또한 계산이 빨라져서 검색 속도가 빨라지기 때문에, 예를 들어 RAG 애플리케이션에 적합합니다.

# 참고 자료

[1] A. Kusupati 등. (2022), Matryoshka Representation Learning, arXiv:2205.13147

[2] MatryoshkaLoss: https://www.sbert.net/docs/package_reference/losses.html#matryoshkaloss (접근일: 2024년 04월 05일)

<div class="content-ad"></div>

[3] Hugging Face의 nomic-embed-text-v1.5: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5 (접속일: 2024년 04월 05일)

[4] Faiss 문서: https://github.com/facebookresearch/faiss/wiki/Getting-started (접속일: 2024년 04월 05일)

[5] A. Shakir, T. Aarsen, S. Lee (2024), 바이너리 및 스칼라 임베딩 양자화로 훨씬 빠르고 저렴한 검색, Hugging Face 블로그
