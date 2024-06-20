---
title: "윈도우 포렌식 USB 장치 프로파일링"
description: ""
coverImage: "/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_0.png"
date: 2024-06-20 14:45
ogImage: 
  url: /assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_0.png
tag: Tech
originalTitle: "Windows Forensics: USB Device Profiling"
link: "https://medium.com/@andrewss112/windows-forensics-usb-device-profiling-c0af50a203da"
---


# 개요:

USB 장치 프로파일링은 조사자가 숙지해야 할 전통적인 디지털 포렌식 활동 중 하나입니다. 클라우드 저장소 애플리케이션의 널리 퍼진 사용에도 불구하고, USB는 여전히 악성 소프트웨어 전달 및 데이터 유출 수단으로 사용됩니다. 이 기사에서는 USB를 식별하고, 사용 중일 때 USB와 관련된 모든 활동을 사용자에게 연관시키는 단계를 다룰 예정입니다. 다음은 USB 장치에 대해 알고 싶은 목록입니다:

```js
1. 제조업체 및 제품 ID
2. iSerialNumber/ParentIdPrefix
3. Friendly name, vendor, product, and version
4. 장치가 처음/마지막으로 연결된 시간
5. 장치가 마지막으로 제거된 시간
6. 볼륨 이름
7. 마지막으로 마운트된 디렉토리 드라이브 문자
8. 볼륨 GUID, 필요한 경우
9. 장치와 연관된 사용자 계정
10. 볼륨 시리얼 번호
```

# 현재 구성 설정 결정하기

<div class="content-ad"></div>

시스템 하이브에는 시스템 구성 데이터를 저장하는 ControlSet00X라는 키가 있습니다. 컴퓨터를 활용하는 동안, 현재 키의 버전은 CurrentControlSet으로 메모리에 저장되어 오프라인 하이브에 표시되지 않습니다. 올바른 데이터셋을 확인하려면 SYSTEM\Select\LastKnownGood를 검사하여 어떤 ControlSet을 조사해야 하는지 결정해야 합니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_0.png)

여기에서 LastKnownGood 값이 1로 설정되어 있어 ControlSet001과 작업할 것입니다.

# SYSTEM\CurrentControlSet\Enum\USB

<div class="content-ad"></div>

USB 키는 장치 유형과 관계없이 외부 장치에 대한 유용한 정보를 저장하는 종합물입니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_1.png)

레지스트리 탐색기에는 키를 분석하는 프로세스를 가속화하는 일부 내장 플러그인이 있습니다. USB 키를 살펴볼 때 이 도구는 모든 하위 키에 대한 고수준 정보를 추출하고 위의 스크린샷과 같은 테이블 형식으로 집계합니다. 다음 사항을 보고합니다:

- 타임스탬프: 연결된 하위 키에 대한 마지막 쓰기 시간
- 하위 키의 이름 (참고: 제조업체 및 제품 ID, VID/PID에 따라 이름이 지정됨)
- 일련 번호: 이 값은 iSerialNumber이며 장치의 펌웨어에 하드 코딩되어 있습니다.
- ParentIdPrefix: 이 값은 장치가 USB 연결 SCSI 장치 (UASP)인 경우에만 나타납니다.
- 서비스: 장치 유형
- 기타...

<div class="content-ad"></div>

USBSTOR 장치인 VID_0781 및 PID_5581을 계속 검사할 것입니다. 이전에 VID/PID를 사용하여 USB의 제조사와 모델을 DeviceHunt에서 확인해보세요.

```js
1. VID/PID: 0781, 5581
2. iSerialNumber: 0401805d69c0bed0de932277ac861f044d10940c13885d7307a00cd7471423b
3. 제조사: SanDisk, 제품: Ultra
```

## SYSTEM\CurrentControlSet\Enum\USB\VID_0781&PID_5581

레지스트리 탐색기에 의해 보고된 고수준 정보가 유용하게 사용됩니다. 하지만 좀 더 세부적인 정보는 하위 키에 포함되어 있습니다.

<div class="content-ad"></div>

