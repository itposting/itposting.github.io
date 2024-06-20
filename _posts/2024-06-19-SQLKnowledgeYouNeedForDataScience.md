---
title: "데이터 과학을 위해 필요한 SQL 지식"
description: ""
coverImage: "/assets/img/2024-06-19-SQLKnowledgeYouNeedForDataScience_0.png"
date: 2024-06-19 05:28
ogImage: 
  url: /assets/img/2024-06-19-SQLKnowledgeYouNeedForDataScience_0.png
tag: Tech
originalTitle: "SQL Knowledge You Need For Data Science"
link: "https://medium.com/towards-data-science/sql-knowledge-you-need-for-data-science-5cf0c15515e4"
---


![SQL Knowledge](/assets/img/2024-06-19-SQLKnowledgeYouNeedForDataScience_0.png)

365DataScience의 기사에 따르면, 1,000개의 LinkedIn 데이터 과학 직무 게시물 조사 결과, 60%가 SQL 요구사항이었습니다.

이 정보가 우리에게 무엇을 알려주나요?

음, 데이터 과학자로 취직하고 싶다면 SQL은 필수 기술이며, 이를 보유하고 있다면 취직할 기회가 더 커질 수 있습니다.

<div class="content-ad"></div>

이 글에서는 입문 수준 데이터 과학 직무를 얻기 위해 가져야 하는 SQL 지식에 대해 이야기하고, SQL을 배울 때 도움이 된 자료 및 조언을 제공할 것입니다.

# 지식

내 경험 상, 많은 입문 수준 데이터 과학 직무에서 SQL 전문가일 필요는 없습니다; 단순히 쿼리를 작성하고 필요한 데이터를 분석하고 머신러닝 모델을 구축하는 방법을 알고 있어야 합니다.

예를 들어, ETL(추출 변환 로드) 파이프라인을 생성하거나 데이터베이스를 관리하는 것은 일반적으로 데이터 과학자의 업무 범위를 벗어나 데이터 엔지니어의 작업입니다. 그러나 이러한 유형의 작업에 흥미가 있다면 이를 배우지 말아야 한다는 제한은 없습니다!

<div class="content-ad"></div>

## 개요

일단, 관계형 데이터베이스와 다양한 종류의 SQL 버전에 대한 이해를 얻어야 할 거예요. 버전을 꼭 배울 필요는 없어요; 그저 각각의 차이를 이해하고 특정한 이유를 파악하면 돼요. 이 내용은 본문에 깊이 파고들기 전에 간단히 읽어보는 것으로 생각해주세요!

제 경험을 바탕으로 MySQL 또는 PostgreSQL을 배우는 것을 추천해요. 산업 전반에서 가장 많이 사용되는 것들이라고 할 수 있어요. 하지만 모든 SQL 버전에서 대부분의 구문과 기능이 동일하기 때문에 이에 대해 너무 걱정할 필요는 없어요. 하나를 익히면, 나머지 것들은 쉽게 배울 수 있답니다. 그러니 과하게 생각하지 마세요.

## 기본 기능

<div class="content-ad"></div>

솔직히 말해서, 일할 때 질의할 때 95%의 시간은 기본 SQL 함수를 사용해요. 이전에 말했듯이, 데이터 과학자로서 SQL을 주로 사용해서 데이터를 가져오고 기본 변환 작업을 해요.

실제로 더 정교한 변환과 데이터 조작은 Pandas에서 해요. 그러면 중간에 유닛 및 통합 테스트를 통해 쉽게 테스트할 수 있거든.

어쨌든, 알아야 할 주요하고 가장 중요한 SQL 명령어는 다음과 같아요:


SELECT * FROM (표준 쿼리)


<div class="content-ad"></div>

```js
SELECT * FROM Employees
```

이 명령은 테이블에서 열을 선택합니다. * 명령어는 테이블 직원의 모든 열을 가져옵니다.

ALTER, INSERT, CREATE (테이블 수정)

```js
-- 테이블 생성
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    BirthDate DATE,
    Salary DECIMAL(10, 2)
);

-- 직원 테이블에 새 레코드 삽입
INSERT INTO Employees (EmployeeID, FirstName, LastName, BirthDate, Salary)
VALUES (1, 'John', 'Doe', '1980-01-01', 50000.00);

-- Employees 테이블을 변경하여 새 열 추가
ALTER TABLE Employees
ADD Department VARCHAR(50);
```

<div class="content-ad"></div>

여기서 우리는 Employees라는 테이블을 만들고 기본 키와 함께 열을 정의합니다. 그런 다음 INSERT INTO를 사용하여 이 데이터 프레임에 새로운 행을 추가합니다. 마지막으로 ALTER를 사용하여 Department라는 새 열을 추가합니다.

