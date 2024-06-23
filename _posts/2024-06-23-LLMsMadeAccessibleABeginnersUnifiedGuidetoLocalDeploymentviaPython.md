---
title: "초보자를 위한 통합 가이드 Python을 사용한 LLM 로컬 배포 쉽게 하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-LLMsMadeAccessibleABeginnersUnifiedGuidetoLocalDeploymentviaPython_0.png"
date: 2024-06-23 19:17
ogImage: 
  url: /assets/img/2024-06-23-LLMsMadeAccessibleABeginnersUnifiedGuidetoLocalDeploymentviaPython_0.png
tag: Tech
originalTitle: "LLMs Made Accessible: A Beginner’s Unified Guide to Local Deployment via Python"
link: "https://medium.com/@arshad.mehmood/llms-made-accessible-a-beginners-unified-guide-to-local-deployment-via-python-5f3d85507088"
---


![2024-06-23-LLMsMadeAccessibleABeginnersUnifiedGuidetoLocalDeploymentviaPython_0.png](/assets/img/2024-06-23-LLMsMadeAccessibleABeginnersUnifiedGuidetoLocalDeploymentviaPython_0.png)

인터넷에는 개인 컴퓨터에서 대형 언어 모델 (LLMs)을 실행하는 방법에 대한 가이드가 넘쳐나지만, 이 방대한 정보를 효율적으로 탐색하는 것은 특히 새로운 사용자에게는 어려운 일일 수 있습니다. 대부분의 가이드는 특정 접근 방식에 초점을 맞추기 때문에 초보자들이 포괄적인 길을 찾기 어려울 수 있습니다. 여기서 저의 기사가 등장하여, 몇 가지 유명한 방법들을 하나로 통합하고 초보자들을 위해 특별히 제작된 이를 제공합니다. 이 가이드의 독특한 접근 방식은 Python 기반 방법에 집중하고 있으며, Python의 간단함과 AI 커뮤니티 내에서의 광범위한 사용을 인정하고 있습니다. 이 가이드는 깔끔하고 단계별 지침서, 다양한 Python 라이브러리와 도구에 대한 통찰, 그리고 실용적인 팁을 제공하여 당신의 LLMs 세계로의 진입을 원활하게 만들어주려고 만들어졌습니다. 기술적인 세부 사항의 다양성이 혼란스럽게 느껴졌거나 선택지가 많았던 분들에게는 이 기사가 꼭 필요한 리소스로, 당신의 컴퓨터에서 LLMs를 직접 실행하기 위한 접근 가능하고 깨우침을 주는 여정을 보장합니다. 여러 프레임워크에서 모델을 작업하는 빠른 소개를 제공하는 이 기사는 CPU 또는 GPU를 사용하더라도 모든 측면을 깊이 다루지는 않습니다. 더 포괄적인 통찰을 위해서는 관련 문서를 참고하는 것이 좋습니다.

이 가이드는 다음을 사용하여 LLMs를 로컬로 실행하는 방법을 공유할 것입니다
- Huggingface: 방대한 모델 저장소와 직관적 인터페이스를 갖춘 포괄적인 라이브러리.
- Llama.cpp Python: llama.cpp를 활용해 성능이 C++ 수준인 LLMs를 사용하는 Python 친화적 프론트 엔드.
- llama.cpp 기반 GPT-3.5에 대한 API 드롭인 대체: 모델을 독립된 프로세스에서 실행하면, 동일한 기계 또는 서버에서 GPT 3.5 클라이언트들이 사용하는 API와 유사한 방식으로 추론이 가능해집니다.

<div class="content-ad"></div>

상기한 방법들은 13세대 인텔 랩터 레이크 프로세서가 탑재된 Windows 11 시스템에서 WSL2을 사용하여 성공적으로 테스트되었으며, NVIDIA RTX 3060 카드와 16GB 메모리, CUDA 버전 12.1을 사용하고 있습니다.

# 대형 언어 모델(LLM) 실행에 대한 고려 사항

