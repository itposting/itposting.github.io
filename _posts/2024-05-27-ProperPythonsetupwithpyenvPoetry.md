---
title: "적절한 Python 설정 pyenv와 Poetry"
description: ""
coverImage: "/assets/img/2024-05-27-ProperPythonsetupwithpyenvPoetry_0.png"
date: 2024-05-27 13:52
ogImage:
  url: /assets/img/2024-05-27-ProperPythonsetupwithpyenvPoetry_0.png
tag: Tech
originalTitle: "Proper Python setup with pyenv , Poetry"
link: "https://medium.com/@douwevandermeij/proper-python-setup-with-pyenv-poetry-4d8baea329a8"
---

많은 경우, 사람들이 Python의 로컬(개발) 환경 설정에서 고민하는 것을 자주 볼 수 있어요. 솔직히 말하자면, 쉽지 않아요. 그러나 동시에 안정성과 문제 해결 능력을 위해 중요하답니다.

이 글은 로컬 Python 환경을 제대로 설정하는 방법을 설명하는 또 다른 글이 될 거예요. 우리의 경우에는 pyenv와 Poetry를 사용할 거에요. 이미 이 링크들에는 필요한 모든 정보가 포함되어 있지만, 정보가 너무 많아 보일 수 있어요. 이 글에서는 평균적인 Python 애플리케이션을 위한 로컬 개발 환경 설정에만 초점을 맞추려고 해요.

![이미지](/assets/img/2024-05-27-ProperPythonsetupwithpyenvPoetry_0.png)

# pyenv

<div class="content-ad"></div>

## pyenv 설치

