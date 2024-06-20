---
title: "LLM의 내부 작업 공개 고유 값 관점"
description: ""
coverImage: "/assets/img/2024-06-19-UnveilingtheInnerWorkingsofLLMsASingularValuePerspective_0.png"
date: 2024-06-19 20:37
ogImage: 
  url: /assets/img/2024-06-19-UnveilingtheInnerWorkingsofLLMsASingularValuePerspective_0.png
tag: Tech
originalTitle: "Unveiling the Inner Workings of LLMs: A Singular Value Perspective"
link: "https://medium.com/towards-data-science/unveiling-the-inner-workings-of-llms-a-singular-value-perspective-74c0c831e819"
---


## Llama3–8B 투영 행렬에 대한 특이값 분해 분석

![이미지](/assets/img/2024-06-19-UnveilingtheInnerWorkingsofLLMsASingularValuePerspective_0.png)

LLM이 얼마나 잘 훈련되었는지 생각해 보셨나요? 매개변수의 수가 많은데, 그 매개변수들이 훈련 데이터로부터 정보나 지식을 최대한으로 얻어내고 있는지 궁금해 하시지 않나요? 그렇지 않다면, LLM에서 유용하지 않은 매개변수들을 제거하여 더 효율적으로 만들 수 있을까요?

이 글에서는 Singular Values 관점에서 Llama-3–8B 모델을 깊게 분석하여 이러한 질문에 답해보겠습니다. 더 이상 시간을 낭비하지 말고 편안하게 앉아, SVD를 적용하여 Llama-3–8B 행렬의 품질을 분석해 보세요!

<div class="content-ad"></div>

# SVD 다시 살펴보기

특이값 분해(SVD)에서 행렬 A는 세 가지 다른 행렬로 분해됩니다:

여기서:

- A는 원래 행렬입니다.
- U는 A의 왼쪽 특이벡터인 열로 이루어진 행렬입니다.
- Σ은 A의 특이값을 포함하는 대각행렬입니다. 이 값들은 항상 음이 아닌 값이며 일반적으로 가장 큰 값부터 가장 작은 값 순서로 정렬됩니다.
- V_t는 V의 전치행렬이며, V의 열은 A의 오른쪽 특이벡터입니다.

<div class="content-ad"></div>

더 간단한 용어로 설명하면, 특이값 분해(SVD)는 행렬의 복잡한 변환을 간단하고 이해하기 쉬운 회전 및 스케일링 과정으로 나누어 줍니다. Σ의 특이값은 스케일링 요소를 알려주고 U와 V_t의 특이벡터는 해당 스케일링이 행렬을 적용하기 전과 후의 방향을 알려줍니다.

특이값은 행렬이 공간에서 다양한 방향으로 얼마나 늘어나거나 줄어드는지를 측정하는 방법으로 생각할 수 있습니다. 각 특이값은 특이벡터 쌍에 해당되며, 하나는 오른쪽 특이벡터(입력 공간에서의 방향), 다른 하나는 왼쪽 특이벡터(출력 공간에서의 방향)입니다.

행렬의 특이값이 급격하게 감소하는 경우(가장 큰 특이값이 작은 것들보다 현저히 큰 경우), 이는 행렬의 유효 랭크(중요한 특이값의 수)가 실제 행렬의 차원보다 훨씬 작다는 것을 의미합니다. 이는 행렬이 낮은 랭크 행렬로 잘 근사될 수 있음을 시사합니다.

LLM(대형 언어 모델)의 맥락에서, 가중치 행렬(예: 어텐션 메커니즘 또는 피드포워드 레이어의 행렬)들은 입력 데이터(예: 단어 임베딩)를 출력 표현으로 변환합니다. 주요한 특이값은 변환에 의해 가장 강조되는 입력 공간의 방향을 나타내며, 모델이 민감하거나 표현력이 강한 방향을 보여줍니다. 작은 특이값은 변환에서 중요하지 않거나 영향력이 적은 방향을 나타냅니다.

<div class="content-ad"></div>

특이값의 분포는 모델의 일반화 능력과 견고성에 영향을 줄 수 있습니다. 느린 감소(많은 큰 특이값)는 과적합을 초래할 수 있으며, 빠른 감소(소수의 큰 특이값)는 과소적합이거나 정보의 손실을 나타낼 수 있습니다.

