---
title: "안정적인 확산 모델 비교하기"
description: ""
coverImage: "/assets/img/2024-06-19-ComparingStableDiffusionModels_0.png"
date: 2024-06-19 21:01
ogImage: 
  url: /assets/img/2024-06-19-ComparingStableDiffusionModels_0.png
tag: Tech
originalTitle: "Comparing Stable Diffusion Models"
link: "https://medium.com/@promptingpixels/comparing-stable-diffusion-models-2c1dc9919ab7"
---


안녕하세요! 저희의 오픈소스 텍스트-이미지 모델 'Stable Diffusion'은 Stability AI에서 출시되었고, 생성적 AI 분야를 혁신했습니다.

2022년 첫 출시 이후 몇 년 동안 여러번의 반복과 개선이 이루어졌습니다.

주요 릴리스에 대해 알아야 할 내용은 다음과 같습니다:


| 버전 번호    | 릴리스 날짜     |
|-------------|----------------|
| 1.1         | 2022년 6월     |
| 1.2         | 2022년 6월     |
| 1.3         | 2022년 6월     |
| 1.4         | 2022년 8월     |
| 1.5         | 2022년 10월    |
| 2.0         | 2022년 11월    |
| 2.1         | 2022년 12월    |
| XL 1.0      | 2023년 7월     |
| XL Turbo    | 2023년 11월    |
| Cascade     | 2024년 2월     |
| 3.0         | 곧 출시 예정    |


더 필요한 정보가 있거나 궁금한 점이 있으면 언제든지 물어주세요!

<div class="content-ad"></div>

# Stable Diffusion 1.x 모델

Stable Diffusion 모델의 첫 번째 세대인 1.x 시리즈는 1.1, 1.2, 1.3, 1.4 및 1.5 버전을 포함합니다.

이러한 모델은 512x512 픽셀의 해상도를 가지며 텍스트 조건부로 ViT-L/14 CLIP 모델을 사용합니다.

1.x 모델은 총 8억 6000만 개의 매개변수를 가지고 있습니다.

<div class="content-ad"></div>

# 샘플 출력

# 주요 사항

- 해상도 (픽셀): 512x512
- 모델 카드
- 라이선스: Creative ML OpenRAIL-M — 상업적 및 비상업적 사용 가능

이 모델을 사용하는 좋은 사례: 다양한 스타일과 주제를 생성합니다. 상대적으로 낮은 계산 요구 사항입니다.

<div class="content-ad"></div>

이 모델의 부적절한 사용 사례: 약한 프롬프트 이해와 해결. 변형된 주제. 평평해 보이는 이미지.

## 세밀하게 조정된 모델

알고 보면 Stable Diffusion 1.5가 그리 좋아 보이지 않는 결과물을 제공하지만, 오픈 소스 커뮤니티에는 훨씬 뛰어난 모델이 많이 있습니다.

포토 리얼리즘, 만화, 애니메이션 이미지 등을 포함한 수천 가지 특정 사용 사례에 대한 모델이 있습니다.

<div class="content-ad"></div>

예를 들어, DreamShaper, Juggernaut 및 RealCartoon은 안정적 확산 1.5를 기본 모델로 사용하지만 놀라운 결과를 제공하는 몇 가지 모델 중의 몇 가지입니다:

## 안정적 확산 2.x 모델

2022년 말에 출시된 2.x 시리즈에는 2.0 및 2.1 버전이 포함됩니다. 이러한 모델은 768x768 픽셀의 해상도를 갖추고, ViT-H/14라는 다른 CLIP 모델을 사용하여 프롬프트를 더 표현적으로 만듭니다.

2.x에서 사용된 다른 CLIP 모델로 인해 사람들이 1.x에서 마이그레이션하는 것이 어려워졌습니다. 사실 프롬프트가 그렇게 잘 전환되지 않아서 오픈 소스 커뮤니티에서의 널리 사용이 급격히 줄었습니다.

<div class="content-ad"></div>

아래는 텍스트를 친절한 한국어로 번역한 것입니다.

이 모델들의 매개변수 개수는 GitHub Readme에 따르면 1.5억개로 동일합니다.

# 샘플 출력

# 주요 사항

- 해상도 (픽셀): 768x768
- 모델 카드
- 라이선스: CreativeML Open RAIL++-M — 상업적 및 비상업적 사용

<div class="content-ad"></div>

이 모델의 좋은 사용 사례: 1.x 모델과 비교하여 더 높은 해상도의 출력물. 복잡하고 표현력이 풍부한 프롬프트를 효율적으로 처리. 사람보다는 건축물과 풍경 소재에 대한 성능이 뛰어남. 다양한 색상의 동적 범위를 제공함.

이 모델의 부적합한 사용 사례: 세대에 제약이 많음. 유명인과 미술 양식에 대한 검열이 있음.

# 세분화된 모델

안정적인 확산 2.0 및 2.1은 오픈 소스 커뮤니티에서 1.5만큼 널리 채택되지 않았습니다. 그러나 세분화된 모델은 일부 존재합니다.

<div class="content-ad"></div>

# Stable Diffusion XL 1.0

