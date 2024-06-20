---
title: "윈도우에서 WSL을 통해 Ollama를 실행하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_0.png"
date: 2024-06-19 15:23
ogImage: 
  url: /assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_0.png
tag: Tech
originalTitle: "How to run Ollama in Windows via WSL"
link: "https://medium.com/@Tanzim/how-to-run-ollama-in-windows-via-wsl-8ace765cee12"
---


<img src="/assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_0.png" />

안녕하세요! 올라마는 환상적인 오픈소스 프로젝트이며 어떤 기기에서든 LLM을 실행하기 가장 쉬운 방법입니다. 안타깝게도 윈도우용 올라마는 아직 개발 중입니다. 그러나 WSL 2를 사용해 실행할 수 있습니다. vscode 내에서도 작동됩니다. Windows Subsystem for Linux (WSL) 환경에서 올라마를 실행하려면 어떻게 설정해야 하는지 자세히 알아보시려면 지금 바로 찾아보세요! 이 가이드에서는 WSL 시스템에 올라마를 설정하는 단계별 프로세스를 안내해드릴 것이며, 이를 통해 어떤 오픈소스 LLM이든 원활하게 실행할 수 있습니다.

- 가상 머신 플랫폼 및 Windows Subsystem for Linux (WSL) 활성화:
🔍 "Windows 기능 켜기/끄기" 검색

<img src="/assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_1.png" />

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_2.png" />

➡️ 가상 머신 플랫폼 및 Windows Subsystem for Linux을 켜세요.

그런 다음 다시 시작하세요.

2. 우분투 배포본 설치:
Windows 터미널을 관리자 권한으로 열고 다음 명령을 실행하여 우분투를 설치하세요.

<div class="content-ad"></div>


wsl -- install -d ubuntu


그런 다음 사용자 이름과 비밀번호를 사용하여 설정하세요. Ollama는 WSL에서만 작동합니다.

3. WSL 버전을 2로 업데이트:

Ollama는 제대로 작동하기 위해 WSL 2가 필요합니다. WSL 버전을 업데이트하려면 다음 명령을 실행하세요:


<div class="content-ad"></div>

```js
wsl --update

wsl --set-default-version 2
```

```js
wsl --set-default-version ubuntu  2
```

4. 패키지 업데이트:

관리자 권한으로 Ubuntu 배포본을 시작하고 다음을 실행하여 패키지를 업데이트하세요:

<div class="content-ad"></div>

```shell
sudo apt update && sudo apt upgrade
```

![image](/assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_3.png)

5. Ollama 설치: 이제 Ollama를 설치할 시간입니다! 다음 명령을 실행하여 Linux 환경에 Ollama를 다운로드하고 설치하십시오: (Linux에서 Ollama 다운로드)

```shell
curl https://ollama.ai/install.sh | sh
```

<div class="content-ad"></div>

이 작업은 올라마 및 해당 종속성을 다운로드하고 설정하는 데 몇 분이 걸릴 수 있습니다.

축하합니다! WSL 환경에 올라마를 성공적으로 설치했습니다. 이제 사용할 모델을 다운로드하고 실행할 준비가 되었습니다. 올라마 라이브러리에서 지원되는 모델 목록을 확인하세요. (ollama.ai)

```js
ollama run mistral
```

![이미지](/assets/img/2024-06-19-HowtorunOllamainWindowsviaWSL_4.png)

<div class="content-ad"></div>

윈도우 환경에서 사용 가능한 옵션 중 원하는 모델의 이름(예: llama2, phi, openhermes, codellama, llava, dolphin)으로 테이블 태그를 Markdown 형식으로 변경해주세요.

이 단계를 따르면 Ollama가 WSL 환경에 매끄럽게 통합되어, 다양한 머신 러닝 모델을 쉽게 탐색할 수 있게 됩니다. 즐거운 사용 경험 되세요!