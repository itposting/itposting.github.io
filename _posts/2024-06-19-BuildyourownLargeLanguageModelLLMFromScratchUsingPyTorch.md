---
title: "파이토치PyTorch를 사용하여 처음부터 Large Language Model LLM을 만들어 보세요"
description: ""
coverImage: "/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_0.png"
date: 2024-06-19 18:43
ogImage: 
  url: /assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_0.png
tag: Tech
originalTitle: "Build your own Large Language Model (LLM) From Scratch Using PyTorch"
link: "https://medium.com/towards-artificial-intelligence/build-your-own-large-language-model-llm-from-scratch-using-pytorch-9e9945c24858"
---


## LLM 만들고 트레이닝하는 단계별 가이드입니다. 이 모델의 목표는 영어를 말레이어로 번역하는 것입니다.

![이미지](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_0.png)

이 글을 마치면 어떤 결과를 얻을 수 있을까요? 직접 코딩하면서 Large Language Model (LLM)을 만들고 트레이닝할 수 있게 될 거에요. 영어를 말레이어로 번역하는 LLM을 만들지만, 다른 언어 번역 작업을 위해 이 LLM 아키텍처를 쉽게 수정할 수 있습니다.

LLM은 ChatGPT, Gemini, MetaAI, Mistral AI 등과 같은 인기 있는 AI 챗봇의 핵심 기반이 됩니다. 모든 LLM의 핵심에는 Transformer라는 아키텍처가 있습니다. 따라서, 먼저 유명한 논문 "Attention is all you need"을 바탕으로 Transformer 아키텍처를 구축할 것입니다 - https://arxiv.org/abs/1706.03762.

<div class="content-ad"></div>

![transformer_step_by_step](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_1.png)

먼저, 우리는 트랜스포머 모델의 모든 구성 요소를 블록 단위로 구축할 것입니다. 그런 다음, 모든 블록을 조합하여 모델을 구축할 것입니다. 그 후에는 Hugging Face 데이터셋에서 얻을 데이터셋으로 모델을 훈련하고 유효성을 검사할 것입니다. 마지막으로 새 번역 텍스트 데이터에 대한 번역을 수행하여 모델을 테스트할 것입니다.

중요 사항: 저는 트랜스포머 아키텍처의 모든 구성 요소를 단계별로 코딩하고 '무엇, 왜, 어떻게'에 대한 개념에 대한 필요한 설명을 제공할 것입니다. 또한 설명이 필요한 특정 코드 라인에 대해 주석을 제공할 것입니다. 이렇게 하면 직접 코딩하면서 전체 워크플로에 연결할 수 있을 것이라고 믿습니다.

![transformer_architecture](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_2.png)

<div class="content-ad"></div>

함께 코딩해요!

## 단계 1: 데이터셋 로드

LLM 모델이 영어에서 말레이어로 번역하는 작업을 할 수 있도록 하려면 소스(영어)와 대상(말레이어) 언어 쌍이 있는 데이터셋을 사용해야 합니다. 따라서, Huggingface에서 "Helsinki-NLP/opus-100"라는 데이터셋을 사용할 것입니다. 이 데이터셋은 1백만 개의 영어-말레이어 훈련 데이터셋을 가지고 있어서 좋은 정확도를 얻기에 충분하며, 검증 및 테스트 데이터셋에 각각 2,000개의 데이터가 있습니다. 데이터는 이미 사전 분할되어 있어서 데이터셋을 다시 분할할 필요가 없습니다.


# 필요한 라이브러리 가져오기
# 아직 안 했다면 (!pip install datasets, tokenizers)를 사용하여 데이터셋 및 토크나이저 라이브러리 설치하기.
import os
import math
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from pathlib import Path
from datasets import load_dataset
from tqdm import tqdm

# GPU가 사용 가능하다면 "cuda"로 장치 값을 할당하여 GPU에서 훈련합니다. 사용할 수 없는 경우 기본값인 "cpu"로 되돌릴 것입니다.
device = torch.device("cuda" if torch.cuda.is_available() else "cpu") 

# Huggingface 경로에서 훈련, 검증, 테스트 데이터셋을 로드합니다.
raw_train_dataset = load_dataset("Helsinki-NLP/opus-100", "en-ms", split='train')
raw_validation_dataset = load_dataset("Helsinki-NLP/opus-100", "en-ms", split='validation')
raw_test_dataset = load_dataset("Helsinki-NLP/opus-100", "en-ms", split='test')

# 데이터셋 파일을 저장할 디렉토리 생성
os.mkdir("./dataset-en")
os.mkdir("./dataset-my")

# 각 에폭 후 모델 훈련 중에 모델을 저장할 디렉토리 생성 (단계 10에서 사용).
os.mkdir("./malaygpt")

# 소스 및 대상 토크나이저를 저장할 디렉토리 생성.
os.mkdir("./tokenizer_en")
os.mkdir("./tokenizer_my")

dataset_en = []
dataset_my = []
file_count = 1

# 토크나이저를 훈련하기 위해 (단계 2에서) 훈련 데이터셋을 영어 및 말레이어로 분리합니다.
# 각 파일에 50,000개씩 작은 데이터 파일을 만들어 dataset-en 및 dataset-my 디렉토리에 저장합니다.
for data in tqdm(raw_train_dataset["translation"]):
    dataset_en.append(data["en"].replace('\n', " "))
    dataset_my.append(data["ms"].replace('\n', " "))
    if len(dataset_en) == 50000:
        with open(f'./dataset-en/file{file_count}.txt', 'w', encoding='utf-8') as fp:
            fp.write('\n'.join(dataset_en))
            dataset_en = []

        with open(f'./dataset-my/file{file_count}.txt', 'w', encoding='utf-8') as fp:
            fp.write('\n'.join(dataset_my))
            dataset_my = []
        file_count += 1


<div class="content-ad"></div>

## 단계 2: 토크나이저 생성

트랜스포머 모델은 원시 텍스트를 처리하지 않으며, 숫자만 처리합니다. 따라서 원시 텍스트를 숫자로 변환하기 위해 어떤 작업을 해야 할 것입니다. 이를 위해 저희는 GPT3와 같은 모델에서 사용되는 서브워드 토크나이저인 BPE 토크나이저를 사용할 것입니다. 먼저 우리가 단계 1에서 준비한 코퍼스 데이터(이 경우 교육 데이터 셋)로 BPE 토크나이저를 먼저 학습할 것입니다. 아래 다이어그램과 같이 진행됩니다.

![image](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_3.png)

학습이 완료되면 토크나이저는 영어와 말레이 언어용 어휘를 생성합니다. 어휘는 코퍼스 데이터에서 고유한 토큰들의 컬렉션입니다. 번역 작업을 수행하기 때문에 두 언어에 대한 토크나이저가 필요합니다. BPE 토크나이저는 원시 텍스트를 가져와 어휘 내의 토큰들과 매핑한 후, 입력된 원시 텍스트의 각 단어에 대해 토큰을 반환합니다. 토큰은 단일 단어나 서브워드가 될 수 있습니다. 이는 다른 토크나이저에 비해 서브워드 토크나이저의 장점 중 하나입니다. 그리고 토크나이저는 그 고유한 인덱스 또는 위치 ID를 반환하고, 이는 위의 흐름에서 임베딩을 생성하는 데 추가로 사용될 것입니다.

<div class="content-ad"></div>

```js
# 토크나이저 라이브러리 클래스 및 모듈 가져오기.
from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace

# 토크나이저를 훈련시킬 학습 데이터셋 파일 경로.
path_en = [str(file) for file in Path('./dataset-en').glob("**/*.txt")]
path_my = [str(file) for file in Path('./dataset-my').glob("**/*.txt")]

# [원본 언어 토크나이저(영어) 생성].
# [UNK] - 알 수 없는 단어를 나타내는 특수 토큰 생성, [PAD] - 패딩 토큰으로 모델 간 시퀀스 길이를 일정하게 유지하기 위함.
# [CLS] - 문장 시작을 표시하는 토큰, [SEP] - 문장 끝을 표시하는 토큰 등의 추가 특수 토큰 생성.
tokenizer_en = Tokenizer(BPE(unk_token="[UNK]"))
trainer_en = BpeTrainer(min_frequency=2, special_tokens=["[PAD]","[UNK]","[CLS]", "[SEP]", "[MASK]"])

# 토큰을 공백을 기준으로 분리.
tokenizer_en.pre_tokenizer = Whitespace()

# 데이터셋 파일로 토크나이저 훈련.
tokenizer_en.train(files=path_en, trainer=trainer_en)

# 향후 사용을 위해 토크나이저 저장.
tokenizer_en.save("./tokenizer_en/tokenizer_en.json")

# [타겟 언어 토크나이저(말레이어) 생성].
tokenizer_my = Tokenizer(BPE(unk_token="[UNK]"))
trainer_my = BpeTrainer(min_frequency=2, special_tokens=["[PAD]","[UNK]","[CLS]", "[SEP]", "[MASK]"])
tokenizer_my.pre_tokenizer = Whitespace()
tokenizer_my.train(files=path_my, trainer=trainer_my)
tokenizer_my.save("./tokenizer_my/tokenizer_my.json")

tokenizer_en = Tokenizer.from_file("./tokenizer_en/tokenizer_en.json")
tokenizer_my = Tokenizer.from_file("./tokenizer_my/tokenizer_my.json")

# 각 토크나이저의 크기 확인.
source_vocab_size = tokenizer_en.get_vocab_size()
target_vocab_size = tokenizer_my.get_vocab_size()

# 토큰 ID 변수 정의, 모델 훈련에 사용.
CLS_ID = torch.tensor([tokenizer_my.token_to_id("[CLS]")], dtype=torch.int64).to(device)
SEP_ID = torch.tensor([tokenizer_my.token_to_id("[SEP]")], dtype=torch.int64).to(device)
PAD_ID = torch.tensor([tokenizer_my.token_to_id("[PAD]")], dtype=torch.int64).to(device)
```

## Step 3: 데이터셋 및 DataLoader 준비

이 단계에서는 나중에 구축할 모델을 훈련하고 검증하기 위해 소스 언어와 타겟 언어 각각에 대한 데이터셋을 준비할 것입니다. 우리는 원시 데이터셋을 입력으로 받아 소스(토크나이저_en)와 타겟(토크나이저_my) 텍스트를 각각 인코딩하는 기능을 정의하는 클래스를 생성할 것입니다. 마지막으로, 훈련 및 검증 데이터셋을 위해 DataLoader를 생성하겠습니다. 이 DataLoader는 배치 단위로 데이터셋을 반복하며(예: 배치 크기는 10으로 설정될 수 있음), 데이터 크기와 사용 가능한 처리 능력에 따라 배치 크기를 조정할 수 있습니다.

