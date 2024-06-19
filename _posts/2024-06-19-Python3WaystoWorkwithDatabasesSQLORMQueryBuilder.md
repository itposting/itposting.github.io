---
title: "파이썬 - 데이터베이스 작업하는 3가지 방법SQL, ORM, Query Builder"
description: ""
coverImage: "/assets/img/2024-06-19-Python3WaystoWorkwithDatabasesSQLORMQueryBuilder_0.png"
date: 2024-06-19 16:39
ogImage: 
  url: /assets/img/2024-06-19-Python3WaystoWorkwithDatabasesSQLORMQueryBuilder_0.png
tag: Tech
originalTitle: "Python — 3 Ways to Work with Databases (SQL, ORM, Query Builder)"
link: "https://medium.com/stackademic/python-3-ways-to-work-with-databases-sql-orm-query-builder-e2a2d3cbe437"
---


## 원시 SQL 쿼리, ORM 및 SQL 쿼리 빌더 비교와 코드 예제

대부분의 데이터 엔지니어링 스크립트는 어떤 식으로든 데이터베이스에 연결하는 작업을 수반합니다. 우리는 종종 데이터를 검색하고, 해당 데이터에 작업을 수행한 후 다시 데이터벤에로로드해야합니다. 다행히도, 현대 프로그래밍 언어는 이러한 워크플로우를 실행할 수 있는 여러 가지 방법을 제공합니다.

가장 간단한 접근 방법은 SQL 쿼리를 사용하는 것인데, 이는 텍스트로 작성되고 이를 통해 데이터베이스와 통신합니다. 파이썬은 이러한 목적으로 Database API라는 형식의 표준을 제공합니다. 그러나 이 방법은 크고 복잡한 프로그램에 대해 복잡해질 수 있습니다.

따라서 ORM (객체 관계 매핑) 및 SQL 쿼리 빌더와 같은 다른 옵션이 있습니다. 이 둘은 각각의 장단점을 가지고 있습니다. 이 세 가지 표준을 모두 탐구해 보기 위해 여기에 들어가 봅시다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Python3WaystoWorkwithDatabasesSQLORMQueryBuilder_0.png" />

내 GitHub에서 모든 코드를 확인할 수 있습니다. 또한 제 다른 기사 예시도 찾아볼 수 있어요. 자유롭게 사용하시고 질문이 있으면 언제든지 물어봐주세요.

## 사전 준비 작업

다양한 방법을 논의하기 전에 PostgreSQL 데이터베이스에 테이블을 생성해야 합니다. 이전에 SQL 문의 순서에 대해 썼던 이전 기사 중 하나에서 동일한 데이터를 사용했습니다. 생성 문은 그곳에서 찾을 수 있어요.

<div class="content-ad"></div>

이 모든 방법을 비교하기 위해 동일한 SELECT 문을 사용할 것입니다. 이 SELECT 문은 모든 중요한 작업을 포함하고 있습니다. 집계 및 필터링 (GROUP BY, WHERE 및 HAVING) 같은 작업입니다.

```js
SELECT
 c.country
 ,c.year
 ,MAX(e.horse_power) AS max_horse_power
FROM public.cars c
JOIN public.engines e
 ON c.engine_name = e.name
WHERE c.country != 'USA'
GROUP BY
 c.country
 ,c.year
HAVING MAX(e.horse_power) > 200
ORDER BY max_horse_power DESC
```

![이미지](/assets/img/2024-06-19-Python3WaystoWorkwithDatabasesSQLORMQueryBuilder_1.png)

## Raw SQL

<div class="content-ad"></div>

장점: 사용하기 쉽고 SQL 언어의 모든 기능을 활용할 수 있습니다.

단점: SQL 방언에 따라 다르며, 대규모 애플리케이션에서 확장성과 가독성에 문제가 있을 수 있습니다.

가장 쉬운 옵션부터 시작해 보죠. 데이터베이스와 통신하기 위해 쿼리를 사용하는 것입니다. 이를 위해 psycopg2 (또는 다른 데이터베이스)와 같은 라이브러리를 사용할 때의 표준 규칙을 따른 스크립트를 만들었습니다.

