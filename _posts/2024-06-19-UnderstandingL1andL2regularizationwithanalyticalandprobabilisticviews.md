---
title: "L1 및 L2 정규화를 분석적 및 확률적 관점에서 이해하기"
description: ""
coverImage: "/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_0.png"
date: 2024-06-19 20:13
ogImage: 
  url: /assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_0.png
tag: Tech
originalTitle: "Understanding L1 and L2 regularization with analytical and probabilistic views"
link: "https://medium.com/intuition/understanding-l1-and-l2-regularization-with-analytical-and-probabilistic-views-8386285210fc"
---


## 기계 학습과 수학

![이미지](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_0.png)

기계 학습을 공부할 때 L1 및 L2 정규화를 알게 될 것입니다. 많은 멋진 블로그들이 시각화를 통해 이러한 개념을 직관적으로 설명합니다. 그러나 L1 및 L2 정규화를 해석 및 확률적 관점에서 자세히 설명하는 블로그는 거의 없습니다. 그래서 나는 두 관점 모두로 이 두 가지 정규화에 대해 쓰기로 결심했습니다. 이 블로그에서는 L1 및 L2 정규화를 상세한 수학적 유도 및 시각화와 함께 소개하여 이러한 개념을 잘 이해할 수 있도록 도와드리겠습니다.

## 목차

<div class="content-ad"></div>

- 정규화 개요
  - L1 정규화
    - 2.1 L1 정규화의 분석적 유도
    - 2.2 L1 정규화의 확률적 유도

- L2 정규화
  - 3.1 L2 정규화의 분석적 유도
  - 3.2 L2 정규화의 확률적 유도

<div class="content-ad"></div>

## 1. 규제의 개요

우선, 규제의 개념을 다시 살펴봅시다. 구체적으로 이해하기 위해 두 가지 차원을 가진 소량의 데이터를 예로 들어봅시다 [1].

![이미지](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_1.png)

보시다시피, 이 데이터는 비선형입니다. 데이터가 비선형이기 때문에 간단한 선형 회귀가 이 데이터에 적합하지 않을 것이라고 쉽게 추측할 수 있습니다. 이 경우, 비선형 데이터를 나타내기 위해 다항 회귀를 고려해 보겠습니다. 규제의 중요성을 이해하기 위해 우리는 15차 다항 회귀를 사용하여, 즉, 과도하게 복잡한 함수를 사용하여 데이터를 예측합니다.

<div class="content-ad"></div>

마크다운 형식으로 변경된 문구입니다.


![Understanding L1 and L2 regularization with analytical and probabilistic views](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_2.png)

scikit-learn 라이브러리의 PolynomialFeatures 및 Ridge 클래스를 사용하여 데이터를 적합시킵니다. 결과는 아래와 같습니다.

![Understanding L1 and L2 regularization with analytical and probabilistic views](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_3.png)

왼쪽 그림은 정규화가 없는 다항 회귀를 보여주며, 오른쪽 그림은 정규화가 적용된 다항 회귀를 보여줍니다. 정규화가 없는 다항 회귀는 원래 데이터에 비해 지나치게 복잡한 함수를 사용했기 때문에 데이터에 과적합되었습니다. 반면, 정규화가 적용된 다항 회귀는 과적합을 방지하면서 모델의 복잡성을 줄일 수 있어서 정규화가 적용되었다면 정규화가 없는 것보다 더 나은 적합을 할 수 있습니다. 일반적으로, 위의 예시처럼 모델이 과적합되는 것을 방지하기 위해 정규화를 사용합니다.


<div class="content-ad"></div>


정규화를 어떻게 할까요? 이론적으로는 정규화 용어를 목적 함수에 추가하여 이를 기반으로 매개변수를 최적화합니다. 아래에서 보여지는 것처럼요.

<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_4.png" />

정규화 용어는 계수 값이 증가하지 않을 때를 위해 패널티를 부과합니다. 그럼 계수에 패널티를 부여하는 이유는 무엇일까요? 직관적으로 이해하려면 이전 예제의 계수를 살펴보겠습니다.

<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_5.png" />

<div class="content-ad"></div>

위 줄은 정규화 없이 다항 회귀의 계수를 나타내고, 아래 줄은 정규화(L2)를 적용한 다항 회귀의 계수를 나타냅니다. 정규화 없이 다항 회귀는 더 큰 계수 값을 갖습니다. 직관적으로, 모델이 더 큰 계수 값을 갖는다는 것은 모델이 변화를 크게 일으킬 수 있다는 것을 의미합니다. 따라서, 정규화 없이 모델은 주어진 데이터와 더 정확하게 맞을 수 있지만 일반적이지는 않습니다. 한편, 정규화를 적용한 모델은 상대적으로 계수 값이 작기 때문에 주어진 데이터를 더 일반적으로 맞출 매개변수를 탐색할 수 있습니다.

