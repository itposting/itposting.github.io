---
title: "언어 모델 보정 기법 확률 평가 향상하기"
description: ""
coverImage: "/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_0.png"
date: 2024-06-20 18:26
ogImage: 
  url: /assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_0.png
tag: Tech
originalTitle: "Calibration Techniques for Language Models: Enhancing Probability Assessments"
link: "https://medium.com/generative-ai/calibration-techniques-for-language-models-enhancing-probability-assessments-8100b757979a"
---



![Calibration Techniques for Language Models](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_0.png)

언어 모델, 특히 대형 언어 모델(LLMs)은 인간과 유사한 언어를 이해하고 생성하는 능력으로 인공지능 분야를 혁신했습니다. 이러한 모델은 제로샷 설정에서 다양한 작업을 수행할 뿐만 아니라 맞춤식 프롬프트를 통해 놀라운 유연성과 다양성을 바탕으로 여러 도메인에서 탁월하게 유용합니다.

그러나 그들의 효과적인 성능에도 불구하고, 이 모델들의 교정(calibration)은 종종 도전이 되는 핵심적인 측면 중 하나입니다 — 즉, 다양한 결과에 대한 확률이 그 결과가 정확할 가능성을 정확히 반영하는지 보장하는 것입니다.

본 문서에서는 LLMs의 교정이 필요한 이유를 탐구하고, 그들의 확률 평가를 둘러싼 핵심 문제를 식별하며, 더 나은 모델 교정을 위한 현대적인 방법을 탐구합니다.


<div class="content-ad"></div>

## LLM 모델에서 교정이 왜 중요한 이유

LLM의 본질은 정확성뿐만 아니라 올바른 신뢰 수준이 할당된 언어 기반 출력을 처리하고 생성하는 데 있습니다. 교정 — 즉 모델의 신뢰 수준을 정확성과 일치시키는 과정 — 는 다음과 같은 이유로 필수적입니다:

- 신뢰할 수 있는 AI 의사 결정: 적절히 교정된 신뢰 점수는 사용자들이 AI가 내리는 결정을 믿고 의지할 수 있게 하며, 모델이 올바르거나 잘못될 가능성을 이해할 수 있게 합니다.

- 위험 관리: 의료 진단이나 자율 주행과 같은 안전 중요 응용 프로그램에서 자신감이 넘치지만 부정확한 예측은 재앙적 결과로 이어질 수 있습니다.

<div class="content-ad"></div>

- 모델 디버깅 및 개선: 보정은 개발자가 모델의 약점을 이해하고 이에 맞게 개선하는 데 도움이 될 수 있습니다.

## LLM 확률 보정에서의 어려움

대형 언어 모델은 종종 확률 보정에 영향을 미치는 여러 가지 어려움에 직면합니다:

- 닫힌 모델 제한: 많은 대형 언어 모델은 로그 확률에 직접 접근할 수 있는 제한된 액세스를 가진 블랙 박스로 작동하여 확신도를 이해하고 조정하는 프로세스를 복잡하게 만듭니다.

<div class="content-ad"></div>

- 훈련 중의 불일치: Reinforcement Learning from Human Feedback (RLHF)와 같은 기술로 개선된 모델들은 어설프게 miscalibrated 될 수 있습니다. 논문 [1]에 따르면 가장 널리 사용되는 LLM들은 인간 피드백으로 강화학습된 모델들입니다 (RLHF-LLMs). 일부 연구에서는 RLHF-LLMs가 매우 잘 보정되지 않은 조건부 확률을 생성한다고 제안했습니다. 연구 결과는 RLHF-LLMs가 사용자 선호도에 근접하게 따라가기를 우선시하는 경향이 있어 잘 보정된 예측 생성보다는 낮은 보정을 낸다는 것을 보여줍니다. 이는 RLHF로 훈련된 모델들이 정확하고 신뢰할 수 있는 출력을 위해 필요한 확률 보정을 갖추지 못할 수 있는 주요 도전을 보여줍니다.

