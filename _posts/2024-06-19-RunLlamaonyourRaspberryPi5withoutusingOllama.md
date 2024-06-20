---
title: "Raspberry Pi 5에서 Ollama를 사용하지 않고 Llama를 실행하기"
description: ""
coverImage: "/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_0.png"
date: 2024-06-19 18:11
ogImage: 
  url: /assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_0.png
tag: Tech
originalTitle: "Run Llama on your Raspberry Pi 5 without using Ollama"
link: "https://medium.com/@wesselbraakman/run-llama-on-your-raspberry-pi-5-without-using-ollama-7ebc128ff34e"
---


그래서 저는 작년 12월에 Raspberry Pi 5 8GB를 구입한 이후로 계속해서 시도해보고 있어요. 그전에 LLM을 설치하는 많은 안내서를 찾았지만 문제에 부딪히며 쉽게 해결할 수 없었어요. 이는 LLM을 회수/구축/양자화해야 하는 원본 컴퓨터와 제 RPi5에 필요한 모든 것을 설치하지 못했기 때문에 발생한 문제의 일부입니다.

그래서 저는 여기에 내가 막혔던 부분을 정확히 지적하고 이를 어떻게 해결했는지를 써 놓은 가이드를 작성하게 되었어요.

그러므로 이것은 전적으로 제가 혼자서 완전히 해결한 가이드는 아니에요 (저는 이런 주제에 대해 전문가가 아닌 걸로 아요), 다만 누군가가 곤란해할 때 도움이 될 수 있는 가이드에요.

저는 LinkedIn에서 발견한 Marek Żelichowski의 이 가이드를 주로 사용했고, 제 기기에서 작동하는 데 필요한 단계를 추가했어요. 그는 자신의 블로그 맨 아래에 여러 사람/소스의 입력을 토대로 한 결과라고 명시하긴 했지만, 공정한 평가를 해야하며, Ollama를 요구하지 않는 저에게는 제게 도움이 된 소수의 가이드 중 하나였어요.

<div class="content-ad"></div>

인용 위치(외부 게시물 및 사이트 링크)를 제공하려고 노력했지만, 빠진 인용이 있으면 알려주시면 기쁘게 추가하겠습니다. 그럼 시작해볼까요!

# 필요한 것

- LLM('들')을 검색하고 양자화하기 위한 Windows 또는 Linux 배포로 충분한 소스 PC
- LLM을 실행할 8GB 라즈베리 파이 5
- Raspbian과 같은 미리 설치된 OS가 포함된 적어도 32GB의 메모리 카드 (제가 개인적으로 RPi에는 Ubuntu 23.04를 사용합니다)
- 소스 PC에서 RPi로 LLM을 전송하기 위해 적어도 22GB의 공간이 있는 USB 스틱

# 소스 PC 준비하기

<div class="content-ad"></div>

우리는 (Linux 기반) 소스 PC에서 시작합니다. 저는 Linux 디스트로로 PC를 재설치하거나 듀얼 부팅하는 일을 하기 귀찮아해 소유하지 않기 때문에 "WSL"을 사용하기로 결정했습니다. 이는 Windows 환경에서 Linux 디스트로를 직접 실행할 수 있는 Microsoft의 내장 기능입니다. 이미 Linux PC에서 작업하고 있는 분들은 아래 단계가 필요하지 않을 수 있습니다.

## WSL 설치 방법:

Windows PC에서 WSL을 설정하는 데 이 안내서를 사용했다는 점을 유의하세요.

먼저 PowerShell을 관리자 권한으로 실행합니다. 이를 위해 PowerShell에 마우스 오른쪽 버튼을 클릭하고 "관리자 권한으로 실행" 옵션을 선택합니다. 여러분의 기기의 보안 구성 방식에 따라 실행에 관리자 암호를 입력해야 할 수도 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_0.png" />

열리는 PowerShell 창에서 다음 명령을 실행하세요:

이 명령을 실행하면 작업에 사용할 OS로 Ubuntu가 설치됩니다. 또한 다음 명령을 사용하여 wsl을 통해 직접 설치할 수 있는 특정 Linux 배포판을 선택할 수도 있습니다.

<img src="/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_1.png" />

<div class="content-ad"></div>

다음 설치 명령에 설치하고 싶은 배포판을 선택하세요. 기본값을 사용했지만 Ubuntu 22.04를 실행하려면 다음 명령을 사용하면 됩니다.

설치가 완료되면 다음 명령을 사용하여 설치되었는지 확인할 수 있습니다.


After the installation is done, you can verify that it is installed with this command


WSL 설치 후 컴퓨터를 다시 시작하는 것이 강력히 권장됩니다. 재부팅 후 시작 메뉴에서 Linux 배포판을 찾을 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_3.png" />

이 프로그램 중 하나를 열면 Ubuntu 설치에 대한 명령 프롬프트 (CMD)가 열립니다. 이 명령을 사용하여 Llama 프로젝트를 다운로드하고 빌드하고, Raspberry Pi에서 실행할 수 있는 모델을 다운로드하고 양자화할 것입니다.

## Linux 소스 PC 설정하기

이제 Ubuntu 설치가 준비된 상태이거나 위 단계를 건너뛴 경우는 리눅스 배포판을 이미 실행 중이라면, 아래 단계를 실행하기 위해 필요한 종속성을 설치하는 시간입니다.

<div class="content-ad"></div>

먼저, 시스템이 최신 상태인지 확인하고 싶어요.

그 다음으로, 우리는 Llama.cpp 프로젝트를 환경에 클론/다운로드할 때 사용할 Git을 설치하고 싶어요.

마지막으로, 프로젝트를 만들고 LLM을 양자화하는 데 필요한 일부 도구를 설치해야 해요.

이 단계에서 많은 어려움을 겪었어요. 시스템이 2가지에 대해 불평했는데, 지금 설명할게요.

<div class="content-ad"></div>

파이프가 발견되지 않았어요. 그래서 Pip을 설치하기 위해 Python 패키지를 사용하여 apt install의 일부로 Pip을 설치해야 했어요.

이 문제로 x509 오류가 계속해서 발생했는데, "self-signed certificate in certificate chain"라는 오류가 떴어요. 자세한 내용에 대해 들어가지 않으면서 이 오류는 네트워크 구성에 문제가 있어서 해결할 수 없다는 것을 의미해요. 이 문제를 해결하기 위해 여러 가지 방법을 시도했지만 결국 해결책을 찾지 못했어요. 문제는 프록시나 방화벽 뒤에서 시도했기 때문에 구성을 올바르게 설정하는 것이 거의 불가능했을 수도 있어요. 그래서 이런 제한 사항이 없는 다른 시스템으로 전환하면서 모든 것이 완벽하게 작동했어요.

가장 중요한 것은 "python3 -m pip install" 명령을 실행할 때 "externally managed environment"에 있다는 오류가 나타났고, 작동을 위해 특정 가상 환경(venv)을 사용해야 한다는 것이었어요. 그래서 제가 그것을 사용하려고 했지만 작동하지 않았어요. 그래서 제가 한 해결책은 "외부 환경"이라고 불리는 심볼릭 링크를 제거하는 것이었어요. stackoverflow의 이 게시물에서 답변 중 한 댓글을 인용해 보면;

이 모든 문제가 해결됐으니 이제는 Pip을 통해 종속성을 설치하는 데 더 이상 문제가 없을 거에요.

<div class="content-ad"></div>

마지막으로, G++와 Build Essential을 설치해야 합니다.

## Llama 프로젝트 다운로드 및 빌드

Llama 프로젝트를 워크스페이스로 다운로드하기 위해 "git clone" 명령어를 사용할 것입니다.

다운로드가 완료되면 방금 다운로드한 폴더로 이동합니다.

<div class="content-ad"></div>

이제 우리는 모델을 실행하는 데 필요한 파일을 생성하는 프로젝트를 "만들"할 것입니다.

![이미지](/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_4.png)

