---
title: "NBA 네트워크 분석 Neo4j를 활용한 연결하기"
description: ""
coverImage: "/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_0.png"
date: 2024-05-27 12:40
ogImage:
  url: /assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_0.png
tag: Tech
originalTitle: "NBA Network Analysis: Connecting the Dots with Neo4j"
link: "https://medium.com/@lucca.miorelli/nba-network-analysis-connecting-the-dots-with-neo4j-99cfbddd306b"
---

## 두 NBA 선수 사이의 가장 짧은 링크를 찾는 동안... 그리고 그래프 데이터베이스로 놀아보기.

![Image](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_0.png)

# 소개

NBA 경기를 관람하다가 해설자들이 가리키는 선수들 간의 예상치 못한 연결에 흥미를 느낀 적이 있나요? 이러한 즉흥적인 발언에 영감을 받아 우리는 프로젝트에 착수했습니다. 영화 역할을 통해 이질적인 배우들을 연결하는 '케빈 베이컨의 여섯 단계'의 개념과 마찬가지로 NBA 선수들을 비슷한 방식으로 연결하려고 노력했습니다.

<div class="content-ad"></div>

이 블로그 포스트에서는 우리가 그래프 데이터베이스를 탐험한 과정과 다른 세대의 NBA 선수들 간의 관계를 발견하는 데 Neo4j를 어떻게 활용했는지에 대해 안내해드릴 거에요.

![이미지](https://miro.medium.com/v2/resize:fit:996/0*ZjUZ-n48dZTqe14R.gif)

# 프로젝트 개요

우리의 목표는 명확했습니다: 서로 다른 NBA 선수들 간의 가장 짧은 경로를 식별하는 것이었어요. 이를 달성하기 위해 NBA 드래프트 데이터와 함께 작업하여, Neo4j를 사용해 복잡한 선수 간의 연결을 매핑하는 데 도움을 받았어요. 이 작업은 단순히 숫자들을 연산하는 데 그치는 것이 아니라, 데이터 안에 숨겨진 매력적이고 가끔은 꽤 재미있는 이야기들을 발견하는 데 관한 것이었어요.

<div class="content-ad"></div>

다음은 이 프로젝트를 복제하는 데 필요한 단계를 간략하게 설명합니다:

- 필요한 데이터 확보하기;
- 데이터를 노드와 엣지로 포맷팅하기;
- Neo4j 데이터베이스 인스턴스 구성하기;
- 데이터를 Neo4j로 가져오기;
- 데이터와 상호 작용하기 위해 Cypher 표기법 활용하기.

# 데이터 획득과 처리

대부분의 데이터 애호가들처럼, 우리는 NBA 드래프트 데이터에 초점을 맞춘 Kaggle에서 데이터셋을 확보했습니다. 그런 다음 Python을 사용하여 이 데이터셋을 처리했습니다. 이 과정은 데이터를 그래프 데이터베이스에 필요한 형식에 맞게 변환하는 것을 포함했습니다: 엔티티를 노드로 분할하고 연결을 엣지로 나누는 것입니다.

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:608/0*eaiZYXxaq4pFOsiH.gif)

After some basic processing, we can input the data to the Neo4j instance using the neo4j python package.

To increase the complexity of our ‘Six Degrees’ game though, we decided to only consider relationships of players with the team they were initially drafted from, rather than all the teams they played for throughout their career. A good challenge always adds a bit of spice!

# Why Graph Databases?


<div class="content-ad"></div>

간단히 말해서, 그래프 데이터베이스는 데이터를 노드에 저장하고 노드 간의 관계를 엣지를 사용하여 표현합니다. 이를 통해 NBA 선수 연결과 같이 복잡하게 연결된 데이터를 시각화하고 분석하는 데 적합합니다.

이 프로젝트에 구조화된 데이터베이스를 사용할 수도 있었지만, 몇 가지 이유로 그래프 데이터베이스를 선택했습니다. 그 이유 중 일부는 다음과 같습니다: 데이터 포인트 간의 복잡한 연결을 처리하는 데 더 적합하다는 점; 데이터가 얼마나 크고 복잡하더라도 빠르고 효율적으로 유지한다는 점; 무엇보다도 이러한 데이터베이스의 시각적인 특성 덕분에 선수 간의 연결을 이해하고 확인하기 쉽습니다. ‘Six Degrees’와 같은 프로젝트에서 두 선수 간의 가장 짧은 링크를 찾는 경우, 그래프 데이터베이스가 정말 빛을 발합니다.

# Neo4j 사용하기

