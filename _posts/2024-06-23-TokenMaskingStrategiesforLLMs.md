---
title: "대형 언어 모델LLM을 위한 토큰 마스킹 전략들"
description: ""
coverImage: "/assets/img/2024-06-23-TokenMaskingStrategiesforLLMs_0.png"
date: 2024-06-23 19:24
ogImage: 
  url: /assets/img/2024-06-23-TokenMaskingStrategiesforLLMs_0.png
tag: Tech
originalTitle: "Token Masking Strategies for LLMs"
link: "https://medium.com/towards-artificial-intelligence/token-masking-strategies-for-llms-d2e6c926b22d"
---


## 다양한 언어 모델에서 사용되는 다양한 가리기 기술, 그 이점 및 Pytorch를 사용하여 낮은 수준에서 작동하는 방법에 대해 자세히 알아보세요.

![이미지](/assets/img/2024-06-23-TokenMaskingStrategiesforLLMs_0.png)

토큰 마스킹은 분류 변형 및 생성 모델에서 언어 모델을 훈련하는 데 널리 사용되는 전략입니다. BERT 언어 모델이 소개했으며 많은 변형(RoBERTa, ALBERT, DeBERTa 등)에서 사용되었습니다.

그러나 토큰 마스킹은 텍스트 손상이라는 큰 그룹 내의 전략입니다. BART 연구 논문에서는 다양한 텍스트 손상 전략을 사용하여 인코더-디코더 생성 모델을 훈련하는 많은 실험이 수행되었습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-TokenMaskingStrategiesforLLMs_1.png" />

텍스트 손상에 대한 다양한 기술을 논의하기 전에, 대형 언어 모델(Large Language Models, LLMs)의 모든 텍스트 손상 방법에 대한 표준 개념에 대해 이야기하겠습니다.

# 지도 학습에서 자기 지도 학습으로

대규모 양의 텍스트가 언어 모델의 초기 교육에 사용되며, 모델이 언어를 올바르게 표현하도록 학습하고, 이 지식을 그 매개 변수 가중치에 암묵적으로 저장합니다.

<div class="content-ad"></div>

이 방대한 양의 텍스트는 학습을 위한 레이블이 있어야 합니다. 모델 입력 데이터를 처리한 후 참조 데이터를 사용하여 교차 엔트로피를 계산해야 합니다. 그러나 이렇게 많은 데이터에 주석을 다는 것은 현실적이지 않습니다. 따라서 우리는 자동 레이블 생성을 찾게 되었고, 지도 문제를 자가지도 문제로 전환하게 되었습니다.

이 경우, 손상된 시퀀스는 모델의 학습 입력으로 작용하고, 기존 시퀀스의 전체 또는 일부가 학습 데이터의 레이블로 작용합니다. 이는 모델의 성격(인코더 또는 인코더-디코더)에 따라 다릅니다.

# 손상 확률

자동 레이블을 사용하여, 모델은 데이터에 주석을 달지 않고 각 학습 예제와 연결된 레이블을 학습합니다.

<div class="content-ad"></div>

텍스트 손상(특히 토큰 마스킹, 토큰 삭제 및 텍스트 인필링에서)에서 각 단어는 일반적으로 15–20% 정도의 확률에 따라 손상될 것입니다. 이 확률은 모델이 각 문장의 맥락을 학습할 수 있도록 낮게 유지됩니다.

문장 순서 바꾸기 또는 문서 회전과 같은 일부 텍스트 손상 기술은 특정 확률로 단어를 손상시키지 않습니다. 이로 인해 다른 손상 기술과 호환되도록 할 수 있습니다. 아래에서 논의할 것과 같이요.

# 분류와 생성 사이의 차이점

텍스트 손상을 통해 언어 모델을 학습할 때, 레이블은 분류 모델(인코더만)인지 생성 모델(인코더-디코더)인지에 따라 달라집니다.

<div class="content-ad"></div>

