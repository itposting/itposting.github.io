---
title: "홈 어시스턴트에서 AppDaemon을 사용하여 투야Tuya 기기 문제 해결하기"
description: ""
coverImage: "/assets/img/2024-06-19-FixingTuyaDeviceProblemsinHomeAssistantwithAppDaemon_0.png"
date: 2024-06-19 05:41
ogImage: 
  url: /assets/img/2024-06-19-FixingTuyaDeviceProblemsinHomeAssistantwithAppDaemon_0.png
tag: Tech
originalTitle: "Fixing Tuya Device Problems in Home Assistant with AppDaemon"
link: "https://medium.com/@vmannoor/fixing-tuya-device-problems-in-home-assistant-with-appdaemon-5798c2d41b3a"
---


![2024-06-19-FixingTuyaDeviceProblemsinHomeAssistantwithAppDaemon_0.png](/assets/img/2024-06-19-FixingTuyaDeviceProblemsinHomeAssistantwithAppDaemon_0.png)
안녕하세요! 스마트 홈 열정가들에게 이상적인 솔루션으로 떠오르는 홈 어시스턴트는 다양한 생태계의 장치를 연결하는 자유를 찾는 분들에게 완벽한 선택지입니다. 상품 특정 허브와 소프트웨어의 제한에 얽매이지 않고 장치 간 원활한 통신을 가능케 하며 종종 비교할 수 없는 수준의 맞춤 설정과 제어를 제공합니다. 하지만 잘 알려진 안드로이드 vs. iOS 논쟁과 같이, 이 자유는 별도의 어려움을 동반합니다. 주요 단점 중 하나는 홈 어시스턴트가 지원하는 장치에 엄격한 품질 통제가 없다는 점입니다. 때로는 제대로 설계되지 않은 장치 통합이 시스템에 슬쩍 들어가 사용자들에게 많은 당혹감을 야기할 수 있습니다.

본 문서에서는 홈 어시스턴트의 Tuya 통합에서 마주한 특정 문제와 AppDaemon을 사용하여 해결한 경험을 공유하겠습니다.

# 문제: 결함이 있는 Tuya 도어벨

<div class="content-ad"></div>

알리익스프레스에서 싸게 구입한 Wi-Fi 비디오 도어벨이 있어요. 네, 알아요, 조금은 도박 같은 느낌이긴 하죠. 하지만 리뷰가 나쁘지 않았고, 더 인기 있는 대안들처럼 월 구독비를 내고 싶지 않았어요.

도어벨 성능이 실망스러웠어요. 비디오 스트리밍이 느리고, 문을 누르면 홈 어시스턴트에 알림이나 센서가 없었어요. 도어벨이 배터리로 작동하다보니, 배터리가 완전히 소진되기 전에 충전할 방법이 필요했어요. 아쉽게도 홈 어시스턴트의 투야(Tuya) 통합은 배터리 수준을 부정확하게 표시했어요. 백분율이 아니라 100%에 대해 10.0, 65%에 대해 6.5와 같은 값으로 표시되었죠.

홈 어시스턴트 설정에 저의 저전력 경고를 관리하는 자동화가 있어요. 저는 이전에 홈 어시스턴트 템플릿에 관한 글에서 자세히 설명했어요. 이 도어벨 배터리를 위해 별도의 자동화를 만들 수도 있었지만, 9.0이나 6.5와 같은 이상한 배터리 수준을 보는 건 내성적인 제 자신에게 짜증났어요. 그래서 이 문제를 해결하기 위해 다른 옵션을 탐색하기로 결정했어요. 

# 간단한 해결책 시도: 템플릿 센서 사용

<div class="content-ad"></div>

배터리 표시 문제를 해결하는 한 가지 간단한 방법은 홈 어시스턴트에 중복 템플릿 센서를 만드는 것이었습니다. 이 센서는 잘못된 배터리 값들을 가져와 값을 정수로 변환한 다음 10을 곱하여 올바른 백분율을 표시했습니다. 이를 수행하는 코드 일부를 제공해드리겠습니다:

```js
템플릿:
  센서:
    - 이름: '도어벨 배터리'
      단위: '%'
      기기_클래스: 배터리
      상태_클래스: "측정"
      상태: >
        { 배터리_상태 = 상태('센서.smart_video_doorbell_battery') }
        { 만약 배터리_상태 }
          { (배터리_상태 | int(default=0)) * 10 }
        { 그렇지 않다면 }
          0
        { 끝만약 }       
      아이콘: >
        { 배터리_상태 = 상태('센서.smart_video_doorbell_battery') }
        { 만약 배터리_상태 }
          { 새_상태 = (배터리_상태 | int(default=0)) * 10 }
          { 만약 새_상태 > 75 }
            mdi:battery-high
          { 그렇지 않고 새_상태 > 50 }
            mdi:battery-medium
          { 그렇지 않고 새_상태 > 25 }
            mdi:battery-low
          { 그 외에 }
            mdi:battery-outline
          { 끝만약 }                                            
        { 그렇지 않다면 }
          mdi:battery-outline
        { 끝만약 }   
```

이 방법으로 문제를 해결할 수는 있었지만, 원래 센서의 잘못된 값들을 실제로 수정하지는 못했습니다.

# 더 나은 해결책: AppDaemon을 사용하여 센서 수정하기

<div class="content-ad"></div>

AppDaemon은 이러한 문제를 처리하는 더 유연하고 동적인 방법을 제공합니다. AppDaemon 문서에 따르면, AppDaemon 앱에서 Home Assistant 엔티티의 값을 설정할 수 있습니다. 이 기능을 사용하여 실시간으로 센서 값을 수정하는 앱을 개발했습니다.

다음은 코드입니다:

```js
import appdaemon.plugins.hass.hassapi as hass

class SensorMultiplier(hass.Hass):

    def initialize(self):
        self.battery_entity = "sensor.smart_video_doorbell_battery"
        self.listen_state(self.sensor_changed, self.battery_entity)

    def sensor_changed(self, entity, attribute, old, new, kwargs):
        try:
            battery_value = float(new)
            if battery_value <= 10:
                new_value = battery_value * 10

                if new_value > 75:
                    icon = "mdi:battery-high"
                elif new_value > 50:
                    icon = "mdi:battery-medium"
                elif new_value > 25:
                    icon = "mdi:battery-low"
                else:
                    icon = "mdi:battery-outline"

                # Write back the new value to another sensor
                self.set_state(entity, state=new_value,
                    attributes={
                        "icon": icon,
                        "device_class": "battery"
                    }
                )
                self.set_state(entity, state=new_value)
        except ValueError:
            self.log(f"Invalid sensor value: {new}")
```

```js
sensor_multiplier:
  module: sensor_multiplier
  class: SensorMultiplier
```

<div class="content-ad"></div>

이 앱은 초인종 배터리 센서의 변경 사항을 감지합니다. 변경 사항이 감지되면 배터리 값을 10배로 곱하고 이 변경된 값을 사용하여 센서를 업데이트합니다. 또한 새로운 배터리 레벨에 따라 아이콘을 변경하여 배터리 상태를 빠르게 확인할 수 있습니다.

이 수정으로 배터리 센서가 이제 올바른 값을 표시합니다. Home Assistant에서 기기와 관련된 비슷한 문제를 겪고 있다면 AppDaemon을 시도해 보는 것을 권장합니다.

AppDaemon에 익숙하지 않다면 다른 문서에서 자세히 다룬 내용을 확인할 수 있습니다.

스마트한 가정을 만들어 주세요!