---
title: "BERT 미세 조정으로 텍스트 분류하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-FinetuneBERTfortextclassification_0.png"
date: 2024-06-23 19:32
ogImage: 
  url: /assets/img/2024-06-23-FinetuneBERTfortextclassification_0.png
tag: Tech
originalTitle: "Fine tune BERT for text classification"
link: "https://medium.com/codex/fine-tune-bert-for-text-classification-cef7a1d6cdf1"
---


섬세 조정은 대형 언어 모델이 사용자 지정 데이터에 적응하고 텍스트 분류와 같은 하향 작업을 잘 수행할 수 있도록 돕는 중요한 기술입니다.

본 문서는 섬세 조정의 기본에 초점을 맞추고, LORA, QLORA 등 다른 기술에 대해 깊게 다루지는 않습니다. 시작하는 가장 좋은 방법은 BERT로 실험을 해보는 것입니다.

주로 두 가지 방법으로 이 작업을 수행할 수 있습니다:

- 허깅페이스 트레이너 API 사용: 사용하기 쉽지만 매우 사용자 정의가 어려움
- PyTorch 사용: 트레이너보다 조금 어려우나 프로세스에 대한 더 많은 사용자 정의와 제어를 제공합니다

<div class="content-ad"></div>

데이터셋

우리는 Hugging Face에서 제공하는 Yelp Reviews 데이터셋을 사용할 예정입니다. 이 데이터셋은 다음 두 열로 구성되어 있습니다:

- 레이블: 1부터 5까지의 별표가 부여된 등급입니다.
- 텍스트: 리뷰 내용입니다.

저희의 목표는 리뷰 텍스트로부터 별의 개수를 예측할 수 있는 모델을 훈련하는 것입니다.

<div class="content-ad"></div>

휍핑페이스 트레이너 API를 사용하여 파인튜닝하기

- 모든 라이브러리를 설치하세요 :

```js
!pip install --upgrade transformers datasets evaluate huggingface_hub torch
```

참고: 이 라이브러리들의 최신 버전을 항상 사용하도록 하세요.

<div class="content-ad"></div>

2. 데이터셋 로드: Hugging Face에서 제공하는 datasets 라이브러리를 사용하여 데이터셋을 로드할 수 있어요.

```python
from datasets import load_dataset
dataset = load_dataset("yelp_review_full")
```

데이터셋을 확인해봐요. 어떤 데이터를 다루게 될지 알아봅시다.

```python
dataset["train"][1]
```

<div class="content-ad"></div>

우리 데이터가 어떻게 보이는지 확인해보세요.

```js
{'label': 1,
 'text': "안타깝게도 Dr. 골트버그의 환자로서 느끼는 좌절은 뉴욕의 다른 많은 의사들과 겪어온 경험의 반복입니다 - 좋은 의사, 하지만 최악의 스태프. 그의 스텝은 단순히 전화를 받지 않는 것 같습니다. 답변을 받으려면 보통 반복적인 전화로 2시간이 걸립니다. 누가 그런 시간을 가진 사람이며 누가 그것과 소통하길 원하겠습니까? 다른 많은 의사들과도 이 문제를 겪어왔고, 이해가 안 가네요. 사무원이 있고 의료 필요가 있는 환자가 있는데, 왜 전화를 받는 사람이 없는 건지요? 이해할 수 없고, 신경질만 나게 합니다. Dr. 골트버그에게 2점을 주어야 하는 점이 유감입니다."}
```

3. 토크나이저를 로드하고 텍스트를 토큰화하는 함수를 만들어보세요:

```js
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-cased")


def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True)


tokenized_datasets = dataset.map(tokenize_function, batched=True)
```

<div class="content-ad"></div>

토크나이저는 텍스트를 입력_ids, 토큰_유형_ids 및 어텐션_마스크로 이해할 수 있는 세 개의 열로 변환합니다.

데이터셋에서 작은 배치를 만들기(선택 사항)

```js
small_train_dataset = tokenized_datasets["train"].shuffle(seed=42).select(range(1000))
small_eval_dataset = tokenized_datasets["test"].shuffle(seed=42).select(range(1000))
```

4. 모델 불러오기:

<div class="content-ad"></div>

```python
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("google-bert/bert-base-cased", num_labels=5)
```

분류할 레이블 수를 초기화하려면 num_labels 매개변수를 사용하세요.

5. 훈련 인수 초기화

```python
from transformers import TrainingArguments

training_args = TrainingArguments(output_dir="test_trainer")
```

<div class="content-ad"></div>

https://huggingface.co/docs/transformers/main/en/main_classes/trainer#transformers.TrainingArguments에서 제공되는 매개변수에 대한 자세한 정보를 확인할 수 있습니다.

6. 메트릭 계산 함수 설정:

```js
import numpy as np
import evaluate

metric = evaluate.load("accuracy")
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metric.compute(predictions=predictions, references=labels)
```

7. 학습 시작:

<div class="content-ad"></div>

