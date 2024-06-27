---
title: "임베디드 AI  배터리 충전 상태를 관리하는 방법"
description: ""
coverImage: "/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_0.png"
date: 2024-06-27 18:55
ogImage: 
  url: /assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_0.png
tag: Tech
originalTitle: "Embedded AI — Battery State of Charge"
link: "https://medium.com/@reefwing/embedded-ai-battery-state-of-charge-f357cb156257"
---


저희 시리즈 중 임베디드 AI의 첫 번째 부분에서는 머신 러닝(ML) 프로세스를 설명하면서 선형 회귀를 예시로 사용했습니다. 이제 동일한 프로세스를 사용하여 아두이노와 룩업 테이블을 이용해 LiPo 배터리의 충전 상태를 계산할 것입니다. 선형 보간법을 사용하여 테이블 내의 각 점 사이의 값을 추정할 것입니다. 세 번째 부분에서는 룩업 테이블 대신 ML을 사용할 것입니다.

![이미지](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_0.png)

우리의 임베디드 프로젝트는 대부분 전원 공급원으로서 LiPo 배터리를 거의 전적으로 사용합니다. 이는 전류 전달, 크기, 무게 및 용량 측면에서 좋은 선택지입니다. 그러나 배터리 수명에 악영향을 미칠 수 있으므로 배터리를 과방전하지 않도록 주의해야 합니다.

## 배터리 전압 모니터링

<div class="content-ad"></div>

배터리 용량 대 전압의 대략적인 값은 그림 1에 나와 있습니다. 상단 행(1S, 2S 등)은 시리즈에 있는 LiPo 셀 수를 나타냅니다. 이는 배터리의 정격 전압이 지정되는 방식이며, 시리즈에 있는 각 셀의 전압이 합산되어 나타납니다. 이러한 값들은 충전 상태를 예측하는 ML 모델 구축 방법을 보여주기 위한 것입니다. 실제로는 사용 중인 배터리의 실제 값들을 측정하거나 배터리 데이터 시트의 방전 곡선에서 추출해야 합니다.

![Figure 1](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_1.png)

우리의 예시에서는 정격 전압이 11.1V이며 완전히 충전된 상태에서 12.6V를 내는 3S LiPo를 사용합니다. 3S LiPo 배터리에 대한 특성 곡선은 그림 2에 나와 있습니다. 3S 배터리의 경우 15% 용량(3S 배터리의 경우 약 11V 또는 셀 당 3.4V에서 3.6V 사이) 아래로 방전시키지 않는 것이 좋습니다. 그렇지 않으면 배터리가 급격히 손실되고 손상을 입힐 수 있습니다.

![Figure 2](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_2.png)

<div class="content-ad"></div>

배터리를 모니터링하기 위해 아두이노의 ADC(Analog to Digital Converter)와 간단한 전압 분배기를 사용할 것입니다. UNO의 요구 사항을 살펴보겠지만, 다른 보드에 대해서도 동일한 원리가 적용되지만, 마이크로프로세서 전압 허용치에 따라 측정 전압을 5V가 아닌 3V3으로 줄이기 위해 전압 분배기 저항을 조정해야할 수도 있습니다.

## 아두이노 UNO 아날로그 디지털 변환기

UNO의 아날로그 입력(AI)에 5V 이상을 적용할 수 없기 때문에 전압 분배기가 필요합니다. 전압 분배기 회로는 도 3에 나와 있습니다. 우리의 LiPo 배터리 (U2)는 최대 12.6V의 출력을 가지며, 이는 UNO의 Vin에 연결됩니다. 전압 분배기 출력(Vout)은 UNO의 A0에 연결되어 아날로그 전압을 읽는 곳입니다.

![이미지](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_3.png)

<div class="content-ad"></div>

전압 분배기 공식은 다음과 같이 정의됩니다:

![Voltage Divider Formula](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_4.png)

