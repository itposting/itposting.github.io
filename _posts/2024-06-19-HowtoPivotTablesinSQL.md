---
title: "SQL에서 Pivot 테이블하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoPivotTablesinSQL_0.png"
date: 2024-06-19 01:55
ogImage: 
  url: /assets/img/2024-06-19-HowtoPivotTablesinSQL_0.png
tag: Tech
originalTitle: "How to Pivot Tables in SQL"
link: "https://medium.com/towards-data-science/how-to-pivot-tables-in-sql-88ef2ada5d96"
---


## 데이터 과학, SQL, ETL

![이미지](/assets/img/2024-06-19-HowtoPivotTablesinSQL_0.png)

# 서문

구조화된 쿼리 언어(SQL)는 데이터 과학자와 데이터 분석가와 같은 데이터 전문가들에게 필수적인 도구입니다. SQL을 사용하면 대용량 데이터셋을 효율적으로 검색, 조작 및 분석할 수 있습니다. 이는 산업에서 널리 사용되는 도구로, 중요한 기술입니다. 이 글에서는 SQL에서 Pivot 테이블을 만드는 방법에 대해 공유하고자 합니다. 이 글은 지난 "판다스!!! 첫 기술 면접 후 배운 것들"이라는 글을 계속해서 다루고 있습니다. 그 글에서는 저의 판다스 학습 경험에 대해 공유한 내용입니다.

<div class="content-ad"></div>

SQL에서 Pivot 테이블은 데이터를 행에서 열로 변환하는 기술로 사용됩니다.

Joan Casteel의 오라클 12c: SQL 책에는 "Pivot 테이블은 다차원 데이터의 표현입니다." 라고 언급되어 있습니다. Pivot 테이블을 사용하면 사용자는 다양한 데이터 차원의 다른 집계를 볼 수 있습니다. 데이터 분석에 강력한 도구로, 데이터를 집계, 요약 및 직관적이고 쉽게 읽을 수 있는 형식으로 제시할 수 있습니다.

예를 들어, 아이스크림 가게 주인은 지난 주에 가장 잘 팔린 아이스크림 맛을 분석하고 싶어할 수 있습니다. 이 경우, 아이스크림 맛과 요일의 두 차원 데이터에 대한 Pivot 테이블이 유용할 것입니다. 매출은 분석을 위한 집계로 합산될 수 있습니다.

아이스크림 가게 주인은 Pivot 테이블을 사용하여 아이스크림 맛과 요일에 따른 매출을 비교할 수 있습니다. Pivot 테이블은 데이터를 변환하여 패턴과 트렌드를 쉽게 발견할 수 있도록 도와줍니다. 이 정보를 통해 주인은 인기 있는 아이스크림 맛의 공급을 늘리거나 수요에 따라 가격을 조정하는 등 데이터 기반 결정을 내릴 수 있습니다.

<div class="content-ad"></div>

전체적으로, 피벗 테이블은 데이터 분석에 탁월한 도구로, 사용자들이 다차원 데이터를 더 직관적이고 의미 있는 방식으로 요약하고 표현할 수 있습니다. 이들은 금융, 소매 및 의료 분야와 같은 산업에서 널리 활용되며, 복잡한 대량의 데이터를 분석해야 하는 경우에 사용됩니다.

![이미지](/assets/img/2024-06-19-HowtoPivotTablesinSQL_1.png)

# 개요

본 문서는 Oracle의 분석 함수인 일반적으로 "PIVOT" 함수를 기반으로 합니다. 이는 SQL에서 피벗 테이블을 활용하는 다양한 상황에 대한 포괄적인 시각을 제공하기 위해 구성되어 있습니다. 우리는 피벗 테이블을 생성하는 가장 단순한 방법 뿐만 아니라 PIVOT 함수를 사용하여 작업을 수행하는 가장 쉽고 흔한 방법도 살펴볼 것입니다. 마지막으로, PIVOT 함수의 일부 제약 사항에 대해 논의할 예정입니다.

<div class="content-ad"></div>

## 참고사항:

- 저는 오라클 11g를 사용할 것이지만, 함수들은 최신 오라클 12c 이상에서도 동일합니다.
- 데모 데이터 세트는 Microsoft의 Northwind 데이터 세트를 사용할 것입니다. Northwind Traders의 판매 데이터가 포함되어 있으며, 이는 허구의 특산품 수출/수입 회사입니다. 이 데이터베이스는 학습 및 데모 목적으로 무료로 제공되며 널리 배포되고 있습니다. 데이터베이스 환경을 미리 설정해 주세요! 아래에 Northwind 스키마를 첨부하였습니다:

```js
REGION (RegionID, RDescription)
TERRITORIES (TerritoryID, TDescription, RegionID@)
CATEGORIES (CategoryID, CategoryName, Description)
SUPPLIERS (SupplierID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone)
CUSTOMERS (CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone)
SHIPPERS (ShipperID, CompanyName, Phone)
PRODUCTS (ProductID, ProductName, SupplierID@, CategoryID@, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued)
EMPLOYEES (EmployeeID, LastName, FirstName, Title, BirthDate, HireDate, Address, City, RegionID@, PostalCode, Country, HomePhone, Extension, ReportsTo@)
EMPLOYEETERRITORIES (EmployeeID@, TerritoryID@)
ORDERS (OrderID, CustomerID@, EmployeeID@, TerritoryID@, OrderDate, RequiredDate, ShippedDate, ShipVia@, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry)
ORDERDETAILS (OrderID@, ProductID@, UnitPrice, Quantity, Discount)
```

- SQL*Plus에 익숙하지 않다면, 시작하기 전에 오라클의 SQL*Plus Quick Start를 확인해 주세요.

<div class="content-ad"></div>

자세히 설명하지 않고, 시작해 봅시다!

# "DECODE"를 사용한 피벗 테이블

![이미지](/assets/img/2024-06-19-HowtoPivotTablesinSQL_2.png)

테이블을 피벗하는 가장 기본적인 방법은 DECODE() 함수를 활용하는 것입니다. DECODE() 함수는 if else 문과 유사합니다. 입력값을 각 값과 비교하여 출력 값을 생성합니다.

<div class="content-ad"></div>

- 입력/값: "입력"은 모든 "값"과 비교됩니다.
- 반환: 입력 = 값이면, "반환"이 출력됩니다.
- 기본값 (옵션): 입력 ≠ 모든 값 중 하나라도 다를 경우, "기본값"이 출력됩니다.

DECODE() 함수가 어떻게 작동하는지 알았으니, 이제 첫 번째 피벗 테이블을 만들 차례입니다.

## 1차 버전: 총합 열 및 행이 없는 피벗 테이블

<img src="/assets/img/2024-06-19-HowtoPivotTablesinSQL_3.png" />

<div class="content-ad"></div>

DECODE() 함수를 사용하면 아이스크림 가게 주인을 위한 피벗 테이블의 의사 코드를 작성할 수 있어요. "요일"이 각 평일에 일치하면 DECODE()는 해당 날짜의 수익을 반환하고, 일치하지 않으면 대신 0을 반환해요.

```js
SELECT 아이스크림 맛,
SUM(DECODE(요일, '월요일', 수익, 0)) AS 월요일, SUM(DECODE(요일, '화요일', 수익, 0)) AS 화요일,
SUM(DECODE(요일, '수요일', 수익, 0)) AS 수요일,
SUM(DECODE(요일, '목요일', 수익, 0)) AS 목요일,
SUM(DECODE(요일, '금요일', 수익, 0)) AS 금요일,
SUM(DECODE(요일, '토요일', 수익, 0)) AS 토요일,
SUM(DECODE(요일, '일요일', 수익, 0)) AS 일요일
FROM 아이스크림 가게 데이터셋
WHERE 날짜가 지난 월요일부터 지난 일요일 사이에 있는 경우;
```

## 2차 버전: 총계 열과 행이 있는 피벗 테이블

<img src="/assets/img/2024-06-19-HowtoPivotTablesinSQL_4.png" />

<div class="content-ad"></div>

좋은 일했어요! 이제 아이스크림 가게 주인은 지난 주 판매 현황에 대해 더 알고 싶어합니다. 피벗 테이블에 합계 열과 합계 행을 추가하여 업그레이드할 수 있습니다.

이를 이루는 방법은 GROUP BY 문에서 GROUPING SETS 표현식을 사용하는 것입니다. GROUPING SETS 표현식은 여러 개의 GROUP BY 집계를 위한 기준을 정의합니다.

- attribute: GROUP BY할 요소들의 단일 요소 또는 목록
- (): 빈 그룹으로, 피벗 테이블의 총합 행이 됩니다

