---
title: "RAG 자동화를 위한 건축 설계도 Vertex AI 검색을 활용한 고급 문서이해"
description: ""
coverImage: "/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_0.png"
date: 2024-05-27 15:10
ogImage:
  url: /assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_0.png
tag: Tech
originalTitle: "Architectural Blueprints for RAG Automation: Advanced Document Understanding using Vertex AI Search"
link: "https://medium.com/google-cloud/architectural-blueprints-for-rag-automation-advanced-document-understanding-using-vertex-ai-search-537ee9376847"
---

<img src="/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_0.png" />

안녕하세요!

생성적 AI는 개발자와 기업에 수많은 기회를 제공하여 비즈니스 프로세스를 혁신하고 고객 경험을 변화시키며 새로운 수익 방식을 발견하게 도와줍니다. 그러나 이 잠재력을 완전히 실현하려면, 건축가와 IT 리더들은 AI 모델, 응용 프로그램 및 에이전트를 신속하게 실험하고 반복할 수 있는 동시에 비용 관리, 거버넌스 및 확장성을 고려해야 하는 복잡한 환경을 탐험해야 합니다.

최근 개최된 Next’24 구글 클라우드 이벤트에서 저희는 강력한 Vertex AI Search 및 Conversation 제품과 다양한 고급 개발자 도구를 통합한 혁명적인 솔루션인 Vertex AI Agent Builder를 공개했습니다. 이 포괄적인 제공은 개발자들이 복잡한 작업과 문의를 원활하게 처리할 수 있는 정교한 AI 기반 에이전트를 만들고 배포할 수 있게 도와주어 다양한 영역에서 혁신과 효율성을 촉진합니다.

# Vertex AI Search 이해하기

<div class="content-ad"></div>

Vertex AI Search은 구글 클라우드 내에서 제공되는 포괄적인 플랫폼으로, 조직이 직원 및 고객을 위한 맞춤형 검색 솔루션을 만들 수 있도록 설계되었습니다. 이 플랫폼은 웹사이트, 구조화된 데이터(예: BigQuery 테이블, JSON 라인) 및 비정형 데이터(예: PDF, HTML, 텍스트)를 포함한 다양한 데이터 원본에 대해 구글 검색과 유사한 경험을 제공합니다.

이전 블로그 포스트에서는 Vertex AI Search를 사용하여 공개적으로 색인된 웹페이지에서 대상 웹페이지를 수집하는 방법에 대해 논의했습니다. 이 방법은 이러한 웹페이지의 사전 구글 색인을 활용합니다. 우리는 PDF 문서를 채굴하기 위한 지식 발견 파이프라인을 구축하는 데 이 방법을 사용했습니다.

우리 이전 포스트의 연장선으로 이 기사를 고려해 주세요. 여기서는 추출된 PDF 문서를 처리하는 방법에 대해 다룹니다. 이러한 문서는 이미 준비되어 있을 수 있어 바로 사용할 수 있습니다. 또는 당신의 기업에게 기밀인 소유 문서일 수도 있습니다. 여기서는 이러한 문서의 데이터를 수용하고 처리하며, 복잡한 쿼리에 응답할 수 있는 시스템을 구축하는 방법을 탐색할 것입니다. 예를 들어 사실 정보를 검색하거나 분기 보고서의 재무 표에서 숫자를 인출하는 것과 같은 복잡한 쿼리에 대답할 수 있는 시스템을 구축합니다.

주로, Vertex AI Search는 GCP의 완전 관리형 플랫폼으로, 구글 검색 품질 기능을 기업 데이터에 통합하여 두 가지 주요 이점을 제공합니다:

<div class="content-ad"></div>

- 향상된 검색 경험: 기존의 키워드 기반 검색을 모던한 대화형 경험으로 변환시켜 주는 기능입니다. 구글의 혁신적인 생성 검색과 비슷한 방식으로 작동합니다. 이 기능은 내부 및 고객 상대 애플리케이션의 효율성을 크게 향상시킵니다.
- 강화된 생성 AI 애플리케이션: 생성 AI 애플리케이션 내 답변 생성을 지원합니다. 기업 데이터를 기반으로 하는 생성 AI는 Vertex AI 검색을 통해 실제 비즈니스 사용 사례에 중요한 정확성, 신뢰성 및 적합성을 보장합니다. 이는 검색 기능의 통합을 간편하게 하는 준비된 RAG 시스템 역할을 하며, 검색 기능을 획기적으로 향상해 줍니다.

맞춤형 RAG 파이프라인 구축은 복잡할 수 있습니다. Vertex AI 검색은 준비된 솔루션을 제공하여 이 프로세스를 간단하게 만들어 줍니다. 데이터 추출 및 변환, 정보 검색 및 요약까지 검색 및 발견 프로세스의 모든 측면을 간소화하여 클릭 몇 번으로 줄여 줍니다. 결과적으로, 일반 검색 엔진으로 Vertex AI 검색을 사용하여 강력한 RAG 애플리케이션을 신속하게 개발할 수 있습니다.

준비된 솔루션은 상당한 편의성을 제공하지만, Vertex AI 검색은 개발자에게 자세한 제어도 허용합니다. 플랫폼의 유연성을 활용하여 RAG 파이프라인 각 단계를 사용자의 필요에 맞게 맞춤화할 수 있습니다. 이 하이브리드 접근 방식을 통해 사전 구축된 구성 요소와 맞춤형 기능을 이상적으로 조화시킬 수 있어, 응용 프로그램이 특정 사용 사례와 완벽하게 일치하도록 보장할 수 있습니다.

Vertex AI 검색은 다양한 API 세트를 통해 이를 실현합니다. 이러한 API를 통해 Vertex AI 검색의 RAG 시스템의 기본 구성 요소를 노출시켜 개발자가 맞춤형 사용 사례에 대응하거나 자세한 제어를 필요로 하는 고객을 지원할 수 있습니다. 이는 Document AI Layout Parser API, Ranking API, Grounded Generation API, Check Grounding API 등을 포함합니다.

<div class="content-ad"></div>

시작해 봅시다! 먼저 데이터셋을 이해하는 데 집중할 차례입니다. 이는 저희 RAG 파이프라인의 기반이 되는 것이죠. 그런 다음에는 이 데이터를 Vertex AI Search에 효과적으로 수집하여 신속하게 검색할 수 있도록 구성하는 방법을 배우게 될 거에요. Vertex AI Search 내에서 색인 전략에 중점을 두어야 하는데, 이는 인공지능이 필요할 때 가장 관련성 높은 정보에 접근할 수 있도록 하는 데 중요합니다. 우리는 색인된 문서를 쿼리하는 기술에 대해 자세히 살펴보고, 다양한 파이프라인 접근 방식을 실험할 겁니다. 마지막으로 결과물을 수집하고, 검색 정확도 및 생성된 답변의 품질을 평가하는 방법을 배우게 될 거에요. 이 여정을 통해 여러분은 RAG와 Vertex AI Search의 힘을 활용하여 더 스마트하고 정보에 기반한 AI 파이프라인을 구축하는 데 필요한 지식을 습득하게 될 거에요.

# 데이터셋

저희 실험에 사용할 데이터셋은 Alphabet, Amazon, Microsoft 세 기술 기업의 분기 보고서로 구성되어 있어요. 2021년 1분기부터 2023년 4분기까지의 기간 동안, 3년 동안의 36개 문서(각 기업당 12개)로 이루어진 데이터셋이에요.

실험을 용이하게 하기 위해, 이 문서들에서 100개의 질문-답변 쌍을 유도했어요. 각 쌍은 한 문서에 직접 연결되어 있어, 단일 통로 질문-답변 시나리오를 구축합니다. 세심하게 만들어진 질문과 답변은 테이블과 복잡한 단락에서 정보를 추출하는 데 초점을 맞추었으며, RAG 시스템에 상당한 도전을 제공합니다. 이 100개의 질문-답변 쌍은 저희가 다룰 다양한 RAG 파이프라인 설계의 성능을 평가하기 위한 참 값 역할을 합니다. PDF 금융 분기 보고서 데이터셋은 여기에서 찾을 수 있으며, 질문-답변 쌍 데이터셋은 ground_truth.csv라는 CSV 파일에 있습니다. 이 파일에는 다음 메타 정보가 포함되어 있습니다 - i)매핑 문서, ii) 기업 이름, iii) 시기. 이 메타 정보는 CSV 파일의 document 열 하나에 포함되어 있습니다.

<div class="content-ad"></div>

Alphabet의 2020년 1분기 보고서에서 주로 영업 소득과 마진에 관련된 재무 결과를 요약한 샘플 테이블이 아래에 표시됩니다.

![테이블](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_1.png)

