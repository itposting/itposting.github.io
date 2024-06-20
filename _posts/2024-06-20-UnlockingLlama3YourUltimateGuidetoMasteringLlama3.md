---
title: "Llama 3 해제하기 Llama 3 마스터하기를 위한 궁극적인 안내"
description: ""
coverImage: "/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_0.png"
date: 2024-06-20 18:57
ogImage: 
  url: /assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_0.png
tag: Tech
originalTitle: "Unlocking Llama 3: Your Ultimate Guide to Mastering Llama 3!"
link: "https://medium.com/pythoneers/unlocking-llama-3-your-ultimate-guide-to-mastering-the-llama-3-77712d1a0915"
---


![이미지](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_0.png)

최근 몇 년 동안 인공 지능의 세계는 대부분 대형 언어 모델(Large Language Models, LLMs)의 등장 덕분에 급속하게 발전해 왔습니다. 이러한 고급 시스템들은 기본 텍스트 처리기에서 인간과 유사한 텍스트를 이해하고 생성할 수 있는 정교한 모델로 진화했습니다. 이러한 능력과 응용 프로그램의 중요한 발전을 표시하는 것은 메타의 최신 제품인 Llama3입니다. Llama3는 오픈 모델의 접근성과 성능의 경계를 재정의할 것을 약속하는 플랫폼입니다.

지난 주에 메타는 8B 및 70B 모델의 Llama3를 공개했으며, 이는 개선된 추론 기능을 포함하여 해당 모델 규모에 대한 새로운 기준을 세우는 놀라운 발전을 선보였습니다. Llama3는 날이 갈수록 가장 뛰어난 공개적으로 이용 가능한 LLM으로, 그 출시는 인공 지능 분야에서 중요한 대목을 이루었습니다.

본 문서에서는 Llama3에 대해 자세히 살펴볼 것이며, 해당 기술을 효과적으로 활용하는 방법에 대한 포괄적인 가이드를 제공할 것입니다. 또한 Llama3의 잠재력을 탐구하고 어떻게 여러 산업을 혁신할 수 있는지 살펴볼 것입니다.

<div class="content-ad"></div>

# 시작하기

## 목차

- Llama 3이란 무엇인가요?
- 주요 기능
- Llama 2 대 Llama 3
- Llama 3 대 다른 모델들
- Llama 3 안전 기능
- Llama 3 실험
- 방법 1: Google Colab 및 HuggingFace 사용하기
- Llama 3를 활용한 챗봇 만들기
- 방법 2: Ollama 사용하기

## Llama 3이란 무엇인가요?

<div class="content-ad"></div>

메타 라마 3는 Meta의 언어 모델 라인 중 가장 최신 제품으로, 80억과 700억 개의 매개변수를 포함한 버전이 있습니다. 이 모델은 일상 대화에서부터 복잡한 추론 작업까지 다양한 응용 프로그램에서 우수한 성능을 발휘하도록 설계되었습니다. 이전 모델을 능가하는 성능을 보여줍니다. 라마 3는 무료로 이용할 수 있어 AI 개발 및 기타 분야에서의 혁신을 촉진합니다.

![Llama3](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_1.png)

### 주요 기능:

- 80억과 700억 개의 매개변수 모델 모두에 통합되어 집중적이고 효과적인 처리를 위해 추론 효율성을 향상시킵니다.
- MMLU 및 HumanEval과 같은 작업에서 이전 모델 및 경쟁 모델을 능가하여 다양한 벤치마크에서 뛰어난 성과를 보입니다.
- 라마 3은 디코더 전용 트랜스포머 구조를 유지하면서 중요한 개선 사항을 포함하고, 128,000 개의 토큰을 지원하는 토크나이저를 사용하여 언어 부호화 효율성을 향상시킵니다.
- Llama 2의 데이터셋보다 7배 큰 15조 토큰 이상의 데이터셋에서 훈련되었으며, 30개 이상 언어의 다양한 언어 표현과 비영어 데이터가 통합되어 있습니다.
- 지도 미세 조정, 거부 샘플링 및 정책 최적화를 결합하여 모델 품질과 의사 결정 능력을 개선하는 향상된 사후 훈련 단계가 있습니다.
- 상세한 스케일링 법칙을 사용하여 데이터 혼합 및 계산 자원을 최적화하고, Llama 2와 비교하여 학습 과정의 효율성을 세 배로 높이면서 다양한 응용 프로그램에서 견고한 성능을 보장합니다.

<div class="content-ad"></div>

## 람마 2 대 람마 3

