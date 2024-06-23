---
title: "Creality Ender-3 V2의 전력 소비 얼마나 전력을 사용할까"
description: ""
coverImage: "/assets/img/2024-06-23-PowerConsumptionoftheCrealityEnder-3V2_0.png"
date: 2024-06-23 17:25
ogImage: 
  url: /assets/img/2024-06-23-PowerConsumptionoftheCrealityEnder-3V2_0.png
tag: Tech
originalTitle: "Power Consumption of the Creality Ender-3 V2"
link: "https://medium.com/@ermanas/power-consumption-of-the-creality-ender-3-v2-eb946d9fbbd3"
---


3D 프린팅 사업에 뛰어들기 전에, 특히 3D 프린팅 서비스 제공을 시작하기 전에, 나는 내 3D 프린터의 운영 비용에 대해 궁금해 했습니다. 그리고 알리익스프레스에서 약 8달러에 기본 스마트 소켓을 구매한 후, 이러한 측정을 준비했습니다. 그럼 시작해볼까요,

# TLDR — 전력 소비 표

인쇄 프로세스 중 — 110 와트 (평균)
모델의 총 인쇄 시간에 직접 곱하기만 하면 됩니다.

간단히(평균적으로):

<div class="content-ad"></div>

아래 표에서 각 작업의 전력 소비량을 개별적으로 확인할 수 있습니다. 모든 값은 평균값이며 독립적인 소비량을 보여줍니다.

또한 아래 초기 가열 값을 총 전력 소비량에 추가할 수도 있지만, 그들이 큰 차이를 만들지는 않습니다.
` 히팅 베드 60°C로 가열 - 1Wh
` 히팅 노즐 210°C로 가열 - 8Wh

<div class="content-ad"></div>

# 보정 큐브의 예시 계산

보정 큐브의 총 비용을 계산하는 예시를 살펴봅시다.

![image](/assets/img/2024-06-23-PowerConsumptionoftheCrealityEnder-3V2_2.png)

레이어 높이: 0.2 mm
베드 온도: 60°C
노즐 온도: 210°C
필라멘트: PLA — 4 그램
인쇄 시간: 30 분

<div class="content-ad"></div>

PLA 1kg - ₺400 | 4g - ₺1.6
전기 요금: 1kWh당 ₺1.5 (터키)
전기 소비량: 55Wh (0.5시간) + 9Wh (초기 가열) = 64Wh

필라멘트 비용: 0.004 x 400 = ₺1.6
전기 요금: 1.5 x 0.064 = 약 ₺0.1
총 비용 = ₺1.7

필라멘트 비용과 비교했을 때 거의 없지만 알아두는 것도 좋아요 :).

# 테스트 조건

<div class="content-ad"></div>

환경
- 실내 온도: 25°C
- 습도: 50%

가열 온도
- 노즐: 200°C
- 베드: 60°C

마더보드: Creality V4.2.2

**크레딧**

<div class="content-ad"></div>

내 친구 멜리 나피 에킴에게 스마트 소켓의 측정을 확인해 주어서 감사합니다.