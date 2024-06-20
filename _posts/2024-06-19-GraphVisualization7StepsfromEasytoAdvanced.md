---
title: "그래프 시각화 초보부터 고급까지 7단계"
description: ""
coverImage: "/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_0.png"
date: 2024-06-19 01:25
ogImage: 
  url: /assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_0.png
tag: Tech
originalTitle: "Graph Visualization: 7 Steps from Easy to Advanced"
link: "https://medium.com/towards-data-science/graph-visualization-7-steps-from-easy-to-advanced-4f5d24e18056"
---



<img src="/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_0.png" />

일부 데이터 유형(예: 소셜 네트워크 또는 지식 그래프)는 그래프 형식으로 "원래" 표현될 수 있습니다. 이 유형의 데이터 시각화는 도전적일 수 있으며, 이를 위한 보편적인 레시피는 없습니다. 이 기사에서는 오픈 소스 NetworkX 라이브러리를 사용한 그래프 시각화의 여러 단계를 보여 드리겠습니다.

시작해보겠습니다!

## 기본 예제


<div class="content-ad"></div>

파이썬에서 그래프를 사용하려면 NetworkX가 아마도 가장 인기 있는 선택일 것입니다. NetworkX는 네트워크 분석을 위한 오픈 소스 파이썬 패키지로, 다양한 알고리즘과 강력한 기능이 포함되어 있습니다. 우리가 알다시피, 모든 그래프에는 노드(정점)와 간선이 포함되어 있습니다. NetworkX에서 간단한 그래프를 쉽게 만들 수 있습니다:

```python
import networkx as nx

G = nx.Graph()
G.add_node("A")
G.add_node("B")
G.add_edge("A", "B")
...
```

하지만 이 방법으로 대규모 그래프를 만드는 것은 피곤할 수 있으며, 이 기사에서는 NetworkX 라이브러리에 포함된 "데이비스의 사우스 클럽 여성" 그래프를 사용할 것입니다(3-clause BSD 라이센스). 이 데이터는 1930년대에 A. Davis 등에 의해 수집되었습니다(A. Davis, 1941, 딥 사우스, 시카고: 시카고 대학 출판사). 이 데이터는 18명의 사우스 여성이 14개의 사교 행사에 참석한 것을 나타냅니다. 이제 그래프를 불러와서 그려보겠습니다:

```python
import networkx as nx
import matplotlib.pyplot as plt

G = nx.davis_southern_women_graph()

fig1 = plt.figure(figsize=(12, 8))
nx.draw(G, with_labels=True)
plt.show()
```

<div class="content-ad"></div>

결과가 여기처럼 보입니다:

![그래프 시각화](/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_1.png)

작동하고 있지만, 이 이미지는 확실히 개선할 수 있습니다. 다른 방법을 살펴보겠습니다.

## 1. 레이아웃

<div class="content-ad"></div>

그래프 자체는 노드와 그들 사이의 관계만을 포함하고 있어요. 좌표는 가지고 있지 않아요. 동일한 그래프가 여러 가지 다른 방식으로 표시될 수 있으며, NetworkX에는 다양한 레이아웃이 있어요. 만별한 해결책이 없고, 시각적인 인상은 주관적일 수도 있어요. 가장 좋은 방법은 다양한 옵션을 시도하고 특정 데이터셋과 가장 잘 맞는 이미지를 찾는 것이에요.

스파이럴 레이아웃
이 레이아웃은 spiral_layout 메소드를 사용하여 생성할 수 있어요:

```js
pos = nx.spiral_layout(G)
print(pos)
#> {'Evelyn Jefferson': array([-0.51048124,  0.00953613]),
#   'Laura Mandeville': array([-0.59223481, -0.08317364]), ... }

nx.draw(G, pos=pos, with_labels=True)
```

print 출력을 보면 레이아웃 자체가 좌표를 가진 사전(dictionary)임을 알 수 있어요. 이 레이아웃은 draw 메소드의 옵션 매개변수로 지정될 수 있어요. 결과는 다음과 같이 보여요:

<div class="content-ad"></div>

이미지 태그를 Markdown 형식으로 변경하세요.


![Graph Visualization](/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_2.png)


이 유형의 그래프는 최적의 것이 아닙니다. 다른 방법을 시도해 보죠.

원형 레이아웃
여기서 코드 로직은 동일합니다. 먼저 레이아웃을 생성한 다음 코드에서 사용합니다:

```js
pos = nx.circular_layout(G)
nx.draw(G, pos=pos, with_labels=True)
```

<div class="content-ad"></div>

결과:

<img src="/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_3.png" />

이전 예제와 마찬가지로 이 그래프에 대해 원형 레이아웃은 최적이 아닙니다.

Kamada-Kawai 레이아웃
이 방법은 Kamada-Kawai 경로 길이 비용 함수를 사용합니다.

