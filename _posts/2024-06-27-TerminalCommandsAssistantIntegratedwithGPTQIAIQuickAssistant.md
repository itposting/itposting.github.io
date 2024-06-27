---
title: "GPT와 통합된 터미널 명령어 도우미  QIAI Quick Assistant"
description: ""
coverImage: "/assets/img/2024-06-27-TerminalCommandsAssistantIntegratedwithGPTQIAIQuickAssistant_0.png"
date: 2024-06-27 18:36
ogImage: 
  url: /assets/img/2024-06-27-TerminalCommandsAssistantIntegratedwithGPTQIAIQuickAssistant_0.png
tag: Tech
originalTitle: "Terminal Commands Assistant Integrated with GPT — QIAI (Quick Assistant)"
link: "https://medium.com/@rifafaruqi/terminal-commands-assistant-integrated-with-gpt-qiai-quick-assistant-fb249a686fb8"
---


프로젝트를 진행할 때 종종 터미널에서 명령어를 잊어버리는 경우가 있습니다. 예를 들어 패키지를 설치하는 방법, 옵션을 사용하는 방법 또는 grep 명령어를 사용하여 출력을 필터링하는 방법 등을 잊어버릴 수 있습니다.

가끔은 이게 조금 귀찮을 때가 있습니다. 우리는 구글 검색을 해야 하거나 스크립트 설명서를 살펴보거나 chatGPT에 질문해야 할 수도 있습니다. 그냥 우리가 필요한 것은 명령어를 잊어버렸기 때문에 필요한 짧은 터미널 명령어일지라도 말이죠.

간단하게 만들기 위해, GPT 3.5 API와 통합되어 사용하기 매우 쉬운 스크립트를 만들었습니다. 필요한 목적에 딱 맞는 출력을 생산하는 이 스크립트의 이름은 QIAI(Quick Assistant)입니다.

<div class="content-ad"></div>

# chatGPT vs QIAI

chatGPT와 QIAI를 사용하여 특정 명령어를 찾는 방법의 차이점은 여기 있습니다.

![TerminalCommands](/assets/img/2024-06-27-TerminalCommandsAssistantIntegratedwithGPTQIAIQuickAssistant_1.png)

chatGPT를 사용할 때는 우리가 사용하는 OS, 원하는 출력 형식 등 여러 가지를 조정해야 합니다. 그렇지 않으면 chatGPT는 아주, 아주 긴 답변을 제공하고 시간이 많이 걸릴 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-27-TerminalCommandsAssistantIntegratedwithGPTQIAIQuickAssistant_2.png" />

QIAI를 사용하면 더 효율적이고 결과물이 더 타깃팅되어 생성됩니다. 그 이유는 QIAI(v1.1.1)가 다음과 같은 기능을 제공하기 때문입니다:
- OS별 Answers: 사용 중인 운영 체제(리눅스, macOS, Windows)에 특화된 답변을 제공합니다. (Windows는 아직 테스트되지 않음)
- 토큰 저장: 효율성을 높이기 위해 토큰 사용량을 줄인 최적화된 프롬프트를 제공합니다. (요청 당 평균 150토큰)

OpenAI GPT API는 상당히 저렴합니다. QIAI에 API를 사용하면 큰 비용이 들지 않습니다. QIAI가 사용하는 gpt 3.5의 비용은 다음과 같습니다.

<img src="/assets/img/2024-06-27-TerminalCommandsAssistantIntegratedwithGPTQIAIQuickAssistant_3.png" />

<div class="content-ad"></div>

한 번의 요청 당 QIAI는 평균 150개의 토큰을 사용합니다. 그러니 단지 $1 으로 요청을 1만 3천 번 호출할 수 있어요. 꽤 저렴하죠, 한 번 시도해보는 것이 괜찮아요.

# QIAI를 설치하는 방법은?

- npm을 전역으로 사용하여 쉽게 설치할 수 있어요.

```js
npm install -g qiai
```

<div class="content-ad"></div>

- 열린 AI API 키를 설정하여 GPT에 액세스할 수 있도록 설정하세요:

```js
qiai --set-openai-api-key 당신의-API-키
```

- 질문을 하려면 다음을 실행하세요:

```js
qiai -q "당신의 질문"
```

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*NG3Cd5ZqCnYRm0W_ra6Org.gif)

읽어 주셔서 감사합니다 :) 
협력하고 싶거나 QIAI에 더 많은 기능이 필요하면 Github 레포지토리에서 이슈를 작성해주세요.

Github 링크: https://github.com/riparuk/qiai
