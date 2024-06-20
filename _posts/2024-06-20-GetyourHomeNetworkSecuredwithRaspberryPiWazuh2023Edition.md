---
title: "라즈베리 파이로 홈 네트워크를 안전하게 보호하세요, 와줄 보안 솔루션 2023 에디션"
description: ""
coverImage: "/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_0.png"
date: 2024-06-20 17:29
ogImage: 
  url: /assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_0.png
tag: Tech
originalTitle: "Get your Home Network Secured with Raspberry Pi , Wazuh — 2023 Edition"
link: "https://medium.com/@henrion.frn/get-your-home-network-secured-with-raspberry-pi-wazuh-2023-edition-c7ac2044df3e"
---


<img src="/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_0.png" />

환영합니다! 디지털 자산을 보호하는 것이 최우선 과제인 홈 보안 세계로 오신 것을 환영합니다. 오늘날의 연결된 환경에서는 잠재적인 위협을 감지하고 대응할 강력한 방어 시스템을 갖추는 것이 중요합니다.

그래서 저희가 여러분을 안내하고자 합니다. 라즈베리 파이를 사용하여 보안 네트워크를 구축하는 흥미로운 튜토리얼을 통해 Wazuh(놀랍도록 오픈소스 보안 모니터링 플랫폼)의 사용법을 알려드릴 것입니다. 더불어, 최신 알림과 업데이트를 위한 편리한 알림 센터를 만들기 위해 텔레그램의 힘을 활용하는 방법까지 함께 알려드릴 예정입니다.

이 튜토리얼을 완료하면 네트워크 보안을 모니터링하고 실시간 알림을 통해 정보를 파악할 수 있는 신뢰할 수 있고 예산을 절감할 수 있는 솔루션이 준비될 것입니다. 소규모 비즈니스 소유자, 홈 네트워크 애호가 또는 개인 정보와 안심을 중요시하는 분이든 상관없이 모두를 위해 준비되어 있습니다!

<div class="content-ad"></div>

이 단계별 가이드는 디지털 방어 체계를 강화하기 위해 필요한 지식과 도구를 제공할 것입니다.

라즈베리 파이를 가져오고 준비해봅시다 — 이제 네트워크를 더 안전하고 똑똑하며, 무척 멋지게 만들 시간입니다.

## 하드웨어 장비

본 튜토리얼을 실행하는 데 주요 캐릭터 없이는 꽤 어려울 것입니다:

<div class="content-ad"></div>

- 라즈베리 파이 4 모델 B — 8GB 램
- 마이크로 SD 카드 — 이상적으로 125G이지만 32G으로 충분
- 당신이 좋아하는 라즈베리 박스

📝 메모 — Wazuh는 1-25 에이전트 및 90일 감시를 위한 50GB 저장소에 최소 8GB 램이 필요하다고 발표했습니다.

# 소프트웨어 요구 사항

- 라즈베리용으로 Ubuntu Server 22.04.5 LTS (64-bit)를 선택할 것입니다.

<div class="content-ad"></div>

이미지를 설치하려면 Raspberry Pi Imager를 추천합니다. 이 도구를 사용하면 설치 프로세스가 훨씬 쉬워지며 온라인에서 찾아야할 이미지를 찾을 필요가 없습니다. 이미지 목록을 제공합니다.

이 옵션을 선택하면:

- OS 선택 ` 기타 일반 용도 OS ` Ubuntu ` Ubuntu Server 22.04.5 LTS (64비트)
- 저장소 선택 ` SD 카드 선택
- Write 버튼 클릭하기 전에 — 오른쪽 하단의 설정을 클릭하여 확인해주세요. 후에 감사할 겁니다:

`<img src="/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_1.png" />`

<div class="content-ad"></div>

여기서는 SSH 액세스 및 라스피에 대한 Wifi 액세스를 미리 설정할 수 있으며, 기본적으로 openssh-server와 같은 것을 수동으로 만들 필요가 없습니다.

🔒 고지 사항 — 보안 전문가 분들을 위해 말씀드리자면, SSH에 대한 비밀번호 인증은 공개 키로 보호된 비밀번호보다 물론 최선의 방법은 아닙니다만, 우리의 초보자들을 위해 간단하게 유지해 보겠습니다.

