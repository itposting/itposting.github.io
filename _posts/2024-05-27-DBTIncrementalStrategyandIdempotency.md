---
title: "DBT 증분 전략과 동등성"
description: ""
coverImage: "/assets/img/2024-05-27-DBTIncrementalStrategyandIdempotency_0.png"
date: 2024-05-27 12:53
ogImage:
  url: /assets/img/2024-05-27-DBTIncrementalStrategyandIdempotency_0.png
tag: Tech
originalTitle: "DBT Incremental Strategy and Idempotency"
link: "https://medium.com/finatext/dbt-incremental-strategy-and-idempotency-877993f48448"
---


![Screenshot](/assets/img/2024-05-27-DBTIncrementalStrategyandIdempotency_0.png)

# 배경

안녕하세요, 저는 데이터 엔지니어인 Todd입니다. 저는 Nowcast에서 데이터 온보딩에 주로 관여하고 있습니다. 이 기술 블로그에서는 Nowcast에서의 ETL 파이프라인 디자인의 간략한 역사를 소개하고, Airflow와 DBT의 "Incremental Models" 사이에서 발생한 문제를 설명하고 우리가 개발한 해결책을 소개하겠습니다.

# Python으로 ETL


<div class="content-ad"></div>

역사적으로 Nowcast에서는 ETL 파이프라인을 Python을 사용하여 작성했습니다. 이 파이프라인은 AWS S3, Athena, RDBMS 등에 저장된 데이터에 변환을 적용하는 많은 Python 스크립트로 구성되어 있었습니다. 우리는 이러한 스크립트를 포함하는 도커 이미지를 작성하여 ECR에 업로드하고, Airflow에서 ECS 작업을 호출했습니다. 이러한 스크립트는 보통 데이트와 같은 파티션 필드를 매개변수로 사용하여 멱등성이 있도록 설계되었습니다. 즉, 2024-01-01을 전달하면 2024-01-01의 데이터가 처리되었습니다.

이러한 스크립트 중 하나를 호출할 때, 실제로 실행되는 명령은 아래와 같이 보일 것입니다. 이때 데이트 매개변수는 Airflow에서 관리됩니다:

```js
python transform_data.py 2024-01-01 --some --other --arguments
```

# Airflow

<div class="content-ad"></div>

Airflow은 Nowcast에서 많은 해동안 사용되어온 스케줄링 및 워크플로우 관리 도구입니다. 기본적으로 두 가지로 사용되고 있어요:

1. 작업 스케줄러
2. 작업 의존성 관리

역사적으로 Airflow는 매일 실행되며 여러 Python 스크립트에 '실행 날짜' 매개변수를 전달하여 데이터를 처리합니다. 문제가 발생하거나 특정 기간의 작업을 다시 실행해야 할 때는 Airflow DAG에서 해당 작업을 다시 실행할 수 있습니다. 예를 들어, 2024년 01월 01일에 어떤 데이터 변환 스크립트가 실패하면 문제를 식별하고 수정한 후 해당 스크립트를 다시 실행할 수 있어요. 이는 스크립트가 한 번에 하나의 파티션만 처리하고 날짜를 매개변수로 입력받기 때문에 가능한 일입니다.

# DBT에서 ETL

2022년 말쯤 Python ETL 플로우를 Snowflake로 이전하기 시작했습니다. 그 결과 더 빠르고 저렴하며 깨끗한 파이프라인이 만들어졌어요. 우리는 파이프라인 실행 도구로 DBT를 사용하기로 결정했습니다 — DBT는 SQL 위에 위치한 레이어로 DB 모델 정의, 템플릿, 의존성 관리 및 데이터 회귀 테스트와 같은 다양한 기능을 포함하고 있어요. 빠르고 효율적으로 ETL 파이프라인을 구축하는 데 매우 유용한 도구입니다. 파이썬에서는 파이프라인의 각 변환을 스크립트로 작성하지만, DBT에서는 템플릿화된 SQL CTAS 쿼리로 작성됩니다. 이 쿼리들은 복잡한 수천 줄의 코드로 이루어진 스크립트와 비교했을 때 매우 읽기 쉽습니다.

<div class="content-ad"></div>

Best practise in DBT is to use Incremental Models:

# Incremental Models

Incremental models are an efficient way of defining how to (incrementally) add data to our SQL models — consider we have a table that describes credit card transactions — we can make a DBT model (CTAS) that looks something like this:

```js
{
 materialized="table"
}
select
 transaction_id,
 transaction_date,
 user_id,
 store_name_description,
 transaction_amount
from { ref('external_table_transaction') }
```

<div class="content-ad"></div>

이 코드는 table external_table_transaction에서 거래 데이터를 불러오는 테이블을 만듭니다. 문제는이 쿼리를 다시 실행할 때마다 전체 테이블을 다시로드한다는 것입니다. 테이블에 데이터가 많아질수록 쿼리가 느려지고 비용이 많이 발생합니다. 이 문제의 해결책은 증분 모델을 사용하는 것입니다:

```js
{
 config(
 materialized="incremental",
 unique_key=["transaction_id"],
 incremental_strategy="delete+insert",
 )
}
select
 transaction_id,
 transaction_date,
 user_id,
 store_name_description,
 transaction_amount
from { ref('external_table_transaction') }
 {- if is_incremental() }
 where transaction_date = (select max(transaction_date) + 1 as next_date from { this })
{- endif }
```

여기에서 우리는 DBT를 강력하게 만드는 일부 매크로/템플릿 기능을 볼 수 있습니다. 이제 기본적으로 하는 것은 테이블의 최신 데이터보다 1일이 더 늦은 거래 데이터만 external_table_transaction에서 로드해야 한다는 것입니다. 이것은 간단하면서도 강력합니다. 업데이트마다 계속 커지는 수십억 개의 데이터 행 처리 대신 이제 이전에 볼 수 없던 행만 처리하면 됩니다. 그리고 필요하다면 전체 갱신으로 테이블을 다시로드할 수 있는 옵션도 있습니다.

# 문제

<div class="content-ad"></div>

점진적 모델은 매우 매력적입니다 — 수학적으로 아름답고 데이터 스트림을 다룰 때 매우 잘 작동합니다. 문제는 처리하려는 데이터를 제어해야 할 때 발생합니다 — 점진적 모델은 특정 파티션만 다시 실행할 수 없으며 대신에 증분 모델의 규칙에 따라 데이터를 로드합니다. 이론적으로는 문제가 되지 않을 수도 있지만, 점진적 모델이 이상적인 환경에서 실행된다면 모든 데이터가 정확히 한 번만 로드될 것입니다 — 하지만 현실은 복잡합니다 — DAG가 깨지고, 데이터가 늦게 전달되거나 아예 제공되지 않는 경우가 발생하며 때로는 역사적 기록을 다시 로드해야 할 때가 있습니다. 게다가 Airflow 파이프라인이 어떤 이유로든 실패할 경우 DBT 작업이 Airflow 실행과 동기화되지 않을 수 있습니다. Nowcast로 마이그레이션한 이후 DBT를 사용하면서 경험한 점진적 모델과 관련된 이슈 목록이 아래에 나와 있습니다:

- 한 파이프라인에서 수리가 진행된 것이 있었는데, 이는 2년 전으로 거슬러 올라가야 했으므로 역사적 데이터를 로드해야 했는데 (증분) 데이터 파이프라인이 역사적 재실행을 처리할 수 없어서 즉시 처리해야 했습니다.
- 다른 DAG에서 상류 이슈로 3일 동안 깨졌으며, 3일 동안 데이터가 로드되지 않았고, DAG가 4일째 실행될 때 1일부터 데이터를 로드했으므로 동기화가 맞지 않았습니다.
- 세 번째 파이프라인에서 상류 스킵 날짜(데이터가 빠진 날)가 발생했고, 점진적 모델은 데이터를 로드하기 위해 데이터에서 최대 날짜에 `1`을 추가하는 방식으로 처리했으나 해당 날짜가 나타나지 않아 데이터가 로드되지 않은 채로 수동 처리가 필요해졌습니다.

하지만 우리는 단순히 점진적 모델을 포기할 수 없습니다 — 일부 파이프라인은 수십억 개의 행을 처리해야 하므로, 테이블을 대량으로 처리할 쿼리를 작성하면 느리고 비용이 많이 소요될 것입니다.

# 동형성(idempotency) 및 분할의 중요성.

<div class="content-ad"></div>

점진적 모델의 주요 문제는 이 모델이 멱등성을 갖지 않으며 특정 파티션에 대해 실행 구성이 불가능하다는 것입니다. 우리가 ETL 파이프라인에 대해 예전에 채택한 방식은 멱등 스크립트가 여러 번 다시 실행할 수 있는 횟수에 제한이 없는 것이었습니다. 과거 데이터에 문제가 발생하면 특정 파티션을 다시 생성할 수 있었고, 스크립트가 멱등성을 가졌기 때문에 특정한 날짜를 여러 번 실행해도 문제가 발생하지 않았습니다. 하지만 점진적 모델은 데이터의 특정 파티션을 다시 실행할 수 있는 능력이 없으며, 대신 모든 데이터를 스트림처럼 처리하여 보지 않은 데이터만을 로드합니다. 다시 말해 특정 규칙을 충족하는 데이터를 로드하는 것이죠.

