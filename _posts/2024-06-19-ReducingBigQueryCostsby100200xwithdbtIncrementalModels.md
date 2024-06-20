---
title: "BigQuery 비용을 dbt 증분 모델로 100-200배 절감하기"
description: ""
coverImage: "/assets/img/2024-06-19-ReducingBigQueryCostsby100200xwithdbtIncrementalModels_0.png"
date: 2024-06-19 16:23
ogImage: 
  url: /assets/img/2024-06-19-ReducingBigQueryCostsby100200xwithdbtIncrementalModels_0.png
tag: Tech
originalTitle: "Reducing BigQuery Costs by 100–200x with dbt Incremental Models"
link: "https://medium.com/stackademic/reducing-bigquery-costs-by-100-200x-with-dbt-incremental-models-c4375b945b69"
---


템퍼스(Temporus)에서 제 팀이 다루는 많은 모델은 크지만 "빅 데이터" 수준은 아닙니다. 보통 우리의 테이블은 수억 행 정도를 갖고 있으며, 가끔 10억 행을 넘기기도 하지만 성능에 대해 걱정할 만큼 자주 발생하지는 않습니다. 그러나 최근에 쿼리 중 하나가 2시간 후에 타임 아웃되었고, 한 테이블이 각 실행에 거의 9,000 슬롯 시간을 사용하고 있다는 것을 깨달았습니다.

결국 데이터 로드 접근 방식을 변경하여 슬롯 사용량을 8,970시간에서 1.4시간으로 줄였습니다. 앞으로 몇 달 동안 다른 데이터 마트에서도 높은 성능의 점진적 모델을 전개할 예정입니다. 아래에서는 발생한 문제와 그 해결 방법에 대해 설명하겠습니다.

제 팀이 다루는 대부분의 데이터는 구조화되지 않은 텍스트입니다. 해당 텍스트를 분류하기 위해 알고리즘을 실행하면 구조화되지 않은 텍스트의 하나의 항목이 이름이 지정된 entity(개체)의 수십 행으로 팽창될 수 있습니다.

여러 해 동안 소스 데이터가 빅 데이터에서 Big Data로 커졌습니다. 수십억 건의 구조화되지 않은 텍스트 페이지와 그 결과로 더 많은 행의 테이블 데이터가 포함되어 있습니다. 우리가 많은 양의 데이터를 생성하고 있기 때문에, dbt에서 일반적으로 사용하는 완전 갱신(full-refresh) 방식에서 벗어나 점진적인 방식을 활용해야 한다고 가정했었으나, 그로 인한 결과를 고려하지 않았습니다.

<div class="content-ad"></div>

우리가 dbt 제한 시간인 2시간을 초과하면서, 우리는 원시 예측 이후의 테이블을 완전히 잘라내고 로드하는 현재 방식을 다시 검토해야 했습니다.

# 문제 해결 진단

우리의 테이블을 생성하는 SQL 쿼리는 절대 효율적이 아니었습니다 — 문제가 심각해지기 전까지는 그것을 깨닫지 못했습니다. 하지만 어떤 부분이 비효율적이었을까요? 쿼리를 수정함으로써 성능을 개선할 수 있을까요? 아니면 우리 전체 접근법을 바꿔야 했을까요?

아래는 우리가 실행하던 쿼리의 단순화된 버전입니다 —

<div class="content-ad"></div>

```js
{
  config(
    alias="ner_model",
    cluster_by=["label"],
    materialized="incremental",
    schema="warehouse",
    unique_key=["attachment_id", "page_index", "ent_char_start"]
  )
}

WITH

lake AS (
  SELECT
    *
  FROM { source('lake', 'source_ner_predictions') }
  { if is_incremental() }
    WHERE _predicted_at > (SELECT MAX(_predicted_at) FROM { this } )
  { endif }
),

-- TMO 우선적 리터럴 형식을 위한 열 추가
SELECT distinct
  *
FROM lake
LEFT JOIN { ref('tmo') } AS tmo on tmo.key = lake.key
LEFT JOIN { ref('other_table') } AS cw on lake.id = cw.id
```

