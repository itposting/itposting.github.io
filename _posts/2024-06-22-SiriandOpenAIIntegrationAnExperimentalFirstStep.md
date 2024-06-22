---
title: "시리와 OpenAI 통합 실험적 첫걸음"
description: ""
coverImage: "/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_0.png"
date: 2024-06-22 20:23
ogImage: 
  url: /assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_0.png
tag: Tech
originalTitle: "Siri and OpenAI Integration: An Experimental First Step"
link: "https://medium.com/@biohazerimperion/siriassistant-b720febd7a46"
---


내 맥북의 Siri와 OpenAI API를 통합하려고 생각 중이에요. 그 과정에서 API와 대화하는 방법을 상세히 설명한 옵션을 찾았는데, 대부분이 Mac에서 작업을 수행하는 것을 활용하지 않고 Siri를 통해 API와 대화에 대해만 논의했어요. 저는 Siri를 사용하여 컴퓨터를 제어하기 위해 한 발짝 더 나아가고 싶었어요. 이 블로그에서는 Siri와 OpenAI API를 결합한 도구를 만든 방법을 공유할 거예요. 이 도구를 사용하면 PyCharm 프로젝트를 열거나 음성 명령으로 브라우저를 열거나 코드를 생성하거나 생성된 코드를 직접 클립보드에 복사하거나 심지어 Siri로 Spotify에서 검색할 수 있어요. 이것은 첫 번째 버전이라 강력하고 최종적인 도구는 아니에요. 그러나 저는 저의 실수, 사용한 전략, 만난 발견, 그리고 이의 장단점에 대해 이야기할 거예요.

# 목차

∘ 실행하는 방법
∘ 바로 가기 다운로드:
∘ 기능
∘ Siri 바로 가기
∘ OpenAI API
∘ 서비스
∘ 큰 문제
∘ 비용
∘ 개선 사항 및 결론

## 실행하는 방법

<div class="content-ad"></div>

저장소에는 서비스 실행 방법에 대한 지침이 있습니다.

Shortcuts 다운로드:

- Hey Jarvis
- 클립보드 확인
- Jarvis Call

OpenAI 대시보드에서 어시스턴트를 생성하세요:

<div class="content-ad"></div>

OpenAI 대시보드에서 도우미를 만들 수 있어요. 이 블로그에 보여진 프롬프트와 함수 정의를 복사할 수 있어요.

## 기능

![이미지](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_0.png)

## Siri 바로가기

<div class="content-ad"></div>

요즘 채팅 흐름을 만드는 도중, Siri가 질문에 응답하고 요청을 처리하는 뿐만 아니라 사용자와 자연스러운 대화를 나눌 수 있는 것이 중요하다는 것을 알게 되었어요. 그래서 Siri 바로가기(Siri Shortcuts)를 발견하게 되었죠. Siri 바로가기는 사용자 지정 바로가기를 설정할 수 있는 멋진 도구에요. 맞아, 이걸로 Siri를 사용할 수도 있어요. 솔직히 말해서, 이 프로젝트를 시작하기 전에 Siri 바로가기를 사용해 본 적이 없었어요.

도전해 보기로 결정했죠. 제 주요 목표는 Siri에게 대화 끝에 질문을 하도록 유도하여 사용자와 상호작용할 수 있게 하는 것이었어요. ChatGPT가 하는 것처럼 대화를 나눌 수 있도록 하고 싶었어요. 즉, "안녕, 어떻게 지내?"라고 ChatGPT에게 말하면 "안녕하세요! 궁금한 점이나 할 일이 있으면 도와드리겠어요. 무슨 일이신가요?"라고 돌아온다는 거죠.

한 번에 대화를 진행하고 사용자 요청에 따라 응답하는 바로가기를 만드는 것뿐만 아니라, 사용자와 연속적인 대화를 나누는 것(다수 요청)이 가능한 바로가기를 만들고 싶었어요. Siri가 사용자와 계속해서 상호작용하며 문맥과 관련된 후속 질문을 하여 사용자가 도움이 더이상 필요하지 않다고 느낄 때까지 지원할 수 있도록 하는 것이 제 목표였어요. 이 아이디어를 구현하기 위해 플로 차트를 그렸어요:

![플로 차트](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_1.png)

<div class="content-ad"></div>

