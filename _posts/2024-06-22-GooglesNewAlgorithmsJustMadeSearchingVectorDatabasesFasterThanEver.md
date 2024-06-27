---
title: "구글의 최신 알고리즘으로 벡터 데이터베이스 검색 속도 급상승"
description: ""
coverImage: "/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_0.png"
date: 2024-06-22 21:10
ogImage: 
  url: /assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_0.png
tag: Tech
originalTitle: "Google’s New Algorithms Just Made Searching Vector Databases Faster Than Ever"
link: "https://medium.com/gitconnected/googles-new-algorithms-just-made-searching-vector-databases-faster-than-ever-36073618d078"
---


벡터 데이터베이스는 LLM의 인기가 높아지면서 점점 더 인기를 얻고 있어요.

이에 대해 처음 듣는 분들을 위해, 벡터 데이터베이스는 텍스트, 이미지, 오디오, 비디오 등과 같은 실제 세계 개체의 벡터 표현인 임베딩들의 모음이에요.

이러한 벡터 표현은 실제 세계 개체의 특징과 의미를 연속적인 벡터 공간에 포착하는 데 도움이 돼요.

이 벡터들은 다양한 머신러닝 작업을 위한 추가 처리 및 애플리케이션에 사용될 수 있어요.

<div class="content-ad"></div>


![Vector Databases](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_0.png)

# But First, How Do Vector Databases Work Exactly?

Vector databases work by storing vector data so that it can be queried and worked with efficiently.

Real-world entities/data points are first converted into embeddings.


<div class="content-ad"></div>

그럼, 효율적인 쿼리를 위해 특수화된 인덱싱 구조를 사용하여 그들을 조직화합니다.

예를 들어, Hierarchical Navigable Small World (HNSW) 그래프는 Pinecone, FAISS, Weaviate와 같은 다양한 현대 벡터 데이터베이스에서 사용되는 최고의 성능을 발휘하는 인덱스 중 하나입니다.

벡터 데이터베이스의 핵심 기능은 쿼리 벡터와 저장된 벡터 간의 유사성 검색을 수행하고 가장 유사한 벡터를 결과로 반환하는 것입니다.

예를 통해 이를 더 잘 이해해봅시다.

<div class="content-ad"></div>

여러 요리 레시피의 임베딩을 포함하는 벡터 데이터베이스를 고려해보세요.

"파스타 요리법은?"과 같은 질의가 수행될 때, 먼저 텍스트를 임베딩으로 변환한 다음 유사한 검색이 실행됩니다.

질의 임베딩에 가장 가까운 임베딩이 결과로 반환됩니다.

![이미지](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_1.png)

<div class="content-ad"></div>

이 유사성 검색은 쿼리 벡터에 가장 가까운 임베딩을 찾는 Inner/ Dot product 작업을 통해 일반적으로 수행되며 이를 Maximum Inner-Product Search 또는 MIPS라고 합니다.

MIPS를 통해 데이터베이스에서 쿼리 벡터와 가장 큰 내적을 가진 벡터를 찾는 것이 목표입니다.

# 그러나 벡터 데이터베이스에서의 검색은 느릴 수 있습니다

데이터 세트가 너무 커지면 데이터베이스의 각각의 임베딩과 쿼리 임베딩을 비교하는 무차별 대우 방식은 비효율적일 수 있습니다.

<div class="content-ad"></div>

그러므로 스케일이 커지면 더 나은 유사성 검색 방법이 필요합니다.

정확한 최근접 이웃을 찾는 대신 주어진 쿼리에 대한 근사 최근 이웃을 찾는 여러 검색 기술이 개발되었습니다. 이러한 방법은 연산 자원과 검색 시간을 상당히 줄이기 위해 무차별 대입 방식을 사용합니다.

이러한 기술 중 하나는 구글 연구원들에 의해 2019년에 발표되었으며, 그들의 오픈 소스 벡터 유사성 검색 라이브러리인 ScaNN (Scalable Nearest Neighbors)에서 사용할 수 있도록 구현되었습니다.

이 기술은 비슷한 기능을 가진 모든 라이브러리보다 성능이 두 배 우수하다고 발견되었습니다.

<div class="content-ad"></div>

다음은 어떻게 작동하는지 배워봅시다.

