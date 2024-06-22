---
title: "PyTorch 모델 학습 속도를 높이는 간단한 방법들"
description: ""
coverImage: "/assets/img/2024-06-22-SimpleWaystoSpeedUpYourPyTorchModelTraining_0.png"
date: 2024-06-22 21:04
ogImage: 
  url: /assets/img/2024-06-22-SimpleWaystoSpeedUpYourPyTorchModelTraining_0.png
tag: Tech
originalTitle: "Simple Ways to Speed Up Your PyTorch Model Training"
link: "https://medium.com/towards-data-science/simple-ways-to-speed-up-your-pytorch-model-training-9c9d4899313d"
---


## 만약 머신 러닝 엔지니어들이 원하는 것이 하나 있다면, 더 빠른 모델 학습일 것입니다 — 아마도 좋은 테스트 지표 이후에

![image](/assets/img/2024-06-22-SimpleWaystoSpeedUpYourPyTorchModelTraining_0.png)

이 주제는 소개가 필요할까요?

머신 러닝 모델 학습을 가속화하는 것은 모든 머신 러닝 엔지니어가 원하는 한 가지입니다. 빠른 학습은 더 빠른 실험, 제품에 대한 더 빠른 반복을 의미합니다. 또한, 한 모델 학습에 필요한 리소스를 줄여줍니다. 그러니, 본론으로 넘어가요.

<div class="content-ad"></div>

# 컨테이너화

네, 이것은 단독으로 교육 속도를 높이지는 않습니다. 그러나 다른 중요한 측면, 재현성을 목표로 합니다. 가끔 고정된 라이브러리 버전을 가진 가상 환경이 충분하지만, 모델 교육을 위한 올인원 도커 컨테이너를 만들어보는 것을 권장드립니다.

이는 디버깅, 프로파일링 및 최종 교육 중에 환경이 완전히 일관된 상태임을 보장합니다. 가령 예를 들어, python12 속도 향상으로 병목이 아닌 코드 부분을 최적화하려는 경우나, 서로 다른 CUDA 버전에서 재현되지 않는 버그 등을 방지할 수 있습니다.

출발점으로서, NVIDIA로부터 사전 빌드된 이미지를 사용할 수 있습니다. 이미 CUDA, PyTorch 및 기타 인기 있는 라이브러리가 설치되어 있습니다.

<div class="content-ad"></div>

# PyTorch 프로파일러에 익숙해져보세요

어떤 것을 최적화하기 전에는 코드의 어떤 부분이 얼마나 오래 사용되는지 이해해야 합니다. PyTorch 프로파일러는 대부분의 학습에 대한 프로파일링을 수행할 수 있는 전체적인 도구입니다. 다음을 기록할 수 있습니다:

- CPU 작업 시간
- CUDA 커널 시간
- 메모리 사용량 기록

이게 다죠. 그리고 활성화하는 것도 쉽습니다!

<div class="content-ad"></div>

이벤트를 기록하기 위해서는 다음과 같이 프로파일러 컨텍스트에 교육을 포함시키면 됩니다:

```js
import torch.autograd.profiler as profiler

with profiler.profile(
  activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA],
  on_trace_ready=torch.profiler.tensorboard_trace_handler('./logs'),
) as prof:
  train(args)
```

그 후에 텐서보드를 실행하여 프로파일링 트레이스를 볼 수 있습니다. torch-tb-profiler를 설치하는 것을 잊지 마세요.

프로파일러에는 다양한 옵션이 있지만, 가장 중요한 것은 activities와 profile_memory입니다. 다른 옵션을 실험해 볼 수 있지만, 간단한 규칙을 기억하세요: 가능한 옵션이 적을수록 오버헤드가 적습니다.

<div class="content-ad"></div>

그래서, 만약 CUDA 커널 실행 시간을 프로파일링하고 싶다면, CPU 프로파일링 및 다른 기능을 끄는 것이 좋은 아이디어입니다. 이 모드에서는 프로파일링이 실제 실행과 가능한 가까워집니다.

추적을 이해하기 쉽게 만들기 위해 코드의 핵심 부분을 설명하는 프로파일링 컨텍스트를 추가하는 것을 고려해보세요. 프로파일링이 비활성화되어 있는 경우엔 no-op입니다.

```js
with profiler.record_function("forward_pass"):
  result = model(**batch)

with profiler.record_function("train_step"):
  step(**result)
```

이렇게 하면 사용하는 레이블이 추적에서 볼 수 있게 됩니다. 그래서 코드 블록을 식별하기가 더 쉬워집니다. 심지어 forward 모드 내에서 더 세부적으로:

<div class="content-ad"></div>


```python
with profiler.record_function("transformer_layer:self_attention"):
  data = self.self_attention(**data)

...

with profiler.record_function("transformer_layer:encoder_attention"):
  data = self.encoder_attention(**data, **encoder_data)
```

