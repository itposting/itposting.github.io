---
title: "Proteus와 Arduino IDE를 사용하여 벽돌깨기 게임 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-CreatingaBrick-BreakingGameUsingProteusandArduinoIDE_0.png"
date: 2024-06-23 17:33
ogImage: 
  url: /assets/img/2024-06-23-CreatingaBrick-BreakingGameUsingProteusandArduinoIDE_0.png
tag: Tech
originalTitle: "Creating a Brick-Breaking Game Using Proteus and Arduino IDE"
link: "https://medium.com/stackademic/creating-a-brick-breaking-game-using-proteus-and-arduino-ide-d343b975c767"
---


본문에서 프로테우스와 아두이노 IDE를 사용하여 벽돌 깨기 게임을 만들어 보겠습니다. 필요한 절차를 단계별로 공유할 예정이에요. 시뮬레이션에서의 게임 모습은 다음과 같을 거에요.

![게임 이미지](/assets/img/2024-06-23-CreatingaBrick-BreakingGameUsingProteusandArduinoIDE_0.png)

우선 내용을 간단히 설명해보려고 해요.

## 시작 화면 및 메뉴 옵션:

<div class="content-ad"></div>

먼저, 사용자에게 시작 화면이 표시됩니다. 이 화면에는 "시작" 및 "종료" 옵션이 포함되어 있습니다. 사용자는 버튼을 사용하여 이 옵션들 사이를 이동하고, "선택" 버튼으로 선택을 집니다.

## 게임 시작 및 종료 절차:

사용자가 "시작" 옵션을 선택하면 게임 화면이 열리고 게임이 시작됩니다. "종료" 옵션이 선택된 경우 "저희 게임에 관심 가져 주셔서 감사합니다"와 같은 메시지가 화면에 표시됩니다.

## 패들 조절:

<div class="content-ad"></div>

게임이 시작되면 사용자가 제어하는 패들이 포텐티오미터로 좌우로 움직입니다.

**공의 움직임과 벽돌 파괴:**

위에 위치한 패들에 의해 이뤄지는 공이 벽돌에 부딪혀 파괴됩니다. 동시에 공은 오른쪽, 왼쪽, 그리고 위쪽 벽에 부딪힐 때 방향을 바꿉니다.

**점수 계산 절차:**

<div class="content-ad"></div>

매 벽돌이 깨질 때마다 플레이어의 점수가 1점씩 올라갑니다. 이 점수는 플레이어의 성과를 추적하는 데 사용됩니다.

## 체력 게이지:

게임이 시작될 때 각 플레이어는 3개의 목숨을 가지고 있습니다. 공이 팔레트에서 빠져 떨어질 때마다 플레이어의 체력이 감소합니다. 목숨은 LED로 사용자에게 표시됩니다.

## 특별 아이템 및 체력 증가:

<div class="content-ad"></div>

매번 벽돌이 깨질 때마다 특별한 물건이 10%의 확률로 떨어집니다. 이 물건을 받은 플레이어는 체력이 1 증가합니다. 이 상태는 LED 표시기로 동시에 표시됩니다.

## 배경색 변경:

게임의 배경과 벽돌의 색상은 빛 센서가 감지한 빛의 양에 따라 변합니다. 빛이 켜지면 배경은 흰색이 되고 벽돌은 검은색이 됩니다.

## 레벨 변화와 속도 증가:

<div class="content-ad"></div>

매 레벨을 클리어할 때마다 벽돌 배치가 변경되고, 공의 속도도 이전 라운드 대비 20% 증가합니다.

## 게임 종료:

모든 목숨을 소진하면, 플레이어의 점수가 화면에 출력되고 그 후에 메뉴로 이동됩니다.

## 시뮬레이션에 필요한 도구들:

<div class="content-ad"></div>

- 아두이노 Uno
- Oled 스크린
- 버튼
- LED
- 가변 저항
- 7 세그먼트 디스플레이
- 광 센서

프로테우스에 위의 부품들을 추가하고 필요한 곳에 사용해야 합니다.

이제 프로젝트를 자세히 설명하겠습니다.

## 라이브러리 및 정의:

<div class="content-ad"></div>

이 섹션에서는 사용할 라이브러리와 상수들이 정의되어 있습니다.

