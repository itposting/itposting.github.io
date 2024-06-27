---
title: "라즈베리파이와 Flutter 사이에서 Bluetooth Low Energy 사용 방법"
description: ""
coverImage: "/assets/img/2024-06-22-UsingBluetoothLowEnergybetweenRaspberryPiandFlutter_0.png"
date: 2024-06-22 18:11
ogImage: 
  url: /assets/img/2024-06-22-UsingBluetoothLowEnergybetweenRaspberryPiandFlutter_0.png
tag: Tech
originalTitle: "Using Bluetooth Low Energy between Raspberry Pi and Flutter"
link: "https://medium.com/@florentblot/using-bluetooth-low-energy-between-raspberry-pi-and-flutter-cba012c48b97"
---


플러터의 멋진 점은 안드로이드, iOS 및 웹과 같은 다양한 플랫폼용 앱을 만들 수 있다는 것입니다. 그러나 iOS에서는 BLE(Bluetooth Low Energy) 프로토콜을 사용해야 합니다.

이전에 플러터 응용 프로그램과 라즈베리 파이를 사용한 나의 프로젝트는 서로 통신하기 위해 클래식 블루투스를 사용했습니다. 정말 잘 작동했죠... 그러나 아버지께 선물로 줬었는데 — 아이폰을 사용하시는 분이라 — 제대로 사용할 수 없었답니다. 조금 답답했죠.

그래서 이제 Python과 Flutter에서 BLE로 마이그레이션하기로 결정했습니다.

# 1. Bluetooth Low Energy

<div class="content-ad"></div>

제 첫 번째 이주 단계는 BLE를 이해하고 요구 사항을 준비하는 것입니다.

Adafruit에서 이에 대해 잘 문서화된 주제를 다루었습니다: Bluetooth Low Energy 소개. BLE가 어떻게 작동하는지 모른다면, 이 기사는 꽤 좋은 시작점입니다.

BLE 통신은 장치의 역할을 정의하기 위해 GAP (일반 접속 프로필)를 사용합니다. 이 프로젝트에서 RPi 스테이션은 페리페럴 장치로, 와이파이에 연결하고, 휴대폰과 연결하며, 원격 API를 통해 기상 데이터를 가져오고 반환합니다. 모바일 폰은 중앙 장치로, 받은 데이터를 표시하고 명령을 보냅니다.

BLE를 통해 통신하기 위해 GATT (일반 속성 프로필)을 사용합니다. 이는 두 장치가 Profile, Service 및 Characteristic를 사용하여 서로 통신하는 방법을 정의합니다. 이 주제에서 모든 프로토콜을 설명하지는 않겠지만, 간단히 설명하면, 프로필은 서비스 모음이며, 서비스는 장치의 기능입니다 (예: "날씨 서비스", "색상 서비스"). 그리고 Characteristic는 서비스의 작업입니다 (예: "날씨 서비스"에는 "날씨 데이터 가져오기", "날씨 데이터 가져오기 일시 중지/재개", "도시 변경"과 같은 여러 작업이 있습니다).

<div class="content-ad"></div>

서비스와 특성은 고유한 UUID가 필요합니다(일부는 이미 할당되어 있음). 나는 웹사이트에서 그들을 생성했어. 그들을 쉽게 식별하기 위해, 서비스의 UUID들의 동일한 생성된 시퀀스를 정의했지만 관련 작업마다 첫 부분을 간단한 증가로 변경했어:

```js
WEATHER SERVICE  - 00000000-8cb1-44ce-9a66-001dca0941a6
RETRIEVE WEATHER - 00000001-8cb1-44ce-9a66-001dca0941a6
RESUME WEATHER   - 00000002-8cb1-44ce-9a66-001dca0941a6
CHANGE CITY ID   - 00000003-8cb1-44ce-9a66-001dca0941a6
COLOR SERVICE    - 00000000-8194-4451-aaf5-7874c7c16a27
CHANGE COLOR     - 00000001-8194-4451-aaf5-7874c7c16a27
```

마지막으로, 읽기, 쓰기 및 알림을 할 수 있는 특성들을 명시해야 했어:

```js
WEATHER SERVICE
RETRIEVE WEATHER - 읽기/알림
RESUME WEATHER   - 쓰기
CHANGE CITY ID   - 읽기/쓰기
COLOR SERVICE
CHANGE COLOR     - 쓰기
```

<div class="content-ad"></div>

읽기 권한을 활성화하면 클라이언트가 캐릭터리스틱 값들을 읽을 수 있습니다. 쓰기 권한을 부여하면 클라이언트가 캐릭터리스틱에 값을 쓸 수 있습니다. 그리고 알림 권한은 서버가 클라이언트에게 캐릭터리스틱 값이 변경되었음을 알려주는 것입니다.

