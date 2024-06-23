---
title: "파스칼의 삼각형을 간단하고 빠르게 이해하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-AShortandDirectWalkwithPascalsTriangle_0.png"
date: 2024-06-23 18:26
ogImage: 
  url: /assets/img/2024-06-23-AShortandDirectWalkwithPascalsTriangle_0.png
tag: Tech
originalTitle: "A Short and Direct Walk with Pascal’s Triangle"
link: "https://medium.com/towards-data-science/a-short-and-direct-walk-with-pascals-triangle-26a86d76f75f"
---


## 경로 탐색 알고리즘을 세는 것으로 개선할 수 있다면?

![이미지](/assets/img/2024-06-23-AShortandDirectWalkwithPascalsTriangle_0.png)

다익스트라(Dijkstra) 알고리즘과 A*와 같은 고전적인 경로 탐색 알고리즘은 비디오 게임, 모바일 로봇공학 및 건축 설계와 같은 응용 프로그램에서 여행 경로를 생성하는 데 사용됩니다. 이러한 알고리즘의 인기에도 불구하고, 그들이 생성하는 경로는 거의 직선으로 이어지지 않습니다. 이 문서에서는 Pascal의 삼각형에서 영감을 받은 계산 기술을 사용하여 매우 직접적인 경로를 계산하는 방법에 대해 배울 수 있습니다. 이는 제 동료들과 제가 개발한 아이디어로, 최근 인공지능 연구 저널에 발표되었습니다. 전통적인 경로 탐색의 오래된 문제를 극복할 수 있는 쉬운 경로 수 세기 단계를 통해 경로를 계산할 수 있습니다.

# 미관코의 경로 문제

<div class="content-ad"></div>

다양한 분야에서 짧고 직접적인 경로를 계산해야 하는 필요성이 발생합니다. 건물 설계자들은 길찾기 도구를 사용하여 사람들이 가장 가까운 비상구에 도달하기 위해 얼마나 걷어야 하는지 분석합니다. 일부 건축가들은 한 걸음 더 나아가 건물을 대피하는 사람들의 군중을 시뮬레이션하며, 이는 모든 건물 거주자를 위한 대피 경로를 생성해야 합니다. 비디오 게임 개발자들은 AI가 제어하는 에이전트가 맵 상에서 어떻게 이동해야 하는지 결정하기 위해 경로 탐색 알고리즘을 활용합니다.

경로 찾기를 구현하는 가장 간단하고 인기 있는 방법 중 하나는 맵을 그리드 형식으로 표현한 다음, Dijkstra's Algorithm이나 A*와 같은 고전적인 검색 방법을 적용하여 가능한 최단 거리의 그리드 경로를 찾는 것입니다. 아래 애니메이션은 시작 위치 A에서 목적지 B까지의 최단 그리드 경로의 예시를 보여줍니다. 그림자가 있는 그리드 셀은 피해야 할 벽 또는 다른 장애물을 나타냅니다. 일단은 그리드 경로를 따라 이동할 때 각 이동이 북쪽, 남쪽, 동쪽 또는 서쪽 중 하나의 방향으로 한 걸음이라고 가정하겠습니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*L-is8Tk78R2rCC1vOPsc7g.gif)

위 경로는 A에서 B로 가는 400개의 최단 그리드 경로 중 하나입니다. 또한 매우 간접적인 경로입니다. 명백한 직선 최단거리를 활용하지 않습니다. 만약 그리드에 따라 걷어야 하는 의무가 없는 경우 실제로 사람이 따르는 직접적인 경로와는 크게 다릅니다. Amit Patel의 Red Blob Games 튜토리얼에서 A*를 구현하는 방법에 대해 설명한 내용에 따르면 이러한 "못생긴 경로"는 널리 발생하는 문제라고 합니다.

<div class="content-ad"></div>

The ugly path problem can be tackled in a brute force manner by testing up to hundreds of thousands of possible straight-line shortcuts during an A* path search. An algorithm called Theta*, which was published in 2010, uses this approach. In order to avoid all these line-of-sight tests, our strategy is to select a shortest grid path that happens to approximate a direct route. Of the 400 shortest grid paths in our example, the path below is the one we would select.