GROUP BY, ORDER BY

```js
-- GROUP BY
SELECT Department, COUNT(*) AS NumberOfEmployees
FROM Employees
GROUP BY Department;

-- ORDER BY
SELECT * FROM Employees
ORDER BY LastName ASC, FirstName ASC;
```

이 명령어들은 꽤 명확합니다. ORDER BY 명령어는 테이블을 열을 기준으로 정렬하고 GROUP BY는 열로 집계합니다. 여기서 우리는 부서별로 직원 수를 계산합니다.

<div class="content-ad"></div>

WHERE, AND, OR, BETWEEN, IN, HAVING (테이블 필터링)

```js
-- WHERE, AND, 그리고 OR
SELECT * FROM Employees
WHERE Salary > 40000 AND Department = 'Sales';

-- BETWEEN
SELECT * FROM Employees
WHERE BirthDate BETWEEN '1970-01-01' AND '1990-12-31';

-- IN
SELECT * FROM Employees
WHERE Department IN ('Sales', 'HR');

-- GROUP BY 그리고 HAVING
SELECT Department, AVG(Salary) AS AverageSalary
FROM Employees
GROUP BY Department
HAVING AVG(Salary) > 45000;
```

WHERE와 HAVING 명령문은 열을 기준으로 데이터프레임을 필터링합니다. 이 경우에는 급여, 생년월일, 그리고 부서로 필터링하고 있습니다.

AVG, COUNT, MIN, MAX, SUM (집계 함수)

<div class="content-ad"></div>

```sql
-- AVG, COUNT, MIN, MAX, SUM
SELECT 
    AVG(Salary) AS AverageSalary,
    COUNT(EmployeeID) AS NumberOfEmployees,
    MIN(Salary) AS MinimumSalary,
    MAX(Salary) AS MaximumSalary,
    SUM(Salary) AS TotalSalary
FROM Employees;

```

이 쿼리는 데이터셋에서 통계를 생성합니다. 결과는 평균 급여, 총 직원 수, 최저 급여, 최고 급여, 그리고 총 급여가 있는 행 하나만 출력됩니다.

DISTINCT

```sql
SELECT DISTINCT Department FROM Employees;
```

<div class="content-ad"></div>

만약 한 column에 중복된 항목이 있다면, DISTINCT 명령어를 사용하여 고유한 값만 얻을 수 있어요.

날짜와 시간 함수인 DATEADD, DATEDIFF, DATEPART입니다.

```js
-- DATEADD: 생년월일에 1년을 추가합니다
SELECT EmployeeID, FirstName, LastName, DATEADD(year, 1, BirthDate) AS BirthDatePlusOneYear
FROM Employees;

-- DATEDIFF: 직원의 나이를 계산합니다
SELECT EmployeeID, FirstName, LastName, DATEDIFF(year, BirthDate, GETDATE()) AS Age
FROM Employees;

-- DATEPART: 출생 연도를 추출합니다
SELECT EmployeeID, FirstName, LastName, DATEPART(year, BirthDate) AS BirthYear
FROM Employees;
```

여기에서 DATEADD는 생일에 1년을 추가하고, DATEDIFF는 직원의 나이를 계산하며 출생일과 현재 날짜 사이의 연도 차이를 얻어내고, DATEPART는 생일로부터 출생 연도를 가져옵니다.

<div class="content-ad"></div>

CASE (기본적으로 다른 언어에서의 if-else 문)

```js
SELECT EmployeeID, FirstName, LastName, 
    CASE 
        WHEN Salary > 60000 THEN '고'
        WHEN Salary BETWEEN 40000 AND 60000 THEN '중간'
        ELSE '저'
    END AS SalaryCategory
FROM Employees;
```

CASE는 조건부 if-else와 같이 작동합니다. 이 경우에는 급여가 60,000보다 크면 "고", 40,000에서 60,000 사이이면 "중간", 그렇지 않으면 "저"로 표시됩니다.

FULL JOIN, LEFT JOIN, RIGHT JOIN, INNER JOIN, UNION(모든 종류의 조인)

<div class="content-ad"></div>

```js
-- INNER JOIN
SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- LEFT JOIN
SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentName
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- RIGHT JOIN
SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentName
FROM Employees e
RIGHT JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- FULL JOIN
SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentName
FROM Employees e
FULL JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- UNION
SELECT FirstName, LastName FROM Employees
UNION
SELECT FirstName, LastName FROM Managers;
```

JOIN 명령어는 두 테이블을 특정 열과 id에 따라 결합하는 것입니다. 여기를 참조하여 각 타입의 시각적 설명과 내부 작동 방식을 확인하세요.

