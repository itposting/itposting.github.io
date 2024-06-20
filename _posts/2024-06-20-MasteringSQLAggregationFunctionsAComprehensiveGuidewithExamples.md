---
title: "SQL 집계 함수 마스터하기 예제와 함께 다루는 포괄적 가이드"
description: ""
coverImage: "/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_0.png"
date: 2024-06-20 15:48
ogImage: 
  url: /assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_0.png
tag: Tech
originalTitle: "Mastering SQL Aggregation Functions: A Comprehensive Guide with Examples"
link: "https://medium.com/@sqlfundamentals/mastering-sql-aggregation-functions-a-comprehensive-guide-with-examples-8d186160f7ee"
---


집계 함수는 데이터를 요약하고 분석할 때 SQL에서 중요한 역할을 합니다. 이들은 우리에게 통계 메트릭을 계산하고 데이터 그룹에 대한 계산을 수행하며 의미 있는 통찰을 얻을 수 있도록 해줍니다.

![image](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_0.png)

이 글에서는 COUNT, SUM, AVG, MIN, MAX, ROUND, GROUP BY, WITH ROLLUP, LIMIT, HAVING 등과 같은 가장 일반적으로 사용되는 10가지 MYSQL 집계 함수를 실제 예제와 함께 탐색해 보겠습니다.

# 1. COUNT

<div class="content-ad"></div>

해당 테이블의 열에서 비 널 값의 수를 반환하거나 테이블의 행 수를 반환합니다.

예시:
SELECT COUNT(*) AS total_rows
FROM table_name;

SELECT COUNT(column_name)
FROM table_name;

```js
-- 저자 테이블에는 몇 개의 행이 있나요?

SELECT COUNT(*) AS total_rows
FROM authors;
```

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_1.png" />

```js
-- 데이터셋에 있는 작가는 몇 명인가요?

SELECT COUNT(DISTINCT au_id) AS number_of_authors
FROM authors;
```

<img src="/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_2.png" />

```js
-- 산호세 또는 솔트레이크시티에 거주하는 작가는 몇 명인가요?

SELECT COUNT(au_id)
FROM authors
WHERE city IN ("San Jose", "Salt Lake City");
```   


<div class="content-ad"></div>

![image](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_3.png)

```js
-- 캘리포니아 주(CA)에 기반을 둔 상점의 수는?

SELECT COUNT(DISTINCT stor_id) AS "CA에 있는 상점 수"
FROM stores
WHERE state = "CA";
```

![image](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_4.png)

# 2. SUM

<div class="content-ad"></div>

한 열의 값들의 합을 계산합니다.

예시:
SELECT SUM(column_name)
FROM table_name;

```js
-- 수량에 따른 총 매출을 계산합니다.

SELECT SUM(qty) AS sales_quantity
FROM sales;
```

![이미지](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_5.png)

<div class="content-ad"></div>

```js
-- 각 상점의 판매량을 수량별로 찾아서 내림차순으로 정렬합니다.

SELECT stor_id, SUM(qty) AS sales_quantity
FROM sales
GROUP BY stor_id
ORDER BY SUM(qty) DESC;
```

![마스터링 SQL 집계 함수: 예제를 활용한 포괄적인 가이드](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_6.png)

# 3. AVG

숫자 열의 평균 값을 계산합니다.

<div class="content-ad"></div>

예시:

```sql
-- 테이블 sales에서 수량의 개수, 평균 및 합계를 표시합니다.

SELECT COUNT(qty), AVG(qty), SUM(qty)
FROM sales;
```

<img src="/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_7.png" />

```sql
-- 각 출판사가 가지고 있는 책의 수 및 책의 평균 가격을 찾습니다.

SELECT pub_id, COUNT(title_id), AVG(price)
FROM titles
GROUP BY pub_id
ORDER BY COUNT(title_id) DESC;
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_8.png)

# 4. MIN

특정 열에서 최솟값을 검색합니다.

예시:
SELECT MIN(열_이름)
FROM 테이블_이름;


<div class="content-ad"></div>

```sql
-- 각 출판사의 책의 최소 가격을 찾아보세요.

