---
title: "깊은 CNN 뒤의 수학  AlexNet"
description: ""
coverImage: "/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_0.png"
date: 2024-05-27 14:19
ogImage:
  url: /assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_0.png
tag: Tech
originalTitle: "The Math Behind Deep CNN — AlexNet"
link: "https://medium.com/towards-data-science/the-math-behind-deep-cnn-alexnet-738d858e5a2f"
---

`<img src="/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_0.png" />`

합성곱 신경망(Convolutional Neural Networks, CNNs)은 주로 이미지와 같은 구조화된 배열 데이터를 처리하기 위해 고안된 깊은 신경망의 특수한 유형입니다. CNN은 이미지의 픽셀 데이터에서 직접 패턴을 인식함으로써 수동으로 특징을 추출하는 필요성을 제거합니다. CNN은 이미지 내에서 공간적 계층을 이해하는 데 특히 강력하며, 데이터를 패치 단위로 처리하는 학습 가능한 필터를 활용하여 픽셀 간의 공간적 관계를 보존합니다.

이러한 네트워크는 대량의 시각 데이터가 포함된 작업에서 매우 효과적이며, 이미지 및 비디오 인식부터 실시간 물체 감지에 이르기까지 다양한 응용 프로그램에서 널리 사용됩니다. 얼굴 인식 기술과 자율 주행 차량과 같은 발전에 중요한 역할을 하는 기술입니다.

본 문서에서는 컴퓨터 비전 분야에 큰 영향을 미친 혁신적인 CNN 아키텍처인 AlexNet을 살펴볼 것입니다. 다양한 시각 인식 작업에서 강력한 성능으로 유명한 AlexNet은 복잡한 이미지를 직접 해석하기 위해 깊은 학습을 활용합니다. 그 동작 뒤에 있는 수학 및 코드 프레임워크를 자세하게 살펴보겠습니다.

<div class="content-ad"></div>

# 목차

## 1. 소개

## 2. AlexNet 아키텍처 개요

- 2.1. 일반적인 레이어 구조
- 2.2. 출력 레이어와 Softmax 분류

## 3. AlexNet 구성 요소 깊이 있는 분석

- 3.1. ReLU 비선형성
- 3.2. 여러 개의 GPU에서의 훈련
- 3.3. 지역 반응 정규화
- 3.4. 겹치는 풀링
- 3.5. 완전 연결 레이어와 드롭아웃
- 3.6. 드롭아웃

<div class="content-ad"></div>

- 4: 훈련 과정 및 최적화

  - 4.1: 확률적 경사 하강법 매개변수
  - 4.2: 초기화
  - 4.3: 학습률 조정 전략

- 5: Python에서 AlexNet 구축

  - 5.1: AlexNet 클래스
  - 5.2: 조기 중지 클래스
  - 5.3: 트레이너 클래스
  - 5.4: 데이터 전처리
  - 5.5: 모델 훈련 및 평가

- 6: 결론

- 추가 자료

<div class="content-ad"></div>

# 1: 소개

![이미지](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_1.png)

AlexNet은 2012년 ImageNet 대규모 시각 인식 챌린지에서 우승한 이후 주목받게 된 혁신적인 딥 러닝 네트워크입니다. Alex Krizhevsky, Ilya Sutskever 및 Geoffrey Hinton이 개발한 AlexNet은 이전 최고의 26.2%에서 상위 5% 오류율을 15.3%로 크게 낮추어 이 분야에 새로운 기준을 제시했습니다. 이 업적은 복잡한 이미지 분류 작업을 대규모 데이터셋에서 처리하는 데 ReLU 활성화, GPU 가속 및 드롭아웃 정규화를 사용하는 CNN의 효과를 강조했습니다.

이 모델은 대부분의 딥 러닝 CNN에서 표준이 된 여러 계층으로 구성되어 있습니다. 이에는 합성곱 계층, 최대 풀링, 드롭아웃, 완전히 연결된 계층 및 소프트맥스 출력 계층이 포함됩니다. 이 모델의 성공은 설계 및 훈련에 대한 창의적인 접근을 통해 더 깊은 네트워크 아키텍처의 실용성을 보여 주었습니다.

<div class="content-ad"></div>

이 글에서는 AlexNet의 정교한 디자인과 수학 원리를 분석해보겠습니다. AlexNet의 훈련 절차와 최적화 기술에 대해서도 살펴볼 것이며, PyTorch를 사용하여 AlexNet을 처음부터 구축해볼 것입니다.

# 2: AlexNet 아키텍처 개요

![AlexNet Architecture](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_2.png)

## 2.1: 일반적인 레이어 구조

<div class="content-ad"></div>

AlexNet의 아키텍처는 각 레이어가 이전 레이어의 출력을 바탕으로하여 특징을 체계적으로 추출하는 방식으로 설계되어 있습니다. 다음은 레이어 및 기능의 상세한 분해 내용입니다:

입력 이미지
모델은 227x227 픽셀로 조정된 입력 이미지를 처리합니다. 각 이미지는 표준 RGB 인코딩을 반영하기 위해 세 개의 채널 (빨강, 녹색, 파랑)을 가지고 있습니다.

레이어 구성
주로 8개의 주요 레이어로 구성되어 있으며, 이 중 5개는 합성곱 레이어이고 나머지 3개는 완전히 연결된 레이어입니다. 이러한 레이어 사이에는 활성화 함수, 정규화, 풀링 및 드롭아웃이 전략적으로 적용되어 학습 효율성을 향상시키고 과적합을 줄입니다.

합성곱 레이어
최초 레이어는 96개의 커널(필터)을 사용하며, 크기는 11x11x3이며 4픽셀의 스트라이드를 사용하여 입력 이미지와 함께 컨볼루션됩니다. 이 큰 스트라이드 크기는 네트워크를 계산적으로 효율적으로 만들어 첫 번째 레이어부터 출력 공간 볼륨 크기를 크게 줄입니다.

<div class="content-ad"></div>

첫 번째 레이어의 출력은 두 번째 컨볼루션 레이어에 도달하기 전에 정규화와 맥스 풀링을 거칩니다. 이 레이어는 각각 크기가 5x5x48인 256개의 커널로 구성됩니다. 48개의 특성 맵은 이전 레이어에서 별도로 필터링된 출력에 해당하여 이 레이어가 효과적으로 특성을 섞을 수 있도록 합니다.

세 번째 컨볼루션 레이어는 일반적으로 이전 레이어에서 유도된 특성 맵의 풍부함을 유지하는 데 도움이 되는 풀링이나 정규화를 따르지 않습니다. 256개의 크기가 3x3x384인 커널이 사용되며, 이는 두 번째 레이어의 출력과 직접 연결되어 네트워크가 복잡한 특성을 포착할 수 있는 능력을 향상시킵니다.

네 번째 컨볼루션 레이어는 세 번째 레이어의 구성을 반영하지만 크기가 3x3x192인 384개의 커널을 사용하여 네트워크의 깊이를 향상시키면서 레이어의 공간적 차원을 변경하지 않습니다.

마지막 컨볼루션 레이어는 크기가 3x3x192인 256개의 커널을 사용하며 맥스 풀링 레이어가 뒤따르며, 학습 중인 특성에 회전 및 위치 불변성을 제공하고 차원을 줄이는데 도움이 됩니다.

<div class="content-ad"></div>

완전 연결 레이어들
첫 번째 완전 연결 레이어는 4096개의 뉴런을 가진 밀집 레이어입니다. 이 레이어는 이전 합성곱 레이어에서 평탄화된 결과(1차원 벡터로 변환됨)를 받아와 비선형 특징들의 결합을 학습하기 위해 고차원 공간에 투영합니다.

두 번째 완전 연결 레이어도 4096개의 뉴런을 포함하며 드롭아웃 정규화가 적용됩니다. 드롭아웃은 학습 중에 일정 비율의 입력 유닛을 무작위로 0으로 설정하여 과적합을 방지하고, 네트워크가 어떤 작은 뉴런 집합에 의존하지 않는 더 견고한 특징을 학습하도록 장려합니다.

마지막 완전 연결 레이어는 1000개의 뉴런으로 이루어져 있으며, 각각은 ImageNet 챌린지의 클래스에 대응합니다. 이 레이어는 클래스 예측에 중요하며, 일반적으로 분류 확률을 유도하기 위해 소프트맥스 함수를 사용합니다.

## 2.2: 출력 레이어와 소프트맥스 분류

<div class="content-ad"></div>