```js
# 이 클래스는 원시 데이터셋과 max_seq_len (전체 데이터셋에서 시퀀스의 최대 길이)을 가져옵니다.
class EncodeDataset(Dataset):
    def __init__(self, raw_dataset, max_seq_len):
        super().__init__()
        self.raw_dataset = raw_dataset
        self.max_seq_len = max_seq_len
    
    def __len__(self):
        return len(self.raw_dataset)

    def __getitem__(self, index):
        
        # 주어진 인덱스의 원시 텍스트를 가져와 소스 및 타겟 텍스트로 분리함.
        raw_text = self.raw_dataset[index]
        
        # 소스 텍스트와 타겟 텍스트를 인코딩하기 위해 소스 토크나이저(tokenizer_en) 및 타겟 토크나이저(tokenizer_my)를 사용합니다.
        source_text_encoded = torch.tensor(tokenizer_en.encode(source_text).ids, dtype = torch.int64).to(device)    
        target_text_encoded = torch.tensor(tokenizer_my.encode(target_text).ids, dtype = torch.int64).to(device)

        # 모델 훈련을 위해 각 입력 시퀀스의 길이가 max_seq_len과 동일하도록 만들기 위해 필요한 만큼의 패딩을 추가합니다.
        num_source_padding = self.max_seq_len - len(source_text_encoded) - 2 
        num_target_padding = self.max_seq_len - len(target_text_encoded) - 1 

        encoder_padding = torch.tensor([PAD_ID] * num_source_padding, dtype = torch.int64).to(device)
        decoder_padding = torch.tensor([PAD_ID] * num_target_padding, dtype = torch.int64).to(device)

        # 인코더 입력은 문장 시작 토큰인 CLS_ID로 시작하여 소스 인코딩으로 이어지고 문장 끝 토큰인 SEP가 뒤따릅니다.
        # 필요한 max_seq_len에 도달하기 위해 마지막에 PAD 토큰이 추가됩니다.
        encoder_input = torch.cat([CLS_ID, source_text_encoded, SEP_ID, encoder_padding]).to(device)

        # 디코더 입력은 문장 시작 토큰인 CLS_ID로 시작하여 타겟 인코딩이 뒤따릅니다.
        # 필요한 max_seq_len에 도달하기 위해 마지막에 PAD 토큰이 추가됩니다. 디코더 입력에는 문장 끝 토큰인 SEP는 포함되지 않습니다.
        decoder_input = torch.cat([CLS_ID, target_text_encoded, decoder_padding]).to(device)

        # 타겟 레이블은 타겟 인코딩이 먼저 오고 문장 끝 토큰인 SEP가 뒤따릅니다. 시작 문장 토큰인 CLS는 없습니다.
        # 필요한 max_seq_len에 도달하기 위해 마지막에 PAD 토큰이 추가됩니다.
        target_label = torch.cat([target_text_encoded,SEP_ID,decoder_padding]).to(device)

        # 인코딩 시 추가된 패딩 토큰을 모델이 학습하지 않도록 하기 위해 인코더 마스크를 사용하여 padding 토큰 값을 계산하기 전에 무효화합니다.
        encoder_mask = (encoder_input != PAD_ID).unsqueeze(0).unsqueeze(0).int().to(device)

        # 디코딩 단계에서는 현재 토큰 이후의 토큰에 영향을 받지 않도록 하기 위해 인과 마스크를 구현합니다.
        decoder_mask = (decoder_input != PAD_ID).unsqueeze(0).unsqueeze(0).int() & causal_mask(decoder_input.size(0)).to(device)

        return {
            'encoder_input': encoder_input,
            'decoder_input': decoder_input,
            'target_label': target_label,
            'encoder_mask': encoder_mask,
            'decoder_mask': decoder_mask,
            'source_text': source_text,
            'target_text': target_text
        }

# 인과 마스크는 현재 토큰 이후에 올 토큰을 마스킹하여 softmax 함수 이후 -inf로 대체됩니다. 이를 통해 모델은 이러한 값들을 무시하거나 이를 통해 학습을 어렵게 합니다.
def causal_mask(size):
  # 인과 마스크의

<div class="content-ad"></div>

## 단계 4: 입력 임베딩 및 위치 인코딩

입력 임베딩: 단계 2의 토큰 생성기에서 생성된 토큰 ID 시퀀스가 임베딩 레이어로 공급될 것입니다. 임베딩 레이어는 토큰 ID를 어휘와 매핑하고 각 토큰에 대해 512 차원의 임베딩 벡터를 생성합니다. [512 차원은 어텐션 논문에서 가져왔습니다]. 임베딩 벡터는 토큰의 의미를 캡쳐할 수 있으며, 그것은 학습된 데이터셋에 기반하여 학습되었습니다. 임베딩 벡터 내의 각 차원 값은 토큰과 관련된 특징을 나타냅니다. 예를 들어, 토큰이 '개'인 경우, 일부 차원 값은 눈, 입, 다리, 키 등을 나타낼 것입니다. n차원 공간에 벡터를 그린다면, 비슷해 보이는 객체인 개와 고양이는 서로 가깝게 위치하고, 비슷해 보이지 않는 학교, 집 임베딩 벡터는 훨씬 더 멀리 위치해 있을 것입니다.

위치 인코딩: 트랜스포머 아키텍처의 장점 중 하나는 어떤 수의 입력 시퀀스든 병렬로 처리할 수 있다는 것이며, 이는 훈련 시간을 많이 줄이고 예측을 훨씬 빠르게 만듭니다. 그러나 단점 중 하나는 병렬로 많은 토큰 시퀀스를 처리하는 동안, 문장 내 토큰의 위치가 순서대로 되지 않을 수 있다는 것입니다. 이로 인해 토큰의 위치에 따라 문장의 의미나 문맥이 달라질 수 있습니다. 따라서 이 문제를 해결하기 위해 어텐션 논문은 위치 인코딩 방법을 구현했습니다. 이 논문은 각 토큰의 512 차원에 대해 두 가지 수학 함수(sin과 cosine)를 적용하는 것을 제안했습니다. 아래는 간단한 sin과 cosine 수학 함수입니다.

![이미지](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_4.png)

<div class="content-ad"></div>

Sin 함수는 임베딩 벡터의 각 짝수 차원 값에 적용되고, 코사인 함수는 홀수 차원 값에 적용됩니다. 최종적으로, 결과적인 위치 인코더 벡터는 임베딩 벡터에 추가됩니다. 이제 우리는 토큰의 의미와 위치를 모두 잡을 수 있는 임베딩 벡터를 갖게 되었습니다. 주의할 점은 위치 인코딩의 값이 각 시퀀스에서 동일하다는 것입니다.

# 입력 임베딩과 위치 인코딩
class EmbeddingLayer(nn.Module):
    def __init__(self, vocab_size: int, d_model: int):
        super().__init__()
        self.d_model = d_model
        
        # PyTorch의 임베딩 레이어 모듈을 사용하여 토큰 ID를 어휘에 매핑한 후 임베딩 벡터로 변환합니다.
        # vocab_size는 훈련 데이터셋의 어휘 크기이며, 토큰화기가 코퍼스 데이터셋 훈련 중에 생성한 것입니다.
        self.embedding = nn.Embedding(vocab_size, d_model)
    
    def forward(self, input):
        # 입력 시퀀스를 임베딩 레이어에 공급할 때, d_model의 제곱근을 곱하는 추가로 정규화 작업을 수행합니다.
        embedding_output = self.embedding(input) * math.sqrt(self.d_model)
        return embedding_output


class PositionalEncoding(nn.Module):
    def __init__(self, max_seq_len: int, d_model: int, dropout_rate: float):
        super().__init__()
        self.dropout = nn.Dropout(dropout_rate)
        
        # 임베딩 벡터와 동일한 모양의 행렬을 만듭니다.
        pe = torch.zeros(max_seq_len, d_model)
        
        # PE 함수의 위치 부분을 계산합니다.
        pos = torch.arange(0, max_seq_len, dtype=torch.float).unsqueeze(1)

        # PE 함수의 나눗셈 부분을 계산합니다. 지수 함수의 표현이 논문 표현과 약간 다르지만 더 잘 작동하는 것으로 보입니다.
        div_term = torch.exp(torch.arange(0, d_model, 2).float()) * (-math.log(10000)/d_model)
        
        # sin 및 cosine 수학 함수 결과로 홀수 및 짝수 행렬 값을 채웁니다.
        pe[:, 0::2] = torch.sin(pos * div_term)
        pe[:, 1::2] = torch.cos(pos * div_term)
        
        # 입력 시퀀스가 배치로 예상되므로 추가적인 batch_size 차원이 0 위치에 추가됩니다.
        pe = pe.unsqueeze(0)    
    
    def forward(self, input_embdding):
        # 입력 임베딩 벡터에 위치 인코딩을 추가합니다.
        input_embdding = input_embdding + (self.pe[:, :input_embdding.shape[1], :]).requires_grad_(False)  
        
        # 과적합을 방지하기 위해 드롭아웃을 수행합니다.
        return self.dropout(input_embdding)

## 단계 5: 멀티 헤드 어텐션 블록

트랜스포머가 LLM의 핵심인 것처럼, 셀프 어텐션 메커니즘은 트랜스포머 아키텍처의 핵심입니다.

<div class="content-ad"></div>

자가 주의가 필요한 이유는 무엇인가요? 아래 간단한 예를 통해 답변해보겠습니다.

![Example](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_5.png)

문장 1과 문장 2에서 “bank”라는 단어는 명백히 두 가지 다른 의미를 가지고 있습니다. 그러나 “bank” 단어의 임베딩 값은 두 문장 모두에서 동일합니다. 이는 적절하지 않습니다. 우리는 임베딩 값이 문맥에 따라 변경되어야 한다는 것을 원합니다. 따라서 문장의 전체 의미에 기반하여 문맥적 의미를 나타낼 수 있는 동적 임베딩 값을 가지는 메커니즘이 필요합니다. 자가 주의 메커니즘은 문장의 전체 의미에 기반하여 문맥적 의미를 나타낼 수 있는 임베딩 값을 동적으로 업데이트할 수 있습니다.

자가 주의가 이미 좋은데, 왜 다중 머리 자가 주의가 필요할까요? 답을 알아보기 위해 아래 예시를 살펴보겠습니다.

<div class="content-ad"></div>

```
![image](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_6.png)

이 예에서는 self-attention을 사용할 때 문장의 한 측면에만 집중할 수 있는 가능성이 있습니다. 아마도 "what" 측면만을 포착할 수 있을 것입니다. 예를 들어, "존이 무엇을 했나요?"와 같이요. 그러나 "언제"나 "어디"와 같은 다른 측면들도 모델이 더 나은 성능을 발휘하기 위해 동등한 중요성을 갖습니다. 그래서, Self-Attention 메커니즘이 한 문장 내에서 여러 관계를 학습하도록 하는 방법을 찾아야 합니다. 이것이 Multi-Head Self Attention(Multi-Head Attention으로도 교차 사용 가능)이 해결해 주는 곳이죠. Multi-Head Attention에서는 단일 헤드 임베딩을 여러 헤드로 분할하여 각 헤드가 문장의 다른 측면을 살펴보고 그에 맞게 학습합니다. 이것이 우리가 원하는 바입니다.

