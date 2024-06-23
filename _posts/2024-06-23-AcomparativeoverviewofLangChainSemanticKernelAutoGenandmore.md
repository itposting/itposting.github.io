---
title: "LangChain, Semantic Kernel, AutoGen 최신 비교 및 분석"
description: ""
coverImage: "/assets/img/2024-06-23-AcomparativeoverviewofLangChainSemanticKernelAutoGenandmore_0.png"
date: 2024-06-23 19:27
ogImage: 
  url: /assets/img/2024-06-23-AcomparativeoverviewofLangChainSemanticKernelAutoGenandmore_0.png
tag: Tech
originalTitle: "A comparative overview of LangChain, Semantic Kernel, AutoGen and more"
link: "https://medium.com/data-science-at-microsoft/harnessing-the-power-of-large-language-models-a-comparative-overview-of-langchain-semantic-c21f5c19f93e"
---


Jane Huang과 Kirk Li가 씀

이 기사에서는 대형 언어 모델 (LLMs)을 활용한 응용 프로그램을 개발하기 위한 다양한 전략을 비교 분석하며, OpenAI의 Assistant API, LangChain, Semantic Kernel, AutoGen 등과 같은 프레임워크를 아우르고 있습니다. LLMs의 동적인 환경에서는 적절한 프레임워크를 선택하는 것이 이러한 모델을 응용 프로그램에 매끄럽게 통합하기 위해 중요합니다. 다행히 LLM을 백엔드로 하는 시스템을 구축하는 데는 처음부터 시작할 필요가 없습니다.

![이미지](/assets/img/2024-06-23-AcomparativeoverviewofLangChainSemanticKernelAutoGenandmore_0.png)

OpenAI의 Assistant API는 응용 프로그램 내에서 AI 어시스턴트를 개발하는 데 도움이 되는 강력한 도구로 부상했습니다. 제공하는 편의성에도 불구하고 일부 유경험 개발자들은 비용과 실제 서비스에서의 관측 가능성 문제에 대해 우려를 표명하며, 잠재적인 단점에 대해 거론했습니다. Assistant API는 개발 노력을 크게 줄이지만, 가격 모델의 장기적 지속 가능성에 대한 불확실성이 남아있습니다.

<div class="content-ad"></div>

대조적으로 LangChain, Semantic Kernel 및 AutoGen과 같은 대체 프레임워크는 개발자들에게 AI 응용 프로그램에 대한 제어와 유연성을 제공합니다. 이러한 대안들은 각각 특정 선호도와 프로젝트 요구 사항을 고려한 선택지를 제시합니다. 오늘날 사용 가능한 또 다른 주목할 만한 옵션은 SDK를 활용하지 않거나 OpenAI에 Assistant API로 복잡성을 맡기지 않고 작동하는 "자체 구축" 솔루션입니다. 이러한 선택지는 유연성뿐만 아니라 필요한 개발 노력 수준에서도 차이를 나타냅니다. 다양한 대안을 제공함으로써, 본 글은 개발자들이 자신의 프로젝트에 대한 독특한 요구 사항과 포부에 부합하는 판단력을 가지도록 돕고자 합니다.

오늘날, 우리의 초점은 LangChain, Semantic Kernel, AutoGen과 같은 프레임워크가 제공하는 옵션에 주변합니다. 이러한 프레임워크는 각각 다른 선호도와 프로젝트 요구 사항을 고려한 것입니다. 이 글의 저자들은 이 글에서 논의된 프레임워크의 어떤 측면에 대해서도 새로운 것을 주장하지 않음을 유의해주십시오. 이 내용들은 링크를 통해 공개된 문서에서 출처를 얻은 것으로, 저자들이 다양한 프레임워크에 대한 학습 및 프로젝트 경험을 요약한 것입니다. 인공 지능 기술의 급격한 발전으로 인해, 본 글이 항상 시간에 따른 최신 발전을 포함하지 못할 수 있다는 점을 인식하는 것이 중요합니다.

