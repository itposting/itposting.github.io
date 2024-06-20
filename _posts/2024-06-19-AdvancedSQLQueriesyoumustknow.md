---
title: "확장된 SQL 쿼리들, 꼭 알아야 할 사항들"
description: ""
coverImage: "/assets/img/2024-06-19-AdvancedSQLQueriesyoumustknow_0.png"
date: 2024-06-19 01:50
ogImage: 
  url: /assets/img/2024-06-19-AdvancedSQLQueriesyoumustknow_0.png
tag: Tech
originalTitle: "Advanced SQL Queries you must know"
link: "https://medium.com/@asma.sithi/advanced-sql-queries-you-must-know-9d922a464a20"
---


데이터 분석 및 데이터 엔지니어링을 위한 최고의 15가지 고급 SQL 명령어!

![이미지](/assets/img/2024-06-19-AdvancedSQLQueriesyoumustknow_0.png)

이미 데이터 분석에 익숙한 분이라면 SELECT, INSERT, UPDATE, DELETE 등과 같은 기본 명령어를 이미 알고 있을 것입니다. 가장 많이 사용되는 명령어라면서도 데이터를 깊이 파고들기 위해 아래 쿼리도 알아두는 것이 좋습니다.

# 1. 윈도우 함수

<div class="content-ad"></div>

윈도우 함수는 현재 행과 관련된 일련의 행을 대상으로 계산에 사용됩니다. 예를 들어, SUM() 함수와 OVER() 절을 사용하여 매출의 누적 합계를 계산하는 예제를 살펴보겠습니다. 'Sales_Data'라는 매출 데이터 테이블을 가정해보겠습니다. 이 테이블은 여러 날짜에 걸친 매출 금액을 기록합니다. 각 날짜별 매출의 누적 합계를 계산하고자 합니다. 즉, 각 날짜까지의 총 매출액을 나타냅니다.

이 쿼리는 시간이 지남에 따른 매출의 누적 합계를 제공하여 누적 매출 성장을 추적하기 쉽게 합니다.

결과:

date | sales | running_total
2023-01-01 | 100 | 100
2023-01-02 | 150 | 250
2023-01-03 | 200 | 450
2023-01-04 | 250 | 700

<div class="content-ad"></div>

윈도우 함수는 단일 행 그룹으로 결과 집합을 축소시키지 않고 실행 합계, 이동 평균, 순위 등 다양한 작업에 사용할 수 있어요.

# 2. 공통 테이블 표현식 (CTE)

공통 테이블 표현식은 쿼리 내에서 참조할 수 있는 임시 결과 집합을 만드는 방법을 제공해요. 이것은 가독성을 향상시키고 복잡한 쿼리를 간단하게 만들어줘요. 다음은 각 제품 카테고리별 총 매출을 계산하기 위해 CTE를 사용하는 방법이에요.

이 쿼리는 'category_revenue'라는 CTE를 정의해요. 이는 매출 테이블에서 수익을 합산하고 카테고리 열을 기준으로 결과를 그룹화하여 각 카테고리별 총 수익을 계산해요. 메인 쿼리는 'category_revenue' CTE에서 모든 열을 선택하여 각 카테고리의 계산된 총 수익을 효과적으로 표시해요.

<div class="content-ad"></div>

출력:

category | total_revenue

A | 5000

B | 7000

<div class="content-ad"></div>


C|4500

# 3. Recursive Queries

Recursive queries enable travel of hierarchical data structures like organisational charts or bill of materials. Suppose we have a table representing employee relationships, and we want to find all the subordinates of a given manager.

This recursive CTE finds all employees who report directly or indirectly to a specific manager ‘manager_id_of_interest’. It starts with employees directly reporting to the manager and then recursively finds their subordinates, building the hierarchy.


<div class="content-ad"></div>


| employee_id | name  | manager_id           |
|:------------|:------|:---------------------|
| 2           | Alice | manager_id_of_interest |
| 3           | Bob   | 2                    |


<div class="content-ad"></div>