이제 왜 Multi-Head Attention이 필요한지 알게 되었습니다. 이제 어떻게 작용하는지 살펴보겠습니다. Multi-Head Attention은 실제로 어떻게 작동하는 걸까요? 바로 살펴보겠습니다.

행렬 곱셈에 익숙하시다면, 이 메카니즘을 이해하는 것은 꽤 쉬운 작업일 것입니다. 먼저 전체 플로우 다이어그램을 살펴보고 Multi-Head Attention의 입력부터 출력까지의 플로우를 아래 일목요연하게 설명하겠습니다.



<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_7.png)

1. 먼저, 인코더 입력의 3개 복사본을 만들어봅시다 (입력 임베딩과 위치 인코딩의 조합, 이것은 단계 4에서 했었습니다). 각각을 Q, K, V라고 이름 붙여봅시다. 이들은 단지 인코더 입력의 복사본일 뿐입니다. 인코더 입력 형태: (seq_len, d_model), seq_len: 최대 시퀀스 길이, d_model: 이 경우에는 임베딩 벡터 차원이 512입니다.

2. 다음으로, Q를 가중치 W_q, K를 가중치 W_k, V를 가중치 W_v와 행렬 곱셈을 수행하겠습니다. 각 가중치 행렬의 형태는 (d_model, d_model)입니다. 새로 얻게 된 쿼리, 키, 밸류 임베딩 벡터의 형태는 (seq_len, d_model)입니다. 가중치 매개변수들은 모델에 의해 무작위로 초기화되며 나준에 모델이 훈련을 시작할 때 업데이트될 것입니다. 어째서 우리가 처음부터 하는 가중치 행렬 곱셈이 필요한 것일까요? 왜냐하면 이것들은 쿼리, 키, 밸류 임베딩 벡터에 더 나은 표현을 제공하기 위해 필요한 학습 가능한 매개변수들이기 때문입니다.

3. 어텐션 논문에 따르면, 헤드(heads) 수는 8입니다. 각 새로운 쿼리, 키, 밸류 임베딩 벡터는 8개의 더 작은 유닛으로 나뉘어집니다. 임베딩 벡터의 새로운 형태는 (seq_len, d_model/num_heads) 또는 (seq_len, d_k)입니다. [ d_k = d_model/num_heads ].


<div class="content-ad"></div>

4. 각 쿼리 임베딩 벡터는 자신 및 시퀀스의 모든 다른 임베딩 벡터의 키 임베딩 벡터의 전치와 닷 프로덕트 연산을 수행합니다. 이 닷 프로덕트는 주의 점수를 제공합니다. 주의 점수는 주어진 토큰이 주어진 입력 시퀀스의 다른 모든 토큰과 얼마나 유사한지를 보여줍니다. 점수가 높을수록 유사도가 더 높습니다.

- 주의 점수는 나중에 매트릭스 전체에 걸쳐 점수 값을 정규화하는 데 필요한 d_k의 제곱근으로 나눠집니다. 그러나 왜 d_k로 나눠 정규화해야 하는 걸까요? 어떤 다른 숫자여도 괜찮을 텐데요. 주된 이유는 임베딩 벡터 차원이 증가함에 따라 주의 매트릭스의 총 분산이 비례해서 증가하기 때문입니다. 그래서 d_k로 나누면 분산 증가를 균형시킬 수 있습니다. 만약 d_k로 나누지 않으면, 어떤 높은 주의 점수라도 소프트맥스 함수는 매우 높은 확률 값을 제공하고, 반대로 낮은 주의 점수 값에 대해서는 소프트맥스 함수가 매우 낮은 확률 값을 제공할 것입니다. 이로 인해 모델은 그러한 확률 값이 있는 특징만 학습하려 하고, 낮은 확률 값이 있는 특징을 무시하기 쉽습니다. 이는 그라디언트가 소실되는 문제로 이어지게 됩니다. 따라서 주의 점수 매트릭스를 정규화하는 것이 매우 중요합니다.
- 소프트맥스 함수를 수행하기 전에, 인코더 마스크가 None이 아닌 경우, 주의 점수는 인코더 마스크와 매트릭스 곱셈이 될 것입니다. 마스크가 인과적 마스크인 경우, 입력 시퀀스에서 그 이후에 오는 임베딩 토큰들에 대한 주의 점수 값은 -ve 무한대로 대체됩니다. 소프트맥스 함수는 -ve 무한대 값을 거의 0 값으로 변환할 것입니다. 그래서 모델은 현재 토큰 이후에 나오는 특징을 학습하지 않을 것입니다. 이것이 우리 모델 학습에 미래 토큰이 영향을 미치는 것을 방지하는 방법입니다.

5. 소프트맥스 함수가 주의 점수 매트릭스에 적용되고 (seq_len, seq_len) 모양의 가중치 매트릭스가 출력됩니다.

6. 이 가중치 매트릭스는 해당 값 임베딩 벡터와 매트릭스 곱셈을 수행할 것입니다. 결과적으로 (seq_len, d_v) 모양의 8개의 주의 헤드가 생성됩니다. [ d_v = d_model/num_heads ].

<div class="content-ad"></div>

그러면, 모든 헤드들이 새로운 형태(seq_len, d_model)를 갖는 단일 헤드로 연결됩니다. 이 새로운 단일 헤드는 출력 가중치 행렬 W_o(d_model, d_model)과 행렬 곱셈을 수행합니다. Multi-Head Attention의 최종 출력은 단어의 문맥적 의미와 입력 문장의 여러 측면을 학습하는 능력을 나타냅니다.

이제 Multi-Head Attention 블록 코딩을 시작해봅시다. 이것은 훨씬 쉽고 간단할 거예요.

