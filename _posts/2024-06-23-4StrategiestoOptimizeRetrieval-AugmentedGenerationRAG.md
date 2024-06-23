---
title: "검색 증강 생성RAG을 최적화하는 4가지 전략"
description: ""
coverImage: "/assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_0.png"
date: 2024-06-23 19:38
ogImage: 
  url: /assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_0.png
tag: Tech
originalTitle: "4 Strategies to Optimize Retrieval-Augmented Generation (RAG)"
link: "https://medium.com/ai-advances/4-strategies-to-optimize-retrieval-augmented-generation-0ad902b5c3e2"
---


# 개인 데이터 및 개인 인프라를 활용한 고급 AI 솔루션

![image](/assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_0.png)

머신 러닝 모델을 최적화하기 위해 권장 사항을 몇 번이나 따라보았는데, 여전히 특정 요구 사항과 잘 맞지 않는 솔루션에 부딪힌 적이 몇 번이나 있나요? 대답을 알아요: 많은, 아니면 모든 경우에 해당할 거예요. 모든 것이 데이터에 달려 있기 때문이죠. 특정 상황에 가장 적합한 방법을 찾을 때까지 테스트하고 실패하고 또 다시 테스트해야만 해요. 이 기사에서는 고급 AI 솔루션을 위해 개인 데이터와 개인 인프라를 활용하여 검색 증강 생성(Retrieval-Augmented Generation, RAG)을 최적화하는 네 가지 전략을 제시합니다.

이전 기사에서는 LLaMA 3 같은 공개 모델에 개인 지식을 포함시키기 위해 검색 증강 생성(RAG) 전략을 활용하는 방법을 설명했습니다. RAG를 사용하면 개인 데이터를 개인 인프라에 저장하면서도 민감한 정보를 다른 사람들과 공유하지 않고 사용할 수 있습니다. RAG를 활용하는 장점은 명백하지만, 구현에는 여러 부분에서 중요한 조정이 필요합니다.

<div class="content-ad"></div>

## RAG Recap

저는 이전 글에서 설명한 RAG에 대한 간단한 개요부터 시작하겠습니다. 두 가지 주요 프로세스가 있습니다. 첫 번째는 "데이터 수집 프로세스"로, 다양한 소스에서 데이터를 수집하여 텍스트로 변환한 후 작은, 일관된 및 의미론적으로 관련 있는 부분으로 분할하고 결과를 벡터 데이터베이스에 저장합니다. 두 번째는 "추론 프로세스"로, 사용자 쿼리로 시작하여 첫 번째 프로세스의 결과를 사용하여 관련 데이터 부분을 식별하고 마지막으로 모델의 컨텍스트를 풍부하게하여 출력을 얻습니다.

다음 다이어그램에서 두 프로세스의 자세한 내용을 볼 수 있습니다:

![다이어그램](/assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_1.png)

<div class="content-ad"></div>

지난 기사에서는 ColdF 라는 가상의 회사에서 데이터를 사용하여 "데이터 수집" 및 "추론" 프로세스를 생성했습니다. 이 기사에서는 이러한 프로세스의 결과를 평가하고 최적화하는 기본적인 방법을 설명하겠습니다.

## 개선 구성 요소

먼저, 우리의 RAG 프로세스에서 중요한 지점을 식별하는 것부터 시작해봅시다:

- 청킹 접근: 의미 있고 맥락적으로 관련 있는 데이터 세그먼트를 보장하도록 청킹 크기를 최적화합니다.
- 임베딩 모델: 의미 표현을 개선하기 위해 모델 선택 및 세부 조정을 수행합니다.
- 벡터 검색 방법: 효과적인 유사성 측정 및 검색 매개변수 선택합니다.
- 모델에 피드할 최종 프롬프트: 효율적인 결과 품질을 개선하기 위해 효과적인 프롬프트를 작성합니다.

<div class="content-ad"></div>

