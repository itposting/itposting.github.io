---
title: "Anthropic의 Sparse Autoencoder를 직접 깊이 파헤쳐 보기 "
description: ""
coverImage: "/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_0.png"
date: 2024-06-19 19:52
ogImage: 
  url: /assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_0.png
tag: Tech
originalTitle: "Deep Dive into Anthropic’s Sparse Autoencoders by Hand ✍️"
link: "https://medium.com/towards-data-science/deep-dive-into-anthropics-sparse-autoencoders-by-hand-%EF%B8%8F-eebe0ef59709"
---


## LLMs 해석 가능성 탐색의 개념을 살펴보세요

![이미지](/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_0.png)

"고대의 마법이 공중을 가득 채운 루마리아의 신비한 땅에는 에테리얼 그리핀 제피라가 살았습니다. 사자의 몸과 독수리의 날개를 지닌 제피라는 우주의 비밀을 담은 고대 서언 '진리의 코덱스'의 존중받는 수호자였습니다.

성스러운 동굴에 자리한 코덱스는 제피라의 녹색 눈에 의해 보호되었으며, 그 눈은 속임수를 파헤쳐 순수한 진리를 드러냈습니다. 어느 날, 어둠의 마법사가 루마리아의 땅에 내려와 세계를 무지에 묻기 위해 코덱스를 감추려 했습니다. 마을 사람들은 희망의 기운으로 제피라를 부르자, 제피라는 하늘을 날아 빛의 방패를 만들어 어둠의 마법사를 물리치고 진리를 드러내는 향취가 되었습니다."

<div class="content-ad"></div>

긴 싸움 끝에 어둠의 마법사는 제피라의 빛 앞에는 무리였다는 결론이 내려졌어요. 용기와 경계심을 통해 진정한 빛은 루마리아에 계속하여 빛나고 있었죠. 그리고 시간이 흘러감에 따라 루마리아는 제피라의 지키는 아래 번영을 이루고, 그 길은 제피라가 지켜주는 진리에 의해 계속 밝은 모습을 유지했어요. 그리고 이렇게 제피라의 전설이 이어졌답니다!

# Anthropic의 해석 가능한 기능 추출을 향한 여정

제피라 이야기를 따라, Anthropc AI는 모델에서 의미 있는 특징을 추출하는 원정을 시작했어요. 이 조사의 아이디어는 신경망의 다양한 구성 요소가 어떻게 상호 작용하며 각 구성 요소가 어떤 역할을 하는지 이해하는 데 있어요.

논문인 "Towards Monosemanticity: Decomposing Language Models With Dictionary Learning"에 따르면, Sparse Autoencoder는 모델에서 의미 있는 기능을 성공적으로 추출할 수 있어요. 다시 말해, Sparse Autoencoders는 '다의성' 문제를 해결하는 데 도움을 줍니다 - 즉, 여러 의미/해석에 해당하는 신경 활성을 동시에 분해함으로써, 각각의 해석을 지니고 있는 드문드문 활성화 기능에 집중함을 통해 좀 더 단방향적인 요소를 보여줍니다.

<div class="content-ad"></div>

위에 모든 것이 어떻게 이루어지는지 이해하려면, 이 멋진 작품들을 자세히 살펴보면 됩니다. 교수님, 뒤에 감춰진 현상들을 설명해주는 대표적인 작품인 Autoencoders 및 Sparse Autoencoders입니다.

(아래의 모든 이미지는 따로 언급이 없을 경우, 위에서 소개한 LinkedIn 게시물에서 Tom Yeh 교수님의 것으로, 교수님의 허락을 받아 편집한 것입니다.)

먼저, Autoencoder가 무엇인지와 그 작동 방식에 대해 알아봅시다.

## Autoencoder란 무엇인가요?

<div class="content-ad"></div>

Imagine a writer has his desk strewn with different papers — some are his notes for the story he is writing, some are copies of final drafts, some are again illustrations for his action-packed story. Now amidst this chaos, it is hard to find the important parts — more so when the writer is in a hurry and the publisher is on the phone demanding a book in two days. Thankfully, the writer has a very efficient assistant — this assistant makes sure the cluttered desk is cleaned regularly, grouping similar items, organizing and putting things into their right place. And as and when needed, the assistant would retrieve the correct items for the writer, helping him meet the deadlines set by his publisher.

Well, the name of this assistant is Autoencoder. It mainly has two functions — encoding and decoding. Encoding refers to condensing input data and extracting the essential features (organization). Decoding is the process of reconstructing original data from encoded representation while aiming to minimize information loss (retrieval).

