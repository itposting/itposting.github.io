---
title: "파이썬 프로젝트와 SQL 효율적인 쿼리 관리 전략"
description: ""
coverImage: "/assets/img/2024-06-19-PythonProjectswithSQLStrategiesforEffectiveQueryManagement_0.png"
date: 2024-06-19 16:29
ogImage: 
  url: /assets/img/2024-06-19-PythonProjectswithSQLStrategiesforEffectiveQueryManagement_0.png
tag: Tech
originalTitle: "Python Projects with SQL: Strategies for Effective Query Management"
link: "https://medium.com/@romina.elena.mendez/python-projects-with-sql-strategies-for-effective-query-management-f79d696b2c66"
---


프로젝트에서 데이터베이스와 상호 작용하는 프로그래밍을 할 때, 쿼리를 어떻게 조직화하고 재사용할지 고민하는 일이 종종 있어요. 이럴 때 몇몇 개발자는 쿼리를 보다 동적으로 만들기 위해 문자열을 연결하는 함수를 만들기도 하고, 다른 사람들은 이 쿼리를 정의하는 변수를 만들기를 선호하기도 해요. 일부 더 고급 개발자들은 쿼리를 정의할 때 SQLAlchemy 객체 선언을 사용하기도 하는데, 이 방법은 배우는 곡선이 있어서 더 복잡한 쿼리를 다룰 때 개발 프로세스를 어렵게 만들 수 있어요.

어느 날, 저는 코드를 지나치게 복잡하게 만들지 않고도 조직적이고 재사용 가능한 방식으로 작업하기 위한 해결책을 찾던 중 흥미로운 라이브러리인 aiosql을 우연히 발견했어요.

<div class="content-ad"></div>

다음 기사에서는 aiosql 라이브러리를 어떻게 사용하는지를 검토하고 문서에서 설명되는 내용과 함께 다른 컨텍스트에서 구현하는 데 사용한 몇 가지 방법을 공유하겠습니다.

# ⚙️ aiosql 라이브러리란 무엇인가요?

Aiosql은 🐍파이썬 라이브러리로, SQL 쿼리를 주요 파이썬 프로젝트 코드와 분리된 파일에 쉽게 작성할 수 있도록 도와줍니다. 이러한 쿼리는 SQL 파일에 저장되며, 이후에는 🐍파이썬 객체 내의 메서드로 변환됩니다.

Aiosql의 또 다른 주목할 만한 기능은 매개변수를 받아들이는 동적 메서드를 생성할 수 있는 능력으로, 유연한 쿼리 실행과 기본 데이터베이스와의 효과적인 상호 작용을 가능케합니다.

<div class="content-ad"></div>

SQL 쿼리를 Python 코드에서 분리함으로써 코드를 더 깔끔하고 모듈식으로 유지하는 데 도움이 됩니다. 이는 프로젝트의 가독성과 유지보수성을 향상시킵니다.

# ⚙️ aiosql의 작동 방식

다이어그램에서 볼 수 있듯이 SQL 파일에서 모든 쿼리를 가져와서 Python 코드에서 쿼리 헤더에 정의된 이름으로 호출하여 사용할 수 있습니다. 이후에 Python 코드에서 필요한 매개변수를 직접 전달하여 쿼리를 실행할 수 있습니다. 이를 통해 쿼리를 재사용하고 유지보수하기 쉽게 만들 수 있습니다.

<img src="/assets/img/2024-06-19-PythonProjectswithSQLStrategiesforEffectiveQueryManagement_1.png" />

<div class="content-ad"></div>

# ⚙️ Aiosql 라이브러리 핵심 기능

아래에서는 이 라이브러리가 이미 갖고 있거나 사용에 기반한 기능을 가질 수 있는 일련의 기능을 공유하겠습니다:

- 데이터베이스 작업을 위한 CRUD 기능 제공 (Create: Insert, Read: Select, Update, Delete).
- Python 코드와 SQL 코드를 분리하여 여러 데이터베이스가 있는 프로젝트에서 쿼리를 찾기 쉽게 함.
- 각 쿼리에 설명적인 이름과 독스트링을 할당할 수 있어 Python 함수와 유사하게 쿼리를 문서화할 수 있음.
- 프로젝트 내에서 쿼리 카탈로그를 작성하도록 지원하여 엔터티, 데이터베이스 또는 기타 그룹별 식별을 용이하게 함.
- 동적 값 전달과 필요에 따라 수정할 수 있는 동적 쿼리를 쉽게 생성할 수 있음.

