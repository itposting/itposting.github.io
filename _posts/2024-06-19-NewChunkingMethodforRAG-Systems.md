---
title: "RAG 시스템을 위한 새로운 청킹 방법"
description: ""
coverImage: "/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_0.png"
date: 2024-06-19 03:33
ogImage: 
  url: /assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_0.png
tag: Tech
originalTitle: "New Chunking Method for RAG-Systems"
link: "https://medium.com/datadriveninvestor/new-chunking-method-for-rag-systems-2eb3523d0420"
---


## 문서 분할 개선

![image](/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_0.png)

대형 문서를 작은 부분으로 나누는 것은 검색 증강 생성 (RAG) 시스템의 성능에 영향을 미치는 필수적이면서도 중요한 요소입니다. RAG 시스템을 개발하는 프레임워크들은 일반적으로 여러 가지 옵션을 제공합니다. 본문에서는 새로운 옵션을 소개하여 문서를 세분화할 때 문장 임베딩의 도움을 받아 주제 변경을 인식하려고 시도한 이와 같은 방법을 소개하고자 합니다. 이것은 RAG 시스템의 임베딩 단계에서 주제를 인코딩하는 텍스트 부분의 벡터를 찾을 수 있으며 여러 가지 주제의 혼합이 아닙니다. 우리는 주제 모델링의 맥락에서 본 방법을 제안했지만, RAG 시스템에서도 사용할 수 있는 것입니다.

# RAG 시스템

<div class="content-ad"></div>

검색 보완 생성 (Retrieval-Augmented Generation, RAG) 시스템은 검색 기반 및 생성 기반 방법을 결합하여 출력물의 품질과 관련성을 향상시키는 기계 학습 모델입니다. 먼저 입력 쿼리에 기반하여 대규모 데이터셋에서 관련 문서나 정보를 검색합니다. 그런 다음, 검색된 정보를 활용하여 일관된 컨텍스트에 적합한 응답이나 내용을 생성하기 위해 변환기 기반 언어 모델과 같은 생성 모델을 사용합니다. 이 하이브리드 방식은 모델이 정확하고 유익한 응답을 제공하는 능력을 향상시킵니다, 특히 복잡하거나 지식 집약적인 작업에서 더욱 유용합니다.

# 다른 분할 옵션

자세한 절차를 살펴보기 전에, 문서 분할에 대한 몇 가지 표준 옵션을 소개하겠습니다. 널리 사용되는 Langchain 프레임워크를 활용하여 예시를 보여드리겠습니다.

LangChain은 주로 대규모 언어 모델을 적용하기 위해 설계된 견고한 프레임워크로, 다양한 자연어 처리(NLP) 작업을 지원합니다. 그 중 하나인 문서 분할은 사용자가 대형 문서를 작은 관리 가능한 청크로 쪼개는 기능입니다. 아래는 LangChain의 문서 분할의 주요 기능 및 예시를 소개한 것입니다.

<div class="content-ad"></div>

# LangChain의 문서 분할 핵심 기능

- 재귀적 문자 텍스트 분할기: 이 방법은 문자 기반으로 텍스트를 재귀적으로 분할하여 각 청크가 지정된 길이보다 작도록 보장합니다. 이는 자연 단락 또는 문장 구분이 있는 문서에 특히 유용합니다.
- 토큰 분할기: 이 방법은 토큰을 사용하여 문서를 분할합니다. 언어 모델의 토큰 제한이 있는 경우에 유용하며, 각 청크가 모델의 제약에 맞도록 보장합니다.
- 문장 분할기: 이 방법은 문장 경계에서 문서를 분할합니다. 문장이 일반적으로 완전한 생각을 나타내므로 텍스트의 맥락적 무결성을 유지하는 데 이상적입니다.
- Regex 분할기: 이 방법은 사용자 정의 분할 지점을 정의하기 위해 정규 표현식을 사용합니다. 이 방법은 사용 사례에 특정한 패턴을 기준으로 문서를 분할할 수 있는 가장 큰 유연성을 제공합니다.
- 마크다운 분할기: 이 방법은 마크다운 문서에 맞춰져 있습니다. 제목, 목록, 코드 블록과 같은 마크다운 특정 요소를 기준으로 텍스트를 분할합니다.

# LangChain에서 문서 분할의 예시

## 1. 재귀적 문자 텍스트 분할기

<div class="content-ad"></div>

```js
from langchain.text_splitter import RecursiveCharacterTextSplitter

text = "여러분의 긴 문서 텍스트를 여기에 넣어주세요..."
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
chunks = splitter.split_text(text)
for chunk in chunks:
    print(chunk)
```

## 2. 토큰 분할기

