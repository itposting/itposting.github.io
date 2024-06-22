---
title: "애니메이션 데이터셋으로 Gemma-2b-it 미세 조정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-FineTuningGemma-2b-itonAnimeDataset_0.png"
date: 2024-06-22 20:45
ogImage: 
  url: /assets/img/2024-06-22-FineTuningGemma-2b-itonAnimeDataset_0.png
tag: Tech
originalTitle: "Fine Tuning Gemma-2b-it on Anime Dataset"
link: "https://medium.com/@sauravpattnaik2011/fine-tuning-gemma-2b-it-on-anime-dataset-a767e1bcdb96"
---


![FineTuningGemma-2b-itonAnimeDataset](/assets/img/2024-06-22-FineTuningGemma-2b-itonAnimeDataset_0.png)

소개

미세 조정 개념을 시작하기 전에, 먼저 "왜 이러한 강력한 모델들에 대해 미세 조정이 필요한가?"라는 질문에 대답해야 합니다.

이 질문에 대답하기 위해 먼저 이 LLMs이(가) 인터넷에서 공개 데이터의 큰 말뭉치로 훈련되어 있으며 따라서 다양한 주제에 대한 아이디어를 가지고 있다는 것을 이해해야 합니다. 그러나 이들은 모든 주제에 대해 자세히 이해하거나 뱅킹이나 보험과 같은 개인 데이터에 대한 지식을 갖고 있지 않을 수도 있습니다. 특정 데이터에 대한 이해를 보완하기 위해, 우리는 그들을 이 특정 데이터에 대해 특별히 미세 조정합니다. 애니메이션 데이터는 공개적으로 이용 가능하지만, 이것들은 이 LLMs를 훈련하는 데 사용된 훈련 데이터의 매우 작은 조각일 수 있습니다. 따라서 LLMs가 애니메이션에 대한 개념을 가지고 있더라도, 그들의 정보 기반이 우리가 필요한 것만큼 풍부하지 않을 수 있습니다.

<div class="content-ad"></div>

자원

이제 세밀 조정이 필요한 이유에 대한 답변을 얻었으니, 이제 LLM을 세밀 조정하는 방법으로 넘어갈 수 있습니다. 저는 이 활동을 위해 사용한 자원은 다음과 같습니다.

- 컴퓨팅 자원 — Google Colab T4 GPU
- 데이터 세트 — https://www.kaggle.com/datasets/dbdmobile/myanimelist-dataset

Colab을 사용하기를 강력히 권장드립니다. 로컬 머신에 강력한 GPU 기능이 없는 경우에 말이죠. 다음으로, 우리는 세밀 조정된 오픈 소스 LLM을 이해하는 데 도움이 되는 두 가지 중요한 개념을 먼저 이해할 것입니다.

<div class="content-ad"></div>

LoRA & QLoRA

Gemma-2b 모델에는 20억 개의 매개변수가 있습니다(당연한 얘기네요). 이러한 매개변수의 가중치를 조정하는 것은 매우 비싼 계산 작업일 수 있습니다. 이러한 모델들은 많은 VRAM을 소모할 수 있으며 모든 사용자가 이와 같은 높은 계산 능력을 갖춘 기계에 액세스할 수 있는 것은 아닙니다. 위의 계산 문제를 해결하기 위해 두 가지 기술이 널리 사용됩니다. 이 기술들은 LLMs를 세밀하게 조정할 수 있도록 합니다.

- LoRA — 낮은 순위 적응
- QLoRA — 양자화된 낮은 순위 적응

