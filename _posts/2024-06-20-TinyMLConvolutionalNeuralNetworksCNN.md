---
title: "마이크로 머신러닝  합성곱 신경망 CNN"
description: ""
coverImage: "/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_0.png"
date: 2024-06-20 16:55
ogImage: 
  url: /assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_0.png
tag: Tech
originalTitle: "TinyML — Convolutional Neural Networks (CNN)"
link: "https://medium.com/@thommaskevin/tinyml-convolutional-neural-networks-cnn-3601b32c35f4"
---


수학적 기초부터 엣지 구현까지

# 소셜 미디어:

👨🏽‍💻 Github: thommaskevin/TinyML (github.com)
👷🏾 Linkedin: Thommas Kevin | LinkedIn
📽 Youtube: Thommas Kevin — YouTube
👨🏻‍🏫 연구 그룹: Conecta.ai (ufrn.br)

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_0.png)

<div class="content-ad"></div>

## 요약

# 1 — 컨볼루션 신경망 역사

컨볼루션 신경망(CNN)의 개념은 1980년대 금사이 후코시마의 연구로 형성되기 시작했습니다. 그는 Neocognitron을 개발했는데, 이는 동물의 시각 시스템 구조에서 영감을 받아 자가 조직화 과정을 통해 시각적 패턴을 인식할 수 있는 학습이 가능한 계층적 구조를 가졌습니다. 이 작업은 현대 CNN의 개발을 위한 중요한 선행 연구였습니다.

<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_1.png" />

<div class="content-ad"></div>

CNN의 현대 아키텍처는 얀 르쿤과 그의 동료들에 의해 1980년대 후반과 1990년대 초에 제안되었습니다. 그들은 MNIST 데이터셋에서 손으로 쓴 숫자를 인식하기 위해 설계된 컨볼루션 신경망인 LeNet-5를 개발했습니다. LeNet-5는 여러 개의 컨볼루션 레이어를 거친 후 pooling 레이어와 완전 연결 레이어로 이어지는 구조로, 오늘날 사용되는 CNN의 아키텍처의 기초를 구축했습니다.

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_2.png)

초기 성공에도 불구하고 CNN의 활용은 계산 제약과 대규모 레이블 데이터셋의 부족으로 제한되었습니다. 그러나 컴퓨팅 파워가 증가하고 GPU(그래픽 처리 장치)를 사용해 딥 네트워크를 훈련하는 기술이 실현 가능해지면서 CNN은 더 많은 관심을 끌게 되었습니다. 게다가 ImageNet과 같은 대규모 레이블 이미지 데이터베이스의 개발은 딥 네트워크를 효과적으로 훈련하기 위한 필수 자료를 제공했습니다.

2012년에 Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton이 개발한 AlexNet이 ImageNet 대규모 시각 인식 챌린지(ILSVRC)에서 경쟁 상대들보다 큰 폭으로 우승하면서 전환점이 찾아왔습니다. AlexNet은 여러 컨볼루션 레이어, ReLU 활성화 함수, 그리고 dropout과 같은 정규화 기법을 활용하여 시각 인식 작업에 CNN의 성능을 입증했습니다. 이후로 CNN은 다양한 응용 분야에 대한 주요 도구가 되어 지속적인 혁신을 이끌어내는 데 이르렀습니다. VGGNet, GoogLeNet(Inception), ResNet과 같은 모델들은 네트워크의 깊이, 효율성, 정확도를 향상시키기 위한 새로운 아키텍처와 기법들을 소개했습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_3.png" />

지금은 CNN이 많은 인공지능 시스템의 필수 구성 요소입니다. 이미지 인식 뿐만 아니라 비디오 분석, 자연어 처리, 의학 진단, 자율 주행차 등 다양한 분야에서 사용됩니다. 연구는 계속해서 발전하고 있으며, 효율적인 합성곱 신경망, 깊은 신경망(DNNs), 생성적 적대 신경망(GANs) 등의 혁신이 이루어지고 있습니다.

