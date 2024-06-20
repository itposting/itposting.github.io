---
title: "3D 프린팅으로 완전히 만든 ARC 로켓과 국가대회에 진출하는 법"
description: ""
coverImage: "/assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_0.png"
date: 2024-06-20 16:40
ogImage: 
  url: /assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_0.png
tag: Tech
originalTitle: "How I made a fully 3d-printed ARC rocket and qualified for nationals"
link: "https://medium.com/@vikramaditya.nishant/how-i-made-a-fully-3d-printed-arc-rocket-and-qualified-for-nationals-bc4c667d9c70"
---


올해 우리 팀은 ARC 국가 결승전에 진출하여 3D 프린트 된 로켓을 사용하여 Mission 상의 '가장 혁신적인 방법'상을 수상했습니다. 이 글에서는 이 로켓을 개발하면서 경험한 여정과 배운 점을 공유하겠습니다. ARC나 로켓 항공공학에 관심 있는 팀들은 이 디자인에 대한 우리의 학습과 경험에서 이득을 볼 것입니다.

![이미지](/assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_0.png)

2003년에 시작된 미국 로켓 공모전인 ARC는 전 세계에서 가장 큰 로켓 대회로, 수천 개의 고등학교 팀이 참가합니다. 올해의 도전 과제는 BT-70(56mm) 페이로드 튜브를 사용하고, 그런 다음 BT-80(66mm)으로 변환되는 지느러미 부분이었습니다. 일반적으로 이러한 로켓은 판지 및 기타 시중 제품으로 제작됩니다. 예를 들어, 팀들은 이 Apogee Components의 바디 튜브 부품이나 이 변환 부품을 사용할 수 있습니다. 그리고, 에폭시와 같은 접착제를 사용하여 부착합니다. 목재 센터링 링과 같은 것들은 모터를 부착하는 데 사용됩니다.

로켓의 비행은 목표 최고점(올해는 820피트)으로부터의 거리와 목표 시간(43-46초)으로 점수가 매겨집니다. 우리는 처음에 판지 로켓으로 시작했고 여름 동안 많은 낮은 점수의 비행을 했습니다. 그러나 더 많은 발사를 하면서 로켓이 점점 일관성 없이 되었고, 10회 발사 후에는 우리가 원하는 일정한 낮은 점수를 더이상 얻을 수 없었습니다. 전통적인 로켓 디자인에는 다른 단점이 많이 있습니다:

<div class="content-ad"></div>

- 비싸요 — 우리의 로켓은 오프 더 셀프 부품을 사용해 만들었을 때 약 $100 정도에요.
- 느려요 — 하루에 6시간씩 3일 동안 작업해서 2대의 로켓을 만들었어요. 프로세스 각각의 단계 사이에 에폭시가 건조되어야 해서 시간이 오래 걸렸어요.
- 반복 작업이 어려워요 — 사용자 정의 지오메트리는 튜브에 사물을 정확히 장착하는 것이 어려워서 만들기 어려웠어요.

시즌이 끝나가는 시점에, 우리는 공학 설계 프로세스를 적용하고 싶었어요. 여기서 빠른 반복이 성공의 핵심이에요. 그래서 우리는 완전히 3D로 출력하기로 결정했어요. 신뢰할 수 있는 디자인을 얻기까지 여러 번의 발사와 학습을 거치다가, 추진 로켓이 견딜 수 있는 힘을 유지하면서 낮은 질량을 유지할 수 있는 신뢰할 수 있는 디자인에 이르렀어요. 그리고 이렇게 해서 얻은 이점들을 발견했어요:

- 저렴해요 — 약 $3 정도의 가격이 나가는 250g의 필라먼트가 필요해요.
- 빠르게 만들 수 있어요 — 출력하는 데 24시간이 걸리고 조립하는 데 단 10분만 걸려요.
- 반복 작업이 용이해요 — 모든 부품이 모듈식이기 때문에 무언가가 고장나거나 변경이 필요한 경우, 해당 부분을 교체할 수 있어요. 전통적인 로켓과 달리 (영구적으로 에폭시로 뭉쳐진) 전체를 다시 만들 필요가 없어요.

