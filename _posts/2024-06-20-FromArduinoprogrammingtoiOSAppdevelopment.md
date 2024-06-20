---
title: "아두이노 프로그래밍에서 iOS 앱 개발로"
description: ""
coverImage: "/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_0.png"
date: 2024-06-20 16:48
ogImage: 
  url: /assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_0.png
tag: Tech
originalTitle: "From Arduino programming to iOS App development"
link: "https://medium.com/@leonardocavagnis/from-arduino-programming-to-ios-app-development-8b5da1783e1e"
---


## BLE 연결을 통한 IoT 프로젝트 구축 실습 가이드

이 튜토리얼에서는 iOS 앱 개발과 Arduino 프로그래밍의 세계를 탐험하면서 전자 보드를 무선으로 제어할 수 있는 간단한 시스템을 생성하는 방법을 살펴보겠습니다. Bluetooth Low Energy (BLE) 연결 기능을 활용하여 Arduino Nano 33 BLE Sense 보드와 상호작용하고 LED 상태를 제어하며 센서에서 온도 데이터를 읽는 모바일 애플리케이션을 개발할 것입니다. 이 실습 가이드를 통해 iOS 앱과 Arduino 스케치를 개발하는 단계별 프로세스를 경험하면서 자체 IoT 프로젝트를 만들 수 있는 귀중한 기술을 습득할 수 있습니다.

![이미지](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_0.png)

Nano 33 BLE Sense는 BLE 연결 및 센싱 기능이 필요한 프로젝트에 적합한 소형 Arduino 보드입니다. 다양한 센서를 갖추고 있어 IoT 응용 프로그램, 웨어러블 기기 및 데이터 획득 프로젝트에 적합합니다.

<div class="content-ad"></div>

# BLE 통신 이해하기

BLE는 저전력 기기를 위해 설계된 무선 통신 기술입니다. 이는 클라이언트-서버 아키텍처를 사용하며 다음과 같이 기기가 작동할 수 있습니다:

- 중앙 (클라이언트): 통신을 시작하고 제어합니다.
- 주변 (서버): 액세스할 데이터 또는 작업을 제공합니다.

서비스와 특성은 BLE 통신의 구성 요소입니다:

<div class="content-ad"></div>

- 서비스는 관련 기능이나 데이터 모음을 나타냅니다.
- 특징은 서비스 내에서 특정한 데이터 값을 가리킵니다.

연결을 설정하려면 주변 기기가 광고 패킷이라는 작은 메시지를 방송하여 가용성을 알립니다. 중심 기기는 스캔 과정을 통해 이러한 패킷을 수신하고 주변 기기를 발견할 수 있습니다.

중심 기기가 관심 있는 주변 기기를 식별하면 연결을 설정하고 사용 가능한 서비스와 특징과 상호 작용을 시작할 수 있습니다.

우리 프로젝트에서 iOS 앱은 중심의 역할을 하고, Arduino 보드는 주변으로 동작합니다. 보드는 두 개의 별도 서비스 내에서 두 개의 특징을 통해 데이터를 노출할 것입니다:


<div class="content-ad"></div>

- Led Status Characteristic (in Led Service): 이 특성은 쓰기 속성을 가진 특성으로, 앱이 0 (끄기) 또는 1 (켜기) 값을 쓰면 LED의 상태를 변경할 수 있습니다.
- Temperature Characteristic (in Sensor Service): 이 특성은 읽기 및 알림 속성을 가진 특성으로, 보드에서 측정된 온도 값을 검색하고 온도 업데이트에 대한 알림을 받을 수 있도록 합니다.

![이미지](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_1.png)

# Arduino 프로그램 빌드

Arduino 프로그램은 ArduinoBLE 및 Arduino_HTS221 라이브러리를 활용하여 BLE 통신 및 온도 감지 기능을 가능하게 합니다.

<div class="content-ad"></div>

```js
#include <ArduinoBLE.h>
#include <Arduino_HTS221.h>
```

