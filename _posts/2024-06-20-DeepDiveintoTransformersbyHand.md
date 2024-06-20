---
title: "Transformers에 대한 심층적인 탐구 "
description: ""
coverImage: "/assets/img/2024-06-20-DeepDiveintoTransformersbyHand_0.png"
date: 2024-06-20 19:00
ogImage: 
  url: /assets/img/2024-06-20-DeepDiveintoTransformersbyHand_0.png
tag: Tech
originalTitle: "Deep Dive into Transformers by Hand ✍︎"
link: "https://medium.com/towards-data-science/deep-dive-into-transformers-by-hand-%EF%B8%8E-68b8be4bd813"
---


## 트랜스포머의 힘에 대한 세부 정보 살펴보기

우리 동네에 새로운 변화가 일어났어요.

아들이 "로보 트럭"이라고 부르는 한 대의 '로보-트럭'이 우리 거리에 새 집을 얻었답니다.

이 트럭은 테슬라 사이버 트럭이고, 저는 아들에게 그 이름의 의미를 여러 번 설명해 주었지만 그는 여전히 로보 트럭이라고 부릅니다. 그래서 이제 로보 트럭을 보면 그 이름을 들으면 항상 로보트로 컨버트할 수 있는 로봇들이 나오는 영화 '트랜스포머'를 떠올립니다.

<div class="content-ad"></div>

오늘 우리가 아는 대로, 트랜스포머가 이 로보트럭을 구동하는 데 사용될 수 있다니 이상하지 않나요? 이것은 거의 한 바퀴 도는 순간입니다. 그렇다면 이 모든 얘기를 하고 있는 나는 어디로 향하고 있을까요?

그래요, 나는 목적지로 가고 있어요 — 트랜스포머입니다. 로봇 자동차 트랜스포머가 아니라 신경망 트랜스포머죠. 여러분도 초대됐어요!

![이미지](/assets/img/2024-06-20-DeepDiveintoTransformersbyHand_0.png)

## 트랜스포머란 무엇인가요?

<div class="content-ad"></div>

Transformer는 본질적으로 신경망입니다. 데이터에서 맥락을 학습하는 데 특화된 신경망입니다.

하지만 그들을 특별하게 만드는 것은 레이블이 달린 데이터셋과 신경망 내의 컨볼루션 또는 순환을 필요로 하지 않는 메커니즘이 존재한다는 것입니다.

## 이 특별한 메커니즘들은 무엇인가요?

많은 메커니즘이 있지만, Transformer의 핵심인 어텐션 가중치와 피드포워드 네트워크(FFN)라는 두 가지 메커니즘이 진정으로 그들을 특별하게 만드는 힘입니다.

<div class="content-ad"></div>

## 어텐션 가중치란 무엇인가요?

어텐션 가중치는 모델이 들어오는 시퀀스의 어떤 부분에 집중해야 하는지 학습하는 기술입니다. 모든 시간에 모두 주시하는 '사우론의 눈'이 모든 것을 스캔하고 관련 있는 부분에 빛을 비추는 것으로 생각해보세요.

## FFN은 무엇을 의미하나요?

트랜스포머의 맥락에서, FFN은 주로 일관된 데이터 벡터 집단에 작용하는 일반적인 다층 퍼셉트론입니다. 어텐션과 결합되어 올바른 '위치-차원' 조합을 생성합니다.

<div class="content-ad"></div>

# 어텐션과 FFN은 어떻게 작동할까요?

그러니 더 이상 말더듬거리지 말고, 어텐션 가중치와 FFN이 트랜스포머를 이렇게 강력하게 만드는 방법에 대해 알아봅시다.

이 토론은 톰 예 교수님의 멋진 '손으로 만드는 인공지능' 시리즈에 기반을 두고 있습니다. (아래 이미지는, 별도 언급이 없는 한, 상기 LinkedIn 게시물 중 톰 예 교수님의 것으로, 교수님의 허락을 받아 편집한 것입니다.)

그럼 시작해봅시다!

<div class="content-ad"></div>

여기 중요한 아이디어는 주의 가중치와 피드포워드 네트워크(FFN)입니다.

이것들을 염두에 두고, 우리에게 다음을 제공받는 경우를 가정해 봅시다:

- 이전 블록으로부터 5개의 입력 특성 (여기서 3x5 행렬인 A로, X1, X2, X3, X4 및 X5가 특성이며 각 행은 각각의 특성을 나타냅니다.)

![이미지](/assets/img/2024-06-20-DeepDiveintoTransformersbyHand_1.png)

<div class="content-ad"></div>

[1] 주의 집중 가중치 행렬 A 획득

과정에서 첫 번째 단계는 주의 집중 가중치 행렬 A를 획득하는 것입니다. 이 부분은 자기 주의 메커니즘이 작용하는 곳입니다. 이 단계는 입력 시퀀스 중에서 가장 관련성 높은 부분을 찾는 데 사용됩니다. 

입력 특성을 쿼리-키(QK) 모듈에 공급하여 수행합니다. 간편하게 말해, QK 모듈의 세부 사항은 여기에 포함되어 있지 않습니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*DYNNNiaZac_ZNGFVUn4aag.gif)

<div class="content-ad"></div>

[2] 주의 집중 가중치

주의 집중 가중치 행렬 A (5x5)을 얻으면, 입력 기능 (3x5)을 곱하여 주의 집중된 기능 Z를 얻습니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*1_VmXxp6iPkwVEdhFwExkg.gif)

