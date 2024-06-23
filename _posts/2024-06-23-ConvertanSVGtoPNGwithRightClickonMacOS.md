---
title: "MacOS에서 우클릭으로 SVG를 PNG로 변환하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-ConvertanSVGtoPNGwithRightClickonMacOS_0.png"
date: 2024-06-23 15:34
ogImage: 
  url: /assets/img/2024-06-23-ConvertanSVGtoPNGwithRightClickonMacOS_0.png
tag: Tech
originalTitle: "Convert an SVG to PNG with Right Click on MacOS"
link: "https://medium.com/@instanceofMA/convert-an-svg-to-png-with-right-click-on-macos-2353d151f4eb"
---


## 맥용 바로 가기(Mac Shortcut)를 만들었습니다. 이제는 SVG 파일을 오른쪽 클릭하면 쉽게 변환할 수 있어요.

Apple Shortcuts은 매우 강력합니다. 특히

- 접근성: Finder 안에서 어떤 파일이든 오른쪽 클릭해서 호출할 수 있어요.
- 확장성: Apple이 허용하는 것에 한정되지 않고, 바로 가기로 쉘 스크립트를 실행할 수 있어요.

저는 일상적인 작업 흐름에서 만나는 모든 큰 작업과 작은 작업에 대해 한계까지 테스트해보았어요. 최근에는 제 스타트업의 로고를 개인 웹사이트(instanceofma.com)에 넣어야 했는데, 해당 웹사이트는 JPG와 PNG 형식의 이미지만 허용했어요. (SVG 형식은 허용 안 한다네요. mmm.page, 기능 요청?). 가장 빠른 방법은 스타트업 웹사이트(grandeur.dev)에서 SVG 로고를 다운로드하여 PNG로 변환하는 것이었어요.

<div class="content-ad"></div>

이전에는 온라인 SVG를 PNG로 변환하는 도구를 사용했었는데, SVG 파일을 먼저 업로드하고 PNG 파일을 다운로드하는 것이 번거로워졌어요. 그래서 Mac에서 네이티브로 변환하는 방법을 찾기 시작했어요. 선호할 만한 완전한 서드파티 앱을 설치하지 않고요.

# 함께 찾아봐요

간단한 Google 검색 "svg to png mac terminal"으로 이 스택익스체인지 쓰레드로 이동할 수 있었어요. 저는 당연히 받아들여진 답변을 테스트해보았어요:

```js
qlmanage -t -s 1000 -o . picture.svg
```

<div class="content-ad"></div>

이 명령은 MacOS의 내장 Quick Look 유틸리티를 사용하여 picture.svg를 1000픽셀 폭의 picture.svg.png로 변환합니다. 동작했다면 이상적인 해결책일 것입니다.

하지만 동작하지 않았습니다!

로고를 1000픽셀로 크기 조정하는 것이 아니라, 작은 로고가 왼쪽 상단에 있는 1000픽셀 크기의 잘라내기 이미지를 만들고 있었습니다. 브라우저에서 SVG를 열고 전체 페이지 스크린샷을 찍은 것과 같은 결과였죠.

![image](https://miro.medium.com/v2/resize:fit:1400/1*n_bXjdTKI9A9A7a6G1BJqw.gif)

<div class="content-ad"></div>

댓글을 읽어보다가 교환소에서 두 번째로 투표를 많이 받은 답변을 발견했어요.

```js
rsvg-convert -h 32 icon.svg > icon-32.png
```

이 방법의 작은 불편함은 먼저 rsvg-convert 유틸리티를 설치해야 한다는 점이었어요. 저는 Homebrew를 사용하고 있어서 쉽게 설치했지만, 사용하시는 분이 Homebrew를 사용하지 않는다면 curl을 이용해 설치할 수 있어요:

```js
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh
```

<div class="content-ad"></div>

잠시 걸릴 거에요, 그러나 작업이 완료되면 아래 명령을 실행할 수 있어요:

```js
brew install librsvg
```

이 작업도 완료되면 테스트할 수 있어요:

```js
rsvg-convert -h 32 icon.svg > icon-32.png
```

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*a0Cymm6wqoRodfEsCVT_iQ.gif)

IT WORKED!

We could increase the size of the image by increasing the height from 32 to 512.

