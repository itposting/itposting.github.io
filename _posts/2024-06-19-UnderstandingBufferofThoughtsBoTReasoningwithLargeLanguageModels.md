---
title: "대화 형식으로 친근한 말투로 번역하면 다음과 같습니다 커다란 언어 모델을 사용한 사고 체계인 Buffer of ThoughtsBoT 이해하기"
description: ""
coverImage: "/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_0.png"
date: 2024-06-19 19:48
ogImage: 
  url: /assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_0.png
tag: Tech
originalTitle: "Understanding Buffer of Thoughts (BoT) — Reasoning with Large Language Models"
link: "https://medium.com/towards-data-science/understanding-buffer-of-thoughts-bot-reasoning-with-large-language-models-391919d2f76f"
---


![사진1](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_0.png)

복잡한 추론 작업에서의 능숙성 향상 및 환각 방지는 대규모 언어 모델(LLMs)의 주요 연구 주제입니다. 노력에도 불구하고, LLMs는 일반화된 추론 능력을 향상시키는 데 도움이 필요합니다. Chain-of-Thought (CoT)나 Tree-of-Thought (ToT)와 같은 전통적인 방법은 종종 다수의 가정이나 번갈아가며 진행되는 프롬프팅을 필요로 하기 때문에 계산이 많이 필요합니다.

![사진2](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_1.png)

논문에서 제안된 새로운 방법인 "Buffer of Thoughts: Thought-Augmented Reasoning with Large Language Models" [1]은 이러한 제한 사항을 대응하기 위해 high-level thought templates의 동적이고 적응형 저장소인 meta-buffer를 활용합니다. BoT에서 사용자가 새로운 문제를 제시하면 먼저 문제가 단순화되고 분석되어 핵심 요소가 추출되며, 이후 동적 데이터셋에서 관련된 thought template을 검색하는데 이를 이용합니다. 이를 통해 수정된 복잡한 추론 패턴을 통해 적응적이고 효율적인 문제 해결이 가능해집니다. 원문에 따르면 이 방법은 "Llama3–8B+BoT가 Llama3–70B 모델을 능가할 잠재력이 있다"고 합니다.

<div class="content-ad"></div>

BoT은 템플릿과 유사한 문제들 간에 효율적인 추론을 이룹니다:

- (1) 새로운 도전에 이전 솔루션을 활용하며,
- (2) 쿼리 반복을 제거하여 효율성을 증가시킵니다 (우리가 그래프-오브-쏘츠(GoT)나 ToT에서 볼 수 있듯이), 그리고
- (3) 새로운 작업을 만나면 템플릿 저장소를 동적으로 업데이트하여 진화할 수 있도록 합니다.

이 글에서는 먼저 BoT의 작동 방식의 일반적인 개요를 살펴본 후, 각 주요 요소의 기능을 이해하고 예시를 통해 절차를 테스트해보겠습니다.

# BoT는 어떻게 작동하나요?

<div class="content-ad"></div>

일반적인 사고 증강 추론 과정(아래 그림 참조)은 문제 증류로 시작됩니다. 이 단계에서는 들어오는 작업을 분석하여 중요한 요소와 제약 조건으로 요약하고 간소화된 문제 설명을 만듭니다.

이 요약된 정보는 그런 다음 메타 버퍼를 쿼리하는 데 사용됩니다. 이 메타 버퍼는 고수준 사고 템플릿을 포함하는 동적 저장소입니다. 사고 템플릿 중에서 증류된 문제와 가장 유사한 것을 검색합니다. 그런 다음 인스턴스화 프로세스 중에 특정 요구 사항 및 증류된 문제에 대한 정보와 함께 인스턴스화됩니다.

이 과정 동안 버퍼 매니저는 메타 버퍼를 적극적으로 모니터링합니다. 메타 버퍼에 포함되지 않은 새로운 통찰력을 감지하면 버퍼 매니저가 업데이트하여 사고 템플릿 저장소가 지속적으로 발전하도록 합니다.

![이미지](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_2.png)

<div class="content-ad"></div>

이러한 주요 부분들을 자세히 살펴봅시다:

## 문제 축약기

문제 축약기는 입력 작업에 대한 전처리로 볼 수 있습니다. 이를 통해…

- (1) 문제의 필수적인 정보를 추출하고
- (2) 복잡한 작업을 단순화하여 사고 템플릿을 더 쉽게 검색하고 검색할 수 있게 합니다.

<div class="content-ad"></div>

문제 디스틸러는 LLM에게 문제의 중요 정보와 제약 조건을 식별하고 추출하는 부담을 덜어줍니다. 이 작업은 메타 프롬프트 ϕ를 통해 수행됩니다.

작성자가 사용하는 프롬프트는 다음과 같은 과제에 대한 핵심 정보를 증류하는 데 사용됩니다:

```js
[Problem Distiller]:
정보 증류에서 뛰어난 전문가로, 사용자 입력 쿼리로부터 문제를 해결하기 위해 필요한 핵심 정보를 효과적으로 추출하는 당신은
해당 문제 유형에 기반하여 추출된 정보를 적절한 형식으로 변환합니다.
사용자의 입력 쿼리로부터 문제를 해결하기 위해 필요한 중요 정보를 분류하고 추출하십시오. 증류된 정보에는 다음이 포함되어야 합니다.
1. 핵심 정보:
사용자 입력으로부터 추출된 주요 변수의 값 및 정보, 문제 해결 전문가에게 전달될 것입니다. 문제를 해결하는 데 필요한 모든 중요 정보를 제공합니다.
2. 제약 조건:
문제의 목적 및 해당 제약 조건.
3. 증류된 작업:
1과 2를 기반으로 문제를 확장하고, 사용자 쿼리에 대응하고 더 많은 입력 및 출력 변형을 처리할 수 있는 메타 문제를 요약합니다. 확장된 문제에 실제 세계 시나리오와 초기 문제의 주요 변수 및 정보 제약 조건을 통합하여 주요 변수를 제한한 후 사용자 쿼리 입력의 핵심 정보를 입력으로 사용하여 문제를 해결하는 예시를 제시하십시오.
```

<div class="content-ad"></div>

## 메타 버퍼

메타 버퍼는 고수준 사고 템플릿을 저장하는 중앙 데이터베이스입니다. 이러한 템플릿들은 다양한 문제 해결 프로세스를 나타내는 고수준 추상화입니다. LLM은 과거 문제와 통찰을 활용하여 현재의 도전 과제를 해결할 수 있습니다. 가장 좋은 점은 메타 버퍼가 동적으로 업데이트되어 새로운 보이지 않는 문제도 포함되도록 하는 것입니다. 메타 버퍼는 특정 지침을 따르도록 사고 템플릿을 강요하지는 않습니다.

템플릿 검색: 작업이 단순화되면, BoT가 사고 템플릿을 확인하고 작업과 가장 유사한 것을 선택합니다. 이는 작업과 사고 템플릿 간의 내포 유사성을 계산하여 수행됩니다.

![이미지](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_4.png)

<div class="content-ad"></div>

리트리버는 입력 작업의 임베딩 f(xd)와 템플릿의 임베딩 f(DTi) 사이의 유사성을 계산합니다. 이 작업은 유사성이 일정 임계값 δ(0.5~0.7)를 초과할 때만 수행됩니다. 생각 템플릿 중 어느 것도 해당 작업과의 유사성 점수가 δ 임계값을 초과하지 않으면 xd를 새로운 작업으로 식별합니다. 작업이 새로운지 여부에 따라 두 가지 경로 중 하나가 선택됩니다:

- 작업이 생각 템플릿 중 하나와 유사한 경우, 해당 템플릿은 instantiation prompt를 사용하여 요약 정보로 구체화됩니다 (논문에서 확인할 수 있습니다). 이 instantiation 과정은 아래와 같이 표현할 수 있습니다:

![image](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_5.png)

- 작업이 새로운 경우, 문제의 다양한 범위를 다루기 위해 설계된 일반적인 생각 템플릿이 사용됩니다. 작업이 처리되는 동안 버퍼 관리자가 관찰하고 학습하며 새로운, 보다 구체적인 생각 템플릿을 만들어 메타 버퍼에 푸시할 수 있습니다.

