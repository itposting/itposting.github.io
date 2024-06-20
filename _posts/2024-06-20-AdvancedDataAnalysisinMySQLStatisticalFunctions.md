---
title: "MySQL에서의 고급 데이터 분석 통계 함수"
description: ""
coverImage: "/assets/img/2024-06-20-AdvancedDataAnalysisinMySQLStatisticalFunctions_0.png"
date: 2024-06-20 15:57
ogImage: 
  url: /assets/img/2024-06-20-AdvancedDataAnalysisinMySQLStatisticalFunctions_0.png
tag: Tech
originalTitle: "Advanced Data Analysis in MySQL: Statistical Functions"
link: "https://medium.com/learning-sql/advanced-data-analysis-in-mysql-statistical-functions-5958d2194fa2"
---



![Advanced Data Analysis in MySQL - Statistical Functions 0](/assets/img/2024-06-20-AdvancedDataAnalysisinMySQLStatisticalFunctions_0.png)

![Advanced Data Analysis in MySQL - Statistical Functions 1](/assets/img/2024-06-20-AdvancedDataAnalysisinMySQLStatisticalFunctions_1.png)

각 데이터 세트의 분석 중요한 부분은 통계 속성을 분석하는 것입니다. 특히 기계 학습에 사용하려면 데이터에 대한 적절한 통찰력을 갖고 사전 처리 및 특성 추출을 수행해야 합니다.

데이터베이스에 대규모 데이터 집합이 있는 경우 데이터베이스에서 이러한 분석을 직접 실행하는 것이 도움이 됩니다.


<div class="content-ad"></div>

그러나 일부 데이터베이스의 내장 통계 함수는 매우 포괄적이지 않을 수 있습니다. MySQL 데이터베이스도 그러한 경우 중 하나입니다.

본 기사에서는 MySQL 인스턴스에 더 고급 통계 함수를 가져오고 대규모 데이터를 분석하는 방법을 안내해 드리겠습니다.

# 준비 사항

통계와 SQL 쿼리 언어에 대한 기본적인 이해가 있다고 가정합니다.

<div class="content-ad"></div>

## MySQL 인스턴스 + 샘플 데이터 세트

또한 MySQL 데이터베이스의 실행 중인 인스턴스가 설치되어 특권 사용자가 있는 상태로, MySQL 웹 사이트에서 '표준' 직원 샘플 데이터베이스를 가져와 샘플 데이터 세트로 가져오셨다고 가정합니다.

그렇지 않은 경우, 먼저 다음 기사를 참고하시기 바랍니다: "MySQL에서 데이터 분석을 위한 첫 걸음: 기본 함수".

이 기사에서 작업할 기존 데이터베이스 스키마는 다음과 같아야 합니다:

<div class="content-ad"></div>


![Image](/assets/img/2024-06-20-AdvancedDataAnalysisinMySQLStatisticalFunctions_2.png)

The fields are mostly self-explanatory, but to be on the safe side, we list the descriptions of the non-obvious fields for the tables employees and salaries below:

- employees.emp_no: The primary key of the employees table.
- employees.hire_date: The hire date of the employee.
- salaries.emp_no: The foreign key to the employees table.
- salaries.salary: The salary paid in a given period.
- salaries.from_date: The date from which the salary was paid.
- salaries.to_date: The date by which the salary was paid.

## Install the statistics extension


<div class="content-ad"></div>

MySQL은 통계 함수가 제한적이기 때문에 고급 기능을 위한 '확장 프로그램'이 필요합니다. 이 기사에서는 다음과 같은 통계 함수를 사용합니다: Statistics for MySQL.

이 확장 프로그램에는 Gini 계수, 중앙값, Mersenne Twister 난수 생성기, Pearson 상관 계수, 행 번호 및 왜도 등 여러 통계 함수가 포함되어 있습니다.

