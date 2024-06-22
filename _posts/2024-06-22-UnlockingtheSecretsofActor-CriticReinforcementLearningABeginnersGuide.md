---
title: "강화 학습의 비밀을 풀다 Actor-Critic 초보자 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_0.png"
date: 2024-06-22 19:43
ogImage: 
  url: /assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_0.png
tag: Tech
originalTitle: "Unlocking the Secrets of Actor-Critic Reinforcement Learning: A Beginner’s Guide"
link: "https://medium.com/@arshren/unlocking-the-secrets-of-actor-critic-reinforcement-learning-a-beginners-guide-3c5953b13551"
---


## 이해해야 할 개념:

강화 학습: 시간 차 학습

강화 학습: Q-Learning

딥 Q 학습: 심층 강화 학습 알고리즘

<div class="content-ad"></div>

정책 그라디언트의 직관적인 설명

## Actor-Critic 알고리즘이란 무엇인가요?

Actor-Critic은 환경의 피드백에 기반하여 에이전트의 작업을 최적화하는 강화 학습 알고리즘입니다.

![이미지 설명](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_0.png)

<div class="content-ad"></div>

Actor: Actor는 환경을 탐색하여 최적 정책을 학습합니다.

Critic: Critic은 Actor가 취한 각 행동의 가치를 평가하여 그 행동이 더 나은 보상을 가져오는지를 판단하고, Actor에게 취해야 할 최선의 행동을 안내합니다.

그런 다음 Actor는 Critic의 피드백을 사용하여 정책을 조정하고 더 현명한 결정을 내려 전반적인 성능을 향상시킵니다.

![이미지](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_1.png)

<div class="content-ad"></div>

## Actor-Critic 알고리즘은 어떻게 작동하나요?

![Actor-Critic 알고리즘 이미지](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_2.png)

Actor-Critic 알고리즘은 환경으로부터 입력을 받아와 그 상태를 기반으로 최적의 행동을 결정합니다.

알고리즘의 Actor 구성 요소는 환경으로부터 현재 상태를 입력으로 받아옵니다. 이는 상태에 대한 각 행동의 확률을 출력하는 정책으로 동작하는 신경망을 사용합니다.

<div class="content-ad"></div>

비평가 네트워크는 현재 상태와 Actor의 출력된 액션을 입력으로 받아 이 정보를 사용하여 예상되는 미래 보상, 즉 Q-값을 추정합니다. Q-값은 특정 정책을 따라 특정 상태에서 에이전트가 받을 수 있는 예상 누적 보상을 나타냅니다.

반면에 가치 상태는 특정 상태에서 취한 조치와 관계없이 예상되는 미래 보상을 나타냅니다. 특정 상태에 대한 모든 가능한 조치에 대한 Q-값의 평균으로 계산됩니다.

## Adv. = Q(s,a) — V(s)

이점 함수는 Actor의 정책을 안내하는 데 유용한 정보를 제공하여 최상의 결과로 이끌어지는 행동을 결정하고 정책을 그에 맞게 조정할 수 있도록 합니다.

<div class="content-ad"></div>

결과적으로, 이점 함수는 Actor와 Critic 둘 다에게 역전파되어, 두 구성 요소 모두가 지속적으로 업데이트되고 개선되는 함수를 허용합니다. 이로 인해 액터는 더 나은 결과를 이끄는 결정을 내릴 때 더 효과적해지고, 전반적으로 성능이 향상됩니다. 궁극적으로, Actor-Critic 알고리즘은 기대되는 미래 보상을 최대화하는 최적의 정책을 배웁니다.

Actor-Critic 알고리즘은 A2C, ACER, A3C, TRPO, PPO와 같은 다른 알고리즘들의 기초로 삼아진 프레임워크입니다.

## 다양한 Actor-Critic 기반 강화 학습 알고리즘

