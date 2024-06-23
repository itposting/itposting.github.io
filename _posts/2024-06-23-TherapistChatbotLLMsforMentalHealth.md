---
title: "심리 상담 챗봇  정신 건강을 위한 LLMs 사용 방법"
description: ""
coverImage: "/assets/img/2024-06-23-TherapistChatbotLLMsforMentalHealth_0.png"
date: 2024-06-23 19:51
ogImage: 
  url: /assets/img/2024-06-23-TherapistChatbotLLMsforMentalHealth_0.png
tag: Tech
originalTitle: "Therapist Chatbot — LLMs for Mental Health"
link: "https://medium.com/@dev.pandey.0302/therapist-chatbot-llms-for-mental-health-55ff5769a878"
---


<img src="/assets/img/2024-06-23-TherapistChatbotLLMsforMentalHealth_0.png" />

요즘 빠르게 변화하는 세상에서 우리의 정신 건강을 우선시할 시간을 찾기는 어려울 수 있어요. 업무, 가족, 그리고 일상 생활의 요구들은 종종 자기 관리를 할 시간을 남기지 않아서 정기적인 치료 세션은 물론 스스로를 돌보는 시간을 가져다주지 않을 때가 많아요. 시간을 내기로 결심했다고 해도, 자격 있는 치료사의 이용 가능성이 부족하면 예약을 기다리는 사람들이 많아질 수 있어요. 그리고 마침내 소중한 세션이 확보되더라도, 비용이 부담스러울 수 있어 이미 부담스러운 마음에 금전적인 압박을 느끼게 해요.

이 딜레마는 정신 건강 치료 분야에서 혁신적인 해결책에 대한 점점 더 커지는 필요성을 강조해요. 진출하게 된 것이 바로 언어 모델(Language Models, LLMs)을 기반으로 하는 치료사 챗봇들의 시대입니다. 이 가상 상담가들은 우리가 스마트폰이나 컴퓨터의 편안함 속에서 24시간 365일 즉각적인 지원을 받을 수 있도록하여 우리가 지원을 받는 방식을 혁신하려고 합니다.

인공 지능(AI)과 자연어 처리(NLP)를 활용하여, 이 챗봇들은 실제 치료 대화를 시뮬레이션할 수 있어요. 이들은 공감, 지도, 그리고 개인의 필요에 맞게 맞춤형 대처 전략을 제공할 수 있어요. 이러한 접근 방식은 특히 사회적 편견이나 물리적인 장벽 때문에 전통적인 치료를 받기 주저하는 분들에게 접근하는 데 매우 중요합니다.

<div class="content-ad"></div>

그러나 중요한 점은 심리상담사 챗봇은 정신 건강 관리를 보완할 수 있지만 전문 상담의 대체품이 아니라는 것입니다. 훈련받은 심리상담사들의 세밀한 이해력과 공감적인 대응을 갖추지 못합니다. 그들은 교육과 경험에 기초한 맞춤형 치료를 제공할 수 있는 훈련받은 상담사들의 심리 마음을 나타내지 못합니다.

심리건강 관리에 LLMs를 통합하는 목표는 접근성을 증대하고 확대하는 데 있습니다. 더 나은 심리적 안녕을 향한 여정을 하는 사람들에게 발판을 제공합니다. 심리 건강 문제에 직면한 모든 사람들에게 전문적인 도움을 구하는 것이 중요한 단계이며, 이러한 혁신은 자기 돌봄과 지원을 위한 우리 도구상자에 유망한 추가 요소로 작용합니다.

그런데, 이 기술을 활용하여 우리 자신의 심리 상담사 AI를 만들어보는 방법에 대해 깊이 파고들어 보겠습니다!

전체 프로젝트와 함께 제 GitHub는 다음에서 확인할 수 있습니다 — https://github.com/Dev-Pandey-0302/Therapist-Chatbot

<div class="content-ad"></div>

유튜브의 Nicholas Renotte에 대한 큰 찬사를 드립니다 (Nicholas Renotte를 검색해보세요, 놀라운 데이터 과학자!)

# 코딩을 시작합니다.

이 프로젝트의 핵심은 Llama_cpp 프레임워크를 기반으로 구축될 것입니다. 간단한 접근 방식은 ollama를 사용하는 것일 수 있지만, 이 안내서에서는 Llama_cpp를 사용하는 데 중점을 둘 것입니다.

먼저, 우리는 ~특정 부분이 누락되었습니다~

<div class="content-ad"></div>

```js
git clone https://github.com/ggerganov/llama.cpp
```

원하는 기계에 llama_cpp를 설치할 거예요.

다음으로, make 명령을 실행해야 해요:

- Mac: cd llama.cpp && make
- Windows (from here):


<div class="content-ad"></div>

