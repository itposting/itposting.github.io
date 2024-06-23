---
title: "Stable Diffusion 모델 마스터하기 체크포인트, VAE, LoRA, 임베딩 및 더 많은 기능들"
description: ""
coverImage: "/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_0.png"
date: 2024-06-23 20:22
ogImage: 
  url: /assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_0.png
tag: Tech
originalTitle: "Master Stable Diffusion models: checkpoint, VAE, LoRA, embedding and more"
link: "https://medium.com/design-bootcamp/master-stable-diffusion-models-checkpoint-vae-lora-embedding-and-more-94549b1534c3"
---


안녕하세요! "Checkpoint", "VAE", "LoRA" 및 "Embedding"과 같은 용어가 혼란스러웠나요? "Stable Diffusion"을 탐험하면서 "pruned" 또는 "pruned-emaonly"와 같은 이름의 여러 버전의 체크포인트를 본 적이 있을 수도 있습니다. 어떤 것을 선택해야 할지 궁금해지기도 하죠.

걱정 마세요! 이 기사는 이러한 개념을 명확히 해주려는 목적으로 작성되었습니다. 초심자이든 전문가이든 여러분을 위한 내용이 준비되어 있습니다.

# I. Stable Diffusion에서 파일 이름 접미사 이해하기

Stable Diffusion을 보다 깊게 이해하기 위해 파일 이름 접미사로 시작해보겠습니다. 이 도메인에서 .ckpt 및 .safetensors 두 가지 일반적인 접미사가 있습니다.

<div class="content-ad"></div>

## .ckpt: 체크포인트

.ckpt 확장자는 "체크포인트"를 의미합니다. 이 형식은 TensorFlow 기계 학습 프레임워크에서 모델 매개변수를 저장하는 데 널리 사용됩니다. 종종 .ckpt 파일은 훈련 프로세스를 재개하기 위해 .meta 파일과 함께 작동합니다.

.ckpt 모델을 비디오 게임에서 진행상황 저장하는 것과 같다고 생각해보세요. 게임을 다양한 수준에서 저장해 진전상태를 잃지 않도록 하는 것처럼, 모델 훈련은 유사한 체크포인트를 사용합니다. 훈련 중에 가능한 중단 또는 실패로 인해 주기적으로 체크포인트가 작성됩니다—20%, 40% 등—모델의 현재 상태를 보존합니다. 이러한 실천은 마지막 체크포인트부터 훈련을 재개할 수 있도록 하여 처음부터 다시 시작하지 않도록 보장합니다.

.ckpt 외에도 .pt 모델 형식을 언급하는 것이 중요합니다. .ckpt는 TensorFlow에서 사용되는 반면, .pt는 PyTorch에서 모델 매개변수를 저장하는 데 사용되는 형식입니다. TensorFlow와 PyTorch는 둘 다 유명한 딥 러닝 프레임워크로, TensorFlow는 Google에 의해 개발되었고, PyTorch는 Facebook에 의해 개발되었습니다.

<div class="content-ad"></div>

파이토치는 모델을 저장하기 위해 .pth 및 .pkl 형식도 사용합니다. .pt와 .pth 파일 사이에는 큰 차이가 없는 반면 .pkl 파일은 Python의 pickle 모듈을 사용하여 직렬화하는 추가 단계가 필요합니다.

## .safetensors: 안전한 대안

이제 .safetensors 모델에 대해 이야기해 봅시다. .safetensors 접미사는 Hugging Face에서 도입된 새로운 모델 저장 형식을 나타냅니다. 이 형식은 Stable Diffusion 모델을 위해 특별히 설계되었습니다.

.ckpt 형식은 모델 가중치, 옵티마이저 상태 및 일부 Python 코드를 포함한 상세한 훈련 정보를 저장하여 어디서든 훈련을 재개할 수 있도록 합니다.

<div class="content-ad"></div>

