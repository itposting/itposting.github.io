---
title: " SQL 조인 마스터하기"
description: ""
coverImage: "/assets/img/2024-06-19-MasteringSQLJoins_0.png"
date: 2024-06-19 16:31
ogImage: 
  url: /assets/img/2024-06-19-MasteringSQLJoins_0.png
tag: Tech
originalTitle: "🐼 Mastering SQL Joins"
link: "https://medium.com/gitconnected/mastering-sql-joins-eb786ad7a7c7"
---


![SQL Join](/assets/img/2024-06-19-MasteringSQLJoins_0.png)

저희의 최신 SQL 데이터 과학 탐험에 오신 것을 환영합니다. 이전 글에서는 단일 테이블 내에서 데이터 세트를 조작하는 것에 대해 자세히 다뤘습니다. 데이터 추출, 변환, 계산, 필터링을 통해 통찰과 패턴을 발견했습니다.

이러한 기본적인 기술은 중요하지만, SQL의 실제 응용은 종종 보다 복잡한 접근을 요구합니다. 특히 다중 테이블에서 데이터를 통합해야 하는 경우가 많습니다. 이는 관계형 데이터베이스에 데이터가 일반적으로 저장되는 방식을 반영한 것으로, 서로 다른 테이블 간에 특정 키와 속성을 통해 관련되어 있습니다.

본 문서에서는 단일 테이블 작업을 넘어서서 다중 테이블 조인에 대한 이해와 적용을 다룰 것입니다. 조인 작업은 SQL에서 중요한데, 서로 다른 테이블에서 데이터를 통합하고 교차 참조하여 정보를 종합적으로 파악할 수 있게 합니다.

<div class="content-ad"></div>

우리는 조인 연산의 기본 개념을 다룰 것이며, 다양한 종류의 조인과 그 응용에 대해 다룰 것입니다. 이 글을 마칠 때쯤이면, 현실 세계의 데이터 과학적 도전의 복잡성을 반영하는 정교한 데이터 조작을 수행하는 데 필요한 실용적인 노하우를 갖추게 될 것입니다. 데이터 과학을 위해 관계형 데이터베이스의 전체 잠재력을 탐색하고 활용하기 위한 전략을 발견하는 다중 테이블 관련의 복잡성에 대해 파고들어 봅시다.

# 데이터 관련성 이해

테이블 조인과 SQL에 대한 우리의 탐험의 핵심에는 기본 개념이 있습니다: 데이터 관계. 테이블을 조인하는 메커니즘을 깊이 파헤치기 전에, 데이터가 관련되어 있는지와 이러한 관계가 관계형 데이터베이스의 기반이 되는 방식을 이해하는 것이 중요합니다.

거의 모든 제품을 판매하는 거의 모든 비즈니스에서 흔히 볼 수 있는 기본적인 예제를 고려해 보겠습니다 — 제품 카탈로그 테이블입니다. 이 테이블은 회사 데이터베이스의 중요한 구성 요소로, 판매 가능한 제품들의 구조화된 개요를 제공합니다. 일반적으로 제품 코드, 제품 이름, 판매 가격, 제품 카테고리와 같은 필드가 포함되어 있습니다. 이러한 각 필드는 특정 목적을 제공합니다:

<div class="content-ad"></div>

- 제품 코드: 각 제품에 대한 고유 식별자입니다.
- 제품 이름: 제품의 이름으로, 사용자들이 식별하는 데 도움이 됩니다.
- 판매 가격: 제품이 고객에게 판매되는 가격입니다.
- 제품 카테고리: 제품을 더 넓은 범주로 그룹화하는 분류입니다.

이 표는 제품 정보를 관리 가능한 방식으로 구성하는 데 도움이 되며, 데이터가 어떻게 상호 연결될 수 있는지 이해하는 데 기초를 제공합니다.

예를 들어, 제품 카테고리 필드는 개별 제품을 더 큰 범주에 연결하여 데이터 내에서 간단하지만 강력한 관계를 암시합니다. 진행하면서 이러한 관계가 단일 표를 넘어 확장되어 다중 소스에서 데이터를 결합하여 더 풍부한 통찰과 포괄적인 분석을 제공할 수 있음을 알게됩니다.

다음 섹션에서는 테이블 조인의 메커니즘에 대해 깊이 있게 다룰 것인데, 이 기술은 이러한 관계를 활용하여 두 개 이상의 테이블에서 데이터를 병합하여 데이터를 질의하고 분석할 수 있는 능력을 향상시키는 데 활용됩니다.

<div class="content-ad"></div>

데이터 관계의 기본 개념을 이해하면 데이터 과학에서 SQL의 강력함을 더욱 실감할 수 있어요.

![MasteringSQLJoins_1.png](/assets/img/2024-06-19-MasteringSQLJoins_1.png)

쿼리 분석 및 시각화 생성 측면에서 PRODUCTS 테이블은 잘 구성되어 있어서 SQL 작업에 적합해 보여요.

PRODUCTS 테이블에서 카테고리가 특히 `가정용 가전제품`인 제품 이름을 검색하려면 다음과 같은 SQL 쿼리를 실행할 수 있어요:

<div class="content-ad"></div>

```sql
SELECT product_name 
FROM PRODUCTS 
WHERE category = 'Home Appliances'
```

우리 예제 테이블에서 이 쿼리를 실행하면 'Home Appliances' 카테고리에 세 개의 제품이 있다는 것을 나타내는 세 개의 행이 반환됩니다.

따라서 이 데이터 하위 집합을 가져오는 데 문제가 없습니다. 더 나아가, 우리는 카테고리 당 제품 평균 가치를 계산하는 분석을 확장할 수 있습니다.

이러한 작업을 위해서는 AVG 함수를 사용하여 평균 제품 가치를 계산합니다. SQL 명령을 구조화하는 방법은 다음과 같습니다:

<div class="content-ad"></div>

```js
SELECT category, AVG(product_value)
FROM PRODUCTS
GROUP BY category;
```

이 명령어는 두 가지 업무를 수행합니다:

- 출력에 포함될 카테고리 열을 선택하여 각 카테고리의 평균 값에 대한 고유한 식별자를 제공합니다.
- AVG 함수를 사용하여 제품 가치의 평균을 계산합니다. 이는 저희 다음 장에서 더 자세히 살펴볼 집계 함수입니다.

GROUP BY category를 사용하여 각 고유 카테고리에 대한 평균 값을 PRODUCTS 테이블 내에서 계산합니다. 이러한 집계는 데이터 분석에서 핵심 역할을 합니다. 다른 제품 세그먼트 내에서의 패턴과 트렌드를 식별하는 데 도움이 됩니다.

<div class="content-ad"></div>

그러나 더 자세히 살펴보면, 카테고리 열에서 비효율성이 드러납니다: 용어 '가전제품'이 여러 번 반복됩니다. 처음에는 각 제품의 카테고리를 나타내는 것이 필요해 보일 수 있지만, 이 중복은 몇 가지 문제로 이어질 수 있습니다:

- 데이터 저장: 중복 데이터는 저장면에서 비용이 소모될 수 있습니다. '가전제품'의 각 반복은 디스크 공간을 추가로 차지하는데, 이는 이 정보를 표현하는 더 효율적인 방법이 없는 한 불필요합니다.
- 성능: 자주 업데이트되는 테이블은 이러한 중복이 포함되어 있을 경우 로드하는 데 시간이 오래 걸릴 수 있습니다. 수백만 또는 수십억 개의 레코드로 확장된 이 테이블을 상상해보세요. 반복된 카테고리 항목으로 인해 성능에 미치는 영향은 상당할 수 있습니다.
- 쿼리 효율성: 대규모 테이블을 쿼리할 때 중복된 카테고리가 있는 경우, 데이터베이스 엔진은 필요 이상의 데이터를 스캔해야 하는 일이 늘어날 수 있습니다.

따라서, 보고 목적으로는 테이블이 충분해 보일지라도, 관리 및 운영 측면에서는 상당한 비효율성이 드러납니다.

이러한 도전에 대처하려면, 데이터베이스를 재구성하여 중복을 줄이고 데이터 무결성을 개선하는 정규화(Normalization)이라는 해결책이 필요합니다.

<div class="content-ad"></div>

이 문제를 해결하는 일반적인 방법 중 하나는 고유한 카테고리 이름과 해당 식별자를 보유하는 별도의 CATEGORIES 테이블을 생성하는 것입니다.

그럼으로써, PRODUCTS 테이블의 각 제품은 식별자를 통해 적절한 카테고리를 참조하게 됩니다. 이 방법을 외부 키 참조라고 합니다.

이 변경은 저장 공간을 절약하는 데 도움이 되는 것뿐만 아니라 데이터 작업과 쿼리의 성능을 최적화합니다.

다음은 이러한 비효율성을 해결하기 위해 데이터베이스를 구조화하는 예시입니다:

<div class="content-ad"></div>

```js
-- 카테고리에 대한 새 테이블 생성
CREATE TABLE CATEGORIES (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(255)
);

-- 고유한 카테고리를 CATEGORIES 테이블에 삽입
INSERT INTO CATEGORIES (category_id, category_name)
VALUES (1, '가전제품'), (2, '가구'), (3, '식품');

-- PRODUCTS 테이블을 수정하여 CATEGORIES에 대한 외부 키 참조를 추가
ALTER TABLE PRODUCTS
ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES CATEGORIES(category_id);
```

![이미지](/assets/img/2024-06-19-MasteringSQLJoins_2.png)

이 접근 방식은 여러 문제를 해결해 줍니다. 'Home Appliances'라는 단어를 더 이상 반복하지 않아도 되므로, 수십억 개의 레코드가 있는 테이블에서 중요합니다.

CATEGORIES 테이블을 자주로드할 필요가 없으므로로딩 시간이 줄어들 확률이 높습니다. 이 테이블은 한 번 생성되고 시간이 지남에 따라 거의 변경되지 않습니다. PRODUCTS 테이블은 카테고리 관련 텍스트를 반복할 필요가 없으므로 로드 및 업데이트 속도가 빨라집니다.

<div class="content-ad"></div>

쿼리를 실행하는 과정은 두 테이블을 조인해야 하므로 약간 복잡할 수 있습니다. 그러나 이런 교체는 쿼리가 텍스트 기반의 카테고리 열이 아닌 ID를 참조하고, 해당 카테고리가 반복되지 않는 CATEGORIES 테이블에 조인하여 성능이 더 우수해질 수 있도록 도와줍니다.

아래는 카테고리가 '가전제품'인 제품 이름을 검색하는 쿼리의 예시입니다:

```js
SELECT p.product_name, p.product_value
FROM PRODUCTS p
JOIN CATEGORIES c ON p.category_id = c.category_id
WHERE c.category_name = 'Home Appliances';
```

이 SQL 문은 PRODUCTS 테이블과 CATEGORIES 테이블을 공유된 category_id를 기준으로 조인합니다. 이렇게 함으로써 'Home Appliances' 카테고리와 연관된 제품 이름과 값을 효율적으로 검색합니다.

<div class="content-ad"></div>

- p 및 c는 각각 PRODUCTS 및 CATEGORIES의 별칭으로, 쿼리를 간단하게 만듭니다.
- ON 절은 category_id를 일치시켜 두 테이블을 연결합니다.
- WHERE 절은 결과를 '가정용 가전제품' 만 포함하도록 필터링합니다.

테이블 별칭이 없는 열 이름은 한 테이블에만 고유한 열에서 나온 것으로, 별칭이 필요 없어집니다. 그러나 쿼리가 복잡해지면 명확성을 위해 별칭을 사용하는 것이 일반적인 관행입니다.

저희는 앞으로 LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN 및 CROSS JOIN과 같은 다양한 종류의 조인을 다룰 것입니다.

# SQL 조인 이해하기: 개념적 접근

<div class="content-ad"></div>

SQL 영역에서 테이블을 결합하는 능력은 복잡한 데이터 검색을 가능하게 하는 강력한 기능입니다.

시작하기 전에 한 가지 조언을 드리겠습니다: 유혹에 넘어가지 말고 조인 규칙을 암기하려는 욕구를 억제하세요. 진정한 이해는 단순 암기가 아니라 근본적인 원리를 이해하는 데서 나옵니다.

이 섹션에서는 SQL 조인에 대한 개요를 제시하고 일반적인 개념을 파악하기 위한 다이어그램을 보완합니다. 실제 연습으로 이동하면서 목표지향적인 방법으로 SQL 조인 학습을 강조할 것입니다.

조인을 마스터하는 핵심은 원하는 결과에 초점을 맞추는 것입니다: 어떤 데이터가 필요한가요? 얼마나 많은 데이터가 필요한가요? 어떤 테이블에서요?

<div class="content-ad"></div>

이러한 질문들이 있습니다. 해당 조인 유형을 결정하는 데 도움이 됩니다. 조인이란 본질적으로 세트 이론 규칙의 적용이며, 이 개념을 이해하는 것은 단순 외움보다 전략적입니다.

그럼에도 불구하고 이는 하나의 관점에 불과합니다. 우리가 다가올 수업에서 INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN 등을 포함한 다양한 조인 유형을 탐색하면서 직접 결론을 도출하는 것을 장려합니다.

<div class="content-ad"></div>

SQL 조인은 본질적으로 집합 이론의 실용적 적용입니다. 이 개념은 대부분 사람들이 초등 교육을 받을 때 소개 받는 개념입니다. 이 아이디어는 간단합니다: 조인을 통해 하나의 세트, 다른 세트 또는 둘 다에 속하는 데이터를 검색할 수 있습니다. SQL에서 이러한 세트는 우리의 데이터를 포함하는 테이블입니다.

다음 시각화를 고려해보세요: 각 원은 데이터 세트 또는 테이블을 나타냅니다. 우리는 다음과 같은 데이터를 검색할 수 있습니다:

## Inner Join

"조인"에 대해 들으면, 그것은 일반적으로 사용되는 조인 유형 중 하나인 내부 조인을 가리키는 것입니다. 이는 두 테이블에서 일치하는 값을 가진 레코드를 반환합니다. 아래 다이어그램은 이해를 돕습니다.

<div class="content-ad"></div>

## Left Join (또는 Left Outer Join)

가끔 "Outer"를 생략하여 "Left Join"이라고도 불리며, 이는 왼쪽 테이블의 모든 레코드와 오른쪽 테이블의 해당 레코드를 반환합니다. SQL 쿼리에서 테이블의 순서는 결과에 중대한 영향을 미칩니다. 따라서 쿼리에서 테이블의 순서를 지정하는 것이 중요합니다.

## Right Join (또는 Right Outer Join)

이 조인은 오른쪽 테이블의 모든 레코드와 왼쪽 테이블의 일치하는 레코드를 반환합니다. 아래 다이어그램은 이 개념을 시각적으로 설명합니다.

<div class="content-ad"></div>

## Full Join (또는 Full Outer Join)

왼쪽, 오른쪽 또는 두 테이블에서 일치하는 항목이있을 때 모든 레코드를 반환하여 모든 것을 검색합니다.

## Cross Join

성능 이슈로 인해 덜 사용되지만, 두 테이블의 모든 레코드의 카테시안 곱을 반환합니다.

<div class="content-ad"></div>

위의 예시는 단순성을 위해 두 개의 테이블을 사용했지만, 실제로는 몇 개의 테이블이든 상관없이 동일한 원칙이 적용됨을 알아두는 것이 중요합니다. 3개, 4개, 5개 또는 100만 개의 테이블을 조인하든 상관없이 논리는 일관적으로 유지됩니다.

