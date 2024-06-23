---
title: "대형 언어 모델LLMs로 Next-Token 예측을 분류로 전환하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-TransformingNext-TokenPredictionintoClassificationwithLLMs_0.png"
date: 2024-06-23 19:36
ogImage: 
  url: /assets/img/2024-06-23-TransformingNext-TokenPredictionintoClassificationwithLLMs_0.png
tag: Tech
originalTitle: "Transforming Next-Token Prediction into Classification with LLMs"
link: "https://medium.com/towards-data-science/transforming-next-token-prediction-into-classification-with-llms-fb4f33a02637"
---


![이미지](/assets/img/2024-06-23-TransformingNext-TokenPredictionintoClassificationwithLLMs_0.png)

대규모 언어 모델(Large Language Models, LLMs)은 방대한 양의 인터넷 데이터로 훈련되어 다양한 자연어 작업을 수행할 수 있습니다. 그 중 하나인 분류는 주제를 미리 정의된 레이블로 분류하는 지도 학습 작업입니다. 제로샷 및 퓨샷 분류는 인기 있는 기술로, LLMs가 훈련 데이터 없이 또는 몇 가지 예제로 분류 작업을 수행할 수 있습니다. 그러나 보다 정확도를 높이기 위해 가이드 미세 조정을 통해 LLMs의 성능을 향상시킬 수 있음이 입증되었습니다.

# 가이드 미세 조정 LLMs

가이드 미세 조정을 위한 일반적인 방법은 질문-답변 쌍으로 구성된 데이터셋을 작성하는 것입니다. 사전 훈련된 LLMs는 이러한 쌍을 사용하여 지도 학습 방식으로 추가로 미세 조정됩니다.

<div class="content-ad"></div>

당신은 지난 포스트에서 이 접근법을 확인할 수 있어요.

선택적으로, 데이터셋을 좋아하는 조합과 덜 선호하는 조합의 쌍으로 구성된 직접 선호도 최적화(DPO)를 사용하여 성능을 더 개선할 수 있어요. 상위 순위의 오픈소스 LLMs가 이러한 접근법 중 하나를 사용하여 훈련되는 것은 놀라운 일이 아니에요.

# LLMs는 딥 뉴럴 네트워크입니다

직관적으로, 이러한 방법은 LLMs가 토큰을 기반으로 하는 아키텍처를 사용한다는 사실을 활용해요. 지시된 데이터와 선호도 데이터셋 모두에서 텍스트 쌍이 토큰으로 변환됩니다. 교차 엔트로피 손실과 디코더만을 사용하는 오토레그레시브 속성을 이용하여, LLMs의 가중치가 업데이트되는데, 레이블 토큰은 입력 토큰으로부터 복사되지만 하나씩 밀려서 사용됩니다.

<div class="content-ad"></div>

주어진 것을 감안하면 우리는 어휘를 분류 라벨로 교체할 수 있습니다! 다음 토큰을 어휘에서 예측하는 대신, 앞선 문맥 토큰에서 분류 작업의 범주를 예측하는 데 관심이 있습니다. 이것은 일반적으로 lm_head로 구현되는 LLMs의 헤드를 변경함으로써 가능합니다. 텍스트 생성에서, lm_head는 (임베딩 차원, 어휘 크기)의 모양을 가지고 있습니다. 분류를 위해 우리는 이것을 (임베딩 차원, 분류 수)로 수정합니다.

# 분류 작업을 위해 LLMs 학습하기

## 모델 및 토크나이저 불러오기

이 접근 방식이 작동하는지 확인하기 위한 실험을 수행해 봅시다. 먼저, HuggingFace에서 사전 훈련된 LLM 및 해당 토크나이저를 사용하여 시작하겠습니다. 본 연구에서는 경량화된 38억 개의 파라미터 모델 microsoft/Phi-3-mini-4k-instruct를 선택했습니다.

<div class="content-ad"></div>

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "microsoft/Phi-3-mini-4k-instruct"
device_map = "auto"
trust_remote_code = True

