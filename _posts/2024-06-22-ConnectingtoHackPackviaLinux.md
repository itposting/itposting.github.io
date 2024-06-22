---
title: "리눅스에서 HackPack 연결하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ConnectingtoHackPackviaLinux_0.png"
date: 2024-06-22 18:54
ogImage: 
  url: /assets/img/2024-06-22-ConnectingtoHackPackviaLinux_0.png
tag: Tech
originalTitle: "Connecting to HackPack via Linux"
link: "https://medium.com/@pappin/connecting-to-hackpack-via-linux-2a2d39c159e3"
---


해프팩은 이번 주에 출시된 크런치랩스의 정말 멋진 엔지니어링 상자에요. 조금 놀다가 흥미로운 것을 발견하면 글을 올릴 거예요.

지금까지의 여정을 공유하고 싶었어요. 저는 아직 조금만 놀아봤는데 IR 터렛을 예비 라즈베리 파이에 연결했어요. 아마존에서 USB-A to USB-C 케이블을 사용했지만 데이터를 전송하는 케이블이면 되요. 정말 쉬웠어요.

- 장치를 연결하고 해제하여 상자가 어떤 tty****에 연결되어 있는지 알아보세요. 저는 /dev/ttyUSB0에 연결됐어요.
- 다음 명령을 사용하여 터미널 라인 설정을 합니다 (필요하면 장치를 바꿔주세요): stty -F /dev/ttyUSB0 raw 9600
- 명령을 실행하세요: cat /dev/ttyUSB0 (또는 다른 장치)

저는 그 후에 버튼 누름에 대한 디버그 데이터를 출력하기 시작했어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-ConnectingtoHackPackviaLinux_0.png" />

어쨌든, 오늘 즐거웠어요!

출처:

- https://arduino.stackexchange.com/questions/79058/access-serial-monitor-on-linux-cli-using-arduino-cli