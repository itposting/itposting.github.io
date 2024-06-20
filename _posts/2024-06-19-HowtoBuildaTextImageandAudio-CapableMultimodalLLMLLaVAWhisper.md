---
title: "텍스트, 이미지 및 오디오를 지원하는 멀티모달 LLM LLaVA  Whisper 구축 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoBuildaTextImageandAudio-CapableMultimodalLLMLLaVAWhisper_0.png"
date: 2024-06-19 19:50
ogImage: 
  url: /assets/img/2024-06-19-HowtoBuildaTextImageandAudio-CapableMultimodalLLMLLaVAWhisper_0.png
tag: Tech
originalTitle: "How to Build a Text, Image, and Audio-Capable Multimodal LLM (LLaVA + Whisper)"
link: "https://medium.com/gitconnected/how-to-build-a-text-image-and-audio-capable-multimodal-llm-llava-whisper-bc88353b3a66"
---


![이미지](/assets/img/2024-06-19-HowtoBuildaTextImageandAudio-CapableMultimodalLLMLLaVAWhisper_0.png)

안녕하세요! 이 블로그는 두 개의 오픈 소스 모델을 활용하여 텍스트, 이미지 및 오디오 지원이 가능한 멀티모달 LLM을 구축하는 방법에 대해 소개하고 있어요. LLaVA와 Whisper라는 두 모델은 각각 독특한 능력을 가지고 있답니다.

멀티모달 LLM은 다양한 데이터 유형을 지원할 수 있어요. 이 모델의 워크플로우는 세 가지 모달을 지원할 수 있어요. 이미지, 텍스트, 그리고 오디오; 이미지가 모델로 입력되며, 해당 이미지를 기반으로 한 입력 프롬프트가 오디오로 제공돼요.

오디오는 whisper 모델을 활용하여 전사되어 모델로 텍스트 입력을 제공해요. 그럼 모델은 텍스트 컨텐츠를 생성하고, gTTS (Google 변역 텍스트 음성 합성) 패키지를 활용하여 텍스트 콘텐츠를 오디오로 변환해요. 기본적으로 결과는 텍스트와 오디오 형식으로 표시돼요.

<div class="content-ad"></div>

## LLaVA 모델:

첫 번째 모델은 LLaVA입니다. LLaVA는 "큰 언어 및 비전 어시스턴트"를 나타냅니다. LLaVA는 GPT로 생성된 멀티모달 명령을 미세 조정하고 있는 LlamA/Vicuña를 바탕으로 훈련된 오픈 소스 모델입니다. 이는 transformer 아키텍처를 기반으로 한 자기회귀 언어 모델입니다. 이 LLM 모델은 비전 인코딩 기능을 가지고 있습니다. 텍스트와 이미지 형식 모두에서 문맥을 이해할 수 있습니다.

LLaVA는 비전 인코더와 Vicuna를 결합하여 시각 및 언어 이해를 가능하게 하는 혁신적인 솔루션입니다. 자연어와 컴퓨터 비전의 융합은 인공지능 분야에서 중요한 발전을 이끌어내었습니다.

![이미지](/assets/img/2024-06-19-HowtoBuildaTextImageandAudio-CapableMultimodalLLMLLaVAWhisper_1.png)

<div class="content-ad"></div>

모델 워크플로우는 네트워크 아키텍처를 통해 이해할 수 있습니다. 비전 인코더는 입력 이미지에서 특징을 추출하는 데 사용됩니다. 특징과 입력 텍스트 명령은 벡터로 변환되며, 이 벡터 값은 모델에서 처리되어 관련 콘텐츠가 출력됩니다.

"시각 지시 조정"이라는 연구 논문에서는 LLAVA(Large Language and Vision Assistant)라는 혁신적인 접근 방식을 소개합니다. 이 접근 방식은 GPT-4의 성능을 활용하여 새로운 다중 모달 지시 데이터 패러다임을 만들어냅니다. 이 모델은 원래 텍스트 기반 작업을 위해 설계된 것이었지만, 텍스트와 시각적 구성 요소를 원활하게 통합하는 방식으로 작동합니다. 시각적 지시 조정은 큰 언어 모델(Large Language Model, LLM)을 세밀하게 조정하여 시각적 신호를 기반으로 지시를 이해하고 실행하는 기술입니다.

