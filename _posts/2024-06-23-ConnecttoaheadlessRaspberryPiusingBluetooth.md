---
title: "블루투스를 사용하여 헤드리스 라즈베리 파이에 연결하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_0.png"
date: 2024-06-23 18:13
ogImage: 
  url: /assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_0.png
tag: Tech
originalTitle: "Connect to a headless Raspberry Pi using Bluetooth"
link: "https://medium.com/@tomw3115/connect-to-a-headless-raspberry-pi-using-bluetooth-0e61c05e1b68"
---


<img src="/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_0.png" />

헤드리스 Raspberry Pi 기반 솔루션을 배포하는 데 있어서의 한 가지 어려움은 고객 네트워크에 라우터 액세스 없이 장치를 구성하는 것입니다. 종종 기계의 무선 설정을 변경해야 하지만 클라이언트 환경에서 설정을 변경할 수 있는 방법이 없습니다. 한 가지 솔루션은 장치에 Bluetooth 시리얼 포트를 구성하여 PC에서 실행 중인 Putty SSH 세션과 통신을 허용하는 것입니다. 연결이 설정되면 Bluetooth 검색을 끄어 다른 사람이 심지어 인식하지 못하도록 할 수 있습니다. 기계에서 액세스 포인트를 여는 것보다 안전하며 훨씬 간단합니다. 사실, 이 솔루션을 사용하려면 설치할 새 소프트웨어가 필요하지 않습니다. 대부분의 Bluetooth 기능을 포함하는 빌드와 함께 제공되는 소프트웨어의 구성만 필요합니다. 이를 Raspberry Pi 3+ 및 OrangePi Zero 3에서 시험했습니다. 한 가지 주의할 점은, 이 솔루션은 미래 릴리스에서 폐기될 예정이라는 RFCOMM 소프트웨어에 기반을 두고 있습니다. 다른 패키지를 사용한 (간단한) 대체 방법을 찾지 못했고, 제 개인적인 구성 도구에서만 사용하고 있기 때문에 미래의 구식화 위험을 감수할 의향이 있습니다. 웹에서 솔루션을 연구하는 동안 해결책에 대한 기술적인 기사를 많이 찾았지만 단계별 가이드는 찾지 못했습니다. 그래서 여기에 있습니다...

- 개발이나 구성을 위해 일반적으로 수행하는 것처럼 Windows PC의 PuTTY를 사용하여 알려진 네트워크의 헤드리스 장치에 연결합니다.
- RFCOMM 서비스를 위한 서비스 시작 파일을 추가합니다. 이는 /etc/systemd/system 디렉토리에 있어야하며 파일 이름은 rfcomm.service 여야합니다.

```js
sudo nano /etc/systemd/system/rfcomm.service
```

<div class="content-ad"></div>

아래 내용을 입력해주세요:


[Unit]
Description=RFCOMM 서비스
After=bluetooth.service
Requires=bluetooth.service
[Service]
ExecStart=/usr/bin/rfcomm watch hci0 1 getty rfcomm0 115200 xterm -a <로그인이름>
[Install]
WantedBy=multi-user.target


`<로그인이름>` 자리에 기기에 로그인하려는 사용자 이름을 입력해주세요. 만약 자동 로그인을 원치 않는다면, `ExecStart` 줄의 `xterm` 이후에 있는 모든 내용을 제거해주세요.

3. 다음 명령어를 사용하여 재부팅 시 실행되도록 이 서비스를 설치해주세요:

<div class="content-ad"></div>

```js
sudo systemctl enable rfcomm
```

4. 다음과 같이 맨 위에 "DisbablePlugins = pnat" 문을 추가하여 파일 /etc/bluetooth/main.conf를 수정하십시오:

```js
[General]
DisablePlugins = pnat
```

5. 사용하고 싶은 Bluetooth 이름을 가진 파일 /etc/machine-info를 추가하거나 수정하십시오.

<div class="content-ad"></div>

```js
PRETTY_HOSTNAME=<블루투스이름>
```