## RAG 파이프라인에서의 A/B 테스팅

각 개선 구성 요소를 식별한 후, 전략은 각 구성 요소의 두 가지 다른 구성을 가진 두 버전을 비교하여 어떤 것이 더 나은 성능을 발휘하는지 결정합니다. 이는 두 버전을 실행하고 미리 정의된 지표에 대한 성능을 측정하는 것을 포함합니다. 하지만 성능을 어떻게 측정할까요? 그리고 어떤 지표를 사용해야 할까요? 이에 대한 답변으로 우리는 “RAGAS: 자동화된 검색 증강 생성 평가”¹ 논문을 사용합니다. 이 논문은 세 가지 주요 지표를 제안합니다:

- 충실도: 답변에 있는 정보가 문맥에 제공된 정보와 일치하는지 확인합니다. 답변이 충실하다면 그 안에 있는 모든 내용이 문맥에서 직접 찾거나 추론할 수 있습니다. 예를 들어, 문맥이 “5월에 리스본을 방문했을 때, 앨리스와 나는 알파마, 바이로 알토, 벨렘 타워 그리고 다른 여러 곳으로 갔다”이고 답변이 “5월에 앨리스는 알파마, 바이로 알토, 벨렘 타워 그리고 다른 여러 곳으로 갔다”라면 문맥은 추출된 모든 내용을 지지하므로 충실도 점수는 100%입니다. 그러나 답변이 “5월에 앨리스는 알파마와 상 호르헤 성에 갔다”라면 답변에서 추출된 두 내용 중 (예: “앨리스는 알파마로 갔다” 및 “앨리스는 상 호르헤 성에 갔다”) 하나만이 문맥에서 지지되므로 충실도 점수는 50%입니다.
- 답변 관련성: 생성된 답변이 완전하고 직접적으로 질문에 대답하는지 확인합니다. 정보가 정확하든 아니든 관련성이 있습니다. 예를 들어, 질문이 “포르투갈의 수도는 무엇인가?”이고 답변이 “리스본은 포르투갈의 수도입니다”라면 이 답변은 질문에 직접 대답하므로 관련성이 있습니다. 답변이 “리스본은 다양한 명소가 많은 아름다운 도시입니다”라면 부분적으로 관련성이 있을 수 있지만 질문에 대답하는 데 직접 필요한 정보가 아닌 추가 정보가 포함되어 있습니다. 이 지표는 답변이 집중되고 핵심을 유지하도록 보장합니다.
- 문맥 관련성: 문맥에서 제공된 정보가 질문에 대답하는 데 얼마나 도움이 되는지 확인합니다. 필요한 것만 포함되고 불필요한 관련 없는 정보는 제거되므로 질문에 직접적으로 도움이 되지 않는 부가 정보를 제거합니다. 예를 들어, 질문이 “5월에 앨리스가 리스본에서 어떤 장소를 방문했나요?”이고 문맥이 “5월에 리스본을 방문했을 때, 앨리스는 알파마, 바이로 알토, 벨렘 타워 그리고 다른 여러 곳으로 갔다”이면 이 문맥은 앨리스가 5월에 어떤 장소를 방문했는지에 대한 필수 정보만을 제공하므로 매우 관련성이 높습니다. 그러나 문맥이 “5월에 리스본을 방문했을 때, 앨리스는 많은 흥미로운 사람을 만나 맛있는 음식을 먹었으며 다양한 장소를 갔다”이면 이 문맥은 질문에 대답하는 데 필요하지 않은 부가 정보를 포함하고 있으므로 관련성이 없는 것으로 간주됩니다. 이 지표는 질문에 대답하는 데 도움이 되는 정보만 포함되어 불필요한 자세를 피하도록 보장합니다. 이 지표는 문맥 정밀도로도 불립니다.

이 논문은 또한 이러한 지표가 LLM을 통해 완전 자동화된 방식으로 측정될 수 있다는 방법에 대해 설명합니다.


