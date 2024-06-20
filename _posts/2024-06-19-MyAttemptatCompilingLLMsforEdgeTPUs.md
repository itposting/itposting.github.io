---
title: "엣지 TPU용 LLM 컴파일링 시도기"
description: ""
coverImage: "/assets/img/2024-06-19-MyAttemptatCompilingLLMsforEdgeTPUs_0.png"
date: 2024-06-19 18:09
ogImage: 
  url: /assets/img/2024-06-19-MyAttemptatCompilingLLMsforEdgeTPUs_0.png
tag: Tech
originalTitle: "My Attempt at Compiling LLMs for Edge TPUs"
link: "https://medium.com/@johndilan/my-attempt-at-compiling-llms-for-edge-tpus-897a62b4ce11"
---



![2024-06-19-MyAttemptatCompilingLLMsforEdgeTPUs_0](/assets/img/2024-06-19-MyAttemptatCompilingLLMsforEdgeTPUs_0.png)

AI의 세계가 계속 발전함에 따라, Raspberry Pi 5 및 Coral AI Edge TPU와 같은 엣지 장치로 강력한 머신러닝 모델을 가져오는 약속은 매우 매력적입니다. 네트워크 가장자리에 정교한 AI의 강력함을 가지고 있는 것을 상상해보세요. 지속적인 클라우드 연결이 필요하지 않고 로컬에서 실행됩니다. 그러나 이러한 제약된 환경에서 대형 언어 모델(LLMs)을 배치하는 경우에는 상당한 어려움이 있습니다.

# 라즈베리 파이 5와 코랄 AI Edge TPU와의 나의 여정

최근, 나는 라즈베리 파이 5와 Coral AI Edge TPU를 이용하여 엣지에서 LLMs의 기능을 가져오는 임무를 시작했습니다. 익숙하지 않은 사람들을 위해, Edge TPU는 엣지에서 머신러닝 추론을 가속화하기 위해 설계되었으며, 탁월한 성능을 제공하면서 최소한의 전력을 소비합니다. 그러나 내 여정은 빠르게 번거로운 고난으로 변했습니다.


<div class="content-ad"></div>

# 내가 직면한 어려움들

## MatMul 작업 제약 사항

잘못 처리하는 일반적인 이유 중 하나는 LLMs가 행렬 곱셈 (MatMul) 작업에 심각하게 의존하고 있기 때문입니다. 이러한 작업은 신경망의 작동에 있어 기본적이며, 특히 텍스트를 처리하고 생성하기 위해 광범위한 MatMul 계산이 필요한 LLMs에게 특히 중요합니다. Edge TPU는 특정 유형의 모델에 대해 강력하지만, LLMs가 요구하는 복잡하고 대규모의 MatMul 작업에 최적화되어 있지 않습니다. 이는 엣지 디바이스에서 이러한 모델을 실행하려고 할 때 성능 병목 현상이 발생합니다.

## 메모리 제한

<div class="content-ad"></div>

모델을 TensorFlow Lite (TFLite)로 변환해도, 라즈베리 파이 5와 같은 RAM 용량이 제한된 장치에서 실행하는 것은 또 다른 중요한 장벽으로 다가옵니다. 이러한 장치는 단순히 큰 모델을 효과적으로 로드하고 실행할만한 메모리 용량이 없습니다. 새로운 방법으로 이를 가능하게 할 수는 있지만, 그에 따르는 속도 저하는 모두가 감당할 의향이 있는 비용이 아닙니다. 엣지 TPU는 m.2. PCIe Gen 2 버스에서 동작하기 때문에, 약 500MB/s 정도의 이론적 제한에 묶이게 되는데, 이는 계산 시간이 아니라 파이와 엣지 TPU 간 데이터 이동에만 해당합니다.

## 고급 모델에 대한 지원 부족

Coral.ai 엣지 TPU는 특정 유형의 신경망 작업에 최적화되어 있습니다. 이미지 인식과 같은 작업에서 뛰어나지만, 언어 모델과 같은 고급 처리 능력이 필요한 작업에는 어려움을 겪을 수 있습니다. 또한 엣지 TPU는 적절한 인터페이싱을 위해 HAT+ M 어댑터가 필요하며, 이는 설정 과정에 더 많은 복잡성을 추가합니다.

# 희망이 있는 새로운 프로젝트

<div class="content-ad"></div>

이러한 도전에도 불구하고, 에지 장치에서 LLM(Large Language Model)을 실행하는 것을 더 쉽게 만들기 위해 노력하는 유망한 프로젝트들이 미래에 있습니다:

## Large World Model (LWM)

Large World Model (LWM) 프로젝트는 에지 배포를 위해 대형 모델을 최적화하는 데 중점을 둡니다. 이 프로젝트는 LLM의 계산 요구 사항을 줄이는 데 중점을 두면서 성능을 유지하려고 노력하고 있어, 에지 AI에 있어서 잠재적인 게임 체인저가 될 수 있습니다.

## Jetstream for JAX Models

<div class="content-ad"></div>

