---
title: "RL 경계를 넓히기 LLMs와 VLMs와 같은 기본 모델을 강화 학습에 통합하기"
description: ""
coverImage: "/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_0.png"
date: 2024-06-20 18:53
ogImage: 
  url: /assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_0.png
tag: Tech
originalTitle: "Pushing RL Boundaries: Integrating Foundational Models, e.g. LLMs and VLMs, into Reinforcement Learning"
link: "https://medium.com/towards-data-science/pushing-boundaries-integrating-foundational-models-e-g-556cfb6d0632"
---


## Foundational Models를 RL Training 루프에 통합하는 심층 탐구

저자: Elahe Aghapour, Salar Rahili

## 개요:

트랜스포머 아키텍처와 고성능 컴퓨팅 기술의 발전으로 인해, 최근에는 Foundational 모델을 훈련하는 것이 핫한 주제로 떠올랐습니다. 이를 통해, RL(강화 학습) 알고리즘의 성능을 향상시키기 위해 Foundational 모델을 통합하거나 훈련하는 노력들이 이루어지고 있으며, 이는 이 분야에 대한 흥미로운 방향을 시사합니다. 여기에서 Foundational 모델이 강화 학습에 큰 도움이 될 수 있는지에 대해 논의하고 있습니다.

<div class="content-ad"></div>

최신 연구에 대한 탐구에 앞서, 기반 모델이 강화 학습에 큰 도움을 줄 수 있는 방법에 대해 이야기해보겠습니다. 우리의 목표는 사전 훈련된 기반 모델, 특히 대형 언어 모델(LLMs) 또는 비전-언어 모델(VLMs)이 우리를 어떻게 지원할 수 있는지, 또는 어떻게 기반 모델을 처음부터 훈련시킬 수 있는지를 확인하는 것입니다. 유용한 접근 방법은 강화 학습 훈련 루프의 각 요소를 개별적으로 검토하여 개선의 여지가 있는 곳을 식별하는 것입니다:

![이미지](/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_0.png)

1- 환경: 사전 훈련된 기반 모델은 사건 간의 인과 관계를 이해하기 때문에 현재 행동으로 인한 환경 변화를 예측하는 데 활용할 수 있습니다. 이 개념은 흥미로운데, 현재는 이에 중점을 두는 구체적인 연구에 대해 알지 못합니다. 이 아이디어를 더 탐구하는 데 제한된 이유가 두 가지 있습니다.

- 강화 학습 훈련 과정은 다음 단계 관측에 대해 매우 정확한 예측을 요구하는데, 사전 훈련된 LLMs/VLMs가 이에 부합하는 데이터셋에서 직접 훈련되지 않아 이 측면에서 미흡할 수 있습니다. 우리가 이전 글에서 강조한 바와 같이, 특히 평생 학습 시나리오에서 사용되는 고수준 플래너는 효과적으로 기반 모델을 통합할 수 있습니다.
- 환경 단계의 지연은 RL 알고리즘을 제한할 수 있는 중요한 요소입니다. 특히 훈련 단계에 대한 고정 예산 내에서 작업할 때 매우 큰 지연을 도입하는 모델은 제약을 줄 수 있습니다. 도전적일 수 있지만, 작은 네트워크로 압축하는 것이 여기에 해결책이 될 수 있음을 유의해 주세요.

<div class="content-ad"></div>

2- 상태 (LLM/VLM 기반의 상태 생성기): 전문가들은 종종 관찰과 상태라는 용어를 서로 바꿔 사용하지만, 이 둘 사이에는 차이가 있습니다. 상태는 환경의 포괄적인 표현이며, 반면에 관찰은 부분적인 정보만을 제공할 수 있습니다. 표준 강화 학습 프레임워크에서는 관측치, 지난 행동 및 환경의 내부 지식에서 유용한 특징을 추출하고 병합하여 "상태"인 정책 입력을 생성하는 구체적인 변환에 대해 자주 논의하지 않습니다. 이러한 변환은 LLMs/VLMs를 활용함으로써 크게 향상될 수 있으며, 우리에게 세계, 물리학 및 역사에 대한 폭넓은 지식을 "상태"에 주입할 수 있는 기회를 제공합니다 (핑크로 강조된 그림 1을 참조).

