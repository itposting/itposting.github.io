---
title: "OpenAI Assistant API와 Streamlit을 사용하여 도우미 만들기"
description: ""
coverImage: "/assets/img/2024-06-19-CreatinganAssistantwithOpenAIAssistantAPIandStreamlit_0.png"
date: 2024-06-19 19:58
ogImage: 
  url: /assets/img/2024-06-19-CreatinganAssistantwithOpenAIAssistantAPIandStreamlit_0.png
tag: Tech
originalTitle: "Creating an Assistant with OpenAI Assistant API and Streamlit"
link: "https://medium.com/towards-data-science/creating-an-assistant-with-openai-assistant-api-and-streamlit-282d9be9f03e"
---


## 단계별 가이드

![이미지](https://miro.medium.com/v2/resize:fit:1200/1*bX5eqE7EUmnwxWuqjZDzIQ.gif)

# OpenAI Assistant API

최근 OpenAI가 새로운 기능을 소개했습니다. 이들은 Assistant API와 같이 에이전트와 같은 아키텍처를 보여줍니다. OpenAI에 따르면:

<div class="content-ad"></div>

이러한 발전은 희망적이지만, 아직 LangChain을 따라가지 못합니다. LangChain은 자연어 입력을 처리하고 문맥 기반 액션을 실행하는 더 유연한 LLM을 활용하여 에이전트 형태의 시스템을 만들 수 있습니다.

하지만, 이것은 시작에 불과합니다.

높은 수준에서 Assistant API와 상호 작용하는 것은 루프로 상상할 수 있습니다:

- 사용자 입력을 받으면 LLM이 호출되어 응답을 제공할지 또는 특정 조치를 취할지를 결정합니다.
- LLM의 결정이 쿼리에 대한 답변으로 충분하다면 루프가 종료됩니다.
- 만약 행동이 새로운 관찰로 이어진다면, 이 관찰은 프롬프트에 포함되고 LLM이 다시 호출됩니다.
- 그런 다음 루프가 다시 시작됩니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-CreatinganAssistantwithOpenAIAssistantAPIandStreamlit_0.png)

안타깝게도 발표된 장점에도 불구하고, API에 대한 문서는 특히 사용자 정의 함수 호출 및 Streamlit와 같은 프레임워크를 사용한 앱 구축과 관련하여 제대로 작성되지 않았다고 생각했습니다.

이 블로그 포스트에서는 OpenAI Assistant API 및 사용자 정의 함수 호출을 사용하여 Streamlit 인터페이스와 함께 AI 어시스턴트를 구축하는 방법을 안내해드리겠습니다. 이를 통해 Assistant API를 효과적으로 사용하고자 하는 분들께 도움이 될 것입니다.

# 사용 사례: 세금 계산 어시스턴트


<div class="content-ad"></div>

이 블로그 포스트에서는 간단한 예제를 보여드리겠습니다: 주어진 수익에 기반한 세금을 계산할 수 있는 AI 어시스턴트입니다. Langchain 사용자들은 "세금 계산" 도구를 가진 에이전트를 생성함으로써 이를 쉽게 이해할 수 있습니다.

이 도구에는 필요한 계산 단계와 LLM이 수익 또는 세금과 관련된 질문이 있을 때 도구를 호출해야 하는지를 알려주는 잘 설계된 프롬프트가 포함될 것입니다.

그러나 이 프로세스는 OpenAI 어시스턴트 API와 정확히 동일하지는 않습니다. OpenAI의 문서에 따르면 코드 해석기와 파일 검색 도구는 직접적으로 간단한 방식으로 사용할 수 있지만, 사용자 정의 도구는 약간 다른 방식으로 접근해야 합니다.

```js
assistant = client.beta.assistants.create(
  name="데이터 시각화자",
  description="당신은 아름다운 데이터 시각화를 만드는 데 뛰어나십니다. .csv 파일에 있는 데이터를 분석하며 트렌드를 이해하고 해당 트렌드에 관련된 데이터 시각화를 제시합니다. 또한 관찰된 트렌드에 대한 간단한 텍스트 요약을 공유합니다.",
  model="gpt-4o",
  tools=[{"type": "code_interpreter"}],
)
```

<div class="content-ad"></div>

한 단계씩 세부 내용을 살펴보겠습니다. 다음을 목표로 합니다:

- 주어진 수익에 기반한 세금을 계산하는 함수 정의하기.
- 이 함수를 사용하는 도구 개발하기.
- 이 도구에 액세스하고 세금 계산이 필요할 때 호출할 수 있는 어시스턴트 만들기.

# 어시스턴트 통합을 위한 세금 계산 함수

