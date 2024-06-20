---
title: "LLamaIndex와 Gemini를 사용하여 고급 검색 엔진 만들기"
description: ""
coverImage: "/assets/img/2024-06-19-BuildingAdvancedSearchEngineswithLLamaIndexandGemini_0.png"
date: 2024-06-19 19:24
ogImage: 
  url: /assets/img/2024-06-19-BuildingAdvancedSearchEngineswithLLamaIndexandGemini_0.png
tag: Tech
originalTitle: "Building Advanced Search Engines with LLamaIndex and Gemini"
link: "https://medium.com/@erkajalkumari/building-advanced-search-engines-with-llamaindex-and-gemini-9593105dc08c"
---


# 소개

리트리버는 RAG(Retrieval Augmented Generation) 파이프라인의 가장 중요한 부분입니다. 이 문서에서는 LlamaIndex를 사용하여 키워드 및 벡터 검색 리트리버를 결합한 사용자 정의 리트리버를 구현할 것입니다. Gemini LLM을 사용한 다중 문서 채팅은 우리가 이 RAG 파이프라인을 구축할 프로젝트 사례입니다. 프로젝트를 시작하기 전에 우리는 이러한 애플리케이션을 구축하기 위해 서비스 및 스토리지 콘텍스트와 같은 몇 가지 중요한 구성 요소를 먼저 이해할 것입니다.

## 학습 목표

- RAG 파이프라인에 대한 통찰력을 얻고, 리트리버와 제너레이터 구성 요소의 역할을 이해하여 맥락적으로 응답을 생성하는 방법을 알아봅니다.
- 키워드 및 벡터 검색 기술을 통합하여 검색 정확도를 향상시키는 사용자 정의 리트리버 개발법을 배웁니다.
- LlamaIndex를 활용하여 데이터 삽입을 수행하고, LLM에 맥락을 제공하며, 사용자 지정 데이터와의 연결을 깊이 있게 이해하는 능력을 습득합니다.
- LLM 응답에서 발생할 수 있는 환각 현상을 완화하는 데 사용자 정의 리트리버의 중요성을 이해합니다.
- 문서의 관련성을 향상시키기 위해 다시 순위 지정 및 HyDE와 같은 고급 리트리버 구현을 탐색합니다.
- Gemini LLM 및 LlamaIndex 내에서 임베딩을 통합하여 응답 생성 및 데이터 저장을 개선하여 RAG 기능을 향상합니다.
- 맞춤형 리트리버 설정에 대한 의사 결정 능력을 발전시켜 검색 결과 최적화를 위해 AND 및 OR 연산 중 선택하는 방법을 배웁니다.

<div class="content-ad"></div>

# LlamaIndex이 무엇인가요?

대규모 언어 모델 분야는 매일 크게 발전하고 있습니다. 많은 모델이 빠르게 출시되고 있기 때문에 이러한 모델을 사용자 정의 데이터와 통합할 필요성이 점점 커지고 있습니다. 이러한 통합은 기업, 기업, 그리고 최종 사용자에게 더 많은 유연성과 데이터와의 깊은 연결성을 제공합니다.

초기에 GPT-index로 알려져 있었던 LlamaIndex는 LLM 애플리케이션을 위해 설계된 데이터 프레임워크입니다. ChatGPT와 같은 사용자 지정 데이터 기반 챗봇을 만드는 인기가 계속해서 증가함에 따라 LlamaIndex와 같은 프레임워크는 점점 가치가 있는 존재가 되고 있습니다. 핵심적으로, LlamaIndex는 다양한 데이터 커넥터를 제공하여 데이터 수집을 용이하게합니다. 이 글에서는 우리가 데이터를 LLM에 context로 전달하는 방법을 알아볼 것이며, 이 개념이 의미하는 것이 Retrieval Augmented Generation, 줄여서 RAG입니다.

# RAG가 무엇인가요?

<div class="content-ad"></div>

RAG(축약어인 Retrieval Augmented Generation)에는 Retriever와 Generator 두 가지 주요 구성 요소가 있습니다.

- Retriever는 벡터 데이터베이스일 수 있으며, 사용자 쿼리에 관련 문서를 검색한 후 이를 문맥으로 사용자에게 전달하는 역할을 합니다.
- Generator 모델은 대형 언어 모델로, 검색된 문서와 프롬프트를 함께 사용하여 문맥으로부터 의미 있는 응답을 생성하는 역할을 합니다.

