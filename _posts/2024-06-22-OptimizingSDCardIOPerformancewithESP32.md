---
title: "ESP32로 SD 카드 IO 성능 최적화하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-OptimizingSDCardIOPerformancewithESP32_0.png"
date: 2024-06-22 18:42
ogImage: 
  url: /assets/img/2024-06-22-OptimizingSDCardIOPerformancewithESP32_0.png
tag: Tech
originalTitle: "Optimizing SD Card I O Performance with ESP32"
link: "https://medium.com/@qiweimao/optimizing-sd-card-i-o-performance-with-esp32-b32419c60647"
---


# 저에 대해

안녕하세요, 저는 지위 마오입니다. 지반공학 기술자이자 IoT 시스템에 열정을 가진 사람입니다. 저는 저전력 마이크로컨트롤러와 LoRa 통신 시스템을 연구하여 취미로 사용할 수 있는 원격 모니터링 솔루션부터 산업용 모니터링 또는 제어 시스템을 구축하고 있습니다. 제 웹사이트를 방문해주세요: https://www.qiweimao.dev/blog

LinkedIn | Github | Reddit | X

# 많은 파일로 인해 SD 카드 I/O 속도가 느려지는 이유

<div class="content-ad"></div>

SD 카드의 단일 폴더에 대량의 파일을 축적하면 파일 시스템(FAT32 또는 exFAT과 같은 SD 카드용)이 파일을 찾거나 열기 위해 디렉터리 항목을 검색해야 합니다. 파일이 증가함에 따라 이 디렉터리 검색 프로세스는 느려질 수 있습니다. 그 이유는 다음과 같습니다:

- 디렉터리 항목: FAT32와 exFAT은 디렉터리 항목을 선형 목록에 저장합니다. 파일이 늘어날수록 이 목록을 검색하는 시간이 선형적으로 증가하므로 특정 파일을 찾거나 열 때 상당히 더 많은 시간이 걸릴 수 있습니다.
- 단편화: 파일이 생성되고 삭제되며 수정되면 시간이 지남에 따라 단편화가 발생할 수 있습니다. 이는 파일의 일부가 SD 카드의 다른 물리적 위치에 퍼져 있을 수 있어 파일을 읽는 데 걸리는 시간을 증가시킬 수 있습니다.
- 클러스터 할당: 각 파일 및 디렉터리 항목에는 클러스터 할당이 필요하며, 이는 파일 할당 테이블(FAT)에 의해 관리됩니다. 많은 파일을 처리할수록 이러한 할당을 업데이트하고 관리하는 과정이 더 복잡하고 시간이 많이 소요됩니다.

# 입출력 테스트

다음은 단일 디렉터리의 모든 파일을 기록하는 것과 하위 폴더 전략을 사용하는 것 사이의 속도 차이를 비교하는 두 테스트 프로그램에 대한 개요입니다. 이 프로그램은 각 쓰기 동작에 걸리는 시간을 기록하고 이 정보를 로그 파일에 저장할 것입니다. ESP32는 500ms마다 파일 쓰기 동작을 시작할 것입니다.

<div class="content-ad"></div>

![Optimizing SD Card I/O Performance with ESP32](/assets/img/2024-06-22-OptimizingSDCardIOPerformancewithESP32_0.png)

ESP32에서 SD 카드 I/O의 성능 분석 결과, 파일을 하나의 폴더에 저장하는 것과 분 단위로 서브폴더에 구성하는 것 사이에 명확한 추세 차이가 나타납니다.

하나의 폴더에 순차적으로 파일을 저장하는 경우 파일 수가 증가함에 따라 파일 I/O 시간이 선형적으로 증가하는 것을 확인할 수 있습니다. 이는 대량 디렉토리 내의 파일 접근 및 관리가 검색 및 검색 시간이 증가하여 점진적으로 느려진다는 것을 시사합니다. 반면에, 서브폴더 접근 방식은 초기에는 I/O 시간이 비슷하게 증가하지만 새 파일이 새로운 서브폴더로 이동함에 따라 접근 시간이 간헐적으로 감소합니다.

