---
title: "AI 이미지 생성에서 사용하는 스케줄러 5가지"
description: ""
coverImage: "/assets/img/2024-06-23-SchedulersinAIImageGeneration_0.png"
date: 2024-06-23 20:20
ogImage: 
  url: /assets/img/2024-06-23-SchedulersinAIImageGeneration_0.png
tag: Tech
originalTitle: "Schedulers in AI Image Generation"
link: "https://medium.com/invokeai/schedulers-in-ai-image-generation-2ca6d7458f17"
---


# 스케줄러란 무엇인가요?

스케줄러는 때때로 샘플러로 알려져 있으며, SDXL 및 SD1.5와 같은 Stable Diffusion 모델을 사용하여 이미지를 생성하는 확산 파이프라인의 중요한 부분입니다.

스케줄러는 노이즈를 제거하여 최종 이미지 출력물을 생성하는 과정을 안내합니다. 다음을 결정합니다:

- 노이즈 제거 단계의 수 및 각 단계의 크기(예: 큰 단계로 시작하여 최종 이미지에 가까워질수록 작은 단계를 취함)
- 단계가 무작위인지(확률적) 또는 예측 가능한지(결정론적) 여부
- 노이즈 제거에 사용되는 특정 방법(알고리즘)

<div class="content-ad"></div>

AI 이미지 생성에 익숙하지 않다면 HuggingFace의 이 기사를 읽어보거나 Invoke YouTube 채널의 Creating with AI 비디오를 시청해보세요.

![Image](/assets/img/2024-06-23-SchedulersinAIImageGeneration_0.png)

## 스케줄러 유형

다양한 종류의 스케줄러가 있으며, 각각은 사용되는 알고리즘에 따라 특정 범주에 속합니다. 여기에는 가장 흔히 사용되는 몇 가지 유형이 있습니다:

<div class="content-ad"></div>

- Euler 및 Euler 계통: Euler는 Invoke의 기본 스케줄러입니다. 속도가 빠른 것으로 알려져 있으며, 이러한 스케줄러들은 일반적으로 고품질 출력물을 생성하는 데 필요한 단계가 적습니다.
- Denoising Diffusion Implicit Models (DDIM): Stable Diffusion과 함께 사용되는 최초의 스케줄러 중 하나로, 효율성을 위해 설계된 DDIM은 처리 시간을 상당히 단축시켜줍니다.
- DPM: 이미지 품질 향상을 위한 미분 방정식의 근사 솔루션을 제공하는 이러한 스케줄러들은 단계 및 다단계 변형을 모두 사용할 수 있습니다.
- Heun Sampling: 이 스케줄러는 적응형 단계 크기 및 노이즈 종속 업데이트를 사용하여, 계산 효율성과 확산 과정의 정확한 추정에 중점을 둡니다.
- DPM2 Karras 및 DPM2 계속적인 Karras: DPM2 Karras는 이미지 생성에 대한 세밀한 제어를 허용하며, DPM2 계속적인 Karras는 다양성을 향상시키고 새로운 이미지 공간을 탐색합니다. DPM2 Karras는 잘 제어된 다양한 생성 출력물을 제공하는 데 뛰어납니다.
- UniPC: 샘플링 품질과 효율성을 향상시키는 통합형 예측-교정기 프레임워크입니다. 이 스케줄러는 속도가 중요한 생성에 적합합니다.
- Denoising Diffusion Probabilistic Models (DDPM): 이러한 모델은 고품질 샘플을 생성하지만, 일반적으로 최종 샘플을 생성하기 위해 많은 반복이 필요합니다. 고품질 출력물이 생성 속도보다 중요할 때 DDPM을 사용할 수 있습니다.
- 확산 모델용 의사 수치 방법(PNDM): 생성된 샘플 품질에 영향을 미치지 않고 DDPM을 가속화하기 위해 설계된 기술입니다.

# 멋지군요, 그런데 그게 제게 어떤 의미일까요?

스케줄러의 선택은 생성된 이미지의 결과에 상당한 영향을 미칠 수 있습니다.

이미지 생성을 위한 적절한 스케줄러 선택은 이미지 생성의 목표에 따라 달라집니다. 각 스케줄러는 독특한 강점과 트레이드오프를 가지고 있으므로, 이를 이해하면 여러분의 요구에 가장 적합한 스케줄러를 선택하는 데 도움이 될 수 있습니다.

<div class="content-ad"></div>

가장 인기있는 스케줄러 중 일부가 이미지 생성에 미치는 영향에 대한 예제를 제공합니다. 프롬프트, 시드 및 기타 설정은 동일합니다:

사용된 프롬프트: 회색 머리를 한 남자의 초상화, 8k, UHD

간략히 말씀드리자면, 이미지에 전반적으로 만족하면 다양한 스케줄러를 실험하여 최종 이미지를 얻어보세요!

# 더 알아보기

<div class="content-ad"></div>

더 깊이 들어가서 이미지 생성 및 Invoke에 대해 알아보고 싶나요? 여기 몇 가지 자료가 있어요:

- 웹 사이트를 살펴보세요: [Invoke 웹사이트](https://www.example.com)
- GitHub 및 문서를 확인하세요: [Invoke GitHub](https://github.com/invoke) 및 [Invoke 문서](https://docs.invoke.com)
- 디스코드에 가입하세요: [Invoke 디스코드](https://discord.gg/invoke)