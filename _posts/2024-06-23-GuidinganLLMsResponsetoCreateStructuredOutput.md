---
title: "LLM 출력 구조화하는 방법 안내"
description: ""
coverImage: "/assets/img/2024-06-23-GuidinganLLMsResponsetoCreateStructuredOutput_0.png"
date: 2024-06-23 19:40
ogImage: 
  url: /assets/img/2024-06-23-GuidinganLLMsResponsetoCreateStructuredOutput_0.png
tag: Tech
originalTitle: "Guiding an LLM’s Response to Create Structured Output"
link: "https://medium.com/towards-data-science/guiding-an-llms-response-to-create-structured-output-5dde0d3e426b"
---


![2024-06-23-GuidinganLLMsResponsetoCreateStructuredOutput_0.png](/assets/img/2024-06-23-GuidinganLLMsResponsetoCreateStructuredOutput_0.png)

이 기사는 Python에서 유효성 검사 라이브러리를 사용하여 GPT-4 또는 Llama 3와 같은 LLM 응답을 구조화하는 방법을 가르쳐줍니다.

JSON 형식에서 구조화된 정보를 추출해야 하는 필요성은 매우 중요한 주제이며, 이것은 데이터 마이닝 작업에서 정확한 정보를 비구조적 형식(예: 자유 텍스트)에서 추출하는 데 기본적입니다.

또한, LLM의 출력 토큰을 생성하는 과정에서 발생하는 확률적 특성으로 인해 GPT와 같은 상업용 시스템에서도 구조화된 응답 형식이 신뢰할 수 없습니다.

<div class="content-ad"></div>

우리는 유효성 검사와 스키마 모델링을 위해 Pydantic와 Instructor와 같은 여러 라이브러리를 사용할 것이고, LLM 부분에는 OpenAI와 ollama를 활용할 것입니다. 제안된 내용은 OpenAI나 Anthropic과 같은 폐쇄 소스 모델뿐만 아니라 Llama 3와 같은 오픈 소스 모델에 대해서도 유효합니다.

본 기사를 통해 아래 내용을 배울 수 있습니다:

- 데이터 모델을 정의하는 방법과 그것이 무엇인지
- LLM이 출력 형식을 준수하는지를 유효성 규칙을 통해 확인하는 방법
- Instructor와 Pydantic 라이브러리를 사용하는 방법

즐거운 독해 되세요!

<div class="content-ad"></div>

# 구조화된 출력이 필요한 이유

GPT-4와 같은 LLM은 특정 패턴을 따르지 않고도 상당한 가치를 제공할 수 있습니다. 하지만 데이터를 다루는 프로그래머들에게는 사용자의 의지에 따라 가능한 출력 패턴을 준수하는 것이 중요합니다.

GPT-3.5의 특정 버전부터 OpenAI는 완성 API에 response_format 매개변수를 추가했습니다. 이를 통해 사용자는 json_object와 같은 다른 키를 정의하여 모델을 입력한 프롬프트에 더 적합한 응답 방향으로 안내할 수 있습니다.

다음은 예시입니다:

<div class="content-ad"></div>

```python
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-3.5-turbo-0125",
  response_format={ "type": "json_object" },
  messages=[
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": "Who won the world series in 2020?"}
  ]
)
print(response.choices[0].message.content)

>>> "content": "{\"winner\": \"Los Angeles Dodgers\"}"
```

하지만 이러한 로직이 항상 작동하는 것은 아닙니다. 실제로 OpenAI의 문서에서는 GPT가 이를 생성하는 데 도움을 주기 위해 프롬프트에 "JSON"이라는 단어를 명확하게 작성할 것을 제안합니다. 이는 "response_format={ "type": "json_object" }"를 사용할 때 프롬프트 어딘가에 이를 작성해야만 하는 중요한 팁이기 때문에 강제적으로 작성해야 합니다.

## LLM이 일관된 JSON 출력을 생성하기 어려운 이유는 무엇인가요?

LLM은 입력 프롬프트가 주어졌을 때 이전 토큰 다음에 더 많이 나올 가능성이 있는 다음 토큰을 반환하는 기계로서의 역할을 합니다. 실제로 이러한 형식을 보고 이해하려면 모델이 훈련 단계에서 명시적으로 이러한 형식을 보고 이해하기 위해 안내받아야만 하므로 이러한 패턴을 "자연"에서 만나기 어렵습니다.


<div class="content-ad"></div>

최신 LLM의 JSON 모드는 출력이 특정 패턴과 일치한다고 보장하지 않습니다. 단지 유효하고 오류 없이 파싱된다는 것만을 보장합니다.