위 쿼리에서 지연에 기여할 수 있는 별도 요소들은 다음과 같습니다:

- 하나의 열에 Clustering.
- 세 개의 열에 Compound Unique Keys.
- DISTINCT 문.
- 다양한 JOIN 연산.
- WHERE 절 필터링이 있는 dbt is_incremental() 구문.

이 중 주요 원인으로 눈에 띄는 항목이 있기를 바라며, 이미 dbt의 incremental 기능을 사용 중이라면 왜 쿼리에 시간이 오래 걸릴 수 있는지 살펴봅시다. 각각이 지연에 기여할 수 있는 이유를 살펴봅시다.

<div class="content-ad"></div>

# 열 클러스터링

클러스터링은 특정 열을 기준으로 표 내에서 정렬하는 것을 말합니다. 클러스터링을 통해 스캔/필터링 작업의 성능을 향상시킬 수 있습니다. 그러나 데이터베이스가 쓰기 작업 중에 클러스터 순서를 유지해야 하기 때문에 스캔이 발생하고 데이터의 처리 속도가 느려집니다. BigQuery 클러스터링은 쓰기 작업을 느리게 만들지만 읽기 작업을 빠르게 합니다.

# 복합 고유 키 제약 조건

고유 키는 BigQuery에서 기본적으로 지원되지 않는 기능입니다. 그러나 증분 모델을 사용하는 경우 dbt를 사용하여 이를 구성할 수 있습니다. 이후 dbt는 고유 키에 따라 삽입을 통해 주 키 제약 조건을 효과적으로 적용하는 코드를 컴파일합니다. dbt/BigQuery에서 고유 키의 문제는 증분 로드 시 고유 키를 가진 모든 새로운 데이터를 기존 데이터의 고유 키와 비교하기 위해 전체 테이블 스캔을 수행한다는 점입니다. 전체 테이블 스캔 및 따라서 dbt의 고유 키 제약 조건은 비용이 많이 발생하며 실행 시간이 급격히 느려집니다.

<div class="content-ad"></div>

# DISTINCT 문

BigQuery의 DISTINCT 문은 각 열에 대해 GROUP BY를 실행하는 것보다 훨씬 빠릅니다. 그러나 기본적으로 똑같은 일을 수행합니다. 그러나 DISTINCT는 여전히 전체 테이블 스캔을 호출합니다. BigQuery에서 각 행이 고유하다/유일하다는 것을 어떻게 더 확실히 할 수 있을까요?

# 조인 및 WHERE 절

조인에는 전체 테이블 스캔이 필요하며 WHERE 절도 필요합니다. 이 부분은 조금 더 명백하며 아마도 대부분의 사람들이 처음에 찾을 곳입니다.

<div class="content-ad"></div>

우리는 WHERE 절이 is_incremental() 블록 안에 중첩되어 있기 때문에 쿼리가 효율적일 것으로 생각했어요. 이론적으로 BigQuery는 런타임에서 기존 테이블을 스캔하고 is_incremental() 블록에서 들어오는 새로운 데이터의 작은 하위 집합과 비교하게 될 거에요!

하지만 실제로는 이런 일이 벌어지고 있어요 —

![이미지](/assets/img/2024-06-19-ReducingBigQueryCostsby100200xwithdbtIncrementalModels_0.png)

쿼리의 다른 구성 요소 때문에 새로운 약 15백만 개의 행이 고유 키 절을 위반하는지 확인하기 위해 BigQuery가 거의 500억 개의 데이터 행을 계속 스캔하게 된 거예요. 새로운 접근 방식이 필요했답니다.

<div class="content-ad"></div>

# 문제 해결하기

성능에 영향을 미치는 조합을 찾기 위해 몇 가지 실험을 진행했지만,

최종적으로는 내 실험 중 어느 것도 최종 솔루션을 밝혀내지 못했어요 — 단지 약간의 힌트만 주었을 뿐이에요.