# 2— 합성곱 신경망 이론

수학에서 "합성곱"은 한 함수가 다른 함수에 의해 변환되는 통합 연산을 나타냅니다. 그러나 신경망의 맥락에서는 이 개념이 전통적인 통계적 해석과 다릅니다.

<div class="content-ad"></div>

기본적으로 우리는 입력 함수로 시작합니다. 우리의 경우에는 주로 이미지입니다. 또한, 필터(커널이라고도 함)를 소개합니다. 이미지는 점곱 연산을 통해 변환되는 함수로, 일반적으로 "합성곱(convolution)"이라고 합니다. 그 다음, 이러한 필터를 입력 이미지에 적용하면 "특성 맵(feature maps)"이라고 하는 출력 이미지를 얻게 됩니다.

## 2.1 — 합성곱 계층

합성곱 계층은 패턴을 감지하고 필터(커널)를 통해 특성 맵을 생성하기 위해 이미지가 처리되는 곳입니다. 이러한 특성 맵은 필터가 식별하려는 각 속성을 나타냅니다. 필터는 일반적으로 (3x3) 또는 (5x5) 행렬로 구성되어 있으며, 각 필터는 입력 이미지에서 동일한 크기의 필드를 차지합니다. 그런 다음, 필터가 한 칸씩 가로로 이동하고 같은 프로세스가 반복됩니다. 가로 끝에 도달하면 필터가 한 칸 아래로 이동하고 점곱 프로세스가 다시 수평으로 적용됩니다. 그 결과는 순서대로 출력에 추가되어 특성 맵을 생성합니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/0*4UZXfXs7eQ3TT02M.gif)

<div class="content-ad"></div>

입력 이미지를 나타내는 텐서 I의 차원이 m1 x m2 x mc인 경우를 가정해 봅시다. 이 텐서에서,

![image1](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_4.png)

우리는 입력 이미지와 일치하는 채널 수를 가진 (n1 x n2 x nc) 차원을 가지는 필터를 적용합니다. 이 필터는 이미지를 왼쪽에서 오른쪽으로 움직이면서, 입력 텐서 I의 해당 영역과 요소별 곱셈을 수행하고 이러한 곱셈 결과를 합산합니다. 스트라이드 매개변수는 필터가 이미지를 횡단하는 단계 크기를 결정합니다. I와 K 사이의 이 작업의 결과는 다른 차원 (m1 - n1 + 1) x (m2 - n2 + 1) x 1을 가진 또 다른 텐서를 생성합니다.

![image2](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_5.png)

<div class="content-ad"></div>

안녕하세요,

<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_6.png" />

특징 맵의 (i, j)번째 항목은 다음과 같이 계산됩니다:

<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_7.png" />

<div class="content-ad"></div>

다음 예를 선택했습니다. 5x5x1 차원 이미지가 3x3x1 커널로 합성되고 s=1 스트라이드가 적용됩니다.

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_8.png)

특징 맵의 (i, j)-번째 항목은 단일 채널에 대한 다음 일반 공식으로 주어집니다:

![formula](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_9.png)

<div class="content-ad"></div>

위 예에서 feature map의 (1, 1)번 째 항목을 계산해 봅시다:

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_10.png)

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_11.png)

사용할 수 없는 항목은 0으로 대체되었습니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_12.png)

마찬가지로, 남은 항목들은 동일한 공식을 사용하여 계산할 수 있습니다. 이 과정은 서로 다른 유형의 필터를 적용함으로써 반복되며, 각각이 이미지의 다른 특징을 캡처하는 것을 보여줍니다. 예를 들어, 필터 개수가 하나 이상이 될 수 있어서 스트라이드 개념이 도입됩니다.

## 2.2— 패딩 레이어

