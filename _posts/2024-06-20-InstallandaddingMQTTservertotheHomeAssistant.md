---
title: "홈 어시스턴트에 MQTT 서버를 설치하고 추가하는 방법"
description: ""
coverImage: "/assets/img/2024-06-20-InstallandaddingMQTTservertotheHomeAssistant_0.png"
date: 2024-06-20 17:36
ogImage: 
  url: /assets/img/2024-06-20-InstallandaddingMQTTservertotheHomeAssistant_0.png
tag: Tech
originalTitle: "Install and adding MQTT server to the Home Assistant"
link: "https://medium.com/@che-adrian/install-and-adding-mqtt-server-to-the-home-assistant-7272454fdc59"
---


만약 홈 어시스턴트 인스턴스가 있으면 Mosquitto가 유용할 수 있습니다. Mosquitto를 사용하면 이 프로토콜을 지원하는 여러 IoT 장치를 연결할 수 있습니다. 예를 들어, OSS 펌웨어를 실행할 수 있는 Tasmota, ESPHome, OpenBeken 등이 있습니다.

나는 라즈베리 파이에서 홈 어시스턴트를 사용하고 있어서 이를 몇 단계만 거쳐 쉽게 설정하는 방법을 보여줄게요. 만약 아직 홈 어시스턴트를 설치하지 않았다면, 이 문서를 확인하세요.

## MQTT 서버 설치

이 과정은 간단하며, 터미널에 간단한 명령어 한 줄로 설치할 수 있어요:

<div class="content-ad"></div>

```js
sudo apt-get install mosquitto mosquitto-clients 
```

이게 전부에요 🐧.

이제 Mosquitto 브로커에 대한 액세스를 보호하는 것이 중요합니다.

## MQTT 시작 및 부팅 시 추가

<div class="content-ad"></div>

지금 MQTT를 시작할 수 있고, 장치 부팅 후 내장 서비스를 사용할 수 있습니다:

```js
sudo systemctl enable mosquitto
sudo systemctl start mosquitto
```

## 사용자 및 비밀번호 생성

mosquitto_passwd를 사용하여 새로운 사용자 이름과 비밀번호를 만들 수 있습니다. YOUR_MQTT_USER를 사용하려는 사용자로 대체해주세요.

<div class="content-ad"></div>

```js
sudo mosquitto_passwd -c /etc/mosquitto/passw YOUR_MQTT_USER
```

암호를 설정하고 기억하세요.

이제 익명 사용자를 비활성화해야 합니다:

```js
echo -e "allow_anonymous false\npassword_file /etc/mosquitto/passw" | sudo tee -a sudo nano /etc/mosquitto/mosquitto.conf
```

<div class="content-ad"></div>

이제 Mosquitto 브로커를 다시 시작해주세요:

```js
sudo systemctl restart mosquitto
```

좋아요, 이제 Home Assistant를 구성해보겠습니다!

## Home Assistant MQTT 설정

<div class="content-ad"></div>

내장된 HASS 통합을 사용하여 MQTT 브로커에 쉽게 연결할 수 있어요. "설정" - "장치 및 서비스" - "+ 통합 추가"로 이동하신 후 MQTT를 목록에서 찾아보세요. MQTT 브로커 세부 정보를 사용하여 연결하세요.

![image](https://miro.medium.com/v2/resize:fit:1400/1*KCF19chIplt1xq_1AQr2bw.gif)

이제 Mosquitto 호환 장치를 홈 어시스턴트에서 사용할 수 있어요 👌.

## localhost 외부에서 듣기

<div class="content-ad"></div>

만약 라즈베리 파이 밖에서 MQTT를 사용하여 LAN 또는 인터넷에서 IoT 장치를 설정하려는 경우, Mosquitto 브로커가 아웃바운드 연결 요청을 수신하도록 설정해야 합니다:

```sh
echo -e "listener 1883" | sudo tee -a sudo nano /etc/mosquitto/mosquitto.conf
```

## Tasmota 예시

Tasmota를 실행 중인 장치가 있다면 Home Assistant에서 MQTT를 사용하여 해당 장치를 제어할 수 있습니다. Tasmota에서 MQTT를 설정하려면 "Configuration" - "Configure MQTT"로 이동한 후 MQTT 브로커 데이터를 추가하십시오.

<div class="content-ad"></div>

라즈베리 파이의 로컬 네트워크 IP로 YOUR_MQTT_DEVICE_IP를 대체하고, 위에서 사용한 YOUR_MQTT_USER 및 YOUR_PASSWORD로 대체하십시오.

이후에는 Tasmota 엔티티가 홈 어시스턴트 내에서 자동으로 나타날 것입니다.

만약 나타나지 않는다면 "통합 추가"를 눌러 추가하십시오. MQTT 연결이 제대로 작동하는지 확인하려면 Tasmota "콘솔"을 확인하십시오.

이제 Tasmota 엔티티 ID를 알고 있다면 대시보드에 버튼을 추가할 수 있습니다.

<div class="content-ad"></div>

## 수동 통합

다른 IoT 장치는 수동 구성이 필요할 수 있으며 MQTT 통합 내에 나타날 수도 있습니다. 또는 MQTT 서비스를 사용하여 스크립트 및 자동화 내에서 데이터를 송수신할 수 있습니다.

![이미지](/assets/img/2024-06-20-InstallandaddingMQTTservertotheHomeAssistant_0.png)

스크립트에서 사용할 수 있는 발행 및 수신 MQTT 서비스가 모두 있어서 HASS 인터페이스에 버튼을 추가할 수 있습니다.

<div class="content-ad"></div>

## MQTT 클라이언트로 테스트해보기

Windows/Linux 또는 다른 기계에서 Mosquitto 브로커를 테스트하기 위해 MQTTX를 사용할 수 있습니다. [여기](링크)에서 다운로드할 수 있어요.

장치 데이터를 사용해보세요. Raspberry Pi IP인 192.168.0.190을(를) 교체해주세요.

## 대박!

<div class="content-ad"></div>

이제 디바이스와 홈 어시스턴트에서 MQTT를 구성하는 방법을 알게 되셨군요.

⚠️ 인터넷을 통해 이 MQTT 서버를 직접 노출하려는 경우, TLS / SSL로 보호되지 않았으므로 악의적인 사용자가 로그인 자격 증명을 읽을 수 있습니다. 일반적인 것과 다른 사용자 이름 및 비밀번호를 사용하면 상대적으로 안전합니다. 그러나 그래도 악의적인 사용자가 당신의 디바이스를 제어하고, 네트워크 전체에 액세스할 수 있는 악성 코드를 주입할 수도 있습니다. 언제나 IoT 장치를 최신으로 유지하세요!

MQTT에 TLS / SSL을 빠르게 추가할 수 있지만 모든 IoT 장치와 호환되지 않을 수 있으므로 보다 안전하게 로컬에 유지하고 MQTT 포트를 인터넷에 노출하지 마세요.

이것은 홈 어시스턴트를 통해 MQTT 장치를 인터넷을 통해 제어할 수 없다는 뜻인가요? 아니요! 당신의 HASS 인스턴스는 Mosquitto 브로커와 별도입니다. 브로커는 로컬 네트워크에서만 IoT 장치를 처리하고 홈 어시스턴트와 인터페이스할 것이며, 암호화된 연결을 통해 인터넷에 노출될 수 있습니다.

<div class="content-ad"></div>

이 목록에서 더 많은 관련 기사를 찾을 수 있어요: