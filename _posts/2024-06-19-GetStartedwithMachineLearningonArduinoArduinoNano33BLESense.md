---
title: "아두이노에서 머신 러닝 시작하기  아두이노 나노 33 BLE 센스"
description: ""
coverImage: "/assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_0.png"
date: 2024-06-19 05:54
ogImage: 
  url: /assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_0.png
tag: Tech
originalTitle: "Get Started with Machine Learning on Arduino | Arduino Nano 33 BLE Sense"
link: "https://medium.com/@techworldthink/get-started-with-machine-learning-on-arduino-arduino-nano-33-ble-sense-9fa38dfb9563"
---


![image](/assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_0.png)

이 포괄적인 자습서에서는 Arduino Nano 33 BLE Sense를 중점으로 한 Arduino 장치에 머신러닝 모델을 배치하는 흥미로운 세계에 대해 살펴볼 것입니다.

다음은 Arduino Nano 33 BLE Sense에 머신러닝 모델을 배포하는 단계 목록입니다:

- Arduino IDE 설치
- Mbed OS Core for Nano Boards 설치
- Harvard_TinyMLx 라이브러리 설치
- Google Colab에서 TensorFlow를 사용하여 머신러닝 모델 생성
- 훈련된 모델을 TensorFlow Lite로 변환
- Arduino 헤더 파일에 모델 인코딩
- Arduino에 ML 모델 배포

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_1.png)

1. 아두이노 IDE 설치

다음 가이드를 따라 주세요: [아두이노 IDE 다운로드 및 설치](https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE).

2. 나노 보드용 Mbed OS 코어 설치

<div class="content-ad"></div>

아두이노로 이동해서 Tools → Board → Board Manager로 이동해 주세요.

"Arduino Mbed OS Nano Boards"를 설치해 주세요.

![이미지](/assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_2.png)

3. Harvard_TinyMLx 라이브러리 설치

<div class="content-ad"></div>

Tools -> Manage Libraries 로 이동해주세요.

"Harvard_TinyMLx" 라이브러리를 설치하세요.

![이미지](/assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_3.png)

4. Google Colab에서 TensorFlow를 사용하여 머신러닝 모델을 생성하세요.

<div class="content-ad"></div>

여기서는 TensorFlow에서 선형 회귀를 사용하여 간단한 날씨 예측 기계 학습 모델을 만들고 있어요. 입력 특성은 온도와 습도이며, 날씨 요약은 예상 출력입니다. 이 모델은 IoT에서 기계 학습 통합을 보여주기 위한 것이며, 정확한 날씨 예측을 최적화한 것이 아니라는 점을 유의해 주세요.

```js
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras

# 데이터셋 불러오기
weather_df = pd.read_csv('weatherHistory.csv')

weather_df.head()

weather_df.info()

weather_df.keys()

weather_df['Summary'].unique()

#weather_df['Summary'].unique()
factorized_mapping = dict(enumerate(weather_df['Summary'].unique()))
weather_df['Summary'] = pd.factorize(weather_df['Summary'])[0]
print(factorized_mapping)

# 특성과 레이블 정의
features = weather_df[['Temperature (C)','Humidity']]
labels = weather_df[['Summary']]

# 훈련 및 테스트 데이터 분할
features_train, features_test, labels_train, labels_test = train_test_split(features, labels, test_size=0.3, random_state=0)

# Keras를 사용하여 선형 회귀 모델 만들기
model = keras.Sequential([
    keras.layers.Dense(units=1, input_shape=(2,))  # 두 개의 입력 특성, 하나의 출력 유닛
])

# 모델 컴파일
model.compile(optimizer='Adam', loss='mean_squared_error')  # 확률적 경사 하강법 (SGD) 옵티마이저 사용

# 모델 훈련
model.fit(
    features_train,labels_train,
    epochs=6,
    validation_data=(features_test, labels_test)
    )

predictions = model.predict(features_test)
print(predictions)

rounded_predictions = [round(prediction[0]) for prediction in predictions]
original_predictions = [factorized_mapping[prediction] for prediction in rounded_predictions]
original_predictions

rmse = np.sqrt(((labels_test - predictions) ** 2).mean())
print("Root Mean Squared Error (RMSE):", rmse)
```

5. 훈련된 모델을 TensorFlow Lite로 변환하기

<div class="content-ad"></div>

```js
"""# 훈련된 모델을 텐서 플로 Lite로 변환하기"""

import tensorflow as tf

# 양자화 없이 모델을 TensorFlow Lite 형식으로 변환
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# 모델을 디스크에 저장
open("weather_model.tflite", "wb").write(tflite_model)

import os
basic_model_size = os.path.getsize("weather_model.tflite")
print("모델 크기는 %d바이트입니다" % basic_model_size)
```

6. 아두이노 헤더 파일에 모델 인코딩

"아두이노 헤더 파일에 모델 인코딩"은 일반적으로 TensorFlow Lite와 같은 형식의 머신 러닝 모델을 아두이노 스케치 내에 포함할 수 있는 특정 형식으로 변환하는 과정을 의미합니다. 이 과정은 모델의 수치적 가중치와 아키텍처를 아두이노 코드의 헤더 파일(.h)로 쉽게 포함할 수 있도록 변환하는 것을 포함합니다.

이 헤더 파일은 아두이노 스케치가 외부 종속성이나 별도의 모델 파일 없이 추론에 사용할 수 있도록 모델 데이터를 포함하도록 되어 있습니다. 이 형식으로 모델을 인코딩함으로써 자원 제한적인 기기인 아두이노 같은 장치에 머신 러닝 모델을 배포할 때 아두이노 프로젝트가 외부 자원에 의존하지 않고 아두이노 보드에서 머신 러닝 모델을 직접 사용하여 예측하거나 작업을 수행할 수 있도록 할 수 있습니다. 아두이노와 같은 자원에 제한된 기기에 머신 러닝 모델을 배포할 때 중요한 단계입니다.


