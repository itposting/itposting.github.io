---
title: "대형 언어 모델LLM로 민감한 데이터 처리하는 방법 총정리"
description: ""
coverImage: "/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_0.png"
date: 2024-06-23 19:28
ogImage: 
  url: /assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_0.png
tag: Tech
originalTitle: "All You Need to Know about Sensitive Data Handling Using Large Language Models"
link: "https://medium.com/towards-artificial-intelligence/all-you-need-to-know-about-sensitive-data-handling-using-large-language-models-1a39b6752ced"
---


## 목차

소개

데이터 민감도는 무엇을 정의하고 있으며 누가 정의하고 있나요?
데이터 익명화와 익명변환은 무엇인가요?
민감한 데이터를 처리하기 위해 AI를 활용하는 것이 특별한 이유는 무엇인가요?

실습 안내 — LLM 기반 데이터 프로파일러 구현

<div class="content-ad"></div>

로컬 LLM 설정
1. 도커를 사용하여 모델 서버 설정하기
2. 프롬프트 빌드하기
Azure OpenAI 설정

고수준 솔루션 아키텍처
결론
참고 자료

예상되는 하루 평균 데이터 생성량은 328.77 백만 테라바이트입니다. 대부분의 데이터는 데이터 주도형 애플리케이션으로 흐르며 매초마다 처리되고 풍부해집니다. 주요 제품들 사이에서 LLM의 채택과 통합이 확대되어 텍스트 데이터 활용의 사용 사례와 이점이 더욱 증가했습니다.

대규모 데이터를 처리하는 조직은 민감한 데이터 처리 요구 사항을 준수하는 데 어려움을 겪습니다. 이는 데이터 보안이나 데이터 법률 및 규정을 준수하는 것과 관련이 있습니다.

<div class="content-ad"></div>

민감한 데이터 침해의 직접적 및 간접적 영향은 특히 민감한 데이터가 관련될 때 기관에 중대한 재정적 결과를 초래할 수 있습니다. 이는 즉각적인 비용 영향을 넘어서 해당 기관의 고객 기반의 신뢰와 충성을 흔들어놓을 수 있습니다.

![Image](/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_0.png)

# 무엇이 그리고 누가 데이터의 민감성을 정의할까요?

민감한 데이터는 데이터 보호와 개인 정보 보호 맥락에서 중요한 개념입니다. 높은 수준에서 민감한 데이터는 비밀유지되고 무단 접근으로부터 보호되어야 하는 정보로 이루어져 있습니다. 민감한 데이터의 중요성은 그것을 보호하기 위해 마련된 법률 및 규정들에 의해 강조됩니다. 예를 들어, EU의 일반 데이터 보호 규정(GDPR)과 캘리포니아 소비자 개인 정보 보호 법(CCPA) 등 다양한 국가에서 적용되는 법률 및 규정이 있습니다.

<div class="content-ad"></div>

민감한 데이터에는 다음과 같은 다양한 정보 카테고리가 포함됩니다:

- 개인 식별 가능 정보 (일반 데이터 보호 규정)
- 보호된 건강 정보 (건강 보험 이동성 및 책임성 법)
- 교육 정보 (가족 교육 권리 및 개인 정보 보호 법)
- 기밀 비즈니스 정보
- 금융 정보
- 고용 정보
- 법적 정부 발급 정보
- ...

게다가 GDPR은 특히 개인 식별 가능 정보(PII)와 관련하여 민감한 개인 데이터의 특별한 카테고리를 다음과 같이 명시하고 있습니다:

- 인종이나 민족 출신
- 정치적 견해
- 종교나 철학적 신념
- 노동 조합 가입
- 유전자 정보
- 생체 인식 정보
- 건강 정보
- 성생활이나 성적 취향

<div class="content-ad"></div>

법적 프레임워크에 따라 민감한 데이터가 무엇인지에 대한 명확한 설명과 경계가 존재하지만, 기관이 운영중인 도메인이나 섹터에 따라 이러한 내용은 더 많은 민감한 기밀 정보를 포함할 수 있습니다. 이로써 기관은 자체 데이터 기밀성 분류를 정의하고 해당 분류를 데이터 민감도 도구에 통합하거나 사용자 정의 솔루션에 통합하는 것으로 나아갈 것입니다.

# 데이터 익명화와 익명도