R1과 R2에 사용할 값은 어떻게 결정할까요? 하나의 값을 선택한 다음 전압을 얼마나 감소시키어야 하는지에 따라 다른 값을 계산할 수 있습니다. 또는 올바르게 작업하기 위해 분배기 값을 마이크로프로세서의 ADC에 맞추는 방법을 선택할 수도 있습니다. Arduino UNO R3는 ATMega328P를 사용하며, 10-bit ADC가 장착되어 있습니다. 이는 2^10 (즉, 0~1023) 값이 반환될 수 있다는 것을 의미합니다. UNO의 8개의 아날로그 입력은 동일한 ADC에 연결되어 있어 한 번에 1개의 입력만 샘플링할 수 있습니다 (Figure 4). ADC는 내부 온도 센서, GND 및 1.1V 밴드 갭 참조 전압을 측정하는 데도 사용할 수 있습니다.

![Arduino UNO ADC](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_5.png)

<div class="content-ad"></div>

ADC는 내부 14pF 캐패시터를 충전하고 연속적인 근사치로 그 전압을 측정하여 전압을 측정합니다. 이는 입력 임피던스인 전압 분배기의 저항 R1이 너무 커서 캐패시터가 충전되기 충분히 빨리 하지 않는다는 것을 의미합니다. ADC 샘플 및 홀드는 약 12μs가 걸리며, 전체 변환 과정은 프리스케일러 선택에 따라 최대 260μs가 소요될 수 있습니다. R1이 너무 커서는 얼마나 커야할까요? 이를 계산하기 위해 샘플 및 홀드 캐패시터를 충전하는 데 걸리는 시간을 계산해야 합니다.

[그림](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_6.png)

샘플 및 홀드 캐패시터를 충전하는 데 걸리는 시간은 두 가지 요소에 영향을 받습니다:

- 입력 신호의 주파수
- 입력 신호의 총 임피던스

<div class="content-ad"></div>


![Embedded AI Battery State of Charge](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_7.png)

캐패시터는 5τ에서 완전히 충전되었다고 간주됩니다 (도표 5). 충전 회로의 전류는 캐패시터가 충전됨에 따라 지수적으로 감소합니다 (도표 6).

타임 상수 (τ)는 충전 중 캐패시터 전압이 최종 값의 대략 63%에 도달하는 데 걸리는 시간을 나타내며, 방전 중 초기 값의 대략 37%로 감소하는 시간을 나타냅니다. τ는 캐패시터의 충전 또는 방전 속도를 측정하는 것으로, τ 값이 클수록 전압 변화가 느립니다. 다음과 같이 정의됩니다:

```js
τ = RC
``` 


<div class="content-ad"></div>

그림 5와 그림 6에 나타난 곡선은 전압 및 전류 충전 방정식을 사용하여 생성됩니다:

![image](/assets/img/2024-06-27-EmbeddedAIBatteryStateofCharge_8.png)

ATMega328P 데이터 시트에 따르면, 아날로그 입력 임피던스는 1에서 100k 사이입니다 (주파수에 따라 달라짐). 권장되는 R1 값은 10k이므로, 총 임피던스는 110k입니다.

```js
충전 시간 = 5RC = 110 x 10³ x 14 x 10^–12 = 7.7 μs
```

<div class="content-ad"></div>

샘플 및 홀드에는 12μs가 필요하므로 R1 = 10k가 작동하며, 역발상하여 계산하면 다음과 같습니다:

```js
최대 임피던스 = 12μs / 5C = 171 kΩ.
따라서, 최대 R1 = 171k — 100k = 71 kΩ
```

R1 = 10 kΩ, Vout = 5V 및 Vin = 12.6V로 설정되었음을 고려하면, 위의 전압 분배식을 사용하여 R2를 계산할 수 있습니다.

```js
R2 = (R1 x Vout/Vin) / (1 — Vout/Vin) 
   = (10k x 5/12.6) / (1–5/12.6) = 6579 Ω
```

<div class="content-ad"></div>

가장 가까운 사용 가능한 저항기(허용 오차 5%)는 6.2 kΩ이며, 이것은 Vin = 12.6V 일 때 Vout = 4.8V를 제공합니다. 배터리 전압을 읽는 코드는 상당히 간단합니다.

