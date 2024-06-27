---
title: "RAGRetrieval Augmented Generation 소개 및 응용 데모"
description: ""
coverImage: "/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_0.png"
date: 2024-06-19 20:32
ogImage: 
  url: /assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_0.png
tag: Tech
originalTitle: "Intro of Retrieval Augmented Generation (RAG) and application demos"
link: "https://medium.com/@henryhengluo/intro-of-retrieval-augmented-generation-rag-and-application-demos-c1d9239ababf"
---


# RAG 소개

안녕하세요. 오늘은 검색 증강 생성 (RAG)에 대한 소개와 몇 가지 응용 프로그램을 시연하겠습니다. 이 토크의 자료는 아래의 GitHub 저장소에서 확인할 수 있어요.

해당 저장소에서 제 발표용 슬라이드가 포함된 PDF 파일을 찾을 수 있습니다. 이후에는 RAG를 적용하기 위해 몇 가지 실습을 진행할 것입니다. 코드와 데이터는 GitHub 저장소에서 모두 제공되므로 함께 따라해볼 수 있어요.

RAG 개요부터 시작해봅시다. RAG는 대형 언어 모델을 개선하는 강력한 기술입니다. 제 생각에는 대형 언어 모델을 최상의 방식으로 적용하는 데 초점을 맞춰야 하며, RAG는 특히 개발자들에게 가장 효과적인 접근 중 하나입니다.

<div class="content-ad"></div>

대형 언어 모델에는 일부 고유한 제약이 있습니다. 외부 지식이 부족하기 때문에 잘못된 정보를 제공하거나 환각적인 정보를 제공할 수 있습니다. 훈련 데이터의 컷오프 날짜 때문에 잠재적으로 오래된 정보에 의존합니다. 예를 들어, GPT-3는 2021년 이전에 훈련을 받았습니다. 그들은 훈련 데이터 외의 특정 주제에 대한 깊이나 구체성이 부족합니다. LLMs의 훈련 및 세밀한 조정은 많은 조직에게 계산 비용이 많이 들어서 현실적으로 불가능합니다. 모델은 지식의 출처를 보여주거나 민감한 데이터가 제공될 때 개인 정보 보호 규정을 준수할 수 없습니다.

RAG는 생성된 콘텐츠의 정확성과 관련성을 크게 향상시킬 수 있습니다. 먼저 텍스트를 생성하기 전에 외부 데이터베이스나 문서에서 관련 정보를 검색합니다. [1]


![image](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_0.png)


예를 들어, 사용자가 다음과 같은 질문을 할 때를 상상해보세요. “OpenAI의 CEO Sam Altman이 이사회에 의해 갑자기 해임당하고 회사에 재취직되었다는 사실을 어떻게 평가하십니까? 이것은 권력 동력 측면에서 게임 오브 스론의 현실적 버전처럼 세 일 동안에 벌어진 일입니다.”

<div class="content-ad"></div>

ChatGPT가 적절하게 대답하지 못할 것입니다. 그 이유는 이벤트가 2021년 이후에 발생했기 때문입니다. RAG를 사용하면 먼저 관련 문서를 검색하고 "Sam Altman이 CEO로 OpenAI에 복귀, 실리콘밸리의 드라마가 코미디와 비슷해짐", "드라마가 결론에 이르렀나요? Sam Altman이 OpenAI의 CEO로 복귀, 이사회가 구조 재편을 할 예정", "OpenAI의 인사 불화가 종결됐습니다. 누가 이겼고 누가 졌나요?"와 같은 중요한 부분을 추출합니다. 이 세 개의 단락은 질문에 맥락을 제공하기 위해 결합됩니다. 그 후 대형 언어 모델은 검색된 정보를 기반으로 일관된 답변을 생성할 수 있습니다.

RAG 타임라인 및 기술

![image](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_1.png)