우리의 실제 CSV에서의 샘플 질문과 위 테이블을 통해 파생된 예상 답변이 있습니다.

```js
Google의 2021년 3월 말 영업 소득은 얼마이며 (십억으로), 이전 연도 동기 대비 어떻게 비교되었습니까?
```

<div class="content-ad"></div>

```js
Google의 영업 이익은 2021년 제1사분기에 164.37억 달러였습니다. 이는 2020년 제1사분기의 79.77억 달러에서 증가한 금액입니다.
```

위 답변을 작성하기 위해서는 먼저 쿼리에서 구체적인 세부 정보를 추론하여 올바른 문서를 검색해야 합니다. 이에는 올바른 페이지로 이동하고 적절한 테이블을 참조하며 열 정보를 구문 분석하는 것이 포함됩니다. 그런 다음 필드를 열 제목에 매핑하고 올바른 정보를 찾습니다. 마지막으로 이러한 수집된 정보를 일관된 답변으로 통합합니다.

참고: 미국의 Microsoft는 전통적인 달력 년도와 일치하지 않는 재무 연도를 따릅니다. 예를 들어, 그들의 재정 첫 분기는 7월부터 9월까지의 기간을 다룹니다. 따라서 그들의 제1사분기 실적 보고서는 실제 달력에서 이전 분기의 성과를 반영합니다. 질문과 문서명에 이미 이 사항이 고려되어 있습니다.

# 문서 수용 및 색인화



<div class="content-ad"></div>

파이낸셜 문서를 이해하고 질문에 답하는 데 효과적으로 Vertex AI Search를 활용하려면 먼저 데이터를 준비하고 가져와야 합니다. 이를 위해 Vertex AI Search에서 전용 데이터 저장소를 생성하고 Google Cloud Storage (GCS)에서 파이낸셜 문서를 이 저장소로 가져와야 합니다. 다행히도, Vertex AI Search는 정보의 구문 분석, 조각화 및 색인 작업을 자동으로 처리해줍니다.

다음으로, 데이터를 활용하여 견고한 검색 및 검색 기능을 제공하는 문서 검색 응용 프로그램을 구성할 것입니다. 이러한 단계를 따라가면 파이낸셜 문서의 효과적인 색인 및 탐색을 위한 견고한 기초를 확립할 수 있습니다. 이를 통해 실험 및 문서 질문 응답용 견고한 파이프라인을 개발하는 데 필요한 정보에 빠르게 액세스할 수 있습니다. 각 단계를 자세히 살펴보겠습니다.

I. 데이터 저장소 생성:

Vertex AI Search의 데이터 저장소는 처리된 문서가 저장되는 컨테이너입니다. 처리된 조각을 포함하도록 데이터 저장소를 생성하려면 Vertex AI Search 프로젝트 내에서 쉽게 인식할 수 있도록 데이터 저장소에 고유한 식별자와 표시 이름을 할당해야 합니다. 현재 데이터 저장소에는 아무 문서도 포함되어 있지 않습니다. 다음 단계로 문서를 이 데이터 저장소에 푸시(입력)할 것입니다. 여기서 강조할 사항은 원본 PDF 문서가 실제로 GCS에 저장된다는 것입니다.

<div class="content-ad"></div>

아래 코드 스니펫은 REST API를 사용하여 Vertex AI Search를 구현하는 방법을 간단히 보여줍니다. 또한 Vertex AI Python SDK를 사용할 수도 있습니다. 여기서 Discovery Engine Vertex AI에 대한 문서를 참조하실 수 있습니다. 데이터 저장소를 생성하는 전체 코드는 여기에서 확인하실 수 있습니다.

```js
url = f"https://discoveryengine.googleapis.com/v1alpha/projects/{config.PROJECT_ID}/locations/global/collections/default_collection/dataStores?dataStoreId={data_store_id}"

headers = {
    'Authorization': f'Bearer {config.ACCESS_TOKEN}',
    'Content-Type': 'application/json',
    'X-Goog-User-Project': config.PROJECT_ID
}
data = {
    'displayName': data_store_display_name,
    'industryVertical': IndustryVertical.GENERIC,
    'solutionTypes': SolutionType.SOLUTION_TYPE_SEARCH,
    'contentConfig': DataStore.ContentConfig.CONTENT_REQUIRED,
    'documentProcessingConfig': {
        'defaultParsingConfig': {
            'layoutParsingConfig': {}
        }
    }
}

response = requests.post(url, headers=headers, json=data)
```

II. GCS에서 문서 입력:

데이터 저장소가 생성되면 지정된 GCS 버킷에서 귀사의 금융 문서를 입력하기 시작합니다. 이 프로세스에는 데이터 집합의 원본 PDF 문서가 저장된 GCS 버킷의 URI를 지정해야 합니다. 이전에는 manifest 파일을 생성해야 합니다. 이것은 Vertex AI 검색에 입력할 문서들의 모든 메타데이터를 포착하는 JSON 파일입니다. 이 파일의 샘플 행인 metadata.json은 아래에서 표시됩니다.

<div class="content-ad"></div>

```json
{
  "id": "1",
  "jsonData": "{\"company\": \"alphabet\", \"time_period\": \"Q1 2021\"}",
  "content": {
    "mimeType": "application/pdf",
    "uri": "gs://vais-rag-patterns/raw_docs/alphabet-q1-2021.pdf"
  }
}
```

아래는 삽입을 초기화하기 위한 코드의 예시 미리보기입니다. 이 코드는 REST API를 활용하며, 전체 코드는 여기 링크된 Git 저장소에서 찾을 수 있습니다.

```js
url = f"https://discoveryengine.googleapis.com/v1/projects/{project_id}/locations/global/collections/default_collection/dataStores/{data_store_id}/branches/0/documents:import"

headers = {
    "Authorization": f"Bearer {config.ACCESS_TOKEN}",
    "Content-Type": "application/json"
}

data = {
    "gcsSource": {
        "inputUris": [gcs_input_uri]
    }
}

response = requests.post(url, headers=headers, json=data)
```

III. 문서 검색 애플리케이션 만들기:

<div class="content-ad"></div>

우리 문서들의 성공적인 소화 후 마지막 단계는 문서 검색 애플리케이션을 생성하는 것입니다. 이 애플리케이션은 색인된 데이터와 상호 작용하여 재무 문서를 검색, 검색하고 분석하는 데 필요한 도구와 기능을 제공할 것입니다.

이 앱을 만들기 위해 필요한 샘플 코드는 아래에 표시되어 있습니다. 회사 티어를 검색하도록 활성화하고 LLM을 사용하여 고급 검색을 활성화해야 합니다. 이는 효과적으로 문서 질의에 답할 수 있습니다. 이 프로세스는 REST API를 사용하지만 Python SDK를 사용하여도 수행할 수 있습니다. 앱 생성을 위한 완전한 코드는 여기에서 찾을 수 있습니다.

```js
url = f"https://discoveryengine.googleapis.com/v1alpha/projects/{config.PROJECT_ID}/locations/global/collections/default_collection/engines?engineId={data_store_id}"

headers = {
    "Authorization": f"Bearer {config.ACCESS_TOKEN}",
    "Content-Type": "application/json",
    "X-Goog-User-Project": config.PROJECT_ID
}

data = {
    "displayName": data_store_display_name,
    "dataStoreIds": [data_store_id],
    "solutionType": SolutionType.SOLUTION_TYPE_SEARCH,
    "searchEngineConfig": {
        "searchTier": SearchTier.SEARCH_TIER_ENTERPRISE,
        "searchAddOns": SearchAddOn.SEARCH_ADD_ON_LLM
    }
}

response = requests.post(url, headers=headers, json=data)
```

위에서 설명한 전체 프로세스를 용이하게 만들기 위해 여기에 제공된 스크립트를 활용할 수 있습니다. 데이터 흡수와 애플리케이션 설정에 관련된 모든 필요한 단계를 처리합니다. 구조화된 방식으로 이 접근 방법을 따르면 Vertex AI Search의 강력함을 활용하여 재무 문서를 가치 있는 지식 베이스로 변환할 수 있습니다.

<div class="content-ad"></div>

# RAG 자동화를 위한 아키텍처 패턴

저희의 원시 PDF 문서가 Vertex AI Search 내에 소화되고 색인화되었으므로, 처리된 문서를 쿼리하고 답변을 생성하는 것이 이제 쉽게 간소화될 수 있습니다. 제공된 Python SDK 샘플 코드는 이전에 구성된 검색 애플리케이션을 통해 데이터베이스를 쿼리하는 방법을 보여줍니다. 참조용 전체 코드는 이곳에서 확인할 수 있습니다.

