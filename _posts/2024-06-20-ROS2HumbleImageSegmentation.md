---
title: "ROS2 겸손한 이미지 세분화"
description: ""
coverImage: "/assets/img/2024-06-20-ROS2HumbleImageSegmentation_0.png"
date: 2024-06-20 17:50
ogImage: 
  url: /assets/img/2024-06-20-ROS2HumbleImageSegmentation_0.png
tag: Tech
originalTitle: "ROS2 Humble Image Segmentation"
link: "https://medium.com/@kabilankb2003/ros2-humble-image-segmentation-ef3f7734aa75"
---



<img src="/assets/img/2024-06-20-ROS2HumbleImageSegmentation_0.png" />

# 소개

이 튜토리얼에서는 DeepLabV3 모델을 사용하여 이미지의 의미론적 세분화를 수행하는 ROS2 노드를 만들 것입니다. ResNet-101 백본을 사용한 이 모델은 의미론적 세분할 작업에 대한 최신 아키텍처입니다. 노드는 웹캠 피드를 구독하고 이미지를 처리한 후 세그멘테이션을 수행하고 세분화된 이미지를 게시할 것입니다.

## 준비물


<div class="content-ad"></div>

아래 설치되어 있는지 확인하세요:

- ROS2 (Humble)
- PyTorch
- OpenCV
- cv_bridge (ROS 이미지와 OpenCV 이미지 간 변환을 위한)
- torchvision (사전 학습 모델과 이미지 변환을 위한)

## DeepLabV3

DeepLabV3은 시맨틱 세그멘테이션 작업을 위해 설계된 최신 딥러닝 모델입니다. 시맨틱 세그멘테이션은 이미지의 각 픽셀을 미리 정의된 범주로 분류하는 작업을 포함합니다. 물체 감지와 달리 물체를 식별하고 주위에 바운딩 상자를 넣는 대신, 시맨틱 세그멘테이션은 장면에 대한 상세하고 픽셀 수준의 이해를 제공합니다.

<div class="content-ad"></div>

## DeepLabV3의 주요 기능

ResNet 백본: DeepLabV3은 특성 추출을 위해 ResNet-101을 사용합니다. ResNet-101은 잔차 학습 방식으로 유명한 강력하고 깊은 신경망으로, 사라져가는 그래디언트 문제를 해결하여 매우 깊은 네트워크를 효율적으로 훈련할 수 있으며 견고한 특성 추출을 보장합니다.

## DeepLabV3 작동 방식

- 입력 이미지: 고정된 크기(예: 512x512 픽셀)의 입력 이미지로 프로세스가 시작됩니다.
- 특성 추출: 입력 이미지는 ResNet-101 백본을 통해 전달됩니다. 이 네트워크는 ImageNet과 같은 대규모 데이터셋에서 사전 훈련되어 다양한 시각적 특성에 대한 견고한 이해력을 갖추고 있습니다.
- 어트러스 합성곱 레이어: 초기 특성 추출 후, 모델은 다양한 확장률을 가진 일련의 어트러스 합성곱을 적용합니다. 이 단계를 통해 모델은 다양한 크기의 객체를 분할하는 데 중요한 다중 스케일의 특성을 캡처할 수 있습니다.
- 공간 피라미드 풀링: 어트러스 합성곱의 출력은 공간 피라미드 풀링 모듈로 전달됩니다. 이 모듈은 다양한 스케일에서 특성을 풀링하여 이미지의 풍부한 다중 문맥적 표현을 제공합니다.
- 분할 맵: 마지막으로, 풀링된 특성은 원본 이미지 해상도로 업샘플링되고 최종 합성곱 레이어가 분할 맵을 생성합니다. 이 맵의 각 픽셀에는 클래스 레이블이 지정되어 이미지의 상세한 세그멘테이션이 이루어집니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-ROS2HumbleImageSegmentation_1.png" />

## DeepLabV3

- Architecture: DeepLabV3는 시멘틱 이미지 세그멘테이션을 위해 설계된 딥러닝 모델입니다. Dilated (확장된) 합성곱을 활용하여 수용 영역을 확대시키면서도 공간 해상도를 유지하는 방식으로 다중 스케일 문맥을 캡처합니다.
- Backbone: 여기서 사용된 백본은 ResNet-101이며, 보다 복잡한 표현을 학습하는 데 도움이 되는 깊은 잔여 네트워크입니다.
- 데이터 세트: 모델은 COCO 데이터 세트에서 사전 훈련을 받고 VOC 라벨로 세부 조정되어 이러한 데이터 세트에서 발견되는 공통 객체를 세분화할 수 있습니다.