AlexNet의 마지막 레이어는 3번째 완전 연결 레이어의 logits에 softmax 함수를 적용하여 1000가지 클래스 레이블에 대한 분포를 출력하는 softmax 회귀 레이어입니다.

소프트맥스 함수는 다음과 같습니다:


$$
\frac{e^{z_i}}{\sum e^{z_i}}
$$


여기서 zi는 최종 완전 연결 레이어에서 각 클래스에 대한 로짓 또는 원시 예측 점수입니다.

<div class="content-ad"></div>

이 레이어는 각 클래스의 스코어를 지수화하여 모든 클래스의 스코어 합에 대비하여 확률로 변환하여 가장 가능성이 높은 클래스를 강조합니다.

Softmax 레이어는 이러한 확률을 출력하는 것뿐만 아니라 훈련 중 교차 엔트로피 손실의 기초를 형성하여, 예측된 확률 분포와 실제 분포(진짜 레이블) 사이의 차이를 측정합니다.

# 3: AlexNet 구성 요소의 심도 있는 분석

## 3.1: ReLU 비선형성

<div class="content-ad"></div>

렐루(Rectified Linear Unit, ReLU)는 특히 AlexNet과 같은 CNN(합성곱 신경망)에서 표준 활성화 함수가 되었습니다. 이 간단한 함수는 시그모이드 또는 하이퍼볼릭 탄젠트 함수를 사용하는 네트워크와 비교하여 모델이 더 빨리 학습하고 효과적으로 수렴하게 합니다.

ReLU의 수학적 표현은 간단합니다:

![ReLU Function](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_4.png)

이 함수는 x가 양수인 경우 x를 출력하며, 그렇지 않으면 0을 출력합니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 변경한 글입니다.

![Ramp Function](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_5.png)

그래픽적으로, 이 함수는 양수 입력에 대해 선형적으로 증가하고 음수 입력에 대해 0입니다.

Sigmoid가 Tanh에 우세한 점
ReLU는 시그모이드와 같은 전통적인 활성화 함수보다 여러 이점이 있습니다:

![Advantages of ReLU Over Sigmoid](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_6.png)

<div class="content-ad"></div>

하이퍼볼릭 탄젠트와 달리, ReLU 함수는 신경망이 수렴하는 데 도움을 줍니다.

Sigmoid와 tanh 함수에서 발생하는 사라지는 기울기 문제를 해결함으로써, 신경망이 더 빨리 수렴할 수 있습니다. 이 문제는 입력이 매우 커지면 (양방향으로 크게) 기울기가 매우 작아지는 경우 발생합니다. 이 작은 기울기로 인해 역전파 중에 가중치에 대한 업데이트가 거의 이루어지지 않아 교육 속도가 현저히 느려집니다. 이와는 대조적으로 ReLU 함수의 기울기는 음수 입력에 대해 0이고 양수 입력에 대해 1입니다. 이로써 기울기 하강을 간단하게 만들고 가속시킵니다.

활성화의 희소성을 촉진합니다. 입력 도메인의 절반에 대해 0을 출력하여 희소 데이터 표현을 내재시킴으로써, 일반적으로 Sigmoid 또는 tanh 함수로 생성되는 밀집 표현보다 희소 표현이 더 유익하다는 것으로 알려져 있습니다. 이는 대규모 이미지 인식 작업에서 특히 유익하며, 거기에 내재된 데이터 차원은 매우 높지만 정보가 상대적으로 낮을 때 더 유용합니다.

<div class="content-ad"></div>

또한 ReLU는 간단한 수학 연산을 포함합니다. 이 활성화 함수는 어떤 입력 값에 대해서도 단일 최댓값 연산이 필요하며, 시그모이드와 하이퍼볼릭 탄젠트는 계산상 더 복잡한 지수 함수를 포함하고 있어 계산이 더 많이 필요합니다. ReLU의 이러한 간단함은 특히 대규모 데이터셋에서 심층 신경망을 훈련할 때 매우 빠른 계산 성능을 제공합니다.

ReLU 함수의 음수 부분이 제로처리되기 때문에, 시그모이드나 하이퍼볼릭 탄젠트 함수와 같이 비선형 방식으로 변경되지 않는 출력의 문제를 피할 수 있습니다. 이 특성은 네트워크가 데이터를 더 깨끗하게 모델링하고 훈련 동력에서 잠재적인 문제점을 피할 수 있도록 합니다.

## 3.2: 여러 GPU에서 훈련

![image](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_8.png)

<div class="content-ad"></div>

**AlexNet**은 병렬 GPU 학습을 활용한 선도적인 합성곱 신경망 중 하나였습니다. 깊고 계산량이 많은 아키텍처를 효율적으로 다룰 수 있었습니다. 이 네트워크는 두 개의 GPU에서 동시에 작동하여 성능과 실용성을 크게 향상시키는 중요한 설계 요소입니다.

**레이어별 분배**
AlexNet의 레이어는 두 개의 GPU 사이에 분배됩니다. 각 GPU는 합성곱 레이어의 뉴런 활성화(커널)의 절반을 처리합니다. 구체적으로, 세 번째 레이어의 커널은 두 번째 레이어의 모든 커널 맵에서 입력을 받지만, 네 번째와 다섯 번째 레이어는 동일한 GPU에 위치한 커널 맵으로부터만 입력을 받습니다.

**GPU 간 통신**
GPU는 병렬 연산 결과를 통합하기 위해 출력을 결합해야 하는 특정 레이어에서 통신해야 합니다. 이 GPU 간 통신은 병렬 계산 결과를 통합하는 데 필수적입니다.

**선택적 연결성**
AlexNet의 모든 레이어가 두 개의 GPU에 모두 연결되는 것은 아닙니다. 이 선택적 연결성을 통해 GPU간 전송되는 데이터 양이 줄어들어 통신 오버헤드를 줄이고 계산 효율성을 향상시킵니다.

<div class="content-ad"></div>

이 두 가지 GPU 사이에 데이터셋 뿐만 아니라 네트워크 모델을 분할하는 전략은 AlexNet이 단일 GPU에서 실행될 때보다 더 많은 매개변수와 큰 입력 크기를 처리할 수 있도록 합니다. 추가적인 처리 능력은 AlexNet이 6000만 개의 매개변수 및 대규모 이미지 분류 작업을 효율적으로 학습하기 위해 필요한 방대한 계산을 처리할 수 있게 합니다.

더 큰 배치 크기로 학습하는 것은 여러 GPU로 가능케 됩니다. 더 큰 배치는 훈련 중에 더 안정적인 기울기 추정을 제공하여 깊은 신경망을 효율적으로 훈련하는 데 중요합니다. 여러 GPU를 사용하는 결과가 아니더라도 더 큰 배치 크기로 훈련하고 더 빠른 반복 시간을 가지는 능력은 오버피팅을 대항하는 데 도움이 됩니다. 네트워크는 더 다양한 데이터 집합을 짧은 시간 내에서 경험하며, 이는 훈련 데이터로부터 보이지 않는 데이터로 일반화하는 능력을 향상시킵니다.

## 3.3: Local Response Normalization

AlexNet의 Local Response Normalization (LRN)은 이미지 분류 작업에서 뛰어난 성능을 발휘하는 네트워크의 중요한 역할을 하는 정규화 전략입니다. 이 기술은 ReLU 비선형 활성화 함수의 출력에 적용됩니다.

<div class="content-ad"></div>

LRN 레이어는 이웃하는 뉴런들이 높은 활동을 보일 때 그 뉴런들의 반응을 억제함으로써 각 뉴런의 정규화된 출력을 계산합니다.

특징 맵 i의 (x, y) 위치에 있는 뉴런의 활동 ax, yi를 고려할 때, 반응 정규화된 활동 bx, yi는 다음과 같습니다:

\[ b*{x,y}^{i} = a*{x,y}^{i} / \left( k + \alpha \sum*{j=max(0,i-n/2)}^{min(N-1, i+n/2)}(a*{x,y}^{j})^2 \right)^{\beta} \]

여기서:

<div class="content-ad"></div>

- ax, yi는 (x, y) 위치에 커널 i를 적용하고 ReLU 함수를 적용하여 계산한 뉴런의 활성입니다.
- N은 레이어 내 커널의 총 수입니다.
- 합은 동일한 공간 위치에서 n개의 이웃 커널 맵을 대상으로 하며, N은 커널의 총 수입니다.
- k, α, β는 미리 정해진 하이퍼파라미터이며 (일반적으로 AlexNet에서 n=5, k=2, α=10e−4, β=0.75).
- bx, yi는 뉴런의 정규화된 응답입니다.