대형 언어 모델(LLM)의 세계로 진입하면 효율적인 배포와 운영을 위한 중요한 고려 사항이 드러납니다. 하드웨어 요구 사항부터 모델 액세스 프로토콜까지 각 요소가 LLM의 모든 잠재력을 활용하는 데 중요한 역할을 합니다.

LLM의 효율적인 운영을 위해서는 강력한 GPU가 필수적입니다. 퀀터제이션을 필요로 하는 모델들에게 특히 중요한데, GPT-2와 같은 작은 모델은 CPU에서 실행할 수 있지만 시스템 RAM에 제한을 받습니다. 예를 들어, GPT-2의 500MB 크기는 현대 CPU에서 관리가 가능하지만,  Llama 2 7B(13GB 크기)와 같은 큰 모델은 기술적으로 CPU에서 실행할 수 있지만, 충분한 RAM이 있어도 추론 속도가 느려집니다.

<div class="content-ad"></div>

HuggingFace 라이브러리는 자동 모델 다운로드를 용이하게 하고 다양한 모델에 액세스할 수 있도록 도와줍니다. Meta의 Llama2와 같은 일부 모델에 액세스하려면 Hugging Face를 통해 계정 설정, 애플리케이션 검토 및 Meta의 사용 정책 준수가 필요한 승인 프로세스가 필요합니다.

GPU 배포는 GPU RAM 용량에 따라 LLM에 가장 적합합니다. 일반적으로 모델은 float16 또는 float32 포맷이며, NVidia 4060 Ti와 같이 더 높은 용량을 갖는 GPU에서는 전체 모델 로딩이 가능합니다(16GB RAM). RAM이 적은 GPU의 경우 양자화는 원래 크기의 일부로 메모리 요구사항을 줄여 호환성 및 추론 속도를 향상시키지만, 정확도 손실은 최소화됩니다. GPU 기반 LLM 작업에는 전반적으로 양자화를 권장합니다. 양자화는 대규모 언어 모델(LLMs)이 로컬 기계에서 효율적으로 작동할 수 있도록 하는 데 중요한 역할을 합니다. 기본적으로 양자화는 모델의 가중치를 표현하는 데 사용되는 숫자의 정밀도를 줄이는 프로세스로, 성능을 크게 희생하지 않으면서 모델의 크기를 크게 줄입니다. GPU 추론에 대해, 이 가이드는 Nvidia GPU를 CUDA 프레임워크와 함께 사용하는 데 초점을 맞추고 있습니다.

Google Colab은 Nvidia GPU에 액세스하여 개인 하드웨어가 필요하지 않게 해주는 편리한 클라우드 기반 솔루션을 제공합니다. 주요 라이브러리와의 쉬운 통합을 지원하여 모델 실행이 간편해집니다. 그러나 무료 계정 사용자는 액세스 기간 제한 및 GPU 가용성과 같은 제한 사항을 직면할 수 있으며, 이는 긴 기간 또는 더 많은 리소스를 필요로 하는 프로젝트에 영향을 줄 수 있습니다.

<div class="content-ad"></div>

이제 이러한 구성 요소를 각각 설정하는 구체적인 내용을 살펴보겠습니다.

---

## HuggingFace 사용하기

Hugging Face는 자연 언어 처리(NLP) 분야에서 특히 열린 소스 라이브러리인 Transformers를 갖고 인공 지능 분야를 혁신시켰습니다. 이 라이브러리는 텍스트 분류 및 언어 생성과 같은 작업을 위한 다양한 사전 훈련된 모델을 제공하여 복잡한 NLP 작업의 구현을 간단하게 합니다. 그들의 작업은 다양한 분야에서 AI 응용 프로그램을 신속하게 개발할 수 있도록 하며 모델을 처음부터 훈련할 필요가 없게 합니다.

<div class="content-ad"></div>

# 설정

작동되는 구성:

- Python 3.8+ (3.10 버전에서 테스트됨)
- Windows 11, Windows Subsystem for Linux (WSL) 및 Ubuntu 22.04에서 확인됨.
- Transformer 버전 4.36.1에서 테스트됨 (이후 버전은 inference.py에 변경이 필요할 수 있음)
- Intel 12세대 이상
- (선택 사항) GPU (예: Nvidia RTX3060 12 GB) 및 CUDA 12.1이 장착되어 있음

다음 섹션에서는 CPU 전용 및 GPU용으로 Linux 및 Windows에 대한 설치 지침을 나열할 것입니다. 해당 지침에 따라 설치하세요.

<div class="content-ad"></div>

Linux/WSL (CPU/GPU)

CPU만 설정하는 경우에 필요한 단계이며 GPU 설정을 구성하기 위한 예비 요구 사항으로도 사용됩니다.

```js
$ sudo apt install python3.10-venv python3.10-tk
$ pip install virtualenv 
$ python3.10 -m venv  venv
$ source ./venv/bin/activate
(venv)$ pip3 install tk numpy torch bertviz ipython transformers accelerate huggingface_hub hf_transfer
```

Linux/WSL (GPU)

<div class="content-ad"></div>

리눅스에서 GPU 지원을 위해 추가 패키지 설치하기

```js
(가상환경)$ pip3 install bitsandbytes accelerate autoawq optimum auto-gptq
```

Windows 설치 (CPU/GPU)

이 단계들은 CPU에서 설정하는 데 필수적이며, 윈도우에서 GPU 설정을 구성하는 데 기본 요구사항으로 작용합니다.

<div class="content-ad"></div>

```js
> pip install virtualenv
> python3.10 -m venv  venv
> venv\Scripts\activate
(venv)> pip3 install tk numpy torch bertviz ipython transformers huggingface_hub hf_transfer
```

+Windows (GPU)

윈도우에서 GPU용 추가 패키지를 설치/업데이트 해주세요.

```js
(venv)> pip3 install accelerate autoawq optimum auto-gptq
(venv)> pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
(venv)> python -m pip install bitsandbytes==0.39.1 --prefer-binary --extra-index-url=https://jllllll.github.io/bitsandbytes-windows-webui
```

<div class="content-ad"></div>

NVidia GPU에서 Large Language Models (LLMs)를 실행하기 위해 몇 가지 설치가 필요합니다:

- PyTorch 및 CUDA 설정: NVidia GPU 기능을 활용하기 위해 torch, torchvision 및 torchaudio를 CUDA 지원과 함께 설치해야 합니다. 일반적으로 Linux 사용자는 기본 PyTorch 설치에서 CUDA 지원을 받지만, Windows 사용자는 torch+cuda 설치를 위한 index-url을 지정해야 합니다. 최신 업데이트에 따르면 PyTorch는 CUDA toolkit 버전 12.1까지 호환됩니다. CUDA 호환성 및 설치 안내에 대한 최신 정보는 PyTorch 웹사이트 (PyTorch — 로컬에서 시작하기)에서 확인할 수 있습니다.
- bitsandbytes 설치 변형: bitsandbytes의 표준 설치는 Linux에 최적화되어 있으며, 하나의 릴리스 빌드에서 여러 CUDA 버전을 수용합니다. 그러나 Windows 사용자는 소스에서 직접 빌드하거나 비공식 GitHub 저장소를 사용하여 설치해야 합니다. Windows용 구체적인 설치 지침은 이 기사의 이전 섹션에서 찾을 수 있습니다. Windows를 위한 추가 정보 및 안내는 bitsandbytes 비공식 Windows 저장소(https://github.com/jllllll/bitsandbytes-windows-webui)에서 확인할 수 있습니다.
- Cuda Toolkit 필요성: GPU 기반 작업을 용이하게 하기 위해 https://developer.nvidia.com/cuda-12-1-0-download-archive에서 Cuda toolkit을 설치하세요. 사용 중인 torch+cuda 버전과 CUDA toolkit 버전을 일치시키는 것이 좋습니다. 현재 최신 torch는 CUDA 버전 12.1을 지원합니다.
- Microsoft C++ 빌드 도구: Windows에서 GPU 프로세스를 실행하려면 Microsoft C++ 빌드 도구를 설치해야 합니다. 이는 accelarate 및 autoawq 패키지의 psutils 종속성으로 인한 것입니다.
- autoawq 패키지는 GPU에서 AWQ 기반 양자화 모델을 실행해야 하는 경우에만 필요합니다.

Windows 시스템의 특정 요구 사항을 고려하여 NVidia GPU에서 LLMs를 효과적으로 실행하기 위한 중요한 단계입니다. huggingface 설치 및 모델 다운로드에 대한 자세한 정보는 link1과 link2를 확인하세요.

Huggingface에 계정을 생성하면 토큰을 생성할 수 있는 능력이 생깁니다. 이 토큰은 export(예: HF_TOKEN)을 통해 환경에 구성하거나 Huggingface API와 함께 매개변수로 사용하여 모델 다운로드 및 다른 포턜 작업에 사용할 수 있습니다. 이 토큰은 서비스에 액세스하기 위한 패스로 생각할 수 있습니다. 또한 Llama와 같은 특정 모델을 다운로드하려면 승인이 필요할 수 있으며, 계정을 사용하여 Huggingface 포턜을 통해 요청할 수 있습니다. 부여된 모든 승인은 계정과 그 계정으로 생성된 모든 토큰과 연결됩니다.

<div class="content-ad"></div>

# 추론

이 스크립트는 추론 모드를 구체화하여 모델 실행에 적합한 하드웨어(CPU 또는 GPU)를 선택합니다. 만약 추론 모드가 'cpu'로 설정되어 있다면, GPT-2 모델이 로드되며, 작은 크기(~500MB)로 CPU 사용에 이상적이기 때문에 'cpu'로 설정된 device_map을 사용하여 타겟팅된 실행이 가능합니다. 반대로, GPU 사용 시에는 더 큰 Meta LLaMA 2 7B 모델(~13GB)을 선택하며, 'auto'로 설정된 device_map을 활용하여 유연한 장치 할당을 하고 load_in_4bit을 활성화하여 메모리 사용량을 최소화하여 한정된 메모리를 가진 GPU에서 큰 모델의 작동을 촉진합니다. pipeline 함수는 로드된 모델과 토크나이저를 사용하여 텍스트 생성 파이프라인을 생성하며, max_new_tokens와 같은 매개변수를 설정하여 생성된 텍스트의 길이를 제어합니다. 또한 streamer가 파이프라인에 전달되어, 스트리밍된 텍스트 생성이 사용될 것을 나타냅니다.

inference.py
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TextStreamer, pipeline, BitsAndBytesConfig

inference_type = 'cpu'
if inference_type == 'cpu':
    # CPU 추론
    model_name = 'gpt2'  # ~500MB 원본 크기
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map='cpu'
    )
else:    
    # GPU 추론; 'gpu'
    model_name = 'meta-llama/Llama-2-7b-hf'  # ~13GB 원본 크기
    quantization_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.bfloat16)
    model = AutoModelForCausalLM.from_pretrained(
        model_name, 
        device_map='auto',
        quantization_config=quantization_config)
