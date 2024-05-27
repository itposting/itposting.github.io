---
title: "각 AI에게 맞는 Python"
description: ""
coverImage: "/assets/img/2024-05-27-ToeachAIitsownPython_0.png"
date: 2024-05-27 13:44
ogImage:
  url: /assets/img/2024-05-27-ToeachAIitsownPython_0.png
tag: Tech
originalTitle: "To each AI its own Python"
link: "https://medium.com/generative-ai/to-each-ai-its-own-python-4294596886c6"
---

![2024-05-27-ToeachAIitsownPython_0](/assets/img/2024-05-27-ToeachAIitsownPython_0.png)

약간 까다로운 주제로 보일 수 있지만 믿거나 말거나, AI 애플리케이션을 구축하는 데 발생하는 문제의 90%는 Python 종속성 때문이죠.

어제까지 잘 작동하던 AI 앱을 시험했는데 갑자기 모든 게 망가졌다고 합니다! 원인을 찾고 코드를 디버깅하려고 애쓰지만... 아마도 문제는 단순히 파이썬 라이브러리 업데이트 때문인 것 같아요!

5가지 다른 파이썬 버전을 설치하지 않고도 문제를 해결할 수 있는 방법을 찾았습니다. 이제 한 번에 모든 문제를 해결할 수 있어요.

<div class="content-ad"></div>

# 파이썬 임베디드 만나보기

임베디드 배포는 최소한의 파이썬 환경이 포함된 ZIP 파일입니다. 이는 최종 사용자가 직접 액세스하는 대신 다른 응용 프로그램의 일부로 작동하기 위해 설계되었습니다.

이 조금 단조로운 ZIP 파일에는 pip가 없기 때문에 의존성을 설치할 수 없습니다.

하지만 우리가 pip를 사용할 수 있다고 가정해 봅시다... 여전히 소스에서 패키지를 빌드할 수 없습니다: 이미 컴파일된 휠 패키지를 얻으면 문제가 전혀 없지만 설치에 빌드가 필요한 경우에는 할 수 없습니다.

<div class="content-ad"></div>

하지만 이 문제에 대한 해결책이 있습니다.

# 실제 시나리오

내 게시물 중 몇 가지를 따라가보면, 거의 항상 Python 3.10을 사용한다는 것을 알 수 있을 것입니다. 내가 그것에 집착하는 것이 아닌... 단지 몇 주 전까지는 sentence-piece 라이브러리가 더 높은 Python 버전을 사용하려고 할 때마다 망가졌기 때문입니다.

동시에, 웹 서버를 구축하는 동안 Protobuf가 모든 API 호출을 망가뜨리는 바람에 Streamlit 버전 1.27.0 이전을 사용해야 했습니다.

<div class="content-ad"></div>

그럼 어떻게 해야 할까요? Windows 기계에 여러 Python 버전을 설치하는 것은 Linux/Mac OS보다 조금 까다로울 수 있습니다. PATH에 추가해야 하며, 이는 명령어로 작업하는 데 영향을 줄 것입니다.

해결책은 적어도 두 가지가 있습니다.

# 1 Python을 독립적으로 사용

컴파일해야 할 패키지가 없다는 것을 알면 이 옵션이 가장 안전합니다. 공식 ZIP 파일을 추출하고, 약간의 해킹을 한 후에 작업이 끝납니다.

<div class="content-ad"></div>

예시: OpenAI 호환 API에 연결되는 Streamlit 앱을 만들어보세요.

이 시나리오에서는 최신 Streamlit 버전(1.34.0)을 사용하고자 합니다. 이 버전은 완전한 채팅 인터페이스 지원, 텍스트 스트리머 및 새로운 스타일 관리 기능을 제공합니다. 이를 위해서는 Python 3.11+이 필요합니다.

브랜드 네임 폴더(저는 pythontests라고 이름 짓겠습니다)를 생성하고, 공식 페이지에서 Python 3.11.7 Embedded를 다운로드하세요. 제 시스템은 64비트 미니PC이므로, 64비트용 ZIP 아카이브를 다운로드할 것입니다.

![이미지](/assets/img/2024-05-27-ToeachAIitsownPython_1.png)

<div class="content-ad"></div>