# Llama-3 아키텍처 재방문

다음은 meta-llama/Meta-Llama-3-8B-Instructmodel의 config.json 파일입니다. 이 LLM은 8개의 num_key_value_heads를 사용하여 Grouped Query Attention을 활용하며, 이는 그룹 크기가 32/8=4임을 의미합니다.

```js
{
  "architectures": [
    "LlamaForCausalLM"
  ],
  "attention_bias": false,
  "attention_dropout": 0.0,
  "bos_token_id": 128000,
  "eos_token_id": 128009,
  "hidden_act": "silu",
  "hidden_size": 4096,
  "initializer_range": 0.02,
  "intermediate_size": 14336,
  "max_position_embeddings": 8192,
  "model_type": "llama",
  "num_attention_heads": 32,
  "num_hidden_layers": 32,
  "num_key_value_heads": 8,
  "pretraining_tp": 1,
  "rms_norm_eps": 1e-05,
  "rope_scaling": null,
  "rope_theta": 500000.0,
  "tie_word_embeddings": false,
  "torch_dtype": "bfloat16",
  "transformers_version": "4.40.0.dev0",
  "use_cache": true,
  "vocab_size": 128256
}
```

<div class="content-ad"></div>

# (Q, K, V, O) 행렬의 특이값 분석

자, 이제 이 기사의 본격적인 내용으로 들어가 봅시다. Llama-3–8B-Instruct 모델의 (Q, K, V, O) 행렬들을 그들의 특이값을 통해 분석해 보겠습니다!

## 코드

우선, 이 분석에 필요한 모든 패키지를 가져와 봅시다.

<div class="content-ad"></div>

```js
import transformers
import torch
import numpy as np
from transformers import AutoConfig, LlamaModel
from safetensors import safe_open
import os
import matplotlib.pyplot as plt
```

그런 다음, 모델을 다운로드하고 로컬 /tmp디렉토리에 저장합시다.

```js
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
!huggingface-cli download {MODEL_ID} --quiet --local-dir /tmp/{MODEL_ID}
```

만약 GPU를 많이 가지고 계신 분이시라면, 다음 코드는 관련이 없을 수 있습니다. 그러나 저와 같이 GPU가 부족한 분들에겐, LLama-3–8B 모델의 특정 레이어만 로드하는 데 매우 유용할 것입니다.

<div class="content-ad"></div>

```js
def load_specific_layers_safetensors(model, model_name, layer_to_load):
    state_dict = {}
    files = [f for f in os.listdir(model_name) if f.endswith('.safetensors')]
    for file in files:
        filepath = os.path.join(model_name, file)
        with safe_open(filepath, framework="pt") as f:
            for key in f.keys():
                if f"layers.{layer_to_load}." in key:
                    new_key = key.replace(f"model.layers.{layer_to_load}.", 'layers.0.')
                    state_dict[new_key] = f.get_tensor(key)

    missing_keys, unexpected_keys = model.load_state_dict(state_dict, strict=False)
    if missing_keys:
        print(f"Missing keys: {missing_keys}")
    if unexpected_keys:
        print(f"Unexpected keys: {unexpected_keys}")
```

이렇게 하는 이유는 Google Colab GPU의 무료 티어로는 LLama-3-8B를 fp16 정밀도로도 불러올 수 없기 때문입니다. 또한, 이 분석은 np.linalg.svd가 구축된 방식으로 인해 fp32 정밀도에서 작동해야 합니다. 다음으로, 주어진 matrix_type, layer_number 및 head_number에 대해 특이값을 얻는 메인 함수를 정의할 수 있습니다.

