---
title: "GA4 BigQuery Export 스키마와 구조 이해하기"
description: ""
coverImage: "/assets/img/2024-06-22-UnderstandingtheGA4BigQueryExportSchemaandStructure_0.png"
date: 2024-06-22 17:28
ogImage: 
  url: /assets/img/2024-06-22-UnderstandingtheGA4BigQueryExportSchemaandStructure_0.png
tag: Tech
originalTitle: "Understanding the GA4 BigQuery Export Schema and Structure"
link: "https://medium.com/towards-data-science/understanding-the-ga4-bigquery-export-schema-and-structure-3a068ebee4ea"
---


![GA4 BigQuery Export Schema](/assets/img/2024-06-22-UnderstandingtheGA4BigQueryExportSchemaandStructure_0.png)

# 소개

현재 전 세계적으로 15.6 백만 개의 웹 사이트에서 사용 중인 Google Analytics 4는 글로벌 데이터 스키마 중 가장 널리 내보내어진 것 중 하나일 수 있습니다. Google Analytics 4 데이터는 웹 사용자 인터페이스를 통해 액세스하거나 Looker Studio로 API를 통해 직접 접근할 수 있지만, 데이터 소유권을 유지하고자 한다면:
   
- 구글의 데이터 보유 정책을 넘어서 데이터 소유권을 보유하려면
- 데이터 손실 가능성을 방지하기 위해 데이터를 보관하려면
- 다른 내부 데이터 소스와 데이터를 결합하려면
- 외부 소스, API 또는 LLM에서 데이터를 확장하려면
- 사용자 정의 자동화 워크플로우를 구축하려면

<div class="content-ad"></div>

그러면 GA4 내보내기를 빅쿼리로 활성화하는 것이 권장되는 접근 방식입니다. 설정 및 구성하기 매우 간단합니다.

좋아요! 작업 완료!

하지만 아직 끝난 게 아닙니다. 매일 빅쿼리 내보내기에 데이터가 나타나기 시작하면 구조가 다소 불규칙하다는 것을 알 수 있을 것입니다. 이는 직접 작업하기 매우 어려워지므로 데이터를 더 쉽게 활용할 수 있는 형식으로 정확하게 변환하는 방법에 대해 설명하는 이 문서를 통해 '하이브리드' 데이터 구조에 대해 설명하고 데이터에 접근하는 방법을 설명합니다. 이는 사용 사례에 적합한 형식으로 변환합니다.

# 조사

<div class="content-ad"></div>

다음 스키마 요약과 쿼리에서 events_YYYYMMDD는 BigQuery의 Date-Sharded GA4 Export Table을 나타냅니다. 아래와 같은 구문 변형을 사용하여 쿼리할 수 있습니다.

모든 데이터 선택

```js
SELECT *
FROM [project_id].[ga4_dataset_name].events_*
```

날짜 범위 선택

<div class="content-ad"></div>

```js
# 예: 지난 7일간의 데이터 선택

SELECT *
FROM [project_id].[ga4_dataset_name].events_*
WHERE _TABLE_SUFFIX
BETWEEN FORMAT_DATE("%Y%m%d", CURRENT_DATE - 7)
AND FORMAT_DATE("%Y%m%d", CURRENT_DATE))
```

## GA4 내보내기 스키마

GA4 내보내기의 구조는 표준화되어 있으며 다음 상위 수준 스키마로 나타낼 수 있습니다:

```js
events_YYYYMMDD
    ├── event_date STRING   
    ├── event_timestamp INTEGER 
    ├── event_name STRING   
    ├── event_params ARRAY<STRUCT>  
    ├── event_previous_timestamp INTEGER    
    ├── event_value_in_usd FLOAT    
    ├── event_bundle_sequence_id INTEGER    
    ├── event_server_timestamp_offset INTEGER   
    ├── user_id STRING  
    ├── user_pseudo_id STRING   
    ├── privacy_info STRUCT 
    ├── user_properties ARRAY<STRUCT>   
    ├── user_first_touch_timestamp INTEGER  
    ├── user_ltv STRUCT 
    ├── device STRUCT   
    ├── geo STRUCT  
    ├── app_info STRUCT 
    ├── traffic_source STRUCT   
    ├── stream_id STRING    
    ├── platform STRING 
    ├── event_dimensions STRUCT 
    ├── ecommerce STRUCT    
    ├── items ARRAY<STRUCT> 
    ├── collected_traffic_source STRUCT 
    └── is_active_user BOOLEAN
```

