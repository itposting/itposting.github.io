---
title: "ESP32에서의 WIFI 스팸 전송기"
description: ""
coverImage: "/assets/img/2024-06-19-WIFISpammeronESP32_0.png"
date: 2024-06-19 06:01
ogImage: 
  url: /assets/img/2024-06-19-WIFISpammeronESP32_0.png
tag: Tech
originalTitle: "WIFI Spammer on ESP32"
link: "https://medium.com/@imthedanger/wifi-spammer-on-esp32-f50471599042"
---


안녕하세요 여러분! 오늘은 제 최신 프로젝트인 esp32에서 동작하는 wifi 스팸 전송기에 대해 이야기하려고 해요. 이 프로젝트에 대한 자세한 설명과 만드는 방법에 대해 알려드릴 거에요. 이 기기는 재미있는 이름의 wifi 핫스팟을 많이 생성하고 정기적으로 업데이트하는 기능을 갖추고 있어요.

이 프로젝트는 제가 esp32로 진행한 첫 번째 프로젝트에요. 즐거운 시간을 보냈고, 여러분도 즐겁게 활용할 수 있길 바라요!

자, 시작해봅시다!

이 프로젝트를 위해서는 esp32 보드, microUSB to USB 케이블 (esp32에 코드를 업로드하기 위해), 제 코드, 그리고 필수 모듈이 설치된 Arduino 소프트웨어가 필요해요.

<div class="content-ad"></div>

저기서 보드를 얻었어요

# 소개

## ESP32란?

ESP32은 통합 Wi-Fi 및 블루투스 기능을 갖춘 저렴하고 저전력 시스템 온 칩 (SoC) 마이크로컨트롤러입니다. ESP32에는 520KB의 SRAM이 탑재되어 있으며, 플래시 메모리 용량은 다양할 수 있습니다 (일반적으로 4MB). 즉, 매우 흥미로운, 저렴하고 멋진 제품이에요!

<div class="content-ad"></div>

ESP32를 사용하여 C/C++, Python, JavaScript, Lua, Rust와 같은 다양한 언어로 프로그래밍할 수 있지만 이 프로젝트에서는 Arduino IDE에서 Arduino를 선택했습니다.

# Arduino 및 모듈 설치하기

Arduino 소프트웨어를 설치하세요(소유하고 있지 않은 경우), Boards Manager(도구`보드`보드 관리자)로 이동하고 esp32를 검색하세요. 두 번째 것을 다운로드하세요.

![이미지](/assets/img/2024-06-19-WIFISpammeronESP32_0.png)

<div class="content-ad"></div>

# 코드를 깜빡이기

이후에는 내 GitHub로 가서 코드를 다운로드하고 아두이노 프로그램에서 열어주세요. ESP32 Dev 모듈(도구 '보드')을 선택하고 확인을 누르세요.

이 작업은 코드에서 오류를 확인합니다.

![이미지](/assets/img/2024-06-19-WIFISpammeronESP32_1.png)

<div class="content-ad"></div>

여기서 오류를 받지 않아야 합니다. 그러나 오류가 발생하면 언제든지 저에게 연락해주세요.

이제 노트북에 ESP32와 케이블을 연결하고 업로드를 클릭하세요!

그게 다예요! 이제 잠시 기다렸다가 Wifi 네트워크를 확인해보세요!

![이미지](/assets/img/2024-06-19-WIFISpammeronESP32_2.png)

<div class="content-ad"></div>

축하해요! 잘 했어요!

# 결론

이 프로젝트를 함께 해 주시고 새로운 것을 많이 배워서 즐거우셨기를 바랍니다. 문제가 있었거나 멋진 아이디어가 있다면 언제든지 연락주세요!

더 많은 흥미로운 콘텐츠를 보려면 제 Medium과 GitHub를 팔로우하지 않는 것을 잊지 마세요!

<div class="content-ad"></div>

시간을 내어 주셔서 감사합니다!