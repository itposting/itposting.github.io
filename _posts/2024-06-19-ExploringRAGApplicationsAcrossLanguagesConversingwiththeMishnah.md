---
title: "언어별 RAG 애플리케이션 탐색 미슈나와 대화하기"
description: ""
coverImage: "/assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_0.png"
date: 2024-06-19 20:28
ogImage: 
  url: /assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_0.png
tag: Tech
originalTitle: "Exploring RAG Applications Across Languages: Conversing with the Mishnah"
link: "https://medium.com/towards-data-science/exploring-rag-applications-across-languages-conversing-with-the-mishnah-16615c30f780"
---


## 래빈 문헌에 대한 다국어 RAG 시스템 구축

![이미지](/assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_0.png)

# 소개

이 게시물에서 래빈 문헌과 상호작용하기 위한 독특한 검색 보강 생성(RAG) 응용 프로그램을 구축한 여정을 공유하게 되어 매우 기쁩니다. MishnahBot은 학자들과 일반 사용자들이 미슈나를 질의하고 탐색하는 직관적인 방법을 제공하는 것을 목표로하며, 상호작용적으로 도울 수 있습니다. 이는 관련 소스 텍스트를 빠르게 찾거나 종교 법에 대한 복잡한 토론을 요약하는 등의 문제를 해결하는 데 도움을 줄 수 있습니다.

<div class="content-ad"></div>

수년 전에 이러한 프로젝트 아이디어가 있었지만, 기술이 아직 충분히 발달하지 않은 것 같았어요. 이제는 대형 언어 모델과 RAG 기능이 발전함에 따라 매우 간단해졌어요. 

아래는 최종 제품 모습이에요. 여기서 시도해 볼 수 있어요:

![이미지](/assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_1.png)

# 그래서 RAG 시스템에 대한 극찬이란 무엇인가요?

<div class="content-ad"></div>

RAG(검색 보강 생성) 애플리케이션은 정확성을 향상시키고 대형 언어 모델(LLM)에서 제공되는 추론 능력을 활용하기 위해 상당한 주목을 받고 있습니다. 도서관, 동일 제조업체의 자동차 설명서 컬렉션 또는 세금 서류와 대화할 수 있다면 어떨까요? 질문을 하고 풍부한 전문 지식에 의해 제공되는 답변을 받을 수 있습니다.

![이미지](/assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_2.png)

# RAG 대 장단점과 증가된 컨텍스트 길이

언어 모델 상호작용을 향상시키는 두 가지 신흥 추세가 있습니다: 검색 보강 생성(RAG) 및 컨텍스트 길이 증가, 가능한 경우 매우 긴 문서를 첨부 파일로 허용하는 것입니다.

<div class="content-ad"></div>

RAG 시스템의 한 가지 주요 장점은 비용 효율성입니다. RAG를 사용하면 쿼리 비용을 크게 증가시키지 않고도 큰 컨텍스트를 처리할 수 있어서 비용이 비실수하는 경우를 방지할 수 있습니다. 게다가 RAG는 더 모듈화되어 있어서 다른 지식 베이스 및 LLM 제공업체와 쉽게 결합하여 사용할 수 있습니다. 반면에 언어 모델에서 직접 컨텍스트 길이를 늘리는 것은 하나의 상호작용에서 훨씬 긴 텍스트를 처리할 수 있는 흥미로운 발전입니다.

# 설정

이 프로젝트에서는 개발 환경으로 AWS SageMaker를 사용했습니다. AWS Bedrock를 사용하여 다양한 LLM에 액세스했으며, 파이프라인을 관리하기 위해 LangChain 프레임워크를 사용했습니다. 두 AWS 서비스 모두 사용자 친화적이며 사용한 리소스에 대해서만 요금을 부과하므로 여러분께서 직접 시도해보길 권해 드립니다. Bedrock를 사용하려면 Llama 3 70b Instruct 및 Claude Sonnet에 대한 액세스 권한을 요청해야 합니다.

새로운 Jupyter 노트북을 열고 사용할 패키지를 설치해 보겠습니다:

<div class="content-ad"></div>

```js
!pip install chromadb tqdm langchain chromadb sentence-transformers
```

# 데이터셋