역사를 살펴보면, RAG는 세 가지 주요 방식(사전 훈련, 세밀한 조정 및 추론 검색)을 갖춘 학계에서 유래되었습니다. 최근에는 더 실용적인 기술들이 추론 시간 검색에 초점을 맞추고 있습니다. 또한, 2022년 이전에는 제안된 RAG 기술이 몇 없었지만, 2023년 이후에는 다양한 RAG 기술이 급증한 것을 볼 수 있습니다.

<div class="content-ad"></div>


![RAG process](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_2.png)

RAG은 응답을 생성하기 전에 외부 지식 소스에서 관련 정보를 먼저 검색하여 LLM 출력의 정밀성과 관련성을 향상시킵니다. 전통적인 기본 RAG 프로세스, Naive RAG로도 알려진 과정은 주로 세 가지 기본 단계로 구성됩니다.

- 색인화: 문서는 더 짧은 텍스트("체크")로 분할되어 인코더 모델을 사용하여 벡터 데이터베이스에 색인화됩니다.
- 검색: 질문과 청크 간 유사성을 기반으로 관련 청크를 찾습니다.
- 생성: LLM은 검색된 컨텍스트를 조건으로 하는 답변을 생성합니다.

고급 RAG 패러다임에는 Pre-Retrieval 및 Post-Retrieval에서 추가 처리가 포함되어 있습니다.


<div class="content-ad"></div>

- 검색 전에는 질문과 문서 조각 사이의 의미 차이를 조정하기 위해 쿼리 재작성, 라우팅, 확장과 같은 방법을 사용할 수 있습니다.
- 검색 후에는 검색된 문서 코퍼스를 재랭크하면 "중간에서 길을 잃음" 현상을 피하거나 컨텍스트가 필터링되어 윈도우 길이가 줄어들도록 압축될 수 있습니다.

모듈식 RAG도 소개되었습니다. 구조적으로 더 자유롭고 유연하며, 쿼리 검색 엔진 및 여러 답변의 퓨전과 같은 특정 기능 모듈들이 더 많이 도입되었습니다. 기술적으로는 검색을 세밀하게 조정, 강화 학습 및 기타 기술과 통합합니다. 프로세스 측면에서는 RAG 모듈이 설계되고 조율되어 다양한 RAG 패턴이 생성됩니다.

좋은 RAG 시스템을 구축하기 위해 고려해야 할 세 가지 중요한 질문은 무엇을 검색할 것인가? 언제 검색할 것인가? 검색된 콘텐츠를 어떻게 활용할 것인가?

증강 소스. 텍스트 단락, 구절 또는 개별 단어와 같은 비구조적 데이터. 색인된 문서, 트리플 데이터 또는 서브그래프와 같은 구조화된 데이터 또한 사용할 수 있습니다. 또는 LLMs가 생성한 콘텐츠에서 검색할 수 있습니다.

<div class="content-ad"></div>

증강 단계. 사전 훈련, 세밀 조정 및 추론 단계에서 실행됩니다.

증강 과정. 초기 검색은 일회성이지만, 반복 검색, 재귀 검색 및 적응적 검색 방법이 발전하는 과정에서 LLMs가 자체적으로 검색 시기를 결정하는 방식이 점차 RAG의 개발 과정에서 나타났습니다.

아래 그림은 RAG triage에 대한 더 자세한 정보를 보여줍니다. 이는 증강 단계(사전 훈련, 세밀 조정, 추론), 증강 소스(비구조화된 데이터, 구조화된 데이터, LLM이 생성한 콘텐츠), 증강 프로세스(일회성 검색, 반복 검색, 적응적 검색, 재귀 검색)를 포함합니다.

<img src="/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_3.png" />

<div class="content-ad"></div>

아래 그림은 RAG와 관련된 용어와 그들의 참고 논문을 보여줍니다.

![RAG Terminology](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_4.png)

# RAG 특징

RAG를 더 잘 이해하기 위해 비교해보면 좋습니다. RAG는 모델에게 맞춤형 정보 검색을 위한 교과서를 제공하는 것과 같습니다. 특정 질의에 매우 적합합니다. 비유를 통해 설명해드릴게요. RAG는 모델에게 외부 지식 원천을 제공해주는데, 마치 학생에게 여는 책 시험을 볼 수 있게 해주는 것과 같습니다. 그럼에도 불구하고, 파인튜닝은 특정 작업에 적합한 지식을 점차적으로 습득하는 학생과 유사하며, 시간이 지남에 따라 지식을 내면화하며 특정 구조, 스타일 또는 형식을 모방하는 데 더 적합합니다.

