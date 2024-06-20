---
title: "Google의 프루프리드 한 번의 탭으로 작성 정확도를 높이는 AI-driven 기능"
description: ""
coverImage: "/assets/img/2024-06-20-GooglesProofreadAI-DrivenTypingAccuracyinOneTap_0.png"
date: 2024-06-20 18:13
ogImage: 
  url: /assets/img/2024-06-20-GooglesProofreadAI-DrivenTypingAccuracyinOneTap_0.png
tag: Tech
originalTitle: "Google’s Proofread: AI-Driven Typing Accuracy in One Tap"
link: "https://medium.com/syncedreview/googles-proofread-ai-driven-typing-accuracy-in-one-tap-1fe7451a2b4c"
---



![Gboard](/assets/img/2024-06-20-GooglesProofreadAI-DrivenTypingAccuracyinOneTap_0.png)

Gboard은 모바일 기기용 Google 키보드로, 통계 디코딩을 활용하여 부드러운 타자 경험을 제공합니다. 자동 및 수동 오류 수정 기능을 갖추고 있어 사용자 친화적 상호 작용을 보장합니다. 대형 언어 모델 (LLMs)의 놀라운 능력을 활용하여 Gboard는 문장 및 단락 수준의 수정을 향상시켜 타자 경험을 혁신합니다.

Google 연구팀이 제시한 새 논문 'Proofread: Fixes All Errors with One Tap'에서 Proofread를 소개합니다. Proofread는 서버 측 LLM을 기반으로 한 혁신적인 Gboard 기능으로서, 한 번의 탭으로 실시간으로 문장 및 단락을 수정할 수 있습니다. Pixel 8 장치에서 시작된 이 기능은 매일 수천 명의 사용자에게 혜택을 줍니다.

![Proofread](/assets/img/2024-06-20-GooglesProofreadAI-DrivenTypingAccuracyinOneTap_1.png)


<div class="content-ad"></div>

시스템은 데이터 생성, 메트릭 디자인, 모델 튜닝 및 모델 서빙으로 구성돼 있어요.

![이미지](/assets/img/2024-06-20-GooglesProofreadAI-DrivenTypingAccuracyinOneTap_2.png)

데이터 생성에 대해선, 정교한 오류 합성 프레임워크가 일반적인 키보드 오류를 통합하여 데이터셋을 생성하며, 사용자 입력을 모방합니다. 추가적인 단계에서 데이터 분포가 Gboard 도메인과 밀접하게 일치하도록 보장돼요.

![이미지](/assets/img/2024-06-20-GooglesProofreadAI-DrivenTypingAccuracyinOneTap_3.png)

<div class="content-ad"></div>

메트릭스 설계에 대해: 다양한 관점에서 모델을 평가하기 위해 여러 메트릭스가 설계되었습니다. 긴 텍스트의 가능한 정답의 다양성을 고려하여, 주요 메트릭스에는 LLMs에 기반한 문법 오류와 의미적 일관성을 확인하는 사항이 포함되어 있습니다.

모델 튜닝에 대해: InstructGPT에서 영감을 받아, 모델은 지도된 세밀 조정을 거친 후 보상 학습(RL) 튜닝을 진행합니다. RL 튜닝 단계에서 Global Reward 및 Direct Reward 기법을 활용하여 모델의 성능을 크게 향상시킵니다. 결과는 RL 튜닝이 문법 오류를 줄이는 데 효과적이며, PaLM2-XS 모델의 Bad 비율을 5.74% 감소시켰음을 보여줍니다.

모델 서빙에 대해: 모델은 구름의 TPU v5에 배포되며 양자화, 버킷팅, 입력 분할 및 예측적 디코딩을 통해 최적화된 대기 시간을 달성합니다. 예측적 디코딩만으로 중앙값 대기 시간이 39.4% 감소합니다.

<div class="content-ad"></div>

이 작업은 LLMs(Large Language Models)의 상당한 잠재력을 보여 주며, 고품질의 문장 및 단락 교정을 통해 타자 경험을 향상시킬 수 있다는 것을 보여줍니다. LLMs의 변화력을 강조하며 사용자 입력 상호작용에서의 LLMs의 변화력을 강조하며, 디바이스와의 상호 작용 방법을 근본적으로 개선할 것을 제안합니다.

논문 Proofread: Fixes All Errors with One Tap은 arXiv에 게시되어 있습니다.

저자: Hecate He | 편집자: Chain Zhang