- A2C- 어드밴티지 Actor Critic: 어드밴티지 Actor-Critic(A2C) 방법의 Critic은 𝑉(𝑠)를 예측하도록 훈련되어, 부트스트래핑을 위해 𝐴(𝑠,𝑎)=𝑄(𝑠,𝑎)−𝑉(𝑠)을 추정하는 데 사용됩니다. Actor는 정책을 업데이트하기 위한 가이던스 신호로 어드밴티지 함수를 사용하여 훈련됩니다.
- ACER- 경험 재생이 있는 Actor Critic: ACER는 경험 재생을 사용하는 효율적인 액터-크리틱 알고리즘으로, 신뢰 영역 정책 최적화 방법을 사용하여 성능을 향상시킵니다.
- A3C- 비동기 어드밴티지 Actor Critic: 액터-크리틱 알고리즘의 병렬, 비동기 멀티스레드 구현. 병렬로 여러 에이전트가 각자의 환경에서 훈련을 받아 동시에 상태 공간의 다른 부분을 탐색합니다. 에이전트들은 정책 그레디언트를 계산하고 주기적으로 글로벌 네트워크로 업데이트를 보내거나 종단상태에 도달했을 때 업데이트를 보냅니다. 글로벌 네트워크는 업데이트마다 새로운 가중치를 에이전트들에게 전파하여 공통 정책을 공유할 수 있도록 합니다.
- TRPO- 신뢰 영역 정책 최적화: Actor-크리틱 알고리즘과 신뢰 영역을 사용하여 정책 업데이트를 제약합니다. 정책 업데이트는 이전 정책과 업데이트된 정책 사이의 KL 발산을 사용하여 측정되며, 각 반복에서 신뢰 영역을 측정하는 데 사용됩니다.
- PPO- 근접 정책 최적화: 근접 정책 최적화(PPO)는 여러 번의 확률적 그래디언트 상승을 통해 각 정책 업데이트를 수행하는 액터-크리틱 알고리즘에 기반합니다. 각 훈련 에포크에서 너무 큰 정책 업데이트를 피해 정책의 변경을 제한하여 정책의 훈련 안정성을 향상시킵니다.

<div class="content-ad"></div>

## Actor-Critic 알고리즘은 어떤 응용 분야에서 사용되나요?

Actor-Critic 알고리즘은 다음과 같은 분야에서 널리 활용됩니다:

- 제조업이나 서비스 산업의 로봇을 위한 제어 시스템,
- 게임에서 게임 전략을 최적화하는 데 사용됨,
- 전력 그리드, 자율 주행 차량, 산업 프로세스와 같은 복잡 시스템.

## 코드 구현

<div class="content-ad"></div>

여기에서는 두 개의 신경망을 사용할 것입니다: Actor와 Critic.

![Actor-Critic](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_3.png)

각 에피소드 단계에서 Actor 네트워크를 사용하여 에이전트는 현재 상태에서 행동을 취하고 다음 상태로 이동하며 환경으로부터 보상을 받습니다. Actor의 신경망은 그 상태에서 각 가능한 행동을 취할 확률을 출력하는 정책으로 작동합니다.

보상과 다음 상태의 추정 가치를 사용하여 이득 함수를 계산하는데, 이는 행동을 취하는 것의 예상 반환값에서 현재 상태의 추정 가치를 뺀 것입니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_4.png)

액터 네트워크를 업데이트하면서 액터 손실을 계산합니다. 이는 취한 행동의 로그 확률의 음수에 이득을 곱한 값입니다.

![image](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_5.png)

![image](/assets/img/2024-06-22-UnlockingtheSecretsofActor-CriticReinforcementLearningABeginnersGuide_6.png)


<div class="content-ad"></div>

A2C는 빠르고 효율적이며 대량의 데이터에서 빠르게 효과적으로 학습할 수 있어요. Actor는 환경을 탐험하고 Critic은 Actor가 취할 수 있는 최상의 행동을 활용하기 위한 피드백을 제공하여 시간에 따라 최적 정책을 달성하려고 노력해요.

A2C는 연속된 행동 공간에서 잘 작동하지만 이산적인 행동 공간에서는 그렇지 않아요. 최적 성능에 대한 하이퍼파라미터에 민감하며 잘못된 하이퍼파라미터는 훈련을 불안정하게 만들 수 있어요.

## 결론:

Actor-Critic 알고리즘은 두 가지 구성 요소를 사용해요. Actor는 탐사를 통해 최적 정책을 학습하며 Critic은 Actor의 행동을 평가하여 상태에 대한 최상의 행동을 결정해요. Critic은 향상된 성능을 도출할 피드백을 Actor에게 제공해요. Actor-Critic 알고리즘은 연속적인 행동 공간과 훈련에 대한 하이퍼파라미터에 대해 잘 작동해요. Actor-Critic 모델은 불안정성을 피하기 위해 충분한 실험을 해야 해요.

<div class="content-ad"></div>

## 참고 자료:

REINFORCEMENT LEARNING THROUGH ASYNCHRONOUS ADVANTAGE ACTOR-CRITIC ON A GPU

Asynchronous Methods for Deep Reinforcement Learning

[PDF 바로가기](https://www.davidsilver.uk/wp-content/uploads/2020/03/pg.pdf)

<div class="content-ad"></div>

http://rail.eecs.berkeley.edu/deeprlcourse-fa17/f17docs/lecture_5_actor_critic_pdf

https://ai.stackexchange.com/questions/7390/what-is-the-difference-between-actor-critic-and-advantage-actor-critic