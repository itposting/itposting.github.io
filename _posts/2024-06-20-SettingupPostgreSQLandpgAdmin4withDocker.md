---
title: "도커를 사용하여 PostgreSQL 및 pgAdmin 4 설치하기"
description: ""
coverImage: "/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_0.png"
date: 2024-06-20 15:53
ogImage: 
  url: /assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_0.png
tag: Tech
originalTitle: "Setting up PostgreSQL and pgAdmin 4 with Docker"
link: "https://medium.com/@marvinjungre/get-postgresql-and-pgadmin-4-up-and-running-with-docker-4a8d81048aea"
---


<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_0.png" />

이 글에서는 Docker 환경에서 PostgreSQL 및 pgAdmin 4를 설치하는 단계를 안내하겠습니다. 선택 사항인 마지막 단계로 pgAdmin 4를 사용하여 데이터베이스 및 테이블을 생성하고 터미널을 사용하여 액세스하는 방법을 테스트할 것입니다. 이 안내서는 데이터베이스 환경을 구축하고 실행하는 데 도움이 되도록 설계되었습니다.

# Docker 설치

Docker를 설치하는 방법은 사용 중인 운영 체제에 따라 다릅니다. 운영 체제에 따라 지침에 따라 설치하세요 (Docker에는 유료 버전도 있지만 무료 버전으로 우리 목적에는 충분합니다):

<div class="content-ad"></div>

# PostgreSQL 설정하기

Docker에 PostgreSQL을 설치하려면 운영 체제에 따라 터미널, 명령 줄 또는 PowerShell을 열어야 합니다. 그런 다음 PostgreSQL 이미지를 설치할 것입니다. Docker 이미지는 코드, 런타임, 라이브러리, 환경 변수 및 시스템 도구를 포함하여 소프트웨어를 실행하는 데 필요한 모든 것이 포함된 가벼운 독립형 실행 가능 소프트웨어 패키지입니다.

다음 명령을 사용하여 PostgreSQL 이미지를 가져오세요:

```js
docker pull postgres
```

<div class="content-ad"></div>

이제 Docker 데스크톱 애플리케이션에서 이미지 탭에서 PostgreSQL 이미지를 볼 수 있어요.

![PostgreSQL Image](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_1.png)

Docker 이미지를 다운로드한 후에는 Docker 컨테이너를 시작하여 데이터베이스를 초기화하고 작동시켜야 해요.

Docker 컨테이너는 애플리케이션의 필요한 종속성, 구성 및 코드를 캡슐화한 가벼우면서 격리된 런타임 환경으로, 다양한 시스템에서 일관되게 실행할 수 있게 해줘요.

<div class="content-ad"></div>

아래 명령어를 사용하여 도커 컨테이너를 생성하세요 (비밀번호는 꼭 바꾸세요):

```js
docker run --name sqltutorial -e POSTGRES_PASSWORD=marviniscool -p 5432:5432 -d postgres
```

이제 Docker Desktop 앱에서 다음을 확인할 수 있어요:

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_2.png" />

<div class="content-ad"></div>

도커 run 명령어를 사용하여 컨테이너를 생성했어요. 우리는 이름을 선택하기 위해 -e를 사용해 환경 변수를 설정하고, 이 경우에는 데이터베이스 비밀번호를 "marviniscool"로 설정했어요 (비밀번호를 변경하는 걸 잊지 마세요). 마지막으로 -d를 사용해 컨테이너를 분리된 모드로 실행하고, 우리가 Postgres 이미지를 사용하고자 한다고 명시했어요. 이 명령어에서는 컴퓨터의 포트 5432를 컨테이너 내부의 포트 5432에 매핑하여 데이터베이스에 나중에 포트 관련 혼란 없이 액세스할 수 있어요. 또한 "POSTGRES_USER=mycustomuser"를 추가하여 "postgres"에서 원하는 이름으로 사용자 이름을 바꿀 수 있어요. 도커나 도커 run 명령어에 대해 더 알고 싶다면 문서를 확인해보세요:

명령줄을 사용하여 도커 컨테이너가 실행 중인지 확인할 수도 있어요. 다음 명령을 실행하면 돼요:

```js
docker ps
```

위와 같은 결과를 보면 컨테이너가 올바르게 작동 중인 걸 확인할 수 있어요:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_3.png" />

# PgAdmin4 설치하기

