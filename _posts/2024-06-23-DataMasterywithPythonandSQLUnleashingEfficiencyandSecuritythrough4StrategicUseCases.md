---
title: "Python과 SQL로 데이터 마스터하기 4가지 전략적 사용 사례를 통한 효율성과 보안 강화"
description: ""
coverImage: "/assets/img/2024-06-23-DataMasterywithPythonandSQLUnleashingEfficiencyandSecuritythrough4StrategicUseCases_0.png"
date: 2024-06-23 16:46
ogImage: 
  url: /assets/img/2024-06-23-DataMasterywithPythonandSQLUnleashingEfficiencyandSecuritythrough4StrategicUseCases_0.png
tag: Tech
originalTitle: "Data Mastery with Python and SQL: Unleashing Efficiency and Security through 4 Strategic Use Cases"
link: "https://medium.com/towards-data-science/data-mastery-with-python-and-sql-unleashing-efficiency-and-security-through-4-strategic-use-cases-eb8afb5019a0"
---



![Data Mastery with Python and SQL: Unleashing Efficiency and Security through 4 Strategic Use Cases](/assets/img/2024-06-23-DataMasterywithPythonandSQLUnleashingEfficiencyandSecuritythrough4StrategicUseCases_0.png)

# 소개

데이터 분석과 관리는 현대 기업 운영의 필수 구성 요소입니다. 데이터의 힘을 효과적으로 이용하기 위해 전문가들은 프로그래밍 언어와 도구의 조합을 활용하여 효율적인 데이터 처리, 조작 및 분석을 실현합니다. 이 기사에서는 데이터 분석가와 과학자들이 효과적인 의사 결정을 내리기 위해 널리 사용되는 두 가지 기본 언어인 Python과 SQL의 놀라운 기능을 탐색합니다.

Python은 다양한 데이터 관련 도전 과제에 대처하기 위한 다양한 라이브러리와 프레임워크를 제공한다는 사실은 널리 알려져 있습니다. Python과 SQL은 함께 강력한 조합을 이루어 데이터 전문가들이 데이터의 최대 잠재력을 발휘하고 데이터베이스를 보다 효과적으로 탐색할 수 있도록 지원합니다.


<div class="content-ad"></div>

이 기사에서는 Python과 SQL의 효과와 시너지를 보여주는 네 가지 구별된 사용 사례를 살펴봅니다. 각 사용 사례는 Python의 유연성과 SQL의 질의 능력이 결합된 능력이 돋보이는 고유한 시나리오를 대표합니다.

자세히 알아보겠습니다!

# 사용 사례

사용 사례 1: Python으로 작성된 SQL 쿼리의 가독성 향상

<div class="content-ad"></div>

웹 API를 사용하여 GridDB와 같은 클라우드 데이터베이스에 연결하고 SQL 쿼리를 실행하여 데이터를 검색하는 상황을 상상해보세요. JSON 페이로드를 수용하는 API 엔드포인트를 위한 HTTP 요청 본문을 작성할 때 SQL 쿼리를 요청 본문에 포함해야 합니다. 그러나 실제로는 다양한 어려움이 있을 수 있습니다.

실제로 사용되는 SQL 쿼리는 점점 복잡해지며 적절한 들여쓰기, 줄 바꿈을 포함하고 코드를 읽기 쉽도록 형식화하는 것이 어려워질 수 있습니다. 또한 VScode 또는 Jupyter와 같은 Python 노트북에서 쿼리를 한 줄로 작성해야 하는 경우, 코드 기능을 설명하는 유용한 주석 행을 추가하는 것이 불가능해집니다. 이러한 쿼리가 포함된 노트북은 장기적으로 유지 및 디버깅하기 어려워집니다.

아래 솔루션은 여러 줄에 걸쳐 SQL 쿼리를 작성할 수 있게 해 주어 코드의 가독성과 유지보수성을 향상시킵니다. 적절한 줄 바꿈과 들여쓰기를 사용하여 복잡한 쿼리를 쉽게 구성하고 이해할 수 있으며 명확성을 희생시키지 않고 처리할 수 있습니다.

여기 Python에서 SQL 쿼리를 작성하는 더 좋은 방법이 있습니다.

<div class="content-ad"></div>

