---
title: "고급 RAG 12 전세계 이해도 향상하기"
description: ""
coverImage: "/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_0.png"
date: 2024-06-19 03:24
ogImage: 
  url: /assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_0.png
tag: Tech
originalTitle: "Advanced RAG 12: Enhancing Global Understanding"
link: "https://medium.com/ai-advances/advanced-rag-12-enhancing-global-understanding-b13dc9a8db39"
---


많은 중요한 실제 업무는 과학 문헌 검토, 법적 사례 요약 및 의료 진단과 같이 다양한 문서 덩어리나 문서 간의 지식 이해가 필요합니다.

기존 RAG 방법은 각 덩어리가 독립적으로 인코딩되기 때문에 정보를 이해하는 작업을 필요로 하는 LLMs에게 도움을 줄 수 없습니다.

본 문서에서는 문서 또는 말뭉치의 전역적 이해를 향상시키기 위한 네 가지 혁신적인 방법을 소개합니다. 이를 통해 얻은 통찰과 생각에 대한 내용도 함께 공유할 것입니다.

네 가지 방법은 다음과 같습니다:

<div class="content-ad"></div>

- RAPTOR: 이는 텍스트 청크를 재귀적으로 삽입, 클러스터링 및 요약하는 트리 기반 검색 시스템입니다.
- Graph RAG: 이 방법은 지식 그래프 생성, 커뮤니티 탐지, RAG 및 쿼리 중심 요약(QFS)을 결합하여 전체 텍스트 코퍼스의 철저한 이해를 도와줍니다.
- HippoRAG: 이 검색 프레임워크는 사람의 장기 기억의 해리 인덱싱 이론에서 영감을 받습니다. LLMs, 지식 그래프 및 개인화된 PageRank 알고리즘과 협력합니다.
- spRAG: 이 방법은 AutoContext와 Relevant Segment Extraction(RSE)이라는 두 가지 핵심 기술을 통해 표준 RAG 시스템의 성능을 향상시킵니다.

# RAPTOR: 트리 구조화 검색을 위한 재귀적 요약 처리

RAPTOR은 텍스트 세그먼트를 재귀적으로 포함, 클러스터링 및 요약하는 혁신적인 트리 기반 검색 시스템입니다. 이는 아래에서 위로 트리를 구성하여 다양한 수준의 요약을 제공합니다.

추론 중에 RAPTOR는 이 트리에서 정보를 검색하여 다양한 수준의 추상화에서 더 긴 문서의 데이터를 통합합니다.

<div class="content-ad"></div>

## 핵심 아이디어

RAPTOR은 임베딩을 기반으로 텍스트 청크를 클러스터로 구성하기 위해 재귀 방법을 사용합니다. 이는 아래에서 위로 트리를 구성하여 각 클러스터에 대한 요약을 생성합니다. 이 과정은 그림 1에 설명되어 있습니다.

![Figure 1](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_0.png)

아래에서는 그림 1과 관련된 구체적인 주제에 대해 자세히 살펴보겠습니다:

<div class="content-ad"></div>

- RAPTOR 트리 작성
- 검색 프로세스

## RAPTOR 트리 작성

텍스트 청킹

검색 말뭉치를 연속적인 100토큰 단위의 청크로 나눕니다. 100토큰을 초과하는 경우, RAPTOR는 전체 문장을 다음 청크로 이동하여 문맥 및 의미 일관성을 유지합니다.

<div class="content-ad"></div>

```js
def split_text(
    text: str, tokenizer: tiktoken.get_encoding("cl100k_base"), max_tokens: int, overlap: int = 0
):
    """
    입력 텍스트를 tokenizer와 최대 허용 토큰을 기반으로 작은 청크로 분할합니다.
    
    Args:
        text (str): 분할할 텍스트입니다.
        tokenizer (CustomTokenizer): 텍스트를 분할하는 데 사용할 tokenizer입니다.
        max_tokens (int): 최대 허용 토큰 수입니다.
        overlap (int, optional): 청크 간의 겹치는 토큰 수입니다. 기본값은 0입니다.
    
    Returns:
        List[str]: 텍스트 청크의 목록입니다.
    """
    ...
    ...        
        # 현재 청크에 문장을 추가하면 최대 토큰을 초과하는 경우, 새로운 청크를 시작합니다.
        elif current_length + token_count > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = current_chunk[-overlap:] if overlap > 0 else []
            current_length = sum(n_tokens[max(0, len(current_chunk) - overlap):len(current_chunk)])
            current_chunk.append(sentence)
            current_length += token_count
    ...
    ...
```

텍스트 임베딩

이러한 청크를 밀집 벡터 표현으로 생성하기 위해 Sentence-BERT를 사용합니다.