<div class="content-ad"></div>

```js
pos = nx.kamada_kawai_layout(G)
nx.draw(G, pos=pos, with_labels=True)
```

보다 나은 결과가 나타납니다:

<img src="/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_4.png" />

Spring Layout
이 방법은 Fruchterman-Reingold 힘 방향 알고리즘을 사용하여 노드를 서로 멀어지도록 당깁니다. 이 시스템이 평형에 도달할 때까지 노드를 서로 멀어지도록 당깁니다.

<div class="content-ad"></div>

```js
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, with_labels=True)
```

결과는 주관적으로 가장 좋아 보입니다:

<img src="/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_5.png" />

여기서 seed 매개변수는 결과를 동일하게 유지하려면 유용합니다. 그렇지 않으면 각 재그리기마다 다른 모양의 그래프가 생성됩니다.

<div class="content-ad"></div>

다른 그래프 레이아웃 유형은 NetworkX에서 사용할 수 있습니다. 독자들은 직접 테스트해보기를 환영합니다.

## 2. 노드 색상

참고로, 우리의 그래프는 14개의 사회적 이벤트에 참여하는 18명의 여성을 나타냅니다. 그래프의 모든 이벤트는 "Exx"로 이름이 지어져 있습니다. 시각적으로 더 나은 표현을 위해 이벤트들의 색상을 변경해보겠습니다.

먼저, 노드가 이벤트인지 감지하는 헬퍼 메서드를 만들겠습니다:

<div class="content-ad"></div>

```js
def is_event_node(node: str) -> bool:
    """이벤트가 'E'로 시작하는지 확인합니다."""
    return re.match("^E\d", node) is not None
```

여기서는 노드 패턴을 결정하기 위해 정규식을 사용했습니다 (처음에는 node.startswith("E") 메서드를 사용하려고 했지만 일부 여성 이름도 "E"로 시작할 수 있습니다). 이제 각 노드에 대한 색상 배열을 쉽게 만들고 그래프를 그릴 때 사용할 수 있습니다:

```js
def get_node_color(node: str) -> str:
    """개별 노드의 색상을 가져옵니다."""
    return "#00AA00" if is_event_node(node) else "#00AAEE"

node_colors = [get_node_color(node) for node in G.nodes()]
nx.draw(G, pos=pos, node_color=node_colors, with_labels=True)
```

결과는 다음과 같습니다:


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_6.png" />

## 3. 노드 크기

색상과 마찬가지로 각 노드의 크기를 지정할 수 있습니다. "이벤트" 노드를 더 크게 만들어 보겠습니다. 노드 크기는 연결 수에 비례할 수도 있습니다:

```js
edges = {노드: len(G.edges(노드)) for 노드 in G.nodes()}

def node_size(노드: str) -> int:
    """ 개별 노드의 크기 가져오기 """
    k = 4 if is_event_node(노드) else 1
    return 100 * k + 100 + 50 * edges[노드]

node_sizes = [node_size(노드) for 노드 in G.nodes()]
nx.draw(G, pos=pos, node_color=node_colors, node_size=node_sizes,
        with_labels=True)
```

<div class="content-ad"></div>

여기, 노드 당 엣지 수를 별도의 딕셔너리에 저장했어요. 또한 "이벤트" 노드를 더 크게 만들기 위해 이전과 동일한 is_event_node 메서드를 사용했어요.

결과물은 이렇게 생겼어요:

![그래프 시각화](/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_7.png)

## 4. 엣지 색상

<div class="content-ad"></div>

노드 뿐만 아니라 엣지 색상도 지정할 수 있습니다. 예를 들어, Theresa Anderson이 방문한 모든 이벤트를 강조해 보겠습니다. 이를 위해 세 가지 도우미 메서드가 필요합니다:

```js
highlighted_node = "Theresa Anderson"


def get_node_color(node: str) -> str:
    """ 개별 노드의 색상을 가져옵니다 """
    if is_event_node(node):
        if G.has_edge(node, highlighted_node):
            return "#00AA00"
    elif node == highlighted_node:
        return "#00AAEE"
    return "#AAAAAA"

def edge_color(node1: str, node2: str) -> str:
    """ 개별 엣지의 색상을 가져옵니다 """
    if node1 == highlighted_node or node2 == highlighted_node:
        return "#992222"
    return "#999999"

def edge_weight(node1: str, node2: str) -> str:
    """ 개별 엣지의 두께를 가져옵니다 """
    if node1 == highlighted_node or node2 == highlighted_node:
        return 3
    return 1
```

여기에서 Theresa Anderson의 노드에 대해 별도의 색상을 사용했습니다. 그녀가 방문한 모든 이벤트의 색상도 변경했습니다. has_edge 메서드는 두 노드가 공통 엣지를 가지고 있는지 확인하는 쉬운 방법입니다. 또한 엣지 두께도 변경했습니다.