2023년에 출시된 SDXL 1.0은 중간단계와 Dall-E 수준의 결과물을 소비자용 하드웨어에서 실행할 수 있습니다. 1024x1024 픽셀의 해상도를 제공하며 텍스트 조건부로 OpenCLIP-ViT/G 및 CLIP-ViT/L을 활용하는 SDXL을 통해 원하는 결과를 훨씬 쉽게 얻을 수 있습니다.

초기 출시인 Stability AI의 SDXL 1.0은 35억 개의 기본 모델 파라미터와 66억 개의 모델 앙상블 파이프라인을 갖추고 있습니다:

![Stable Diffusion Models](/assets/img/2024-06-19-ComparingStableDiffusionModels_0.png)

<div class="content-ad"></div>

# 샘플 출력

# 주요 사항

- 해상도 (픽셀): 1024x1024
- 모델 카드  
- 라이선스: CreativeML Open RAIL++-M 라이선스 — 상업적 및 비상업적 사용 가능

이 모델의 좋은 사용 사례: 안정적인 확산 모델 중에서 가장 높은 해상도 출력. 개선된 색상 깊이, 구성, 전체 이미지 품질. 복잡한 프롬프트와 개념의 이해가 더 좋아짐.

<div class="content-ad"></div>

이 모델의 적합하지 않은 사용 사례: 로컬에서 실행하려면 상당한 계산 자원이 필요합니다. 소비자급 하드웨어에서 실행하기 어려울 수도 있습니다. 손과 같은 것들은 아직 완벽하지 않을 수 있습니다.

# 세밀하게 조정된 모델

오픈 소스 커뮤니티는 SDXL을 환영하고 SDXL로 품질 높은 출력물을 생산하는 몇 가지 세밀하게 조정된 모델을 출시했습니다.

Juggernaut XL, DreamShaper XL, RealVisXL, Animagine XL 등이 인기가 많으며 다양한 사용 사례를 제공할 수 있습니다:

<div class="content-ad"></div>

# SDXL Turbo

SDXL Turbo은 SD XL 1.0의 간추린 버전으로, 512x512 픽셀 이미지를 빠르게 생성하기 위해 설계되었습니다. SD XL 1.0과 동일한 텍스트 조건 모델을 사용하며 35억 개의 매개변수를 갖고 있습니다. SDXL Turbo는 단 한 단계만으로 이미지를 생성할 수 있습니다.

# 샘플 출력

# 주요 사실:

<div class="content-ad"></div>

- 해상도 (픽셀): 512x512
- 모델 카드
- 라이선스: 비상용 소프트웨어 — 비상업적 사용만 가능

**이 모델을 잘 활용할 수 있는 경우:** 짧은 시간 안에 좋은 결과물을 제공합니다. 프로토타입 애플리케이션 및 워크플로에 유용합니다. 실시간 실험에 적합합니다.

**이 모델을 잘 활용하지 못하는 경우:** 비상업용 라이선스로 개인 및/또는 연구용으로만 사용이 가능합니다.

# 세밀하게 조정된 모델

<div class="content-ad"></div>

2.1처럼 SDXL Turbo의 오픈 소스 모델 생태계는 제한적입니다. 모델은 존재하지만, 대부분의 제작자들이 SDXL 및 SD 1.5와 같이 더 인기 있는 기본 모델에 노력을 기울이고 있습니다.

# Stable Cascade

Stable Cascade은 Würstchen 아키텍처를 사용하는 독특한 모델로, 더 효율적인 훈련 및 추론을 가능케 합니다. 3단계(C, B, A)로 작동하며, 압축 계수는 42입니다:

![Stable Cascade](/assets/img/2024-06-19-ComparingStableDiffusionModels_1.png)

<div class="content-ad"></div>

Stages C (10억 또는 36억 개의 매개변수) 및 B (7억 또는 15억 개의 매개변수)은 상호 교환 가능하며 하드웨어 요구 사항 및/또는 제한에 따라 다양한 모델을 사용할 수 있습니다.

SDXL Turbo와 마찬가지로 Stable Cascade은 연구용 모델입니다.

## 샘플 출력

## 주요 사실:

<div class="content-ad"></div>

- 해상도 (픽셀): 1024x1024
- 모델 카드
- 라이선스: 소유권 제한 - 비상업적 사용만 허용

이 모델의 좋은 사용 사례: SDXL 품질의 출력물과 더 나은 프롬프트 이해를 제공합니다. 사용된 모델에 따라 더 빠른 출력을 제공할 수 있습니다. 손가락, 이빨 등의 세부사항을 더 잘 생성합니다.

이 모델의 부적합한 사용 사례: 모델을 불러오려면 상당한 VRAM이 필요합니다. 오픈 소스 커뮤니티의 광범위한 지원이 아직 확인되지 않았습니다.

# 세밀하게 조정된 모델들

<div class="content-ad"></div>

현재 Stable Cascade에 대해 Fein-tuned 모델은 매우 적습니다.

# Stable Diffusion 3.0

2024년 3월 발표된 Stable Diffusion 패밀리의 최신 버전인 Stable Diffusion 3.0입니다. 자세한 내용은 아직 부족하지만, 초기 결과로는 프롬프트 정렬 및 전체 이미지 품질에서 상당한 개선이 나타났습니다.

만약 Stable Diffusion 3이 출시되면 이 섹션을 업데이트하겠습니다.