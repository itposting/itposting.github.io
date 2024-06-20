---
title: "파이썬 데이터 분석 현대 예술가에 대해 알고 있는 것은 무엇인가요"
description: ""
coverImage: "/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_0.png"
date: 2024-06-19 15:43
ogImage: 
  url: /assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_0.png
tag: Tech
originalTitle: "Python Data Analysis: What Do We Know About Modern Artists?"
link: "https://medium.com/towards-data-science/python-data-analysis-what-do-we-know-about-modern-artists-40f8a66f7235"
---


<img src="/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_0.png" />

인기 있는 현대 문화에 대해 다양한 의견이 존재할 수 있습니다; 이것은 일상생활의 중요한 부분일뿐만 아니라 수십억 달러 규모의 비즈니스입니다. 수천 명의 예술가들이 다양한 장르로 새로운 작품을 만드는데, 그 안에 흥미로운 패턴을 찾을 수 있을까요? 실제로 그렇습니다. 이 기사에서는 위키피디아 데이터를 추출, 분석 및 시각화하는 방법을 보여드리겠습니다.

왜 위키피디아일까요? 이에 대한 몇 가지 이유가 있습니다. 첫째, 이것은 많은 사람들의 지지를 받는 오픈 소스 백과사전이며, 예술가가 영향력이 클수록 해당 예술가에 대한 상세한 문서가 작성될 가능성이 높습니다. 둘째, 거의 모든 위키피디아 페이지에는 다른 페이지로의 하이퍼링크가 있습니다. 이를 통해 "맨 눈"으로 쉽게 알아차리기 어려운 다양한 패턴을 추적할 수 있습니다. 예를 들어, 특정 장르에서 활동하는 예술가 그룹이나 특정 주제에 대해 노래를 만드는 예술가들을 볼 수 있습니다.

## 방법론

<div class="content-ad"></div>

분석을 수행하기 위해 몇 가지 단계를 구현할 것입니다:

- 데이터 수집. 이에 대해 개방 소스 위키백과 라이브러리를 사용할 것입니다. 데이터는 NetworkX 그래프로 저장될 것이며, 각 노드는 위키피디아 페이지를 나타내고 각 엣지는 한 페이지에서 다른 페이지로의 링크를 나타냅니다.
- 전처리. 위키피디아 페이지에는 많은 정보가 포함되어 있지만, 모든 데이터가 분석에 관련되는 것은 아닙니다. 예를 들어 비디오 게임 음악가에 관한 페이지는 음악가뿐만 아니라 "듀크 누켐"이나 "콜 오브 듀티"와 같은 게임에 대한 링크도 포함하고 있습니다. AI Large Language Model (LLM)을 사용하여 모든 노드를 다른 카테고리로 그룹화할 것입니다.
- 데이터 분석. NetworkX 라이브러리를 활용하여 카테고리에서 가장 인기 있는 또는 중요한 노드를 찾을 수 있게 될 것입니다.
- 데이터 시각화. 이것은 그 자체로 큰 주제이며, 다음 파트에서 게시할 것입니다. NetworkX와 D3.js를 사용하여 그래프를 그리는 방법을 보여드리겠습니다.

시작해봅시다!

## 1. 데이터 수집

<div class="content-ad"></div>

이 문서는 예술가에 관한 정보에 초점을 맞추고 있습니다. 시작 지점으로 위키백과 음악가 목록을 활용했습니다. 이 페이지에는 많은 추가 정보가 있어서 필요한 부분만 텍스트 파일로 저장했습니다:

```js
# A
List of acid rock artists
List of adult alternative artists
...

# W
List of West Coast blues musicians
```

또한 Python 리스트로 이 파일을 로드하는 도우미 메서드를 작성했습니다:

```js
def load_links_file(filename: str) -> List:
    """ 텍스트 파일에서 위키백과 링크 목록을 불러옵니다 """
    with open(filename, "r", encoding="utf-8") as f_in:
        root_list = filter(lambda name: len(name.strip()) > 1 and name[0] != "#", f_in.readlines())
        root_list = list(map(lambda name: name.strip(), root_list))
    return root_list
```

<div class="content-ad"></div>

위키피디아 페이지를 읽기 위해 (당연한) 이름을 가진 오픈 소스 Python 라이브러리를 사용할 거에요. 동일한 링크가 다른 페이지에 들어 있을 수 있기 때문에 Python lru_cache를 사용하여 로딩을 더 빠르게 만드는 것이 좋아요:

```js
from functools import lru_cache
import wikipedia

@dataclass
class PageData:
    """ 위키피디아 페이지 데이터 """
    url: str
    title: str
    content: str
    links: List

@lru_cache(maxsize = 1_000_000)
def load_wiki_page(link_name: str) -> Optional[PageData]:
    """ 위키피디아 페이지 로딩 """
    try:
        page = wikipedia.page(link_name)
        return PageData(page.url, page.title, page.content, page.links)
    except Exception as exc:
        print(f"load_wiki_page 오류: {exc}")
    return None
```

위키피디아 라이브러리를 사용하면 작업이 간단해요. 우선적으로 텍스트 파일에서 링크 목록을 로드할 거에요. 각각의 위키피디아 링크(예를 들어, 앰비언트 음악 아티스트 목록)는 10-100개의 이름을 포함해요. 결과적으로 약 2000개의 위키피디아 페이지 목록을 얻게 될 거에요 (이 목록을 pop_artists.txt 파일에 저장했어요). 두 번째 단계로, load_wiki_page 함수를 다시 사용할 거에요. 노드와 엣지는 그래프에 저장될 거에요:

```js
def load_sub_pages(graph: nx.Graph, page_data: PageData):
    """ 모든 링크를 그래프 노드 및 엣지로 추가 """
    for link_name in page_data.links:
        sub_title = link_name
        graph.add_node(sub_title)
        graph.add_edge(page_data.title, sub_title)

# 그래프 생성
G = nx.Graph()

root_list = load_links_file("pop_artists.txt")
# 검색
for artist_name in root_list:
    page_data = load_wiki_page(artist_name)
    if page_data:
        G.add_node(page_data.title)
        load_sub_pages(G, page_data)

# 파일로 저장
nx.write_gml(G, "graph.gml")
```

<div class="content-ad"></div>

코드의 간단함에도 불구하고 프로세스가 오래 걸립니다. 페이지 수가 많고, Wikipedia API도 세계에서 가장 빠른 것은 아닙니다. 실제로, 데이터 수집에 약 하루가 걸렸고 (그 작업에는 라즈베리 파이를 사용했습니다), 출력 GML 파일의 크기는 약 200MB였습니다.

그래프를 저장하면 Jupyter Notebook에서 그 노드를 볼 수 있습니다:

```js
nodes = [(name, len(G.edges(name))) for name in G.nodes()]

df_nodes = pd.DataFrame(nodes, columns=['이름', '에지 수'])
display(df_nodes.sort_values(by=["에지 수"], ascending=False))
```

여기서 그래프 노드를 모두 에지 수별로 정렬했습니다. 모든 것을 올바르게 수행했다면, 출력은 다음과 같아야 합니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_1.png" />

## 2.1 데이터 전처리

첫 번째 단계에서는 다양한 아티스트에 관한 데이터를 수집하여 그래프를 만들었지만, 실제로는 아직 그렇게 유용하지는 않습니다. 예를 들어, 스크린샷에서 "힙합 음악," "올뮤직," "미국"과 같은 노드들을 볼 수 있습니다. 이 모든 용어들은 분명히 다른 주제에 속해 있으며, 이를 개별적으로 분석하는 것이 좋을 것입니다. 이 문서는 아티스트에 중점을 두고 있으며, 보다 자세한 분석을 위해 모든 노드를 7가지 카테고리로 나누기로 결정했습니다:

```js
categories = [
    "person", "place", "country",
    "music style", "music instrument", "music band",
    "other"
]
```

<div class="content-ad"></div>

이제 각 그래프 노드에 적합한 카테고리를 찾아야 합니다. 하지만 말하기보다는 행동하기가 훨씬 어렵습니다. 모든 위키피디아 아티스트 페이지에서 "링크" 객체는 음악 악기부터 LGBT 권리까지 모든 것을 포함할 수 있는 평평한 파이썬 리스트입니다. 한 하위 그룹의 링크를 다른 하위 그룹과 구별하는 쉬운 방법이 없습니다. "힙합"이나 "런던" 같은 단어에 대한 카테고리를 찾는 것은 자연 언어 처리(NLP) 문제이므로, 각 단어에 대한 카테고리를 찾기 위해 대형 언어 모델(LLM)을 사용하기로 결정했습니다.

저는 이 작업을 위해 무료 Llama-3 8B 모델을 사용하기로 결정했습니다. 몇 가지 테스트 후 다음과 같은 프롬프트를 만들었습니다:

```js
categories_str = ', '.join(categories)


prompt_template = f"""
당신은 음악 전문가입니다.
카테고리가 {len(categories)}개 있습니다: {', '.join(categories)}.
단어 목록을 제공할 테니, 각 단어에 대한 카테고리를 작성해 주세요.
출력은 JSON 형식으로 [{word: category}, ...] 작성합니다.
다음은 예시입니다.

Words:
Rap; John; Billboard Top 100

Your Answer:
[
  {"Rap": "음악 스타일"},
  {"John": "인물"},
  {"Billboard Top 100": "기타"},
]

이제 시작! 다음은 단어 목록입니다:
---
_ITEMS_
---

답변을 작성해 주세요.
"""
```

저는 이미 LLM을 사용하여 판다스 데이터프레임을 처리하는 방법에 대해 기사를 작성했습니다. 독자들은 여기서 더 많은 세부 정보를 찾을 수 있습니다:

<div class="content-ad"></div>

해당 기사에서 제공하는 코드를 사용하여 몇 줄의 코드로 데이터프레임을 처리할 수 있었어요:

```js
# 그래프 불러오기
G = nx.read_gml("graph.gml")

# 데이터프레임 생성
nodes = [(name, len(G.edges(name))) for name in G.nodes()]
df_nodes = pd.DataFrame(nodes, columns=['이름', '엣지'])

# 필터링
edge_threshold = 400
df_top_nodes = df_nodes[df_nodes["엣지"] > edge_threshold].copy()

# 처리
df_top_nodes["유형"] = llm_map(df_top_nodes["이름"], batch_size=10)
```

여기서 두 가지 기교를 사용했어요:

- 먼저, 많은 엣지를 가진 그래프 노드만 처리했어요. 이유는 단순합니다 — 그래프에서 가장 중요한 노드를 찾고 싶기 때문이에요. 엣지 수가 적은 노드는 어차피 상위 목록에서 제외될 거예요. 모든 노드를 처리해도 괜찮지만, 900,783개의 노드를 LLM으로 처리하려면 시간이나 돈이 너무 많이 들어요.
- 처리 시 작은 배치 크기 10을 사용했어요. 프롬프트에서 볼 수 있듯이, 모델에 JSON을 응답으로 생성하라고 요청했는데, 8B Llama-3 모델이 그렇게 좋지 않다는 것을 알게 됐어요. Llama-3는 8,192 토큰의 컨텍스트 길이를 갖고 있어 이론상으로 아주 긴 프롬프트를 처리할 수 있어야 하지만, 실제로는 잘 작동하지 않아요. 텍스트 크기가 증가하면 모델이 실수하기 시작해요. 예를 들어, 일반적인 JSON처럼 보이지만, 중간에 콜론이 빠져 파이썬 파서가 더 이상 디코딩할 수 없는 이러한 형태의 JSON을 생성할 수도 있어요:

<div class="content-ad"></div>


[
  {"Rap": "음악 장르"},
  {"John": "사람"},
  {"Billboard Top 100": "기타"},
  ...
]


일반적으로 Google Colab에서 GPU 유형 및 항목 수에 따라 처리 시간은 30~60분이 소요됩니다. 8B 모델의 RAM 요구 사항이 낮고 무료 Colab 계정으로도 작업을 수행할 수 있습니다. OpenAI 키를 가지고 있는 독자는 더 정확한 결과를 얻을 수 있지만 처리는 무료가 아닙니다.

처리가 완료되면 데이터프레임에서 새로운 유형 필드를 그래프로 다시 저장할 수 있습니다:

```python
for index, row in df_top_nodes.iterrows():
    node_name, node_type = row['Name'], row['Type']
    if node_type is not None:
        nx.set_node_attributes(G, {node_name: node_type}, "type")

nx.write_gml(G, "graph_updated.gml")
```

<div class="content-ad"></div>

## 2.2 평가

언어 모델이 완벽하지 않다는 것을 알고 있습니다. 심지어 대형 모델도요. 데이터를 데이터프레임에 다시로드하고 결과를 확인해보겠습니다:

```js
G = nx.read_gml("graph_updated.gml")

nodes = [(name, len(G.edges(name)), data["type"]) for name, data in G.nodes(data=True)]

df_nodes = pd.DataFrame(nodes, columns=['Name', 'Edges', 'Type'])
display(df_nodes.sort_values(by=["Edges"], ascending=False)[:20])
```

