---
title: "신경망 출력에 제약 조건을 적용하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HowtoEncodeConstraintstotheOutputofNeuralNetworks_0.png"
date: 2024-06-22 20:15
ogImage: 
  url: /assets/img/2024-06-22-HowtoEncodeConstraintstotheOutputofNeuralNetworks_0.png
tag: Tech
originalTitle: "How to Encode Constraints to the Output of Neural Networks"
link: "https://medium.com/towards-data-science/how-to-encode-constraints-to-the-output-of-neural-networks-9bce302b9687"
---


## 사용 가능한 접근 방식 요약

![이미지](/assets/img/2024-06-22-HowtoEncodeConstraintstotheOutputofNeuralNetworks_0.png)

신경망은 정말로 강력합니다. 그러나 신경망의 응용 범위가 "표준" 분류 및 회귀 작업에서 더 복잡한 의사 결정 및 과학용 AI로 이동함에 따라 한 가지 단점이 점점 더 두드러지고 있습니다. 신경망의 출력은 일반적으로 제한이 없거나 보다 정확히는 간단한 0-1 한계 (시그모이드 활성화 함수), 비음수 제약 (ReLU 활성화 함수) 또는 합이 일 (소프트맥스 활성화 함수)인 제약으로만 제한됩니다. 이러한 "표준" 활성화 계층은 분류 및 회귀 문제를 처리하고 심층 학습의 활발한 발전을 목격했습니다. 그러나 신경망이 의사 결정, 최적화 해결 및 기타 복잡한 과학 문제에 널리 사용되기 시작함에 따라, 이러한 "표준" 활성화 계층이 명백히 더 이상 충분하지 않습니다. 본 문서에서는 신경망의 출력에 제약 조건을 추가할 수 있는 현재 사용 가능한 방법론을 간단히 논의하고 일부 개인적인 통찰을 포함시키겠습니다. 관련 주제에 대해 비평하고 토론하는 것을 망설이지 마세요.

<div class="content-ad"></div>

# 한 번에 성공하지 않을 때는 여러 번 시도해보세요

강화 학습에 익숙하시다면 이미 얘기하는 내용을 아실지도 모릅니다. n차원 벡터에 제약 조건을 적용하는 것은 어렵게 느껴질 수 있지만, n차원 벡터를 n개의 출력으로 나눌 수 있습니다. 각 출력이 생성될 때마다 다음 변수의 작업 공간을 제한하는 코드를 직접 작성하여 그 값이 적절한 범위 내에 유지되도록 할 수 있습니다. 이러한 "자기 회귀" 방법은 명백한 장점이 있습니다. 간단하며 다양한 제약 조건 (코드를 작성할 수 있다면)을 처리할 수 있습니다. 그러나 이 방법의 단점도 분명히 있습니다. n차원 벡터에 대해 순전파 연산을 호출해야 하기 때문에 비효율적이며, 또한 이 방법은 대개 Markov 의사 결정 과정 (MDP)으로 모델링되어야 하고 강화 학습을 통해 교육되어야 하므로 강화 학습에서 발생하는 일반적인 어려움인 큰 작업 공간, 희소 보상 함수, 오랜 교육 시간 또한 피할 수 없습니다.

신경망을 사용하여 조합 최적화 문제를 해결하는 영역에서 과거에는 강화 학습과 결합된 자기 회귀 방법이 일반적이었지만, 현재는 더 효율적인 방법으로 대체되고 있습니다.

# 어쩌면… 제약 조건을 학습해보는 것은 어떨까요?

<div class="content-ad"></div>

훈련 중에는 현재 신경망 출력이 제약 조건을 어기는 정도를 나타내는 페널티 항을 목적 함수에 추가할 수 있습니다. 전통적인 최적화 분야에서는 Lagrangian 이중 메서드도 비슷한 속임수를 제공합니다. 유감스럽게도, 이러한 방법들은 현재까지 일부 간단한 제약 조건에서만 신경망에 적용되었으며, 더 복잡한 제약 조건에도 적용 가능한지 여전히 불분명합니다. 단점 중 하나는 모델의 일부 용량이 해당 제약 조건을 충족하는 법을 배우는 데 사용되어, 모델의 다른 측면(예: 최적화 문제 해결)에서의 능력이 제한된다는 것입니다.

