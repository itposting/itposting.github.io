---
title: "강화 학습 딥 Q-네트워크"
description: ""
coverImage: "/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_0.png"
date: 2024-05-27 14:10
ogImage:
  url: /assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_0.png
tag: Tech
originalTitle: "Reinforcement Learning: Deep Q-Networks"
link: "https://medium.com/towards-data-science/reinforcement-learning-from-scratch-deep-q-networks-0a8d33ce165b"
---

## Python을 사용하여 달에 착륙하는 셔틀 가르치기: Deep Q-Networks를 활용한 강화 학습의 수학적 탐구

![Reinforcement Learning](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_0.png)

강화 학습(RL)에서 Q-학습은 에이전트가 환경을 탐색하면서 누적 보상을 극대화하기 위한 정책을 학습하는 데 도움이 되는 기본 알고리즘입니다. 이를 통해 특정 상태에서 특정 작업을 수행했을 때 기대되는 유틸리티를 추정하는 작업-값 함수를 업데이트 함으로써 보상을 받고 미래 추정에 기반합니다 (이게 익숙하지 않으신가요? 걱정 마세요. 나중에 함께 자세히 살펴볼 겁니다).

그러나 전통적인 Q-학습에는 도전 과제가 있습니다. 상태 공간이 확장됨에 따라 확장 가능성에 어려움을 겪으며 연속적인 상태 및 작업 공간을 갖는 환경에서 효과적이지 않습니다. 이때 Deep Q Networks (DQNs)가 나타납니다. DQNs는 Q-값을 근사하기 위해 신경망을 사용하여 에이전트가 보다 크고 복잡한 환경을 효과적으로 처리할 수 있도록 합니다.

<div class="content-ad"></div>

본 기사에서는 Deep Q Networks에 대해 자세히 살펴보겠습니다. DQNs가 기존의 Q-learning의 한계를 극복하는 방법과 DQN을 구성하는 주요 구성 요소에 대해 탐구할 것입니다. 또한 처음부터 DQN을 구현하고 더 복잡한 환경에 적용하는 과정을 살펴볼 것입니다. 이 기사를 마치면 DQN이 어떻게 작동하는지 이해하고 도전적인 강화 학습 문제를 해결하는 데 사용하는 방법을 알게 될 것입니다.

## 목차

1: 전통적인 Q-러닝
∘ 1.1: 상태와 행동
∘ 1.2: Q-값
∘ 1.3: Q-테이블
∘ 1.4: 학습 과정

2: Q-러닝에서 Deep Q-네트워크로
∘ 2.1: 전통적인 Q-러닝의 한계
∘ 2.2: 신경망

<div class="content-ad"></div>

3: Deep Q-Network의 해부학

- 3.1: DQN의 구성요소
- 3.2: DQN 알고리즘

4: 처음부터 Deep Q-Network 구현하기

- 4.1: 환경 설정
- 4.2: 딥 신경망 구축
- 4.3: 경험 재생 구현
- 4.4: 타깃 네트워크 구현
- 4.5: Deep Q-Network 훈련
- 4.6: 모델 튜닝
- 4.7: 모델 실행

5: 결론
참고 문헌

# 1: 전통적인 Q-Learning

<div class="content-ad"></div>


![Reinforcement Learning Deep Q Networks](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_1.png)

Q-러닝은 환경에서 누적 보상을 극대화하기 위한 최적 조치를 학습하는 에이전트를 안내합니다. 딥 Q-네트워크에 집중하기 전에, 그 선구자인 Q-러닝 뒤에 있는 메커니즘을 간단히 검토하는 것이 좋습니다.

## 1.1: 상태 및 조치

미로를 탐색하는 로봇이라고 상상해보세요. 미로에서 차지하는 각 위치를 "상태"라고 합니다. 왼쪽, 오른쪽, 위 또는 아래로 이동하는 것과 같은 각각의 움직임을 "조치"라고 합니다. 목표는 결국 미로를 통해 최적 경로를 찾으려면 각 상태에서 어떤 조치를 취할지 결정하는 것입니다.


<div class="content-ad"></div>

## 1.2: Q-Values

Q-Learning의 핵심은 Q-값으로, 𝑄(𝑠, 𝑎)로 표시됩니다. 이 값은 특정 상태 s에서 특정 행동 a를 취한 후 더 나은 경로(정책)를 따를 때 기대되는 미래 보상을 나타냅니다.

Q-값을 가이드북의 항목으로 생각해보세요. 각 가능한 이동의 장기적 이점을 평가하는 것입니다. 예를 들어 미로의 특정 위치에 있다고 가정했을 때 왼쪽으로 이동하는 경우, Q-값은 미래 보상 측면에서 그 이동이 얼마나 유익할지 알려줍니다. 더 높은 Q-값은 더 나은 이동을 나타냅니다.

## 1.3: The Q-Table

<div class="content-ad"></div>

Q-Learning은 Q-값을 추적하는 데 Q-테이블을 사용합니다. Q-테이블은 기본적으로 각 행이 상태에 해당하고 각 열이 행동에 해당하며 각 셀이 해당 상태-행동 쌍의 Q-값을 포함하는 대형 스프레드시트입니다.

Q-테이블을 거대한 스프레드시트로 상상해보세요. 각 셀은 미로의 특정 위치에서 특정 이동을 하였을 때 잠재적 미래 보상을 나타냅니다. 환경에 대해 더 많이 배우면이 보상의 더 나은 추정치로이 스프레드시트를 업데이트합니다.

## 1.4: 학습 과정

Q-러닝의 학습 과정은 반복적입니다. 초기 상태 s에서 시작합니다. 그런 다음 작업 a를 결정합니다. 이 선택은 다음을 기반으로 할 수 있습니다:

<div class="content-ad"></div>

- 탐험: 효과를 발견하기 위해 새로운 조치를 시도합니다.
- 개척: 가장 높은 알려진 Q-값을 갖는 조치를 선택하기 위해 기존 지식을 사용합니다.

선택한 조치를 수행하고 보상 r을 관찰하며 다음 상태 s'로 이동합니다. Q-러닝 공식을 사용하여 상태-조치 쌍 (s, a)의 Q-값을 업데이트합니다:

[이미지](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_2.png)

여기에:

<div class="content-ad"></div>

- α는 학습 속도로, 새로운 정보가 이전 정보를 얼마나 덮어쓸지를 결정합니다.
- γ는 할인 요소로, 즉각적 보상을 먼 미래의 보상보다 더 가치 있게 여깁니다.
- maxa′Q(s′,a′)는 다음 상태 s′에서 가능한 모든 행동 a′에 대해 최고의 Q값을 나타냅니다.

매번 안내서를 업데이트하고 있다고 상상해 보세요. 각 이동 후에 성공적인지 실패인지에 대한 피드백(보상)을 받습니다. 그런 다음 새로운 정보를 반영하도록 가이드북의 등급(Q값)을 조정하여 미래의 결정을 더 잘 하게 됩니다.

Q값이 수렴할 때까지 이 과정을 반복하면, 에이전트는 미로를 탐색하는 최적 정책을 학습한 것입니다. 시간이 흘러, 미로를 반복적으로 탐험하고 경험에 기반하여 가이드북을 업데이트함으로써 최상의 보상을 얻기 위한 최적의 움직임을 알려주는 포괄적인 전략을 개발하게 됩니다.

Q-러닝에 대해 자세히 알아보려면 이 기사를 확인해 보세요: [링크](링크)

<div class="content-ad"></div>

# 2: Q-Learning에서 Deep Q-Network로