```js
const float dividerRatio = (float)(R1 + R2) / (float)R2; 

// ADC 하드웨어는 내림하여 반올림하므로 0.5를 추가합니다. 
float adcValue = (float)analogRead(VBAT) + 0.5; 
batteryVoltage = (adcValue / 1024.0) * 5.0 * dividerRatio;
```

여기서 R1과 R2는 전압 분배기에 사용된 저항기의 값입니다. 우리의 프로토타입에서 R2로 6K2 대신 6K8을 사용하게 되었습니다. 저항기 값을 float로 캐스팅하는 것이 중요합니다. 그렇지 않으면 아두이노에서 정수 나눗셈을 수행하고 dividerRatio에 대한 잘못된 값을 얻게 될 것입니다. ADC(아날로그-디지털 변환기)에서 측정 중인 전압을 측정할 때 하드웨어가 내림하여 값을 반올림하기 때문에 ADC에서 읽은 값을 0.5를 추가해야 합니다.

batteryVoltage = (adcValue / 1024.0) * 5.0 * dividerRatio는 아두이노 Uno의 ADC에서 배터리 전압을 계산하는 데 사용됩니다. 아두이노 Uno에는 10비트 ADC가 있으므로 0부터 1023(2¹⁰ = 1024개의 레벨)까지의 디지털 값으로 아날로그 입력 신호를 나타낼 수 있습니다. 아두이노 Uno의 ADC에 대한 기본 참조 전압은 5V입니다. 이는 아날로그 입력이 0V인 경우 ADC 값이 0에 해당하고, 5V 인 경우 ADC 값이 1023에 해당한다는 것을 의미합니다. ADC 값은 참조 전압의 분수를 나타냅니다. ADC 값을 해당 전압으로 변환하려면 ADC 값을 최대 가능한 ADC 값(1023)의 비율로 나누고 참조 전압(참조 전압 = 5V)을 곱합니다. Figure 4는 이 프로세스가 작동하는 방식을 보여줍니다.

<div class="content-ad"></div>

## 배터리 전압 샘플 주기

아두이노 스케치에서의 루프 빈도는 프로세서 속도와 코드 내용에 따라 달라집니다. 일반적으로 수천 번 또는 수백만 번까지 초당 실행될 것입니다. 비행 컨트롤러로는 실행 주기가 귀중하며 비핵심 작업에는 시간을 낭비하고 싶지 않을 것입니다. 배터리 전압을 얼마나 자주 샘플링해야 할까요? 방전률(C)에 따라 다릅니다. 여기 전형적인 리포 배터리의 사양이 있습니다.

```js
최소 용량: 2200mAh
구성: 3S1P / 11.1V / 3셀
지속 방전: 25C
최대 방전 (10초): 35C
```

안전한 지속 사용을 위한 하나의 방전 등급과 10초 미만의 폭발(예: 모터 시작)을 위한 다른 등급이 있습니다. 방전 등급을 전류로 변환하려면 용량에 곱하면 됩니다. 위 사양에 따르면 배터리 용량은 2200 mAh = 2.2 Ah입니다.

<div class="content-ad"></div>

```js
방전 전류 = C × 용량
```

최악의 경우 방전 속도를 원하므로 피크 숫자를 사용하여 계산하겠습니다.

```js
피크 방전 속도 = 35 × 2.2 = 77 A
```

용량의 15% 미만으로 방전되지 않도록 하려고 합니다. (즉, 85% × 2.2 Ah = 1.87 Ah) 이를 피크 방전 속도에서 소모하는 데는다음과 같은 시간이 걸립니다:

<div class="content-ad"></div>

```js
방전 시간 (초) = (1.87 / 77) × 3600 = 87.4 초
```

이걸 시도하면 배터리가 파괴될 수 있다니까요. 배터리의 최대 안전 방전 속도는 다음과 같습니다:

```js
안전 방전 시간 (초) = (1.87 × 3600) / (25 × 2.2) = 6732 / 55 = 122.4 초
```

