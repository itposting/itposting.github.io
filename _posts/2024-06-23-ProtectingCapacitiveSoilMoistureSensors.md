---
title: "정전용량 토양 습도 센서 보호 방법"
description: ""
coverImage: "/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_0.png"
date: 2024-06-23 17:46
ogImage: 
  url: /assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_0.png
tag: Tech
originalTitle: "Protecting Capacitive Soil Moisture Sensors"
link: "https://medium.com/@d.robertson/protecting-capacitive-soil-moisture-sensors-e1ab81f1c4fb"
---


화분 식물의 토양 수분을 측정하려고 했었는데, 일단 저항성 토양 수분 센서 몇 개를 구입했습니다. 그러나 프로브 다리, 전자 부품 및 커넥터 주변 등이 빨리 부식되어 망가졌습니다. 완전히 망가졌어요. 그 후 내가 '부식 방지'로 홍보된 적응형 센서를 보게 되었고, 싸게 여러 개를 구입했습니다. 안타깝게도 비슷한 문제가 발생했습니다. 이 기사에서는 적응형 토양 수분 센서가 입은 손상과 그것을 해결하려고 시도한 내 경험을 적었습니다.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_0.png)

# 1. 센서

내가 구입한 적응형 토양 수분 센서들은 'DFRobot'의 아날로그 적응형 토양 수분 센서와 기능적으로 동일한 것 같습니다. 정확히 센서가 어떻게 작동하는지는 내 현재 지식의 범위를 벗어납니다. 그럼에도 불구하고, electronicclinic.com에서 이에 대해 훌륭한 기사가 있습니다.

<div class="content-ad"></div>

더 진행하기 전에 중요한 사항이 있습니다: 몇몇 센서가 고장났습니다. 이 글은 센서의 1MΩ 저항기(R4)가 제대로 접지되어 있으며, 중앙에 칩이 TLC555인 것을 전제로 합니다. 더 많은 정보를 위해 여기를 읽어주세요.

## 2. 손상

화분에 센서를 넣기 전에, PCB의 맨 앞부에 노출된 전자 부품들을 고려하여 환경(및 나의 식물 관수)로부터 어떤 종류의 보호가 필요할 것으로 보였습니다. 이를 위해 일부 보호책을 찾아보고, 손에 있는 것으로 전자 부품 및 연결부를 핫-글루건의 접착제로 덮고, 그 위에 일반적인 히트 수축 튜브를 덧대어 보호하기로 결정했습니다. 그 후 센서가 토양에 들어가 원하는 대로 작동했습니다.

약 6개월 뒤, 읽기가 다소 이상하다는 것을 알게 되었습니다. 토양이 완전히 건조한 상태일 때에도 센서가 이전보다 훨씬 더 높은 습도 수준을 나타내고 있었습니다. 센서를 꺼내어 히트 수축 튜브와 접착제를 벗기고, 전자 부품들의 아랫부분 주변에 부식이 있음을 관찰했습니다. 특히 캐패시터 C1, C2, C3, 그리고 C4 부분 주변이었습니다.

<div class="content-ad"></div>


![Soil Moisture Sensor Image 1](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_1.png)

I also noticed that the solder mask covering the ground plate, which runs along the outer edge of the sensor, was wrinkled. I assumed this was due to water infiltrating underneath. Additionally, there were small breaks on the outside of the solder mask, revealing the ground plate.

![Soil Moisture Sensor Image 2](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_2.png)

To assess the sensor's functionality, I connected it to an Arduino Uno to collect data. I utilized the pin connections and program provided below. I did not include any additional components such as resistors or capacitors.


<div class="content-ad"></div>


```js
SENSOR                  ARDUINO
-------------------------------
VCC (RED)               5V
GND (BLACK)             GND
AOUT (YELLOW)           A0
```

결과적으로 대략 일정한 값을 23 얻었어요. 물이나 흙에 넣어도 효과가 없었어요. 도대체 고장난 것 같았어요.

우선 그것을 분리하고 전자 부품 위에 WD-40을 조금 떨어뜨려 부식을 제거하고 고치기를 희망했어요. 하루 뒤에 돌아와서 휴지로 닦아낼 수 있는 것을 닦았어요.

아두이노에 다시 연결했을 때 처음에 유망한 결과를 얻었어요. 읽히는 값은 약 530이었어요. 그러나 그 값들은 환경 변화가 없는 상황에서도 빠르고 점진적으로 약 120 정도로 떨어지기 시작했어요. 그러나 유망한 점은, 센서를 물에 넣었을 때 올바른 방향으로 약간의 변화가 있었어요.


<div class="content-ad"></div>

센서를 다시 청소하기로 결정했어요. 이번에는 WD-40을 전체 센서에 뿌려 위에서부터 아래까지 덮어두고 하루 동안 적셔놓았어요. 종이 타월로 닦아낼 수 있는 것은 다 닦았지만, 안타깝게도 접지 플레이트를 덮고 있던 솔더 마스크를 손상시켜 버린 것 같아요. 그래서 구리가 노출된 채 벗겨진 거예요.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_3.png)

