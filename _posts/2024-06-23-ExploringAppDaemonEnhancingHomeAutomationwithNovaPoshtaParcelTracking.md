---
title: "AppDaemon 탐구 NovaPoshta 소포 추적으로 홈 자동화 향상시키는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-ExploringAppDaemonEnhancingHomeAutomationwithNovaPoshtaParcelTracking_0.png"
date: 2024-06-23 17:08
ogImage: 
  url: /assets/img/2024-06-23-ExploringAppDaemonEnhancingHomeAutomationwithNovaPoshtaParcelTracking_0.png
tag: Tech
originalTitle: "Exploring AppDaemon: Enhancing Home Automation with NovaPoshta Parcel Tracking"
link: "https://medium.com/@vmannoor/exploring-appdaemon-enhancing-home-automation-with-novaposhta-parcel-tracking-25983f968304"
---


<img src="/assets/img/2024-06-23-ExploringAppDaemonEnhancingHomeAutomationwithNovaPoshtaParcelTracking_0.png" />

만약 나처럼 Home Assistant 애호가라면, 더 스마트한 자동화를 위해 모든 것을 연결하려고 할 것입니다. 최근에 나는 AppDaemon을 탐험하고 Python에 몰두하고 있어요. AppDaemon의 멋진 점 중 하나는 Home Assistant와 서비스를 통합하는 사용자 정의 앱을 만들 수 있다는 것인데, 이는 공식 또는 HACS 통합이 없는 서비스도 포함됩니다.

