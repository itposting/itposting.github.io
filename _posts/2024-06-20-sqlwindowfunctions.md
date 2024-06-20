---
title: "SQL 윈도우 함수"
description: ""
coverImage: "/assets/img/2024-06-20-sqlwindowfunctions_0.png"
date: 2024-06-20 14:38
ogImage: 
  url: /assets/img/2024-06-20-sqlwindowfunctions_0.png
tag: Tech
originalTitle: "sql window functions ?"
link: "https://medium.com/@aspinfo/sql-window-functions-897eafdf3eff"
---



<img src="/assets/img/2024-06-20-sqlwindowfunctions_0.png" />

SQL 윈도우 함수는 현재 행과 관련된 일련의 테이블 행 전체에서 계산을 수행하는 강력한 도구입니다. 이러한 함수는 결과 집합을 단일 행으로 그룹화하지 않고, 순위, 러닝 합계, 이동 평균 등을 포함한 복잡한 쿼리를 실행하는 방법을 제공합니다. 여기에 일반적으로 사용되는 SQL 윈도우 함수 중 일부가 있습니다:

# 1. ROW_NUMBER()

결과 집합의 각 파티션 내에서 행에 고유한 연속 정수를 할당하며, 각 파티션의 첫 번째 행에 대해 1부터 시작합니다.


<div class="content-ad"></div>


```js
SELECT 
    column1,
    ROW_NUMBER() OVER (PARTITION BY column2 ORDER BY column3) AS row_num
FROM 
    table_name;
```

# 2. RANK()

Assigns a rank to each row within a partition of a result set. The rank of a row is one plus the number of ranks that come before it. Ties receive the same rank, and the next rank(s) are skipped.

```js
SELECT 
    column1,
    RANK() OVER (PARTITION BY column2 ORDER BY column3) AS rank
FROM 
    table_name;
``` 


<div class="content-ad"></div>

# 3. DENSE_RANK()

RANK()과 유사하지만 랭킹 시퀀스에 갭이 없습니다. 동점인 경우 동일한 순위를 받고, 다음 순위는 1씩 증가합니다.

```js
SELECT 
    column1,
    DENSE_RANK() OVER (PARTITION BY column2 ORDER BY column3) AS dense_rank
FROM 
    table_name;
```

# 4. NTILE(n)

<div class="content-ad"></div>

결과 집합을 대략적으로 n개의 동일한 부분으로 나누고 각 행에 1부터 n까지 버킷 번호를 할당합니다.

```js
SELECT 
    column1,
    NTILE(4) OVER (ORDER BY column2) AS quartile
FROM 
    table_name;
```

**5. LAG()**

결과 집합 내 현재 행 이전에 있는 주어진 물리적 오프셋의 행에 액세스할 수 있습니다.

<div class="content-ad"></div>

```sql
SELECT 
    column1,
    LAG(column2, 1) OVER (ORDER BY column3) AS prev_value
FROM 
    table_name;
```

## 6. LEAD()

현재 행 다음에 나오는 주어진 물리적 오프셋 위치의 행에 대한 액세스를 제공합니다.

```sql
SELECT 
    column1,
    LEAD(column2, 1) OVER (ORDER BY column3) AS next_value
FROM 
    table_name;
```

<div class="content-ad"></div>

# 7. FIRST_VALUE()

주어진 값들의 정렬된 세트에서 첫 번째 값을 반환합니다.

```js
SELECT 
    column1,
    FIRST_VALUE(column2) OVER (PARTITION BY column3 ORDER BY column4) AS first_val
FROM 
    table_name;
```

# 8. LAST_VALUE()

<div class="content-ad"></div>

주어진 값들의 정렬된 세트에서 마지막 값을 반환합니다.

```js
SELECT 
    column1,
    LAST_VALUE(column2) OVER (PARTITION BY column3 ORDER BY column4 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_val
FROM 
    table_name;
```

## 9. SUM()

지정된 윈도우 프레임에서 값들의 합을 계산합니다.

<div class="content-ad"></div>

```js
SELECT 
    column1,
    SUM(column2) OVER (PARTITION BY column3 ORDER BY column4) AS running_total
FROM 
    table_name;
```

# 10. AVG()

Calculates the average of values in a specified window frame.

```js
SELECT 
    column1,
    AVG(column2) OVER (PARTITION BY column3 ORDER BY column4) AS running_avg
FROM 
    table_name;
```

<div class="content-ad"></div>

# 11. MIN() 및 MAX()

지정된 창 프레임 내에서 최소값 및 최대값을 반환합니다.

```js
SELECT 
    column1,
    MIN(column2) OVER (PARTITION BY column3 ORDER BY column4) AS min_val,
    MAX(column2) OVER (PARTITION BY column3 ORDER BY column4) AS max_val
FROM 
    table_name;
```

# 창 명세화

<div class="content-ad"></div>

OVER 절은 세 부분으로 구성될 수 있습니다:

- PARTITION BY: 윈도우 함수가 적용되는 파티션으로 결과 세트를 분할합니다.
- ORDER BY: 각 파티션 내 행의 논리적 순서를 정의합니다.
- Window Frame: 함수가 적용되는 파티션의 하위 집합을 지정합니다 (예: 1 PRECEDING부터 현재 행까지의 ROWS).

완전한 윈도우 명세를 사용한 예시:

```js
SELECT 
    column1,
    SUM(column2) OVER (PARTITION BY column3 ORDER BY column4 ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS running_total
FROM 
    table_name;
```

<div class="content-ad"></div>

이러한 함수들을 사용하면 복잡한 계산을 처리하는 더 효율적이고 가독성이 좋은 방법을 제공하여 SQL 내에서 고급 데이터 분석을 수행할 수 있습니다.