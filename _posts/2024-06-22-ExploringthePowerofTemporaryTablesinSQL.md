---
title: "SQL에서 임시 테이블의 강력한 기능 탐구하기"
description: ""
coverImage: "/assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_0.png"
date: 2024-06-22 17:35
ogImage: 
  url: /assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_0.png
tag: Tech
originalTitle: "Exploring the Power of Temporary Tables in SQL"
link: "https://medium.com/@sqlfundamentals/exploring-the-power-of-temporary-tables-in-sql-707254435566"
---


SQL은 가장 인기 있는 관계형 데이터베이스 관리 시스템 중 하나로, 데이터 조작 및 분석을 향상시키는 다양한 기능을 제공합니다. 임시 테이블 사용이 그 중 하나입니다.

![image](/assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_0.png)

임시 테이블은 세션 내에서 중간 결과 집합을 저장하고 조작할 수 있는 방법을 제공하여 유연성과 성능 향상을 제공합니다. 이 기사에서는 임시 테이블의 세계로 뛰어들어 SQL에서의 이점과 실제 사용 사례를 탐색해 보겠습니다.

# 1. 임시 테이블 이해하기

<div class="content-ad"></div>

임시 테이블은 그 이름 그대로 임시로 존재하며 특정 세션에 바인딩된 테이블입니다. 중간 결과를 저장하거나 복잡한 데이터 조작을 수행하는 데 유용합니다. 임시 테이블은 MySQL 임시 디렉토리에 저장되며 시스템에 의해 자동으로 생성된 고유한 이름을 갖습니다. 생성 세션 내에서만 표시되고 액세스할 수 있으며 세션이 종료될 때 자동으로 삭제됩니다.

# 2. 임시 테이블 생성

MySQL에서 임시 테이블을 만드는 것은 간단합니다. 아래 데이터를 임시 테이블에 저장하려는 예제를 살펴봅시다:

```js
-- 이 쿼리 결과를 임시 테이블로 표시하고 싶어요.
-- (책 제목과 출판사 국가를 보여줍니다.)

SELECT title, country
FROM titles
LEFT JOIN publishers
USING (pub_id)
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_1.png" />

```js
-- 임시 테이블 'titles_publishers'을 생성합니다.

CREATE TEMPORARY TABLE titles_publishers
SELECT title, country
FROM titles
LEFT JOIN publishers
USING (pub_id)

-- 임시 테이블 'titles_publishers'에서 모든 데이터를 검색합니다.

SELECT *
FROM titles_publishers;
```

<img src="/assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_2.png" />

# 3. 임시 테이블 사용하기

<div class="content-ad"></div>

```js
-- 'The' 으로 시작하는 책 제목과 출판사 국가를 표시합니다.

SELECT *
FROM titles_publishers
WHERE title LIKE 'The%';
```

<img src="/assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_3.png" />

# 4. 임시 테이블과 일반 테이블 결합하기

임시 테이블을 일반 테이블과 결합할 수 있는 기능은 여러 가지 강력한 측면 중 하나입니다. 이를 통해 임시 데이터를 기존 데이터와 결합하여 복잡한 쿼리를 작성할 수 있습니다. 다음 예제를 살펴보세요:


<div class="content-ad"></div>

```js
-- 'The'으로 시작하는 책 제목과 출판 국가를 표시해주세요.

SELECT titles_publishers.title, publishers.country
FROM titles_publishers
LEFT JOIN publishers
ON titles_publishers.publisher_id = publishers.publisher_id
WHERE titles_publishers.title LIKE 'The%';
```

![Exploring the Power of Temporary Tables in SQL](/assets/img/2024-06-22-ExploringthePowerofTemporaryTablesinSQL_4.png)

## 5. 임시 테이블 삭제하기

임시 테이블은 세션이 끝나면 자동으로 삭제되지만, 필요한 경우에는 세션이 끝나기 전에 명시적으로 삭제할 수도 있습니다. 임시 테이블을 삭제하려면 DROP TABLE 문을 사용할 수 있습니다.

<div class="content-ad"></div>

```js
테이블 titles_publishers 삭제;
```

# 결론

MySQL의 임시 테이블은 중간 결과 세트를 저장하고 조작하는 강력하고 다재다능한 솔루션을 제공합니다. 데이터 조작 작업에서 성능과 유연성을 향상시킵니다.

임시 테이블을 사용하면 MySQL에서 데이터 조작 기능을 향상시키고 더 효율적이고 효과적인 데이터 분석을 수행할 수 있습니다.

<div class="content-ad"></div>

# SQL 기초

시간을 내주셔서 감사합니다! 🚀
SQL 기초에서 더 많은 콘텐츠를 찾아보실 수 있어요 💫