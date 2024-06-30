---
title: "절대 초보자를 위한 신경망 직접 코딩 기초부터 구현까지"
description: ""
coverImage: "/assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_0.png"
date: 2024-06-30 19:11
ogImage: 
  url: /assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_0.png
tag: Tech
originalTitle: "Coding a Neural Network from Scratch for Absolute Beginners"
link: "https://medium.com/@minhaskamal/coding-a-neural-network-from-scratch-for-absolute-beginners-1e68bb0461db"
---


쌀선별기에 대해 알고 계신가요? 여기에 그 이미지가 있어요-

![img](/assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_0.png)

이 기사는 꽤 길어요. 하지만 여러분의 시간을 낭비하게 하려는 것이 아니에요. 이 긴 글은 사실 직관적으로 이해하기 쉽고 학습 속도를 높이기 위해 여기 있는 거예요. 또한 기술 용어와 수학은 피해서 더 간단하게 소화하도록 할게요.

멋져요! 이제 쌀선별기로 돌아가보죠. 이 기계는 벼를 받아들이고 그 후에 어떤 처리(탈곡)를 해요. 마지막에 쌀과 견과가 출력으로 나와요-

<div class="content-ad"></div>

![Coding a Neural Network from Scratch for Absolute Beginners](/assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_1.png)

신경망이나 일반적으로 모든 AI 모델은 일종의 처리 기계와 같습니다. 데이터를 입력으로 받아들이고 어떤 형태의 변환을 실행한 후 변환된 결과를 출력합니다. 예를 들어, 모델에 염소 이미지를 제공하면 이미지를 "염소"라는 단어로 변환합니다. 이렇게 생각하는 것이 매우 도움이 됩니다 - 분류, 분할, 생성과 같은 어떤 유형의 작업을 수행하더라도 모델은 단순히 하나의 데이터를 다른 데이터로 변환하는 것뿐입니다.

간단한 문제인 폭풍 예측으로 넘어가 봅시다. 어두운 구름과 온도의 급격한 하락이 있다면, 우리는 폭풍이 온다고 예측할 수 있습니다. 아래는 데이터의 테이블 형식 표현입니다-

![Coding a Neural Network from Scratch for Absolute Beginners](/assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_2.png)

<div class="content-ad"></div>

실생활에서는 날씨 예측이 복잡한 과정입니다. 여기서는 어두운 구름과 온도 감소가 모두 있는 경우에만 폭풍이 발생한다고 예측할 것입니다. 이 문제를 간단한 'if/else' 문으로 해결할 수 있습니다. 아래는 파이썬 코드입니다-

```js
def predict(dark_clouds, temperature_drop):
    storm = 0
    if dark_clouds == 1 and temperature_drop == 1:
        storm = 1
    return storm

print(predict(1, 1))
print(predict(1, 0))
print(predict(0, 1))
print(predict(0, 0))
```

그러나 여기서는 머신러닝을 다루고 있으므로 문제를 명시적으로 해결하길 원하지 않습니다. ("왜냐하면?"이라고 물어볼 수 있습니다. 실제로 프로그래밍하기 매우 어려운 문제들이 있습니다. 그런 문제들을 해결하기 위해 머신러닝을 사용합니다.). 대신, 주어진 솔루션을 평가하고 더 나은 솔루션을 제안할 수 있는 코드를 작성해야 합니다-