```js
SELECT NVL(아이스크림 맛, '총합') "아이스크림 맛", 
SUM(DECODE(요일, '월요일', 매출, 0)) AS 월요일, SUM(DECODE(요일, '화요일', 매출, 0)) AS 화요일,
SUM(DECODE(요일, '수요일', 매출, 0)) AS 수요일,
SUM(DECODE(요일, '목요일', 매출, 0)) AS 목요일,
SUM(DECODE(요일, '금요일', 매출, 0)) AS 금요일,
SUM(DECODE(요일, '토요일', 매출, 0)) AS 토요일,
SUM(DECODE(요일, '일요일', 매출, 0)) AS 일요일, 
SUM(매출) AS 총합
FROM 아이스크림 가게 데이터셋
WHERE 날짜 BETWEEN 지난 월요일 AND 지난 일요일
GROUP BY GROUPING SETS (아이스크림 맛, ());
```

<div class="content-ad"></div>

참고: NVL() 함수는 경우에 따라 생성된 빈 행을 'TOTAL'로 대체합니다. NVL() 함수에 익숙하지 않다면, 간단히 말해 널 값을 바꿔주는 함수입니다.

TOTAL 열을 계산하는 또 다른 방법은 월요일부터 일요일까지의 모든 수익을 더하는 것입니다:

```js
SUM(DECODE(요일, 'Monday', 수익, 0)) 
+ SUM(DECODE(요일, 'Tuesday', 수익, 0)) 
+ SUM(DECODE(요일, 'Wednesday', 수익, 0)) 
+ SUM(DECODE(요일, 'Thursday', 수익, 0)) 
+ SUM(DECODE(요일, 'Friday', 수익, 0)) 
+ SUM(DECODE(요일, 'Saturday', 수익, 0))
+ SUM(DECODE(요일, 'Sunday', 수익, 0)) AS TOTAL
```

## 3번째 버전: 총합 열과 행이 있는 피벗 테이블 및 기타 총합

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoPivotTablesinSQL_5.png" />

아이스크림 매장 소유자가 제공한 피벗 테이블에 더 추가하고 싶은 열이 있는 경우: 각 맛의 아이스크림 구매 총 수를 표시하고 싶어합니다. 문제 없어요! 동일한 개념으로 다른 "총계" 열을 추가할 수 있어요!

```js
SELECT NVL(아이스크림 맛, '총계') "아이스크림 맛", 
SUM(DECODE(요일, '월요일', 매출액, 0)) AS 월요일, SUM(DECODE(요일, '화요일', 매출액, 0)) AS 화요일,
SUM(DECODE(요일, '수요일', 매출액, 0)) AS 수요일,
SUM(DECODE(요일, '목요일', 매출액, 0)) AS 목요일,
SUM(DECODE(요일, '금요일', 매출액, 0)) AS 금요일,
SUM(DECODE(요일, '토요일', 매출액, 0)) AS 토요일,
SUM(DECODE(요일, '일요일', 매출액, 0)) AS 일요일, 
SUM(매출액) AS 총계,
SUM(구매 ID) "기타 총계"
FROM 아이스크림 매장 데이터셋
WHERE 날짜가 지난 월요일부터 지난 일요일까지
GROUP BY GROUPING SETS (아이스크림 맛, ());
```

DECODE()로 피벗 테이블을 만드는 방법을 알았으니, 이제 Northwind 데이터셋을 활용하여 세 가지 연습을 해보세요!

<div class="content-ad"></div>

Q
1. 각 국가별 직원들이 각 지역에서 근무하는 직원 수를 알고 싶다면 어떻게 해야 할까요?

이 질문을 해결하기 위해 먼저 REGION 테이블에서 모든 고유 지역을 쿼리할 수 있습니다. 또한, 직원들이 어느 나라에서 온지도 확인해보세요.

```js
SELECT DISTINCT REGIONID||' '||RDescription AS REGION
FROM REGION
ORDER BY 1;
```

![이미지](/assets/img/2024-06-19-HowtoPivotTablesinSQL_6.png)

<div class="content-ad"></div>

```sql
SELECT DISTINCT Country
FROM EMPLOYEES
ORDER BY 1;
```

![Pivot Table](/assets/img/2024-06-19-HowtoPivotTablesinSQL_7.png)

We will make a 2 * 4 pivot table for this question.

Next, we can create a pivot table using DECODE(). A sample answer and output are shown below:

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-HowtoPivotTablesinSQL_8.png" />

```js
SELECT NVL(Country, 'TOTAL') AS COUNTRY, 
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '1 eastern', 1, 0)) "1 EASTERN",
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '2 western', 1, 0)) "2 WESTERN",
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '3 northern', 1, 0)) "3 NORTHERN",
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '4 southern', 1, 0)) "4 SOUTHERN",
SUM(EmployeeID) AS TOTAL
FROM EMPLOYEES
JOIN REGION USING (REGIONID)
GROUP BY GROUPING SETS (Country, ());
```