그러나 이 방법에는 두 가지 주요 단점이 있습니다. 첫째, .ckpt 파일에는 악성 코드가 포함될 수 있으므로 신뢰할 수 없는 소스에서 다운로드할 때 보안 위험이 발생할 수 있습니다. 둘째, 이러한 파일은 일반적으로 대형이며, 실제 버전의 단일 체크포인트의 경우 약 7GB, 애니메이션 버전의 경우 2-5GB 정도입니다.

.safetensors 형식은 모델 가중치만 저장하여 옵티마이저 상태 및 기타 정보를 제외하여 이러한 문제를 해결합니다. 이로써 최종 모델 버전에 적합하며, 성능이 주요 관심사이며 교육 과정 세부 정보는 중요하지 않은 경우에 적합합니다. .safetensors 파일은 가중치만 포함하고 코드가 없기 때문에 .ckpt 파일에 비해 안전하며 일반적으로 작고 빠르게 로드됩니다.

## 각 형식을 사용하는 시기

요약하면, Stable Diffusion 모델의 체크포인트를 세밀하게 조정하려는 경우 .ckpt 형식이 선호됩니다. 그러나 생성된 이미지의 출력 품질에만 초점을 맞추려는 경우 보안성과 효율성이 향상된 .safetensors 형식이 더 나은 선택입니다.

<div class="content-ad"></div>

# II. 안정적 확산에서 모델 분류하기

안정적 확산에서 모델은 다섯 가지 주요 유형으로 분류됩니다: 체크포인트, VAE, LoRA, 임베딩, 그리고 하이퍼네트워크.

## 2.1 체크포인트

체크포인트 파일은 안정적 확산 프로세스에 필수적입니다.

<div class="content-ad"></div>

이 파일들은 모델에 대한 지식베이스 역할을 합니다. 예를 들어, 애니메이션 이미지로 체크포인트를 훈련시키면 생성된 이미지는 애니메이션 스타일을 가질 것입니다.

반면에, 실제 사진으로 훈련하면 더 현실적인 결과물을 얻을 수 있습니다. 훈련에 필요한 방대한 데이터로 인해, 체크포인트 파일은 일반적으로 2GB를 초과하는 크기로 큽니다. 이 파일들은 .ckpt 및 .safetensors 파일 확장자를 사용합니다.

## 2.2 VAE

VAE는 Variational Autoencoder의 약자로, 필터 효과와 비슷합니다. 이미지 생성 중, 주로 출력물의 색상 계획에 영향을 줍니다.

<div class="content-ad"></div>

보통 VAE 없이는 이미지가 더 어두워 보입니다. VAE를 사용하면 이미지가 밝아집니다.

![이미지](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_0.png)

그러나 일부 체크포인트는 훈련 중에 VAE 효과를 포함할 수 있습니다. 따라서 명시적으로 VAE를 사용하지 않더라도 생성된 이미지가 어둡게 나타나지 않을 수 있습니다.

가끔 VAE를 사용하면 원치 않는 효과가 발생할 수도 있습니다. 예를 들어 이미지가 파란색으로 변할 수 있습니다. 이를 피하기 위해 VAE 상태를 "자동"으로 설정할 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_1.png" />

## 2.3 LoRA

로라(LoRA)는 Microsoft 연구원들이 개발한 미세 조정 기술입니다. 이 방법은 대규모 모델을 특정 작업에 더 유연하고 효율적으로 만들어줍니다. 예를 들어 생성된 이미지의 스타일을 수정하는 작업과 같은 특정 작업에 대해 전체 모델을 처음부터 다시 학습시킬 필요 없이 큰 모델을 향상시키는 데 사용됩니다.

예를 들어, 로라 모델은 체크포인트에 반짝이는 숲 붉은수세미 효과를 추가하여 전체 체크포인트를 다시 학습시킬 필요 없이 효율성을 높일 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_2.png)

LoRA 모델은 독립적으로 작동하지 않고 체크포인트와 함께 사용해야 함을 기억하는 것이 중요합니다.