이러한 청크와 해당 임베딩은 RAPTOR 트리 구조의 리프 노드를 형성합니다.

<div class="content-ad"></div>

```python
class TreeBuilder:
    """
    TreeBuilder 클래스는 요약 모델과 임베딩 모델을 사용하여 "트리"라고 불리는 계층적 텍스트 추상 구조를 작성하는 책임이 있습니다.
    """
    ...
    ...
    def build_from_text(self, text: str, use_multithreading: bool = True) -> Tree:
        """입력 텍스트에서 골든 트리를 작성하며, 선택적으로 멀티스레딩을 사용합니다.

        Args:
            text (str): 입력 텍스트입니다.
            use_multithreading (bool, optional): 리프 노드를 만들 때 멀티스레딩을 사용할지 여부입니다.
                기본값: True.

        Returns:
            Tree: 골든 트리 구조입니다.
        """
        chunks = split_text(text, self.tokenizer, self.max_tokens)

        logging.info("리프 노드 생성 중")

        if use_multithreading:
            leaf_nodes = self.multithreaded_create_leaf_nodes(chunks)
        else:
            leaf_nodes = {}
            for index, text in enumerate(chunks):
                __, node = self.create_node(index, text)
                leaf_nodes[index] = node

        layer_to_nodes = {0: list(leaf_nodes.values())}

        logging.info(f"생성된 {len(leaf_nodes)} 개의 리프 임베딩")
        ...
        ...
```

클러스터링 방법

클러스터링은 RAPTOR 트리를 구성하는 데 중요하며, 텍스트 단락을 일관된 그룹으로 구성합니다. 관련 콘텐츠를 함께 모아 나중의 검색 프로세스를 향상시킵니다.

RAPTOR의 클러스터링 방법은 다음과 같은 특징을 가지고 있습니다.


<div class="content-ad"></div>

- 군집에는 가우시안 혼합 모델(GMMs)과 UMAP 차원 축소가 사용됩니다.
- UMAP 매개변수를 수정하여 전역 및 지역 클러스터를 식별할 수 있습니다.
- 모델 선택을 위해 Bayesian Information Criterion (BIC)이 사용되어 최적 클러스터 수를 결정합니다.

이 군집화 방법의 핵심은 노드가 여러 군집에 속할 수 있다는 것입니다. 따라서 하나의 텍스트 세그먼트에 여러 주제에 대한 정보가 들어 있기 때문에 고정된 범주 수가 필요하지 않으며, 이는 여러 개요에 텍스트 세그먼트를 포함시켜줍니다.

노드를 GMM을 사용하여 군집화한 후, 각 군집 내의 노드는 LLM에 의해 요약됩니다. 이 과정은 대량의 데이터를 뽑아 선택된 노드의 간결하고 일관된 개요로 변환합니다.

구현에서는 gpt-3.5 turbo가 요약 생성에 사용됩니다. 해당 프롬프트는 그림 2에 나와 있습니다.

<div class="content-ad"></div>

Markdown 형식으로 변경

![Construction Algorithm](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_1.png)

생성 알고리즘

지금까지 전체 트리의 리프 노드를 얻고 클러스터링 알고리즘을 결정했습니다.

도형 1의 중간에 나타난 것처럼 함께 그룹화된 노드는 형제가 되며, 부모 노드는 해당 특정 클러스터의 요약을 포함합니다. 생성된 요약은 트리의 비리프 노드를 구성합니다.

<div class="content-ad"></div>

## 검색 프로세스

노드들을 요약한 후, 삽입, 클러스터링, 그리고 요약 과정이 더 이상 실행할 수 없을 때까지 계속됩니다. 이렇게 하면 원본 문서의 구조화된 다층 트리 표현이 생성됩니다.

해당 코드는 아래와 같이 나타납니다.

```python
class ClusterTreeConfig(TreeBuilderConfig):
    ...
    ...
    def construct_tree(
        self,
        current_level_nodes: Dict[int, Node],
        all_tree_nodes: Dict[int, Node],
        layer_to_nodes: Dict[int, List[Node]],
        use_multithreading: bool = False,
    ) -> Dict[int, Node]:
        ...
        ...

        for layer in range(self.num_layers):

            new_level_nodes = {}

            logging.info(f"Constructing Layer {layer}")

            node_list_current_layer = get_node_list(current_level_nodes)

            if len(node_list_current_layer) <= self.reduction_dimension + 1:
                self.num_layers = layer
                logging.info(
                    f"Stopping Layer construction: Cannot Create More Layers. Total Layers in tree: {layer}"
                )
                break

            clusters = self.clustering_algorithm.perform_clustering(
                node_list_current_layer,
                self.cluster_embedding_model,
                reduction_dimension=self.reduction_dimension,
                **self.clustering_params,
            )

            lock = Lock()

            summarization_length = self.summarization_length
            logging.info(f"Summarization Length: {summarization_length}")

            ...
            ...
```