<img src="/assets/img/2024-06-19-HowtoPivotTablesinSQL_9.png" />

```js
--Q1
SELECT Country, 
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '1 eastern', 1, 0)) "1 EASTERN",
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '2 western', 1, 0)) "2 WESTERN",
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '3 northern', 1, 0)) "3 NORTHERN",
SUM(DECODE(LOWER(REGIONID||' '||RDescription), '4 southern', 1, 0)) "4 SOUTHERN",
SUM() AS TOTAL
FROM EMPLOYEES
JOIN REGION USING (REGIONID)
GROUP BY Country;
``` 


<div class="content-ad"></div>

2010년의 각 달에 대해 각 직원이 처리한 주문의 수익을 표시합니다. 또한 최근화해서 가장 가까운 달러로 반올림하여 총 수익과 총 주문 수를 표시해줍니다.

```js
--Q2
열 EMPLOYEE FORMAT A18
SELECT NVL(EmployeeID||' '||FirstName||' '||LastName, 'TOTAL') AS EMPLOYEE,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 1, (UnitPrice * Quantity - Discount), 0)), '$990') AS JAN,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 2, (UnitPrice * Quantity - Discount), 0)), '$990') AS FEB,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 3, (UnitPrice * Quantity - Discount), 0)), '$990') AS MAR,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 4, (UnitPrice * Quantity - Discount), 0)), '$990') AS APR,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 5, (UnitPrice * Quantity - Discount), 0)), '$990') AS MAY,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 6, (UnitPrice * Quantity - Discount), 0)), '$990') AS JUN,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 7, (UnitPrice * Quantity - Discount), 0)), '$99,990') AS JUL,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 8, (UnitPrice * Quantity - Discount), 0)), '$99,990') AS AUG,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 9, (UnitPrice * Quantity - Discount), 0)), '$99,990') AS SEP,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 10, (UnitPrice * Quantity - Discount), 0)), '$99,990') AS OCT,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 11, (UnitPrice * Quantity - Discount), 0)), '$99,990') AS NOV,
TO_CHAR(SUM(DECODE(EXTRACT(MONTH FROM OrderDate), 12, (UnitPrice * Quantity - Discount), 0)), '$99,990') AS DEC, 
TO_CHAR(SUM((UnitPrice * Quantity - Discount)), '$999,990') AS TOTAL
FROM ORDERS 
JOIN ORDERDETAILS USING (OrderID)
JOIN EMPLOYEES USING (EmployeeID)
WHERE EXTRACT(YEAR FROM OrderDate) = 2010
GROUP BY GROUPING SETS (EmployeeID||' '||FirstName||' '||LastName, ())
ORDER BY 1;
```

참고: FORMAT 명령어 및 TO_CHAR() 함수는 형식을 지정하는 용도로 사용됩니다. 더 알고 싶다면 오라클 웹사이트의 Format Models 및 Formatting SQL*Plus Reports 섹션을 확인해보세요.

![이미지](/assets/img/2024-06-19-HowtoPivotTablesinSQL_10.png)

<div class="content-ad"></div>

# "PIVOT"으로 피벗 테이블 만들기

![이미지](/assets/img/2024-06-19-HowtoPivotTablesinSQL_11.png)

이제 DECODE()를 사용하여 피벗 테이블을 만드는 방법을 알게 되었으니, Oracle 11g 버전에서 소개된 PIVOT() 절로 넘어갈 수 있습니다.

- aggr: SUM, COUNT, MIN, MAX, AVG와 같은 함수
- value: 테이블 열에 대한 헤딩으로 피벗할 값 목록

<div class="content-ad"></div>

아이스크림 가게 예제로 돌아가 봅시다. 이를 PIVOT() 절을 사용하여 어떻게 만들 수 있는지 알아보겠습니다:

## 1st Version: 총합 열 및 행이 없는 피벗 테이블

```js
SELECT *
FROM (
      SELECT day of the week, ice cream flavor, revenue
      FROM ice cream shop dataset 
      WHERE date between last Monday and last Sunday
)
PIVOT (
       SUM(revenue) 
       FOR day of the week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
);
```

## 2nd Version: 총합 열 및 행이 포함된 피벗 테이블

<div class="content-ad"></div>

만약 피벗 테이블에 총합 열을 추가하고 싶다면, NVL() 함수를 사용하면 좋은 방법입니다.

