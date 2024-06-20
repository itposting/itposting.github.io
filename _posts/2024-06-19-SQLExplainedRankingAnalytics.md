---
title: "SQL에 대한 설명 랭킹 분석"
description: ""
coverImage: "/assets/img/2024-06-19-SQLExplainedRankingAnalytics_0.png"
date: 2024-06-19 09:54
ogImage: 
  url: /assets/img/2024-06-19-SQLExplainedRankingAnalytics_0.png
tag: Tech
originalTitle: "SQL Explained: Ranking Analytics"
link: "https://medium.com/towards-data-science/sql-explained-ranking-analytics-d545fc4c4a5c"
---


인기 있는 RDBMS 관리 시스템 중 하나인 Oracle, SQL Server, Postgres 등에 경험이 있다면, 분석 또는 윈도잉 함수로 불리는 함수를 어느 정도 접해봤을 것입니다.

분석 함수를 사용하면 데이터 집합 내의 행 그룹에 대한 집계 및 순위 시퀀스를 계산할 수 있습니다. 분석 함수에 대해 알아보고 사용해볼 가치가 있는지 궁금해 한다면, 확실한 "예"라고 말씀드릴 수 있어요. 그들은 굉장히 유용하며, 그들 없이는 어려운 것이 아니면 불가능한 일들을 SQL로 처리할 수 있게 해 줍니다.

이 글에서는 SQL의 가장 일반적인 랭킹 기술 중 네 가지를 살펴보며, 랭킹 함수라고 하는 특정 분석 카테고리에 집중하겠습니다. 어떤 역할을 하는지 설명하고 사용 예시를 제공할 거에요.

## 랭킹 분석 구문

<div class="content-ad"></div>

대부분의 최신 SQL 방언에서 랭킹 분석 함수의 일반적인 형식은 다음과 같습니다.

위 문장의 각 부분을 각각 간략히 살펴봅시다.

## RANK | DENSE_RANK | ROW_NUMBER() | NTILE

이들은 랭킹 함수의 이름들이며 대부분의 SQL에서 표시된 네 가지 함수를 지원합니다. 곧 각 개별 랭킹 함수에 대해 더 자세히 이야기해 보겠습니다.

<div class="content-ad"></div>

## OVER(…)

over 키워드는 그룹화 정의를 나타내며 데이터 테이블에서 어떤 행을 등수 매기는지를 나타냅니다.

PARTITION_BY_CLAUSE

partition_by_clause는 선택 사항이며 데이터 세트에서 그룹화하려는 열(하나 이상)의 이름을 포함합니다. 생략하면 SQL이 등수 함수를 실행할 때 테이블의 모든 레코드를 고려합니다.

<div class="content-ad"></div>

**ORDER_BY_CLAUSE**

이 order_by_clause는 그룹을 구성하는 열이 순위를 매기기 전에 어떻게 정렬되는지를 지정합니다.

**WINDOWING_CLAUSE**

특정 그룹 내에서 windowing_clause는 현재 행에 대해 순위 함수가 작동해야 하는 레코드 범위를 정의합니다.

<div class="content-ad"></div>

두 가지 유형의 윈도잉이 있습니다.

- 로우 윈도우, 즉 현재 레코드로부터 봐야 할 한 개 이상의 물리적 행을 지정하는 윈도우
- 레인지 윈도우로 현재 행의 값에서 빼거나 더하여 행의 범위를 정의하는 윈도우가 있습니다.

일반적인 윈도우 프레임은 다음과 같습니다:

- UNBOUNDED PRECEDING과 CURRENT ROW 사이의 행
- X PRECEDING과 CURRENT ROW 사이의 행
- CURRENT ROW과 X FOLLOWING 사이의 행
- UNBOUNDED PRECEDING과 UNBOUNDED FOLLOWING 사이의 범위

<div class="content-ad"></div>

완전성을 위해 WINDOWING_CLAUSE에 대한 설명을 추가했지만 솔직히 말해서, 일상 업무에서는 거의 사용할 일이 없을 것입니다. 99%의 경우, 기본값만으로 충분합니다. 사실, 일반적으로 랭킹 분석 함수에서는 windowing_clause를 전혀 사용하지 않습니다.

랭킹 분석은 말로만 설명하기 어려운데, 그 사용 예를 몇 가지 보여드리는 게 가장 좋은 방법입니다.

## 테스트 환경 설정

