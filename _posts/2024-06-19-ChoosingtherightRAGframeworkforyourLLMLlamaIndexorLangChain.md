---
title: "당신의 LLM에 맞는 적절한 RAG 프레임워크 선택 LlamaIndex 또는 LangChain"
description: ""
coverImage: "/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_0.png"
date: 2024-06-19 19:45
ogImage: 
  url: /assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_0.png
tag: Tech
originalTitle: "Choosing the right RAG framework for your LLM: LlamaIndex or LangChain"
link: "https://medium.com/generative-ai/choosing-the-right-rag-framework-for-your-llm-llamaindex-or-langchain-a89b9ffd7e41"
---


이미지(`<img>`) 태그를 Markdown 형식으로 변경하겠습니다.


![Choosing the right RAG framework for your LLMLlamaIndex or LangChain](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_0.png)


큰 언어 모델(Large Language Models, LLMs)은 현대의 주요 인공지능 기술 중 하나입니다. 2022년 11월에 OpenAI가 자체 생성 신생대화봇(Generative AI chatbot)을 공개하면서, 이런 첨단 기술들의 응용 가능성에 대한 사람들의 관심이 커졌습니다. ChatGPT의 놀라운 기능을 보고 나서 기업, 개발자, 개인들이 자신만의 맞춤형 ChatGPT 버전을 원했습니다. 이것이 Gen AI 모델 개발, 통합, 관리를 용이하게 하는 도구/프레임워크에 대한 수요 급증을 야기했습니다.

시장에는 이런 수요를 채우는 두 주요 프레임워크가 있습니다: LlamaIndex와 LangChain. 하지만, 이 두 프레임워크의 목표는 개발자가 자신만의 맞춤형 LLM 응용프로그램을 만드는 데 도움을 주는 것입니다. 이들 프레임워크 각각은 고유의 장단점을 갖고 있습니다. 본 블로그 포스트의 목적은 LlamaIndex와 LangChain 사이의 주요 차이점을 드러내어 당신이 특정 용례에 맞는 적절한 프레임워크를 선택하는 데 도움을 주는 것입니다.

# LlamaIndex 소개


<div class="content-ad"></div>


![LlamaIndex](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_1.png)

LlamaIndex는 사용자 정의 데이터를 기반으로 한 LLM(Llama Language Model)을 색인하고 쿼리하는 프레임워크입니다. 구조화된 데이터(관계형 데이터베이스), 비구조화된 데이터(NoSQL 데이터베이스) 및 반구조화된 데이터(세일즈포스 CRM 데이터)와 같은 다양한 소스를 통해 데이터 연결을 가능케 합니다.

데이터가 소유권이라고 할지라도, 최신 LLM의 이해 가능한 임베딩(embedding)으로 대규모로 색인화할 수 있습니다. 따라서 모델을 다시 교육할 필요가 사라집니다.

# LlamaIndex 작동 방식은?


<div class="content-ad"></div>

![RAG Framework](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_2.png)

라마 인덱스는 LLM의 고급 맞춤화를 용이하게 합니다. 소유권 데이터를 활용하여 모델이 문맥 기반 응답을 점차적으로 개선할 수 있도록 메모리에 내장합니다. 라마 인덱스는 대규모 언어 모델을 도메인 지식 전문가로 전환시킵니다. 이는 AI 어시스턴트로 작동하거나 소유한 진실의 소스(예: 영업 부문에 특화된 비즈니스 정보가 포함된 PDF 문서)를 기반으로 쿼리에 응답하는 대화형 챗봇 역할을 수행할 수 있습니다.

소유권 데이터에 기반한 LLM 맞춤화를 위해, 라마 인덱스는 검색 증가 생성(RAG) 기술을 사용합니다. RAG는 주로 두 가지 주요 단계로 구성됩니다.
- 인덱싱 단계: 소유권 데이터가 효과적으로 벡터 인덱스로 변환됩니다. 이때 데이터는 벡터 임베딩이나 의미적 의미가 부여된 숫자 표현으로 변환됩니다.
- 쿼리 단계: 시스템이 쿼리를 받을 때, 가장 높은 의미 유사성을 가진 쿼리가 정보 청크 형태로 반환됩니다. 이 정보 청크는 LLM으로 보내져 최종 응답을 얻기 위해 원본 프롬프트 쿼리와 함께 전송됩니다. 이 메커니즘을 통해 RAG는 LLM의 기본 지식만으로는 불가능한 매우 정확하고 관련성 높은 출력을 생성하는 데 사용할 수 있습니다.

