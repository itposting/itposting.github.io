---
title: "ESP32의 UART 통신"
description: ""
coverImage: "/assets/img/2024-06-20-UARTCommunicationonESP32_0.png"
date: 2024-06-20 16:13
ogImage: 
  url: /assets/img/2024-06-20-UARTCommunicationonESP32_0.png
tag: Tech
originalTitle: "UART Communication on ESP32"
link: "https://medium.com/@khantalha7367/uart-communication-on-esp32-28fd3df3b6eb"
---


![UART 통신](/assets/img/2024-06-20-UARTCommunicationonESP32_0.png)

ESP32는 Espressif Systems에서 디자인한 인기 있는 보드입니다. 이 보드는 클럭 속도, PWM, I2C, SPI, UART와 같은 훌륭한 기능을 갖춘 일반 개발 보드입니다. 하지만 그 주요 강점은 IoT 기능인 내장 WIFI와 블루투스가 보드에 포함되어 있어 별도의 WIFI 및 블루투스 모듈을 구매할 필요가 없다는 점입니다. ESP32 및 Arduino IDE를 사용한 프로그래밍에 대한 자세한 정보는 여기와 여기의 문서를 참조하십시오.

도구

- 두 개의 ESP32 DEVKIT V1
- 점퍼 와이어
- Arduino IDE

<div class="content-ad"></div>

UART

UART은 Universal Asynchronous Receiver Transmitter의 줄임말입니다. 최대 세 개의 연결을 이용한 통신 메커니즘입니다. 이 연결에서 한 모듈의 Rx가 다른 모듈의 Tx에 연결되고 그 반대도 성립되며 두 모듈에 공통적인 그라운드가 제공됩니다. UART는 단방향 통신인 simplex, 양방향 통신이 가능하지만 동시에 통신은 불가능한 half-duplex, 양쪽이 동시에 통신할 수 있는 full duplex와 같이 세 가지 유형의 통신을 지원할 수 있습니다.

ESP32의 UART

ESP32에는 외부 두 개와 내부 한 개의 UART 채널이 있습니다. UART 핀은 UART0가 Rx 및 TX로 핀 3, 1이며 UART2는 Rx 및 Tx로 핀 16, 17으로 구성됩니다. 한편 UART1은 외부 GPIO가 할당되어 있지 않고 외부 핀을 할당하여 접근할 수 있습니다. 이에 대한 자세한 내용은 나중에 논의될 예정입니다. 저희 프로젝트에서는 두 개의 ESP32 보드를 사용하고 UART 통신을 이용하여 한 보드에서 다른 보드로 데이터를 전송하여, 결과적으로 이벤트를 트리거하도록 할 것입니다. 또한 ESP32 보드의 블루투스 기능을 활용하여, 다른 보드에 블루투스 기능을 제공할 때 ESP32를 HC-05 모듈의 대체품으로 사용할 수 있는지 확인할 것입니다. ESP32의 블루투스 기능을 설정하고 사용하는 방법에 대한 정보는 해당 기사를 참조해 주세요.

<div class="content-ad"></div>

코드 마스터 모듈

마스터 모듈용 아두이노 IDE 코드는 다음과 같습니다.

```js
#include <BluetoothSerial.h>
#include <HardwareSerial.h>
HardwareSerial SerialPort(2);
BluetoothSerial SerialBT;
byte BTd;
/* SDK에서 Bluetooth 구성이 활성화되어 있는지 확인 */
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth가 활성화되어 있지 않습니다! `make menuconfig`를 실행하여 활성화하십시오
#endif
void setup() {
  Serial.begin(115200);
  SerialPort.begin(15200,SERIAL_8N1,16,17);
  SerialBT.begin("ESP32");
}
void loop() {
  if(SerialBT.available())
  {
    BTd=SerialBT.read();
    Serial.write(BTd);
  }
  if(BTd=='1')
  {
    SerialPort.print(1);
  }
  if(BTd=='0')
  {
    SerialPort.print(0);
  }
delay(100);
}
```

