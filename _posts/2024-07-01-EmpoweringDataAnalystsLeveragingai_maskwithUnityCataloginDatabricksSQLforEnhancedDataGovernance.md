---
title: " 데이터 분석가를 위한 강력한 도구 Databricks SQL에서 Unity Catalog와 ai_mask를 활용한 데이터 거버넌스 강화 방법"
description: ""
coverImage: "/assets/img/2024-07-01-EmpoweringDataAnalystsLeveragingai_maskwithUnityCataloginDatabricksSQLforEnhancedDataGovernance_0.png"
date: 2024-07-01 20:25
ogImage: 
  url: /assets/img/2024-07-01-EmpoweringDataAnalystsLeveragingai_maskwithUnityCataloginDatabricksSQLforEnhancedDataGovernance_0.png
tag: Tech
originalTitle: "Empowering Data Analysts: Leveraging ai_mask with Unity Catalog in Databricks SQL for Enhanced Data Governance"
link: "https://medium.com/dbsql-sme-engineering/empowering-data-analysts-leveraging-ai-mask-with-unity-catalog-in-databricks-sql-for-enhanced-data-46d0d10edef9"
---



![image](/assets/img/2024-07-01-EmpoweringDataAnalystsLeveragingai_maskwithUnityCataloginDatabricksSQLforEnhancedDataGovernance_0.png)

Author: Osama Mansour, Databricks의 솔루션 아키텍트

## 소개

빅데이터와 인공지능 시대에 있어서 정보가 물 흐르듯 흐르는 상황에서 민감한 데이터를 보호하는 것은 전 세계 기업들에게 중요해졌습니다. 데이터 분석가들은 종종 이 작업의 최전선에 섰으며, 데이터가 통찰력을 유지할 뿐만 아니라 다양한 데이터 보호 규정과도 안전하고 준수한지 확인합니다. Databricks의 ai_mask 함수가 데이터 거버넌스에서 강력한 도구로 등장합니다.


<div class="content-ad"></div>

이 블로그에서는 ai_mask를 사용하여 잠재적으로 민감한 데이터를 자동으로 마스킹하고, 이 기능을 Unity Catalog의 MASK와 Dynamic Views와 같은 더 넓은 데이터 보호 프레임에 통합하며, Unity Catalog의 강력한 데이터 자산 태깅 프레임워크를 활용하여 인식된 PII 데이터로 자동으로 테이블과 열에 태그를 지정할 것입니다.

# ai_mask 함수 이해

ai_mask() 함수는 Databricks SQL의 기능으로, 데이터 분석가가 텍스트 데이터 내에서 민감한 정보를 자동으로 마스킹할 수 있게 해줍니다. 최신 AI 모델을 활용하여, 해당 함수는 주어진 텍스트에서 개인 식별 번호, 이메일 주소 및 전화 번호와 같은 지정된 엔티티를 식별하고 마스킹할 수 있습니다. 이 능력은 개인 정보 보호를 유지하고 GDPR 및 CCPA와 같은 데이터 보호 기준을 준수하는 데 중요합니다.

# ai_mask() 함수의 주요 기능

<div class="content-ad"></div>

- 생성적 AI 모델 통합: ai_mask() 함수는 Mixtral-8x7B Instruct와 같은 고급 생성적 AI 모델을 활용하여 텍스트 데이터에서 지정된 엔티티를 정확하게 식별하고 마스킹하는 데 사용됩니다. 이 통합을 통해 다양한 유형의 민감한 정보를 마스킹하는 데 높은 정밀도와 유연성을 제공합니다.
- 다국어 지원: 해당 함수는 주로 영어에 튜닝되어 있지만 기저 언어 모델은 여러 언어를 처리할 수 있어 전 세계적인 응용 프로그램에 유연하게 대응할 수 있습니다. 이 다중 언어 지원은 기관이 다양한 데이터 세트 전반에 데이터 마스킹을 적용할 수 있도록 보장합니다.
- 사용자 정의 가능한 마스킹: 사용자는 '사람', '이메일', '전화', '주소', '신용 카드 번호', '의료 기록 번호', 'SSN' 등의 라벨 배열을 제공하여 마스킹하고자 하는 정보 유형을 지정할 수 있습니다. 이 기능을 통해 데이터의 민감도와 관련성에 따라 목표 지정 마스킹이 가능합니다.
- 데이터 개인 정보 보호 규정 준수: 민감한 정보를 마스킹함으로써, ai_mask() 함수는 조직이 다양한 데이터 개인 정보 보호 법률과 규정을 준수하는데 도움을 줍니다. 이 준수는 엄격한 데이터 보호 기준이 적용되는 관할 지역에서 사업을 하는 기업에게 중요합니다.
- 속도 제한 및 라이선스: 함수는 기본 Foundation Model API의 공정한 사용을 보장하기 위해 속도 제한을 받습니다. 또한, ai_mask() 함수에서 사용되는 모델은 Apache 2.0 라이선스 또는 Llama 2 커뮤니티 라이선스에 따라 라이선스가 부여되어 사용자는 준수 여부를 검토할 것을 권장합니다.