tokenizer = AutoTokenizer.from_pretrained(model_name)
streamer = TextStreamer(
     tokenizer,
     skip_prompt=False,
     skip_special_tokens=False
)
text_pipeline = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=100,  # 생성할 토큰의 최대 수
    streamer=streamer,     
)
prompt='I like apple pie'
text_pipeline(prompt) 
``` 

<div class="content-ad"></div>

제공된 예제에서는 사전 학습된 모델을 사용하고 있습니다. 이 모델은 일련의 토큰과 같은 특정 키워드를 필요로 할 수도 있습니다. 모델이 이러한 토큰을 요구하는지 확인하려면 tokenizer_config.json 파일에서 add_bos_token 및 add_eos_token 설정을 확인할 수 있습니다. 이를 자동으로 처리하는 실용적인 방법은 text_pipeline 추론 호출에서 add_special_tokens=True (기본값 False)로 설정하는 것입니다. 이렇게 하면 프레임워크가 모델로 전송되기 전에 프롬프트에 특수 키워드를 삽입할지 여부를 결정할 수 있습니다. 위 예시에서는 해당 매개변수를 사용하지 않았습니다.

스크립트 실행

```js
(venv)$ python inference.py
```

출력:

<div class="content-ad"></div>

BitsAndBytesConfig가 load_in_4bit=True로 전달되어 있습니다. 이는 변환 라이브러리에게 모델의 가중치를 4비트로 줄이라는 지시를하는 것이고, 이는 모델의 원래 크기의 25%에 해당합니다 (Llama 2는 float16 형식입니다). 이는 추론 속도를 향상시킵니다. bnb_4bit_compute_dtype는 torch.bfloat16으로 설정되어 있어 GPU에서 실제 계산이 여전히 float16로 수행되도록 합니다. 선택할 수 있는 대안 옵션은 load_in_8bit=True이며, load_in_4bit 옵션과 상호 배제됩니다. 8비트 모드는 약간 향상된 정확성을 제공하지만 모델 크기를 원래 크기의 50%로 줄이고 추론 속도를 낮춥니다. 양자화 옵션을 선택하지 않은 경우 변환 라이브러리는 가용한 VRAM에 따라 전체 모델을 GPU의 비디오 RAM에로드하는 것을 기본값으로 설정합니다.

# 사전 양자화 모델 로드

GPU 추론 시 모델을 로드할 때마다 양자화하는 대신, 디스크에서 사전 양자화 된 모델을로드할 수 있습니다. 인기있는 양자화 형식 중 두 가지는 GPTQ 및 AWQ입니다. Huggingface는 둘 다 지원합니다.

AWQ 유형 모델의 경우 아래 코드로 모델로드 라인을 대체하면 됩니다 (GPU 추론 경로에서). BitsAndBytesConfig 매개 변수가 생략됩니다. 왜냐하면 모델이 이미 양자화되어 있기 때문입니다.

<div class="content-ad"></div>

```js
model_name='TheBloke/zephyr-7B-alpha-AWQ' 
model = AutoModelForCausalLM.from_pretrained( 
    model_name, 
    device_map='auto')
```

GPTQ 모델의 경우 아래 라인으로 모델 로드를 대체합니다.

```js
model_name='TheBloke/zephyr-7B-beta-GPTQ' 
model = AutoModelForCausalLM.from_pretrained( 
    model_name, 
    revision='main', 
    device_map='auto')
```

GitHub 브랜치에 해당하는 revision을 사용했습니다. zephyr-7B-beta-GPTQ 양자화 버전은 서로 다른 브랜치에 저장되어 있습니다. 자세한 내용은 https://huggingface.co/TheBloke/zephyr-7B-beta-GPTQ의 ‘Files and versions’ 탭을 참조해주세요.

<div class="content-ad"></div>

# GGUF 양자화

GGUF는 llama.cpp에서 소개된 인기 있는 양자화 방법입니다. ctransformers는 GGML/GGUF 라이브러리를 사용하여 C/C++로 구현된 Transformer 모델용 Python 바인딩입니다. 또한 RAG Langchain과 통합되어 있습니다.

귀하의 구성에 따라 ctransformers 패키지를 설치하세요.

```js
(venv)$ pip install ctransformers
```

<div class="content-ad"></div>

huggingface-cli를 사용하여 GGUF 형식 모델을 다운로드하거나 from_pretrained() 호출을 통해 해당 모델의 첫 API 호출 시 자동으로 다운로드됩니다. 아래 코드 샘플은 GGUF 형식의 모델에 대해 ctransformers를 활용하는 방법을 보여줍니다. from_pretrained 메서드는 이전에 다운로드되지 않은 경우 Hugging Face에서 모델을 자동으로 가져옵니다. zephyr GGUF와 같은 일부 모델 유형은 동일한 리포지토리에 파일로 저장됩니다. 여기서 리포지토리 이름은 'TheBloke/zephyr-7B-beta-GGUF'이고 모델 파일은 zephyr-7b-beta.Q4_K_M.gguf입니다.

inference.py

```js
from ctransformers import AutoModelForCausalLM
# Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
llm = AutoModelForCausalLM.from_pretrained(
    'TheBloke/zephyr-7B-beta-GGUF',
    model_file='zephyr-7b-beta.Q4_K_M.gguf',
    model_type='llama',
    gpu_layers=32
)
prompt='<s>I like apple pie'
# Do inference with streaming
stream=llm(prompt, stream=True)
for chunk in stream:
    print(chunk, end="", flush=True)