```js
client_options = (
    ClientOptions(api_endpoint=f"{LOCATION}-discoveryengine.googleapis.com")
    if LOCATION != "global"
    else None
)

client = discoveryengine.SearchServiceClient(client_options=client_options)

serving_config = client.serving_config_path(
    project=config.PROJECT_ID,
    location=LOCATION,
    data_store=data_store_id,
    serving_config="default_config",
)

content_search_spec = discoveryengine.SearchRequest.ContentSearchSpec(
    snippet_spec=discoveryengine.SearchRequest.ContentSearchSpec.SnippetSpec(
    return_snippet=False
    ),
    extractive_content_spec=discoveryengine.SearchRequest.ContentSearchSpec.ExtractiveContentSpec(
        max_extractive_answer_count=3,
        max_extractive_segment_count=3,
    ),
    summary_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec(
        summary_result_count=5,
        include_citations=True,
        ignore_adversarial_query=False,
        ignore_non_summary_seeking_query=False,
    ),
)

request = discoveryengine.SearchRequest(
    serving_config=serving_config,
    query=search_query,
    filter=filter_str,
    page_size=5,
    content_search_spec=content_search_spec,
    query_expansion_spec=discoveryengine.SearchRequest.QueryExpansionSpec(
        condition=discoveryengine.SearchRequest.QueryExpansionSpec.Condition.AUTO,
    ),
    spell_correction_spec=discoveryengine.SearchRequest.SpellCorrectionSpec(
        mode=discoveryengine.SearchRequest.SpellCorrectionSpec.Mode.AUTO
    ),
)

response = client.search(request)
```

이를 기반으로, 우리는 이제 여러 가지 방법으로 Vertex AI Search API를 사용하여 쉽게 RAG 파이프라인을 구축할 수 있습니다. 다음으로, 이를 실행하는 네 가지 일반적인 패턴을 살펴보며, 이러한 파이프라인이 구현될 수 있는 유연성과 쉬움을 보여드릴 것입니다.

<div class="content-ad"></div>

Vertex AI Search에서 검색 요청을 구성할 때 유용한 정보를 추출하기 위한 사양을 설정하는 것이 중요합니다. 스니펫, 세그먼트 및 답변 옵션을 활성화하여 관련 콘텐츠를 포괄적으로 검색할 수 있습니다. 또한 LLM 파워를 활용한 요약 기능을 활성화하면 검색 결과의 간단한 요약(답변)을 생성하여 사용자 경험을 향상시킬 수 있습니다. 결과적으로 생성되는 JSON 응답에는 요약된 답변과 추출된 세그먼트 및 답변이 모두 포함됩니다.

Vertex AI Search는 텍스트 데이터를 세그먼트화하고 추출하는 다음과 같은 세 가지 메소드를 사용합니다:

- 스니펫: 검색 결과 문서에서 간단한 발췌문을 제공하여 콘텐츠 미리보기를 제공하며 종종 히트 하이라이팅을 포함합니다.
- 추출형 답변: 원본 문서에서 직접 추출된 문장을 제공하여 간결하고 맥락에 맞는 답변을 제공합니다.
- 추출형 세그먼트: 보다 상세한 직접 추출된 텍스트 데이터를 제공하여 답변 제시, 후처리 작업 및 대규모 언어 모델의 입력으로 사용할 수 있습니다.

또한 스펠 수정 및 쿼리 확장을 위한 설정을 구성하여 검색 정확도를 높이고 잠재적 결과를 확장할 수도 있습니다. 우리의 사용 사례에서는 스니펫을 무시합니다.

<div class="content-ad"></div>

# 패턴 I: 기본 설정(out-of-the-box, OOB) 답변 생성을 통한 검색

패턴 I는 Vertex AI Agent Builder 콘솔 또는 Discovery Engine API를 통해 구현할 수 있는 간단하고 일반적인 파이프라인입니다. 이 파이프라인은 검색 인덱스에서 관련 정보를 검색하여 가져오는 데 사용됩니다. 이 인덱스는 데이터 저장소(datastore) 및 검색 앱을 통해 이전에 설정한 것이며 원본 원시 PDF가 GCS에 저장된 인덱스에 매핑됩니다. 또한 이 파이프라인은 내부 시스템(Large Language Model, LLM Powered)을 사용하여 검색 결과를 기반으로 간결한 답변을 생성합니다. 이를 통해 외부 LLM에 대한 명시적 호출이 필요 없습니다. 사용자는 단일 API 요청만으로 지원 문서에서의 구체적인 답변과 인용을 함께받을 수 있습니다. 이를 통해 관련 정보를 검색하고 요약하는 프로세스가 간소화됩니다. 이 파이프라인을 보여주는 코드는 [여기](공유된 저장소 링크)에서 찾을 수 있습니다.

![RAG Automation](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_2.png)

위 다이어그램은 Vertex AI Search를 구동하는 간단한 RAG 파이프라인을 보여줍니다. 워크플로는 클라우드 스토리지에 저장된 원시 PDF 문서들의 컬렉션으로 시작합니다. 이러한 문서들은 이미 Vertex AI Search에 의해 흡수되고 처리되어 구조화된 인덱스가 생성되어 효율적인 검색 및 검색이 이루어집니다. 사용자가 쿼리를 제출하면 Vertex AI Search는 이러한 인덱스를 활용하여 가장 관련성 높은 문서를 신속하게 식별합니다. 그런 다음 이 문서들에서 적절한 정보를 추출하고 정보의 출처를 나타내는 인용을 포함하여 사용자에게 답변을 제공합니다.

<div class="content-ad"></div>

Pattern I의 주목할 만한 장점은 그 간결함과 독립성입니다. 외부 LLM 호출이 필요하지 않고 전체 프로세스를 단일 API 요청으로 통합하여 필요를 제거합니다. 그러나 이러한 간소화된 방법은 유연성에 제한을 가져올 수 있습니다. 이는 최종 요약에서 관련성이 적은 문서에서 불필요한 정보를 포함시킬 수도 있습니다. 단일 소스에서 파생된 답변에 중점을 둔 단방향 질문 응답에 초점을 맞추어 검색 결과로부터 답변을 생성하는 것이 중요합니다.

다음 갱신된 파이프라인 반복 (Pattern II)에서는 쿼리 이해 단계에서 메타데이터 통합을 탐색하고, 결과를 개선하기 위해 선택한 LLM으로 Gemini를 활용할 것입니다. 이 방법은 소음을 최소화하고 가장 관련 있는 검색된 정보에 집중하여 요약된 답변을 최적화하는 데 목표를 두고 있습니다.

# Pattern II: OOB 답변 생성과 필터링된 검색

Pattern II는 필터링을 통한 쿼리 이해에 초점을 맞춘 사전 검색 단계를 포함하여 검색을 향상시키는 것입니다. 이는 사용자가 자연어 쿼리를 선호하는 상황을 다루며, 수동 필터링이 필요 없도록 하거나 원하는 필터가 즉시 제공되지 않는 상황을 수용할 수 있습니다.

<div class="content-ad"></div>

파이프라인은 Gemini를 사용하여 사용자의 자연어 쿼리를 처리하여 시작합니다. Gemini는 기업 이름 및 기간과 같은 주요 정보를 추출하기 위해 명명된 엔티티 인식(NER)을 수행합니다. 이 추출된 메타데이터는 JSON 형식으로 출력되며 사용자의 의도와 더 일치하도록 검색 결과를 필터링하는 데 활용됩니다. 이 과정은 노이즈를 줄이는 뿐만 아니라 검색 메트릭을 크게 향상시킵니다.

또한 추출된 기업 이름 및 기간 정보는 수집 단계에서 설정된 형식과 구문에 준수해야 합니다. 이 구현에서 메타데이터 필터링은 Vertex AI Search 내의 문서에 이전에 할당된 기업 이름 및 기간 태그를 활용합니다.

따라서 이 개선은 Pattern I를 기반으로 쿼리 이해 단계를 검색 이전에 도입함으로써 검색 결과의 정확성과 관련성을 극대화합니다.

상단의 아키텍처 다이어그램에 나타난 대로, 워크플로는 사용자가 특정 필터의 제약 없이 정보 요구를 표현하는 자연어를 사용하여 검색을 시작하는 것으로 시작됩니다. 그런 다음 쿼리가 Gemini에 전달되어 명명된 엔티티 인식(NER)을 수행하여 기업 이름 및 기간과 같은 관련 메타데이터를 추출합니다. 이 추출된 메타데이터는 JSON 형식으로 구조화되어 쉽게 필터링되며 이후 Vertex AI Search에서 사용되어 문서 색인을 필터링하여 추출된 기업 및 기간 정보와 일치하는 결과만을 좁혀서 제공합니다. 마지막으로, 필터링된 결과이기 때문에 더 관련성이 높은 문서들이 사용자에게 제공되며 정보의 출처를 나타내는 인용을 포함합니다.

