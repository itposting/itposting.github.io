---
title: "LLM을 위한 의미론적 엔진을 어떻게 설계했나요 LLM 아키텍처를 위한 의미론적 레이어의 중추입니다"
description: ""
coverImage: "/assets/img/2024-06-19-HowwedesignoursemanticengineforLLMsThebackboneofthesemanticlayerforLLMarchitecture_0.png"
date: 2024-06-19 01:52
ogImage: 
  url: /assets/img/2024-06-19-HowwedesignoursemanticengineforLLMsThebackboneofthesemanticlayerforLLMarchitecture_0.png
tag: Tech
originalTitle: "How we design our semantic engine for LLMs? The backbone of the semantic layer for LLM architecture."
link: "https://medium.com/wrenai/how-we-design-our-semantic-engine-for-llms-84a00e6e3baa"
---


트렌드 AI 에이전트의 등장은 비즈니스 인텔리전스 및 데이터 관리 분야를 혁신적으로 변화시켰습니다. 가까운 미래에는 여러 AI 에이전트가 배포되어 데이터베이스와 데이터 웨어하우스에 저장된 방대한 내부 지식을 활용하고 해석할 것입니다. 이를 용이하게 하기 위해서는 의미론적 엔진이 필수적입니다. 이 엔진은 데이터 스키마를 관련 비즈니스 맥락에 매핑하여 AI 에이전트가 데이터의 기저 의미를 이해할 수 있도록 합니다. 비즈니스 맥락에 대한 구조화된 이해를 제공함으로써 의미론적 엔진은 AI 에이전트가 특정 비즈니스 요구에 맞는 정확한 SQL 쿼리를 생성하고 정확하고 맥락에 맞는 데이터 검색을 보장할 수 있도록합니다.

# LLMs가 데이터 구조와 어떤 문제를 가지고 있을까요?

AI 에이전트가 데이터베이스와 직접 대화할 수 있도록 하는 것입니다. 기술적으로는 자연어를 SQL로 변환하고 데이터베이스를 쿼리하기 위한 인터페이스를 제공합니다.

그러나 데이터베이스로부터 맥락을 가진 스키마를 매핑하는 일은 간단한 작업이 아닙니다. 스키마와 메타데이터를 단순히 저장하는 것만으로 충분하지 않습니다. 데이터를 이해하고 처리하는 데 더 심층적으로 파고들어야 합니다.

<div class="content-ad"></div>

## 의미론적 문맥의 부족

데이터베이스 상단에 직접 LLMs를 활성화하면, 데이터베이스에 이미 있는 DDL 정보를 활용하여 LLMs가 데이터베이스 구조와 유형을 학습하도록 할 수 있습니다. 또한 주어진 DDL을 기반으로 각 테이블과 열의 정의를 이해하는 데 도움을 줄 수 있는 제목과 설명을 추가할 수도 있습니다.

LLMs로부터 최적의 성능과 정확도를 얻으려면, 단순히 DDL과 스키마 정의만으로는 충분하지 않습니다. LLMs는 다양한 엔티티 간의 관계를 이해하고 조직 내에서 사용되는 계산 공식을 파악해야 합니다. 계산, 메트릭, 관계 (조인 경로)와 같은 추가 정보를 제공하여 LLMs가 이러한 측면을 이해하는 데 도움이 되도록 하는 것이 중요합니다.

## LLMs와 의미론적 인터페이스 정의의 부재

<div class="content-ad"></div>

이전 섹션에서 언급한 것처럼 LLM이 계산, 지표, 관계 등의 복잡성을 이해할 수 있는 의미론적 맥락이 중요합니다. 아래에서 우리가 직면한 주제들을 일반화할 정의가 필요합니다.

계산

미리 훈련된 LLM에는 각 용어에 대한 일정이 있으며, 각 회사가 자체 KPI 또는 공식을 정의하는 방식과는 다릅니다. 계산은 우리가 일반화할 정의를 제공하는 곳입니다. 예를 들어, 총이익률은 (수익 - 판매비용) / 수익으로 정의됩니다. LLM은 이미 총이익률, 순이익률, CLTV 등과 같은 일반적인 KPI를 이해할 수 있는 능력이 충분히 있는 상태일 수 있습니다.