하지만 이 모든 것이 장점만 있는 것은 아니에요. 여기 몇 가지 단점이 있어요:

<div class="content-ad"></div>

- 무게가 더 무겁습니다 - 플라스틱보다 현저히 가벼운 전환폭에 연결된 기판이 있기는 하지만, 튜브는 PLA(우리가 사용한 3D 프린팅 재료)가 몸체 튜브에 사용된 크래프트 종이보다 거의 3배 밀도가 높기 때문에 훨씬 더 무겁습니다. 전체적으로, 약 50g 정도 더 무겁습니다.
- 강도가 부족합니다 - 모듈성은 가격이 붙는데, 부품 간의 연결부는 파괴될 수 있습니다. 이는 PLA가 카드보드보다 훨씬 부서지기 쉽기 때문에 더 심해집니다. 콘크리트나 자갈 위에 경칩하여 3D 프린팅된 로켓이 부서지기도 합니다.

결국, 해당 디자인은 2개의 외곽선과 3%의 채움률로 인쇄되었습니다. 이것이 대부분의 기본 구조에 대해 수용할만한 강도와 무게를 제공한다는 것을 발견하였습니다.

# 우리가 배운 것

로켓이 발사되면, 추진제가 짧은 기간 동안 연소됩니다 - 우리는 대략 1초 동안입니다. 그런 다음, 로켓은 중력과 저항에 의해 느리게 내려오는 약 7초 동안 이륙 절정 지점(apogee)에서 미끄러집니다. 이 기간에 모터 지연이 타는 동안, 마침내 낙하산을 발사하며, 최상(비행의 꼭대기)에서 이상적으로 이루어집니다. 하지만 현실적으로는 종종 이상 또는 이하에서 열리기도 합니다. 높은 속도로 개방되는 낙하산으로 인한 급속한 감속이 모델의 전 구조 전체에 큰 압력을 가해서, 많은 로켓을 분실하는 문제가 있었습니다. 다음은 우리가 로켓을 강화하기 위해 한 일부 조취입니다:

<div class="content-ad"></div>


![image1](/assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_1.png)

To enhance the strength of the fin can tube, which lacks internal structure (only containing parachutes), we incorporated helical ribs.

![image2](/assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_2.png)

To reinforce each part without significant weight gain, we integrated fillets across the design.


<div class="content-ad"></div>


![Rocket](/assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_3.png)

The shock cord mount broke (left). We solved this by using a slicer modifier to add 4 perimeters (right). We did the same with the payload tube.

## 조정 방법

고도를 제어하기 위해 질량을 변경해야 하는데, 중심 축을 움직이지 않도록 조정해야 합니다. 중심 축을 움직이면 안전성에 영향을 줄 수 있습니다. 이를 해결하기 위해 질량을 중심 축에 두어야 합니다. 우리는 2부식 페이로드를 사용하여 이를 달성했습니다.


<div class="content-ad"></div>


![로켓 이미지](/assets/img/2024-06-20-HowImadeafully3d-printedARCrocketandqualifiedfornationals_4.png)

왼쪽의 전이 구간에는 페니를 넣을 수 있는 관이 있었어요. 그런 다음, 우리는 넣은 3개의 나사로 우주선 관로 페이로드 관을 장착했어요. 이 3개의 나사는 페이로드 관의 3개 구멍에 넣는 열린 삽입기(bottom-right)에 들어갔어요.

# 작동했나요?

네, 잘 작동했어요! 19점으로 국가대회에 진출할 수 있었어요. 한 주 동안 4개의 예비 우주선을 만들었고, 새로운 기능을 원할 때마다 디자인을 빠르게 업데이트할 수 있었어요. 한 부분이 고장 나더라도 전체 우주선을 버리지 않고 교체할 수 있었어요. 모든 부품이 모듈식이기 때문에, 우주선 간에 부품을 그대로 옮길 수 있었고, 충격 줄과 낙하산 보호대에 30회 이상 쏘아올릴 수 있었어요. ARC 팀이 이에 관심이 있는 경우, 전체 3D 프린팅된 로켓을 꼭 추천드리겠어요.


<div class="content-ad"></div>

Thingiverse에서 CAD 파일을 확인해보세요!