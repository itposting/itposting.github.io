---
title: "6가지 방법으로 LLMs를 로컬에서 실행하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-6WaystoRunLLMsLocally_0.png"
date: 2024-06-19 21:41
ogImage: 
  url: /assets/img/2024-06-19-6WaystoRunLLMsLocally_0.png
tag: Tech
originalTitle: "6 Ways to Run LLMs Locally"
link: "https://medium.com/@semaphoreci/6-ways-to-run-llms-locally-fa25be0797e5"
---


상용 AI 및 대규모 언어 모델(LLM)은 한 가지 큰 단점이 있습니다: 개인 정보 보호 문제! 민감하거나 자사 데이터를 다룰 때 이러한 도구를 활용할 수 없습니다.

이로 인해 로컬에서 개인 LLM을 운영하는 방법에 대해 알아야 합니다. 오픈 소스 모델은 해결책을 제시하지만 그들만의 일련의 도전과 혜택이 따릅니다.

당신의 컴퓨터에서 실행할 수 있는 ChatGPT의 로컬 대안을 발견하기 위한 여정에 함께해주세요.

# 기대치 설정

<div class="content-ad"></div>

오픈 소스는 다양한 모델이 제공되므로 Meta와 같은 대규모 조직에서 제공하는 모델부터 개별 열정가들이 개발한 모델까지 수천 가지가 있습니다. 그러나 이러한 모델을 실행하는 것은 고유의 일련의 도전 과제를 제시할 수 있습니다:

- 강력한 하드웨어가 필요할 수 있습니다: 많은 메모리와 가능한 경우 GPU
- 오픈 소스 모델은 개선되고 있지만, 대개 ChatGPT와 같은 더 정교한 제품의 능력을 따라잡지 못할 수 있습니다. 이러한 제품들은 대규모 엔지니어 팀의 지원을 받고 있습니다.
- 모든 모델을 상업적으로 사용할 수 있는 것은 아닙니다.

Google의 유출 문서에 따르면 오픈 소스와 폐쇄 소스 모델 간의 간격이 좁혀지고 있다고 합니다.

![이미지](/assets/img/2024-06-19-6WaystoRunLLMsLocally_0.png)

<div class="content-ad"></div>

# 1. Hugging Face와 Transformers

Hugging Face은 머신러닝과 인공지능을 위한 도커 허브와 같은 서비스로, 다양한 오픈소스 모델을 제공합니다. 다행히도, Hugging Face는 주기적으로 모델을 평가하고 가장 좋은 모델을 선택할 수 있도록 리더보드를 제공합니다.

또한, Hugging Face는 transformers라는 파이썬 라이브러리도 제공하는데, 이 라이브러리는 로컬에서 LLM을 간편하게 실행할 수 있게 해줍니다. 아래 예제는 라이브러리를 사용하여 이전 버전의 GPT-2 microsoft/DialoGPT-medium 모델을 실행하는 방법을 보여줍니다. 첫 번째 실행 시 Transformers는 모델을 다운로드하고, 이 모델을 사용하여 다섯 번의 대화를 할 수 있습니다. 이 스크립트를 실행하기 위해서는 PyTorch도 설치되어 있어야 합니다.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
```

<div class="content-ad"></div>

```js
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium", padding_side='left')
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
# 출처: https://huggingface.co/microsoft/DialoGPT-medium
# 5줄 동안 채팅해 봅시다
for step in range(5):
    # 새로운 사용자 입력을 인코딩하고 eos_token을 추가하여 Pytorch의 텐서를 반환합니다
    new_user_input_ids = tokenizer.encode(input(">> 사용자:") + tokenizer.eos_token, return_tensors='pt')
    # 채팅 기록 텐서에 새로운 사용자 입력 토큰을 추가합니다
    bot_input_ids = torch.cat([chat_history_ids, new_user_input_ids], dim=-1) if step > 0 else new_user_input_ids
    # 총 채팅 기록을 1000 토큰으로 제한하며 응답을 생성합니다
    chat_history_ids = model.generate(bot_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
    # 최신 출력 토큰을 이쁘게 출력합니다
    print("DialoGPT: {}".format(tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)))
```

Transformers 장점:

- 모델 자동 다운로드
- 코드 조각 사용 가능
- 실험 및 학습에 이상적

Transformers 단점:

<div class="content-ad"></div>

- ML 및 NLP에 대한 좋은 이해가 필요합니다.
- 코딩 및 구성 기술이 필요합니다.

## 2. LangChain

로컬에서 LLM을 실행하는 또 다른 방법은 LangChain을 사용하는 것입니다. LangChain은 AI 애플리케이션을 구축하기 위한 Python 프레임워크입니다. 지원하는 모델 중 하나 위에 AI 애플리케이션을 개발하기 위한 추상화 및 미들웨어를 제공합니다. 예를 들어 아래 코드는 microsoft/DialoGPT-medium 모델에 한 가지 질문을 하는 코드입니다:

```js
from langchain.llms.huggingface_pipeline import HuggingFacePipeline
``` 

<div class="content-ad"></div>

```js
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

