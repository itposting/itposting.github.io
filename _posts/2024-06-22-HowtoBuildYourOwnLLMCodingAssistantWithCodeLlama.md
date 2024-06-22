---
title: "Code Llama로 나만의 LLM 코딩 어시스턴트 만드는 방법 "
description: ""
coverImage: "/assets/img/2024-06-22-HowtoBuildYourOwnLLMCodingAssistantWithCodeLlama_0.png"
date: 2024-06-22 21:36
ogImage: 
  url: /assets/img/2024-06-22-HowtoBuildYourOwnLLMCodingAssistantWithCodeLlama_0.png
tag: Tech
originalTitle: "How to Build Your Own LLM Coding Assistant With Code Llama 🤖"
link: "https://medium.com/towards-artificial-intelligence/how-to-build-your-own-llm-coding-assistant-with-code-llama-04d8340900a3"
---


이 실습에서는 무료로 사용할 수 있고 로컬 GPU에서 실행되는 AI 코드 어시스턴트를 구현할 예정입니다.

챗봇에 질문을 하면 자연어로 답변하며 여러 프로그래밍 언어로 코드도 제공합니다.

우리는 Hugging Face transformer 라이브러리를 사용하여 LLM을 구현하고 Chatbot 프론트 엔드에는 Streamlit을 사용할 것입니다.

# LLM이 텍스트를 생성하는 방법은 무엇인가요?

<div class="content-ad"></div>

디코더 전용 트랜스포머 모델인 GPT 계열은 주어진 입력 프롬프트에 대한 다음 단어를 예측하도록 훈련되었습니다. 이로 인해 텍스트 생성에 아주 능숙합니다.

![이미지](/assets/img/2024-06-22-HowtoBuildYourOwnLLMCodingAssistantWithCodeLlama_0.png)

충분한 훈련 데이터가 제공된다면, 코드를 생성하는 것도 배울 수 있습니다. IDE에서 코드를 채우는 방식이나 챗봇으로 질문에 답변하는 방식으로 가능합니다.

GitHub Copilot은 상용 예시로서 AI 페어 프로그래머의 한 예입니다. Meta AI의 Code Llama 모델은 유사한 능력을 갖추고 있지만 무료로 사용할 수 있습니다.

<div class="content-ad"></div>

# 코드 람마란 무엇인가요?

코드 람마는 Meta AI가 만들고 2023년 8월에 처음으로 출시한 코드 전용 LLM 계열의 특별한 제품입니다.

![이미지](/assets/img/2024-06-22-HowtoBuildYourOwnLLMCodingAssistantWithCodeLlama_1.png)

Meta AI는 기본 모델 Llama 2(디코더 전용 Transformer 모델로 GPT-4와 유사함)을 시작으로, 대부분 코드로 이루어진 500B 토큰의 교육 데이터를 활용하여 추가 교육을 진행했습니다.

<div class="content-ad"></div>

그 이후로 Code Llama에 대한 세 가지 버전이 네 가지 다른 크기로 제공됩니다.

Code Llama 모델은 연구 및 상업적 사용을 위해 무료입니다.

![이미지](/assets/img/2024-06-22-HowtoBuildYourOwnLLMCodingAssistantWithCodeLlama_2.png)

## Code Llama

<div class="content-ad"></div>

코드 Llama는 코드 생성을 위한 기반 모델입니다. 코드 Llama 모델은 infill 목적으로 훈련되어 IDE 내에서 코드 완성을 위해 설계되었습니다.

## 코드 Llama — Instruct

Instruct 버전은 인간의 질문에 답변하기 위해 지시 데이터셋에 맞춰 세밀하게 조정되었습니다. 이는 ChatGPT와 유사합니다.

## 코드 Llama — Python

<div class="content-ad"></div>

파이썬 버전은 추가 데이터셋인 100B 토큰의 파이썬 코드로 훈련되었습니다. 이 모델들은 코드 생성을 위해 의도되었습니다.

# LLM 챗봇 코딩

본 튜토리얼에서는 Instruct 버전 중 가장 작은 모델인 CodeLlama-7b-Instruct — hf를 사용할 것입니다. 이 모델은 자연어 질문에 답변하도록 세밀하게 튜닝되어 있기 때문에 챗봇으로 사용할 수 있습니다.

가장 작은 모델조차도 여전히 7B 매개변수로 상당히 큽니다. 매개변수의 16비트 반정밀도를 사용하면, 모델은 약 14 GB의 GPU 메모리가 필요합니다. 4비트 양자화를 사용하면, 메모리 요구 사항을 약 3.5 GB 정도로 줄일 수 있습니다.

