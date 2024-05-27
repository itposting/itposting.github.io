---
title: "90의 작업을 처리할 수 있는 10가지 SQL 문장"
description: ""
coverImage: "/assets/img/2024-05-27-10SQLStatementsThatCanHandle90ofTasks_0.png"
date: 2024-05-27 13:00
ogImage:
  url: /assets/img/2024-05-27-10SQLStatementsThatCanHandle90ofTasks_0.png
tag: Tech
originalTitle: "10 SQL Statements That Can Handle 90% of Tasks"
link: "https://medium.com/@sqlfundamentals/10-sql-statements-that-can-handle-90-of-tasks-aa77c99120ae"
---

구조화된 쿼리 언어(SQL)는 관계형 데이터베이스를 관리하고 질의하는 강력한 도구입니다. 초보자든 경험 많은 데이터 전문가든 상관없이, 여러분은 자주 사용하게 될 특정 SQL 문을 발견할 것입니다. 본 문서에서는 데이터베이스 작업의 90%를 처리할 수 있는 10가지 필수 SQL 문을 다룹니다. 코드 예시를 함께 제공할 것입니다.

![이미지](/assets/img/2024-05-27-10SQLStatementsThatCanHandle90ofTasks_0.png)

# 1. 소개

# SQL의 중요성

<div class="content-ad"></div>

SQL은 관계형 데이터베이스와 상호 작용하기 위한 표준 언어입니다. 데이터를 검색하거나 데이터베이스 구조를 수정하는 등 다양한 작업을 수행할 수 있습니다. SQL을 이해하는 것은 데이터 작업을 하는 사람에게 필수적이며, 데이터 분석, 보고 및 애플리케이션 개발을 위한 기초를 제공합니다.

# 2. SELECT 문

# 데이터 검색

SELECT 문은 하나 이상의 테이블에서 데이터를 검색하는 데 사용됩니다. 검색할 열을 지정하고 결과를 필터링할 조건을 추가할 수 있습니다.

<div class="content-ad"></div>

```js
-- 테이블에서 모든 열을 검색합니다
SELECT * FROM employees;

-- 특정 열을 검색합니다
SELECT first_name, last_name FROM employees;

-- 결과를 필터링하기 위해 조건을 추가합니다
SELECT product_name, price FROM products WHERE price > 50;
```

# 3. INSERT INTO 문

# 새 데이터 추가

INSERT INTO 문을 사용하면 테이블에 새로운 데이터 행을 추가할 수 있습니다.

<div class="content-ad"></div>

```js
-- 단일 행 삽입
INSERT INTO customers (first_name, last_name, email) VALUES ('John', 'Doe', 'john@example.com');

-- 여러 행 삽입
INSERT INTO orders (order_date, total_amount) VALUES
    ('2023-01-15', 150.00),
    ('2023-01-16', 220.50),
    ('2023-01-17', 75.25);
```

# 4. UPDATE 문

# 기존 데이터 수정하기

UPDATE 문은 테이블의 기존 데이터를 수정하는 데 사용됩니다.

<div class="content-ad"></div>

```js
-- 하나의 행 업데이트하기
UPDATE products SET price = 25.99 WHERE product_id = 101;

-- 여러 행 업데이트하기
UPDATE employees SET manager_id = 105 WHERE department = 'Sales';
```

# 5. DELETE 문

# 데이터 삭제

DELETE 문은 테이블에서 행을 제거하는 데 사용됩니다.

<div class="content-ad"></div>

```js
-- 한 행 삭제
DELETE FROM customers WHERE customer_id = 201;

-- 조건을 충족하는 모든 행 삭제
DELETE FROM orders WHERE order_date < '2023-01-15';
```

## 6. CREATE TABLE 문

### 새 테이블 생성

CREATE TABLE 문은 지정된 열과 데이터 유형을 가진 새 테이블을 생성하는 데 사용됩니다.

<div class="content-ad"></div>


CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(255),
    price DECIMAL(10, 2)
);


## 7. ALTER TABLE 문

## 테이블 수정

ALTER TABLE 문을 사용하면 기존 테이블을 추가, 수정 또는 삭제하여 테이블을 수정할 수 있습니다.



<div class="content-ad"></div>

```sql
-- 새 열 추가
ALTER TABLE employees ADD COLUMN hire_date DATE;

-- 열 데이터 유형 수정
ALTER TABLE customers ALTER COLUMN phone_number VARCHAR(15);
```

# 8. DROP TABLE 문

# 테이블 삭제하기

DROP TABLE 문은 기존 테이블과 해당 데이터를 모두 삭제하는 데 사용됩니다.

<div class="content-ad"></div>

```sql
-- 테이블 삭제
DROP TABLE products;
```

## 9. WHERE 절

## 데이터 필터링

WHERE 절은 지정된 조건에 따라 행을 필터링하는 데 사용됩니다.

<div class="content-ad"></div>

```js
-- 가격이 50보다 큰 제품 조회
SELECT product_name, price FROM products WHERE price > 50;

-- 영업 부서의 직원 조회
SELECT first_name, last_name FROM employees WHERE department = 'Sales';
```

# 10. JOIN 절

# 여러 테이블에서 데이터 결합

JOIN 절을 사용하여 서로 관련된 열을 기반으로 두 개 이상의 테이블에서 행을 결합합니다.

<div class="content-ad"></div>

```sql
-- 고객 이름과 주문 조회하기
SELECT c.first_name, c.last_name, o.order_date
FROM customers AS c
JOIN orders AS o ON c.customer_id = o.customer_id;
```

# 11. GROUP BY 절

# 데이터 집계

GROUP BY 절은 특정 열의 값을 가진 행을 그룹화하는 데 사용되며, 종종 SUM 및 COUNT와 같은 집계 함수와 함께 사용됩니다.

<div class="content-ad"></div>

```sql
-- 각 제품별 총 매출 계산
SELECT product_id, SUM(quantity * price) AS total_sales
FROM order_details
GROUP BY product_id;
```

# 12. 결론

# 기초 마스터

이 10가지 SQL 문은 관계형 데이터베이스 작업 시 대부분의 작업을 다룹니다. 이 문장들을 이해하고 숙달함으로써 데이터베이스 관리 및 데이터 조작에 대한 견고한 기초를 갖게 될 것입니다. SQL은 다양한 기능을 제공하는 언어이며, 데이터 작업에 더욱 강력한 방법을 발견하면서 더욱 쉽게 작업할 수 있을 것입니다.

<div class="content-ad"></div>

# SQL 기초 지식

시간을 내어 주셔서 감사합니다! 🚀
SQL 기초 지식에서 더 많은 콘텐츠를 찾아보실 수 있어요! 💫
