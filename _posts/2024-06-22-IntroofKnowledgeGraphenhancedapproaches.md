---
title: "지식 그래프 향상된 접근 방식 소개"
description: ""
coverImage: "/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_0.png"
date: 2024-06-22 21:24
ogImage: 
  url: /assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_0.png
tag: Tech
originalTitle: "Intro of Knowledge Graph enhanced approaches"
link: "https://medium.com/@henryhengluo/intro-of-knowledge-graph-enhanced-approaches-bbf88aa23102"
---


# 지식 그래프 백그라운드 리뷰

지식 그래프는 자연어 처리 애플리케이션, 추천 시스템 및 기타 지식 기반 작업에서 널리 사용됩니다. 이는 보다 구조화된 정보와 일반적인 감각을 제공할 수 있기 때문입니다. 이미지 캡션이 포함된 지식 베이스, 질문 응답이 포함된 지식 베이스, 추천 시스템이 포함된 지식 베이스가 모두 아래에서 논의되었으며, 주요 논문 세 편 [1–3]에서 중요 아이디어와 방법론이 요약되었습니다. 기본 아이디어는 해결해야 할 문제를 임베딩 벡터로 변환하고 해당하는 지식 그래프를 그래프 임베딩 벡터로 인코딩한 다음 두 종류의 임베딩 벡터를 융합하여 더 나은 결과를 얻는 것입니다. 따라서 효과적인 그래프 임베딩과 모델 설계의 다른 부분이 중요합니다. 심층 신경망은 성능을 향상시킬 수 있지만, 지식 그래프에 의해 유발되는 해석 능력과 추론 추론은 여전히 향상되어야 합니다.

전형적인 지식 그래프는 수십억 건의 개체-관계-개체 쌍(s, r, o)으로 구성되며, 여기서 s, r 및 o는 주체, 관계 및 객체를 각각 나타냅니다. 지식 그래프에는 엔티티(주체 또는 객체), 관계, 엔티티의 속성이 포함됩니다. 일반적으로 목적을 가진 지식 그래프 또는 도메인별 지식 그래프가 있습니다.

지식 그래프를 구축하려면 지식 모델링, 지식 획득, 지식 퓨전, 지식 저장 및 지식 응용과 같은 다양한 작업이 필요합니다. 지식 모델링은 다수준 지식 시스템을 구축하고 데이터베이스를 공고히 정의, 조직 및 관리하기 위해 추상적인 지식, 엔티티, 관계, 속성을 정의하는 것입니다. 지식 획득은 다양한 소스와 구조에서 데이터를 그래프 데이터로 변환하고 구조화된 데이터, 반구조화된 데이터, 비구조화된 데이터, 지식 인덱싱, 지식 추론 등을 처리하여 데이터의 유효성과 무결성을 보장하는 것입니다. 지식 퓨전은 다중 소스에서 반복된 지식 정보를 퓨전하는 것으로, 퓨전 컴퓨팅, 수동 작업 퓨전 등이 포함됩니다. 지식 저장은 비즈니스 시나리오에 따라 합리적인 지식 저장 솔루션을 제공하는 것입니다. 지식 저장 솔루션은 유연하고 다양하며 확장 가능해야 합니다. 지식 응용은 그래프 검색, 지식 계산, 그래프 시각화와 같은 분석 및 응용 기능을 제공하는 것뿐만 아니라 그래프 기본 애플리케이션, 그래프 구조 분석, 그래프 의미론적 애플리케이션, 자연어 처리, 그래프 데이터 획득, 그래프 통계, 데이터 집합 획득, 데이터 집합 통계 등을 포함한 다양한 종류의 지식 계산 SDK를 제공합니다.

<div class="content-ad"></div>

지식 그래프 구축이나 컴퓨팅에 초점을 맞추는 대신, 이 보고서는 다양한 자연어 처리 작업에 대한 지식 그래프 적용에 집중할 것입니다. 적절한 지식 그래프가 있다고 가정하면, 지식 그래프는 의미 수준과 지식 수준의 추가 정보를 제공할 수 있기 때문에 다양한 NLP 작업을 보다 효과적으로 해결할 수 있습니다. 지식 그래프는 물건 추천, 기계 읽기, 기계 이해, 자동 추출, 텍스트 분류, 단어 임베딩, 질문 응답, 대화 관리, 순차 생성 등과 같은 이러한 작업에서 능력을 보여줍니다. 제 개인적인 흥미로 인해, 유명한 방법, 클래식 모델 및 관련 기본 아이디어에 대해 깊게 파고들고 싶었습니다. 여기서 지식 기반 이미지 캡션, 지식 기반 질문 응답, 지식 기반 추천 시스템과 관련된 세 가지 논문[1–3]을 선택했습니다. 기본 아이디어는 질문을 임베딩 공간으로 매핑하고, 지식 그래프 표현을 위한 적절한 임베딩 공간을 찾아 두 임베딩 공간에서 정보를 통합하여 의미 수준과 상식 수준에서 더 나은 성능을 달성하는 것입니다.