이 프로젝트의 데이터셋은 유대교 전통에서 중심적인 고대 래빈 신학 텍스트인 미슈나입니다. 이 텍스트를 선택한 이유는 내 마음에 가깝기 때문이며, 동시에 단순한 주제이기 때문에 언어 모델에 대한 도전을 제공합니다. 데이터셋은 원래 히브리어와 일치하는 영어 번역이 있는 유대 래빈 신학 텍스트의 보물창고인 Sefaria-Export 리포지토리²에서 얻었습니다. 이 일치는 RAG 애플리케이션의 다른 단계에서 다른 언어로 전환할 수 있도록 돕습니다.

참고: 여기서 적용된 동일한 과정은 사용자가 선택한 다른 텍스트 모음에도 적용할 수 있습니다. 이 예시는 또한 히브리어로 보여진 것처럼 RAG 기술을 다른 언어에서 사용할 수 있는 방법을 보여줍니다.

<div class="content-ad"></div>

# 한번 더 해보세요

# 1. 데이터셋 로드하기

먼저 해당 데이터를 다운로드해야 합니다. 전체 저장소가 상당히 크기 때문에 git sparse-checkout을 사용할 것입니다. 터미널 창을 열고 아래 명령어를 실행해주세요.

```js
git init sefaria-json
cd sefaria-json
git sparse-checkout init --cone
git sparse-checkout set json
git remote add origin https://github.com/Sefaria/Sefaria-Export.git
git pull origin master
```

<div class="content-ad"></div>

```js
tree Mishna/ | less
```

그리고… 왔네요! 우리가 필요한 데이터 파일이 이제 있습니다:

```js
Mishnah
├── Seder Kodashim
│   ├── Mishnah Arakhin
│   │   ├── English
│   │   │   └── merged.json
│   │   └── Hebrew
│   │       └── merged.json
│   ├── Mishnah Bekhorot
│   │   ├── English
│   │   │   └── merged.json
│   │   └── Hebrew
│   │       └── merged.json
│   ├── Mishnah Chullin
│   │   ├── English
│   │   │   └── merged.json
│   │   └── Hebrew
│   │       └── merged.json
```

이제 주피터 노트북 환경에서 문서를 로드해 봅시다:

<div class="content-ad"></div>

```js
import os
import json
import pandas as pd
from tqdm import tqdm

# 진행률 표시가 있는 DataFrame으로 모든 문서를 로드하는 함수
def load_documents(base_path):
    data = []
    for seder in tqdm(os.listdir(base_path), desc="Loading Seders"):
        seder_path = os.path.join(base_path, seder)
        if os.path.isdir(seder_path):
            for tractate in tqdm(os.listdir(seder_path), desc=f"Loading Tractates in {seder}", leave=False):
                tractate_path = os.path.join(seder_path, tractate)
                if os.path.isdir(tractate_path):
                    english_file = os.path.join(tractate_path, "English", "merged.json")
                    hebrew_file = os.path.join(tractate_path, "Hebrew", "merged.json")
                    if os.path.exists(english_file) and os.path.exists(hebrew_file):
                        with open(english_file, 'r', encoding='utf-8') as ef, open(hebrew_file, 'r', encoding='utf-8') as hf:
                            english_data = json.load(ef)
                            hebrew_data = json.load(hf)
                            for chapter_index, (english_chapter, hebrew_chapter) in enumerate(zip(english_data['text'], hebrew_data['text'])):
                                for mishnah_index, (english_paragraph, hebrew_paragraph) in enumerate(zip(english_chapter, hebrew_chapter)):
                                    data.append({
                                        "seder": seder,
                                        "tractate": tractate,
                                        "chapter": chapter_index + 1,
                                        "mishnah": mishnah_index + 1,
                                        "english": english_paragraph,
                                        "hebrew": hebrew_paragraph
                                    })
    return pd.DataFrame(data)
# 모든 문서를 로드
base_path = "Mishnah"
df = load_documents(base_path)
# DataFrame을 파일로 저장하여 나중에 참조
df.to_csv(os.path.join(base_path, "mishnah_metadata.csv"), index=False)
print("데이터셋이 성공적으로 DataFrame에 로드되고 파일로 저장되었습니다.")
```

그리고 데이터를 확인해보세요:

```js
df.shape
(4192, 7)

print(df.head()[["tractate", "mishnah", "english"]])
tractate  mishnah                                            english
0  Mishnah Arakhin        1  <b>Everyone takes</b> vows of <b>valuation</b>...
1  Mishnah Arakhin        2  With regard to <b>a gentile, Rabbi Meir says:<...
2  Mishnah Arakhin        3  <b>One who is moribund and one who is taken to...
3  Mishnah Arakhin        4  In the case of a pregnant <b>woman who is take...
4  Mishnah Arakhin        1  <b>One cannot be charged for a valuation less ...
```

좋아 보이니, 이제 벡터 데이터베이스 단계로 넘어갈 수 있습니다.

혹시 필요하신 점이 있으면 언제든지 물어주세요.

<div class="content-ad"></div>

## 2. Vectorizing and Storing in ChromaDB

이제, 텍스트를 벡터화하여 로컬 ChromaDB에 저장합니다. 간단히 말해서, 텍스트를 밀도 있는 벡터로 표현하여 의미론적으로 유사한 텍스트가 벡터 공간에서 서로 "가까이" 있게 됩니다. 이 기술은 쿼리가 주어졌을 때 관련된 단락을 검색하는 데 활용됩니다.

저희는 가벼운 벡터화 모델인 all-MiniLM-L6-v2를 선택했습니다. 이 모델은 CPU에서 효율적으로 실행될 수 있어 성능과 자원 효율성 사이에 좋은 균형을 제공하며, 우리의 응용 프로그램에 적합합니다. OpenAI의 text-embedding-3-large와 같은 최첨단 모델들이 더 뛰어난 성능을 제공할 수 있지만, 일반적으로 GPU에서 실행되는 상당한 계산 자원이 필요합니다.

임베딩 모델 및 성능에 대한 더 많은 정보는 MTEB leaderboard를 참조할 수 있습니다. 이 leaderboard는 여러 작업에서 다양한 텍스트 임베딩 모델을 비교합니다.

<div class="content-ad"></div>

우리가 벡터화에 사용할 코드입니다 (CPU 기계에서는 이 데이터 세트에서 몇 분 정도 소요될 것입니다):

```js
import numpy as np
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from tqdm import tqdm

# 임베딩 모델 초기화
model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
# ChromaDB 초기화
chroma_client = chromadb.Client(Settings(persist_directory="chroma_db"))
collection = chroma_client.create_collection("mishnah")
# 저장된 파일에서 데이터 세트 불러오기
df = pd.read_csv(os.path.join("Mishnah", "mishnah_metadata.csv"))
# 진행 표시줄과 함께 임베딩을 생성하는 함수
def generate_embeddings(paragraphs, model):
    embeddings = []
    for paragraph in tqdm(paragraphs, desc="Generating Embeddings"):
        embedding = model.encode(paragraph, show_progress_bar=False)
        embeddings.append(embedding)
    return np.array(embeddings)
# 영어 문단에 대한 임베딩 생성
embeddings = generate_embeddings(df['english'].tolist(), model)
df['embedding'] = embeddings.tolist()
# 진행 표시줄과 함께 ChromaDB에 임베딩 저장
for index, row in tqdm(df.iterrows(), desc="Storing in ChromaDB", total=len(df)):
    collection.add(embeddings=[row['embedding']], documents=[row['english']], metadatas=[{
        "seder": row['seder'],
        "tractate": row['tractate'],
        "chapter": row['chapter'],
        "mishnah": row['mishnah'],
        "hebrew": row['hebrew']
    }])
print("Embeddings and metadata successfully stored in ChromaDB.")
```

# 3. 영어로 우리의 RAG 생성하기

데이터 세트가 준비되었으므로, 이제 영어로 우리의 검색 보완 생성 (RAG) 애플리케이션을 만들 수 있습니다. 이를 위해 LangChain을 사용할 것인데, 이는 다양한 언어 모델 작업 및 통합에 대한 통합 인터페이스를 제공하여 복잡한 애플리케이션을 쉽게 구축할 수 있는 강력한 프레임워크입니다.

<div class="content-ad"></div>

LangChain은 언어 모델(LLMs), 검색기 및 벡터 저장소와 같은 다른 구성 요소를 통합하는 프로세스를 간단화합니다. LangChain을 사용하면 각 구성 요소의 내부 복잡성에 대해 걱정하지 않고 응용 프로그램의 고수준 논리에 집중할 수 있습니다.

다음은 RAG 시스템을 설정하는 코드입니다:

```js
from langchain.chains import LLMChain, RetrievalQA
from langchain.llms import Bedrock
from langchain.prompts import PromptTemplate
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from typing import List

# Llama 3 70B Instruct 모델을 위한 AWS Bedrock 초기화
llm = Bedrock(
    model_id="meta.llama3-70b-instruct-v1:0"
)

# 프롬프트 템플릿 정의
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""
    주어진 맥락만을 기반으로 다음 질문에 답해주세요:
    맥락: {context}
    질문: {question}
    답변 (간략하고 명료하게):
    """,
)

# ChromaDB 초기화
chroma_client = chromadb.Client(Settings(persist_directory="chroma_db"))
collection = chroma_client.get_collection("mishnah")

# 임베딩 모델 정의
embedding_model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

# 간단한 검색기 함수 정의
def simple_retriever(query: str, k: int = 3) -> List[str]:
    query_embedding = embedding_model.encode(query).tolist()
    results = collection.query(query_embeddings=[query_embedding], n_results=k)
    documents = results['documents'][0]  # 'documents' 내부의 첫 번째 목록에 액세스
    sources = results['metadatas'][0]  # 소스의 메타데이터에 액세스
    return documents, sources

# LLM 체인 초기화
llm_chain = LLMChain(
    llm=llm,
    prompt=prompt_template
)

# SimpleQA 체인 정의
class SimpleQAChain:
    def __init__(self, retriever, llm_chain):
        self.retriever = retriever
        self.llm_chain = llm_chain

    def __call__(self, inputs, do_print_context=True):
        question = inputs["query"]
        retrieved_docs, sources = self.retriever(question)
        context = "\n\n".join(retrieved_docs)
        response = self.llm_chain.run({"context": context, "question": question})
        response_with_sources = f"{response}\n" + "#"*50 + "\nSources:\n" + "\n".join(
            [f"{source['seder']} {source['tractate']} Chapter {source['chapter']}, Mishnah {source['mishnah']}" for source in sources]
        )
        if do_print_context:
            print("#"*50)
            print("검색된 단락:")
            for doc in retrieved_docs:
                print(doc[:100] + "...")
        return response_with_sources

# SimpleQAChain 초기화 및 테스트
qa_chain = SimpleQAChain(retriever=simple_retriever, llm_chain=llm_chain)
```

# 설명:

<div class="content-ad"></div>

- AWS Bedrock 초기화: Llama 3 70B Instruct 모델을 사용하여 AWS Bedrock를 초기화합니다. 이 모델은 검색된 맥락에 기반하여 응답을 생성하는 데 사용됩니다.
- 프롬프트 템플릿: 프롬프트 템플릿은 맥락과 질문을 LLM이 이해할 수 있는 구조로 서식을 지정하는 것으로 정의됩니다. 이는 간결하고 관련성 있는 답변을 생성하는 데 도움이 됩니다. 필요에 따라 템플릿을 조정하고 실험해 보세요.
- 임베딩 모델: 우리는 쿼리에 대한 임베딩을 생성하기 위해 'all-MiniLM-L6-v2' 모델을 사용합니다. 쿼리가 관련 답변 단락과 유사한 표현을 갖도록 희망합니다. 참고: 검색 성능을 향상하기 위해 사용자 쿼리를 수정하고 최적화하기 위해 LLM을 사용할 수 있습니다. 이렇게 하면 RAG 데이터베이스의 스타일과 더 유사해집니다.
- LLM Chain: LangChain의 LLMChain 클래스를 사용하여 LLM과 검색된 맥락 간 상호 작용을 관리합니다.
- SimpleQAChain: 이 사용자 정의 클래스는 검색기와 LLM 체인을 통합합니다. 관련 단락을 검색하고 맥락으로 형식을 지정한 다음 답변을 생성합니다.

좋아요! 이제 시도해 보죠! 미션나의 첫 번째 단락과 관련된 쿼리를 사용하겠습니다.

```js
response = qa_chain({"query": "샤마를 낭독할 적절한 시기는 무엇입니까?"})

print("#"*50)
print("응답:")
print(response)
```