LoRA — 이미 언급한 대로, 이러한 LLMs에는 수십억 개의 매개변수가 있습니다. 이러한 매개변수는 일반적으로 행렬로 표현됩니다. 이러한 고차원 행렬의 흥미로운 특성 중 하나는 완전 순위 행렬이 아니라는 것입니다. 즉, 행렬의 모든 열이 선형 독립이 아닙니다(한 열이 다른 열들의 선형 결합으로 표현될 수 있기 때문에 해당 열은 추가 정보를 제공하지 않고 차원만 늘려주는 것입니다). 그래서 LoRA는 이러한 거대한 가중치 행렬을 두 개의 작은 행렬인 A, B로 분해합니다. W = AB와 같이 W가 예를 들어 1000x1000 차원이라면, A는 1000xr 차원을 가지고 B는 r*1000 차원을 갖습니다. 그런 다음 세밀한 조정을 위해 이러한 작은 행렬의 매개변수를 조정하려고 시도합니다. r 하이퍼파라미터는 lora 구성을 정의할 때 선택하는 것입니다. r 값이 높을수록 우수한 결과를 얻을 수 있지만, 계산 능력이 필요하다는 대가가 따릅니다. 따라서 1000000 개의 매개변수를 조정해야 하는 대신, 대신 1000r + 1000r 개의 매개변수를 조정하게 됩니다. 일반적으로 r 값은 (8-64) 범위에 있으며 매우 높은 차원의 가중치 행렬을 다룰 때, 조정 가능한 매개변수 수가 상당히 줄어듭니다. 마지막으로 세밀한 조정 이후, 이러한 LoRA 가중치는 베이스 모델과 병합되어 세밀하게 조정된 단일 모델을 생성합니다.

<div class="content-ad"></div>

LoRA는 학습 매개변수의 수를 줄여주죠, 이제 모델을 파인 튜닝할 수 있을까요?

네, 파인 튜닝은 가능하지만 더 개선할 여지도 있어요. 그런데 여기에 QLoRA가 등장합니다. QLoRA의 주요 목표는 단일 GPU에서 LLMs를 파인 튜닝하는 편리한 방법을 제공하는 것이죠(그들이 언급한 단일 GPU는 VRAM이 48GB입니다). QLoRA가 하는 일은 매우 기본적이면서 메모리 사용량을 줄이는 견고한 방법입니다. 모델 가중치의 정밀도를 변경합니다. 컴퓨터 시스템에서 모든 숫자는 특정 정밀도로 표현됩니다. 기본적으로 이러한 모델의 가중치는 32비트로 표현됩니다. QLoRA는 이러한 수를 32비트 대신 8 또는 4와 같이 낮은 비트로 표현하려고 시도합니다. 그리고 그 동작은 해당 수를 낮은 정밀도로 반올림하거나 버리는 것입니다. 이 과정을 통해 4배에서 8배까지 감소할 수 있습니다. 이를 위해 이들은 이론적으로 가장 최적인 것으로 설명되는 4비트 Normal-Float라는 새로운 데이터 유형을 도입했습니다(이는 대부분 사전 훈련된 모델 가중치의 경우입니다). 그들은 또한 메모리 증가를 피하기 위해 paged optimizers라는 개념을 소개했습니다. 이 개념은 GPU 용량이 거의 가득 찬 경우, 옵티마이저 상태를 CPU로 옮기도록 하는 것입니다. 그리고 GPU 메모리가 다시 사용 가능해지면 GPU로 다시 가져옵니다.

코딩

필요한 이론을 모두 숙지한 후에 이제 코딩 섹션으로 넘어갈 차례입니다. 먼저 필요한 라이브러리를 설치하고 가져오는 것부터 시작하겠습니다.

<div class="content-ad"></div>

```js
!pip3 install -q -U bitsandbytes==0.42.0
!pip3 install -q -U peft==0.8.2
!pip3 install -q -U trl
!pip3 install -q -U accelerate==0.27.1
!pip3 install -q -U datasets==2.17.0
!pip3 install -q -U transformers

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from trl import SFTTrainer
import torch
import pandas as pd
import bitsandbytes as bnb
from datasets import Dataset
import transformers
from peft import LoraConfig, PeftModel, prepare_model_for_kbit_training, get_peft_model
```

위와 같이 import 구문을 작성했습니다. 이제 사용할 모델에 대한 qlora config를 설정할 수 있습니다.

```js
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)
```