# 지식 기반 이미지 캡션 소개

첫 번째 논의는 지식 기반 이미지 캡션에 관한 것입니다. 캡션은 이미지 옆에 나타나는 하나 또는 여러 문장으로, 이미지의 전반적인 내용을 식별하거나 설명할 수 있습니다. 이미지 캡션은 따라서 이미지에 대한 텍스트 설명을 생성하는 과정입니다. 이 작업은 고수준 의미 공간에서 두 가지 널리 연구된 모달리티를 연결하는 다리인 시각-언어 맞춤의 가장 기본적인 방안으로 간주될 수 있습니다. 이미지 캡션을 잘 수행할 수 있다면, 이미지-텍스트 검색 및 텍스트-이미지 검색과 같은 다양한 관련 하류 작업에 이러한 방법을 쉽게 확장할 수 있습니다. 구체적으로, 이미지 캡션 작업은 이미지와 캡션을 이해하기 위해 컴퓨터 비전과 자연어 처리의 발전을 요구합니다. 이 이미지에 대한 의미 있는 설명을 생성하기 위해서는 이미지와 의미를 다양한 기술을 사용하여 세부적으로 이해하는 것을 필요로 합니다. 컴퓨터 비전 부분에서 사용되는 기술에는 이미지 분할, 물체 감지, 특성 추출, 이미지 생성, 적대적 학습 등이 포함되며, 자연어 처리 부분의 관련 작업에는 시퀀스 이해, 엔티티 추출, 의미적 특징 추출, 시퀀스 생성 등이 포함됩니다. NLP의 인코더 디코더 아키텍처에서 영감을 받아, 이미지 캡션 문제에서도 동일한 아키텍처가 채택되었으며, 주의 메커니즘, 강화 학습과 같은 다른 개선 기술도 함께 사용되어 파라미터를 조정합니다.

또한, 동적 지식 베이스를 활용하여 후속 추론, 텍스트 질문 응답[4–9], 시각적 질문 응답[10–17], 이미지 생성[18–20], 시각적 기초[21–25], 퓨-샷 분류[26–29]에 사용할 수 있습니다. [2]에서는 동적 지식 사전과 그래프 합성망을 채택하여, 인간의 자연어에 대한 환율성 표현을 가져와서 결과적인 캡션을 유창하고 다양하게 만드는 데 도움이 되도록 하였습니다.

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_0.png)

![이미지2](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_1.png)

기본 아이디어는 인코더(CNN)에 의해 이미지 특성을 추출하고, 그래프 대표자(MGCN)에 의해 이미지 특성을 매핑하고, 언어 말뭉치로 미리 훈련된 재인코더의 사전을 사용하여 그래프 대표자를 보완하고, 마지막으로 디코더를 사용하여 캡션 문장을 생성하는 것입니다. Scene 그래프는 개체, 속성, 관계를 나타내는 1000차원의 멀티-핫 벡터로 표시됩니다. GCN에는 전결합층과 ReLU 활성화 함수가 포함되어 있어 관계 내장, 속성 내장, 개체 내장을 계산하기 위한 각각의 방정식이 아래에 표시되어 있습니다. 이후, 텍스트 기반 지식사전은 데이터셋의 문장만 사용하여 사전 훈련할 수 있습니다. 사전은 이미지 캡션 작업에 파라미터를 고정시켜 전달할 수 있습니다. 마찬가지로, 이미지 지식 그래프는 개체 탐지기로 사용되는 Faster-RCNN, 관계 추출기로 사용되는 MOTIFS 관계 탐지기, 그리고 속성 추출기로 사용되는 작은 fc-ReLU-fc-Softmax 네트워크 헤드를 사용하는 멀티 모달 그래프 합성망에 의해 처리됩니다. MGCN의 출력은 보다 풍부한 의미 정보 및 자연적 추론을 생성하기 위해 사전에 의해 다시 인코딩됩니다. 마지막으로 강화 학습을 통한 고성능 디코더가 해당 캡션을 생성할 것입니다. 자세한 실험 결과에 따르면, MGCN, GCN, D는 각각 최종 성능 향상에 기여할 수 있습니다. 사전 훈련용 대규모 언어 말뭉치를 사용하면, 모델이 데이터셋 편향의 과적합 문제와 추론 추론력을 개선하기 위한 도움이 될 수 있습니다. 지식 기반 사전을 포함한 전체 아키텍처는 전통적인 인코더 디코더 아키텍처와 비교하여 최신 기술 성능을 달성하고 더 많은 추론 정보를 생성할 수 있습니다.