<div class="content-ad"></div>


![image5](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_5.png)

외부 지식과 모델 사용자 정의에 따라 RAG 및 세밀한 조정이 각각 적합한 응용 프로그램을 갖고 있습니다. 두 가지를 함께 사용하면 최상의 성능을 얻을 수 있습니다. RAG는 모델 적응이 적게 필요하지만 외부 지식이 필요하며, 세밀한 조정은 모델을 크게 적응시키지만 외부 데이터가 적게 필요합니다. 대부분의 경우, RAG, Fine-tuning, Prompt Engineering을 결합하면 최상의 결과를 얻을 수 있습니다.

![image6](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_6.png)

# RAG 평가


<div class="content-ad"></div>

RAG을 구현한 후, 세 가지 품질 점수인 문맥적 타당성, 답변 충실도 및 답변 관련성을 사용하여 철저한 평가가 필수적입니다. 이 평가에는 소음에 대한 견고성, 거부 능력, 정보 통합 및 여우틀 분석의 네 가지 핵심 능력이 포함됩니다. RGB 및 RECALL과 같은 표준화된 벤치마크뿐만 아니라 RAG 시스템을 평가하기 위한 자동화된 도구인 RAGAS, ARES 및 TruLens도 이용할 수 있습니다.

![이미지](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_7.png)

![이미지](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_8.png)

# RAG의 미래

<div class="content-ad"></div>

파워풀한 RAG는 몇 가지 도전에 직면합니다. 큰 컨텍스트 창을 가지면 성능이 향상되지 않을 수 있습니다. 검색을 강력하게 만들고 낮은 품질의 콘텐츠를 걸러내는 것은 어려울 수 있습니다. 잘못된 콘텐츠를 검색하면 최종 답변을 오염시킬 수 있습니다. RAG와 세밀한 조정 사이의 균형을 맞추는 것은 까다로울 수 있습니다. 더 큰 모델이 항상 RAG를 개선하는지 여전히 불분명합니다. LLM의 역할을 더 탐구해야 합니다. 대규모로 RAG를 제작하고 민감한 데이터를 보호하는 것도 다른 고려 사항입니다. RAG를 확장하여 이미지, 오디오 및 비디오를 처리하는 것은 여전히 열려 있는 문제입니다.

하지만 RAG는 질문 답변, 추천 시스템, 정보 추출 및 보고서 생성에 대한 약속을 보여줍니다. 성숙한 RAG 기술 스택은 Langchain 및 LlamaIndex와 같이 번창하고 있고, 시장에서는 맞춤형 도구 및 간소화된 도구와 같은 더 타깃팅 된 RAG 도구들이 등장하고 있습니다. 따라서 생태계는 RAG에 맞는 새로운 도구들이 계속해서 확장되어갈 것입니다.

![이미지](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_9.png)

# RAG 실무

<div class="content-ad"></div>

지금까지 RAG에 대한 고수준 개요를 제공했습니다. 다음으로는 손을 더럽히는 RAG 실험 몇 가지를 시연할 것이며, 여러분의 프로젝트에서 이러한 기술을 적용할 수 있도록 도와드리겠습니다. LlamaIndex를 활용하여 다양한 RAG 파이프라인을 소개하는 Python 스크립트가 세 개 있습니다.

1. 기본 RAG 파이프라인
2. 문장 창 RAG 파이프라인
3. 자동 생성 RAG 파이프라인

![이미지](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_10.png)

기본 RAG 파이프라인은 기존 데이터베이스로 대규모 언어 모델을 보완합니다. 쿼리는 먼저 데이터베이스에서 관련 콘텍스트를 검색한 후 답변을 생성합니다.

<div class="content-ad"></div>

