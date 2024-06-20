---
title: "Snowflake를 위한 CICD 및 DevOps 포괄적인 가이드"
description: ""
coverImage: "/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_0.png"
date: 2024-06-20 15:25
ogImage: 
  url: /assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_0.png
tag: Tech
originalTitle: "CI CD and DevOps for Snowflake: A Comprehensive Guide"
link: "https://medium.com/@melbdataguy/ci-cd-and-devops-for-snowflake-a-comprehensive-guide-9df87a24797d"
---


데이터 엔지니어링 및 데이터베이스 관리의 세계에서는 지속적 통합/지속적 배포(CI/CD) 실천이 민첩하고 신뢰성 있으며 효율적인 개발 워크플로우에 중요합니다. 성장 중인 클라우드 기반 데이터 웨어하우징 플랫폼인 Snowflake는 확장성, 적응성, 우수한 성능으로 유명합니다. 그러나 Snowflake를 위해 CI/CD를 구현하는 것은 표준화된 실천 방식과 특화된 도구 부재로 인한 독특한 도전에 직면하고 있습니다. 더하여 데이터베이스 프로젝트에 특화된 DevOps 및 CI/CD 워크플로에 대한 모범 사례를 상세히 설명하는 종합적인 문서 부재 문제가 있습니다.

이러한 도전에도 불구하고, 최근 Snowflake 내에서 유망한 발전이 있었으며, 새로운 기능 도입으로 DevOps 및 CI/CD 실천에 대한 명확한 지침과 도구 제공에 대한 가능성을 시사하고 있습니다. 이에 따라 Snowflake 사용자를 위한 DevOps 프로세스 표준화 접근 방식과 향상된 문서 작성을 간소화하기 위한 기대가 커지고 있습니다.

이 기사에서는 최근 기능 및 모범 사례를 활용한 Snowflake용 CI/CD 및 DevOps 설정의 총체적 데모에 대해 심층적으로 다룰 것입니다.

# 소개: SQL Server에서 Snowflake로의 간극을 메꾸는 것

<div class="content-ad"></div>

SQL Server 출신이신 분으로서 Snowflake로 전환하면서, 데이터베이스 객체를 관리하기 위한 표준이 없다는 점이 큰 장벽이었습니다. SQL Server의 SSDT(SQL Server Data Tools) 접근 방식과 DACPAC(Data-tier Application Component Package) 파일은 데이터베이스 변경 관리(DCM)를 선언적으로 처리하는 방법을 제공했지만, Snowflake에는 이와 같은 표준화된 접근 방식이 없었습니다. 초기 접근 방식은 Terraform과 같은 도구나 Schemachange 또는 Flyway와 같은 명령중심의 DCM 솔루션에 의존하는 경향이 있었는데, 이는 모든 사람들의 선호에 부합하지 않을 수 있습니다.

다행히도 Snowflake은 CREATE OR ALTER, EXECUTE IMMEDIATE FROM, Snowflake CLI 및 Git 통합과 같은 선언적 DCM을 위한 기본 블록을 도입하고 있습니다. 이러한 발전을 통해 Snowflake에 대한 CI/CD에 대해 더 구조화되고 효율적인 접근 방식이 가능해졌습니다.

## Snowflake의 CI/CD를 위한 Building Blocks 활용하기

Snowflake의 최근 기능은 CI/CD 및 DevOps 실천을 효과적으로 구현하기 위한 기초를 제공합니다. 이러한 기본 블록은 배포 프로세스를 자동화하고 협업을 강화하며 환경 간 일관성을 보장하는 사용자들을 능력을 제공합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_0.png" />

1. CREATE OR ALTER

스노우플레이크의 CREATE OR ALTER 기능을 사용하면 현재 상태에 대해 걱정할 필요없이 데이터베이스 테이블의 원하는 상태를 정의할 수 있습니다. 이 선언적 접근 방식은 데이터베이스 객체의 관리를 단순화하고 원활한 배포 워크플로우를 용이하게 합니다.

2. EXECUTE IMMEDIATE FROM