먼저, 스케치는 UUID를 사용하여 필요한 BLE 서비스 및 특성을 설정하고 각 특성에 대한 속성을 정의합니다. UUID(Universally Unique Identifiers)는 BLE 통신 프로토콜에서 서비스 및 특성을 식별하는 데 사용되는 고유 식별자입니다.

```js
BLEService ledService("cd48409a-f3cc-11ed-a05b-0242ac120003");
BLEByteCharacteristic ledstatusCharacteristic("cd48409b-f3cc-11ed-a05b-0242ac120003", BLEWrite);

BLEService sensorService("d888a9c2-f3cc-11ed-a05b-0242ac120003");
BLEByteCharacteristic temperatureCharacteristic("d888a9c3-f3cc-11ed-a05b-0242ac120003", BLERead | BLENotify);
```

그런 다음, 프로그램은 BLE 모듈을 초기화하고 로컬 이름 및 광고 서비스를 설정합니다. 사용자가 정의한 로컬 이름은 Arduino에 의해 방송되며 페리퍼럴을 식별하는 사람이 읽을 수 있는 식별자 역할을 합니다. 광고 서비스를 Led 서비스로 설정함으로써, Arduino는 iOS 앱이나 다른 중앙 장치에게 제공하는 특정 서비스에 대해 알립니다.

<div class="content-ad"></div>

```js
void setup() {
    // ...

    // BLE 초기화
    if (!BLE.begin()) {
        while (1);
    }

    // 광고할 로컬 이름과 서비스 UUID 설정
    BLE.setLocalName("iOSArduinoBoard");
    BLE.setAdvertisedService(ledService);
}
```

BLE 스택에 서비스와 특성이 추가되며, 온도 특성에 대한 읽기 요청 핸들러가 설정됩니다.

```js
// 서비스에 특성 추가
ledService.addCharacteristic(ledstatusCharacteristic);
sensorService.addCharacteristic(temperatureCharacteristic);

// BLE 스택에 서비스 추가
BLE.addService(ledService);
BLE.addService(sensorService);

// 온도 특성에 대한 읽기 요청 핸들러 설정
temperatureCharacteristic.setEventHandler(BLERead, temperatureCharacteristicRead);
```

프로그램은 광고를 시작하고 메인 루프에 진입합니다.

<div class="content-ad"></div>

```js
 // 광고 시작
 BLE.advertise();
}
```

메인 루프에서는 중앙 기기가 연결하도록 대기하며, 연결되면 통신을 처리하는 루프를 시작합니다.

```js
void loop() {  
  // BLE 센트럴 기기가 연결될 때까지 대기
  BLEDevice central = BLE.central();

  // 센트럴 기기가 페리페럴에 연결된 경우
  if (central) {
    // ...
    while (central.connected()) {
      // ...
    }
  }
}
```

이 루프 내에서 프로그램은 주기적으로 센서에서 온도를 읽어 올바른 온도 값을 업데이트합니다. 또한, 센트럴 기기가 LedStatus 특성에 새 값을 쓰지 않았는지 확인합니다. 새 값을 감지하면 LED를 켜거나 끕니다.

<div class="content-ad"></div>

```js
while (central.connected()) {
    // ...
    // 온도 값을 읽어옴
    temperature = (int) HTS.readTemperature();
    temperatureCharacteristic.writeValue(temperature);
    
    // ...
    // LedStatus characteristic의 쓰기 여부 확인
    if (ledstatusCharacteristic.written()) {
        if (ledstatusCharacteristic.value()) {
            digitalWrite(LED_BUILTIN, HIGH);
        } else {
            digitalWrite(LED_BUILTIN, LOW);
        }
    }
}
```

마지막으로, 온도 characteristic의 읽기 요청에 응답하기 위해 read 이벤트 핸들러 함수를 구현했습니다. 이 함수는 현재 온도 값을 characteristic에 작성합니다.

```js
void temperatureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
    temperatureCharacteristic.writeValue(temperature);
}
```

# iOS 앱 설계


<div class="content-ad"></div>

iOS 앱은 사용자 친화적인 인터페이스로 설계되었으며 두 가지 주요 화면으로 구성되어 있습니다:

- 스캔 화면: 앱을 실행할 때 초기화면으로 작동하여 사용자가 주변 기기를 스캔할 수 있게 합니다. 발견된 기기의 목록을 표시하며 사용자는 특정 기기의 이름을 탭하여 연결을 시작할 수 있습니다. 연결에 성공하면 앱은 연결 화면으로 전환됩니다.
- 연결 화면: 연결된 아두이노와 상호 작용할 수 있는 인터페이스를 제공합니다. 사용자는 LED의 상태를 수정하여 켜거나 끌 수 있습니다. 또한 사용자는 온도를 두 가지 모드로 읽을 수 있습니다: 단일 읽기(Read) 또는 변화의 지속적 모니터링(Notify).

![이미지](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_2.png)

이 앱은 MVVM (Model-View-ViewModel) 디자인 패턴을 사용한 Clean Architecture에 영감을 받은 아키텍처로 구축되었으며 몇 가지 조정을 통해 단숨함과 이해하기 쉬운 요소를 향상시켰습니다. 이 접근 방식은 앱을 3개의 구분된 계층으로 구성하여 컴포넌트 독립성과 테스트 가능성을 촉진합니다:

<div class="content-ad"></div>

- 프리젠테이션 계층은 사용자 인터페이스와 상호 작용을 처리합니다. 이 계층은 View(사용자 인터페이스 렌더링 담당)와 ViewModel(View의 상태를 관리하는)으로 구성됩니다.
- 도메인 계층은 응용 프로그램의 핵심 비즈니스 로직을 나타냅니다. 이 계층은 사용 사례를 캡슐화하고 데이터와 상호 작용합니다. 사용 사례는 응용 프로그램에서 수행할 수 있는 특정 비즈니스 작업을 나타냅니다.
- 데이터 계층은 데이터 접근 및 지속성을 담당합니다. 데이터 작업을 추상화하는 엔티티를 포함합니다.

![image](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_3.png)

앱은 CoreBluetooth를 활용하여 Bluetooth 관련 작업을 처리할 것입니다. CoreBluetooth는 Apple이 제공하는 프레임워크로, iOS 플랫폼에서 Bluetooth 기기와의 원활한 통신을 가능하게 합니다. Bluetooth 기능 구현을 간소화하는 포괄적인 기능 세트를 제공합니다.

CoreBluetooth를 활용하여, 앱은 주변의 Bluetooth 주변 기기를 탐지하고 연결을 설정하며 기기 간 데이터를 교환할 수 있을 것입니다.

<div class="content-ad"></div>

자 이제 iOS 프로그래밍에 직접 참여해 봅시다!
시작하기 전에 필요한 필수 도구 몇 가지가 있습니다: 맥 컴퓨터와 Apple 플랫폼을 위한 공식 통합 개발 환경(Integrated Development Environment, IDE) 인 Xcode입니다. Xcode는 iOS 애플리케이션을 디자인, 코딩 및 디버깅할 수 있는 종합적인 도구 및 자원 세트를 제공합니다.

Xcode를 열고, 환영 화면에서 "새 Xcode 프로젝트 생성"을 선택하고 iOS 섹션에서 App 템플릿을 선택하세요. 고유한 제품명(iOSArduinoBLE)을 제공하고, 팀 식별자(귀하의 Apple ID 이름)를 선택하고, 언어(Swift)와 프로젝트를 저장할 위치를 선택하세요.

...여기까지입니다! 시작해 봅시다.

<div class="content-ad"></div>

# iOS 앱: Arduino 보드를 스캔하고 연결하기

스캔 화면에서 사용자는 깔끔하고 직관적인 UI로 BLE 장치를 발견하고 연결할 수 있습니다.

![이미지](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_5.png)

이 화면의 기본 아키텍처는 다음과 같습니다:

<div class="content-ad"></div>