분류 모델에서는 레이블을 사용하여 입력의 오염된 영역에만 주의를 기울입니다. 따라서 만약 문장 전체에서 단어가 마스킹되었다면, 레이블은 초기 시퀀스가 되어 오염된 시퀀스에만 주의를 기울입니다.

생성 모델의 경우, 모델이 텍스트를 연속적으로 생성할 수 있어야 하므로 출력 레이블은 초기 정상 시퀀스가 되며 전체 시퀀스 자체에 주의를 기울입니다.

# 설정

이제 우리는 텍스트 오염으로 언어 모델을 학습할 때의 공통점을 간단히 소개했으니, 텍스트를 손상시키는 다양한 기술과 각 경우에 코드 예시를 제시하는 것을 논의해보겠습니다.

<div class="content-ad"></div>

우리는 서로 다른 전략들이 어떻게 작동하는지 보기 위해 코드 예제에서 문서로 시작하겠습니다. 우리는 전처리에 매우 유용한 여러 자연어 처리 도구를 갖춘 Stanford NLP에서 개발된 라이브러리인 Stanza를 사용할 것입니다.

```js
import stanza
stanza.download('en')

# 예제에서 사용되는 텍스트
text = "헌팅턴병은 유전적인 신경퇴행성 질환으로 헌팅틴 유전자 내 다형성 CAG 반복이 확장되면서 발생합니다. 번역 초기 인자 4E-BP의 인산화는 번역 조절의 변경으로 이어져서 원치 않는 단백질 합성과 신경 기능에 영향을 줍니다. 돌연변이 헌팅틴(mhtt) 유전자의 전사 결과는 잘 알려지지 않았습니다. 발병 연령의 가변성은 성인과 소아형 헌팅턴병을 분리하는 중요한 요소입니다. 고령 유전자, 어머니의 보호(즉, 과도한 아버지의 유전), 우수한 노화 유전자 및 환경 임계치가 고려되는 요소입니다. 분자 병인학에 중점을 둔 부분으로는 운동 장애, 인지 장애 및 신경 정신 장애가 포함됩니다. 진단 부분도 고려되었습니다. 이는 유전자 검사 및 주요 및 이차 증상을 포함합니다. 헌팅턴병의 유전학과 병리학에도 주목합니다."

# 각 다른 문장을 리스트 요소로 얻기 위해 Stanza 모델을 사용할 것입니다.
nlp = stanza.Pipeline('en', use_gpu=False)
doc = nlp(text)
sentences = [sentence.text for sentence in doc.sentences]
```

# 토큰 가림

BERT는 이 전략을 도입했는데, 이는 첫 번째이자 가장 잘 알려진 시퀀스 손상 전략입니다. 입력 시퀀스를 무작위 단어로 가려서 훈련 중에 레이블로 사용될 단어를 손상하는 것으로 구성되어 있습니다.

<div class="content-ad"></div>

분류 모델에서는 Huggingface transformers에서 DataCollatorForLanguageModeling 클래스를 직접 사용하여 BERT 또는 RoBERTa와 같은 모델을 학습할 수 있는 필요한 레이블을 생성할 수 있습니다.