문서를 64토큰씩 2토큰의 중첩으로 작은 단락으로 나눌 수 있어요. 이러한 단락들은 벡터로 인코딩되고 벡터 데이터베이스에 색인됩니다. 쿼리를 받으면 가장 유사한 단락을 찾아 질문과 함께 프롬프트로 둘러싸서 언어 모델에 전달하여 답변을 생성합니다.

![image](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_11.png)

![image](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_12.png)

문장 윈도우 검색 파이프라인은 더 많은 문맥이 필요할 때 유용합니다. 토큰 청크 대신 문장으로 문서를 세그먼트화합니다. 가장 유사한 문장뿐만 아니라 직전 및 직후 문장을 가져와서 문맥 창을 형성합니다. 이러한 문맥 창은 재정렬되어 언어 모델에 제공됩니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_13.png)

자동 생성되는 검색 파이프라인은 검색을 위한 계층 구조를 만듭니다. 작은 16 토큰 단락은 64 토큰 단락을 형성하고, 이는 다시 256 토큰 단락에 연결됩니다. 충분히 많은 작은 단락이 부모에 연결되면 해당 단락은 부모 청크로 병합됩니다. 최종 청크는 다시 순위를 매기고 검색됩니다. 이를 통해 동적으로 크기가 조정된 컨텍스트를 사용할 수 있습니다.

코드를 사용하려면 먼저 NLP.yml 파일의 yaml 파일을 사용하여 python_env 폴더 아래에 Python 가상 환경을 생성하십시오. common 폴더 아래 openAI.env 파일에 OpenAI API 키를 추가하십시오. 샘플 데이터는 data 폴더의 Henry.txt에 있지만, 직접 문서를 제공할 수도 있습니다.

기본 파이프라인은 문서를 청킹하고 벡터 데이터베이스에 색인화한 다음 쿼리를 수행하여 유사한 단락을 검색하고 프롬프트로 래핑하여 언어 모델에 보냅니다. 검색된 단락의 원본 소스를 확인할 수 있습니다.


<div class="content-ad"></div>

문장-창 파이프라인은 문장 수준에서 검색을 수행하여 이전 두 문장과 다음 한 문장을 포함하여 문장을 확장합니다. 다시 순위 지정은 가장 관련성 높은 창을 선택하는 방법을 보여줍니다.

자동 생성 파이프라인은 16에서 256 토큰까지의 통과구조의 계층 구조를 작성하며, 필요에 따라 통과를 더 큰 청크로 병합합니다. 이는 정밀도를 유지하면서 더 긴 문맥을 제공합니다.

이 코드는 연결하고 사용하기 쉽게 설계되어 있습니다. API 키 및 가상 환경을 구성한 후에는 자신의 문서 및 사용 사례에 RAG를 적용할 수 있습니다. 한 번 시도해보시고 다른 궁금한 점이 있으면 알려주세요!

# 참고문헌

<div class="content-ad"></div>

[1] Gao, Y., Xiong, Y., Gao, X., Jia, K., Pan, J., Bi, Y., Dai, Y., Sun, J. and Wang, H., 2023. 대규모 언어 모델을 위한 검색 보완 생성: 조사. arXiv preprint arXiv:2312.10997.

[2] https://github.com/HenryHengLUO/Retrieval-Augmented-Generation-Intro-Project

[3] https://www.llamaindex.ai/

[4] https://learn.deeplearning.ai/building-evaluating-advanced-rag

<div class="content-ad"></div>

# 부록

이 문서는 2024년 1월 27일 GDG 홍콩 AI/ML 스터디 그룹에서 Henry의 발표에 따라 수정 및 재작성되었습니다. 결론적으로 모든 참석자들은 데모에서 웃음을 자아낸 까탈스러운 농담을 외웠습니다: "Henry is the most pretty boy in Hong Kong."

Thomas와 Kin이 이 훌륭한 행사를 기획해 준 데에 감사드립니다.

![이미지](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_14.png)

<div class="content-ad"></div>


![2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_15](/assets/img/2024-06-19-IntroofRetrievalAugmentedGenerationRAGandapplicationdemos_15.png)
