---
title: "포켓몬 세계 매핑 서식지 기반 만남의 네트워크 분석"
description: ""
coverImage: "/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_0.png"
date: 2024-06-20 15:01
ogImage: 
  url: /assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_0.png
tag: Tech
originalTitle: "Mapping the Pokémon World: A Network Analysis of Habitat-Based Encounters"
link: "https://medium.com/towards-data-science/mapping-the-pok%C3%A9mon-world-a-network-analysis-of-habitat-based-encounters-9b8e5fe4db0a"
---



![Network Analysis](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_0.png)

# 소개

네트워크 분석은 다양한 개체의 관계, 연결 및 그룹화를 의미 있게 이해하기 위한 견고하면서도 직관적인 접근법입니다. 소셜 미디어 관점에서는 네트워크 분석을 사용하여 가장 의미 있는 연결을 가진 프로필을 이해할 수 있고, 전자 상거래 회사는 제품 간의 탐색 관계를 이해하기 위해 웹 분석을 활용할 수 있으며, 기업은 이메일 교신을 분석하여 어떤 팀이 자주 협업하는지 이해할 수 있습니다. 여러분이 작업 중인 데이터가 어떤 네트워크에 닮아 있다면, 네트워크 분석을 확실히 적용할 수 있습니다.

이 글에서는 Python을 통한 네트워크 분석, 네트워크 분석에서 얻을 수 있는 실용적인 통찰력, 그리고 인기 TV 및 게임 시리즈인 포켓몬과 함께 하는 재미있는 프로젝트에 대해 소개하겠습니다.


<div class="content-ad"></div>

# 네트워크 분석이란

![이미지](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_1.png)

이 주제에는 여러 정의가 있지만, 헬스 심리학 및 행동 의학 저널에는 이 주제에 대한 관점을 요약하는 정의가 포함된 기사가 있습니다. 이 기사에서 언급된 대로, 네트워크 분석(NA)을 수행하는 방법을 이해하게 해주는 수학적으로 강화된 시각화 접근 방법입니다.

다시 말해, NA는 데이터 세트 내 관측 사이의 복잡한 관계를 이해할 수 있게 해주는 수학적으로 강화된 시각화 접근 방법입니다. 시각화 자체는 서로 연결된 노드 집합입니다. 노드는 사람, 장소, 동물, 제품 등을 나타낼 수 있습니다. 이들을 연결하는 선은 두 노드 사이의 관계를 나타냅니다. 이는 모서리로 알려져 있습니다. 시각화에 추가로, 우리는 어떤 노드가 가장 중심화되어 있는지, 어떤 모서리가 노드 사이에 가장 많은 연결을 만들며, 주요 네트워크 내에서 서브네트워크(또는 커뮤니티)를 격리하는 데에 어떤 알고리즘 및 메트릭을 사용할 수 있습니다.

<div class="content-ad"></div>

# 파이썬 시작하기

먼저, Networkx 라이브러리를 가져와서 Networkx 그래프 객체를 생성하고 가상 데이터로 네트워크 그래프를 만들 것입니다. 만약 따라오시면서 아직 설치하지 않은 라이브러리가 있다면 본 글에서 언급된 라이브러리들을 설치해 주세요. 아래 이미지를 살펴보세요:

```python
import networkx as nx

G = nx.Graph()
G.add_edges_from([('A', 'B'), ('A', 'C'),('A','D'),('C','E'),
                  ('C','F'),('B','H'),('H','I'),('D','J'),
                  ('A','K'),('D','K'),('B','I'),('J','A'),
                  ('F','E'),('G','C'),('G','E')])

nx.draw(G, with_labels=True,node_color='lightblue', font_color='black', font_weight='bold')
```

![그림](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_2.png)

<div class="content-ad"></div>

이 그래프에서 무엇을 알 수 있나요? 기본적인 부분부터 시작해 봅시다. 파란 원 내부에 있는 글자는 데이터에서 노드를 나타냅니다. 상호 연결된 선들은 간선입니다. 더 실용적인 측면에서, 이 데이터가 소셜 미디어 사이트를 나타낸다고 가정해 봅시다. 노드는 개별 프로필을 나타낼 수 있고, 간선은 소셜 미디어에서 서로 친구인 두 프로필을 연결하는 것을 나타낼 수 있습니다.

