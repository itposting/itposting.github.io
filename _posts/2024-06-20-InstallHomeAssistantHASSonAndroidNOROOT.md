---
title: "안드로이드 기기에 홈 어시스턴트 Home Assistant, HASS 설치하기 루팅 없음"
description: ""
coverImage: "/assets/img/2024-06-20-InstallHomeAssistantHASSonAndroidNOROOT_0.png"
date: 2024-06-20 16:21
ogImage: 
  url: /assets/img/2024-06-20-InstallHomeAssistantHASSonAndroidNOROOT_0.png
tag: Tech
originalTitle: "Install Home Assistant (HASS) on Android (NO ROOT)"
link: "https://medium.com/@lucacesarano/install-home-assistant-hass-on-android-no-root-fb65b2341126"
---


이 구성은 루팅을 하지 않고 안드로이드폰에 Home Assistant (HASS)를 설치하는 데 매우 유용합니다. 중앙 서버로 가정 자동화를 제어하는 데 매우 유용하며 쉽게 이동하고 수정할 수 있습니다. 저는 예전 폰 (샤오미 Mi 4C, 적어도 안드로이드 7.0)을 백업으로 사용하고 원활하게 작동하고 있어요 :).

참고: Sijuissacp 님이 최소 버전이 안드로이드 7.0이어야 한다고 응답했습니다. 제가 분명히 확신은 할 수 없지만 언급할 가치가 있습니다.

시작해 봅시다:

우선 제안드리는 것은 안드로이드폰을 전용으로 사용하는 것입니다. 따라서 언제나 충전 중이어야 하며 필요에 따라 화면을 켜 놔야 할 수도 있습니다 (저는 온도 데이터 등을 표시할 때 사용합니다). 이를 필요로 하지 않는다면, 충전만 하면 됩니다.

<div class="content-ad"></div>

위 작업을 수행하는 방법은 전원이 항상 연결된 상태에서 (놀랍죠?) 안드로이드 개발자 옵션에서 "충전 중에 화면 켜짐 유지" 옵션을 활성화하는 것입니다.

이제 핸드폰을 가져와서 시작해 봅시다.

참고: 여기저기에서 복사하여 붙여 넣었지만 제 개인적인 수정이 있습니다. 이를 구현하는 데 도움을 준 모든 웹사이트에게 크레딧을 드립니다. 저작자 분들 중 이에 대해 이상한 감정을 가지신 분들이 있다면 메시지를 남겨주시면 수정하겠습니다 ;).

# 안드로이드에서 HASS 가이드

<div class="content-ad"></div>

다음이 설치됩니다:

- Homeassistant
- Mosquitto MQTT Broker (필요하다면)

## 준비 사항:

- F-droid를 설치하세요 (무료 및 유용한 콘텐츠가 가득한 대체 스토어)
- F-droid에서 Termux를 설치하세요
- F-droid에서 Termux:API를 설치하세요
- [선택 사항] F-droid에서 Hacker's Keyboard를 설치하세요

<div class="content-ad"></div>

**노트:** 이 앱들은 Play Store에서도 사용 가능합니다. 다운로드할 위치는 당신의 선택입니다.

## 안내:

일반적인 규칙으로 항상 HASS 부팅 시 로그인을 확인하여 의존성 버전이 바뀌었는지 이해해야 합니다(예: PyNaCl). 때로는 특정 버전이 필요할 수 있으며 더 높은 버전이 아닌 경우도 있습니다(PyNaCl의 경우와 같이).

### 1. Termux 앱을 시작하세요;

<div class="content-ad"></div>

### 2. 다음 명령어를 순서대로 입력하세요:

- pkg update
- apt-get update
- pkg upgrade
- pkg install python
- pkg install nano
- pkg install mosquitto ('package not found'이라면 다시 'pkg update'를 실행한 후 다시 시도해보세요)
- pkg install nodejs
- pkg install openssh
- pkg install termux-api
- apt install make
- pip install PyNaCl==1.3.0 (차를 마시러 가거나, 오랜 시간이 걸릴 거에요) (1.3.0은 바뀔 수 있지만, HASS가 요구한 정확한 버전이 필요해서 그렇게 했어요)
- pip install aiohttp_cors
- pip install homeassistant