## Self Join

이 기술은 재귀를 활용하여 테이블을 자신에 조인하는 것으로, 컴퓨터 프로그래밍에서 널리 사용되는 개념입니다.

다음 다이어그램은 제공된 설명을 요약하였습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-MasteringSQLJoins_4.png" />

위 요약은 방금 논의한 조인 유형을 요약한 것이지만, 각 조인 유형마다 쿼리에서 필터를 구성하는 방식에 대한 주요한 차이점이 있다는 점을 기억하는 것이 중요합니다.

우리는 이전에 필터에 대해 탐구했었죠. 필터는 사실 SQL 개념의 기초입니다.

조인을 구성하는 방식은 적용하는 필터에 따라 완전히 변경될 수 있습니다. 그래서 이러한 조인 및 약간의 변형을 소개했지만, 개인적으로는 조인의 이름을 기억하는 데 신경 쓰지 않습니다.

<div class="content-ad"></div>

그 대신, 제가 집중하는 것은 필요한 것을 이해하는 데 있어요:

- 나는 왼쪽과 오른쪽 테이블에서 데이터를 반환하고 싶은가?
- 한 테이블에만 존재하고 다른 테이블에는 없는 데이터를 검색하려고 하는가?
- 아니면 동일한 테이블 내에서 관계가 있는 데이터를 반환하고 싶은가?

이것들은 제가 고민하는 질문들이며, 이러한 실용적인 수업을 통해 안내해 드릴 거에요. 이 방법은 최적의 조인 전략을 정의하는 데 도움이 돼요. 물론, 이 모든 것을 즉시 이해하는 것은 쉽지 않을 수 있어요; 연습이 중요하죠.

나는 다가오는 세션에서 여러 예시들을 제공하여 여러분이 이러한 개념을 이해하고 적용할 수 있도록 강화할 거에요.

<div class="content-ad"></div>

# SQL에서 Table Joins 탐색하기

SQL에서 Table Joins에 대해 자세히 살펴보겠습니다. 이 섹션은 최대한 가르치기 쉬운 방법으로 기초부터 순서대로 명확하게 설명하려는 목적으로 강조합니다.

나의 목표는 여러분이 개념을 명확히 이해하도록 돕는 것입니다. Table Joins는 점차적으로 복잡해지는 쿼리를 다룰 때 다음 장에서 활용될 것입니다.

가상 데이터셋을 활용하여 SQL Joins를 마스터하는 여정을 수월하게 진행해 보겠습니다. 시작해 봅시다!

<div class="content-ad"></div>

```sql
CREATE SCHEMA `chapter04`;
```

먼저 일부 허구 데이터로 테이블을 로드한 다음, 두 번째 테이블을 만들고 데이터를 로드하고, 그리고 데이터로드를 적용하기 전에 세 번째 테이블을 만들겠습니다.

인터페이스에서 마우스 오른쪽 버튼을 클릭하여 "스키마 생성"을 선택할 수는 있지만, 실행을 위해 모든 명령을 하나의 스크립트로 제공하고 있습니다. 실행하면 로그에 성공 메시지가 표시됩니다.

그런 다음 좌측 사이드바에서 마우스 오른쪽 버튼을 클릭하고 새로 고침을 누르면 "Chapter 04" 스키마가 나타납니다.


<div class="content-ad"></div>

# 고객 테이블 생성하기

아래의 SQL DDL (데이터 정의 언어) 명령문을 복사하여 붙여넣어서 고객 테이블을 생성하세요:

```js
CREATE TABLE `chapter04`.`CUSTOMERS` (
  `customer_id` INT NULL,
  `customer_name` VARCHAR(50) NULL,
  `customer_address` VARCHAR(50) NULL,
  `customer_city` VARCHAR(50) NULL,
  `customer_state` VARCHAR(2) NULL);
```

이 섹션의 최종 목표는 데이터베이스 내에서 객체를 생성하는 것입니다. 따라서 CUSTOMERS 테이블을 만드는 것은 DDL (데이터 정의 언어) 명령입니다.

<div class="content-ad"></div>

DDL은 데이터베이스에 무언가를 생성할 때 사용됩니다. 예를 들어, 테이블을 만들 때 사용됩니다. 이 경우에는 chapter04 스키마에 CUSTOMERS 테이블을 만들 예정이며, 이 테이블에는 고객 ID, 고객 이름, 고객 주소, 도시 및 주(지역)를 위한 열이 포함될 것입니다.

자, 이제 이를 실행해 봅시다. 성공적으로 실행하면 로그에 확인 메시지가 표시될 것입니다. 화살표를 클릭한 다음 '테이블' 섹션을 클릭하면, 우리의 첫 번째 테이블이 생성된 것을 확인할 수 있습니다. 이제 이 테이블에 INSERT 문을 사용하여 가상 데이터를 채워넣는 시간입니다.

# CUSTOMERS 테이블 채우기

CUSTOMERS 테이블에 데이터를 추가하기 위해 INSERT INTO 문을 사용합니다. 이 문은 테이블에 새 레코드를 추가하는 데이터 조작 언어(DML)의 중요한 구성 요소입니다.

<div class="content-ad"></div>

가상 고객 데이터를 시스템적으로 삽입하는 방법은 다음과 같습니다:

```js
-- CUSTOMERS 테이블에 데이터 삽입

INSERT INTO `chapter04`.`CUSTOMERS` 
(`customer_id`, `customer_name`, `customer_address`, `customer_city`, `customer_state`)
VALUES 
(1, 'John Smith', '123 Maple Street', 'Orlando', 'FL');

INSERT INTO `chapter04`.`CUSTOMERS` 
(`customer_id`, `customer_name`, `customer_address`, `customer_city`, `customer_state`)
VALUES 
(2, 'Susan Johnson', '456 Oak Avenue', 'Austin', 'TX');

INSERT INTO `chapter04`.`CUSTOMERS` 
(`customer_id`, `customer_name`, `customer_address`, `customer_city`, `customer_state`)
VALUES 
(3, 'Robert Brown', '789 Pine Lane', 'Phoenix', 'AZ');

INSERT INTO `chapter04`.`CUSTOMERS` 
(`customer_id`, `customer_name`, `customer_address`, `customer_city`, `customer_state`)
VALUES 
(4, 'Linda Davis', '321 Birch Blvd', 'Raleigh', 'NC');

INSERT INTO `chapter04`.`CUSTOMERS` 
(`customer_id`, `customer_name`, `customer_address`, `customer_city`, `customer_state`)
VALUES 
(5, 'Michael Miller', '654 Cedar Place', 'Atlanta', 'GA');
```

각 INSERT INTO 명령은 CUSTOMERS 테이블에 새로운 행을 추가하며 customer_id, customer_name, customer_address, customer_city, customer_state의 값을 지정합니다.

이 방법을 사용하면 각기 다른 항목을 가진 다양한 항목으로 테이블이 체계적으로 채워지며, SQL 쿼리 및 작업을 위한 기반을 마련할 수 있습니다.

<div class="content-ad"></div>

이 명령을 실행한 후에는 샘플 레코드가 채워진 CUSTOMERS 테이블이 생성되어서, 이후 레슨에서 SQL 함수 및 테이블 조인을 탐색하는 데 도움이 될 것입니다.

# ORDERS 테이블 생성 및 채우기

CUSTOMERS 테이블을 설정한 후, 다음 단계는 동일한 chapter04 스키마 내에서 ORDERS 테이블을 설정하는 것입니다.

이 테이블은 고객 주문에 관한 다양한 세부 정보를 기록하며, 관련된 영업 직원 및 배송 정보가 포함됩니다. ORDERS 테이블을 생성하는 방법은 다음과 같습니다:

<div class="content-ad"></div>

```js
CREATE TABLE `chapter04`.`ORDERS` (
  `order_id` INT NULL,
  `customer_id` INT NULL,
  `salesperson_id` INT NULL,
  `order_date` DATETIME NULL,
  `delivery_id` INT NULL);
```

이 테이블 스키마에는 다음이 포함되어 있습니다:

- order_id: 각 주문의 고유 식별자입니다.
- customer_id: 주문을 접수한 고객을 가리키는 CUSTOMERS 테이블과 연결된 참조입니다.
- salesperson_id: 주문을 처리한 영업 담당자의 식별자입니다.
- order_date: 주문이 접수된 날짜와 시간으로 DATETIME 형식을 사용합니다. 주문의 정확한 타이밍을 기록하기 위해 DATETIME 형식을 사용하는 것이 중요합니다.
- delivery_id: 주문과 관련된 배송 세부 정보를 식별하는 식별자입니다.

ORDERS 테이블을 만들기 위해 이 명령을 실행한 후, MySQL Workbench(또는 선택한 SQL 관리 도구)에서 스키마 view를 새로 고침하여 chapter04 스키마 아래에 새로 생성된 테이블을 확인할 수 있습니다.

<div class="content-ad"></div>

다음으로, 이 ORDERS 테이블에 데이터를 채워넣을 것입니다. 레코드를 삽입할 때 order_date 열의 DATETIME 형식에 유의해주세요.

# 현재 데이터로 ORDERS 테이블 채우기

ORDERS 테이블을 채우기 위해 INSERT INTO 문을 사용하여 레코드를 추가하고 있습니다.

각 주문의 고유 ID, 고객 ID, 판매자 ID, 주문의 현재 날짜 및 시간, 배송 ID를 지정하는 것을 포함합니다.

<div class="content-ad"></div>

요거교과 자료에있는 DATETIME 유형의 order_date 컬럼에 정확한 현재 날짜와 시간을 캡처하는 SQL NOW() 함수 사용 방법을 확인해보세요:

```js
INSERT INTO `chapter04`.`ORDERS` (`order_id`, `customer_id`, `salesperson_id`, `order_date`, `delivery_id`)
VALUES (1001, 1, 5, now(), 23);

INSERT INTO `chapter04`.`ORDERS` (`order_id`, `customer_id`, `salesperson_id`, `order_date`, `delivery_id`)
VALUES (1002, 1, 7, now(), 24);

INSERT INTO `chapter04`.`ORDERS` (`order_id`, `customer_id`, `salesperson_id`, `order_date`, `delivery_id`)
VALUES (1003, 2, 5, now(), 23);
```

NOW() 함수는 SQL에서 현재 날짜와 시간을 데이터베이스 서버가 실행 중인 시스템에서 가져오는 편리한 기능으로, 각 데이터 삽입 시 주문 날짜 컬럼이 정확하게 타임스탬프가 찍히는 것을 보장합니다.

이 명령을 실행한 후, 각 레코드가 삽입 순간의 정확한 시간으로 타임스탬프가 찍히며, 현재 날짜와 시간 입력에 대한 NOW() 함수의 유용성을 잘 보여줍니다.

<div class="content-ad"></div>

SQL 기능은 각기 다른 데이터베이스 관리 시스템(DBMS)마다 약간 다를 수 있습니다. 사용 중인 SQL 방언(MYSQL, PostgreSQL 등)에 대한 고유한 기능과 구문을 이해하기 위해 해당 문서를 참고하는 것이 중요합니다.

이 단계는 데이터베이스에 데이터를 삽입하는 방법을 보여주는 것뿐만 아니라, 다양한 DBMS 환경에서 SQL 기능 및 응용 프로그램을 익히는 중요성을 강조합니다.

다음으로, SELECT 쿼리를 실행하여 삽입된 데이터를 검토하고, 세 번째이자 마지막 테이블을 생성하고 채우기로 넘어갑니다.

# SALESPERSON 테이블 생성 및 채우기

<div class="content-ad"></div>

SQL 여행을 계속하면서, 이제는 SALESPERSON 테이블 설정에 초점을 맞춥니다. 이 테이블은 영업 직원에 관한 정보를 저장하는 데 사용됩니다. 그들의 ID 및 이름을 포함합니다. 아래는 SALESPERSON 테이블을 생성하는 SQL 명령문입니다:

```js
CREATE TABLE `chapter04`.`SALESPERSON` (
  `salesperson_id` INT NULL,
  `salesperson_name` VARCHAR(50) NULL);
```

이 명령을 실행한 후에는 SALESPERSON 테이블이 설정되어, 영업 직원에 관한 데이터를 채울 준비가 되어 있습니다.

# SALESPERSON 테이블 채우기

<div class="content-ad"></div>

"SALESPERSON" 테이블에 데이터를 입력하려면 각 판매원 레코드에 대해 INSERT INTO문을 사용합니다.

`INSERT` 명령의 구체적인 내용은 안내서엔 포함되어 있지 않지만, 해당 명령의 일반적인 형태는 다음과 같습니다:

```js
INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (1, "판매원 1");

INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (2, "판매원 2");

INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (3, "판매원 3");

INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (4, "판매원 4");

INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (5, "판매원 5");

INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (6, "판매원 6");

INSERT INTO `chapter04`.`SALESPERSON` (`salesperson_id`, `salesperson_name`)
VALUES (7, "판매원 7");
```

# 주문 ID 및 고객 이름 가져오기

<div class="content-ad"></div>

고객 이름은 CUSTOMERS 테이블에 있고 주문 ID는 ORDERS 테이블에 있습니다. 이 두 가지 다른 테이블에서 데이터를 추출해야 하는 상황입니다.

이 시나리오는 SQL에서 테이블 조인의 필요성을 완벽하게 보여줍니다. 이를 통해 테이블 간의 관계를 형성하여 결합된 데이터를 검색할 수 있습니다.

각 주문이 특정 고객과 연결되어 있다는 것은 ORDERS 테이블의 고객 ID로 확인할 수 있었습니다. 이 두 테이블 간에 관계형 열이 있는 것이 분명합니다.

이 연결은 무작위가 아니라, 데이터베이스 설계의 의도적인 측면으로, 주문이 고객과 연관이 있는 것을 나타냅니다. 실제적으로 주문은 관련된 고객이 없이는 존재할 수 없다는 논리적인 규칙이 데이터베이스 모델링 단계에서 설정되었습니다.

<div class="content-ad"></div>

손님 ID가 일반적으로 기본 키로 작용하는 이유는 각 손님을 고유하게 식별하여 동일한 ID를 가진 두 명의 손님이 없도록 하는 것입니다. 이는 개인이 고유한 식별 번호를 갖는 것과 유사합니다.

필요한 정보를 가져 오기 위해 ORDERS 및 CUSTOMERS 테이블 간의 Inner Join을 실행할 것입니다. 이 쿼리를 어떻게 구성하는지 살펴보겠습니다:

```js
SELECT o.order_id, c.customer_name
FROM `chapter04`.`ORDERS` o
INNER JOIN `chapter04`.`CUSTOMERS` c 
ON o.customer_id = c.customer_id;
```

- o 및 c는 각각 ORDERS 및 CUSTOMERS 테이블에 대한 별칭으로, 우리의 표기법을 간단하게하는 데 도움이 됩니다.
- SELECT 문은 주문 테이블(o)에서 order_id 및 고객 테이블(c)에서 customer_name을 가져 오겠다고 지정합니다.
- INNER JOIN 절은 두 테이블을 공통 customer_id 열에 연결하여 해당 고객 레코드가있는 주문 만 검색됨을 보장합니다.

<div class="content-ad"></div>

