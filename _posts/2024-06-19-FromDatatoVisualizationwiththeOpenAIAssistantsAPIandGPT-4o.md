---
title: "데이터에서 시각화까지 OpenAI Assistants API 및 GPT-4o와 함께"
description: ""
coverImage: "/assets/img/2024-06-19-FromDatatoVisualizationwiththeOpenAIAssistantsAPIandGPT-4o_0.png"
date: 2024-06-19 01:28
ogImage: 
  url: /assets/img/2024-06-19-FromDatatoVisualizationwiththeOpenAIAssistantsAPIandGPT-4o_0.png
tag: Tech
originalTitle: "From Data to Visualization with the OpenAI Assistants API and GPT-4o"
link: "https://medium.com/towards-data-science/from-data-to-visualization-with-the-openai-assistants-api-and-gpt-4o-69af0cac5118"
---


GPT-4의 능력이 계속해서 확장되면서, OpenAI의 기술을 기반으로 한 도구들은 개발자들에게 점차적으로 강력한 자산으로 발전하고 있습니다.

본 글에서는 최신 버전의 차트 작성 기능을 탐구할 예정입니다. 데이터 파일과 구체적인 지침을 Assistant에 제공하여 우리의 데이터 시각화 아이디어를 구현하는 과정을 살펴볼 것입니다.

이를 위해 Assistant API의 내장 도구들을 활용할 것입니다.

지금 당장 OpenAI Python 패키지(v1.30.0, 작성 시점 기준)에는 Assistants API 안에 File Search, Code Completion 및 Function Calling 도구가 포함되어 있습니다.

<div class="content-ad"></div>

기능 호출을 통해 개발자는 작업을 완료하기 위해 AI가 지능적으로 선택할 수 있는 함수를 정의할 수 있으며, 파일 검색을 통해 다양한 파일 유형을 업로드하고 벡터 데이터베이스에 RAG 스타일로 저장할 수 있습니다. 코드 완성은 보조 프로그램이 프로그래밍 및 수학 문제를 해결하기 위해 파이썬 프로그램을 작성하고 실행할 수 있는 격리된 환경에서 작동합니다.

코드 완성은 업로드된 파일과 함께 사용할 수도 있습니다. 이 파일들은 데이터 파일과 차트 이미지를 생성하기 위해 처리될 수 있습니다. 그리고 바로 이 기능을 우리가 여기에서 사용할 것입니다.

아래에서 탐구할 코드는 CSV 형식의 데이터 파일을 로드하고 적절한 프롬프트를 사용하여 데이터에서 그래프를 생성하도록 보조 프로그램에 지시합니다. 그런 다음 그래프를 다운로드하고 표시할 것입니다.

간단한 영어 프롬프트를 사용하여 원시 CSV 데이터에서 아래와 같은 차트를 쉽게 생성할 수 있습니다.

<div class="content-ad"></div>

# OpenAI Assistant

이전에 OpenAI의 Assistant API에 대해 설명했고 이를 시작하는 방법을 설명했습니다(OpenAI의 강력한 새 Assistant API를 사용하여 데이터 분석). API의 새 버전들이 이 기사를 다소 구식으로 만들었지만, Assistant의 설명과 작동 방식은 여전히 대체로 정확하며 OpenAI 계정을 설정하는 방법 또한 그대로 유효합니다.

그래서 더 자세히 살펴보려면 해당 기사를 참고하시고, 여기서는 핵심 사항에 대한 간략한 소개로 한정하겠습니다.

# OpenAI

<div class="content-ad"></div>

먼저, 물론 OpenAI 계정이 필요하며 사용 시 요금이 부과될 것임을 알아야 합니다. 그러나 요금은 높지 않습니다: 여기서 설명할 코드를 실행하는 비용은 몇 센트만 들 것입니다. 파일 저장 등의 기타 요금이 부과될 수 있으나, 이는 해당 맥락에서는 관련성이 없을 수도 있지만 최신 요금을 확인해 보는 것이 좋습니다.

그렇다면, OpenAI 대시보드를 정기적으로 사용하여 사용량을 확인하여 큰 청구서가 발생하지 않도록 해야합니다.

 OpenAI 어시스턴트의 모든 출력물과 업로드한 파일이 모두 저장되므로 사용중인 저장소도 확인해야 합니다. 대시보드에서 수동으로 삭제할 수 있으며, 여러분은 이렇게 해야 합니다. 왜냐하면 요금이 부과되지 않을 수 있지만, 시간이 지날수록 작업 공간에 불필요한 파일이 많이 축적될 수 있기 때문입니다.

<div class="content-ad"></div>

# 어시스턴트, 스레드, 그리고 런

어시스턴트 API에서 가장 기본적인 세 가지 객체입니다.

- 어시스턴트: 이름에서 알 수 있듯이, 이 설정의 주요 부분입니다. 어시스턴트를 만들 때 우리는 모델 (예: gpt-4o), 모델에게 원하는 행동 유형에 대한 지시사항, 코드 해석기와 파일 검색과 같은 도구, 그리고 모델이 사용해야 하는 파일과 같은 다양한 속성을 지정합니다.
- 스레드: 이들은 대화의 상태를 저장하고 사용자와 어시스턴트가 생성하는 메시지를 포함합니다. 런(아래 참조)이 시작될 때 스레드는 어시스턴트와 연결됩니다.
- 런: 런은 스레드의 정보와 어시스턴트를 가져와 LLM(AI 모델)과의 상호 작용을 관리합니다. 완료되기 전에 런은 여러 단계를 거칩니다. 런이 완료되면, 어시스턴트가 만든 응답을 확인하기 위해 스레드를 조사할 수 있습니다.

이 기본 객체들 외에도 스레드에서는 모델에 대한 지시와 해당 응답을 포함하는 메시지가 필요합니다. 또한 어시스턴트가 사용하는 분리된 객체인 파일을 사용하며, 업로드된 파일의 세부 정보를 저장합니다.

<div class="content-ad"></div>

# 비서 코딩하기

우리의 비서를 만들고 실행하기 위해 몇 가지 단계를 거쳐야 합니다. 아래에 나열된 이벤트 순서는 각 구성 요소가 사용되는 방식에 대한 개요를 제공합니다.

다음은 절차입니다:

- API 키로 OpenAI 클라이언트를 생성합니다.
- 로컬 파일을 업로드하고 나중에 사용할 파일 객체를 검색합니다.
- 모델에 대한 지침과 업로드된 파일의 ID로 비서를 생성합니다.
- 파일 ID 및 모델의 지침을 포함하는 스레드를 생성합니다.
- 비서와 스레드를 실행합니다.
- 이제 스레드에 있는 사용자 및 AI가 생성한 메시지를 표시합니다(모델이 결과물을 생성하는 과정을 보여주어야 하며, 문제가 발생한 경우 무엇이 문제인지 확인할 수 있습니다).
- 생성된 이미지를 검색하여 표시합니다.

<div class="content-ad"></div>

위의 각 항목을 Python으로 코드화하고 정확히 무슨 일이 일어나고 있는지 설명하겠습니다. 저는 Jupyter 노트북 형식으로 코드를 작성했으므로, 함께 따라해보고 싶으시다면 각 코드 부분을 새로운 노트북 셀에 복사하여 제 노트북을 복제할 수 있습니다.

첫 번째 단계는 클라이언트를 생성하는 것입니다.

## 클라이언트 생성

클라이언트는 OpenAI API에 접근할 수 있게 해줍니다. API 키를 제공해야 하는데, 아래 코드에서는 사용자가 키를 수동으로 입력해야 하도록 입력문을 포함시켰습니다.

<div class="content-ad"></div>

```js
from openai import OpenAI

key = input("API 키")
client = OpenAI(api_key=key)
```

또는 키를 하드코딩할 수도 있어요 (하지만 코드를 공개하지 않도록 주의하세요).

```js
from openai import OpenAI

client = OpenAI(api_key="여기에 키를 입력하세요")
```

또는 키가 환경 변수로 저장된 경우에는 클라이언트가 자동으로 찾아내기 때문에 코딩할 필요가 없습니다...

<div class="content-ad"></div>

```python
from openai import OpenAI

client = OpenAI()
```

이 중 하나는 여러분의 첫 번째 주피터 노트북 셀입니다.

## 파일 업로드

먼저 파일이 필요합니다! 저는 Our World in Data(OWID) 웹사이트의 데이터를 기반으로 한 CSV 파일을 사용하고 있습니다. OWID는 정보와 데이터의 훌륭한 출처이며, 그들은 친절하게 모든 콘텐츠를 Creative Commons BY 라이센스 하에 자유롭게 사용할 수 있도록 허용하고 있습니다.

<div class="content-ad"></div>

파일은 1850년부터 2021년까지 전 세계 CO2 배출량을 기록한 것입니다 (원본 데이터에는 다른 항목의 데이터도 많이 포함되어 있지만, 여기에는 세계 데이터만 포함했습니다). 아래 스크린샷에서 파일이 어떻게 보이는지 확인할 수 있습니다.

파일 이름은 world_df.csv로 지었고, 또한 보조 프로그램에 지정할 이름에 해당하는 변수를 설정하고 싶습니다. 따라서 두 값을 담은 변수를 두 번째 노트북 셀에 넣었습니다.

```js
filename = "world_df.csv"
assistant_name = "data-analyst-v0.1"
```

다른 파일을 읽거나 새 보조 프로그램을 만들기 위해 코드를 사용하려면 이 셀에서 값들을 변경할 수 있습니다.

<div class="content-ad"></div>

다음 셀에 파일을 업로드합니다. 파일을 업로드하는 주요 작업은 client.files.create 메서드에 의해 수행됩니다. 아래 코드에서 이 메서드는 파일 자체와 파일의 목적을 나타내는 'assistants' 문자열 두 가지 매개변수를 사용합니다.

이 코드는 파일을 업로드하는 작업 이상을 수행합니다. 코드가 한 번 이상 실행될 것이므로(다른 지시사항과 함께 실행될 수도 있음) 파일을 중복으로 업로드하고 싶지 않습니다. 따라서 파일이 새로운 경우 코드는 파일을 업로드하지만, 이미 업로드된 경우 코드는 해당 기존 파일을 검색합니다.

```js
# 파일이 이미 업로드되었는지 확인
filelist = client.files.list(purpose="assistants")
filenames = [x.filename for x in filelist.data]

# "assistants" 목적의 파일을 업로드하거나 기존 파일 사용
if not filename in filenames:
  file = client.files.create(
    file=open(filename, "rb"),
    purpose='assistants'
  )
else:
  for f in filelist:
    if f.filename == filename:
      file = client.files.retrieve(f.id)
      break
```

이미 업로드된 파일 목록을 다운로드하여 파일이 있는지 확인할 수 있습니다. client.files.list() 메서드는 서버에서 목록을 검색하며, parameterpurpose='assistants'를 전달하여 관심 있는 파일 유형을 보여줍니다.

<div class="content-ad"></div>

그럼 관심 있는 파일 이름을 찾기 위해 목록을 스캔할 수 있어요. 없다면 업로드하고, 그렇지 않으면 클라이언트에서 파일 객체를 가져와요. 어느 쪽이든, 파일은 파일 객체로 설정됩니다.

앱에서는 이 코드를 파일 객체를 반환하는 함수에 유용하게 배치할 수 있어요.

이제 파일이 업로드되고 파일 객체의 레코드가 생성되었어요. 다음으로, 이 파일을 사용할 보조를 만들어야 해요.

## 보조 만들기

<div class="content-ad"></div>

업로드한 파일과 마찬가지로 이미 존재하는지 확인합니다. 이 코드를 이전에 실행했다면, 도우미가 이미 만들어졌을 것이고, 중복으로 생성하고 싶지 않으므로 기존의 도우미 객체를 가져옵니다. 그렇지 않다면 새로운 객체를 생성합니다.

이 기능에 대한 코드는 파일 업로드에 사용한 것과 거의 동일합니다.

도우미를 생성하는 것은 client.beta.assistants.create()를 호출하여 수행됩니다.

도우미의 이름, 일부 기본 지침(시스템 프롬프트가 될 것입니다), 사용할 모델(이 경우 GPT-4o), 요청하는 도구(코드 해석기) 및 리소스에 대한 매개변수를 설정합니다. 이 마지막 매개변수에서는 업로드한 파일의 파일 객체를 참조하고, 코드 해석기가 파일을 사용할 것임을 나타냅니다.

<div class="content-ad"></div>

