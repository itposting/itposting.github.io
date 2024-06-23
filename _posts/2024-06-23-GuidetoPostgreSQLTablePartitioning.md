---
title: "PostgreSQL 테이블 파티셔닝 가이드 효율적인 데이터 관리 방법"
description: ""
coverImage: "/assets/img/2024-06-23-GuidetoPostgreSQLTablePartitioning_0.png"
date: 2024-06-23 16:43
ogImage: 
  url: /assets/img/2024-06-23-GuidetoPostgreSQLTablePartitioning_0.png
tag: Tech
originalTitle: "Guide to PostgreSQL Table Partitioning"
link: "https://medium.com/@rasiksuhail/guide-to-postgresql-table-partitioning-c0814b0fbd9b"
---



![2024-06-23-GuidetoPostgreSQLTablePartitioning](/assets/img/2024-06-23-GuidetoPostgreSQLTablePartitioning_0.png)

PostgreSQL는 강력한 오픈 소스 관계형 데이터베이스 관리 시스템으로 대규모 및 복잡한 데이터 세트를 관리하기 위한 다양한 고급 기능을 제공합니다. 이 중 하나가 테이블 파티셔닝 기능입니다. 이 기능을 사용하면 대규모 테이블을 더 작고 관리하기 쉬운 파티션으로 나눌 수 있습니다.

# 테이블 파티셔닝이란?

테이블 파티셔닝은 대규모 테이블을 더 작고 관리하기 쉬운 청킹된 파티션으로 나누는 데이터베이스 디자인 기술입니다. 각 파티션은 본질적으로 원본 데이터의 하위 집합을 저장하는 별도의 테이블입니다. 이 기술을 사용하면 대규모 데이터 세트에 대한 쿼리 성능과 데이터 관리를 크게 향상시킬 수 있습니다.


<div class="content-ad"></div>

파티셔닝은 날짜 열이나 값 범위와 같은 하나 이상의 열을 기준으로 수행될 수 있습니다. 예를 들어, 레코드의 날짜를 기반으로 테이블을 파티션할 수 있으며, 각 파티션은 특정 날짜 범위의 데이터를 나타냅니다. 데이터를 쿼리할 때 PostgreSQL은 쿼리에 관련이 없는 파티션을 빠르게 제거하여 빠른 쿼리 실행을 가능하게 합니다.

# 테이블 파티셔닝의 장점

- 향상된 쿼리 성능: 파티셔닝을 통해 데이터베이스가 데이터를 특정 파티션으로 빠르게 좁힐 수 있어 쿼리 중 스캔해야 하는 데이터 양이 줄어들어 더 빠른 쿼리 실행 시간을 가능하게 합니다, 특히 대규모 데이터 집합의 경우에는 특히 유용합니다.
- 쉬운 데이터 관리: 테이블 파티셔닝을 통해 대규모 데이터 집합을 더 작고 관리하기 쉬운 파티션으로 분할하여 쉽게 관리할 수 있습니다. 데이터 아카이빙, 데이터 삭제, 백업 및 복원 작업과 같은 작업을 단순화할 수 있습니다.
- 향상된 데이터 로딩 및 인덱싱: 파티션된 테이블에 데이터를로드할 때 프로세스를 병렬화할 수 있어 더 빠른 데이터 삽입이 가능합니다. 또한 파티션된 테이블에있는 인덱스는 더 효율적일 수 있으며 더 작은 데이터 하위 집합만 다루면 되기 때문에 데이터 처리 속도가 빨라질 수 있습니다.
- 비용 효율적인 스토리지: 파티셔닝을 통해 오래된 데이터나 덜 액세스되는 데이터를 더 저렴한 스토리지 미디어에 저장할 수 있으며, 자주 액세스되는 데이터는 더 빠른 스토리지 장치에 유지할 수 있습니다.

# PostgreSQL에서의 파티셔닝 방법

<div class="content-ad"></div>

PostgreSQL는 다음과 같은 다양한 분할 방법을 제공합니다:

- 범위 분할 (Range Partitioning)
- 목록 분할 (List Partitioning)
- 해시 분할 (Hash Partitioning)

## 범위 분할 (Range Partitioning)

범위 분할은 특정 열의 지정된 값 범위를 기반으로 데이터를 분할하는 테이블 분할의 일종입니다. 이는 시계열 데이터나 자연적인 순서를 갖는 데이터를 다룰 때 유용합니다. 각 파티션은 고유한 값 범위를 나타내며, 그 범위 내에 속하는 데이터는 해당 파티션에 저장됩니다. 범위 분할을 사용하면 특정 범위 내의 데이터를 효율적으로 검색할 수 있어 쿼리 성능이 향상됩니다.

<div class="content-ad"></div>

다음과 같은 구조로 sales 테이블의 예제를 고려해 봅시다.


CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sale_date DATE,
    product_id INT,
    quantity INT,
    amount NUMERIC
) partition by range (sale_date);


sale_date 열을 기준으로 한 판매 데이터에 대한 범위 분할 테이블을 생성하기 위해서는 다음 단계를 따라해야 합니다:

파티션 생성

<div class="content-ad"></div>

각 날짜 범위를 나타내는 개별 테이블을 만들 것입니다. 데모를 위해 "sales_january," "sales_february," 그리고 "sales_march" 세 개의 파티션을 만들 것입니다.

```js
CREATE TABLE sales_january PARTITION OF sales
    FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');

CREATE TABLE sales_february PARTITION OF sales
    FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');

CREATE TABLE sales_march PARTITION OF sales
    FOR VALUES FROM ('2023-03-01') TO ('2023-04-01');
```

제약 설정하기

각 파티션에 제약 조건을 정의하여 데이터가 올바른 파티션으로 라우팅되도록 보장해야 합니다. 이 예제에서는 각 파티션의 sale_date 열에 대해 CHECK 제약 조건을 사용할 것입니다.

<div class="content-ad"></div>

```js
ALTER TABLE sales_january ADD CONSTRAINT sales_january_check
    CHECK (sale_date >= '2023-01-01' AND sale_date < '2023-02-01');

ALTER TABLE sales_february ADD CONSTRAINT sales_february_check
    CHECK (sale_date >= '2023-02-01' AND sale_date < '2023-03-01');

ALTER TABLE sales_march ADD CONSTRAINT sales_march_check
    CHECK (sale_date >= '2023-03-01' AND sale_date < '2023-04-01');
```

파티션에 데이터 삽입

이제 sales 테이블에 데이터를 삽입할 수 있고, PostgreSQL은 sale_date를 기준으로 데이터를 적절한 파티션으로 자동으로 라우팅할 것입니다:

```js
INSERT INTO sales (sale_date, product_id, quantity, amount)
VALUES ('2023-01-15', 101, 5, 100.00);

INSERT INTO sales (sale_date, product_id, quantity, amount)
VALUES ('2023-02-20', 102, 10, 200.00);

INSERT INTO sales (sale_date, product_id, quantity, amount)
VALUES ('2023-03-10', 103, 8, 150.00);
```

<div class="content-ad"></div>

파티션에서 데이터 조회하기

데이터를 조회할 때, PostgreSQL은 WHERE 절을 기반으로 관련 파티션에만 자동으로 액세스합니다.

```js
-- 1월의 판매 데이터 검색
SELECT * FROM sales WHERE sale_date >= '2023-01-01' AND sale_date < '2023-02-01';

-- 2월의 판매 데이터 검색
SELECT * FROM sales WHERE sale_date >= '2023-02-01' AND sale_date < '2023-03-01';

-- 3월의 판매 데이터 검색
SELECT * FROM sales WHERE sale_date >= '2023-03-01' AND sale_date < '2023-04-01';
```

