---
title: "사용 기반 API 요금 청구 및 미터링을 위한 실시간 분석 솔루션"
description: ""
coverImage: "/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_0.png"
date: 2024-05-27 12:58
ogImage:
  url: /assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_0.png
tag: Tech
originalTitle: "Real-Time Analytics Solution for Usage-Based API Billing and Metering"
link: "https://medium.com/towards-data-science/real-time-analytics-solution-for-usage-based-api-billing-and-metering-f9e7a350f707"
---


![Real-Time Analytics Solution](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_0.png)

Disclaimer: The author of this article is a Developer Advocate at Redpanda, which is a critical component of the solution discussed. The author also brings prior expertise in API Management and Apache Pinot to the table. Hence, the proposed solution is a combination of these technologies aimed at solving a prevalent problem.

An API business refers to a company that packages its services or functionalities as a set of API (Application Programming Interface) products. These APIs can be sold to new and existing customers, who can then integrate these functionalities into their own applications. The company can generate revenue by charging these customers based on their usage of the APIs.

A company operating an API business needs a data infrastructure component to track API call volume and bill consumers accordingly.


<div class="content-ad"></div>

이 게시물에서는 Apache APISIX, Redpanda 및 Apache Pinot를 사용하여 실시간 API 사용 추적 솔루션을 구축하기 위한 참조 아키텍처를 제시합니다. 이 게시물은 "어떻게"보다는 "왜"에 중점을 두었습니다. 이를 솔루션 설계 연습으로 간주하고 심층 튜토리얼이 아니라는 것을 고려해 주세요. 저는 솔루션 패턴을 청사진으로 추출하여 향후 프로젝트에서 재사용할 수 있도록 돕고자 합니다.

다른 말 없이 시작해 봅시다.

# APIs 및 API 관리

API 및 API 관리 개념에 대해 처음이라면, 먼저 간단히 소개해 드리겠습니다.

<div class="content-ad"></div>

디지털 비즈니스에서 API는 비즈니스 작업에 프로그래밍 방식으로 액세스할 수 있도록 해줘서 인간을 제외할 수 있어요. 이러한 비즈니스 작업에는 주문 생성, 자금 이체, CRM에서 고객 주소 업데이트 등이 포함될 수 있어요.

비즈니스에서 전형적인 API 환경에는 세 가지 당사자가 관련돼요:

- 백엔드 시스템 — 비즈니스 작업을 실행하는 시스템이에요.
- 소비자 — 비즈니스 작업을 사용하려는 1차 및 3차 애플리케이션이에요.
- API 프록시 — 프록시로서 작용하며 중간자 역할을 하는 요소에요.

![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_1.png)

<div class="content-ad"></div>

API의 역할은 내부 비즈니스 시스템을 소비자로부터 분리하여, 소비자가 백엔드 시스템의 복잡성을 처리할 필요 없이 이를 제공하는 것입니다. 이러한 방식으로, API는 추상화 계층 역할을 합니다. API는 HTTP를 포함한 다양한 통신 프로토콜을 통해 작동하며, RESTful 및 GraphQL API 스타일을 볼 수 있습니다.

운영 중에는 조직이 API 수명주기의 다양한 단계를 관리하기 위해 전체 수명주기 API 관리 플랫폼을 사용합니다. API 프록시 디자인, 배포, 런타임 정책 참여 및 모니터링과 같은 API 수명주기의 각 단계에 대한 전용 구성 요소를 번들로 제공하는 API 관리 플랫폼이 있습니다. 이 문서의 문맥에서 Apache APISIX를 사용할 것이며, 이는 Apache 라이선스 하에 배포되는 오픈 소스 API 관리 플랫폼입니다.

그렇다고 해서 여기서 구축하는 솔루션이 APISIX와 무조건적으로 결합된 것은 아닙니다. 시장에서 구할 수 있는 대부분의 전체 수명주기 API 관리 제품과 통합할 수 있습니다. 단, 적합한 통합 인터페이스를 제공해야 합니다.

![Real-Time Analytics Solution for Usage-Based API Billing and Metering](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_2.png)

번역 시 일부 용어는 컨텍스트에 맞게 번역되었습니다.

<div class="content-ad"></div>

# API를 활용하여 수익을 창출하는 방법