그러나 현실 세계에서는 열이 보통 혼란스럽고, 수익은 rev라는 열 이름으로 설정될 수 있으며, rev1, pre_rev_1, rev2 등을 볼 수도 있을 것입니다. 의미론적 맥락 없이는 LLM이 이들이 무엇을 의미 하는지 알 방법이 없습니다.

<div class="content-ad"></div>

메트릭

"슬라이스 앤 다이스"는 데이터 분석에서 특히 다차원 데이터의 맥락에서 사용되는 기술로, 데이터를 다양한 관점에서 분해하고 보는 것을 말합니다. 이 접근 방식은 데이터를 자세히 탐색하고 분석하는 데 도움이 됩니다.

예를 들어, 판매 메트릭스 예시:

- 총 판매량: 특정 기간 동안 생성된 총 수익.
- 지역별 판매: 지리적 지역별로 분할된 판매 데이터.
- 제품별 판매: 개별 제품 또는 제품 카테고리별로 분할된 판매 데이터.
- 채널별 판매: 온라인, 소매, 도매 등 다양한 판매 채널별로 분할된 판매 데이터.

<div class="content-ad"></div>

또 다른 예시로 고객 지표를 사용해보겠습니다:

- 고객 인구 통계: 고객을 나이, 성별, 위치 등으로 분석한 것입니다.
- 고객 세분화: 행동, 구매 이력, 선호도 등을 기반으로 한 고객을 분류한 것입니다.
- 고객 유치: 특정 기간 동안 새로 유치한 고객의 수를 의미합니다.
- 고객 이탈률: 회사와의 거래를 중단한 고객의 비율입니다.

의미론적 관계

의미론적 관계는 주 키와 외래 키와는 다르지만, 데이터베이스와 데이터 관리의 맥락에서 관련 있는 개념입니다.

<div class="content-ad"></div>

의미 관계는 주로 실제 세계의 관계에 기반하여 데이터 간의 의미 있는 연결을 나타냅니다. 이러한 관계는 데이터 요소들이 단순히 기본 키(primary key)와 외래 키(foreign key)에 의해 제공되는 구조적 링크 이상의 개념적 상호 관련을 설명합니다. 예를 들어, 고객(Customers)과 주문(Orders) 테이블 사이의 의미 관계는 "고객이 여러 주문을 할 수 있다"로 설명될 수 있습니다. 이는 기술적 연결을 넘어 관계의 실제 의미를 포착합니다.

반면, 기본 키와 외래 키는 데이터 무결성을 강화하고 데이터베이스 스키마 수준에서 관계를 설정하는 데 사용됩니다. 의미 관계는 데이터 엔티티 간의 관련을 보다 넓은 맥락에서 설명하고 이해하는 데 사용되며, 기본 키와 외래 키 설정에서 제공되지 않는 일대다, 다대다, 일대일 관계를 정의할 수도 있습니다.

## LLM과 다양한 데이터 소스 통합의 도전

불안정한 SQL 생성 성능

<div class="content-ad"></div>

다양한 SQL 방양을 원활하게 처리할 수 있도록 여러 데이터 소스를 연결하고 LLMs가 다양한 소스 간의 성능 일관성을 보장함에는 상당한 어려움이 따릅니다. 데이터 소스의 수가 증가함에 따라 이 어려움은 더욱 부각됩니다. 일관성은 AI 시스템에 대한 신뢰를 구축하는 데 중요합니다. 안정적인 성능을 보장하는 것은 AI 솔루션의 전반적인 사용성과 신뢰성과 직결됩니다.

접근 제어 불일치

다양한 데이터 소스는 종종 각각의 접근 제어 메커니즘을 갖고 있습니다. 이러한 소스들이 직접 연결되면 일관된 데이터 정책을 유지하는 것이 어려워지며, 이는 대규모 데이터 팀 협업에 매우 중요합니다. 이 문제를 해결하기 위해 중앙 통제 계층이 필요합니다. 이 계층은 모든 LLM 사용 사례를 통해 접근 제어를 관리하여 데이터 정책이 균일하게 시행되고 기업 전체에서 보안 및 규정 준수를 강화합니다.