이 접근 방식은 언어와 시각 사이의 연결을 확립하여, 인공지능 시스템이 두 가지 형태를 포함하는 사람의 지시를 이해하고 실행할 수 있도록 하는 것을 목표로 합니다. 예를 들어, 이미지를 설명하거나 가상 환경에서 작업을 수행하거나 사진 속 장면에 대한 질문에 답변하도록 기계 학습 모델에 요청하는 상황을 상상해보세요. 시각 지시 조정은 이러한 작업을 효과적으로 수행할 수 있도록 모델에 능력을 제공합니다.

## 휘스퍼 모델:

<div class="content-ad"></div>

두 번째 모델은 휘스퍼입니다. 이 모델은 OpenAI에서 개발되었습니다. 휘스퍼는 웹에서 수집된 68만 시간의 다국어 및 다작업 감독 데이터로 훈련된 자동 음성 인식(ASR) 시스템으로 일반 목적의 음성 인식 모델입니다.

휘스퍼는 다양한 오디오 데이터셋에서 훈련되었으며, 다국어 음성 인식, 음성 번역 및 언어 식별을 수행할 수 있는 다작업 모델입니다.

다양한 음성 처리 작업(다국어 음성 인식, 음성 번역, 말의 언어 식별, 음성 활동 감지)에 대해 트랜스포머 시퀀스-투-시퀀스 모델이 훈련되었습니다.

![이미지](/assets/img/2024-06-19-HowtoBuildaTextImageandAudio-CapableMultimodalLLMLLaVAWhisper_2.png)

<div class="content-ad"></div>


이러한 작업들은 전통적인 음성 처리 파이프라인의 여러 단계를 대체하는 단일 모델이 가능하도록, 디코더에 의해 예측될 토큰 시퀀스로 공동으로 표현됩니다. 멀티태스크 트레이닝 형식은 특별한 토큰 세트를 사용하여 태스크 지정자 또는 분류 대상으로 작용합니다.

# 모델 구축을 시작해봅시다

아래 코드를 실행하려면 GPU를 사용할 수 있는 시스템이 필요합니다. 저는 Google Colab "T4 GPU"를 사용하여 전체 코드를 실행했습니다.

첫 번째 단계는 우리 환경에 필요한 패키지를 설치하는 것입니다. transformer 라이브러리는 모델 파이프라인을 생성하는 데 사용되며, bitsandbytes 라이브러리는 CUDA 사용자 지정 함수 (특히 8비트 최적화기, 행렬 곱셈 (LLM.int8()) 및 8 + 4비트 양자화 함수)의 가벼운 Python 래퍼입니다.

<div class="content-ad"></div>

그런 다음 OpenAI 휘스퍼 모델을 사용하여 음성을 텍스트로 변환하고, gTTs 패키지를 사용하여 텍스트를 음성으로 변환합니다. Gradio 라이브러리를 사용하여 모델을 위한 사용자 인터페이스를 만듭니다.

```js
!pip install -q transformers==4.37.2
!pip install bitsandbytes==0.41.3 accelerate==0.25.0
!pip install -q git+https://github.com/openai/whisper.git
!pip install -q gradio
!pip install -q gTTs
```

두 번째 단계는 설치된 라이브러리에서 필요한 모듈을 가져오는 것입니다.

```js
import torch
from transformers import BitsAndBytesConfig, pipeline
import whisper
import gradio as gr
import time
import warnings
import os
from gtts import gTTS
from PIL import Image
import re
import datetime
import requests
import nltk
from nltk import sent_tokenize
import base64
import numpy as np
```

<div class="content-ad"></div>

세 번째 단계는 "BitsAndBytesConfig" 모듈을 사용하여 모델 양자화 매개변수를 설정하는 것입니다. 모델 양자화는 모델 매개변수를 표현하는 데 사용되는 숫자의 정밀도를 줄이는 과정입니다. 이는 모델 크기를 크게 줄이고 추론 속도를 높여주어, 특히 자원이 제한된 하드웨어에서 효율적으로 실행할 수 있습니다.

이 매개변수는 모델을 4비트 정밀도로로로 로드해야 함을 나타냅니다. 일반적인 신경망 매개변수는 일반적으로 32비트 부동소수점(float32) 형식으로 저장됩니다. 이를 4비트로 줄이면 각 매개변수가 더 적은 메모리를 사용하게 되어, 더 작은 모델 크기와 빠른 연산 속도를 가져옵니다. 이는 모델을 4비트 양자화로 로드하고 16비트 부동소수점 정밀도로 계산함을 의미합니다.