람마 3은 이전 람마 2 모델을 기반으로 하여 핵심 디코더 전용 트랜스포머 아키텍처를 유지하며 여러 가지 주요 개선 사항을 도입했습니다. 토크나이저는 이제 128,000개의 토큰을 지원하여 언어의 더 효율적인 인코딩과 향상된 성능을 가능하게 합니다. 또한, 람마 3은 그룹화된 쿼리 어텐션 (GQA)을 통합하여 다양한 매개 변수 모델에 걸쳐 추론 효율성을 향상시킵니다. 이 모델은 8,192토큰의 시퀀스를 마스킹을 사용하여 보다 집중된 효과적인 처리를 보장합니다.

![이미지](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_2.png)

## 람마 3 대 다른 모델들

<div class="content-ad"></div>

메타가 개발한 라마 3은 다양한 벤치마크에서 이전 모델 및 경쟁 모델들을 능가하는 새로운 기준을 세웠습니다. 특히 MMLU와 같은 다양한 영역의 지식을 평가하는 테스트와 코딩 기술에 중점을 둔 HumanEval과 같은 테스트에서 뛰어난 성과를 보였습니다. 또한, 라마 3은 Google의 제미니 1.5 Pro나 안소로픽의 클로드 3 소네토와 같은 다른 고매개변수 모델들을 특히 복잡한 추론 및 이해 과제에서 능가했습니다.

메타의 라마 3은 다양한 벤치마크와 응용 프로그램에서 뛰어난 성능을 보이며, 특히 추론, 코딩 및 창의적 글쓰기와 관련된 작업에서 뛰어난 성과를 거두고 있습니다. 다양하고 정확한 응답을 생성할 수 있는 능력은 다른 모델들과 구별되며, 개선된 사용자 경험과 생산성을 보장합니다.

![이미지](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_3.png)

## 라마 3 안전 기능

<div class="content-ad"></div>

Llama 3은 Llama Guard 2, Cybersec Eval 2, 그리고 Code Shield와 같은 새로운 안전 및 신뢰 기능을 소개합니다. 이러한 기능들은 사용 중에 안전하지 않은 코드를 걸러내는 역할을 합니다. torchtune과 함께 개발된 Llama 3은 효율적인 작성, 세밀 조정, 그리고 대규모 언어 모델(LLM)의 테스트를 용이하게 하는 PyTorch 기반 라이브러리이며, Hugging Face와 Weights & Biases와 같은 플랫폼들과 통합되어 있습니다.

![이미지](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_4.png)

책임 있는 배포는 "레드팀" 노력을 포함한 체계적인 테스트를 통해 보장되며, 특히 사이버 보안 분야에서의 안전성과 견고성을 평가합니다. Llama Guard 2는 MLCommons의 산업 표준을 따르며, CyberSecEval 2는 보안 조치를 강화합니다. Llama 3의 개발은 AI 커뮤니티를 통합하고 잠재적인 위험을 대응하기 위한 개방적인 접근을 강조하며, Meta의 책임 있는 사용 가이드(RUG)는 모베이션 모델 측면과 클라우드 제공업체에 의한 내용 관리 도구를 제공합니다.

# Llama 3 실험하기

<div class="content-ad"></div>

로컬 머신에서 Llama 3을 실험하는 것은 오픈 소스 기능을 활용하는 다양한 도구 덕분에 더 쉬워졌어요. Hugging Face가 이끄는 선두주자로 Llama 3 모델의 지원이 이제 가능하며, 그들의 Hub에서 Transformers 라이브러리를 통해 접근할 수 있어요. 전체 정밀도 모델을 선호하시든가, 4비트 양자화 모델의 효율성을 선호하든가, 설치와 실행은 매끄럽게 처리됩니다.

여기서는 서로 다른 사용자 선호도와 기술 수준에 맞는 두 가지 구체적인 방법을 살펴볼 거에요.

## Method 1: Google Colab 및 HuggingFace 사용

자유로운 Colab 티어에서 Llama 3을 실행하는 실습으로 빠져들어 봅시다!

<div class="content-ad"></div>

## 단계 1: 라마 3 액세스 활성화

라마 3은 액세스 요청이 필요한 보안 모델입니다.

![이미지](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_5.png)

모델 액세스를 활성화하는 단계를 따르세요.

<div class="content-ad"></div>

- Hugging Face 계정에 로그인하거나 아직 계정이 없는 경우 새 계정을 등록해보세요.
- https://huggingface.co/meta-llama/Meta-Llama-3-8B를 방문하여 접근 권한을 요청할 수 있어요.
- 성명, 생년월일, 국가, 소속과 같은 사용자 세부 정보를 제공해주세요. 라마 3 모델에 접근할 수 있도록 라이선스 동의를 받은 후에, 이제 Llama 3 모델에 접속할 수 있어요.

