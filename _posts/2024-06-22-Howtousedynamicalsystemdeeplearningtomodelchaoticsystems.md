---
title: "혼돈 시스템을 모델링하는 동적 시스템 딥러닝 활용 방법"
description: ""
coverImage: "/assets/img/2024-06-22-Howtousedynamicalsystemdeeplearningtomodelchaoticsystems_0.png"
date: 2024-06-22 20:20
ogImage: 
  url: /assets/img/2024-06-22-Howtousedynamicalsystemdeeplearningtomodelchaoticsystems_0.png
tag: Tech
originalTitle: "How to use dynamical system deep learning to model chaotic systems"
link: "https://medium.com/@machine-learning-made-simple/how-to-use-dynamical-system-deep-learning-to-model-chaotic-systems-64f38bf3bd39"
---


## 매우 중요한 기법 요약

혼돈 시스템은 모델링하기 매우 어렵습니다. 최상의 결과를 얻기 위해서는 딥 러닝과 강력한 규칙 기반 분석을 결합하는 것이 좋습니다.

잘 수행된 예시로는 타임 시리즈 데이터를 사용하여 시스템의 attractor 즉, 시스템이 추구하는 상태의 집합을 재구성하는 Dynamical System Deep Learning (DSDL)가 있습니다. DSDL은 시스템의 동역학을 포착하기 위해 단변량(시간) 및 다변량(공간) 재구성을 결합합니다.

여기 해당 기법의 스파크노트 요약입니다:

<div class="content-ad"></div>

DSDL는 시계열 데이터를 활용하여 얼마든지 다양한 초기 조건 하에서 시스템이 수렴할 상태의 집합인 끌근을 재구성합니다.

DSDL는 원래 끌근(A)을 재구성하기 위해 두 가지 기둥을 결합합니다: 단변량과 다변량 재구성. 각 재구성 방법에는 고유한 이점이 있습니다. 단변량 방법은 대상 변수의 시간 정보를 캡처합니다. 한편 다변량 방법은 시스템 변수 간의 공간 정보를 캡처합니다. 함께 알아보겠습니다.

단변량 재구성(D)은 단일 변수의 시간 지연 샘플을 사용하여 과거의 행동을 캡처하고 미래 트렌드를 예측합니다. 이는 미래의 변동을 예측하기 위해 과거 온도 데이터를 활용하는 것과 유사하며, 혼돈된 시스템 내에서의 단일 변수의 기본 동역학에 대한 통찰력을 제공합니다.

다변량 재구성(N)은 보다 종합적인 방식으로 다루며, 온도, 압력, 습도와 같은 다양한 변수를 포함하여 복잡한 관계를 캡처하고 시스템의 전체적인 동역학을 이해합니다. 이 방법은 이러한 변수들이 서로 연결되어 있고 서로 영향을 주며 혼돈된 시스템 내에서 서로 영향을 미친다는 것을 인식합니다. DSDL은 이러한 복잡하고 종종 예측할 수 없는 상호작용을 모델링하기 위해 비선형 신경망을 사용하여 정확한 예측과 시스템의 동작에 대한 심층적인 이해를 제공합니다.

<div class="content-ad"></div>

이 접근 방식은 데이터 내의 숨겨진 패턴과 관계를 식별하여 혼돈된 시스템에 대한 더 효과적인 제어 전략과 더 많은 정보 기반의 의사 결정을 이끌어냅니다.


![image](/assets/img/2024-06-22-Howtousedynamicalsystemdeeplearningtomodelchaoticsystems_0.png)


마지막으로, diffeomorphism 맵을 사용하여 재구성된 어트랙터를 원래 어트랙터와 관련시킵니다. 내가 이해한 바에 따르면, diffeomorphism은 매니폴드 간의 함수입니다(매니폴드는 곡선과 표면을 고차원으로 일반화한 것입니다) 그리고 양쪽 방향 모두에서 연속적으로 미분 가능합니다. 간단히 말해, 두 공간 간의 매끈하고 역함수 가능한 맵입니다. 이렇게 함으로써 우리는 공간의 위상을 보존할 수 있습니다. N과 D가 모두 동등하므로 ('논문에서 위상 동형'임), 그들을 연결할 수 있는 맵이 있다는 것을 알 수 있습니다.

