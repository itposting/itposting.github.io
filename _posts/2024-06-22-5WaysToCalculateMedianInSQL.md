---
title: "SQL에서 중앙값 계산하는 5가지 방법"
description: ""
coverImage: "/assets/img/2024-06-22-5WaysToCalculateMedianInSQL_0.png"
date: 2024-06-22 17:50
ogImage: 
  url: /assets/img/2024-06-22-5WaysToCalculateMedianInSQL_0.png
tag: Tech
originalTitle: "5 Ways To Calculate Median In SQL"
link: "https://medium.com/@subhralina/5-ways-to-calculate-median-in-sql-cffba38aa945"
---


![이미지](/assets/img/2024-06-22-5WaysToCalculateMedianInSQL_0.png)

3년 전, 데이터 과학의 세계에 들어갈 것 같았을 때, 여러 가지가 너무 압도적으로 보였어요. 딱 한 번의 인생 안에 배워야 할 것들이 너무 많았죠! 데이터 과학자가 되기 위해 필요한 기술을 탐험하면서 저를 안심시켜준 것 중 하나는 통계학이었어요. 저는 고등학교 때부터 대학 시절까지 통계학을 좋아했거든요. 통계학을 배울 때 우리가 초기에 배운 것 중 하나는 데이터의 평균, 중앙값 그리고 최빈값을 계산하는 것이었어요. 전문 용어로는 중심 경향성 측정값이라고 부르기도 해요.

# 빠른 복습

평균: "평균치"라고도 불리며, 모든 데이터 점수를 더하고 데이터 점수의 수로 나누어 찾을 수 있어요.

<div class="content-ad"></div>

중앙값: 중간 숫자; 모든 데이터 포인트를 정렬하고 중간에 있는 숫자를 선택하여 찾음 (또는 두 개의 중간 숫자가 있는 경우, 그 두 숫자의 평균을 취함).

최빈값: 가장 빈도가 높은 숫자 - 즉, 가장 자주 발생하는 숫자.

![이미지](/assets/img/2024-06-22-5WaysToCalculateMedianInSQL_1.png)

Measure of Central Tendency에 대한 마이크로블로그를 보유하고 있습니다. 여기에서 그들의 필요성과 사용 사례가 더 자세히 설명되어 있습니다.

<div class="content-ad"></div>

https://www.linkedin.com/posts/subhralina-nayak_data-statistics-datascience-activity-6977655040274522112-bvR6?utm_source=share&utm_medium=member_desktop

# SQL: 나의 진정한 사랑

말할 것도 없이, 나는 "SQL이 모든 것보다 중요" 운동의 기수입니다!

데이터 분석에 필수인 최고의 도구가 SQL이죠. SQL을 사용하면 가능한 모든 분석을 수행할 수 있습니다. 하지만 중심 경향성 측정은 할 수 있나요?

<div class="content-ad"></div>

네, 당연히 가능해요!

평균을 계산하는 것은 매우 간단해요. AVG() 집계 함수를 사용할 수 있어요.

최빈값을 계산하는 것은 각 카테고리의 레코드 수를 세고, MAX() 함수를 사용하여 가장 많은 수의 그룹을 구할 수 있어요.

하지만, 중앙값을 계산하는 것은 약간 까다로울 수 있어요. 그렇지만 중앙값을 SQL에서 계산하는 것은 여전히 가능해요. 한 가지 방법이 아니라, 5가지 방법으로 가능해요.

<div class="content-ad"></div>

# SQL을 사용하여 중앙값 계산해보기

먼저, 중앙값을 계산하는 데 사용되는 수학 공식을 이해해야 합니다.

N개의 요소를 가진 데이터셋이 있을 때, 작은 순서대로 정렬된 경우,

중앙값 = (N+1)/2번째 요소, 만약 N이 홀수인 경우

<div class="content-ad"></div>

중앙값 = (N/2번째 요소 + (N/2 + 1)번째 요소)/2, 단, N이 짝수인 경우

위의 공식에 따르면 데이터셋은 정렬되어 있어야 하며 홀수와 짝수 개수의 데이터포인트를 고려해야 합니다.

## 변수와 OFFSET — FETCH를 사용하여

```js
DECLARE @c BIGINT = (SELECT COUNT(*) FROM sales.order_items)

SELECT AVG(list_price) AS "Median"
FROM (
 SELECT list_price
 FROM sales.order_items
 ORDER BY list_price
 OFFSET (@c - 1)/2 ROWS
 FETCH NEXT 1 + (1 - @c%2) ROWS ONLY
) data
```

<div class="content-ad"></div>

변수 @c는 sales.order_items 테이블의 전체 행 수로 할당됩니다. 내부 서브쿼리는 목록 가격을 오름차순으로 정렬합니다. OFFSET (@c - 1)/2 ROWS 절은 첫 번째 절반의 행 (단 @c가 홀수인 경우) 또는 정확히 중간 행 (단 @c가 짝수인 경우)을 건너뜁니다. FETCH NEXT 1 + (1 - @c%2) ROWS ONLY 절은 @c가 홀수인 경우 다음 행을 가져오거나 @c가 짝수인 경우 추가 행을 가져오지 않습니다. 마지막으로 외부 쿼리는 검색된 행의 평균을 계산하여 중앙값을 구합니다.