<div class="content-ad"></div>

# 라마지수 사용 시작하기

우선, 시작하기 위해 라마-인덱스를 설치해보세요:

```js
pip install llama-index 
```

오픈AI의 LLM을 사용하기 위해서는 오픈AI API 키가 필요합니다. 비밀 키를 받으셨다면 .env 파일에 다음과 같이 설정해야 합니다:

<div class="content-ad"></div>

```js
import os
os.environ["OPENAI_API_KEY"] = "your_api_key_here"
```

여기서부터 LlamaIndex로 빌딩을 시작할 수 있어요! 더 많은 예제, 안내 및 사용 사례를 보려면 LlamaIndex 문서를 참조해주세요.

에이전트, 지수, 쿼리 엔진 및 데이터셋과 같은 더 많은 리소스를 탐색하려면 Llama 인덱스 개발자를 위한 커뮤니티 공유 리소스/구성 요소에 액세스하기 위해 Llama 허브로 이동해주세요.

# 🦙LlamaIndex로 QnA 애플리케이션 개발하기


<div class="content-ad"></div>

라마인덱스의 기능을 실시간으로 보여주기 위해, 사용자 정의 문서에 기반한 쿼리에 답변을 할 수 있는 QnA 애플리케이션을 개발하는 코드 워크스루를 진행하겠습니다.

먼저, 필요한 모든 종속 항목을 설치하는 과정부터 시작해보겠습니다:

```js
pip install llama-index openai nltk
```

다음으로, LlamaIndex의 SimpleDirectoryReader 함수를 사용하여 문서를 로드하고 인덱스를 구축하는 과정을 시작해봅시다.

<div class="content-ad"></div>

```python
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader
 )

# SDR 함수 내에서 경로를 정의하고 색인을 빌드합니다
documents = SimpleDirectoryReader("docs").load_data()
index = VectorStoreIndex.from_documents(documents, show_progress=True)
```

"docs" 폴더 안에 Python 코스 자격 요건 PDF를 업로드했습니다:

인덱스를 쿼리하고 응답을 확인합니다:

```python
# 쿼리 엔진
query_engine = index.as_query_engine()

response = query_engine.query("과제와 프로젝트를 놓치면 성적과 백분율이 어떻게 될까요?")
print(response)
```

<div class="content-ad"></div>


![Choosing the right RAG framework for your LLMLlamaIndex or LangChain](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_3.png)

검색 엔진은 데이터 인덱스를 검색하여 관련 조각을 가져올 것입니다.

또한 이 질의 엔진을 기억하면서 채팅 엔진으로 변환할 수도 있습니다. 함수를 수정하여 다음과 같이:

```js
chat_engine = index.as_chat_engine()
response = chat_engine.chat("만약 제 숙제와 프로젝트를 놓치면, 어떤 등급과 퍼센티지를 받게 될까요?")
print(response)
follow_up = chat_engine.chat("그리고 프로젝트만 놓친다면, 어떤 등급을 받을까요?")
print(follow_up)
```

<div class="content-ad"></div>

매번 인덱스를 다시 빌드하지 않도록 하려면, 디스크에 저장할 수 있어요:

```js
index.storage_context.persist()
```

그리고 나중에 다시 불러올 수 있어요:

```js
from llama_index.core import (
    StorageContext,
    load_index_from_storage,
)

storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
```

<div class="content-ad"></div>

위에 표시된 코드는 Hugging Face Spaces에 배포된 QnA 챗봇 Gradio 애플리케이션의 일부입니다. 소스 코드와 데이터셋은 여기에서 사용할 수 있습니다.

# LangChain 소개

![이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_4.png)