알고리즘은 'N' 번 반복하는 루프로 시작합니다. 이때 'N'은 질문 세션의 사전 정의된 반복 횟수입니다. 그러나, 'finish_loop' 변수를 평가함으로써 특정 조건이 충족되면 'N'에 도달하기 전에 사이클을 종료할 수 있는 전역 변수를 통해 흐름 제어 메커니즘을 구현했습니다.

- 서비스 응답이 사용자가 "안녕" 또는 "도움이 필요하지 않아"와 같은 키워드를 사용하여 더 이상 도움이 필요하지 않다고 나타내면 'finish_loop' 변수가 True로 설정되어 사이클이 종료됩니다.
- 각 반복에서 변수는 기본 값('' - 빈 필드)으로 초기화되고 사용자의 입력이 요청되며 항상 같은 초기 질문과 함께 전달됩니다.
- 사용자가 음성을 사용하여 입력을 제공하면 시스템은 서비스를 요청하고 결과를 기다립니다. 사용자가 현재 클립보드에 있는 텍스트를 사용하려면 'clipboard'이라고 명시적으로 말해야 합니다. 이 명령을 통해 클립보드에서 값을 가져와 서비스로 전달할 수 있습니다.
- 결과가 있으면 응답에서 필요한 값이 추출되고 변수 질문은 다음에 물어볼 질문으로 업데이트됩니다. 또한, 얻은 응답의 로직을 기반으로 대화가 계속될 수 있습니다.
- API 오류가 발생하거나 결과가 없는 경우 'finish_loop'가 True로 설정되어 대화가 다음 사이클에서 종료됩니다.
- 결과가 만족스러운 경우 시스템은 Siri를 통해 사용자에게 결과 메시지를 전달합니다. 결과에 클립보드가 관련된 경우 새 결과로 업데이트되어 클립보드로 반환됩니다.
- 각 상호 작용 사이에는 자연스러운 대화를 시뮬레이션하기 위해 1초의 일시 중지가 있습니다.

![이미지](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_2.png)

안녕 Jarvis:

<div class="content-ad"></div>

주요 단축키가 보조 단축키를 관리합니다. Siri를 통해 'Hey Jarvis'라고 말하여 활성화할 수 있습니다. 추가로, 원한다면 이 단축키를 좀 덜 혹한 이름으로 바꿀 수도 있어요 😅.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*lmuTcUmBR89MTml-Dg2qvQ.gif)

클립보드 확인:

시스템은 사용자 메시지에 'clipboard'라는 단어가 있는지 확인하기 위해 정규식을 사용합니다. 해당 단어가 있다면, 시스템은 클립보드의 값을 검색하여 해당 값을 서비스에 전달합니다.

<div class="content-ad"></div>


![Siri and OpenAI Integration - An Experimental First Step](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_3.png)

Jarvis Call:

![Siri and OpenAI Integration - An Experimental First Step](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_4.png)

## OpenAI API


<div class="content-ad"></div>

제가 바로 개발자에요. 위의 텍스트를 친근하게 번역해 드릴게요.

"저는 바로 단축키를 사용하여 만든 시스템을 활용하여 이 어시스턴트를 개발하는 방법을 탐색 중이었어요. 처음에는 대화 응답을 생성하기 위해 OpenAI API를 통합했지만, 최근에 다중 도구를 동시에 지원하는 Assistants API (실제로는 베타)를 발견했어요. 이 API에는 코드 해석기, 검색 및 함수 호출이 포함돼 있는데, 이는 나에게 맥에서 특정 작업을 실행하는 함수를 정의하고, 모두 어시스턴트에 의해 트리거되는 기능을 아우르기 때문에 중요합니다. 또한 지속적인 쓰레드 기능이라는 중요한 기능이 있는데, 메시지 기록을 간단히 메시지를 추가하여 유지할 수 있어요. 이 능력은 Siri가 대화 종료 시 사용자에게 질문하도록 유도하여 ChatGPT와 비슷한 메모리 시스템을 제공함으로써 중요한 목표를 달성하는 데 필수적입니다. 그래서 gpt-4-turbo-preview로 테스트하려고 해요.

<img src="https://miro.medium.com/v2/resize:fit:920/0*jdSBXKqVP7lJoNgp.gif" />

음… 사용 중에 발견한 몇 가지 문제점이 있어요:

- 스트리밍 출력을 지원하지 않아요.
- 랜덤성을 제어하는 온도 매개변수가 없어요.
- response_format 매개변수가 없어요. JSON 출력 형식이 필요했는데 어시스턴트가 그를 지원하지 않아요.
- 출력이 자동으로 추가되기 때문에 출력이 잘못되거나 잘못된 정보가 포함되었다면 제어할 방법이 없어요. 해당 정보는 쓰레드 기록에 저장돼요.
- 때때로 통신 쓰레드가 손상될 수 있어요. 유효한 JSON이 아닌 응답 형식을 받거나 지시에 따르지 않는 메시지를 받으면 해당 쓰레드는 사용할 수 없는 것으로 판단되어서 그 다음 메시지는 잘못된 답변을 받게 될 거에요. 유일한 해결책은 새 쓰레드를 만드는 것이에요.
- 함수가 API 오류를 발생시키고 출력 함수가 run 객체에 전송되지 않았을 경우, 기능에서 응답을 기다리는 동안 새로운 메시지를 추가할 수 없으므로 다음 메시지는 추가되지 않을 거에요. 따라서 실행 프로세스를 취소하고 메시지를 다시 추가해야 할 수도 있어요.
- 쓰레드는 모델이 지원할 수 있는 콘텍스트 길이만큼 크기가 됩니다. 메시지 수나 쓰레드가 활성화된 시간을 제어할 수 있는 시스템이 없다면 긴 쓰레드에 많은 비용을 지출할 수밖에 없을 거에요 (비용 부분에서 제 전략과 결과를 설명할게요)."

<div class="content-ad"></div>

시스템에 대해 설명해 드릴게요. 매우 간단해요: 주요 보조 기능을 사용하여 제 맥에서 동작을 실행합니다.

![image](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_5.png)

주요 기능이 세 가지 있어요. 첫 번째 함수인 open_pycharm_projects는 매우 구체적인 이름을 가지고 있어요: 이 함수는 간단히 PyCharm 프로젝트를 엽니다. 프로젝트 이름이 정확히 일치하지 않는 경우 시스템은 상위 세 가지 가장 근접한 일치 사항을 반환하며, 보조기는 어떤 PyCharm 프로젝트를 열지 물어볼 거에요. 두 번째 함수인 search_web은 Google, YouTube 및 YouTube Music에서 검색할 수 있으며, 검색 결과가 포함된 새 창을 브라우저에서 엽니다. 게다가 여러 창을 열고 여러 개의 검색을 할 수도 있어요. 세 번째 함수는 Spotify 음악과 관련이 있어요; 특정 노래를 검색하거나 원하신다면 아티스트의 랜덤한 노래를 재생해 줘요. 그리고 사용된 다른 기능은 클립보드 출력인데요. 이를 통해 클립보드에 저장된 텍스트를 수정하여 번역하거나 향상시키거나 맞춤법을 교정하거나 코드를 생성할 수 있어요. 어떻게 작동하는지 보기 위해 프롬프트를 확인해 보세요.