⭐️ 전문가 팁 — 처음에는 호스트 이름으로 "wazuh"를 선택하지 않는 것이 좋습니다. 이는 네트워크에서 누군가가 소중한 자산을 식별하는 데 도움이 될 수 있기 때문입니다.

마지막으로 쓰기 버튼을 눌러주세요, 이제 일이 정말 뜨겁게 될 것입니다 🔥!

<div class="content-ad"></div>

# 내 파이는 어디에 있나요?

파이에 새 OS를 삽입한 후, 네트워크에 연결되기까지 약간의 시간이 걸릴 수 있습니다.

네트워킹에 대해 아직 초보인 경우, 내 네트워크에서 Raspi를 찾을 수 있는 방법을 궁금해 할 수 있습니다. 음, 간단한 방법을 알려드릴게요:

```js 
nmap 192.168.1.1-254
```  

<div class="content-ad"></div>

당신의 로컬 네트워크에서 호스트 이름 "wazuh"을 찾을 수있는 모든 장치를 나열해야합니다.

# Wazuh 설치

Raspberry용 Wazuh 설치에 대해 알아야 할 몇 가지 사항이 있습니다.

우선, Wazuh는 몇 분 안에 완전한 Wazuh 팩을 설치할 수 있도록하는 사용 준비 스크립트를 제공하여 AMD 아키텍처에 대해 기본적으로 적용되는데, Raspberry는 실제로 arm을 사용합니다.

<div class="content-ad"></div>

이 표 태그를 Markdown 형식으로 바꾸세요.


Create a Markdown table:

| Header 1 | Header 2 |
|----------|----------|
| Content 1| Content 2|


<div class="content-ad"></div>

제시되는 다음 단계는 Wazuh 4.4 버전에 유효하며 다음 섹션으로 구분됩니다:

1. 전제 조건 설치하기 - `curl` 또는 `unzip`과 같은 추가 패키지가 필요하며 이는 추후 단계에서 사용됩니다. 그러나 서버에 이미 `curl` 및 `unzip`이 설치되어 있는 경우 이 단계를 건너뛸 수 있습니다.

2. Elasticsearch 설치하기 - Elasticsearch는 높은 확장성을 가진 풀 텍스트 검색 및 분석 엔진입니다.

3. Wazuh Server 설치하기 - Wazuh 서버는 배포된 에이전트로부터 데이터를 수집하고 분석합니다. Wazuh 매니저, Wazuh API 및 Filebeat을 실행합니다. Wazuh를 설정하는 첫 번째 단계는 Wazuh 리포지토리를 서버에 추가한 다음 매니저 자체를 설치하는 것입니다.

<div class="content-ad"></div>

4. Filebeat 설치 - Filebeat는 Wazuh 서버에서 경고 및 보관된 이벤트를 안전하게 Elasticsearch로 전달하는 도구입니다.

5. Kibana 설치 - Kibana는 Elasticsearch에 저장된 이벤트 및 보관된 데이터를 채굴하고 시각화하는 유연하고 직관적인 웹 인터페이스입니다.

공식 문서에서 많은 복사/붙여넣기를 할 필요가 없습니다. 그들은 문서를 이 기사보다 더 최신 상태로 유지할 것입니다. 단계별 안내서를 확인하고 적절한 패키지 관리자 및 시스템 및 서비스 관리자를 선택했는지 확인하세요.

우리 경우에는 Ubuntu Server를 사용하고 있으므로 `apt` 및 `systemctl`을 사용할 것입니다. 💻👌

<div class="content-ad"></div>

## 스파이를 배치하세요 — 개인 스파이들을

지금은 첫 번째 와주 서버를 가지고 있습니다. 아래와 비슷한 대시보드가 있습니다:

![대시보드 이미지](/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_3.png)

하지만 이제 첫 번째 에이전트를 설치할 시간입니다 🔍🕵️!

<div class="content-ad"></div>

만약 일반 시민이라면, 집에서는 MacOs 또는 Windows를 실행해야 합니다. (👋 안녕하세요 Linux 사용자 🐧). 다행히도, 모든 운영 체제에 대해 GUI 설치가 가능한 에이전트가 있습니다:

- Windows 에이전트
- MacOS 에이전트

