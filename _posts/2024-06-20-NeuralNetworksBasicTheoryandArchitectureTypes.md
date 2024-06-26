---
title: "신경망 기본 이론과 구조 유형"
description: ""
coverImage: "/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_0.png"
date: 2024-06-20 19:07
ogImage:
  url: /assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_0.png
tag: Tech
originalTitle: "Neural Networks: Basic Theory and Architecture Types"
link: "https://medium.com/towards-artificial-intelligence/neural-networks-basic-theory-and-architecture-types-38d9f53e1e1c"
---

이 이야기에서는 신경망의 이론적 기초와 이로부터 파생된 기술, 그리고 PyTorch를 사용한 구현의 가장 중요한 측면을 높은 수준에서 리뷰하고 설명해보려고 합니다. 가능한 간단한 언어를 사용하여 설명하겠습니다. 또한 다른 문서에서 문서화한 사용 사례 예시를 소개할 예정입니다.

신경망은 이름 그대로 뉴런으로 구성된 복잡한 시스템입니다. 이 네트워크의 힘은 이 인공 뉴런들 간의 상호 연결에서 나옵니다. 이러한 NN 알고리즘은 생물학적 시스템을 모방한다고 합니다.

# 뉴런:

신경망의 핵심은 뉴런입니다. 뉴런은 단순히 입력(변수) 집합을 받아 선형 및 비선형 변환을 적용하고 수학적 다변수 함수처럼 출력을 생성하는 수학 도구입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_0.png" />

첫 번째 레이어의 뉴런들에 대한 입력은 원래 세트의 데이터입니다. 각 샘플은 네트워크에 의해 독립적으로 동일한 방식으로 처리됩니다.

네트워크의 기본 구조는 다음과 같습니다: 각각의 뉴런으로 구성된 여러 레이어로, 각 레이어마다 독립적으로 구성됩니다. 첫 번째 레이어는 데이터 원본에서 공급받고, 마지막 레이어는 출력으로 공급하며, 중간 레이어는 이전 레이어에서 공급받고 다음 레이어로 이어집니다.

일부 아키텍처는 레이어 간에 변형을 추가하거나 피드백 루프를 도입한 이 모델에 변형을 도입할 수 있습니다. 나중에 이에 대해 논의할 예정입니다.

<div class="content-ad"></div>

![Neural Networks Basic Theory and Architecture Types 1](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_1.png)

각 뉴런은 선형 부분과 비선형 부분으로 구성됩니다. 선형 부분은 표준 선형 방정식이며, 비선형 변환은 네트워크 및 층에 따라 다를 수 있습니다.

구체적으로, 레이어는 입력 벡터(크기 n)로 구성되며, 이는 가중치 행렬(크기 nxm, 여기서 n은 입력의 크기이고 m은 레이어의 뉴런 수입니다)에 의해 곱해지고 결과는 크기 m인 다른 벡터로 반환됩니다. 이 결과는 자유 매개 변수 벡터에 추가됩니다. 전체 결과는 비선형 함수를 통해 전달되며, 이를 활성화 함수라고 합니다.이 프로세스의 출력은 다음 레이어로 전달됩니다.

![Neural Networks Basic Theory and Architecture Types 2](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_2.png)

<div class="content-ad"></div>

또는 구체적으로:

![Neural Networks Basic Theory and Architecture Types](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_3.png)

이 시스템이 얼마나 복잡해질 수 있는지를 보여주기 위해, 두 번째 층의 출력에서 수식이 어떻게 보일지 알아보겠습니다:

![Neural Networks Basic Theory and Architecture Types](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_4.png)

<div class="content-ad"></div>

실제 출력(목표 변수)를 재현하는 최적의 가중치와 자유 매개변수 값을 찾는 것이 바로 이어지는 교육 과정의 전부적인 목적입니다. 원본 값과 예측된 값 사이의 차이를 측정하기 위해 손실 함수를 도입합니다. 이로써, 모든 신경망은 근본적으로 지도 회귀 문제로 전환됩니다.

활성화 함수는 다양한 사용 사례를 충족하는 함수 세트에서 선택됩니다. 높은 수준에서 가장 많이 사용되는 것은 ReLU(0보다 큰 값을 유지하며 음수는 0으로 설정), Sigmoid 및 Tanh입니다.