이전에 언급했듯이 각 장치는 VID와 PID로 식별된 SYSTEM\CurrentControlSet\Enum\USB 하위 키를 생성합니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_2.png)

조사 중인 장치를 확장하면 다음 하위 키의 이름으로 장치의 iSerialNumber가 표시됩니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_3.png)

<div class="content-ad"></div>

아래는 Markdown 형식으로 변환되어 있습니다:

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_4.png)

$iSerialNumber 키를 검사하면 다음과 같은 추가 정보가 확인됩니다:

- DeviceDesc: 장치는 bulk-only 전송, 대량 저장장치입니다
- Service: USBSTOR (USB 저장 장치 프로토콜)입니다

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_5.png)


<div class="content-ad"></div>

흥미로운 정보 중 상세 정보는 하위 키에서 나옵니다: Properties\'83da6326–97a6–4088–9453-a1923f573b29'. 여기서는 장치가 처음 연결된 시간, 마지막 연결된 시간 및 시스템에서 마지막으로 제거된 시간을 확인할 수 있습니다.

![이미지 1](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_6.png)

![이미지 2](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_7.png)

![이미지 3](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_8.png)

<div class="content-ad"></div>

```js
1. VID/PID: 0781, 5581
2. iSerialNumber: 0401805d69c0bed0de932277ac861f044d10940c13885d7307a00cd7471423b
3. Vendor: SanDisk, Product: Ultra
4. First Connect: 2024-06-13, 14:06:41
   Last Connect:  2024-06-13, 15:22:23
5. Last Removal Time: 2024-06-13, 20:36:31
```

## 친환경적인 이름 및 버전 번호 확인

장치의 친환경적인 이름과 버전 번호를 얻으려면 USBSTOR 키 아래를 살펴보면 됩니다. 버전 번호는 HardwareID 값에 있습니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_9.png)

<div class="content-ad"></div>

```js
1. VID/PID: 0781, 5581
2. iSerialNumber: 0401805d69c0bed0de932277ac861f044d10940c13885d7307a00cd7471423b
3. Friendly Name: USB SanDisk 3.2Gen 1 USB Device
   Vendor: SanDisk, Product: Ultra, Version: 3.2Gen1
4. First Connect: 2024-06-13, 14:06:41
   Last Connect:  2024-06-13, 15:22:23
5. Last Removal Time: 2024-06-13, 20:36:31
```

## 볼륨 정보 확인

SOFTWARE 하이브에서 Windows Portable Devices를 찾아 볼륨 이름을 얻을 수 있습니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_10.png)


<div class="content-ad"></div>

볼륨 GUID를 얻으려면 SYSTEM\MountedDevices 아래를 살펴볼 수 있습니다.

![이미지](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_11.png)

```js
1. VID/PID: 0781, 5581
2. iSerialNumber: 0401805d69c0bed0de932277ac861f044d10940c13885d7307a00cd7471423b
3. Friendly Name: USB SanDisk 3.2Gen 1 USB Device
   Vendor: SanDisk, Product: Ultra, Version: 3.2Gen1
4. First Connect: 2024-06-13, 14:06:41
   Last Connect:  2024-06-13, 15:22:23
5. Last Removal Time: 2024-06-13, 20:36:31
6. Volume Name: New Volume
7. Last Mount Point/Drive letter: TBD
8. Volume GUID: {b445a977-284b-11ef-b163-c333a7edd79a}
```

## 장치가 사용자 계정과 관련이 있는지 확인하기

<div class="content-ad"></div>

이제 우리가 볼륙 GUID를 알았으니 해당 값과 NTUSER 하이브를 교차 참조할 수 있습니다. 이를 위해 MountPoints2 아래를 살펴봐야 합니다.

![image](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_12.png)

볼륙 GUID가 존재하기 때문에 두 가지 중 하나는 반드시 사실일 것입니다:

- 사용자가 장치가 연결된 상태에서 활성으로 로그인되어 있었음
- 장치가 연결된 시점에서 사용자가 마지막으로 로그인되어 있었음

<div class="content-ad"></div>

