---
title: "Ollama를 사용하여 모델 실행하기 단계별 안내"
description: ""
coverImage: "/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_0.png"
date: 2024-05-27 14:51
ogImage: 
  url: /assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_0.png
tag: Tech
originalTitle: "Running models with Ollama step-by-step"
link: "https://medium.com/@gabrielrodewald/running-models-with-ollama-step-by-step-60b6f6125807"
---


LLM을 빠르게 테스트할 수 있는 방법을 찾고 계신가요? 전체 인프라를 설정할 필요 없이 테스트할 수 있는 방법이 있다면 정말 훌륭하죠. 이 짧은 기사에서 우리가 할 일이 바로 그거에요.

![이미지](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_0.png)

Ollama에 관해 경험이 있는 경우에는 특정 단락으로 이동해도 됩니다. 이 기사에서 찾을 수 있는 내용은 다음과 같아요:

- Ollama가 무엇인가요?
- Windows에 Ollama 설치하기.
- Ollama [cmd] 실행하기.
- 로컬로 모델 다운로드하기.
- 다양한 용도에 맞는 다른 모델.
- 모델 실행하기 [cmd].
- CPU에 친화적인 양자화된 모델.
- 다른 소스에서 모델 통합하기.
- Ollama-파워드 (Python) 앱으로 개발자들의 삶을 더 쉽게 만들기.
- 요약.

<div class="content-ad"></div>

# 1. Ollama이란?

Ollama는 오픈 소스 코드로, 로컬에서 또는 본인의 서버에서 언어 모델과의 원활한 통합을 가능하게 하는 사용 준비 도구입니다. 이를 통해 상업용 API의 유료 버전을 사용하지 않아도 되므로, 특히 이제 Meta가 Llama2 모델을 상용으로 사용 가능하게 한 것을 고려하면, 자신의 데이터셋에서 추가 학습에 적합합니다.

➡️ GitHub 저장소: https://github.com/ollama/ollama

➡️ Ollama 공식 웹페이지: https://ollama.com

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_1.png)

# 2. Windows에서 Ollama 설치하기

Ollama는 Windows, Mac 및 Linux에서도 원활하게 작동합니다. 이 간단한 자습서는 특히 Windows 10용 설치 단계를 안내합니다. 설치 후 프로그램은 약 384MB를 차지합니다. 그러나 다운로드한 모델이 가벼운 것은 아닐 수 있습니다.

만약 도커 컨테이너에서 Ollama를 실행하길 원한다면, 아래 설명을 건너뛰고 

감십시오.

<div class="content-ad"></div>

➡️ https://ollama.com/blog/ollama-is-now-available-as-an-official-docker-image

![Running Models with Ollama](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_2.png)

➡️ Ollama 홈페이지로 이동하여 .exe 파일을 다운로드하세요: https://ollama.com

![Running Models with Ollama](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_3.png)

<div class="content-ad"></div>

Ollama를 다운로드하고 Windows에 설치하세요. 보통 다음 경로에 위치한 기본 모델 저장 경로를 사용할 수 있습니다:

```js
C:\Users\your_user\.ollama
```

그러나 C: 파티션에 공간이 제한적이라면, 대안 디렉토리로 전환하는 것이 권장됩니다. D:\와 같은 다른 파티션이 있는 경우, 간단하게:

- 데스크탑의 컴퓨터 아이콘을 마우스 오른쪽 클릭합니다.
- 속성을 선택한 후 "고급 시스템 설정"으로 이동합니다.
- 환경 변수를 클릭합니다.
- ...을 위한 사용자 변수에서 모델을 저장할 디렉토리의 절대 경로를 삽입하십시오. 예를 들면:

<div class="content-ad"></div>

```js
변수: OLLAMA_MODELS
값: D:\your_directory\models
```

OLLAMA_MODELS 변수의 이름을 변경하지 마십시오. 이 변수는 Ollama가 정확히 아래와 같이 검색할 것입니다.

Windows의 하단 표시줄에 Ollama 아이콘이 나타납니다. 프로그램이 시작되지 않으면 Windows 프로그램에서 찾아서 거기서 시작하십시오.

