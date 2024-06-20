---
title: "리즈 SDK를 활용한 스마트 홈 설정 도우미 구축"
description: ""
coverImage: "/assets/img/2024-06-19-BuildingaSmartHomeSetupAssistantusingLyzrSDK_0.png"
date: 2024-06-19 17:01
ogImage: 
  url: /assets/img/2024-06-19-BuildingaSmartHomeSetupAssistantusingLyzrSDK_0.png
tag: Tech
originalTitle: "Building a Smart Home Setup Assistant using Lyzr SDK"
link: "https://medium.com/@akshaykeerthi007/building-a-smart-home-setup-assistant-using-lyzr-sdk-fb6a7ec657ab"
---


가정 자동화의 미래에 오신 것을 환영합니다! 최첨단 AI 기술과 실용적인 가정 기술이 교차하는 곳에서 저희 Smart Home Setup Assistant가 여러분이 스마트 디바이스를 가정에 통합하는 방식을 혁신하려고 합니다. 기술 애호가든 스마트 홈 세계에 처음 발을 딛은 분이든, 우리 어시스턴트는 여러분의 경험을 쉽고, 원활하고, 즐겁게 만들도록 설계되었습니다.

![이미지](/assets/img/2024-06-19-BuildingaSmartHomeSetupAssistantusingLyzrSDK_0.png)

Smart Home Setup Assistant는 AI 기술을 활용한 도구로, 여러분이 스마트 홈 디바이스의 설정, 통합, 자동화를 안내받을 수 있습니다. OpenAI의 GPT-4와 같은 고급 AI 모델의 힘을 활용하여, 당신의 특정한 요구에 맞게 맞춤형 단계별 설명을 제공하여 가정의 모든 디바이스가 조화롭게 함께 작동하도록 보장합니다.

Lyzr SDK를 사용하는 이유는 무엇인가요?

<div class="content-ad"></div>

Lyzr.ai SDK를 사용하면 자체 GenAI 어플리케이션을 만드는 것이 매우 간단합니다. 빠르게 설정하고 실행하기 위해 몇 줄의 코드만 필요합니다.

Lyzr SDK를 확인해보세요.

디바이스 식별: 집을 변신시키는 첫 번째 단계는 설정하려는 스마트 디바이스를 식별하는 것입니다. 스마트 조명, 온도 조절기, 보안 카메라 또는 음성 어시스턴트이든 상관없이, 저희 어시스턴트가 모두 처리해 드릴 수 있습니다.

```python
input = st.text_input("걱정사항을 입력해주세요:", placeholder="여기에 입력하세요")
```

<div class="content-ad"></div>

이 코드 조각은 스마트홈 기기나 특정 걱정 사항을 나열할 수 있는 텍스트 입력 필드를 생성합니다. 이 입력을 기반으로 어시스턴트가 당신의 요구에 맞게 자문을 제공할 것입니다.

원활한 연결: 당신의 기기를 집의 Wi-Fi 네트워크나 필요한 허브에 연결하는 것은 당사 어시스턴트와 매우 쉽습니다. 각 단계를 안내해 원활하고 안정적인 연결을 보장합니다.

자동화 루틴 만들기: 기본 자동화 루틴을 설정하여 스마트홈 경험을 향상시키세요. 아침 깨워주는 루틴이든 아무도 집에 없을 때 에너지를 절약하는 설정이든, 우리 어시스턴트가 당신의 라이프스타일에 맞는 루틴을 만드는 데 도움을 줍니다.

```js
open_ai_text_completion_model = OpenAIModel(
    api_key=st.secrets["apikey"],
    parameters={
        "model": "gpt-4-turbo-preview",
        "temperature": 0.2,
        "max_tokens": 1500,
    },
)
```

<div class="content-ad"></div>

이 스니펫은 OpenAI 모델을 구성하는 부분인데, 이 모델은 어시스턴트를 구동합니다. 온도와 최대 토큰과 같은 매개변수를 지정하여, 어시스턴트가 일관되고 간결한 응답을 제공할 수 있도록 설정하고 있어요.

우리 어시스턴트는 스마트 홈이 안전하고 데이터가 보호받는지 확인하도록 조언과 최상의 실천 방법을 제공합니다.

```js
def generation(input):
    generator_agent = Agent(
        role="전문가 스마트 홈 설치 어시스턴트",
        prompt_persona="사용자가 특정 기기의 설치, 자동화 루틴 생성, 이러한 기기를 원활하게 통합하는 과정을 안내하는 것이 당신의 임무입니다.")
    prompt = """
    당신은 전문가 스마트 홈 설치 어시스턴트입니다. 사용자가 특정 기기의 설치, 자동화 루틴 생성 및 이러한 기기를 완벽하게 통합하는 과정을 안내하는 것이 당신의 임무입니다.
[여기에 프롬프트를 추가해주세요]
"""
        name="Generation",
        model=open_ai_text_completion_model,
        agent=generator_agent,
        instructions=prompt,
        default_input=input,
        output_type=OutputType.TEXT,
        input_type=InputType.TEXT,
    ).execute()
  return generator_agent_task
```

이 함수는 사용자가 제공한 입력을 기반으로 어시스턴트의 응답을 생성합니다. 특정 역할과 페르소나로 에이전트를 설정하고, 응답 생성 프로세스를 안내하기 위해 자세한 프롬프트를 작성합니다.

<div class="content-ad"></div>

```js
if st.button("도와주세요!"):
    solution = generation(input)
    st.markdown(solution)
```

이 코드 조각은 "도와주세요!" 버튼이 클릭될 때의 동작을 정의합니다. 사용자 입력과 함께 generation 함수를 호출하고 생성된 솔루션을 표시합니다.

스마트 홈으로 변신하는 것이 이제 더 쉽습니다. 저희의 스마트 홈 설정 도우미는 고급 AI와 사용자 친화적인 가이드를 결합하여 원활하고 효율적인 설정 과정을 보장합니다. 일상적인 루틴 자동화, 보안 강화 또는 스마트 디바이스의 편의성을 즐기려는 경우, 저희 도우미가 도와드릴 준비가 되어 있습니다.

앱 링크: https://smarthomeassistant-lyzr.streamlit.app/


<div class="content-ad"></div>

소스 코드: https://github.com/isakshay007/Smart_Home_Assistant

스마트 홈 설정 도우미는 Lyzr Automata Agent에 의해 제공되며, OpenAI의 GPT-4 Turbo 기술을 활용하고 있습니다. 문의 사항이나 문제가 있을 경우 Lyzr에 문의해주시기 바랍니다. Lyzr 및 그들의 제품에 대해 더 알아보려면 다음 링크를 통해 확인하실 수 있습니다:

- 웹 사이트: Lyzr.ai
- 데모 예약: 데모 예약
- 디스코드: Discord 커뮤니티에 가입하기
- 슬랙: Slack 채널에 가입하기