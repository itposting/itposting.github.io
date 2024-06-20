---
title: "아두이노 우노 튜토리얼 네오픽셀 링 설정하기"
description: ""
coverImage: "/assets/img/2024-06-19-ArduinoUnoTutorialNeoPixelRingSetup_0.png"
date: 2024-06-19 17:39
ogImage: 
  url: /assets/img/2024-06-19-ArduinoUnoTutorialNeoPixelRingSetup_0.png
tag: Tech
originalTitle: "Arduino Uno Tutorial: NeoPixel Ring Setup"
link: "https://medium.com/@elonskolnik/arduino-uno-tutorial-neopixel-ring-setup-9fafc099c89a"
---


안녕하세요! 다시 왔네요! 지난 주말에 MicroCenter에 가서 아두이노 스타터 키트를 업그레이드하기 위해 멋진 새로운 부품 몇 개를 구입했어요. 특히 NeoPixel 16 RGBW 링을 구했는데, 이 링 안에는 16개의 개별적으로 제어 가능한 LED가 들어 있어서 아주 강력한 플러그인 링이에요. 또한 마이크로폰 브레이크아웃도 구입했는데, 그건 나중에 자세히 알아볼게요.

우선, 링을 설정해 보겠습니다!

![이미지](/assets/img/2024-06-19-ArduinoUnoTutorialNeoPixelRingSetup_0.png)

회로 자체는 엄청나게 비슷하다는 것을 알게 되었어요. 마법은 코드를 통해 이후에 나타날 거예요. 우리는 5V 전원과 접지를 브레드보드의 양극과 음극으로 공급합니다. 거기서부터 양극 행에서 NeoPixel 뒷면에 있는 "Power 5V"라고 쓰여 있는 포트로 점퍼 케이블을 연결하세요. 그리고 브레드보드의 음극 행에서 "Power Ground" 포트로 또 하나의 케이블을 연결하세요. 마지막으로, 아두이노의 디지털 핀 6에서 브레드보드를 통해 470옴 저항을 거치고 NeoPixel에 있는 "Data Input"이라고 쓰여 있는 포트로 또 하나의 케이블을 연결하세요. 그게 다에요.

<div class="content-ad"></div>

아두이노의 데이터 포트로부터 나오는 데이터 스파이크를 방지하기 위해 저항을 통해 실행해야 합니다. 또한, NeoPixel 문서에서는 반지를 살아 있는 회로에 연결하지 말라고 경고하니 반지를 다룰 때 주의하세요. 마지막으로, 네오픽셀 포트에 점퍼 와이어를 고정하기 어려울 수 있습니다. 저는 각 포트의 내부에 와이어를 굽힘으로써 성공을 거뒀어요.

좋아요! 이제 회로를 설정했으니 코드 작성을 시작할 수 있어요! 첫 번째 네오픽셀 테스트의 목표는 다음과 같아요:

![image](https://miro.medium.com/v2/resize:fit:558/1*EOa513-ID5ZFdT4ru8i44A.gif)

실제 코드를 작성하기 전에 NeoPixel 라이브러리를 가져와야 합니다. 아두이노 IDE에서 Sketch - ` Include Library - ` Manage Libraries를 클릭해주세요. 검색 바에 "neopixel"을 입력하고 Adafruit가 제공하는 Adafruit NeoPixel 라이브러리를 선택하여 설치해주세요.

<div class="content-ad"></div>

좋아요! 이제 NeoPixel을 초기화하고 설정할 준비가 되었어요:

```js
#include <Adafruit_NeoPixel.h>

#define LED_PIN    6
#define LED_COUNT 16

Adafruit_NeoPixel ring(LED_COUNT, LED_PIN, NEO_RGBW + NEO_KHZ800);

void setup() {
  ring.begin();           
  ring.show();            
  ring.setBrightness(50); 
}
```

우리가 방금 불러온 라이브러리를 맨 위에 포함했어요. 그 다음, NeoPixel 데이터 출력 핀과 우리 링에 있는 LED의 개수를 정의해요. 다음으로 실제로 NeoPixel 객체를 선언하는 단계인데, 우리는 그것을 ring이라고 부르기로 했어요. 그 다음, setup 함수에서 그 ring에 begin() 함수를 호출해요. 이것은 보드에 명령을 읽도록 알려주는 필수적인 단계에요. 그런 다음 show()를 호출하여 모든 LED를 지우고, 마지막으로 setBrightness()를 호출해요. 이 함수는 NeoPixel에게 최대 밝기가 얼마나 될지 알려주기 위해 처음에 한 번 호출해요. 이 함수는 최대 255까지의 값이 들어갈 수 있어요. 그래서 50은 최대 밝기의 약 1/5 정도에 해당돼요.

이제 즐거운 곳으로 가볼 시간이에요, loop() 함수에서요:

<div class="content-ad"></div>

```js
void loop() {
  for(int i = 0; i < ring.numPixels(); i++){
    ring.setPixelColor(i, random(255), random(255), random(255), 0);
    ring.show();
    delay(50);
  }
  for(int i = ring.numPixels()-1; i >= 0; i--){
    ring.setPixelColor(i, 0, 0, 0, 0);
    ring.show();
    delay(50);
  }
}
```

여기서 진짜 창의성을 발휘할 수 있는 부분이에요. 하지만 시작점을 알려드릴게요.

먼저 for 루프로 시작합니다. 이 루프는 LED 링 안의 조명의 수만큼 실행됩니다. 그런 다음 픽셀 색상을 설정합니다. 여기서 픽셀은 링 내 개별 LED를 가리킵니다. 함수 setPixelColor()는 인수를 순서대로 numLED, red, green, blue, white로 사용합니다. i를 numLED로 입력하여 루프가 각각 실행되도록 합니다. 색상은 다양성을 더하기 위해 임의의 빨간색, 초록색, 파란색 값을 선택하기로 결정했습니다. setPixelColor()를 호출하면 색상을 설정하는데, 이후에 실제로 색상을 링에 업데이트하기 위해 ring.show()를 호출해야 합니다. 마지막으로 각 색상을 적용한 후 50밀리초의 지연을 추가하여 로딩 애니메이션 효과를 얻을 수 있어요.

더 재미를 위해 이 동일한 루프를 역으로 만들어서 링이 밝아지고 꺼진다고 가정할게요. 이를 위해 LED에서 시작하여 0까지 역순으로 세어봅니다. 그런 다음 픽셀 색상을 0, 0, 0, 0으로 설정하고 마찬가지로 두 줄을 추가하게 됩니다. 와! 이렇게 모두 조합하면 위에 올린 GIF와 동일한 효과를 얻을 수 있을거에요.


<div class="content-ad"></div>

다음 게시물을 기대해주세요! 더 많은 상호작용을 추가하고 마이크를 사용해보려고 합니다!