이제 pgAdmin 4 설치로 넘어가보겠습니다. PgAdmin 4는 PostgreSQL을 위한 인기 있는 웹 기반 관리 및 운영 도구입니다. 이는 사용자 친화적인 인터페이스를 제공하여 데이터베이스와 상호 작용하고 SQL 쿼리를 실행하며 데이터베이스 성능을 모니터링하는 등 복잡한 명령 줄을 탐색하지 않고도 많은 기능을 제공합니다.

설치 프로세스는 PostgreSQL을 설치하는 프로세스와 유사합니다. 우리는 Docker를 사용하여 pgAdmin 4 이미지를 가져와서 설정 프로세스를 단순화할 것입니다.

<div class="content-ad"></div>

터미널에 다음 명령어를 입력하여 pgAdmin 4를 설치할 수 있어요:

```js
docker pull dpage/pgadmin4
```

당신의 Docker Desktop 앱의 '이미지' 탭에서 이미지를 확인할 수 있어요.

이미지를 다운로드한 후에는 Docker 컨테이너를 생성하고 실행할 수 있어요. 아래 명령어는 새로운 'pgadmin-container' Docker 컨테이너를 설정하며, 당신의 컴퓨터의 포트 5050을 컨테이너의 포트 80에 매핑하고, pgAdmin 4 인터페이스에 액세스할 수 있는 기본 이메일과 비밀번호를 설정해요.

<div class="content-ad"></div>

다음은 pgAdmin 4 도커 컨테이너를 실행하는 명령어입니다:

```bash
docker run --name pgadmin-container -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=user@domain.com -e PGADMIN_DEFAULT_PASSWORD=catsarecool -d dpage/pgadmin4
```

이메일과 비밀번호를 본인의 이메일과 비밀번호로 바꿔 주시기 바랍니다.

# pgAdmin 4를 사용하여 데이터베이스 컨테이너에 연결하기

<div class="content-ad"></div>

## pgAdmin 4에 로그인하기

컨테이너가 성공적으로 실행되면 (문제가 발생하면 Docker Desktop 앱을 확인하여 컨테이너가 실행 중인지 확인하는 것이 좋습니다), 선택한 웹 브라우저에서 localhost:5050으로 이동하여 pgAdmin에 액세스할 수 있습니다.

![이미지](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_4.png)

그런 다음 로그인 프롬프트가 표시되며, 이전에 지정한 이메일 주소와 비밀번호로 로그인할 수 있습니다. 이 경우 "user@domain.com" 및 "catsarecool"입니다.

<div class="content-ad"></div>

## 데이터베이스 컨테이너에 연결하기/ 서버 추가

다음 단계에서는 데이터베이스 컨테이너에 연결할 것입니다. 이를 위해 '새 서버 추가'를 클릭해야 합니다:

![이미지](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_5.png)

그리고 데이터베이스에 연결할 관련 정보를 입력하세요. 이름 필드에는 pgAdmin에서 데이터베이스를 참조하기 위한 별칭을 선택할 수 있습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_6.png" />

계속하기 전에 "sqltutorial" 컨테이너의 IP 주소를 얻는 것이 중요합니다. IP 주소를 찾으려면 터미널(Linux/macOS) 또는 PowerShell(Windows)에서 다음 명령을 실행할 수 있습니다:

```js
docker inspect -f '{range .NetworkSettings.Networks}{.IPAddress}{end}' sqltutorial
```

저희 경우에는 IP 주소 172.17.0.2를 반환했습니다 (이것이 여러분에게도 해당될 수도 있고 아닐 수도 있습니다). 이제 모든 연결 정보를 입력합니다:

<div class="content-ad"></div>

- 호스트 이름/주소: 172.17.0.2 (당신에게는 다를 수 있음)
- 포트: 5432
- 유지 보수 데이터베이스: postgres
- 사용자 이름: postgres (변경했다면 다른 이름)
- 비밀번호: marviniscool (또는 선택한 다른 비밀번호)
- 선택 사항: 저장된 비밀번호를 true로 설정

![이미지](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_7.png)

"저장"을 클릭하면 왼쪽 메뉴에서 데이터베이스 서버를 선택할 수 있습니다:

![이미지](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_8.png)

<div class="content-ad"></div>

축하합니다! 이제 환경이 구동 중이어야 합니다. pgAdmin 4에 관한 질문이 있으면 문서를 참조하세요:

# 선택 사항: 연결 테스트