<div class="content-ad"></div>

## 모델 구현하기

우리는 먼저 Hugging Face에서 Code Llama 모델을 불러오고 주어진 프롬프트에 기반하여 텍스트를 생성할 ChatModel 클래스를 생성하는 것으로 시작하겠습니다.

우리는 4비트 양자화를 위해 BitsAndBytesConfig를 사용하며, 모델을 로드하기 위해 AutoModelForCausalLM을 사용하고 입력 프롬프트로부터 토큰 임베딩을 생성하기 위해 AutoTokenizer를 사용합니다.

```js
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

class ChatModel:
    def __init__(self, model="codellama/CodeLlama-7b-Instruct-hf"):
        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True, # 4비트 양자화 사용
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            model,
            quantization_config=quantization_config,
            device_map="cuda",
            cache_dir="./models", # 모델을 models 폴더에 다운로드
        )
        self.tokenizer = AutoTokenizer.from_pretrained(
            model, use_fast=True, padding_side="left"
        )
```

<div class="content-ad"></div>

또한, 사용자의 이전 입력 프롬프트와 AI가 생성한 응답을 저장하는 고정 길이의 히스토리 목록을 만듭니다. 이는 대화의 기억을 제공하여 LLM에게 대화의 기억을 부여하는 데 유용합니다.

```js
self.history = []
self.history_length = 1
```

Code Llama은 사용자 프롬프트 앞에 시스템 프롬프트를 사용합니다.

기본적으로, codellama-13b-chat 예제에서 시스템 프롬프트를 사용할 수 있습니다.

<div class="content-ad"></div>

```js
self.DEFAULT_SYSTEM_PROMPT = """\
당신은 코드와 소프트웨어 디자인에 대한 깊은 지식을 가진, 도움이 되는, 예의 바르고 정직한 도우미입니다. 항상 도움이 될 수 있는 답변을 해야 하며, 안전하고 신중해야 합니다. 답변에 해로운, 부정한, 인종 차별적, 성 차별적, 유해한, 위험한, 또는 불법적인 내용을 포함해서는 안 됩니다. 답변이 사회적으로 편향되거나 부정적이여선 안됩니다.\n\n만약 질문이 이해할 수 없거나 사실적으로 일관성이 없다면, 올바른 대답 대신 왜 잘못된 것인지 설명하세요. 만약 질문에 대한 대답을 모르면, 가짜 정보를 공유하지 말고 대신 말해주세요.\
        """
```

이제 self.history에 현재 대화를 추가하는 함수를 구현해봅시다.

LLM(어라운드  모델)은 한정된 문맥 길이를 가지고 있기 때문에 메모리에 정보를 한정적으로 보관할 수밖에 없습니다. 여기서는 self.history_length = 1 개의 질문과 대답만 최대한 보관합니다.

```js
    def append_to_history(self, user_prompt, response):
        self.history.append((user_prompt, response))
        if len(self.history) > self.history_length:
            self.history.pop(0)
```

<div class="content-ad"></div>

마침내 우리는 입력 프롬프트에 기반한 텍스트를 생성하는 generate 함수를 구현합니다.

각 LLM에는 훈련에 사용된 특정 프롬프트 템플릿이 있습니다. Code Llama의 경우 codellama-13b-chat의 프롬프트 템플릿을 참조로 사용했습니다.

```js
    def generate(
        self, user_prompt, system_prompt, top_p=0.9, temperature=0.1, max_new_tokens=512
    ):

        texts = [f"<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n"]
        do_strip = False
        for old_prompt, old_response in self.history:
            old_prompt = old_prompt.strip() if do_strip else old_prompt
            do_strip = True
            texts.append(f"{old_prompt} [/INST] {old_response.strip()} </s><s>[INST] ")
        user_prompt = user_prompt.strip() if do_strip else user_prompt
        texts.append(f"{user_prompt} [/INST]")
        prompt = "".join(texts)

        inputs = self.tokenizer(
            prompt, return_tensors="pt", add_special_tokens=False
        ).to("cuda")

        output = self.model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            pad_token_id=self.tokenizer.eos_token_id,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            top_p=top_p,
            top_k=50,
            temperature=temperature,
        )
        output = output[0].to("cpu")
        response = self.tokenizer.decode(output[inputs["input_ids"].shape[1] : -1])
        self.append_to_history(user_prompt, response)
        return response
```