이 접근 방식은 SQL에서 Inner Join의 강점을 보여줍니다. 이는 공통 관계에 따라 여러 테이블에서 데이터를 결합하여 분석이나 보고 목적으로 포괄적인 데이터 집합을 편집하는 데 도움이 됩니다.

```js
SELECT o.order_id, c.customer_name
FROM ORDERS o
INNER JOIN chapter04.CUSTOMERS c ON o.customer_id = c.customer_id;
```

이 쿼리는 주문 ID와 해당 주문을 한 고객의 이름을 반환합니다. 이는 주문 및 고객 테이블 간의 공통 customer_id 필드를 기반으로 Inner Join을 수행하여 가능합니다.

SQL 쿼리에서 'o'를 ORDERS 테이블과 'c'를 CUSTOMERS 테이블에 대한 별칭으로 사용하면 구문을 간소화할 수 있습니다.

<div class="content-ad"></div>

예를 들어, 주문 ID와 고객 이름을 검색하려면 INNER JOIN을 사용하여 customer_id와 같은 공통 열을 기준으로 이러한 테이블을 연결할 수 있습니다.

```js
SELECT p.order_id, c.customer_name
FROM ORDERS p
INNER JOIN CUSTOMERS c ON p.customer_id = c.customer_id;
```

이 쿼리는 WHERE 절을 사용하여 두 테이블을 연결하는 대안으로 INNER JOIN 구문을 활용하여 customer_id에 따라 주문과 고객을 효과적으로 매칭합니다.

INNER JOIN의 사용법을 보여드린 것은, 명확한 관계가 존재하는 데이터를 가져오는 능력 때문에 널 값이 발생하지 않습니다. INNER JOIN 대신 WHERE 절을 사용하여 직접 열을 비교할 수 있어 이와 동일한 결과를 얻을 수 있습니다.

<div class="content-ad"></div>

두 개의 쿼리를 옆으로 배치하면 차이가 명확해집니다. 두 쿼리를 실행하면 동일한 결과가 나옵니다. INNER JOIN이 교집합 집합 이론에서의 역할을 강조합니다 — 이는 초등 교육에서 소개된 개념입니다.

테이블 조인을 위해 INNER JOIN 또는 WHERE를 사용하는 것은 개인적인 선택입니다. WHERE를 선호하는 사람도 있을 수 있습니다. 이는 직접적인 연결 이해와 일치하기 때문에 테이블 연결을 간편하게 만들 수 있습니다. 그러나 두 방법 간에는 문법적인 차이가 있으므로 문법 인식이 중요합니다.

```js
# 주문 ID, 고객 이름, 영업 담당자 이름 반환
# 3개의 테이블과의 Inner Join

SELECT O.order_id, C.customer_name, S.salesperson_name
FROM chapter04.ORDERS AS O
INNER JOIN chapter04.CUSTOMERS AS C ON O.customer_id = C.customer_id
INNER JOIN chapter04.SALESPERSON AS S ON O.salesperson_id = S.salesperson_id;
```

이 쿼리는 ORDERS, CUSTOMERS, SALESPERSONS 세 개의 테이블에서 INNER JOIN을 실행하여 각 주문의 주문 ID, 고객 이름 및 영업 담당자 이름을 검색합니다.

<div class="content-ad"></div>

ORDERS 테이블에서 시작하여 customer_id를 매칭하여 CUSTOMERS와 조인한 다음, salesperson_id를 기준으로 SALESPERSONS와 또 다른 조인을 수행합니다.

이 쿼리는 데이터를 교차시켜 테이블 간 관련 레코드의 가장 작은 집합으로 결과를 제한하며, 세 주문과 해당하는 고객 및 영업사원을 리턴합니다.

이 접근 방식은 정확하지만 INNER JOIN을 사용하지 않고 대안적인 방법으로 적용할 수도 있어 이해를 간소화할 수 있습니다.

```js
SELECT O.order_id, C.customer_name, S.salesperson_name
FROM chapter04.ORDERS AS O, 
chapter04.CUSTOMERS AS C, 
chapter04.SALESPERSONS AS S
WHERE O.customer_id = C.customer_id
AND O.salesperson_id = S.salesperson_id;
```

<div class="content-ad"></div>

이 쿼리는 WHERE 절을 사용하여 customer_id와 salesperson_id를 일치시켜 ORDERS, CUSTOMERS, 그리고 SALESPERSON 테이블을 조인하고, 괄호 없이 주문 ID, 고객 이름, 그리고 영업 직원 이름을 검색합니다.

이 접근 방식은 ID를 직접 비교하여 이해를 단순화하고, 필요한 데이터 관계를 설정하여 다수의 테이블에 확장 가능한 논리적 방식으로 INNER JOIN을 수행하는 간단한 방법을 보여줍니다.

이 방법은 가장 일반적인 테이블 조인 기법 중 하나를 보여주며, 이 코스에서 더 자세히 탐구할 다양한 조인 방법을 시사합니다.

# INNER JOIN 사용 및 구문에 대한 심층적 탐색

<div class="content-ad"></div>

INNER JOIN에 대해 더 깊이 들어가 봅시다. INNER JOIN은 WHERE, ORDER BY, GROUP BY 등의 SQL 절과 결합할 수 있는 가장 일반적인 조인 유형입니다.

```js
# Inner Join - ANSI 표준
SELECT O.order_id, C.customer_name
FROM chapter04.ORDERS AS O
JOIN chapter04.CUSTOMERS AS C ON O.customer_id = C.customer_id;
```

위 쿼리는 ANSI 표준 INNER JOIN을 보여주며, 이는 이전에 사용한 것으로, ANSI 표준을 준수하는 데이터베이스 관리 시스템(DBMS) 전반에서 보편적으로 지원되는 형식입니다.

거의 모든 최신 DBMS가 이 표준을 지원하여 호환성을 확보합니다. 흥미로운 점은 INNER를 생략하고 JOIN만 사용하면 동일한 결과를 얻는다는 것이며, 이는 JOIN 만으로도 기본적으로 INNER JOIN으로 간주됨을 보여줍니다.

<div class="content-ad"></div>

그러나 LEFT JOIN 또는 RIGHT JOIN의 경우 "left" 또는 "right" 특정 키워드를 명시적으로 사용해야합니다.

# USING 절을 사용한 INNER JOIN 단순화

동일한 이름의 열을 사용하여 테이블을 조인할 때, USING 절은 간편한 방식을 제공합니다. ON 절에서 각 테이블의 열을 명시하는 대신, USING은 조인을 위한 공통 열을 직접 식별합니다. 이 방법은 코드 가독성을 향상시키며, SQL뿐만 아니라 모든 프로그래밍 관행에서 중요합니다. 명확하고 이해하기 쉬운 코드를 유지하면 향후 검토나 수정이 보다 쉬워지며, 여러분이나 다른 사람들이 코드를 유지할 때 도움이 됩니다.

다음은 테이블 간에 동일한 이름을 갖는 열에 대해 USING을 사용하여 INNER JOIN을 적용하고, 결과를 필터링하고 정렬하는 방법입니다:

<div class="content-ad"></div>

```sql
# INNER JOIN과 WHERE, ORDER BY 사용한 쿼리
SELECT O.order_id, C.customer_name
FROM chapter04.ORDERS AS O
INNER JOIN chapter04.CUSTOMERS AS C USING (customer_id)
WHERE C.customer_name LIKE 'Bob%'
ORDER BY O.order_id DESC;
```

이 쿼리는 주문 및 고객 이름을 추출하는 데 초점을 맞추며, 구체적으로 "Bob"이라는 이름을 가진 고객을 대상으로 하고 주문 ID를 기준으로 내림차순으로 결과를 정렬합니다.

테이블 간의 관계를 customer_id를 사용하여 활용함으로써, 이 쿼리는 근사적인 일치를 나타내는 LIKE 연산자를 사용하여 "Bob"으로 시작하는 모든 이름을 캡처하는 데이터를 능숙하게 필터링합니다.

