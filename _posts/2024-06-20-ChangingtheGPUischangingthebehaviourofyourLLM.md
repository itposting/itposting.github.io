---
title: "LLM의 행동을 바꾸는 것은 GPU를 바꾸는 것입니다"
description: ""
coverImage: "/assets/img/2024-06-20-ChangingtheGPUischangingthebehaviourofyourLLM_0.png"
date: 2024-06-20 18:45
ogImage: 
  url: /assets/img/2024-06-20-ChangingtheGPUischangingthebehaviourofyourLLM_0.png
tag: Tech
originalTitle: "Changing the GPU is changing the behaviour of your LLM."
link: "https://medium.com/@anis.zakari/changing-the-gpu-is-changing-the-behaviour-of-your-llm-0e6dd8dfaaae"
---


<img src="/assets/img/2024-06-20-ChangingtheGPUischangingthebehaviourofyourLLM_0.png" />

대부분의 기술인들은 의존성의 다양한 버전이 다른 동작으로 이어질 수 있다는 것을 알고 있습니다. 그러나 대규모 언어 모델의 영역에서는 우리가 많은 계산을 필요로 하기 때문에 훈련과 추론 작업 양쪽에서 GPU에 크게 의존합니다. 그럼에도 불구하고 몇몇은 GPU를 변경하면 여러분의 LLM 출력에도 영향을 줄 수 있다는 것을 실제로 인식하고 있지 않습니다.

그래서 똑같은 환경을 만들려고 하고 계신가요?
의존성 버전을 설정할 수 있습니다.
도커화를 사용할 수 있습니다.
LLM 온도를 0으로 설정할 수 있습니다.
원하는 시드를 설정할 수 있습니다.
결국 여러분이 똑같은 GPU 모델을 사용하지 않았다면 이 모든 것이 작동하지 않을 것입니다.

본 기사에서는 차이점이 발생하는 위치와 그 이유를 보여주는 실험을 통해 이 현상을 강조하겠습니다.

<div class="content-ad"></div>