이제, API를 활용하여 수익을 창출하는 방법에 대해 살펴봅시다. 즉, 사용량에 따라 소비자에게 요금을 부과하는 수익 모델을 찾아보는 것입니다.

더 나은 설명을 위해 현실적인 예시를 들어보겠습니다.

부동산 감정 회사를 고려해보세요. 이 회사는 주택 구매자와 판매자에게 즉각적인 부동산 평가를 제공합니다. 이 평가는 우편번호, 부동산 유형, 지역과 같은 간단한 요소를 기반으로 합니다. 현재, 이 회사는 웹 기반 사용자 인터페이스만 제공하고 있습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_3.png)

비지니스 운영을 확장하고 더 많은 고객을 유치하며 새로운 시장 세그먼트에 진입하기 위해 이 회사는 API 비지니스로 진출하기로 결정했습니다. 이 말은 평가 엔진을 API 제품 세트로 패키징하여 새로운 및 기존 소비자에게 판매하고 그들의 API 호출 사용량에 따라 청구할 것을 의미합니다.

이를 위해 먼저 평가 엔진을 분리하고 API 관리 플랫폼 뒤에 배치하여 달성합니다. 이를 통해 소비자들이 일련의 API를 통해 기능에 액세스할 수 있게 됩니다.

![image](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_4.png)


<div class="content-ad"></div>

평가 API는 부동산 회사, 은행, 보험사, 정부 등 다양한 분야의 잠재 고객들을 유치할 것입니다:

- 부동산 회사 — 주택 구매자를 위한 정확한 평가값 제공.
- 은행 — 모기지 승인 전 주택 평가.
- 보험 제공업자 — 주택 및 내용 보험에 대한 더 정확한 견적 제공.
- 정부 — 부동산 세금 쉽게 계산.

## API 수익화 모델

이 회사는 어떻게 수익을 창출할까요? 평가 API를 API 제품 세트로 포장하여 구독 계층과 함께 판매하세요!

<div class="content-ad"></div>

가입 등급은 소비자가 매달 고정된 API 호출 횟수를 사용할 수 있는 할당량입니다. 그 할당량을 초과하면 사용자는 제한을 받거나 초과 사용량에 대해 요금을 지불해야 합니다.

예를 들어, 가치평가 API는 다음과 같이 세 가지 가입 등급으로 제공될 수 있습니다.

- 브론즈: 매달 10,000건의 요청
- 골드: 매달 100,000건의 요청
- 플래티넘: 매달 무제한의 요청

![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_5.png)

<div class="content-ad"></div>

고객은 예상 사용량에 따라 다양한 티어 중에서 선택하여 API에 가입할 수 있습니다. 한 달의 끝에 회사는 실제 사용량을 기반으로 고객에게 청구할 것입니다.

우리의 목표는 각 고객의 API 사용량을 효율적이고 신뢰할 수 있는 방법으로 측정하는 것입니다.

# 솔루션 계획

이제 우리가 해결하려는 문제를 이해했으니, 구현에 들어가기 전에 몇 가지 설계 결정사항을 설명해 드리겠습니다.

<div class="content-ad"></div>

## KPI 지표

첫 번째 단계는 솔루션으로부터 기대하는 KPI 또는 지표를 식별하는 것입니다. 특히 다음 다섯 가지에 관심이 있습니다.

- API 사용량 — 시간당 소비자 당 API 호출 횟수
- API 지연 — 느린, 느린 API를 식별하기 위한 종단 간 지연 시간
- 고유 사용자 — API 당 고유 호출 수는?
- 지리적 사용량 분포 — 주로 API 사용자가 어디에서 왔는가?
- 오류 수 — 호출 오류가 많으면 백엔드에 문제가 있다는 것을 의미합니다.

이상적으로 이런 것들이 모두 이렇게 시각화된 대시보드에서 보고 싶습니다.

<div class="content-ad"></div>

아래는 마크다운 형식으로 표시 변환한 코드입니다.


![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_6.png)

## 이해 관계자

두 번째 디자인 결정은 솔루션 이해 관계자 - 이러한 지표를 전달해야 하는 대상. 주로 세 가지 당사자가 있습니다.

고객 및 협력사 - 소비자는 실시간 대시 보드에서 할당량 사용량과 청구 추정을 확인하는 것을 좋아합니다.