![image](https://miro.medium.com/v2/resize:fit:1400/1*t6BVyI5R-zLMPZaD70ROUA.gif)


<div class="content-ad"></div>

이제 깔끔한 단축키로 묶어 보겠습니다.

# SVG를 PNG로 변환하는 단축키 만들기

Cmd+Space를 눌러 검색하고 Shortcuts를 입력한 후 Enter 키를 누릅니다. Plus(+) 아이콘을 클릭하여 새로운 단축키를 만듭니다. 단축키의 이름을 PNG으로 지정하세요.

![Shortcut](https://miro.medium.com/v2/resize:fit:1400/1*KbLuV8j8xg-fktSLzRIFnA.gif)

<div class="content-ad"></div>

이 용어표를 마크다운 형식으로 변경해보세요.

![image](https://miro.medium.com/v2/resize:fit:1400/1*yfomL8jWK4wrdeHkhXML3Q.gif)

이제 단축키 라이브러리에서 "터미널"을 검색하고 에디터에 있는 "Run Shell Script" 작업을 드롭하세요. 다음 쉘 코드를 붙여넣으세요:

```js
# SVG를 PNG로 변환

read filePath
filename="${filePath%.*}"
echo $filename

/opt/homebrew/bin/rsvg-convert -h 512 "$filePath" > "$filename.png"
```

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*mAEu_4-WakO1GczRiwq26A.gif)

만약 zsh에 대해 이해하지 못한다면, 이 코드는 이미지의 전체 경로를 읽어옵니다 (/Downloads/logo-revamp.svg), 확장자를 제거하여 (.svg), "logo.svg"를 "logo.png"로 변환하고 높이가 512 픽셀이 되게 합니다. "echo $filename"은 파일 이름을 다음 블록에 출력합니다.

만약 Run Shell Script 작업에서 아래와 같은 오류가 표시된다면:

![error](/assets/img/2024-06-23-ConvertanSVGtoPNGwithRightClickonMacOS_0.png)


<div class="content-ad"></div>

친구야, Open Preferences를 클릭하고 Allow Running Scripts 확인란을 체크해주세요.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*q2SLFqNm8z2o8VFPdQI07w.gif)

다른 Run Shell Script 작업을 추가하고 다음 코드를 붙여넣으세요:

```js
# QuickLook에서 PNG 파일 열기

read filename
qlmanage -p "$filename.png"
```

<div class="content-ad"></div>

이전 단계에서 생성된 PNG 이미지의 미리보기를 Quick Look에서 엽니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*f28-_BTXBui4Gih_wCgWPg.gif)

마지막으로, 변환에 성공하면 알림을 보여주기 위해 "Show Notification" 액션을 추가합니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*0jh21cRZJH9D0Ne7gvAalg.gif)

<div class="content-ad"></div>

테스트해 보세요. SVG를 마우스 오른쪽 버튼으로 클릭하고 빠른 작업에서 PNG로 변환을 클릭하세요. 선택한 이미지를 바로가기에 보내 PNG로 변환하고 첫 번째 쉘 스크립트로 PNG의 미리 보기를 여는 두 번째 쉘 스크립트를 실행합니다. 미리 보기를 닫으면 성공적으로 변환되었다는 알림이 표시됩니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*gP54WRqkXTP2gtRjC5DhIw.gif)

빠른 작업에서 바로가기를 보지 못한다면, 사용자 정의를 클릭하고 PNG로 변환 확인란을 선택하세요.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*8IxUrfQzoPlCtwppPwRjtQ.gif)

<div class="content-ad"></div>

여러 개의 SVG를 한꺼번에 PNG로 변환할 수도 있습니다. 이를 위해 단축키를 조금 수정해야 합니다.

반복 실행 동작을 추가하고 실행할 셸 스크립트를 넣어주세요.

![image](https://miro.medium.com/v2/resize:fit:1400/1*06_OAoE-ajIH2WQqBRx2zA.gif)

이렇게 하면 선택한 모든 SVG를 PNG로 변환하지만 첫 번째 PNG만 미리보기할 수 있습니다(모든 PNG가 아닙니다). 그리고 50개의 변환된 PNG를 각각 미리보기에서 열면 현명한 선택이 아닐 수 있습니다. 그래서 한 이미지인 경우 (변환 후에 미리보기 표시)와 여러 이미지인 경우 (알림만 표시)에 따라 다른 동작을 설정했습니다.

<div class="content-ad"></div>


![Image 1](https://miro.medium.com/v2/resize:fit:1400/1*_vJG-e_eUOTTuk-R4IJDBw.gif)

That’s it! You can now convert as many SVGs to PNGs in two clicks.

![Image 2](https://miro.medium.com/v2/resize:fit:1400/1*lMt8PxVXiY4zwbx-AsPakA.gif)

# Install the full shortcut 👇


<div class="content-ad"></div>

원하는 만큼의 바로 가기를 만들고 싶지 않다면, 제가 만든 것을 설치하고 하루를 계속하세요: [https://www.icloud.com/shortcuts/e9e0496605d343f7bb50fd93c5905164](https://www.icloud.com/shortcuts/e9e0496605d343f7bb50fd93c5905164)

터미널에서 다음 명령어를 실행하여 librsvg를 설치해야 합니다:

```js
brew install librsvg
```

당신의 바로 가기가 스크립트를 실행하도록 허용하는 문제와 rsvg-convert의 경로(/opt/homebrew/bin이 대부분입니다만 시스템에 따라 확인해 주세요)만 문제가 될 수 있습니다.

<div class="content-ad"></div>

# 어떡하지?

단축키는 생산성을 높이는 훌륭한 방법이에요. 그래서 현재의 작업 흐름을 떠나지 않고도 사소한 작업을 처리할 수 있어요. 다음 글에서는 비디오를 GIF로 변환하는 단축키, 그리고 mp4를 webm으로 변환하는 ffmpeg을 사용한 단축키를 만들 거에요.

그때까지!