<div class="content-ad"></div>

이 평가에서 사용할 라이브러리인 Ragas는 이러한 주요 메트릭의 진화를 보여주며 새로운 메트릭을 추가했습니다:

- Context Recall: 이 메트릭은 문맥과 실제 답변 간의 일치 정도를 측정합니다. Context Relevance와 마찬가지로 생성된 답변 대신 실제 답변을 사용합니다. 이 메트릭을 얻으려면 참 값이 필요합니다. 이러한 전략의 효과를 평가하기 위해 ColdF 데이터를 바탕으로 실제 답변이 포함된 10개의 질문 세트를 준비했습니다.

Faithfulness와 Answer Relevance는 생성기 메트릭으로서, 각각 환영과 답변이 질문과 얼마나 직접적인지를 측정합니다.

Context Relevance와 Context Recall은 검색기 메트릭으로, 벡터 데이터베이스에서 올바른 데이터 청크를 검색하고 필요한 모든 정보를 얻는 능력을 측정합니다.

<div class="content-ad"></div>

이전에 제시한 네 가지 메트릭을 평가하려면 질문, 생성된 답변, 맥락 및 실제 답변이 필요합니다.

LangChain을 사용하여 RAG 프로세스를 구현할 것입니다. 코드를 실행하려면 Python이 설치되어 있어야 하며(version 3.11.9) 다음 라이브러리가 필요합니다:

- ollama==0.2.1
- chromadb==0.5.0
- transformers==4.41.2
- torch==2.3.1
- langchain==0.2.0
- ragas==0.1.9

다음은 LangChain을 사용한 코드 스니펫입니다:

<div class="content-ad"></div>

```js
# 필요한 라이브러리 및 모듈 가져오기
from langchain.embeddings.base import Embeddings
from transformers import BertModel, BertTokenizer, DPRQuestionEncoder, DPRQuestionEncoderTokenizer, RobertaModel, RobertaTokenizer
from langchain.prompts import ChatPromptTemplate
from langchain_text_splitters import MarkdownHeaderTextSplitter
import requests
from langchain_chroma import Chroma
from langchain import hub
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_models import ChatOllama
from operator import itemgetter

# DPRQuestionEncoder를 사용하여 사용자 지정 임베딩 클래스 정의
class DPRQuestionEncoderEmbeddings(Embeddings):
    show_progress: bool = False
    """tqdm을 설치해야 하는지 여부 표시합니다."""
    
    def __init__(self, model_name: str = 'facebook/dpr-question_encoder-single-nq-base'):
        # 지정된 모델 이름으로 토크나이저와 모델 초기화
        self.tokenizer = DPRQuestionEncoderTokenizer.from_pretrained(model_name)
        self.model = DPRQuestionEncoder.from_pretrained(model_name)
        
    def embed(self, texts):
        # texts가 리스트인지 확인
        if isinstance(texts, str):
            texts = [texts]
        
        embeddings = []
        if self.show_progress:
            try:
                from tqdm import tqdm
                iter_ = tqdm(texts, desc="임베딩 중")
            except ImportError:
                logger.warning(
                    "tqdm을 가져올 수 없어 진행률 표시줄을 표시할 수 없습니다. "
                    "`pip install tqdm`으로 설치하세요."
                )
                iter_ = texts
        else:
            iter_ = texts

        for text in iter_:
            # 입력 텍스트 tokenize
            inputs = self.tokenizer(text, return_tensors='pt')
            # 모델을 사용하여 임베딩 생성
            outputs = self.model(**inputs)
            # 임베딩 추출하고 리스트로 변환
            embedding = outputs.pooler_output.detach().numpy()[0]
            embeddings.append(embedding.tolist())
        
        return embeddings
    
    def embed_documents(self, documents):
        return self.embed(documents)
    
    def embed_query(self, query):
        return self.embed([query])[0]

# 프롬프트 생성을 위한 템플릿 정의
template = """
### CONTEXT
{context}

### QUESTION
Question: {question}

### INSTRUCTIONS
CONTEXT 마크다운 텍스트를 사용하여 사용자의 질문에 답변하세요.
간결하고 명료한 답변을 제공하세요.
질문에 답변하기 위해 CONTEXT에 근거만 사용하세요.
CONTEXT에 필요한 정보가 없는 경우 'NONE'을 반환하세요.
"""

# 템플릿을 사용하여 ChatPromptTemplate 인스턴스 생성
prompt = ChatPromptTemplate.from_template(template)

# URL에서 텍스트 데이터 가져오기
url = "https://raw.githubusercontent.com/cgrodrigues/rag-intro/main/coldf_secret_experiments.txt"
response = requests.get(url)
if response.status_code == 200:
    text = response.text
else:
    raise Exception(f"파일을 가져오는 데 실패했습니다: {response.status_code}")

# 마크다운 텍스트를 분할할 헤더 정의
headers_to_split_on = [
    ("#", "Header 1")
]

# 지정된 헤더로 MarkdownHeaderTextSplitter 인스턴스 생성
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on, strip_headers=False
)

# 마크다운 splitter를 사용하여 텍스트 분할
docs_splits = markdown_splitter.split_text(text)

# Chat 모델 초기화
llm = ChatOllama(model="llama3")

# 사용자 지정 임베딩을 사용하여 문서에서 Chroma vector store 생성
vectorstore = Chroma.from_documents(documents=docs_splits, embedding=DPRQuestionEncoderEmbeddings())

# Vector store에서 retriever 생성
retriever = vectorstore.as_retriever()

# 문서 형식 지정을 위한 함수 정의
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 검색 보완 생성 (RAG) chain 생성
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | RunnablePassthrough.assign(context=itemgetter("context"))
    | {"answer": prompt | llm | StrOutputParser(), 
       "context": itemgetter("context")}
)

# 질문으로 RAG chain 실행
result = rag_chain.invoke("Who led the Experiment 1?")
print(result)
```