- ScanView: 화면의 UI를 렌더링하는 데 책임이 있습니다. SwiftUI를 사용하여 디자인되었습니다.
- ScanViewModel: "Start Scan" 버튼을 탭하거나 장치 이름을 선택하는 이벤트를 처리합니다. 스캔 및 연결 작업을 실행하기 위해 ScanViewModel은 CentralUseCase에 의존합니다.
- CentralUseCase: CoreBluetooth 프레임워크와 상호 작용하기 위한 필수 로직을 캡슐화하며, CBCentralManager 객체를 활용합니다. 이 객체는 프레임워크 내에서 스캔을 시작하고 연결을 설정하며 주변기기를 관리합니다.

![이미지](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_6.png)

데이터 레이어에는 Peripheral 및 UUIDs 두 가지 엔티티가 포함되어 있습니다. Peripheral 객체는 BLE 장치를 나타내며, 장치 이름, 식별자 및 기타 관련 속성과 같은 세부 정보를 보유합니다. UUIDs는 응용 프로그램에서 사용할 서비스 및 특성 목록을 보유하는 컬렉션입니다.

# 스캐닝

<div class="content-ad"></div>

"Start Scan" 버튼을 누르면 ScanView가 사용자 상호작용을 캡처하고 요청을 처리하기 위해 ScanViewModel로 전달합니다.

```js
//  ScanView.swift
// ...
Button {
    viewModel.scan()
} label: {
    Text("Start Scan")
    .frame(maxWidth: .infinity)
}
// ...
```

ScanViewModel은 상호작용을 받으면 해당 사용 사례에서 스캔 기능을 트리거합니다. 사용 사례는 LedService를 광고하는 디바이스만 찾도록 지시 받습니다.

```js
//  ScanViewModel.swift
// ...
func scan() {
    useCase.scan(for: [UUIDs.ledService])
}
```

<div class="content-ad"></div>

최종적으로 사용 사례는 CoreBluetooth 프레임워크와 상호 작용하여 스캔 프로시저를 시작합니다.

```js
// CentralUseCase.swift
// ...
lazy var central: CBCentralManager = {
 CBCentralManager(delegate: self, queue: DispatchQueue.main)
}()

func scan(for services: [CBUUID]) {
 guard central.isScanning == false else {
     return
 }
 central.scanForPeripherals(withServices: services, options: [:])
}
```

CoreBluetooth에서 scanForPeripherals 함수를 사용할 때, CBCentralManagerDelegate 메소드를 통해 응답을 처리할 수 있습니다. 발견된 페리페럴을 처리하는 델리게이트 메소드는 didDiscover이며, 스캔 과정 중에 페리페랄이 발견될 때마다 호출됩니다.

기기가 발견되면 CentralUseCase는 onPeripheralDiscovery 클로저(즉, 자체 포함된 코드 블록)를 호출하여 새로 발견된 페리페럴의 세부 정보를 제공합니다.

<div class="content-ad"></div>

```swift
// CentralUseCase.swift
// ...
extension CentralUseCase: CBCentralManagerDelegate {
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                       advertisementData: [String : Any], rssi RSSI: NSNumber) {
      onPeripheralDiscovery?(.init(cbPeripheral: peripheral))
  }
  // ...
}
```

ScanViewModel은 내부 상태를 업데이트하고 ScanView에 새로운 장치가 주변 장치 목록에 표시될 준비가 되었음을 알립니다.

```swift
// ScanViewModel.swift
// ...
useCase.onPeripheralDiscovery = { [weak self] peripheral in
    guard let self = self else {
        return
    }
    self.foundPeripherals.insert(peripheral)
    self.state = .scan(Array(self.foundPeripherals))
}
```

```swift
// ScanView.swift
// ...
VStack {
    List(peripheralList, id: \.id) { peripheral in
        Text("\(peripheral.name ?? "N/A")")
        // ...
    }
}
// ...
}
.onReceive(viewModel.$state) { state in
    switch state {
        // ...
        case .scan(let list):
            peripheralList = list
        // ...
    }
}
```

<div class="content-ad"></div>

# 연결하기

목록 중 한 장치를 누르면 ScanView가 사용자 상호 작용을 캡처하고 해당 페리페럴에 연결하기 위해 ScanViewModel에 요청을 전달합니다.

