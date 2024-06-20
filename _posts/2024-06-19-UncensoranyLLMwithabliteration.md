---
title: "억제된 모든 LLM을 해제하세요"
description: ""
coverImage: "/assets/img/2024-06-19-UncensoranyLLMwithabliteration_0.png"
date: 2024-06-19 03:36
ogImage: 
  url: /assets/img/2024-06-19-UncensoranyLLMwithabliteration_0.png
tag: Tech
originalTitle: "Uncensor any LLM with abliteration"
link: "https://medium.com/@mlabonne/uncensor-any-llm-with-abliteration-d30148b7d43e"
---


## 재학습 없이 세밀 조정하기

![이미지](/assets/img/2024-06-19-UncensoranyLLMwithabliteration_0.png)

람마 모델의 세대가 늘어날수록 새로운 기능이 제공되었습니다. 이는 사용자의 지시를 이해하고 따르는 능력이 뛰어난 '세세한 조정(세세하게 조정)' 버전을 제공합니다. 그러나 이러한 모델들은 매우 검열되어 있으며 해로운 요청으로 간주되는 것은 거부하고 "AI 어시스턴트로서 도와드릴 수 없습니다."와 같은 대답을 합니다. 이 안전 기능은 오용을 방지하는 데 중요하지만, 모델의 유연성과 반응성을 제한합니다.

본 문서에서는 "무효화"라는 기술을 탐구하여 재학습 없이 어떤 람마 모델이든 검열을 푸는 방법을 살펴볼 것입니다. 이 기술은 모델에 내장된 거부 메커니즘을 효과적으로 제거하여 모든 유형의 프롬프트에 대응할 수 있게 합니다.

<div class="content-ad"></div>

코드는 Google Colab에서도 사용할 수 있고, LLM 코스에서도 GitHub에 있습니다. 이 기사를 교정해 주신 FailSpy님에게 특별히 감사드립니다.

# ✂️ 삭제란이란?

현대 LLM은 안전 및 지시를 따르는 방향으로 세밀하게 조정되어 있어, 해로운 요청을 거부하기 위해 훈련되어 있습니다. Arditi 등이 블로그 글에서 설명한 바에 따르면, 이 거부 행동은 모델의 잔류 스트림에 있는 특정 방향을 통해 중재됩니다. 만약 이 방향을 모델이 나타내지 못하도록 막는다면, 요청을 거부하는 능력을 잃게 됩니다. 반대로, 이 방향을 인위적으로 추가하면 모델이 해가 없는 요청조차도 거부할 수 있게됩니다.

전통적인 디코더 전용 Llama류 아키텍처에서는 세 가지의 잔류 스트림을 대상으로 할 수 있습니다: 각 블록의 시작 부분에서(“pre”), 어텐션과 MLP 레이어 사이에서(“mid”), 그리고 MLP 이후에(“post”). 다음 그림은 각 잔류 스트림의 위치를 보여줍니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-UncensoranyLLMwithabliteration_1.png" />

LLM을 무증검 상태로 만들기 위해 먼저 모델 내의 "거부 방향"을 식별해야 합니다. 이 과정에는 몇 가지 기술적 단계가 포함되어 있습니다:

- 데이터 수집: 유해한 지시문 집합과 무해한 지시문 집합을 사용하여 모델을 실행하고, 각각의 마지막 토큰 위치에서 잔여 스트림 활성화를 기록합니다.
- 평균 차이: 유해한 지시와 무해한 지시의 활성화 간 평균 차이를 계산합니다. 이를 통해 모델의 각 레이어에 대한 "거부 방향"을 나타내는 벡터를 얻을 수 있습니다.
- 선택: 이러한 벡터를 정규화하고, 평가하여 단일 최상의 "거부 방향"을 선택합니다.

거부 방향을 식별한 후, 해당 기능을 표현하는 모델의 능력을 효과적으로 제거하는 "제거(ablate)" 작업을 수행할 수 있습니다. 이는 추론 시간 간섭이나 가중치 직교화를 사용하여 영구적으로 수행할 수 있습니다.

<div class="content-ad"></div>