이 현상은 파일을 작은 시간 기반 클러스터로 조직화하는 것이 단일 폴더 저장 과정에서 관찰된 성능 하락을 완화하는 것을 나타냅니다. 이러한 조직 전략은 액세스 속도를 최적화할 뿐만 아니라 저장 부하를 관리 가능한 하위 집합에 분산하여 전체 시스템 효율성을 향상시킬 수 있습니다.

<div class="content-ad"></div>

### 프로그램 1: 단일 디렉토리 로깅

```cpp
#include <Arduino.h>
#include <SD.h>
#include <SPI.h>

const int chipSelect = 5;
const String dataFolder = "/data";
const String logFileName = "/io_time_log_single.txt";
const int interval = 500; // 1분 간격
unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  if (!SD.begin(chipSelect)) {
    Serial.println("카드 연결 실패 또는 없음");
    while (1);
  }
  if (!SD.exists(dataFolder)) {
    SD.mkdir(dataFolder);
  }
}

void logData() {
  unsigned long start = millis();
  String fileName = dataFolder + "/data_" + String(start) + ".txt";
  File dataFile = SD.open(fileName, FILE_WRITE);

  if (dataFile) {
    dataFile.println("더미 시계열 데이터");
    dataFile.close();
  }

  unsigned long end = millis();
  File logFile = SD.open(logFileName, FILE_APPEND);
  if (logFile) {
    logFile.println(String(start) + "," + String(end - start));
    logFile.close();
  }
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    logData();
  }
}
```

### 프로그램 2: 서브폴더 전략 로깅

```cpp
#include <Arduino.h>
#include <SD.h>
#include <SPI.h>
const int chipSelect = 5;
const String dataFolder = "/data";
const String logFileName = "/io_time_log_subfolder.txt";
const int interval = 500; // 1분 간격
unsigned long previousMillis = 0;
void setup() {
 Serial.begin(115200);
 if (!SD.begin(chipSelect)) {
 Serial.println("카드 연결 실패 또는 없음");
 while (1);
 }
 if (!SD.exists(dataFolder)) {
 SD.mkdir(dataFolder);
 }
}
void createDirectories(String path) {
 String subPath = "";
 int start = 0;
 int end = path.indexOf('/', start);
while (end != -1) {
 subPath = path.substring(0, end);
 if (!SD.exists(subPath)) {
 SD.mkdir(subPath);
 }
 start = end + 1;
 end = path.indexOf('/', start);
 }
if (!SD.exists(path)) {
 SD.mkdir(path);
 }
}
void logData() {
 unsigned long start = millis();
 
 // 현재 밀리초 단위 시간을 기준으로 서브폴더 생성
 unsigned long totalMinutes = start / 60000;
 unsigned long totalHours = totalMinutes / 60;
 unsigned long totalDays = totalHours / 24;
String day = String(totalDays);
 String hour = String(totalHours % 24);
 String minute = String(totalMinutes % 60);
String subFolder = dataFolder + "/" + day + "/" + hour + "/" + minute;
 createDirectories(subFolder);
String fileName = subFolder + "/data_" + String(start) + ".txt";
 
 start = millis();
 File dataFile = SD.open(fileName, FILE_WRITE);
 if (dataFile) {
 dataFile.println("더미 시계열 데이터");
 dataFile.close();
 }
 unsigned long end = millis();
 
 File logFile = SD.open(logFileName, FILE_APPEND);
 if (logFile) {
 logFile.println(String(start) + "," + String(end - start));
 logFile.close();
 }
}
void loop() {
 unsigned long currentMillis = millis();
 if (currentMillis - previousMillis >= interval) {
 previousMillis = currentMillis;
 logData();
 }
}
```

<div class="content-ad"></div>

# 결론

파일을 하위 디렉터리로 구성하고, 바이너리 형식을 사용하며, 메모리 내 메타데이터를 유지하고, 쓰기와 읽기 모두 최적화된 파일 구조를 사용함으로써 ESP32 데이터 로거의 I/O 성능을 크게 향상시킬 수 있습니다. 이러한 전략은 많은 수의 파일을 관리하고 LoRa 네트워크를 통해 효율적인 데이터 검색 및 전송을 보장하는 데 도움이 될 것입니다.