<div class="content-ad"></div>

#### 1. EXECUTE IMMEDIATE FROM command

The EXECUTE IMMEDIATE FROM command allows you to execute SQL statements stored in external files or URLs. This feature is crucial for automating deployment tasks and orchestrating deployment processes within Snowflake.

#### 2. Snowflake CLI

Snowflake CLI allows developers to run SQL queries, ad-hoc queries, or SQL query files effortlessly using the `snow sql` command. This functionality improves development workflows, making it easier to execute and manage queries efficiently within Snowflake environments.

#### 3. Git Integration

<div class="content-ad"></div>

Snowflake와 Git 저장소를 통합하면 코드의 중앙 집중식 데이터 원천이 제공되어 협업 및 버전 제어 기능을 강화할 수 있습니다. 개발자들은 Snowflake 환경 내에서 변경 사항을 추적하고 브랜치를 관리하며 Git 워크플로를 신속하게 활용할 수 있습니다. 이는 팀워크를 촉진하고 효율적인 배포 파이프라인을 용이하게합니다.

# Snowflake를 위한 CI/CD 구현: 단계별 안내

![이미지](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_1.png)

## 사전 요구 사항:

<div class="content-ad"></div>

- Snowflake 계정 (최소 sysadmin 액세스 권한)
- GitHub 계정
- Git 저장소 (관리자 액세스 권한)

## 실제 데모 플로우:

Snowflake를 위한 CI/CD를 설정하는 단계를 따라해보세요:

- 데이터베이스 및 스키마 생성

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_2.png" />

다른 환경에서도 같은 작업을 수행하세요.

참고: 데이터베이스 및 스키마는 기본적으로 변경되지 않는 객체이므로 Terraform과 같은 인프라 코드(IAC) 도구를 통해 이상적으로 관리됩니다. 그러나 이 데모에서는 수동으로 생성합니다.

2. Snowflake를 Git 리포지토리에 연결하기

<div class="content-ad"></div>

Step 2.1: GitHub에서 개인 액세스 토큰(PAT)을 생성합니다.

GitHub 계정의 Settings → Developer Settings → Personal Access Tokens → Tokens (classic)으로 이동하여 PAT을 생성합니다.

Step 2.2: GitHub PAT을 저장할 Secret을 생성합니다.

![GitHub PAT 이미지](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_3.png)

<div class="content-ad"></div>

Step 2.3: Snowflake 내에서 Git API 통합을 생성하세요.

![이미지](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_4.png)

Step 2.4: Snowflake 객체 및 구성을 저장할 Git 저장소를 설정하세요.

![이미지](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_5.png)

<div class="content-ad"></div>

3. 배포를 위한 서비스 계정 및 기타 Snowflake 객체 생성

배포를 위해 서비스 계정 및 필요한 기타 Snowflake 객체를 설정하세요. 적절한 권한 및 접근 제어를 보장해주세요.

![이미지](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_6.png)

4. 로컬 개발

<div class="content-ad"></div>

저희 지역 개발 환경 설정에 대해 Snowflake 프로젝트의 폴더 계층 구조를 아래 이미지처럼 구성하는 것을 권장합니다. 각 스키마마다 별도의 폴더가 할당되며, 각 스키마 폴더 내에서는 객체 유형에 따라 하위 폴더로 객체를 더 구성할 수 있습니다.

뿐만 아니라, 루트 수준에 스크립트 폴더를 포함하는 것을 제안합니다. 이를 통해 사전 배포 및 사후 배포 작업을 수용하여 DACPAC이 데이터베이스 프로젝트를 구성하는 방식과 유사하게 잘 구성되고 쉽게 탐색할 수 있는 구조를 유지할 수 있습니다.

테이블을 생성할 때 Snowflake의 CREATE OR ALTER 문을 사용하는 간편함과 효율성을 보여 드릴 수 있습니다. 이를 통해 새 테이블을 생성하거나 기존 테이블을 수정하는 등 테이블 스키마를 효과적으로 관리할 수 있습니다. CREATE OR REPLACE로 이미 정의된 테이블의 경우, CREATE OR ALTER로의 전환은 빠르게 조정할 수 있어 배포 파이프라인과의 원활한 호환성을 보장할 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_8.png" />