# 학습 과정:

언급했듯이, 각 계층별로 많은 매개변수의 최적 값을 찾는 것이 목표입니다. 이를 위해 예측된 Y와 실제 Y 간의 관계를 나타내는 함수(손실 함수)가 선택됩니다. 최적화 문제와 마찬가지로 목표는 이 기능이 최소값일 때의 지점을 찾기 위해 고정됩니다. 일부 손실 함수의 예는 평균 제곱 오차, 제곱근 평균 제곱 오차, 평균 절대 오차 및 이진 교차 엔트로피가 있습니다.

<div class="content-ad"></div>

최적화 문제를 해결하는 데 사용된 알고리즘은 그래디언트 강하법의 변형으로, 이는 다변수 적용에서 함수의 최소값을 찾는 전형적인 미적분 문제의 수치 구현입니다. 알고리즘은 각 반복에서 함수의 그래디언트 값을 추정하고 다음과 같은 방식으로 매개변수를 업데이트합니다:

![image](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_5.png)

이 프로세스는 주어진 반복 횟수(에폭)만큼 반복되며, 각 실행에서 손실 값이 감소하는지 확인합니다.

학습 속도는 미리 설정해야 하는 하이퍼파라미터입니다. 학습 속도에 대한 중요한 사항은 너무 높게 설정해서는 안 된다는 것입니다. 그렇지 않으면 손실 값이 진동을 시작하고 결코 함수의 최소값을 찾지 못할 수 있습니다.

<div class="content-ad"></div>

![Neural Networks Theory](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_6.png)

일반적으로 매개변수는 무작위 변수를 사용하여 초기화됩니다. 이 변수는 가우시안 분포를 따릅니다. 모든 입력이 독립적이며 레이어에 무한 개수의 뉴런이 있는 이상적인 경우에는 출력과 훈련된 매개변수도 가우시안 분포를 형성합니다.

이러한 분포는 매개변수, 변수 또는 출력으로 형성된 다변량 공간 상의 파형패킷으로 볼 수 있습니다. 이는 양자장론에서 자유 입자를 모델링하기 위해 사용되는 수학적 구조와 유사합니다. 양자장론에서 상호작용으로 나타나는 작은 편차가 있는 것과 같이, 신경망에서는 변수간의 종속성과 레이어 당 유한 개수의 뉴런 삽입에 의해 생성됩니다. 특히, 네트워크 구성원 간의 내부 또는 보이지 않는 구조에 의해 생성되는 이러한 편차는 시스템의 예측력의 원천입니다. 그러나 이러한 편차가 너무 커지면 시스템이 발산하여 혼돈스럽게 됩니다.

양자장론과 마찬가지로, 자유(가우시안) 경우에서의 작은 편차로 인한 문제들에 대한 수학적 해석을 위해 섭동 이론을 사용할 수 있습니다. 물리적 입자간의 상호작용을 이해하는 데 사용되는 수학은 신경망의 내부 동작을 이해하는 데 활용됩니다.

<div class="content-ad"></div>

이 접근 방식에 대해 더 읽고 싶다면 원본 논문을 참고할 수 있어요: [2307.03223] Neural Network Field Theories: Non-Gaussianity, Actions, and Locality (arxiv.org)

다시 본론으로 돌아와서, 신경망을 설계할 때 결정되어야 할 여러 가지 결정 사항 또는 하이퍼파라미터가 있어요. 이들은 다음과 같아요:

- 각 층의 입력과 출력 수, 단, 첫 번째 층의 입력은 변수의 수, 마지막 층의 출력은 해결할 문제의 성격에 따라 정해지며 각 내부 또는 숨겨진 층의 출력은 다음 층의 입력이에요.
- 신경망의 층 수.
- 각 층의 활성화 함수.
- 손실 함수.
- 기울기 알고리즘.
- 학습률.
- 아키텍처(다음 세그먼트에서 탐구할 사항)

다음으로, 가장 일반적인 신경망 아키텍처 몇 가지, 각각의 고수준 설명, 및 샘플 사용 사례를 살펴볼게요.

