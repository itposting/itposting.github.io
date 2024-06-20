---
title: "LaMa 탐색하기 푸리에 합성을 활용한 해상도 견고한 대규모 마스크 보정 간략한 개요"
description: ""
coverImage: "/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_0.png"
date: 2024-06-20 18:09
ogImage: 
  url: /assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_0.png
tag: Tech
originalTitle: "Exploring LaMa: Resolution-robust Large Mask Inpainting with Fourier Convolutions: A Brief Overview"
link: "https://medium.com/towards-artificial-intelligence/exploring-lama-resolution-robust-large-mask-inpainting-with-fourier-convolutions-a-brief-overview-593f29a3f8da"
---


# 소개

![이미지](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_0.png)

이미지 인페인팅은 이미지 내 손상된 부분이나 가리워진 영역을 주변 맥락을 기반으로 재구성하는 컴퓨터 비전 기술입니다. 2022년에 발표된 LaMa라는 GAN 기반 네트워크를 만날 수 있습니다. 이 네트워크는 가벼운 아키텍처로 알려져 있으며 대형 마스크 사례를 개선하기 위해 특별히 설계되었습니다.

이미지 인페인팅에서 큰 마스크의 문제는 무엇일까요?

<div class="content-ad"></div>


![Exploring LaMa Resolution](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_1.png)

이미지 인페인팅 모델은 주변 패치를 기반으로 빠진 부분을 다시 그리는 작업을 합니다. 더 큰 마스크는 복원 작업을 더 어렵게 만들며, 복구해야 할 정보가 많아지고 또한 의존할 수 있는 컨텍스트가 줄어드는 문제가 있습니다(큰 마스크 - 작은 배경). 그림 2에서는 다양한 크기의 마스크 영역이 있는 4개의 이미지가 있습니다. 배경의 복잡성을 고려하지 않고, 직사각형 마스크의 크기와 도전과제가 함께 증가하는 것을 관찰할 수 있습니다.

LaMa는 혁신적인 구조와 손실 함수로 큰 마스크 영역을 복원하는 데 특화되어 있습니다. 이 아이디어에 대해 궁금하다면, 다음 섹션으로 계속 진행해 보세요.

# 방법

<div class="content-ad"></div>

## 네트워크 아키텍처

![아키텍처](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_2.png)

네트워크 아키텍처부터 시작해 봅시다. LaMa는 생성자와 판별자로 구성된 GAN 기반의 작업입니다. 판별자와 손실 함수에 대해는 나중에 이야기할 것입니다. 생성자 네트워크 f의 구조는 위의 그림 3에 설명되어 있습니다.

- 네트워크 입력: 손상된 이미지 x와 이진 마스크 m이 제공되면, 네트워크 입력은 우리가 예측하려는 마스킹된 이미지와 마스크 m의 연결입니다.
- 네트워크: 네트워크는 시작 부분에서 다운스케일 단계, 중간에 일련의 잔여 블록, 그리고 끝에 역 스케일 업 단계로 구성됩니다. 잔여 블록은 다음 섹션에서 다룰 Fast Fourier Convolution으로 이루어져 있습니다.
- 네트워크 출력: 네트워크는 회복된 이미지 x̂를 출력합니다. 훈련 단계에서의 손실은 입력 x와 출력 x̂의 불일치에 기반합니다.

<div class="content-ad"></div>

LaMa의 혁신은 푸리에 변환 컨볼루션의 통합에 있습니다. 다음 섹션에서 세부 사항부터 시작하여 점차적으로 더 큰 맥락을 포함하도록 확장해 봅시다.

## 푸리에 변환

![이미지](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_3.png)

푸리에 변환은 이미지 및 신호 처리에서 공간/시간 영역의 입력을 주파수 영역으로 변환하는 고전적인 방법입니다. 이미지 처리에서 변환된 이미지는 입력 이미지와 동일한 크기를 공유하며 다음과 같은 특성을 갖습니다:

<div class="content-ad"></div>

- 변환된 이미지의 각 픽셀은 입력 이미지의 특정 주파수를 나타냅니다. 예를 들어, 그림 4 (b)의 중앙 영역은 낮은 주파수를 나타내며 이미지 테두리 쪽으로 이동할수록 주파수가 높아집니다.
- 이것은 자기 역변환 가능합니다. 변환된 이미지에 역변환을 적용하여 원본 이미지를 복원할 수 있습니다.

Fourier 변환의 중요한 속성 중 하나는 변환된 이미지의 각 픽셀이 공간 영역의 모든 픽셀에서 유래한다는 것입니다. 다시 말하면, 공간 영역의 이미지가 주파수 영역의 각 픽셀에 이미지로 인코딩되어 있습니다.

## Spectrum Transform

![그림](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_4.png)

<div class="content-ad"></div>

Fourier Transform 아이디어를 따라가면서 한 단계 더 들어가 봅시다.

푸리에 변환은 스펙트럴 변환이라는 블록에서 사용됩니다.

- 스펙트럴 변환은 표준 합성곱 블록 (Convolution-BatchNorm-ReLU)으로 시작합니다.
- 이어서 실수값 고속 푸리에 변환(Real FFT, 푸리에 변환의 한 변형)이 적용되어 특징 맵을 주파수로 변환합니다. 실수값 고속 푸리에 변환에서 사용되는 주파수는 절반뿐입니다.
- 주파수 영역의 특징 맵에 두 번째 표준 합성곱 블록을 적용합니다.
- 마지막으로 역 고속 푸리에 변환을 적용하여 특징 맵을 다시 공간 영역으로 변환합니다. 스펙트럼 변환은 채널 수를 두 배로 늘리기 위해 1x1 합성곱으로 끝납니다.

```js
class SpectralTransform(nn.Module):

    def __init__(self, in_channels, out_channels, stride=1, groups=1, enable_lfu=True, **fu_kwargs):
        # bn_layer 사용하지 않음
        super(SpectralTransform, self).__init__()
        self.enable_lfu = enable_lfu
        
        self.downsample = nn.Identity()

        self.conv1 = nn.Sequential(
            nn.Conv2d(in_channels, out_channels // 2, kernel_size=1, groups=groups, bias=False),
            nn.BatchNorm2d(out_channels // 2),
            nn.ReLU(inplace=True)
        )

        self.fu = FourierUnit(out_channels // 2, out_channels // 2, groups, **fu_kwargs)
        
        if self.enable_lfu:
            self.lfu = FourierUnit(out_channels // 2, out_channels // 2, groups)
        
        self.conv2 = torch.nn.Conv2d(out_channels // 2, out_channels, kernel_size=1, groups=groups, bias=False)

    def forward(self, x):

        x = self.downsample(x)
        x = self.conv1(x).  # 논문: [Conv-BN-ReLU]
        output = self.fu(x) # 논문: [Real FFT2d - Conv-BN-ReLU - Inv Real FFT2d]

        if self.enable_lfu:
            n, c, h, w = x.shape
            split_no = 2
            split_s = h // split_no
            xs = torch.cat(torch.split(x[:, :c // 4], split_s, dim=-2), dim=1).contiguous()
            xs = torch.cat(torch.split(xs, split_s, dim=-1),dim=1).contiguous()
            xs = self.lfu(xs)
            xs = xs.repeat(1, 1, split_no, split_no).contiguous()
        else:
            xs = 0

        output = self.conv2(x + output + xs). # 논문: [Conv 1x1]

        return output
```

<div class="content-ad"></div>

위 코드 블록에 구현 내용이 있습니다. 함수 forward() 내 인라인 코멘트는 Figure 5의 직사각형 블록에 대한 매핑을 설명합니다. 이 코드는 이해를 돕기 위해 기본 구성을 사용하여 공식 저장소²에서 간소화되었음을 참고해주세요.