![이미지3](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_2.png)


<div class="content-ad"></div>

![Knowledge Graph Enhanced Approaches](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_3.png)

![Knowledge Graph Enhanced Approaches](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_4.png)

# 지식 그래프 기반 질문 응답 소개

두 번째 토론은 지식 기반 질문 응답에 관한 것입니다. 질문 응답 문제는 오랫동안 연구되어 왔습니다. 미리 학습된 언어 모델에서 직접 응답을 생성하는 것은 그다지 만족스럽지 않습니다. 그럼에도 불구하고, 지식 베이스 또는 지식 그래프는 더 많은 선험적 정보를 가져올 수 있다고 여겨지며, 따라서 지식 베이스 질문 응답 방법론은 더 많은 연구의 주목을 끌고 있습니다. [3, 30] 작업이 소개되기 전에는, 구조화된 지식 베이스 질문 응답이 연구되어 왔습니다. 이는 복잡한 질문에 대한 기계의 응답을 두 가지 방법으로 더 정확하게 개선하기 위해 필요한 질문을 표준 쿼리로 변환하고, 쿼리 일치를 사용하여 지식 베이스의 API를 활용하는 정보 검색 기반의 방법입니다. 또 다른 방법은 의미 분석 기반으로, 의미 분석 시스템을 사용하여 질문의 의미를 변환하고, 후보 응답을 사용하여 거리를 측정하고, 상위 N 순위 점수로 적합한 답변을 찾는 방법입니다.

<div class="content-ad"></div>

[3]은 기본 아이디어에 대한 클래식한 방법입니다: 먼저 질문 내의 엔티티를 기반으로 지식 베이스에서 후보 답변을 찾아내는 것(빔 서치), 그런 다음 질문과 후보 답변을 저차원 공간에 매핑하여 분산 표현, 즉 분산 임베딩을 얻는 과정을 거칩니다. 이후 분산 임베딩에 대한 판별자를 훈련시켜 질문 임베딩과 해당 올바른 답변 임베딩 간의 상관 점수를 높게 유지합니다. 모델 훈련이 완료되면 잠재적인 후보 답변을 상관 점수에 따라 순위를 매기고 최상위 답변을 선택할 수 있습니다.

질문 임베딩에는 먼저 질문을 사전 사이즈 및 지식 베이스 내의 엔티티 및 관계 수에 해당하는 다중 핫 벡터로 매핑하는 작업이 포함됩니다. 그런 다음 행렬 곱셈에 의해 저 차원 공간으로 변환하여 N 차원에서 k 차원으로 다시 형성합니다. 답변 후보 임베딩은 유사한 과정을 거쳐 생성되지만 더 많은 정보가 인코딩됩니다. 첫 번째는 경로 표현이고, 답변 임베딩에는 질문에서 답변 엔티티로의 경로를 포함해야 하며 단순함을 위해 1-hop 또는 2-hop 경로가 사용됩니다. 두 번째는 서브그래프 표현이며, 후보 답변 엔티티의 서브그래프를 고려해야 합니다. 경로 표현과 서브그래프 표현을 구별하기 위해 원래 답변 벡터의 차원은 사전 사이즈와 지식 베이스 내의 엔티티 및 관계 수의 두 배입니다. 그런 다음 행렬 곱셈을 사용하여 차원을 k로 축소합니다. 최종 점수 함수는 S(q, a) = f(q)⊤g(a)이며, 훈련 중 정확한 답변이 더 높은 점수를 가져야 합니다. 손실 함수는 마진 기반 순위 함수입니다.

![이미지](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_5.png)