## 2.1: 전통적인 Q-Learning의 한계

Q-Learning은 강화 학습에 대한 강력한 알고리즘이지만, 더 복잡한 환경에서 효과적으로 동작하는 데 제약 사항이 몇 가지 있습니다:

확장성 문제: 전통적인 Q-Learning은 각 상태-행동 쌍이 Q-값에 매핑된 Q-테이블을 유지합니다. 상태 공간이 성장함에 따라, 특히 고차원 또는 연속적인 환경에서는 Q-테이블이 불필요하게 커져 메모리 비효율성과 학습 속도 저하를 초래합니다.

<div class="content-ad"></div>

이산 상태 및 행동 공간: Q-Learning은 상태와 행동이 이산적이고 유한한 환경에서 잘 동작합니다. 하지만 현실 세계의 많은 문제는 연속적인 상태와 행동 공간을 포함하고 있습니다. 이러한 전통적인 Q-Learning은 이러한 공간을 이산화하지 않고는 효율적으로 처리할 수 없으며, 이로 인해 정보 손실과 최적 정책의 하락을 초래할 수 있습니다.

## 2.2: 신경망

이제 신경망을 소개해 보겠습니다. 신경망은 딥 네트워크에서 중요한 역할을 하는데, 인간 두뇌의 구조와 기능을 모방하여 데이터로부터 복잡한 패턴을 학습할 수 있는 강력한 함수 근사기입니다. 신경망은 입력 데이터를 처리하고 가중치와 편향을 통해 변환하여 출력을 생성하는 연결된 노드(뉴런)의 계층으로 이루어져 있습니다.

강화 학습의 맥락에서 신경망은 Q-함수를 근사화하는 데 사용될 수 있습니다. 이는 상태-행동 쌍을 Q-값에 매핑하는 데 도움이 되며, 특히 Q-테이블을 유지하는 것이 적절하지 않은 대규모나 연속적인 공간에서 상태와 행동 간에 일반화를 더 잘할 수 있도록 합니다.

<div class="content-ad"></div>

따라서, Deep Q-networks(DQNs)은 Q-Learning의 원리를 신경망의 함수 근사 능력과 결합시켜요. 그렇게 하면 전통적인 Q-learning의 주요 제약 사항을 다룰 수 있어요.

DQNs은 Q-값을 테이블에 저장하는 대신 신경망을 사용하여 Q-함수를 근사해요. 이 네트워크는 상태를 입력으로 받아 가능한 모든 행동에 대한 Q-값을 출력해요. 환경에서의 경험으로 네트워크를 학습시켜 에이전트는 각 행동에 대한 예상 보상을 예측하도록합니다. 이를 통해 다양한 상태와 행동에 걸쳐 일반화할 수 있어요.

체스를 배우는 것을 상상해보세요. 가능한 모든 체스판 구성과 각 동작에 대한 최상의 수를 외우는 대신(불가능한 일이죠), 전략과 원칙(예를 들어 보드 중앙을 제어하고 왕을 보호하는 것과 같은 것)을 배우게 됩니다. 비슷하게, DQN는 신경망을 통해 일반적인 패턴과 전략을 배우고 모든 가능한 상태를 외우지 않고도 정보를 바탕으로 결정할 수 있어요.

신경망 사용은 DQN이 크거나 연속된 상태 공간을 다룰 수 있게 해요. 네트워크는 주요 특징을 잡아내는 상태 공간의 표현을 학습해 중요한 결정을 취할 수 있도록 해줍니다.

큰 도시를 이동하려면 고려합시다. 모든 거리와 건물의 배치를 외우는 대신 표지판과 중요 도로를 인식해 길을 찾게 됩니다. DQN의 신경망도 비슷하게 작용하며, 에이전트가 복잡한 환경에서 이동하는 것을 돕는 상태 공간의 중요한 특징을 인식하도록 학습합니다.

<div class="content-ad"></div>

다양한 경험을 훈련함으로써 모델은 과거 경험에서 일반화하는 법을 배우게 됩니다. 즉, 에이전트는 배운 것을 새로운, 보지 못한 상태와 행동에 적용할 수 있어서 다양한 상황에서 더 적응력이 있고 효율적일 수 있습니다.

# 3: 딥 Q-네트워크의 구성 요소

## 3.1: DQN의 구성 요소

딥 Q-네트워크 (DQN)가 어떻게 작동하는지 이해하려면 그 주요 구성 요소를 자세히 살펴보는 것이 중요합니다:

<div class="content-ad"></div>

3.1.1: 신경망

![신경망](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_3.png)

DQN의 핵심은 Q값을 위한 함수 근사기 역할을 하는 신경망입니다. 아키텍처는 일반적으로 다음과 같이 구성됩니다:

입력 레이어: 에이전트의 "눈"으로 상상해보세요. 이 레이어는 환경으로부터 상태 표현을 받아들이는데, 마치 당신의 눈이 주변의 시각적 정보를 받아들이는 것과 유사합니다. 위의 이미지에서 왼쪽에 두 개의 노드가 있는 첫 번째 레이어입니다.

<div class="content-ad"></div>

Hidden Layers: 이러한 레이어들은 에이전트의 "뇌"로 생각할 수 있습니다. 눈을 통해 받은 정보를 다수의 사고 단계를 거쳐 처리하여 복잡한 특징과 패턴을 식별합니다. 마치 당신의 뇌가 세계를 처리하고 이해하는 방식과 비슷합니다. 위 이미지에서는 세 개의 노드가 있는 중간 레이어입니다.

Output Layer: 이는 에이전트의 "의사 결정" 부분과 같습니다. 입력 상태에 따라 모든 가능한 행동에 대한 Q 값(값함수)을 생성합니다. 당신이 보고 생각한 것에 기반하여 최선의 행동을 결정하는 방식과 유사합니다. 각 출력은 특정 행동을 취했을 때 기대되는 보상에 해당합니다. 위 이미지에서는 한 개의 노드를 가진 오른쪽의 마지막 레이어입니다.

위 이미지는 간단한 피드포워드 신경망을 나타냅니다. 이는 신경망의 가장 기본적인 형태입니다. 이 구조는 기본적이지만 "깊은" 신경망은 아닙니다. 깊은 신경망으로 변환하기 위해서는 더 많은 은닉 레이어를 추가하여 신경망의 깊이를 증가시켜야 합니다. 또한, 다양한 아키텍처와 구성을 실험하여 더 발전된 모델을 개발할 수 있습니다. 각 레이어의 노드 수는 고정되지 않으며, 특정 훈련 데이터셋과 작업에 따라 다양합니다. 이러한 유연성을 통해 네트워크를 특정 목적에 더 잘 맞게 조정할 수 있습니다.

신경망에 대해 더 알고 싶다면, 나는 아래의 글을 강력히 추천합니다:

<div class="content-ad"></div>

3.1.2: 경험 재생
이제 목록의 다음 항목인 경험 재생으로 넘어가 봅시다. 이것은 DQNs에서 학습 과정을 안정화하고 향상시키는 기술입니다. 다음을 포함합니다:

메모리 버퍼: 에이전트의 "일기"로 생각해보세요. 이것은 에이전트의 경험을 시간이 지남에 따라 저장합니다 (상태, 행동, 보상, 다음 상태, 완료), 마치 매일 당신이 무슨 일이 일어났는지 기록하는 것처럼.

랜덤 샘플링: 훈련 중에 에이전트는 지난 경험을 배우기 위해 일기의 랜덤한 페이지를 넘깁니다. 이는 사건의 순서를 깨어주어 에이전트가 경험의 순서에 과적합되는 것을 방지하여 보다 견고하게 학습하도록 돕습니다.