- 작업별 보정 필요성: LLM의 일반적인 훈련은 일반적으로 특정 작업이나 도메인에 대해 조정되지 않았기 때문에, 특정 요구사항이나 응용 프로그램과 조율되도록 하기 위해 추가적인 보정이 필요합니다.

## LLMs를 위한 고급 보정 방법

보정 도전에 대응하기 위해 아래에서 논의된 여러 기술을 시도해볼 수 있습니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_1.png)

## Verbalized Confidence

“Verbalized Confidence” refers to techniques where a Language Model (LLM) not only provides answers but also rates its confidence in its response explicitly. This approach involves the use of certain methodologies to obtain more reliable assessments of the model’s confidence in its answers.

## Basic Implementation


<div class="content-ad"></div>

가장 간단한 형태로 표현된 신뢰 표현은 LLM에게 질문과 관련 있는 맥락을 제시한 후 명시적으로 신뢰 점수를 요청하는 것입니다. 이 직접적인 접근은 더 정교한 기술의 기반 역할을 합니다.

## 향상된 신뢰 표현 기술

- Chain-of-Thought (CoT) Prompting: CoT Prompting은 답변을 제공하기 전에 모델로부터 단계별 추론 과정을 유도하는 것을 포함합니다. 이 방법은 모델의 답변의 명확성과 풍부성을 향상시킬 뿐만 아니라 추론 단계에서 논리적 일관성을 관찰하여 신뢰 수준을 더 정확히 추정할 수 있습니다.
- 다단계 신뢰 유도: 이 기술은 추론 또는 문제 해결 과정의 여러 단계에서 신뢰 점수를 캡처하여 신뢰 측정을 개선합니다. 최종 신뢰 수준은 개별 신뢰 점수의 곱으로 파생되어 확신의 합성 측정 값을 제공합니다.
- 상위-K 답변 및 신뢰 점수: 하나의 답변 대신 모델이 여러 가능한 답변(상위-K 답변)을 생성하며 각각 개별적인 신뢰 점수와 함께 제시됩니다. 가장 높은 신뢰 점수를 가진 답변이 최종 답변으로 선택됩니다. 이 방법은 여러 가설을 평가하는 의사 결정 과정과 유사합니다.
- 다양한 유도 기법: 여러 다양한 유도를 활용하면 신뢰 추정이 더 정확해질 수 있습니다. 다양한 유도는 서로 다른 어구, 맥락 또는 개념 각도에서 비롯될 수 있으며, 이는 모델의 평가를 편향된 또는 정보 부족으로부터 더 견고하게 만들어줍니다.
- 숫자적 확률 대 언어 표현: 경우에 따라 모델이 정확성 가능성에 직접 연결된 숫자적 확률을 통해 자신의 신뢰를 표현합니다. 반대로, "매우 가능성이 높음" 또는 "아마도 아님"과 같은 언어적 표현도 사용될 수 있습니다.
- 여러 가설과 함께 유도: 처음에 모델은 신뢰 등급 없이 여러 답변 후보를 생성합니다. 이후 상호 작용에서 각 답변의 정답 가능성을 평가합니다. 연구 결과는 이 방식으로 여러 가설을 평가하는 것이 극적으로 보정된다는 것을 나타냅니다.

<img src="/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_2.png" />

<div class="content-ad"></div>

모델 간에 자신감을 효과적으로 표현하는 능력은 다양하며, 서로 다른 모델 아키텍처와 세대 간에 관찰되는 차이점이 있습니다.

## 자기 일관성 기반 신뢰도

자기 일관성 기반 신뢰도 방법은 동일한 쿼리에 대해 여러 응답을 생성하고 이러한 응답 사이의 일치를 분석함으로써 언어 모델의 신뢰도를 평가하는 복잡한 방법입니다. 이 기술은 다양한 조건에서 높은 일치가 나타날수록 응답의 정확도에 대한 높은 신뢰를 나타낸다는 아이디어에 기반합니다.

여러 응답 생성하기

<div class="content-ad"></div>

모델로부터 다양한 결과 스펙트럼을 얻기 위해 몇 가지 전략을 사용합니다:

셀프-랜덤화: 이 방법은 동일한 질문을 다른 설정에서 여러 번 입력하는 것을 포함합니다. "온도" 매개변수를 조절하는 것이 일반적이며, 이는 모델의 응답 다양성을 다루기 위해 출력의 예측성 또는 랜덤성을 변화시킴으로써 작동합니다.

프롬프트 왜곡: 질문의 요구사항을 다르게 해석할 수 있도록 문구를 변경하여 다양한 각도의 응답을 유도합니다. 이를 통해 모델의 강건성을 테스트하며, 문맥상 유사한 프롬프트지만 다르게 표현된 질문 사이에서 일관성을 유지하는지 확인합니다.

잘못된 단서: 의도적인 오류나 오해를 유발하는 힌트를 프롬프트에 삽입하여 모델의 안정성을 평가합니다. 사람의 테스트와 유사하게, 이 방법은 모델이 자신감 있는 사람처럼 오해된 정보를 무시하고 정확하거나 일관된 응답을 유지할 수 있는지를 관찰합니다.

<div class="content-ad"></div>

집계 전략

결과를 종합하고 최종 신뢰 점수를 할당하기 위해 다양한 집계 전략을 고려할 수 있습니다:

일관성 측정: 이는 모델이 다양한 조건에서 동일한 응답을 제공하는 정도를 검토하여 안정성과 신뢰성을 반영합니다.

평균 신뢰도 (평균-신뢰도): 높은 일치도와 개별 신뢰 점수가 높은 답변에 더 많은 가중치를 부여하여 전반적인 신뢰도의 세밀한 측정을 제공하는 가중 평균이 계산됩니다.

<div class="content-ad"></div>

쌍-순위 전략: 모델의 상위-K 예측을 사용하는 시나리오에서 특히 유용한 이 전략은 모델 예측에서 순위 정보를 강조하여 가장 가능성이 높고 일관된 응답을 평가하는 데 도움이 됩니다.

## 로짓 기반 접근 방식

로짓 기반 캘리브레이션은 대형 언어 모델(Large Language Models, LLMs)이 하는 확률적 예측의 신뢰성을 향상시키는 중요한 기술입니다. 모델이 로그 확률과 같은 원시 점수를 출력할 때, 일반적으로 이러한 점수는 직접적으로 정확한 확률 분포로 변환되지 않습니다. 캘리브레이션 기술은 이러한 로짓을 조정하여 더 정확한 확률을 반영하며, 이것은 실제 응용 프로그램에서 강력한 의사 결정을 내리는 데 중요합니다. 아래에서는 로짓 기반 캘리브레이션에 사용되는 일부 방법에 대해 자세히 살펴봅니다:

1. 토큰 간의 확신을 평균화하기

<div class="content-ad"></div>

언어 모델의 예측에 대한 확신을 더 균일하게 추정하기 위한 일반적인 방법 중 하나는 토큰 간의 확신(로그 확률)을 평균화하는 것입니다. 이는 특정 응용 프로그램이나 데이터셋의 특성에 따라 모든 토큰 또는 선택적 하위 집합에 대해 수행될 수 있습니다. 결과는 모델의 확신에 대한 더 부드럽고 일반화된 측정으로, 어떤 단일 토큰의 변동성이 미치는 영향을 줄입니다.

2. Platt 스케일링 (시그모이드)

Platt 스케일링 또는 시그모이드 보정은 원래 모델의 출력 로짓에 적용되는 로지스틱 회귀 모델입니다. 로짓 위에 시그모이드 함수를 피팅함으로써이 방법은 로짓을 보정된 확률로 변환합니다. 보정에는 일반적으로 'A'와 'B'로 표시되는 두 매개변수를 학습하는 과정이 포함됩니다. 이 매개변수는 로짓을 실제 관측된 확률과 보다 잘 일치시키기 위해 스케일링 및 이동시킵니다. 이 방법은 이진 분류 작업에 대한 단순성과 효과적임으로 인해 특히 유용합니다.

