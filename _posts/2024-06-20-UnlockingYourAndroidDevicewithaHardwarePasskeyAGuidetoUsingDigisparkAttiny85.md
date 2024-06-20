---
title: "하드웨어 패스키로 안드로이드 장치 잠금 해제하기 Digispark Attiny85 사용 가이드"
description: ""
coverImage: "/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_0.png"
date: 2024-06-20 17:09
ogImage: 
  url: /assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_0.png
tag: Tech
originalTitle: "Unlocking Your Android Device with a Hardware Passkey: A Guide to Using Digispark Attiny85"
link: "https://medium.com/@kamiy2j/unlocking-your-android-device-with-a-hardware-passkey-a-guide-to-using-digispark-attiny85-ca9f8e16d40a"
---


우리 모두 한 번쯤은 그 순간을 겪어봤죠—핸드폰 잠금 상태에서 핀 코드를 기억하지 못하는 그 순간. 무수히 입력했지만 이제 손가락이 주저하는 그 순간. 근육 기억에 의지하지만 그것조차 실망스러운 것 같아요. 이런 순간들이 우리에게 이 중요한 보안 코드를 잊어버리기 쉬운지 상기시켜 줍니다.

다행히도 이 문제에 대한 혁신적인 해결책이 즉시 사용 가능한 것 같아요. 이 해결책은 보통의 비밀번호 알림과는 다릅니다. 하드웨어 패스키입니다—당신의 핸드폰이나 컴퓨터에 연결되면 핀 코드를 자동으로 입력해주는 소형 회로입니다. 이 기술적인 놀라움은 주로 10달러 미만으로 구할 수 있는 저렴한 Digispark Attiny85 보드로 구현할 수 있어요.

본 기사에서는 직접 하드웨어 패스키를 만드는 단계별 가이드를 안내해 드릴게요.

![이미지](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_0.png)

<div class="content-ad"></div>

## 요구 사항:

- Windows 컴퓨터
- Digispark Attiny85 보드
- 안드로이드 폰
- 아두이노 소프트웨어

# 아두이노 설정

- 공식 웹사이트에서 아두이노 다운로드
- 파일 -` 기본 설정 -` 설정 -` 추가 보드 관리자 URL로 이동
- 다음 URL을 목록에 추가하고 저장: https://raw.githubusercontent.com/digistump/arduino-boards-index/master/package_digistump_index.json

<div class="content-ad"></div>


![Step 1](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_1.png)

- Go to Tools -> Board -> Boards Manager..., search for “digistump”, and install “Digistump’s AVR Boards”.

![Step 2](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_2.png)

![Step 3](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_3.png)


<div class="content-ad"></div>

- Windows 10 사용자들은 usbser 드라이버 설치 중 실패할 수 있습니다. 그런 경우에는 여기서 직접 다운로드할 수 있습니다: [https://github.com/digistump/DigistumpArduino/releases/download/1.6.7/Digistump.Drivers.zip](https://github.com/digistump/DigistumpArduino/releases/download/1.6.7/Digistump.Drivers.zip) 다운로드한 파일을 압축 해제하고 DPinst64.exe를 실행하여 드라이버를 설치하세요.
- 아두이노 인터페이스에서 Tools -` Board -` Digistump AVR Boards -` Digispark (Default 16.5 MHz)를 선택하세요.

![이미지](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_4.png)

설정이 완료되었습니다! 이제 스케치 코드를 작성할 준비가 되었습니다!!

# 페이로드 코딩

<div class="content-ad"></div>

저희 스케치에는 두 가지 미리 정의된 함수가 있습니다: setup()과 loop(). 이 튜토리얼에서는 PIN 코드가 '1234'라고 가정해봅시다. 우리의 코드는 다음과 같이 보일 것입니다:

```js
#include "DigiKeyboard.h"

void setup() {
  // setup에서 할 일이 없습니다.
}

void loop() {
  // 이 지연은 컴퓨터가 DigiSpark를 인식하는 데 시간을 주기 위한 것입니다.
  // 연결 후 2000밀리초는 2초입니다.
  DigiKeyboard.delay(2000);

  // 이제 PIN에 대한 키 입력을 보낼 것입니다.
  DigiKeyboard.println("1234");

  // PIN을 입력한 후, 다시 입력하기 전에 오랜 지연을 할 것입니다.
  // 이는 DigiSpark가 플러그를 꽂은 채로 있는 경우 계속해서 PIN을 입력하지 않도록 방지하기 위한 것입니다.
  DigiKeyboard.delay(60000);
}
```

이 코드를 입력한 후, "Verify" 버튼을 클릭하여 컴파일 및 오류 확인을 실행해주세요.

<div class="content-ad"></div>