<img src="/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_4.png" />


<div class="content-ad"></div>

이제 Ollama를 실행하고 모델을 다운로드할 준비가 되었어요 :)

# 3. Ollama 실행하기 [cmd]

![image](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_5.png)

Ollama를 설정하고 나면 윈도우에서 cmd(명령줄)를 열고 로컬로 일부 모델을 다운로드할 수 있어요.

<div class="content-ad"></div>

Ollama 로컬 대시보드를 사용하려면 웹 브라우저에서 다음 URL을 입력하세요:

```js
http://localhost:11434/api/
```

Ollama를 실행하는 것은 그렇게 어렵지 않습니다. 나중에 CMD 및 Python 코드를 통해 어떻게 활용하는지 알아보겠습니다.

중요한 몇 가지 명령어:

<div class="content-ad"></div>

로컬로 사용 가능한 모델을 확인하려면 다음을 cmd에 입력하세요:

```js
ollama list
```

특정 모델에 해당하는 SHA 파일을 확인하려면 cmd에 입력하세요 (예: llama2:7b 모델 확인을 위한 예시):

```js
ollama show --modelfile llama2:7b
```

<div class="content-ad"></div>

모델을 제거하려면:

```js
ollama rm llama2:7b
```

모델을 서버에 올리려면:

```js
ollama serve
```

<div class="content-ad"></div>

# 4. 모델을 로컬로 다운로드하기

웹사이트 ➡️ https://ollama.com/library 에서는 여러 다양한 파라미터 크기로 제공되는 다수의 모델을 다운로드할 수 있습니다.

로컬로 모델을 다운로드하기 전에, 해당 모델을 로딩할 충분한 메모리를 가지고 있는지 확인해주세요. 테스트할 때는 애플리케이션에 통합하기에 적합한 작은 모델인 '7B'로 레이블이 지정된 모델을 사용하는 것이 좋습니다.

⚠️ 부드러운 모델 작동을 위해 적어도 하나의 GPU를 보유하는 것이 강력하게 권장됩니다.

<div class="content-ad"></div>

아래에는 내가 테스트하고 추천하는 여러 모델이 있습니다. 명령을 복사하여 명령 프롬프트에 붙여넣어 지정된 모델을 로컬로 가져올 수 있습니다.

👉Meta에서의 Llama2 모델

대화 시나리오를 위해 최적화된 생성 텍스트 모델 세트입니다. Ollama의 많은 모델과 마찬가지로 Llama2는 다양한 구성으로 제공됩니다:

![image](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_6.png)

<div class="content-ad"></div>

아래는 해당 모델을 가져오는 몇 가지 예시입니다:

표준 모델:

```js
ollama pull llama2
```

검열되지 않은 버전:

<div class="content-ad"></div>

```js
ollama pull llama2-비겁하지 않은:7b
```

채팅 7B 모델:

```js
ollama pull llama2:7b-채팅
```

➡️ 더 읽기: https://llama.meta.com/llama2


<div class="content-ad"></div>

👉 구글의 젬마

주요 7B 크기 모델과 유사한 견고한 성능을 제공하는 오픈 소스 모델입니다.

```js
ollama pull gemma:7b
```

➡️ 자세히 보기: https://blog.google/technology/developers/gemma-open-models/

<div class="content-ad"></div>

👉 Haotian Liu 등의 LLava.

이미지에서 텍스트 설명을 다루는 데 뛰어나며 시각 및 언어 모델 모두에 대한 견고한 지원을 제공하는 멀티모달 모델입니다.

```js
ollama pull llava
```

➡️ 자세히 알아보기: https://llava-vl.github.io/

<div class="content-ad"></div>

5. 서로 다른 목적을 위한 다양한 모델

![이미지](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_7.png)

일부 모델은 특정 데이터셋에서 훈련되어 코드 완성, 대화 또는 이미지에서 텍스트로 변환과 같은 특정 작업에 더 적합합니다. Ollama에서는 다양한 목적을 위해 설계된 모델을 찾을 수 있습니다.

