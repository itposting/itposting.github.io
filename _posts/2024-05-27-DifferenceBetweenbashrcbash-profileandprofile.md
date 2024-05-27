---
title: "bashrc, bash-profile, 그리고 profile의 차이점"
description: ""
coverImage: "/assets/img/2024-05-27-DifferenceBetweenbashrcbash-profileandprofile_0.png"
date: 2024-05-27 12:17
ogImage:
  url: /assets/img/2024-05-27-DifferenceBetweenbashrcbash-profileandprofile_0.png
tag: Tech
originalTitle: "Difference Between .bashrc, .bash-profile, and .profile"
link: "https://medium.com/@shalinpatel./difference-between-bashrc-bash-profile-and-profile-1947edea4318"
---


<img src="/assets/img/2024-05-27-DifferenceBetweenbashrcbash-profileandprofile_0.png" />

# 1. 개요

Bash 쉘은 환경을 설정하기 위해 몇 가지 시작 파일을 사용합니다. 이러한 파일은 쉘 자체와 시스템 사용자를 위한 일부 Bash 쉘 구성을 결정합니다.

이 튜토리얼에서는 .bashrc, .bash-profile 및 .profile과 같은 시작 파일 및 그들의 차이에 대해 알아보겠습니다.


<div class="content-ad"></div>

# 2. 대화형 쉘과 비대화형 쉘

Bash는 대화형 쉘에서 두 가지 모드 옵션을 제공합니다: 로그인과 비로그인입니다.

ssh를 사용하여 시스템에 로그인하면 대화형 로그인 쉘을 얻게 됩니다. 이 쉘은 호출될 때 시작 파일을 읽습니다.

그러나 이미 로그인한 쉘에서 새 쉘을 호출하면 대화형 비로그인 쉘을 얻게 됩니다. 이 유형의 쉘은 .bashrc 파일만 실행합니다.

<div class="content-ad"></div>

명령을 실행하기 위해 인간의 개입이 필요하지 않은 셸을 비대화(non-interactive) 셸이라고 부릅니다. 예를 들어, 스크립트가 명령을 실행하기 위해 자식 셸을 생성할 때, 그 자식 셸은 비대화 셸입니다. 이 셸은 시작 파일을 실행하지 않습니다. 그것은 생성된 셸로부터 환경 변수를 상속합니다.

## 3. Bash 시작 파일

시작 파일은 셸 시동 시 실행되어야 하는 명령을 포함합니다. 결과적으로, 셸은 이 파일에 있는 명령을 셸을 설정하기 위해 자동적으로 실행합니다. 이는 명령 프롬프트를 표시하기 전에 발생합니다.

## 3.1. .bash_profile의 중요성

<div class="content-ad"></div>

.bash_profile 파일에는 환경 변수를 설정하는 명령이 포함되어 있습니다. 따라서 이러한 변수는 이후의 쉘에서 상속됩니다.

대화식 로그인 쉘에서 Bash는 먼저 /etc/profile 파일을 찾습니다. 발견되면 Bash는 해당 파일을 현재 쉘에서 읽고 실행합니다. 결과적으로 /etc/profile은 모든 사용자를 위한 환경 설정을 구성합니다.

마찬가지로, Bash는 그 다음 홈 디렉토리에 .bash_profile 파일이 있는지 확인합니다. 존재한다면 Bash는 현재 쉘에서 .bash_profile을 실행합니다. 그러면 Bash는 .bash_login이나 .profile과 같은 다른 파일을 찾지 않습니다.

만약 Bash가 .bash_profile을 찾지 못하면, .bash_login과 .profile 순으로 찾아 첫 번째로 읽을 수 있는 파일을 실행합니다.

<div class="content-ad"></div>

샘플 .bash_profile 파일을 살펴보겠습니다. 여기서는 PATH 변수를 설정하고 내보내고 있습니다:

```js
echo "Bash_profile execution starts.."
PATH=$PATH:$HOME/bin;
export PATH;
echo "Bash_profile execution stops.."
```