```js
from transformers import AutoTokenizer, DataCollatorForLanguageModeling
import torch

def load_dataset_mlm(sentences, tokenizer_class=AutoTokenizer, 
                     collator_class=DataCollatorForLanguageModeling, 
                     mlm=True, mlm_probability=0.20):
    tokenizer = tokenizer_class.from_pretrained('google-bert/bert-base-uncased')
    inputs = tokenizer(sentences, return_tensors='pt', padding=True, 
                       truncation=True)
    
    # 랜덤 마스킹 설정
    data_collator = collator_class(
        tokenizer=tokenizer, 
        mlm=mlm,  
        mlm_probability=mlm_probability 
    )

    """콜레이터는 텐서들 튜플을 기대하므로 입력 텐서들을 분리한 다음
    첫 번째 차원을 삭제하고 튜플로 전달해야 합니다."""
    tuple_ids = torch.split(inputs['input_ids'], 1, dim=0)
    tuple_ids = list(tuple_ids)
    for tensor in range(len(tuple_ids)):
        tuple_ids[tensor] = tuple_ids[tensor].squeeze(0)
    tuple_ids = tuple(tuple_ids)
    
    # 각 문장의 input_ids, attention_masks 및 레이블 가져오기
    batch = data_collator(tuple_ids)
    return batch['input_ids'], inputs['attention_mask'], batch['labels']


input_ids, attention_mask, labels = load_dataset_mlm(sentences)

"""
input_ids[0]:
tensor([  101, 16364,  1005,  1055,   103,  2003,  1037,   103, 10976,  3207,
          103, 25284,   103, 25426, 16870,  4295,  3463,  2349,  2000,   103,
         1997, 26572, 18078,  6187,  2290, 17993,  1999,  1996,  5933,  7629,
          103,   103,   102,     0,     0])

attention_mask[0]:
tensor([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0])

labels[0]:
tensor([ -100,  -100,  -100,  -100,  4295,  -100,  -100, 11265,  -100,  -100,
         6914,  -100,  8285,  -100,  2389,  -100,  -100,  -100,  -100,  4935,
         -100,  -100,  -100,  -100,  -100,  -100,  -100,  -100,  -100,  -100,
         4962,  1012,  -100,  -100,  -100))

"""
```

생성된 input_ids에는 원본 텍스트의 각 토큰에 대한 정수 번호가 있습니다. 특별한 토큰은 마스킹된 단어를 나타내며 (BERT에서는 이 토큰이 103입니다), 이 특별한 토큰은 사용하는 언어 모델에 따라 다르며 서로 다른 토크나이저는 서로 다른 주의 마스크 식별자를 반환합니다.

또한, Huggingface는 모델 내에서 다른 작업을 수행하여 고유 토큰에 대해 다른 작업을 지정하므로 "-100"으로 표시된 토큰은 모델에서 무시해야 함을 나타냅니다.

<div class="content-ad"></div>

BART와 같은 생성 모델의 경우, DataCollatorForLanguageModeling 클래스를 사용하여 토큰 마스킹 전략을 구현할 수 있습니다. 그러나 생성 모델에 맞게 태그를 조정하기 위해 작은 변경을 도입해야 합니다.

```js
from transformers import BartTokenizer, DataCollatorForLanguageModeling
import torch

def load_dataset_mlm(sentences, tokenizer_class=BartTokenizer, 
                     collator_class=DataCollatorForLanguageModeling, 
                     mlm=True, mlm_probability=0.20):
    tokenizer = tokenizer_class.from_pretrained('facebook/bart-base')
    inputs = tokenizer(sentences, return_tensors='pt', padding=True, 
                       truncation=True)
    
    # 랜덤 마스킹 구성
    data_collator = collator_class(
        tokenizer=tokenizer, 
        mlm=mlm,  # 마스크된 언어 모델링을 위해 True
        mlm_probability=mlm_probability  # 각 토큰이 마스킹될 확률
    )

    """Collator는 텐서의 튜플을 예상하므로 입력 텐서를 분할하고 첫 번째 차원을 제거한 후 튜플로 전달해야합니다."""
    tuple_ids = torch.split(inputs['input_ids'], 1, dim=0)
    tuple_ids = list(tuple_ids)
    for tensor in range(len(tuple_ids)):
        tuple_ids[tensor] = tuple_ids[tensor].squeeze(0)
    tuple_ids = tuple(tuple_ids)
    
    # 각 문장에 대한 input_ids, attention_masks 및 labels 가져오기
    batch = data_collator(tuple_ids)
    batch['labels'] = inputs['input_ids']
    return batch['input_ids'], inputs['attention_mask'],  batch['labels']

input_ids, attention_mask, labels = load_dataset_mlm(sentences)

"""
input_ids[0]:
tensor([    0, 38831,  2577,  1054,    18,  2199,    16,    10, 14913, 28904,
         5777,  3693, 32226, 38868,  2199,   775,   528,     7,  2919,     9,
        48052,   636,   230,  3450, 35315,    11,     5, 50264, 50264, 50264,
            4,     2])

attention_mask[0]:
tensor([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1])

labels[0]:
tensor([    0, 38831,  2577,  1054,    18,  2199,    16,    10, 14913, 28904,
         5777,  3693, 32226, 38868,  2199,   775,   528,     7,  2919,     9,
        48052,   636,   230,  3450, 35315,    11,     5,  8217, 24276, 10596,
            4,     2])
"""
```