기본 개념을 숙지했으니, 더 나아가 봅시다. 어떤 노드나 간선이 가장 중요한지 어떻게 알 수 있을까요? 노드나 간선의 중요성을 어떻게 양적으로 표현할 수 있을까요? 이 그래프를 보면, 서브네트워크나 커뮤니티를 뚜렷하게 확인할 수 있을까요? 이러한 개념들을 아래에서 자세히 살펴봅시다.

## 근접 중심성 (Closeness Centrality)

노드의 중요성을 어떻게 결정할 수 있을까요? 한 가지 방법은 근접 중심성이라는 측정치를 사용하는 것입니다. NetworkX 문서에 따르면, 노드(u)의 근접 중심성은 다음과 같이 정의됩니다:

<div class="content-ad"></div>

![포켓몬 월드에 대한 매핑 및 네트워크 분석 결과](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_3.png)

간단히 말해, 가장 높은 근접 중심성 점수를 가진 노드는 해당 노드에서 다른 노드까지 이동할 때 평균적으로 가장 많이 통과하는 노드입니다.

소셜 미디어 관점에서 생각해보죠. 가령, 여러분이 팔로워 수를 최대한 확보하려고 노력하는 인플루언서라고 상상해 봅시다. 최대한 많은 연결을 만들고 싶을 것이며, 그 방법 중 하나는 특정 프로필 그룹 내에서 중심성이 높은 다른 사람들과 연결을 만드는 것일 수도 있습니다. 이 중심적인 연결을 목표로 삼는다면 프로필 가시성이 극대화되어 더 많은 프로필에게 친구나 연결로 추천될 가능성이 높아집니다.

앞서 소개한 모의 네트워크를 다시 살펴보면, 가장 높은 근접 중심성 점수를 가진 노드는 무엇인가요? 제 의견으로는 노드 A가 모든 다른 노드들의 가운데에 위치하고 있는 것으로 보여 가장 높은 근접 중심성 점수를 가지고 있다고 주장합니다. 파이썬의 closeness_centrality 메서드를 사용하여 아래의 점수를 확인해 보겠습니다:

<div class="content-ad"></div>

```js
nx.closeness_centrality(G)
```

![image](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_4.png)

## 엣지 중심성

노드 사이의 일부 연결 또는 엣지가 다른 것들보다 중요한가요? 우리 그래프를 다시 살펴보면 어떤 엣지가 두드러지나요? A ~ B 및 A ~ C의 엣지는 특정 노드 클러스터를 연결하기 때문에 두드러집니다. 중요성을 정량화하는 원래의 점으로 돌아오면, NetworkX에서 정의한 엣지 중심성이라는 측정을 통해 이를 수행할 수 있습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_5.png)

좀 더 실용적으로 말하자면, 엣지 중심성(edge betweenness centrality)이 높을수록 해당 엣지가 모든 노드 사이의 최단 경로를 볼 때 자주 지나간다는 뜻입니다. 이들은 우리 네트워크를 유지하는 주요 다리 역할을 합니다.

엣지 중심성이 어떻게 유용하게 활용될 수 있는지 실제 예시를 살펴보겠습니다. 다양한 엔티티 간 거래 데이터를 살펴보고 있다고 가정해봅시다. 이 데이터를 가져와 엔티티를 나타내는 네트워크를 만들어 보면, 엣지는 서로 정기적으로 거래하는 엔티티들을 나타냅니다. 엣지 중심성이 가장 높은 엣지를 살펴보면, 본질적으로 이 준 금융 시스템을 연결하는 주요 연결점을 찾을 수 있습니다. 어떤 엔티티나 기관이 가장 많은 영향력을 가지는지 이해할 수 있으며, 그들을 제거하면 자금 흐름이 방해될 수 있습니다.

엣지 중심성을 어떻게 계산할까요? 원래의 예시로 돌아가서, NetworkX의 edge_betweenness_centrality 메서드를 사용할 수 있습니다. A~B 및 A~C 엣지에 대해 제 예측이 맞았는지 확인해보겠습니다.


<div class="content-ad"></div>

```js
nx.edge_betweenness_centrality(G)
```

![Image](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_6.png)

## 커뮤니티

우리의 그래프는 아주 쉽게 읽을 수 있고 상대적으로 작지만, 실제 데이터는 매우 견고하고 큽니다(보통 빅데이터라고 합니다). 이로 인해 네트워크 그래프가 매우 크고 읽기 어려울 수 있습니다. 그러므로 네트워크 내의 네트워크나 커뮤니티를 살펴보는 것이 도움이 될 수 있습니다.

