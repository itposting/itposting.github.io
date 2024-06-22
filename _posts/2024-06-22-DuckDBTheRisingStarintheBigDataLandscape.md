---
title: "DuckDB 빅데이터 업계의 떠오르는 스타"
description: ""
coverImage: "/assets/img/2024-06-22-DuckDBTheRisingStarintheBigDataLandscape_0.png"
date: 2024-06-22 17:38
ogImage: 
  url: /assets/img/2024-06-22-DuckDBTheRisingStarintheBigDataLandscape_0.png
tag: Tech
originalTitle: "DuckDB: The Rising Star in the Big Data Landscape"
link: "https://medium.com/@mihaibojin/duckdb-the-big-data-rising-star-71916f953f18"
---


# 빅 데이터의 현재 상태

지난 십 년 동안 빅 데이터 환경은 놀라운 변화를 겪었습니다. 이 빠르게 발전하는 분야에서 오늘날 사용 가능한 도구의 숫자는 엄청납니다 — 십 년 전과 비교하면 약 9배나 다양합니다.

이 다양성은 데이터 웨어하우스, 데이터 레이크, 레이크하우스로만 한정되지 않고, ETL (추출, 변환, 적재)에서 ELT (추출, 적재, 변환), EL (추출, 적재) 등의 처리 방법론까지 확대되었습니다. 선택의 폭증은 하나의 기술에 대한 전문가가 되는 일이 어렵다는 점을 복합화시키는 것으로, 결국 시간은 우리 모두에게 동등합니다!

SQL이 다양하고 다양한 이 생태계에서 데이터 변환의 선택 도구로 자리 잡았으며, 많은 데이터 처리 플랫폼에서 선택 언어로 자리잡았음을 입증하고 있습니다.

<div class="content-ad"></div>

다양한 도구 중 하나인 DuckDB가 큰 인기를 끌고 있어요! 알아맞히셨죠... DuckDB!

# DuckDB가 뭔지, 그리고 왜 신경 써야 할까요!?

DuckDB는 빠르게 인기를 얻고 있는 인프로세스 SQL 분석 엔진입니다. 그 인기를 증명하는 인상적인 통계들이 있어요:

- PyPI에서 매달 170만 다운로드
- GitHub에서 13,800개의 스타를 기록하며 Postgres와 같은 관심을 절반의 시간에 도달합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-DuckDBTheRisingStarintheBigDataLandscape_0.png" />

- DuckDB는 DB-Engines의 트렌드 보고서에 의하면 Snowflake와 유사한 두 년간의 기간 동안 인기가 급증했습니다. 다음 몇 년 동안 주류가 될 것으로 전망되며, 현재 전통적인 데이터 웨어하우스에서 처리되는 일부 페이로드를 대체하는 것으로 잘 준비되어 있는 것으로 보입니다.

<img src="/assets/img/2024-06-22-DuckDBTheRisingStarintheBigDataLandscape_1.png" />

DuckDB의 오픈 소스 성격은 영구적인 MIT 라이선스로 보장되어 있어 매력을 더합니다.

<div class="content-ad"></div>

# DuckDB의 주요 이점

- 설치의 용이성: DuckDB를 실행하는 것은 brew install duckdb(이것은 DuckDB CLI를 설치합니다)처럼 매우 간단합니다.
- 낮은 복잡성: 서버가 없다는 점 (DuckDB는 바이너리일 뿐입니다)로, 자격 증명, 액세스 제어 목록, 방화벽 구성 등과 같은 복잡한 작업이 필요하지 않습니다.
- 보편적 호환성: 매우 적은 종속성을 가지고 DuckDB는 이식성을 대표합니다. 심지어 브라우저에서도 실행할 수 있습니다!
- DataFrame 통합: DuckDB의 Python 라이브러리는 Pandas DataFrames를 쿼리할 수 있는 능력을 갖고 있어 게임 체인저입니다! 직접 쿼리할 수 없는 어떤 시스템과도 통합 계층 또는 '접착제' 역할을 하여 데이터 처리의 변환 단계를 용이하게 합니다.
- 확장 기능: DuckDB는 유연한 확장 메커니즘을 가지고 있어 JSON 및 Parquet에서 데이터를 직접 읽거나 S3에서 데이터를 직접 읽는 경우와 같은 유연성을 제공합니다. 이 능력은 개발자들의 경험을 크게 향상시킵니다.
- 안정성과 효율성: DuckDB는 메모리 제한을 초과하는 작업 부담을 처리하도록 설계되었습니다 (일부 제한 사항이 있음). 이것은 분석 데이터셋이 사용 가능한 RAM보다 훨씬 크지만 디스크에 맞는 작은 경우에 특히 관련이 있으며, 이는 '싼' 및 쉽게 이용 가능한 하드웨어(예: 랩톱)를 사용하여 분석을 완료할 수 있도록 해줍니다.

# 실제 데이터 파이프라인에서의 DuckDB

클라우드 기반 시스템과 비교할 때 DuckDB는 최소한의 요구 사항과 비용 효율성으로 두드러지게 나타납니다. DuckDB는 클라우드 계정, 할당량 또는 추가 비용이 필요하지 않습니다. 개발자의 랩톱에서 제품 설정까지 DuckDB의 일관성은 데이터가 스테일하거나 잘못될 경우 시간이 지남에 따라 발생하는 클라우드 기반 솔루션과는 대조적입니다.

<div class="content-ad"></div>