이 방식으로 RAG는 Automated Few shot prompting을 통한 문맥 학습에 대한 최적의 솔루션입니다.

# Retriever의 중요성

<div class="content-ad"></div>


![Retriever Component](/assets/img/2024-06-19-BuildingAdvancedSearchEngineswithLLamaIndexandGemini_0.png)

RAG 파이프라인에서 Retriever 구성 요소의 중요성을 이해해봅시다.

사용자 정의 검색기를 개발할 때, 우리의 Bed을 가장 잘 수행하는 검색기 유형을 결정하는 것이 중요합니다. 우리의 목적에 따라 우리는 Keyword Search와 Vector Search를 통합한 Hybrid Search를 구현할 것입니다.

Vector Search는 유사성 또는 의미 검색을 기반으로 사용자 쿼리에 대한 관련 문서를 식별하며, Keyword Search는 용어 발생 빈도에 기반하여 문서를 찾습니다. 이 통합은 LlamaIndex를 사용하여 두 가지 방법으로 달성할 수 있습니다. Hybrid Search의 사용자 정의 검색기를 구축할 때, 중요한 결정 사항은 AND 또는 OR 연산자 중 어느 것을 사용할지 선택하는 것입니다:


<div class="content-ad"></div>

- AND 연산: 이 방법은 모든 지정된 용어를 포함하는 문서를 검색하여 더 제한적이지만 높은 관련성을 보장합니다. 이를 키워드 검색과 벡터 검색 결과 간의 교집합으로 생각할 수 있습니다.

- OR 연산: 이 방법은 지정된 용어 중 어떤 것이라도 포함하는 문서를 검색하며 결과의 폭을 늘릴 수 있지만 관련성을 줄일 수 있습니다. 이를 키워드 검색과 벡터 검색 결과 간의 합집합으로 생각할 수 있습니다.

# LLamaIndex를 사용한 사용자 지정 검색기 만들기

이제 LLamaIndex를 사용하여 사용자 지정 검색기를 만들어 보겠습니다. 이를 위해 특정 단계를 따라야 합니다.

# 단계 1: 설치

<div class="content-ad"></div>

Google Colab이나 Jupyter Notebook에서 코드 구현을 시작하려면 주로 필요한 라이브러리를 설치해야 합니다. 이 경우에는 사용자 지정 검색기 생성을 위해 LlamaIndex, 임베딩 모델 및 LLM 추론을 위한 Gemini, 데이터 커넥터로 PyPDF를 사용할 것입니다.

```js
!pip install llama-index
!pip install llama-index-multi-modal-llms-gemini
!pip install llama-index-embeddings-gemini
```

# 단계 2: Google API 키 설정

이 프로젝트에서는 Google Gemini를 사용하여 대규모 언어 모델로 응답을 생성하고, LlamaIndex를 사용하여 데이터를 벡터-DB나 메모리 저장 공간에 변환 및 저장하는 임베딩 모델로 사용할 것입니다.

<div class="content-ad"></div>

여기서 API 키를 얻으세요.

```js
from getpass import getpass
```

```js
GOOGLE_API_KEY = getpass("Google API 키를 입력하세요:")
```

# 단계 3: 데이터 로드 및 문서 노드 생성

<div class="content-ad"></div>

LlamaIndex에서는 SimpleDirectoryLoader를 사용하여 데이터를 로드합니다. 먼저 폴더를 만들고 이 데이터 폴더에 데이터를 어떤 형식으로든 업로드해야 합니다. 저희 예시에서는 PDF 파일을 데이터 폴더에 업로드할 것입니다. 문서가 로드된 후, 문서를 더 작은 세그먼트로 분할하기 위해 노드로 파싱됩니다. 노드는 LlamaIndex 프레임워크 내에서 정의된 데이터 스키마입니다.

LlamaIndex의 최신 버전은 코드 구조를 업데이트했는데요, 이제 노드 파서, 임베딩 모델 및 Settings 내의 LLM에 대한 정의가 포함되어 있습니다.

```js
from llama_index.core import SimpleDirectoryReader
from llama_index.core import Settings
```