```js
SELECT *
FROM (
      SELECT NVL(아이스크림 맛, '총합') AS 아이스크림 맛,
             NVL(요일, -1) AS DOW, 
             SUM(수익) AS REV
      FROM 아이스크림 가게 데이터셋
      WHERE 날짜가 지난 월요일부터 지난 일요일까지
      GROUP BY CUBE (아이스크림 맛, 요일) 
)
PIVOT (
       SUM(REV) 
       FOR DOW IN ('월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일', -1 AS 총합)
);
```

## 3rd 버전: 총합 열과 행 및 다른 합계가 포함된 피벗 테이블

다른 합계가 등장하는 경우 문제를 해결할 수 있는 유일한 방법은 JOIN() 절을 사용하는 것입니다:

<div class="content-ad"></div>

```sql
SELECT ice cream flavor, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, TOTAL, OTHER TOTAL
FROM (
      SELECT NVL(ice cream flavor, 'TOTAL') AS ice cream flavor,
             NVL(day of the week, -1) AS DOW, 
             SUM(revenue) AS REV
      FROM ice cream shop dataset 
      WHERE date between last Monday and last Sunday
      GROUP BY CUBE (ice cream flavor, day of the week) 
)
PIVOT (
       SUM(REV) 
       FOR DOW IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', -1 AS TOTAL)
)
JOIN (
      SELECT NVL(ice cream flavor, 'TOTAL') AS ice cream flavor, 
             SUM(purchase ID) "OTHER TOTAL"
      FROM ice cream shop dataset 
      WHERE date between last Monday and last Sunday
      GROUP BY ROLLUP (ice cream flavor)
) USING (ice cream flavor);
```

참고: 위의 유사 코드에서는 GROUP BY에서 CUBE 및 ROLLUP 확장을 사용합니다. 간단한 설명으로 충분해요.

- CUBE(A, B, C): (A, B, C), (A, B), (A, C), (B, C), (A), (B), (C), ()
- ROLLUP(A, B, C): (A, B, C), (A, B), (A), ()

PIVOT() 절 작동 방식을 이해한 후에는 이를 part 1에 있는 Northwind 데이터세트로 연습해볼 수 있을 거예요.

<div class="content-ad"></div>

안녕하세요! 아래는 Markdown 형식으로 변경된 테이블입니다.

Q
1. 우리가 직원이 각 국가에서 서비스하는 지역별 직원 수를 알고 싶다고 가정해 봅시다.

```js
--Q1
--해보세요!
```

Q
2. 2010년 각 월별로, 각 직원이 처리한 주문의 수익을 보여주세요. 또한 가장 가까운 달러로 반올림하여 총 수익과 총 주문 수를 표시해 주세요.

```js
--Q2
--해보세요!
```

<div class="content-ad"></div>

# 마무리

이 안내서에서는 SQL의 피벗 테이블의 강력한 기능을 탐구했습니다. DECODE() 및 PIVOT() 함수에 중점을 둔 채 피벗 테이블을 사용하는 방법을 살펴보았습니다. 우리는 피벗 테이블에 대한 소개와 행을 열로 변환하여 데이터 분석을 향상시키는 중요성을 시작으로 합니다. 그런 다음 DECODE()를 사용하여 피벗 테이블을 생성하는 프로세스를 살펴보고, 오라클 11g에 도입된 더 간결한 PIVOT() 함수를 살펴보았습니다. 이러한 기술을 적용하여 다차원 데이터를 효율적으로 분석하는 방법을 실제 아이스크림 가게 데이터 세트와 같은 실용적인 예제를 통해 보여주었습니다.

<img src="/assets/img/2024-06-19-HowtoPivotTablesinSQL_12.png" />

## 요약 및 핵심 포인트

<div class="content-ad"></div>

- DECODE() 함수를 사용한 피벗 테이블: 데이터를 수동으로 피벗하는 데 DECODE() 함수를 사용하는 기본적인 방법입니다.
- PIVOT() 함수를 사용한 피벗 테이블: PIVOT() 함수를 활용하여 더 효율적이고 가독성 있는 피벗 테이블을 생성하는 방법입니다.

댓글에서 답변을 공유하신 다면 망설이지 마세요! 데이터에 대해 배우고 실제 응용 분야에서 배운 것을 생각하는 것을 좋아합니다. 이 기사를 즐겁게 보셨다면 응원의 의미로 클랩(clap)을 남겨주시면 감사하겠습니다. LinkedIn과 Twitter를 통해 연락하거나 토의할 내용이 있다면 언제든지 연락해주세요. 미디엄(Medium)에서 저를 팔로우하시면 더 많은 데이터 과학 기사를 만나보실 수 있습니다!