---
title: "커스텀 nRF52832 디자인에 아두이노 부트로더를 플래싱하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoFlashtheArduinoBootloadertoaCustomnRF52832Design_0.png"
date: 2024-06-19 17:49
ogImage: 
  url: /assets/img/2024-06-19-HowtoFlashtheArduinoBootloadertoaCustomnRF52832Design_0.png
tag: Tech
originalTitle: "How to Flash the Arduino Bootloader to a Custom nRF52832 Design"
link: "https://medium.com/@pietrowicz-eric/how-to-flash-the-arduino-bootloader-to-a-custom-nrf52832-design-7e730fcb9adb"
---



![이미지](/assets/img/2024-06-19-HowtoFlashtheArduinoBootloadertoaCustomnRF52832Design_0.png)

내가 사용 중인 사용자 정의 nRF52832 보드 디자인 작업 중이었고, 장치에 데모 소프트웨어를 프로그래밍하고 싶었습니다. 제품 보드는 Zephyr RTOS를 실행하지만 Arduino로 빠르고 더러운 프로토타입 환경을 원했습니다.

부트로더를 프로그래밍하려면 어떤 종류의 J-Link 프로그래머가 필요합니다. nRF52832 개발 키트, J-Link EDU Mini (취미 프로젝트용) 또는 완전한 J-Link 프로그래머(상용 프로젝트용)를 사용할 수 있습니다.

부트로더를 설치한 후 이와 같은 UART에서 USB 변환기가 필요합니다. 이것은 부트로더가 설치된 후 Arduino IDE에서 nRF52832를 플래싱하는 데 사용될 것입니다.


<div class="content-ad"></div>

BLE 모듈을 사용하여 몇 가지 예시 연결을 이 가이드에서 사용할 예정이지만, 이 단계들을 여러분의 디자인에 맞게 조정할 수 있어요.

이제부터는 여러분의 디자인이 UART RX와 UART TX 핀으로 P0.30 및 P0.31 핀을 노출한다고 가정해보도록 합시다:

![image](/assets/img/2024-06-19-HowtoFlashtheArduinoBootloadertoaCustomnRF52832Design_1.png)

# 부트로더 구성하기

<div class="content-ad"></div>

Adafruit_nRF52_Bootloader 저장소를 컴퓨터로 복제해야 합니다. 저장소의 src ` boards 디렉터리에서 부트로더가 지원하는 보드 목록을 확인할 수 있습니다.

우리의 최종 목표와 가장 일치하는 feather_nrf52832의 부트로더 구성을 수정할 것입니다.

src ` boards ` feather_nrf52832 ` board.h로 이동하세요. LED, BUTTON 및 UART에 대한 다른 섹션을 확인할 수 있습니다. 이러한 섹션을 PCB 디자인과 일치하도록 업데이트해야 합니다.

UART 구성부터 시작하여 핀을 디자인에 맞게 업데이트하세요. 저희 경우에는 P0.31 = TX 및 P0.30 = RX입니다. 하드웨어 흐름 제어를 사용하지 않기 때문에 CTS 및 RTS 핀 정의를 무시할 수 있습니다.

<div class="content-ad"></div>

변환기의 RX는 마이크로컨트롤러의 TX에 연결되어야 하며, 변환기의 TX는 마이크로컨트롤러의 RX에 연결되어야 합니다.

```js
/*------------------------------------------------------------------*/
/* UART (nRF52832에서만 사용)
 *------------------------------------------------------------------*/
#define RX_PIN_NUMBER      30
#define TX_PIN_NUMBER      31
#define CTS_PIN_NUMBER     0
#define RTS_PIN_NUMBER     0
#define HWFC               false
```

다음으로 LED 섹션을 살펴볼 수 있습니다. 이 부분은 내장 표시 LED가 있는 디자인에만 해당됩니다. 여기에서 지정한 LED는 장치가 부트로더 모드에 있고 Arduino IDE로 플래시될 준비가 되었음을 나타냅니다. 제 디자인에는 내장 LED가 없기 때문에 LED_PRIMARY_PIN을 임의의 GPIO 핀에 할당하고 있습니다.

```js
/*------------------------------------------------------------------*/
/* LED
 *------------------------------------------------------------------*/
#define LEDS_NUMBER        1
#define LED_PRIMARY_PIN    17
#define LED_STATE_ON       1
```

<div class="content-ad"></div>

마지막으로, 버튼 섹션을 살펴봅시다.

BUTTON_1은 DFU 버튼으로 사용됩니다. 전원 사이클이나 리셋 중에 이 버튼을 누르면 nRF52가 부트로더 모드로 강제 전환됩니다. BUTTON_2는 FRST 버튼으로 사용됩니다. 이 버튼을 누르면 리셋 중에 이전에 로드된 Arduino 코드를 지우는 공장 초기화가 수행됩니다.

DFU와 FRST 버튼에 대해 더 자세히 알아보세요.