```js
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int, dropout_rate: float):
        super().__init__()
        # 과적합을 방지하기 위해 드롭아웃을 정의합니다.
        self.dropout = nn.Dropout(dropout_rate)
        
        # 가중치 행렬은 도입되며 모두 학습 가능한 매개변수입니다.
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

        self.num_heads = num_heads
        assert d_model % num_heads == 0, "d_model은 헤드 수로 나눌 수 있어야 합니다."
        
        # d_k는 각 분할된 self attention 헤드의 새로운 차원입니다
        self.d_k = d_model // num_heads

    def forward(self, q, k, v, encoder_mask=None):
        
        # 여러 시퀀스 배치로 모델을 한 번에 병렬로 학습하게 될 것이므로, 모양에 배치 크기를 포함해야 합니다.
        # 쿼리, 키 및 값은 해당 가중치와 입력 임베딩의 행렬 곱으로 계산됩니다.
        # 모양 변화: q(배치 크기, seq_len, d_model) @ W_q(d_model, d_model) => query(배치 크기, seq_len, d_model) [키와 값도 동일함].
        query = self.W_q(q) 
        key = self.W_k(k)
        value = self.W_v(v)

        # 쿼리, 키, 밸류를 헤드 수로 분할합니다. d_model은 d_k마다 8개 헤드로 분할됩니다.
        # 모양 변화: query(배치 크기, seq_len, d_model) => query(배치 크기, seq_len, num_heads, d_k) -> query(배치 크기, num_heads, seq_len, d_k) [키와 값도 동일함].
        query = query.view(query.shape[0], query.shape[1], self.num_heads, self.d_k).transpose(1,2)
        key = key.view(key.shape[0], key.shape[1], self.num_heads, self.d_k).transpose(1,2)
        value = value.view(value.shape[0], value.shape[1], self.num_heads, self.d_k).transpose(1,2)

        # :: SELF ATTENTION BLOCK STARTS ::

        # 유사도 또는 쿼리 간의 관련성을 찾기 위해 주의 점수가 계산됩니다.
        # 모양 변화: query(배치 크기, num_heads, seq_len, d_k) @ key(배치 크기, num_heads, seq_len, d_k) => attention_score(배치 크기, num_heads, seq_len, seq_len).
        attention_score = (query @ key.transpose(-2,-1)) / math.sqrt(self.d_k)

        # 만약 마스크가 제공된다면, 주의 점수를 마스크 값에 따라 수정해야 합니다. 자세한 내용은 4번을 참조하세요.
        if encoder_mask is not None:
            attention_score = attention_score.masked_fill(encoder_mask == 0, -1e9)
        
        # softmax 함수는 모든 주의 점수 중에서 확률 분포를 계산합니다. 더 높은 주의 점수에 더 높은 확률 값을 할당합니다. 즉, 보다 유사한 토큰은 더 높은 확률 값을 가집니다.
        # 모양 변화: attention_score와 동일합니다.
        attention_weight = torch.softmax(attention_score, dim=-1)

        if self.dropout is not None:
            attention_weight = self.dropout(attention_weight)

        # Self attention 블록의 최종 단계는 주의 가중치를 값 임베딩 벡터와의 행렬 곱셈입니다.
        # 모양 변화: attention_score(배치 크기, num_heads, seq_len, seq_len) @ value(배치 크기, num_heads, seq_len, d_k) => attention_output(배치 크기, num_heads, seq_len, d_k)
        attention_output = attention_score @ value
        
        # :: SELF ATTENTION BLOCK ENDS ::

        # 이제, 모든 헤드들이 다시 단일 헤드로 결합됩니다.
        # 모양 변화: attention_output(배치 크기, num_heads, seq_len, d_k) => attention_output(배치 크기, seq_len, num_heads, d_k) => attention_output(배치 크기, seq_len, d_model)        
        attention_output = attention_output.transpose(1,2).contiguous().view(attention_output.shape[0], -1, self.num_heads * self.d_k)

        # 마침내 attention_output을 출력 가중치 행렬로 행렬 곱하여 최종 Multi-Head attention 출력을 얻습니다.
        # multihead_output의 모양은 임베딩 입력과 동일합니다.
        # 모양 변화: attention_output(배치 크기, seq_len, d_model) @ W_o(d_model, d_model) => multihead_output(배치 크기, seq_len, d_model)
        multihead_output = self.W_o(attention_output)
        
        return multihead_output
```

## Step 6: 피드포워드 네트워크, 레이어 정규화 및 AddAndNorm

<div class="content-ad"></div>

피드포워드 네트워크: 피드포워드 네트워크는 두 개의 선형 레이어(첫 번째는 d_model 노드를 가지고 두 번째는 d_ff 노드를 가지며, 주어진 값은 어텐션 논문에 따라 할당됩니다)를 통해 임베딩 벡터의 모든 기능을 학습하는 딥 신경망을 사용합니다. 첫 번째 선형 레이어의 출력에는 ReLU 활성화 함수가 적용되어 임베딩 값을 비선형으로 만들고, 과적합을 피하기 위해 드롭아웃이 적용됩니다.

레이어 정규화: 네트워크 내 임베딩 벡터의 값 분포가 일관되게 유지되도록 임베딩 값에 레이어 정규화를 적용합니다. 이는 원활한 학습을 보장합니다. 네트워크가 필요로 하는대로 임베딩 값을 스케일링하고 이동시키기 위해 gamma와 beta라는 추가 학습 매개변수를 사용할 것입니다.

AddAndNorm: 이는 스킵 연결과 레이어 정규화(이전에 설명함)로 구성됩니다. 순방향 패스에서 스킵 연결은 이전 레이어의 기능이 계산 결과에 필요한 기여를 할 수 있도록 나중 단계에서도 해당 기능을 기억할 수 있습니다. 마찬가지로 역전파 중에도 스킵 연결은 각 단계에서 하나 덜의 역전파를 수행해 사라지는 기울기를 방지합니다. AddAndNorm은 인코더(2번)와 디코더 블록(3번) 모두에 사용됩니다. 이는 이전 레이어에서 입력을 받아 이전 레이어의 출력에 추가하기 전에 먼저 정규화합니다.

```js
# Feedfoward Network, Layer Normalization and AddAndNorm Block
class FeedForward(nn.Module):
    def __init__(self, d_model: int, d_ff: int, dropout_rate: float):
        super().__init__()

        self.layer_1 = nn.Linear(d_model, d_ff)
        self.activation_1 = nn.ReLU()
        self.dropout = nn.Dropout(dropout_rate)
        self.layer_2 = nn.Linear(d_ff, d_model)
    
    def forward(self, input):
        return self.layer_2(self.dropout(self.activation_1(self.layer_1(input))))

class LayerNorm(nn.Module):
    def __init__(self, eps: float = 1e-5):
        super().__init__()
        # 엡실론은 매우 작은 값으로, 잠재적으로 0으로 나누는 문제를 방지하는 데 중요한 역할을 합니다.
        self.eps = eps

        # 스케일링과 이동을 위해 추가 학습 매개변수인 감마와 베타를 도입합니다.
        self.gamma = nn.Parameter(torch.ones(1))
        self.beta = nn.Parameter(torch.zeros(1))
    
    def forward(self, input):
        mean = input.mean(dim=-1, keepdim=True)      
        std = input.std(dim=-1, keepdim=True)      

        return self.gamma * ((input - mean)/(std + self.eps)) + self.beta
        
class AddAndNorm(nn.Module):
    def __init__(self, dropout_rate: float):
        super().__init__()
        self.dropout = nn.Dropout(dropout_rate)
        self.layer_norm = LayerNorm()

    def forward(self, input, sub_layer):
        return input + self.dropout(sub_layer(self.layer_norm(input)))
```

<div class="content-ad"></div>

## 단계 7: 인코더 블록과 인코더

인코더 블록: 인코더 블록 안에는 두 가지 주요 구성 요소가 있습니다: 멀티헤드 어텐션과 피드포워드입니다. Add & Norm 단위가 2개 있습니다. 먼저 어텐션 논문의 흐름에 따라 EncoderBlock 클래스에 모든 이러한 구성 요소를 조립할 것입니다. 논문에 따르면 이 인코더 블록은 6번 반복된다고 합니다.

인코더: 그런 다음 EncoderBlock 목록을 가져와 쌓아 최종 Encoder 출력을 제공할 Encoder라는 추가 클래스를 생성할 것입니다.