대부분의 임베디드 장치는 배터리 방전 용량의 100%에서 작동하도록 설계되지 않으므로, 방전 시간은 최대 안전 방전 시간보다 훨씬 더 길 것으로 예상됩니다.

<div class="content-ad"></div>

그림 2를 참조하면, 배터리의 안전 작동 범위 내에서 방전 곡선이 꽤 선형임을 알 수 있습니다. 온도의 영향을 무시하더라도 우리가 감지한 전압은 사용과 함께 변동할 것입니다. 예를 들어, 모터를 100%로 구동하면 많은 전류가 소모되고 배터리 전압이 일시적으로 감소하거나 "깊게 파고들"할 수 있습니다. 이는 잘못된 저전압 경보를 일으킬 수 있습니다. 부하를 줄이면 배터리 전압은 다시 회복될 것입니다. 따라서 배터리 모니터링에는 어떤 종류의 히스테리시스가 포함되어야 합니다.

모든 이를 고려할 때, 배터리 전압을 매 초마다 확인하는 것은 과도합니다. 그러나 고부하 하에서 전압 감소를 상쇄하기 위해 이동 평균을 취하고 싶다면, 매 초마다 샘플링하는 것이 작동할 것입니다.

```js
충전은 방전과 매우 다릅니다. LiPo 배터리의 전형적인 안전 충전률은 1C입니다.
```

## ReefwingTimer 라이브러리

<div class="content-ad"></div>

ReefwingTimer는 millis() 함수를 사용하여 블로킹되지 않는 스케줄러를 인스턴스화하는 래퍼 라이브러리입니다. 저희 라이브러리는 MillisTimer 및 ElapsedTimer 라이브러리를 결합한 것으로, 몇 가지 응용 프로그램 별 예제와 추가적인 Timeout 클래스가 포함되어 있습니다.

라이브러리를 사용하려면 스케치에 포함해야 합니다.

```js
#include <ReefwingTimer.h>
```

ReefwingTimer 개체를 인스턴스화하는 두 가지 접근 방식이 있습니다.

<div class="content-ad"></div>

- 인터벌을 밀리초로 포함하고 만료 된 타이머 핸들러 함수의 이름을 포함하는 생성자를 사용하세요 [예시: ReefwingTimer timer = ReefwingTimer(1000, timerHandler);], 또는
- 빈 생성자를 사용하고 이러한 변수를 setup함수에서 정의하세요 [예시: ReefwingTimer timer = ReefwingTimer();].

첫 번째 방법을 사용하는 경우, timerHandler 함수를 ReefwingTimer 위에 정의해야 합니다. 타이머는 기본적으로 무한 반복되지만, setRepeats 메서드를 사용하여 특정 반복 횟수로 구성할 수 있습니다 [예시: timer.setRepeats(10);].

setup()에서 해야 할 마지막 작업은 타이머를 시작하는 것입니다.

```js
timer.start();
```

<div class="content-ad"></div>

그럼 루프() 안에서 타이머가 업데이트되도록 호출해야 합니다:

```js
timer.run();
```

## 배터리 전압 샘플링 예제

ReefwingTimer 라이브러리의 예제 스케치 중 하나인 batteryCheck()를 살펴보겠습니다. 이 스케치에서는 매 초마다 타이머가 만료되고, 만료된 타이머 핸들 함수에서 배터리 전압을 읽습니다. 인터럽트를 사용할 때 핸들러에서 너무 많은 작업을 수행하지 않는 것이 좋습니다. 이 타이머를 사용할 때 배터리가 너무 낮은 경우에는 플래그를 설정하고, 메인 루프에서 적절한 조치를 취합니다(예: 경고 메시지 전송 또는 LED 점등).

<div class="content-ad"></div>

