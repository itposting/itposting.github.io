---
title: "대형 언어 모델을 활용한 자동 지식 그래프 구축"
description: ""
coverImage: "/assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_0.png"
date: 2024-06-20 18:48
ogImage: 
  url: /assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_0.png
tag: Tech
originalTitle: "Automated Knowledge Graph Construction with Large Language Models"
link: "https://medium.com/@researchgraph/automated-knowledge-graph-construction-with-large-language-models-150512d1bc22"
---


## 대형 언어 모델의 파워와 지식 채집하기

![이미지](/assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_0.png)

# 작성자

- Amanda Kau (ORCID: 0009-0004-4949-9284)

<div class="content-ad"></div>

# 소개

지식 그래프는 데이터를 그래픽 형식으로 나타내는 네트워크입니다. 지식 그래프의 장점은 개념, 이벤트 및 엔티티를 노드로, 이들 사이의 관계를 엣지로 나타낸다는 데 있습니다. 이러한 관계는 노드의 맥락을 결정하고, 결과적으로 단어의 의미를 이해하고 여러 가능한 의미를 구별할 수 있도록 합니다. 예를 들어, Google의 지식 그래프는 구글 검색을 지원하여 "Apple" 브랜드와 "사과" 과일을 구별할 수 있습니다. 지식 그래프는 소매업에서 제품 추천, 검색 엔진 최적화, 자금세탁 방지 이니셔티브, 그리고 의료 분야를 포함한 다양한 분야 및 응용 프로그램에서 적용될 수 있습니다.

그러나 지식 그래프의 활용은 그들의 어렵고 비용이 많이 드는 건설 과정 때문에 제약을 받습니다. 이러한 과제는 자동 지식 그래프 구축을 탐구하는 새로운 연구의 열풍을 격려했습니다. 특히, GPT-4와 같은 대형 언어 모델(LLMs)을 건설 프로세스에 통합하는 데 관심이 늘어나고 있습니다. 이 글에서는 먼저 지식 그래프 구축과 관련된 어려움을 간단히 살펴볼 것입니다. 그런 다음, 지식 그래프와 LLMs를 지식 베이스로 비교할 것입니다. 마지막으로, LLMs를 활용한 자동 지식 그래프 구축에 대한 기존 방법들을 검토할 것입니다.

# 지식 그래프 구축의 어려움

<div class="content-ad"></div>

이전의 지식 그래프 구축 방법은 크라우드소싱 또는 텍스트 마이닝에 기반합니다. WordNet 및 ConceptNet과 같은 인기 있는 크라우드소싱 기반 지식 그래프는 상당한 인적 노동으로 구축되었지만 미리 정의된 관계 집합에 한정됩니다. 한편, 텍스트 마이닝 기반 접근 방식은 문서에서 지식을 추출하지만 텍스트 내 명시적으로 명시된 추출된 관계에만 한정됩니다. 이 접근 방식은 대용어 해소, 명명 개체 인식 등 많은 단계를 포함합니다. 이 문서에서 지식 그래프 구축 프로세스에 대해 더 읽어보시기 바랍니다.

다양한 개념 및 용어가 각 분야에서 사용되기 때문에 각 분야 또는 응용 분야마다 별도의 지식 그래프가 구축되는 어려움이 있습니다. 특정 도메인은 고유한 도전 과제를 제시하기도 합니다. 예를 들어, 지식 그래프는 서비스 컴퓨팅 커뮤니티에서 매우 유용하며 자원 관리, 맞춤형 추천 및 고객 이해에 도움이 됩니다. 그러나 이 맥락에서의 지식 그래프는 다양한 분야의 지식과 개념이 필요하며, 지식 그래프를 구축하는 데 필요한 데이터는 매우 분산되어 있고 주로 주석이 없습니다. 이러한 요소들은 지식 그래프를 생성하는 데 필요한 시간, 노력 및 비용을 크게 증가시킵니다.

# 지식 그래프 대 대형 언어 모델