익명화된 데이터란 특정 개인과 연결되지 않는 데이터를 의미하며, 추가보조 데이터를 통해서도 그러한 연결이 불가능합니다. 완전히 익명화된 데이터는 GDPR과 같은 개인정보 보호 규정의 적용 범위에서 벗어납니다.

추가 정보와 함께 특정 개인에게 속한다고 할 수 있는 데이터는 익명화된 것이라고 합니다. 이는 원본 데이터를 가짜 식별자로 대체하는 것만으로 달성될 수 있으며, 필요한 경우 되돌릴 수도 있습니다. 예를 들어, 암호화는 데이터 익명화의 한 방법입니다.

<div class="content-ad"></div>

개인정보 의사화는 GDPR의 제 4조에 정의되어 있습니다:

개인정보 익명화 및 의사화는 민감한 데이터 식별 후 수행되는 작업입니다. 데이터를 익명화 또는 의사화해야 하는지는 특정 사용 사례 및 미래 어느 시점에서 익명화를 반대로 해야 하는지 여부에 따라 다릅니다.

![Image](/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_1.png)

LLM은 데이터 익명화에서 일부 역할을 합니다. 텍스트 데이터에 마스크를 적용할 수 있지만 별도의 복잡성 없이는 모든 요구 사항, 특히 식별 해제와 관련된 요구 사항을 모두 충족시킬 수 없습니다.

<div class="content-ad"></div>

위에 제시된 정의는 나중에 이 용어들을 참조할 때 충분한 간략한 개요를 제공합니다. 주제를 더 깊게 파헤치지 않아도 됩니다. 많은 기사들이 이것을 자세히 다루고 있고, 나는 다른 기사 중 하나에서 이를 더 깊이 설명합니다.

# 민감한 데이터를 처리하는 데 인공 지능을 활용하는 것이 무엇이 특별한가요?

민감한 텍스트 데이터는 대용량 텍스트 필드와 문서에 간접적으로 포함될 수 있어 휴리스틱 기술을 사용해서 감지하기 어려울 수 있습니다. 이러한 기술과 방법들은 주로 미리 정의된 규칙과 패턴(예: 명명된 개체 인식)을 의존하므로 그 능력이 제한될 수 있습니다.

대부분의 경우 중요한 민감한 데이터는 문장 안에서 미묘하게 제시되지 않습니다. 메시징 애플리케이션, 고객 지원 서비스, 이메일 등에서 생성된 데이터는 전체 텍스트의 맥락 안에 민감한 데이터가 포함될 수 있습니다. 이러한 복잡한 상황은 데이터 마스커들이 구문 분석된 텍스트를 기억하고 맥락을 이해해야 한다는 것을 요구합니다. 그러면 휴리스틱 기술의 사용이 방해되어 모든 개인정보 보호 요구 사항을 충족시키기에 부적합하다고 판단됩니다.

<div class="content-ad"></div>

# 실습 안내 — LLM-Powered 데이터 식별기 구현

적절한 프롬프트를 제공하면 고급 LLM 모델은 훈련 데이터를 사용하여 문장 내의 민감한 데이터를 식별하고 가리는 데 성공할 수 있습니다. 이 예제에서는 Llama2 Model과 Azure의 GPT4 Model을 사용하여 데이터 민감도 식별기를 설정하는 방법을 시험해보겠습니다. LangChain 프레임워크를 사용하여 모델을 검색하고 프롬프트를 제공할 것입니다.

우리는 모델을 로드하고 응용 프로그램을 실행하는 데 사용할 환경을 설정하는 것부터 시작하겠습니다.

이를 위해 먼저 Python 3.8 이상이 설치되어 있는지 확인하세요.

<div class="content-ad"></div>

# Local LLM Setup

이 섹션에서는 데이터 민감도 감지를 위한 로컬 Llama2 모델을 준비하고 실행하는 데 필요한 단계를 나열합니다.

## 1. 도커를 사용하여 모델 서버 설정

LangChain과 통신할 수 있는 모델 서버를 설정하기 위해 도커를 사용할 것입니다. 모델을 로컬로 설정하는 다른 방법도 있으며, 여기에서 더 많은 정보를 찾을 수 있습니다.

<div class="content-ad"></div>

우선 도커가 설치되어 실행 중인지 확인한 후, 아래 명령을 실행하여 이미지를 다운로드하고 모델 서버를 설정하세요.