```js
def get_singular_values(model_path, matrix_type, layer_number, head_number):
    """
    Llama-3 모델의 지정된 행렬의 특이값을 계산합니다.

    Parameters:
    model_path (str): 모델 경로
    matrix_type (str): 행렬 유형 ('q', 'k', 'v', 'o')
    layer_number (int): 레이어 번호 (0에서 31까지)
    head_number (int): 헤드 번호 (0에서 31까지)

    Returns:
    np.array: 특이값의 배열
    """
    assert matrix_type in ['q', 'k', 'v', 'o'], "잘못된 행렬 유형"
    assert 0 <= layer_number < 32, "잘못된 레이어 번호"
    assert 0 <= head_number < 32, "잘못된 헤드 번호"

    # RAM이 제한되어 있어 사용한 후에도 fp16을 사용해도 제한된 레이어만을 위해 모델을로드합니다.
    config = AutoConfig.from_pretrained(model_path)
    config.num_hidden_layers = 1
    model = LlamaModel(config)
    load_specific_layers_safetensors(model, model_path, layer_number)

    # 지정된 레이어에 액세스합니다.
    # 특정 레이어를로드했으므로 항상 인덱스 0을 사용합니다.
    layer = model.layers[0]

    # 각 헤드의 크기 결정합니다.
    num_heads = layer.self_attn.num_heads
    head_dim = layer.self_attn.head_dim

    # 지정된 행렬에 액세스합니다.
    weight_matrix = getattr(layer.self_attn, f"{matrix_type}_proj").weight.detach().numpy()
    if matrix_type in ['q','o']:
        start = head_number * head_dim
        end = (head_number + 1) * head_dim
    else:  # 'k', 'v' matrices
        # num_key_value_heads로 나눠 헤드 번호를 조절합니다.
        # llama3-8b는 그룹화된 쿼리 어텐션을 사용하기 때문에 수행됩니다.
        num_key_value_groups = num_heads // config.num_key_value_heads
        head_number_kv = head_number // num_key_value_groups
        start = head_number_kv * head_dim
        end = (head_number_kv + 1) * head_dim

    # 지정된 헤드에 대한 가중치를 추출합니다.
    if matrix_type in ['q', 'k', 'v']:
        weight_matrix = weight_matrix[start:end, :]
    else:  # 'o' matrix
        weight_matrix = weight_matrix[:, start:end]

    # 특이값 계산합니다.
    singular_values = np.linalg.svd(weight_matrix, compute_uv=False)

    del model, config

    return list(singular_values)
```

HuggingFace에서 구현된 방식으로 인해 K, Q 및 V 행렬에 대한 지정된 헤드의 가중치를 추출할 수 있는 이유는 행별로 슬라이싱을 통해할 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-UnveilingtheInnerWorkingsofLLMsASingularValuePerspective_1.png)

O 행렬의 경우 선형 대수를 통해 O 가중치에서 지정된 헤드에 대한 가중치를 추출하기 위해 열별로 슬라이싱을 할 수 있습니다! 자세한 내용은 다음 그림에서 확인할 수 있습니다.

![이미지](/assets/img/2024-06-19-UnveilingtheInnerWorkingsofLLMsASingularValuePerspective_2.png)

## 결과


<div class="content-ad"></div>

분석을 위해 다양한 헤드, 레이어 및 행렬 유형에서 get_singular_values() 함수를 실행해야 합니다. 그리고 이러한 다양한 조합을 비교할 수 있도록 분석을 위한 여러 보조 지표도 정의해야 합니다:

- 상위 10개 비율: 상위 10개 특이값의 합과 모든 특이값의 합 사이의 비율
- 첫 번째/마지막 비율: 가장 높은 특이값과 가장 낮은 특이값 간의 비율
- 최소 10개 비율: 최소 10개 특이값의 합과 모든 특이값의 합 사이의 비율

(레이어 0, 헤드 0) 분석

- Q(쿼리) 행렬은 초기 최대 특이값(약 10)을 갖고 있으며, 다음으로 K(키) 행렬(약 8)이 있습니다. 이 2개의 행렬은 초기 특이값이 V(값)와 O(출력) 행렬보다 현저히 높습니다.
- 초기 특이값 뿐만 아니라, Q와 K 행렬의 상위 10개 비율과 첫 번째/마지막 비율을 확인하면, 이 두 행렬이 V와 O 행렬보다 훨씬 높은 값을 갖는다는 것을 알 수 있습니다. 이는 Q와 K 행렬이 대부분의 차원에 집중된 정보를 포함하고 있으며, V와 O 행렬은 정보가 구성요소 전반에 분산되어 있는 것을 시사합니다.
- 최소 10개 비율을 살펴보면, Q와 K 행렬의 특이값이 거의 0에 가깝고 V와 O 행렬에 비해 상대적으로 훨씬 낮다는 것을 알 수 있습니다. 이는 Q와 K 행렬이 저랭크 구조를 가지고 있음을 나타내는 증거 중 하나이며, 이 차원들이 모델의 전반적인 성능에 미미한 영향을 미칩니다. 이러한 가중치는 구조적으로 제거하여 모델의 정확도에 큰 영향을 미치지 않는 경우가 있을 수 있습니다.

