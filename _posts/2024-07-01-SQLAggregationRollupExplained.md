---
title: "SQL 집계 Rollup 함수 완벽 가이드"
description: ""
coverImage: "/assets/img/2024-07-01-SQLAggregationRollupExplained_0.png"
date: 2024-07-01 17:30
ogImage: 
  url: /assets/img/2024-07-01-SQLAggregationRollupExplained_0.png
tag: Tech
originalTitle: "SQL Aggregation: Rollup Explained"
link: "https://medium.com/@santosh_joshi_data/sql-aggregation-rollup-374e3d939d04"
---


![image](/assets/img/2024-07-01-SQLAggregationRollupExplained_0.png)

# 소개

이전 포스트에서는 그룹화 세트(Grouping Sets)와 큐브(Cube)가 그룹화로만 하는 것보다 데이터 집계를 더 쉽고 빠르게 할 수 있다는 것을 살펴보았습니다.

차원 데이터 모델에서는 데이터 필드가 일반적으로 계층 구조 관계를 가지고 있습니다. 그룹화 세트(Grouping Sets)와 큐브(Cube)는 집계에 도움을 주지만, 모든 열 조합에 대해 이를 수행합니다. 계층 구조를 따르는 열의 데이터만 집계하고 싶은 경우 Rollup을 사용할 수 있습니다.

<div class="content-ad"></div>

# 데이터 준비

데이터 준비를 위해 [이 링크](link_here)를 사용할 수 있어요. 이 데이터셋은 아래와 같이 보여요:

![dataset](/assets/img/2024-07-01-SQLAggregationRollupExplained_1.png)

# 데이터 계층 구조 이해

<div class="content-ad"></div>

위의 표에서 국가는 주를 포함하고, 주는 도시를 포함하며, 도시는 많은 상점을 가지고 있습니다. 데이터 세트에는 아래의 마크다운에 나타난 것처럼 등급이 있습니다.

```js
- 국가
  - 주
    - 도시
      - 상점
```

예를 들어, 아래 마크다운은 등급을 강조한 샘플 데이터를 보여줍니다.

```js
- 미국
  - 뉴욕
    - 뉴욕 시티
      - 상점 A
      - 상점 B
    - 버펄로
      - 상점 C
  - 캘리포니아
    - 샌프란시스코
      - 상점 D
      - 상점 E
    - 로스앤젤레스
      - 상점 F
      - 상점 G
  - 텍사스
    - 휴스턴
      - 상점 H
      - 상점 I
  - 플로리다
    - 마이애미
      - 상점 J
      - 상점 K
```

<div class="content-ad"></div>

# 롤업 이해

모든 것을 간단히 하기 위해, 주와 도시를 포함한 2단계 계층 구조만 살펴보겠습니다. 각 주에는 여러 도시가 포함되어 있습니다. 데이터는 다음과 같이 보일 것입니다:

![image](/assets/img/2024-07-01-SQLAggregationRollupExplained_2.png)

이제 주와 도시 수준에서 집계된 데이터를 보고, 그 후에는 주 수준에서만 보고 싶습니다. 이를 Grouping Sets를 사용하여 다음과 같이 구현할 수 있습니다:

<div class="content-ad"></div>

```js
SELECT state
 ,city
 ,sum(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY ROLLUP(state, city)
```

![SQL Aggregation Rollup Explained](/assets/img/2024-07-01-SQLAggregationRollupExplained_3.png)

이제 이것이 보다 직관적인 rollup을 사용하여 쉽게 달성할 수 있습니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-07-01-SQLAggregationRollupExplained_4.png" />

# 요약

고급 데이터 분석과 성능 고려를 위해, Grouping Sets, Cube 및 Rollup과 같은 그룹화 서브클로즈를 이해하는 것은 여러분의 도구상자에서 가치 있는 도구가 될 수 있습니다. 본문에서 본 것처럼, 이는 프로세스를 단순화하는데 그치지 않고 성능을 향상시킬 수 있습니다.