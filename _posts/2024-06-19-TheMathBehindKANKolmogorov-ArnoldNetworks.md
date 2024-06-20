---
title: "KAN  콜모고로프-아놀드 네트워크 뒤에 숨은 수학"
description: ""
coverImage: "/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_0.png"
date: 2024-06-19 03:45
ogImage: 
  url: /assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_0.png
tag: Tech
originalTitle: "The Math Behind KAN — Kolmogorov-Arnold Networks"
link: "https://medium.com/towards-data-science/the-math-behind-kan-kolmogorov-arnold-networks-7c12a164ba95"
---


## 클래식 다층 퍼셉트론 대안이 나왔어요. 왜 더 정확하고 해석 가능한 건가요? 수학과 코드 심층 탐구.

![다음 이미지 참고](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_0.png)

AI 세계에서 신경망은 끊임없는 혁신과 발전을 이끌어옵니다. 많은 획기적인 발전의 핵심에는 복잡한 함수를 근사하는 능력으로 유명한 다층 퍼셉트론(MLP)이 있습니다. 그러나 AI가 얼마나 많이 이루어 낼 수 있는지 경계를 늘릴 때, 우리는 클래식 MLP보다 더 나은 것을 할 수 있을까요?

여기 Kolmogorov-Arnold Networks(KANs)가 나왔습니다. Kolmogorov-Arnold 표현 정리에서 영감을 받은 신경망에 대한 새로운 접근법입니다. 기존 MLP가 각 뉴런에서 고정 활성화 함수를 사용하는 반면, KANs는 네트워크의 가중치(엣지)에 학습 가능한 활성화 함수를 사용합니다. 이 간단한 변경은 정확성, 해석 가능성, 효율성에서 새로운 가능성을 열어줍니다.

<div class="content-ad"></div>

이 기사는 KAN이 신경망 설계에서 혁명적인 발전을 이루는 이유를 탐구합니다. 우리는 그들의 수학적 기초에 대해 자세히 살펴보고, MLP(Multi-Layer Perceptrons)와의 주요 차이점을 강조하며, KAN이 전통적인 방법을 능가할 수 있는 방법을 보여줄 것입니다.

# 1: MLP의 한계

![이미지](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_1.png)

다층 퍼셉트론(MLP)은 현대 신경망의 핵심 구성 요소입니다. 각각의 뉴런은 데이터로부터 학습하여 복잡한 비선형 함수를 근사하는 것을 목표로 설계된 상호 연결된 노드 레이어로 구성되어 있습니다. 각 뉴런은 입력의 가중 합에 고정된 활성화 함수를 사용하여 입력 데이터를 원하는 출력으로 변환함으로써 여러 계층의 추상화를 통해 동작합니다. MLP는 컴퓨터 비전에서부터 음성 인식까지 다양한 분야에서 앞도적인 성과를 이루어 왔습니다.

<div class="content-ad"></div>

그러나 MLP에는 몇 가지 중요한 제한 사항이 있습니다:

- 노드에 고정된 활성화 함수: MLP의 각 노드에는 ReLU나 Sigmoid와 같은 미리 정의된 활성화 함수가 있습니다. 이러한 고정 함수는 많은 경우에 효과적이지만 네트워크의 유연성과 적응성을 제한합니다. 이는 MLP가 특정 유형의 함수를 최적화하거나 특정 데이터 특성에 적응하는 데 어려움을 겪을 수 있게 만들 수 있습니다.
- 해석 가능성 문제: MLP는 종종 "블랙 박스"로 비판받습니다. 복잡해지면서, 그들의 의사 결정 과정을 이해하기가 더 어려워집니다. 고정된 활성화 함수와 복잡한 가중치 행렬은 네트워크의 내부 작업을 가리고, 깊이 분석 없이 모델의 예측을 해석하고 신뢰하기 어렵게 만듭니다.

이러한 단점은 더 큰 유연성과 해석 가능성을 제공하는 대안이 필요함을 강조하며, Kolmogorov-Arnold Networks (KANs)와 같은 혁신을 위한 길을 열어줍니다.

# 2: Kolmogorov-Arnold Networks (KANs)

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_2.png)