저는 Oracle의 live SQL 웹사이트를 사용하여 테스트를 실행합니다. 이 서비스에 액세스하고 사용하는 방법에 대해 이전에 SQL에서 Grouping Sets, Rollup 및 Cube를 사용하는 데 관한 기사에서 설명했습니다. 완전히 무료로 설정하고 사용할 수 있습니다. 해당 기사의 링크는 아래에 있습니다.

<div class="content-ad"></div>

## 샘플 테이블 생성 및 데이터 입력

저희 예제에는 하나의 테이블만 필요하며 학생들과 공부하고 있는 과목의 시험 점수에 관한 데이터 세트가 포함되어 있습니다. 테이블은 student_id, student_name, subject, score로 구성되어 있습니다.

```js
CREATE TABLE student_scores (
    student_id INT,
    student_name VARCHAR(50),
    subject VARCHAR(50),
    score INT
);

INSERT INTO student_scores VALUES (1, 'Alice', 'Math', 95);
INSERT INTO student_scores VALUES (2, 'Bob', 'Math', 85);
INSERT INTO student_scores VALUES (3, 'Charlie', 'Math', 90);
INSERT INTO student_scores VALUES (4, 'David', 'Math', 80);
INSERT INTO student_scores VALUES (5, 'Eva', 'Math', 70);
INSERT INTO student_scores VALUES (6, 'Frank', 'Science', 88);
INSERT INTO student_scores VALUES (7, 'Grace', 'Science', 92);
INSERT INTO student_scores VALUES (8, 'Hannah', 'Science', 85);
INSERT INTO student_scores VALUES (9, 'Ivy', 'Science', 90);
INSERT INTO student_scores VALUES (10, 'Jack', 'Science', 82);
INSERT INTO student_scores VALUES (11, 'Kate', 'History', 78);
INSERT INTO student_scores VALUES (12, 'Leo', 'History', 88);
INSERT INTO student_scores VALUES (13, 'Mia', 'History', 84);
INSERT INTO student_scores VALUES (14, 'Nina', 'History', 90);
INSERT INTO student_scores VALUES (15, 'Oscar', 'History', 92);
```

```js
select * from student_scores;


+------------+--------------+---------+-------+
| student_id | student_name | subject | score |
+------------+--------------+---------+-------+
|          1 | Alice        | Math    |    95 |
|          2 | Bob          | Math    |    85 |
|          3 | Charlie      | Math    |    90 |
|          4 | David        | Math    |    80 |
|          5 | Eva          | Math    |    70 |
|          6 | Frank        | Science |    88 |
|          7 | Grace        | Science |    92 |
|          8 | Hannah       | Science |    85 |
|          9 | Ivy          | Science |    90 |
|         10 | Jack         | Science |    82 |
|         11 | Kate         | History |    78 |
|         12 | Leo          | History |    88 |
|         13 | Mia          | History |    84 |
|         14 | Nina         | History |    90 |
|         15 | Oscar        | History |    92 |
+------------+--------------+---------+-------+

15 rows selected.
```

<div class="content-ad"></div>

이제 데이터가 준비되었으니 순위 함수를 소개할 수 있어요.

RANK

랭크 함수를 사용하면 테이블의 행에 연속적인 정수 번호를 할당할 수 있지만, 랭크를 사용하면 순서 번호가 꼭 연속적이지 않을 수 있다는 점을 알아두어야 해요.

가장 좋은 방법은 올림픽 스프린트 경기의 선수들을 상상하는 것이에요. 만약 두 선수가 1위에서 동시에 와 발생한다면 그들은 둘 다 1위를 할당받아 금메달을 딴다고 생각하시면 돼요. 그 다음으로 먼저 도착한 선수는 두 번째 위치가 아닌 세 번째 위치 (즉, 동메달)를 받게 될 거예요.

<div class="content-ad"></div>

이것이 순위가 번호를 할당하는 방법이며, 아래 예시에서 명확히 볼 수 있습니다.

```js
select subject, student_name, rank() over(order by subject) rnk  
from student_scores;

+---------+--------------+-----+
| subject | student_name | rnk |
+---------+--------------+-----+
| History | Kate         |   1 |
| History | Leo          |   1 |
| History | Mia          |   1 |
| History | Nina         |   1 |
| History | Oscar        |   1 |
| Math    | Alice        |   6 |
| Math    | Bob          |   6 |
| Math    | Charlie      |   6 |
| Math    | David        |   6 |
| Math    | Eva          |   6 |
| Science | Frank        |  11 |
| Science | Grace        |  11 |
| Science | Hannah       |  11 |
| Science | Ivy          |  11 |
| Science | Jack         |  11 |
+---------+--------------+-----+

15 rows selected.
```