<div class="content-ad"></div>

일부 다른 열 데이터 유형이 있으므로 데이터 원본을 쿼리, 분석 및 후속 데이터 워크플로에 대비하도록 준비하는데 다른 처리가 필요합니다.

## 간단한 데이터 유형

이 하위 집합의 열은 각 행마다 열 당 하나의 연결된 값이 있어 각 열에 대해 특정 데이터 유형이 강제로 적용되는 의미에서 '간단한'으로 간주할 수 있습니다.

```js
events_YYYYMMDD
    ├── event_date STRING   
    ├── event_timestamp INTEGER 
    ├── event_name STRING   
    ├── event_previous_timestamp INTEGER    
    ├── event_value_in_usd FLOAT    
    ├── event_bundle_sequence_id INTEGER    
    ├── event_server_timestamp_offset INTEGER   
    ├── user_id STRING  
    ├── user_pseudo_id STRING   
    ├── user_first_touch_timestamp INTEGER  
    ├── stream_id STRING    
    ├── platform STRING 
    └── is_active_user BOOLEAN
```

<div class="content-ad"></div>

DATE 및 TIMESTAMP 필드 중 일부는 일부 유형 변환을 필요로 합니다. 이에 필요한 함수는 다음 기사에 포함되어 있습니다. 그러나 이러한 열은 SQL에서 쉽게 작업할 수 있습니다.

간단한 STRUCT 데이터 유형

다음 하위 집합 열은 모두 STRUCT 데이터 유형입니다. 이는 JSON 또는 JavaScript의 개체에 대응하는 구조, Python의 사전 또는 연관 배열로 일반화할 수 있는 구조입니다:

```js
events_YYYYMMDD
    ├── privacy_info STRUCT 
    ├── user_ltv STRUCT 
    ├── device STRUCT   
    ├── geo STRUCT  
    ├── app_info STRUCT 
    ├── traffic_source STRUCT   
    ├── event_dimensions STRUCT 
    ├── ecommerce STRUCT   
    └── collected_traffic_source STRUCT
```

<div class="content-ad"></div>

빅쿼리에서 STRUCT 열은 하위 열의 컨테이너로 간주될 수 있으며, 쿼리 간결성 측면에서 일부 이점을 가지지만 몇 가지 추가적인 도전 과제를 도입하기도 합니다. 위에 나열된 STRUCT 열은 '간단한' 것으로 간주됩니다. 왜냐하면 '간단한' 데이터 유형(즉, ARRAY, STRUCT 또는 JSON 하위 열이 없는)만 포함하고 있기 때문입니다.

예를 들어, geo STRUCT 열에는 이벤트 원점의 감지된 위치를 나타내는 다음과 같은 간단한 STRING 하위 열이 포함되어 있습니다:

```js
events_YYYYMMDD
└── geo STRUCT 
    ├── city STRING 
    ├── country STRING 
    ├── continent STRING 
    ├── region STRING 
    ├── sub_continent STRING 
    └── metro STRING 
```

간단한 STRUCT 하위 열 값은 점 표기법을 사용하여 깔끔하게 액세스할 수 있습니다.

<div class="content-ad"></div>

```js
-- events_YYYYMMDD 테이블에서 geo.city를 선택합니다.

SELECT geo.city
FROM events_YYYYMMDD
```

예시에서 도시 이름을 수정된 컬럼 이름으로 불러올 것이며, 이는 STRUCT 접두어 없이 불러온 것입니다 (예시에서는 city). 구조체 데이터 구조를 유지하기 위해, 다음 구문을 사용하여 명시적으로 포함할 하위 컬럼을 설정할 수 있습니다:

```js
-- events_YYYYMMDD 테이블에서 geo.country, geo.region, geo.city를 선택하며, geo라는 이름으로 결과를 반환합니다.

SELECT 
STRUCT (
geo.country,
geo.region,
geo.city) AS geo
FROM events_YYYYMMDD
```