3- 정책 (기초적인 정책 모델): 정책에 기초 모델을 통합하는 것은 강화 학습에서 중요한 결정 요소인 중심적인 의사 결정 요소이므로 매우 유익할 수 있습니다. 고수준 계획을 생성하기 위해 이러한 모델을 활용하는 것이 성공적이었지만, 상태를 저수준 행동으로 변환하는 것은 나중에 자세히 다뤄볼 문제가 있습니다. 다행히도 최근에 이 분야에서 약간의 유망한 연구가 있었습니다.

4- 보상 (LLM/VLM 기반의 보상 생성기): 연구자들 사이에서 선택된 행동을 보다 정확하게 평가하기 위해 기초 모델을 활용하는 것이 주요 관심사가 되었습니다. 보상은 인간과 에이전트 사이의 커뮤니케이션 채널로 기능해 왔으며, 목표를 설정하고 에이전트를 희망하는 방향으로 안내하는 중요한 역할을 합니다.

- 사전 훈련된 기초 모델은 세계에 대한 깊은 지식을 가지고 있으며, 이러한 이해를 의사 결정 과정에 주입함으로써 결정을 인간의 욕망과 더 잘 일치하고 성공할 가능성을 높일 수 있습니다. 또한, 기초 모델을 사용하여 에이전트의 행동을 평가하면 검색 공간을 신속하게 줄이고 에이전트에게 이해를 시작하는 데 선뜻 도와줄 수 있습니다.
- 사전 훈련된 기초 모델은 대부분 인간에 의해 생성된 인터넷 규모의 데이터로 훈련되었으며, 이는 그들이 인간과 유사한 방식으로 세계를 이해할 수 있도록 만들었습니다. 이는 기초 모델을 비용 효율적인 주석 생성기로 활용할 수 있게 만들어 줍니다. 그들은 대규모로 레이블을 생성하거나 궤적이나 롤아웃을 평가할 수 있습니다.

<div class="content-ad"></div>

1- 보상에 대한 기본 모델

에이전트 설정에 매우 의존적이며 기본 모델의 교육 데이터 세트에서 불충분하게 나타나는 낮은 수준의 조치를 생성하는 데 기초 모델을 사용하는 것은 어려운 과제입니다. 따라서, 기초 모델 응용은 일반적으로 낮은 수준의 조치보다는 높은 수준의 계획에 중점을 두고 있습니다. 보상은 높은 수준의 계획자와 낮은 수준의 조치 사이의 간격을 메꾸는 역할을 하고 기초 모델을 사용할 수 있게 합니다. 연구자들은 보상 할당을 위해 기초 모델을 통합하는 다양한 방법론을 채택했습니다. 그러나 핵심 원칙은 VLM/LLM을 활용하여 하위 목표나 작업을 향한 진행을 효과적으로 추적하는 데 있습니다.

1.a 유사성을 기반으로 보상값 할당

보상값을 고려할 때, 이는 에이전트의 이전 조치가 목표에 가까이 이동하는 데 유익했는지를 나타내는 신호로 간주될 수 있습니다. 합리적인 방법은 이전 조치가 현재 목표와 얼마나 밀접하게 일치하는지를 평가하는 것입니다. 이 방법을 실천하기 위해, 그림 2에서 볼 수 있듯이, 반드시 다음과 같은 작업이 필요합니다:
- 이러한 조치의 의미 있는 임베딩을 생성합니다. 이는 가장 최근 관측의 이미지, 비디오 또는 텍스트 설명을 통해 수행할 수 있습니다.
- 현재 목표의 의미 있는 표현을 생성합니다.
- 이러한 표현 사이의 유사성을 평가합니다.

<div class="content-ad"></div>

![2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_1.png](/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_1.png)

이 분야의 선도적인 연구에 대한 구체적인 메커니즘을 살펴봅시다.

밀도 높고 잘 정의된 보상 함수는 RL 에이전트의 안정성과 훈련 속도를 향상시킵니다. 내재 보상은 혁신적인 상태의 탐험에 대해 에이전트를 보상하여 이러한 도전에 대처합니다. 그러나 대부분의 보이지 않는 상태가 하류 작업과 관련이 없는 대규모 환경에서는 이 방법이 효과가 줄어듭니다. ELLM은 탐사를 형성하기 위해 LLM의 백그라운드 지식을 활용합니다. LLM에게 에이전트의 사용 가능한 작업 목록과 상태 캡션 생성기에 의해 생성된 에이전트 현재 관찰의 텍스트 설명 목록이 주어졌을 때, LLM에게 가능한 목표/하위 목표 목록을 생성하도록 요청합니다. 그런 다음 각 시간 스텝에서 보상은 LLM이 생성한 목표와 에이전트의 전환 설명 간의 의미적 유사성, 코사인 유사성에 의해 계산됩니다.

