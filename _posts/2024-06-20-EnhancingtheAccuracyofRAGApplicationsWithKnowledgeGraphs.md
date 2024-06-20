---
title: "지식 그래프로 RAG 어플리케이션의 정확성 향상하기"
description: ""
coverImage: "/assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_0.png"
date: 2024-06-20 18:36
ogImage: 
  url: /assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_0.png
tag: Tech
originalTitle: "Enhancing the Accuracy of RAG Applications With Knowledge Graphs"
link: "https://medium.com/neo4j/enhancing-the-accuracy-of-rag-applications-with-knowledge-graphs-ad5e2ffab663"
---


## 네오포스트 및 LangChain을 사용하여 RAG 애플리케이션에서 지식 그래프를 구축하고 정보를 검색하는 실용적 가이드

![Enhancing the Accuracy of RAG Applications With Knowledge Graphs](/assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_0.png)

그래프 검색 보강 생성 (GraphRAG)은 전통적인 벡터 검색 검색 방법에 강력한 보충으로 인기를 얻고 있습니다. 이 접근 방식은 그래프 데이터베이스의 구조화된 성격을 활용하여 데이터를 노드와 관계로 구성함으로써 회수된 정보의 깊이와 맥락을 향상시킵니다.

![Enhancing the Accuracy of RAG Applications With Knowledge Graphs](/assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_1.png)

<div class="content-ad"></div>

그래프는 다양하고 서로 연결된 정보를 체계적으로 표현하고 저장하는 데 탁월합니다. 복잡한 관계와 속성을 다양한 데이터 유형에 걸쳐 손쉽게 캡처할 수 있습니다. 반면에 벡터 데이터베이스는 고차원 벡터를 통해 비구조화된 데이터를 처리하는 데 강점을 가지고 있어서 구조화된 정보에 어려움을 겪을 수 있습니다. RAG 애플리케이션에서는 구조화된 그래프 데이터와 비구조화된 텍스트를 통한 벡터 검색을 결합하여 양쪽의 장점을 모두 활용할 수 있습니다. 이것이 이 블로그 포스트에서 증명할 내용입니다.

## 지식 그래프가 훌륭하지만, 그것을 어떻게 만들까요?

지식 그래프를 구축하는 것은 보통 가장 어려운 단계입니다. 이 작업에는 데이터 수집과 구조화가 필요하며, 해당 도메인과 그래프 모델링에 대한 심층적인 이해가 필요합니다.

이 프로세스를 간소화하기 위해 우리는 LLM(Large Language Models)을 실험해오고 있습니다. 언어와 맥락에 대한 깊은 이해력을 갖춘 LLM은 지식 그래프 생성 프로세스의 중요한 부분을 자동화할 수 있습니다. 이 모델들은 텍스트 데이터를 분석하여 엔티티를 식별하고, 그들의 관계를 이해하며, 어떻게 그들을 최상의 그래프 구조로 표현할 지 제안할 수 있습니다.

<div class="content-ad"></div>

이러한 실험의 결과로 LangChain에 그래프 구성 모듈의 첫 번째 버전을 추가했습니다. 이 블로그 게시물에서 이를 시연할 예정입니다.

해당 코드는 GitHub에서 확인할 수 있습니다.

## Neo4j 환경 설정

Neo4j 인스턴스를 설정해야 합니다. 이 블로그 게시물의 예제를 따라 진행하십시오. 가장 쉬운 방법은 Neo4j Aura에서 무료 인스턴스를 시작하는 것입니다. 이는 Neo4j 데이터베이스의 클라우드 인스턴스를 제공합니다. 다른 방법으로는 Neo4j 데스크톱 애플리케이션을 다운로드하고 로컬 데이터베이스 인스턴스를 생성하여 로컬 Neo4j 데이터베이스를 설정할 수도 있습니다.

<div class="content-ad"></div>

```js
os.environ["OPENAI_API_KEY"] = "sk-"
os.environ["NEO4J_URI"] = "bolt://localhost:7687"
os.environ["NEO4J_USERNAME"] = "neo4j"
os.environ["NEO4J_PASSWORD"] = "password"

graph = Neo4jGraph()
```