이제 그래프를 그릴 수 있습니다:

<div class="content-ad"></div>

```python
edge_colors = [edge_color(n1, n2) for n1, n2 in G.edges()]
edge_weights = [edge_weight(n1, n2) for n1, n2 in G.edges()]
node_colors = [get_node_color(node) for node in G.nodes()]
nx.draw(G, pos=pos, node_color=node_colors, node_size=node_sizes,
        edge_color=edge_colors, width=edge_weights, with_labels=True)
```

이렇게 결과가 나옵니다:

![Graph Visualization](/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_8.png)

## 5. 노드 레이블

<div class="content-ad"></div>

그래프에 서로 다른 노드 유형이 있는 경우, 서로 다른 노드에 대해 서로 다른 글꼴을 사용할 수 있습니다. 그러나 제 놀람에는 NetworkX에서 색상과 같이 글꼴을 지정하는 쉬운 방법이 없습니다. "이벤트"와 "사람" 노드를 그릴 때, 그래프를 서브그래프로 분할하여 따로 그릴 수 있습니다:

```js
node_events = [node for node in G.nodes() if is_event_node(node)]
node_people = [node for node in G.nodes() if not is_event_node(node)]

nx.draw(G, pos=pos, node_color=node_colors, node_size=node_sizes, with_labels=False)
nx.draw_networkx_labels(G.subgraph(node_events), pos=pos, font_weight="bold")
nx.draw_networkx_labels(G.subgraph(node_people), pos=pos, font_weight="normal", font_size=11)
```

여기서, 먼저 노드를 이전과 같이 그리되, with_labels 매개변수를 False로 설정했습니다. 그런 다음 서로 다른 글꼴 설정으로 draw_networkx_labels 메서드를 두 번 사용했습니다.

결과는 다음과 같이 보입니다:

<div class="content-ad"></div>


![그래프 시각화](/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_9.png)

## 6. 노드 속성

우리는 도움이 되는 Python 메소드를 사용하여 노드 색상과 크기를 설정할 수 있었습니다. 그러나 노드 속성으로도 이 정보를 그래프 자체에 저장할 수 있습니다:

```js
colors_dict = {node: get_node_color(node) for node in G.nodes()}
nx.set_node_attributes(G, colors_dict, "color")
```

<div class="content-ad"></div>

아래와 같이 일부 노드에 수동으로 속성을 지정할 수도 있습니다:
```js
custom_colors_dict = {
             "Frances Anderson": "orange",
             "Theresa Anderson": "orange",
             "E3": "darkgreen",
             "E5": "darkgreen",
             "E6": "darkgreen"
}
nx.set_node_attributes(G, custom_colors_dict, "color")
```

그런 다음, 그래프를 파일로 저장하면 모든 정보가 그대로 유지됩니다:
```js
nx.write_gml(G, "davis_southern_women.gml")
```

<div class="content-ad"></div>

다음으로는 그래프를 로드하고 노드 속성에서 모든 색상을 추출할 수 있습니다. 더 이상 헬퍼 메서드가 필요하지 않습니다:

```js
attributes = nx.get_node_attributes(G, "color")
node_color_attrs = [attributes[node] for node in G.nodes()]
nx.draw(G, pos=pos, node_color=node_color_attrs, node_size=node_sizes, with_labels=False)
nx.draw_networkx_labels(G.subgraph(node_events), pos=pos, font_weight="bold")
nx.draw_networkx_labels(G.subgraph(node_people), pos=pos, font_weight="normal", font_size=11)
```

위와 같은 결과가 나타납니다:

<img src="/assets/img/2024-06-19-GraphVisualization7StepsfromEasytoAdvanced_10.png" />

<div class="content-ad"></div>

여기서는 이전에 사용한 것과 동일한 색상들을 보고, 사용자 정의 색상을 가진 네 개의 노드를 볼 수 있습니다. 모든 정보가 GML 파일에 저장되었습니다.

## 7. 보너스: D3.JS로 그래프 그리기

그래프를 그릴 때 NetworkX는 Matplotlib을 사용합니다. 이는 이와 같은 작은 그래프에는 좋지만, 그래프에 1000개 이상의 노드가 포함된 경우 Matplotlib은 극도로 느려집니다. D3.JS를 사용하면 훨씬 더 나은 결과를 얻을 수 있습니다. D3.JS는 그래프 시각화를 훨씬 더 효율적으로 수행할 수 있는 오픈 소스 JavaScript 라이브러리입니다. D3는 데이터 시각화를 위한 성숙한 프로젝트이며(첫 번째 버전은 2011년에 출시되었습니다), 그래프뿐만 아니라 다양한 아름다운 이미지를 Examples 갤러리에서 찾아볼 수 있습니다.