<div class="content-ad"></div>

## 버퍼 관리자

버퍼 관리자는 메타 버퍼를 유지하고 향상시키는 데 중요한 역할을 합니다. 해결된 작업에서 얻은 새로운 통찰과 결과에 기초하여, 생각 템플릿을 업데이트합니다. 또한 새로운 문제가 해결되거나 크게 다른 문제인 경우, 버퍼 관리자는 새로운 생각 템플릿을 만들지 여부를 평가합니다. 이는 생각 템플릿이 핵심을 유지하고 중복되지 않도록 하기 위한 것입니다.

![이미지](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_6.png)

위 공식을 활용하여, 버퍼 관리자는 메타 버퍼에 이미 문제를 해결하기에 필요한지 여부를 확인합니다.

<div class="content-ad"></div>

## BoT 대 Single-Query 대 Multi-Query

이전 방법들과 비교하여 BoT는 어떻게 뛰어날까요? 논문 저자들은 다양한 작업의 다양한 데이터셋에서 BoT를 포함한 다양한 방법을 평가했습니다. 이들 작업에는 데이터 이해, 파이썬 프로그래밍 퍼즐, 다국어 초등 수학(MGSM) 등이 포함되어 있습니다. 결과는 거의 모든 작업에서 BoT의 놀라운 우위를 보여줍니다.

![BoT](/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_7.png)

BoT의 주요 장점 중 하나는 효율성입니다. Multi-Query 프롬프팅 방법과 비교했을 때, 평균적으로 계산 비용의 12%만 필요합니다. ToT와 같은 Multi-Query 방법의 높은 계산 비용과 대기 시간으로 실제 사용 사례에서는 실용적이지 않게 만들 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-UnderstandingBufferofThoughtsBoTReasoningwithLargeLanguageModels_8.png" />

# Buffer of Thoughts 실전 적용

Bufer of Thoughts(BoT)를 위한 데모 코드는 GitHub [2]에 게시되어 있습니다. 실전에서 이 기능을 테스트해보기 위해 이 방법을 커스텀 작업인 단어 재배열에 사용할 것입니다. 이 작업에서는 대규모 언어 모델(LLM)이 "Sam name is my"와 같이 단어가 뒤섞인 문장을 가져와 이 중의 의미 있는 단어 순열인 "my name is Sam"과 같이 반환해야 합니다(이는 벤치마크와 기준 성능이 없는 예시입니다). 몇 가지 뒤섞인 문장과 올바른 문장의 예시는 다음과 같습니다:

```js
{"input": "<start> life plan and families to for social hospital workers outside with patients work the <end>",
"target": "<start> social workers work with patients and families to plan for life outside the hospital <end>"}
{"input": "<start> yield plant refers dry total to production biological matter <end>",
"target": "<start> biological yield refers to total plant dry matter production <end>"}
{"input": "<start> the bloodstream into alcohol from directly stomach goes the <end>",
"target": "<start> alcohol goes directly from the stomach into the bloodstream <end>"}
```

<div class="content-ad"></div>

유저 프롬프트:
단어 목록을 재배열하여 의미가 있는 문장으로 만드세요, 예를 들면 "Sam name is my" -> "my name is Sam". 설명은 제외하고 재배열된 문장만 제공해주세요. 정렬된 문장은 "<start>"로 시작하고 "<end>"로 끝냅니다.

입력:
<start> the melting in solid to gold leaf metals is achieve made by desired gold and mixing color other <end>

정리된 정보:

1. 핵심 정보:
- 입력: "<start> the melting in solid to gold leaf metals is achieve made by desired gold and mixing color other <end>"

2. 제한 사항:
- 문장을 의미 있게 재배열합니다.
- 출력은 "<start>"로 시작하고 "<end>"로 끝나야 합니다.

3. 정리된 작업:
- 주어진 혼합된 단어를 "<start>"와 "<end>" 태그 내에서 의미 있는 문장으로 재배열하는 작업입니다. 