또한, 이 블로그 게시물에서 OpenAI 모델을 사용할 예정이므로 OpenAI 키를 제공해야 합니다.

# 데이터 수집

이 데모에서는 엘리자베스 1세의 위키백과 페이지를 사용할 것입니다. LangChain 로더를 사용하여 위키백과 문서를 손쉽게 가져와 분할할 수 있습니다.

<div class="content-ad"></div>

```js
# 위키백과 항목 읽기
raw_documents = WikipediaLoader(query="Elizabeth I").load()
# 청킹 전략 정의
text_splitter = TokenTextSplitter(chunk_size=512, chunk_overlap=24)
documents = text_splitter.split_documents(raw_documents[:3)
```

이제 검색된 문서를 기반으로 그래프를 구성할 시간입니다. 이를 위해 그래프 데이터베이스에 지식 그래프를 구축하고 저장하는 데 큰 도움이 되는 LLMGraphTransformermodule을 구현했습니다.

```js
llm=ChatOpenAI(temperature=0, model_name="gpt-4-0125-preview")
llm_transformer = LLMGraphTransformer(llm=llm)

# 그래프 데이터 추출
graph_documents = llm_transformer.convert_to_graph_documents(documents)
# Neo4j에 저장
graph.add_graph_documents(
  graph_documents, 
  baseEntityLabel=True, 
  include_source=True
)
```

지식 그래프 생성 체인이 사용할 LLM을 정의할 수 있습니다. 현재 OpenAI 및 Mistral에서 함수 호출 모델만 지원하고 있지만, 향후 LLM 선택을 확장할 계획입니다. 이 예시에서는 최신 GPT-4을 사용합니다. 생성된 그래프의 품질은 사용하는 모델에 크게 의존하는 것을 주의해야 합니다. 이론적으로는 항상 능력 있는 모델을 사용하는 것이 좋습니다. LLM 그래프 트랜스포머는 그래프 문서를 반환하며, 이를 add_graph_documents 메서드를 통해 Neo4j로 가져올 수 있습니다. baseEntityLabel 매개변수는 각 노드에 추가적인 __Entity__ 라벨을 할당하여 색인화 및 쿼리 성능을 향상시킵니다. include_source 매개변수는 노드를 원본 문서에 연결하여 데이터 추적 및 문맥 이해를 용이하게 합니다.


<div class="content-ad"></div>

네오4j 브라우저에서 생성된 그래프를 확인할 수 있습니다.

![그래프](/assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_2.png)

이 이미지는 생성된 그래프의 일부분을 나타냅니다.

# RAG를 위한 혼합 검색

<div class="content-ad"></div>

그래프 생성 후, 우리는 RAG 애플리케이션을 위한 벡터 및 키워드 색인과 그래프 검색을 결합한 하이브리드 검색 접근 방식을 사용할 것입니다.

![이미지](/assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_3.png)

이 다이어그램은 사용자가 질문을 제기하면 RAG 검색기로 이어지는 검색 프로세스를 보여줍니다. 이 검색기는 키워드 및 벡터 검색을 사용하여 구조화되지 않은 텍스트 데이터를 검색하고 이를 지식 그래프에서 수집한 정보와 결합합니다. Neo4j는 키워드 및 벡터 색인이 모두 있는 기능을 제공하기 때문에 단일 데이터베이스 시스템으로 세 가지 검색 옵션을 구현할 수 있습니다. 이러한 소스에서 수집된 데이터는 LLM(언어 모델)에 공급되어 최종 답변을 생성하고 전달합니다.

## 구조화되지 않은 데이터 검색기

<div class="content-ad"></div>

"Neo4jVector.from_existing_graph" 메서드를 사용하여 문서에 키워드 및 벡터 검색을 추가할 수 있어요. 이 방법은 "Document"로 레이블이 지정된 노드를 대상으로 하는 하이브리드 검색 접근 방식을 위해 키워드 및 벡터 검색 인덱스를 구성합니다. 또한, 누락된 경우 텍스트 임베딩 값을 계산합니다.

```js
vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    search_type="hybrid",
    node_label="Document",
    text_node_properties=["text"],
    embedding_node_property="embedding"
)
```