응답은 시스템 프롬프트와 사용자 프롬프트를 기반으로 합니다. 답변의 창의성은 top_p 및 temperature와 같은 매개변수에 따라 달라집니다.

<div class="content-ad"></div>

top_p를 사용하면 출력 토큰의 확률 값을 제한하여 너무 드물게 발생하는 토큰을 생성하는 것을 피할 수 있어요:

temperature를 사용하면 출력 토큰의 확률 분포를 평평하게 하거나 날카롭게 할 수 있어요:

프론트엔드 애플리케이션을 진행하기 전에 ChatModel을 테스트해보죠.

```js
from ChatModel import *

model = ChatModel()
response = model.generate(
    user_prompt="C++에서 hello world 프로그램을 작성해봐", 
    system_prompt=model.DEFAULT_SYSTEM_PROMPT
)
print(response)
```

<div class="content-ad"></div>

```js
당신이 요청한 작업은 완료되었습니다. 이제 테이블 태그가 Markdown 형식으로 변경되었습니다.
```

<div class="content-ad"></div>

```js
import streamlit as st
from ChatModel import *

st.title("Code Llama Assistant")


@st.cache_resource
def load_model():
    model = ChatModel()
    return model


model = load_model()  # load our ChatModel once and then cache it
```

다음으로 generate 함수를 위한 모델 매개변수를 입력 제어하는 사이드바를 생성합니다.

```js
with st.sidebar:
    temperature = st.slider("온도", 0.0, 2.0, 0.1)
    top_p = st.slider("top_p", 0.0, 1.0, 0.9)
    max_new_tokens = st.number_input("max_new_tokens", 128, 4096, 256)
    system_prompt = st.text_area(
        "시스템 프롬프트", value=model.DEFAULT_SYSTEM_PROMPT, height=500
    )
```

그리고 챗봇 메시지 인터페이스를 생성합니다.

<div class="content-ad"></div>

```js
# 채팅 기록 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []

# 앱 재실행시 기록된 채팅 메시지 표시
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 사용자 입력 받기
if prompt := st.chat_input("무엇이든 물어보세요!"):
    # 사용자 메시지를 채팅 기록에 추가
    st.session_state.messages.append({"role": "user", "content": prompt})
    # 사용자 메시지를 채팅 메시지 컨테이너에 표시
    with st.chat_message("user"):
        st.markdown(prompt)

    # 챗봇 응답을 채팅 메시지 컨테이너에 표시
    with st.chat_message("assistant"):
        user_prompt = st.session_state.messages[-1]["content"]
        answer = model.generate(
            user_prompt,
            top_p=top_p,
            temperature=temperature,
            max_new_tokens=max_new_tokens,
            system_prompt=system_prompt,
        )
        response = st.write(answer)
    st.session_state.messages.append({"role": "assistant", "content": answer})
```

스트림릿 앱을 streamlit run app.py로 실행하여 브라우저가 열립니다.

이제 챗봇에 코딩 관련 질문을 할 수 있습니다.

# 결론

<div class="content-ad"></div>

저희는 Meta AI의 Code Llama LLM을 활용하여 AI 코딩 어시스턴트를 구현했어요. 그리고 Hugging Face의 transformer 라이브러리와 Streamlit을 사용해서 프론트엔드 애플리케이션을 만들었어요.

6GB의 GPU 메모리를 갖춘 노트북으로는 4비트 양자화된 Code Llama 모델을 7B 매개변수와 함께 사용할 수밖에 없었어요. 더 큰 GPU를 사용하면 16비트 버전이나 더 큰 모델이 더 잘 작동할 것입니다.

P.S. Code Llama로부터 제가 받은 농담보다 더 재미있는 농담들을 기대해봅니다 🤡.

더 많은 LLM에 관심이 있으시다면, 최근에 공개된 오픈소스 모델에 대한 개요를 확인해보세요:

<div class="content-ad"></div>

# 참고 자료

[1] B. Rozière 외: Code Llama: 코드를 위한 오픈 기반 모델 (2023), arXiv:2308.12950

# 자원

- Streamlit 채팅 앱 예제: 기본 LLM 채팅 앱 구축
- Hugging Face Code Llama gradio 구현: codellama-13b-chat
- 이 문서의 전체 작업 코드: [https://github.com/leoneversberg/codellama-chatbot](https://github.com/leoneversberg/codellama-chatbot)