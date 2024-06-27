---
title: "짝커 - 아두이노로 박수 감지 스위치를 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_0.png"
date: 2024-06-20 17:03
ogImage: 
  url: /assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_0.png
tag: Tech
originalTitle: "The Clapper — How to make a “clap sensitive” switch with Arduino."
link: "https://medium.com/@micatovin/the-clapper-how-to-make-a-clap-sensitive-switch-with-arduino-872c917e00df"
---


당신이 말한 코딩에 관한 책이 필요하다면 언제든지 물어보세요! 저는 여러가지 책과 자료를 추천해드릴 수 있어요. 요즘 프로그래밍을 배우는 것은 정말 뜻깊은 경험이 될거에요. 함께 열심히 공부해서 좋은 개발자가 되어봐요!😊

<div class="content-ad"></div>

필요한 것이 있을까요? 하드웨어부터 시작해봅시다. 이러한 프로젝트를 위해서는 하드웨어가 필수입니다. 사용된 구성 요소 목록은 다음과 같습니다:

- 브레드보드 (1개)
- LED (1개)
- 아두이노 Me 마이크로컨트롤러 (거의 모든 마이크로컨트롤러를 사용할 수 있습니다) (1개)
- 소리 센서 (1개)
- 1000R 저항 (1개)
- M-F 점퍼 케이블 (3개)
- M-M 점퍼 케이블 (5개)
- 전원 공급원 (1개)

## 핀 매칭

![핀 매칭](/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_1.png)

<div class="content-ad"></div>

## 코드

가장 기본적인 구현부터 시작해서 원하는 대로 가보자. 우리의 사운드 센서로부터 신호를 수신하고, 신호를 "임계값"과 비교하는 코드를 구현해보자. 만약 신호가 임계값을 초과하면 LED 라이트를 토글한다.

```js
 // sound-sensitive-switch-v1.ino

const int micPin = A0; // 마이크가 연결된 아날로그 입력 핀
const int ledPin = 2;
const int threshold = 60;

int sensorValue = 0;
bool ledState = false;

void setup() {
 Serial.begin(9600);
 
 pinMode(micPin, INPUT);
 pinMode(ledPin, OUTPUT);
}

void loop() {
 sensorValue = analogRead(micPin);
 
 // 박수 감지 로직
 if (sensorValue > threshold) {
  // 박수 감지!
  digitalWrite(ledPin, ledState ? LOW : HIGH);
  ledState = !ledState;
  
  delay(500); // 여러 번 트리거를 방지하기 위한 디바운스 딜레이
 }

 delay(10); // 샘플링 딜레이
}
```

연결이 제대로 되어있다면 주어진 임계값을 초과하는 모든 소리로 라이트를 트리거할 수 있어야 합니다. 그러나 이 설정과 코드에 대한 또 다른 문제로 우리를 이끌어간다면, 마이크 민감도입니다. 나의 실험에서, 마이크를 낮은 민감도로 설정하면 회로 내의 소리 센서에서의 잡음을 더 잘 관리할 수 있었습니다. 이것은 완벽하지 않았으며, 조용한 환경에서도 0-45 사이의 신호값을 가지고 있었습니다. 이 레벨의 침묵을 달성하기 위해 소리 센서 부품의 기록용 가변저항을 사용했습니다. 이것은 3326 모델이며, 회로에서 잡음 신호를 줄이기 위해 회전시킬 수 있습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_2.png)

여기에는 포트 튜닝 전후의 신호 데이터가 표시되어 있습니다. Y축에서 볼 수 있듯이, 튜닝 전에는 40 이상의 값이 나타나는 반면, 튜닝 후에는 10 미만으로 감소된 것을 확인할 수 있습니다.

포트 튜닝 전.

![image](/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_3.png)


<div class="content-ad"></div>

그 후, 마이크 민감도를 더 줄일 수 있다는 것을 발견했습니다. 더 부드러운 파형을 강제하는데 그러나 다른 제약 사항이 있었습니다. 클랩하면 스위치가 활성화되는 매우 높은 수준의 소음이 있어야 했습니다.

![이미지](/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_4.png)

참고: 마이크로컨트롤러에 따라 다른 베이스라인 읽기가 있는 것을 알았습니다. 내 아두이노 Uno Mini가 소음 수준에서 나의 아두이노 메가보다 더 나은 성능을 발휘했습니다.

