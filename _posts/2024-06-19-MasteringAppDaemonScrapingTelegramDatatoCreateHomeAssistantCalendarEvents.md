---
title: "앱데몬 마스터하기 홈 어시스턴트 캘린더 이벤트 생성을 위해 텔레그램 데이터 수집하기"
description: ""
coverImage: "/assets/img/2024-06-19-MasteringAppDaemonScrapingTelegramDatatoCreateHomeAssistantCalendarEvents_0.png"
date: 2024-06-19 05:39
ogImage: 
  url: /assets/img/2024-06-19-MasteringAppDaemonScrapingTelegramDatatoCreateHomeAssistantCalendarEvents_0.png
tag: Tech
originalTitle: "Mastering AppDaemon: Scraping Telegram Data to Create Home Assistant Calendar Events"
link: "https://medium.com/@vmannoor/mastering-appdaemon-scraping-website-data-to-create-home-assistant-calendar-events-abccf9d190c1"
---


<img src="/assets/img/2024-06-19-MasteringAppDaemonScrapingTelegramDatatoCreateHomeAssistantCalendarEvents_0.png" />

요크라이나에서 살면서, 저희 가족은 계속되는 전력 공급 차단 문제를 해결하는 데 익숙해져 왔습니다. 계속되는 갈등과 러시아의 에너지 인프라를 향한 공격 속에서 혹독한 현실이 가정됩니다. 2022년 겨울은 특히 전기 공급이 빈번하고 긴급했던 어려운 시기였습니다. 얼마 동안은 상황이 나아졌지만, 최근 새로운 공격이 시작되면서 전기 공급 차단이 다시 복귀되었습니다.

특히 피크 시간에 전기 부하를 관리하고, 이용 가능한 전력을 가정과 기업 간에 공정하게 나눠주기 위해 당국은 일정을 마련했습니다. 소비자들은 각 그룹으로 나누어져 고정 시간대에 전력 차단을 받게 됩니다. 이러한 일정은 일반적으로 운영자들의 웹사이트나 공개 텔레그램 채널을 통해 하루 전에 발표됩니다.

<div class="content-ad"></div>

스마트 홈 애호가로서 당연히 이 정전 정보를 내 Home Assistant 시스템에 통합하고 싶었어요. 가능성을 상상해보세요: 수전중이던 전기 온수기 같은 전력 소모 가전제품을 자동으로 끄어 백업 배터리 전력을 절약하거나, 가족에게 "주의! 30분 후 정전 예정입니다! 핸드폰을 충전하는 시간이에요!" 라고 음성으로 미리 알려주기도 해봤어요.

하지만 가장 중요한 점은 이 시간표가 매일 동적으로 바뀌며 고정된 발행 시간이 없다는 것이에요. 즉, Home Assistant를 최신 상태로 유지하려면 웹사이트나 텔레그램 채널을 지속적으로 모니터링해야 한다는 것이죠.

# 해결책

제가 선택한 해결책은 Home Assistant의 로컬 캘린더를 사용하여 이 정전 시간표를 처리하는 것이었어요. 저는 이 정전 데이터를 텔레그램 채널에서 스크래핑하기로 결정했는데, 그 이유는 메시지 구조가 제 요구 사항에 딱 맞았기 때문이에요.

<div class="content-ad"></div>

홈 어시스턴트에는 내장된 스크래이프 통합 및 더 고급 HACS 구성 요소인 Multiscrape(여기서 확인하세요)가 있습니다. 하지만 이러한 도구들을 사용하여 내 문제를 해결하는 방법을 찾지 못했습니다. 아마 가능할지도 모르지만, 제가 Jinja 템플릿과 복잡한 구성에 대한 기술이 부족해서 그렇습니다. 그래서 홈 어시스턴트의 AppDaemon 통합으로 돌아가기로 결정했습니다.

공식 문서에 따르면, "AppDaemon은 홈 어시스턴트의 자동화 및 스크립팅 구성 요소를 보완하는 하위 시스템입니다." 더 간단히 말하면, 이를 통해 Python 코드(앱)를 작성하여 홈 어시스턴트를 제어하고 자동화할 수 있습니다.

