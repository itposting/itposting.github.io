---
title: "Arduino를 사용하여 RC 수신기 신호 읽는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HowtoreadRCreceiversignalwithArduino_0.png"
date: 2024-06-22 18:46
ogImage: 
  url: /assets/img/2024-06-22-HowtoreadRCreceiversignalwithArduino_0.png
tag: Tech
originalTitle: "How to read RC receiver signal with Arduino"
link: "https://medium.com/@werneckpaiva/how-to-read-rc-receiver-signal-with-arduino-54e0447f6c3f"
---


![img](/assets/img/2024-06-22-HowtoreadRCreceiversignalwithArduino_0.png)

RC 송신기와 수신기를 서보 모터 또는 비행 제어기와 함께 사용하는 방법에 대한 문서를 쉽게 찾을 수 있지만, Arduino를 사용하여 RC 신호를 읽는 예제를 찾기는 그렇게 쉽지 않습니다. 그래서 매우 직관적인 자습서를 작성하기로 결정했습니다.

저는 FlySky FS-I6X 송신기와 FS-iA10B 수신기를 사용하고 있지만, PWM(Pulse With Modulation)을 지원하는 모든 수신기에서 작동해야 합니다. 이는 Arduino가 ~ 기호로 표시된 핀을 통해 아날로그 값을 출력하기 위해 사용하는 프로토콜과 동일합니다(그러나 우리는 Arduino를 사용하여 읽을 것이므로 이러한 핀만 사용할 필요는 없습니다).

의도는 읽고자 하는 각 채널의 수신기 핀을 Arduino의 디지털 포트에 연결하는 것입니다. 매우 직관적입니다. Arduino 핀은 입력 포트로 작동하고 수신기도 Arduino의 5V에서 전원을 공급받아야 합니다. 이것은 수신기의 5개 채널, 짐벌을 위한 4개 채널, 그리고 온/오프 스위치를 위한 1개 채널을 읽기 위한 배선 스키마입니다:

<div class="content-ad"></div>


![How to read RC receiver signal with Arduino](/assets/img/2024-06-22-HowtoreadRCreceiversignalwithArduino_1.png)

Arduino 스케치에서는 사용 중인 핀을 입력 핀으로 설정해야 하며 `pinMode(pin, INPUT)`과 같이 값을 읽을 때 `pulseIn(inputPort, HIGH, 2500)` 함수를 사용하여 값을 읽을 것입니다. 이는 실전에서 1000에서 2000 사이의 숫자를 의미하는 펄스의 지속 시간을 반환합니다. 짐벌에 대한 부정적인 값의 경우 1000에서 1499까지의 숫자를 읽을 것입니다. 0의 경우 1500을 읽습니다. 양수 값의 경우 1501에서 2000까지의 숫자를 읽습니다. 물론 송신기 구성에 따라 약간 달라질 수 있습니다. 이 범위로 작업하는 대신 다음과 같은 매우 편리한 함수를 사용할 수 있습니다. `map(channelValue, 1000, 2000, -100, 100)`. 이는 수신기에서의 모든 입력을 -100에서 100 사이의 비례적인 숫자로 변환할 것입니다. 수신기가 꺼져 있으면 아마도 값이 0이 되므로 이를 방지하기 위해 코드를 보호해야 합니다.

다른 주의해야 할 점은 송신기의 반전 기능입니다. 사용 가능한 스위치 중 하나에 대해 이를 사용했습니다. FlySky 송신기는 수신기에 연결하기 전에 모든 스위치를 올리도록 강제하므로 `off` 값은 실제로 최고 값인 2000입니다. 따라서 이 채널을 반전시키면 `off` 값이 최소값인 1000이 되도록 할 수 있을 것입니다. 그러나 실수로 송신기를 끈 채 수신기를 켰을 때, 신호가 읽히지 않는 `on` 상황이 발생할 수 있습니다. 송신기를 끈 채로 수신기를 켜면 절대 안 되는 것은 알지만 개발 중에는 사고가 발생하기도 합니다. 따라서 반전 신호 기능을 사용하기보다는 사전에 예방하는 것이 좋습니다.