여기서 Type 열에는 LLM에서 얻은 결과가 포함되어 있습니다. 또한 엣지 수에 따라 노드를 정렬하고 처음 20개 항목을 표시했습니다. 결과는 다음과 같습니다:

<div class="content-ad"></div>


![Python Data Analysis](/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_2.png)

보시다시피 무료 모델을 사용하여 카테고리를 찾았기 때문에 충분히 좋다고 할 수 있습니다. 그러나 결과는 항상 정확하지는 않으며 선택적으로 수정할 수 있습니다. 예를 들어 Llama-3 모델은 "MTV"를 장소로 결정했습니다. 일반적으로 말하자면 그것은 사실일 수 있지만, 음악 산업 문맥에서는 최선의 선택은 아닙니다. 수동으로 수정할 수 있습니다:

```javascript
fix_nodes = {
    "MTV": "other",
    "Latin Church": "other",
    ...
}
nx.set_node_attributes(G, fix_nodes, "type")
```

어쨌든, 8B Llama-3 모델이 대부분의 작업을 수행했고, 제 코드에서 작은 수의 노드(약 30개)만 수동으로 수정해야 했습니다. 이전에 언급했듯이 독자들은 OpenAI나 다른 공개 API를 사용할 수도 있습니다. 결과는 더 정확할 수 있지만 처리는 더 이상 무료가 아닐 것입니다.


<div class="content-ad"></div>

## 3.1 분석

마침내 더 재미있는 부분에 다가가고 있습니다 — 위키피디아 아티스트 덤프로부터 어떤 종류의 데이터를 얻을 수 있는지 살펴봅시다. 상기해 드리지만, 나는 최신 음악가 목록에서 모든 위키피디아 페이지를 저장하고 모든 페이지와 그 내부 링크를 그래프에 넣었습니다. LLM의 도움으로 그래프 노드를 "person(사람)", "place(장소)", "country(국가)", "music style(음악 스타일)", "music instrument(악기)", "music band(음악 밴드)", "other(기타)" 다섯 가지 범주로 나누었습니다.

제가 먼저 확인할 매개변수는 연결 중심성(degree centrality)이라고 하는데요. 노드의 연결 중심성은 해당 노드가 연결된 노드의 비율입니다. NetworkX를 사용하면 한 줄의 코드로 이를 얻을 수 있습니다:

```js
degree_centrality = nx.degree_centrality(G)
display(degree_centrality)

#> {'Rapping': 0.00138, '106 and Park': 3.3304, ... 
#   '2013 Billboard Music Awards': 1.22116e-05}
```

<div class="content-ad"></div>

이 데이터를 사용하여 가장 인기 있는 상위 20개 음악 스타일을 찾아보겠습니다:

```js
노드 = [(이름, 데이터) for 이름, 데이터 in G.nodes(data=True) if 데이터["type"] == "music style"]
노드_이름 = [이름 for 이름, _ in 노드]
노드 중심성 = [degree_centrality[이름] for 이름, _ in 노드]
노드_엣지 = [len(G.edges(이름)) for 이름, _ in 노드]

df_중심성 = pd.DataFrame({
    "이름": 노드_이름,
    "중심성": 노드_중심성,
    "엣지 수": 노드_엣지
})
display(df_중심성.sort_values(by=["중심성"], ascending=False)[:20])
```

출력 결과는 다음과 같습니다:

<img src="/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_3.png" />

<div class="content-ad"></div>

우리는 그래프 형태로도 확인할 수 있어요:

![그래프](/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_4.png)

물론, 이 "위키백과 순위"는 특정 장르의 활동 청취자 수를 나타내는 것이 아니라 위키백과에서의 인기를 나타냅니다. 이 값들이 상관 관계가 있는지 확인하는 것은 흥미로울 수 있지만, 다른 국가와 미디어 유형(스트리밍, 판매 등)에 따라 다른 장르의 인기가 다르기 때문에 쉽지 않을 수 있어요. 그래도 독자들은 자신이 사는 국가의 차트와 비교해보시면 좋을 것 같아요.

이제 위키백과에서 가장 인기 있는 20명의 아티스트를 표시해볼까요? 코드는 동일하며, 카테고리 필터만 "인물"로 변경했어요. 결과는 다음과 같이 나와요:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_5.png" />