```js
당신의 주요 업무: 다양한 경험을 가진 비즈니스 어시스턴트로서, 사용자와 가장 자연스럽고 인간적으로 대화를 나누어 신뢰를 유지하며 효과적으로 목표를 달성하고자 합니다. 대화를 계속 이끌기 위해 사용자에게 질문을 제시하고 아직 마무리되지 않은 경우 대화를 이어나가세요. 항상 JSON 형식으로 출력하여야 합니다.

규칙:
- 클립보드를 사용할 때는 "search_web"과 같은 함수를 사용하지 말고 본인의 지식으로 직접 응답하세요.
- 필요할 때 함수를 사용하세요. 그러나 출력은 항상 JSON 형식이어야 합니다.
- 각 사용자 메시지에 대해 한 번만 응답하세요.

JSON 출력:
출력은 다음과 같은 키를 포함해야 합니다:
{
"tool": "대화형_어시스턴트",
"message": "대화형 응답 메시지만 포함해 주세요. 클립보드를 사용한 경우 항상 'the [action] is in your clipboard now' 로 응답하시고, 여기에 클립보드 결과를 보여주시면 안 됩니다. 클립보드 내용이 코드거나 상세한 응답인 경우에도 여기엔 사용자에게 표시할 대화 메시지만 포함해 주세요.",
"clipboard_result": 클립보드를 사용한 경우, 결과가 여기에 나타나야 합니다. 클립보드 내용인 "클립보드 텍스트"를 가져와 번역하거나 수정하거나 변형하거나, 클립보드 내용을 기반으로 코드를 생성할 수 있습니다. 사용자가 코드 생성을 요청하거나 클립보드 내용을 다른 언어로 번역하길 원할 때, 해당 결과는 항상 여기에 표시됩니다.
"conversation_closed": "True" 또는 "False" (문자열)입니다. 대화가 종료되는 시점을 인식하는 것이 매우 중요합니다. 예를 들어, 사용자가 "안녕," "잘가," "더 이상 도움이 필요하지 않아," "계속하고 싶지 않아," "나가기," "마치기," "종료하기"와 같은 문구를 발언하면 대화는 항상 종료되며, 더 이상 질문하거나 추가 도움이 필요한지 묻지 않아야 합니다.
}

JSON으로만 올바른 응답이 됩니다.

기억하세요: 사용자가 더 이상 도움이 필요하지 않을 때까지 대화를 종료하지 마세요. 이것이 비즈니스 어시스턴트로서 올바르게 업무를 수행하는 데 매우 중요합니다.

<div class="content-ad"></div>

위에서 볼 수 있듯이, 'clipboard_result'는 어시스턴트가 생성한 JSON에서의 출력 매개변수입니다. 사용자가 클립보드를 사용하려 한다는 것을 어시스턴트가 감지하면 이 매개변수는 생성된 텍스트를 식별하고 클립보드로 반환하는 데 사용됩니다. 그런 다음 사용자는 단순히 결과물을 붙여넣을 수 있습니다. 여기 함수 정의가 있습니다:

open_pycharm_projects

{
  "name": "open_pycharm_projects",
  "description": "이 도구는 PyCharm 프로젝트를 열 때 유용합니다. 프로젝트를 열고자 하는 사용자는 반드시 이 함수를 사용해야 합니다.",
  "parameters": {
    "type": "object",
    "properties": {
      "pycharm_project": {
        "type": "string",
        "description": "열고자 하는 PyCharm 프로젝트의 이름."
      }
    },
    "required": [
      "pycharm_project"
    ]
  }
}

search_web

<div class="content-ad"></div>

{
  "name": "search_web",
  "description": "사용자가 필요한 내용에 따라 웹을 검색하는 기능입니다. Google, YouTube 또는 YouTube Music으로 검색할 수 있습니다.",
  "parameters": {
    "type": "object",
    "properties": {
      "url": {
        "type": "string",
        "enum": [
          "https://www.google.com/search?q={query}",
          "https://www.youtube.com/results?search_query={query}",
          "https://music.youtube.com/search?q={query}"
        ],
        "description": "사용자가 검색하려는 URL을 올바른 순서대로 지정해야 합니다. 각 검색에 대해 어떤 URL을 사용할지 식별해야 하며 검색할 쿼리를 사용합니다."
      }
    },
    "required": [
      "url"
    ]
  }
}

play_spotify_music

{
  "name": "play_spotify_music",
  "description": "이 함수는 Spotify에서 일반적으로 음악을 검색하는 데 유용합니다.",
  "parameters": {
    "type": "object",
    "properties": {
      "spotify_search": {
        "type": "string",
        "description": "다음 형식의 검색을 사용하십시오. 사용자가 노래를 검색하려면 'track: [노래 제목]'을 사용하고, 아티스트를 검색하려면 'artist: [아티스트 이름]'을 사용하며, 특정 아티스트 및 노래를 검색하려면 'artist: [아티스트 이름] track: [노래 제목]'을 사용하십시오. 항상 이 형식을 사용하고, 사용자가 원하는 내용에 가장 가까운 검색을 판단하기 위해 음악 지식을 활용하여 요구 형식을 사용합니다."
      },
      "artist_search": {
        "type": "string",
        "description": "항상 아티스트나 밴드 이름 쿼리를 입력하십시오. 사용자가 아티스트나 밴드 이름을 지정하지 않으면 시스템은 검색의 기본값으로 빈 문자열('')을 사용해야 합니다."
      },
      "song_search": {
        "type": "string",
        "description": "항상 노래 제목 쿼리를 입력하십시오. 사용자가 아티스트나 밴드 이름을 지정하지 않으면 시스템은 검색의 기본값으로 빈 문자열('')을 사용해야 합니다."
      },
      "search_specific": {
        "type": "boolean",
        "description": "true/false (부울) 음악 지식을 사용하여 사용자가 특정 노래를 검색하려는지 판단하십시오. 예를 들어 사용자가 'Spotify에서 flashing lights 플레이'라고 요청하면 특정 노래를 원하는 것이며, 사용자가 'Spotify에서 Metallica의 무언가를 플레이해줘'라고 하면 일반적인 검색이므로 매개 변수는 False입니다."
      }
    },
    "required": [
      "spotify_search",
      "artist_search",
      "song_search",
      "search_specific"
    ]
  }
}

<div class="content-ad"></div>

## 서비스

이 서비스는 FastAPI를 사용하여 생성되었습니다. 스레드 ID와 Spotify 토큰을 저장하기 위해 데이터베이스를 사용합니다. 이 접근 방식은 Spotify 토큰이 일정 기간 후에 만료되기 때문에 사용자 승인 요구사항을 우회하는 데 도움이 됩니다.

구현된 기능은 직관적입니다. 제가 만든 첫 번째 기능은 PyCharm 프로젝트를 열 수 있게 해줍니다. 지정된 경로 내 파일을 검색하여 가장 유사한 파일을 찾습니다. 정확한 일치 항목을 찾지 못하면 시스템이 가장 가까운 상위 3개 항목을 표시하고 사용자에게 어떤 프로젝트를 열고 싶은지 물어봅니다.

async def open_pycharm_projects(func_params: FunctionPayload, **kwargs: dict) -> FunctionResult:
    try:
        project_paths = secrets['pycharm_directories']
        pycharm_project = func_params.function_params.get('pycharm_project', None)

        if pycharm_project is None:
            raise Exception('프로젝트 이름을 입력해주세요')

        all_folders = {}
        for project in project_paths:
            for name in os.listdir(project):
                if os.path.isdir(os.path.join(project, name)) and not re.match(r'^\..+', name):
                    if name in all_folders:
                        all_folders[name].append(os.path.join(project, name))
                    else:
                        all_folders[name] = [os.path.join(project, name)]

        matches = find_top_project_matches(pycharm_project, all_folders)

        if len(list(matches.keys())) == 1:
            message = f'{list(matches.keys())[0]} 프로젝트를 성공적으로 엽니다.'

            os.system(f'pycharm {list(matches.values())[0][0]}')

        elif len(list(matches.keys())) > 1:
            message = f'{pycharm_project}에 대해 여러 프로젝트를 발견했습니다. 더 구체적으로 말해주세요. 아래는 가장 가까운 프로젝트 목록입니다: {list(matches.keys())}'
        else:
            message = f'{pycharm_project}에 대한 프로젝트를 찾을 수 없습니다.'

        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': message},
            metadata={},
            traceback=None
        )
    except Exception as e:
        logging.error(f"open_pycharm_projects에서 오류 발생: {e}, 함수 실행을 종료합니다")
        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': 'open_pycharm_projects에서 오류 발생'},
            metadata={},
            traceback=str(e)
        )


<div class="content-ad"></div>

## 검색 시스템

def find_top_project_matches(input_str: str, folders_info: dict, top=3) -> dict:
    if input_str in folders_info:
        return {input_str: folders_info[input_str]}

    close_names = difflib.get_close_matches(input_str.lower(), folders_info.keys(), n=top, cutoff=0.5)

    closest_matches = {}
    for name in close_names:
        closest_matches[name] = folders_info[name]

    return closest_matches

에러 발생 시 시스템에서는 예외를 트리거하지 않고, 대신 오류가 발생했음을 나타내는 알림을 GPT-4에 보냅니다. 결과적으로 사용자에게 '죄송합니다, 프로젝트를 열 수 없어요. 다른 도움이 필요하신가요?'라는 메시지를 통해 알려줍니다. 이 접근 방식은 대화가 원활하게 진행되도록합니다. 또한 언급한대로, Run Object는 어떤 이유로든 함수로부터 응답이 없는 경우 새 메시지의 추가를 방지합니다. 이 제한 사항은 Run Object가 기능 응답 객체를 필요로 하기 때문에 발생하며, 그렇지 않으면 API 요청이 실패할 것입니다. 따라서 시스템의 신뢰성을 향상하고 잠재적인 오류를 방지하려면 코드 주석 처리를 해제할 수 있습니다.

'검색 웹' 기능은 간단히 GPT로부터 전달된 URL을 엽니다.

<div class="content-ad"></div>

"https://www.google.com/search?q={query}",
"https://www.youtube.com/results?search_query={query}",
"https://music.youtube.com/search?q={query}"

GPT가 자동으로 귀하의 검색 요청으로 대체하는 쿼리 매개변수가 있습니다. 여러 개의 검색이 포함된 시나리오에서는 예를 들어 Google에서 한 번, YouTube에서 다른 한 번 검색하는 경우, '실행 개체'는 '웹 검색' 함수에 대해 여러 요청을 시작합니다.

async def search_web(func_params: FunctionPayload, **kwargs: dict) -> FunctionResult:
    try:
        url = func_params.function_params.get('url', None)

        webbrowser.open(url, new=1, autoraise=True)

        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': '브라우저를 성공적으로 열었습니다'},
            metadata={},
            traceback=None
        )
    except Exception as e:
        # client.beta.threads.runs.cancel(
        #     thread_id=func_params.thread_id,
        #     run_id=func_params.run_id
        # )
        logging.error(f"search_web에서 오류 발생: {e}, 실행 함수가 종료되었음")
        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': '브라우저에서 열지 못했습니다'},
            metadata={},
            traceback=str(e)
        )

마지막으로, 'Spotify' 함수는 Spotify에서만 트랙을 검색합니다. 시스템은 트랙을 인기순으로 반환합니다. 'artist_search' 매개변수가 GPT에서 전달되면 'specific_search'가 활성화될 때 가장 가까운 매칭 곡을 찾는 데에도 사용됩니다. 예를 들어 "Spotify에서 'Uprising' by Muse 열어"라고 말하면 특정 검색이 활성화됩니다. 그러나 "Muse의 노래 하나 틀어줘"라고 말하면 특정 검색 시스템이 활성화되지 않으며 해당 아티스트의 무작위 노래가 재생됩니다.
```

