---
title: "Ai-Thinker LoRaWAN 모듈 Ra-08H 2차 개발 가이드 시작하기"
description: ""
coverImage: "/assets/img/2024-06-23-Ai-ThinkerLoRaWANModuleRa-08HSecondaryDevelopmentGettingStartedGuide_0.png"
date: 2024-06-23 17:15
ogImage: 
  url: /assets/img/2024-06-23-Ai-ThinkerLoRaWANModuleRa-08HSecondaryDevelopmentGettingStartedGuide_0.png
tag: Tech
originalTitle: "Ai-Thinker LoRaWAN Module Ra-08(H) Secondary Development Getting Started Guide"
link: "https://medium.com/@taraqiuaithinker/ai-thinker-lorawan-module-ra-08-h-secondary-development-getting-started-guide-3d3fbf9b43bb"
---


# 내용

## 0. 소개

Ai-Thinker는 IoT 무선 디자인 전문가로, 제조와 배포가 간단하고 유연하며 쉬운 솔루션에 중점을 두고 있습니다. Ai-Thinker는 안정적인 성능과 저전력 소비를 갖춘 통합 SoC를 사용한 무선 시스템 수준 모듈 제품을 개발하고 설계합니다. 또한 Wi-Fi, LoRaWAN, Bluetooth 및 UWB 기능을 갖춘 다양한 모듈을 제공하며, 이러한 모듈은 우수한 RF 성능을 갖추고 있습니다.

Ra-08(H) 모듈은 Ai-Thinker 기술과 상하이 ASR 마이크로 일렉트로닉스(ASR)가 심층적으로 공동 개발한 LoRaWAN 모듈입니다. 이 리포지토리는 LoRaWAN 모듈 SoC의 이차 개발을 시작하는 가이드입니다. 해당 칩 모델은 ASR6601CB이며, 플래시 128 KB, SRAM 16 KB, 32비트 48 MHz ARM Cortex-M4 커널을 탑재하고 있습니다.

<div class="content-ad"></div>

Ra-08(H) 모듈에는 기본적으로 내장된 AT 펌웨어 프로그램이 있어 LoRaWAN 게이트웨이에 직접 연결할 수 있습니다. Ali LinkWAN에 연결해야 하는 경우, 이 저장소 코드를 프로그래밍해야 합니다.

# 1.목적

리눅스 환경을 기반으로 이 문서는 An-Thinker의 Ra-08(H) 모듈의 포인트 투 포인트 통신의 2차 개발 과정을 소개합니다. 참고용으로 제공됩니다.

# 2.하드웨어 준비

<div class="content-ad"></div>

• 리눅스 환경
컴파일 및 프로그래밍 및 실행 작업에 필요한 환경으로, 이 문서는 (Ubuntu18.04)을 예로 듭니다.

- 장비
Ai-Thinker의 알리바바 스토어에서 샘플을 받아 2개의 모듈과 안테나를 구해주세요.
- USB 케이블
PC와 Ra-08 개발 보드를 연결하여 프로그램을 업로드하고 다운로드하며 로그를 확인할 수 있습니다.

# 3. Ra-08 개발 보드 준비

판매 모듈지원 여부Ra-08지원Ra-08H지원

<div class="content-ad"></div>

# 4. 컴파일러 환경 설정

```js
sudo apt-get install gcc-arm-none-eabi git vim python python-pip
pip install pyserial configparser
```

# 5. SDK 준비

```js
git clone --recursive https://github.com/Ai-Thinker-Open/Ai-Thinker-LoRaWAN-Ra-08.git
```

<div class="content-ad"></div>

# 6. 컴파일 및 프로그래밍 및 실행

# 6.1 컴파일

# 6.1.1 환경 변수 구성

```js
source build/envsetup.sh
```

<div class="content-ad"></div>

# 6.1.2 상호 통신 컴파일 예시

```bash
cd projects/ASR6601CB-EVAL/examples/lora/pingpong/
make
```

상호 통신 컴파일 예시

```bash
"arm-none-eabi-size" out/pingpong.elf
   text    data     bss     dec     hex filename
  21312    1092    4656   27060    69b4 out/pingpong.elf
앱을 다운로드하려면 'make flash' 또는 다음 명령어를 실행하십시오.
python /mnt/d/GitHub/ASR6601_AT_LoRaWAN/build/scripts/tremo_loader.py -p /dev/ttyUSB0 -b 921600 flash 0x08000000 out/pingpong.bin
```

<div class="content-ad"></div>

시리얼 포트를 확인하고, 예를 들어, 여기서 내 액세스 시리얼 포트는 /dev/ttyUSB2입니다：

```js
python /mnt/d/GitHub/ASR6601_AT_LoRaWAN/build/scripts/tremo_loader.py -p /dev/ttyUSB2 -b 921600 flash 0x08000000 out/pingpong.bin
```

# 6.2 프로젝트 컴파일 파일 제거 및 컴파일 및 플래시 및 펌웨어 다운로드 및 보기

USB 케이블을 장치와 PC에 연결하고, 프로그래밍 포트가 올바른지 확인한 후, 아래 단계를 따라 모듈을 다운로드 모드로 전환하세요.

<div class="content-ad"></div>


![Ai-Thinker LoRaWAN Module Ra-08H Secondary Development Getting Started Guide](/assets/img/2024-06-23-Ai-ThinkerLoRaWANModuleRa-08HSecondaryDevelopmentGettingStartedGuide_0.png)

첫 번째로 하드웨어에 연결하려면 기본 포트 번호와 보레이트를 수정하고, \build\make\common.mk 파일에서 수정해주세요:

```js
# flash settings
TREMO_LOADER := $(SCRIPTS_PATH)/tremo_loader.py
SERIAL_PORT        ?= /dev/ttyUSB0
SERIAL_BAUDRATE    ?= 921600
```

# 6.2.1 프로젝트 컴파일 파일 지우기


<div class="content-ad"></div>

```js
make clean
```

## 6.2.2 프로그램 불러오기

```js
make flash
```

## 6.2.3 실행하기

<div class="content-ad"></div>

두 개의 Ra-08-Kit 개발 보드에서 RST 버튼을 누르면 다음 로그를 확인할 수 있습니다:

```js
Received: PING
Sent: PONG
Received: PING
Sent: PONG
Received: PING
Sent: PONG
Received: PING
Sent: PONG
Received: PING
Sent: PONG
Received: PING
Sent: PONG
```

SDK: https://github.com/Ai-Thinker-Open/Ai-Thinker-LoRaWAN-Ra-08

지원이 필요하시면 연락해주세요.

<div class="content-ad"></div>

Email: tara@aithinker.com

Whatsapp/wechat: +8615817421307