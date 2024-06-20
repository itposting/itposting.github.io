---
title: "아두이노 Uno를 사용한 생일 축하 메시지"
description: ""
coverImage: "/assets/img/2024-06-19-BirthdayGreetingsUsingArduinoUno_0.png"
date: 2024-06-19 17:47
ogImage: 
  url: /assets/img/2024-06-19-BirthdayGreetingsUsingArduinoUno_0.png
tag: Tech
originalTitle: "Birthday Greetings Using Arduino Uno"
link: "https://medium.com/@syahrulmahar92/birthday-greetings-using-arduino-uno-d818a48b8099"
---


아두이노 Uno를 사용하여 독특한 생일 축하 인사를 만드는 흥미진진한 튜토리얼에 오신 것을 환영합니다! 여러분이 전문 전자기기 애호가이든 호기심 많은 초보자이든, 이 프로젝트는 창의성과 기술을 절묘하게 결합하는 환상적인 방법입니다. 사랑하는 사람들에게 깜짝 놀라운 생일 메시지를 전달하는 것을 상상해보세요. 깜박이는 LED, 사용자 지정 멜로디 또는 다양한 텍스트 표시를 통해 맞춤식 생일 메시지를 전달할 수 있습니다. 이 튜토리얼에서는 아두이노 설정, 코드 작성 및 구성 요소 조립 단계별로 안내하여 특별한 생일 인사를 만들어보세요. 시작해보고 기술의 마법으로 생일을 더욱 기억에 남도록 만들어봅시다!

## 필요한 부품:

- 아두이노 Uno
- 점퍼 와이어
- 1k 옴 저항기
- 브레드보드
- 아두이노 LCD I2C
- 부저
- 3개의 LED

## 회로도

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-BirthdayGreetingsUsingArduinoUno_0.png" />

## 코드

코딩 섹션으로 넘어가기 전에, Arduino의 다양한 노래를 찾아보기 위해 이 링크를 클릭하는 것을 제안합니다. 이 튜토리얼에서는 프로젝트에 적합한 "생일 축하" 노래를 사용할 것입니다.
우리는 먼저 Arduino의 핀을 정해야 합니다. 특히 3개의 LED와 부저를 위한 모든 구성 요소를 확인해야 합니다.

이제 코드로 들어가 보겠습니다!

<div class="content-ad"></div>

```js
#include <LiquidCrystal_I2C.h>      // LCD I2C 라이브러리 포함

// LCD 주소를 16글자 2줄 디스플레이에 맞게 0x27로 설정
LiquidCrystal_I2C lcd(0x27, 16, 2);

// 각 컴포넌트 핀을 정의
int red = 7;
int yellow = 6;
int green = 5;
int buzzer = 9;

// Happy Birthday 노래의 각 음표를 정의
#define NOTE_B0  31
#define NOTE_C1  33
...
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8 4699
#define NOTE_DS8 4978
#define REST     0

int tempo = 140;

// 멜로디에 따른 음표 및 지속 시간
int melody[] = {
    NOTE_C4, 4, NOTE_C4, 8,
    ... // 중략

int notes = sizeof(melody) / sizeof(melody[0]) / 2;
// 4분 음표의 지속 시간 계산
int wholenote = (60000 * 4) / tempo;

int divider = 0, noteDuration = 0;

void setup()
{
    screen();
    for (int thisNote = 0; thisNote < notes * 2; thisNote = thisNote + 2) {
        // 각 음표의 지속 시간 계산
        divider = melody[thisNote + 1];
        if (divider > 0) {
            // 일반 음표
            noteDuration = (wholenote) / divider;
        } else if (divider < 0) {
            // 점 음표 처리
            noteDuration = (wholenote) / abs(divider);
            noteDuration *= 1.5; // 점 음표의 지속 시간 증가
        }

        // 음표의 90%를 재생하고 나머지 10%는 일시 정지
        tone(buzzer, melody[thisNote], noteDuration * 0.9);

        // 다음 음표를 재생하기 전에 해당 시간만큼 대기
        delay(noteDuration);

        // 다음 음표를 재생하기 전에 임시 정지
        noTone(buzzer);
    }
    digitalWrite(red, 0);
    digitalWrite(yellow, 0);
    digitalWrite(green, 0);
    lcd.clear();
}

void loop() {
}
```

첫 번째 코드 줄을 살펴보면, 우리는 LiquidCrystal_I2C에 의해 불러온 LCD 라이브러리를 포함했습니다. 그 다음 줄에서는 5, 6, 7, 9 핀을 LED 및 부저와 같은 컴포넌트에 연결했습니다.

우리가 해야 할 중요한 작업은 위에서 제공된 링크로부터 얻은 "Happy Birthday" 노래에 대한 많은 코드를 첨부하는 것입니다. 이 프로젝트에서 루프 작업이 필요하지 않기 때문에 이 코드를 void setup 함수 내에 작성했습니다.

이제 void setup 함수로 빠르게 들어가보면, 화면() 함수가 무엇인지 궁금해질 수 있습니다. 위에 작성된 화면() 함수는 Arduino IDE 내에서 새로운 스케치에 생성한 새로운 함수로서 코드 해석을 어렵게 만드는 것을 방지하기 위해 만든 것입니다.

<div class="content-ad"></div>

이전에 생성한 screen() 함수로 도입해 봅시다!

```js
unsigned int freq;

void screen() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(3, 0);
  lcd.print("Count Down");
  count_down();
}

void count_down() {
  for (j=3; j>0; j--) {
    lcd.setCursor(8,1);
    lcd.print(j);
    if (j == 3) {
      digitalWrite(red, 1);
      tone(buzzer, freq=200);
      delay(1000);
      tone(buzzer, freq=0);
      delay(600);
    }
    else if (j == 2) {
      digitalWrite(yellow, 1);
      tone(buzzer, freq=200);
      delay(1000);
      tone(buzzer, freq=0);
      delay(600);
    }
    else {
      digitalWrite(green, 1);
      tone(buzzer, freq=400);
      delay(2000);
      tone(buzzer, freq=0);
      delay(600);
    }
  }
  greeting();
}

void greeting() {
  lcd.setCursor(1,0);
  lcd.print("Happy Birthday");
  lcd.setCursor(1,1);
  lcd.print("Amelia Sylvien");
}
```

함께 볼 수 있듯이, 위 코드는 void setup 함수 안에 직접 구축했다면 우리의 집중력을 방해할 정도로 많은 라인이 필요했습니다.

함수를 생성할 때, 우리는 LED와 LCD 화면을 켜는 코드를 작성하는 것입니다. 마지막 블록에서는 이미 생일 축하 메시지를 표시할 greeting 함수를 만들었습니다.

<div class="content-ad"></div>

이 코드를 Arduino Uno 보드에 업로드하고 결과를 확인해보세요.
이 가이드가 유용했으면 좋겠어요. 계속 실험하고 Arduino로 끝없는 가능성을 탐험해보세요. 즐거운 코딩과 창작하세요!