---
title: "만나보세요 HUSKY 다단계 추론을 최적화한 새로운 에이전트"
description: ""
coverImage: "/assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_0.png"
date: 2024-06-19 20:24
ogImage: 
  url: /assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_0.png
tag: Tech
originalTitle: "Meet HUSKY: A New Agent Optimized for Multi-Step Reasoning"
link: "https://medium.com/towards-artificial-intelligence/meet-husky-a-new-agent-optimized-for-multi-step-reasoning-0edb8e087d22"
---


## Meta AI, Allen AI 및 워싱턴 대학이 함께 한 새로운 연구에서는 LLM 추론에서 가장 중요한 문제 중 하나를 다루고 있습니다.

![이미지](/assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_0.png)

추론은 창조적 AI의 다음 분야로 높이 평가되고 있습니다. 추론이라 함은 작업을 더 작은 하위 집합으로 분해하고 그것을 개별적으로 해결할 수 있는 능력을 가리킵니다. 추론 기능을 다룬 최근 기술로는 Chain-of-Thought, Tree-of-Thought, Skeleton-of-Thought, 그리고 Reflexion 등이 있습니다. 추론은 외부 데이터 또는 도구에 액세스하는 것과 같은 주변 기능도 포함합니다. 지난 몇 년 동안 특정 추론 기술에서 모델이 매우 잘 수행되었지만 도메인 간에 일반화되지 못하는 것을 보았습니다. 이는 추론이 매우 계산적으로 비싼 작업이라는 점을 고려한다면 놀라운 일이 아닙니다. 이것이 Meta AI, Allen Institute of AI 및 워싱턴 대학의 연구자들이 최근 논문에서 다루고 있는 과제입니다.

HUSKY는 숫자, 테이블, 및 기반 지식 추론을 포함하는 다양한 복잡한 작업을 처리하기 위해 설계된 오픈 소스 언어 에이전트입니다. 특정 작업에 집중하거나 독점적인 모델을 사용하는 다른 에이전트와 달리, HUSKY는 다양한 도전 과제를 다루기 위한 통합된 프레임워크 내에서 작동합니다. 이는 두 단계로 진행됩니다: 먼저, 작업을 해결하기 위해 필요한 다음 동작을 생성합니다. 그리고 두 번째로, 전문가 모델을 사용하여 이 동작을 실행하고 진행되는대로 솔루션을 업데이트합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_1.png)

# HUSKY 내부

HUSKY는 복잡한 작업을 해결하기 위해 자세한 행동 계획을 사용합니다. 먼저, 다음 단계를 생성하고, 그 단계에는 실행해야 할 작업과 필요한 도구가 포함됩니다. 그런 다음, 전문 모델을 사용하여 작업을 실행하고 솔루션 상태를 업데이트합니다. 이 접근 방식을 통해 HUSKY는 대규모 언어 모델 (LLM)을 사용하여 성능을 최적화한 전통적인 계획 시스템의 현대 버전처럼 동작합니다.

![이미지](/assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_2.png)


<div class="content-ad"></div>

멀티스텝 추론이 필요한 작업의 경우, HUSKY는 다음 작업 및 해당 도구를 예측하고 전문가 모델을 사용하여 실행합니다. 이 과정은 최종 답변이 발견될 때까지 반복됩니다. HUSKY는 팀으로 작동하는 일렴의 전문가 모델을 조정하기 위해 여러 LLMs를 사용합니다. (LLM: Large Language Model)

## 작업 및 도구 선택

HUSKY는 터미널 상태에 도달할 때까지 작업 생성 및 실행 사이를 반복합니다. 작업 생성기는 다음 고수준 단계를 예측하고 미리 정의된 코드, 수학, 검색 또는 상식 네 가지 중 하나의 도구를 할당합니다. 할당된 도구에 따라 HUSKY는 전문가 모델을 호출하고 작업을 수행하며 솔루션 상태를 업데이트하며 선택적으로 출력을 자연어로 변환할 수 있습니다.

# HUSKY 훈련

<div class="content-ad"></div>

허스키의 교육은 선생님 모델을 사용하여 도구 통합 솔루션 경로를 생성하는 것을 포함합니다. 이러한 경로는 작업 생성기와 전문가 모델에 대한 교육 데이터를 구축하는 데 도움이 됩니다. 교육 파이프라인은 단순화되어 일반화되어 있어서 특정 작업 가정 없이도 허스키가 다양한 작업을 처리할 수 있습니다.

![이미지](/assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_3.png)

## 추론 프로세스

추론 중에 허스키는 훈련된 모듈을 통합하여 새로운 다단계 작업을 해결합니다. 작업 생성기는 첫 번째 단계와 도구를 결정하고, 그것을 전문가 모델에 전달하여 출력을 생성합니다. 이 반복적인 과정은 최종 솔루션이 달성될 때까지 계속되며, 전문가 모델은 각 단계에 대해 특정한 출력을 제공합니다.

<div class="content-ad"></div>

# 평가 및 성능