콜모고로프-아놀드 표현 이론은 수학자 안드레이 콜모고로프와 블라디미르 아놀드가 정립한 이론으로, 이론은 다변수 연속 함수를 단일 변수의 연속 함수와 덧셈 작업의 유한 구성으로 표현할 수 있다고 주장합니다. 이 이론은 복잡한 레시피를 각각의 간단한 단계로 분해하는 것으로 생각할 수 있습니다. 전체 레시피 전체적으로 다루는 대신에 각 단계를 개별적으로 처리하여 전반적인 프로세스를 더 효율적으로 만듭니다. 이 이론은 복잡한 고차원 함수를 간단한 단일 변수 함수로 분해할 수 있다는 것을 시사합니다.

KAN(Kolmogorov-Arnold Networks)은 콜모고로프-아놀드 이론의 힘을 활용하여 신경망의 구조를 근본적으로 변경합니다. 전통적인 MLP에서는 각 노드에 고정된 활성화 함수가 적용되지만, KAN은 네트워크의 가중치에 학습 가능한 활성화 함수를 배치합니다. 이러한 주요 차이점은 고정된 활성화 함수 세트가 아닌, KAN이 학습 중에 적용할 최상의 함수를 적응적으로 학습한다는 것을 의미합니다. KAN의 각 가중치는 데이터를 기반으로 한 다이내믹하고 세밀한 조정이 가능한 스플라인으로 매개변수화된 단일 변수 함수를 나타냅니다.

이 변화는 네트워크의 유연성을 향상시키고 데이터의 복잡한 패턴을 포착할 수 있는 능력을 강화하여 전통적인 MLP에 대한 해석 가능하고 강력한 대안을 제공합니다. KAN은 가장 최적의 성능을 위해 엣지에 있는 학습 가능한 활성화 함수에 초점을 맞춘 결과, 다양한 AI 작업에서 성능이 향상됩니다.

<div class="content-ad"></div>

# 3: 수학적 기초

콜모고로프-아놀드 네트워크(KANs)의 핵심은 이러한 네트워크가 입력 데이터를 처리하고 변환하는 방식을 정의하는 일련의 방정식입니다. KANs의 기초는 콜모고로프-아놀드 표현 정리에 있으며, 이는 네트워크의 구조와 학습 과정에 영감을 주는 개념입니다.

입력 벡터 x=[x1,x2,…,xn]가 있다고 상상해보세요. 이 벡터는 처리하려는 데이터 포인트를 나타냅니다. 이 입력 벡터를 레시피의 재료 목록으로 생각해보세요.

이 정리는 어떤 복잡한 레시피(고차원 함수)라도 보다 간단한 단계(일변량 함수)로 분해할 수 있다는 것을 명시합니다. KANs에서는 각 재료(입력 값)가 네트워크의 가장자리에 배치된 일련의 간단한 단계(일변량 함수)를 통해 변환됩니다. 이를 수학적으로 표현하면:

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_3.png)

여기서 ϕ_q,p는 학습 중에 학습되는 단변량 함수입니다. ϕ_q,p를 각 재료에 대한 개별 조리 기술로 생각하고, Φ_q를 이러한 준비된 재료를 결합하는 최종 조립 단계로 생각해보세요.

KAN의 각 층은 이러한 요리 기술을 사용하여 재료를 더 변형합니다. 층 l에 대해, 변형은 다음과 같이 주어집니다:

![image](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_4.png)

<div class="content-ad"></div>

여기서 x(l)은 l번째 레이어에서 변환된 재료를 나타내고, ϕ_l,i,j는 l레이어와 l+1 레이어 사이의 학습 가능한 일변량 함수입니다. 이를 각 단계마다 재료에 다양한 조리 기술을 적용하여 중간 요리를 얻는 것으로 생각해보세요.

KAN의 출력은 이러한 레이어 변환의 합성입니다. 중간 요리를 결합하여 최종 식사를 만드는 것처럼, KAN은 변환을 결합하여 최종 출력물을 생성합니다:

![image](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_5.png)

여기서 Φl은 l번째 레이어의 일변량 함수 행렬을 나타냅니다. KAN의 전체 함수는 이러한 레이어의 합성으로, 각각이 변환을 더욱 세밀하게 다듬습니다.

<div class="content-ad"></div>

MLP 구조
전통적인 MLP에서 각 노드는 입력에 고정된 활성화 함수 (예: ReLU 또는 sigmoid)를 적용합니다. 이를 생각해보면 각각의 성질에 관계없이 모든 재료에 동일한 조리 기술을 적용하는 것과 같습니다.

MLPs는 이러한 고정 비선형 활성화 함수에 이어서 선형 변환을 사용합니다:

![MLP Structure](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_6.png)