# 데이터 거버넌스에서 ai_mask의 역할

데이터 거버넌스는 조직이 목표를 달성하는 데 정보를 효과적으로 사용할 수 있도록 보장하는 프로세스, 정책, 기준 및 측정 항목을 포함합니다. 이것이 ai_mask 함수가 데이터 거버넌스 프레임워크에 어떻게 맞는지 살펴봅시다:

- 개인 정보 보호 준수: 민감한 정보를 자동으로 마스킹함으로써, ai_mask() 함수는 조직이 개인 정보 보호 법률 및 규정을 준수하여 데이터 누출 및 관련 벌칙 위험을 줄이는 데 도움을 줍니다.
- 데이터 최소화: 데이터 개인 정보 보호의 중요 원칙은 목적에 필요한 데이터만 수집하는 것입니다. ai_mask()는 대규모 데이터 세트 내 불필요한 민감한 세부 정보를 마스킹함으로써 데이터 최소화에 도움을 줍니다.
- 액세스 제어: 직접적인 액세스 제어 도구는 아니지만, ai_mask는 액세스 제어 정책을 보완하여 개인이 특정 데이터에 액세스 권한이 있더라도 해당 데이터 내의 민감한 정보가 명시적으로 허용되지 않는 한 노출되지 않도록 보장합니다. ai_mask는 테이블 및 열 수준에서 정책에 맞는 태깅을 위한 입력으로 사용될 수 있습니다. 이 함수는 Unity Catalog 자산 태그 프레임워크와 결합하여 환경 전반에 걸쳐 PII 액세스를 찾고 선행적으로 관리하는 강력한 도구로 활용됩니다.

<div class="content-ad"></div>

# `ai_mask` 사용 시기와 적합 여부

`ai_mask()` 함수는 대규모 언어 모델(Large Language Models, LLMs)을 활용하여 특히 많은 양의 텍스트나 문자열을 다룰 때 효과적입니다. 이 함수의 최적 적용 시나리오는 환자 노트, 고객 피드백 또는 설문 결과와 같이 자유형식 텍스트가 있는 테이블의 열이 있을 때입니다.

그러나 `ai_mask()` 함수는 간결한 텍스트 입력에 대해 최적으로 작동하지 않을 수 있습니다. 예를 들어 'first_name'이나 'last_name'과 같은 열이 있다면, LLM 모델은 때로는 사람 이름이 엔티티 이름인지 정확하게 인식하는 데 어려움을 겪을 수 있습니다(예: "Montreal" 또는 "Key"). 심지어 해당 엔티티 이름이 영어가 아닌 경우에도 마스크 필드에서 'Name'으로 표시되었더라도 정확히 인식하지 못할 수 있습니다.

보다 넓게 보면, `ai_mask` 함수는 각 사용자의 비즈니스 및 법적 요구에 특별히 설계된 종합적 인가 및 마스킹 프레임워크 내에서 활용되고 적용되어야 합니다. 마스킹 작업을 가속화하고 자동화하며 정확성/완결성을 향상시키는 매우 강력한 도구이지만, 데이터 보호의 유일한 방어선으로 사용해서는 안 됩니다.

<div class="content-ad"></div>

# ai_mask의 실용적인 응용

ai_mask 함수의 다재다능성으로 인해 다양한 산업과 시나리오에 적용할 수 있습니다. 예를 들어, 의료 분야에서는 연구 목적으로 환자 기록을 공유하기 전에 ai_mask를 사용하여 환자 기록을 익명화할 수 있습니다. 금융 분야에서는 금융 보고서에 공유되는 계좌 번호나 거래 세부 내역을 마스킹하는 데 ai_mask를 사용할 수 있습니다.

# AI Mask의 활용 사례 — 시나리오: 병원 입원 기록에서 환자 데이터 개인정보 보호 강화

배경: 병원은 환자 입원 중에 이름, 연락처, 건강 상태 등 민감한 개인 정보를 수집합니다. 이러한 데이터는 치료에 중요하지만 미국의 HIPAA와 같은 규정을 준수하기 위해 엄격한 기밀 유지 조치를 취해야 합니다.

<div class="content-ad"></div>

