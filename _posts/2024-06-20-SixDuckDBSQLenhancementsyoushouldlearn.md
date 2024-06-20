---
title: "여러분이 배워야 할 6가지 DuckDB SQL 향상 기능"
description: ""
coverImage: "/assets/img/2024-06-20-SixDuckDBSQLenhancementsyoushouldlearn_0.png"
date: 2024-06-20 15:45
ogImage: 
  url: /assets/img/2024-06-20-SixDuckDBSQLenhancementsyoushouldlearn_0.png
tag: Tech
originalTitle: "Six DuckDB SQL enhancements you should learn."
link: "https://medium.com/gitconnected/six-duckdb-sql-enhancements-you-should-learn-6a229b3c2d3e"
---



![Image](/assets/img/2024-06-20-SixDuckDBSQLenhancementsyoushouldlearn_0.png)

DuckDB의 SQL은 원래 PostgreSQL을 기반으로 하였으며, 이는 모방하기에 좋은 SQL 버전입니다. 그러나 시간이 흐름에 따라 DuckDB는 SQL 제공에 몇 가지 유용한 추가 기능을 도입하여 여러분의 삶을 조금 더 쉽게 만들었습니다. 다른 보다 인기 있는 RDBMS들이 언젠가는 이러한 유용한 SQL 확장을 본뜬다면 전혀 놀라지 않을 것입니다.

DuckDB에 대해 들어보지 못한 분들을 위해, 이는 C++로 작성된 인메모리 데이터베이스로서 분석용 SQL 워크로드를 위해 설계되었습니다. 또한 Polars와 같은 성능으로 빠르며 경쟁력이 있습니다.

아래 링크를 통해 DuckDB의 기능에 대해 깊이 있는 탐구를 해보세요.


<div class="content-ad"></div>

알겠어요. 이 기사에 나온 유용한 SQL 명령어 몇 가지를 살펴봐요.

## 1. 정규 표현식을 사용한 동적 열 선택

정규 표현식을 사용한 동적 열 선택을 통해 쿼리할 때 테이블에 포함된 정확한 열 이름을 사용할 필요가 없어져요. 이는 쿼리에서 유용한 단축키로 이어질 수 있어요.

대신, COLUMNS() 키워드를 사용하고 해당 키워드와 적합한 와일드카드를 함께 사용하여 열 이름에 와일드카드 표현식을 넣을 수 있어요. DuckDB는 COLUMNS() 표현식 내에서 와일드카드와 일치하는 열에 대한 데이터만 검색해 줄 거예요.

<div class="content-ad"></div>

아래와 같이 테이블이 있다고 가정해 봅시다.

```js
db.sql("CREATE TABLE departments (department varchar, exmployee_count INT, average_salary INT, max_salary INT, min_salary INT)")

db.sql("INSERT INTO departments VALUES ('영업', 300, 25000, 40000, 19000), ('인사', 50, 22000, 50000, 18500)");

db.sql("SELECT * FROM departments")
```

위와 같이, 예를 들어 부서와 최저/최고 급여만 가져오고 싶다면 다음과 같이 사용할 수 있습니다.

```js
# average_salary와 employee_count 열을 제외
db.sql("SELECT department, COLUMNS('m.*salary') FROM departments")
```

<div class="content-ad"></div>

WHERE 절에서 COLUMNS 식을 사용하여 DuckDB는 와일드카드에서 나온 각 식 사이에 암시적 AND를 넣을 것입니다. 예를 들어,

```js
db.sql("SELECT department, COLUMNS('m.*salary') FROM departments \
       WHERE COLUMNS('m.*salary') >= 19000")

# 위 WHERE 절은 다음과 동일합니다.
# WHERE max_salary >= 19000 AND min_salary >= 19000
#

| department | max_salary | min_salary |
|  varchar   |   int32    |   int32    |
|------------|------------|------------|
| Sales      |      40000 |      19000 |

```

컬럼에 계산을 적용할 때도 이 구문을 사용할 수 있습니다. 부서 데이터 세트를 사용하면서, 컬럼에 대한 몇 가지 집계를 수행하려면 다음과 같이 할 수 있습니다.

```js
db.sql("SELECT MAX(COLUMNS('m.*salary')) FROM departments")

| max(departments.max_salary) | max(departments.min_salary) |
|            int32             |            int32            |
|----------------------------- |-----------------------------|
|             50000            |             19000          |
```

<div class="content-ad"></div>

## 2. 피벗/언피벗

관계형 데이터베이스 시스템에서 가장 어려운 작업 중 하나인 데이터 집합을 피벗하고 언피벗하는 기능을 활용하면 데이터 분석이 훨씬 쉬워질 수 있어요.

먼저 테스트 테이블 데이터를 설정해봅시다.