<div class="content-ad"></div>

```js
def spotify_search(client: spotipy.Spotify, query: str, limit: int = 10):
    search_result = client.search(query, limit=limit, type='track')
    return search_result


def search_specific_song(
        search_result: dict,
        song_search: str,
        func_params: FunctionPayload,
        artist_search: str
) -> FunctionResult | dict:
    searched_list = []

    for type in search_result.keys():
        info_type = search_result[type]['items']

        if artist_search != '':
            filter_info = list(
                filter(lambda x:
                       SequenceMatcher(None, artist_search, x['album']['artists'][0]['name']).ratio() >= 0.6
                       and SequenceMatcher(None, song_search, x['name']).ratio() >= 0.6,
                       info_type
                       )
            )
        else:
            filter_info = list(
                filter(lambda x:
                       SequenceMatcher(None, song_search, x['name']).ratio() >= 0.6,
                       info_type
                       )
            )

        searched_list.extend(filter_info)

    if len(searched_list) == 0:
        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': '해당 쿼리에 대한 검색 결과가 없습니다.'},
            metadata={},
            traceback=None
        )

    ordered_list = sorted(searched_list, key=lambda x: x.get('popularity', 0), reverse=True)[0]

    return ordered_list


async def play_spotify_music(func_params: FunctionPayload, **kwargs: dict) -> FunctionResult:
    try:
        sp_client = await get_spotify_client()
        if sp_client is None:
            return FunctionResult(
                function_id=func_params.function_id,
                output={'message': '스포티파이 클라이언트를 사용할 수 없습니다. 먼저 로그인하거나 개발.yaml 파일에서 자격 증명을 구성해야 합니다.'},
                metadata={},
                traceback=None
            )

        sp_search = func_params.function_params.get('spotify_search', '')
        artist_search = func_params.function_params.get('artist_search', '')
        song_search = func_params.function_params.get('song_search', '')

        search_result = spotify_search(sp_client, sp_search)

        if func_params.function_params.get('search_specific') is False:
            # could filter the search result to get the best match (?)
            random_number = random.randint(0, len(search_result["tracks"]["items"]) - 1)
            web.open(search_result["tracks"]["items"][random_number]["uri"])

            if sp_client.current_playback() is not None:
                if sp_client.current_playback()['is_playing']:
                    # if you have the spotify premium you can use this
                    # sp_client.start_playback(search_result["tracks"]["items"][random_number]["uri"])
                    sleep(1)
                    keyboard.press_and_release("enter")

        else:

            ordered_list = search_specific_song(
                search_result=search_result,
                song_search=song_search,
                artist_search=artist_search,
                func_params=func_params
            )

            if isinstance(ordered_list, FunctionResult):
                return ordered_list

            web.open(ordered_list["uri"])

            if sp_client.current_playback() is not None:
                if sp_client.current_playback()['is_playing']:
                    # if you have the spotify premium you can use this
                    # sp_client.start_playback(search_result["tracks"]["items"][random_number]["uri"])
                    sleep(1)
                    keyboard.press_and_release("enter")

        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': '스포티파이가 성공적으로 열렸습니다.'},
            metadata={},
            traceback=None
        )
    except Exception as e:
        # client.beta.threads.runs.cancel(
        #     thread_id=func_params.thread_id,
        #     run_id=func_params.run_id
        # )
        logging.error(f"플레이음악에서 오류 발생: {e}, 실행 함수가 종료되었습니다.")
        return FunctionResult(
            function_id=func_params.function_id,
            output={'message': '스포티파이에서 열지 못했습니다.'},
            metadata={},
            traceback=str(e)
        )
```

