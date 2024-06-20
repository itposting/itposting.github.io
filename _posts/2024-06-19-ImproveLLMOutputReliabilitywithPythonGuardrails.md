---
title: "파이썬 가드레일로 LLM 출력 신뢰도 향상하기"
description: ""
coverImage: "/assets/img/2024-06-19-ImproveLLMOutputReliabilitywithPythonGuardrails_0.png"
date: 2024-06-19 04:03
ogImage: 
  url: /assets/img/2024-06-19-ImproveLLMOutputReliabilitywithPythonGuardrails_0.png
tag: Tech
originalTitle: "Improve LLM Output Reliability with Python Guardrails"
link: "https://medium.com/towards-data-science/improve-llm-output-reliability-with-python-guardrails-cc8163b26b0c"
---


![이미지](/assets/img/2024-06-19-ImproveLLMOutputReliabilitywithPythonGuardrails_0.png)

# IF문을 잘 활용하면 LLM의 출력물을 믿을 수 있는 수준으로 향상시킬 수 있어요

LLM은 창의력과 복잡한 작업 해결에 뛰어나지만 엄격한 규칙을 따르는 데 어려움을 겪기도 하며 종종 설정된 범위를 약간 넘어서 답변을 제공하기도 합니다. 앱을 개발할 때 이러한 주의사항은 사용자들이 퇴장하게 만들 수 있는 실패와 터무니없는 답변으로 이어질 수 있습니다.

좋은 소식은 엄격한 규칙을 작성하는 것이 모든 프로그래머의 기본 역량이며, 지금 LLM과 함께 작업하고 있다고 해서 IF문을 사용하는 방법을 잊은 것은 아니라는 점입니다.

<div class="content-ad"></div>

# LLM 라스트마일 배송 문제

출력을 제어하는 것은 특히 LLM을 API와 같은 앱의 다른 구성 요소와 통합할 때 중요합니다. 사용자 평면 요구 사항의 설명을 검색 매개변수로 변환하는 text_to_params 도구를 작업하는 동안, API 함수와 호환되지 않는 결과 매개변수를 생성하는 것을 깨달았습니다.

전체 API 문서에 액세스할 수 있고 매개변수의 90% 이상을 올바르게 한 상태에서도 여러 매개변수 중 하나가 완전히 답을 망가뜨리는 경우가 있었습니다. 이러한 예시 중 일부는 가격 단위를 혼동하여 price_per_meter를 total_price로 오해하거나 숫자 필터에 m2와 같은 단위를 추가하거나, 가격 태그에서 월세임을 시사하는데도 판매 제안을 찾는 경우 등이 있었습니다.

이러한 모든 경우를 처리하고 1,000 토큰 이상을 추가한 사용자 입력을 조작하는 데 많은 시간을 들인 후, 몇 가지 유효성 검사 함수를 사용하여 이러한 것들을 Python에서 더 효율적으로 처리할 수 있음을 깨달았습니다.

<div class="content-ad"></div>

이 이야기는 생산 준비가 된 LLM-파워 앱을 구축하는 시리즈 중 두 번째 이야기입니다. 권장사항으로 프롬프트 최적화에 대한 팁을 확인하시기를 권장합니다.

# Python 가드레일을 사용하는 장점은 다음과 같습니다.

- 프롬프트 크기를 크게하지 않고도 엣지 케이스 처리
- 다른 응용 프로그램과의 마일지저호환성 보장
- 예상치 못한 사용자 동작에 대응하는 LLM 앱 만들기
- 성능 향상 및 더 작은 모델 사용 가능

텍스트-투-파라미터 도구 예제를 이어가면, 특히 까다로운 질문 세트에 대한 도구 정확도를 가드레일을 추가하거나 제거하여 비교하는 실험을 실행했습니다.

<div class="content-ad"></div>

## 모델별 검색 매개변수 정확도

![이미지](/assets/img/2024-06-19-ImproveLLMOutputReliabilitywithPythonGuardrails_1.png)

# LangChain에서 Python을 LLM 호출과 혼합하는 방법

LangChain을 사용하면 LLM 호출, 출력 구문 분석 및 일반 Python 함수를 모두 RunnableSequence로 결합하여 편리하게 결합할 수 있습니다. RunnableSequence는 사실상 대부분의 체인의 기초입니다.

<div class="content-ad"></div>