JOIN 작업은 아마 가장 어려울 것이므로 꼭 이해해야 합니다! 저도 여전히 실수를 com하지만 첫 직장에서 나쁜 경험을 한 후 많이 개선했습니다. 그러니 제 처럼 하지 말고 꼼꼼히 익히세요!

이러한 기본 함수를 알고 있다면, SQL 연습 문제가 포함된 입사 시 데이터 과학 인터뷰에 합격할 수 있을 것입니다.

<div class="content-ad"></div>

## 고급 기능

기본 기능을 마스터하면 더 많은 시간을 투자하여 고급 함수 중 일부를 학습하는 것이 가치가 있습니다. 저는 일상 업무에서 이러한 함수들을 정기적으로 사용하기 때문에 특히 큰 데이터 세트를 구축할 때 유용합니다. SQL 웨어하우스의 연산 시간이 Python보다 빠르기 때문에 더욱 유용합니다.

공통 표현식 테이블 (CTE) 및 서브쿼리

```sql
-- 공통 테이블 표현식 (CTE)
WITH SalesCTE AS (
    SELECT EmployeeID, SUM(SalesAmount) AS TotalSales
    FROM Sales
    GROUP BY EmployeeID
)
SELECT e.EmployeeID, e.FirstName, e.LastName, s.TotalSales
FROM Employees e
JOIN SalesCTE s ON e.EmployeeID = s.EmployeeID;

-- 서브쿼리
SELECT EmployeeID, FirstName, LastName, Salary
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);
```

<div class="content-ad"></div>

여기에서 하는 일은 SalesCTE라는 새 테이블을 생성한 다음 이 새 테이블을 Employee에 조인하는 것입니다. 이것은 CTE의 예입니다.

서브쿼리는 새 테이블을 생성하는 것이 아니라 테이블에서 값을 가져와서 필터링하는 것입니다. 이 경우에는 평균 급여입니다.

사용자 정의 함수 (UDFs)

```js
CREATE FUNCTION dbo.GetEmployeeFullName(@EmployeeID INT)
RETURNS NVARCHAR(100)
AS
BEGIN
    DECLARE @FullName NVARCHAR(100);
    SELECT @FullName = FirstName + ' ' + LastName
    FROM Employees
    WHERE EmployeeID = @EmployeeID;
    RETURN @FullName;
END;

-- UDF 사용
SELECT dbo.GetEmployeeFullName(EmployeeID) AS FullName
FROM Employees;
```

<div class="content-ad"></div>

UDFs(사용자 정의 함수)는 다른 언어의 일반 함수와 매우 유사하게 작동합니다. 여기에서는 직원의 전체 이름을 가져와 단일 열로 반환하는 함수를 만듭니다.

윈도우 함수 (RANK, ROW_NUMBER, DENSE_RANK)

```js
-- ROW_NUMBER
SELECT EmployeeID, FirstName, LastName, Salary,
    ROW_NUMBER() OVER (PARTITION BY Department ORDER BY Salary DESC) AS RowNum
FROM Employees;

-- RANK
SELECT EmployeeID, FirstName, LastName, Salary,
    RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS Rank
FROM Employees;

-- DENSE_RANK
SELECT EmployeeID, FirstName, LastName, Salary,
    DENSE_RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS DenseRank
FROM Employees;
```

윈도우 함수는 현재 분석 중인 행과 관련된 여러 행 전체에 대한 계산을 생성합니다.

<div class="content-ad"></div>

이 경우에는 ROW_NUMBER()를 사용하여 각 부서의 급여에 따라 직원들을 번호를 매깁니다.

RANK()도 비슷한 작업을 하며 각 부서에서 직원을 급여 순으로 순위를 매깁니다.

DENSE_RANK()는 다시 비슷하지만 동일한 급여를 받는 두 직원의 순위가 같습니다.

문자열 작업 및 정규 표현식

<div class="content-ad"></div>

```sql
-- 문자열 조작: CONCAT, SUBSTRING, REPLACE 등.
SELECT 
    CONCAT(FirstName, ' ', LastName) AS FullName,
    SUBSTRING(FirstName, 1, 1) AS FirstInitial,
    REPLACE(LastName, 'a', 'o') AS ModifiedLastName
FROM Employees;

-- LIKE를 사용한 정규 표현식
SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE FirstName LIKE 'J%'; -- 이름이 'J'로 시작하는 값

-- PATINDEX를 사용한 정규 표현식 (SQL Server)
SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE PATINDEX('%[0-9]%', LastName) > 0; -- 성에 숫자가 포함된 값
```

CONCAT은 두 개의 문자열을 결합하고, SUBSTRING은 문자열을 필터링하며, REPLACE는 문자열 내의 문자를 바꿉니다.