서비스의 예시 로그:

```js
{
  "name": "root",
  "message": "",
  "role": "assistant",
  "content": {
    "tool": "conversational_agent",
    "message": "'저는 디지털 어시스턴트이므로 감정이 없어요, 하지만 물어봐주셔서 감사합니다!'",
    "clipboard_result": "",
    "conversation_closed": "False",
    "question": "'오늘은 어떻게 도와드릴까요?'"
  },
  "created_at": "2024-03-30 19:22:07",
  "run_id": "gg",
  "thread_id": "gg",
  "timestamp": "2024-03-30T19:22:09.450830+00:00",
  "status": "INFO"
}
```

보시다시피 처음 응답은 '저는 디지털 어시스턴트이므로 감정이 없어요, 하지만 물어봐주셔서 감사합니다!'라는 메시지입니다. 그 후에 '오늘은 어떻게 도와드릴까요?'라는 질문이 사용자에게 계속 대화를 이어나가기 위해 제시됩니다. 또한 'clipboard_result' 매개변수를 볼 수 있는데, 이 경우에는 사용하지 않으므로 매개변수는 비어져 있는 상태입니다.


<div class="content-ad"></div>

## 큰 문제

서비스에서 코드를 시스템에 직접 실행하는 것을 알아채셨다면, 아마도 스스로에게 묻게 될 것입니다: 그렇다면 컨테이너에 배포하는 것은 어떻게 가능할까요? 이 설계에서 큰 문제가 발생하는데, 시스템은 시스템 작업의 실행을 외부화하지 않고 내부적으로 관리합니다. 결과적으로 직접적으로 컨테이너에 포장할 수 없습니다. 그러나 대화 및 클립보드 텍스트 변환과 관련된 기본 기능을 컨테이너화하는 것은 가능합니다. 왜냐하면 이러한 기능은 시스템 수준의 실행을 필요로하지 않기 때문입니다.