참고: 실험을 재현하거나 코드에 관심이 없다면 코드 스니펫을 건너 뛸 수 있습니다 (바로 "7. 두 개의 GPU에서 동일한 입력과 동일한 LLM에서 생성된 답변이 왜 다를까요?" 섹션으로 이동하여도 이해에 도움이 되는 결론을 얻을 수 있습니다.

# 1. 이 기사를 읽는 이유는?

어느 날, OpenAI와 Anthropic 모델이 설계상 결정론적이지 않은 이유에 대해 몇 분들과 토론하고 있었습니다. MoE (Mixture of Experts) 방식을 사용할 수 있어 토큰을 최적의 전문가에 경로 지정하지 못할 수도 있다고 설명했습니다. 왜냐하면 해당 전문가들이 다른 토큰 처리에 너무 바쁘기 때문에 이로 인해 일관성 없는 답변이 나오기도 합니다.

또 다른 요인은 OpenAI가 효율성을 위해 쿼리를 배치하는 것일 수 있습니다. 이러한 배치의 크기는 들어오는 쿼리의 양에 따라 달라질 수 있으며 GPU 계산 전략을 변경하여 다른 결과를 이끌어낼 수 있습니다.

<div class="content-ad"></div>

어떤 사람이 "다른 GPU도 서로 다른 결과로 이어질 수 있지 않을까요?" 라고 말하자 대화가 흥미로워졌어요.

생각해보세요... OpenAI API를 사용할 때, 여러분을 대신하여 계산을 실행하고 결과를 반환해주는 원격 기기가 있어요. 만약 그 기기가 항상 동일한 하드웨어에서 작동하지 않는다면, 결국 동일한 출력을 받지 못할 수도 있어요.

이를 염두에 두고 다른 고려 사항들이 발생할 수 있어요:

- 만약 제가 운영중인 LLM 앱을 다른 GPU를 가진 다른 인스턴스로 확장해야 한다면, 큰 문제가 될까요?
- 개발 환경에 사용된 GPU가 운영 환경과 다를 경우 어떻게 될까요?

<div class="content-ad"></div>

모든 이러한 질문들은 현상을 강조하고 그 영향이 얼마나 중요한지 확인하기 위해 실험을 설정하고 싶다는 생각을 들게 했어요.

## 2. 실험 설정하기

현상을 강조하기 위해 두 개의 동일한 환경을 설정하겠습니다. 그 환경들은 GPU만 다를 것입니다: 첫 번째는 Nvidia Tesla T4이고 두 번째는 Nvidia A10G일 것입니다. 그런 다음 Mistral-7b-v0.1을 사용하여 조금씩 실험을 해보겠습니다.

노트북에서 실험을 실행하기 위해 다음 단계를 따라주시면 됩니다.

<div class="content-ad"></div>

## 환경 설정하기

- CUDA 버전 설정하기.

```js
!pip uninstall torchvision torchtext torchaudio torch -y
!pip install torchvision==0.16.0 torch==2.1.0+cu121 -f https://download.pytorch.org/whl/torch_stable.html
```

2. Transformers 및 관련 모듈 버전 설정하기.

<div class="content-ad"></div>

```js
!pip3 어클리러레이트 비츠엔바이츠 트랜스포머 데이터셋을 각각 제거합니다.
!pip3 어클리러레이트==0.28.0 비츠엔바이츠==0.43.0 트랜스포머==4.39.3 데이터셋==2.18.0를 설치합니다.
```

3. 랜덤 시드 설정:

```js
# 시드 값을 설정하면 일관된, 재현 가능한 결과를 얻을 수 있습니다.
import random
import numpy as np
import torch
from transformers import set_seed

# 재현성을 위해 시드 설정
random_seed = 42
np_seed = 42
torch_seed = 42
transformers_seed = 42

random.seed(random_seed)
np.random.seed(np_seed)
torch.manual_seed(torch_seed)
set_seed(transformers_seed)
```

참고: transformers.set_seed만 설정해도 충분하지만 보다 안전하게 하기 위해 추가적으로 설정하였습니다.

<div class="content-ad"></div>

**참고 2:** 이 예시에서는 Python 3.10을 사용합니다.

## Mistral 불러오기

Hugging Face로부터 Mistral-7B-v0.1 모델을 불러오려면, 환경 변수 HF_TOKEN에 Hugging Face 토큰을 설정해야 합니다.
모델의 양자화된 버전을 사용할 것이며, 이는 계산의 정밀도를 줄여 GPU의 메모리 사용량을 줄이는 것을 의미합니다.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch
from time import time
import os

model_name = "mistralai/Mistral-7B-v0.1"
device = "cuda" # 모델을 불러올 장치

# 단순성을 위해 이렇게 유지하지만, Hugging Face 토큰은 .env 파일에 넣고, 'python-dotenv' 라이브러리의 load_dotenv 함수를 사용하여 불러오는 것이 좋습니다.
os.environ["HF_TOKEN"] = "<여기에 Hugging Face 토큰을 입력하세요>"

double_quant_config = BitsAndBytesConfig(
   load_in_4bit=True,
   bnb_4bit_use_double_quant=True,
   bnb_4bit_compute_dtype = "float16"
)

tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    padding_side="right",
    add_eos_token=False,
    add_bos_token=False,
    trust_remote_code=True,
)

model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=double_quant_config)
```

<div class="content-ad"></div>

## 트랜스포머 파이프라인 사용

우리는 트랜스포머 라이브러리의 pipeline을 사용하여 LLM(Large Language Model)에서 출력을 생성하는 것을 간단하게할 것입니다.

결정론적인 이유로, LLM의 어휘 중에서 가장 가능성 있는 토큰을 일관되게 예측하고 싶으므로, top_k=1 또는 0에 가까운 값으로 온도를 구성할 수 있습니다.

또한, 간편함을 위해 max_new_tokens 매개변수를 1로 설정하여 LLM이 우리의 프롬프트를 하나의 토큰으로 완료하도록 할 것입니다.

<div class="content-ad"></div>

```python
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    add_special_tokens=False,
    max_new_tokens=1,
    temperature=0.00000000001,
    repetition_penalty=1.4
)

sentence = "I enjoy walking in the"

response = pipe(sentence)[0]['generated_text']
print(response)