로컬 응답 정규화(LRN)는 생물학적 뉴런에서 발견된 측면 억제 개념에서 영감을 받은 인접한 뉴런들 사이의 형태의 지역 억제를 구현하는 데 사용됩니다. 이 억제는 여러 중요한 영역에서 중요한 역할을 합니다:

활동 조절
LRN은 주변 지원을 받지 않는 더 큰 활성화를 처벌함으로써 네트워크의 응답을 압도하는 단일 특성 맵을 방지합니다. 주변 활성화의 제곱 및 합을 통해 어떠한 특성도 결과에 지나치게 영향을 미치지 않도록 보장하며, 여러 입력에 대한 모델의 일반화 능력을 향상시킵니다.

대비 정규화
이웃들에 비해 두드러져 보이는 패턴을 강조함으로써 LRN은 시각 처리에서의 대비 정규화와 유사하게 기능합니다. 이 기능은 이미지의 중요한 지역적 특성을 효과적으로 강조하여 시각적 구분 과정을 지원합니다.

<div class="content-ad"></div>

에러율 감소
AlexNet에 LRN을 통합함으로써 ImageNet 분류 작업에서 상위 1 및 상위 5의 에러율을 줄이는 데 도움이 되었습니다. 이는 뉴런의 높은 활동 수준을 관리하여 네트워크의 전체적인 견고성을 향상시키는 데 도움이 됩니다.

## 3.4: 오버랩핑 풀링

오버랩핑 풀링은 합성곱 신경망(CNN)에서 사용되는 기술로, 입력 데이터의 공간 차원을 줄이고, 계산을 간단하게 만들며, 과적합을 제어하는 데 도움이 됩니다. 이는 일반적인 비오버랩핑(전통적) 맥스 풀링을 변경하여 풀링 창이 겹치도록합니다.

전통적인 맥스 풀링
전통적인 맥스 풀링에서 입력 이미지 또는 피처 맵은 풀링 필터의 크기와 일치하는 각기 다른 비오버랩핑 영역으로 나누어집니다. 각 영역에서 최대 픽셀 값이 결정되고 다음 레이어로 출력됩니다. 이 과정은 비오버랩핑 이웃에서 가장 중요한 피처를 선택하여 데이터 차원을 줄이는 데 도움이 됩니다.

<div class="content-ad"></div>

예를 들어, 2x2 풀링 크기(z)와 2픽셀 간격(stride s)을 가정하면, 필터는 입력 필드를 2픽셀씩 가로로 이동하고 2픽셀씩 세로로 이동합니다. 2의 간격은 필터가 처리하는 영역 간에 겹침이 없음을 보장합니다.

AlexNet의 중첩 풀링
AlexNet에서 사용되는 중첩 풀링은 스트라이드를 풀 크기보다 작게 설정하는 것을 의미합니다. 이 접근 방식을 사용하면 풀링 영역이 서로 겹칠 수 있으며, 동일한 픽셀이 여러 번의 풀링 작업에 포함될 수 있습니다. 이는 피쳐 맵의 밀도를 높이고 레이어를 통해 더 많은 정보를 유지하는 데 도움이 됩니다.

예를 들어, 3x3 풀링 크기와 2픽셀 간격을 사용하는 경우를 생각해 봅시다. 이 구성은 풀링 필터가 더 크지만(3x3), 이미지나 피쳐 맵을 건너갈 때마다 2픽셀씩만 이동한다는 것을 의미합니다. 결과적으로 인접한 풀링 영역은 처리되는 열 또는 픽셀 행을 공유하며, 기능 통합을 향상시킵니다.

## 3.5: 완전 연결 레이어 및 드롭아웃

<div class="content-ad"></div>

AlexNet의 아키텍처에서 컨볼루션 및 풀링 레이어를 거친 후, 네트워크의 고수준 추론은 완전 연결 레이어에 의해 수행됩니다. 완전 연결 레이어는 컨볼루션 레이어에서 특징 맵을 추출한 후 최종 분류로의 전환에 중요한 역할을 합니다.

완전 연결 (FC) 레이어는 이전 레이어의 모든 뉴런을 가져와서 (다른 완전 연결 레이어의 출력인지, 또는 풀링 또는 컨볼루션 레이어에서 나온 평탄화된 출력인지에 관곂여) 각 뉴런을 포함하는 모든 뉴런에 연결합니다. AlexNet에서는 컨볼루션과 풀링 레이어를 거친 후 세 개의 완전 연결 레이어가 이어집니다.

AlexNet의 처음 두 완전 연결 레이어는 각각 4096개의 뉴런을 가지고 있습니다. 이러한 레이어는 이전 레이어에서 식별한 지역화된 필터링된 특징을 전역적이고 고수준의 패턴으로 통합하는 데 중요합니다. 최종 완전 연결 레이어는 실제로 분류기 역할을 합니다. (이미지넷 데이터셋 기준으로 1000개의) 각 클래스 레이블에 대한 뉴런을 가지며 입력 이미지의 카테고리에 대한 네트워크의 예측을 출력합니다.

이러한 레이어의 각 뉴런은 출력 레이어를 제외하고는 ReLU (활성화 함수)를 적용합니다. 출력 레이어에서는 softmax 함수를 사용하여 출력 로짓(각 클래스에 대한 원시 예측 점수)을 클래스에 대한 확률 분포로 매핑합니다.

<div class="content-ad"></div>

최종 풀링이나 합성층에서의 출력은 일반적으로 완전 연결층으로 전달되기 전에 평탄화 과정을 거칩니다. 이 과정은 2차원 특징 맵을 1차원 특징 벡터로 변환하여 전통적인 신경망 기법을 통해 처리할 수 있도록 합니다. 최종 층의 소프트맥스 함수는 이 네트워크를 통해 학습된 특징 조합에 기반하여 각 클래스 레이블에 확률을 할당하여 입력 이미지를 분류합니다.

## 3.6: 드롭아웃

드롭아웃은 신경망에서 오버피팅을 방지하는 정규화 기법으로, 특히 AlexNet과 같은 대규모 네트워크에서 효과적입니다. 오버피팅은 모델이 훈련 데이터에 특정한 패턴을 학습하지만 새로운 데이터에는 일반화되지 않을 때 발생합니다.

AlexNet에서는 드롭아웃을 첫 번째 두 완전 연결층의 출력에 적용합니다. 이 층의 각 뉴런은 확률 p(일반적으로 0.5로 설정, 즉 50%)으로 "드롭"됩니다. 즉, 해당 뉴런은 일시적으로 네트워크에서 제거되며 모든 들어오는 및 나가는 연결도 함께 제거됩니다.

<div class="content-ad"></div>

만약 Dropout의 수학과 코드를 심층적으로 알고 싶다면, 제 이전 글의 3.4절을 살펴보시기를 강력히 추천합니다:

# 4: 훈련 과정과 최적화

## 4.1: 확률적 경사 하강법 매개변수

AlexNet에서는 훈련 중에 네트워크를 최적화하기 위해 확률적 경사 하강법(SGD)을 사용합니다. 이 방법은 손실 함수의 오차 기울기를 기반으로 네트워크의 가중치를 업데이트하며, 배치 크기, 모멘텀, 가중치 감쇠 등 매개변수의 효과적 조정이 모델의 성능과 수렴에 중요합니다. 오늘의 글에서는 Pytorch의 SGD 구현을 사용할 것이며, 이 인기있는 최적화 기법에 대해 고수준의 내용을 다룰 것입니다. 만약 낮은 수준의 내용, 수학적으로 분석하고 최적화 기법을 처음부터 구성하는 것에 관심이 있다면, 이 글을 참조해보세요:

<div class="content-ad"></div>

이제 SGD의 주요 구성 요소와 AlexNet에서 사용된 설정에 대해 알아보겠습니다:

배치 크기
배치 크기는 모델의 가중치를 업데이트하는 데 사용되는 훈련 예제 수로, 손실 함수의 경사도를 계산하는 데 사용됩니다. AlexNet에서 배치 크기는 128로 설정되어 있습니다. 이 크기는 더 많은 메모리 및 계산을 필요로하는 더 큰 배치와 더 많은 예제를 토대로 계산되어 생긴 정확도 사이의 균형을 유지합니다.

128의 배치 크기를 선택한 것은 경사도 추정을 안정화시켜 업데이트를 더 부드럽고 신뢰할 수 있게 만들어줍니다. 더 큰 배치는 경사도 계산에서의 노이즈를 줄여 각 업데이트에 대한 더 명확한 신호를 제공하지만, 더 많은 계산 리소스가 필요하며 때로는 훈련 데이터로부터 새로운 상황으로 효과적으로 일반화시키지 못할 수도 있습니다.