여기서 우리는 모델 웨이트를 4비트로 로드하고 싶다고 지정했습니다. "nf4"로 유형을 지정했는데, 이는 이전에 언급한 일반적인 부동 소수점을 의미합니다. 마지막 매개변수인 bnb_4bit_compute_dtype는 사용할 그래디언트의 데이터 유형을 나타냅니다.

<div class="content-ad"></div>

이제 모델을 다운로드하고 설정을 로드할 수 있습니다.

```js
model_id = "google/gemma-2b-it"

model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb_config, device_map={"":0})
tokenizer = AutoTokenizer.from_pretrained(model_id, add_eos_token=True)
```

참고로, Gemma를 사용하려면 먼저 액세스를 요청해야 합니다. 그리고 다운로드하려면 먼저 hugging face에 로그인하여 액세스 토큰을 제공해야 다운로드할 수 있습니다. 위의 코드 셀을 실행하기 전에 huggingface_hub의 notebook_login을 사용하고 액세스 토큰을 제공하는 것을 추천합니다.

미세 조정을 시작하기 전에 모델의 현재 애니메이션에 대한 지식 베이스를 먼저 살펴보겠습니다.

<div class="content-ad"></div>

```py
def generate_response(model, tokenizer, prompt, tokens=100):
    input_ids = tokenizer(prompt, return_tensors="pt")
    input_ids.to('cuda')
    outputs = model.generate(**input_ids,max_new_tokens=tokens)
    return tokenizer.decode(outputs[0])

prompt = '''Question : Tell me something about the anime Naruto?
Answer :'''

print(generate_response(model,tokenizer,prompt))
```

만약 위 셀을 실행하면 아래와 같은 출력을 얻게 됩니다:

`bos`Question : Tell me something about the anime Naruto? Answer :`eos`Naruto는 Masashi Kishimoto가 만든 일본의 애니메이션 시리즈입니다. 이 시리즈는 나루토 우즈마키의 모험을 따릅니다. 나루토는 세계 최고의 닌자가 되기를 꿈꾸는 젊은 닌자입니다. 이 시리즈는 200회가 넘는 에피소드와 영화로 큰 성공을 거두었습니다. 나루토는 캐릭터, 스토리텔링 및 애니메이션에 대해 칭찬을 받았습니다.`eos`

나쁘지 않네요! 나루토가 매우 인기 있는 애니메이션으로 여겨지기 때문에 모델이 그것에 관한 정보를 가지고 있다고 예상했습니다. 이제 모델이 애니메이션에 대해 가진 지식을 향상시키는 것이 목표입니다. 그러기 위해 먼저 데이터셋을 탐색하여 모델에 추가할 수 있는 어떤 정보가 있는지 살펴보아야 합니다.


<div class="content-ad"></div>

```js
anime_df = pd.read_csv("drive/My Drive/LLM/Data/anime_dataset.csv")
"""
anime_id: 각 애니메이션에 대한 고유 ID입니다.
Name: 애니메이션의 원래 언어로 된 이름입니다.
English name: 애니메이션의 영어 이름입니다.
Other name: 애니메이션의 원어로 된 이름 또는 제목입니다(일본어, 중국어 또는 한국어일 수 있습니다).
Score: 애니메이션에 매겨진 평점이나 등급입니다.
Genres: 쉼표로 구분된 애니메이션의 장르입니다.
Synopsis: 애니메이션 플롯에 대한 간단한 설명 또는 요약입니다.
Type: 애니메이션의 유형(예: TV 시리즈, 영화, OVA 등)입니다.
Episodes: 애니메이션의 에피소드 수입니다.
Aired: 애니메이션이 방영된 날짜입니다.
Premiered: 애니메이션이 처음 방영된 시즌과 년도입니다.
Status: 애니메이션의 상태(예: 방영 종료, 현재 방영 중 등)입니다.
Producers: 애니메이션의 제작사 또는 프로듀서입니다.
Licensors: 애니메이션의 라이센서(예: 스트리밍 플랫폼)입니다.
Studios: 애니메이션에 참여한 애니메이션 스튜디오입니다.
Source: 애니메이션의 소스 자료(예: 만화, 라이트 노벨, 오리지널)입니다.
Duration: 각 에피소드의 기간입니다.
Rating: 애니메이션의 연령 등급입니다.
Rank: 인기도 또는 기타 기준에 따라 매겨진 애니메이션의 순위입니다.
Popularity: 애니메이션의 인기 순위입니다.
Favorites: 사용자들이 즐겨찾은 횟수입니다.
Scored By: 애니메이션을 평가한 사용자 수입니다.
Members: 플랫폼에 애니메이션을 리스트에 추가한 회원 수입니다.
Image URL: 애니메이션의 이미지 또는 포스터 URL입니다.
"""
```