위의 조정을 하고 나서, 라이트 스위치가 작동하지만 우리의 진폭 임계값을 초과하는 모든 소리에 의해 트리거됩니다. 이와 같은 문제에 직면했을 때는 전략 재고가 필요합니다. 그래서 다시 기본부터 시작하겠습니다.

<div class="content-ad"></div>

손뼉 소리는 복잡한 소리 파형을 생성하지 않는다는 것을 알아봅시다. 마이크가 고품질이 아닌 것이 이를 강조합니다. 더 복잡한 파형은 분석을 위한 더 명확한 신호를 제공할 수 있을지 모르지만, 여전히 간단한 손뼉에서 유용한 통찰을 얻을 수 있습니다. 나는 아두이노를 연결하여 손뼉의 특성을 나타내는 그래프를 그리는 데이터를 캡처했습니다. 여기에 결과가 있습니다.

![TheClapper](/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_5.png)

손뼉은 소리 파동의 진폭이 급격하게 증가한 후 급격히 감소하는 것으로 특징 지어집니다. 그러나, 이 정의는 한 가지 문제점을 강조합니다: 비슷한 특성은 문을 세게 닫거나 탁을 치거나 책을 떨어뜨릴 때와 같은 다양한 소리로도 나타낼 수 있습니다.

이를 해결하기 위해 이러한 제한을 극복할 전략을 개발해 보겠습니다. 여기 잠재적인 접근 방식이 있습니다:

<div class="content-ad"></div>

- 소리를 캡처합니다.
- 녹음된 소음 레벨이 미리 정의된 진폭 임계값을 초과하는지 확인합니다.
- 특정 시간 창 내에서 추가 소음을 청취합니다.
- 박수의 빠르게 감소하는 특성과 일치하는지 확인하기 위해 소리의 감쇠 속도를 분석합니다. 그렇다면 원하는 작업(예: 조명 켜기/끄기)을 계속 진행합니다.

이 프로그램의 핵심은 명백히 소리 인식이므로, 박수의 소리파를 어떻게 인식할 수 있는지 궁금해집니다.

변화를 분석하고 감지하기 위해 ML 모델을 사용하는 것이 떠올랐기 때문에, 이러한 특성을 찾기 위한 모델을 개발했습니다. 그러나 이에 대해 다른 글에서 자세히 다루겠습니다. tinyML과 같은 기술의 계산 요구 사항에 따라, 소리파 신호를 깨끗하고 부드럽게 만들기 위한 물리학과 수학의 방법을 먼저 조사하기로 결정했습니다. 일부 연구를 거친 후, 그리고 FFT를 시도한 후, 고역통과 필터라는 좀 더 "기본적"인 접근 방법으로 결정했습니다.

고역통과 필터

<div class="content-ad"></div>

하이 패스 필터는 일정한 차단 주파수보다 높은 주파수를 가진 신호를 통과시키고, 차단 주파수보다 낮은 주파수를 가진 신호를 약화시키는 전자 필터입니다. 이 필터는 낮은 주파수 신호를 통과시키지 않고, 대신 필터 설계에 따라 일관되게 차단합니다.

우리 필터는 어떻게 생겼을까요?

```js
// 낮은 주파수 잡음을 제거하는 간단한 하이 패스 필터
highPass = alpha * (highPass + sample - lastSample);
lastSample = sample;

// 획득기 - 절대값 취하고 평활화
envelope *= release;
envelope = max(envelope, abs(highPass));
```

highPass: 필터의 현재 값

<div class="content-ad"></div>

알파: 알파는 일반적으로 0에서 1 사이의 값으로 범위하며, 필터의 차단 주파수를 결정하는 계수입니다. 알파 값이 낮을수록 차단이 더 뚜렷해지며, 이는 필터가 이전 상태를 더 오래 유지하게 한다는 것을 의미합니다. 그 반대로 높은 값은 값을 더 많이 변경하며 알파가 클수록 부드러운 차단이 이뤄집니다.

샘플: 이것은 마이크로폰에서의 현재 입력 샘플입니다.

lastSample: 이것은 마이크로폰에서 이전에 입력한 샘플입니다.

Envelope Detector: 엔벨롭 디텍터는 소리 처리 도구로, 소리 파형의 바깥쪽 한계를 캡처하는 데 사용됩니다. 이는 신호의 급격한 변화가 아닌 파형의 진폭의 느린 변화를 캡처하는 것을 의미합니다. 아래는 디지털 하이 패스 필터를 통과한 후의 파형의 결과입니다.

<div class="content-ad"></div>

