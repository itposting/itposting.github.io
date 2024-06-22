---
title: "LangChain의 새로운 도구, LangGraph 쉽게 설명하기"
description: ""
coverImage: "/assets/img/2024-06-22-LangGraphFromLangChainExplainedInSimpleTerms_0.png"
date: 2024-06-22 20:43
ogImage: 
  url: /assets/img/2024-06-22-LangGraphFromLangChainExplainedInSimpleTerms_0.png
tag: Tech
originalTitle: "LangGraph From LangChain Explained In Simple Terms"
link: "https://medium.com/@cobusgreyling/langgraph-from-langchain-explained-in-simple-terms-f7cd0c12cdbf"
---


# 소개

하지만 왜 우리는 상태와 상태 전이 제어로 다시 돌아가고 있을까요? 자율 인공 지능 에이전트와 함께 우리는 상태 제어와 전이 개념을 넘어서 왔다고 생각했는데요?

자율 에이전트의 출력을 살펴보면, 에이전트가 지속적으로 생성하는 작업 순서를 주목할 것입니다.

LangGraph의 목표는 자율 인공 지능 에이전트를 실행할 때 일정한 수준의 제어를 갖는 것입니다.

<div class="content-ad"></div>

죄송합니다. 이 기사가 길었지만, Graph의 기본 원칙이 무엇인지 정말로 파악하고 싶었습니다.

# 현황

아래 이미지를 고려해보면, 이것이 대부분의 사람들이 대화형 UI를 위한 대화와 프로세스 흐름을 생성하는 사용자 인터페이스의 디자인 및 개발을 알게 된 방식입니다.

디자인 기능은 노드 및 엣지라는 두 가지 주요 범주로 나뉠 수 있습니다.

<div class="content-ad"></div>

노드는 블록으로, 때로는 자산으로도 불립니다. 아래 그림에서 디자인 캔버스에는 다섯 개의 노드가 있습니다. 이 노드 간에는 링크 또는 엣지라고도 하는 연결이 있습니다. 엣지는 가능한 대상 노드나 노드를 보여줍니다.

## 프롬프트 체이닝

대형 언어 모델의 출현과 함께 프롬프트 체이닝이 등장했습니다...

프롬프트 체이닝은 언어 모델과 작업할 때 사용되는 기술로, 여러 프롬프트(노드)가 서로 순차적으로 연결(엣지를 통해)되어 서로 관련된 작업이나 단계를 안내하는 것으로 설명될 수 있습니다.

<div class="content-ad"></div>

이 방법은 큰 작업을 작은 관리 가능한 부분으로 나눠 더 복잡하고 세밀한 결과물을 얻는 데 사용됩니다.

다음은 프롬프트 체이닝 작동 방식에 대해 간단히 설명한 것입니다:

- 작업 분해(노드): 복잡한 작업이 작은 순차적인 단계로 나누어집니다. 각 단계는 전체 목표의 특정 부분을 달성하는 데 사용됩니다.
- 각 단계에 대한 프롬프트 생성(엣지): 각 단계에 대해 필수 출력물 생성을 위해 구체적인 프롬프트가 만들어집니다. 이러한 프롬프트는 해당 부분 작업에 집중되고 명확하게 설계됩니다.
- 순차 실행: 언어 모델은 첫 번째 프롬프트를 처리하고 출력물을 생성합니다. 이 출력물은 다음 시퀀스의 다음 프롬프트의 일부로 사용됩니다.

그러나 알아둬야 할 점은, 프롬프트 체이닝은 챗봇 흐름 구축과 동일한 원칙에 기반합니다. 따라서 이전과 같은 문제, 즉 엄격한 상태 머신이 존재합니다.

<div class="content-ad"></div>

참으로, 프롬프트 체이닝에는 각 노드의 입력에 몇 가지 유연성을 도입하는 요소가 있어서 출력에는 동적 변화가 발생합니다. 그러나 전반적으로 시퀀스는 고정되고 엄격하게 유지됩니다.

## 도전 과제