전체 STRUCT를 포함하거나 제외하는 것도 간단합니다. 전체 STRUCT를 포함하려면, 간단히 해당 STRUCT 열을 SQL 쿼리에서 다른 열처럼 선택하면 됩니다:

<div class="content-ad"></div>

```js
SELECT geo
FROM events_YYYYMMDD
```

특정 STRUCT 열 (및 모든 하위 열)을 제외하고 다른 모든 열을 포함하려면 EXCEPT 구문을 사용합니다:

```js
SELECT *
EXCEPT (geo)
FROM events_YYYYMMDD
```

STRUCT에서 특정 하위 열을 제외하는 구문은 조금 더 길고 직관적이지 않습니다:

<div class="content-ad"></div>

```sql
SELECT 
(SELECT AS STRUCT geo.* EXCEPT(continent, sub_continent, metro)) AS geo
FROM events_YYYYMMDD
```

Looker Studio에서 STRUCT 데이터 유형을 지원하지만 다른 비즈니스 인텔리전스 도구에서 문제를 일으킬 수 있으므로 데이터 통합을 지원하기 위해 열 이름 변경이 필요할 수 있습니다.

복잡한 ARRAY`STRUCT` 데이터 유형

이 데이터 구조는 각 배열의 STRUCT 데이터 유형을 저장하기 위해 사용되며, 배열에 포함된 각 STRUCT가 동일한 구조를 갖습니다. 데이터를 모델링하는 방법은 특정 컨텍스트에 따라 달라집니다. GA4 BigQuery 내보내기에서 다음 ARRAY`STRUCT` 열이 발견됩니다:


<div class="content-ad"></div>


events_YYYYMMDD
    ├── event_params ARRAY<STRUCT>  
    ├── user_properties ARRAY<STRUCT>     
    └── items ARRAY<STRUCT>


event_params ARRAY`STRUCT`에는 GA4에서 설정한 표준 및 사용자 지정 이벤트 매개변수 배열이 포함되어 있습니다. user_properties ARRAY`STRUCT`에는 사용자 지정 사용자 속성 배열이 들어 있으며, items ARRAY`STRUCT`에는 사용자 정의 항목 및 메타데이터의 배열과 연결된 항목 매개변수의 다른 중첩 배열이 포함되어 있습니다.

이전 예제보다 더 복잡하며, STRUCT 스키마를 살펴보면 현실이 더 복잡하다는 것이 빠르게 명확해집니다. 예를 들어, event_params ARRAY`STRUCT` 스키마는 다음과 같습니다:


events_YYYYMMDD
└── event_params STRUCT
    ├── key STRING 
    └── value STRUCT
        ├── string_value STRING 
        ├── int_value INTEGER 
        ├── float_value FLOAT 
        └── double_value FLOAT


<div class="content-ad"></div>

구글 애널리틱스 4 속성에 이벤트 매개변수가 추가되면 이들은 BigQuery로 간단한 STRUCT 형식으로 들어오지 않습니다. 따라서 이들은 BigQuery Studio의 스키마 탭에서 보이지 않고 점 표기법을 통해서도 접근할 수 없습니다.

예를 들어 session_engaged 매개변수는 사용자 배포가 필요 없이 구글에서 생성한 표준 이벤트 매개변수로, 각 특정 이벤트가 참여 세션의 일부인지 여부를 결정할 수 있게 합니다.

만약 event_params STRUCT가 다음과 같은 스키마를 가지고 있다면, session_engaged의 값은 점 표기법을 통해 접근할 수 있을 것입니다 (예: SELECT event_params.session_engaged FROM events_YYYYMMDD):

```js
events_YYYYMMDD
└── event_params STRUCT
    ├── ga_session_id INTEGER 
    └── ...
```

<div class="content-ad"></div>

그러나 실제 스키마를 고려할 때, session_engaged 값은 다음 SQL 구문을 사용하여 액세스됩니다:

```js
SELECT 
(SELECT value.int_value FROM UNNEST(event_params) WHERE key='session_engaged') AS `session_engaged`
FROM events_YYYYMMDD
```

