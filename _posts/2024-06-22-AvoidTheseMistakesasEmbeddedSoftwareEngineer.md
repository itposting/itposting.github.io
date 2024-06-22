---
title: "임베디드 소프트웨어 엔지니어가 피해야 할 실수 7가지"
description: ""
coverImage: "/assets/img/2024-06-22-AvoidTheseMistakesasEmbeddedSoftwareEngineer_0.png"
date: 2024-06-22 18:51
ogImage: 
  url: /assets/img/2024-06-22-AvoidTheseMistakesasEmbeddedSoftwareEngineer_0.png
tag: Tech
originalTitle: "Avoid These Mistakes as Embedded Software Engineer"
link: "https://medium.com/@mimayuresh/avoid-these-mistakes-as-embedded-software-engineers-00d28bb9d53b"
---


내가 임베디드 소프트웨어 엔지니어로 일하면서 첫걸음에 몇 가지 실수를 했는데, 그것들이 나를 속박했었어요. 나는 이 실수들을 공유하여 엔지니어링 학생들이 같은 함정을 피할 수 있도록 도와주고 싶어요. 🚫⚠️

실수 #1: 개발에 IDE에 의존하기 🖥️
나는 처음에 Arduino와 같은 IDE에 완전히 의존해서 내 임베디드 코드를 작성하고 컴파일했어요. IDE는 빠른 프로토타이핑에 도움이 될 수 있지만, 결국은 전체 툴체인과 개발 프로세스를 정말로 이해하는 것을 방해한다는 점을 깨달았어요.

<div class="content-ad"></div>

![IDEs take away important details like the compiler, linker, debugger, and build system. This might seem convenient at first, but it means you don’t develop a deep understanding of how your code is getting from source to binary. Companies want engineers who understand the nuts and bolts of the entire development workflow, not just what an IDE’s GUI presents.

The solution? Learn to use a proper toolchain with a command-line build system, standalone compiler, debugger, etc. It’s more work upfront, but you’ll become a far more versatile and valuable embedded engineer.

Mistake #2: Not Using Git Effectively
Another big mistake I made was not leveraging Git and GitHub properly in my projects. I would typically just upload the final project code to GitHub when I was done, without any of the version history, commit messages, or evidence of my development process.

<div class="content-ad"></div>

![AvoidTheseMistakesasEmbeddedSoftwareEngineer](/assets/img/2024-06-22-AvoidTheseMistakesasEmbeddedSoftwareEngineer_2.png)
  
회사들은 코드를 작성하는 것뿐만 아니라, 생각을 많이 하고 반복적으로 개발하는 개발자로 보여줄 필요가 있습니다. 버전 컨트롤을 사용하여 진행 상황을 추적하고 아이디어를 실험하며 도전을 극복하는 개발자가 되어야 합니다. 잘 문서화되고 자주 업데이트되는 프로젝트로 가득 찬 GitHub 프로필은 여러분의 기술에 대해 말해줍니다. 📈👨‍💻

처음부터 Git을 업무 흐름의 핵심 부분으로 만드세요. 조기에 자주 커밋하고 의미 있는 커밋 메시지를 사용하고 프로젝트 전반에 걸쳐 다양한 문제에 대해 어떻게 대처했는지 보여주세요. 이렇게 하면 여러분의 GitHub 프로필이 여러분의 능력을 진정으로 보여주는 포트폴리오가 될 것입니다. 🔄📝

이러한 실수를 초기에 피하는 것은 여러분이 숙련된, 시장에서 인정받을 수 있는 임베디드 소프트웨어 엔지니어로 거듭날 수 있는 강력한 길을 제시합니다. 전체 도구 체인을 이해하고 개발 여정을 문서로 기록하려면 버전 컨트롤에 집중하세요. 이렇게 하면 여러분이 꿈꿔온 임베디드 역할을 얻는 길에 큰 도움이 될 것입니다. 🚀🌟