화면에 사용할 벽돌, 패들, 공, 및 객체들의 크기와 값을 여기에서 지정합니다.

```js
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>     
#include <SPI.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define SCREEN_ADDRESS 0x3D
#define OLED_RESET 1 

#define BRICK_WIDTH 31
#define BRICK_HEIGHT 10
#define BRICK_GAP_X 1
#define BRICK_GAP_Y 1
#define NUM_BRICKS_X 4
#define NUM_BRICKS_Y 2

#define PADDLE_WIDTH 40 
#define PADDLE_HEIGHT 3
#define PADDLE_SPEED 5 

#define BALL_SIZE 2
#define BALL_SPEED_X 3 
#define BALL_SPEED_Y 3 

#define OBJECT_SIZE 7
#define OBJECT_SPEED 2

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

int paddlePosition = 50;
int paddleDirection = 0; // 패들 이동 방향을 유지합니다: -1 왼쪽, 1 오른쪽, 0 가만히
int ballPositionX ;
int ballPositionY;
int ballDirectionX;
int ballDirectionY;

// 7 세그먼트 디스플레이 핀 연결
const int segmentPins[] = {2,3,4,5,6,7,8,9};

// 버튼 핀 연결
const int upButton = 10;
const int downButton = 11;
const int selectButton = 12;

int counter = 0;
int score = 0;
int menu = 1;
int currentLevel = 1;

int ballSpeedX = BALL_SPEED_X;
int ballSpeedY = BALL_SPEED_Y;

// 각 벽돌의 상태를 추적하는 2D 배열 정의
bool bricks[NUM_BRICKS_Y][NUM_BRICKS_X];

// 각 레벨별 벽돌 레이아웃 정의
const int levelBricksLayouts[][NUM_BRICKS_Y][NUM_BRICKS_X] = {
  // 레벨 1
  {
    {1,1,1,1},
    {1,1,1,1}
  },
  // 레벨 2
  {
    {1,0,1,0},
    {0,1,0,1}
  },
  // 레벨 3
  {
    {1,1,0,1},
    {0,1,1,0}
  },
  // 레벨 4
  {
    {1,0,0,1},
    {0,1,1,0}
  },
  // 레벨 5
  {
    {1,0,1,0},
    {0,1,0,1}
  }
};

int lives = 3; 
const int lifeLEDs[] = {13,A2,A3}; 

bool objectActive = false;
int objectX, objectY;

uint16_t backgroundColor, brickColor, paddleColor, ballColor, objectColor;
```

## 설정 함수:

<div class="content-ad"></div>

설정 함수는 초기 설정을 수행합니다. 화면 초기화, 입력/출력 핀 설정, 메뉴 표시 등의 작업이 여기서 수행됩니다.

```js
void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS);
  
  display.clearDisplay();
  display.display();
  display.setTextColor(SSD1306_WHITE, SSD1306_BLACK);

  // 포텐셔미터 핀을 입력으로 설정
  pinMode(A0, INPUT);

  for(int i = 0; i<8; i++) {
    pinMode(segmentPins[i], OUTPUT);
  }

  // 버튼 핀을 입력으로 설정
  pinMode(upButton, INPUT);
  pinMode(downButton, INPUT);
  pinMode(selectButton, INPUT);

  digitalWrite(upButton, HIGH);
  digitalWrite(downButton, HIGH);
  digitalWrite(selectButton, HIGH);
  delay(1000);
  updateMenu();

  // 초기에 모든 벽을 솔리드로 설정
  for (int i = 0; i < NUM_BRICKS_Y; i++) {
    for (int j = 0; j < NUM_BRICKS_X; j++) {
      bricks[i][j] = true;
    }
  }

  for(int i = 0; i<3; i++) {
    pinMode(lifeLEDs[i], OUTPUT);
  }

  // 광센서의 핀을 입력으로 설정
  pinMode(A1, INPUT);
}
```

## 루프 함수:

이 함수는 버튼 상태를 확인하고 필요한 기능을 제공합니다. 각 사이클마다 7세그먼트 디스플레이에 카운터의 값을 표시합니다.

<div class="content-ad"></div>


## 숫자 표시 함수:

이 함수는 7세그먼트 디스플레이에 특정 숫자를 표시하는 데 사용됩니다. 이 숫자는 0에서 9 사이여야 합니다.

