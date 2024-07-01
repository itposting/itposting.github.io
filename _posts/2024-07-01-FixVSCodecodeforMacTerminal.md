---
title: "Mac Terminal에서 VSCode Code  명령어 문제 해결 방법"
description: ""
coverImage: "/assets/img/2024-07-01-FixVSCodecodeforMacTerminal_0.png"
date: 2024-07-01 20:24
ogImage: 
  url: /assets/img/2024-07-01-FixVSCodecodeforMacTerminal_0.png
tag: Tech
originalTitle: "Fix VSCode code . for Mac Terminal"
link: "https://medium.com/@andreshat/fix-vscode-to-run-any-project-from-the-command-line-on-macos-86904275a4f9"
---


PyCharm에서 가벼운 프로젝트 용도로 VSCode로 전환했더니 cmd를 통해 사용하고 싶었던 기능들이 몇 가지 열렸어요. 그 중 제게 가장 중요한 것은 폴더로 이동한 후 code . 명령을 실행하여 해당 프로젝트를 VSCode 프로젝트로 열 수 있는 능력이었어요.

이를 가능하게 하려면 3가지 주요 단계를 거쳐야 해요:

- VSCode를 열기
- Command + Shift + P를 실행하여 Command Palette 열기
- Shell Command: Install ‘code’ command in PATH를 입력하고 실행하여 PATH 변수에 바로 가기를 추가하기

모든 이를 완료한 후 MacOS 사용자는 장치를 재부팅하기 전까지 code . 접근 방식을 사용하여 언제든지 프로젝트를 cmd에서 실행할 수 있어요. 하지만 이후에는 장치를 다시 재부팅하지 않으면 매번 이 3가지 주요 단계를 반복해야 해요. 이 문제를 해결하기 위해 남은 시간 동안 이를 잊을 수 있는 조정을 제안해요.

<div class="content-ad"></div>

터미널 애플리케이션이 제한되어 있지 않고 디스크에 액세스할 수 있는지 확인해주세요. 다음 위치로 이동하여 확인해주세요: 시스템 설정 - `개인정보 및 보안 -` 전체 디스크 액세스 및 슬라이더가 아래 사진처럼 터미널 애플리케이션으로 설정되어 있는지 확인해주세요.

![이미지](/assets/img/2024-07-01-FixVSCodecodeforMacTerminal_0.png)

이 단계를 확인한 후, 터미널을 실행하고 다음 명령을 사용하여 VSCode 애플리케이션의 제한을 확인해주세요: xattr "/Applications/Visual Studio Code.app", 필요한 경우에는 시스템에 맞게 경로를 조정해주세요.

해당 명령은 속성 목록을 반환해야 합니다. 목록에 com.apple.quarantine이 포함되어 있다면 다음 명령을 사용하여 문제를 해결할 수 있습니다: sudo xattr -r -d com.apple.quarantine "/Applications/Visual Studio Code.app".

<div class="content-ad"></div>

아래 명령을 실행한 후, 다시 위의 주요 3단계를 수행하고 변경 사항을 적용하기 위해 시스템을 다시 로드해주세요.

![맥 터미널에 VSCode 코드를 수정하는 방법](/assets/img/2024-07-01-FixVSCodecodeforMacTerminal_1.png)

읽어 주셔서 감사합니다. 문제가 해결되었기를 바랍니다! 앞으로 MacOS에서 VSCode와 cmd를 더 자주 사용하게 될 것 같네요!