여기서 중요한 점은 기능이 위치 P1, P2 및 P3에 따라 가로로 결합된다는 것입니다.

<div class="content-ad"></div>

다음과 같이 세분화된 계산을 행별로 수행해보세요:

P1 X A1 = Z1 → 위치 [1,1] = 11

P1 X A2 = Z2 → 위치 [1,2] = 6

P1 X A3 = Z3 → 위치 [1,3] = 7

<div class="content-ad"></div>

P1 X A4 = Z4 → Position [1,4] = 7

P1 X A5 = Z5 → Position [1,5] = 5

.

.

<div class="content-ad"></div>

변경된 내용은 다음과 같습니다:

P2 X A4 = Z4 → Position [2,4] = 3

P3 X A5 = Z5 → Position [3,5] = 1

이것이 예시입니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-20-DeepDiveintoTransformersbyHand_2.png)

처음에는 조금 귀찮아 보일 수 있지만 행별 곱셈을 따르면 결과는 매우 직관적일 것입니다.

멋진 점은 우리의 주의 가중치 행렬 A가 배열된 방식 때문에 새로운 특징 Z가 X의 조합으로 나타난다는 것이다:

Z1 = X1 + X2

<div class="content-ad"></div>

Z2 = X2 + X3

Z3 = X3 + X4

Z4 = X4 + X5

Z5 = X5 + X1

<div class="content-ad"></div>

(힌트: 행렬 A에서 0과 1의 위치를 살펴보세요).

[3] FFN: 첫 번째 레이어

다음 단계는 어텐션 가중치가 적용된 피쳐를 피드포워드 신경망에 전달하는 것입니다.

그러나 이번에는 이전 단계에서의 위치가 아닌 차원을 가로지르는 값들을 결합하는 것이 차이점입니다. 아래처럼 수행됩니다:

<div class="content-ad"></div>

아래에 있는 링크를 사진으로 보여줄게요.

- 관심 단계에서는 원래 특징을 기반으로 입력을 결합하여 새로운 특징을 얻었어요.

- FFN 단계에서는 그들의 특성을 고려하여 새로운 행렬을 얻기 위해 특징을 세로로 결합해요.

<div class="content-ad"></div>

한 번 더 element-wise 행 연산이 도움이 됩니다. 여기서 새 행렬의 차원 수가 4로 증가했다는 점에 주목하세요.

[4] ReLU

저희가 가장 좋아하는 단계 : ReLU는 이전 행렬에서 얻은 음의 값이 0으로 반환되고 양의 값은 변경되지 않습니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*FmroND2LsW91TrYXNh2UGQ.gif)

<div class="content-ad"></div>

[5] FFN : 두 번째 레이어

결과 매트릭스의 차원을 4에서 3으로 줄이는 두 번째 레이어를 통과합니다.

![Image](https://miro.medium.com/v2/resize:fit:1400/1*z0CE0MMXVIuuu0qPYybrjA.gif)

여기서의 출력은 다음 블록으로 공급할 준비가 되어 있습니다 (원본 매트릭스와 유사성을 확인하십시오) 및 전체 프로세스가 처음부터 반복됩니다.

<div class="content-ad"></div>

여기서 기억해야 할 두 가지 주요 사항은 다음과 같습니다:

- 어텐션 레이어는 위치를 가로 방향으로 결합합니다.
- 피드포워드 레이어는 차원을 세로 방향으로 결합합니다.

이것이 트랜스포머의 강력함에 대한 비밀 소스입니다. 데이터를 여러 방향에서 분석하는 능력입니다.

위의 아이디어를 요약하면 다음과 같은 주요 포인트가 있습니다:

<div class="content-ad"></div>

- 트랜스포머 아키텍처는 어텐션 레이어와 피드-포워드 레이어의 조합으로 이해될 수 있습니다.
- 어텐션 레이어는 특성을 결합하여 새로운 특성을 생성합니다. 예를 들어 두 로봇 Robo-Truck과 Optimus Prime을 결합하여 새로운 로봇인 Robtimus Prime을 얻는 것을 생각해보세요.
- 피드-포워드(FFN) 레이어는 특성의 부분이나 특성을 결합하여 새로운 부분/특성을 생성합니다. 예를 들어 Robo-Truck의 바퀴와 Optimus Prime의 이온 레이저가 합쳐져 바퀴 레이저가 될 수 있습니다.

# 늘같이 강력한 트랜스포머

신경망은 상당히 오랫동안 존재해왔습니다. 합성곱 신경망(CNN)과 순환 신경망(RNN)이 주류인 동안 2017년에 트랜스포머가 소개되면서 상황이 크게 바뀌었습니다. 그 이후로 인공지능 분야는 기하급수적으로 성장했고 매일 새로운 모델, 새로운 기준, 새로운 배움이 이어졌습니다. 그리고 언제가 미래에 더 큰 변화를 이끌어낼 수 있는 현상적인 아이디어로 발전할지에 대해 시간만이 알게 해줄 것입니다. 그러나 현재는 아이디어가 우리 삶을 어떻게 변화시킬 수 있는지를 생각해보는 것이 잘못된 말이 아닐 것입니다!

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-DeepDiveintoTransformersbyHand_3.png" />

P.S. 이 연습을 혼자 진행하고 싶다면, 여기에 사용할 빈 템플릿이 있어요.

Robtimus Prime를 만들어서 즐거운 시간 보내세요!