<div class="content-ad"></div>

위에서 설명한 pipeline의 코드 구현은 여기서 참조할 수 있습니다. 이 구현에서의 Entity 인식은 프롬프트를 사용하여 회사 이름 추출에는 zero-shot 방식을 활용하고 시기 추출에는 양성 및 음성 예시를 이용한 few-shot 방식을 사용합니다.

```js
아래 쿼리에서 회사 이름을 추출하십시오.
회사 이름은 `Microsoft`, `Alphabet`, 또는 `Amazon` 중 하나입니다.
회사 이름이 `LinkedIn`이면 `Microsoft`로 번역하십시오.

중요 사항: 추출된 회사 이름은 반드시 줄 바꿈이나 구두점 또는 추가 공백 없이 단일 단어여야합니다.
```

```js
쿼리로부터 특정 시기를 추출하십시오. 유효한 시기는 'Q1 2021' 형식만 가능합니다.

유효하지 않은 형식의 예시:
'Q2 2020 to Q2 2021'
'Q2 2020 - Q2 2021'
'Q2 2020, Q2 2021'

추출된 시기는 단일 분기와 단일 연도만을 나타내야 합니다. 현재와 과거 간의 대조만을 고려해야합니다.

중요 사항: 쿼리가 현재와 과거를 비교할 때 과거 참조를 무시하십시오.

예시
========
'2020년 첫 분기'를 'Q1 2020'으로 변환하세요.
'Q2 2021에서 Q2 2020 대비 증가'를 'Q2 2021'로 번역하세요.
'2022년 12월 31일 종료 12개월'을 'Q4 2022'로 번역하세요.
```

# Pattern III: Extractive Segments 및 Gemini Pro를 활용한 필터링 검색 및 응답 생성

<div class="content-ad"></div>

이전에는 Vertex AI Search에서 관련 콘텍스트를 가져오는 세 가지 다른 정밀도 수준에 대해 학습했습니다: 스니펫, 추출 세그먼트 및 추출된 답변. 이 패턴인 Pattern III에서는 검색 결과에서 추출된 세그먼트를 활용하여 기존 (OOB) 답변 생성 단계 (Pattern I 및 II)를 대체합니다. 생성된 답변에 특정한 스타일, 뉘앙스, 형식, 길이 또는 구조가 필요한 경우 특히 중요합니다. 이러한 시나리오에서 추출된 세그먼트를 외부 LLM인 Gemini와 함께 질의와 함께 명시적으로 전달할 수 있습니다. 우리는 요구 사항에 더 가까운 답변 생성을 위해 다양한 방법으로 프롬프트를 유연하게 설계할 수 있습니다. Pattern III는 이러한 방식을 포괄합니다.

위에 표시된 아키텍처 다이어그램은 Pattern III의 워크플로우를 보여줍니다. 여기서 사용자는 먼저 자연어 질의를 제출하고, 이는 초기에 Gemini에 의해 관련 메타데이터를 추출하도록 처리됩니다. 이 구조화된 메타데이터는 Pattern I와 II와 유사하게 Vertex AI Search가 문서 색인을 효율적으로 검색하고 관련 문서를 식별하는 데 사용됩니다. 이러한 필터링된 문서에서 사용자의 질문에 직접 답변하는 구체적인 세그먼트가 추출됩니다. 최종 단계에서 Gemini는 이러한 추출된 세그먼트를 처리하여 사용자에게 포괄적인 답변을 생성하고 정보의 출처 문서를 나타내는 인용 정보를 통합합니다. 사용자는 정보가 추출된 문서에 대한 참조와 함께 질의에 대한 최종 답변을 받게 됩니다. 이 패턴을 다루는 코드는 여기에서 찾을 수 있습니다.

이 워크플로에 대한 답변 생성에 사용되는 프롬프트는 아래에 표시된 것과 같이 간단할 수도 있고 특정 요구 사항에 기반하여 더 복잡하고 정교할 수도 있습니다.

```js
다음 콘텍스트를 기반으로 아래 질문에 명확하고 간결한 답변을 제공하십시오:

콘텍스트: {콘텍스트}

질문: {질문}
```

<div class="content-ad"></div>

# 패턴 IV: Gemini Pro를 활용한 추출적 답변을 통한 필터링된 검색과 답변 생성

이번에는 이전의 패턴 III 구조를 대부분 유지하면서 주요 수정 사항을 가진 파이프라인 반복입니다. 이전에 문서에서 추출된 세그먼트를 활용하는 대신 추출적 답변을 활용합니다. 이 변경은 이전 프롬프트 구조를 유지한 채 이루어졌습니다. 이 변경의 영향을 설명하기 위해 테스트 세트에서 질문을 살펴보고 세그먼트 대비 답변에서 파생된 생성된 답변을 비교하겠습니다.

아래에는 예상 질문과 그라운드 트루스 파일에서 기대되는 답변이 표시되어 있습니다.

```js
마이크로소프트의 실적 보고서에 따르면 2021년 Q1 LinkedIn의 매출 증가액은 얼마이고,
일정한 화폐단위 조정을 고려했을 때 성장률은 어떻게 되는가?
```

<div class="content-ad"></div>

2021년 제1분기에는 링크드인의 매출이 전년대비 25% 증가했습니다. 환율 변동을 조정한 경우 성장률은 23%였습니다.

우선, Vertex AI 검색에서 샘플 질문에 대한 추출 세그먼트를 살펴봅시다. 아래는 상위 세 개의 세그먼트입니다. 우리의 질문에 대한 답변은 비즈니스 하이라이트 하단에 있는 세그먼트 1과 테이블 콘텐츠 일부인 세그먼트 2에서 유도할 수 있음을 알 수 있습니다. 지미니 포스트-검색을 사용하여 최종 답변을 생성하기 위해 세그먼트를 연결하여 단일 문맥으로 전달하면 됩니다.

## 비즈니스 하이라이트

생산성 및 비즈니스 프로세스의 매출은 $13.6 억으로 증가했으며,
15% 증가했습니다 (환율 변동으로 12% 상승),
다음과 같은 비즈니스 하이라이트가 포함되어 있습니다:

- 오피스 상용 제품 및 클라우드 서비스 매출이 14% 증가했습니다
  (환율 변동으로 10% 증가),
  오피스 365 상용 매출의 22% 증가로 주도되었습니다 (환율 변동으로 19% 상승)
- 오피스 소비자 제품 및 클라우드 서비스 매출이 5% 증가했으며
  (환율 변동으로 2% 증가),
  마이크로소프트 365 소비자 구독자 수는 5020만으로 증가했습니다
- 링크드인 매출이 25% 증가했습니다 (환율 변동으로 23% 상승)
- 다이내믹스 제품 및 클라우드 서비스 매출이 26% 증가했습니다
  (환율 변동으로 22% 상승),
  다이내믹스 365 매출이 45% 증가로 주도되었습니다 (환율 변동으로 40% 증가)

미세한 과정을 통한 재무 성과 일정 화 동일 통화 환산은 다음과 같습니다:

| 세그먼트                    | 2020년 | 2021년 | 증가율 | 동일 통화 여파 |
| --------------------------- | ------ | ------ | ------ | -------------- |
| 생산성 및 비즈니스 프로세스 | $11743 | $13552 | 15%    | 12%            |
| 인텔리전트 클라우드         | $12281 | $15118 | 23%    | 20%            |
| 더 개인화된 컴퓨팅          | $10997 | $13036 | 19%    | 16%            |

마이크로소프트에 대해

마이크로소프트 (나스닥 "MSFT" @microsoft)는 지능형 클라우드와 지능형 엣지 시대에 대한 디지털 전환을 실현합니다. 그 사명은 지구상의 모든 사람과 기관에 더 높은 성공을 이루도록 자율화하는 것입니다.



<div class="content-ad"></div>

Revenue in Intelligent Cloud는 $ 15.1 억으로 23% 증가했습니다 (일정 환율로 20% 상승), 다음 비즈니스 하이라이트가 있습니다:
• 서버 제품 및 클라우드 서비스 수익은 26%(일정 환율에서 23% 증가) 성장했으며, Azure 수익은 50%(일정 환율에서 46% 상승) 증가했습니다.
개인 컴퓨팅에서의 수익은 $ 13.0 억으로 19% 증가했습니다 (일정 환율로 16% 상승), 다음 비즈니스 하이라이트가 있습니다:
• Windows OEM 수익이 10% 증가했습니다.
• Windows 기업 제품 및 클라우드 서비스 수익은 10% 증가했습니다 (일정 환율로 7% 증가).
• Xbox 콘텐츠 및 서비스 수익은 34% (일정 환율로 32% 증가).
• 트래픽 취득 비용을 제외한 검색 광고 수익은 17%(일정 환율로 14%) 증가했습니다.
• Surface 수익이 12%(일정 환율로 7%) 증가했습니다.