구문적으로 더 복잡하지만, 이 구문을 사용해야 하는 요구 사항은 추가적인 문제를 야기합니다: 찾고 있는 키의 정확한 이름을 알아야 하고, 예상 데이터 유형도 알아야 합니다. 이는 값 STRUCT가 네 가지 서로 다른 하위 열을 포함하고 있으며, 이 중 하나는 NULL 값이 아니어야 하며 나머지 세 개는 NULL 값이어야 합니다. 이 경우 INT64로 값이 예상되므로 해당 값을 추출합니다.

이 복잡성을 이해하는 것은 이 데이터를 재구성하기 위한 전략을 개발할 때 중요합니다: 데이터의 특정 예상 특성을 알아야만 재구성할 수 있습니다.

<div class="content-ad"></div>

이 지식을 얻기 위한 계획이 서로 다른 변형 및 자동화 전략으로 향하는 근본적인 동력입니다.

## 가정

또한 원본 데이터에 대한 우리의 가정과 해당 가정 중 하나라도 잘못된 것으로 판명되었을 경우의 결과를 이해해야 합니다.

데이터 형식 일관성

<div class="content-ad"></div>

위의 예에서는 session_engaged가 정수 값일 것이라고 가정하고, 해당 값을 추출하는 쿼리는 정수 값을 추출합니다. 그러나 이전에 역사적 불일치가 있었고 관측된 값이 STRING에서 INTEGER로 변경되었을 경우, 위의 쿼리는 일부 데이터를 소실하지만 조용히 처리될 것입니다. 데이터를 기반으로 한 보고서는 부정확해질 것이지만 하류 사용자는 이를 알 수 없을 것입니다.

BigQuery의 GA4 데이터는 Google에서 설명한 이유로 GA4 사용자 인터페이스나 GA4 API에서 관측된 데이터와 일치하지 않을 것으로 예상됩니다. 비교할 기준이 없는 상황에서 보니 작아 보이는 테스트되지 않은 가정이 검출되지 않은 잘못된 결과로 쉽게 이어질 수 있음을 의미합니다.

session_engaged 이벤트 매개 변수는 때때로 STRING 값으로 관측되기도 하고, 때로는 INTEGER 값으로 관측되기도 합니다. 따라서 소스 데이터에서 신뢰할 수 있게 이를 추출하려면 아래 쿼리와 같이 보다 고급 전략이 필요합니다:

```js
SELECT 
(SELECT COALESCE(value.int_value, SAFE_CAST(value.int_value AS INT64) FROM UNNEST(event_params) WHERE key='session_engaged') AS `session_engaged`
FROM events_YYYYMMDD
```

<div class="content-ad"></div>

주의하세요! COALESCE는 비용이 많이 소요되는 작업이기 때문에 이 방법을 많은 이벤트 매개변수에 적용하면 쿼리가 리소스 부족으로 실패할 수 있습니다.

고유키

또한 위의 예시들은 각 키가 배열 `STRUCT` 내에서 고유하다고 가정하므로 SELECT… FROM UNNEST… 쿼리는 정확히 한 행을 반환할 것으로 예상됩니다. 이는 상위 시스템에서 강제되는 올바른 가정인 것으로 보입니다. 그러나 BigQuery에서 강제되는 제약 조건은 아닙니다.

이는 미래에 한 행 내에서 이벤트 매개변수 키가 고유하지 않다는 것이 밝혀지면, 해당 값을 추출하는 데 사용된 서브쿼리는 단일 행 대신 여러 행을 반환하고 쿼리는 다음 오류와 함께 실패합니다:

<div class="content-ad"></div>

```js
쿼리 오류: Scalar subquery는 하나 이상의 요소를 생성함

single row event_param 내에서 중복 키의 존재가 관찰되지 않았지만, 미래에 이러한 사례가 발생할 가능성이 있는 BigQuery의 기술적 제약은 없습니다. 즉, 앞으로 아무것도 변하지 않을 것을 가정할 수도 있고, 코드에서 잠재적인 변화에 대비할 수도 있습니다.

# 결론

문제는 당신이 아닌 데이터 구조입니다.
```

<div class="content-ad"></div>

## 데이터 구조

