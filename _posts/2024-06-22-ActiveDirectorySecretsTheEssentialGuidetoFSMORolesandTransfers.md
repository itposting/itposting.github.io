---
title: "Active Directory 비밀 필수 FSMO 역할 및 전송 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-ActiveDirectorySecretsTheEssentialGuidetoFSMORolesandTransfers_0.png"
date: 2024-06-22 16:26
ogImage: 
  url: /assets/img/2024-06-22-ActiveDirectorySecretsTheEssentialGuidetoFSMORolesandTransfers_0.png
tag: Tech
originalTitle: "Active Directory Secrets: The Essential Guide to FSMO Roles and Transfers"
link: "https://medium.com/system-weakness/active-directory-secrets-the-essential-guide-to-fsmo-roles-and-transfers-24be3cc1b6c1"
---


![이미지](/assets/img/2024-06-22-ActiveDirectorySecretsTheEssentialGuidetoFSMORolesandTransfers_0.png)

# FSMO 역할 소개

IT 인프라 영역에서 Active Directory (AD)는 조직 내 네트워크, 사용자 및 리소스를 관리하는 데 중요한 역할을 합니다. Active Directory의 핵심은 FSMO (Flexible Single Master Operation) 역할로, 디렉토리의 원할한 작동과 일관성을 위해 중요한 특별한 역할 집합입니다. 이러한 역할을 이해하고 관리하는 방법은 Active Directory 환경을 유지하는 업무를 맡은 IT 전문가에게 필수적입니다.

## FSMO 역할이란 무엇인가요?

<div class="content-ad"></div>

Active Directory은 멀티 마스터 데이터베이스 모델을 사용하여 도메인의 모든 쓰기 가능한 도메인 컨트롤러가 Active Directory 구성을 수정하고 이러한 변경 사항을 모든 다른 도메인 컨트롤러로 복제할 수 있도록 합니다. 그러나 일부 작업은 Active Directory 도메인 서비스(AD DS)의 무결성을 유지하기 위해 중앙 집중 제어가 필요합니다. 이러한 작업은 멀티 마스터 모드보다 단일 마스터 모드에서 더 잘 관리됩니다. 이러한 작업을 관리하는 특수 역할을 유연한 단일 마스터 운영(FSMO) 역할이라고 합니다.

FSMO 역할은 권장된 지침에 따라 하나의 도메인 컨트롤러에 할당하거나 여러 도메인 컨트롤러에 분산할 수 있습니다. 그러나 각 역할은 도메인이나 포리스트 내에서 한 번만 존재할 수 있으며, 이는 오퍼레이션 마스터 역할 보유자가 AD DS 인프라의 중요한 구성 요소임을 의미합니다. 역할을 보유한 도메인 컨트롤러가 실패하고 복구할 수 없는 경우 다른 도메인 컨트롤러가 강제로 해당 오퍼레이션 마스터 역할을 인계하여 Active Directory 환경의 작동 및 무결성을 보장해야 합니다.

## 왜 FSMO 역할이 중요한가요?

FSMO 역할은 여러 도메인 컨트롤러에서 동시에 실행할 경우 Active Directory 데이터베이스 내의 불일치와 훼손으로 이어질 수 있는 특정 작업을 처리하도록 설계되었습니다. 예를 들어, 스키마 수정이나 RID 할당 처리와 같은 작업은 순서를 유지하기 위해 단일 권한 있는 소스가 필요합니다. 지정된 FSMO 역할 보유자는 이러한 작업이 충돌 없이 수행되도록 보장하여 디렉터리 서비스의 안정성과 신뢰성을 유지합니다.

<div class="content-ad"></div>

활성 디렉터리 및 그 구성 요소 개요

활성 디렉터리는 Microsoft가 Windows 도메인 네트워크용으로 개발한 디렉터리 서비스입니다. 대부분의 Windows Server 운영 체제에 포함되어 있으며 다음과 같은 다양한 네트워크 서비스를 제공합니다.

