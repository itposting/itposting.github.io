---
title: "루비 LSP 초기 설정 고민"
description: ""
coverImage: "/assets/img/2024-06-19-InitialRubyLSPconfigurationalpain_0.png"
date: 2024-06-19 04:53
ogImage: 
  url: /assets/img/2024-06-19-InitialRubyLSPconfigurationalpain_0.png
tag: Tech
originalTitle: "Initial Ruby LSP configurational pain"
link: "https://medium.com/@luka.barczak/initial-ruby-lsp-configurational-pain-7d58bba2b995"
---


이 글은 Windows 10에서 Ruby LSP VS Code 확장 프로그램을 설정하는 방법에 대한 빠른 안내입니다.

남들이 시간과 노력, 그리고 괴로움을 아낄 수 있도록 작성해 보았어요. 새로운 기술과 작업 환경을 설정하는 것은 어려울 수 있습니다. 특히 특정 운영 체제를 위해 처음부터 제작된 것이 아니거나 설명이 부족한 경우에 그렇죠.

우리는 Windows 10에서 Visual Studio Code에서 Ruby LSP를 활성화할 거에요! 성공을 위해 몇 가지 도구가 필요할 거에요. 필요한 곳에 다운로드할 수 있는 URL을 추가해 놨어요:

- Windows 10 (지금 제가 사용하는 것이죠),
- Windows용 RubyInstaller,
- Visual Studio Code (VSC),
- Ruby LSP VSC 확장 프로그램 (아이디: Shopify.ruby-lsp).

<div class="content-ad"></div>

Windows 용 RubyInstaller

윈도우가 이미 설치되어 있다고 가정하고, 지금부터 RubyInstaller를 포함한 다른 필수 도구를 다운로드해 봅시다. 저는 최신 안정 버전인 Ruby 3.3.3 버전을 설치해 보았고, 이에 따라 해당 버전에 맞는 DevKit도 함께 설치했습니다 (필수 사항!).

![RubyInstaller Image](/assets/img/2024-06-19-InitialRubyLSPconfigurationalpain_0.png)

화면에서 볼 수 있듯이, "Latest News" 섹션이 실제로 최신 상태가 아닙니다 (3.3.0이 아닌 3.3.3이 나와야 합니다). 따라서 올바른 버전을 찾기 위해 아래 사진처럼 "Download" 섹션으로 이동해야 합니다.

<div class="content-ad"></div>

아래와 같이 제시된 마지막 단계에 도달할 때까지 설치 프로그램의 지시에 따라 설치를 진행하세요. 체크박스가 선택되어 있는지 확인하세요. Ridk는 RubyInstaller Development Kit의 줄임말로, 여기에서 문서를 찾을 수 있습니다.

그 후에는 RubyInstaller가 열린 cmd 창이 표시됩니다.

<div class="content-ad"></div>


![Initial Ruby LSP configuration pain 3](/assets/img/2024-06-19-InitialRubyLSPconfigurationalpain_3.png)

여기가 제가 시간을 많이 쓰게된 첫 번째 이슈입니다. 기본 설치 옵션은 1과 3이지만 저의 경우에는 모두 설치해야 했습니다. 옵션 목록은 쉼표로 구분되어 있으므로 다음과 같은 형식으로 제공해야 합니다: 1,2,3. 모든 것이 제대로 설치되면 터미널을 닫기 위해 터미널이 제안한대로 Enter 키를 누르세요.

![Initial Ruby LSP configuration pain 4](/assets/img/2024-06-19-InitialRubyLSPconfigurationalpain_4.png)

Ruby가 제대로 설치되었는지 확인하려면 새로운 (그렇지 않으면 Ruby 환경 경로가 선택되지 않을 수 있음) 터미널 창에서 명령어 ruby -v를 실행해주세요.


<div class="content-ad"></div>

Visual Studio Code

VSC 설치는 간단할 것이므로 자세히 다루지 않겠습니다. Windows용 버전을 다운로드하여 설치하면 됩니다. 특별한 설정은 필요하지 않습니다. 기본 옵션으로도 충분합니다.

Ruby LSP VSC 확장 프로그램

설치가 완료되면 Visual Studio Code (VSC)를 열어보세요. Ruby LSP 확장 프로그램을 그냥 추가하는 것만으로는 작동하지 않습니다. 이 GitHub 이슈에 따르면 Ruby LSP는 VSC에서 워크스페이스 폴더가 열려 있을 때에만 활성화됩니다(단일 파일에서는 작동하지 않음). 안타깝게도 이것이 유일한 요구 사항은 아닙니다.

<div class="content-ad"></div>

워크스페이스 폴더에 Gemfile.lock이라는 특정 파일이 있어야 합니다. 이 파일은 워크스페이스에서 bundle install 명령을 실행하여 생성됩니다. bundle install 명령은 Ruby 프로젝트의 종속성을 관리하는 Bundler 도구의 일부입니다. 이 명령은 프로젝트의 Gemfile에 지정된 젬(루비 라이브러리)을 설치합니다. Gemfile은 프로젝트에 필요한 모든 젬과 버전을 나열하는 파일입니다.

여기 Windows에서 Ruby LSP를 실행하기 위한 최소한의 저장소가 있습니다.

이제 남은 일은 VSC에 Ruby LSP 확장 프로그램을 설치하는 것뿐입니다. 이제 문제없이 실행되어야 합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-InitialRubyLSPconfigurationalpain_6.png" />

앞서 말씀드린 대로, 이 기사가 어려움을 겪는 사람들에게 도움을 주고 시간을 절약할 수 있기를 바랍니다. 이러한 문제들은 어떤 사람들을 낙담시킬 수 있지만, 저는 루비가 그런 대접을 받을 자격이 없다고 생각합니다.

소중한 시간을 내어주셔서 감사합니다. 좋은 하루 되세요! :)