# 2. Raspberry Pi

Raspberry Pi를 이전하면 Bluetooth 소켓에서 RFCOMM을 통한 Python 스크립트를 BLE로 변경하는 것을 의미합니다.

나는 Douglas Otwell의 Python을 통해 RPi 센서에서 현재 온도를 가져오는 간단한 프로젝트를 찾았습니다. 그는 BlueZ 실험 버전을 기반으로 하고 BLE를 다루는 모듈을 만들었습니다. 나는 그것을 나만의 서비스와 캐릭터리스틱과 함께 사용했습니다.

<div class="content-ad"></div>

그가 만든 GATT 서버가 훌륭하고 명확했기 때문에, 나는 그의 애플리케이션 설정, 광고 및 도구 클래스를 복사했습니다. 이것들을 ble_gatt_server라는 특정 패키지로 옮겼어요:

```js
gatt_server.py
main.py
ble_gatt_server
    advertisement.py
    bletools.py
    service.py
```

gatt_server.py는 내 애플리케이션의 선언입니다. Advertisement를 페리페럴 장치로서 인스턴스화합니다:

아래와 같이 서비스를 생성하고 특성을 연결합니다:

<div class="content-ad"></div>

Characteristics의 생성자에 이어서:

그리고 Service에서 데이터(온도, 날씨 ID, 도시 ID)를 가져오는 특정 함수들:

또는 클라이언트에게 새로운 값들을 알리는 방법:

마지막으로 main.py에서, BLE 애플리케이션을 선언하고 나의 서비스들을 추가하며, 클라이언트에게 변화한 값(예: 온도)을 알립니다:

<div class="content-ad"></div>

# 3. 플러터 애플리케이션

저는 flutter_bluetooth_serial 패키지를 사용하여 모바일 애플리케이션을 만들었습니다. 통신 프로세스를 다른 라이브러리인 flutter_blue로 변경해야 했습니다.

제 플러터 애플리케이션은 BLoC 패턴으로 설계되었습니다. 이 아키텍처는 변경하지 않고 모든 화면을 그대로 유지했습니다. 새 라이브러리와 작업하기 위해 BLoC 클래스만 업데이트했습니다.

BLE를 사용할 때, 모바일 앱은 연결되었을 때 서비스를 발견하고 BleBloc 클래스의 bleServices 목록에 저장해야 합니다.

<div class="content-ad"></div>

각 BLoC 생성자에 각각의 UUID와 함께 해당 서비스를 전달해요:

리스트 내에서 첫 번째 발생을 찾는 이 함수로 검색해요:

그들의 특성에 대해서도 동일한 방법이에요:

마지막으로, 모바일 앱은 업데이트를 청취하고 데이터를 디코딩해요. RPi가 속성이 변경되었다고 알릴 때 이미 그랬던 것처럼요:

<div class="content-ad"></div>

# 4. 최종 결과

BLE로의 이주가 완료되었습니다. RPi에서 main.py를 시작하면 다음 출력을 볼 수 있습니다:

```js
$ sudo python3 main.py
GATT 어플리케이션이 실행 중입니다
GATT 어플리케이션이 등록되었습니다
GATT 광고가 등록되었습니다
---
날씨 업데이트
요청 응답: 18°C (날씨: 803)
선택된 색: (255, 255, 0)
---
날씨 업데이트
요청 응답: 18°C (날씨: 803)
선택된 색: (255, 255, 0)
```

이전과 같이, 스크립트는 5초마다 날씨 데이터를 가져와 "날씨 업데이트" 정보를 표시하고 데이터가 변경되었다고 알립니다. 기기가 연결되었을 때는 출력이 다음과 같습니다:

<div class="content-ad"></div>


---
날씨 업데이트
요청 응답: 18°C (날씨: 803)
선택된 색상: (255, 255, 0)
전송 중:  D=19,W=803,C=6454880
---
날씨 업데이트
요청 응답: 18°C (날씨: 803)
선택된 색상: (255, 255, 0)
전송 중:  D=19,W=803,C=6454880


BLE의 주요 장점은 낮은 전력 소비를 사용한다는 것 이외에도 Classical Bluetooth보다 더 나은 방식으로 기능을 분할할 수 있다는 것입니다. 각 기능은 특정 서비스입니다. 이는 더 읽기 쉽고 깔끔합니다.

마지막으로, 업데이트하는 것은 예상보다 덜 고통스러웠습니다. Classical Bluetooth에서 BLE로 넘어가려면 양쪽에서 라이브러리를 변경하는 것뿐입니다. 음, 거의 그렇습니다.