- 중앙 집중식 도메인 관리: 관리자가 네트워크 환경 내에서 사용자, 컴퓨터 및 기타 리소스를 관리할 수 있도록 합니다.
- 인증 및 권한 부여: 사용자 ID를 확인하고 리소스에 대한 액세스를 제어하는 메커니즘을 제공합니다.
- LDAP 지원: 경량 디렉터리 액세스 프로토콜(LDAP)을 사용하여 디렉터리에 대한 쿼리 및 업데이트를 가능하게 합니다.
- 복제: 복제를 통해 여러 도메인 컨트롤러 간에 데이터 일관성을 보장합니다.

이 프레임워크 내에서 FSMO 역할은 핵심 디렉터리 작업이 원활하게 수행되고 충돌이 없도록 보장하는 데 중요한 역할을 합니다.

<div class="content-ad"></div>

FSMO 역할을 이해하는 것의 중요성

IT 전문가와 시스템 관리자들에게는 FSMO 역할을 완전히 이해하는 것이 중요합니다. 이러한 역할을 적절히 관리하면 Active Directory 환경의 최적 성능, 가용성 및 신뢰성을 보장할 수 있습니다. 이러한 역할을 잘못 관리하거나 무시하면 디렉터리 문제가 발생할 수 있으며, 복제 실패, 인증 문제 및 잠재적 보안 취약성까지 발생할 수 있습니다.

본 문서에서는 다양한 종류의 FSMO 역할, 그 책임과 효과적인 관리 방법에 대해 자세히 살펴볼 것입니다. 또한 PowerShell을 사용하여 이러한 역할을 전송하는 방법, 따라야 할 최상의 사례 및 역할 선점이 필요한 재해 발생 시 취해야 할 조치에 대해 탐구할 것입니다. 이 지침의 끝에 FSMO 역할에 대한 포괄적인 이해와 견고하고 신뢰성 있는 Active Directory 인프라를 유지하기 위한 필요 기술을 습득하게 될 것입니다.

# FSMO 역할의 종류:

<div class="content-ad"></div>

Active Directory의 FSMO 역할은 고유한 책임과 범위를 갖는 다섯 가지 역할로 분류됩니다. 이러한 역할은 Active Directory 환경 내에서의 영향 범위를 기반으로 추가적으로 분류됩니다: Forest-Wide 역할과 Domain-Wide 역할.

![이미지](/assets/img/2024-06-22-ActiveDirectorySecretsTheEssentialGuidetoFSMORolesandTransfers_1.png)

## Forest-Wide FSMO Roles

Forest-Wide 역할은 전체 Active Directory Forest를 걸친 범위를 가지고 있습니다. 이러한 역할은 Forest 내의 모든 도메인에 일관성을 유지해야 하는 작업에 필수적입니다.

<div class="content-ad"></div>

- 스키마 작업 마스터:

- 책임: 스키마 마스터는 Active Directory 스키마를 유지 관리하고 수정하는 역할을 담당합니다. 스키마는 디렉터리의 구조를 정의하며, 생성될 수 있는 객체 및 속성을 포함합니다. 새로운 속성이나 객체 클래스를 추가하는 등의 스키마 변경은 숲 전체의 일관성을 보장하기 위해 스키마 마스터를 통해 처리되어야 합니다.
- 범위: 숲 전체. 숲 당 한 명의 스키마 마스터만 존재합니다.

Active Directory 숲에서 스키마 마스터 역할을 소유한 사용자는 다음 PowerShell 명령을 사용하여 찾을 수 있습니다:

```js
Get-ADForest | select SchemaMaster
```

<div class="content-ad"></div>

2. 도메인 네이밍 마스터:

- 책임: 도메인 네이밍 마스터는 숲에 도메인을 추가하고 제거하는 업무를 담당합니다. 그는 새로운 도메인이 올바르게 이름공간에 추가되고 기존 도메인이 제대로 제거되도록 보장합니다. 이 역할은 또한 숲 내에서 중복된 도메인 이름을 방지합니다.
- 범위: 숲 전체. 숲 당 하나의 도메인 네이밍 마스터만 존재합니다.

Active Directory 숲에서 도메인 네이밍 마스터 역할 소유자를 다음 PowerShell 명령어를 사용하여 찾을 수 있습니다:

```js
Get-ADForest | select DomainNamingMaster
```

<div class="content-ad"></div>

## 도메인 전체 FSMO 역할

도메인 전체 역할은 Active Directory 포리스트 내의 개별 도메인에 특화되어 있습니다. 각 도메인에는 고유한 이러한 역할이 있습니다.

- PDC (기본 도메인 컨트롤러) 에뮬레이터

- 역할: PDC 에뮬레이터는 도메인 내에서 시간 동기화를 위한 중심지로 작용하며, 비밀번호 변경을 관리하고 다른 도메인 컨트롤러들이 사용 불가능할 때 인증 요청에 대한 대체 역할을 합니다. 서버와 클라이언트 간에 5분 이내의 시차를 유지하여 성공적인 인증을 유지합니다. 5분 이상이 되면 장치가 도메인에 추가되지 않으며, 사용자는 인증할 수 없으며, Active Directory 통합 애플리케이션은 인증 관련 오류를 표시합니다. 또한, 이전 Windows NT 환경의 PDC 존재에 의존하는 응용 프로그램들을 위한 레가시 지원을 처리합니다. PDC는 또한 그룹 정책 개체 (GPO) 편집을 관리합니다. GPO가 보거나 업데이트될 때마다, PDC의 SYSVOL 폴더에 저장된 사본에서 수행됩니다. 이 역할의 중요성으로 인해, 가장 신뢰할 수 있는 도메인 컨트롤러를 PDC 역할을 보유할 수 있도록 선택하는 것이 좋습니다.
- 범위: 도메인 전체. 각 도메인에는 고유한 PDC 에뮬레이터가 있습니다.

<div class="content-ad"></div>

Active Directory 도메인에서 PDC 역할 소유자를 찾는 방법은 다음과 같습니다:

```js
Get-ADDomain | select PDCEmulator
```

2. RID(상대 식별자) 마스터

- 역할: 도메인에서 개체를 생성할 때 사용되는 RID 풀을 유지하는 역할을 합니다. 도메인의 각 개체는 고유한 보안 식별자(SID)를 가지고 있으며, RID 값은 SID 생성 프로세스의 일부입니다. SID는 Active Directory에서 개체를 고유하게 식별하며, RID는 SID 값의 증가하는 부분입니다. RID 값이 SID를 생성하는 데 사용되면 재사용할 수 없습니다. Active Directory에서 개체가 삭제된 후에도 RID 값을 회수할 수 없으므로 SID의 고유성이 유지됩니다. RID 역할 소유자는 RID 풀을 유지하며, 도메인에 여러 도메인 컨트롤러가 있는 경우 각 도메인 컨트롤러에 500개의 RID 값을 할당합니다. 도메인 컨트롤러의 RID 풀 사용량이 50%를 초과하면 연속적으로 고유 식별자의 공급을 보장하기 위해 RID 역할 소유자에게 다른 RID 블록을 요청합니다.
- 범위: 도메인 전체적으로, 각 도메인에는 고유한 RID 마스터가 있습니다.

<div class="content-ad"></div>

Active Directory 도메인에서 RID 역할 소유자는 다음 PowerShell 명령을 사용하여 찾을 수 있습니다:

```js
Get-ADDomain | select RIDMaster
```

3. 인프라운영 마스터:
   
- 책임: 이는 도메인 간에 SID 및 식별 이름(DN) 값을 복제하는 역할을 담당합니다. SID 및 DN 값은 포리스트 내에서 위치에 따라 변경됩니다. 객체가 도메인 간으로 이동될 때, 그들의 새로운 값은 그룹 및 액세스 제어 목록(ACLs)에서 업데이트 되어야 합니다. 인프라운영 마스터는 이 작업을 처리하여 이동된 객체가 서비스에 중단 없이 자원에 액세스할 수 있도록 보장합니다.
- 범위: 도메인 전반적으로 적용됩니다. 각 도메인은 자체 인프라운영 마스터를 보유합니다.

<div class="content-ad"></div>

Active Directory 도메인에서, 인프라스트럭처 운영 마스터 역할 소유자를 다음 PowerShell 명령을 사용하여 찾을 수 있습니다.

