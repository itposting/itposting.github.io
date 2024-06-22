---
title: "Greg의 비디오에서 배우는 RAG 청킹 5단계 전략"
description: ""
coverImage: "/assets/img/2024-06-22-FiveLevelsofChunkingStrategiesinRAGNotesfromGregsVideo_0.png"
date: 2024-06-22 21:37
ogImage: 
  url: /assets/img/2024-06-22-FiveLevelsofChunkingStrategiesinRAGNotesfromGregsVideo_0.png
tag: Tech
originalTitle: "Five Levels of Chunking Strategies in RAG| Notes from Greg’s Video"
link: "https://medium.com/@anuragmishra_27746/five-levels-of-chunking-strategies-in-rag-notes-from-gregs-video-7b735895694d"
---


# 소개

대형 데이터 파일을 더 작은 세그먼트로 분할하는 것은 LLM 응용 프로그램의 효율성을 높이는 가장 중요한 단계 중 하나입니다. 목표는 LLM에게 특정 작업에 필요한 정보를 정확하게 제공하는 것이며, 그 이상의 정보는 제공하지 않는 것입니다.

“나의 솔루션에서 적합한 청킹 전략은 무엇이어야 할까”는 고급 RAG 솔루션을 구축하는 동안 LLM 전문가가 필수적으로 결정해야 하는 초기적이고 근본적인 결정 중 하나입니다.

Greg Kamradt는 비디오에서 다양한 청킹 전략을 개요로 제공합니다. 이러한 전략은 RAG 기반 LLM 어플리케이션 개발의 시작점으로 활용될 수 있습니다. 이들은 복잡성과 효과성을 기준으로 다섯 수준으로 분류되었습니다.

<div class="content-ad"></div>

# 레벨 1: 고정 크기 청킹

이것은 텍스트를 세그먼트로 분할하는 가장 단순하고 원시적인 방법입니다. 콘텐츠나 구조와 관계없이 텍스트를 지정된 문자 수의 청크로 분할합니다.

Langchain과 llamaindex 프레임워크는 CharacterTextSplitter와 SentenceSplitter(문장을 기준으로 분할하는 것이 기본 설정) 클래스를 이용해 이러한 청킹 기술을 제공합니다. 몇 가지 기억해야 할 개념들 -

- 텍스트가 어떻게 분할되는지: 한 문자씩
- 청크 크기 측정 방법: 문자 수로
- 청크 크기: 청크에 포함된 문자 수
- 청크 중첩: 연속적인 청크에서 중복 데이터를 유지하기 위해 오버랩되는 문자 수
- 구분자: 텍스트를 분할할 문자(기본 설정은 "")

<div class="content-ad"></div>

# 레벨 2: 재귀 청킹

고정 크기 청킹은 구현하기 쉽지만 텍스트의 구조를 고려하지 않습니다. 재귀 청킹은 대안을 제공합니다.

이 방법에서는 텍스트를 계층적이고 반복적인 방식으로 더 작은 청크로 나누어 일련의 구분자를 사용합니다. 텍스트를 분할하는 초기 시도가 원하는 크기의 청크를 생성하지 못하는 경우, 해당 방법은 다른 구분자를 사용하여 결과 청크에서 자체를 재귀적으로 호출하여 원하는 청크 크기를 달성합니다.

Langchain 프레임워크는 default 구분자(“\n\n”, “\n”, “ “,””)를 사용하여 텍스트를 분할하는 RecursiveCharacterTextSplitter 클래스를 제공합니다.

<div class="content-ad"></div>

# 레벨 3: 문서 기반 청킹

이 청킹 방법에서는 문서를 그 내재적인 구조에 기반하여 분할합니다. 이 방법은 내용의 흐름과 구조를 고려하지만 명확한 구조가 없는 문서의 경우 효과적이지 않을 수 있습니다.