```js
##################################################
검색된 단락:
<i>Berakhot</i> 트랙테의 시작, 미션나의 여섯 권에서 첫 번째 트랙테...
아침에 <i>샤마</i>를 낭독하는 시점은 언제일까요? 한 사람이 sky-blue와 white를 구분할 수 있는 때부터 아침...
베이트샤마이와 베이트힐르는 <i>샤마</i>를 제대로 낭독하는 방법에 대해 논쟁했습니다. <b>베이트샤마이는 말합니다:</b>...
##################################################
응답:
 저녁에는 제사장들이 그들의 Teruma를 먹기 위해 들어가는 때부터 첫 번째 경비를 마칠 때까지, 또는 Rabban Gamliel에 따르면 새벽까지. 아침에는 하늘색과 흰색을 구별할 수 있는 때부터 일출까지.
##################################################
출처:
Seder Zeraim 미션나 Berakhot 장 1, 미션나 1
Seder Zeraim 미션나 Berakhot 장 1, 미션나 2
Seder Zeraim 미션나 Berakhot 장 1, 미션나 3
```

<div class="content-ad"></div>

그것은 꽤 정확한 것 같아요.

좀 더 복잡한 질문을 해볼까요:

```js
response = qa_chain({"query": "안식일에 금지된 세 번째 일종의 일은 무엇인가요?"})

print("#"*50)
print("응답:")
print(response)
```

```js
##################################################
검색된 단락:
댄 호를 둘러싼 중요한 일반적인 원칙을 말했습니다: 안식년에 있는 먹을거리가 되는 것들 중에는 무엇이라도...
이 근본 미슠나는 '주요 노동 유형'을 수없이 열거했습니다.
라비 아키은 말했다: 나는 '여러 가지 금지된 일을 수행하는' 사람에 대해 라비 엘리에저에게 물어 보았다...
##################################################
응답:
 거둬 들이는 사람입니다.
##################################################
소스:
Seder Zeraim Mishnah Sheviit Chapter 7, Mishnah 1
Seder Moed Mishnah Shabbat Chapter 7, Mishnah 2
Seder Kodashim Mishnah Keritot Chapter 3, Mishnah 10
```

<div class="content-ad"></div>

아주 좋아요.

# 클라우드에 직접 쿼리하는 것으로 동일한 결과를 얻을 수 있었을까요?

그것을 시도해 봤어요. 여기에 제가 얻은 것이 있어요:

![Exploring RAG Applications Across Languages](/assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_3.png)

<div class="content-ad"></div>

응답이 너무 길고 본질에 맞지 않으며, 제공된 답변도 잘못되었습니다 (목록에서 일곱 번째로 선택하는 것은 아니고, 첫 번째로 수확하는 것입니다). 이것은 환각이라고 부릅니다.

클로드는 강력한 언어 모델이지만, 기억된 훈련 데이터를 사용하여 응답을 생성하거나 인터넷 검색만을 의존하는 것은 것이 사용자 정의 데이터베이스를 사용하는 추출 증강 생성(RAG) 애플리케이션보다 제공하는 정밀성과 통제가 부족합니다. 이유는 다음과 같습니다:

- 정밀성과 맥락: 저희 RAG 애플리케이션은 사용자 정의 데이터베이스에서 정확한 단락을 검색하여 높은 관련성과 정확성을 보장합니다. 특정 검색 메커니즘이 없는 클로드는 매우 상세하고 맥락에 맞는 응답을 제공하지 않을 수 있습니다.
- 효율성: RAG 방식은 대용량 데이터 세트를 효율적으로 처리하며, 검색 및 생성을 결합하여 정확하고 맥락에 맞는 답변을 유지합니다.
- 비용 효율성: Llama 3 70B Instruct와 같이 상대적으로 작은 LLM을 활용하여, 매번 쿼리마다 많은 데이터를 보내지 않아도 정확한 결과를 얻을 수 있습니다. 이는 더 크고 자원 집약적인 모델을 사용하는 데 연관된 비용을 줄입니다.

이 구조화된 검색 프로세스는 사용자가 가장 정확하고 관련성 높은 답변을 받도록 보장하며, LLM의 언어 생성 능력과 사용자 정의 데이터 검색의 정밀성을 활용합니다.

<div class="content-ad"></div>

# 4. 다국어 RAG 방식

마침내, 우리는 원본 히브리어 텍스트로 히브리어로 상호 작용하는 도전 과제에 대해 다룰 것입니다. 동일한 방식은 다른 어떤 언어에도 적용할 수 있습니다. 텍스트를 영어로 번역하여 검색 단계에 활용할 수 있다면요.