```js
// ScanView.swift
// ...
List(peripheralList, id: \.id) { peripheral in
    Text("\(peripheral.name ?? "N/A")")
        // ...
        .onTapGesture {
            viewModel.connect(to: peripheral)
        }
}
```

이 작업은 ScanViewModel이 연결 작업을 해당 사용 사례에 전달하도록 유도합니다.

<div class="content-ad"></div>

```swift
//  ScanViewModel.swift
// ...
func connect(to peripheral: Peripheral) {
    useCase.connect(to: peripheral)
}
```

마침내 사용 사례는 선택한 장치와 연결 프로세스를 시작하는 동안 스캐닝 프로세스를 중단하여 CoreBluetooth 프레임워크와 상호 작용합니다.

```swift
//  CentralUseCase.swift
// ...
func connect(to peripheral: Peripheral) {
    central.stopScan()
    central.connect(peripheral.cbPeripheral!)
}
```

연결이 성공하면 didConnect 대리자 메서드가 호출됩니다. CentralUseCase는 이 정보를 ScanViewModel에게 onConnection 클로저를 호출하여 전달합니다.

<div class="content-ad"></div>

```swift
//  CentralUseCase.swift
// ...
func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    onConnection?(.init(cbPeripheral: peripheral))
}
```

ScanViewModel은 내부 상태를 업데이트하고 선택한 장치와의 연결이 설정되었음을 ScanView에 알립니다.

```swift
//  ScanViewModel.swift
// ...
useCase.onConnection = { [weak self] peripheral in
    self?.state = .connected(peripheral)
}
```

그에 따라 ScanView는 ConnectView로 전환합니다.

<div class="content-ad"></div>

```swift
// ScanView.swift
// ...
.onReceive(viewModel.$state) { state in
    switch state {
    case .connected:
        shouldShowDetail = true
    // ...
    }
}
.navigationDestination(isPresented: $shouldShowDetail) {
    if case let .connected(peripheral) = viewModel.state  {
        let viewModel = ConnectViewModel(useCase: PeripheralUseCase(),
            connectedPeripheral: peripheral)
        ConnectView(viewModel: viewModel)
    }
}
```

# iOS 앱: 데이터 쓰기 및 읽기

Connect 화면에서 사용자는 Arduino와 상호 작용하여 LED 및 온도와 관련된 정보를 교환할 수 있습니다.

<img src="/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_7.png" />


<div class="content-ad"></div>

아키텍처는 이전 화면과 일관성을 유지하며 다음 구성 요소를 포함합니다:

- ConnectView: LED 상태를 제어하는 UI 요소, 온도 정보를 읽는 UI 요소, 및 장치와의 연결을 해제하는 UI 요소를 표현합니다. SwiftUI를 사용하여 구현되었습니다.
- ConnectViewModel: LED 제어를 위한 온/오프 버튼을 탭하거나 온도 알림 활성화를 전환하거나 즉시 온도를 읽는 버튼을 누르는 등 사용자 상호작용을 캡처합니다. 또한 연산을 처리하기 위해 PeripheralUseCase와 통신합니다.
- PeripheralUseCase: CentralUseCase와 유사하게 CoreBluetooth와 관련된 로직을 담당합니다. CBPeripheral 객체와 상호작용하여 특성과 서비스를 통해 데이터를 관리하고 교환합니다.

![아무 이미지](/assets/img/2024-06-20-FromArduinoprogrammingtoiOSAppdevelopment_8.png)

서비스와 특성과의 데이터 교환을 시작하기 전에 발견 단계를 수행해야 합니다. 이 단계에서 CoreBluetooth 프레임워크는 연결된 주변 장치에 의해 제공되는 사용 가능한 서비스와 특성에 대한 정보를 스캔하고 검색합니다.

<div class="content-ad"></div>

# 발견

ConnectViewModel 및 해당 PeripheralUseCase를 생성한 후에는 발견 서비스 프로시저가 시작됩니다. 발견된 각 서비스에는 해당하는 특성도 발견됩니다.