- 접속을 확인하려면 다음 링크로 이동해주세요: huggingface.co/meta-llama/Meta-Llama-3-8B/resolve/main/config.json. Llama 3 모델에 성공적으로 접근한 경우, 관련 정보를 수신할 수 있을 거예요. 

![UnlockingLlama3YourUltimateGuidetoMasteringLlama3_6](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_6.png)

## 단계 2: Hugging Face 액세스 토큰 생성

<div class="content-ad"></div>

모델에 액세스하려면 HuggingFace 액세스 토큰이 필요합니다. 설정으로 이동하여 왼쪽 사이드 바의 Access Tokens에 들어가 "New token" 버튼을 클릭하여 새 액세스 토큰을 생성할 수 있습니다.

## 단계 3: HuggingFace를 사용하여 Llama 3로 첫 번째 스크립트 만들기

- [Colaboratory에 오신 것을 환영합니다 — Colab](https://colab.research.google.com/) 링크로 이동하고 "로그인"을 클릭하여 colab 계정에 로그인하거나 계정이 없는 경우 새로 만드세요.
- 런타임을 T4 GPU로 변경하려면 런타임 → 런타임 유형 변경 → T4 GPU → 저장을 클릭하세요.
- Gemma를 사용하려면 Hugging Face 액세스 토큰을 제공해야 합니다. 왼쪽 편에 있는 Secrets(🔑)를 선택하고 HF_TOKEN 키를 추가하세요.
- + 새 노트북 버튼을 클릭하여 새 콜랩 노트북을 만드세요.

## 단계 4: 종속 항목 설치

<div class="content-ad"></div>

아래 명령어를 사용하여 transformers, accelerate 및 bitsandbytes 라이브러리를 설치해보세요.

```js
!pip install -U "transformers==4.40.0" --upgrade
!pip install accelerate bitsandbytes
```

## 단계 5: 모델 다운로드 및 설치

Llama 3 모델을 설치하고 텍스트 생성 파이프라인을 설정해보세요.

<div class="content-ad"></div>

```js
import transformers
import torch

model_id = "unsloth/llama-3-8b-Instruct-bnb-4bit"

pipeline = transformers.pipeline(
    "text-generation",
    model=model_id,
    model_kwargs={
        "torch_dtype": torch.float16,
        "quantization_config": {"load_in_4bit": True},
        "low_cpu_mem_usage": True,
    },
)
```

## 단계 6: 쿼리 전송

추론을 위해 모델에 쿼리를 보내세요.

```js
messages = [
    {"role": "system", "content": "You are a helpful assistant!"},
    {"role": "user", "content": """Hey how are you doing today?"""},
]

prompt = pipeline.tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
)

terminators = [
    pipeline.tokenizer.eos_token_id,
    pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")
]

outputs = pipeline(
    prompt,
    max_new_tokens=256,
    eos_token_id=terminators,
    do_sample=True,
    temperature=0.6,
    top_p=0.9,
)

print(outputs[0]["generated_text"][len(prompt):])
```

<div class="content-ad"></div>

아래와 같은 결과를 얻게 됩니다.

```js
잘 지내고 있어요, 물어봐 주셔서 감사해요! 저는 도움이 되는 어시스턴트이기 때문에 언제든지 궁금한 점이나 해야할 일이 있으면 도와드릴 준비가 되어 있어요. 여러분은요? 오늘은 어떠신가요? 좋은 하루 보내고 있나요?
```

<img src="/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_7.png" />

## Llama 3를 사용하여 챗봇 만들기

<div class="content-ad"></div>

이 섹션에서는 gradio를 사용하여 Llama 3를 이용한 챗봇을 생성할 것입니다.

- gradio 패키지 설치

```js
!pip install gradio
```

- 노트북에 새 셀을 생성하고 다음 코드를 추가하세요.

<div class="content-ad"></div>

```js
import gradio as gr

messages = []

def add_text(history, text):
    global messages
    history = history + [(text,'')]
    messages = messages + [{"role":'user', 'content': text}]
    return history, text

def generate(history):
  global messages
  prompt = pipeline.tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
)

  terminators = [
    pipeline.tokenizer.eos_token_id,
    pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")
]

  outputs = pipeline(
    prompt,
    max_new_tokens=256,
    eos_token_id=terminators,
    do_sample=True,
    temperature=0.6,
    top_p=0.9,
)
  response_msg = outputs[0]["generated_text"][len(prompt):]
  for char in response_msg:
      history[-1][1] += char
      yield history
  pass

with gr.Blocks() as demo:

    chatbot = gr.Chatbot(value=[], elem_id="chatbot")
    with gr.Row():
            txt = gr.Textbox(
                show_label=False,
                placeholder="Enter text and press enter",
            )

    txt.submit(add_text, [chatbot, txt], [chatbot, txt], queue=False).then(
            generate, inputs =[chatbot,],outputs = chatbot,)

demo.queue()
demo.launch(debug=True)
```

- 셀을 실행하세요. 노트북에 gradio 인터페이스가 표시되거나 새 탭에서 열기 위해 제공된 링크를 사용할 수 있습니다. 아래와 같이 출력이 나타납니다.

<img src="https://miro.medium.com/v2/resize:fit:1400/1*tQMX7SYlik7Riuwd5FE_Jg.gif" />

## 방법 2: Ollama 사용하기


<div class="content-ad"></div>

큰 언어 모델(LLMs)을 클라우드 서비스에 의존하지 않고 로컬에서 실행할 수 있는 대안을 찾고 있다면, Ollama가 그에 최적의 선택일 것입니다. Ollama는 지역에서 LLMs를 실행하기 위해 설계된 오픈 소스 소프트웨어로, 직접 제어를 받을 수 있도록 해줍니다.

Ollama를 시작하려면 소프트웨어를 다운로드하기만 하면 됩니다. Ollama를 사용하면 데이터 프라이버시를 유지하면서 계산 자원을 직접 제어할 수 있는 이점을 누릴 수 있습니다.

- Ollama 공식 사이트로 이동합니다.
- 다운로드를 클릭하여 소프트웨어를 다운로드합니다.
- 설치 파일을 더블 클릭하고 설치를 클릭하여 설치합니다.
- 설치가 완료되면 다음 명령을 사용하여 지정된 모델로 로컬 서버를 시작하실 수 있습니다.

<div class="content-ad"></div>


js
Compile the text ollama run llama3:instruct.

Also, use llama3, llama3:70b, llama3:70b-instruct as arguments for different types of llama3 models. Make sure you have a proper internet connection; otherwise, you may encounter an error like dial tcp: lookup no such host error while pulling the model.

## Running the Model

- Once the model is downloaded, you can start querying. Input your context directly through the terminal or use the API to interact with the model.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_8.png" />

## Curl 명령어를 사용하여 모델 쿼리

Ollama는 curl을 사용하기 위해 포트 11434에 노출된 엔드포인트 (/api/generate)를 노출했습니다. 다음 형식을 사용하여 쿼리할 수 있습니다.

```js
curl http://localhost:11434/api/generate -d "{ \"model\": \"llama3:instruct\", \"prompt\": \"무지개에는 몇 가지 색이 있나요?\", \"stream\": false }"
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_9.png" />

## 포스트맨(Postman)을 이용하여 모델 조회하기

- Postman을 엽니다.
- 요청 방법으로 POST를 선택합니다.
- URL 입력 필드에 엔드포인트를 제공합니다: localhost:11434/api/generate.
- 요청 바디 형식으로 JSON을 선택합니다.
- 요청 바디 내용을 아래와 같이 제공합니다. "prompt": "value"를 적절한 내용으로 바꿉니다.

```js
{
    "model": "llama3:instruct",
    "prompt":"무지개에는 몇 가지 색이 있나요?",
    "stream":false
}
```

<div class="content-ad"></div>

- Ollama 엔드포인트에 요청을 보내려면 Send 버튼을 클릭하세요.
- 아래와 같이 결과를 받게 됩니다.

```js
{
    "model": "llama3:instruct",
    "created_at": "2024-04-29T17:34:38.0223636Z",
    "response": "무지개에서 흔히 볼 수 있는 7가지 색은 다음과 같습니다.\n\n1. 빨강\n2. 주황\n3. 노랑\n4. 초록\n5. 파랑\n6. 남색\n7. 보라\n\n이 색은 때때로 ROY G BIV라는 약어를 사용하여 기억되기도 하는데, 각 글자는 색깔의 이름을 나타냅니다. 무지개에 대해 더 알고 싶으세요? 아니면 다른 점에 도움을 받고 싶으세요?",
    "done": true,
    "context": [
        128006,
        ...
        128009
    ],
    "total_duration": 17278010500,
    "load_duration": 5247897400,
    "prompt_eval_count": 19,
    "prompt_eval_duration": 1196966000,
    "eval_count": 92,
    "eval_duration": 10829807000
}
```

![UnlockingLlama3YourUltimateGuidetoMasteringLlama3_10](/assets/img/2024-06-20-UnlockingLlama3YourUltimateGuidetoMasteringLlama3_10.png)

만약 이 기사가 마음에 드셨다면 👏 버튼을 클릭하여 공유해 주세요!

<div class="content-ad"></div>

이 튜토리얼의 전체 소스 코드는 여기에서 찾을 수 있어요,

## 참고문헌