4. 파이썬 변환:
   (선택 사항, 파이썬 태그가 파이썬용이 아닌 경우 스킵) 입력 매개변수:
     input_sentence = "<start> the melting in solid to gold leaf metals is achieve made by desired gold and mixing color other <end>"

5. 응답 형식: (특정 응답 형식이 없는 경우 스킵)
     출력 문장은 "<start> ... <end>" 형식이어야 합니다


<div class="content-ad"></div>

일부 BoT를 사용하여 다시 정렬된 문장 예시:

```js
{"input": "<start> life plan and families to for social hospital workers outside with patients work the <end>", 
"result": "<start> 병원 직원은 환자들과 함께 외부에서 작업하며 사회적 가족들을위한 인생 계획을 합니다 <end>\n"}
{"input": "<start> yield plant refers dry total to production biological matter <end>", 
"result": "<start> 식물 수확은 총 건조물 생물학적 생산물을 가리킵니다 <end>\n"}
{"input": "<start> the bloodstream into alcohol from directly stomach goes the <end>", 
"result": "<start> 알코올은 위에서 직접 혈류로 이동합니다 <end>\n"}
```

BoT 리포지토리가 데모 코드이므로 원본 논문에서 언급된 기능 중 몇 가지가 부족할 수 있음을 유의해주세요. 일반적인 생각 템플릿, Meta-Buffer의 동적 업데이트 또는 사용자 작업에 대한 가장 가까운 템플릿 임베딩을 찾는 기능과 같은 기능이 없습니다. 이러한 기능은 프레임워크의 중요한 측면이며, 이러한 요소가 없으면 Buffer of Thoughts의 성능을 실제로 평가할 수 없습니다.

# 마지막으로

<div class="content-ad"></div>

결론적으로 BoT은 다양한 영역과 작업에서 정확성과 효율성 면에서 유망한 결과를 보여줍니다. 그것은 추론 문제를 근본적인 제약 조건과 주요 정보로 분해하고 이전 솔루션과 템플릿을 기초로 쌓아가면서 LLM이 이해할 수 있도록 작업을 더 잘 구성하는 흥미로운 접근 방법입니다.

다른 프롬프트 기술의 일부 한계를 해결함으로써, Buffer of Thoughts는 LLM이 더 복잡한 사고 패턴을 가질 수 있게 해주어, 작은 경량 모델이 대형 모델 수준의 성능을 발휘할 수 있을 것으로 기대됩니다.

작은 LLM이 대형 LLM에 가까운 결과를 달성할 수 있게 하는 것은 현재 많은 연구 논문에서 다루는 핵심 주제입니다. 목표는 다양한 프롬프팅 및 세밀 조정 기술을 활용하여 저량의 계산 및 비용으로 정확한 AI 출력을 얻는 것입니다.

Buffer of Thoughts는 LLM을 이해와 추론 과정에서 단계별로 안내하기 위해 다양한 기술 영역을 활용하는 혁신적이고 유망한 프롬프팅 프레임워크입니다. Buffer of Thoughts 기술의 완전한 실용적 구현은 아직 이루어지지 않았지만, 그동안 데모 GitHub 저장소의 제공된 벤치마크를 테스트해 보세요. [2]

<div class="content-ad"></div>

지금까지 읽어주셔서 감사합니다!

🌟 파이썬, ML / MLOps / AI, 데이터 과학 및 LLM에 대해 배우고 있는 1000명 이상의 사람들과 함께하고 싶다면 제 X/Twitter를 팔로우해주세요. 거기서는 매일 업데이트된 소식을 받아보실 수 있습니다.

읽어주셔서 감사합니다,

— Hesam

<div class="content-ad"></div>

[1] Yang, L., Yu, Z., Zhang, T., Cao, S., Xu, M., Zhang, W., Gonzalez, J. E., & Cui, B. (2024). Buffer of Thoughts: Thought-Augmented Reasoning with Large Language Models. arXiv. https://arxiv.org/abs/2406.04271

[2] buffer-of-thought-llm, https://github.com/YangLing0818/buffer-of-thought-llm