이 방법론은 흐름을 세심하게 지정해야 하며 각 결정 지점을 정의해야 합니다. 이러한 이유로 본질적으로 상태 기계이며 대화 트리는 서로 다른 상태(노드)와 대화가 이동해야 하는 결정 지점(엣지)에 의해 정의됩니다.

엣지는 대화 상태/대화 턴이 이동할 수 있는 옵션으로 볼 수도 있습니다.

<div class="content-ad"></div>

그래서 이 방법론의 한계로 인해 너무 엄격하다는 도전 과제에 닥치게 되었습니다. 대체로 변화를 원하는 욕구가 있으며, 융통성을 도입하고 싶어하는 분위기입니다.

# 에이전트 입력

자율 주체들은 최근에 소개되었으며, 에이전트의 자율성 수준은 놀라울 정도였습니다. 에이전트는 실시간으로 사건의 연쇄 또는 순서를 생성하고 이 일시적인 연쇄를 따라 최종적인 답변이 도출될 때까지 따릅니다.

이것을 일회용 연쇄로 생각할 수 있습니다.

<div class="content-ad"></div>

아래 예시를 고려해보면, 에이전트에게 매우 모호한 질문을 할 수 있습니다. 예를 들어 "아이폰의 아버지로 평가받는 사람은 누구이며, 그의 출생 연도의 제곱근은 무엇입니까?"

또는 

"일반적으로 아이폰의 아버지로 평가받는 사람의 출생 연도의 제곱근은 무엇입니까?" 

그리고 아래와 같이, 에이전트는 실시간으로 체인을 생성하여 질문을 반영하고 행동, 관찰, 사고, 행동, 관찰, 사고의 프로세스를 거쳐 최종 답변에 도달합니다.

<div class="content-ad"></div>

```js
> 새 AgentExecutor 체인에 들어갔어요...
아이폰의 아버지로 알려진 사람과 태어난 해를 알아내야 해요. 그리고 그의 출생 연도의 제곱근을 계산할 거예요.
행동: 검색
행동 입력: 아이폰 아버지 출생 연도
관찰: 가족. 스티븐 폴 잡스는 조앤 캐롤 스키블과 아브둘파타 "존" 잔달리(아랍어: عبد الف ...)가 산프란시스코, 캘리포니아에서 1955년 2월 24일에 태어났어요.
생각: 스티브 잡스가 아이폰의 아버지로 알려지고 1955년에 태어났다는 걸 알았어요. 이제 그의 출생 연도의 제곱근을 계산할 거예요.
행동: 계산기
행동 입력: sqrt(1955)
관찰: 답변: 44.21538193886829
생각: 이제 마지막 답을 알게 되었어요.
최종 답변: 스티브 잡스가 아이폰의 아버지로 알려지고, 그의 태어난 연도(1955년)의 제곱근은 약 44.22입니다.

> 체인을 마쳤어요.
'스티브 잡스가 아이폰의 아버지로 알려지고, 그의 태어난 연도(1955년)의 제곱근은 약 44.22입니다.
```

## 도전과제

에이전트와 저에게 가장 많이 들은 상수적 비판점은 에이전트들의 높은 자율성입니다.

생산자들은 에이전트에 어느 정도의 통제권을 가지고 싶어해요.

<div class="content-ad"></div>

헤이, 에이전트의 등장으로 우리는 지나치게 제어되고 엄격한 상황에서 더 큰 유연성으로 이동했지만 제어 부재로 인한 문제가 있습니다.

# LangChain에서 LangGraph로 전환해보세요

## 하지만 먼저, 데이터 유형으로서의 그래프란 무엇인가요?

## 그래프(추상 데이터 유형)은 무엇인가요?

<div class="content-ad"></div>

그래프 데이터의 개념은 처음에는 어렵게 느껴질 수 있지만, 여기서 그것을 쉽게 설명해보겠습니다.

실제로 그래프는 추상 데이터 유형이에요...

