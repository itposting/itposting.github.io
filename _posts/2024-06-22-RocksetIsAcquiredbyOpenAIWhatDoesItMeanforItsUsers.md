---
title: "Rockset이 OpenAI에 인수되다 사용자들에게 어떤 의미가 있을까"
description: ""
coverImage: "/assets/img/2024-06-22-RocksetIsAcquiredbyOpenAIWhatDoesItMeanforItsUsers_0.png"
date: 2024-06-22 17:03
ogImage: 
  url: /assets/img/2024-06-22-RocksetIsAcquiredbyOpenAIWhatDoesItMeanforItsUsers_0.png
tag: Tech
originalTitle: "Rockset Is Acquired by OpenAI. What Does It Mean for Its Users?"
link: "https://medium.com/@starrocks/rockset-is-acquired-by-openai-what-does-it-mean-for-its-users-3fa9561979d2"
---


2024년 6월 21일, OpenAI가 데이터 색인 및 쿼리 기능으로 유명한 실시간 분석 데이터베이스인 Rockset을 인수했다고 발표했습니다. 이 인수는 Rockset 사용자들에게 중요한 변화를 알립니다. 사용자들은 이 플랫폼을 이탈해야 하는 제한된 시간을 가지고 있으며 다음 단계에 대해 궁금해하고 있습니다. 본 문서는 Rockset 사용자들이 이 전환을 안내하며, OpenAI가 왜 이러한 결정을 내렸는지, 즉각적으로 필요한 조치는 무엇인지, 그리고 Rockset 사용자들과 실시간 분석 요구 사항을 위한 이상적인 대안으로 어떤 솔루션이 적합한지에 대해 통찰을 제공할 것입니다.

# OpenAI가 Rockset을 인수한 이유는 무엇인가요?

OpenAI는 Rockset의 기술을 통합하여 제품 전반에 걸쳐 검색 인프라를 강화하려고 합니다. 이는 인공지능 업계에서 실시간 데이터 액세스와 처리의 중요성을 명확하게 보여 주는 지표입니다. 게다가 Rockset 인수를 통해 OpenAI는 실시간 분석 전문가 팀을 흡수하여 OpenAI의 능력을 계속 강화할 것입니다.

# Rockset 사용자가 해야 할 첫 번째 일

<div class="content-ad"></div>

Rockset 사용자 분들에게 시한부가 닥쳐오고 있습니다. Rockset의 자세한 FAQ에 따르면, 계약 없는 월간 요금제 사용자들은 2024년 9월 30일까지 오프보딩을 진행해야합니다. 계약된 고객들은 Rockset 계정 팀과 협력하여 적절한 오프보딩 계획을 개발할 수 있지만, 모든 고객들은 빠르게 Rockset 대체안을 찾아야 합니다. 인수가 계획된 상황에서, 이제는 Rockset 사용자들이 다음 단계를 취해야 할 때입니다.

![이미지](/assets/img/2024-06-22-RocksetIsAcquiredbyOpenAIWhatDoesItMeanforItsUsers_0.png)

Rockset 사용자들은 다음 단계를 시작해야 합니다:

- 현재 사용량과 요구 사항을 평가하십시오: 솔루션을 평가하기 전에 무엇을 찾고 있는지 알아두는 것이 좋습니다. 이는 많은 시간을 절약할 수 있습니다.
- 비슷하거나 더 나은 기능을 제공하는 대체 플랫폼 목록 작성 시작: 기존에 Rockset을 어떻게 사용했느냐에 따라 비즈니스의 요구 사항이 단순할 수도 복잡할 수도 있습니다. 각 플랫폼은 장단점이 있습니다. 비즈니스에 중요한 성능과 능력을 제공할 수 없는 솔루션을 평가하는데 소중한 시간을 낭비하지 않도록 어떤 플랫폼이 무엇을 할 수 있어야 하는지 알아두는 것이 중요합니다.
- 작업 중단 없이 마이그레이션 과정을 계획하기 시작: 오픈 소스든 상용 솔루션이든, 솔루션과 함께 제공되는 지원이나 커뮤니티를 평가하는 것이 중요합니다. 성공적인 POC를 진행할 수 있는 옆에서 지원해줄 파트너를 찾거나 24시간 내내 문제 해결을 도와줄 활성 Slack 커뮤니티를 찾는 것은 마이그레이션이 원활히 진행되도록 하는 데 도움이 될 수 있습니다.

<div class="content-ad"></div>

# Rockset 사용자를 위한 대안

Rockset 사용자가 다음 단계를 계획할 때, 각 합당한 대안을 탐색하는 것이 중요합니다. 사용 사례와 성능 요구에 따라, 다양한 플랫폼이 원하는 능력을 제공할 수 있습니다. 고려할만한 몇 가지 옵션은 다음과 같습니다:

# 오픈 소스 실시간 분석 SQL 워크로드를 위한:

- Apache Druid: Druid는 대규모 데이터에서 실시간 및 일괄 처리 쿼리를 하위 초 단위로 제공하는 고성능 실시간 분석 데이터베이스입니다.
- ClickHouse: ClickHouse는 고속 오픈 소스 열 지향 데이터베이스 관리 시스템으로, SQL 쿼리를 사용하여 실시간으로 분석 데이터 보고서를 생성할 수 있습니다.
- StarRocks: 확장 가능한 JOIN 쿼리를 실행하고 정규화 파이프라인 없이 실시간 분석을 제공하기에 적합합니다. StarRocks는 기본적으로 실시간 데이터 업서트를 지원하며, 열 지향 저장소에서 직접 가변 데이터로 두 번째 수준의 데이터 신선도를 제공할 수 있습니다.

<div class="content-ad"></div>

# 프로프리업 관리형 솔루션을 통한 실시간 분석 SQL 워크로드:

- Imply: 엔터프라이즈 지원을 통한 클라우드 상의 관리형 Apache Druid.
- CelerData: StarRocks 프로젝트의 주도 및 유지보수를 지원하는 클라우드 관리형 StarRocks.

# 오픈 소스 벡터 검색(VectorDB)을 위한:

- Weaviate: Weaviate는 객체 및 벡터를 저장하는 오픈 소스 벡터 데이터베이스로, 클라우드 네이티브 데이터베이스의 내결함성 및 확장성과 함께 벡터 검색을 구조화된 필터링과 결합할 수 있습니다.
- Milvus: 차세대 AI 애플리케이션을 위한 클라우드 네이티브 벡터 데이터베이스 및 스토리지
- Qdrant: 다음 세대 AI를 위한 고성능 대규모 벡터 데이터베이스.

<div class="content-ad"></div>

# 관리되는 벡터 검색 (VectorDB):

- SingleStore: SQL 능력 이외에도 SingleStore는 관리되는 벡터 검색 기능을 제공하여 양종의 워크로드에 대한 포괄적인 솔루션을 제공합니다.
- Zilliz: Milvus 뒤의 회사인 Zilliz는 Milvus의 혜택을 추가 지원 및 유지 보수로 제공하는 관리되는 벡터 검색 서비스를 제공합니다.
- Pinecone: 배포 및 벡터 검색 애플리케이션의 스케일링을 간소화하고 높은 가용성과 성능을 보장하는 완전히 관리되는 벡터 검색 플랫폼입니다.

전환을 해야 하는 시긴데요. 중요한 인프라가 그대로 유지되고 작동되도록 해야 합니다. 이 플랫폼마다 고유한 장점이 있으며, 당신의 특정 요구 사항을 기반으로 평가하여 성공적인 마이그레이션이 이루어질 것입니다.

# 왜 StarRocks가 Rockset 이주민들에게 가장 좋은 다음 단계인가요?

<div class="content-ad"></div>

많은 Rockset 사용자들이 실시간 분석 요구를 위해 채택했습니다. 따라서 특히 현재 실시간 분야에서 한 명의 선도 업체 중 하나를 언급하는 것이 중요합니다: StarRocks. 실시간 분석을 위한 강력하고 효율적인 대안을 찾는 Rockset 사용자들에게 StarRocks는 매력적인 선택지를 제시합니다. 이유는 다음과 같습니다:

- 확장 가능한 JOIN 쿼리: StarRocks를 사용하면 확장 가능한 JOIN 쿼리를 실행할 수 있으며 데노멀라이제이션 파이프라인이 필요없이 실시간 분석을 제공하여 데이터 처리를 간소화하고 성능을 향상시킵니다.
- 실시간 데이터 업서트: Rockset에서 StarRocks로 전환할 때 데이터 신선도를 유지할 수 있습니다.
- 우수한 성능: 컬럼형 스토리지, 벡터화 및 SIMD를 활용하여 StarRocks는 Rockset보다 우수한 성능을 달성하며 저장 공간의 일부만 사용하여 비용 효율적인 솔루션이 됩니다.
- 오픈 소스 커뮤니티: Apache 라이선스를 받은 리눅스 재단 프로젝트인 StarRocks는 거대하고 성장 중인 글로벌 커뮤니티가 언제든지 도와줄 준비가 되어 있습니다.

# 다음 단계

OpenAI에 의한 Rockset 인수는 사용자들에게 도전과 기회를 제시합니다. 전환은 어렵게 느껴질 수 있지만, 우수한 성능과 확장 가능성을 제공하는 플랫폼으로 업그레이드할 기회이기도 합니다. StarRocks의 실시간 분석 성능에 대해 더 알아보고 이주하는 동안 지원을 받으려면 Slack 커뮤니티에 가입하세요.

<div class="content-ad"></div>

마지막 순간까지 기다리지 말고 오늘 Rockset에서의 원활한 이전을 보장하려면 이전 계획을 시작하세요.