```js
from langchain.text_splitter import TokenSplitter

text = "여러분의 긴 문서 텍스트를 여기에 넣어주세요..."
splitter = TokenSplitter(max_tokens=512)
chunks = splitter.split_text(text)
for chunk in chunks:
    print(chunk)
```

## 3. 문장 분할기


<div class="content-ad"></div>

```js
from langchain.text_splitter import SentenceSplitter

text = "문서의 긴 텍스트를 여기에 입력하세요..."
splitter = SentenceSplitter(max_length=5)
chunks = splitter.split_text(text)
for chunk in chunks:
    print(chunk)
```

## 4. Regex Splitter

```js
from langchain.text_splitter import RegexSplitter

text = "문서의 긴 텍스트를 여기에 입력하세요..."
splitter = RegexSplitter(pattern=r'\n\n+')
chunks = splitter.split_text(text)
for chunk in chunks:
    print(chunk)
```

## 5. Markdown Splitter


<div class="content-ad"></div>

```js
from langchain.text_splitter import MarkdownSplitter

text = "여기에 긴 마크다운 문서를 넣어주세요..."
splitter = MarkdownSplitter()
chunks = splitter.split_text(text)
for chunk in chunks:
    print(chunk)
```

# 새로운 접근 방식 소개

대량의 문서를 디지털 콘텐츠 분석에서 일관된 주제별 섹션으로 분리하는 것은 상당한 어려움을 겪을 수 있습니다. 위에서 설명한 전통적인 방법들은 종종 주제가 변화하는 미묘한 부분을 정확하게 감지하지 못할 수 있습니다. 우리는 인공지능, 컴퓨터, 데이터 과학 및 응용국제 학회(ACDSA 2024)에서 발표된 논문에서 이 문제를 해결하기 위한 혁신적인 접근 방식을 제안합니다.

## 핵심 도전 과제


<div class="content-ad"></div>

대규모 문서, 예를 들어 학술 논문, 긴 보고서 및 상세한 기사는 복잡하며 여러 주제를 포함하고 있습니다. 간단한 규칙 기반 방법부터 고급 기계 학습 알고리즘까지 다양한 전통적인 분할 기술들은 주제 전환의 정확한 지점을 식별하는 것에 어려움을 겪습니다. 이러한 방법들은 종종 섬세한 전환점을 놓치거나 잘못 식별하여 단편화된 또는 겹치는 섹션을 야기할 수 있습니다.

저희 방법은 문장 임베딩의 힘을 활용하여 분할 과정을 개선합니다. 이 접근 방식은 개별 문장에 대한 임베딩을 생성하기 위해 Sentence-BERT (SBERT)를 활용하여 그들의 유사성을 양적으로 측정합니다. 주제가 변경됨에 따라 이러한 임베딩은 벡터 공간에서 변화를 반영하여 잠재적인 주제 전환을 나타냅니다.

## 접근 방식의 각 단계를 살펴보세요:

## 1. 문장 임베딩 사용

<div class="content-ad"></div>

임베딩 생성:

- 이 방법은 개별 문장에 임베딩을 생성하기 위해 Sentence-BERT (SBERT)를 사용합니다. SBERT는 문장의 의미적 내용을 담고 있는 밀집 벡터 표현을 만듭니다.
- 이러한 임베딩을 비교하여 연이은 문장 간의 일관성을 파악합니다.

유사도 계산:

- 문장 간의 유사도는 코사인 유사도 또는 맨해튼 또는 유클리드 거리와 같은 다른 거리 측정을 사용하여 측정됩니다.
- 동일한 주제 내의 문장은 유사한 임베딩을 갖게 되며, 서로 다른 주제의 문장은 유사도가 감소하는 것을 보여줍니다.

<div class="content-ad"></div>

## 2. 갭 점수 계산

매개 변수 n 정의:

- 매개 변수 n을 설정하여 비교할 문장의 수를 지정합니다. 예를 들어, n=2이면 두 연속 문장이 다음 쌍과 비교됩니다.
- n의 선택은 비교에서 고려되는 문맥 길이에 영향을 미치며, 세밀한 전환을 포착하는 필요와 계산 효율성을 균형있게 유지합니다.

코사인 유사도 계산:

<div class="content-ad"></div>

- 문서의 각 위치에 대해, 알고리즘은 현재 위치 앞 뒤 n개의 문장을 추출합니다.
- 그런 다음 이러한 시퀀스의 임베딩 간 코사인 유사도, 즉 '간격 점수'를 계산합니다.
- 이러한 간격 점수는 나중에 처리를 위해 목록에 저장됩니다.

![이미지](/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_1.png)

## 3. 부드러운 처리

노이즈 처리:

<div class="content-ad"></div>