## Fast Fourier Convolution (FFC)

이제 Figure 5의 왼쪽으로 이동하여 FFC의 개념이 그려진 곳으로 이동합시다. FFC는 여러 네트워크 연산자로 구성된 블록 모듈입니다. 입력 피처 맵은 글로벌 및 로컬 브랜치를 통해 분할되어 전달됩니다.

- 로컬 브랜치: 로컬 브랜치는 일반 컨볼루션 프로세스를 따릅니다: 컨볼루션 - 배치 정규화 - 활성화 함수.
- 글로벌 브랜치: 방금 살펴본 제안된 스펙트럼 변환은 글로벌 브랜치에서 적용되며 로컬 브랜치의 동일한 컨볼루션 프로세스와 함께 사용됩니다. 표준 컨볼루션 블록과 제안된 FFT 기반 블록을 결합하여 글로벌 브랜치의 출력은 지역적 피처와 전체 이미지 구조를 모두 담고 있습니다.

<div class="content-ad"></div>

로컬 및 글로벌 브랜치의 출력은 FFC의 끝에서 연결됩니다. 라마의 기본 아키텍처에서는 9개의 FFC가 구성되어 있습니다. FFC 초기화 스크립트는 아래와 같습니다.

```js
### Resnet 블록
# n_blocks = 9

for i in range(n_blocks):
    cur_resblock = FFCResnetBlock(feats_num_bottleneck, padding_type=padding_type, activation_layer=activation_layer,
                                          norm_layer=norm_layer, **resnet_conv_kwargs)
    if spatial_transform_layers is not None and i in spatial_transform_layers:
       cur_resblock = LearnableSpatialTransformWrapper(cur_resblock, **spatial_transform_kwargs)
       model += [cur_resblock]
```

## 손실 함수

<img src="/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_5.png" />

<div class="content-ad"></div>

높은 수용 영역 지각 손실 (HRFPL)
네트워크의 초기 레이어에서 FFC에 참여하는 것 외에도, LaMa의 또 다른 혁신은 새로운 손실 함수에 있습니다: 높은 수용 영역 지각 손실 (HRFPL).

HRFPL은 큰 마스크를 가진 샘플이 가시 영역의 컨텍스트가 충분하지 않아 세부 정보를 사용하여 누락된 부분을 복원할 수 없다는 가정에서 나옵니다. 입력 및 출력 이미지 사이의 철저한 픽셀별 비교는 불필요합니다. 대신, 네트워크는 효율적인 네트워크 ϕ에 의해 추출된 상위 수준의 컨텍스트를 살펴볼 수 있습니다. 더 간결한 아키텍처로, 수용 영역은 순전파하는 동안 더 빨리 성장합니다 (레이어가 적을수록 수용 영역이 더 빨리 성장합니다). 공식 구현에서는 Vgg19를 사용하여 이미지 특징을 추출합니다. HRFPL의 공식은 그림 6에서 찾을 수 있습니다.

```js
# 참조: https://github.com/advimman/lama/blob/3197c5e5e42503a66868e636ed48a7cefc5e8c28/saicinpainting/training/losses/perceptual.py#L67

손실 = F.mse_loss(features_input, features_target, reduction='none')
손실 = loss.mean(dim=tuple(range(1, len(loss.shape)))
```

차이를 계산하고 결과를 평균화하는 해당 Pytorch 스크립트를 위에서 찾을 수 있습니다.

<div class="content-ad"></div>

적대적 손실

![image](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_6.png)

다른 GAN과 유사하게, LaMa에서 생성자와 구분자 네트워크 간의 관계를 구축하기 위해 적대적 손실이 적용됩니다. LaMa의 적대적 손실은 구분자가 실제 영역에서 생성된 콘텐츠를 더 잘 식별하도록 장려하고, 생성자에게 마스크된 영역 내에서 더 현실적인 콘텐츠를 생성하도록 피드백하는 것을 목표로 합니다.