LiFT도 비슷한 프레임워크를 가지고 있지만 보상 할당을 위해 CLIP4Clip 스타일 VLMs를 활용합니다. CLIP4Clip은 대립 학습을 통해 비디오와 해당 언어 설명을 정렬하는 데 사전 훈련되었습니다. LiFT에서 에이전트는 CLIP4Clip에 의해 코딩된 과제 지침과 에이전트의 해당 행동의 비디오 간의 정렬 점수, 코사인 유사성에 기반해 보상을 받습니다.

<div class="content-ad"></div>

UAFM은 로봇 조작 작업에 중점을 둔 유사한 프레임워크를 갖고 있습니다. 예를 들어, 물건을 쌓는 작업과 같은 작업에 중점을 둡니다. 보상 할당에서는 에이전트 상태 이미지와 작업 설명 사이의 유사성을 측정하며 둘 다 CLIP에 의해 임베드됩니다. 이들은 시뮬레이션된 쌓기 도메인의 소량의 데이터로 CLIP을 미세 조정하여 이용 사례에 더욱 일치시킵니다.

1.b 보조 작업 추론을 통한 보상 할당:

환경의 올바른 이해를 갖고 있는 기본 모델이 있는 시나리오에서는 궤적 내의 관측값을 직접 모델(LIM/VLM)로 전달하는 것이 실현 가능해집니다. 관측값을 기반으로 한 간단한 QA 세션을 통해 또는 관측값 궤적을 보고 목표를 예측하는 모델의 능력을 검증함으로써 이 평가를 할 수 있습니다.

![image](/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_2.png)

<div class="content-ad"></div>

Read and Reward은 환경 설명서를 보상 생성에 통합하는 데 두 가지 핵심 구성 요소를 통해 수행됩니다. 다음과 같이 확인할 수 있습니다.:

- QA 추출 모듈: 이 모듈은 게임 목표와 기능에 대한 요약을 생성합니다. 이 LLM 기반 모듈인 RoBERTa-large는 게임 설명서와 질문을 입력 받아 텍스트로부터 해당 답변을 추출합니다. 질문은 게임 목표와 에이전트-객체 상호 작용에 초점을 맞추며, TF-IDF를 사용하여 중요도를 식별합니다. 각 핵심 객체에 대해 "플레이어가 '객체'를 칠 때 무슨 일이 일어납니까?"라는 질문이 질문 세트에 추가됩니다. 그런 다음 모든 비어 있지 않은 질문-답변 쌍을 연결하여 요약이 형성됩니다.
- 추론 모듈: 게임 플레이 중에 규칙 기반 알고리즘이 "히트" 이벤트를 감지합니다. 각 "히트" 이벤트 후에는 환경의 요약과 질문 "승리하려면 '상호 작용 객체'를 치면 괜찮을까요?"로 LLM 기반 추론 모듈에 쿼리됩니다. 가능한 답변은 '예, 아니오'로 제한됩니다. "예" 응답은 긍정적인 보상을 추가하고, "아니오"는 부정적인 보상으로 이어집니다.

EAGER는 특별히 설계된 보조 작업을 통해 내재적 보상을 생성하는 독특한 방법을 소개합니다. 이 방식은 현재 관찰을 기반으로 목표를 예측하는 보조 작업을 포함하는 혁신적인 개념을 제시합니다. 모델이 정확하게 예측하면 의도된 목표와 강력한 일치를 나타내며, 따라서 예측 신뢰도 수준에 따라 더 큰 내재적 보상이 제공됩니다. 이 목표를 달성하기 위해 두 모듈이 사용됩니다.:

- 질문 생성 (QG): 이 구성 요소는 사용자가 제공한 상세 목표에서 모든 명사와 형용사를 마스킹하여 작동합니다.
- 질문 응답 (QA): 이 모델은 관찰, 질문 마스크 및 작업을 입력으로 받아 마스킹된 토큰을 예측하는 지도 방식으로 교육된 모델입니다.

<div class="content-ad"></div>