추상 데이터 유형은 데이터 유형에 대한 수학적 모델로, 데이터를 사용하는 사람의 관점에서 정의된 동작 (의미론)에 의해 정의됩니다.

추상 데이터 유형은 데이터 구조와 대조적입니다. 데이터 구조는 데이터의 구체적 표현이며, 구현자의 관점이 아닌 사용자의 관점에서 정의됩니다. 이 데이터 구조는 덜 해석하기 어려우며 해석하기 쉬워요.

<div class="content-ad"></div>

## 방향 그래프

방향 그래프(또는 유향 그래프)는 방향성이 있는 엣지로 연결된 노드 집합으로 이루어진 그래프입니다.

그래프 데이터 구조는 유향 그래프의 경우 노드의 유한 집합과 무방향 그래프의 경우 이러한 노드들의 순서가 없는 쌍의 집합으로 구성됩니다.

아래의 그래프 표현을 고려할 때, 노드와 함께 엣지 및 엣지 옵션이 표시됩니다.

<div class="content-ad"></div>

## LangGraph

다시 한번 아래 이미지를 보시면, 왼쪽에는 LangGraph Python 코드 조각이 표시되어 있고, 오른쪽에는 해당 그래프가 그려져 있습니다. 코드에서 노드가 정의된 부분을 보면, builder.add_node에 ReturnNodeValue가 사용되어 있습니다. 각 엣지가 정의된 노드에 대해 builder.add_edge가 호출됩니다.

또한 a를 시작점으로, d를 완료점으로 설정해 두었음을 확인할 수 있습니다.

LangGraph는 에이전트 런타임에서 자주 필요한 순환 그래프를 생성하기 위해 LangChain 위에 구축된 모듈입니다.

<div class="content-ad"></div>

LangChain의 큰 가치 제안 중 하나는 사용자 정의 체인을 쉽게 만들 수 있는 능력, 즉 flow engineering입니다. LangGraph를 LangChain 에이전트와 결합하여, 에이전트는 지향적이며 순환이 될 수 있습니다.

Directed Acyclic Graph (DAG)는 컴퓨터 과학과 수학에서 사용되는 그래프 유형입니다. 간단히 설명하면 다음과 같습니다:

Directed: 노드(또는 정점) 사이의 각 연결(또는 에지)에는 일방향의 방향이 있습니다. 한 노드에서 다른 노드로 갈 수 있는 방향을 보여줍니다.

Acyclic: 어떤 사이클도 없습니다. 즉, 한 노드에서 시작하여 방향을 따라가면 결코 같은 노드로 되돌아갈 수 없습니다. 루프에 갇히는 방법이 없습니다.

<div class="content-ad"></div>

가족 트리나 플로우차트와 같이 앞으로만 움직이고 시작점으로 돌아갈 수 없는 구조로 생각해보세요.

더 복잡한 LLM 응용 프로그램을 개발할 때 관찰되는 일반적인 패턴은 런타임에 순환이 도입되는 것입니다. 이러한 순환이 자주 발생하며 프로세스의 다음 단계를 결정하는 데 LLM을 사용합니다.

LLM의 중요한 장점 중 하나는 이러한 추론 작업을 수행할 수 있는 능력이며, 사실상 for 루프에서 LLM과 같이 작동하는 것처럼 기능합니다. 이러한 접근 방식을 사용하는 시스템들은 종종 에이전트로 언급됩니다.

# 에이전트 및 제어

<div class="content-ad"></div>

하지만 루핑 에이전트는 종종 다양한 단계에서 세부적인 제어가 필요합니다.

제작자들은 에이전트가 항상 특정 도구를 먼저 호출하도록 보장하거나 도구를 활용하는 방법에 대해 더 많은 제어를 필요로 할 수 있습니다.

게다가, 현재 상태에 따라 에이전트에 대해 다른 프롬프트를 사용하길 원할 수도 있습니다.

# 좁은 인터페이스 노출

<div class="content-ad"></div>

LangGraph은 LangChain을 기반으로 한 간소화된 인터페이스를 제공합니다.

