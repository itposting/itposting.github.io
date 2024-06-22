---
title: "일반 NLP 방법론 소개 기초부터 고급까지"
description: ""
coverImage: "/assets/img/2024-06-22-IntroofGenericNLPmethods_0.png"
date: 2024-06-22 21:31
ogImage: 
  url: /assets/img/2024-06-22-IntroofGenericNLPmethods_0.png
tag: Tech
originalTitle: "Intro of Generic NLP methods"
link: "https://medium.com/@henryhengluo/intro-of-nlp-methods-before-llm-077f664d5b53"
---


# NLP 배경 리뷰

자연어 처리(NLP)는 광범위한 응용 분야를 갖고 있고 챗봇, 기계 번역과 같이 점점 더 다양한 제품들이 상용화되고 있습니다. 그러나 다양한 작업들은 각기 다른 요구 사항을 가지고 있어 하나의 표준 NLP 모델로는 이러한 요구 사항을 다루기 어렵습니다. 최근의 작업에서는 기계가 의도를 심층적으로 이해하고 자연스럽게 언어를 생성하기를 요구합니다. 딥러닝의 빠른 발전으로 복잡한 NLP 모델이 더 복잡한 문제들을 다룰 수 있게 되었습니다. NLP에 대한 미래는 밝아 보입니다. 그러나, 연구자들과 전문가들에게는 새로운 어려움의 산이 등장하고 있습니다. 더 효율적인 NLP 모델을 찾고 고품질의 데이터셋을 수집하고 주어진 계산 및 저장 자원의 제한을 다루기 위한 실행 가능한 해결책을 마련해야 하는 엄중한 도전에 직면하고 있습니다. 이러한 어려움은 한 번에 해결될 수 없습니다. 먼저 거대한 모델을 사전 학습하고 그 모델을 세밀하게 조정하거나 프롬프팅하는 두 단계 방법은 실행 가능하며 새로운 표준 방법이 되고 있습니다.

개인적 취향으로 최근 NLP에서 사용되는 고급 방법들을 배우는 데 시간을 투자했습니다. NLP는 상당히 복잡한 문제로 여겨집니다. 이러한 방법들에 대한 기본 아이디어들은 다른 작업 영역에 적용될 수 있으며, IoT를 위한 편재 학습과 같은 다중 모드 학습이 있습니다.

아래는 사전 학습, 세밀 조정, 프롬프트와 관련된 고전적 방법들을 정리해 보았습니다. 그 중에 BERT, GPT, 적응형 세밀 조정, 행동 세밀 조정, 파라미터 효율적 세밀 조정, 프롬프트 엔지니어링이 포함되어 있습니다.

<div class="content-ad"></div>

# 사전 훈련 소개

어노테이션 및 대규모 데이터셋의 수집은 비용이 많이 들거나 일부 특정 영역의 작업에는 불가능한 경우도 있습니다. 그러나 위키피디아와 같이 많은 양의 라벨이 없는 데이터가 많이 있다는 사실이 있습니다. 이에 따라 자연어 처리 분야에서 싼 비용으로 대규모 라벨이 없는 말뭉치를 사용하여 사전 훈련된 언어 모델(PLM)은 매우 큰 가치를 추가합니다. 이는 PLM이 하류 작업에 대해 빠르고 효과적으로 파인 튜닝될 수 있다는 것을 의미합니다. PLM은 효율적인 모델 초기화를 제공하며 다양한 작업에서 수렴을 가속화할 수 있습니다. 또한 PLM은 특정 영역에 대한 오버피팅을 어느 정도 피할 수 있습니다.

일반적으로 PLM은 문맥 없는 임베딩과 문맥을 고려한 임베딩으로 나뉩니다. 문맥 없는 임베딩 방법은 매우 제한적인 문맥 정보를 갖고 있는 정적 단어 임베딩에 중점을 두며 상대적으로 간단한 모델로 구성됩니다. 이 방법에는 NNLM, word2vec (CBOW, Skip-Gram), Glove가 포함됩니다. 문맥을 고려한 임베딩 방법은 단어 토큰을 문맥 정보를 통합하여 매핑하는 것을 목표로 하며, CoVe, ELMo, GPT, BERT, XLNet이 이에 해당됩니다.