이미지 태그를 Markdown 형식으로 변경하세요.


![Unlocking Your Android Device with a Hardware Passkey - A Guide to Using Digispark Attiny85](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_6.png)

![Unlocking Your Android Device with a Hardware Passkey - A Guide to Using Digispark Attiny85](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_7.png)

# 페이로드 업로드

Attiny85 보드에 코드를 업로드하는 중:


<div class="content-ad"></div>

- 아두이노 인터페이스에서 업로드 버튼을 클릭하세요.

![이미지](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_8.png)

- "지금 장치를 연결하세요... (60초 후 타임아웃)"라는 메시지가 나오면 Attiny85 보드를 컴퓨터의 USB 포트에 연결하세요.

![이미지](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_9.png)

<div class="content-ad"></div>

- "Micronucleus done. Thank you!" 메시지가 표시될 때까지 기다렸다가 USB 포트에서 보드를 제거해주세요.

![이미지](/assets/img/2024-06-20-UnlockingYourAndroidDevicewithaHardwarePasskeyAGuidetoUsingDigisparkAttiny85_10.png)

축하합니다! 이제 하드웨어 패스키를 사용할 준비가 되었습니다.

# 패스키 테스트:

<div class="content-ad"></div>

Windows에서는 메모장을 열고 패스키를 연결하세요. 자동으로 PIN 코드를 입력해줄 것입니다.

## 온라인 PIN 저장소 또는 비밀번호 관리자보다 하드웨어 패스키의 장점:

- 오프라인 저장: 하드웨어 패스키는 오프라인이므로 온라인 해킹에 취약성이 낮습니다. 당신의 PIN은 인터넷 서버에 저장되지 않아 보안이 향상됩니다.
- 타사 신뢰 불필요: 비밀번호 관리 애플리케이션과는 달리, 하드웨어 패스키는 데이터를 보호하기 위해 제3자에게 신뢰를 두지 않아도 됩니다.
- 마스터 비밀번호 필요 없음: 비밀번호 관리자는 마스터 비밀번호가 필요한데, 이를 잊어버리면 잠금 상태가 될 수 있습니다. 하드웨어 패스키는 PIN을 자동 입력하여 이 문제를 피할 수 있습니다.

기억하세요, 완벽한 해결책은 없습니다. 하드웨어 패스키에는 잠재적인 보안 문제도 있으니 아래 섹션에서 자세히 설명하겠습니다. 당신의 디지털 보안 요구 및 편안함에 맞는 최상의 솔루션을 선택하세요.

<div class="content-ad"></div>

## 하드웨어 패스키에 대한 잠재적 보안 위험:

하드웨어 패스키는 기기 접근을 간단하게 만들지만, 관련된 보안 문제를 고려하는 것이 중요합니다:

- 물리적 보안: 분실되거나 도난당하면 패스키를 사용하여 당신의 기기에 무단 접근할 수 있습니다. 안전하게 보관하세요.
- 악성 소프트웨어: 프로그래밍 기기가 감염되면 악성 소프트웨어가 패스키에 감염될 수 있습니다. 최신 백신 소프트웨어로 기기를 보호하세요.
- 하드코딩된 PIN: 숙련된 개인이 패스키에서 하드코딩된 PIN을 추출할 수 있습니다. 안전하게 다루세요.

편리하더라도, 이러한 잠재적 보안 위험을 고려하여 하드웨어 패스키를 책임있게 사용하는 것이 중요합니다.

<div class="content-ad"></div>

# 마무리 글

저렴한 Digispark Attiny85 보드로 구동되는 하드웨어 패스키는 잊혀진 PIN에 대한 일반적인 문제에 효과적이고 오프라인 솔루션을 제공합니다. 온라인 저장소나 비밀번호 관리 앱 대안으로 사용자 친화적이며 편리함과 통제를 동시에 제공합니다.

그러나 이 도구를 사용하는 동안 물리적 보안 및 악성 소프트웨어 위협과 같은 잠재적인 위험을 인식하는 것이 중요합니다. 안드로이드용 하드웨어 패스키를 만드는 가이드이지만 기술 책임성의 보다 넓은 맥락을 무시할 수는 없습니다.

본질적으로, 하드웨어 패스키는 기술이 우리 삶을 간편하게 만들 수 있는 잠재력을 상징합니다. 이러한 솔루션을 계속 탐구할 때 우리는 편의와 안전한 사용을 균형있게 고려해야 합니다.

<div class="content-ad"></div>

제 Medium 계정을 팔로우하여 제 기술 여정을 계속 지켜보세요. 그리고 만약 함께 힘을 합쳐 기술 세계를 정복하고 싶다면, LinkedIn에서 연결해요!