```js
from transformers import Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=small_train_dataset,
    eval_dataset=small_eval_dataset,
    compute_metrics=compute_metrics,
)
trainer.train()
```

트레이닝을 시작하려면 wandb 키를 입력하라는 프롬프트가 나타납니다. 키를 입력하면 트레이닝 프로세스가 시작됩니다. 트레이닝이 완료되면 아래와 같은 결과를 보게 될 것입니다.

![트레이닝 결과](/assets/img/2024-06-23-FinetuneBERTfortextclassification_0.png)

선택적으로 노트북에서 허깅페이스로 모델을 저장할 수도 있습니다.

<div class="content-ad"></div>


```js
from huggingface_hub import login
login()
model.push_to_hub("HuggingfaceUsername/yourModelName")
```

8. 추론 실행:

모델을 테스트하려면 PyTorch를 사용할 수 있습니다.

```js
import torch
import torch.nn.functional as F
# Load model directly
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-cased")
model = AutoModelForSequenceClassification.from_pretrained("HuggingfaceUsername/yourModelName")
s="The was awesome and I loved it"
tt=tokenizer(s,return_tensors="pt", padding=True, truncation=True)
```


<div class="content-ad"></div>

모델을 평가 모드로 설정하면 더 이상 가중치를 업데이트할 필요가 없어지고, 이제 분류 작업에 사용할 수 있습니다.

```python
model.eval()
with torch.no_grad():
    outputs = model(**tt)
```

결과를 확인해보겠습니다.

```python
SequenceClassifierOutput(loss=None, logits=tensor([[-2.3995, -2.0111, -0.8381,  2.4683,  2.8968]]), hidden_states=None, attentions=None)
```

<div class="content-ad"></div>

여기서 중요한 변수는 로짓 변수입니다. 이 경우 로짓은 텍스트가 특정 클래스에 속할 확률을 나타냅니다. 현재 로짓은 이해하기 어려운 형식으로 표시됩니다. 이를 이해할 수 있는 형식으로 변환하려면 이해할 수 있는 숫자로 변환해야 합니다.

```js
logits = outputs.logits
print("로짓:", logits)

# 소프트맥스를 사용하여 로짓을 확률로 변환합니다
probabilities = F.softmax(logits, dim=-1)
print("확률:", probabilities)

# 예측된 클래스를 결정합니다
predicted_class = torch.argmax(probabilities, dim=-1)
print("예측된 클래스:", predicted_class.item())
```

여기서 출력은 4입니다.

PyTorch를 사용한 파인 튜닝

<div class="content-ad"></div>

모델이 이해할 수 있도록 몇 가지 전처리 단계가 필요합니다.

- 열 삭제

```js
tokenized_datasets = tokenized_datasets.remove_columns(["text"])
tokenized_datasets = tokenized_datasets.rename_column("label", "labels")
tokenized_datasets.set_format("torch")
small_train_dataset = tokenized_datasets["train"].shuffle(seed=42).select(range(1000))
small_eval_dataset = tokenized_datasets["test"].shuffle(seed=42).select(range(1000))
```

2. 데이터로더(Dataloader) 생성

<div class="content-ad"></div>

```js
import torch
from torch.utils.data import DataLoader
traindataloader=DataLoader(small_train_dataset,batch_size=8,shuffle=True)
testdataloader=DataLoader(small_eval_dataset,batch_size=8)
```

3. 모델을 다운로드하고 GPU에 로드해주세요.

```js
from transformers import AutoModelForSequenceClassification
model=AutoModelForSequenceClassification.from_pretrained("google-bert/bert-base-cased", num_labels=5)
device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
model.to(device)
```

4. 옵티마이저(optimizer)와 학습률 스케줄러(learning rate scheduler)를 생성하세요.

<div class="content-ad"></div>

```python
from torch.optim import AdamW, SGD
from transformers import get_scheduler
optimizer = SGD(model.parameters(), lr=5e-5)
num_epochs = 3
num_training_steps = num_epochs * len(traindataloader)
lr_scheduler = get_scheduler(
    name="linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps
)
```

원하는 옵티마이저와 학습률 스케줄러를 조정하여 가장 적합한 것을 선택할 수 있어요.

5. 학습 및 평가

모델을 model.train()을 사용하여 학습 모드로 설정해주세요.


<div class="content-ad"></div>

```js
from tqdm.auto import tqdm

progress_bar = tqdm(range(num_training_steps))

model.train()
for epoch in range(num_epochs):
    for batch in traindataloader:
        batch = {k: v.to(device) for k, v in batch.items()}
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()

        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        progress_bar.update(1)
```

```js
import evaluate

metric = evaluate.load("accuracy")
model.eval()
for batch in testdataloader:
    b = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**b)

    logits = outputs.logits
    predictions = torch.argmax(logits, dim=-1)
    metric.add_batch(predictions=predictions, references=batch["labels"])

metric.compute()
```

제 Kaggle 노트북에서 스크립트를 확인할 수 있습니다. https://www.kaggle.com/code/exterminator11/finetune-bert. 행운을 빕니다!