### 4. 환경 시작:

- mosquitto

<div class="content-ad"></div>

만약 Mosquitto를 중지해야 한다면 ‘ctrl +c’ 또는 ‘볼륨 다운 +c’를 누릅니다.

이제 termux에서 새 세션을 열고 Home Assistant를 다음 명령어로 부팅해보세요:

- hass -v (-v는 상세 모드를 의미하며 부팅 중에 무슨 일이 벌어지는지 이해하는 데 유용합니다)

설치가 완료될 때까지 기다린 다음 HA를 중지할 때는 ctrl +c 또는 볼륨 다운 + c를 누르고 다시 실행하세요.

<div class="content-ad"></div>

http://localhost:8123 웹 페이지에 접속할 수 있습니다.

다른 컴퓨터에서 접속하려면 포트 8123을 포트 전송하고 해당 장치에 대한 정적 IP 주소를 설정할 수 있습니다.

### EXTRA:

<div class="content-ad"></div>

#### 환경을 자동으로 부팅하려면:

[진행 중] 안드로이드가 시작될 때 모든 것을 부팅해야한다면 termux를 열고 'mosquitto' 및 'hass' 명령을 입력하면 되지만 termux::boot(Play 스토어에서 제공됨)를 사용하여 자동으로 수행할 수도 있습니다.

또한 그것을 달성하는 방법인 pm2 옵션이 있지만, 그것에 대해 잘 모르겠습니다.

가능한 빨리 가이드를 작성하겠습니다. Boyscout 약속할게요.

<div class="content-ad"></div>

#### 휴대전화를 OPEN-SSH 하려면:

HASS 커뮤니티에 꼭 필요한 내용입니다:

먼저 이 안내를 따르세요 https://ibnuhx.com/remote-ssh-to-android-termux

그리고 로컬과 원격 간 파일을 복사하기 위해 다음을 사용할 수 있습니다:

<div class="content-ad"></div>

- scp -r -P 8022 /path/local/dir user@remotehost:/path/remote/dir

#### HASS 원격으로 액세스하기 위해 DNS 서버 설정

https://192.168.XXX.XXX와 같은 IP를 사용하여 액세스하는 대신, https://mysweethass.com와 같은 간단한 주소를 사용하여 웹 사이트에 액세스할 수 있습니다.

이를 위해 https://www.noip.com/에서 무료 동적 DNS 주소를 얻을 수 있는 웹 사이트인 도메인 이름 주소가 필요합니다.

<div class="content-ad"></div>

해당 링크를 참고하여 주소를 생성해 보세요: [https://www.noip.com/support/knowledgebase/getting-started-with-no-ip-com/](https://www.noip.com/support/knowledgebase/getting-started-with-no-ip-com/)

그런 다음, 제공업체 라우터를 사용하여 설정할 수 있습니다. 대부분의 라우터는 동적 DNS 섹션을 가지고 있어 no-ip를 사용하여 생성한 주소와 핸드폰의 IP 주소간의 링크를 설정할 수 있습니다.

라우터마다 설정이 다를 수 있으므로 일반 가이드를 제공해 드릴 수는 없네요.

제공업체 라우터를 구성하는 대안으로 핸드폰에 무료 DNS 동적 앱을 설치하여 직접 설정할 수도 있습니다. 이 방법으로 라우터 구성 과정을 우회할 수 있습니다. [https://play.google.com/store/search?q=dns+update](https://play.google.com/store/search?q=dns+update)

<div class="content-ad"></div>

도움이 필요하면 언제든 연락해 주세요.

수정: 의미 있는 문제 해결을 위해 이 미디엄의 댓글을 확인해보세요. Pillow 설치에 문제가 생기는 것으로 보이는데, Jamie가 발표한 잠재적인 해결책이 있습니다.

업데이트: 독자인 모하메드가 'pip install netdisco' 명령을 사용하여 Pillow 종속성을 해결해야 할 수 있다는 사실을 알려주었습니다.