여기서 W는 가중치 행렬을 나타내고, σ는 고정된 활성화 함수를 나타냅니다.

<div class="content-ad"></div>

## 그리드 확장 기술

![이미지](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_7.png)

그리드 확장은 Kolmogorov-Arnold Networks (KANs)의 정확도를 향상시키기 위해 사용되는 강력한 기술로, 단변량 함수가 정의된 스플라인 그리드를 세밀하게 다듬는 데 사용됩니다. 이 과정을 통해 네트워크는 완전 재교육이 필요하지 않고도 데이터의 점점 더 세부적인 패턴을 학습할 수 있습니다.

이 B-스플라인은 부드러운 곡선을 형성하기 위해 결합된 일련의 다항 함수입니다. KANs에서는 가장자리의 단변량 함수를 나타내는 데 사용됩니다. 스플라인은 그리드 포인트라고 불리는 일련의 간격을 통해 정의됩니다. 그리드 포인트가 많을수록 스플라인이 캡처할 수 있는 세부 정보가 더욱 섬세해집니다.

<div class="content-ad"></div>

![KANKolmogorov-ArnoldNetworks_8](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_8.png)

먼저, 네트워크는 거친 격자로 시작되어 그리드 포인트 사이의 간격이 적습니다. 이는 네트워크가 세부 사항에 깊이 빠지지 않고 데이터의 기본 구조를 학습할 수 있도록 합니다. 이는 세부 사항을 채우기 전에 대략적인 윤곽을 그리는 것과 유사합니다.

학습이 진행됨에 따라 그리드 포인트의 수가 점진적으로 증가합니다. 이 과정을 그리드 세분화라고 합니다. 더 많은 그리드 포인트를 추가함으로써 스플라인이 더 자세해지고 데이터 내의 미세한 패턴을 잡을 수 있습니다. 이는 처음에 대략적인 스케치에 점차적으로 더 많은 세부 사항을 추가하여 자세한 그림으로 완성하는 것과 유사합니다.

매 증가할 때마다 새로운 B-spline 기저 함수 B′_m(x)가 도입됩니다. 이러한 새로운 기저 함수에 대한 계수 c'_m은 새로운, 더 자세한 스플라인이 초기, 더 거친 스플라인과 밀접하게 일치하도록 조절됩니다.

<div class="content-ad"></div>

이 작업을 수행하기 위해서는 최소 제곱 최적화가 사용됩니다. 이 방법은 계수 c'_m을 조정하여 원본 스플라인과 개선된 스플라인 간의 차이를 최소화합니다.

![image](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_9.png)

본질적으로, 이 과정은 개선된 스플라인이 원시 스플라인에 의해 학습된 데이터 패턴을 정확하게 나타내도록 보장합니다.

## 간소화 기법

<div class="content-ad"></div>

KANs의 해석 가능성을 향상시키기 위해, 네트워크를 이해하고 시각화하기 쉽게 만들기 위해 여러 간소화 기술이 사용될 수 있습니다.

희박화 및 가지치기
이 기술은 활성화 함수의 L1 노름에 기반한 손실 함수에 패널티를 추가하는 것을 포함합니다. 함수 ϕ에 대한 L1 노름은 모든 입력 샘플을 대상으로 함수의 평균 크기로 정의됩니다:

![수학 공식](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_10.png)

여기서 N_p는 입력 샘플 수이며, ϕ(x_s)는 입력 샘플 x_s에 대한 함수 ϕ의 값입니다.

<div class="content-ad"></div>

스파스파이케이션은 방을 정리하는 것과 같습니다. 불필요한 항목을 제거하거나 중요하지 않은 기능을 줄임으로써 공간(또는 네트워크)을 더 정리하고 쉽게 이동할 수 있게 만듭니다.

L1 규제를 적용한 후 활성화 함수의 L1 노름이 평가됩니다. 특정 임계값 이하의 노름을 가진 뉴런과 엣지는 중요하지 않다고 간주되어 제거됩니다. 가지치기를 위한 임계값은 가지치기를 얼마나 적극적으로 진행할지를 결정하는 하이퍼파라미터입니다.

가지치기는 나무를 가지치는 것과 같습니다. 약한 또는 불필요한 가지를 제거함으로써, 나무가 더 강하고 중요한 부분에 리소스를 집중할 수 있게 되어 더 건강하고 관리하기 쉬운 구조를 만들어냅니다.

상징화
다른 방법은 배운 단변량 함수를 알려진 기호 형태로 대체하여 네트워크를 보다 해석하기 쉽게 만드는 것입니다.