아두이노로 테스트한 결과는 이전보다 훨씬 좋았어요. 센서가 어느 정도 624를 보여주고 일정하게 읽혔어요. WD-40에 센서를 "적셔놓은" 데가 있었던 심해에 갇혀 있던 물을 쫓아냈을 것이라고 가정해봤어요. 거기서 주름진 것을 발견했었거든요.

# 3. 테스트

<div class="content-ad"></div>

손상된 센서가 이제 어느 정도 작동한다는 점에서 그 상태가 무엇인지 확인해 보았습니다. 다음 다섯 가지 환경을 테스트하기로 결정했습니다:

- 건조한 공기 (책상 위에 노출된 채로)
- 건조한 토양 (500g 유리병에 넣은 건조한 토양)
- 촉촉한 토양 (500g 유리병에 125ml 수돗물과 섞은 건조한 토양)
- 촉촉한 토양 (500g 유리병에 250ml 수돗물과 섞은 건조한 토양)
- 물 (500g 유리병에 있는 수돗물)

그러나 비교할 기준 측정값이 필요했습니다. ESD 안전 가방에서 새로운 센서를 개봉하고 해당 센서를 테스트했습니다. 또한 DF Robot의 "Value 1" 및 "Value 2" 값 (건조 및 물)도 포함했습니다. 여기에 결과가 있습니다:

![image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_4.png)

<div class="content-ad"></div>

조금 같아 보이지만, 손상된 센서는 다시 읽을 수 있도록 고쳐졌을 수도 있습니다. 그러나 몇 가지 주목할 점이 있습니다:

- 두 센서가 동시에 같은 아두이노에 연결되어 있었습니다. 이 결과에 어떤 영향을 미쳤는지 확실하지 않습니다.
- 결과를 얻을 때 두 센서를 동시에 같은 유리병에 넣었습니다. 예외는 물 테스트이며 전자 부품이 손상되는 것을 피하기 위해 센서를 (커넥터로 고정하여) 고정했습니다.
- 물이나 물이 섞인 토양에 센서를 놓을 때, 센서의 값을 안정화되도록 허용했으며, 거의 변동되지 않았습니다. 이 작업을 얼마나 오랜 시간 동안 수행했는지 측정하지 않았으므로 예견하지 못했지만, 흥미로운 측정 항목일 수 있습니다.
- 새 센서는 손상된 센서보다 안정화된 값을 얻기까지 훨씬 더 오랜 시간이 걸렸습니다. 손상된 센서보다 두세 배 정도 오래 걸린 것으로 추정됩니다.
- 센서가 습기의 높은 수준을 감지함에 따라 읽기가 낮아질 것으로 예상되므로, 새 센서의 젖은 토양 측정치는 이론상 이상할 수 있습니다.
- DFRobot의 위키에서는 "건조(dry)", "습기(wet)", "물(water)"에 대한 값 범위를 나열하고 있습니다. DFRobot의 "건조"가 이 시험의 건조 토양과 비교할 만하다고 가정하면, "습기"가 습기가 있는 토양, "물"이 물과 비슷하다면, 손상된 센서의 젖은 토양 측정치만 범위를 벗어나며 312로 나타납니다. 이는 DFRobot의 "물" 범주로 분류됩니다. 센서의 손상된 솔더 마스크가 습기에 민감해지도록 하는 것일 수도 있습니다. 센서가 이전보다 훨씬 높은 습기 수준을 잘못 보고하는 것으로 처음 관찰한 것을 지지하는 이론입니다.
- 보다 견고한 실험은 센서의 값을 안정화될 때까지 읽은 후 토양의 수분 함량을 높이고 반복하여 수행하는 것일 수 있습니다.

# 4. 제안된 수정 사항

내 가설은 센서가 손상된 이유는 다음과 같습니다:

<div class="content-ad"></div>

- 전자 부품의 부식
- 센서를 덮고 있는 솔더 마스크 아래에 물이 갇히는 문제가 있습니다.

따라서 이 두 문제를 해결하려고 합니다.

## 4a. 전자 부품의 부식

이전에 설명한 대로 핫 글루 건에서 나온 접착제로 부식을 방지하려고 시도했습니다. 그러나 이것이 부품을 충분히 보호하지 못했을 것으로 생각합니다. 핫 글루를 벗겼을 때 PCB에서 일관되게 마르지 않았다는 것을 발견했습니다. 이로 인해 한쪽이 다른 쪽보다 더 나빠 보였을 수 있습니다. PCB에 대한 접착제의 더 나은 적용은 덜 점성이 높은 것이었을 수도 있지만 다시 그것에 의존하지 않겠습니다.

<div class="content-ad"></div>

다행히도, 전기용량 수분 센서 부식을 방지하는 것은 새로운 문제가 아닙니다. 일반적인 접근 방법은 전자 부품과 커넥터를 코팅하거나 덮는 것입니다. 사용되는 화합물과 재료로는 매니큐어, 요연, 에폭시, 그리고 접착제가 발린 및 발림이 없는 열 수축 튜브가 포함되는 것으로 보입니다.