![PythonProjectswithSQLStrategiesforEffectiveQueryManagement_2](/assets/img/2024-06-19-PythonProjectswithSQLStrategiesforEffectiveQueryManagement_2.png)

<div class="content-ad"></div>

# ⚙️ Aiosql 튜토리얼

## 🔧 사전 준비 사항

- 🐳 도커
- 🐙 도커 컴포즈
- 🐍 Python 라이브러리 설치:

```js
pip install aiosql pandas
```

<div class="content-ad"></div>

# 🚀 빠른 시작

## 🛠️ 포스트그레스 데이터베이스 만들기

- 1️⃣ — 이 저장소를 복제합니다: aiosql-tutorial

```js
git clone https://github.com/r0mymendez/aiosql-tutorial.git
```

<div class="content-ad"></div>

- 2️⃣ 'postgres' 폴더로 디렉토리 변경해주세요

```js
cd aiosql-tutorial/postgres
```

- 3️⃣ PostgreSQL 데이터베이스를 생성해주세요 → 터미널에서 실행하세요:

```js
docker-compose -f docker-compose.yml up --build
```

<div class="content-ad"></div>

- 4️⃣ 이제 컨테이너가 실행 중인지 확인하세요 → 터미널에서 다음을 실행해보세요:

```js
docker ps
```

- 5️⃣ CSV 파일을 로드하세요 → 컨테이너 내에서 CSV 파일을 로드하려면 다음 명령어를 실행하세요:

```js
cd src
python3 etl.py
```

<div class="content-ad"></div>

# 🏥 병원 데이터

aiosql을 구현하기 위해 Synthea에서 제공하는 데이터셋을 사용할 것입니다. 이 데이터는 매사추세츠 지역 인구의 다양한 변수를 고려한 시뮬레이션에서 생성된 합성 데이터입니다. 이 데이터셋에서는 `conditions`, `encounters`, `patients` 테이블을 사용할 것입니다.

# 👥 사용자 이야기

실제 상황을 반영하기 위해 3가지 사용 사례를 만들어보겠습니다:
* 1️⃣ — 데이터 분석가로서, 방문 횟수가 90번 백분위 이상인 환자 목록을 검색할 수 있기를 원합니다. 이를 통해 병원에서 가장 활발한 환자들을 식별할 수 있습니다. 또한 나중에 쉽게 조정할 수 있도록 이 백분위를 구성할 수 있기를 원합니다.
* 2️⃣ — **연구원 또는 데이터 분석가**로서, 일정 기간 동안 가장 빈도가 높은 10가지 진단을 받은 환자 데이터에 액세스하고, 추세를 분석하고 의료 서비스의 품질을 개선하기 위해 사용하고 싶습니다.
* 3️⃣ — **마케팅 분석가**로서, 환자 만족도 조사용 테이블을 작성하고, 의료 서비스의 품질에 대한 피드백을 수집하여 개선 조치를 취하고자 합니다.

<div class="content-ad"></div>

# 🚀 구현

우리가 만들 것인 사용자 스토리에 기반하여, 실행해야 하는 쿼리와 스크립트를 로드할 두 개의 파일을 정의할 것입니다:

- patients.sql: 회복 중인 환자 데이터에 관련된 모든 쿼리가 있는 곳입니다.
- visits.sql: 설문 조사와 같은 방문에 관련된 모든 쿼리가 있는 곳입니다.

그러므로 우리 프로젝트에서는 이러한 폴더 및 파일 구조를 가지게 될 것입니다.

<div class="content-ad"></div>

```js
📁 db

    - 📁 queries
        - 📄 patients.sql
        - 📄 visits.sql

📄 main.ipynb
```

1️⃣ — Python 라이브러리를 가져옵시다.

```js
import aiosql
import psycopg2
import pandas as pd
```