LoRA 모델은 훈련에 적은 이미지를 필요로 하기 때문에 파일 크기가 일반적으로 작으며, 수십에서 수백 MB의 범위에 있어서 디스크 공간을 절약합니다. 예를 들어 위의 예시는 100여 개의 이미지를 사용하였습니다.

마지막으로, 일부 LoRA 모델은 효과를 활성화하기 위해 프롬프트에 트리거 단어가 필요합니다. 예를 들어 위 LoRA의 경우 트리거 단어는 "jellyfishforest"입니다.


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_3.png)

## 2.4 임베딩

임베딩, 또는 텍스트 역변환,은 Stable Diffusion에서 사용되는 기술로 입력 프롬프트를 단일 벡터로 통합하여 이미지 생성의 안정성과 정확성을 향상시키는 기법입니다.

Stable Diffusion을 사용하여 D.Va의 이미지를 생성하려면 대개 여러 프롬프트를 사용하여 그의 외모를 설명해야 합니다. 이러한 프롬프트를 새로운 단일 프롬프트로 묶는 임베딩을 통해 이러한 작업을 간소화할 수 있습니다. 예를 들어, 이 새로운 프롬프트를 "D.Va"라고 합시다.

<div class="content-ad"></div>

임베딩 모델을 사용하면 “D.Va”를 입력하여 원하는 이미지를 생성할 수 있습니다. 이 방법을 사용하면 프롬프트를 작성하는 효율이 크게 향상됩니다.

임베딩 모델은 프롬프트를 통합하기 때문에 파일 크기가 매우 작으며 일반적으로 수십 KB에서 수백 KB 사이입니다.

아름다운 여성인 캐롤린 데어를 묘사하는 임베딩을 고려해보세요:

![Caroline Dare](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_4.png)

<div class="content-ad"></div>

이 임베딩과 연관된 트리거 단어를 입력하면 비슷한 이미지가 생성됩니다:

생성된 이미지는 사용된 체크포인트의 차이로 완전히 동일하지 않을 수 있지만, 흰 머리카락과 같은 더 분명한 특징들은 일관됩니다.

## 2.5 하이퍼네트워크

하이퍼네트워크는 다른 신경망의 매개변수를 생성하는 신경망 기반 모델로, 종종 NovelAI의 Stable Diffusion 모델에서 사용됩니다.

<div class="content-ad"></div>

하이퍼네트워크는 원본 모델의 핵심 구조를 변경하지 않고 출력 스타일을 수정하기 위해 작은 네트워크를 삽입하여 모델을 세밀하게 조정할 수 있습니다. 그러나 이 기능은 LoRA와 중복되어 실제로는 덜 사용됩니다.

# III. 가지치기 및 Emaonly 모델

체크포인트를 다운로드할 때 아래 예시처럼 두 가지 버전을 만나게 될 수 있습니다: pruned 및 pruned-emaonly입니다.

![](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_5.png)

<div class="content-ad"></div>

훈련 중 체크포인트 파일은 두 가지 다른 가중치 세트를 저장합니다:

- Pruned:

- 이 버전은 모든 훈련 반복 후 모델의 최종 가중치를 포함합니다.
- 이 가중치는 추가 부드러움 없이 훈련 중 마지막 업데이트 결과를 직접 반영합니다.
- 사용 사례: 훈련 데이터의 포괄적인 표현 때문에 파인튜닝에 적합합니다.

2. Pruned-Emaonly:

<div class="content-ad"></div>

- 최신 몇 번의 반복에서 가중치의 지수 이동 평균(EMA)을 사용한 버전입니다.
- EMA 기술은 가중치를 평균화하여 단기 변동의 영향을 줄여 일반화를 개선하고 더 안정적인 성능을 제공합니다.
- 활용 사례: 안정성 및 더 작은 크기로 인해 직접 이미지를 생성하는 데 이상적이며, VRAM을 적게 사용합니다.

## 실용적인 영향

가지치기된 모델:

- 크기가 큼.
- 더 많은 VRAM을 사용함.
- 세밀한 조정 목적에 가장 적합함.

<div class="content-ad"></div>

잘라낸 Emaonly 모델:

- 사이즈가 작습니다.
- VRAM을 덜 필요로 합니다.
- 이미지 생성에 최적화되어 있습니다.

![이미지](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_6.png)

이러한 차이를 이해하여 귀하의 요구사항에 맞는 적절한 모델 버전을 선택할 수 있습니다 — 미세 조정을 위한 것이든 안정적인 이미지를 직접 생성하기 위한 것이든.

<div class="content-ad"></div>

# IV. 인기 체크포인트 소개

안정된 확산 체크포인트는 여러 유형으로 분류됩니다: 공식 체크포인트, 애니메이션 체크포인트, 현실적 체크포인트, 그리고 판타지 체크포인트.

## 4.1 공식 체크포인트

공식 체크포인트는 1.X 시리즈와 2.X 시리즈로 나뉩니다.

<div class="content-ad"></div>

1. X 시리즈: v1-1, v1-2, v1-3 및 v1-4 네 가지 버전이 있습니다. 이 체크포인트들은 Hugging Face: CompVis/stable-diffusion에서 이용 가능합니다.

![이미지](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_7.png)

- 추가로, 텍스트에서 비디오 생성 작업에서 뛰어난 성능으로 알려진 Runwayml이 v1-5 버전을 출시했습니다. 해당 버전은 [Runwayml의 Stable Diffusion v1-5](2)에서 찾을 수 있습니다.

2. X 시리즈: StabilityAI가 출시한 2-0 및 2-1 두 버전이 있습니다. 접근은 가능합니다:

<div class="content-ad"></div>

- Stable Diffusion 2.0 by StabilityAI
- Stable Diffusion 2.1 by StabilityAI

## 4.2 Anime Checkpoints

The Anything series is a popular choice for anime-style images, with four main versions: V1, V2.1, V3, and V5, with Prt being a special version of V5. These models are versatile, not only excelling at generating anime images but also performing well with portraits, landscapes, and animals.

![image](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_8.png)

<div class="content-ad"></div>

## 4.3 현실적인 체크포인트

Realistic Vision은 고품질의 현실적 이미지를 생성하는 능력으로 유명합니다. CivitAI의 다음 이미지는 그 현실성을 보여줍니다.

![Realistic Image](/assets/img/2024-06-23-MasterStableDiffusionmodelscheckpointVAELoRAembeddingandmore_9.png)

## 4.4 판타지 체크포인트

<div class="content-ad"></div>

판타지 체크포인트는 2D와 3D 미술 요소를 혼합하여 깊이를 더하지만 완전한 3D가 되지 않는 이미지를 만듭니다. AniVerse는 이 카테고리에서 가장 잘 알려진 모델 중 하나로, 멋진 독특한 시각적 효과를 만들어 냅니다.

# 결론

요약하자면, Stable Diffusion은 Midjourney나 DALL-E와 같은 모델보다 복잡하며 원하는 결과를 얻기 위해 다양한 체크포인트를 사용해야 합니다. 이 초기 복잡성은 다양성과 상세한 제어로 균형을 이루어, 다양한 이미지를 생성하는 강력한 도구로 만들어졌습니다.

— by公众号：AI技术巫

<div class="content-ad"></div>

## 참고 자료

- 예시 체크포인트: Runwayml/stable-diffusion-v1-5
- Stable Diffusion v1-5 - Runwayml의 Hugging Face Space: runwayml/stable-diffusion-v1-5

💡 깊게 파보고 싶나요? 제 Stable Diffusion 컬렉션이 여러분을 기다리고 있어요.

## 글이 마음에 드셨나요?

<div class="content-ad"></div>

그렇다면:

- 댓글을 남겨주세요
- 업데이트를 팔로우해주세요
- 무료 이메일 알림을 받아보세요