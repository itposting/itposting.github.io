---
title: "예제와 함께 배우는 Zabbix 외부 검사 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ZabbixExternalchecksbyexample_0.png"
date: 2024-06-22 18:20
ogImage: 
  url: /assets/img/2024-06-22-ZabbixExternalchecksbyexample_0.png
tag: Tech
originalTitle: "Zabbix External checks by example"
link: "https://medium.com/@r.szulist/zabbix-external-checks-by-example-b9d8bd5ebaaf"
---


## 샤오미 미지아 센서에서 데이터 가져오기

얼마 전에 샤오미 미지아에서 온도 및 습도 센서를 구입했어요. 정확히 말하면 LYWSD03MMC예요. 빨리 매우 유용하다는 것이 증명되었지만, 측정값을 보기 위해 걸어가야 한다는 것은 상당히 귀찮았어요. 고민거리가 많은 세상이죠.

물론 휴대폰 앱을 사용하거나 샤오미 홈 허브를 구입할 수도 있겠지만, 그런 건 재미가 없잖아요? 대신 내가 이미 가지고 있는 것을 활용하기로 결정했어요 — 제 자신의 자비스 인스턴스. 그래서 여기 있어요.

## 외부 점검

<div class="content-ad"></div>

외부 검사(가끔 "외부 스크립트"라고 함)는 에이전트 미리 설치 방식의 모니터링 방법으로, Zabbix 에이전트가 필요하지 않습니다. 대신에 특정 스크립트가 호스트 설정에 따라 서버나 프록시 수준에서 실행됩니다. Zabbix가 스크립트를 실행하고 표준 출력에 표시될 것들을 수집합니다. 종료 코드는 고려되지 않습니다. 이 말은 스크립트가 중요한 것만을 표준 출력에 작성해야 한다는 것을 의미합니다.

## 스크립트 준비

의외로 누군가가 이 센서에서 데이터를 읽을 수 있는 스크립트를 이미 만들어 놓았습니다. GitHub에서 설치 지침과 함께 찾을 수 있지만, 완벽함을 위해 다음 명령어를 실행해야 합니다:

```js
# apt install python3 bluez python3-pip wget
# pip3 install bluepy requests
# wget https://raw.githubusercontent.com/JsBergbau/MiTemperature2/master/LYWSD03MMC.py -O /tmp/LYWSD03MMC.py
```

<div class="content-ad"></div>

이 단계를 완료한 후에는 스크립트를 적절한 디렉토리에 배치해야 합니다. 정확한 경로는 서버 및 프록시 구성 파일에서 찾을 수있는 ExternalScripts 설정에 따라 다릅니다 (기본적으로 /usr/local/share/zabbix/externalscripts이지만 저는 /usr/lib/zabbix/externalscripts/를 사용하는 경향이 있습니다). External checks는 Zabbix 설치 중에 생성 된 zabbix 사용자로 실행됩니다. 모두 함께 넣어 봅시다.

```js
# cp /tmp/LYWSD03MMC.py /usr/lib/zabbix/externalscripts/
# chown zabbix:zabbix /usr/lib/zabbix/externalscripts/*
# chmod ug+x /usr/lib/zabbix/externalscripts/LYWSD03MMC.py
```

zabbix 사용자가 어떠한 문제없이 실행할 수 있는지 확인하는 것이 중요합니다. Python 스크립트의 경우 대부분의 경우에 잘 작동하지만 쉘 스크립트의 경우 항상 그렇지는 않습니다. 일부 명령은 상위 권한이 필요할 수 있습니다.

장치의 실제 블루투스 주소로 `BT_MAC`을(를) 대체하는 것이 중요합니다. 찾는 가장 쉬운 방법은 Xiaomi Home 앱을 사용하는 것이며 센서를 등록하여 블루투스 연결을 활성화해야 합니다.

<div class="content-ad"></div>

