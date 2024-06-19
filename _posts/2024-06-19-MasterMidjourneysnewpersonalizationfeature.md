---
title: "마스터 미드조니의 새로운 개인화 기능"
description: ""
coverImage: "/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_0.png"
date: 2024-06-19 21:05
ogImage: 
  url: /assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_0.png
tag: Tech
originalTitle: "Master Midjourney’s new personalization feature"
link: "https://medium.com/design-bootcamp/master-midjourneys-new-personalization-feature-a45d4aa72e54"
---


# 매개변수 명령어: --p

이 매개변수는 무엇을 의미할까요? Midjourney를 사용하여 이미지를 생성할 때 여러 매개변수가 일반적으로 사용됩니다.

- --ar: 이는 이미지 비율을 나타냅니다. 예를 들어, 정사각형 이미지의 경우 1:1, 긴 이미지의 경우 4:3, 넓은 이미지의 경우 3:4로 나타낼 수 있습니다.
- --v / --niji: 이는 모델 버전을 나타냅니다. 안정적인 확산과 달리 여러 다양한 모델을 가지는 것이 아니라, Midjourney는 V의 현실적인 버전과 Niji의 애니메이션 버전으로 나뉩니다. 다양한 모델 대신 Midjourney는 사이버펑크, 초현실주의, 중국 묵화, 일본 우키요에, 스케치와 같은 이미지 스타일을 제어하기 위해 스타일 프롬프트 또는 다른 예술가를 사용합니다.
- --s: 이는 스타일 강도를 나타냅니다. --s를 사용하여 개인화 효과의 강도를 조절할 수 있습니다 (0부터 1000까지 범위, 1000이 최대값).

전통적으로 이러한 매개변수는 출력물의 형태를 형성하는 데 도움이 되지만, 이들은 여전히 Midjourney의 "기본 스타일"에 영향을 받으며, 커뮤니티 트렌드에 영향을 받습니다. 이미지 참조와 스타일 일관성과 같은 매개변수가 있더라도, 스타일을 제어하는 능력은 안정적인 확산과 비교하여 제한되어 있습니다.

<div class="content-ad"></div>

`--p` 매개변수 명령어를 입력하세요. 이 혁신은 Midjourney의 기본 스타일을 사용자의 취향으로 교체할 수 있게 해줍니다. 사용자의 취향을 학습하여 모델의 훈련 데이터로부터 편견을 줄이고 개인적인 스타일을 더 잘 반영할 수 있습니다.

![이미지](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_0.png)

# 모델 개인화하는 방법

LoRA와 유사하게 Stable Diffusion 안에서 Midjourney의 개인화는 사용자의 취향에 맞게 모델을 훈련시키기 위해 초기 설정이 필요합니다. 다음은 그 방법입니다:`

<div class="content-ad"></div>

1️⃣ Midjourney 웹 사이트에 방문해주세요: Midjourney 웹 사이트를 방문해주세요.

2️⃣ 할 일 목록으로 이동: 왼쪽에 있는 "Tasks" 버튼을 클릭해주세요.

![Tasks](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_1.png)

3️⃣ 이미지 순위 매기기: 왼쪽에서 "이미지 순위 매기기"를 선택해주세요.

<div class="content-ad"></div>

![마스터미드 새로운 개인화 기능](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_2.png)

4️⃣ 좋아하는 것 선택하기: 시스템이 다양한 이미지를 제시합니다. 원하는 이미지를 클릭하여 선택하세요. 마우스를 사용하거나, 좋아요는 1번, 싫어요는 2번, 확실하지 않다면 건너뛰기는 3번을 누를 수 있어요.

![마스터미드 새로운 개인화 기능](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_3.png)

5️⃣ 최소 200개의 이미지 그룹 선택: 필요한 선택 수에 도달하면 대화상자가 완료를 확인합니다. 때로는 시스템이 선택 동작을 확인하여 초록색 O 또는 빨간 ❌이 나타날 수 있어요. 반드시 초록색 O를 선택하세요.

<div class="content-ad"></div>

6️⃣ 완료 확인: 개인화된 스타일 모델의 완료를 확인하려면 디스코드에서 명령어 /info를 입력하세요.

![Image](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_4.png)

# 사용 방법 --p

개인화된 스타일을 적용하려면 프롬프트의 끝에 --p를 추가하세요.

<div class="content-ad"></div>

예를 들어:

결과는 다음과 같이 나타납니다:

<img src="/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_5.png" />

프롬프트 뒤에 --p를 추가하면 자동으로 변환됩니다.

<div class="content-ad"></div>

이러한 효과가 발생할 것입니다:

![image](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_6.png)

개인화를 활성화하면 프롬프트에 숏코드가 추가되어 공유 가능하며, 다른 사람들이 당신의 개인화된 모델을 사용할 수 있게 됩니다. 스타일은 순위가 매겨진 이미지의 수에 따라 동적으로 발전합니다.

-s를 사용하여 개인화 효과의 강도를 조절할 수 있습니다 (0은 끄고, 1000은 최대이며, 100은 기본값입니다).

<div class="content-ad"></div>

예를 들어:

![image1](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_7.png)

![image2](/assets/img/2024-06-19-MasterMidjourneysnewpersonalizationfeature_8.png)

# 결론

<div class="content-ad"></div>

중간여정의 새로운 맞춤화 기능에 감격받았어요. 각자의 특별한 취향을 가지고 있기 때문에, 이는 이미지 스타일의 폭이 넓어지고 생성된 이미지의 다양성이 커지는 것을 의미해요.

지금 바로 당신이 선호하는 이미지들을 순위를 매겨보고, 맞춤화의 힘을 탐험하며, AI 창작의 끝없는 가능성을 체험해보세요.

```js
참고:
공식 계정: 阿杰AI绘画
공식 계정: 葉子说AI绘画
```

💡더 깊이 파고들고 싶나요? 제 중간여정 컬렉션이 여러분을 기다리고 있어요.

<div class="content-ad"></div>

## 이 기사를 좋아하셨나요?

그렇다면:

- 댓글 남기기
- 업데이트 팔로우하기
- 무료 이메일 알림