줄 별 설명에 대해요

<div class="content-ad"></div>

먼저 시리얼 통신 및 블루투스 연결에 필요한 라이브러리를 포함합니다.

```js
#include <BluetoothSerial.h>
#include <HardwareSerial.h>
```

그 다음에는 사용할 UART 포트를 선택합니다.

```js
HardwareSerial SerialPort(2);
```

<div class="content-ad"></div>

그럼 SerialBT 인스턴스를 만들고 Bluetooth 연결 오류 감지 코드를 포함시킵니다.

```js
BluetoothSerial SerialBT;
byte BTd;
/* Bluetooth 설정이 SDK에서 활성화되어 있는지 확인합니다 */
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth가 활성화되어 있지 않습니다! `make menuconfig`를 실행하여 활성화하세요
#endif
```

void setup 블록에서는 시리얼 통신을 초기화하여 보레이트와 핀을 설정하고, Bluetooth 연결을 설정합니다.

```js
Serial.begin(115200);
SerialPort.begin(15200, SERIAL_8N1, 16, 17);
SerialBT.begin("ESP32");
```

<div class="content-ad"></div>

마침내 루프 블록에서는 Bluetooth 시리얼 포트 데이터 감지 코드를 포함하고, 그 후 Bluetooth 연결을 통해 받은 데이터에 따라 UART로 데이터를 전송하기 위한 조건문을 작성합니다. 시리얼 포트를 통해 데이터를 전송하기 위해 SerialPort.print(data); 함수를 사용합니다.

```js
  if(SerialBT.available())
  {
    BTd=SerialBT.read();
    Serial.write(BTd);
  }
  if(BTd=='1')
  {
    SerialPort.print(1);
  }
  if(BTd=='0')
  {
    SerialPort.print(0);
  }
```

코드-슬레이브 모듈

스레이브 ESP32의 코드는 다음과 같습니다.

<div class="content-ad"></div>

```js
#include <HardwareSerial.h>
```

먼저 라이브러리를 포함합니다.

그런 다음 사용할 포트를 선택하고 들어오는 데이터를 저장할 문자 변수를 정의합니다.

<div class="content-ad"></div>

```js
HardwareSerial SerialPort(0); // UART0을 사용합니다
char number  = ' ';
```

void setup 블록에서는 UART 통신을 시작하기 위해 보레이트와 포트 핀을 설정합니다.

```js
  Serial.begin(115200);
  SerialPort.begin(15200, SERIAL_8N1, 3, 1);
```

void loop 블록에서는 마스터로부터 데이터를 수신하고 시리얼 모니터에 표시합니다. SerialPort.available() 함수를 사용하여 시리얼 포트에서 데이터를 수신할 준비가 되어 있는지 확인한 후, SerialPort.read() 함수를 사용하여 데이터를 char 변수에 저장합니다.

<div class="content-ad"></div>

```js
 if (SerialPort.available())
 {
    char number = SerialPort.read();
    Serial.write(number);

 }
```

결과

ESP32 모듈에 두 코드를 업로드한 후, 슬레이브 모듈의 시리얼 모니터를 열고 블루투스 통신을 통해 마스터 모듈로 '1' 또는 '0'을 전송합니다. 수신된 데이터는 시리얼 모니터에 표시됩니다. 또한 동일한 표시된 데이터를 사용하여 LED 제어와 같은 조건문을 사용하여 이벤트를 트리거할 수도 있습니다. 블루투스를 통해 수신한 데이터를 직접 전송할 수는 없으므로 조건문을 사용해야 하며 특정 데이터만 전송할 수 있습니다.

참고로, 유료 콘텐츠 작성 및/또는 기사 작성 작업을 위해 ESP32 보드에 대한 무료 안내가 필요할 경우 khantalha7367@gmail.com로 연락하시거나 Fiverr 기가를 방문해주십시오. https://www.fiverr.com/s/rL3mWN, https://www.fiverr.com/s/7rj8Xy

