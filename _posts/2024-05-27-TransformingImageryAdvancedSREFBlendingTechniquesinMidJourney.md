---
title: "이미지 변환하기 - MidJourney의 고급 SREF 블렌딩 기술"
description: ""
coverImage: "/assets/img/2024-05-27-TransformingImageryAdvancedSREFBlendingTechniquesinMidJourney_0.png"
date: 2024-05-27 15:24
ogImage:
  url: /assets/img/2024-05-27-TransformingImageryAdvancedSREFBlendingTechniquesinMidJourney_0.png
tag: Tech
originalTitle: "Transforming Imagery — Advanced SREF Blending Techniques in MidJourney"
link: "https://medium.com/@promptdervish/transforming-imagery-advanced-sref-blending-techniques-in-midjourney-d904b3f9dbe7"
---

## MIDJOURNEY EXPLORATIONS SREFS

미드저니에서 스타일과 캐릭터 참조를 조합하여 독특하고 매력적인 이미지를 만드는 방법을 배우세요. 로맨틱 SREF ID가 70개 이상 포함되어 있습니다!

저는 MiJourney에서 독창적인 로맨틱 SREF 스타일을 수집하며 "MiJourney로 매혹적인 역사적 로맨스 표지 만들기"라는 글을 썼습니다. 그러나 하나의 글에 모두 담기에는 너무 많았어요. "MiJourney 마스터링: SREF ID를 활용한 고급 스타일 조작"이라는 이어지는 글에서 로맨틱 이미지에 대한 추가 30개 ID를 공유했고, 스타일 가중치를 조절해 프롬프트에 영향을 미치는 방법을 보여드렸어요. 오늘은 더 많은 페인터리한 로맨틱 SREF 스타일을 모아봤습니다. 아래에서 찾아보실 수 있어요. 그 전에, 스타일을 혼합하여 완전히 독특한 이미지 참조 스타일을 만드는 방법에 대해 이야기해봐요.

랜덤 SREF ID는 그 자체로 매우 극단적이고 압도적일 수 있습니다. 이전 글에서는 스타일 가중치를 줄여 영향을 줄이는 방법을 보여드렸어요. 이제 약간의 변화를 섞어 새로운 것을 만들어봅시다. 아래에서 세 가지 간단한 혼합을 보여드릴게요. 왼쪽 이미지는 스타일 참조 없이 만든 것으로, 우리 왕자와 공주에게 "가장 현실적인 사진" 스타일을 주기 위해 원시적이고 매우 낮은 스타일을 사용했어요.

<div class="content-ad"></div>


전문 스튜디오 초상 사진. 더블렛을 입은 왕자와 빨간 머리 공주가 유니크한 의상을 입고 서로 마주보며 서로를 사랑스럽게 바라봅니다. 렘브란트 조명 사용. --ar 2:3 --style raw --stylize 1


그런 다음, 임의의 SREF ID를 사용한 이미지 중 하나와 함께 이를 결합했습니다. 어떤 추가적인 것도 없이 간단히 혼합했습니다. 이 조합을 통해 원본 이미지를 밝게하고 배경을 약간 변경하고자 했습니다. 그들이 밝아졌고, 그녀의 드레스가 파란색에서 흰색으로 바뀐 것을 주목해주세요.


https://s.mj.run/h-qSBRaD4DE https://s.mj.run/CCRptYYRWv8 --ar 2:3


다음 조합에서는 밝히고 배경을 추가하려고 시도했습니다. 그렇게 성공적이었습니다: 그녀의 드레스가 밝아지고, 그의 의상에 일부 새로운 붉은 색 디테일과 금 장식이 생겼습니다. 아치 형태에 조금 놀라웠지만, 실제로 #3는 상당히 멋져 보입니다.



<div class="content-ad"></div>



https://s.mj.run/h-qSBRaD4DE https://s.mj.run/uZ36l-hDQsE --ar 2:3

With the next one, I tried once again for a brighter sky. Midjourney felt that a more dynamic sky was needed, so my bright sky turned into a sunset. I found the rim lighting on the prince and princess to be an interesting and quite dynamic touch. In this variant, her dress was not recolored, but his suit has gained many embellishments.