모멘텀
SGD의 모멘텀은 올바른 방향으로 업데이트를 가속시키고 옵티마이저가 취한 경로를 부드럽게 만들어줍니다. 이는 이전 업데이트 벡터의 일부분을 포함하여 업데이트 규칙을 수정합니다. AlexNet에서 모멘텀 값은 0.9로 설정되어 있어, 이전 업데이트 벡터의 90%가 현재 업데이트에 기여합니다. 이 높은 모멘텀 수준은 작지만 일관된 경사도와 함께 작동할 때 특히 손실 함수의 최솟값으로 수렴 속도를 높여줍니다.

<div class="content-ad"></div>

모멘텀을 사용하면 업데이트가 올바른 방향으로 이동하는 것뿐만 아니라 일관된 기울기를 가진 손실 함수의 위상을 따라 속도가 증가하는 것을 보장합니다. 이 측면은 어떠한 얕은 지역 최솟값이나 산점이 더 효과적으로 탈출하는 데 중요합니다.

가중치 감쇠
가중치 감쇠는 큰 가중치를 처벌하는 정규화 항으로 작용하여 가중치 값의 일부를 손실 함수에 추가함으로써 사용됩니다. AlexNet은 이 매개변수를 0.0005로 설정하여 가중치가 너무 커지는 것을 방지하고 네트워크의 많은 매개변수로 인해 과적합이 발생할 수 있는 것을 예방합니다.

AlexNet과 같이 복잡한 모델에서 높은 용량으로 인해 과적합되기 쉬운 상황에서 가중치 감쇠는 필수적입니다. 가중치의 크기를 처벌함으로써, 가중치 가중 특성에 지나치게 의존하지 않도록 하는 일반화된 모델을 유도합니다.

AlexNet의 가중치에 대한 업데이트 규칙은 다음과 같이 설명할 수 있습니다:

<div class="content-ad"></div>

이 표는 아래와 같이 만들 수 있습니다.


![image](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_10.png)

여기에서:

- vt는 이전 단계의 모멘텀 강화 업데이트 벡터입니다.
- μ (AlexNet의 경우 0.9)는 이전 업데이트의 영향을 강화하는 모멘텀 요소입니다.
- ϵ은 업데이트 단계의 크기를 결정하는 학습률입니다.
- ∇L은 가중치에 대한 손실 함수의 기울기를 나타냅니다.
- λ (AlexNet의 경우 0.0005)는 큰 가중치에 대한 처벌로 과적합의 위험을 줄이는 가중치 감쇠 요소입니다.
- w는 가중치 자체를 나타냅니다.

이러한 설정은 네트워크가 효율적으로 학습하고 보도 및 보지 않은 데이터에 대해 견고한 성능을 달성하도록 도와줍니다. 이는 학습 속도와 정확도를 최적화하고 일반화 능력을 유지하는데 도움이 됩니다.


<div class="content-ad"></div>

## 4.2: 초기화

딥 신경망을 훈련하는 데 있어 가중치와 편향을 적절하게 초기화하고 학습 속도를 조심스럽게 조절하는 것이 매우 중요합니다. 이러한 요소들은 네트워크가 수렴하는 속도와 훈련 및 검증 데이터에 대한 전반적인 성능에 영향을 미칩니다.

가중치 초기화

![이미지](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_11.png)

<div class="content-ad"></div>

AlexNet에서 컨볼루션 레이어의 가중치는 평균이 0이고 표준 편차가 0.01인 정규 분포에서 초기화됩니다. 이 좁은 표준 편차는 초기에 어떤 단일 뉴런도 출력을 지배하지 못하게하여 가중치 초기화의 균일한 스케일을 보장합니다.

마찬가지로, 완전 연결 레이어의 가중치도 가우시안 분포에서 초기화됩니다. 이 분포의 분산에 특별히 주의하여 레이어 간 출력 분산을 일관되게 유지하는 것은 더 깊은 네트워크의 안정성을 유지하는 데 중요합니다.

이 과정을 더 잘 이해하기 위해 Python으로 AlexNet의 초기화를 처음부터 구축해 봅시다:

```python
import numpy as np

def initialize_weights(layer_shapes):
    weights = []
    for shape in layer_shapes:
        if len(shape) == 4:  # 이것은 conv 레이어입니다: (out_channels, in_channels, filter_height, filter_width)
            std_dev = 0.01  # conv 레이어용 표준 편차
            fan_in = np.prod(shape[1:])  # in_channels, filter_height, filter_width의 곱
        elif len(shape) == 2:  # 이것은 완전 연결 레이어입니다: (out_features, in_features)
            # He 초기화: std_dev = sqrt(2. / fan_in)
            fan_in = shape[1]  # 입력 피처의 수
            std_dev = np.sqrt(2. / fan_in)  # ReLU를 유지하는 것이 권장되는 분산
        else:
            raise ValueError("잘못된 레이어 형태입니다: 4D(conv) 또는 2D(fc)여야 합니다")

        # 가우시안 초기화
        weight = np.random.normal(loc=0, scale=std_dev, size=shape)
        weights.append(weight)

    return weights

# 예시 사용법:
layer_shapes = [
    (96, 3, 11, 11),  # Conv1 레이어: 96 필터, 3 입력 채널, 11x11 필터 크기
    (256, 96, 5, 5),  # Conv2 레이어: 256 필터, 96 입력 채널, 5x5 필터 크기
    (384, 256, 3, 3), # Conv3 레이어: 384 필터, 256 입력 채널, 3x3 필터 크기
    (384, 384, 3, 3), # Conv4 레이어: 384 필터, 384 입력 채널, 3x3 필터 크기
    (256, 384, 3, 3), # Conv5 레이어: 256 필터, 384 입력 채널, 3x3 필터 크기
    (4096, 256*6*6),  # FC1 레이어: 4096 출력 피처, (256*6*6) 입력 피처
    (4096, 4096),     # FC2 레이어: 4096 출력 피처, 4096 입력 피처
    (1000, 4096)      # FC3 (출력) 레이어: 1000 클래스, 4096 입력 피처
]

initialized_weights = initialize_weights(layer_shapes)
for idx, weight in enumerate(initialized_weights):
    print(f"Layer {idx+1} weights shape: {weight.shape} mean: {np.mean(weight):.5f} std dev: {np.std(weight):.5f}")
```

<div class="content-ad"></div>

initialize_weights 함수는 각 레이어의 가중치 차원을 설명하는 튜플 목록을 가져옵니다. 컨볼루션 레이어는 네 가지 차원(필터 수, 입력 채널, 필터 높이, 필터 너비)을 기대하고, 완전히 연결된 레이어는 두 가지 차원(출력 피처, 입력 피처)을 기대합니다.

컨볼루션 레이어에서는 표준 편차가 0.01로 고정되어 있으며, 한 개의 뉴런에 의한 지나친 출력을 방지하기 위해 원래 AlexNet 구성과 일치시킵니다.

완전히 연결된 레이어에서는 He 초기화(ReLU 활성화 함수를 사용하는 레이어에 대한 좋은 방법론)를 사용합니다. 여기서 표준 편차는 sqrt(2/fan_in)으로 조정되어 출력 분산을 일정하게 유지함으로써 딥 네트워크에서 안정적인 학습을 촉진합니다.

layer_shapes에 정의된 각 레이어에 대해 Gaussian(정규) 분포의 평균인 0에서 초기화된 가중치가 계산됩니다.

<div class="content-ad"></div>

편향 초기화
어떤 합성곱 레이어의 편향은 1로 설정되며 특히 ReLU 활성화 함수 뒤에 오는 레이어에서 사용됩니다. 이 초기화는 뉴런 출력 값을 ReLU 함수의 양수 범위로 밀어넣어 훈련 초기부터 활성화되도록 보장합니다. 다른 레이어의 편향은 중립적인 출력을 위해 0으로 초기화됩니다.

일부 합성곱 레이어와 마찬가지로, 완전히 연결된 레이어의 편향도 1로 설정됩니다. 이 전략은 훈련 초기에 뉴런이 양수 활성화 상태에 있도록하여 훈련 시작 시 죽은 뉴런을 방지하는 데 도움이 됩니다.

## 4.3: 학습률 조정 전략

AlexNet은 초기 학습률을 0.01로 시작합니다. 이 비율은 기울기에 상당한 업데이트를 허용해 초기 진행을 신속하게 돕습니다만, 학습 과정이 발산할 위험이 없는 정도로 너무 높지 않습니다.

