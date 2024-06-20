---
title: "파이썬과 SQL을 통합하여 견고한 데이터 솔루션 구축하기"
description: ""
coverImage: "/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_0.png"
date: 2024-06-20 15:43
ogImage: 
  url: /assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_0.png
tag: Tech
originalTitle: "Integrating Python with SQL for Robust Data Solutions"
link: "https://medium.com/gitconnected/integrating-python-with-sql-for-robust-data-solutions-8f43fedae944"
---


강력하고 효율적인 데이터 솔루션을 만들기 위해 Python과 SQL 통합을 숙달하세요.

![image](/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_0.png)

"데이터는 새로운 석유다." - 클라이브 햄비. Python과 SQL은 그 석유를 잘 정제하기 위해 필수적이지만, 왜 우리는 동시에 사용할 수 없을까요?

Python과 SQL을 사용하여 SQL 데이터베이스를 조작하려는 사람들을 위해, 우리는 다양한 접근 방식을 탐구하고 이 중 하나를 인터뷰 문제에서 구현해볼 것입니다.

<div class="content-ad"></div>

하지만 그 전에, 파이썬을 사용하여 데이터베이스에 연결하는 장점과 옵션을 살펴보겠습니다.

# 파이썬으로 SQL 서버에 연결하는 장점

Python을 사용하여 SQL 데이터베이스에 연결하는 것에는 여러 가지 이점이 있습니다. 시스템 내에 저장된 데이터를 처리하고 분석하는 데 도움이 됩니다. 이러한 이점은 다음과 같습니다:

- 향상된 데이터 분석: Python의 데이터 분석 라이브러리는 SQL 데이터베이스만 사용할 때 복잡한 방법의 효율성을 향상시켜 데이터 분석 프로세스를 용이하게 합니다.
- 자동화: Python을 사용하면 사용자가 SQL 데이터베이스에서 데이터를 추출, 변환하여 다시 데이터베이스에로드하는 ETL 프로세스를 자동화할 수 있습니다. Python 스크립트는 데이터 이전 시에 오류가 발생하지 않도록 시간을 절약하는 옵션을 제공합니다.
- 향상된 데이터 파이프라인: SQL과 Python을 결합하면 실시간 데이터 파이프라인을 제공하여 실시간으로 여러 지리적 위치의 데이터 맵을 전송, 변환 및 분석할 수 있습니다.
- 확장성: Python은 데이터 세트를 관리할 수 있으며, 따라서 Python 서비스를 사용하여 대량의 데이터 세트를 실시간으로 처리할 수 있습니다. SQL 데이터베이스 외에도 Python 능력을 활용합니다.
- 다양성: Python은 여러 데이터 유형에 적합하며 장르 간 데이터 전송을 지원하여 다양한 형식으로 데이터를 전송할 수 있습니다.

<div class="content-ad"></div>

# 고급 SQL 작업을 위한 Python 라이브러리 사용

![image](/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_1.png)

Python 라이브러리를 사용하면 복잡한 SQL 작업을 훨씬 쉽게 수행할 수 있습니다. 여러 가지 필수 라이브러리와 이점을 살펴보겠습니다:

# Psycopg2

<div class="content-ad"></div>

Psycopg2는 널리 사용되는 Python PostgreSQL 어댑터 중 하나입니다. 이러한 상황에서 PostgreSQL 데이터베이스에 연결하여 SQL 쿼리를 효과적으로 실행할 수 있습니다.

Psycopg2를 사용하여 다음을 수행할 수 있습니다:

- 데이터베이스를 생성하고 닫기.
- 트랜잭션 선택 및 처리.
- 여러 SQL 쿼리를 빠르게 실행.

아래는 간단한 코드 블록입니다:

<div class="content-ad"></div>

```js
from sqlalchemy import create_engine

# Create an engine instance
engine = create_engine('postgresql://user-name:password@localhost:5432/your-db-name')

# Connect to the database
connection = engine.connect()
```

이 코드는 연결 매개변수를 정의한 다음 Psycopg2를 사용하여 PostgreSQL 데이터베이스에 연결을 수립합니다. 연결은 데이터베이스와 통신하는 데 사용되는 객체인 conn입니다.

# SQLAlchemy

SQLAlchemy는 데이터베이스 작업을 효율적으로 처리하는 ORM(Object-Relational Mapping)입니다. SQLAlchemy를 사용하는 몇 가지 장점은 다음과 같습니다:

<div class="content-ad"></div>

- 더 쉬운 데이터베이스 스키마 관리
- 코드 가독성 및 유지 관리성
- 여러 데이터베이스 방언 지원

```js
import psycopg2

# 연결 매개변수 정의
conn_params = {
    'dbname': 'your-db-name',
    'user': 'user-name',
    'password': 'password',
    'host': 'localhost',
    'port': '5432'
}

# 연결 설정
conn = psycopg2.connect(**conn_params)
```

이 코드는 SQLAlchemy를 사용하여 엔진 인스턴스를 생성하고 PostgreSQL 데이터베이스에 연결을 설정합니다.