두 경우 모두 실행 파일을 실행하면 됩니다. 그러면 끝! 사실, 지금은 에이전트가 누구에게 보고해야 하는지 이해하도록 만들어야 합니다. 요점은 Wazuh 서버가 어디에 있는지입니다. 현재 단계에서 당신에겐 매우 쉬운 과제입니다. 이미 Pi의 IP 주소를 알고 있으니까요. 가령 IP 주소가 `192.168.1.43` 라고 해봅시다.

에이전트를 등록하는 방법은 두 가지가 있습니다:

<div class="content-ad"></div>

- 대리인 구성을 통한 등록
- 매니저 API를 통한 등록

우리가 정통 자리인으로, 옵션 1을 선택할 거에요:

MacOS & Linux

1. 루트 사용자로 터미널을 열어서 Wazuh 에이전트 구성 파일인 /Library/Ossec/etc/ossec.conf을 편집하세요.

<div class="content-ad"></div>

2. ``client``server``address`` 섹션에 Wazuh 매니저 IP 주소를 추가하십시오:

```js
<client>
    <server>
      <address>MANAGER_IP</address> (여기에는 192.168.1.43을 입력)
    </server>
 </client>
```

Windows

동일한 로직이지만, 차이점은 에이전트의 위치가 다르다는 것입니다. Wazuh 에이전트 설치 디렉토리는 호스트의 아키텍처에 따라 다릅니다:

<div class="content-ad"></div>

- 64비트 시스템용 \ossec-agent\Program Files (x86)\C: 폴더에서 사용합니다.
- 32비트 시스템용 \ossec-agent\Program Files\C: 폴더에서 사용합니다.

관리자 계정을 사용하여 설치 디렉터리의 ossec.conf라는 Wazuh 에이전트 구성 파일을 수정하세요.

Wazuh에 데이터를 가져오도록 몇 분 정도 기다리시고, 여기서 출발! 대시보드가 데이터를받기 시작해야 합니다.

# 텔레그램 — 개인 알림 센터 🌟

<div class="content-ad"></div>

이제 SIEM을 갖고 있으셨으니, 이제 실시간 알림 시스템을 제공해 드릴 시간입니다. Wazuh는 Slack, Jira 또는 이메일로 통합을 제공하지만 솔직히 말해서, 집에서 보안 이벤트 알림을 받는 가장 편한 방법은 아닙니다.

## 텔레그램 봇 만들기

봇을 만드는 것이 코드 범위와 API 문서 작성에 많은 시간이 걸릴 것이라고 생각할 수 있습니다. 사실, 텔레그램에 메시지를 보내는 것만큼 쉬울 정도로 간단합니다: BotFather에게 연락하면 됩니다.

봇을 관리하는 데 도움이 될 쉬운 명령어를 확인할 수 있습니다:

<div class="content-ad"></div>


![Get your Home Network Secured with Raspberry Pi Wazuh 2023 Edition](/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_4.png)

Then create your bot, and fetch your HTTP API Token:

![Get your Home Network Secured with Raspberry Pi Wazuh 2023 Edition](/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_5.png)

## 텔레그램과의 사용자 정의 통합 관리 방법


<div class="content-ad"></div>

이 작업을 이해하는 데 중요한 두 군데가 있습니다:

- 로컬 구성: /var/ossec/etc/ossec.conf — 와주(Wazuh)의 구성이 위치한 곳입니다.
- 통합 위치: /var/ossec/integrations/ — 통합 항목을 찾을 수 있는 곳입니다.

간편하게 하기 위해, 통합 항목을 만들었으면 로컬 구성이 해당 사용자 정의 통합 항목의 존재를 알도록 이를 참조해야 합니다.

## 스크립트 요구 사항

<div class="content-ad"></div>

스크립트가 작동하려면 두 가지 요구 사항이 있어요:

- 파이썬 스크립트에서 텔레그램 API에 호출을 하기 때문에 requests 패키지를 설치해야 해요

```js
pip3 install requests
```

- 텔레그램 CHATID가 필요해요. id를 찾기 전에 봇에 작은 "안녕" 메시지를 보내 채팅을 만들어두세요.

<div class="content-ad"></div>

```js
https://api.telegram.org/bot<YOUR-BOT-TOKEN>/getUpdates
```

이렇게 하면 이와 유사한 결과가 표시됩니다:

```js
{"ok":true,"result":[{"update_id":534302469,"message":{"message_id":2,"from":{"id":38475931,"is_bot":false,"ﬁrst_name":"xxxxxx","last_name":"xxxxxx","username":"xxxxxx" ,"language_code":"ua"},
```

## 커스텀 통합용 스크립트

<div class="content-ad"></div>

더 이상 설명하지 않고, /var/ossec/integrations/로 이동하여 다음 명령을 실행해주세요:

```js
nano custom-telegram
```

다음 스크립트를 복사하여 붙여넣기 해주세요 (ChatID 변경하는 것을 잊지 마세요):

```js
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json

try:
    import requests
except Exception:
    print("모듈 'requests'를 찾을 수 없습니다. 설치: pip3 install requests")
    sys.exit(1)

CHAT_ID = "xxxxxxxx"


def create_message(alert_json):
    # 경고 정보 가져오기
    title = alert_json['rule']['description'] if 'description' in alert_json['rule'] else ''
    description = alert_json['full_log'] if 'full_log' in alert_json else ''
    description.replace("\\n", "\n")
    alert_level = alert_json['rule']['level'] if 'level' in alert_json['rule'] else ''
    groups = ', '.join(alert_json['rule']['groups']) if 'groups' in alert_json['rule'] else ''
    rule_id = alert_json['rule']['id'] if 'rule' in alert_json else ''
    agent_name = alert_json['agent']['name'] if 'name' in alert_json['agent'] else ''
    agent_id = alert_json['agent']['id'] if 'id' in alert_json['agent'] else ''

    # 마크다운으로 메시지 포맷팅
    msg_content = f'*{title}*\n\n'
    msg_content += f'_{description}_\n'
    msg_content += f'*그룹:* {groups}\n' if len(groups) > 0 else ''
    msg_content += f'*룰:* {rule_id} (레벨 {alert_level})\n'
    msg_content += f'*에이전트:* {agent_name} ({agent_id})\n' if len(agent_name) > 0 else ''

    msg_data = {}
    msg_data['chat_id'] = CHAT_ID
    msg_data['text'] = msg_content
    msg_data['parse_mode'] = 'markdown'

    # 디버그 정보
    with open('/var/ossec/logs/integrations.log', 'a') as f:
        f.write(f'MSG: {msg_data}\n')

    return json.dumps(msg_data)


# 설정 매개변수 읽기
alert_file = open(sys.argv[1])
hook_url = sys.argv[3]

# 경고 파일 읽기
alert_json = json.loads(alert_file.read())
alert_file.close()

# 요청 보내기
msg_data = create_message(alert_json)
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}
response = requests.post(hook_url, headers=headers, data=msg_data)

# 디버그 정보
with open('/var/ossec/logs/integrations.log', 'a') as f:
    f.write(f'RESPONSE: {response}\n')

sys.exit(0)
```

<div class="content-ad"></div>

(더 많은 정보가 필요하시다면 @jesusjimsa 님의 훌륭한 노력으로 스크립트를 제공하고 세부적으로 설명한 다음 기사를 확인해보세요.)

스크립트를 실행 가능하게 만들고 적절한 권한을 부여하세요:

```js
chmod 750 /var/ossec/integrations/custom-telegram
chown root:wazuh /var/ossec/integrations/custom-telegram
```

⚠️ 엄청난 경고 — 통합 이름은 반드시 "custom-"으로 시작해야 합니다. 그렇지 않으면 우리 친애하는 Wazuh가 여러분이 무엇을 기대하는지 이해하지 못할 수 있습니다.

<div class="content-ad"></div>

마지막으로 해야 할 일은 다음과 같이 /var/ossec/etc/ossec.conf를 업데이트하는 것입니다:

```js
<integration>
  <name>custom-telegram</name>
  <hook_url>https://api.telegram.org/bot<YOUR-BOT-TOKEN>/sendMessage</hook_url>
  <alert_format>json</alert_format>
</integration>
```

Wazuh 관리자를 재시작하려면 systemctl restart wazuh-manager를 실행하십시오.

재시작 후 첫 번째 알림을 볼 수 있습니다:

<div class="content-ad"></div>


![Raspberry Pi Wazuh Edition](/assets/img/2024-06-20-GetyourHomeNetworkSecuredwithRaspberryPiWazuh2023Edition_6.png)

Congratulations!

Feel free to add me on LinkedIn!