![그림](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_3.png)

<div class="content-ad"></div>

3. 등위 회귀

Platt 스케일링과는 다르게, 등위 회귀는 로짓과 확률 사이에 어떤 기능적 형태도 가정하지 않습니다. 이는 예측된 확률을 대상 확률과 일치시키기 위해 비감소 함수를 적합시키는 비모수적 접근 방식입니다. 이 조각별 상수 함수는 유연하며 로짓과 확률 사이의 관계가 더 복잡하거나 비선형적인 경우, 특히 일부 시나리오에서 실제 분포를 더 정확하게 반영할 수 있습니다.

![image](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_4.png)

4. 온도 조정

<div class="content-ad"></div>

온도 조정은 모델의 확신을 조정하는 사후 처리 기술로, 예측을 변경하지 않고 조절합니다. 소프트맥스 함수를 적용하기 전에 상수인 "온도"로 로짓을 나누는 방식으로 확률로 변환합니다. 최적의 온도는 보통 검증 데이터셋에서 교차 엔트로피 손실을 최소화하여 결정됩니다. 이 방법은 원래 로짓의 상대적 순서를 유지하면서 보정 프로세스에 미세한 영향을 미치므로 매력적입니다.

# 대리 모델 또는 세부 조정 방법

세부 조정은 특정 데이터와 목표를 사용하여 모델을 미세 조정하여 특정 작업에 보다 나은 준비를 시키는 고급 보정 접근 방식입니다. 더 신뢰할 수 있고 정확한 신뢰 점수를 제공하기 위해 모델을 미세 조정하는 여러 혁신적인 방법을 살펴보겠습니다.

## 대리 모델을 활용한 신뢰 평가

<div class="content-ad"></div>

한 가지 매력적인 방법은[2] 일반적으로 더 단순한 모델을 사용하여 주요 모델 (예: GPT-4)로부터 얻은 답변이 얼마나 믿을 만한지를 평가하는 것입니다:

- 하는 일: 예를 들어, LLAMA2와 같은 보조 모델은 다른 모델인 GPT-4가 제공하는 답변의 대한 로그 확률을 얻기위해 동일한 프롬프트를 제공하고 GPT-4 모델 응답에 대한 점수를 추출할 때 사용될 수 있습니다.

- 놀라운 효과성: 비록 보조 모델이 덜 강력할 수 있지만, 이 방법은 언어적 단서만 사용하는 것과 비교하여 더 나은 결과를 낳는 것으로 입증되었습니다(Area Under the Curve 또는 AUC를 기준으로 측정).

## 불확실성 인식: R 튜닝

<div class="content-ad"></div>

R-튜닝은 모델이 "모르겠다"라고 말해도 괜찮다는 것을 가르칩니다. 모델의 한계를 인식합니다. 파인튜닝 프로세스는 다음 단계로 구성됩니다.

- 불확실성 식별: 모델의 답변이 흔들리거나 의문스러운 경우를 찾아내어 예측하고 실제 결과와 비교하여 학습 세트에서 찾습니다.

- 확실히 훈련: 그런 다음 "확실함" 또는 "불확실함"으로 태그된 예제를 사용하여 모델을 가르치어 이러한 구별에서 배우도록 합니다. "확실하다" 또는 "의심스럽다"와 같은 구문을 사용하여 훈련 중에 자신감 수준을 표현하며, 토큰 생성부터 오류를 줄이는 데 집중합니다.

![이미지](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_5.png)

<div class="content-ad"></div>

## LITCAB: 작은 변화, 큰 영향

LITCAB은 작지만 효과적인 보정 레이어를 소개합니다:

- 간단한 추가: 모델 끝에 단일 선형 레이어를 추가하여 입력 텍스트에 따라 각 응답의 예측 확률을 조정합니다.

- 효율적이고 효과적: 이 소규모 조정은 복잡성을 크게 늘리지 않고 모델의 판단력을 향상시킵니다. 원래 모델 크기 변화의 2% 미만만 변경됩니다.

<div class="content-ad"></div>