<div class="content-ad"></div>

잠재적인 상징적 형식 (예: sin⁡, exp)을 식별하는 작업입니다. 이 단계는 학습된 함수를 분석하고 모양과 행동에 기초하여 상징적 후보를 제안하는 것을 포함합니다.

상징적 후보가 식별되면 상징적 함수가 학습된 함수를 근사화하도록 매개변수를 적합시키기 위해 그리드 서치 및 선형 회귀를 사용하십시오.

# 4: KAN vs MLP in Python

Kolmogorov-Arnold Networks (KANs)와 전통적인 Multi-Layer Perceptrons (MLPs)의 능력을 시범하기 위해, PyTorch를 활용하여 함수를 생성한 데이터세트에 KAN 모델과 MLP 모델을 모두 적합시켜보겠습니다. 이들의 성능이 어떻게 보이는지 확인해봅니다.

<div class="content-ad"></div>

우리가 사용할 함수는 KAN의 능력을 MLP(원본 논문 예제)과 비교하기 위해 논문 저자들이 사용한 것과 동일합니다. 그러나 코드는 다를 것입니다. 오늘 다룰 모든 코드는 이 노트북에서 찾을 수 있습니다:

필요한 라이브러리를 가져와 데이터셋을 생성해 봅시다.

```js
import numpy as np
import torch
import torch.nn as nn
from torchsummary import summary
from kan import KAN, create_dataset
import matplotlib.pyplot as plt
```

여기서 우리가 사용하는 것입니다:

<div class="content-ad"></div>

- numpy: 숫자 연산에 사용됩니다.
- torch: PyTorch 용으로, 신경망 구축 및 훈련에 사용됩니다.
- torch.nn: PyTorch 내에서의 신경망 모듈에 사용됩니다.
- torchsummary: 모델 구조를 요약하는 데 사용됩니다.
- kan: KAN 모델 및 데이터셋 생성 함수를 포함하는 사용자 지정 라이브러리입니다.
- matplotlib.pyplot: 그래프 그리기와 시각화에 사용됩니다.

```js
# 데이터셋 생성 함수 정의
f = lambda x: torch.exp(torch.sin(torch.pi * x[:, [0]]) + x[:, [1]] ** 2)
```

이 함수에는 삼각함수(sin)와 지수함수(exp) 요소가 모두 포함되어 있습니다. 이 함수는 2차원 입력 x를 취하고 다음 공식을 사용하여 출력을 계산합니다:

<img src="/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_11.png" />

<div class="content-ad"></div>

이제 [-2, 2] 사이에서 균일하게 분포된 100개의 점의 텐서를 이 함수에 맞춰 보겠습니다.

![function](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_12.png)

```js
# 데이터셋 생성
dataset = create_dataset(f, n_var=2)
```

create_dataset은 함수 f를 기반으로 데이터셋을 생성합니다. 이 데이터셋에는 신경망의 훈련 및 테스트에 사용될 입력-출력 쌍이 포함됩니다.

<div class="content-ad"></div>

자, 이제 데이터셋을 사용하여 KAN 모델을 구축하고 훈련시킬 차례입니다. 
우리는 먼저 더 넓은 격자 (5 포인트)로 시작하여 점진적으로 더 섬세한 세부 사항을 캡처하기 위해 그것을 미세 조정할 것입니다(최대 100 포인트까지).
이것은 데이터의 세부 사항을 잡아내어 모델의 정확도를 향상시킵니다.

```js
grids = np.array([5, 10, 20, 50, 100])
train_losses_kan = []
test_losses_kan = []
steps = 50
k = 3

for i in range(grids.shape[0]):
    if i == 0:
        model = KAN(width=[2, 1, 1], grid=grids[i], k=k)
    else:
        model = KAN(width=[2, 1, 1], grid=grids[i], k=k).initialize_from_another_model(model, dataset['train_input'])
    results = model.train(dataset, opt="LBFGS", steps=steps, stop_grid_update_step=30)
    train_losses_kan += results['train_loss']
    test_losses_kan += results['test_loss']

    print(f"Train RMSE: {results['train_loss'][-1]:.8f} | Test RMSE: {results['test_loss'][-1]:.8f}")
```

이 예시에서 우리는 [5, 10, 20, 50, 100]의 값으로 grids라는 배열을 정의했습니다. 이러한 격자들을 순차적으로 모델 적합에 사용하며, 새 모델을 이전 모델을 사용하여 초기화합니다.