이 프로젝트에 사용한 도구는 Neo4j였습니다. 우리는 Neo4j의 무료 샌드박스를 활용했는데, 이는 비용 없이 이용할 수 있는 작고 임시적인 데이터베이스입니다. 인스턴스를 설정하고 그 가능성을 발견하고 싶다면 위 링크를 통해 시도해보세요.

<div class="content-ad"></div>

다음과 같이 노드가 생성되었습니다:

- Player: NBA 선수를 나타냅니다. (예: Jalen Brunson)
- Team: NBA 프랜차이즈를 나타냅니다. (예: Dallas Mavericks)
- Organization: 선수가 선발된 대학, 대학교 및 국제 기관을 나타냅니다. (예: Villanova)
- Draft Class: 실제 드래프트 연도를 나타냅니다. (예: 2018)

노드 간의 연결은 다음 엣지를 통해 설정됩니다:

- DRAFTED_BY: 선수와 프랜차이즈를 연결합니다. (예: Jalen Brunson ↔ Dallas Mavericks)
- IS_OF_DRAFT_SEASON: 선수와 드래프트 클래스를 연결합니다. (예: Jalen Brunson ↔ 2018)
- IS_OF_ORG: 선수와 기관을 연결합니다. (예: Jalen Brunson ↔ Villanova)

<div class="content-ad"></div>

위의 텍스트를 번역하면 다음과 같습니다.

네오4j 데이터베이스를 채우고 아래와 같이 시각적으로 매력적인 그래프를 만들 수 있었어요! 다음과 같은 Cypher 구문을 사용하여 데이터베이스를 쿼리할 수 있어요:

```js
# 제일로 브런슨(Jalen Brunson)의 연결을 보여줘 (id: 1628973)
MATCH (n:Player {id: 1628973})
RETURN n
```

<img src="/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_1.png" />

하나의 선수의 연결을 시각화하고 그리는 것은 비교적 쉽지만, 대량의 개체를 처리할 때 복잡해집니다. 여기서 그래프 데이터베이스의 강점이 정말로 드러나는 거죠!

<div class="content-ad"></div>

아래는 Markdown 형식으로 변환된 표입니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*2jWbvPxLe9SzQw_YTXR11A.gif)

# 결과 및 발견

몇 가지 간단한 쿼리를 사용하여 데이터 세트를 탐색할 수 있습니다:

```js
# 유형별 그룹화된 모든 엣지 수 세기
MATCH ()-[relationship]->()
RETURN TYPE(relationship) AS type, COUNT(relationship) AS amount
ORDER BY amount DESC;

# 유형별 그룹화된 모든 노드 수 세기
MATCH (n)
RETURN labels(n)[0] AS type, COUNT(*) AS amount
ORDER BY amount DESC;
```

<div class="content-ad"></div>

아래는 결과 요약입니다:

### 노드 (8,900)

- Player: 7,884
- Organization: 903
- DraftClass: 74
- Team: 39

### 연결 (24,320)

<div class="content-ad"></div>

- IS_OF_DRAFT_SEASON: 8,454
- DRAFTED_BY: 8,001
- IS_OF_ORG: 7,865

하지만 가장 중요한 쿼리 — 이 블로그 포스트의 주요 목표인 — 두 Player 엔티티 사이의 가장 짧은 경로를 보여주는 쿼리입니다!

여러분… 그 시간입니다! 🥁

```js
# 두 선수 사이의 가장 짧은 경로를 보여줍니다
MATCH path=shortestPath(
  (p1:Player {id: "PLAYER-ID-1"})-[*]-(p2:Player {id: "PLAYER-ID-2"})
)
RETURN path
```

<div class="content-ad"></div>

위 쿼리를 서로 다른 선수 ID에 대해 실행하여 NBA 선수들 간의 흥미로운 관계를 볼 수 있습니다. 어떤 관계는 간단하지만, 다른 것들은 조금 복잡할 수도 있어요:

- 조쉬 하트와 돈테 디빈첸조 모를 사이에 빌라노바로 연결된 관계를 볼 수 있어요. 대학 시절 함께 뛰었기 때문이에요:

![image](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_2.png)

- 또한, 동일한 드래프트 클래스를 공유한 선수들, 즉 르브론 제임스와 듀에인 웨이드는 2003년 드래프트 클래스를 통해 연결되어 있어요.

<div class="content-ad"></div>

![2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_3](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_3.png)

- 서로 매우 다른 세대에서 나왔지만 동일한 팀에 드래프트된 선수들도이 연결을 공유합니다. 즉, D'Angelo Russel과 Jerry West는 둘 다 레이커스에 드래프트되었습니다.

![2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_4](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_4.png)

