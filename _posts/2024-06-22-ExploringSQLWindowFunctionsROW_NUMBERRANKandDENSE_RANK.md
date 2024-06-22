---
title: "SQL 윈도우 함수 탐구 ROW_NUMBER, RANK, DENSE_RANK 사용 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_0.png"
date: 2024-06-22 17:39
ogImage: 
  url: /assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_0.png
tag: Tech
originalTitle: "Exploring SQL Window Functions: ROW_NUMBER, RANK, and DENSE_RANK"
link: "https://medium.com/@sqlfundamentals/exploring-sql-window-functions-row-number-rank-and-dense-rank-4a4a67432e0e"
---


SQL 세계에서 윈도우 함수는 현재 행과 관련된 테이블 행 집합을 대상으로 계산을 수행할 수 있는 강력한 도구입니다. 이 글에서는 세 가지 필수 SQL 윈도우 함수인 ROW_NUMBER, RANK 및 DENSE_RANK에 대해 알아볼 것입니다. 이러한 함수를 사용하면 결과 세트 내에서 행에 고유한 번호나 순위를 할당하여 데이터에서 가치 있는 통찰을 추출하기가 쉬워집니다.

<div class="content-ad"></div>

일반 구문:
ROW_NUMBER() OVER (ORDER BY column)

- ORDER BY는 결과 집합을 정렬하는 데 사용되는 열 또는 표현식을 지정합니다.

ROW_NUMBER() OVER (PARTITION BY column ORDER BY column)

- PARTITION BY는 지정된 열을 기준으로 결과 집합을 분할하는 선택적 절입니다. 순위가 각 파티션 내에서 별도로 적용됩니다.

<div class="content-ad"></div>

회사 직원들에게 급여 순으로 내림차순으로 새 직원 ID를 할당해 봅시다:

```js
SELECT * , ROW_NUMBER() OVER(ORDER BY salary DESC) AS new_employee_id
FROM employees;
```

![이미지](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_1.png)

직원들을 급여에 따라 내림차순으로 순위를 매기고, 'position' 열을 기준으로 결과 집합을 파티션으로 나눠 봅시다.

<div class="content-ad"></div>


```js
SELECT * , ROW_NUMBER() OVER(PARTITION BY position ORDER BY salary DESC) AS employee_rank
FROM employees;
```

![Exploring SQL Window Functions](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_2.png)

## 2. RANK Function

The RANK() function assigns a unique rank to each row based on the values in one or more columns. Rows with the same values receive the same rank, and the next rank is skipped. It’s useful when you want to create a ranking with gaps.


<div class="content-ad"></div>

일반적인 구문:

RANK() OVER (ORDER BY column)

RANK() OVER (PARTITION BY column ORDER BY column)

우리는 직원들을 급여에 따라 내림차순으로 순위 매겨볼게요:

<div class="content-ad"></div>

```sql
SELECT * , RANK() OVER(ORDER BY salary DESC) AS salary_rank
FROM employees;
```

![Exploring SQL Window Functions](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_3.png)

## 3. DENSE_RANK Function: 동일한 순위를 가진 항목 그룹화하기

DENSE_RANK() 함수는 동일한 순위를 가진 항목을 함께 그룹화하고 싶을 때 유용합니다. 동일한 값들을 갖는 행들은 동일한 순위를 부여받으며, 다음 순위가 건너뛰어지지 않습니다. 이 함수는 순위에 빈칸이 없는 순위를 만들고 싶을 때 유용합니다.

<div class="content-ad"></div>

일반적인 구문:


DENSE_RANK() OVER (ORDER BY column)

DENSE_RANK() OVER (PARTITION BY column ORDER BY column)


만약 "titles"라는 테이블이 있고 "title"과 "price"라는 열이 있다고 가정해보겠습니다.
책 제목을 가격순으로 순위를 매기고 동일한 가격을 가진 제목들을 그룹화하려면:

<div class="content-ad"></div>

```js
SELECT title, price, DENSE_RANK() OVER(ORDER BY price DESC) as 'rank'
FROM titles;
```

![Exploring SQL Window Functions](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_4.png)

‘type’ 열을 기반으로 결과 집합을 파티션으로 나눠 봅시다.

```js
SELECT title, price, type, DENSE_RANK() OVER(PARTITION BY type ORDER BY price DESC) as 'rank'
FROM titles;
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_5.png)

가정하고 있는 것은 "titles"라는 테이블이 "title"과 "ytd_sales"라는 열을 가지고 있다는 것입니다. 성과가 좋은 책을 식별하기 위해 다음 쿼리를 사용할 수 있습니다:

```js
SELECT title, ytd_sales, DENSE_RANK() OVER(ORDER BY ytd_sales DESC) as 'rank'
FROM titles;
```

![image](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_6.png)


<div class="content-ad"></div>

‘type’ 열을 기반으로 결과 집합을 파티션으로 나눠 봅시다.

```js
SELECT title, ytd_sales, type, DENSE_RANK() OVER(PARTITION BY type ORDER BY ytd_sales DESC) as 'rank'
FROM titles;
```

![참고 이미지](/assets/img/2024-06-22-ExploringSQLWindowFunctionsROW_NUMBERRANKandDENSE_RANK_7.png)

# 세 가지 함수를 모두 결합하기

<div class="content-ad"></div>

직원의 급여와 함께 직원 목록이 있는 시나리오를 고려해보세요. 각 직원에 고유한 직원 ID를 할당하고, 급여순으로 순위를 매기고, 촘촘한 순위를 부여하려고 합니다.

```js
SELECT 
    first_name, last_name, position, salary,
    ROW_NUMBER() OVER (ORDER BY salary) AS employee_id,
    RANK() OVER (ORDER BY salary) AS salary_rank,
    DENSE_RANK() OVER (ORDER BY salary) AS dense_salary_rank
FROM employees;
```

이 예제에서는 세 윈도우 함수를 한 쿼리에서 모두 사용합니다:

- ROW_NUMBER()는 각 직원에게 고유한 employee_id를 할당합니다.
- RANK()는 직원들을 급여에 따라 순위를 매기되, 동일한 급여의 경우 갭을 둡니다.
- DENSE_RANK()는 직원들을 급여에 따라 순위를 매기되, 동일한 급여의 경우 갭을 두지 않습니다.

<div class="content-ad"></div>

이 쿼리는 직원 데이터의 종합적인 정보를 제공합니다. 고유 식별자와 두 가지 유형의 급여 순위가 포함되어 있습니다.

## 결론

ROW_NUMBER, RANK, DENSE_RANK와 같은 SQL 윈도우 함수는 데이터 분석 및 보고에 불가결한 도구입니다. 이들은 결과 집합 내에서 행에 고유한 번호나 순위를 할당하여 데이터에서 통찰을 도출하는 작업을 더 쉽게 만들어 줍니다.

# SQL 기초 개념

<div class="content-ad"></div>

감사합니다! 더 많은 콘텐츠는 SQL Fundamentals에서도 찾아볼 수 있어요! 🚀💫