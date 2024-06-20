---
title: "딥 러닝을 이용한 우울증 예측 NLP 기초 배우기"
description: ""
coverImage: "/assets/img/2024-05-27-DepressionpredictionusingDeepLearninglearnbasicsofNLP_0.png"
date: 2024-05-27 14:08
ogImage:
  url: /assets/img/2024-05-27-DepressionpredictionusingDeepLearninglearnbasicsofNLP_0.png
tag: Tech
originalTitle: "Depression prediction using Deep Learning (learn basics of NLP)"
link: "https://medium.com/@omid3jafari/depression-prediction-using-deep-learning-learn-basics-of-nlp-5c05c97d01a9"
---

<table>
  <tr>
    <td><img src="/assets/img/2024-05-27-DepressionpredictionusingDeepLearninglearnbasicsofNLP_0.png" /></td>
  </tr>
</table>

# 이 논문에서는 우리가 어떻게 NLP 애플리케이션을 쉽게 만들 수 있는지 보여드리고 싶습니다.

이 논문에서는 NLP의 기본을 배우게 될 것입니다.
다음은 여러분이 배우게 될 내용입니다:

1 — Tokenizer가 무엇인가요?

<div class="content-ad"></div>

2 — texts_to_sequences란 무엇인가요?

3 — pad sequence란 무엇인가요?

4 — Embedding이란 무엇인가요?

5 — 예측 모델을 만들어 볼까요?

이 코드는 텍스트 데이터를 포함하는 이진 NLP 데이터셋에 사용할 수 있습니다.

<div class="content-ad"></div>

# 1 — 토크나이저란:

기계는 숫자만 이해할 수 있다는 것을 우리 모두 알고 있습니다. 그래서 우리는 단어를 숫자로 변환해야 합니다.

예를 들어, 만약 'hello world'를 기계가 이해할 수 있게 하려면 이렇게 숫자로 변환해야 합니다:
hello는 0으로 표현
world는 1로 표현

이를 수행하기 위해 토크나이저를 사용합니다.

<div class="content-ad"></div>

토크나이저를 사용하여 단어, 하위 단어, 문자를 숫자로 변환하고 각 단어를 숫자로 변환한 것을 토큰이라고 합니다.

요약하자면, 토크나이저는 텍스트를 토큰으로 변환합니다.

## 데이터셋

우선 데이터셋을 가져와야 합니다. 이 논문에서 사용된 데이터셋은 아래 링크를 통해 찾을 수 있습니다:

<div class="content-ad"></div>

# 프로그래밍 해봐요 :))

데이터셋을 위한 변수를 정의해볼게요 :

```js
dataset = pd.read_csv("D:ITML projectPredict depressiondepression_dataset_reddit_cleaned.csv");
```

이제 문장과 레이블을 위한 변수 두 개를 정의해야 해요 :

<div class="content-ad"></div>

```js
sentences = dataset["clean_text"];
labels = dataset["is_depression"];
```

모델을 훈련하기 위해 훈련 데이터와 모델을 시험하고 최적화하는 테스트 데이터가 필요합니다.

따라서 이제 데이터를 두 부분, 훈련 및 테스트용으로 분리해야 합니다.

데이터는 7731개의 행(샘플)을 포함하고 있으며, 0부터 6000까지는 훈련 데이터로 정의하며, 즉 6000 이전의 모든 데이터는 훈련에, 그 이후의 모든 데이터는 테스트에 사용합니다:

<div class="content-ad"></div>

```js
training_size = 6000

training_sentences = sentences[0:training_size]
testing_sentences = sentences[training_size:]

training_labels = labels[0:training_size]
testing_labels = labels[training_size:]
```

Tokenizer 작업을 해봅시다.

```js
'''
여기서는 텐서플로우 토크나이저를 사용합니다.
'''

from keras.preprocessing.text import Tokenizer #Tokenizer 가져오기

vocab_size = 10000 #토크나이저가 기대하는 단어의 개수

tokenizer = Tokenizer(num_words=vocab_size, oov_token='<OOV>', lower=True)
tokenizer.fit_on_texts(training_sentences) #단어를 숫자로 변환하기
#word_index = tokenizer.word_index #각 단어의 숫자(토큰)를 표시
# print(word_index)
```

oov_token='`OOV`': 이 매개변수는 어휘에 없는 단어를 처리하는 데 도움을 줍니다.

<div class="content-ad"></div>

lower=True : 모든 단어를 소문자로 변환합니다.

# 2 — texts_to_sequences

이 방법을 사용하면 단어를 나타내는 모든 숫자가 순서로 변환됩니다.

예를 살펴보겠습니다

<div class="content-ad"></div>

```js
sentence1 = '개는 좋은 동물이다'
sentence2 = '내 이름은 오미드야'

tokenizer = Tokenizer(num_words=10, oov_token='<OOV>', lower=True)
tokenizer.fit_on_texts([sentence1, sentence2])
word_index = tokenizer.word_index
print(word_index)

sequences = tokenizer.texts_to_sequences([sentence1, sentence2])
print(sequences)

'''
Output:
{'<OOV>': 1, '은': 2, '개는': 3, '좋은': 4, '동물이다': 5, '내': 6, '이름은': 7, '오미드야': 8}
[[3, 2, 4, 5], [6, 7, 2, 8]]
'''
```

# 3 — 시퀀스 패딩

모든 문장이 같은 길이를 가지고 있지 않기 때문에, 이를 처리하기 위해 시퀀스 패딩을 사용합니다.

