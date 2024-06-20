---
title: "문서챗 데이터를 손쉽게 탐색하고 이해하는 데 도움이 되는 방법  파트 1"
description: ""
coverImage: "/assets/img/2024-06-19-DocuChatEmpoweringYoutoExploreandUnderstandYourDataEffortlesslyPart-1_0.png"
date: 2024-06-19 19:14
ogImage: 
  url: /assets/img/2024-06-19-DocuChatEmpoweringYoutoExploreandUnderstandYourDataEffortlesslyPart-1_0.png
tag: Tech
originalTitle: "DocuChat: Empowering You to Explore and Understand Your Data Effortlessly : Part-1"
link: "https://medium.com/@chinvar/docuchat-empowering-you-to-explore-and-understand-your-data-effortlessly-part-1-bfd88f5e47d2"
---


# 소개:

대형 언어 모델(LLMs)의 가장 혁신적인 사용 사례 중 하나는 정교한 질의응답(Q&A) 챗봇을 개발하는 데 있습니다. 이러한 지능적인 시스템은 "검색 증강 생성"이라는 기술 덕분에 특정 데이터셋을 이용하여 질문에 대답하고 해석할 수 있습니다.

본 기사는 기업용 챗봇을 구축하는 시리즈의 일환입니다. 우리는 기초적인 개념부터 시작하여 점차적으로 더 복잡한 주제로 나아갈 것입니다. 이 시리즈를 통해 다음과 같은 내용을 배우게 될 것입니다:

- 메모리 인식 챗봇 구축을 위한 기초적인 개념: RAG, LangChain, LlamaIndex 등의 기초 개념부터 시작하여 챗봇이 맥락을 유지하고 일관된 장기적 상호작용을 제공할 수 있도록 합니다.
- 고급 데이터 전처리 및 멀티모달 검색: 이미지나 테이블이 포함된 문서를 처리하여 챗봇이 이러한 데이터를 효과적으로 해석하고 활용할 수 있도록 합니다.
- 기업용 데이터 수집: 기업 환경에 맞게 데이터 수집, 저장 및 조정을 위한 강력한 전략입니다.
- 에이전트 전략: 기존 RAG 파이프라인 상에 에이전트를 구축하여 자동화된 의사결정 능력을 부여합니다.
- 보안 및 거버넌스: 챗봇을 안전하게 보호하고 데이터 거버넌스 정책을 준수하는 데 필요한 모범 사례입니다.
- 가시성: 챗봇의 건강과 성능을 유지하기 위해 모니터링 및 가시성을 구현합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-DocuChatEmpoweringYoutoExploreandUnderstandYourDataEffortlesslyPart-1_0.png" />

이 시리즈가 끝나면, 데이터 탐색과 이해를 쉽게 능력을 향상시킬 수 있는 강력한 기업급 챗봇을 구축하는 데 필요한 지식과 도구를 갖게 될 것입니다.

## RAG란 무엇인가요?

RAG는 LLM의 기능을 확장하여 추가 데이터를 통합하는 강력한 방법입니다. LLM은 다양한 주제를 토론할 수 있지만, 그들의 지식은 일정한 시점까지 공개 정보로 제한됩니다. 개인 정보나 보다 최근 데이터를 처리할 수 있는 AI 애플리케이션을 만들기 위해서는 모델의 지식을 관련 정보로 보충하는 것이 중요합니다.

<div class="content-ad"></div>

RAG은 필요한 데이터를 검색하여 모델의 프롬프트에 삽입함으로써 이를 달성합니다. LangChain, LlamaIndex와 같은 프레임워크는 Q&A 애플리케이션 및 RAG 구현을 용이하게 하는 컴포넌트 스위트를 제공합니다. 전형적인 RAG 애플리케이션은 두 가지 주요 컴포넌트로 구성됩니다:

- 색인화: 이는 여러 소스에서 데이터를 수집하고 색인화하는 파이프라인을 설정하는 과정입니다.

- 데이터 로딩: 첫 번째 단계는 데이터를 로드하는 것인데, 여기서는 LangChain의 `PyPDFLoader`, `WebBaseLoader` 또는 LLamaIndex의 `SimpleDirectoryReader`와 같은 DocumentLoader를 사용합니다.
- 텍스트 분할: 텍스트 분할기는 큰 문서를 작은 청크로 분할하여 검색이 쉽고 모델의 컨텍스트 창에 맞는 데이터로 만듭니다.
- 데이터 저장: 분할된 데이터 청크는 추후 검색을 위해 저장되고 색인화됩니다. 이때 ChromaDB, Azure Search, AWS ElasticSearch와 같은 VectorStores(벡터 스토어)를 Embeddings 모델과 결합하여 종종 사용합니다.