다른 프로그래밍 언어에 대한 경험이 있지만, Python은 제게는 새로운 영역이었습니다. 그래서 최신 기술 센세이션이라고 불리는 ChatGPT에 의지했습니다. "이 인공지능이 분명히 도와줄 것이다!"라고 생각했지만, 솔직히 말하면 결과는 성공과 실패가 섞였습니다. 옳은 방향으로 나아갈 수 있게 도와줬지만 항상 순조롭지는 않았습니다. 가끔씩 존재하지 않는 함수와 서비스를 제안하기도 했거든요. 올바른 서비스 호출 방법, 변수 전달 방법 및 변수 형식화 방법을 이해하는 데 많은 시간을 소요했습니다.

가장 큰 골칫거리 중 하나는 AppDaemon으로부터 홈 어시스턴트 캘린더에 이미 전원 차단 일정이 있는지 확인하는 방법을 찾는 것이었습니다. 중복된 이벤트를 방지하기 위해서였죠. ChatGPT는 "calendar.get_events" 서비스를 사용하여 시간을 지정하여 이미 있는 이벤트를 확인하라고 제안했습니다. 안타깝게도, 이 방법은 AppDaemon 내에서의 제약 사항으로 작동하지 않았습니다. 여러 차례 검색하고 몇 번의 좌절한 한숨 뒤에, Markus Ressel의 매우 유익한 기사(https://markusressel.de/blog/post/calendar-integration-between-home-assistant-and-appdaemon)를 우연히 발견했습니다. 이 기사는 문제의 근본 원인을 이해하게 해주었고, 결국 캘린더 중복 없는 해결책을 찾는 데 도움이 되었습니다.

<div class="content-ad"></div>

홈 어시스턴트에 AppDaemon을 사용하여 전원 차단 스케줄을 통합하는 방법을 단계별로 안내해 드릴게요.

# 단계 1: 로컬 캘린더 설정

가장 먼저, "powercuts"라는 이름의 로컬 캘린더를 홈 어시스턴트에 생성하여 스케줄을 가져올 수 있어요. 다음 방법으로 진행할 수 있어요:

- "장치 및 서비스" 페이지로 이동합니다.
- "통합 추가"를 클릭하세요.
- "로컬 캘린더"를 검색하고 선택하세요.
- 새 캘린더를 설정하고 이름을 "powercuts"로 지정하는 안내에 따라 진행하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-MasteringAppDaemonScrapingTelegramDatatoCreateHomeAssistantCalendarEvents_1.png" />

# 단계 2: AppDaemon 설치

홈 어시스턴트 애드온 스토어로 이동하여 AppDaemon 통합을 설치하세요.

# 단계 3: AppDaemon 구성

<div class="content-ad"></div>

통합을 시작하기 전에, 앱에서 필요한 Python 패키지를 포함하도록 구성해야 합니다. 제 프로젝트에서는 datetime, requests 및 beautifulsoup4를 추가했습니다. 이러한 패키지를 AppDaemon의 구성 섹션에 추가한 후, 통합을 시작하세요.

![이미지](/assets/img/2024-06-19-MasteringAppDaemonScrapingTelegramDatatoCreateHomeAssistantCalendarEvents_2.png)

# 단계 4: 올바른 폴더 찾기

홈 어시스턴트의 상위 디렉터리로 이동합니다. 그 안에는 addon_configs라는 폴더가 있습니다. addon_configs 안에는 일반적으로 글자와 숫자의 조합 뒤에 _Appdaemon이 붙은 abcd123_Appdaemon과 같은 이름의 폴더를 찾습니다. 이 폴더 안에 apps라는 다른 폴더가 있습니다.

<div class="content-ad"></div>

# 단계 5: Python 앱 만들기

apps 폴더에 새 Python 파일(.py)을 만드세요. 여기에 코드를 작성할 거에요. 이 파일의 이름과 내부에 사용하는 클래스 이름은 중요합니다. 나중에 apps.yaml 파일에서 이들을 참조할 거니까요.

예를 들어, powercut_scraper.py라는 파일을 만들고 PowercutScraper 클래스를 사용하면, AppDaemon을 구성할 때 코드를 찾을 위치를 알려줄 때 이 이름들을 사용해야 합니다.

```js
# apps/powercut_scraper_web.py

import appdaemon.plugins.hass.hassapi as hass
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime, timedelta

class PowercutScraperWeb(hass.Hass):

    def initialize(self):
        # Configuration
        self.url = "https://t.me/s/pat_cherkasyoblenergo"
        self.queue_number = 3  # 확인해야 할 대기 번호
        self.calendar_entity = "calendar.powercuts"
        self.months_uk = {
            "січня": "01", "лютого": "02", "березня": "03", "квітня": "04", 
            "травня": "05", "червня": "06", "липня": "07", "серпня": "08", 
            "вересня": "09", "жовтня": "10", "листопада": "11", "грудня": "12"
        }
        self.current_year = datetime.now().year

        # homeassistant 이벤트 청취
        self.listen_event(self.scrape_messages, "tele_powercut_scraper_event")
        # self.run_every(self.scrape_messages, "now", 3600)
        
    def scrape_messages(self, event_name, data, kwargs):
        # 웹페이지 가져오기
        response = requests.get(self.url)
        if response.status_code != 200:
            self.error(f"웹페이지 가져오기 실패: {response.status_code}")
            return

        # 웹페이지 내용 파싱
        soup = BeautifulSoup(response.content, 'html.parser')
        messages = soup.find_all('div', class_='tgme_widget_message_text')

        for message in messages:
            date = self.extract_date(message.get_text())
            schedules = self.extract_schedules(message.get_text())
            if date and schedules:
                self.update_calendar(date, schedules)

    
    def extract_schedules(self, message):
        pattern = re.compile(r'(\d{2}:\d{2}-\d{2}:\d{2})\s*([0-9\sта,.;:!?]*черг[а|и])')
        matches = pattern.findall(message)
        relevant_schedules = []

        for match in matches:
            time_range = match[0]
            queue_info = match[1]

            # queue_info에서 모든 숫자 추출
            queue_numbers = re.findall(r'\d+', queue_info)

            # 대기 번호 중 하나라도 self.queue_number와 일치하는지 확인
            if any(int(queue_number) == self.queue_number for queue_number in queue_numbers):
                relevant_schedules.append(time_range)
        self.log(relevant_schedules)
        return relevant_schedules
    
    def extract_date(self, message):
        date_pattern = re.compile(r'(\d{2})\s([а-я]+)')
        match = date_pattern.search(message)
        if match:
            day = match.group(1)    
            month_uk = match.group(2)
            if month_uk in self.months_uk:
                month = self.months_uk[month_uk]
                return f"{day}.{month}.{self.current_year}"
        return None

    def update_calendar(self, date, time_slots):
        # 오늘 이후인지 확인하는 날짜 비교
        date_obj = datetime.strptime(date, "%d.%m.%Y")
        today = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)
        if date_obj >= today:
            # 시간 슬롯 결합
            combined_slots = self.combine_time_slots(date, time_slots)
            for slot in combined_slots:
                start_time, end_time = slot.split('-')
                event_start = datetime.strptime(f"{date} {start_time}", "%d.%m.%Y %H:%M").strftime("%Y-%m-%dT%H:%M:%S")
                event_end = datetime.strptime(f"{date} {end_time}", "%d.%m.%Y %H:%M").strftime("%Y-%m-%dT%H:%M:%S")

                self.call_service(
                    "script/create_powercut_calendar_events", 
                    start_date_time=event_start, 
                    end_date_time=event_end
                    
                )
        else:
            self.log(f"과거 날짜에 대한 캘린더 업데이트 건너뛰기: {date}")

    def combine_time_slots(self, date, time_slots):
            if not time_slots:
                self.log(f"{date}에 결합할 시간 슬롯이 없어요.")
                return []

            # 시간 슬롯 구문 분석 및 정렬
            slots = []
            for slot in time_slots:
                start_time, end_time = slot.split('-')
                if end_time == "24:00":
                    end_time = "23:59"
                start = datetime.strptime(f"{date} {start_time}", "%d.%m.%Y %H:%M")
                end = datetime.strptime(f"{date} {end_time}", "%d.%m.%Y %H:%M")
                slots.append((start, end))

            slots.sort()

            # 겹치거나 연속된 시간 슬롯 병합
            merged_slots = []
            current_start, current_end = slots[0]

            for start, end in slots[1:]:
                if start <= current_end:
                    # 현재 시간 슬롯 확장
                    current_end = max(current_end, end)
                else:
                    # 겹침 없음, 현재 시간 슬롯 추가 및 새로 시작
                    merged_slots.append((current_start, current_end))
                    current_start, current_end = start, end

            # 마지막 시간 슬롯 추가
            merged_slots.append((current_start, current_end))

            # 병합된 시간 슬롯을 다시 문자열로 변환
            combined_slots = [f"{start.strftime('%H:%M')}-{end.strftime('%H:%M')}" for start, end in merged_slots]
            return combined_slots
```

<div class="content-ad"></div>

# 단계 6: apps.yaml에서 앱 구성하기

apps 폴더 안에 apps.yaml 파일이 있을 것입니다. 이 파일은 AppDaemon에게 사용자 정의 앱에 대해 알려줍니다. 다음과 같이 항목을 추가해보세요:

```js
powercut_scraper_web:
  module: powercut_scraper_web  # .py 확장자를 제외한 파일명입니다
  class: PowercutScraperWeb # 파일 내부의 클래스 이름입니다
```

이 구성은 AppDaemon에 앱을 연결하여 코드를 찾고 실행할 위치를 알려줍니다.

<div class="content-ad"></div>

# 단계 7: 코드 흐름 이해하기

- 코드 트리거: 코드는 "tele_powercut_scraper_event"라는 이벤트에 의해 트리거되며, 이 이벤트는 Multiscrape 구성 요소를 사용하여 생성된 이진 센서가 켜졌을 때 발생합니다. 제가 이 센서를 이전에 설정했으므로 트리거로 사용했습니다. 원하는 경우 앱을 몇 분마다 실행하도록 예약할 수도 있습니다.
- 텔레그램 채널 스크랩: 코드는 텔레그램 채널의 메시지를 통해 날짜와 일정을 찾습니다. 둘 다 발견되면 캘린더를 업데이트하는 함수를 호출합니다.
- 캘린더 업데이트: 이 함수는 먼저 오늘보다 이전인 전력 공급 차단 날짜를 무시합니다 (과거 이벤트에 대해 걱정할 필요가 없습니다). 관련 메시지의 경우 연속된 시간 단위 슬롯을 더 큰 블록으로 결합합니다 (일정은 1시간 간격으로 제공됨).

![이미지](/assets/img/2024-06-19-MasteringAppDaemonScrapingTelegramDatatoCreateHomeAssistantCalendarEvents_3.png)

- 중복 확인: 이 단계에서 이상적으로는 calendar.get_events 서비스를 호출하여 캘린더에 이미 이벤트가 있는지 확인해야 합니다. 그러나 이전에 언급했듯이 AppDaemon은이 서비스를 지원하지 않습니다. 따라서 필요한 경우 기존 항목을 확인하고 필요한 경우 새 항목을 만드는 Home Assistant 스크립트를 호출함으로써 이 문제를 해결했습니다.

<div class="content-ad"></div>

요약하면, AppDaemon 앱은 텔레그램 채널에서 데이터를 스크랩하고 정리한 후 HA에 관련 시간 슬롯을 전송하여 캘린더에 새 이벤트를 생성합니다. 아래는 이진 센서와 스크립트 코드입니다:

```js
  multiscrape:
    - name: Cherkasy powercut alert
      resource: https://t.me/s/pat_cherkasyoblenergo
      scan_interval: 30
      list_separator: "|||"
      binary_sensor:
        - unique_id: energy_sensor_powercut_alert_oblenergo
          name: Cherkasy powercut alert
          icon: mdi:transmission-tower-export
          device_class: power
          select_list: ".js-message_text"
          value_template: >-
            { set message = value.split("|||") | last | lower }
            { "годин" in message and "відсутност" in message and "електропостача" in message}
          attributes:         
            - name: latest_message_date
              select_list: ".js-message_text"
              value_template: >-
                { set message = value.split('|||') | last }
                { set date_match = message | regex_findall_index("(\d{1,2}\s(?:січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня))", 0) }
                { set months_uk = {
                            'січня': '01', 'лютого': '02', 'березня': '03', 'квітня': '04', 
                            'травня': '05', 'червня': '06', 'липня': '07', 'серпня': '08', 
                            'вересня': '09', 'жовтня': '10', 'листопада': '11', 'грудня': '12'
                          } }
                { if date_match }
                  { set day = date_match.split(' ')[0] }
                  { set month_uk = date_match.split(' ')[1] }
                  { set month = months_uk[month_uk] }
                  { set year = now().year }
                  {  as_datetime(strptime('{}-{}-{} 00:00:00'.format(year, month, day),'%Y-%m-%d %H:%M:%S')) } 
                { else }
                  { 'Date not found' }
                { endif }  
            - name: latest_message
              select_list: ".js-message_text"
              value_template: >
                { value.split('|||') | last | regex_findall('\d{2}:\d{2}-\d{2}:\d{2}\s*[0-9\sта,.;:!?]*черг[а|и]')| join('\n') }
```

```js
  script:
    create_powercut_calendar_events:
      mode: parallel
      sequence:
        - service: calendar.get_events
          target:
            entity_id: calendar.powercuts
          data:
            start_date_time: "{ start_date_time }"
            end_date_time: "{ end_date_time }" 
          response_variable: agenda
        - if: "{ not agenda['calendar.powercuts'].events| map(attribute='summary')| list| count > 0 }" 
          then:
            - service: calendar.create_event
              target:
                entity_id: calendar.powercuts
              data:
                summary: Power cut
                description: >-
                  Scheduled Powercut data from Oblenergo telegram channel, auto created from appdaemon script
                start_date_time: "{ start_date_time }"
                end_date_time: "{ end_date_time }"      
```

# 단계 8: 자동화

<div class="content-ad"></div>

Appdaemon 스크립트를 트리거하는 자동화:

```yaml
    - alias: 새로운 전원 공급 일정 - 캘린더에 추가
      id: "vdgadsfwerwfsdgasdsdxxkOOcKAo"
      initial_state: "on"
      trigger:
        - platform: state
          entity_id: binary_sensor.energy_sensor_powercut_alert_oblenergo
          attribute: latest_message
        - platform: time
          at: '23:45:00'
        - platform: homeassistant
          event: start
      mode: single
      max_exceeded: silent
      action:
        - event: tele_powercut_scraper_event
          event_data:
            date: "{ now().strftime('%Y-%m-%d') }"
```

이 정보를 자동화하는 방법의 예시입니다:

```yaml
    - alias: "전원 정전 알림"
      id: "automation_notification_home_powercut_notification"
      trigger:
        - platform: calendar
          id: "5_minute"
          event: start
          entity_id: calendar.powercuts
          offset: -00:05:00
        - platform: calendar
          id: "15_minute"
          event: start
          entity_id: calendar.powercuts
          offset: -00:15:00
        - platform: calendar
          id: "30_minute"
          event: start
          entity_id: calendar.powercuts
          offset: -00:30:00
      condition:
        condition: and
        conditions:
          - condition: state
            entity_id: input_boolean.powercuts
            state: "on"
      mode: single
      max_exceeded: silent
      action:
        - service: notify.telegram_home
          data:
            title: "⚡*전력 공급 중단*"
            message: "{ trigger.id.split('_')[0] } 분 내에 전력 공급이 중단됩니다."
```

<div class="content-ad"></div>

# 결론

여러분 중 많은 분들이 국가에서 정전이나 미사일 경보로 걱정할 필요가 없을 수도 있습니다. 하지만 저는 이 기사를 공유하고 싶었습니다. 왜냐하면 제가 소개한 방법과 코드는 여러분의 스마트 홈에서 더 복잡한 자동화를 만드는데 영감을 줄 수 있기 때문입니다. 에너지 사용을 피크 시간에 관리하거나 정교한 아침 루틴을 조정하는 등, AppDaemon은 여러분의 스마트 홈을 더 똑똑하게 만드는 강력한 도구를 제공합니다.

그러니 이러한 도전 없이 사는 행운한 분들이라도, 여기서 유용한 아이디어를 찾아서 여러분의 홈 자동화 프로젝트를 향상시키는 데 도움이 되기를 바랍니다. 결국, 스마트 홈은 우리가 창의적으로 해결책을 찾는 한에만 똑똑할 뿐입니다.

즐거운 자동화!