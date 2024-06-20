---
title: "SQL 트랜잭션 및 ACID 속성"
description: ""
coverImage: "/assets/img/2024-05-27-SQLTransactionsandACIDProperties_0.png"
date: 2024-05-27 13:02
ogImage:
  url: /assets/img/2024-05-27-SQLTransactionsandACIDProperties_0.png
tag: Tech
originalTitle: "SQL Transactions and ACID Properties"
link: "https://medium.com/gitconnected/sql-transactions-and-acid-properties-bb5b670538f8"
---

![image](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_0.png)

# SQL에서 거래 소개

SQL을 데이터베이스로 사용하는 은행 시스템을 상상해봅시다. 사용자 A가 사용자 B의 계좌로 돈을 입금하려고 합니다. 돈을 송금하면 사용자 A의 계좌 잔액에서 해당 금액을 빼내고 이 돈을 사용자 B의 계좌에 입금하려는데, 갑자기 데이터베이스가 크래시될 경우 어떻게 될까요?

![image](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_1.png)

<div class="content-ad"></div>

사용자 A의 잔고에서 인출한 돈이 사라졌다는 것을 의미합니까? SQL 데이터베이스에서는 그렇지 않습니다. 왜냐하면 SQL 트랜잭션을 사용하기 때문입니다.

# 트랜잭션과 ACID 속성

트랜잭션은 단일 원자 단위로 수행되는 하나 이상의 SQL 작업 시퀀스입니다. 이는 데이터베이스에서 데이터 일관성을 보장하기 위한 목적으로 사용됩니다. 트랜잭션은 주로 ACID 약어로 불리는 다음 속성을 갖습니다:

- 원자성: 전체 트랜잭션은 전체가 성공하거나 전체가 실패하는 단위로 처리됩니다.
- 일관성: 트랜잭션은 데이터베이스를 하나의 유효한 상태에서 다른 유효한 상태로 변환시키며 데이터베이스 불변을 유지합니다.
- 고립성: 동시에 실행되는 트랜잭션에 의해 수행된 수정 사항은 서로 분리되어 커밋될 때까지 격리됩니다.
- 지속성: 트랜잭션이 커밋되면 시스템 장애가 발생하더라도 지속되어 유지됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-SQLTransactionsandACIDProperties_2.png" />

# SQL 트랜잭션에서의 중요 명령어

SQL 트랜잭션의 시작을 BEGIN TRANSACTION 키워드로 표시합니다.

<img src="/assets/img/2024-05-27-SQLTransactionsandACIDProperties_3.png" />

<div class="content-ad"></div>

모든 트랜잭션 중에 발생한 변경 사항을 저장하려면 변경 사항을 데이터베이스에 COMMIT합니다.

![이미지](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_4.png)

트랜잭션 중에 문제가 발생하면 ROLLBACK 명령을 사용하여 트랜잭션 중에 수행된 모든 변경 사항을 되돌릴 수 있으며 데이터베이스를 트랜잭션 시작 시점의 상태로 되돌릴 수 있습니다.

![이미지](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_5.png)

<div class="content-ad"></div>

## 예시

우리 간단한 은행 애플리케이션 예제로 돌아가 봅시다. 여기서는 계좌 A에서 계좌 B로 $100을 이체해야 합니다. 이 과정은 두 단계로 이루어집니다:

- 계좌 A에서 금액을 차감하기
- 그 금액을 계좌 B에 추가하기

이 두 가지 단계는 모두 성공적으로 완료되어야 합니다. SQL 트랜잭션으로 이를 어떻게 작성할 수 있는지 살펴보겠습니다:

<div class="content-ad"></div>


BEGIN TRANSACTION;

- Account A 잔액에서 100을 차감합니다.
  UPDATE Accounts
  SET balance = balance - 100
  WHERE account_id = 'A';
  -- Account A에 충분한 잔액이 있는지 확인하고, 부족하다면 롤백합니다.
  IF @@ROWCOUNT = 0
  ROLLBACK;
  -- Account B 잔액에 100을 추가합니다.
  UPDATE Accounts
  SET balance = balance + 100
  WHERE account_id = 'B';
  -- 모든 것이 잘 되었다면 트랜잭션을 커밋합니다.
  COMMIT;