<div class="content-ad"></div>

훈련 중에 미리 정해진 지점에서 학습률을 10 배 감소시킵니다. 이 방식은 "단계 감소"라고 알려져 있습니다. AlexNet에서 이러한 조정은 일반적으로 검증 오류율이 크게 감소하지 않을 때 발생합니다. 이러한 지점에서 학습률을 감소시킴으로써 가중치 조정을 미세 조정하여 더 나은 수렴을 이끌어냅니다.

더 높은 학습률로 시작하는 것은 모델이 잠재적인 국지 최솟값을 더 효과적으로 극복하도록 도와줍니다. 네트워크가 안정화되기 시작하면 학습률을 줄이는 것이 더 넓고 평평한 최솟값으로 안정화되게 도와줄 수 있습니다. 일반적으로 이는 새로운 데이터에 대한 일반화에 더 적합합니다.

훈련이 진행됨에 따라 학습률을 낮추면 보다 세밀한 가중치 조정이 가능해집니다. 이 점진적인 정제는 모델이 훈련 데이터에 더 잘 맞도록 도와주며, 검증 데이터에 대한 성능도 향상시켜 모델이 훈련 예시만 외우는 것이 아니라 이를 통해 일반화를 실제로 학습하게 도와줍니다.

# 5: Python에서 AlexNet 만들기

<div class="content-ad"></div>

이 섹션에서는 PyTorch를 사용하여 Python에서 AlexNet을 재현하는 단계별 프로세스를 자세히 설명하여 클래스 아키텍처, 초기 설정, 훈련 절차 및 평가 기술에 대한 통찰을 제공합니다.

오늘 다룰 모든 코드가 포함된 이 Jupyter 노트북을 열어 두는 것을 권장합니다:

## 5.1: AlexNet 클래스

먼저 AlexNet의 메인 클래스를 구축하는 것부터 시작해 봅시다:

<div class="content-ad"></div>

```js
# PyTorch로 신경망을 생성하고 학습하기 위한 코드입니다.
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data.dataset import random_split

# 운영 체제 확인을 위한 모듈
import platform

# 데이터셋을 로드하고 변환하기 위한 torchvision
import torchvision
import torchvision.transforms as transforms

# 학습률을 조정하기 위한 ReduceLROnPlateau 모듈
from torch.optim.lr_scheduler import ReduceLROnPlateau

# 숫자 연산을 위한 numpy
import numpy as np

# 시각화를 위한 matplotlib
import matplotlib.pyplot as plt

class AlexNet(nn.Module):
    def __init__(self, num_classes=1000):
        super(AlexNet, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(64, 192, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(192, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
        )
        self.avgpool = nn.AdaptiveAvgPool2d((6, 6))
        self.classifier = nn.Sequential(
            nn.Dropout(),
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x
```

`AlexNet` 클래스는 `nn.Module`을 상속하여 PyTorch에서 모든 신경망 모듈의 기본 클래스인 `nn.Module`을 사용합니다. PyTorch에서 새로운 신경망 구조는 `nn.Module`을 서브클래싱하여 생성됩니다.

<div class="content-ad"></div>

초기화 메서드는 AlexNet 객체가 생성될 때 어떻게 구성되어야 하는지를 정의합니다. num_classes 매개변수를 선택적으로 받아 출력 클래스의 수를 유연하게 조절할 수 있으며, 기본값은 ImageNet 작업에 일반적인 1000입니다.

특성 레이어

```js
self.features = nn.Sequential(
  nn.Conv2d(3, 64, (kernel_size = 11), (stride = 4), (padding = 2)),
  nn.ReLU((inplace = True)),
  nn.MaxPool2d((kernel_size = 3), (stride = 2)),
  nn.Conv2d(64, 192, (kernel_size = 5), (padding = 2)),
  nn.ReLU((inplace = True)),
  nn.MaxPool2d((kernel_size = 3), (stride = 2)),
  nn.Conv2d(192, 384, (kernel_size = 3), (padding = 1)),
  nn.ReLU((inplace = True)),
  nn.Conv2d(384, 256, (kernel_size = 3), (padding = 1)),
  nn.ReLU((inplace = True)),
  nn.Conv2d(256, 256, (kernel_size = 3), (padding = 1)),
  nn.ReLU((inplace = True)),
  nn.MaxPool2d((kernel_size = 3), (stride = 2))
);
```

여기에 AlexNet의 합성곱 레이어가 정의됩니다. nn.Sequential 컨테이너는 레이어 시퀀스를 감싸고, 데이터는 추가된 순서대로 이러한 레이어를 통과합니다.

<div class="content-ad"></div>

```js
nn.Conv2d(3, 64, (kernel_size = 11), (stride = 4), (padding = 2));
```

첫 번째 레이어는 2D 합성곱 레이어(nn.Conv2d)로, 입력 채널은 3개(RGB 이미지)이고, 출력 채널은 64개(특성 맵)이며, 커널 크기는 11x11, 스트라이드는 4이고, 양쪽에 2씩 패딩이 적용됩니다. 이 레이어는 입력 이미지를 처리하고 특성 추출을 시작합니다.

```js
nn.ReLU((inplace = True));
```

그런 다음 ReLU 활성화 함수를 통과합니다. 이는 비선형성을 도입하여 모델이 복잡한 패턴을 학습하도록 합니다. inplace=True 매개변수는 입력을 직접 수정하여 메모리를 절약하는 데 도움이 됩니다.

<div class="content-ad"></div>

```js
nn.MaxPool2d((kernel_size = 3), (stride = 2));
```

맥스 풀링 레이어는 입력 특성 맵의 공간 차원을 줄여주어 모델이 입력 이미지의 특징의 위치에 더 견고해지도록 합니다. 이 레이어는 3x3 크기의 창과 2의 보폭을 사용합니다.

추가의 nn.Conv2d와 nn.MaxPool2d 레이어가 뒤따르며 특성 표현을 더욱 정제하고 간결하게 만듭니다. 각각의 합성곱 레이어는 일반적으로 풀링을 통해 특성 맵의 차원을 줄이면서 특성 맵의 수를 증가시키는데, 이는 공간적인 입력으로부터 점진적으로 더 많은 의미 정보를 포함하는 특징으로 추상화하는 데 도움이 됩니다.

적응형 풀링 및 분류기



<div class="content-ad"></div>

```js
self.avgpool = nn.AdaptiveAvgPool2d((6, 6))
```

avgpool은 특징 맵을 자동으로 6x6의 고정 크기로 풀링하며, 완전 연결 레이어의 입력 크기 요구 사항과 일치시키기 위해 필요하며, 네트워크가 다양한 입력 차원을 처리할 수 있도록 합니다.

```js
self.classifier = nn.Sequential(
  nn.Dropout(),
  nn.Linear(256 * 6 * 6, 4096),
  nn.ReLU((inplace = True)),
  nn.Dropout(),
  nn.Linear(4096, 4096),
  nn.ReLU((inplace = True)),
  nn.Linear(4096, num_classes)
);
```

classifier라는 또 다른 순차적 컨테이너를 정의했습니다. 이 컨테이너에는 네트워크의 완전 연결 레이어가 포함되어 있습니다. 이 레이어들은 합성곱 레이어에 의해 추출된 추상적인 특징에 기초하여 최종 분류를 수행합니다.

<div class="content-ad"></div>

nn.Dropout()은 각 forward 호출마다 입력 텐서의 요소 중 일부를 확률이 0.5로 임의로 0으로 만들어 과적합을 방지하는 데 도움이 됩니다.

nn.Linear(256 _ 6 _ 6, 4096)은 적응형 풀링 레이어의 네트워크망 피처들을 4096 크기의 벡터로 재구성합니다. 학습된 가중치로 각 입력을 모든 출력에 연결합니다.

마지막으로 nn.ReLU 및 nn.Dropout 호출은 학습 경로를 더 정제하여 비선형 활성화 지점과 정규화를 제공합니다. 최종 nn.Linear 레이어는 차원을 4096에서 num_classes로 줄여 각 클래스에 대한 원시 점수를 출력합니다.

Forward 메소드

<div class="content-ad"></div>

```js
def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x
```

`forward` 메서드는 네트워크의 순전파 실행을 지시합니다:

- `x = self.features(x)`는 입력을 컨볼루션 레이어를 통해 처음의 특성 추출을 수행합니다.
- `x = self.avgpool(x)`는 특성에 적응적 풀링을 적용하여 크기를 표준화합니다.
- `x = torch.flatten(x, 1)`은 출력을 벡터로 평탄화하여 분류를 위해 준비합니다.
- `x = self.classifier(x)`은 평탄화된 벡터를 분류기를 통해 각 클래스에 대한 예측을 생성합니다.

## 5.2: 조기 중단(Class)



<div class="content-ad"></div>

훈련 중인 머신 러닝 모델이 유효성 검사 손실이 개선되지 않을 때 훈련 프로세스를 중지하는 EarlyStopping 클래스를 사용합니다. 이 방법은 오버피팅을 방지하고 최적의 시점에 훈련을 중지하여 컴퓨팅 자원을 절약하는 데 중요합니다.

```js
class EarlyStopping:
    """
    성능이 향상되지 않을 때 훈련을 중지하는 얼리 스톱핑 클래스

    Args:
    -----
        patience (int): 훈련을 중지하기 전 대기할 에폭 수
        verbose (bool): True인 경우 손실이 개선되지 않는 각 에폭마다 메시지 출력
        delta (float): 개선으로 간주할 모니터링 중량의 최소 변경량
    """
    def __init__(self, patience=7, verbose=False, delta=0):
        self.patience = patience
        self.verbose = verbose
        self.counter = 0
        self.best_score = None
        self.early_stop = False
        self.delta = delta

    def __call__(self, val_loss):
        """
        Args:
        -----
            val_loss (float): 모델 성능이 개선되었는지 확인하는 검증 손실

        Returns:
        --------
            bool: 손실이 개선되지 않았으면 True, 그렇지 않으면 False를 반환
        """
        score = -val_loss

        if self.best_score is None:
            self.best_score = score
        elif score < self.best_score + self.delta:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_score = score
            self.counter = 0
```

초기화

```js
def __init__(self, patience=7, verbose=False, delta=0):
        self.patience = patience
        self.verbose = verbose
        self.counter = 0
        self.best_score = None
        self.early_stop = False
        self.delta = delta
```

<div class="content-ad"></div>

EarlyStopping 클래스는 작동을 구성하는 여러 매개변수로 초기화됩니다:

patience은 훈련을 중지하기 전에 검증 손실이 향상되기를 기다릴 에포크 수를 결정합니다. 기본값으로 7로 설정되어 있어서 모델이 손실 경치(plateaus)를 극복할 여지를 줍니다.

verbose는 클래스의 출력을 제어합니다. True로 설정하면 손실이 개선되지 않는 각 epoch에 대한 메시지를 인쇄하여 훈련 중 명확한 피드백을 제공합니다.

델타는 손실 개선으로 간주되는 임계값을 설정하여 조기 중지 메커니즘의 민감도를 미세 조정하는 데 도움을 줍니다.

<div class="content-ad"></div>

**호출 가능한 메서드**

```python
def __call__(self, val_loss):
    score = -val_loss

    if self.best_score is None:
        self.best_score = score
    elif score < self.best_score + self.delta:
        self.counter += 1
        if self.counter >= self.patience:
            self.early_stop = True
    else:
        self.best_score = score
        self.counter = 0
```

`__call__` 메서드는 EarlyStopping 인스턴스를 함수처럼 사용할 수 있도록 해주어 교육 루프에 통합하는 과정을 간단하게 만듭니다. 현재 에포크의 검증 손실을 기반으로 모델의 성능이 향상되었는지를 평가합니다.

이 메서드는 먼저 검증 손실을 최대화해야 하는 점수로 변환합니다. 손실을 부정하여 이루어진 점수(score = -val_loss)입니다. 이것은 낮은 손실이 더 좋다는 것을 의미합니다. 이 첫 평가(self.best_score가 None)일 경우, 메서드는 현재 점수를 초기 best_score로 설정합니다.

<div class="content-ad"></div>

현재 점수가 self.best_score에 작은 델타를 더한 값보다 적으면, 의미 있는 개선이 없음을 나타내므로 counter가 증가합니다. 이 counter는 개선이 없는 epoch가 몇 번 경과했는지를 추적합니다. counter가 인내 임계값에 도달하면, 학습을 중단해야 함을 나타내는 early_stop 플래그가 트리거됩니다.

반대로, 현재 점수가 개선되면, 메소드는 새 점수로 self.best_score를 업데이트하고 counter를 0으로 재설정하여 미래 개선을 위한 새 기준을 반영합니다.

이 메커니즘은 의미 있는 개선이 없는 지정된 epoch 횟수 후에만 학습 프로세스가 중지되도록 보장하므로, 학습 단계를 최적화하고 과소적합 모델로 이어질 수 있는 조기 중지를 방지합니다. 인내와 델타를 조정함으로써 사용자는 학습 성능의 변화에 대해 조기 중지가 얼마나 민감한지를 조정할 수 있어서 특정 시나리오와 데이터셋에 맞게 사용자 정의할 수 있습니다. 이 맞춤 설정은 계산 자원과 시간의 제약 사항에 따라 최상의 모델을 얻기 위해 중요합니다.

## 5.3: Trainer 클래스

<div class="content-ad"></div>

트레이너 클래스는 전체 훈련 워크플로우를 포함하며, 에포크를 반복하고 훈련 루프를 관리하며 역전파를 처리하고 훈련 효율성과 효과를 최적화하기 위해 조기 중지 프로토콜을 구현합니다.

```js
class Trainer:
    """
    모델을 훈련하는 Trainer 클래스.

    Args:
    -----
        model (nn.Module): 신경망 모델.
        criterion (torch.nn.modules.loss): 손실 함수.
        optimizer (torch.optim): 옵티마이저.
        device (torch.device): 모델을 실행할 장치.
        patience (int): 훈련을 중지하기 전까지 기다리는 에포크 수.
    """
    def __init__(self, model, criterion, optimizer, device, patience=7):
        self.model = model
        self.criterion = criterion
        self.optimizer = optimizer
        self.device = device
        self.early_stopping = EarlyStopping(patience=patience)
        self.scheduler = ReduceLROnPlateau(self.optimizer, 'min', patience=3, verbose=True, factor=0.5, min_lr=1e-6)
        self.train_losses = []
        self.val_losses = []
        self.gradient_norms = []

    def train(self, train_loader, val_loader, epochs):
        """
        모델을 훈련합니다.

        Args:
        -----
            train_loader (torch.utils.data.DataLoader): 훈련 데이터셋을 위한 DataLoader.
            val_loader (torch.utils.data.DataLoader): 검증 데이터셋을 위한 DataLoader.
            epochs (int): 모델을 훈련할 에포크 수.
        """
        for epoch in range(epochs):
            self.model.train()
            for images, labels in train_loader:
                images, labels = images.to(self.device), labels.to(self.device)

                self.optimizer.zero_grad()
                outputs = self.model(images)
                loss = self.criterion(outputs, labels)
                loss.backward()
                self.optimizer.step()

            self.train_losses.append(loss.item())

            val_loss = self.evaluate(val_loader)
            self.val_losses.append(val_loss)
            self.scheduler.step(val_loss)
            self.early_stopping(val_loss)

            # 훈련 및 검증 손실 기록
            print(f'에포크 {epoch+1}, 훈련 손실: {loss.item():.4f}, 검증 손실: {val_loss:.4f}')

            if self.early_stopping.early_stop:
                print("조기 중지")
                break

    def evaluate(self, test_loader):
        """
        테스트 데이터셋에 대해 모델을 평가합니다.

        Args:
        -----
            test_loader (torch.utils.data.DataLoader): 테스트 데이터셋을 위한 DataLoader.

        Returns:
        --------
            float: 테스트 데이터셋의 평균 손실.
        """
        self.model.eval()
        total_loss = 0
        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(self.device), labels.to(self.device)

                outputs = self.model(images)
                loss = self.criterion(outputs, labels)
                total_loss += loss.item()

        return total_loss / len(test_loader)

    def accuracy(self, test_loader):
        """
        테스트 데이터셋에서 모델의 정확도를 계산합니다.

        Args:
        -----
            test_loader (torch.utils.data.DataLoader): 테스트 데이터셋을 위한 DataLoader.

        Returns:
        --------
            float: 테스트 데이터셋에서 모델의 정확도.
        """
        self.model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(self.device), labels.to(self.device)

                outputs = self.model(images)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        return correct / total

    def plot_losses(self, window_size=100):
        # 이동 평균 계산
        train_losses_smooth = self.moving_average(self.train_losses, window_size)
        val_losses_smooth = self.moving_average(self.val_losses, window_size)

        # 그래프 그리기
        plt.plot(train_losses_smooth, label='훈련 손실')
        plt.plot(val_losses_smooth, label='검증 손실')
        plt.legend()
        plt.grid()
        plt.title('손실')

    def moving_average(self, data, window_size):
        return np.convolve(data, np.ones(window_size)/window_size, mode='valid')
```