여기서 각 입력 토큰은 마스크 여부에 관계없이 해당하는 토큰을 레이블링하며, 이는 분류 모델과는 달리 모델이 제공된 시퀀스에 기반한 텍스트 시퀀스를 생성할 수 있어야 하기 때문입니다. BART의 경우, 각 마스크를 나타내는 토큰은 ID 50264를 갖습니다.

# 토큰 삭제

<div class="content-ad"></div>

이 전략은 마스킹에 대해 다른 접근 방식을 사용합니다. 특정 확률로 텍스트의 원래 시퀀스에서 단어가 제거되어 모델은 빈칸과 해당 위치를 찾아야 합니다. 표준 마스킹은 마스크가 이미 모델의 입력에서 지정되어 있기 때문에 위치를 학습하지 않습니다.

```js
def token_deletion(sentences, tokenizer_class=BartTokenizer, collator_class=DataCollatorForLanguageModeling, 
                 mlm=True, mlm_probability=0.20):
    tokenizer = tokenizer_class.from_pretrained('facebook/bart-base')
    inputs = tokenizer(sentences, return_tensors='pt', padding=True, truncation=True)
    
    data_collator = collator_class(
        tokenizer=tokenizer, 
        mlm=mlm,
        mlm_probability=mlm_probability 
    )

    tuple_ids = torch.split(inputs['input_ids'], 1, dim=0)
    tuple_ids = list(tuple_ids)
    for tensor in range(len(tuple_ids)):
        tuple_ids[tensor] = tuple_ids[tensor].squeeze(0)
    tuple_ids = tuple(tuple_ids)
 
    batch = data_collator(tuple_ids)

    # We use the initial inputs as labels
    batch['labels'] = batch['input_ids'].clone()
    
    # We remove tokens with mask identifier and thus make token deletion
    # Change the value to the mask identifier of the specific token model
    # It is necessary to know the identifier of the mask token for 
    # that specific model
    mask = batch['input_ids'] != 50264
    initial_size = batch['input_ids'].size(1)
    total_sentences = batch['input_ids'].size(0)

    # When we remove the specific token, we must fill with the padding 
    # token otherwise the tensor size is not respected.
    for i in range(total_sentences):
        new_tensor = batch['input_ids'][i][mask[i]]
        new_tensor = F.pad(new_tensor, (0, initial_size - new_tensor.size(0)), value=1)
        batch['input_ids'][i] = new_tensor
        attention_mask = batch['input_ids'][i] == 1
        inputs['attention_mask'][i][attention_mask] = 0
        
    return batch['input_ids'], inputs['attention_mask'], batch['labels']

input_ids, attention_mask, labels = token_deletion(sentences)

"""
input_ids[0]:
tensor([    0, 38831,  2577,  1054,  2199, 14913, 28904,  3693, 32226, 38868,
         2199,   775,   528,     7,  2919,     9, 23404,   636,   230, 35315,
           11,     5, 24276, 10596,     4,     2,     1,     1,     1,     1,
            1,     1])

attention_mask[0]:
tensor([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 0, 0, 0, 0, 0])

labels[0]:
tensor([    0, 38831,  2577,  1054, 50264,  2199, 50264, 50264, 14913, 28904,
        50264,  3693, 32226, 38868,  2199,   775,   528,     7,  2919,     9,
        23404,   636,   230, 50264, 35315,    11,     5, 50264, 24276, 10596,
            4,     2])

"""
```

