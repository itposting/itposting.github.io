---
title: "어쩌면 GPT가 최상이 아닐 수도 있습니다 BERT가 생성 기반 컨텍스트 학습을 능숙하게 다룰 수 있습니다"
description: ""
coverImage: "/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_0.png"
date: 2024-06-19 03:50
ogImage: 
  url: /assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_0.png
tag: Tech
originalTitle: "Maybe GPT Isn’t the Best: BERTs Can Master Generative In-Context Learning"
link: "https://medium.com/gitconnected/maybe-gpt-isnt-the-best-berts-can-master-generative-in-context-learning-2d95bc8c8507"
---


## |LLM|GPT|컨텍스트 학습|

<img src="/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_0.png" />

트랜스포머가 발표되었을 때 기계 번역 분야에 혁명적인 영향을 미쳤습니다. 곧 이후에는 이 능력이 더 많은 작업으로 확장될 수 있다는 것이 깨달렸습니다. 실제로 트랜스포머는 많은 작업에 사용할 수 있는 언어 표현을 학습합니다.

이 기간 동안 트랜스포머를 위한 두 가지 특별한 학습 패러다임이 제시되었습니다:

<div class="content-ad"></div>

- 인과언어 모델링. 모델은 시퀀스에서 다음 토큰을 예측함으로써 학습합니다.
- 마스킹된 언어 모델. 모델은 가려진 토큰을 예측해야 합니다.

초기에는 BERT와 같은 모델이 다양한 작업에 융통성이 있어서 더 성공적이었습니다. 하지만 GPT3의 출시로 모든 것이 변했습니다.

GPT3는 문맥 내 학습이라는 새로운 기능을 보여줬기 때문입니다. 몇 가지 예시를 받아들여서, 모델은 작업 자체를 매핑하고 실행할 수 있었습니다. 이것이 프롬프트 엔지니어링을 폭발시키고 대형 언어 모델에 대한 관심을 불러일으키는 촉매였습니다. 미세 조정을 수행할 필요 없이 모델이 새 작업을 학습할 수 있었습니다.

![이미지](/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_1.png)

<div class="content-ad"></div>

In-context learning은 패러다임 변화와 커뮤니티 관심을 이끌었습니다. 이전에는 GPT-3 마스킹 모델이 가장 인기 있었지만, 이후 연구는 자기 회귀 모델로 전환되었습니다. 대부분의 연구가 이러한 유형의 모델에 집중되어 왔으며, 오늘날 대부분의 모델이 자기 회귀로 되어 있습니다.

더욱이, 이러한 모델들은 이 기사에서 제안된 것처럼 생성할 능력이 없다고 여겨집니다.

또한, 이러한 모델들은 생성이 불가능하다고 여겨지는 이 기사의 제안과 관련된 매우 중요한 두 가지 질문이 발생합니다.

최근에 발표된 기사에서 이 질문들에 정확하게 다루었습니다.

<div class="content-ad"></div>

이것이 MLM의 목적은 아니에요. 그러나 저자들은 별도의 훈련이나 세밀한 조정 없이 MLM을 사용하고 싶어해요. 그래서 그들은 두 가지 잠재적인 방법을 사용하기로 결정해요:

자기 회귀 LLM은 특별히 텍스트 생성을 학습하는 반면, MLM은 빈칸 채우기(마스크 토큰)를 학습해요. 저자들은 텍스트 프롬프트 옆에 [MASK] 토큰을 놓고 모델이 다음 토큰을 생성하도록 텍스트를 생성해요. 그 다음 [MASK] 토큰이 추가되고 그런 식으로 계속해요.

MLM은 조건부 로그 우도를 추정하지 않아요. 저자들은 추가적인 훈련을 피하기 위해 방정식을 수정하여 의사 로그 우도(PLL)를 얻어요. 이 접근법은 토큰 간의 강력한 지역 의존성이 있을 때 모델이 부정확하지 않도록 조정됐어요. 모델은 양방향 셀프 어텐션을 사용하기 때문에 지역 의존성에 민감해요.

<img src="/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_2.png" />

<div class="content-ad"></div>

그러나 이 두 가지 방법에는 특히 계산 비용 측면에서 제한 사항이 있지만, 저자들은 시스템 최적화에는 관심이 없다.