여기서 m은 마진으로 0.1이며, Ã는 부정적인 샘플 (다른 후보 경로)의 50% 및 무작위 답변의 50%로 구성된 부정 후보 답변 세트입니다.

<div class="content-ad"></div>


![Intro of Knowledge Graph Enhanced Approaches 6](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_6.png)

![Intro of Knowledge Graph Enhanced Approaches 7](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_7.png)

이 논문은 실험적으로 2-홉 경로가 1-홉 경로보다 훨씬 우수하며, 서브그래프 표현이 최종 성능을 향상시킬 수 있다는 것을 검증합니다. 왜냐하면 서브그래프와 2-홉은 둘 다 더 많은 정보를 가져올 수 있기 때문입니다. 이 방법은 수작업으로 생성된 피처나 추가 시스템(어휘 맵, 품사 태그, 의존성 트리 등)의 도움이 거의 필요하지 않습니다. 비교적 간단하고 구현하기 쉬우며, 강력한 F1 점수 점수인 39.2를 달성했습니다. 또한, 이 논문에서 데이터셋을 확장하고 멀티태스크 학습을 함으로써 실험 데이터 부족의 단점을 일부 해소하는 데 기여했습니다. 그러나 임베딩 방법은 블랙 박스처럼 작용하여 해석 가능성이 부족하며, 의미 주석은 문제를 논리적 형태의 표현으로 변환하고 정보 추출은 각 차원에 의미를 제공해 주지만 선험지식과 추론이 부족합니다. 또한, 이 방법은 단어 순서를 고려하지 않는 bag-of-words 모델과 유사하며, 모델은 단순한 얕은 다층 퍼셉트론만 사용한다는 것이 특징입니다. 이는 딥 뉴럴 네트워크로 해결할 수 있습니다.

# 지식 기반 추천 시스템 소개


<div class="content-ad"></div>

세 번째 토론은 지식 기반 추천 시스템에 관한 것입니다. 추천 시스템은 전자 상거래, 온라인 영화, 온라인 게임, 레스토랑, 여가 활동 등 다양한 분야에서 널리 사용됩니다. 또한, 지식 그래프는 기계 판독, 자동 추출, 텍스트 분류, 단어 임베딩, 질의 응답 등 다양한 응용 프로그램에서 성공적으로 활용되고 있습니다. 따라서 추천 시스템과 지식 그래프를 결합하여 추천의 정확도와 설명 가능성을 향상시키는 것이 합리적입니다. 특히 사용 가능한 지식 그래프에서 엔티티와 관계 정보의 장점을 살리는 데 중요합니다 [1, 31, 32]. 여기서 추천 임베딩 공간과 지식 그래프 임베딩 공간을 통합하는 한 가지 방법을 찾는 것이 중요합니다.

[1]은 뉴스 추천 문제를 다루는데, 이는 본질적으로 시간에 민감하며 짧은 수명 주기, 주제에 민감하며 지식 엔티티와 상식에 가득찬 내용으로, 다른 추천 시나리오와 비교했을 때입니다. 기존 지식 그래프의 정보를 활용하여 사용자의 현재 관심사를 정확하게 파악하고 더 나은 예측을 제공할 것으로 기대됩니다.

[1]은 깊은 지식 지능 네트워크(DKN)를 제안했는데, 뉴스 제목에 대한 더 나은 표현을 만들기 위해 제목 단어 임베딩, 제목 엔티티 임베딩, 엔티티 컨텍스트 임베딩을 포함하는 아이디어를 기반으로 하고 있습니다. 여기서 마지막 두 임베딩은 지식 그래프에서 추출된 것이며, 사용자가 클릭한 과거 제목에 후보 뉴스 제목을 주의 네트워크를 통해 일치시켜서 후보 뉴스를 클릭할 확률을 생성합니다. 단어 임베딩은 널리 사용되지만, 지식 그래프 임베딩에는 TransE, TransH, TransR, TransD와 같은 다양한 접근 방식이 있습니다. 이를 통해 제목 단어 시퀀스가 지식 그래프의 엔티티로 매핑되고, 엔티티 임베딩은 해당 엔티티 하위 그래프를 벡터화하여 얻습니다. 또한, 엔티티의 컨텍스트, 즉 지식 그래프에서 한 번의 점프 이내에 있는 엔티티,도 추출되어 벡터화되는 방식과 동일합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_9.png)

