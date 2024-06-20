---
title: "사막  숨겨진 네트워크"
description: ""
coverImage: "/assets/img/2024-06-19-DuneAHiddenNetwork_0.png"
date: 2024-06-19 15:54
ogImage: 
  url: /assets/img/2024-06-19-DuneAHiddenNetwork_0.png
tag: Tech
originalTitle: "Dune — A Hidden Network"
link: "https://medium.com/towards-data-science/dune-a-hidden-network-5ed9dea5c52f"
---


<img src="/assets/img/2024-06-19-DuneAHiddenNetwork_0.png" />

# 이 기사에서, Patrik Szigeti와 함께 우리는 오리지널 '둠' 삼부작 뒤의 복잡한 사회 네트워크를 개괄하는 그래프 시각화를 지원하는 데이터 및 네트워크 방법론을 설계했습니다.

2021년에 박스 오피스에서와 평론가들로부터의 성공을 거두자마자, 2024년 '둠: 파트 투'는 가장 기대되는 영화 중 하나였으며, 실망시키지 않았습니다. 본 글 작성 시점에서 이전 작품보다 Rotten Tomatoes와 IMDb에서 평점이 높고 더 많은 수익을 올릴 것으로 예상되는 '둠'은 변화무쌍한 정치적 풍경을 가졌으며, 네트워크 과학을 통해 탐구하기에 완벽한 시리즈입니다. 본 짧은 글에서, 우리는 프랭크 허버트의 처음 세 책 - '둠' (1965), '둠 메시아' (1969), 그리고 '둠의 아이들' (1976)을 바탕으로 Impremium의 다른 가문과 인물들 간의 연결을 탐구하기 위해 노력했습니다.

이 기사의 첫 번째 부분에서는 '둠' 위키에서 캐릭터 프로필 데이터를 수집하는 파이썬 기반 방법을 소개하고 이러한 프로필을 재미있는 네트워크 그래프로 변환합니다. 그런 다음, 두 번째-스포일러가 많이 담긴-섹션에서, 우리는 네트워크의 심도에 빠져 첫 번째 '둠' 삼부작이 전하는 모든 이야기를 추출합니다.

<div class="content-ad"></div>

모든 이미지는 저자들에 의해 만들어졌습니다.

# 1 네트워크 구축

먼저, 우리는 Python을 사용하여 두네 캐릭터들의 전체 목록을 수집합니다. 그런 다음, 각 캐릭터의 팬 위키 사이트에서 그들의 전기 프로필을 다운로드하고 각 캐릭터의 이야기가 다른 캐릭터의 이야기를 언급한 횟수를 계산합니다. 이를 통해 두 캐릭터 간의 다양한 상호작용을 인코딩한다고 가정합니다. 그런 다음, 이러한 관계를 복잡한 그래프로 변환하기 위해 네트워크 과학을 사용할 것입니다.

1.1 캐릭터 목록 수집

<div class="content-ad"></div>

먼저, 뒤니 팬 위키 사이트에서 관련 캐릭터 목록을 수집했습니다. 구체적으로, urllib와 bs4를 사용하여 언급된 각 캐릭터의 이름과 팬 위키 ID를 추출했습니다. 그리고 각 캐릭터가 자체적으로 위키 페이지가 있으며 해당 ID로 인코딩되어 있다는 사실도 확인했습니다. 이를 Dune, Dune Messiah 및 Children of Dune 세 권의 첫 세 권에 적용하였는데, 이 책들은 아트레이드 가문의 부상을 다루고 있습니다.

참고 링크:
- https://dune.fandom.com/wiki/Dune_(novel)
- https://dune.fandom.com/wiki/Dune_Messiah
- https://dune.fandom.com/wiki/Children_of_Dune_(novel)

첫 번째로, 캐릭터 목록 사이트의 HTML을 다운로드하세요:

<div class="content-ad"></div>

```js
dune_meta = {
    'Dune': {'url': 'https://dune.fandom.com/wiki/Dune_(novel)'},
    'Dune Messiah': {'url': 'https://dune.fandom.com/wiki/Dune_Messiah'},
    'Children of Dune': {'url': 'https://dune.fandom.com/wiki/Children_of_Dune_(novel)'}
}

for book, url in dune_meta.items():
    sauce = urlopen(url['url']).read()
    soup  = bs.BeautifulSoup(sauce,'lxml')
    dune_meta[book]['chars'] = soup.find_all('li')
```

약간의 수동 작업을 통해 캐릭터 이름과 ID를 세밀하게 조정해주었습니다:

```js
dune_meta['Dune']['char_start'] = 'Abulurd'
dune_meta['Dune']['char_end'] = 'Arrakis'
dune_meta['Dune Messiah']['char_start'] = 'Abumojandis'
dune_meta['Dune Messiah']['char_end'] = 'Arrakis'
dune_meta['Children of Dune']['char_start'] = '2018 Edition'
dune_meta['Children of Dune']['char_end'] = 'Categories'
```

그런 다음, 모든 관련 이름과 해당 프로필 URL을 추출했습니다. 여기서, 캐릭터 이름이 어디서 시작하는지 수동으로 확인하고 ('캐릭터 목록 사이트의 개요와는 대조적') 추가로, 확장 시리즈에 해당하는 'XD' 및 'DE'로 표시된 캐릭터 및 특정 책에서 "언급만 된" 캐릭터들은 제외하기로 결정했습니다:

<div class="content-ad"></div>

```js
for k, v in dune_meta.items():
    names_urls = {}
    keep_row = False
    print(f'----- {k} -----')
    for char in v['chars']:
        if v['char_start'] in char.text.strip():
            keep_row = True
        if v['char_end'] in char.text.strip():
            keep_row = False
        if keep_row and 'Video' not in char.text:
            try:
                url = 'https://dune.fandom.com' + str(char).split('href="')[1].split('" title')[0]
                name = char.text.strip()
                if 'wiki' in url and 'XD' not in name and 'DE' not in name and '(Mentioned only)' not in name:
                    names_urls[name] = url
                    print(name)
            except:
                pass
    dune_meta[k]['names_urls'] = names_urls
```

그런 다음 이 코드 블록은 다음과 같은 문자 목록을 출력합니다:

<img src="/assets/img/2024-06-19-DuneAHiddenNetwork_1.png" />

마지막으로, 수집한 문자 수를 확인하고 다음 소단원을 위해 프로필 URL과 식별자를 저장합니다.

<div class="content-ad"></div>

```js
dune_names_urls = {}
for k, v in dune_meta.items():
    dune_names_urls.update(dune_meta[k]['names_urls'])

names_ids  = {n : u.split('/')[-1] for n, u in dune_names_urls.items()}

print(len(dune_names_urls))
```

이 셀의 출력 결과는 프로필 URL이 포함된 119자입니다:

<img src="/assets/img/2024-06-19-DuneAHiddenNetwork_2.png" />

1.2 캐릭터 프로필 다운로드

<div class="content-ad"></div>

우리의 목표는 '둠(Dune)' 캐릭터들의 소셜 네트워크를 그리는 것입니다. 이것은 누가 누구와 상호작용했는지 파악해야 한다는 것을 의미합니다. 이전 하위 장에서는 '누가'의 목록을 얻었고, 이제 그들의 개인 이야기 정보를 얻을 것입니다. 이러한 이야기들은 간단한 웹 스크래핑 기술을 다시 사용하여 가져오고, 그리고 각 캐릭터의 개인 사이트의 소스를 로컬에 별도 파일로 저장할 것입니다:

```js
# 프로필 html 파일을 저장할 폴더
folderout = 'fandom_profiles'
if not os.path.exists(folderout):
    os.makedirs(folderout)
      
# 프로필 html 파일 가져오기 및 저장
for ind, (name, url) in enumerate(dune_names_urls.items()):
    if not os.path.exists(folderout + '/' + name + '.html'):
        try:
            fout = open(folderout + '/' + name + '.html', "w")
            fout.write(str(urlopen(url).read()))
        except:
            pass
```

이 코드를 실행한 결과는 저희 로컬 디렉토리에 각 선택된 캐릭터에 속한 모든 팬 위키 사이트 프로필이 있는 폴더가 생성됩니다.

## 1.3 네트워크 구축하기

<div class="content-ad"></div>

캐릭터 간 네트워크를 구축하기 위해서는, 각 캐릭터의 위키 사이트 소스가 다른 캐릭터의 위키 식별자를 얼마나 자주 참조하는지 카운트합니다. 다음과 같은 로직을 사용합니다. 여기서는 소스와 대상 노드(캐릭터)의 연결을 포함하는 연결 목록 - 두 캐릭터 페이지 간에 공동 참조 빈도를 포함하는 연결의 무게도 포함하는 연결 목록을 구축합니다.