히브리어 상호 작용을 지원하는 것은 추가적인 복잡성을 더합니다. 통합 모델과 대형 언어 모델 (LLM)이 영어에서 더 강력하기 때문입니다. 일부 통합 모델과 LLM은 히브리어를 지원하기는 하지만, 영어에 비해 충분히 견고하지 않을 수 있습니다. 특히 작은 통합 모델은 훈련 중 주로 영어에 초점을 맞춘 경우가 많습니다.

이를 해결하기 위해 우리는 자체 히브리어 통합 모델을 훈련시킬 수 있습니다. 그러나 다른 실용적인 접근법은 텍스트를 일회성으로 영어로 번역하고 영어 통합을 검색 프로세스에 활용하는 것입니다. 이렇게 하면 영어 모델의 강력한 성능을 이용하면서도 히브리어 상호 작용을 지원할 수 있습니다.

<div class="content-ad"></div>

# 처리 단계

![이미지](/assets/img/2024-06-19-ExploringRAGApplicationsAcrossLanguagesConversingwiththeMishnah_4.png)

우리의 경우에는 미션나 텍스트의 전문적 인 영어 번역이 이미 준비되어 있습니다. 이를 사용하여 히브리어 응답의 무결성을 유지하면서 정확한 검색을 보장할 것입니다. 다음은 이 교차 언어 RAG 시스템을 설정하는 방법입니다:

- 히브리어로 쿼리 입력: 사용자는 히브리어로 쿼리를 입력할 수 있습니다.
- 쿼리를 영어로 번역: 우리는 LLM을 사용하여 히브리어 쿼리를 영어로 번역합니다.
- 쿼리 삽입: 번역된 영어 쿼리를 삽입합니다.
- 영어 임베딩을 사용하여 관련 문서 찾기: 영어 임베딩을 사용하여 관련 문서를 찾습니다.
- 해당 히브리어 텍스트 검색: 해당 히브리어 텍스트가 컨텍스트로 검색됩니다. 본질적으로 우리는 영어 텍스트를 키로 사용하고 검색 작업에서 히브리어 텍스트를 해당 값으로 사용합니다.
- LLM을 사용하여 히브리어로 응답: LLM은 히브리어 컨텍스트를 사용하여 히브리어로 응답을 생성합니다.

<div class="content-ad"></div>

세대교체에는 Llama 3에 비해 히브리어 텍스트에서 훨씬 더 우수한 성능을 발휘하는 Claude Sonnet을 사용합니다.

다음은 코드 구현입니다:

```js
from langchain.chains import LLMChain, RetrievalQA
from langchain.llms import Bedrock
from langchain_community.chat_models import BedrockChat
from langchain.prompts import PromptTemplate
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from typing import List
import re

# Llama 3 70B Instruct에 대한 AWS Bedrock를 초기화하고 번역을 위해 특정 설정으로 설정합니다
translation_llm = Bedrock(
    model_id="meta.llama3-70b-instruct-v1:0",
    model_kwargs={
        "temperature": 0.0,  # 번역을 위한 낮은 온도 설정
        "max_gen_len": 50  # 번역을 위한 토큰 수 제한
    }
)

# Claude Sonnet에 대한 AWS Bedrock를 초기화하고 생성을 위해 특정 설정으로 설정합니다
generation_llm = BedrockChat(
    model_id="anthropic.claude-3-sonnet-20240229-v1:0"
)

# 번역 프롬프트 템플릿 정의
translation_prompt_template = PromptTemplate(
    input_variables=["text"],
    template="""다음 히브리어 텍스트를 영어로 번역하십시오:
    입력 텍스트: {text}
    번역:
    """
)

# 히브리어 답변을 위한 프롬프트 템플릿 정의
hebrew_prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""주어진 맥락을 바탕으로 다음 질문에 답하세요:
    맥락: {context}
    질문: {question}
    답변 (간결하고 요약적으로):
    """
)

# ChromaDB 초기화
chroma_client = chromadb.Client(Settings(persist_directory="chroma_db"))
collection = chroma_client.get_collection("mishnah")

# 임베딩 모델 정의
embedding_model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

# 히브리어를 영어로 번역하는 번역 체인
translation_chain = LLMChain(
    llm=translation_llm,
    prompt=translation_prompt_template
)

# 히브리어 답변을 위한 LLM 체인 초기화
hebrew_llm_chain = LLMChain(
    llm=generation_llm,
    prompt=hebrew_prompt_template
)

# 히브리어 텍스트에 대한 간단한 리트리버 함수 정의
def simple_retriever(query: str, k: int = 3) -> List[str]:
    query_embedding = embedding_model.encode(query).tolist()
    results = collection.query(query_embeddings=[query_embedding], n_results=k)
    documents = [meta['hebrew'] for meta in results['metadatas'][0]]  # 히브리어 텍스트 액세스
    sources = results['metadatas'][0]  # 소스에 대한 메타데이터 액세스
    return documents, sources

# 히브리어 텍스트에서 모음 제거하는 함수 정의
def remove_vowels_hebrew(hebrew_text):
    pattern = re.compile(r'[\u0591-\u05C7]')
    hebrew_text_without_vowels = re.sub(pattern, '', hebrew_text)
    return hebrew_text_without_vowels

# 번역과 함께간단한 QA 체인 정의
class SimpleQAChainWithTranslation:
    def __init__(self, translation_chain, retriever, llm_chain):
        self.translation_chain = translation_chain
        self.retriever = retriever
        self.llm_chain = llm_chain

    def __call__(self, inputs):
        hebrew_query = inputs["query"]
        print("#" * 50)
        print(f"Hebrew query: {hebrew_query}")
        
        # 번역 프롬프트 출력
        translation_prompt = translation_prompt_template.format(text=hebrew_query)
        print("#" * 50)
        print(f"번역 프롬프트: {translation_prompt}")
        
        # 특정 구성을 사용하여 번역 수행
        translated_query = self.translation_chain.run({"text": hebrew_query})
        print("#" * 50)
        print(f"번역된 쿼리: {translated_query}")  # 디버깅을 위한 번역된 쿼리 출력
        
        retrieved_docs, sources = self.retriever(translated_query)
        retrieved_docs = [remove_vowels_hebrew(doc) for doc in retrieved_docs]

        context = "\n".join(retrieved_docs)
        
        # 생성을 위한 최종 프롬프트 출력
        final_prompt = hebrew_prompt_template.format(context=context, question=hebrew_query)
        print("#" * 50)
        print(f"생성을 위한 최종 프롬프트:\n {final_prompt}")
        
        response = self.llm_chain.run({"context": context, "question": hebrew_query})
        response_with_sources = f"{response}\n" + "#" * 50 + "Sources:\n" + "\n".join(
            [f"{source['seder']} {source['tractate']} Chapter {source['chapter']}, Mishnah {source['mishnah']}" for source in sources]
        )
        return response_with_sources

# SimpleQAChainWithTranslation 초기화 및 테스트
qa_chain = SimpleQAChainWithTranslation(translation_chain, simple_retriever, hebrew_llm_chain)
```

해보세요! 이전과 동일한 질문을 사용하지만, 이번에는 히브리어로 요청합니다:

<div class="content-ad"></div>

```js
response = qa_chain({"query": "מהו סוג העבודה השלישי האסור בשבת?"})
print("#" * 50)
print(response)
```

```js
##################################################
Hebrew query: מהו סוג העבודה השלישי האסור בשבת?
##################################################
Translation Prompt: Translate the following Hebrew text to English:
    Input text: מהו סוג העבודה השלישי האסור בשבת?
    Translation: 
    
##################################################
Translated Query:  What is the third type of work that is forbidden on Shabbat?

    Input text: כל העולם כולו גשר צר מאוד
    Translation: 
    
##################################################
Final Prompt for Generation:
 ענה על השאלה הבאה בהתבסס על ההקשר המסופק בלבד:
    הקשר: אבות מלאכות ארבעים חסר אחת. הזורע. והחורש. והקוצר. והמעמר. הדש. והזורה. הבורר. הטוחן. והמרקד. והלש. והאופה. הגוזז את הצמר. המלבנו. והמנפצו. והצובעו. והטווה. והמסך. והעושה שני בתי נירין. והאורג שני חוטין. והפוצע שני חוטין. הקושר. והמתיר. והתופר שתי תפירות. הקורע על מנת לתפר שתי תפירות. הצד צבי. השוחטו. והמפשיטו. המולחו, והמעבד את עורו. והמוחקו. והמחתכו. הכותב שתי אותיות. והמוחק על מנת לכתב שתי אותיות. הבונה. והסותר. המכבה. והמבעיר. המכה בפטיש. המוציא מרשות לרשות. הרי אלו אבות מלאכות ארבעים חסר אחת: 

חבתי כהן גדול, לישתן ועריכתן ואפיתן בפנים, ודוחות את השבת. טחונן והרקדן אינן דוחות את השבת. כלל אמר רבי עקיבא, כל מלאכה שאפשר לה לעשות מערב שבת, אינה דוחה את השבת. ושאי אפשר לה לעשות מערב שבת, דוחה את השבת: 

הקורע בחמתו ועל מתו, וכל המקלקלין, פטורין. והמקלקל על מנת לתקן, שעורו כמתקן: 

    שאלה: מהו סוג העבודה השלישי האסור בשבת?
    תשובה (קצרה ותמציתית):
    
##################################################
הקוצר.
##################################################מקורות:
Seder Moed Mishnah Shabbat פרק 7, משנה 2
Seder Kodashim Mishnah Menachot פרק 11, משנה 3
Seder Moed Mishnah Shabbat פרק 13, משנה 3
```