위 코드의 끝에 RAG Chain이 정의되어 있으며 이 코드를 사용하여 메트릭을 평가할 수 있습니다:

```js
# 필요한 라이브러리 및 모듈 가져오기
import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
        context_precision,
        faithfulness,
        answer_relevancy,
        context_recall
)
from langchain_community.chat_models import ChatOllama

def get_questions_answers_contexts(rag_chain):
    """ 질문 및 답변 목록을 읽고 ragas 데이터셋을 반환합니다. """
    # 파일 URL
    url = 'https://raw.githubusercontent.com/cgrodrigues/rag-intro/main/coldf_question_and_answer.psv'

    # URL에서 파일 가져오기
    response = requests.get(url)
    data = response.text
   
    # 데이터를 줄 단위로 분할
    lines = data.split('\n')

    # 각 줄을 파이프 기호로 나누어 튜플 생성
    rag_dataset = []

    for line in lines[1:10]: # 처음 10개 질문만
        if line.strip():  # 공백이 아닌지 확인
            question, reference_answer = line.split('|')
            result = rag_chain.invoke(question)
            generated_answer = result['answer']
            contexts = result['context']

            rag_dataset.append({
                "question": question,
                "answer": generated_answer, 
                "contexts": [contexts], 
                "ground_truth": reference_answer
            })

          
    rag_df = pd.DataFrame(rag_dataset)
    rag_eval_datset = Dataset.from_pandas(rag_df)
    
    # ragas 데이터셋 반환
    return rag_eval_datset

def get_metrics(rag_dataset):
    """ RAG Dataset에 대해 신의성, 답변 관련성, 컨텍스트 정밀도, 
        컨텍스트 재현율 메트릭 계산 """
    # 계산할 메트릭 목록
    metrics = [
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    ]
        
    # LLaMA 3 모델을 사용할 지역 ChatOllama
    langchain_llm =  ChatOllama(model="llama3")
    langchain_embeddings = DPRQuestionEncoderEmbeddings('facebook/dpr-question_encoder-single-nq-base')

    # 메트릭 반환
    results = evaluate(rag_dataset, metrics=metrics, llm=langchain_llm, embeddings=langchain_embeddings)
    return results

# RAG 데이터셋 가져오기
rag_dataset = get_questions_answers_contexts(rag_chain)

# 메트릭 계산
results = get_metrics(rag_dataset)
print(results)
```