<div class="content-ad"></div>

## (레이어 0, 다중 헤드) 분석

- 헤드 번호가 증가함에 따라 Q 및 K 행렬의 상위 10 비율은 V 및 O 행렬보다 훨씬 빠른 속도로 증가하는 경향이 있습니다. 이 관찰 결과는 Q 및 K 행렬의 최하 10 비율에도 동일하게 적용되며, 헤드 번호가 증가함에 따라 값이 0에 가까워지는 경향을 보입니다. 그러나 V 및 O 행렬에는 해당 경향이 나타나지 않습니다.
- 이 결과는 헤드 번호가 높은 헤드의 Q 및 K 행렬이 낮은 차원에서 정보를 저장하는 경향이 있다는 것을 나타냅니다. 다시 말해, 헤드 번호가 증가함에 따라 Q 및 K 행렬은 더 적은 차원에서 정보를 저장하려고 합니다.

## 교차-레이어 분석

- 더 깊은 레이어로 갈수록, Q 및 K 행렬의 초기값이 감소되는 경향을 발견했지만, 여전히 V 및 O 행렬과 비교하면 비교적 높습니다.
- 더 깊은 레이어로 갈수록, 특정 헤드의 Q 및 K 행렬의 상위 10 비율 및 첫 번째/마지막 비율에 대한 하락 트렌드 패턴이 나타납니다. 또한 최하 10 비율의 약간의 상승 트렌드 패턴이 있습니다. 이는 더 깊은 레이어의 Q 및 K 행렬이 낮은 레이어와 비교하여 더 잘 훈련된 것으로 나타납니다.

<div class="content-ad"></div>

- "레이어 0, 다중 헤드" 섹션에서 발견한 동일 레이어 내의 헤드 간 패턴은 더 깊은 레이어로 이동할 때 명확하지 않습니다. 

요약

- K 및 Q 행렬은 V 및 O 행렬과 비교하여 상대적으로 낮은 순위를 가지고 있습니다. 가지치기(pruning) 또는 차원 축소 방법을 수행하려면 K 및 Q 행렬에 더 집중할 수 있습니다.
- 레이어가 깊어질수록 모든 (K, Q, V, O) 행렬이 더 잘 훈련됩니다. 가지치기 또는 차원 축소 방법을 수행하려면 낮은 레이어에 더 집중할 수 있습니다.
- 가지치기 외에도 초기 몇 레이어에서만 전체 미세 조정을 수행하거나 LoRA로도 이를 수행하는 것이 흥미로울 수 있습니다.

# 마무리 말씀

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-UnveilingtheInnerWorkingsofLLMsASingularValuePerspective_3.png)

이 시점까지 참석해 주셔서 축하드립니다! 이 기사에서 새로운 것을 배우셨으면 좋겠습니다. 선형 대수의 좋은 오래된 개념들을 적용하여, LLM의 훈련이 얼마나 잘 이루어졌는지 이해하는 것은 정말 흥미롭습니다.

이 유형의 콘텐츠를 좋아하신다면, 저의 Medium 계정을 팔로우해주시어 앞으로의 다른 글 알림을 받아보세요.

# 저자 소개


<div class="content-ad"></div>

루이스 오웬은 인도네시아 출신의 데이터 과학자 및 AI 연구 엔지니어로, 항상 새로운 지식에 굶주립니다. 그의 경력 여정을 통해 그는 비영리 단체, 전자 상거래, 대화형 AI, OTA, 스마트 시티 및 핀테크 등 다양한 산업 분야에서 일해 왔습니다. 일 안에서 해외에선, 그는 자신의 기사나 멘토링 세션을 통해 데이터 과학 애호가들이 데이터 과학자로 성장할 수 있도록 시간을 보내는 것을 즐깁니다.

지금은 루이스가 전 세계적인 CX 자동화 플랫폼 인 Yellow.ai의 NLP 연구 엔지니어로 일하고 있습니다. 루이스의 웹사이트를 방문하여 그에 대해 더 알아보세요! 마지막으로, 궁금한 점이나 이야기할 주제가 있으면 망설이지 마시고 LinkedIn을 통해 루이스에게 연락해보세요.