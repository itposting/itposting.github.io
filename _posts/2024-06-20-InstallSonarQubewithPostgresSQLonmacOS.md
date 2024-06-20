---
title: "맥OS에서 PostgreSQL을 사용하여 SonarQube를 설치하기"
description: ""
coverImage: "/assets/img/2024-06-20-InstallSonarQubewithPostgresSQLonmacOS_0.png"
date: 2024-06-20 14:29
ogImage: 
  url: /assets/img/2024-06-20-InstallSonarQubewithPostgresSQLonmacOS_0.png
tag: Tech
originalTitle: "Install SonarQube with PostgresSQL on macOS"
link: "https://medium.com/@adhiksubash/install-sonarqube-with-postgressql-on-macos-06e88dd6ecb5"
---


이 가이드에서는 macOS에서 SonarQube를 PostgreSQL과 함께 설치하고 구성하는 단계를 안내해 드리겠습니다. SonarQube는 코드 품질을 지속적으로 검사하는 인기 있는 도구이며 PostgreSQL은 강력한 오픈 소스 객체 관계형 데이터베이스 시스템입니다.

# 단계 1: SonarQube 및 Sonar-Scanner 설치

먼저 Homebrew를 사용하여 SonarQube와 Sonar-Scanner를 설치해야 합니다. 터미널을 열고 다음 명령을 실행해 주세요:

```js
brew install sonar-scanner
brew install sonarqube
brew services start sonarqube
```

<div class="content-ad"></div>

설치를 확인하려면 브라우저를 열고 localhost:9000으로 이동하십시오. SonarQube 인터페이스가 표시되어야 합니다.

![SonarQube Interface](/assets/img/2024-06-20-InstallSonarQubewithPostgresSQLonmacOS_0.png)

## 단계 2: PostgreSQL 설치

다음으로 PostgreSQL을 설치할 것입니다. Homebrew를 다시 사용하여 다음 명령을 실행하십시오:

<div class="content-ad"></div>

```js
brew install postgresql@15
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

# 단계 3: PostgreSQL 시작하기

PostgreSQL 서비스를 시작합니다:

```js
brew services restart postgresql@15
```

<div class="content-ad"></div>

문제가 발생하면 다음 명령어를 사용하여 PostgreSQL 사용자를 수동으로 생성하십시오:

```js
/opt/homebrew/opt/postgresql@15/bin/createuser -s postgres
```

# 단계 4: SonarQube를 위해 PostgreSQL 구성하기

이제 SonarQube를 위해 PostgreSQL 데이터베이스와 사용자를 설정해야 합니다. PostgreSQL 명령줄 인터페이스로 이동하여 다음 명령을 실행하십시오:

<div class="content-ad"></div>

```js
psql -U postgres
```

PostgreSQL 인터페이스에서 데이터베이스와 사용자를 생성하겠어요:

```js
create database sonarqube;
create user sonar;
alter user sonar with encrypted password 'yourstrongpassword';
GRANT ALL PRIVILEGES ON DATABASE sonarqube TO sonar;
\q
```

# 단계 5: OpenJDK 11 설치하기

<div class="content-ad"></div>

SonarQube에서 Java가 필요합니다, 그래서 OpenJDK 11을 설치할 거에요:

```js
brew install openjdk@11
```

# 단계 6: SonarQube를 PostgreSQL 사용하도록 구성하기

SonarQube 구성 파일을 열어주세요. 파일 위치는 /opt/homebrew/Cellar/sonarqube/10.5.0.89998/libexec/conf/sonar.properties입니다. 아래 라인들을 추가하거나 업데이트해서 SonarQube가 PostgreSQL 데이터베이스를 사용하도록 구성해주세요:

<div class="content-ad"></div>

```js
sonar.jdbc.username=sonar
sonar.jdbc.password=yourstrongpassword
sonar.jdbc.url=jdbc:postgresql://localhost/sonarqube
sonar.path.logs=/path/to/log
```

# 7단계: SonarQube 다시 시작

변경 사항을 적용하기 위해 SonarQube 서비스를 다시 시작하세요:

```js
brew services restart sonarqube
```

<div class="content-ad"></div>

# 단계 8: 잠재적인 문제 처리

SonarQube가 데이터베이스에 액세스하는 데 문제가 발생하면, sonar 사용자가 필요한 권한을 갖고 있는지 확인해주세요:

```js
psql -U postgres
alter user sonar with superuser;
\q
```

SonarQube 서비스를 한 번 더 재시작해주세요.

<div class="content-ad"></div>

```js
brew services restart sonarqube
```

# 단계 9: SonarQube에 로그인하세요

브라우저를 열고 localhost:9000으로 이동하세요. 다음 기본 자격 증명을 사용하여 로그인하세요:

- 사용자 이름: admin
- 비밀번호: admin

<div class="content-ad"></div>

첫 로그인 시 비밀번호를 변경하라는 안내를 받게 될 것입니다.

이러한 단계를 따라하면 맥OS에서 PostgreSQL을 사용하여 완벽하게 작동하는 SonarQube 인스턴스를 구축할 수 있습니다. 즐거운 코딩과 코드 품질 검사를 하세요!