```python
class EncoderBlock(nn.Module):
    def __init__(self, multihead_attention: MultiHeadAttention, feed_forward: FeedForward, dropout_rate: float):
        super().__init__()
        self.multihead_attention = multihead_attention
        self.feed_forward = feed_forward
        self.add_and_norm_list = nn.ModuleList([AddAndNorm(dropout_rate) for _ in range(2)])

    def forward(self, encoder_input, encoder_mask):
        # 인코더 입력을 스킵 연결에서 가져와 멀티헤드 어텐션 블록의 출력과 더하는 첫 번째 AddAndNorm 단위입니다.
        encoder_input = self.add_and_norm_list[0](encoder_input, lambda encoder_input: self.multihead_attention(encoder_input, encoder_input, encoder_input, encoder_mask))
        
        # 멀티헤드 어텐션 블록의 출력을 스킵 연결에서 가져와 피드포워드 레이어의 출력과 더하는 두 번째 AddAndNorm 단위입니다.
        encoder_input = self.add_and_norm_list[1](encoder_input, self.feed_forward)

        return encoder_input

class Encoder(nn.Module):
    def __init__(self, encoderblocklist: nn.ModuleList):
        super().__init__()

        # Encoder 클래스는 encoderblock 목록을 가져와 초기화합니다.
        self.encoderblocklist = encoderblocklist
        self.layer_norm = LayerNorm()

    def forward(self, encoder_input, encoder_mask):
        # 모든 인코더 블록을 반복합니다 - 총 6번.
        for encoderblock in self.encoderblocklist:
            encoder_input = encoderblock(encoder_input, encoder_mask)

        # 최종 인코더 블록 출력을 정규화하고 반환합니다. 이 인코더 출력은 나중에 디코더 블록의 교차 어텐션에서 키 및 값으로 사용될 것입니다.
        encoder_output = self.layer_norm(encoder_input)
        return encoder_output
```

<div class="content-ad"></div>

## Step 8: 디코더 블록, 디코더 및 프로젝션 레이어

디코더 블록: 디코더 블록에는 세 가지 주요 구성 요소가 있습니다: 마스킹된 멀티헤드 어텐션, 멀티헤드 어텐션 및 피드포워드입니다. 디코더 블록에는 Add & Norm의 3개 단위도 있습니다. 우리는 이러한 구성 요소들을 Attention 논문의 흐름에 따라 DecoderBlock 클래스에 모두 조합할 것입니다. 논문에 따르면 이 디코더 블록은 6번 반복됩니다.

디코더: 우리는 DecoderBlock의 리스트를 가져와 스택하여 최종 디코더 출력을 생성할 Decoder라는 추가 클래스를 만들 것입니다.

디코더 블록에는 두 가지 타입의 멀티헤드 어텐션이 있습니다. 첫 번째는 Masked Multi-Head 어텐션입니다. 이는 디코더 입력을 쿼리, 키, 밸류로 사용하며 디코더 마스크(인과 마스크로도 알려짐)를 사용합니다. 인과 마스크는 모델이 순서에 앞서있는 임베딩을 볼 수 없게 합니다. 이 동작 방식에 대한 자세한 설명은 3단계와 5단계에 제공되어 있습니다.

<div class="content-ad"></div>

프로젝션 레이어: 마지막 디코더 출력은 프로젝션 레이어로 전달됩니다. 이 레이어에서는 먼저 디코더 출력이 먼저 선형 레이어로 공급되어 임베딩의 모양이 아래 코드 섹션에서 제공된대로 변경될 것입니다. 그런 다음 softmax 함수가 디코더 출력을 어휘에 대한 확률 분포로 변환하고 가장 높은 확률을 가진 토큰이 예측 출력으로 선택됩니다.

```js
class DecoderBlock(nn.Module):
    def __init__(self, masked_multihead_attention: MultiHeadAttention, multihead_attention: MultiHeadAttention, feed_forward: FeedForward, dropout_rate: float):
        super().__init__()
        self.masked_multihead_attention = masked_multihead_attention
        self.multihead_attention = multihead_attention
        self.feed_forward = feed_forward
        self.add_and_norm_list = nn.ModuleList([AddAndNorm(dropout_rate) for _ in range(3)])

    def forward(self, decoder_input, decoder_mask, encoder_output, encoder_mask):
        # 첫 번째 AddAndNorm 유닛은 디코더 입력을 스킵 연결에서 가져와 마스킹된 멀티헤드 어텐션 블록의 출력과 더합니다.
        decoder_input = self.add_and_norm_list[0](decoder_input, lambda decoder_input: self.masked_multihead_attention(decoder_input, decoder_input, decoder_input, decoder_mask))
        # 두 번째 AddAndNorm 유닛은 스킵 연결로부터 마스킹된 멀티헤드 어텐션 블록의 출력을 가져와 멀티헤드 어텐션 블록의 출력과 더합니다.
        decoder_input = self.add_and_norm_list[1](decoder_input, lambda decoder_input: self.multihead_attention(decoder_input, encoder_output, encoder_output, encoder_mask)) # 교차 어텐션
        # 세 번째 AddAndNorm 유닛은 멀티헤드 어텐션 블록의 출력을 스킵 연결로부터 가져와 피드포워드 레이어의 출력과 더합니다.
        decoder_input = self.add_and_norm_list[2](decoder_input, self.feed_forward)
        return decoder_input

class Decoder(nn.Module):
    def __init__(self, decoderblocklist: nn.ModuleList):
        super().__init__()
        self.decoderblocklist = decoderblocklist
        self.layer_norm = LayerNorm()

    def forward(self, decoder_input, decoder_mask, encoder_output, encoder_mask):
        for decoderblock in self.decoderblocklist:
            decoder_input = decoderblock(decoder_input, decoder_mask, encoder_output, encoder_mask)

        decoder_output = self.layer_norm(decoder_input)
        return decoder_output

class ProjectionLayer(nn.Module):
    def __init__(self, vocab_size: int, d_model: int):
        super().__init__()
        self.projection_layer = nn.Linear(d_model, vocab_size)

    def forward(self, decoder_output):
        # 프로젝션 레이어는 먼저 디코더 출력을 받아 (d_model, vocab_size) 모양의 선형 레이어로 전달합니다.
        # 모양 변경: decoder_output(batch_size, seq_len, d_model) @ linear_layer(d_model, vocab_size) => output(batch_size, seq_len, vocab_size)
        output = self.projection_layer(decoder_output)
        
        # 어휘상의 확률 분포를 출력하기 위해 softmax 함수를 사용합니다.
        return torch.log_softmax(output, dim=-1)
```

## 단계 9: 트랜스포머 생성 및 구축

마침내, 트랜스포머 아키텍처의 모든 구성 요소 블록을 구축했습니다. 유일한 미완료 작업은 이 모든 것을 함께 조립하는 것입니다.

<div class="content-ad"></div>

먼저, 컴포넌트 클래스의 모든 인스턴스를 초기화하는 Transformer 클래스를 생성합니다. Transform 클래스 내부에는 먼저 인코더 부분의 모든 작업을 수행하고 인코더 출력을 생성하는 encode 함수를 정의합니다.

두 번째로, Transformer의 디코더 부분의 모든 작업을 수행하고 디코더 출력을 생성하는 decode 함수를 정의합니다.

세 번째로, 디코더 출력을 가져와 예측을 위해 해당 어휘에 매핑하는 project 함수를 정의합니다.

이제 Transformer 아키텍처가 준비되었습니다. 이제 아래 코드에서 필요한 모든 매개변수를 사용하여 번역 LLM 모델을 구축할 수 있는 함수를 정의합니다.

<div class="content-ad"></div>