<div class="content-ad"></div>

저희 그래프를 보면 노드 군집이 어떻게 커뮤니티를 나타내는지 비교적 간단하게 볼 수 있을 거에요. 예를 들어 노드 H, I 및 B가 한 커뮤니티를 나타내는 것을 쉽게 알 수 있습니다. 그러나 실제 데이터를 적절하게 확장하기 위해서는 알고리즘적으로 해야 해요. 그래서, 이번에는 기르반-뉴먼 알고리즘을 통해 독자를 안내할 거에요.

NetworkX 문서에는 이 알고리즘이 어떻게 작동하는지에 대한 매우 실용적인 정의가 나와 있어요.

앞서 말한 대로, 이 알고리즘은 반복적으로 작동합니다. 따라서 우리가 이를 구현할 때는 최고 엣지 중심성을 가진 엣지를 하나씩 제거하면서 의미 있는 커뮤니티 그래프가 남을 때까지 진행할 거에요. 이 알고리즘을 효과적으로 사용하는 핵심은 의미 없는 커뮤니티를 너무 적게 만들지 않으면서, 반대로 우리의 데이터에 더 많은 잡음을 만드는 커뮤니티르 너무 많이 만들지 않는 것이에요.

다시 한번, 이를 Python으로 구현해 봅시다. 이에는 몇 가지 단계가 더 필요하지만, 하나씩 나눠서 설명할 거에요. 먼저, Pyvis와 Matplotlib을 가져올 거에요. Pyvis 라이브러리는 NetworkX로 생성된 네트워크 그래프 객체와 함께 작동하여 더 멋진 네트워크 그래프를 만들 수 있게 해줍니다. Matplotlib은 커뮤니티용 컬러 맵을 생성하는 데 사용됩니다. 이 라이브러리들로 우리는 그래프의 모든 노드를 반복하면서 식별된 커뮤니티별로 색칠할 겁니다.

<div class="content-ad"></div>

우리는 데이터 내에서 커뮤니티를 찾기 위해 NetworkX의 girvan_newman() 함수를 사용할 것입니다. 여기서 이해해야 할 주요 기능은 이 함수가 반복자를 반환한다는 것입니다. 따라서 Python의 next() 함수를 사용하여 알고리즘으로 식별된 커뮤니티를 반복 처리할 것입니다. 우리의 네트워크 그래프를 다시 살펴보면, 개인적으로는 세 개의 명확한 커뮤니티를 보입니다. 따라서 세 번 반복할 것입니다. 실제 데이터를 다룰 때에는 여러 번의 시행착오가 필요할 수 있음을 유의해주세요.

마지막으로, 앞서 설명한 내용을 바탕으로 그래프에서 여러 요소를 변경할 수 있는 위젯이 포함된 HTML 파일이 최종 결과물임을 유의해주세요. 함께 따라오시는 경우, 이를 즐기는 데 즐겁게 활용해보세요!

<div class="content-ad"></div>

위의 커뮤니티가 이해됩니까? 그렇다고 생각해요! A~B와 A~C 엣지가 커뮤니티를 서로 연결하는 키포인트 엣지라는 것을 유의해보세요. 다시 한 번 Girvan-Newman 알고리즘을 사용하여 네트워크를 추가하거나 제거할 때 어떤 일이 발생하는지 살펴보세요.

# 포켓몬 네트워크

포켓몬 프로젝트를 시작할 시간입니다! 이 프로젝트에서는 포켓몬 게임 시리즈의 데이터를 살펴보겠습니다. 만약 포켓몬이 무엇인지, 특히 게임 시리즈가 무엇인지 익숙하지 않다면 걱정하지 마세요. 여기서 간단히 설명하겠습니다. 포켓몬 세계는 포켓몬이라고 불리는 생물과 사람들로 이루어져 있습니다. 일부 사람들은 트레이너라고 불리며 다른 트레이너와 함께 포켓몬을 잡고 키우고 싸웁니다. 게임 시리즈의 큰 부분이죠. 게임에서 포켓몬은 물, 풀, 숲, 동굴 등과 같은 여러 서식지에서 발견됩니다. 이 프로젝트에서는 게임 내에서 어느 서식지에서 발견될 수 있는지에 기반한 포켓몬의 네트워크 분석을 수행할 것입니다.

