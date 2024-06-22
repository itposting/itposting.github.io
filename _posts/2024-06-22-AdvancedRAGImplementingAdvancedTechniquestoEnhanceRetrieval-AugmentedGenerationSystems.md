---
title: "고급 RAG 정보 검색 강화 생성 시스템 향상시키는 고급 기법 구현 방법"
description: ""
coverImage: "/assets/img/2024-06-22-AdvancedRAGImplementingAdvancedTechniquestoEnhanceRetrieval-AugmentedGenerationSystems_0.png"
date: 2024-06-22 19:52
ogImage: 
  url: /assets/img/2024-06-22-AdvancedRAGImplementingAdvancedTechniquestoEnhanceRetrieval-AugmentedGenerationSystems_0.png
tag: Tech
originalTitle: "Advanced RAG: Implementing Advanced Techniques to Enhance Retrieval-Augmented Generation Systems"
link: "https://medium.com/@ndemir/advanced-rag-implementing-advanced-techniques-to-enhance-retrieval-augmented-generation-systems-0e07301e46f4"
---


이제 RAG (Retrieval Augmented Generation) 기술이 LLMs와 상호 작용 중에 사실로 잘 알려져 있는 것 같아요. 최근에 제가 쓴 하나의 기사에서는 코드 예제와 함께 단계별로 RAG 파이프라인을 구축했습니다. 이 기사에서 우리는 이 이니셔티브를 한 단계 더 나아가서 고급 RAG 파이프라인을 구현해볼 거에요.

# 1. 고급 정보 검색 기반 생성 (RAG) 파이프라인: 개요

기본 RAG 작업 흐름은 색인화, 검색 및 생성 세 단계로 나뉠 수 있어요. 색인화 단계에서 텍스트는 임베딩으로 변환되고, 이후에는 이를 검색 가능한 인덱스를 만들기 위해 벡터 데이터베이스에 저장됩니다. 검색 단계에서 사용자의 질의도 임베딩으로 변환됩니다. 이 임베딩은 가장 관련 있는 텍스트 데이터를 검색하기 위해 벡터 데이터베이스를 탐색하는 데 사용됩니다. 마지막으로 생성 단계에서 질의는 이전에 검색된 관련 문서들로 확장되고, 이 향상된 프롬프트를 사용하여 대규모 언어 모델이 사용자 질문에 대한 답변을 생성합니다.

고급 RAG 파이프라인은 새로운 단계(하위 단계)가 추가된 이 파이프라인의 향상된 버전입니다. 이 기사에서 논의될 개선 사항 목록은 다음과 같지만, 전반적인 목록은 이에 한정되지 않을 거에요.

<div class="content-ad"></div>

- 데이터 색인 최적화: 슬라이딩 윈도우를 사용하여 텍스트 청킹 및 효율적인 메타데이터 활용과 같은 기술을 사용하여 더 검색 가능하고 조직화된 색인을 생성합니다.
- 쿼리 향상: 동의어 또는 보다 넓은 범위의 용어를 사용하여 초기 사용자 쿼리를 수정하거나 확장하여 관련 문서의 검색을 개선합니다.
- 하이브리드 검색: 전통적인 키워드 기반 검색과 임베딩 벡터를 사용한 의미론적 검색을 결합하여 다양한 쿼리 복잡성을 처리합니다.
- 임베딩 모델 세밀 조정: 사전 훈련된 모델을 조정하여 특정 도메인 세부 사항을 더 잘 이해하고 검색된 문서의 정확도와 관련성을 향상시킵니다.
- 응답 요약: 검색된 텍스트를 압축하여 최종 응답 생성 전에 간결하고 관련성 있는 요약을 제공합니다.
- 다시 순위 매기기 및 필터링: 관련성에 기초하여 검색된 문서의 순서를 조정하고, 덜 관련성이 떨어지는 결과를 걸러내어 최종 출력물을 정제합니다.

여기 나열한 것 외에도 가능한 개선점은 다양합니다. RAG 기술을 조사한 논문이 있어서 RAG 파이프라인의 품질을 향상시키는 데 사용할 수 있는 많은 개선 사항을 찾을 수 있습니다. 다음 다이어그램은 고급 RAG 파이프라인의 단계를 보여줍니다.

![다이어그램](/assets/img/2024-06-22-AdvancedRAGImplementingAdvancedTechniquestoEnhanceRetrieval-AugmentedGenerationSystems_0.png)

