---
title: "SIM800L로 Arduino에서 메시지를 보내고 전화 거는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_0.png"
date: 2024-06-22 18:49
ogImage: 
  url: /assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_0.png
tag: Tech
originalTitle: "How to send a message and make a phone call from Arduino with SIM800L?"
link: "https://medium.com/@robotamateur123/how-to-send-a-message-and-make-a-phone-call-from-arduino-with-sim800l-f65db28a5c60"
---


이 기사에서는 아두이노로 문자 메시지를 보내고 전화를 거는 방법을 공유하고 싶습니다. 그 방법으로 "SIM800L"을 사용할 겁니다.

![이미지](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_0.png)

SIM800L은 세계에서 가장 작은 GSM(Global System for Mobile communication) 모듈입니다. 이 모듈은 UART(Universal Asynchronous Receiver / Transmitter)를 통해 아두이노와 데이터를 교환하는 통신 프로토콜을 사용합니다.

이것은 취미 프로젝트에 아주 좋은 저렴한 가격의 솔루션이에요! 아래 링크를 통해 구입할 수 있습니다 (스폰서가 아니에요, 제가 Aliexpress에서 구입했는데 아주 잘 작동합니다!):

<div class="content-ad"></div>

## 하드웨어 구매 링크:

- SIM800L: AliExpress (4$27)
- 아두이노 메가: AliExpress (11$31)
- 저항 및 LED 키트: AliExpress (2$74)
- 점퍼 케이블: AliExpress (1$07)
- 최소 3.4V-4.4V 및 최소 2A를 제공할 수 있는 파워 뱅크.

# YouTube 비디오

만약 이 튜토리얼의 비디오 버전을 선호한다면, 제 YouTube 채널을 방문해 주세요:

<div class="content-ad"></div>

# 단계 1: 보드에 솔더링하기!

보드를 받았을 때 핀들이 아직 솔더링되지 않았습니다. 따라서 먼저 SIM800L 보드의 핀들을 솔더링해야 합니다. 그리고 이 모듈에는 2개의 안테나가 함께 제공됩니다: 하나는 금속 나선 모양의 안테나이고, 다른 하나는 전선이 달린 녹색 보드입니다.

![이미지1](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_1.png)

![이미지2](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_2.png)

<div class="content-ad"></div>

SIM800L를 외부에서 사용할 계획이라면 나선형 안테나를 사용할 수 있어요. 나선형 안테나를 사용하기 위해서는 전자 기판에 납땜을 해야 해요.

만약 SIM800L를 집 내부 또는 케이스 내부에서 사용할 계획이라면, 보드 버전 안테나를 선택하는 것이 더 나아요. 이 안테나를 사용하면 나선형 안테나에 비해 더 좋은 연결을 얻을 수 있어요. 안테나를 사용하려면 전자 기판에 끼워 넣기만 하면 돼요.

핀들이 기판에 납땜되면 다음과 같이 보일 거예요:

![image](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_3.png)

<div class="content-ad"></div>


![SIM800L](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_4.png)

# About SIM800L

The pins of SIM800L that we are going to use are:

![SIM800L Pins](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_5.png)


<div class="content-ad"></div>

SIM800L을 사용하여 문자 메시지를 보내려면 아래와 같이 아두이노 메가에 연결해야 합니다:

![이미지](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_6.png)

![이미지](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_7.png)

여기서는 10 kOhm의 3개의 저항을 배선도에 사용하여 전압을 5V에서 3.3V로 나눕니다. SIM800L 모듈은 3.3V 논리 수준을 갖고 있지만 아두이노는 5V 논리 수준을 갖고 있기 때문에 모듈의 Rx 핀을 아두이노의 디지턈 핀에 직접 연결할 수 없습니다.

<div class="content-ad"></div>