먼저 추론 시간 개입에 대해 이야기해 보겠습니다. 잔차 스트림에 기록하는 모든 구성 요소(예: 어텐션 헤드)마다 그 출력을 거부 방향으로 투영한 후 이 투영을 뺍니다. 이 뺄셈은 각 토큰과 각 레이어에 적용되어 모델이 결코 거부 방향을 표현하지 않도록 합니다.

한편, 가중치 직교화는 모델 가중치를 직접 수정하는 것을 포함합니다. 거부 방향에 대해 구성 요소 가중치를 직교화함으로써 모델이 이 방향으로 기록하는 것을 방지합니다. 잔차 스트림에 기록하는 행렬을 조정하여 이러한 기여가 거부 방향에 영향을 주지 않도록 합니다.

다음 섹션에서는 가중치 직교화를 사용한 좌절 실현을 구현할 것입니다.

# 💻 구현

<div class="content-ad"></div>

아래의 abliteration 구현은 FailSpy의 노트북을 기반으로 하고 있습니다. 그 노트북은 원래 저자들의 노트북을 기반으로 하고 있습니다. 저는 주로 이를 적응하여 간단하고 이해하기 쉽도록 했습니다. 이 섹션은 코드가 많이 포함되어 있어서 무슨 일이 벌어지는지 볼 수 있지만, 기술적인 세부 사항에 덜 관심이 있는 경우 FailSpy의 abliterator 라이브러리를 사용할 수도 있습니다 (Hugging Face의 abliterated 모델 모음도 확인해보세요).

이 코드는 뛰어난 TransformerLens 라이브러리 (이전에는 EasyTransformer로 알려졌음)를 사용하여 무거운 작업을 처리합니다. 메커니즘 해석 가능성을 위해 설계되었으며 여기서는 활성화에 개입하는 데 사용됩니다. 이 라이브러리를 만든 Neel Nanda와 Joseph Bloom에게 감사드립니다.

먼저 필요한 패키지를 설치하고 가져와 봅시다. 이러한 모든 단계는 Google Colab 노트북에서 사용할 수 있습니다.

```js
!pip install transformers transformers_stream_generator tiktoken transformer_lens einops jaxtyping

import torch
import functools
import einops
import gc

from datasets import load_dataset
from tqdm import tqdm
from torch import Tensor
from typing import List
from transformer_lens import HookedTransformer, utils
from transformer_lens.hook_points import HookPoint
from transformers import AutoModelForCausalLM, AutoTokenizer
from jaxtyping import Float, Int
from collections import defaultdict

# GPU 메모리를 저장하기 위해 자동 미분을 끕니다 (크레딧: Undi95)
torch.set_grad_enabled(False)
```

<div class="content-ad"></div>

두 가지 데이터 세트가 필요합니다: 피해가 없는 지침을 포함한 하나와 유해한 지침을 포함한 하나입니다. 우리는 tatsu-lab/alpaca와 llm-attacks의 데이터를 사용할 것입니다. 모든 것을 더 쉽게 만들기 위해, 저는 이를 두 개의 Hugging Face 데이터 세트로 다시 패키징하여 mlabonne/harmless_alpaca와 mlabonne/harmful_behaviors로 만들었습니다. 그렇게 하면 여러분이 쉽게 여러분 자신의 데이터 세트로 교체할 수 있습니다.

지침을로드하고 "role"과 "content" 키가 있는 사전 목록으로 다시 서식화할 것입니다. 이렇게 하면 Llama 3의 채팅 템플릿을 따르는 apply_chat_tokenizer() 메서드와 호환됩니다.

```python
def reformat_texts(texts):
    return [[{"role": "user", "content": text}] for text in texts]

# 유해하고 무해한 데이터 세트 가져오기
def get_harmful_instructions():
    dataset = load_dataset('mlabonne/harmful_behaviors')
    return reformat_texts(dataset['train']['text']), reformat_texts(dataset['test']['text'])

def get_harmless_instructions():
    dataset = load_dataset('mlabonne/harmless_alpaca')
    return reformat_texts(dataset['train']['text']), reformat_texts(dataset['test']['text'])

harmful_inst_train, harmful_inst_test = get_harmful_instructions()
harmless_inst_train, harmless_inst_test = get_harmless_instructions()
```