<div class="content-ad"></div>

만약 신경망과 기계 학습 내부의 수학을 더 잘 이해하고 싶다면 Ian Goodfellow, Yoshua Bengio, 그리고 Aaron Courville의 책을 참고하실 수 있어요. 해당 책은 Deep Learning (deeplearningbook.org)에서 구할 수 있어요. 그리고, Goodfellow은 적대적 생성 신경망(Generative Adversarial Networks)의 발명과도 함께 언급되어 있어요.

# 다중 계층 퍼셉트론 (MLP)

이것은 신경망의 가장 기본적인 아키텍처이며, 각 계층이 이전 계층에 의존하는 선형 구조로 형성되어 있어요. 또한 변수들 사이의 특정한 관계를 고려하지 않아요. MLP는 예측 변수들이 서로 의존하지 않는 문제에서 유용하게 사용됩니다. 예를 들어, 나이, 연봉, 교육 또는 성별과 같은 요소로 구성된 데이터셋에 대해요.

![Neural Networks Basic Theory and Architecture Types](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_7.png)

<div class="content-ad"></div>

아래 코드 블록은 PyTorch 패키지를 사용하여 Python에서 다층 퍼셉트론을 정의한 샘플입니다:

```python
import torch.nn as nn

class SimpleClassifier(nn.Module):
    def __init__(self):
        super(SimpleClassifier, self).__init__()
#과적합을 줄이기 위해 드롭아웃 레이어를 도입합니다.
#드롭아웃은 신경망에게 층 사이의 데이터를 무작위로 삭제하여 변동성을 도입하도록 지시합니다.
        self.dropout = nn.Dropout(0.1)
#레이어는 열의 두 배 정도로 시작하고 다음 레이어로 증가한 다음 다시 2로 감소하는 것을 권장합니다.
#이 경우 응답은 이진입니다.
        self.layers = nn.Sequential(
            nn.Linear(input_size, 250),
            nn.Linear(250, 500),
            nn.Linear(500, 1000),
            nn.Linear(1000, 1500),
            nn.ReLU(),
            self.dropout,
            nn.Linear(1500, 1500),
            nn.Sigmoid(),
            self.dropout,
            nn.Linear(1500, 1500),
            nn.ReLU(),
            self.dropout,
            nn.Linear(1500, 1500),
            nn.Sigmoid(),
            self.dropout,
            nn.Linear(1500, 1500),
            nn.ReLU(),
            self.dropout,
            nn.Linear(1500, 1500),
            nn.Sigmoid(),
            self.dropout,
            nn.Linear(1500, 1500),
            nn.ReLU(),
            self.dropout,
            nn.Linear(1500, 500),
            nn.Sigmoid(),
            self.dropout,
            nn.Linear(500, 500),
            nn.ReLU(),
            self.dropout,
            nn.Linear(500, 500),
            nn.Sigmoid(),
            self.dropout,
#마지막 레이어는 응답 변수가 이진(0, 1)이기 때문에 2를 출력합니다.
#다중 클래스 분류의 출력은 클래스 수와 같아야 합니다.
            nn.Linear(500, 2),
        )

    def forward(self, x):
        return self.layers(x)

#모델 정의
model = SimpleClassifier()
```

이 모델을 사용한 전형적인 학습 루프는 다음 블록에서 나타납니다:

```python
#모델 로드
model = SimpleClassifier()
model.train()

#학습 파라미터(사이클 수 및 학습률)입니다.
num_epochs = 100
learning_rate = 0.00001
#과적합을 줄이기 위해
regularization = 0.0000001

#손실 함수
criterion = nn.CrossEntropyLoss()

#기울기를 찾는 알고리즘
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate, weight_decay=regularization)

#이 코드는 학습 루프를 수행하는 동안 최상의 모델을 유지합니다.
best_model_wts = copy.deepcopy(model.state_dict())
best_acc = 0.0
best_f1 = 0.0
best_epoch = 0
phases = ['train', 'val']
training_curves = {}
epoch_loss = 1
epoch_f1 = 0
epoch_acc = 0

#데이터셋은 학습, 검증 및 테스트로 분할됩니다.
for phase in phases:
    training_curves[phase+'_loss'] = []
    training_curves[phase+'_acc'] = []
    training_curves[phase+'_f1'] = []

#이것은 학습 루프입니다.
for epoch in range(num_epochs):
    print(f'\n에포크 {epoch+1}/{num_epochs}')
    print('-' * 10)
    for phase in phases:
        if phase == 'train':
            model.train()
        else:
            model.eval()
        running_loss = 0.0
        running_corrects = 0
        running_fp = 0
        running_tp = 0
        running_tn = 0
        running_fn = 0
        #데이터 반복
        for inputs, labels in dataloaders[phase]:
            inputs = inputs.view(inputs.shape[0], -1)
            inputs = inputs
            labels = labels

            #매개변수의 기울기를 0으로 설정
            optimizer.zero_grad()

            #순방향 패스 (위의 차트 참조)
            with torch.set_grad_enabled(phase == 'train'):
                outputs = model(inputs)
                _, predictions = torch.max(outputs, 1)
                loss = criterion(outputs, labels)

                #역방향 패스 (학습 중에만)
                if phase == 'train':
                    loss.backward()
                    optimizer.step()

                #통계. f1 메트릭을 사용합니다.
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(predictions == labels.data)
                running_fp += torch.sum((predictions != labels.data) & (predictions >= 0.5))
                running_tp += torch.sum((predictions == labels.data) & (predictions >= 0.5))
                running_fn += torch.sum((predictions != labels.data) & (predictions < 0.5))
                running_tn += torch.sum((predictions == labels.data) & (predictions < 0.5))
                print(f'에포크 {epoch+1}, {phase:5} 손실: {epoch_loss:.7f} F1: {epoch_f1:.7f} 정확도: {epoch_acc:.7f} 부분 손실: {loss.item():.7f} 최상의 f1: {best_f1:.7f}')

        #손실, 정확도 및 f1 메트릭 계산
        epoch_loss = running_loss / dataset_sizes[phase]
        epoch_acc = running_corrects.double() / dataset_sizes[phase]
        epoch_f1 = (2 * running_tp.double()) / (2 * running_tp.double() + running_fp.double() + running_fn.double() + 0.0000000000000000000001)
        training_curves[phase+'_loss'].append(epoch_loss)
        training_curves[phase+'_acc'].append(epoch_acc)
        training_curves[phase+'_f1'].append(epoch_f1)

        print(f'에포크 {epoch+1}, {phase:5} 손실: {epoch_loss:.7f} F1: {epoch_f1:.7f} 정확도: {epoch_acc:.7f} 최상의 f1: {best_f1:.7f}')

        if phase == 'val' and epoch_f1 >= best_f1:
            best_epoch = epoch
            best_acc = epoch_acc
            best_f1 = epoch_f1
            best_model_wts = copy.deepcopy(model.state_dict())

print(f'최상의 val F1: {best_f1:5f}, 최상의 val 정확도: {best_acc:5f}, 에포크 {best_epoch}')

#최상의 모델 가중치로드
model.load_state_dict(best_model_wts)
```

<div class="content-ad"></div>

