---
title: "FreeRTOS  이벤트 그룹을 사용하여 간단한 세마포어 구현 방법"
description: ""
coverImage: "/assets/img/2024-06-23-FreeRTOSSimplesemaphoreimplementationusingeventgroup_0.png"
date: 2024-06-23 17:31
ogImage: 
  url: /assets/img/2024-06-23-FreeRTOSSimplesemaphoreimplementationusingeventgroup_0.png
tag: Tech
originalTitle: "FreeRTOS — Simple semaphore implementation using event group"
link: "https://medium.com/@sergio.arrighi/freertos-simple-semaphore-implementation-using-event-group-ac54e3bb5686"
---



![Image](/assets/img/2024-06-23-FreeRTOSSimplesemaphoreimplementationusingeventgroup_0.png)

웹 소프트웨어 엔지니어인 저와 같은 경우에는 실시간 프로그래밍 개념을 이해하기 어려울 수 있습니다. 
이 짧은 기사에서는 여러 멀티스레딩 작업의 완료를 기다리기 위한 세마포어 패턴을 구현하는 쉬운 기술을 소개하겠습니다.

# 정의

- FreeRTOS 작업
FreeRTOS 작업은 FreeRTOS 실시간 운영 체제 내에서 실행되는 작고 독립적인 프로그램 세그먼트입니다. 각 작업은 특정 작업을 수행하도록 설계되었으며 FreeRTOS 스케줄러에 의해 관리되는 다른 작업과 준동시에 작동합니다. FreeRTOS의 작업은 우선 순위를 부여할 수 있어, 스케줄러가 작업 우선 순위에 따라 실행 흐름을 관리하고 시간에 민감한 작업을 효과적으로 처리할 수 있게 합니다. 이를 통해 응용 프로그램은 여러 작업 간에 작업을 나누어 다루므로 다양한 응용 프로그램 요구 사항을 처리할 수 있습니다.

- 카운팅 세마포어
FreeRTOS의 카운팅 세마포어는 공유 리소스에 대한 액세스를 관리하거나 가용성에 따라 작업을 동기화하는 동기화 메커니즘입니다. 두 가지 상태만을 갖는 이진 세마포어와 달리 카운팅 세마포어는 가용 리소스의 개수나 이벤트가 발생하기 전에 실행 흐름을 차단/해제하는 횟수를 나타내는 값을 유지합니다.


<div class="content-ad"></div>

# TL;DR — The code

데모 코드는 "xTaskCreate"를 사용하여 세 가지 작업을 실행하며 "xEventGroupCreate"로 생성된 이벤트 그룹을 사용하여 카운팅 세마포어를 구현합니다. 메인 작업은 생성된 모든 작업이 실행된 후에만 종료되도록 기다립니다.

```js
#include <Arduino.h>

// 카운팅 세마포어를 구현하는 그룹 핸들
static EventGroupHandle_t eventGroup;

// 각 작업에 대한 비트 마스크 정의
const EventBits_t TASK_1_BIT = (1 << 0); // 00000001
const EventBits_t TASK_2_BIT = (1 << 1); // 00000010
const EventBits_t TASK_3_BIT = (1 << 2); // 00000100

void taskFunction(void *pvParameters) {
    int taskNumber = ((int)pvParameters);
    // 작업 번호를 기반으로 설정할 비트 계산
    EventBits_t taskBit = (1 << (taskNumber - 1));

    for(int i = 0; i < 5; i++) {
        Serial.printf("Task %d is executing...\n", taskNumber);
        vTaskDelay(pdMS_TO_TICKS(1000)); // 작업 활동 시뮬레이션
    }

    // 이 작업을 위해 이벤트 그룹에 적합한 비트 설정
    Serial.printf("Task %d completed and bit set.\n", taskNumber);
    xEventGroupSetBits(eventGroup, taskBit);
    // 완료되면 이 작업 삭제
    vTaskDelete(NULL);
}

void setup() {
    Serial.begin(115200);
    while (!Serial);

     // 이벤트 그룹 생성
    eventGroup = xEventGroupCreate();
    if (eventGroup == NULL) {
        Serial.println("이벤트 그룹 생성 실패. 힙 부족일 수 있습니다.");
        return;
    }

    // 작업에 전달할 매개변수, 작업 번호를 나타냄
    static int taskParams[3] = {1, 2, 3};
    for (int i = 0; i < 3; i++) {
        xTaskCreate(
            taskFunction,            // 작업 함수
            "Task",                  // 작업 이름
            2048,                    // 스택 크기
            &taskParams[i],          // 매개변수 (작업 번호)
            1,                       // 우선순위
            NULL                     // 사용하지 않는 작업 핸들
        );
    }

    // 모든 작업이 비트를 설정할 때까지 기다림
    Serial.println("작업 완료 대기 중...");
    xEventGroupWaitBits(
        eventGroup,                          // 테스트할 이벤트 그룹.
        TASK_1_BIT | TASK_2_BIT | TASK_3_BIT, // 기다릴 이벤트 그룹 내 비트.
        pdTRUE,                              // 종료 시 비트 지우기.
        pdTRUE,                              // 모든 비트를 기다림.
        portMAX_DELAY                        // 무기한 대기.
    );

    Serial.println("모든 작업 완료됨.");
    // 이벤트 그룹 정리
    vEventGroupDelete(eventGroup);
}

void loop() {}
```