LIKE를 통해 `J%`는 J로 시작하는 값들을 검색합니다.

마지막으로, PATINDEX(`%[0-9]%`, LastName) > 0은 LastName에 0부터 9 사이의 숫자 중 하나가 포함된 첫 번째 발생을 찾기 위한 패턴 인덱스 검색입니다.


<div class="content-ad"></div>

다른 배울 것들이 많지만, 이러한 고급 기술들은 데이터 과학자로서 가장 자주 사용하는 것들입니다. 당신의 산업과 조직에 따라 다른 것들이 나타날 수 있을 거예요.

## 추가적인 항목

더 많은 시간이 있으시다면 SQL 주변의 인프라를 배울 수 있습니다. SQL 서버, 데이터베이스 관리, 데이터 웨어하우징, 데이터 플랫폼 확장, 쿼리 최적화, ETL 파이프라인 구축 등이 있습니다.

솔직히 말해서, 이러한 주제들에 대해 깊이있는 이해가 없습니다. 왜냐하면 이것들은 데이터 엔지니어가 데이터 과학자보다 더 관리하는 주제들이기 때문입니다. 하지만 이런 것들에 흥미가 있다면, 배우는 것에 대해 편하게 생각해보세요! 나도 미래 언젠가 이를 다뤄볼 계획이 있으며, 그것은 나를 보다 폭넓은 데이터 과학자로 만들어 가치를 증대시킬 것입니다. 하지만, 항상 말했듯이, 모든 것을 배울 수는 없어요!

<div class="content-ad"></div>

# 자료

자료에 관한 사항으로 SQL을 배울 때 W3Schools와 Tutorialspoint를 사용했어요. 이 두 사이트는 완전 무료이고 SQL 기초를 아주 잘 다루고 있어요. 저는 이 사이트들을 완벽한 코스보다는 참고 자료로 생각하는 편이에요. 그러나 시작 단계로서 좋은 입문 자료로서 강추하고, 여러분이 실습할 수 있는 연습문제도 있답니다.

수업 외에 더 많은 실습이 필요하다면 Hacker Rank나 Leetcode와 같은 웹사이트가 좋아요. 저는 입사면접 문제에 대답하기에 자신감이 생기기 전까지 약 50개의 SQL 질문을 Hacker Rank에서 풀었어요.

이 숫자에 대해 너무 걱정하실 필요는 없어요. 각자의 속도에 따라 50개보다 더 많거나 적게 필요할 수 있어요. 중요한 건 이해에 초점을 맞추고, 여러분이 편안하다고 느낄 때 알 수 있답니다.

<div class="content-ad"></div>

# 조언

SQL을 배우기 시작하는 사람들에게 제가 주고 싶은 세 가지 조언은 다음과 같습니다:

- "적절한" 과정 선택에 너무 많은 시간을 소비하거나 걱정하지 마세요. 당신이 좋아하는 과정을 선택하고 시작하세요. 초심자로서 어떤 입문 과정이든 도움이 되고 대부분 동일한 주제를 다룰 것입니다.
- 매일 연습하고 SQL을 이해하기 위해 연습 문제를 해결하는 것이 중요합니다; 10,000 시간 규칙(10,000 번 반복 규칙)은 여기서도 모든 것과 마찬가지로 적용됩니다.
- 인내심을 갖고, 모든 것이 결국 이해될 것이라고 약속드립니다. 하루에 모든 것을 배우거나 SQL을 완전히 마스터할 수는 없겠지만, 2주 안에 충분히 SQL 지식을 배워 입문 수준의 포지션을 확보할 수 있습니다. 이것이 바로 제가 한 것이며 아래 게시물에서 전체 SQL 학습 여정을 읽을 수 있습니다.

이 글이 당신이 입문 수준 데이터 과학 직군을 확보할 필요한 SQL 지식을 제공했기를 바랍니다! SQL을 배우려면 파이썬보다 요구되는 기술들이 적고 배우는 데 소요되는 시간도 더 짧습니다. SQL은 다소 관리하기 쉬운 작은 언어이지만, 그래도 필수적인 언어입니다.

<div class="content-ad"></div>

# 또 다른 것!

저는 무료 뉴스레터 'Dishing the Data'를 운영하고 있어요. 매주 더 나은 데이터 과학자가 되는 데 도움이 되는 팁, 분야에서의 일반적인 경험, 그리고 지난 주에 한 생각들을 공유하고 있습니다.

# 저와 소통해요!

- LinkedIn, X (Twitter), 또는 Instagram
- 나의 YouTube 채널에서 기술적인 데이터 과학 및 기계 학습 개념을 배워보세요!