```js
# 조수가 이미 존재하는지 확인합니다
assistant_list = client.beta.assistants.list()
assistant_names =  [x.name for x in assistant_list.data]

if not assistant_name in assistant_names:
  # 파일 ID를 사용하여 조수를 생성합니다
  assistant = client.beta.assistants.create(
    name = "data-analyst-v0.1",
    instructions="You are a data analyst",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
    tool_resources={
      "code_interpreter": {
        "file_ids": [file.id]
      }
    }
  )
else:
    for a in assistant_list:
      if a.name == assistant_name:
        assistant = client.beta.assistants.retrieve(a.id)
        break
```

다시 말해서, 앱에서 이것은 조수 객체를 반환하는 함수일 수 있습니다.

## 스레드 생성

스레드를 만들려면 단순히 client.beta.threads.create()를 호출하고, 이 스레드를 사용하여 조수가 실행될 때 조수에 전달되는 첫 번째 메시지를 지정하면 됩니다.

<div class="content-ad"></div>

아래 코드에서 볼 수 있듯이, 메시지에서는 역할을 설정하고 프롬프트를 설정하며 파일 ID를 첨부합니다.

```js
thread = client.beta.threads.create(
  messages=[
    {
      "role": "user",
      "content": "첨부된 csv 파일을 사용하여 'Year'에 대한 '연간 이산화탄소 배출' 그래프를 표시하십시오",
      "attachments": [
        {
          "file_id": file.id,
          "tools": [{"type": "code_interpreter"}]
        }
      ]
    }
  ]
)
```

LLM으로 전송하는 프롬프트는 다음과 같습니다:

“첨부된 csv 파일을 사용하여 'Year'에 대한 '연간 이산화탄소 배출' 그래프를 표시하십시오”.

<div class="content-ad"></div>

그것은 상당히 간단한 요구 사항이에요. 코드 해석기가 데이터 파일을 분석하고 필요한 코드를 생성해야 해요.

이제 우리는 쓰레드를 사용하여 어시스턴트를 실행할 준비가 모두 끝났어요.

## 실행 만들기

실행은 어시스턴트와 쓰레드를 가져와 LLM에 제출해요. 비동기로 실행되며 완료되기 전에 여러 단계를 거쳐 가요.

<div class="content-ad"></div>

결과를 기다리기 위해서는 두 가지 방법을 사용할 수 있는데요: 폴링 또는 스트리밍 방식이 있습니다. 폴링은 실행 상태가 완료될 때까지 반복적으로 확인하는 방식이에요. 반면에 스트리밍은 다양한 단계가 자동으로 감지되며 함수가 해당 이벤트에 매핑될 수 있는 이벤트 핸들러에 반응하는 방식입니다.

아래는 OpenAI 문서에서 제공하는 스트리밍 코드입니다 (메시지가 변경되었습니다).

```js
from typing_extensions import override
from openai import AssistantEventHandler

# 먼저, 이벤트 핸들러 클래스를 생성하여
# 응답 스트림에서 이벤트를 처리하는 방법을 정의합니다.

class EventHandler(AssistantEventHandler):
  @override
  def on_text_created(self, text) -> None:
    print(f"\nassistant > {text.value}", end="", flush=True)

  @override
  def on_text_delta(self, delta, snapshot):
    print(delta.value, end="", flush=True)

  def on_tool_call_created(self, tool_call):
    print(f"\nassistant > {tool_call.type}\n", flush=True)

  def on_tool_call_delta(self, delta, snapshot):
    if delta.type == 'code_interpreter':
      if delta.code_interpreter.input:
        print(delta.code_interpreter.input, end="", flush=True)
      if delta.code_interpreter.outputs:
        print(f"\n\noutput >", flush=True)
        for output in delta.code_interpreter.outputs:
          if output.type == "logs":
            print(f"\n{output.logs}", flush=True)

# 그런 다음, 이벤트 핸들러 클래스를 사용하여
# `stream` SDK 도우미와 함께 Run을 생성하고
# 응답을 스트리밍합니다.

with client.beta.threads.runs.stream(
  thread_id=thread.id,
  assistant_id=assistant.id,
  instructions="그래프에 대한 다운로드 가능한 파일을 생성하세요",
  event_handler=EventHandler(),
) as stream:
  stream.until_done()
```

이번 실행을 시작하는 함수는 client.bet.threads.run.stream()이며, 이 함수에는 이번 실행 및 이벤트 핸들러와 같은 특정 실행을 위한 지침을 포함하여 스레드와 어시스턴트의 ID가 전달됩니다.

<div class="content-ad"></div>