콜로라도 주립대학의 제이 해머 교수는 자신의 instructables.com 기사에서 모든 전자 부품을 매니큐어로 앞뒤로 코팅한 뒤 센서 윗부분을 접착제가 발린 열 수축 튜브로 덮는 과정을 설명하고 있습니다.

switchdoc.com에서는 동일한 과정을 실리콘 시랑만으로 덮는 기사가 있습니다 (즉, 열 수축 튜브 없음). 또한 주입 코팅이 특히 이 문제를 해결하도록 설계된 것임을 언급합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_6.png)

Adosia specifically makes and sells “ruggedized” capacitive moisture sensors and provides a video on their process. Note their use of urethane to coat the PCB.

An article on thecavepearlproject.org describes using heat-shrink as a container, filling it with epoxy, and heating it from the bottom to cover the components.

![image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_7.png)


<div class="content-ad"></div>

해당 기사에는 또 다음과 같이 언급되어 있습니다:

thecavepearlproject.org의 기사에는 접착제가 칠해진 히트 슈린크만 사용해도 "꽤 괜찮은 일"을 할 것이라고 언급하지만, 아마도 이 경우 단순히 히트 슈린크만 사용한 것일 것입니다. 따라서 이 상황에서 우레탄과 히트 슈린크에 추가로 에폭시를 사용하는 것이 유지재로서 더 효과적인지 아닌지에 대한 질문이 있습니다. 그러나 아쉽게도 그 질문에 대한 답을 알지 못합니다. 보호층의 양이 적용된 지점에서는 이제 실제로 더 중요하지 않을 수도 있습니다.

그러나 제 간략한 조사에서 알 수 있듯이, 경화된 에폭시와 같은 "단단한" 소재는 환경 온도가 극단적인 온도(-40°C에서 +85°C 사이)로 변할 때 전기적 결함을 일으킬 수 있습니다. 해당 기사는 "극한 또는 가혹한 환경"에서는 더 부드러운 소재를 사용하는 것이 좋다고 언급합니다.

나는 토양 수분 센서를 식물이 자라는 곳 어디에든 설치할 수 있을 것으로 예상하며, 그것은 지구상 거의 모든 곳에 해당한다는 것은 말할 것도 없습니다. 이는 다양하고 적대적인 환경을 포함하고 있습니다. 그 부드러운 특성을 감안할 때, 나는 따라서 우레탄을 사용하고 Adosia가 설명한 과정을 따를 것으로 결정했습니다. 그러나 일부 수정을 가할 예정입니다.

<div class="content-ad"></div>

먼저, 유레탄 코팅을 몇 겹 해야 하는지에 대한 불일치가 있습니다. Adosia의 비디오에서는 PCB에 유레탄 코팅을 두 겹 하지만 제품 설명에는 "세 겹 코팅"이라고 명시되어 있습니다. 장기간 야외에서 전자 부품을 보호해야 하는 경우를 고려하면, 사실상 세 겹이 권장될 것으로 가정하고 조심스럽게 처리하기로 결정했습니다.

둘째, 이전의 instructables.com 기사에서는 센서의 윗면 가장자리를 갈아내어 히트 수축이 관통되는 것을 피하는 것이 좋다고 권장했습니다.

<img src="/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_8.png" />

따라서, 저는 동일한 작업을 선택했지만, 가장자리를 둥글게 만들어 보겠습니다.

<div class="content-ad"></div>

세 번째로, Adosia는 열 수축 후에 다른 보호 조치를 취하지 않은 것으로 보입니다. instructables.com 기사에서는 열 수축물의 아래쪽에 "추가 방수 보호를 제공하기 위해" 매니큐어를 바른 것으로 나와 있습니다.

![image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_9.png)

이 자리에서 매니큐어가 실제로 어떤 차이를 만들었는지 여부와는 무관하게, 바르기는 불편하지 않고 그 원리는 타당합니다.

마지막으로, 그리고 가장 중요한 것은 Adosia가 커넥터를 제거하지 않았다는 점입니다. 반면에 instructables.com 기사에서는 다른 와이어를 연결할 수 있도록 커넥터를 제거했습니다. Adosia 튜토리얼 비디오에서는 커넥터를 제거하지 않은 것이 단순히 "견고화" 과정을 보여주기 위한 것이었을 수도 있습니다. 그렇지만, 커넥터가 여전히 존재하는 것에 대한 내 우려는 열 수축물이 커버해야 하는 영역과 이에 따른 "프주문"이 발생할 수 있는 부분입니다. 아래의 Adosia 이미지에서는 PCB 주변의 일부 열 수축물 부분이 평평하게 놓이지 않는 것이 보입니다.

<div class="content-ad"></div>



![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_10.png)

열 수축 튜브를 자르고 다른 케이블을 연결하고 더 많은 열 수축을 적용해야 한다는 것을 상상할 수가 없어요. 대신에 그것을 제거하고 직접 PCB에 선을 납땜할 거에요.

## 4b. 납 마스크 아래 갇힌 물

먼저 납 마스크를 손상시키지 않는 방법에 대해 몇 가지 방법을 논의하고 싶어요.


<div class="content-ad"></div>

