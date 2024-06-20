---
title: "라즈베리 파이 4와 I2C 백팩을 사용한 LCD 디스플레이 설정 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_0.png"
date: 2024-06-19 18:24
ogImage: 
  url: /assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_0.png
tag: Tech
originalTitle: "How to Set Up a Raspberry Pi 4 with LCD Display Using I2C Backpack"
link: "https://medium.com/@thedyslexiccoder/how-to-set-up-a-raspberry-pi-4-with-lcd-display-using-i2c-backpack-189a0760ae15"
---


이 튜토리얼에서는 Raspberry Pi 4에 I2C 백팩을 사용하여 LCD 디스플레이를 설정하는 방법을 배우게 됩니다. 16x2 및 20x4 디스플레이 양쪽을 지원합니다. 초보자이든 경험이 풍부한 메이커이든 이 튜토리얼을 통해 프로젝트를 간소화하고 Raspberry Pi 프로젝트에 사용하기 쉬운 LCD로 빠르게 시작할 수 있습니다!

시작하기 전에 다음 사항이 있는지 확인하세요:

- Raspberry Pi 4
- 16x2 LCD 디스플레이 또는 20x4 LCD 디스플레이
- 4 점퍼 와이어 (female to female)

시작해봅시다! 🚀

<div class="content-ad"></div>

과정:

라즈베리 파이 4에 LCD 디스플레이를 연결하기 전에 안전을 위해 전원을 끄는 것이 중요합니다. 라즈베리 파이를 꺼두면 LCD 디스플레이를 I2C 인터페이스를 사용하여 라즈베리 파이 4에 연결하세요.

I2C 백팩과 라즈베리 파이 사이에 안전한 연결을 하려면 다음과 같이 점퍼 와이어를 사용하세요:

```js
- VCC (전원)를 5V 핀에 연결하세요 (핀 4)
- GND (그라운드)를 임의의 GND 핀에 연결하세요 (핀 6)
- SDA (데이터)를 GPIO 2에 연결하세요 (핀 3)
- SCL (클럭)을 GPIO 3에 연결하세요 (핀 5)
```

<div class="content-ad"></div>

LCD를 연결한 후 라즈베리 파이를 켜서 밝기와 대조를 미세 조정할 수 있습니다. 이를 위해 디스플레이 뒷면에 위치한 포텐셔미터를 사용하여 파란 상자를 조정하여 원하는 설정을 얻을 때까지 조절하십시오.

이제 터미널에서 다음 명령을 실행하여 라즈베리 파이를 업데이트하세요: 

<div class="content-ad"></div>

```js
sudo apt-get update
```

라즈베리 파이에는 I2C가 기본적으로 설치되어 있지만 기본적으로 활성화되어 있지 않습니다. 따라서 I2C를 활성화하는 두 가지 방법이 있습니다: 그래픽 사용자 인터페이스(GUI) 또는 명령줄. 아래에서 두 방법에 대해 안내하겠습니다.

먼저, 내가 생각하기에 가장 빠르고 쉬운 방법은 다음과 같이 GUI를 사용하여 I2C를 활성화하는 것입니다:

```js
Application Menu > Preferences > Raspberry Pi Configuration
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_2.png" />

라즈베리 파이 구성 도구가 열리면 인터페이스 탭으로 이동하세요. 인터페이스 탭에서 I2C 옆의 '활성화'를 선택하고 작업을 마치면 '확인'을 클릭하세요.

<img src="/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_3.png" />

I2C를 활성화하는 두 번째 방법은 라즈베리 파이 터미널을 열고 다음 명령을 입력하는 것입니다:

<div class="content-ad"></div>

```js
sudo raspi-config
```

라즈베리 파이 구성 도구를 열었으면, 인터페이싱 옵션 메뉴로 이동하여 I2C를 선택하세요. 그런 다음 '예'를 선택하고 Enter 키를 눌러 I2C를 활성화하세요. 마지막으로 '완료'를 선택하여 raspi-config 도구를 종료하세요.

멋지네요! 선호하는 방법을 선택한 후 — 그래픽 사용자 인터페이스(GUI) 또는 명령줄 — 라즈베리 파이에서 I2C 인터페이스를 활성화할 수 있습니다!

I2C 인터페이스를 활성화한 후에는 변경 사항이 적용되도록 라즈베리 파이를 다시 부팅해야 합니다.

<div class="content-ad"></div>


sudo reboot


라즈베리 파이가 재부팅되면 I2C 인터페이스가 활성화되어 사용 가능해집니다.

다음으로, I2C 작업에 필요한 두 가지 도구를 설치해야 합니다. 먼저, 다음 명령어를 라즈베리 파이 터미널에서 실행해 주세요:


sudo apt-get install -y i2c-tools python3-smbus


<div class="content-ad"></div>

아래는 Markdown 형식으로 표시된 표입니다.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*l729wFdWO1ZWaKo47r7-Pg.gif)

다음으로는 다음 명령어를 실행하여 I2C 커널 모듈이 이미로드되어 있는지 확인할 수 있습니다:

```js
lsmod | grep i2c_
```

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*qDrlq9AL9S2deU_wOcETYQ.gif)

<div class="content-ad"></div>

만약 출력이 i2c_bcm2835 또는 i2c_bcm2708 그리고 i2c_dev 모듈을 보여주면 다음 단계로 건너뛸 수 있어요. 하지만 아니라면, 계속 진행해 볼까요?

부팅 시 로드되도록 /etc/modules 파일에 I2C 커널 모듈을 추가하기 위해:

```bash
sudo nano /etc/modules

