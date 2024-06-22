---
title: "OpenAI의 Rockset 인수, AI 기업들에게 어떤 의미가 있을까"
description: ""
coverImage: "/assets/img/2024-06-22-WhatDoesOpenAIsAcquisitionofRocksetMeanforAICompanies_0.png"
date: 2024-06-22 20:21
ogImage: 
  url: /assets/img/2024-06-22-WhatDoesOpenAIsAcquisitionofRocksetMeanforAICompanies_0.png
tag: Tech
originalTitle: "What Does OpenAI’s Acquisition of Rockset Mean for AI Companies?"
link: "https://medium.com/madhukarkumar/what-does-openais-acquisition-of-rockset-mean-for-ai-companies-196211b25468"
---


![image source](/assets/img/2024-06-22-WhatDoesOpenAIsAcquisitionofRocksetMeanforAICompanies_0.png)

2020년 3월, 세상이 문을 닫고 빛나는 디바이스 화면을 바라보며 모여있을 때, 궁금한 작은 기술 기업이 나타났습니다. 그 이름은 Clubhouse였습니다. 가상의 방에서 모여 실시간으로 스피커를 듣고 세션이 끝나면 콘텐츠가 디지털 공간으로 사라지는 라이브 오디오 플랫폼을 상상해보세요. 이는 그 전에 있었던 덜 알려진 혁신적인 기술인 라디오와 놀랍게도 매우 유사하죠!

단 몇 달 만에 Clubhouse는 매주 약 1000만 명의 활발한 사용자를 자랑하는 누구나가 놀고 싶어하는 새로운 장난감이 되었습니다.

그런 다음 1년 뒤, 방송 후 사라진 콘텐츠와 비슷하게, Clubhouse 자체가 사라져 버렸습니다. 사람들의 지나치게 과부하된 영구적이고 항상 소멸성 있는 관심에서 영원히 사라지다니요.

이것은 우리가 이런 영화를 본 것이 처음은 아니었습니다.

<div class="content-ad"></div>

“에버노트”의 경우, 여러 년 전에도 비슷한 일화가 벌어졌는데, 현재도 지속되고 있거나 당시 제 개인적인 즐겨찾기 서비스인 "델.이슈스(del.icio.us)"와 함께했습니다. 이 창의적으로 제작된 도구와 더불어 창의적인 도메인 URL(https://del.icio.us)을 가진 이 서비스는 2000년대 초기 인터넷 애호가들 사이에서 특별한 자리를 차지했었죠. 저도 포함하여 말이죠.

그렇다면, 이 회사들과 한때 소중했던 반짝거리는 테크 제품들은 어떤 일로 사라졌을까요? 왜 그렇게 높은 인기를 얻은 뒤 사라져 버렸을까요?

저는 이를 회사들의 '마이크로소프트화'라 칭합니다.

본질적으로, 이들은 진정한 제품이 아니었고, 제품으로 위장한 기능들이었습니다. 이 기능들이 독립적으로 존재하려 하자, 산업의 지배군인 거대한 거인 기업들이 들이닥치며 이들 기능들을 이미 방대한 청중들과 더욱 방대한 유통 채널을 보유하고 있는 자신들의 거대한 생태계로 흡수했습니다. Pinterest는 델.이슈스의 본질을 흡수했고, 트위터와 디스코드는 음성 전용 채널을 추가했으며, 구글, 마이크로소프트, 애플은 모두 자사의 에코 시스템에서 노트 테이킹에 대한 고유한 방법을 가지고 있습니다.

그렇다면, 지금 이야기를 꺼내는 이유는 무엇일까요?

그 이유는, 최근 OpenAI가 비교적 잘 알려지지 않은 "록셋(Rockset)"을 인수한다고 발표했기 때문입니다.

저에게 이것은 두 가지를 외치는 것 같아요:
- AI는 이제 제품이 아니라 기능이 되었다는 점입니다.
- 이에 상응하여 벡터 전용 데이터베이스도 제품이 아니라 기능입니다.

<div class="content-ad"></div>

함께 이를 풀어보면 좋겠어요.

하지만, 특히 현재 Rockset을 사용하는 기업에게 이것이 무엇을 의미하는지 알아보기 전에 이것에 대해 생각해봅시다: Pinecone, Milvus, Weaviate와 같은 벡터 전용 데이터베이스가 최근에 핫한 트렌드였죠 (Pinecone이 1억 달러를 모금했을 때 7억 5천만 달러로 평가되었던 걸 아시나요?)

그렇다면, 왜 OpenAI가 Rockset을 인수하기로 선택했는데, 이 트렌디한 벡터 전용 빛나는 옵션 중 하나를 선택하지 않았을까요?

이 질문에 대한 답변을 하기 전에, 데이터베이스 관점에서 Rockset이 정확히 무엇이며 어떤 점에서 알려져 있는지 살펴봐야 합니다.

옛날로 돌아가서 한 번 생각해봅시다. 몇 년 전에 Google이 LevelDB라는 키-값 인메모리 저장 라이브러리를 출시했습니다. 실시간 분석을 수행하려면 훌륭했지만, 기계의 메모리보다 데이터셋이 더 클 경우 성능이 저하되는 문제가 발생했습니다.

<div class="content-ad"></div>

이 라이브러리와 함께 작업하던 일부 페이스북 엔지니어들이 이를 기반으로 내장형 데이터베이스를 개발하고 오픈 소스로 공개했고 RocksDB라고 이름 붙였습니다. 이 오픈 소스 DB는 이제 메모리에 추가로 플래시 기반 스토리지에서 매우 빠른 인메모리 처리를 실행할 수 있는 기능이 추가되었습니다.

몇 년 뒤에 같은 일부 페이스북 엔지니어들이 RocksDB를 기반으로 한 데이터베이스 회사를 시작했고 그 회사의 이름은 바로 Rockset입니다.

Rockset은 LevelDB와 RocksDB를 보다 나은 커넥터와 실시간 분석 지원으로 진화시켰으며 인메모리부터 로컬 디스크, 객체 스토리지까지 세 가지 스토리지 계층을 추가했습니다. 놀랍게도, 이 세 가지 스토리지 아키텍처는 SingleStore와 동일합니다.

전체적으로 말씀드리면, 저는 SingleStore에서 일하고 있는데, 이 블로그는 SingleStore가 무엇을 하는지에 관한 것은 아닙니다. 하지만 제안으로는 꼭 자세한 설명서를 확인해 보세요.

<div class="content-ad"></div>

하지만 Rockset와 SingleStore 사이의 유사성은 여기서 끝나는데, Rockset은 반구조화된 데이터(기본 데이터 유형은 문서(Document)입니다)에서 작동하며 실시간 분석을 수행합니다. 다시 말해, JSON 문서를 가져와서 테이블로 평탄화한 뒤 데이터에 대해 SQL 쿼리, 특히 분석 기반 쿼리를 실행할 수 있습니다. 그에 비해 SingleStore는 RDF(그래프)를 제외한 모든 데이터 유형을 지원하며 수조 행의 데이터에 대해 서브초 시간 지연 내에 지원하는데, 그렇게 깊이 들어가지는 않겠습니다.

그래서 OpenAI가 Rockset을 인수한 이유는 무엇일까요.

그것은 바로 구조화된 및 반구조화된 데이터 때문이죠. OpenAI는 AI 기업인만큼 벡터 전용 데이터베이스가 아닌 Rockset을 인수한 이유입니다.

두 단어 — 구조화된 및 반구조화된 데이터입니다.

<div class="content-ad"></div>

알겠어요, 좀 더 말수는 많지만, 요점은 이해했죠.

작년 OpenAI가 Assistants라는 기능(우리는 모두 Agents라 부릅니다!)을 출시했을 때, 이를 위한 'Retrieval tool'이라는 기능이 추가되었습니다. 이에 대해 깊게 다뤄본 내용은 여기에 있어요. 궁금하시다면 더 자세히 읽어보세요.

![이미지](/assets/img/2024-06-22-WhatDoesOpenAIsAcquisitionofRocksetMeanforAICompanies_1.png)

'Retrieval tool'은 노코드 및 API 버전으로 사용할 수 있었고, 사용자들이 문서를 업로드하여 ChatGPT의 문맥으로 사용할 수 있었습니다. 즉, 이는 벡터 검색 또는 의미론적 특징을 사용하여 보이지 않게 'Retrieval Augmented Generation (RAG)'을 수행했던 것이죠! 이제 제가 이 제품 대 기능에 관한 얘기를 하고 있다는 맥락을 이해하시겠죠.

<div class="content-ad"></div>

몇 주 전에 오픈AI가 새로운 기능 몇 가지를 추가했어요 — ChatGPT를 통해 Google 시트를 읽고 데이터 분석 및 차트 작성을 위한 네이티브 테이블을 생성할 수 있는 기능입니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*LuTKTHUEixnuGyclfYrkvA.gif)

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*EcgEBtqEFLEt2eYgA80eBg.gif)