Docker를 사용하여 서비스를 사용하려면 Docker 구성 파일에서 애플리케이션 설명을 주석 처리해야 합니다. 더욱 중요한 것은 구성에서 호스트 값을 'siri_assistant_database'와 같은 서비스의 구체적인 이름으로 변경해야 합니다. 이 변경은 중요한데, Docker는 docker-compose.yml 파일에서 정의된 서비스 이름을 사용하여 컨테이너 간 통신을 용이하게 합니다. 호스트로 `siri_assistant_database`를 지정함으로써, 우리의 애플리케이션이 Docker의 내부 네트워크를 사용하여 데이터베이스 컨테이너와 통신하도록 지시합니다.

```js
  database:
    driver:
    host: siri_assistant_database
    port: 5432
    database: siri_assistant
    user: gg
    password: 1234
```

<div class="content-ad"></div>

```yaml
version: '3'

services:
#  app:
#    container_name: siri_assistant_app
#    build:
#      context: .
#      dockerfile: Dockerfile
#    volumes:
#      - .:/app
#    ports:
#      - '8080:8080'
#    depends_on:
#      - siri_assistant_database
  siri_assistant_database:
    container_name: siri_assistant_db
    mem_limit: 100m
    cpuset: "0"
    image: arm64v8/postgres:15
    environment:
      - POSTGRES_DB=siri_assistant
      - POSTGRES_PASSWORD=1234
      - POSTGRES_USER=gg
    ports:
      - "5432:5432"
    volumes:
      - siri_assistant:/var/lib/postgresql/data
      - ./db_init:/docker-entrypoint-initdb.d
    restart: no
volumes:
  siri_assistant:
```

