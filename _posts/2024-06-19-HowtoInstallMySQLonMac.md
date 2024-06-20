---
title: "맥에서 MySQL 설치하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoInstallMySQLonMac_0.png"
date: 2024-06-19 15:14
ogImage: 
  url: /assets/img/2024-06-19-HowtoInstallMySQLonMac_0.png
tag: Tech
originalTitle: "How to Install MySQL on Mac"
link: "https://medium.com/@rodolfovmartins/how-to-install-mysql-on-mac-959df86a5319"
---



![](/assets/img/2024-06-19-HowtoInstallMySQLonMac_0.png)

MySQL은 웹사이트, 애플리케이션, 소프트웨어의 데이터를 관리하는 인기있는 관계형 데이터베이스 관리 시스템입니다. 맥에서 작업하는 개발자라면, 여러분의 기계에 MySQL을 설치하고 싶다면 다음의 간단한 단계를 따를 수 있습니다.

## Step 1: Homebrew 설치

Homebrew는 macOS용 패키지 관리자로, 소프트웨어 패키지를 쉽게 설치하고 관리할 수 있도록 해줍니다. Homebrew를 설치하려면 맥에서 터미널 앱을 열고 다음 명령어를 실행하세요:


<div class="content-ad"></div>


/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"


이 명령어는 홈브루를 다운로드하고 맥에 설치할 것입니다.

## 단계 2: MySQL 서버 설치

홈브루가 설치되면 MySQL을 설치하는 데 사용할 수 있습니다. 터미널 앱에서 다음 명령어를 실행하세요:

<div class="content-ad"></div>

```js
brew install mysql
```

이 명령어를 사용하면 Mac에 MySQL의 최신 버전이 설치됩니다.

## 단계 3: MySQL 서버 시작

MySQL 서버를 시작하려면 터미널 앱에서 다음 명령을 실행하십시오:

<div class="content-ad"></div>

```js
brew services start mysql
```

이 명령은 Mac에서 MySQL 서버를 시작합니다.

## 단계 4: MySQL 설치 확인

MySQL이 올바르게 설치되었는지 확인하려면 터미널 앱에서 다음 명령을 실행하십시오:

<div class="content-ad"></div>

```js
mysql -u root
```

이 명령은 MySQL 서버에 root 사용자로 연결합니다.

## 단계 5: 새 MySQL 사용자 만들기

보안상의 이유로 권한이 제한된 새 MySQL 사용자를 만드는 것이 좋습니다. 새 MySQL 사용자를 만들려면 터미널 앱에서 다음 명령을 실행하세요:

<div class="content-ad"></div>

```js
CREATE USER '새사용자'@'localhost' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON *.* TO '새사용자'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

새 사용자에 원하는 사용자 이름을, 비밀번호에 사용할 비밀번호를 대신 입력해주세요.

축하합니다! 맥에서 MySQL을 성공적으로 설치했습니다. 이제 웹사이트, 애플리케이션, 소프트웨어 데이터를 관리하기 위해 MySQL을 사용할 수 있습니다.