지금까지 정규화의 개념과 그 효과에 대해 이해했습니다. 이제 정규화 뒤의 이론적 배경을 자세히 살펴보겠습니다.

## 2. L1 정규화

L1 정규화[2]는 계수의 절댓값 또는 계수의 l1-노름을 정규화 용어로 추가합니다. L1 정규화는 계수의 특징 선택에 도움을 줍니다. 즉, 관련 없는 독립 변수의 수를 줄일 수 있습니다. 구체적으로, L1 정규화를 적용한 회귀 모델은 Least Absolute Shrinkage and Selection Operator(Lasso) 회귀라고 불립니다. L1 정규화의 공식은 아래와 같습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_6.png)

where w is the parameter. From now on, we will learn how to solve this problem.

## 2.1 Analytical derivation of L1 regularization

How can we optimize the L1 regularization formula? To solve it analytically, this formula can be seen as constraint optimization with Lagrange multipliers.


<div class="content-ad"></div>

![Understanding L1 and L2 regularization](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_7.png)

마지막 방정식을 보시면, L1 정규화 공식과 동일합니다. 다음으로, 유도된 라그랑지안을 기반으로 매개변수를 어떻게 해석적으로 최적화할 수 있는지 알아보겠습니다. 안타깝게도, L1 정규화에 대한 닫힌 솔루션을 얻을 수는 없습니다. 왜냐하면 정규화 항을 미분할 수 없기 때문입니다. 이 사실을 아래 그림에서 확인할 수 있습니다. 두 매개변수 함수가 있다고 가정하고, L1 정규화 항을 다음과 같이 나타낼 수 있습니다:

![L1 Regularization Term](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_8.png)

가장자리에서 도함선을 계산할 때, 오른쪽과 왼쪽에서 서로 다른 값이 나오기 때문에, 가장자리에서 미분할 수 없습니다 ([7]에서 더 많은 수학적 세부사항을 확인하실 수 있습니다). 몇 가지 예외적인 상황을 제외하고 닫힌 형태의 솔루션을 찾는 것은 어렵지만, 행렬 X가 직교하고 매개변수 수가 하나인 경우 닫힌 형태의 솔루션을 찾을 수 있습니다 [3]. 그러나 이러한 상황은 실제 분석에서 드물게 발생합니다.

<div class="content-ad"></div>

그럼, 파라미터를 어떻게 찾아야 할까요? 라쏘 문제를 해결하는 가장 일반적인 방법은 서브그래디언트와 좌표 하강법입니다. scikit-learn의 구현에서는 라쏘 문제를 최적화하기 위해 좌표 하강법을 사용하므로 좌표 하강법을 배워봅시다 [4].

좌표 하강법은 간단한 아이디어입니다. n 차원 함수 f가 있다고 가정했을 때, 우리는 f를 각 파라미터 차원을 반복적으로 최소화하여 최소화합니다. 수학적 정의를 살펴봅시다.

![image](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_9.png)

이름에서 알 수 있듯이, 우리는 파라미터를 개별적으로 계산하고 이전 값에 기반하여 업데이트합니다. 이 과정은 수렴하거나 설정한 최대 반복 횟수에 도달할 때까지 계속됩니다. 정말 간단하지 않나요? 이제 라쏘 공식의 구체적인 예제를 살펴봅시다. 평균 제곱 오차(MSE)로 된 라쏘 문제를 고려해봅시다. 따라서 공식은 다음과 같을 것입니다:

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_10.png" />

포함 된 좌표 감소 방법을 사용하기 때문에, 다른 비대상 매개변수를 고정한 채 각 매개변수에 대해 이 공식을 최소화해야 합니다.

<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_11.png" />

마지막 공식은 조금 까다롭습니다 (적어도 저에게는 그렇습니다). 각 항목의 차원을 고려할 때, X의 전치 행렬의 i번째 행만 i번째 경사에 관련되어 있음을 이해할 수 있습니다. i번째 매개변수의 경사를 정식화하려면 위의 공식을 재정의해야 합니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_12.png" />

파라미터 업데이트 방정식을 얻으려면 XB 항을 분해해야 합니다. XB의 i번째 열과 다른 열로 나눕니다. 보시다시피, 파라미터 업데이트 공식을 유도할 수 있습니다. L1 정규화 항은 어떠신가요? 이를 해결하기 위해 소프트 쓰레스홀딩을 소개할 것입니다. L1 항을 미분할 수 없기 때문에, 우리는 서브그레디언트(subgradients)와 부분도함수(subdifferentials)를 사용하여 이를 근사할 것입니다. 서브그레디언트(subgradients)의 개념에 대해서는 [5]의 이론을 확인해볼 수 있습니다. 서브그레디언트를 사용하여 다음을 유도할 수 있습니다:

<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_13.png" />

Lasso 문제에서 L1 정규화 항을 대체하면 다음과 같습니다:

<div class="content-ad"></div>

아래에 있는 표를 Markdown 형식으로 변경해주세요.


![Understanding L1 and L2 regularization](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_14.png)

주어진 마지막 방정식을 재정립하여 𝛽를 구할 수 있습니다:

![Understanding L1 and L2 regularization](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_15.png)

부호 및 최댓값 함수를 사용하여 조건부 분기를 구성할 수 있습니다. 이제 우리는 수렴할 때까지 이 최종 공식을 반복하여 파라미터를 업데이트합니다. 구체적인 예시를 풀어보겠습니다. 시각화를 위해 두 개의 매개변수로 함수를 최적화하고 바이어스 항이 없다고 가정합니다.


<div class="content-ad"></div>

![UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_16](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_16.png)

정규화 강도로 𝜆 = 1을 사용하고 유도한 방정식에 따라 매개변수 값을 업데이트합니다.

이 경우 수렴이 빠르게 진행되는 것을 확인할 수 있습니다. 계수 값은 scikit-learn 구현과 거의 같습니다.

```js
# 스크래치에서 좌표 하강
b0 = 1.00, b1 = 2.00

# scikit-learn
b0 = 1.11, b1 = 2.04
```

<div class="content-ad"></div>

실제 케이스에서는 Cython을 사용하여 좌표 하강을 계산하는 scikit-learn 구현을 사용해야 합니다. 그들의 구현은 원래의 Python 코드보다 훨씬 더 빠릅니다. 추후에는 함께 사용한 코드를 공유할 예정이에요.

## 2.2 L1 규제의 확률적 유도

확률적 측면에서 L1 규제에 대해 자세히 알아보기 전에 MAP(최대 사후 확률) 추정치를 알아야 합니다. MAP 추정 및 최대 우도 추정치 사이의 차이를 배워봅시다. 이미 알고 계신 분들은 다음 섹션을 건너뛸 수 있습니다.

필수 사항 — 최대 우도 추정 및 MAP 추정

<div class="content-ad"></div>

우리가 다중 선형 함수를 갖고 있다고 가정하고, 관측된 데이터 점과 예측된 값 사이의 오차가 평균 0 및 표준 편차 𝜎를 따르는 정규 분포를 따른다고 가정합니다. 가정된 분포 하에서 오차가 발생하는 확률 밀도, 즉 우도는 다음과 같이 유도할 수 있습니다:

여기서 데이터 점의 개수를 n이라 하고 매개변수의 수를 p라고 합니다. 이 확률 밀도를 최대화하는 매개변수를 찾고 싶은데, 이를 최대 우도 추정(Maximum Likelihood Estimation, MLE)이라고 합니다. MLE 공식은 다음과 같이 쓸 수 있습니다:

<div class="content-ad"></div>

일반적으로 로그를 취하여 곱셈을 합으로 변경합니다. 빈도주의 통계학에서는 매개변수를 상수값으로 간주하지만 알 수 없으므로 미분을 사용하여 우도를 최대화하는 매개변수를 찾습니다.

반면에 베이즈 정리에서는 매개변수를 확률 변수로 취할 수 있습니다. 베이즈 정리를 적용하여 우도를 다음과 같이 볼 수 있습니다:

![image](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_19.png)

사후 확률은 우도와 사전 확률에 비례합니다. 이 설정에서는 MLE와 같이 우도를 최대화하는 대신 사후 확률을 최대화해야 합니다. 사후 확률을 최대화하는 것을 최대 사후 확률 추정이라고 하며 MAP 추정이라고 합니다. 다음과 같이 정의할 수 있습니다:

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_20.png" />

이전 예제에 적용할 때 MLE와 대조적인 점을 살펴보면:

<img src="/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_21.png" />

MAP 추정을 하는 데는 사전 확률이 필요하다는 것을 알 수 있습니다. 이를 위해 어떤 확률 분포든 사용할 수 있습니다. 이제 L1 정규화로 돌아가보겠습니다.


<div class="content-ad"></div>

확률적 유도: 라플라스 사전을 사용한 L1 정칙화

우리가 사전으로 라플라스 분포를 선택하면, MAP 추정은 L1 정칙화 공식이 됩니다. 이를 유도해 봅시다! 라플라스 사전은 아래와 같은 모양을 가진 확률 분포 중 하나입니다.

![image](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_22.png)

지수 함수의 지수항이 L1 정칙화 항과 유사함을 알 수 있습니다. 이제, 우리는 MAP 추정에서 사전 확률로 평균 0을 가진 라플라스 사전을 대입합니다.