이 작업이 진행 중이거나 완료된 후에, RPi5에서 실행할 모델 중 하나를 다운로드할 수 있습니다. 모델은 huggingface와 같은 원본에서 다운로드할 수 있지만, 제가 따라온 튜토리얼은 토렌트 클라이언트와 함께 사용할 수 있는 자석 링크를 사용했습니다. 저는 QBitTorrent라는 클라이언트를 사용했는데, 이는 다음과 같이 설치할 수 있습니다.

설치가 완료되면 다음 명령을 사용하여 애플리케이션을 열 수 있습니다.

<div class="content-ad"></div>

토렌트 클라이언트의 GUI가 열립니다. "링크" 아이콘을 클릭하여 자석 링크를 추가하고 다음 자석 링크를 붙여넣을 수 있습니다.

RPi5를 7B 모델로 실행해보려고 합니다 (다른 모델들은 많이 크고 많은 용량이 필요합니다). 그래서 7B 폴더와 그 하위 파일(tokenizer.checklist.chk 및 tokenizer.model)만 선택하려고 합니다.

<img src="/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_5.png" />

파일 다운로드가 완료되면 이를 "llama.cpp/models" 폴더로 복사합니다. 이를 터미널의 명령줄을 통해 하거나 파일 탐색기 GUI를 열어서 수행할 수 있습니다. 다음 명령어는 현재 폴더에서 파일 탐색기를 엽니다. 그러면 7B 폴더와 tokenizer 파일을 찾아서 llama.cpp/models 폴더에 복사할 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_6.png" />

이제 RPi5에서 실행할 수 있게 모델을 양자화하기 전에 JSON 파일을 편집해야 합니다. 이 파일에는 모델 빌드를 중단시킬 값이 포함되어 있습니다. 이 값을 파일에 포함된 이유에 대한 불확실성이 있습니다. 해당 값을 조정하면 모든 것이 원활하게 작동합니다.

llama.cpp/models/7B 폴더에서 "params.json" 파일을 찾아 엽니다. 이 파일을 편집할 때 VIM을 사용했습니다.

VIM으로 파일을 열었으면 "i"를 눌러 삽입(편집) 모드로 진입하세요. "vocab_size" 값을 -1에서 32000으로 수정합니다. 편집을 마쳤으면 편집 모드를 종료하려면 "ESC" 키를 누릅니다. 변경 내용을 저장하려면 콜론 ":"를 입력한 후 "wq"를 입력합니다. "Enter" 키를 눌러 진행하세요. 그러면 파일이 업데이트됩니다!

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_7.png)

이제 모델을 GGML FP16 형식으로 변환해야 합니다. 이 작업은 PC 성능에 따라 다소 시간이 걸릴 수 있습니다. 여기서 주목해야 할 점은 라즈베리 파이에서 작동하지 않는 부분이라는데요. 모델을 변환하기 위해 내장된 기능을 사용합니다. llama.cpp 폴더에서 이를 실행합니다(우리의 명령이 "models/"로 시작하는 이유입니다).

변환 작업이 완료되면 모델을 양자화해야 합니다. 이 큰 모델을 보다 효율적으로 작동하도록 하는 것입니다. 사용한 튜토리얼에서 인용하면:
"이는 모델에서 사용되는 모든 신경망 가중치를 float16에서 init8로 변경하여 성능이 좋지 않은 기기에서 더 간편하게 처리할 수 있게 만드는 것을 의미합니다. 더 자세히 알아보는 것을 강력히 권장합니다(필수는 아님)."

양자화를 수행하기 위해 기존 기능을 다시 사용합니다.

<div class="content-ad"></div>

양자화 후, llama.cpp 폴더에서 다음 명령을 실행하여 모델이 작동하는지 확인할 수 있습니다.

모델을 찾을 수 없다는 오류가 발생했어요.

![이미지](/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_8.png)

다행히도 명확한 원인을 찾았어요. chat.sh 스크립트가 "llama-7b" 폴더를 찾기를 기대했지만, "7B" 폴더를 다운로드했었어요. 폴더의 이름을 바꾸면 이 문제가 해결됩니다.