# PyTorch 추적 이해

추적을 수집한 후, tensorboard에서 열어보세요. CPU + CUDA 프로파일이 이렇게 나옵니다:

바로 학습의 핵심 부분을 찾아보세요:


<div class="content-ad"></div>

- 데이터 로딩
- 순전파
- 역전파

역전파는 PyTorch에서 별도의 스레드(thread 16893의 이미지에서 확인 가능)로 처리되어 쉽게 식별할 수 있습니다.

## 데이터 로딩

데이터 로딩 시, 실행 시간을 거의 없애고 싶습니다.

<div class="content-ad"></div>

물탱크를
변경하려면
마크다운으로
태그를
바꾸십시오.


<div class="content-ad"></div>

- 백그라운드 프로세스에서 데이터 처리하기 (GIL이 없음)
- 데이터 증강 및 변환을 병렬 프로세스에서 처리하기

만약 PyTorch DataLoader를 사용한다면, num_workers를 명시하여 쉽게 이를 달성할 수 있습니다. IterableDataset을 사용하는 경우에는 데이터가 복제될 수 있습니다. 그러나 이 문제는 get_worker_info()를 사용하여 해결할 수 있습니다. 각 워커가 서로 다른, 중첩되지 않는 행을 수신하도록 반복을 조정해야 합니다.

더 많은 구성 가능한 처리를 위해, multiprocessing을 사용하여 직접 멀티 프로세스 변환을 구현할 수 있습니다.

# 메모리 할당자와 친구 되기

<div class="content-ad"></div>

파이토치의 CUDA 캐싱 할당자와 친구가 되고 싶다면, 반가워요!

CUDA 장치에서 PyTorch로 텐서를 할당할 때, PyTorch는 캐싱 할당자를 사용할 거예요. 그 이유는 cudaMalloc/cudaFree가 비용이 많이 드는 작업이기 때문에 그것들을 피하고 싶어하기 때문이에요. PyTorch는 cudaMalloc을 통해 이전에 할당한 블록을 재사용하려고 하는 할당자가 있어요. 즉, PyTorch의 할당자가 적합한 블록을 가지고 있다면 cudaMalloc을 호출하지 않고 즉시 사용해 줄 거에요. 그러니까, cudaMalloc은 처음에만 호출되는 거죠.

하지만, 변수 길이의 데이터를 처리하는 경우, 서로 다른 크기의 중간 텐서가 필요할 수 있어요. 그래서 PyTorch의 할당자에는 적합한 데이터 블록이 없을 수도 있어요. 이런 경우, 할당자가 패닉에 빠져 이전에 할당한 블록을 cudaFree를 호출하여 해제하고 새로운 할당을 위해 공간을 확보할 거에요.

이후, 할당자는 다시 캐시를 구축하기 시작하며, 비용이 많이 드는 cudaMalloc을 계속 수행하게 되요. 이 문제를 확인하려면 텐서보드 프로파일러 뷰어의 메모리 프로파일러 섹션을 살펴보세요.

<div class="content-ad"></div>

안녕하세요! 볼때와 같이 할당자의 예약된 메모리에 해당하는 빨간 선이 계속 변하는 걸 보실 수 있습니다. 이는 PyTorch 할당자가 할당 요청을 효율적으로 처리하지 못한다는 것을 의미합니다.

할당이 할당자가 패닉 상태를 일으키지 않고 처리될 때, 빨간 선은 완전히 일자입니다.

말씀드린대로, 이는 대부분 텐서의 변수 모양 때문입니다. 이를 어떻게 해결할 수 있을까요?

## 확장 가능 세그먼트

<div class="content-ad"></div>

PyTorch의 비교적 새로운 할당자 모드인 'expandable_segments:True'로 설정해보는 것이 가치 있는 첫 번째 시도입니다:

```js
PYTORCH_CUDA_ALLOC_CONF="expandable_segments:True"
```

이렇게 하면 PyTorch 할당자가 앞으로 확장될 수 있는 블록을 할당하도록 지시합니다. 우리 상황에 딱 맞는 조치입니다. 그러나 크기 변동이 너무 크면 문제를 해결하지 못할 수도 있습니다. 이 경우에는 다음 옵션으로 넘어가세요.

## 할당 크기 변동 줄이기

<div class="content-ad"></div>

다른 가능한 해결책은 데이터 모양을 일관되게 만드는 것입니다. 그러면 할당기가 재사용할 데이터 블록을 더 쉽게 찾을 수 있게 됩니다.

이를 실현하기 위해서 데이터를 동일한 크기로 채울 수 있습니다. 또한 최대 입력 크기로 모델을 실행하여 할당기를 미리 가동할 수도 있습니다.