```js
import psycopg2
from pathlib import Path

conn = psycopg2.connect()
cur = conn.cursor()

sql = Path('python-sql/sql/max_horsepower.sql').read_text()

cur.execute(sql)
res = cur.fetchall()
print(res)

cur.close()
conn.close()

# [('Germany', 2019, 612), ('UK', 2019, 612), ('Germany', 2021, 510), ('Germany', 2023, 469)]
```

<div class="content-ad"></div>

위 내용을 보면 코드에서 SQL 문을 구현하는 것이 간단하며, 데이터베이스 쪽에서 하는 것처럼 사용할 수 있습니다. 그러나 대규모 애플리케이션을 작업할 때 여러 SQL 스크립트를 처리하는 것은 복잡할 수 있습니다. 다시 말해, 확장 가능하고 가독성이 좋은 코드를 개발하는 가장 최적의 방법은 아닐 수 있습니다.

## ORM (객체 관계 매핑)

장점: 가독성이 높다. 텍스트 SQL 쿼리가 없으므로 보안이 강화된다. 쉽게 확장하여 새로운 기능을 추가할 수 있다. 모든 언어에 적합하다.

단점: 추가적인 학습이 필요하며 구현하는 데 더 많은 노력이 필요하다. 기능이 제한될 수 있으며, 서로 다른 ORM은 다른 사용 방법을 가질 수 있다. 엄격한 스키마를 가질 수 있다.

<div class="content-ad"></div>

ORM (Object-Relational Mapping)은 시간이 흐름에 따라 많은 애플리케이션에서 널리 사용되는 기술입니다. 이는 클래스와 객체를 사용하여 테이블을 나타내며, 이러한 클래스를 사용하여 레코드를 다룰 수 있습니다. 본질적으로, 이는 데이터베이스 테이블을 Python 클래스로 변환한 다음 이 언어에서 사용하는 것을 의미합니다.

Python에서 ORM에 대한 가장 인기 있는 프레임워크는 SQLAlchemy입니다. 그러나 Django를 개발할 때도 같은 개념을 만날 수 있으므로 더 효율적으로 작업하기 위해 이를 탐구하고 공부해보는 것이 좋습니다. 코드가 더 길고 복잡해 보일 수 있지만, 보다 유연한 클래스를 사용하여 Python으로 완전히 작성되었다는 점을 주목해주세요. ORM 객체를 사용하여 쿼리를 수행하는 방법에도 주의를 기울여야 합니다. 이는 각각의 명령문(join 및 group_by와 같은)에 대한 메서드를 사용하는 것을 보여줍니다.

```python
from dotenv import load_dotenv
import os

from sqlalchemy import URL, create_engine, func, select
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class Cars(Base):
    __tablename__ = "cars"
    
    manufacturer = Column(String(64))
    model = Column(String(64))
    country = Column(String(64))
    engine_name = Column(String(64), primary_key=True, nullable=False)
    year = Column(Integer)
    
class Engines(Base):
    __tablename__ = "engines"
    
    name = Column(String(64), primary_key=True, nullable=False)
    horse_power = Column(Integer)

def main():
    
    load_dotenv()
    
    connection_string = URL.create(
        'postgresql',
        username=os.getenv('USERNAME'),
        password=os.getenv('PASSWORD'),
        host=os.getenv('HOST'),
        database=os.getenv('DB'),
        #connect_args={'sslmode':'require'}
        )
    
    engine = create_engine(connection_string)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    sql = (
        select(
            Cars.country,
            Cars.year,
            func.max(Engines.horse_power).label("max_horse_power"),
        )
        .join(Engines, Cars.engine_name == Engines.name)
        .where(Cars.country != 'USA')
        .group_by(Cars.country, Cars.year)
        .having(func.max(Engines.horse_power) > 200)
        .order_by(func.max(Engines.horse_power).label("max_horse_power").desc())
    )
    
    for i in session.execute(sql):
        print(i)
    
if __name__ == '__main__':
    main()

#('Germany', 2019, 612)
#('UK', 2019, 612)
#('Germany', 2021, 510)
#('Germany', 2023, 469)
```

여기에는 SELECT 쿼리만을 위한 예제가 있지만, SQLAlchemy는 모든 중요한 작업 (INSERT, UPDATE, DELETE 및 기타 작업)을 위한 기능을 제공합니다.