그럼, 모든 이것에서 빠진 것은 무엇인가요?

<div class="content-ad"></div>

**실시간 분석**.

그리고, 우리가 다 아는 대로, 실시간 분석은 일반적으로 PDF 문서가 아니라 구조화된 및 반구조화된 데이터로 수행됩니다.

내 예상은 OpenAI가 이제 검색 도구를 보다 구조화된 데이터 소스 — MySQL, SingleStore (MySQL 와이어 프로토콜 호환), Postgres, Kafka 및 기타와 연결할 수 있는 기능으로 확장할 것이라고 합니다. 이는 사용자들이 이제 OpenAI 생태계로 구조화 및 반구조화된 데이터를 모두 가져올 수 있음을 의미합니다.

그런데, 제품 대 기능에 대한 모든 이야기는 무엇일까요?

<div class="content-ad"></div>

세 가지 중요한 사항이 있습니다:

- AI는 LLM으로 구동되는 기능입니다.
- 벡터는 기능 중 하나입니다. (Rockset 및 다른 모든 데이터베이스가 벡터를 이미 기능으로 사용하고 있습니다).
- 데이터가 진짜 제품입니다.

아마도 최초의 LLM을 개발한 회사는 이제 LLM뿐만 아니라 데이터를 진정한 차별화 요소로 만들고 있습니다.

Rockset 고객이시라면 안타깝지만 쿼리 언어가 SQL이므로 앱 코드 전체를 다시 작성해야 하는 것만큼 나쁘지 않은 전망이라고 생각합니다.

<div class="content-ad"></div>

데이터 자체에 대해서는 제어권을 즉시 가져가는 것을 고려해보세요 (안타깝게도 Rockset의 스냅샷 및 복원 프로세스는 아직 프라이빗 미리보기 중 🫣). 저는 당신을 위해 단계별 안내서를 제공할 수도 있지만, 그것들이 제가 사랑하고 일하는 제품을 향하여 편향될 것입니다.

그러나, AI 차별화된 기업으로 자신을 생각한다면, 특히 AI 기능을 위해 여러분의 데이터를 실시간으로 정리하는 것에 대해 깊이 고민해보시기를 권해드립니다.

✌️