다음 기사에서 PyTorch 할당기 수정에 대해 더 알아볼 수 있습니다.

# 할당 기록 정리하기

<div class="content-ad"></div>

모든 사용 가능한 GPU 메모리를 활용하려 합니다. 이렇게 하면 큰 배치를 실행하고 데이터를 빠르게 처리할 수 있습니다. 그러나 배치 크기를 늘릴 때 CUDA 메모리 부족 오류가 발생할 수 있습니다. 이 오류가 발생하는 이유는 무엇인가요?

이를 해결하기 위해 할 수 있는 방법 중 하나는 할당자의 메모리 이력을 확인하는 것입니다. PyTorch로 이를 기록하고 있으면 https://pytorch.org/memory_viz에서 시각화할 수 있습니다.

- 시작: torch.cuda.memory._record_memory_history(max_entries=100000)
- 저장: torch.cuda.memory._dump_snapshot(file_name)
- 중지: torch.cuda.memory._record_memory_history(enabled=None)

시각화 결과는 이렇게 그려집니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-SimpleWaystoSpeedUpYourPyTorchModelTraining_1.png)

x축은 시간을, y축은 총 사용된 메모리를 나타내며, 다채로운 블록은 텐서를 나타냅니다. 따라서 텐서가 할당되고 해제된 시기가 표시됩니다.

좁은 스파이크를 볼 수 있는데, 이는 많은 공간을 차지하는 단기간 텐서입니다. 텐서를 클릭하면 해당 텐서가 할당된 위치에 대한 정보를 얻을 수 있습니다. 이러한 스파이크를 최소화하려고 하며, 이는 효율적인 메모리 사용을 제한할 수 있습니다. 이 스파이크가 발생한 이유를 확인하고 의도한 작업을 수행하는 다른 방법을 고려하십시오.

스파이크 외에도 메모리 누수를 간편하게 감지할 수 있습니다:



<div class="content-ad"></div>


![Training Data Issue](/assets/img/2024-06-22-SimpleWaystoSpeedUpYourPyTorchModelTraining_2.png)

As you see, some data after the first forward is not cleared. By clicking on blocks you can get the idea where these tensors come from. In the image is the case when gradients are not cleared after the training step, so they lay dead during the forward pass, limiting the ability to increase the batch size to fit more data.

## 가속화된 모델 및 적은 메모리 사용

이보다 더 좋은 것이 있을까요? 점곱 주의를 계산하는 FlashAttention 커널을 사용하여 이를 달성할 수 있습니다.


<div class="content-ad"></div>

만약 이에 대해 들어보지 못했다면, 주의를 기울여야 할 계산 정확도를 갖는 dot product attention을 구축하지 않고도 실행하는 방법이 있습니다. 이는 GPU의 io 작업을 최적화하여 속도를 향상시키고 메모리 소비를 격차적으로 줄입니다. 사용하지 않을 이유가 단순히 없습니다.

다른 라이브러리들은 이 기능을 기반으로 작동하기 때문에 귀하의 코드베이스에 더 잘 맞는 다른 변형을 고려할 수 있습니다.

## XFormers

## Transformer Engine

<div class="content-ad"></div>

## 파이토치 그 자체!

그 맞아요, 새로운 버전의 PyTorch는 적용 가능할 때 flash attention을 사용할 수 있습니다. 이 모드를 활성화하려면 어텐션 블록을 실행하고 사용할 어텐션 전략을 지정하는 컨텍스트 매니저를 실행해야 합니다:

# 다중 GPU 데이터 중복성 최적화 — FSDP

훈련을 실행하기 위해 여러 GPU를 사용하는 경우, 기본적인 해결책은 DistributedDataParallel 클래스를 사용하는 것입니다. 이렇게 하면 여러 개의 동일한 프로세스가 생성되고, 그라디언트가 역전파 단계에서 집계됩니다.

<div class="content-ad"></div>

하지만, 그것은 최적이 아닙니다!

문제는 동일한 프로세스를 생성했기 때문에 각 GPU에 동일한 모델과 최적화 상태가 있어 불필요한 것입니다. 해결책은 데이터를 분할하는 것입니다. 이를 위해 Fully Sharded Data Parallel PyTorch 래퍼를 사용할 수 있습니다.

어떻게 작동합니까?

언급한 대로, 여러 GPU에서 훈련할 때 DDP로 훈련할 때 각 프로세스는 동일한 데이터의 정확한 사본을 갖게 됩니다. 몇 가지 개선을 구현함으로써 최적화할 수 있습니다:

<div class="content-ad"></div>

## 샤드 최적화 상태 (ZeRO 1)

