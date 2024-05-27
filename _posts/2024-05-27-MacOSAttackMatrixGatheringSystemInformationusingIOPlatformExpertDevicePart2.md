---
title: "맥OS 공격 매트릭스 IOPlatformExpertDevice를 사용하여 시스템 정보 수집하기 파트  2"
description: ""
coverImage: "/assets/img/2024-05-27-MacOSAttackMatrixGatheringSystemInformationusingIOPlatformExpertDevicePart2_0.png"
date: 2024-05-27 12:24
ogImage:
  url: /assets/img/2024-05-27-MacOSAttackMatrixGatheringSystemInformationusingIOPlatformExpertDevicePart2_0.png
tag: Tech
originalTitle: "MacOS Attack Matrix: Gathering System Information using IOPlatformExpertDevice (Part — 2)"
link: "https://medium.com/@utkarshcodes/macos-attack-matrix-gathering-system-information-using-ioplatformexpertdevice-part-2-8162f3b83415"
---


![Screenshot](/assets/img/2024-05-27-MacOSAttackMatrixGatheringSystemInformationusingIOPlatformExpertDevicePart2_0.png)

macOS 시스템의 복잡한 미로를 헤쳐 나가는 레드팀 오퍼레이터들은 현대의 디지털 탐험가로, 가치 있는 데이터를 찾기 위해 모든 구석구석을 탐색합니다. 그들의 사용 가능한 도구 가운데, ioreg 명령어는 어두운 방에서 플래시라이트처럼 반짝이며, 정확하고 명확한 방법으로 기기 하드웨어의 숨겨진 세부 정보를 밝혀내줍니다.

# ioreg 명령어 마스터하기

macOS 시스템 진단의 핵심에는 ioreg 명령어가 있습니다. 이 명령어는 I/O Kit 레지스트리의 광대하고 상세한 세계를 해제하는 열쇠 역할을 합니다. 이 레지스트리는 macOS 시스템에 연결된 모든 장치의 정보를 카탈로그화한 대규모 도서관 역할을 합니다.


<div class="content-ad"></div>

`ioreg` 명령을 효과적으로 다루는 방법을 이해하는 것은 고고학자가 발굴 작업을 위해 적절한 도구를 선택하는 것과 유사합니다. 가장 자세한 통찰을 끄집어내기 위해 설정하는 방법은 다음과 같습니다:

```js
ioreg -c IOPlatformExpertDevice -d 2
```

## 데이터 미로를 탐색하기 위한 필수 플래그

- `ioreg`: 하드웨어 레지스트리의 심층을 탐색하는 것을 시작합니다.
- `-c 클래스`: 특정 클래스의 장치를 대상으로 지정합니다. 방대한 도서관에서 특정 장르를 선택하는 것과 유사합니다. 깊은 시스템 통찰을 얻기 위해 IOPlatformExpertDevice를 찾아보세요.
- `-d 깊이`: 장치 트리를 얼마나 깊게 파고들지 설정하며, 깊이 2로 설정하면 통찰을 얻을 정도로 충분하지만 압도적이지는 않습니다.
- `-l`: 장치의 모든 가능한 세부 정보를 펼쳐서 속성의 매우 상세한 내러티브를 제공합니다.
- `-r`: 하드웨어 트리의 관련 가지에 대해 검색을 집중시켜 불필요한 혼란을 피합니다.

<div class="content-ad"></div>

# 예시 및 샘플 출력 설명

가장 기본적인 명령어를 실행할 때 예상할 수 있는 샘플 출력은 다음과 같습니다:

```js
+-o IOPlatformExpertDevice <class IOPlatformExpertDevice, id 0x100000000,
registered, matched, active, busy 0 (0 ms), retain 10>
{
  "IOPlatformUUID" = "12345678-1234-1234-1234567890AB"
  "model" = <"MacBookPro15,1">
  "serial-number" = <"C02XXXXXXXD1">
  "IOPlatfomSerialNumber" = "C02XXXXXXXD1"
  ...
}
```

이 명령어를 실행하면 IOPlatformExpertDevice에 대한 자세한 정보가 나타나며, 중요하고 종종 숨겨진 속성을 강조해 줍니다.

<div class="content-ad"></div>

- IOPlatformUUID: 시스템을 고유하게 식별하는 디지털 지문 역할을 합니다.
- Model: Mac의 청사진을 공개하여 특정 취약점을 정확히 파악하는 데 중요합니다.
- Serial-Number: 기기의 새겨진 서명으로, 추적 및 인증에 중요합니다.
- IOPlatformSerialNumber: 특수 하드웨어 확인에 사용되는 식별의 보조 기호입니다.
- IOPlatformExpert: 하드웨어 구성 뒤에 숨은 설계자의 이름을 밝혀, 사용자 정의 설정을 알려줍니다.

# Red Team 작전에서의 실제 시나리오

ioreg 명령어를 이용해 레드 팀은 디지털 자물쇠 제작자로 변신할 수 있습니다. 이를 통해 하드웨어 비밀을 밝히고, 시스템의 방어 메커니즘을 우회하거나 악용하는 키를 만들어낼 수 있습니다.

- 대상 프로파일링: 대상 시스템의 특정 아키텍처에 대한 공격을 정밀하게 튜닝하는 것은 특수한 정교한 수트를 만드는 것과 같습니다.
- 자산 무결성 확인: 하드웨어가 변조되지 않았는지 확인하는 것은 금고 속 금의 순도를 확인하는 것과 유사합니다.
- 사용자 정의 악용 개발: 일부 악용은 시스템 하드웨어의 정확한 형태가 필요한데, 이는 자물쇠 디자인을 기반으로 열쇠를 만들어내는 것과 유사합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-MacOSAttackMatrixGatheringSystemInformationusingIOPlatformExpertDevicePart2_1.png)

# 빠른 참조용 치트 시트

- 명령 개요: ioreg -c IOPlatformExpertDevice -d 2: 시스템 하드웨어의 영혼에 대한 손전등.
- 주요 플래그:
  -c: 검사할 장치의 클래스를 선택합니다.
  -d: 탐사 깊이를 설정합니다.
  -l: 각 장치에 대한 상세 설명을 제공합니다.
  -r: 초점을 선명하고 관련성 있게 유지합니다.
- 중요한 출력물:
  IOPlatformUUID: 고유 식별자.
  Model: 장치 모델에 대한 세부 정보.
  SerialNumber: 장치 일련 번호에 대한 정보.
  IOPlatformSerialNumber: 점검 및 균형을 위해 필수적입니다.
  IOPlatformExpert: 장치 구성 전문가에 대한 통찰.

# 결론


<div class="content-ad"></div>


![Image](/assets/img/2024-05-27-MacOSAttackMatrixGatheringSystemInformationusingIOPlatformExpertDevicePart2_2.png)

The `ioreg` command is not just a tool; it's a gateway to the hidden chambers of macOS hardware information. For security professionals, mastering this command is akin to mastering the art of map-making, charting unknown territories, and uncovering secrets that lie beneath the surface of every macOS device.