본 문서에서는 기본 RAG 파이프라인에 대한 이해를 전제로 하고, 개선 사항에만 초점을 맞출 것입니다. 이해가 되지 않는 경우, 이전 글인 "RAG와 함께하는 실전: LLMs에 검색 보강 생성 통합하기 - 단계별 가이드"를 읽어보시기를 권해 드립니다.

<div class="content-ad"></div>

# 2. Pre-Retrieval Optimizations for Advanced Retrieval-Augmented Generation (RAG)

사전검색은 인덱싱이 어떻게 수행되며 사용자 쿼리가 검색에 사용되기 전에 어떤 작업이 수행되는지를 정의하는 단계입니다. 아래에서 사전검색 최적화를 위한 여러 전략을 논의하겠으며, 데이터 인덱싱 및 쿼리 개선을 포함한 샘플 Python 코드를 제공할 것입니다.

## 2.1. 데이터 인덱싱 최적화

다른 작업을 수행하기 전에 나중에 질의할 수 있는 데이터를 저장해야 합니다. 이를 인덱싱이라고 합니다. 이는 올바른 청크 크기 설정, 메타데이터 효과적인 사용 및 임베딩 모델 선택을 포함합니다.

<div class="content-ad"></div>

2.1.1. 텍스트 청킹을 위한 슬라이딩 윈도우

텍스트를 색인화하는 간단한 방법은 텍스트를 n 부분으로 나누고, 그것들을 임베딩 벡터로 변환한 다음 벡터 데이터베이스에 저장하는 것입니다. 슬라이딩 윈도우 접근 방식은 겹치는 텍스트 청크를 생성하여 청크의 경계에서 어떤 문맥 정보도 손실되지 않도록 보장합니다. 다음 코드 샘플은 텍스트를 문장으로 분할하기 위해 nltk 라이브러리를 사용합니다.

```python
import nltk
from nltk.tokenize import sent_tokenize

nltk.download('punkt')  # punkt 토크나이저가 다운로드되었는지 확인

def sliding_window(text, window_size=3):
    """
    슬라이딩 윈도우 접근 방식을 사용하여 텍스트 청킹 생성

    Args:
    text (str): 청크할 입력 텍스트
    window_size (int): 청크 당 문장 수

    Returns:
    list of str: 텍스트 청크 목록
    """
    sentences = sent_tokenize(text)
    return [' '.join(sentences[i:i+window_size]) for i in range(len(sentences) - window_size + 1)]

# 예제 사용법
text = "This is the first sentence. Here comes the second sentence. And here is the third one. Finally, the fourth sentence."
chunks = sliding_window(text, window_size=3)
for chunk in chunks:
    print(chunk)
    print("-----")
    # 여기서 청크를 임베딩 벡터로 변환하고
    # 그것을 벡터 데이터베이스에 저장할 수 있습니다
```

2.1.2. 메타데이터 활용

<div class="content-ad"></div>

메타데이터에는 문서 작성 날짜, 작성자 또는 관련 태그와 같은 정보가 포함될 수 있습니다. 이 정보는 검색 프로세스를 향상시켜 검색 중에 문서를 필터링하거나 우선 순위를 지정하는 데 사용될 수 있습니다.

다음 코드 샘플은 faiss 라이브러리를 사용하여 벡터 데이터베이스를 생성하고 벡터를 삽입하고 메타데이터(태그)로 검색하는 방법을 보여줍니다.

```js
import numpy as np
import faiss

documents = [
    "문서 1 내용",
    "두 번째 문서의 내용",
    "세 번째 문서는 다른 내용을 가지고 있습니다",
]
metadata = [
    {"날짜": "20230101", "태그": "뉴스"},
    {"날짜": "20230102", "태그": "업데이트"},
    {"날짜": "20230103", "태그": "리포트"},
]

# 더미 함수를 사용하여 임베딩 생성
def generate_embeddings(texts):
    """예시를 위한 더미 임베딩 생성."""
    return np.random.rand(len(texts), 128).astype('float32')  # 128차원 임베딩

# 문서에 대한 임베딩 생성
doc_embeddings = generate_embeddings(documents)

# 임베딩용 FAISS 인덱스 생성(단순성을 위해 FlatL2 사용)
index = faiss.IndexFlatL2(128)  # 128은 벡터의 차원
index.add(doc_embeddings)  # 인덱스에 임베딩 추가

# 메타데이터를 사용하는 검색 함수 예시
def search(query_embedding, metadata_key, metadata_value):
    """메타데이터 기준과 일치하는 문서를 인덱스에서 검색합니다."""
    k = 2  # 찾을 최근접 이웃 수
    distances, indices = index.search(np.array([query_embedding]), k)  # 검색 수행
    results = []
    for idx in indices[0]:
        if metadata[idx][metadata_key] == metadata_value:
            results.append((documents[idx], metadata[idx]))
    return results

# 쿼리 임베딩 생성(실제 상황에서는 유사한 프로세스로부터 생성)
query_embedding = generate_embeddings(["여기에 쿼리 내용"])[0]

# '업데이트'로 태그된 문서 검색
matching_documents = search(query_embedding, '태그', '업데이트')
print(matching_documents)
```