이는 모델의 메모리 풋프린트를 크게 줄여주어, 제한된 메모리를 가진 장치에 배포할 수 있게 해줍니다. 그러나, 이것의 대가로 정밀도를 줄였기 때문에 모델 정확도에 약간의 손실이 있을 수 있습니다.

모델 파이프라인에서는 이미지에서 텍스트로의 생성 작업을 위해 LLaVA 1.5B 매개변수 모델을 사용하고 양자화 구성을 전달했습니다.

<div class="content-ad"></div>

```js
quant_config = BitsAndBytesConfig(
    load_in_4bit = True,
    bnb_4bit_compute_dtype = torch.float16
)

model_id = "llava-hf/llava-1.5-7b-hf"

pipe = pipeline(
    "image-to-text",
    model = model_id,
    model_kwargs={"quantization_config": quant_config}
)
```

네 번째 단계는 시스템 계산 단위를 "DEVICE" 변수로 구성하는 것입니다. 이것은 속삭임 모델을 로드하기 위한 필수 매개변수입니다. 그 후, 우리는 속삭임 모델을 다운로드하고, 39M (작음), 74M (베이스), 244M (작은), 769M (중간), 1550M (큰)과 같이 다양한 매개변수 수가 있는 모델이 나왔습니다. 우리는 769M 매개변수를 가진 속삭임-중간 모델을 사용하고 있습니다.

이 속삭임 모델은 762,321,920개의 다국어 기능을 갖추고 있습니다. OpenAI의 속삭임 모델은 99가지 다른 언어를 지원하지만, 영어 언어에서 가장 잘 작동합니다.

```js
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"using torch {torch.__version__} ({DEVICE})")

model = whisper.load_model("medium", device = DEVICE)

print(
    f"Model is {'다국어 ' if model.is_multilingual else '영어 전용'}"
    f"이며 매개변수는 {sum(np.prod(v.shape) for v in model.parameters()):,}개 있습니다."
)
```

<div class="content-ad"></div>

아래 코드는 현재 날짜와 시간을 기준으로 고유한 이름을 가진 로그 파일에 텍스트 항목을 작성하는 로깅 시스템을 생성하는 데 사용됩니다. 이는 이벤트 추적, 디버깅 또는 타임스탬프와 함께 일련의 작업 또는 메시지를 기록해야 하는 상황에 유용할 수 있습니다.

```js
#Logger file
tstamp = datetime.datetime.now()
tstamp = str(tstamp).replace(" ", "_")
logfile = f"log_{tstamp}.txt"

def writehistory(text):
  with open(logfile, "a", encoding='utf-8') as f:
    f.write(text)
    f.write("\n")
  f.close()
```

"img2txt" 함수는 LLaVA 모델 파이프라인을 사용합니다. 이 함수는 이미지와 텍스트 프롬프트를 인자로 사용합니다. 함수는 입력 이미지와 관련된 모델에 의해 생성된 텍스트 콘텐츠를 생성합니다.

```js
def img2txt(input_text, input_image):

    # 이미지 로드
    image = Image.open(input_image)

    writehistory(f"Input text: {input_text} - Type: {type(input_text)} - Dir: {dir(input_text)}")
    if type(input_text) == tuple:
        prompt_instructions = """
       가능한 한 자세히 이미지를 설명하십시오.
       이미지에 대한 질문에 답변할 수 있는 유용한 AI 어시스턴트입니다.
       이미지에 대한 전체 내용은 무엇입니까?
       이제 유용한 답변을 생성하십시오.
        """
    else:
        prompt_instructions = """
        가능한 한 자세히 이미지 설명을 전문적으로 분석하여 다음 프롬프트에 응답하십시오:
        """ + input_text

    writehistory(f"prompt_instructions: {prompt_instructions}")
    prompt = "USER: <image>\n" + prompt_instructions + "\nASSISTANT:"

    outputs = pipe(image, prompt=prompt, generate_kwargs={"max_new_tokens": 200})

    # 적절히 응답 텍스트 추출
    if outputs is not None and len(outputs[0]["generated_text"]) > 0:
        match = re.search(r'ASSISTANT:\s*(.*)', outputs[0]["generated_text"])
        if match:
            # "ASSISTANT:" 이후의 텍스트 추출
            reply = match.group(1)
        else:
            reply = "응답을 찾을 수 없습니다."
    else:
        reply = "생성된 응답이 없습니다."

    return reply
```