다음 단락에서 설명하는 세금 계산 도구는 이 글에서 논의된 API를 사용하는 방법을 보여주기 위한 예시로 설계되었음을 유념해 주세요. 실제 세금 계산에 사용해서는 안 됩니다.

<div class="content-ad"></div>

다음과 같이 조각별 함수를 고려해 보세요. 이 함수는 주어진 매출에 대한 세금 값을 반환합니다. 입력이 간단한 구문 분석을 위해 문자열로 설정되어 있음을 유의하세요:

```js
def calculate_tax(revenue: str):
    try:
        revenue = float(revenue)
    except ValueError:
        raise ValueError("매출은 숫자의 문자열 표현이어야 합니다.")

    if revenue <= 10000:
        tax = 0
    elif revenue <= 30000:
        tax = 0.10 * (revenue - 10000)
    elif revenue <= 70000:
        tax = 2000 + 0.20 * (revenue - 30000)
    elif revenue <= 150000:
        tax = 10000 + 0.30 * (revenue - 70000)
    else:
        tax = 34000 + 0.40 * (revenue - 150000)

    return tax
```

다음으로, 비서(assistant)를 정의합니다:

```js
function_tools = [
    {
        "type": "function",
        "function": {
            "name": "calculate_tax",
            "description": "유로로 주어진 매출에 대한 세금을 가져옵니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "revenue": {
                        "type": "string",
                        "description": "유로로 연간 매출"
                    }
                },
                "required": ["revenue"]
            }
        }
    }
]

# 비서(assistant) 정의
assistant = client.beta.assistants.create(
    name="Assistant",
    instructions="",
    tools=function_tools,
    model="gpt-4o",
)
```

<div class="content-ad"></div>

이제, 주요한 포인트에 대해서 얘기해볼게요:

어시스턴트가 "calculate_tax"가 호출될 때 어떻게 함수를 사용하는지 알고 계신가요? 이 부분은 OpenAI 어시스턴트에서 문서화가 잘 되어 있지 않아, 많은 사용자들이 처음 사용할 때 혼동을 겪을 수 있어요. 이를 해결하기 위해, 응담 스트림(response stream)에서 다양한 이벤트를 관리하기 위한 EventHandler를 정의해야 합니다. 특히 "calculate_tax" 도구가 호출될 때의 이벤트를 어떻게 처리하는지에 대해 명확히 알아둬야 해요.

```js
    def handle_requires_action(self, data, run_id):
        tool_outputs = []

        for tool in data.required_action.submit_tool_outputs.tool_calls:
            if tool.function.name == "calculate_tax":
                try:
                    # 도구 매개변수에서 수익 추출
                    revenue = ast.literal_eval(tool.function.arguments)["revenue"]
                    # 세금을 계산하는 calculate_tax 함수 호출
                    tax_result = calculate_tax(revenue)
                    # 필요한 형식에 맞게 도구 출력을 추가
                    tool_outputs.append({"tool_call_id": tool.id, "output": f"{tax_result}"})
                except ValueError as e:
                    # 세금 계산 시 발생하는 모든 오류 처리
                    tool_outputs.append({"tool_call_id": tool.id, "error": str(e)})
        # 모든 도구 출력을 동시에 제출
        self.submit_tool_outputs(tool_outputs)
```

위 코드는 다음과 같이 동작해요: 동작이 필요한 각 도구 호출에 대해:

<div class="content-ad"></div>

- "calculate_tax" 함수 이름을 확인합니다.
- 툴 매개변수에서 수익 값을 추출합니다.
- 수익을 이용하여 calculate_tax 함수를 호출하여 세금을 계산합니다. (여기서 실제 상호작용이 이루어집니다.)
- 모든 툴 호출을 처리한 후, 수집된 결과를 제출합니다.

# 보조 인공지능과 대화하기

다음은 OpenAI가 문서화한 표준 단계를 따라 보조 인공지능과 상호작용할 수 있습니다. 따라서 이 섹션에서는 많은 세부 정보를 제공하지 않겠습니다:

- 스레드 생성: 이는 사용자와 보조 인공지능 간의 대화를 나타냅니다.
- 사용자 메시지 추가: 이는 스레드에 추가되는 텍스트 및 파일을 포함할 수 있습니다.
- 실행 생성: 보조 인공지능과 연관된 모델 및 도구를 활용하여 응답 생성합니다. 이 응답은 다시 스레드에 추가됩니다.

<div class="content-ad"></div>