기본 CNN은 (n x n) 크기의 흑백 이미지와 (f x f) 크기의 필터/커널을 사용하여 결과를 제공하며, 출력 크기는 (n - f + 1) x (n - f + 1)이 됩니다. 예를 들어, (8 x 8) 이미지와 (3 x 3) 필터를 사용한 어떤 합성 곱 작업의 경우, 출력 이미지 크기는 (6 x 6)이 됩니다. 이러한 크기의 감소는 이미지 처리 중 일관적으로 발생하며, 레이어의 출력이 일반적으로 입력보다 작습니다. 또한, 합성 곱 작업에서 사용되는 필터는 픽셀을 횡단하면서 항상 모서리에 초점을 두지 않습니다.


<div class="content-ad"></div>


![TinyML CNN](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_13.png)

머신 러닝에서 일반적으로 사용되는 여러 유형의 패딩이 있습니다:

- Same 패딩: Same 패딩은 원본 이미지의 외부 프레임에 일반적으로 0과 같은 추가 요소를 추가하는 것을 포함합니다. 이 방식으로 입력을 확장함으로써, 필터가 더 넓은 영역을 스캔할 수 있게 되어 출력 이미지가 원본과 동일한 크기를 유지할 수 있습니다. 이것은 컨볼루션 작업 중 공간적 차원을 유지하는 데 유용합니다.
- Valid 패딩: Same 패딩과는 달리, Valid 패딩은 이미지에 추가 요소를 추가하는 것을 포함하지 않습니다. 필터는 추가 요소 없이 원본 이미지를 훑어갑니다. 이것은 간격으로 인한 일부 데이터 손실이 발생할 수 있지만, valid 패딩은 출력 피쳐 맵의 크기를 줄이고자 할 때 사용됩니다. 이러한 축소는 모델의 매개변수 수를 줄이고 계산 효율성을 향상시킬 수 있습니다.
- Causal 패딩: Causal 패딩은 주로 시퀀스-투-시퀀스 모델 및 시계열 예측에 사용되며, 특히 1차원 컨볼루션 레이어에서 사용됩니다. 이 유형의 패딩은 데이터 시퀀스의 시작 부분에 요소를 추가하여 알고리즘이 초기 시간 단계에 대한 값을 예측할 수 있게 합니다. 과거 및 현재 데이터를 예측에 포함시킴으로써, causal 패딩은 모델이 추론 중에 사용할 수 없는 미래 데이터를 활용하지 않도록 보장합니다.
- Full 패딩: 이 유형의 패딩은 입력의 테두리 주위에 여러 레이어의 0을 추가하여 원본 이미지 크기보다 큰 출력 피쳐 맵을 생성합니다. Full 패딩은 덜 일반적이지만 더 큰 출력 크기가 필요한 특정 시나리오에서 사용할 수 있습니다.

## 2.3 —Pooling Layer


<div class="content-ad"></div>

풀링 레이어에서는 컨볼루션된 특징의 공간 차원이 일반적으로 축소되어 입력 이미지에서 주요한 특징을 추출하는 데 도움이 됩니다. 이 크기의 축소는 컨볼루션 레이어에서 얻은 출력에 풀링 함수를 적용하여 달성됩니다. 이렇게 가정해 봅시다:

![그림 1](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_14.png)

풀링된 부분의 차원은 다음과 같습니다:

![그림 2](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_15.png)

<div class="content-ad"></div>

딥러닝에서는 3가지 종류의 풀링이 있어요:

평균 풀링: 커버된 영역 내 픽셀 값의 평균이 출력 매트릭스로 전달됩니다.

최대 풀링: 커버된 영역 내 픽셀 값 중 가장 높은 값이 출력 매트릭스로 전달됩니다.

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_16.png)

<div class="content-ad"></div>

전역 최대 풀링(Global Max Pooling) : 모든 입력 크기의 픽셀 값 중 가장 높은 값이 출력 행렬로 전달됩니다. 이 유형의 풀링에서 풀 크기는 입력 크기와 동일합니다.

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_17.png)

sum pooling, average pooling, max pooling과 같은 다양한 유형의 풀링이 있습니다. 최대 풀링의 예는 아래에 제공됩니다. 최대 풀링은 2x2 패치에 수행됩니다. 각 패치에서 최댓값이 선택됩니다.