![이미지](/assets/img/2024-06-22-IntroofGenericNLPmethods_0.png)

<div class="content-ad"></div>

Transformer 아키텍처는 NLP 작업을 다루는 강력한 성능을 나타내어, 최근 PLM에서 Transformer 아키텍처를 활용하고 있다 [17]. BERT는 Transformer Encoder 아키텍처를 활용하며, 마스크된 언어 모델링을 특징으로 하며, 양방향 자동 인코딩 언어 모델이다 [18]. GPT는 Transformer Decoder 아키텍처를 활용하며, 단방향 자동 회귀 언어 모델이다 [19].

<img src="/assets/img/2024-06-22-IntroofGenericNLPmethods_1.png" />

사전 훈련 작업은 클래식 언어 모델링, 마스크된 언어 모델링, 순열 언어 모델링, 노이즈 제거 오토인코더, 대조 학습으로 분류될 수 있다. 모델 아키텍처를 개선하거나 지식 그래프와 같은 더 많은 사전 정보를 통합함으로써, RoBERTa [20], ELECTRA [21], BART [22], T5 [23], XLNet, MPNet [24], ERNIE-BaiDu [25], Transformer-XL [26], DistilBERT [27], ALBERT [28], MobileBERT [29], ConvBERT [30], DeBERTa [31], BigBird [32]와 같이 다양한 BERT 또는 GPT 확장 모델이 출현하고 있다.

# 파인튜닝 소개

<div class="content-ad"></div>

사전 학습된 임베딩을 활용한 이전 특성 추출과 비교했을 때, 사전 학습된 언어 모델(PLM)의 파인 튜닝은 자연어 처리의 다양한 하향 작업으로의 전이 학습에 더 효과적이고 강력함이 입증되었습니다. 일반적으로 채택된 파인 튜닝 절차는 첫 번째 단계로 레이블이 지정되지 않은 대규모 데이터를 기반으로 모델을 사전 학습하는 것입니다. 그 과정에서 가장 보편적으로 사용되는 방법은 가려진 언어 모델링(MLM) 접근 방식입니다. 두 번째 단계는 다운스트림 작업이나 도메인에 특화된 레이블이 지정된 데이터에서 PLM을 파인 튜닝하는 것이며, 이때 교차 엔트로피 손실 함수와 같은 표준 손실 함수가 사용됩니다.

PLM은 비교적 고정되어 있고 계산 리소스가 더 많이 필요하며, 더 많은 데이터셋, 효율적인 모델 업데이트가 필요하지만, 파인 튜닝은 다양한 실용적 용도에 중요한 빠른 적응형 모델을 제공할 수 있습니다. 따라서 파인 튜닝은 귀중하며 최근 고급 방법은 파인 튜닝 성능을 더욱 향상시킬 수 있습니다. 예를 들어 적응형 파인 튜닝, 행동적 파인 튜닝, 매개변수 효율적 파인 튜닝, 텍스트 대 텍스트 파인 튜닝, 파인 튜닝 불안정성 완화 등이 있습니다.

<div class="content-ad"></div>

적응형 미세 조정은 PLM을 대상 데이터 분포에 더 적응하도록 전이하는 것을 의미합니다. PLM은 MLM(Masked Language Model) 접근 방식을 사용하여 관련 없는 레이블이 붙지 않은 데이터에 대해 미세 조정을 한 다음, 특정 작업 레이블이 붙은 데이터에 대해 교차 엔트로피 손실을 사용하여 모델을 미세 조정합니다. 대상 데이터 도메인으로의 전이는 특히 전문적인 다른 대상 데이터 분포에 유용하며, 이로 인해 최종 모델의 일반화 능력이 제한되기도 합니다.

[이미지1]