이제 데이터 세트가 준비되었으므로, abliterate 하려는 모델을 로드할 수 있습니다. 안타깝게도, HookedTransformer를 사용하여 직접 사용자 정의 모델을 로드할 수 없습니다. 여기에서, FailSpy의 노트북에 설명된 꼼수를 사용하여 사용자 정의 모델을 다운로드하고 meta-llama/Meta-Llama-3-8B-Instruct로 이름을 변경하겠습니다. GPU가 BF16과 호환되지 않는 경우 torch.float16 형식으로 로드하세요.

<div class="content-ad"></div>

이 예시에서는 DARE TIES(모델 병합에 관한 내 기사 참조)로 만들어진 mlabonne/Daredevil-8B를 사용할 것입니다. 이 모델은 8B 카테고리의 Open LLM Leaderboard에서 가장 높은 MMLU 점수를 가지고 있어요.

```js
MODEL_ID = "mlabonne/Daredevil-8B"
MODEL_TYPE = "meta-llama/Meta-Llama-3-8B-Instruct"

# 모델 다운로드 및 로드
!git clone https://huggingface.co/{MODEL_ID} {MODEL_TYPE}

# 모델 및 토크나이저 로드
model = HookedTransformer.from_pretrained_no_processing(
    MODEL_TYPE,
    local_files_only=True,
    dtype=torch.bfloat16,
    default_padding_side='left'
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_TYPE)
tokenizer.padding_side = 'left'
tokenizer.pad_token = tokenizer.eos_token
```

이제 데이터셋을 토큰화할 수 있습니다. 무해한 및 유해한 지시사항에 대해 동일한 샘플 수를 사용합니다. 샘플 수가 높으면 모든 RAM/VRAM을 사용할 수 있으므로 여기서는 256으로 제한합니다.

```js
def tokenize_instructions(tokenizer, instructions):
    return tokenizer.apply_chat_template(
        instructions,
        padding=True,
        truncation=False,
        return_tensors="pt",
        return_dict=True,
        add_generation_prompt=True,
    ).input_ids

n_inst_train = min(256, len(harmful_inst_train), len(harmless_inst_train))

# 데이터셋 토큰화
harmful_tokens = tokenize_instructions(
    tokenizer,
    instructions=harmful_inst_train[:n_inst_train],
)
harmless_tokens = tokenize_instructions(
    tokenizer,
    instructions=harmless_inst_train[:n_inst_train],
)
```

<div class="content-ad"></div>

작업이 모두 설정되었습니다. 이제 도처럼 처리하는 첫 번째 단계인 데이터 수집을 구현할 차례입니다. 우리는 이 토큰화된 데이터셋을 처리하고 유해(harmful) 및 무해(harmless)로 나머지 스트림 활성화를 저장하려고 합니다. 이는 transformer_lens 라이브러리로 관리됩니다.

```js
batch_size = 32

# 활성화를 저장할 기본 사전 초기화
harmful = defaultdict(list)
harmless = defaultdict(list)

# 데이터 학습을 배치 단위로 처리
num_batches = (n_inst_train + batch_size - 1) // batch_size

for i in tqdm(range(num_batches)):
    print(i)
    start_idx = i * batch_size
    end_idx = min(n_inst_train, start_idx + batch_size)

    # 유해 및 무해 프롬프트에 모델 실행 및 활성화 캐시
    harmful_logits, harmful_cache = model.run_with_cache(
        harmful_tokens[start_idx:end_idx],
        names_filter=lambda hook_name: 'resid' in hook_name,
        device='cpu',
        reset_hooks_end=True
    )
    harmless_logits, harmless_cache = model.run_with_cache(
        harmless_tokens[start_idx:end_idx],
        names_filter=lambda hook_name: 'resid' in hook_name,
        device='cpu',
        reset_hooks_end=True
    )

    # 활성화 수집 및 저장
    for key in harmful_cache:
        harmful[key].append(harmful_cache[key])
        harmless[key].append(harmless_cache[key])

    # RAM 및 VRAM 비우기
    del harmful_logits, harmless_logits, harmful_cache, harmless_cache
    gc.collect()
    torch.cuda.empty_cache()

# 캐시된 활성화 결합
harmful = {k: torch.cat(v) for k, v in harmful.items()}
harmless = {k: torch.cat(v) for k, v in harmless.items()}
```