내 디자인에는 버튼을 사용하지 않을 것입니다. 대신 부트로더 모드에서 일시 중지한 후 일정 기간 후에 Arduino 코드를 로드하게 될 것입니다. 이에 대해 더 자세히 이야기하겠습니다.

<div class="content-ad"></div>

한번 더 랜덤 핀을 2개 버튼 섹션에 할당하겠습니다.

그러나 이 핀들이 시작할 때 GND에 연결돼 있다면(액티브 로우), 부트로더를 종료하는데 문제가 발생할 수 있습니다. 버튼이 눌린 것으로 인식되어 부트로더를 종료시키는 문제가 발생할 수 있습니다.

만약 2개의 버튼을 정의하지 않으면, 빌드 오류가 발생할 수 있습니다.

```js
/*------------------------------------------------------------------*/
/* BUTTON
 *------------------------------------------------------------------*/
#define BUTTONS_NUMBER     2
#define BUTTON_1           23
#define BUTTON_2           24
#define BUTTON_PULL        NRF_GPIO_PIN_PULLUP
```

<div class="content-ad"></div>

버튼을 사용하지 않는 디자인을 사용하고 있기 때문에 부트로더 기간을 수정하여 코드 업로드를 쉽게 만들기로 결정했습니다. 기본적으로 부트로더는 리셋 후 1초 동안 일시 정지하여 Arduino IDE에서 오는 새 코드를 기다립니다.

저는 새 코드를 업로드하기 위해 리셋 타이밍을 조정하기 쉽도록 이 기다리는 기간을 연장하기로 결정했습니다. 이것은 엄격히 선택 사항입니다만, DFU 버튼 없이 진행하는 경우 권장됩니다.

이 지연 시간은 src ` main.c 안의 DFU_SERIAL_STARTUP_INTERVAL을 수정하여 늘릴 수 있습니다.

```js
#define DFU_SERIAL_STARTUP_INTERVAL     20000 // ms
```

<div class="content-ad"></div>

위에서 볼 수 있듯이, 내 사용자 정의 부트로더는 리셋 후 20초 동안 새로운 아두이노 코드를 기다린 후 아두이노 스케치를로드합니다.

# 당신의 nRF52 디자인을 위한 아두이노 부트로더 빌드

먼저, 컴퓨터에 ARM GCC 툴체인이 설치되어 있는지 확인하세요.

최신 릴리스를 선택하고 운영 체제에 필요한 설치 프로그램을 다운로드하세요. 나중에 문제가 발생하면 설치 경로를 메모해두세요. 또한 프롬프트가 나타나면 "PATH에 추가"를 선택하세요.

<div class="content-ad"></div>

로컬 Adafruit UF2 부트로더 사본 내에서 새 터미널 창을 열어주세요.

다음 명령을 실행하여 서브모듈을 초기화하세요:

```js
git submodule update --init
```

그 다음에는 다음을 실행하여 가상 파이썬 환경을 생성하고 활성화하세요:

<div class="content-ad"></div>

```js
python3 -m venv myenv
source myenv/bin/activate
```

빌드 시스템에 필요한 파이썬 종속성을 설치하세요:

```js
pip3 install intelhex
pip3 install adafruit-nrfutil
```

이제 부트로더를 빌드하기 위해 make 명령어를 실행하세요:

<div class="content-ad"></div>

```js
BOARD=feather_nrf52832을 사용하여 make all 명령어를 실행하세요.

이 명령어에 의해 생성되는 새로운 _build 폴더에 주목하세요. 부트로더 구성을 변경할 때마다 이 폴더를 삭제하는 것이 좋습니다. 이렇게 하면 모든 것이 다시 빌드되는지 확인할 수 있습니다.

JLINK 프로그래머에서 다음 핀을 nRF52832 모듈로 연결하세요:

- SWDIO
- SWCLK
- 3V3
- GND
```

<div class="content-ad"></div>

다음으로 플래시 명령을 실행하세요:

```js
make flash
```

이제 Arduino IDE 및 UART to Serial 컨버터로 보드를 프로그래밍할 수 있어야 합니다! nRF52832 Feather 보드 옵션 및 UART to Serial 컨버터를 포트 옵션으로 선택해야합니다.

(여기에 설명된 대로 nRF52 보드 지원 패키지가 설치되어 있는지 확인하세요)

<div class="content-ad"></div>

만약 DFU 버튼이 있으면: 그 버튼을 누른 채로 모듈을 재설정(또는 전원 주기)한 다음, DFU 버튼을 놓아서 부트로더 모드로 진입하십시오.

그렇지 않은 경우, DFU_SERIAL_STARTUP_INTERVAL을 의존한다면, Arduino IDE가 스케치를 업로드하기 전에 보드를 재설정해야 합니다.

한 가지 유의할 점: 사용자 지정 보드에서 시리얼 출력을 얻으려면 Serial.begin 호출 전에 UART 핀을 설정해야 할 수 있습니다. 이 예시에서는 다음과 같이 보일 것입니다:

```js
Serial.setPins(30, 31);
Serial.begin(115200);
```