Now let’s look at how this assistant works.

# How does an Autoencoder Work?

<div class="content-ad"></div>

주어진: 네 개의 훈련 예제 X1, X2, X3, X4.

### [1] 자동

첫 번째 단계는 훈련 예제들을 대상 Y’로 복사하는 것입니다. 오토인코더의 작업은 이러한 훈련 예제들을 재구성하는 것입니다. 대상이 훈련 예제 자체이기 때문에, ‘자동’이라는 단어가 사용되었으며 이는 ‘자체’를 의미하는 그리스어입니다.

### [2] 인코더: 레이어 1 + ReLU

<div class="content-ad"></div>

이전의 모든 모델에서 본 바와 같이, 간단한 가중치와 편향 행렬이 ReLU와 결합된 것이 강력하며 놀라운 결과를 얻을 수 있음을 알 수 있었습니다. 따라서, 첫 번째 인코딩 레이어를 사용하여 원래의 피처 세트 크기를 4x4에서 3x4로 줄입니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*INIu2VmAyBnQHRLUc_pY-g.gif)

## [3] 인코더: 레이어 2 + ReLU

이전 레이어의 출력은 두 번째 인코더 레이어에 의해 처리되며 입력 크기를 2x3으로 더욱 줄입니다. 이 단계에서 관련 피처의 추출이 발생합니다. 이 레이어는 입력 피처보다 훨씬 적은 피처를 가지고 있기 때문에 '병목'이라고도 불립니다.

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*0UBKNLacq0ZOXF-f9Tzvzg.gif)

## [4] 디코더: 레이어 1 + ReLU

인코딩 프로세스가 완료되면, 다음 단계는 관련 피처를 디코드하여 최종 출력을 '다시' 작성하는 것입니다. 이를 위해, 우리는 마지막 단계의 피처를 해당 가중치 및 편향과 곱한 다음 ReLU 레이어를 적용합니다. 결과는 3x4 매트릭스입니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*yCWisBAtVJ35IZB164Vvew.gif)


<div class="content-ad"></div>

## [5] 디코더: 레이어 2 + ReLU

이전 출력에 두 번째 디코더 레이어(가중치, 편향 + ReLU)를 적용하여 최종 결과를 얻습니다. 이 결과는 복원된 4x4 행렬입니다. 우리는 이렇게 함으로써 결과를 원래 목표값과 비교하기 위해 원래 차원으로 돌아갑니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*jUXnoKZk1kQP3MDUA9SLtA.gif)

## [6] 손실 그래디언트 및 역전파

<div class="content-ad"></div>

디코더 레이어에서 출력을 받은 후, 우리는 출력(Y)과 타겟(Y') 사이의 평균 제곱 오차(MSE)의 그래디언트를 계산합니다. 이를 위해, 우리는 2*(Y-Y')을 찾아 역전파 프로세스를 활성화시키고 가중치와 편향을 업데이트하는 최종 그래디언트를 얻습니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*R_qDdXzetVZZJ8oKaEVeig.gif)

자동 인코더의 작동 방식을 이해했으니, 이제 그 희소한 변형이 어떻게 큰 언어 모델(LLMs)에게 해석 가능성을 달성하는지 알아보는 것이 중요합니다.

# 희소 자동 인코더 - 어떻게 작동하나요?

<div class="content-ad"></div>

우선, 다음을 전제로 합시다:

- 트랜스포머의 출력은 피드포워드 레이어에서 처리된 후이다. 즉, 다섯 개의 토큰(X)에 대한 모델 활성화를 가정해봅시다. 이들은 좋지만, 모델이 결정을 내리는 방법이나 예측을 하는 방식에 대한 정보를 제공하지는 않습니다.

![Image](/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_1.png)

여기서 주된 질문은:

<div class="content-ad"></div>

## [1] 인코더: 선형 레이어

인코더 레이어의 첫 번째 단계는 입력 X를 인코더 가중치로 곱하고 편향을 더하는 것입니다 (오토인코더의 첫 번째 단계와 같이 수행됩니다).

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*xhgfTmOD7ZowFVtSBHPn8Q.gif)

## [2] 인코더: ReLU

<div class="content-ad"></div>

다음 하위 단계는 ReLU 활성화 함수를 적용하여 비선형성을 추가하고 부정적인 활성화를 억제하는 것입니다. 이 억제는 많은 기능이 0으로 설정되어 희소성 개념을 가능케 하며, 희소하고 해석 가능한 특성 f를 출력합니다.