## 모델 로딩 코드

<div class="content-ad"></div>

```js
self.model = torch.hub.load('pytorch/vision:v0.10.0', 'deeplabv3_resnet101', weights='DeepLabV3_ResNet101_Weights.COCO_WITH_VOC_LABELS_V1')
```

## 코드 단계

- 초기화: 모델은 SegmentationNode 클래스의 __init__ 메서드에서 초기화됩니다. torch.hub.load 메서드는 미리 훈련된 deeplabv3_resnet101 모델을 불러옵니다.
- 전처리: 입력 이미지는 모델의 입력 요구 사항과 일치하도록 크기 조정, 중앙 자르기 및 정규화됩니다.
- 추론: 이미지가 수신될 때 콜백에서 모델은 전처리된 이미지 텐서에 대해 추론을 수행합니다.
- 후처리: 모델의 출력은 각 픽셀의 클래스 점수를 포함하는 텐서입니다. 각 픽셀에서 가장 높은 점수가 클래스를 결정합니다. 그런 다음 결과는 PASCAL VOC 컬러 맵을 사용하여 컬러맵으로 변환된 세그멘테이션 이미지로 변환됩니다.

![image](/assets/img/2024-06-20-ROS2HumbleImageSegmentation_2.png)  


<div class="content-ad"></div>

## 어플리케이션: 시맨틱 세그멘테이션을 위한 ROS2 노드

실용적인 어플리케이션에서 DeepLabV3를 활용하기 위해 웹캠 이미지로부터 시맨틱 세그멘테이션을 수행하는 ROS2 (로봇 운영 시스템 2) 노드를 만들 수 있습니다. 다음은 단계별 개요입니다:

- 노드 초기화: 웹캠 이미지 토픽을 구독하는 ROS2 노드를 초기화합니다.
- 이미지 전처리: 들어오는 이미지를 DeepLabV3 모델이 필요로 하는 형식으로 변환합니다. 일반적으로 이미지 크기 조정 및 정규화를 수행합니다.
- 모델 추론: 전처리된 이미지를 DeepLabV3 모델을 통해 전파하여 세그멘테이션 맵을 얻습니다.
- 후처리: 세그멘테이션 맵을 원본 이미지 해상도에 맞게 업샘플링하고 클래스 레이블을 시각적으로 식별 가능한 색상으로 변환합니다.
- 결과 게시: 세그멘트된 이미지를 시각화나 추가 처리를 위해 ROS2 토픽에 게시합니다.

<img src="/assets/img/2024-06-20-ROS2HumbleImageSegmentation_3.png" />

<div class="content-ad"></div>

## 사용법

이 모델은 웹캠에서 수신한 이미지를 세분화하는 데 사용되며, COCO 및 VOC 데이터 세트에서 학습한 클래스에 따라 장면에서 다양한 개체를 식별하고 색칠합니다. 이 세분화된 이미지는 그런 다음 ROS 주제에 발행됩니다.

이 설정을 통해 물체 인식, 자율 탐사, 그리고 장면 이해를 포함한 여러 로보틱 응용 프로그램에 적합한 실시간 이미지 세분화가 가능합니다.

## 자율 탐사

<div class="content-ad"></div>

장애물 감지 및 회피:

- 도시 환경: 자율 주행 자동차에서 시멘틱 세분화는 차로, 인도, 보행자, 차량 및 도시 풍경의 다른 중요 요소를 식별하는 데 도움이 됩니다. 이러한 요소를 세분화함으로써, 자율 주행 차량은 복잡한 환경에서 안전하게 탐색할 수 있습니다.
- 실내 내비게이션: 실내에서 작동하는 로봇은 벽, 가구, 문 및 기타 장애물을 감지하기 위해 시멘틱 세분화를 사용할 수 있어 효과적으로 탐색과 경로를 계획할 수 있습니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*YcvLdT_wB5wd6jfa6f3xWA.gif)

## 결론

<div class="content-ad"></div>

DeepLabV3는 새로운 atrous convolution과 공간 피라미드 풀링 기술을 통해 높은 정확도와 효율성을 제공하는 시멘틱 세그멘테이션에 강력한 도구입니다. DeepLabV3를 ROS2와 통합함으로써, 개발자들은 환경을 픽셀 수준에서 이해하고 상호 작용하는 지능적인 로봇 응용 프로그램을 만들 수 있습니다. DeepLabV3를 사용하면 자율 주행, 로봇 조작 또는 장면 이해와 같은 영역에서 고급 인식을 위한 새로운 가능성이 열립니다.