일반적으로, LangChain과 Semantic Kernel은 LLMs를 응용 프로그램에 통합하는 공통 목표를 가지고 있지만 접근 방식과 기능에서 차이가 있습니다. LangChain은 메모리와 컨텍스트 창을 명시적으로 구성해야 하지만 Assistant API는 이러한 측면을 자동화합니다. OpenAI의 Assistant API는 개발 노력을 최소화하는 반면, LangChain과 Semantic Kernel과 같은 프레임워크는 AI 응용 프로그램에 대한 심층적인 이해와 제어를 원하는 개발자들에게 매력적입니다. 이러한 프레임워크들은 AI 모델과 기존 코드 간의 간극을 메우는 SDK를 제공함으로써 돋보입니다. 이러한 SDK는 실제 세계 조치와 AI 응답의 통합을 용이하게 하여, 복잡한 비즈니스 프로세스를 자동화할 수 있는 완전 자동화된 AI 에이전트 구축에 이상적인 솔루션입니다. 플러그인, 도구 및 콘넥터를 통한 확장성은 다양한 기존 코드를 원활하게 연결함으로써 다른 공급 업체의 AI 서비스를 통합할 때 유연성을 제공합니다.

반면, AutoGen은 다중 에이전트 프레임워크로 위치하며, LangChain의 단일 에이전트 초점과는 다릅니다. 이는 다중 에이전트 협업을 특징으로 하는 애플리케이션을 생성할 수 있어, 복잡한 에이전트 상호작용을 지향하는 개발자들을 위한 다재다능한 옵션을 제공합니다. 이러한 차이를 이해하는 것은 프로젝트 요구 사항과 원하는 협업 기능에 따라 이러한 프레임워크 중에서 선택하는 개발자들에게 중요합니다. 2024년 1월 말에, LangChain의 창시자들은 에이전트 실행 시간을 맞추기 위해 설계된 또 다른 다중 에이전트 워크플로인 LangGraph를 소개했습니다. 이 출시는 AutoGen과 비교했을 때 마음의 모델에서 상당한 변화를 제시합니다. 핵심적인 차이점은 프레임워크가 에이전트를 구성하는 방식에 있습니다. LangGraph는 고유한 에이전트 및 이들의 전이 확률을 명확하게 정의하는 방식을 촉진하며, 그것들을 그래프로 묘사합니다. 이에 반해, AutoGen은 이 과정을 더 "대화"로 보고 있습니다. 더불어, LangGraph는 LangChain 생태계에 원활하게 통합되어 있습니다. 이 통합을 통해 사용자들은 모든 LangChain 통합을 활용하고 LangSmith 감시 기능을 활용할 수 있습니다.

<div class="content-ad"></div>

우리의 비교 분석을 시작하기 위해, 테이블 1에 명시된 여러 프레임워크의 기본적인 특성을 자세히 살펴보겠습니다. (화면의 너비 제한으로 인해 현재 웹페이지에서 보이지 않는 전체 내용을 볼 수 있도록 스크롤 막대를 드래그해주세요). 이 분석에서는 특히 세 가지 최고로 인정받는 프레임워크를 비교합니다. 특정 작업을 위해 개발자들이 개발 프로세스 중에 활용할 수 있는 흥미로운 특화된 라이브러리들인 가이던스, 가드레일, 람마 인덱스, 타입챗과 같은 추가로 흥미로운 라이브러리들이 있습니다. 그러나 이 기사의 목적상 이러한 라이브러리들을 자세히 다루지는 않겠습니다.

## 테이블 1: 기본 특성 개요

## 테이블 2: 샘플 레슨

인터넷에는 소개에 관한 많은 유익한 수업들이 온라인으로 찾아볼 수 있습니다. 몇 가지 예시는 다음과 같습니다:

<div class="content-ad"></div>

# 프레임워크의 구성 요소