```js
Get-ADDomain | select InfrastructureMaster
```

# FSMO Role 배치

![이미지](/assets/img/2024-06-22-ActiveDirectorySecretsTheEssentialGuidetoFSMORolesandTransfers_2.png)

<div class="content-ad"></div>

다음 시나리오를 고려해보세요: 다중 도메인 구조를 갖춘 회사인 Ecorp은 하나의 도메인에서 세 개의 도메인을 갖고 있습니다. 포리스트 루트 도메인은 Ecorp.com이며, Ecorp.net은 미국 본사에서 사용되고, Ecorp.in은 인도 지사에서 사용됩니다. 이러한 도메인들은 공통된 포리스트를 공유하며, 최적의 성능과 신뢰성을 유지하기 위해 FSMO 역할을 신중히 할당해야 합니다.

## 포리스트 전체 역할 배치

Ecorp.com이 포리스트 루트 도메인인 만큼, 스키마 마스터와 도메인 네이밍 마스터와 같은 포리스트 전체 FSMO 역할이 위치합니다. 이러한 역할은 포리스트 전반에 걸쳐 발생하는 변경사항이 드물기 때문에 처리 능력에 대한 요구가 적습니다. 그러나 다른 도메인 활동을 지원하기 위해 높은 가용성이 필수적입니다. Ecorp.com 도메인에는 PDC01, SDC01 및 SDC02 세 개의 도메인 컨트롤러가 있습니다. 신뢰성이 높기 때문에, PDC01이 스키마 마스터와 도메인 네이밍 마스터 역할을 수행하도록 할당됩니다.

## 도메인 전체 역할 고려 사항

<div class="content-ad"></div>

PDC 에뮬레이터는 비밀번호 변경, 시간 동기화 및 그룹 정책 개체 (GPO) 편집을 관리하기 때문에 가장 리소스를 많이 사용하는 FSMO 역할입니다. 따라서 이 역할은 처리 능력이 가장 높은 도메인 컨트롤러에서 실행되어야 합니다. 이 경우에 해당하는 것은 PDC01 입니다. SID 생성 및 할당에 중요한 RID 마스터 역할 역시 신뢰할 수 있는 도메인 컨트롤러에 있어야만 네트워크 지연 문제가 발생하지 않습니다. 따라서 PDC01은 RID 마스터 역할 또한 보유하고 있어서 최적의 성능을 보장하고 잠재적인 지연을 최소화합니다.

## 다중 도메인 참조와 인프라스트럭처 마스터

다중 도메인 환경에서는 다중 도메인 참조가 중요합니다. 예를 들어, 포리스트 루트 도메인의 사용자 계정 이름이 변경된다면, 이 변경 사항은 포리스트 루트 도메인의 모든 도메인 컨트롤러에 전파되어야 합니다. 또한 사용자가 다른 도메인의 그룹에 속해 있다면, 이러한 그룹도 새 값으로 업데이트되어야 합니다. 이를 처리하기 위해 SDC01은 비글로벌 카탈로그 서버로 지정되어 있으며 인프라스트럭처 마스터 역할을 보유하고 있습니다.

## 백업 및 재해 복구

<div class="content-ad"></div>

SDC02은 백업 도메인 컨트롤러 역할을 합니다. 만약 FSMO 역할 보유자 중 하나에 장애가 발생할 경우 SDC02는 필요한 역할을 대신 수행하여 운영의 연속성을 보장합니다. 어떤 인프라에서는 숲 루트 도메인이 활발하게 사용되지 않을 수도 있지만, 이러한 경우에도 여러 도메인 컨트롤러를 유지하는 것은 불필요한 관리 부담으로 여겨질 수 있습니다.

## Ecorp.in 도메인 구성

Ecorp.in 도메인은 대부분 영업 직원으로 구성된 25명 미만의 지역 사무실을 지원합니다. 작은 규모와 낮은 자원 요구로 인해, 여러 도메인 컨트롤러를 유지하는 것은 정당화되지 않습니다. 따라서 Ecorp.in 도메인의 PDC01은 모든 세 개의 도메인 전체 FSMO 역할을 호스팅하며, SDC01은 DR(재해 복구) 시나리오에서 활용될 수 있도록 백업 도메인 컨트롤러로 작동합니다.

