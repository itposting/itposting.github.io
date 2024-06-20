---
title: "SQL에게 50번째 생일을 축하합니다"
description: ""
coverImage: "/assets/img/2024-06-19-Happy50thBirthdaytoSQL_0.png"
date: 2024-06-19 21:21
ogImage: 
  url: /assets/img/2024-06-19-Happy50thBirthdaytoSQL_0.png
tag: Tech
originalTitle: "Happy 50th Birthday to SQL"
link: "https://medium.com/asecuritysite-when-bob-met-alice/happy-50th-birthday-to-sql-c07ad9cb6090"
---


<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_0.png" />

수십 년 동안 컴퓨팅 분야를 선도해온 IBM은 세계적인 연구를 이끌어왔습니다. 그래서 1957년에 세계 최초의 프로그래밍 언어 중 하나를 만들었습니다: FORTRAN — 혹은 FORTRAN 57이라고도 불렸답니다. 그 때는 대규모 컴퓨터 디스크가 없었는데, 프로그램은 펀치 카드에 저장되었어요:

<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_1.png" />

그림 참조: https://wp.ufpel.edu.br/diehl/files/2016/05/f90_lec1.pdf

<div class="content-ad"></div>

1977년 FORTRAN 77이 만들어지면서 FORTRAN은 큰 힘을 받게 되었습니다. 이 언어는 수학 공식을 코드로 번역하는 데 좋았지만 데이터베이스를 구축하는 데는 그리 좋지 않았습니다. 그래서 소프트웨어 세계에서 역사적인 논문 중 하나인 Edgar Frank Codd가 1970년에 발표했습니다. 

![SQL Image](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_2.png)

해당 논문에서는 관계형 데이터베이스의 세계를 개괄하고 SQL 프로그래밍 언어를 도출하였습니다. Codd는 1981년에 컴퓨팅 분야의 노벨상에 해당하는 Turing Award를 받았습니다. 

논문에서 Edgar는 새로운 데이터 모델링 방식을 제안했고 관계(테이블이라고도 함)을 사용했습니다. 이를 통해 특정 테이블 내의 데이터를 변경할 수 있었으며 다른 테이블에 영향을 미치지 않았습니다. 그 당시의 모든 기존 방법은 새로운 데이터가 데이터베이스의 전체 구조를 방해했습니다. 테이블 자체는 행과 열로 구성되어 있고 열은 데이터의 속성을 나타냅니다. 1973년까지 기다렸지만 Codd는 그의 작업을 확장할 수 있는 기회를 얻었습니다. 그 시점까지 Codd는 수학적 표기법을 사용하여 질의 시스템을 정의했습니다.

<div class="content-ad"></div>

![Happy 50th Birthday to SQL](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_3.png)

수학을 체계화하는 것이 목표였고, 코드의 대수 표기법을 기반으로 관계형 데이터베이스를 위한 쿼리 언어를 만든 것은 돈 챔버린과 레이 보이스였습니다. 이것이 SQUARE (관계식으로 쿼리 지정)로 이어지고, 그 후로는 Sequel(구조화된 영어 쿼리 언어)가 되었습니다. 이 논문은 1974년 5월에 발표되었으며, 이를 끝으로 언어를 SQL로 다시 명명했습니다.

![SQL Language](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_4.png)

1974년, 26세였던 레이 보이스는 SQL 초기 생성 직후 곧 사망하였으며, 그의 작품의 참된 영향을 볼 수 없었습니다. SQL은 상상 이상으로 발전하여 지금까지도 가장 인기 있는 프로그래밍 언어 중 하나이며 사실상 유일한 데이터베이스 프로그래밍 언어입니다.

<div class="content-ad"></div>

라리 엘리슨, 밥 마이너, 에드 오패츠는 관계형 데이터베이스의 잠재력을 보고 오라클 데이터베이스를 만들었고 이는 회사명으로까지 되었습니다. Oracle의 핵심은 SQL이었으며 처음에는 IBM 메인프레임에서 작동했습니다. IBM도 Db2라는 데이터베이스를 가지고 있었는데 이것도 SQL을 사용했습니다. NIST는 결국 SQL을 표준화하였고 1986년에 ANSI 및 ISO 표준이 따랐습니다. 미래에 대해 어떨까요? 많은 시스템이 NoSQL 데이터베이스로 이동하고 있지만 이것들은 여전히 확장하기 어렵고 기존 SQL 애플리케이션을 직접 대체하기 어려운 상황입니다.