위 코드를 실행하여 결과를 살펴보세요.

<div class="content-ad"></div>

```json
{
  '신뢰성': 0.8611, 
  '답변 관련성': 0.8653, 
  '맥락 정밀도': 0.7778, 
  '맥락 회수율': 0.8889
}
```

<img src="/assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_2.png" />

이미 언급된 것처럼, 첫 번째 두 지표(예: 신뢰성 및 답변 관련성)는 생성 과정과 관련이 있습니다. 이는 이러한 지표를 향상시키기 위해서는 언어 모델이나 모델에 입력되는 프롬프트를 변경해야 한다는 것을 의미합니다. 마지막 두 지표(예: 맥락 정밀도 및 맥락 회수율)는 검색과 관련이 있으며, 이는 이러한 지표를 향상시키기 위해서는 문서가 저장되고 색인화되며 선택되는 방식을 개선해야 한다는 것을 의미합니다.

## 청킹 접근 방식

<div class="content-ad"></div>

청킹 접근 방식은 데이터가 검색을 위해 최적의 세그먼트로 분할되도록 보장합니다. 이 패러다임은 다양한 청크 크기를 실험하여 너무 작아서 문맥이 빠진다거나 너무 크면 (검색 시스템을 압도하는) 문제가 발생하지 않도록 균형을 찾는 것을 포함합니다. 베이스라인에서는 각 실험을 기준으로 문서를 청크로 분할합니다. 그렇기 때문에 실험의 일부가 희석되어 최종 임베딩에 포함되지 않을 수 있습니다. 이 상황을 해결하기 위한 한 가지 가능한 접근 방식은 부모 문서 검색기를 사용하는 것입니다. 이 방법은 특정 관련 문서 단편이나 문단뿐만 아니라 그들의 부모 문서도 검색합니다. 이 접근 방식은 관련 단편 주변의 문맥이 보존되도록 보장합니다. 아래 코드는 이 접근 방식을 테스트할 때 사용되었습니다:

```js
# 필요한 라이브러리 및 모듈 가져오기
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore
from langchain.text_splitter import RecursiveCharacterTextSplitter


# 부모 문서 검색기 생성
parent_document_retriever = ParentDocumentRetriever(
    vectorstore = Chroma(collection_name="parents", 
                         embedding_function=DPRQuestionEncoderEmbeddings('facebook/dpr-question_encoder-single-nq-base')),
    docstore = InMemoryStore(),
    child_splitter = RecursiveCharacterTextSplitter(chunk_size=200),
    parent_splitter = RecursiveCharacterTextSplitter(chunk_size=1500),
)

parent_document_retriever.add_documents(docs_splits)


# 검색 보강 생성 (RAG) 체인 생성
rag_chain_pr = (
    {"context": parent_document_retriever | format_docs, "question": RunnablePassthrough()}
    | RunnablePassthrough.assign(context=itemgetter("context"))
    | {"answer": prompt | llm | StrOutputParser(), 
       "context": itemgetter("context")}
)

# RAG 데이터세트 가져오기
rag_dataset = get_questions_answers_contexts(rag_chain_pr)

# 메트릭스 계산
results = get_metrics(rag_dataset)
print(results)
```

결과는 다음과 같습니다:

```js
{
  'faithfulness': 0.6667, 
  'answer_relevancy': 0.4867, 
  'context_precision': 0.7778, 
  'context_recall': 0.6574
}
```