## 데이터

<div class="content-ad"></div>

데이터에는 포켓몬 게임과 관련된 거의 모든 데이터 포인트가 포함된 포켓몬API를 사용할 것입니다. 이 프로젝트에서는 주로 몇몇 포켓몬이 게임에서 어디에서 발견될 수 있는지 제공하는 충돌 엔드포인트에 관심을 가질 것입니다. 이 정보를 사용하여 여러 포켓몬 간의 연결을 합치고 만들어 네트워크를 생성할 수 있습니다!

현재 수천 가지의 포켓몬을 선택할 수 있지만, 각 게임은 일반적으로 하나의 세대에서만 포켓몬을 포함하고 이전 세대에서 몇몇을 선택합니다. 이것은 이전 세대의 포켓몬이 이어지는 게임에 계속 등장할 수 있기 때문에 우리의 네트워크를 초기 세대의 포켓몬 쪽으로 편향시킬 수 있습니다. 게임 중 하나인 그리고 내 어릴 적 즐겨했던 포켓몬 크리스탈 버전의 데이터를 살펴봅시다. 이 게임은 1세대와 2세대의 포켓몬을 가지고 있으므로 이 세대의 포켓몬 이름을 가져오도록 하는 함수를 편리하게 사용할 수 있도록 만들었습니다. 다음으로 1세대와 2세대의 모든 포켓몬 이름을 반복하고 등록지역 엔드포인트에서 여러 세부 정보를 추출하여 마스터 데이터 프레임을 만들 것입니다. 해당 데이터 프레임의 세부 정보를 포켓몬 크리스탈 버전을 위해 격리할 것입니다. 마지막으로, 각 행에 게임에서 적어도 하나의 공통 서식지에서 발견된 두 포켓몬을 가진 num_of_habitats 열이 있는 데이터 프레임을 만들기 위해 자체 조인을 수행할 것입니다. 최종 출력 형식은 Network Analysis 객체를 구축할 때 매우 중요합니다. 이 흐름을 편리성을 위해 아래의 세 가지 함수로 집합화했습니다!

```js
import requests
import pandas as pd

def get_pokemon_by_gen(gen):
  try:
    url = f'https://pokeapi.co/api/v2/generation/{gen}/'
    response = requests.get(url)
    data = response.json()
    pokemon_list = [pokemon['name'] for pokemon in data['pokemon_species']]
  except:
    print(f'세대 {gen}는 존재하지 않습니다.')
  return pokemon_list

def import_pokemon_multi_gen(gen_list):
  pokemon_list_for_df = []
  location_area_list = []
  version_details_list = []

  poke_lists = []
  for gen in gen_list:
    pokemon_list = get_pokemon_by_gen(gen=gen)
    poke_lists.extend(pokemon_list)

  for pokemon in poke_lists:
    encounter_url = f'https://pokeapi.co/api/v2/pokemon/{pokemon.lower()}/encounters'
    response = requests.get(encounter_url)
    encounter_data = response.json()
    for encounter in range(len(encounter_data)):
      location = encounter_data[encounter]
      location_name = location['location_area']['name']
      version_details = location['version_details']
      for version in range(len(version_details)):
        version_name = version_details[version]['version']['name']
        pokemon_list_for_df.append(pokemon)
        location_area_list.append(location_name)
        version_details_list.append(version_name)

  master_pokemon_df = pd.DataFrame({'Pokemon': pokemon_list_for_df,
                                    'Location_Area': location_area_list,
                                    'Location_Version': version_details_list})
  return master_pokemon_df

def create_pokemon_edgelist_df(pokemon_df):
  # Self-join을 사용하여 포켓몬 쌍을 생성하고 공통 서식지를 계산합니다
  common_habitats_edges = (
      pokemon_df.merge(pokemon_df_crystal, on='Location_Area', suffixes=('_1', '_2'))  # Location_Area로 Self-join을 수행합니다
      .query('Pokemon_1 != Pokemon_2')  # 동일한 포켓몬 쌍을 제외합니다
      .groupby(['Pokemon_1', 'Pokemon_2']).size().reset_index(name='num_of_habitats')  # 각 쌍의 고유 서식지를 계산합니다
  )

  # 열 이름 변경
  common_habitats_edges.columns = ['pokemon_1', 'pokemon_2', 'num_of_habitats']

  # 중복 제거
  common_habitats_edges['pair'] = common_habitats_edges.apply(lambda row: tuple(sorted([row['pokemon_1'], row['pokemon_2']])), axis=1)
  common_habitats_edges = common_habitats_edges.drop_duplicates(subset='pair').drop(columns='pair')
  common_habitats_edges = common_habitats_edges.reset_index(drop=True)

  return common_habitats_edges
```