원하는 장치 이름으로 표시하고 싶다면 `블루투스이름`을 대체하세요.

6. 블루투스 서비스 파일을 수정하세요.

```js
sudo nano /etc/systemd/system/bluetooth.target.wants/bluetooth.service
```

<div class="content-ad"></div>

다음 두 줄로 대체해주세요:

```js
ExecStart=/usr/libexec/bluetooth/bluetoothd -C
ExecStartPost=/usr/bin/sdptool add SP
```

<div class="content-ad"></div>

7. 이제 구성이 완료되어 장치를 다시 부팅하여 서비스를 다시 시작하세요.

8. 이제 PC와 Bluetooth 연결을 수동으로 설정할 수 있습니다. 이 작업은 한 번만 수행하면 됩니다. 기기가 근접할 때마다 연결이 다시 설정됩니다. 라즈베리 파이 장치에서 다음 명령을 입력하세요:

```js
sudo bluetoothctl
discoverable on
agent on
pairable on
scan on
```

이제 아래와 같이 Bluetooth 장치 ID가 표시됩니다. 통신하는 기기의 16진수 값을 찾아 작동 중인지 확인하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_1.png" />

9. 이제 Windows PC로 이동하여 "Bluetooth 및 기타 장치 설정"을 열어주세요. 그런 다음 "Bluetooth 또는 기타 장치 추가"를 선택한 후 "Bluetooth"를 선택합니다. 그러면 장치 목록이 표시됩니다. 해당 장치를 선택하면 페어링 키가 표시되고 확인 메시지가 나타납니다. PC에서 확인한 후 라즈베리 파이에서 두 가지 메시지에 "예"로 답하세요. 이 시점에서 두 장치가 페어링되었으며 이제 라즈베리 파이 창으로 돌아가서 다음과 같이 입력해주세요:

```js
Discoverable off
exit
```

10. 올바른 연결을 확인하려면 PC로 돌아가주세요. "Bluetooth 및 기타 장치" 창에서 아래로 스크롤하여 "장치 및 프린터"를 찾아 선택해주세요. 여기에 따라 "Unspecified" 항목 하위에 장치 목록이 표시됩니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_2.png" />

이제 디바이스에 마우스 오른쪽 버튼을 클릭한 다음 "속성"을 선택하세요. 그런 다음 "서비스" 탭을 선택하세요. 다음과 같은 화면이 나타날 것입니다:

<img src="/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_3.png" />

시리얼 포트 항목이 여러분의 디바이스에 연결해야 하는 포트입니다. 다음 단계에서 사용할 COM 포트 번호를 기록해주세요.


<div class="content-ad"></div>

11. 이제 PC에서 새 PuTTY 창을 열고 표시된대로 연결 매개변수를 입력하세요. "Serial" 연결 유형을 선택하고 COM 포트 및 속도 값을 입력하세요.

![이미지](/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_4.png)

이제 "열기"를 선택하고 잠시 후에...

![이미지](/assets/img/2024-06-23-ConnecttoaheadlessRaspberryPiusingBluetooth_5.png)

<div class="content-ad"></div>

당신이 있네요!

이제 raspi-config를 사용하여 다른 네트워크를 설정하거나 필요한 다른 구성 변경을 할 수 있습니다.

여기까지 왔으니, 두 장치를 모두 전원을 끄고 다시 키고, 다시 구성하지 않고도 연결할 수 있는 능력을 테스트해보는 것이 좋습니다. 두 기기가 재부팅된 후 PC에서 "Bluetooth 및 기타 장치"로 이동하여 장치가 식별되고 시리얼 포트 서비스가 실행 중인지 확인하세요. 그렇다면 준비된 것입니다. 이제 두 장치를 Wifi 접속이 없는 위치로 옮기고 여전히 PuTTY와 Bluetooth를 통해 무선 장치와 통신할 수 있습니다.

그게 다에요! 마지막으로 한 가지 덧붙이자면, 몇 년간 Medium에서 독자로 활동해 왔지만, 이번이 처음으로 글을 게시하는 시도입니다. 건성적인 피드백을 환영할게요.