2️⃣ — SQL 쿼리를 가져와 데이터베이스 드라이버를 설정합시다.

<div class="content-ad"></div>

```js
sql = aiosql.from_path('src/db/queries', 'psycopg2')
```

3️⃣ — PostgreSQL 데이터베이스에 연결합니다.

```js
postgres_secrets = {'host': 'localhost','port': 5432, 'user': 'postgres', 'password': 'postgres', 'dbname': 'postgres'}
conn = psycopg2.connect(**postgres_secrets)
conn.autocommit = True
```

## 👥 사용자 이야기 I: 정적 값들

<div class="content-ad"></div>

위의 사용자 스토리를 기반으로, 먼저 90번째 백분위수 이상의 방문 빈도를 가진 환자 목록을 검색할 수 있는 쿼리를 생성할 것입니다.

1️⃣ — sql 파일에서 첫 번째 사용자 스토리에 대한 쿼리가 있습니다.

다음은 aiosq에서 SQL 문이 구성되는 세 가지 구성 요소입니다:

- 📗 Name: 이는 Python 코드에서 쿼리를 호출하는 데 사용되는 서술적인 이름입니다. 다음 예제에서 이름은 “fn_get_patients_adove_90th_percentile" 입니다.
- 📗 Description: 이는 문서 문자열을 생성하는 데 사용되는 자세한 설명입니다. 쿼리의 목적과 맥락에 대해 더 포괄적으로 설명합니다. 다음 예제에서 설명은 “90번째 백분위수 이상의 방문보다 더 많은 환자를 가져옵니다…" 입니다.
- 📗 Query: 여기에는 데이터베이스에서 실행될 SQL 쿼리가 있습니다.

<div class="content-ad"></div>

📄 sql: db/queries/patients.sql

```js
-- 이름: fn_get_patients_adove_90th_percentile
-- 모든 환자 중 방문이 90 번째 백분위수보다 많은 환자들을 가져옵니다. 모든 데이터는 encounters 테이블에 저장되어 있습니다.
 WITH patient_visits AS (
     SELECT
         patient,
         COUNT(*) AS visit_count
     FROM
         hospital.encounters
     GROUP BY
         patient
 ),
 percentil_n AS (
   SELECT
     percentile_cont(0.9) WITHIN GROUP (ORDER BY visit_count) AS p_visits
   FROM
   patient_visits
 )
 SELECT 
     pv.patient, 
     pv.visit_count
 FROM 
     patient_visits pv
 CROSS JOIN 
     percentil_n pn
 WHERE 
     pv.visit_count >= pn.p_visits;
```

2️⃣ — 'fn_get_patients_above_90th_percentile' SQL 함수를 데이터베이스 연결 'conn'을 사용하여 실행합니다.

```js
response = sql.fn_get_patients_above_90th_percentile(conn)
```

<div class="content-ad"></div>

3️⃣ — 이제 응답 객체를 판다스 데이터프레임으로 변환하여 데이터 조작을 더 쉽게 할 수 있습니다.

```python
data = pd.DataFrame([item for item in response], columns=['patient_id', 'num_visit'])
# 데이터프레임 표시.
data
```

![이미지](/assets/img/2024-06-19-PythonProjectswithSQLStrategiesforEffectiveQueryManagement_3.png)

쿼리를 확인하고 싶으면 다음 코드를 사용할 수 있습니다.

<div class="content-ad"></div>

```js
print(sql.fn_get_patients_adove_90th_percentile.sql)
```

## 👥 사용자 스토리 I: 동적 값

이제 우리는 다른 백분위 값들을 받아들일 수 있는 쿼리를 생성하여 전달된 값에 기반하여 동적으로 수정될 수 있도록 할 것입니다. 우리의 경우, 75번째 백분위 이상의 환자 목록을 얻는 예시를 제공할 것입니다.

```js
-- name: fn_get_patients_above_n_percentile
 WITH patient_visits AS (
     SELECT
         patient,
         COUNT(*) AS visit_count
     FROM
         hospital.encounters
     GROUP BY
         patient
 ),
 percentil_n AS (
   SELECT
     percentile_cont(:percentil_value) WITHIN GROUP (ORDER BY visit_count) AS p_visits
   FROM
   patient_visits
 )
 SELECT 
     pv.patient, 
     pv.visit_count
 FROM 
     patient_visits pv
 CROSS JOIN 
     percentil_n pn
 WHERE 
     pv.visit_count >= pn.p_visits;
```

