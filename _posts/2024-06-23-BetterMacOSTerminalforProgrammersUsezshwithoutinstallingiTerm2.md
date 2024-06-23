---
title: "프로그래머를 위한 더 나은 MacOS 터미널 iTerm2 없이 zsh 사용하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-BetterMacOSTerminalforProgrammersUsezshwithoutinstallingiTerm2_0.png"
date: 2024-06-23 15:40
ogImage: 
  url: /assets/img/2024-06-23-BetterMacOSTerminalforProgrammersUsezshwithoutinstallingiTerm2_0.png
tag: Tech
originalTitle: "Better MacOS Terminal for Programmers: Use zsh without installing iTerm2"
link: "https://medium.com/javarevisited/better-macos-terminal-for-programmers-use-zsh-without-installing-iterm2-41ce5e75296b"
---


![이미지](/assets/img/2024-06-23-BetterMacOSTerminalforProgrammersUsezshwithoutinstallingiTerm2_0.png)

# 👋 소개

터미널 애플리케이션은 MacOS에서 가장 중요한 애플리케이션 중 하나이며 아마도 가장 중요한 애플리케이션입니다. MacOS에는 여러 내장 셸이 있지만 대부분의 사용자는 zsh 또는 bash 셸을 사용합니다. Mac에서 사용 중인 터미널을 확인하려면 터미널을 열고 다음을 입력하십시오.

```js
echo $SHELL
```

<div class="content-ad"></div>

이 글에서는 MacOS의 내장 zsh 터미널을 구성하는 방법을 살펴볼 것입니다. Mac에서 zsh 터미널이 설치되어 있는지 확인하려면 다음 명령을 입력하십시오.

```js
cat /etc/shells | grep "zsh"
```

Mac에 zsh 셸이 설치되어 있는지 확인했다면 Mac 터미널을 다양하게 활용할 수 있습니다. 그러나 그렇지 않다면 zsh 터미널을 설치해야 합니다. Homebrew가 설치되어 있어야만 zsh 터미널을 설치할 수 있습니다. Homebrew는 MacOS용 패키지 관리자 도구이며 우리는 zsh 셸을 변경하기 위해 이 도구가 필요합니다.

# 🍺 Homebrew 설치하기

<div class="content-ad"></div>

홈브루를 설치하려면 아래 안내에 따라 간단히 설치할 수 있어요.

- 홈브루를 설치하려면 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"를 실행하세요.
- 설치 후, 터미널에서 화면에 표시된 지침대로 두 개의 명령을 실행하게 됩니다.
  1번 명령 → echo `eval "$(/opt/homebrew/bin/brew shellenv)"` `` /Users/`사용자명`/.zprofile
  2번 명령 → eval "$(/opt/homebrew/bin/brew shellenv)"
- 홈브루가 올바르게 설치되었는지 확인하려면 터미널에 brew를 입력하세요.

# 💻 zsh 설치하기

zsh 터미널이 없다면 cat /etc/shells | grep "zsh"를 실행했을 때, zsh가 나오지 않는다면 Homebrew로 zsh를 설치할 수 있어요. brew install zsh를 입력하여 zsh를 설치한 후, 다시 cat /etc/shells | grep "zsh"를 입력하여 zsh 터미널이 정상적으로 설치되었는지 확인하세요.

<div class="content-ad"></div>

그 후 아래 명령어를 입력하여 기본 터미널을 zsh 터미널로 변경하세요.

```js
chsh -s /bin/zsh
```

변경 사항이 올바르게 적용되었는지 확인하려면 터미널을 다시 시작하세요.

# 🎨 oh-my-zsh

<div class="content-ad"></div>

이제 터미널에 색을 입혀봐요 🎨 아래 지시 사항을 따라주세요.

- git 설치하기 → brew install git
- oh-my-zsh 설치하기 → sh -c "$(curl -fsSLhttps://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
- 터미널에 필요한 글꼴 다운로드 및 설치하기 → https://github.com/Falkor/dotfiles/blob/master/fonts/SourceCodePro%2BPowerline%2BAwesome%2BRegular.ttf
- powerlevel10k 테마 설치하기 → git clonehttps://github.com/romkatv/powerlevel10k.git$ZSH_CUSTOM/themes/powerlevel10k
- .zshrc 파일 열기 → open ~/.zshrc, 그리고 $ZSH_THEME을 powerlevel10k로 업데이트하기 → ZSH_THEME="powerlevel10k/powerlevel10k"
- 터미널을 다시 시작하고 화면 안내에 따라 터미널을 아름답게 꾸며보세요 🌈✨

# 🤔 자동 제안

터미널을 아름답게 만드는 것 외에도, zsh 터미널에서도 자동 제안 기능을 사용할 수 있어요. 자동 제안 기능을 사용하려면 아래 지시 사항을 따라주세요.

<div class="content-ad"></div>

- git 저장소를 복제하고 설치하세요 → git clone https://github.com/zsh-users/zsh-autosuggestions $'ZSH_CUSTOM:-~/.oh-my-zsh/custom'/plugins/zsh-autosuggestions 
- .zshrc 파일을 업데이트하세요 → plugins=(zsh-autosuggestions) (이미 플러그인 섹션에 git이 있는 경우에는 plugins=(git zsh-autosuggestions)로 작성)
- .zshrc 파일을 소스하세요 → source ~/.zshrc

이제 멋지고 더 나은 터미널을 사용해서 프로젝트를 작업할 수 있게 되었습니다! 😊

# 📚참고 자료

- Gastón Festari의 Zsh로 셸 스크립팅 배우기
- Joe Kissell의 터미널로 Mac 명령줄 제어하기, 3판