더 현실적인 사용 사례로, 각 과목의 점수를 해당 과목에서 가장 높은 점수순으로 나열할 수 있습니다.

```js
SELECT student_name, subject, score,
       RANK() OVER (PARTITION BY subject ORDER BY score DESC) AS rank
FROM student_scores;

+--------------+---------+-------+------+
| student_name | subject | score | rank |
+--------------+---------+-------+------+
| Alice        | Math    |    95 |    1 |
| Charlie      | Math    |    90 |    2 |
| Bob          | Math    |    85 |    3 |
| David        | Math    |    80 |    4 |
| Eva          | Math    |    70 |    5 |
| Oscar        | History |    92 |    1 |
| Nina         | History |    90 |    2 |
| Leo          | History |    88 |    3 |
| Mia          | History |    84 |    4 |
| Kate         | History |    78 |    5 |
| Grace        | Science |    92 |    1 |
| Ivy          | Science |    90 |    2 |
| Frank        | Science |    88 |    3 |
| Hannah       | Science |    85 |    4 |
| Jack         | Science |    82 |    5 |
+--------------+---------+-------+------+

15 rows selected.
```

<div class="content-ad"></div>

각 과목 그룹의 시작마다 랭크가 초기화된다는 것을 주목해주세요. 위의 데이터 세트를 입력으로 사용하여 각 과목 내에서 개별 최고 점수를 강조하는 것은 매우 쉽습니다.

```js
select * from
    (
    SELECT student_name, subject, score,
           RANK() OVER (PARTITION BY subject ORDER BY score DESC) AS rank
    FROM student_scores
    )
where rank = 1



| student_name | subject | score | rank |
|--------------|---------|-------|------|
| Alice        | Math    |    95 |    1 |
| Oscar        | History |    92 |    1 |
| Grace        | Science |    92 |    1 |
```

## DENSE_RANK

DENSE_RANK 함수는 행에 순차적인 번호를 할당하는 데 rank 함수와 유사합니다. 차이점은 dense_rank가 간격이 없는 번호 시퀀스를 보장한다는 것입니다.

<div class="content-ad"></div>

올림픽 경주 비유를 이어가면, dense_rank 조건에서는 동일한 순위에 올라간 두 명이 여전히 금메달을 획득하지만, 그 다음 순위에 온 사람이 두 번째로 인정되어 은메달을 받게 됩니다.

우리의 첫 번째 순위 SQL에서 rank를 dense_rank로 대체하면 내용을 명확히 이해할 수 있습니다. 다음 출력이 나옵니다.

```js
select subject, student_name,dense_rank() over(order by subject) rnk  
from student_scores;


| subject | student_name | rnk |
|---------|--------------|-----|
| History | Kate         |   1 |
| History | Leo          |   1 |
| History | Mia          |   1 |
| History | Nina         |   1 |
| History | Oscar        |   1 |
| Math    | Alice        |   2 |
| Math    | Bob          |   2 |
| Math    | Charlie      |   2 |
| Math    | David        |   2 |
| Math    | Eva          |   2 |
| Science | Frank        |   3 |
| Science | Grace        |   3 |
| Science | Hannah       |   3 |
| Science | Ivy          |   3 |
| Science | Jack         |   3 |
15 rows selected.
```

dense_rank에 대해 말할 것이 더는 없습니다. 간격 없는 순위 시퀀스가 반드시 필요하다면 순위 분석 대신 사용하면 됩니다.

<div class="content-ad"></div>

## ROW_NUMBER

로우 넘버 분석은 각 파티션 내의 각 행에 고유한 정수 값을 할당합니다. 처음 들었을 때는 다른 두 등수 함수처럼 들릴 수 있지만, 중요한 차이점은 파티션 내에서 "동점"이 될 수 있는 레코드들이 다른 랭크가 부여되며, 각 파티션 내의 각 랭크는 그 파티션에 유니크하며 갭이 없다는 것입니다.

다시 말해, 우리의 올림픽 경주 비유를 사용하면, 동시에 선을 획득한 선수 중 하나만 금메달을 획득하게 되고, 나머지는 은메달을 획득하며, 그 다음 순으로 들어온 사람은 동메달을 획득하게 됩니다. 이것은 예시입니다.

