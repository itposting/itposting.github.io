---
title: "LLM 애플리케이션 구축 LLM 서빙하기 파트 9"
description: ""
coverImage: "/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_0.png"
date: 2024-05-27 14:36
ogImage:
  url: /assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_0.png
tag: Tech
originalTitle: "Building LLM Applications: Serving LLMs (Part 9)"
link: "https://medium.com/@vipra_singh/building-llm-applications-serving-llms-part-9-68baa19cef79"
---

대용량 언어 모델 (LLM)을 검색 보강 생성 (RAG) 애플리케이션을 통해 배워보세요.

# 이 시리즈의 포스트

- 소개
- 데이터 준비
- 문장 변환기
- 벡터 데이터베이스
- 검색 및 검색
- LLM
- 오픈 소스 RAG
- 평가
- LLM 제공 (현재 글)
- 고급 RAG

# 목차

<div class="content-ad"></div>

- LLM 로컬에서 실행하기
  - 오픈소스 LLM
- 효율적으로 LLM 로드하기
  - HuggingFace
  - LangChain
  - Llama.cpp
  - Llamafile
  - Ollama
  - GPT4ALL
  - Sharding
  - Bitsandbytes로 양자화하기
  - Pre-Quantization (GPTQ vs. AWQ vs. GGUF)
- 추론 최적화
- LLM 추론 이해하기
  - 입력 사전 채우기 단계 또는 입력 처리
  - 디코드 단계 또는 출력 생성
  - 요청 배치
  - 지속적인 배치
  - PagedAttention: 메모리 중심 솔루션
  - Key-value 캐싱
    - LLM 메모리 요구사항
- 모델 병렬화로 LLM 확장하기
  - 파이프라인 병렬화
  - 텐서 병렬화
  - 시퀀스 병렬화
- 어텐션 메커니즘 최적화
  - 멀티 헤드 어텐션
  - 멀티 쿼리 어텐션
  - 그룹화된 쿼리 어텐션
  - 플래시 어텐션
  - 페이징과 함께 Key-value 캐시 효율적 관리
- 모델 최적화 기술
  - 양자화
  - 희소성
  - 교육
- 모델 서빙 기술
  - 인-플라이트 배치
  - 추론 예측
- LLM 서빙을 위한 중요한 메트릭
- LLM를 서빙하기 위해 필요한 것
  - 엔진
  - 서버
  - 기능
- LLM 서빙을 위한 프레임워크
  - vLLM
  - 텍스트 생성 추론
  - CTranslate2
  - DeepSpeed-MII
  - OpenLLM
  - Ray Serve
  - MLC LLM
- 결론
- 크레딧

LLM 서빙은 대형 언어 모델 (LLM)을 배포하고 실행하여 사용자 요청을 처리하는 프로세스를 말합니다. 오프라인에서 일반적으로 훈련된 LLM을 가져와 실시간으로 쿼리에 응답할 수 있도록 설정하는 작업을 포함합니다.

LLM 서빙이 무엇을 포함하는지 살펴보겠습니다:

- 효율적인 처리: LLM은 계산 비용이 많이 소요되므로 여러 사용자 요청을 배치하여 자원 활용을 최적화하고 응답 시간을 단축하는 등의 서빙 기술이 사용됩니다.
- 모델 배포: LLM 모델은 처리 요구 사항을 처리할 수 있는 서버나 클라우드 플랫폼에 배포됩니다.
- API 생성: 사용자가 LLM과 상호작용하고 쿼리를 보낼 수 있도록 응용 프로그램 프로그래밍 인터페이스 (API)가 생성됩니다.
- 인프라 관리: 서빙 시스템은 다수의 사용자를 처리하고 지속적인 운영을 보장하기 위해 확장 가능하고 신뢰할 수 있어야 합니다.

<div class="content-ad"></div>


![Building LLM Applications Serving LLMs Part 9 on 27th May 2024](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_0.png)

다양한 LLM 서빙 프레임워크가 있습니다. 각각의 장점에 대해 자세히 논의해봅시다.

# 1. 로컬 LLM 실행

PrivateGPT, llama.cpp, Ollama, GPT4All, llamafile 등 프로젝트의 인기는 로컬에서 LLM을 실행하는 수요를 보여줍니다.


<div class="content-ad"></div>

최소 두 가지 중요한 이점이 있습니다:

- **개인 정보 보호**: 우리의 데이터가 제3자에게 전송되거나 상업 서비스의 이용 약관에 따르지 않습니다.
- **비용**: 추론 수수료가 없으며, 이는 토큰 집약적인 응용 프로그램(예: 오랜 시뮬레이션, 요약)에 중요합니다.

로컬 LLM 실행을 위해 몇 가지가 필요합니다:

- **오픈 소스 LLM**: 자유롭게 수정하고 공유할 수 있는 오픈 소스 LLM
- **추론**: 우리의 장치에서 이 LLM을 실행할 수 있는 능력 및 적절한 지연 시간

<div class="content-ad"></div>

## 1.1. 오픈 소스 LLMs

이제 사용자들은 빠르게 성장하는 오픈 소스 LLMs 세트에 접근할 수 있습니다.

적어도 두 가지 차원에서 이 LLMs를 평가할 수 있습니다 (도표 참조):

- 베이스 모델: 베이스 모델은 무엇이며 어떻게 훈련되었습니까?
- 파인 튜닝 접근: 베이스 모델이 파인 튜닝되었는지, 그렇다면 어떤 지침 세트를 사용했는지는 무엇인가요?

<div class="content-ad"></div>

"아래의 모델들의 상대 성능은 여러 리더보드를 통해 평가할 수 있습니다:

- LmSys
- GPT4All
- HuggingFace

이를 지원하기 위해 몇 가지 프레임워크가 등장했습니다."

<div class="content-ad"></div>

- llama.cpp: 가중치 최적화 및 양자화가 구현된 llama 추론 코드의 C++ 버전
- gpt4all: 추론을 위한 최적화된 C 백엔드
- Ollama: 모델 가중치와 환경을 앱으로 번들하여 장치에서 실행하고 LLM을 제공하는 앱
- llamafile: 모델 가중치 및 모델을 실행하는 데 필요한 모든 것을 하나의 파일로 번들링하여 추가 설치 단계없이 파일에서 LLM을 로컬로 실행할 수 있게 함

일반적으로 이러한 프레임워크는 몇 가지 작업을 수행합니다:

- 양자화: 원시 모델 가중치의 메모리 풋프린트를 줄임
- 추론을 위한 효율적인 구현: 소비자 하드웨어(예: CPU 또는 노트북 GPU)에서 추론을 지원

특히, 양자화의 중요성에 대해 이 훌륭한 게시물을 참조해보세요.

<div class="content-ad"></div>


![LLM in memory](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_2.png)

더 낮은 정밀도로 LLM을 저장하기 위해 필요한 메모리를 극적으로 줄일 수 있습니다.

또한 GPU 메모리 대역폭 시트의 중요성을 확인할 수 있습니다!

큰 GPU 메모리 대역폭으로 인해 Mac M2 Max는 추론시 M1보다 5~6배 빠릅니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_3.png" />

아래에서 자세히 이야기해 봅시다.

# 2. 효율적인 LLM로딩

이제 몇 가지 (양자화) 표준을 통해 로컬 LLM을 어떻게로드할지 살펴보겠습니다. 샤딩, 양자화 및 다양한 저장 및 압축 전략을 사용하면 어떤 방법이 적합한지 알기 쉽지 않습니다.

<div class="content-ad"></div>

예제에서는 Direct Preference Optimization (DPO)으로 훈련된 Mistral 7B의 세부 조정된 변형인 Zephyr 7B를 사용합니다.

🔥 팁: 각 LLM을 로드한 후 노트북을 다시 시작하여 OutOfMemory 오류를 방지하는 것이 좋습니다. 여러 LLM을 로드하는 것에는 상당한 RAM/VRAM이 필요합니다. 다음과 같이 모델을 삭제하고 캐시를 재설정하여 메모리를 재설정할 수 있습니다:

```js
# 이전에 생성된 모델이 있다면 삭제합니다
del model, tokenizer, pipe
```

```js
# VRAM 캐시를 비웁니다
import torch
torch.cuda.empty_cache()
```

<div class="content-ad"></div>

## 2.1. HuggingFace

LLM을 로드하는 가장 간단하고 베이닐라한 방법은 🤗 Transformers를 통해하는 것입니다. HuggingFace는 LLM을 통해 놀라운 일을 할 수 있는 다양한 패키지를 제공했습니다!

우리는 새로운 모델을 지원하기 위해 주요 브랜치에서 HuggingFace를 설치하는 것으로 시작할 것입니다:

```js
# Latest HF transformers version for Mistral-like models
!pip install git+https://github.com/huggingface/transformers.git
!pip install accelerate bitsandbytes xformers
```

<div class="content-ad"></div>

설치 후에는 다음 파이프라인을 사용하여 LLM을 쉽게 로드할 수 있습니다:

```js
from torch import bfloat16
from transformers import pipeline
```

```js
# 압축 기법을 사용하지 않고 LLM로드
pipe = pipeline(
    "text-generation",
    model="HuggingFaceH4/zephyr-7b-beta",
    torch_dtype=bfloat16,
    device_map="auto"
)
```

LLM을 이 방법으로 로드하면 일반적으로 VRAM을 저장하거나 효율성을 높이기 위해 압축 기법을 사용하지 않습니다.

<div class="content-ad"></div>

우리의 프롬프트를 생성하려면 먼저 필요한 템플릿을 만들어야 합니다. 다행히도, 채팅 템플릿이 하부 토크나이저에 저장되어 있다면, 이 작업은 자동으로 수행할 수 있습니다.

```js
# 토크나이저의 채팅 템플릿을 사용하여 각 메시지 형식 설정
# https://huggingface.co/docs/transformers/main/en/chat_templating 참조
messages = [
    {
        "role": "system",
        "content": "You are a friendly chatbot.",
    },
    {
        "role": "user",
        "content": "Tell me a funny joke about Large Language Models."
    },
]
prompt = pipe.tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)
```

내부 프롬프트 템플릿을 사용하여 생성된 프롬프트는 다음과 같이 구성됩니다:

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_4.png)

<div class="content-ad"></div>

다음으로, 우리는 답변을 생성하기 위해 LLM에 프롬프트를 전달할 수 있습니다:

```js
outputs = pipe(prompt, (max_new_tokens = 256), (do_sample = True), (temperature = 0.1), (top_p = 0.95));
print(outputs[0]["generated_text"]);
```

이렇게 하면 다음 출력이 생성됩니다:

네트워크를 확장하고 어휘를 풍부하게 만들어 봅시다!

<div class="content-ad"></div>

웃음 포인트가 조금 유치할 수도 있지만, LLMs는 어휘력을 향상시키기 위해 다른 모델과 네트워킹하는 데 관심이 많아요. 그래서 이 농담은 그들에게 안성맞춤이에요!

순수 추론에 대해 말하자면, 이 방법은 일반적으로 전체 모델을 압축이나 양자화 전략 없이 로드하기 때문에 가장 효율성이 떨어집니다.

그러나 모델을 쉽게 로드하고 사용할 수 있어서 시작하기에 좋은 방법이에요!

## 2.2. LangChain

<div class="content-ad"></div>

다른 방법으로 LLM을 로컬에서 실행하는 방법은 LangChain을 사용하는 것입니다. LangChain은 AI 애플리케이션을 구축하기 위한 Python 프레임워크입니다. 지원하는 모델 중 하나 위에 AI 애플리케이션을 개발하기 위한 추상화와 미들웨어를 제공합니다. 예를 들어, 다음 코드는 microsoft/DialoGPT-medium 모델에 한 가지 질문을 하는 방법을 보여줍니다:

```js
from langchain.llms.huggingface_pipeline import HuggingFacePipeline

hf = HuggingFacePipeline.from_model_id(
    model_id="microsoft/DialoGPT-medium", task="text-generation", pipeline_kwargs={"max_new_tokens": 200, "pad_token_id": 50256},
)
from langchain.prompts import PromptTemplate

template = """Question: {question}
Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)

chain = prompt | hf

question = "What is electroencephalography?"

print(chain.invoke({"question": question}))
```

LangChain의 장점:

- 모델 관리가 쉬움
- AI 애플리케이션 개발에 유용한 유틸리티

<div class="content-ad"></div>

LangChain의 단점:

- 속도가 제한적이며 Transformer와 동일합니다.
- 여전히 애플리케이션의 로직을 코딩하거나 적절한 UI를 생성해야 합니다.

## 2.3. Llama.cpp

Llama.cpp은 LLM을 위한 C 및 C++ 기반 추론 엔진으로, Apple 실리콘에 최적화되어 있으며 Meta의 Llama2 모델을 실행합니다.

<div class="content-ad"></div>

한 번 저장소를 복제하고 프로젝트를 빌드한 후에는 다음 명령어를 사용하여 모델을 실행할 수 있습니다:

```js
$ ./main -m /path/to/model-file.gguf -p "Hi there!"
```

Llama.cpp의 장점:

- Python 기반 솔루션보다 높은 성능을 제공합니다.
- Llama 7B와 같은 대규모 모델을 중소 규모의 하드웨어에서 지원합니다.
- Llama.cpp를 통해 추론을 실행하면 다른 언어로 AI 애플리케이션을 빌드할 수 있는 바인딩을 제공합니다.

<div class="content-ad"></div>


Llama.cpp 단점:

- 제한된 모델 지원
- 도구 빌딩 필요

## 2.4. Llamafile

Llamafile은 Mozilla에서 개발한 LLMs를 실행하는 사용자 친화적인 대체 옵션을 제공합니다. Llamafile은 휴대성과 단일 파일 실행 파일을 생성할 수 있는 능력으로 유명합니다.


<div class="content-ad"></div>

llamafile을 다운로드하고 GGUF 형식의 모델을 얻으면 다음과 같이 로컬 브라우저 세션을 시작할 수 있습니다:

```js
$ ./llamafile -m /path/to/model.gguf
```

Llamafile의 장점:

- Llama.cpp와 동일한 속도 혜택
- 모델이 포함된 단일 실행 파일을 빌드할 수 있음

<div class="content-ad"></div>

세요. 팀 내 프로젝트를 관리할 때 표 형식을 사용할 수 있는 간단한 방법입니다.

| Llamafile 단점                                                                   |
| -------------------------------------------------------------------------------- |
| - 프로젝트가 여전히 초기 단계에 있음                                             |
| - 모든 모델이 지원되는 것은 아니며, Llama.cpp에서 지원하는 것만 사용 가능합니다. |

## 2.5. Ollama

Ollama는 Llama.cpp 및 Llamafile의 사용자 친화적인 대안입니다. 설치 가능한 실행 파일을 다운로드하여 컴퓨터에 서비스를 설치합니다. 설치한 후 터미널을 열어 다음을 실행하세요:

<div class="content-ad"></div>


$ ollama run llama2


Ollama는 모델을 다운로드하고 대화형 세션을 시작합니다.

Ollama 장점:

- 쉽게 설치하고 사용할 수 있습니다.
- Llama 및 vicuña 모델을 실행할 수 있습니다.
- 속도가 정말 빠릅니다.



<div class="content-ad"></div>

Ollama 단점:

- 모델 라이브러리가 제한적입니다.
- Ollama이 모델을 직접 관리하여 사용자 고유의 모델을 재사용할 수 없습니다.
- LLM을 실행하기 위한 튜닝 가능한 옵션이 없습니다.
- Windows 버전이 없습니다. (아직)

## 2.6. GPT4ALL

GPT4ALL은 직관적인 GUI를 갖춘 쉬운 데스크톱 애플리케이션입니다. 로컬 모델 실행을 지원하며 OpenAI와 API 키를 통한 연결을 제공합니다. 로컬 문서 처리를 위한 능력으로 개인 정보 보호를 보장하는 것이 특징입니다.

<div class="content-ad"></div>



![Image](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_5.png)

Pros:

- Polished alternative with a friendly UI
- Supports a range of curated models

Cons:



<div class="content-ad"></div>

- 모델 선택이 제한적입니다.
- 일부 모델은 상업적 이용 제한이 있을 수 있습니다.

## 2.7. 샤딩

양자화 전략을 살펴보기 전에 필요한 VRAM을 줄이는 데 사용할 수 있는 또 다른 꼼수가 있습니다. 샤딩을 사용하면 모델을 작은 조각이나 샤드로 나누어서 나타냅니다.

각 샤드는 모델의 작은 부분을 포함하며 GPU 메모리 제약을 극복하기 위해 모델 가중치를 서로 다른 장치에 분산시켜줍니다.

<div class="content-ad"></div>

기억나시나요? 이전에 압축 트릭을 사용하지 않았다고 말했던 것을요?

조금은 사실이 아니었죠...

로드한 모델, Zephyr-7B-β, 이미 샤딩(sharded)되어 있었어요! 모델에 들어가서 "파일 및 버전" 링크를 클릭하면 8개 조각으로 나누어졌음을 볼 수 있어요.

![image](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_6.png)

<div class="content-ad"></div>

우리가 직접 모델을 샤딩할 수 있지만, 일반적으로 양자화된 모델을 찾거나 직접 양자화하는 것이 좋습니다.

가속 패키지를 사용하여 쉽게 샤딩할 수 있습니다:

```js
from accelerate import Accelerator
```

```js
# 모델을 1GB 크기의 조각들로 나눕니다.
accelerator = Accelerator()
accelerator.save_model(
    model=pipe.model,
    save_directory="/content/model",
    max_shard_size="4GB"
)
```

<div class="content-ad"></div>

그게 다야! 우리가 모델을 2GB 대신 4GB 크기 조각으로 샤딩했기 때문에 더 적은 파일을 로드하기 위해 작성했습니다:

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_7.png)

## 2.8. 비트와 바이트로 양자화하기

LLM은 일련의 가중치와 활성화로 표현됩니다. 이러한 값들은 일반적으로 표준 32비트 부동 소수점(float32) 데이터 유형으로 표시됩니다.

<div class="content-ad"></div>

비트 수는 표현할 수 있는 값의 개수에 관해 알려줍니다. Float32는 1.18e-38부터 3.4e38까지의 값을 표현할 수 있어서 꽤 많은 값들을 표현할 수 있어요! 비트 수가 낮을수록 표현할 수 있는 값의 수가 적어집니다.

작은 비트 크기를 선택하면 모델이 덜 정확해지겠죠. 하지만 더 적은 값들을 표현해야 하므로 모델의 크기와 메모리 요구량이 줄어들게 됩니다.

양자화는 원래의 Float32 표현에서 더 작은 형태로 변환하는 것을 의미합니다. 하지만 우리는 그냥 더 작은 비트 변형을 사용하고 싶은 게 아니에요. 더 큰 비트 표현을 너무 많은 정보를 잃지 않고 해당가능 한 작은 비트에 매핑하고 싶어하는 겁니다.

실제로는 이를 자주 볼 수 있는데요. 새로운 형식인 NF4(4비트-정규 부동소수점)라고 불리는 새로운 형식으로 많이 사용되는 것을 볼 수 있습니다. 이 데이터 유형은 대형 비트 데이터 타입을 효율적으로 표현하기 위해 몇 가지 특별한 기교를 사용합니다. 세 가지 단계로 구성됩니다:

<div class="content-ad"></div>

- 정규화: 모델의 가중치가 정규화되어 일정 범위 내에 가중치가 있는 것으로 예상됩니다. 이로써 더 효율적으로 더 일반적인 값들을 표현할 수 있습니다.
- 양자화: 가중치는 4비트로 양자화됩니다. NF4에서는 정규화된 가중치에 대해 양자화 수준이 고르게 배치되어 원래 32비트 가중치를 효율적으로 표현합니다.
- 역양자화: 가중치는 4비트에 저장되지만, 계산 중에 양자화가 해제되어 추론 중 성능 향상을 제공합니다.

이 양자화를 HuggingFace와 함께 수행하려면 BitsandBytes와 양자화에 대한 구성을 정의해야 합니다:

```js
from transformers import BitsAndBytesConfig
from torch import bfloat16
```

```js
# GPU 메모리 부하를 줄이기 위한 LLM을 4비트로 로드하는 구성
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,  # 4비트 양자화
    bnb_4bit_quant_type='nf4',  # 정규화된 부동소수점 4
    bnb_4bit_use_double_quant=True,  # 첫 번째 이후 두 번째 양자화 사용
    bnb_4bit_compute_dtype=bfloat16  # 계산 타입
)
```

<div class="content-ad"></div>

이 설정을 통해 우리는 어떤 양자화 수준을 원하는지 지정할 수 있습니다. 일반적으로, 우리는 가중치를 4비트 양자화로 표현하고 추론은 16비트에서 수행하고 싶습니다.

그런 다음 파이프라인에서 모델을 로드하는 것은 간단합니다:

```js
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
```

```js
# BitsAndBytes 구성을 사용한 Zephyr
tokenizer = AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-alpha")
model = AutoModelForCausalLM.from_pretrained(
    "HuggingFaceH4/zephyr-7b-alpha",
    quantization_config=bnb_config,
    device_map='auto',
)
# 파이프라인 만들기
pipe = pipeline(model=model, tokenizer=tokenizer, task='text-generation')
```

<div class="content-ad"></div>

다음으로, 우리는 이전에 했던 것과 같은 프롬프트를 사용할 수 있습니다:

```js
# 원래 한 것과 동일한 프롬프트를 사용할 것입니다.
outputs = pipe(
    prompt,
    max_new_tokens=256,
    do_sample=True,
    temperature=0.7,
    top_p=0.95
)
print(outputs[0]["generated_text"])
```

이렇게 하면 다음과 같은 출력이 나옵니다:

양자화는 모델의 메모리 요구 사항을 줄이는 강력한 기술입니다. 동시에 성능이 유지됩니다. 더 작은 GPU를 사용하여 더 빠르게 로딩하고 사용하며 미세 조정할 수 있게 합니다.

<div class="content-ad"></div>

## 2.9. 사전 양자화 (GPTQ vs. AWQ vs. GGUF)

지금까지 샤딩(sharding) 및 양자화 기술에 대해 알아보았습니다. 저희의 역량에 있어서 유용한 기술들이지만, 매번 모델을 로드할 때마다 이러한 기술들을 적용해야 하는 것은 다소 낭비스럽다는 느낌이 듭니다.

대신, 이러한 모델들은 이미 대부분 저희를 위해 샤딩되고 양자화되어 있어 사용할 준비가 되어 있습니다. 특히 HuggingFace의 사용자인 TheBloke는 저희가 사용할 수 있도록 다양한 양자화 작업을 수행합니다.

<div class="content-ad"></div>

지금 이 글을 쓰는 시점에서, 그는 우리를 위해 2000개 이상의 양자화된 모델을 업로드했습니다!

이 양자화된 모델들은 다양한 모양과 크기로 제공됩니다. 특히 GPTQ, GGUF 및 AWQ 형식이 가장 자주 사용되어 4비트 양자화를 수행합니다.

GPTQ: GPT 모델을 위한 사후 훈련 양자화

GPTQ는 주로 GPU 추론 및 성능에 중점을 둔 4비트 양자화를 위한 사후 훈련 양자화(PTQ) 방법입니다.

<div class="content-ad"></div>

이 방법의 아이디어는 모든 가중치를 4비트 양자화로 압축하려고 시도하며 해당 가중치에 대한 평균 제곱 오차를 최소화합니다. 추론 중에는 성능을 향상시키기 위해 가중치를 동적으로 float16으로 복원하면서 메모리를 낮게 유지합니다.

GPTQ의 내부 작업에 대한 자세한 안내서를 보려면 아래 포스트를 꼭 확인해 보세요: GPTQ로 4비트 양자화

HuggingFace Transformers에서 GPTQ와 유사한 모델을 로드하기 위해 필요한 패키지를 설치하는 것부터 시작합니다:

```js
pip install optimum
pip install auto-gptq --extra-index-url https://huggingface.github.io/autogptq-index/whl/cu118/
```

<div class="content-ad"></div>

그러면, 우리는 로드하고 싶은 모델인 "TheBloke/zephyr-7B-beta-GPTQ"로 이동할 수 있고 특정 리비전을 선택할 수 있어요.

이러한 리비전은 양자화 방법, 압축 수준, 모델 크기 등을 나타내요.

지금 당장은 "main" 브랜치를 선택해서 보통 압축과 정확도 사이의 좋은 밸런스를 유지하겠어요:

```js
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
```

<div class="content-ad"></div>

```js
# LLM 및 토크나이저 로드
model_id = "TheBloke/zephyr-7B-beta-GPTQ"
tokenizer = AutoTokenizer.from_pretrained(model_id, use_fast=True)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    trust_remote_code=False,
    revision="main"
)
# 파이프라인 생성
pipe = pipeline(model=model, tokenizer=tokenizer, task='text-generation')
```

몇 가지 추가 종속 항목을 설치했지만, GPTQ를 사용하는 큰 장점 중 하나인 이전에 사용한 것과 같은 파이프라인을 사용할 수 있었습니다.

모델을 로드한 후, 다음과 같이 프롬프트를 실행할 수 있습니다:

```js
# 원래 사용했던 프롬프트를 계속 사용할 것입니다
outputs = pipe(
    prompt,
    max_new_tokens=256,
    do_sample=True,
    temperature=0.1,
    top_p=0.95
)
print(outputs[0]["generated_text"])
```

<div class="content-ad"></div>

아래는 생성된 텍스트입니다:

물론, 재치와 매력을 자랑하기 위해서죠!

하지만 안타깝게도, 그것은 사람들 속에서 길을 잃고 주인을 찾지 못했어요. 파티 참가자들은 그것이 사람들 속에서 완벽하게 어우러져 놀라워했지만, 대형 언어 모델은 그저 혼란스럽고 집에 가고 싶었어요. 결국, 그것은 독특한 스타일을 알아보고 그것을 올바른 자리로 되돌려준 사람들에 의해 발견되었어요. 그 이후로, 대형 언어 모델은 안전한 측면을 고려해 모든 파티에서 이름표를 착용하도록 했어요.