본질적으로 BigQuery는 행, 열 및 데이터 조작을 위해 사용되는 SQL 기반 작업을 가진 관계형 데이터베이스로 구성됩니다. BigQuery는 INFORMATION_SCHEMA.COLUMNS를 통해 열 수준의 메타데이터를 사용할 수 있으며 BigQuery Studio 사용자 인터페이스에도 사용할 수 있습니다. 일반적으로 이러한 정보 중 하나를 검사함으로써 데이터 구조를 이해할 수 있습니다.

복잡한 데이터 유형(배열, 구조)의 포함은 약간의 복잡성을 추가하지만 사용자 인터페이스와 INFORMATION_SCHEMA(둘 다 COLUMNS 및 COLUMN_FIELD_PATHS)에도 열 및 하위 열 메타데이터가 사용 가능하기 때문에 검사 및 자동화 사용 사례를 충족시킬 수 있습니다.

그러나 배열`구조`열 내 여러 중첩 키-값 구조의 복잡한 구현으로 인해 데이터의 의미 구조를 메타데이터를 통해 이해하는 능력을 상실하므로 전형적인 관계 구조가 아닙니다.

<div class="content-ad"></div>

기본적으로 event_params, user_properties 및 item_params 데이터 구조는 이 데이터 원본이 전형적인 관계형 구조가 아니라 관계형, 반정형 및 키-값 저장소 특성이 혼합된 구조임을 의미합니다. 이것은 복잡하며, 데이터의 내용이 변경될 때 (시간이 지남에 따라 예상대로), 아래쪽 모델에서 이 데이터를 포착하기 위해 출력 데이터의 스키마를 변경해야 합니다.

즉, 하류 모델에서 데이터를 사용할 수 있도록 데이터를 준비하는 데 사용된 접근 방식은 이 예상된 스키마 진화를 고려해야 합니다.

## 접근 방식

이 복잡한 소스 데이터를 후속 사용을 위해 다시 구조화하는 몇 가지 접근 방식이 있습니다. 이 단계에서는 데이터 변환 로직을 고려하고 있으며, 데이터 변환을 트리거하거나 실행하는 데 사용된 접근 방식이 아닙니다.

<div class="content-ad"></div>

변환 코드는 다음과 같이 가능합니다:

- 수동으로 제작되어서는 수동 검사와 시행착오가 필요합니다;
- 다양한 GA4-BigQuery 인터넷 자료에서 수동으로 조정되었습니다;
- AI로 생성되었지만 (일반적으로 좋은 아이디어는 아닙니다... 정확한지 어떻게 알 수 있을까요? SQL을 배우세요!);
- Dataform이나 DBT와 같은 변환 도구에 내장된 모델을 사용하여 생성된 구성 요소;
- 관측 데이터를 기반으로 변환 논리를 구축하는 자동화 방법.

다음 기사에서는 위에 설명된 접근 방식을 사용하여 GA4 BigQuery 모델링 과제를 해결하는 다양한 옵션을 탐색할 것입니다.

## 다음 단계

<div class="content-ad"></div>

문제를 식별하고 상세히 탐색하는 것은 문제를 해결하는 것과 같지 않다는 것을 기억해주세요!

그러나 이 기사의 목적은 당신이 이 데이터셋을 다뤄야 했을 때 느낄 수 있는 'why?!' (또는 더 정확히는 'wtf?!')를 개략적으로 설명하고, 수많은 도전에 대처할 때 고려해야 하는 다양한 고려 사항을 논의하는 것입니다.

이 시리즈의 다음 기사는 현재 존재하는 다양한 실용적 옵션을 탐험하며, 그 비용, 노력, 기술/기술 요구 사항 및 제한 사항에 대해 다룰 것입니다.

다음 내용을 받아보려면 저를 팔로우해주세요!

<div class="content-ad"></div>

## 스키마 참조

참고를 위해 전체 소스 데이터 스키마를 아래에 재현하고 있습니다. 편집 가능한 형식은 다음과 같습니다.