먼저, 토양에 삽입하거나 제거할 때(또는 일반적으로) 센서를 거친 표면에 긁히지 않도록 주의하세요. 돌의 날카로운 가장자리만으로도 솔더 마스크에 찢김을 일으킬 수 있습니다. 가능하다면 작은 도랑을 파고 센서를 안에 놓은 후 토양을 밀어넣는 것이 좋습니다.

둘째, 어떤 이유로든 센서를 청소해야 할 경우(이소프로필 알코올 사용), 솔더 마스크에 찢기거나 걸릴 수 있는 것은 피하십시오. 부드러운 천과 같은 비요철적인 것으로 가볍게 눌러주는 것이 더 안전합니다. 특히 이미지의 솔더 마스크에 주름이 생긴 경우에는 더욱 그렇습니다.

셋째, 솔더 마스크 아래에 물이 갇혀 있다는 의심이 든다면 정상 작동을 복원하기 위해 제거해야 합니다. 가능한 최소한으로 파괴적이지 않은 방법으로 제거해야 합니다. 저는 WD-40를 사용했지만 대안이 있을 수 있습니다. 열을 사용하여 물을 증발하는 방법이 도움이 될 수 있지만 이미 손상된 솔더 마스크가 반응하는 방식에 대해 우려됩니다. 지면 판에서 솔더 마스크가 물러날 수 있습니다. 어떤 방법을 사용하더라도 먼저 센서를 분리해야 합니다.

넷째, PCB의 가장자리 보호가 충분히 고려되지 않은 것으로 보입니다. 그러나 이전에 인용한 thecavepearlproject.com 기사에서는 "[PCB가 갈려 있으면 수%의 물을 흡수할 수 있다]"고 설명하며 가장자리에 에폭시를 바를 것을 언급했습니다. 게다가 Adosia는 YouTube에 남긴 댓글에 따르면 "전체 보드를 밀봉하는 것"을 테스트했지만 "아날로그 작동 범위가 축소되었다"고 밝혔습니다.

<div class="content-ad"></div>


![Soil moisture sensor](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_11.png)

아도시아는 전체 보드를 밀봉했다고 하지만 가장자리만 밀봉하는 방법에 대한 언급은 없었습니다. 저는 우레탄으로 가장자리를 밀봉해보겠습니다. 실패할 경우 네일 폴리쉬를 사용할 예정입니다. 다른 사람들은 대안으로 슈퍼글루나 플라스티딥을 추천했습니다.

또한, 땅 및 구리 판을 덮고 있는 솔더 마스크도 손상과 누출 가능성을 줄이기 위해 보호제로 코팅하는 것을 고려하고 있습니다. 즉, 솔더 마스크의 가장자리 부분이 파손되어 물이 침투하는 것을 막기 위함입니다. 용도에 따라 네일 폴리쉬, 우레탄, 에폭시 또는 다른 적합한 물질을 사용하되 작동 범위를 충분히 유지하며 전체 PCB를 코팅하는 대신 손상될 수 있는 부분만 코팅하는 것이 합리적인 대안이 될 수 있습니다.

또 다른 해결책이 있을 수 있습니다. 보호제를 미리 적용하지 않은 상태에서 솔더 마스크가 손상된 경우 해당 보호제를 대체로 사용하여 솔더 마스크를 복원할 수 있습니다. 예를 들어, 이 기사 초반의 이미지에서 노출된 지면 판 위에 우레탄 코팅을 하는 것이 적합한 수정 방법이 될 수 있습니다. 우란을 사용하여 센서의 노출 부분을 분리하여 다른 부분에 우레탄이 적용되는 것을 피할 수 있습니다. 이것이 아도시아가 비디오에서 한 방법입니다. 솔더 마스크가 이미 느슨한 경우 테이프(전기 테이프 포함)를 사용하지 않는 것이 좋습니다. 테이프를 제거하는 과정에서 솔더 마스크가 떨어져 더 많은 손상을 입을 수 있기 때문입니다.



<div class="content-ad"></div>

따라서 지켜보았던 찢어짐을 피하기 위해 지면 판의 안쪽과 바깥쪽 가장자리에 아주 작은 양의 네일 폴리시를 직접 발라보려고 합니다. 또한 손상된 센서를 수리하기 위해 노출된 지면 판에 우레탄을 코팅해 보려고 합니다.

# 5. 보호 및 절차

## 5a. 선택한 보호책 요약

제 계획은:

<div class="content-ad"></div>

- 전자 부품에 우레탄 코팅을 3번 발라주세요. CRC Red Urethane Seal Coat를 구매했는데, 색상은 중요하지 않습니다. 열 수축 튜브에 가려질 것이기 때문이죠.
- 전자 부품에 3/4인치 (19.1mm) 3:1비율의 내부 접착제가 들어간 열 수축 튜브를 사용해주세요.
- PCB 전체 가장자리에 우레탄 코팅을 3번 발라보세요. 이것이 현실적으로 불가능한 경우, PCB 전체 가장자리에 매니큐어를 3번 발라주세요. Sally Hansen Hard As Nails 매니큐어를 구매했습니다.
- 접지 플레이트의 내부와 외부 가장자리에 매니큐어를 1번 발라주세요.

## 5b. 제안된 절차

