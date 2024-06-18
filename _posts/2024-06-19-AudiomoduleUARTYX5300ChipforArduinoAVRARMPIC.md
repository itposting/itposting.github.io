---
title: "오디오 모듈 UART YX5300 칩을 Arduino AVR ARM, PIC과 함께 사용하기"
description: ""
coverImage: "/assets/img/2024-06-19-AudiomoduleUARTYX5300ChipforArduinoAVRARMPIC_0.png"
date: 2024-06-19 02:20
ogImage: 
  url: /assets/img/2024-06-19-AudiomoduleUARTYX5300ChipforArduinoAVRARMPIC_0.png
tag: Tech
originalTitle: "Audio module UART (YX5300) Chip for Arduino AVR ARM , PIC"
link: "https://medium.com/@zsuperxtreme/audio-module-uart-yx5300-chip-for-arduino-avr-arm-pic-280399af9c77"
---


제가 발견한 가장 쉬운 오디오 재생 방법은 Serial MP3 UART 모듈을 통한 것입니다. 이 다재다능한 모듈은 MP3 및 WAV 파일 모두를 다룰 수 있어 다양한 오디오 응용 프로그램에 좋은 선택이 됩니다. 이 모듈은 사운드 잭에 직접 연결되어 스피커를 연결할 수 있게 해줍니다. 자체 앰프가 장착된 스피커는 소리 크기를 제어하여 명확하고 조절된 오디오 출력을 제공할 수 있습니다. 이 설정은 모듈이 모든 필요한 디코딩 및 재생 기능을 효율적으로 처리하기 때문에 오디오 재생을 프로젝트에 통합하는 과정을 간단하게 만듭니다.

![이미지](/assets/img/2024-06-19-AudiomoduleUARTYX5300ChipforArduinoAVRARMPIC_0.png)

아래 git을 다운로드하고 압축 파일을 아두이노 라이브러리에 추가하세요.

다음은 SD 카드에서 첫 번째로 찾은 파일을 재생하는 코드입니다.

<div class="content-ad"></div>

```cpp
#include "SerialMP3Player.h"
#define TX 11
#define RX 10

SerialMP3Player mp3(RX,TX);

void setup() {
  mp3.begin(9600);      
  delay(500);            
  //SD 카드 선택
  mp3.sendCommand(CMD_SEL_DEV, 0, 2);   
  delay(500);         
}

void loop() {
  //첫 번째 파일 재생
  mp3.play(1);    
  delay(3000);   
}
```

# 문제 발견

이 모듈에 문제가 있습니다. 서로 다른 디지턈 입력을 사용해 보았으나 소리가 재생되지 않았습니다. 몇 번을 시도한 끝에 RX로 디지턈 입력 10을, TX로는 11을 사용하도록 결정했습니다. 이 포트들만 일관적으로 작동하는 것으로 확인되었습니다.

또 다른 문제는 MP3와 WAV 파일을 섞어 사용할 때 파일 이름 순서대로 재생되지 않는 것을 발견했습니다.

<div class="content-ad"></div>

# 파일 호출 및 재생 방법

일부 지침을 살펴보니 파일 이름을 001.mp3, 002.mp3와 같이 순차적으로 지정하여 배열하는 것이 좋다는 것을 제안했습니다. 이렇게 하면 mp3.play(i)를 사용하여 파일을 호출할 수 있으며, 여기서 i는 파일의 순서에 해당합니다. 파일은 .mp3 또는 .wav 형식이 될 수 있습니다.

또한 파일은 폴더 이름 01, 02 등에 배치할 수도 있습니다.