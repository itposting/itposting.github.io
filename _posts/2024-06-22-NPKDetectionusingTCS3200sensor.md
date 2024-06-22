---
title: "TCS3200 센서를 이용한 NPK질소, 인산, 칼륨 검출 방법"
description: ""
coverImage: "/assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_0.png"
date: 2024-06-22 18:45
ogImage: 
  url: /assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_0.png
tag: Tech
originalTitle: "NPK Detection using TCS3200 sensor"
link: "https://medium.com/@sumukhkowligi/npk-detection-using-tcs3200-sensor-fb34d40a674a"
---


NPK는 질소, 인 및 칼륨으로 토양에서 가장 기본적인 영양소입니다. 이 무기 성분들은 식물 성장에 도움이 되는 토양의 비옥도를 유지하는 데 중요합니다. 전통적인 NPK 센서는 토양 속 질소, 인 및 칼륨 함량을 결정하는 데 적합하며, 토양 내 질소, 인 및 칼륨 농도에 의해 유도된 전도도 변화를 검출하여 토양의 비옥도를 평가합니다. 그러나 이 센서의 단점은 토양에 삽입되어 값을 테스트해야 하며, 이 값은 특정 영역에만 적용되며 이 센서로 얻은 값은 토양 내 NPK 함량의 정확한 양을 측정할 수는 없지만 작농가들이 비료를 적용하는 데 도움이 되는 경험적 및 이론적 값이 제공됩니다. 따라서 현장 테스트는 수행할 수 없습니다. 이때 TCS3200 센서가 도움이 될 수 있습니다. NPK 센서보다 효율적이며 현장 토양 테스트를 쉽게 수행할 수 있습니다.

# TCS3200 센서:

![TCS3200](/assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_0.png)

위 이미지는 TCS3200 색상 센서입니다. 이 센서는 기본적으로 RGB 색상 센서이며 이미지에서 볼 수 있듯이 회로 기판의 각 모서리에 4개의 흰색 조명 LED와 4개의 단자가 있지만, 실제 센서는 중앙에 위치해 있습니다.

<div class="content-ad"></div>


![TCS3200 Sensor](/assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_1.png)

이전에 언급했듯이, RGB 강도를 감지하는 데 사용되고 원리는 다음과 같습니다. TCS3200 센서는 빛 강도 및 색에 해당하는 주파수를 가진 제곱파(50% 듀티사이클)를 출력하며, 이 주파수는 빛 강도에 직접적으로 비례합니다. TCS3200D의 전형적인 출력 주파수 범위는 2Hz에서 500KHz입니다.

- RGB 감지용 TCS3200 센서
이 분석에서는 TCS3200 센서와 LED를 연결하는데 Arduino Uno를 마이크로컨트롤러 보드로 사용했습니다.

![TCS3200 Sensor with Arduino Uno](/assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_2.png)


<div class="content-ad"></div>

위의 회로는 TCS3200 센서를 통해 RGB 검출을 위한 것이며, 결과는 아두이노 Uno 마이크로컨트롤러 보드에 연결된 LED로 표시됩니다.

2. NPK 검출 및 균일한 비료 분사를 위한 TCS3200 센서

먼저 ppm을 기반으로 NPK 양을 분석해야 합니다. 이에 따라 많은 연구 끝에 질소, 인 및 칼륨이 아래에 나와 있는 것처럼 Blue, Green 및 Red에 민감하다는 것이 밝혀졌습니다.

![NPKDetectionusingTCS3200sensor](/assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_3.png)

<div class="content-ad"></div>

아래 로직에 기반하여 색 감지 및 기타 작업을 위한 분석을 수행했습니다:

빨강 값:

redValue=pulseIn(sensorOut, LOW)

초록 값:

<div class="content-ad"></div>

greenValue = pulseIn(sensorOut, LOW)

파란색 값:

blueValue = pulseIn(sensorOut, LOW)

빨간색이 우세할 때:

<div class="content-ad"></div>


파란색 값을 pulseIn(sensorOut, LOW) 으로 가져옵니다.

R ` B and R ` G

만약 파란색이 우세하다면:

blueValue=pulseIn(sensorOut, LOW)


<div class="content-ad"></div>

B ` R 와 B ` G

RGB 값 읽기:

redValue = pulseIn(sensorOut, LOW)

greenValue = pulseIn(sensorOut, LOW)

<div class="content-ad"></div>

blueValue = pulseIn(sensorOut, LOW)

R = pulseIn(sensorOut, LOW)

G = pulseIn(sensorOut, LOW)  

B = pulseIn(sensorOut, LOW)

<div class="content-ad"></div>

색상 감지:

- R 밴드 R과 G ⟹ θ = 0도
- B(R) and B(G) ⟹ θ = 90도
- B와 G ⟹ θ = 90도

<div class="content-ad"></div>

위 표는 탐지를 위해 수행된 연구, 분석 및 연구에 대한 내용입니다. 그러나 비료 분사 부분에는 Arduino Uno 및 3개의 서보 모터가 TCS3200 빛 센서와 통합되었습니다. 이러한 구성요소 간의 연결은 다음과 같습니다:

TCS3200 및 Arduino Uno

![이미지](/assets/img/2024-06-22-NPKDetectionusingTCS3200sensor_4.png)

Arduino Uno 및 서보 모터

<div class="content-ad"></div>

아래는 제안된 아이디어입니다.

아래의 링크에서 코드를 확인해보세요: https://github.com/SumukhJK