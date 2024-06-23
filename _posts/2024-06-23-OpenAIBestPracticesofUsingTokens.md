---
title: "OpenAI  토큰을 사용하는 최고의 방법"
description: ""
coverImage: "/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_0.png"
date: 2024-06-23 18:58
ogImage: 
  url: /assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_0.png
tag: Tech
originalTitle: "OpenAI — Best Practices of Using Tokens"
link: "https://medium.com/@tonylixu/openai-best-practices-of-using-tokens-6709e1df6cc5"
---


<img src="/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_0.png" />

# 오픈AI 토큰이란

오픈AI의 고급 언어 모델인 GPT-3.5 및 GPT-4와 같은 분야에서 "토큰"이란 텍스트에서 함께 자주 나타나는 문자 시퀀스를 가리킵니다. 이러한 모델은 이러한 토큰 간의 통계적 관계를 이해하고 예측하는 데 설계되어 있습니다.

텍스트를 토큰으로 분해하는 프로세스는 다른 모델 간에 다를 수 있습니다. 예를 들어, GPT-3.5와 GPT-4는 이전 모델과 달리 다른 토큰화 프로세스를 사용하여 입력 텍스트에 대해 다른 토큰을 생성합니다.

<div class="content-ad"></div>

일반적으로 한 토큰은 영어 텍스트의 네 문자에 해당하는 양으로, 대략 세 분의 삼분의 이 하나의 단어와 거의 비슷합니다. 따라서, 100개의 토큰은 대략 75단어에 해당합니다.

예를 들어, "OpenAI is great!"이라는 문장을 생각해 봅시다. 이 문장에서 토큰은 다음과 같이 분리될 수 있습니다:

[“Open”, “AI”, “ is”, “ great”, “!”]

![이미지](/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_1.png)

<div class="content-ad"></div>

여기 각각이 토큰으로 간주됩니다. 모델에서 사용하는 구체적인 토큰화 프로세스에 따라 정확한 분할이 다를 수 있습니다. 예를 들어, 일부 모델은 "OpenAI"를 하나의 토큰으로 처리할 수 있지만, 다른 모델은 "Open"과 "AI"로 분할할 수도 있습니다. 마찬가지로, 공백과 구두점은 종종 별도의 토큰으로 처리됩니다. 그래서 이 예시에서는 다섯 개의 토큰이 있습니다: "Open", "AI", " is", " great", 그리고 "!".

토큰 길이 개념을 이해하기 위한 유용한 가이드라인을 제시해드리겠습니다:

- 1 토큰은 대략 영어로 4자와 동일합니다.
- 1 토큰은 대략 단어의 3/4에 해당합니다.
- 100 토큰은 약 75단어에 해당합니다.

또는,

<div class="content-ad"></div>

# 토큰 인코딩

토큰 인코딩은 자연어 처리(NLP) 및 기계 학습에서 중요한 단계입니다. 이는 기계가 이해하고 작업할 수 있는 형식인 고정 차원의 수치 벡터로 변환하는 과정입니다.

다른 토큰 인코딩은 서로 다른 모델에 연결되어 있으므로 텍스트를 토큰으로 변환할 때 어떤 모델을 사용할 지 고려해야 합니다.

<div class="content-ad"></div>

주어진 텍스트 문자열 (예: "OpenAI is great!")과 인코딩 (예: "cl100k_base")으로 토크나이저가 텍스트 문자열을 토큰 목록으로 분할할 수 있습니다 (예: ["Open", "AI", " is", " great", "!"]).

다음 표는 토큰 인코딩 방법과 OpenAI 모델 간의 매핑을 보여줍니다:


| 토큰 인코딩 방법 | OpenAI 모델 |
|------------------|-------------|
| cl100k_base      | 모델 1      |
| cl200k_base      | 모델 2      |
| cl500k_base      | 모델 3      |


# 토큰화

<div class="content-ad"></div>

OpenAI의 맥락에서 토큰화는 텍스트를 더 작은 조각, 즉 토큰으로 분리하는 방법입니다. 이 토큰들은 텍스트에서 함께 자주 나타나는 문자 시퀀스로, OpenAI의 대형 언어 모델인 GPT-3.5 및 GPT-4 등에서 사용되어 텍스트를 처리하고 이해하는 데 활용됩니다.

Tiktoken은 OpenAI가 만든 기반 Python 도구입니다. 이 도구는 주로 OpenAI의 GPT-4와 같은 모델과 함께 작동하도록 설계된 빠른 바이트 페어 인코딩 (BPE) 토크나이저입니다. Tiktoken의 주요 기능은 텍스트를 더 작은 조각으로 나누어 모델이 텍스트를 처리하고 이해할 수 있도록 하는 것입니다.

오픈 소스 도구인 Tiktoken은 pip install tiktoken 명령을 사용하여 PyPI에서 쉽게 설치할 수 있습니다. 또한 JavaScript 환경에서 사용할 수 있는 커뮤니티 지원 버전도 있습니다.

Tiktoken의 주요 기능 중 하나는 교육용 하위 모듈인데, 이 모듈은 BPE의 작동 방식을 이해하고 사용자가 토큰화 프로세스를 시각화할 수 있도록 도와줍니다. 또한 Tiktoken은 유연하며 새로운 인코딩 지원을 추가할 수 있도록 사용자에게 허용합니다.