https://s.mj.run/L1_rPjYej0k https://s.mj.run/h-qSBRaD4DE --ar 2:3

I decided to take another step towards flamboyance for a more striking difference in the images. Firstly, I have combined them as simple image references.



<div class="content-ad"></div>


https://s.mj.run/h-qSBRaD4DE https://s.mj.run/l7tQBc4KhhA 햇빛이 비치는 테라스에서 더블렛을 입은 왕자와 새틴 드레스를 입은 공주가 함께 있는 모습; 날씨의 따뜻함이 그 들의 사랑을 반영하며, 테라스는 숨막히는 풍경을 제공합니다. 이 디자인은 역사적 로맨스 소설 표지와 비슷한 스타일로 만들어졌어요. --ar 2:3

이 중간 이미지는 꽤나 독특한 SREF ID로부터 왔어요. 간단한 참조 이미지 조합이 배경에 생동감을 불어넣고 그들의 의상을 환한 장식물로 꾸밉니다. 이제 우리는 조금의 발화를 더해볼게요. 아래 코드는 동일한 두 이미지를 왼쪽 이미지를 캐릭터 참조로, 중간 이미지를 스타일 참조로 넣어 합쳤어요.

이 두 캐릭터에 대한 참조가 작동한다는 사실에 놀랐어요. 보통 제한은 단일 캐릭터만 가능하다고 기대하죠. 다른 종류의 프롬프트를 충분히 시도해보지 않아서 그것을 테스트할만한 겁니다. 얼굴이 가깝고 프롬프트가 유사하기 때문에 여기에서 작동한다고 의심해요. 얼굴을 섞어 동일하게 만들거나 하는 것으로 생각했는데 그런 것 같아 보이지 않았어요.


<div class="content-ad"></div>

--cref이 왼쪽 이미지에는 원본에 가까운 옷을 유지하면서 배경을 완전히 변경할 수 있어서 좋은 결과를 얻을 수 있어요. 그런데 만약 옷도 바꾸고 싶다면 어떻게 할까요? --cw 50을 사용하여 캐릭터 가중치를 낮추면(기본값 100에서) 변경할 수 있어요.

```js
a prince in a doublet and a princess in a satin gown on a sunlit terrace; the warmth of the day reflecting their love; the terrace offering a breathtaking view, in the style of historical romance novel cover --ar 2:3 --sref https://s.mj.run/l7tQBc4KhhA --cref https://s.mj.run/h-qSBRaD4DE --cw 50
```

--cref를 사용했음에도 불구하고 얼굴이 약간 변한 것에 유의하세요. 하지만 숫자를 낮춤으로써 옷이 중간의 sref 이미지와 더 많은 특성을 취하게 할 수 있어요. 결과가 마음에 들지만 최종 사진에는 거의 충분히 장미가 없다면 어떻게 해야 할까요? 이에 대한 해결책이 있답니다. 스타일 가중치를 증가시켜 더 매력을 부여해보세요! 아래에서 동일한 명령을 실행하고 --sw 500를 추가했어요.

```js
a prince in a doublet and a princess in a satin gown on a sunlit terrace; the warmth of the day reflecting their love; the terrace offering a breathtaking view, in the style of historical romance novel cover --ar 2:3 --sref https://s.mj.run/l7tQBc4KhhA --sw 500 --cref https://s.mj.run/h-qSBRaD4DE --cw 50
```

<div class="content-ad"></div>

그래서, 많은 일이 벌어지고 있지만 우리의 결과를 봐봐—장미들이 가득하지! 만약 당신이 모든 부분에 익숙하지 않다면, 나는 그것들을 단계별로 설명해줄게.

\[URL\] \[URL\] 이미지 참조. 당신의 프롬프트를 이끌어가기 위해 이미지 하나 이상을 포함시킬 수 있어. 일반적으로 이미지 참조로, Midjourney는 이미지 요소들을 직접 당신의 프롬프트에 넣으려고 할 거야. 그러니까, 당신의 이미지에 코끼리가 있다면, 당신의 프롬프트 결과에 코끼리가 등장할 거야.