3.1.3: 타겟 네트워크
마지막으로, 타겟 네트워크는 훈련을 위해 타겟 Q-값을 계산하는 데 사용되는 별도의 신경망입니다. 주 신경망과 동일한 구조를 가지고 있지만 주 신경망의 가중치가 정기적으로 업데이트되어 일치하도록 고정되어 있습니다. 에이전트를 위한 "안정된 안내서"로 생각해보세요. 주 신경망이 지속적으로 학습하고 업데이트되는 반면, 타겟 네트워크는 안정된 Q-값을 제공하여 훈련에 도움을 줍니다. 학습을 안정적이고 일관되게 유지하는 데 도움이 되는 신뢰할 수 있는, 주기적으로 업데이트되는 매뉴얼이 있는 것과 같습니다.

<div class="content-ad"></div>

## 3.2: DQN 알고리즘

이러한 구성 요소가 준비되면 DQN 알고리즘은 다음과 같은 몇 가지 중요한 단계로 개요를 제시할 수 있습니다:

### 3.2.1: 순방향 전파

먼저, 우리는 Q-values를 예측하는 데 중요한 순방향 전파로 시작합니다. 이러한 Q-values는 특정 상태에서 특정 행동을 취했을 때 기대되는 미래 보상을 저장합니다. 이 프로세스는 상태 입력부터 시작됩니다.

#### 상태 입력

에이전트는 환경에서 현재 상태 s를 관찰합니다. 이 상태는 에이전트의 현재 상황을 설명하는 특징 벡터로 표현됩니다. 상태를 에이전트 주변 세계의 스냅숏으로 생각해보세요. 눈이 주변을 둘러보는 것처럼 시각 장면을 촬영할 때와 유사합니다. 이 스냅숏에는 에이전트가 결정을 내리기 위해 필요한 모든 세부 정보가 포함되어 있습니다.

<div class="content-ad"></div>

Q-Value Prediction
이제 이 관측된 상태 s가 신경망으로 전달됩니다. 이 신경망은 여러 층을 통해 이 입력을 처리하고 Q-값 세트를 출력합니다. 각 Q-값은 가능한 작업 a에 해당하며, 매개 변수 θ는 네트워크의 가중치와 편향을 나타냅니다.

![image](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_4.png)

신경망을 에이전트 뇌의 복잡한 의사 결정 기계로 상상해보세요. 캡처(상태)를 받으면 이 정보를 여러 단계(층)를 통해 처리하여 다양한 작업에 대한 잠재적 결과(Q-값)를 찾습니다. 보이는 것을 바탕으로 취할 수 있는 다양한 작업을 고려해보는 것과 유사합니다.

작업 선택
그런 다음 에이전트는 가장 높은 Q-값을 가진 작업 a∗를 다음 움직임으로 선택하며, 이에 따라 탐욕적 작업 선택 정책을 따릅니다:

<div class="content-ad"></div>

![image](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_5.png)

이것은 모든 옵션을 심사한 후에 최선의 움직임을 결정하는 것과 유사합니다. 에이전트는 가장 높은 보상을 가져다줄 것으로 믿는 행동을 선택하며, 마치 당신이 보고 이해한 것을 기반으로 가장 유망한 길을 선택하는 것과 같습니다.

3.2.2: 경험 재생
다음으로, 우리는 학습 과정을 안정화하고 향상시키는 데 도움이 되는 경험 재생에 대해 이야기하겠습니다.

경험 저장
에이전트가 행동 a를 취하고 보상 r을 받은 후 새로운 상태 s′를 받으면, 이 경험을 (s, a, r, s′, done) 튜플로 저장하여 플레이백 버퍼에 저장합니다. 변수 done은 에피소드가 종료되었는지를 나타냅니다. 플레이백 버퍼를 에이전트가 경험을 기록하는 다이어리로 생각해보세요. 이는 당신이 하루 중 주목할 만한 사건을 메모하는 것과 유사합니다.

<div class="content-ad"></div>

샘플 미니배치
훈련 중에는 경험의 미니배치가 임의로 선택되어 재생 버퍼에서 샘플링됩니다. 이 배치는 타겟 Q-값을 계산하고 손실을 최소화하여 네트워크를 업데이트하는 데 사용됩니다. 에이전트가 훈련할 때, 과거 경험을 학습하기 위해 일기장의 임의의 페이지를 넘겨보게 됩니다. 이 임의 샘플링은 사건의 순서를 깨고 다양한 학습 예제를 제공하며, 일기의 서로 다른 날짜를 검토하여 보다 넓은 시야를 얻는 것과 유사한 역할을 합니다.

3.2.3: 역전파
최종 단계는 역전파로, 이는 네트워크를 업데이트하여 예측을 개선합니다.

<div class="content-ad"></div>

타겟 Q-값 계산
미니 배치의 각 경험에 대해, 에이전트는 타겟 Q-값 y\_를 계산합니다. 만약 다음 상태 s′가 종료 상태(즉, done이 true인 경우)라면, 타겟 Q-값은 간단히 보상 r입니다. 그렇지 않으면, 타겟 Q-값은 보상에 다음 상태 s′에서 타겟 네트워크 Qtarget에 의해 예측된 할인된 최대 Q-값을 더한 값입니다:

![image](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_7.png)

여기서 γ는 할인 계수(0 ≤ γ ≤ 1)입니다. 이 단계는 과거 경험에 기반해 미래를 계획하는 것과 같습니다. 경험이 여행(에피소드)을 끝낼 경우, 타겟은 받은 보상입니다. 계속된다면, 타겟에는 즉시와 미래 혜택을 모두 고려하여 행동을 계획하는 방식과 유사한 예상 미래 보상이 포함됩니다.

손실 계산
다음으로, 손실은 메인 네트워크에서 예측된 Q-값 Q(s_i, a_i; θ)과 타겟 Q-값 yi 사이의 평균 제곱 오차로 계산됩니다:

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_8.png)

손실을 계산하는 것은 예측이 실제 결과와 얼마나 차이가 나는지를 평가하는 것과 같습니다. 실제 결과와 비교하여 추측의 정확성을 확인하고 차이점을 주목하는 것과 같습니다.

역전파 및 최적화
마지막으로, 이 손실을 최소화하기 위해 역전파를 수행합니다. 계산된 손실은 네트워크를 통해 역전파되어 SGD(Stochastic Gradient Descent) 또는 Adam과 같은 최적화 알고리즘을 사용하여 가중치를 업데이트합니다. 이 프로세스는 손실을 최소화하기 위해 네트워크 매개변수 θ를 조정합니다:

![image](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_9.png)


<div class="content-ad"></div>

여기서 α는 학습률을 나타내고, ∇θLoss는 네트워크 매개변수에 대한 손실의 그래디언트를 나타냅니다. 역전파는 실수로부터 배우는 것과 같습니다. 예측이 얼마나 잘못되었는지를 깨달았을 때 (손실), 전략(네트워크 가중치)을 조정하여 미래의 결정을 개선합니다. 피드백을 바탕으로 자신의 접근 방식을 미세 조정하여 다음에 더 나은 결과를 얻는 것과 비슷합니다.

이 아키텍처를 사용하여 에이전트는 정책을 반복적으로 개선합니다. 시간이 지남에 따라 누적 보상을 극대화하는 조치를 취하는 것을 배웁니다. 신경망, 경험 재생 및 타겟 네트워크의 결합으로 DQN은 복잡한 고차원 환경에서 효과적으로 학습할 수 있습니다. 이 과정은 에이전트가 환경을 탐색하는 데 능숙해질 때까지 계속됩니다.