- 커넥터 제거.
- 센서 윗부분의 모서리를 둥글게 깎기.
- GND, VCC, AOUT에 전선 납땜.
- 센서 연결부에 전선에 열 수축 튜브 적용 (이전에 언급하지 않았지만, 별도의 전선을 묶어두기 위해 적용합니다).
- PCB 가장자리에 우레탄 또는 매니큐어 3번 발라주세요.
- 접지 플레이트의 내부와 외부 가장자리에 매니큐어 1번 발라주세요.
- 전자 부품의 전면과 뒷면에 우레탄 3번 발라주세요.
- 전자 부품과 우레탄에 열 수축 튜브 적용.
- 센서에 연결되는 열 수축 튜브 하단에 매니큐어 1번 발라주세요.

또한, 손상된 센서의 경우:

<div class="content-ad"></div>

- 노출된 구리판을 종이로 분리하고 노출된 구리판에 요소 우레탄 한 층을 바르는 처리.

## 6. 결과 및 관측

이전에 설명한 손상된 센서를 보호하기로 결정했습니다.

### 6a. 커넥터 제거

<div class="content-ad"></div>

먼저, 세 번째 손 악어 클립이 솔더 마스크를 손상시키는 것을 방지하기 위해, 나는 다른 크기의 골판지 조각 두 장을 잘라서 센서 사이에 넣었습니다. 그런 다음 PCB에서 커넥터를 탈거하고 제물질을 깨끗이 클린업하기 위해 솔더 사커를 사용했습니다.

![이미지1](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_12.png)

![이미지2](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_13.png)

![이미지3](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_14.png)

<div class="content-ad"></div>

이전에 놓친 PCB 가장자리의 변색을 주목했습니다. 또한, 납땜기가 그 부근에 가까워짐에 따라 PCB 윗면의 중심에서 거품이 형성되는 것이 신기했습니다. JST 커넥터를 제거한 후에 거품이 형성되었습니다. 유감스럽게도, 이 시점에서 센서를 더 망가뜨리고 말았습니다. 그 결과로 땜 마스크가 땅판에서 떨어지기도 했습니다.

## 6b. 모서리의 깎는 방법

센서의 모서리에 PCB에 표시하거나 작은 조각 종이를 붙이는 것으로 센서의 얼마만큼 깎아야 하는지 가이드하기로 계획했습니다. 그러나 실제로 제거해야 할 양은 극히 미미하여 눈으로 판단할 수 있다는 것을 깨달았습니다. 아래 이미지는 신용카드의 모서리가 센서의 모서리 위에 올려놓은 상황을 보여줍니다. 이것을 센서에서 얼마나 깎아내야 하는지 확인하는 가이드로 활용했습니다.

<img src="/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_15.png" />

<div class="content-ad"></div>

체인지된 마크 다운 형식의 코드 예시:


I placed the sensor in a bench vice — again sandwiched between plenty of cardboard — and gently and slowly filed the corners.

![Sensor Image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_16.png)

![Sensor Image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_17.png)

## 6c. Solder the Wires


<div class="content-ad"></div>

센서와 함께 제공된 케이블을 사용하기로 결정했습니다 (이 기사의 처음 이미지를 참조하세요). 이 기사의 목적에 있어 어떤 끝을 제거해도 상관없습니다; 여성 JST(화이트) 또는 여성 Dupont(블랙) 커넥터를 잘라낼 수도 있습니다. 저는 단순히 센서에서 이전에 제거한 남성 JST 헤더에 여성 JST 커넥터를 연결하기 위해 Dupont 커넥터를 제거하기로 결정했습니다. 참고로, 와이어는 24 AWG 입니다. 또한, 다음 단계를 위한 히트 수축을 준비했다는 점을 유의하세요.

![이미지1](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_18.png)

![이미지2](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_19.png)

![이미지3](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_20.png)

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_21.png" />

한 가지 더 알려드릴 점이 있어요. 여기까지 말입니다. 남은 와이어를 잘라내고 센서 뒷면에 남은 부분을 약간 깎아내었어요. 솔더링된 부분에 남아 있는 날카로운 솔더나 와이어 조각이 히트 수축 튜브를 찔러 뚫을까봐 걱정이 돼서 그랬어요.

## 6d. 와이어에 히트 수축 튜브 적용

센서에서 나온 와이어를 결합하기 위해 작은 지름의 히트 수축 튜브를 사용했어요. 저는 가지고 있던 히트 수축 튜브 세트에서 가져왔는데, 지름이 약 3mm(1/25") 정도라고 측정했어요. 저는 1.5cm(0.6") 길이로 잘라서 이전 단계처럼 센서에 납땜하기 전에 와이어 위에 끼웠어요.


<div class="content-ad"></div>

열애하는 고객님,

열 수축 소재를 가열할 히트건이 없어서 대신 헤어 드라이어를 사용했어요.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_22.png)

## 6e. 우레탄 또는 매니큐어로 PCB 가장자리 처리