그런 다음에 유사성 검색 방법을 사용하여 벡터 인덱스를 호출할 수 있어요.

## Graph Retriever"

<div class="content-ad"></div>

한편, 그래프 검색을 구성하는 것은 좀 더 복잡하지만 더 많은 자유를 제공합니다. 이 예제에서는 전체 텍스트 색인을 사용하여 관련 노드를 식별하고 해당 직접 이웃들을 반환할 것입니다.

![image](/assets/img/2024-06-20-EnhancingtheAccuracyofRAGApplicationsWithKnowledgeGraphs_4.png)

그래프 검색기는 입력에서 관련 엔티티를 식별하여 시작합니다. 단순화를 위해, 우리는 LLM에 개인, 조직 및 위치를 식별하도록 지시합니다. 이를 달성하기 위해 새롭게 추가된 with_structured_output 방법을 사용한 LCEL을 사용할 것입니다.

```js
# 텍스트에서 엔터티 추출
class Entities(BaseModel):
    """엔터티에 대한 정보 식별."""

    names: List[str] = Field(
        ...,
        description="텍스트에 나타나는 모든 사람, 조직 또는 비즈니스 엔터티들",
    )

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "시스템",
            "텍스트에서 조직 및 개인 엔터티를 추출 중입니다.",
        ),
        (
            "사용자",
            "다음 입력에서 정보를 추출하기 위해 주어진 형식을 사용하세요: {질문}",
        ),
    ]
)

entity_chain = prompt | llm.with_structured_output(Entities)
```

<div class="content-ad"></div>

테스트해 봅시다:

```js
entity_chain.invoke({"question": "Amelia Earhart가 어디에서 태어났나요?"}).names
# ['Amelia Earhart']
```

좋아요, 이제 질문에서 엔티티를 감지할 수 있게 되었으니, 전체 텍스트 인덱스를 사용하여 그들을 지식 그래프에 매핑해 봅시다. 먼저, 전체 텍스트 인덱스를 정의하고 약간의 철자 오류를 허용하는 전체 텍스트 쿼리를 생성하는 함수를 만들어야 합니다. 이 과정에 대해서는 자세히 다루지 않겠습니다.

```js
graph.query(
    "CREATE FULLTEXT INDEX entity IF NOT EXISTS FOR (e:__Entity__) ON EACH [e.id]")

def generate_full_text_query(input: str) -> str:
    """
    주어진 입력 문자열에 대한 전체 텍스트 검색 쿼리를 생성합니다.

    이 함수는 전체 텍스트 검색에 적합한 쿼리 문자열을 생성합니다.
    입력 문자열을 단어로 분할하고 각 단어에 유사성 임계값(~2개의 변경된 문자)을 추가한 후, AND 연산자를 사용하여 결합합니다.
    사용자 질문에서 엔티티를 데이터베이스 값에 매핑하는 데 유용하며, 일부 철자 오류를 허용합니다.
    """
    full_text_query = ""
    words = [el for el in remove_lucene_chars(input).split() if el]
    for word in words[:-1]:
        full_text_query += f" {word}~2 AND"
    full_text_query += f" {words[-1]}~2"
    return full_text_query.strip()
```

<div class="content-ad"></div>

이제 모든 것을 함께 적용해 봅시다.

```js
# Fulltext index query
def structured_retriever(question: str) -> str:
    """
    질문에 언급된 엔터티의 인근 엔터티를 수집합니다.
    """
    result = ""
    entities = entity_chain.invoke({"question": question})
    for entity in entities.names:
        response = graph.query(
            """CALL db.index.fulltext.queryNodes('entity', $query, {limit:2})
            YIELD node,score
            CALL {
              MATCH (node)-[r:!MENTIONS]->(neighbor)
              RETURN node.id + ' - ' + type(r) + ' -> ' + neighbor.id AS output
              UNION
              MATCH (node)<-[r:!MENTIONS]-(neighbor)
              RETURN neighbor.id + ' - ' + type(r) + ' -> ' +  node.id AS output
            }
            RETURN output LIMIT 50
            """,
            {"query": generate_full_text_query(entity)},
        )
        result += "\n".join([el['output'] for el in response])
    return result
```