LangChain은 사용자 지정 데이터 소스를 기반으로 맞춤형 LLMs(언어 생성 모델)를 구축하는 데 사용되는 또 다른 프레임워크입니다. LangChain은 관계형 데이터베이스(예: 테이블 데이터), 비관계형 데이터베이스(예: 문서), 프로그래밍 소스(예: API) 또는 심지어 사용자 정의 지식 베이스와 같은 다양한 소스로부터 데이터를 연결할 수 있습니다.

<div class="content-ad"></div>

LangChain은 단순히 다른 통합 도구들과 함께 LLMs에 전송되는 요청의 연속인 체인을 형성하는 메커니즘을 활용합니다. 각 단계의 출력물이 다음 입력으로 전달되어 체인이 형성됩니다.

LangChain은 귀사의 독점 데이터와 함께 작동하며, 관련 콘텍스트가 LLMs에 제공되어 적절한 응답을 생성합니다. 회사 데이터용 맞춤형 QNA 챗봇, 내부 분석 도구, 또는 귀사 데이터 소스와 함께 작동하는 AI 보조 프로그램이든, LangChain을 통해 다양한 도구를 통합하고 여러 LLM 응용 프로그램을 체인으로 연결하여 더욱 포괄적인 시스템을 구축할 수 있습니다.

# LangChain 작동 방식

![이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_5.png)

<div class="content-ad"></div>

LangChain은 다음과 같은 구성 요소를 가지고 있습니다:

- "Prompts"는 원하는 출력/응답을 얻기 위해 모델에게 제공하는 암시입니다.
- LangChain은 사용자에게 Language 모델을 쉽게 교체할 수 있는 인터페이스를 제공합니다. LangChain은 GPT-4, Gemini 1.5 Pro, Hugging Face LLM, Claude 3와 같은 최신 LLM들과 작업할 수 있도록 해줍니다.
- LangChain은 임베딩, 인메모리 벡터 저장소 등과 같은 색인 기술을 활용합니다.
- LangChain은 다양한 구성 요소를 연결하는 것을 용이하게 합니다.
- LangChain은 사용자가 작업 및 도구를 할당하는 데 도움이 되는 다양한 AI 에이전트를 제공합니다.

# LangChain으로 시작하기

LangChain을 사용하여 빌드를 시작하는 첫 번째 단계는 LangChain 패키지를 설치하는 것입니다.

<div class="content-ad"></div>

```js
pip install langchain
```

LangChain 튜토리얼을 위해 cohere API 키를 사용할 것입니다. .env 파일 내에 API 키를 넣어 cohere 환경 변수를 설정해 주세요:

```js
import os
os.environ["cohere_apikey"] = "여러분의_API_키_여기에_입력"
```

이후에는 LangChain을 활용하여 개발을 시작할 수 있습니다! 더 자세한 예제, 가이드 및 사용 사례는 LangChain 문서를 참조해 주세요.

<div class="content-ad"></div>

LangChain 생태계를 탐험하고 싶다면 Langchain Hub로 이동하여 LLM 작업 흐름에 통합할 수 있는 개발자 커뮤니티와 데이터 커넥터, 도구 및 프레임워크를 찾을 수 있어요.

# 🦜🔗LangChain으로 QnA 애플리케이션 만들기

Langchain의 능력을 실시간으로 시연하기 위해 사용자 정의 문서를 기반으로 질문에 답변할 수 있는 QnA 애플리케이션을 개발하는 코드 워크스루를 진행할 거에요.

첫 번째 단계는 모든 종속성을 설치하는 것이에요:

<div class="content-ad"></div>

```js
pip install langchain cohere chromadb ## openai의 LLM 대신 cohere를 사용하겠습니다.
```

그 후 문서 데이터를로드하고 색인을 생성합니다. 또한 cohere embeddings를 사용하여 임베딩을 생성할 것입니다:

```js
from langchain.document_loaders import OnlinePDFLoader
from langchain.vectorstores import Chroma
from langchain.embeddings import CohereEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

loader = OnlinePDFLoader(document)
documents = loader.load()

# 텍스트 분할기 초기화
text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunksize, chunk_overlap=10,
   separators=[" ", ",", "\n"])

# Cohere 임베딩 초기화
embeddings = CohereEmbeddings(model="large", cohere_api_key=st.secrets["cohere_apikey"])

texts = text_splitter.split_documents(documents)
global db
db = Chroma.from_documents(texts, embeddings)
retriever = db.as_retriever()
global qa
```