<div class="content-ad"></div>

API 운영 팀 - 이 팀은 API 관리 인프라를 관리합니다. API의 건강 정보에 특히 관심이 있으며, 지연시간, 처리량, 오류 등을 주로 다룹니다.

API 제품 팀 - 이 팀은 API 제품을 소유하고 있습니다. 그들은 소비자의 인구 통계, API 중에서 더 인기 있는 것이 무엇인지 등을 확인하기 위해 즉시 실험을 실행하고 싶어 합니다.

![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_7.png)

## 일괄 처리 또는 실시간 처리?

<div class="content-ad"></div>

최종 디자인 결정으로, 실시간 및 일괄 메트릭 사이에 80:20의 분할을 설정하겠습니다.

데이터는 시간이 경과함에 따라 가치를 잃습니다. 데이터를 빨리 처리할수록 적절한 조치를 취할 수 있습니다. 그래서 우리는 API 트래픽 및 헬스 메트릭을 실시간으로 처리하겠습니다.

소비자 API 키가 유출된 상황을 생각해보세요. 악의적인 API 클라이언트가 훔친 키나 인증 토큰을 사용하여 소비자를 대신해 API를 호출할 수 있습니다. 시스템은 이 API 키에서의 급격한 트래픽 증가를 감지하여 비정상으로 식별하고 키를 차단하면서 소비자에게 경보를 보낼 수 있습니다. 경보를 받은 소비자는 즉시 API 키를 재발급하여 비용을 최소화할 수 있습니다.

그러나 모든 사용 사례가 실시간 처리를 필요로 하는 것은 아닙니다. 어떤 사용 사례는 자연스럽게 일괄 처리에 적합합니다.

<div class="content-ad"></div>

- 고객을 위한 월별 사용량에 기반한 청구 보고서.
- 업무팀을 위한 주간 API 건강 보고서.
- 제품팀을 위한 매일 API 트래픽 보고서.

# 구현

지금은 이 기사의 중간 지점에 도달했으며 지금까지의 토론을 바탕으로 다음 솔루션 아키텍처를 제시합니다.

![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_8.png)

<div class="content-ad"></div>

다이어그램이 복잡하고 많은 알 수없는 기술이 있어서 알겠습니다. 그래서, 세 개의 레이어로 나누어서 각각에 대해 자세히 설명하겠습니다.

## 데이터 수집

이전에 언급했듯이, API 관리 시스템은 디자인 및 런타임 측면에서 트래픽 모양 만들기, 인증 및 구독 관리와 같은 API 라이프사이클 관리 작업을 수행하는 여러 이동 부품을 가지고 있습니다. 이에 대한 추가 측면도 있습니다.

![image](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_9.png)

<div class="content-ad"></div>

그러나, 우리가 가장 관심 있는 구성 요소는 API 게이트웨이입니다. 이 곳은 모든 API 트래픽이 백엔드로 흐르는 곳입니다.

우리의 첫 번째 작업은 API 게이트웨이에서 접촉점을 확인하는 것입니다. 이를 통해 왕복하는 API 요청과 응답을 수집할 수 있습니다. 그런 다음 이 정보를 실시간으로 분석용 데이터 저장소로 이동시키는 데이터 파이프라인을 구축할 것입니다. 이를 통해 향후 질의를 용이하게 할 것입니다.

그러나, 이 쓰기 경로를 구현할 때 직접 데이터를 기본 데이터 저장소에 쓰는 것은 여러 문제점을 야기할 수 있습니다.

<div class="content-ad"></div>

APIM 시스템과 분석 인프라 사이의 강한 결합 - 나중에 새 APIM 공급업체로 전환할 때 분석 인프라의 상당 부분을 다시 작성해야 할 수도 있습니다.

동기 쓰기 - 운영 중에 두 시스템 모두 사용 가능해야 하므로 분석 시스템을 유지보수 목적으로 중지하기 어려울 수 있습니다.

확장 가능한 데이터 수집 - API 게이트웨이의 돌발적인 트래픽 급증으로 인해 분석 시스템이 과부하되어 두 시스템 모두 협조하여 확장해야 할 수 있습니다.