structured_retriever 함수는 사용자 질문에서 엔터티를 감지하여 시작합니다. 그런 다음 감지된 엔터티를 반복하고 해당 노드의 인근을 검색하기 위해 Cypher 템플릿을 사용합니다. 이제 테스트해 봅시다!

```js
print(structured_retriever("Who is Elizabeth I?"))
# Elizabeth I - BORN_ON -> 7 September 1533
# Elizabeth I - DIED_ON -> 24 March 1603
# Elizabeth I - TITLE_HELD_FROM -> Queen Of England And Ireland
# Elizabeth I - TITLE_HELD_UNTIL -> 17 November 1558
# Elizabeth I - MEMBER_OF -> House Of Tudor
# Elizabeth I - CHILD_OF -> Henry Viii
# 그리고 더 많은 정보가 출력됩니다...
```

<div class="content-ad"></div>

## 최종 검색기

처음에 언급했던대로, 우리는 비구조화 및 그래프 검색기를 결합하여 LLM에 전달할 최종 컨텍스트를 생성할 것입니다.

```js
def retriever(question: str):
    print(f"검색 쿼리: {question}")
    structured_data = structured_retriever(question)
    unstructured_data = [el.page_content for el in vector_index.similarity_search(question)]
    final_data = f"""구조화된 데이터:
{structured_data}
비구조화된 데이터:
{"#문서 ". join(unstructured_data)}
    """
    return final_data
```

우리는 Python을 다루고 있으므로, 간단하게 f-string을 사용하여 출력을 연결할 수 있습니다.

<div class="content-ad"></div>

# RAG Chain 정의

RAG의 검색 구성 요소를 성공적으로 구현했습니다. 이제, 통합된 하이브리드 검색기가 제공하는 컨텍스트를 활용하여 응답을 생성하는 프롬프트를 소개하여 RAG 체인의 구현을 완료합니다.

```js
template = """다음 컨텍스트만을 기반으로 질문에 답해보세요:
{context}

질문: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

chain = (
    RunnableParallel(
        {
            "context": _search_query | retriever,
            "question": RunnablePassthrough(),
        }
    )
    | prompt
    | llm
    | StrOutputParser()
)
```

마지막으로, 하이브리드 RAG 구현을 테스트해볼 수 있습니다.

<div class="content-ad"></div>

```js
chain.invoke({"question": "엘리자베스 1세가 속한 집은 무엇인가요?"})
# 검색 쿼리: 엘리자베스 1세는 어떤 집에 속했나요?
# '엘리자베스 1세는 Tudor 왕조에 속했습니다.'

```

또한 질의 재작성 기능을 적용하여 RAG 체인이 대화 형태에 적응하도록 했습니다. 후속 질문을 효율적으로 검색하기 위해 벡터 및 키워드 검색 방법을 사용하기 때문에 후속 질문을 재작성하여 검색 프로세스를 최적화해야 합니다.

```js
chain.invoke(
    {
        "question": "언제 태어났나요?",
        "chat_history": [("엘리자베스 1세가 어떤 집에 속했나요?", "Tudor 왕조")],
    }
)
# 검색 쿼리: 엘리자베스 1세는 언제 태어났나요?
# '엘리자베스 1세는 1533년 9월 7일에 태어났습니다.'

```

질문이 언제 태어났나요?가 처음에 언제 엘리자베스 1세가 태어났나요?로 재작성된 것을 관찰할 수 있습니다. 재작성된 쿼리가 관련 context를 검색하여 질문에 대답하는 데 사용되었습니다.


<div class="content-ad"></div>

# RAG 애플리케이션을 쉽게 개선하기

LLMGraphTransformer의 도입으로 지식 그래프를 생성하는 과정이 더 매끄럽고 접근하기 쉬워졌습니다. 지식 그래프가 제공하는 심층성과 맥락으로 여러분의 RAG 애플리케이션을 향상시키려는 누구에게나 이제 보다 쉬워졌습니다. 이것은 시작에 불과하며 앞으로 많은 개선 사항이 계획되어 있습니다.

LLMs로 그래프를 생성하는 데 대한 통찰, 제안 또는 질문이 있으시다면 망설이지 말고 연락해 주세요.

코드는 GitHub에서 확인할 수 있습니다.