```js
#include <ReefwingTimer.h>

/******************************************************************
 *  배터리 전압 ADC 정의
 * 
 *  이 스케치는 전압원(즉, 배터리)이 R1과 R2로 구성된 전압 분배기를 통해
 *  아날로그 입력 핀 A0(즉, 핀 14)에 연결되어 있다고 가정합니다.
 * 
 *  표시된 값은 UNO에 대해 올바릅니다. 3V3 로직을 사용하는 아두이노
 *  (예: Nano 33 IoT)를 사용하는 경우 R1, R2 및 VLOGIC을 변경해야합니다.
 *  또한 전압 원이 다른 아날로그 입력에 연결되어 있는 경우 VBAT도 변경해야합니다.
 * 
 ******************************************************************/

#define VBAT      14                //  아날로그 핀 A0

const float VLOGIC = 5.0;           //  UNO는 5V 로직을 사용합니다.
const float R1 = 10000.0;           //  10K 저항
const float R2 = 6800.0;            //  6K8 저항
const float RATIO = (R1 + R2) / R2; //  전압 분배비
const float SCALE = VLOGIC * RATIO; //  전압 변환 계수

float readADCValue(int pin) {
  return (float)analogRead(pin) + 0.5;
}

float calculateVoltage(int pin) {
  float adcValue = readADCValue(pin); 
  return (adcValue / 1024.0) * SCALE;
}

void voltageCheck(ReefwingTimer &nt) {
  //  타이머가 만료되었을 때 호출되고 각 읽기마다 LED 상태를 토글합니다.
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));

  //  배터리 전압을 읽고 시리얼로 전송합니다.
  float batteryVoltage = calculateVoltage(VBAT);
  Serial.print("전압: ");
  Serial.println(batteryVoltage);
}

ReefwingTimer rTimer = ReefwingTimer(1000, voltageCheck);

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(VBAT, INPUT);
  Serial.begin(115200);
  rTimer.start();
}

void loop() {
  rTimer.run();
  delay(10);
}
```

## 배터리 충전 상태 계산 — 룩업 테이블

우리의 3S LiPo를 위해 상태 전차 룩업 테이블을 만들기 위해 Figure 1의 테이블을 사용할 수 있습니다.

```js
#define SOC_TABLE_SIZE    21

typedef struct { uint16_t v100; uint16_t soc; } soc_lookup_t;

//  3S LiPo 용량 - 참고: Figure 1
soc_lookup_t capacity[SOC_TABLE_SIZE] = {
    {982, 0},   {1098, 5},   {1106, 10},  {1112, 15},  {1118, 20},  {1124, 25},  {1128, 30},
    {1136, 35}, {1139, 40},  {1146, 45},  {1151, 50},  {1156, 55},  {1163, 60},  {1174, 65},
    {1186, 70}, {1196, 75},  {1207, 80},  {1225, 85},  {1233, 90},  {1245, 95},  {1260, 100}
};
```

<div class="content-ad"></div>

v100 값은 uint16_t 범위 내에 맞게 조정되었습니다. 이는 테이블 내의 전압 값을 100으로 곱해 수행할 수 있습니다. 배터리 전압을 읽은 후 조회 테이블에서 해당하는 충전 계수를 얻을 수 있습니다.

이 조회 테이블에 정의된 전압에 대해서는 괜찮지만, 9.9V에 대한 용량을 가져오려고 하면 어떻게 될까요? 찾을 수 없을 것입니다. 앞서 말했듯이 배터리 운전 범위 내의 용량 곡선은 상당히 선형적이므로 (도표 2 참조) 조회 테이블의 점들 사이에서 선형 보간을 사용할 수 있습니다.

```js
float constrain(float value, float min, float max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

uint16_t interpolate(soc_lookup_t *capacity, float charge) {
    // 최소값 및 최대값은 첫 번째와 마지막 요소 사용
    uint16_t min_v100 = capacity[0].v100;
    uint16_t max_v100 = capacity[SOC_TABLE_SIZE - 1].v100;

    // 충전을 최소 및 최대 v100 값으로 제한
    charge = constrain(charge, min_v100, max_v100);

    // SoC 값 보간
    for (int i = 0; i < SOC_TABLE_SIZE - 1; i++) {
        if (capacity[i].v100 <= charge && capacity[i + 1].v100 >= charge) {
            float diffx = charge - capacity[i].v100;
            float diffn = capacity[i + 1].v100 - capacity[i].v100;

            return (int)(capacity[i].soc + (capacity[i + 1].soc - capacity[i].soc) * diffx / diffn);
        }
    }

    return 0; // 범위 내가 아님
}
```