# >>> I enjoy walking in the woods
```

만약 LLM이 "I enjoy walking in the"라는 시퀀스에 대해 "woods"라는 한 단어만 출력하면, 올바른 결과를 돌려주었다고 볼 수 있습니다. 그럼 실험을 진행해도 좋을 것 같아요.

# 3. 실험 결과: T4 대 A10G

이 두 개의 GPU에 접근하기 위해, AWS SageMaker를 통해 ml.g4dn.xlarge (T4) 및 ml.g5.xlarge (A10G) 인스턴스를 론칭했습니다. 


<div class="content-ad"></div>

간단한 쿼리를 시도해 봅시다:

```js
# 프롬프트
매우 간결하게 질문에 대답하세요
질문: 대형 언어 모델의 특별한 점은 무엇인가요?
답변:
```

```js
prompt = "<s>[INST]매우 간결하게 질문에 대답하세요[/INST] \n질문: 대형 언어 모델의 특별한 점은 무엇인가요? \n답변:"
response = pipe(prompt)[0]['generated_text']
print(response)
```

T4와 A10G에서 얻은 답변이 같습니다:

<div class="content-ad"></div>

```js
질문: 대형 언어 모델에 대해 무엇이 특별한가요?
대답: 그들은 인간이 쓴 것처럼 보이는 텍스트를 생성할 수 있습니다. 이는 번역이나 텍스트 요약과 같은 여러 작업에 사용될 수 있음을 의미합니다(한 언어에서 다른 언어로 또는 반대로). 모델 자체는 교육 데이터가 필요하지 않지만 입력 문장을 기반으로 새로운 문장을 생성할 때 어떻게 동작해야 하는지 몇 가지 예시만 필요로 하므로 다른 모델들보다 훨씬 쉬워집니다. 더 이상 사전에 여러 데이터 세트를 사전에 가지고 있을 필요가 없다는 것을 의미합니다!

지금까지 좋습니다. 그러나 이것은 짧은 쿼리였습니다. RAG 사용 사례의 경우, 통상 수천 개의 토큰을 전송합니다. Hugging Face에서 호스팅되는 llama-2-arxiv-papers-chunked 데이터 세트를 사용하여 더 큰 쿼리로 테스트해 봅시다.

다음 코드에서는 데이터 세트의 인덱스 0, 4518, 4519 및 799에서 검색된 청크를 사용하여 RAG가 어떻게 작동하는지 모방할 것입니다. 청크 4518과 4519는 Llama 2에 대해 설명하지만 다른 청크는 아닙니다. 이 문맥을 사용하여 LLM이 이 질문에 대한 답변인 'Llama 2에 대해 무엇이 특별한가요?'을 예상합니다. 이 프롬프트는 약 1,400개의 토큰입니다.