이러한 쿼리는 적절한 파티션에만 액세스하므로 쿼리 성능이 향상됩니다.

<div class="content-ad"></div>

# PostgreSQL에서의 List Partitioning

리스트 파티셔닝은 PostgreSQL에서의 다른 종류의 테이블 파티셔닝 방법으로, 데이터가 특정 열의 값에 기반하여 파티션으로 분할되는 방식입니다. 값의 범위를 사용하는 범위 파티셔닝과 달리, 리스트 파티셔닝은 각 파티션에 대한 특정 값을 정의할 수 있게 합니다. 이 파티셔닝 기술은 데이터를 구별되고 서로 겹치지 않는 세트로 분류할 수 있는 경우에 유용합니다.

다음과 같은 구조를 가진 제품 테이블의 예시를 살펴봅시다:

```js
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category TEXT,
    product_name TEXT,
    price NUMERIC
) partition by list(category);
```

<div class="content-ad"></div>

제품 데이터를 카테고리 열을 기반으로 한 테이블 분할 테이블을 만들기 위해서는 다음 단계를 따라야합니다:

분할 생성

각 분할을 나타내는 개별 테이블을 만들어야 합니다. 각 분할은 특정 카테고리의 제품을 커버하도록 설계됩니다. 데모를 위해 "전자제품", "의류", "가구" 세 가지 분할을 만들어 보겠습니다.

```js
CREATE TABLE electronics PARTITION OF products
    FOR VALUES IN ('전자제품');

CREATE TABLE clothing PARTITION OF products
    FOR VALUES IN ('의류');

CREATE TABLE furniture PARTITION OF products
    FOR VALUES IN ('가구');
```

<div class="content-ad"></div>

제약 조건 설정

리스트 분할은 특정 값에 기반을 두기 때문에 CHECK 제약 조건이 필요하지 않습니다. 그러나 적절한 테이블에 행을 추가하여 파티션을 올바르게 설정해야 합니다.

파티션에 데이터 삽입

이제 제품 테이블에 데이터를 삽입할 수 있으며, PostgreSQL은 카테고리에 따라 데이터를 자동으로 해당 파티션으로 라우팅합니다.

<div class="content-ad"></div>

```js
INSERT INTO products (category, product_name, price)
VALUES ('Electronics', 'Smartphone', 500.00);

INSERT INTO products (category, product_name, price)
VALUES ('Clothing', 'T-Shirt', 25.00);

INSERT INTO products (category, product_name, price)
VALUES ('Furniture', 'Sofa', 800.00);
```

파티션에서 데이터 쿼리하기

데이터를 쿼리할 때, PostgreSQL은 WHERE 절을 기반으로 관련 파티션에 자동으로 액세스합니다.

```js
-- 전자제품 제품 검색
SELECT * FROM products WHERE category = 'Electronics';

-- 의류 제품 검색
SELECT * FROM products WHERE category = 'Clothing';

-- 가구 제품 검색
SELECT * FROM products WHERE category = 'Furniture';
```

<div class="content-ad"></div>

포스트그리스큐엘에서는 목록 파티셔닝이란 열의 특정 값에 따라 데이터를 관리하고 쿼리하는 데 유용한 기술입니다. 카테고리나 기타 고유한 집합을 기준으로 데이터를 파티션으로 나누면, 목록 파티셔닝을 통해 빠른 데이터 검색과 효율적인 데이터 관리가 가능해집니다.

# 해시 파티셔닝 PostgreSQL

해시 파티셔닝은 PostgreSQL에서 사용되는 테이블 파티셔닝의 한 유형으로, 데이터를 지정한 열의 해시 값에 기반하여 파티션으로 나누는 방식입니다. 특정 값이나 범위를 사용하는 범위 또는 목록 파티셔닝과 달리, 해시 파티셔닝은 해시 함수를 사용하여 데이터를 파티션 간에 균일하게 분배합니다. 이 파티셔닝 기술은 데이터를 균등하게 분산시켜 부하 분산을 달성하려는 경우 유용합니다.