우리가 Airflow라는 스케줄링 도구를 사용하고 있기 때문에 데이터 파이프라인은 어떤 종류의 시간적 분할과 일치해야 합니다. 시간별, 일별, 주별, 월별 등 다양한 분할 방식이 될 수 있지만 중요한 점은 Airflow가 어떤 일정에 따라 실행되고 있다는 것입니다. 만약 과거 Airflow 작업을 다시 실행한다면 해당 작업을 호출할 때 해당하는 시간적 파티션에 맞게 실행되기를 기대하지만, 점진적 모델은 항상 앞으로만 '보기' 때문에 과거의 파티션에 대해 구성되지 않습니다. 이것은 Airflow에서 작업을 실행할 때 예상하는 것과는 다릅니다.

하루마다 실행되는 2개의 Airflow DAG를 고려해보죠. 하나의 DAG는 매개변수로 날짜를 사용하여 해당 파티션만 실행하는 작업을 가지고 있습니다. 다른 DAG는 점진적 모델을 사용하며 실행할 때 보지 않은 데이터를 처리합니다. 둘 다 정상적으로 실행될 때 이전에 보지 못한 일별 데이터를 처리하게 되며 두 DAG는 동일하게 동작합니다. 하지만 문제가 발생하여 특정 날짜인 2024년 1월 1일을 다시 로드해야 할 때는 어떨까요? 파티션화된 DAG는 예상대로동작하여 2024년 1월 1일을 다시 실행할 것이지만, 점진적 모델은 Airflow에 전달되는 날짜와 관계없이 이전에 본 적 없는 데이터만을 로드할 것입니다.

점진적 모델의 한계에 대해 논평한 댓글에서는:

<div class="content-ad"></div>

간단히 말하면 - Airflow와 같은 일정 관리 도구를 사용할 때 시간 분할을 기대하는 경우, 점진적 모델이 잘 작동하지 않습니다.

# 해결책

해결책은 간단합니다 - DBT 변수를 사용할 수 있습니다. 또한 점진적 모델의 기능을 완전히 포기할 필요가 없습니다. 하나 이상의 변수를 추가하여 하나 이상의 분할에 명시적으로 실행할 수 있습니다:

```js
{- set target_date = var("target_date", "") }
{
 config(
 materialized="incremental",
 unique_key=["transaction_id"],
 incremental_strategy="delete+insert",
 )
}
select
 transaction_id,
 transaction_date,
 user_id,
 store_name_description,
 transaction_amount
from { ref('external_table_transaction') }
{- if target_date != "" }
 where transaction_date = '{ target_date }'
{- else }
 {- if is_incremental() }
 where transaction_date = (select max(transaction_date) + 1 as next_date from { this })
 {- endif }
{- endif }
```

<div class="content-ad"></div>

이것은 DBT 모델에 `target_date`라는 새 매개변수를 추가합니다. `target_date`가 정의되지 않은 경우 모델은 증분 동작으로 실행되지만, 변수가 전달된 경우 지정된 파티션에 대해 실행됩니다. 이 모델 구조화 방식은 Airflow에서 호출될 때 훨씬 더 잘 작동합니다.

게다가, 이 모델은 이제 멱등성이 생겼습니다. 즉, 원본 데이터가 동일한 경우 동일한 쿼리와 매개변수로 실행하고 동일한 결과를 얻을 수 있습니다. 반면 증분 모델의 경우 로드된 데이터는 테이블 내용 및 상위 스트림에서 발생한 변경 내용에 따라 달라집니다.

이 솔루션은 병렬, 증분 및 파티션화의 3가지 모드를 효과적으로 제공합니다. 따라서 Airflow와 DBT의 의도된 증분 전략과 잘 어울리며 이를 사용할 경우 잘 작동합니다. 아래와 같이 인수 없이 DBT를 실행하면 증분 모델을 사용할 것입니다:

```js
dbt run --select my_model
```

<div class="content-ad"></div>

명시적으로 새로 고침을 실행하면 대량 적재가 발생합니다:

```js
dbt run --select my_model --full-refresh
```

그리고 추가한 target_date 매개변수를 전달하면 특정 파티션에 대해서만 실행되도록 할 수 있습니다:

```js
dbt run --select my_model  --vars "{target_date : '2024-01-01'}"
```

<div class="content-ad"></div>

이제 Airflow가 전달되는 날짜 매개변수를 제어할 수 있는 명령으로 돌아왔어요. 이렇게 하면 훨씬 더 부드러운 통합이 가능해요!

# 참고 자료

이 문제를 연구하는 데 사용된 다음 문서들입니다:

DBT — 증분성의 한계에 대해
Medium — DBT와 Airflow를 사용한 멱등데이터 파이프라인

<div class="content-ad"></div>

# Nowcast의 엔지니어링

만약 DBT에서 데이터 파이프라인을 구축하는 방법에 대해 알고 싶으면 아래 링크를 사용하여 친목을 돈 미팅을 예약해보세요. '문의 사항'란에 'Todd와 이야기하고 싶어요'라고 작성해주세요.

Nowcast는 현재 데이터 엔지니어를 채용 중입니다! 관심이 있으시면 [여기에서 지원하세요](application_link).