<div class="content-ad"></div>

사용자가 질문을 명확하게 표현하지 못할 수도 있는 경우가 있습니다. 그런 경우에는 질문을 완전히 다시 작성하거나 확장하여 쿼리를 개선할 수 있습니다.

LLM 자체를 활용할 수 있습니다. 질문을 LLM에 보내서 더 명확하게 표현하도록 요청할 수 있습니다. 다음 프롬프트가 그 작업에 도움이 될 것입니다.

```js
프롬프트: '{prompt}'을(를) 주어서, 더 잘 표현된 3가지 질문을 생성하십시오.
```

새로운 쿼리를 얻은 후, 새로운 쿼리를 임베딩 벡터로 변환하여 벡터 데이터베이스에서 사용할 수 있습니다.

<div class="content-ad"></div>

# 3. 고급 검색 증강 생성 (RAG)을 위한 검색 기술

검색은 쿼리가 이전에 색인 된 데이터베이스를 탐색하는 단계입니다. 아래에서는 검색을 위한 다양한 전략을 논의하겠습니다.

## 3.1. 하이브리드 검색 모델

지금까지 우리는 항상 임베딩 벡터를 저장하는 벡터 데이터베이스에서 쿼리를 검색하는 것을 논의해 왔습니다. 이를 한 걸음 더 나아가 전통적인 키워드 기반 검색과 결합해 봅시다. 이 접근 방식은 검색 시스템이 정확한 키워드 일치를 필요로하는 쿼리부터 컨텍스트 이해가 필요한 복잡한 쿼리까지 다양한 유형의 쿼리를 처리할 수 있도록 합니다.

<div class="content-ad"></div>

하이브리드 검색 모델을 만들어 보겠습니다. 전통적인 검색 메커니즘에는 Elasticsearch를 사용하고 의미론적 검색을 위해 벡터 데이터베이스로 faiss를 사용할 것입니다.

전체 코드는 여기에서 확인할 수 있어요: https://github.com/ndemir/machine-learning-projects/tree/main/hybrid-search — 여기에는 Elasticsearch를 실행하는 방법을 보여주는 보너스 Dockerfile도 포함되어 있습니다.

3.1.1. Elasticsearch로 색인하기

우선, 모든 문서가 'documents' 딕셔너리에 있다고 가정하고 임베딩 벡터를 이미 가져와 딕셔너리에 저장했다고 가정해 봅시다. 다음 코드 블록은 Elasticsearch 8.13.4에 연결하고 주어진 샘플 문서를 위해 색인을 생성합니다.

<div class="content-ad"></div>

```js
ES_NODES = "http://localhost:9200"

documents = [
    {"id": 1, "text": "파이썬 프로그래밍을 시작하는 방법.", "vector": [0.1, 0.2, 0.3]},
    {"id": 2, "text": "고급 파이썬 프로그래밍 팁.", "vector": [0.1, 0.3, 0.4]},
    # 더 많은 문서...
]

from elasticsearch import Elasticsearch

es = Elasticsearch(
    hosts=ES_NODES,
)
for doc in documents:
    es.index(index="documents", id=doc['id'], document={"text": doc['text']})
```

3.1.2. Faiss를 사용한 색인

이 부분에서는 faiss를 벡터 데이터베이스로 사용하여 벡터를 색인화합니다.

```js
import numpy as np
import faiss

dimension = 3  # 간단함을 위해 3차원 벡터를 가정합니다.
faiss_index = faiss.IndexFlatL2(dimension)
vectors = np.array([doc['vector'] for doc in documents])
faiss_index.add(vectors)
```

<div class="content-ad"></div>

3.1.3. 혼합 검색