SQLAlchemy는 Python 객체를 사용하여 데이터베이스 상호 작용을 단순화합니다.

<div class="content-ad"></div>

# 판다스

판다스 라이브러리는 강력한 데이터 조작 도구로, SQL 데이터베이스에 쉽게 연결할 수 있습니다. SQL 쿼리에서 데이터를 직접 DataFrame으로 읽어와 간단한 분석과 효율적인 작업을 할 수 있습니다. 판다스를 사용하면 다음과 같은 작업을 수행할 수 있습니다:

- 쉽게 복잡한 데이터 조작을 수행합니다.
- 데이터셋을 원활하게 병합하고 결합합니다.
- 내장 함수를 사용하여 데이터를 분석하고 시각화합니다.

```python
import pandas as pd
import psycopg2

# 연결 매개변수 정의
conn_params = {
    'dbname': 'your-db-name',
    'user': 'user-name',
    'password': 'password',
    'host': 'localhost',
    'port': '5432'
}

# 연결 설정
conn = psycopg2.connect(**conn_params)

# 데이터를 판다스 DataFrame으로 가져오기
user_posts_df = pd.read_sql('SELECT * FROM user_posts', conn)
```

<div class="content-ad"></div>

마지막으로, 이 코드는 PostgreSQL 데이터베이스의 매개변수를 정의하고 Psycopg2를 사용하여 데이터베이스에 연결합니다. 그런 다음 user_posts 테이블에서 데이터를 검색하여 Pandas DataFrame에 보내고 데이터 조작이 가능해집니다.

# 데이터베이스 다이브: 메타 챌린지 대응

이제 StrataScratch의 Meta 챌린지 중 하나, Friday's Like Count를 해결하기 위해 데이터베이스에 연결해 봅시다.

다음은 질문입니다: https://platform.stratascratch.com/coding/10364-fridays-likes-count

<div class="content-ad"></div>


![User_posts dataset](/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_2.png)

We have three different datasets. Here is the user_posts dataset.

![Friendships dataset](/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_3.png)


<div class="content-ad"></div>

아래는 좋아요 데이터셋입니다.

그리고 여기에 예상되는 결과가 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_6.png" />

우선, 데이터셋을 읽기 위해 다음 단계를 따라야 합니다.

## 1. 연결 정의하기

우선, PostgreSQL 데이터베이스에 연결하기 위해 필요한 연결 매개변수를 정의할 것입니다.

<div class="content-ad"></div>

```js
import psycopg2
import pandas as pd

conn_params = {
    'dbname': 'your-db-name',
    'user': 'user-name',
    'password': 'password',
    'host': 'localhost',
    'port': '5432'
}
```

여기서는 코드에서 필요한 라이브러리를 먼저 가져옵니다. 다음으로, 연결 매개변수를 포함하는 사전을 만듭니다. 이러한 매개변수에는 다음이 포함됩니다:

- 데이터베이스 이름
- 사용자
- 비밀번호
- 호스트
- 포트 이름.

이제 두 번째 단계인 연결을 설정하겠습니다.


<div class="content-ad"></div>

## 2. 연결 설정

이제 정의된 연결 매개변수를 사용하여 PostgreSQL 데이터베이스에 연결합니다.

```js
conn = psycopg2.connect(**conn_params)
```

여기서는 이전 단계에서 이미 정의한 매개변수를 사용하여 pycop2 라이브러리의 connect() 메서드를 사용합니다. 다음 단계에서 데이터를 검색할 것이기 때문에 연결 부분이 끝났네요?

<div class="content-ad"></div>

## 3. 데이터 검색

이미 데이터베이스에 연결되어 있으므로 거기서 데이터를 가져와 봅시다. 세 개의 다른 테이블이 있으므로 각각 1번씩 코드를 반복합니다.

```js
user_posts_df = pd.read_sql('SELECT * FROM user_posts', conn)
friendships_df = pd.read_sql('SELECT * FROM friendships', conn)
likes_df = pd.read_sql('SELECT * FROM likes', conn)
```

이를 위해 판다스 라이브러리의 read_sql 메서드를 사용합니다. 이 메서드에서는 데이터를 선택하기 위한 쿼리를 작성하고 앞에서 정의한 연결인 "conn"을 인수로 추가합니다.

<div class="content-ad"></div>

## 4. 연결 닫기

이미 이러한 테이블을 데이터프레임으로 변환했으므로 연결을 유지할 필요가 없습니다. 자원을 해제하기 위해 닫아야 합니다.

```js
conn.close()
```

이 단계에서는 앞에서 정의한 Postgresql 데이터베이스와의 연결을 닫기 위해 close() 메서드를 사용합니다.

<div class="content-ad"></div>

이제 데이터셋을 읽는 데 성공했습니다. 이제부터는 이를 조작할 수 있습니다. 우리가 해결해야 하는 문제를 해결하기 위해 이제부터 따라야 할 단계는 다음과 같습니다:

- 친구 관계 데이터세트 정리
- 좋아요 및 게시물 데이터세트 병합
- 친구의 좋아요로 필터링
- 금요일에 좋아요로 필터링
- 날짜별 그룹화 및 좋아요 횟수 카운트
- 결과 표시