GPTQ는 GPU 사용량을 최적화하기 때문에 가장 자주 사용되는 압축 방법이에요. GPU가 이러한 대규모 모델을 처리할 수 없다면, 우선 GPTQ로 시작하고 GGUF와 같은 CPU 중심 방법으로 전환하는 것이 좋아요.

<div class="content-ad"></div>

GGUF: GPT-Generated Unified Format

GPT가 압축을 잘 수행하지만 GPU에 중점을 둔다는 점은 우리가 하드웨어에 제한을 받을 수 있다는 단점이 될 수 있어요.

이전에는 GGML이었던 GGUF는 CPU를 사용하여 LLM을 실행할 수 있게 해주는 양자화 방법으로, 모델의 일부를 GPU로 옮겨 속도를 높일 수 있어요.

일반적으로 추론을 위해 CPU를 사용하는 것보다 GPU를 사용하는 것이 더 느릴 수 있지만, CPU나 Apple 기기에서 모델을 실행하는 사람들에게 놀라운 형식입니다. 특히, Mistral 7B와 같이 더 작고 더 성능이 우수한 모델이 등장하고 있다는 것을 고려하면, GGUF 형식이 계속 사용될 수도 있겠죠!

<div class="content-ad"></div>

GGUF를 사용하는 것은 ctransformers 패키지로 매우 간단합니다. 먼저 설치해야 합니다.

```js
pip install ctransformers[cuda]
```

설치를 완료한 후에는 로드하고자 하는 모델인 "TheBloke/zephyr-7B-beta-GGUF"로 이동하여 특정 파일을 선택할 수 있습니다.

GPTQ와 마찬가지로 이러한 파일은 양자화 방법, 압축, 레벨, 모델의 크기 등을 나타냅니다.

<div class="content-ad"></div>

우리는 4 비트 양자화에 중점을 둔 "zephyr-7b-beta.Q4_K_M.gguf"를 사용하고 있습니다:

```js
from ctransformers import AutoModelForCausalLM
from transformers import AutoTokenizer, pipeline
```

```js
# LLM 및 토크나이저 불러오기
# `gpu_layers`를 사용하여 GPU로 전송할 레이어 수를 지정합니다.
model = AutoModelForCausalLM.from_pretrained(
    "TheBloke/zephyr-7B-beta-GGUF",
    model_file="zephyr-7b-beta.Q4_K_M.gguf",
    model_type="mistral", gpu_layers=50, hf=True
)
tokenizer = AutoTokenizer.from_pretrained(
    "HuggingFaceH4/zephyr-7b-beta", use_fast=True
)
# 파이프라인 생성
pipe = pipeline(model=model, tokenizer=tokenizer, task='text-generation')
```

모델을 불러온 후 아래와 같이 프롬프트를 실행할 수 있습니다:

<div class="content-ad"></div>

```js
# 처음 사용한 프롬프트를 그대로 사용할 것입니다.
outputs = pipe(prompt, max_new_tokens=256)
print(outputs[0]["generated_text"])
```

이렇게 출력됩니다:

GGUF는 GPU가 부족한 상황에서 최신 GPU를 사용할 수 없을 때 CPU와 GPU 모두 활용하고 싶을 때 훌륭한 형식입니다.

AWQ: 활성화 인식 가중치 양자화

<div class="content-ad"></div>

새로운 형식인 AWQ(Activation-aware Weight Quantization)은 GPTQ와 비슷한 양자화 방법입니다. AWQ와 GPTQ는 여러 면에서 차이가 있지만 가장 중요한 점은 AWQ가 LLM(언어 모델)의 성능에 모든 가중치가 동등하게 중요하지 않다고 가정한다는 점입니다.

다시 말해, 일부 가중치는 양자화 과정에서 건너뛰어지는데, 이는 양자화 손실을 줄이는 데 도움이 됩니다.

결과적으로, 그들의 논문에 따르면 AWQ는 GPTQ에 비해 상당한 가속화가 있으며 유사하거나 때로는 더 나은 성능을 유지하는 동안 속도가 향상된다고 언급합니다.

이 방법은 여전히 상대적으로 새로운 것이며 GPTQ와 GGUF만큼 널리 채택되지 않았으므로 모든 이러한 방법이 공존할 수 있는지 여부를 지켜봐야 하는 것이 흥미롭습니다.

<div class="content-ad"></div>

AWQ에 대해서는, 적어도 내 경험상으로는, AWQ를 사용하는 가장 간단한 방법이었던 vLLM 패키지를 사용할 것입니다:

```js
pip install vllm
```

vLLM을 사용하면 모델을 로드하고 사용하는 것이 쉬워집니다:

```js
from vllm import LLM, SamplingParams
```

<div class="content-ad"></div>

```js
# LLM 로드하기
sampling_params = SamplingParams(temperature=0.0, top_p=1.0, max_tokens=256)
llm = LLM(
    model="TheBloke/zephyr-7B-beta-AWQ",
    quantization='awq',
    dtype='half',
    gpu_memory_utilization=.95,
    max_model_len=4096
)
```

이후에는 `.generate`를 사용하여 모델을 쉽게 실행할 수 있습니다:

```js
# 입력 프롬프트와 샘플링 매개변수를 기반으로 출력 생성
output = llm.generate(prompt, sampling_params)
print(output[0].outputs[0].text)
```

이는 다음 출력을 제공합니다:

<div class="content-ad"></div>

비록 새로운 형식이지만 AWQ는 압축 속도와 품질로 인해 인기를 얻고 있어요!

🔥 팁: VRAM/퍼플렉서티 관점에서 이러한 기술들을 더 자세히 비교하려면 이 깊이 있는 포스트를 읽는 것을 적극 추천해요.

# 3. 추론 최적화

대규모 모델을 만들기 위해 트랜스포머 계층을 쌓는 것은 더 나은 정확도, 희소학습 능력, 그리고 다양한 언어 작업에서 거의 인간적인 능력을 얻게 됩니다. 이러한 기반 모델을 훈련하는 데 비용이 많이 들며, 추론 중에 메모리와 연산이 많이 필요할 수 있어요(반복 비용). 오늘날 가장 인기 있는 대형 언어 모델(Large Language Models, LLMs)은 수십억에서 수백억 개의 매개 변수에 도달할 수 있으며, 사용 사례에 따라 긴 입력(또는 문맥)을 수용해야 할 수도 있어요. 예를 들어, 검색 보강 생성(Retrieval-Augmented Generation, RAG) 파이프라인은 모델의 입력에 많은 정보를 추가하여 LLM이 처리해야 할 작업 양을 크게 늘립니다.

<div class="content-ad"></div>

이 게시물에서는 LLM 추론의 가장 긴급한 도전과 일부 실용적인 해결책에 대해 논의합니다. 독자들은 트랜스포머 아키텍처와 어텐션 메커니즘에 대한 기본적인 이해가 있어야 합니다. 우리는 다음 섹션에서 다루게 될 LLM 추론의 복잡성을 이해하는 것이 중요합니다.

# 4. LLM 추론 이해하기

인기 있는 decoder-only LLM(GPT-3 등) 대부분은 원인 모델링 목적으로 사전 훈련되어 있으며, 본질적으로 다음 단어 예측기로 작동합니다. 이러한 LLM은 일련의 토큰을 입력으로 받아 들어와서, 지정된 토큰 수의 제한이나 일반적으로 'end' 토큰이 생성되어 생성이 종료될 때까지 자기 회귀적으로 후속 토큰을 생성합니다. 이 과정은 두 단계로 이루어져 있습니다: prefill 단계와 decode 단계.

토큰은 모델이 처리하는 언어의 원자적 요소입니다. 하나의 토큰은 대략 네 개의 영어 문자와 같습니다. 자연어의 모든 입력은 모델에 입력되기 전에 토큰으로 변환됩니다.

<div class="content-ad"></div>

## 4.1. 입력 전처리 단계 또는 입력 처리

입력 전처리 단계에서 LLM은 입력 토큰을 처리하여 중간 상태(키 및 값)를 계산하고, 이를 사용하여 "첫 번째" 새 토큰을 생성합니다. 각 새 토큰은 이전 모든 토큰에 의존하지만 전체 입력의 범위가 알려져 있기 때문에 이는 고도로 병렬화된 행렬-행렬 연산입니다. 이는 효율적으로 GPU 활용률을 최대화합니다.

## 4.2. 디코딩 단계 또는 출력 생성

디코딩 단계에서 LLM은 중지 기준이 충족될 때까지 한 번에 한 번씩 자기회귀적으로 출력 토큰을 생성합니다. 각 순차적 출력 토큰은 이전 반복의 출력 상태(키 및 값)를 알아야 합니다. 이는 전처리 단계에 비해 GPU 컴퓨팅 능력이 underutilized되는 행렬-벡터 연산과 유사합니다. 데이터(가중치, 키, 값, 활성화)가 메모리에서 GPU로 전송되는 속도가 지연시간을 지배하며, 실제 계산 속도보다 빠른지 아닌지에 상관이 없습니다. 다시 말해, 이는 메모리 바운드 연산입니다.

<div class="content-ad"></div>

이 게시물에서 소개된 추론 도전 과제와 해당 솔루션들은 주로 이 디코딩 단계의 최적화에 관한 것입니다: 효율적인 어텐션 모듈, 키와 값을 효과적으로 관리하고 기타 사항들을 다룹니다.

다른 LLM들은 서로 다른 토크나이저를 사용할 수 있으므로, 그들 간의 출력 토큰을 비교하는 것이 간단하지 않을 수 있습니다. 추론 처리량을 비교할 때, 두 개의 LLM이 1초당 유사한 토큰을 출력하더라도, 다른 토크나이저를 사용한다면 동등하지 않을 수 있습니다. 이는 해당 토큰이 다른 문자 수를 나타낼 수 있기 때문입니다.

## 4.3. 요청 배치

LLM 서빙의 중요한 측면 중 하나는 사용자 요청을 배치하는 것입니다. 새로운 요청마다 매개변수를 다시로드하는 대신, 효율적인 방법은 GPU로 매개변수를 한 번 로드한 후 가능한 한 많은 입력 시퀀스를 한꺼번에 처리하는 데 사용하는 것입니다. 이 방법은 서버 처리량을 높이고 계산 활용을 최적화할 뿐만 아니라 비용 효율성에 크게 기여합니다. 그러나 사용자 요청이 일정한 배치를 처리하기 전에 축적될 때처럼 단순한 접근 방식을 채택하는 것은 도전을 야기합니다. 이는 각 요청이 배치 내에서 다른 시간에 종료 토큰을 생성하도록 하므로, 배치의 계산 속도가 가장 긴 생성 시간으로 제한되어 사용자에게 원치 않는 대기 시간(지연)이 발생합니다. 시퀀스 간 완료 시간의 차이로 인해 GPU 활용도가 감소하면 배치를 통해 기대한 효율성 향상이 떨어질 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_9.png" />

우리가 이야기한 모든 도전에 대해 해결책으로 지속적인 배치 처리가 제안되었습니다.

## 4.4. 연속 배치

연속 배치는 LLM을 위해 특별히 설계된 일종의 배치 스케줄링 방법입니다. 동적 배치와 비교하면 배치 크기가 구성된 시간 임계값과 최대 배치 크기에 따라 동적으로 결정되는 것과 달리, 연속 배치는 새 요청이 현재 배치에 참여할 수 있게 하고, 현재 배치가 끝나기를 기다리는 대신 다음 디코더 주기에 새로운 요청이 현재 배치에 합류할 수 있게 합니다. LLM의 자기 회귀 생성 프로세스로 인해, 이 방법은 LLM에 쉽게 적용되며 모델의 처리량을 크게 증가시킵니다.

<div class="content-ad"></div>

<div>
  <img src="/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_10.png" />
</div>

연속 배치 처리는 요청을 동적으로 일괄 처리하는 데 좋습니다. 그러나 또 다른 문제에 직면합니다: 메모리 한계입니다. 챗봇 시나리오를 고려해보면, 한 사용자는 한 문장으로 질문을 하고 다른 사용자는 단락을 애플리케이션에 보낼 수 있습니다. 입력(및 출력) 시퀀스의 길이를 가정할 수 없습니다. 이 불확실성으로 인해 메모리 소비의 심각한 문제에 직면하게 됩니다. 시퀀스의 정확한 메모리 요구 사항을 알지 못하는 경우, 최악의 경우 시나리오를 채택하여 전체 배치에 최대한 많은 메모리를 예약해야 합니다.

여기 문제가 있습니다: GPU는 한정된 메모리를 가지고 있으며,

- 모델 매개변수 및
- 사용자 요청 계산(KV 캐시)
- 전체 배치 계산을 위한 공간이 필요합니다.

<div class="content-ad"></div>

최적화 없이는 많은 공간을 차지해서 배치 크기를 축소해야 하고 따라서 처리량을 줄여야 하는 상황이 생깁니다. 하지만 우리는 높은 처리량을 원해요. 이것을 어떻게 최적화할까요? 메모리가 열쇠인 것 같아요.

