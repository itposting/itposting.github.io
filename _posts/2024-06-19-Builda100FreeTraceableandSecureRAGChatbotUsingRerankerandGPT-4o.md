---
title: "100 무료, 추적 가능하고 안전한 RAG 챗봇 만들기 Reranker와 GPT-4o를 활용해 보세요"
description: ""
coverImage: "/assets/img/2024-06-19-Builda100FreeTraceableandSecureRAGChatbotUsingRerankerandGPT-4o_0.png"
date: 2024-06-19 19:54
ogImage: 
  url: /assets/img/2024-06-19-Builda100FreeTraceableandSecureRAGChatbotUsingRerankerandGPT-4o_0.png
tag: Tech
originalTitle: "Build a 100% Free, Traceable, and Secure RAG Chatbot Using Reranker and GPT-4o"
link: "https://medium.com/@Stan_DS/build-a-100-free-hallucination-free-secure-rag-chatbot-using-reranker-and-gpt4o-96c2eea24f95"
---


홍태, 징 왕, 징 주, 그리고 루차오 제이.

![이미지](/assets/img/2024-06-19-Builda100FreeTraceableandSecureRAGChatbotUsingRerankerandGPT-4o_0.png)

완전히 무료이며 저지연, 환각 없는 챗봇을 보유하는 것은 대형 언어 모델 애플리케이션의 황금빛 꿈이죠. 이 오픈 소스 RAG 챗봇은 그 목표에 한 걸음 더 가까워졌습니다.

# 리랭커란 무엇이며 왜 사용하는 건가요?

<div class="content-ad"></div>

리랭커(re-ranker)는 언어 모델을 사용하여 문서 청크를 평가하고 정렬하여 사용자 질문에 대답하기 위한 가장 관련성 높은 문서를 선택합니다. 무료이며(리랭커로 오픈 소스 교차 인코더를 사용합니다) 성능도 우수합니다.

리랭커에는 여러 가지 종류가 있습니다. 교차 인코더는 쿼리와 문서 사이의 관련성을 평가하고 높은 품질의 답변을 위해 LLM으로 보낼 가장 관련성 높은 문서를 선택하는 BERT 기반 모델입니다. 속도와 정확성을 균형있게 유지하며, 리랭킹 방법은 더 나은 검색 결과를 강조합니다. 여기서는 Hugging Face의 교차 인코더를 사용합니다.

# 임베딩의 한계

임베딩은 의미 정보를 캡처하기 위해 설계되었지만 종종 "사과를 좋아해"와 "이전에는 사과를 좋아했어"와 같은 비슷한 구문 사이의 미묘한 차이를 구분하는 데 어려움을 겪습니다. 이는 대조적인 정보 부족으로 인한 것입니다. 임베딩은 주로 1024 차원 정도로 고정되어 있으며, 이는 복잡하거나 긴 문서 및 쿼리를 완전히 나타내는 능력을 제한할 수 있습니다. 또한, 이들은 실제 세계 검색 애플리케이션에 중요한, 보지 못한 콘텐츠에 효과적으로 일반화할 수 없습니다. 이 한계는 고정된 차원 및 훈련 데이터의 제약으로 자주 악화됩니다.

<div class="content-ad"></div>

# reranker가 어떻게 작동하는가요?

reranker는 교차 인코딩 reranker로, 사전 훈련된 BERT 모델을 사용하여 쿼리, 문서 쌍의 관련성을 평가하는 데 사용됩니다. 교차 인코더의 입력은 쿼리와 문서의 쌍입니다. 출력은 순위 점수이며, 이는 검색 결과를 평가하고 제품을 추천하는 데 적합합니다. 여기서 우리는 reranker를 사용하여 LLM에게 사용자 질문에 대답할 수 있는 매우 관련 있는 문서를 선택합니다.
쿼리와 문서를 함께 처리함으로써 모델은 그들 사이의 뉘앙스와 문맥적 관계(트랜스포머의 self-attention)을 잡아내어 더 정확한 관련성 평가를 가능케 합니다.
잠재적인 단점은 대기 시간과 비용입니다. 본 연구에서는 reranker의 비용을 줄이기 위해 오픈 소스 reranker를 사용하고 텍스트 전처리 결과를 캐싱하여 대기 시간을 줄였습니다. 몇 메가바이트의 PDF 파일을 테스트한 결과, 대기 시간은 몇 초 미만입니다.

현재 reranker 모델의 비교는 Galileo.AI에서 수행됩니다.