## 2.4 — 플래튼 레이어

<div class="content-ad"></div>

플래튼 레이어는 신경망 아키텍처에서 중요한 구성 요소이며, 특히 합성곱 레이어에서 완전히 연결된 레이어로의 전환 시에 중요합니다. 이 레이어는 합성곱 및 풀링 레이어에서 생성된 다차원 피쳐 맵을 일차원 벡터로 변환하여, 분류 또는 회귀 작업을 위해 후속 완전히 연결된 레이어로 전달할 수 있습니다.

![이미지 설명](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_18.png)

다음은 플래튼 레이어의 작동 방식입니다:

- 입력: 플래튼 레이어의 입력은 일반적으로 이전 합성곱 또는 풀링 레이어에서 생성된 피쳐 맵을 나타내는 다차원 텐서입니다. 예를 들어, 마지막 합성곱 또는 풀링 레이어가 높이, 너비, 깊이의 피쳐 맵을 생성한다면 입력 텐서는 (배치 크기, 높이, 너비, 깊이) 형태를 가질 것입니다.
- 플래팅: 플래팅 레이어는 단순히 피쳐 맵의 모든 요소를 하나의 차원을 따라 연결하여 입력 텐서를 일차원 벡터로 다시 형태화합니다. 예를 들어, 피쳐 맵이 높이, 너비, 깊이의 차원을 가진다면 플래팅 레이어는 이를 높이 * 너비 * 깊이의 길이를 가진 벡터로 변환합니다.
- 출력: 플래팅 레이어의 출력은 피쳐 맵을 플래팅한 일차원 벡터입니다. 이 벡터는 이후의 완전히 연결된 레이어의 입력으로 전달될 수 있습니다.

<div class="content-ad"></div>

평탄화 레이어의 목적은 특성 맵에서 캡처된 공간 정보를 완전 연결 레이어에서 처리할 수 있는 형식으로 변환하는 것입니다. 완전 연결 레이어는 일차원 입력 벡터를 필요로하므로 특성 맵을 평탄화함으로써 신경망이 데이터의 다양한 공간 위치에 걸쳐 복잡한 패턴과 관계를 효과적으로 학습할 수 있습니다. 이를 통해 더 정확한 예측을 할 수 있습니다.

이전의 합성곱 또는 풀링 레이어에 의해 생성된 특성 맵 𝐹 집합이 있다고 가정해봅시다. 이러한 특성 맵의 차원을 다음과 같이 표기해 봅시다:

- 𝐻: 특성 맵의 높이
- 𝑊: 특성 맵의 너비
- 𝐷: 특성 맵의 깊이 (채널 수)
- 𝐵: 배치 크기 (배치에 포함된 샘플 수)

그러면 특성 맵 𝐹의 형태는 (B,H,W,D)가 됩니다. 여기서 𝐵은 배치 크기를 나타냅니다.

<div class="content-ad"></div>

이러한 피처 맵을 일차원 벡터로 평탄화하기 위해, 단순히 이를 길이 𝐻×𝑊×𝐷의 벡터로 재구성합니다. 수학적으로 표현하면 다음과 같습니다:

Flatten(𝐹)=reshape(𝐹, (𝐵, 𝐻×𝑊×𝐷))

이 경우, 재구성 연산은 (𝐵, 𝐻, 𝑊, 𝐷) 텐서를 (𝐵, 𝐻×𝑊×𝐷) 텐서로 재구성하여 공간 차원을 하나의 차원으로 펼치게 됩니다.

예를 들어, 만약 𝐹가 차원이 (4,5,5,3)인 경우 (배치 크기가 4, 높이가 5, 너비가 5, 깊이가 3인 피처 맵), 그러면 평탄화된 출력은 (4,75) 차원을 갖게 되며, 각 행은 배치의 한 샘플에 대한 평탄화된 피처 맵을 나타냅니다.

<div class="content-ad"></div>

이 평탄화된 벡터는 신경망의 후속 완전 연결 레이어에 입력으로 전달될 수 있습니다.