단순히 이 세 개의 임베딩을 연결하는 대신, 단어별로 정렬한 다음 아래에 표시된 것처럼 3채널 텐서를 구성하는 것이 더 좋습니다. 이후 CNN 모델을 사용하여 특징 맵과 풀링을 추출합니다. 또한, 주의 네트워크를 사용하여 사용자가 클릭한 히스토리 제목 순서의 가중 기여를 자동으로 계산합니다.

![이미지](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_10.png)

실험을 거친 결과, 이 방법이 효과적이며 SOTA 성과를 보였습니다. 게다가, 제외 연구를 수행한 결과, 엔티티 임베딩, 컨텍스트 임베딩, DKN+TransD, 매핑된 DKN, 주의 네트워크가 모두 AUC에 기여할 수 있다는 것을 명확히 입증했습니다. 또한, 사례 연구를 통해 모델이 지식 그래프를 활용한 후에 잠재적 정보 연결을 찾아낼 수 있다는 것을 명백히 보여줍니다. [31] 또한 사용자 선호도가 지식 그래프를 따라 한 단계씩 전파된다는 것을 연구하였습니다.


<div class="content-ad"></div>


![IntroofKnowledgeGraphenhancedapproaches_11](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_11.png)

![IntroofKnowledgeGraphenhancedapproaches_12](/assets/img/2024-06-22-IntroofKnowledgeGraphenhancedapproaches_12.png)

# References

[1] H. Wang, F. Zhang, X. Xie, and M. Guo, “DKN: Deep knowledge-aware network for news recommendation,” in Proceedings of the 2018 world wide web conference, 2018, pp. 1835–1844.


<div class="content-ad"></div>

[2] X. 양, K. 탕, H. 장, J. 최, “이미지 캡션을 위한 씬 그래프 자동 인코딩,” IEEE/CVF 컴퓨터 비전 및 패턴인식 콘퍼런스 논문집, 2019, pp. 10685–10694.

[3] A. 보르드, S. 초프라, J. 웨스턴, “서브그래프 임베딩을 이용한 질의응답,” arXiv 프리프린트 arXiv:1406.3676, 2014.

[4] K. 쉬, S. 레디, Y. 펑, S. 황, D. 조, “관계 추출 및 텍스트 증거를 통한 프리베이스 질문응답,” arXiv 프리프린트 arXiv:1603.00957, 2016.

[5] W. 첸, M.-W. 창, E. 슐링거, W. 왕, W. W. 코엔, “테이블 및 텍스트를 활용한 오픈 질문 응답,” arXiv 프리프린트 arXiv:2010.10439, 2020.

<div class="content-ad"></div>

[6] W. Chen, H. Zha, Z. Chen, W. Xiong, H. Wang, and W. Wang, "Hybridqa: A dataset of multi-hop question answering over tabular and textual data," arXiv preprint arXiv:2004.07347, 2020.

[7] A. H. Li, P. Ng, P. Xu, H. Zhu, Z. Wang, and B. Xiang, "Dual reader-parser on hybrid textual and tabular evidence for open domain question answering," arXiv preprint arXiv:2108.02866, 2021.

[8] P. Yin, G. Neubig, W.-t. Yih, and S. Riedel, "TaBERT: Pretraining for joint understanding of textual and tabular data," arXiv preprint arXiv:2005.08314, 2020.

[9] H. Iida, D. Thai, V. Manjunatha, and M. Iyyer, "Tabbie: Pretrained representations of tabular data," arXiv preprint arXiv:2105.02584, 2021.

<div class="content-ad"></div>

[10] H. A. Pandya and B. S. Bhatt, “Question answering survey: Directions, challenges, datasets, evaluation matrices,” arXiv preprint arXiv:2112.03572, 2021.

[11] Y. Zhang, J. Hare, and A. Prügel-Bennett, “Learning to count objects in natural images for visual question answering,” arXiv preprint arXiv:1802.05766, 2018.

[12] M. Zhao et al., “Towards Video Text Visual Question Answering: Benchmark and Baseline,” in Thirty-sixth Conference on Neural Information Processing Systems Datasets and Benchmarks Track, 2022.

[13] R. Tanaka, K. Nishida, and S. Yoshida, “Visualmrc: Machine reading comprehension on document images,” in Proceedings of the AAAI Conference on Artificial Intelligence, 2021, vol. 35, no. 15, pp. 13878–13888.

<div class="content-ad"></div>

# Table of Research Papers

