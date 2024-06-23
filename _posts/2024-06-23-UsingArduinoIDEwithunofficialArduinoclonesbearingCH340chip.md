---
title: "CH340 칩이 탑재된 비공식 Arduino 클론에서 Arduino IDE 사용하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_0.png"
date: 2024-06-23 17:35
ogImage: 
  url: /assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_0.png
tag: Tech
originalTitle: "Using Arduino IDE with unofficial Arduino clones bearing CH340 chip"
link: "https://medium.com/dev-genius/using-arduino-ide-with-unofficial-arduino-clones-bearing-ch340-chip-752d1b90810d"
---


사용되지 않는 Arduino 복제품의 예측할 수 없는 세계로 한 발 들어보세요

![image](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_0.png)

아두이노는 많은 DIY 프로젝트에 매우 인기가 높은 플랫폼이며 오픈 디자인 덕분에 많은 비공식 복제품이 있습니다. 그중 일부는 원래 아두이노 디자인을 완전히 복제하고 있지만, 일부는 더 저렴하게 만들려고 노력하고 있습니다.

![image](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_1.png)

<div class="content-ad"></div>

만약 비공식 아두이노 Uno R3 클론을 구매하고 Windows 기기에 연결했을 때 "USB 장치를 인식하지 못했습니다" 오류가 발생했다면, 이 기사가 도움이 될 것입니다. 아래에서는 공식 및 일부 비공식 아두이노 보드 간의 차이와 일부 비공식 보드가 Windows에서 인식되기 위해 설치해야 하는 것에 대해 살펴보겠습니다.

## USB 어댑터

우선, 아래에서 공식 아두이노 UNO R3를 살펴보겠습니다:

![아두이노 UNO R3 이미지](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_2.png)

<div class="content-ad"></div>

이 사진의 칩 넘버 1은 아두이노의 두뇌입니다: 이것은 ATmega328P로, 아두이노 IDE를 통해 프로그래밍합니다. 이것이 보드의 핵심이며, 이 칩은 모든 스케치를 실행시킵니다 — CPU, 메모리를 포함하고 아두이노 핀들을 모두 제어합니다.

하지만 더 자세히 살펴보면, 이 보드에 실제로 다른 칩이 하나 더 있음을 알 수 있습니다. 번호가 매겨진 칩은 2입니다. 이것은 ATmega16U2이며 이 보드에서 유일한 역할은 USB to 시리얼 변환기로서 일합니다. 다시 말해 — 이것은 이 보드에 USB 연결성을 제공하고 컴퓨터 USB 포트와 아두이노 시리얼 포트 사이의 다리 역할을 합니다.

그러니까, 본질적으로 원래 아두이노 보드에 USB를 꼽으면 실제로 ATmega16U2로 꽂히게 되고, 이것이 컴퓨터에 통신하여 운영 체제가 인식하고 설치된 드라이버 목록에서 해당 드라이버를 로드합니다. 그런 다음 드라이버가 시스템에 새로운 COM 포트를 등록하고, 아두이노를 프로그래밍할 때 아두이노 IDE에서 선택할 수 있습니다. 아래 스크린샷을 보면 올바른 포트가 해당되는 이름으로 표시될 것임을 주의하세요 — 목적에 따라 드라이버가 수행하는지 아니면 ATmega16U2 칩의 펌웨어가 수행하는지는 확실하지 않습니다. 알고 계신다면 코멘트로 알려주세요.

<div class="content-ad"></div>

하지만 위에서 설명한 모든 것은 공식 아두이노 Uno R3 보드에 대해서만 해당되며, 비공식 보드에는 항상 그렇지 않을 수 있습니다. 그러나 일부 비공식 보드는 아두이노의 완벽한 복제품이며, 보드 색상과 로고만 다를 뿐입니다.

![이미지](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_4.png)

이 Elegoo UNO R3 보드를 살펴보세요: 원본 아두이노 보드와 동일한 칩을 쉽게 찾을 수 있습니다. 보드 상에서 가장 큰 칩은 ATmega328P이며, TX 및 RX LED 옆 왼쪽에 있는 작은 칩은 ATmega16U2입니다. 따라서 Windows 드라이버에서 이 보드는 원본과 정확히 동일하게 보입니다. 드라이버는 동일한 ATmega16U2 칩과 통신하기 때문에 Arduino IDE에서 인식되어 정상적으로 작동할 것입니다.