# 3 — TinyML 구현

이 예제를 통해 ESP32, 아두이노, 라즈베리 파이 및 기타 다양한 마이크로컨트롤러 또는 IoT 장치에서 머신러닝 알고리즘을 구현할 수 있습니다.

3.0 — requirements.txt 파일에 나열된 라이브러리를 설치합니다.

<div class="content-ad"></div>

```python
!pip install -r requirements.txt
```

3.1 — 라이브러리 가져오기

```python
import numpy as np
from sklearn.datasets import load_digits
import tensorflow as tf
from tensorflow.keras import layers
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from matplotlib import pyplot as plt
import time
import seaborn as sns
import os
```

3.2 — 데이터셋 불러오기


<div class="content-ad"></div>

MNIST은 Modified National Institute of Standards and Technology database의 줄임말로, 기공 학습 및 컴퓨터 비전 분야에서 널리 사용되는 데이터셋입니다. 이 데이터셋은 0에서 9까지의 손으로 쓴 숫자들의 모음으로, 각 숫자는 28x28 픽셀 크기의 회색 음영 이미지로 표현됩니다. 이 데이터셋에는 총 70,000개의 이미지가 포함되어 있으며, 이 중 60,000개의 이미지는 훈련에 사용되고 10,000개의 이미지는 테스트에 사용됩니다.

링크: [https://www.nist.gov/itl/products-and-services/emnist-dataset](https://www.nist.gov/itl/products-and-services/emnist-dataset)

```python
def get_data():
    np.random.seed(1337)
    x_values, y_values = load_digits(return_X_y=True)
    x_values /= x_values.max()
    # reshape to (8 x 8 x 1)
    x_values = x_values.reshape((len(x_values), 8, 8, 1))
    # split into train, validation, test
    TRAIN_SPLIT = int(0.6 * len(x_values))
    TEST_SPLIT = int(0.2 * len(x_values) + TRAIN_SPLIT)
    x_train, x_test, x_validate = np.split(x_values, [TRAIN_SPLIT, TEST_SPLIT])
    y_train, y_test, y_validate = np.split(y_values, [TRAIN_SPLIT, TEST_SPLIT])

    return x_train, x_test, x_validate, y_train, y_test, y_validate
```

3.3 — 데이터 분할

<div class="content-ad"></div>

```js
X_train, X_test, X_validate, y_train, y_test, y_validate = get_data()
```

3.4 — 탐색적 데이터 분석

```js
X_train__ = X_train.reshape(X_train.shape[0], 8, 8)

fig, axis = plt.subplots(1, 4, figsize=(20, 10))
for i, ax in enumerate(axis.flat):
    ax.imshow(X_train__[i], cmap='binary')
    digit = y_train[i]
    ax.set(title = f"실제 숫자는 {digit}입니다.")
```

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_19.png)


<div class="content-ad"></div>

3.5— 모델 정의하기

```js
model = tf.keras.Sequential()
model.add(layers.Conv2D(8, (3, 3), activation='relu', input_shape=(8, 8, 1)))
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Flatten())
model.add(layers.Dense(len(np.unique(y_train))))
```

```js
model.summary()
```

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_20.png)

<div class="content-ad"></div>

```js
plot_model(model, to_file='./figures/model.png')
```

![Plot](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_21.png)

3.6—모델 컴파일하기

```js
model.compile(optimizer='adam', loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=['accuracy'])
```

<div class="content-ad"></div>

3.7 — 모델 훈련

```js
history = model.fit(X_train, y_train,
                    epochs=50,
                    batch_size=16,
                    validation_data=(X_validate, y_validate))
```

```js
model.save('.\models\model.keras')
```