지식 그래프와 LLM (Large Language Models)은 모두 지식을 검색하는 데 쿼리될 수 있습니다. 아래 그림에서 지식 그래프는 관련된 연결된 노드를 찾아 답을 찾지만, LLM은 문장을 완성하기 위해 [MASK] 토큰을 채우도록 유도됩니다. GPT-4 및 BERT와 같은 LLM은 최근에 언어를 이해하는 놀라운 능력으로 많은 주목을 받았습니다. LLM은 매년 크기가 계속 커지고 방대한 양의 데이터로 훈련되어 광범위한 지식을 소유할 수 있게 됩니다. 많은 사람들은 구글에서 검색하는 대신 ChatGPT에 질문을 할 수도 있습니다. 연구 커뮤니티에게 다음 질문은 LLM (예: GPT)이 지식 그래프 (예: Google 지식 그래프)를 지식의 주요 소스로 대체할 수 있는지를 탐구하는 것이었습니다.

<div class="content-ad"></div>


![Automated Knowledge Graph Construction with Large Language Models](/assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_1.png)

Further research revealed that despite possessing more fundamental world knowledge, LLMs struggled to recall relational facts and deduce relationships between actions and events. Despite possessing numerous advantages, LLMs also suffer from challenges such as:

- Hallucinations: LLMs occasionally produce convincing but incorrect information. Conversely, Knowledge Graphs provide structured and explicit knowledge grounded in its factual data sources.
- Limited reasoning abilities: LLMs struggle to comprehend and use supporting evidence to draw conclusions, especially in numerical computation or symbolic reasoning. The relationships captured in Knowledge Graphs allow for better reasoning capabilities.
- Lack of domain knowledge: While LLMs are trained on vast amounts of general data, they lack knowledge from domain-specific data like medical or scientific reports with specific technical terms. Meanwhile, Knowledge Graphs can be constructed for specific domains.
- Knowledge obsolescence: LLMs are expensive to train and are not regularly updated, causing their knowledge to become outdated over time. Knowledge Graphs, on the other hand, have a more straightforward update process that does not require retraining.
- Bias, privacy and toxicity: LLMs may give biassed or offensive responses, whereas Knowledge Graphs are typically built from reliable data sources devoid of these biases.

Knowledge Graphs do not encounter these same issues and exhibit better consistency, reasoning ability, and interpretability, though they do have their own set of limitations. Aside from those discussed previously, Knowledge Graphs also lack the flexibility that LLMs enjoy from their unsupervised training process.


<div class="content-ad"></div>

# 지식 그래프와 대형 언어 모델 통합

결과적으로, 대형 언어 모델(대형 LLM)과 지식 그래프를 합치는 데 많은 연구 노력이 기울어져 왔습니다. 지식 그래프는 대형 LLM을 정확성 향상으로 이끌 수 있는 능력을 갖추고 있지만, 대형 LLM은 지식 그래프의 구축 중 지식 추출에 도움을 주고 지식 그래프의 품질을 개선할 수 있습니다. 이 두 개념을 통합하는 몇 가지 접근 방식이 있습니다:

- 대형 LLM을 활용하여 자동 지식 그래프 구축 지원: LLM은 데이터로부터 지식을 추출하여 지식 그래프를 채워넣을 수 있습니다. 이 방법에 대한 자세한 내용은 아래에서 논의될 것입니다.
- LLM에게 지식 그래프에서 지식 검색 방법 가르치기: 아래 이미지에서 보여지는 것처럼, 지식 그래프는 LLM의 추론 과정을 향상시켜 LLM이 더 정확한 답변을 도출할 수 있습니다.
- 지식 그래프를 통합한 사전 훈련된 언어 모델(KGPLMs)로 결합: 이러한 방법들은 지식 그래프를 대형 LLM 훈련 과정에 통합하기 위해 노력합니다.

<div class="content-ad"></div>

# 대형 언어 모델을 활용한 지식 그래프 자동 생성

## 이전 방법