```js
master_pokemon_df = import_pokemon_multi_gen(gen_list=[1, 2])
pokemon_df_crystal = master_pokemon_df[master_pokemon_df['Location_Version'] == 'crystal']
pokemon_edgelist = create_pokemon_edgelist_df(pokemon_df=pokemon_df_crystal)
pokemon_edgelist.head()
```

<div class="content-ad"></div>


![Network Mapping](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_8.png)

## 네트워크 구축

이미 Python에서 네트워크 그래프를 빌드하고 다양한 측정을 수행하는 방법을 검토했습니다. 이제 위의 데이터프레임과 같은 데이터를 입력으로 받아 네트워크 분석을 end-to-end로 수행하는 단일 객체를 만들겠습니다.

이 네트워크 분석 객체에는 다음을 수행하는 메서드가 포함될 것입니다:


<div class="content-ad"></div>

- NetworkX Graph 객체를 생성합니다.
- 우리가 논의한 중심성 점수의 정렬된 데이터프레임을 반환합니다.
- 주어진 개수의 Girvan-Newman 커뮤니티로 Pyvis 네트워크 그래프를 구축합니다.
- 노드 크기를 노드가 가지는 연결 수에 따라 조정하는 로직을 포함합니다.

이 섹션에서는 독자가 객체 지향 프로그래밍(OOP)에 대한 초급 수준의 이해를 가지고 있다고 가정합니다. OOP에 익숙하지 않다면 걱정하지 마세요. 각 객체를 개별적으로 다룰 것이며, 코드를 따라하면서 OOP를 학습했다는 것을 깨달을 것이라고 생각합니다!

## 초기화 함수

모든 객체와 마찬가지로, 새 객체를 생성할 때 호출되는 초기화 함수로 시작합니다. 여기서 우리는 초기 속성을 설정하는 곳인데, 특히 edgelist_df라고 부르는 초기 속성을 설정할 것입니다. 이전에 common_habitats_edges라는 데이터프레임을 만들었습니다. 이 데이터프레임은 사실 Pandas edge list 형식이라고 부르는 형식입니다. 우리는 이 형식의 데이터프레임을 사용하여 from_pandas_edgelist 메서드를 통해 NetworkX Graph 객체를 생성할 수 있습니다. 이 객체가 만들 수 있는 Network Graph를 위해 남은 속성은 예약되어 있습니다.

<div class="content-ad"></div>

```js
class NetworkGraph():
  def __init__(self, edgelist_df, width, height, bgcolor, font_color):

    self.edgelist_df = edgelist_df
    self.width = width
    self.height = height
    self.bgcolor = bgcolor
    self.font_color = font_color
    self.G = None

    ## 중심성 데이터프레임
    self.betweenness_df = None
    self.closeness_df = None

    ## 커뮤니티
    self.community_map = None
```

## create_network_graph_object 메서드

이 메서드는 edgelist_df 속성을 사용하여 NetworkX 그래프 객체를 생성합니다. 또한 우리가 이전에 논의한 에지 매개 중심성 및 근접 중심성 점수를 DataFrame 형식으로 가져옵니다. 노드 및 엣지에 대한 이러한 점수를 빠르게 확인할 수 있게 됩니다. 아직 검토하지 않은 내용이 있을 수 있습니다: 노드 차수입니다. 노드 차수는 노드가 다른 노드에 연결된 모든 연결을 나타냅니다. 이 차수 점수를 사용하여 노드의 크기를 조절할 것입니다. 다시 말해, 더 많은 연결을 가진 노드는 최종 네트워크 그래프에서 더 크게 표시됩니다.