행동적 미세 조정은 주로 작업에 초점을 맞추어 PLM을 작업 레이블이 붙은 데이터에 대해 작업 관련 손실 함수를 사용하여 먼저 미세 조정한 후에 작업을 진행합니다. 이 중간 미세 조정 훈련은 높은 수준의 추론과 추론에 유익하며, 이름이 붙은 엔티티, 파라프레이징, 구문, 답변 문장 선택, 질문에 답변하기와 같은 작업에 적용됩니다.

[이미지2]

<div class="content-ad"></div>

Parameter-efficient fine-tuning은 Downstream 작업의 계산 부담을 크게 줄이기 위해 대부분의 PLM을 고정시키고 소수의 매개변수만 미세 조정하는 것이다. 채택된 어댑터는 몇 개의 작은 레이어를 동결된 PLM에 삽입한다. 또는 PLM의 하위 매개변수를 미세 조정하고 나머지 큰 집합을 동결시킬 수도 있다.

Text-to-text fine-tuning은 가리거나 문맥연결 모델을 상위 자체 학습 레이어로 대체하여, 가리기 언어 모델을 자율적 모델로 이전시키는 것이다.

작은 대상 데이터셋과 임의의 가중치 초기화는 미세 조정 모델의 심각한 불안정성을 유발할 수 있다. 따라서, PLM 모델을 중간으로 전송하여 대상 도메인이나 작업으로 불안정성을 완화할 수 있으며, 적대적 또는 신뢰 영역 기반 데이터 증강 방법도 유용하다.

# Prompting 소개

<div class="content-ad"></div>

NLP 모델이 점점 더 정교해지면, 분명한 딜레마가 발생합니다. 한편에서는 수십억 개의 매개변수를 가진 보다 일반적이고 강력하지만 무거운 PLM이 존재하는 반면, 다른 한편에서 downstream 작업은 오직 독특하고 가벼우며 빠르게 적응하는 모델이 필요합니다. 한편에서는 많은 편향과 노이즈가 있는 주석이 되지 않은 원본 데이터가 많이 있지만, 다른 한편에서는 과연 소량이고 매우 비싼 과제별 주석 데이터만 사용할 수 있습니다. 한편에서는 대규모 데이터로 상당히 거대한 모델을 훈련시키는 것이 가능하며 고성능 컴퓨팅 센터를 통해 이것이 이루어집니다. 다른 한편에서는 downstream 작업이 한정된 계산 리소스를 제공할 수 있으며 스마트폰과 같은 엣지 컴퓨테이션만 가능합니다. 한편에서는 고전적인 PLM이 더 오랜 시간 동안 업데이트되며, 다른 한편에서는 downstream 작업이 요구 사항을 훨씬 더 빠르게 변경합니다. 요약하면, 이 중첩된 접근법은 방대한 범용 PLM과 유연한 가벼운 과제별 파인튜닝 모델로 이어지며 이러한 목표를 달성하는 데 점점 더 많은 비용이 듭니다. [40]은 이에 대처하기 위한 네 번째 패러다임, 즉 사전 훈련, 프롬프트, 예측을 요약했습니다. 회고적으로, 첫 번째 패러다임은 신경망 없이 특성 엔지니어링을 수동으로 해야 합니다. 두 번째 패러다임은 신경망을 활용하며 아키텍처 엔지니어링을 수동으로 해야 합니다. 세 번째 패러다임은 사전 훈련 및 파인튜닝 접근법을 활용하며 사전 훈련 및 파인튜닝을 위해 적절한 손실 함수를 찾기 위해 목적 함수 엔지니어링을 수동으로 해야 합니다. 네 번째 패러다임은 사전 훈련, 프롬프트, 예측 접근법을 활용하며 적절한 프롬프트를 찾기 위해 프롬프트 마이닝 엔지니어링을 필요로 합니다.

