---
title: "앱 v013가 공식으로 출시되었습니다"
description: ""
coverImage: "/assets/img/2024-06-20-appv013isOfficiallyReleased_0.png"
date: 2024-06-20 14:27
ogImage: 
  url: /assets/img/2024-06-20-appv013isOfficiallyReleased_0.png
tag: Tech
originalTitle: "app v0.13 is Officially Released!"
link: "https://medium.com/@hkdb/app-v0-13-is-officially-released-fd7ca6fd1aa2"
---


크로스 플랫폼 패키지 관리 도우미

![이미지](/assets/img/2024-06-20-appv013isOfficiallyReleased_0.png)

작년 크리스마스 때, 나는 워크스테이션, 서버, VM, 도커 컨테이너 및 LXD 컨테이너의 재현 가능한 빌드를 어떻게 만들지 못했는지에 대한 가장 오랫동안 지속된 문제를 해결하기 위해 토끼굴로 들어갔다. 이번에는 Ansible과 같은 시간 낭비 솔루션이나 대량의 NAS 파괴 이미지를 유지하는 것과 같은 번거로운 방법을 사용하지 않고 작업하는 것이다.

이 프로젝트는 나만이 관심을 가질 것으로 생각했던 매우 특수한 것이어야 한다고 생각했지만, 뜻밖의 반응을 받았다. 참여한 사람들은 많지 않았지만, 예상을 뛰어넘는 반응이었다. 프로젝트를 계속 진행할수록 다양한 배경을 가진 사람들로부터 조금씩 더 많은 관심을 받고 있다는 것을 알게 되었다. 또한 실제로 기여하고자 하는 능력과 의지를 가진 개인을 끌어들였다는 점에서 굉장히 운이 좋았다. Richard Frevrier at GOLE TECH님에게 감사 말씀을 전합니다!

<div class="content-ad"></div>

한편, 어플리케이션이 크게 발전했습니다. 이제 다음을 지원합니다:

- Linux
- Mac
- FreeBSD

그리고 다음 패키지 매니저를 지원합니다:

- apt, 3rd party repos 및 다운로드 된 .deb
- dnf, 3rd party repos 및 다운로드 된 .rpm
- pacman
- yay
- zypper, 3rd party repos 및 다운로드 된 .rpm
- pkg
- Homebrew
- Flatpak 및 3rd party repos
- Snap
- AppImage (사실상 패키지 매니저는 아니지만... 알고 있습니다)
- go
- pip
- cargo

<div class="content-ad"></div>

죄송합니다, Windows 사용자 여러분들. scoop과 chocolatey로 이동하는 데까지는 시간이 걸릴 수 있습니다. 그러나 그동안 WSL 기차에 타곤 이미 환경 속에서 작동하는 앱은 여러분에게 문제가 없어야 합니다.

리처드와 제퍼슨(내 친한 홈랩 친구) 사이에서 알게 된 사실은 앱을 접근성 있게 하는 것이 처음에 생각했던 것보다 더 중요하다는 것입니다. 결국, 앱을 사용하는 모든 사람이 개발자가 아니며, 아마도 앱을 사용하기 위해 모든 개발 의존성을 설치하고 싶어하지 않을 것입니다. 그래서 기능 해킹에서 잠시 쉬는 게 편안하다고 느낀 순간, 앱을 더 쉽게 설치하고 업데이트할 수 있도록 집중했습니다.

그 결과로 v0.12가 나오게 되었는데, 이 아마추어인 나는 FreeBSD와 macos에서 v0.12 버전에 일부 오류가 있었다는 걸 인지하게 되었습니다. 그래서 그 중대한 문제를 즉시 수정하고 v0.13을 릴리스했습니다.

v0.13에서 일어난 크고 작은 수정 사항 가운데, 아마 가장 주목할 만한 것은 이제 터미널에서 한 줄의 명령으로 앱을 설치할 수 있다는 점입니다:

<div class="content-ad"></div>


bash <(curl -sL https://hkdb.github.io/app/getapp.sh)


![2024-06-20-appv013isOfficiallyReleased_1](/assets/img/2024-06-20-appv013isOfficiallyReleased_1.png)

만약 명령어를 잊어버렸다면 걱정하지 마세요! 이제는 터미널에 명령어를 복사하여 붙여넣을 수 있는 빠르고 간편한 랜딩 페이지가 있습니다:

또한 Richard의 제안을 고려하여 사용자가 최신 릴리스로 앱을 업그레이드하는 유일한 작업은 다음 명령어를 실행하는 것뿐입니다:


<div class="content-ad"></div>

```js
앱 -m 앱 업데이트
```

<img src="/assets/img/2024-06-20-appv013isOfficiallyReleased_2.png" />

이게 너무 쉽다는 게 좋네요. 또한 이 새로운 코드 일부를 재사용하여 저장소에 오랫동안 있던 "컴파일해서 설치하기" 스크립트를 다시 만드는 데도 좋은 부가 효과가 있었어요. 현재 기여자와 사용자들 모두가 같은 생각을 가지기를 바랍니다.

이미 app을 시도해 보신 적이 있나요? 생각을 알려주세요!