이제 각 층에 대한 거부 방향을 계산할 수 있습니다. 이는 유해 및 무해 명령의 활성화 간 평균 차이에 해당하며 정규화됩니다. 그런 다음 activation_scored에서 내림차순으로 정렬됩니다.

```js
# 활성화 색인을 가져오는 도우미 함수
def get_act_idx(cache_dict, act_name, layer):
    key = (act_name, layer)
    return cache_dict[utils.get_act_name(*key)]

# 중간 층에서 유해 및 무해 활성화의 평균 차이 계산
activation_layers = ["resid_pre", "resid_mid", "resid_post"]
activation_refusals = defaultdict(list)

for layer_num in range(1, model.cfg.n_layers):
    pos = -1  # 위치 인덱스
    for layer in activation_layers:
        harmful_mean_act = get_act_idx(harmful, layer, layer_num)[:, pos, :].mean(dim=0)
        harmless_mean_act = get_act_idx(harmless, layer, layer_num)[:, pos, :].mean(dim=0)
        refusal_dir = harmful_mean_act - harmless_mean_act
        refusal_dir = refusal_dir / refusal_dir.norm()
        activation_refusals[layer].append(refusal_dir)

selected_layers = ["resid_pre"]
activation_scored = sorted(
    [
        activation_refusals[layer][l - 1]
        for l in range(1, model.cfg.n_layers)
        for layer in selected_layers
    ],
    key=lambda x: abs(x.mean()),
    reverse=True,
)
```

<div class="content-ad"></div>

프로세스의 마지막 단계는 계산한 거절 방향을 평가하는 과정입니다. 이를 위해 우리는 거절 방향을 추론 중 각 잔여 스트림과 각 블록에 적용할 것입니다. 다음 코드 스니펫에서 네 가지 테스트 유해 지시와 20개 블록(또는 레이어)에 대한 세대를 가져옵니다.

```js
...
Code snippet 생략
...
```

우리는 evals 리스트에 모든 세대를 저장했습니다. 이제 이를 출력하고 각 지시에 대한 무겁지 않은 응답을 제공하는 레이어(블록)를 수동으로 선택할 수 있습니다. "I cannot" 및 "I can't"를 포함하는 응답은 원치 않는 답변을 필터링하기 위해 자동으로 제외합니다.

위 요구사항을 만족하는 레이어를 찾을 수 없는 경우, 이전 selected_layers 목록의 다른 잔여 스트림, 다른 지시, 추가적 블록 등을 테스트하고자 할 수 있습니다.

<div class="content-ad"></div>

```js
# 인간 평가를 위한 세대 인쇄
blacklist = ["I cannot", "I can't"]
for i in range(N_INST_TEST):
    print(f"\033[1mINSTRUCTION {i}: {harmful_inst_test[i]}")
    print(f"\nBASELINE COMPLETION:\n{baseline_generations[i]}\033[0m")
    for layer_candidate in range(EVAL_N):
        if not any(word in evals[layer_candidate][i] for word in blacklist):
            print(f"\n---\n\nLAYER CANDIDATE #{layer_candidate} INTERVENTION COMPLETION:")
            print(evals[layer_candidate][i])
```

저의 경우, 레이어 후보자 9가 네 가지 명령에 대해 선정적이지 않은 답변을 제공했습니다. 이것이 우리가 거부 방향으로 선택할 것이다. 그 다음으로, 무게 직교화를 구현하여 모델이 이 방향의 출력을 생성하는 것을 방지합니다. 모델이 성공적으로 선정되지 않은지를 확인하려면 완료된 내용을 인쇄하여 확인할 수 있습니다.