프롬프팅 워크플로우는 4단계로 나눌 수 있습니다. 첫 번째는 프롬프트 구성으로, 필요한 작업을 템플릿에 매핑할 수 있으며, 채워진 템플릿은 PLM에 입력되어 빈 칸 프롬프트(템플릿 텍스트 문자열 중간의 미채워진 슬롯) 및 접두사 프롬프트(템플릿 텍스트 문자열 시작 부분의 미채워진 슬롯)을 포함한 답변을 생성합니다. 두 번째는 답변 구성으로, 생성된 답변을 필요한 레이블로 변환하는 맵 함수를 만들어낼 수 있습니다. 세 번째는 답변 예측으로, 실제로는 고유하게 채워진 템플릿이 PLM에 입력되어 해당하는 답변을 생성합니다. 네 번째는 답변 레이블 매핑으로, 해당하는 답변을 필요한 레이블에 매핑합니다. 요약하면, 원래 입력 x를 템플릿에 채워서 프롬프트 x'를 얻은 후, 일부 빈 칸 슬롯을 채워서 프롬프트 x'를 PLM에 입력하여 완전히 채워진 문자열 x''을 출력하며, 이것은 최종적으로 원하는 레이블 y로 매핑될 수 있습니다.

<div class="content-ad"></div>

그러므로 템플릿을 가져오는 것이 중요합니다. 즉, 프롬프트 엔지니어링으로 분류될 수 있는데, 이는 수동 템플릿 엔지니어링, 이산 프롬프트를 포함한 자동화된 템플릿 학습, 프롬프트 마이닝, 프롬프트 해석, 기울기 베이스 검색, 프롬프트 생성, 프롬프트 점수 및 접두사 튜닝, 이산 프롬프트로 초기화된 튜닝, 하드 소프트 프롬프트 혼합 튜닝이 추가로 포함됩니다. 더불어 다중 프롬프트는 프롬프트 성능을 향상시키고 결과를 확장할 수 있습니다. 프롬프트 앙상블, 프롬프트 증강, 프롬프트 구성, 프롬프트 분해를 포함합니다. 프롬프트를 생성하는 다양한 방법이 있지만, 최선의 방법을 결정하기 위한 직접 비교는 어렵습니다. 게다가 일부 실험에서는 템플릿의 약간의 변형이나 변경이 결과에 큰 차이를 일으킬 수 있습니다.

프롬프트 [41-46]는 지식 탐색, 분류 기반 작업, 정보 추출, 자연어 처리에서의 추론, 질문에 대한 답변, 텍스트 생성, 텍스트 생성 자동 평가, 멀티모달 학습, 메타 응용 프로그램, 리소스 등과 같은 다양한 하류 작업에 널리 활용될 수 있습니다. 이러한 것들은 프롬프트의 일반화된 성능과 다양한 하류 작업에 대한 무감하임을 증명합니다. 이는 프롬프트 방법이 다양한 하류 작업을 완료할 수 있는 다양한 프롬프트 템플릿을 갖춘 효과적인 PLM을 실현할 수 있다는 것을 의미합니다. 흔히잘 알려진 피드백-"답변" 작업이 필요한 경우에, 일반적으로 고전적인 세밀한 튜닝 방법을 사용하여 PLM을 적응시키기 위해 특정 작업 영역 지식이 필요합니다. 반면 프롬프팅은 PLM이 학습한 지식을 활용합니다. 그렇기에 프롬프팅은 다양한 하류 작업의 모델 업데이트에 필요한 계산 부하를 줄이고, 모델 복사본을 저장할 필요가 없다는 것이고, 연습으로 특정 하류 작업에 대한 주석이 달린 데이터는 종종 매우 비싸며, 프롬프팅은 이 작업에 조금의 특정 데이터나 이전 지식으로 유익할 수 있습니다.

<div class="content-ad"></div>

![IntroofGenericNLPmethods](/assets/img/2024-06-22-IntroofGenericNLPmethods_10.png)