```js
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

서버가 작동 중인지 확인하려면 브라우저에서 http://localhost:11434 링크를 열면 "Ollama is running" 문구가 표시됩니다.

컨테이너가 실행되면 모델을 설치하세요. 다양한 모델을 테스트하고 싶다면 여기서 확인할 수 있는 목록을 확인해보세요.

<div class="content-ad"></div>

```js
도커 실행 -it 올라마 올라마 실행 llama2
```

설치가 완료되면 모델을 로드하고 Python 스크립트를 설정할 것입니다.

먼저 LangChain을 설치해 봅시다.

```js
pip install langchain
pip install langchain-community
```

<div class="content-ad"></div>

스크립트에서 필요한 패키지를 가져오세요.

```js
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
```

모델을 불러오세요.

```js
llm = Ollama(model="llama2")
```

<div class="content-ad"></div>

## 2. 프롬프트 작성

LLM이 이미 문장의 내장된 맥락을 이해할 수 있는 기능을 갖추고 있다고 생각할 때, 과제가 의도대로 실행되는 것을 보장하는 방식으로 프롬프트를 구성하는 것이 중요합니다.

예를 들어, 다음 사항을 LLM이 보장해야 합니다:

- 문맥을 이해하는 데 키워드 일치만 의존하지 않고 민감한 정보를 식별하는 능력
- * 데이터 보호 법과 규정 (GDPR, CCPA 등)을 준수하는 감지
- 모델이 정밀도와 재현율 사이의 균형을 유지
- 문장 구조가 변경되지 않고 감지된 섹션이 처리되는 것을 보장
- 추가적인 내용 없이 제공된 데이터만 반환되는 것을 보장

<div class="content-ad"></div>

```js
template = """
민감한 데이터 식별자 및 마스킹 기능이 있습니다. 
텍스트에서 민감한 정보를 식별하고 "****"를 사용하여 마스킹하는 기능이 가능합니다. 
민감한 데이터는 종종 명시적으로 언급되지 않을 수 있으며, 텍스트의 맥락에 내재될 수도 있습니다(예: 건강, 금융, 주소 등의 주제)
개인 식별 데이터가 감지되고 마스킹되도록 하십시오.
GDPR, CCPA 및 HIPA와 같은 데이터 보호 법률 및 규정을 고려하도록 하십시오.
입력 텍스트가 수정되거나 변경되지 않도록 하고 감지된 민감 정보만 마스킹하도록 하십시오.
마스킹한 정보에 대한 높은 신뢰도를 보장하십시오.
반환된 내용에는 필요한 마스킹이 적용된 입력 텍스트 이외의 내용이 포함되어서는 안 됩니다.
민감한 텍스트가 감지되지 않으면 추가 콘텐츠 없이 입력값을 그대로 반환하십시오.

문장:
{sentence}
"""

output_parser = StrOutputParser()

# 설정 구문
prompt = PromptTemplate.from_template(template)

# 체인 생성
chain = prompt | llm | output_parser
```

요청은 모델이 지시된대로 작업을 성공적으로 실행할 수 있도록 필요한 요구사항을 정의합니다. 국가에 따라 준수해야하는 특정 요구 사항에 대한 추가 매개 변수화가 가능합니다. 다음과 같은 것이 추가될 수 있습니다.

- 어떤 법률을 준수해야 하는지 명시하는 것은 국가에 따라 중요합니다.
- 민감한 데이터 마스킹 시 운영할 때의 신뢰도

첫 번째 예제를 실행해 봅시다.


<div class="content-ad"></div>

```js
sentence = """
지난 주, 여름 계획을 논의하는 동안,
마이크는 바칼리로의 솔로 여행을 드디어 떠날 것을 시사했어요
그는 보너스를 받은 후에 모아놓은 돈으로요.
그의 보너스로 1만 달러 이상을 받았어요
"""

# 감지 실행
response = chain.invoke({'sentence':sentence})