각 반복마다, k=3인 모델을 정의합니다. 여기서 k는 B-스플라인의 순서를 나타냅니다. 훈련 단계(또는 에포크) 수를 50으로 설정합니다. 모델의 아키텍처는 2개의 노드를 가진 입력 레이어, 1개의 노드를 가진 은닉 레이어 및 1개의 노드를 가진 출력 레이어로 구성됩니다. LFGBS 옵티마이저를 사용하여 훈련합니다.

<div class="content-ad"></div>

아래는 훈련 과정 중의 훈련 및 테스트 손실입니다:

![loss graph](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_13.png)

이제 전통적인 MLP를 정의하고 훈련하여 비교해 보겠습니다.

```python
# MLP 정의
class MLP(nn.Module):
    def __init__(self):
        super(MLP, self).__init__()
        self.layers = nn.Sequential(
            nn.Linear(dataset['train_input'].shape[1], 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )
    def forward(self, x):
        return self.layers(x)

# 모델 인스턴스화
model = MLP()
summary(model, input_size=(dataset['train_input'].shape[1],))
```

<div class="content-ad"></div>

MLP는 입력 레이어, 64개의 뉴런을 가진 두 개의 히든 레이어 및 출력 레이어를 가지고 있습니다. 레이어 간에는 ReLU 활성화 함수가 사용됩니다.

```js
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)
train_loss_mlp = []
test_loss_mlp = []

epochs = 250
for epoch in range(epochs):
    optimizer.zero_grad()
    output = model(dataset['train_input']).squeeze()
    loss = criterion(output, dataset['train_label'])
    loss.backward()
    optimizer.step()
    train_loss_mlp.append(loss.item()**0.5)

    # 모델 테스트
    model.eval()
    with torch.no_grad():
        output = model(dataset['test_input']).squeeze()
        loss = criterion(output, dataset['test_label'])
        test_loss_mlp.append(loss.item()**0.5)

    print(f'에폭 {epoch+1}/{epochs}, 훈련 손실: {train_loss_mlp[-1]:.2f}, 테스트 손실: {test_loss_mlp[-1]:.2f}', end='\r')
```

평균 제곱 오차 (MSE) 손실과 Adam 옵티마이저를 사용하고 모델을 250 에폭 동안 훈련하여 훈련 및 테스트 손실을 기록합니다.

MLP에서 훈련 및 테스트 RMSE가 어떻게 나타나는지 보여드리겠습니다:

<div class="content-ad"></div>

아래는 비교를 위해 손실 그래프를 나란히 두어 보겠습니다:

![](/assets/img/2024-06-19-TheMathBehindKANKolmogorov-ArnoldNetworks_15.png)

이 그래프는 KAN 모델이 MLP 모델보다 더 낮은 훈련 RMSE를 달성하여 더 나은 함수 맞추기 능력을 나타낸다는 것을 보여줍니다. 마찬가지로, KAN 모델은 시험 세트에서 MLP를 능가하여 뛰어난 일반화 능력을 보여줍니다.

<div class="content-ad"></div>

이 예시는 KAN이 유연하고 적응적인 구조 덕분에 복잡한 함수들을 전통적인 MLP보다 더 정확하게 맞출 수 있다는 것을 보여줍니다. 격자를 세밀하게 조정하고 가장자리에 학습 가능한 일변량 함수를 사용함으로써, KAN은 MLP가 놓치는 데이터의 복잡한 패턴을 포착하여 함수 맞추기 작업에서 성능을 향상시킵니다.

그렇다면 우리는 영구적으로 KAN 모델로 전환해야 한다는 것을 의미합니까? 꼭 그렇지는 않습니다.

이 예시에서 KAN은 훌륭한 결과를 보여주었지만, 다른 실제 데이터 시나리오에서 KAN을 시험한 결과, MLP가 더 좋은 성능을 내는 경우가 많았습니다. KAN 모델을 사용할 때 주목해야 할 점은 하이퍼파라미터 최적화에 대한 민감성입니다. 또한, KAN은 주로 스플라인 함수를 사용하여 테스트되었는데, 이는 저희 예시와 같이 부드럽게 변하는 데이터에는 잘 맞지만 다른 상황에서는 그렇지 않을 수 있습니다.

요약하자면, KAN은 분명히 매력적이고 많은 잠재력을 가지고 있지만, 실제로 효과적으로 작동하기 위해서는 다른 데이터셋 및 알고리즘 내부 동작에 대해 더 많은 연구가 필요합니다.