# PowerShell을 사용한 FSMO 역할 이동:

<div class="content-ad"></div>

FSMO 역할을 PowerShell을 사용하여 전송하는 것은 귀하의 Active Directory 환경에 최소한의 방해를 준다는 간단한 과정입니다. 이 섹션에서는 전송을 위한 사전 준비 조건, 각 FSMO 역할을 전송하는 단계별 절차 및 전송을 확인하는 방법을 안내해 드리겠습니다.

## FSMO 역할을 전송하기 위한 사전 요구 사항

- 소스 및 대상 도메인 컨트롤러에서 관리자 권한을 갖고 있는지 확인하십시오. 도메인 전체 역할을 옮겨야 하는 경우, 최소한 Domain Admins 권한이 있어야 합니다. 교차 도메인 역할인 경우 Enterprise Admins 권한이 필요합니다.
- 전송에 관여하는 도메인 컨트롤러 간의 네트워크 연결성을 확인하십시오.
- 실행할 시스템에 Active Directory PowerShell 모듈이 설치되어 있는지 확인하십시오.

시작하기 전에 현재 FSMO 역할 보유자를 확인해야 합니다. 다음 명령을 실행하여 확인할 수 있습니다:

<div class="content-ad"></div>

```js
netdom query fsmo
```

인프라 구조에서 ECORP-SDC02라는 새 도메인 컨트롤러가 추가되었습니다. 새 서버로 도메인 전체 FSMO 역할인 PDC 에뮬레이터, RID 및 인프라 역할을 이전하고 싶습니다:

```js
Move-ADDirectoryServerOperationMasterRole -Identity ECORP-SDC02 -OperationMasterRole PDCEmulator, RIDMaster, InfrastructureMaster
```

이동이 완료되면 역할 소유자를 다시 확인할 수 있습니다.

<div class="content-ad"></div>

만약 모든 다섯 FSMO 역할을 새 호스트로 이전해야 한다면 다음 명령어를 사용할 수 있어요:

```js
Move-ADDirectoryServerOperationMasterRole -Identity ECORP-SDC02 -OperationMasterRole SchemaMaster, DomainNamingMaster, PDCEmulator, RIDMaster, InfrastructureMaster
```

전송이 완료되면, 시스템은 디렉토리 서비스 로그 아래 이벤트 ID 1458을 가진 이벤트를 생성할 거에요.

# 재해 발생 시 FSMO 역할 탈취하기

<div class="content-ad"></div>

불행하게도 FSMO 역할을 보유한 도메인 컨트롤러가 고장나서 회복할 수 없는 경우(하드웨어 고장, 시스템 작동 문제, 강제로 복구된 도메인 컨트롤러), 다른 도메인 컨트롤러로 FSMO 역할을 취득해야 할 필요가 있습니다. FSMO 역할을 취득하는 것은 중요한 절차이며, 원래 역할 보유자가 영구적으로 오프라인 상태에 있거나 합리적인 시간 내에 복원할 수 없을 때에만 수행해야 합니다.

FSMO 역할 취득을 진행하기 전에 다음 사항을 확인하세요:

- 원래 FSMO 역할 보유자가 실제로 도달할 수 없고 일시적으로 오프라인 상태가 아닌지 확인합니다.
- 충돌을 방지하기 위해 실패한 도메인 컨트롤러를 먼저 도메인에서 제거한 후 온라인으로 돌리지 않을 것임을 확인합니다.

역할을 취득하려면 다음 명령어를 사용할 수 있습니다:

<div class="content-ad"></div>

```js
Move-ADDirectoryServerOperationMasterRole -Identity "TargetDC" -OperationMasterRole SchemaMaster, DomainNamingMaster, PDCEmulator, RIDMaster, InfrastructureMaster -Force
```