<div class="content-ad"></div>

RAPTOR 트리를 갖게 된 후 쿼리하는 방법은 무엇인가요?

쿼리하는 방법에는 두 가지가 있습니다: 트리 순회 방법과 축소된 트리를 기반으로 하는 방법으로, 이는 그림 3에 나와 있습니다.

![image](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_2.png)

트리 순회는 트리의 루트 레벨에서 시작하여 쿼리 벡터와의 코사인 유사성에 따라 상위 k개 노드(이 경우 상위 1개)를 검색합니다. 각 레벨에서 이전 레이어의 상위 k개 노드의 자식노드로부터 상위 k개 노드를 검색하며, 해당 코드는 아래에 표시되어 있습니다.

<div class="content-ad"></div>


class TreeRetriever(BaseRetriever):
    ...
    ...
    def retrieve_information(
        self, current_nodes: List[Node], query: str, num_layers: int
    ) -> str:
        """
        쿼리에 기반하여 트리에서 가장 관련성 높은 정보를 검색합니다.

        Args:
            current_nodes (List[Node]): 현재 노드의 목록.
            query (str): 쿼리 텍스트.
            num_layers (int): 횡단할 레이어의 수.

        Returns:
            str: 가장 관련성 높은 노드를 사용하여 생성된 콘텍스트.
        """

        query_embedding = self.create_embedding(query)

        selected_nodes = []

        node_list = current_nodes

        for layer in range(num_layers):

            embeddings = get_embeddings(node_list, self.context_embedding_model)

            distances = distances_from_embeddings(query_embedding, embeddings)

            indices = indices_of_nearest_neighbors_from_distances(distances)

            if self.selection_mode == "threshold":
                best_indices = [
                    index for index in indices if distances[index] > self.threshold
                ]

            elif self.selection_mode == "top_k":
                best_indices = indices[: self.top_k]

            nodes_to_add = [node_list[idx] for idx in best_indices]

            selected_nodes.extend(nodes_to_add)

            if layer != num_layers - 1:

                child_nodes = []

                for index in best_indices:
                    child_nodes.extend(node_list[index].children)

                # 중복 값을 제외합니다.
                child_nodes = list(dict.fromkeys(child_nodes))
                node_list = [self.tree.all_nodes[i] for i in child_nodes]

        context = get_text(selected_nodes)
        return selected_nodes, context


반면에, 축소된 트리는 트리를 단일 레이어로 축소하고 일정 토큰 수에 도달할 때까지 노드를 검색합니다. 다시 말해, 쿼리 벡터와의 코사인 유사도를 기반으로 상응하는 코드는 다음과 같습니다.


class TreeRetriever(BaseRetriever):
    ...
    ...
    def retrieve_information_collapse_tree(self, query: str, top_k: int, max_tokens: int) -> str:
        """
        쿼리에 기반하여 트리에서 가장 관련성 높은 정보를 검색합니다.

        Args:
            query (str): 쿼리 텍스트.
            max_tokens (int): 최대 토큰 수.

        Returns:
            str: 가장 관련성 높은 노드를 사용하여 생성된 콘텍스트.
        """

        query_embedding = self.create_embedding(query)

        selected_nodes = []

        node_list = get_node_list(self.tree.all_nodes)

        embeddings = get_embeddings(node_list, self.context_embedding_model)

        distances = distances_from_embeddings(query_embedding, embeddings)

        indices = indices_of_nearest_neighbors_from_distances(distances)

        total_tokens = 0
        for idx in indices[:top_k]:

            node = node_list[idx]
            node_tokens = len(self.tokenizer.encode(node.text))

            if total_tokens + node_tokens > max_tokens:
                break

            selected_nodes.append(node)
            total_tokens += node_tokens

        context = get_text(selected_nodes)
        return selected_nodes, context


따라서 어떤 방법이 더 나은지요?


<div class="content-ad"></div>

RAPTOR이 그림 4에서 보여준대로 비교를 진행했습니다.

![Figure 4](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_3.png)

그림 4에서 보여진 대로, 2000 토큰을 가진 축소된 트리가 최상의 결과를 제공합니다. 이는 트리 탐색보다 더 많은 유연성을 제공하기 때문입니다. 구체적으로, 모든 노드를 동시에 탐색함으로써, 주어진 문제에 대한 적절한 상세 수준에서 정보를 검색합니다.

그림 5는 RAPTOR이 "이야기의 중심 주제는 무엇인가요?" 및 "신데렐라가 행복한 결말을 어떻게 이끌어 냈나요?"라는 두 질문에 관련된 정보를 검색하는 방법을 보여줍니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_4.png)