```js
loss = history.history['loss']
val_loss = history.history['val_loss']
epochs = range(1, len(loss) + 1)
plt.plot(epochs, loss, 'r.', label='훈련 손실')
plt.plot(epochs, val_loss, 'y', label='검증 손실')
plt.title('훈련 및 검증 손실')
plt.xlabel('에포크')
plt.ylabel('손실')
plt.grid()
plt.legend()
plt.savefig('.\\figures\\history_traing.png', dpi=300, bbox_inches='tight')
plt.show()
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_22.png" />

모델 평가

테스트 데이터

```js
def test_model(model, x_test, y_test):
    x_test = (x_test / x_test.max()).reshape((len(x_test), 8, 8, 1))
    y_pred = model.predict(x_test).argmax(axis=1)
    print('정확도', ((y_pred == y_test).sum() / len(y_test))*100, "%")
```

<div class="content-ad"></div>


```js
test_model(model, X_test, y_test)
```

![Image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_23.png)

3.8.2 — Confusion matrix

```js
fig = plt.figure(figsize=(10, 10)) # Set Figure

y_pred = model.predict(X_test) # Predict class probabilities as 2 => [0.1, 0, 0.9, 0, 0, 0, 0, 0, 0, 0]
Y_pred = np.argmax(y_pred, 1) # Decode Predicted labels
mat = confusion_matrix(y_test, Y_pred) # Confusion matrix

# Plot Confusion matrix
sns.heatmap(mat.T, square=True, annot=True, cbar=False, cmap=plt.cm.Blues, fmt='.0f', 
            xticklabels=np.unique(y_test), yticklabels=np.unique(y_test), 
            annot_kws={"fontsize": 14}, linewidths=1, linecolor='white')

plt.xlabel('Predicted Values', fontsize=14)
plt.ylabel('True Values', fontsize=14)
plt.xticks(fontsize=14)
plt.yticks(fontsize=14)
plt.savefig('.\\figures\\confusion_matrix.png', dpi=300, bbox_inches='tight')
plt.show()
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_24.png)

3.8.3— 예측 유효성 검사 결과

```js
y_pred = model.predict(X_test)
X_test__ = X_test

fig, axis = plt.subplots(4, 4, figsize=(12, 14))
for i, ax in enumerate(axis.flat):
    ax.imshow(X_test__[i], cmap='binary')
    ax.set(title = f"실제 숫자: {y_test[i]}\n예측 숫자: {y_pred[i].argmax()}")
```

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_25.png)


<div class="content-ad"></div>

3.9 — 마이크로컨트롤러에 구현할 모델을 얻기

3.9.1 — C 프로그래밍을 위해 일부 16진수 값을 배열로 변환하기

```js
# 함수: C 프로그래밍을 위해 일부 16진수 값을 배열로 변환
def hex_to_c_array(hex_data, var_name):

  c_str = ''

  # 헤더 가드 생성
  c_str += '#ifdef __has_attribute\n'
  c_str += '#define HAVE_ATTRIBUTE(x) __has_attribute(x)\n'
  c_str += '#else\n'
  c_str += '#define HAVE_ATTRIBUTE(x) 0\n'
  c_str += '#endif\n'
  c_str += '#if HAVE_ATTRIBUTE(aligned) || (defined(__GNUC__) && !defined(__clang__))\n'
  c_str += '#define DATA_ALIGN_ATTRIBUTE __attribute__((aligned(4)))\n'
  c_str += '#else\n'
  c_str += '#define DATA_ALIGN_ATTRIBUTE\n'
  c_str += '#endif\n\n'

  # C 변수 선언
  c_str += 'const unsigned char ' + var_name + '[]  DATA_ALIGN_ATTRIBUTE = {'
  hex_array = []
  for i, val in enumerate(hex_data) :

    # 16진수에서 문자열로 변환
    hex_str = format(val, '#04x')

    # 각 줄이 80자 이내로 유지되도록 서식 지정 추가
    if (i + 1) < len(hex_data):
      hex_str += ','
    if (i + 1) % 12 == 0:
      hex_str += '\n '
    hex_array.append(hex_str)

  # 마지막 중괄호 추가
  c_str += '\n ' + format(' '.join(hex_array)) + '\n};\n\n'

  # 헤더 가드 종료
  c_str += 'const int ' + var_name + '_len = ' + str(len(hex_data)) + ';\n'

  return c_str
```