Microsoft는 2021 회계 연도 3분기에 주주에게 주식 재매수 및 배당금 100 억 달러를 돌려주었습니다. 이는 2020 회계 연도 3분기에 비해 1% 증가한 금액입니다.

비즈니스 전망
Microsoft는 분기별 이익 발표에 관련하여 전방향 가이드를 제공할 것이며 이어서 이익 회의 전화와 웹캐스트에서 설명할 것입니다.

분기별 하이라이트, 제품 출시 및 개선 사항
매 분기마다 Microsoft는 수백 개의 제품을 새로 출시하거나 현재 제품 및 서비스를 개선하는 서비스로 제공합니다. 이러한 출시는 고객이 보다 생산적이고 안전하며 클라우드 및 엣지에서 차별화된 가치를 전달하기 위해 설계된 중요한 연구 및 개발 투자의 결과입니다. 우리가 어떻게 사업에서 혁신을 가속하고 시장 기회를 확대하고 있는지 보여주기 위해 제품 범주별로 분류된 이 분기의 주요 제품 출시 및 다른 하이라이트를 소개합니다.

코로나19 대응
Microsoft는 직원의 안전을 보장하고 영역 사회의 건강과 안녕을 보호하며 원격 근무 상태에서 최상의 업무를 수행할 수 있도록 고객 및 협력사에 기술과 자원을 제공하는 데 초점을 맞추고 있습니다. Microsoft의 COVID-19 대응에 대한 자세한 정보는 여기에서 확인할 수 있습니다.

환경, 사회 및 지배 (ESG)
Microsoft의 미션을 더욱 잘 실현하기 위해 우리는 양질의 영향을 미칠 수 있는 곳에만 환경, 사회 및 지배 (ESG) 노력에 중점을 둡니다. 최신 노력과 우선 사항에 대해 자세히 알아보려면 투자자 관계 ESG 웹사이트를 방문하십시오.

<div class="content-ad"></div>

흥미롭게도, 우리가 궁금한 질문에 대한 답을 얻기 위해 필요한 정보는 마지막(세 번째) 추출한 답변에만 포함되어 있는 것을 알 수 있습니다. 최종 답변을 생성하기 위해 세 개의 추출한 답변을 모두 한 문맥으로 연결하여 Gemini에게 제공하고, 원래의 질문과 함께 제출하여 답변을 생성합니다.

```js
Revenue in Intelligent Cloud은 $15.1 억으로 23% 증가했으며 (환율 상수로는 20% 증가), 다음과 같은 비즈니스 현황을 보여줍니다:
• 서버 제품 및 클라우드 서비스 수익이 26% 증가했으며 (환율 상수로는 23% 증가), Azure 수익이 50% 증가(환율 상수로는 46% 증가) • More Personal Computing의 수익은 $13.0 억으로 19% 증가했으며 (환율 상수로는 16% 증가), 다음과 같은 비즈니스 현황을 보여줍니다: • Windows OEM 수익이 10% 증가함 • Windows 상용 제품 및 클라우드 서비스 수익이 10% 증가함 (환율 상수로는 7% 증가)
• Xbox 콘텐츠 및 서비스 수익이 34% 증가함 (환율 상수로는 32% 증가)
• 트래픽 채광 비용 제외 검색 광고 수익이 17% 증가함 (환율 상수로는 14% 증가)
• Surface 수익이 12% 증가함 (환율 상수로는 7% 증가)
Microsoft은 2021 회계 연도 3분기에 $10.0 억을 주주에게 주식 매수와 배당금 형태로 반환했으며, 이는 2020 회계 연도 3분기 대비 1% 증가했습니다.
비즈니스 전망 Microsoft는 이 분기 실적 발표와 관련하여 이익 회의 전화와 웹캐스트에서 전반적인 안내를 제공할 것입니다.
```

```js
재무 성과
통화 변동 조정 2021년 3월 31일 3개월 종료 (백만 달러, 주당 금액 제외)
수익 운영 이익 순이익 희석주당순이익
2020년 표시 요건 (GAAP) $35021 $12975 $10752 $1.40
2021년 표시 (GAAP) $41706 $17048 $15457 $2.03
2021년 조정 (non-GAAP) $41706 $17048 $14837 $1.95
Y/Y 변경율 (GAAP) 19% 31% 44% 45%
Y/Y 변경율 (non-GAAP) 19% 31% 38% 39%
통화 변동 영향 $972 $634 $615 $0.08
Y/Y 변경율 (non-GAAP) 통화 변동 16% 27% 32% 34%
세그먼트 수익 통화 변동 조정 2021년 3월 31일 3개월 종료 (백만 달러)
Productivity and Business Processes Intelligent Cloud More Personal Computing
2020년 표시 $11743 $12281 $10997
2021년 표시 $13552 $15118 $13036
Y/Y 변경율 15% 23% 19%
통화 변동 영향 $366 $367 $239
Y/Y 통화 변동율 12% 20% 16%
선택된 제품 및 서비스 수익 통화 변동 조정 2021년 3월 31일
Y/Y 변경율 (GAAP) 통화 변동 영향 Y/Y 통화 변동율
Office 상업용 제품 및 클라우드 서비스 14% (4)% 10%
Office 365 상업용 22% (3)% 19%
Office 소비자 제품 및 클라우드 서비스 5% (3)% 2%
LinkedIn 25% (2)% 23%
Dynamics 제품 및 클라우드 서비스 26% (4)% 22%
Dynamics 365 45% (5)% 40%
서버 제품 및 클라우드 서비스 26% (3)% 23%
Azure 50% (4)% 46%
Windows OEM 10% 0% 10%
Windows 상업용 제품 및 클라우드 서비스 10% (3)% 7%
Xbox 콘텐츠 및 서비스 34% (2)% 32%
Surface 12% (5)% 7%
검색 광고 트래픽 채광 비용 제외 17% (3)% 14%
Microsoft에 대해 Microsoft(Nasdaq "MSFT" @microsoft)는 지능적인 클라우드와 지능형 엣지 시대의 디지털 변형을 가능케 합니다.
```

<div class="content-ad"></div>

저희가 확인한 바로는 Gemini가 생성한 최종 응답이 추출 세그먼트를 사용한 이전 응답보다 더 짧고 간결하다는 것을 알 수 있습니다.

```js
제공된 맥락에 따르면, Microsoft의 실적 보고서에 따르면 2021년 1분기 LinkedIn의 매출 증가율은 25%였습니다. 일정 통화를 고려한 경우 성장율은 23%였습니다.
```

해당 패턴을 포함한 소스 코드는 여기에서 찾을 수 있습니다.

# 대안적 패턴

<div class="content-ad"></div>

- 이전에 설명한 표준 워크플로우를 넘어서 PDF 문서로부터 답변 생성을 혁신적으로 개선할 수 있는 여러 고급 기술들이 있습니다. 그 중 하나는 질의 확장인데, 이는 초기 검색 질의를 관련 용어나 동의어로 확장시킵니다. 이 기능은 Vertex AI Search를 사용하여 매개변수를 AUTO로 설정함으로써 쉽게 활성화할 수 있습니다. 또는 DIY 사전 검색 단계를 설계하여 LLM을 사용하여 질의 변형을 생성한 후 Vertex AI Search에 병렬 호출을 할 수도 있습니다. 질의 확장은 질의 응답 시스템에서 정보 검색의 품질을 향상시키는 중요한 기술입니다. 다양한 질의 변형을 생성하여 검색의 관련성을 향상시키는 것뿐만 아니라 정확한 답변을 생성하는 데 필수적인 최상위 검색 문서의 대표성을 확보하는 데 핵심적인 역할을 합니다.
- 문서 내 키워드 부스팅은 관련성을 향상시키는 또 다른 강력한 기술입니다. 이는 Vertex AI Search를 사용하여 즉시 지원됩니다. 특정 용어에 우선 순위를 부여함으로써 검색 결과의 관련성을 향상시킬 수 있습니다.
- 게다가 검색 튜닝을 사용하여 검색 성능을 향상시킬 수도 있습니다. 이 접근 방법은 특정 산업이나 회사에 특화된 쿼리를 일반적인 언어 모델로 충분히 해결할 수 없을 때 특히 유용합니다. 검색 튜닝은 Vertex AI Search를 통해 즉시 지원됩니다.
- PDF 문서의 사전 처리 유형을 선택하여 검색 관련성을 향상시키는 것도 중요합니다. 서로 다른 문서 파서를 사용하여 PDF 문서의 사전 처리 유형을 선택함으로써 검색 관련성을 향상시킬 수 있습니다. Vertex AI Search는 기본적으로 레이아웃 파서, OCR 파서 및 디지털 파서를 지원합니다. 우리의 사용 사례에서는 레이아웃 파서를 사용했습니다. 이는 Vertex AI Search를 위해 RAG용으로 PDF 문서를 사용할 계획이라면 권장됩니다. 또는 Document AI를 사용하여 문서에서 표를 추출하는 등 다른 정교한 방법론을 사용할 수 있습니다. PDF와 추출한 표를 텍스트 형식으로 변환하여 PDF로 처리하지 않고 Vertex AI Search에 삽입할 수 있습니다.
- 마지막으로 사용자 정의 임베딩 기반 정보 검색이 필요한 기업을 위해 Vertex AI는 강력한 벡터 검색 기능을 제공합니다. Vertex AI의 벡터 검색은 수십억 벡터를 수용하고 밀리초 내에 가장 가까운 이웃을 식별할 수 있습니다. 벡터 검색(이전에는 Matching Engine로 알려짐)은 Vertex AI Search와 유사하며 Agent Builder의 일부입니다. Agent Builder는 이 두 검색 옵션의 캡슐화로 생각할 수 있습니다. 뒤에 덧붙이자면, 이 기사에서 extensively 다룬 것은 모두 Vertex AI Search에 관한 것입니다. Vertex AI 벡터 검색은 벡터 저장소로, chunking 전략, 임베딩 모델 선택, 의미 유사성 검색을 위한 점수 매기는 알고리즘 선택 등 모든 것에 대한 전체 사용자 정의를 원할 때 좋은 대체 옵션입니다. Agent Builder는 check grounding, grounded generation 및 ranking API와 같은 독립적인 API도 포함하고 있습니다. 이러한 API를 사용하여 벡터 검색과 함께 커스텀 RAG 파이프라인을 구축할 수 있습니다.