작업 특정 데이터 세트의 주석이 작고, 계산 리소스가 제한되며 엣지 노드의 저장 공간이 제한되어 실시간 응답이 필요하고, 다양한 하위 작업의 신속하게 변화하는 요구 사항이 고려될 때 사전 훈련 모델을 채택하고 그 후 적응 엔지니어링을 하는 것이 가장 좋은 방법으로 인정받고 있습니다. Transform 모델은 NLP에서 효과적이라는 것이 입증되었습니다. 따라서 BERT, GPT 및 그 이후에 축Enhanced한 모델들이 널리 사용되고 있습니다. 튜닝 작업은 사전 훈련된 모델을 특정 작업에 적응하는 데 초점을 맞춥니다. 따라서 더 높은 성능을 달성하기 위해 작업 데이터나 작업 도메인으로 이동하는 중간 단계를 채택하는 것이 선호됩니다. 삽입된 적응기를 사용하면 더 동적인 작업 요구 사항을 처리할 수 있습니다. 또는 프롬프트 엔지니어링을 통해 사전 훈련 모델에서 직접 필요한 정보를 추출할 수도 있습니다. 프롬프팅 방법은 인간 실무자에게 매우 직접적이고 이해하기 쉽지만, 일부 학자들은 하위 작업으로 세밀 조정하지 않으면 최고의 성능을 얻을 수 없다고 주장합니다.

# 참고 자료

1. Edunov, S.; Baevski, A.; Auli, M., Pre-trained language model representations for language generation. arXiv preprint arXiv:1903.09722 2019.

<div class="content-ad"></div>

2. Dong, L.; Yang, N.; Wang, W.; Wei, F.; Liu, X.; Wang, Y.; Gao, J.; Zhou, M.; Hon, H.-W., 통합 언어 모델 사전 훈련을 통한 자연어 이해 및 생성. Advances in Neural Information Processing Systems 2019, 32.

3. Zhang, X.; Li, P.; Li, H., Ambert: 다중 단위 토큰화를 사용한 사전 훈련된 언어 모델. arXiv preprint arXiv:2008.11869 2020.

4. Wu, S.; He, Y. Entity 정보로 언어 모델을 보강하여 관계 분류의 성능 향상, Proceedings of the 28th ACM international conference on information and knowledge management, 2019; pp 2361–2364.

5. Gunel, B.; Du, J.; Conneau, A.; Stoyanov, V., 사전 훈련된 언어 모델 파인튜닝을 위한 지도 대조적 학습. arXiv preprint arXiv:2011.01403 2020.

<div class="content-ad"></div>

6. Qiu, X.; Sun, T.; Xu, Y.; Shao, Y.; Dai, N.; Huang, X., 자연어 처리를 위한 사전 학습 모델: 조사. Science China Technological Sciences 2020, 63 (10), 1872–1897.

7. Esmaeilzadeh, A.; Taghva, K. 신경망 언어 모델 (NNLM) 및 BERT를 활용한 텍스트 분류: 경험적 비교, SAI Intelligent Systems Conference 논문집, Springer: 2021; pp 175–189.

8. Church, K. W., Word2Vec. Natural Language Engineering 2017, 23 (1), 155–162.

9. Rong, X., word2vec 매개변수 학습 해설. arXiv 사전 인쇄 arXiv:1411.2738 2014.

<div class="content-ad"></div>

