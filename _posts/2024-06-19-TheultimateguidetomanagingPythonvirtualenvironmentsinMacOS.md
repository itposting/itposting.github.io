---
title: "맥OS에서 Python 가상 환경을 관리하는 궁극의 가이드"
description: ""
coverImage: "/assets/img/2024-06-19-TheultimateguidetomanagingPythonvirtualenvironmentsinMacOS_0.png"
date: 2024-06-19 15:16
ogImage: 
  url: /assets/img/2024-06-19-TheultimateguidetomanagingPythonvirtualenvironmentsinMacOS_0.png
tag: Tech
originalTitle: "The ultimate guide to managing Python virtual environments in MacOS"
link: "https://medium.com/@miqui.ferrer/the-ultimate-guide-to-managing-python-virtual-environments-in-macos-c8cb49bf0a3c"
---


<img src="/assets/img/2024-06-19-TheultimateguidetomanagingPythonvirtualenvironmentsinMacOS_0.png" />

파이썬을 사용할 때 여러 버전의 파이썬 환경을 사용하거나 서로 다른 프로젝트에 대해 패키지 버전을 별도로 관리하려는 경우가 있을 수 있습니다.

가상화된 방식으로 파이썬 환경 또는 파이썬 패키지 환경을 쉽게 관리하기 위해 pyenv, conda, virtualenv 및 venv과 같은 다양한 도구들이 있습니다. 이로 인해 다소 혼란스러울 수 있습니다.

이 글에서는 pyenv 및 pyenv-virtualenv의 설치 방법을 다루고 있습니다.
간단히 말해, pyenv는 Python 버전을 관리하는 데 도움을 주고, pyenv-virtualenv는 pyenv의 플러그인으로 Python 가상 환경을 관리하는 데 도움이 되며, 예를 들어 virtualenvwrapper를 사용하는 것보다 훨씬 편리합니다 (pyenv를 사용하는 경우).

<div class="content-ad"></div>

그래서, 지금부터 pyenv를 Mac에 설치해 보는 걸 시작해 봅시다!

# 준비 사항

계속 진행하기 전에, pyenv를 올바르게 설치하기 위해 할 일이 조금 있습니다. 시스템에 이미 이 도구들이 설치되어 있다면, 이 섹션은 건너뛰셔도 됩니다.

- Xcode Command Line Tools 설치:

<div class="content-ad"></div>

```js
$ xcode-select --install
```

- Homebrew 설치하기:

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)
```

- 패키지 설치하기:


<div class="content-ad"></div>

```js
brew install openssl readline sqlite3 xz zlib tcl-tk
```

# pyenv 및 pyenv-virtualenv 설치 및 설정하기

다음 단계는 pyenv와 pyenv-virtualenv을 pyenv-installer 프로젝트를 사용하여 실제로 설치하는 것입니다.

```js
curl https://pyenv.run | bash
```

<div class="content-ad"></div>

이제 유용한 몇 가지 플러그인과 함께 pyenv를 설치합니다:

- pyenv: 실제 pyenv 애플리케이션
- pyenv-virtualenv: pyenv와 가상 환경을 위한 플러그인
- pyenv-update: pyenv 업데이트를 위한 플러그인
- pyenv-doctor: pyenv 및 빌드 종속성이 설치되었는지 확인하는 플러그인
- pyenv-which-ext: 시스템 명령을 자동으로 찾기 위한 플러그인

MacOS Catalina부터 기본 쉘이 zsh인 것으로 가정하면, 셸에서 pyenv와 pyenv-virtualenv를 설정해야 합니다.

```bash
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
source ~/.zshrc
```

<div class="content-ad"></div>

pyenv이 정상적으로 설치되었는지 확인해보세요

```js
pyenv --help
```

다음과 같은 내용이 표시되어야 합니다:

```js
$ pyenv --help                                                                                                                  ✔ ▓▒░
Usage: pyenv <command> [<args>]