따라서 이러한 출력물 안에 무엇이 포함되어 있는지를 유효성 검사할 수 있고, 데이터 모델과 일치하지 않는 경우 예외와 오류를 발생시키는 것이 중요합니다.

# 사용 사례

우리는 GPT-4 또는 Llama3와 같은 LLM에 간단한 질문에서 시작하여 JSON에서 정보를 추출하는 예제를 살펴볼 것입니다.

<div class="content-ad"></div>

우리는 무엇이든 물어볼 수 있지만, 모델에게 시간이 지남에 따른 축구 월드컵 우승팀에 관한 질문을 하려고 합니다.

특히 우리는 다음을 추출하고 싶습니다.

- 결승 일자
- 대회의 개최 국가
- 우승 팀
- 최다 득점자

우리는 데이터의 정확성을 확인하는 것이 아니라, LLM의 문장 응답을 다음으로 보여줄 스키마에 맞추는 것에만 신경을 쓸 것입니다.

<div class="content-ad"></div>

이 기사에서는 이 예제를 살펴보고 다른 것들도 살펴볼 수 있을 것 같아요.

## 필수 종속성

이제 이 튜토리얼을 실행하기 위해 설치해야 할 종속성을 살펴봅시다.

당연히, 이미 활성화된 개발 환경이 있다고 가정하고 Pydantic, Instructor, OpenAI 클라이언트 및 ollama를 설치할 거예요.

<div class="content-ad"></div>

- Pydantic: 커뮤니티에서 널리 사용되는 데이터 모델 정의 및 유효성 검사 라이브러리로, 사용 편의성, 효율성 및 데이터 과학에서의 중요성으로 유명합니다.
- Instructor: LLMs와 작업하기 위해 특별히 제작된 Pydantic을 감싸는 래퍼로, 유효성 검사 로직을 생성할 수 있는 라이브러리입니다.
- OpenAI: GPT와 다른 OpenAI 모델에 쿼리를 요청하기 위한 유명한 클라이언트입니다.
- ollama: llama3와 같은 오픈 소스 LLM에 대한 매우 편리한 인터페이스입니다.

개발 환경에서는 다음 명령어를 사용하여 시작합니다.

```bash
pip install pydantic instructor openai ollama
```

오픈 소스 모델을 테스트하고자 하기 때문에 다음 단계는 ollama를 시스템 전역에 설치하는 것입니다. ollama의 설치 및 사용 방법은 이 특별한 기사에서 읽어보실 수 있습니다.

<div class="content-ad"></div>

이제 개발에 집중할 수 있겠네요.

## 데이터 모델 정의

데이터 모델은 데이터를 구조화하기 위해 따를 논리적인 패턴입니다. 데이터베이스의 테이블을 정의하는 것부터 입력 데이터를 유효성 검사하는 데까지 여러 맥락에서 사용됩니다.

아래 포스트에서 Pydantic을 활용한 데이터 과학과 머신러닝에서의 데이터 모델링에 대해 이미 약간 다룬 적이 있습니다 👇

<div class="content-ad"></div>

파이던틱 데이터 모델을 만들어 보면 좋겠어요:

```js
from pydantic import BaseModel, Field
from typing import List
import datetime

class SoccerData(BaseModel):
    date_of_final: datetime.date = Field(..., description="최종 이벤트 날짜")
    hosting_country: str = Field(..., description="대회를 개최하는 국가")
    winner: str = Field(..., description="최종 경기에서 우승한 축구팀")
    top_scorers: list = Field(
        ..., description="대회의 상위 3명 스코어러 목록"
    )

class SoccerDataset(BaseModel):
    reports: List[SoccerData] = []
```

이 스크립트에서는 Pydantic에서 BaseModel 및 Field 클래스를 가져와 데이터 모델을 만드는 작업을 시작합니다. 사실, 최종 결과가 가져야 할 구조를 만들고 있습니다.

Pydantic은 모델에 들어가는 데이터 유형을 선언해야 합니다. 예를 들어 datetime.date는 날짜 필드가 문자열이 아니라 날짜여야 함을 강제합니다. 동시에 top_scorers 필드는 반드시 목록이어야 하며, 그렇지 않으면 Pydantic이 유효성 검사 오류를 반환할 것입니다.

<div class="content-ad"></div>

마침내, 여러 인스턴스를 수집하는 데이터 모델을 만들었습니다. 이것은 SoccerData 모델의 모음을 수집하는 SoccerDataset이라고 합니다. 이 모델은 한 개 이상의 보고서가 있는지 확인하기 위해 강사에 의해 사용될 것입니다.

# 시스템 프롬프트 생성