Highlighted nodes indicate RAPTOR’s selections, while arrows point to DPR’s (Dense Passage Retrieval) leaf nodes. Importantly, the context provided by RAPTOR often includes the information retrieved by DPR, either directly or within higher-layer summaries.

# Graph RAG

Graph RAG employs LLM to construct a graph-based text index in two stages:


<div class="content-ad"></div>

- 먼저, 소스 문서에서 지식 그래프를 도출합니다.
- 이후에는 밀접하게 연결된 엔터티 그룹에 대한 커뮤니티 요약을 생성합니다.

쿼리가 주어지면 각 커뮤니티 요약은 부분 응답에 기여합니다. 이러한 부분 응답은 최종 글로벌 답변을 형성하기 위해 집계됩니다.

## 개요

도식 6은 Graph RAG의 파이프라인을 보여줍니다. 보라색 상자는 인덱싱 작업을 나타내고, 초록색 상자는 쿼리 작업을 나타냅니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_5.png)

RAG 그래프는 데이터셋 도메인에 특화된 LLM(대규모 언어 모델) 프롬프트를 사용하여 노드(엔터티와 같은), 엣지(관계와 같은), 및 공변량(클레임과 같은)을 감지, 추출, 요약합니다.

커뮤니티 탐지는 그래프를 노드, 엣지, 공변량의 그룹으로 나누어주며 LLM이 색인 및 질의 시 요약할 수 있도록 합니다.

특정 쿼리에 대한 전역 응답은 해당 쿼리와 관련된 모든 커뮤니티 요약에 대해 최종 쿼리 중심 요약을 수행하여 생성됩니다.

<div class="content-ad"></div>

Figure 6의 각 단계 구현에 대해 아래에서 설명하겠습니다. 2024년 6월 12일을 기준으로 Graph RAG는 현재 오픈 소스가 아니므로 소스 코드와 관련하여 논의할 수 없습니다.

## 단계 1: 소스 문서 → 텍스트 청크

청크 크기의 트레이드오프는 RAG의 오랜 문제입니다.

청크가 너무 길면 LLM 호출 수가 감소합니다. 그러나 컨텍스트 창의 제약으로 인해 대량의 정보를 완전히 이해하고 관리하기가 어려워집니다. 이 상황은 리콜률의 저하로 이어질 수 있습니다.

<div class="content-ad"></div>


![Screenshot](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_6.png)

Figure 7에 설명된 대로 HotPotQA 데이터셋의 경우, 600 토큰의 청크 크기는 2400 토큰의 청크 크기에 비해 효과적인 엔티티를 두 배 더 추출합니다.

## 단계 2: 텍스트 청크 → 요소 인스턴스(엔티티 및 관계)

해당 방법은 각 청크에서 엔티티와 관계를 추출하여 지식 그래프를 구성하는 것을 포함합니다. 이는 LLM과 프롬프트 엔지니어링의 조합을 통해 달성됩니다.


<div class="content-ad"></div>

동시에 Graph RAG는 다단계 반복 프로세스를 사용합니다. 이 프로세스에서 LLM은 모든 엔티티가 추출되었는지 결정해야 합니다. 이는 이진 분류 문제와 유사합니다.

## 단계 3: 요소 인스턴스 → 요소 요약 → 그래프 커뮤니티 → 커뮤니티 요약

이전 단계에서 엔티티, 관계, 주장을 추출하는 것은 사실 요약의 한 형태입니다.

하지만 Graph RAG는 이것만으로 충분하지 않고 LLM을 사용하여 이러한 "요소"를 더 자세히 요약해야 한다고 생각합니다.

<div class="content-ad"></div>

잠재적인 우려 사항은 LLMs가 항상 같은 엔티티에 대한 참조를 동일한 텍스트 형식으로 추출하지 않을 수 있다는 점입니다. 이로 인해 중복된 엔티티 요소가 발생하여 그래프에서 중복된 노드가 생성될 수 있습니다.

그 이슈는 빠르게 사라질 것입니다.

Graph RAG는 커뮤니티 탐지 알고리즘을 활용하여 그래프 내에서 커뮤니티 구조를 식별하여 연결된 엔티티를 동일한 커뮤니티에 통합합니다. Figure 8은 Leiden 알고리즘을 사용하여 MultiHop-RAG 데이터셋에서 식별된 그래프 커뮤니티를 보여줍니다.

이 시나리오에서 LLM이 추출 중에 엔티티의 모든 변형을 일관되게 식별하지 못하더라도 커뮤니티 탐지는 이러한 변형 사이의 연결을 수립하는 데 도움을 줄 수 있습니다. 한 번 커뮤니티로 그룹화되면, 이러한 변형이 동일한 엔티티 의미를 가리킨다는 것을 나타냅니다. 다만 표현이나 동의어가 다를 뿐입니다. 이는 지식 그래프 분야에서의 엔티티 모호성 해소와 유사합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_7.png" />