```js
events_YYYYMMDD
├── event_date STRING
├── event_timestamp INTEGER
├── event_name STRING
├── event_params ARRAY<STRUCT>
│   ├── key STRING
│   └── value STRUCT
│       ├── string_value STRING
│       ├── int_value INTEGER
│       ├── float_value FLOAT
│       └── double_value FLOAT
├── event_previous_timestamp INTEGER
├── event_value_in_usd FLOAT
├── event_bundle_sequence_id INTEGER
├── event_server_timestamp_offset INTEGER
├── user_id STRING
├── user_pseudo_id STRING
├── privacy_info STRUCT
│   ├── analytics_storage STRING
│   ├── ads_storage STRING
│   └── uses_transient_token STRING
├── user_properties ARRAY<STRUCT>
│   ├── key STRING
│   └── value STRUCT
│       ├── string_value STRING
│       ├── int_value INTEGER
│       ├── float_value FLOAT
│       ├── double_value FLOAT
│       └── set_timestamp_micros INTEGER
├── user_first_touch_timestamp INTEGER
├── user_ltv STRUCT
│   ├── revenue FLOAT
│   └── currency STRING
├── device STRUCT
│   ├── category STRING
│   ├── mobile_brand_name STRING
│   ├── mobile_model_name STRING
│   ├── mobile_marketing_name STRING
│   ├── mobile_os_hardware_model STRING
│   ├── operating_system STRING
│   ├── operating_system_version STRING
│   ├── vendor_id STRING
│   ├── advertising_id STRING
│   ├── language STRING
│   ├── is_limited_ad_tracking STRING
│   ├── time_zone_offset_seconds INTEGER
│   ├── browser STRING
│   ├── browser_version STRING
│   └── web_info STRUCT
│       ├── browser STRING
│       ├── browser_version STRING
│       └── hostname STRING
├── geo STRUCT
│   ├── city STRING
│   ├── country STRING
│   ├── continent STRING
│   ├── region STRING
│   ├── sub_continent STRING
│   └── metro STRING
├── app_info STRUCT
│   ├── id STRING
│   ├── version STRING
│   ├── install_store STRING
│   ├── firebase_app_id STRING
│   └── install_source STRING
├── traffic_source STRUCT
│   ├── name STRING
│   ├── medium STRING
│   └── source STRING
├── stream_id STRING
├── platform STRING
├── event_dimensions STRUCT
│   └── hostname STRING
├── ecommerce STRUCT
│   ├── total_item_quantity INTEGER
│   ├── purchase_revenue_in_usd FLOAT
│   ├── purchase_revenue FLOAT
│   ├── refund_value_in_usd FLOAT
│   ├── refund_value FLOAT
│   ├── shipping_value_in_usd FLOAT
│   ├── shipping_value FLOAT
│   ├── tax_value_in_usd FLOAT
│   ├── tax_value FLOAT
│   ├── unique_items INTEGER
│   └── transaction_id STRING
├── items ARRAY<STRUCT>
│   ├── item_id STRING
│   ├── item_name STRING
│   ├── item_brand STRING
│   ├── item_variant STRING
│   ├── item_category STRING
│   ├── item_category2 STRING
│   ├── item_category3 STRING
│   ├── item_category4 STRING
│   ├── item_category5 STRING
│   ├── price_in_usd FLOAT
│   ├── price FLOAT
│   ├── quantity INTEGER
│   ├── item_revenue_in_usd FLOAT
│   ├── item_revenue FLOAT
│   ├── item_refund_in_usd FLOAT
│   ├── item_refund FLOAT
│   ├── coupon STRING
│   ├── affiliation STRING
│   ├── location_id STRING
│   ├── item_list_id STRING
│   ├── item_list_name STRING
│   ├── item_list_index STRING
│   ├── promotion_id STRING
│   ├── promotion_name STRING
│   ├── creative_name STRING
│   ├── creative_slot STRING
│   └── item_params ARRAY<STRUCT>
│       ├── key STRING
│       └── value STRUCT
│           ├── string_value STRING
│           ├── int_value INTEGER
│           ├── float_value FLOAT
│           └── double_value FLOAT
├── collected_traffic_source STRUCT
│   ├── manual_campaign_id STRING
│   ├── manual_campaign_name STRING
│   ├── manual_source STRING
│   ├── manual_medium STRING
│   ├── manual_term STRING
│   ├── manual_content STRING
│   ├── gclid STRING
│   ├── dclid STRING
│   └── srsltid STRING
└── is_active_user BOOLEAN 
```