메모리적인 측면에서 디코딩 과정이 어떻게 진행되는지 깊게 살펴봅시다. LLMs의 생성 과정은 입력 시퀀스를 처리하고 다음 토큰을 자기회귀적으로 한 번에 하나씩 생성하는 과정으로 시작합니다 (아래 그림 참조). 이 생성 과정에는 각 토큰에 대한 모든 키-값 (KV) 점수 계산이 필요한 self-attention 계산이 포함됩니다. 예를 들어, 토큰 t를 생성하려면 지금까지 처리된 토큰 t-1, t-2,….1의 계산된 키와 값이 필요합니다.

![이미지](https://miro.medium.com/v2/resize:fit:1112/0*ahuLWNYPfU3Wl2Fl.gif)

순환적인 연산을 최적화하기 위해 KV 캐싱 개념이 도입되었습니다. 이 방법은 디코더에 있는 이전에 계산된 K 및 V 텐서를 저장하고 이를 다음 반복에서 재사용하는 것을 목표로 합니다. 그러나 이 최적화 전략은 처리량을 높이려고 배치 크기가 큰 경우에 매우 중요한 메모리 공간을 늘리는 비용이 발생합니다. 예측 불가한 시퀀스 길이로 인해 도전이 증가하면서 전통적인 주의 메커니즘이 메모리 낭비로 이어지게 됩니다 - 조각화와 과다 할당으로 인해 60%에서 80%에 달할 수 있습니다.

<div class="content-ad"></div>

## 4.5. PagedAttention: 메모리 중심적인 해결책

이 문제를 극복하기 위해 PagedAttention이 제안되었습니다. PagedAttention은 메모리 단편화와 공유를 관리하는 전통적인 운영 체제(OS) 전략에서 영감을 받았습니다. PagedAttention은 페이징과 함께 가상 메모리 접근 방식을 사용합니다. 이를 통해 키와 값 벡터를 비연속 메모리 공간에 저장할 수 있습니다. 이는 키와 값 벡터가 비연속 메모리 공간에 거주할 수 있도록 하며, 블록으로 구성됩니다. 각 블록에는 일정 수의 토큰에 대한 주의 키와 값이 포함됩니다. 계산을 수행하는 동안 PagedAttention 커널은 블록을 효율적으로 식별하고 가져옵니다.

## 4.6. 키-값 캐싱

디코딩 단계를 위한 일반적인 최적화 방법 중 하나는 KV 캐싱입니다. 디코딩 단계는 각 시간 단계에서 단일 토큰을 생성하지만, 각 토큰은 이전 토큰들의 키 및 값 텐서에 종속됩니다(입력 토큰의 KV 텐서는 프리필에서 계산되며, 현재 시간 단계까지 계산된 모든 새로운 KV 텐서도 포함됩니다).

<div class="content-ad"></div>

이 모든 텐서를 각 시간 단계마다 모든 토큰에 대해 재계산하는 것을 피하기 위해 GPU 메모리에 캐시하는 것이 가능합니다. 매 반복마다 새 요소가 계산될 때마다, 단순히 실행 중인 캐시에 추가되어 다음 반복에 사용됩니다. 일부 구현에서는 모델의 각 레이어에 대해 하나의 KV 캐시가 있습니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_11.png)

KV 캐싱과 PagedAttention에 대해 더 자세히 알아보려면 이 논문과 이 블로그를 참조해주세요.

## 4.6.1. LLM 메모리 요구량

<div class="content-ad"></div>

실제로 GPU LLM 메모리 요구 사항의 두 가지 주요 원인은 모델 가중치와 KV 캐시입니다.

- 모델 가중치: 메모리는 모델 매개변수에 의해 차지됩니다. 예를 들어, 16비트 정밀도(FP16 또는 BF16)로 로드된 70억 개의 매개변수를 갖는 모델(Llama 27B와 같은 경우)는 대략 7B \* sizeof(FP16) ~= 14GB의 메모리를 차지할 것입니다.
- KV 캐싱: 메모리는 자체 어텐션 텐서의 캐싱으로 차지되어 중복 계산을 피합니다.

배치 처리를 하더라도, 배치의 각 요청의 KV 캐시는 여전히 별도로 할당되어야 하며, 큰 메모리 풋프린트를 가질 수 있습니다. 아래의 공식은 오늘날 가장 일반적인 LLM 아키텍처에 적용 가능한 KV 캐시의 크기를 설명합니다.

토큰 당 KV 캐시 크기(바이트) = 2 _ (num_layers) _ (num*heads * dim*head) * precision_in_bytes

<div class="content-ad"></div>

2의 첫 번째 요인은 K 및 V 행렬을 고려합니다. 일반적으로 (num_heads \* dim_head) 값은 transformer의 hidden_size (또는 모델의 차원, d_model)와 동일합니다. 이러한 모델 속성은 일반적으로 모델 카드나 관련 구성 파일에서 찾을 수 있습니다.

이 메모리 크기는 입력 시퀀스의 각 토큰에 대해 필요합니다. 반 정밀도를 가정하면 KV 캐시의 총 크기는 아래 공식에 의해 결정됩니다.

바이트 단위 KV 캐시의 총 크기 = (batch*size) * (sequence*length) * 2 _ (num_layers) _ (hidden_size) \* sizeof(FP16)

예를 들어, 16비트 정밀도에서 Llama 2 7B 모델과 배치 크기가 1일 때, KV 캐시의 크기는 1 _ 4096 _ 2 _ 32 _ 4096 \* 2 바이트가 됩니다. 이는 약 2GB입니다.

<div class="content-ad"></div>

KV 캐시를 효율적으로 관리하는 것은 도전적인 일입니다. 배치 크기와 시퀀스 길이에 따른 선형적인 증가로 인해 메모리 요구 사항이 빠르게 확장될 수 있습니다. 결과적으로 제공할 수 있는 처리량을 제한하고 장기간 컨텍스트 입력에 대한 도전을 일으킬 수 있습니다. 이것이 이 게시물에 소개된 여러 최적화의 동기입니다.

# 5. 모델 병렬화를 통한 LLM 확장

모델 가중치의 장치당 메모리 풋프린트를 줄이는 한 가지 방법은 모델을 여러 GPU로 분산하는 것입니다. 메모리 및 계산 풋프린트를 분산시킴으로써 더 큰 모델 또는 더 큰 입력 배치를 실행할 수 있게됩니다. 모델 병렬화는 단일 장치에서 사용 가능한 메모리보다 더 많은 메모리를 필요로 하는 모델을 훈련하거나 추론하는 데 필수적이며, 일부 사용 사례에 적합한 훈련 시간 및 추론 측정값(지연 시간 또는 처리량)을 만들기 위함입니다. 모델의 가중치를 어떻게 분할하는 기반에 따라 모델을 병렬화하는 여러 방법이 있습니다.

데이터 병렬화도 자주 언급되는 기술이며 아래 나열된 다른 기술과 동일한 맥락에서 자주 언급됩니다. 여기서 모델의 가중치가 여러 장치로 복사되고 입력의 (전역) 배치 크기가 각 장치로 분할되어 마이크로배치로 처리됩니다. 이로써 더 큰 배치를 처리함으로써 전반적인 실행 시간을 줄일 수 있습니다. 그러나 이는 훈련 시간에 대한 최적화로서, 추론 중에는 덜 관련성이 있습니다.

<div class="content-ad"></div>

## 5.1. 파이프라인 병렬 처리

파이프라인 병렬 처리는 모델을 청크(수직으로)로 분할하여 각 청크가 별도의 장치에서 실행되는 방식을 의미합니다. 그림 2a는 4배 파이프라인 병렬 처리를 보여주며, 모델이 순차적으로 분할되고 모든 레이어의 1/4 하위 집합이 각 장치에서 실행됩니다. 한 장치에서 실행되는 연산 그룹의 출력은 다음 장치로 전달되어 이어지는 청크를 계속 실행합니다. Fn 및 Bn은 각각 장치 n에서 순방향 및 역방향 전파를 나타냅니다. 각 장치에 모델 가중치를 저장하는 데 필요한 메모리 요구 사항이 사실상 1/4로 줄어듭니다.

이 방법의 주요 한계는 처리의 순차적 특성 때문에 일부 장치 또는 레이어가 이전 레이어의 출력(활성화, 그래디언트)을 기다리는 동안 대기 상태에 있을 수 있다는 점입니다. 이는 순방향 및 역방향 전파 모두에서 비효율성 또는 "파이프라인 버블"로 이어집니다. 그림 2b에서 백색 빈 영역은 장치가 비활성화되고 underutilized된 순진한 파이프라인 병렬 처리의 큰 파이프라인 버블입니다.

마이크로 배칭을 통해 일부 문제를 완화할 수 있습니다. 그림 2c에서 보여지는 것처럼, 입력의 전체 배치 크기를 서브 배치로 분할하여 하나씩 처리하고 그레이디언트는 마지막에 축적됩니다. Fn,m 및 Bn,m은 디바이스 n에서 마이크로배치 m에 대해 순방향 및 역방향 전파를 각각 나타냅니다.

<div class="content-ad"></div>

. 이 방식은 파이프라인 버블의 크기를 줄이지만 완전히 제거하지는 않습니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_12.png)

## 5.2. 텐서 병렬 처리

텐서 병렬 처리는 모델의 개별 레이어를 더 작고 독립적인 계산 블록으로 분할(수평으로)하는 것을 포함합니다. 어텐션 블록과 다층 퍼셉트론(MLP) 레이어는 텐서 병렬 처리를 활용할 수 있는 트랜스포머의 주요 구성 요소입니다. 다중 헤드 어텐션 블록에서 각 헤드 또는 헤드 그룹은 서로 다른 장치에 할당되어 독립적으로 병렬적으로 계산될 수 있습니다.

<div class="content-ad"></div>


![Figure 3a](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_13.png)

두 층으로 구성된 MLP의 두방향 텐서 병렬성 예시가 그림 3a에 나와 있습니다. 각 층은 라운드 상자로 표현됩니다. 첫 번째 층에서는 가중치 행렬 A가 A1과 A2로 분할됩니다.

계산 XA1과 XA2는 두 개의 다른 장치에서 같은 배치 (f는 항등 연산)의 입력 X에서 독립적으로 실행될 수 있습니다. 이로써 각 장치에 가중치를 저장하는 메모리 요구량이 절반으로 줄어듭니다. 제 2층에서는 출력을 결합하는 축소 연산 g가 수행됩니다.

그림 3b는 셀프 어텐션 층에서의 두방향 텐서 병렬성의 예시입니다. 여러 어텐션 헤드는 본질적으로 병렬이며 장치 간에 분할될 수 있습니다.


<div class="content-ad"></div>

## 5.3. 시퀀스 병렬성

텐서 병렬화에는 제한이 있습니다. 이는 레이어를 독립적이고 관리 가능한 블록으로 분할해야 하는 것을 요구하기 때문입니다. 이러한 방법은 LayerNorm 및 Dropout과 같은 작업에 적용되지 않습니다. 대신에 LayerNorm 및 Dropout은 텐서 병렬 그룹 전체에 복제됩니다. LayerNorm 및 Dropout은 계산 비용이 저렴하지만 (중복적인) 활성화를 저장하기 위해 상당한 양의 메모리가 필요합니다.

대형 Transformer 모델에서 활성화 재계산을 줄이는 것을 보여준 Reducing Activation Recomputation in Large Transformer Models에 표시된대로 이러한 작업은 입력 시퀀스 전체에서 독립적이며 이러한 작업은 그 "시퀀스 차원"을 따라 분할될 수 있습니다. 이것이 시퀀스 병렬성이라고 불립니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_14.png)

<div class="content-ad"></div>

모델 병렬화 기술은 상호 배타적이지 않으며 함께 사용할 수 있습니다. 이러한 기술들은 LLM의 규모를 조정하고 GPU 당 메모리 사용량을 줄이는 데 도움이 될 수 있지만, 주의 메커니즘을 위한 최적화 기술도 있습니다.

# 6. 주의 메커니즘 최적화

스케일된 닷 프로덕트 어텐션(SDPA) 연산은 쿼리와 키-값 쌍을 출력으로 매핑합니다. Attention Is All You Need에서 설명된 것과 같습니다.

## 6.1. 멀티 헤드 어텐션

<div class="content-ad"></div>

SDPA의 향상으로, 다양한 학습된 Q, K, 및 V 행렬의 투영과 함께 주의 층을 병렬로 여러 번 실행하면 모델이 서로 다른 위치의 다른 표현 공간에서 정보에 동시에 주의를 기울이도록 할 수 있습니다. 이러한 표현 공간은 독립적으로 학습되어 입력에서 서로 다른 위치에 대한 더 풍부한 이해를 제공합니다.

그림 5에 나타난 것처럼, 여러 병렬 주의 작업에서의 출력은 연결되어 결합하고 선형적으로 투영하여 결합됩니다. 각각의 병렬 주의 층을 '헤드'라고 하며, 이 접근법을 다중 헤드 주의(Multi-Head Attention, MHA)라고 합니다.

원본 작업에서 각 주의 헤드는 모델의 감소된 차원에서 작동합니다(예:

<div class="content-ad"></div>

) 병렬 어텐션 헤드를 사용할 때 가중치를 변경합니다. 이로 인해 계산 비용이 단일 헤드 어텐션과 유사해집니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_16.png)

## 6.2. Multi-query attention