<div class="content-ad"></div>

"transcribe" 기능은 whisper 모델을 사용합니다. 이 기능은 오디오를 입력으로 받아서 전사된 텍스트를 출력으로 반환합니다. 전사된 텍스트는 모델의 입력으로 사용됩니다.

Markdown 형식으로 표를 변경하겠습니다.


def transcribe(audio):

    # 입력 오디오가 None이거나 비어 있는지 확인합니다.
    if audio is None or audio == '':
        return ('', '', None)  # 빈 문자열 및 None 오디오 파일을 반환합니다.

    # language = 'en'

    audio = whisper.load_audio(audio)
    audio = whisper.pad_or_trim(audio)

    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    _, probs = model.detect_language(mel)

    options = whisper.DecodingOptions()
    result = whisper.decode(model, mel, options)
    result_text = result.text

    return result_text


"text_to_speech" 함수는 gTTs 패키지를 사용하여 텍스트와 파일 경로를 인수로 취합니다. 텍스트는 오디오로 변환되고, 그 오디오 파일은 지정된 파일 경로에 저장됩니다.


def text_to_speech(text, file_path):
    language = 'en'

    audioobj = gTTS(text=text,
                    lang=language,
                    slow=False)

    audioobj.save(file_path)

    return file_path


<div class="content-ad"></div>

워크플로의 마지막 단계는 이미 만들어진 모든 기능을 통합하여 사용자 인터페이스를 생성하는 것입니다. "process_inputs" 함수는 모든 함수를 활용합니다. 사용자로부터 두 가지 입력을 받습니다: 하나는 이미지이고, 또 다른 하나는 이미지 기반 음성 입력입니다.

## 모델 워크플로 요약

이미지와 텍스트(휘스퍼 모델로부터 오디오로 변환된 텍스트)가 입력으로 LLaVA 모델에 제공됩니다. LLaVA 모델은 입력 이미지를 기반으로 출력 콘텐츠를 생성합니다. 생성된 텍스트 콘텐츠는 gTTs 라이브러리를 사용하여 오디오로 변환됩니다. 출력은 사용자 인터페이스에서 텍스트 및 오디오 형태로 표시됩니다.

```python
# 오디오 및 이미지 입력을 처리하는 함수
def process_inputs(오디오_경로, 이미지_경로):
    # 오디오 파일 처리 (이를 처리하는 함수 'transcribe'를 가정합니다)
    음성_텍스트_출력 = transcribe(오디오_경로)

    # 이미지 입력 처리
    if 이미지_경로:
        chatgpt_output = img2txt(음성_텍스트_출력, 이미지_경로)
    else:
        chatgpt_output = "이미지가 제공되지 않았습니다."

    # 'transcribe'가 처리된 오디오 파일 경로도 반환한다고 가정합니다
    처리된_오디오_경로 = text_to_speech(chatgpt_output, "Temp3.mp3")  # 다르면 실제 경로로 교체

    return 음성_텍스트_출력, chatgpt_output, 처리된_오디오_경로

# 인터페이스 생성
iface = gr.Interface(
    fn=process_inputs,
    inputs=[
        gr.Audio(sources=["microphone"], type="filepath"),
        gr.Image(type="파일경로")
    ],
    outputs=[
        gr.Textbox(label="음성을 텍스트로 변환"),
        gr.Textbox(label="출력1"),
        gr.Audio("Temp.mp3")
    ],
    title="Multimodel LLM",
    description="이미지를 업로드하고 음성 입력을 통해 상호작용합니다."
)

# 인터페이스 실행
iface.launch(debug=True)
```

<div class="content-ad"></div>

Gradio 인터페이스를 실행한 후, 모델과 상호 작용할 수 있는 사용자 인터페이스가 나타납니다.

![Gradio Interface](/assets/img/2024-06-19-HowtoBuildaTextImageandAudio-CapableMultimodalLLMLLaVAWhisper_3.png)

읽어 주셔서 감사합니다!

더 알고 싶다면:

<div class="content-ad"></div>

- LLaVA: [링크](https://huggingface.co/llava-hf/llava-1.5-7b-hf)
- Whisper: [링크](https://github.com/openai/whisper)

# Vasukumar P

LinkedIn

GitHub