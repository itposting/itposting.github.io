---
title: "MacOS에서 Docker로 SQL 서버 설정하는 방법  단계별 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-SettingUpSQLServerwithDockeronMacOSAStep-by-StepGuide_0.png"
date: 2024-06-22 16:17
ogImage: 
  url: /assets/img/2024-06-22-SettingUpSQLServerwithDockeronMacOSAStep-by-StepGuide_0.png
tag: Tech
originalTitle: "Setting Up SQL Server with Docker on MacOS — A Step-by-Step Guide"
link: "https://medium.com/@ugurelsevket/setting-up-sql-server-with-docker-on-macos-a-step-by-step-guide-8742c725a63e"
---


# 단계 1: Docker와 Azure Data Studio 다운로드하기

먼저 docker.com에서 작업 중인 운영 체제와 프로세서에 적합한 Docker 버전을 다운로드하세요. 추가로 이 링크에서 Azure Data Studio를 얻으세요.

# 단계 2: Docker 계정 만들기

Docker를 시작하고 사용자 계정을 만들어 시작하세요.

<div class="content-ad"></div>

# 단계 3: SQL Server 이미지 다운로드하기

터미널을 열고 다음 명령을 사용하여 SQL Server 이미지를 다운로드하세요:

```js
docker pull mcr.microsoft.com/azure-sql-edge
```

![이미지](/assets/img/2024-06-22-SettingUpSQLServerwithDockeronMacOSAStep-by-StepGuide_0.png)

<div class="content-ad"></div>

다운로드가 완료되면 확인 메시지가 나타납니다.

# 단계 4: SQL Server 컨테이너 실행

다음 명령어를 사용하여 SQL Server 컨테이너를 시작하세요:

```js
docker run -e "ACCEPT_EULA=1" -e "MSSQL_SA_PASSWORD=reallyStrongPwd123" -e "MSSQL_PID=Developer" -e "MSSQL_USER=SA" -p 1433:1433 -d --name=sql mcr.microsoft.com/azure-sql-edge
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-SettingUpSQLServerwithDockeronMacOSAStep-by-StepGuide_1.png)

실행 중인 컨테이너를 확인하려면:

```bash
docker container ls
```

이미지 섹션에는 생성된 컨테이너가 표시됩니다.


<div class="content-ad"></div>

# 단계 5: Azure Data Studio와 연결하기

Azure Data Studio를 열고 "Create a Connection" 옵션을 사용하여 다음 세부 사항을 입력하세요:

- 서버: localhost
- 사용자 이름: SA
- 암호: reallyStrongPwd123

"Remember Password" 옵션을 확인하고 "Connect"를 클릭하세요. 연결 확인은 왼쪽 상단에 나타날 것입니다.

<div class="content-ad"></div>

# 단계 6: 컨테이너 중지

컨테이너를 중지하려면 다음 명령을 실행하세요:

```js
docker container stop container_id
```
이제 SQL Server가 Docker에서 가동 중이며, Azure Data Studio를 사용하여 연결을 설정할 수 있습니다. 이 지침을 따라 개발 또는 테스트 환경을 빠르게 구축하고 관리할 수 있습니다.