Google Cloud의 Jetstream은 TPUs와 GPUs를 사용하여 AI 추론을 가속화하는 플랫폼을 제공합니다. Jetstream은 LLMs의 계산 요구를 처리하기 위한 필요한 인프라를 제공할 수 있어, 클라우드 및 엣지 배포 사이의 격차를 줄일 수 있을 것입니다.

## Ollama와 AirLLM

Ollama와 AirLLM과 같은 새로운 이니셔티브들은 소비자 하드웨어에서 LLM을 실행하기 쉽고 친근하게 만들었습니다. Ollama는 대규모 모델을 효율적으로 배포하고 관리하는 데 도움이 되는 도구와 리소스를 제공하며, AirLLM은 성능 상의 중요한 손실 없이 저전력 장치에서 모델을 실행할 수 있도록 최적화함으로써 AI를 보다 접근하기 쉽게 만들고 있습니다. 이러한 프로젝트들은 엣지 AI의 보다 넓은 채택을 위한 길을 열어주고 있습니다.

# TensorFlow Lite로 모델 변환 및 TPU용 컴파일하기

<div class="content-ad"></div>

모델을 가장자리(Edge)로 배포하는 실험에 관심이 있다면, TensorFlow Lite로 모델을 변환하고 Edge TPU에 컴파일하는 기본 예제가 있습니다.

## 단계 1: 모델을 TensorFlow Lite로 변환하기

먼저, 훈련된 모델을 TensorFlow Lite 형식으로 변환해야 합니다. 아래는 간단한 모델을 이와 같이 변환하는 예제입니다.

```python
import tensorflow as tf

# 훈련된 모델 로드하기
model = tf.keras.models.load_model('your_model.h5')
# 모델을 TensorFlow Lite 형식으로 변환하기
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
# 변환된 모델을 파일로 저장하기
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

<div class="content-ad"></div>

## 단계 2: 엣지 TPU용 TFLite 모델 컴파일하기

이제 엣지 TPU 컴파일러를 사용하여 엣지 TPU용 TFLite 모델을 컴파일해야 합니다.

```js
edgetpu_compiler model.tflite
```

이 명령은 엣지 TPU에 최적화된 model_edgetpu.tflite 파일을 생성합니다.

<div class="content-ad"></div>

## 단계 3: 엣지 TPU에서 모델 실행

이제 컴파일된 모델을 엣지 TPU에서 실행할 수 있습니다. Python API를 사용하여 이 작업을 수행하는 예제를 제공합니다.

```js
import tflite_runtime.interpreter as tflite
import platform

EDGETPU_SHARED_LIB = 'libedgetpu.so.1'
# 컴파일된 TFLite 모델 로드
interpreter = tflite.Interpreter(model_path='model_edgetpu.tflite', 
                                 experimental_delegates=[tflite.load_delegate(EDGETPU_SHARED_LIB)])
interpreter.allocate_tensors()
# 입력 및 출력 텐서 가져오기
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
# 입력 데이터 준비
input_data = ...
# 텐서를 입력 데이터를 가리키도록 설정하여 추론 수행
interpreter.set_tensor(input_details[0]['index'], input_data)
# 추론 실행
interpreter.invoke()
# 출력 추출
output_data = interpreter.get_tensor(output_details[0]['index'])
print(output_data)
```

# 실행 요청

<div class="content-ad"></div>

LLM(주변 머신)을 엣지에서 실행하는 잠재력은 엄청납니다. 똑똑한 IoT 기기 및 반응성 있는 AI 응용 프로그램을 통한 기회, 그리고 데이터를 로컬에 유지함으로써 개인 정보 보호도 향상됩니다. 그러나 현재 기술 상태는 아직 완전하지는 않습니다. 이를 실현하기 위해 더 많은 커뮤니티 주도 노력과 혁신이 필요합니다.

# 도와주세요

- 경험 공유: LLM(주변 머신 학습)을 엣지 장치에서 실행한 적이 있나요? 아래 댓글에서 성공과 실패를 공유해보세요.
- 오픈소스 프로젝트 기여: 많은 프로젝트가 엣지용 AI 최적화를 위해 노력하고 있습니다. 여러분의 기여가 큰 차이를 만들 수 있습니다.
- 기술적 통찰 제공: 모델 최적화나 엣지 컴퓨팅 분야 전문 지식이 있다면, 여러분의 조언과 통찰은 이러한 과제에 어려움을 겪는 우리에게 매우 귀중할 것입니다.
- 혁신: 엔지니어 또는 개발자인 경우, 이러한 과제 중 일부를 직접 해결해보세요. 혁신적인 솔루션이 절실히 필요합니다.

함께하면 AI 엣지 기술의 가능성을 넓힐 수 있습니다. 함께 협력하여 엣지 컴퓨팅의 미래를 이끌어가요.

<div class="content-ad"></div>

에지 디바이스에 AI를 배포하는 과정에서 어떤 어려움을 겪으셨나요? 아래 댓글로 귀하의 생각과 경험을 공유해주세요!