우리는 이 데이터 사전을 캐글 링크에서 가져왔고 여기서 각 애니메이션에 대한 이름, 영어 이름부터 장르, 시놉시스, 에피소드 수, 제작 및 애니메이션 스튜디오 등의 매우 포괄적인 기능 목록이 있는 것을 볼 수 있습니다.

이 프로젝트에서는 모델을 교육하는 데 사용할 세 가지 유형의 지시 형식을 작성할 것입니다.

- 일반 정보 I — 애니메이션 이름(이름 변형 포함) 및 이야기와 장르.
- 일반 정보 II — 애니메이션 이름 및 제작사, 애니메이션 스튜디오, 에피소드 수와 같은 세부 정보.
- 일반 정보 III — 애니메이션 이름 및 등급, 인기도, 사용자 평가와 같은 메트릭스.

<div class="content-ad"></div>

```js
def create_generic_information_1(df):
  questions = []
  answers = []
  for name, variant, genre, synopsis in zip(df['English name'], df['Name'], df['Genres'], df['Synopsis']):
    question = f"애니메이션 {name} aka {variant}은(는) 무엇에 대해요?"
    answer = f"애니메이션 {name} aka {variant}은(는) {genre} 장르의 애니메이션입니다. 줄거리는 다음과 같습니다: {synopsis}"
    questions.append(question)
    answers.append(answer)

  df['GI1_Question'] = questions
  df['GI1_Answer'] = answers
  return df

def create_generic_information_2(df):
  questions = []
  answers = []
  for name, production_name, animation_house, number_of_episodes in zip(df['English name'],df['Producers'], df['Studios'], df['Episodes']):
    question = f"{name}의 제작사와 애니메이션 스튜디오는 누구였나요?"
    answer = f"애니메이션 {name}은(는) {production_name}에 의해 제작되었습니다. 애니메이션은 {animation_house}에서 작업되었고, 이 중 {number_of_episodes}화가 있습니다."
    questions.append(question)
    answers.append(answer)

  df['GI2_Question'] = questions
  df['GI2_Answer'] = answers
  return df

def create_generic_information_3(df):
  questions = []
  answers = []
  for name, rating, score, votes in zip(df['Name'], df['Rating'], df['Score'], df['Scored By']):
    question = f"애니메이션 {name}의 리뷰는 어떤가요?"
    answer = f"애니메이션 {name}은(는) 평가는 {rating}이고, {votes}명의 사용자에 의해 평가되었으며 점수는 {score}입니다."
    questions.append(question)
    answers.append(answer)

  df['GI3_Question'] = questions
  df['GI3_Answer'] = answers
  return df
``` 

이제부터 우리가 진행하기 전에 한 가지 알아야 할 사항이 있습니다. 각 LLM에는 명령을 입력하고 훈련하기 위한 특정 템플릿이 있습니다. 따라서 먼저 해당 템플릿에 기능을 로드한 다음 모델에 입력해야 합니다.

<div class="content-ad"></div>

```js
def formatting_func(question, answer):
    text = f"<start_of_turn>user\n{question}<end_of_turn> <start_of_turn>model\n{answer}<end_of_turn>"
    return text

def generate_training_prompts(df, question_col, answer_col):
  train_samples = []
  for question, answer in zip(df[question_col], df[answer_col]):
     train_samples.append(formatting_func(question, answer))
  return train_samples

training_prompts = []

for identifier in range(1,4):
  question_col = f"GI{identifier}_Question"
  answer_col = f"GI{identifier}_Answer"
  samples = generate_training_prompts(anime_df,question_col, answer_col)
  training_prompts += samples

training_dataframe = pd.DataFrame()
training_dataframe['instruction'] = training_prompts
training_dataframe = training_dataframe.sample(frac=1,random_state=42)
training_df = Dataset.from_pandas(training_dataframe)
```