<div class="content-ad"></div>

아래는 성능 향상에 기여하지 않는 것을 보여줍니다. 감소하는 컨텍스트 회상은 회수 과정이 제대로 작동하지 않고 컨텍스트에 완전한 정보가 없음을 나타냅니다. 충실성 및 답변 관련성 지표의 변화는 풍부하지 않은 컨텍스트에서 나옵니다. 이 경우, 청킹 및 회수를 위한 다른 방법을 평가해 볼 수 있습니다.

## 포함 모델

포함 모델은 텍스트 청크를 밀집 벡터 표현으로 변환합니다. 서로 다른 모델은 다양한 주제에서 훈련될 수 있으며 때로는 임베딩을 개선할 수 있습니다. 임베딩 방법의 선택은 계산 효율성과 임베딩 품질 사이의 균형을 고려해야 합니다.

<div class="content-ad"></div>

우리는 Dense Passage Retrieval (“facebook/dpr-question_encoder-single-nq-base”), Sentence-BERT (“paraphrase-MiniLM-L6-v2”), 또는 Chroma의 기본 모델 (“all-MiniLM-L6-v2”)과 같은 다양한 임베딩 모델을 비교합니다. 각 모델은 강점을 갖고 있으며 도메인 특정 데이터에서 평가하여 가장 정확한 의미 표현을 제공하는지를 결정하는 데 도움이 됩니다.

임베딩 모델을 변경하기 위해 새로운 클래스 "SentenceBertEncoderEmbeddings"를 정의하는 것이 필요합니다. 이 새로운 클래스는 모델인 Sentence-BERT 모델을 구현합니다. 이 새로운 클래스는 우리 이전 임베딩인 "DPRQuestionEncoderEmbeddings"를 대체할 것이며, 이것은 아래의 코드로 Sentence-BERT 모델을 테스트하는 데 사용한 코드입니다:

```js
코드 내용
```

결과는 요렇습니다:

<div class="content-ad"></div>

```js
{
  'faithfulness': 0.5278, 
  'answer_relevancy': 0.5306, 
  'context_precision': 0.5556, 
  'context_recall': 0.7997
}
```

<img src="/assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_4.png" />

이 경우, 인코더의 변경은 메트릭스에서 성능이 저하된 것을 의미합니다. 이는 DPR이 Sentence-BERT보다 검색 정확도가 더 높기 때문에, 정확한 문서 검색이 중요한 경우에는 DPR이 더 적합하다는 것을 의미합니다. Sentence-BERT로 전환할 때 '신뢰성' 및 '답변 관련성' 메트릭스의 상당한 하락은 높은 검색 정밀성을 필요로 하는 작업에 적합한 임베딩 모델을 선택하는 중요성을 강조합니다.

## 벡터 검색 방법


<div class="content-ad"></div>

벡터 검색 방법은 유사성 측정을 기반으로 가장 관련성 높은 청크를 검색합니다. 흔한 방법으로는 유클리드 (L2) 거리, 코사인 유사도 등이 있습니다. 이 검색 방법을 변경하면 최종 출력 품질을 향상시킬 수 있습니다.

다음은 코드입니다:

```js
# 필요한 라이브러리 및 모듈 가져오기
import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
        context_precision,
        faithfulness,
        answer_relevancy,
        context_recall
)
from langchain_community.chat_models import ChatOllama

# 문서에서 Chroma 벡터 저장소 생성
# 사용자 정의 임베딩을 사용하고 코사인 유사도 검색으로 변경
vectorstore = Chroma.from_documents(collection_name="dist", 
                                    documents=docs_splits, 
                                    embedding=DPRQuestionEncoderEmbeddings(), 
                                    collection_metadata={"hnsw:space": "cosine"})

# 벡터 저장소로부터 리트리버 생성
retriever = vectorstore.as_retriever()

# 검색 증강 생성 (RAG) 체인 생성
rag_chain_dist = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | RunnablePassthrough.assign(context=itemgetter("context"))
    | {"answer": prompt | llm | StrOutputParser(), 
       "context": itemgetter("context")})

# RAG 데이터 세트 가져오기
rag_dataset = get_questions_answers_contexts(rag_chain_dist)

# 메트릭 계산
results = get_metrics(rag_dataset)
print(results)
```