- 텍스트의 미세한 변동으로 인해 기존 갭 점수는 소음이 발생할 수 있습니다. 이를 보정하기 위해 평활화 알고리즘을 적용합니다.
- 평활화에는 매개변수 k로 정의된 창을 통해 갭 점수를 평균화하는 과정이 포함됩니다.

창 크기 k 선택:

- 창 크기 k는 평활화의 범위를 결정합니다. 큰 k 값은 더 많은 평활화를 유발하며 소음을 줄이지만 섬세한 변환을 놓칠 수 있습니다. 작은 k 값은 더 많은 세부 정보를 유지하지만 소음을 도입할 수 있습니다.
- 평활화된 갭 점수는 주제 전환 지점이 명확히 나타납니다.

![이미지](/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_2.png)

<div class="content-ad"></div>

## 4. 경계 감지

지역 최솟값 식별:

- 부드러운 갭 점수를 분석하여 지역 최솟값과 주제 전환 지점을 식별합니다.
- 각 지역 최솟값에 대해 깊이 점수를 계산하여 지역 최솟값과 이전 값과 이후 값 사이의 차이를 합산합니다.

임계값 c 설정하기:

<div class="content-ad"></div>

- 유의미한 경계를 결정하는 임계값 c를 사용합니다. 높은 c 값은 더 적고 더 의미 있는 세그먼트를 만들어내며, 낮은 c 값은 더 많고 더 작은 세그먼트를 만들어냅니다.
- 평균 깊이 점수보다 표준 편차의 c 배 이상을 초과하는 경계는 유효한 분할 지점으로 간주됩니다.

![그림](/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_3.png)

## 5. 클러스터링 세그먼트

반복된 주제 다루기:

<div class="content-ad"></div>

- 긴 문서는 서로 다른 지점에서 유사한 주제를 재방문할 수 있습니다. 이를 해결하기 위해 알고리즘은 유사한 콘텐츠를 가진 세그먼트를 클러스터링합니다.
- 이 과정은 세그먼트를 임베딩으로 변환하고 클러스터링 기술을 사용하여 유사한 세그먼트를 병합하는 것을 포함합니다.

중복 감소:

- 클러스터링은 각 주제가 고유하게 표현되어 중복을 줄이는 데 도움이 되며, 세분화의 전반적인 일관성과 정확도를 향상시킵니다.

# 알고리즘 의사 코드

<div class="content-ad"></div>

갭 스코어 계산:

![이미지](/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_4.png)

갭 스코어 부드럽게 표현:

![이미지](/assets/img/2024-06-19-NewChunkingMethodforRAG-Systems_5.png)

<div class="content-ad"></div>

경계 감지:

- 각 지역 최솟값에 대한 깊이 점수가 계산됩니다.
- 중요한 분할 지점을 결정하기 위해 매개변수 c를 사용하여 임계값을 적용합니다.

# 향후 방향

이 연구는 이 방법을 향상시키기 위해 추가 연구를 위한 여러 영역을 개요로 설명합니다:

<div class="content-ad"></div>

- 자동 매개변수 최적화: 기계 학습 기술을 사용하여 매개변수를 동적으로 조정합니다.
- 보다 광범위한 데이터 집합 실험: 다양하고 대규모 데이터셋에서의 방법을 테스트합니다.
- 실시간 분할: 동적 문서에 대한 실시간 응용 프로그램을 탐색합니다.
- 모델 개선: 최신 변형 모델을 통합합니다.
- 다국어 분할: 멀티링귀얼 SBERT를 사용하여 다른 언어에 해당 방법을 적용합니다.
- 계층적 분할: 상세한 문서 분석을 위해 여러 수준에서의 분할을 조사합니다.
- 사용자 인터페이스 개발: 분할 결과를 더 간편하게 조정할 수 있는 대화형 도구를 만듭니다.
- NLP 작업과의 통합: 알고리즘을 다른 자연어 처리 작업과 결합합니다.

# 결론

우리의 방법은 문서 분할에 정교한 접근법을 제시하며 전통적인 원칙과 첨단 문장 임베딩을 결합합니다. SBERT와 고급 스무딩 및 클러스터링 기술을 활용하여 이 프로세스는 대규모 문서에서 정확한 주제 모델링을 위한 강력하고 효율적인 솔루션을 제공합니다.

논문: https://ieeexplore.ieee.org/document/10467643

<div class="content-ad"></div>

DataDrivenInvestor.com에서 저희를 방문해주세요.

DDIntel을 여기서 구독해보세요.

주요 기사:

저희 창작자 생태계에 참여해보세요.

<div class="content-ad"></div>

DDI 공식 텔레그램 채널: [https://t.me/+tafUp6ecEys4YjQ1](https://t.me/+tafUp6ecEys4YjQ1)

LinkedIn, Twitter, YouTube, 그리고 Facebook에서도 팔로우해주세요.