```js
# cd /usr/lib/zabbix/externalscripts/
# sudo -u zabbix ./LYWSD03MMC.py --device <BT_MAC> -c 1
---------------------------------------------
MiTemperature2 / ATC Thermometer version 3.1
---------------------------------------------
<BT_MAC>에 연결을 시도 중
온도: 25.01
습도: 73
배터리 전압: 2.846 V
배터리 레벨: 75
측정값이 1개 수집되었습니다. 잠시 후에 종료됩니다.
```

위의 단편과 유사한 내용을 확인할 수 있어야 합니다. 만약 실패한다면 문제를 해결하고 나서 진행하십시오. 또 다른 고려해야 할 점은 스크립트가 실행되는 시간입니다. 스크립트 실행 시간을 측정하고 실행 시간보다 약간 더 긴 값으로 Timeout 매개변수를 설정해야 합니다. 기본적으로 Timeout 매개변수는 3초입니다. 

```js
# time ./LYWSD03MMC.py --device <BT_MAC> -c 1
---------------------------------------------
MiTemperature2 / ATC Thermometer version 3.1
---------------------------------------------
<BT_MAC>에 연결을 시도 중
온도: 25.0
습도: 73
배터리 전압: 2.846 V
배터리 레벨: 75
측정값이 1개 수집되었습니다. 잠시 후에 종료됩니다.
실제    0분 14.956초
사용자    0분 3.670초
시스템     0분 0.373초
```

15초가 걸렸다는 것을 알 수 있습니다. 스크립트가 fluke가 아니라 실행 시간이 실행마다 일관되게 나오는지 확인하기 위해 스크립트를 여러 번 실행하는 것이 좋습니다. 실행 시간이 30초를 넘어가면 최대 Timeout 값이 정확히 30초이므로 운이 좋지 못한 상황입니다. 사용자 정의 Zabbix 설치를 사용할 수 있지만, 스크립트를 최적화하거나 Zabbix 트랩을 사용하는 것이 좋은 해결책입니다.


<div class="content-ad"></div>

## 항목 설정

이 작업을 완료하면 템플릿 디자인으로 넘어갈 수 있습니다. 우리의 출력물이 평문인 만큼, 우리는 정규 표현식 전처리를 사용하는 종속 항목을 만들 것입니다. 그러나 먼저 외부 검사 자체를 생성해야 합니다.

![image](/assets/img/2024-06-22-ZabbixExternalchecksbyexample_0.png)

위 그림에서 볼 수 있듯이, 항목 키는 스크립트의 이름과 확장자를 포함합니다. 그런 다음 대괄호 안에는 스크립트에 전달되는 모든 매개변수가 포함됩니다. 해당 데이터는 종속 항목에서 추출될 것이므로 이 항목에 대한 히스토리를 저장하지 않습니다. 예를 들어, 온도 측정 항목은 다음과 같이 구성됩니다.

<div class="content-ad"></div>

`<img src="/assets/img/2024-06-22-ZabbixExternalchecksbyexample_1.png" />`

이 방법으로는 Master 항목에서 모든 데이터를 그대로 복사합니다. 특정 부분만 추출하려면 전처리를 사용해야 합니다. 이 경우 캡처 그룹과 함께 정규식을 사용합니다.

`<img src="/assets/img/2024-06-22-ZabbixExternalchecksbyexample_2.png" />`

# 결론

<div class="content-ad"></div>

이 기사에서는 Zabbix 기능 중 하나인 '외부 체크'에 대해 자세히 살펴보았습니다. 우리가 볼 수 있듯이, 이를 사용하여 다양한 소스에서 데이터를 수집할 수 있습니다. 그러나 지나치게 남용하지 않도록 주의하세요. 이는 Zabbix 성능에 상당한 감소를 일으킬 수 있습니다.

언제든지 궁금한 점이 있으시면 말씀해주세요. 전체 템플릿은 여기서 찾을 수 있습니다.