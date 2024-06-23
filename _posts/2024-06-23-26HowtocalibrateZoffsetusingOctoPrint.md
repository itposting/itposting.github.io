---
title: "OctoPrint로 Z 오프셋 조정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-26HowtocalibrateZoffsetusingOctoPrint_0.png"
date: 2024-06-23 17:24
ogImage: 
  url: /assets/img/2024-06-23-26HowtocalibrateZoffsetusingOctoPrint_0.png
tag: Tech
originalTitle: "26. How to calibrate Z offset using OctoPrint?"
link: "https://medium.com/@hellosimplexdesigns/26-how-to-calibrate-z-offset-using-octoprint-e7b03630a0ff"
---


<img src="/assets/img/2024-06-23-26HowtocalibrateZoffsetusingOctoPrint_0.png" />

가끔씩 Z 오프셋을 보정하는 데 어려움을 겪곤 합니다. 며칠 전에 Ender3 엑스트루더와 노즐을 모두 금속으로 교체했는데 Z 오프셋을 다시 보정해야 한다는 것을 깨달았죠.

OctoPrint를 사용하여 Z 오프셋을 보정하는 단계를 아래에 소개해 드릴게요. OctoPrint에서 터미널 탭을 열고 다음 명령을 입력하세요.

```js
// Z 오프셋 재설정
M851 Z0
// 설정을 eeprom에 저장
M500
// 활성 매개변수 설정
M501
활성 매개변수 표시
M503
// Z 축 원점 복귀
G28 Z
// 노즐을 실제 0 오프셋으로 이동
G1 F60 Z0
// 소프트 엔드스톱 끄기
M211 S0
```

<div class="content-ad"></div>

용접기 갈고리를 침대 쪽으로 천천히 이동시켜서 종이가 거의 움직이지 않을 때까지 맞춰주세요. Octoprint의 제어 탭을 사용하여 Z 축을 조정해보세요. 프린터 디스플레이에 표시된 Z 값을 확인하세요. 그 숫자에 균질 측정지나 장치의 측정 값을 더해보세요. A4용지 한 장은 대략 0.05mm 두꺼워요.

```js
// 여기서 X.XX는 당신이 얻은 z 옵셋을 의미합니다
M851 Z X.XX
// 예시: M851 Z -2.44 (- 부호는 항상 음수여야 해요. 명령어에서 음수 부호를 주목하세요)
// Soft Endstops 활성화
M211 S1
// 설정을 EEPROM에 저장
M500
// 활성 매개변수 설정
M501
// 현재 설정 표시
M503
```

Octoprint의 터미널 탭:

![Octoprint Terminal Tab](/assets/img/2024-06-23-26HowtocalibrateZoffsetusingOctoPrint_1.png)

<div class="content-ad"></div>

10월 3일 Octoprint의 Control 탭에서 Z축 이동에 대한 미세 조정을 할 수 있어요:

![이미지](/assets/img/2024-06-23-26HowtocalibrateZoffsetusingOctoPrint_2.png)

참고 자료:

BLTouch 침대 레벨링 프로브로 Z 오프셋 보정하기

<div class="content-ad"></div>

가이드: 오토 베드 레벨링 (ABL) 센서를 교정하는 방법

3D 프린터를 위한 쉬운 Z-오프셋 조정

"기울어지는" 베드 레벨링 결과를 고치는 방법

이전 | 색인 | 다음