## 더 빠른 MIPS를 위한 방법이 발견된 과정

MIPS를 가속화하는 다양한 기술은 데이터베이스에서 벡터를 압축하여 근사 내적을 빠르게 찾는 것에 관여합니다.

이 압축은 학습된 양자화 과정을 사용하여 수행됩니다.

<div class="content-ad"></div>

이 프로세스의 아이디어는 데이터베이스 내의 벡터 세트와 대략 관련된 대표 벡터 세트를 생성하는 것입니다.

전체적인 프로세스는 다음과 같이 작동합니다.

초기에 무작위로 선택된 대표 벡터 세트를 시작으로, 양자화 알고리즘은 이를 반복적으로 업데이트합니다.

ScaNN에서는 K-Means 클러스터링 알고리즘이 이러한 목적으로 사용됩니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_2.png)

각 단계에서 알고리즘은 양자화 오차를 최소화하려고 합니다. 이는 원래 벡터와 그들의 양자화된 표현 사이의 차이를 의미합니다 (K 평균 클러스터 중심과 유사함).

Google 연구자들은 이 접근 방식에서 중요한 통찰을 발견했습니다. 때로 이러한 벡터들 사이의 높은 차이가 MIPS에서 뛰어난 성능을 보일 수 있다는 것을 알게 되었습니다.

따라서, 이전 접근 방식처럼 이 차이/오차의 크기만을 고려하는 것이 아니라, 이 차이/오차의 방향 또한 고려하는 것이 중요합니다.


<div class="content-ad"></div>

그들은 병렬 양자화 오차(직교와 비교했을 때)가 원본 벡터의 더 나쁜 근사값으로 이어지는 것을 발견했습니다. 심지어 오차 크기가 낮을 때에도 마찬가지로 그렇습니다.

그들은 이 기술을 이방성 벡터 양자화라고 명명했고(이방성은 양 자의 서로 다른 방향으로의 변화를 의미합니다)이것이 더 빠르게 작동하는 ScaNN 라이브러리의 기반이 되었습니다.

이를 더 잘 이해하기 위해 아래 예제를 살펴보십시오.

예제에서 데이터베이스 임베딩 x1과 x2는 클러스터 센터 c1 또는 c2로 양자화됩니다. 그들의 양자화된 버전은 각각 x̃ 1과 x̃ 2라고 하며 q가 쿼리 벡터입니다.

<div class="content-ad"></div>

목표는 쿼리와 임베딩 `q, x̃ i`의 내적을 원래의 내적` q, xi`와 가능한 한 유사하게 만드는 것입니다.