아래의 글에서는 실제 데이터를 사용하여 MLP를 구현한 예시를 확인할 수 있습니다: [Neural Networks와 Pytorch를 사용하여 자동 복구 실패 예측하기 (저자: Greg Postalian-Yrausquin | 2024년 6월 | Towards AI (medium.com)](https://medium.com)

더 많은 정보는 위키피디아 페이지에서 찾을 수 있습니다: [다층 퍼셉트론 (Multilayer perceptron) — Wikipedia](https://en.wikipedia.org/wiki/Multilayer_perceptron)

# 합성곱 신경망 (CNN):

전형적인 다층 퍼셉트론은 입력이 필드인 경우 성능이 좋지 않습니다. 여기서 필드란 점들 간의 관계(함수, 연속성을 통해)가 있는 구조를 말합니다. 예를 들어, 금속 판의 온도는 한 지점에 열원이 연결되어 있는 경우 열원에서 더 멀리 있는 위치로 갈수록 그래디언트를 따를 것입니다. 이 2차원 예시에서 표면의 온도는 그리드(행렬)로 나타낼 수 있습니다:

<div class="content-ad"></div>

![image](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_8.png)

이러한 구조들은 3D일 수도 있습니다 (여러 개가 서로 위에 쌓인 것을 상상해보세요) 또는 우리가 원하는 대로 복잡할 수 있습니다. MLPs는 훈련 중에 데이터의 내부 구조를 잃어버리므로 이를 모델링하는 데 좋지 않습니다. 그와는 반대로 CNNs는 원래의 관계를 보존합니다.

Python에서는 이미지가 행렬로 저장됩니다. 여기서 행과 열은 위치를 나타내고 숫자는 강도를 측정하는 값입니다. 컬러 이미지의 경우 각 이미지에 대해 RGB 색상 인코딩 형식에 대한 값을 저장하는 3개의 행렬이 사용됩니다. 수학에서 이러한 다차원 행렬은 Tensor라고 불리며 벡터 함수로도 볼 수 있습니다 (출력이 벡터의 모양으로 나오는 것), 이 경우 출력 벡터의 좌표는 RGB 색상값입니다.

이러한 이유로 CNN은 이미지 및 비디오 데이터를 모델링하는 데 널리 사용됩니다. CNN의 아이콘은 이미지 분류입니다. 이 기사에서는 그 목적으로 CNN 사용 예제를 볼 수 있습니다: Convolutional Neural Networks in PyTorch: Image Classification | by Greg Postalian-Yrausquin | Jun, 2024 | Towards AI (medium.com).

<div class="content-ad"></div>

합성곱 신경망은 네트워크 내에 하나 이상의 합성 계층이 존재하는 것으로 정의됩니다. 이들은 데이터 내부에서 창 또는 행렬(커널)을 슬라이딩하여 원소별 곱셈을 수행하고 커널 내부 값의 합을 구하는 수학 연산입니다. 패딩을 도입하여 원래 데이터 매트릭스 크기의 축소를 고려할 수 있습니다.

![CNN Architecture](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_9.png)

CNN에는 다른 종류의 계층도 소개되는데, 예를 들면: Max pool (지도의 일부분의 최대값을 얻어 데이터 크기를 줄임), flatten (데이터 매트릭스를 벡터로 변환하여 네트워크 끝에 사용되거나 표준 네트워크로 계속해서 훈련) 및 unflatten (이전 과정을 역으로 수행).

다음 샘플 코드는 PyTorch에서 CNN 클래스의 정의입니다:

<div class="content-ad"></div>

```python
from torch.nn.modules.flatten import Flatten
class CNNClassifier(nn.Module):
    def __init__(self):
        super(CNNClassifier, self).__init__()
        self.dropout = nn.Dropout(0.05)
        self.pipeline = nn.Sequential(
            #in channels is 1, because the input is grayscale
            nn.Conv2d(in_channels = 1, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 5, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            #dropout to introduce randomness and reduce overfitting
            self.dropout,
            #reduce and flat the tensor before applying the flat layers
            nn.MaxPool2d(kernel_size = 2, stride = 2),
            nn.Flatten(),
            nn.Linear(500, 50),
            nn.ReLU(),
            self.dropout,
            nn.Linear(50, 50),
            nn.ReLU(),
            self.dropout,
            nn.Linear(50, 10),
            nn.ReLU(),
            self.dropout,
            nn.Linear(10, 10),
            nn.ReLU(),
            self.dropout,
            nn.Linear(10, 5),
        )

    def forward(self, x):
        return self.pipeline(x)

model = CNNClassifier()
```

CNN에 대해 더 자세히 알아보기 좋은 정보를 찾는 것을 시작하는 데 좋은 곳인 Wikipedia의 CNN에 대한 항목을 찾았어요: [Convolutional neural network — Wikipedia](https://en.wikipedia.org/wiki/Convolutional_neural_network)

# 오토인코더

아키텍처의 하위 클래스로 오토인코더가 있습니다. 입력과 출력의 수가 동일한 특정 구성으로 상상할 수 있습니다. 모델은 입력된 데이터를 재현하는 방법을 학습하도록 구성되어 있으며 한 개 이상의 숨겨진 레이어를 통해 통과합니다.

<div class="content-ad"></div>

모델은 두 부분으로 설계되어 있습니다. 입력을 다른 표현으로 변환하는 Encoder와 이 표현을 기반으로 입력의 버전을 재구성하는 Decoder입니다. 아이디어는 재구성이 초기 데이터와 가능한 한 유사해야 한다는 것입니다.

이 네트워크에서 목표는 동일한 입력 데이터이기 때문에 이들은 사실상 감독되지 않은 학습 방법입니다. 예를 들어 Autoencoder 아키텍처는 생성적 AI 작업의 일부로 사용됩니다.

자연어 처리(NLP)에서 오토인코더는 단어 또는 문장의 임베딩(표현)을 생성하는 데 사용됩니다. 이 텍스트의 숫자 표현은 그 후 분류, 거리 계산 등과 같은 하향 작업에서 사용됩니다.

NLP에서 오토인코더를 사용하는 한 가지 훌륭한 방법은 다음과 같습니다:

<div class="content-ad"></div>

![Neural Network Example](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_10.png)

이 문서에서는 오토인코더의 정의 예시를 찾을 수 있습니다: Neural networks: encoder-decoder example (autoencoder) | 작성자 Greg Postalian-Yrausquin | 날짜 2024년 6월 | Medium. 여기서 모델이 이미지를 재구성하는 데 사용됩니다.

```js
# 훈련 이미지의 채널 수. 컬러 이미지의 경우 3개입니다
nc = 3

# 표현의 크기
nr = 1000

# 디코더의 시작점의 크기
nz = 50

class Encdec(nn.Module):
    def __init__(self, nc, nz, nr):
        super(Encdec, self).__init__()
# 이것이 인코더입니다
        self.encoder = nn.Sequential(
            nn.Conv2d(in_channels = nc, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 1, kernel_size = 5, stride = 1, padding=1),
            nn.Flatten(),
            nn.Linear(2916, 3000),
            nn.ReLU(),
            nn.Linear(3000, 1000),
            nn.ReLU(),
            nn.Linear(1000, 1000),
            nn.ReLU(),
            nn.Linear(1000, nr),
         )
# 이것이 디코더입니다
        self.decoder = nn.Sequential(
            nn.Linear(nr, 1000),
            nn.ReLU(),
            nn.Linear(1000, 500),
            nn.ReLU(),
            nn.Linear(500, nz*64*64),
            nn.Unflatten(1, torch.Size([nz, 64, 64])),
            nn.Conv2d(in_channels = nz, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = 10, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Conv2d(in_channels = 10, out_channels = nc, kernel_size = 5, stride = 1, padding=1),
            nn.ReLU(),
            nn.Flatten(),
            nn.Linear(10092, 2000),
            nn.ReLU(),
            nn.Linear(2000, 1000),
            nn.ReLU(),
            nn.Linear(1000, 1000),
            nn.ReLU(),
            nn.Linear(1000, 500),
            nn.ReLU(),
            nn.Linear(500, nc*64*64),
            nn.Unflatten(1, torch.Size([nc, 64, 64])),
            nn.Tanh()
         )

    def encode(self, x):
        return self.encoder(x)

    def decode(self, x):
        return self.decoder(x)

    def forward(self, input):
        return self.decoder(self.encoder(input))

netEncDec = Encdec(nc, nz, nr)
```

자세한 내용은 위키피디아에서 오토인코더 아키텍처에 대해 더 알아보기 시작점으로 참조할 수 있습니다: [오토인코더 - 위키백과](https://ko.wikipedia.org/wiki/%EC%98%A4%ED%86%A0%EC%9D%B8%EC%BD%94%EB%8D%94)

<div class="content-ad"></div>

인코더-디코더 메커니즘의 일반적이고 잘 알려진 구현은 트랜스포머 입니다. 이 아키텍처는 2017년 구글의 데이터 과학자들이 발표한 “Attention is all you need” [1706.03762] 논문에서 소개되었습니다. 트랜스포머는 NLP에서 널리 사용되며, 입력 및 출력 집합에 대한 임베딩 생성부터 시작하여 여러 단계로 구성됩니다. 이 집합 모두에 대해 위치 정보를 유지할 수 있도록 처리된 후에, 초기 오토인코더에는 포함되어 있지 않은 단계가 포함됩니다. 이는 반복의 오버헤드 없이 RNN과 동일한 이점을 제공합니다. 그 다음 데이터는 인코딩 프로세스(어텐션 스택)를 거치고, 디코딩 단계(두 번째 어텐션 스택)에서 출력과 비교됩니다. 마지막 단계는 소프트맥스 변환을 적용하는 것입니다.

![트랜스포머 아키텍처](/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_11.png)

트랜스포머 아키텍처: 원본 논문 "Attention is all you need"에서 가져온 다이어그램입니다.

<div class="content-ad"></div>

전이 학습 패러다임의 매우 흥미로운 그리고 유용한 구현 중 하나는 Google이 만든 BERT(Bidirectional Encoder Representations for Transformers)입니다. 영어 처리를 위해 트랜스포머를 처음부터 훈련하는 것은 거대한 작업이 될 수 있지만 다행히도 다양한 용도에 맞게 사전 훈련된 모델을 다운로드하고 적용할 수 있습니다 (이러한 모델을 다운로드하고 적용하는 방법은 Huggingface 페이지를 참조하세요): 모델 다운로드 (huggingface.co)

# 순환 신경망:

RNN은 신경망의 비선형 시도로 간주될 수 있습니다. RNN에서는 한 레이어가 자신에게 영향을 미칠 수 있습니다 (역행 효과가 있습니다). 이 작용은 시퀀스 형식으로 된 데이터를 모델링하는 데 이상적이라고 할 수 있습니다. 이러한 데이터의 가장 좋은 예는 텍스트 스트림이며, 그 이유로 NLP에서 가장 효율적인 트랜스포머가 도입될 때까지 주로 사용되었습니다. RNN은 음성 및 필기 인식에도 구현되어 있습니다.

<img src="/assets/img/2024-06-20-NeuralNetworksBasicTheoryandArchitectureTypes_12.png" />

<div class="content-ad"></div>

RNN(순환 신경망)은 계산적으로 요구가 높을 수 있는 것 외에, 비선형성에 의해 확대되는 전파 오류와 실제로 이전 단계의 매우 짧은 메모리를 유지하는 사라져버리는 그래디언트와 같은 다른 문제가 있습니다. 이러한 문제를 해결하기 위해 LSTM(Long-Short Term Memory) 및 GRU(Gated Recurrent Units)와 같은 RNN 아키텍처의 더 복잡한 파생물이 소개되었습니다.

RNN의 응용 예는 다음 글에서 소개됩니다: RNN: PyTorch에서 Sentiment Analysis를 위한 기본 순환 신경망 | Greg Postalian-Yrausquin 저 | 2024년 6월 | Towards AI (medium.com)

PyTorch에서 이 네트워크의 정의는 다음과 같습니다:

```python
# 신경망의 정의입니다. 보시다시피 RNN 정의 하나만 있습니다.
# 2개의 레이어와 하나의 선형 레이어가 포함됩니다.
# 오버피팅을 방지하기 위해 드롭아웃 및 정규화가 도입되었습니다

class RNNClassifier(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(RNNClassifier, self).__init__()
        self.hidden_size = hidden_size
        self.RNN = nn.RNN(input_size, hidden_size, num_layers=2, dropout=0.2)
        self.fc = nn.Linear(hidden_size, output_size)
        pass

    def forward(self, input):
        output, hn = self.RNN(input)
        output = self.fc(output)
        return output, hn

model = RNNClassifier(insize, 8, 2)
```

<div class="content-ad"></div>

# 생성 적대 신경망 (Generative Adversarial Networks, GAN):

이것은 MLP, RNN 또는 CNN들의 조합에서 형성될 수 있는 또 다른 복합 아키텍처입니다. 2014년 Ian Goodfellow와 그의 동료들에 의해 작성되었습니다 (원본 논문은 Generative Adversarial Nets (nips.cc)에서 확인할 수 있으며 [1701.00160] NIPS 2016 Tutorial: Generative Adversarial Networks (arxiv.org)에서 튜토리얼을 참조할 수 있습니다). GAN은 두 가지 다른 모델이 훈련되는 매우 똑똑한 신경망 응용 프로그램으로, 하나는 원래 데이터셋을 기반으로 샘플을 생성하는 것을 목표로하고 다른 하나는 이 첫 번째 모델에 대항하여 샘플이 실제인지 가짜인지를 추측합니다.

GAN은 생성적 AI 작업(모델을 기반으로 실제 데이터를 생성하는 것)에 사용됩니다. 텍스트, 이미지 또는 비디오 생성 등이 해당될 수 있습니다. 자세한 설명은 원본 샘플을 기반으로 새로운 객체를 생성해야 하는 생성자(Generator) 네트워크 및 인공적으로 생성된 샘플과 실제 샘플을 구별하도록 훈련된 구분자(Discriminator)를 포함하고 있습니다. 학습의 여러 반복 후에 구분자가 실제 데이터와 가짜 데이터를 구분하는 데 어려움을 겪도록 함으로써 신뢰할 수 있는 제품 생성을 보장합니다.

이것은 PyTorch에서 두 적대적 신경망에 대한 클래스 정의 샘플입니다:

<div class="content-ad"></div>


# 트레이닝 이미지 내의 채널 수. 컬러 이미지의 경우, 채널 수는 3입니다.
nc = 3

# z 잠재 벡터의 크기 (즉, 생성기 입력의 크기)
nz = 100

# 생성기의 특징 맵 크기
ngf = 64

# 판별자의 특징 맵 크기
ndf = 64

# 이것은 진짜와 가짜 이미지를 분리하려는 작업을 수행하는 판별자 네트워크입니다.
class Discriminator(nn.Module):
    def __init__(self, nc, ndf):
        super(Discriminator, self).__init__()
        self.pipeline = nn.Sequential(
# nc는 3이며, 입력은 텐서 3x64x64(64x64의 컬러 이미지이며, 각 컬러 이미지에는 3개의 텐서가 필요)입니다.
            nn.Conv2d(nc, ndf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2),
            nn.Conv2d(ndf, ndf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 2),
            nn.LeakyReLU(0.2),
            nn.Conv2d(ndf * 2, ndf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 4),
            nn.LeakyReLU(0.2),
            nn.Conv2d(ndf * 4, ndf * 8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 8),
            nn.LeakyReLU(0.2),
# 출력은 크기가 1인 벡터입니다.
            nn.Conv2d(ndf * 8, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()
        )

    def forward(self, input):
        return self.pipeline(input)


class Generator(nn.Module):
    def __init__(self, nc, nz, ngf):
        super(Generator, self).__init__()
        self.pipeline = nn.Sequential(
# 생성기의 입력은 무작위 생성된 이미지입니다. 이 경우 채널 수가 100이므로 nz는 100입니다.
            nn.ConvTranspose2d(nz, ngf * 16, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf * 16),
            nn.ReLU(),
            nn.ConvTranspose2d(ngf * 16, ngf * 8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 8),
            nn.ReLU(),
            nn.ConvTranspose2d(ngf * 8, ngf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 4),
            nn.ReLU(),
            nn.ConvTranspose2d(ngf * 4, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf),
            nn.ReLU(),
# 출력은 트레이닝 이미지와 동일한 차원의 이미지입니다. 따라서 출력은 크기가 nc여야 합니다.
            nn.ConvTranspose2d(ngf, nc, 4, 2, 1, bias=False),
            nn.Tanh()
        )

    def forward(self, input):
        return self.pipeline(input)


저는 다음 기사에서 이미지 생성을 위한 GAN을 구현했습니다: GAN: training a Generative Adversarial Network for image generation | by Greg Postalian-Yrausquin | Jun, 2024 | Medium

이것들은 머신 러닝을 위한 신경망의 기본입니다. 하지만 모든 아키텍처에 대한 완전한 설명은 아닙니다. 이 주제는 아주 거대하고 매혹적이며, 새로운 기술과 알고리즘이 지속적으로 등장하고 있는 폭발적인 성장을 이루고 있습니다. 이러한 많은 것들은 이 문서에서 설명된 아키텍처의 수정이나 결합입니다.
