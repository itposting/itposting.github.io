---
title: "Raspberry Pi와 TP-link Kasa로 기기 자동화하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-UseRaspberryPiandTP-linkKasatoautomateyourdevices_0.png"
date: 2024-06-23 17:10
ogImage: 
  url: /assets/img/2024-06-23-UseRaspberryPiandTP-linkKasatoautomateyourdevices_0.png
tag: Tech
originalTitle: "Use Raspberry Pi and TP-link Kasa to automate your devices"
link: "https://medium.com/geekculture/use-raspberry-pi-and-tp-link-kasa-to-automate-your-devices-9f936a6243c1"
---


**판매 프로모션 아님**

2022년이 왔고, 요즘에는 많은 스마트 홈 기기와 생태계가 있어요. TP-link의 Kasa 시스템은 오래전부터 있었는데, 파이썬 SDK가 있어서 제가 좋아해요. 또한, 에너지 모니터링이 가능한 스마트 플러그를 만든다는 점이 꽤 독창적이죠. Kasa 제품군을 라즈베리 파이(또는 다른 Linux/Windows 서버)와 결합하면 가능성이 무한해져요. 아래는 할 수 있는 일들입니다.

- [이 블로그 게시물에 표시됨] "펄스 모드"와 같이 복잡한 일정으로 장치를 실행할 수 있어요. 예를 들어, 특정 시간대에 매 15분마다 켜고 꺼지는 수도 펌프와 같은 장치를 실행할 수 있어요. 이 설정은 Kasa 스마트 콘센트에 꽂힌 Taco Hot-link 수도 펌프에 대해 구성되어 있어요.

![RaspberryPi와TP-linkKas를사용하여장치를자동화하는2024년6월23일의이미지](/assets/img/2024-06-23-UseRaspberryPiandTP-linkKasatoautomateyourdevices_0.png)

<div class="content-ad"></div>

- [이 블로그 포스트에서 보여짐] 크론을 통해 모든 일정 장치 제어하기. Kasa 앱은 멋지지만, 현재 각 장치당 31개의 일정 제한이 있습니다. 그리고 어떤 GUI 인터페이스든 복잡한 일정을 설정하려면 많은 "클릭/터치"가 필요합니다.
- [곧 블로그 포스트에서 곧] 외부 이벤트에 기반하여 장치 제어하기. 예를 들어 오늘 주식 시장이나 암호화폐의 상황, 날씨, 또는 트윗 감정에 따라 led 색상을 조절합니다.

만약 이러한 자동화가 흥미롭게 들리면 계속 읽어보세요. 처음 두 가지는 크론 잡을 통해 할 예정입니다. 세 번째는 웹사이트나 API를 주기적으로 확인하고, 그 후 장치를 적절하게 제어하기 위해 프로그램을 작성해야 합니다. 이 시나리오는 곧 미래의 블로그 포스트에서 다룰 것입니다.

- python-kasa 설치하기:

Python-kasa는 TP-link Kasa에서 사용하는 API를 감싸는 Python 래퍼입니다. 2022년 기준으로 활발하게 개발 중인 프로젝트로, 여기에서 확인하고 기여할 수 있습니다: https://github.com/python-kasa/python-kasa.

<div class="content-ad"></div>

아래 명령어를 실행하여 설치할 수 있어요.

```js
pip3 install python-kasa
```

명령이 완료되면 새 터미널 세션을 시작하거나 기존 세션을 로그아웃하고 다시 로그인한 후 kasa 명령을 실행하세요. 잘 된다면 kasa 명령을 실행하여 네트워크에 있는 장치들을 발견할 수 있을 거예요 (주의: 가끔 발견 오류가 발생할 수 있지만 대부분 무시해도 괜찮아요). 

명령어 which kasa를 실행하면 파이썬 프로그램이 설치된 위치를 보여줄 거예요. 예를 들어, 제 경우에는 /home/pi/.local/bin/kasa에 설치되어 있었는데, 이미 PATH 변수에 포함되어 있어요.

<div class="content-ad"></div>

이제 장치 별칭을 사용하여 상태를 확실히 볼 수 있도록 좀 더 구체적인 명령어를 실행하세요. 아래 명령어에서 제 장치 이름은 "워터 펌프"이며, 이를 적절히 대체해주세요.

```js
kasa --type plug --alias "워터 펌프"
```

다른 옵션을 보려면 kasa --help 명령어를 실행하세요. 예를 들어 전구의 색상을 조정하려면 다음과 같은 명령어를 실행할 수 있습니다 (자세한 내용은 다음 블로그 포스트에서 확인할 수 있습니다).

```js
kasa --type bulb --alias "컬러 램프" hsv 118 100 73
```

<div class="content-ad"></div>

2. 컨트롤러 스크립트 작성하기:

이제 장치를 켜거나 끌 수 있는 간단한 스크립트를 작성해야 합니다. 아래 스크립트를 사용할 수 있습니다. 이 파일을 저장하고 아래와 같이 적절한 권한을 부여해주세요.

```js
# 파일 작성
echo <<EOF>kasa-pump.sh
#!/bin/bash
if [[ ! -z $1 ]]; then
  operation=$1
else
  operation=state
fi
export PATH=/home/pi/.local/bin:$PATH
kasa --type plug --alias "water pump" ${operation}
EOF
# 권한 조정
sudo cp kasa-pump.sh /usr/local/bin/kasa-pump.sh
sudo chown pi:pi /usr/local/bin/kasa-pump.sh
sudo chmod +x /usr/local/bin/kasa-pump.sh
```

아래와 같은 명령어로 스크립트를 테스트해보세요. 장치가 켜지거나 꺼지는 것을 확인할 수 있어야 합니다.

<div class="content-ad"></div>


kasa-pump.sh를 켭니다
kasa-pump.sh를 끕니다


3. 크론 작업을 작성하세요:

크론 작업은 OG Linux의 하나이며 이에 대한 많은 자습서가 있습니다. 펄스 모드인 5분 켜기, 10분 끄기로 크론을 설정하는 방법에 대한 코드 스니펫을 여기에 제공하겠습니다.


# 크론 일정을 작성/업데이트하려면 이 명령을 사용하세요
crontab -e
# 펄스 모드 펌프.
*/15 5,6,7,10,11,12,13,16,17,20,21,22 * * * /usr/local/bin/kasa-pump.sh on
5,20,35,50 5,6,7,10,11,12,13,16,17,20,21,22 * * * /usr/local/bin/kasa-pump.sh off


<div class="content-ad"></div>

위의 표현은 선택된 주간 시간 동안 매 15분마다 kasa-pump.sh 명령을 실행합니다.

*/15 5,6,7,10,11,12,13,16,17,20,21,22 * * * /usr/local/bin/kasa-pump.sh on

아래의 표현은 매 시간 5, 20, 35 및 50분에 kasa-pump.sh off 명령을 실행합니다.

5,20,35,50 5,6,7,10,11,12,13,16,17,20,21,22 * * * /usr/local/bin/kasa-pump.sh off

<div class="content-ad"></div>

물론, 전 완전히 사용자 정의된 일정을 선택할 것으로 예상합니다. Cron을 사용하면 Kasa App으로 할 수 있는 것보다 더 세밀하게 일정을 조정할 수 있어요.

이젠 남은 일은 cron 작업이 성공적으로 실행되고 있는지 확인하는 것뿐이에요. 아래 명령어를 사용하여 cron에서 출력을 확인해주세요.

```js
# Cron 서비스가 제대로 실행 중인지 확인하기
sudo systemctl status cron.service
# cat /var/mail/pi | grep -i pump
```

마무리

<div class="content-ad"></div>

안녕하세요! 이 게시물에서는 Raspberry Pi에서 cron 작업을 사용하여 "펌프"라는 장치를 자동화하는 방법을 살펴보았어요. 기기가 많아지면 이 방법으로 일정을 설정하는 것이 "App"보다 쉽습니다. "touches/clicks"을 많이 할 필요가 없죠.

다음 블로그 게시물에서는 외부 이벤트에 따라 색상을 조정하는 것과 같은 더 흥미로운 것을 살펴볼 거에요.