주문 테이블의 구조를 가진 예시를 살펴보겠습니다.

<div class="content-ad"></div>

```js
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE,
    customer_id INT,
    total_amount NUMERIC
) partition by hash(customer_id);
```

주문 데이터를 고객 ID 열을 기반으로 한 해시 파티션 테이블을 만들려면 다음 단계를 따라야 합니다.

파티션 생성

각 파티션을 나타내는 개별 테이블을 만들어야 합니다. 각 파티션은 특정 해시 값 범위를 나타냅니다. 예제로, 세 개의 파티션을 만들어 보겠습니다.

<div class="content-ad"></div>

```js
CREATE TABLE orders_1 PARTITION OF orders
    FOR VALUES WITH (MODULUS 3, REMAINDER 0);

CREATE TABLE orders_2 PARTITION OF orders
    FOR VALUES WITH (MODULUS 3, REMAINDER 1);

CREATE TABLE orders_3 PARTITION OF orders
    FOR VALUES WITH (MODULUS 3, REMAINDER 2);
```

이 예시에서는 HASH() 함수를 사용하여 customer_id 열의 해시 값에 기반하여 데이터를 분할해야 함을 지정합니다. MODULUS와 REMAINDER를 사용하여 분할의 수(이 경우 3)와 각 분할의 나머지 값을 지정합니다.

분할에 데이터 삽입하기

이제 주문 테이블에 데이터를 삽입하면 PostgreSQL이 customer_id의 해시 값을 기반으로 적절한 분할로 데이터를 자동으로 라우팅합니다:


<div class="content-ad"></div>

```js
INSERT INTO orders (order_date, customer_id, total_amount) 
VALUES ('2023-01-15', 101, 500.00);

INSERT INTO orders (order_date, customer_id, total_amount) 
VALUES ('2023-02-20', 102, 600.00);

INSERT INTO orders (order_date, customer_id, total_amount) 
VALUES ('2023-03-10', 103, 700.00);
```

파티션에서 데이터 조회하기

데이터를 조회할 때 PostgreSQL은 customer_id의 해시 값에 기반하여 적절한 파티션에 자동으로 액세스합니다.

```js
-- customer_id 101에 대한 주문 검색
SELECT * FROM orders WHERE customer_id = 101;

-- customer_id 102에 대한 주문 검색
SELECT * FROM orders WHERE customer_id = 102;

-- customer_id 103에 대한 주문 검색
SELECT * FROM orders WHERE customer_id = 103;
```

<div class="content-ad"></div>

PostgreSQL에서의 해시 파티셔닝은 지정한 열의 해시 값에 기반하여 데이터를 파티션 간에 고르게 분산시키는 유용한 기술입니다. 해시 함수를 활용하여 데이터를 균일하게 분산시키는 해시 파티셔닝은 부하 분산을 실현하고 쿼리 성능을 향상시킵니다.

PostgreSQL 테이블 파티셔닝은 대규모 데이터 집합의 성능 및 관리를 현저히 향상시킬 수 있는 강력한 기능입니다. 데이터를 작은 파티션으로 나누어 쿼리 성능을 최적화하고 데이터 관리를 간소화하며 효율적인 데이터 로딩 및 색인화를 달성할 수 있습니다. 파티셔닝 전략을 설계할 때는 데이터와 쿼리 패턴을 고려하여 가장 적합한 파티셔닝 방법을 선택하세요. 올바른 구현으로 PostgreSQL에서 대규모 데이터 처리에 변화를 줄 수 있는 게임 체인저가 될 수 있습니다.

파티셔닝 시작!

다른 블로그도 살펴보세요!

<div class="content-ad"></div>

읽어주셔서 감사합니다!

데이터, AI, 스타트업, 리더십, 글쓰기 및 문화에 관한 내용을 올립니다.

다음 블로그도 기대해주세요!!