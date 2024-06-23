---
title: "경량 GPU를 위한 실시간 고정확도 객체 탐지  YOLO-ReT 상세 리뷰"
description: ""
coverImage: "/assets/img/2024-06-23-BriefReviewYOLO-ReTTowardsHighAccuracyReal-timeObjectDetectiononEdgeGPUs_0.png"
date: 2024-06-23 18:39
ogImage: 
  url: /assets/img/2024-06-23-BriefReviewYOLO-ReTTowardsHighAccuracyReal-timeObjectDetectiononEdgeGPUs_0.png
tag: Tech
originalTitle: "Brief Review — YOLO-ReT: Towards High Accuracy Real-time Object Detection on Edge GPUs"
link: "https://medium.com/@sh-tsang/brief-review-yolo-ret-towards-high-accuracy-real-time-object-detection-on-edge-gpus-015baf211e62"
---


## YOLO-Ret, Jetson Nano 및 Jetson Xavier NX에서 실시간으로 작동하는 Jetson Xavier NGX

- 최신 기술의 다양한 특징 규모 간의 결합적 연결 부족을 활용하여 새로운 다중 규모 특징 상호 작용을 제안합니다.
- 또한 새로운 전이 학습 백본 절단도 제안됩니다.

# 개요

- YOLO-Ret
- 결과

<div class="content-ad"></div>

# 1. YOLO-Ret

![Image](/assets/img/2024-06-23-BriefReviewYOLO-ReTTowardsHighAccuracyReal-timeObjectDetectiononEdgeGPUs_0.png)

## 1.1. Raw Feature Collection and Redistribution (RFCR) Module

- 기존의 다중 스케일 피처 상호 작용 방식은 한 번에 두 개의 인접한 피처 스케일에만 초점을 맞추고 있습니다.
- 게다가 상하 방향의 반복 사용 시, 모델의 감지 정확도가 포화될 수 있습니다.

<div class="content-ad"></div>

- 이러한 레이어에는 무거운 계산이나 매개변수가 포함되지 않지만, 각 특성 스케일의 모든 쌍 사이에 직접적인 링크를 가능하게 합니다.
- YOLOv3 탐지 헤드에 3개의 출력 스케일이 있지만, RFCR은 네 가지 다른 백본 피처를 사용하여 모델 성능을 향상시킬 수 있는 보다 세분된 저수준 피처를 활용할 수 있습니다.

## 1.2. 백본 Truncation

![image](/assets/img/2024-06-23-BriefReviewYOLO-ReTTowardsHighAccuracyReal-timeObjectDetectiononEdgeGPUs_1.png)

- 실험에는 MobileNetV2 (×0.75 및 ×1.4) 및 EfficientNet-B3와 같이 3가지 일반적으로 사용되는 백본이 사용되며, 이들 백본은 다양한 블록으로 나뉩니다.


<div class="content-ad"></div>

- 위의 도표 2에서 결과를 기반으로 하면, MobileNetV2 버전의 마지막 두 블록과 EfficientNet의 마지막 세 블록을 백본으로 채택할 때 잘려진다.

## 2. 결과

### 2.1. 제거 연구

![도표 2](/assets/img/2024-06-23-BriefReviewYOLO-ReTTowardsHighAccuracyReal-timeObjectDetectiononEdgeGPUs_2.png)

<div class="content-ad"></div>

- 제안된 RFCR 모듈에는 추가로 ’shortcut’ 연결이 도입되었습니다. 이 추가된 ‘shortcut’은 백본의 더 얇은 레이어에서 비롯되어 정확성을 더 향상시키며, 정확한 탐지 작업에 대한 낮은 수준의 기능의 중요성을 강조합니다.

## 2.2. SOTA 비교

![이미지](/assets/img/2024-06-23-BriefReviewYOLO-ReTTowardsHighAccuracyReal-timeObjectDetectiononEdgeGPUs_3.png)

- 모델은 Jetson Nano, Jetson Xavier NX, Jetson Xavier NGX에 배포됩니다.