색인을 쿼리하고 응답을 확인합니다.

<div class="content-ad"></div>

```js
query = "다른 국가들과 인도 헌법의 세속주의 접근 방식을 비교해보세요?"
result = db.query(query)
print(result)
```

<img src="/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_6.png" />

쿼리는 의미론적으로 데이터를 검색하고 적절한 답변을 검색합니다.

RetrievalQA 모듈을 사용하여 체인을 할 수 있습니다. 여기서는 cohere의 LLM을 사용할 것입니다.

<div class="content-ad"></div>

```js
from langchain.llms import Cohere
from langchain.chains import RetrievalQA

qa = RetrievalQA.from_chain_type(
    llm=Cohere(
        model="command-xlarge-nightly",
        temperature=temp_r,
        cohere_api_key=st.secrets["cohere_apikey"],
    ),
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs=chain_type_kwargs,
)
```

위에 표시된 코드는 QnA Streamlit 애플리케이션의 일부입니다. 소스 코드와 데이터 세트는 여기에서 사용할 수 있습니다.

# 람마인덱스(LlamaIndex) vs 랑체인(LangChain)의 최상의 사용 사례

람마인덱스(LlamaIndex):

<div class="content-ad"></div>

- 특정 지식 베이스를 가진 쿼리 및 검색 기반 정보 검색 시스템 구축.
- 사용자 쿼리에 대답으로 관련 정보 청크만 제공할 수 있는 QnA 챗봇 개발.
- 대규모 문서의 요약, 텍스트 완성, 언어 번역 등

LangChain:

- 엔드 투 엔드 대화형 챗봇 및 AI 에이전트 구축
- LLMs에 사용자 정의 워크플로 통합
- API 및 기타 데이터 소스를 통해 LLMs의 데이터 연결 옵션 확장

Langchain과 LlamaIndex의 결합된 사용 사례: (

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_7.png)

- 전문가 AI 에이전트 구축: LangChain은 여러 데이터 원본을 통합하고 LlamaIndex는 유사 의미 검색 능력으로 빠른 응답을 생성하고 정리할 수 있습니다.
- 고급 R&D 도구: LangChain의 체이닝을 사용하여 도구와 워크플로우를 동기화하고, LlamaIndex를 사용하여 더 맥락을 이해할 수 있는 LLM을 생성하고 가장 관련성 높은 응답을 얻을 수 있습니다.

# LlamaIndex 대 LangChain: 적절한 프레임워크 선택

![이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_8.png)


<div class="content-ad"></div>

여기 중요한 몇 가지 질문이 있습니다. 적절한 프레임워크를 선택하기 전에 다음을 고려해 보세요:

- 프로젝트 요구 사항은 무엇인가요? 기본적으로 인덱스, 쿼리 검색 및 검색 애플리케이션을 위해서는 LlamaIndex를 선택할 수 있습니다. 그러나 사용자 지정 워크플로를 통합해야 하는 애플리케이션의 경우 LangChain이 더 나은 선택일 수 있습니다.
- 사용하기 쉽고 접근하기 쉬운가요? LlamaIndex는 더 간단한 인터페이스를 제공하지만, LangChain은 NLP 개념과 구성 요소에 대한 심층적인 이해가 필요합니다.
- 얼마나 많은 사용자 정의를 원하시나요? LangChain은 쉬운 사용자 정의와 도구 통합을 가능케 하는 모듈식 디자인을 제공합니다. 그러나 LlamaIndex는 주로 검색 및 검색 기반 프레임워크입니다.

![이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_9.png)

# 결론

<div class="content-ad"></div>

LlamaIndex과 LangChain은 사용자 정의 LLM 기반 응용 프로그램을 개발하려는 개발자들에게 매우 유용한 프레임워크입니다. LlamaIndex의 USP는 우수한 검색 및 검색 기능을 제공하여 사용자에게 간소화된 인덱싱 및 쿼리 솔루션을 제공합니다. 반면 LangChain의 USP는 모듈식 설계 및 LLM 영역의 다양한 도구 및 구성 요소와의 통합 가능성에 있습니다.