```js
class Transformer(nn.Module):
    def __init__(self, source_embed: EmbeddingLayer, target_embed: EmbeddingLayer, positional_encoding: PositionalEncoding, multihead_attention: MultiHeadAttention, masked_multihead_attention: MultiHeadAttention, feed_forward: FeedForward, encoder: Encoder, decoder: Decoder, projection_layer: ProjectionLayer, dropout_rate: float):        
        super().__init__()
        
        # Transformer 아키텍처의 모든 구성 요소 클래스의 인스턴스를 초기화합니다.
        self.source_embed = source_embed
        self.target_embed = target_embed
        self.positional_encoding = positional_encoding
        self.multihead_attention = multihead_attention        
        self.masked_multihead_attention = masked_multihead_attention
        self.feed_forward = feed_forward
        self.encoder = encoder
        self.decoder = decoder
        self.projection_layer = projection_layer
        self.dropout = nn.Dropout(dropout_rate)
    
    # Encode 함수는 인코더 입력을 받아서 모든 인코더 블록 내에서 필요한 처리를 수행하고 인코더 출력을 제공합니다.
    def encode(self, encoder_input, encoder_mask):
        encoder_input = self.source_embed(encoder_input)
        encoder_input = self.positional_encoding(encoder_input)
        encoder_output = self.encoder(encoder_input, encoder_mask)
        return encoder_output

    # Decode 함수는 디코더 입력을 받아서 모든 디코더 블록 내에서 필요한 처리를 수행하고 디코더 출력을 제공합니다.
    def decode(self, decoder_input, decoder_mask, encoder_output, encoder_mask):
        decoder_input = self.target_embed(decoder_input)
        decoder_input = self.positional_encoding(decoder_input)
        decoder_output = self.decoder(decoder_input, decoder_mask, encoder_output, encoder_mask)
        return decoder_output

    # Projec 함수는 디코더 출력을 투영 레이어로 받아들이고 출력을 어휘로 매핑하여 예측합니다.
    def project(self, decoder_output):
        return self.projection_layer(decoder_output)

def build_model(source_vocab_size, target_vocab_size, max_seq_len=1135, d_model=512, d_ff=2048, num_heads=8, num_blocks=6, dropout_rate=0.1):
    
    # Transformer 아키텍처에 필요한 모든 매개변수 값을 정의하고 할당합니다.
    source_embed = EmbeddingLayer(source_vocab_size, d_model)
    target_embed = EmbeddingLayer(target_vocab_size, d_model)
    positional_encoding = PositionalEncoding(max_seq_len, d_model, dropout_rate)
    multihead_attention = MultiHeadAttention(d_model, num_heads, dropout_rate)
    masked_multihead_attention = MultiHeadAttention(d_model, num_heads, dropout_rate)
    feed_forward = FeedForward(d_model, d_ff, dropout_rate)    
    projection_layer = ProjectionLayer(target_vocab_size, d_model)
    encoder_block = EncoderBlock(multihead_attention, feed_forward, dropout_rate)
    decoder_block = DecoderBlock(masked_multihead_attention, multihead_attention, feed_forward, dropout_rate)

    encoderblocklist = []
    decoderblocklist = []

    for _ in range(num_blocks):
        encoderblocklist.append(encoder_block)   
         
    for _ in range(num_blocks):
        decoderblocklist.append(decoder_block)
    
    encoderblocklist = nn.ModuleList(encoderblocklist)            
    decoderblocklist = nn.ModuleList(decoderblocklist)
        
    encoder = Encoder(encoderblocklist)
    decoder = Decoder(decoderblocklist)
    
    # 모든 매개변수 값을 제공하여 Transformer 클래스를 인스턴스화합니다.
    model = Transformer(source_embed, target_embed, positional_encoding, multihead_attention, masked_multihead_attention, feed_forward, encoder, decoder, projection_layer, dropout_rate)

    for param in model.parameters():
        if param.dim() > 1:
            nn.init.xavier_uniform_(param)
    
    return model

# 마침내, build_model을 호출하고 model 변수에 할당합니다.
# 이 모델은 이제 데이터셋을 훈련하고 검증하는 데 완전히 준비된 상태입니다.
# 훈련 및 검증 후 이 모델을 사용하여 새로운 번역 작업을 수행할 수 있습니다.

model = build_model(source_vocab_size, target_vocab_size)
```

## 단계 10: 생성한 LLM 모델의 훈련 및 검증

지금은 모델을 훈련할 시간입니다. 훈련 프로세스는 매우 간단합니다. 우리는 단계 3에서 생성한 훈련 DataLoader를 사용할 것입니다. 총 훈련 데이터셋 수가 100만이므로 GPU 장치에서 모델을 훈련하는 것을 강력히 권장합니다. 20 epoch를 완료하는 데 약 5시간이 소요되었습니다. 각 epoch 이후에는 모델 가중치와 옵티마이저 상태를 저장하여 중지된 지점부터 훈련을 다시 시작하는 것이 더 쉽기 때문에 이전 지점에서 훈련을 재개하는 것보다 더 나을 것입니다.

매 에포크 이후에는 검증을 시작합니다. 검증 데이터셋 크기는 2000으로 매우 합리적입니다. 검증 프로세스 중에는 디코더 출력이 [SEP] 토큰을 받을 때까지 한 번만 인코더 출력을 계산하면 됩니다. 이것은 디코더가 [SEP] 토큰을 받기 전까지 동일한 인코더 출력을 계속 보내야 하기 때문입니다.

<div class="content-ad"></div>

디코더 입력은 먼저 문장 시작 토큰 [CLS]으로 시작됩니다. 각 예측 후에는 디코더 입력이 다음 생성된 토큰을 붙여넣을 것이며, 문장 끝 토큰 [SEP]에 도달할 때까지 이를 반복합니다. 마지막으로, 프로젝션 레이어는 출력을 해당 텍스트 표현으로 매핑합니다.