```js
SELECT student_name, subject, score,
       ROW_NUMBER() OVER (ORDER BY score DESC) AS rn
FROM student_scores;

+--------------+---------+-------+----+
| student_name | subject | score | rn |
+--------------+---------+-------+----+
| Alice        | Math    |    95 |  1 |
| Grace        | Science |    92 |  2 |
| Oscar        | History |    92 |  3 |
| Ivy          | Science |    90 |  4 |
| Nina         | History |    90 |  5 |
| Charlie      | Math    |    90 |  6 |
| Frank        | Science |    88 |  7 |
| Leo          | History |    88 |  8 |
| Bob          | Math    |    85 |  9 |
| Hannah       | Science |    85 | 10 |
| Mia          | History |    84 | 11 |
| Jack         | Science |    82 | 12 |
| David        | Math    |    80 | 13 |
| Kate         | History |    78 | 14 |
| Eva          | Math    |    70 | 15 |
+--------------+---------+-------+----+

15개 행이 선택되었습니다.
```

<div class="content-ad"></div>

그레이스가 영 매칭 점수를 받은 것과 마찬가지로 오스카도 점수가 같은데 그것보다 상위에 랭크되어 있는 것을 보실 수 있습니다. 점수별 정렬 순서가 결정되지 않았기 때문에 그들의 랭킹 역시 결정적이지 않다는 것을 의미합니다. 위와 같은 쿼리를 다시 실행하면 그들의 순서, 즉 순위 값이 반전될 수도 있습니다.

참고로, over() 절 내부에서 파티션을 지정하지 않았기 때문에 랭킹은 전체 데이터 세트에 적용되어 레코드 번호가 1에서 시작하여 모든 레코드가 처리될 때까지 1씩 증가합니다.

마지막 예제인 row_number() 함수로, 파티션 절을 함께 사용하는 방법은 테이블 데이터의 중복을 제거해야 할 때 매우 유용하다는 것을 보여드리겠습니다. 먼저 좀 더 많은 데이터를 생성하기 위해 약간의 중복된 행을 세 명의 학생, 케이트, 앨리스, 오스카에 대해 삽입할 것입니다.

```js
insert into student_scores select * from student_scores
where student_name in ('Alice','Kate','Oscar');


select * 
from student_scores;
+------------+--------------+---------+-------+
| student_id | student_name | subject | score |
+------------+--------------+---------+-------+
|          1 | Alice        | Math    |    95 |
|          1 | Alice        | Math    |    95 |
|          2 | Bob          | Math    |    85 |
|          3 | Charlie      | Math    |    90 |
|          4 | David        | Math    |    80 |
|          5 | Eva          | Math    |    70 |
|          6 | Frank        | Science |    88 |
|          7 | Grace        | Science |    92 |
|          8 | Hannah       | Science |    85 |
|          9 | Ivy          | Science |    90 |
|         10 | Jack         | Science |    82 |
|         11 | Kate         | History |    78 |
|         11 | Kate         | History |    78 |
|         12 | Leo          | History |    88 |
|         13 | Mia          | History |    84 |
|         14 | Nina         | History |    90 |
|         15 | Oscar        | History |    92 |
|         15 | Oscar        | History |    92 |
+------------+--------------+---------+-------+

18 rows selected.
```

<div class="content-ad"></div>

이제 학생 이름을 기준으로 순위를 매기는 row_number()를 사용하여 순위가 `1인 데이터를 선택함으로써 데이터 테이블에서 중복 레코드를 효과적으로 식별할 수 있습니다. 다음은 이 작업을 수행하는 SQL입니다.

```js
WITH RankedScores AS (
    SELECT student_id, student_name, subject, score,
           ROW_NUMBER() OVER (PARTITION BY student_id, 
           student_name, subject, score ORDER BY student_id) AS rn
    FROM student_scores
)
SELECT student_id, student_name, subject, score
FROM RankedScores
WHERE rn > 1;


- 학생_id | 학생_이름 | 과목 | 점수
-|------------|--------------|---------|-------|
|          1 | Alice        | Math    |    95 |
|         11 | Kate         | History |    78 |
|         15 | Oscar        | History |    92 |

3개의 행이 선택됨.
```

이 식별된 레코드를 사용하여 테이블에서 중복을 제거할 수 있습니다. 다음은 이러한 레코드를 사용하여 테이블을 원래 데이터 세트로 복원하는 인플레이스 삭제를 수행하는 예시입니다.

```js
DELETE FROM student_scores
WHERE rowid IN (
    SELECT rid
    FROM (
        SELECT rowid AS rid,
               ROW_NUMBER() OVER (PARTITION BY student_id, 
               student_name, subject, score ORDER BY student_id) AS rn
        FROM student_scores
    )
    WHERE rn > 1
);