아래 예시 코드에서는 사용자 요구 사항을 필터와 함께 사전으로 변환하는 간단한 텍스트-to-params 도구에 초점을 맞추었습니다. Python을 사용하여 LLM 출력을 변환하는 것은 구조화된 JSON 출력과 함께 작업할 때 가장 효율적입니다. 그러나 동일한 접근 방식은 텍스트 응답(예: 분류기와 같은 작은 NLP 모델 사용)에도 활용할 수 있습니다.

```js
from langchain_core.output_parsers import JsonOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, temperature=0, model="gpt-4o")

prompt = """
SYSTEM
description을 key:value 쌍으로 필터 매개변수로 변환합니다.
허용된 필터 특징: [`area_min`, `area_max`, `price_min`, `price_max`]

답변은 유효한 $JSON_BLOB이어야하며 다음과 같이 표시됩니다:

```
{
  "filters": $FOUND_FILTERS,
}


시작! 항상 유효한 json blob로 응답해야 함을 상기시킵니다.

새 메시지
{input}

(무엇이든 JSON blob으로 응답할 것을 상기시킵니다)

"""

prompt = ChatPromptTemplate.from_template(prompt)

def search_params_guardrails(tool_output: dict) -> str:
    min_sale_price = 100000
    filters = tool_output.get("filters", {})
    
    if 'price_max' in filters.keys():
        price_threshold = filters["price_max"]
        filters["offer_type"] = 'sale' if price_threshold >= min_sale_price else 'rent'
        
    return {"filters":filters}


샘플 코드의 첫 번째 부분에서는 OpenAI 모델, Prompt Template, JsonOutputParser(지시사항과 함께 유효한 JSON을 얻는 데 도움을 주는) 및 다른 LLM이 설정한 기타 필터에 기초하여 `offer_type` 필드를 추가하는 기본 api_params_guardrail 기능을 준비합니다.

```js
chain_text_to_params = prompt | llm | JsonOutputParser() | search_params_guardrails
```

<div class="content-ad"></div>

그럼 체인을 구성하여 준비된 구성 요소의 실행 순서를 정의합니다. 각 구성 요소는 이전 단계의 출력을받고 처리를 유지하여 체인 끝에 최종 결과를 제공합니다.

![Chain Configuration](/assets/img/2024-06-19-ImproveLLMOutputReliabilitywithPythonGuardrails_2.png)

체인을 설정하고 나면 invoke를 사용하여 호출할 수 있습니다. 입력으로 필요한 속성의 유형을 설명합니다. 이 간단한 프롬프트는 텍스트에서 정보를 올바르게 추출뿐만 아니라 해당 정보를 유효한 사전으로 파싱하고 함수를 기반으로 offer_type 매개변수를 추가했습니다.

# 파이썬 함수를 사용한 LLM 결과 개선의 실용적 예제 3가지

<div class="content-ad"></div>

안녕하세요! 저는 한국어로 번역을 도와드리는 인공지능입니다.

제가 준비한 텍스트를 파라미터로 변환하는 도구에 몇 가지 속임수를 추가했습니다. 이러한 속임수들은 더 신뢰할 수 있고 호환성이 있는 LLM 출력물을 생성하는 데 도움이 되었습니다.

## 1. LLM은 너무 리터럴할 수 있으므로 답변에 조금의 지혜를 더해보세요.

처음 LLM 앱을 테스트하기 시작하면, 처음 프롬프트가 모든 이상한 사용자 쿼리와 경계 케이스를 다루지 않았거나 LLM이 일부 도메인 지식을 놓친 것에 빨리 깨닫게 됩니다.

Mieszko를 작업 중인 동안 직면한 문제 중 하나는 사용자 요구 사항을 검색 필터 JSON으로 변환하는 도구가 너무 리터럴하다는 것이었습니다.

<div class="content-ad"></div>

예를 들어, 사용자가 50m2 정도의 면적을 가진 아파트를 3500-3600 zł의 예산 내에서 찾고 싶다고 설명한다면, LLM은 다음 필터를 생성했습니다:

```js
search_filters = {
  "price": {"min": 3500, "max": 3600}, 
  "area": {"min": 50, "max": 50}
}
```

이 필터들이 논리적으로는 잘못되지 않았지만, 사용자는 월 3200 zł에 55m2 아파트를 보는 것에 대해 훨씬 더 기뻤을 것입니다. 그래서 필터들은 다음과 같이 변경되어야 합니다:

```js
search_filters = {
  "price": {"max": 3600}, 
  "area": {"min": 45, "max": 55}
}
```

<div class="content-ad"></div>

저는 프롬프트에 더 많은 지침을 추가해 봤지만, 수십 가지 검색 매개변수와 대부분의 매개변수에 사용자 정의 유효성 검사 규칙이 있는 경우 몇 백개의 토큰이 추가될 것입니다. 도구 출력물을 수정하여 동일한 결과가 더 안정적으로 생성되도록 단순한 가드레일 함수를 추가했습니다.

이제 두 가지 문제에 국한된 코드 예제를 제공해 드리겠습니다:

```js
def search_params_guardrails(params):
    # 'price'가 있는 경우, 'min'과 'max' 모두가 있는지 확인하고, min이 max의 20% 이하인 경우 min 임계값 제거
    if 'price' in params and all(key in params["price"] for key in ['min', 'max'])
        if (params['price']['max'] - params['price']['min']) / params['price']['max'] <= 0.20:
          del params['price']['min']
    
    # 'area'가 있는 경우, 'min'과 'max' 모두가 있는지 확인하고, min과 max가 동일한 경우 min은 0.9배로, max는 1.1배로 확장
    if 'area' in params and all(key in params["area"] for key in ['min', 'max'])
        if params['area']['min'] == params['area']['max']:
            params['area']['min'] *= 0.9
            params['area']['max'] *= 1.1
    
    return params
```

## 2.퍼지 매치가 수십 가지 카테고리를 선택해야 하는 지시를 대체할 수 있는지 여부를 검증하세요.

<div class="content-ad"></div>

검색 매개변수 도구를 구축하는 동안 한 가지 사소한 문제가 더 발생했습니다. 범주형 필드를 처리하는 것이었습니다. 'offer_type'과 같이 가능한 레이블이 'sale' 또는 'rent'만 있는 필드가 있으면 쉽게 프롬프트 지시사항에 적합하게 맞출 수 있습니다.

그러나 더 많이 세분화된 필드로 넘어가면 상황이 복잡해집니다. 제 경우에는 와르샤와의 지역(18개 인스턴스) 및 동(143개 인스턴스)이었습니다. 이러한 모든 레이블을 프롬프트에 추가하면 1,058개의 토큰이 추가되어 매 호출당 1센트의 비용이 들게 될 것입니다. GPT 4-터보를 사용할 때 또한 마찬가지입니다.

GPT 3.5조차도 와르샤의 지리에 대한 기본적인 이해가 있기 때문에 프롬프트에 모든 이 정보를 제공할 필요가 없습니다. 가장 중요한 문제는 때로는 철자가 달라지거나 사용자 입력에서 직접 복사된 오류 또는 약어가 있는 경우였습니다.

지역과 동이 검색 API에서 사용 가능한 값과 호환되도록 하기 위해 처음엔 퍼지 매치를 사용하여 LLM 세트 매개변수를 선별된 목록으로 제한했고, 실제로 모든 허용된 레이블을 프롬프트를 통해 제공하지 않았습니다.

<div class="content-ad"></div>

## 알려진 유효 라벨 세트에 대해 범주형 라벨을 검증하는 간소화된 퍼지 매치 코드입니다.

```js
from fuzzywuzzy import process
import json

def fuzzy_match(label: str, allowed_labels:list, score_cutoff=90, allowed_len_diff = 3):
    best_match = process.extractOne(label, allowed_labels, score_cutoff=score_cutoff)
    if best_match and abs(len(best_match[0]) - len(label)) > allowed_len_diff:
        # 모호한 일치를 피하기 위해 더 큰 길이 차이가 있는 매치 제거
        best_match=None
        
    return best_match[0] if best_match else None

def validate_category_feature(labels: list, allowed_labels:list)->list:
    labels_val = [fuzzy_match(label, allowed_labels) for label in labels]
    labels_val = [item for item in labels_val if item is not None] 
    
    return labels_val

def validate_category_filters(params:dict, cat_features: list)->dict:   
    # 각 cat_feature에 대한 허용된 라벨 목록이 포함된 json 경로로 변경
    path = "allowed_labels_per_feature_map.json" 
    with open(path, "r") as f:
        allowed_labels_per_feature = json.load(f)
        
    for feature in cat_features:
        allowed_labels = allowed_labels_per_feature[feature]
        labels = params.get(feature, [])
        if labels:
            labels_val = validate_category_feature(labels, allowed_labels)
            if labels_val:
                params[feature] = labels_val


    return params
```

이 접근 방식은 지리적 영역에만 적용되지 않으며, 전자 상거래에서 브랜드나 모델을 선별하는 등 다른 영역에도 구현할 수 있습니다. 이는 다음과 같이 더 넓은 범위의 가드레일 집합으로 구현할 수 있습니다.

```js
def search_params_guardrails(params):
  ... 이전 로직
  # 범주형 필터가 API 허용 값을 준수하는지 확인
  params = validate_category_filters(params, ["district", "subdistrict"])

  ... 후속 로직

  return params
```

<div class="content-ad"></div>

## 3. 제한적인 필터를 완화함으로써 실패한 API 호출을 재시도하세요

마지막 마일 배송 문제의 또 다른 부분은 LLMs가 사용자의 요청에 가능한 한 많은 필터를 맞추려고 하는 경향이 있다는 것입니다. 예를 들어, 사용자가 저렴한 가격대 내에서 편안한 아파트를 요청했을 때, LLM은 샤워, 욕조, 식기 세척기, 발코니 등 모든 편의 시설을 추가해야 한다고 판단할 수 있습니다. 저렴한 가격 요구 사항과 결합하여 API 호출에 전달되는 최종 필터가 제로 집합으로 끝날 수 있습니다.

모델이 매개변수 설정을 재시도할 기회를 주더라도 이는 다른 LLM 호출을 의미하며 이로 인해 비용과 대기 시간이 증가합니다. 대신, 나는 가장 제한적인 필터 세트를 순차적으로 제외하면서 API 호출을 재시도하기로 결정했습니다. 그렇게 하면 결국 유효한 답변을 얻을 수 있을 거라는 희망을 품게 되었습니다.

```js
def get_offers_count_with_loosening_filters(params):

    # 빈 응답일 경우 삭제할 선택적 필터 목록
    optional_filters = ["interior_standard", "amenities", "building_type", "build_year", "market"]
    valid_response = False
    dropped_filters = {}

    while True:
        # 선택된 필터 내에서 활성 제공 건 수에 대한 정보를 반환하는 API 호출
        offer_json, valid_response = call_api(params)

        if valid_response:
            available_offers = offer_json.get("unique_offers_pool", 0)

            output = f"{available_offers}개의 제공 건이 발견되었습니다. 다음 필터와 일치합니다: {params}"

            if dropped_filters:
                output += f", 그러나 이 요구 사항에 맞는 {dropped_filters} 필터를 제외해야 합니다."

            return output

        else:
           
            if not optional_filters:
                # 모든 선택적 필터를 소진했을 경우 예외 발생
                return f"{params}와(과) 일치하는 제공 건을 찾을 수 없습니다. 사용 가능한 제공 건을 찾으려면 필터링을 덜 엄격하게 설정하세요."
            else:
                # params에서 한 개의 선택적 필터를 제거하고 다시 시도합니다.
                dropped_filter = optional_filters.pop(0)
                if dropped_filter in params:
                    dropped_filters[dropped_filter] = params.pop(dropped_filter, None)
```

<div class="content-ad"></div>

이 함수가 모든 출력을 완전한 문장으로 반환하는 것을 알 수 있습니다. LLM 에이전트가 사용하는 전체 텍스트-파라미터 도구를 통해 대화 형식의 설명과 함께 도구 출력이 반환되면 에이전트 추론에 더 쉽게 구현할 수 있습니다. 검색 가능하게 만들기 위해 삭제된 필터의 명확한 설명은 에이전트가 최종 사용자에게 설명하는 데 도움이 됩니다.

# 요약

전망 가능한 미래에도 빠른 LLM 개발에도 불구하고, 그들은 에너지 비용과 각 답변을 처리하는 데 많은 시간이 필요한 대형 생물체로 남아있을 것입니다. 필요한 곳에서 이 파워를 활용하되 가능한 경우 간단하고 검증된 솔루션으로 돌아가도 두려워하지 마세요. 이러한 접근 방식에 대해 행성과 당신의 지갑이 감사할 것입니다.

이 글은 효율적이고 신뢰할 수 있는 LLM 기반 앱을 구축하는 실용적인 팁에 중점을 둔 시리즈의 일부입니다. 새로운 글이 게시될 때 알림을 받으려면 제 프로필을 구독하세요.

<div class="content-ad"></div>

## 시간 내어 주셔서 감사합니다!