```js
import duckdb as db

db.sql("CREATE TABLE purchases (productID int, year INT, sales INT)")

db.sql("INSERT INTO purchases VALUES (12345, 2019, 15000), (12345,2020, 19500), (12345, 2021, 22000), (987654, 2019, 510), (987654,2020, 1900), (987654, 2021, 2100)")

db.sql("SELECT * FROM purchases")
```


| productID | year  | sales |
|-----------|-------|-------|
|     12345 |  2019 | 15000 |
|     12345 |  2020 | 19500 |
|     12345 |  2021 | 22000 |
|    987654 |  2019 |   510 |
|    987654 |  2020 |  1900 |
|    987654 |  2021 |  2100 |


<div class="content-ad"></div>

요청하신 데이터가 아래와 같이 보이도록 하겠습니다.

```js
┌───────────┬────────┬────────┬────────┐
│ productID │  2019  │  2020  │  2021  │
│   int32   │ int128 │ int128 │ int128 │
├───────────┼────────┼────────┼────────┤
│     12345 │  15000 │  19500 │  22000 │
│    987654 │    510 │   1900 │   2100 │
└───────────┴────────┴────────┴────────┘
```

이를 위해 PIVOT를 사용할 수 있습니다.

```js
import duckdb as db


db.sql("create table pivoted_purchases as PIVOT purchases ON year USING SUM(sales)  GROUP BY productID")
db.sql("SELECT * FROM pivoted_purchases")

# PIVOT에 기반한 테이블을 생성하고 싶지 않을 경우 
# 단순히 값을 표시하고 싶으면 이렇게도 할 수 있습니다
# db.sql("PIVOT purchases ON year USING SUM(sales)  GROUP BY productID")

┌───────────┬────────┬────────┬────────┐
│ productID │  2019  │  2020  │  2021  │
│   int32   │ int128 │ int128 │ int128 │
├───────────┼────────┼────────┼────────┤
│     12345 │  15000 │  19500 │  22000 │
│    987654 │    510 │   1900 │   2100 │
└───────────┴────────┴────────┴────────┘
```

<div class="content-ad"></div>

PIVOT 명령어에서 수행한 SUM(salary) 집계는 숫자 데이터를 전혀 변경하지 않았기 때문에 이 프로세스를 UNPIVOT 및 이미 이야기한 COLUMNS 기능을 사용하여 반대로도 수행할 수 있습니다.

```js
db.sql("UNPIVOT pivoted_purchases ON COLUMNS(* EXCLUDE productID) INTO NAME year VALUE sales")

| productID |  year   | sales  |
|   int32   | varchar | int128 |
|-----------|---------|--------|
|    12345  |  2019   | 15000  |
|    12345  |  2020   | 19500  |
|    12345  |  2021   | 22000  |
|   987654  |  2019   |  510   |
|   987654  |  2020   |  1900  |
|   987654  |  2021   |  2100  |
```

## 3. Union 데이터 유형

이제 서로 다른 데이터 유형을 유니언할 수 있습니다. 네, 들으신 대로, 제 SQL 고통 중 하나가 사라졌습니다.

<div class="content-ad"></div>

```js
db.sql("SELECT '나는 문자열입니다' as col1 union select 100 union select 42.0")



┌───────────────┐
│     col1      │
│    varchar    │
├───────────────┤
│ 나는 문자열입니다 │
│ 42.0          │
│ 100           │
└───────────────┘
```

DuckDB는 서로 다른 데이터 유형을 가져오는 모든 유형을 지원하는 "가장 낮은 공통 분모"로 강제로 변환합니다. 여기서 FLOAT 및 INT 열 값은 VARCHAR로 강제 변환됩니다.

## 4. 재사용 가능한 열 별칭

전통적인 SQL에서는 select 문 내에서 점진적으로 계산된 표현식을 처리할 때 일반적으로 각 열에 대해 전체 표현식을 복제하거나 각 계산 단계를 공통 테이블 표현식(CTE)으로 캡슐화해야 합니다. 그러나 재사용 가능한 열 별칭을 사용하면 이제 열 별칭을 동일한 select 문 전체에서 사용할 수 있으며, where 및 order by 절에서도 사용할 수 있어 프로세스를 간소화하고 중복을 줄일 수 있습니다. 예를 들어,

<div class="content-ad"></div>

```js
db.sql("SELECT 'The quick brown fox jumped over the lazy dog' AS my_text,\
substring(my_text, 17,3) AS my_text_substr,\
length(my_text) AS my_text_len,\
my_text_len * my_text_len AS my_text_calc")

## 5. 리스트 내포

이 기능은 파이썬 스타일의 리스트 내포를 모델로 하며, 리스트 내 요소들에 대한 표현식을 계산하는 데 사용할 수 있습니다. 예를 들어, 다음과 같이 숫자 목록이 있는 경우:

[1,2,3,4,5,6,7,8,9]
```

<div class="content-ad"></div>

파이썬에서는 우리가 원한다면, 위의 리스트의 각 숫자를 제곱하여 두 번째 리스트를 출력하고 싶다면 다음과 같이 진행될 것입니다.