<div class="content-ad"></div>

예제 하나가 이렇게 보일 거예요:

```python
import tiktoken

encoding = tiktoken.get_encoding("cl100k_base")
# 특정 모델 이름에 해당하는 올바른 인코딩을 자동으로 로드하기 위해
encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")

print(encoding.encode("OpenAI is great!"))
```

출력은 이렇게 보일 거예요:

```python
[5109, 15836, 374, 2294, 0]
```

<div class="content-ad"></div>

토큰을 세는 방법은 .encode()로 반환된 리스트의 길이를 세면 됩니다.

# 토큰 한도

요청에 사용할 수 있는 토큰의 최대 수는 선택한 모델에 따라 다르며, 입력 프롬프트 및 생성된 출력(gpt-3.5-turbo)에 대한 4096개의 토큰이라는 결합한 한도가 있습니다. 따라서, 입력에 4000개의 토큰을 할당하면 출력에는 최대 96개의 토큰이 남게 됩니다.

이 제약은 주로 기술적인 이유로 인해 발생합니다. 그러나, 입력을 더 간결하게 요약하거나 콘텐츠를 더 작은 세그먼트로 나누는 등 이러한 제한 내에서 효과적으로 작업하는 다양한 전략이 존재합니다.

<div class="content-ad"></div>

GPT4의 토큰 한도

![Image](/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_3.png)

더 많은 정보를 알고 싶다면 openai의 공식 웹사이트를 방문해보세요: [여기를 클릭하세요](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo)

# 토큰 가격 설정

<div class="content-ad"></div>

OpenAI API는 다양한 모델 유형을 제공하며 각 모델은 다른 가격 수준에서 사용할 수 있습니다. 이러한 모델들은 능력이 다양하며 가장 진보된 것은 다빈치이고, 가장 빠른 것은 에이다입니다. 요청을 만드는 데 드는 비용은 이러한 모델에 따라 달라집니다.

예를 들어, GPT-4 Turbo 모델의 경우, 입력 기준으로 $0.01/1K 토큰, 출력 기준으로 $0.03/1K 토큰이 듭니다.

표:

![OpenAI 모델 비용](/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_4.png)

그리고 OpenAI에 따르면:

<div class="content-ad"></div>

Cobus Greyling님은 OpenAI 토큰 비용에 대한 멋진 차트를 보유하고 계시네요:

![OpenAI Token Cost Chart](/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_5.png)

# 가격 계산기

다음 "OpenAI 및 다른 LLM API 가격 계산기"를 활용하여 계산을 할 수 있습니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-23-OpenAIBestPracticesofUsingTokens_6.png)

위는 1000개의 입력 단어, 500개의 출력 단어 및 100회의 API 호출에 대한 총 비용을 보여줍니다.

# Best Practices

OpenAI 토큰을 사용할 때는 최적의 방법을 채택하여 효율성을 극대화하고 비용을 최소화하며 OpenAI의 API와의 상호 작용을 효과적이고 안전하게 보장할 수 있습니다. 다음은 추천하는 최상의 방법론입니다:


<div class="content-ad"></div>

## 토큰 이코노믹스 이해하기

사용하는 맥락에서 어떻게 토큰이 계산되는지, 그리고 토큰을 구성하는 것이 무엇인지 이해하세요. 다양한 입력 길이에 대한 대략적인 토큰 수를 알면 사용량과 비용을 보다 정확하게 추정하는 데 도움이 됩니다.

## 프롬프트 디자인 최적화

모델이 원하는 출력 생성 방향으로 이끌 수 있도록 프롬프트를 간결하면서도 충분히 구체적으로 디자인하세요. 이 균형을 유지하면 사용된 토큰 수를 줄이고 유용한 응답을 받을 확률을 높일 수 있습니다.

<div class="content-ad"></div>

## 효율적인 토큰 관리 활용하기

예상치 못한 비용을 피하기 위해 토큰 사용량을 추적하세요. 플랫폼이나 응용 프로그램에서 지원한다면 알림이나 제한을 구현하여 소비량을 모니터링하세요.

## 가능한 경우 일괄 요청 처리하기

사용 사례가 허용한다면 일괄 처리는 한 번에 한 요청을 처리하는 것보다 더 효율적일 수 있습니다. 이 방법은 비용 절감에도 도움이 될 수 있습니다.

<div class="content-ad"></div>

## 작업에 적합한 모델 활용하기

작업에 가장 적합한 모델을 선택하세요. Davinci와 같이 큰 모델은 더 강력하지만, Ada나 Babbage와 같은 작은 모델은 깊은 이해나 창의력이 필요하지 않은 작업에 대해 더 비용 효율적일 수 있어서 토큰을 절약할 수 있습니다.

## 빈번한 요청에 대한 캐싱 구현하기

응용 프로그램이 동일하거나 유사한 프롬프트로 반복적인 요청을 수행하는 경우, 응답을 캐싱하여 토큰을 절약할 수 있습니다. 캐시가 안전하게 관리되고 개인정보 및 데이터 보호 요구 사항을 준수하는지 확인하세요.

<div class="content-ad"></div>

## API 키 보호하기

OpenAI API 키를 안전하게 보호하여 무단 사용을 방지하고, 토큰 낭비 및 예상치 못한 요금 부과를 방지하세요. 접근 제어를 구현하고 정기적으로 키를 변경하세요.