마지막으로 선택 사항으로, pgAdmin 4를 사용하여 데이터베이스와 테이블을 생성한 다음 터미널에서 해당 테이블을 읽어보겠습니다. 데이터베이스 작업에 익숙하지 않다면 몇 가지 개념이 혼란스러울 수 있지만, 후속 튜토리얼에서 모든 것을 자세히 다룰 것입니다.

## pgAdmin 4에서 데이터베이스 및 테이블 생성

<div class="content-ad"></div>

‘Databases’를 마우스 오른쪽 버튼으로 클릭하고 ‘만들기' - ` '데이터베이스'를 선택하십시오. 데이터베이스에 이름을 지정하고 ‘my_new_database’와 같이 이름을 지어주신 후에 ‘저장’을 클릭하십시오.

![이미지](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_9.png)

그런 다음, 방금 만든 데이터베이스로 이동하여 “테이블”을 마우스 오른쪽 버튼으로 클릭하고 ‘만들기' - ` '테이블'을 선택하십시오. 테이블에 이름을 지정하고, 예를 들어 “catbase”와 같이 지어주십시오.

![이미지](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_10.png)

<div class="content-ad"></div>

데이터베이스를 생성한 후 테이블을 만들겠습니다. 이를 위해 catbase -` 스키마 -` public -` 테이블 -` 생성 -` 테이블을 선택합니다...

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_11.png" />

이제 테이블 이름을 "cattable"로 설정합니다:

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_12.png" />

<div class="content-ad"></div>

그리고 다음 단계에서 두 개의 열을 생성할 것입니다. 첫 번째 열은 id 열로서, 이는 우리의 주 키입니다 (이것이 무엇인지 모르더라도 걱정하지 마세요. 나중에 자습서에서 설명하겠습니다). 두 번째 열은 고양이의 이름을 나타내는 텍스트 열입니다. 우리는 "Not Null?"과 같은 제약 조건을 지정할 수도 있습니다. 이는 이 열의 모든 셀이 값을 가질 수 있음을 보장합니다.

첫 번째 열의 이름을 id로, 데이터 유형을 시리얼로 설정하고 "Not Null?" 및 "Primary Key?" 제약 조건을 선택합니다. 그런 다음 플러스 기호를 클릭하여 두 번째 열의 이름을 "catname"으로 지정하고 데이터 유형을 텍스트로 설정하고 "Not Null?" 제약 조건을 선택합니다.

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_13.png" />

저장을 클릭합니다. 이제 테이블을 생성했으므로 데이터의 하나의 행을 추가하려고 합니다. SQL을 사용하여도 되지만, 일관성을 유지하기 위해 이 경우에도 pgAdmin을 사용할 것입니다. 우리는 오른쪽 클릭해야합니다:

<div class="content-ad"></div>


테이블 - `데이터 보기/편집 -` 모든 행

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_14.png" />

그다음, 데이터 출력 창에서 행 추가를 클릭해야합니다:

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_15.png" />


<div class="content-ad"></div>

이제 텍스트 필드를 클릭하고 "Bam Bam"과 같은 멋진 고양이 이름으로 이름을 설정할 것입니다. 다음 단계에서는 행을 데이터베이스에 저장할 것입니다. (키 필드에 값을 입력할 필요가 없다는 점을 유의해주세요. 데이터 유형을 시리얼라이저로 설정했으므로 id가 자동으로 선택됩니다)

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_16.png" />

## 터미널에서 테이블 쿼리

pgAdmin 4에서 데이터베이스와 테이블을 설정한 후, 터미널로 전환하여 테이블에서 데이터를 읽어봅시다.

<div class="content-ad"></div>

먼저, 도커 컨테이너 내의 데이터베이스 서버에 연결해야 해요:

```js
docker exec -it sqltutorial psql -U postgres
```

다음으로, 이전에 pgAdmin 4에서 생성한 "catbase" 데이터베이스에 연결해야 해요.

```js
\c catbase
```

<div class="content-ad"></div>

마지막으로, 테이블에서 모든 행을 선택하기 위해 select 문을 사용할 수 있습니다:

```js
SELECT * FROM CATTABLE;
```

<img src="/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_17.png" />

여기에 있습니다! pgAdmin 4와 터미널이 Docker 컨테이너 내의 PostgreSQL 데이터베이스와 성공적으로 상호 작용하고 있다는 것을 확인할 수 있습니다. 'catbase' 내 'cattable'의 내용이 표시됩니다.

<div class="content-ad"></div>


![2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_18](/assets/img/2024-06-20-SettingupPostgreSQLandpgAdmin4withDocker_18.png)
