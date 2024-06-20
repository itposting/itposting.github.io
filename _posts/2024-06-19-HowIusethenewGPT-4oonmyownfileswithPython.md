---
title: "내가 Python을 사용하여 나만의 파일에서 새로운 GPT-4o를 어떻게 활용하는지"
description: ""
coverImage: "/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_0.png"
date: 2024-06-19 19:21
ogImage: 
  url: /assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_0.png
tag: Tech
originalTitle: "How I use the new GPT-4o on my own files with Python!"
link: "https://medium.com/@woyera/how-i-use-the-new-gpt-4o-on-my-own-files-9bb8de48fb06"
---



![2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_0.png](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_0.png)

현재 인공 지능 뉴스를 따라갔다면 OpenAI가 최근에 최신 모델인 GPT-4o를 발표했다는 것을 알고 계실 것입니다. 가장 인상적인 새로운 기능은 다중 모달리티인데, 아쉽게도 이러한 기능들은 아직 공개되지 않았습니다.

우리가 다중 모달 특징들이 롤아웃되길 기다리는 동안, 나는 여러분의 데이터에 GPT-4o를 사용하는 가장 쉬운 방법을 보여드리겠습니다, 어시스턴트!

OpenAI는 최근에 어시스턴트를 업데이트하여 데이터를 섭취하는 능력을 크게 향상시켰습니다. GPT-4o의 효율성과 어시스턴트가 이제 최대 10,000개의 파일을 섭취할 수 있는 데, 여러분만의 어시스턴트를 만들기에 더 좋은 시기가 온 적이 없습니다.


<div class="content-ad"></div>

이 글에서는 GPT-4o를 사용하여 어시스턴트를 만드는 가장 쉬운 방법을 안내하겠습니다.

만약 프로페셔널이 여러분과 비즈니스에 맞는 어시스턴트를 개인 맞춤형으로 만들어주길 원하신다면 www.woyera.com 으로 연락해주세요.

## 단계 1: 데이터 준비

시작하기 전에, 여러분의 웹사이트나 애플리케이션을 위해 어시스턴트를 사용하려면 OpenAI API 키가 필요하다는 사실을 알려드리고 싶습니다.

<div class="content-ad"></div>

먼저 OpenAI 플랫폼에 로그인하고 대시보드로 이동하세요. 그런 다음 아래에 표시된대로 “저장소”를 클릭하세요.

![이미지](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_1.png)

저장소 페이지에서 “벡터 저장소”를 선택한 다음 “만들기”를 클릭하세요. 벡터 저장소를 사용하면 의미론적 검색, 효율적인 검색, 더 나은 문맥 파악, 확장성 및 OpenAI API와의 원활한 통합이 가능해집니다.

![이미지](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_2.png)

<div class="content-ad"></div>

벡터 저장소를 만들었으면, Assistant가 액세스하길 원하는 파일을 추가하고 벡터 저장소 ID를 복사하십시오. 나중에 필요하게 됩니다.

![image](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_3.png)

## 단계 2: Assistant 만들기

왼쪽 탐색 모음을 사용하여 "Assistants" 플레이그라운드로 이동하고 "Assistant 만들기"를 선택하십시오.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_4.png" />

어시스턴트를 만들었으면 어시스턴트 ID 코드를 복사하여 나중에 사용할 수 있도록 해주세요.

<img src="/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_5.png" />

어시스턴트에 정확한 지시를 제공하고 "모델"을 사용하여 원하는 모델을 선택하십시오. 여기서는 "gpt-4o"를 선택하면 됩니다.

<div class="content-ad"></div>

마크다운 형식으로 표 태그를 변경하십시오.

![How to Use GPT-4 with Python - File Search](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_6.png)

저희 어시스턴트가 사용할 "파일 검색" 도구를 선택해 주세요.

![How to Use GPT-4 with Python - Click Files](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_7.png)

아래에 보이는 대로 "파일"을 클릭해주세요.

<div class="content-ad"></div>

![`/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_8.png`](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_8.png)

Click on "Select vector store"

![`/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_9.png`](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_9.png)

Finally, you will use the vector store id that we copied earlier and paste it into the field, click select after you have chosen the vector store you want.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_10.png)

벡터 저장소에 애니메이션을 연결한 후에는 옵션 된 파일의 내용에 관한 질문으로 에이전트를 테스트해 보세요.

내 어시스턴트의 경우, Colleen Hoover의 소설 'Verity'가 있는 벡터 저장소에 연결하도록 만들었습니다. 여러분의 파트너가 요청한대로 그리고 답변을 참조하면서 이 답변을 생성하는 모습을 확인할 수 있어요!

![이미지](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_11.png)


<div class="content-ad"></div>

이정도면 몇몇 사람들에게 충분할지도 모르지만, 파이썬을 사용하여 애플리케이션에 어시스턴트를 통합하는 방법을 자세히 보여드릴 수도 있습니다!

## 단계 3: API 확인

앱에 통합하기 전에 API 호출이 제대로 작동하는지 먼저 확인할 수 있습니다. 이를 위해 간단한 코드를 사용하여 확인할 수 있습니다. 전체 스크립트를 보고 싶다면 아래로 스크롤하세요.

먼저, 이러한 인포트(imports)를 사용해야 합니다. 윈도우 환경이라면 "pip install openai"를 사용하고, 맥 환경이라면 "pip3 install openai"를 사용하는 것을 기억해 주세요.

<div class="content-ad"></div>