HUSKY의 평가는 복잡한 추론 작업에서의 추론 능력을 테스트하고 결과를 점수화하는 것을 포함합니다. 기존 데이터셋은 HUSKY가 필요로 하는 다양성을 갖추지 못하는 경우가 많아, 혼합 도구 추론을 테스트하기 위해 새로운 평가 세트인 HUSKYQA가 생성되었습니다. 이 세트에는 누락된 지식을 검색하고 숫자적 추론을 수행하는 작업이 포함되어 있습니다. 더 작은 모델을 사용하더라도, HUSKY는 GPT-4와 같은 최첨단 모델을 능가하거나 뛰어넘는 효과를 보여주며 그 효과를 입증합니다.

HUSKY는 다단계 추론과 도구 사용이 필요한 다양한 작업에서 기본 언어 에이전트들과 함께 훈련되고 평가되었습니다. 이러한 작업 중 절반은 HUSKY의 모듈을 훈련하는 데 사용되었고, 도구 통합 솔루션 경로에 기반을 둔 반면, 나머지 절반은 평가를 위해 예약되었습니다. 모든 작업은 제로샷 방식으로 평가되었습니다.

1) 숫자적 추론 작업

<div class="content-ad"></div>

수치 추론 작업에는 초등학교에서 고등학교 대회 수준까지 다양한 수학 데이터 세트가 포함되었습니다. 이러한 데이터 세트에는 GSM-8K, MATH, Google DeepMind 수학 작업 및 LILA 벤치마크에서 가져온 MathQA가 포함되었습니다. Google DeepMind 수학 작업에서 중점을 둔 부분에는 대수, 기본 수학, 미적분, 곱셈/나눗셈, 번호 이론 하위 집합이 포함되었습니다. MathQA의 하위 집합에는 이득, 일반, 기하학, 물리학, 확률이 포함되었습니다. GSM-8K 및 MATH는 교육용으로 사용되어 13.7K의 툴 통합 솔루션 경로를 제공했습니다.

2) 표 추론 작업

표 추론 작업은 표 형식의 수학 단어 문제 데이터 세트인 TabMWP, 금융 질문-응답 데이터 세트인 FinQA 및 TAT-QA, 텍스트와 표 데이터를 이해해야 하는 MultimodalQA의 테스트 문제 하위 집합으로 이루어졌습니다. TabMWP 및 FinQA는 교육 및 평가에 모두 사용되었으며, TAT-QA 및 MultimodalQA는 평가를 위해 제외되었습니다. 이러한 데이터 세트는 총 7.2K의 툴 통합 솔루션 경로를 제공했습니다.

3) 지식 기반 추론 작업

<div class="content-ad"></div>

지식 기반 추론 작업에는 HotpotQA, CWQ, Musique, Bamboogle 및 StrategyQA가 포함되었습니다. HotpotQA와 Bamboogle은 평가용으로 예약되었으며, CWQ와 Musique는 교육용으로 사용되었으며, StrategyQA는 둘 다에 사용되었습니다. 이 각각은 총 7,000개의 도구 통합 솔루션 경로를 생성하였습니다.

## 모델

평가에는 다음과 같은 모델이 포함되었습니다:

액션 생성기: 액션 생성기의 경우, HUSKY는 LLAMA-2-7B, 13B 및 LLAMA-3-8B 모델을 활용했습니다. 잘못된 솔루션 경로는 훈련 세트에서 제거되어, 숫자, 테이블, 지식 기반 및 혼합 도구 추론 작업에서 11만 개의 인스턴스가 생성되었습니다. 이 액션 생성기는 이 멀티 태스크 교육 세트에서 완전히 미세 조정되었습니다.

<div class="content-ad"></div>

코드 생성기: 견고한 코딩 능력으로 유명한 DEEPSEEKCODER-7B-INSTRUCT-V1.5 모델이 코드 생성기 세밀 조정의 기반으로 선택되었습니다. 올바른 해결 경로를 사용하여 필요한 모든 코드를 추출하였고, 결과적으로 44K의 코드 인스턴스가 훈련을 위해 생성되었습니다.

수학 추론기: 진보된 수학적 추론 능력으로 DEEPSEEKMATH-7B-INSTRUCT 모델이 선택되었습니다. 올바른 해결 경로를 통해 30K의 수학 해결 방법 인스턴스가 수학 추론기 세밀 조정을 위해 제공되었습니다.

쿼리 생성기: 쿼리 생성기에는 LLAMA-2-7B가 기반 모델로 사용되었습니다. 올바른 해결 경로가 22K의 검색 쿼리 인스턴스를 쿼리 생성기 세밀 조정을 위해 제공하였습니다.

일부 결과는 다음 매트릭스에서 설명되어 있습니다:

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-MeetHUSKYANewAgentOptimizedforMulti-StepReasoning_4.png)

허스키는 언어 에이전트 분야에서 중요한 발전을 이룬 것으로, 복잡한 추론 작업에 대한 다재다능하고 오픈 소스의 솔루션을 제공합니다. 행동 생성과 실행을 전문가 모델과 결합하는 통합적인 방식은 다양한 도전에 효과적으로 대응할 수 있게 해줍니다. 다양한 평가에서 보여지는 허스키의 성능은 언어 에이전트가 복잡한 문제를 해결하는 방식을 재정의할 잠재력을 강조합니다.