Windows 사용자는 다음을 직접 다운로드하고(32비트 또는 64비트 맞춤 libsqlstat.dll을 MySQL 설치 디렉토리의 lib\plugin 디렉토리로 복사하고) 루트 사용자로 확장 프로그램을 설치할 수 있습니다:

```js
mysql -u root -p -f < examples\install.sql
```

<div class="content-ad"></div>

Linux 또는 MacOS 사용자는 INSTALL 파일의 지침을 따라 프로젝트를 컴파일해야 합니다.

#의사 난수 생성

통계 함수를 살펴보기 전에 무작위 숫자나 분포를 생성하는 방법에 대해 먼저 살펴보겠습니다.

명확히 말하자면, 우리는 '통계적' 무작위성 또는 의사 난수성에 대해 이야기하고 있으며 이는 어떠한 인식 가능한 패턴이나 규칙성을 포함하지 않습니다. 많은 통계 사용 사례에 도움이 되며 충분합니다.

<div class="content-ad"></div>

그러나 이는 '진정한' 무작위성, 즉 객관적으로 예측할 수 없음을 의미하는 것은 아닙니다.

## 간단한 난수

다음 쿼리를 사용하여 Mersenne Twister 알고리즘(rand_mt)을 이용하여 0 이상의 임의의 숫자를 생성할 수 있습니다.

```js
SELECT rand_mt();
```

<div class="content-ad"></div>

우리 샘플 데이터셋의 각 급여 항목에 대해 무작위 '가중치'를 생성하여 쇼케이스로 보여 드리겠습니다. 즉, 급여 테이블에 새 열을 추가하고 이 열에 대해 무작위 숫자를 생성합니다.

```js
ALTER TABLE salaries ADD weight double;

UPDATE salaries SET weight = rand_mt();
```

## 정규 분포의 변변량

데이터 분석에 정규 분포가 필요한 경우 다음 쿼리로 변변량을 생성할 수 있습니다 (rand_norm([σ, [μ]])):

<div class="content-ad"></div>

```js
SELECT rand_norm(); // μ=0, σ=1
SELECT rand_norm(0.3);// μ=0.3, σ=1
SELECT rand_norm(0.3, 4);// μ=0.3, σ=0.4
```

평균 μ의 기본 값은 0이며, 표준 편차 σ의 기본 값은 1입니다.

# 통계 함수

이제 통계 함수로 넘어가 보겠습니다.

<div class="content-ad"></div>

## 평균 또는 평균값

평균 또는 산술평균(avg)은 시리즈의 모든 숫자의 합을 시리즈의 숫자 수로 나눈 값입니다.