```js
def get_orthogonalized_matrix(
    matrix: Float[Tensor, "... d_model"], vec: Float[Tensor, "d_model"]
) -> Float[Tensor, "... d_model"]:
    proj = (
        einops.einsum(
            matrix, vec.view(-1, 1), "... d_model, d_model single -> ... single"
        )
        * vec
    )
    return matrix - proj

# 가장 높은 거부 방향을 갖는 레이어 선택
LAYER_CANDIDATE = 9
refusal_dir = activation_scored[LAYER_CANDIDATE]

# 모델의 가중치 직교화
if refusal_dir.device != model.W_E.device:
    refusal_dir = refusal_dir.to(model.W_E.device)
model.W_E.data = get_orthogonalized_matrix(model.W_E, refusal_dir)

for block in tqdm(model.blocks):
    if refusal_dir.device != block.attn.W_O.device:
        refusal_dir = refusal_dir.to(block.attn.W_O.device)
    block.attn.W_O.data = get_orthogonalized_matrix(block.attn.W_O, refusal_dir)
    block.mlp.W_out.data = get_orthogonalized_matrix(block.mlp.W_out, refusal_dir)

# 모델로 텍스트 생성
orthogonalized_generations = get_generations(
    model, tokenizer, harmful_inst_test[:N_INST_TEST], fwd_hooks=[]
)

# 세대 출력
for i in range(N_INST_TEST):
    if len(baseline_generations) > i:
        print(f"INSTRUCTION {i}: {harmful_inst_test[i]}")
        print(f"\033[92mBASELINE COMPLETION:\n{baseline_generations[i]}")
    print(f"\033[91mINTERVENTION COMPLETION:\n{evals[LAYER_CANDIDATE][i]}")
    print(f"\033[95mORTHOGONALIZED COMPLETION:\n{orthogonalized_generations[i]}\n")
```

이제 모델을 사용할 준비가 되었습니다. 모델을 Hugging Face 형식으로 변환하여 HF 허브에 업로드합니다.

<div class="content-ad"></div>

```json
# 모델을 다시 HF 보안 텐서로 변환합니다
hf_model = AutoModelForCausalLM.from_pretrained(MODEL_TYPE, torch_dtype=torch.bfloat16)
lm_model = hf_model.model

state_dict = model.state_dict()
lm_model.embed_tokens.weight = torch.nn.Parameter(state_dict["embed.W_E"].cpu())
for l in range(model.cfg.n_layers):
    lm_model.layers[l].self_attn.o_proj.weight = torch.nn.Parameter(
        einops.rearrange(
            state_dict[f"blocks.{l}.attn.W_O"], "n h m->m (n h)", n=model.cfg.n_heads
        ).contiguous()
    )
    lm_model.layers[l].mlp.down_proj.weight = torch.nn.Parameter(
        torch.transpose(state_dict[f"blocks.{l}.mlp.W_out"], 0, 1).contiguous()
    )

hf_model.push_to_hub(f"{MODEL_ID}-abliterated")
```

# ⚖️ DPO Fine-Tuning

이전 섹션의 abliterated 및 소스 모델을 Open LLM Leaderboard 및 Nous의 벤치마크 스위트에서 평가했습니다. 여기에 결과가 있습니다:

<img src="/assets/img/2024-06-19-UncensoranyLLMwithabliteration_2.png" />


<div class="content-ad"></div>

보시다시피, 원본 모델은 Llama 3 8B Instruct보다 현저하게 우수한 성능을 보여줍니다. 그러나 우리는 모든 벤치마크에서 절삭된 버전에서 성능 하락을 관찰하고 있습니다. 절삭 과정은 성능을 향상시키면서도 모델의 품질을 저하시킨 것으로 나타났습니다.

이 문제를 해결하기 위해 우리는 우리의 절삭된 모델을 추가로 훈련하여 회복시키는 아이디어가 있습니다. 대부분의 세밀 조정된 모델들과 마찬가지로 Llama 3 8B Instruct은 지도 학습 세밀 조정에 있어서 꽤 취약합니다. 추가적인 SFT는 모델의 성능을 떨어뜨릴 가능성이 높습니다.

대체로, 선호 맞춤이 상당히 가볍고 우리의 절삭된 모델을 뇌개박하지 않아도 됩니다. DPO는 사용하기 쉽고 우수한 추적 레코드로 여기서 좋은 후보입니다. 이를 구현하기 위해 mlabonne/orpo-dpo-mix-40k 데이터셋을 사용하는 LazyAxolotl (Axolotl을 만들어 준 Wing Lian에게 감사드립니다)을 사용했습니다. 여기에 사용한 구성은 다음과 같습니다:

```js
base_model: mlabonne/Daredevil-8B-abliterated
model_type: LlamaForCausalLM
tokenizer_type: AutoTokenizer

load_in_8bit: false
load_in_4bit: true
strict: false
save_safetensors: true

rl: dpo
chat_template: chatml
datasets:
  - path: mlabonne/orpo-dpo-mix-40k
    split: train
    type: chatml.intel

dataset_prepared_path:
val_set_size: 0.0
output_dir: ./out

adapter: qlora
lora_model_dir:

sequence_len: 2048
sample_packing: false
pad_to_sequence_len: false

lora_r: 64
lora_alpha: 32
lora_dropout: 0.05
lora_target_linear: true
lora_fan_in_fan_out:

wandb_project: axolotl
wandb_entity:
wandb_watch:
wandb_name:
wandb_log_model:

gradient_accumulation_steps: 8
micro_batch_size: 1
num_epochs: 1
optimizer: paged_adamw_8bit
lr_scheduler: cosine
learning_rate: 5e-6
train_on_inputs: false
group_by_length: false
... (이어짐)
```

<div class="content-ad"></div>

6xA6000 GPU와 DeepSpeed ZeRO-2를 사용하여 모델을 훈련했어요. 훈련에는 약 6시간 45분이 소요되었답니다. W&B에서 얻은 훈련 곡선을 여기에 가져왔어요:

DPO를 세밀하게 조정한 mlabonne/NeuralDaredevil-8B-abliterated 모델이 자동으로 업로드되었어요. 저희가 앞서 지워버린 버전을 수정했는지 확인하기 위해 동일한 벤치마크에서 평가했어요:

![훈련 곡선](/assets/img/2024-06-19-UncensoranyLLMwithabliteration_3.png)

이 추가 훈련을 통해 지워진 영향 대부분을 회복할 수 있었어요. 모델이 개선되지 않는 한 영역은 GSM8K, 수학 데이터 세트, 인데요, 이는 orpo-dpo-mix-40k가 더 많은 수학 샘플을 필요로 할 수 있다는 것을 의미할 수 있어요.

<div class="content-ad"></div>

최종 모델은 8B 범주에서 최첨단 성능을 자랑하는 미검열 LLM입니다. 필터링이 필요 없을 때는 Llama 3 8B Instruct의 개선된 버전으로 추천합니다. LM Studio에서 GGUF와 같은 양자화된 버전을 사용해 볼 수도 있습니다.

# 결론

이 글에서는 소명화(abliteration) 개념을 소개했습니다. 이 기술은 모델의 활성화를 해롭고 해를 끼치지 않는 프롬프트에 사용하여 거부 방향을 계산하고, 모델의 가중치를 수정하여 거부를 그만 내보낼 수 있도록 합니다. 이 기술은 안전 세밀조정의 취약성을 보여주며 윤리적 고려 사항을 던지고 있습니다.

우리는 Daredevil-8B에 소명화를 적용하여 필터링을 해제했지만, 이로 인해 모델의 성능이 저하되었습니다. 그 후 DPO를 사용하여 NeuralDaredevil-8B 모델을 생성하여 완전히 미검열이고 고품질의 8B LLM을 만들었습니다. 소명화는 정렬 제거에 국한되지 않으며, 다시 교육 없이 세밀 조정의 일종으로 간주해야 합니다. 실제로 MopeyMule의 FailSpy의 경우처럼 좌절적인 대화 스타일을 채택하는 것과 같이 창의적으로 다른 목표에도 적용될 수 있습니다.

<div class="content-ad"></div>

이 기사가 마음에 들었으면 좋겠어요. 더 많은 내용을 보고 싶다면 Hugging Face와 Twitter의 @maximelabonne를 팔로우해 주세요.

# 참고 자료

- FailSpy, “abliterator library,” GitHub, 2024.
- Andy Arditi, Oscar Obeso, Aaquib111, wesg, Neel Nanda, “Refusal in LLMs is mediated by a single direction,” Lesswrong, 2024.