```js
def training_model(preload_epoch=None):   

    # 전체 훈련 및 검증 주기는 20번 실행됩니다.
    EPOCHS = 20
    initial_epoch = 0
    global_step = 0    
    
    # Adam은 현재 상태를 유지하고 계산된 기울기에 기반하여 매개변수를 업데이트하는 가장 일반적으로 사용되는 최적화 알고리즘 중 하나입니다.         
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    
    # preload_epoch가 None이 아닌 경우, 이는 최근 저장된 가중치, 최적화기로 훈련이 시작될 것을 의미합니다. 새로운 에포크 번호는 preload epoch + 1이 됩니다.
    if preload_epoch is not None:
        model_filename = f"./malaygpt/model_{preload_epoch}.pt"
        state = torch.load(model_filename)
        initial_epoch = state['epoch'] + 1
        optimizer.load_state_dict(state['optimizer_state_dict'])
        global_step = state['global_step']

    # CrossEntropyLoss 손실 함수는 프로젝션 출력과 대상 라벨 사이의 차이를 계산합니다.
    loss_fn = nn.CrossEntropyLoss(ignore_index = tokenizer_en.token_to_id("[PAD]"), label_smoothing=0.1).to(device)

    for epoch in range(initial_epoch, EPOCHS):

        # ::: 훈련 블록 시작 :::
        model.train()  
        
        # 훈련 데이터로더로 훈련을 진행합니다.     
        for batch in tqdm(train_dataloader):
            encoder_input = batch['encoder_input'].to(device)   # (batch_size, seq_len)
            decoder_input = batch['decoder_input'].to(device)    # (batch_size, seq_len)
            target_label = batch['target_label'].to(device)      # (batch_size, seq_len)
            encoder_mask = batch['encoder_mask'].to(device)       
            decoder_mask = batch['decoder_mask'].to(device)         

            encoder_output = model.encode(encoder_input, encoder_mask)
            decoder_output = model.decode(decoder_input, decoder_mask, encoder_output, encoder_mask)
            projection_output = model.project(decoder_output)

            # projection_output(batch_size, seq_len, vocab_size)
            loss = loss_fn(projection_output.view(-1, projection_output.shape[-1]), target_label.view(-1))
            
            # 역전파
            optimizer.zero_grad()
            loss.backward()

            # 가중치 업데이트
            optimizer.step()        
            global_step += 1

        print(f'Epoch [{epoch+1}/{EPOCHS}]: Train Loss: {loss.item():.2f}')
        
        # 각 에포크가 끝난 후 모델 상태를 저장합니다.
        model_filename = f"./malaygpt/model_{epoch}.pt"
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'global_step': global_step
        }, model_filename)        
        # ::: 훈련 블록 끝 :::

        # ::: 검증 블록 시작 :::
        model.eval()        
        with torch.inference_mode():
            for batch in tqdm(val_dataloader):                
                encoder_input = batch['encoder_input'].to(device)   # (batch_size, seq_len)                        
                encoder_mask = batch['encoder_mask'].to(device)
                source_text = batch['source_text']
                target_text = batch['target_text']
                
                # 소스 시퀀스에 대한 인코더 출력 계산
                encoder_output = model.encode(encoder_input, encoder_mask)

                # 예측 작업을 위해 디코더 입력으로 들어가는 첫 번째 토큰은 [CLS] 토큰입니다.
                decoder_input = torch.empty(1,1).fill_(tokenizer_my.token_to_id('[CLS]')).type_as(encoder_input).to(device)

                # [SEP] - 끝 토큰이 받아질 때까지 새로운 출력을 입력에 계속 추가해야 하므로, 이를 구현합니다.
                while True:                     
                    # 최대 길이를 받았는지 확인하고, 그렇다면 중지합니다.
                    if decoder_input.size(1) == max_seq_len:
                        break

                    # 새로운 출력이 추가될 때마다 새로 마스크를 만들어 다음 토큰 예측을 위해 디코더 입력에 추가합니다.
                    decoder_mask = causal_mask(decoder_input.size(1)).type_as(encoder_mask).to(device)

                    decoder_output = model.decode(decoder_input,decoder_mask,encoder_output,encoder_mask)
                    
                    # 프로젝션을 다음 토큰에만 적용합니다.
                    projection = model.project(decoder_output[:, -1])

                    # 가장 높은 확률을 갖는 토큰을 선택하여 탐욕 탐색 구현을 합니다.
                    _, new_token = torch.max(projection, dim=1)
                    new_token = torch.empty(1,1). type_as(encoder_input).fill_(new_token.item()).to(device)

                    # 새로운 토큰을 다시 디코더 입력에 추가합니다.
                    decoder_input = torch.cat([decoder_input, new_token], dim=1)

                    # 새로운 토큰이 종료 토큰인 경우, 받아들였다면 중지합니다.
                    if new_token == tokenizer_my.token_to_id('[SEP]'):
                        break

                # 전체로 추가된 디코더 입력을 디코더 출력으로 할당합니다.
                decoder_output = decoder_input.sequeeze(0)
                model_predicted_text = tokenizer_my.decode(decoder_output.detach().cpu.numpy())
                
                print(f'SOURCE TEXT": {source_text}')
                print(f'TARGET TEXT": {target_text}')
                print(f'PREDICTED TEXT": {model_predicted_text}')   
                # ::: 검증 블록 끝 :::             

# 이 함수는 20번의 에포크에 대해 훈련 및 검증을 실행합니다.
training_model(preload_epoch=None)
```

## 단계 11: 새 번역 작업을 현재 모델로 테스트하는 함수 생성

번역 기능에 일반적인 이름인 malaygpt를 할당합니다. 이는 사용자 입력 영어 원시 텍스트를 입력으로 받아 말레이어 언어로 번역된 텍스트를 출력합니다. 이 함수를 실행해 보겠습니다.

<div class="content-ad"></div>

```js
def malaygpt(user_input_text):
  model.eval()
  with torch.inference_mode():
    user_input_text = user_input_text.strip()
    user_input_text_encoded = torch.tensor(tokenizer_en.encode(user_input_text).ids, dtype=torch.int64).to(device)

    num_source_padding = max_seq_len - len(user_input_text_encoded) - 2
    encoder_padding = torch.tensor([PAD_ID] * num_source_padding, dtype=torch.int64).to(device)
    encoder_input = torch.cat([CLS_ID, user_input_text_encoded, SEP_ID, encoder_padding]).to(device)
    encoder_mask = (encoder_input != PAD_ID).unsqueeze(0).unsqueeze(0).int().to(device)

    # Computing the output of the encoder for the source sequence
    encoder_output = model.encode(encoder_input, encoder_mask)
    # for prediction task, the first token that goes in decoder input is the [CLS] token
    decoder_input = torch.empty(1, 1).fill_(tokenizer_my.token_to_id('[CLS]')).type_as(encoder_input).to(device)

    # since we need to keep adding the output back to the input until the [SEP] - end token is received.
    while True:
        # check if the max length is received
        if decoder_input.size(1) == max_seq_len:
            break
        # recreate mask each time the new output is added to the decoder input for the next token prediction
        decoder_mask = causal_mask(decoder_input.size(1)).type_as(encoder_mask).to(device)
        decoder_output = model.decode(decoder_input, decoder_mask, encoder_output, encoder_mask)

        # apply projection only to the next token
        projection = model.project(decoder_output[:, -1])

        # select the token with the highest probability which is a greedy search implementation
        _, new_token = torch.max(projection, dim=1)
        new_token = torch.empty(1, 1).type_as(encoder_input).fill_(new_token.item()).to(device)

        # add the new token back to the decoder input
        decoder_input = torch.cat([decoder_input, new_token], dim=1)

        # check if the new token is the end of the token
        if new_token == tokenizer_my.token_to_id('[SEP]'):
            break
    # the final decoder out is the concatenated decoder input until the end token
    decoder_output = decoder_input.squeeze(0)
    model_predicted_text = tokenizer_my.decode(decoder_output.detach().cpu.numpy())

    return model_predicted_text
```

Testing Time! Let’s do some translation testing.

![image](/assets/img/2024-06-19-BuildyourownLargeLanguageModelLLMFromScratchUsingPyTorch_8.png)

“The translation seems to be working pretty well.”

<div class="content-ad"></div>

여기까지입니다! 이제는 PyTorch를 사용하여 처음부터 Large Language Model을 만들 수 있을 것이라고 매우 자신합니다. 물론 이 모델을 다른 언어 데이터셋에서도 훈련시키고 해당 언어로 번역 작업을 수행할 수 있습니다. 이제 처음부터 transformer를 만드는 방법을 배웠으니, 이제 시장에서 사용 가능한 대부분의 LLM에 대한 학습 및 응용을 스스로 할 수 있다는 것을 확신할 수 있습니다.

그다음은 무엇일까요? 현재 시장에서 인기있는 오픈소스 LLM 모델 중 하나인 Llama 3 모델을 파인 튜닝하여 완전히 기능적인 애플리케이션을 만들 것입니다. 전체 소스 코드도 함께 공유할 예정입니다.

그러니 기대해 주시고, 읽어 주셔서 정말 감사합니다!

저와 연결해 보세요: https://www.linkedin.com/in/tamangmilan

<div class="content-ad"></div>

**Google Colab 노트북 링크**

**참고 자료**

- Attention Is All You Need — 논문, Ashish Vaswani, Noam Shazeer, 그리고 팀
- Attention in transformers, 시각적으로 설명된 내용, 3Blue1Brown — 유튜브
- GPT 구축하기, Andrej Karpathy, 유튜브
- https://github.com/hkproj/pytorch-transformer — Umar Jamil