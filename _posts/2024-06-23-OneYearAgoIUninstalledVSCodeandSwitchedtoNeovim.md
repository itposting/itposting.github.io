---
title: "1년 전 VS Code를 삭제하고 Neovim으로 전환한 이유"
description: ""
coverImage: "/assets/img/2024-06-23-OneYearAgoIUninstalledVSCodeandSwitchedtoNeovim_0.png"
date: 2024-06-23 15:18
ogImage: 
  url: /assets/img/2024-06-23-OneYearAgoIUninstalledVSCodeandSwitchedtoNeovim_0.png
tag: Tech
originalTitle: "One Year Ago, I Uninstalled VS Code and Switched to Neovim"
link: "https://medium.com/@pthapa1/one-year-ago-i-made-a-monumental-change-uninstalled-vs-code-and-switched-to-neovim-3e8d078c87ad"
---



![image](/assets/img/2024-06-23-OneYearAgoIUninstalledVSCodeandSwitchedtoNeovim_0.png)

## 왜 바꾸고 싶은지 알아보세요

내가 기억할 수 있는 한 오랜 시간 동안 VS Code를 사용해왔습니다. 초보자들이 시작하기에 아주 좋은 편집기입니다. 그러나 다른 일렉트론 기반 앱들처럼, VS Code는 느리고 컴퓨터 배터리를 많이 소모합니다. 제 노트북에서 긴 시간 동안 작업하려고 할 때마다 콘센트를 찾아야하는 번거로움에 지쳐갔습니다.

거기에다가, 동시에 내 Logitech M510 시리즈 마우스가 작동하지 않는 문제가 발생했습니다 — 화면에서 지연되고 깜박이는 현상이 나타났습니다. 이 문제는 때때로 발생하지만 빈번하여 짜증이 났습니다.


<div class="content-ad"></div>

저는 이전에 ThePrimeagen의 YouTube 채널을 구독하고 있었습니다. 그의 독특한 성격과 컴퓨터를 빠른 속도로 조작하는 능력이 저를 매료시켜, 깊이 있는 도구 사용을 배우게 되었습니다. 그래서 나는 내 자신을 설득하여 마우스를 움직이지 않고 vim 명령어를 배워야겠다고 결심했습니다.

## 적절한 도구 선택하기

몇 년 전 vim 명령어를 배우기 전에 Neovim으로 전환을 시도했지만 분명히 실패했습니다. 그래서 이번에는 명령어를 먼저 마스터해야 한다는 것을 알고 있었습니다.

vim 명령어의 숙달을 약속하는 여러 온라인 게임 및 터미널 기반 도구를 시도해 봤지만, 모두 잘 맞지 않았습니다. VS Code용 Vim 확장 프로그램을 사용해 보기도 했지만, 실망스러웠습니다. 확장 프로그램은 느린 에디터를 더 느리게 만들었고, 여러 문제가 있었습니다.

<div class="content-ad"></div>

마침내 저는 Zed 텍스트 편집기로 전환했습니다, 비록 여러 가지 단점이 있지만 vim-motion 지원이 훨씬 더 원활했기 때문입니다. 저는 지속적으로 연습하여 모든 앱에서 vim 지원을 찾기 시작했습니다. 정확히 이 이유로 Obsidian을 제 메모 앱으로 선택했습니다. 결과적으로, 그렇게 어렵지 않았습니다. 필요한 대부분을 몇 주 만에 배웠죠.

## Neovim 설정하기

Neovim의 전체 의도는 사용자의 취향에 맞게 설정하는 것입니다. 그렇기 때문에 다른 사람의 환경을 사용하는 것은 의미가 없죠. 그래도, 전체 편집기를 직접 설정하는 것은 압도적으로 어려울 수 있습니다. 그래서 여기에 저가 제 환경을 구성하는 데 사용한 유용한 자료 몇 가지를 제공하겠습니다. 기억하세요, 핵심은 해야 할 작업을 이해하고 스스로 처리하는 것입니다.

Github 저장소:

<div class="content-ad"></div>

- Kickstart.nvim. 모든 것이 한 파일에 있어 시작하기에 최적인 곳입니다.
- ThePrimeagen. 전설 그 자체.
- 내 Nvim 설정: 내 환경을 어떻게 설정했는지 확인하고 싶다면.

배포:

- LazyVim
- NvChad.
- AstroVim
- LunarVim

YouTube

<div class="content-ad"></div>

- Chris@machine의 Neovim 시리즈.
- TypeCraft.
- Vhyrro에 의한 Neovim 이해

## 멋진 경험

Neovim이 노트북 배터리를 태우지 않는다는 것을 좋아합니다. 일본으로 향하는 길에 비행기에서 Go 프로젝트의 유닛 테스트를 쓰는 데 5시간 이상을 보냈는데, 배터리 소모가 약 15% 정도 밖에 되지 않았습니다. 요즘에는 노트북이 시원하게 유지되면서 그것을 정말 좋아합니다. 이것만으로도 Neovim으로 변경하는 것이 정당화되었습니다.

게다가, VS Code에서는 너무 많은 확장 기능이 필요하지 않았습니다. 그래서 제가 떠나고 나서 그리워하는 확장 기능이 있지는 않습니다. Quokkajs를 제외하고요, 그것은 자바스크립트와 타입스크립트 스크래치패드입니다. 일단 quokka 대안으로, 제가 어떤 자바스크립트 코드를 시험해보고 싶을 때 빠르게 노드 프로젝트로 전환합니다.

<div class="content-ad"></div>

터미널 기반 앱의 사용 경험은 키보드 조작 능력에 달려 있어요. 그래서 만약 키를 누르기 전에 각 키를 살펴봐야 하는 타자 타입이라면 Neovim은 당신을 위한 것이 아닙니다. 스위치하기 전에 키보드를 튼튼하게 다루는 능력이 필요해요. 제가 분당 80자 정도의 타자 능력을 갖고 있었기 때문에 이 문제는 전혀 발생하지 않았어요.

마침내, 다른 사람들이 제가 VS Code를 사용하지 않는 것을 깨달을 때의 반응을 보는 것이 정말 기쁘죠.

Neovim으로 바꾼 것이 내가 한 가장 좋은 결정 중 하나가 되었습니다. 이 스위치로 인해 터미널에 대해 편안해지고 이제 다양한 CLI 응용 프로그램을 사용하고 있어요. 이에 대해 전체 기사를 썼답니다. 모두가 각자의 독특한 학습 경로를 갖고 있어요. 그래서 여러 도구와 기술을 시도하고, 가장 잘 맞는 것을 받아들이는 것이 중요해요. Zed, Obsidian 또는 고장 났거나 망가진 마우스가 당신에게 적합하지 않을지도 몰라요.

아래는 제가 이전 게시물에서 언급한 기사들이에요.