model = AutoModelForCausalLM.from_pretrained(
model_name, device_map=device_map, trust_remote_code=trust_remote_code
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.padding_side = "right"
tokenizer.pad_token = tokenizer.eos_token
tokenizer.add_eos_token = True
```

우리의 분류 실험을 간단히 하기 위해 이진 분류 작업을 선택할 것입니다. 나중에 여러 클래스로 확장할 수 있음을 알고 있습니다. 이진 분류에서 클래스 수는 두 개이므로 torch.nn.Linear(hidden_size, 2)입니다. to("cuda:`number`") 함수는 이 레이어가 할당된 GPU 기기를 지정합니다. 이 레이어가 model_name = "auto"을 사용하여 초기로드된 모델이 있는 동일한 기기에 할당되었는지 확인해주세요.

## Modify LLMs Head

```python
# 모델 수정 및 세밀 조정
hidden_size = 3072
model.lm_head = torch.nn.Linear(hidden_size, 2).to("cuda:3")
```

<div class="content-ad"></div>

또 다른 흥미로운 실험은 fe-fine-tuning을 위해 필요한 레이어를 결정하는 것입니다. 이 게시물에서는 모델이 모든 다른 레이어에서 토큰의 문맥적 의미를 학습했다는 가정에 기반하여, 마지막 블록의 마지막 정규화 레이어에 초점을 맞출 것입니다. 이 레이어는 lm_head 이전의 끝에서 두 번째 레이어입니다.

먼저, 모든 레이어의 Weight를 'param.requires_grad = False'로 지정하여 동결시킵니다. 그리고 나서 마지막 블록의 마지막 정규화 레이어를 찾아 'param.requires_grad = True'로 가중치를 조정 가능하도록 변경합니다. HuggingFace의 모델 클래스에서는 아래 코드 스니펫에서 보여주는 대로 dot 연산을 사용하여 어떤 레이어로든 이동할 수 있습니다.

```js
# 마지막 블록과 마지막 정규화 레이어만 fine-tune
for param in model.parameters():
    param.requires_grad = False

# 마지막 정규화 레이어만 fine-tune
last_block = model.model.layers[-1].to("cuda:3")
final_norm = model.model.norm.to("cuda:3")

for param in final_norm.parameters():
    param.requires_grad = True
```

## Cross Entropy Loss 정의

<div class="content-ad"></div>

이전 게시물에서 lm_head의 가장 중요한 로짓이 문장의 마지막 토큰과 관련이 있다고 설명했습니다. 이는 self-attention 메커니즘에서 기인하는데, 마지막 토큰은 이전 모든 문맥 토큰들로부터의 주의 점수를 가지고 있습니다. 따라서 우리는 logits[:, -1, :]를 사용합니다.

```python
import torch

def calculate_loss_batch(input_batch, target_batch, model):
    input_batch, target_batch = input_batch.to("cuda"), target_batch.to("cuda")
    logits = model(input_batch).logits[:, -1, :]  # 마지막 출력 토큰의 로짓
    loss = torch.nn.functional.cross_entropy(logits, target_batch).to("cuda")
    return loss
```

## 데이터셋 준비

데이터셋은 텍스트와 레이블 두 개의 리스트로 구성되어 있습니다. 먼저, 토크나이저를 사용하여 텍스트 문자열을 토큰화된 ID로 변환합니다. 토크나이저는 정의된 최대 길이보다 긴 토큰을 자르거나 최대 길이보다 짧은 경우 패딩합니다.

<div class="content-ad"></div>

```js
ecoding = tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
)
```

그 다음으로, torch에서 DataLoader 객체를 사용하여 데이터를 모델 튜닝을 위해 반복적으로 공급합니다. BinaryClassification Dataset 객체는 torch의 Dataset 객체를 상속하며, 이 데이터셋을 DataLoader 객체로 로드합니다.

```js
class BinaryClassificationDataset(Dataset):
      pass

dataset = BinaryClassificationDataset(texts, labels, tokenizer, max_length)