BART를 사용하여 Token Deletion을 훈련할 때, 일부 텍스트 생성 벤치마킹은 질문 응답, 요약 생성 작업 및 대화 작업에 긴 시퀀스를 사용할 때 약간의 개선이 나타납니다.

# 텍스트 채워넣기

<div class="content-ad"></div>

텍스트 인필링은 토큰 마스킹과 비슷합니다. 특정 확률로 원본 텍스트에 마스크를 씌우게 됩니다. 이 경우에는 마스킹이 하나의 단어 이상을 덮을 수 있다는 차이가 있습니다. BART에서 텍스트 인필링을 적용할 때, 람다 값이 3인 포아송 분포를 사용하여 마스킹을 수행합니다. 이는 평균적으로 문장에서 텍스트가 마스킹될 때마다 세 개의 단어가 하나의 토큰 마스크로 마스킹됨을 의미합니다. 그러나 확률 분포이기 때문에 더 많거나 더 적은 개수의 마스킹된 단어가 있을 수도 있습니다.

![image](/assets/img/2024-06-23-TokenMaskingStrategiesforLLMs_2.png)

저희는 NumPy 라이브러리와 우리 언어 모델에 특화된 토크나이저를 사용하여 텍스트 인필링을 구현할 것입니다. 아래는 예시 코드입니다.

<div class="content-ad"></div>

## 문장 순열

문장 순열에서 모델 입력 시퀀스에 맞는 문장 수(소형 모델에서 입력 시퀀스는 512에서 1024 토큰 사이)를 고려하는 것이 매우 중요합니다. 순서 테스트 후, 시퀀스에 맞게 문장 수를 결정한 다음, 그것들을 리스트나 배열로 나누어야 하고, 예시 코드에서와 같이 중복되지 않는 방식으로 무작위로 선택해야 합니다.

```js
# 주어진 "문장" 세트 중 첫 "number_sentences"를 선택하고 그 문장들을 무작위로 반환합니다.
def sentence_permutation(sentences, number_sentences):
    new_sentences = sentences[:number_sentences]
    random.shuffle(new_sentences)
    new_sentences = sentence_joiner(new_sentences)
    return new_sentences

def permuted_data_generation(sentences: list, total_sentences: int):
    training_sentences = []
    training_labels = []
    sentences_copy = sentences.copy()
    # 문장 목록의 크기에서 1을 뺀 횟수만큼 sentence_permutation을 적용하여 
    # 텍스트의 각 새 문장 예제를 얻고 가장 오래된 문장을 제거합니다.
    for _ in range(len(sentences)-total_sentences+1):
        new_sentences = sentence_permutation(sentences_copy, total_sentences)
        joined_sentences = sentence_joiner(sentences_copy[:total_sentences])
        sentences_copy = sentences_copy[1:]
        training_sentences.append(new_sentences)
        training_labels.append(joined_sentences)

    return training_sentences, training_labels


def permutation_training(sentences: list, sentences_labels: list, 
                         tokenizer_class=BartTokenizer, 
                         collator_class=DataCollatorForLanguageModeling, 
                         mlm=True, mlm_probability=0.0):
    # permuted 문장으로부터 input_ids와 attention mask를 얻습니다
    input, attention_mask, _ = load_dataset_mlm(sentences, tokenizer_class, collator_class, mlm, mlm_probability)
    
    # 원본 문장으로부터 라벨 가져오기
    labels, _, _ = load_dataset_mlm(sentences_labels, tokenizer_class, collator_class, mlm, mlm_probability)

    return input.squeeze(0), attention_mask.squeeze(0), labels.squeeze(0)

input_ids, attention_mask, labels = permutation_training(training_sentences, training_labels_sentences)

"""
input_ids[0]:
tensor([    0, 38831,  2577,  1054,    18,  2199, ...

attention_mask[0]:
tensor([1, 1, 1, 1, 1, 1, 1, 1, ...

labels[0]:
tensor([    0, 38831, 2577, 1054, 18, 2199, ...
"""
```