<div class="content-ad"></div>

이제 LLM이 작동되고, Bob이라는 챗봇도 있어서 질문을 할 수 있겠어요!

![Bob Chatbot](/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_9.png)

이제 모든 것이 작동된다는 것을 알았으니, 다음 단계는 "모델" 폴더에서 "llama-7b" 폴더를 USB 스틱에 복사하는 것입니다.

# 라즈베리 파이에 LLM 설치하기

<div class="content-ad"></div>

이제 RPi5를 부팅하고 아직 열지 않았다면 터미널을 열어주세요 (CTRL+ALT+T). 우리는 llama 프레임워크를 Pi에도 필요하기 때문에 원본 PC에서 한 것과 같은 몇 가지 명령을 실행해야 합니다. 먼저 시스템이 최신 상태인지 확인하고 프로젝트를 복제하기 위해 Git이 설치되어 있는지 확인해주세요.

다음으로, 우리는 원본 PC에서 했던 것과 같이 llama.cpp 프로젝트를 복제합니다.

라이센스에 설치한 것과 같은 모듈을 설치합니다. 노트북에서 필요했던 해결책을 기억해 주세요. RPi5에서도 필요할 수 있기 때문입니다.

이제 G++와 Build Essential이 설치되어 있는지 확인해주세요.

<div class="content-ad"></div>

llama.cpp 폴더로 이동해서 llama 프로젝트를 만들어보세요

다음으로 외부 드라이브에서 내용을 llama.cpp 프로젝트의 /models/ 폴더로 이동해보세요. 외부 하드 드라이브가 제대로 감지되거나 마운트되지 않아 문제가 생겼는데요. 다행히도 인터넷의 도움을 받아 문제를 해결했어요.

Stackoverflow의 이 게시물을 참고하여 다음 명령어를 얻었어요.

이 명령어는 사용 가능한 디스크를 나열합니다. 여기서 외부 하드 드라이브나 USB 스틱을 찾을 수 있어요

<div class="content-ad"></div>

예를 들어, 외장 드라이브가 /dev/sdxn에 발견되었다면, 명령은 다음과 같을 것입니다.

마운트가 성공적으로 완료된 후, 외장 드라이브의 내용은 /mnt 폴더에서 찾을 수 있습니다. 명령줄 대신 파일 탐색기를 사용하여 파일을 시각적으로 복사하려면, /mnt 폴더로 이동하여 다음을 실행하세요.

이제 해야 할 일은 원본 PC에서 한 것과 정확히 같은 방식으로 모델을 실행하는 것뿐입니다. llama.cpp 폴더 안에서 다음 명령을 실행하세요

![image](/assets/img/2024-06-19-RunLlamaonyourRaspberryPi5withoutusingOllama_10.png)

<div class="content-ad"></div>

위에서 말씀드린 대로 Raspberry Pi 5에서 자체 AI 챗봇을 작동시키고 있습니다! 라마는 RPi5에서 매끄럽게 작동하지는 않지만, 이렇게 작은 장치에서 이렇게 큰 모델이 효율적으로 작동할 수 있다는 점이 매우 멋지다는 것을 알려드리고 싶습니다. 제가 본 스크린샷을 보면이 모델이 가지고 있는 "지식"에 대해 완전히 확신을 갖지 못하겠지만요. 그럼에도 불구하고, 우리가 질문을 하면 응답을 생성해주는 점은 아주 멋집니다. 이것이 바로 생성적 AI가 하는 일이라고 볼 수 있습니다.

다시 말씀드리지만, 이 블로그/튜토리얼에서 다루는 주제에 대해 전문가는 아닙니다. 초기 크레딧은 Marek Żelichowski에게 드리며 그의 블로그/튜토리얼에서 한 작업에 있습니다. 저의 목표는 온라인에서 찾을 수 있는 일부 튜토리얼을 따를 때 어려움을 겪었던 일부 단계를 명확하게 설명하는 것이었습니다.