---
title: "홈 어시스턴트의 템플릿 파워 언락하기"
description: ""
coverImage: "/assets/img/2024-05-27-UnlockingthePowerofTemplatesinHomeAssistant_0.png"
date: 2024-05-27 13:20
ogImage: 
  url: /assets/img/2024-05-27-UnlockingthePowerofTemplatesinHomeAssistant_0.png
tag: Tech
originalTitle: "Unlocking the Power of Templates in Home Assistant"
link: "https://medium.com/@vmannoor/unlocking-the-power-of-templates-in-home-assistant-75a08d0ad205"
---


![2024-05-27-UnlockingthePowerofTemplatesinHomeAssistant_0.png](/assets/img/2024-05-27-UnlockingthePowerofTemplatesinHomeAssistant_0.png)

템플릿은 홈 어시스턴트에서 제공되는 가장 강력한 도구 중 하나입니다. 센서를 생성하거나 자동화 트리거를 설정하고 자동화 조건을 정의하며 등등 다양한 용도로 활용할 수 있습니다. 그러나 많은 홈 어시스턴트 사용자들이 잠재력을 충분히 활용하지 못하고 있습니다. 최근 몇 년간 홈 어시스턴트팀이 더 사용자 친화적이고 UI 기반의 설정으로 진화함에 따라 대부분의 사용자들이 템플릿을 더 적게 사용하게 되었습니다. 그러나 템플릿은 UI만으로는 어려운 사용자 정의 및 자동화 수준을 제공합니다.

홈 어시스턴트의 포괄적인 문서는 템플릿의 여러 일반적인 사용 사례를 다루고 있습니다. 게다가 홈 어시스턴트의 "개발자 도구" 섹션에 전용 템플릿 편집기가 있어 실시간으로 템플릿을 테스트할 수 있습니다. 이 도구는 설정을 배포하기 전에 템플릿을 문제 해결하고 정교화하는 데 매우 유용합니다.

템플릿의 다양성과 강력함을 보여주기 위해 저 자신이 집에서 사용하는 몇 가지 예시를 소개하겠습니다:

<div class="content-ad"></div>

## 1. 사용자 정의 센서 만들기

템플릿의 주요 용도 중 하나는 사용자 정의 센서를 만드는 것입니다. 예를 들어, 저는 여러 방의 다른 센서에서 평균 온도를 계산하는 템플릿 센서를 사용합니다. 이는 단일 측정 지점이 아닌 전체 집 온도에 기반한 난방이나 냉방 시스템을 작동하는 데 매우 유용합니다.

간단한 센서 버전부터 시작해 봅시다:

```js
template:
  - sensor:
      - name: "Home Temperature"
        unit_of_measurement: "°C"
        state: >
          { (states('sensor.living_room_temperature') | float + 
              states('sensor.bedroom_temperature') | float + 
              states('sensor.kitchen_temperature') | float) / 3 }
```

<div class="content-ad"></div>

이 예제에서는 각각의 온도 센서 상태를 얻어와서 float 숫자 유형으로 변환한 다음 값들을 더하고, 센서의 개수로 나누어 평균을 구하는 방법에 대해 설명합니다. Home Assistant는 모든 센서 값을 문자열로 저장하기 때문에 먼저 이를 숫자 값으로 변환해야 합니다. "| float"는 정확히 그 역할을 합니다. 템플릿 센서에 익숙하지 않은 경우 Home Assistant 공식 통합 페이지에서 기본 사항을 읽어볼 수 있습니다.

우리가 만든 센서는 매우 유연하지 않습니다. 집에 더 많은 온도 센서를 설치하면 해당 센서를 포함하는 템플릿을 수정해야 합니다. 비슷한 센서가 많을 경우 이를 추적하고 수동으로 업데이트하는 것은 항상 쉽지 않습니다. 이상적으로, 템플릿 센서는 Home Assistant에 추가한 모든 온도 센서를 식별하고 템플릿 센서를 동적으로 조정할 수 있어야 합니다. 재밌는 점은, 템플릿으로 이를 할 수 있다는 것입니다:

```js
template:
  - sensor:
      - name: "Home Temperature"
        unit_of_measurement: "°C"
        state: >
          { (states.sensor 
            | selectattr('attributes.device_class', 'eq','temperature')
            |rejectattr('state','in','unavailable,unknown')
            | map(attribute='state') | map('float', 0)| average)|round(2) }
```

위 코드가 그 역할을 합니다. 먼저 템플릿은 'states.sensor'를 통해 센서 도메인의 모든 엔티티의 상태를 선택한 다음 두 개의 필터를 적용합니다: 첫 번째 필터는 'device_class'가 'temperature'인 엔티티만 포함하고, 두 번째 필터는 'unavailable' 또는 'unknown'인 엔티티를 거부합니다. 해당 엔티티들의 상태를 'float' 숫자로 매핑하고 해당 숫자들의 평균을 취합니다. 마지막으로 결과를 표시하기 전에 소수점 둘째 자리까지 반올림합니다. 따라서 새로운 센서가 추가되거나 어느 하나의 센서가 오프라인 상태가 되면 템플릿이 즉시 재계산되어 센서 값을 변경합니다.