# 시맨틱 레이어의 출현

<div class="content-ad"></div>

다수의 데이터 소스에 직접 연결하는 것은 일관성과 성능 면에서 중요한 도전을 야기합니다. 더 효과적인 접근 방법은 LLM 사용 사례를 위한 의미론적 레이어를 구현하는 것입니다.

## 의미론적 레이어란?

의미론적 아키텍처의 핵심 개념은 *온톨로지*입니다. 온톨로지는 도메인을 형식적으로 나타내는 것으로, 엔티티와 속성을 나타내는 클래스 및 다른 엔티티와의 관계로 구성된다.

데이터셋의 도메인을 위한 온톨로지를 제공함으로써 LLM은 데이터를 제시하는 방법 뿐만 아니라 데이터가 무엇을 나타내는지에 대한 이해를 얻게 됩니다. 이를 통해 시스템은 데이터셋 내에 명시적으로 명시되지 않은 새로운 정보도 처리하고 추론할 수 있게 됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowwedesignoursemanticengineforLLMsThebackboneofthesemanticlayerforLLMarchitecture_0.png" />

## 시맨틱 레이어의 장점

시맨틱 레이어는 AI 에이전트가 서로 다른 도메인, 엔티티, 그리고 관계들 사이의 의미론을 이해하는 데 도움을 주는 것 이상의 역할을 합니다. 또한 AI 에이전트가 다음과 같은 프레임워크를 제공합니다:

- 올바른 공식을 사용하여 계산
- 결합 경로와 메트릭에 대한 맥락 제공
- 서로 다른 데이터 소스 간 일관성을 보장하는 표준화된 SQL 레이어 제공
- 캡슐화된 비즈니스 논리를 적용하고 엔티티 간 복잡한 관계를 런타임에서 관리

<div class="content-ad"></div>

의미론적 계층을 구현함으로써 AI 에이전트의 능력을 향상시킵니다. 이는 다양한 데이터 원본과 복잡한 비즈니스 맥락 간의 간극을 줄여 정확하고 일관된 통찰력을 제공할 수 있도록 돕습니다.

# 렌 엔진 — LLM을 위한 의미론적 엔진

그렇기 때문에 우리는 LLM을 위한 의미론적 엔진인 렌 엔진을 디자인했으며, 우리가 제시한 과제를 해결하기 위해 노력하고 있습니다.

렌 엔진을 사용하여 '모델링 정의 언어'(MDL)를 정의했으며, 이를 통해 LLM에게 적절한 문맥과 의미론적 메타데이터를 제공하고 엔진은 다양한 사용자 페르소나 및 의미론적 데이터 모델링 방법을 기반으로 SQL을 다시 작성할 수 있습니다. 엔진을 사용하여 의미론적 계층에 속하는 엑세스 제어 및 거버넌스와 같은 솔루션을 구축할 수 있습니다.

<div class="content-ad"></div>

## 의미론적 데이터 모델링

온톨로지의 기본 개념은 메타데이터와 데이터를 그래프 구조로 설계하는 것인데, 이를 일반적으로 지식 그래프라고 합니다. Wren Engine을 사용하면 데이터 모델과 측정 항목을 이 그래프 기반 아키텍처 내에서 정의할 수 있습니다. 이를 통해 서로 다른 모델의 열이 어떻게 관련되어 있는지와 해당 관계가 의미하는 바를 명시할 수 있습니다. 이러한 구조화된 정의는 데이터 관계를 명확히하고 SQL 쿼리를 정확하고 효율적으로 재작성할 수 있는 능력을 향상시킵니다.

의미론적 명명과 설명

MDL에서는 모델, 열, 뷰, 그리고 관계의 의미론적 명명과 설명을 손쉽게 정의할 수 있습니다. 의미론적 정의를 사용하면 LLM이 데이터 구조의 의미를 이해하는데 도움을 줄 수 있습니다.

<div class="content-ad"></div>