이것이 결과입니다:

<div class="content-ad"></div>

```js
{
  'faithfulness': 0.9444, 
  'answer_relevancy': 0.8504, 
  'context_precision': 0.6667, 
  'context_recall': 0.8889
}
```

![Image](/assets/img/2024-06-23-4StrategiestoOptimizeRetrieval-AugmentedGenerationRAG_5.png)

'충실성'에서의 개선은 벡터 검색에 코사인 유사도를 사용하여 검색된 문서를 쿼리와 더 잘 일치시키는 것을 나타냅니다. '문맥 정밀도'가 감소했지만 전체적으로 높은 '충실성'과 '문맥 회수율'은 이 맥락에서 코사인 유사도가 보다 효과적인 벡터 검색 방법이라는 것을 보여주며, 검색 성능을 최적화하기 위한 벡터 검색 방법의 선택의 중요성을 뒷받침합니다.

## 모델에 피드 할 최종 프롬프트


<div class="content-ad"></div>

최종 프롬프트 구성은 검색된 데이터를 모델의 쿼리에 통합하는 것을 의미합니다. 프롬프트의 작은 변화는 결과에 큰 영향을 미칠 수 있어 시행 착오 과정이 될 수 있습니다. 프롬프트 내의 예시를 제공하면 모델이 더 정확하고 관련성 높은 결과물을 생성할 수 있습니다.

## 결론

검색 증강 생성(Retrieval-Augmented Generation, RAG) 파이프라인을 최적화하는 것은 특정 데이터와 애플리케이션 컨텍스트에 매우 의존적인 반복적인 과정입니다. 본 논문에서는 네 가지 주요 전략을 탐구했습니다: 청킹 접근 방식의 개선, 임베딩 모델의 선택과 세밀한 튜닝, 효과적인 벡터 검색 방법의 선택, 정확한 프롬프트 작성. 이러한 구성 요소 각각이 RAG 시스템의 성능 향상에 중요한 역할을 합니다.

결과는 일반적인 해결책이 없음을 강조했습니다. 예를 들어, 우리의 맥락에서 Dense Passage Retrieval (DPR)은 Sentence-BERT보다 우수한 성과를 보였지만, 이는 다른 데이터셋이나 요구 사항에 따라 달라질 수 있습니다. 마찬가지로, 벡터 검색에서 코사인 유사도로 전환하면 더 나은 충실도와 콘텍스트 회수가 나타나는 것으로 나타났는데, 검색 과정의 미묘한 변경이 영향을 미치는 것을 보여주었습니다.

<div class="content-ad"></div>

RAG 파이프라인을 최적화하는 여정은 지속적인 테스트, 실패로부터 교훈을 얻고, 정보에 기반한 조정을 포함합니다. 이 반복적인 방식을 받아들이면, AI 솔루션을 더 효과적으로 사용자의 요구에 맞게 맞춤화할 수 있습니다. 성공의 열쇠는 데이터를 이해하고, 다양한 전략을 실험해보며, 끊임없이 프로세스를 개선하는 데 있습니다.

내 프로필과 이메일 목록을 구독하여 최신 작업을 업데이트 받아보세요. 함께하면, AI 최적화의 복잡성을 탐험하고 데이터 기반 솔루션의 완전한 잠재력을 발휘할 수 있습니다. 

## 참고 자료

[1] Es, S., James, J., Espinosa-Anke, L., & Schockaert, S. (2023). RAGAS: Automated Evaluation of Retrieval Augmented Generation. Exploding Gradients, CardiffNLP, Cardiff University, AMPLYFI.