```js
 def community_graph_html(self, num_communities, html_filename):
    if self.G == None:
      raise ValueError("네트워크 그래프 객체가 아직 생성되지 않았습니다.")
    else:

      # 지정된 레벨의 커뮤니티 가져오기
      communities = get_communities_at_level(G=self.G, level=num_communities)

      # 노드에 커뮤니티 ID 할당
      community_map = {}
      for community_id, community in enumerate(communities):
          for node in community:
              community_map[node] = community_id
      self.community_map = community_map

      # PyVis 네트워크 생성
      net = Network(notebook=True)
      net.from_nx(self.G)

      # matplotlib에서 컬러맵 가져오기
      cmap = plt.get_cmap('tab20')
      norm = mcolors.Normalize(vmin=0, vmax=len(communities)-1)

      # 노드 속성 사용자 정의
      for node in net.nodes:
          node_id = node['id']
          community_id = community_map[node_id]
          color = mcolors.rgb2hex(cmap(norm(community_id)))  # 컬러맵 값을 16진수 색상으로 변환
          node['color'] = color
          node['size'] = self.G.degree[node_id]  # 가시성을 높이기 위한 크기 조정

      net.show_buttons(filter_=['nodes', 'edges', 'physics'])

      # 네트워크 그래프 생성 및 표시
      net.show(html_filename)
```


<div class="content-ad"></div>

## community_graph_html 메서드

마지막으로, community_graph_html 메서드가 있습니다. 네트워크 그래프를 생성하는 것 외에, 이 메서드는 Girvan-Newman 알고리즘에 의해 식별된 커뮤니티에 따라 노드를 색상으로 코딩할 것입니다. 언급했듯이, 이 알고리즘은 반복적이기 때문에 얼마나 많은 커뮤니티가 합리적인지를 시행착오를 통해 결정해야 합니다. 이 단계에서는 community_map 속성을 채우기도 합니다. 이는 네트워크 내의 모든 포켓몬과 해당 커뮤니티를 나타내는 사전입니다.

## 모두 함께 살펴보기

우리의 데이터가 가져오되고, 네트워크 객체가 생성되었습니다. 가장 밀접도 및 가장 많은 매개 중심성 점수를 가진 노드 (포켓몬) 및 엣지 (포켓몬 간 연결)를 검토하여 네트워크 분석을 시작해보죠.

<div class="content-ad"></div>

```js
pokemon_na = NetworkAnalysis(edgelist_df=pokemon_edgelist, width="100%", height="1200px", bgcolor='white', font_color='black')
pokemon_na.create_network_graph_object()
```

## 중심성

```js
pokemon_na.closeness_df.sort_values(by='centrality', ascending=False).head()
```

![이미지](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_9.png)


<div class="content-ad"></div>

매직카프는 저희의 가장 중심적인 노드입니다. 여기서 중심적인 것은 게임에서 다른 포켓몬과 거의 모든 서식지에 높은 경향성이 있다는 것을 의미합니다. 우리 목록에서 다음 네 마리 포켓몬에 대해서도 동일한 이야기를 할 수 있습니다.  
크리스탈 버전 포켓몬을 수없이 플레이한 사람들에게는 이것이 놀라운 점은 아닐 것입니다. 매직카프는 게임의 거의 모든 물 서식지에서 발견할 수 있습니다. 또한 랏타와 같은 포켓몬은 거의 모든 풀과 같은 서식지에서 발견됩니다.  
놀랍게도, 이 두 포켓몬은 중심성 점수 목록 상단에 위치하고 있습니다.

## 엣지 중심성

```js
pokemon_na.betweenness_df.sort_values(by='centrality', ascending=False).head()
```

![Image](/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_10.png)

<div class="content-ad"></div>

가장 높은 엣지 중심성 점수는 예외적으로 낮습니다. 이것은 즉시 이 네트워크가 매우 상호 연결되어 있으며 한 커뮤니티를 다른 커뮤니티로 연결하는 단일 엣지가 없다는 것을 알려줍니다. 이것은 데이터 내에서 커뮤니티를 찾을 때 문제가 될 수 있습니다. 그 통찰을 얻었지만, 이제 상위 점수를 살펴 보겠습니다. 다시 한번, 여기서 제 개인적인 도메인 지식이 도움이 될 수 있습니다. 포켓몬 스윈럽, 스니저, 루주라, 델리버드는 포켓몬 크리스탈 게임 버전의 특정 동굴에서만 발견됩니다. 또한, 골뱃은 이 동굴과 게임의 여러 다른 서식지에서 발견됩니다. 따라서 이 골뱃 엣지들은 다른 네 개의 포켓몬을 네트워크의 나머지 부분에 연결하는 중요한 다리 역할을 합니다.

## 네트워크 시각화 및 커뮤니티 찾기