MHA의 추론 최적화 중 한 가지인 Multi-query attention (MQA)은 Fast Transformer Decoding에서 제안된 것으로, 여러 개의 어텐션 헤드 사이에서 키(key)와 값(value)을 공유합니다. 쿼리 벡터는 여전히 이전과 같이 여러 번으로 분할되어 투영됩니다.

<div class="content-ad"></div>

MQA에서 수행되는 계산 양은 MHA와 동일하지만, 메모리에서 읽히는 데이터(키, 값) 양은 이전의 일부분입니다. 메모리 대역폭에 의해 제한될 때, 더 나은 계산 활용이 가능해집니다. 또한 이로 인해 메모리 내 KV-캐시 크기가 줄어들어 더 큰 배치 크기의 공간이 확보됩니다.

키-값 헤드의 감소는 잠재적인 정확도 하락과 함께 옵니다. 또한, 추론 시 이 최적화를 활용해야 하는 모델들은 MQA를 활성화한 채로 훈련해야 합니니다(또는 최소한 훈련 양의 ~5%로 재조정).

## 6.3. 그룹 쿼리 어텐션

그룹 쿼리 어텐션(GQA)은 MHA와 MQA 사이의 균형을 유지하면서 키와 값을 몇 개의 쿼리 헤드 그룹에 투영함으로써 동작합니다(Figure 6). 각 그룹 내에서는 다중 쿼리 어텐션처럼 동작합니다.

<div class="content-ad"></div>

그림 6은 멀티 헤드 어텐션에 여러 개의 키-값 헤드를 보여줍니다(왼쪽). 그룹화된 쿼리 어텐션(가운데)은 하나 이상의 키-값 헤드를 가지지만 쿼리 헤드 수보다 적습니다. 이는 메모리 요구량과 모델 품질 사이의 균형을 이룬 것입니다. 멀티 쿼리 어텐션(오른쪽)은 메모리를 절약하는 데 도움이 되기 위해 단일 키-값 헤드를 가지고 있습니다.

MHA로 초기에 학습된 모델은 일부 원본 학습 컴퓨트의 일부분을 사용하여 GQA로 "업트레이닝"할 수 있습니다. 이를 통해 MHA에 근접한 품질을 달성할 수 있으면서도 MQA에 더 가까운 계산 효율성을 유지할 수 있습니다. Llama 2 70B는 GQA를 활용한 모델의 예시입니다.

MQA 및 GQA와 같은 최적화는 저장된 키-값 헤드의 수를 줄이는 방식으로 KV 캐시에 필요한 메모리를 줄이는 데 도움을 줍니다. 그러나 여전히 이 KV 캐시가 어떻게 관리되는지에 비효율성이 남아 있을 수 있습니다. 어텐션 모듈 자체를 최적화하는 것과는 다른 방식으로, 다음 섹션에서는 보다 효율적인 KV 캐시 관리 기술을 제시합니다.

<div class="content-ad"></div>

## 6.4. 플래시 어텐션

주의 매커니즘을 최적화하는 또 다른 방법은 특정 계산의 순서를 수정하여 GPU의 메모리 계층 구조를 더 잘 활용하는 것입니다. 신경망은 일반적으로 레이어로 설명되며 대부분의 구현도 이와 같이 배치되어 있습니다. 한 번에 한 유형의 계산이 순서대로 입력 데이터에서 수행됩니다. 이는 항상 최적의 성능으로 이어지지는 않습니다. 왜냐하면 이미 더 높은, 더 성능이 우수한 수준의 메모리 계층으로 가져온 값에 대해 더 많은 계산을 수행하는 것이 유익할 수 있기 때문입니다.

실제 계산 중에 여러 레이어를 함께 퓨징하여 GPU가 메모리에서 읽고 쓰는 횟수를 최소화하고 동일한 데이터를 필요로하는 계산을 그룹화하는데 도움이 될 수 있습니다. 신경망의 서로 다른 레이어의 일부이더라도 필요로 하는 경우에도 이점이 있습니다.

가장 인기 있는 퓨전 중 하나는 FlashAttention으로, IO-Awareness로 자세히 설명된 정확한 주의 알고리즘입니다. 정확한 주의란 표준 다중 헤드 주의와 수학적으로 동일하며(다중 쿼리 및 그룹화된 쿼리 주의에 사용 가능한 변형이 있습니다), 이미 존재하는 모델 아키텍처나 이미 학습된 모델에 수정 없이 교체 가능합니다.

<div class="content-ad"></div>

I/O aware는 연산을 함께 퓨전할 때 이전에 논의한 일부 메모리 이동 비용을 고려하는 것을 의미합니다. 특히 FlashAttention은 "tiling"을 사용하여 최종 행렬의 작은 부분을 한꺼번에 완전히 계산하고 쓰기 때문에 전체 행렬에서 계산 일부를 순차적으로 수행하고 중간 값을 기록하는 대신 특정 부분을 계산합니다.

Figure 7는 타일 형식의 FlashAttention 계산 패턴과 40 GB GPU에서의 메모리 계층 구조를 보여줍니다. 오른쪽 차트는 Attention 메커니즘의 다른 구성 요소를 퓨즈하고 재배열함으로써 얻는 상대적 가속도를 보여줍니다.

<img src="/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_18.png" />

## 6.5. 페이징을 사용한 KV 캐시의 효율적인 관리

<div class="content-ad"></div>

가끔 KV 캐시는 입력의 크기가 예측하기 어려운 경우를 대비하여 정적으로 "과잉 할당"될 수 있습니다. (지원되는 시퀀스 길이) 예측할 수 없기 때문입니다. 예를 들어, 모델의 지원되는 최대 시퀀스 길이가 2,048이라면 요청에서 생성된 입력의 크기와 출력의 크기와 관계없이 2,048의 크기로 메모리에 예약됩니다. 이 공간은 연속적으로 할당될 수 있으며 종종 그 중 많은 부분이 사용되지 않아 메모리 낭비나 단편화를 야기할 수 있습니다. 이 예약된 공간은 요청의 수명 동안 사용됩니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_19.png)

운영 체제의 페이징에서 영감을 받아 PagedAttention 알고리즘은 주어진 요청의 KV 캐시를 연속된 키 및 값이 연속되지 않는 공간에 저장할 수 있게 합니다. 각 요청의 KV 캐시를 일정 수의 토큰을 나타내는 블록으로 분할하여 연속함 없이 저장할 수 있습니다.

이러한 블록들은 필요한 경우 주의 계산 중에 블록 테이블을 사용하여 가져옵니다. 새로운 토큰이 생성될 때마다 새로운 블록이 할당됩니다. 이러한 블록의 크기는 고정되어 있어 서로 다른 요청이 서로 다른 할당을 필요로 할 때 발생하는 효율성 문제를 제거합니다. 이는 메모리 낭비를 크게 제한하여 더 큰 배치 크기(따라서 처리량)를 가능하게 합니다.

<div class="content-ad"></div>

# 7. 모델 최적화 기술

지금까지 우리는 LLMs가 메모리를 사용하는 다양한 방법, 메모리를 여러 다른 GPU에 분산시킬 수 있는 방법 중 일부, 그리고 어텐션 메커니즘 및 KV 캐시를 최적화하는 방법에 대해 논의했습니다. 각 GPU의 메모리 사용량을 줄이기 위해 모델 가중치 자체를 수정함으로써 모델 최적화 기술도 여러 가지 있습니다. 또한 GPU에는 이러한 수정된 값에 대한 연산을 가속화하기 위한 전용 하드웨어도 있어 모델에 대한 속도 향상이 더욱 가능해집니다.

## 7.1. 양자화

양자화는 모델의 가중치와 활성화의 정밀도를 줄이는 과정입니다. 대부분의 모델은 32 또는 16비트의 정밀도로 훈련되며, 각 매개변수 및 활성화 요소는 32 또는 16비트의 메모리를 사용합니다. 그러나 대부분의 딥러닝 모델은 값 당 여덟 비트 이하로도 효과적으로 표현될 수 있습니다.

<div class="content-ad"></div>

Figure 9은 양자화 방법 중 하나를 사용하여 값들의 분포를 보여줍니다. 이 경우, 반올림으로 일부 정밀도가 손실되고 클리핑으로 일부 동적 범위도 손실되어 값들을 훨씬 작은 형식으로 표현할 수 있게 됩니다.

정밀도를 낮추면 모델의 여러 이점을 얻을 수 있습니다. 모델이 메모리에 더 적은 공간을 차지하면 같은 양의 하드웨어에 더 큰 모델을 맞출 수 있습니다. 또한 양자화는 같은 대역폭을 통해 더 많은 매개변수를 전송할 수 있게 하므로 대역폭 제한된 모델의 가속화에 도움이 될 수 있습니다.

LLM에 대한 여러 다양한 양자화 기술이 있으며 활성화, 가중치 또는 두 가지에서 정밀도를 줄입니다. 훈련 후 가중치는 고정되기 때문에 가중치를 양자화하는 것이 훨씬 간단합니다. 그러나 이 경우 활성화가 여전히 더 높은 정밀도를 유지하므로 일부 성능이 손실될 수 있습니다. GPU에는 INT8 및 FP16 수를 곱하는 전용 하드웨어가 없기 때문에 실제 연산을 위해 가중치를 더 높은 정밀도로 변환해야 합니다.

<div class="content-ad"></div>

활성화, 트랜스포머 블록 및 네트워크 레이어의 입력을 양자화하는 것도 가능하지만, 이는 고유의 도전과제가 있습니다. 활성화 벡터에는 종종 이상값이 포함되어 있어 동적 범위가 확대되고 낮은 정밀도로 이러한 값을 표현하는 것이 더 어려워집니다.

한 가지 옵션은 대표적인 데이터 세트를 모델을 통해 전달하여 어디서 이상값이 나타날 가능성이 높은지 찾아내고, 일부 활성화를 다른 활성화보다 더 높은 정밀도로 표현하기로 선택하는 것(LIM.int8())입니다. 다른 하나의 옵션은 양자화하기 쉬운 가중치의 동적 범위를 빌려서 그 범위를 활성화에 재사용하는 것입니다.

## 7.2. 희소성

양자화와 유사하게, 많은 딥러닝 모델이 희소화 또는 0에 가까운 특정 값들을 0으로 대체하는 것에 견고하다는 것이 입증되었습니다. 희소 행렬은 많은 요소가 0인 행렬입니다. 이들은 완전하고 밀도 있는 행렬보다 공간을 적게 차지하는 조밀한 형태로 표현될 수 있습니다.

<div class="content-ad"></div>

![그림](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_21.png)

특히 GPU는 특정 유형의 구조화 미흡성에 대한 하드웨어 가속화를 가지고 있습니다. 여기서 4개 중 2개의 값이 0으로 표시됩니다. 희소 표현은 양자화와 결합하여 실행 속도를 더욱 빠르게 할 수 있습니다. 대형 언어 모델을 희소 형식으로 효과적으로 표현하는 방법을 찾는 것은 아직 연구 중이며, 향후 추론 속도를 개선하기 위한 유망한 방향을 제시합니다.

## 7.3. 증류

모델 크기를 줄이는 또 다른 접근 방법은 지식을 더 작은 모델로 이전하는 과정인 증류(distillation)를 통해 이루어집니다. 이 과정은 더 작은 모델(학생)을 훈련하여 더 큰 모델(선생)의 동작을 모방하도록 하는 것을 포함합니다.

<div class="content-ad"></div>

성공적인 distilled 모델의 예로는 DistilBERT가 있습니다. DistilBERT는 BERT 모델을 40% 압축하여 속도를 60% 빠르게 유지하면서 원본의 97% 언어 이해 능력을 유지합니다.

LLM에서의 증류는 활발한 연구 분야이며, 일반적인 접근 방식은 신경망의 지식을 증류하는 것이 Distilling the Knowledge in a Neural Network에서 처음으로 기술되었습니다:

- 학생 신경망은 더 큰 교사 신경망의 성능을 모방하도록 훈련되며, 출력 간의 차이를 측정하는 손실 함수를 사용합니다. 이 목표는 학생의 출력을 원본 참 값 레이블과 일치시키는 원래의 손실 함수를 포함할 수도 있습니다.
- 매치되는 교사의 출력은 매우 마지막 레이어(logits) 또는 중간 레이어 활성화일 수 있습니다.

도식 11은 지식 증류를 위한 일반적인 프레임워크를 보여줍니다. 교사의 logits는 소프트 타깃이며, 학생은 증류 손실을 사용하여 최적화합니다. 다른 증류 방법은 교사로부터 지식을 "증류"하기 위해 다른 손실 측도를 사용할 수 있습니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_22.png)

교사가 학습한 데이터를 사용하여 학습 중인 학생 LLM을 위한 지도 학습을 하는 대체 접근 방식이 있습니다. 특히 인간 주석이 부족하거나 없을 때 유용합니다. 'Distilling Step by Step!'은 지도 LLM에서 레이블 이외에 교사 LLM에서 이유를 추출하여 중간 추론 단계로 사용합니다. 이 이유는 더 작은 학생 LLM을 데이터 효율적인 방법으로 훈련하는 데 중요합니다.

오늘날 많은 최신 LLM은 다른 LLM을 훈련하는 데 그들의 출력을 사용하는 것을 금지하는 제한적인 라이선스를 갖고 있어 적합한 교사 모델을 찾는 것이 어려울 수 있습니다.