해석 가능성은 하나 또는 두 개의 양적 특성만 있는 경우에 발생합니다. f6를 살펴보면 X2 및 X3이 양수인 것을 볼 수 있으며, 둘 다 'Mountain'을 가지고 있을 수 있다고 말할 수 있습니다.

![Image](https://miro.medium.com/v2/resize:fit:1400/1*L5PxylZCTjdNULt4gjt7oQ.gif)

## [3] 디코더: 재구성

<div class="content-ad"></div>

인코더 작업이 완료되면, 디코더 단계로 넘어갑니다. 우리는 f를 디코더 가중치와 바이어스와 곱한 후 더합니다. 이것은 해석 가능한 특성으로부터 X의 재구성인 X'을 출력합니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*3sZJcXiZSQVr41YSTA33RA.gif)

오토인코더처럼, 우리는 X'이 가능한 X에 가깝도록 하고 싶습니다. 이를 보장하기 위해 추가로 훈련이 중요합니다.

## [4] 디코더 : 가중치

<div class="content-ad"></div>

중간 과정으로 이번 단계의 각 가중치에 대해 L2 노름을 계산합니다. 나중에 사용할 수 있도록 따로 저장합니다.

![Image](https://miro.medium.com/v2/resize:fit:824/1*k3zIB0kEP1sewwORw08FOQ.gif)

## 훈련

이전에 언급했듯이 Sparse Autoencoder은 재구성된 X'를 X에 더 가깝게 만들기 위해 광범위한 훈련을 실시합니다. 이를 설명하기 위해 아래 단계로 진행합니다:

<div class="content-ad"></div>

## [5] 희소성: L1 손실

여기서의 목표는 가능한 한 많은 값을 0 또는 0에 가까운 값으로 얻는 것입니다. 우리는 가중치의 절대값을 패널티로 삼아 L1 희소성을 활용하여 이를 수행합니다. 핵심 아이디어는 합을 가능한 작게 만들고 싶다는 것입니다.

![image](https://miro.medium.com/v2/resize:fit:1080/1*RYebksXA--6kfOCWkZxRiA.gif)

## [6] 희소성: 경사

<div class="content-ad"></div>

다음 단계는 L1의 기울기를 계산하는 것입니다. 양수 값에 대해 -1로 설정됩니다. 따라서 모든 f `0` 값에 대해 결과는 -1로 설정됩니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*1WXXLP5p7zYyBK2T22CbcA.gif)

![image](/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_2.png)

![image](/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_3.png)

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_4.png)

![Image 2](/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_5.png)

## [7] 희소성: 제로

이미 0인 모든 다른 값들은 변경하지 않고 그대로 유지합니다.


<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*gtDUWgJ11gs1bh77CEt-Qw.gif)

## [8] 희소성 : 가중치

Step 6에서 얻은 그래디언트 행렬의 각 행을 Step 4에서 얻은 해당 디코더 가중치로 곱합니다. 이 단계는 잘못된 정보를 추가하여 결과를 재구성하는 동안 모델이 큰 가중치를 학습하는 것을 방지하는 데 중요합니다.

