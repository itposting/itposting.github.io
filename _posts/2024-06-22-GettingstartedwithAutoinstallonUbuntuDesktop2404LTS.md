---
title: "Ubuntu Desktop 2404 LTS에서 Autoinstall 시작하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_0.png"
date: 2024-06-22 16:03
ogImage: 
  url: /assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_0.png
tag: Tech
originalTitle: "Getting started with Autoinstall on Ubuntu Desktop 24.04 LTS"
link: "https://medium.com/@local_optimum/getting-started-with-autoinstall-on-ubuntu-desktop-24-04-lts-147a1defb2de"
---


![이미지](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_0.png)

우분투 24.04 LTS의 가장 흥미로운 새로운 기능 중 하나는 새로운 우분투 데스크톱 설치 프로그램에 자동 설치 지원이 추가된 것입니다.

자동 설치는 오랫동안 우분투 서버의 기능이었습니다. 사용자는 설치 프로세스에 맞게 맞춤 설정 구성을 적용하고 필요에 맞게 조정할 수 있습니다. 이는 사용자 생성, 네트워크 설정 구성, 패키지 설치 등을 포함합니다.

우분투 23.04 및 우분투 23.10을 통해 우분투 데스크톱 설치 프로그램을 동일한 기본 코드 기반으로 이주시켰으며, 데스크톱 구성용 자동 설치를 해제하였습니다. 이제 설치 경험의 과대포장을 일부분으로 사용자가 구성을 직접 가져 올 수 있는 기능을 추가했습니다.

<div class="content-ad"></div>

이 게시물에서는 사용자의 필요에 맞게 커스텀하고 반복 가능한 데스크톱 설치를 생성하는 방법을 간단히 보여 드리겠습니다.

## 단계 1: autoinstall.yaml 파일 생성

Autoinstall은 구성 yaml을 사용하여 기본 설치에 원하는 변경 또는 추가를 구조화합니다. 이는 간단한 설정으로 기본 사용자 구성 및 선호 애플리케이션을 커버하는 매우 짧은 설정이 가능하며, 고급 사용자들은 저장 레이아웃, 사용자 정의 네트워킹 및 방대한 포스트-설치 스크립트를 지정할 수 있습니다.

처음 사용하는 사용자를 대상으로 간단한 예제부터 시작해 보겠습니다:

<div class="content-ad"></div>

```yaml
autoinstall:
  version: 1
  identity:
    hostname: ubuntu-desktop
    username: local-optimum
    password: "$6$ZE4WV3QRJhPUnsNv$BpkTBYjUOxOiWV5sNPYDSitTwxW.3NHLmhRqptzpa8a4KTxGpkvMaSDbyq4PVri9kdpD1t7ldUBgwB6uveObg."
  storage:
    layout:
      name: lvm
  snaps:
    - name: spotify
      classic: false
    - name: telegram-desktop
      classic: false
    - name: obsidian
      classic: true
    - name: code
      classic: true
  packages:
    - vim
  late-commands:
    - curtin in-target -- wget https://repo2.protonvpn.com/debian/dists/stable/main/binary-all/protonvpn-stable-release_1.0.3-3_all.deb
    - curtin in-target -- dpkg -i ./protonvpn-stable-release_1.0.3-3_all.deb
    - curtin in-target -- apt update
    - curtin in-target -- apt install -y proton-vpn-gnome-desktop
```

오 이 건 무엇을 하는 거에요?

- 먼저, 우분투 데스크톱 기계의 이름은 'ubuntu-desktop'이 되며, 'local-optimum'이라는 사용자 이름과 해당 계정의 비밀번호 해시를 생성합니다 (이 경우에는 'ubuntu'에 해당함).
- 파일 시스템 레이아웃으로 LVM을 사용하도록 지정합니다.
- Spotify, Telegram, 멋진 노트 앱 Obsidian 및 VS Code의 네 가지 스냅을 설치합니다. Obsidian 및 VS Code는 클래식 스냅이며 이에 대한 지정이 필요합니다.
- 제 동료들이 나노를 사용하는 저를 비웃지 않도록 Vim을 설치합니다.
- 마지막으로, Proton VPN이라는 타사 애플리케이션을 설치하여 Proton의 공식 안내에 따르되 이 형식에 맞게 재구성한 방식으로 시스템에 설치합니다.

이 스크립트는 내 GitHub에 저장되어 있으므로 데스크톱 설치 프로그램을 가리키기 위해 원시 링크를 사용할 수 있습니다.

<div class="content-ad"></div>

![Step 2](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_1.png)

# 단계 2: Ubuntu 데스크톱 24.04 LTS 설치 프로그램에 가져오기

이 설정을 테스트하기 위해 가상 머신 관리자에서 VM을 만들겠어요. ISO를 마운트한 후 라이브 세션으로 부팅하고 네트워크에 연결되어 있는지 확인한 다음 아래 화면에서 "자동 설치" 옵션을 선택하고 내 GitHub 구성 주소를 제공할 수 있어요.

![Automated Installation](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_2.png)

<div class="content-ad"></div>

"유회 > 확인'을 누른 후 설치 요약 화면이 표시됩니다. 여기서 구성이 성공적으로 가져와졌는지 확인할 수 있습니다.

![이미지](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_3.png)

여기까지입니다! Subiquity가 이후의 모든 작업을 처리하고 몇 분 후에 새로 설치된 데스크톱으로 다시 부팅할 수 있습니다.

참고: 자동 설치 후 첫 부팅은 스냅 설치와 같은 작업을 계속 수행하므로 보통보다 시간이 더 걸릴 수 있습니다."

<div class="content-ad"></div>

# 단계 3: 맞춤 설정된 Ubuntu 데스크톱을 즐기세요!

지정된 변경 사항이 모두 적용되었는지 확인해 봅시다!

먼저 사용자 이름과 비밀번호가 올바른지 테스트할 수 있습니다.

<img src="/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_4.png" />

<div class="content-ad"></div>

Vim, ProtonVPN, 그리고 설치된 스냅도 앱 뷰에 있습니다:

![image1](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_5.png)

마지막으로, LVM을 사용 중임을 확인하기 위해 lvdisplay를 실행할 수 있습니다.

![image2](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_6.png)

<div class="content-ad"></div>

# 로컬에서 자동 설치 구성을 호스팅하기

이 설정은 개인화를 위한 것이므로, 공개적으로 공유되어서는 안 되는 정보나 설정 세부사항을 제공해야 하는 경우가 발생할 수 있습니다.

이 경우 로컬 네트워크에서 구성을 제공하는 것이 쉽습니다. 다른 Ubuntu 기기의 디렉토리에 파일을 저장한 다음 해당 디렉토리 내에서 python3 -m http.server 8000을 실행하는 것이 가장 간단한 방법입니다.

![이미지](/assets/img/2024-06-22-GettingstartedwithAutoinstallonUbuntuDesktop2404LTS_7.png)

<div class="content-ad"></div>

설치 중에는 다음 이미지와 같이 머신 IP와 구성 파일 이름을 지정할 수 있습니다.


# 더 많은 예제 살펴보기

이 간단한 튜토리얼이 데스크탑을 표준화하고 구성하는 데 자동 설치의 힘을 이해하는 데 도움이 되기를 바랍니다. 선호하는 설정의 사용자 지정 구성을 유지 관리함으로써 Ubuntu 24.04 LTS의 각 설치를 필요에 맞게 쉽게 조정할 수 있어야 합니다.


<div class="content-ad"></div>

더 심층적인 예제 구성을 보려면 정교한 서버 사용 사례도 포함된 공식 Subiquity 예제를 확인해보세요.