```json
{
    "name": "customers",
    "columns": [
        {
            "name": "City",
            "type": "VARCHAR",
            "isCalculated": 0,
            "notNull": 0,
            "expression": "",
            // 시맨틱 속성, 예를 들어 설명, 표시 이름 및 별칭을 여기에 추가할 수 있습니다.
            "properties": {
            "description": "고객이 위치한 고객 도시입니다. \"고객 세그먼트\"로도 불립니다.",
            "displayName": "도시"
            }
        },
        {
            // 시맨틱 네이밍
            "name": "UserId",
            "type": "VARCHAR",
            "isCalculated": 0,
            "notNull": 0,
            "expression": "Id",
            "properties": {
            "description": "데이터 모델에서 각 고객의 고유 식별자입니다.",
            "displayName": "Id"
            }
        }
    ],
    "refSql": "select * from main.customers",
    "cached": 0,
    "refreshTime": null,
    // 시맨틱 속성, 예를 들어 설명, 표시 이름 및 별칭을 여기에 추가할 수 있습니다.
    "properties": {
        "schema": "main",
        "catalog": "memory",
        "description": "구매를 한 고객들의 도시를 포함하는 고객 테이블",
        "displayName": "customers"
    },
    "primaryKey": "Id"
},
```

관계와 계산을 지원하는 런타임 SQL 재작성

Wren Engine을 사용하면 "모델 정의 언어"로 시맨틱 표현을 설계할 수 있고, AI 애플리케이션인 WrenAI에서 해당 주변에 UI를 구축하며 여기서도 오픈 소스로 제공됩니다. WrenAI 뒤에서는 서로 다른 엔티티 간의 관계를 정의하고, 일대다, 다대일, 일대일로 선언할 수 있습니다.

<img src="/assets/img/2024-06-19-HowwedesignoursemanticengineforLLMsThebackboneofthesemanticlayerforLLMarchitecture_1.png" />


<div class="content-ad"></div>

다음은 관계를 정의하는 간단한 예시입니다.

```js
{
    "name" : "CustomerOrders",
    "models" : [ "Customer", "Orders" ],
    "joinType" : "ONE_TO_MANY",  // 원 대 다 아키텍처입니다.
    "condition" : "Customer.custkey = Orders.custkey"
}
```

관계는 다음으로 구성됩니다:

- name: 관계의 이름
- models: 이 관계와 관련된 모델들. Wren Engine은 관계에서 2개의 모델만 연결합니다.
- joinType: 관계의 유형. 일반적으로 2개의 모델 간에는 4종류의 관계가 있습니다: ONE_TO_ONE (1 대 1), ONE_TO_MANY (1 대 다), MANY_TO_ONE (다 대 1), MANY_TO_MANY (다 대 다).
- condition: 두 모델 간의 조인 조건. Wren Engine은 SQL 생성 중 조인 조건을 담당합니다.

<div class="content-ad"></div>

모델에서 계산(식)을 추가할 때 사용자 정의 계산(식)도 추가할 수 있어요.

```js
{
    "name": "Customer",
    "refSql": "select * from tpch.customer",
    "columns": [
        {
            "name": "custkey",
            "type": "integer",
            "expression": "c_orderkey"
        },
        {
            "name": "name",
            "type": "varchar",
            "expression": "c_name"
        },
        {
            "name": "orders",
            "type": "Orders",
            "relationship": "CustomerOrders"
        },
        {
            "name": "consumption",
            "type": "integer",
            "isCalculated": true,
            "expression": "sum(orders.totalprice)" // 식 정의
        }
    ],
    "primaryKey": "custkey"
},
```

재사용 가능한 계산식과 함수 형태의 매크로를 지원해요.

계산에 관해서

<div class="content-ad"></div>

Wren Engine은 모델에서 계산을 정의하는 계산 필드를 제공합니다. 계산은 동일한 모델의 정의된 열 또는 관계를 통해 다른 모델의 관련 열을 사용할 수 있습니다. 일반적으로 공통 메트릭은 여러 다른 테이블에 관련이 있습니다. 계산된 필드를 통해 서로 다른 모델 간에 상호 작용하는 공통 메트릭을 정의하는 것이 쉽습니다.