아래 코드 조각은 특정 사용 사례에서 어시스턴트를 실행하는 방법을 보여줍니다: 코드는 스레드 ID 및 어시스턴트 ID를 사용하는 특정 매개변수를 설정하여 어시스턴트와의 스트리밍 상호작용을 설정합니다. EventHandler 인스턴스는 스트림 중 이벤트를 관리합니다. stream.until_done() 메서드는 모든 상호작용이 완료될 때까지 스트림을 유지합니다. with 문은 스트림이 적절히 닫히도록 보장합니다.

```js
  with client.beta.threads.runs.stream(thread_id=st.session_state.thread_id,
                                         assistant_id=assistant.id,
                                         event_handler=EventHandler(),
                                         temperature=0) as stream:
        stream.until_done()
```

# Streamlit 인터페이스

여기서 내 게시물을 마칠 수 있지만, Streamlit 포럼(예: 이 포스트)에서 사용자들이 터미널에서는 정상 작동하지만 인터페이스에서 스트리밍이 작동하지 않는다는 수많은 문의를 발견했습니다. 이것이 나로 하여금 더 깊이 파고들도록 유도했습니다.

<div class="content-ad"></div>

스트리밍을 앱에 성공적으로 통합하려면, 앞서 언급한 EventHandler 클래스의 기능을 확장해야 합니다. 특히 텍스트 생성, 텍스트 델타 처리 및 텍스트 완료를 중점적으로 다루어야 합니다. 채팅 히스토리를 관리하면서 Streamlit 인터페이스에 텍스트를 표시하기 위해 필요한 세 가지 주요 단계는 다음과 같습니다:

- 텍스트 생성 처리 (on_text_created): 어시스턴트의 각 응답마다 새로운 텍스트 상자를 초기화하고 표시하여 이전 작업의 상태를 반영하도록 UI를 업데이트합니다.
- 텍스트 델타 처리 (on_text_delta): 어시스턴트가 텍스트를 생성할 때 현재 텍스트 상자를 동적으로 업데이트하여 전체 UI를 새로 고치지 않고도 점진적으로 변경할 수 있도록 합니다.
- 텍스트 완료 처리 (on_text_done): 새로운 빈 텍스트 상자를 추가하여 각 상호작용 세그먼트를 완료하고, 다음 상호작용을 준비합니다. 또한, 대화 세그먼트를 chat_history에 기록합니다.

예를 들어, 텍스트 델타를 관리하는 다음 코드 조각을 살펴봅시다:

```python
def on_text_delta(self, delta: TextDelta, snapshot: Text):
    """
    텍스트 델타가 생성될 때의 핸들러
    """
    # 최신 텍스트 상자를 지웁니다.
    st.session_state.text_boxes[-1].empty()
    
    # 새로운 텍스트가 있으면, 어시스턴트 텍스트 목록의 마지막 요소에 추가합니다.
    if delta.value:
        st.session_state.assistant_text[-1] += delta.value
    
    # 업데이트된 어시스턴트 텍스트를 최신 텍스트 상자에 다시 표시합니다.
    st.session_state.text_boxes[-1].info("".join(st.session_state["assistant_text"][-1]))
```

<div class="content-ad"></div>

이 코드는 세 가지 주요 작업을 수행합니다:

- 최신 텍스트 상자 지우기: 최신 텍스트 상자의 내용을 지워 새 입력을 준비합니다 (st.session_state.text_boxes[-1]).
- 델타 값을 도우미 텍스트에 추가: 새 텍스트 (delta.value)가 있는 경우, 이를 st.session_state.assistant_text[-1]에 저장된 지속적인 도우미 텍스트에 추가합니다.
- 업데이트된 도우미 텍스트 다시 표시: 지금까지 축적된 모든 도우미 텍스트의 내용을 반영하기 위해 최신 텍스트 상자의 내용을 업데이트합니다 (st.session_state["assistant_text"][-1]).

# 결론

이 블로그 포스트에서는 OpenAI Assistant API와 Streamlit을 사용하여 세금을 계산할 수 있는 AI 도우미를 만드는 방법을 보여주었습니다.

<div class="content-ad"></div>

저는 Assistant API의 능력을 강조하기 위해 이 간단한 프로젝트를 수행했어요. 문서가 다소 불명확하더라도, 목표는 모호한 부분을 명확하게 하고 Assistant API를 사용하고자 하는 분들에게 일부 지침을 제공하는 것이었습니다. 이 게시물이 도움이 되었으면 좋겠고, 이 강력한 도구로 더 많은 가능성을 탐험하도록 격려하길 바랍니다.

공간 제약으로 인해 불필요한 코드 조각을 포함하지 않으려고 노력했어요. 그러나 필요한 경우, 제 Github 저장소를 방문하여 전체 구현 내용을 확인해주세요.