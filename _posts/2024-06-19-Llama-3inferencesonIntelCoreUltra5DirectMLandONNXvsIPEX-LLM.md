---
title: "Llama-3 추론을 Intel Core Ultra 5에서 실행하기 DirectML 및 ONNX 대 IPEX-LLM"
description: ""
coverImage: "/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_0.png"
date: 2024-06-19 01:21
ogImage: 
  url: /assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_0.png
tag: Tech
originalTitle: "Llama-3 inferences on Intel® Core™ Ultra 5: DirectML and ONNX vs. IPEX-LLM"
link: "https://medium.com/@GenerationAI/llama-3-inferences-on-intel-core-ultra-5-directml-and-onnx-vs-ipex-llm-418e7220817d"
---


이전 글에서 언급했듯이 Intel은 ONNX + DirectML을 위한 하드웨어 가속화를 제공합니다. 이에 대해 몇 가지 실험을 진행했습니다.

Microsoft은 PyTorch를 위한 DirectML 인터페이스를 제공합니다. 현재 16비트와 32비트 부동 소수점에서만 추론을 지원합니다. 예제에서 초당 토큰 수를 측정하기 위해 포크를 생성했습니다.

```js
conda create --name pytdml python=3.10 -y
conda activate pytdml
pip install torch-directml
git clone https://github.com/luweigen/DirectML
cd DirectML/PyTorch/llm
pip install -r requirements.txt
python app.py --precision float16 --model_repo "meta-llama/Meta-Llama-3-8B-Instruct" --stream_every_n=143
```

<img src="/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_0.png" />

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_1.png" />

이전 실험에서 🤗Transformers + IPEX-LLM이 최상의 성능을 보여줬기 때문에 이 설정에서는 16비트 부동 소수점 추론만 비교할 것입니다.

테스트 프로그램 ipex-llm-llama3.py는 다음과 같이 수정되었습니다.

```js
# Wei Lu(mailwlu@gmail.com)에 의해 수정됨
# 2016년 The BigDL Authors에 저작권 속함
#
# Apache 라이선스, 버전 2.0에 따라 라이선스 부여
# 이 파일을 라이선스와 준수하면서 사용해야 합니다.
# 라이선스 사본은 다음에서 얻을 수 있습니다.
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# 적용되는 법률에 따라 필요하거나 서면으로 합의되거나, 소프트웨어가
# "있는 그대로" 배포됩니다. 조건이나 보증 없이
# 명시 또는 묵시적으로, 까지도 어떤 종류의 조건도 보증 없이,
# 명시적 또는 묵시적으로. 언어 특정 권한과 관련해야 합니다.
# 권한 및 제한 사항
#

import torch
import time
import argparse

from ipex_llm.transformers import AutoModelForCausalLM
from transformers import AutoTokenizer

# 모델을 기반으로 프롬프트를 조정할 수 있습니다.
# 여기서 프롬프트 조정은 다음을 참조합니다. https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3
기본_시스템_프롬프트 = """\
"""

def get_prompt(user_input: str, chat_history: list[tuple[str, str]],
               system_prompt: str) -> str:
    prompt_texts = [f'<|begin_of_text|>']

    if system_prompt != '':
        prompt_texts.append(f'<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>')

    for history_input, history_response in chat_history:
        prompt_texts.append(f'<|start_header_id|>user<|end_header_id|>\n\n{history_input.strip()}<|eot_id|>')
        prompt_texts.append(f'<|start_header_id|>assistant<|end_header_id|>\n\n{history_response.strip()}<|eot_id|>')

    prompt_texts.append(f'<|start_header_id|>user<|end_header_id|>\n\n{user_input.strip()}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n')
    return ''.join(prompt_texts)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Llama3 모델을 사용하여 `generate()` API를 사용하여 토큰 예측')
    parser.add_argument('--repo-id-or-model-path', type=str, default="meta-llama/Meta-Llama-3-70B-Instruct",
                        help='Meta-Llama-3 (예: `meta-llama/Meta-Llama-3-70B-Instruct`)를 다운로드할 Huggingface 저장소 ID'
                             '또는 Huggingface 체크포인트 폴더에 대한 경로')
    parser.add_argument('--prompt', type=str, default="OpenVINO is",
                        help='추론할 프롬프트')
    parser.add_argument('--n-predict', type=int, default=128,
                        help='예측할 최대 토큰 수')
    parser.add_argument('--bit', type=str, default="4",
                        help='4로 설정하면 4비트로 로드하거나 off 또는 load_in_low_bit 옵션은 sym_int4, asym_int4, sym_int5, asym_int5, sym_int8,nf3,nf4, fp4, fp8, fp8_e4m3, fp8_e5m2, fp6, gguf_iq2_xxs, gguf_iq2_xs, gguf_iq1_s, gguf_q4k_m, gguf_q4k_s, fp16, bf16, fp6_k')

    args = parser.parse_args()
    model_path = args.repo_id_or_model_path

    if args.bit == "4":
        # 4비트로 모델 로드,
        # 모델의 관련 레이어를 INT4 형식으로 변환합니다.
        # iGPU를 사용하는 Windows 사용자의 경우, LLM을 실행할 때 `cpu_embedding=True`를 from_pretrained 함수에서 설정하는 것을 권장합니다.
        # 이렇게 하면 메모리 집약적인 임베딩 레이어가 iGPU 대신 CPU를 활용할 수 있습니다. 이 경우에는 도움이 되지 않습니다.
        model = AutoModelForCausalLM.from_pretrained(model_path,
                                                    load_in_4bit=True,
                                                    optimize_model=True,
                                                    trust_remote_code=True,
                                                    use_cache=True)
    elif args.bit == "off" or args.bit == "32":
        model = AutoModelForCausalLM.from_pretrained(model_path,
                                                    optimize_model=True,
                                                    trust_remote_code=True,
                                                    use_cache=True)
    else:
        model = AutoModelForCausalLM.from_pretrained(model_path,
                                                    load_in_low_bit=args.bit,
                                                    optimize_model=True,
                                                    trust_remote_code=True,
                                                    use_cache=True)

    if args.bit == "32":
        model = model.to('xpu')
    else:
        model = model.half().to('xpu')

    # 토크나이저 로드
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

    # 여기서 종결자는 다음을 참조합니다. https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct#transformers-automodelforcausallm
    종결자 = [
        tokenizer.eos_token_id,
        tokenizer.convert_tokens_to_ids("<|eot_id|>"),
    ]

    # 예측된 토큰 생성
    with torch.inference_mode():
        prompt = get_prompt(args.prompt, [], system_prompt=DEFAULT_SYSTEM_PROMPT)
        input_ids = tokenizer.encode(prompt, return_tensors="pt").to('xpu')
        # ipex_llm 모델은 워밍업이 필요하므로 추론 시간을 정확하게 할 수 있습니다.
        output = model.generate(input_ids,
                                eos_token_id=terminators,
                                max_new_tokens=20)

        # 추론 시작
        st = time.time()
        output = model.generate(input_ids,
                                eos_token_id=terminators,
                                max_new_tokens=args.n_predict)
        torch.xpu.synchronize()
        end = time.time()
        output = output.cpu()
        output_str = tokenizer.decode(output[0], skip_special_tokens=False)
        print(f'추론 시간: {end-st} s, 토큰: {len(output[0])}, t/s:{len(output[0])/(end-st)}')
        print('-'*20, '프롬프트', '-'*20)
        print(prompt)
        print('-'*20, '출력 (skip_special_tokens=False)', '-'*20)
        print(output_str)
```