```js
[x*x for x in [1,2,3,4,5,6,7,8,9]]


# 위의 파이썬 코드는 다음과 같은 출력을 생성합니다
#
# [1, 4, 9, 16, 25, 36, 49, 64, 81]
```

DuckDB SQL에서도 매우 유사한 작업을 수행할 수 있습니다.

```js
db.sql("SELECT [x*x for x in nums] as squares FROM (VALUES ([1,2,3,4,5,6,7,8,9])) t(nums)")



┌───────────────────────────────────┐
│              squares              │
│              int32[]              │
├───────────────────────────────────┤
│ [1, 4, 9, 16, 25, 36, 49, 64, 81] │
└───────────────────────────────────┘
```

<div class="content-ad"></div>

쿼리를 분석해보면 무엇을 하는 지 이해할 수 있습니다:

다음 (VALUES([1,2,3,4,5,6,7,8,9])) t(nums)

- 이 쿼리의 이 부분은 nums라는 단일 열을 갖는 임시 테이블 (또는 파생 테이블) t를 생성합니다.
- VALUES 절은 리터럴 값을 제공하는 데 사용됩니다. 여기서는 1부터 9까지의 정수로 이루어진 목록(또는 배열)입니다.
- t(nums)는 파생 테이블에 t라는 이름을 지어주고, 그 안의 배열을 포함하는 열을 nums로 명명한 부분입니다.

다음과 같이 MARKDOWN 형식의 테이블 태그를 변경해 보세요:

SELECT [x*x for x in nums] as squares

<div class="content-ad"></div>

- 이것은 계산이 발생하는 쿼리의 주요 부분입니다.
- 이 쿼리는 파이썬에서 일반적으로 볼 수 있는 작업인 리스트 내포 [x*x for x in nums]을 사용합니다. 이 문맥에서 nums 배열의 각 요소 x에 대해 x의 제곱을 계산합니다.
- 결과는 제곱된 값들의 배열입니다. 입력 배열에 대한 출력인 [1,2,3,4,5,6,7,8,9]는 [1,4,9,16,25,36,49,64,81]이 됩니다.
- squares로 이 계산된 배열을 별칭 지어주고 있습니다.

요약하자면, 이 쿼리는 1에서 9까지의 숫자 배열을 만든 다음, 각 숫자의 제곱을 계산하고 squares라는 배열로 결과를 반환합니다.

## 6. 함수 체이닝

DuckDB는 점 표기법(dot notation)을 사용하여 별도의 SQL 함수를 연결하는 것을 쉽게 만들어줍니다. 이렇게 하면 한 개의 SQL 문에서 함수 파이프라인을 구축할 수 있습니다.

<div class="content-ad"></div>

예를 들어, 많은 데이터베이스 시스템에서 INITCAP과 같은 이름의 SQL 함수가 있습니다. 이 함수는 텍스트 문자열의 모든 단어를 대문자로 만듭니다. 안타깝게도 DuckDB에는 이 기능이 내장되어 있지 않으므로, 우리는 함수 체이닝 (그리고 리스트 내포)을 사용하여 이를 흉내 내볼 수 있는지 살펴볼까요?

다음은 "the quick brown fox jumped over the lazy dog"이라는 문구에서 각 단어를 대문자로 바꾸고 싶을 때의 빠른 예제입니다.

```js
db.sql("SELECT ([upper(x[1])||x[2:] for x in \
('the quick brown fox jumped over the lazy dog')\
.string_split(' ')]).list_aggr('string_agg',' ') as final_str")


┌──────────────────────────────────────────────┐
│                  final_str                   │
│                   varchar                    │
├──────────────────────────────────────────────┤
│ The Quick Brown Fox Jumped Over The Lazy Dog │
└──────────────────────────────────────────────┘
```

string_split 함수는 문구를 구성하는 개별 단어로 나누어주며, Python 리스트와 유사한 단어 목록을 생성합니다.

<div class="content-ad"></div>

[the, quick, brown, fox, jumped, over, the, lazy, dog]

다음으로, 우리는 단어 목록 위에 리스트 컴프리헨션을 실행합니다. 목록의 각 단어마다 첫 글자를 대문자로 설정한 후 단어의 나머지 부분을 연결합니다. 이것이 표현식의 upper(x[1])||x[2:] 부분이 하는 일입니다.

이후에 우리의 중간 단어 목록은 다음과 같이 됩니다,

[The, Quick, Brown, Fox, Jumped, Over, The, Lazy, Dog]

<div class="content-ad"></div>

위 단어 목록에 대해 list_agg 함수를 실행합니다. 이 함수는 단어 목록을 다시 단어 문자열로 변환하고 각 단어를 공백 문자로 분리합니다.

Medium은 이 두 기사의 내용이 특히 흥미롭다고 생각합니다.