종이팩으로 센서를 살짝 덮어주어 센서의 가장자리만 노출시키기로 결정했어요. 가장자리만 노출시킴으로써 우레탄 스프레이를 가장자리에만 뿌려 흘러나가지 않게 할 수 있을 것 같았어요. 하지만 이 방법은 너무 까다로워서 센서 주위의 종이팩을 계속 옮겨야 했어요. 실제로 이를 하다가 더 많은 솔더 마스크가 벗겨지는 일도 발생했어요. 결국 매니큐어를 사용하기로 했어요.

언제든지 궁금한 점이 있으면 저에게 물어보세요. 감사합니다!

<div class="content-ad"></div>

가장자리에는 네 개의 마포를 바르기로 결정했다. 각각의 코트를 바른 후, 잘 통풍되는 곳에서 30분씩 마르도록 했다. 네일 폴리시를 바를 때, 센서를 케이블을 세로로 잡고 윗부분부터 아랫부분까지 각각의 가장자리에 발라주는 것이 편하다는 것을 발견했다. 또한 센서 아래쪽의 점을 이용해서 작업대에 대고 쉬었다. 세 번의 코트를 바른 결과, 대부분의 부분이 부드럽고 매끈해졌다.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_23.png)

### 6. 가라 앵코르 프레이트 가장자리에 맞는 마포

이 단계는 내가 예상했던 것보다 조금 더 어려웠다. 네일 폴리시 브러시의 크기로 인해 의도치 않게 PCB에 더 많은 네일 폴리시가 발려버렸다. 그러나 현재 이 시점에서 아날로그 신호에 어떤 유의미한 차이를 만들지는 알 수 없다. 마포를 바른 목적은 여전히 솔더 마스크를 보호하기 위함이었으므로, 아마도 그 대가가 미미할 것이라 생각된다. 어쨌든, 가라 앵코르 프레이트 가장자리에 가벼운 코팅을 하나만 발라주고, 잘 통풍되는 곳에서 30분간 마르도록 했다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_24.png)

그 외 주목할 사항 두 가지가 있습니다. 첫째, PCB 위에 묻은 네일 폴리시를 닦아야 했는데, 실행중에 그것이 한 덩어리로 남아있지 않도록 했습니다. 둘째, 센서에 매우 가까이 다가가서 네일 폴리시를 가능한 한 정확하고 적게 바르도록 노력했습니다. 그라운드 플레이트의 가장자리에만 바르도록 했습니다. 무독성 마스크를 착용하거나 통풍이 잘되는 곳에서 사용하는 것을 강력히 권장합니다.

## 6g. 전자 부품의 앞뒤에 우레탄 코팅

센서 위에 우레탄 스프레이를 준비하기 위해 종이를 덮을 때, 갈색 포장지를 사용할 수 있음을 발견했습니다. 센서를 감쌀 정도로 넓게 잘라서 뒷면에 종이 클립으로 고정했습니다. 클립은 센서를 바닥에서 치우치게 해 주는 추가적인 혜택이 있습니다.


<div class="content-ad"></div>


![Protecting Capacitive Soil Moisture Sensors 25](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_25.png)

![Protecting Capacitive Soil Moisture Sensors 26](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_26.png)

다음으로, 센서의 앞면에 운칠을 세 층 바르고 각 코팅 사이에 적어도 30분씩 건조시켰어요. 이 일을 통풍이 잘 되는 곳에서 하고 마스크와 장갑을 사용하는 걸 강력히 추천합니다. 충분한 환기가 없는 실내에 하지 마세요. 운칠이 건조되었는지 확인하기 위해 장갑을 끼고 PCB를 가볍게 눌렀어요. 장갑이 깨끗하게 남아 있으면 건조되었다고 판단했어요. 이전에 언급한 바와 같이, 투명한 운칠 대신 빨간색 운칠을 구입했습니다. 열 수축이 적용되면 차이가 없을 거예요.

![Protecting Capacitive Soil Moisture Sensors 27](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_27.png)


<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_28.png" />

<img src="/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_29.png" />

<img src="/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_30.png" />

I then flipped the paper over and applied three layers of urethane to the rear of the sensor and let it dry for at least 30 minutes between each coat.


<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_31.png)

![Image 2](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_32.png)

![Image 3](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_33.png)

![Image 4](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_34.png)


<div class="content-ad"></div>

앞면과 뒷면을 살펴보세요.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_35.png)

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_36.png)

### 6시. 전자 부품 위에 히트 수축 튜브 사용하기

<div class="content-ad"></div>

마지막 유레탄 코팅이 발라진 지 약 18시간이 지났어요. 3:1 비율의 접착제가 라인 처리된 3/4인치(19.1mm) 길이의 40mm(1.6인치) 열 수축 튜브를 잘라 센서 위에 장착했어요.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_37.png)

그런 다음 헤어 드라이어로 열 수축을 시켜, 여전히 뜨거운 상태에서 오븐 장갑을 사용해 압축했어요. 여기 결과물이에요.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_38.png)

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_39.png)

![이미지2](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_40.png)

안타깝게도 Adosia의 제품과 비교해본 결과, 히트 수축 소재가 제대로 수축되지 않은 것으로 나타났습니다. 나는 헤어 드라이어가 충분한 열을 발생시키지 못했을 것으로 가정했습니다, 특히 히트건과 비교했을 때. 솔더링 아이언의 배럴을 사용하여 더 수축시켰는데, 이는 매우 지루한 과정이었고, 결과적으로 히트 수축 소재에 몇 개의 화재 흔적이 남았습니다.

