---
title: "LLM Alignments Part 21 RLAIF"
description: ""
coverImage: "/assets/img/2024-06-19-LLMAlignmentsPart21RLAIF_0.png"
date: 2024-06-19 20:39
ogImage: 
  url: /assets/img/2024-06-19-LLMAlignmentsPart21RLAIF_0.png
tag: Tech
originalTitle: "LLM Alignments [Part 2.1: RLAIF]"
link: "https://medium.com/@yianyao1994/llm-alignments-part-2-1-rlaif-2f3ea0147522"
---


안녕하세요!

오늘의 주제는 조금 가벼울 수 있지만, 이미 RLHF에 대해 다뤘으니 이제 RLAIF에 대해 이야기해야 합니다. RLAIF이 점점 더 보편화되는 것이 중요하기 때문이죠.

![이미지](/assets/img/2024-06-19-LLMAlignmentsPart21RLAIF_0.png)

RLAIF의 개념은 간단합니다: RLHF의 "H" (Human)를 AI로 교체하는 것만을 의미합니다. 이 전환이 필요한 이유는 인간으로부터 데이터를 수집하는 것이 시간이 많이 소요되고 비용이 많이 들며 확장하기 어려울 수 있기 때문입니다.

<div class="content-ad"></div>

LLM 기반 에이전트의 효과가 입증되었으며, 사고 체인(Chain of thought, CoT)에서 사고 트리(Tree of thought, ToT), ReAct, Reflexion 및 기타 다양한 요소들까지, LLM을 강화 학습(Reinforcement Learning, RL), 검색 보강 생성(Retrieval-augmented generation, RAG) 또는 유사한 프레임워크에 통합함으로써 추론 성능을 크게 향상시킬 수 있다는 것이 명백해졌습니다.

이 논문에서 강조된 바에 따르면, 데이터 생성을 위해 AI를 사용하는 것은 회귀로 이어지지 않으며, 실제로 특정 작업에서 RLHF를 능가할 수도 있습니다.

다음은 위에서 설명한 RLHF와 RLAIF의 차이를 더 자세히 보여주는 다이어그램입니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-LLMAlignmentsPart21RLAIF_2.png)

LLM(라지앤 러닝 모델)을 사용한 에이전트의 관점에서 대안적인 접근 방식은 학습된 보상 모델(RM)을 입력으로 사용자의 선호도를 받아들이고 엔지니어링된 프롬프트와 에이전트 아키텍처를 통해 점수를 출력하는 에이전트로 대체하는 것입니다.

참고:
- RLHF로부터 학습된 RM은 종종 SFT 모델에서 증류된 학습을 통해 훈련되기 때문에 증류된 RM으로 언급됩니다.
- 에이전트 스타일의 RM은 훈련을 필요로 하지 않기 때문에 직접 RM으로 언급됩니다.


<div class="content-ad"></div>

오른쪽 표를 보면 직접 RM의 성능이 간접 RM의 성능과 일치한다는 것을 보여줍니다. 여기서 '동일 크기의 RLAIF'는 인공지능에 의해 생성된 교육 데이터가 RLHF에서 사용된 것과 동일한 크기인 간접 RM을 나타냅니다.

<img src="/assets/img/2024-06-19-LLMAlignmentsPart21RLAIF_3.png" />

마지막으로 RLHF와 RLAIF를 비교합니다. 요약 및 유용성 작업에서 성능이 일치하는 방법과 RLAIF가 무해성 측면에서 RLHF를 능가하는 것을 주목해주세요.

오늘은 여기까지입니다! 다음에는 DPO에 대해 이야기해볼 수 있겠네요~

<div class="content-ad"></div>

참고:

RLAIF: 인공지능 피드백을 활용한 인간 피드백으로 강화 학습 확장