# RAG 파이프라인 평가

![Architecture Blueprint for RAG Automation Advanced Document Understanding using Vertex AI Search](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_3.png)

다음으로, 검색 성능 및 생성된 답변 품질을 평가하는 방법에 대해 알아보겠습니다. 우리는 검색 시스템을 평가하는 데 적합한 다양한 지표를 실험해보고, RAG 파이프라인에서 답변 품질을 평가하는 지표를 살펴볼 것입니다. 이 평가 과정을 통해 RAG 시스템을 개선하고 최적화하며 어떤 접근 방식이 더 효과적인지 이해하는 데 도움이 될 것입니다.

<div class="content-ad"></div>

# I. 정보 검색 평가

## 가) K에서의 정밀도

K에서의 정밀도는 상위 K개의 검색 문서에서 관련 결과의 비율을 측정하는 지표입니다. 이 측정 방법은 초기 결과의 질이 정보의 철저한 검색보다 우선하는 시나리오에서 특히 중요합니다. 이러한 경우의 대표적인 예로 웹 검색 엔진이 있습니다. 여기서 사용자들은 주로 검색 결과의 첫 페이지에 집중합니다.

예를 들어, YouTube에서 "종이 비행기를 만드는 방법"에 대한 상위 5개의 교육 비디오를 요청했다고 가정해보겠습니다. 이 중 5개 중 3개의 비디오가 목적에 맞게 지시를 제공한다면, K=5에서의 정밀도는 5개 중 3개 또는 60%가 됩니다. 이 지표는 초기 검색 결과의 관련성을 측정하는 방법을 제공합니다.

<div class="content-ad"></div>

단일 점프 질문 응답 사용 사례에서는 각 쿼리 당 관련 항목(문서) 하나를 획득하는 것이 목표입니다. 따라서 K = 1일 때의 정밀도(Precision)를 계산하는 것이 논리적입니다. 이 경우 결과는 이진형입니다: Vertex AI Search에 의해 반환된 검색된 항목 중에서 원하는 문서를 가장 위에 위치시키는지 여부입니다.

<img src="/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_4.png" />

## b) K에 대한 재현율(Recall)

정보 검색 분야에서, K에 대한 Recall 메트릭은 검색 결과 중 상위 K 결과 내에서 검색된 모든 관련 문서의 비율을 측정하는 데 사용됩니다. 이는 정밀도와 다르게 Recall은 모든 잠재적으로 관련 있는 문서를 식별하는 시스템의 능력에 중점을 둡니다. 이러한 측정은 법적이나 학술 연구와 같은 분야에서 주요 문서의 누락이 심각한 결과로 이어질 수 있는 경우에 중요합니다.

<div class="content-ad"></div>

예를 들어, 종이 비행기 제작에 관한 10가지 중요한 비디오가 있다는 시나리오를 가정해 보겠습니다. 상위 5개 결과에 관심이 있습니다. 이 중 상위 5개 결과 중에서 10개 비디오 중 4개가 포함되어 있다면, 5개 중 재현율(Recall)은 10개 중 4개로 40%가 됩니다. 이 백분율은 상위 K개 결과 내에서 모든 가능한 관련 결과를 포착하는 검색 시스템의 효과성을 나타냅니다.

우리의 사용 사례의 고유한 맥락을 고려할 때, 관련 문서가 하나뿐인 경우 관련 문서 한 개에 대한 재현율을 계산하는 것이 논리적입니다. 정밀도와 유사하게, 이는 특정 항목이 검색되었는지 여부를 나타내는 이진 결과를 얻을 것입니다.

<img src="/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_5.png" />

참고: 우리의 사용 사례에서는 단일-홉 질문 응답이고, 답변이 항상 하나의 문서에 매핑된다는 것을 의미합니다. 여러 문서에서 유도된 답변인 다중-홉의 경우, 검색 @ k와 정밀도 @ k가 모두 1로 설정됩니다. 다중-홉 시나리오인 경우, k @ 3 및 k @ 5와 같은 더 높은 값이 더 유용하고 이로운 결과를 얻을 수 있습니다.

<div class="content-ad"></div>

저희 사용 사례에서는 필터를 적용하지 않은 표준 검색에서 k=1에서 정밀도와 리콜이 각각 51% (패턴 I)입니다. 그러나 명명된 엔티티 인식(Named Entity Recognition, NER)을 사용하고 필터를 적용하면 이러한 지표가 90%까지 증가합니다 (패턴 II).

## c) MRR (평균 역순 순위)

평균 역순 순위(Mean Reciprocal Rank, MRR)는 응답 목록에서 처음으로 올바른 답변의 역순 평균 순위를 측정하는 통계 지표입니다. MRR은 첫 번째 관련 문서의 위치가 추가 관련 문서의 존재보다 더 중요한 상황에서 특히 유용합니다. 이 지표는 질문 응답 시스템 및 사용자가 만족스러운 답변을 처음 만나는 것이 중요한 검색 환경 등에서 일반적으로 사용됩니다.

마카다미아 쿠키에 대한 완벽한 레시피를 찾기 위해 검색 엔진을 사용한다고 상상해보세요. 만일 맨 처음 클릭한 레시피가 바로 필요한 것이라면, 그 검색 엔진은 완벽한 평균 역순 순위(MRR) 1점을 획득합니다. 즉, 바로 최적의 결과를 제공했다는 것을 의미합니다. 그러나 이상적인 레시피가 처음 확인한 것이 아니라 세 번째로 발견하는 것이 매력적이라면, 해당 검색에 대한 MRR은 1/3으로 낮아집니다.

<div class="content-ad"></div>

MRR(Mean Reciprocal Rank)의 공식은 다음과 같습니다:

![image](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_6.png)

여기서 𝑄은 총 쿼리 수를 나타내며, rᵢ는 i 번째 쿼리에 대한 첫 번째 관련 답변의 순위 위치를 의미합니다.

우리의 사용 사례에서는 Pattern I(필터없는 문서 검색)에서 MRR이 64%입니다. 그러나 Pattern II에서 필터를 적용하면 이 숫자가 91%로 증가합니다.

<div class="content-ad"></div>

## d) DCG (Discounted Cumulative Gain)

DCG는 결과 목록에서의 위치를 기반으로 문서의 유용성 또는 "이득"을 측정합니다. 여기서의 가정은 검색 결과에서 먼저 나타나는 문서가 나중에 나타나는 것보다 사용자에게 더 관련성이 높다는 것입니다. "할인" 부분은 결과 목록에서의 위치에 비례하여 로그 비례 요소로 각 문서의 관련성 점수를 감소시키는 것을 의미합니다. 이는 사용자가 목록을 아래로 이동할수록 각 이후 결과를 확인할 가능성이 줄어든다는 것을 반영합니다. 수식은 다음과 같습니다:

![수식](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_7.png)