이로 인해 APIM과 분석 인프라를 분리하는 방법을 모색할 필요가 있습니다. Apache Kafka와 같은 스트리밍 데이터 플랫폼은 API 게이트웨이에서 높은 처리량 데이터 스트림을 낮은 지연 시간으로 수신할 수 있으므로 여기에 적합할 것입니다.

<div class="content-ad"></div>

해당 솔루션에서는 성능과 간편함 측면에서 Kafka보다 우월한 Redpanda, Kafka API 호환 스트리밍 데이터 플랫폼을 사용할 것입니다. 하지만 만약 Kafka만 사용하길 원한다면 괜찮습니다. 해당 솔루션은 두 기술에 모두 매끄럽게 작동합니다.

Redpanda를 중심으로 한 데이터 파이프라인은 다음과 같이 구성됩니다:

![Redpanda Data Pipeline](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_11.png)

Redpanda의 추가로 두 시스템이 분리되었고 쓰기 경로가 비동기로 동작합니다. 이는 분석 시스템이 유지 보수를 위해 오프라인 상태로 들어갈 수 있고, 중단된 지점부터 다시 재개할 수 있도록 합니다. 게다가 Redpanda는 갑작스러운 트래픽 급증을 흡수하여 분석 시스템이 과부하를 받거나 API 게이트웨이에 맞춰 스케일링할 필요가 없도록 해줍니다.

<div class="content-ad"></div>

이제 APISIX와 Redpanda 사이의 연결을 어떻게 만들어야 할지 궁금할 것입니다. 다행히도, APISIX는 Kafka를 위한 내장 데이터 싱크를 제공합니다. 게이트웨이로 API 요청이 발생하고 응답이 반환될 때, 이 싱크는 실시간으로 Kafka 토픽에 레코드를 발행합니다. 우리는 Redpanda와 함께 이 싱크를 사용할 수 있습니다. 왜냐하면 Redpanda가 Kafka API와 호환되기 때문입니다.

![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_12.png)

APISIX는 개별 API 호출을 JSON 이벤트로 형식화하고 지연 시간, HTTP 상태 및 타임스탬프와 같은 중요한 메트릭을 포함시킵니다. 이러한 정보들은 분석 데이터 저장소에서 관련 있는 차원으로 매핑될 것입니다.

![이미지](/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_13.png)

<div class="content-ad"></div>

API 관리 플랫폼에 Kafka 싱크가 없는 경우 어떻게 할까요? 그럼 대안으로 API 게이트웨이의 HTTP 액세스 로그를 Kafka로 스트림 처리할 수도 있습니다. 이를 위해 Filebeat나 유사한 도구를 사용할 수 있습니다.

## 분석 데이터베이스

이제 Redpanda에 API 호출 이벤트가 랜딩되고 있으니, 다음 단계는 적합한 분석 데이터베이스 기술을 식별하는 것입니다.

OLTP 데이터베이스, 키-값 저장소 또는 데이터 웨어하우스가 될 수 있을까요? 다음 기대 기준에 따라 각각을 평가해 봅시다.

<div class="content-ad"></div>

- 스트리밍 데이터 수집 - 실시간 데이터 원본인 Kafka에서 가져와야 합니다. 여기서는 배치 데이터 로딩이 없어야 합니다. 스트리밍 수집은 더 높은 데이터 신선도를 보장합니다.
- 낮은 지연 쿼리 - 쿼리 지연 시간은 하위 초 범위 내여야 하며 사용자를 위한 분석 대시보드를 만족시켜야 합니다.
- 높은 쿼리 처리량 - 사용자를 대상으로 하는 분석 대시보드에서 동시에 발생하는 쿼리를 처리할 수 있어야 하며 지연 시간을 훼손하지 않아야 합니다.

위의 모든 조건을 충족하는 분석 데이터베이스로 Apache Pinot을 선택했습니다.

Apache Pinot은 실시간 분산 OLAP 데이터베이스로, 스트리밍 데이터에서 OLAP 워크로드를 처리하도록 설계되어 극히 낮은 지연 시간과 높은 동시성을 제공합니다. Pinot은 Kafka와 원활하게 통합되어 Kafka 주제에서 데이터가 생성될 때마다 실시간 수집을 허용합니다. 수집된 데이터는 색인이 작성되고 열 형식으로 저장되어 효율적인 쿼리 실행을 가능케 합니다.

