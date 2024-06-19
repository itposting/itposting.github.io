---
title: "PostgreSQL 및 데이터베이스 시스템을 포괄적으로 다루는 PostgreSQL 학습 안내서 파트 2"
description: ""
coverImage: "/assets/img/2024-06-19-LearningPostgresAComprehensiveGuidetoPostgreSQLandDatabaseSystemsPart2_0.png"
date: 2024-06-19 16:26
ogImage: 
  url: /assets/img/2024-06-19-LearningPostgresAComprehensiveGuidetoPostgreSQLandDatabaseSystemsPart2_0.png
tag: Tech
originalTitle: "Learning Postgres: A Comprehensive Guide to PostgreSQL and Database Systems (Part 2)"
link: "https://medium.com/@tomas-svojanovsky/learning-postgres-a-comprehensive-guide-to-postgresql-and-database-systems-part-2-dc7e63510385"
---


![그림을 표시할 수 없습니다](/assets/img/2024-06-19-LearningPostgresAComprehensiveGuidetoPostgreSQLandDatabaseSystemsPart2_0.png)

PostgreSQL(줄여서 Postgres)는 신뢰성, 견고함, 다양한 기능으로 유명한 강력한 오픈 소스 객체-관계형 데이터베이스 시스템입니다. 이는 캘리포니아 대학 버클리 캠퍼스의 post-Ingres 프로젝트의 일환으로 개발되었으며, 1996년 처음으로 공개되었습니다.

## SQL이란?

Codd 박사는 관계형 테이블에서 데이터를 조작하기 위한 DSL/Alpha라는 언어를 제안했습니다. Codd의 논문이 발표된 후, IBM은 그의 아이디어를 기반으로 한 프로토타입을 구축하기 위해 그룹을 위임했습니다.

<div class="content-ad"></div>

이 그룹은 DSL/Alpha의 간소화된 버전인 SQUARE를 개발했습니다. SQUARE의 추가 세부 조정으로 SEQUEL이라는 언어가 만들어졌고, 이 언어는 결국 SQL로 줄여졌습니다.

SQL은 처음에 관계형 데이터베이스에서 데이터를 조작하는 데 사용되던 언어였지만, 지금은 다양한 데이터베이스 기술을 통해 데이터를 조작하기 위해 발전해 왔습니다.

## PostgreSQL의 간단한 역사

PostgreSQL은 선조인 Ingres에서 이름을 따왔습니다. Ingres는 Michael Stonebraker 교수가 개발한 관계형 데이터베이스였습니다. 1986년에 Stonebraker 교수는 Ingres 이후의 새로운 기능을 개발하기 위한 프로젝트를 시작했고, 이 프로젝트를 POSTGRES (Post-Ingres의 약어)라고 명명했습니다. 목표는 객체-관계형 데이터베이스를 만들어 사용자가 자신의 객체(데이터 유형 및 함수와 같은)로 데이터베이스를 확장할 수 있게 하는 것이었습니다.

<div class="content-ad"></div>

1994년에 MIT 라이선스 하에 POSTGRES 버전 4.2가 출시되어 전 세계 개발자들과의 협업이 가능해 졌습니다. 그 당시 POSTGRES는 QUEL이라는 내부 쿼리 언어를 사용했습니다. 버클리 대학의 두 학생 Andrew Yu와 Jolly Chen은 QUEL을 더 현대적인 SQL 언어로 대체했습니다. 이 혁신으로 프로젝트는 중요한 업데이트를 강조하기 위해 Postgre95로 이름이 변경되었습니다.

1996년에는 프로젝트가 코드를 호스팅할 공개 서버를 구축하고 Marc G. Fournier, Tom Lane, Bruce Momjian을 포함한 다섯 명의 개발자가 새롭게 명명된 PostgreSQL에서 작업하기 시작했습니다. 그 이후로 프로젝트는 적극적으로 유지보수되고 업데이트되어 왔습니다.

# 데이터베이스 유형

## 관계형 데이터베이스

<div class="content-ad"></div>

- 데이터를 쿼리하고 관리하기 위해 SQL을 사용하세요.
- MySQL, PostgreSQL, Oracle, Microsoft SQL Server

### NoSQL 데이터베이스

- 비구조화된 데이터와 확장성을 위해 설계되었습니다.
- 문서 저장소: 데이터를 문서 형식으로 저장하며 일반적으로 JSON 또는 BSON 형식으로 저장됩니다 (MongoDB, CouchDB)
- 키-값 저장소: 데이터를 키-값 쌍으로 저장합니다 (Redis, DynamoDB)
- 열 패밀리 저장소: 행 대신 열에 데이터를 저장합니다 (Cassandra, HBase)
- 그래프 데이터베이스: 노드와 엣지로 데이터를 저장하며 상호 연결된 데이터에 적합합니다. (Neo4j, Amazon Neptune)

### 객체 지향 데이터베이스

<div class="content-ad"></div>

- 객체 지향 프로그래밍과 유사하게 객체로 데이터 저장
- db4o, ObjectDB

## 계층형 데이터베이스

- 부모-자식 관계를 가진 트리 구조로 데이터 구성
- IBM 정보 관리 시스템 (IMS)

## 네트워크 데이터베이스

<div class="content-ad"></div>

- 계층적 데이터베이스와 유사하지만 여러 부모 노드와의 복잡한 관계를 허용합니다.
- 통합 데이터 저장소 (IDS)

## 시계열 데이터베이스