예를 들어, 아래는 3개의 열이 있는 orders라는 정의된 모델입니다. 모델을 향상시키기 위해 각 고객의 성장을 알기 위해 customer_last_month_orders_price라는 열을 추가하려고 할 수 있습니다. 다음과 같이 계산된 필드를 정의할 수 있습니다.

```js
"columns": [
    {
        "name": "orderkey",
        "type": "INTEGER"
    },
    {
        "name": "custkey",
        "type": "INTEGER"
    },
    {
        "name": "price",
        "type": "INTEGER"
    },
    {
        "name": "purchasetimestamp",
        "type": "TIMESTAMP"
    },
    {
        "name": "customer_last_month_orders_price",
        "type": "INTEGER",
        "isCalculated": "true",
        // column
        "expression": "lag(price) over (partition by custkey order by date_trunc('YEAR', purchasetimestamp), 0, 0)"
    }
]
```

Macro 함수에 관해

<div class="content-ad"></div>

매크로는 모델 정의 언어(MDL)의 템플릿 기능입니다. MDL을 간소화하거나 핵심 개념을 중앙 집중화하는 데 유용합니다. 매크로는 Jinja 사양을 따르는 JVM의 템플릿 엔진 인 JinJava에 의해 구현됩니다. 매크로를 사용하면 특정 매개변수를 사용하여 템플릿을 정의하고 모든 표현식에서 사용할 수 있습니다.

아래 시나리오에서 twdToUsd는 전체 MDL 전체에 걸친 범용적 개념을 나타냅니다. 반면에 revenue 및 totalpriceUsd는 개별 모델에 특정한 부분 개념을 포함합니다.

```js
"macros": [
    {
        "name": "twdToUsd",
        "definition": "(twd: Expression) => twd / 30" // 매크로 정의
    }
],
"models": [
    {
        "name": "Orders",
        "columns": [
            {
                "name": "totalprice",
                "type": "double"
            },
            {
                "name": "totalpriceUsd",
                "expression": "{ twdToUsd('totalprice') }" // 매크로 함수 재사용
            }
        ]
    },
    {
        "name": "Customer",
        "columns": [
            {
                "name": "revenue",
                "isCalculated": true,
                "expression": "{ twdToUsd('sum(orders.totalprice)') }" // 매크로 함수 재사용
            },
            {
                "name": "orders",
                "Type": "Orders",
                "relationship": "OrdersCustomer"
            }
        ]
    }
]
```

## 표준 SQL 구문 지원

<div class="content-ad"></div>

Wren Engine은 내장된 SQL 프로세서와 변환기를 가지고 있습니다. Wren Engine을 통해 우리는 SQL을 파싱하고 WrenSQL 구문에서 표준 ANSI SQL과 호환되는 BigQuery, PostgreSQL, Snowflake 등과 같은 다른 방양으로 변환합니다.

아래는 간단한 예시입니다. 여기서 데이터셋의 MDL을 정의하고 SQL을 제출하면 모든 관계, 계산, 메트릭이 대상 방양에 특화된 SQL로 변환됩니다.