# LangGraph을 선택하는 이유

LangGraph는 프레임워크에 구애받지 않으며, 각 노드는 일반 Python 함수로 작동합니다.

스트리밍, 비동기, 일괄 호출에 대한 공통 인터페이스인 Runnable API를 확장하여 다음과 같은 기능을 지원합니다:

<div class="content-ad"></div>

- 여러 대화 턴이나 도구 사용 사이에서 매끄러운 상태 관리
- 동적 기준에 따라 노드 간 유연한 라우팅
- LLM과 인간 개입 간 부드러운 전환
- 장기간 또는 다중 세션 애플리케이션을 위한 지속성

# LangGraph 챗봇

아래는 Anthropik 모델을 기반으로 한 작동 중인 LangChain 챗봇입니다. 기본 코드는 그들의 요리책에 있는 LangChain 예제 코드를 복사했습니다.

```js
%%capture --no-stderr
%pip install -U langgraph langsmith

# 이 튜토리얼에서 사용합니다; LangGraph에 필요한 것은 아닙니다
%pip install -U langchain_anthropic


#################################
import getpass
import os


def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")


_set_env("ANTHROPIC_API_KEY")
#################################
from typing import Annotated

from typing_extensions import TypedDict

from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages


class State(TypedDict):
    # 메시지는 "list" 유형입니다. 주석의 `add_messages` 함수
    #은이 상태 키가 어떻게 업데이트되어야하는지 정의합니다.
    #(이 경우, 목록에 메시지를 추가하여 덮어쓰지 않는 것)
    messages: Annotated[list, add_messages]


graph_builder = StateGraph(State)
#################################
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-haiku-20240307")


def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}


# 첫 번째 인수는 고유한 노드 이름입니다.
# 두 번째 인수는 노드가 사용될 때 호출되는 함수 또는 객체입니다.
graph_builder.add_node("chatbot", chatbot)
#################################
graph_builder.set_entry_point("chatbot")

#################################
graph_builder.set_finish_point("chatbot")
#################################
graph = graph_builder.compile()
#################################
from IPython.display import Image, display

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    # 추가적인 종속성이 필요하며 선택 사항입니다
    pass
#################################
while True:
    user_input = input("사용자: ")
    if user_input.lower() in ["quit", "exit", "q"]:
        print("안녕히가세요!")
        break
    for event in graph.stream({"messages": ("user", user_input)}):
        for value in event.values():
            print("보조:", value["messages"][-1].content)
#################################
```

<div class="content-ad"></div>

아래는 그래픽이 데이터의 흐름을 보여주는 방법을 보여줍니다.

---
마지막으로

그래프 데이터 유형은 데이터의 시각적 표현을 보여주는 강력한 도구입니다. 시각적 표현 이상으로, 서로 다른 노드 간의 표현은 데이터 노드의 공간적 표현을 만드는 데 이상적입니다.

데이터 사용자의 관점에서 그래프 데이터 유형은 데이터의 의미론적 행동에 이상적입니다.

<div class="content-ad"></div>

⭐️ 저를 팔로우해서 대형 언어 모델에 관한 업데이트를 받아보세요 ⭐️

![이미지](/assets/img/2024-06-22-LangGraphFromLangChainExplainedInSimpleTerms_0.png)

저는 현재 Kore AI의 Chief Evangelist입니다. AI와 언어가 교차하는 모든 것을 탐구하고 쓰고 있습니다. 대형 언어 모델, 챗봇, 음성봇, 개발 프레임워크, 데이터 중심의 잠재 공간 등 다양한 주제에 대해 다룹니다.

![이미지](/assets/img/2024-06-22-LangGraphFromLangChainExplainedInSimpleTerms_1.png)

<div class="content-ad"></div>


![Image 2](/assets/img/2024-06-22-LangGraphFromLangChainExplainedInSimpleTerms_2.png)

![Image 3](/assets/img/2024-06-22-LangGraphFromLangChainExplainedInSimpleTerms_3.png)