![이미지3](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_41.png)


<div class="content-ad"></div>


![Capacitive Soil Moisture Sensor 1](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_42.png)

![Capacitive Soil Moisture Sensor 2](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_43.png)

## 6i. Nail Polish to Heat-Shrink-to-Sensor Join

After the heat-shrink had completely cooled to room temperature, I inverted the sensor and applied one coat of nail-polish completely around the join. I then left it to dry for 30 minutes in a well-ventilated area.


<div class="content-ad"></div>


![Protecting Capacitive Soil Moisture Sensor 44](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_44.png)

![Protecting Capacitive Soil Moisture Sensor 45](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_45.png)

## 6j. 노출된 구리 판에 우레탄 도장 [손상된 센서 수리 단계]

우레탄 스프레이를 사용한 후, 센서의 노출된 구리에 적용을 시도하지 않기로 결정했습니다. 스프레이가 무작위이고 통제할 수 없는 것을 감안하면 너무 어려운 작업이라고 판단했습니다. 나중에 시도해볼 수도 있겠지만, 일단은 대신 손톱 매니큐어를 사용하기로 결정했습니다.


<div class="content-ad"></div>

노출된 구리 판에 네일 폴리시 한 층을 발라 건조가 완료되도록 환기가 잘 되는 곳에 30분 동안 두었습니다. 이전과 마찬가지로 센서에 가까이 다가가야 할 것으로 예상되어 마스크를 착용하여 증기를 피했습니다.

![sensor](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_46.png)

이것이 제가 해야 할 마지막 부분이라고 생각하여 앞뒤로 이소프로필 알코올을 뿌려 센서를 깨끗이 닦고, 마이크로 섬유 천으로 살짝 닦은 후 ESD 안전 가방에 저장했습니다. 이 작업은 환기가 잘 되는 곳에서 수행하며, 마스크와 장갑을 착용했습니다.

# 7. 재시험

<div class="content-ad"></div>

이전에 보호된 센서를 동일한 조건에서 다시 테스트했지만 한 가지 주의할 사항이 있었습니다. 원래 테스트 사이에 시간이 지난 후에 사용한 토양을 폐기했기 때문에 이번 테스트에서 사용한 것은 자연 복숭아였습니다. 그러나 양은 동일했습니다. 이전 결과와 겹쳐 보호된 센서의 결과는 다음과 같습니다.

![이미지](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_47.png)

## 8. 결론 및 의견

결과로부터 결론을 얻는 데에 대해 신중해야 합니다. 미래에 이를 다시 실행하고 모든 테스트에서 토양, 자연복숭아 또는 어떤 매체가 일관되도록 유지하고 싶습니다. 또한 초기 테스트 시간에 작성한 메모를 고려하여보다 효과적인 방법론을 설계하고자 합니다.

<div class="content-ad"></div>

어쨌든, 건조 및 수분 결과만 보면 (흙이나 마루치를 사용하지 않았기 때문에 영향을 받지 않을 것이라는 전제 하에) 새로운 센서와 손상된 센서 결과와 매우 일관된 것으로 나타납니다. 이는 센서에 적용된 보호층이 결과적으로 아날로그 신호에 별다른 영향을 미치지 않았음을 보여주어 매우 흥미로운 점입니다. 그러나 더 중요한 것은 이 기사의 맥락에서 손상된 커패시티브 토양 수분 센서를 수리하는 것인데, 센서 가장자리, 접지판 가장자리 및 노출된 구리판에 네일 폴리시를 바른 것도 결과적으로 영향을 미치지 않는 것으로 보입니다.

일부 문제를 제외하고 (특히 추가로 이탈된 솔더 마스크), 센서의 상태에 대해 일반적으로 만족스럽다고 생각합니다. 처음에는 기능이 없었고 거의 분해될 가능성이 높았기 때문에 이제 그 내구성에 대해 높은 기대를 가지고 있습니다. 상처 입은 센서에 적용한 보호층의 효과가 시간이 지난 후 어떻게 나타날지에 특히 관심이 있습니다. 미래에 노력한 내용을 업데이트할 계획이며, 사용할 기존 및 새로운 센서에 이러한 보호층을 적용할 것입니다. 추가적으로 다룰 포인트가 몇 가지 있습니다.

보호층이 순차적으로 적용되기 전에 이소프로필 알코올로 센서를 가볍게 청소하는 것도 좋을 수 있습니다. 예를 들어, 요염 및 네일 폴리시를 바르는 것은 이미 존재하는 것을 밀폐하는 효과가 있습니다. 이는 머리카락, 먼지, 기름(즉, 피부 기름) 및 기타 이물질 및 유물이 센서와 작동에 영향을 줄 수 있음을 의미할 수 있습니다.

