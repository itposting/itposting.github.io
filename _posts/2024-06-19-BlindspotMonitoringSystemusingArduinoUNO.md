---
title: "아두이노 UNO를 활용한 블라인드스팟 모니터링 시스템"
description: ""
coverImage: "/assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_0.png"
date: 2024-06-19 17:42
ogImage: 
  url: /assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_0.png
tag: Tech
originalTitle: "Blindspot Monitoring System using Arduino UNO."
link: "https://medium.com/geekculture/blindspot-monitoring-system-using-arduino-uno-a5a8dd074280"
---



![2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_0](/assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_0.png)

저는 현재 여름 휴가 중이에요. 시간 보내는 제가 가장 좋아하는 방법 중 하나는 결코 사지 못할 차량들을 소개하는 YouTube 동영상을 보는 거예요. YouTube에서 차량 리뷰를 살펴보다가, 2021년 메르세데스 벤츠 S클래스의 리뷰를 발견했는데, 차량이 블라인드 스팟에 감지되면 문 옆 주변 조명이 빨갛게 깜빡이는 멋진 작은 기능에 꽂혔어요 (액티브 앰비언트 라이팅, 그렇게 생각해요). 간단하면서 효과적이죠 — 그것이 독일의 엔지니어링이죠.

![2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_1](/assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_1.png)

제가 보고 있던 리뷰 링크를 여기에 공유할게요.


<div class="content-ad"></div>

최근에 Arduino Uno도 시도해봤어요. AtMega328P 마이크로컨트롤러를 탑재한 작은 개발 보드인데요. 2021 메르세데스 S-Class의 블라인드스팟 경고 시스템에 놀랐기에 Arduino UNO를 활용해 나만의 시스템을 만들어보기로 결심했어요.

## 부품 및 준비물

- Arduino Uno
- 브레드보드 (옵션)
- RGB LED 스트립 (≤1 미터)
- HC-SR04 초음파 센서
- Arduino IDE가 설치된 노트북/데스크탑

## 회로 설계

<div class="content-ad"></div>

아래는 코드에 대한 링크입니다.

## 논리

<div class="content-ad"></div>

- 핀 및 트리거 거리를 초기화합니다. 
- 호스트와 오브젝트 간의 거리를 계산합니다.
- 계산된 거리를 트리거 거리와 비교하여 색깔을 깜빡입니다.
- 내 코드에서는 오브젝트가 30cm 이내에 있을 때 LED 스트립이 주황색으로 깜빡이고, 10cm 이내에 있을 때는 빨간색으로 깜빡입니다. 객체를 감지하지 못할 때는 LED 스트립이 파랑색으로 변합니다. 원하는 대로 색상을 변경할 수 있습니다.

![이미지](/assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_3.png)

## 코드 설명

변수 및 상수를 초기화합니다.

<div class="content-ad"></div>

먼저, 코드 작성 시 나중에 사용할 모든 변수와 상수를 초기화해야 합니다. 상수 g, b, r은 RGB LED 스트립의 핀을 정의하는 데 사용됩니다. echoPin 및 trigPin은 초음파 센서에 사용된 상수입니다.

참고: LED 스트립의 밝기를 제어하기 위해 아두이노의 PWM 핀을 사용하고 있습니다.

```js
// RGB 스트립 핀 초기화
#define b 6 
#define g 5 
#define r 3 
// 초음파 센서 핀 초기화
#define echoPin 8
#define trigPin 12
```

블라인드스팟 경고 알림에는 두 단계가 있으므로 trigDist1 (첫 번째 트리거) 및 trigDist2 (두 번째 트리거) 두 상수를 초기화해야 합니다. duration 및 distance 변수는 센서와 개체 사이의 거리를 계산하는 데 사용됩니다. fade 변수는 LED가 대기 상태일 때 fade-in 효과에 사용될 부울 형식의 변수입니다.

<div class="content-ad"></div>

```js
#define trigDist1 30
#define trigDist2 10
long duration;
int distance;
 
bool fade=true;
```

설정

모든 변수와 상수를 초기화한 후에, 핀 모드를 설정하고 시리얼 통신을 baud rate 9600으로 시작합니다. setup() 함수는 코드를 컴파일한 후에 처음에 한 번만 실행됩니다.

```js
void setup() {
 Serial.begin(9600);  
 pinMode(g,OUTPUT);  
 pinMode(b,OUTPUT);  
 pinMode(r,OUTPUT);  
 pinMode(trigPin, OUTPUT);  
 pinMode(echoPin, INPUT);
}
```

<div class="content-ad"></div>

호스트와 객체 사이의 거리를 계산하는 함수입니다.

```js
void calDistance(){  
 digitalWrite(trigPin, LOW); 
 delayMicroseconds(2); 
 digitalWrite(trigPin, HIGH); 
 delayMicroseconds(10); 
 digitalWrite(trigPin, LOW); 
 duration = pulseIn(echoPin, HIGH); 
 distance = duration * 0.034 / 2; 
 Serial.println(distance);
}
```