4|Charlie |3

# 4. Pivot Tables

피벗 테이블은 행을 열로 변환하여 데이터를 요약해 주는 표 형식을 제공합니다. 예를 들어, 판매 데이터가 포함된 테이블이 있고, 각 제품의 월별 총 판매액을 표시하기 위해 데이터를 피벗하려고 한다고 가정해 봅시다.

이 쿼리는 조건부 집계를 사용하여 각 제품의 월별 판매 데이터를 집계합니다. 각 제품의 1월, 2월, 3월 판매액을 따로 합산하여, 이러한 월에 대한 각 제품의 총 판매액을 보여주는 테이블을 만듭니다.

<div class="content-ad"></div>

다음은 Markdown 형식으로 테이블을 나타낸 내용입니다:

| product | Jan | Feb | Mar |
|---------|-----|-----|-----|
| Product A | 100 | 200 | 150 |
| Product B | 80 | 190 | 220 |
| Product C | 60 | 140 | 130 |

# 5. 분석 함수

분석 함수는 행 그룹을 기반으로 집계 값을 계산합니다. 예를 들어, ROW_NUMBER( ) 함수를 사용하여 데이터셋의 각 레코드에 고유한 행 번호를 할당할 수 있습니다.

<div class="content-ad"></div>

이 쿼리는 ROW_NUMBER() 윈도우 함수를 사용하여 주문 날짜를 기준으로 각 고객당 주문에 고유한 순위를 할당합니다. 결과는 각 고객이 배치한 주문의 순서를 보여줍니다.

 출력:

| customer_id | order_id | order_rank |
|------------|-----------|--------------|
| 1              | 101          | 1                    |
| 1              | 102          | 2                    |
| 2              | 201          | 1                    |
| 2              | 202          | 2                    |
| 2              | 203          | 3                    |

# 6. Unpivot

<div class="content-ad"></div>

언피벗은 열을 행으로 변환하는 피벗의 반대 작업입니다. 월별로 집계된 매출 데이터가 있는 테이블이 있다고 가정해봅시다. 시간에 따른 트렌드를 분석하기 위해 이를 언피벗하려고 합니다.

다음 쿼리는 매출 열을 행으로 변환하여 제품별 시간에 따른 트렌드를 분석하기 쉽게 만듭니다. 각 행은 특정 월에 대한 제품의 매출을 나타냅니다.

결과:

product | month | sales
ProductA | Jan | 100
ProductA | Feb | 150
ProductA | Mar | 200
ProductB | Jan | 200
ProductB | Feb | 250
ProductB | Mar | 300

<div class="content-ad"></div>

# 7. 조건부 집계

조건부 집계는 지정된 기준에 따라 조건부로 집계 함수를 적용하는 것을 말합니다. 예를 들어, 반복 고객이 주문한 주문에 대해서만 평균 판매 금액을 계산하고 싶을 수 있습니다.

다음 쿼리는 두 개 이상의 주문을 한 고객들의 평균 주문 총액을 계산합니다. 각 고객에 대해 주문 수와 총 주문 금액을 집계한 후, 반복 고객들에 대한 평균을 계산합니다.

출력:

<div class="content-ad"></div>

customer_id | avg_sales_repeat_customers 
1 | 250 
2 | 150 
3 | 300

## 8. 날짜 함수

SQL에서의 날짜 함수는 날짜와 관련된 정보를 조작하고 추출할 수 있게 해줍니다. 예를 들어 DATE_TRUNC() 함수를 사용하여 매출 데이터를 월별로 그룹화할 수 있습니다.

이 출력은 매출이 total_sales로 집계된 각 월을 month으로 나타내며, 각 월은 해당 월의 첫 번째 날로 표시됩니다 (예: 1월의 경우 2023-01-01). 각 해당 월의 총 매출액이 합산되어 표시됩니다.

<div class="content-ad"></div>

출력:

| month      | total_sales |
|------------|-------------|
| 2023-01-01 | 15000       |
| 2023-02-01 | 20000       |
| 2023-03-01 | 17500       |
| 2023-04-01 | 22000       |