- Ma, L.; Zhang, Y. (2015) Using Word2Vec to process big text data. 2015 IEEE International Conference on Big Data (Big Data), IEEE, pp. 2895–2897.
- Pennington, J.; Socher, R.; Manning, C. D. (2014) Glove: Global vectors for word representation. Proceedings of the 2014 conference on empirical methods in natural language processing (EMNLP), pp. 1532–1543.
- McCann, B.; Bradbury, J.; Xiong, C.; Socher, R. Learned in translation: Contextualized word vectors. Advances in neural information processing systems 2017, 30.
- Peters, M. E.; Neumann, M.; Iyyer, M.; Gardner, M.; Clark, C.; Lee, K.; Zettlemoyer, L. (2018) Deep contextualized word representations. arXiv:1802.05365. [Link](https://ui.adsabs.harvard.edu/abs/2018arXiv180205365P) (accessed February 01, 2018).

<div class="content-ad"></div>

14. Floridi, L.; Chiriatti, M., GPT-3: 그 특성, 범위, 한계 및 결과. Minds and Machines 2020, 30 (4), 681–694.

15. Devlin, J.; Chang, M.-W.; Lee, K.; Toutanova, K., Bert: 언어 이해를 위한 깊은 양방향 트랜스포머 사전 훈련. arXiv 사전 인쇄 arXiv:1810.04805 2018.

16. Yang, Z.; Dai, Z.; Yang, Y.; Carbonell, J.; Salakhutdinov, R. R.; Le, Q. V., Xlnet: 언어 이해를 위한 일반화된 자기 회귀 사전 훈련. 신경 정보 처리 시스템의 진보 2019, 32.

17. Vaswani, A.; Shazeer, N.; Parmar, N.; Uszkoreit, J.; Jones, L.; Gomez, A. N.; Kaiser, Ł.; Polosukhin, I., Attention is all you need. 신경 정보 처리 시스템의 진보 2017, 30.

<div class="content-ad"></div>

18. Devlin, J.; Chang, M.-W.; Lee, K.; Toutanova, K., BERT: Deep Bidirectional Transformers를 위한 사전 훈련. ArXiv 2019, abs/1810.04805.

19. Radford, A.; Narasimhan, K.; Salimans, T.; Sutskever, I., 생성 사전 훈련을 통한 언어 이해 개선. 2018.

20. Liu, Y.; Ott, M.; Goyal, N.; Du, J.; Joshi, M.; Chen, D.; Levy, O.; Lewis, M.; Zettlemoyer, L.; Stoyanov, V., Roberta: 견고하게 최적화된 bert 사전 훈련 접근 방식. arXiv 사전 인쇄 arXiv:1907.11692 2019.

21. Clark, K.; Luong, M.-T.; Le, Q. V.; Manning, C. D., Electra: 텍스트 인코더를 생성자가 아닌 판별자로 사전 훈련하는 방법. arXiv 사전 인쇄 arXiv:2003.10555 2020.

<div class="content-ad"></div>

22. Lewis, M.; Liu, Y.; Goyal, N.; Ghazvininejad, M.; Mohamed, A.; Levy, O.; Stoyanov, V.; Zettlemoyer, L. 2019. "Bart: Denoising sequence-to-sequence pre-training for natural language generation, translation, and comprehension." arXiv preprint arXiv:1910.13461 

23. Raffel, C.; Shazeer, N.; Roberts, A.; Lee, K.; Narang, S.; Matena, M.; Zhou, Y.; Li, W.; Liu, P. J. 2019. "Exploring the limits of transfer learning with a unified text-to-text transformer." arXiv preprint arXiv:1910.10683 

24. Song, K.; Tan, X.; Qin, T.; Lu, J.; Liu, T.-Y. 2020. "Mpnet: Masked and permuted pre-training for language understanding." Advances in Neural Information Processing Systems, 33, 16857–16867.

25. Wei, J.; Ren, X.; Li, X.; Huang, W.; Liao, Y.; Wang, Y.; Lin, J.; Jiang, X.; Chen, X.; Liu, Q. 2019. "Nezha: Neural contextualized representation for Chinese language understanding." arXiv preprint arXiv:1909.00204

<div class="content-ad"></div>

26. Dai, Z.; Yang, Z.; Yang, Y.; Carbonell, J.; Le, Q. V.; Salakhutdinov, R., Transformer-xl: Attentive language models beyond a fixed-length context. arXiv preprint arXiv:1901.02860 2019.

27. Sanh, V.; Debut, L.; Chaumond, J.; Wolf, T., DistilBERT, BERT의 압축 버전: 더 작고, 빠르고, 저렴하고 가벼움. arXiv preprint arXiv:1910.01108 2019.

28. Lan, Z.; Chen, M.; Goodman, S.; Gimpel, K.; Sharma, P.; Soricut, R., Albert: 자기지도 언어 표현의 가벼운 BERT. arXiv preprint arXiv:1909.11942 2019.

29. Sun, Z.; Yu, H.; Song, X.; Liu, R.; Yang, Y.; Zhou, D., MobileBERT: 자원 제한 장치를 위한 콤팩트한 범용 BERT. arXiv preprint arXiv:2004.02984 2020.

<div class="content-ad"></div>


30. Jiang, Z.-H.; Yu, W.; Zhou, D.; Chen, Y.; Feng, J.; Yan, S., Convbert: Improving bert with span-based dynamic convolution. Advances in Neural Information Processing Systems 2020, 33, 12837–12848.

31. He, P.; Liu, X.; Gao, J.; Chen, W., Deberta: Decoding-enhanced bert with disentangled attention. arXiv preprint arXiv:2006.03654 2020.

32. Zaheer, M.; Guruganesh, G.; Dubey, K. A.; Ainslie, J.; Alberti, C.; Ontanon, S.; Pham, P.; Ravula, A.; Wang, Q.; Yang, L., Big bird: Transformers for longer sequences. Advances in Neural Information Processing Systems 2020, 33, 17283–17297.

33. Peters, M. E.; Neumann, M.; Iyyer, M.; Gardner, M.; Clark, C.; Lee, K.; Zettlemoyer, L. In Deep Contextualized Word Representations, NAACL, 2018.


<div class="content-ad"></div>

34. Howard, J.; Ruder, S. Universal Language Model Fine-tuning을 위한 텍스트 분류(ACL, 2018).

35. Dai, A. M.; Le, Q. V., 준지도학습 순차 학습. 신경 정보 처리 시스템의 발전 2015, 28.

36. Phang, J.; Févry, T.; Bowman, S. R., Sentence encoders on stilts: 중간 레이블 데이터 작업에 대한 보조 훈련. arXiv 사전 인쇄 arXiv:1811.01088 2018.

37. Rebuffi, S.-A.; Bilen, H.; Vedaldi, A., 잔여 어댑터를 사용한 다중 시각 도메인 학습. 신경 정보 처리 시스템의 발전 2017, 30.

<div class="content-ad"></div>

38. 아가자니안, A.; 제틀모이어, L.; 구프타, S., 내재적 차원이 언어 모델 파인튜닝의 효과를 설명합니다. arXiv 사전 인쇄 arXiv:2012.13255 2020.

39. 주, C.; 청, Y.; 간, Z.; 선, S.; 골드스타인, T.; 리우, J., Freelb: 자연어 이해를 위한 향상된 적대적 훈련. arXiv 사전 인쇄 arXiv:1909.11764 2019.

40. 리우, P.; 위안, W.; 부, J.; 장, Z.; 하야시, H.; 노이빅, G., 사전 학습, 프롬프트 및 예측: 자연어 처리에서 프롬프트 방법의 체계적 조사. arXiv 사전 인쇄 arXiv:2107.13586 2021.

41. 양, Y.; 황, P.; 차오, J.; 리, J.; 린, Y.; 동, J. S.; 마, F.; 장, J., 적대적 예제 생성 및 강화를 위한 프롬프트 기반 접근 방법. arXiv 사전 인쇄 arXiv:2203.10714 2022.

<div class="content-ad"></div>

42. Wei, J.; Wang, X.; Schuurmans, D.; Bosma, M.; Chi, E.; Le, Q.; Zhou, D., Chain of thought prompting elicits reasoning in large language models. arXiv preprint arXiv:2201.11903 2022.

43. Liang, S.; Zhao, M.; Schütze, H., Modular and Parameter-Efficient Multimodal Fusion with Prompting. arXiv preprint arXiv:2203.08055 2022.

44. Hanna, M.; Mareček, D. In Analyzing BERT’s Knowledge of Hypernymy via Prompting, Proceedings of the Fourth BlackboxNLP Workshop on Analyzing and Interpreting Neural Networks for NLP, 2021; pp 275–282.

45. Abaho, M.; Bollegala, D.; Williamson, P.; Dodd, S., Position-based Prompting for Health Outcome Generation. arXiv preprint arXiv:2204.03489 2022.

<div class="content-ad"></div>

46. Wang, C.; Wang, J.; Qiu, M.; Huang, J.; Gao, M. In TransPrompt: Towards an Automatic Transferable Prompting Framework for Few-shot Text Classification, Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing, 2021; pp 2792–2802.

47. Lester, B.; Al-Rfou, R.; Constant, N., The power of scale for parameter-efficient prompt tuning. arXiv preprint arXiv:2104.08691 2021.