<div class="content-ad"></div>

pulseIn() 함수는 핀이 LOW에서 HIGH로 전환될 때 대기하고 타이밍을 시작한 다음 핀이 LOW로 전환되기를 기다리고 타이밍을 중지합니다. 펄스의 길이를 마이크로초 단위로 반환하거나 제한 시간 내에 완전한 펄스를 받지 못하면 0을 반환합니다.

2. fadedRed()

이 함수는 펄스 폭 변조와 for 루프의 도움으로 LED 스트립을 서서히 깜박거리게 만듭니다. 첫 번째 for 루프는 LED의 밝기를 서서히 증가시키고 두 번째 for 루프는 LED의 밝기를 서서히 감소시킵니다. val은 깜박임의 빈도를 제어할 수 있는 매개변수로 사용됩니다.

```js
void fadedRed(int val){ 
 for(int i=255; i>0; i-=val){    
  analogWrite(r, i);        
  analogWrite(g, 255);    
  analogWrite(b, 255);    
  delay(5); 
 }   
 for(int i=0; i<255; i+=val){   
  analogWrite(r, i);         
  analogWrite(g, 255);     
  analogWrite(b, 255);     
  delay(5);  
 }
}
```

<div class="content-ad"></div>

3. fadedOrange()

이 함수는 이전 것과 비슷하지만, 빨강과 초록을 섞어 주황색을 생성하는 데 약간의 어려움이 있었습니다. 아직 완벽하지 않지만, 초록색의 백분율을 제한하기 위해 삼항 연산자를 사용하여 최선을 다했습니다. 이에 대한 더 나은 해결책이 있으면 댓글 섹션에서 알려주세요.

```js
void fadedOrange(int val){ 
 for(int i=255; i>0; i-=val){     
  analogWrite(r, i);          
  analogWrite(b, 255);    
  analogWrite(g, i>230?i:230);    
  delay(5);  
 }   
 for(int i=0; i<255; i+=val){    
  analogWrite(r, i);         
  analogWrite(b, 255);    
  analogWrite(g,i<230?240:i);   
  delay(5);  
  }
}
```

4. fadeInBlue()

<div class="content-ad"></div>

이 함수는 LED를 깜박이지 않고, 깜박이는 LED에서 정적 LED로 전환하는 데, fade 변수를 사용하여 페이드 효과를 추가했습니다. 이 변수는 LED가 이미 파란색으로 변했는지 확인하고, 아직 변하지 않았다면 파란색으로 서서히 변합니다.

```js
void fadeInBlue(){  
 if(fade==true){   
  for(int i=255; i>0; i-=1){     
   analogWrite(g, 255);     
   analogWrite(r, 255);     
   analogWrite(b, i);      
   delay(5);    
  }  
 }  
 fade=false;  
 analogWrite(g, 255);  
 analogWrite(r, 255); 
 analogWrite(b, 0);
}
```

loop() 함수로 모든 것을 묶기

loop() 함수는 코드가 실행되기 시작하면 반복해서 실행됩니다. 이전에 선언된 모든 함수는 loop() 함수에서 호출됩니다. 거리를 계산한 후, 거리를 트리거 거리와 비교하고 적절한 색상을 출력합니다.

<div class="content-ad"></div>

```js
void loop() {  
 calDistance(); 
 if(distance<=trigDist1 && distance>trigDist2){  
  fadedOrange(3);  
  fade=true; 
 }
 else if(distance<=trigDist2){  
  fadedRed(3);  
  fade=true; 
 } 
 else{  
  fadeInBlue(); 
 }
}
```

이 프로젝트의 로직은 전체적으로 매우 직관적이며 코드를 쉽게 조정할 수 있습니다.

프로젝트의 비디오 데모는 다음과 같습니다:

<img src="/assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_4.png" />


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-BlindspotMonitoringSystemusingArduinoUNO_5.png" />

## 향후 개선 사항

- 일반 RGB LED 스트립을 WS2812B 주소 지정 가능한 LED 스트립으로 교체합니다. WS2812B LED는 FastLED 라이브러리와 함께 사용하면 동적한 스와이프 패턴과 다양한 색상 생성이 쉬워집니다.

## 이 프로젝트를 왜 만들었나요?

<div class="content-ad"></div>

저의 재미있는 첫 번째 아두이노 기반 프로젝트였어요. 이 프로젝트를 통해 완전히 즐길 수 있는 흥미로운 것을 만들고 싶었어요. 자동차와 기술은 항상 가장 흥미로운 주제였죠. 게다가 오랜만에 미디움 기사를 쓰지 않았고, 이것을 모두와 공유하면 좋겠다고 생각했어요. 이 기사가 여러분의 삶에 가치를 더해주고, 저처럼 이 재미있고 작지만 재미있는 프로젝트를 즐기셨으면 좋겠어요. 프로젝트와 관련된 의구심이 있으면 댓글란에 남겨주시면 최선을 다해 도와드리겠습니다. 안녕!

제 블로그를 좋아하셨다면 커피 사주실 수도 있어요.