(P.S. 기본 모델을 사용하지 않았지만 흥미로운 접근 방식으로 여기에 포함했습니다. 이 접근 방식은 사전 훈련된 LLM에 쉽게 적용할 수 있습니다.)

1. 보상 함수 코드 생성

지금까지는 보상 학습 알고리즘을 위해 직접 보상 값을 생성하는 방법에 대해 논의했습니다. 그러나 RL 루프의 각 단계에서 대형 모델을 실행하는 것은 교육 및 추론의 속도를 현저하게 늦출 수 있습니다. 이 병목 현상을 우회하기 위한 한 가지 전략은 기본 모델을 활용하여 보상 함수의 코드를 생성하는 것입니다. 이를 통해 각 단계에서 보상 값을 직접 생성하여 프로세스를 간소화할 수 있습니다.

보상 코드 생성 스키마가 효과적으로 작동하려면 두 가지 주요 구성 요소가 필요합니다:
1. 모든 필요한 정보를 포함하는 자세한 프롬프트를 수신하는 코드 생성기(LMM).
2. 코드 생성기와 협업하여 코드를 평가하고 향상시키는 정제 프로세스.
보상 코드를 생성하는 데 중요한 기여를 살펴보겠습니다:

<div class="content-ad"></div>

R2R2S는 두 가지 주요 구성 요소를 통해 보상 함수 코드를 생성합니다:

- LLM 기반 동작 설명자: 이 모듈은 미리 정의된 템플릿을 사용하여 로봇 동작을 설명하고, 대형 언어 모델 (LLM)을 활용하여 동작을 이해합니다. 동작 설명자는 템플릿을 채워 넣어 "목적지 좌표" 등의 자리 표시자를 구체적인 세부 정보로 대체하여 미리 정의된 템플릿 내에서 원하는 로봇 동작을 설명합니다.
- LLM 기반 보상 코드 생성기: 이 구성 요소는 보상 함수 코드를 생성합니다. 이때 prompt에 포함된 내용은 동작 설명, LLM이 보상 함수 코드를 생성하는 데 사용할 수 있는 함수 목록과 설명, 응답이 어떻게 보이는지를 보여주는 예제 코드, 그리고 보상 함수가 따라야 하는 제약 조건과 규칙입니다.

Text2Reward는 반복적인 개선 내에서 실행 가능한 코드로 밀집 보상 함수를 생성하는 방법을 개발합니다. 작업의 하위 목표가 주어졌을 때, 두 가지 주요 구성 요소가 있습니다:

- LLM 기반 보상 코드 생성기: 보상 함수 코드를 생성합니다. prompt에는 관측과 가능한 동작의 요약, 객체, 로봇 및 호출 가능한 함수의 구성을 나타내는 간결한 파이썬 스타일 환경, 보상 함수 설계를 위한 배경 지식 (예: "작업 X의 보상 함수에는 일반적으로 객체 x와 y 간의 거리를 포함하는 항목이 포함됨"), 그리고 몇 가지 샷 예시가 포함됩니다. 그들은 명령어의 풀에 액세스하고, 상위 k개 유사한 명령어를 몇 가지 샷 예시로 검색한다고 가정합니다.
- LLM 기반 개선: 보상 코드가 생성되면, 코드가 실행되어 구문 오류와 런타임 오류를 식별합니다. 이러한 피드백은 후속 prompt로 통합되어 더 정교한 보상 함수를 생성합니다. 추가로, 현재 정책에 의한 작업 실행 비디오를 기반으로 사용자 피드백이 요청됩니다.

<div class="content-ad"></div>

Auto MC-Reward은 Text2Reward와 유사한 알고리즘을 가지고 있습니다. 보상 함수 코드를 생성하려면 Fig. 4를 참조하세요. 주요 차이점은 두 개의 LLM을 갖고 있는 세밀화 단계에 있습니다:

- LLM 기반 보상 평가자: 코드를 평가하고 코드가 자기 일관성이 있고 구문 및 의미적 오류가 없는지에 대한 피드백을 제공합니다.
- LLM 기반 경로 분석자: 훈련된 에이전트와 환경 사이의 상호 작용에 대한 과거 정보를 검토하고 보상 함수의 수정을 안내하는 데 사용합니다.

![이미지](/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_3.png)

EUREKA는 특정 작업 프롬프팅, 사전 정의된 보상 템플릿 또는 사전 정의된 소수의 예제가 필요하지 않고 보상 코드를 생성합니다. 이 목표를 달성하기 위해 두 단계가 있습니다:

<div class="content-ad"></div>

- LLM 기반 코드 생성: 원시 환경 코드, 작업, 일반적 보상 설계 및 형식 지침이 LLM에게 컨텍스트로 제공되며, LLM은 실행 가능한 보상 코드와 해당 구성 요소 목록을 반환합니다.
- 진화적 탐색 및 교정: 각 반복마다 EUREKA는 LLM에 쿼리를 보내서 여러 독립적인 보상 함수를 생성합니다. 실행 가능한 보상 함수로 에이전트를 훈련시키면 에이전트의 수행 상황을 피드백으로 제공합니다. 보상 함수의 각 구성 요소에 대한 상세하고 집중된 분석을 위해 피드백은 보상 함수의 각 구성 요소에 대한 스칼라 값도 포함합니다. LLM은 상위 성능을 발휘하는 보상 코드와 해당 상세한 피드백을 가져와서 보상 코드를 컨텍스트 내에서 변이시킵니다. 각 후속 반복에서 LLM은 상위 보상 코드를 참조로 사용하여 추가로 K개의 독립적인 보상 코드를 생성합니다. 이 반복적 최적화는 지정된 반복 횟수에 도달할 때까지 계속됩니다.

이 두 단계 내에서 EUREKA는 전문가의 휴먼-엔지니어링 된 보상을 뛰어넘는 보상 함수를 생성할 수 있습니다.

1.d. 선호에 기반한 보상 모델 훈련 (RLAIF)

대체 방법으로 기초 모델을 사용하여 보상 함수 모델을 훈련하기 위한 데이터를 생성할 수 있습니다. 휴먼 피드백을 통한 강화 학습의 중요한 성공들로 Reinforcement Learning with Human Feedback (RLHF)가 최근에 큰 주목을 받으면서 교육된 보상 함수를 대규모로 사용하는 데 집중적인 관심이 집중되고 있습니다. 이러한 알고리즘의 핵심은 선호 데이터셋을 사용하여 보상 모델을 훈련시키는 것이며, 이는 후에 강화 학습 알고리즘에 통합될 수 있습니다. 휴먼 피드백을 통해 선호 데이터를 생성하는 높은 비용이 가질 수 있기 때문에, VLM/LLM과 같은 AI 에이전트에서 피드백을 얻어 이 데이터셋을 만드는 데 대한 관심이 증가하고 있습니다. AI 생성 데이터를 사용하여 보상 함수를 훈련시키고 강화 학습 알고리즘에 통합하는 것이 Reinforcement Learning with AI Feedback (RLAIF)로 알려져 있습니다.

<div class="content-ad"></div>

MOTIF은 충분한 커버리지를 갖춘 관측 pass 데이터 세트에 액세스해야 합니다. 먼저 LLM은 환경 내에서 원하는 행동에 대한 요약과 무작위로 추출한 두 관측의 텍스트 설명을 쿼리합니다. 그런 다음, 그림 5에 나와 있는 것처럼 촉진을 생성하여 1, 2 또는 0(좋아하는 것이 아님을 나타냄) 중 하나를 선택합니다. 이 프로세스는 관측 쌍 사이의 선호도 데이터 세트를 구성합니다. 이후에는 이 데이터 세트를 사용하여 기반 선호도 기반 RL 기법을 활용한 보상 모델을 교육합니다.

![image](/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_4.png)

2- 정책으로서의 기초 모델들

지금까지 조사된 작업에서 뛰어나는 것뿐만 아니라, 과거 학습을 통해 새로운 작업을 추론하고 적응할 수 있는 능력을 갖추는 기본 정책을 교육하는 능력은 RL 커뮤니티에서의 포부입니다. 이러한 정책은 이전 경험으로부터 새로운 상황에 대처하고, 환경적 피드백을 통해, 인간과 유사한 적응성을 통해 이전에 본 적 없는 목표를 달성할 수 있도록 일반화되는 것이 이상적입니다.

<div class="content-ad"></div>

그러나, 이러한 에이전트를 교육하는 데는 몇 가지 도전이 있습니다. 이 도전 중 몇 가지는 다음과 같습니다:

- 매우 큰 모델을 관리해야 하므로, 낮은 수준의 제어 동작에 대한 의사 결정 과정에 상당한 대기 시간이 발생합니다.
- 효과적인 학습을 위해 다양한 작업 영역에서 방대한 상호 작용 데이터를 수집해야 합니다.
- 또한, RL을 사용하여 매우 큰 네트워크를 처음부터 교육하는 과정은 추가 복잡성을 도입합니다. 이는 역전파 효율이 감독 학습 방법과 비교하여 RL에서 더 약한 특성 때문입니다.

지금까지 이 도메인에서 정말 한창 인 것은 주로 상당한 자원과 최고 수준의 환경을 갖춘 팀들뿐이었습니다.

AdA는 X.Land 2.0 3D 환경 내에서 RL 기반 모델을 교육하는 길을 열었습니다. 이 모델은 추가 교육 없이 테스트 작업에서 인간 시간 규모의 적응을 달성합니다. 모델의 성공 요소는 세 가지입니다.

<div class="content-ad"></div>

- AdA의 학습 메커니즘 핵심은 2,300만 개에서 2억 6,500만 개의 매개변수로 이루어진 Transformer-XL 아키텍처로, Muesli RL 알고리즘과 함께 사용됩니다. Transformer-XL은 시간 t부터 T까지의 관측, 행동 및 보상의 경로를 입력으로 받아 각 시간 단계에 대해 숨겨진 상태의 일렬을 출력합니다. 숨겨진 상태는 보상, 가치 및 행동 분포 π를 예측하는 데 사용됩니다. 장기 및 단기 기억의 조합은 빠른 적응을 위해 중요합니다. 장기 기억은 천천히 경사 업데이트를 통해 달성되며, 단기 기억은 트랜스포머의 문맥 길이 내에서 포착될 수 있습니다. 이 독특한 조합은 모델이 환경이 재설정되어도 시도 간 메모리를 유지하여 여러 작업 시도 간 지식을 보존할 수 있게 합니다.
- 모델은 변형자가 메타 학습자이기 때문에 1⁰⁴⁰개의 다양한 부분 관찰 가능한 마르코프 의사 결정 프로세스 (POMDPs) 작업을 통해 메타-RL 훈련의 혜택을 받습니다. 과제 풀의 크기와 다양성을 감안할 때, 많은 작업이 좋은 훈련 신호를 생성하기에는 너무 쉽거나 너무 어려울 수 있습니다. 이를 해결하기 위해 자동화된 커리큘럼을 사용하여 기능 경계 내에 있는 작업을 우선 순위로 두었습니다.

RT-2는 로보틱 경로 데이터와 시각-언어 작업 양쪽에서 VLM에 대해 공동으로 세밀 조정하는 방법을 소개하며, 결과적으로 RT-2라는 정책 모델을 생성합니다. 시각-언어 모델이 저수준 액션을 생성할 수 있도록하기 위해, 액션은 256개의 바구니로 이산화되어 언어 토큰으로 표현됩니다.

액션을 언어 토큰으로 표현함으로써, RT-2는 상당한 수정 없이 이미 존재하는 VLM 아키텍처를 직접 활용할 수 있습니다. 따라서 VLM 입력에는 로봇 카메라 이미지와 시각적 질문 응답 작업과 유사한 형식으로 구성된 텍스트 작업 설명이 포함되며, 출력은 로봇의 저수준 작업을 나타내는 언어 토큰의 일련이 됩니다. Fig. 6을 참조하세요.

`<img src="/assets/img/2024-06-20-PushingRLBoundariesIntegratingFoundationalModelsegLLMsandVLMsintoReinforcementLearning_5.png" />`

<div class="content-ad"></div>

그들은 웹 데이터를 사용한 두 가지 유형의 데이터에 대한 공동미세조정이 보다 일반화된 정책을 이끌어냄을 알아차렸습니다. 공동미세조정 프로세스는 RT-2에게 교육 데이터에 명시적으로 존재하지 않는 명령을 이해하고 실행할 수 있는 능력을 제공함으로써 놀랍도록 적응성을 보여줍니다. 이 접근법은 VLM의 인터넷 규모 사전학습을 통해 새로운 작업에 대한 일반화를 가능케 했습니다.

3- 상태 표현으로서의 기반 모델