CoreBluetooth 프레임워크에서의 응답은 각각의 대리자 메서드인 didDiscoverServices 및 didDiscoverCharacteristicsFor로 전달됩니다. 이러한 메서드는 장치에서 발견된 서비스 및 특성에 대한 정보를 앱에 제공합니다.

```swift
//  PeripheralUseCase.swift
// ...
func discoverServices() {
 cbPeripheral?.discoverServices([UUIDs.ledService, UUIDs.sensorService])
}
// ...
func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
 // ...
  for service in services {
      // ...
      peripheral.discoverCharacteristics(uuids, for: service)
  }
}
```

<div class="content-ad"></div>

Once the discovery process is completed, the `ConnectViewModel` is notified with `onPeripheralReady`, and the UI is prepared to handle operations on the discovered characteristics.

```js
// PeripheralUseCase.swift
// ...
func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
  for characteristic in characteristics {
      discoveredCharacteristics[characteristic.uuid] = characteristic
  }

  if discoveredCharacteristics[UUIDs.temperatureCharacteristic] != nil &&
      discoveredCharacteristics[UUIDs.ledStatusCharacteristic] != nil {
      onPeripheralReady?()
  }
}
```

# Controlling LED

When the user presses the on/off buttons, it triggers a write operation to the LedStatus characteristic with a numerical value (1 for “On” and 0 for “Off”). This action, in turn, controls the integrated LED on the board, either turning it on or off accordingly.

<div class="content-ad"></div>

일반적인 흐름을 따라 전체 프로세스가 관리됩니다:

```js
// ConnectView.swift
// ...
Button("On") {
    viewModel.turnOnLed()
}
// ...
Button("Off") {
    viewModel.turnOffLed()
}

// ConnectViewModel.swift
// ...
func turnOnLed() {
    useCase.writeLedState(isOn: true)
}

func turnOffLed() {
    useCase.writeLedState(isOn: false)
}

// PeripheralUseCase.swift
// ...
func writeLedState(isOn: Bool) {
    cbPeripheral?.writeValue(Data(isOn ? [0x01] : [0x00]), for: ledCharacteristic, type: .withResponse)
}
```

# 온도 읽기

온도 측정은 두 가지 방법으로 수행할 수 있습니다: 한 번의 값을 얻기 위해 트리거되는 읽기 작업을 사용하는 싱글 샷 모드 또는 실시간 업데이트를 받기 위해 알림 작업을 사용하는 연속 모드입니다.

<div class="content-ad"></div>

다음은 읽기 작업 요청의 흐름입니다:

```js
//  ConnectView.swift
// ...
Button("READ") {
  viewModel.readTemperature()
}

//  ConnectViewModel.swift
// ...
func readTemperature() {
  useCase.readTemperature()
}

//  PeripheralUseCase.swift
// ...
func readTemperature() {
 cbPeripheral?.readValue(for: tempCharacteristic)
}
```

알림 작업 흐름의 활성화/비활성화는 동일한 패턴을 따릅니다:

```js
//  ConnectView.swift
// ...
Toggle("Notify", isOn: $isToggleOn)
// ...
.onChange(of: isToggleOn) { newValue in
 if newValue == true {
  viewModel.startNotifyTemperature()
 } else {
  viewModel.stopNotifyTemperature()
 }
}

//  ConnectViewModel.swift
// ...
func startNotifyTemperature() {
  useCase.notifyTemperature(true)
}

func stopNotifyTemperature() {
  useCase.notifyTemperature(false)
}

//  PeripheralUseCase.swift
// ...
func notifyTemperature(_ isOn: Bool) {
 cbPeripheral?.setNotifyValue(isOn, for: tempCharacteristic)
}
```

<div class="content-ad"></div>

두 작업은 모두 CoreBluetooth의 동일한 대리자에 응답을 생성합니다. 구체적으로 didUpdateValueFor 메서드입니다. 읽기 작업의 경우 요청한 데이터와 함께 단일 응답이 있을 것입니다. 알림의 경우, 알림이 비활성화될 때까지 응답이 계속 전송됩니다. 각 응답은 UI 상태를 업데이트하기 위해 ConnectViewModel의 onReadTemperature 클로저를 트리거합니다.

