---
title: "LangFlow와 Ollama로 코딩 없이 로컬 RAG 챗봇 만들기 방법"
description: ""
coverImage: "/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_0.png"
date: 2024-06-22 20:49
ogImage: 
  url: /assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_0.png
tag: Tech
originalTitle: "Building Local RAG Chatbots Without Coding Using LangFlow and Ollama"
link: "https://medium.com/towards-data-science/building-local-rag-chatbots-without-coding-using-langflow-and-ollama-60760e8ed086"
---


⁤스마트 챗봇을 만드는 데 수개월의 코딩이 필요했던 시절을 기억하나요?

LangChain과 같은 프레임워크는 개발을 간소화했지만, 수백 줄의 코드는 프로그래머가 아닌 사람들에게 여전히 장벽일 수 있습니다. ⁤

더 간단한 방법은 없을까요? (풀 스토리를 읽기 위해 친구 링크를 찾으려면 이미 Medium 회원이 아닌 경우 Medium 회원 가입을 고려해 주세요)

![image](/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_0.png)

<div class="content-ad"></div>

그때 "Lang Flow"를 발견했어요. 이 오픈 소스 패키지는 Python 버전의 LangChain을 기반으로 구축되었습니다. 코드를 한 줄도 쓰지 않고 AI 애플리케이션을 만들 수 있게 해줘요. 챗봇을 만들기 위해 컴포넌트들을 끌어다가 캔버스에서 연결하기만 하면 돼요. 

이 게시물에서는 LangFlow를 사용해서 몇 분 안에 스마트 AI 챗봇 프로토타입을 만들 거에요. 백엔드로는 Ollama를 사용하여 임베딩 모델과 대형 언어 모델을 사용할 거에요. 이렇게 하면 응용프로그램을 로컬에서 무료로 실행할 수 있어요! 마지막으로 이 흐름을 최소한의 코딩으로 Streamlit 애플리케이션으로 변환할 거에요.

# RAG Pipeline, LangChain, LangFlow, Ollama 소개

이 프로젝트에서는 AI 챗봇을 만들어보려고 해요. "Dinnerly - 당신의 건강한 요리 플래너" 라고 이름 붙여보죠. 이 챗봇은 건강한 요리 레시피를 추천하는 것을 목표로 합니다. 이를 위해 RAG(Retrieval Augmented Generation)를 사용하여 레시피 PDF 파일에서 추출할 거에요.

<div class="content-ad"></div>

어떻게 이를 실현할 것인지에 대해 들어가기 전에 프로젝트에서 사용할 핵심 재료를 빠르게 살펴보겠습니다.

## 검색 증강 생성 (RAG)

RAG(검색 증강 생성)은 대형 언어 모델 (LLMs)이 외부 소스에서 관련 정보를 제공받아 돕는 기술입니다. 이를 통해 LLM은 응답을 생성할 때 이 문맥을 고려하여 보다 정확하고 최신의 결과를 만들어냅니다.

RAG 파이프라인에는 일반적으로 '검색 증강 생성 안내서'에 설명된대로 다음 단계가 포함됩니다.

<div class="content-ad"></div>

“
- 문서 로드: 문서 또는 데이터 원본을 먼저로드하십시오.
- 청크로 분할: 문서를 관리하기 쉬운 부분으로 나누십시오.
- 임베딩 생성: 임베딩을 사용하여 이러한 청크를 벡터 표현으로 변환하십시오.
- 벡터 데이터베이스에 저장: 이러한 벡터를 데이터베이스에 저장하여 효율적으로 검색하십시오.
- 사용자 상호 작용: 사용자로부터 쿼리 또는 입력을받고 그것을 임베딩으로 변환하십시오.
- 벡터 데이터베이스에서 의미 검색: 사용자 쿼리를 기반으로 의미 검색을 수행하기 위해 벡터 데이터베이스에 연결하십시오.
- 응답 검색 및 처리: 관련 응답을 가져와 LLM을 통과시키고 답변을 생성하십시오.
- 사용자에게 답변 전달: LLM에 의해 생성된 최종 출력물을 사용자에게 제공하십시오.
”