NetworkX 그래프를 D3로 내보내는 "원시적인" 방법을 찾지 못했지만, 몇 줄의 코드로 수행할 수 있습니다:

<div class="content-ad"></div>

```python
def convert_to_d3(graph: nx.Graph) -> dict:
    """ Convert nx.Graph to D3 data """
    nodes, edges = [], []
    for node_name in graph.nodes:
        nodes.append({"id": node_name,
                      "color": get_node_color(node_name),
                      "radius": 0.01*node_size(node_name)})
    for node1, node2 in graph.edges:
        edges.append({"source": node1, "target": node2})
    return {"nodes": nodes, "links": edges}

# D3 형식으로 저장
d3 = convert_to_d3(G)
with open('d3_graph.json', 'w', encoding='utf-8') as f_out:
    json.dump(d3, f_out, ensure_ascii=False, indent=2)
```

이후에는 JSON 데이터를 Javascript 페이지로 로드할 수 있습니다:

```javascript
<script type="module">
    // 차트의 차원을 지정합니다.
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 색상 척도를 지정합니다.
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const data = await d3.json("./d3_graph.json");
    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    // SVG 컨테이너를 생성합니다.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    ...      

    // 여러 힘을 가진 시뮬레이션을 생성합니다.
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    // SVG 요소를 추가합니다.
    container.append(svg.node());
</script>
```

이 문서는 JavaScript 자체에 집중하고 있지 않습니다. D3.JS로 그래프를 그리는 코드 예제는 온라인에서 쉽게 찾을 수 있습니다. (이것은 좋은 시작점일 수 있습니다. 전체 소스 코드 링크도 이 페이지의 끝에 있습니다.)


<div class="content-ad"></div>

요렇게 하여 로컬 서버를 실행하고 브라우저에서 페이지를 열 수 있습니다. JavaScript의 장점 중 하나는 그래프를 상호작용 가능하게 만들 수 있고 노드를 드래그앤드롭으로 이동할 수 있다는 것입니다:

![image](https://miro.medium.com/v2/resize:fit:1400/1*4asm0pegdu8GK_tg5pOiVQ.gif)

하지만 단점으로는 D3 렌더링에서 변경 사항을 만드려면 JavaScript, CSS 및 HTML 스타일로 심층적으로 파고들어야 한다는 것입니다. 저는 프론트엔드 웹 개발자가 아니라서 작은 조정조차 시간이 많이 소요되지만 (그래도 항상 뭔가를 배우는 게 좋죠:)) 예를 들어, 내 예제에서 기본 그래프 크기가 너무 작았고 기본 "줌" 값을 설정하는 간단한 방법을 찾지 못했습니다. 그러나 복잡한 그래프의 경우 Matplotlib 렌더링은 너무 느리므로 다른 선택지가 없습니다. 저는 현대 예술가들의 그래프 시각화를 위해 D3 라이브러리를 사용했고 결과는 좋았습니다.

## 결론

<div class="content-ad"></div>

이 글에서는 NetworkX를 사용하여 그래프 시각화하는 다양한 방법을 보여드렸어요. 보다시피, 이 과정은 대부분 직관적이며 노드 크기 또는 색상과 같은 많은 매개변수를 쉽게 조절할 수 있어요. 보다 복잡한 그래프는 JSON으로 내보내어 JavaScript로 사용할 수 있어요. 이후에는 강력한 D3.JS 라이브러리를 사용할 수 있어요 - 웹 브라우저에서의 렌더링 프로세스는 아마도 하드웨어 가속화되어 더 빠를 거예요.

이전 글에서는 위키피디아에서 수집한 현대 예술가에 관한 데이터를 분석하기 위해 NetworkX 라이브러리를 사용했어요. 사회 데이터 분석에 관심이 있는 분들은 다른 게시물들도 읽어보세요:

- 탐색적 데이터 분석: YouTube 채널에 대해 알고 있는 것은 무엇인가요?
- 독일의 주거 임대 시장: Python으로 탐색적 데이터 분석
- 사람들이 기후에 대해 쓰는 내용: Python으로 Twitter 데이터 클러스터링
- Twitter 게시물에서 시간 패턴 찾기: Python으로 탐색적 데이터 분석
- Python 데이터 분석: 팝송에 대해 우리가 아는 것은?

이 이야기를 즐겼다면 Medium을 구독해도 좋아요. 새로운 글이 게시되면 알림을 받을 수 있을 뿐만 아니라 다른 저자들의 수천 개의 이야기에도 완전한 액세스 권한을 얻을 수 있어요. LinkedIn을 통해 연결해도 좋고요. 이와 다른 게시물들의 전체 소스 코드를 얻고 싶다면 Patreon 페이지를 방문해주세요.

<div class="content-ad"></div>

읽어 주셔서 감사합니다!