FSMO 역할 이전 명령에서 변경된 것은 끝에 있는 -Force 매개변수 뿐입니다. 그 이외에는 정확히 같은 명령입니다. 또한 Move-ADDirectoryServerOperationMasterRole -Identity `TargetDC` -OperationMasterRole `FSMO Role` -Force를 사용하여 개별 역할을 인계할 수 있습니다.
`FSMO Role`은 실제 FSMO 역할 값으로, `TargetDC`는 대상 도메인 컨트롤러로 대체할 수 있습니다.

# FSMO 역할 배치를 위한 최선의 방법

이전 섹션에서 FSMO 역할 배치에 대한 다양한 고려 사항을 논의했습니다. 여기서 최적의 성능과 신뢰성을 보장하기 위한 주요 사항을 요약하겠습니다:

<div class="content-ad"></div>

## 네트워크 연결성

- 포리스트 내 모든 도메인 컨트롤러가 네트워크 연결 장벽 없이 FSMO 역할 소유자에게 도달할 수 있는지 확인하세요. 도메인 컨트롤러가 분할된 네트워크에 있는 경우, 트래픽이 올바르게 경로로 전달되는지 확인하세요.

## 역할 분배

- 필요에 따라 FSMO 역할을 여러 서버에 분배하되, 더 많은 서버는 관리 부담을 증가시킵니다. 특별한 요구 사항이 없는 경우에는 FSMO 역할을 더 적은 수의 컴퓨터에 유지하려고 노력하세요.

<div class="content-ad"></div>

## PDC 역할

- PDC 역할을 가장 신뢰할 수 있고 강력한 도메인 컨트롤러에 배치하세요. PDC에 애플리케이션 및 다른 Windows Server 역할을 설치하지 않도록 하여 불필요한 리소스 사용을 최소화하세요.

## RID 마스터 및 PDC 역할

- RID 마스터 및 PDC 역할을 동일 도메인 내 동일 도메인 컨트롤러에 유지하세요. 이렇게 함으로써 이러한 역할 간 신뢰할 수 있는 통신이 보장되며, 해당 운영에 중요합니다. RID 마스터 역할은 리소스 풋프린트가 작기 때문에 도메인 컨트롤러의 성능에 중대한 영향을 미치지 않습니다.

<div class="content-ad"></div>

## 스키마 마스터 및 도메인 네이밍 마스터

- 스키마 마스터 및 도메인 네이밍 마스터 역할을 포레스트 루트 도메인의 PDC에 배치하세요. 성숙한 Active Directory 포레스트에서는 스키마 변경이나 도메인 컨트롤러 추가/제거가 드물지만 발생할 때, 이러한 역할은 변경을 관리하기 위해 제어된 방식으로 사용 가능해야 합니다.

## 인프라스트럭처 마스터

- 가능하다면 인프라스트럭처 마스터 역할을 글로벌 카탈로그 서버가 아닌 다른 서버에 할당하세요. 글로벌 카탈로그 서버는 포레스트의 모든 Active Directory 개체의 부분 복사본을 갖고 있어 인프라스트럭처 마스터 역할이 갖고 있지 않은 개체를 업데이트하는 데 방해가 될 수 있습니다. 그러나 Active Directory 재활용 통의 기능이 사용 중이라면 모든 도메인 컨트롤러가 교차 도메인 개체 참조를 업데이트하는 책임이 있기 때문에 인프라스트럭처 마스터 역할의 배치가 덜 중요해집니다.

<div class="content-ad"></div>

이러한 모범 사례를 준수함으로써 FSMO 역할을 최적으로 배치하여 견고하고 효율적인 Active Directory 환경을 유지할 수 있습니다.

# 결론

요약하면, FSMO 역할을 이해하고 관리하는 것은 Active Directory 환경의 무결성, 성능 및 신뢰성을 유지하는 데 중요합니다. 이러한 역할의 배치와 이전을 신중히 고려하고 모범 사례를 따르면, 관리자는 재해 발생 시 효율적인 운영과 신속한 복구를 보장할 수 있습니다. 적절한 FSMO 역할 관리는 도메인 컨트롤러의 원활한 작동을 지원할뿐만 아니라 잠재적인 중단을 예방하여 Active Directory 인프라 전반의 건강과 효율성을 지원합니다.