## Langchain

<div class="content-ad"></div>

LLMs을 중심으로 만들어진 오픈 소스 프레임워크인 LangChain은 챗봇, 요약 등 다양한 GenAI 응용 프로그램의 설계와 개발을 용이하게 합니다.

이 라이브러리의 핵심 아이디어는 다른 구성 요소를 "체인"으로 연결하여 복잡한 AI 작업을 단순화하고 LLMs 주변에서 더 많은 고급 사용 사례를 만드는 것입니다.

![이미지](/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_1.png)

## LangFlow

<div class="content-ad"></div>

LangFlow은 LangChain을 위해 특별히 설계된 웹 도구입니다. 사용자가 코딩없이 LangChain 애플리케이션을 구축하고 테스트할 수 있는 사용자 인터페이스를 제공합니다. 간단히 구성 요소를 끌어다 놓기만 하면 됩니다.

하지만 LangFlow를 사용하려면 LangChain의 작동 방식과 다양한 구성 요소에 대한 기본적인 이해가 필요합니다. 그러면 AI 애플리케이션의 흐름을 설계하는 데 LangFlow를 사용할 수 있습니다.

Ollama

Ollama은 오픈 소스 LLM을 사용하기 위한 최고이자 가장 쉬운 방법입니다. Llama 2 및 Mistral과 같은 가장 강력한 LLM을 지원하며, ollama.ai/library에서 사용 가능한 모델 목록을 찾을 수 있습니다.

<div class="content-ad"></div>


![Ollama setup](/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_2.png)

# Ollama 설정하기

## Ollama 설치

먼저 Ollama 다운로드 페이지로 이동하여 사용 중인 운영 체제와 일치하는 버전을 선택한 후 다운로드하고 설치하세요.


<div class="content-ad"></div>

Ollama를 설치한 후에 명령 터미널을 열고 다음 명령을 입력하세요. 이 명령들은 모델을 다운로드하고 로컬 머신에서 실행할 것입니다.

이 프로젝트에서는 우리가 Large Language Model (LLM)으로 Llama2를 사용하고, 임베딩 모델로 "nomic-embed-text"를 사용할 것입니다. "Nomic-embed-text"는 큰 컨텍스트 윈도우를 가진 강력한 오픈 소스 임베딩 모델입니다. 이를 통해 전체 애플리케이션을 클라우드 서비스 없이 로컬에서 실행할 수 있습니다!

```js
ollama serve
ollama pull llama2
ollama pull nomic-embed-text
ollama run llama2
```

# LangFlow 설정하기

<div class="content-ad"></div>

## 준비 사항

LangFlow을 시작하기 전에 컴퓨터에 Python이 설치되어 있는지 확인하는 것이 중요합니다. Python 버전은 3.9보다 높아야 하지만 3.12보다 낮아야 합니다.

LangFlow 설치

이제 LangFlow를 설치해 봅시다. 가상 환경 내에서 설치하는 것을 권장합니다. 이 방법을 사용하면 종속성을 깔끔하게 자체 공간 내에서 관리할 수 있습니다. 저는 Mac에서 Conda를 사용하여 설정합니다. 명령 줄 터미널에 다음 명령을 입력하여 "langflow"라는 가상 환경을 만들고 Python 3.11을 설정하세요.

<div class="content-ad"></div>

```js
conda create -n langflow python=3.11
conda activate langflow
pip install langflow
```

콘다를 사용하지 않는 경우에도 다음 명령어를 사용하여 Python으로 직접 가상 환경을 설정할 수 있어요.

```js
python -m venv langflow
source langflow/bin/activate
pip install langflow
```

설치를 마치면 LangFlow를 시작하는 것은 매우 간단합니다. 터미널에 "langflow run"을 입력하기만 하면 돼요.

<div class="content-ad"></div>


![](/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_3.png)