![image](https://miro.medium.com/v2/resize:fit:1400/1*itmi_oBBInInevageKOOxw.gif)

<div class="content-ad"></div>

실전에서는 무작위 예측으로 시작하여 그것을 점진적으로 개선해나갑니다. 모든 것이 괜찮은데, 그럼 뉴런이 무엇인가요?! 뉴런은 여러 입력을 받아들이고, 일종의 마법을 부리며 결과물을 출력하는 함수와 같습니다.

```js
def predict(dark_clouds, temperature_drop):
    storm = 마법!
    return storm
```

마법이 커질수록, 비밀이 어리석어집니다!! 뉴런은 단순히 각 입력에 대해 출력에 미치는 영향에 따라 가중치를 부여합니다. 그런 다음, 가중 입력을 모두 누적합니다. 합계가 1보다 크면 1을 출력하고, 그렇지 않으면 0을 출력합니다.

![이미지](/assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_3.png)

<div class="content-ad"></div>

여기 두 개의 입력이 있기 때문에 각각에 대한 두 개의 가중치를 유지해야 합니다. 따라서, 필요한 가중치와 predict() 함수를 가진 neuron 클래스를 생성할 수 있습니다.

```js
class Neuron:
    def __init__(self):
        self.w1 = 2
        self.w2 = 0.5

    def predict(self, dark_clouds, temperature_drop):
        storm = 0
        if (dark_clouds*self.w1 + temperature_drop*self.w2) > 1:
            storm = 1
        return storm

neuron = Neuron()
print(neuron.predict(1, 1))
print(neuron.predict(1, 0))
print(neuron.predict(0, 1))
print(neuron.predict(0, 0))
```

기다려 주세요! 가중치 값을 어디서 가져오는 건가요? 그것이 바로 머신러닝이죠 :)

제발, 그냥 글을 읽지 말아주세요. 읽기만으로는 깊은 직관력을 갖출 수 없습니다; 연습이 필요합니다. 아직 하지 않으셨다면, Python 편집기나 GoogleColab을 열고 코드를 직접 실행해보세요.

<div class="content-ad"></div>

지금은 w1을 2로 설정하고 w2를 0.5로 설정해 봅시다. 코드를 실행하면 다음 결과가 나올 것입니다-

```js
1
1
0
0
```

여기서 오직 한 가지 실수가 있는 것을 알 수 있습니다- 2번째 예측값은 0이어야 합니다. 이제 두 가중치를 모두 3으로 설정해 봅시다. 그러면, w1=3이고 w2=3이 됩니다. 이제 우리는 다음 결과를 얻습니다-

```js
1
1
1
0
```

<div class="content-ad"></div>

Ups! 지금 두 가지 오류가 있어요 - 2번째와 3번째 예측이 틀렸어요. w1=0.6, w2=0.8로 설정해보겠습니다 -

```js
1
0
0
0
```

와우! 이제 모든 정답을 맞췄어요. 다른 가중치 값을 사용해서 정확한 결과를 얻을 수 있는지 확인해보세요.

지금까지 알게 된 것은 - 가중치를 변경함으로써 입력-출력 패턴에 맞게 예측 함수를 조정할 수 있습니다. 따라서, 두 입력과 출력값을 받아 가중치를 조정하기 위해 어떤 매직(다시 한번)을 하는 학습 함수가 필요합니다.

<div class="content-ad"></div>

아래는 일부 무작위 값으로 가중치를 초기화하겠습니다 (여기서 예측 함수는 다음과 같이 최소화됩니다 [...])-

```js
import random

class Neuron:
    def __init__(self):
        self.w1 = random.random()
        self.w2 = random.random()

    def predict(self, dark_clouds, temperature_drop): [...]

    def learn(self, dark_clouds, temperature_drop, storm):
        self.w1 = 마법!
        self.w2 = 마법!
```

그래서 여기서의 마법은 먼저 우리가 가진 무작위 가중치로 결과를 예측해보는 것입니다. 그런 다음 예측값을 실제 결과에서 뺌으로써 오차를 계산합니다. 마지막으로, 오차와 관련 입력(가중치로 곱해진 값)에 의해 가중치를 업데이트합니다. 이것은 가중치가 오차에 미치는 영향(관련 입력)에 기초하여 가중치에 벌을 부과하는 것과 같습니다. 이것을 생각해볼 수도 있는데, 에러를 생성하는 데 가중치의 부분에 따라 가중치에 에러를 분배하는 것과 같습니다.

```js
import random

class Neuron:
    def __init__(self): [...]

    def predict(self, dark_clouds, temperature_drop): [...]

    def learn(self, dark_clouds, temperature_drop, storm):
        오차 = self.predict(dark_clouds, temperature_drop) - storm
        self.w1 -= 오차 * dark_clouds / 100
        self.w2 -= 오차 * temperature_drop / 100
```

<div class="content-ad"></div>

너무 많은 변화를 원하지 않아요. 솔루션으로 나아가기 위해 작은 단계를 나아갈 거예요 (큰 단계는 종종 발산을 일으킵니다). 그래서 가중치를 업데이트할 때 에러를 100으로 나눠줘요.