i2c-bcm2835
i2c-bcm2708
i2c-dev
```

그리고, Control+X (종료)를 눌러 나가고 파일 이름을 덮어쓰기 위해 Enter 키를 누르세요.

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*aSoaYOvlXfjAdWZAuO4LqQ.gif)

Raspberry Pi를 다시 부팅하려면:

```shell
sudo reboot
```

![image](/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_4.png)


<div class="content-ad"></div>

이제 기본 작업이 완료되었으니, I2C 장치 테스트로 넘어가 보세요!

터미널에서 연결된 장치를 스캔하는 명령을 입력하세요:

```js
sudo i2cdetect -y 1
```

결과는 I2C 배선의 주소를 표시해줄 것입니다 (보통 0x27이나 0x3F입니다). 이 주소를 기록해두세요. 이후에 필요할 것입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_5.png" />

좋아요! 터미널에서 '27'이 강조된 행렬이 반환되었군요. 이는 우리의 I2C가 감지되었고 올바르게 작동 중임을 의미합니다.

좋아요, 거의 끝났어요! 이제 LCD 디스플레이를 실행할 Python 스크립트를 작성할 시간입니다.

아래 명령을 실행하여 LCD 디스플레이용 Python 라이브러리를 설치해주세요:

<div class="content-ad"></div>

```js
sudo pip3 install RPLCD smbus2
```

![Image](https://miro.medium.com/v2/resize:fit:1400/1*Nsrz4BRdc32AqjvTxWJFnw.gif)

다음으로, 라즈베리 파이 터미널에서 다음 명령어로 새로운 파이썬 스크립트를 생성하세요:

```js
nano lcd_display.py
```

<div class="content-ad"></div>

이전에 메모한 I2C 백팩 주소로 '0x27'을 대체하여 아래 코드를 입력해주세요:

```js
from RPLCD.i2c import CharLCD

lcd = CharLCD(i2c_expander='PCF8574', address=0x27, port=1, cols=16, rows=2, dotsize=8)
lcd.clear()

lcd.write_string('Hello, World!')
```

그리고 파일을 저장하고 텍스트 편집기를 종료해주세요.

<img src="https://miro.medium.com/v2/resize:fit:1400/1*Wri-174OJp9pD5r45bNCog.gif" />

<div class="content-ad"></div>

스크립트를 실행하고 LCD 디스플레이를 테스트해보세요!

터미널에서 다음 명령을 사용하여 Python 스크립트를 실행하세요:

```js
python3 lcd_display.py
```

![LCD Display](/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_6.png)

<div class="content-ad"></div>

LCD 디스플레이는 이제 "Hello, World!" 텍스트를 표시해야 합니다!

![이미지](/assets/img/2024-06-19-HowtoSetUpaRaspberryPi4withLCDDisplayUsingI2CBackpack_7.png)

이 튜토리얼의 단계를 완료한 후에는 LCD 디스플레이에 "Hello, World!" 텍스트가 표시되어야 합니다. 디스플레이에서 이 메시지를 볼 수 있다면, Raspberry Pi 4와 성공적으로 연결되고 작동 중이라는 뜻입니다!

그러나 텍스트가 표시되지 않거나 문제가 발생하는 경우, 배선, I2C 주소, Python 스크립트를 다시 확인하여 모든 것이 정확한지 확인해보세요. 이렇게 하면 어떠한 문제도 빠르게 해결하고 LCD 디스플레이를 신속하게 구동시킬 수 있습니다.

<div class="content-ad"></div>

🎉 축하합니다! 🎉 라즈베리 파이 4를 I2C 백팩을 사용하여 LCD 디스플레이와 성공적으로 설정했네요. Python 스크립트를 수정하여 다양한 메시지를 표시하거나 LCD를 다양한 센서 및 구성 요소와 통합하여 더 고급 애플리케이션을 만들 수 있습니다.

이 다재다능한 설정을 통해 가정 자동화 시스템, 기상 관측소, 심플한 게임 등 다양한 프로젝트를 개발할 수 있습니다. 가능성은 무한하고 이제 당신은 발전의 견고한 기초를 갖고 있습니다. 즐거운 실험을 해보세요!

고지: 본 문서에는 제품 광고 링크가 포함되어 있습니다.