<div class="content-ad"></div>

## SQL 쿼리 빌더

장점: 각 테이블에 대한 클래스(모델)를 결정하지 않고도 Python 코드만 사용하여 구현이 쉬우며 가독성 및 기타 장점을 유지할 수 있음

단점: 각 라이브러리마다 특정 구문을 사용해야 하며, 일부 SQL 기능이 아직 누락될 수 있음

Python에서 쿼리 빌더를 사용하는 것은 원시 문장과 ORM 사이의 중간 옵션이다. 각 테이블의 스키마를 정의할 필요가 없고 테이블 이름만 사용하면 된다.

<div class="content-ad"></div>

쿼리 빌더에는 준수해야 하는 특정 구문이 있습니다. 이 구문의 목적은 Python 코드를 SQL 문으로 변환하여 데이터베이스로 전송하는 것입니다. 아래 예제에서는 이를 위해 pypika 라이브러리를 사용하고 있습니다. 또한 psycopg2를 통해 간단한 데이터베이스 통신을 수행합니다.

```python
from pypika import Query, Table, functions, Order
import psycopg2

conn = psycopg2.connect()
cur = conn.cursor()

cars = Table("cars")
engines = Table("engines")

query = (
    Query.from_(cars)
    .join(engines)
    .on(cars.engine_name == engines.name)
    .where(cars.country != "USA")
    .groupby(cars.country, cars.year)
    .having(functions.Max(engines.horse_power) > 200)
    .orderby(functions.Max(engines.horse_power), order=Order.desc)
    .select(
        cars.country,
        cars.year,
        functions.Max(engines.horse_power).as_("max_horse_power")
    )
)
sql = query.get_sql()

cur.execute(sql)
res = cur.fetchall()
print(res)

cur.close()
conn.close()

# [('Germany', 2019, 612), ('UK', 2019, 612), ('Germany', 2021, 510), ('Germany', 2023, 469)]
```

흥미로운 점은 모든 작업을 실제로 SQL 측에서 실행되는 순서대로 작성한다는 것입니다. 위에서 언급한 대로, 이 순서를 설명한 이전 게시물을 방문할 수 있습니다.

## 결론

<div class="content-ad"></div>

이 기사에서는 파이썬에서 데이터베이스와 상호 작용하는 세 가지 주요 방법에 대해 논의했습니다. 각각에는 장단점이 있습니다. 그러나 사용할 방법을 선택하는 것은 대부분 귀하의 구체적인 사용 사례에 달려 있습니다.

- SQL 쿼리의 구문에 익숙하고 빠르고 간단한 해결책을 찾는 경우, 원시 SQL 쿼리를 사용하는 것이 최선일 수 있습니다. 또한 복잡한 쿼리를 실행해야 하는 경우 이 접근 방식이 유일한 선택일 수도 있습니다.
- 반면에, 보안 요구 사항이 있는 대규모 복잡한 애플리케이션을 개발해야 하는 경우 ORM을 사용하는 것이 가장 적합할 것입니다.
- 보안이 필요한 작은 애플리케이션을 개발하고자 하는 경우 쿼리 빌더를 사용하는 것이 좋은 선택일 수 있습니다. 쿼리 빌더는 모델을 만들 필요 없이 ORM의 대부분의 장점을 제공합니다.

이 기사를 읽고 나서 다양한 접근 방식에 대해 더 잘 이해하고 차후 프로젝트에 최적의 방법을 선택할 수 있기를 바랍니다.

LinkedIn에서 저를 만날 수 있으며, 데이터 과학과 데이터 엔지니어링의 복잡한 세계에 대해 함께 논의하고 싶습니다. 연결하기를 기다리고 있습니다. 함께 흥미로운 대화를 나눠봅시다.

<div class="content-ad"></div>

# 스택데믹

끝까지 읽어 주셔서 감사합니다. 떠나시기 전에:

- 작가를 박수로 격려하고 팔로우해 주세요! 👏
- 저희를 팔로우해 주세요: X | LinkedIn | YouTube | Discord
- 다른 플랫폼도 방문해 주세요: In Plain English | CoFeed | Venture