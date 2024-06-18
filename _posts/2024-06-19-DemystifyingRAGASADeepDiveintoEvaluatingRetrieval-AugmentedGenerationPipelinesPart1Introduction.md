---
title: "RAGAS 해석 해부 검색-보완 생성 파이프라인 평가의 심층 탐색 1부 소개"
description: ""
coverImage: "/assets/img/2024-06-19-DemystifyingRAGASADeepDiveintoEvaluatingRetrieval-AugmentedGenerationPipelinesPart1Introduction_0.png"
date: 2024-06-19 06:56
ogImage: 
  url: /assets/img/2024-06-19-DemystifyingRAGASADeepDiveintoEvaluatingRetrieval-AugmentedGenerationPipelinesPart1Introduction_0.png
tag: Tech
originalTitle: "Demystifying RAGAS: A Deep Dive into Evaluating Retrieval-Augmented Generation Pipelines (Part 1: Introduction)"
link: "https://medium.com/@bishalbose294/demystifying-ragas-a-deep-dive-into-evaluating-retrieval-augmented-generation-pipelines-part-1-f8a6f28927c6"
---


# 기계의 부상... 약간의 도움과 함께

AI가 창의적인 텍스트 형식을 생성하는 것뿐만 아니라 현실 정보에 접근하고 활용하여 정확하고 통찰력있는 응답을 창조할 수 있는 세상을 상상해보세요.

# LLMs: 지식 갭을 가진 파워헤우스

GPT-3 및 Jurassic-1 Jumbo와 같은 LLM은 인상적인 공학적 업적으로, 인간 수준의 텍스트를 생성하고 언어를 번역하며 다양한 종류의 창의적 콘텐츠를 작성할 수 있는 능력을 갖췄습니다. 그러나 그들의 지식은 종종 그들이 훈련받은 방대한 양의 데이터로 제한됩니다. 이는 특정 사실적 정확도나 현실 세계 맥락을 필요로하는 프롬프트에 직면했을 때 결함으로 이어질 수 있습니다.

<div class="content-ad"></div>

LLM은 뛰어난 똑똑하고 책임적인 학생으로 생각할 수 있습니다. 그들은 노출된 정보를 기반으로 멋진 에세이를 쓸 수 있지만, 도서관이나 역사적 자료와 같은 외부 자료를 참고해야 하는 질문에 어려움을 겪을 수도 있습니다.

# RAG가 도와줍니다: LLM 성능 향상

여기서 RAG가 등장합니다. RAG는 LLM과 외부 데이터베이스나 문서에 있는 다양한 지식 사이의 다리 역할을 합니다. 이들 외부 자료에서 검색된 관련 정보 조각들을 제공함으로써, RAG는 LLM에게 다음과 같은 기회를 제공합니다:

- 더 많은 사실적인 텍스트 생성. LLM은 그들의 주장을 뒷받침하기 위해 현실 세계 데이터에 접근하고 통합할 수 있습니다.
- 생성된 텍스트의 일관성과 집중력 향상. 명확한 맥락을 가지고 있으면, LLM은 주제를 잘 따라갈 수 있고 관련 없는 변칙을 피할 수 있습니다.
- 출력물의 전반적인 품질과 정보성 향상. RAG가 제공하는 파워를 받은 LLM은 보다 포괄적이고 통찰력 있는 응답을 제공할 수 있습니다.

<div class="content-ad"></div>

# 평가 도전 과제: RAG 시스템이 모든 기능을 완벽히 수행하는지 확인하기

RAG 파이프라인을 개발하는 것은 흥미로운 일이지만, 실제로 효과적으로 작동하는지 어떻게 알 수 있을까요? LLM에 대한 전통적인 평가 방법은 대부분 인간 주석 참조에 의존하는 경우가 많은데, 이는 다음과 같은 단점이 있을 수 있습니다:

- 시간이 많이 소요됨: 생성된 텍스트를 대규모로 수동 평가하는 것은 지루하고 시간이 많이 소요될 수 있습니다.
- 비용이 많이 듦: 인간 주석 작업자를 고용하는 것은 평가 프로세스에 상당한 비용이 들 수 있습니다.
- 주관적임: 인간 평가는 주관적이며 편향을 일으킬 수 있습니다.

# RAGAS 소개: RAG 평가를 변화시키는 게임 체인저

<div class="content-ad"></div>

RAGAS 프레임워크는 이러한 문제에 직면하여 RAG 파이프라인을 평가하는 자동화된 객관적 방법을 제공함으로써 독자적으로 대응합니다. RAGAS를 두드러지게 만드는 이유는 다음과 같습니다:

- 참조 없는 평가: 기존 방법과 달리, RAGAS는 생성된 텍스트를 평가하기 위해 다른 LLMs를 활용합니다. 이는 인간이 주석을 달아야 하는 필요를 제거하여 시간과 자원을 절약합니다.
- 구성 요소 수준의 지표: RAGAS는 RAG 파이프라인의 다양한 측면을 분석하는 지표 모음을 제공합니다. 이는 검색된 정보의 관련성, LLM이 이를 얼마나 잘 활용하는지, 생성된 텍스트의 전반적인 품질을 포함합니다. 이 구체적인 분석은 개선할 영역을 정확히 지목하는 데 도움이 됩니다.

다음 블로그 시리즈의 다음 부분을 기대해 주세요. 여기서는 RAGAS의 기능을 더 깊이 탐구하고 핵심 지표를 탐색하며, 직접 RAG 파이프라인을 평가하기 위해 RAGAS를 구현하는 데 도움이 되는 코드 예제도 제공할 것입니다!

다음 부분에서는 RAGAS의 내부 작업을 탐구하고 RAG 평가의 도전 과제를 어떻게 해결하는지 밝힐 것입니다.