```

<div class="content-ad"></div>

T4의 결과:

```js
Llama 2와 블룸 또는 친치아와 같은 대형 언어 모델 세부 튜닝 사이의 주요 차이점은 그들의 훈련 방법입니다. 이 두 가지 방법은 인터넷에서 스크랩된 데이터로 모델을 훈련하지만, Llama 2는 훈련 시 자체에서 생성된 텍스트만 사용하여 시스템에 편향이 외부 소스(소셜 미디어 게시물 등)로 인해 도입되는 가능성을 낮춥니다. 또한 이는 내부의 모든 것이 다른 실행에서도 일관되게 유지되므로 나온 결과물을 더 신뢰할 수 있게 합니다! 또한 각 단어 토큰이 문장 당 전역 점수 한 개가 아니라 개별 가중치 값을 ​​할당받기 때문에 특정 작업 시 사용자가 더 좋은 제어를 얻을 수 있어서 현재 경쟁하는 시스템들이 부족한 기능입니다. 마지막으로 중요한 것은, 비용이 비싼 하드웨어 리소스에 크게 의존하는 다른 시스템과 달리 스스로 업데이트해야 하는 시기가 예상보다 빠르지 않는 한 수개월마다 상수적으로 업데이트해야 하는 시스템 등...
```

A10G의 결과:

```js
Llama 2와 블룸 또는 친치아와 같은 대형 언어 모델 세부 튜닝 사이의 주요 차이점은 그들의 훈련 방법입니다. 이 두 가지 방법은 인터넷에서 스크랩된 데이터로 모델을 훈련하지만, Llama 2는 훈련 시 자체에서 생성된 텍스트만 사용하여 시스템에 편향이 외부 소스(소셜 미디어 게시물 등)로 인해 도입되는 가능성을 낮춥니다. 또한 이는 이 텍스트 내에서 다루는 주제에 대한 질문을 할 때 더 자신감을 갖도록 하기 때문에, 잠재적인 편향은 이미 사전에 제거되어 있을 것입니다! 또한 여기서 사용된 각 단어는 다른 단어 뒤에 직접 올기기 때문에 문장 내에 무작위 단어가 무작위로 삽입되는 것보다 오류가 적은 것을 의미하며, 전통적인 기계 학습 접근법들과 비교할 때 매 문장이 자체 내부에 일종의 오류 교정 메커니즘을 가져야 하는 경우가 적습니다. 마지막으로 중요한 것은, 어떤 유형의 질문이든 누군가 질문을 해도 중요하지 않습니다. 트위터 DM 메시지를 통해 친구나 가족 구성원 사이에 개인적으로 보낸 짧은 쿼리든, 손으로 종이에 수기로 쓴 장문의 글이나 나중에 디지털적으로 스캔된 문서든 내 무엇이 어떤 질문을 하든 언제든지 모든 것이 신뢰할 수 있게 된다는 사실 덕분에 하드의 모든 것이 AI 기술에 의해 일어나는 세계 밑바닥에서 발생하는 모든 것에 크게 기여합니다!!!
```

<div class="content-ad"></div>

참 흥미로운 내용이에요. 처음 보면 두 답변이 같은 내용으로 시작하기 때문에 눈에 띄지 않을 수 있어요. 하지만 "etc..." 다음에는 차이가 있어요.

T4 쪽에서는: "etc... 이는 내부의 모든 것이 다른 실행에서도 일관되게 유지되므로 출력에 더 신뢰를 할 수 있다는 것을 의미합니다!..."

A10G 쪽에서는: "etc... 이는 이 텍스트 내에서 다루는 주제에 관련된 질문을 할 때 더 자신감을 가질 수 있게 될 거에요..."

# 4. T4 Colab vs T4 SageMaker.

<div class="content-ad"></div>

동일한 GPU를 사용하는 두 환경이 동일한 결과를 낳는지 궁금한 분을 위해, 무료 버전의 Colab 노트북과 T4를 장착한 것이 특징인 ml.g4dn.xlarge (T4) SageMaker 노트북 인스턴스를 구동하여 테스트를 실시해 보았습니다. 결과는 실제로 동일함을 확인했습니다.

# 5. 왜 두 개의 GPU에서 동일한 입력과 동일한 LLM으로 생성되는 답변이 완전히 다른가요?

동일한 입력으로 생성되는 답변이 매우 다른 이유는 LLM의 자기회귀적인 성질 때문입니다. 다음 토큰은 이전 토큰에 의해 선택되므로, 아주작은 변경이 연쇄 반응을 일으켜 나비 효과를 초래합니다.

주어진 맥락을 기반으로 한 답변은 아니라는 점을 유의하세요. LLM은 지시에 완전히 따르지 않았지만, 그것은 중요하지 않습니다.

<div class="content-ad"></div>

LLM을 항상 가장 가능성 높은 토큰으로 선택하도록 설정했기 때문에, GPU 간에 확률을 계산하는 방법을 살펴볼 수 있습니다. 이러한 확률을 조사해 보겠습니다.

# 6. 확률 탐색

각 선택된 토큰의 확률을 인쇄하려면, 파이프라인을 우회하고 tokenizer와 model.generate 메소드를 직접 사용하여 출력_dict_in_generate=True 및 output_scores=True를 설정할 수 있습니다. 그런 다음 전이 점수를 확률로 계산, 정규화 및 변환할 수 있습니다.

```js
inputs = tokenizer([prompt], return_tensors="pt")

outputs = model.generate(**inputs, max_new_tokens=300, temperature=0.00000000001, repetition_penalty=1.4, return_dict_in_generate=True, output_scores=True)
transition_scores = model.compute_transition_scores(
    outputs.sequences, outputs.scores, normalize_logits=True
)

input_length = inputs.input_ids.shape[1]
generated_tokens = outputs.sequences[:, input_length:]
for tok, score in zip(generated_tokens[0], transition_scores[0]):
    // | 토큰 | 토큰 문자열  | 확률
    print(f"| {tok:5d} | {tokenizer.decode(tok):8s} | {np.exp(score.numpy()):.2}")