- 시간 기록 데이터를 저장하고 조회하는 데 최적화됨
- InfluxDB, TimescaleDB

## 공간 데이터베이스

<div class="content-ad"></div>

- 지리적 위치와 같은 공간 데이터를 저장하고 쿼리하는 데 사용됨
- PostGIS (PostgreSQL의 확장), Oracle Spatial

## 멀티모델 데이터베이스

- 단일 데이터베이스 엔진 내에서 다중 데이터 모델 (문서, 그래프, 키-값)을 지원함
- ArangoDB, OrientDB

## NewSQL 데이터베이스

<div class="content-ad"></div>

- NoSQL 시스템의 확장성과 전통적인 RDBMS의 ACID 보장을 결합해 보세요!
- Google Spanner, CockroachDB

## In-Memory Databases

- 빠르고 효율적인 읽기 및 쓰기 성능을 달성하기 위해 주로 메모리에 데이터를 저장해 보세요!
- 예시: Redis, SAP HANA

## 클라우드 데이터베이스

<div class="content-ad"></div>

- 클라우드 플랫폼에서 호스팅되며 확장성, 고가용성 및 관리 서비스를 제공합니다
- Amazon RDS, Google Cloud SQL, Microsoft Azure SQL Database

## 열 지향 데이터베이스

- 행이 아닌 열별로 데이터를 저장하여 읽기 중심 작업 및 분석 쿼리에 최적화되어 있습니다
- Amazon Redshift, Google BigQuery, Apache HBase

## 포스트그레스 기능

<div class="content-ad"></div>

- 오픈 소스: PostgreSQL은 PostgreSQL 라이선스에 따라 배포되어 무료로 사용, 수정, 및 배포가 가능합니다.
- SQL 표준 지원: PostgreSQL은 SQL 표준과 완전히 호환되며 기본 SQL을 넘어서 많은 확장 기능을 제공합니다.
- 객체-관계 모델: 전통적인 관계형 모델 외에도 PostgreSQL은 테이블 상속 및 사용자 정의 데이터 유형과 같은 객체 지향 기능도 지원합니다.
- 확장성: 사용자는 사용자 정의 데이터 유형, 함수, 연산자, 및 인덱스를 생성할 수 있습니다. PostgreSQL은 데이터베이스에 새로운 기능을 추가할 수 있는 확장도 지원합니다.
- 트랜잭션 지원: PostgreSQL은 트랜잭션 안정성을 보장하기 위해 ACID 속성(원자성, 일관성, 고립성, 지속성)을 지원합니다.
- JSON 및 XML 지원: JSON 및 XML 형식으로 데이터를 저장하고 처리할 수 있어 반구조적 데이터 작업에 유용합니다.
- 복제 및 고가용성: PostgreSQL은 비동기 및 동기식 복제, 논리적 복제, 클러스터링 등 다양한 복제 및 고가용성 옵션을 제공합니다.

## 용어

- 테이블: 메모리나 디스크(영구 저장소)에 저장될 수 있는 행과 열의 집합
- 행: 단일 특정 데이터 항목(엔티티)을 설명하는 열의 집합
- 열: 개별 데이터 항목
- 기본 키: 테이블 내에서 값이 고유하고 null일 수 없는 하나 이상의 열
- 외래 키: 다른 테이블을 참조하는 하나 이상의 열

## 결론

<div class="content-ad"></div>

우리는 포스트그레SQL에 대한 소개로 시작했습니다. 이를 통해 캘리포니아 대학 버클리 캠퍼스의 post-Ingres 프로젝트에서 발전한 객체-관계형 데이터베이스 시스템의 기원을 강조했어요.

1986년 마이클 스톤브레이커 교수가 처음 시작한 이래로, PostgreSQL이란 이름으로 변경된 중요한 업데이트를 거쳐 다양한 발전 과정을 거친 이야기를 전해왔습니다.

또한 SQL의 기원에 대해 살펴보았습니다. 이 언어는 관계형 데이터베이스를 관리하고 쿼리하는 데 중요한 역할을 하는데, 1970년 E. F. Codd 박사가 제안한 데이터를 테이블 집합으로 표현하는 혁신적인 작업부터 시작하여 DSL/Alpha, SQUARE, SEQUEL, 그리고 최종적으로 SQL까지 데이터베이스 쿼리 언어의 발전 과정을 따라갔습니다.

우리는 MySQL, PostgreSQL, Oracle과 같은 전통적인 관계형 데이터베이스에서부터 MongoDB, Redis, Cassandra, Neo4j와 같은 비구조화 데이터용 NoSQL 데이터베이스, 그리고 객체지향, 계층형, 네트워크, 시계열, 공간, 다중모델, NewSQL, 인메모리, 클라우드, 열 지향 데이터베이스 등을 포괄하는 다양한 데이터베이스 시스템의 풍요로운 풍경도 살펴보았습니다. 각각은 서로 다른 사용 사례와 데이터 요구 사항에 적합합니다.

<div class="content-ad"></div>

그런 다음 PostgreSQL의 강력한 기능을 강조했습니다. 이는 오픈 소스 성격, SQL 표준 준수, 객체-관계 기능, 확장성, 트랜잭션 지원 및 JSON, XML, 복제, 및 고 가용성을 처리하기 위한 고급 기능을 강조했습니다.

마지막으로, 테이블, 행, 열, 주 키 및 외래 키와 같은 데이터베이스와 관련된 중요 용어를 설명하여 이러한 핵심 개념에 대한 기본적인 이해를 제공했습니다.