## 5. 친구 관계 정리 및 확장

친구 관계 데이터를 정리하고, 양방향 친구관계를 보장하기 위해 확장할 것입니다.

<div class="content-ad"></div>

```js
friendships_clean = friendships_df[['user_name1', 'user_name2']].drop_duplicates()
friendships_expanded_1 = friendships_clean.rename(columns={'user_name1': 'user_name1', 'user_name2': 'user_name2'})
friendships_expanded_2 = friendships_clean.rename(columns={'user_name1': 'user_name2', 'user_name2': 'user_name1'})
friendships_expanded = pd.concat([friendships_expanded_1, friendships_expanded_2]).drop_duplicates()
```

이 블록에서 수행하는 작업은 다음과 같습니다:

- 우정 데이터를 정리합니다: 사용자 이름1과 사용자 이름2만 선택하여 중복 행을 제거합니다.
- 두 가지 방식으로 우정을 나타내는 두 데이터 프레임을 만듭니다: friendships_expanded_1과 friendships_expanded_2.
- 이 2개의 데이터 프레임을 연결하고 중복을 제거하여 friendships_expanded를 얻습니다. 즉, 두 방향의 모든 고유한 우정 쌍을 얻게 됩니다.

## 6. 좋아요와 게시물을 결합하세요.

<div class="content-ad"></div>

받은 좋아요와 함께 게시물을 결합하여 각 좋아요에 대한 필요한 세부 정보를 얻습니다.

```js
likes_posts_joined = likes_df.merge(user_posts_df, left_on='post_id', right_on='post_id', suffixes=('', '_post'))
likes_posts_joined = likes_posts_joined[['user_name', 'post_id', 'date_liked', 'user_name_post']]
likes_posts_joined = likes_posts_joined.rename(columns={'user_name_post': 'poster_name'})
```

좋아요 DataFrame을 post_id 열을 기준으로 user_posts DataFrame과 병합하여 좋아요된 게시물에 대한 정보를 제공합니다. 그 후 필요한 열만 선택하고 편의를 위해 user_name_post를 poster_name으로 이름을 변경했습니다.

## 7. 친구의 좋아요 필터링

<div class="content-ad"></div>

우리는 친구들이 한 좋아요만을 걸러내겠어요.

```js
friends_likes = likes_posts_joined.merge(friendships_expanded, left_on=['user_name', 'poster_name'], right_on=['user_name1', 'user_name2'])
```

friendships_expanded와 likes_posts_joined라는 두 개의 데이터프레임이 있어요. 우리는 이 둘을 결합해서 친구들이 한 좋아요를 찾아내요. 이것은 친구들이 한 게시물에 대한 좋아요를 추적하는 데 필요한 과정이에요.

## 8. 금요일에 한 좋아요 걸러내기

<div class="content-ad"></div>

다음은 금요일에 한 좋아요만 포함하는 방법입니다.

```python
friends_likes['date_liked'] = pd.to_datetime(friends_likes['date_liked'])
friends_likes['day_of_week'] = friends_likes['date_liked'].dt.dayofweek
friday_likes = friends_likes[friends_likes['day_of_week'] == 4]
likes_df = pd.read_sql('SELECT * FROM likes', conn)
```

이 경우 요일을 사용하여 date_liked 필드를 datetime처럼 보이게 만듭니다. 그런 다음 DataFrame은 금요일의 좋아요만 보여주도록 필터링됩니다 (day_of_week = 4).

## 9. 날짜별로 그룹화하여 좋아요 횟수 세기

<div class="content-ad"></div>

매일마다 좋아요가 얼마나 있는지 세어본 후, 각 날짜별로 좋아요를 그룹화할 겁니다.

```js
result = friday_likes.groupby(friday_likes['date_liked'].dt.date).size().reset_index(name='likes')
result = result.rename(columns={'date_liked': 'date'})
```

여기서는 friday_likes 데이터프레임에서 각 날짜별로 좋아요가 얼마나 있는지 센 다음, 결과를 보기 좋은 형식으로 바꾸어 줍니다.

## 10. 결과 표시하기

<div class="content-ad"></div>

마지막으로, 우리는 매주 금요일마다 친구 게시물의 총 좋아요 수를 포함하는 결과를 표시할 것입니다.

```js
print(result)
```

결과는 다음과 같습니다.

<img src="/assets/img/2024-06-20-IntegratingPythonwithSQLforRobustDataSolutions_7.png" />

<div class="content-ad"></div>

# 마무리 마음

이 글에서 우리는 SQL 데이터베이스를 연결하는 다양한 옵션, 팬더스 방법을 사용하여 테이블을 조작하는 방법, 그리고 데이터베이스에 연결하는 이점을 탐색했습니다.

증강된 분석부터 간소화된 자동화까지 이점은 명확합니다. Meta 문제를 해결하는 것과 같은 실용적인 예제로, 우리는 그들의 현실 세계적인 영향을 보았습니다. 함께 데이터 마스터리 여정을 계속해보죠.