어떤 시나리오가 유효한지 확인하려면 시스템의 보안 이벤트 로그를 확인하여 사용자가 로그인한 시간을 판단해야 합니다. 이를 위해 이벤트 ID: 4624/4647 또는 4624/4634 사이의 타임스탬프 차이를 취하여 사용자의 로그인/로그오프 시간을 확인할 수 있습니다. 로긴/로그오프 이벤트에서 LogonID가 일치하는지 확인하세요.

```js
1. VID/PID: 0781, 5581
2. iSerialNumber: 0401805d69c0bed0de932277ac861f044d10940c13885d7307a00cd7471423b
3. Friendly Name: USB SanDisk 3.2Gen 1 USB Device
   - Vendor: SanDisk, Product: Ultra, Version: 3.2Gen1
4. First Connect: 2024-06-13, 14:06:41
   - Last Connect:  2024-06-13, 15:22:23
5. Last Removal Time: 2024-06-13, 20:36:31
6. Volume Name: New Volume
7. Last Mount Point/Drive letter: TBD
8. Volume GUID: {b445a977-284b-11ef-b163-c333a7edd79a}
9. User Account Associated w/ the device: Ross
10. Volume Serial Number: TBD
```

## 볼륨 일련 번호 가져오기

볼륨 일련 번호(VSN)를 얻으려면 Microsoft-Windows-Partition/Diagnostic.evtx 로그를 참조하고 기기의 마지막 연결 시간을 교차 참조할 수 있습니다. 기억하세요, 레지스트리는 UTC 시간으로 기록하고 이벤트 로그는 로컬 시간으로 기록합니다. 이벤트 로그의 타임스탬프를 올바르게 해석하기 위해 SYSTEM\CurrentControlSet\Control\TimezoneInformation를 확인하세요.

<div class="content-ad"></div>

VSN은 Vbr0에 저장되어 있습니다. 또한, 분석 중인 장치가 NTFS 시스템이기 때문에 VSN을 찾으려면 offset 0x43를 살펴보아야 합니다. 바이트 순서도 잊지 말고, 리틀-엔디안 형식으로 저장되어 있을 겁니다.

![이미지1](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_13.png)

우리는 또한 Partition-4DiagnosticParser라는 오픈 소스 도구를 이용하여 장치의 iSerialNumber를 필터링하는 쉬운 방법을 사용할 수 있습니다.

![이미지2](/assets/img/2024-06-20-WindowsForensicsUSBDeviceProfiling_14.png)

<div class="content-ad"></div>

```js
1. VID/PID: 0781, 5581
2. iSerialNumber: 0401805d69c0bed0de932277ac861f044d10940c13885d7307a00cd7471423b
3. Friendly Name: USB SanDisk 3.2Gen 1 USB Device
   - Vendor: SanDisk, Product: Ultra, Version: 3.2Gen1
4. First Connect: 2024-06-13, 14:06:41
   - Last Connect:  2024-06-13, 15:22:23
5. Last Removal Time: 2024-06-13, 20:36:31
6. Volume Name: New Volume
7. Last Mount Point/Drive letter: TBD
8. Volume GUID: {b445a977-284b-11ef-b163-c333a7edd79a}
9. User Account Associated w/ the device: Ross
10. Volume Serial Number: 306B19C9
```

## Last Mount Point/Drive Letter Determination

안녕하세요! 장치의 드라이브 문자를 레지스트리에서 확인하지 못했습니다. 그 드라이브 문자는 재사용되었기 때문입니다. 또한 이벤트 로그를 통해 확인할 수 없습니다. 있었던 시간의 이벤트가 덮어써졌기 때문이죠. 하지만 시스템에서 다양한 쉘 항목(예: LNK 파일)을 조사하고 그 중 일치하는 VSN을 포함하는 것이 가능한 접근 방식입니다. 토지 조사 이미지를 촬영할 때 쉘 항목을 복사해 낼 걸 그랬어요. 그때는 레지스트리와 이벤트 로그만 복사했습니다. 제 실수였죠. 여러분의 시스템에서 이를 수행하려면 이미지와 함께 LNK 아티팩트를 추출하는 것을 권장합니다.