예를 들어, Karalias와 Loukas가 2021 NeurIPS에서 발표한 “Erdo˝s Goes Neural: an Unsupervised Learning Framework for Combinatorial Optimization on Graphs”에서는 변수 값이 [a, b] 사이에 있는 "상자 제약 조건"이란, 상자 제약 조건을 페널티 항을 통해 배울 수 있고, 네트워크는 일부 비교적 간단한 조합 최적화 문제를 해결할 수 있다는 것을 보여주었습니다. 그러나 우리의 추가 연구 결과, 이 방법론은 일반화 능력이 부족하다는 것을 발견했습니다. 훈련 세트에서는 신경망이 제약 조건을 잘 유지할 수 있지만, 테스트 세트에서는 제약 조건이 거의 완전히 상실됩니다. 또한, 원칙적으로 페널티 항을 추가하는 것은 어떤 제약 조건에도 적용할 수 있지만, 더 어려운 제약 조건을 처리할 수 없습니다. 저희 논문 Wang et al, 2023 ICLR에서는 “Towards One-Shot Neural Combinatorial Optimization Solvers: Theoretical and Empirical Notes on the Cardinality-Constrained Case”에서 이러한 현상에 대해 논의하고 이론적 분석을 제시합니다.

한편, 출력이 특정 분포를 준수해야 하는 생성 모델의 설계 철학은 "제약 조건 학습" 접근 방식과 더 잘 어울리는 것으로 보입니다. Sun과 Yang가 2023 NeurIPS에서 발표한 “DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization”에서는 확산 모델이 외판원 문제의 제약 조건(즉, 완전한 경로를 출력할 수 있는)을 충족하는 솔루션을 출력할 수 있다는 것을 보여주었습니다. 저희는 이어서 Li et al이 2023 NeurIPS에서 발표한 “T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization"에서 생성 모델(Diffusion)이 제약 조건을 충족하고, 다른 옵티마이저가 확산의 점진적 소음 제거 과정 중에 최적화 지침을 제공하는 방법을 제시했습니다. 이 전략은 실험에서 상당히 성능이 우수하게 나와서 이전의 모든 신경망 솔버를 능가했습니다.

# 또 다른 흥미로운 시각: 볼록 최적화 문제 해결

<div class="content-ad"></div>

아마도 자기회귀가 너무 비효율적이라고 생각하거나 생성 모델이 당신의 문제를 해결하지 못할 것 같다는 걱정이 있을 것 같아요. 단 한 번의 전방향 패스만 수행하는 신경망이 있고 출력이 주어진 제약 조건을 충족해야 한다면 가능할까요? 

그 대답은 예요. 우리는 신경망의 출력을 볼록 제약 조건에 의해 경계가 지정된 허용 가능한 영역으로 프로젝션하는 볼록 최적화 문제를 해결할 수 있어요. 이 방법론은 볼록 최적화 문제가 KKT 조건에서 미분 가능하다는 성질을 활용하여 이 프로젝션 단계를 활성화 레이어로 간주할 수 있어서 엔드 투 엔드 신경망에 삽입할 수 있어요. 이 방법론은 Zico Kolter의 CMU 그룹에서 제안 및 홍보되었으며 현재 cvxpylayers 패키지를 제공하여 구현 단계를 용이하게 할 수 있어요. 해당하는 볼록 최적화 문제는 다음과 같아요

여기서 y는 제약이 없는 신경망 출력이고, x는 제약이 있는 신경망 출력입니다. 이 단계의 목적이 프로젝션일 뿐이므로 선형 목적 함수로 이를 달성할 수 있어요 (엔트로피 정규화 항을 추가하는 것도 합리적입니다). Ax ≤ b는 적용해야 하는 선형 제약 조건이며, 제곱 혹은 다른 볼록 제약 조건일 수도 있어요.

개인 메모: 알려진 문제가 있는 것 같아서 이 저장소가 오랫동안 업데이트/유지되지 않은 것으로 보입니다 (2024년 04월). 무슨 일이 일어나고 있는지 조사해 주시는 분이 있다면 진심으로 감사하겠습니다.

<div class="content-ad"></div>

# 비 볼록 문제에 대해: 어떤 기울기 근사를 선호하시나요?