이제 훈련 및 테스트 코드를 추가할 수 있어요-

```js
import random

class Neuron: [...]

neuron = Neuron()

while True:
    # 테스트
    if (neuron.predict(1, 1) == 1 and
            neuron.predict(1, 0) == 0 and
            neuron.predict(0, 1) == 0 and
            neuron.predict(0, 0) == 0):
        break

    # 훈련
    neuron.learn(1, 1, 1)
    neuron.learn(1, 0, 0)
    neuron.learn(0, 1, 0)
    neuron.learn(0, 0, 0)

# 출력
print(neuron.predict(1, 1))
print(neuron.predict(1, 0))
print(neuron.predict(0, 1))
print(neuron.predict(0, 0))
```

알 수 있듯이, 모든 올바른 출력을 얻을 때까지 훈련을 실행하고 있어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-CodingaNeuralNetworkfromScratchforAbsoluteBeginners_4.png" />

이렇게 까지 오신 것을 축하드립니다! 당신은 제로베이스에서 인공 신경세포를 직접 코딩하고 훈련시켰습니다!! 멋지세요!!!

훈련 및 테스트를 위한 함수를 만들어 봅시다 -

```js
import random

class Neuron: [...]


data = [[1, 1, 1],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0]]

def runTraining(neuron):
    for row in data:
        neuron.learn(row[0], row[1], row[2])

def runTesting(neuron):
    return [neuron.predict(row[0], row[1]) for row in data]

neuron = Neuron()
while True:
    output = runTesting(neuron)
    print(output)
    if output == [row[2] for row in data]:
        break

    runTraining(neuron)
```

<div class="content-ad"></div>

코드를 여러 번 실행하면 매번 해결책에 도달하기 위해 필요한 단계가 다를 수 있어요. 이는 가중치를 초기화하는 데 사용되는 랜덤 값 때문입니다. 때로는 한 단계만으로도 해결에 도달할 수 있을 수도 있어요.

자, 이제 다른 출력값들과 놀아볼까요? 두 번째 출력값을 1로 변경하고 코드를 여러 번 실행해보세요 -

```js
data = [[1, 1, 1],
        [1, 0, 1],
        [0, 1, 0],
        [0, 0, 0]]
```

이번에는 해결책에 도달하기 위해 더 많은 단계가 소요되나요? 그런 이유가 무엇일까요? 시간을 내서 곰곰히 생각해보세요. 각 훈련 단계 이후에 가중치를 출력하여 변화를 분석해볼 수 있어요.

<div class="content-ad"></div>

이제, 첫 번째 출력을 0으로 설정하고 다시 실행해보겠습니다.

```js
data = [[1, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [0, 0, 0]]
```

해결책에 도달하는 데 더 적은 단계가 필요한가요? 아니면 더 많은 단계가 필요한가요? 이해하는 것은 인공 뉴런의 기본 메커니즘을 이해하는 데 매우 유용합니다.

이제, 모든 출력을 1로 설정해보겠습니다 -

<div class="content-ad"></div>

```js
데이터 = [[1, 1, 1],
        [1, 0, 1],
        [0, 1, 1],
        [0, 0, 1]]
```

무슨 일이 일어나고 있나요? 컴퓨터가 다운되었나요? 아니면 응답하지 않는 건가요? 사실, while 루프에 갇혔습니다. 모든 올바른 출력을 얻지 못하기 때문입니다. 문제는 4번째 행인 [0, 0, 1]에 발생합니다. 그리고 그 이유를 이해하는 것은 쉽습니다 - 입력 값이 둘 다 0(영)이기 때문입니다. 그렇기 때문에 어떤 가중치를 곱해도 0이 됩니다. 따라서, predict() 함수의 조건인 `(dark_clouds*self.w1 + temperature_drop*self.w2) ` 1`은 절대 충족되지 않을 것입니다.

여기서 멈춰주세요. 이 기발한 문제에 대해 생각해보세요. 이를 해결하기 위해 무엇을 할 것인지 고민해보세요. 계속 읽기 전에 뇌에 충분한 시간을 주세요.

여기서 문제가 되는 것은 조건에서의 임계점인 1(하나)입니다. 1 대신 -1(음수 1)을 임계점으로 사용할 수 있습니다- `(dark_clouds*self.w1 + temperature_drop*self.w2) ` -1` . 이렇게 하면 문제가 해결됩니다. 그러나 그렇게 되면 모든 0(영) 출력에 대한 문제가 발생할 것입니다-