아래 코드 블록은 혼합 검색을 설명합니다. 이는 사용할 수 있는 샘플이며, 또는 자체 사용 사례에 맞게 무언가를 처음부터 만들 수도 있습니다.

```js
def hybrid_search(query_text, query_vector, alpha=0.5):
    # "documents" 인덱스에서 Elasticsearch를 사용하여 제공된 query_text와 일치하는 키워드 검색 수행.
    response = es.search(index="documents", query={"match": {"text": query_text})
    # Elasticsearch 응답에서 문서 ID 및 해당 점수를 추출합니다.
    keyword_results = {hit['_id']: hit['_score'] for hit in response['hits']['hits']}

    # Faiss 호환을 위해 query_vector를 재구성하고 float32로 변환하여 벡터 검색을 수행합니다.
    query_vector = np.array(query_vector).reshape(1, -1).astype('float32')
    # Faiss를 사용하여 상위 5개 가장 가까운 문서의 인덱스를 검색합니다.
    _, indices = faiss_index.search(query_vector, 5)
    # 벡터 검색 결과의 점수를 순위에 반비례하도록하여 딕셔너리 형태로 만듭니다 (순위가 높을수록 더 높은 점수).
    vector_results = {str(documents[idx]['id']): 1/(rank+1) for rank, idx in enumerate(indices[0])}

    # 키워드 및 벡터 검색 결과에서 결합된 점수를 보유할 딕셔너리를 초기화합니다.
    combined_scores = {}
    # 키워드 및 벡터 결과에서 문서 ID의 합집합을 반복합니다.
    for doc_id in set(keyword_results.keys()).union(vector_results.keys()):
        # 각 문서에 대한 결합된 점수를 계산합니다. alpha 매개변수를 사용하여 두 검색 결과의 영향을 균형있게 조절합니다.
        combined_scores[doc_id] = alpha * keyword_results.get(doc_id, 0) + (1 - alpha) * vector_results.get(doc_id, 0)

    # 관련 문서의 결합된 점수를 포함하는 딕셔너리를 반환합니다.
    return combined_scores

# 예시 사용법
query_text = "Python 프로그래밍"
query_vector = [0.1, 0.25, 0.35]
# 지정된 쿼리 텍스트와 벡터로 혼합 검색 함수를 실행합니다.
results = hybrid_search(query_text, query_vector)
# 혼합 검색 결과를 출력하여 문서의 결합된 점수를 확인합니다.
print(results)
```

hybrid_search 함수는 Elasticsearch를 사용하여 키워드 검색으로 시작합니다. 다음 단계에서; Faiss를 사용하여 벡터 검색을 수행하고, Faiss는 가장 가까운 상위 다섯 개 문서의 인덱스를 반환하며, 이러한 인덱스를 기반으로 문서의 순위에 따라 점수를 만듭니다.

<div class="content-ad"></div>

그리고 Elasticsearch와 Faiss에서 결과를 얻으면, 두 방법의 점수를 결합합니다. 각 문서의 최종 점수는 alpha 매개변수를 사용하여 계산된 가중 평균입니다. alpha=.5는 두 결과에 동등한 가중치를 부여합니다.

## 3.2. 임베딩 모델 세밀 조정

임베딩 모델을 세밀하게 조정하는 것은 검색 증강 생성 시스템의 성능을 향상시키는 효과적인 단계입니다. 사전 훈련된 모델을 세밀하게 조정하면 해당 도메인이나 데이터 집합의 미묘한 점을 이해하는 데 도움이 되며, 그 결과 문서의 관련성과 정확성을 크게 향상시킬 수 있습니다.

세밀하게 모델을 조정하는 중요성은 다음 요점으로 요약할 수 있습니다:

<div class="content-ad"></div>

- 향상된 의미 이해: 세밀 조정은 모델이 원래 훈련 데이터에 잘 표현되지 않을 수 있는 도메인 특정 용어와 개념을 파악하는 데 도움이 됩니다.
- 진화하는 콘텐츠에 대한 적응: 일부 분야(의학 또는 기술 분야 등)의 정보는 빠르게 변화하므로, 세밀 조정을 통해 임베딩을 최신 상태로 유지하면 시스템의 효과를 유지할 수 있습니다.
- 검색 정밀도 상승: 임베딩 공간을 타깃 사용 사례에 더 밀접하게 맞추면, 세밀 조정을 통해 의미론적으로 관련있는 텍스트를 더 신뢰성 있게 검색할 수 있습니다.