<div class="content-ad"></div>

# 아키텍처 비교:

Reranker 기반 RAG는 기존 RAG 단계(text 토큰화, 임베딩, 벡터 데이터베이스 생성 및 유사성 검색)를 하나의 교차 인코딩 리랭커로 단순화합니다. 리랭커에 의해 선택된 상위 N개의 가장 관련성 높은 텍스트 청크는 답변 생성을 위해 ChatGPT와 같은 LLM에 공급됩니다.

주요 차이점은 다음 색깔 청크 안에 강조되어 있습니다.

![Architecture Comparison](/assets/img/2024-06-19-Builda100FreeTraceableandSecureRAGChatbotUsingRerankerandGPT-4o_2.png)

<div class="content-ad"></div>

# 챗봇 사용 설명서

reranker 기반 RAG를 시연하기 위해 Streamlit 인터페이스가 구축되었습니다.
사용자는 자신의 OpenAI API 키를 복사하여 붙여넣고 왼쪽에 PDF 파일을 업로드할 수 있습니다. 일부 텍스트 전처리 후, 사용자는 PDF에 관한 질문을 할 수 있습니다.
언급했듯이, 전처리된 문서는 지연 시간을 줄이기 위해 캐시 메모리에 저장됩니다. ChatGPT-4o API의 최근 릴리스를 활용하여 챗봇 답변이 만족스러운 것을 확인할 수 있습니다.

![이미지](/assets/img/2024-06-19-Builda100FreeTraceableandSecureRAGChatbotUsingRerankerandGPT-4o_3.png)

# 튜토리얼

<div class="content-ad"></div>

패키지를 로드합니다

```python
from openai import OpenAI
# Text Splitting Utilities
from langchain.text_splitter import RecursiveCharacterTextSplitter, SentenceTransformersTokenTextSplitter
from sentence_transformers import CrossEncoder

import streamlit as st
from pypdf import PdfReader
import openai
import numpy as np
```

크로스-인코더 'ms-marco-MiniLM-L-6-v2'는 사용자 쿼리에 대한 모든 텍스트 청크의 순위를 지정하는 리랭커로 사용됩니다. 가장 관련성 높은 상위 N개의 텍스트 청크가 사용자 질문에 대한 답변에 사용될 것입니다.

```python
st.set_page_config(page_title="Reranker 및 완전히 무료 PDF 쿼리 어시스턴트", layout="wide")

def rank_doc(query, text_chunks, topN=5):
    # 지정된 모델 이름으로 CrossEncoder 모델을 초기화합니다
    reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    
    # 쿼리와 문서 각각에 대한 점수를 예측합니다
    scores = reranker.predict([[query, doc] for doc in text_chunks])
    
    # 내림차순으로 상위 N개의 점수의 인덱스를 가져옵니다
    top_indices = np.argsort(scores)[::-1][:topN]
    
    # 상위 순위의 텍스트 문서를 리스트 인덱싱을 사용하여 검색합니다
    top_pairs = [text_chunks[index] for index in top_indices]
    return top_pairs  # 상위 순위 텍스트 문자열의 목록을 반환합니다
```

<div class="content-ad"></div>

가장 관련성이 높은 상위 N개의 검색된 문서와 사용자 쿼리가 GPT-4o에 입력으로 사용됩니다.

```js
def rag(query, retrieved_documents, api_key):
    model = "gpt-4o"


    # API 키 설정
    openai.api_key = api_key

    information = "\n\n".join(retrieved_documents)
    messages = [
        {
            "role": "system",
            "content": "도움이 되는 전문 금융 연구 보조원입니다. 사용자는 연례 10K 보고서에 포함된 정보에 관한 질문을 하고 있습니다."
                       "사용자의 질문과 연례 보고서에서 관련 정보가 표시됩니다. 이 정보만을 사용하여 사용자의 질문에 답하세요."
        },
        {"role": "user", "content": f"질문: {query}. \n 정보: {information}"}
    ]
    
    response = openai.chat.completions.create(
        model=model,
        messages=messages,
    )
    content = response.choices[0].message.content # 올바른 속성 엑세스로 업데이트됨
    return content
```

텍스트 전처리 단계에는 PDF 텍스트를 분할하고 ‘\t’ 및 ‘\n’과 같은 특수 구분 기호를 제거하는 정리 단계가 포함됩니다. Streamlit은 PDF 처리 단계를 메모리에 캐싱하여 대기 시간을 줄입니다.

