---
title: "Arduino IDE와 AVRDUDESS를 사용해 기존 하드웨어로 UPDI 인터페이스를 통한 새로운 AVR 칩 프로그래밍하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_0.png"
date: 2024-06-22 18:47
ogImage: 
  url: /assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_0.png
tag: Tech
originalTitle: "Programming new AVR chips with UPDI interface with existing hardware. (Using Arduino IDE and AVRDUDESS)"
link: "https://medium.com/@nidulam2001/programming-new-avr-chips-with-updi-interface-with-existing-hardware-79757a933156"
---


## 통합 프로그램 및 디버그 인터페이스 (UPDI) 이해하기

통합 프로그램 및 디버그 인터페이스(UPDI)는 Microchip Technology가 개발한 프로프리어터리 인터페이스로서, AVR 및 SAM 마이크로컨트롤러의 프로그래밍 및 디버깅에 사용됩니다. 2016년 소개된 UPDI는 예전 AVR 마이크로컨트롤러에서 사용되던 In-System Programming (ISP) 및 Debug WIRE 인터페이스의 후속 제품입니다. UPDI는 마이크로컨트롤러와 상호작용하는 간단하고 효율적인 방법을 제공하며, 프로그래밍 및 디버깅 요구 사항에 맞는 기능을 포함하고 있습니다. 본 문서는 UPDI 프로토콜, 운영 메커니즘, 그리고 JTAG2UPDI와의 비교를 보다 자세히 살펴봅니다.

## UPDI 개요

UPDI는 UART (Universal Asynchronous Receiver-Transmitter) 시리얼 프로토콜을 기반으로 한 단방향, 이중 통신 프로토콜입니다. 기존의 UART 통신과 달리 별도의 Rx(수신) 및 Tx(송신) 라인을 사용하는 대신, UPDI는 데이터를 수신하고 송신하기 위한 단일 선을 활용합니다. 이 단순화는 핀 개수와 단순성이 중요한 임베디드 시스템에서 특히 유리합니다.

<div class="content-ad"></div>

UPDI의 주요 기능:
- 프로그래밍 및 디버깅: UPDI는 플래시, EEPROM, 퓨즈 및 잠금 비트를 포함한 비휘발성 메모리(NVM) 공간의 프로그래밍이 가능하며 온칩 디버깅을 용이하게 합니다.
- PHY 인터페이스: UPDI의 물리적 레이어는 UART 기반으로, 통신을 위해 RESET 핀을 사용합니다. 반 이중 방식으로 작동하여 통신 방향이 데이터를 보내고 받는 것 사이에 교대로 변합니다.
- 클럭: UPDI는 내부 발진기를 사용하여 일관된 타이밍과 동기화를 제공합니다.
- 에러 검출: 프로토콜에는 패리티 체크 및 특수 프레임 형식을 통해 에러를 감지하고 신호화하는 메커니즘이 포함되어 있습니다.

## UPDI 통신 프로토콜

![이미지](/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_0.png)

프로그래머 또는 디버거와 마이크로컨트롤러 간의 UPDI를 통한 통신에는 각각 특정 목적을 위해 사용되는 여러 가지 구별된 프레임 유형이 포함됩니다.

<div class="content-ad"></div>

- 데이터 프레임: 시작 비트, 8개의 데이터 비트, 선택적 패리티 비트 및 두 개의 스톱 비트로 구성됩니다. 이 프레임은 실제 데이터를 전송하는 데 사용됩니다.
- IDLE 프레임: 통신 라인의 유휴 상태를 나타내는 12개의 하이 비트로 구성됩니다.
- BREAK 프레임: UPDI를 기본 상태로 재설정하는 데 사용되는 12개의 로우 비트로 구성됩니다. 일반적으로 오류 복구 목적입니다.
- SYNCH 프레임: SYNCH 문자(0x55)는 프로그래머와 마이크로컨트롤러 간의 보드 속도를 동기화합니다.
- ACK 프레임: UPDI에서 전송된 성공적인 명령 수신 및 실행을 확인하는 확인 프레임입니다.

<img src="/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_1.png" />

프로그래머가 UPDI 인터페이스를 재설정하기 위해 BREAK 조건을 보내는 것으로 통신이 시작됩니다. 그 후에는 보드 속도를 동기화하기 위해 SYNCH 프레임이 이어집니다. 그 다음에 프로그래밍 또는 디버깅 명령이 교환되며, 양쪽이 번갈아가면서 송신자와 수신자 역할을 교체합니다.

# 아두이노 나노를 사용하여 UPDI 프로그래머 만드는 방법

<div class="content-ad"></div>

ATtiny 마이크로컨트롤러를 UPDI 인터페이스를 사용하여 프로그래밍하려면, Arduino Nano를 UPDI 프로그래머로 사용할 수 있습니다. 이 안내서는 Arduino Nano 설정, Arduino IDE 구성, 그리고 펌웨어를 업로드하여 Nano를 UPDI 프로그래머로 변환하는 방법에 대한 단계별 지침을 제공합니다.

필요한 구성품

- Arduino Nano
- 10μF 캐패시터
- 4.7kΩ 저항기
- 브레드보드
- 점퍼 와이어

UPDI 프로그래머 구성하기

<div class="content-ad"></div>

- 하드웨어 설정:
- 아두이노 나노의 핀 D6과 ATtiny 마이크로컨트롤러의 UPDI 핀 사이에 4.7kΩ 저항을 연결하세요.
- 아두이노 나노의 GND 핀과 RST 핀 사이에 10μF 커패시터를 설치하세요. 커패시터의 양극(선이나 + 기호로 표시)이 RST 핀에 연결되어 있는지 확인하세요.

연결을 도와줄 다이어그램이 있습니다:

```js
Arduino Nano 핀 | 부품 | ATtiny 핀
-----------------|------|------
GND              | 점퍼 | GND
5V               | 점퍼 | VCC
D6               | 4.7kΩ | UPDI
GND              | 10μF 캡 | GND
RST              | 10μF 캡 | + (양극 부분)
```

<img src="/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_2.png" />

<div class="content-ad"></div>

2. 아두이노 IDE 준비하기:
단계 1: 아두이노 IDE 설치
— [아두이노 공식 웹사이트](https://www.arduino.cc/en/software)에서 아두이노 IDE를 다운로드하고 설치합니다.

단계 2: megaTinyCore 패키지 추가
— 아두이노 IDE를 열고 `File` Preferences`로 이동합니다.
— "Additional Board Manager URLs" 필드에 다음 URL을 추가합니다: `http://drazzy.com/package_drazzy.com_index.json`.

![이미지](/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_3.png)

— 설정을 저장하려면 "확인"을 클릭합니다.
— `Tools` Board` Boards Manager`로 이동합니다.
— 검색란에 "megaTinyCore"를 입력하고 "megaTinyCore by Spence Konde"를 설치합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-프로그래밍newAVR칩을기존하드웨어를이용해서UPDI인터페이스로바꾸기_4.png" />

3. 아두이노 나노를 UPDI 프로그래머로 변환하기:
단계 1: UPDI 프로그래머 스케치 다운로드
— [GitHub 저장소](https://github.com/ElTangas/jtag2updi)에서 jtag2updi 스케치를 다운로드합니다. 저장소를 ZIP 파일로 다운로드합니다.
— ZIP 파일을 컴퓨터의 알려진 위치에 해제합니다.

단계 2: 아두이노 IDE에서 스케치 열기
— 아두이노 IDE를 열고 '파일` - '열기'를 선택합니다.
— 압축 해제된 폴더로 이동하여 'jtag2updi.ino' 파일을 엽니다. `.ino` 파일이 비어 보일 수 있지만 괜찮습니다. 필요한 모든 코드는 동일한 폴더 내의 다른 파일에 있습니다.

단계 3: 스케치를 아두이노 나노에 업로드
— 아두이노 나노 보드를 선택합니다: `도구` - `보드` - `아두이노 나노`.
— 올바른 프로세서를 선택합니다: `도구` - `프로세서` - `ATmega328P (이전 부트로더)` (해당하는 경우).
— 올바른 포트를 선택합니다: `도구` - `포트` - `COM[X]` ([X]는 포트 번호입니다).
— 아두이노 IDE에서 "업로드" 버튼을 클릭하여 스케치를 업로드합니다.

<div class="content-ad"></div>

4. 아두이노 나노와 ATtiny 마이크로컨트롤러를 점퍼 와이어로 연결해 보세요:

```js
아두이노 나노 핀 | ATtiny 핀
-----------------|-----------
GND              | GND
5V               | VCC
D6               | UPDI
```

5. ATtiny에 코드 업로드하기:
단계 1: 아두이노 IDE에서 ATtiny 보드 선택
— `도구` `보드` `ATtiny`로 이동하고 적절한 ATtiny 모델(예: ATtiny1614)을 선택합니다.

단계 2: 프로그래머 설정
— `도구` `프로그래머`로 이동하고 `jtag2updi (megaTinyCore)`를 선택하세요.

<div class="content-ad"></div>

단계 4: 코드 업로드하기
- 코드를 확인하고 "업로드" 버튼을 클릭하여 업로드하세요.

Arduino IDE를 사용하여 코드를 업로드하는 방법은 매우 간단하고 쉬운 방법입니다.

# AVRDUDESS를 사용하여 미리 컴파일된 펌웨어 업로드하기

- Hex 파일 준비:
만약 프로그램이 플랫폼 IO나 비슷한 플랫폼으로 작성되었다면, 코드의 컴파일된 Hex 파일을 얻을 수 있습니다.
- AVRDUDESS 설치
여기에서 설정을 다운로드할 수 있습니다.
- `avrdude.conf` 수정:
설치 디렉토리에서 `avrdude.conf` 파일을 찾으세요.
그런 다음 VS code나 그와 유사한 플랫폼을 사용하여 구성 파일을 열고 다시 저장하고 구성 파일에 다음 부분을 추가하세요.

<div class="content-ad"></div>

```js
#------------------------------------------------------------
# jtag2updi 프로그래머 정의
#------------------------------------------------------------

programmer
  id    = "jtag2updi";
  desc  = "JTAGv2에서 UPDI로 변환";
  type  = "jtagmkii_pdi";
  connection_type = serial;
  baudrate = 115200;
;
```

이 부분을 다음 줄 근처에 추가해주세요,

<img src="/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_5.png" />

3. AVRDUDESS 사용 방법:
— AVRDUDESS를 엽니다.
— 프로그래머로 `JTAGv2에서 UPDI로 변환`을 선택합니다.
— Arduino Nano가 연결된 COM 포트를 선택합니다.
— 생성한 `.hex` 파일을 불러옵니다.
— 코드를 ATtiny 마이크로컨트롤러에 업로드하려면 “프로그램”을 클릭합니다.

<div class="content-ad"></div>


![Programming new AVR chip with UPDI interface](/assets/img/2024-06-22-ProgrammingnewAVRchipswithUPDIinterfacewithexistinghardwareUsingArduinoIDEandAVRDUDESS_6.png)

- 작동하지 않으면 보레이트를 낮추거나 올바른 COM 포트가 선택되었는지 확인해보세요.

## 유용한 링크

- jtag2updi GitHub
- Microchip Studio
- AVRDUDESS


<div class="content-ad"></div>

프로젝트에 잘 도움이 되길 바라요. 궁금한 게 있으면 언제든 물어봐 주세요.