```js
sql_query1 = (f"""
-- 지역, 카테고리 및 판매 등급별로 판매 데이터를 분류하는 쿼리

SELECT region,
    CASE WHEN lower(category) LIKE 'a%' THEN 'Category A'
         WHEN lower(category) LIKE 'b%' THEN 'Category B'
         WHEN lower(category) LIKE 'c%' THEN 'Category C'
         ELSE '기타 카테고리'
    END AS category_classification,
    CASE WHEN subquery.total_sales BETWEEN 1 AND 1000 THEN '낮은 판매량' 
         WHEN subquery.total_sales BETWEEN 1001 AND 5000 THEN '중간 판매량'
         WHEN subquery.total_sales > 5000 THEN '높은 판매량'
    END AS sales_classification
FROM Sales_Dataset
JOIN (
    SELECT region, SUM(sales) AS total_sales
    FROM Sales_Dataset
    GROUP BY region
) AS subquery
ON Sales_Dataset.region = subquery.region
GROUP BY 1, 2
ORDER BY 3 DESC
""")
```

그런 다음 아래와 같이 파이썬의 JSON 라이브러리를 사용하여 요청 본문에 전달할 수 있습니다 -

```js
import json
# 요청 본문 작성
request_body = json.dumps([
    {
        "type": "sql-select",
        "stmt": sql_query1
    }
])

# 작성된 요청 본문 유효성 검사
print(request_body)
```

JSON 물체를 생성하며, 해당 물체에는 작업 유형("sql-select")과 SQL 쿼리문(stmt)가 포함됩니다. json.dumps() 함수를 사용하여 파이썬 사전을 JSON 문자열 표현으로 변환합니다.

<div class="content-ad"></div>

다음으로 requests 라이브러리를 사용하여 요청을 게시할 수 있습니다.

```js
data_req1 = requests.post(url, data=request_body, headers=header_obj)
```

## 사용 사례 2: 텍스트 열에서 해시태그 추출

TikTok와 Instagram과 같은 플랫폼의 소셜 미디어 분석을 수행할 때, API를 통해 데이터를 추출하고 Azure나 Redshift와 같은 데이터베이스에 저장하는 것이 일반적입니다. 그러나 API 응답에는 종종 콘텐츠가 문자열로 제공되며, 해시태그가 비디오 제목 전체에 흩어져 있는 경우가 많습니다. 이를 해결하기 위해 다음 쿼리를 사용하여 비디오 제목과 같은 텍스트 열에서 해시태그를 추출할 수 있습니다.

<div class="content-ad"></div>

```sql
select * from 
(SELECT distinct TRIM(SPLIT_PART(title, '#', num)) AS hashtag
FROM social_media_video_info
CROSS JOIN (
    SELECT 1 AS num UNION ALL
    SELECT 2 AS num UNION ALL
    SELECT 3 AS num UNION ALL
    SELECT 4 AS num UNION ALL
    SELECT 5 AS num UNION ALL
    SELECT 6 AS num UNION ALL
    SELECT 7 AS num UNION ALL
    SELECT 8 AS num UNION ALL
    SELECT 9 AS num UNION ALL
    SELECT 10 AS num
) AS nums
WHERE num <= LENGTH(title) - LENGTH(REPLACE(title, '#', '')) + 1
  AND TRIM(SPLIT_PART(title, '#', num)) <> ''
) 
where hashtag not like '% %'
```

하위 쿼리는 다음 단계를 수행합니다:

- 'social_media_video_info' 테이블의 'title' 열을 '#' 문자로 구분자로 사용하여 분할합니다.
- SPLIT_PART(title, '#', num) 함수는 지정된 "num" 위치에서 '#'로 구분된 "title" 열의 일부를 추출합니다.
- TRIM() 함수는 추출된 부분에서 선행 또는 후행 공백을 제거합니다.
- DISTINCT 키워드는 고유한 해시태그만 선택됨을 보장합니다.
- 부하 쿼리 "nums"와의 CROSS JOIN은 숫자 1에서 10까지를 가진 임시 결과 집합을 생성합니다.
- 조건 num `= LENGTH(title) — LENGTH(REPLACE(title, ‘#’, ‘’)) + 1은 "title" 열의 해시태그 최대 수에 따라 분할이 이루어짐을 보장합니다.
- 조건 TRIM(SPLIT_PART(title, ' # ', num)) `` ‘’는 빈 해시태그를 필터링합니다.
- 요약하면 쿼리는 'social_media_video_info' 테이블의 'title' 열에서 '#'를 구분자로 사용하여 해시태그를 추출합니다. 고유하며 비어있지 않은 해시태그만 선택하며 결과에서 공백이 포함된 해시태그는 제외합니다. 이 쿼리는 제목 당 최대 10개의 해시태그만 고려합니다.

## Use Case 3: Python에서 미래 및 폐기 경고 억제하기

<div class="content-ad"></div>

이 몇 줄의 코드는 프로그램 실행 중 미래 경고와 사용이 중단된 경고를 억제하는 데 목적이 있습니다.

```js
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=DeprecationWarning) 
```

현재 라이브러리 버전과 호환되는 코드를 사용하고 있고 잠재적인 문제나 사용이 중단된 기능에 대해 알림을 받고 싶지 않은 경우 유용할 수 있습니다.

경고는 종종 라이브러리의 미래 버전에서의 잠재적인 문제나 변경 사항에 대한 유용한 정보를 제공합니다. 경고가 발생하는 근본적인 문제를 완전히 무시하는 대신에 그에 대응하고 해결하는 것이 일반적으로 권장됩니다. 'warnings' 모듈은 파이썬 코드에서 어떻게 경고가 처리되는지 제어할 수 있는 simplefilter() 옵션도 제공합니다.

<div class="content-ad"></div>

## 사용 사례 4: 가능한 경우 매개변수화된 쿼리 사용

Python을 사용하여 SQL 쿼리를 실행할 때, SQL 문에 값을 직접 포함하는 대신 매개변수화된 쿼리나 준비된 문장을 사용하는 것이 좋습니다. 이렇게 함으로써 SQL 인젝션 공격을 방지하고 데이터 유형을 올바르게 처리할 수 있습니다.

만약 당신의 애플리케이션이나 스크립트가 아래의 select 쿼리를 사용한다고 가정해봅시다 -

```js
SELECT * FROM 
TABLE 
WHERE 
COLUMN1 IN ('abcd')
```

<div class="content-ad"></div>

만약 공격자가 데이터베이스에 악의적인 값을 삽입하려고 한다면, 그들은 다음 쿼리를 사용하여 이를 수행할 수 있는 구멍을 이용할 수 있습니다. 아래는 공격자가 '선택 쿼리'에 삽입 문을 추가하여 데이터베이스에 불필요한 값들을 주입하는 방법의 기본 예시입니다. 아래 회색 부분은 공격자가 제공한 악의적인 입력으로, 결과적으로 한 번에 2개의 쿼리가 실행되는 것입니다 - 1. 선택하고 2. 삽입하다.

![이미지](/assets/img/2024-06-23-DataMasterywithPythonandSQLUnleashingEfficiencyandSecuritythrough4StrategicUseCases_1.png)

'테이블 삽입'에만 해당하는 것은 아닙니다. 공격자는 다른 선택, 업데이트, 삭제 또는 심지어 테이블 삭제를 실행할 수 있습니다. 'DROP TABLE'이 얼마나 재앙을 초래할 수 있는지 상상해보세요!

SQL 주입은 입력을 살균화하거나 매개변수화함으로써 방지할 수 있습니다. 각각에 대한 자세한 내용을 살펴보겠습니다.

<div class="content-ad"></div>

## 매개변수화

매개변수화는 수동으로 또는 파이썬에서 사용할 수 있는 패키지를 통해 수행할 수 있습니다. 설문 응용 프로그램을 사용한다고 상상해보세요. 사용자가 채우기 위해 설문 조사를 보내는 상황입니다. 사용자들은 제공된 두 개의 텍스트 상자에 세부 정보를 입력하도록 요청받습니다. 사용자가 두 텍스트 상자에 세부 정보를 입력할 때마다 아래와 같이 백그라운드에서 Insert SQL 쿼리가 실행된다고 가정해 봅시다 -

theVal1 = 설문 텍스트 상자 1에서 가져옴
theVal2 = 설문 텍스트 상자 2에서 가져옴

아래는 백그라운드에서 실행되는 응용 프로그램 코드입니다 -

<div class="content-ad"></div>

```js
  sql = "INSERT INTO TABLE VALUES ('" + theVal1 + "','" + theVal2 + "')"
