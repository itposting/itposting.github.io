---
title: "우분투를 macOS처럼 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_0.png"
date: 2024-06-20 14:36
ogImage: 
  url: /assets/img/2024-06-20-MakeUbuntulooklikeMacOS_0.png
tag: Tech
originalTitle: "Make Ubuntu look like MacOS"
link: "https://medium.com/featurepreneur/make-ubuntu-look-like-macos-fd11c6ccf83a"
---


<img src="/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_0.png" />

개발자들이 윈도우 시스템보다 맥북을 선호한다는 사실은 무시한다면, 모두가 맥북을 사용하는 것을 좋아합니다. 그 주된 이유는 제공되는 사용자 인터페이스 때문입니다. 우분투 OS를 사용하는 가장 큰 장점은 우리의 요구에 맞게 사용자 정의할 수 있다는 것입니다. 

이 기사에서는 우분투 OS를 MacOS Big Sur처럼 보이게 만드는 방법을 살펴볼 것입니다.

아래 단계를 따라 하면 끝에 시스템이 맥북(OS)처럼 보이게 됩니다.

<div class="content-ad"></div>

# GNOME TWEAKS 설치하기

```js
sudo apt install gnome-tweaks
```

![이미지](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_1.png)

# WhiteSur GTK 테마 설치하기

<div class="content-ad"></div>

우선, WhiteSur GTK 테마를 설치해야 합니다. 이 테마는 macOS Big Sur와 동일한 애플리케이션 창, 창 버튼, 상단 패널 및 독을 제공합니다. 테마를 설치하려면 먼저 몇 가지 명령을 실행해야 합니다. 터미널에서 다음 명령을 실행하세요.

```js
sudo apt install gtk2-engines-murrine gtk2-engines-pixbuf
```

다음으로, 다음을 실행하세요.

```js
sudo apt install sassc optipng inkscape libglib2.0-dev-bin
```

<div class="content-ad"></div>

위의 2개 명령어는 필요한 종속성을 설치합니다. 종속성을 설치하면 WhiteSur GTK 테마를 설치할 수 있습니다. 그럴 때는 다음 명령어 세트를 실행하세요.

```js
git clone https://github.com/vinceliuice/WhiteSur-gtk-theme
cd WhiteSur-icon-theme/
./install.sh
```

![이미지](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_2.png)

![이미지](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_3.png)

<div class="content-ad"></div>

https://chrome.google.com/webstore/detail/gnome-shell-integration/gphhapmejobijbbhgpjhcjognlahblep

이제 GNOME TWEAKS로 이동해주세요.

Tweaks에서 외관 탭으로 이동하고, Applications 및 Shell 값을 "WhiteSur-dark"로 변경해주세요. 다른 WhiteSur 테마들도 여러 개 있으니, 다른 테마 중 하나를 시도해보세요.

![이미지](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_4.png)

<div class="content-ad"></div>

# 아이콘 테마

와이트서 아이콘 테마는 동일한 와이트서 테마 디자이너에 의해 생성되었습니다. 설치 과정도 매우 유사하며 아래는 설치 명령어입니다.

```js
git clone https://github.com/vinceliuice/WhiteSur-icon-theme.git
cd WhiteSur-icon-theme/
./install.sh
```

<img src="/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_5.png" />

<div class="content-ad"></div>

이제 GNOME TWEAKS로 이동해 주세요.

GNOME Tweaks에서 외모 탭으로 이동해서 Icons의 값을 BigSur-dark로 변경해 주세요. BigSur라는 옵션이 있고, 이는 밝은 테마와 함께 사용할 수 있습니다.

# Dash to Dock

다음에는 Ubuntu Dock에 마지막 손짓을 해야 합니다. Ubuntu는 이미 도크를 하단으로 이동할 수 있는 옵션을 제공하고 있습니다. 그러나 도크의 폭과 아이콘 크기를 수정할 수 있는 옵션이 없습니다.

<div class="content-ad"></div>

그러므로, 우리는 인기 있는 타사 확장 프로그램인 "Dash to Dock"을 사용할 것입니다. 이는 도크를 하단으로 옮길 수 있을 뿐만 아니라 열린 응용 프로그램의 수에 따라 도크의 크기를 조정할 수 있습니다. 게다가 저는 도크 상의 아이콘 크기를 수정하여 macOS 도크와 유사하게 55픽셀로 유지했습니다.

다운로드 링크: [https://extensions.gnome.org/extension/307/dash-to-dock/](https://extensions.gnome.org/extension/307/dash-to-dock/)

![이미지](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_6.png)

# 마법 램프 효과

<div class="content-ad"></div>

마지막으로, 매직 램프 효과를 적용해야 합니다. 이는 macOS에서 창을 최소화할 때 트리거되는 애니메이션입니다. 이 효과는 Ubuntu의 GNOME 데스크톱 환경으로도 이식되었습니다. 이를 설치하려면 단순히 "Compix alike magic lamp effect"라는 GNOME 익스텐션을 설치하면 됩니다. 익스텐션을 설치한 후에는 전체 macOS 룩을 완성할 수 있습니다.

다운로드 링크: [https://extensions.gnome.org/extension/3740/compiz-alike-magic-lamp-effect/](https://extensions.gnome.org/extension/3740/compiz-alike-magic-lamp-effect/)

![매직 램프 효과](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_7.png)

# 배경화면

<div class="content-ad"></div>


![Make Ubuntu look like MacOS 8](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_8.png)

![Make Ubuntu look like MacOS 9](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_9.png)

![Make Ubuntu look like MacOS 10](/assets/img/2024-06-20-MakeUbuntulooklikeMacOS_10.png)

And that is it, Congratulations!!!


<div class="content-ad"></div>

시스템이 이제 빅 서를 사용하는 맥북처럼 보일 것입니다.

질문이 있으시면 댓글로 남겨주세요!