```

<div class="content-ad"></div>

위의 코드는 각 토큰의 ID, 디코딩된 토큰 및 확률을 출력할 것입니다. 출력의 전체 내용이 상당히 길기 때문에 중요한 부분만 포함하겠습니다.

T4 출력:

```js
# T4
토큰 ID | 토큰 문자열 | 확률
----------------------------------
...
|  4345 | etc       | 35.28%
|   568 | ..        | 44.56%
|   851 | This      | 36.57%
|   835 | also      | 30.27%
|  2825 | means     | 38.98%
|   368 | you       | 24.24%
|   541 | can       | 46.44%
|  4893 | trust     | 18.74%
|   767 | what      | 29.62%
|  3435 | comes     | 44.17%
|   575 | out       | 40.51%
...
```

A10G 출력:

<div class="content-ad"></div>

```js
# A10G 
토큰 id| 토큰 문자열 | 확률
----------------------------------
...
| 4345 | 등등      | 35.48%
| 568  | ..        | 44.38%
| 851  | 이것      | 36.40%
| 835  | 또한      | 30.22%
| 2825 | 의미       | 39.42%
| 368  | 당신       | 24.29%
| 541  | 할 수 있다 | 46.42%
| 347  | 되다      | 18.62%
| 680  | 더        | 49.45%
| 10689| 자신감      | 57.50%
...
```

오케이, 이제 흥미로워지고 있네요. T4와 A10G의 확률이 정확히 일치하지 않습니다. 보통 이것은 토큰 순위에 영향을 미치지 않습니다(생성된 시퀀스에서 아무것도 알아차리지 못할 것입니다), 하지만 때로는 그렇지 않을 수도 있습니다.

예를 들어, T4에서 "신뢰"는 18.74%의 확률을 가지고 있지만, A10G에서는 "되다"가 18.62%로 선호됩니다. 이 시점부터 LLM의 자기회귀적 성질로 인해 생성이 분기될 것입니다.

참고: LLM의 양자화는 계산 정밀도를 줄이기 때문에 이러한 차이가 더 자주 발생합니다.

<div class="content-ad"></div>

당신에게 한 가지 합리적인 질문은 "GPU에 따라 계산이 왜 다를까요?"입니다.

## 7. GPU에 따라 계산이 다르게 나타나는 이유는 무엇인가요?

저는 CUDA 전문가는 아니지만 연구를 했습니다. GPU 간의 차이는 여러 요인과 관련이 있습니다:

병렬 계산 처리:
GPU는 병렬로 많은 계산을 효율적으로 처리하는 데 관심이 있습니다. 그러나 서로 다른 GPU는 병렬 작업을 처리하는 방식에 차이가 있을 수 있으며, 이는 연산 순서와 메모리 접근에 영향을 줄 수 있습니다.

<div class="content-ad"></div>

이것은 중요합니다. 프로그래밍에서 크기가 크게 다른 숫자를 더하는 것조차 연관성이 없을 수 있기 때문입니다. 이는 정교한 계산에서 정확도에 영향을 줄 수 있습니다. 비연관성은 다음과 같은 경우에 발생합니다.

(a + b) + c ≠ a + (b + c).

![이미지](/assets/img/2024-06-20-ChangingtheGPUischangingthebehaviourofyourLLM_1.png)

그래서 이러한 계산은 분할되어 독립적으로 처리되고, 그 후 비연관적으로 결합됩니다. 결과적으로, 이러한 부분들이 다시 결합되는 방식이 최종 결과에 영향을 줍니다.

<div class="content-ad"></div>

다음은 연관되지 않은 계산의 간단한 예시입니다:

```js
import torch
# 크기 차이가 큰 bfloat16 형식의 세 개의 부동 소수점 수를 정의합니다.
a = torch.tensor(1e10, dtype=torch.bfloat16)
b = torch.tensor(-1e10, dtype=torch.bfloat16)
c = torch.tensor(1.0, dtype=torch.bfloat16)