![Image](https://miro.medium.com/v2/resize:fit:1400/1*82ROrH4W04_B9M5apco4Jg.gif)

This central grid path isn’t actually shorter than the indirect grid path we saw previously. Both paths require 15 grid moves, and each move is one grid spacing in length. However, the central path is a better approximation of the smooth path a person would take in real life. One way to solve the ugly path problem is to find a simple and efficient method for producing central grid paths. Enter Pascal’s Triangle.

# Pascal’s Triangle

<div class="content-ad"></div>

1655년에 프랑스 수학자 블레즈 파스칼이 '삼각수열에 관한 논문'을 발표했습니다. 이후 이 수열은 파스칼의 삼각형으로 알려지게 되었습니다.

파스칼의 삼각형에 대한 분석은 니윗의 이항정리에 대한 기여뿐만 아니라 라이프니츠의 미적분학에도 영감을 주었습니다. 그러나 이 패턴을 처음 발견한 사람은 파스칼이 아니었습니다. 오리엔트(페르시아 및 중국), 인도에서 1000년 넘게 전 발견되었습니다.

파스칼의 삼각형은 정점과 두 변이 다른 위치에 1을 둠으로써 형성됩니다. 나머지 숫자는 이전 두 숫자를 더하여 생성됩니다. 아래 애니메이션은 처음 5행에 대한 작업을 보여줍니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-AShortandDirectWalkwithPascalsTriangle_2.png" />

파스칼의 삼각형은 매력적인 여러 성질로 유명합니다. 그 중 하나는 파스칼의 삼각형의 각 숫자를 경로 수로 해석할 수 있다는 점입니다: 삼각형 정점에서 해당 숫자의 위치까지의 가장 짧은 격자 경로 수입니다. 예를 들어, 애니메이션의 중앙 하단에 있는 육각형 격자 셀에는 숫자 6이 있으며, 삼각형의 맨 위 셀에서 해당 중앙 하단 셀까지의 정확히 6개의 가장 짧은 격자 경로가 있습니다. 이 애니메이션은 육각 격자를 보여줍니다만, 파스칼의 삼각형이 블레즈 파스칼의 이전 다이어그램처럼 사각 격자에 그려져 있을 때에도 이 성질은 유지됩니다.

파스칼의 삼각형을 사용하여 격자 상의 경로 수를 세는 방법을 설명하는 온라인 기사와 비디오들이 많이 있습니다. 놀랍게도 우리는 한 단계 더 나아갈 수 있습니다. 파스칼의 삼각형은 우리에게 모든 가능한 경로 수를 세는 방법 뿐만 아니라 이러한 경로 중에서 가장 직접적인 경로 중 하나를 선택하는 방법도 보여줍니다.

# Counting을 통한 Pathfinding

<div class="content-ad"></div>

새로운 경로 탐색 접근 방식은 각 그리드 셀을 통과하는 최단 경로의 수를 세고, 그 중 가장 높은 수를 가진 그리드 셀을 선택합니다.

첫 번째 단계는 순방향으로 경로를 세는 것입니다. 아래 그림에서 보듯이 시작 위치 A에 숫자 1을 할당하는 것부터 시작합니다. 그리드 셀에 숫자가 할당되면, 해당 숫자는 최단 그리드 경로를 따라 다음 셀로 복사됩니다. 여러 경로가 만나는 경우, 숫자가 추가됩니다. Pascal의 삼각형과 유사하게, 결과적으로 각 그리드 셀은 A에서 해당 셀로의 최단 그리드 경로 수를 포함하게 됩니다. 예를 들어, 애니메이션에서 A와 12로 표시된 셀 사이에는 12개의 최단 그리드 경로가 있습니다. A와 B 사이에는 400개의 최단 그리드 경로가 있다는 사실에 주목해주세요.

![image](https://miro.medium.com/v2/resize:fit:1400/1*1rFU420fm5kfktpcMJigvQ.gif)

그런 다음, 역방향으로 절차를 반복합니다. 이제 B에 숫자 1을 할당하고, A에 도달할 때까지 숫자를 복사하고 추가합니다. 결과적으로 모든 그리드 셀은 B에서 해당 셀로의 최단 그리드 경로 수를 포함하게 됩니다. 방향을 반전했지만 두 끝점 사이에 여전히 400개의 최단 그리드 경로가 있다는 점에 주목해주세요.

<div class="content-ad"></div>

![image](https://miro.medium.com/v2/resize:fit:1400/1*pX75tvt6Iu0HdwlRIdvP7w.gif)

다음 단계는 이 두 개의 경로 수 세트를 가져와 곱하여 단일 탐색 횟수 세트를 만드는 것입니다. 이 개념을 이해하려면 위의 애니메이션을 보고 A로부터 12개의 경로 수와 B로부터 20개의 경로 수를 가진 고유한 그리드 셀을 찾으십시오. 한 쪽에서의 12개 경로와 다른 쪽에서의 20개 경로는 12×20 개의 서로 다른 조합으로 결합될 수 있어서 A에서 B로 가는 도중에 이 그리드 셀을 통해 통과하는 경로가 240개 있다는 것을 의미합니다. 아래에서 볼 수 있듯이 이 셀의 탐색 횟수는 240입니다. 이 애니메이션은 각 그리드 셀에 대해 탐색 횟수가 계산되는 과정을 보여줍니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*PpM5hzKpMgrcwQk1M5Of6Q.gif)

마지막 단계는 A에서 시작한 다음 B로 향하는 다음 그리드 셀을 반복해서 선택하고 가장 높은 탐색 횟수를 갖는 그리드 셀을 선택하는 것입니다. 아래의 애니메이션은 탐색 횟수를 표시하고 경로가 생성되는 과정을 보여줍니다.

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*bd3lyPgJHvHpT0Gsbp8w-w.gif)

특정 방식으로 접근한 결과는 중심 그리드 경로입니다. 이는 사람이 걸어다닐 것으로 예상되는 경로를 근사한 직접적인 최단 그리드 경로입니다.

# 경로 계산의 장점

경로 계산이 미치는 영향을 살펴보려면, 아래에 일반적인 A* 구현체에 의해 생성된 임의 또는 "추악한" 최단 그리드 경로를 보면 됩니다. 이 맵은 Dragon Age: Origins 벤치마크 데이터셋에서 가져왔습니다. 이 그리드 경로는 큰 불필요한 지그재그를 보이며, 경로의 부드럽게 만든 버전조차 명백한 결함을 가지고 있습니다. 이미지를 클릭하여 자세히 살펴보세요.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-AShortandDirectWalkwithPascalsTriangle_3.png" />

A*가 경로 카운팅과 함께 확장되면, 중심 그리드 경로가 지도의 빈 영역을 가로지를 때 시야선을 따라가게 됩니다. 아래 그림에서 보듯이, 지그재그가 가능한 한 작아졌으며, 부드럽게 만들 수 있습니다. 중심 그리드 경로를 계산하는 데 평균적으로 임의의 그리드 경로보다 약 40% 더 오래 걸립니다. 반면, A*에서 Theta*로 전환하면 계산 시간이 세 배로 증가할 것입니다. 본문에서 보는 것처럼, 경로를 계산하는 단계를 추가함으로써 결과 품질이 크게 향상됩니다.

<img src="/assets/img/2024-06-23-AShortandDirectWalkwithPascalsTriangle_4.png" />

위의 중심 경로는 가까운 평행한 경로를 근사하고 있는 것을 알 수 있습니다. 이러한 관찰은 중심 그리드 경로의 이론적 특성과 일치합니다. 같은 끝 점 사이에서 중심 경로를 계속해서 계산하지만 그리드 해상도를 점점 세밀하게 해본다고 상상해보십시오. 중심 극한 정리에 따르면, 이 중심 경로가 최종적으로는 어떠한 직선 단축을 활용하고 있다고 재경로화되며 다크한 경로에 수렴할 것입니다. 다시 말해, 중심 그리드 경로는 궁극적으로 완벽하게 직접적이게됩니다.

<div class="content-ad"></div>

# 실용적인 고려사항

새로운 접근 방식은 중앙 그리드 경로 계획, 중앙 그리드 기반 경로 탐색 또는 카운팅에 의한 경로 탐색으로 언급될 수 있습니다. 이 기술을 구현에 관심이 있다면, 아래에 주의해야 할 몇 가지 실용적인 고려사항이 있습니다. 더 자세한 안내사항은 오픈 액세스 저널 논문 "그리드 기반 네비게이션을 위한 경로 카운팅" [1]에서 확인할 수 있습니다.

- 먼저 Dijkstra 또는 A* 알고리즘을 사용한 후에 경로를 계산합니다. 이 논문의 애니메이션 예시는 모든 도달 가능한 그리드 셀이 최단 그리드 경로의 일부인 특수한 경우입니다. 일반적으로 Dijkstra 알고리즘 또는 A*를 사용하여 최단 그리드 경로의 방향성 비순환 그래프(DAG)를 생성하는 것이 좋습니다. 이 작업이 완료되면 경로 카운팅 작업은 원래 맵이 아닌 DAG에서 수행됩니다. 자세한 내용은 논문의 3.1 및 3.2절에서 확인할 수 있습니다. 결론적으로, 경로 계산은 Dijkstra 또는 A* 대안이 아니라 이러한 고전적인 경로 탐색 방법을 개선하는 방법입니다.
- 큰 경로 횟수를 계산하기 위해 로그를 사용하세요. 경로 횟수는 그리드의 크기와 기하학적으로 증가합니다. 따라서 애니메이션 예시에서는 400개의 최단 그리드 경로가 있지만, 실제 응용 프로그램에서는 10의 400승 이상의 경로가 있을 수 있습니다. 이는 경로 횟수를 직접 나타내기 위해 64비트 부동 소수점 숫자를 사용하면 오버플로우할 수 있음을 의미합니다. 다행히 로그를 사용하여 간접적으로 경로 횟수를 처리할 수 있습니다. 논문의 3.2절은 이 접근 방식의 작은 것이지만 극도로 중요한 세부 조정을 설명합니다.
- 가능한 경우 대각선 이동을 허용하세요. 애니메이션 예시에서 그리드 이동은 4개의 주요 이동(north, south, east, west)으로 제한됩니다. 더 나은 결과를 위해 4개의 대각선 이동(ne)으로도 허용하는 것이 최선입니다. 이 경우, 대각선 이동은 주이동보다 대략 40% 길다는 것을 기억해야 합니다. 또한 대각선 이동을 허용하는 경우, 두 그리드 셀 간의 등장 수에 따라 약간의 차이가 나타날 수 있는 반올림 오차에 주의해야 합니다. 논문의 예시에서는 주요 및 대각선 이동이 허용된 경우를 가정합니다.
- 원하는 경우 최종 경로를 부드럽게 만드세요. 그리드 경로를 후처리 단계에서 부드럽게 만들어 원치 않는 지그재그를 제거하고 경로를 줄이는 것이 일반적인 방법입니다. 경로 계산과 경로 부드러움이 잘 결합된다는 것이 밝혀졌습니다. 논문의 3.3절은 중앙 그리드 경로를 부드럽게 만드는 것이 임의의 최단 그리드 경로를 부드럽게 만드는 것보다 더 짧은 이동 경로를 생성한다는 것을 보여줍니다.
- 기존의 구현과 결과를 비교하세요. 작성 시점에서 중앙 그리드 기반 경로 찾기 도구가 하나 이상 존재합니다. SpaceAnalysis라는 저와 동료들이 개발한 건축 설계 도구가 그 예입니다. 더 많은 사람들이 이 기술에 대해 배우면 다른 구현이 나타날 것입니다.

# 결론

<div class="content-ad"></div>

경로 계산은 파스칼의 삼각형의 핵심에서 잘 알려진 절차입니다. 또한 클래식한 경로 탐색 알고리즘에서 더 직접적이고 직선적인 이동 경로를 얻는 실용적인 방법입니다. 비디오 게임, 분석 도구 또는 심지어 모바일 로봇을 위한 간단한 내비게이션 방법이 필요하다면 논문을 확인하고 경로 계산을 시작해보세요!

업데이트: 본문이 이제 3부작 시리즈의 첫 번째 글이 되었습니다. Grid-Based Visibility에서 볼 수 있는 영역을 계산하는 데 경로 계산을 어떻게 활용할 수 있는지 알아보세요. 그런 다음 배운 내용을 적용하여 3D 그리드 이웃을 다루는 A Sharp and Solid Outline of 3D Grid Neighborhoods를 확인하세요. 또한 이제 중앙 그리드 기반 경로 탐색의 오픈 소스 구현체가 있어 여러분의 프로젝트에서 사용할 수 있습니다. GitHub의 Central64 C++ 라이브러리를 확인해보세요.

# 참고 자료

[1] R. Goldstein, K. Walmsley, J. Bibliowicz, A. Tessier, S. Breslav, A. Khan, Path Counting for Grid-Based Navigation (2022), 인공지능 연구 저널, vol. 74, pp. 917–955

<div class="content-ad"></div>

[2] K. Daniel, A. Nash, S. Koenig, A. Felner, Theta*: Any-Angle Path Planning on Grids (2010), 인공 지능 연구 저널, 제39권, 553–579쪽

[3] C. Cobeli, A. Zaharescu, Pascal의 삼각형을 따라 산책 — 숫자 동기 (2013) [PDF], 루마니아 수학 과학 협회 보고서, 제56권, 제104호, 73–98쪽

[4] N. R. Sturtevant, 그리드 기반 경로 탐색을 위한 벤치마크 (2012) [PDF], 게임에서의 계산 지능과 AI에 관한 Transactions, 제4권, 제2호, 144–148쪽