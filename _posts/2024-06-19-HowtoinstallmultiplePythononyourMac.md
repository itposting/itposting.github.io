---
title: "맥에 여러 개의 Python을 설치하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoinstallmultiplePythononyourMac_0.png"
date: 2024-06-19 15:11
ogImage: 
  url: /assets/img/2024-06-19-HowtoinstallmultiplePythononyourMac_0.png
tag: Tech
originalTitle: "How to install multiple Python on your Mac"
link: "https://medium.com/@robiokidenis/how-to-install-multiple-python-on-your-mac-d20713740a2d"
---


![그림](/assets/img/2024-06-19-HowtoinstallmultiplePythononyourMac_0.png)  

파이썬은 웹 개발, 데이터 분석, 기계 학습 등 다양한 애플리케이션에 사용되는 인기 있는 프로그래밍 언어입니다. 그러나 서로 다른 프로젝트와 애플리케이션이 서로 다른 버전의 파이썬을 필요로 할 수 있으며, 한 대의 컴퓨터에서 여러 버전을 관리하는 것은 도전적일 수 있습니다.

다행히도 pyenv는 macOS에서 여러 버전의 파이썬을 쉽게 설치하고 관리할 수 있게 해주는 도구입니다. 이 문서에서는 macOS에 pyenv를 설치하고 사용하는 방법에 대해 안내하겠습니다.

시작하기 전에 다음 사전 준비물이 있는지 확인해주세요:

<div class="content-ad"></div>

- 최신 macOS 버전이 설치된 macOS 기기
- 터미널 애플리케이션 (예: 터미널, iTerm)
- macOS용 인기 있는 패키지 관리자인 Homebrew. Homebrew가 설치되지 않았다면 터미널에서 다음 명령을 실행하여 설치할 수 있습니다:

### 단계 1: Homebrew 설치

Homebrew는 macOS용 패키지 관리자로 시스템에 소프트웨어 패키지를 쉽게 설치하고 관리할 수 있게 해줍니다. Homebrew를 설치하려면 터미널을 열고 다음 명령을 실행하세요:

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<div class="content-ad"></div>

설치를 완료하려면 지시에 따라 진행하세요.

# 단계 2: pyenv 설치

pyenv은 여러 Python 버전을 쉽게 설치하고 전환할 수 있게 해주는 Python 버전 관리자입니다. pyenv을 설치하려면 터미널에서 다음 명령어를 실행하세요:

```js
brew install pyenv

또는

brew install pyenv-virtualenv
```

<div class="content-ad"></div>

이제 시스템에 pyenv와 그 종속 항목을 설치하겠습니다.

# 단계 3: Python 버전 설치

이제 pyenv가 설치되었으므로 Python의 여러 버전을 설치할 수 있습니다. 사용 가능한 Python 버전 목록을 확인하려면 다음 명령을 실행하세요:

```js
pyenv install --list
```

<div class="content-ad"></div>

pyenv를 사용하여 설치할 수 있는 모든 파이썬 버전의 목록을 보여드릴게요. 특정 버전을 설치하려면 다음 명령을 실행하세요:

```js
pyenv install <version>
```

예를 들어, Python 3.9.10을 설치하려면 다음 명령을 실행하세요:

```js
pyenv install 3.9.10
```

<div class="content-ad"></div>

필요한만큼 Python 버전을 설치할 수 있어요.

# 단계 4: 전역 Python 버전 설정하기

기본적으로 시스템 Python 버전이 python 명령을 실행할 때 사용됩니다. 다른 Python 버전을 사용하려면 pyenv를 사용하여 전역 버전을 설정할 수 있어요. 특정 버전으로 전역 Python 버전을 설정하려면 다음 명령을 실행하세요:

```js
pyenv global <version>
```

<div class="content-ad"></div>

예를 들어 전역 Python 버전을 Python 3.9.10으로 설정하려면 다음 명령을 실행하십시오:


pyenv global 3.9.10


이렇게하면 Python 3.9.10이 시스템의 기본 Python 버전으로 설정됩니다.

# 단계 5: 가상 환경 생성

<div class="content-ad"></div>

Python 프로젝트를 서로 격리된 상태로 유지하려면 가상 환경을 사용하는 것이 좋습니다. 가상 환경은 시스템 Python 또는 다른 프로젝트에 영향을 미치지 않고 특정 프로젝트를 위해 패키지와 종속성을 설치할 수 있는 자체 포함된 Python 환경입니다.

새로운 가상 환경을 생성하려면 다음 명령을 실행하세요:

```js
pyenv virtualenv <버전> <환경_이름>
```

예를 들어, Python 3.9.10을 위해 myenv라는 이름의 가상 환경을 만들려면 다음 명령을 실행하세요:

<div class="content-ad"></div>

```js
pyenv virtualenv 3.9.10 myenv
```

이 명령어를 실행하면 새 가상 환경이 ~/.pyenv/versions/`version`/envs/`env_name`에 생성됩니다.

# 단계 6: 가상 환경 활성화

가상 환경을 활성화하려면 다음 명령을 실행하세요:

<div class="content-ad"></div>

```js
pyenv activate <env_name>
```

예를 들어, myenv 가상 환경을 활성화하려면 다음 명령을 실행하세요:

```js
pyenv activate myenv
```

이렇게 하면 가상 환경이 활성화되고 터미널 세션에 대한 기본 Python 환경이 됩니다.