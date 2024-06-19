---
title: "3달러 미만으로 USB 러버 덕 만들기"
description: ""
coverImage: "/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_0.png"
date: 2024-06-19 17:48
ogImage: 
  url: /assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_0.png
tag: Tech
originalTitle: "Make a USB Rubber Ducky with less than $3"
link: "https://medium.com/bugbountywriteup/make-usb-rubber-ducky-with-less-than-3-fa72dac9e4de"
---


USB Rubber Ducky는 USB 플래시 드라이브와 비슷하지만 다릅니다. 컴퓨터를 해킹하기 위해 일부 페이로드를 이용하여 키 입력을 삽입할 것입니다. 가장 좋은 점은 USB Rubber Ducky가 플래시 드라이브로 감지되지 않고 키보드로 감지된다는 것입니다.

Hack5에서 이 종류의 USB를 $49.99에 판매합니다.

<img src="/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_0.png" />

그래서, $3보다 적게 들여 USB Rubber Ducky를 만드는 방법은 무엇일까요?

<div class="content-ad"></div>

디지스파크이 해답이야.

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_1.png)

마켓에서 $2.94에 디지스파크 Attiny 85를 샀어. 디지스파크는 6kb 메모리를 가진 프로그래밍 가능한 보드야. 정말 작은 아두이노 같아.

USB Rubber Ducky를 만들기 위해서는 이거만 있으면 돼:
1. 디지스파크 Attiny 85 ($2.94)
2. 아두이노 IDE
3. 음악이 있는 커피 한 잔.

<div class="content-ad"></div>

환경 설정 [Linux]

- https://www.arduino.cc/en/software 에서 최신 Arduino 소프트웨어를 다운로드하고 설치합니다. 이 프로젝트에서는 Linux 64 비트용 Arduino IDE 1.8.19를 사용했습니다. 이 튜토리얼에서는 Arduino IDE 설치를 건너뛸 것입니다.

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_2.png)

- Arduino IDE를 실행하고 파일 메뉴로 이동하여 환경 설정을 선택합니다. 그런 다음 추가 보드 관리자 URL에 이 링크를 입력하세요.

<div class="content-ad"></div>

```js
http://digistump.com/package_digistump_index.json
```

그리고 확인을 클릭하세요.

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_3.png)

- 도구 메뉴로 이동한 다음, 보드 하위 메뉴로 이동하여 보드 관리자를 선택합니다. 유형 필드에서 Contributed를 선택하고 Digistump AVR 보드를 설치하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_4.png" />

- 설치가 끝나면 Boards Manager 창을 닫으세요.
- 마지막 단계에서, 메인 보드로 Digispark (Default — 16.5mhz)를 선택하세요.
도구 메뉴로 이동하신 후, Boards 하위 메뉴로 이동하여 Digistump AVR 보드를 클릭하고 Digispark (Default — 16.5mhz)를 선택하세요.

Digispark 환경 설정이 완료되었습니다.

예제 코드로 테스트하기

<div class="content-ad"></div>

- "예제" 파일에서 테스트 코드를 사용해보세요.` DigisparkKeyboard ` Keyboard.

```js
#include "DigiKeyboard.h"
void setup() {
  // DigiKeyboard를 사용하기 위해 설정할 필요가 없습니다.
}
void loop() {
  DigiKeyboard.sendKeyStroke(0);
  DigiKeyboard.println("Hello Digispark!");
  DigiKeyboard.delay(5000);
}
```

코드를 확인하고, 문제가 없다면 확인 버튼 오른쪽에 있는 업로드 버튼을 클릭하세요.

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_5.png)

<div class="content-ad"></div>

그리고 Digispark를 연결하세요.

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_6.png)

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_7.png)

업로드가 완료되면 Digispark를 분리하고 $3 미만으로 USB Rubber Ducky를 만들었습니다. 축하합니다!

<div class="content-ad"></div>

테스트

문제 해결

- 이와 같은 오류가 발생하는 경우:

`<img src="/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_8.png" />`

<div class="content-ad"></div>

리눅스 민트에서는 libusb-dev를 설치하기만 하면 됩니다.

```js
sudo apt install libusb-dev
```

- 코드를 업로드한 후에 디지스파크가 감지되지 않고, dmesg 정보가 다음과 같이 표시된다면:

<div class="content-ad"></div>

요청하신 작업을 진행해 보세요:

```js
sudo udevadm control --reload-rules
```

그리고 dmesg 명령어를 다시 실행해보세요. 터미널에 아래와 같이 표시되면 Arduino IDE를 사용하여 다시 업로드할 수 있습니다.

![이미지](/assets/img/2024-06-19-MakeaUSBRubberDuckywithlessthan3_10.png)

<div class="content-ad"></div>

다른 문제 해결을 위해 'https://digistump.com/wiki/digispark/tutorials/linuxtroubleshooting'에서 참조할 수 있습니다.

결론

USB Rubber Ducky는 자동화된 키보드 입력을 지원하여 귀하의 작업을 도와줄 강력한 도구가 될 것입니다. 나쁜 사람이라면, 이 USB는 누군가의 PC를 해킹하는 도구로 활용될 수 있습니다.

오늘 무엇인가 배웠나요?
도움이 되었다면 좋았을텐데요 :D