## ROW_NUMBER() 윈도우 함수 사용하기

```js
SELECT AVG(list_price) AS "Median"
FROM
(
   SELECT list_price,
      ROW_NUMBER() OVER (ORDER BY list_price ASC, order_id ASC) AS RowAsc,
      ROW_NUMBER() OVER (ORDER BY list_price DESC, order_id DESC) AS RowDesc
   FROM sales.order_items
) data
WHERE
   RowAsc IN (RowDesc, RowDesc - 1, RowDesc + 1)
```

위 쿼리는 먼저 각 행에 대해 목록 가격과 주문 ID에 따라 오름차순 및 내림차순으로 순서를 지정합니다. 서브쿼리는 목록 가격 및 해당하는 오름차순 및 내림차순 순서의 행 번호를 검색합니다. 외부 쿼리는 오름차순 순서의 행 번호가 내림차순 순서의 행 번호와 동일하거나 하나 차이 나는 경우의 목록 가격의 평균을 계산합니다.

<div class="content-ad"></div>

## ORDER BY, MIN() 및 MAX() 함수 사용

```js
SELECT (
(SELECT MAX(list_price)
FROM (
 SELECT list_price
 FROM sales.order_items
 ORDER BY list_price
 OFFSET (SELECT COUNT(*)
 FROM sales.order_items) / 2 ROWS
 FETCH NEXT 1 ROW ONLY) AS BottomHalf) +
(SELECT MIN(list_price)
FROM (
 SELECT list_price
 FROM sales.order_items
 ORDER BY list_price DESC
 OFFSET (SELECT COUNT(*)
 FROM sales.order_items) / 2 ROWS
 FETCH NEXT 1 ROW ONLY) AS TopHalf)
) / 2 AS Median
```

데이터셋을 list_price를 기준으로 두 부분 (상위 및 하위)으로 분할합니다. 내부 서브쿼리는 각각 list 가격의 상위 50%와 하위 50%를 찾습니다. MAX(list_price) 및 MIN(list_price) 함수는 각각 각 반의 최대값과 최소값을 검색합니다. 최종 결과는 하위 반의 최댓값과 상위 반의 최솟값을 더한 다음 그 합을 2로 나누어 중앙값을 얻습니다.

## NTILE() 윈도우 함수 사용

<div class="content-ad"></div>

```js
SELECT MAX(list_price) AS "중앙값"
FROM (
 SELECT list_price,
 NTILE(4) OVER(ORDER BY list_price) AS Quartile 
 FROM sales.order_items
) X
WHERE Quartile = 2
```

NTILE 함수는 결과 집합을 4개의 동일한 부분(사분위수)으로 나눕니다. ORDER BY list_price는 목록 가격을 오름차순으로 정렬합니다. 외부 쿼리는 Quartile이 2인 서브쿼리에서 최대 목록 가격을 선택하는데, 이는 중간값인 두 번째 사분위수를 나타냅니다.

## PERCENTILE_CONT() 윈도우 함수 사용하기

```js
SELECT DISTINCT PERCENTILE_CONT(0.5) 
  WITHIN GROUP (ORDER BY list_price) OVER() AS "중앙값"
FROM sales.order_items
```

<div class="content-ad"></div>

PERCENTILE_CONT 함수는 그룹 내에서 주어진 열의 특정 백분위수를 계산합니다. 0.5 인수는 우리가 50번째 백분위수인 중앙값을 찾고 싶다는 것을 나타냅니다. ORDER BY list_price 절은 중앙값을 계산하기 전에 목록 가격이 오름차순으로 정렬되도록 합니다. DISTINCT 키워드는 중앙값이 동일한 값이 여러 개 있는 경우에도 전체 중앙값에 대해 한 결과만 얻도록 합니다. OVER() 함수는 어떤 분할도 없이 사용되므로 PERCENTILE_CONT가 전체 결과 집합에 적용됩니다.

참고: 모든 쿼리는 MS SQL Server에서 작성되었습니다.

이 쿼리들은 SQL에서 중앙값을 계산하는 다양한 방법을 제공하며, 그 효과는 데이터셋 크기와 사용 중인 데이터베이스 시스템에 따라 달라질 수 있습니다. 데이터셋에서 가장 효율적이고 정확한 중앙값 계산 방법을 찾기 위해 이 쿼리들을 특정 데이터셋에서 테스트하는 것이 좋은 실천법입니다.

SQL에서 중앙값을 계산하는 다른 방법이 있을 것으로 확신합니다. 발견하면 코멘트로 남겨주시기 바랍니다. 위에서 소개한 방법 중에서 여러분의 즐겨찾는 또는 선호하는 방법을 알려주세요. 이 블로그가 여러분의 SQL 역량을 향상시키는 데 도움이 되기를 바랍니다. 네, "모든 것은 SQL로 시작한다"고 말씀합니다.