예를 들어 2개의 문장이 있는데, 하나는 3단어이고 다른 하나는 4단어를 가지고 있다고 가정해보겠습니다. 이런 상황에서, 패딩 시퀀스는 2x4 행렬을 만들어줍니다. 3단어를 가진 문장은 맨 끝이나 맨 처음 행렬 요소를 0으로 처리할 것입니다.

예제로 살펴보겠습니다:

<div class="content-ad"></div>

```js
from keras.preprocessing.sequence import pad_sequences

sequences = tokenizer.texts_to_sequences([sentence1, sentence2]) #지난 코드와 비슷함

sentences_padded = pad_sequences(sequences)
print(sentences_padded)

'''
output:
[[3 2 4 5 6]
 [0 7 8 2 9]]
'''
```

더 많은 정보를 원하시면 문서를 읽어보세요.

이제 우리의 주요 코드(우울증 예측)로 돌아가보겠습니다.

이제 texts_to_sequences와 Pad sequences가 무엇인지 알았으니 이를 통해 데이터를 처리해봅시다!

<div class="content-ad"></div>

```js
from keras.preprocessing.sequence import pad_sequences

max_length = 100 # tokenizer가 허용할 문장의 최대 길이

training_sequences = tokenizer.texts_to_sequences(training_sentences)
training_padded = pad_sequences(training_sequences, maxlen=max_length)

testing_sequences = tokenizer.texts_to_sequences(testing_sentences)
testing_padded = pad_sequences(testing_sequences, maxlen=max_length)
```

이제 데이터가 준비되었으니 모델을 만들 수 있지만, 그 전에 Embedding이 무엇인지 알아보겠습니다.

# 4 — Embedding

Embedding은 단어를 벡터로 변환합니다. 이를 통해 모델은 단어 간의 관계를 이해할 수 있습니다.



<div class="content-ad"></div>

예를 들어, '좋은'과 '나쁜'이라는 단어가 있다고 상상해보세요. 그런데 '나쁘지 않은'처럼 특정한 단어가 있는 경우에는 이 단어가 부정적인 느낌을 나타내는 '나쁜'과 연관되어 있음을 모델이 이해하도록 임베딩이 도움이 됩니다.

# 5 — 예측 모델 만들기

모델은 임베딩 레이어로 훈련되었으며, 그 후에는 글로벌 평균 풀링 1D, 24개의 밀집 (완전 연결) 레이어(relu 활성화 함수 사용) 및 마지막 레이어에 시그모이드 활성화 함수를 사용한 1개의 밀집 레이어로 구성되어 있습니다. 이를 10번의 epoch 동안 훈련시켰습니다.

활성화 함수는 모델이 데이터를 더 잘 이해하도록 돕습니다.

<div class="content-ad"></div>

## ReLU 활성화 함수

ReLU는 값이 0보다 큰 경우에만 활성화되는 활성화 함수입니다:

R(x) = max(0,x)

## 시그모이드 활성화 함수

<div class="content-ad"></div>



![Image](/assets/img/2024-05-27-DepressionpredictionusingDeepLearninglearnbasicsofNLP_1.png)

If the labels of the data are binary (0 or 1) like the dataset we are using, we use the sigmoid activation function.

If the output of the sigmoid activation function (the last layer) is greater than 0.5, it is assigned the label 1. If it is lower than 0.5, it is assigned the label 0.

In summary:



<div class="content-ad"></div>



출력 결과 `0.5 — — → 1

출력 결과 `0.5 — — -` 0

## 코드

```js
from keras.models import Sequential
from keras.layers import Embedding, Dense, GlobalAveragePooling1D

embedding_dim = 16 #임베딩 레이어의 차원
model = Sequential([
    Embedding(vocab_size, output_dim=embedding_dim, input_length=max_length),
    GlobalAveragePooling1D(),
    Dense(24, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

num_epochs = 10
history = model.fit(training_padded, training_labels, epochs=num_epochs, validation_data=(testing_padded, testing_labels))
```



<div class="content-ad"></div>

## 플롯

10 epochs에서 모델의 진행 상황을 확인해 봅시다.

```python
import matplotlib.pyplot as plt

plt.plot(history.history['accuracy'])
plt.plot(history.history['loss'])
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend(['accuracy', 'loss'])
```

![image](/assets/img/2024-05-27-DepressionpredictionusingDeepLearninglearnbasicsofNLP_2.png)

<div class="content-ad"></div>

각 epoch마다 모델이 개선되었음을 확인할 수 있습니다. 정확도가 증가하고 손실이 감소했어요.

## 모델 테스트

이제 모델을 테스트해볼게요. 입력 텍스트에 texts_to_sequence 및 pad_sequences를 수행할 필요가 있다는 것을 잊지 마세요.

```js
test_sentence = ['the life became so hard i can not take it any more i just wanna die ']
test_sentence = tokenizer.texts_to_sequences(test_sentence)
padded_test_sentence = pad_sequences(test_sentence, maxlen=max_length)
print(model.predict(padded_test_sentence))

'''
output :
[[0.6440944]]
'''
```

<div class="content-ad"></div>

입력 텍스트 (test_sentence)에는 분명히 슬픈 감정이 있습니다. 모델의 출력값은 0.64로, 0.5보다 큽니다. 이전에 언급했듯이, 레이블 1로 할당되어 우울증이 긍정적이라는 것을 의미합니다.

# GitHub:

아래 링크를 통해 GitHub에서 코드에 접근할 수 있습니다.

# 마지막 요청

<div class="content-ad"></div>

읽어 주셔서 감사합니다. 즐거워하셨으면 좋겠어요!