커뮤니티를 식별한 후, Leiden 계층 내 각 커뮤니티에 대한 보고서 형태의 요약을 생성할 수 있습니다. 이러한 요약은 데이터셋의 전역 구조와 의미를 이해하는 데 독립적으로 유용합니다. 이 요약은 또한 어떠한 문제 없이 말뭉치를 이해하는 데 사용할 수 있습니다.

그림 9은 커뮤니티 요약의 생성 방법을 보여줍니다.

## 단계 4: 커뮤니티 요약 → 커뮤니티 답변 → 전역 답변

<div class="content-ad"></div>

이제 마지막 단계에 도달했습니다: 이전 단계에서의 커뮤니티 요약을 기반으로 최종 답변을 생성하는 것입니다.

커뮤니티 구조의 계층적 특성으로 인해 서로 다른 수준의 요약은 다양한 질문에 대답할 수 있습니다.

그러나 여기서 또 하나의 질문이 생깁니다: 다양한 수준의 커뮤니티 요약이 있는 경우, 어떤 수준이 세부 사항과 범위 사이의 균형을 맞출 수 있을까요?

Graph RAG은 Graph RAG 논문의 섹션 3을 더 자세히 살펴보면서 가장 적절한 추상화 수준을 선택합니다.

<div class="content-ad"></div>

주어진 커뮤니티 수준에서는 그림 10에 표시된 대로 어떤 사용자 쿼리에 대한 글로벌 답변이 생성됩니다.

# HippoRAG

HippoRAG는 인간의 장기 기억의 해마 색인 이론에서 영감을 받아 새로운 검색 프레임워크입니다. LLMs, 지식 그래프 및 개인화된 페이지랭크 알고리즘과 협력하여 작동합니다. 이 협력은 인간의 기억에서 피질과 해마프스의 다양한 역할을 모방합니다.

## 주요 아이디어

<div class="content-ad"></div>

**표 11**은 인간 두뇌가 지식 통합의 어려운 과제를 비교적 쉽게 해결하는 방법을 보여줍니다.

인간 장기 기억에 관한 잘 알려진 이원칙인 해마기억색인이론은 이 놀라운 능력에 대한 가능한 설명을 제시합니다.

구체적으로 환경 기반의 지속적으로 업데이트되는 기억은 신장피질과 C자 모양의 해마 간 상호작용에 의존합니다. 신장피질은 실제 기억 표현을 처리하고 저장하는 반면, 해마는 해마색인을 유지합니다. 이 색인은 신장 피질에서 기억 단위를 가리키고 그들의 연결을 저장하는 일련의 상호 연결된 색인입니다.

![이미지](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_8.png)

<div class="content-ad"></div>

Figure 11에서는 수천 명의 Stanford 교수와 알츠하이머병 연구자를 설명하는 여러 통로에서 알츠하이머병 연구와 관련된 Stanford 교수를 식별하는 것을 목표로 합니다.

- 과거 방식의 RAG는 통로를 독립적으로 부호화하여 Thomas 교수를 식별하는 데 어려움을 겪었는데, 통로가 두 기능을 동시에 언급할 때에만 이를 가능케 했습니다.
- 그에 반해, 이 교수에 익숙한 사람들은 뇌의 연관 메모리 능력 덕분에 기억하기 쉬울 것입니다. 이 능력은 도형 11에서 파란색으로 나타난 C 모양 해마색 부분에 의해 주도되는 것으로 여겨집니다.
- 이 메커니즘의 영향을 받아 HippoRAG는 LLMs가 지식 통합 작업을 관리하기 위해 유사한 연상 지도를 구축하고 활용할 수 있게 합니다.

## 개요

도형 11에서 영감을 받아, HippoRAG의 각 구성 요소는 도형 12에 제시된 것처럼 인간 장기 기억의 세 구성 요소 중 하나에 해당합니다.

<div class="content-ad"></div>


![2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_9.png](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_9.png)

HippoRAG은 인간의 장기기억의 세 가지 구성 요소를 모방하여 패턴 구분 및 완료 기능을 에뮬레이트합니다.

- 오프라인 색인을 위해 LLM은 텍스트 단락을 열린 KG 트리플로 처리합니다. 그런 다음 인공 해마색인에 추가됩니다. 동시에 합성 해마집 영역(PHR)은 동의어를 감지합니다. 위의 예에서 HippoRAG는 Thomas 교수를 포함하는 트리플을 추출하고 KG에 통합합니다.
- 온라인 검색을 위해 LLM 뉴로피질은 질의에서 명명된 엔터티를 추출합니다. 해마색인에 연결되도록 해마집 검색 인코더가 이들을 링크합니다. HippoRAG은 문맥 기반 검색을 위해 개인화된 페이지랭크 알고리즘을 활용하며 Thomas 교수와 관련된 정보를 추출합니다.