저희 프로젝트에서는 SoftwareSerial 라이브러리를 사용할 예정입니다. 이 라이브러리를 이용하면 아두이노 보드의 다른 디지털 핀을 사용하여 시리얼 통신이 가능하며, 이 기능을 소프트웨어로 구현하여 이름이 "SoftwareSerial"인 것입니다. 다만, 이 라이브러리에는 제약 사항이 있습니다. 메가 및 메가 2560 보드의 모든 핀이 변경 인터럽트를 지원하지 않기 때문에 RX로 사용할 수 있는 핀은 다음과 같습니다: 10, 11, 12, 13, 14, 15, 50, 51, 52, 53, A8 (62), A9 (63), A10 (64), A11 (65), A12 (66), A13 (67), A14 (68), A15 (69). 이에 따라 저희의 배선도에서 핀 10과 핀 11을 사용하고 있습니다.

## LED 상태 표시등

<img src="/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_8.png" />

코드를 테스트하기 전에 SIM800L의 LED 표시등을 확인해 보겠습니다. 이 LED는 셀룰러 네트워크의 상태를 나타내기 위해 다른 속도로 깜박입니다.

<div class="content-ad"></div>

- 1초마다 깜빡입니다: 칩은 실행 중이지만 아직 셀룰러 네트워크에 연결되지 않았습니다.
- 2초마다 깜빡입니다: 요청된 GPRS 데이터 연결이 활성화되었습니다.
- 3초마다 깜빡입니다: 모듈이 셀룰러 네트워크에 연결되어 음성과 텍스트 메시지를 주고받을 수 있습니다.

## 작동 전압

SIM800L의 작동 전압은 3.4V - 4.4V입니다. 하지만, SMS를 보내거나 전화를 걸 때 전류가 최대 2A까지 증가할 수 있습니다. 이는 매우 중요한 기준입니다. 공급 전력이 적어도 2A와 3.4V를 제공할 수 없다면 SMS를 보내거나 전화를 걸지 못할 수 있습니다.

이 프로젝트에서는 최대 5V와 3A를 제공하는 충전 보조 배터리를 사용했습니다. 보드는 잘 작동하지만, 이상적으로는 동작 전압 범위(3.4V - 4.4V) 내에 공급 전압이 들어오도록 DC-DC 컨버터를 추가하는 것이 좋습니다. 과도한 공급 전력은 보드를 손상시킬 수 있습니다.

<div class="content-ad"></div>

## Baud Rate

1200 bps부터 115200 bps까지의 속도를 지원하며 자동 속도 감지 기능이 있습니다. 저희 프로젝트에서는 9600 bps를 사용할 예정입니다.

## 디버깅 팁

# 연결 코드 테스트

<div class="content-ad"></div>

이제 Arduino 보드에 다음 코드를 업로드할 수 있습니다:

```js
#include <SoftwareSerial.h>

// SIM800L과 통신하기 위한 소프트웨어 시리얼 객체 생성
SoftwareSerial sim800l(11, 10); // SIM800L Tx & Rx를 Arduino #11 및 #10에 연결
void setup()
{
  // Arduino 및 Arduino IDE (시리얼 모니터)와의 시리얼 통신 시작
  Serial.begin(9600);
  
  // Arduino 및 SIM800L과의 시리얼 통신 시작
  sim800l.begin(9600);

  Serial.println("초기화 중...");
  delay(1000);

  sim800l.println("AT"); // 핸드셰이크 테스트가 성공하면 'OK'로 반환됩니다.
  updateSerial();
  sim800l.println("AT+CSQ"); // 신호 품질 테스트, 값의 범위는 0에서 31까지이며, 31이 가장 좋습니다.
  updateSerial();
  sim800l.println("AT+CCID"); // SIM 정보를 읽어 SIM이 꽂혀 있는지 확인합니다.
  updateSerial();
  sim800l.println("AT+CREG?"); // 네트워크에 등록되었는지 확인합니다.
  updateSerial();
}

void loop()
{
  updateSerial();
}

void updateSerial()
{
  delay(500);
  while (Serial.available()) 
  {
    sim800l.write(Serial.read()); // Serial이 전달한 내용을 소프트웨어 시리얼 포트로 전달합니다.
  }
  while(sim800l.available()) 
  {
    Serial.write(sim800l.read()); // 소프트웨어 시리얼이 수신한 내용을 시리얼 포트로 전달합니다.
  }
}
```

시리얼 모니터를 열 때 'Both NL and CR' 옵션이 선택되었는지 확인하세요!

