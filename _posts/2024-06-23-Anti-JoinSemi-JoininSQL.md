---
title: "SQL에서 Anti-Join과 Semi-Join 쉽게 이해하기"
description: ""
coverImage: "/assets/img/2024-06-23-Anti-JoinSemi-JoininSQL_0.png"
date: 2024-06-23 16:45
ogImage: 
  url: /assets/img/2024-06-23-Anti-JoinSemi-JoininSQL_0.png
tag: Tech
originalTitle: "Anti-Join , Semi-Join in SQL"
link: "https://medium.com/@ritusantra/anti-join-semi-join-in-sql-077582f67ea8"
---


## Anti-Join 및 Semi-Join 이해하기 - 예제와 함께

### Anti-Join

Anti-Join은 테이블 A에 있는 행 중 테이블 B에 없는 행을 얻는 경우입니다.

예를 들어, 주문을 한 번도 하지 않은 고객을 식별하려면 Anti-Join을 사용할 수 있습니다.

<div class="content-ad"></div>

여기서 테이블 A를 고객이고 테이블 B를 주문으로 고려해 봅시다.

```js
SELECT c.customer_id, c.customer_name
FROM customers c
LEFT JOIN orders o
on c.customer_id = o.customer_id
WHERE o.customer_id IS NULL;
```

# Semi-Join

세미 조인은 테이블 B에서 조건이 일치하는 경우에만 테이블 A에서 행을 반환합니다.

<div class="content-ad"></div>

예를 들어, 주문을 한 고객만 식별하고 싶다면 이 세미 조인을 활용할 수 있습니다.

```js
SELECT customer_id
FROM orders 
WHERE customer_id IN (SELECT customer_id FROM customers);
```

# 요약

- Anti-Join: 두 번째 테이블에 일치하는 행이 없는 첫 번째 테이블의 행을 검색합니다.
- Semi-Join: 두 번째 테이블에서 적어도 일치하는 행이 하나 이상 있는 첫 번째 테이블의 행을 검색합니다.

<div class="content-ad"></div>

행복한 학습되세요! 화이팅!

만약 제 글이 도움이 되셨다면, 클랩 버튼을 눌러서 지지를 보여주시고 나중을 위해 글을 저장하는 것을 잊지 마세요.