```

사용 중인 특정 모델에 따라 gpu_layers 설정을 조정하세요. 이 경우, GPU에 32개 레이어를 할당하도록 설정합니다. 추론에 stream=True을 설정하면 모델이 생성하는 토큰을 실시간으로 표시할 수 있습니다. zephyr용 다양한 양자화된 모델 버전은 https://huggingface.co/TheBloke/zephyr-7B-beta-GGUF에서 확인할 수 있습니다.

<div class="content-ad"></div>

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

# LLama.cpp python

LLama.cpp은 다양한 백엔드(CUDA, Metal, OpenCL, SYCL)를 지원하여 적응성을 높인 유연한 C/C++ 라이브러리로, Meta의 LLaMA 모델과 같은 대규모 언어 모델에서 추론을 실행할 수 있는 능력으로 AI 분야에서 인식을 얻고 있습니다. llama-cpp-python 패키지를 통한 Python 통합은 사용자가 C/C++의 성능을 누리면서도 Python의 간편함을 누릴 수 있도록 합니다.

llama-cpp-python을 설치하는 선호하는 방법은 소스에서 컴파일하는 것입니다. 이 방법을 권장하는 이유는 기밀된 C/C++ 라이브러리인 llama.cpp이 특정 시스템에 맞춘 컴파일러 최적화를 활용하기 때문입니다. 미리 빌드된 이진 파일을 선택하면 이러한 최적화를 포기하거나 다양한 플랫폼용 이진 파일을 관리해야 할 수도 있습니다. llama-cpp-python을 컴파일하면 llama.cpp 라이브러리를 자동으로 라이브러리 파일(lib)로 빌드합니다. 이 라이브러리 파일은 특정 바인딩을 통해 Python에서 활용되어, Python 스크립트가 llama.cpp의 기능에 액세스하고 사용할 수 있도록 합니다. 컴파일 세부 정보는 llama-cpp-python의 github 저장소를 참조하세요.

<div class="content-ad"></div>

시스템에는 해당 버전의 BLAS 라이브러리가 설치되어 있어야 합니다. llama.cpp README의 ‘BLAS 빌드’ 섹션을 확인해보세요.

Intel ARC GPU는 SYCL을 통해 지원되며, 이를 위해서는 Intel OneAPI가 설치되어 있어야 합니다. README의 SYCL 섹션을 확인해보세요.

llama-cpp-python의 자세한 빌드 지시사항은 https://github.com/abetlen/llama-cpp-python에서 찾을 수 있습니다.

간단한 지시사항은 여기에 있습니다.

<div class="content-ad"></div>

CPU 또는 GPU용 llama-cpp-python 패키지를 설치해 보세요.

```js
# CPU 빌드용
(venv)$ CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS" pip install llama-cpp-python --upgrade --force-reinstall --no-cache-dir

# Nvidia GPU 빌드용
(venv)$ CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python --upgrade --force-reinstall --no-cache-dir