```js
void displayNumber(int num) {
  const int numbers[][8] = {
    {1,1,1,1,1,1,0,0}, //0
    {0,1,1,0,0,0,0,0}, //1
    {1,1,0,1,1,0,1,0}, //2
    {1,1,1,1,0,0,1,0}, //3
    {0,1,1,0,0,1,1,0}, //4
    {1,0,1,1,0,1,1,0}, //5
    {1,0,1,1,1,1,1,0}, //6
    {1,1,1,0,0,0,0,0}, //7
    {1,1,1,1,1,1,1,0}, //8
    {1,1,1,1,0,1,1,0}  //9
  };

  for(int i = 0; i<8; i++) {
    digitalWrite(segmentPins[i], numbers[num][i]);
  } 
}
```

<div class="content-ad"></div>

## 메뉴 업데이트 기능:

이 함수는 메뉴를 업데이트하는 데 사용됩니다. 사용자가 선택한 메뉴를 강조합니다.

```js
void updateMenu() {
  switch(menu) {
    case 0:
      menu = 1;
      break;
    case 1:
      display.clearDisplay();
      display.setCursor(0,0);
      display.println("> 시작");
      display.setCursor(0,10);
      display.println("  종료");
      display.display();
      break;
    case 2:
      display.clearDisplay();
      display.setCursor(0,0);
      display.println("  시작");
      display.setCursor(0,10);
      display.println("> 종료");
      display.display();
      break;
    case 3:
      menu = 2;
      break;
  }
}
```

## 동작 실행 함수:

<div class="content-ad"></div>

사용자가 선택한 작업을 수행하는 함수입니다. 시작 및 종료 옵션에 따라 서로 다른 작업을 수행합니다.

```js
void executeAction() {
  switch(menu) {
    case 1:
      action1();
      break;
    case 2:
      action2();
      break;
    default:
      break;
  }
}

// 시작 작업
void action1() {
  display.clearDisplay();
  display.setCursor(0, 0);
  playGame();
  display.display();
  delay(1500);
}

// 종료 작업
void action2() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("Thank you for your interest in our game....");
  display.display();
  delay(1500);
}
```

## 벽돌 그리기 함수:

게임 화면에 벽돌을 그리는 함수입니다. 특정 색상의 벽돌을 그립니다.

<div class="content-ad"></div>

```js
void drawBricks(uint16_t color) {
  for(int i = 0; i < NUM_BRICKS_Y; i++) {
    for(int j = 0; j < NUM_BRICKS_X; j++) {
      int brickX = j * (BRICK_WIDTH + BRICK_GAP_X);
      int brickY = i * (BRICK_HEIGHT + BRICK_GAP_Y);
      if (bricks[i][j]) { // Only draw solid bricks
        display.fillRect(brickX + 1, brickY + 1, BRICK_WIDTH - 1, BRICK_HEIGHT - 1, color);
      }
    }
  }
}
```

## 패들 그리기, 삭제 및 업데이트 기능:

```js
// 화면에 패들을 그리는 함수
void drawPaddle(uint16_t color) {
  display.fillRect(paddlePosition, display.height() - PADDLE_HEIGHT - 2, PADDLE_WIDTH, PADDLE_HEIGHT, color);
}

// 이전 패들 위치를 지우는 함수
void clearPaddle() {
  display.fillRect(paddlePosition, display.height() - PADDLE_HEIGHT - 2, PADDLE_WIDTH, PADDLE_HEIGHT, SSD1306_BLACK);
}

// 패들의 위치를 포텐셔미터에서 받은 데이터에 따라 업데이트하는 함수
void updatePaddle() {
  int potValue = analogRead(A0);

  paddlePosition = map(potValue, 0, 1023, 0, display.width() - PADDLE_WIDTH);
}
```

## 공 그리기, 삭제 및 업데이트 기능:

<div class="content-ad"></div>