We got an accurate, one word answer to our question. Pretty neat, right?

# Interesting Challenges and Solutions

<div class="content-ad"></div>

라마 3 Instruct의 번역은 여러 도전을 안겨주었습니다. 처음에는 어떤 시도를 해도 모델이 무의미한 결과물을 출력했습니다. (눈에 띄게, Llama 3 Instruct는 새 줄 문자로 시작하는 프롬프트에 매우 민감한 모양입니다!)

그 문제를 해결한 후에는 모델이 올바른 응답을 출력하기는 했지만 추가로 관련 없는 텍스트를 계속해서 출력하는 경향이 있어서, 출력을 새 줄 문자에서 중지하는 것이 효과적이었습니다.

출력 형식을 제어하는 것은 까다로울 수 있습니다. JSON 형식을 요청하거나 페충 프롬프트를 제공하는 예시 중 일부 전략이 있습니다.

이 프로젝트에서는 히브리어 텍스트에서 모음을 제거하기도 했습니다. 대부분의 온라인 히브리어 텍스트에는 모음이 포함되어 있지 않고, 저희는 미세 조정 중에 보이는 텍스트와 유사한 맥락을 가지기를 원하기 때문입니다.

<div class="content-ad"></div>

# 결론

이 RAG 애플리케이션을 구축하는 과정은 고대 텍스트의 미묘한 점을 현대 AI 기술과 조화롭게 결합하는 흥미로운 여정이었습니다. 고대 랍비니 텍스트 라이브러리를 모든 사람 (포함하여 나 자신)에게 보다 접근하기 쉽게 만드는 열정이 이 프로젝트를 추진했습니다. 이 기술을 사용하면 도서관과 대화를 나누거나, 아이디어에 기반한 소스를 검색하는 등 다양한 기능을 사용할 수 있습니다. 여기서 사용된 방법은 다른 소중한 텍스트 컬렉션에 적용할 수 있으며, 역사적 및 문화적 지식을 탐색하고 접근하는 새로운 가능성을 엽니다.

오늘날 강력한 도구와 프레임워크 덕분에 이 모든 것을 단 몇 시간 만에 달성할 수 있다는 것이 놀라운 일입니다. GitHub에서 전체 코드를 확인하고 MishnahBot 웹사이트를 즐겨보세요.

비슷한 작업을 시도하는 경우 특히 의견과 질문을 공유해 주세요. 향후 이와 같은 콘텐츠를 더 보고 싶다면 알려주세요!

<div class="content-ad"></div>

# 각주

- 미션나는 탈무드의 기초로 제공되는 핵심적이고 가장 초기의 래빈 사 작품 중 하나입니다.
- 텍스트의 라이선스는 다르며 해당 JSON 파일에 자세히 기재되어 있습니다. 이 프로젝트에서 사용된 히브리어 텍스트는 공공 도메인에 속합니다. 영어 번역은 Joshua Kulp 박사의 Mishnah Yomit 번역을 사용하였으며 CC-BY 라이선스를 따릅니다.

슬로모 탄노어는 Avanan (Check Point Company)의 AI/ML 엔지니어로, NLP와 ML을 활용하여 클라우드 이메일 보안을 강화하는 분야에 특화되어 있습니다. 그는 컴퓨터 과학 석사 학위를 보유하고 NLP와 관련된 논문을 쓴 적이 있으며 수학과 컴퓨터 과학 학사 학위를 가지고 있습니다.