| 번호 | 작가 | 년도 | 제목 |
|-----|------|------|------|
| 14 | Q. Zhu, C. Gao, P. Wang, and Q. Wu | 2021 | "Simple is not easy: A simple strong baseline for textvqa and textcaps" in Proceedings of the AAAI Conference on Artificial Intelligence, vol. 35, no. 4, pp. 3608–3615. |
| 15 | Y. Kant et al. | 2020 | "Spatially aware multimodal transformers for textvqa" in European Conference on Computer Vision, pp. 715–732. |
| 16 | X. Wang et al. | 2020 | "On the general value of evidence, and bilingual scene-text visual question answering" in Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, pp. 10126–10135. |
| 17 | R. Hu, A. Singh, T. Darrell, and M. Rohrbach | 2020 | "Iterative answer prediction with pointer-augmented multimodal transformers for textvqa" in Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, pp. 9992–10002. |

<div class="content-ad"></div>

[18] J. Park and Y. Kim, “Styleformer: Transformer를 기반으로 한 스타일 벡터를 활용한 생성적 적대 신경망,” IEEE/CVF 컴퓨터 비전 및 패턴 인식 학회 논문집, 2022, pp. 8983–8992.

[19] W. Liao, K. Hu, M. Y. Yang, and B. Rosenhahn, “시맨틱-공간 인식 GAN을 활용한 텍스트에서 이미지 생성,” IEEE/CVF 컴퓨터 비전 및 패턴 인식 학회 논문집, 2022, pp. 18187–18196.

[20] P. Zhang, L. Yang, J.-H. Lai, and X. Xie, “자세 안내를 위한 이중-작업 상관성 조사: 사람 이미지 생성,” IEEE/CVF 컴퓨터 비전 및 패턴 인식 학회 논문집, 2022, pp. 7713–7722.

[21] G. Luo 외, “주시어 표현 이해 및 분할을 위한 다중 작업 협력 네트워크,” IEEE/CVF 컴퓨터 비전 및 패턴 인식 학회 논문집, 2020, pp. 10034–10043.

<div class="content-ad"></div>

[22] H. Liu, A. Lin, X. Han, L. Yang, Y. Yu, and S. Cui, “Refer-it-in-rgbd: A bottom-up approach for 3D visual grounding in RGBD images,” in Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2021, pp. 6032–6041.

[23] Y. Qi et al., “Reverie: Remote embodied visual referring expression in real indoor environments,” in Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2020, pp. 9982–9991.

[24] Y. Liu, B. Wan, L. Ma, and X. He, “Relation-aware instance refinement for weakly supervised visual grounding,” in Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2021, pp. 5612–5621.

[25] J. Wang and L. Specia, “Phrase localization without paired training examples,” in Proceedings of the IEEE/CVF International Conference on Computer Vision, 2019, pp. 4663–4672.

<div class="content-ad"></div>

[26] S. Chen et al., "Hsva: Hierarchical semantic-visual adaptation for zero-shot learning," Advances in Neural Information Processing Systems, vol. 34, pp. 16622–16634, 2021.

[27] H.-Y. Tseng, H.-Y. Lee, J.-B. Huang, and M.-H. Yang, "Cross-domain few-shot classification via learned feature-wise transformation," arXiv preprint arXiv:2001.08735, 2020.

[28] Y. Tian, Y. Wang, D. Krishnan, J. B. Tenenbaum, and P. Isola, "Rethinking few-shot image classification: a good embedding is all you need?," in European Conference on Computer Vision, 2020: Springer, pp. 266–282.

[29] Y. Wang, Q. Yao, J. T. Kwok, and L. M. Ni, "Generalizing from a few examples: A survey on few-shot learning," ACM computing surveys (csur), vol. 53, no. 3, pp. 1–34, 2020.

<div class="content-ad"></div>

[30] A. Bordes, J. Weston, and N. Usunier, “Open question answering with weakly supervised embedding models,” in Joint European conference on machine learning and knowledge discovery in databases, 2014: Springer, pp. 165–180.

[31] H. Wang et al., “Ripplenet: Propagating user preferences on the knowledge graph for recommender systems,” in Proceedings of the 27th ACM international conference on information and knowledge management, 2018, pp. 417–426.

[32] F. Zhang, N. J. Yuan, D. Lian, X. Xie, and W.-Y. Ma, “Collaborative knowledge base embedding for recommender systems,” in Proceedings of the 22nd ACM SIGKDD international conference on knowledge discovery and data mining, 2016, pp. 353–362.