둘 중에 선택하는 데 고민이 되면 프로젝트 요구 사항이 무엇인지, 사용하기 쉽고 접근성이 어떤지, 얼마나 많은 사용자 정의를 원하는지와 같은 질문을 스스로에게 한 번 던져 보세요.

LangChain은 보다 넓은 프레임워크 내에서 여러 도구를 사용하고 싶다면 최적입니다. 예를 들어, 다중 작업이 가능한 AI 기반 지능형 에이전트와 같은 경우입니다.

그러나 만약 스마트 검색 및 검색 시스템을 구축하는 게 목표라면, LlamaIndex를 선택해보세요. LlamaIndex의 강점은 정보의 색인 및 검색에 있어서, LLM을 위한 깊은 데이터 탐색기 앱을 구축하는 것이 가능해집니다.

<div class="content-ad"></div>


Finally remember that it’s not a classic case of either or, in the real world, you can implement a system whose architecture may contain both the frameworks, each playing their own unique roles.

# FAQs

Q1: How do LlamaIndex and LangChain differ in their primary focus?

A1: LangChain’s main focus is the development & deployment of LLMs, along with the customization of LLMs using fine-tuning methods. However, LlamaIndex aims to provide an end-to-end ML workflow, along with data management & model evaluation.


<div class="content-ad"></div>

Q2: 기계 학습 초보자에게 더 나은 플랫폼은 무엇인가요?

A2: LlamaIndex가 구현이 간단하고 직관적이기 때문에 초보자에게 더 선호됩니다. 반면에 LangChain은 LLM 및 NLP 개념에 대해 더 심층적인 이해가 필요합니다.

Q3: LlamaIndex와 LangChain을 함께 사용할 수 있나요?

A3: 네, 두 플랫폼의 강점을 결합하여 사용 사례에 대한 솔루션을 개발하는 것이 가능합니다. LlamaIndex는 데이터 전처리 및 초기 모델 훈련 단계를 담당하고, LangChain은 LLM의 세밀한 조정, 도구 통합, 및 배포를 용이하게 해 줄 수 있습니다.

<div class="content-ad"></div>

Q4: 내 맞춤형 LLM 애플리케이션에 사용할 프레임워크는 무엇이 좋을까요?

A4: LangChain은 자연어 처리 작업 및 외부 데이터와의 복잡한 상호작용에 의존하는 사용 사례에 유리하며, 텍스트 요약, 감성 분석, 대화형 AI 봇 등과 같이 고급 언어 모델 기능이 필요한 애플리케이션에 적합합니다. 반면, LlamaIndex는 외부 데이터와의 일반 상호작용이 필요한 작업에 더 유리합니다(빠른 데이터 조회 및 검색과 같은 질의 응답 챗봇).

Q5: LlamaIndex 또는 LangChain 사용 시 제한 사항이 있나요?

A5: LlamaIndex는 고도로 전문화된 NLP 작업에는 적합하지 않습니다. 반면, LangChain은 고급 언어 모델 기능이 실제로 필요하지 않은 기계 학습 워크플로우를 해결하는 데 과도할 수 있습니다.

<div class="content-ad"></div>

# 자원

- kyrolabs/awesome-langchain: 😎 멋진 LangChain 프레임워크 관련 도구 및 프로젝트의 멋진 목록 (github.com)
- LLamaIndex와 함께하는 멋진 프로젝트들 (github.com)
- [LangChain과 LLamaIndex의 4가지 작업 비교하기](https://lmy.medium.com/comparing-langchain-and-llamaindex-with-4-tasks-2970140edf33)
- Langchain 플레이리스트
- LLamaIndex 플레이리스트

![이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_10.png)

이 이야기는 Generative AI에 게시되었습니다. LinkedIn에서 저희와 연락하고 최신 AI 이야기를 받아보려면 Zeniteq를 팔로우하세요.

<div class="content-ad"></div>

최신 generative AI 뉴스 및 업데이트를 받아보려면 저희 뉴스레터를 구독해주세요. 함께 AI의 미래를 함께 만들어요!

![참조 이미지](/assets/img/2024-06-19-ChoosingtherightRAGframeworkforyourLLMLlamaIndexorLangChain_11.png)