3.9.2—모델을 Float32와 Int8형식으로 변환하기

<div class="content-ad"></div>

```js
def representative_dataset():
    for i in range(len(X_train)):
        input_data = np.array([X_train[i]], dtype=np.float32)
        yield [input_data]

def converter_quantization_model(model, model_name):

    # Convert the model to float32
    converter_float32 = tf.lite.TFLiteConverter.from_keras_model(model)
    converter_float32.optimizations = [tf.lite.Optimize.DEFAULT]
    converter_float32.target_spec.supported_types = [tf.float32]
    converter_float32._experimental_lower_tensor_list_ops = False
    converter_float32.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS, tf.lite.OpsSet.SELECT_TF_OPS]
    converter_float32.representative_dataset = representative_dataset
    tflite_model_float32 = converter_float32.convert()
    print(tflite_model_float32)
    with open(model_name+'_quant_float32' + '.h', 'w') as file:
        file.write(hex_to_c_array(tflite_model_float32, model_name+'_quant_float32'))
    with open(model_name+'_quant_float32.tflite', 'wb') as f:
        f.write(tflite_model_float32)
    size_model_tflite_float32 = os.path.getsize(model_name+'_quant_float32.tflite')
    print(model_name+f'_quant_float32.tflite: {size_model_tflite_float32} Bytes')

    # Convert the model to Int8
    converter_int8 = tf.lite.TFLiteConverter.from_keras_model(model)
    converter_int8.optimizations = [tf.lite.Optimize.DEFAULT]
    converter_int8.target_spec.supported_types = [tf.int8]
    converter_int8.representative_dataset = representative_dataset
    converter_int8.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS_INT8,
        tf.lite.OpsSet.SELECT_TF_OPS,
    ]
    converter_int8.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS]
    converter_int8.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter_int8.experimental_new_converter = True
    converter_int8.experimental_new_quantizer = True
    converter_int8.experimental_new_calibrator = True
    tflite_model_int8 = converter_int8.convert()
    with open(model_name+'_quant_int8' + '.h', 'w') as file:
        file.write(hex_to_c_array(tflite_model_int8, model_name+'_quant_int8'))
    with open(model_name+'_quant_int8.tflite', 'wb') as f:
        f.write(tflite_model_int8)
    size_model_tflite_int8 = os.path.getsize(model_name+'_quant_int8.tflite')
    print(model_name+f'_quant_int8.tflite: {size_model_tflite_int8} Bytes')

    return None
```

```js
model_name='.\models\model'
converter_quantization_model(model, model_name)
```

3.10 — Quantized Model Evaluation

```js
def evaluate_quantization(model_path, X_test, y_test, quantization_type):
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    # Evaluate the quantized model
    input_index = interpreter.get_input_details()[0]['index']
    output_index = interpreter.get_output_details()[0]['index']
    predictions = []
    processing_times = []

    X_test = np.array(X_test, dtype=np.float32)
    
    for X in X_test:
        interpreter.set_tensor(input_index, [X])       
        start_time = time.time()
        interpreter.invoke()
        end_time = time.time()
        processing_time = end_time - start_time
        processing_times.append(processing_time)
        output = interpreter.get_tensor(output_index).argmax(axis=1)
        predictions.append(output[0])

    acc = accuracy_score(y_test, predictions)
   
    # Calculate the average and standard deviation of differences
    result = { "Accuracy (%): ":acc*100,
                "Process time (s): ": np.mean(processing_times)
            }

    return result
```

<div class="content-ad"></div>

```js
model_name = '.\models\model'
```

```js
eval_quant_float32 = evaluate_quantization(model_name + '_quant_float32.tflite', X_test, y_test, 'float32')
eval_quant_float32
```

![Image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_26.png)