# 최종 응답 출력
print(response)
```

![이미지](/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_2.png)

Llama2 모델의 응답은 민감한 데이터를 식별하고 지시에 따라 가리는 능력이 있었습니다. 모든 이름이 가려지고, "보너스"와 그 금액도 가렸으므로, 해당 모델이 숫자가 민감한 금융 정보와 관련되어 있는 것을 감지할 수 있었음을 나타냅니다.

참고사항


<div class="content-ad"></div>

* 데이터 보호 법률과 규정이 정기적으로 업데이트되므로, 모델은 최신 버전에 액세스할 수 없습니다.

** 응용 프로그램은 제공된 법률 및 규정 문서의 특정 버전에서 실행되도록 RAG (검색 증강 생성)을 활용하도록 조정될 수 있습니다.

# Azure OpenAI 설정

Azure OpenAI의 GPT4 모델을 사용하려면 Azure OpenAI 서비스를 생성해야 합니다. Microsoft은 여기에서 리소스를 생성하는 단계에 대해 명확한 설명서를 제공합니다.

<div class="content-ad"></div>

리소스를 생성한 후에는 배포로 이동하여 기본 버전을 사용하여 gpt4 모델을 배포합니다.

![image](/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_3.png)

모델이 성공적으로 배포되면 API에 액세스하기 위해 사용된 Azure OpenAI 키를 검색하는 것을 잊지 마세요.

Azure OpenAI와 작업하기 위해 필요한 LangChain 패키지를 설치해봅시다.

<div class="content-ad"></div>

```js
pip install langchain-openai
```

로컬 설정을 구축할 때와 같은 단계를 따라가되, Azure OpenAI와 작업하기 위해 import 및 프롬프트 템플릿을 조정해야 합니다.

```js
import os
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 필요한 환경 변수 추가
os.environ["OPENAI_API_VERSION"] = <API VERSION>
os.environ["AZURE_OPENAI_API_KEY"] = <Your AZURE OPENAI KEY>
os.environ["AZURE_OPENAI_ENDPOINT"] = <Your AZURE  OPENAI ENDPOINT>

# 프롬프트 템플릿 정의
template = """
당신은 민감한 데이터 식별자 및 마스커입니다.
텍스트에서 민감한 정보를 식별하고 "****"를 사용하여 마스킹하는 능력이 있습니다.
민감한 데이터는 텍스트의 맥락 속에 내장될 수 있으며 항상 명시적으로 언급되지 않을 수도 있습니다(예: 건강, 재정, 주소와 관련된 주제 등).
개인 식별 가능 데이터가 감지되고 마스킹되었는지 확인하세요.
데이터 보호법과 규정(GDPR, CCPA, HIPA 등)을 고려해 감지가 이뤄지도록 하세요.
입력 텍스트가 변경되거나 수정되지 않고 감지된 민감한 정보만 마스킹되도록 하세요.
마스킹된 민감한 정보에 대해 높은 신뢰도를 보장하세요.
반환된 콘텐츠에 요구된 마스킹이 적용된 입력 텍스트 이외의 것이 포함되어서는 안 됩니다.
민감한 텍스트가 감지되지 않은 경우에는 추가 내용 없이 입력을 그대로 반환하세요.

문장:
{sentence}
"""

prompt = ChatPromptTemplate.from_template(template)

# 모델 선택
llm = AzureChatOpenAI(
    azure_deployment="gpt4",
)

# 체인 설정
chain = prompt | llm

sentence = """
지난주 여름 계획을 논의하던 중, 
마이크가 발리로의 단독 여행을 드디어 가기로 하는 듯하다는 신호를 주었어요.
보너스가 들어와서 이제 막 그 여행을 위해 돈 모았다고 하더라구요.
그는 1만 달러 이상의 보너스를 받았어요.
"""

# LLM 실행
response = chain.invoke({'sentence':sentence})