첫째, 우리의 실험은 파티션을 사용하는 것이 병합 작업을 돕는다는 점을 시사했습니다. 파티션을 사용하지 않은 실행의 성능이 느린 것을 볼 수 있었어요 (가장 오른쪽 및 상단 왼쪽 셀). 둘째, 데이터에서는 클러스터링이 성능을 저하시킬 수 있지만, 절대적으로 성능에 해를 끼치는 것은 아닌 것 같았어요. 마지막으로, BigQuery가 결정론적이지 않을 수 있다는 직관을 가졌는데, 여기서 일부 실행에서의 재현성 부족을 통해 그 대안을 확인했어요. 몇 가지 빠른 구글 검색 결과, LIMIT 절은 결정론적인 결과를 도출하지 않는다는 것을 알 수 있었고, 이것이 여기 일부 이상 현상을 설명해 줍니다.

<div class="content-ad"></div>

최종적으로 이러한 실험들은 우리 문제를 즉각적으로 해결할 수 있는 내용을 밝혀내지 않았어요. 우리가 의존할 수 있는 단 하나의 해결책은 없었죠.

문제에 대한 회고를 하며, 우리는 테이블의 모든 데이터가 고유해야 한다는 요구사항이 성능 저하의 주요 요인임을 깨달았어요. 우리는 그 요구사항을 의심한 적이 없었죠. 대신, 중복 데이터가 있을 것이라고 가정하고 제거해야 한다고 생각했어요.

그러나 근본적으로 BigQuery는 삽입/갱신/삭제 트랜잭션을 다루는 것에 적합하게 설계되지 않았어요. BigQuery는 대량 데이터에 대해 완전 갱신만 또는 추가만을 사용할 때 가장 잘 작동하는 OLAP 데이터 웨어하우스에요. DML 할당량 제한이 없어진 것은 2020년에 이루어진 일이었구요, 그 전까지는 24시간 동안 1,000개의 DML 문만 실행할 수 있었어요. 우리의 초기 설계는 BigQuery를 데이터 웨어하우스가 아닌 트랜잭션 데이터베이스처럼 취급한 것이었어요.

우리는 데이터 프로파일링을 수행했고, 중복 데이터가 발생한 것은 24시간 단위였음을 발견했어요. 그래서 우리는 전날 데이터를 수정할 필요가 없었고, 그 데이터를 스캔할 필요도 없었을지도 몰라요! 대부분의 경우, 우리는 unique_key라는 개념을 버리고, 대신에 가장 최신 데이터가 고유하다는 것을 확실히 하는 데 집중할 수 있었어요.

<div class="content-ad"></div>

# 솔루션 구현

우리의 솔루션은 세 가지 주요 구성 요소가 있었습니다:

- 타임스탬프를 기반으로 파티셔닝을 강제하는 것으로, 데이터의 각 날짜를 파티션에 저장했습니다. 이렇게 하면 최신 데이터 로드에만 집중하면 되므로 효율적입니다.
- dbt의 is_incremental() 매크로를 활용하여 최신 데이터만 가져오도록 합니다.
- 전체 테이블 스캔을 유발하는 요소를 제거하고, 작업 중인 특정 파티션에 대해 스캔을 집중합니다.

그 결과는 다음과 같았습니다 —

<div class="content-ad"></div>

```js
{
  config(
    cluster_by=["label"],
    materialized="incremental",
    partition_by={
        "field": "_rwde_predicted_at",
        "data_type": "timestamp",
        "granularity": "day"
    },
    incremental_strategy = 'insert_overwrite'
  )
}

lake_base AS (
  SELECT
    primary_key,
    other_columns,
    MAX(_rwde_predicted_at) OVER (PARTITION BY primary_key) as _rwde_predicted_at
  FROM { source('lake', 'ner_model') }
  { if is_incremental() }
      WHERE _rwde_predicted_at > (select max(_rwde_predicted_at) from {this})
  { endif }
)

SELECT DISTINCT * from lake_base
```

여기 중요한 구성 요소가 있습니다:

- 클러스터링 — 여전히 downstream 중요성을 향상시키는 라벨이라는 컬럼을 기준으로 클러스터링을 원합니다. 기억하세요, 클러스터링은 쓰기 및 삽입 작업에는 성능에 악영향을 미치지만 읽기 작업에는 큰 도움이 됩니다. 새로운 증분 접근 방식을 사용하여 처리되는 데이터 양을 줄였기 때문에 이제 런타임을 크게 늦출 필요 없이 클러스터화 할 수 있습니다.
- 분할 — 일별로 분할함으로써 예측값을 매일 다른 테이블로 분리하게 됩니다. 테이블을 분할하고 dbt에 기본으로 내장된 is_incremental() 플래그를 사용하여 dbt가 작은 데이터 서브셋만 읽고 스캔하도록 강제할 수 있으며 이전 데이터를 다시 처리하지 않을 수 있습니다.
- 증분 전략 — dbt에는 여기 및 여기에 증분 전략에 대한 훌륭한 문서가 있지만 insert_overwrite를 선택함으로써 전체 파티션을 교체하여기존 파티션에 스캔 및 병합하지 않도록 합니다.

참고: 매일 데이터를 한 번만 가져오고 따라서 매일 예측값을 생성하는 것입니다. dbt labs의 Jerco가 가르쳐준 것처럼 —

<div class="content-ad"></div>

인크리멘탈 전략은 구현하기 전에 면밀히 검토하는 것이 중요합니다. 아래 다이어그램은 insert_overwrite 전략이 무엇을 하는지 보여줍니다 —

![이미지](/assets/img/2024-06-19-ReducingBigQueryCostsby100200xwithdbtIncrementalModels_1.png)

위 코드를 구현하면 이 특정 테이블의 BigQuery 스캔 시간이 32,295,356,894 ms (8,970 슬롯 시간)에서 5,024,974 ms (1.4 슬롯 시간)으로 줄어듭니다!!

# 결론

<div class="content-ad"></div>

빅쿼리 비용은 슬롯 사용량을 기준으로 계산됩니다. 이는 일반적으로 쿼리 실행 시간과 밀접한 관련이 있습니다. 여기에는 일부 쿼리가 병렬 처리되어 더 많은 슬롯 시간을 사용할 수 있는 경우가 있는데요. 1시간 쿼리가 30분 쿼리보다 비싼 것은 아니지만, 대부분의 경우 그렇습니다.

빅쿼리의 사용 방식으로 인해 매일 테이블을 스캔하여 변경된 행이나 추가된 행을 확인하는 것보다 전체 데이터를 삭제한 후 다시 로드하는 것이 훨씬 저렴할 수 있습니다. 이는 직감과 반대되는 방식일 수 있습니다. 새로운 데이터를 삽입하지 않더라도, 생성된 쿼리가 전체 테이블 스캔보다 성능이 우수하다면 해당 전체 테이블 스캔을 피해 비용을 절약할 수 있습니다.

우리의 경우, 비용을 줄일 것으로 가정하고 문제 모델을 점진적으로 전환했지만, 실제로는 전체 새로고침이 더 저렴했을 것입니다. 스캔을 최소화하면서 시간은 걸리지만, 비용은 더 저렴했을 것입니다. 그러나 우리의 새로운 접근 방식은 더 빠르고 저렴하기까지 합니다. 커피 한 잔 사는 것보다 더 나은 선택입니다.

빅쿼리 최적화에 더 관심이 있다면, 제가 작성한 이전 기사를 확인해보세요. 몇 가지 빠른 수정 사항을 강조하고 있습니다.

<div class="content-ad"></div>

# Stackademic

끝까지 읽어 주셔서 감사합니다. 가기 전에:

- 작가를 칭찬하고 팔로우해 주시면 감사하겠습니다! 👏
- 다음 계정을 팔로우해 주세요: X | LinkedIn | YouTube | Discord
- 다른 플랫폼도 방문해 주세요: In Plain English | CoFeed | Venture