## ASPIRE: 더 스마트한 모델 응답

예측에 신뢰 점수를 할당하고 선택적 예측을 허용합니다. ASPIRE는 세 가지 단계로 구성됩니다:

1. 작업별 튜닝: PEFT 기술을 사용하여 주요 모델을 변경하지 않으면서 특정 변환 가능한 매개변수를 수정하여 특정 작업에 대한 응답을 개선합니다.

2. 답변 샘플링: 이러한 조정을 사용하여 각 질문에 대해 여러 잠재적인 답변을 생성하고 높은 가능성의 출력 시퀀스를 만들기 위해 빔 검색을 사용하며 생성된 출력 시퀀스가 참 값에 기반하여 올바른지 여부를 결정하기 위해 Rouge-L 메트릭을 사용합니다.

<div class="content-ad"></div>

3. 자가평가 학습: 마지막으로, 모델이 자체적으로 답변이 맞거나 틀렸는지 판단하여 자체평가 능력을 향상시키는 다른 조절 세트를 소개합니다.

![이미지](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_6.png)

이러한 방법을 통해 언어 모델은 더 발전된 것뿐만 아니라 사용자의 맥락과 기대에 더 부합하게 되어, 더 신뢰성이 있고 문맥을 인식하는 상호작용을 이끌어냅니다.

## 결론

<div class="content-ad"></div>

대규모 언어 모델의 보정은 복잡하지만 중요한 작업으로, AI 응용 프로그램의 신뢰성과 안전성을 향상시킵니다. 위에서 논의한 다양한 혁신적인 방법을 사용하고 결합함으로써, 이러한 모델이 다양한 맥락에서 이해하고 상호 작용하는 방식을 혁신적으로 개선할 수 있습니다. 이는 높은 자신감과 정확성으로 결정을 내릴 수 있는 진정으로 지능적인 시스템을 위한 길을 열어줍니다.

## 부록:

- Katherine Tian, Eric Mitchell, Allan Zhou, Archit Sharma, Rafael Rafailov, Huaxiu Yao, Chelsea Finn, 그리고 Christopher D. Manning이 제목을 붙인 “Just Ask for Calibration: Strategies for Eliciting Calibrated Confidence Scores from Language Models Fine-Tuned with Human Feedback,”
- Llamas Know What GPTs Don’t Show: Surrogate Models for Confidence Estimation, Vaishnavi Shrivastava, Percy Liang, Ananya Kumar
- R-Tuning: Instructing Large Language Models to Say ‘I Don’t Know’ Hanning Zhang♠∗, Shizhe Diao♠∗ 및 기타.
- LITCAB: LIGHTWEIGHT LANGUAGE MODEL CALIBRATION OVER SHORT- AND LONG-FORM RESPONSES Xin Liu, Muhammad Khalifa, Lu Wang
- Strength in Numbers: Estimating Confidence of Large Language Models by Prompt Agreement Gwenyth Portillo Wightman, Alexandra DeLucia 및 Mark Dredze
- CAN LLMS EXPRESS THEIR UNCERTAINTY? AN EMPIRICAL EVALUATION OF CONFIDENCE ELICITATION IN LLMS Miao Xiong1∗, Zhiyuan Hu1, Xinyang Lu 및 기타.
- ASPIRE 소개: LLMs에서 선택적 예측을 위한
- Think Twice Before Assure: Confidence Estimation for Large Language Models through Reflection on Multiple Answers Moxin Li1, Wenjie Wang 및 기타.
- 대규모 언어 모델로부터의 장문 생성 보정
Yukun Huang1, Yixin Liu 및 기타.

![이미지](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_7.png)

<div class="content-ad"></div>

이 이야기는 Generative AI Publication에서 발행되었습니다.

최신 AI 이야기를 따르려면 Substack, LinkedIn 및 Zeniteq에서 저희와 연락을 유지하세요. 함께 AI의 미래를 함께 만들어 보아요!

![이미지](/assets/img/2024-06-20-CalibrationTechniquesforLanguageModelsEnhancingProbabilityAssessments_8.png)