# Intel ARC GPUS를 위한 SYCL을 통한 빌드
source /opt/intel/oneapi/setvars.sh   
CMAKE_ARGS="-DLLAMA_SYCL=on -DCMAKE_C_COMPILER=icx -DCMAKE_CXX_COMPILER=icpx" pip install llama-cpp-python
```

llama-cpp-python은 Hugging Face에서 얻을 수 있는 GGUF 모델 형식을 요구합니다. 그러나 llama의 API 사양으로 인해, 모델을 수동으로 다운로드하여 다른 디렉토리에 저장한 다음 해당 디렉토리 경로를 llama-cpp-python에 지정해야 합니다. 이번에는 우리의 정규 절차에서 벗어나, 명시적 로컬 폴더로 직접 다운로드하는 방식으로 사용 설명서 tuning된 Llama 2 모델을 사용하겠습니다.

```js
(venv)$ huggingface-cli download TheBloke/Llama-2-7b-Chat-GGUF llama-2-7b-chat.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks True
```

<div class="content-ad"></div>

local-dir-use-symlinks를 True로 설정하여 활성화하면 현재 디렉토리에 모델을 캐시 디렉토리에 이미 다운로드된 모델을 가리키는 심볼릭 링크를 생성하려고 시도하므로 시간과 공간을 효율적으로 사용할 수 있습니다. 심볼릭 링크를 사용하지 않고 현재 디렉토리에 모델의 완전한 사본이 필요하다면 이 옵션을 생략하는 것이 가장 좋습니다.

현재 디렉토리에 모델을 다운로드한 경우 model_path는 절대 경로 또는 상대 경로로 지정해야 합니다.

inference.py

```python
from llama_cpp import Llama
import llama_cpp
llm = llama_cpp.Llama(model_path="./llama-2-7b-chat.Q4_K_M.gguf",
                verbose=True, n_gpu_layers=-1, chat_format="llama-2")
prompt = '[INST] Hi there, write me 3 random quotes [/INST]'
stream = llm(prompt, max_tokens=2048, echo=False, temperature=0, stream=True)
result = ""
for output in stream:
    result += output['choices'][0]['text']
    print(output['choices'][0]['text'], end="")
```

<div class="content-ad"></div>

위의 코드는 시스템이 Llama2 7B 모델의 모든 레이어(n_gpu_layers=-1)를 GPU에로드하도록 지시합니다. 사용 가능한 VRAM에 따라 n_gpu_layers 값을 수정하여 CPU와 GPU 사이의 작업 부하를 분산시킬 수 있으며, 예를 들어 대규모 모델을 효과적으로 관리하기 위해 작업을 균등하게 분할할 수 있습니다.

프롬프트 구문의 중요성

위에서 사용된 모델은 채팅용으로 조정된 모델이므로 프롬프트 형식은 매우 중요합니다([INST] 사용). 이는 모델의 이해와 작업 실행에 상당한 영향을 미치기 때문입니다. 지시에 따라 응답을 생성할 수 있도록 특별히 설계된 지시에 조정된 모델은 상세 명령을 따르고 프롬프트에서 제공된 지침에 따라 응답을 생성합니다. 올바른 구문은 모델이 지시의 의도를 정확하게 이해하고 결과가 정확하고 타당한 것을 보장하는 데 중요합니다. 또한 다양한 모델 아키텍처는 다른 프롬프트 구문에 최적으로 반응할 수 있도록 세밀하게 조정됩니다.

<div class="content-ad"></div>

# llama.cpp 기반의 GPT-3.5 대체품입니다.

이 섹션은 llama.cpp를 OpenAI의 GPT 엔드포인트 대신 사용할 수 있는 방법을 탐구합니다. llama.cpp 모델을 활용하여 OpenAI의 서비스에 의존하지 않고 로컬 llama.cpp 모델을 사용하여 GPT 기반 애플리케이션을 운영할 수 있습니다. 로컬 API 서버를 실행함으로써 OpenAI의 GPT API 엔드포인트의 기능을 모방하면서도 llama 모델을 사용하여 요청을 처리할 수 있습니다. 이는 GPT-3.5 또는 GPT-4를 대상으로 한 애플리케이션이 llama.cpp를 사용하도록 원활하게 전환할 수 있음을 의미합니다. 최종 목표는 비용을 절감하는 것뿐만 아니라 데이터가 로컬 환경 내에서 개인 정보 보호 및 안전성을 유지하도록 하는 것입니다.

![이미지](/assets/img/2024-06-23-LLMsMadeAccessibleABeginnersUnifiedGuidetoLocalDeploymentviaPython_2.png)

먼저 llama-cpp-python과 서버 지원 및 필수 요소를 설치해야 합니다. 패키지가 처음에 CPU 사용을 위해 설정되어 있고 이제 GPU 사용으로 전환하고 싶은 경우(또는 그 반대인 경우) 새 대상을 위해 설치 명령을 다시 실행하여 다시 설치해야 합니다.

<div class="content-ad"></div>

```js
# CPU 빌드용
(venv)$ CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS" pip install llama-cpp-python[server] --upgrade --force-reinstall --no-cache-dir