위의 템플릿은 다음과 같습니다:

f”`start_of_turn`user\n'question'`end_of_turn` `start_of_turn`model\n'answer'`end_of_turn`”

위 템플릿은 각 학습 레코드마다 질문과 준비된 답변을 넣어야 하는 두 가지 매개변수만 가지고 있습니다. 따라서 위의 코드는 각 특성에 대해 이 템플릿 내에 질문과 답변을 감싸는 것뿐입니다. 마지막에는 학습을 위해 판다스 데이터프레임을 Dataset 객체로 변환합니다.

<div class="content-ad"></div>

학습 데이터가 이제 준비되었으므로, LoRA를 사용하여 모델을 세밀하게 튜닝하기 위해 모델을 설정할 수 있게 되었습니다.

```js
#1 
model.gradient_checkpointing_enable()
#2 
model = prepare_model_for_kbit_training(model)

#3 
def find_all_linear_names(model):
  cls = bnb.nn.Linear4bit #if args.bits == 4 else (bnb.nn.Linear8bitLt if args.bits == 8 else torch.nn.Linear)
  lora_module_names = set()
  for name, module in model.named_modules():
    if isinstance(module, cls):
      names = name.split('.')
      lora_module_names.add(names[0] if len(names) == 1 else names[-1])
    if 'lm_head' in lora_module_names: # needed for 16-bit
      lora_module_names.remove('lm_head')
  return list(lora_module_names)

#4 
modules = find_all_linear_names(model)

#5 
lora_config = LoraConfig(
    r=64,
    lora_alpha=32,
    target_modules=modules,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

#6
model = get_peft_model(model, lora_config)

#7
trainable, total = model.get_nb_trainable_parameters()
print(f"Trainable: {trainable} | total: {total} | Percentage: {trainable/total*100:.4f}%")
```

이제 이를 단계별로 이해해봅시다.

- 우리는 체크포인트를 사용하여 그라디언트를 저장할 수 있도록 설정합니다.
- 모델을 k비트(QLoRA) 학습용으로 준비합니다.
- 모델의 모든 선형 레이어의 이름을 반환하는 함수를 생성합니다. 이 함수는 모델의 키퀴리, 값, 그리고 출력 레이어를 반환합니다. 여기서 왜 이러한 레이어만을 반환하는지에 대해서 제가 완전히 확신하지는 못합니다. 그러나 아마도 어텐션 구성 요소(키, 쿼리, 값)가 다른 레이어보다 언어 이해에 중요한 역할을 하는 것으로 생각됩니다. 이 부분에서 잘못될 수도 있으며, 누군가가 제게 지적해 주시면 좋을 것 같습니다.
- (3)에서 함수를 호출합니다.
- LoRA 구성을 정의합니다. 여기서 r은 행렬을 분해하는 것에 대해 이전에 논의한 것과 동일합니다. lora alpha는 스케일링 요인을 말하며, lora 가중치가 기본 모델에 얼마나 강하게 영향을 미치는지를 나타냅니다.
- LoRA 구성이 추가된 peft 모델 객체를 가져옵니다.
- LoRA 구성에 기반하여 몇 개의 매개변수를 훈련하고 있는지 확인합니다. (결과: Trainable: 78446592 | total: 2584619008 | Percentage: 3.0351%). 이는 모델의 총 매개변수 중 3%만을 세밀하게 튜닝하고 있다는 것을 의미합니다. 3%로도 몇 번의 colab 메모리 부족이 발생했는데, 이는 LSTM 세밀 튜닝이 얼마나 계산적으로 비싼지를 나타냅니다.

<div class="content-ad"></div>