이 체계적인 방법은 SQL의 INNER JOIN의 적응성과 깊이를 강조하며, 다른 절과 결합될 때 데이터 분석의 범위를 크게 확장시킵니다.

<div class="content-ad"></div>

쿼리가 여러 테이블을 조인하고 필터를 적용하거나 정렬 또는 그룹화를 실행하는 등 보다 정교한 데이터 조작 기술로 진화하는 방식을 보여줍니다. 이어지는 장에서는 더 복잡한 데이터 조작 기법을 약속합니다.

# SQL에서 LEFT JOIN 탐색

INNER JOIN을 탐색한 후에 이제 LEFT JOIN에 주목해 보겠습니다.

이 유형의 조인은 오른쪽 테이블에 일치하는 항목이 있는지 여부와 관계없이 왼쪽 테이블의 모든 레코드를 포함하여 테이블 간 관계를 보다 폭넓게 이해할 수 있습니다.

<div class="content-ad"></div>

이 방법을 사용하면 이론에서 실제 SQL 코드 구현으로 원활하게 전환하여 개념을 포괄적으로 이해할 수 있습니다.

```js
# WHERE 및 ORDER BY를 사용한 Inner Join

SELECT O.order_id, C.customer_name
FROM chapter04.ORDERS AS O
INNER JOIN chapter04.CUSTOMERS AS C USING (customer_id)
WHERE C.customer_name LIKE 'Bob%'
ORDER BY O.order_id DESC;
```

# 데이터 검색을 위한 LEFT JOIN 활용

MySQL Workbench에서 INNER JOIN을 활용한 주문 ID와 고객명을 가져오는 시나리오입니다.

<div class="content-ad"></div>

그러나 일부 고객이 아직 주문을하지 않았을 수 있다는 점을 인식하여, 주문 상태에 관계없이 모든 고객을 포함하는 쿼리를 찾고 있습니다. 이 경우 INNER JOIN은 목적에 부합하지 않습니다. 왜냐하면 주문이 있는 고객만 반환하기 때문입니다.

이를 해결하기 위해 LEFT JOIN이 선택된 도구가 되어, 왼쪽 테이블에서 일치 항목이 없는 고객까지 모두 검색할 수 있도록 해줍니다. 따라서 보고서나 관리 인사이트를 위한 완전한 데이터 세트를 제공합니다.

```js
# Left Join – 오른쪽 테이블에서 일치 항목이 없어도 왼쪽 테이블의 모든 데이터를 가져오고자 함
SELECT C.customer_name, O.order_id
FROM chapter04.CUSTOMERS AS C
LEFT JOIN chapter04.ORDERS AS O ON C.customer_id = O.customer_id;
```

# LEFT JOIN으로 쿼리 순서에 미치는 영향

<div class="content-ad"></div>

쿼리에서 테이블의 순서는 결과에 큰 영향을 미칩니다.

이를 보여주기 위해, 'C'를 CUSTOMERS에, 'P'를 CORDERS에 별칭으로 사용하여 고객 이름과 주문 ID를 가져오는 쿼리를 설정했습니다.

LEFT JOIN을 실행하여, 모든 주문과 관련이 있는지 없는지와 상관없이 모든 고객을 포함하는 것이 목표였습니다. 이 기술을 사용하면 주문을 한 고객 및 주문이 없는 고객을 NULL로 나타낼 수 있습니다.

NULL을 설명적인 값으로 대체하기 위해 CASE 문을 사용하는 등의 조정을 통해 출력을 더 정제할 수 있습니다. 궁극적으로 LEFT JOIN(또는 LEFT OUTER JOIN으로 교차 사용 가능)을 사용하면 왼쪽 테이블의 모든 항목이 반환되어 오른쪽 테이블에서 일치하는 레코드 여부에 관계없이 데이터 무결성을 유지할 수 있습니다.

<div class="content-ad"></div>

```sql
SELECT C.customer_name, O.order_id
FROM chapter04.CUSTOMERS AS C
LEFT OUTER JOIN chapter04.ORDERS AS O 
ON C.customer_id = O.customer_id;
```

# LEFT JOIN vs. LEFT OUTER JOIN

LEFT OUTER JOIN을 사용하면 LEFT JOIN과 동일한 결과가 나오며 SQL에서 두 용어가 서로 바꿔 사용될 수 있음을 강조합니다. 그러나 "LEFT"를 제거하면 쿼리의 동작이 근본적으로 변경되어 INNER JOIN으로 기본 설정되어 오른쪽 테이블과 일치하는 레코드에만 중점이 맞춰집니다.

이 차이점은 "LEFT"를 명시하여 왼쪽 테이블의 모든 레코드를 포함시킬 중요성을 강조합니다.

<div class="content-ad"></div>

OUTER 옵션을 사용하는 것은 주로 간소화를 위해 생략되는 경우가 많습니다. 쿼리에서 테이블 순서를 변경해 보는 것은 더 많은 통찰력을 제공할 수 있으며, 해당 조정이 쿼리 결과에 미치는 영향을 완전히 이해하기 위해 실험하는 것을 촉구합니다.

```js
# 테이블 순서를 바꾸면 결과가 달라집니다
SELECT C.customer_name, O.order_id
FROM chapter04.ORDERS AS P
LEFT JOIN chapter04.CUSTOMERS AS C 
ON C.customer_id = P.customer_id;
```

# LEFT JOIN 쿼리에서 테이블 순서의 영향

위에 표시된 LEFT JOIN 쿼리를 실행하면, 모든 고객이 올바르게 반환되며, 그들이 주문을 한 여부에 상관없이 모두 포함됩니다.

<div class="content-ad"></div>

테이블 순서를 반전하여 LEFT JOIN을 유지하더라도 결과가 크게 바뀐다는 것을 알 수 있습니다. 이는 INNER JOIN의 동작과 유사한 모습을 보여줍니다.

LEFT 또는 RIGHT JOIN을 사용할 때 테이블의 순서가 중요하며, 방향(왼쪽 또는 오른쪽)은 어떤 테이블의 레코드가 결과에 완전하게 포함될지를 지정합니다.

다음 수업에서는 이 개념을 더 깊이 탐구하여 RIGHT JOIN을 살펴보고, SQL 조인 작업 및 테이블 순서에 대한 의존성을 이해하는 데 도움이 될 것입니다.

# RIGHT JOIN을 사용하여 테이블 순서 문제 해결하기

<div class="content-ad"></div>

이전 비디오에서는 주문이 있는 경우에도 고객을 모두 포함하는 LEFT JOIN을 탐색했어요. 표의 순서를 바꾸면 INNER JOIN과 유사한 동작을 나타냈죠.

표를 재배열하지 않고 이를 해결하기 위해 RIGHT JOIN이 해답이에요. 이는 오른쪽 테이블(이 경우 CUSTOMERS)의 모든 항목이 포함되도록 합니다. 왼쪽 테이블(ORDERS)에서 일치하는 값이 없어도요. 이 접근 방식은 초기 LEFT JOIN 전략을 반대로 하여 포괄적 데이터 검색을 위해 오른쪽 테이블에 중점을 둡니다.

```js
# Right Join – 왼쪽 테이블에서 일치하는 값이 없어도 오른쪽 테이블의 모든 데이터를 가져오고 싶다는 것을 나타냅니다
SELECT C.customer_name, O.order_id
FROM chapter04.ORDERS AS P
RIGHT JOIN chapter04.CUSTOMERS AS C 
ON C.customer_id = P.customer_id;
```

# 표준 접근법을 이용한 JOIN 전략 최적화

<div class="content-ad"></div>

테이블 순서를 변경하는 것은 번거로울 수 있습니다. 따라서 포괄적인 보고서를 위해 항상 LEFT JOIN을 사용하는 선호도가 있습니다.