지금까지 간단한 연결을 본 것처럼, 재미있는 부분은 LeBron James와 Kobe Bryant 사이의 연결과 같은 놀라운 연결을 찾는 것입니다. 이 두 거장이 직접적인 연결을 공유하지 않기 때문에, 그들을 연결하는 경로가 반드시 있어야 합니다. 어떻게 될까요? 🥁🥁🥁🥁🥁

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_5.png)

Ever wondered how Zydrunas Ilgauskas, the Lithuanian center drafted by the Cavaliers in ’96, played a key role in linking LeBron and Kobe?

![gif](https://miro.medium.com/v2/resize:fit:784/0*eblTJD0vmN4IyzQ9.gif)

But if you’re a Cavaliers fan — or simply a curious individual who researched the 1996 NBA Draft, you’ll find that the Cavaliers had more than one pick; they had three. So, how can we show all possible shortest paths between Kobe and LeBron? We would need to modify our query slightly:


<div class="content-ad"></div>

```js
# 레브론 제임스(2544)와 코비 브라이언트(977) ID 매치
MATCH path=allShortestPaths(
  (p1:Player {id: 2544})-[*]-(p2:Player {id: 977})
)
RETURN path
```

결과:

<img src="/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_6.png" />

# 추가 정보: 몇 가지 추가적 탐색 데이터 분석



<div class="content-ad"></div>

더 나아가 Bleacher Report에 따르면 역사상 가장 우수한 드래프트 클래스는 1984 년의 것으로, Michael Jordan, John Stockton, Charles Barkley, Hakeem Olajuwon 등의 이름이 소개되었습니다.

![이미지](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_7.png)

모든 연도에서, 어떤 팀이 가장 많은 선수들을 섭외했을까요? 다음 쿼리가 이 질문에 대한 답을 제시합니다:

```js
# 각 팀이 섭외한 선수의 수를 세는 쿼리
MATCH (t:Team)<-[:DRAFTED_BY]-(p:Player)
RETURN t.team_name AS Team, count(p) AS Drafts
ORDER BY Drafts DESC
```

<div class="content-ad"></div>

결과에 따르면 사크라멘토 킹스가 최상의 위치를 차지했습니다(508명), 뒤를 이어 애틀랜타 호크스(489명)와 뉴욕 닉스(473명)가 있습니다. 킹스의 드래프트 픽 분포를 자세히 살펴봅시다...

```js
# 킹스가 올해 드래프트한 모든 선수 및 그들의 드래프트 클래스 가져오기
MATCH path = (t:Team {team_name: 'Kings'})
<-[:DRAFTED_BY]-
(p:Player)
-[:IS_OF_DRAFT_SEASON]->
(d:DraftClass)
RETURN path
```

이 쿼리는 킹스에 의해 드래프트된 모든 선수와 해당 드래프트 클래스를 보여주는 멋진 그래프를 반환합니다.

![2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_8](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_8.png)

<div class="content-ad"></div>

오른쪽에 보시다시피 킹스가 픽을 하지 않은 드래프트 클래스들이 있습니다. NBA 창시 프랜차이즈인 킹스 팀이 픽을 하지 않은 것은 가능한 일일까요? 네, 70년대 초 이전에는 킹스 프랜차이즈가 로열스로 알려졌기 때문입니다. 1970년 이전에 이 프랜차이즈의 모든 드래프트 픽은 로열스 팀 노드에 할당되었습니다.

# 결론

우리는 Neo4j를 사용하여 NBA 선수 관계를 매핑하여 'Six Degrees' 게임에 데이터 중심 접근법을 적용했습니다. 이 프로젝트는 데이터 분석뿐만 아니라 농구의 상호 연결된 세계를 탐험하는 것이었습니다!

이러한 다양한 관계를 탐색하는 것은 압도적이면서 매혹적일 수 있습니다. 저는 최종 이미지로 마무리하며, 이 그래프가 얼마나 멋질 수 있는지를 보여주는데, 그 복잡성과 아름다움에서 불꽃놀이를 연상케 합니다.

<div class="content-ad"></div>

```json
경로 = (p:Player) -[:DRAFTED_BY|IS_OF_DRAFT_SEASON*1..2]-> (t)
WHERE (t:Team) OR (t:DraftClass) OR ((:Player) -[:IS_OF_ORG]-> (t))
RETURN path
LIMIT 500
```

![이미지](/assets/img/2024-05-27-NBANetworkAnalysisConnectingtheDotswithNeo4j_9.png)

# 감사의 말

이 프로젝트의 MVP인 João Pedro Boufleur에게 특별한 찬사를 보냅니다. 그의 기여는 이 모험의 성공에 필수적이었습니다.

<div class="content-ad"></div>

# 참고 자료

- Kaggle: NBA 데이터베이스
- Neo4j 샌드박스
- Neo4j Cypher 매뉴얼