```swift
//  PeripheralUseCase.swift
// ...
func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
  switch characteristic.uuid {
   case UUIDs.temperatureCharacteristic:
     let value: UInt8 = {
       guard let value = characteristic.value?.first else {
         return 0
       }
       return value
     }()
     onReadTemperature?(Int(value))
  }
}

//  ConnectViewModel.swift
// ...
useCase.onReadTemperature = { [weak self] value in
 self?.state = .temperature(value)
}

//  ConnectView.swift
// ...
@State var lastTemperature: Int = 0
// ...
Text("\(lastTemperature) °C")
// ...
.onReceive(viewModel.$state) { state in
  switch state {
   // ...
   case let .temperature(temp):
       lastTemperature = temp
  }
}
```

# 연결 해제

연결 해제 버튼을 누르면 흐름이 약간 다른 방향으로 진행됩니다. 연결 해제 작업은 CBCentralManager 객체에 속하므로 CentralUseCase에서 수행되어야 합니다. 이를 가능하게 하기 위해 사용자가 버튼을 누르면 현재 화면이 해제되고 사용자는 스캔 화면으로 돌아갑니다.

<div class="content-ad"></div>

```swift
//  ConnectView.swift
// ...
Button {
  dismiss()
} label: {
  Text("연결 해제")
  .frame(maxWidth: .infinity)
}
```

ScanView가 나타날 때, 수행하는 첫 번째 작업은 이미 연결된 장치가 있는지 확인하고 있다면 연결을 해제하는 것입니다. 이 작업은 해당 ScanViewModel에서 처리되며, 그런 다음 CentralUseCase에 해당 요청을 전달하여 CoreBluetooth 프레임워크에서 연결 해제 작업을 수행합니다.

```swift
//  ScanView.swift
// ...
.onAppear {
  viewModel.disconnectIfConnected()
}

//  ScanViewModel.swift
// ...
func disconnectIfConnected() {
  guard case let .connected(peripheral) = state,
  peripheral.cbPeripheral != nil else {
      return
  }
  useCase.disconnect(from: peripheral)
}

//  CentralUseCase.swift
// ...
func disconnect(from peripheral: Peripheral) {
  central.cancelPeripheralConnection(peripheral.cbPeripheral!)
}
```

# 결론

<div class="content-ad"></div>

이 글에서는 Arduino 프로그래밍부터 iOS 앱 개발로 이동하는 여정을 살펴보았는데, 이 과정에서 BLE 연결을 통해 IoT 프로젝트를 구축하는 데 초점을 맞추었습니다.

우리는 Xcode와 CoreBluetooth 프레임워크를 사용하여 iOS 앱을 만드는 방법을 배웠습니다. BLE의 기본 지식을 습득하고, 청결한 아키텍처 원칙을 공부하며, 확장 가능하고 유지보수 가능한 코드베이스를 보장하기 위해 MVVM 디자인 패턴을 구현해 보았습니다.

이 프로젝트는 여러분의 IoT 프로젝트를 시작하는 좋은 지점이 될 수 있습니다. 그러나 CoreBluetooth를 직접 사용하는 것은 백그라운드 작업 처리의 복잡도와 상위 수준의 기능(메쉬, 펌웨어 업데이트 등) 부족과 같은 몇 가지 제한 사항이 있을 수 있습니다. 이러한 제한 사항을 극복하기 위해, 추가적인 추상화 계층과 고급 기능을 지원하는 서드파티 라이브러리를 활용하는 것이 좋습니다.
일부 인기 있는 옵션은 다음과 같습니다:

- RxBluetoothKit: 강력한 ReactiveX 기반 BLE 라이브러리.
- Bluejay: 간편하고 사용하기 쉬운 BLE 라이브러리를 강조하는 현대적인 라이브러리.
- LittleBlueTooth: 가벼우면서 간편한 BLE 라이브러리.

<div class="content-ad"></div>

# 코드

- iOSArduinoBLE_ArduinoSketch
- iOSArduinoBLE_iOSApp