# Nvidia GPU 빌드용
(venv)$ CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python[server] --upgrade --force-reinstall --no-cache-dir
```

openai 패키지 설치

```js
(venv)$ pip install openai
```

huggingface-cli 도구를 사용하여 로컬 폴더에 모델 다운로드하기


<div class="content-ad"></div>

```js
(venv)$ huggingface-cli TheBloke/Llama-2-7b-Chat-GGUF 다운로드 llama-2-7b-chat.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks True
```

모델에 입력하기 전에 프롬프트를 Llama-2 형식으로 구조화하는 방법과 함께 서버를 실행합니다.

```js
(venv)$ python3 -m llama_cpp.server --model ./llama-2-7b-chat.Q4_K_M.gguf --n_gpu_layers 35 --chat_format llama-2
```

서버는 기본적으로 포트 8000을 사용하도록 구성되어 있습니다. 아래의 클라이언트 스크립트에서 서비스에 연결하도록 설계된 경우 사용자 정의 포트 실행에 필요한 포트 번호를 수정하세요. 모델 매개변수에는 더미 값(e.g. xxxxx)이 할당되어 있으며, 이는 서버에서 무시되며 본 예제에서는 간편함을 위해 인증 프로세스가 포함되어 있지 않습니다. 또한 서버가 올바르게 실행 중인지 확인하려면 브라우저에서 http://localhost:8000/docs#/을 방문하세요.


<div class="content-ad"></div>

client.py

```python
from openai import OpenAI
client = OpenAI(base_url="http://127.0.0.1:8000/v1") 
stream = client.chat.completions.create(
  model="xxxxx",
  messages=[
    {"role": "system", "content": "You are a well-read scholar with a deep appreciation for literature, especially when it comes to the subject of artificial intelligence (AI)"},
    {"role": "user", "content": "Give me 3 quotes on AI."}
  ],
  temperature=0.01,
  stream=True,  
)
for chunk in stream:
    if not chunk.choices or chunk.choices[0].delta.content is None:
        continue
    print(chunk.choices[0].delta.content, end="")
print("\n")
```

Run the client script in another terminal.

```bash
(venv)$ python client.py
```

<div class="content-ad"></div>

수신된 출력 스트림은 터미널 창에 표시됩니다.

출력 (모델에서 받은 대로):


---
# 참고 자료


<div class="content-ad"></div>

- Hugging Face [https://huggingface.co/]
- llama.cpp에 대한 Python 바인딩 [https://github.com/abetlen/llama-cpp-python]
- 양자화 [https://huggingface.co/docs/optimum/concept_guides/quantization]
- 당신에게 적합한 양자화 방법은 무엇인가요? (GPTQ vs. GGUF vs. AWQ) [https://towardsdatascience.com/which-quantization-method-is-right-for-you-gptq-vs-gguf-vs-awq-c4cd9d77d5be]
- Nvidia CUDA [https://developer.nvidia.com/cuda-12-1-0-download-archive]