다음 3개의 소목을 통해 데이터를 세밀 조정하기 위한 코드 샘플을 볼 수 있습니다. 데이터를 세밀 조정하고(훈련) 모델을 사용하는 방법을 보여줍니다. 전체 코드는 제 깃허브 저장소에서 확인하실 수 있습니다: https://github.com/ndemir/machine-learning-projects/tree/main/fine-tuning-embedding-model

3.2.1. 세밀 조정을 위한 데이터 준비

다음 코드 블록은 모델을 세밀 조정하기 위한 첫 번째 단계입니다. 사전 훈련된 마스킹 언어 모델을 세밀 조정할 파이프라인을 초기화하고, 모델과 토크나이저를 로드하며, 장치 호환성에 맞게 조정합니다(GPU 또는 CPU).

<div class="content-ad"></div>

초기화 후 샘플 데이터셋을 토큰화하고 동적 토큰 마스킹을 통해 처리합니다. 이 설정은 모델을 자가 지도 학습을 위해 준비시켜주며, 모델은 가리킨 토큰을 예측하여 입력 데이터의 의미 이해를 향상시킵니다.

```js
# Sentence Transformers 라이브러리의 사전 훈련된 모델을 사용하여 모델 이름을 정의합니다.
model_name = "sentence-transformers/all-MiniLM-L6-v2"

# Hugging Face의 transformers 라이브러리에서 지정된 모델의 토크나이저를 로드합니다.
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 지정된 모델을 기반으로 한 마스크 언어 모델링을 위해 모델을 로드합니다.
model = AutoModelForMaskedLM.from_pretrained(model_name)

# GPU 사용 가능 여부를 확인하고 장치를 설정합니다; GPU를 사용할 수 없는 경우 CPU를 사용합니다.
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 모델을 해당 장치로 이동시킵니다 (GPU 또는 CPU)
model.to(device)

# 데이터셋을 생성하는 제너레이터 함수를 정의합니다; 이는 실제 데이터 로딩 로직으로 대체되어야 합니다.
def dataset_generator():
    # 개별 문장으로 구성된 예제 데이터셋; 실제 데이터셋 문장으로 대체합니다.
    dataset = ["sentence1", "sentence2", "sentence3"]
    # 각 문장을 'text' 키를 가진 사전으로 반환합니다.
    for sentence in dataset:
        yield {"text": sentence}

# 제너레이터 함수로부터 Hugging Face의 Dataset 클래스를 사용하여 데이터셋 객체를 생성합니다.
dataset = Dataset.from_generator(dataset_generator)

# 텍스트 데이터를 토큰화하는 함수를 정의합니다.
def tokenize_function(example):
    # 입력 텍스트를 토큰화하고 모델이 처리할 수 있는 최대 길이로 자릅니다.
    return tokenizer(example["text"], truncation=True)

# 데이터셋의 모든 항목에 토큰화 함수를 적용하고 효율성을 위해 배치 처리합니다.
tokenized_datasets = dataset.map(tokenize_function, batched=True)

# 토큰화된 언어 모델링을 위한 데이터 수집기를 초기화하고 토큰을 무작위로 마스킹합니다.
# 이는 모델을 자가 지도 학습 방식으로 훈련하는 데 사용됩니다.
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=True, mlm_probability=0.15)
```

3.2.2. 모델 세밀 조정

데이터가 준비되면, 모델을 세밀 조정하는 단계로 넘어갈 수 있습니다. 이 단계에서는 모델의 기존 가중치를 사용하여 업데이트를 시작합니다.

<div class="content-ad"></div>

아래 코드 블록은 Hugging Face의 Trainer API를 사용하여 언어 모델의 훈련을 설정하고 실행하는 내용입니다. 먼저 훈련 매개변수(에포크, 배치 크기, 학습률 등)를 정의합니다. Trainer 객체는 미리 로드된 모델, 토큰화된 데이터 세트 및 가려진 언어 모델링용 데이터 콜렉터와 함께 이러한 설정을 사용합니다 (모델, 토큰화된 데이터 세트 및 데이터 콜렉터는 이전 단계에서 생성되었습니다). 훈련이 완료되면 새로 업데이트된 모델과 해당 토크나이저가 저장되어 다음 단계에서 사용됩니다.