이를 통해 DSDL은 시스템의 미래 상태에 대한 예측을 수행할 수 있습니다.


<div class="content-ad"></div>

여기 간단한 시각화입니다. 구성 요소들이 어떻게 연결되는지 확인해보세요.

![Visualization](/assets/img/2024-06-22-Howtousedynamicalsystemdeeplearningtomodelchaoticsystems_1.png)

혼돈 시스템을 모델링하는 데 사용된 더 많은 기술을 확인하려면 저희 논의 "AI가 혼돈 시스템을 예측하는 데 사용될 수 있을까요?"를 참조해보세요.

이 기사가 마음에 들었다면 공유하고 싶다면 아래 가이드라인을 참조해주세요.

<div class="content-ad"></div>

그게 이번 내용이에요. 시간 내어 주셔서 감사해요. 언제나 제 작업에 관심이 있거나 다른 작품을 확인하고 싶다면, 제 링크가 메일/게시물 끝에 나올 거예요. 이 글에서 가치를 찾았다면, 더 많은 사람들과 공유해 주시면 감사하겠어요. 여러분과 같은 입소문 추천이 저를 성장시키죠.

![이미지](/assets/img/2024-06-22-Howtousedynamicalsystemdeeplearningtomodelchaoticsystems_2.png)

정보가 풍부하고 유용하며 영향을 받지 않는 작업을 만들기 위해 많은 노력을 기울였어요. 제 글을 지원하고 싶다면, 인기있는 이 뉴스레터의 유료 구독자가 되어주시기를 고려해 주세요. 그렇게 하면 글쓰기/연구에 더 많은 노력을 기울일 뿐 아니라 더 많은 사람들에게 도달하고, 제 초콜릿 우유 중독을 지원해 주는 데 도움이 돼요. 매주 10만 명 이상의 독자에게 인공지능(AI) 연구 및 엔지니어링의 중요한 아이디어를 민주화하도록 도와주세요.

제게 초콜릿 우유를 사줘요~

<div class="content-ad"></div>

PS- 저희는 "원하는 대로 지불" 모델을 따르고 있어요. 이는 여러분의 가능한 한 방법으로 지원할 수 있게 해줍니다. 자세한 내용을 확인하고 여러분에게 적합한 요금제를 찾아보세요.

저는 X(https://twitter.com/Machine01776819), Threads(https://www.threads.net/@iseethings404), TikTok(https://www.tiktok.com/@devansh_ai_made_simple)에서 읽은 내용에 대한 미니 업데이트를 정기적으로 공유하고 있습니다. 제 학습 내용을 계속 따라가고 싶다면 거기서 저를 팔로우해주세요.

# 저에게 연락해주세요

아래의 링크를 사용하여 제 다른 콘텐츠를 확인하거나 과외에 대해 자세히 알아보거나 프로젝트에 대해 저에게 연락하거나 그냥 인사를 전해주세요.

<div class="content-ad"></div>

여기서는 기술, AI 및 기계 학습에 관한 작은 단편들이 있어요

AI 뉴스레터- https://artificialintelligencemadesimple.substack.com/

내 할머니가 좋아하는 기술 뉴스레터- https://codinginterviewsmadesimple.substack.com/

다른 기사들은 저의 Medium에서 확인하세요. : https://rb.gy/zn1aiu

<div class="content-ad"></div>

내 YouTube: https://rb.gy/88iwdd

LinkedIn에서 나에게 연락하세요. 함께 연결합시다: https://rb.gy/m5ok2y

내 Instagram: https://rb.gy/gmvuy9

내 Twitter: https://twitter.com/Machine01776819