```js
# html 소스에서 이름 언급을 추출하고 연결 목록을 딕셔너리로 구성
edges = {}

for fn in [fn for fn in os.listdir(folderout) if '.html' in fn]:

    name = fn.split('.html')[0]
    
    with open(folderout + '/' + fn) as myfile:
        text = myfile.read()
        soup  = bs.BeautifulSoup(text,'lxml')
        text = ' '.join([str(a) for a in soup.find_all('p')[2:]])
        soup = bs.BeautifulSoup(text,'lxml')
        
        
        for n, i in names_ids.items():
            
            w = text.split('Image Gallery')[0].count('/' + i) 
            if w>0:
                edge = '\t'.join(sorted([name, n]))
                if edge not in edges:
                    edges[edge] = w
                else:
                    edges[edge] += w

len(edges)
```

이 코드 블록을 실행하면, 119명의 둥니 캐릭터를 연결하는 307개의 엣지가 있는 결과를 얻을 수 있습니다.

다음으로, NetworkX 그래프 분석 라이브러리를 사용하여 엣지 목록을 그래프 객체로 변환하고, 그래프가 가지고 있는 노드와 엣지의 수를 출력합니다:

<div class="content-ad"></div>

```python
# dict of edges로부터 networkx 그래프를 생성합니다
import networkx as nx
G = nx.Graph()
for e, w in edges.items():
    if w > 0:
        e1, e2 = e.split('\t')
        G.add_edge(e1, e2, weight=w)

G.remove_edges_from(nx.selfloop_edges(G))

print('노드 수: ', G.number_of_nodes())
print('엣지 수: ', G.number_of_edges())
```

위 코드 블록의 결과:

<img src="/assets/img/2024-06-19-DuneAHiddenNetwork_3.png" />

노드 수는 단 72개이며, 47개의 문자가 어떤 중심 구성원과도 연결되지 않았음을 의미합니다. 아마도 해당 인물들의 위키 프로필은 꽤 간결한 것으로 보입니다. 게다가 몇 개의 자기 루프가 제거되어 엣지 수가 4개 줄었습니다.


<div class="content-ad"></div>

내장 Matplotlib 플로터를 사용하여 네트워크를 간단히 살펴보겠습니다:

```js
# 네트워크를 매우 간단히 살펴봅니다
import matplotlib.pyplot as plt
f, ax = plt.subplots(1,1,figsize=(15,15))
nx.draw(G, ax=ax, with_labels=True)
```

셀의 출력:

<img src="/assets/img/2024-06-19-DuneAHiddenNetwork_4.png" />

<div class="content-ad"></div>

현재 이 시각화에서 이미 네트워크 구조가 일부 보입니다. 우리는 다음 코드 라인을 사용하여 그래프를 Gephi 파일로 내보내었고, 아래 그림에 첨부된 네트워크를 설계했습니다 (이러한 네트워크 시각화 방법은 곧 나올 튜토리얼 기사의 주제가 될 것입니다):

```js
nx.write_gexf(G, 'dune_network.gexf')
```

전체 Dune 네트워크:

# 2 네트워크 읽기

<div class="content-ad"></div>

"우리 네트워크의 중심에 폴 아트레이데스(리산 알-가이브, 무앗 딥, 우술, 코이삷 하데라흐 등으로도 불립니다)를 발견할 것이라는 것은 놀라운 일이 아닙니다. 그는 첫 번째 책(그리고 영화)의 주인공이자 마지막에는 제국 황제로 자리를 꿰차는 중요한 인물입니다. 두 번째 책인 '듄의 메시아'에서 우리는 전쟁을 벌이고 예지의 능력에 저주받은 지 오랜 기간 후의 리더인 다른 폴을 만나게 됩니다. 그는 블라인드 프레멘으로 사막으로 걸어가 스스로를 샤이-훌루드에 바칩니다. 그리고 나중에 '듄의 아이들'에서 등장하는 '선지자'로 나타납니다. 이 여정동안 그는 다른 많은 캐릭터와 마주하게 됩니다. 그의 이른바 이고 네트워크 — 그의 모든 연결 및 그 사이의 연걸 포함한 서브그래프 —는 모든 노드의 약 절반과 모든 링크의 64%를 포함하고 있음을 잘 보여줍니다. 아래에 그림도 나와 있습니다.

![그림](/assets/img/2024-06-19-DuneAHiddenNetwork_5.png)