# DataLoader
dataloader = DataLoader(dataset, batch_size=2, shuffle=True)
```

1단계와 2단계를 합쳐서, 이것이 완전한 구현입니다. 메인 함수에 예제를 제공하여 BinaryClassificationDataset 객체를 인스턴스화하고 DataLoader 객체를 만들어 데이터를 생성하는 방법을 보여줍니다.

<div class="content-ad"></div>

```python
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer

class BinaryClassificationDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]

        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        input_ids = encoding['input_ids'].squeeze(0)  # Remove batch dimension
        attention_mask = encoding['attention_mask'].squeeze(0)  # Remove batch dimension

        return {
            'input_ids': input_ids.long(),
            'attention_mask': attention_mask.long(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

# Example usage
if __name__ == "__main__":
    # Sample data
    texts = ["Hello, this is a sample sentence.", "Another sample text for classification."]
    labels = [0, 1]

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    # Define dataset
    max_length = 128
    dataset = BinaryClassificationDataset(texts, labels, tokenizer, max_length)

    # DataLoader
    dataloader = DataLoader(dataset, batch_size=2, shuffle=True)

    # Iterate through the dataloader
    for batch in dataloader:
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']

        print("Input IDs:", input_ids)
        print("Attention Mask:", attention_mask)
        print("Labels:", labels)
      
```

## 모델 훈련

손실 함수를 정의하고 데이터셋을 준비한 후, 모델 훈련을 시작할 수 있습니다. calculate_loss_loader 함수는 losses를 0으로 초기화합니다. 지정된 배치 수(num_batches)를 지정하면, calculate_loss_batch 함수를 사용하여 각 배치의 손실을 계산합니다. DataLoader 객체를 사용하여 calculate_loss_batch 함수에 배치 데이터를 반복적으로 제공하고, 각 반복에 대해 손실을 누적합니다. 재현성을 위해 torch.manual_seed(1234)를 사용합니다. 이 실험에서 0.68의 손실을 달성했습니다.

```python
def calculate_loss_loader(data_loader, model, num_batches=None):
    losses = 0.
    if len(data_loader) == 0:
        return "Please provide dataset, data loader is empty."
    elif num_batches is None:
        num_batches = len(data_loader)
    else:
        num_batches = min(num_batches, len(data_loader))
    for index, batch in enumerate(data_loader):
        if index < num_batches:
            loss = calculate_loss_batch(
              batch["input_ids"], batch["labels"], model
            )
            losses += loss.item()
        else:
            break
    return total_loss / num_batches


torch.manual_seed(1234) # 재현성을 위해
with torch.no_grad():
    train_loss = calculate_loss_loader(dataloader, model, num_batches=2)
```

<div class="content-ad"></div>

# 트레이드오프

다음 토큰 예측에서 트랜스포머를 처음 원리를 통해 분류 예측으로 활용할 수 있다는 것은 흥미롭습니다. 미리 훈련된 트랜스포머 모델은 언어 패턴의 풍부한 표현을 포착합니다. 그러나 가벼운 모델이지만 38 억 개의 매개변수를 가지고 있습니다. 독자들은 정확성과 교육 그리고 추론 처리량(초당 생성된 토큰 수) 사이의 트레이드오프를 인식해야 합니다. 저는 기준선으로 더 작은 모델을 시작하는 것을 제안합니다. 예를 들어, 6700만 개의 매개변수를 가진 distilbert-base-uncased 모델을 사용할 수 있습니다. 또는 XGBoost와 같은 더 전통적인 머신러닝 모델을 시도할 수도 있습니다.

# 결론

본 블로그 포스트에서는 처음 원리를 사용하여 다음 토큰 예측 문제를 분류 레이블 예측으로 변환하는 방법을 보여드렸습니다. 이 데모를 통해 LLM의 복잡한 구조를 해체하고 도메인별 문제에 동일한 개념을 적용하는 지식을 습득할 수 있기를 희망합니다. 전체 분류 작업에 대해 트랜스포머가 최적화된 솔루션이 아닐 수 있으며, 다른 더 작은 모델과 데이터를 학습하고 평가해야 함을 상기해야 합니다. 읽어 주셔서 감사합니다. 행복한 학습 되세요!