```js
documents = SimpleDirectoryReader('data').load_data()
nodes = Settings.node_parser.get_nodes_from_documents(documents)
```

<div class="content-ad"></div>

# 단계 4: 임베딩 모델 및 큰 언어 모델 설정하기

젬니(Gemini)는 gemini-pro, gemini-1.0-pro, gemini-1.5, 비전 모델 등 다양한 모델을 지원합니다. 이 경우에는 기본 모델을 사용하고 Google API 키를 제공할 것입니다. Gemini의 임베딩 모델로는 현재 embedding-001을 사용하고 있습니다. 유효한 API 키가 추가되었는지 확인하세요.

```js
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.llms.gemini import Gemini
```

```js
Settings.embed_model = GeminiEmbedding(
    model_name="models/embedding-001", api_key=GOOGLE_API_KEY
)
Settings.llm = Gemini(api_key=GOOGLE_API_KEY)
```

<div class="content-ad"></div>

# 단계5: 저장 문맥 정의 및 데이터 저장

데이터가 노드로 구문 분석되면 LlamaIndex는 저장 문맥을 제공하여 데이터의 벡터 임베딩을 저장하는 기본 문서 저장소를 제공합니다. 이 저장 문맥은 데이터를 메모리에 유지하여 나중에 색인화할 수 있습니다.

```js
from llama_index.core import StorageContext
```

```js
storage_context = StorageContext.from_defaults()
storage_context.docstore.add_documents(nodes)
```

<div class="content-ad"></div>

인덱스-키워드 및 인덱스 생성

![이미지](/assets/img/2024-06-19-BuildingAdvancedSearchEngineswithLLamaIndexandGemini_1.png)

하이브리드 검색을 수행하는 사용자 지정 검색기를 구축하려면 두 가지 인덱스를 생성해야 합니다. 벡터 검색을 수행할 수 있는 첫 번째 벡터 인덱스와 키워드 검색을 수행할 수 있는 두 번째 키워드 인덱스입니다. 인덱스를 생성하려면 저장 컨텍스트와 노드 문서뿐만 아니라 임베딩 모델과 LLM의 기본 설정도 필요합니다.

```js
from llama_index.core import SimpleKeywordTableIndex, VectorStoreIndex
```

<div class="content-ad"></div>

```js
vector_index = VectorStoreIndex(nodes, storage_context=storage_context)
keyword_index = SimpleKeywordTableIndex(nodes, storage_context=storage_context)
```

# 단계6: 사용자 지정 검색기 만들기

LlamaIndex를 사용하여 하이브리드 검색을 위한 사용자 지정 검색기를 만들기 위해 먼저 스키마를 정의해야 합니다. 이는 노드를 적절하게 구성함으로써 수행됩니다. 검색기에는 벡터 인덱스 검색기와 키워드 검색기 모두가 필요합니다. 이를 통해 하이브리드 검색을 수행하고 결과를 결합하여 혼돈을 최소화할 수 있습니다. 게다가 우리는 결과를 결합할 때 사용할 모드(AND 또는 OR)를 지정해야 합니다.

노드가 구성되면 각 노드 ID에 대해 번들을 조회하고 벡터 및 키워드 검색기를 사용합니다. 선택한 모드에 따라 사용자 지정 검색기를 정의하고 완성합니다.


<div class="content-ad"></div>

```js
from llama_index.core import QueryBundle
from llama_index.core.schema import NodeWithScore
```

```js
from llama_index.core.retrievers import (
    BaseRetriever,
    VectorIndexRetriever,
    KeywordTableSimpleRetriever,
)
from typing import List

class CustomRetriever(BaseRetriever):
    def __init__(
        self,
        vector_retriever: VectorIndexRetriever,
        keyword_retriever: KeywordTableSimpleRetriever,
        mode: str = "AND") -> None:
       
        self._vector_retriever = vector_retriever
        self._keyword_retriever = keyword_retriever
        if mode not in ("AND", "OR"):
            raise ValueError("Invalid mode.")
        self._mode = mode
        super().__init__()
    def _retrieve(self, query_bundle: QueryBundle) -> List[NodeWithScore]:
        vector_nodes = self._vector_retriever.retrieve(query_bundle)
        keyword_nodes = self._keyword_retriever.retrieve(query_bundle)
        vector_ids = {n.node.node_id for n in vector_nodes}
        keyword_ids = {n.node.node_id for n in keyword_nodes}
        combined_dict = {n.node.node_id: n for n in vector_nodes}
        combined_dict.update({n.node.node_id: n for n in keyword_nodes})
        if self._mode == "AND":
            retrieve_ids = vector_ids.intersection(keyword_ids)
        else:
            retrieve_ids = vector_ids.union(keyword_ids)
        retrieve_nodes = [combined_dict[r_id] for r_id in retrieve_ids]
        return retrieve_nodes
```