2019년 제안된 초기 방법 중 하나는 COMET(또는 COMmonsEnse Transformers)이었는데, 이 방법은 미세 조정된 생성형 LLM인 GPT를 사용하여 지식 그래프를 구축했습니다. 이는 헤드 엔티티와 관계가 주어졌을 때 테일 엔티티를 생성함으로써 구성되었습니다. 아래 이미지에 나와 있는 "시드"와 "관계"를 고려할 때, COMET은 "완성" 응답을 생성했고, 이 응답의 타당성을 평가하기 위해 사람들에 의해 평가되었습니다. 이러한 시드-관계-완성 쌍은 지식 그래프를 형성하는 데 사용될 수 있습니다. 예를 들어, "조각"과 "기계"는 "의 일부"관계로 연결된 두 노드를 형성할 수 있습니다.

<div class="content-ad"></div>

## ChatGPT를 정보 추출기로 활용하기

특정 서비스 도메인을 위해 구축된 지식 그래프인 BEAR는 수동 데이터 주석 작업에 필요한 노력과 비용을 피하기 위해 ChatGPT를 활용하여 개발되었습니다. 이를 위해 도메인에 특화된 온톨로지가 작성되었는데, 이는 후에 지식 그래프를 채울 개념과 특성을 식별하는 기반이 되었습니다. ChatGPT는 그 후에 아래 이미지처럼 비구조적 텍스트 데이터에서 관련 내용과 관계를 추출하도록 유도되었습니다. 자동으로 추출된 정보는 이후에 지식 그래프에 통합되어 구축되었습니다.

![이미지](/assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_4.png)

## LLMs를 활용한 반자동 지식 그래프 구축

<div class="content-ad"></div>

한번 더 ChatGPT를 정보 추출기로 사용하여, Kommineni 등이 최근 Knowledge Graph 구축 방법으로 ChatGPT-3.5를 제안했습니다. 이 과정에서 인간 도메인 전문가들이 결과물을 두 단계로 확인하였습니다. 이 방법과 이전 방법의 차이는 여기서 LLMs가 보다 더 활발한 역할을 한다는 점입니다. 특정 데이터셋을 시작으로, ChatGPT가 데이터에 대한 추상 수준의 문제인 역량 질문(CQs)을 생성하도록 유도되었습니다. 역량 질문(CQs)은 데이터에 관한 추상 수준의 질문이었습니다. ChatGPT에 프롬프트하여, CQs에서 개념 및 관계를 추출하여 온톨로지를 생성했습니다. CQs에 대한 답변은 데이터에서 검색되어 ChatGPT에 제공되었으며, ChatGPT는 지식 그래프를 구성하기 위해 중요 엔터티, 관계 및 개념을 추출하고 이를 온톨로지에 매핑하도록 지시되었습니다.

![그림](/assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_5.png)

## LLMs에서 지식 그래프 수확

본 문서에서 논의된 최종 방법은 LLMs에서 직접 정보를 추출하는 것이었습니다. Hao 등은 초기 훈련 단계에서 LLMs에 저장된 방대한 양의 지식을 활용할 수 있다고 인지했습니다. 아래 이미지는 LLM의 지식을 수확하기 위한 단계를 보여줍니다. 프로세스는 초기 프롬프트와 두 개의 예시 entity 쌍으로 시작되었고, 텍스트 패러프레이즈 모델이 초기 프롬프트를 패러프레이즈하고 원본에서 수정된 프롬프트를 유도하기 위해 사용되었습니다. 그 후, 해당 프롬프트 세트에 해당하는 entity pair를 검색하였습니다. 검색 및 재점수화 방법을 사용하여, 가장 관련성 있는 쌍을 추출하여 지식 그래프를 형성하였고, 해당 쌍의 entity를 노드, 프롬프트를 관계로 사용하였습니다.

<div class="content-ad"></div>

이 방식을 통해 파생 관계가 전통적으로 구성된 지식 그래프에는 보이지 않는 여러 특성을 가지고 있어서 결과적으로 그래프 간에 더 나은 관계 품질을 제공했습니다:

- 관계는 복잡할 수 있습니다. 예를 들면 "A는 B를 할 수 있지만 잘하지는 않다"와 같이.
- 관계는 두 개체 이상을 포함할 수 있습니다. 예를 들면 "A는 C에서 B를 할 수 있다"와 같이.

또한 LLMs를 사용하여 지식 그래프를 형성하는 것은 LLM 내에서 포착된 지식을 시각화하고 양적으로 표현하는 새로운 방법을 제시했습니다.

![그림](/assets/img/2024-06-20-AutomatedKnowledgeGraphConstructionwithLargeLanguageModels_6.png)

<div class="content-ad"></div>

# 결론

요약하자면, 우리는 지식 그래프와 대형 언어 모델(LLMs)이 지식 베이스로서 갖는 잠재력에 대해 논의했습니다. 지식 그래프는 관계를 포착하는 능력이 뛰어나며 추론 능력이 크지만 구축하기 어렵고 비용이 많이 듭니다. 반면, LLMs는 방대한 지식을 포함하고 있지만 편향, 환각 및 기타 문제에 노출될 수 있습니다. 특정 도메인에 맞게 세밀하게 조정하거나 적응시키는 데도 계산적으로 비용이 많이 듭니다. 두 방법의 장점을 활용하기 위해 지식 그래프와 LLMs를 여러 방법으로 통합할 수 있습니다.

본 문서에서는 LLMs를 사용하여 자동 지식 그래프 구축을 지원하는 데 초점을 맞추었습니다. 특히, 과거의 COMET 모델을 포함한 ChatGPT를 사용하여 BEAR에서 정보 추출기로 사용하고 LLMs로부터 지식을 직접 수확하는 네 가지 예시를 검토했습니다. 이러한 방법들은 지식 그래프와 LLMs의 강점을 결합하여 지식 표현을 향상시키는 방향으로 유망한 발전을 나타냅니다.

# 참고 문헌

<div class="content-ad"></div>

- 지식 그래프란 무엇인가요? | IBM. (연도 미상). [Www.ibm.com](https://www.ibm.com/topics/knowledge-graph)
- 양, 루이 등. (2023). 사실을 우리에게 제시하세요: 사실인식 언어 모델에 지식 그래프를 통합하여 개선하기 (버전 2). arXiv. [https://doi.org/10.48550/ARXIV.2306.11489](https://doi.org/10.48550/ARXIV.2306.11489)
- 펑, 창 등. (2023). Knowledge Solver: 지식 그래프에서 도메인 지식 검색을 위한 LLM 교육 (버전 1). arXiv. [https://doi.org/10.48550/ARXIV.2309.03118](https://doi.org/10.48550/ARXIV.2309.03118)
- 보स슬룻, 알렉스 등. (2019). COMMONET: 자동 지식 그래프 구축을 위한 상식 트랜스포머 (버전 2). arXiv. [https://doi.org/10.48550/ARXIV.1906.05317](https://doi.org/10.48550/ARXIV.1906.05317)
- 유, 성 등. (2023). BEAR: LLM을 활용한 서비스 도메인 지식 그래프 구축 혁신. Service-Oriented Computing (페이지 339-346). Springer Nature Switzerland. [https://doi.org/10.1007/978-3-031-48421-6_23](https://doi.org/10.1007/978-3-031-48421-6_23)
- 코미네니, 빅라브 카시 등. (2024). 인간 전문가로부터 기계로: 온톨로지 및 지식 그래프 구축을 위한 LLM 지원 접근 방식 (버전 1). arXiv. [https://doi.org/10.48550/ARXIV.2403.08345](https://doi.org/10.48550/ARXIV.2403.08345)
- 하오, 순영 등. (2022). BertNet: 사전 훈련된 언어 모델에서 임의 관계를 가진 지식 그래프 수집하기 (버전 3). arXiv. [https://doi.org/10.48550/ARXIV.2206.14268](https://doi.org/10.48550/ARXIV.2206.14268)