# 4: 처음부터 Deep Q-Network 구현

이 섹션에서는 처음부터 Deep Q-Network (DQN)의 구현을 안내합니다. 이 섹션의 끝에는 Python에서 DQN을 구축하고 훈련하는 방법을 명확히 이해하게 될 것입니다.

<div class="content-ad"></div>

우리는 OpenAI Gym의 Lunar Lander 환경을 사용할 것입니다. 이 환경에서의 목표는 달 착륙선을 조종하여 지정된 착륙 패드에 성공적으로 착륙하는 것입니다. 착륙선은 환경을 통해 비행할 때 추진기를 사용하여 움직임과 방향을 조절해야 합니다. 이 환경은 상업적으로 사용할 수 있습니다. 라이센스 및 사용 권한에 대한 자세한 내용은 OpenAI Gym GitHub 페이지에서 확인할 수 있습니다.

오늘 다룰 모든 코드는 여기에서 찾을 수 있습니다:

## 4.1: 환경 설정

우리는 OpenAI Gym의 LunarLander 환경을 사용할 것이며, 이는 우리의 에이전트가 해결해야 할 어려운 문제를 제공합니다.

<div class="content-ad"></div>

```js
import os
import pickle
import gym
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random
import optuna
```

여기서 필요한 라이브러리들을 import 합니다. gym은 환경을 위해 사용되며, torch는 우리의 신경망을 구축하고 훈련하는 데 사용되며, collections, random, 및 optuna는 경험 재생과 하이퍼파라미터 최적화에 도움이 됩니다.

```js
env = gym.make("LunarLander-v2", (render_mode = "rgb_array"));
state_dim = env.observation_space.shape[0];
action_dim = env.action_space.n;
```

우리는 LunarLander 환경을 초기화하고 상태 및 액션 공간의 차원을 가져옵니다. state_dim은 상태의 특징 수를 나타내고, action_dim은 가능한 액션 수를 나타냅니다.

<div class="content-ad"></div>

## 4.2: 딥 신경망 구축

우리의 딥-NN에서는 DQN이라는 클래스를 생성할 것입니다. 이 클래스는 세 개의 완전 연결 계층을 가진 신경망을 정의합니다. 입력 계층은 상태 표현을 수신하며, 은닉 계층은 이 정보를 선형 변환과 ReLU 활성화 함수를 통해 처리하고, 출력 계층은 각 가능한 동작에 대한 Q-값을 생성합니다.

먼저 코드를 확인한 다음 분석해 봅시다:

```js
class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_dim, 128)
        self.fc2 = nn.Linear(128, 128)
        self.fc3 = nn.Linear(128, action_dim)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)
```

<div class="content-ad"></div>

4.2.1: 클래스 초기화

```python
class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_dim, 128)
        self.fc2 = nn.Linear(128, 128)
        self.fc3 = nn.Linear(128, action_dim)
```

우리는 DQN이라는 클래스를 정의했습니다. 이 클래스는 PyTorch의 모든 신경망 모듈에 사용되는 기본 클래스인 nn.Module을 상속받습니다. 이를 통해 우리는 PyTorch의 내장 함수와 기능을 활용할 수 있습니다.

**init** 메서드는 객체의 속성을 초기화하는 특별한 메서드입니다. 우리의 경우에는 신경망의 레이어를 설정하게 됩니다. 완전 연결층 (Fully Connected Layers):

<div class="content-ad"></div>

우리는 세 개의 완전 연결 (선형) 레이어를 정의합니다:

- self.fc1 = nn.Linear(state_dim, 128): 첫 번째 레이어는 입력 상태 차원 (상태의 피쳐 수)을 받아서 128개의 뉴런으로 매핑합니다.
- self.fc2 = nn.Linear(128, 128): 두 번째 레이어는 첫 번째 레이어에서 나온 128개의 뉴런을 또 다른 128개의 뉴런으로 매핑합니다.
- self.fc3 = nn.Linear(128, action_dim): 세 번째 레이어는 두 번째 레이어에서 나온 128개의 뉴런을 액션 차원 (가능한 액션 수)으로 매핑합니다.

각 nn.Linear 레이어는 입력 데이터에 대해 선형 변환을 수행합니다:

![이미지](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_10.png)

<div class="content-ad"></div>

4.2.2: Forward Method
앞서 명시된 forward 메소드는 데이터가 네트워크를 통해 흐르는 방법을 정의합니다. 이 방법은 네트워크를 통해 데이터를 전달할 때 자동으로 호출됩니다.

```python
def forward(self, x):
    x = torch.relu(self.fc1(x))
    x = torch.relu(self.fc2(x))
    return self.fc3(x)
```

첫 번째 layer에서 입력 데이터 x는 첫 번째 fully connected layer (self.fc1)를 통해 전달됩니다. 그런 다음 출력은 ReLU (Rectified Linear Unit) 활성화 함수를 사용하여 변환됩니다:

<div class="content-ad"></div>

```js
x = torch.relu(self.fc1(x));
```

ReLU(Recified Linear Unit) 활성화 함수는 다음과 같이 정의됩니다:

![ReLU activation function](/assets/img/2024-05-27-ReinforcementLearningDeepQ-Networks_11.png)

모델에 비선형성을 도입하여 네트워크가 더 복잡한 기능을 학습할 수 있게합니다.

<div class="content-ad"></div>

두 번째 레이어에서는 첫 번째 레이어의 출력이 두 번째 완전 연결 레이어 (self.fc2)를 통과하고 다시 ReLU 활성화 함수를 사용하여 변환됩니다:

```js
x = torch.relu(self.fc2(x));
```

마지막으로 출력 레이어에서는 두 번째 레이어의 출력이 활성화 함수 없이 세 번째 완전 연결 레이어 (self.fc3)를 통해 전달됩니다:

```js
return self.fc3(x);
```

<div class="content-ad"></div>

이 레이어는 각 액션에 대한 최종 Q-값을 생성합니다. 각 값은 해당 상태에서 그 액션을 취했을 때의 예상 미래 보상을 나타냅니다.

## 4.3: 경험 재생 구현

ReplayBuffer 클래스는 경험을 저장하고 샘플링하는 메커니즘을 제공하여 DQN에서 학습 과정을 안정화하고 개선하는 데 필수적입니다. 따라서 에이전트가 다양한 과거 경험 세트로부터 학습할 수 있도록 해주어 일반화하고 복잡한 환경에서 잘 수행할 수 있는 능력을 향상시킵니다.

```js
class ReplayBuffer:
    def __init__(self, capacity):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size):
        state, action, reward, next_state, done = zip(*random.sample(self.buffer, batch_size))
        return state, action, reward, next_state, done

    def __len__(self):
        return len(self.buffer)
```

<div class="content-ad"></div>

4.3.1: 클래스 초기화

```js
class ReplayBuffer:
    def __init__(self, capacity):
        self.buffer = deque(maxlen=capacity)
```

**init** 메서드는 고정된 용량을 갖는 deque(덱, 이중 연결 리스트)를 초기화합니다. 덱은 양쪽 끝에서 효율적으로 항목을 추가하고 제거할 수 있는 자료 구조입니다. 빠른 양쪽 끝에서의 추가와 제거가 필요한 큐(queue)나 스택(stack)을 구현할 때 유용합니다.