몇 가지 유용한 pyenv 명령어는 다음과 같습니다:
   --version   pyenv 버전 표시
   activate    가상 환경 활성화
   commands    사용 가능한 모든 pyenv 명령어 나열
   deactivate   가상 환경 비활성화
   exec        선택한 Python 버전으로 실행 파일 실행
   global      전역 Python 버전 설정 또는 표시
   help        명령어에 대한 도움말 표시
   hooks       주어진 pyenv 명령에 대한 후크 스크립트 나열
   init        pyenv를 위한 쉘 환경 구성
   install     python-build를 사용하여 Python 버전 설치
   latest      지정된 접두사의 최신 설치 또는 알려진 버전 출력
   local       로컬 애플리케이션별 Python 버전 설정 또는 표시
   prefix      Python 버전의 접두사 표시
   rehash      pyenv shims 새로 고침 (실행 파일을 설치한 후에 이 작업 수행)
   root        버전 및 shims을 보관하는 루트 디렉토리 표시
   shell       쉘별 Python 버전 설정 또는 표시
   shims       존재하는 모든 pyenv shims 나열
   uninstall   Python 버전 제거
   version     현재 Python 버전 및 해당 원천 표시
   version-file   현재 pyenv 버전을 설정하는 파일 확인
   version-name   현재 Python 버전 표시
   version-origin   현재 Python 버전을 설정하는 방법 설명
   versions    pyenv에서 사용 가능한 모든 Python 버전 나열
   virtualenv   pyenv-virtualenv 플러그인을 사용하여 Python 가상 환경 생성
   virtualenv-delete   특정 Python 가상 환경 제거
   virtualenv-init   pyenv-virtualenv를 위한 쉘 환경 구성
   virtualenv-prefix   Python 가상 환경 버전의 real_prefix 표시
   virtualenvs   `$PYENV_ROOT/versions/*`에서 찾은 모든 Python 가상 환경 나열
   virtualenvwrapper   현재 쉘에 virtualenvwrapper 설정
   virtualenvwrapper_lazy   현재 쉘에 virtualenvwrapper_lazy 설정
   whence      주어진 실행 파일을 포함하는 모든 Python 버전 나열
   which       실행 파일의 전체 경로 표시

특정 명령에 대한 정보는 `pyenv help <command>'를 참조하세요.
자세한 문서는 다음을 참조하세요: https://github.com/pyenv/pyenv#readme
```

<div class="content-ad"></div>

이제 pyenv를 사용할 준비가 됐어요!!

# pyenv 사용하기 (기본 사용법)

## 시스템에 설치된 Python 버전 목록 보기

시스템에 설치된 Python 버전을 확인하려면 간단히 다음을 실행하세요

<div class="content-ad"></div>

```js
pyenv versions
```

"pyenv versions" 명령어를 실행하면 다음과 같은 출력이 나올 것입니다 (아래 목록은 내 Mac에 설치된 현재 Python 버전에 해당하므로 여러분의 것과 다를 수 있습니다).

```js
pyenv versions                                                                                                                ✔ ▓▒░
  system
  3.9.1
  3.9.10
  3.9.11
  3.9.12
  3.9.13
  3.10.2
  3.10.3
  3.10.4
  3.10.5
  3.10.10
  3.11.2
* 3.11.3 (설정된 버전: xxxxxxx)
  3.11.5
```

보시다시피, 버전 3.11.3 앞에 "*"가 있습니다. 이에 대해 자세히 설명하겠습니다.

<div class="content-ad"></div>

## 특정 Python 버전 설치하기

특정 Python 버전을 설치하는 것은 다음 몤련 명령을 실행하는 것만큼 쉽습니다:

```js
pyenv install x.y.z
```

예를 들어, Python 3.12.0을 설치하려면 다음을 실행하면 됩니다:

<div class="content-ad"></div>

```js
pyenv install 3.12.0
```

## 새 가상 환경 만들기

새 가상 환경을 만들려면 해당 새 가상 환경의 파이썬 버전과 이름을 지정해야 합니다. 예를 들어, 파이썬 버전 3.9.18을 사용하는 "new-venv"라는 새 가상 환경을 만드는 경우 다음을 실행하세요:

```js
pyenv virtualenv 3.9.18 new-venv
```

<div class="content-ad"></div>

## 가상 환경 활성화하기

가상 환경을 만들었다면, 해당 가상 환경에 들어가려면 "activate"해야 합니다. 가상 환경 내에서 작업을 하려면 다음 명령어를 사용하세요:

```js
pyenv activate new-venv
```

이제 파이썬은 해당 가상 환경 내에서 작동하게 됩니다. (예를 들어 제 프롬프트는 어떤 가상 환경에서 작업 중인지 표시해 줍니다.)

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-TheultimateguidetomanagingPythonvirtualenvironmentsinMacOS_1.png)

가상 환경 안에 있을 때, pip나 poetry 또는 PDM과 같은 다른 패키지 관리자를 사용하여 보통처럼 Python 패키지를 설치할 수 있습니다.

또한, 현재 가상 환경을 비활성화하려면 다음을 실행할 수 있습니다:

```js
pyenv deactivate
```

<div class="content-ad"></div>

## 가상 환경 삭제

기존 가상 환경을 삭제하는 것은 매우 간단합니다:

```js
pyenv virtualenv-delete new-venv
```

# 결론

<div class="content-ad"></div>

맥OS에서 Python의 다양한 버전과 가상 환경을 설치하고 관리하는 것은 처음에는 다소 어려울 수 있습니다. 이 가이드가 pyenv를 사용하여 Python 버전과 가상 환경을 쉽게 관리하는 방법에 대해 명확한 가이드를 제공했으면 좋겠습니다.