이 방식은 조회 테이블이 오름차순으로 정렬되어 있다고 가정하며, 최소값과 최대값을 결정하는 것을 단순화합니다. 다음 예제 스케치를 사용하여 Arduino UNO에서 이를 테스트할 수 있습니다.

<div class="content-ad"></div>

```c
#define VBAT      A0                //  아날로그 핀 A0

const float VLOGIC = 5.0;           //  UNO는 5V 논리를 사용합니다.
const float R1 = 10000.0;           //  10K 저항
const float R2 = 6800.0;            //  6K8 저항
const float RATIO = (R1 + R2) / R2; //  전압 분배 비율
const float SCALE = VLOGIC * RATIO; //  전압 변환 계수

#define SOC_TABLE_SIZE 21

typedef struct {
    uint16_t v100; // 백분의 일전압의 전압
    uint16_t soc;  // 충전 상태 백분율
} soc_lookup_t;

soc_lookup_t capacity[SOC_TABLE_SIZE] = {
    {982, 0},   {1098, 5},   {1106, 10},  {1112, 15},  {1118, 20},  {1124, 25},  {1128, 30},
    {1136, 35}, {1139, 40},  {1146, 45},  {1151, 50},  {1156, 55},  {1163, 60},  {1174, 65},
    {1186, 70}, {1196, 75},  {1207, 80},  {1225, 85},  {1233, 90},  {1245, 95},  {1260, 100}
};

float constrain(float value, float min, float max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

uint16_t interpolate(soc_lookup_t *capacity, float charge) {
    // 최솟값과 최댓값을 위해 첫 번째 원소와 마지막 원소 사용
    uint16_t min_v100 = capacity[0].v100;
    uint16_t max_v100 = capacity[SOC_TABLE_SIZE - 1].v100;

    // charge를 최솟값과 최댓값 v100 값으로 제한
    charge = constrain(charge, min_v100, max_v100);

    // SoC 값을 보간
    for (int i = 0; i < SOC_TABLE_SIZE - 1; i++) {
        if (capacity[i].v100 <= charge && capacity[i + 1].v100 >= charge) {
            float diffx = charge - capacity[i].v100;
            float diffn = capacity[i + 1].v100 - capacity[i].v100;

            return (int)(capacity[i].soc + (capacity[i + 1].soc - capacity[i].soc) * diffx / diffn);
        }
    }

    return 0; // 범위를 벗어남
}

float readADCValue(int pin) {
    return (float)analogRead(pin) + 0.5;
}

float calculateVoltage(int pin) {
    float adcValue = readADCValue(pin); 
    return (adcValue / 1024.0) * SCALE;
}

void setup() {
    Serial.begin(9600);
}

void loop() {
    // 배터리로부터 전압 읽기
    float voltage = calculateVoltage(VBAT);

    // 검색 테이블과 interpolate 함수를 사용하여 충전 상태(SoC) 계산
    float charge = voltage * 100;

    // 전압을 백분의 일전압으로 변환하여 검색 테이블과 일치시킵니다
    uint16_t soc = interpolate(capacity, charge);

    // 전압과 충전 상태를 Serial Monitor에 출력
    Serial.print("Voltage: ");
    Serial.print(voltage); // 실제 전압 출력
    Serial.print(" V, SoC: ");
    Serial.print(soc);
    Serial.println(" %");

    // 다음 측정을 위해 1초 대기
    delay(1000);
}
```

## Part 3 — 곧 공개됩니다!

이 시리즈의 세 번째 파트에서는 검색 테이블과 interpolate를 기계 학습 모델로 대체할 것입니다.

이 글을 즐겨 보셨고 작성을 지원하고 싶다면 팔로우하거나 박수(최대 50회), 강조 또는 댓글을 달아주시기 바랍니다! 또는 커피를 사주시거나 구독해주셔도 감사하겠습니다.