self.buffer = deque(maxlen=capacity)는 capacity만큼의 경험을 저장할 수 있는 deque를 생성합니다. 버퍼가 가득 차면 새로운 경험을 추가하면 가장 오래된 경험이 자동으로 제거됩니다.

<div class="content-ad"></div>

4.3.2: Push Method

```python
def push(self, state, action, reward, next_state, done):
    self.buffer.append((state, action, reward, next_state, done))
```

푸시 메서드는 버퍼에 새로운 경험을 추가합니다. 각 경험은 상태(state), 액션(action), 보상(reward), 다음 상태(next_state), 완료 여부(done)로 구성된 튜플입니다:

- state: 현재 상태.
- action: 에이전트가 취한 행동.
- reward: 행동을 취한 후 받은 보상.
- next_state: 행동을 취한 후 에이전트가 이동한 상태.
- done: 에피소드가 종료되었는지를 나타내는 부울 값.

<div class="content-ad"></div>

4.3.3: 샘플 메서드

```python
def sample(self, batch_size):
    state, action, reward, next_state, done = zip(*random.sample(self.buffer, batch_size))
    return state, action, reward, next_state, done
```

샘플 메서드는 버퍼에서 무작위로 일괄 경험을 검색합니다.

random.sample(self.buffer, batch_size)는 버퍼에서 batch_size개의 경험을 무작위로 선택합니다.

<div class="content-ad"></div>

"zip(\*random.sample(self.buffer, batch_size))"은 경험 목록을 상태, 행동, 보상, 다음 상태 및 완료에 대한 별도의 튜플로 풀어낼 수 있습니다.

이 메서드는 샘플된 경험들로 이러한 튜플을 반환합니다.

4.3.4: Length Method

```python
def __len__(self):
    return len(self.buffer)
```

<div class="content-ad"></div>

**len** 메서드는 버퍼에 저장된 현재 경험 수를 반환합니다.

## 4.4: 타겟 네트워크 구현

타겟 네트워크를 통해 안정적인 Q 값 세트를 제공하여 훈련을 위해 학습 프로세스를 안정화하고 복잡한 환경에서 에이전트의 성능을 향상시킵니다. 타겟 네트워크는 주 네트워크보다 덜 자주 업데이트되어 메인 네트워크의 가중치를 업데이트하는 데 사용되는 Q 값 추정치가 더 안정적임을 보장합니다.

DQNTrainer라는 클래스 내에 타겟 네트워크를 구현할 것이며, 이 클래스는 DQN의 훈련 프로세스를 관리하고 주 및 타겟 네트워크, 옵티마이저 및 재생 버퍼를 포함합니다.

<div class="content-ad"></div>

```js
class DQNTrainer:
    def __init__(self, env, main_network, target_network, optimizer, replay_buffer, model_path='model/model.pth', gamma=0.99, batch_size=64, target_update_frequency=1000):
        self.env = env
        self.main_network = main_network
        self.target_network = target_network
        self.optimizer = optimizer
        self.replay_buffer = replay_buffer
        self.model_path = model_path
        self.gamma = gamma
        self.batch_size = batch_size
        self.target_update_frequency = target_update_frequency
        self.step_count = 0
```

- DQNTrainer 클래스 정의:

<div class="content-ad"></div>

**init** 메서드는 학습에 필요한 다양한 구성 요소를 초기화합니다:

- env: 에이전트가 작동하는 환경입니다.
- main_network: 훈련 중인 주요 신경망입니다.
- target_network: Q-값 추정을 안정화하는 데 사용되는 대상 신경망입니다.
- optimizer: 주요 신경망의 가중치를 업데이트하는 데 사용되는 옵티마이저입니다.
- replay_buffer: 경험을 저장하고 샘플링하는 버퍼입니다.
- model_path: 훈련된 모델을 저장하고 로드하기 위한 경로입니다.
- gamma: 미래 보상에 대한 할인 계수입니다.
- batch_size: 각 훈련 단계에서 재생 버퍼에서 샘플링된 경험의 수입니다.
- target_update_frequency: 대상 네트워크의 가중치를 주요 네트워크의 가중치에 맞게 업데이트하는 빈도입니다.
- step_count: 훈련 중에 취한 단계 수를 추적하는 카운터입니다.

  4.4.2: 모델 로딩

```js
# 모델이 있으면 로드
        if os.path.exists(os.path.dirname(self.model_path)):
            if os.path.isfile(self.model_path):
                self.main_network.load_state_dict(torch.load(self.model_path))
                self.target_network.load_state_dict(torch.load(self.model_path))
                print("디스크에서 모델 로드됨")
        else:
            os.makedirs(os.path.dirname(self.model_path))
```

<div class="content-ad"></div>

우리는 모델 경로의 디렉토리가 존재하는지 os.path.exists(os.path.dirname(self.model_path))를 사용하여 확인합니다. 저장된 모델이 있으면, 훈련을 멈춘 지점부터 계속하기 위해 불러옵니다:

```js
if os.path.isfile(self.model_path):
    self.main_network.load_state_dict(torch.load(self.model_path))
    self.target_network.load_state_dict(torch.load(self.model_path))
    print("디스크에서 모델을 불러왔습니다")
```

torch.load는 load_state_dict를 사용하여 저장된 모델 가중치를 메인 및 타겟 네트워크에 불러옵니다. 모델 디렉토리가 존재하지 않는 경우, os.makedirs를 사용하여 만듭니다.

## 4.5: 딥 Q-네트워크 훈련

<div class="content-ad"></div>

다음으로, 우리는 DQN을 훈련하기 위한 학습 루프를 구현할 것입니다. 이 방법은 DQNTrainer 내에 이루어집니다. DQN을 위한 훈련 루프를 실행하며, 에이전트가 환경과 상호 작용하고 경험을 수집하며 네트워크를 업데이트하고 성능을 추적합니다.

다음은 학습 루프의 코드입니다:

```js
def train(self, num_episodes, save=True):
    total_rewards = []
    for episode in range(num_episodes):
        state, _ = self.env.reset()
        done = False
        total_reward = 0

        while not done:
            self.env.render()  # 환경을 렌더링하기 위해 이 줄을 추가합니다
            action = self.main_network(torch.FloatTensor(state).unsqueeze(0)).argmax(dim=1).item()
            next_state, reward, done, _, _ = self.env.step(action)
            self.replay_buffer.push(state, action, reward, next_state, done)
            state = next_state
            total_reward += reward

            if len(self.replay_buffer) >= self.batch_size:
                self.update_network()

        total_rewards.append(total_reward)
        print(f"Episode {episode}, Total Reward: {total_reward}")

    if save:
        torch.save(self.main_network.state_dict(), self.model_path)
        print("모델을 디스크에 저장했습니다")

    self.env.close()
    return sum(total_rewards) / len(total_rewards)
```

train 메서드는 지정된 에피소드 수에 대해 훈련 루프를 실행합니다. 이 루프는 에이전트가 경험을 쌓고 의사 결정 능력을 향상시키는 데 중요합니다.

<div class="content-ad"></div>

4.5.1: 훈련 루프
우선 total_rewards를 빈 리스트로 초기화해 봅시다:

```js
total_rewards = [];
```

이제 훈련 루프를 만들어 봅시다:

```js
for episode in range(num_episodes):
```

<div class="content-ad"></div>

이 루프는 지정된 에피소드 수만큼 실행됩니다. 각 에피소드는 환경과의 완전한 상호작용 순서를 나타냅니다.

4.5.2: 환경 재설정
각 에피소드의 시작 시점에는 환경이 초기 상태로 재설정됩니다.

```js
state, (_ = self.env.reset());
done = False;
total_reward = 0;
```