## CH340G 칩이 장착된 비공식 보드

<div class="content-ad"></div>

그러나 Windows에서 인식하지 않는 일부 비공식 보드도 있습니다. 따라서 장치가 종료됩니다. COM 포트가 표시되지 않으며 결과적으로 Arduino IDE에서 이러한 보드를 사용할 수 없습니다. COM 포트가 없으면 통신 방법이 없으므로 스케치를 업로드할 수 없습니다.

![이미지](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_5.png)

이 보드를 살펴보겠습니다. 첫눈에 차이점을 볼 수 있습니다. ATmega328P가 어디로 사라졌나요?! 걱정하지 마세요. 여기 있습니다. 이 그림에서 번호로 표시된 것입니다. 네, 훨씬 작아졌습니다. 하지만 동일한 칩이며, 다른 케이스로 포장되었습니다. 시각적으로 큰 차이가 있더라도 내부에는 여전히 동일한 ATmega328P가 있으므로 모든 스케치가 정확히 동일한 방식으로 작동할 것입니다.

진짜 차이점은 번호로 표시된 칩에 있습니다. 공식 아두이노에서 ATmega16U2가 있었던 위치에, 이 보드에는 CH340G가 있습니다.

<div class="content-ad"></div>

**CH340**은 USB-시리얼 변환기로 기능하는 전용 칩 시리즈입니다. 이 고도로 전문화된 특성으로 인해 공식 보드에 사용된 강력하고 다용도인 ATmega16U2보다 간단하고 더 저렴합니다. 그러나 이 ATmega16U2의 모든 잠재적인 성능과 가능성이 공식 보드에서는 소홀히 다뤄지므로 이 칩이 장착되어 있더라도 그 잠재력은 활용되지 않습니다. 따라서 전반적인 성능과 아두이노 보드의 기능 면에서는 USB-시리얼 어댑터로 어떤 칩이 사용되든 차이를 거의 느끼지 못할 것입니다.

## CH340 드라이버

하지만 CH340에는 한 가지 문제가 있습니다: Windows에는 이를 위한 내장 드라이버가 없습니다. 엄밀히 말하면 이는 CH340의 문제가 아니라 Windows의 문제이지만, 우리 사용자들에게는 모두 같은 문제입니다. 이 보드를 USB에 연결하면 Windows가 "USB 장치 인식 안됨"이라는 내용으로 오류를 표시하고 해당 보드에 대한 COM 포트가 생성되지 않을 것입니다.

<div class="content-ad"></div>

문제 해결은 매우 간단해요 — 그냥 올바른 드라이버를 설치하세요!

- 단계 1: 드라이버를 찾아보세요. “Arduino CH340 driver”를 구글에 검색하면 많은 링크가 나올 거예요. 저에게는 구글에서 첫 번째로 나온 것이 있는데, 이 링크 외에도 다른 링크를 사용해도 됩니다. 이 드라이버는 여러 곳에서 사용 가능해요.
- 단계 2: 파일을 임시 위치에 압축을 푼 다음 설치 프로그램을 실행하세요.
- 단계 3: Arduino 보드를 연결하고 장치 관리자에서 새 COM 포트를 확인하세요. 아래 그림에서는 COM3인데, 여러분의 컴퓨터에선 다른 포트 번호를 사용할 수 있어요.

![이미지](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_7.png)

- 단계 4: Arduino IDE에서 올바른 포트를 선택하세요. 이번에는 “Arduino Uno”와 같이 레이블이 아니라 포트 번호로 표시될 거에요.

<div class="content-ad"></div>

![Image](/assets/img/2024-06-23-UsingArduinoIDEwithunofficialArduinoclonesbearingCH340chip_8.png)

## 끝

CH340는 Arduino 클론뿐만 아니라 많은 다른 보드에서도 사용됩니다. 따라서 이 드라이버는 언젠가는 어쩌면 바로 필요할 지도 모릅니다.

호기심을 갖고 다른 Arduino 클론을 시도해보세요 (가격이 싸요!) 그리고 즐겁게 즐기세요!

<div class="content-ad"></div>

## 자료

- CH340 드라이버는 [여기](https://sparks.gogo.co.nz/ch340.html)에서 다운로드할 수 있어요. 하지만 다양한 다른 위치에서도 이용 가능하니, 구글에서 검색해보세요!