## 전체 프로세스 데모


<div class="content-ad"></div>

HippoRAG 파이프라인을 소개하는 실용적인 예시가 있습니다.

Figure 13은 질문, 그에 대한 답변, 그리고 지원 및 분랄 글에서의 내용을 보여줍니다.

![Figure 13](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_10.png)

Figure 14는 OpenIE 절차와 지식 그래프의 관련 부분을 포함한 색인화 단계를 보여줍니다.

<div class="content-ad"></div>

마지막으로, 표 15은 검색 단계를 보여줍니다. 쿼리 Named Entity Recognition (NER), 쿼리 노드 검색, 개인화된 페이지 랭크 (PPR) 알고리즘이 노드 확률에 미치는 영향, 그리고 최상위 검색 결과의 계산이 표시됩니다.

아래에는 소스 코드와 함께 HippoRAG가 장기 기억을 구축하고 검색하는 두 가지 측면에 대해 구체적으로 논의합니다.

<div class="content-ad"></div>

## 장기 기억을 구축하는 방법

장기 기억을 구축하는 과정은 주로 다음 세 단계로 구성됩니다.

먼저, Figure 16에서 보여지는 대로 OpenIE를 사용하여 검색 코퍼스의 각 텍스트에서 명명된 개체 세트를 추출하기 위해 LLM을 활용하십시오.

![이미지](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_13.png)

<div class="content-ad"></div>

다음으로, 최종 삼중체를 추출하기 위해 OpenIE 프롬프트에 명명된 엔티티를 추가하십시오. Figure 17에 나와 있는 대로요.

![Figure 17](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_14.png)

마지막으로, 파인튠된 외장형 밀도 인코더를 활용하여 지식 그래프를 생성하고 검색에 사용할 것입니다.

## 검색 방법

<div class="content-ad"></div>

먼저, 사용자 쿼리에서 명명된 엔티티 집합을 추출하기 위해 LLM을 사용하십시오. Figure 18에서 보여지는 것처럼요.

![Figure 18](/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_15.png)

그런 다음, 이러한 명명된 엔티티를 지식 그래프의 노드에 유사성에 따라 링크합니다. 우리는 이러한 선택된 노드를 쿼리 노드라고 부릅니다.

해마에서 해마 색인 요소들 간의 신경 경로는 관련 이웃들이 활성화되어 상류로 회상될 수 있게 합니다.

<div class="content-ad"></div>

이 효율적인 그래프 탐색 프로세스를 모방하기 위해, HippoRAG는 Personalized PageRank (PPR) 알고리즘을 활용합니다. 이 알고리즘은 그래프 상에서 확률을 사용자가 정의한 일련의 소스 노드를 통해만 분배하는 PageRank의 버전입니다. 아래에 해당 코드가 표시되어 있습니다.

```js
    def rank_docs(self, query: str, top_k=10):
        """
        쿼리를 기반으로 문서를 순위 지정
        @param query: 입력 구문
        @param top_k: 반환할 문서 수
        @return: 순위가 지정된 문서 ID 및 점수
        """
        ...
        ...
        # Personalized PageRank (PPR) 또는 다른 그래프 알고리즘을 실행하여 문서 점수 계산
        if len(query_ner_list) > 0:
            combined_vector = np.max([top_phrase_vectors], axis=0)

            if self.graph_alg == 'ppr':
                ppr_phrase_probs = self.run_pagerank_igraph_chunk([top_phrase_vectors])[0]
            elif self.graph_alg == 'none':
                ppr_phrase_probs = combined_vector
            elif self.graph_alg == 'neighbor_2':
                ppr_phrase_probs = self.get_neighbors(combined_vector, 2)
            elif self.graph_alg == 'neighbor_3':
                ppr_phrase_probs = self.get_neighbors(combined_vector, 3)
            elif self.graph_alg == 'paths':
                ppr_phrase_probs = self.get_neighbors(combined_vector, 3)
            else:
                assert False, f'그래프 알고리즘 {self.graph_alg}은(는) 구현되지 않았습니다.'

            fact_prob = self.facts_to_phrases_mat.dot(ppr_phrase_probs)
            ppr_doc_prob = self.docs_to_facts_mat.dot(fact_prob)
            ppr_doc_prob = min_max_normalize(ppr_doc_prob)
        else:
            ppr_doc_prob = np.ones(len(self.extracted_triples)) / len(self.extracted_triples)
        ...
        ...
``` 

마지막으로, 해마신호가 상류로 전달될 때와 같이 HippoRAG는 이전에 인덱싱된 통로 전체에 대한 출력 PPR 노드 확률을 집계하고 이를 검색을 위해 등수를 매기기 위해 사용합니다.