- self.env.reset()은 환경을 초기화하고 초기 상태를 반환합니다.
- done = False는 에피소드가 완료되지 않았음을 나타냅니다.
- total_reward = 0은 현재 에피소드의 총 보상을 초기화합니다.

<div class="content-ad"></div>

### 4.4.3: Action Selection

에이전트는 현재 상태를 기반으로 메인 네트워크를 사용하여 작업을 선택합니다.

```python
action = self.main_network(torch.FloatTensor(state).unsqueeze(0)).argmax(dim=1).item()
```

torch.FloatTensor(state).unsqueeze(0)은 상태를 PyTorch 텐서로 변환하고 네트워크가 예상하는 입력 형태와 일치하도록 추가 차원을 추가합니다.

self.main_network(...).argmax(dim=1).item()는 메인 네트워크가 예측한 가장 높은 Q 값으로 작업을 선택합니다.

<div class="content-ad"></div>

4.5.4: 단계 및 저장 환경
에이전트가 선택한 동작을 수행하고 보상 및 다음 상태를 관찰한 후, 해당 경험을 재생 버퍼에 저장합니다.

```js
next_state, reward, done, _, (_ = self.env.step(action));
self.replay_buffer.push(state, action, reward, next_state, done);
state = next_state;
total_reward += reward;
```

- self.env.step(action)은 동작을 실행하고 다음 상태, 보상 및 에피소드 완료 여부를 반환합니다.
- self.replay_buffer.push(...)는 재생 버퍼에 경험을 저장합니다.
- state = next_state는 현재 상태를 다음 상태로 업데이트합니다.
- total_reward += reward은 현재 에피소드의 보상을 누적합니다.

  4.5.5: 네트워크 업데이트
  재생 버퍼에 충분한 경험이 있을 경우, 네트워크가 업데이트됩니다.

<div class="content-ad"></div>

```js
if len(self.replay_buffer) >= self.batch_size:
    self.update_network()
```

`if len(self.replay_buffer) >= self.batch_size`은 replay buffer가 적어도 batch_size의 경험을 가지고 있는지 확인합니다.

self.update_network()은 replay buffer에서 일괄적인 경험을 사용하여 네트워크를 업데이트합니다.

4.5.6: 에피소드 종료
총 보상은 각 에피소드의 끝에서 기록되고 출력됩니다.

<div class="content-ad"></div>

```js
total_rewards.append(total_reward)
print(f"에피소드 {episode}, 총 보상: {total_reward}")
```

total_rewards.append(total_reward)는 현재 에피소드의 총 보상을 총 보상 목록에 추가합니다.

print(f"에피소드 {episode}, 총 보상: {total_reward}")은 에피소드 번호와 총 보상을 출력합니다.

4.5.7: 모델 저장
훈련 후, 모델은 디스크에 저장됩니다.

<div class="content-ad"></div>

```js
save가 True이면:
   torch.save(self.main_network.state_dict(), self.model_path)
   print("모델이 디스크에 저장되었습니다.")
```

if save:는 save 플래그가 True인지 확인합니다.

torch.save(self.main_network.state_dict(), self.model_path)는 메인 네트워크의 상태 딕셔너리를 지정된 파일 경로에 저장합니다.

4.5.8: 평균 보상 반환
마지막으로, 이 메서드는 환경을 닫고 모든 에피소드에 대한 평균 보상을 반환합니다.

<div class="content-ad"></div>

```js
self.env.close();
return sum(total_rewards) / len(total_rewards);
```

self.env.close()는 환경을 닫습니다.

return sum(total_rewards) / len(total_rewards)는 평균 보상을 계산하고 반환합니다.

## 4.6: 모델 튜닝

<div class="content-ad"></div>

마침내 훈련된 모델을 평가하고 튜닝하는 방법을 살펴보겠습니다. DQN의 성능을 향상시키기 위해 하이퍼파라미터를 최적화할 책임을 가질 Optimizer 클래스를 만들어보겠습니다.

```js
class Optimizer:
    def __init__(self, env, main_network, target_network, replay_buffer, model_path, params_path='params.pkl'):
        self.env = env
        self.main_network = main_network
        self.target_network = target_network
        self.replay_buffer = replay_buffer
        self.model_path = model_path
        self.params_path = params_path

    def objective(self, trial, n_episodes=10):
        lr = trial.suggest_loguniform('lr', 1e-5, 1e-1)
        gamma = trial.suggest_uniform('gamma', 0.9, 0.999)
        batch_size = trial.suggest_categorical('batch_size', [32, 64, 128])
        target_update_frequency = trial.suggest_categorical('target_update_frequency', [500, 1000, 2000])

        optimizer = optim.Adam(self.main_network.parameters(), lr=lr)
        trainer = DQNTrainer(self.env, self.main_network, self.target_network, optimizer, self.replay_buffer, self.model_path, gamma=gamma, batch_size=batch_size, target_update_frequency=target_update_frequency)
        reward = trainer.train(n_episodes, save=False)
        return reward

    def optimize(self, n_trials=100, save_params=True):
        if not TRAIN and os.path.isfile(self.params_path):
            with open(self.params_path, 'rb') as f:
                best_params = pickle.load(f)
            print("디스크에서 매개변수를 불러왔습니다")
        elif not FINETUNE:
            best_params = {
                'lr': LEARNING_RATE,
                'gamma': GAMMA,
                'batch_size': BATCH_SIZE,
                'target_update_frequency': TARGET_UPDATE_FREQUENCY
                }
            print(f"기본 매개변수 사용 중: {best_params}")
        else:
            print("하이퍼파라미터 최적화 중")
            study = optuna.create_study(direction='maximize')
            study.optimize(self.objective, n_trials=n_trials)
            best_params = study.best_params

            if save_params:
                with open(self.params_path, 'wb') as f:
                    pickle.dump(best_params, f)
                print("매개변수를 디스크에 저장했습니다")

        return best_params
```

4.6.1: 클래스 정의

```js
class Optimizer:
    def __init__(self, env, main_network, target_network, replay_buffer, model_path, params_path='params.pkl'):
        self.env = env
        self.main_network = main_network
        self.target_network = target_network
        self.replay_buffer = replay_buffer
        self.model_path = model_path
        self.params_path = params_path
```

<div class="content-ad"></div>

**init** 메서드는 최적화에 필요한 다양한 구성 요소를 초기화합니다:

- env: 에이전트가 작동하는 환경.
- main_network: 주요 신경망.
- target_network: 타겟 신경망.
- replay_buffer: 경험을 저장하고 샘플링하는 버퍼.
- model_path: 훈련된 모델을 저장하거나 불러오는 경로.
- params_path: 최적의 하이퍼파라미터를 저장하거나 불러오는 경로.

  4.6.2: 목적 메서드

```js
def objective(self, trial, n_episodes=10):
        lr = trial.suggest_loguniform('lr', 1e-5, 1e-1)
        gamma = trial.suggest_uniform('gamma', 0.9, 0.999)
        batch_size = trial.suggest_categorical('batch_size', [32, 64, 128])
        target_update_frequency = trial.suggest_categorical('target_update_frequency', [500, 1000, 2000])

        optimizer = optim.Adam(self.main_network.parameters(), lr=lr)
        trainer = DQNTrainer(self.env, self.main_network, self.target_network, optimizer, self.replay_buffer, self.model_path, gamma=gamma, batch_size=batch_size, target_update_frequency=target_update_frequency)
        reward = trainer.train(n_episodes, save=False)
        return reward
```

<div class="content-ad"></div>