```

만약 1번 사용자가 텍스트 상자 1에 A3를 입력하고 텍스트 상자 2에 A4를 입력한다면, 백엔드에서 실행되는 쿼리는 다음과 같을 것입니다 -

```js
INSERT INTO TABLE VALUES ('A3','A4')
```

만약 두 번째 사용자가 해커라면 굉장히 교활한 사용자일 겁니다. 이 사용자는 테이블 구조와 백엔드 쿼리를 이해하고 있다면, 이를 악의적으로 이용하여 추가적인 레코드를 삽입할 수 있습니다.

<div class="content-ad"></div>

사용자가 텍스트 상자 1에 값 A1을 입력하고 텍스트 상자 2에 다음 값을 입력한다고 가정해 봅시다.

```js
A2 ');INSERT INTO TABLE VALUES ('B1','B2
```

본질적으로 발생하는 일은 값이 백엔드 쿼리에 추가되어 아래와 같이 됩니다.

```js
INSERT INTO TABLE VALUES ('A1','A2');INSERT INTO TABLE VALUES ('B1','B2')
```

<div class="content-ad"></div>

그래서, 이 해킹 사용자에 의해 2개의 레코드가 삽입될 것입니다.

당신의 테이블은 세 개의 값이 있을 것입니다. 첫 번째 사용자가 삽입한 값 1개와 두 번째 사용자가 삽입한 값 2개 -

![image](/assets/img/2024-06-23-DataMasterywithPythonandSQLUnleashingEfficiencyandSecuritythrough4StrategicUseCases_2.png)

## 입력 살균 처리

<div class="content-ad"></div>

산소화는 입력 값의 특수 문자를 이스케이핑하여 수행할 수 있습니다. 이 작업은 대상 컨텍스트(예: SQL 쿼리)에서 특별한 의미를 가지는 문자를 해당하는 이스케이프 표현으로 대체하거나 인코딩하는 것을 포함합니다. 예를 들어 SQL에서는 작은따옴표(') 문자가 흔히 두 번 반복하여 이스케이프됩니다(그것을 대체함으로써 문자열에서 작은따옴표를 2개로 대체). 다시 말해, 쿼리에 입력 값을 넣기 전에 값을 수동으로 이스케이프할 수 있습니다. 이를 위해 str.replace를 사용할 수 있습니다.

응용 프로그램 코드는 동일한 상태로 유지하면서 다음에 보여지는 몇 개의 문자열 대체 문을 추가합니다 -

theVal1 = 설문조사 텍스트상자1에서 가져옴
theVal2 = 설문조사 텍스트상자2에서 가져옴

```js
escapedVal1 = theVal1.replace("'", "''")
escapedVal2 = theVal2.replace("'", "''")
sql = "INSERT INTO TABLE VALUES ('" + escapedVal1 + "','" + escapedVal2 + "')"
```

<div class="content-ad"></div>

해커가 악성 레코드를 삽입하려고 시도할 때 사용자의 삽입문과 함께 삽입이 됩니다. 아래와 같이 보일 거에요 -

```js
INSERT INTO TABLE VALUES ('A1','A2'');INSERT INTO TABLE VALUES (''B1'',''B2')
```

테이블에 삽입된 값은 아래와 같을 거에요 -

![이미지](/assets/img/2024-06-23-DataMasterywithPythonandSQLUnleashingEfficiencyandSecuritythrough4StrategicUseCases_3.png)

<div class="content-ad"></div>

따라서 백엔드 테이블에서 사용자 중 한 명이 삽입문을 실행하려고 시도한 사실을 확인할 수 있을 것입니다. 입력 변수를 이스케이핑하는 것만으로 SQL 인젝션을 효과적으로 막았습니다.

더 나은 방법은 psycopg2, pyodbc, sqlite3 또는 SQLAlchemy와 같은 Python 라이브러리를 사용하는 것입니다. 이러한 SQL 어댑터들은 다른 기능들과 함께 매개변수화된 쿼리를 지원하는 내장 기능을 갖추고 있습니다.

# 마무리

본 문서에서는 SQL 쿼리를 다룰 때 Python 프로그래밍 기술을 향상시키기 위한 네 가지 실용적인 사용 사례를 살펴보았습니다. Python으로 작성된 SQL 쿼리의 가독성을 향상시키기 위한 Use Case 1부터 시작하여 쿼리 포맷팅과 들여쓰기와 같은 기술을 활용함으로써 코드를 더 체계적이고 이해하기 쉽도록 만들 수 있습니다.

<div class="content-ad"></div>

Use Case 2로 넘어가면서, 텍스트 열에서 해시태그를 추출하는 방법에 대해 살펴보았습니다. SQL 및 문자열 조작 함수를 활용하여 관련 해시태그를 효과적으로 추출하고 데이터 분석 프로세스를 강화하는 방법을 배웠습니다.

Use Case 3에서는 Python에서 미래 및 폐기 경고 메시지를 억제하는 중요성을 다뤘습니다. `warnings` 모듈을 활용하여 더 깨끗한 Python 출력과 오류 없는 코드 실행을 보장할 수 있어, 불필요한 방해요소와 호환성 문제를 피할 수 있습니다.

마지막으로, Use Case 4에서는 보안을 강화하고 성능을 개선하며 SQL 인젝션 공격을 방지하기 위해 처리된 코드와 매개변수화된 쿼리를 사용하는 중요성을 강조했습니다.

이러한 사용 사례를 이해하고 구현함으로써 Python 개발자와 데이터 분석가는 SQL 쿼리 실행 및 최적화 기술을 향상시켜 훨씬 견고하고 효율적인 코드를 작성할 수 있습니다. 실제 상황에서 이러한 기술을 적용하면 더 깨끗한 워크플로우를 만들고 효율적이고 안전하게 실행 가능한 통찰력을 도출할 수 있을 것입니다.