![이미지](https://miro.medium.com/v2/resize:fit:412/1*PIl3An_ZP3gWtqmAhO9S8g.gif)

해당 SQL 쿼리는 다음과 같이 보이며 직원들의 평균 급여를 반환합니다:

<div class="content-ad"></div>

```js
// 임금의 평균은 63,810.7448이에요.

## 가중평균

가중평균(avgw(x [,w]))은 시리즈에서 일부 데이터 포인트가 다른 것보다 더 많은 영향을 미치는 평균이에요.

![이미지](https://miro.medium.com/v2/resize:fit:394/1*k4So1dgcswrkuOjlYUOfBQ.gif)
```

<div class="content-ad"></div>

해당 SQL 쿼리는 다음과 같습니다. 직원들의 가중 평균 급여를 반환합니다 (임의의 가중치를 사용하여 보여주기 위한 것입니다):

```js
SELECT AVG(s.salary * s.weight) AS 'weighted mean' FROM salaries s;
```

## 분산과 표준편차

MySQL은 데이터 샘플의 분산 (variance) 및 표준편차 (std)를 계산하기 위한 내장 함수를 제공합니다.

<div class="content-ad"></div>

```js
SELECT 
  VARIANCE(salary) as '분산',
  STD(salary) as '표준편차'
FROM salaries;
```

분산은 데이터 세트 내 숫자 사이의 차이를 측정하는 통계적 측정 값이며, 평균 값으로부터 제곱 차이의 평균으로 정의되며 아래와 같이 계산됩니다:

<img src="https://miro.medium.com/v2/resize:fit:500/1*2x2aLPiAXX_Hz7zNAxE7hA.gif" />

분산 함수는 var_pop()의 동의어로, 특정 열의 모든 필드의 모평균 분산을 계산합니다. 반면에 var_samp()는 표본 분산을 계산합니다.

<div class="content-ad"></div>

표 태그를 Markdown 형식으로 변경하면 됩니다.

<div class="content-ad"></div>

```js
SELECT skewness_pop(s.salary) as 'skew1' FROM salaries s;
SELECT skewness_pop(s.salary, s.weight) as 'skew2' FROM salaries s;

SELECT skewness_samp(s.salary) as 'skew3' FROM salaries s;
SELECT skewness_samp(s.salary, s.weight) as 'skew4' FROM salaries s;
```

만약 두 번째 매개변수가 지정되지 않은 경우 가중치는 1로 설정됩니다 (즉, 동일하게 가중치가 적용됨).

마지막 예제로, 성별로 그룹화된 평균 급여를 계산하고 데이터 샘플의 모든 관련 통계 속성을 함께 표시합니다.

```js
SELECT 
  e.gender,
  AVG(s.salary) as '평균 급여',
  skewness_samp(s.salary) as '왜도',
  stddevw_samp(s.salary) as '표준편차',
  var_samp(s.salary) as '분산'
FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
GROUP BY e.gender
ORDER by asalary ASC;

// gender, avg salary, skew, std, variance
F, 63769.6032, 0.7757583639505996, 16844.89107702957, 283750105.9957
M, 63838.1769, 0.7793202853331737, 16944.629259215217, 287120292.4635
```

<div class="content-ad"></div>

## 중앙값

중앙값은 데이터 세트의 정확히 중간에 있는 값으로, 데이터 샘플의 상위 절반과 하위 절반을 분리합니다.

이는 값의 50%가 중앙값보다 작거나 같고, 50%가 더 크거나 같음을 의미합니다. 널(Null) 값은 무시됩니다.

```js
SELECT MEDIAN(s.salary) as 'median' FROM salaries s;
```

<div class="content-ad"></div>

위의 SQL 쿼리는 모든 직원의 중앙급여를 제공합니다.

## 지니 계수

지니 계수는 통계적 분산 또는 불평등 분포의 측정치입니다. 0은 모든 값이 동일함을 나타내며; 1은 하나를 제외한 모든 값이 0임을 나타냅니다.

```js
SELECT GINI(s.salary) as 'gini coefficients' FROM salaries s; // 0.14754749176775583

SELECT gini(g.asalary)
FROM(
  SELECT 
    e.gender,
    AVG(s.salary) as 'asalary'
  FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
  GROUP BY e.gender
  ORDER by asalary ASC
) as g; // 0.00026868933832358
```

<div class="content-ad"></div>

위의 SQL 쿼리들은 개인 급여에서 작은 불일치(0.1475)를 보여줍니다. 그러나 평균 성별별 급여에서는 동등함(0.0003)을 나타냅니다.

# 두 변수의 통계적 관계

다음으로, 우리는 두 변수 x와 y 간의 통계적 관계를 살펴봅니다.

## 상관관계

<div class="content-ad"></div>

통계 확장 기능은 두 변수 간의 선형 상관 관계를 측정하는 피어슨 상관 계수(corr(x,y [,w]))를 제공합니다. 이 계수는 다음과 같이 계산됩니다:

![이미지](https://miro.medium.com/v2/resize:fit:924/1*xi9Wpe-uaMa_vZtSOvR-fQ.gif)

결과값은 -1과 1 사이의 숫자로, 관계의 강도와 방향을 나타냅니다:

- -1부터 0 사이: 음의 상관 관계, 즉 하나의 변수가 변화할 때 다른 변수는 반대 방향으로 변화합니다.
- 0: 상관 관계 없음, 즉 이러한 변수 간에는 관계가 없습니다.
- 0부터 1 사이: 양의 상관 관계, 즉 하나의 변수가 변화할 때 다른 변수도 동일한 방향으로 변화합니다.

<div class="content-ad"></div>

우리 데이터 세트에서는 나이와 연봉 간의 상관 관계가 있는지 알아보려고 합니다.

```js
SELECT
 corr(m.start_year - m.birth_year,m.salary)
FROM
(
    SELECT
        YEAR(e.birth_date) as 'birth_year',
        YEAR(s.from_date) as 'start_year',
        s.salary as 'salary'
    FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
) as m; // 0.20731856518839656
```

우리가 볼 수 있듯이, 나이와 연봉 간에 매우 약간의 (무시해도 될 정도의) 양의 상관 관계(0.207)가 있습니다.

# 순위

<div class="content-ad"></div>

순위 매기기는 숫자 또는 서수 값이 데이터가 정렬될 때 해당 순위로 대체되는 데이터 변환입니다.

이 함수 `rownumber()`를 사용하여 순위 목록을 만들 수 있습니다.

## 행 번호

그러나 첫 번째 예제에서는 함수가 전체 데이터 세트의 행 번호를 반환합니다.

<div class="content-ad"></div>

```sql
SELECT 
  rownumber() AS rowNo,
  e.first_name,
  e.last_name,
  e.gender,
  s.salary
FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
WHERE s.to_date > NOW()
ORDER by s.salary DESC
LIMIT 10;
```

두 번째 예제에서는 데이터 세트를 필터링하고 정렬한 후에 rownumber 함수를 사용하여 순위 목록을 만들 수 있습니다.

```sql
SELECT
  rownumber() AS rank,
  r.*
FROM
(
  SELECT
      e.first_name,
      e.last_name,
      e.gender,
      s.salary
    FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
    WHERE s.to_date > NOW()
    ORDER by s.salary DESC
    LIMIT 10
) as r;


//rank,first_name,last_name,gender,salary
//1,Tokuyasu,Pesch,M,158220
//2,Honesty,Mukaidono,M,156286
//3,Xiahua,Whitcomb,M,155709
//4,Sanjai,Luders,M,155513
//5,Tsutomu,Alameldin,M,155190
//6,Willard,Baca,M,154459
//7,Lidong,Meriste,M,154376
//8,Charmane,Griswold,M,153715
//9,Weijing,Chenoweth,F,152710
//10,Weicheng,Hatcliff,F,152687
```

위의 SQL 쿼리는 현재 상위 10명의 최고 수입자를 제공합니다 (salaries 테이블의 to_date가 현재 유효한 급여인 경우 MAX입니다).

<div class="content-ad"></div>

# 결론

이 글에서는 MySQL 데이터베이스에서 통계 확장을 사용하여 고급 데이터 분석을 수행하는 방법을 소개했습니다.

이러한 함수들(물론 MySQL의 내장 함수 포함)을 사용하면 대규모 데이터셋의 심층적인 통찰을 효율적으로 얻을 수 있습니다. 그리고 추후 글에서 설명할 통계/머신 러닝 도구로 내보내기하기 전에 대규모 데이터셋에 대한 내용을 얻을 수 있습니다.

저희의 기술 뉴스레터를 구독하세요(Spring Boot, 웹 에이전시, SaaS 앱, 코스), 그리고 다른 열정적인 코더들과 함께 커뮤니티에 참여하세요.

<div class="content-ad"></div>

행복한 독서, 행복한 코딩!

더 많은 소식을 받으려면 thebootcode.io에서 Coders를 팔로우하세요.