--sref \[URL\]이거나 --sref ######## 스타일 참조 이미지나 랜덤 ID. 당신의 프롬프트 스타일에 영향을 주기 위해 하나의 이미지를 사용할 수 있어. sref는 이미지 URL이나 sref random으로 제공된 코드 중 하나를 사용할 수 있어.

--cref \[URL\] 이미지를 캐릭터 참조로 취급하고 그 캐릭터를 새로운 프롬프트에 유지하려고 해.

<div class="content-ad"></div>

--cw 캐릭터의 무게는 1에서 100까지 범위 내에 있습니다. 100에서는 캐릭터의 모든 측면을 유지하려고 노력합니다. 기본값은 100이지만 다른 값을 지정하지 않는 한 100으로 설정됩니다. 50으로 설정하면 캐릭터 무게가 캐릭터의 의상에 일부 변경을 허용합니다. 0으로 설정하면 얼굴만 보존하려고 노력하며 눈, 코, 입을 비롯한 나머지 부분은 변경할 수 있습니다.

--sw 스타일 무게는 기본적으로 100이지만 1에서 1000까지 어디서든 사용할 수 있습니다. 마지막 예에서는 숫자를 500까지 올려 스타일을 이미지에 더 부각시킬 수 있는 방법을 보여주었습니다. 그 경우에는 장미와 Midjourney를 더 원했습니다!

# 모든 것을 함께해 봅시다

위의 예제에서 랜덤 SREF ID가 있는 이미지 하나만 사용했습니다. 이것은 중간 이미지가 우리의 프롬프트에 어떤 스타일을 가하고 있는지 명확히 이해할 수 있도록 했기 때문입니다. 하지만 이것은 필수는 아닙니다. 다양한 이미지를 작업할 때는 원하는 결과를 얻을 것으로 생각되는 이미지를 혼합하십시오. 이 기사의 목적을 위해 비슷한 프롬프트를 사용하여 이미지를 혼합했을 때 가장 만족스러운 결과를 얻었습니다.

<div class="content-ad"></div>

이미지의 다른 가로 세로 비율을 섞을 때 블랙 바가 자주 나타난다는 것을 인지하는 것이 중요합니다. 약간 귀찮을 수 있지만, 쉽게 해결할 수 있어요. Vary(Region) 도구를 사용하여 주변 이미지의 약간을 포함해 블랙 바를 선택하면 Midjourney가 해당 부분을 채워줄 거에요.

이미지, 스타일, 캐릭터 참조 등을 사용하여 위의 기술을 혼합하는 방법을 사용하세요. 여러분의 이미지를 매우 흥미로운 곳으로 데려갈 수 있어요!

# 화가적 SREF ID

# 마지막으로

<div class="content-ad"></div>

오늘은 MidJourney의 강력한 SREF ID를 사용하여 스타일과 캐릭터 참조를 혼합하는 복잡한 점에 대해 살펴보았어요. 서로 다른 스타일 가중치와 캐릭터 가중치를 실험하여 독특하고 매혹적인 이미지를 만들 수 있어요. 캔버스를 담백하게 표현하거나 생동감 넘치는 역사적 장면을 만들고 싶다면, 이러한 기술을 통해 창의력의 경계를 넓힐 수 있어요. 다양한 조합과 설정을 실험하여 당신의 비전을 현실로 만드는 완벽한 균형을 찾아보세요.

만약 이 글에서 무엇을 얻었다면 - 멋진 새로운 아이디어든, 재밌게 읽은 것이든 - 만약 클랩 버튼을 눌러주시면 정말 감사하겠어요. 최대 50번의 클랩을 줄 수 있으니, 계속 클릭해주세요! :) 제 새로운 글이 나오면 업데이트를 받기 위해 팔로우해주세요. 여러분의 피드백과 참여는 제가 다음에 어떤 콘텐츠를 만들어야 하는지 결정하는 데 도움이 되며, 제가 옳은 길을 걷고 있다는 것을 알려줍니다. 여러분과 공감하는 콘텐츠를 만들었다는 것을 알 때 진심으로 의미가 있어요. 제안이나 요청이 있으시다면 댓글을 남겨주세요! 끝까지 읽어주셔서 정말 감사드리고, 다음 글에서 뵙겠습니다.