<div class="content-ad"></div>

# 5: KAN의 장점

## 정확성

Kolmogorov-Arnold Networks (KANs)의 두드러진 장점 중 하나는 전통적인 Multi-Layer Perceptrons (MLPs)에 비해 적은 매개변수로 더 높은 정확도를 달성할 수 있는 능력입니다. 이는 주로 에지에 있는 학습 가능한 활성화 함수 때문에 가능한데, 이는 KAN이 데이터 내의 복잡한 패턴과 관계를 더 잘 포착할 수 있게 합니다.

각 노드에 고정된 활성화 함수를 사용하는 MLP와 달리, KAN은 에지에서 단변량 함수를 사용하여 네트워크를 더 융통성 있게 만들고 학습 프로세스를 데이터에 더 잘 맞출 수 있도록 합니다.

<div class="content-ad"></div>

KANs은 층간 기능을 동적으로 조절할 수 있기 때문에 더 적은 매개변수로 비교적 높은 정확도를 얻을 수 있습니다. 이 효율성은 데이터나 계산 리소스가 제한된 작업에 특히 유용합니다.

## 해석가능성

KANs은 전통적인 MLPs에 비해 해석력을 크게 향상시킵니다. 이 향상된 해석력은 의사 결정 과정을 이해하는 것이 결과만큼 중요한 응용 프로그램에 중요합니다.

KANs은 희소화(sparsification) 및 가지치기(pruning)와 같은 기술을 통해 단순화될 수 있습니다. 이러한 기술은 해석력을 향상시키는 뿐만 아니라 가장 관련성이 높은 구성 요소에 집중함으로써 네트워크의 성능을 향상시킵니다.

<div class="content-ad"></div>

일부 함수의 경우 활성화 함수의 기호적 형태를 식별할 수 있으며, 이를 통해 네트워크 내에서 발생하는 수학적 변환을 이해하기 쉬워집니다.

## 확장성

KAN은 MLP와 비교했을 때 더 빠른 신경 확장 법칙을 나타내며, 매개변수의 수가 증가함에 따라 더 신속하게 개선됩니다.

KAN은 복잡한 함수를 더 단순한 단변량 함수로 분해할 수 있는 능력으로 인해 보다 유리한 확장 법칙을 갖게 되어, MLP보다 모델 복잡도가 증가함에 따라 더 효율적으로 낮은 오류율을 달성할 수 있습니다.

<div class="content-ad"></div>

KANs는 훈련 중에 더 미세한 그리드까지 더욱 세분화된 그리드로 시작하여 계산 효율성과 정확도를 균형있게 유지하도록 합니다. 이 접근 방식은 MLPs보다 KANs가 보다 우아하게 확장될 수 있게 하며, 모델 크기를 증가시킬 때 완전히 재훈련이 필요한 MLPs보다 우수한 성능을 제공합니다.

# 결론

Kolmogorov-Arnold Networks (KANs)는 전통적인 Multi-Layer Perceptrons (MLPs)에 비해 혁신적인 대안을 제시하여 이전 모델의 한계를 해소하는 핵심 혁신을 제공합니다. KANs는 노드에서 고정된 함수 대신 가장자리에 가중치가 있는 활성화 함수를 활용함으로써 새로운 수준의 유연성과 적응성을 도입합니다. 이 구조적인 변화로 인해 다음과 같은 장점을 제공합니다:

- 향상된 정확도: 더 적은 매개변수로 더 높은 정확도를 달성하는 KANs는 다양한 작업에 더 효율적이고 효과적입니다.
- 향상된 해석력: KANs를 시각화하고 단순화할 수 있는 능력은 건강 관리, 금융 및 자율 시스템과 같은 중요한 응용 분야에서 의사 결정 과정을 이해하는 데 도움이 됩니다.
- 더 나은 확장성: KANs는 더 빠른 신경 확장 법칙을 나타내며 MLPs보다 증가하는 복잡성을 우아하게 처리할 수 있습니다.

<div class="content-ad"></div>

콜모고로프-아놀드 네트워크 소개는 신경망 분야에서 흥미로운 발전을 의미합니다. 이는 AI 및 머신 러닝에 대한 새로운 가능성을 열어줍니다.

# 참고 자료

- Ziming Liu, 등. “KAN: 콜모고로프-아놀드 네트워크”. https://arxiv.org/abs/2404.19756