<div class="content-ad"></div>

1️⃣ - 다음 코드는 입력값으로 다른 백분위 값을 허용하는 동적 SQL 쿼리를 실행합니다.

```js
# 이 경우에는 75 백분위 이상의 환자들을 얻습니다.
response = sql.fn_get_patients_above_n_percentile(conn, percentil_value=0.75)
data = pd.DataFrame([item for item in response], columns=['patient_id', 'num_visit'])
```

## 👥 사용자 스토리 II

이 사용자 스토리를 해결하기 위해 지정된 기간 내에서 가장 일반적인 질환이 있는 환자들을 검색하는 쿼리를 생성할 것입니다. 이 쿼리는 동적이며, 향후 관심 있는 질환 수의 변화를 허용할 것입니다.
이 쿼리는 세 개의 매개변수를 받습니다:

<div class="content-ad"></div>

- num_condition: 우리가 관심 있는 조건의 수를 제한할 수 있게 해줄 것입니다 (예: 가장 일반적인 상위 10개 조건).
- period_start_date와 period_start_end는 데이터를 검색하려는 시간 창을 정의할 것입니다.

```js
--name: fn_get_patients_top_conditions
--주어진 기간 동안 최상위 조건을 가진 환자 가져오기, 환자는 조건을 가진 날 수와 데이터 소스가 병원 스키마인 기준으로 정렬됩니다.
with top_n_conditions as(
  SELECT code, description, COUNT(*) 
   FROM hospital.CONDITIONS 
  GROUP BY code,description 
  ORDER BY COUNT(*) DESC 
  LIMIT :num_condition
),
top_n_condition_patients as (
  SELECT 
     p.ID, 
     p.FIRST, 
     p.LAST, 
     p.CITY, 
     p.GENDER, 
     EXTRACT(YEAR FROM AGE(p.BIRTHDATE)) AS age,
     c.start condition_start_date,
     c.stop condition_stop_date,
     EXTRACT(DAY FROM (c.stop - c.start )) AS condition_days, 
     c.encounter,
     c.code,
     c.description
   from hospital.patients p 
   inner join hospital.conditions c on c.patient = p.id
   inner join top_n_conditions t on t.code=c.code
)
select * 
 from top_n_condition_patients
 where condition_start_date between :period_start_date and :period_start_end;
```

```js
response = sql.fn_get_patients_top_conditions(conn, num_condition_days=10, 
 period_start_date='2022–01–01', 
 period_start_end='2022–12–31')
column_name=['id', 'first','last','city','gender',
'age','condition_start_date','condition_stop_date','condition_days','encounter','code','description']
data = pd.DataFrame([item for item in response], columns=column_name)
data.head()
```

## 👥 사용자 이야기 III

<div class="content-ad"></div>

이제 aiosql을 사용하여 테이블을 생성할 것입니다. 만약 SQL 코드를 살펴보시면 # 기호가 추가된 것을 보실 수 있습니다. 이러한 기호들은 aiosql이 다양한 작업을 식별하는 데 사용됩니다.

```js
--name: fn_create_survey_table#
CREATE TABLE HOSPITAL.VISIT_SURVEY(
 ID SERIAL PRIMARY KEY,
 PATIENT_ID VARCHAR(50),
 SURVEY_DATE TIMESTAMP,
 RATING INT,
 COMMENTS TEXT,
 CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<img src="/assets/img/2024-06-19-PythonProjectswithSQLStrategiesforEffectiveQueryManagement_4.png" />

1️⃣ — 'fn_create_survey_table' SQL 함수를 실행하여 데이터베이스에 새 테이블을 만드세요.

<div class="content-ad"></div>

```js
sql.fn_create_survey_table(conn)
```

```js
# output
CREATE TABLE
```

2️⃣ — 테이블이 생성되면 아래 삽입문을 사용하여 환자의 리뷰를 삽입할 수 있습니다.

```js
-- name: fn_add_one_visit_survey<!
insert into HOSPITAL.VISIT_SURVEY(PATIENT_ID,SURVEY_DATE,RATING,COMMENTS) 
 values (:patient_id, :survey_date, :rating,:comments) returning ID;