<div class="content-ad"></div>

그러나 여기에 작은 문제가 있습니다. 프로세서용 온도 센서도 설정한 경우를 상상해 보죠. 위 템플릿에는 해당 센서의 디바이스 클래스도 'temperature'이기 때문에 이를 평균에 포함시킬 것입니다. 이 문제를 해결할 수 있는 다양한 방법이 있습니다. 이 중 하나는 아래와 같습니다:

```js
template:
  - sensor:
      - name: "Home Temperature"
        unit_of_measurement: "°C"
        state: >
          { (states.sensor 
            | selectattr('attributes.device_class', 'eq','temperature')
            | rejectattr('state','in','unavailable,unknown')
            | selectattr('entity_id','search','room|kitchen')
            | map(attribute='state') | map('float', 0) | average) | round(2) }
```

내가 한 일은 entity ID에 'room'이나 'kitchen'이 포함된 엔티티만 선택하는 필터를 추가한 것입니다.

## 2. 자동화에서

<div class="content-ad"></div>

```js
    - 별칭: 배터리 부족 알림
      id: "ag2i86995uix9vt84a6g7699h"
      trigger:
        - platform: time
          at: "20:00:00"
      mode: single
      max_exceeded: silent
      condition:
        - condition: template
          value_template: >
            { (states.sensor 
              | selectattr('attributes.device_class', 'eq','battery')
              | selectattr('attributes.unit_of_measurement', '==', '%') 
              |rejectattr('state','in','unavailable,unknown')
              | map(attribute='state') | map('int')
              |select('<=',5) |list|length)>0 }           
      action:
        - delay: "00:30:00"
        - service: notify.telegram_vm
          data:
            title: "{ '\U0001F50B' } *낮은 배터리*"
            message: >
              { set batteries = states.sensor 
                | selectattr('entity_id', 'has_value') 
                |rejectattr('state','in','unavailable,unknown')
                | selectattr('attributes.device_class', '==', 'battery') 
                | selectattr('attributes.unit_of_measurement', '==', '%') | list }
              { set low_battery = batteries | map(attribute='state') | map('int') | select('<=', 5) | map('string') | list }
              { batteries | selectattr('state', 'in', low_battery) | map(attribute='name') | list | join('\n') }
```

이 자동화는 매일 오후 8시에 전원이 낮은 장치 목록과 함께 제 텔레그램 메신저로 알림을 보냅니다. (5% 이하의 경우). 조건 부분 및 알림 메시지 만들기 위해 템플릿을 사용합니다. 센서 예제와 마찬가지로 템플릿을 사용하면 동적인 장점이 있습니다. 장치를 추가하거나 제거할 때 아무 것도 변경할 필요가 없습니다.

조건 부분에서는 우선 5% 이하로 충전된 배터리가 있는지 확인하는 템플릿 조건을 사용합니다. 첫째로 템플릿은 '배터리' 장치 클래스 속성과 '%'(율) 단위 측정 속성을 가진 센서를 선택한 후 '이용 불가능' 또는 '알 수 없음'인 센서를 제거합니다. 마지막으로 이러한 센서의 상태를 정수로 매핑하고 값이 5 이하인 센서를 필터링합니다. 다음으로 템플릿은 'length' 필터를 사용하여 해당 센서 수를 계산합니다. 마지막으로 길이가 0보다 큰지(5 미만의 배터리 값을 가진 엔티티가 있는지) 확인합니다.

액션 부분에서 메시지도 유사한 방법을 사용하여 생성됩니다. Home Assistant는 센서 상태를 문자열로 저장하므로 먼저 저전력 배터리 센서 목록을 가져 와서 두 번째 단계에서 해당 센서 이름을 다시 필터링해야 합니다.


<div class="content-ad"></div>

# 결론

템플릿은 홈 어시스턴트(Home Assistant)에서 매우 강력한 기능으로, 맞춤화와 유연성을 가능하게 합니다. UI 중심의 설정 트렌드가 홈 어시스턴트를 보다 접근하기 쉽게 만들었지만, 템플릿의 잠재력을 간과해서는 안 됩니다. 템플릿을 활용하여, 반응성이 향상되고 똑똑하며 개인화된 스마트 홈 환경을 만들 수 있습니다.

더 자세한 안내와 예제를 보려면 공식 홈 어시스턴트 문서와 개발자 도구 섹션의 템플릿 편집기를 확인하세요. 템플릿의 힘을 받아들이고, 홈 어시스턴트 설정의 모든 잠재력을 끌어내세요. 템플릿에 관한 질문이나 도움이 필요하다면, 아래에 댓글을 남겨주세요! 기꺼이 도와드리겠습니다.