매우 간단히, 모델이 수행해야 하는 작업을 영어로 적어봅시다. 예를 통해 결과의 의도와 구조를 강조하면서 설명합니다.

```js
system_prompt = """당신은 숙련된 스포츠 기자입니다. 특정 연도의 축구 월드컵에서 우승한 팀에 대한 작은 리포트를 작성할 것입니다. 대회 결승전 날짜, 대회 전체에서 상위 3 스코어러, 우승 팀, 그리고 대회를 주최한 국가를 보고합니다. 다음 필드를 포함하는 JSON 객체를 반환하세요: date_of_final, hosting_country, winner, top_scorers.\
 
만약 다수 연도가 입력되면, 보고서를 쉼표로 구분하세요.\
 
다음은 예시입니다.
 [
    {
        "date_of_final": "1966",
        "hosting_country": "England",
        "winner": "England",
        "top_scorers": ["Player A", "Player B", "Player C"]
    },
    {
        "date_of_final": ...
        "hosting_country": ...
        "winner": ...
        "top_scorers": ...
    },

]

다음 연도들에 대해 보고해야 할 것입니다:

 """
```

<div class="content-ad"></div>

시스템 프롬프트로 사용되며 단순히 쉼표로 구분된 연도를 전달할 수 있습니다.

# 강사 코드 생성

여기서는 Instructor를 사용하여 JSON 유효성 검사 및 구조화의 주요 로직을 만들 것입니다. 이를 통해 GPT를 API를 통해 호출하는 OpenAI에서 제공하는 인터페이스와 유사한 인터페이스를 사용합니다.

먼저 우리는 query_gpt라는 함수를 사용하여 OpenAI를 사용하여 프롬프트를 매개변수화할 것입니다.

<div class="content-ad"></div>

```js
from openai import OpenAI
import instructor

def query_gpt(prompt: str) -> list:
    client = instructor.from_openai(OpenAI(api_key="..."))
    resp = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=SoccerDataset,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
    )
    return resp.model_dump_json(indent=4)
```

OpenAI API 키를 새롭게 생성된 클라이언트에 전달하는 것을 잊지 말자. 우리는 GPT-3.5-Turbo를 사용하고, 응답 모델로 SoccerDataset을 전달할 것이다. 또한, 이 기사를 작성하는 시점에서 가장 강력한 모델인 "gpt-4o"를 사용할 수도 있다.

모든 것을 함께 조합하여 소프트웨어를 실행해 보자. 사용자 프롬프트로 입력할 내용으로 "2010, 2014 및 2018"년을 내용으로 전달하여 구조화된 보고서를 생성하고자 한다. 

```js
from openai import OpenAI
import instructor

from typing import List
from pydantic import BaseModel, Field
import datetime


class SoccerData(BaseModel):
    date_of_final: datetime.date = Field(..., description="최종 이벤트의 날짜")
    hosting_country: str = Field(..., description="대회를 주최하는 나라")
    winner: str = Field(..., description="최종 경기에서 승리한 축구팀")
    top_scorers: list = Field(
        ..., description="대회의 상위 3명의 득점수 리스트"
    )


class SoccerDataset(BaseModel):
    reports: List[SoccerData] = []


system_prompt = """당신은 전문 스포츠 기자입니다. 특정 연도의 축구 월드컵에서 승자를 작은 보고서로 작성해야 합니다.
대회 최종일, 대회의 전체 득점수 상위 3명, 우승 팀 및 대회를 개최하는 국가를 보고해야 합니다.
다음 필드를 포함한 JSON 객체를 반환하세요: date_of_final, hosting_country, winner, top_scorers.

쿼리가 유효하지 않은 경우 빈 보고서를 반환하세요.

여러 연도가 입력된 경우 보고서를 쉼표로 구분하세요.

예시입니다
[
    {
        "date_of_final": "1966",
        "hosting_country": "England",
        "winner": "England",
        "top_scorers": ["Player A", "Player B", "Player C"]
    },
    {
        "date_of_final": ...
        "hosting_country": ...
        "winner": ...
        "top_scorers": ...
    },

]

다음 보고가 필요한 연도입니다:

"""

def query_gpt(prompt: str) -> list:
    client = instructor.from_openai(OpenAI())
    resp = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=SoccerDataset,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
    )
    return resp.model_dump_json(indent=4)

if __name__ == "__main__":
  resp = query_llm("2010, 2014, 2018")
  print(resp)
```

<div class="content-ad"></div>

위 문구를 Markdown 형식으로 변환한 결과입니다:

```json
{
    "reports": [
        {
            "date_of_final": "2010-07-11",
            "hosting_country": "South Africa",
            "winner": "Spain",
            "top_scorers": [
                "Thomas Müller",
                "David Villa",
                "Wesley Sneijder"
            ]
        },
        {
            "date_of_final": "2014-07-13",
            "hosting_country": "Brazil",
            "winner": "Germany",
            "top_scorers": [
                "James Rodríguez",
                "Thomas Müller",
                "Neymar"
            ]
        },
        {
            "date_of_final": "2018-07-15",
            "hosting_country": "Russia",
            "winner": "France",
            "top_scorers": [
                "Harry Kane",
                "Antoine Griezmann",
                "Romelu Lukaku"
            ]
        }
    ]
}
```

멋지네요. GPT-3.5-Turbo가 우리의 지시를 완벽하게 따르고, Instructor가 데이터 모델과 일치하는 구조를 만들어내었습니다. 실제로 이 결과는 GPT와 같은 대형 언어 모델이 일반적으로 반환하는 문자열이 아니라, 파이썬 사전의 리스트입니다.

이제 이상한 입력을 넣어보려고 해봅시다.

<div class="content-ad"></div>

```js
if __name__ == "__main()":
      print(query_gpt("안녕, 어떻게 지내?"))

>>>
{
 "리포트": []
}
```

LLM은 시스템 프롬프트를 통해 잘못된 쿼리를 처리하는 방법을 요청했기 때문에 올바르게 비어있는 리포트를 반환합니다.

# Instructor와 함께 오픈 소스 템플릿 사용

Instructor를 사용하여 GPT를 어떻게 사용하여 구조화된 JSON 출력을 얻는지 알아보았습니다. 이제 llama3와 같은 오픈 소스 템플릿을 사용하는 방법을 살펴보겠습니다.

<div class="content-ad"></div>

새로운 함수인 query_llama을 생성해 봅시다.

```js
def query_llama(prompt: str) -> list:
    client = instructor.from_openai(
        OpenAI(
            base_url="http://localhost:11434/v1",
            api_key="ollama",  # 요청은 필요하지만 영향을 미치지 않습니다
        ),
        mode=instructor.Mode.JSON,
    )
    resp = client.chat.completions.create(
        model="llama3",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_model=SoccerDataset,
    )
    return resp.model_dump_json(indent=4)
```

GPT 코드와 약간의 차이가 있습니다. 함께 살펴보겠습니다.

- ollama는 GPT와 동일한 인터페이스를 통해 호출되지만, 기본 URL 포인터(base_url) 및 필수적이지만 올바른 작동에 필요하지 않은 API 키를 변경합니다(왜냐면 모르겠어요)
- JSON 모드를 mode 매개변수를 통해 설명해야 합니다.
새로운 함수를 실행해 봅시다.

<div class="content-ad"></div>

함수를 실행해 봅시다.

```js
if __name__ == "__main__":
    print(query_llama("2010, 2014, 2018"))
```

그리고 여기에 결과가 있습니다:

```js
{
    "reports": [
        {
            "date_of_final": "2010-07-11",
            "hosting_country": "South Africa",
            "winner": "Spain",
            "top_scorers": [
                "Thomas Müller",
                "Wolfram Toloi",
                "Landon Donovan"
            ]
        },
        {
            "date_of_final": "2014-07-13",
            "hosting_country": "Brazil",
            "winner": "Germany",
            "top_scorers": [
                "James Rodríguez",
                "Miroslav Klose",
                "Thomas Müller"
            ]
        },
        {
            "date_of_final": "2018-07-15",
            "hosting_country": "Russia",
            "winner": "France",
            "top_scorers": [
                "Harry Kane",
                "Kylian Mbappé",
                "Antoine Griezmann"
            ]
        }
    ]
}
```

<div class="content-ad"></div>

우리는 올바른 JSON이 있는 목록을 가지고 있어요! 이 모든 것은 Llama 3로 로컬에서 이루어져요.

이전에 말한대로, 유효성 검사는 구조를 기반으로 하고 있어요. 실제로, 이 내용은 GPT에서 생성된 내용과 다를 수 있어요.

어떻게 마커들이 다른지 살펴봅시다. 아마도 우리가 받고 싶은 마커들을 명확히 지정하면 올바른 목록을 얻을 수도 있겠죠.

# 결론

<div class="content-ad"></div>

Pydantic, Instructors, 그리고 ollama를 사용하여 LLM의 출력을 JSON과 같은 구조화된 형식으로 변환하는 방법을 살펴봤습니다.

이 과정에서 모델이 실제로 지도되므로 결정론적이지 않습니다. JSON이 LLM의 결정론적이지 않은 성질로 인해 준수되지 않을 수 있는 경우가 있을 것입니다.