대화식 로그인 셸에서 명령 프롬프트 바로 앞에 다음과 같은 출력이 표시됩니다:

```js
Bash_profile execution starts..
Bash_profile execution stops..
[dsuser@cygnus ~]$
```

<div class="content-ad"></div>

# 3.2. .bashrc의 중요성

.bashrc에는 Bash 쉘에 특정한 명령이 포함되어 있습니다. 모든 대화형 비로그인 쉘은 일반적으로 먼저 .bashrc를 읽습니다. 보통 .bashrc는 별칭(alias)과 Bash 관련 함수를 추가하는 가장 좋은 장소입니다.

Bash 쉘은 홈 디렉토리에서 .bashrc 파일을 찾아서 source를 사용하여 현재 쉘에서 실행합니다.

이제 샘플 .bashrc 파일 내용을 살펴보겠습니다:

<div class="content-ad"></div>

```bash
echo "Bashrc 실행 시작.."
alias elui='top -c -u $USER'
alias ll='ls -lrt'
echo "Bashrc 실행 종료.."
```

인터랙티브 비로그인 셸에서 명령 프롬프트 바로 앞에 아래 출력을 볼 수 있습니다:

```bash
[dsuser@server ~]$ bash
Bashrc 실행 시작..
Bashrc 실행 종료..
[dsuser@server ~]$
```

# 3.3. .profile 파일의 중요성

<div class="content-ad"></div>

대화형 쉘 로그인 중 홈 디렉토리에 .bash_profile이 없으면 Bash는 .bash_login을 찾습니다. 발견되면 Bash가 실행합니다. 만일 홈 디렉토리에 .bash_login이 없다면 Bash는 .profile을 찾아 실행합니다.

.profile에는 .bash_profile 또는 .bash_login에 있는 것과 동일한 구성을 저장할 수 있습니다. 이 파일은 프롬프트 모양, 키보드 소리, 열 쉘 및 /etc/profile 파일에서 설정한 변수를 무시하고 개별 프로필 설정을 제어합니다.

# 4. 차이점

대화형 로그인 시마다 Bash 쉘은 .bash_profile을 실행합니다. 만일 홈 디렉토리에 .bash_profile이 없다면 Bash는 .bash_login과 .profile 중 첫 번째로 읽을 수 있는 파일을 실행합니다. 한편, 대화형 비 로그인 쉘 시작 시마다 Bash는 .bashrc를 실행합니다.

<div class="content-ad"></div>

일반적으로 환경 변수는 .bash_profile에 넣습니다. 대화식 로그인 쉘은 첫 번째 쉘이므로 환경 설정에 필요한 모든 기본 설정을 .bash_profile에 넣습니다. 결과적으로 이러한 설정은 한 번만 설정되지만 모든 하위 쉘에서 상속됩니다.

마찬가지로 별칭 및 함수는 항상 기존 환경에서 셸을 시작할 때 로드되도록 .bashrc에 넣습니다.

그러나 로그인 및 비로그인 대화식 셸 설정 차이를 피하기 위해 .bash_profile에서 .bashrc를 호출합니다. 결과적으로 아래 코드 조각이 .bash_profile에 삽입되어 매 대화식 로그인 셸에서 .bashrc도 동일한 셸에서 실행되도록 합니다:

```js
if [ -f ~/.bashrc ];
then
    .  ~/.bashrc;
fi
PATH=$PATH:$HOME/bin export PATH
```

<div class="content-ad"></div>

# 5. 결론

결론적으로, 쉘은 환경을 설정하기 위해 시작 파일이 필요합니다. 환경을 사용하기 전에 쉘 환경을 구성해야 합니다.

이 글에서는 다양한 쉘 모드를 확인했습니다. 그리고 다양한 Bash 시작 파일의 중요성을 배웠습니다. 마지막으로 이러한 시작 파일 간의 차이를 확인했습니다.