DuckDB의 간편한 실행은 데이터를 계산 노드로 이동하거나 VM/작업 오케스트레이션, 장애 처리와 같은 분산 시스템에서 볼 수 있는 일반적인 도전 과제를 우회합니다. Apple의 M1 SoC로 구동되는 클라우드 기반 또는 유사한 현대 기계의 성능은 DuckDB의 유용성을 더욱 향상시킵니다. 이는 대규모 데이터셋을 처리하는 단일 기계 처리 시나리오를 가능케 하죠. 실제로 매일 TB 단위의 데이터를 처리해야 하는 고객은 매우 적고, 이들은 모든 공개 클라우드에서 사용 가능한 CPU 성능보다 더 많은 CPU 성능이 필요하게 될 것입니다.

# SQL 구문 설탕

DuckDB의 상대적인 신선함은 GROUP BY ALL, SELECT * EXCLUDE, ASOF JOINS 등과 같은 새로운 SQL 구문 개선을 도입할 수 있는 유연성을 제공합니다. 이러한 추가 기능은 SQL 쿼리를 더 직관적이고 가독성 있게 만들어줍니다. 아래 코드 스니펫을 살펴보세요:

```js
-- ANSI SQL에서 여러 필드로 그룹화
SELECT country, city, region, postal_code, AVG(price) AS avg_price
FROM customers
-- 집계되지 않는 필드는 여기서 반복되어야 함
GROUP BY country, city, region, postal_code;

-- DuckDB에서 모두를 기준으로 그룹화
SELECT country, city, region, postal_code, AVG(price) AS avg_price
-- 필드는 한 번만 나열됨. 코드 유지 관리가 더 쉬워집니다
GROUP BY ALL;
```

<div class="content-ad"></div>

```js
-- 'email' 필드를 제외한 모든 데이터를 ANSI SQL에서 쿼리합니다.
SELECT country, city, region, postal_code, address, phone_number
  /*, email*/
FROM customers;

-- 'email' 필드를 제외한 모든 데이터를 DuckDB에서 쿼리합니다.
SELECT * EXCLUDE (email) FROM customers;
```

```js
-- '대략적으로' 동일한 타임스탬프를 조인하는 것을 고려합니다.
-- ANSI SQL에서는 보통 이를 버킷화해야 합니다.
-- DuckDB에서는 ASOF JOIN을 사용하여 동일한 결과를 더 간편하고 효율적으로 얻을 수 있습니다.
SELECT events.id, events.ts, events.val, metadata.details
FROM events
ASOF JOIN metadata USING(id, ts);
```

# Pandas 데이터프레임 통합

특히 Python 생태계에서 DuckDB의 중요한 장점은 Pandas 데이터프레임과의 원활한 통합 기능입니다. 이 기능은 다양한 소스에서 다양한 데이터셋을 병합하는 프로세스를 간소화하여 데이터 분석 및 변환 작업을 용이하게 합니다.


<div class="content-ad"></div>

예를 들어, Jupyter Notebook에서 다음을 수행할 수 있습니다 (영화 추천 시스템 데이터셋을 기반으로):

```js
# 의존성 설치
%pip install --quiet duckdb
%pip install --quiet jupysql
%pip install --quiet duckdb-engine
%pip install --quiet pandas
%pip install --quiet matplotlib
%pip install --quiet psycopg2-binary
%pip install --quiet dash
%pip install --quiet plotly

import duckdb
import pandas as pd

# jupysql 로드 및 구성
%load_ext sql
%config SqlMagic.autopandas = True
%config SqlMagic.feedback = False
%config SqlMagic.displaycon = False
%config SqlMagic.named_parameters=True

# 로컬 DuckDB 인스턴스에 연결
%sql duckdb:///

# DuckDB를 사용하여 원격 파일 조회 활성화 (예: S3)
%%sql
INSTALL httpfs;
LOAD httpfs;

# S3 액세스 키 구성
SET s3_region = '...';
SET s3_access_key_id = '...';
SET s3_secret_access_key = '...';

# 원격 Postgres 데이터베이스에 연결
ATTACH 'dbname=DATABASE user=USER host=HOST password=PASSWORD connect_timeout=10' AS postgres (TYPE postgres, READ_ONLY);

# 쿼리를 실행하고 데이터프레임에 저장
%%sql
df << SELECT 
    t1.movieId,
    t1.title,
    t1.genres,
    t2.userId,
    t2.rating,
    t3.tag
  # Postgres의 테이블 쿼리
  FROM postgres.public.movies AS t1
  # DuckDB의 테이블과 조인
  INNER JOIN ratings AS t2 USING (movieId)
  # S3의 JSON 데이터셋과 조인
  INNER JOIN 's3://S3-BUCKET/tags.json' AS t3 USING (userId, movieId)

# 마지막으로 다른 쿼리에서 데이터프레임을 참조
%%sql
by_genres << SELECT genres, COUNT(*) AS cnt 
             FROM df
             GROUP BY ALL
             ORDER BY 2 DESC
             LIMIT 5;

# 또는 변형된 데이터셋 플롯
import plotly.express as px
fig = px.pie(by_genres,
             values='cnt',
             names='genres',
             title='Top 5 movie genres')
fig.show()
```

# 결론

DuckDB의 개요를 통해 이 도구가 대용량 데이터 영역에서 다재다능하고 효율적이며 사용자 친화적인 잠재력을 갖고 있음을 강조했습니다. 상대적으로 새로운 참가자로서, 데이터 엔지니어와 소프트웨어 개발자들의 변화하는 요구에 부합하는 솔루션을 가능하게 하고 간극을 좁히는 독특한 위치에 있습니다.

<div class="content-ad"></div>

가장 일반적인 데이터 처리 사용 사례를 다루는 데 그 유틸리티와 다양성에 대해 자신이 있습니다. DuckDB와 관련한 여러분의 경험과 통찰력에 대해 듣고 싶습니다!

다음에 또 만나요 - 계속해서 쿼리해 보세요! 🦆