또한 Jinja 템플릿을 통합하여 배포 프로세스를 확장할 수 있습니다. 이를 통해 유연성과 확장성을 제공합니다. 예를 들어 데이터베이스 이름을 매개변수화함으로써 배포 중에 대상 환경을 동적으로 선택할 수 있으며, 이는 다양한 배포 시나리오에서 프로세스를 간소화합니다.

<img src="/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_9.png" />

다시 한번 제시된 폴더 계층 구조를 강조하면, 프로젝트 폴더 안에서 sf_deploy_dev.sql과 sf_deploy_tst.sql 두 가지 필수 스크립트를 찾을 수 있습니다. 이 스크립트는 Snowflake 객체의 배포를 조정하는 배포 진입점으로 작용합니다.

<div class="content-ad"></div>

여기에 그들의 구조를 보여주는 샘플 스니펫이 있어요:


![Snowflake CLI](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_10.png)


5. 로컬 Snow CLI 사용

내 경험상 Snowflake CLI를 전체 배포 파이프라인에 뛰어들기 전에 로컬에서 미리 테스트하는 것이 유익합니다. 이를 통해 만든 서비스 계정을 사용하여 연결을 확인하고 올바른 액세스 권한을 확인하며 쉬운 디버깅 및 테스트를 용이하게 할 수 있습니다.

<div class="content-ad"></div>

먼저 Snow CLI를 설치해야 합니다. Snow CLI는 Snowflake 문서에 제공된 설치 지침을 따라 간단히 설치할 수 있어요.

![Snowflake CLI](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_11.png)

설치가 완료되면 CLI 사용 및 명령어에 대한 안내를 위해 문서를 참조할 거에요. 우리의 경우 배포 워크플로에서 두 가지 SQL 명령어를 주로 활용할 거에요.

먼저 ALTER GIT REPOSITORY 명령어를 사용하여 링크된 Git 저장소에서 업데이트를 가져올 거에요. 이를 통해 Snowflake 환경이 코드베이스의 최신 변경 사항과 동기화되도록 할 거에요.

<div class="content-ad"></div>

표시되어 있는 내용을 아래와 같이 번역해 드리겠습니다.


![2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_12](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_12.png)

그 후에는 EXECUTE IMMEDIATE FROM 명령어를 사용하여 외부 파일이나 URL에 저장된 SQL 문을 실행할 것입니다. 우리의 경우에는 이 명령어를 사용하여 대상 데이터베이스로 객체를 배포할 것이며, 배포 스크립트 경로를 참조하게 됩니다. 예를 들면 sf_deploy_dev.sql과 같습니다.

![2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_13](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_13.png)

Snowflake CLI 명령어에서는 계정, 사용자, 창고와 같은 입력값을 지정하여 연결을 설정할 것입니다. 이후에는 이러한 입력값들을 GitHub 비밀에 저장하여 보안 및 편의성을 갖출 것입니다.


<div class="content-ad"></div>

6. GitHub Workflow를 만들기

GitHub Actions를 구성하여 대상 환경으로의 배포를 자동화합니다.

7. GitHub Secrets 채우기

GitHub에 필요한 시크릿과 환경 변수를 채워 넣어, 워크플로우 실행 중에 Snowflake 및 Git 리포지토리에 안전하게 액세스합니다.

<div class="content-ad"></div>

리포지토리에서 Settings → Secrets and Variables → Actions → New repository secret로 이동하세요.

![이미지](/assets/img/2024-06-20-CICDandDevOpsforSnowflakeAComprehensiveGuide_14.png)

8. 테스트 워크플로우

수동으로 또는 자동화된 이벤트(예: main으로 푸시/머지)를 트리거하여 구성된 GitHub 워크플로우를 유효성 검사하고, 배포 작업의 성공적인 실행과 올바른 처리를 확인하세요.

<div class="content-ad"></div>