첫 번째 단계는 pyenv를 설치하는 것입니다. 이는 각기 다른 운영 체제에 특정하므로 아래 문서의 지침을 따라주시기 바랍니다: [https://github.com/pyenv/pyenv?tab=readme-ov-file#installation](https://github.com/pyenv/pyenv?tab=readme-ov-file#installation)

리눅스 배포판을 사용 중이시라면, 다음을 실행해주십시오:

```js
curl https://pyenv.run | bash
```

<div class="content-ad"></div>

pyenv은 ~/.pyenv 위치에 설치됩니다.

pyenv를 로드 경로에 추가해야하는 몇 가지 추가 단계가 나타날 것입니다. 이 단계도 실행하세요. 저의 경우에는 ZSH를 사용하기 때문에 이러한 줄을 ~/.zshrc에 추가해야 합니다. 이 문서에 ZSH를 설치하는 방법은 포함되어 있지 않습니다. 도움이 필요하면 언제든지 연락해 주세요.

이제 터미널을 다시 열어주세요.

새 터미널에서 pyenv를 실행하여 테스트해보세요. 명령어 목록이 표시된다면 사용할 준비가 된 것입니다.

<div class="content-ad"></div>

## Python 설치

우리가 먼저 해야 할 일은 터미널에서 기본적으로 활성화된 Python 버전을 확인하는 것입니다. 제 예시에서는 Raspberry Pi OS 12.4 (Bookworm)를 실행하는 Raspberry Pi 5 (8GB)에서 작업하고 있습니다.

```js
[~]$ which python
/usr/bin/python
```

이것은 OS와 함께 제공되는 표준 Python입니다.

<div class="content-ad"></div>

다음으로 pyenv에서 Python 버전을 확인합니다:

```js
[~]$ pyenv versions
* system (set by /home/vandermeij/.pyenv/version)
```

여기에는 Python 버전이 없다는 것을 알려줍니다. 지금은 아무것도 설치되지 않았습니다. 좋은 일이죠.

pyenv를 통해 Python 버전을 설치하려면 몇 가지 의존성을 설치해야 합니다. 여러분의 운영 체제에 해당하는 의존성을 설치하려면 다음 문서를 참조해주세요: https://github.com/pyenv/pyenv/wiki#suggested-build-environment

<div class="content-ad"></div>

우리 상황에서:

```bash
sudo apt update; sudo apt install build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev curl \
libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```

이제 Python을 설치할 수 있습니다. 예를들어, 버전 3.11:

```bash
[~]$ pyenv install 3.11
Python-3.11.7.tar.xz 다운로드 중...
-> https://www.python.org/ftp/python/3.11.7/Python-3.11.7.tar.xz
Python-3.11.7 설치 중...
```

<div class="content-ad"></div>

다음은 pyenv에서 Python 버전을 다시 확인해 봅시다:

```js
[~]$ pyenv versions
* system (set by /home/vandermeij/.pyenv/version)
  3.11.7
```

여기서 3.11.7 버전이 설치되어 있는 것을 확인할 수 있습니다.

이제 활성화하고 버전을 다시 확인해 봅시다:

<div class="content-ad"></div>


[~]$ pyenv global 3.11.7
[~]$ pyenv versions
system

- 3.11.7 (set by /home/vandermeij/.pyenv/version)


지금은 Python 3.11.7이 활성화된 Python 버전으로, 전역적이며 시스템 전역으로 적용되었음을 확인했습니다.

다시 한 번 기본 Python 버전을 확인해보세요:


[~]$ which python
/home/vandermeij/.pyenv/shims/python


<div class="content-ad"></div>

위치가 /usr/bin/python과 다르다는 것을 주목하세요. 이제 pyenv가 유지 관리하는 심볼릭 링크를 가리킵니다. 이건 좋은 일이에요! 이제 penv versions로 확인할 수 있듯이 선택한 Python 버전을 가리킵니다.

시스템 Python으로 다시 변경하면, 이 변경 사항은 OS에서의 Python 버전을 관리하는 pyenv versions에만 반영됩니다.

```bash
[~]$ pyenv global system
[~]$ pyenv versions
* system (set by /home/vandermeij/.pyenv/version)
  3.11.7
[~]$ which python
/home/vandermeij/.pyenv/shims/python
```

## 사용법

<div class="content-ad"></div>

저는 주로 pyenv를 주요 Python 배포 업체로 사용합니다. 기본 시스템 Python을 거의 사용하지 않아요. 저의 컴퓨터에서는 이렇게 나와요:

```js
[~]$ pyenv versions
  system
* 3.11.7 (set by /home/vandermeij/.pyenv/version)
```

때로는 프로젝트에서 다른 Python 버전을 사용하고 싶을 수도 있어요, 예를 들어 Python 3.12를 사용하고 싶다고 가정해봅시다. 전역 Python 버전을 변경하는 것 외에도 pyenv를 통해 로컬 버전을 사용할 수도 있어요.

testapp이라는 작은 프로젝트를 만든다고 가정해봅시다.

<div class="content-ad"></div>

```js
[~]$ mkdir testapp
[~]$ cd testapp
```

다음으로 pyenv를 사용하여 로컬 Python 버전을 설정합니다:

```js
[~/testapp]$ pyenv local 3.12
pyenv: version `3.12' not installed
```

버전 3.12가 아직 설치되지 않았다고 알려줍니다.

<div class="content-ad"></div>

그럼 설치해보겠습니다:

```js
[~/testapp]$ pyenv install 3.12
Python-3.12.1.tar.xz를 다운로드 중...
-> https://www.python.org/ftp/python/3.12.1/Python-3.12.1.tar.xz
Python-3.12.1을 설치 중...
```

다시 시도해보세요:

```js
[~/testapp]$ pyenv local 3.12
[~/testapp]$ pyenv versions
  system
  3.11.7
* 3.12.1 (설정 위치: /home/vandermeij/testapp/.python-version)
```

<div class="content-ad"></div>

파이썬 3.12.1이 활성화되어 있는 것을 확인할 수 있어요. 이는 이 폴더 내의 .python-version이라는 로컬 파일로 인해 터미널에서 특정 버전을 로드하도록 pyenv에 알려주기 때문이에요.

서브 폴더를 제외한 다른 폴더로 이동하면 활성화된 파이썬 버전이 재설정됩니다:

```js
[~]$ pyenv versions
  system
* 3.11.7 (set by /home/vandermeij/.pyenv/version)
  3.12.1
```

pyenv를 사용하면 로컬 또는 전역 파이썬 버전에 관해 항상 사용 중인 파이썬 버전을 알 수 있고 완전한 제어권을 가질 수 있어요.

<div class="content-ad"></div>

다음 적절한 개발 환경 설정 단계는 외부 라이브러리/의존성을 설치하기 위해 가상 환경을 사용하는 것입니다. 이렇게 함으로써 a) 우리의 pyenv Python 배포를 깨끗하게 유지할 수 있고, b) 다른 프로젝트와 충돌하지 않습니다. 이에 대해 저는 Poetry를 추천합니다.

# Poetry

## 설치

새로 설치한 pyenv Python 버전에 설치할 유일한 외부 라이브러리는 Poetry입니다.

<div class="content-ad"></div>

```sh
[~]$ pip install poetry
[~]$ poetry -V
Poetry (version 1.7.1)
```

이 작업을 각 Python 버전마다 수행하십시오.

```sh
[~/testapp]$ poetry -V
pyenv: poetry: command not found
```

## 사용법

<div class="content-ad"></div>

새 프로젝트를 시작하려면 poetry init -q를 실행해 보세요. 이렇게 하면 pyproject.toml 파일이 생성됩니다.

이제 의존성을 추가할 수 있게 됩니다. 하지만 그 전에 가상 환경을 활성화해야 합니다. poetry shell을 실행하세요:

```js
[~/testapp]$ poetry shell
Creating virtualenv testapp-b6lGsqOc-py3.12 in /home/vandermeij/.cache/pypoetry/virtualenvs
Spawning shell within /home/vandermeij/.cache/pypoetry/virtualenvs/testapp-b6lGsqOc-py3.12
[~/testapp]$ emulate bash -c '. /home/vandermeij/.cache/pypoetry/virtualenvs/testapp-b6lGsqOc-py3.12/bin/activate'
(testapp-py3.12) [~/testapp]$
```

이렇게 하면 가상 환경 (virtualenv)이 생성되고, 이미 존재하지 않는 경우 새 쉘이 생성되며 해당 가상 환경이 활성화됩니다. 프롬프트(PS1)에서 확인할 수 있습니다: (testapp-py3.12) [~/testapp]$.

<div class="content-ad"></div>

현재 which python을 실행하면 가상 환경에 연결된 다른 심볼릭 링크를 볼 수 있습니다:

```js
(testapp-py3.12) [~/testapp]$ which python
/home/vandermeij/.cache/pypoetry/virtualenvs/testapp-b6lGsqOc-py3.12/bin/python
```

확인하세요. pyenv로 활성화된 Python 버전과 동일하지만 이제 가상 환경으로 묶여 있습니다.

```js
(testapp-py3.12) [~/testapp]$ python -V
Python 3.12.1
```

<div class="content-ad"></div>

이 가상 환경에서는 종속 항목을 설치할 것입니다.

이미 pyproject.toml 파일이 있는 경우, 단지 그것을 포함하는 git 저장소를 복제했기 때문에, 프로젝트 자체가 파이썬 라이브러리인지 여부에 따라 poetry install 또는 poetry install --no-root를 실행할 수 있습니다. 우리의 경우, testapp은 파이썬 라이브러리가 아닙니다:

```js
(testapp-py3.12) [~/testapp]$ poetry install --no-root
잠금 파일에서 종속성을 설치 중
```

이제 FastAPI와 같은 새로운 종속성을 추가할 수 있습니다. poetry add fastapi를 사용하거나 pyproject.toml 파일을 수동으로 편집할 수 있습니다. 일반적으로 후자를 사용합니다.

<div class="content-ad"></div>

패스트API를 수동으로 추가하겠습니다. 좋아하는 편집기로 pyproject.toml 파일을 열고 다음 줄을 변경하세요 (fastapi = "\*"):


[tool.poetry.dependencies]
python = "^3.12"
fastapi = "*"


이제 Poetry 업데이트를 실행해보세요:


(testapp-py3.12) [~/testapp]$ poetry update
의존성 업데이트 중
의존성 해결 중... (6.6초)

패키지 작업: 9개 설치, 0개 업데이트, 0개 제거

  • idna (3.6) 설치 중
  • sniffio (1.3.0) 설치 중
  • typing-extensions (4.9.0) 설치 중
  • annotated-types (0.6.0) 설치 중
  • anyio (4.2.0) 설치 중
  • pydantic-core (2.14.6) 설치 중
  • pydantic (2.5.3) 설치 중
  • starlette (0.35.1) 설치 중
  • fastapi (0.109.0) 설치 중

잠금 파일 작성 완료


<div class="content-ad"></div>

가상 환경이 FastAPI 및 해당 종속성들로 풍부해졌어요. 보너스로, Poetry가 poetry.lock 파일을 생성했는데, 이 파일에는 설치된 각 (하위)종속성의 특정 버전이 포함되어 있어요.

다음 파일을 git에 추가해주세요:

- .python-version
- pyproject.toml
- poetry.lock

이제 pyenv와 Poetry를 사용하여 깔끔하고 적절한 Python 개발 환경을 구축했어요.

<div class="content-ad"></div>

모든 가상 환경의 전체 개요를 보려면 poetry env list를 실행하세요:

```js
(testapp-py3.12) [~/testapp]$ poetry env list
testapp-b6lGsqOc-py3.12 (Activated)
```

전용 쉘을 종료하려면 CTRL+D를 누르거나 exit를 입력하세요:

```js
(testapp-py3.12) [~/testapp]$ exit
[~/testapp]$
```

<div class="content-ad"></div>

# 결론

pyenv 및 Poetry는 로컬 개발 환경을 위한 강력한 도구를 제공합니다. 이를 사용하는 것을 강력히 권장합니다. 저는 그것을 사용하여 매우 만족하고 있습니다.

앞서 간단히 언급했듯이 중요 파일을 저장하기 위해 git을 사용해주세요. 또한, 어플리케이션을 설치할 때는 어디에서든 poetry.lock 파일을 사용해주세요. 예를 들어, Docker에서.

이 글에 관한 질문, 문의 또는 의견이 있으시다면 언제든지 연락해주세요. 도움이 되겠습니다. 여기나 제 개인 웹사이트에서 저에게 연락을 주셔도 됩니다.