```js
// 화면에 공을 그리는 함수
void drawBall(uint16_t color) {
  display.fillCircle(ballPositionX, ballPositionY, BALL_SIZE, color);
}

// 이전 공 위치를 지우는 함수
void clearBall() {
  display.fillCircle(ballPositionX - ballDirectionX * BALL_SPEED_X, ballPositionY - ballDirectionY * BALL_SPEED_Y, BALL_SIZE, SSD1306_BLACK);
}

// 공의 위치와 움직임을 업데이트하는 함수
void updateBall() {
  ballPositionX += ballDirectionX * ballSpeedX;
  ballPositionY += ballDirectionY * ballSpeedY;

  // 왼쪽 가장자리 충돌 확인 및 방향 전환
  if(ballPositionX <= 0) {
    ballDirectionX *= -1;
  } 
  // 오른쪽 가장자리 충돌 확인 및 방향 전환
  else if(ballPositionX >= display.width() - BALL_SIZE) {
    ballDirectionX *= -1;
  }

  // 위쪽 가장자리 충돌 확인
  if(ballPositionY <= 0) {
    ballDirectionY *= -1;
  } 

  checkPaddleCollision();

  // 아래쪽 가장자리 충돌 확인
  if(ballPositionY >= display.height()) {
    loseLife();
  }
}
```

## 생명과 생명을 잃은 상태를 보여주는 함수:

```js
// 사용자의 생명을 표시하는 함수
void displayLives() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(lifeLEDs[i], i < lives ? HIGH : LOW); // 건강 상태에 따라 LED 켜기/끄기
  }
}

// 사용자의 생명을 잃는 상황을 처리하는 함수
void loseLife() {
  lives--;
  for (int i = 0; i < 3; i++) {
    digitalWrite(lifeLEDs[i], i < lives ? HIGH : LOW); // 건강 상태에 따라 LED 켜기/끄기
  }

  // 사용자가 건강 상태가 낮을 때 공을 트랙 위에 시작하도록 함
  delay(100);
  ballPositionX = paddlePosition + PADDLE_WIDTH / 2;
  ballPositionY = display.height() - PADDLE_HEIGHT - BALL_SIZE - 3;
  ballDirectionX = 0;
  ballDirectionY = 0;
  displayLives();
  objectActive = false;
  display.fillRect(objectX, objectY, OBJECT_SIZE, OBJECT_SIZE, SSD1306_BLACK);
  delay(100); 
}
```

## 패들과 공의 충돌 함수: 

<div class="content-ad"></div>

볼이 패들에 닿았는지 확인하는 함수입니다.

```js
void checkPaddleCollision() {
    // 패들과 볼의 충돌 확인
    if (ballPositionY + BALL_SIZE >= display.height() - PADDLE_HEIGHT - BALL_SPEED_Y && ballPositionX + BALL_SIZE >= paddlePosition && ballPositionX <= paddlePosition + PADDLE_WIDTH) {
        // 패들의 왼쪽 부분
        if (ballPositionX <= paddlePosition + PADDLE_WIDTH / 3) {
            ballDirectionX = -1; // 왼쪽으로 볼 진행
            ballDirectionY = -1; // 볼의 방향을 위쪽으로 전환
        }
        // 패들의 중간 부분
        else if (ballPositionX <= paddlePosition + 2 * PADDLE_WIDTH / 3) {
            ballDirectionX = 0; // 볼의 방향을 바꾸지 않음
            ballDirectionY = 0;
        }
        // 패들의 오른쪽 부분
        else {
            ballDirectionX = 1; // 오른쪽으로 볼 진행
            ballDirectionY = -1; // 볼의 방향을 위쪽으로 전환
        }  
    }
}
```

## 볼이 패들과 충돌하는지 확인하는 함수:

볼이 패들과 충돌하는지 확인하고 true 또는 false를 반환합니다.

<div class="content-ad"></div>

```js
bool ballHitsPaddle() {
  // 패들과 공의 충돌 제어
  if (ballPositionY + BALL_SIZE >= display.height() - PADDLE_HEIGHT - BALL_SPEED_Y && ballPositionX + BALL_SIZE >= paddlePosition && ballPositionX <= paddlePosition + PADDLE_WIDTH) {
    return true;
  } else {
    return false;
  }
}
```

## 객체 그리기, 업데이트 함수:

```js
// 화면에 특별한 객체를 그리는 함수
void drawObject(uint16_t color) {
  display.fillRect(objectX, objectY, OBJECT_SIZE, OBJECT_SIZE, color);
}

// 특별한 객체의 위치를 업데이트하는 함수
void updateObject() {
  // 객체가 활성화되어 있고 화면 아래로 떨어지는 방향으로 이동하지 않으면 이동
  if (objectActive && objectY < display.height() - OBJECT_SIZE) {
    // 객체 지우기
    display.fillRect(objectX, objectY, OBJECT_SIZE, OBJECT_SIZE, SSD1306_BLACK);
    // 새로운 위치 업데이트
    objectY += OBJECT_SPEED;

    // 플레이어가 객체를 잡았을 경우
    if (objectY >= display.height() - PADDLE_HEIGHT - OBJECT_SIZE && objectX >= paddlePosition && objectX <= paddlePosition + PADDLE_WIDTH) {
      objectActive = false;
      lives++; // 생명 카운트 증가

      // LED로 생명 수 표시
      for (int i = 0; i < 3; i++) {
        digitalWrite(lifeLEDs[i], i < lives ? HIGH : LOW);
      }
      display.fillRect(objectX, objectY, OBJECT_SIZE, OBJECT_SIZE, SSD1306_BLACK);
    }

    // 객체가 화면 하단 가장자리에 도착했을 경우
    if (objectY >= display.height() - OBJECT_SIZE) {
      display.fillRect(objectX, objectY, OBJECT_SIZE, OBJECT_SIZE, SSD1306_BLACK);
    }
    drawObject(objectColor);
  }
}
```

## 벽돌 충돌 확인:

<div class="content-ad"></div>

볼이 벽돌에 충돌하는지 확인합니다.

```js
void checkBrickCollision() {
  for(int i = 0; i < NUM_BRICKS_Y; i++) {
    for(int j = 0; j < NUM_BRICKS_X; j++) {
      if (bricks[i][j]) { // Check to only crash into solid bricks
        int brickX = j * (BRICK_WIDTH + BRICK_GAP_X);
        int brickY = i * (BRICK_HEIGHT + BRICK_GAP_Y);

        if (ballPositionX + BALL_SIZE >= brickX && ballPositionX <= brickX + BRICK_WIDTH && ballPositionY + BALL_SIZE >= brickY && ballPositionY <= brickY + BRICK_HEIGHT) {
          ballDirectionY *= -1; 
          bricks[i][j] = false; // Mark the brick as broken
          incrementCounter(); // Increase score
          display.fillRect(brickX + 1, brickY + 1, BRICK_WIDTH - 1, BRICK_HEIGHT - 1, SSD1306_BLACK);
        
          // Creating an object every time a brick is broken
          if(random(100) < 10) { // 10 percent probability of creating an object
            objectActive = true;
            objectX = brickX + (BRICK_WIDTH - OBJECT_SIZE) / 2;
            objectY = brickY + (BRICK_HEIGHT - OBJECT_SIZE) / 2;;
            drawObject(objectColor);
          }
        
        }
      }
    }
  }
}
```

## 다음 레벨 전환 함수:

레벨의 모든 벽돌이 깨졌을 때 다음 레벨로 이동을 허용하는 함수입니다.

<div class="content-ad"></div>

```js
void nextLevel() {
  if(currentLevel < 5) {
    currentLevel++;  
    // Increase your ball speed by 20% for the next level
    ballSpeedX += ballSpeedX * 0.2;
    ballSpeedY += ballSpeedY * 0.2;

    // Reset ball position and direction
    ballPositionX = paddlePosition + PADDLE_WIDTH / 2;
    ballPositionY = display.height() - PADDLE_HEIGHT - BALL_SIZE - 3;
    ballDirectionX = 0;
    ballDirectionY = 0;

    // Reset bricks
    for(int i = 0; i < NUM_BRICKS_Y; i++) {
      for(int j = 0; j < NUM_BRICKS_X; j++) {
        bricks[i][j] = true;
      }
    }

    // Clear screen and reset lives
    display.clearDisplay();
    display.setCursor(0, 0);
    display.print("Level ");
    display.print(currentLevel);
    display.display();
    delay(20);
    playGame();
  }
}
```

## 게임 시작 기능:

게임이 시작될 때와 진행 중인 게임에서 필요한 작업을 제공하는 함수입니다.