<div class="content-ad"></div>

위 예제에서는 모델에 데이터를 입력할 때 원래 순서에서 먼저 나온 문장을 제거한 후, 주어진 문장 개수에 따라 문장 순열을 수행하기 전에 새로운 문장을 추가합니다. 이렇게 함으로써 입력 시퀀스의 문장을 다시 정렬하더라도 각 새로운 예제마다 새로운 문장이 나타나는 문맥 창을 유지하고 가장 오래된 문장을 삭제합니다.

# 문서 회전

문서 회전을 적용하려면 사용된 각 배치의 차원을 고려해야 합니다. 패딩을 적용하는 경우 패딩은 문서의 나머지 부분과 함께 회전되지 않고 원래 위치를 유지해야합니다.

```js
def sentence_joiner(sentences: list):
  return ' '.join(sentences)

# 이 함수를 사용하여 토크나이저에 입력 데이터를 형성할 수 있는 원하는 만큼의 문장을 모을 수 있습니다.
def rotated_data_generation(sentences: list, total_sentences: int):
  training_sentences = []
  sentences_copy = sentences.copy()
  for _ in range(len(sentences)-total_sentences+1):
    new_sentences = sentences_copy[:total_sentences]
    new_sentences = sentence_joiner(new_sentences)
    sentences_copy = sentences_copy[1:]
    training_sentences.append(new_sentences)
  return training_sentences

# 이전 함수에서 회전된 문장을 적용합니다.
def document_rotation_training(sentences, tokenizer_class=BartTokenizer):
  tokenizer = tokenizer_class.from_pretrained('facebook/bart-base')
  tokens = tokenizer(sentences, return_tensors='pt', padding=True, truncation=True)
  tokens['input_ids'] = tokens['input_ids'].squeeze(0)
  tokens['labels'] = tokens['input_ids'].clone()
 
  iterations = tokens['input_ids'].size(0)
  for i in range(iterations):
    # 어텐션 마스크를 가져와 리스트로 변환합니다.
    attention_mask = tokens['attention_mask'][i].tolist()
    # 패딩이 시작되는 위치를 계산합니다.
    if 0 in attention_mask:
      padding_start_position = attention_mask.index(0)
    else:
      padding_start_position = False
    # 패딩이 있는 경우 문서의 나머지 부분과 함께 회전되지 않도록 패딩 위치를 고려합니다.
    if padding_start_position:
      random_token = torch.randint(1, padding_start_position-1, (1,))
      tokens['input_ids'][i] = torch.cat((tokens['input_ids'][i][0].unsqueeze(0), 
                                      tokens['input_ids'][i][random_token.item():padding_start_position-1],
                                      tokens['input_ids'][i][1:random_token.item()],
                                      tokens['input_ids'][i][padding_start_position-1:-1],
                                      tokens['input_ids'][i][-1].unsqueeze(0)), 0)
                                        
    # 패딩이 없는 경우 패딩을 고려하지 않고 문서를 회전합니다.
    else:
      random_token = torch.randint(1, tokens['input_ids'].size(0)-1, (1,))
      tokens['input_ids'][i] = torch.cat((tokens['input_ids'][i][0].unsqueeze(0),
                                      tokens['input_ids'][i][random_token.item():-1],
                                      tokens['input_ids'][i][1:random_token.item()],
                                      tokens['input_ids'][i][-1].unsqueeze(0)), 0)
  return tokens['input_ids'], tokens['attention_mask'].squeeze(0), tokens['labels']

data = rotated_data_generation(sentences, 3)
input_ids, attention_mask, labels = document_rotation_training(data)

"""
input_ids[2]:
tensor([    0,  2433,    61,    32,   551,    88,  1316,    32,    12,  4138,
        15557, 47605,     6, 22835,  2591,   939,     4,   242, 10079, 38422,
         9235,     6, 10295, 22540, 14819,     8,  3039, 11543,     4,   347,
        37347,  8457,     9, 41419,  8217,  1054,    36,   119, 49491,    43,
        10596, 37118,    32,    45,   157,   684,     4, 41058,  4484,     9,
         1046,     9, 23808,    16,    41,   505,  3724,     9, 18073,    18,
         2199, 18246,  4194,     8, 13430,  3505,     4,    20,     2,     1,
            1,     1,     1,     1,     1,     1,     1,     1,     1,     1])

attention_mask[2]:
tensor([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0])

labels[2]:
tensor([    0,   347, 37347,  8457,     9, 41419,  8217,  1054,    36,   119,
        49491,    43, 10596, 37118,    32,    45,   157,   684,     4, 41058,
         4484,     9,  1046,     9, 23808,    16,    41,   505,  3724,     9,
        18073,    18,  2199, 18246,  4194,     8, 13430,  3505,     4,    20,
         2433,    61,    32,   551,    88,  1316,    32,    12,  4138, 15557,
        47605,     6, 22835,  2591,   939,     4,   242, 10079, 38422,  9235,
            6, 10295, 22540, 14819,     8,  3039, 11543,     4,     2,     1,
            1,     1,     1,     1,     1,     1,     1,     1,     1,     1])

"""
```