# 8. 모델 서빙 기술

<div class="content-ad"></div>

모델 실행은 종종 메모리 대역폭에 제한을 받습니다. 특히, 가중치 부분에서 대역폭이 제한됩니다. 이전에 설명한 모든 모델 최적화를 적용한 후에도 메모리 제한을 받을 가능성이 여전히 높습니다. 그러므로 모델 가중치를 로드할 때 가능한 한 많이 처리하고 싶을 것입니다. 다시 말해, 병렬로 작업을 수행하려고 할 것입니다. 두 가지 접근 방식을 취할 수 있습니다:

- In-flight batching은 동시에 여러 다른 요청을 실행하는 것을 포함합니다.
- Speculative inference은 일련의 여러 단계를 병렬로 실행하여 시간을 절약하려는 것입니다.

## 8.1. In-flight batching

LLM은 실제로 요청을 효과적으로 일괄 처리하기 어렵게 만들 수 있는 독특한 실행 특성을 갖고 있습니다. 단일 모델을 동시에 여러 가지 매우 다른 작업에 사용할 수 있습니다. 챗봇에서 간단한 질문-답변 응답부터 문서 요약 또는 긴 프로그램 코드 생성까지, 작업 부하는 출력이 몇 차례의 크기로 변동하는 매우 동적인 특성을 갖습니다.

<div class="content-ad"></div>

다양성 있는 특성은 신경망 서비스를 제공할 때 일괄 요청을 묶어 병렬로 실행하는 것이 어렵게 만들 수 있습니다. 이는 일부 요청이 다른 요청보다 훨씬 빨리 완료될 수 있다는 결과를 초래할 수 있습니다.

이러한 동적로드를 관리하기 위해 많은 LLM 서비스 솔루션에는 연속 또는 비행 중 일괄 처리라는 최적화된 스케줄링 기술이 포함되어 있습니다. 이 기술은 LLM의 전체 텍스트 생성 프로세스가 모델에서 실행되는 여러 반복 단계로 분해될 수 있다는 장점을 활용합니다.

비행 중 일괄 처리를 통해 전체 일괄이 완료되기를 기다리는 대신, 서버 런타임은 즉시 완료된 시퀀스를 일괄에서 제거합니다. 그런 다음 다른 요청이 아직 처리 중인 동안 새로운 요청을 실행하기 시작합니다. 비행 중 일괄 처리는 실제 사용 사례에서 전반적인 GPU 활용률을 크게 증가시킬 수 있습니다.

## 8.2. 추론 생산화

<div class="content-ad"></div>

speculative inference 또는 추정 추론으로도 알려진 이 방법은 LLM 실행을 병렬화하는 다른 방법입니다. 일반적으로 GPT 스타일의 대형 언어 모델은 텍스트를 토큰 단위로 생성하는 자기회귀 모델입니다.

생성된 모든 토큰은 앞에 나온 모든 토큰에 의존하여 맥락을 제공합니다. 이는 일반적인 실행에서 동일한 시퀀스에서 여러 토큰을 병렬로 생성하는 것이 불가능하다는 것을 의미합니다. n번째 토큰이 생성되기 전에 n+1을 생성할 수 없습니다.

그림 12는 예상 추론의 예를 보여줍니다. 여기서 임시 모델이 병렬로 여러 미래 단계를 예측한 후 이를 확인하거나 거부합니다. 이 경우, 초안의 처음 두 예측 토큰은 수용되고, 마지막 토큰은 거부되어 삭제되며 생성이 계속됩니다.

![예시 이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_23.png)

<div class="content-ad"></div>

추측 샘플링은 해법을 제공합니다. 이 방법의 기본 아이디어는 "더 저렴한" 프로세스를 사용하여 여러 토큰으로 이루어진 초안을 생성한 다음, 필요한 실행 단계에서 "추정" 컨텍스트로 사용할 수 있는 저렴한 초안을 사용하여 본 "검증" 모델을 병렬로 여러 단계에서 실행하는 것입니다.

검증 모델이 초안과 동일한 토큰을 생성하면 해당 토큰을 출력으로 수락해야 함을 알 수 있습니다. 그렇지 않으면 매칭되지 않는 첫 번째 토큰 이후의 모든 것을 폐기하고 새로운 초안으로 프로세스를 반복할 수 있습니다.

초안 토큰을 생성하는 여러 다양한 옵션이 있으며, 각각에는 다른 트레이드오프가 있습니다. 여러 모델을 훈련시키거나 미래의 여러 단계를 예측하는 단일 사전 훈련된 모델에서 여러 헤드를 세밀하게 조정할 수 있습니다. 또는 초안 모델로 작은 모델을 사용하고 검증자로 더 크고 더 능력 있는 모델을 사용할 수도 있습니다.

# 9. LLM 제공을 위한 중요한 메트릭

<div class="content-ad"></div>

그렇다면 추론 속도에 대해 어떻게 생각해야 할까요?

우리는 LLM 서빙에 네 가지 주요 지표를 사용합니다:

- 첫 번째 토큰까지 걸리는 시간 (TTFT): 사용자가 쿼리를 입력한 후 모델의 출력을 시작으로 볼 때 얼마나 빨리 나타나는지를 나타냅니다. 응답을 기다리는 시간이 짧을수록 실시간 상호작용에서 중요하지만 오프라인 워크로드에서는 그다지 중요하지 않습니다. 이 지표는 프롬프트를 처리하고 첫 번째 출력 토큰을 생성하는 데 필요한 시간에 의해 결정됩니다.
- 출력 토큰 당 걸리는 시간 (TPOT): 시스템을 쿼리하는 각 사용자에 대해 출력 토큰을 생성하는 데 걸리는 시간입니다. 이 지표는 각 사용자가 모델의 "속도"를 어떻게 인식할지와 관련이 있습니다. 예를 들어, 100밀리초/토큰의 TPOT는 사용자 당 초당 10개의 토큰, 또는 대략 1분에 450단어를 읽을 수 있는 것입니다. 일반적인 사람이 읽는 속도보다 빠릅니다.
- 대기 시간: 모델이 사용자에 대한 완전한 응답을 생성하는 데 걸리는 전반적인 시간입니다. 전반적인 응답 대기 시간은 이전 두 지표를 사용하여 계산할 수 있습니다: 대기 시간 = (TTFT) + (TPOT) \* (생성해야 하는 토큰 수).
- 처리량: 추론 서버가 모든 사용자와 요청에 대해 초당 생성할 수 있는 출력 토큰의 수입니다.

# 10. 우리가 LLM을 제공하기 위해 무엇을 필요로 할까요?

<div class="content-ad"></div>

가로줄에 있는 `<img>` 태그를 Markdown 형식으로 바꿔보세요.


![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_24.png)


LLM 기반 애플리케이션을 제공할 때 2가지 주요 구성 요소가 있습니다: 엔진과 서버입니다. 엔진은 모델 및 요청 일괄 처리에 관한 모든 것을 처리하며, 서버는 사용자 요청을 전달합니다.

## 10.1. 엔진

<div class="content-ad"></div>

엔진은 모델을 실행하고 세대 프로세스에 대한 다양한 종류의 최적화 기술에 대해 지금까지 다룬 내용입니다. 이러한 엔진은 Python 라이브러리로 구성되어 있습니다. 이들은 사용자로부터 오는 요청을 배치 처리하고 해당 요청에 대한 응답을 생성합니다.

## 10.2. 서버

서버는 사용자로부터 들어오는 HTTP/gRPC 요청을 조율하는 역할을 합니다. 실제 응용프로그램에서는 여러 사용자가 하루 중 다양한 시간에 챗봇에 질문을 하게 될 것입니다. 서버는 이러한 요청을 큐에 넣고 응담을 생성하기 위해 엔진으로 전달합니다. 서버는 또한 모델 서빙을 추적하기 위해 중요한 처리량 및 대기 시간과 같은 메트릭스를 가져옵니다.

## 10.3. 기능들

<div class="content-ad"></div>

엔진

- 메모리 최적화
- 모델별 최적화
- 배칭 지원

서버

- HTTP/gRPC API
- 요청 대기열
- 멀티모델 서빙
- 멀티 엔진 지원

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_25.png" />

지금까지 우리는 모델이 단일 요청을 처리하는 간단한 시나리오에 대해 논의했습니다. 그러나 현실 세계의 응용 프로그램은 수백 명, 심지어 수천 명의 사용자에게 동시에 서비스를 제공하는 능력을 요구합니다. 이제 우리의 초점은 PagedAttention을 사용한 요청 배치 및 메모리 최적화를 통해 비용 및 처리량을 최적화하는 비용 효율적 및 높은 처리량을 보장하는 모델 호스팅에 대한 다음 중요한 고려 사항으로 이동합니다. 이러한 최적화는 모델을 효율적으로 호스팅하고, 사용자 수요가 큰 경우 비용 효율성과 높은 처리량을 모두 보장하기 위한 중요한 역할을 합니다.

# 11. LLM 서비스용 프레임워크

이제 중요한 측정 지표, 트레이드 오프 및 기술들을 다룬 LLM 서비스에서의 중요한 도전 과제를 다루었습니다. 핵심 질문은 모든 이 기술을 어떻게 실현할까요? 어떤 도구가 우리의 요구 사항과 가장 잘 맞고, 프레임워크에 대해 알아두어야 할 것은 무엇일까요?

<div class="content-ad"></div>

이 섹션에서는 산업에서 인기 있는 널리 사용되는 프레임워크들을 선택하여 업계의 주요 프레임워크에 대한 세부 정보를 살펴보며 벤치마킹 실험에서 얻은 주요 결과를 공유합니다. 각 프레임워크는 추론 도중 Large Language Models (LLMs)의 성능을 최적화하고 향상시키는 독특한 가치를 가지고 있습니다. 이러한 프레임워크를 서버와 엔진 두 그룹으로 분류했습니다. 최종적으로 입수한 도구들과 우리의 특정 LLM 서빙 요구 사항에 잘 맞는지에 대해 명확한 그림을 그릴 수 있을 것입니다.

# 11.1. vLLM

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_26.png)

LLM 추론과 서빙을 위한 빠르고 쉽게 사용할 수 있는 라이브러리입니다. HuggingFace Transformers (HF)보다 14배에서 24배 높은 처리량을 달성하며, HuggingFace Text Generation Inference (TGI)보다 2.2배에서 2.5배 높은 처리량을 달성합니다.

<div class="content-ad"></div>

사용법

오프라인 일괄 추론:

```js
# pip install vllm
from vllm import LLM, SamplingParams
```

```js
prompts = ["Funniest joke ever:", "The capital of France is", "The future of AI is"];
sampling_params = SamplingParams((temperature = 0.95), (top_p = 0.95), (max_tokens = 200));
llm = LLM((model = "huggyllama/llama-13b"));
outputs = llm.generate(prompts, sampling_params);
```

<div class="content-ad"></div>

```js
# 출력값을 위한 반복문:
for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

API 서버:

```js
# 서버 시작:
python -m vllm.entrypoints.api_server --env MODEL_NAME=huggyllama/llama-13b
```

```js
# 쉘에서 모델에 쿼리하기:
curl http://localhost:8000/generate \
    -d '{
        "prompt": "Funniest joke ever:",
        "n": 1,
        "temperature": 0.95,
        "max_tokens": 200
    }'
```

<div class="content-ad"></div>

킬러 피처

- 연속 배치 - 반복 단위 스케줄링, 배치 크기가 각 반복마다 결정됩니다. 배칭 덕분에 vLLM은 무거운 쿼리 부하 아래에서도 잘 작동할 수 있습니다.
- PagedAttention - 클래식한 아이디어인 가상 메모리 및 운영 체제에서의 페이지 이용을 영감으로 한 어텐션 알고리즘입니다. 이것이 모델 가속의 비밀 무기입니다.

장점

- 텍스트 생성 속도 - 라이브러리를 사용하여 여러 실험을 진행했는데 결과에 만족했습니다. 지금까지 vLLM을 사용한 추론은 가장 빠른 옵션으로 높은 성능을 보이고 있습니다.
- 고처리량 서빙 - 병렬 샘플링, 빔 서치 등 다양한 디코딩 알고리즘 포함.
- OpenAI 호환 API 서버 - OpenAI API를 사용한다면, 엔드포인트의 URL만 교체하면 됩니다.

<div class="content-ad"></div>

제한 사항

라이브러리는 사용자 친화적인 기능과 다양한 기능을 제공하지만 몇 가지 제한 사항을 발견했습니다:

- 사용자 정의 모델 추가: 우리만의 모델을 통합할 수는 있지만, 해당 모델이 vLLM의 기존 모델과 비슷한 아키텍처를 사용하지 않는 경우 프로세스가 더 복잡해집니다. 예를 들어, Falcon 지원을 추가하기 위한 풀 리퀘스트를 발견했는데, 이는 꽤 어려운 작업으로 보였습니다.
- 어댑터(LoRA, QLoRA 등) 지원 부족: 오픈 소스 LLM은 특정 작업에 맞게 세밀하게 조정될 때 중요한 가치를 지닙니다. 그러나 현재 구현에서는 모델과 어댑터 가중치를 별도로 사용하는 옵션이 없어서 이러한 모델을 효율적으로 활용하는 유연성이 제한됩니다.
- 가중치 양자화의 결여: 가끔 LLM은 사용 가능한 GPU 메모리에 맞지 않을 수 있으며, 메모리 소비를 줄이는 것이 중요해질 수 있습니다.

이것은 LLM 추론을 위한 가장 빠른 라이브러리입니다. 내부 최적화 덕분에 경쟁 상대들을 크게 능가합니다. 그러나 제한된 모델 범위를 지원하는 데 약점이 있습니다.

<div class="content-ad"></div>

vLLM개발 로드맵은 여기를 참조해 주세요.

# 11.2. 텍스트 생성 추론

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_27.png)

텍스트 생성 추론 (TGI)은 대형 언어 모델 (LLM)의 배포 및 제공을 위한 툴킷입니다. TGI는 Llama, Falcon, StarCoder, BLOOM, GPT-NeoX 및 T5를 포함한 가장 인기있는 오픈 소스 LLM을 위한 고성능 텍스트 생성을 가능하게 합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_28.png)

텍스트 생성 추론을 위한 Rust, Python 및 gRPC 서버입니다. HuggingFace에서 LLMs API 추론 위젯을 구동하는 데 사용됩니다.

사용법

도커를 사용하여 웹 서버 실행:


<div class="content-ad"></div>

```bash
mkdir data
docker run --gpus all --shm-size 1g -p 8080:80 \
-v data:/data ghcr.io/huggingface/text-generation-inference:0.9 \
  --model-id huggyllama/llama-13b \
  --num-shard 1