초기화

```js
def __init__(self, model, criterion, optimizer, device, patience=7):
    self.model = model
    self.criterion = criterion
    self.optimizer = optimizer
    self.device = device
    self.early_stopping = EarlyStopping(patience=patience)
    self.scheduler = ReduceLROnPlateau(self.optimizer, 'min', patience=3, verbose=True, factor=0.5, min_lr=1e-6)
    self.train_losses = []
    self.val_losses = []
    self.gradient_norms = []
```

<div class="content-ad"></div>

Trainer 클래스는 인공 신경망 모델, 손실 함수, 옵티마이저 및 모델이 실행될 장치(CPU 또는 GPU)로 초기화됩니다. 이 설정을 통해 모든 모델 연산이 적절한 하드웨어로 전달되도록 보장됩니다.

또한 조기 종료 및 학습률 감소 전략을 구성합니다:

- 조기 종료: 검증 손실을 모니터링하고 주어진 에포크 수(인내심) 동안 개선이 없는 경우 훈련을 중지합니다.
- ReduceLROnPlateau: 검증 손실의 개선이 멈추면 학습률을 줄이는데, 이는 가중치 공간에서 더 작은 단계를 밟아 모델을 세밀하게 조정하는 데 도움이 됩니다.

여기서 train_losses와 val_losses는 각각 훈련 및 검증 단계의 에포크당 손실을 수집하여 성능 추적 및 나중 분석을 위해 사용됩니다. gradient_norms는 기울기의 크기를 저장하는 데 사용될 수 있으며, 디버깅 및 기울기가 소멸되거나 폭발하지 않도록 확인하는 데 유용합니다.

<div class="content-ad"></div>

훈련 방법

```js
def train(self, train_loader, val_loader, epochs):
    for epoch in range(epochs):
        self.model.train()
        for images, labels in train_loader:
            images, labels = images.to(self.device), labels.to(self.device)

            self.optimizer.zero_grad()
            outputs = self.model(images)
            loss = self.criterion(outputs, labels)
            loss.backward()
            self.optimizer.step()

        self.train_losses.append(loss.item())

        val_loss = self.evaluate(val_loader)
        self.val_losses.append(val_loss)
        self.scheduler.step(val_loss)
        self.early_stopping(val_loss)

        # 훈련 및 검증 손실 기록
        print(f'Epoch {epoch+1}, Training Loss: {loss.item():.4f}, Validation Loss: {val_loss:.4f}')

        if self.early_stopping.early_stop:
            print("조기 종료")
            break
```

이 훈련 방법은 지정된 epoch 수동안 모델 훈련을 조정합니다. 데이터 일괄 처리, 역전파를 통한 모델 가중치 업데이트, 각 epoch 종료 시 검증 세트를 사용하여 모델 성능을 평가합니다.

각 epoch 이후에 훈련 및 검증 손실을 기록하고 필요 시 학습률을 업데이트합니다. 조기 종료 조건이 트리거된 경우, 검증 손실을 평가한 후 조기 중지할 수 있습니다.

<div class="content-ad"></div>

평가 및 정확도 방법

```python
def evaluate(self, test_loader):
    self.model.eval()
    total_loss = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(self.device), labels.to(self.device)

            outputs = self.model(images)
            loss = self.criterion(outputs, labels)
            total_loss += loss.item()

    return total_loss / len(test_loader)

def accuracy(self, test_loader):
    self.model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(self.device), labels.to(self.device)

            outputs = self.model(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    return correct / total
```

평가 방법은 주어진 데이터셋(일반적으로 검증 또는 테스트 세트)에서 모델의 성능을 평가하고 평균 손실을 반환합니다. 이 방법은 모델을 평가 모드로 설정하고 데이터셋을 반복하여 각 배치에 대해 손실을 계산하고 모든 배치를 통해 평균 손실을 계산합니다.

accuracy는 예측된 레이블을 실제 레이블과 비교하여 주어진 데이터셋에서 모델의 정확도를 계산합니다. 이 방법은 평가 모드에서 데이터셋을 처리하고 모델의 예측을 사용하여 올바른 예측 수를 계산하고 정확도 백분율을 반환합니다.

<div class="content-ad"></div>

시각화를 위한 유틸리티 메서드

```js
def plot_losses(self, window_size=100):
        # 이동 평균 계산
        train_losses_smooth = self.moving_average(self.train_losses, window_size)
        val_losses_smooth = self.moving_average(self.val_losses, window_size)

        # 플롯
        plt.plot(train_losses_smooth, label='훈련 손실')
        plt.plot(val_losses_smooth, label='검증 손실')
        plt.legend()
        plt.grid()
        plt.title('손실')

    def moving_average(self, data, window_size):
        return np.convolve(data, np.ones(window_size)/window_size, mode='valid')
```

이 메서드는 모델이 과적합을 시작하거나 시간이 지남에 따른 손실 감소와 같은 추세를 더 명확하게 보여주기 위해 지정된 epoch 창을 통해 부드럽게 표시된 학습 및 검증 손실을 시각화합니다.

## 5.4: 데이터 전처리

<div class="content-ad"></div>

AlexNet 모델을 효과적으로 훈련시키려면 해당 모델의 입력 요구 사항에 맞게 데이터 전처리가 필요합니다. 구체적으로는 AlexNet이 원래 디자인된 차원과 정규화 표준에 부합해야 합니다.

변환하기

```js
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # AlexNet 호환을 위해 이미지 크기를 224x224로 조정
    transforms.ToTensor(),  # 이미지를 PyTorch 텐서로 변환
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # 텐서를 정규화
])
```

transforms.Resize((224, 224))는 이미지의 크기를 224x224 픽셀로 조정하여 AlexNet 모델에서 필요로 하는 입력 크기와 일치시키며, 모든 입력 이미지가 동일한 크기를 갖도록 합니다.

<div class="content-ad"></div>

transforms.ToTensor()은 이미지를 PIL 형식이나 NumPy 배열에서 PyTorch 텐서로 변환합니다. PyTorch 모델은 입력을 텐서 형식으로 기대하기 때문에 이 과정은 필수적입니다.

transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))은 이미지 텐서를 정규화합니다. 이 구체적인 정규화는 세 개의 채널 (RGB)에 대해 평균과 표준 편차를 0.5로 조정하여 픽셀 값을 [-1, 1] 범위로 조정합니다. 이 단계는 입력을 표준화하여 모델의 학습 과정을 원활하게 만드는 데 중요합니다.

데이터셋 로딩

```js
trainset = torchvision.datasets.CIFAR10((root = "./data"), (train = True), (download = True), (transform = transform));

testset = torchvision.datasets.CIFAR10((root = "./data"), (train = False), (download = True), (transform = transform));

classes = ("plane", "car", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck");
```

<div class="content-ad"></div>

여기서 CIFAR-10 데이터 세트를 훈련 및 테스트용으로 로드합니다. 미리 훈련된 모델을 학습하는 데 널리 사용되는 ImageNet 데이터 세트를 선택하지 않았을 수도 있습니다. ImageNet은 상당한 컴퓨팅 리소스와 오랜 학습 시간이 필요하므로 일반 노트북에서 시도하기를 권장하지 않습니다. 대신, CIFAR-10 데이터 세트를 선택했는데, 이 데이터 세트는 10가지 다른 클래스로 분산된 60,000장의 32x32 컬러 이미지를 포함하고 있습니다. 각 클래스당 6,000장의 이미지가 있습니다.

참고: CIFAR-10 데이터 세트는 MIT 라이선스에 따라 오픈 소스로 사용할 수 있습니다. 이 라이선스는 상용 응용프로그램을 포함하여 다양한 용도로 자유롭게 사용할 수 있습니다.

분할 및 데이터 로더

```python
train_split = 0.8
train_size = int(train_split * len(trainset))
val_size = len(trainset) - train_size
train_dataset, val_dataset = random_split(trainset, [train_size, val_size])

train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=64, shuffle=True)
val_loader = torch.utils.data.DataLoader(val_dataset, batch_size=64, shuffle=False)
test_loader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=False)
```

<div class="content-ad"></div>

훈련 데이터는 80%를 훈련용으로, 20%를 검증용으로 나눠놨어요. 이 방식은 모델을 보이지 않은 데이터로 튜닝하여 적절한 일반화 능력을 향상시키는 데 자주 사용됩니다.

