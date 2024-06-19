---
title: "질문-답변 캐글 대회에서 Sentence Transformer를 활용하기"
description: ""
coverImage: "/assets/img/2024-06-19-Question-AnswerKaggleCompetitionusingSentenceTransformer_0.png"
date: 2024-06-19 20:34
ogImage: 
  url: /assets/img/2024-06-19-Question-AnswerKaggleCompetitionusingSentenceTransformer_0.png
tag: Tech
originalTitle: "Question-Answer Kaggle Competition using Sentence Transformer"
link: "https://medium.com/@gowthamaddluri/why-and-how-do-we-use-rag-with-llms-871f07f29f18"
---


이 대회는 DataTalks.Club 코스의 Q&A 비디오에서 얻은 독특한 데이터셋을 활용하여 참가자들에게 질문과 정확한 답변을 맞추도록 도전합니다.

위 노트북에서는 Pandas를 사용하여 CSV 파일의 데이터를 정리하고 분석하여 데이터프레임에 저장하는 방법을 사용했습니다. 이를 위해 sentence transformer를 활용하였습니다. 첫 번째로, 해당 usecase에 대해 triplet loss를 사용해 보았는데, 이는 지도 학습 유사성 또는 메트릭 학습에 가장 많이 사용되는 손실 함수 중 하나입니다. 가장 간단하게 설명하면, Triplet Loss는 유사하지 않은 쌍이 비슷한 쌍에서 최소한 일정한 여백 값만큼 떨어져 있도록 장려합니다.

이 때의 점수는 0.69이었는데, Triplet pair는 (질문, 답변, 다른 가능한 답변(100% 관련은 아님))이었습니다. Triplet loss는 질문과 답변의 임베딩을 가깝게 정렬하고 다른 가능한 답변은 멀게 밀어냅니다.

다음 시도한 단계는 다른 여러 가능한 답변을 추가하는 것이었습니다. 예를 들어, 각 질문에 대해 같은 질문과 답변에 대한 세 가지 다른 가능한 답변이있는 샘플이 세 개씩 포함되었습니다. 이것은 학습이 잘 되지 않았고, 0.5648의 점수가 나왔는데, 이는 질문, 답변 쌍 당 하나의 샘플만 사용하는 것보다 훨씬 낮은 점수입니다.

<div class="content-ad"></div>

다음으로, [(a1, b1), …, (an, bn)]를 사용하는 MultipleNegativesRankingLoss를 사용하여 간단하게 만들고 싶습니다. 여기서 (ai, bi)가 유사한 문장이며 (ai, bj)가 다른 문장으로 가정됩니다. 여기서 i != j 입니다.

이는 (ai, bi) 사이의 거리를 최소화하고 동시에 모든 i != j에 대해 (ai, bj)의 거리를 최대화합니다. 이렇게 하면 부정적인 것을 지정할 필요가 없고 i != j의 경우 거리를 자동으로 최대화합니다. 성능이 향상되었다 0.962를 얻었습니다.

질문당 하나의 샘플을 가진 triple loss에 대한 KaggleNotebook

질문당 여러 샘플을 가진 triple loss에 대한 KaggleNotebook.

<div class="content-ad"></div>

이 작업을 더 개선하려면 쌍을 사용하는 대신 삼중체를 추가하고 세 번째는 "하드-부정사"여야 합니다. 이때, 어휘 수준에서는 (a1, b1)과 유사하지만 의미 수준에서는 (a1, b1)과 유사하지 않아야 합니다.