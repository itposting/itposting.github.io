---
title: "챗GPT 디자인 해킹 - 사용자의 99가 이것을 모른다"
description: ""
coverImage: "/assets/img/2024-06-19-ChatGPTDesignHack99ofUsersDontKnowThis_0.png"
date: 2024-06-19 03:21
ogImage: 
  url: /assets/img/2024-06-19-ChatGPTDesignHack99ofUsersDontKnowThis_0.png
tag: Tech
originalTitle: "ChatGPT Design Hack — 99% of Users Don’t Know This"
link: "https://medium.com/@addison-best/chatgpt-design-hack-99-of-users-dont-know-this-313626f58696"
---


## 챗GPT를 5성급 그래픽 디자이너로 변신시키기

챗GPT(GPT-4o)가 진지한 그래픽 디자이너 업그레이드를 받았어요. 이게 아직 작동하는 건지 확실하지 않아요...이렇게 사용된 걸 본 적이 없어요.

![이미지](/assets/img/2024-06-19-ChatGPTDesignHack99ofUsersDontKnowThis_0.png)

챗GPT를 그래픽 디자이너로 활용하는 방법에 대해 YouTube 동영상을 만들었어요. 프롬프트만으로 YouTube 섬네일, 소셜 미디어 그래픽 등을 만들어보세요.

<div class="content-ad"></div>

이 튜토리얼에서는 ChatGPT를 Photoshop이나 Canva와 유사한 디자인 도구로 변환하는 방법을 보여 드리겠습니다. ChatGPT만을 이용하여 아래에서 보는 배경 이미지와 같은 멋진 디자인을 만드는 방법을 배울 수 있습니다.

![ChatGPT Design](/assets/img/2024-06-19-ChatGPTDesignHack99ofUsersDontKnowThis_1.png)

이제 레이어와 오버레이를 추가할 수 있습니다.

이 디자인 핵은 무한한 가능성을 여는 방법입니다. 오랜 시간 동안 시도해 왔습니다.

<div class="content-ad"></div>

이번 업데이트는 엄청 커요.

이전에는 DALL·E-3에서 그래픽을 만들 수 있었지만, 그것들은 레이어가 없는 이미지였어요. ChatGPT에게 재밌고 흥미로운 디자인과 그래픽을 만들라고 할 수 있었지만, 그것들은 평면적이었어요. 아무것도 변경할 수 없었죠.

어떤 것이든 설계한 적이 있다면, 포토샵이나 캔바와 같은 도구에서 디자인이 이루어지는 곳이 레이어인 것을 아실 거예요.

이것들이 없으면 굉장히 제한되어요.

<div class="content-ad"></div>

위의 YouTube 썸네일은 여러 디자인 자산을 사용하여 레이어와 오버레이를 만들기 위해 프롬프트를 사용해 완전히 생성되었습니다.

배경, 로고, 제 자신의 cutout 배경 이미지 및 폰트(Open Sans)를 포함한 이미지를 프롬프트만으로 만들었습니다. 심지어 폰트 픽셀 크기까지 정의했죠.

마진 및 패딩 CSS 규칙으로 완전히 원하는 대로 만들 수 있습니다.

# 전체 YouTube 썸네일 만드는 방법입니다

제목 | 설명
----|----
Step 1 | 배경과 로고 추가
Step 2 | 자신의 cutout 이미지 추가
Step 3 | 폰트(Open Sans) 적용
Step 4 | 마진과 패딩 CSS 규칙 적용

<div class="content-ad"></div>

시작하기 전에 몇 가지 에셋이 필요합니다:

- Cutout Image: 투명 배경이 있는 PNG 이미지, 자신이나 다른 주제의 이미지입니다. 이미 가지고 있지 않은 경우 무료 온라인 사진 편집 도구를 사용하여 만들 수 있습니다.
- Logo: 투명 배경이 있는 PNG 형식의 브랜드 로고입니다.

이 튜토리얼에서 제가 사용한 것은:

- 투명 배경을 가진 내 사진
- AI Growth Guys 로고 (여러분의 로고 선택)

<div class="content-ad"></div>

아래는 전적으로 프롬프트에 의해 생성되었습니다. 프롬프트를 사용하여 원하는 레이어나 에셋을 추가할 수 있습니다.

## 배경 차원 설정하기

- 배경 크기 지정: ChatGPT에게 이미지의 크기를 알려주는 것으로 시작하세요. 이 예시에서는 1920x1080 픽셀의 검은색 배경을 사용했습니다.
- 텍스트 추가: ChatGPT에게 이미지에 텍스트를 추가하도록 지시하세요. 예를 들어, "상단 좌측에 흰색 120픽셀 굵은 Open Sans 글꼴을 넣고 '나는 ChatGPT를 포토샵으로 변신시킨다'라고 작성해주세요."
- 컷아웃 이미지 추가: 그다음 컷아웃 이미지를 업로드하세요. ChatGPT가 이를 왜곡하지 않고 전체 이미지를 사용하도록 지정해야 합니다.

## 로고 배치하기

<div class="content-ad"></div>

- 초기 배치: 먼저 ChatGPT에게 로고를 왼쪽 하단에 배치하도록 지시하세요. 너무 크게 나오거나 원하는 위치에 없다면 크기와 위치를 조정해보세요.
- 크기 조정: 로고가 너무 크다면 ChatGPT에게 원하는 크기로 조절하도록 요청하세요. 저는 원본 크기의 25%로 조정했고, 왼쪽 하단에 배치했습니다.

ChatGPT는 지침과 HTML을 이해합니다. 그래서 간격과 크기에 관한 일반적인 규칙을 말할 수 있어요.

# 마지막 손질 — 몇 번의 반복이 필요할 거예요.

- 색상 조정: 텍스트를 두드러지게 하기 위해 색상을 변경할 수 있어요. 예를 들어, 'Photoshop'이라는 단어를 빨간색으로 바꾸도록 ChatGPT에게 요청했고, 나머지 텍스트는 흰색으로 유지했어요.
- 필요한 경우 재배치: 요소들이 예기치 않게 움직일 때, ChatGPT에게 재배치하도록 요청하세요. 예를 들어, 'Photoshop' 단어는 원래 위치에 유지하고 색상만 변경하도록 ChatGPT에게 지시했어요.
- 또한 ChatGPT에게 텍스트를 여러 줄로 배치하도록 지시해야 했어요. 처음에는 전체 텍스트가 한 줄에 있었는데, 맞지 않았어요. 한 번의 지시만으로 두 줄로 변경하도록 지시했어요.

<div class="content-ad"></div>

# 최종 조정 및 내보내기

모든 조정을 마친 후 멋진 최종 이미지가 나와야 합니다. 이를 소셜 미디어, YouTube 썸네일 또는 다른 창의적인 프로젝트에 활용할 수 있습니다.

마지막에 문제가 생겼었어요. ChatGPT가 제 모든 레이어에 지쳐서 제 프롬프트 스레드를 깨는 것 같더라구요. ㅋㅋ

하지만 멋지게 작동했어요. 더 나아질 것입니다.

<div class="content-ad"></div>

저는 ChatGPT의 사용 방법, AI를 활용한 디자인, 그리고 온라인 비즈니스 성장에 대해 가르치고 있어요.

저의 👉 AI Growth Guys Newsletter 👈를 확인해보세요!

아래에서 다른 채널도 보실 수 있어요.

우리 YouTube 채널도 확인해보세요.

<div class="content-ad"></div>

당사 웹사이트에서 저희를 팔로우해주세요: AI Growth Guys