우리는 네트워크를 계속 읽고 있으면 아트레이데스 가문이 중심에 자리하고 있음을 알 수 있습니다. 물론, 폴 주변에는 가족이 있습니다. 부모인 제시카 여사는 레토 아트레이데스 1세의 후궁이자 베네 게서릿 현자님입니다. 제시카는 하우스 하코넨의 블라디미르 하코넨의 딸로, 노드 그룹 중 노란색과 연한 파란색 노드 그룹 간의 첫 연결을 우리에게 보여줍니다. 폴과 프레멘 후궁 차니 사이에 강한 연결이 있으며, 그들의 자녀 레토 2세와 가니마와도 연결되어 있습니다. 폴은 멘토이자 친한 친구인 던컨 아이다호와 거니 할렉뿐만 아니라 베네 게서릿 현자인 가이우스 헬렌 모힘과도 밀접한 연결이 있습니다. 이 네트워크가 분명히 폴을 중심으로 하고 있음에도 불구하고 하우스 코리노(갈색), 하우스 하코넨(연한 파란색), 프레멘(파란색)의 명확한 그룹을 볼 수 있습니다. 하지만 우리에게 정말 흥미로운 점은 위키백과 기사를 기반으로 만든 이 간단한 네트워크가 이 세 권의 책 속 전개되는 줄거리에 대해 우리에게 많은 정보를 제공하고 있다는 것입니다."

<div class="content-ad"></div>

Liet Kynes는 프레멘의 사실상의 지도자이자 식물학자로, 황량한 행성 아라키스가 푸르른 목초지와 물 공급으로 부자로 변하는 것을 꿈꾸었습니다. 그의 딸 Chani는 폴의 삶에서 중요한 인물인 스틸가와 연결되며 종교적인 추종자이자 프레멘 전체와 연결됩니다. 그러나 두 사이에 스키탈이 있었는데, 그는 무아딥의 지하, 덩컨 아이다호의 고라(죽은 개인을 복제한 인공적으로 창조된 인간)를 통해 로열 가문을 파괴하려 계획했습니다. 영화만 보신 분들은 덩컨이 우리 네트워크에서 중요한 인물이라는 것에 놀라실 수도 있지만, 아트레이데 집안의 검술사로 일한 뒤 아라키스 사막 전투에서 전사한 후, 상기된 고라로 돌아와 알리아 아트레이데스와 결혼하며 중요한 역할을 했습니다. 레이디 제시카의 딸이자 폴의 자매인 알리아 아트레이데스와 결혼하며 중요한 역할을 했습니다.

영화 시청자들은 하코넨 집안의 일원으로서 투피어 하와트의 색채에도 놀라실지 모릅니다. 하우스 아트레이데스의 안전을 책임지는 멘타트인 그는 하코넨 집안이 아트레이데스를 아라키스 통치자로 대체한 후 그들의 봉사자로 강제로 들어가고 있었으며, 그들에게 반항하고 있었지만, 진정한 목표는 그가 사랑하는 덕의 죽음을 복수하는 것이었습니다. 제시카 여사가 공격의 배후라고 생각한 자데 그 후 그는 폴을 죽이지 않고 자살하는 행동으로 구원을 얻었습니다.

그러나 이 네트워크에서 가장 매혹적인 부분은 캐릭터의 노드가 얼마나 작아 보이든 이들이 줄거나 중요한 역할을 하지 않았다는 뜻은 아닙니다. 그들은 올바른 말을 잘못된 대상에게 했을 수도 있었으며(Paul이 무아딥이 되기 전에 인간성의 중요한 요소를 잃었다고 주장한 Ix의 브론소), 알리아 아트레이데스의 연인이 되었을 수도 있으며(Javid), 아트레이데스 쌍둥이 레토와 가니마를 죽이려 계획했을 수도 있습니다(Tyekanik). 계속해서 말씀드릴 수 있습니다. 이들은 프랭크 허버트의 '듄'의 흥미진진하고 서로 연결된 정치적 배경 중 몇 가지 예일 뿐입니다.

<div class="content-ad"></div>

이 기사를 통해, 데이터 과학 팬과 둥팬 사이에 다리를 만들고, 이 두 그룹 사이에 이미 존재하는 겹치는 커뮤니티를 재미있게 할 수 있도록 목표로 했습니다. 먼저, Python에서 상대적으로 일반적인 프레임워크를 제시하여 만날 수 있는 모든 팬 위키 사이트의 소셜 네트워크를 매핑할 수 있도록 했습니다. 둘째, 이 네트워크 시각화가 전체 이야기가 펼쳐지는 방식을 자세히 해석했습니다. 수많은 단어가 꼬리표가 되는 사진, 심지어 삼부작 이상의 가치를 지닌 사진입니다.