아래 코드를 Markdown 형식으로 변경했습니다:

![이미지](/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_6.png)

변경된 코드는 다음과 같습니다:

```js
// sound-sensitive-switch-v2.ino

const int micPin = A0; // 마이크가 연결된 아날로그 입력 핀
const float alpha = 0.9; // 고주파 필터용 계수

int sample;
float filtered, highPass;
float lastSample = 0;
float envelope = 0;
float release = 0.9; // 엔벨롭 감지기 용 해제 계수
int threshold = 30; // 박수 감지 임계값

bool ledState = false;
int ledPin = 2;

void setup() {
 Serial.begin(9600);
 pinMode(micPin, INPUT);
 pinMode(ledPin, OUTPUT);
}

void loop() {
 sample = analogRead(micPin);
 // 단순 고주파 필터를 사용하여 저주파 노이즈 제거
 highPass = alpha * (highPass + sample - lastSample);
 lastSample = sample;
 
 // 엔벨롭 감지기 - 정류하고 부드럽게
 envelope *= release;
 envelope = max(envelope, abs(highPass));
 
 // 박수 감지 논리
 if (envelope > threshold) {
  unsigned long timeStart = millis();
  
  while (millis() - timeStart < 100) { // 100ms 내에 빠른 감쇠 확인
   sample = analogRead(micPin);
   highPass = alpha * (highPass + sample - lastSample);
   lastSample = sample;
   envelope *= release;
   envelope = max(envelope, abs(highPass));
  }
  
  if (envelope < threshold / 2) { // 엔벨롭이 감쇠해야 함
   // 박수 감지!
   digitalWrite(ledPin, ledState ? LOW : HIGH);
   ledState = !ledState;
  }
  
  delay(500); // 다중 트리거 방지를 위한 디바운스 지연
 }

 delay(10); // 샘플링 지연
}
```

이 코드는 상당히 잘 작동합니다. 소음이 큰 음악으로 테스트했을 때, 원하는 특성을 가진 짧은 소리 폭발 이외에는 스위치를 트리거할 수 없었습니다.

<div class="content-ad"></div>

이제 시스템이 잘 작동하는 것을 확인했으니 강화를 시도해 볼 수 있을 것 같아요. 이를 위한 한 가지 방법은 트리거 소리의 파형을 더 복잡하게 만드는 것입니다. 우리는 박수 그 자체를 바꿀 수 없지만, 대신 1번의 박수 대신 2번 연속된 박수를 트리거로 인식할 수 있습니다. 이렇게 하면 책이 탁 탁하는 소리나 문이 쾅 하고 닫혀도 스위치가 작동하지 않을 가능성이 높아집니다. 이것은 간단한 선택이죠.

이를 실행하기 위해 대부분의 코드는 동일하게 유지되지만, 여기에 변경 사항이 있습니다:

```js
// 박수를 마지막으로 감지한 타임스탬프를 추적
unsigned long lastClapTime = 0;
// 발견한 박수의 횟수
int clapCount = 0;
// 더블 박수를 감지할 시간 창문 (1초)
const unsigned long clapDelay = 1000;
```

우리의 "박수 감지 로직" 안에서, 연속된 박수가 세어질 수 있는 시간 창문을 고려하면서 발견한 박수 횟수를 세는 이 코드 조각을 추가할 것입니다. 이는 500ms의 시간 창문 내에서 연속된 박수가 카운트될 수 있음을 의미하는데요. 이것은 특정한 박수 패턴을 갖게끔 하기 위해 연속된 박수를 계산하는 상한선을 여기에 표시하고 있음을 기억해 주세요.

<div class="content-ad"></div>

```js
if (timeNow - lastClapTime > 500) { // 클랩이 너무 가깝지 않게 500밀리초 간격 확인
 clapCount++;
 lastClapTime = timeNow;
}
```

여기서 중요한 점은 코드에서 clapCount가 이 시점에서 1만큼 증가했음에도 실제로 클랩으로 간주하려면 신호 읽기가 신속한 감쇠 테스트를 통과해야 한다는 것입니다. 따라서 그 코드를 구현해 보겠습니다.

```js
if (clapCount == 2 && (millis() - lastClapTime <= clapDelay)) {
 digitalWrite(ledPin, ledState ? LOW : HIGH);
 ledState = !ledState;
 clapCount = 0; // 작업 후 클랩 횟수 카운터 재설정
}
```