도전: 의료 분석가들은 종종 환자 데이터를 분석하여 치료 제공을 개선하거나 자원 필요를 예측하거나 건강 연구를 수행해야 합니다. 그러나 환자 프라이버시를 침해하지 않고 이를 수행해야 합니다.

Databricks SQL AI의 ai_mask 기능을 활용한 솔루션. 의료 분야에서는 최종 사용자의 액세스 수준을 고려하는 것이 중요하며, ai_mask를 다른 보다 엄격하고 결정론적인 규칙 및 열 기반 접근법과 결합할 수 있습니다.

# 단계 1: 민감한 정보 마스킹

데이터 분석가들은 환자 입원 기록의 민감한 정보를 자동으로 마스킹하는데 ai_mask 함수를 사용할 수 있습니다. 이 함수는 SQL 쿼리 내에서 직접 적용될 수 있어 기존 데이터 워크플로에 쉽게 통합할 수 있습니다.

<div class="content-ad"></div>

```sql
SELECT
admission_id
,patient_first_name
,contact_number
,patient_notes
FROM patient_data;
```

![Empowering Data Analysts Leveraging AI](/assets/img/2024-07-01-EmpoweringDataAnalystsLeveragingai_maskwithUnityCataloginDatabricksSQLforEnhancedDataGovernance_1.png)

# 단계 2: 마스킹된 데이터 분석

민감한 정보가 마스킹된 상태에서 분석가들은 병원 운영 및 환자 치료 향상을 위해 다양한 분석을 안전하게 수행할 수 있습니다. 예를 들어, 특정 진단의 빈도를 분석하거나 치료 계획에 기반한 자원을 준비하거나 환자 개인 정보를 위험에 빠뜨리지 않고 입원 트렌드를 연구할 수 있습니다.


<div class="content-ad"></div>

PHI 데이터의 단일 관리 지점으로 ai_mask를 사용할 수는 없기 때문에 먼저 특정 열에 대한 액세스를 제공하는 더 굵은 관리 기능을 만들어야 합니다. 이 기능은 PII가 있을 수 있는 모든 열에 대해 관리자 수준의 그룹만 데이터에 액세스할 수 있도록 합니다. 이를 위해 'admins' 그룹에 사용자가 속해 있는지 확인하는 SQL UDF를 만들어야 하며, 해당 사용자가 관리자 그룹의 일부인 경우에는 데이터를 암호 해독하여 볼 수 있고, 그렇지 않은 경우에는 AI가 마스킹한 데이터만 볼 수 있게 됩니다:

```js
CREATE OR REPLACE FUNCTION fn_mask_patient_notes(patient_notes STRING)
RETURNS STRING
RETURN
CASE
  WHEN is_member('admins') THEN patient_notes
  ELSE ai_mask(patient_notes, array('person', 'email', 'phone', 'address'))
END;
```

이 기능에서는 먼저 최종 사용자가 데이터를 쿼리하거나 보려면 적절한 액세스 수준에 액세스할 수 있는지 확인한 후, 그렇다면 개인 정보 보호를 더 강화하기 위해 ai_mask로 임상 노트의 개인, 이메일, 전화번호 또는 주소와 같은 항목을 마스킹하는 PHI 보호의 추가 계층을 추가합니다.

다음으로 뷰(View)를 만들고 UDF를 호출하여 마스킹 로직을 적용할 것입니다:

<div class="content-ad"></div>

```js
CREATE OR REPLACE VIEW vw_secure_patient_data AS
SELECT
   admission_id
   ,fn_mask_patient_notes(patient_notes) AS patient_notes
FROM patient_data;
```

이제 뷰를 실행하여 테스트해 봅시다. 사용자가 'admin' 그룹에 속해 있다면 모든 정보를 볼 수 있습니다. 'analysts' 그룹에 속해 있는 경우 마스킹된 데이터를 볼 수 있고, 그렇지 않으면 '액세스 거부' 메시지를 받게 됩니다.

```js
select * from vw_secure_patient_data
```

![image](/assets/img/2024-07-01-EmpoweringDataAnalystsLeveragingai_maskwithUnityCataloginDatabricksSQLforEnhancedDataGovernance_2.png)


<div class="content-ad"></div>

이제 ai_mask() 함수를 MASK 함수와 함께 사용하여 데이터셋에서 더 많은 열을 마스킹해 봅시다. 이 시나리오에서는 ai_mask() 함수를 사용하여 patient_notes 열을 마스킹하고, MASK를 사용하여 patient_first_name 및 contact_number 열을 마스킹할 것입니다:

## 단계 1: 마스킹을 위한 UDF 작성:

```js
CREATE OR REPLACE FUNCTION fn_mask_patient_data(
   patient_notes STRING,
   patient_first_name STRING,
   contact_number STRING
)
RETURNS STRUCT<
   patient_notes STRING,
   patient_first_name STRING,
   contact_number STRING
>
RETURN
 CASE
   WHEN is_member('admins') THEN STRUCT(patient_notes, patient_first_name, contact_number)
   ELSE STRUCT(
       ai_mask(patient_notes, array('person', 'email', 'phone', 'address')),
       MASK(patient_first_name, '*', '*', '*', '*'),
       MASK(contact_number, '*', '*', '*', '*')
   )
 END;
```

이 UDF는 현재 사용자가 'admins' 그룹의 구성원인지 확인합니다. 그렇다면 patient_notes, patient_first_name 및 contact_number의 비마스킹된 값을 반환합니다. 그렇지 않으면 patient_notes에 ai_mask 함수가, patient_first_name 및 contact_number에는 MASK 함수가 적용됩니다.

<div class="content-ad"></div>

## 단계 2: 행 수준 및 열 수준 보안이 있는 뷰 생성

```js
CREATE OR REPLACE VIEW vw_secure_patient_data AS
SELECT
admission_id,   
masked_data.patient_notes AS patient_notes,
   masked_data.patient_first_name AS first_name,
   masked_data.contact_number AS contact_number
FROM patient_data,
LATERAL (
   SELECT mask_patient_data(patient_notes, patient_first_name, contact_number) AS masked_data
) masked;
```

이 함수에서 발생하는 단계를 자세히 살펴봅시다:

- UDF 생성: mask_patient_data 함수는 현재 사용자가 'admins' 그룹의 구성원인지 확인하기 위해 is_member 함수를 사용합니다.
- 사용자가 관리자인 경우, 사용자는 공개된 patient_notes, patient_first_name 및 contact_number을 볼 수 있습니다.
- 사용자가 관리자가 아닌 경우, ai_mask() 함수가 'person', 'email', 'phone' 및 'address'와 같은 엔티티를 마스킹하는 레이블이 지정된 patient_notes에 적용됩니다. MASK 함수가 patient_first_name 및 contact_number 열에 적용됩니다.

<div class="content-ad"></div>

뷰 생성: 보안_patient_data 뷰는 mask_patient_data UDF를 patient_notes, patient_first_name 및 contact_number 열에 적용합니다.

## 단계 3 — 마스킹된 콘텐츠에서 테이블 및 열 태깅 추가하기

마지막으로, 우리가 생성 중인 정보를 활용하여 Unity Catalog에서 테이블 및 열 수준에서 자산에 적절하게 태그를 지정해야 합니다. ALTER TABLE `tbl` ALTER COLUMN `col` SET TAGS 명령을 사용하여 PII로 데이터를 태깅할 수 있습니다:

```js
DECLARE OR REPLACE VARIABLE set_tags STRING;

-- 열에 PII가 있는지 동적 변수로 확인
SET VARIABLE set_tags = (SELECT CASE WHEN SUM( CASE WHEN patient_notes ILIKE('%[MASKED]%') THEN 1 ELSE 0 END) > 0 
            THEN "ALTER TABLE vw_secure_patient_data ALTER COLUMN patient_notes SET TAGS ('PII' = 'yes')"
            ELSE "ALTER TABLE vw_secure_patient_data ALTER COLUMN patient_notes SET TAGS ('PII' = 'no')"
            END AS SetPIITAg
      FROM vw_secure_patient_data);

EXECUTE IMMEDIATE set_tags;
```

<div class="content-ad"></div>

이는 데이터를 숨기는 데 그치지 않고 환경 전체에서 테이블, 스키마 및 열을 자동으로 태깅하여 PII에 대한 액세스를 인식하고 안전하게 관리하는 견고한 프레임워크를 제공합니다.

# 결론

마지막으로, Databricks의 ai_mask 함수는 데이터 지배 및 보안에 중점을 둔 데이터 분석가들을 위한 혁신적인 기능입니다. 데이터 지배 워크플로에 ai_mask를 통합함으로써, 분석가들은 조직의 데이터 처리 관행이 개인 정보 보호 규정을 준수할 뿐만 아니라 무단 액세스에 대한 안전성도 확보됨을 보장할 수 있습니다. 데이터가 기관에게 귀중한 자산으로 유지되는 가운데, ai_mask와 같은 도구는 이 자산을 보호하는 데 중요한 역할을 할 것이며, 분석가들이 개인 정보 보호와 보안을 희생하지 않고 데이터 가치를 끌어내는 데 집중할 수 있게 해줄 것입니다.