```js
void playGame() {
  // Adjust brick layout depending on level
  int currentLevelLayout[NUM_BRICKS_Y][NUM_BRICKS_X];
  for (int i = 0; i < NUM_BRICKS_Y; i++) {
    for (int j = 0; j < NUM_BRICKS_X; j++) {
      currentLevelLayout[i][j] = levelBricksLayouts[currentLevel - 1][i][j];
    }
  }

  // Reset brick array
  for (int i = 0; i < NUM_BRICKS_Y; i++) {
    for (int j = 0; j < NUM_BRICKS_X; j++) {
      bricks[i][j] = currentLevelLayout[i][j];
    }
  }

  ballPositionX = paddlePosition + PADDLE_WIDTH / 2 - 6; 
  ballPositionY = display.height() - PADDLE_HEIGHT - BALL_SIZE - 3;
  ballDirectionX = 0;
  ballDirectionY = 0;

  while (lives > 0) {
    int lightSensorValue = analogRead(A1);
    if (lightSensorValue < 15) {
      backgroundColor = SSD1306_BLACK;
      brickColor = SSD1306_WHITE;
      paddleColor = SSD1306_WHITE;
      ballColor = SSD1306_WHITE;
      objectColor = SSD1306_WHITE;
    } else { 
      backgroundColor = SSD1306_WHITE;
      brickColor = SSD1306_BLACK;
      paddleColor = SSD1306_BLACK;
      ballColor = SSD1306_BLACK;
      objectColor = SSD1306_BLACK;
    }
  
    display.fillScreen(backgroundColor);

    clearPaddle();
    updatePaddle();
    updateBall();
    clearBall();
    drawBricks(brickColor);
    drawPaddle(paddleColor);
    drawBall(ballColor);
    checkBrickCollision();
    updateObject(); 
    displayNumber(counter);
    displayLives();
    display.display();
    
    // Reads the potentiometer value and controls the movement of the paddle
    int potValue = analogRead(A0);
    int newPaddlePosition = map(potValue, 0, 1023, 0, display.width() - PADDLE_WIDTH);
    
    // If you move the paddle the ball starts to move
    if (newPaddlePosition != paddlePosition && ballHitsPaddle()) {
      // Determine the direction of movement of the paddle
      if (paddlePosition > 50) {
        ballDirectionX = -1; // Move right
      } else if (paddlePosition < 50) {
        ballDirectionX = 1; // Move left
      } else {
        ballDirectionX = 1; // Move left
      }
      ballDirectionY = -1; // Make the ball go up
    }
    clearPaddle();
    // Update the position of the palette
    paddlePosition = newPaddlePosition;

    // Check if all bricks are broken
    bool allBricksDestroyed = true;
      for (int i = 0; i < NUM_BRICKS_Y; i++) {
        for (int j = 0; j < NUM_BRICKS_X; j++) {
          if (bricks[i][j]) {
            allBricksDestroyed = false;
            break;
          }
        }
        if (!allBricksDestroyed) {
          break;
        }
      }

      // If all the bricks are broken go to the next level
      if (allBricksDestroyed) {
        display.clearDisplay();
        display.display();
        delay(5000);
        nextLevel();
        break;
      }
  }

  if(lives == 0) {
    // End game
    gameOver();
  }
}
```

<div class="content-ad"></div>

## 게임 종료 함수:

게임이 종료될 때 호출되는 함수입니다.

```js
void gameOver() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Game Over!");
  display.print("Score: ");
  display.print(score);
  display.display();
  delay(3000); // 3초 대기
  // 메인 메뉴로 돌아가기
  menu = 1;
  updateMenu();
  lives = 3;
}
```

프로젝트의 모든 코드를 포함한 소스 코드:

<div class="content-ad"></div>

```js
절차 상 표를 마크다운 형식으로 변경하였습니다.
```

<div class="content-ad"></div>

끝까지 읽어 주셔서 감사합니다. 떠나시기 전에 아래 사항을 고려해 주세요:

- 저자를 박수로 응원하고 팔로우하기를 고려해 주세요! 👏
- 저희를 팔로우하기: X | LinkedIn | YouTube | Discord
- 다른 플랫폼 방문하기: In Plain English | CoFeed | Venture | Cubed
- Stackademic.com에서 더 많은 콘텐츠 확인하기