![image](https://miro.medium.com/v2/resize:fit:1104/1*kM4XIHlPsa7su69XV11H7Q.gif)


<div class="content-ad"></div>

## [9] 재구성: MSE 손실

X’와 X 사이의 차이를 계산하기 위해 평균 제곱 오차 또는 L2 손실 함수를 사용합니다. 이전에 본 것과 같이 목표는 오차를 최소화하는 것입니다.

![image](https://miro.medium.com/v2/resize:fit:1400/1*3bOB5l-c-cXhrtX89Fk0AA.gif)

## [10] 재구성: Gradient

<div class="content-ad"></div>

L2 손실의 경사는 2*(X'-X)입니다.

따라서 원래의 오토인코더에서처럼 backpropagation을 실행하여 가중치와 편향을 업데이트합니다. 이 중요한 점은 희소성(sparsity)과 재구성(reconstruction) 사이에 좋은 균형을 찾는 것입니다.

![이미지](https://miro.medium.com/v2/resize:fit:1004/1*3MDwExTyz4ImSJX2GMzHkA.gif)

이로써, 모델이 개념을 이해하고 응답을 생성하는 방향을 학습하는 매우 똑똑하고 직관적인 방법의 끝에 도달했습니다.

<div class="content-ad"></div>

## 요약하면:

- 오토 인코더는 일반적으로 Encoder와 Decoder 두 부분으로 구성됩니다. Encoder는 가중치와 편향을 사용하고 ReLU 활성화 함수와 결합하여 초기 입력 기능을 낮은 차원으로 압축하여 관련 부분들만을 캡처하려고 합니다. 반면에 Decoder는 Encoder의 출력을 가져와 입력 기능을 원래 상태로 다시 복원하려고 노력합니다. 오토 인코더의 대상은 초기 기능 자체이기 때문에 'auto'라는 단어가 사용됩니다. 목표는 일반적인 신경망의 경우와 마찬가지로 목표와 입력 기능 사이의 최소 오차(차이)를 달성하는 것입니다. 이는 네트워크를 통해 오차의 기울기를 전파하면서 가중치와 편향을 업데이트하여 달성됩니다.

- Sparse Autoencoder는 일반 오토 인코더와 동일한 구성요소로 구성되며 몇 가지 추가 구성요소가 더 있습니다. 여기서 중요한 것은 교육 단계에서 다른 접근 방식입니다. 해석 가능한 기능을 검색하는 것이 목표이므로 비교적 의미가 적은 값들을 제로로 만들고자 합니다. Encoder가 음의 값들을 억제하기 위해 ReLU를 사용한 후에 결과에 L1 손실을 사용하여 가중치의 절대값을 처벌하여 희소성을 장려합니다. 손실 함수에 패널티 항을 추가하여 이를 달성합니다. 이 패널티는 가중치의 절대값의 합입니다: λΣ|w|. 남아있는 0이 아닌 가중치는 모델의 성능에 중요한 것들입니다.

# 희소성을 활용하여 해석 가능한 기능 추출

인간은 특정 자극에 대한 반응으로 뉴런의 작은 하위 집합만을 활성화시킵니다. 마찬가지로, Sparse Autoencoder는 L1 정규화와 같은 희소성 제약을 활용하여 입력의 희소한 표현을 학습합니다. 이렇게 함으로써 Sparse Autoencoder는 복잡한 데이터로부터 해석 가능한 기능을 추출하여 학습된 기능의 단순함과 해석 가능성을 향상시킵니다. 이 생물학적 신경 과정을 모방한 선택적 활성화는 모델이 입력 데이터의 가장 관련성 있는 측면에 초점을 맞추어 모델을 더 견고하고 효율적으로 만듭니다.

<div class="content-ad"></div>

Anthropic의 노력을 통해 AI 모델의 해석 가능성을 이해하려는 노력은 투명하고 이해하기 쉬운 AI 시스템의 필요성을 강조하며, 특히 잠재적인 중요한 결정 과정에 더 많이 통합되면서 중요해지고 있습니다. 강력하고 해석 가능한 모델을 만드는 데 초점을 맞춘 Anthropic은 신뢰할 수 있고 실제 응용 프로그램에서 효과적으로 활용할 수 있는 AI 개발에 기여합니다.

요약하면, Sparse Autoencoders는 해석 가능한 특징을 추출하고 모델의 견고성을 향상시키며 효율성을 보장하는 데 중요합니다. 이러한 강력한 모델을 이해하고 어떻게 추론을 만드는지 계속 연구함으로써 AI에서의 해석 가능성의 중요성이 커지고 있으며, 더 투명한 AI 시스템의 길을 열고 있습니다. 이러한 개념이 어떻게 발전하고 우리를 안전하게 AI를 삶 속에 통합하는 미래로 나아가게 될지 기대됩니다!

P.S. 본 연습을 직접 진행하고 싶다면 여기에 빈 템플릿 링크가 있습니다.

손으로 연습할 빈 템플릿

<div class="content-ad"></div>

지퍼가 진리의 코덱스를 안전하게 보호할 수 있도록 도와주는 재미를 누려보세요!


<img src="/assets/img/2024-06-19-DeepDiveintoAnthropicsSparseAutoencodersbyHand_6.png" />


이 작업을 지원해준 톰 예 교수님께 특별히 감사드립니다!

## 참고문헌:

<div class="content-ad"></div>

[1] Monosemanticity를 향하여: 사전 학습으로 언어 모델을 분해하기, Bricken 등. 2023년 10월 https://transformer-circuits.pub/2023/monosemantic-features/index.html

[2] Monosemanticity 확대하기: Claude 3 Sonnet에서 해석 가능한 특징 추출하기, Templeton 등. 2024년 5월 https://transformer-circuits.pub/2024/scaling-monosemanticity/