2. 검색 및 생성: 이 컴포넌트는 사용자 쿼리를 실시간으로 처리하고 색인에서 중요한 데이터를 검색하여 모델을 사용하여 응답을 생성합니다.

<div class="content-ad"></div>

- 데이터 검색: 사용자가 쿼리를 입력하면, 관련 청크는 리트리버를 사용하여 저장소에서 검색됩니다.
- 답변 생성: ChatModel 또는 LLM은 사용자의 질문과 검색된 데이터를 포함하여 답변을 생성합니다.

## RAG 아키텍처

![RAG 아키텍처](/assets/img/2024-06-19-DocuChatEmpoweringYoutoExploreandUnderstandYourDataEffortlesslyPart-1_1.png)

```js
def process_pdf_simple(self, file_content):
    # 문서 로드
    loader = PyPDFLoader(file_content)
    docs = loader.load()
    
    # 문서 분할
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200
    )
    splits = text_splitter.split_documents(docs)
    
    # 문서 색인화
    vectorstore = Chroma.from_documents(splits, self.embeddings)
    
    # 리트리버 정의
    retriever = vectorstore.as_retriever()
```

<div class="content-ad"></div>

이 스니펫에서는 PyPDFLoader를 사용하여 PDF 콘텐츠를 초기화하고 문서를 로드합니다. 그런 다음 Chroma 클래스를 사용하여 문서 청크에서 벡터 저장소를 생성합니다. Chroma의 `from_documents` 메서드는 임베딩 모델을 사용하여 문서 분할에서 인덱스를 생성합니다. `as_retriever` 메서드는 벡터 저장소를 검색기 객체로 변환하여 챗봇이 인덱싱된 문서 청크를 검색하고 가장 관련성 높은 정보를 빠르게 찾을 수 있도록 합니다.

# Q&A 챗봇의 주요 구성 요소:

1. 챗 모델: 텍스트 기반 LLM과 달리 메시지 기반 상호작용에 최적화되어 더 자연스러운 대화 응답을 제공합니다.

2. 프롬프트 템플릿: 이러한 템플릿은 기본 메시지, 사용자 입력, 채팅 기록 및 선택적으로 다른 소스에서 검색한 추가 컨텍스트를 결합하여 프롬프트를 만드는 데 도움이 됩니다. 이는 예를 들어, 금융 자문가로 챗봇을 가정하는 특정 페르소나를 만들어낼 수도 있습니다.

<div class="content-ad"></div>

3. 채팅 기록: 이 기능을 통해 챗봇은 과거 상호작용을 기억할 수 있어 후속 질문에 맥락을 제공하여 응답할 수 있습니다. Q&A 애플리케이션에서는 과거 질문과 답변을 기억하는 것이 일관된 대화를 위해 중요합니다.

## 기록 인식 검색 구현:

우리는 역사적 메시지와 최신 사용자 질문을 가져와 질문을 재정렬하여 이전 맥락없이도 이해할 수 있도록 할 서브-체인을 정의할 것입니다. 이를 위해 우리의 프롬프트에서 "chat_history"라는 `MessagesPlaceholder` 변수를 사용합니다. `create_history_aware_retriever`라는 도우미 함수를 사용하여 채팅 기록을 포함하고 시퀀스를 적용할 것입니다: `prompt | lIm | StrOutputParser | retriever`.

```js
####
# 질문 맥락화
####
contextualize_q_system_prompt = (
    "과거 채팅 기록과 최신 사용자 질문이 주어졌을 때, 채팅 기록에서 맥락을 참조할 수 있는 문제를 독립적으로 이해할 수 있는 혼자서도 이해할 수 있는 질문으로 재평가하세요. 질문에 대답하지 말고, 필요하다면 다시 정리하고 그렇지 않으면 그대로 반환하세요."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    ("system", contextualize_q_system_prompt),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
)

history_aware_retriever = create_history_aware_retriever(
    self.llm, retriever, contextualize_q_prompt
)
```

<div class="content-ad"></div>

## 전체 QA 체인 구축하기:

마침내, 우리는 리트리버를 히스토리 인식 리트리버로 업데이트하고 `create_stuff_documents_chain`을 사용하여 질문-답변 체인을 구축할 것입니다. 이 체인은 검색된 컨텍스트, 채팅 기록 및 사용자 쿼리를 받아 답변을 생성합니다. 그런 다음 `create_retrieval_chain`을 사용하여 최종 RAG 체인을 구성합니다. 이 체인은 히스토리 인식 리트리버와 질문-답변 체인을 순차적으로 적용하여 검색된 컨텍스트와 같은 중간 출력을 유지합니다. 이러한 단계를 통해 과거 상호작용을 인식하고 기억하는 강력한 챗봇을 구축했습니다. 이는 사용자와의 원활하고 일관된 대화를 보장합니다.

```js
### 채팅 기록 상태 관리하기 ###
store = {}

# 채팅 기록을 영속적으로 저장하고 있지 않지만, redis에 저장할 수도 있습니다
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer"
)

return conversational_rag_chain
```

마지막으로, 입력 쿼리를 처리하고 색인된 문서 청크에서 관련 정보를 검색하는 conversational_rag_chain inbuilt 메서드 invoke를 호출할 수 있습니다. 결합된 질문, 컨텍스트 및 프롬프트는 LLM에 전송되어 응답을 생성합니다.

<div class="content-ad"></div>

```js
file_path = 'amazon_2024_10q.pdf'
user_query = "Amazon의 2024년 Q1 10-Q SEC 보고서에서 보고된 주요 재무 하이라이트 및 중요한 변화는 무엇입니까?"
obj = ConversationRetrieverAgent()
chain = obj.process_pdf_simple(file_path)
result = chain.invoke({"input": user_query})
print(result["answer"])
```

# 결론

DocuChat 앱은 LangChain 및 검색 확장 생성 (RAG)과 같은 고급 기술을 활용하여 사용자가 데이터를 탐색하고 이해하는 데 편리하게 도와줍니다. 문서를 효율적으로 로드, 분리 및 색인화하고 정교한 검색 및 생성 기술을 활용하여, DocuChat은 사용자 쿼리에 정확하고 컨텍스트에 민감한 답변을 제공할 수 있습니다. 채팅 모델, 프롬프트 템플릿 및 채팅 기록을 통합함으로써 자연스럽고 일관된 대화를 보장합니다. 히스토리 인식 검색 및 견고한 세션 관리를 구현함으로써, DocuChat은 데이터를 더 접근 가능하고 실행 가능하게 만들어 스마트하고 원활한 상호 작용 경험을 제공합니다.

# 다음 단계?

<div class="content-ad"></div>

이번 시리즈의 다음 부분을 기대해주세요. 다음에는 고급 데이터 전처리와 멀티모달 검색에 대해 자세히 알아볼 것입니다. 이미지와 테이블을 포함한 문서를 어떻게 처리하는지, 이 데이터를 챗봇이 효과적으로 해석하고 활용하는 방법을 다룰 예정입니다. 이는 금융 서비스용 봇을 만들 때 특히 유용하며, SEC와 Bloomberg과 같은 출처에서 받은 금융 시장 데이터를 분석할 수 있게 해줍니다. 이 데이터는 종종 그래프, 지표, 테이블을 포함하고 있습니다. 이러한 통찰력을 놓치지 마시고 챗봇 역량을 향상시키세요!

# 저자 정보

이 기사를 읽어주셔서 감사합니다! 만약 여기서 논의된 전체 코드베이스를 보거나 완전히 기능하는 챗 앱을 사용해보고 싶다면, 아래 링크를 방문해 주세요:

- LinkedIn: LinkedIn 프로필
- GitHub: 이 기사의 전체 코드를 제 GitHub 프로필에서 확인하세요.
- Streamlit: Streamlit 앱에서 완전히 기능하는 앱과 상호 작용해보세요. 기능을 탐색하고, 질문을 하며, DocuChat이 실시간으로 쿼리에 응답하는 방식을 확인해보세요.

<div class="content-ad"></div>

LinkedIn에서 업데이트, 토론 및 지적 응용 프로그램 구축에 대한 자세한 통찰력을 얻으세요. 피드백 및 기여는 언제나 환영합니다!

참고 자료:

- https://platform.openai.com/docs/quickstart
- https://python.langchain.com/v0.2/docs/tutorials/chatbot/
- https://blog.langchain.dev/semi-structured-multi-modal-rag/
- https://docs.llamaindex.ai/en/stable/getting_started/concepts/