이 트랜잭션은 다음을 수행합니다:

- 트랜잭션을 시작하여 다음 작업이 단일 원자적 프로세스의 일부임을 보장합니다.
- Account A에서 $100을 차감합니다: account_id와 balance 열이 있는 'accounts'라는 테이블이 있다고 가정합니다.
- Account A에 충분한 자금이 있는지 확인합니다: Account A에 충분한 금액이 없으면, ROLLBACK TRANSACTION을 사용하여 모든 변경 사항이 취소되는 롤백이 수행됩니다.
- Account B에 $100을 추가합니다: Account A에 충분한 금액이 있다면, Account B에 $100이 추가됩니다.
- 트랜잭션을 커밋합니다: 두 개의 업데이트가 모두 성공적으로 수행되면, COMMIT TRANSACTION 명령이 실행되어이 트랜잭션 중에 수행된 변경 사항을 영구적으로 적용합니다.

이것은 두 계정이 적절히 업데이트되거나 어느 시점에서 문제가 발생할 경우 변경 내용이 적용되지 않으므로 데이터의 무결성이 유지됩니다.



<div class="content-ad"></div>

# SQL 트랜잭션의 격리 수준

데이터베이스 트랜잭션의 격리 수준은 트랜잭션 무결성이 유지되는 방식 및 각 트랜잭션이 다른 트랜잭션과 얼마나 격리되는지를 결정합니다.

SQL 표준은 일관성과 성능 간의 균형을 맞추기 위해 네 가지 격리 수준을 정의합니다.

## 1. Read Uncommitted

<div class="content-ad"></div>

- 설명: 격리의 가장 낮은 수준입니다. 트랜잭션이 커밋되기 전에 다른 트랜잭션이 작업한 변경 사항을 볼 수 있습니다.
- 예시에 미치는 영향: 돈을 송금하는 도중에 다른 트랜잭션이 계좌 A 또는 B의 잔액을 업데이트하고 있다면, 이 트랜잭션은 이러한 커밋되지 않은 값을 읽을 수 있습니다. 이는 실제로 존재하지 않는 잔액을 보는 등의 문제를 발생시킬 수 있습니다 (다른 트랜잭션이 실패하고 롤백될 경우).

## 2. Read Committed

- 설명: 트랜잭션이 커밋된 데이터만 읽을 수 있도록 보장합니다.
- 예시에 미치는 영향: 이 수준은 'Read Uncommitted'의 문제를 피하기 위해 커밋된 계좌 A와 B의 잔액만 읽도록 합니다. 하지만 트랜잭션 내에서 잔액을 여러 번 읽는 경우, 다른 트랜잭션이 데이터를 수정하는 경우 다른 값들을 보게 될 수 있습니다 (반복할 수 없는 읽기).

## 3. Repeatable Read

<div class="content-ad"></div>

- 설명: 거래가 데이터를 두 번째로 읽을 때 동일한 데이터 값을 찾을 수 있도록 보장합니다(반복되지 않는 읽기를 피함).
- 예시에 미치는 영향: 이 수준은 거래 내에서 동일한 데이터의 여러 번의 읽기 사이에 다른 사람에 의해 생긴 변경 사항을 볼 수 없도록 합니다. 이는 잔액 확인 및 업데이트 작업 중 일관된 읽기 결과를 유지하는 데 도움이 됩니다. 그러나 다른 거래에 의해 추가된 새로운 행이 발생하는 유령 읽기를 막을 수는 없을 수도 있습니다.

## 4. Serializable