# spRAG

<div class="content-ad"></div>

spRAG은 복잡한 쿼리를 관리하기 위한 방법입니다. 표준 RAG의 성능을 향상시키는 두 가지 주요 기술을 통해 작동합니다:

- AutoContext
- 관련 세그먼트 추출 (RSE)

우리는 spRAG가 청크 전반에 걸친 복잡한 쿼리를 처리하는 방법에 초점을 맞추고 있습니다. 현재 spRAG에 대한 논문은 없으며 분석과 코드가 결합된 상태만 있습니다.

## AutoContext: 문서 수준 컨텍스트의 자동 주입

<div class="content-ad"></div>

전통적인 RAG에서는 일반적으로 문서를 포함하는 데 고정 길이의 청크로 나눕니다. 이 간단한 방법은 종종 문서 수준의 컨텍스트 정보를 간과하여 보다 정확하고 포괄적인 컨텍스트 포함을 방해할 수 있습니다.

이 문제를 해결하기 위해 AutoContext가 개발되었습니다. 그 핵심 아이디어는 각 청크에 포함되기 전에 문서 수준의 컨텍스트 정보를 자동으로 통합하는 것입니다.

구체적으로, 1~2 문장으로 문서 요약을 작성하고 파일 이름과 함께 각 청크의 시작 부분에 추가합니다. 결과적으로, 각 청크는 고립되어 있지 않지만 전체 문서의 컨텍스트 정보를 가지고 있습니다. 문서 요약을 얻는 코드는 아래와 같이 표시됩니다.

```js
def get_document_context(auto_context_model: LLM, text: str, document_title: str, auto_context_guidance: str = ""):
    # content이 너무 긴 경우 자르기
    max_content_tokens = 6000 # 이 숫자를 변경하면 위의 자르기 메시지도 업데이트해야 합니다
    text, num_tokens = truncate_content(text, max_content_tokens)
    if num_tokens < max_content_tokens:
        truncation_message = ""
    else:
        truncation_message = TRUNCATION_MESSAGE

    # 문서 컨텍스트 가져오기
    prompt = PROMPT.format(auto_context_guidance=auto_context_guidance, document=text, document_title=document_title, truncation_message=truncation_message)
    chat_messages = [{"role": "user", "content": prompt}]
    document_context = auto_context_model.make_llm_call(chat_messages)
    return document_context
```

<div class="content-ad"></div>

## 관련 세그먼트 추출: 연관 텍스트 청크의 지능적 조합

RSE는 후속 처리 단계입니다. 그 목적은 가장 관련성 있는 정보를 제공할 수 있는 청크를 지능적으로 식별하고 결합하여 더 긴 세그먼트를 형성하는 것입니다.

구체적으로, RSE는 먼저 콘텐츠 유사 또는 의미론적으로 관련된 검색된 청크를 그룹화합니다. 그런 다음 쿼리 요구 사항에 따라 이러한 청크를 선택하고 조합하여 최상의 세그먼트를 형성합니다. 관련 코드는 아래에 나와 있습니다.

```js
def get_best_segments(all_relevance_values: list[list], document_splits: list[int], max_length: int, overall_max_length: int, minimum_value: float) -> list[tuple]:
    """
    이 함수는 청크 관련성 값들을 가져와서 최상의 세그먼트를 찾기 위해 최적화 알고리즘을 실행합니다.

    - all_relevance_values: 각 메타-문서의 각 청크에 대한 관련성 값 목록의 목록으로서, 각 외부 목록은 쿼리를 나타냅니다
    - document_splits: 각 문서의 시작을 나타내는 인덱스 목록 - 최상의 세그먼트는 이러한 인덱스와 중복되지 않을 것입니다
    
    반환
    - best_segments: 메타-문서에서 최상의 세그먼트의 인덱스를 나타내는 튜플 목록 (끝 인덱스는 불포함)
    """
    best_segments = []
    total_length = 0
    rv_index = 0
    bad_rv_indices = []
    while total_length < overall_max_length:
        # 쿼리를 순환합니다
        if rv_index >= len(all_relevance_values):
            rv_index = 0
        # 쿼리 중 더 이상 유효한 세그먼트가 없는 경우 작업을 완료합니다
        if len(bad_rv_indices) >= len(all_relevance_values):
            break        
        # 이미 이 쿼리에 대해 더 이상 유효한 세그먼트가 없음을 결정했는지 확인하고 해당 경우 건너뜁니다
        if rv_index in bad_rv_indices:
            rv_index += 1
            continue
        
        # 이 쿼리에 대해 최상의 남은 세그먼트를 찾습니다
        relevance_values = all_relevance_values[rv_index]  # 해당 쿼리의 관련성 값 가져오기
        best_segment = None
        best_value = -1000
        for start in range(len(relevance_values)):
            # 음수 값 시작 지점 건너뜁니다
            if relevance_values[start] < 0:
                continue
            for end in range(start+1, min(start+max_length+1, len(relevance_values)+1)):
                # 음수 값 끝 지점 건너뜁니다
                if relevance_values[end-1] < 0:
                    continue
                # 이 세그먼트가 최상의 세그먼트 중 어느 것과도 겹치는지 확인
                if any(start < seg_end and end > seg_start for seg_start, seg_end in best_segments):
                    continue
                # 이 세그먼트가 문서 분할 중 어느 것과도 겹치는지 확인
                if any(start < split and end > split for split in document_splits):
                    continue
                # 이 세그먼트가 전체 최대 길이를 초과할 것 같은지 확인
                if total_length + end - start > overall_max_length:
                    continue
                segment_value = sum(relevance_values[start:end])  # 세그먼트 값을 그 청크의 관련성 값 합으로 정의
                if segment_value > best_value:
                    best_value = segment_value
                    best_segment = (start, end)
        
        # 유효한 세그먼트를 찾지 못한 경우 해당 쿼리를 마쳤다는 표시를 하고 진행
        if best_segment is None or best_value < minimum_value:
            bad_rv_indices.append(rv_index)
            rv_index += 1
            continue

        # 그렇지 않은 경우, 최상의 세그먼트 목록에 세그먼트를 추가합니다
        best_segments.append(best_segment)
        total_length += best_segment[1] - best_segment[0]
        rv_index += 1
    
    return best_segments
```