```js
# 훈련 세션 구성을 위한 훈련 매개변수 정의
training_args = TrainingArguments(
    output_dir="output",  # 체크포인트와 같이 저장될 출력 디렉토리
    num_train_epochs=3,  # 수행할 총 훈련 에포크 수
    per_device_train_batch_size=16,  # 훈련 중 각 장치당 배치 크기
    learning_rate=2e-5,  # 옵티마이저의 학습률
)

# 훈련 루프와 평가를 처리하는 Trainer 초기화
trainer = Trainer(
    model=model,  # 로드되고 구성된 훈련될 모델
    args=training_args,  # 훈련 설정을 정의하는 훈련 매개변수
    train_dataset=tokenized_datasets,  # 토큰화되고 준비된 데이터 세트
    data_collator=data_collator,  # 입력 형식 및 마스킹을 처리하는 데이터 콜렉터
)

# 훈련 과정 시작
trainer.train()

# 세부 튜닝된 모델 및 토크나이저를 저장할 경로 정의
model_path = "./model"
tokenizer_path = "./tokenizer"

# 지정된 경로에 세부 튜닝된 모델 저장
model.save_pretrained(model_path)

# 훈련에 사용된 토크나이저를 지정된 경로에 저장
tokenizer.save_pretrained(tokenizer_path)
```

3.2.3. 세부 튜닝된 모델 사용

이제 저장된 모델과 토크나이저를 사용하여 임베딩 벡터를 생성하는 시간입니다. 아래 코드 블록이 해당 목적으로 사용됩니다.

<div class="content-ad"></div>

다음 코드 블록은 주어진 문장에 대한 임베딩을 생성하기 위해 모델과 토크나이저를로드하는 방법을 보여줍니다. 먼저, 모델과 토크나이저를 저장된 경로에서로드하고 GPU 또는 CPU에 할당됩니다. 문장(이 기사의 맥락에서는 쿼리입니다)이 토큰화됩니다. 모델은 이러한 입력을 처리하고 매개변수를 업데이트하지 않는 상태에서 작동합니다. 이를 추론 모드라고하며 torch.no_grad() 블록 아래에서 수행됩니다. 이 모델을 사용하여 다음 토큰을 예측하는 것은 아니며 대신 모델의 숨겨진 상태에서 임베딩 벡터를 추출하는 것이 목표입니다. 마지막 단계로, 이러한 임베딩 벡터를 CPU로 이동합니다.

```js
# 저장된 경로에서 토크나이저와 모델을로드하여 모델이 적절한 장치(GPU 또는 CPU)에 할당되도록합니다.
tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
model = AutoModelForMaskedLM.from_pretrained(model_path).to(device)

# 가변 길이의 문장을 처리하기위한 패딩 및 자르기를 구성하여 입력 문장을 토큰화하는 함수 정의
def tokenize_function_embedding(example):
    return tokenizer(example["text"], padding=True, truncation=True)

# 임베딩을 생성 할 예제 문장 목록
sentences = ["This is the first sentence.", "This is the second sentence."]

# 이러한 문장을 직접 Dataset 객체로 생성
dataset_embedding = Dataset.from_dict({"text": sentences})

# 데이터셋을 임베딩 생성을 준비하기 위해 토큰화 함수를 적용
tokenized_dataset_embedding = dataset_embedding.map(tokenize_function_embedding, batched=True, batch_size=None)

# 모델이 어떤 부분이 패딩이고 어떤 부분이 실제 내용인지 이해하도록 하는 'input_ids' 및 'attention_mask' 추출
input_ids = tokenized_dataset_embedding["input_ids"]
attention_mask = tokenized_dataset_embedding["attention_mask"]

# 이 목록을 텐서로 변환하고 처리에 적합한 장치(GPU 또는 CPU)에 있도록합니다.
input_ids = torch.tensor(input_ids).to(device)
attention_mask = torch.tensor(attention_mask).to(device)

# 계산 자원을 절약하기 위해 그라데이션을 업데이트하지 않고 모델을 사용하여 임베딩 생성
with torch.no_grad():
    outputs = model(input_ids=input_ids, attention_mask=attention_mask, output_hidden_states=True)
    # 임베딩으로서 마지막 레이어의 숨겨진 상태를 추출하고, 특히 첫 번째 토큰(일반적으로 BERT 유형의 모델에서 문장 임베딩을 나타내는 데 사용됨) 사용
    embeddings = outputs.hidden_states[-1][:, 0, :]

# 임베딩을 GPU에서 CPU로 쉽게 이동하여 조작하거나 저장합니다
embeddings = embeddings.cpu()

# 각 문장에 해당하는 임베딩 벡터를 출력합니다
for sentence, embedding in zip(sentences, embeddings):
    print(f"문장: {sentence}")
    print(f"임베딩: {embedding}\n")
```