이 개인적인 전략은 일관된 패턴을 확립하여 쿼리 실행을 간소화하고 학습 및 기억을 향상시킵니다. 일상 업무에서 이러한 표준을 채택하면 SQL 개념을 신속하게 이해하고 적용하는 데 도움이 됩니다. LEFT 또는 RIGHT JOIN 선택은 테이블 위치 및 모든 데이터를 포함해야 하는 요구에 따라 다릅니다.

이 체계적인 방법론은 효율적이고 효과적인 데이터 검색을 위해 SQL 실습에서 일관성의 중요성을 강조합니다.

# 포괄적 데이터 분석을 위한 쿼리 작성

<div class="content-ad"></div>

해당 작업은 주문 날짜, 고객 이름 및 모든 판매원을 반환하는 쿼리를 작성하는 것입니다. 주문과 연관이 있는 여부에 관계 없이 모든 판매원을 고객 이름순으로 정렬하여야 합니다.

LEFT JOIN, RIGHT JOIN 또는 INNER JOIN을 사용할지 여부는 특정 데이터 검색 목표에 따라 결정되며, 학습 과정에서 문제 해결 능력의 중요성을 강조합니다. 아래는 이 작업을 수행하는 방법입니다:

```js
# 주문 날짜, 고객 이름 및 모든 판매원을 고객 이름순으로 확인
SELECT O.order_date, C.customer_name, S.salesperson_name
FROM chapter04.ORDERS AS O
JOIN chapter04.CUSTOMERS AS C ON O.customer_id = C.customer_id
RIGHT JOIN chapter04.SALESPERSON AS S ON O.salesperson_id = S.salesperson_id
ORDER BY C.customer_name;
```

이 해결책은 모든 관련 데이터를 포함해야 하는 요구사항에 따라 적절한 JOIN 유형을 선택해야 함을 보여줍니다. 여기서는 주문과 관련이 있는지 여부에 관계 없이 모든 판매원이 나열되고 결과를 고객 이름으로 정렬합니다.

<div class="content-ad"></div>

해당 쿼리는 정확한 데이터 쿼리 기술을 통해 비즈니스 요구 사항을 해결하는 SQL의 전략적 측면을 강조합니다.

이 쿼리는 모든 주문에 대한 주문 날짜와 고객 이름을 제공하며, 모든 영업사원을 포함합니다. 연관된 주문이 있는 경우와 없는 경우 모두 결과를 정렬하여 고객 이름을 기준으로 정렬합니다. 영업사원이 연관된 주문이 없는 경우 결과에서 주문 날짜와 고객 이름 필드는 NULL일 것입니다.

```js
# 주문 날짜, 고객 이름, 모든 영업사원을 반환하며, 연관된 주문이 있는지 여부에 관계없이 결과를 고객 이름을 기준으로 정렬합니다.
SELECT
  CASE
    WHEN O.order_date IS NULL THEN '주문 없음'
    ELSE O.order_date
  END AS order_date,
  CASE
    WHEN C.customer_name IS NULL THEN '주문 없음'
    ELSE C.customer_name
  END AS customer_name,
  S.salesperson_name
FROM chapter04.ORDERS AS O
JOIN chapter04.CUSTOMERS AS C ON O.customer_id = C.customer_id
RIGHT JOIN chapter04.SALESPERSON AS S ON O.salesperson_id = S.salesperson_id
ORDER BY C.customer_name;
```

# 조건부 서식을 사용하여 결과 향상하기

<div class="content-ad"></div>

CASE 문을 사용하여 조건부 논리를 실행함으로써 보고서에는 널 값이 표시되지 않도록 보장합니다.

그 대신, 누락된 주문 날짜 또는 고객 이름은 '주문 없음'으로 레이블이 지정되어, 임원 검토를 위해 명확성과 유틸리티를 향상시켜줍니다.

이 쿼리는 주문 결과를 고객 이름별로 철저하게 정렬하여, 조직적이고 정보를 얻기 쉬운 출력을 제공하여 추가 분석이나 프레젠테이션에 적합합니다.

```js
SELECT
  CASE
    WHEN O.order_date IS NULL THEN '주문 없음'
    ELSE O.order_date
  END AS order_date,
  CASE
    WHEN C.customer_name IS NULL THEN '주문 없음'
    ELSE C.customer_name
  END AS customer_name,
  S.salesperson_name
FROM chapter04.ORDERS AS O
RIGHT JOIN chapter04.CUSTOMERS AS C ON O.customer_id = C.customer_id
RIGHT JOIN chapter04.SALESPERSON AS S ON O.salesperson_id = S.salesperson_id
ORDER BY C.customer_name;
```

<div class="content-ad"></div>

이 방식은 철저한 데이터 수집의 즉각적인 요구 사항 뿐만 아니라 널 값(null values)을 의미 있는 자리 표시자로 대체함으로써 보고서의 표현을 개선하여, 경영 총괄 또는 분석 처리에 대비한 완전히 형식화된 뷰를 제공합니다.

# 참조 무결성 오류 해결

ORDERS 테이블에 “고아(orphans)” 레코드를 추가하는 것 — 해당 고객이나 판매원과 연관이 없는 주문 —은 관계형 데이터베이스에서 참조 무결성을 유지하는 도전을 강조합니다.

이 개념은 데이터베이스의 모든 레코드가 적절하게 연결되어 있어 고아 데이터의 존재를 방지하는 것을 보장합니다.

<div class="content-ad"></div>

그러나 이 예제는 이러한 제약 조건을 우회하여 SQL이 이러한 불일치를 식별하는 데 어떻게 사용될 수 있는지 보여주기 위해 일부러 만들어졌습니다.

```js
INSERT INTO `chapter04`.`ORDERS` (`order_id`, `customer_id`, `salesperson_id`, `order_date`, `delivery_id`)
VALUES (1004, 10, 6, NOW(), 23);
```

성공적으로 실행된 이 삽입은 참조 무결성 검사가 적용되지 않았음을 나타내며, 유효한 고객 링크가 없는 주문을 만들 수 있게 했습니다.

이 시나리오는 성능 저하와 데이터 불일치로 이어질 수 있는 일반적인 데이터베이스 문제를 나타냅니다. 성능 문제를 해결하기 위해 일시적으로 참조 무결성을 비활성화하는 경우도 있지만, 속도를 위해 데이터 무결성이 더 손상될 수 있습니다.

<div class="content-ad"></div>

오늘은 주체 없는 레코드를 식별하는 SQL 전략에 대해 살펴보겠습니다. 데이터 신뢰성과 시스템 무결성을 보장하기 위해 견고한 데이터베이스 관리 관행의 중요성을 강조할 것입니다.

# SQL 조인을 활용한 주체 없는 레코드 식별

의도적으로 데이터베이스에 도입된 주체 없는 레코드를 식별하는 과제에 대처하기 위해 SQL 조인의 사용법을 살펴보겠습니다.

이러한 문제를 생성하고 해결하는 일련의 과정은 SQL 지식을 실제 시나리오에서 실용적으로 적용하는 가치 있는 학습 도구로 작용합니다.

<div class="content-ad"></div>

LEFT JOIN을 사용하여 고객 및 해당 주문 ID를 모두 검색하여 주문이 존재하지 않는 경우에는 주문이 없는 상태인 NULL 값을 사용하여 고아 레코드를 감지하려고 시도했습니다:

```js
# 누락된 주문 식별을 위한 Left Join
SELECT C.customer_name, O.order_id
FROM chapter04.CUSTOMERS AS C
LEFT OUTER JOIN chapter04.ORDERS AS O ON C.customer_id = O.customer_id;
```