목표 함수는 하이퍼파라미터에 대한 값을 제안하고 이러한 값을 사용하여 모델을 훈련합니다.

- lr = trial.suggest_loguniform(`lr`, 1e-5, 1e-1): 범위 [1e-5, 1e-1] 내의 학습률을 제안합니다.
- gamma = trial.suggest_uniform(`gamma`, 0.9, 0.999): 범위 [0.9, 0.999] 내의 할인 요인을 제안합니다.
- batch_size = trial.suggest_categorical(`batch_size`, [32, 64, 128]): 지정된 목록에서 배치 크기를 제안합니다.
- target_update_frequency = trial.suggest_categorical(`target_update_frequency`, [500, 1000, 2000]): 지정된 목록에서 대상 업데이트 빈도를 제안합니다.

```js
optimizer = optim.Adam(self.main_network.parameters(), (lr = lr));
```

여기서는 주어진 학습률로 Adam 옵티마이저를 설정합니다. Adam은 주로 신경망 훈련에 사용되는 최적화 알고리즘인 Adaptive Moment Estimation의 약자입니다.

<div class="content-ad"></div>

신경망에서 각 매개변수에 대해 Adam은 손실 함수의 기울기를 계산합니다. 그것은 기울기의 지수 이동 평균 (첫 번째 모멘트로 표시되는 m)과 제곱 기울기 (두 번째 모멘트로 표시되는 v)를 추적합니다.

이동 평균의 초기화 편향을 고려하기 위해 Adam은 첫 번째 및 두 번째 모멘트 추정치에 바이어스 보정을 적용합니다. 그런 다음 매개변수는 수정된 첫 번째 및 두 번째 모멘트를 사용하여 업데이트됩니다. 업데이트 규칙은 학습률과 모멘트를 통합하여 기울기의 크기와 방향을 모두 고려하는 방식으로 매개변수를 조정합니다.

다음은 Adam에 대한 보다 포괄적인 기사입니다:

```js
trainer = DQNTrainer(
  self.env,
  self.main_network,
  self.target_network,
  optimizer,
  self.replay_buffer,
  self.model_path,
  (gamma = gamma),
  (batch_size = batch_size),
  (target_update_frequency = target_update_frequency)
);
```

<div class="content-ad"></div>

이 코드는 제안된 하이퍼파라미터로 theDQNTrainer 인스턴스를 초기화합니다.

```js
reward = trainer.train(n_episodes, (save = False));
```

마지막으로, 이 코드는 지정된 에피소드 수로 모델을 학습하고 평균 보상을 반환합니다.

4.6.3: 최적화 메소드
이 섹션에서는 모델의 성능을 극대화하는 조합을 효율적으로 찾을 수 있도록 하이퍼파라미터 공간을 체계적으로 탐색하는 파이썬 라이브러리인 Optuna를 사용하겠습니다.

<div class="content-ad"></div>

```python
def optimize(self, n_trials=100, save_params=True):
    if not TRAIN and os.path.isfile(self.params_path):
        with open(self.params_path, 'rb') as f:
            best_params = pickle.load(f)
        print("디스크에서 매개변수를 불러왔습니다.")
    elif not FINETUNE:
        best_params = {
            'lr': LEARNING_RATE,
            'gamma': GAMMA,
            'batch_size': BATCH_SIZE,
            'target_update_frequency': TARGET_UPDATE_FREQUENCY
        }
        print(f"기본 매개변수를 사용합니다: {best_params}")
    else:
        print("하이퍼파라미터를 최적화 중입니다.")
        study = optuna.create_study(direction='maximize')
        study.optimize(self.objective, n_trials=n_trials)
        best_params = study.best_params

        if save_params:
            with open(self.params_path, 'wb') as f:
                pickle.dump(best_params, f)
            print("매개변수를 디스크에 저장했습니다.")

    return best_params
```

`optimize` 메소드는 지정된 횟수의 시도에 대해 최적화 프로세스를 실행합니다.

```python
if not TRAIN and os.path.isfile(self.params_path):
        with open(self.params_path, 'rb') as f:
            best_params = pickle.load(f)
        print("디스크에서 매개변수를 불러왔습니다.")
```

학습이 필요하지 않은 경우 (TRAIN이 아닌 경우) 및 매개변수 파일이 존재하는 경우, 매개변수가 디스크에서 로드됩니다.

<div class="content-ad"></div>

```python
elif not FINETUNE:
    best_params = {
        'lr': LEARNING_RATE,
        'gamma': GAMMA,
        'batch_size': BATCH_SIZE,
        'target_update_frequency': TARGET_UPDATE_FREQUENCY
    }
    print(f"기본 매개변수 사용 중: {best_params}")
```

만약 파라미터 튜닝이 필요하지 않다면 (not FINETUNE), 기본 매개변수가 사용됩니다.

```python
else:
    print("하이퍼파라미터 최적화 중")
    study = optuna.create_study(direction='maximize')
    study.optimize(self.objective, n_trials=n_trials)
    best_params = study.best_params

    if save_params:
        with open(self.params_path, 'wb') as f:
            pickle.dump(best_params, f)
        print("매개변수를 디스크에 저장했습니다")
```

하이퍼파라미터 최적화가 필요한 경우, Optuna를 사용하여 최적의 매개변수를 찾습니다.

<div class="content-ad"></div>

study = optuna.create_study(direction='maximize')을 사용하면 목적 함수를 최대화하는 Optuna 스터디를 생성할 수 있어요.

study.optimize(self.objective, n_trials=n_trials)은 지정된 횟수의 시행을 위한 최적화를 실행해요.

save_params를 True로 설정하면, 최적의 매개변수가 디스크에 저장돼요.

다음은 Optuna를 깊이 들여다보는 포함한 다양한 세밀 조정 기법을 탐구한 멋진 기사에요:

<div class="content-ad"></div>

## 4.7: 모델 실행하기

마지막으로, 모든 과정을 다시 한번 확인하고 코드를 실행해 봅시다!

4.7.1: 훈련 및 파인튜닝 설정

```js
TRAIN = True
FINETUNE = False

# 다음 하이퍼파라미터를 설정하세요 (FINETUNE이 False인 경우)
GAMMA = 0.99
BATCH_SIZE = 64
TARGET_UPDATE_FREQUENCY = 1000
LEARNING_RATE = 1e-3
```

<div class="content-ad"></div>

TRAIN = True은 모델을 학습할지 여부를 나타냅니다. False로 설정하면 학습이 건너뛰어집니다.

FINETUNE = False는 모델을 fine-tune할지 여부를 나타냅니다. True로 설정하면 기존 매개변수가 사용되고 fine-tune됩니다.

만약 FINETUNE이 False인 경우, 다음 하이퍼파라미터를 설정합니다:

- GAMMA = 0.99: 미래 보상에 대한 할인 계수입니다. 이는 즉시 보상에 비해 미래 보상이 얼마나 중요한지를 결정합니다.
- BATCH_SIZE = 64: 각 학습 단계마다 재생 버퍼에서 샘플링된 경험의 수입니다.
- TARGET_UPDATE_FREQUENCY = 1000: 타겟 네트워크의 가중치가 주요 네트워크의 가중치와 일치하도록 업데이트되는 빈도(스텝 단위).
- LEARNING_RATE = 1e-3: 최적화기(optimizer)의 학습률로, 모델 가중치가 업데이트될 때 추정 오차에 따라 모델을 얼마나 변경할지를 제어합니다.

<div class="content-ad"></div>

4.7.2: 네트워크 및 재생 버퍼 초기화