# 4. RAG(Advanced Retrieval-Augmented Generation)를위한 포스트-검색 기법

관련 정보를 검색하는 마법은 여기서 끝나지 않습니다. 가능한 개선 사항은 다음 단계에서 나타납니다: 검색 이후. 사용자는 정확한 결과뿐만 아니라 올바른 순서로 제공되는 결과를 필요로 합니다. 다음 2개 하위 섹션에서 RAG의 품질을 개선하기 위해 요약 및 재정렬을 사용하는 방법을 설명하겠습니다.

<div class="content-ad"></div>

## 4.1. 응답 요약화

만약 색인화 과정 중에 대량의 텍스트 벡터를 데이터베이스에 저장했다면, 이 단계가 필요할 수 있습니다. 이미 텍스트가 작은 경우에는 이 단계가 필요하지 않을 수 있습니다.

다음 코드 블록은 요약화 프로세스에 사용될 수 있습니다. 아래 코드 블록은 전처리된 BART 모델을 사용하여 텍스트를 요약화하는 데 transformer 라이브러리를 사용합니다. summarize_text 함수는 텍스트를 받아들이고 최대 및 최소 길이 매개변수를 기반으로 간결한 요약을 생성하기 위해 모델을 사용합니다.

```js
from transformers import pipeline
def summarize_text(text, max_length=130):
  
    # Hugging Face의 모델 허브에서 사전 학습된 요약 모델을 로드합니다.
    # 'facebook/bart-large-cnn'은 간결한 요약을 생성하는 데 뛰어난 능력을 가졌기 때문에 선택되었습니다.
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
  
    # 요약기는 입력 텍스트를 BART 모델을 사용하여 압축합니다.
    # 'max_length'는 요약 출력의 최대 길이를 지정합니다.
    # 'min_length'는 요약이 너무 간결하지 않도록 하기 위해 최소 길이를 설정합니다.
    # 'do_sample'은 요약 생성에 결정론적 접근 방식을 사용하기 위해 False로 설정됩니다.
    summary = summarizer(text, max_length=max_length, min_length=30, do_sample=False)
    
    # 요약기의 출력은 딕셔너리 목록입니다.
    # 우리는 목록의 첫 번째 딕셔너리에서 요약 텍스트를 추출합니다.
    return summary[0]['summary_text']

# 요약화될 예문.
# 이 텍스트는 검색 보완 생성 시스템에서 요약화의 중요성에 대해 논의합니다.
long_text = "검색 보완 생성 시스템의 작업 흐름에서 요약화는 중요한 단계입니다. 결과물이 정확할 뿐만 아니라 간결하고 소화하기 쉽도록 보장합니다. 정보의 정확성과 정밀도가 중요한 도메인에서 특히 필수적입니다."

# summarize_text 함수를 호출하여 예시 텍스트를 압축합니다.
summarized_text = summarize_text(long_text)

# 요약된 텍스트를 출력하여 요약화 모델의 출력을 확인합니다.
print("요약된 텍스트:", summarized_text)
```

<div class="content-ad"></div>

## 4.2. 다시 순위 매기기 및 필터링

검색 과정에서 각 문서의 "점수"를 받아야 했을 것입니다. 이 "점수"는 실제로 벡터의 유사성을 쿼리 벡터와 비교한 결과입니다. 이 정보를 사용하여 문서를 다시 순위 매기고, 특정 임계값에 따라 결과를 필터링할 수 있습니다. 다음 코드 블록은 다시 순위 매기고 필터링하는 방법의 샘플을 보여줍니다.

### 4.2.1. 기본 다시 순위 매기기 및 필터링

제공된 코드 블록은 각각 ID, 텍스트, 그리고 관련 점수를 포함하는 딕셔너리로 표현된 문서 목록을 정의합니다. 그런 다음 두 가지 주요 함수인 re_rank_documents와 filter_documents를 구현합니다. re_rank_documents 함수는 관련 점수를 기준으로 문서를 내림차순으로 정렬하고, 다시 순위 매기기 후 filter_documents 함수가 적용되어 관련 점수가 0.75보다 낮은 문서를 제외합니다.

<div class="content-ad"></div>