# Step7: Define Retrievers

이제 사용자 정의 검색기 클래스가 정의되었으므로, 검색기를 인스턴스화하고 쿼리 엔진을 합성해야 합니다. 응답 씨네사이저는 사용자 쿼리와 주어진 텍스트 청크 세트를 기반으로 LLM에서 응답을 생성하는 데 사용됩니다. 응답 씨네사이저에서 출력은 응답 객체이며, 이 객체는 사용자 정의 검색기를 하나의 매개 변수로 취합니다.

<div class="content-ad"></div>

```js
from llama_index.core import get_response_synthesizer
from llama_index.core.query_engine import RetrieverQueryEngine
```

```js
vector_retriever = VectorIndexRetriever(index=vector_index, similarity_top_k=2)
keyword_retriever = KeywordTableSimpleRetriever(index=keyword_index)
# custom retriever => combine vector and keyword retriever
custom_retriever = CustomRetriever(vector_retriever, keyword_retriever)
# define response synthesizer
response_synthesizer = get_response_synthesizer()
custom_query_engine = RetrieverQueryEngine(
    retriever=custom_retriever,
    response_synthesizer=response_synthesizer,
)
```

# Step8: Run Custom Retriever Query Engine

마침내, 현저하게 환각을 줄이는 사용자 정의 검색기를 개발했습니다. 그 효과를 테스트하기 위해, 우리는 컨텍스트 내부와 외부에서 한 가지 프롬프트를 포함한 사용자 쿼리를 실행하고 생성된 답변을 평가했습니다.

<div class="content-ad"></div>

```js
query = "데이터 컨텍스트에는 무엇이 포함되어 있나요?"
print(custom_query_engine.query(query))
print(custom_query_engine.query("과학이란 무엇인가요?")
```

![이미지](/assets/img/2024-06-19-BuildingAdvancedSearchEngineswithLLamaIndexandGemini_2.png)

# 결론

우리는 LlamaIndex를 사용하여 벡터와 키워드 검색기를 결합하여 Gemini LLM 및 임베딩의 지원을 받아 하이브리드 검색을 수행하는 맞춤형 리트리버를 성공적으로 구현했습니다. 이 접근은 전형적인 RAG 파이프라인에서 LLM 환각을 어느 정도 감소시킴으로써 효과적입니다.

<div class="content-ad"></div>

## 중요 사항

- 벡터 및 키워드 리트리버를 통합한 사용자 지정 리트리버 개발으로 RAG의 관련 문서 식별 능력과 정확성을 향상시킴.
- LlamaIndex 설정을 사용하여 Gemini Embedding 및 LLM을 구현하였으며, 최신 버전에서는 이전에 사용되던 Service Context보다 나은 것으로 대체되었음.
- 사용자 지정 리트리버 구축 시 AND 또는 OR 연산을 사용할 것인지 결정하는 것이 중요하며, 특정 요구 사항에 따라 키워드 및 벡터 검색 결과의 교집합과 합집합을 균형 있게 조정해야 함.
- 사용자 지정 리트리버 설정은 RAG 파이프라인 내에서 하이브리드 검색 메커니즘을 사용하여 대형 언어 모델 응답에서 환각을 크게 줄여줌.

# 나에 대해

LinkedIn 프로필이 이곳에 있어요. 연결하고 싶으시면 클릭해주세요. 제 글을 즐겁게 읽어주셨으면 좋겠어요. 마음에 드셨다면 친구들과 공유하고 저를 팔로우해주세요. 제 글 작성을 개선할 수 있는 생각이 있다면 자유롭게 의견을 남겨주세요.
제 이전 게시된 모든 글은 여기에서 읽을 수 있어요. [https://aivichar.com/]