- 설명: 최고 수준의 격리. 거래가 직렬로 실행된 것처럼 완전히 격리됩니다.
- 예시에 미치는 영향: 이는 완전한 격리를 보장합니다. 다른 거래가 이체 프로세스에 간섭할 수 없습니다. 모든 동시성 문제(더티 리드, 반복되지 않는 읽기 및 유령 읽기)를 방지하지만 동시성이 감소하고 잠금으로 인한 잠재적 성능 문제가 발생할 수 있습니다.

다양한 격리 수준에서 여러 현상이 발생할 수 있으며, 더티 리드, 반복되지 않는 읽기 또는 유령 읽기와 같은 현상이 발생할 수 있습니다. 아래에서 이 용어가 의미하는 바를 살펴보겠습니다:

<div class="content-ad"></div>

# Dirty Reads

더티 리드는 트랜잭션이 동시에 커밋되지 않은 다른 트랜잭션에 의해 작성된 데이터를 읽을 때 발생합니다. 결과적으로 다른 트랜잭션이 롤백하면 처음 트랜잭션이 데이터를 읽게 됩니다. 하지만 해당 데이터는 데이터베이스에 공식적으로 기록된 적이 없습니다.

예시:

- 트랜잭션 1이 시작되고 계좌 A에서 계좌 B로 $100을 이체합니다.
- 트랜잭션 1이 커밋되기 전에 트랜잭션 2가 시작되고 계좌 A의 잔액을 읽습니다.
- 트랜잭션 1이 실패하고 롤백되면, 트랜잭션 2는 공식적으로 커밋되지 않은 잔액을 읽게 됩니다.

<div class="content-ad"></div>



![image](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_6.png)

# Non-Repeatable Reads (Read Uncommitted)

이것은 트랜잭션 진행 중 같은 행이 두 번 조회되고, 두 번 조회 사이에 행 내의 값이 다른 경우 발생합니다. 본질적으로 다른 트랜잭션이 두 번의 조회 사이에 행을 수정한 경우입니다.

예시:



<div class="content-ad"></div>

- 거래 1이 시작되고 계정 A의 잔액을 읽습니다.
- 거래 2가 계정 A에서 계정 B로 $100을 이체하고 커밋합니다.
- 거래 1이 다시 계정 A의 잔액을 읽으면 이전과 다른 잔액을 볼 수 있습니다.

![이미지](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_7.png)

# 환상 읽기

환상 읽기란 다른 트랜잭션에서 읽고 있는 레코드에 새로운 행이 추가되거나 (또는 기존 행이 삭제되는 경우) 트랜잭션 중에 발생합니다. 이는 동일한 트랜잭션에서의 후속 읽기가 원래 읽기의 일부가 아니었던 새로 추가된 행을 포함하거나 삭제되지 않은 행을 제외한 행 집합을 반환할 수 있음을 의미합니다.

<div class="content-ad"></div>

예시:

- Transaction 1은 계정 A의 거래 수를 세는 쿼리를 시작합니다.
- Transaction 2는 계정 A에 새로운 거래 기록을 삽입하고 커밋합니다.
- Transaction 1은 다시 계정 A의 거래 수를 세어보고 이전보다 더 많은 거래를 발견합니다.

![그림](/assets/img/2024-05-27-SQLTransactionsandACIDProperties_8.png)

높은 격리 수준은 발생할 수 있는 현상의 종류를 줄이지만 더 낮은 동시성과 잠재적인 성능 영향을 감수해야 합니다.

<div class="content-ad"></div>

만약 SQL 데이터베이스의 확장 메커니즘에 대해 더 알고 싶다면, 데이터베이스 샤드, 복제 등을 다루는 깊이 있는 Database Essentials 비디오를 확인해보세요:

여기 처음 오신 분들을 위해, 저는 Hayk입니다. 저는 웹 개발자 분들이 첫 번째 기술 직을 확보하거나 웹 개발 마스터리 커뮤니티에서 시니어 역할로 진출하는 데 도와드리고 있어요.

웹 개발에 대한 주간 통찰력을 놓치고 싶지 않다면, 내 뉴스레터를 구독해주세요.