여기서 p는 순위 위치, relᵢ는 𝑖 위치의 결과의 관련성 점수이며 log⁡₂(𝑖+1)은 (𝑖+1)의 이진 로그를 나타내는 할인 요소입니다. relᵢ를 계산하기 위해 우리는 단순히 관련 문서에 대해 이진 관련성 1을 사용하고 관련 없는 문서에 대해 0을 사용합니다.

<div class="content-ad"></div>

MRR과 비교할 때, DCG는 최상위 결과물 하나만 고려하는 대신 여러 결과물의 관련성을 고려하여 검색 품질을 보다 포괄적으로 판단합니다. MRR과 DCG는 검색 성능에 대해 다른 시각을 제공하며, MRR은 최상위 결과물의 정확성에 초점을 두는 반면 DCG는 전체 결과 목록의 관련성을 고려합니다. 두 지표를 모두 모니터링하여, 회수 전략의 효과를 자세히 이해할 수 있습니다.

## e) NDCG (정규화된 할인 누적 이익)

DCG는 순위가 매겨진 목록의 총 관련성을 측정하는 반면, NDCG는 다양한 목록 간에 비교를 허용하는 DCG의 정규화된 버전으로, 일반적으로 DCG보다 NDCG가 선호됩니다. NDCG는 랭킹 시스템을 평가하기 위한 더 표준화되고 해석 가능한 지표를 제공하기 때문입니다. NDCG의 공식은 아래와 같습니다:

![이미지](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_8.png)

<div class="content-ad"></div>

위에서:

- DCG𝑝은 원래 공식을 사용하여 위치 𝑝에서의 DCG값을 의미합니다.
- IDCG𝑝는 이상적인 DCG로, 모든 결과가 관련성에 따라 완벽하게 정렬된 경우 위치 𝑝에서의 최대 가능한 DCG값입니다. IDCG𝑝의 공식은 아래에 나와 있습니다:


![IDCG formula](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_9.png)


여기서는 관련성 점수를 내림차순으로 정렬합니다.

<div class="content-ad"></div>

우리의 사용 사례에서는 패턴 I 및 II에 대한 NDCG를 측정합니다. 패턴 I에 대해서는 평균 NDCG가 약 64% 정도입니다. 필터를 적용하면 이 수치가 약 91%로 증가합니다.

## f) 평균 정밀도 (AP)

AP는 검색 엔진과 같은 시스템이 관련 항목을 어떻게 순위를 매기는지를 측정합니다. 얼마나 많은 관련 항목이 발견되었는지와 그들이 얼마나 높게 순위되었는지를 모두 고려합니다. 예를 들어, 종이 비행기를 제작하는 방법에 관한 상위 5개의 지침 동영상을 요청했고, 여기에 동영상 순서가 다음과 같이 제공된다고 가정해 봅시다:

- 동영상 A: 완벽한 지침 (관련 있음)
- 동영상 B: 전혀 관련 없음 (관련 없음)
- 동영상 C: 괜찮은 지침 (관련 있음)
- 동영상 D: 다른 관련 없는 동영상 (관련 없음)
- 동영상 E: 훌륭한 지침 (관련 있음)

<div class="content-ad"></div>

AP를 계산하기 위해서는 관련 동영상이 발견된 각 지점에서의 정밀도를 살펴봅니다:

- 동영상 A 이후: 1/1 = 100%
- 동영상 C 이후: 2/3 = 66.7%
- 동영상 E 이후: 3/5 = 60%

이제 이러한 정밀도 값을 평균합니다: (100% + 66.7% + 60%) / 3 = 75.6%

따라서이 검색 결과의 AP는 75.6%입니다. 이는 평균적으로 검색 중에 관련 결과를 상당히 빨리 얻게 된다는 것을 의미합니다. Precision @ 5는 처음 5개 결과의 관련성에만 초점을 맞추지만 (이 경우 60%), AP는 관련 동영상이 발견된 순서도 고려하여 상위 위치를 보상합니다. 이는 검색 엔진이 귀하를 위해 관련 결과를 찾는 데 얼마나 잘 수행되고 있는지에 대해 보다 세밀한 그림을 제공합니다. AP를 계산하는 공식은 다음과 같습니다:

<div class="content-ad"></div>


![Image](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_10.png)

where

- H is the set of positions of relevant documents.
- ∣𝐻∣ is the number of relevant documents.
- 𝑃(𝑖) is the precision at position 𝑖. P(i) for a relevant document at position 𝑖 is 1/i.

## g) Mean Average Precision (MAP)


<div class="content-ad"></div>

MAP은 여러 검색 또는 질의를 평가하기 위해 평균 정밀도 (AP)의 개념을 확장한 것입니다. AP는 하나의 검색이 관련 항목을 어떻게 순위 지정하는지를 측정하는 반면, MAP는 여러 검색에서 AP 점수를 평균하여 여러 질의에 대한 시스템의 전반적인 성능 측정을 제공합니다. 이는 단지 하나가 아닌 여러 테스트에서 평균 성적을 받는 것과 같습니다.

MAP는 복수의 관련 문서가 각 질의에 대해 다루는 복잡한 시나리오를 처리할 수 있는 능력으로 인해 종종 선호됩니다. 하지만 각 질의에 하나의 관련 결과물만 있는 경우, MAP는 흥미로운 단순화를 겪습니다. 하나 관련 문서에 대한 질의를 다룰 때, MAP는 본질적으로 다음과 같이 요약됩니다:

- 평균 정밀도가 정밀도가 됩니다: 각 질의의 AP는 단일 관련 문서가 나타나는 순위에서 달성된 정밀도에 단순히 해당합니다.
- 정밀도가 역순위(Reciprocal Rank)가 됩니다: 하나의 관련 문서만 있는 경우, 정밀도는 해당 순위의 역수입니다(예: 문서가 3위에 있으면 정밀도는 1/3입니다). 이 값은 정확히 MRR 계산에 사용되는 값입니다.
- MAP은 MRR을 반영합니다: 모든 질의에 대한 이 AP 값들의 평균인 MAP는 관련 문서의 역순위를 평균내어 지각한다. 이것이 바로 MRR이 하는 일입니다. 이 중첩성 때문에 특정 설정에서 MAP을 사용하면 MRR이 이미 제공하는 것 이상의 추가 통찰력을 제공하지 않습니다. MAP은 보통 여러 관련 문서가 각 질의에 대해 포함된 시나리오(다중 단계 질문 응답)에서 보다 유익하며, 서로 다른 순위에서 모든 관련 문서가 얼마나 잘 검색되었는지에 대한 세밀한 관점을 제공할 수 있습니다.

패턴 I 및 II에 대한 실험에서, MAP은 본질적으로 MRR과 같습니다. 패턴 I에서 64%이며, 패턴 II에서 약 91%로 증가합니다.

<div class="content-ad"></div>

상기 평가를 복제하는 데 필요한 모든 지원 코드는 여기에서 찾을 수 있습니다.

# 답변 평가

다음 단계에서는 RAG 파이프라인의 답변 생성 구성 요소를 평가해 보겠습니다. 각 질문에 대한 실제 정답이 제공되므로 생성된 답변의 품질을 평가하고 테스트 세트의 예상 응답과 의미론적으로 유사하며 정확한지 확인하는 것이 목표입니다.

이를 위해 두 가지 서로 다른 메트릭을 적용할 수 있습니다. 첫 번째 메트릭은 cosine similarity를 활용하여 의미론적 유사성을 양적으로 평가합니다. 두 번째 메트릭은 LLM의 역할로, 생성된 답변과 인간이 생성한 답변을 동시에 LLM에 제시하여 모델의 출력이 인간의 기대와 얼마나 일치하는지를 평가할 수 있습니다. 이 접근 방식을 통해 생성된 답변의 사실적 정확성 및 전반적 일관성을 평가하여 인간이 작성한 응답과 구별할 수 없도록 보장할 수 있습니다.

<div class="content-ad"></div>

## 가) 의미 유사성

이 메트릭은 생성된 답변과 기대한 답변의 벡터 표현 사이의 각도의 코사인을 측정합니다. 생성된 응답과 실제 답변(기대 값) 간의 의미적 유사성을 평가하는 것을 의미합니다. 이 평가는 기대 값과 응답을 기반으로 하며, 0부터 1까지의 값을 갖습니다. 높은 점수는 생성된 응답과 기대 값 사이의 더 좋은 일치를 나타냅니다.

기대된 답변과 생성된 답변은 모두 텍스트 임베딩 모델 텍스트-임베딩-003을 사용하여 인코딩됩니다. 이 모델은 Vertex AI API를 통해 제공됩니다. 의미 유사성에 대한 코드 구현은 여기에서 찾을 수 있습니다.

## 나) 사실적 정확성

<div class="content-ad"></div>