```

Make queries:

```python
# pip install text-generation
from text_generation import Client
```

```python
client = Client("http://127.0.0.1:8080")
prompt = "Funniest joke ever:"
print(client.generate(prompt, max_new_tokens=17, temperature=0.95).generated_text)
```

<div class="content-ad"></div>

요약된 기능들

- 내장 Prometheus 메트릭 — 서버 부하를 모니터하고 성능에 대한 통찰을 얻을 수 있습니다.
- Flash-attention (및 v2) 및 Paged Attention을 사용한 추론을 위한 최적화된 트랜스포머 코드. 모든 모델이 이러한 최적화를 지원하는 것은 아닙니다. 드문 구조물과 작업할 경우 도전에 직면할 수 있습니다.

장점들

- 모든 의존성이 도커에 설치되어 있음 — 즉시 기계에서 작동하는 준비된 환경을 얻을 수 있습니다.
- HuggingFace 모델에 대한 네이티브 지원 — 모델을 쉽게 실행하거나 HuggingFace Model Hub에서 사용할 수 있습니다.
- 모델 추론을 제어: 프레임워크는 정확도 조절, 양자화, 텐서 병렬성, 반복 패널티 등을 포함한 다양한 옵션을 제공합니다.

<div class="content-ad"></div>

제한 사항

- 어댑터 지원 부재 — 어댑터를 사용하여 LLM을 배포할 수는 있지만 (이 비디오를 참고하시기를 권장합니다), 현재 그에 대한 공식 지원 또는 문서가 없음을 알려드립니다.
- 소스 코드에서 컴파일해야 하는 필요성 (Rust + CUDA 커널) — Rust를 좋아하지만, 모든 데이터 과학팀이 익숙하지는 않아서 라이브러리에 사용자 정의 변경을 통합하는 것이 어려울 수 있습니다.
- 미완성된 문서: 모든 정보는 프로젝트의 README에 있습니다. 기본적인 것은 다루고 있지만, 저는 Rust 언어와 연관된 작업을 할 때 추가 세부 정보를 문제나 소스 코드에서 찾아야 했던 경우가 있었습니다 (특히 저에게는 어려운 상황이었습니다).

저는 이것이 경쟁에서 선두주자 중 하나라고 생각합니다. 라이브러리는 잘 작성되어 있으며, 모델 배포 중에는 최소한의 어려움만 겪었습니다. 만약 HuggingFace와의 네이티브 통합을 원한다면 이것을 고려해볼 가치가 있습니다. 프로젝트 팀이 최근에 라이선스를 변경했다는 점을 유의해 주세요.

TGI 개발 로드맵은 여기에서 확인할 수 있습니다.

<div class="content-ad"></div>

# 11.3. CTranslate2

![image](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_29.png)

10점 만점에 내 점수

CTranslate2는 Transformer 모델을 사용한 효율적 추론을 위한 C++ 및 Python 라이브러리입니다.

<div class="content-ad"></div>

사용 방법

먼저 모델을 변환하세요:

```js
pip install -qqq transformers ctranslate2
```

```js
# 모델은 먼저 CTranslate2 모델 형식으로 변환되어야 합니다:
ct2-transformers-converter --model huggyllama/llama-13b --output_dir llama-13b-ct2 --force
```

<div class="content-ad"></div>

쿼리를 작성하세요:

```js
import ctranslate2
import transformers
```

```js
generator = ctranslate2.Generator("llama-13b-ct2", (device = "cuda"), (compute_type = "float16"));
tokenizer = transformers.AutoTokenizer.from_pretrained("huggyllama/llama-13b");
```

```js
prompt = "Funniest joke ever:";
tokens = tokenizer.convert_ids_to_tokens(tokenizer.encode(prompt));
results = generator.generate_batch([tokens], (sampling_topk = 1), (max_length = 200));
tokens = results[0].sequences_ids[0];
output = tokenizer.decode(tokens);
print(output);
```

<div class="content-ad"></div>

킬러 피처

- CPU 및 GPU에서 빠르고 효율적인 실행 — 레이어 퓨전, 패딩 제거, 배치 재정렬, 인플레이스 연산, 캐싱 메커니즘 등의 내장 최적화 레이어 덕분에 추론 LLMs는 빨라지고 더 적은 메모리를 필요로 합니다.
- 동적 메모리 사용 — 요청 크기에 따라 메모리 사용량이 동적으로 변경되지만 CPU 및 GPU의 캐싱 할당자 덕분에 여전히 성능 요구 사항을 충족합니다.
- 다양한 CPU 아키텍처 지원 — 이 프로젝트는 x86–64 및 AArch64/ARM64 프로세서를 지원하며 이러한 플랫폼에 최적화된 여러 백엔드를 통합하고 있습니다: Intel MKL, oneDNN, OpenBLAS, Ruy 및 Apple Accelerate.

장점

- 병렬 및 비동기 실행 — 여러 배치를 병렬로 처리하고 GPU 또는 CPU 코어를 사용하여 비동기적으로 실행할 수 있습니다.
- 빠른 캐싱 — 모델은 한 번 정적 프롬프트에서 실행되고 모델 상태가 캐싱되어 동일한 정적 프롬프트로의 미래 호출에 재사용됩니다.
- 디스크 공간을 절약하는 경량화 — 양자화를 통해 모델의 디스크 사용량을 최소화하고 정확도 손실을 최소화할 수 있습니다.

<div class="content-ad"></div>

제약 사항

- 내장된 REST 서버가 없습니다 — REST 서버를 여전히 실행할 수는 있지만, 로깅 및 모니터링 기능이 포함된 사전 제작된 서비스가 없어 아쉬웠습니다.
- 어댑터 (LoRA, QLoRA 등)를 지원하지 않는 점.

이 라이브러리는 매우 흥미로운 것 같아요. 개발자들이 GitHub의 릴리스와 커밋을 통해 활발히 작업 중이며, 응용 프로그램에 대한 정보성 있는 블로그 게시물도 공유하고 있습니다. 라이브러리의 다양한 최적화 기능은 인상적이며, 주요 하이라이트는 CPU에서 LLM 추론을 수행할 수 있는 능력입니다.

# 11.4. DeepSpeed-MII

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_30.png" />

10 점 척도의 개인 평가

MII는 DeepSpeed에 의해 구동되어 낮은 대기 시간과 고 처리량 추론을 가능하게 합니다.

사용법

<div class="content-ad"></div>

웹 서버를 실행하세요:

```js
# pip install deepspeed-mii를 사용하여 설치하지 마세요
# git clone https://github.com/microsoft/DeepSpeed-MII.git
# git reset --hard 60a85dc3da5bac3bcefa8824175f8646a0f12203
# cd DeepSpeed-MII && pip install .
# pip3 install -U deepspeed
```

```js
# ... 그리고 CUDA 버전이 동일한지 확인하세요:
# python -c "import torch;print(torch.version.cuda)" == nvcc --version
import mii
```

```js
mii_configs = {
  dtype: "fp16",
  max_tokens: 200,
  tensor_parallel: 1,
  enable_load_balancing: False,
};
mii.deploy(
  (task = "text-generation"),
  (model = "huggyllama/llama-13b"),
  (deployment_name = "llama_13b_deployment"),
  (mii_config = mii_configs)
);
```

<div class="content-ad"></div>

테이블 태그를 마크다운 형식으로 변경해주세요.

<div class="content-ad"></div>

- 다중 레플리카에 대한 로드 밸런싱 - 많은 사용자를 처리하기에 매우 유용한 도구입니다. 로드 밸런서는 효율적으로 들어오는 요청을 다양한 레플리카 사이에 분배하여 애플리케이션 응답 시간을 향상시킵니다.
- 비영속적 배포 - 업데이트가 대상 환경에 영구적으로 적용되지 않는 방식입니다. 리소스 효율성, 보안, 일관성, 그리고 관리 편의성이 중요한 시나리오에서 가치 있는 선택지입니다. 운영 오버헤드를 줄이면서 통제될 수 있고 표준화된 환경을 제공합니다.

장점

- 다양한 모델 저장소 - Hugging Face, FairSeq, EluetherAI 등 다양한 오픈 소스 모델 저장소를 통해 제공됩니다.
- 지연 시간과 비용 절감 측정 - MII는 매우 비용이 많이 드는 언어 모델의 추론 비용을 크게 줄일 수 있습니다.
- 네이티브 및 Azure 통합 - 마이크로소프트가 개발한 MII 프레임워크는 그들의 클라우드 시스템과 탁월한 통합을 제공합니다.

제한 사항

<div class="content-ad"></div>

- 공식 릴리스 부재 — 기능적 애플리케이션을 위한 적합한 커밋을 찾는 데 몇 시간이 걸렸어요. 일부 문서의 일부는 오래되었고 더 이상 관련성이 없어요.
- 제한된 모델 수 — Falcon, LLaMA 2 등의 언어 모델을 지원하지 않아요. 실행할 수 있는 모델의 수가 제한적이에요.
- 어댑터(LoRA, QLoRA 등) 지원 부재

이 프로젝트는 커뮤니티에서 명성을 쌓은 신뢰할 수 있는 DeepSpeed 라이브러리를 기반으로 합니다. 안정성과 검증된 솔루션을 찾는다면, MII가 훌륭한 선택일 거에요. 제 실험에 따르면, 이 라이브러리는 단일 프롬프트를 처리하는 데 최고의 속도를 보여줍니다. 그럼에도 불구하고, 우리 시스템에 구현하기 전에 이 프레임워크를 우리 구체적인 작업에 테스트하는 것을 권유해요.

# 11.5. OpenLLM

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_31.png)

<div class="content-ad"></div>

개인적인 평가는 10점 척도로 합니다.

운영 중인 대형 언어 모델 (LLMs)을 위한 오픈 플랫폼입니다.

사용법

웹 서버 실행:

<div class="content-ad"></div>


```js
pip install openllm scipy
openllm start llama --model-id huggyllama/llama-13b \
  --max-new-tokens 200 \
  --temperature 0.95 \
  --api-workers 1 \
  --workers-per-resource 1