이벤트 핸들러의 작동 방식에 대해서는 자세히 다루지 않겠습니다. 단순히 말하자면 텍스트가 생성되거나 도구가 출력되는 이벤트를 잡아내고 결과를 출력합니다. 이 기능은 실험적인 목적으로 충분하지만 실제 앱을 위해서는 이러한 출력물에 대해 더 정교한 작업을 원할 수도 있습니다.

스레드에서 그래프를 생성하길 원한다고 명시했으며, 여기 실행에서 다운로드 가능한 파일을 생성하도록 요청했습니다.

실행 결과는 아래와 같이 나와 있으며, 주로 어시스턴트에 의해 생성된 Python 코드로 구성되어 있습니다.

```js
assistant > code_interpreter

import pandas as pd

# CSV 파일 불러오기
file_path = '/mnt/data/file-8XwqMOlaH6hoKEEKOYXPYqTh'
data = pd.read_csv(file_path)

# 데이터 프레임의 처음 몇 행을 표시하여 구조를 이해합니다
data.head()

import matplotlib.pyplot as plt

# 'Year' 대 'Annual CO₂ emissions' 그래프 그리기
plt.figure(figsize=(10, 6))
plt.plot(data['Year'], data['Annual CO₂ emissions'], marker='o', linestyle='-')
plt.xlabel('Year')
plt.ylabel('Annual CO₂ emissions')
plt.title('Year vs Annual CO₂ emissions')
plt.grid(True)
plt.tight_layout()

# 그래프를 파일로 저장
plot_file_path = '/mnt/data/year_vs_annual_co2_emissions.png'
plt.savefig(plot_file_path)
plot_file_path

output >

assistant > 'Year' 대 'Annual CO₂ emissions'를 나타내는 그래프가 생성되었습니다. 아래 링크를 통해 플롯을 다운로드할 수 있습니다:

[그래프 다운로드](sandbox:/mnt/data/year_vs_annual_co2_emissions.png)
```

<div class="content-ad"></div>

위의 코드는 주피터 노트북에 포함되어서는 안 됩니다. GPT가 생성하고 실행한 것입니다.

이 출력 결과는 LLM이 우리의 지시를 이해했고 올바른 그래프를 생성하는 코드를 생성하고 실행하여 이미지 파일을 만들었다는 것을 보여줍니다.

## 생성된 파일 다운로드

이제 우리가해야 할 일은 어시스턴트가 생성한 파일을 찾아 내려받는 것뿐입니다.

<div class="content-ad"></div>

아래는 노트북의 마지막 코드 셀이 표시됩니다.

```js
filelist = client.files.list(purpose="assistants_output")

image_list = [x for x in filelist.data if "png" in x.filename]

id = image_list[-1].id  # 리스트의 마지막은 최신 파일입니다.

image_data = client.files.content(id)
image_data_bytes = image_data.read()

with open("./my-image.png", "wb") as file:
    file.write(image_data_bytes)
```

우리는 이 코드가 이미 실행되었을 수 있다고 가정하므로 이미지 파일이 하나 이상 있을 수 있습니다.

그래서 먼저 "assistants_output"로 레이블이 지정된 모든 파일의 목록을 가져온 다음, 이미지 목록(즉, 확장자가 '.png'인 파일)을 만들고 해당 목록에서 마지막 파일을 찾습니다. 그게 바로 생성된 마지막 파일입니다.

<div class="content-ad"></div>

그리고 차트를 표시하기 위해 다음 내용을 포함한 마크다운 셀을 만들 수 있습니다.

```js
![](my-image.png)
```

아래 이미지에서 결과물을 확인할 수 있습니다:

![이미지](/assets/img/2024-06-19-FromDatatoVisualizationwiththeOpenAIAssistantsAPIandGPT-4o_1.png)

<div class="content-ad"></div>

# **프롬프트 변경**

다른 차트를 생성하려면 단순히 다른 프롬프트로 코드를 다시 실행하면 됩니다. 예를 들어:

“첨부된 CSV 파일을 사용하여 '연도'에 대한 그래프를 모든 다른 열과 함께 표시하십시오.”

결과는 아래 이미지와 같습니다.

<div class="content-ad"></div>

아래 내용을 읽고 다른 문서에서 이 내용을 인용하실 수 있습니다.

<div class="content-ad"></div>