3개의 행이 삭제됨.


SELECT * FROM student_scores;

- 학생_id | 학생_이름 | 과목 | 점수
-|------------|--------------|---------|-------|
|          1 | Alice        | Math    |    95 |
|          2 | Bob          | Math    |    85 |
|          3 | Charlie      | Math    |    90 |
|          4 | David        | Math    |    80 |
|          5 | Eva          | Math    |    70 |
|          6 | Frank        | Science |    88 |
|          7 | Grace        | Science |    92 |
|          8 | Hannah       | Science |    85 |
|          9 | Ivy          | Science |    90 |
|         10 | Jack         | Science |    82 |
|         11 | Kate         | History |    78 |
|         12 | Leo          | History |    88 |
|         13 | Mia          | History |    84 |
|         14 | Nina         | History |    90 |
|         15 | Oscar        | History |    92 |

15개의 행이 선택됨.
```

<div class="content-ad"></div>

## NTILE

NTILE 함수를 사용하면 데이터 세트를 대략적으로 동일한 크기의 레코드 그룹으로 나눌 수 있습니다. 이러한 그룹을 "타일"이라고 하며, 동일한 타일 내의 모든 항목에는 동일한 순위가 할당됩니다.

아래 예시에서는 학생들의 성적을 기반으로 테이블을 4개의 그룹으로 세분화하려고 합니다. 다시 말해, 각 그룹(또는 타일)은 실제 데이터 세트의 범위 내에서 대략적으로 유사한 점수를 가져야 합니다.

각 그룹 내의 레코드 수는 미리 알 수 없습니다. 요청한 타일 수가 출력에 표시되지만, 두 개의 그룹에는 3개의 레코드가 있고 다른 두 그룹에는 각각 4개와 5개의 레코드가 포함되어 있습니다. SQL이 보장할 수 있는 것은 가능한 경우 요청한 타일 수를 반환한다는 것뿐입니다.

<div class="content-ad"></div>

```js
SELECT 
    student_name,
    subject,
    score,
    NTILE(4) OVER (ORDER BY score) AS tile_rank
FROM 
    student_scores;


| student_name | subject | score | tile_rank  |
|--------------|---------|-------|------------|
| Eva          | Math    |    70 |          1 |
| Kate         | History |    78 |          1 |
| David        | Math    |    80 |          1 |
| Jack         | Science |    82 |          2 |
| Mia          | History |    84 |          2 |
| Bob          | Math    |    85 |          2 |
| Hannah       | Science |    85 |          2 |
| Frank        | Science |    88 |          3 |
| Leo          | History |    88 |          3 |
| Ivy          | Science |    90 |          3 |
| Nina         | History |    90 |          3 |
| Charlie      | Math    |    90 |          3 |
| Grace        | Science |    92 |          4 |
| Oscar        | History |    92 |          4 |
| Alice        | Math    |    95 |          4 |

 15 rows selected
```

- NTILE(4)는 행을 4개의 타일 또는 그룹으로 나누고자 함을 나타냅니다.
- OVER (ORDER BY score) 파티션 절을 지정하지 않았기 때문에 SQL은 데이터세트를 위해 테이블의 모든 레코드를 고려하고 이 레코드들을 점수 열을 기준으로 순서대로 정렬한 후 그것들을 네 개의 타일로 분할하도록 지시합니다.

## 요약

마무리로, 현대 SQL 시스템에서 가장 흔한 4가지 SQL 랭킹 함수를 강조하고 그 사용 예시를 보여드렸습니다. 이 함수들은 모두 상대적인 순서에 따라 레코드에 랭킹 값을 할당하며, RANK, DENSE_RANK 및 ROW_NUMBER는 동점 처리를 다루고 순번을 지정하는 방식이 다르게 제공합니다. 한편, NTILE은 데이터에 대한 통계 분석이나 세분화 분석을 수행해야 하는 경우에 유용합니다. 이러한 기능을 가능한 많이 사용하고 일상적으로 사용해 보시기를 권장합니다. 데이터 분석, 조작 및 보고를 위한 강력한 도구이기 때문입니다.

<div class="content-ad"></div>

이 컨텐츠가 마음에 드셨다면, 이 기사들도 흥미롭게 보실 것 같아요.