아키텍처에서 Pinot을 사용하면 엔드 투 엔드 데이터 파이프라인은 다음과 같이 보입니다. Pinot은 Redpanda와 API 호환성으로 원활하게 통합됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_14.png" />

파이프라인에 스트림 프로세서가 필요한가요? 정말 필요한지는 사용 사례에 따라 다릅니다.

스트림 프로세서 대신 Redpanda의 Wasm 기반 인브로커 데이터 변환을 사용하여 API 이벤트 페이로드에서 민감한 필드를 제거할 수 있습니다. 그러나 아파치 Flink와 같은 상태 보유형 스트림 프로세서는 다음과 같을 때 파이프라인에 더 많은 가치를 더할 수 있습니다:

- 실시간 결합 및 보강이 필요할 때 — 핀오토로 전달할 추가 차원이 필요하며, 이는 여러 스트림을 결합하여 파생할 수 있습니다. 예: IP 지오코딩.
- 알림 — 사용량의 이상 현상을 기반으로 알림을 트리거하고 하류 이벤트 주도형 워크플로를 실행합니다.

<div class="content-ad"></div>

## Serving layer

우리의 분석 데이터 파이프라인이 이제 완성되었습니다. 모든 파이프라인 구성 요소는 데이터 인프라 구조층에 있습니다. 필요하다면 Pinot 쿼리 콘솔에 액호크 SQL 쿼리를 실행하여 메트릭을 생성할 수 있습니다.

그러나 솔루션의 모든 이해 관계자/사용자가 그렇게 하길 원하는 것은 아닙니다. 우리는 각 사용자 그룹에게 메트릭을 직관적이고 편안하게 찾을 수 있는 방식으로 제시해야 합니다. 이것이 우리가 분석의 마지막 단계인 서빙 레이어를 구현하는 곳입니다.

<img src="/assets/img/2024-05-27-Real-TimeAnalyticsSolutionforUsage-BasedAPIBillingandMetering_15.png" />

<div class="content-ad"></div>

우리의 우선순위는 소비자들입니다. 그들은 사용량과 청구 예상을 시각화하는 실시간 대시보드가 필요합니다. 이를 위해 Streamlit과 같은 프레임워크를 활용하여 Python 기반 데이터 어플리케이션을 개발할 수 있습니다. Pinot Python 드라이버 pinotdb를 사용하면 애플리케이션과 Pinot 쿼리 환경을 연결할 수 있습니다.

BI 및 즉석 탐색이 필요한 사용자 그룹, 특히 API 제품 소유자는 Tableau와 Apache Superset과 같은 선호하는 BI 도구를 연동할 수 있는 Pinot의 ODBC 인터페이스를 사용할 수 있습니다.

일괄 작업을 위해 Pinot는 Presto나 Trino와 같은 쿼리 연합 엔진에 Pinot 커넥터를 통해 연동할 수 있습니다.

# 요약

<div class="content-ad"></div>

다음은 파이프라인 구현 단계 순서를 나열하여 글을 마무리해 봅시다.

1. Redpanda 클러스터를 프로비저닝하고 토픽을 생성하고 ACL을 설정합니다.
2. APISIX에서 Kafka 싱크를 구성합니다.
3. Pinot 스키마와 테이블을 생성합니다.
4. 필요에 따라 데이터를 가공합니다.
5. 대시보드를 생성하거나 연결합니다.

이 솔루션은 비즈니스 자체에서 호스팅하고 관리하는 자체 호스팅 배포 모델을 전제로 합니다. 그러나 동일한 설계 원칙이 이 도구들의 호스팅 버전을 선택해도 적용될 수 있다는 점을 알아두는 것이 중요합니다. 아키텍처의 각 구성 요소는 호스팅 서비스로 대체될 수 있으며, 이를 통해 다양한 배포 전략에 대응할 수 있는 유연한 해결책이 될 수 있습니다.

이전에 언급했듯이, 이 글은 "어떻게"보다는 "왜"에 대해 주로 다루고 있습니다. 목표는 정확한 실행 방법보다는 근본적인 해결책 패턴을 이해하는 것입니다. 이 글을 다음 실시간 분석 프로젝트의 청사진으로 삼아 보세요. 필요에 따라 다른 기술을 통합하여 조정할 수 있습니다.