우리는 마침내 기다려온 순간에 도달했습니다. 이제 포켓몬 네트워크 그래프를 시각화할 시간입니다. 앞서 생성한 create_network_graph_object를 사용할 것이지만, 특정 수의 커뮤니티를 지정해야 합니다. 엣지 중심성 결과를 기반으로, 많은 구분된 커뮤니티를 볼 수 없을 수 있습니다. 따라서 Girvan-Newman 알고리즘을 사용하여 데이터를 두 개의 커뮤니티로 분할할 것입니다. num_communities 매개변수를 1로 설정하여 이를 수행합니다. 따라서 여는 중인 경우, 그래프 이미지 아래에 여러 위젯이 있습니다. 그래프의 미적 요소를 최적화하기 위해 옵션들을 살펴보는 것을 잊지 마세요!

```js
pokemon_na.community_graph_html(num_communities=1,html_filename='Pokemon_comm_graph.html')
```

<div class="content-ad"></div>

<!DOCTYPE html>
<html>
<body>

<h1>Welcome to our website!</h1>
<p>This is a paragraph.</p>

</body>
</html>

<div class="content-ad"></div>

일부 시행착오 끝에, 일반 서식지 상위 90% 이상의 가장자리를 필터링했습니다. 이것은 그래프가 훨씬 더 가독성있다면 좋은 지점입니다. 게다가, 그래프가 여전히 추가적인 구분된 커뮤니티를 보여주지 않기 때문에 데이터가 어떻게 작용하는지 알아보기 위해 한 개의 더 커뮤니티를 추가했습니다. 데이터가 어떻게 분할되는지 살펴볼 수 있도록 커뮤니티 수를 다양하게 조정해보는 것을 독자에게 권장합니다!

```js
import numpy as np
pokemon_edgelist_filtered = pokemon_edgelist[pokemon_edgelist.num_of_habitats > np.percentile(pokemon_edgelist.num_of_habitats, 90)].reset_index(drop=True)

pokemon_na = NetworkAnalysis(edgelist_df = pokemon_edgelist_filtered,width = "100%",height = "100%",bgcolor = 'white',font_color = 'black')
pokemon_na.create_network_graph_object()
pokemon_na.community_graph_html(num_communities=2,html_filename='Pokemon_comm_graph_filtered.html')
```

<img src="/assets/img/2024-06-20-MappingthePokmonWorldANetworkAnalysisofHabitat-BasedEncounters_12.png" />

# 결론

<div class="content-ad"></div>

네트워크 분석에 대한 제 이야기를 즐겨주셨기를 바라며 포켓몬 세계를 탐험하는 데 즐거움을 느꼈기를 바랍니다! 네트워크 분석은 끝없는 가능성을 제공하며, 이 이야기에서 논의된 기술만으로 얻을 수 있는 독특한 통찰력을 제공합니다. 다른 데이터 세트에서도 이를 시도해 보는 데 두려워하지 마세요!

이 이야기가 마음에 드셨다면, 더 많은 데이터 과학, Python, 기계 학습, 금융, A/B 테스팅 등에 대한 이야기를 위해 여기에서 제 팔로우를 눌러주시기 바랍니다!

BSD 3-Clause “New” or “Revised” License

Copyright © © 2013–2023 Paul Hallett and PokéAPI contributors (https://github.com/PokeAPI/pokeapi#contributing). 포켓몬 및 포켓몬 캐릭터 이름은 닌텐도의 상표입니다.

<div class="content-ad"></div>

**저작권 보호됨.**

## 참고 자료

- Hevey, David. “Network Analysis: A Brief Overview and Tutorial.” Health Psychology and Behavioral Medicine, 미국 국립의학도서관, 2018년 9월 25일, www.ncbi.nlm.nih.gov/pmc/articles/PMC8114409/.
- NetworkX. (n.d.). 중심성 계층. In NetworkX Documentation. 2024년 6월 11일 조회, https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.closeness_centrality.html#networkx.algorithms.centrality.closeness_centrality.
- NetworkX. (n.d.). 엣지 중심성 계층. In NetworkX Documentation. 2024년 6월 11일 조회, https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.closeness_centrality.html#networkx.algorithms.centrality.closeness_centrality.
- NetworkX. (n.d.). Girvan-Newman. In NetworkX Documentation. 2024년 6월 11일 조회, https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.closeness_centrality.html#networkx.algorithms.centrality.closeness_centrality.