이제, 더 깊이 탐구하기 위해 표 3-13에 나타난 프레임워크의 다양한 구성 요소를 면밀히 검토하고 비교해 보겠습니다.

## 표 3: 구성 요소 개요: 작업 조율

## 표 4: 구성 요소 개요: 메모리 관리

<div class="content-ad"></div>

## 테이블 5: 구성 요소 개요: 재사용 가능한 구성 요소

## 테이블 6: 구성 요소 개요: 프롬프트 템플릿

## 테이블 7: 구성 요소 개요: 문서 로더

## 테이블 8: 구성 요소 개요: 문서 변환 및 분할

<div class="content-ad"></div>

## 테이블 9: 구성 요소 개요: 호출 순서 구성

## 테이블 10: 구성 요소 개요: 벡터 저장소

## 테이블 11: 구성 요소 개요: 검색기

## 테이블 12: 구성 요소 개요: 모델 입출력

<div class="content-ad"></div>

## 테이블 13: 구성 요소 개요: 데이터 연결

# 결론

LLM(언어 모델 라이브러리)의 환경이 계속 발전함에 따라, 복잡한 AI 애플리케이션을 구축하려는 개발자들에게는 프레임워크 선택이 중요한 결정이 됩니다. Assistant API의 간편한 편리성이나 LangChain, LangGraph, Semantic Kernel, AutoGen과 같은 프레임워크가 제공하는 세밀한 제어라는 각 옵션은 각각의 장점과 고려해야 할 사항이 있습니다. 어떤 SDK를 사용할지 결정하는 것은 특정한 요구 사항, 선호도, 그리고 개발자의 목표뿐만 아니라 수행 중인 프로젝트의 성격에 달려 있습니다. 일반적인 해결책이 아니라 다양한 SDK들을 조화롭게 결합하여 사용하는 것이 종종 최적의 해결책일 수 있습니다. Semantic Kernel과 AutoGen의 원활한 통합에 대해 탐구한 John Maeda의 흥미로운 블로그 게시물과 함께, Matthew Bolanos는 오픈AI 어시스턴트를 통합하고 있으며 오픈AI 어시스턴트를 활용한 시각 등을 설명하는 "Semantic Kernel의 미래: OpenAI 어시스턴트," "OpenAI 어시스턴트: Semantic Kernel과 오픈AI 어시스턴트 사용에 대한 첫인상," 그리고 "OpenAI 어시스턴트: 템플릿화된 어시스턴트 지시의 힘" 시리즈를 Microsoft의 플랫폼에 발표하고 있습니다. Microsoft은 이미 OpenAI 어시스턴트 API를 사용하는 실험적인 구현을 갖고 있으나, 팀은 어떠한 모델로 만들어진 에이전트도 수용할 수 있는 에이전트 인터페이스의 완전한 추상화를 목표로 하고 있습니다. 이를 위해 Microsoft의 Semantic Kernel 팀 구성원들은 AutoGen팀의 연구 결과를 활용하여 에이전트가 팀으로 협업하는 시나리오를 포함한 다양한 경험을 수용할 수 있는 추상화를 개발하고 있습니다.

<div class="content-ad"></div>

더욱 풍부한 대화를 위해 LangChain은 프레임워크와 OpenAI 어시스턴트 간 상호작용을 명료하게 설명하는 포괄적인 문서를 보급했습니다. Gagan Bansal은 OpenAI 어시스턴트를 AutoGen에 통합하는 것을 탐구함으로써 대화에 기여했으며, GPTAssistantAgent에 대한 통찰을 통해 이에 대해 자세히 논의했습니다. 이러한 동적인 환경에서 다양한 SDK 간의 협업 가능성에 대해 정보를 가지고 있는 것이 AI 애플리케이션에서 대형 언어 모델의 전체 잠재력을 이용하는 데 중요합니다.

Casey Doyle가 작업을 검토하는 데 도움을 준 데 대해 감사드립니다.