나는 많은 단계에서 센서를 "삼켜주기" 위해 쇠지를 사용했을 때보다 부드러운 천을 사용하는 것이 더 적막일 수 있습니다. 부드럽고 두꺼운 천 경련이 벤치 바이스에서 더 쉬웠을 것입니다. 일반적으로 소포에서 찾을 수 있는 얇은 폴리에틸렌 폼 시트가 좋은 선택일 수 있습니다. 솔더 마스크 위를 부드럽게 지나가며 끌지 않고 미끄러울 것입니다. 만약 다른 이물질이나 잔여물이 있는지 확인하려면 카드보드나 비슷한 재질을 사용할 때 소포를 센서에 부드럽게 밀착시키고 냅니다.

<div class="content-ad"></div>

이전에 언급한 PCB의 변색은 특히 새 센서의 가장자리와 비교했을 때 뚜렷하게 보입니다.

![image](/assets/img/2024-06-23-ProtectingCapacitiveSoilMoistureSensors_48.png)

이 변색이 PCB가 물을 흡수한 것을 나타내는 지 궁금합니다. 이것이 납땜용 열이 존재할 때 거품이 생기는 것을 관찰한 이유일지도 모릅니다. 가장자리에 발라둔 네일 폴리시가 이런 사태를 방지하는 데 도움이 되기를 희망합니다.

PCB 모서리를 깎기 위해 라우터 부착용 드레멜을 사용하는 것을 고려했지만 PCB의 작은 부분만 둥글게 깍아내야 했습니다. 손으로 갈아 내는 것이 매우 쉬웠습니다.

<div class="content-ad"></div>

센서 상단의 전선에 적용한 열 수축 튜브에는 접착제가 없었습니다. 이것은 외부에 있는 접착제가 있는 열 수축 튜브의 효과를 줄일 수 있습니다. 왜냐하면 효율적으로 '터널'을 만들기 때문입니다. 이러한 이유로 '터널' 끝 부분을 포함하는 접착제가 있는 열 수축 튜브를 자르기로 선택했습니다. 전선 주변에 접착제가 없는 열 수축 튜브를 사용할 경우 이 사실을 인식하십시오. 다음 옵션 중 하나를 선택하십시오:

- 내부 열 수축 튜브를 사용하지 마십시오;
- 외부 열 수축 튜브가 덮을 수 있도록 짧은 길이를 사용하십시오; 또는
- 접착제가 있는 열 수축 튜브를 사용하십시오.

차후 센서에 대해 외부 열 수축 튜브 상단을 뛰어넘는 내부 길이의 접착제가 있는 열 수축 튜브를 사용하기로 결정했습니다. 이렇게 함으로써 절연된 전선 이상의 대상 주변에 더 큰 외부 밀봉이 형성되기를 희망합니다.

열 수축 튜브 내부의 접착제가 헤어 드라이어를 사용하여 충분히 녹지 않으면 실마리를 올바르게 만들 수 없을 것입니다. 이 경우 센서 주변에 제대로 밀봉이 형성되지 않을 것입니다. 발생하면 물과 습기를 멀리하도록하는 능력이 심각하게 저하될 수 있습니다. 절대적으로 열건을 사용하는 것을 강력히 권장드립니다.

<div class="content-ad"></div>

열 수축체 위에 어떤 종류의 “뚜껑”을 만들어 센서 상단에 놓을 수 있을까 궁금해졌어요. 아마도 3D 프린트된 것일 수도 있어요. 기존 상태로 둘 경우보다 미학적인 면에서 더 나을 뿐만 아니라 해당 부위를 더 잘 보호해줄 수도 있을 거예요. 비올 때 식물 화분 바깥에 있는 센서를 상상해봤을 때, 물이 열 수축체의 개구 부위를 맞을 것 같아 걱정이 돼요. 시간이 지나면 이것이 열 수축체의 보호 기능 (특히 접착제)에 어떻게 영향을 미칠지에 대해 고민이 들어요. 다른 전자 부품들을 수용할 수 있는 것이 만들어질 수 있다면 흥미롭겠죠.

센서가 열 수축체와 접합되는 부위에 매니큐어를 사용하는 데 대한 몇 가지 우려가 있어요. 아마도 여기서 레드 색상을 사용하지 않겠지만 대신 더 많은 유레탄을 사용할 수 있었을지 궁금해요. 그러나 이곳에 어떤 보호 조치를 취하더라도 궁극적으로는 필요 없을지도 모르겠죠. 이미 접합 부위의 아래쪽과 뒤쪽에는 이미 유레탄이 있고, 열 수축체에서 나온 접착제가 있어요. 그러나 좀 더 생각해본 결과, 이 접합 부위가 전자 부품에 가장 가까운 데라는 것을 깨달았어요. 맘의 안정을 위해 추가적인 보호 조치가 유익할 수도 있겠네요.

경제적으로 비현실적하지 않다면, 다시 레드 유레탄을 사용하지 않겠어요. 센서 오른쪽 가장자리에 있는 “유출물”은 상당히 눈에 띄고 미학적으로도 매력적이지 않아요. 대신 투명한 유레탄을 사용할 거에요. 물론, 필요한 부위에만 효과적으로 적용할 수 있는 능력에 따라 달려 있겠죠. 그렇게 하면 열 수축체가 유레탄을 완전히 가리고 있을 거예요, 색깔에 상관없이요.