---
title: "언어 에이전트 트리 검색 - LATS"
description: ""
coverImage: "/assets/img/2024-06-20-LanguageAgentTreeSearchLATS_0.png"
date: 2024-06-20 19:02
ogImage: 
  url: /assets/img/2024-06-20-LanguageAgentTreeSearchLATS_0.png
tag: Tech
originalTitle: "Language Agent Tree Search — LATS"
link: "https://medium.com/@cobusgreyling/language-agent-tree-search-lats-837de73d0672"
---


# 소개

얼마 전부터 LLMs를 복잡하고 상세하며 맥락을 이해하는 구현에 독립적으로 사용할 수 없다는 것이 알려졌습니다.

LLMs는 외부 도구로 더 많은 기능을 제공받아야 하며, 주체적인 프레임워크의 기반을 형성해야 합니다. 외부 도구와 의미적 피드백을 활용함으로써 이를 달성할 수 있습니다.

외부 도구에는 웹 검색, 특정 API 접근, 문서 검색 등과 같은 기능이 포함될 수 있습니다.

<div class="content-ad"></div>

연구에 의하면 대부분의 대화형 UI는 인간 수준의 신중하고 사려 깊은 의사 결정에 부족함을 자주 겪습니다. 게다가 이러한 방법들 중 많은 방법들은 여러 추론 경로를 고려하거나 앞선 계획을 실패하는 면에서 부족합니다.

이러한 방법들은 종종 외부 피드백의 통합을 잊고 독립적으로 운영되며, 이는 추론을 개선할 수 있는 외부 피드백이 누락되었음을 의미합니다.

# 실용적인 작업 예시

LATS와 같은 프레임워크는 처음에는 알아보기 어려울 수 있지만, 이 기사에서 나중에 이 프레임워크의 LlamaIndex 구현을 하나씩 살펴볼 것입니다. 이를 통해 실제로 동작 중인 프레임워크를 보면 프레임워크의 신비로움을 제거하는 데 큰 도움이 됩니다.

<div class="content-ad"></div>

# LATS로 돌아가기

## 초기 고려 사항

- 이 프레임워크는 인간 대화의 기본 구성 요소를 포함합니다. 이는 기억, 맥락적 의식, 검색에 기반한 인간과 유사한 사고 과정을 따르는 것을 의미합니다.
- LlamaIndex의 LATS 에이전트 구현은 각 노드 아래 탐색해야 하는 가능한 하위 작업 수와 검색의 얼마나 깊이 진행되어야 하는지를 설정해야 함을 보여줍니다.
- 이러한 에이전트를 고려할 때 항상 대기 시간이 생각나며 LLM 백본 실행 비용도 고려되어야 합니다. 그러나 이러한 도전에 대한 해결책이 있습니다.
- 비용은 앞서 언급한 대로 제한될 수 있으며, LLM에 대한 예산을 설정하는 것이 도움이되며, 결정적인 답변이 없이 예산이 소진된 경우 대화와 맥락을 인간에게 전달할 수 있습니다.
- LATS 에이전트는 샘플 작업을 기반으로 최적의 궤적을 찾아내며 반사적 프롬프팅 방법보다 문제 해결에 더 유연하고 적응력이 뛰어납니다.
- 외부 피드백과 자기 반성을 통합함으로써 LATS는 모델 감성을 향상시키고 에이전트가 경험으로부터 배울 수 있도록 하여 추론 기반 검색 방법을 능가합니다.
- LlamaIndex를 고려해 보면, 자율 에이전트와 LlamaIndex가 Agentic RAG로 지칭하는 RAG의 조합은 모범 사례의 자연스러운 결합이다.
- 에이전트가 흡수하는 문서는 훌륭한 맥락적 참조가 되며 에이전트를 사용 도메인 특정으로 만듭니다.
- 한 기관에서 내부에서 사용되는 봇으로 이 에이전트가 사용된다면 어떨까요? 복잡하고 종종 대담한 질문에 대답하는 직원을 돕습니다.

# 실용적인 LATS 구현

<div class="content-ad"></div>

## LlamaIndex 구현

전체 LlamaIndex 노트북은 여기에서 찾을 수 있습니다.

노트북은 초기 설정으로 시작합니다:

```js
%pip install llama-index-agent-lats
%pip install llama-index-program-openai
%pip install llama-index-llms-openai
%pip install llama-index-embeddings-openai
%pip install llama-index-core llama-index-readers-file
```

<div class="content-ad"></div>

오픈AI API 키를 정의하세요:

```js
import os

os.environ["OPENAI_API_KEY"] = "<여기에 API 키를 넣으세요>"

import nest_asyncio

nest_asyncio.apply()
```

그런 다음 LLM 및 임베딩 모델을 정의하세요:

```js
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings

# 참고: 더 높은 온도는 트리 확장을 더 다양하게 만들 수 있습니다
llm = OpenAI(model="gpt-4-turbo", temperature=0.6)
embed_model = OpenAIEmbedding(model="text-embedding-3-small")

Settings.llm = llm
Settings.embed_model = embed_model
```

<div class="content-ad"></div>

아래의 표를 Markdown 형식으로 변경하세요:


Download the relevant data:

```js
!mkdir -p 'data/10k/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/10k/uber_2021.pdf' -O 'data/10k/uber_2021.pdf'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/10k/lyft_2021.pdf' -O 'data/10k/lyft_2021.pdf'
```

