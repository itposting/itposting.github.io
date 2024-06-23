---
title: "서포트 벡터 머신 간단 정리  이진 분류 쉽게 이해하기"
description: ""
coverImage: "/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_0.png"
date: 2024-06-23 19:35
ogImage: 
  url: /assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_0.png
tag: Tech
originalTitle: "Simplifying Support Vector Machines — A Concise Introduction to Binary Classification"
link: "https://medium.com/towards-data-science/support-vector-machines-svm-ml-basics-machine-learning-data-science-getting-started-1683fc99cd45"
---


데이터와 컴퓨터 프로그램의 세계에서 머신 러닝이라는 개념은 어려운 문제 같을 수도 있어요. 복잡한 수학과 이해하기 어려운 개념이 가득한 것 같죠.

그래서 오늘은 여기서 멈추어서, 제 MLBasics 시리즈의 새로운 이슈를 통해 모든 것이 어떻게 작동하는지 기본적인 사항을 살펴보고 싶어요.

오늘의 안건은 서포트 벡터 머신을 이해하는 것이에요.

이 강력한 도구는 데이터를 명확한 범주로 분류하는 데 도움이 되지만...

<div class="content-ad"></div>

어떻게 동작하는 건가요?

Support Vector Machines 모델을 간단히 설명해 보겠습니다👇🏻

# Support Vector Machine이란?

Support Vector Machine (SVM)은 두 가지 다른 클래스로 데이터 포인트를 가장 잘 분리하는 초평면을 찾으려는 지도 학습 알고리즘입니다.

<div class="content-ad"></div>

이 문제는 이를 수행할 수 있는 무한한 수의 초평면이 존재한다는 점이 어렵습니다. 그래서 SVM의 목표는 클래스를 최대 여백으로 가장 잘 분리하는 초평면을 식별하는 것입니다.

![image](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_0.png)

# SVM의 주요 개념

더 깊이 파고들기 전에, 몇 가지 핵심 용어를 이해해 보겠습니다:

<div class="content-ad"></div>

- Support Vectors(서포트 벡터): 이들은 초평면에 가장 가까운 데이터 포인트로, 초평면의 위치와 방향에 큰 영향을 미칩니다.
- 여백(Margin): 여백은 초평면과 각 클래스에서 가장 가까운 데이터 포인트 사이의 거리입니다. 더 큰 여백은 분류기의 일반화를 더 잘 시킬 것입니다.
- 초평면(Hyperplane): 2차원 공간에서 데이터를 두 부분으로 나누는 선입니다. 고차원에서는 평면이나 고차원의 유사 구조체입니다.

![이미지](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_1.png)

# SVM이 작동하는 방식

두 종류의 데이터 포인트가 있는 데이터셋을 상상해보세요.

<div class="content-ad"></div>

- 파란색 🔵
- 노란색 🟨

새 데이터 포인트를 파란색 또는 노란색 중 하나로 분류하고 싶습니다. 주요 과제는 두 클래스를 분리할 수 있는 다양한 하이퍼플레인이 존재한다는 것인데, 그런 다음 큰 질문이 있습니다:

어떻게 최적의 하이퍼플레인을 찾을까요?

![이미지](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_2.png)

<div class="content-ad"></div>

가장 좋은 초평면은 두 클래스로부터 최대 거리를 가지는 것입니다. 이는 가능한 다양한 초평면을 찾고 두 클래스로부터 최대 거리를 가지는 것을 선택함으로써 수행됩니다.

# SVM 뒤에 숨겨진 수학적 직관

데이터를 분류하는 방법을 이해하기 위해 수학적 측면을 살펴보겠습니다.

점곱은 하나의 벡터를 다른 벡터에 따라 투영하는 것을 말합니다. 그래서 우리는 한 쪽의 점과 다른 쪽의 초평면이 어디에 있는지 결정하는 데 활용할 수 있습니다.

<div class="content-ad"></div>

임의의 점 X를 고려해 보면:

- 만약 X⋅W ` c 이면 — 이것은 양성 샘플입니다.
- 만약 X⋅W ` c 이면 — 이것은 음성 샘플입니다.
- 만약 X⋅W = c 이면 — 이것은 결정 경계 상에 있습니다.

쉽죠?

그러니까 조금 되감아보고 이 방정식들이 어디에서 왔는지 이해해 봅시다:

<div class="content-ad"></div>

## #1. 하이퍼플레인을 찾는 방법 결정

우리가 “분리선”을 얻기 위해, 서포트 벡터와 하이퍼플레인 사이의 거리 d를 먼저 계산할 수 있습니다. 여유 공간은 하이퍼플레인으로부터 가장 가까운 서포트 벡터까지의 거리의 두 배이며, 이 여유 공간 내에는 어떤 점도 있어서는 안 됩니다.

## #2. 거리 “d” 투영

거리 d는 두 서포트 벡터 사이의 차이를 하이퍼플레인의 법선 벡터 w의 방향으로 투영하면 얻을 수 있습니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_3.png)

여러분 중 많은 분들이 여기에 도착한 방법을 모르실 것 같아요. 그래서 한 발 물러나서 이 함수가 처음부터 무엇을 의미하는지 더 잘 이해해보도록 해요.

A와 B라는 두 벡터가 있다고 상상해봅시다. 그들 사이에 θ도를 생성해요. 이 스칼라 곱을 사용하여 A가 B 위에 떨어지는 투영을 쉽게 찾을 수 있어요.