이전 RAG 파이프라인에서 생성된 답변의 정확성을 평가하기 위해 우리는 Gemini를 활용합니다. 질문, 기대 답변(실제 답변), 그리고 생성된 답변이 Gemini에 전달됩니다. 프롬프트 템플릿을 사용하여 Gemini가 생성된 답변을 "정확"(기대 답변과 완전히 부합), "부분적으로 정확"(정보 일부를 포함하지만 불완전하거나 일부 오류가 있는 것), 또는 "부정확"(기대 답변과 부합하지 않는 것)으로 분류하도록 안내합니다. 이 분류는 답변 품질을 세분화하여 평가하게 해주며, 답변 생성 모델이 개선이 필요한 부분을 식별하는 데 도움이 됩니다. 이 평가 프로세스의 구현 세부사항은 여기에서 확인할 수 있습니다.

아래 표는 이전에 실험한 네 가지 패턴(RAG 파이프라인)을 비교한 전반적인 답변 정확도를 보여줍니다. 정확도를 계산하기 위해 완전히 정확한 답변에는 1.0의 점수를 할당하고, 부분적으로 정확한 답변에는 0.5의 점수를, 그리고 LLM 사실적 정확성 출력에 따라 부정확하게 분류된 답변에는 0의 점수를 부여합니다. 그림에서는 외부 LLM 패스를 활용하여 추출방식을 사용하여 답변을 생성하는 패턴 IV가 다른 모든 접근 방법을 능가하여 정확도가 거의 70%에 달한다는 것을 보여줍니다.


지정된 질문과 아래 표시된 기대 및 생성된 답변을 제공하고,
답변을 비교하여 `correct`, `partially correct`, 또는 `incorrect` 중 하나의 클래스로 분류하세요.

답변이 부분적으로 정확하거나 부정확한 경우, 이유를 제공하세요.
출력은 클래스와 이유로 된 Python 딕셔너리 형식으로 제공해야 합니다.
클래스에는 한 단어만 포함되어야 하며(기대 클래스임),
이유는 숫자와 사실에만 초점을 맞추어 간결하게 제공해야 합니다.

예상 및 예측된 답변 간의 의미론에 집중하지 마십시오.

중요: 숫자와 사실만 비교하세요.

단위가 다른 경우 비교 전에 정규화하세요.
예) 10억 = 1000백만.

질문: {question}

기대 답변: {expected_ans}xa

예측 답변: {predicted_ans}

예측된 답변을 기대 답변과 비교하세요.
예측된 답변이 사실적으로 정확하며 주어진 질문을 충족하는지 결정하세요.

다음 형식에 따라 응답을 제공하세요:
{format_instructions}


<div class="content-ad"></div>

네, 해당 테이블 태그를 마크다운 형식으로 변경해 볼게요.


We can also break down the distribution of classes across the four different approaches (pipelines) to gain a better understanding of how improvements gradually occur with enhancements.

![Distribution of classes](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_12.png)

The box plots below show the distribution of semantic similarity scores across different classes (correct, partially correct, incorrect) for the four different document question-answering RAG pipelines we previously created. The x-axis represents the different classes, while the y-axis signifies the semantic similarity score, ranging from 0 (no similarity) to 1 (perfect similarity). These box plots display the median, quartiles, and range of the semantic similarity scores within each class. Overall, the figure provides a concise and informative visual representation of the performance of various question-answering approaches in terms of semantic similarity.

![Box Plots](/assets/img/2024-05-27-ArchitecturalBlueprintsforRAGAutomationAdvancedDocumentUnderstandingusingVertexAISearch_13.png)


<div class="content-ad"></div>

분포를 통해 다양한 패턴이 나타납니다:

- OOB (패턴 I): 모든 클래스에서 다양한 점수 범위가 나타나며, 부분적으로 정확하지 않은 답변이 더 많이 나타납니다. 이는 즉, 기본 설정의 (OOB) 방식이 우리의 테스트 세트에서 일관되게 정확한 답변을 제공하는 데 어려움을 겪는 것을 시사합니다.
- OOB + 필터 (패턴 II): OOB 방식보다 특히 잘못된 답변을 줄이는 측면에서 뚜렷한 향상이 나타납니다. 분포는 더 높은 유사도 점수 쪽으로 기울어져 있어 필터를 적용한 후 정확도가 향상되었음을 나타냅니다. 패턴 II의 잘못된 범주에 대한 흥미로운 관찰은 의미론적 유사성 분산이 감소하고 0.5에서 0.6 사이로 중심을 이동한다는 것입니다. 이는 패턴 I과 달리 의미적 유사성 점수의 범위가 더 넓었던 0.5에서 1까지 였던 것과 비교했을 때입니다.
- 추출 세그먼트 (패턴 III): 이전 두 가지 방식과 비교했을 때 올바른 및 부분적으로 올바른 답변의 비율이 더 높은 개선을 보여줍니다. 이는 문맥에서 관련 세그먼트를 추출하는 것이 OOB 모델 또는 기본 필터링에 의존하는 것보다 효과적인 전략임을 시사합니다.
- 추출 답변 (패턴 IV): 가장 우수한 성능을 달성하며, 가장 많은 올바른 답변과 가장 적은 잘못된 답변이 나타납니다. 이는 문맥에서 완전한 답변을 직접 추출하는 것이 가장 의미론적으로 유사하고 정확한 응답을 제공한다는 것을 나타냅니다.

지금까지 RAG 파이프라인의 두 가지 주요 단계인 검색 및 답변 생성을 평가하는 방법에 대해 논의했습니다. 검색에서는 검색된 문서의 관련성을 평가하는 데 집중했습니다. 이를 더 확장하여 페이지 또는 검색된 문맥의 관련성을 평가할 수도 있습니다. 그러나 이를 위해 이에 대한 정답 정보를 보유하고 있어야 합니다.

답변 품질의 경우, Ragas와 같은 다른 오픈 소스 대안 프레임워크를 사용하거나 해당하는 경우 Vertex AI의 Rapid Evaluation API를 활용할 수도 있습니다. Rapid Evaluation 서비스를 사용하면 점별 및 쌍별로 여러 메트릭을 통해 LLM을 평가할 수 있습니다. 추론 시간 입력, LLM 응답 및 추가 매개변수를 제공하면 서비스가 평가 작업과 관련된 특정 메트릭을 반환합니다.

<div class="content-ad"></div>

# 결론

이 가이드에서는 금융 분야에서 업계 수준의 RAG 파이프라인을 생성하기 위해 Vertex AI Search의 활용을 탐색했습니다. 금융 데이터 세트의 삽입 및 색인화를 자세히 다루었으며 이러한 색인을 활용하여 다양한 방법으로 검색을 수행했습니다. Vertex AI Search가 제공하는 다양한 컨텍스트 유형에 액세스하고 비교를 위해 네 가지 다른 RAG 파이프라인을 생성했습니다. 또한 대체 파이프라인 구성을 살펴보았습니다.

그런 다음 검색 성능 메트릭 및 답변 품질 평가 기술을 평가했습니다. 결과를 비교함으로써 다른 접근 방식의 효과에 대한 유익한 통찰력을 얻었습니다.

우리의 주요 발견은 Vertex AI Search가 표준 및 완전히 사용자 정의 가능한 RAG 솔루션을 구축하기 위한 포괄적인 기능 세트를 제공한다는 것입니다. 이 플랫폼은 어떠한 선택한 도메인 내에서 정보 검색 및 질문 답변 작업을 혁신적으로 간소화합니다. 앞으로의 게시물에서는 Vertex AI의 미개척 기능을 활용한 다른 패턴을 탐색할 예정입니다.

<div class="content-ad"></div>

이 가이드의 내용을 완전히 이해하려면 공유 코드 리포지토리를 설정하는 것을 권장합니다. 작업 환경에서 지침을 따라 실험과 결과를 복제하세요. 이렇게 하면 여러분이 손쉽게 자신의 사용 사례에 적응하고 확장할 수 있습니다!

기사를 읽어 주신 것과 참여해 주신 것에 감사드립니다. 팔로우와 박수가 많은 의미를 갖습니다. 본문이나 공유 소스 코드에 관한 질문이 있으면 언제든지 arunpshankar@google.com 또는 shankar.arunp@gmail.com으로 연락해 주세요. 또한 https://www.linkedin.com/in/arunprasath-shankar/에서 저를 찾을 수도 있습니다.

모든 피드백과 제안을 환영합니다. 대규모 기계 학습, NLP/NLU에 관심이 많으시고 협업을 열망한다면 기쁘게 연결할 수 있습니다. 더불어 Google Cloud, VertexAI, 그리고 NLP/ML에서의 다양한 생성적 AI 구성 요소와 응용 프로그램을 이해하려는 개인, 스타트업 또는 기업이시라면 도와 드리겠습니다. LinkedIn에서 연락 주시기 바랍니다!