임베딩에 가장 근접한 센터를 선택하는 첫 번째 접근 방식(즉, x(1)과 x(2)가 각각 c(1) 및 c(2)로 양자화됨)은 두 임베딩의 상대적인 순위를 잘못 지정합니다. 즉, `q`, x̃ 1`이 `q, x̃ 2`보다 더 크지만, `q, x1`이 `q, x2`보다 적다는 것입니다.

![image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_3.png)

다음 그림에서는 방향이 양자화에 반영됩니다. 즉, x1 및 x2는 그들의 방향이 q와 평행이 아닌 직교임에도 불구하고 더 멀리 떨어져 있는 경우(더 큰 크기)에도 c1 및 c2 센터를 선택합니다.

<div class="content-ad"></div>

이러한 고려 사항은 알고리즘의 정확도가 높아지도록 `q, x1`, `q, x̃ 1` 및 `q, x2`, `q, x̃ 2` 간의 낮은 내적 오류를 유발합니다.

![image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_4.png)

# SOAR로 벡터 검색을 더욱 빠르게 수행하세요

2024년에 Google 연구원들은 SOAR: 직교성이 증폭된 잔차와 함께 넘치게 하는 새로운 접근 방식을 통해 ScaNN을 더 개선했습니다.

<div class="content-ad"></div>

ScaNN의 초기 버전에서는 각 벡터가 상기 설명된 양자화 접근 방식을 사용하여 정확히 한 개의 K-means 클러스터로 근사화되었습니다.

검색 단계에서 클러스터 내의 벡터는 쿼리 벡터와 N개의 가장 가까운 센터 중 하나였을 때만 평가되었습니다.

그러나 이 방식으로는 쿼리 벡터가 원본 벡터와 클러스터 센터 벡터 사이의 차이에 평행할 때 검색 단계에서 올바른 클러스터 센터를 선택하는 데 어려움이 있었음이 밝혀졌습니다.

이것은 ScaNN의 양자화 방법에서의 직관과 유사할 수 있지만, SOAR는 대신 검색 단계에서 이를 사용합니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_5.png)

SOAR은 Redundancy 전략을 사용하여이 문제를 해결합니다.

원래 ScaNN 라이브러리의 경우처럼 데이터베이스의 벡터가 하나가 아닌 여러 클러스터에 할당됩니다.

이로 인해 주요 클러스터에 문제가 발생할 경우 검색 프로세스 중에 백업으로 작용하는 보조 클러스터가 생성됩니다. (따라서 SOAR에서 "Spilling"이라는 용어가 사용됩니다.)

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_6.png)

SOAR는 중복 벡터를 보유하는 이러한 보조 클러스터 센터를 찾는 똑똑한 방법을 가지고 있습니다.

이는 원본 벡터와 보조 클러스터 센터 벡터 간의 차이가 쿼리 벡터에 대해 직교에 가깝다(그리고 평행하지 않다)는 것을 찾는 경향이 있습니다. (따라서 SOAR에서 Orthogonality-Amplified Residuals라는 용어의 등장입니다.)

이는 쿼리 q가 r(원본 벡터와 클러스터 센터 사이의 차이)와 평행일 때 검색을 실패하는 것을 피합니다.


<div class="content-ad"></div>

아래 예시에서 c가 기본 클러스터 센터인 경우를 보여줍니다.

c'가 보조 클러스터 센터로 선택되면(r'(원래 벡터와 보조 클러스터 센터 간의 차이) 쿼리 q와 평행하기 때문에 검색 단계 중에 더 높은 실패율이 발생하여 비효율적인 중복이 발생합니다.

그러나 c"가 보조 클러스터 센터로 선택되면 r"이 쿼리 q와 거의 직교하기 때문에 검색 단계 중에 더 낮은 실패율을 보입니다.

<div class="content-ad"></div>

이는 SOAR 뒤에 있는 기본 원칙인 효과적인 중복성에 이르게 됩니다.

![Image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_8.png)

## SOAR는 성능이 얼마나 우수한가요?

ScaNN에 도입되었을 때, SOAR는 다른 유사한 라이브러리와 비교할 때 가장 작은 메모리 풋프린트를 가지면서도 극도로 빠른 성능을 제공합니다.

<div class="content-ad"></div>

ScaNN의 성능을 맞추기 위해 유사한 라이브러리들이 10배 이상의 메모리와 50배 이상의 인덱싱 시간을 요구하는 것이 잘되어 좋네요!

![image](/assets/img/2024-06-22-GooglesNewAlgorithmsJustMadeSearchingVectorDatabasesFasterThanEver_9.png)

# ScaNN을 어떻게 사용할 수 있나요?

현재 ScaNN은 오픈 소스 라이브러리로, 파이썬 프로젝트에서 pip를 사용하여 설치할 수 있습니다.

<div class="content-ad"></div>

```js
pip install scann
```

Vertex AI 벡터 검색의 일환으로 사용할 수도 있으며, AlloyDB(AlloyDB 인덱스용 ScaNN으로)에서도 사용할 수 있습니다.

# 더 읽어보기

- ScaNN의 GitHub 저장소
- ArXiv에 게시된 'Anisotropic Vector Quantization으로 대규모 추론 가속화' 논문
- ArXiv에 게시된 'SOAR: 근사 최근접 이웃 검색을 위한 개선된 인덱싱' 논문
- Google Research 블로그 글 '효율적인 벡터 유사성 검색 ScaNN 공개'
- Google Research 블로그 글 'ScaNN으로 더 빠른 벡터 검색을 위한 새로운 알고리즘 SOAR 공개'

<div class="content-ad"></div>

벡터 데이터베이스 작업 경험은 어떠셨나요? 즐겨 사용하는 것이 있나요? 아래 댓글로 알려주세요!

## 나의 작업과 연결 유지를 원하신다면 여기에 나의 메일링 리스트 링크를 확인해주세요 —