<div class="content-ad"></div>

짧은 텍스트 시퀀스는 문서 회전 및 문장 순열 기술을 의미 없게 만듭니다. 반면에 다른 언급된 방법들(토큰 마스킹, 토큰 삭제 및 텍스트 채우기)은 짧고 긴 텍스트 시퀀스에서 도움이 될 수 있습니다.

시퀀스 순열과 마찬가지로 각 데이터 입력마다 가장 오래된 문장을 제거하고 새로운 문장을 추가하여 문맥 윈도우를 유지할 수 있습니다.

# 결론

본 글은 시퀀스 왜곡으로 언어 모델을 학습시키는 다양한 방법에 대해 논의했습니다. 이들은 가장 유명하지만 대부분의 모델은 토큰 마스킹만을 사용합니다.

<div class="content-ad"></div>

요약하면, 가장 효과적인 전략은 텍스트를 변경하는 대신 텍스트를 손상시키는 것입니다. 그러나 이 두 가지 접근 방식은 모델 훈련 중에 결합될 수 있으며, BART의 경우 Text Infilling 및 Sentence Permutation을 사용하여 흥미로운 결과를 얻을 수 있었습니다.

이 훈련 방식은 인코더 또는 인코더-디코더 트랜스포머 모델에서 사용할 수 있습니다. 내가 아는 한, 이 접근 방식을 사용하는 디코더 전용 모델은 없습니다. 왜냐하면 그런 경우에는 자기 회귀 언어 모델링 또는 인과 언어 모델링이 사용됩니다. 이는 GPT 모델과 같이 자기 어텐션 메커니즘 없이 인코더를 사용할 때 각 토큰의 예측이 이전 토큰에만 의존하며 그 다음 토큰에는 의존하지 않기 때문입니다. BERT와 같은 인코더 전용 모델에서는 양방향 어텐션이 존재하여 각 토큰이 이전 및 이후 토큰에 따라 어느 위치에 있어야 하는지 예측할 수 있습니다.

미래 글에서는 어떻게 인과 언어 모델링이 작동하는지와 더 고급 시퀸스 손상 기술에 대해 깊이 알아볼 것입니다.

![이미지](/assets/img/2024-06-23-TokenMaskingStrategiesforLLMs_3.png)



<div class="content-ad"></div>

행복한 코딩하세요!