여기서, 스위치를 토글하기 전에 클랩 횟수가 2이고 연이어 발생한 클랩이 clapDelay 시간 내에 있는지 확인합니다.

<div class="content-ad"></div>

마지막 코드 부분은 가정정리용입니다. 여기서 clapCount가 0보다 크고 현재 시간과 박수가 발생한 시간 간의 차이 (lastClapTime)가 clapDelay 시간 프레임을 벗어나는 경우 clapCount를 재설정합니다. 즉, clap이 clapDelay 시간 프레임을 벗어나 늙었으면 그 clap을 무시합니다. 이때 clapDelay는 lastClapTime 이후 1000ms입니다.

```js
if (millis() - lastClapTime > clapDelay && clapCount > 0) {
  clapCount = 0;
}
```

이제 2개 clap을 고려한 최종 코드는 다음과 같습니다:

```js
const int micPin = A0; // 초음파가 연결된 아날로그 입력 핀
const float alpha = 0.9; // 하이패스 필터용 계수
int sample;
float highPass;
float lastSample = 0;
float envelope = 0;
float release = 0.9; // 엔벨로프 감지기의 릴리스 계수
int threshold = 20; // 박수 감지 임계값

bool ledState = false;
int ledPin = 2;
unsigned long lastClapTime = 0;
int clapCount = 0;
const unsigned long clapDelay = 1000; // 이중 박수 감지 시간 창문 (1초)

void setup() {
  Serial.begin(9600);
  pinMode(micPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  sample = analogRead(micPin);
  // 저주파 노이즈 제거를 위한 하이패스 필터
  highPass = alpha * (highPass + sample - lastSample);
  lastSample = sample;

  // 엔벨로프 감지기 - 정류 및 평활화
  envelope *= release;
  envelope = max(envelope, abs(highPass));

  Serial.println(sample);
  // 박수 감지 논리
  if (envelope > threshold) {
    unsigned long timeNow = millis();
    if (timeNow - lastClapTime > 500) {  // 박수가 너무 가깝지 않도록, 500ms 간격 확인
      clapCount++;
      lastClapTime = timeNow;
    }

    // 100ms 내에 빠르게 감소하는 경우 확인
    while (millis() - timeNow < 100) {
      sample = analogRead(micPin);
      highPass = alpha * (highPass + sample - lastSample);
      lastSample = sample;
      envelope *= release;
      envelope = max(envelope, abs(highPass));
    }

    if (envelope < threshold / 2) { // 엔벨로프가 감소해야 함
      if (clapCount == 2 && (millis() - lastClapTime <= clapDelay)) {
        digitalWrite(ledPin, ledState ? LOW : HIGH);
        ledState = !ledState;
        clapCount = 0; // 동작 후 clap 카운터 재설정
      }
    }
  }

  // 시간 창문 내에 두 번째 clap이 없을 경우 clap 수를 재설정
  if (millis() - lastClapTime > clapDelay && clapCount > 0) {
    clapCount = 0;
  }

  delay(10); // 샘플링 지연
}
```

<div class="content-ad"></div>

## 다음 수준으로 업그레이드해 보세요

이제 우리에게 완전히 작동하는 시스템과 코드가 준비되었으니, 실제 기기에 연결하여 회로를 더 개선해 보는 것이 좋겠죠. 이를 위해 아이디어를 고민해 오셨다면, 여기에 답이 있습니다!

계속 진행하려면 몇 가지 추가 구성품이 필요합니다:

- 아두이노 보드, 브레드보드 및 마이크로폰을 포함할 하우징
- 5V 단일 채널 릴레이와 함께 선택한 릴레이
- 전원 케이블이 연장된 플러그
- 고전압 기기에 연결할 여성 AC 전원 소켓

<div class="content-ad"></div>

## 핀 재매핑

우선 배선을 변경해보세요. 이 기사의 첫 부분에서는 LED 전구를 켰었습니다. 이번에는 LED를 제거하지만 동일한 배선을 사용하고, 우리의 램프가 도입한 추가 연결을 더할 것입니다.

새로운 연결은 다음과 같습니다:

마이크 연결은 그대로 유지됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TheClapperHowtomakeaclapsensitiveswitchwithArduino_7.png" />

만약 모든 연결이 올바르게 되어 있다면, 램프를 전원에 연결하고 아두이노를 5V 전원에 연결하십시오. 이제 당신의 램프는 박수로 제어될 수 있습니다 👏.

자신에게 박수를 쳐주시겠어요? 😅