Arduino IDE의 시리얼 모니터는 다음 메시지를 반환해야 합니다:

<div class="content-ad"></div>


![How to send a message and make a phone call from Arduino with SIM800L - Part 9](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_9.png)

![How to send a message and make a phone call from Arduino with SIM800L - Part 10](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_10.png)

"AT+CSQ" 명령어를 입력하면 21,0이 반환됩니다. 신호의 품질이 상당히 좋음을 의미합니다.

"AT+CCID" 명령어를 입력하면 xxxxxxxxxxxxxxxxxx (20자리 숫자)가 반환됩니다. 이 명령어는 설치된 SIM 카드의 고유 통합 회로 카드 식별자(ICCID)를 반환합니다.


<div class="content-ad"></div>

"AT+CREG?"은 0, 1을 반환합니다. SIM800L이 홈 네트워크에 등록되었음을 의미합니다.

## 자주 발생하는 문제:

연결 중에 실수를 하면 (예: 선을 잊었거나 잘못된 저항을 사용한 경우), "테스트 연결 코드"는 Serial Monitor에 "Initializing..."만 출력합니다. Arduino는 SIM800L과 통신할 수 없습니다. 이 경우 배선을 다시 한 번 확인해주세요!

![이미지](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_11.png)

<div class="content-ad"></div>

만약 당신의 SIM800L의 전원 공급이 2A를 제공할 수 없다면 LED 표시등은 1초에 한 번 깜박일 것입니다. 그러나 연결 테스트는 다음과 같은 메시지를 반환할 것입니다:

“AT+CSQ”를 입력하면 0, 0이 반환됩니다. 이것은 신호 품질이 매우 나쁘다는 것을 의미합니다.

“AT+CREG?”를 입력하면 0, 2가 반환됩니다. 이것은 SIM800L이 어떤 네트워크에도 등록되어 있지 않다는 것을 의미합니다.

<img src="/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_12.png" />

<div class="content-ad"></div>

# 단계 2: SIM800L로 텍스트 메시지 보내기

SMS를 보내려면 sim800l.println("AT+CMGF=1")을 사용하여 메시지 형식을 선택할 수 있습니다. sim800l.println("AT+CMGS=\"+ZZxxxxxxxxxx\"")를 사용하여 괄호 안에 제공된 전화 번호로 SMS를 전송하세요. ZZ는 전화 번호의 국가 코드입니다. sim800l.print("Hello from Robot Amateur!!!")를 사용하여 해당 번호로 텍스트 메시지를 보내세요.

```js
#include <SoftwareSerial.h>

// SIM800L과 통신하기 위한 소프트웨어 시리얼 객체 생성
SoftwareSerial sim800l(11, 10); //SIM800L Tx & Rx가 Arduino #11 및 #10에 연결되어 있습니다.

void setup()
{
  // Arduino 및 Arduino IDE (시리얼 모니터)와의 시리얼 통신 시작
  Serial.begin(9600);
  
  // Arduino 및 SIM800L과의 시리얼 통신 시작
  sim800l.begin(9600);

  Serial.println("초기화 중..."); 
  delay(1000);

  sim800l.println("AT"); // 핸드셰이크 테스트 성공 시 OK로 돌아갑니다.
  updateSerial();

  sim800l.println("AT+CMGF=1"); // 텍스트 모드 설정
  updateSerial();
  sim800l.println("AT+CMGS=\"+ZZxxxxxxxxxx\"");//ZZ를 국가 코드로, xxxxxxxxxx를 전화 번호로 변경하여 SMS를 보냅니다.
  updateSerial();
  sim800l.print("Hello from Robot Amateur!!!"); //텍스트 내용
  updateSerial();
  sim800l.write(26);
}

void loop()
{
}

void updateSerial()  
{
  delay(500);
  while (Serial.available()) 
  {
    sim800l.write(Serial.read()); // 시리얼이 수신한 내용을 소프트웨어 시리얼 포트로 전달합니다.
  }
  while(sim800l.available()) 
  {
    Serial.write(sim800l.read()); // 소프트웨어 시리얼이 수신한 내용을 시리얼 포트로 전달합니다.
  }
}
```