SELECT pub_id,  MIN(price) AS minimum_price
FROM titles
GROUP BY pub_id;
```

![이미지](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_9.png)

# 5. MAX

컬럼에서 최대값을 검색합니다.


<div class="content-ad"></div>

예시:

특정 발행사의 책들 중에서 가장 높은 가격을 알아봅시다.

```js
SELECT pub_id, MAX(price) AS maximum_price
FROM titles
GROUP BY pub_id;
```

<img src="/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_10.png" />

# 6. ROUND

<div class="content-ad"></div>

지정된 소수점 자리 수로 숫자 값을 반올림하는 데 사용됩니다.

예시:
SELECT ROUND(column_name, 소수점 자리 수)
FROM table_name;

```js
-- 각 출판사의 책 평균 가격을 2자리 소숫점으로 표시합니다.

SELECT pub_id,  ROUND(AVG(price),2) AS average_book_price
FROM titles
GROUP BY pub_id;
```

![이미지](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_11.png)

<div class="content-ad"></div>

# 7. GROUP BY

여러 열을 기반으로 행을 그룹화하고 각 그룹에 대해 집계를 수행합니다.

예시:
```sql
SELECT column1, 집계_함수(column2)
FROM table_name
GROUP BY column1;
```

예시 코드:
```sql
-- 각 출판사의 누적 연간 매출을 찾아 내림차순으로 정렬합니다.

SELECT pub_id,  SUM(ytd_sales)
FROM titles
GROUP BY pub_id
ORDER BY SUM(ytd_sales) DESC;
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_12.png)

```js
-- 각 발행사 및 각 제목의 총 YTD 판매량을 찾고 내림차순으로 정렬합니다.

SELECT pub_id,  title,  SUM(ytd_sales)
FROM titles
GROUP BY pub_id, title;
```

![image](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_13.png)

# 8. WITH ROLLUP


<div class="content-ad"></div>

쿼리 결과에 여러 레벨에서 소계 및 총계를 생성합니다.

*** 결과의 "NULL" 값은 소계 및 총계 행을 나타냅니다.

예:
SELECT column1, column2, Aggregate_function(column3)
FROM table_name
GROUP BY column1, column2
WITH ROLLUP;

```js
// 각 publisher와 title의 평균 가격을 내림차순으로 정렬하여 보려면 다음과 같은 쿼리를 사용하세요.
// 또한 WITH ROLLUP을 사용하여 소계 및 총계를 표시합니다.

SELECT pub_id, title, SUM(ytd_sales)
FROM titles
GROUP BY pub_id, title
WITH ROLLUP;
```  

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_14.png" />

# 9. LIMIT

쿼리에서 반환되는 행의 수를 제한합니다.

예시:
```sql
SELECT column1, column2
FROM table_name
LIMIT n;
```

<div class="content-ad"></div>

```sql
-- 가장 많은 매출을 올린 상위 3개 매장을 찾아봅니다.

SELECT stor_id, SUM(qty)
FROM sales
GROUP BY stor_id
ORDER BY SUM(qty) DESC
LIMIT 3;
```

![링크](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_15.png)

# 10. HAVING

그룹화된 결과에 특정 조건을 기반으로 행을 필터링합니다.
HAVING 절은 SUM, COUNT, AVG와 같은 집계 함수와 함께 사용됩니다.

<div class="content-ad"></div>

**표** 태그를 마크다운 형식으로 변경해주세요.

예시:
WHERE 절과 유사하지만, WHERE 절에서는 집계 함수를 사용할 수 없습니다!

예시:
```js
-- 판매 수량이 50개 이상인 가게 선택하기.

SELECT stor_id, SUM(qty)
FROM sales
GROUP BY stor_id
HAVING SUM(qty) > 50;
```

![이미지](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_16.png)

<div class="content-ad"></div>

```sql
-- 50개 이상의 판매 수량이 있는 가게를 선택한 다음 내림차순으로 정렬합니다.


SELECT stor_id, SUM(qty)
FROM sales
GROUP BY stor_id
HAVING SUM(qty) > 50
ORDER BY SUM(qty) DESC;
```

![이미지](/assets/img/2024-06-20-MasteringSQLAggregationFunctionsAComprehensiveGuidewithExamples_17.png)

# 결론

SQL 집계 함수는 데이터 분석과 보고에 꼭 필요합니다. 데이터를 요약하고 측정하며, 의사 결정에 유용한 통찰력을 제공합니다.

<div class="content-ad"></div>

이러한 함수를 마스터하면 SQL에서 강력한 데이터 분석을 수행할 수 있게 됩니다. 계속 연습하고 탐험하여 SQL 기술을 향상시키세요.

# SQL 기본 지식

시간을 내주셔서 감사합니다! 🚀 SQL 기본 지식에서 더 많은 콘텐츠를 찾아볼 수 있습니다. 💫