print(response.content)
```

<img src="/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_4.png" />


<div class="content-ad"></div>

3번의 테스트를 거친 후에도 출력 결과로 나온 것은 모델이 민감한 정보를 식별하고 필요한 곳에서 이를 가려 주었지만 문장의 내용을 변경하지 않았다는 것을 보여줬어요.

다른 예시를 사용해 봅시다:

```js
sentence = """
에마와의 통화 중, 그녀가 내년에 월 $3000으로 인상된 임대료 때문에 이사를 가겠다고 가벼운 말투로 언급했어. 그녀가 이 세부 정보를 비공개로 유지한 걸 알았어. 어떤 재정적 걱정 때문일 수도 있어.
"""
```

![AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_5.png 이미지](/assets/img/2024-06-23-AllYouNeedtoKnowaboutSensitiveDataHandlingUsingLargeLanguageModels_5.png)

<div class="content-ad"></div>

두 모델 모두 제공된 예시에서 민감한 데이터를 정확하게 식별할 수 있었습니다. 그러나 이 예시에는 상대적으로 짧은 텍스트만 포함되어 있었습니다. 보다 긴 텍스트는 특히 민감한 데이터가 보다 나중에 노출되는 경우에 결과에 더 큰 영향을 줄 수 있습니다. 모델이 숫자와 해당 문맥 간의 연결을 놓칠 수 있기 때문입니다.

다음 섹션에서는 휴리스틱과 LLMs를 모두 활용하는 민감도 감지의 고수준 하이브리드 솔루션 접근 방식을 논의할 것입니다.

# 고수준 솔루션 아키텍처

효율적이고 신뢰할 수 있는 민감한 데이터 식별 LLM 애플리케이션을 개발하는 것은 이미 중요한 이정표입니다. 그러나 이러한 애플리케이션을 데이터 아키텍처에 배치하는 것은 신중히 고려되어야 합니다. 대량 및 속도가 빠른 텍스트 데이터를 보유한 기업은 해결책이 비효율적이 되어 큰 비용과 노력을 필요로 할 수 있습니다.

<div class="content-ad"></div>

다이어그램은 각 단계에서 다양한 구성 요소에 의해 텍스트 데이터가 처리되는 방법을 단계별로 보여줍니다. 이를 통해 완전히 준수된 데이터 상태를 달성할 수 있습니다.

이러한 해결책을 구축할 때 고려해야 할 중요한 질문들:

- 사용 사례가 LLM을 배포하고 유지하는 과부하를 정당화하는가? 휴리스틱 기술이 충분한가?
- 시장에 사용 사례에 대한 기존 솔루션이 있는가?
- 데이터의 대기 시간과 가용성 요구 사항을 충족할 것인가?
- 데이터는 컨텍스트 내에서 중요 데이터를 포함하고 있는가?

# 결론

<div class="content-ad"></div>

기존 휴리스틱 접근 방식을 활용하면 민감한 데이터를 감지하는 데 도움이 될 수 있지만, 문장의 맥락 속에 간접적으로 나타나는 민감한 데이터를 표준 방법으로 감지하기 어려운 상황에서는 어려움이 있습니다. 큰 양의 텍스트를 이해하는 내재 기능을 갖춘 LLM(Large Language Models)은 민감한 데이터 감지 및 분류 문제에 대처하기 위한 차세대 도구로 기능할 수 있습니다.

본 문서에서는 LLM이 이 문제에 대해 대상화될 수 있는 예시를 보여주었습니다. 예시의 프롬프트는 LLM이 과업의 일반적 요구 사항을 충족할 수 있는 능력이 있음을 입증했습니다. 휴리스틱과 LLM 간의 혼합 접근 방식 도입은 데이터 솔루션 아키텍처에 보여진 것처럼 더 나은 결과를 보장하고 추가적인 안전장치를 제공할 수도 있습니다. 이 문서는 LLM을 사용하여 민감한 데이터를 처리하는 가능성에 대한 일부 조감도를 보여주었고, 일부 추가적인 사용 사례와 가능성은 다음과 같습니다:

- RAG를 위해 데이터 카탈로그 메타데이터 통합
- 민감도 수준에 대한 분류 도입
- 도메인별 민감한 데이터 지식 통합
- …

- 새 이야기를 게시할 때 알림을 받으려면 구독해주세요.
- LinkedIn에서 언제든지 연락 주세요.

<div class="content-ad"></div>

만약 민감한 데이터 처리에 대한 보다 자세한 아키텍처에 관심이 있다면 — 내 다른 기사들을 여기에서 확인해보세요.

# 참고 자료

유럽 의회 및 이사회 2016년 4월 27일 제 2016/679 규정 (일반 데이터 보호 규정) (EEA와 관련된 텍스트)에 관한 자연인의 보호에 대한 데이터 처리 및 그와 같은 데이터의 자유 이동의 처리 및 95/46/EC 지침의 폐지. General Data Protection Regulation (GDPR) — 공식 법적 텍스트 (gdpr-info.eu)에서 확인할 수 있습니다.

데이터 침해 비용 2023 IBM. 다음 위치에서 확인 가능: https://www.ibm.com/security/data-breach (2024년 3월 1일 열람).

<div class="content-ad"></div>

| Source | Title | Date |
|--------|-------|------|
| LangChain | [Website](https://www.langchain.com) | - |
| California Consumer Privacy Act (CCPA) | State of California — Department of Justice — Office of the Attorney General | March 13, 2024. [Link](https://oag.ca.gov/privacy/ccpa) |
| Taylor, P. | Data Growth Worldwide 2010–2025 | November 16, 2023. Statista [Link](https://www.statista.com/statistics/871513/worldwide-data-created/) |