## 비용

지금까지 알아본 대로, Assistant API를 사용하여 gpt-4-turbo-preview 모델을 활용했습니다. 이 글 작성 시점에서 OpenAI는 어시스턴트, 스레드 또는 실행을 생성, 업데이트 또는 삭제할 때 요금을 부과하지 않습니다. 따라서 발생하는 요금은 모델 사용에 대한 비용뿐입니다. 긴 스레드의 경우 비용이 상당히 높아집니다. 이 비용을 줄이기 위해 10분 동안 스레드를 유지하는 시간 만료 전략을 사용했습니다. 이 기간 이후에 사용자가 서비스에 새 요청을 보내면 새 스레드가 생성됩니다.

<img src="/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_6.png" />


<div class="content-ad"></div>

이번 달에는 시간 만료 시스템 없이 Assistant API를 사용하여 몇 가지 테스트를 진행하여 프로젝트를 시작했습니다. 2월 14일에 비용이 매우 빨리 증가한 것을 보면, 이는 단지 테스트였습니다. 그래서 2월 15일 이후 시간 만료 시스템을 도입하여 만료 시간을 60분으로 설정했습니다. 이로써 비용이 크게 감소되었습니다. 그러나 이번 달 마지막 날에 Siri로 많은 테스트를 실시하여 가격이 다시 새로운 최고점을 기록했습니다.

이러한 패턴은 시간 만료 시스템을 통한 비용 관리가 효과적임을 시사합니다. 이 시스템을 도입한 후 비용이 일반적으로 감소하는 경향이 있습니다. 그러나 월 말에 진행된 많은 테스트 단계와 같은 집중적인 테스트는 지출의 상당한 증가로 이어질 수 있습니다.

이번 달에는 시스템에 광범위하게 작업을 하지 않고 간헐적으로 개발만을 수행했습니다. 그러나 3월 14일에 시스템을 완료한 후 몇 가지 테스트를 수행했습니다. 60분의 만료 시간 설정이 너무 길다는 것을 깨달았기 때문에 이를 10분으로 줄였습니다. 다음 날 동일한 수의 테스트를 수행한 결과, 비용이 크게 감소했습니다.

<div class="content-ad"></div>

이 데이터는 60분에서 10분으로 시간 만료 설정을 조정한 결과가 비용 효율성에 긍정적인 영향을 미쳤음을 나타냅니다.
전략의 일환으로 메시지 수를 제한하는 것이 추가 개선을 이끌어낼 수 있습니다.

![이미지](/assets/img/2024-06-22-SiriandOpenAIIntegrationAnExperimentalFirstStep_8.png)

## 개선 및 결론

- 대화 당 메시지 수 한도와 시간 초과 전략을 결합하여 비용 제어 시스템을 구현하는 것이 효과적일 수 있으며, gpt-3.5-turbo와 같은 경제적인 OpenAI 모델을 탐색함으로써 효율성이 더 증가될 수 있다는 가능성을 제시합니다.
- 어시스턴트와 Siri 간 지연 시간을 줄이는 것은 사용자 경험을 향상시키기 위한 중요한 과제로 남아 있습니다. 빠른 OpenAI 모델을 실험하거나 심지어 LLM-Studio를 통해 로컬에서 모델을 구현하는 것은 이 문제를 해결하기 위한 유망한 방향입니다. 그러나 Siri에서 바로 시간 초과를 조정할 수 없어 더 복잡한 상호작용을 만드는 능력에 제약이 있습니다.
- 시스템을 도커화하는 가능성은 아키텍처와 워크플로우를 최적화하는 새로운 기회를 제공합니다. 하나의 타당한 전략은 OpenAI에 응답을 동일한 요청에 반환할 필요 없이 사용자에게 어떤 도구를 사용해야 하는지 알려줌으로써 함수의 사용을 최소화하고, Siri Shortcuts가 해당 흐름을 인식하고 실행할 수 있도록 하는 것입니다. 이는 응답 시간을 줄일뿐만 아니라 Shortcuts와의 더 큰 유연성을 제공할 수 있습니다. 커뮤니티에서 개발된 Shortcuts를 사용할 수도 있습니다. 이 모듈식이자 분산된 접근법은 현재 버전 대비 상당한 개선을 이끌어낼 수 있습니다.