RL에서 정책이 주어진 시점에 환경을 이해하는 것은 본질적으로 주변을 어떻게 인식하는지인 '상태'에서 옵니다. RL 블록 다이어그램을 살펴볼 때, 세계 지식을 주입할 합리적인 모듈은 상태입니다. 작업 완료에 유용한 일반 지식으로 관측을 풍부하게 하면, 정책은 처음부터 학습을 시작하는 RL 에이전트에 비해 새로운 작업을 더 빨리 학습할 수 있습니다.

PR2L은 인터넷 규모의 VLM의 백그라운드 지식을 RL에 주입하는 새로운 방법론을 소개합니다. PR2L은 이미지 및 텍스트 입력에 대한 언어를 생성하는 생성적 VLM을 활용합니다. VLM은 시각 및 텍스트 입력을 이해하고 응답하는 데 능숙하기 때문에, 관찰에서 행동에 연결될 수 있는 의미론적 기능의 풍부한 소스를 제공할 수 있습니다.

<div class="content-ad"></div>

PR2L은 각각의 시각적 관찰에 대해 VLM에 작업 관련 프롬프트로 쿼리하고, 생성된 텍스트 응답과 모델의 중간 표현을 받습니다. 그들은 텍스트를 버리고 시각 및 텍스트 입력 및 VLM의 생성된 텍스트 응답에 대한 중간 표현을 "프롬프트 가능한 표현"으로 사용합니다. 이러한 표현의 크기가 변수이기 때문에 PR2L은 모든 프롬프트 가능한 표현에 포함된 모든 정보를 고정 크기 임베딩으로 임베딩하기 위해 인코더-디코더 트랜스포머 레이어를 통합합니다. 이 임베딩은 비시각 관찰 데이터와 함께 사용되어 에이전트의 상태를 나타내는 정책 네트워크에 제공됩니다. 이 혁신적인 통합을 통해 RL 에이전트는 VLM의 풍부한 의미 이해와 배경 지식을 활용하여 작업을 보다 신속하고 정보화된 학습을 할 수 있습니다.

참고문헌:

[1] ELLM: Du, Yuqing 등. “Guiding pretraining in reinforcement learning with large language models.” 2023.
[2] Text2Reward: Xie, Tianbao 등. “Text2reward: Automated dense reward function generation for reinforcement learning.” 2023.
[3] R2R2S: Yu, Wenhao 등. “Language to rewards for robotic skill synthesis.” 2023.
[4] EUREKA: Ma, Yecheng Jason 등. “Eureka: Human-level reward design via coding large language models.” 2023.
[5] MOTIF: Klissarov, Martin 등. “Motif: Intrinsic motivation from artificial intelligence feedback.” 2023.
[6] Read and Reward: Wu, Yue 등. “Read and reap the rewards: Learning to play atari with the help of instruction manuals.” 2024.
[7] Auto MC-Reward: Li, Hao 등. “Auto MC-reward: Automated dense reward design with large language models for minecraft.” 2023.
[8] EAGER: Carta, Thomas 등. “Eager: Asking and answering questions for automatic reward shaping in language-guided RL.” 2022.
[9] LiFT: Nam, Taewook 등. “LiFT: Unsupervised Reinforcement Learning with Foundation Models as Teachers.” 2023.
[10] UAFM: Di Palo, Norman 등. “Towards a unified agent with foundation models.” 2023.
[11] RT-2: Brohan, Anthony 등. “Rt-2: Vision-language-action models transfer web knowledge to robotic control.” 2023.
[12] AdA: Team, Adaptive Agent 등. “Human-timescale adaptation in an open-ended task space.” 2023.
[13] PR2L: Chen, William 등. “Vision-Language Models Provide Promptable Representations for Reinforcement Learning.” 2024.
[14] Clip4Clip: Luo, Huaishao 등. “Clip4clip: An empirical study of clip for end to end video clip retrieval and captioning.” 2022.
[15] Clip: Radford, Alec 등. “Learning transferable visual models from natural language supervision.” 2021.
[16] RoBERTa: Liu, Yinhan 등. “Roberta: A robustly optimized bert pretraining approach.” 2019.
[17] Preference based RL: SWirth, Christian 등. “A survey of preference-based reinforcement learning methods.” 2017.
[18] Muesli: Hessel, Matteo 등. “Muesli: Combining improvements in policy optimization.” 2021.
[19] Melo, Luckeciano C. “Transformers are meta-reinforcement learners.” 2022.
[20] RLHF: Ouyang, Long 등. “Training language models to follow instructions with human feedback, 2022.

