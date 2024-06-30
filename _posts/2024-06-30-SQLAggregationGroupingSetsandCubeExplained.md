---
title: "SQL 집계 Grouping Sets와 Cube 쉽게 이해하기"
description: ""
coverImage: "/assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_0.png"
date: 2024-06-30 23:24
ogImage: 
  url: /assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_0.png
tag: Tech
originalTitle: "SQL Aggregation: Grouping Sets and Cube Explained"
link: "https://medium.com/@santosh_joshi_data/sql-aggregation-grouping-sets-and-cube-explained-1a59326ea96c"
---



![이미지](/assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_0.png)

# 소개

데이터 분석에서 SQL의 GROUP BY 절을 사용하면 다른 카테고리에 따라 데이터를 요약하거나 합산하는 유용한 방법입니다. 그러나 몇 가지 제한 사항이 있습니다:

- 한 번에 고정된 수의 열을 그룹화 할 수 있습니다.
- 서로 다른 열의 조합으로 그룹화해야 하는 경우 쿼리가 길고 반복적인 경우가 발생할 수 있습니다.
- 성능이 떨어질 수 있습니다. 이는 테이블을 여러 번 스캔해야 하기 때문입니다.


<div class="content-ad"></div>

다음 섹션에서는 이러한 문제를 더 자세히 살펴볼 것입니다. 그러나 먼저 데이터를 준비해 봅시다.

# 데이터 준비

다음은 product_sales라는 테이블을 만드는 방법입니다.

```js
CREATE TABLE product_sales (
 country VARCHAR(30)
 ,state VARCHAR(20)
 ,city VARCHAR(20)
 ,store VARCHAR(20)
 ,sales_amount DECIMAL(10, 2)
 )
```

<div class="content-ad"></div>

이 테이블에 더미 데이터를 삽입하는 코드가 있어요. 이것을 통해 개념을 더 잘 이해할 수 있을 거예요.

```js
INSERT INTO product_sales (country, state, city, store, product, sales_date, sales_amount) VALUES
('USA', 'California', 'Los Angeles', 'Store A', 'Product 1', '2024-01-01', 100.00),
('USA', 'California', 'San Francisco', 'Store B', 'Product 2', '2024-01-02', 150.00),
('USA', 'New York', 'New York', 'Store C', 'Product 1', '2024-01-03', 200.00),
('USA', 'New York', 'New York', 'Store C2', 'Product 3', '2024-01-03',225.00),
('USA', 'New York', 'Buffalo', 'Store D', 'Product 3', '2024-01-04', 250.00),
('Canada', 'Ontario', 'Toronto', 'Store E', 'Product 2', '2024-01-05', 300.00),
('Canada', 'British Columbia', 'Vancouver', 'Store F', 'Product 1', '2024-01-06', 350.00),
('India', 'Maharashtra', 'Mumbai', 'Store G', 'Product 2', '2024-01-07', 400.00),
('India', 'Karnataka', 'Bangalore', 'Store H', 'Product 3', '2024-01-08', 450.00),
('India', 'Delhi', 'New Delhi', 'Store I', 'Product 1', '2024-01-09', 500.00),
('India', 'Tamil Nadu', 'Chennai', 'Store J', 'Product 2', '2024-01-10', 550.00),
('USA', 'Texas', 'Houston', 'Store K', 'Product 1', '2024-01-11', 600.00),
('USA', 'Florida', 'Miami', 'Store L', 'Product 3', '2024-01-12', 650.00),
('Canada', 'Quebec', 'Montreal', 'Store M', 'Product 2', '2024-01-13', 700.00),
('India', 'West Bengal', 'Kolkata', 'Store N', 'Product 3', '2024-01-14', 750.00);
```

product_sales 테이블을 조회하면 아래와 같은 데이터가 나올 거예요.

<img src="/assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_1.png" />

<div class="content-ad"></div>

# 그룹화 세트 이해하기

그룹화 세트 개념을 이해하기 위한 예제를 살펴보겠습니다. 이 예제에서는 미국의 총 매출을 보고, 주(state)와 도시(city)의 다양한 조합으로 그룹화하고 싶습니다. 아래 쿼리를 사용하여 GROUP BY 절만으로 이 작업을 수행할 수 있습니다.

```js
SELECT state
 ,city
 ,SUM(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY state
 ,city

UNION ALL

SELECT state
 ,NULL AS city
 ,SUM(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY state

UNION ALL

SELECT NULL AS state
 ,city
 ,SUM(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY city

UNION ALL

SELECT NULL AS state
 ,NULL AS city
 ,SUM(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA';
```

쿼리는 다음과 유사한 결과를 생성합니다 -

<div class="content-ad"></div>

![2024-06-30-SQLAggregationGroupingSetsandCubeExplained_2.png](/assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_2.png)

이 접근 방식에는 두 가지 주요 문제가 있습니다:

- 코드의 장황함: 비슷한 코드를 반복 타이핑해야 하며, 두 개의 열로는 관리할 수 있지만, 세 개 이상으로 늘어날수록 번거로워집니다. 이렇게 되면 운영 오버헤드가 증가하게 됩니다.
- 성능: 쿼리가 테이블을 여러 번 스캔합니다(이 예시에서는 네 번). 열의 수가 늘어날수록 - 예를 들어, 세 개의 열로 할 경우 - 쿼리는 테이블을 여덟 번 스캔합니다. 이 순차적인 스캔은 특히 대형 테이블의 경우 성능에 심각한 영향을 미치며, 실행 속도가 느려질 수 있습니다.

![2024-06-30-SQLAggregationGroupingSetsandCubeExplained_3.png](/assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_3.png)

<div class="content-ad"></div>

하지만 Grouping Sets는 Group By 절의 하위 절로 해결책을 제공합니다. 이는 코드를 간소화할 뿐만 아니라 테이블을 한 번만 스캔하여 성능을 크게 향상시킵니다.

```js
SELECT state
 ,city
 ,sum(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY GROUPING SETS((state,city),(state), (city), ())
```

아래와 같이 보여지는 Grouping Sets를 사용할 때, 쿼리는 테이블을 한 번만 스캔합니다.

```js
EXPLAIN 
SELECT state
 ,city
 ,sum(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY GROUPING SETS((state,city),(state), (city), ())
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-SQLAggregationGroupingSetsandCubeExplained_4.png" />

이제 Grouping Sets에 세 번째 열을 포함하면, 쿼리는 다음과 같이 보일 수 있습니다 -

```js
SELECT state
 ,city
 ,sum(sales_amount) AS total_sales
FROM product_sales
WHERE country = 'USA'
GROUP BY GROUPING SETS((state,city,store),(state,city), (state, store), 
(city, store), (state), (city), (store), ())
```

# CUBE 설명

<div class="content-ad"></div>

위 예제에서 8가지 조합을 볼 수 있습니다. 그루핑 세트는 열의 수가 증가함에 따라 장황하고 오류가 발생할 수 있습니다. 이를 극복하기 위해 GROUP BY의 다른 하위 절인 CUBE가 있습니다. CUBE는 열의 모든 조합을 간결하게 제공합니다.

아래는 Markdown으로 서식이 지정된 쿼리 출력입니다. 빈 셀은 NULL 값을 나타냅니다.

```js
| state      | city          | total_sales |
|------------|---------------|------------|
|            |               | 2175.00    |
| New York   | New York      | 225.00     |
| New York   | New York      | 200.00     |
| California | San Francisco | 150.00     |
| Texas      | Houston       | 600.00     |
| New York   | Buffalo       | 250.00     |
| California | Los Angeles   | 100.00     |
| Florida    | Miami         | 650.00     |
| California | San Francisco | 150.00     |
| New York   | New York      | 425.00     |
| Florida    | Miami         | 650.00     |
| New York   | Buffalo       | 250.00     |
| Texas      | Houston       | 600.00     |
| California | Los Angeles   | 100.00     |
| New York   |               | 675.00     |
| Texas      |               | 600.00     |
| California |               | 250.00     |
| Florida    |               | 650.00     |
|            | Buffalo       | 250.00     |
|            | New York      | 200.00     |
|            | Miami         | 650.00     |
|            | San Francisco | 150.00     |
|            | Los Angeles   | 100.00     |
|            | Houston       | 600.00     |
|            | New York      | 225.00     |
|            | New York      | 425.00     |
|            | Houston       | 600.00     |
|            | Buffalo       | 250.00     |
|            | Los Angeles   | 100.00     |
|            | Miami         | 650.00     |
|            | San Francisco | 150.00     |
| New York   |               | 225.00     |
| Texas      |               | 600.00     |
| New York   |               | 200.00     |
| New York   |               | 250.00     |
| California |               | 150.00     |
| California |               | 100.00     |
| Florida    |               | 650.00     |
|            |               | 200.00     |
|            |               | 150.00     |
|            |               | 100.00     |
|            |               | 600.00     |
|            |               | 650.00     |
|            |               | 250.00     |
|            |               | 225.00     |
```

<div class="content-ad"></div>

# 요약

여기서는 Grouping Sets 및 Cube와 같은 고급 Group By 하위 절이 코드의 간결성을 향상시키는 뿐만 아니라 성능을 향상시켜 고급 데이터 분석에 가치를 더하는 방법을 살펴보았습니다. 또한 탐색할 가치가 있는 다른 하위 절은 ROLLUP입니다. 

또한, 이러한 기능들은 PostgreSQL에서 테스트되었으며 SQL Server에서도 지원됩니다. 이러한 개념을 적용하기 전에 귀하의 관계형 데이터베이스 관리 시스템이 이를 지원하는지 확인하십시오.