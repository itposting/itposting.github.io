---
title: "GenPiCam - 생성적 AI 카메라"
description: ""
coverImage: "/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_0.png"
date: 2024-05-27 13:51
ogImage:
  url: /assets/img/2024-05-27-GenPiCam-GenerativeAICamera_0.png
tag: Tech
originalTitle: "GenPiCam - Generative AI Camera"
link: "https://medium.com/@simon-aubury/genpicam-generative-ai-camera-dfd8123ac6f6"
---

![image](https://miro.medium.com/v2/resize:fit:1268/1*eZzfeCJggafmHaYGcjqEDA.gif)

이 프로젝트의 무거운 처리와 진정한 지혜는 머신 러닝 기반 이미지 생성기를 사용하는 외부 서비스인 Midjourney가 처리합니다. GenPiCam은 두 가지 Midjourney 능력을 활용합니다.

- 존재하는 사진을 사용하여 이미지에 대한 텍스트 설명 프롬프트를 생성하는 "Describe"
- 자연어 프롬프트를 이미지로 변환하는 "Imagine"

이 두 단계 사이에서 나는 창의적 입력 수준을 허용하므로 GenPiCam 카메라에는 최종 이미지의 스타일을 조정하는 다이얼이 있습니다. 이것은 본질적으로 생성된 이미지에 "애니메이션", "팝 아트" 또는 "미래적" 영향을 더하는 필터가 되게 됩니다.

<div class="content-ad"></div>

# 지루해요 — 비디오를 보고 싶어요?

물론이죠 — 여기 2분 요약 영상이 있어요

# "사진" 프로세스

초기 사진 이미지는 라즈베리 파이 카메라 모듈로 촬영됩니다. 외부 카메라 셔터(라즈베리 파이 GPIO 핀에 연결된 푸시 버튼)를 누르면 정지 이미지를 촬영하고 사진을 jpeg 이미지로 저장합니다.

<div class="content-ad"></div>

![GenPiCam-GenerativeAICamera_0](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_0.png)

이 사진은 Midjourney에 업로드되었는데, 기존 사진을 시작으로 이미지에 대한 텍스트 설명 프롬프트를 생성합니다. 궁금하신 분들을 위해, 저는 PyAutoGUI를 사용하여 매우 서투른 봇 상호 작용을 마우스와 키보드를 제어하는 데 사용하고 있습니다(API가 없기 때문에) — 이것은 쓰면 안 되는 코드의 예제가 될 수 있도록 해주세요.

Midjourney의 describe 도구는 이미지를 입력으로 받아와 텍스트 프롬프트를 생성합니다. 이는 "텍스트를 이미지로" 하는 일반적인 과정을 반대로 해서 사진을 시작으로 이미지의 본질을 설명하는 텍스트를 추출하는 매우 탐구적인 서비스입니다. 여기에는 Snowy가 있지만 Midjourney에는 훨씬 더 표현력이 풍부한 설명이 있습니다.

![GenPiCam-GenerativeAICamera_1](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_1.png)

<div class="content-ad"></div>

"describe" 함수는 실제로 이미지를 기반으로 네 가지 설명을 반환하지만, GenPiCam은 임의로 첫 번째 설명을 선택합니다.

이제 재미난 부분이 시작됐어요. 우리는 그 텍스트 프롬프트를 가져와서 새로운 이미지를 Generative AI를 사용하여 Midjouney imagine에 새로운 호출로 만들 수 있어요. 이전 텍스트 프롬프트에서 생성된 이미지가 여기 있어요.

![image](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_2.png)

GenPiCam에는 스타일 지시 사항으로 텍스트 프롬프트를 업데이트하는 선택 스위치가 있어요.

<div class="content-ad"></div>

![image](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_3.png)

라즈베리 파이 GPIO 핀에 연결된 12진 스위치입니다. 현재 "예술적 선택"을 읽어서 GenPiCam이 텍스트 프롬프트에 "레트로 팝 아트 스타일 일러스트"와 같은 접두사를 추가할 것입니다. 다른 스타일 프롬프트 중 일부는 다음과 같습니다.

- 애니메이션 스타일
- 초현실주의, 다양한 모자와 풍선이 있는 화려한 히퍼리얼리즘
- 흐릿한 브러시 스트로크
- 우주 정거장에서 초현실주의인 미래주의

눈이 내린 이미지의 "팝아트" 이미지를 보겠습니다.

<div class="content-ad"></div>


[![](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_4.png)](https://example.com)

The final image is created using the Pillow Python imaging library and consists of:

- The initial photo taken by the Raspberry Pi camera module, resized on the left
- The final Midjouney image—the first of four images is selected, composited to the right
- Text prompt—against a colored background and icon signifying the style mode

Here's the same process, but adding the text “Hyper-Realistic, whimsical with a colorful hat and balloons”.


<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_5.png)

우측 이미지가 Generative AI로 만들어진 것임에도 불구하고, 스노위의 비평적인 시선을 통해 실망감이 느껴집니다.

# Generative AI 이미지 — 배운 점

GenPiCam 카메라를 구축하는 데 정말 즐겁게 시간을 보냈고, 이는 Generative AI에 대한 프립트 엔지니어링을 탐구하는 흥미로운 경로였습니다. 더 좋았던 사진들은 단순한 구성을 가진 것들이었는데, 즉, 말로 표현하기 쉬운 이미지였습니다. 예를 들어, 이 장면은 색상과 명확한 객체로 쉽게 설명할 수 있습니다.


<div class="content-ad"></div>


![Generated Image 1](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_6.png)

However, there were some very strange results while describing more unique scenes. I found the description of a classic Australian clothesline created an unusual image.

![Generated Image 2](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_7.png)

One of my favorite reimagined images was the identification of my laser mouse. It turns out a laser mouse has multiple meanings leading to a striking result.


<div class="content-ad"></div>


![GenPiCam Hardware](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_8.png)

# 하드웨어

GenPiCam의 가장 세련되지 않은 부분은 서둘러 조립한 하드웨어입니다. 만약 당신이 자신만의 현실 왜곡 카메라를 만들고 싶다면, 아래 항목이 필요합니다.

- RaspberryPi 4가 설치된 Raspberry Pi OS
- Raspberry Pi 카메라 모듈 v2
- Raspberry Pi용 터치스크린 모니터
- 12개의 PCB 회전 스위치
- 푸시버튼 (순간접촉)
- 폴리카보네이트 케이스
- 재충전 가능한 배터리 팩


<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_9.png" />

가장 아름다운 빌드는 아닐지 몰라요. 하지만 이건 기능성이 뛰어나다는 점으로만 용서하겠습니다.

<img src="/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_10.png" />

# 요약, 코드 및 크레딧

<div class="content-ad"></div>

GenPiCam은 생성 AI를 탐험하는 재미있는 방법이었어요. 그림을 스타일에 맞게 변환해주는 (때로는 놀랄만한) 이미지들을 만들어내죠.

![GenPiCam](/assets/img/2024-05-27-GenPiCam-GenerativeAICamera_11.png)

## 크레딧

- Ned Letcher — Midjourney의 describe 기능을 보여줌으로써 저를 영감받게 한 분이자 이미지를 재창조하는 개념을 제공해준 분
- Michael King의 'Midjourney 이미지 다운로드하는 Discord 봇 만들기' — Midjourney와 상호작용하기 위한 Python 자동화 및 Discord 봇 설정을 보여주는 훌륭한 글
- Midjourney — 봇 채널을 위한 Midjourney 명령 구문
- discord.py — Discord를 위한 Python API 래퍼

<div class="content-ad"></div>

## 코드

[https://github.com/saubury/GenPiCam](https://github.com/saubury/GenPiCam)