<div class="content-ad"></div>

```js
"""# 아두이노 헤더 파일에 모델 인코딩하기"""

!echo "const unsigned char model[] = {" > /content/model.h
!cat weather_model.tflite | xxd -i      >> /content/model.h
!echo "};"                              >> /content/model.h

import os
model_h_size = os.path.getsize("model.h")
print(f"헤더 파일인 model.h의 크기는 {model_h_size:,} 바이트입니다.")
print("\n사이드 패널을 열어보세요 (필요시 새로고침). 모델 파일인 model.h를 더블 클릭하여 다운로드하세요.")
```

7. 아두이노에 ML 모델 배포하기

‘model.h’ 파일을 다운로드하고 또한 아두이노 스케치와 동일한 디렉토리에 저장하세요. 이 코드에서는 예측을 위해 샘플 온도 및 습도 값을 제공했습니다. 또한 센서에서 이러한 값을 읽어 실시간 예측을 할 수도 있습니다.

```js
/*
  날씨 예측
  회로:
  - 아두이노 나노 33 BLE 또는 아두이노 나노 33 BLE Sense 보드.
  작성자: Jobin J
*/


#include <TensorFlowLite.h>
#include <tensorflow/lite/micro/all_ops_resolver.h>
#include <tensorflow/lite/micro/micro_error_reporter.h>
#include <tensorflow/lite/micro/micro_interpreter.h>
#include <tensorflow/lite/schema/schema_generated.h>
#include <tensorflow/lite/version.h>

#include "model.h"


// TensorFlow Lite (Micro)에 사용되는 전역 변수
tflite::MicroErrorReporter tflErrorReporter;

// 모든 TFLM 오퍼레이션을 가져옵니다. 필요한 오퍼레이션만 가져와
// 스케치의 컴파일 크기를 줄이고자 한다면 이 줄을 제거하고
// 필요한 TFLM 오퍼레이션만 가져오실 수 있습니다.
tflite::AllOpsResolver tflOpsResolver;

const tflite::Model* tflModel = nullptr;
tflite::MicroInterpreter* tflInterpreter = nullptr;
TfLiteTensor* tflInputTensor = nullptr;
TfLiteTensor* tflOutputTensor = nullptr;

// TFLM을 위한 정적 메모리 버퍼를 생성합니다. 모델의 크기에 따라
// 조정이 필요할 수 있습니다.
constexpr int tensorArenaSize = 8 * 1024;
byte tensorArena[tensorArenaSize] __attribute__((aligned(16)));

// 제스처 인덱스를 이름에 매핑하는 배열
const char* LABELS[] = {
  "부분적으로 흐림", "대체로 흐림", "흐리고 흐림", "안개",
  "바람 부는 대체로 흐림", "맑음", "바람 부는 부분적으로 흐림",
  "바람 부는 흐리고 흐림", "습하고 대체로 흐림",
  "습하고 부분적으로 흐림", "바람 부는 안개 낀날", "바람 부는 흐리고 흐림",
  "바람 부는 안개", "바람 부는 부분적으로 흐림", "바람",
  "건조하고 부분적으로 흐림", "바람 부는 대체로 흐림",
  "위험한 바람 부는 부분적으로 흐림", "건조함", "바람",
  "습하고 흐리고 흐림", "가벼운 비", "이슬비", "바람 부는 건조한",
  "건조하고 대체로 흐림", "바람 부는 건조한", "비"
};

#define NUM_LABELS (sizeof(LABELS) / sizeof(LABELS[0]))

void setup() {
  Serial.begin(9600);
  while (!Serial);


  // 모델 바이트 배열의 TFL 표현을 가져옵니다.
  tflModel = tflite::GetModel(model);
  if (tflModel->version() != TFLITE_SCHEMA_VERSION) {
    Serial.println("모델 스키마 불일치!");
    while (1);
  }

  // 모델 실행을 위한 인터프리터 생성
  tflInterpreter = new tflite::MicroInterpreter(tflModel, tflOpsResolver, tensorArena, tensorArenaSize, &tflErrorReporter);

  // 모델의 입력 및 출력 텐서를 위한 메모리 할당
  tflInterpreter->AllocateTensors();

  // 모델의 입력 및 출력 텐서를 위한 포인터 가져오기
  tflInputTensor = tflInterpreter->input(0);
  tflOutputTensor = tflInterpreter->output(0);
}

void loop() {
  float temperature = 28.0, humidity = 50.0;

  // 입력 텐서
  tflInputTensor->data.f[0] = temperature;
  tflInputTensor->data.f[1] = humidity;


  TfLiteStatus invokeStatus = tflInterpreter->Invoke();
  if (invokeStatus != kTfLiteOk) {
    Serial.println("실행 실패!");
    while (1);
    return;
  }

  // 모델의 출력 텐서 값 순회
  for (int i = 0; i < NUM_LABELS; i++) {
    Serial.print(LABELS[i]);
    Serial.print(": ");
    Serial.println(tflOutputTensor->data.f[i], 6);
  }

  delay(5000);
}
```

<div class="content-ad"></div>

GitHub - Machine_Learning_Weather_Prediction

이제 시리얼 모니터에서 이렇게 출력을 볼 수 있습니다.

![이미지](/assets/img/2024-06-19-GetStartedwithMachineLearningonArduinoArduinoNano33BLESense_4.png)

아두이노 나노 33 BLE Sense에서 기계 학습의 세계를 탐험하고 오늘부터 자신만의 흥미로운 프로젝트를 시작해보세요. 즐거운 코딩되세요!