모든 것이 잘 작동하면 시리얼 모니터에서 아래 메시지를 볼 수 있어야 합니다. 모듈 LED 표시등은 3초마다 한 번씩 깜박이고 있어야 합니다. 그리고 아래와 같이 핸드폰으로 "Hello from Robot Amateur!!!" 텍스트 메시지를 받아야 합니다!

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_13.png)

## 자주 발생하는 문제:

만약 SIM 카드에 PIN 코드가 설정되어 있다면, SIM800L을 사용하기 전에 먼저 PIN 코드를 SIM800L에 전송해야 합니다.

예를 들어, 제 경우에는 "AT+CMGF= "+전화 번호"" 명령어로 "ERROR"라는 메시지를 받고 있었습니다. 이는 텍스트 메시지가 성공적으로 전송되지 않았음을 의미합니다.


<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_14.png)

![Image 2](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_15.png)

One potential reason may be: your sim card is locked with a pin.

You have 2 solutions:


<div class="content-ad"></div>

- SIM 카드 핀 제거하기:

휴대폰에 SIM 카드를 넣고, 설정-`SIM 카드 잠금-`SIM 카드 잠금 설정으로 이동하세요. 만일 SIM 카드에 핀 코드가 설정되어 있다면, 아래 화면과 유사해야 합니다:

![이미지](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_16.png)

“SIM 카드 잠금 해제” 슬라이드 버튼을 클릭하여 비활성화하세요. SIM 카드의 잠금을 해제하기 위해 핀 코드를 입력해야 합니다.

<div class="content-ad"></div>

![img1](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_17.png)

한번 실행하면 아래 화면을 보게 될 거에요. 이제 SIM 카드 PIN 코드가 비활성화되었습니다.

![img2](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_18.png)

2. `setup()` 함수에 SIM 카드 핀을 보내요

<div class="content-ad"></div>

대신, SIM 카드 핀을 설정() 함수에 보내어 잠금을 해제할 수도 있습니다. 예를 들어, 핀이 1234인 SIM 카드를 잠금 해제하려면 설정() 루프에 다음 코드를 추가해야 합니다:

```js
String SIM_PIN_CODE = String("1234");
sim800l.print("AT+CPIN=");
sim800l.println(SIM_PIN_CODE);
```

업데이트된 코드는 아래와 같습니다:

```js
#include <SoftwareSerial.h>

// SIM800L과 통신하기 위한 소프트웨어 시리얼 객체 생성
SoftwareSerial sim800l(11, 10); // SIM800L의 Tx 및 Rx를 아두이노 #11 및 #10에 연결

void setup()
{
  // 아두이노 및 아두이노 IDE(시리얼 모니터)와의 시리얼 통신 시작
  Serial.begin(9600);
  
  // 아두이노와 SIM800L 간의 시리얼 통신 시작
  sim800l.begin(9600);

  Serial.println("초기화 중...");
  delay(1000);

  sim800l.println("AT"); // 핸드셰이크 테스트 성공시 OK로 돌아갑니다
  updateSerial();

  String SIM_PIN_CODE = String("1234");
  sim800l.print("AT+CPIN=");
  sim800l.println(SIM_PIN_CODE);
  updateSerial();

  sim800l.println("AT+CMGF=1"); // 텍스트 모드 구성
  updateSerial();
  sim800l.println("AT+CMGS=\"+ZZxxxxxxxxxx\""); // ZZ를 국가 코드로 변경하고 xxxxxxxxxxx를 문자 메시지로 보낼 전화번호로 변경
  updateSerial();
  sim800l.print("로봇 아마추어에서 안녕하세요!!!"); // 텍스트 내용
  updateSerial();
  sim800l.write(26);
}

void loop()
{
}

void updateSerial()
{
  delay(500);
  while (Serial.available())
  {
    sim800l.write(Serial.read()); // 시리얼이 받은 내용을 소프트웨어 시리얼 포트로 전달
  }
  while (sim800l.available())
  {
    Serial.write(sim800l.read()); // 소프트웨어 시리얼이 받은 내용을 시리얼 포트로 전달
  }
}
```

<div class="content-ad"></div>

만약 모든 것이 제대로 작동한다면, 시리얼 모니터는 아래와 같이 보일 것입니다:

![이미지](assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_19.png)

![이미지](assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_20.png)

제 경우에는 SIM 카드의 PIN 코드가 1234이기 때문에 "AT+CPIN=1234"를 보냈습니다. 여러분은 여러분의 PIN 코드로 숫자를 조정할 수 있습니다. 이 명령은 OK를 반환하는데, 이는 PIN 코드가 성공적으로 전송되었음을 의미합니다.

<div class="content-ad"></div>

"AT+CMGF=1"을 입력하고 OK가 반환되면, 텍스트 메시지를 보내는 모드가 성공적으로 설정되었음을 의미합니다.

당신의 핸드폰에서는 "문자 메시지 보내기 - 핸드폰 화면"에서 보여지는 것과 동일한 메시지를 받아야 합니다.

# 단계 3: SIM800L로 전화 걸기

전화를 걸기 위해, 먼저 핸드셰이크를 위해 sim800l.println("AT")을 사용합니다. 그 후에, 전화를 걸기 위해 sim800l.println("ATD+ +ZZxxxxxxxxxx;")를 사용합니다. 괄호 안에 제공된 전화 번호로 전화를 걸고, 마지막으로 sim800l.println("ATH")을 사용하여 전화를 끊어줍니다.

<div class="content-ad"></div>


#include <SoftwareSerial.h>

// SIM800L과 통신하기 위한 소프트웨어 시리얼 객체 생성
SoftwareSerial sim800l(11, 10); // SIM800L의 Tx와 Rx를 아두이노의 11번 핀과 10번 핀에 연결

void setup()
{
  // 아두이노 및 아두이노 IDE (시리얼 모니터)와의 시리얼 통신 시작
  Serial.begin(9600);
  
  // 아두이노와 SIM800L 간의 시리얼 통신 시작
  sim800l.begin(9600);

  Serial.println("초기화 중..."); 
  delay(1000);

  sim800l.println("AT"); // 핸드셰이크 테스트 성공시 OK로 돌아옵니다
  updateSerial();

  String SIM_PIN_CODE = String("1234");
  sim800l.print("AT+CPIN=");
  sim800l.println(SIM_PIN_CODE);
  updateSerial();
  
  sim800l.println("ATD+ +ZZxxxxxxxxxx;"); // ZZ에 국가 코드, xxxxxxxxxxx에 전화 걸 번호를 입력하세요
  updateSerial();
  delay(20000); // 20초 동안 대기합니다...
  sim800l.println("ATH"); // 전화 끊기
  updateSerial();
}

void loop()
{
}

void updateSerial()
{
  delay(500);
  while (Serial.available()) 
  {
    sim800l.write(Serial.read()); // 시리얼이 수신한 내용을 소프트웨어 시리얼 포트로 전달
  }
  while (sim800l.available()) 
  {
    Serial.write(sim800l.read()); // 소프트웨어 시리얼이 수신한 내용을 시리얼 포트로 전달
  }
}


이 코드를 업로드한 후 시리얼 모니터에 다음과 같은 메시지가 출력되었습니다. 모듈 LED 표시등은 3초마다 한 번 깜박여야 합니다. "AT+CPIN=1234" 명령이 "ERROR"를 반환했지만, "ATD+ +ZZxxxxxxxxxx;" 명령은 OK를 반환하여 전화가 성공적으로 걸렸음을 의미합니다.

![아두이노 SIM800L을 사용하여 메시지 보내고 전화 걸기](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_21.png)

![아두이노 SIM800L을 사용하여 메시지 보내고 전화 걸기](/assets/img/2024-06-22-HowtosendamessageandmakeaphonecallfromArduinowithSIM800L_22.png)


<div class="content-ad"></div>

# 결론

축하합니다! 이제 아두이노로 SMS를 보내고 전화를 걸 준비가 되었습니다! 이제 이를 집 안전 프로젝트에 적용할 수 있습니다. 예를 들어, 집 안전 프로젝트에 사용할 수 있습니다.

질문이 있으시면 언제든지 댓글을 남겨주세요. DIY 프로젝트에 대한 흥미로운 아이디어가 있다면 댓글을 남겨주세요!