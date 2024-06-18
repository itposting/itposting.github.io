---
title: "LLM Unix Linux 도구상자의 궁극적인 스위스 아미 나이프"
description: ""
coverImage: "/assets/img/2024-06-19-llmTheUltimateSwissArmyKnifeofUnixLinuxToolbox_0.png"
date: 2024-06-19 03:35
ogImage: 
  url: /assets/img/2024-06-19-llmTheUltimateSwissArmyKnifeofUnixLinuxToolbox_0.png
tag: Tech
originalTitle: "llm: The Ultimate Swiss Army Knife of Unix Linux Toolbox"
link: "https://medium.com/@kinshuksarabhai/llm-the-ultimate-swiss-army-knife-of-unix-linux-toolbox-be05ba14a4b7"
---


## 멋진 도구로 명령줄 작업을 더욱 효율적으로!

최근에 Simon Willison이 만든 llm 명령줄 도구를 발견하게 되었습니다.

그는 최근에 이 도구를 어떻게 사용하는지에 대해 이야기했는데, 이를 일상적으로 사용하는 다른 명령줄 도구와 함께 어떻게 활용하는지를 보여주었습니다.

## 이 도구는 무엇을 할까요?

<div class="content-ad"></div>

간단히 말해서, 이 도구를 사용하면 워크플로우 중간에 LLM (대형 언어 모델)을 호출하고 강력한 방법으로 출력을 변환할 수 있습니다.

빠른 예시:

Github에서 더 많은 예시와 데모를 찾을 수 있습니다.

## 왜 이것이 중요한가요?

<div class="content-ad"></div>

여기서 인용하자면:

기존 애플리케이션 및 업무에 AI를 통합하는 것은 도전적입니다. 예를 들어, Github Copilot과 같은 솔루션이 이 기능을 지원하려면 각 IDE에 플러그인이 필요합니다. ChatGPT를 사용하는 동안에도 LLM 응답이 필요할 때마다 파일을 드래그 앤 드롭하거나 복사하여 붙여넣어야 하므로 데이터를 이동하는 데 더 많은 노력과 시간이 필요합니다.

## 왜 이것이 뛰어난 아이디어인가요?

이 도구는 Unix 철학에서의 주요 아이디어를 상쾌하게 부활시키는 것입니다.

<div class="content-ad"></div>

- 하나의 기능을 잘 수행하는 프로그램을 작성하세요.
- 프로그램들이 함께 작동할 수 있도록 작성하세요.
- 모든 프로그램들이 텍스트 스트림을 처리하도록 작성하세요. 왜냐하면 그것이 보편적인 인터페이스이기 때문입니다.

마지막으로, 위 세 번째 점은 LLMs이 이 목적에 적합하게 만들어진 이유입니다. 왜냐하면 그들은 프롬프트에 기반하여 하나의 텍스트를 다른 텍스트로 효과적으로 변환하는 데 우수하기 때문입니다.

좋은 상호 운용성을 위해서, 각 프로그램에 깔끔한 입출력 인터페이스가 있다면 좋고, 다른 프로그램의 출력을 표준 입력(stdin)을 통해 입력으로 받아 들이게 하는 것은 점 [2]로부터 따라온다. 

## 키 기능의 빠른 개요

<div class="content-ad"></div>

- 플러그인을 통한 로컬 및 원격 모델 지원: Ollama와 같은 도구를 통해 LLMs의 로컬 배포로 비용을 관리하세요.
- 템플릿 지원: Fabric과 같은 대체 도구는 "패턴"이라고 하는 템플릿을 커맨드 라인 도구로 제공하기 시작했습니다.

전체 토크를 YouTube에서 시청하는 것을 적극 추천합니다.