지금 ZIP 파일을 python311이라는 하위 폴더로 푸실 수 있어요.

만약 Windows 터미널을 사용 중이시라면, Windows 11에 있는 것처럼 터미널 창에서 아카이브를 푸실 수도 있어요:

```js
Expand-Archive -Force .\python-3.11.7-embed-amd64.zip .\python311
```

이제 새로운 Python 인터프리터를 바로 사용하실 수 있어요! pythontests 폴더에서 터미널을 열고 아래 명령어를 실행하면 됩니다:

<div class="content-ad"></div>


.\python311\python.exe


![ToeachAIitsownPython_2](/assets/img/2024-05-27-ToeachAIitsownPython_2.png)

This portable version cannot install pip dependencies. Try and you will see an annoying message:

![ToeachAIitsownPython_3](/assets/img/2024-05-27-ToeachAIitsownPython_3.png)



<div class="content-ad"></div>

## 내장 Python에 pip를 설치하는 것은 쉽습니다. 먼저 새롭게 추출한 python311 디렉토리 내부의 python311._pth 파일을 편집해야 합니다.

![이미지](/assets/img/2024-05-27-ToeachAIitsownPython_4.png)

그런 다음 텍스트 파일 맨 위에 Lib/site-packages를 추가하고 site를 import하는 마지막 줄의 주석을 해제해야 합니다.

![이미지](/assets/img/2024-05-27-ToeachAIitsownPython_5.png)

<div class="content-ad"></div>

이제 python311 폴더 안으로 이동하여 터미널에서 아래 curl 명령어를 실행하여 get-pip.py 파일을 설치하세요. 이 파일은 임베디드 파이썬에 pip 지원을 추가하는 데 필요합니다.

```js
cd .\python311\

curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
```

마지막으로 python311 폴더에서 python.exe get-pip.py를 실행하세요.

지금은 pip 패키지를 설치하는 것이 평소와 같습니다. 임베디드 Python 폴더에서 Python 실행 파일을 사용하는지 확실하게 확인하세요.

<div class="content-ad"></div>

예를 들어:


# 메인 프로젝트 디렉토리인 pythontests 안에서
.\python311\python.exe -m pip install streamlit==1.34.0

# python311 디렉토리에서
python.exe -m pip install openai


참고: 여기서는 아주 잘 작동하지만 여전히 문제가 있습니다. 미리 빌드된 휠을 제공하지 않는 종류의 패키지를 설치할 수 없습니다. 예를 들어, 저는 llama-cpp-python의 팬인데, 최신 버전 0.2.75는 미리 빌드된 휠이 제공되지 않습니다.

어떻게 사용해야 하나요?

<div class="content-ad"></div>

파이썬 프로젝트를 함께 보내려면 동료나 친구들에게 venv을 전달할 수 없습니다. 장치된 Python 디렉토리에 종속성을 설치하면 상대 경로로 종속성을 유지하며... 주요 폴더를 이동하더라도 아무것도 깨지지 않습니다.

![image](/assets/img/2024-05-27-ToeachAIitsownPython_6.png)

## 2. Embedded Python 사용하여 가상 환경 만들기

개인적으로 생각해보면, 이 두 번째 옵션이 적어도 로컬 프로토타이핑에 있어서 선호되는 옵션입니다. 기본적으로 장치된 Python을 사용하여 선택한 Python 버전으로 가상 환경을 만드는 방법입니다.

<div class="content-ad"></div>

내 세팅을 봐볼까요:

- 미니 PC에는 Python 3.10이 설치되어 있어요.
- 방금 Python311 버전을 만들었어요.

만약 Python 3.12를 사용하는 가상 환경이 필요하다면 어떻게 하면 될까요?

쉽죠!! 여기에서 Python 3.12를 위한 임베디드 Python을 다운로드합시다. ZIP 파일 다운로드를 위해 동일한 pythontests 디렉토리를 사용해볼까요? 터미널에서도 같은 작업을 할 수 있어요.

<div class="content-ad"></div>


wget https://www.python.org/ftp/python/3.12.2/python-3.12.2-embed-amd64.zip -OutFile python-3.12.2-embed-amd64.zip


터미널에서 ZIP 파일을 새 폴더로 압축 해제할 수도 있어요:


Expand-Archive -Force .\python-3.12.2-embed-amd64.zip .\python312


지금은 우리의 테스트 폴더에 pip 패키지와 이미 몇 개의 다른 패키지(streamlit, openai, llama-cpp-python)가 설치된 python311과 아직 pip조차 지원하지 않는 새로운 휴대용 Python이 있어요...



<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-ToeachAIitsownPython_7.png)

그리고 가상 환경을 지원하지 않습니다!

그래서 첫 번째 단계는 python312가 pip 패키지를 다운로드할 수 있는지 확인하는 것입니다. python312 디렉토리로 이동하고 python312._pth를 이전과 동일하게 변경하십시오.

![이미지](/assets/img/2024-05-27-ToeachAIitsownPython_8.png)

<div class="content-ad"></div>

터미널 창 안에서 python312 디렉토리 내에서 유명한 get-pip.py를 다운로드하고 명령을 실행합니다.

```js
cd .\python312\

curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

.\python.exe .\get-pip.py
```

## 휴대용 Python 내에 virtualenv 설치하기

내장된 Python에는 venv 도구가 필요합니다. 전통적인 방식으로 Python을 설치하면 이미 이 도구가 함께 제공됩니다.

<div class="content-ad"></div>

저희 경우에는 해당하는 기능이 없지만 간단히 다음과 같이 할 수 있어요.

```js
.\python.exe -m pip install virtualenv
```

휴대용 파이썬으로 가상 환경 생성하기

이제 이 단계에 주의해야 해요. python312로 venv를 생성하려면 가상 환경을 만들 폴더의 메인 폴더에 있어야 해요. 가상 환경을 main directory인 pythontests 폴더 안에 만들고 싶다고 가정해봅시다.

<div class="content-ad"></div>

터미널에서 프로젝트 폴더를 열고 다음을 실행합니다:

```js
.\python312\python.exe -m virtualenv venv
```

간단히 활성화하려고 시도해보면 작동 중인 것을 확인할 수 있습니다:

```js
venv\Scripts\activate
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-ToeachAIitsownPython_9.png)

파이썬 버전 확인을 위해 다음 명령어를 실행하세요:

```bash
.\venv\Scripts\python.exe --version
Python 3.12.2
```

# 결론



<div class="content-ad"></div>

파이썬으로 작업하는 것은 즐겁고 항상 새로운 모험이에요. 이 프로그래밍 언어는 놀라울 만큼 쉽고 인공 지능 애플리케이션을 만드는 데 매우 편리해요.

간단한 해킹을 사용하여 의존성과 설치와 같은 문제조차 해결할 수 있는 것이 놀라울 정도에요. 직접 시도해 보세요!

이 실용적인 기사를 즐겁게 읽었기를 바라요. 이 이야기가 가치 있는 정보를 제공했고 조금이라도 지원하고 싶으면:

- 이 이야기에 많이 박수를 보내주세요
- 나중에 찾기 쉽도록 기억해야 할 부분을 강조해주세요(나중에 찾기 쉽고 훌륭한 기사 작성에 용이해요)
- 여기를 클릭하여 자신만의 AI 만드는 방법 배우기, 이 무료 eBook 다운로드 받기
- 링크를 통해 Medium 회원 가입하기($5/월로 무제한 Medium 이야기 읽기)
- Medium에서 저를 팔로우하기
- 내 최신 기사 읽기 https://medium.com/@fabio.matricardi

<div class="content-ad"></div>

더 많은 내용을 보시려면 몇 가지 아이디어가 있습니다:

![Read More](/assets/img/2024-05-27-ToeachAIitsownPython_10.png)

이 이야기는 Generative AI에서 발행되었습니다. LinkedIn에서 연락을 유지하고 Zeniteq를 팔로우하여 최신 AI 이야기를 계속해서 만나보세요.

최신 뉴스 및 생성 AI에 대한 업데이트를 받으시려면 뉴스레터를 구독해주세요. 함께 AI의 미래를 함께 만들어봅시다!

<div class="content-ad"></div>

![2024-05-27-ToeachAIitsownPython_11.png](/assets/img/2024-05-27-ToeachAIitsownPython_11.png)