<div class="content-ad"></div>

아래는 마지막 공식이 L1 정규화와 동일함을 확인할 수 있습니다! 직관적으로 라플라스 분포의 모양이 가우시안 분포보다 훨씬 더 날카롭습니다. 이는 아래의 해석적 유도 부분에 표시된 L1 정규화 용어와 유사합니다.

아래는 마지막 공식이 L1 정규화와 동일함을 확인할 수 있습니다! 직관적으로 라플라스 분포의 모양이 가우시안 분포보다 훨씬 더 날카롭습니다. 이는 아래의 해석적 유도 부분에 표시된 L1 정규화 용어와 유사합니다.

지금까지 해석적 및 확률적 관점에서 L1 정규화 유도를 이해했습니다. 다음에는 L2 정규화에 대해 알아보겠습니다.

<div class="content-ad"></div>

## 3. L2 정규화

L2 정규화는 계수의 제곱값 또는 계수의 L2-노름을 정규화 항으로 추가합니다. L2 정규화는 작은 계수를 유도하는 데 도움이 됩니다. L2 정규화가 적용된 회귀 모델을 Ridge 회귀라고 합니다. L2 정규화의 수식은 아래와 같습니다.

![수식](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_25.png)

## 3. 1 L2 정규화의 해석적 도출

<div class="content-ad"></div>

L1 정규화와 마찬가지로 L2 정규화 문제를 라그랑주 승수를 사용한 제한 최적화로 생각해 볼 수 있습니다.

![이미지](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_26.png)

마지막 방정식은 L2 정규화 공식과 같습니다. L1 정규화와 대조적으로 이 공식은 미분 가능합니다. 따라서 새로운 개념을 도입할 필요가 없습니다. 그저 미분하면 되죠!

![이미지](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_27.png)

<div class="content-ad"></div>

이제 L2 정규화에 대한 닫힌 형태의 해를 얻었습니다. 이를 구현하고 scikit-learn ridge 결과와 비교해 봅시다.

```python
# 샘플 데이터
X = np.random.randn(100, 2)
beta = np.array([2, 3]).reshape(1, 2)
Y = X @ beta.T + np.random.normal(beta.shape[0])

lam = 1.0
inv_mat = np.linalg.inv(X.T @ X + np.eye((X.T @ X).shape[0]))

ridge_coef = inv_mat @ X.T @ Y
print(ridge_coef.reshape(-1))
# [1.998, 2.937]

ridge = Ridge(alpha=1.0)
ridge.fit(X, Y)
print(ridge.coef_.reshape(-1))
# [1.979, 2.973]
```

거의 같은 결과를 얻을 수 있다는 것을 확인할 수 있습니다.

## 3.2 L2 정규화의 확률론적 유도

<div class="content-ad"></div>

MAP 추정을 다시 고려해 봅시다. L1 정칙화를 유도할 때는 사전 분포로 라플라스 분포를 사용합니다. L2 정칙화의 경우, 평균이 0인 가우시안 분포를 사전 분포로 활용합니다.

![image](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_28.png)

지수 함수의 거듭제곱 항이 L2 정칙화 항과 유사하다는 것을 알 수 있습니다. 이제 MAP 추정에서 평균이 0인 가우시안 사전 확률로 대체합니다.

![image](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_29.png)

<div class="content-ad"></div>

마지막 공식이 L2 정규화와 동일한 것을 확인할 수 있습니다. 직관적으로 가우시안 분포의 형태는 라플라스 사전보다 부드러운 곡선을 가집니다. 따라서 이는 L2 정규화 용어와도 유사합니다.

![이미지](/assets/img/2024-06-19-UnderstandingL1andL2regularizationwithanalyticalandprobabilisticviews_30.png)

마지막으로, 이 블로그에서 사용된 코드를 공유하겠습니다.

이 블로그에서는 L1 및 L2 정규화의 자세한 유도를 해석적 및 확률론적 관점을 통해 소개했습니다. 이 블로그가 정규화의 수학적 배경을 이해하는 데 도움이 되길 바랍니다. 읽어 주셔서 감사합니다.

<div class="content-ad"></div>

## 참고 자료

[1] Underfitting vs.Overfitting, scikit-learn 문서

[2] Manfredi, V., Lecture 12: Regularization, 웨즐리안 대학 강의

[3] https://stats.stackexchange.com/questions/17781/derivation-of-closed-form-lasso-solution

<div class="content-ad"></div>

[4] Tibshirani, R., Coordinate Descent, Carnegie Mellon 대학 강의

[5] Giba, L., Subgradient Descent Explained, Step by Step, MLC

[6] Kang, B., 정규화의 확률적 해석, Bounded Rationality

[7] https://math.dartmouth.edu/opencalc2/cole/lecture21.pdf