- 최신 Fortran 버전의 w64devkit을 다운로드하세요.
- PC에 w64devkit을 압축 해제하세요.
- w64devkit.exe를 실행하세요.
- cd 명령어를 사용하여 llama.cpp 폴더로 이동하세요.
- 여기서

```js
make
```

위 명령어를 실행하세요. 그 후에는 의존성을 설치합니다. 가능하다면 의존성을 설치하기 전 가상 환경을 만들어도 좋습니다. 가상 환경을 만드는 방법을 모르신다면 아래 링크를 확인해보세요- https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/

```js
pip install openai 'llama-cpp-python[server]' pydantic instructor streamlit gtts
```

<div class="content-ad"></div>

# GGUF 모델 다운로드

GGUF가 무엇인가요?

물어봐 주셔서 감사합니다!

이 애플리케이션에서는 다음을 사용할 것입니다-

<div class="content-ad"></div>

WesselvanGils/MentaLLaMA-chat-7b-GGUF-q8

이는 8비트 양자화된 GGUF 모델입니다. 따라서 전용 서버가 필요하지 않고 로컬 머신에서 실행할 수 있습니다.

이 모델을 오픈 소스로 만들어준 Wessel van Gils에게 감사드립니다. 여기에 그들의 GitHub이 있습니다!

더 자세한 정보를 알고 싶다면 자유롭게 이 글을 읽어보세요.

<div class="content-ad"></div>

모델 다운로드로 돌아가기

여기로 이동해주세요- https://huggingface.co/WesselvanGils/MentaLLaMA-chat-7b-GGUF-q8

파일 및 버전 탭을 클릭하고 .gguf 파일을 다운로드하세요. 용량이 7GB가 넘는 파일이라 시간이 조금 걸릴 수 있으니 참고해 주세요.

# app.py 파일 만들기

<div class="content-ad"></div>

이제 app.py 파일을 만들어 봅시다.

이 튜토리얼에서는 streamlit을 사용할 것입니다. 그러나 gradio와 같은 대체 솔루션을 사용해도 괜찮습니다.

```python
from openai import OpenAI
from gtts import gTTS
from io import BytesIO, StringIO
# streamlit 앱 프레임워크 사용
import streamlit as st

# 클라이언트 생성
client = OpenAI(
    api_key="sk-1234567890",
    base_url='http://localhost:8000/v1'
)

# 앱의 제목
st.title("TherapyBot- Mental Health Support를 위한 챗봇")

# 의료 기록 업로드
uploaded_file = st.file_uploader("", type=["txt"], label_visibility="collapsed")
css = '''
<style>
    [data-testid='stFileUploader'] {
        width: max-content;
    }
    [data-testid='stFileUploader'] section {
        padding: 0;
        float: left;
    }
    [data-testid='stFileUploader'] section > input + div {
        display: none;
    }
    [data-testid='stFileUploader'] section + div {
        float: right;
        padding-top: 0;
    }

</style>
'''
st.markdown(css, unsafe_allow_html=True)

doc_data = ""
# 파일 업로드 시
if uploaded_file is not None:
    # 파일을 문자열로 읽기
    stringio = StringIO(uploaded_file.getvalue().decode("utf-8"))
    doc_data = stringio.read()
    doc_data = "This is my medical record - " + doc_data + " Please answer the following question based on the earlier medical record- "
    
# 사용자 입력 받기
prompt = st.chat_input('채팅을 시작하거나 의료 기록을 업로드하십시오. 어떻게 도와드릴까요?')
...
```

이 특정 app.py 파일은 구글의 gtts 라이브러리를 사용한 텍스트 음성 변환 기능도 제공합니다. 이를 위해서는 인터넷 연결이 필요하지만, 오프라인으로 완전히 실행하려면 gtts를 import하지 않고 마지막 4줄을 주석 처리하세요.

<div class="content-ad"></div>

이 파일을 저장한 후 로컬 서버를 실행해 보겠습니다.

# 라마.cpp 서버

터미널에서 다음을 실행하면 서버가 가동될 것입니다. 다운로드한 GGUF 모델의 경로가 올바른지 확인하세요.

```js
python -m llama_cpp.server --model D:\CHATBOT_PROJ_NEW\MentaLLaMA-chat-7b-GGUF-q8\MentaLLaMA-chat-7b-GGUF-q8.gguf --n_gpu -1
```

<div class="content-ad"></div>

# App.py 실행

로컬호스트 서버가 시작된 후, 별도의 터미널에서 다음 명령을 실행하세요

```js
streamlit run app.py
```

축하합니다!

<div class="content-ad"></div>

지역 컴퓨터에서 실행 중인 자체 치료사 AI를 만들었습니다. .txt 파일을 제공하든 일반적인 질문을 하든 자유롭게 진행해주세요!

![이미지](/assets/img/2024-06-23-TherapistChatbotLLMsforMentalHealth_1.png)

읽어 주셔서 감사합니다!