```python
예를 들어, 다음과 같이 코드를 작성할 수 있습니다.

import time
from openai import OpenAI

먼저 API 키를 사용하여 클라이언트를 만듭니다.

client = OpenAI(api_key='여기에 키를 입력하세요')

그런 다음 대화를 저장할 "스레드"를 만듭니다.
```

<div class="content-ad"></div>

```js
empty_thread = client.beta.threads.create()
print(empty_thread)
```

그런 다음 메시지를 추가할 스레드 ID를 가져옵니다.

```js
thread_id= empty_thread.id
```

메시지 생성 및 스레드에 추가하기

<div class="content-ad"></div>

```js
thread_message = client.beta.threads.messages.create(
  thread_id=thread_id,
  role="user",
  content="여기에 메시지를 입력하세요",
)
print(thread_message)
```

이 코드 부분은 "실행" 상태를 추적하는 데 사용됩니다. 처음 실행했을 때 응답이로드되는 데 시간이 오래 걸렸고 작동 중인지 느리게 진행 중인지 확신할 수 없었습니다. 이것은 실행이 완료되지 않은 동안 실행 상태를 출력합니다.

```js
while run.status != "completed":
    run = client.beta.threads.runs.retrieve(thread_id=empty_thread.id, run_id=run.id)
    print(f"실행 상태: {run.status}")
    time.sleep(0.5)
else:
    print("실행 완료!")
```

쓰레드로부터의 응답 및 실행에서의 메시지를 얻으려면 다음을 사용합니다.


<div class="content-ad"></div>


message_response = client.beta.threads.messages.list(thread_id=empty_thread.id) 
messages = message_response.data

latest_message = messages[0]
print(f" response: {latest_message.content[0].text.value}")


Put all the code together, and ask the OpenAI Assistant Interface the same question as earlier. It should give the same answer, and it did!

![Image](/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_12.png)

This is the complete script!


<div class="content-ad"></div>

```python
import time
from openai import OpenAI

client = OpenAI(api_key='YOUR KEY HERE')

# Create Thread
empty_thread = client.beta.threads.create()
print(empty_thread)

# Get thread id
thread_id = empty_thread.id

# Create message to add to Thread
thread_message = client.beta.threads.messages.create(
  thread_id=thread_id,
  role="user",
  content="USER QUESTION HERE",
)
print(thread_message)

# Create a Run
run = client.beta.threads.runs.create(
  thread_id=thread_id,
  assistant_id='YOUR ASSISTANT ID HERE'
)

run_id = run.id

while run.status != "completed":
    run = client.beta.threads.runs.retrieve(thread_id=empty_thread.id, run_id=run.id)
    print(f"Run status: {run.status}")
    time.sleep(0.5)
else:
    print("Run Complete!")

message_response = client.beta.threads.messages.list(thread_id=empty_thread.id)
messages = message_response.data

latest_message = messages[0]
print(f"Response: {latest_message.content[0].text.value}")
```

### Step 4: 통합

도우미 API를 응용 프로그램에 통합하려면 수많은 다양한 방법을 사용할 수 있습니다. 이것은 API에 인터페이스를 제공하는 가장 쉬운 방법 중 하나였습니다.

Streamlit은 우리에게 도우미를 표시할 수 있는 쉬운 프론트엔드를 제공합니다. 사이트를 Streamlit을 통해 호스팅하는 것을 선택한다면 다음 코드를 사용해보세요.


<div class="content-ad"></div>

```python
import streamlit as st
from openai import OpenAI
import time

# 클라이언트 생성
client = OpenAI(api_key='API 키를 여기에 입력하세요')

st.title(':book: Book Bot')

# 채팅 기록 초기화 (세션 상태 사용)
if "messages" not in st.session_state:
    st.session_state.messages = []

# 채팅 기록 표시
for message in st.session_state.messages:
    with st.container():
        st.markdown(f"**{message['role']}:** {message['content']}")

# 입력 텍스트 상자
user_input = st.text_input("You:", "")

if st.button("Send") and user_input:
    # 사용자 메시지를 채팅 기록에 추가
    st.session_state.messages.append({"role": "user", "content": user_input})
    
    # 사용자 메시지를 즉시 표시
    with st.container():
        st.markdown(f"**You:** {user_input}")

    # 쓰레드 및 메시지 생성
    thread = client.beta.threads.create()
    thread_message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=user_input,
    )
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id='어시스턴트 ID를 여기에 입력하세요'  # 귀하의 어시스턴트 ID로 대체
    )
    
    # 실행이 완료될 때까지 기다림
    with st.spinner("Thinking..."):
        while run.status != "completed":
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            time.sleep(0.5)

    # 응답 검색 및 표시
    messages = client.beta.threads.messages.list(thread_id=thread.id).data
    latest_message = messages[0]
    response_text = latest_message.content[0].text.value

    # 어시스턴트 메시지를 채팅 기록에 추가
    st.session_state.messages.append({"role": "assistant", "content": response_text})
    
    # 전송 후 입력 텍스트 상자 지우기
    user_input = ""

    # 어시스턴트 메시지를 즉시 표시
    with st.container():
        st.markdown(f"**Assistant:** {response_text}")
```

이렇게 고쳐지는 페이지 모습입니다!

<img src="/assets/img/2024-06-19-HowIusethenewGPT-4oonmyownfileswithPython_13.png" />

AI 모델 선택 및 비즈니스 통합 전체 프로세스를 다른 사람에게 맡기고 싶다면, www.woyera.com에서 연락하세요.