```js
eval_quant_int8 = evaluate_quantization(model_name + '_quant_int8.tflite', X_test, y_test, 'int8')
eval_quant_int8 
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_27.png" />

## 3.11 — 모델 배포

이 예제를 통해 ESP32, 아두이노, 아두이노 Portenta H7 with Vision Shield, 라즈베리파이 및 기타 다양한 마이크로컨트롤러 또는 IoT 장치에 머신러닝 알고리즘을 구현할 수 있습니다.

3.11.1 — EloquentTinyML 라이브러리 설치

<div class="content-ad"></div>

도서관 폴더로 이동하여 EloquentTinyML-main을 설치해주세요.

3.11.2 — 완전한 아두이노 스케치

model_quant_float32.h 또는 model_quant_int8.h 파일을 열어서 다음에서 모든 16진수 값을 복사하세요:

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_28.png)

<div class="content-ad"></div>

아래와 같이 변경해주세요:


and model len

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_29.png)

and cut in model.h:

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_30.png)


<div class="content-ad"></div>

and

![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_31.png)

3.11.2 — 완성된 아두이노 스케치

```js
#include <EloquentTinyML.h>
#include <eloquent_tinyml/tensorflow.h>

// sine_model.h contains the array you exported from Python with xxd or tinymlgen
#include "model.h"

#define N_INPUTS 64
#define N_OUTPUTS 10
// in future projects you may need to tweak this value: it's a trial and error process
#define TENSOR_ARENA_SIZE 6*1024

Eloquent::TinyML::TensorFlow::TensorFlow<N_INPUTS, N_OUTPUTS, TENSOR_ARENA_SIZE> tf;

float input[64] = {0.00000000000f, 0.12500000000f, 0.00000000000f, 0.50000000000f, 0.56250000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.81250000000f, 0.31250000000f, 0.87500000000f, 0.50000000000f, 0.43750000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.75000000000f, 0.31250000000f, 0.12500000000f, 0.00000000000f, 0.56250000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.43750000000f, 0.31250000000f, 0.00000000000f, 0.00000000000f, 0.18750000000f, 0.31250000000f, 0.00000000000f, 0.00000000000f, 0.18750000000f, 0.62500000000f, 0.00000000000f, 0.00000000000f, 0.12500000000f, 0.62500000000f, 0.00000000000f, 0.00000000000f, 0.06250000000f, 0.81250000000f, 0.00000000000f, 0.00000000000f, 0.06250000000f, 0.75000000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.31250000000f, 0.81250000000f, 0.31250000000f, 0.56250000000f, 0.81250000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.00000000000f, 0.56250000000f, 1.00000000000f, 1.00000000000f, 0.43750000000f, 0.00000000000f};

float y_pred[10] = {0};

void setup() {
    Serial.begin(9600);
    delay(4000);
    tf.begin(model);

    // check if model loaded fine
    if (!tf.isOk()) {
      Serial.print("ERROR: ");
      Serial.println(tf.getErrorMessage());

      while (true) delay(1000);
    }
}

void loop() {

        tf.predict(input, y_pred);
        for (int i = 0; i < 10; i++) {
            Serial.print(y_pred[i]);
            Serial.print(i == 9 ? '\n' : ',');
        }
    Serial.print("Predicted class is: ");
      Serial.println(tf.probaToClass(y_pred));
      // or you can skip the predict() method and call directly predictClass()
      Serial.print("Sanity check: ");
      Serial.println(tf.predictClass(input));
      delay(2000);

}
```

<div class="content-ad"></div>

3.12 — 결과

3.12.1 — 양자화된 모델 Float32

![이미지](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_32.png)

3.12.1 — 양자화된 모델 Int8

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_33.png)

Full project in: [TinyML/13_CNN at main · thommaskevin/TinyML](https://github.com/thommaskevin/TinyML)

## If you like it, consider buying my coffee ☕️💰 (Bitcoin)

code: bc1qzydjy4m9yhmjjrkgtrzhsgmkq79qenvcvc7qzn


<div class="content-ad"></div>

`<img src="/assets/img/2024-06-20-TinyMLConvolutionalNeuralNetworksCNN_34.png" />`