---
title: "리눅스의 Debian 또는 다른 리눅스에서 명령 줄을 사용하여 NerdFont또는 다른 글꼴을 설치해 보세요"
description: ""
coverImage: "/assets/img/2024-06-20-InstallNerdFontoranyfontsusingthecommandlineinDebianorotherLinux_0.png"
date: 2024-06-20 14:23
ogImage: 
  url: /assets/img/2024-06-20-InstallNerdFontoranyfontsusingthecommandlineinDebianorotherLinux_0.png
tag: Tech
originalTitle: "Install NerdFont (or any fonts) using the command line in Debian (or other Linux)."
link: "https://medium.com/@almatins/install-nerdfont-or-any-fonts-using-the-command-line-in-debian-or-other-linux-f3067918a88c"
---



![이미지](/assets/img/2024-06-20-InstallNerdFontoranyfontsusingthecommandlineinDebianorotherLinux_0.png)

요즘 LazyVim을 설치하고 있는데 NerdFonts를 설치해야 해요. 인터넷에서 알아보니 터미널을 사용해서 편하게 설치할 수 있다는 걸 알게 됐어요. 아래는 설치 방법입니다.

- NerdFonts 웹사이트에 들어가서 원하는 글꼴을 다운로드 섹션에서 선택하세요.
- 다운로드 버튼을 마우스 오른쪽 버튼으로 클릭하고 링크 주소 복사를 선택하세요 (브라우저에 따라 조금 다르지만 글꼴 링크를 얻는 건 중요합니다).
- 터미널을 열어주세요.
- 아래 명령어를 복사하신후 방금 복사한 링크로 업데이트해주세요.

```js
wget -P ~/.local/share/fonts https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip \
&& cd ~/.local/share/fonts \
&& unzip JetBrainsMono.zip \
&& rm JetBrainsMono.zip \
&& fc-cache -fv
```

<div class="content-ad"></div>

그것이에요. 그것은 글꼴을 다운로드하고 설치할 것입니다.

그런 다음, 효과를 보기 위해 LazyVim을 다시로드할 수 있어요.

이 게시물이 유용했기를 바래요. 건배!