```js
main_network = DQN(state_dim, action_dim);
target_network = DQN(state_dim, action_dim);
target_network.load_state_dict(main_network.state_dict());
target_network.eval();

replay_buffer = ReplayBuffer(10000);
```

main_network = DQN(state_dim, action_dim)은 지정된 상태 및 액션 차원으로 메인 네트워크를 초기화합니다.

target_network = DQN(state_dim, action_dim)은 메인 네트워크와 동일한 구조로 대상 네트워크를 초기화합니다.

<div class="content-ad"></div>


target_network.load_state_dict(main_network.state_dict()) 함수는 메인 네트워크의 가중치를 타겼 네트워크로 복사합니다.

target_network.eval() 함수는 타겟 네트워크를 평가 모드로 설정합니다. 이는 추론 중에 드롭아웃과 배치 정규화와 같은 특정 레이어가 적절하게 동작하도록 합니다.

replay_buffer = ReplayBuffer(10000)은 10,000개의 경험을 저장할 수 있는 용량을 가진 리플레이 버퍼를 초기화합니다.

4.7.3: 단계 카운트 설정


<div class="content-ad"></div>

```js
STEP_COUNT = 0;
```

STEP_COUNT = 0은 훈련 중 취한 단계 수를 추적하는 카운터를 초기화합니다.

4.7.4: 옵티마이저 초기화 및 하이퍼파라미터 최적화

```js
optimizer = Optimizer(env, main_network, target_network, replay_buffer, f'{os.path.dirname(__file__)}/model/model.pth', f'{os.path.dirname(__file__)}/model/params.pkl')
best_params = optimizer.optimize(n_trials=2, save_params=True)
```

<div class="content-ad"></div>

`optimizer = Optimizer(...)`은 환경, 네트워크, 리플레이 버퍼, 모델 경로 및 매개변수 경로로 Optimizer 클래스를 초기화합니다.

`best_params = optimizer.optimize(n_trials=2, save_params=True)`는 최적의 하이퍼파라미터를 찾기 위해 최적화 프로세스를 실행합니다. 이 함수는 다음과 같은 기능을 수행합니다:

- 지정된 횟수(n_trials=2)만큼 최적화를 실행합니다.
- `save_params`가 True인 경우 최적의 하이퍼파라미터를 디스크에 저장합니다.

  4.7.5: PyTorch Optimizer 및 DQN Trainer 생성

<div class="content-ad"></div>

```js
optimizer = optim.Adam(main_network.parameters(), lr=best_params['lr'])
trainer = DQNTrainer(env, main_network, target_network, optimizer, replay_buffer, f'{os.path.dirname(__file__)}/model/model.pth', gamma=best_params['gamma'], batch_size=best_params['batch_size'], target_update_frequency=best_params['target_update_frequency'])
trainer.train(1000)
```

`optimizer = optim.Adam(main_network.parameters(), lr=best_params['lr'])`은 최적의 하이퍼파라미터에서 학습률을 사용하여 Adam 옵티마이저를 생성합니다.

`trainer = DQNTrainer(...)`는 환경, 네트워크, 옵티마이저, 리플레이 버퍼, 모델 경로 및 최적의 하이퍼파라미터로 DQNTrainer 클래스를 초기화합니다.

`trainer.train(1000)`은 모델을 1000번의 에피소드 동안 훈련합니다.

<div class="content-ad"></div>

이제 요정의 훈련 초기 10 에피소드를 살펴보겠습니다:

![agent training](https://miro.medium.com/v2/resize:fit:1200/1*ncnLXIRABedg4uKwVL0L5w.gif)

여기서 모델은 서툴러서 무작위로 종종 비최적적인 결정을 내립니다. 요정이 환경을 탐험하고 기초를 배우기 때문에 이는 예상되는 현상입니다. 아직 보상을 극대화하기 위한 견고한 전략을 개발하지 못했습니다. 추가적인 훈련 에피소드를 거치면서 시간이 지남에 따라, 요정의 성능은 정책을 미세 조정하고 경험을 통해 배우면서 크게 향상되어야 합니다.

이제 모델이 1000번 훈련된 후의 10개의 훈련 에피소드를 살펴봅시다:

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1200/1*s4j6V4V-nLfkc18C2Z2-zA.gif)

이것은 주목할 만한 개선입니다. 모델이 아직 NASA에 완성되지는 않았지만, 몇 가지 주요 향상 사항을 관찰할 수 있습니다:

- 에이전트가 더 신중하고 전략적인 결정을 내립니다.
- 환경을 더 효율적으로 탐색합니다.
- 부적절한 조치의 빈도가 크게 감소했습니다.

지속적인 훈련과 세밀한 조정을 통해, 에이전트의 성능은 더 개선될 것으로 예상되며, 최적의 행동에 더 가까워질 것입니다.


<div class="content-ad"></div>

이제 여러분의 차례입니다. 모델을 더 발전시켜 보세요. 하이퍼파라미터를 조정하거나 다른 모델 구조를 실험해 보세요. 창의성과 인내심으로 최선을 다하면 얼마든지 성과를 낼 수 있을 거에요. 곧 완벽하게 패치된 셔틀은 원활하게 착륙할 거예요!

# 5: 결론

딥 Q-네트워크를 구축, 훈련 및 평가하는 방법을 잘 이해하셨으니, 이제 다양한 환경에서 이 DQN을 테스트하고 다양한 도전에 적응하는 모습을 관찰해 보세요.

에이전트의 성능을 향상시키기 위해 고급 기술을 구현하고 새로운 아키텍처를 탐험해 보세요. 예를 들어 다양한 하이퍼파라미터를 설정해보거나 다른 최적화 알고리즘(예: SGD 또는 Nadam)을 사용하거나 다른 미세조정 알고리즘을 사용해 볼 수 있어요!

<div class="content-ad"></div>

# 참고 자료

- Sutton, R. S., & Barto, A. G. (2018). Reinforcement Learning: An Introduction. MIT Press.
- Lin, L. J. (1992). “Self-improving reactive agents based on reinforcement learning, planning and teaching.” Machine Learning, 8(3–4), 293–321.
- OpenAI. “LunarLander-v2.” OpenAI Gym. [링크](https://gym.openai.com/envs/LunarLander-v2/)
- 버클리 AI 연구소 (BAIR). “Experience Replay.” [링크](https://bair.berkeley.edu/blog/2020/03/20/experiencereplay/)
- Towards Data Science. “Reinforcement Learning 101: Q-Learning.” [링크](https://towardsdatascience.com/reinforcement-learning-101-e24b50e1d292)
- Towards Data Science. “신경망 뒤의 수학.” [링크](https://towardsdatascience.com/the-math-behind-neural-networks-3a18b7f8d8dc)
- Towards Data Science. “Adam Optimizer 뒤의 수학.” [링크](https://towardsdatascience.com/the-math-behind-adam-optimizer-3a18b7f8d8dc)
- Towards Data Science. “Deep Neural Networks 맞춤화 뒤의 수학.” [링크](https://towardsdatascience.com/the-math-behind-fine-tuning-deep-neural-networks-3a18b7f8d8dc)

마지막까지 읽어 주셔서 축하드립니다! 이 기사가 유익하고 즐거우셨기를 바랍니다. 만약 그렇다면, 박수를 남기고 더 많은 이런 기사를 보고 싶다면 저를 팔로우해 주세요. 앞으로 다루었으면 하는 주제나 기사에 대한 의견을 들을 수 있습니다. 피드백과 지원에 감사드립니다. 읽어 주셔서 감사합니다!
