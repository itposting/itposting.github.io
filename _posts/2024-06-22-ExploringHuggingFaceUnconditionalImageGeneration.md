---
title: "Hugging Face 탐구 조건 없는 이미지 생성 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ExploringHuggingFaceUnconditionalImageGeneration_0.png"
date: 2024-06-22 21:56
ogImage: 
  url: /assets/img/2024-06-22-ExploringHuggingFaceUnconditionalImageGeneration_0.png
tag: Tech
originalTitle: "Exploring Hugging Face: Unconditional Image Generation"
link: "https://medium.com/towardsdev/exploring-hugging-face-unconditional-image-generation-25a51b93c1cb"
---


## 무조건적 이미지 생성

![이미지](/assets/img/2024-06-22-ExploringHuggingFaceUnconditionalImageGeneration_0.png)

무조건적 이미지 생성은 특정 가이드나 입력 없이 완전히 새로운 이미지를 생성하는 과정을 의미합니다. 조건적 이미지 생성과는 달리 텍스트 프롬프트나 참조 이미지를 사용하여 출력물을 유도하는 것과 달리, 무조건적 생성은 훈련 데이터로부터 학습된 통계적 패턴만을 기반으로 이미지를 생성합니다.

```python
# !pip install diffusers
from diffusers import DDPMPipeline, DDIMPipeline, PNDMPipeline

model_id = "google/ddpm-cifar10-32"

# 모델 및 스케줄러 로드
ddpm = DDPMPipeline.from_pretrained(model_id)  # 빠른 추론을 위해 DDPMPipeline 대신 DDIMPipeline 또는 PNDMPipeline으로 대체할 수 있습니다.

# 추론 파이프라인 실행 (랜덤 노이즈 샘플링 및 노이즈 제거)
image = ddpm().images[0]

# 이미지 저장
image.save("ddpm_generated_image.png")
```

<div class="content-ad"></div>

```MD
![Exploring HuggingFace Unconditional Image Generation](/assets/img/2024-06-22-ExploringHuggingFaceUnconditionalImageGeneration_1.png)

import tensorflow as tf
import matplotlib.pyplot as plt
from huggingface_hub import from_pretrained_keras

seed = 42
n_images = 36
codings_size = 100
generator = from_pretrained_keras("huggan/crypto-gan")

def generate(generator, seed):
    noise = tf.random.normal(shape=[n_images, codings_size], seed=seed)
    generated_images = generator(noise, training=False)

    fig = plt.figure(figsize=(10, 10))
    for i in range(generated_images.shape[0]):
        plt.subplot(6, 6, i+1)
        plt.imshow(generated_images[i, :, :, :])
        plt.axis('off')
    plt.savefig("samples.png")
    
generate(generator, seed)

![Exploring HuggingFace Unconditional Image Generation](/assets/img/2024-06-22-ExploringHuggingFaceUnconditionalImageGeneration_2.png)

## 추가 정보
```

<div class="content-ad"></div>

## 참고 자료

- [huggingface.co - 무조건 이미지 생성](https://huggingface.co/tasks/unconditional-image-generation)
- [huggingface.co - 디퓨저(en) 문서 - 무조건 훈련](https://huggingface.co/docs/diffusers/en/training/unconditional_training)
- [huggingface.co - 구글/ddpm-cifar10-32](https://huggingface.co/google/ddpm-cifar10-32)

<div class="content-ad"></div>

https://huggingface.co/huggan/crypto-gan