이 쿼리는 모든 고객을 성공적으로 나열하며, 주문이 누락될 때 NULL 주문 ID로 나타냅니다. 그러나 모든 종류의 고아 레코드를 감지하는 문제를 완전히 해결하지는 않습니다. RIGHT JOIN으로 전환하면 고객이 없는 주문을 제외하고 연결된 고객이 없는 주문을 나열할 수 있습니다.

모든 불일치 사항을 종합적으로 식별하기 위한 논리적 단계는 LEFT 및 RIGHT JOIN의 통찰을 결합하려고 하는 FULL OUTER JOIN을 사용하는 것입니다.

<div class="content-ad"></div>

FULL OUTER JOIN은 모든 SQL 데이터베이스 관리 시스템에서 일반적으로 지원되지 않으므로 MySQL을 포함한 SQL에서 모든 고아 레코드를 식별하는 포괄적인 솔루션을 제공하기 위해 분리된 LEFT 및 RIGHT JOIN 쿼리의 결과를 병합하기 위해 UNION을 사용하는 것이 논리적인 다음 단계입니다. 이 방법은 다음 레슨에서 자세히 다룰 예정입니다.

# UNION과 UNION ALL 데이터 검색 활용하기

주문 및 고객을 모두 식별하는 도전을 해결하기 위해 관련이 없는 것을 포함하여 SQL은 UNION과 UNION ALL 명령을 제공합니다. 이러한 명령은 별도의 쿼리 결과를 병합하여 완전한 데이터 세트를 형성합니다.

- LEFT OUTER JOIN: 주문이 없는 모든 고객을 검색하며, NULL로 표시된 미배치 주문을 포함합니다.

<div class="content-ad"></div>

```js
SELECT C.customer_name, O.order_id
 FROM chapter04.CUSTOMERS AS C
 LEFT OUTER JOIN chapter04.ORDERS AS O ON C.customer_id = O.customer_id;
```

- RIGHT OUTER JOIN: 연결된 고객이 없어도 모든 주문을 포착합니다.

```js
SELECT C.customer_name, O.order_id
 FROM chapter04.CUSTOMERS AS C
 RIGHT OUTER JOIN chapter04.ORDERS AS O ON C.customer_id = O.customer_id;
```

- UNION ALL: 위의 조인 결과를 결합하여 중복을 허용합니다.
- UNION: UNION ALL과 유사하지만 중복 레코드를 제거하여 고유한 결과만 반환합니다.

<div class="content-ad"></div>

UNION과 UNION ALL의 주요 차이점은 중복 핸들링에 있습니다: UNION ALL은 중복을 포함하여 모든 레코드를 포함하고, UNION은 중복을 필터링하여 고유한 결과만 표시합니다.

이 차이는 종합적인 데이터 포함이 필요한 작업 또는 정제된, 고유한 결과가 필요한 작업에 중요합니다.

UNION 명령을 사용할 때 중요한 고려 사항은 결합된 쿼리 전체에 걸친 열의 개수와 유형을 일치시키고 데이터 무결성 및 쿼리 성능을 보장하기 위해 일관된 열 순서를 유지하는 것입니다.

UNION 작업은 성능에 영향을 미칠 수 있지만, FULL OUTER JOIN을 지원하지 않는 환경에서 원하는 데이터 컴파일을 달성하는 유일한 해결책일 수 있습니다.

<div class="content-ad"></div>

# 테이블 조인 요약

이번 개요는 SQL Server 커뮤니티에서 주목받는 인물인 Steve Stedman이 작성한 차트를 참조하고 있습니다. 해당 차트는 SQL Server 및 MySQL와 같은 다른 SQL 데이터베이스 시스템에서 적용 가능한 다양한 조인 유형을 설명하고 있습니다.

Stedman의 블로그는 데이터베이스 지식을 널리 보급해 왔으며 SQL Server의 미묘한 점들을 강의 및 참고 자료를 통해 제공하고 있습니다.

<div class="content-ad"></div>

- 기본 선택 및 조인: 두 테이블에서 데이터를 선택하는 것으로 시작하여 INNER JOIN(교차), LEFT 및 RIGHT OUTER JOINS를 다루며 'OUTER' 키워드 없이도 동등성을 강조합니다.
- 고급 조인 개념: SEMI-JOIN 및 ANTI-SEMI-JOIN을 소개하며 SQL의 EXISTS 연산자를 사용하여 데이터를 고유하게 필터링하고, 한 테이블에서 부분 또는 배타적 데이터 집합을 검색하는 방법을 보여줍니다.
- CROSS 및 FULL OUTER JOINS: CROSS JOIN(카테시안 곱)과 FULL OUTER JOIN(일치하는 항목이 있는 경우와 없는 모든 레코드를 결합)을 구별하며, 그래픽 표현에서 보이는 유사성에 대해 경계를 주의합니다.
- 연합 작업: UNION 및 UNION ALL을 사용하여 직접적인 지원이 없는 시스템에서 FULL OUTER JOIN 효과를 모방하는 방법을 설명하며 포괄적인 데이터 통합을 달성합니다.
- 복잡한 관계: 다양한 조인 유형을 통해 다중 테이블 관계를 처리하는 것으로 마무리되며, 질의 복잡성 및 데이터 검색 능력을 향상시킵니다.

이 차트는 기본부터 복잡한 시나리오까지 SQL 조인을 적용하는 실용적인 가이드로, SQL에서 테이블 조인 기술을 숙달하기 위해 실습을 장려합니다.

# *SQL 테이블 조인에 대한 결론

이 글을 통해 SQL에서 테이블 조인의 세계로 들어가 보았습니다. 관계형 데이터베이스를 다루는 데 중요한 측면 중 하나입니다. Steve Stedman의 블로그와 MySQL Workbench와 같은 도구에서의 실습을 통해, 다양한 조인 유형을 통해 효과적인 데이터 조작을 둘러싼 복잡성의 층을 해제해 나갔습니다.

<div class="content-ad"></div>

INNER JOIN과 LEFT 및 RIGHT OUTER JOIN의 적응성부터 직접적인 지원이 없는 시스템에서 FULL OUTER JOIN을 구현하는 도전에 대처하는 기본 조작부터, 조인 유형의 선택이 쿼리 결과와 성능에 직접적 영향을 미친다는 것을 배웠습니다. 우리는 참조 무결성의 가치를 강조했고 고아 레코드를 감지하고 해결하는 방법을 강조하여 데이터 일관성과 신뢰성을 보장했습니다.

UNION 및 UNION ALL을 결합하여 완전한 조인을 시뮬레이트하고 CROSS JOIN을 특정 시나리오에 적용함으로써 SQL의 다양성을 강조하여 복잡한 데이터 분석 요구를 충족시키는 능력을 보여주었습니다. 반 조인과 안티-반 조인과 같은 고급 개념을 소개하여 SQL이 특정 데이터 필터링과 선택을 위해 능력을 강조하여 전통적인 조인 경계를 넘어섰습니다.

이 기사는 쿼리 표준을 설정하고 코드 가독성을 유지하며 데이터베이스 유지, 이해 및 확장을 시간이 지남에 걸쳐 용이하게 하는 중요성을 재확인했습니다. 우리는 계속된 학습과 실험을 촉구하며, 마주한 각 도전을 극복함으로써 SQL 능력을 향상시키고 전문가들이 복잡한 비즈니스 문제를 효율적으로 정확하게 해결할 수 있도록 장비를 되찾습니다.

요약하자면, 테이블 조인은 단순히 기술적 도구가 아니라, 원시 데이터를 가치 있는 통찰로 변환하는 의미 있는 쿼리를 만드는 기본입니다. 우리가 향향할 미래 챕터로 나아가면서, 자신감과 전문지식을 갖춘 방대한 데이터베이스 세계를 탐색하는 데 필요한 견고한 지식 기반과 실무 경험을 지속적으로 가지고 있습니다.

<div class="content-ad"></div>

감사합니다! 🐼❤️