# 클라우드에서의 SQL

<div class="content-ad"></div>

관계형 데이터베이스를 사용하면 고정된 스키마를 갖고 레코드가 행과 열에 저장됩니다. 그런 다음 SQL을 사용하여 레코드들을 쿼리합니다. 비관계형 모드에서는 동적 스키마를 가지고 키-값 쌍을 사용할 수 있습니다:

![image](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_6.png)

Amazon Aurora는 엔터프라이즈급 관계형 데이터베이스이며 MySQL 및 PostgreSQL과 호환됩니다. 전체적으로 자동으로 프로비저닝, 백업, 복구 및 장애 탐지와 같은 주요 작업들을 처리합니다. Amazon Redshift는 데이터웨어하우스(EDW)와 관련된 비지니스 인텔리전스 분야를 포함한 빅데이터 애플리케이션에 적합합니다. 그것은 데이터에 주력하며 데이터베이스 관리는 덜 중요시합니다.

SQL(Structured Query Language)은 가장 오래된 프로그래밍 언어 중 하나이며 우리에게 잘해 왔습니다. 1974년에 만들어졌고 이미 49년 이상 된 오래된 기술입니다! 그러나 이는 그 방식이 상당히 고정되어 있어 JSON과 같은 새로운 데이터 객체 형식과는 잘 어울리지 않습니다. SQL 데이터베이스는 데이터를 저장할 때 행과 열을 사용하며 이는 고정된 스키마에 일치합니다. 더 전통적인 데이터베이스를 위해 

<div class="content-ad"></div>

AWS는 Amazon Relational Database Service (Amazon RDS), Amazon Redshift, 그리고 Amazon Aurora를 제공합니다. RDS는 관계형 데이터베이스에 사용되며 복잡한 트랜잭션이나 복잡한 쿼리가 있는 경우에 사용됩니다. 중간에서 높은 쿼리 또는 쓰기 속도를 갖고 있으며 높은 내구성을 지원합니다. 지원하는 데이터베이스 유형은 Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle 및 Microsoft SQL Server입니다.

관계형 데이터베이스에서는 고정된 스키마가 있고 레코드가 행과 열에 저장됩니다. 그런 다음 SQL을 사용하여 레코드를 쿼리합니다. 비관계형 모드에서는 동적 스키마와 키-값 쌍을 사용할 수 있습니다.

![Figure 1: Relational (SQL) and Non-relational databases Ref: AWS Academy Cloud Foundations slides](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_7.png)

<div class="content-ad"></div>

Amazon Aurora는 기업용 급의 관계형 데이터베이스로, MySQL 및 PostgreSQL과 호환됩니다. 기본적으로 프로비저닝, 백업, 복구 및 장애 검출과 같은 주요 작업을 자동화합니다. Amazon Redshift는 대용량 데이터 애플리케이션에 적합하며, 기업 데이터 웨어하우스(EDW)와 관련된 애플리케이션에 적합합니다. 이는 데이터에 핵심을 두고 데이터베이스 관리에 덜 중점을 둡니다.

## RDS

RDS 데이터베이스를 먼저 생성할 것입니다. RDS를 선택한 다음 "데이터베이스 생성"을 클릭합니다:

![RDS Database Creation](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_8.png)

<div class="content-ad"></div>

다음으로 MySQL 데이터베이스를 생성할 것입니다:

![Create MySQL database](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_9.png)

아래로 스크롤하여 "Free tier"를 선택하세요:

![Select Free tier](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_10.png)

<div class="content-ad"></div>

다음으로 MySQL 데이터베이스의 이름을 "MyDataBase"로, 마스터 계정 이름을 "admin"으로, 암호를 "napier123"으로 설정할 겁니다:

![MySQL 데이터베이스 설정](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_11.png)

SSD 스토리지를 사용하여 20GB 크기의 데이터베이스를 생성할 겁니다:

![SSD 스토리지를 사용한 데이터베이스 생성](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_12.png)

<div class="content-ad"></div>

위 예시에서 나타나 있는 코드 블록을 마크다운 형식으로 변경해 드리겠습니다.


We will then enable public access to the database, and create a new VPC security group to open up TCP Port 3306:

![Image](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_13.png)

Then finally to create the database:

![Image](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_14.png)


<div class="content-ad"></div>

아래는 마크다운 형식으로 변경해 주세요:


It will then take a few minutes to create the database:

![Create Database](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_15.png)

We should then get the details:

![Get Details](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_16.png)


<div class="content-ad"></div>

우리는 그 다음에 연결을 기록합니다. 이 경우에는:

```js
mydatabase.cll88eb5nhtz.us-east-1.rds.amazonaws.com
```

그리고 TCP 포트는 3306입니다.

## MySQL Workbench 설치하기

<div class="content-ad"></div>

이제 MySQL Workbench를 설치하세요 [여기].

## 데이터베이스에 연결하기

그런 다음 AWS에서 제공하는 공개 엔드포인트를 사용하여 SQL 서비스에 연결할 수 있습니다:

![이미지](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_17.png)

<div class="content-ad"></div>

각 SQL 명령에 대해 이 버튼을 클릭하세요:

![](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_18.png)

다음과 같이 데이터베이스 스키마를 만들 수 있습니다:

```js
CREATE DATABASE MyDataBase;
```

<div class="content-ad"></div>


![Happy 50th Birthday to SQL](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_19.png)

Next, right-click on the SCHEMAS area on the left-hand side, and refresh. You should now see the MyDataBase schema. Now, double-click on it to select it.

Now, enter the definition for the table:

```js
CREATE TABLE Students (
            Username varchar(255),
            LastName varchar(255),
            FirstName varchar(255)
            );
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_20.png" />

이제 데이터를 추가해보겠습니다:

```js
INSERT INTO Students (Username, LastName, FirstName) values ('fsmith','Smith',"Frank");
INSERT INTO Students (Username, LastName, FirstName) values ('bsmyth',"Smyth","Bob");
INSERT INTO Students (Username, LastName, FirstName) values ('csmithes','Smithes',"Colin");
```

<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_21.png" />

<div class="content-ad"></div>

이제 우리가 입력할게요:

```js
SELECT * FROM Students;
```

<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_22.png" />

이제 우리는 이름 순으로 정렬할 수 있어요:

<div class="content-ad"></div>

```js
SELECT * FROM Students ORDER BY FirstName
```

<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_23.png" />

이제 첫 번째 이름을 기반으로 정렬할 수 있습니다 (역순으로):

```js
SELECT * FROM Students ORDER BY FirstName DESC
```

<div class="content-ad"></div>


![SQL 50th Birthday](/assets/img/2024-06-19-Happy50thBirthdaytoSQL_24.png)

만약 다음과 같이 시도한다면:

```sql
SELECT LastName, FirstName FROM Students ORDER BY LastName
```

다음과 같은 결과가 나옵니다:


<div class="content-ad"></div>


LastName  FirstName
-------------------
Smith     Frank
Smithes   Colin
Smyth     Bob


## 데이터베이스의 보안

보안 그룹은 방금 RDS 데이터베이스를 생성한 호스트의 IP 주소 하나만을 위한 방화벽을 열었습니다:

<img src="/assets/img/2024-06-19-Happy50thBirthdaytoSQL_25.png" />


<div class="content-ad"></div>

/32 서브넷은 IP 주소의 모든 부분과 일치합니다.

# 결론

SQL은 세상을 많은 방식으로 바꾸어 왔습니다. 그러나 미래는 NoSQL일 것으로 예상됩니다:

[https://asecuritysite.com/aws/lab11](https://asecuritysite.com/aws/lab11)

<div class="content-ad"></div>

https://asecuritysite.com/aws/lab12