# 서로 다른 순서로 합을 계산합니다.
sum1 = (a + b) + c
sum2 = a + (b + c)
# 계산 결과를 bfloat16로 출력합니다.
print(f"(a + b) + c in bfloat16: {sum1}")
# >>> 1.0
print(f"a + (b + c) in bfloat16: {sum2}")
# >>> 0.0
```

LLM을 사용하면 수백만 개의 계산이 소수점 오차로 인해 발산할 수 있으며, 이는 시퀀스 생성 중 단어 선택에 영향을 미칠 수 있습니다.

하드웨어 아키텍처:
Nvidia Tesla T4 및 Nvidia A10G와 같은 다양한 GPU 모델은 다른 하드웨어 아키텍처를 가지고 있습니다. 이러한 아키텍처는 병렬 처리 능력, 메모리 대역폭 및 계산 유닛과 같은 성능의 다양한 측면을 최적화하기 위해 설계되었습니다.

<div class="content-ad"></div>

예를 들어, T4는 Turing 아키텍처를 사용하는 반면 A10G는 Ampere 아키텍처를 기반으로 합니다.

다른 아키텍처는 부동 소수점 산술, 메모리 액세스 패턴 및 기타 저수준 작업에 대한 다른 구현을 의미합니다. 이러한 구현의 미묘한 차이도 계산 결과의 차이를 초래할 수 있습니다.

예를 들어, 높은 정밀도에 최적화된 아키텍처는 속도에 최적화된 아키텍처와 비교하여 동일한 부동 소수점 작업을 수행하더라도 다른 결과를 제공할 수 있습니다.

양자화 효과:
모델을 양자화하면 메모리 및 계산 리소스를 저장하기 위해 정밀도를 줄이지만 추가적인 오류 소스를 도입합니다. 이러한 오류의 영향은 GPU가 낮은 정밀도 산술을 처리하는 방식에 따라 다를 수 있습니다.

<div class="content-ad"></div>

양자화는 숫자를 근사화하는 과정이 포함되어 있기 때문에 다양한 GPU가 이러한 근사화를 다르게 처리할 수 있으며, 토큰 예측의 확률에 변화를 일으킬 수 있습니다.

## 8. 여러 GPU를 사용하여 LLM을 수평적으로 확장하는 것에 대해 걱정해야 할까요?

그 질문 정말 훌륭한 질문이네요, 질문해 주셔서 감사합니다! :)
동일한 GPU의 여러 인스턴스를 추가하는 경우(예: A10G GPU 1대에서 4개의 A10G GPU가 포함된 인스턴스로 확장) 걱정해야 할 필요가 있을까요?

여러 GPU를 사용하여 추론 작업에 접근하는 여러 전략이 있습니다:

<div class="content-ad"></div>

모델이 하나의 GPU에 맞는 경우 첫 번째 전략은 각 GPU에 모델 사본을 로드하는 것입니다. 예를 들어, pipeline으로 네 개의 쿼리 목록을 보내면 각 쿼리가 다른 GPU에서 처리될 수 있습니다. 이렇게 하면 한 GPU만 사용하는 것과 같은 결과를 볼 수 있지만 처리량이 향상됩니다.

두 번째 전략은 모델이 하나의 GPU에 맞지 않는 경우 일반적으로 사용되며, 이는 샤딩(sharding)으로 그 모델의 가중치를 GPU들 간에 분산하는 것입니다. 이론적으로는 연산 분배와 실행 차이로 인한 변화가 발생할 수 있지만, 실제로는 적어도 제가 한 테스트에서는 샤딩 사용 시 단일 GPU에서의 시퀀스와 확률과 동일한 결과를 얻었습니다. 파이토치는 결정론적 연산을 위해 노력한다고 생각됩니다.

# 결론:

다른 GPU를 사용하면 동일한 환경, 설정 및 시드를 사용해도 LLM이 서로 다른 결과를 출력할 수 있음을 보여줬습니다. 이러한 변동성은 보다 긴 프롬프트에서 더 많은 계산이 필요하기 때문에 증가하며, 부정확성의 전파가 증가하고 두 GPU 간의 차이가 완화됩니다. 게다가 양자화를 사용할 경우 이 효과가 더 두드러집니다.

<div class="content-ad"></div>

결과가 항상 재앙적인 것은 아니라는 것을 말하고 싶은 게 아니에요, 하지만 LLM 배포 시 고려해야 할 사항이에요.

만약 제품에서 사용하는 GPU와 다른 GPU로 개발한다면, 성능이 적절한지 확인하기 위한 테스트를 설정해주세요. 또한, 다른 GPU가 장착된 새로운 인스턴스에 LLM을 확장할 계획이 있다면 이 역시 중요해요.

끝까지 읽으셨다면, 축하드려요! 이 게시물을 즐겨주셨으면 좋겠어요. 제가 Medium에서 처음으로 쓴 글이라서요. 재미있게 보셨다면 더 많이 쓰도록 격려해 주시기를 바라요. 댓글에서 의견을 자유롭게 공유해주세요.