즉, A의 B에 대한 투영을 찾을 수 있어요. A와 B 벡터를 알면 다음 수식에서도 확인할 수 있듯이요.

<div class="content-ad"></div>

그래서 이제 우리가 이 기본 원리를 이해했으니, SVM 모델로 돌아가 봅시다. SVM에 동일한 수학적 개념을 적용할 수 있습니다. 여기서 A는 지원 벡터 머신으로 정의된 벡터이고 B는 우리가 분할 초평면의 법선 벡터입니다.

## #3. 제약 조건 정의하기

이제 여백을 활용하여 제약 조건을 정의할 수 있습니다. 최대 여백 초평면이 (2D 예제에서) 선 방정식을 따라야 한다는 것을 알고 있습니다.

이것은 초평면에 놓인 것은 양수 값을 가질 것이며(양쪽 초평면에 해당), 그 아래에 있는 것은 음수 값을 가질 것입니다(음쪽 초평면에 해당).

<div class="content-ad"></div>

위 두 초평면 사이의 간격을 "마진"이라고 합니다.

## SVM의 마진

마진은 SVM에서 중요한 개념으로, 초평면 주변에 데이터 포인트가 없는 버퍼 영역으로 작용합니다. 이 마진이 넓을수록 모델이 보이지 않는 데이터에 대해 일반화할 수 있으며, 과적합 가능성을 줄입니다.

양수 또는 음수로 점을 분류하기 위해 초평면과의 상대적 위치를 기반으로 결정 규칙을 설정합니다.

<div class="content-ad"></div>

- 한 쪽에 있는 점들은 한 범주로 분류됩니다 (파란색 🔵)
- 다른 한 쪽에 있는 점들은 반대 범주에 속합니다 (노란색 🟨).

마진을 최대화함으로써 SVM은 의사결정 경계를 최적으로 배치하여 가능한 높은 신뢰도로 클래스를 분리합니다.

그러면 어떻게 최대화할까요?

# 최적화와 제약 사항

<div class="content-ad"></div>

SVM은 여백을 최대화하기 위한 최적화 문제를 해결하는 것을 포함합니다. 이는 선택한 초평면이 각 클래스의 가장 가까운 데이터 포인트에서 충분한 거리를 유지하도록 하는 것을 의미합니다. 이를 서포트 벡터라고 합니다.

이미 이전에 발견한 선 방정식을 기반으로 한 분류 알고리즘이 있습니다. 그래서 출력을 다음과 같이 정의할 수 있습니다:

- +1 또는 🔵는 양쪽의 데이터를 나타냅니다.
- -1 또는 🟨는 음쪽의 데이터를 나타냅니다.

![이미지](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_4.png)

<div class="content-ad"></div>

하지만 여전히 w 벡터와 b 매개변수를 찾아야 합니다.

그래서... 어떻게 할까요?

마진 경계에 위치하는 서포트 벡터는 우리의 양의 및 음의 초평면 내에 포함되어 있기 때문에 다음 제약 조건을 만족합니다.

그래서 이를 쉽게 일반화할 수 있어요...

<div class="content-ad"></div>

## 일반 제약 조건 방정식

모든 데이터 포인트 (x, y)가 마진을 넘어가지 않도록 하기 위해, 모든 데이터 포인트에 대한 제약 조건은 다음과 같이 요약될 수 있습니다:

![equation](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_5.png)

그리고 수행할 단계가 하나 더 남았습니다...

<div class="content-ad"></div>

## 최적화 목표

이제 일반적인 제약 방정식을 가지고 있으므로, 벡터 w의 절대값을 최소화하면서 제약 조건을 충족시킬 수 있습니다.

이는 다음과 같이 수학적으로 정의될 수 있습니다:

![equation](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_6.png)

<div class="content-ad"></div>

이 최적화 문제를 해결함으로써, 클래스 간의 최상의 분리를 보장하는 최대 마진을 가지는 초평면을 정의하는 벡터 w와 b의 최적값을 찾을 수 있습니다.

# 결론

서포트 벡터 머신은 데이터 과학자의 무기 중 강력한 도구로, 이진 분류에 효과적인 방법을 제공합니다.

클래스 간의 간격을 최대화하는 데 초점을 맞추면, SVM은 새로운 데이터에 대해 잘 일반화되는 견고한 분류기를 생성하여, 오버피팅의 위험을 줄입니다.

<div class="content-ad"></div>

SVM의 수학적 기반은 최적 초평면의 식별을 보장하여 다양한 분류 작업에 신뢰할 수 있는 선택지로 만듭니다.

복잡한 데이터셋을 다루거나 모델 성능을 향상시키려는 경우, SVM에 대한 이해와 구현은 머신러닝 도구상자를 크게 향상시킬 수 있습니다.

MLBasics 이슈를 좋아하셨나요? 그렇다면 DataBites 뉴스레터를 구독하여 최신 소식을 받아보세요!

내용을 메일로 받아보실 수 있습니다!

<div class="content-ad"></div>

![2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_7.png](/assets/img/2024-06-23-SimplifyingSupportVectorMachinesAConciseIntroductiontoBinaryClassification_7.png)

X, Threads, LinkedIn에서도 만나볼 수 있어요! 거기서는 머신러닝, SQL, Python, 데이터 시각화에 관한 일일 치트시트를 올려요.

다른 멋진 글도 여기 한번 확인해보세요! 😄