```js
# 참조: https://github.com/advimman/lama/blob/3197c5e5e42503a66868e636ed48a7cefc5e8c28/saicinpainting/training/trainers/default.py#L115
discr_real_pred, discr_real_features = self.discriminator(img)
discr_fake_pred, discr_fake_features = self.discriminator(predicted_img)
adv_gen_loss, adv_metrics = self.adversarial_loss.generator_loss(real_batch=img, fake_batch=predicted_img, discr_real_pred=discr_real_pred, discr_fake_pred=discr_fake_pred, mask=mask_for_discr)
```

<div class="content-ad"></div>

discriminator의 입력은 원본 이미지 x와 inpainted 이미지 x̂입니다. discriminator는 각 픽셀의 클래스를 real 또는 fake로 예측합니다. Adversarial Loss는 생성기 손실과 discriminator 손실을 결합하며 다른 기존 GAN과 동일한 개념을 공유합니다. 자세한 내용은 아래의 방정식에서 확인할 수 있습니다.

![equation_7](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_7.png)

총 손실

![equation_8](/assets/img/2024-06-20-ExploringLaMaResolution-robustLargeMaskInpaintingwithFourierConvolutionsABriefOverview_8.png)

<div class="content-ad"></div>

손실 함수를 마무리하는 시간이에요. 제안된 HRFPL 및 적대적 손실은 대형 마스크 케이스에서 정확도 측면에서 LaMa를 다른 인풋 네트워크들과 구분짓습니다. 두 가지의 아이디어가 8번 그림에 나와 있어요. HRFPL 및 적대적 손실 이외에도 두 가지 일반적으로 사용되는 손실 함수가 포함돼 있어요.

- 그래디언트 페널티
- 피처 매칭 손실: 판별자 네트워크의 피처에 대한 인식 손실

최종 손실은 네 가지 손실 함수의 가중 합으로 이루어져요.

<div class="content-ad"></div>

이 모든 것으로 LaMa가 두드러지는 점에 관한 이야기는 여기까지입니다.

간략히 말하면, LaMa는 Fast Fourier Convolution (FFC)을 통합하고 고수용 필드 지각 손실 (HRFPL)로 안내되는, 가벼운 Resnet과 유사한 네트워크입니다. 이는 채워져야 하는 대상 영역이 더 큰 경우에 특히 강력합니다. LaMa는 이미지 인페인팅 분야에서의 진전을 나타내며, 다양한 해상도에서 견고한 솔루션을 제공하고 어려운 인페인팅 시나리오를 처리할 수 있습니다.

다른 주제들도 원본 논문에서 논의되었습니다. 예를 들어, LaMa는 작은 256x256 이미지로 모델을 훈련하더라도 높은 해상도의 영역을 복원할 수 있다는 내용이 포함되어 있습니다. LaMa에 대해 더 알아보려면 원본 논문을 읽어보세요.

# 요약

<div class="content-ad"></div>

이 기사에서 LaMa의 아이디어를 다뤘어요. 이미지 인페인팅에서 인기 있는 네트워크 중 하나로, 방문할 가치가 있는 많은 커뮤니티 자원이 있어요. 일부 온라인 서비스는 람마의 기능을 사용할 수 있는 훌륭한 인터페이스를 제공해요.

늘 읽어 주셔서 감사합니다. 피드백과 의견은 언제나 환영해요. 모두에게 멋진 하루가 되길 바라요!

# 참고 자료

[1] Suvorov, R., Logacheva, E., Mashikhin, A., Remizova, A., Ashukha, A., Silvestrov, A., Kong, N., Goka, H., Park, K., & Lempitsky, V. (2021). Resolution-robust Large Mask Inpainting with Fourier Convolutions. ArXiv. /abs/2109.07161
[2] 공식 구현: https://github.com/advimman/lama
[3] https://developers.google.com/machine-learning/gan/loss