# Snowflake에서 유의할 사항 및 권장 사항

## 유의할 사항:

1. CREATE OR ALTER TABLE 사용 시 제한 사항

- 이 명령의 제한 사항은 특히 특정 위치에 열을 삽입해야 할 때 제한적일 수 있습니다.
- 테이블에 대한 제약은 이 명령을 사용하여 뷰나 저장 프로시저와 같은 다른 데이터베이스 객체를 변경할 수 없다는 것을 의미합니다.

<div class="content-ad"></div>

2. Snowsight에서 CREATE OR ALTER 동작

- 명령이하는 작업과 Snowsight에 표시되는 것 사이의 불일치는 정말 혼란스러울 수 있습니다. CREATE OR ALTER를 통해 테이블이 생성되었더라도, Snowsight에서는 정의상 CREATE OR REPLACE로 표시됩니다. 이것이 Snowflake의 의도인지 또는 버그인지 확실하지 않습니다.

3. YAML 파이프라인에서의 단일 데이터베이스 연결

- 모든 환경에서 동일한 데이터베이스 연결을 사용하여 일관성을 유지하는 것이 실용적으로 보일 수 있지만, Snowflake가 이 접근 방식을 권장하거나 요구하는지를 고려하는 것이 중요합니다. 테스트(TST) 및 프로덕션(PRD)과 같이 더 높은 환경으로 전개하더라도, Git 저장소가 연결된 개발(dev) 환경과 일치하는 단일 연결을 유지합니다. 이 선택은 EXECUTE IMMEDIATE와 같은 SQL 명령의 올바른 실행을 보장합니다. 그러나 Snowflake가 각 환경에 대해 별도의 Git 저장소 연결을 설정하여 다른 데이터베이스 연결 사용을 가능하게 하는 것을 필수로 하는지는 명확하지 않습니다. Snowflake의 권장 사항에 대한 명확한 설명이 필요합니다.

<div class="content-ad"></div>

## 권장사항:

1. 배포 프로세스 중 더 나은 가시성을 위한 강화된 로깅 기능.

- 현재 배포 중 로그에서는 마지막 EXECUTE IMMEDIATE 명령의 출력만 캡처되어 전체 배포 프로세스의 가시성이 제한됩니다.
- Snowflake이 배포 중 수행하는 모든 작업을 포괄적으로 보여주는 강화된 로깅 기능을 구현하는 것이 유익할 것입니다. 이렇게 하면 배포 활동을 더 잘 추적하고 문제 해결 및 감사에 도움이 될 수 있습니다.

2. Snowflake에 의한 배포 artifacts의 개발

<div class="content-ad"></div>

- 높은 환경으로의 배포 프로세스를 간단히 하기 위해서는 Snowflake에 의한 배포 아티팩트 또는 배포 패키지의 개발을 탐색하는 것이 좋습니다.
- DACPAC(배포용 아티팩트로 빌드되는 SSDT의 접근 방식과 유사하게, Snowflake에서는 배포 아티팩트를 생성하고 관리하기 위한 간소화된 메커니즘을 제공할 수 있습니다.
- 이 접근 방식은 Snowflake가 다른 환경으로의 배포를 위해 필요한 SQL 스크립트, 구성 및 메타데이터를 포함하는 배포 패키지 또는 아티팩트를 생성하는 것을 포함할 것입니다.

Snowflake에 대한 CI/CD 및 DevOps 실천 방법을 구현하면, 기관은 데이터 엔지니어링 워크플로우에서 민첩성, 협업 및 자동화를 채택할 수 있습니다. 이 가이드에서 소개된 Snowflake의 최신 기능과 모베스트 프랙티스를 활용하여, 팀은 배포 프로세스를 최적화하고 오류를 최소화하며 데이터 중심 이니셔티브의 시장 진입 시간을 가속화할 수 있습니다.

Snowflake가 계속 발전함에 따라, 현대 데이터 엔지니어링의 빠르게 변화하는 지형에서 선도하기 위해 CI/CD를 채택하는 것이 중요해집니다.