그런 다음, 제공된 URL을 복사하세요 (위의 예에서는 http://127.0.0.1:7860), 웹 브라우저에 붙여넣기하고, 와! 이런 식으로 보이는 인터페이스를 볼 수 있어야 합니다. 이 페이지에는 모든 프로젝트가 표시됩니다.

![](/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_4.png)

# 챗봇 플로우 디자인하기


<div class="content-ad"></div>

첫 번째 플로우를 만드는 시간이군요!

"새 프로젝트"를 클릭하여 빈 캔버스를 열어보세요. 왼쪽 창에는 드래그하여 작업 영역에 놓을 수 있는 다양한 구성 요소가 준비되어 있습니다.

우리 프로젝트를 위해 PDF 파일에서 질문에 답변할 수 있는 챗봇을 만들고 있습니다. 이전에 언급한 RAG 파이프라인을 기억하시나요? 이를 구성할 때 필요한 몇 가지 요소가 있습니다:

- PDF 로더: 여기서 "PyPDFLoader"를 사용할 것입니다. PDF 문서의 파일 경로를 입력해야 합니다.
- 텍스트 분할기: "RecursiveCharacterTextSplitter"를 선택하고 기본 설정을 사용하시면 됩니다.
- 텍스트 임베딩 모델: 무료 오픈소스 임베딩을 사용하려면 "OllamaEmbeddings"를 선택하세요.
- 벡터 데이터베이스: 임베딩을 저장하고 벡터 검색을 용이하게 하기 위해 "FAISS"를 선택합니다.
- 응답 생성을 위한 LLM: "ChatOllama"를 선택하고 모델을 "llama2"로 지정하세요.
- 대화 기억: 챗봇이 채팅 기록을 유지하도록 하는 기능으로 "ConversationBufferMemory"를 사용할 것입니다.
- 대화 검색 체인: LLM, 메모리, 검색된 텍스트 등과 같은 다양한 구성 요소를 연결하여 응답을 생성하는 기능입니다. "ConversationRetrievalChain"이 우리의 선택입니다.

<div class="content-ad"></div>

캔버스로 모든 구성 요소를 끌어다 놓고 PDF 파일 경로 및 LLM 모델 이름과 같은 필수 필드를 설정하세요. 나머지 설정은 기본값으로 두어도 괜찮습니다.

그 다음, 이러한 구성 요소를 연결하여 흐름을 만들어보세요.

모든 것이 연결되었다면, 우측 하단에 있는 "번개" 버튼을 눌러 흐름을 컴파일하세요. 모든 것이 순조롭게 진행된다면 버튼이 녹색으로 바뀌어 성공을 알리게 됩니다.

흐름을 성공적으로 컴파일한 후, "챗봇" 아이콘을 클릭하여 생성물을 테스트해보세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_5.png" />

여러 가지 팁:

- 플로우를 완료하면 JSON 파일로 저장하거나 나중에 액세스하거나 편집할 수 있도록 "내 컬렉션"에서 찾을 수 있습니다.
- 사전 빌트 예제로 LangFlow에 뛰어들면 훌륭한 영감을 얻고 시작하는 데 도움이 될 수 있습니다. 여기에 팁이 있습니다:
- "LangFlow Store"는 예제를 보유하고 있지만 액세스를 위해 API 키가 필요합니다.
- LangFlow GitHub 페이지를 통해 예제를 다운로드하여 "업로드" 버튼을 사용하여 LangFlow UI로 업로드할 수 있습니다.
- 로컬로 설정하는 것이 꺼려지면, OpenAI를 선택하여 RAG 파이프라인을 구축할 수도 있습니다. 설정을 위해 OpenAI API 키를 가지고 있는지 확인하세요.

# 플로우를 스트림릿 챗봇으로 변환하기

<div class="content-ad"></div>

이제 플로우가 완벽하게 설정되었다면, 애플리케이션에 통합할 시간입니다. 플로우를 구축한 후에는 LangFlow가 필요한 코드 조각을 제공하여 쉽게 만들어줍니다. 사이드바에서 "코드" 버튼을 누르기만 하면 됩니다.

![image](/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_6.png)

이제 이 플로우를 Streamlit 챗봇에 통합해 보겠습니다.

- 종속성 설정: 시작하기 전에 종속성을 설치해야 합니다.

<div class="content-ad"></div>

```js
pip install streamlit
pip install langflow
pip install langchain-community 
```

2. Lang Flow 코드 스니펫 가져오기: "app.py"라는 새로운 Python 파일을 만듭니다. LangFlow UI로 돌아가 "Code" 버튼을 다시 찾습니다. "Python API" 탭으로 이동하여 코드 스니펫을 복사하고 "app.py"에 붙여넣습니다.

```js
import requests
from typing import Optional

BASE_API_URL = "http://127.0.0.1:7860/api/v1/process"
FLOW_ID = "d9392262-a912-42b4-8582-cc9e48894a00"

# 원하는대로 플로우를 조정할 수 있습니다.
# 예시: {"OpenAI-XXXXX": {"model_name": "gpt-4"}
TWEAKS = {
  "VectorStoreAgent-brRPx": {},
  "VectorStoreInfo-BS24v": {},
  "OpenAIEmbeddings-lnfRZ": {},
  "RecursiveCharacterTextSplitter-bErPe": {},
  "WebBaseLoader-HLOqm": {},
  "ChatOpenAI-aQOv0": {},
  "FAISS-o0WIf": {}
}

def run_flow(inputs: dict, flow_id: str, tweaks: Optional[dict] = None) -> dict:
    """
    주어진 메시지와 선택적 조정으로 플로우를 실행합니다.

    :param message: 플로우에 보낼 메시지
    :param flow_id: 실행할 플로우의 ID
    :param tweaks: 플로우를 사용자 정의하는 선택적 조정
    :return: 플로우의 JSON 응답
    """
    api_url = f"{BASE_API_URL}/{flow_id}"

    payload = {"inputs": inputs}
    headers = None
    if tweaks:
        payload["tweaks"] = tweaks
    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()
```

3. 채팅 기능 구현: 같은 Python 파일에서 사용자의 새로운 쿼리마다 응답을 가져오기 위해 플로우를 실행하는 함수를 정의합니다. 그런 다음 이 응답을 인터페이스에 스트리밍합니다.

<div class="content-ad"></div>

```js
def chat(prompt: str):
  with current_chat_message:
    # AI가 응답할 때 메시지를 보내지 못하도록 입력을 차단합니다
    st.session_state.disabled = True

    # 사용자 메시지를 채팅 기록에 추가합니다
    st.session_state.messages.append(("human", prompt))

    # 채팅 메시지 컨테이너에 사용자 메시지를 표시합니다
    with st.chat_message("human"):
      st.markdown(prompt)

    # 채팅 메시지 컨테이너에 어시스턴트 응답을 표시합니다
    with st.chat_message("ai"):
      # 최신 질문을 마지막 메시지로 포함한 전체 채팅 기록을 가져옵니다
      history = "\n".join(
        [f"{role}: {msg}" for role, msg in st.session_state.messages]
      )

      query = f"{history}\nAI:"

      # 흐름에 적용할 수정 사항을 설정합니다
      inputs = {"input": query}

      output = run_flow(inputs, flow_id=FLOW_ID, tweaks=TWEAKS)
      print(output)
      try:
        output = output['result']['output']
      except Exception :
        output = f"애플리케이션 오류 : {output}"

      placeholder = st.empty()
      response = ""

      for tokens in output:
        response += tokens
        # "▌"으로 스트리밍을 표시하여 응답을 작성합니다
        with placeholder:
          st.markdown(response + "▌")

      # "▌" 없이 완료된 메시지를 표시합니다
      with placeholder:
        st.markdown(response)

    # AI 응답을 채팅 기록에 기록합니다
    st.session_state.messages.append(("ai", response))
    # 채팅 입력 해제
    st.session_state.disabled = False

    st.rerun()
```

4. 인터페이스 만들기: 이제 동일한 Python 파일에서 다음 코드를 사용하여 간단한 Streamlit 사용자 인터페이스를 만들어보겠습니다.

```js
st.set_page_config(page_title="Dinnerly")
st.title("Dinnerly에 오신 것을 환영합니다: 건강한 요리 플래너")

system_prompt = "사용자에게 건강한 요리 레시피를 제안하고 제공하는 유용한 도우미입니다"
if "messages" not in st.session_state:
    st.session_state.messages = [("system", system_prompt)]
if "disabled" not in st.session_state:
    # AI가 응답 중일 때 사용자가 메시지를 보내지 못하도록하는 'disabled' 플래그
    st.session_state.disabled = False


with st.chat_message("ai"):
  st.markdown(
    f"안녕하세요! 건강한 요리 플래너입니다. 건강하고 맛있는 요리를 준비하는 데 도움을 드리겠습니다!"
  )

# 앱 재실행 시 기록된 채팅 메시지 표시
for role, message in st.session_state.messages:
    if role == "system":
        continue
    with st.chat_message(role):
        st.markdown(message)

current_chat_message = st.container()
prompt = st.chat_input("질문을 여기에 입력하세요...", disabled=st.session_state.disabled)

if prompt:
    chat(prompt)
```

Streamlit 앱을 실행하면 자체 요리 플래너와 채팅할 수 있습니다! 맛있고 건강한 요리를 만드는 데 도움이 됩니다.


<div class="content-ad"></div>

마크다운 형식으로 표 태그를 변경하십시오.

Tips:

다른 플로우에 대해 동일한 코드와 인터페이스를 사용할 수 있습니다. FLOW_ID를 변경하여 새로운 플로우를 앱에 테스트 및 통합하세요.

<img src="/assets/img/2024-06-22-BuildingLocalRAGChatbotsWithoutCodingUsingLangFlowandOllama_8.png" />

<div class="content-ad"></div>

# 마무리 생각

이 글에서 우리는 스마트한 RAG 기반 챗봇을 만들었습니다. 우리는 코드를 작성할 필요 없이 LangFlow를 활용하여 RAG 파이프라인을 설정했고, 임베딩 및 LLM 처리를 위해 오픈 소스 모델을 활용하여 응용 프로그램을 로컬에서 실행하고 추론 비용 없이 유지했습니다. 마지막으로,이 설정을 Streamlit 애플리케이션으로 변환했습니다.

특히 LangFlow의 노코드 방식을 감사히 여기고, AI 응용 프로그램을 구축하고 프로토타입화하는 방식을 바꿀 수 있다고 믿습니다.

그러나 아직 개발 중인 구성 요소가 있으며 때로는 예상대로 작동하지 않을 수 있음을 언급할 가치가 있습니다. 이러한 순간이 발생할 때 문제에 대한 가시성이나 문제 해결에 대한 안내가 부족할 수 있습니다. 또 다른 개선 사항으로는 Python 코드를 직접 제공하여 더 많은 사용자 정의를 제공하는 것이 있을 수 있습니다.

<div class="content-ad"></div>

LangFlow은 빠른 프로토타이핑 필요에 유용한 도구라고 생각해요.

## 떠나시기 전에! 🦸🏻‍♀️

만약 제 이야기가 마음에 드셨고 저를 지원하고 싶으시다면:

- 약간의 Medium 사랑을 보내주세요 💕(박수, 댓글 및 하이라이트), 여러분의 지원은 저에게 큰 힘이 됩니다.👏
- Medium에서 저를 팔로우하고 최신 기사를 받아보세요🫶

<div class="content-ad"></div>

## 참고

- LangFlow 문서
- Ollama 문서
- Deliciously Healthy Dinners (데모에서 사용된 pdf 파일): [링크](https://healthyeating.nhlbi.nih.gov/pdfs/dinners_cookbook_508-compliant.pdf)