KKT 조건을 사용해 기울기를 유도하는 것은 이론적으로 타당하지만, 비 볼록 또는 비 연속 문제를 해결할 수 없습니다. 사실, 비 연속 문제의 경우, 문제 매개변수의 변화로 인해 해가 점프하면, 실제 기울기는 델타 함수(즉, 점프에서 무한대)가 됩니다. 이는 당연히 신경망 학습에 사용할 수 없습니다. 다행히도, 이 문제를 해결할 수 있는 몇 가지 기울기 근사 방법이 있습니다.

Max Planck 연구소 내 Georg Martius 그룹은 검은 상자 근사법 Vlastelica 등 ("Differentiation of Blackbox Combinatorial Solvers", ICLR'2020)를 소개했습니다. 이 방법은 문제 해결자를 검은 상자로 보는데, 먼저 한 번 호출한 후에 문제 매개변수를 특정 방향으로 변형하고 다시 호출합니다. 두 번의 해결자 호출의 출력 간 잔차가 근사 기울기로 작용합니다. 이러한 방법을 신경망 출력에 적용하여 제약 조건을 부여하는 경우, 선형 목적 함수가 있는 최적화 문제를 정의할 수 있습니다.

여기에서 y는 제약이 없는 신경망 출력이며, x는 제한된 신경망 출력입니다. 여러분의 다음 단계는 위 문제를 해결할 알고리즘을 구현하는 것(반드시 최적이 아니어도 됨)이며, 그런 다음 그것을 검은 상자 근사 프레임워크에 통합하는 것입니다. 검은 상자 근사법의 단점은 선형 목적 함수만 처리할 수 있다는 것이지만, 제약 조건을 부여하는 방법을 찾고 있다면 선형 목적 함수가 작동하는 것이 바로 맞게 됩니다. 게다가, 하이퍼파라미터가 잘 조정되지 않은 경우에는 희소한 기울기와 수렴 문제가 발생할 수 있기 때문에 주의가 필요합니다.

<div class="content-ad"></div>

기울기를 근사하는 또 다른 방법은 Berthet 등에 의해 논의된 것처럼 많은 양의 무작위 잡음 변형을 사용하여 반복적으로 솔버를 호출하여 기울기를 추정하는 것입니다. NeurIPS’2020 “Learning with Differentiable Perturbed Optimizers”에서 충분히 알려져 있습니다. 이론적으로 이 방법으로 얻은 기울기는 LinSAT 방법을 통해 얻은 기울기와 유사해야 합니다 (다음 섹션에서 설명될 것입니다). 즉, 엔트로피 정규화된 선형 목적 함수의 기울기입니다. 그러나 실제로는 이 방법이 많은 무작위 샘플을 필요로 하므로, 실제로는 조금 비실용적인 면이 있습니다 (적어도 내 사용 사례에서는 그렇습니다).

# 자기 홍보할 시간: 최적화 문제를 풀지 않고 투영하기

볼록 문제의 KKT 조건으로부터 기울기를 유도하거나 비볼록 방법에 대해 기울기를 근사하기 위해 솔버를 호출하거나 작성해야 하는 경우, CPU-GPU 통신이 병목 현상이 될 수 있습니다. 왜냐하면 대부분의 솔버는 보통 CPU용으로 설계 및 구현되기 때문입니다. 최적화 문제를 명시적으로 풀지 않고 GPU에 특정 제약 조건을 직접 투영하는 방법이 있을까요? 

그 대답은 예, 있습니다. 그리고 저희 Wang 등인 ICML’2023 “LinSATNet: The Positive Linear Satisfiability Neural Networks”는 실행 가능한 경로를 제시하며 알고리즘의 수렴 특성을 유도합니다. LinSAT은 선형 충족 네트워크를 의미합니다.

<div class="content-ad"></div>

LinSAT은 신경망의 출력에 일반적인 양의 선형 제약 조건을 적용할 수 있도록 하는 활성화 계층으로 볼 수 있습니다.

![image](/assets/img/2024-06-22-HowtoEncodeConstraintstotheOutputofNeuralNetworks_1.png)

LinSAT 계층은 완전히 미분 가능하며, 실제 그래디언트는 다른 활성화 계층처럼 autograd에 의해 계산됩니다. 현재 우리의 구현은 PyTorch를 지원합니다.

설치 방법은 다음과 같습니다:

<div class="content-ad"></div>

```shell
pip install linsatnet
```

그리고 다음과 같이 시작해보세요:

```python
from LinSATNet import linsat_layer
```

# 간단한 예제

<div class="content-ad"></div>

만약 소스 코드를 다운로드해서 실행하면 간단한 예제를 찾을 수 있어요. 이 예제에서는 3×3 행렬에 이중 확률 제약 조건을 적용해요.

예제를 실행하려면 먼저 repo를 복제하세요:

```js
git clone https://github.com/Thinklab-SJTU/LinSATNet.git
```

그리고 repo로 이동해서 예제 코드를 실행하면 돼요:

<div class="content-ad"></div>

```js
cd LinSATNet
python LinSATNet/linsat.py
```

이 예에서는 3x3 행렬에 이중 확률 제약 조건을 적용하려고 합니다. 이중 확률 제약 조건은 행렬의 모든 행과 열의 합이 1이어야 한다는 것을 의미합니다.

3x3 행렬은 벡터로 변환되며 다음과 같은 양의 선형 제약 조건이 고려됩니다 (Ex=f):

```js
E = torch.tensor(
    [[1, 1, 1, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 1, 1, 1, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 1, 1, 1],
     [1, 0, 0, 1, 0, 0, 1, 0, 0],
     [0, 1, 0, 0, 1, 0, 0, 1, 0],
     [0, 0, 1, 0, 0, 1, 0, 0, 1]], dtype=torch.float32
)
f = torch.tensor([1, 1, 1, 1, 1, 1], dtype=torch.float32)
```

<div class="content-ad"></div>

우리는 w를 무작위로 초기화하고, 이를 일부 신경망의 출력으로 간주합니다:

```js
w = torch.rand(9) # w는 신경망의 출력일 수 있음
w = w.requires_grad_(True)
```

또한, linsat_layer의 출력에 대한 "ground-truth target"도 있습니다. 이 예제에서는 대각 행렬입니다:

```js
x_gt = torch.tensor(
    [1, 0, 0,
     0, 1, 0,
     0, 0, 1], dtype=torch.float32
)
```

<div class="content-ad"></div>

You are a developer. Please translate the above text into Korean in a friendly tone.

<div class="content-ad"></div>

```js
loss = ((linsat_outp — x_gt) ** 2).sum()
loss.backward()
```

대량의 입력에 대해 시간 및 메모리 효율성을 높이려면 E를 희소 행렬로 설정할 수도 있어요. 다음은 덤한 예시에요 (효율성을 높이기 위해 E를 희소 행렬로 구성하는 것을 고려해보세요):

```js
linsat_outp = linsat_layer(w, E=E.to_sparse(), f=f, tau=0.1, max_iter=10, dummy_val=0)
```

우리는 linsat_layer의 출력을 x_gt에 가깝게 만들기 위해 w에 대한 경사 기반 최적화도 할 수 있어요. 이것은 신경망을 훈련시킬 때 발생하는 일이에요.

<div class="content-ad"></div>

```python
niters = 10
opt = torch.optim.SGD([w], lr=0.1, momentum=0.9)
for i in range(niters):
 x = linsat_layer(w, E=E, f=f, tau=0.1, max_iter=10, dummy_val=0)
 cv = torch.matmul(E, x.t()).t() - f.unsqueeze(0)
 loss = ((x - x_gt) ** 2).sum()
 loss.backward()
 opt.step()
 opt.zero_grad()
 print(f'{i}/{niters}\n'
 f' underlying obj={torch.sum(w * x)},\n'
 f' loss={loss},\n'
 f' sum(constraint violation)={torch.sum(cv[cv > 0])},\n'
 f' x={x},\n'
 f' constraint violation={cv}')
```

And you are likely to see the loss decreasing during the training steps.

For full API references, please check out the GitHub repository.

# How does LinSAT work?


<div class="content-ad"></div>

주의하세요! 수학 내용이 많습니다! LinSAT을 사용 중이라면 이 부분을 건너뛰셔도 됩니다.

LinSAT 내부의 메커니즘을 소개합니다. 우리는 Sinkhorn 알고리즘을 여러 세트의 마진에 확장함으로써 작동합니다 (우리의 최선 지식으로, 우리는 마진의 다중 세트에 대해 Sinkhorn을 연구한 첫 번째 연구자입니다). 그런 다음 양적 선형 제약 사항은 제약 사항을 마진으로 변환함으로써 강제됩니다.

## 단일 세트 마진을 사용하는 클래식한 Sinkhorn

클래식한 Sinkhorn 알고리즘부터 시작해봅시다. 크기가 m×n인 비음수 점수 행렬 S가 주어지고, 행에 대한 마진 분포 세트(크기가 m인 비음수 벡터 v)와 열에 대한 마진 분포 세트(크기가 n인 비음수 벡터 u)가 주어지면

<div class="content-ad"></div>

Sinkhorn 알고리즘은 m×n 크기의 정규화된 행렬 Γ를 출력하며, 값은 [0,1] 범위에 있습니다.

개념적으로, Γᵢ ⱼ는 uⱼ에서 vᵢ로 이동된 비율을 의미합니다.

알고리즘 단계는 다음과 같습니다:

## 다중 집합 마진을 가진 확장된 Sinkhorn

<div class="content-ad"></div>

Sinkhorn 알고리즘이 여러 세트의 마진에 대해 일반화될 수 있다는 것을 발견했습니다. Γᵢ ⱼ ∈ [0,1]는 uⱼ가 vᵢ로 이동한 비율을 의미합니다. 흥미로운 점은 u, v를 다른 세트의 마진 분포로 간단히 교체하면 동일한 공식이 생성된다는 것입니다. 이는 Sinkhorn 알고리즘을 여러 세트의 마진 분포로 확장할 수 있는 잠재력을 시사합니다. 현실세계 시나리오를 더 잘 반영하기 위해 강제되는 k개의 세트의 마진 분포를 나타냅니다. 마진 분포 세트는 다음과 같습니다.
그리고 우리는 다음과 같습니다:

m×n 크기의 정규화된 Z ∈ [0,1]가 존재한다고 가정합니다.
즉, 여러 세트의 마진 분포가 비어 있지 않은 실행 가능 영역을 갖습니다 (다음 섹션에서 어떻게 양의 선형 제약 조건을 처리하는지 읽은 후 "비어 있지 않은 실행 가능 영역"의 의미를 이해할 수 있습니다). 여러 세트의 마진 분포는 Sinkhorn 반복을 거치면서 강제할 수 있습니다. 알고리즘 단계는 다음과 같습니다:

<div class="content-ad"></div>

우리 논문에서는 다중 집합 주변 분포를 위한 Sinkhorn 알고리즘이 클래식한 Sinkhorn과 동일한 수렴 패턴을 공유하며, 기본적인 공식 또한 클래식한 Sinkhorn과 유사하다는 것을 증명합니다.

## 긍정적 선형 제약 조건을 주변 분포로 변환

그런 다음, 우리는 긍정적 선형 제약 조건을 주변 분포로 변환하는 방법을 보여주고, 이는 우리가 제안하는 다중 세트 Sinkhorn에 의해 처리됩니다.

신경망의 출력 인코딩
신경망의 출력으로 표시되는 길이 l의 벡터 y에 대해 (이는 신경망의 출력이 될 수 있으며, linsat_layer의 입력일 수도 있습니다), 다음 행렬이 구성됩니다.

<div class="content-ad"></div>

W는 크기가 2 × (l + 1)인 표입니다. β는 더미 변수이며 기본값은 β = 0입니다. y는 W의 왼쪽 위 영역에 위치합니다. 그런 다음 엔트로피 정규화자가 강제로 적용되어 이산성을 제어하고 잠재적으로 음의 입력값을 처리합니다:

점수 행렬 S는 다중 집합 marginal의 입력으로 사용됩니다.

선형 제약 조건부터 마진까지

1) 포장 제약 Ax ≤ b. 단 하나의 제약 조건만 있는 경우, 제약 조건을 다음과 같이 다시 쓸 수 있습니다:

<div class="content-ad"></div>

시콘의 "운송" 관점을 따르면 출력 x는 a₁, a₂, ..., aₗ에서 최대 b 단위의 질량을 이동하고 더미 차원은 가짜 차원으로부터 질량을 이동하여 부등식을 허용합니다. 또한 uₚ의 합이 vₚ의 합과 동일하다는 것이 보장됩니다. 주변 분포는 다음과 같이 정의됩니다.

2) 커버링 제약 Cx ≥ d. 하나의 제약만 있는 경우, 제약을 다음과 같이 다시 쓸 수 있습니다.

우리는 항상 가지고 있기 때문에 이러한 승수를 도입합니다.

<div class="content-ad"></div>

(그렇지 않으면 제약 조건이 실행할 수 없는 것이며, 이 배율 없이 x 내의 모든 요소가 1이 되는 실행 가능한 솔루션에 도달할 수 없습니다. 우리의 공식은 x에 의해 c₁, c₂, ..., cₗ 에서 적어도 d 단위의 질량이 이동되는 것을 보장하므로 "이상"의 커버링 제약 조건을 나타냅니다. 또한 u_c의 합이 v_c의 합과 동일함을 보장합니다. 마진 분포는 다음과 같이 정의됩니다

3) 등식 제약 조건 Ex = f. 등식 제약 조건을 나타내는 것은 더 직관적입니다. 하나의 제약 조건만 있는 경우를 가정하면, 제약 조건을 다음과 같이 다시 작성할 수 있습니다