첫 번째 그룹은 대화, 텍스트 완성, 요약 등을 용이하게 하는 데 초점을 맞춘 모델을 포함하고 있습니다. Gemma, Llama2, Falcon 또는 OpenChat과 같은 모델이 포함됩니다.

<div class="content-ad"></div>

일부 예시:

- [Falcon](https://ollama.com/library/falcon)

- [Gemma](https://ollama.com/library/gemma)

- [Openchat](https://ollama.com/library/openchat)

<div class="content-ad"></div>

다음 그룹은 대화를 나누거나 챗봇 역할을 하는 다중 모달 모델과 이미지 설명(시각 모델), 텍스트 요약, 질문-답변(Q/A) 애플리케이션을 구동할 수 있는 모델들로 구성됩니다.

일부 예시:

➡️ https://ollama.com/library/llava

➡️ https://ollama.com/library/bakllava

<div class="content-ad"></div>

마지막으로, 매우 전문화된 그룹은 Ollama에서 이용 가능한 모델을 활용하여 개발자의 작업을 지원합니다. 코델라마, 돌핀-미스트랄, 돌핀-믹스트랄(코딩 작업에 능숙한 Mixtral 전문가 모델을 기반으로 세밀하게 조정된 모델)과 같은 모델들이 있으며, 계속해서 크리에이터들이 추가하고 있습니다.

몇 가지 예시:

➡️ https://ollama.com/library/codellama

➡️ https://ollama.com/library/dolphin-mistral

<div class="content-ad"></div>

➡️ https://ollama.com/library/dolphin-mixtral

# 6. 모델 실행하기 [cmd]

다운로드한 모델을 실행하려면, ollama run 모델이름:파라미터 "당신의 프롬프트"를 입력하세요. 예를 들어:

```js
ollama run llama2:7b "당신의 프롬프트"
```

<div class="content-ad"></div>

다중 모달 모델을 사용하면 기본 프롬프트를 벗어난 파일, 로컬 이미지 경로 등을 포함할 수 있어 더 많은 기능을 확장할 수 있습니다.

# 6. CPU 친화적 양자화 모델

양자화는 모델의 정밀도를 유지하는 비용을 줄이는 것으로 관련 비용을 줄이는 것입니다. 이 과정 뒤에 숨은 직관력을 구축하는 데 도움이 되는 이 크고 훌륭한 기사에서 자세한 설명을 찾아볼 수 있습니다:

📃 양자화 LLMs란 무엇인가? (Miguel Carreira Neves의 글):

<div class="content-ad"></div>

➡️ https://www.tensorops.ai/post/what-are-quantized-llms

추가 자료:

📃 Extreme Compression of Large Language Models via Additive Quantization:

➡️ https://arxiv.org/html/2401.06118v2

<div class="content-ad"></div>

📃 SmoothQuant: 대형 언어 모델을 위한 정확하고 효율적인 사후 훈련 양자화:

➡️ [논문 링크](https://arxiv.org/pdf/2211.10438.pdf)

📃 BiLLM: LLMs를 위한 사후 훈련 양자화 한계 돌파:

➡️ [논문 링크](https://arxiv.org/pdf/2402.04291.pdf)

<div class="content-ad"></div>

간단하게 말하면, 양자화는 가중치 정밀도를 조정하여 모델 크기를 줄이고 중요한 정확도 하락 없이 성능을 쉽게 감소시킬 수 있는 하드웨어에서 실행할 수 있게 해줍니다.

이 글과 함께 제공된 이미지를 통해 양자화 후에 모델이 원래 버전보다 상당히 적은 공간을 차지하는 것을 확인할 수 있습니다:

![Quantized Models](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_8.png)

Ollama는 양자화된 모델을 지원하여 별도로 처리하는 부담을 덜어줍니다.

<div class="content-ad"></div>

# 7. 다른 소스에서 모델 통합하기

![Running Models With Ollama Step-by-Step](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_9.png)

Ollama의 모델은 다양성을 제공하지만 현재 모든 모델에 액세스할 수 있는 것은 아닙니다. 그러나 로컬에 직접 모델을 통합하는 것은 간단한 프로세스입니다. 새로운 모델을 지역 Ollama에 통합하는 방법을 알아봅시다.

The Bloke의 HuggingFace 계정에서 많은 양자화된 모델을 사용할 수 있습니다. 의학 논문을 위해서 우리는 편리하게 medicine-chat-GGUF 모델을 선택할 수 있습니다:

<div class="content-ad"></div>

➡️ https://huggingface.co/TheBloke/medicine-chat-GGUF

해당 링크를 열고 파일 및 버전을 클릭하세요.

![Files and versions](/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_10.png)

Ollama 모델에 포함하고 싶은 모델을 다운로드하세요:

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-RunningmodelswithOllamastep-by-step_11.png" />

Modelfile이라는 빈 파일을 생성하고 아래 지정된 데이터를 삽입하세요 (저장된 모델의 절대 경로로 경로를 대체하십시오). 이 예제는 기본적이며, 모델의 온도, 시스템 메시지 등과 같은 여러 옵션을 포함하여 확장될 수 있습니다. 필요한 경우 파일에서 '#'를 제거하여 해당 옵션을 활성화하세요.

```js
FROM D:\...\medicine-chat.Q4_0.gguf
# PARAMETER 온도 0.6
# SYSTEM """도움이 되는 의학 조수입니다."""
```

Modelfile을 저장한 후, cmd에 다음을 입력하세요:

<div class="content-ad"></div>

```bash
ollama create 모델_이름 -f 모델_파일
```

# 9. Ollama를 활용한 (Python) 앱으로 개발자의 삶을 더 쉽게 만들기

백그라운드에서 실행되는 Ollama는 일반적인 REST API와 같이 접근할 수 있습니다. 따라서 requests와 같은 라이브러리 또는 조금 더 발전된 FastAPI, Flask 또는 Django와 같은 프레임워크를 사용하여 응용 프로그램에 쉽게 통합할 수 있습니다.

Ollama python 패키지를 쉽게 pip를 통해 설치하세요.

<div class="content-ad"></div>

⬆️ https://pypi.org/project/ollama/0.1.3:

```js
pip install ollama
```

Python 코드를 통해 임베딩을 생성하는 방법:

```js
import ollama

embedding = ollama.embeddings(model="llama2:7b", prompt="Hello Ollama!")
```

<div class="content-ad"></div>

간단히 CURL을 사용하여:

```js
curl http://localhost:11434/api/embeddings -d '{
  "model": "llama2:7b",
  "prompt": "Here is an article about llamas..."
}'
```

Ollama 엔드포인트에 대해 더 알아보려면 다음 링크를 방문해주세요:

➡️ https://github.com/ollama/ollama/blob/main/docs/api.md

<div class="content-ad"></div>

Ollama가 Langchain 프레임워크에 원활하게 통합되어 개발 노력을 최적화하고 기술 측면의 작업을 더욱 간편하게 만들었습니다:

➡️ https://python.langchain.com/docs/integrations/llms/ollama

임베딩을 만드는 간단함을 감상해보세요:

```js
# pip install langchain_community
from langchain_community.embeddings import OllamaEmbeddings


embed = OllamaEmbeddings(model="llama2:7b")
embedding = embed.embed_query("Hello Ollama!")
```

<div class="content-ad"></div>

# 10. 요약

본 기사는 당신을 Ollama를 사용하여 모델을 실행하는 과정을 단계별로 안내하여, 전체 인프라 구성 없이 LLM을 테스트할 수 있는 원활한 방법을 제공합니다.

올라마는 오픈 소스 도구로, Meta의 Llama2 모델을 무료로 사용할 수 있게 해주는 로컬 또는 서버 기반의 언어 모델 통합을 용이하게 합니다. 윈도우에서의 설치 과정과 명령줄을 통해 Ollama를 실행하는 방법에 대해 설명되어 있습니다.

이 기사에서는 모델 다운로드, 특정 작업을 위한 다양한 모델 옵션, 다양한 명령어를 사용하여 모델 실행, CPU 친화적인 양자화된 모델, 그리고 외부 모델 통합에 대해 탐구합니다. 또한, 개발자들을 위해 Ollama를 활용한 파이썬 애플리케이션을 강조하고 있습니다.