<div class="content-ad"></div>

# 통찰과 생각

## 알고리즘과 자료 구조 비교

RAPTOR는 클러스터링을 통해 트리와 유사한 데이터 구조를 생성하고 이 구조를 기반으로 검색을 수행합니다.

Graph RAG와 HippoRAG 모두 지식 그래프를 활용하지만 약간의 차이가 있습니다:

<div class="content-ad"></div>

- 데이터 구조 관련하여, Graph RAG는 지식 요소를 요약하여 정보를 통합합니다. 그러므로 새로운 데이터가 추가될 때마다 요약 프로세스를 반복해야 합니다. 이는 RAPTOR에도 적용됩니다. 그러나 HippoRAG는 단순히 지식 그래프에 엣지를 추가함으로써 새로운 지식을 손쉽게 통합할 수 있습니다.
- 검색 알고리즘 관점에서, Graph RAG는 커뮤니티 감지에 의존하며, HippoRAG는 개인화 페이지랭크 (PPR) 알고리즘을 활용합니다.

그 외의 다른 요소들과 달리, spRAG는 고급 데이터 구조를 사용하지 않습니다. 각 청크에 문서 요약과 파일 이름을 추가한 후, 관련성 값에 기반한 검색을 실행합니다. 이는 spRAG의 색인 및 쿼리 속도가 가장 빠를 것을 시사합니다.

## 성능에 대해

HippoRAG는 실험을 수행하여 기준으로 삼은 RAPTOR를 능가하는 결과를 보여주었습니다. Figure 19에 나와 있는 것처럼요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_16.png" />

그래프 RAG 논문에는 성능 비교 실험이 포함되어 있지 않습니다.

또한 현재 spRAG에 대한 논문이 없습니다.

## 향상된 범위에 대해

<div class="content-ad"></div>

네 가지 방법 — RAPTOR, Graph RAG, HippoRAG, 그리고 spRAG — 는 전체 말뭉치의 이해를 향상시키기 위해 노력합니다.

각각은 전체 말뭉치를 기반으로 데이터 구조를 구축합니다.

## 사용자 정의 가능성에 대해

이 문맥에서 HippoRAG는 모든 구성 요소가 오프더셸프이기 때문에 추가 교육이 필요하지 않아 Figure 20에 나와 있는 것처럼 더 우수합니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-AdvancedRAG12EnhancingGlobalUnderstanding_17.png" />

따라서, 특정 구성 요소를 섬세하게 조정함으로써, 개선의 상당한 잠재력이 있습니다.

# 결론

본문은 코드 설명을 보충하여 문서나 말뭉치의 전통적인 RAG의 전역 이해력을 향상시키기 위한 네 가지 새로운 방법을 소개합니다. 또한 제 개인적인 통찰과 생각도 포함되어 있습니다.
  

<div class="content-ad"></div>

RAG에 관심이 있으시다면 다른 내 기사들도 살펴보세요.

또한, 최신 기사들은 제 뉴스레터에서 확인할 수 있습니다.

마지막으로, 오류나 생략된 부분이 있거나 공유할 생각이 있다면 댓글 섹션에서 자유롭게 토론해 주세요.