## 9. 병합문

병합문(UPSERT 또는 ON DUPLICATE KEY UPDATE로도 알려져 있음)은 소스 테이블과의 조인 결과를 기반으로 대상 테이블에 레코드를 삽입, 업데이트 또는 삭제할 수 있게 합니다. 고객 데이터를 포함하는 두 테이블을 동기화하고 싶다고 가정해 봅시다.

<div class="content-ad"></div>


customers_target (before merge):

| customer_id | name       | email           |
|-------------|------------|-----------------|
| 1           | John Doe   | john@example.com|
| 2           | Jane Smith | jane@example.com|


<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경해보면 다음과 같습니다.


| customer_id | name         | email            |
|------------ | ------------ | -----------------|
| 1           | John Doe     | john@example.com |
| 2           | Jane Johnson | jane.j@example.com |
| 3           | Alice Brown  | alice@example.com |


<div class="content-ad"></div>

MERGE 문은 customers_source 테이블을 기반으로 customers_target 테이블을 업데이트합니다. customers_source의 customer_id가 customers_target에서와 일치하는 경우, 이름과 이메일이 업데이트됩니다. 일치하는 항목이 없는 경우 새로운 행이 삽입됩니다.

## 10. Case 문

Case 문을 사용하면 SQL 쿼리 내에서 조건부 논리를 구현할 수 있습니다. 예를 들어, 총 구매 금액에 기초하여 고객을 분류하는 Case 문을 사용할 수 있습니다.

예제 데이터 세트를 고려하고 출력을 설명해보겠습니다.

<div class="content-ad"></div>


orders 테이블에서의 예시 데이터:

customer_id | order_total
1 | 200
1 | 300
2 | 800
3 | 150
3 | 400
4 | 1200

결과:

customer_id | customer_category
1 | Gold
2 | Gold
3 | Silver
4 | Platinum


<div class="content-ad"></div>

쿼리는 고객의 총 구매 금액을 기준으로 고객을 카테고리로 분류합니다. 총 구매 금액이 $1000 이상인 경우 '플래티넘'으로 레이블을 지정하고, $500에서 $999 사이인 경우 '골드'로 레이블을 지정하며, $500 미만인 경우 '실버'로 레이블을 지정합니다.

# 11. 문자열 함수

SQL에서의 문자열 함수는 텍스트 데이터를 조작하는 데 사용됩니다. 예를 들어 CONCAT( ) 함수를 사용하면 이름과 성을 연결할 수 있습니다.

예시 데이터 세트를 고려하고 출력을 설명해 보겠습니다.

<div class="content-ad"></div>

예시 데이터인 직원 테이블:

| 이름 | 성 |
|--------|--------|
| John | Doe |
| Jane | Smith |
| Alice | Johnson |
| Bob | Brown |

결과:

| 전체 이름 |
|--------------|
| John Doe |
| Jane Smith |
| Alice Johnson |
| Bob Brown |

<div class="content-ad"></div>

질문은 employees 테이블에서 first_name 및 last_name 열을 연결하여 각 직원의 full_name을 만드는 것입니다.

## 12. 그룹 세트

그룹 세트를 사용하면 하나의 쿼리에서 여러 수준의 세분화 데이터를 집계할 수 있습니다. 우리가 매월 그리고 연도별로 총 판매 수익을 계산하고 싶다고 가정해 봅시다.

예시 데이터는 sales 테이블에 있습니다:

<div class="content-ad"></div>

주문 날짜 | 매출액
2023–01–15 | 1000
2023–01–20 | 1500
2023–02–10 | 2000
2023–03–05 | 2500
2024–01–10 | 3000
2024–01–20 | 3500
2024–02–25 | 4000

결과:

년도 | 월 | 총 매출
2023 | 1 | 2500
2023 | 2 | 2000
2023 | 3 | 2500
2024 | 1 | 6500
2024 | 2 | 4000
2023 | NULL | 7000
2024 | NULL | 10500
NULL | 1 | 9000
NULL | 2 | 6000
NULL | 3 | 2500