```

<div class="content-ad"></div>

```js
# 새로운 방문 조사 레코드 추가
sql.fn_add_one_visit_survey(conn, 
 patient_id='8b9a93f6-3df3-203d-932f-f456e00d2c01', 
 survey_date='2022-01-01', 
 rating=5,
 comments='이 병원 정말 좋아요!' )
```

3️⃣ — 이제 여러 리뷰를 로드하기 위해 새로운 삽입문을 활용할 것입니다. 이 리뷰들은 딕셔너리 목록에 저장되어 있습니다 (파이썬의 각 딕셔너리는 리뷰에 해당합니다). 이를 수행하기 위해 비슷한 쿼리를 활용하겠지만 그 이름을 수정해야 합니다.

```js
-- name: fn_add_many_visit_survey*!
 insert into HOSPITAL.VISIT_SURVEY(PATIENT_ID,SURVEY_DATE,RATING,COMMENTS) 
 values (:patient_id, :survey_date, :rating ,:comments) returning ID;
```

```js
# 여러 방문 조사 레코드 추가
response_survey = [
     {
       'patient_id': '8b9a93f6-3df3-203d-932f-f456e00d2c01',
       'survey_date': '2022-01-01',
       'rating': 3,
       'comments': '서비스는 좋았어요. 다만 대기 시간이 조금 길었습니다.'
     },
     {
       'patient_id': '7c8a93f6-4df3-203d-932f-f456e00d2c02',
       'survey_date': '2022-02-01',
       'rating': 4,
       'comments': '직원들이 매우 친절했어요!'
     },
     {
       'patient_id': '6b7a93f6-5ef3-203d-932f-f456e00d2c03',
       'survey_date': '2022-03-01',
       'rating': 3,
       'comments': '대기 시간이 조금 길었습니다.'
     }
]
sql.fn_add_many_visit_survey(conn, response_survey)
```

<div class="content-ad"></div>

# 📚 프로젝트 쿼리 카탈로그

튜토리얼 초반에는 프로젝트용 쿼리 카탈로그를 만들 수 있는 가능성을 언급했습니다. 이 라이브러리는 이 기능을 직접 제공하지는 않지만, 나의 GitHub 저장소에서 이 튜토리얼의 완전한 코드와 데이터에 액세스하여 이를 수행하는 방법을 확인할 수 있습니다.

유용하게 사용하시면, ⭐️ 스타를 남겨주시고 새로운 글 알림을 받기 위해 팔로우해주시면 저에게 큰 도움이 됩니다. 기술 커뮤니티에서 성장하고 더 많은 콘텐츠를 제작할 수 있게 될 것입니다.

# 🔍 최종 결론

<div class="content-ad"></div>

- 다양성과 유틸리티: 저는 aiosql이 다른 프로젝트에서 쿼리를 효율적으로 구현할 수 있게 해주는 유용한 라이브러리라고 생각합니다. 이 라이브러리는 SQL 쿼리를 관리하고 실행하는 구조적인 방법을 제공하여 본 코드베이스와 별도로 처리할 수 있어 가독성과 유지 보수성을 향상시킵니다.
- 유연한 쿼리 처리: aiosql은 데이터베이스 연결을 통해 쿼리를 직접 실행할 수 있는 환경을 제공하지만, 저의 프로젝트에서는 주로 Python 코드로 이미 설정한 클래스를 사용하여 SQL 코드를 반환하고 실행합니다.
- 다른 데이터베이스: 쿼리를 저장하고 관리할 수 있는 기능은 SQL 데이터베이스를 넘어서기도 합니다. 예를 들어 이 접근 방식은 Neo4j와 같은 NoSQL 데이터베이스에도 적용할 수 있습니다. 구조적인 방식으로 쿼리를 구성하고 처리함으로써 다양한 유형의 데이터베이스와의 상호 작용을 최적화할 수 있습니다.

## 📚 참고 자료

학습하고 싶다면...