LangChain Pros:

- 모델 관리가 쉽습니다
- AI 응용 프로그램 개발을 위한 유용한 유틸리티들

LangChain Cons:

<div class="content-ad"></div>

- 속도가 제한되어 있어 Transformers와 동일합니다
- 여전히 애플리케이션 로직을 코딩하거나 적합한 UI를 만들어야 합니다.

# 3. Llama.cpp

Llama.cpp은 LLM을 위한 C 및 C++ 기반 추론 엔진으로, Apple 실리콘에 최적화되어 있으며 Meta의 Llama2 모델을 실행할 수 있습니다.

저장소를 복제하고 프로젝트를 빌드한 후에는 다음을 사용하여 모델을 실행할 수 있습니다:

<div class="content-ad"></div>

```js
$ ./main -m /path/to/model-file.gguf -p "안녕하세요!"
```

Llama.cpp의 장점:

- Python 기반의 솔루션보다 높은 성능
- Llama 7B와 같은 대형 모델을 저사양 하드웨어에서 지원
- 다른 언어로 AI 애플리케이션을 빌드하기 위한 바인딩을 제공하며 추론은 Llama.cpp를 통해 실행됨.

Llama.cpp의 단점:

<div class="content-ad"></div>

- 제한된 모델 지원
- 도구 빌딩이 필요합니다

## 4. 람파파일

Mozilla에서 개발한 람파파일은 LLM(?)을 실행하는 사용자 친화적인 대안을 제공합니다. 람파파일은 휴대성과 하나의 파일로 실행 가능한 능력으로 유명합니다.

람파파일을 다운로드한 후 GGUF 형식의 모델과 함께 사용하면 로컬 브라우저 세션을 시작할 수 있습니다:

<div class="content-ad"></div>

```js
$ ./llamafile -m /path/to/model.gguf
```

Llamafile 장점:

- Llama.cpp와 동일한 속도 장점을 누릴 수 있습니다.
- 모델이 포함된 단일 실행 파일을 빌드할 수 있습니다.

Llamafile 단점:

<div class="content-ad"></div>

- 프로젝트는 아직 초기 단계에 있어요.
- 모든 모델이 지원되는 것은 아니에요. Llama.cpp가 지원하는 모델만 지원돼요.

# 5. Ollama

Ollama는 Llama.cpp와 Llamafile에 대한 더 사용하기 쉬운 대안이에요. 실행 파일을 다운로드하여 설치하는 서비스를 머신에 설치해요. 설치가 완료되면 터미널을 열고 아래와 같이 실행해주세요.

```js
$ ollama run llama2
```

<div class="content-ad"></div>

Ollama는 모델을 다운로드하고 대화형 세션을 시작할 것입니다.

Ollama 장점:

- 설치 및 사용이 쉽습니다.
- 람마와 비쿠냐 모델을 실행할 수 있습니다.
- 속도가 정말 빠릅니다.

Ollama 단점:

<div class="content-ad"></div>

- 모델 라이브러리 제공이 제한적입니다.
- 모델을 스스로 관리하며, 사용자 지정 모델을 재사용할 수 없습니다.
- LLM을 실행할 때 조정 가능한 옵션이 없습니다.
- 아직 Windows 버전은 없습니다.

# 6. GPT4ALL

GPT4ALL은 직관적인 GUI를 갖춘 사용하기 쉬운 데스크톱 응용 프로그램입니다. 로컬 모델 실행을 지원하며, OpenAI에 API 키를 사용하여 연결할 수 있습니다. GPT4ALL은 문맥을 위해 로컬 문서를 처리하는 능력으로 두드러집니다. 개인 정보 보호를 보장합니다.

![이미지](/assets/img/2024-06-19-6WaystoRunLLMsLocally_1.png)

<div class="content-ad"></div>

장점:

- 친근한 UI를 가진 정교한 대안
- 다양한 선별된 모델을 지원

단점:

- 모델 선택이 제한적
- 일부 모델은 상업적 이용 제약이 있음

<div class="content-ad"></div>

# 결론

LLM을 로컬에서 실행할 수 있는 적합한 도구를 선택하는 것은 여러분의 요구사항과 전문 지식에 달려 있어요. GPT4ALL과 같은 사용자 친화적인 응용 프로그램부터 Llama.cpp 및 Python 기반의 더 기술적인 옵션까지 다양한 선택지가 있어요. 오픈 소스 모델들이 새로운 기능들을 제공하며, 데이터와 개인 정보 보호에 대한 더 많은 통제 기회를 제공하고 있어요.

본 안내서는 로컬 LLM 세계를 탐색하는 데 도움이 되는 직관성을 제공하고 있어요. 이러한 모델들이 발전함에 따라, ChatGPT와 같은 제품들과 경쟁력을 갖출 것으로 약속되고 있어요.

2023년 12월 14일에 https://semaphoreci.com에 게재된 내용입니다.