그 쿼리는 GROUPING SETS를 사용하여 매출 데이터를 연도별 및 월별, 연도만, 월만으로 그룹화합니다. 결과적으로 각 연도의 각 월별 소계, 각 연도의 총합, 모든 연도를 통틀어 각 월의 총합이 나타납니다.

<div class="content-ad"></div>

# 13. Cross Joins

Cross joins은 두 개의 테이블의 데카르트 곱을 생성하여 각 테이블의 모든 행을 결합한 조합을 생성합니다. 예를 들어, 교차 조인을 사용하여 제품과 고객의 모든 가능한 조합을 생성할 수 있습니다.

제품 및 고객 테이블을 위한 예제 데이터 세트를 살펴봅시다.

제품 테이블:

<div class="content-ad"></div>

product_id | product_name
--- | ---
1 | Product A
2 | Product B

customers table:

customer_id | customer_name
--- | ---
101 | Customer X
102 | Customer Y

Output:

<div class="content-ad"></div>

product_id | product_name | customer_id | customer_name
1 | Product A | 101 | Customer X
1 | Product A | 102 | Customer Y
2 | Product B | 101 | Customer X
2 | Product B | 102 | Customer Y

해당 쿼리는 PRODUCTS와 CUSTOMERS 테이블 사이에 CROSS JOIN을 수행하여 카테시안 곱을 생성합니다. 이는 모든 제품이 모든 고객과 쌍을 이루어 모든 제품과 고객의 가능한 조합을 생성하는 것을 의미합니다.

## 14. 인라인 뷰

인라인 뷰(파생 테이블로도 알려짐)는 SQL 쿼리 내에서 임시 결과 집합을 만드는 데 사용됩니다. 예를 들어, 우리가 주문 평균 가치를 초과하는 구매를 한 고객을 찾고 싶다면 인라인 뷰를 사용할 수 있습니다.

<div class="content-ad"></div>

주문 테이블:

customer_id | order_total
1 | 100
1 | 200
2 | 500
3 | 300
3 | 200
4 | 700

각 고객별 총 주문을 계산합니다:

customer_id | order_total
1 | 300
2 | 500
3 | 500
4 | 700

<div class="content-ad"></div>

표를 마크다운 형식으로 변경하세요.


| customer_id | order_total |
| --- | --- |
| 2 | 500 |
| 3 | 500 |
| 4 | 700 |


<div class="content-ad"></div>

# 15. 집합 연산자

UNION, INTERSECT 및 EXCEPT와 같은 집합 연산자를 사용하여 두 개 이상의 쿼리 결과를 결합할 수 있습니다. 예를 들어, 우리는 UNION 연산자를 사용하여 두 개의 쿼리 결과를 하나의 결과 세트로 병합할 수 있습니다.

이 쿼리는 제품 및 보관된 제품 테이블에서 결과를 결합하여 중복 항목을 제거하여 제품 ID 및 이름의 통합 목록을 만듭니다. UNION 연산자는 각 제품이 최종 출력에서 한 번만 나타나도록 합니다.

결과:

<div class="content-ad"></div>

product_id | product_name
1 | Chocolate Bar
2 | Dark Chocolate
3 | Milk Chocolate
4 | White Chocolate
5 | Almond Chocolate

이 15가지의 고급 SQL 기술을 사용하여 복잡한 데이터 문제를 쉽고 정확하게 해결할 수 있습니다. 데이터 분석가, 엔지니어, 혹은 과학자라면 SQL 기술을 향상시킴으로써 데이터 처리 역량을 크게 향상시킬 수 있습니다.

이 게시물이 유용했다면, 반드시 클랩(clap), 댓글(comment), 구독(subscribe) 및 팔로우(follow)하여 미디엄(medium.com)에서 더 많은 데이터 관련 콘텐츠를 접해보세요.

즐거운 데이터 분석 되세요!