저자들은 DeBERTa (BERT의 파생물)를 사용했는데, 이 모델은 상대적인 위치 임베딩으로 훈련되었기 때문에 512 토큰을 넘어 확장될 수 있습니다. 그러나 저자들은 모델이 512보다 긴 컨텍스트 길이에 대해 일반화할 수 있는지 테스트했으며, 이를 통해 후속학습(few-shot 설정에 대한 테스트)에서 사용할 수 있도록 하였습니다. Needle in the Haystack(랜덤하게 생성된 6자리 숫자(바늘)가 긴 에세이 모음(쌀집)에 숨겨져 있고 모델이 그것을 찾아야 하는 테스트)에서 DeBERTa가 증가하는 크기의 시퀀스에서 바늘을 찾을 수 있는지 테스트했습니다. 관측 결과, DeBERTa는 512 토큰을 넘어 확장할 수 있고, 그 결과 특수한 학습 상황에서 사용할 수 있다는 것을 보여줍니다.

DeBERTa는 GPT3보다 훨씬 작고, 적은 토큰으로 훈련되었음에도 불구하고, 2020년에 출시되었습니다. 저자들은 두 모델을 생성 및 분류와 같은 동일 유형의 작업에서 비교하기로 결정했습니다.

<div class="content-ad"></div>

가장 흥미로운 결과 중 하나는 두 모델 모두 성능이 모델 크기와 비례한다는 것입니다(더 많은 매개변수는 더 나은 성능을 보여줍니다).

![image](/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_4.png)

또한, 둘 다 소수의 데이터로도 잘 작동하는 것을 확인할 수 있습니다(더 많은 예제가 두 모델을 도와줍니다).

![image](/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_5.png)

<div class="content-ad"></div>

자세한 분석 결과, DeBERTa는 제로샷 및 퓨샷 설정 모두에서 언어 이해 작업에 대해 GPT3보다 우수한 것으로 보입니다 (저자들은 인기 있는 기준인 SuperGLUE를 사용했습니다). 저자들은 GPT3의 유사 크기 버전 (1.4 B)과 DeBERTa를 비교하며 뚜렷한 차이를 발견했습니다. 또한:

![이미지](/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_6.png)

저자들은 또한 Winograd 스타일 및 텍스트 완성 작업에 대해 모델을 테스트했습니다. 이러한 작업은 상식적 추론, 언어 이해 및 복잡한 공용 참조 해상도가 필요한 더 복잡한 작업입니다. 예를 들어, 이야기에 대한 최적의 끝을 선택하거나 문장을 완성하는 것 등이 있습니다. 다시 한번, 가령 가리워진 언어 모델의 승리가 관찰되는 것으로 보입니다. 또 다른 흥미로운 점은 스케일링 비율이 더 높다는 것입니다: 매개변수를 증가시킴으로써 MLM의 성능이 더욱 빠르게 증가하는 것으로 보입니다.

저자들은 또한 두 모델을 번역 작업에 대해 테스트했습니다. 번역 작업은 모델이 다른 언어에 능숙해야 하며, 여전히 훈련 데이터의 구성에 의존합니다. 이 경우, GPT3가 명백하게 우승자로 나타났으며, DeBERTa는 성능이 떨어지는 것으로 보입니다. 그러나 DeBERTa는 단일 언어 말뭉치만으로 훈련되었으므로 명확하게 불리한 시작을 합니다.

<div class="content-ad"></div>

![2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_7](/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_7.png)

이 두 모델은 클로즈드 북 질문에 대한 답변 및 상식적 추론에 대해 테스트되었습니다. 실제로 이 모델들은 고유의 지식을 보유하고 있으며, 그들의 매개변수에서 많은 정보를 저장할 수 있습니다. 또한, 오늘날의 LLM이 정보를 다시 찾아내는 능력이 중요한 측면입니다.

또한, 오늘날 우리는 LLM이 일반적인 추론 능력을 조금은 갖고 있다고 기대합니다. 그래서 두 모델은 트리비아(온라인 퀴즈 데이터 세트), 실제 세계 이해를 테스트하기 위한 물리적 상호 작용 데이터 세트, 그리고 학년별 과학 문제를 테스트하기 위한 데이터 세트에서 테스트되었습니다.

DeBERTa의 답변은 GPT3보다 상당히 나쁩니다. 저자들은 이는 모델의 교육과 구조에서 비롯된 것이라고 생각합니다:

<div class="content-ad"></div>

모델은 지식 면에서 빛을 발하지는 않지만 상식적 추론 능력과 행동 척도에서는 GPT3와 비슷하게 잘 수행하는 것으로 보입니다.

![이미지](/assets/img/2024-06-19-MaybeGPTIsnttheBestBERTsCanMasterGenerativeIn-ContextLearning_8.png)

관심이 있는 분들을 위해 저자들은 해당 모델을 HuggingFace에서 공개했습니다.

이 기사에서 저자들은 두 가지 핵심 포인트를 보여줍니다: MLMs도 콘텍스트 학습이 가능하며, 이러한 스킬들은 스케일을 키울수록 향상됩니다.

<div class="content-ad"></div>

GPT3가 발표된 이후, 이러한 모델들이 오래되었고 인텍스트 학습이 불가능하다고 생각되었습니다. 이는 생성 작업에 사용할 수 없다는 것을 의미하며, 따라서 모든 현대적인 응용 프로그램에도 해당되지 않는다는 것을 의미합니다. 대신, 저자들은 BERT와 유사한 모델들이 비슷한 수준으로 능력을 갖추고 있음을 보여줍니다. 저자들의 데이터에 따르면, 동일한 규모의 DeBERTa가 언어 이해 작업에서 우월하다는 것을 나타낸다. 이는 상당히 강한 주장이며, 이것이 사실인지 아닌지 이해하기 위해 더 많은 실험이 필요합니다. 저자들이 원인 연구를 수행하지 않은 것은 유감스럽지만, 이러한 작업과 관련된 양방향 주의의 역할을 이해하는 것이 흥미로울 것입니다.

매개 변수 수에 따라 능력이 확장되는 사실은 중요한 사실입니다. 10B 이상으로 LLM을 확장하는 이유 중 하나는 바로 신생 속성의 존재 때문입니다.

이러한 신생 속성이 존재하는지 여부는 또 다른 문제입니다. 최근에는 확장 법칙 자체가 다소 의문이 제기되었습니다. 그러나 모델의 성능이 매개 변수 수, 훈련 데이터 차원 및 컴퓨팅 예산과 비례하여 증가하는 것이 원하는 동작이라는 사실은 여전히 유지됩니다.

어쨌든, 이 작업은 매우 흥미로운데, 데이터가 BERT와 유사한 모델이 인텍스트 학습자일 수 있는 능력을 갖춘다는 것을 보여주고 있습니다. 우리는 어떤 학습 모드가 다른 것보다 어떤 이점을 가지는지 자세히 검토해야 합니다. 미래에는 새로운 모델이 혼합 모드로 훈련되거나 다른 방식을 찾아 그들의 이점을 결합하는 대안을 찾을 수 있을 것입니다.

<div class="content-ad"></div>

## 이에 대해 어떻게 생각하십니까? GPT와 유사한 LLM 지배력을 다시 평가해야 할 필요가 있다고 생각하십니까? 댓글로 알려주세요!

# 이 내용이 흥미로우셨다면:

제 다른 기사들을 찾아보거나 LinkedIn에서 저와 연락하실 수도 있습니다. 주간 업데이트되는 머신러닝 및 인공지능 뉴스가 포함된 이 저장소를 확인해보세요. 저는 협업과 프로젝트에 열려 있으며 LinkedIn을 통해 저에게 연락하실 수 있습니다. 또한 새로운 이야기를 게시할 때 알림을 받으려면 무료로 구독할 수 있습니다. 

제 GitHub 저장소 링크는 여기에서 확인하실 수 있습니다. 머신러닝, 인공지능 및 그 외 다른 자원과 관련된 코드 및 여러 자료를 수집하고 있는 곳입니다.

<div class="content-ad"></div>

혹은 제 최근 글 중 하나에 관심 있을지도 모릅니다:

# 참고 자료

이 글을 작성하는 데 참고한 주요 참고 자료 목록입니다. 각 논문에 대해 첫 번째 저자의 이름만 인용되었습니다.

- Radford, Improving Language Understanding by Generative Pre-Training, 링크
- Devlin, 2019, BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding, 링크
- Brown, 2020, Language Models are Few-Shot Learners, 링크
- Tay, 2023, UL2: Unifying Language Learning Paradigms, 링크
- Samuel, 2024, BERTs are Generative In-Context Learners, 링크