# 자세한 설명

<div class="content-ad"></div>

- 이벤트 그룹 핸들이 선언되었습니다.

```js
// 카운팅 세마포어를 구현하는 그룹 핸들
static EventGroupHandle_t eventGroup;
```

- 각 작업은 숫자 ID에 연결되며, 이는 비트 시퀀스의 인덱스를 나타냅니다. 작업이 완료되었는지 확인하는 데 세 개의 비트 마스크가 사용됩니다.

```js
// 각 작업을 위한 비트 마스크 정의
const EventBits_t TASK_1_BIT = (1 << 0); // 00000001
const EventBits_t TASK_2_BIT = (1 << 1); // 00000010
const EventBits_t TASK_3_BIT = (1 << 2); // 00000100
```

<div class="content-ad"></div>

- 주요 작업은 작업 번호를 매개변수로 전달하여 세 가지 작업을 생성합니다.

```js
// 작업에 전달할 매개변수, 작업 번호를 나타냄
static int taskParams[3] = {1, 2, 3};
for (int i = 0; i < 3; i++) {
    xTaskCreate(
        taskFunction,            // 작업 함수
        "Task",                  // 작업 이름
        2048,                    // 스택 크기
        &taskParams[i],          // 매개변수 (작업 번호)
        1,                       // 우선 순위
        NULL                     // 작업 핸들은 사용하지 않음
    );
}
```

- 작업 번호는 "EventBits_t" 변수를 생성하는 데 사용되며 해당하는 양 만큼 비트를 왼쪽으로 이동시킵니다.

```js
int taskNumber = ((int)pvParameters);
// 작업 번호를 기반으로 설정할 비트를 계산
EventBits_t taskBit = (1 << (taskNumber - 1));
```

<div class="content-ad"></div>

- 작업이 완료되면 그룹에 신호를 보내고 자체를 삭제합니다.

```js
// 이벤트 그룹에서이 작업에 대한 적절한 비트 설정
Serial.printf("작업 %d가 완료되었고 비트가 설정되었습니다.\n", taskNumber);
xEventGroupSetBits(eventGroup, taskBit);
// 완료되면이 작업 삭제
vTaskDelete(NULL);
```

- 주 작업은 비트 마스크를 사용하여 그룹 내 세 개의 비트가 1로 설정될 때까지 기다리고 즉시 실행을 다시 시작합니다.

```js
// 모든 작업이 비트를 설정 할 때까지 대기
Serial.println("작업이 완료 될 때까지 대기 중 ...");
xEventGroupWaitBits(
    eventGroup,                          // 테스트되는 이벤트 그룹.
    TASK_1_BIT | TASK_2_BIT | TASK_3_BIT, // 대기해야 하는 이벤트 그룹 내의 비트.
    pdTRUE,                              // 종료시 비트 지우기.
    pdTRUE,                              // 모든 비트를 대기합니다.
    portMAX_DELAY                        // 무기한 대기.
);
```

<div class="content-ad"></div>

- 마침내 이벤트 그룹이 삭제되었습니다.

```js
Serial.println("모든 작업이 완료되었습니다.");
// 이벤트 그룹 정리
vEventGroupDelete(eventGroup);
```

# 결론

이 유용한 기술은 FreeRTOS 기능만을 사용하여 동기화를 강제하는 간단한 방법입니다. 따라서 무분별한 코드 부하를 피할 수 있습니다. 여러분의 프로젝트에 유용하게 활용하시기를 바랍니다. 읽어주셔서 감사합니다!