아래는 MDL 파일의 예시입니다 (Gist에서 확인해주세요): [Gist 링크](https://gist.github.com/...)

<div class="content-ad"></div>

위의 쿼리를 제출하면

```js
SELECT * FROM orders
```

Wren 엔진은 Wren SQL을 MDL 정의에 따라 다음과 같이 방언별 SQL로 변환합니다.

```js
WITH
    "order_items" AS (
    SELECT
        "order_items"."FreightValue" "FreightValue"
    , "order_items"."ItemNumber" "ItemNumber"
    , "order_items"."OrderId" "OrderId"
    , "order_items"."Price" "Price"
    , "order_items"."ProductId" "ProductId"
    , "order_items"."ShippingLimitDate" "ShippingLimitDate"
    FROM
        (
        SELECT
        "order_items"."FreightValue" "FreightValue"
        , "order_items"."ItemNumber" "ItemNumber"
        , "order_items"."OrderId" "OrderId"
        , "order_items"."Price" "Price"
        , "order_items"."ProductId" "ProductId"
        , "order_items"."ShippingLimitDate" "ShippingLimitDate"
        FROM
        (
            SELECT
            "FreightValue" "FreightValue"
            , "ItemNumber" "ItemNumber"
            , "OrderId" "OrderId"
            , "Price" "Price"
            , "ProductId" "ProductId"
            , "ShippingLimitDate" "ShippingLimitDate"
            FROM
            (
            SELECT *
            FROM
                main.order_items
            )  "order_items"
        )  "order_items"
    )  "order_items"
) 
, "payments" AS (
    SELECT
        "payments"."Installments" "Installments"
    , "payments"."OrderId" "OrderId"
    , "payments"."Sequential" "Sequential"
    , "payments"."Type" "Type"
    , "payments"."Value" "Value"
    FROM
        (
        SELECT
        "payments"."Installments" "Installments"
        , "payments"."OrderId" "OrderId"
        , "payments"."Sequential" "Sequential"
        , "payments"."Type" "Type"
        , "payments"."Value" "Value"
        FROM
        (
            SELECT
            "Installments" "Installments"
            , "OrderId" "OrderId"
            , "Sequential" "Sequential"
            , "Type" "Type"
            , "Value" "Value"
            FROM
            (
            SELECT *
            FROM
                main.payments
            )  "payments"
        )  "payments"
    )  "payments"
) 
, "orders" AS (
    SELECT
        "orders"."ApprovedTimestamp" "ApprovedTimestamp"
    , "orders"."CustomerId" "CustomerId"
    , "orders"."DeliveredCarrierDate" "DeliveredCarrierDate"
    , "orders"."DeliveredCustomerDate" "DeliveredCustomerDate"
    , "orders"."EstimatedDeliveryDate" "EstimatedDeliveryDate"
    , "orders"."OrderId" "OrderId"
    , "orders"."PurchaseTimestamp" "PurchaseTimestamp"
    , "orders"."Status" "Status"
    , "RevenueA"."RevenueA" "RevenueA"
    , "Sales"."Sales" "Sales"
    FROM
        (((
        SELECT
        "orders"."ApprovedTimestamp" "ApprovedTimestamp"
        , "orders"."CustomerId" "CustomerId"
        , "orders"."DeliveredCarrierDate" "DeliveredCarrierDate"
        , "orders"."DeliveredCustomerDate" "DeliveredCustomerDate"
        , "orders"."EstimatedDeliveryDate" "EstimatedDeliveryDate"
        , "orders"."OrderId" "OrderId"
        , "orders"."PurchaseTimestamp" "PurchaseTimestamp"
        , "orders"."Status" "Status"
        FROM
        (
            SELECT
            "ApprovedTimestamp" "ApprovedTimestamp"
            , "CustomerId" "CustomerId"
            , "DeliveredCarrierDate" "DeliveredCarrierDate"
            , "DeliveredCustomerDate" "DeliveredCustomerDate"
            , "EstimatedDeliveryDate" "EstimatedDeliveryDate"
            , "OrderId" "OrderId"
            , "PurchaseTimestamp" "PurchaseTimestamp"
            , "Status" "Status"
            FROM
            (
            SELECT *
            FROM
                main.orders
            )  "orders"
        )  "orders"
    )  "orders"
    LEFT JOIN (
        SELECT
        "orders"."OrderId"
        , sum("order_items"."Price") "RevenueA"
        FROM
        ((
            SELECT
            "ApprovedTimestamp" "ApprovedTimestamp"
            , "CustomerId" "CustomerId"
            , "DeliveredCarrierDate" "DeliveredCarrierDate"
            , "DeliveredCustomerDate" "DeliveredCustomerDate"
            , "EstimatedDeliveryDate" "EstimatedDeliveryDate"
            , "OrderId" "OrderId"
            , "PurchaseTimestamp" "PurchaseTimestamp"
            , "Status" "Status"
            FROM
            (
            SELECT *
            FROM
                main.orders
            )  "orders"
        )  "orders"
        LEFT JOIN "order_items" ON ("orders"."OrderId" = "order_items"."OrderId"))
        GROUP BY 1
    )  "RevenueA" ON ("orders"."OrderId" = "RevenueA"."OrderId"))
    LEFT JOIN (
        SELECT
        "orders"."OrderId"
        , sum("payments"."Value") "Sales"
        FROM
        ((
            SELECT
            "ApprovedTimestamp" "ApprovedTimestamp"
            , "CustomerId" "CustomerId"
            , "DeliveredCarrierDate" "DeliveredCarrierDate"
            , "DeliveredCustomerDate" "DeliveredCustomerDate"
            , "EstimatedDeliveryDate" "EstimatedDeliveryDate"
            , "OrderId" "OrderId"
            , "PurchaseTimestamp" "PurchaseTimestamp"
            , "Status" "Status"
            FROM
            (
            SELECT *
            FROM
                main.orders
            )  "orders"
        )  "orders"
        LEFT JOIN "payments" ON ("payments"."OrderId" = "orders"."OrderId"))
        GROUP BY 1
    )  "Sales" ON ("orders"."OrderId" = "Sales"."OrderId"))
) 
SELECT *
FROM
    orders
```

<div class="content-ad"></div>

## 다양한 소스에서 일관된 액세스 제어 (계획)

여러 데이터 소스 간의 액세스 제어를 관리하는 것은 서로 다른 액세스 제어 메커니즘으로 인해 어려울 수 있습니다. Wren Engine은 또한 다음과 같은 문제를 해결하고 있습니다.

- 데이터 정책 정의: 모든 데이터 소스가 동일한 보안 및 액세스 프로토콜을 준수하도록 보장합니다.
- 통합된 인증 및 권한 부여: 단일 엔진 아래에서 다양한 데이터 소스를 통합함으로써 인증 및 권한 부여 프로세스가 간소화됩니다. 이 일관성은 무단 액세스의 위험을 줄이고 사용자가 모든 데이터 소스에서 일관된 액세스 권한을 갖도록 보장합니다.
- 역할 기반의 액세스 제어 (RBAC): 역할에 기반하여 액세스 권한이 개별 사용자가 아닌 역할에 할당되는 RBAC를 구현합니다.

프로젝트를 실행할 때 자세한 내용을 공유할 예정이니 기대해주세요!

<div class="content-ad"></div>

## 오픈 및 스탠드얼론 아키텍처

Wren Engine은 오픈 소스로 제공되며 독립적인 의미 엔진으로 설계되어 있습니다. 이 엔진은 어떤 AI 에이전트와도 쉽게 구현할 수 있으며 일반적인 의미 엔진으로 사용할 수 있습니다.

![이미지](/assets/img/2024-06-19-HowwedesignoursemanticengineforLLMsThebackboneofthesemanticlayerforLLMarchitecture_3.png)

# 최종 의견

<div class="content-ad"></div>

Wren Engine의 미션은 LLMs의 시맨틱 엔진으로서의 역할을 하여 시맨틱 레이어를 제공하고 BI 및 LLMs에 비즈니스 컨텍스트를 전달하는 것입니다. 우리는 엔진이 모든 애플리케이션 및 데이터 소스와 호환되도록 하는 오픈 커뮤니티를 구축하는 것을 믿습니다. 또한 개발자가 그 위에 자유롭게 AI 에이전트를 구축할 수 있는 아키텍처를 제공하는 것이 우리의 목표입니다.

WrenAI와 Wren Engine에 관심이 있다면, 우리의 GitHub을 확인해보세요. 모두 오픈 소스입니다!

WrenAI를 아직 확인하지 않았다면, 지금 확인해보세요!

👉 GitHub: https://github.com/Canner/WrenAI

<div class="content-ad"></div>

👉 X: https://twitter.com/getwrenai

👉 Medium: https://blog.getwren.ai/

이 기사를 즐겼다면 ⭐ Github에서 WrenAI에 별표를 주시는 걸 잊지 마세요 ⭐ 항상 읽어 주셔서 감사합니다.