이제 훈련 프로세스를 시작할 수 있습니다.

```js
trainer = SFTTrainer(
    model=model,
    train_dataset=training_df,
    dataset_text_field="instruction",
    peft_config=lora_config,
    args=transformers.TrainingArguments(
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        warmup_steps=0.03,
        max_steps=100,
        learning_rate=2e-4,
        logging_steps=1,
        output_dir="outputs",
        optim="paged_adamw_8bit",
        save_strategy="epoch",
    ),
    data_collator=transformers.DataCollatorForLanguageModeling(tokenizer, mlm=False),
)
model.config.use_cache = False  # 경고 메시지를 무시합니다. 추론을 위해 다시 활성화하십시오!
trainer.train()
```

LLM을 훈련시키기 위해 허깅페이스의 SFTTrainer 클래스를 사용합니다. 모델, 데이터셋, 데이터셋의 텍스트 열, lora 구성 및 몇 가지 훈련 인수를 전달합니다. 그런 다음 실행을 설정합니다.

<img src="/assets/img/2024-06-22-FineTuningGemma-2b-itonAnimeDataset_1.png" />

<div class="content-ad"></div>

트레이닝 손실은 각 단계마다 여기에 표시됩니다. 실행이 완료되면 LoRA 레이어가 훈련됩니다. 이제 해야 할 일은 LoRA 레이어를 원래 모델로 병합하는 것입니다.

```python
ft_model_path = "drive/My Drive/LLM/Model/FT Model/"
tokenizer_path = "drive/My Drive/LLM/Model/Tokenizer/"

trainer.model.save_pretrained(ft_model_path)
tokenizer.save_pretrained(tokenizer_path)

base_model = AutoModelForCausalLM.from_pretrained(
    model_id,
    low_cpu_mem_usage=True,
    return_dict=True,
    torch_dtype=torch.float16,
    device_map={"": 0},
)
merged_model = PeftModel.from_pretrained(base_model, ft_model_path)
merged_model = merged_model.merge_and_unload()
```

먼저 토크나이저와 훈련된 LoRA 레이어를 저장합니다(토크나이저를 다시 저장할 필요는 없습니다. 이전에 이미 한 번 다운로드하고 전혀 변경하지 않았습니다). 그 다음 Gemma-2b-it 모델을 다시로드하여 LoRA 레이어와 병합합니다.

마지막 진행해야 할 단계는 세부 조정된 모델을 추론하는 것이며, 동일한 예시를 사용하겠습니다.

<div class="content-ad"></div>

```js
prompt = '''애니메이션 나루토에 대해 알려주세요.
대답 :'''

print(generate_response(merged_model, tokenizer, prompt))
```

`bos`애니메이션 나루토에 대해 알려주세요. 대답 :`eos`애니메이션 나루토는 액션, 모험, 판타지 장르의 애니메이션입니다. 줄거리는 다음과 같습니다 : 은밀한 잎 마을의 닌자 그룹이 마을 주민들을 돕기 위해 은밀한 잎의 땅으로 파견됩니다. 그러나 마을 리더 인 오로치마루에게 배신당해야하며 도망쳐야 합니다. 애니메이션 나루토는 1997년에 처음 방영되었으며 총 1.0 에피소드가 있습니다.

그다지 좋지 않은 결과로 보입니다, 그렇지 않습니까?

맞습니다. 하지만 1번의 에포크조차 교육시키지 않았으므로 모델을 더 많은 단계나 에포크로 교육하면 모델 출력이 향상될 것입니다. 그러나 여기서 주목할 점은 출력에서 이제 우리가 특징으로 포함했던 애니메이션의 장르를 제공하고 있다는 것입니다. 그래서 세밀한 조정이 애니메이션에 대한 지식베이스를 변경했음을 생각해봅니다 :)


<div class="content-ad"></div>

마침내 이 기사를 읽어주셔서 정말 감사합니다. 피드백이나 제안 사항이 있으시면 알려주세요. 다음 기사에 반영하여 더 나은 내용을 제공하도록 하겠습니다.

건배하세요!