NovaPoshta(https://novaposhta.ua)는 우크라이나 최대의 우편 및 퀄리어 회사로, 나는 그들의 소포 추적 서비스를 Home Assistant에 통합하고 싶었어요. 등록된 사용자에게 무료 API를 제공하며, 자세한 소포 정보 및 기타 정보를 제공합니다.

처음에는 기존의 사용자 정의 통합을 위해 GitHub를 검색했고 Dmitry Krasnoukhov의 사용자 정의 통합(https://github.com/krasnoukhov/homeassistant-nova-poshta)을 발견했어요. 그러나 정보를 다르게 표현하고 싶었습니다. AppDaemon과 실험 중이었기 때문에 직접 앱을 작성하기로 결정했어요.

<div class="content-ad"></div>

먼저, 노바포셔(Nova Poshta)에 계정을 등록해야 합니다. 이미 서비스를 이용 중이라면 계정이 있을 가능성이 높습니다. https://new.novaposhta.ua/dashboard/ 에서 계정 페이지에 로그인하고 설정 섹션으로 이동하여 새 API 키를 생성하세요. 이 키는 AppDaemon에서 API 호출을 하는 데 중요합니다. 자세한 API 문서는 https://developers.novaposhta.ua/documentation 를 방문하세요.

![이미지](/assets/img/2024-06-23-ExploringAppDaemonEnhancingHomeAutomationwithNovaPoshtaParcelTracking_1.png)

![이미지](/assets/img/2024-06-23-ExploringAppDaemonEnhancingHomeAutomationwithNovaPoshtaParcelTracking_2.png)

# MQTT 센서 구성:

<div class="content-ad"></div>

제 세팅에서는 Home Assistant에 MQTT 센서를 만들었습니다. 이 센서는 제 전화번호와 관련된 소포 수를 상태로 표시하고 발신자, 배송 상태 등과 같은 소포 세부 정보를 속성으로 제공합니다. 아래는 MQTT 센서 구성의 일부입니다:

```js
  mqtt:
    sensor:
      - name: "Novaposhta parcels Vijish"
        icon: mdi:truck-fast
        state_topic: "ha/state/novaposhta/parcels/vijish"
        value_template: "{ value_json|length }"
        json_attributes_topic: "ha/state/novaposhta/parcels/vijish"
```

JSON 구조를 페이로드로 게시할 수 있는 MQTT 센서를 선택했습니다. MQTT 센서에서 속성 주제를 지정하면 Home Assistant가 자동으로 해당 속성을 속성으로 통합합니다. 아래는 제 MQTT 센서의 코드입니다.

# AppDaemon 앱

<div class="content-ad"></div>

그 다음은 AppDaemon 앱 자체를 살펴보겠습니다. 이전 글에서 언급했듯이, 저는 아직 파이썬에 상대적으로 새로운 사용자이며, ChatGPT가 아래 코드를 작성하고 최적화하는 데 큰 도움이 되었습니다.

```js
import appdaemon.plugins.hass.hassapi as hass
import requests
import json
from datetime import datetime, timedelta

class NovaPoshtaMQTTParcelTracker(hass.Hass):

    def initialize(self):
        # API 엔드포인트 및 API 키 설정 (안전하게 저장된 것이어야 합니다)
        self.api_url = "https://api.novaposhta.ua/v2.0/json/"
        self.api_key = self.args["api_key"]  # AppDaemon 구성에서 가져옴

        # MQTT 브로커 구성
        self.mqtt_broker = self.args["mqtt_broker"]
        self.mqtt_port = self.args["mqtt_port"]
        self.mqtt_topic = self.args["mqtt_topic"]

        # 앱이 정기적으로 실행되도록 스케줄
        self.run_every(self.fetch_parcel_details, "now", self.args.get("interval", 3600))

    # fetch_parcel_details(), handle_success(), get_readable_status(), handle_error(), publish_mqtt() 등 다른 메소드들은 코드의 다른 부분들을 처리합니다.
    
```

- 입력 값은 새로운 앱이 선언된 AppDaemon의 apps.yaml 파일 안에서 인수로 구성됩니다.
- API 토큰 및 MQTT 서버 주소는 Home Assistant 구성에서와 유사하게 secrets.yaml 파일에 안전하게 저장됩니다. 이 파일은 Appdaemon 추가 구성 디렉토리에 위치해야 합니다.
- 데이터는 지난 30일 이내의 소포에 대해 검색되며, start_date = today - timedelta(days=30)를 수정하여 이를 조정할 수 있습니다.
- 검색된 각 소포는 Parcel1, Parcel2 등으로 순차적으로 새로운 속성을 생성합니다.
- 앱은 정기적으로 실행되며, 앱 구성 섹션에서 시간 간격을 설정할 수 있습니다. 기본적으로 지정되지 않은 경우 1시간마다 확인합니다.

AppDaemon 앱을 시스템에 통합하려면 위의 코드를 apps.yaml 파일에 추가해야 합니다.

<div class="content-ad"></div>

```yaml
novaposhta_parcel_tracker:
  module: novaposhta_parcel_tracker
  class: NovaPoshtaMQTTParcelTracker
  api_key: !secret novaposhta_token
  mqtt_broker: !secret mqtt_broker  # MQTT 브로커 주소로 교체하세요
  mqtt_port: 1883  # 일반적으로 MQTT의 기본 포트
  mqtt_topic: "ha/state/novaposhta/parcels/vijish"
  interval: 600  # 매 10분마다 확인

# 자동화:

센서 데이터를 활용하여 자동화를 생성할 수 있습니다. 예를 들어, 집이나 직장 구역을 떠나고 송장이 도착했지만 아직 수취되지 않은 경우 알림을 설정할 수 있습니다.

  automation:
    - alias: "Novaposhta 송장 알림"
      id: "automation_notification_novaposhta_parcel_arrived"
      trigger:
        - platform: zone
          entity_id: person.vijish
          zone: zone.home
        - platform: zone
          entity_id: person.vijish
          zone: zone.work
          event: leave
      condition:
        - condition: and
          conditions:
            - condition: template
              value_template: >
                { for key, value in states.sensor.novaposhta_parcels_vijish.attributes.items() }
                  { if key.startswith('Parcel') and value.get('Status') == 'Parcel Arrived' }
                    true
                  { endif }
                { endfor }              
      mode: single
      max_exceeded: silent
      action:
        - service: telegram_bot.send_message
          data:
            title: "<b>Нова Пошта</b>"
            target: !secret tele_id_vm
            message: >
              다음 송장이 도착했습니다:
              { for key, value in states.sensor.novaposhta_parcels_vijish.attributes.items() }
                { if key.startswith('Parcel') and value.get('Status') == 'Parcel Arrived' }
                  <b>{ key }:</b>
                    발신인: { value.get('Sender') }
                    송장: { value.get('Parcel') }  
                    배달 주소: { value.get('Delivery address') }
                { endif }
              { endfor }
            parse_mode: html

<div class="content-ad"></div>

이것으로 모두 마무리되었어요. 이 글이 홈 어시스턴트의 AppDaemon 기능을 더욱 흥미롭게 탐구하는 데 도움이 되었기를 바랍니다. 비슷한 사용 사례에 대한 여러분의 생각과 코드 개선을 위한 제안을 정말로 감사히 받겠어요!

즐거운 스마트 홈 만들기 되세요!