<div class="content-ad"></div>

```js
데이터 = [[1, 1, 0],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0]]
```

따라서 해당 임계값을 조정해야 합니다. 임계값에 랜덤 값을 설정하고 가중치를 학습한 방식과 동일한 방법으로 학습할 수 있습니다. 여기에 코드 전체가 있습니다-

```js
import random

class Neuron:
    def __init__(self):
        self.w1 = random.random()
        self.w2 = random.random()
        self.t = random.random()

    def predict(self, dark_clouds, temperature_drop):
        storm = 0
        if (dark_clouds*self.w1 + temperature_drop*self.w2) > self.t:
            storm = 1
        return storm

    def learn(self, dark_clouds, temperature_drop, storm):
        error = self.predict(dark_clouds, temperature_drop) - storm
        self.w1 -= error * dark_clouds / 100
        self.w2 -= error * temperature_drop / 100
        self.t += error / 100

data = [[1, 1, 1],
        [1, 0, 1],
        [0, 1, 1],
        [0, 0, 1]]

def runTraining(neuron):
    for row in data:
        neuron.learn(row[0], row[1], row[2])

def runTesting(neuron):
    return [neuron.predict(row[0], row[1]) for row in data]

neuron = Neuron()
while True:
    output = runTesting(neuron)
    print(output)
    if output == [row[2] for row in data]:
        break

    runTraining(neuron)
```

와우! 놀랄만한 여정이었어요! 기계 학습(ML)의 세계에 오신 것을 환영합니다. 이제 어떤 어려운 ML 용어를 알아보도록 하죠-

<div class="content-ad"></div>

편향: 머신 러닝에서 임계값 t를 단순히 편향이라고 부릅니다.

매개변수: w1, w2 및 t(가중치와 편향)는 학습을 통해 배우는 변수인 매개변수로 불립니다. 매개변수를 선택하는 행위를 매개변수화라고 합니다.

모델: 학습 후에는 올바른 출력을 생성하는 좋은 w1, w2 및 t (가중치와 편향) 값들이 있게 됩니다. 이러한 매개변수 값의 집합을 모델이라고 부릅니다.

학습률: 함수 learn()에서 매개변수를 조정하는 동안 값들을 100으로 나눕니다. 이를 0.01로 곱하는 것으로 생각할 수 있습니다. 이 0.01을 학습률이라고 부르며, 종종 알파(α)로 표시됩니다. 학습률은 매우 중요한 하이퍼파라미터입니다(사람이 설정하는 값으로, 학습을 통해 학습되지 않는 값).

<div class="content-ad"></div>

그레디언트 디센트: 우리가 learn() 함수에서 실행한 알고리즘은 매개변수(가중치와 편향)를 조정하기 위한 그레디언트 디센트라고 합니다. 더 구체적으로는 확률적 경사 하강법(SGD)입니다.

회귀: 예측, 오차 계산 및 매개변수 조정의 전체 반복 과정을 회귀라고 합니다. 여기서 사용한 변형은 선형 회귀입니다.

에포크: 올바른 출력값에 도달하기 위해 회귀에서 필요한 반복 수입니다.

위 코드는 두 가지 입력만을 고려했습니다. 그러나 배열을 사용하여 어떤 수의 입력이라도 쉽게 업그레이드할 수 있습니다. 전체 코드는 여기에서 찾을 수 있습니다.

<div class="content-ad"></div>

우리에게는 마지막 테스트가 하나 더 있어요 :D

```js
data = [[1, 1, 0],
        [1, 0, 1],
        [0, 1, 1],
        [0, 0, 0]]
```

이곳에는 하나의 뉴런만 있어요. 그리고 이 문제를 해결할 수 있는 뉴런이 한 개만 있다는 것이 증명되었어요. 이 문제를 해결하기 위해 여러 개의 뉴런(또는 신경망)이 필요할 거예요. [곧 연속되는 파트가 나올 거에요...]