훈련, 검증 및 테스트 데이터셋을 배치 크기 64로 생성하기 위해 DataLoader 객체를 사용했어요. 훈련 데이터는 셔플링을 통해 무작위성을 보장하며, 이는 모델이 데이터의 순서에서 잘못된 패턴을 배우는 가능성을 줄여 더 효과적으로 학습하게 도와줍니다.

데이터 시각화

```js
dataiter = iter(train_loader)
images, labels = next(dataiter)

def imshow(img):
    img = img / 2 + 0.5  # 정상화해주세요
    npimg = img.numpy()
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    plt.show()

imshow(torchvision.utils.make_grid(images[:5]))
print(' '.join('%5s' % classes[labels[j]] for j in range(5)))
```

<div class="content-ad"></div>

먼저 이미지를 되돌리기 위해 (img = img / 2 + 0.5)를 사용합니다. 여기서 imshow는 텐서를 넘파이 배열로 변환하고, 차원 순서를 matplotlib.pyplot.imshow()에서 요구하는 형식으로 변경합니다.

그런 다음, 데이터 세트에서 첫 번째 5개 이미지를 표시합니다:

![이미지](/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_12.png)

## 5.5: 모델 훈련 및 평가

<div class="content-ad"></div>

마침내 AlexNet 모델의 훈련 환경을 설정했고, PyTorch를 사용하여 훈련 프로세스를 실행하고 테스트 데이터셋에서 모델의 성능을 평가했습니다.

하지만 먼저, 성능 효율성을 극대화할 최상의 컴퓨팅 리소스(CPU 또는 GPU)를 사용하는지 확인해야 합니다.

```js
# 시스템의 운영 체제 확인
if platform.system() == 'Darwin':  # Darwin은 macOS의 약칭입니다
    try:
        device = torch.device('cuda')
        _ = torch.zeros(1).to(device)  # CUDA 사용 가능 여부에 따라 오류가 발생합니다
    except:
        device = torch.device('mps' if torch.backends.mps.is_built() else 'cpu')
else:
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
```

여기서는 시스템이 macOS('Darwin')인지 식별하고 CUDA를 사용하도록 구성을 시도합니다. 일반적으로 macOS에서 NVIDIA GPU가 없어 CUDA를 사용할 수 없는 경우, Apple의 Metal Performance Shaders(MPS)를 사용할 수 있는 경우 MPS를 선택하거나 그렇지 않으면 CPU를 선택합니다.

<div class="content-ad"></div>

macOS 이외의 운영 체제에서는 CUDA를 직접 사용하려고 시도하고 CUDA를 사용할 수 없는 경우 CPU로 기본 설정됩니다.

모델, 손실 함수 및 옵티마이저 초기화
다음으로, AlexNet 모델을 초기화하고 계산 장치를 지정하고 손실 함수 및 옵티마이저를 설정합니다:

```python
model = AlexNet(num_classes=10).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
```

10개 클래스로 AlexNet의 인스턴스가 생성되며, 즉시 지정된 장치(GPU 또는 CPU)로 전송됩니다. 이를 통해 모델의 모든 계산이 지정된 장치에서 수행되도록 보장합니다.

<div class="content-ad"></div>

CrossEntropyLoss 함수는 다중 클래스 분류 문제에 대해 일반적으로 사용됩니다.

SGD (확률적 경사 하강법) 옵티마이저는 모델의 매개변수, 학습률 0.01 및 모멘텀 0.9로 초기화됩니다. 이것들은 많은 시각 기반 작업에 대해 시작할 때 표준값입니다.

모델 훈련
모델은 지정된 epoch 수 동안 훈련되며 데이터를 배치로 처리하고 손실을 계산하며 역전파를 수행하고 검증 손실을 기반으로 조기 중지를 적용합니다:

```js
trainer = Trainer(model, criterion, optimizer, device, (patience = 7));
trainer.train(train_loader, val_loader, (epochs = 50));
```

<div class="content-ad"></div>

train 메서드는 훈련 및 검증 데이터 로더를 사용하여 모델을 50번의 에포크 동안 훈련시킵니다. 이 메서드는 데이터 로더에서 배치를 세심하게 처리하고 손실을 계산하며 가중치를 업데이트하기 위한 백프로파게이션을 수행하고, 검증 데이터셋을 사용하여 모델을 정기적으로 평가하여 검증 손실에 개선이 없을 경우 조기 중단을 구현합니다.

모델 평가
훈련 후에는 다음과 같이 테스트 세트에서 모델의 성능을 평가합니다.

```js
test_loss = trainer.evaluate(test_loader)
print(f'Test Loss: {test_loss:.4f}')

accuracy = trainer.accuracy(test_loader)
print(f'Test Accuracy: {accuracy:.2}')
```

마지막으로, 훈련 및 검증 손실을 시각화하여 모델의 학습 진행 상황을 모니터링합니다:

<div class="content-ad"></div>

```js
trainer.plot_losses((window_size = 3));
```

이 코드는 plot_losses 메소드를 호출하여 훈련 및 검증 손실을 시각화합니다. 손실 값은 윈도우에 스무싱되어 있습니다 (이 경우 3개의 데이터 포인트로) 노이즈 없이 트렌드를 더 잘 시각화하기 위해. 이 코드를 실행하면 다음과 같은 손실을 기대할 수 있습니다:

<img src="/assets/img/2024-05-27-TheMathBehindDeepCNNAlexNet_13.png" />

위 그래프에서 보듯이, 모델 훈련은 21번의 epoch 후에 중지되었고 우리가 인내 값으로 7을 설정하고 14번째 epoch 이후에는 검증 손실이 개선되지 않았기 때문입니다. 이 설정은 교육 목적을 위해 만들어졌으므로 AlexNet을 능가하는 것이 목표가 아님을 명심해 주세요.

<div class="content-ad"></div>

개발자님, 친구 같은 톤으로 번역해드리겠습니다.

에포크 수나 인내심을 늘려 검증 손실이 더 떨어질 수 있는지 확인해보는 것을 권장합니다. AlexNet의 성능을 향상시킬 수 있는 변경 및 업데이트 사항이 몇 가지 있습니다. 이 기사에서는 30분 시간 제한으로 인해 이러한 조정 사항을 다루지 않지만, 모델 성능을 개선할 수 있는 다양한 고급 기술을 탐색할 수 있습니다.

더 많은 실험을 원하시는 분들을 위해 학습률 조정, 네트워크 아키텍처 조정, 더 고급 정규화 방법 사용 등 매개변수 조정을 시도해보세요. 더 최적화 및 세밀한 조정 기술들은 다음 기사에서 더 자세히 탐구할 수 있습니다:

# 6: 결론

AlexNet은 신경망 설계 및 학습 기술의 발전에서 중요한 모델로, 딥러닝 분야에서 중요한 이정표 역할을 하였습니다. ReLU 활성화, 겹치는 풀링, 그리고 GPU 가속 학습의 혁신적인 사용은 신경망의 효율성과 효과성을 현저히 향상시켜, 모델 아키텍처에 새로운 기준을 제시하였습니다.

<div class="content-ad"></div>

AlexNet으로의 드롭아웃 및 데이터 증강 기법 도입은 신경망의 오버피팅 문제를 해결하고 일반화 능력을 향상시켜 다양한 작업에 더 견고하고 다재다능하게 만들었습니다. 이러한 기술들은 현대 딥 러닝 프레임워크에서 핵심적인 역할을 하며, 다양한 후속 혁신에 영향을 미쳤습니다.

## 추가 자료

- Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). ImageNet Classification with Deep Convolutional Neural Networks. Advances In Neural Information Processing Systems. [링크](http://www.image-net.org/challenges/LSVRC/2012/supervision.pdf)
- LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature, 521(7553), 436–444. [링크](https://doi.org/10.1038/nature14539)

<div class="content-ad"></div>

Cristian Leo (2024). The Math Behind Convolutional Neural Networks, [link](https://medium.com/towards-data-science/the-math-behind-convolutional-neural-networks-6aed775df076)

마지막까지 읽어주셔서 감사합니다! 이 글이 마음에 드셨다면 좋아요를 눌러 주시고 제 팔로우도 부탁드립니다. 앞으로도 비슷한 글을 정기적으로 업로드할 예정이에요. 제 목표는 가장 인기있는 알고리즘들을 처음부터 다시 만들어 기계 학습을 모두에게 접근하기 쉽게 만드는 것입니다.