결과 x는 e₁, e₂, ..., eₗ를 f로 이동시키며, uₑ에 더미 요소가 필요하지 않음을 알아야합니다. 또한 uₑ의 합이 vₑ의 합과 동일함을 보장합니다. 마진 분포는 다음과 같이 정의됩니다

모든 제약 조건을 인코딩하고 이를 여러 세트의 마진으로 쌓은 후, Sinkhorn 알고리즘을 호출하여 다중 세트 마진에 대한 제약 조건을 인코딩할 수 있습니다.)

<div class="content-ad"></div>

## LinSAT의 실험적 유효성 검증

저희의 ICML 논문에서는 LinSATNet 방법을 일반적인 경우를 넘어 라우팅 제약 조건에 대해 검증했습니다 (여행하는 외판원 문제의 변형 해결에 사용), 부분 그래프 매칭 제약 조건 (그래프 매칭에서 그래프의 부분 집합만 서로 일치하는 경우 사용), 그리고 일반적인 선형 제약 조건 (포트폴리오 최적화와 관련된 특정 선호도에서 사용). 이러한 문제들은 모두 양수 선형 제약 조건으로 표현할 수 있으며 LinSATNet 방법을 사용하여 처리할 수 있습니다. 실험에서 신경망은 이 세 가지 문제를 해결하는 방법을 배울 수 있었습니다.