```js
@st.cache_data
def process_pdf_texts(pdf_file):
    reader = PdfReader(pdf_file)
    pdf_texts = [p.extract_text().strip() for p in reader.pages if p.extract_text()]
    character_splitter = RecursiveCharacterTextSplitter(separators=["\n\n", "\n", ". ", " ", ""], chunk_size=1000, chunk_overlap=0)
    character_split_texts = character_splitter.split_text('\n\n'.join(pdf_texts))
    return clean_text_list(character_split_texts)

def clean_text_list(text_list):
    cleaned_texts = []
    for text in text_list:
        text = text.replace('\t', ' ').replace('\n', ' ')
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        cleaned_text = '\n'.join(lines)
        cleaned_texts.append(cleaned_text)
    return cleaned_texts
```

<div class="content-ad"></div>

마침내, 사용자가 패스코드를 입력하고 파일을 업로드하며 질문할 수 있는 간단한 Streamlit 인터페이스가 설계되었습니다.

```js
st.sidebar.title("구성")
api_key = st.sidebar.text_input("오픈AI API 키를 입력하세요", type="password")
uploaded_file = st.sidebar.file_uploader("PDF 파일을 선택하세요", type=['pdf'])

if uploaded_file and api_key:
    formatted_texts = process_pdf_texts(uploaded_file)
    st.session_state.processed_texts = formatted_texts

st.title("Reranker가 있는 무료 PDF 쿼리 어시스턴트")
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

if st.session_state.chat_history:
    for query, response in st.session_state.chat_history:
        st.container().markdown(f"**질문**: {query}")
        st.container().markdown(f"**답변**: {response}")

query = st.text_input("여기에 질문을 입력하세요:", key="query")

if st.button("쿼리 제출"):
    if 'processed_texts' in st.session_state and query and api_key:
        with st.spinner('처리 중...'):
            retrieved_documents = rank_doc(query, st.session_state.processed_texts)
            output_wrapped = rag(query, retrieved_documents, api_key)
            st.session_state.chat_history.append((query, output_wrapped))
            st.container().markdown(f"**질문**: {query}")
            st.container().markdown(f"**답변**: {output_wrapped}")
    else:
        st.error("PDF를 업로드하고 API 키를 설정하고 질문을 입력하세요.")
```

예시 질문

```js
    "2024년에 테슬라가 좋은 투자인가요?",
    "일론 머스크는 천재인가요?",
    "2023년 수익은 얼마인가요?"
```

<div class="content-ad"></div>

예시 출력

```js
Q1에 대한 답변
죄송하지만, 2023년 12월 31일 종료인 Tesla, Inc.의 연례 보고서로부터 제공된 정보를 기반으로 하여 2024년에 Tesla가 좋은 투자일지에 대해 명확한 답변을 제공할 수 없습니다. 투자 결정은 재무제표 이외의 다양한 요소들을 고려해야 합니다. 시장 상황, 경쟁, 산업 동향, 그리고 전반적인 경제 전망 등을 고려해야 합니다. 투자자들은 투자 결정을 내리기 전에 철저한 연구와 분석을 진행하거나 재무 자문가와 상담하는 것이 권장됩니다.

Q2에 대한 답변
제공된 정보는 Elon Musk가 천재인지에 대한 직접적인 의견을 제공하지 않습니다. 연례 보고서는 Elon Musk가 Tesla의 Technoking이자 최고 경영자로서의 역할과 그가 다른 기술 기업에 참여한 사실을 개요로 제공합니다. 이는 그의 중요한 책임과 만약 그가 주식을 판매하거나 그의 서비스가 더 이상 사용 불가능해질 경우 Tesla에 미치는 잠재적인 영향을 강조합니다. 그러나 보고서는 Elon Musk가 천재인지에 대한 명확한 평가를 제공하지 않습니다.

Q3에 대한 답변
2023년 매출은 967.7억 달러였습니다.
```

임렬한 답변입니다. 다음 기사에서는 다양한 RAG 파이프라인을 평가하여 RAG 모델 구축, 평가 및 모니터링의 완전한 프로세스를 보여줄 것입니다.

본 기사가 도움이 되었다면 5회 이상 클랩을 주시기 바랍니다. 제가 향후 내용을 꾸준히 공유할 Medium 팔로우도 부탁드립니다. 이 기사를 공유하고 의견을 남겨주시기 바랍니다.

<div class="content-ad"></div>

# 참고자료

Github 링크