<div class="content-ad"></div>

```js
python ipex-llm-llama3.py --repo-id-or-model-path=meta-llama/Meta-Llama-3-8B-Instruct --bit=fp16
```

![image](/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_2.png)

![image](/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_3.png)

DirectML은 낮은 비트 양자화를 지원하는 ONNX Runtime의 Execution Provider가 될 수도 있습니다. 우리의 테스트는 이 python API를 기반으로 합니다.

<div class="content-ad"></div>


```js
pip install onnxruntime-genai --pre
pip install onnxruntime-genai-directml --pre
pip install torch transformers onnx onnxruntime
conda install conda-forge::vs2015_runtime
```

마지막 줄은 이 문제를 해결하기 위한 것입니다.

라마 모델은 다음과 같이 변환되었습니다.

```js
python -m onnxruntime_genai.models.builder -m meta-llama/Meta-Llama-3-8B-Instruct -o llama-3-8B-Instruct-int4-onnx-directml -p int4 -e dml -c ..\.cache\huggingface\hub\
```

<div class="content-ad"></div>

변환된 모델이 🤗 허브에 업로드되었습니다.

다음은 테스트 프로그램 genai-llama3.py입니다.

```python
import time
import argparse
import onnxruntime_genai as og

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Predict Tokens using onnxruntime_genai')
    parser.add_argument('--model-path', type=str, default="llama-3-8B-Instruct-int4-onnx-directml",
                        help='model path')
    parser.add_argument('--prompt', type=str, default="OpenVINO is",
                        help='Prompt to infer')
    parser.add_argument(
        '--max-length',
        type=int,
        default=143,
        help='max lengths'
    )
    args = parser.parse_args()

    model = og.Model(args.model_path)
    tokenizer = og.Tokenizer(model)
    
    # Set the max length to something sensible by default,
    # since otherwise it will be set to the entire context length
    search_options = {}
    search_options['max_length'] = args.max_length

    chat_template = '<|user|>\n{input} <|end|>\n<|assistant|>'

    text = args.prompt
    if not text:
        print("오류, 입력이 비어 있을 수 없습니다")
        exit

    prompt = f'{chat_template.format(input=text)}'

    input_tokens = tokenizer.encode(prompt)

    params = og.GeneratorParams(model)
    params.set_search_options(**search_options)
    params.input_ids = input_tokens

    st =  time.time()
    output = model.generate(params)
    out_txt = tokenizer.decode(output[0])

    sec = time.time() - st
    cnt = len(output[0])

    print("생성 결과:", out_txt)
    print(f'추론 시간: {sec} 초, 토큰 수: {cnt}, 초당 토큰 수:{cnt/sec}')
```

<img src="/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_4.png" />


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_5.png)

🤗Transformers + IPEX-LLM과 비교해 볼 수 있어요.

```js
python ipex-llm-llama3.py --repo-id-or-model-path=meta-llama/Meta-Llama-3-8B-Instruct --bit=4
```

![이미지](/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_6.png)


<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_7.png)

결과를 함께 살펴봅시다.

![이미지2](/assets/img/2024-06-19-Llama-3inferencesonIntelCoreUltra5DirectMLandONNXvsIPEX-LLM_8.png)

앞으로 어떻게 이러한 흥미로운 차이가 생겼는지에 대한 구현 세부사항을 탐구할 것입니다.