LinSATNet 방법은 음수 용어가 포함된 x₁ — x₂ ≤ 0과 같은 제약 조건을 처리할 수 없다는 사실을 강조해야 합니다. 그러나 양수 선형 제약 조건은 이미 다양한 시나리오를 포괄하고 있습니다. 각각의 특정 문제에 대해 수학적 모델링은 종종 유일하지 않으며, 많은 경우 합리적인 양수 선형 정식을 찾을 수 있습니다. 위에 언급된 예시들 외에도, 유기 분자를 출력하는 네트워크가 있을 수 있습니다 (그래프로 표현되며 수소 원자를 무시하고 골격만 고려). 이 경우에는 C 원자가 4개의 결합을 초과하지 않도록, O 원자는 2개의 결합을 초과하지 않도록 하는 제약 조건이 고려될 수 있습니다.

# 결말

<div class="content-ad"></div>

신경망에 제약 조건을 추가하는 것은 다양한 응용 시나리오를 가지고 있으며, 현재까지 여러 방법이 있습니다. 각 방법의 우월성을 판단하는 황금 기준이 없다는 것을 알아두는 것이 중요합니다. 일반적으로 최적의 방법은 특정 시나리오에 관련이 있습니다.

물론 LinSATNet을 사용해보는 것을 추천합니다! 아무튼, 이는 당신의 네트워크에 활성화 계층만큼 간단합니다.

만약 이 기사가 도움이 되었다면 아래를 인용해주시기 바랍니다:

```js
@inproceedings{WangICML23,
  title={LinSATNet: The Positive Linear Satisfiability Neural Networks},
  author={Wang, Runzhong and Zhang, Yunhao and Guo, Ziao and Chen, Tianyi and Yang, Xiaokang and Yan, Junchi},
  booktitle={International Conference on Machine Learning (ICML)},
  year={2023}
}
```

<div class="content-ad"></div>

모든 언급된 내용은 이 논문에서 논의되었습니다.