```js
# 문서 목록 정의하기. 각 문서는 ID, 텍스트 및 관련도 점수로 표시된 딕셔너리 형태로 표현됩니다.
documents = [
    {"id": 1, "text": "고급 RAG 시스템은 텍스트 요약에 대한 정교한 기술을 사용합니다.", "relevance_score": 0.82},
    {"id": 2, "text": "기본 RAG 시스템은 주로 검색 및 기본 처리에 초점을 맞춥니다.", "relevance_score": 0.55},
    {"id": 3, "text": "재랭킹은 관련성에 따라 문서를 정렬하여 응답 품질을 향상시킵니다.", "relevance_score": 0.89}
]

# 문서를 관련도 점수에 따라 재랭킹하는 함수 정의하기.
def re_rank_documents(docs):

    # sorted 함수를 사용하여 'relevance_score'를 기준으로 문서를 정렬합니다.
    # 정렬에 사용되는 키는 람다 함수를 사용하여 각 문서에서 관련도 점수를 추출합니다.
    # 'reverse=True'는 관련성 점수가 높은 문서를 먼저 배치하여 내림차순으로 목록을 정렬합니다.
    return sorted(docs, key=lambda x: x['relevance_score'], reverse=True)

# 정의된 함수를 사용하여 문서를 재랭킹하고 결과를 출력합니다.
ranked_documents = re_rank_documents(documents)
print("재랭킹된 문서:", ranked_documents)

# 관련도 점수 임계값에 따라 문서를 필터링하는 함수 정의하기.
def filter_documents(docs, relevance_threshold=0.75):
  
    # 리스트 내포를 사용하여 'relevance_score'가 'relevance_threshold' 이상인 문서만 포함하는 새 리스트를 생성합니다.
    return [doc for doc in docs if doc['relevance_score'] >= relevance_threshold]

# 정의된 함수를 사용하여 재랭킹된 문서를 임계값 0.75로 필터링하고 결과를 출력합니다.
filtered_documents = filter_documents(ranked_documents)
print("필터링된 문서:", filtered_documents)
```

<div class="content-ad"></div>


# 데이터가 다음과 같은 형식으로 데이터베이스에 저장되어 있다고 가정합니다.
# query_text | response_text | user_clicked

query_embeddings = get_embedding_vector(database.query_text) 
response_embeddings = get_embedding_vector(database.response_text) 

# 데이터셋 생성
X = concat(query_embeddings, response_embeddings)
y = database.user_clicked

model = model.train(X, y)
model.predict_proba(...)

위의 의사 코드는 머신러닝을 사용하여 관련성에 따라 문서를 다시 순위 지정하는 접근 방식을 개요로 제시합니다. 특히 사용자가 문서를 관련성 있게 여기는 가능성을 예측하여 기반으로 새로운 상호작용을 중심으로 문서들을 순위 지정합니다. 여기서 의사 코드에 나와 있는 프로세스에 대한 단계별 설명은 다음과 같습니다:

- 임베딩 생성: 쿼리 및 응답 문서 모두 의미 적 컨텐츠를 포착하는 임베딩 벡터가 생성됩니다.
- 데이터셋 생성: 이러한 임베딩은 피쳐 벡터(X)를 형성하기 위해 연결되며, 목표 변수(y)는 사용자가 문서를 클릭했는지를 나타냅니다.
- 모델 훈련: 이 데이터셋에 대해 분류 모델이 훈련되어 쿼리와 문서 임베딩을 결합해 문서가 클릭될 가능성을 예측합니다.
- 예측: 훈련된 모델은 새로운 쿼리-문서 쌍의 클릭 확률을 예측할 수 있어서 예측된 관련성에 따라 문서를 다시 순위 지정해 검색 결과 정확도를 향상할 수 있습니다.

# 5. 결론


<div class="content-ad"></div>

간단한 검색 증강 생성(RAG) 시스템을 구현하면 문제를 해결할 수 있지만, 향상 사항을 추가하면 결과를 개선하고 시스템이 더 정확한 답변을 생성하는 데 도움이 됩니다. 이 글에서는 데이터 인덱싱 최적화, 쿼리 향상, 하이브리드 검색, 임베딩 모델의 세밀한 조정, 응답 요약, 다시 순위 매기기 및 필터링을 포함한 목표 달성을 위한 여러 가지 향상 사항을 논의했습니다. 

이러한 향상 사항을 통합함으로써 성능을 크게 향상시킬 수 있는 기회가 주어집니다. 계속해서 이러한 방법을 탐색하고 적용하여 여러분의 요구에 가장 적합한 방법을 찾도록 실험해 보세요.