DDP로 학습할 때 각 프로세스가 최적화 상태의 완전한 복사본을 유지합니다. ZeRO1에서는 이러한 최적화 상태를 모든 랭크에 샤딩하여 각 랭크가 최적화 상태의 일부분만 보유하도록 합니다. 역전파 중에 각 랭크는 매개변수에 관련된 최적화 상태만 수집하여 최적화 단계를 수행합니다. 이 중복 감소는 메모리를 절약하는 데 도움이 됩니다.

## 그래디언트 샤딩 (ZeRO 2)

우리는 최적화 상태를 샤딩합니다. 이제 우리는 최적화 단계에서 그래디언트를 또한 샤딩할 것입니다. 하나의 랭크가 매개변수의 일부분에 대한 최적화 상태를 보유하고 있다면, 이제 우리는:

<div class="content-ad"></div>

- 랭크가 보유한 상태와 관련된 모든 그래디언트를 집계합니다.
- 최적화 단계를 계산합니다.
- 매개변수 일부에 대한 최적화 단계를 모든 다른 랭크로 보냅니다.

이제 각 랭크가 그래디언트의 전체 복제본을 보유할 필요가 없다는 것을 알았을 것입니다. 그래디언트를 사용 가능한 대로 해당 랭크로 보낼 수 있습니다. 따라서 최대 메모리 소비를 더욱 줄일 수 있습니다.

## 샤드 모델 매개변수 (ZeRO 3)

이 일이 엄청날 것 같네요.

<div class="content-ad"></div>

각 랭크마다 모델의 전체 복사본을 저장해야 하는 이유가 무엇일까요? 모델 매개변수를 모든 랭크 사이에서 샤딩할 것입니다. 그럼, 순방향 및 역방향 중에 필요한 매개변수를 필요할 때 가져올 것입니다.

## FSDP를 사용하는 방법은?

정말 간단합니다. 모델을 FSDP로 랩핑해야 합니다:

```js
import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP

model = FSDP(model)

# 랩핑된 모델에서 매개변수를 가져오는 것이 중요합니다
# 오직 반환된 매개변수의 일부분만 사용됨 (샤딩된 부분)
optimizer = optim.Adam(model.parameters())

# 일반적으로 훈련을 진행합니다
train(model, optimizer)
```

<div class="content-ad"></div>

FSDP의 샤딩 전략을 지정할 수도 있어요. 예를 들어, SHARD_GRAD_OP 전략을 선택해서 ZeRO2와 유사한 동작을 얻을 수 있어요. 다른 전략에 대해 자세히 알고 싶다면 여기를 확인해 보세요:

또한 FSDP 서브모듈로 랩핑할 수도 있어요. 위의 예에서는 하나의 FSDP 모듈만 사용하여 계산 효율성과 메모리 효율성을 줄일 것이에요. 예를 들어, 모델에 100개의 Linear 레이어가 있다고 가정해봅시다. FSDP(model)을 적용하면, 전체 모델을 랩핑하는 하나의 FSDP 유닛만 있을 것이에요. 이 경우, allgather는 100개의 선형 레이어의 전체 매개변수를 수집하고, 따라서 매개변수 샤딩에 대한 CUDA 메모리를 저장할 수 없을 것이에요.

서브모듈을 명시적으로 랩핑하거나 자동 랩핑 정책을 정의할 수 있어요. FSDP에 대해 더 자세히 알아보려면 PyTorch 가이드를 읽어보세요:

# torch.compile으로 마법처럼 속도 향상

<div class="content-ad"></div>

그러니까, torch compile을 활성화하면 코드 실행 속도가 몇 퍼센트나 빨라질 수 있어요. 

Torch는 실행 그래프를 추적하고 효율적인 형식으로 변환하여 모델을 거의 Python 호출 없이 실행할 수 있도록 합니다. 

기본적인 사용법은 모델을 compile로 감싸는 것입니다:

```js
import torch

model = torch.compile(model)
```

<div class="content-ad"></div>

이 작업은 거의 즉시 실행됩니다. 실제 추적은 첫 번째 전진 중에만 발생합니다.

또한 시도할 가치가 있는 많은 옵션이 있습니다:

토치 컴파일에 대해 더 자세히 알아보세요:

# 결론

<div class="content-ad"></div>

이 게시물은 설명이 완전하지 않습니다. 대신, 즉시 시도해볼 가치가 있는 속도 향상 목록입니다. 도움이 되었기를 바랍니다. 댓글을 자유롭게 남겨주세요!

구독을 고려해보세요.

2024년 5월 28일에 https://alexdremov.me에서 원본이 게시되었습니다.

Linux Foundation의 프로젝트인 PyTorch Blog에서 이미지를 사용했고, Linux Foundation 정책의 적용을 받습니다. 그러므로 모든 이미지는 Creative Commons Attribution 3.0 라이선스에 따라 허용된 대로 사용될 수 있습니다.