- 마크다운 포맷의 문서: Langchain은 마크다운을 구분자로 사용하여 문서를 분할하는 MarkdownTextSplitter 클래스를 제공합니다.
- Python/JS 코드 포함 문서: Langchain은 Python 프로그램을 클래스, 함수 등을 기반으로 분할하는 PythonCodeTextSplitter를 제공하며 RecursiveCharacterTextSplitter 클래스의 from_language 메서드를 통해 언어를 제공할 수 있습니다.
- 테이블을 다루는 문서: 테이블을 처리할 때 1단계와 2단계에 기반하여 분할하면 행과 열 사이의 관계가 손실될 수 있습니다. 이 관계를 보존하기 위해 테이블 내용을 언어 모델이 이해할 수 있는 방식으로 형식화합니다 (예: HTML의 `table` 태그, `;`로 구분된 CSV 형식 등). 시맨틱 검색 중에 테이블에서 바로 포함된 내용과 일치시키는 것은 어려울 수 있습니다. 개발자들은 종종 추출 후 테이블을 요약하고 해당 요약의 임베딩을 생성하여 일치시키는 데 사용합니다.
- 이미지를 포함하는 문서 (멀티 모달): 이미지와 텍스트의 임베딩은 서로 다를 수 있습니다 (CLIP 모델은 이를 지원). 가장 좋은 전략은 멀티 모달 모델(예: GPT-4 vision)을 사용하여 이미지의 요약을 생성하고 해당 임베딩을 저장하는 것입니다. Unstructured.io는 pdf 문서에서 이미지를 추출하기 위한 partition_pdf 메서드를 제공합니다.

# 레벨 4: 시맨틱 청킹

<div class="content-ad"></div>

위의 세 가지 수준은 문서의 내용과 구조를 다루며 일정한 청크 크기의 값을 유지해야 한다. 이 청킹 방법은 임베딩에서 의미를 추출한 다음 이러한 청크 간의 의미적 관계를 평가하기 위한 것이다. 핵심 아이디어는 의미적으로 유사한 청크를 함께 유지하는 것입니다.

![image](/assets/img/2024-06-22-FiveLevelsofChunkingStrategiesinRAGNotesfromGregsVideo_0.png)

Llamindex에는 SemanticSplitterNodeParse 클래스가 있어 문서를 청크로 분할할 수 있습니다. 이는 청크 간의 맥락적 관계를 이용하여 문장 사이의 중단점을 임베딩 유사성을 이용해 적응적으로 선택합니다.

알아둬야 할 몇 가지 개념들

<div class="content-ad"></div>

- buffer_size: 초기 창(chunks)에 대한 윈도우를 결정하는 구성 가능한 매개변수
- breakpoint_percentile_threshold: 다른 구성 가능한 매개변수. 청크를 분할할 임계값을 결정하는 값
- embed_mode: 사용되는 임베딩 모델

# 레벨 5: 주체적 청킹

이 청킹 전략은 LLM을 사용하여 컨텍스트에 기반하여 청크에 포함해야 할 텍스트 양과 내용을 결정하는 가능성을 탐색합니다.

초기 청크를 생성하려면 Proposals 개념을 사용하며, 이는 원시 텍스트에서 독립된 문장을 추출하는 논문에 기초합니다. Langchain은 이를 구현하기 위한 Proposal 검색 템플릿을 제공합니다.

<div class="content-ad"></div>

주장을 생성한 후, 이들은 LLM 기반 에이전트에게 공급됩니다. 이 에이전트는 주장이 기존 청크에 포함되어야 하는지 또는 새로운 청크를 생성해야 하는지를 결정합니다.

![이미지](/assets/img/2024-06-22-FiveLevelsofChunkingStrategiesinRAGNotesfromGregsVideo_1.png)

# 결론

본 문서에서는 Langchain 및 Llamaindex 프레임워크에서 다양한 청킹 전략과 그 구현 방법을 탐색했습니다.

<div class="content-ad"></div>

Greg가 작성한 코드를 찾으려면 다음 링크를 참조하세요: [Greg의 코드](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/5_Levels_Of_Text_Splitting.ipynb)

Generative AI 및 기계 학습이 더 빠르게 발전하고 있기 때문에 이 기사를 지속적으로 업데이트할 것입니다. Generative AI 및 기계 학습의 발전에 대해 자주 쓰기 때문에 LinkedIn에서 저를 팔로우하십시오: [LinkedIn 프로필](https://www.linkedin.com/in/anurag-mishra-660961b7/)