Index the documents:

```js
import os
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    load_index_from_storage,
)
from llama_index.core.storage import StorageContext


if not os.path.exists("./storage/lyft"):
    # load data
    lyft_docs = SimpleDirectoryReader(
        input_files=["./data/10k/lyft_2021.pdf"]
    ).load_data()
    uber_docs = SimpleDirectoryReader(
        input_files=["./data/10k/uber_2021.pdf"]
    ).load_data()

    # build index
    lyft_index = VectorStoreIndex.from_documents(lyft_docs)
    uber_index = VectorStoreIndex.from_documents(uber_docs)

    # persist index
    lyft_index.storage_context.persist(persist_dir="./storage/lyft")
    uber_index.storage_context.persist(persist_dir="./storage/uber")
else:
    storage_context = StorageContext.from_defaults(
        persist_dir="./storage/lyft"
    )
    lyft_index = load_index_from_storage(storage_context)

    storage_context = StorageContext.from_defaults(
        persist_dir="./storage/uber"
    )
    uber_index = load_index_from_storage(storage_context)
```

<div class="content-ad"></div>

다음 두 개의 도구 또는 엔진을 설정하십시오:

```js
lyft_engine = lyft_index.as_query_engine(similarity_top_k=3)
uber_engine = uber_index.as_query_engine(similarity_top_k=3)
```

전형적인 에이전트 스타일로, 두 에이전트 도구에는 설명이 제공됩니다. 이 설명은 에이전트가 도구를 언제, 어떻게 사용해야 하는지 결정하는 데 중요합니다.

물론 에이전트는 여러 도구에 액세스할 수 있으며, 에이전트가 보유한 도구가 많을수록 에이전트가 강력해집니다.

<div class="content-ad"></div>

```js
from llama_index.core.tools import QueryEngineTool, ToolMetadata

query_engine_tools = [
    QueryEngineTool(
        query_engine=lyft_engine,
        metadata=ToolMetadata(
            name="lyft_10k",
            description=(
                "2021년도 Lyft 재무에 관한 정보를 제공합니다. "
                "도구에 자세한 일반 텍스트 질문을 입력으로 사용하세요. "
                "입력은 의미 검색 엔진을 구동하는 데 사용됩니다."
            ),
        ),
    ),
    QueryEngineTool(
        query_engine=uber_engine,
        metadata=ToolMetadata(
            name="uber_10k",
            description=(
                "2021년도 Uber 재무에 관한 정보를 제공합니다. "
                "도구에 자세한 일반 텍스트 질문을 입력으로 사용하세요. "
                "입력은 의미 검색 엔진을 구동하는 데 사용됩니다."
            ),
        ),
    ),
]
```

이것이 LATS 에이전트의 설정입니다...

이것은 에이전트의 예산이 정의된 곳입니다...

- num_expansions는 각 노드 아래에서 탐색할 가능한 하위 동작 수를 나타냅니다.
- num_expansions=2는 각 부모 동작에 대해 가능한 다음 동작을 탐색할 것을 의미합니다.
- max_rollouts는 탐색 공간의 각 탐사가 얼마나 깊게 이어지는지를 나타냅니다.
- max_rollouts=5는 트리에서 최대 깊이 5까지 탐사됨을 의미합니다.

<div class="content-ad"></div>

할 수 있습니다. LLM과 도구에 대한 참조도 볼 수 있어요.

```js
from llama_index.agent.lats import LATSAgentWorker

agent_worker = LATSAgentWorker.from_tools(
    query_engine_tools,
    llm=llm,
    num_expansions=2,
    max_rollouts=3,  # rollouts를 무제한으로 사용하려면 -1 입력
    verbose=True,
)
agent = agent.as_worker()
```

아래의 질문은 에이전트에게 제시됩니다. 질문이 얼마나 모호하고 다양한 조건과 뉘앙스를 가지고 있는지 주목하세요.

```js
task = agent.create_task(
    "Uber와 Lyft의 10K 파일에서 설명된 위험 요인을 고려할 때, "
    "어떤 회사가 더 나은 성과를 거두고 있는지? 구체적인 숫자를 사용하여 판단해주세요."
)
```

<div class="content-ad"></div>

LlamaIndex의 노트북은 여러 가지 다양한 순열을 거칩니다...

⭐️ 대형 언어 모델 업데이트를 위해 LinkedIn에서 팔로우하세요 ⭐️

![이미지](/assets/img/2024-06-20-LanguageAgentTreeSearchLATS_0.png)

저는 현재 Kore AI의 최고 전도사입니다. 인공 지능과 언어가 교차하는 모든 것에 대해 탐구하고 쓰고 있습니다. 대형 언어 모델(LLMs), 챗봇, 음성봇, 개발 프레임워크, 데이터 중심의 잠재 공간 등을 다루고 있습니다.

<div class="content-ad"></div>


![Language Agent Tree Search - Image 1](/assets/img/2024-06-20-LanguageAgentTreeSearchLATS_1.png)

![Language Agent Tree Search - Image 2](/assets/img/2024-06-20-LanguageAgentTreeSearchLATS_2.png)

![Language Agent Tree Search - Image 3](/assets/img/2024-06-20-LanguageAgentTreeSearchLATS_3.png)

[Click here for more information](https://llamahub.ai/l/agent/llama-index-agent-lats?from=agent)