```js
assistant > code_interpreter

import pandas as pd

# CSV 파일 로드
file_path = '/mnt/data/file-8XwqMOlaH6hoKEEKOYXPYqTh'
data = pd.read_csv(file_path)

# 데이터프레임의 처음 몇 행을 표시하여 구조를 이해합니다.
data.head()

# 데이터를 21세기 이후(2000년 이후)로 필터링합니다.
data_21st_century = data[data['Year'] >= 2000]

# 'Year' 대 'Year'를 기준으로 플롯할 열을 정의합니다.
columns_to_plot = data.columns.drop(['Entity', 'Code', 'Year'])

# 데이터 플롯
plt.figure(figsize=(12, 8))
for column in columns_to_plot:
    plt.plot(data_21st_century['Year'], data_21st_century[column], label=column)

plt.title('21세기 연간 데이터')
plt.xlabel('년도')
plt.ylabel('값')
plt.legend(title='메트릭', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True)
plt.tight_layout()

# 플롯을 파일로 저장
plot_file_path = '/mnt/data/my-image3.png'
plt.savefig(plot_file_path)

plt.show()

plot_file_path

output >

assistant > 그래프가 성공적으로 생성되었고 저장되었습니다. 아래 링크를 사용하여 파일을 다운로드할 수 있습니다:

[그래프 다운로드](sandbox:/mnt/data/my-image3.png)None
```

이를 통해 코드 해석기가 데이터를 필터링하여 원하는 차트를 생성했음을 알 수 있습니다.

아래 차트를 확인할 수 있습니다.

<img src="/assets/img/2024-06-19-FromDatatoVisualizationwiththeOpenAIAssistantsAPIandGPT-4o_3.png" />

# 결론 및 앱 방향으로

<div class="content-ad"></div>

오픈AI의 Assistants API와 코드 인터프리터를 사용하면 일반 영어로 데이터 파일에서 차트를 생성할 수 있는 코드를 생성할 수 있습니다.

이 코드는 특별히 어렵지 않으며 Jupyter Notebook 코드는 단순히 데모용일 뿐입니다. 그러나 이를 쉽게 응용하여 사용자로부터 데이터 파일을 업로드하고 필요한 차트를 설명하는 프롬프트를 입력하도록 요청하고 사용자가 그 차트를 이미지 파일로 다운로드할 수 있는 앱으로 확장할 수 있을 것입니다.

## 업데이트: 프로토타입 앱

GitHub 리포지토리(아래 참조)의 코드를 기반으로 한 Streamlit 앱 프로토타입인 'streamlit' 폴더가 있습니다. 이 앱을 사용하려면 API 키를 제공하고 Streamlit 비밀 파일에 넣어야 합니다.

<div class="content-ad"></div>

앱은 Streamlit 파일 업로드 컨트롤을 사용하여 CSV 파일을 업로드하고 작업하기 위해 프롬프트를 입력할 수 있는 입력 상자가 제공됩니다. 프롬프트가 실행 중일 때 상태 문자열이 표시됩니다. LLM가 프롬프트를 이해하지 못하거나 다른 오류가 발생하는 경우 간단한 오류 메시지가 표시됩니다.

위의 주피터 노트북의 수정된 버전은 로컬 라이브러리 패키지에서 클래스로 코드화되고 Streamlit 앱에서 해당 메서드를 호출합니다. 몇 가지 간단한 데이터 파일도 있습니다. 자유롭게 다운로드하여 수정하고 자신의 목적을 위해 실행할 수 있지만 'streamlit' 폴더의 README.md 파일을 먼저 읽어야 합니다!

읽어 주셔서 감사합니다. GitHub 리포지토리에서 코드와 데이터를 찾을 수 있습니다. 자유롭게 다운로드하거나 복제하거나 포크할 수 있습니다. 더 많은 기사를 보려면 중간에서 제 계정을 팔로우하거나 무료 종간 소식지를 구독해 주세요. 이전 기사는 제 웹페이지에 나열되어 있습니다.

모든 이미지와 스크린샷은 별도로 표시되지 않는 한 제가 작성한 저자에 의해 만들어졌습니다.

<div class="content-ad"></div>

모든 코드는 MIT 라이선스에 의해 보호받습니다 (저장소에서 확인하실 수 있습니다). 언급이 필수는 아니지만 언제나 감사히 받습니다.