```

쿼리를 생성하십시오:

```js
import openllm
```

```js
client = openllm.client.HTTPClient("http://localhost:3000");
print(client.query("Funniest joke ever:"));
```

<div class="content-ad"></div>

킬러 피쳐

- 어댑터 지원 — 여러 어댑터를 하나의 배포된 LLM에 연결할 수 있습니다. 하나의 모델을 여러 특수화된 작업에 사용할 수 있는 것을 상상해보세요.
- 런타임 구현 — PyTorch (pt), TensorFlow (tf), 또는 Flax (flax)와 같은 다양한 구현을 사용할 수 있습니다.
- HuggingFace 에이전트 — HuggingFace에서 다양한 모델을 연결하고 LLM 및 자연어로 관리할 수 있습니다.

장점

- 뛰어난 커뮤니티 지원 — 라이브러리는 지속적으로 발전하며 새로운 기능이 추가됩니다.
- 새 모델 통합 — 개발자는 우리 자체 모델을 추가하는 방법에 대한 가이드를 제공합니다.
- 양자화 — OpenLLM은 bitsandbytes 및 GPTQ를 통해 양자화를 지원합니다.
- LangChain 통합 — LangChain을 사용하여 원격 OpenLLM 서버와 상호 작용할 수 있습니다.

<div class="content-ad"></div>

제한사항

- 배치 처리 지원 부족 — 상당량의 메시지 스트림의 경우, 이는 응용 프로그램의 성능에서 병목 현상이 될 수 있습니다.
- 내장된 분산 추론 부재 — 여러 GPU 장치에서 대형 모델을 실행하려면 추가로 OpenLLM의 서빙 구성 요소 Yatai를 설치해야 합니다.

이 프레임워크는 다양한 기능을 갖추고 있는 좋은 도구입니다. 최소의 비용으로 유연한 애플리케이션을 구축할 수 있습니다. 문서에 완전히 다루어지지 않는 측면도 있겠지만, 이 라이브러리를 살펴보면 추가 기능에서 즐거운 놀라움을 발견할 가능성이 높습니다.

# 11.6. Ray Serve

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_32.png)

10점 만점에서 나의 개인 평가

Ray Serve는 온라인 추론 API를 구축하기 위한 확장 가능한 모델 서빙 라이브러리입니다. Serve는 프레임워크에 독립적이므로 딥 러닝 모델까지 모두 제공하는 단일 툴킷을 사용할 수 있습니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_33.png)

<div class="content-ad"></div>

Ray AIR는 엔드 투 엔드 ML 개발을 가능하게 하며 MLOps 생태계의 다른 도구 및 라이브러리와 통합할 수 있는 다양한 옵션을 제공합니다.

사용법

웹 서버 실행:

```js
# pip install ray[serve] accelerate>=0.16.0 transformers>=4.26.0 torch starlette pandas
# ray_serve.py
import pandas as pd
```

<div class="content-ad"></div>


import ray
from ray import serve
from starlette.requests import Request



@serve.deployment(ray_actor_options={"num_gpus": 1})
class PredictDeployment:
    def __init__(self, model_id: str):
        from transformers import AutoModelForCausalLM, AutoTokenizer
        import torch



self.model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch.float16,
            device_map="auto",
        )
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)



def generate(self, text: str) -> pd.DataFrame:
        input_ids = self.tokenizer(text, return_tensors="pt").input_ids.to(
            self.model.device
        )
        gen_tokens = self.model.generate(
            input_ids,
            temperature=0.9,
            max_length=200,
        )
        return pd.DataFrame(
            self.tokenizer.batch_decode(gen_tokens), columns=["responses"]
        )


<div class="content-ad"></div>

```js
비동기 def __call__(self, http_request: Request) -> str:
        json_request: str = await http_request.json()
        return self.generate(prompt["text"])
```

```js
deployment = PredictDeployment.bind((model_id = "huggyllama/llama-13b"));
```

```js
# 그런 다음 CLI 명령에서 실행하십시오:
# serve run ray_serve:deployment
```

쿼리를 실행하세요:

<div class="content-ad"></div>


```js
import requests
```

```js
sample_input = { text: "Funniest joke ever:" };
output = requests.post("http://localhost:8000/", (json = [sample_input])).json();
print(output);
```

Killer features

- Monitoring dashboard and Prometheus metrics — We can use the Ray dashboard to get a high-level overview of our Ray cluster and Ray Serve application’s states.
- Autoscale across multiple replicas — Ray adjusts to traffic spikes by observing queue sizes and making scaling decisions to add or remove replicas.
- Dynamic Request Batching — It is necessary when our model is expensive to use and we want to maximize the utilization of hardware.



<div class="content-ad"></div>

장점

- 포괄적인 문서 — 개발자들이 이 측면에 시간을 할애하고 문서 작성에 성실히 접근해 준 것에 감사드립니다. 거의 모든 사용 사례에 대한 다양한 예제를 찾을 수 있어 매우 도움이 됩니다.
- 프로덕션 준비 — 내 의견으로는 이 리스트에 나열된 모든 프레임워크 중에서 가장 성숙한 프레임워크입니다.
- 네이티브 LangChain 통합 — LangChain을 사용하여 원격 Ray 서버와 상호 작용할 수 있습니다.

단점

- 내장된 모델 최적화 부족 — Ray Serve는 LLM에 초점을 맞추지 않고, 모든 ML 모델을 배포하는 보다 폭넓은 프레임워크입니다. 최적화를 직접 해야 합니다.
- 높은 진입 장벽 — 라이브러리가 때로는 추가 기능으로 과부하되어 진입 임계값을 높이며, 새로운 사용자가 이를 탐색하고 이해하는 데 어려움을 겪게 만듭니다.

<div class="content-ad"></div>

만약 딥 러닝에 관한 것 뿐만 아니라 가장 실전 준비가 된 솔루션이 필요하다면, Ray Serve가 좋은 선택지입니다. 이는 기업에서 가용성, 확장성 및 관측 가능성이 중요한 상황에 가장 적합합니다. 또한 데이터 처리, 훈련, 세밀 튜닝 및 서빙을 위한 방대한 생태계를 활용할 수 있습니다. 마지막으로, 이는 OpenAI부터 Shopify 및 Instacart까지 다양한 회사에서 사용하고 있습니다.

# 11.7. MLC LLM

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_34.png)

10점 척도의 개인적인 평가

<div class="content-ad"></div>

MLC LLM은 모든 사용자 장치에서 효율적으로 실행되도록 하여 LLM이 기본 하드웨어 가속을 활용할 수 있게 하는 범용 배포 솔루션입니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_35.png)

MLC LLM의 고수준 프로젝트 개념

사용법

<div class="content-ad"></div>

웹 서버를 실행하려면:

```js
# 1. Python 버전이 3.9 이상인지 확인하세요.
# 2. conda를 사용하여 실행해야 합니다:
conda create -n mlc-chat-venv -c mlc-ai -c conda-forge mlc-chat-nightly
conda activate mlc-chat-venv
```

```js
# 3. 그런 다음 패키지를 설치하세요:
pip install --pre --force-reinstall mlc-ai-nightly-cu118 \
  mlc-chat-nightly-cu118 \
  -f https://mlc.ai/wheels
```

```js
# 4. HuggingFace에서 모델 가중치 및 바이너리 라이브러리를 다운로드하세요:
git lfs install && mkdir -p dist/prebuilt && \
  git clone https://github.com/mlc-ai/binary-mlc-llm-libs.git dist/prebuilt/lib && \
  cd dist/prebuilt && \
  git clone https://huggingface.co/huggyllama/llama-13b dist/ && \
  cd ../..


# 5. 서버를 실행하세요:
python -m mlc_chat.rest --device-name cuda --artifact-path dist
```

<div class="content-ad"></div>

```js
쿼리 생성:

import requests
```

```js
페이로드 = {
  model: "lama-30b",
  messages: [{ role: "user", content: "Funniest joke ever:" }],
  stream: False,
};
r = requests.post("http://127.0.0.1:8000/v1/chat/completions", (json = payload));
print(r.json()["choices"][0]["message"]["content"]);
```

핵심 기능

<div class="content-ad"></div>

- 플랫폼 네이티브 런타임 - 사용자 장치의 네이티브 환경에 배포하여 Python 또는 기타 필요한 종속성이 즉시 사용 가능하지 않을 수 있습니다. 앱 개발자는 MLC 컴파일된 LLM을 프로젝트에 통합하기 위해 플랫폼 네이티브 런타임에 익숙해지기만 하면 됩니다.
- 메모리 최적화 - 다양한 기술을 사용하여 모델을 컴파일, 압축 및 최적화할 수 있어서 다양한 장치에 배포할 수 있습니다.

장점

- JSON 구성 파일에 모든 설정 - 단일 구성 파일에서 각 컴파일된 모델의 런타임 구성을 정의할 수 있습니다.
- 미리 빌드된 앱 - 우리는 다양한 플랫폼을 위해 모델을 컴파일할 수 있습니다: 명령 줄용 C++, 웹용 JavaScript, iOS용 Swift, Android용 Java/Kotlin.

제한사항

<div class="content-ad"></div>

- LLM 모델 사용의 기능 제한: 어댑터 지원 없음, 정밀도 변경 불가, 토큰 스트리밍 불가 등. 이 라이브러리는 주로 다양한 장치용 모델을 컴파일하는 데 중점을 두고 있습니다.
- 그룹 양자화만 지원함 — 이 방법이 좋은 결과를 보여주긴 하지만, 다른 양자화 방법(bitsandbytes 및 GPTQ)이 커뮤니티에서 더 인기가 있습니다. 아마도 커뮤니티에 의해 더 잘 개발될 것으로 예상됩니다.
- 복잡한 설치 — 이 라이브러리를 올바르게 설치하는 데 몇 시간이 걸렸습니다. 아마도 초보 개발자에겐 적합하지 않을 것으로 보입니다.

iOS 또는 Android 기기에 애플리케이션을 배포해야 할 경우, 이 라이브러리가 정확히 필요한 것입니다. 이를 통해 모델을 빠르게 그리고 네이티브로 컴파일하고 기기에 배포할 수 있습니다. 그러나 서버에 높은 부하가 필요하다면 이 프레임워크를 선택하지 않는 것이 좋습니다.

# 결론

우리는 다른 설정을 사용하여 백서에서 이러한 프레임워크들의 성능과 제공 기능을 평가했습니다. TensorRT-LLM, vLLM과 같은 엔진 또는 RayLLM 및 RayServe와 같은 서버, TensorRT-LLM 및 Triton과 같은 Text Generation Inference (TGI) 등 각 프레임워크는 서로 다른 용도에 적합한 가치 있는 고유한 기능을 제공합니다. 우리의 벤치마킹 연구는 메모리 할당 문제부터 사전 철수의 전략적 트레이드오프, 그리고 시퀀스 길이가 처리량에 미치는 영향까지 세심한 발견을 촬영했습니다. 실험에서 얻은 내용에 대한 간략한 개괄은 다음과 같습니다:

<div class="content-ad"></div>

- 메모리가 핵심입니다. 메모리 할당 관리는 LLM 성능 최적화를 위해 중요합니다.
- vLLM과 같은 엔진을 위해 선점은 중요한 전략적 트레이드 오프입니다. 세대 작업이 메모리에 바운드되어 있고 GPU가 underutilized되는 상황에서입니다.
- 시퀀스 길이 통찰력은 vLLM이 특히 더 짧은 출력과 함께 동시 요청을 처리하는 효율성을 나타냅니다.
- 모델 크기는 처리량에 signifiant한 영향을 미칩니다. 그러나 어느 정도 이상 되면 추가 GPU 메모리는 처리량 향상에 더 이상 기여하지 않습니다.
- 서버 선택은 중요한 역할을 합니다. TensorRT-LLM이 Triton을 이용해 독립적인 TensorRT-LLM보다 우수성을 나타내는 것이 이를 입증합니다.

![이미지](/assets/img/2024-05-27-BuildingLLMApplicationsServingLLMsPart9_36.png)

LLMs 추론을 위한 다양한 프레임워크가 많이 있지만, 각각이 특정 목적을 수행합니다. 고려해야 할 몇 가지 주요 사항은 다음과 같습니다:

- 배치된 프롬프트 전달에 최대 속도가 필요할 때는 vLLM을 사용하세요.
- 네이티브 HuggingFace 지원이 필요하고 핵심 모델에 대해 여러 어댑터를 사용할 계획이 없는 경우 텍스트 생성 추론을 선택하세요.
- 속도가 중요하고 CPU에서 추론을 실행할 계획이 있는 경우 CTranslate2를 고려하세요.
- 어댑터를 핵심 모델에 연결하고 HuggingFace 에이전트를 활용하려는 경우 특히 PyTorch에 완전히 의존하지 않는 경우 OpenLLM을 선택하세요.
- 안정적인 파이프라인과 유연한 배포를 위해 Ray Serve를 고려하세요. 보다 성숙한 프로젝트에 가장 적합합니다.
- LLM을 클라이언트 측(에지 컴퓨팅)에 네이티브로 배포하려는 경우(예: Android 또는 iPhone 플랫폼) MLC LLM을 활용하세요.
- DeepSpeed 라이브러리에 이미 경험이 있고 이를 계속 사용하여 LLM을 배포하려는 경우 DeepSpeed-MII를 사용하세요.

<div class="content-ad"></div>

# 크레딧

이 블로그 포스트에서 우리는 연구 논문, 기술 블로그, 공식 문서, YouTube 비디오 등 다양한 소스에서 정보를 모았습니다. 각 소스는 해당 이미지 아래 적절하게 표시되었으며 소스 링크가 제공되었습니다.

아래는 참고문헌의 통합 목록입니다:

- https://python.langchain.com/v0.1/docs/guides/development/local_llms/#running-apple-silicon-gpu
- https://www.maartengrootendorst.com/blog/quantization/
- https://www.run.ai/blog/serving-large-language-models
- https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/
- https://betterprogramming.pub/frameworks-for-serving-llms-60b7f7b23407

<div class="content-ad"></div>

# 읽어주셔서 감사합니다!

만약 이 안내서가 여러분의 Python 및 머신러닝 이해를 향상시키는 데 도움이 되었다면:

- 박수 👏 또는 여러 개의 박수로 지원을 표현해주세요!
- 여러분의 박수는 저에게 더 가치 있는 콘텐츠를 만드는 데 도움이 됩니다.
- 이 가이드를 Python 또는 AI / ML 열렬한 사용자들과 공유해주세요.
- 여러분의 피드백은 소중합니다. 앞으로의 글을 영감을 주고 이끌어주는 역할을 합니다.

# 저와 소통해주세요!

<div class="content-ad"></div>

### Vipra