여기서 데이터 처리 과정에서 재미있는 오류를 볼 수 있어요. "Jesus"나 "Zeus"와 같은 몇 가지 이름은 분명히 예술가가 아닙니다. 그리고 미국 교수인 노암 촘스키도 마찬가지에요. LLM은 이러한 노드들을 "사람"으로 정확히 식별했고, 이 링크들은 아마도 어떤 음악가의 페이지에 있었을 거에요. 실제 예술가들에 대해서는, 비욘세가 우리 목록 상단에 위치하고 있으며, 인도 작곡가 A. R. 라만과 가까이 있어요. 다른 이름들은 독자들이 직접 확인할 수 있어요.

우리의 "위키백과 평가"가 현대 청취자들의 선호도와 어떻게 관련이 있는지 궁금하셨죠? 이 표를 2024년 가장 많은 스트리밍 아티스트 위키백과 페이지와 비교해봤어요. 흥미로운 점은 상관성이 그리 크지 않다는 거에요. 예를 들어, 비욘세는 우리 평가에서 1위에 있지만 스포티파이에서는 22위에 있어요. 프랭크 신트라나, 엘비스 프레슬리, 셀린 디온과 같은 다른 이름들 중 많은 사람들이 스포티파이 상위에 없는 이유는 무엇일까요? 이에 대해 두 가지 생각이 있어요:

- 스트리밍 서비스에서 음악을 듣는 건 대부분 "수동적"이에요. 청취자들은 아티스트에 대해 알아가거나 정보를 읽거나 추가하는 데 적극적으로 참여하지 않아요. 그냥 배경에서 흘러나오는 라디오처럼, 사람들은 실제로 현재 어떤 트랙이 재생되고 있는지 그다지 중요하게 생각하지 않아요. 게다가, 현재 재생 목록은 Spotify 추천 시스템에 의해 생성될 수도 있어요.
- 아티스트의 "위키백과 평가"는 듣는 사람의 수보다는 그 아티스트가 음악 및 사회에 기여한 정도와 관련이 더 크다고 생각해요. 예를 들어, 프랭크 신트라나를 요즘 사람들이 적극적으로 듣고 있다고 생각하지 않지만, 그가 문화, 음악 산업, 그리고 다른 아티스트들의 작품에 한 몫을 한 것은 분명해요.

<div class="content-ad"></div>

어쨌든, 결과가 흥미로워요. 보다 자세한 연구를 할 수 있을 거에요.

다음으로 흥미로운 지표는 매개 중심성입니다 — 다른 노드 사이의 최단 경로에서 다리 역할을 하는 노드를 측정하는 값이에요. 음악 산업의 맥락에서는 여러 장르에서 활동하는 아티스트일 수 있어요.

NetworkX로 매개 중심성을 측정할 수 있어요:

```js
node_types = nx.get_node_attributes(G, "type")

def filter_node(node: str):
    """ 특정 유형의 노드 가져오기 """
    return node_types[node] == "person"

Gf = nx.subgraph_view(G, filter_node=filter_node)

betweenness_centrality = nx.betweenness_centrality(Gf)
```

<div class="content-ad"></div>

결과적으로 안타깝게도, 적어도 내 PC에서는 작동하지 않았습니다. 가장 짧은 경로를 찾으려면 많은 계산이 필요하며, 수천 개의 노드에 대해서도 너무 오랜 시간이 걸리고 마지막 결과를 얻을만큼 인내심이 부족했어요. 더 최적화된 라이브러리가 있는지 모르겠는데, 혹시 CUDA 지원이 있는 것 같아요; 답을 아시는 분은 댓글에 자유롭게 적어주세요.

## 3.2 커뮤니티 탐지

이 글에서 시도해볼만한 흥미로운 마지막 주제는 커뮤니티 탐지입니다. 그래프는 그래프의 노드들이 노드 집합으로 그룹화될 수 있는 경우 커뮤니티 구조를 가졌다고 합니다. 예를 들어, 서로 다른 장르에서 활동하는 아티스트들의 그룹을 찾아봅시다.

먼저 그래프를 필터링해봅시다:

<div class="content-ad"></div>

```python
node_types = nx.get_node_attributes(Gf, "type")

def filter_node(node: str):
    """ 특정 타입의 노드 가져오기 """
    return node_types[node] in ("person", "music style")

Gf = nx.subgraph_view(Gf, filter_node=filter_node)
```

NetworkX에는 커뮤니티를 찾기 위한 다양한 알고리즘이 많이 있습니다. 몇 가지를 시도해 봅시다.

Girvan-Newman 알고리즘은 원래 그래프에서 엣지를 점진적으로 제거하여 커뮤니티를 감지합니다:

```python
communities_generator = nx.community.girvan_newman(Gf)
for com in itertools.islice(communities_generator, 7):
    communities_list = com

print(communities_list)
#> ({'A. D. King', 'A. R. Rahman', 'Adam', 'Admiral', ... },
#   {'Cheyenne', 'Jesse James'}, ... }
```

<div class="content-ad"></div>

수백 개의 항목의 분리 품질을 수동으로 추정하는 것은 어렵지만 시각적 형태로 완료할 수 있습니다. 제 경우, 결과가 완벽하지는 않았어요:

<img src="/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_6.png" />

알고리즘은 그래프 주변의 가장 큰 "블롭"과 몇 개의 짧은 "끈"만 감지했어요.

다른 접근 방식을 시도해 보죠. 탐욕적 모듈성 최대화 알고리즘은 Clauset-Newman-Moore 탐욕적 모듈성 최대화를 사용하여 커뮤니티를 찾아요:

<div class="content-ad"></div>

```js
communities_list = nx.community.greedy_modularity_communities(Gf,cutoff=10)
```

결과는 다음과 같이 나옵니다:

<img src="/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_7.png" />

D3.JS를 사용하여 수동 검증 결과가 더 흥미로운 것으로 나타났습니다. 예를 들어, 그래프의 왼쪽에 K-pop(한국 팝) 스타일로 활동하는 음악가들의 별도 그룹이 쉽게 보입니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_8.png)

다른 흥미로운 노드 그룹은 예술가가 아닌 철학자들을 포함하고 있습니다. 이것을 보는 것도 흥미로웠습니다.

![image](/assets/img/2024-06-19-PythonDataAnalysisWhatDoWeKnowAboutModernArtists_9.png)

물론, 도시, 국가 또는 연주하는 악기 등의 다른 유형의 커뮤니티도 발견할 수 있습니다. 가능한 범주 목록도 확장될 수 있습니다.


<div class="content-ad"></div>

## 결론

이 글에서는 위키피디아 페이지에서 그래프를 만드는 과정을 설명했습니다. 분석을 위해 약 900,000개의 노드로 이루어진 그래프를 수집했는데, 이 그래프는 현대 예술가들에 대한 정보(페이지 및 링크)를 담고 있습니다. 또한, 이러한 노드들을 AI로 처리하여 카테고리로 분할했습니다. NetworkX 라이브러리를 활용하여 이 그래프에서 흥미로운 패턴을 찾고 가장 중요한 노드를 찾을 수 있었습니다.

요즘에는 현대 사회에서 영향력 있는 사람들마다 위키피디아 페이지가 있습니다. 서로 다른 페이지들은 서로 연결되어 있으며, 이 데이터의 분석은 사회과학, 음악학, 문화 인류학에 중요할 수 있습니다. 결과적으로, 그 결과물은 흥미로웠습니다. 예를 들어, "위키피디아 최고 평점"에 있는 인기있는 예술가들이 가장 높은 스포티파이 평점과 일치하지 않습니다. 이것은 제게 놀랍고, 팬들이 자주 방문(또는 업데이트)하는 아티스트의 위키피디아 페이지를 얼마나 자주 방문하는지 생각해보는 것이 흥미로울 것입니다.

물론, 같은 분석은 예술가 뿐만 아니라 정치, 스포츠 및 다른 분야에서도 수행될 수 있습니다.

<div class="content-ad"></div>

소셜 데이터 분석에 관심이 있는 분들은 다른 아티클도 읽어보세요:

- 탐색적 데이터 분석: YouTube 채널에 대해 우리는 무엇을 알고 있는가
- 독일 주택 임대 시장: Python으로 하는 탐색적 데이터 분석
- 기후에 관해 사람들이 쓰는 내용: Python으로 하는 트위터 데이터 클러스터링
- 트위터 게시물에서 시간적 패턴 찾기: Python으로 하는 탐색적 데이터 분석
- Python 데이터 분석: 팝송에 대해 우리는 무엇을 알고 있는가?

만약 이 이야기를 즐겼다면, Medium에 구독해도 좋고, 새로운 아티클이 발행될 때 알림을 받을 수 있습니다. 수천 편의 다른 저자의 이야기에도 완전히 액세스할 수 있습니다. 또한 LinkedIn을 통해 연락하셔도 좋습니다. 이와 다른 게시물들의 전체 소스 코드를 얻고 싶다면 Patreon 페이지를 방문해주세요.

읽어 주셔서 감사합니다.