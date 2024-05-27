---
title: "화면 녹화를 GIF로 변환하는 방법 macOS에서  생산성 1"
description: ""
coverImage: "/assets/img/2024-05-27-HowtoconvertyourscreenrecordingstoGIFonmacOSProductivity1_0.png"
date: 2024-05-27 12:23
ogImage:
  url: /assets/img/2024-05-27-HowtoconvertyourscreenrecordingstoGIFonmacOSProductivity1_0.png
tag: Tech
originalTitle: "How to convert your screen recordings to GIF on macOS? — Productivity #1"
link: "https://medium.com/interaction-dynamics/how-to-convert-your-screen-recordings-to-gif-on-macos-productivity-1-781dbe56fe5c"
---

프론트엔드 개발자로서, Pull/Merge Requests, 이슈 또는 Slack에서 종종 스크린샷이나 비디오 녹화를 공유해야 할 때가 많습니다.

그리고 Bitbucket과 같은 플랫폼은 이미지만 받아들이고 비디오는 받아들이지 않기 때문에 GIF가 좋은 대안이 될 수 있습니다.

그래서 저는 최근에 비디오 화면 녹화를 GIF로 쉽게 변환하는 도구를 만들었습니다. 이 도구는 빠르게 작동하며 Bitbucket에서 허용되는 크기의 작은 GIF를 생성하면서도 고해상도를 유지합니다.

결과물을 직접 확인해 보세요:

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*m8Y5EaajsmCXSZuswBiHCw.gif)

# 설치

라이브러리를 몇 개만 설치하면 됩니다:

```js
brew install ffmpeg imagemagick
# 만약 macOS 실리콘을 사용 중이라면
arch -arm64 brew install ffmpeg imagemagick
```

<div class="content-ad"></div>

그럼 해당 Apple 바로 가기를 설치해주세요: [https://www.icloud.com/shortcuts/ec417cfcb32941f7aa9316b3c44c32ff](https://www.icloud.com/shortcuts/ec417cfcb32941f7aa9316b3c44c32ff)

# 즐기세요!

macOS에서는 CMD+Shift+5를 사용하여 화면을 쉽게 녹화할 수 있어요.

화면을 녹화하고 .MOV 비디오를 가지고 있다면, Finder의 컨텍스트 메뉴를 사용하여 GIF로 바꿀 수 있어요:

<div class="content-ad"></div>

<div>
  <img src="/assets/img/2024-05-27-HowtoconvertyourscreenrecordingstoGIFonmacOSProductivity1_0.png" />
</div>

배시 스크립트에서 GIF로 변환하는 옵션이 있습니다.

자세한 내용은 여기에서 확인하실 수 있습니다: [https://github.com/friedrith/productivity/blob/master/convert-video-to-gif.md](https://github.com/friedrith/productivity/blob/master/convert-video-to-gif.md)

만약 이 도구가 유용하다고 생각된다면, 이 저장소에 스타를 부탁드리거나 이 게시물 아래에 댓글을 남겨주세요.

<div class="content-ad"></div>

![image](https://miro.medium.com/v2/0*n3UdPtw5l6xSikMW.gif)

안녕하세요! 제 이름은 티볼트이고, Ux 엔지니어로 일하고 있습니다. Ux, 코드 기술, 생산성, 과학 소설 등에 열정을 가지고 있습니다. 매달 새로운 기사를 게시하고 있어요. 이런 주제에 관심이 있다면, 제 Medium 페이지를 팔로우해주세요: https://medium.com/@thibault-friedrich.
