---
title: "CPU, GPU, NPU 인공지능에 필요한 중요한 차이점과 역할 분석"
description: ""
coverImage: "/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_0.png"
date: 2024-06-22 19:16
ogImage: 
  url: /assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_0.png
tag: Tech
originalTitle: "CPU, GPU, and NPU: Understanding Key Differences and Their Roles in Artificial Intelligence"
link: "https://medium.com/@levysoft/cpu-gpu-and-npu-understanding-key-differences-and-their-roles-in-artificial-intelligence-2913a24d0747"
---


<img src="/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_0.png" />

레비소프트닷잇에 원래 게시된 이탈리아어 게시물의 영문 번역

1960년대에 처음 소개된 CPU(중앙 처리 장치)는 컴퓨터의 주요 작업을 실행하는 역할로 핵심적인 역할을 해왔습니다. 다양한 명령어와 작업을 처리할 수 있는 다재다능하고 넓은 범위의 명령어와 작업을 처리할 수 있는 설계로, 운영 체제, 생산성 소프트웨어 및 다양한 일반적인 응용 프로그램을 실행하는 데 이상적입니다. 그러나 첫 번째 3D 비디오 게임과 고급 그래픽 응용프로그램이 등장하면서, CPU의 한계가 드러나게 되었습니다. 그들의 아키텍처는 고강도 그래픽 응용프로그램 및 과학적 시뮬레이션에 필요한 대규모 병렬 컴퓨팅을 최적화되지 않았으며, 일반 목적 계산을 위해 특별히 설계되었습니다.

그러나 고강도 그래픽 응용프로그램 및 과학적 시뮬레이션에 필요한 대규모 병렬 처리 수요의 증가로 인해, CPU 및 수학 부호 처리 장치의 한계가 드러나게 되었습니다. 이는 1990년대에 GPU(그래픽 처리 장치)의 개발로 이어졌습니다. 이후 GPU는 대용량 데이터의 병렬 처리에 중요하고 전문적인 역할을 하게 되었습니다. 수백 개나 수천 개의 작은 전용 코어(ALU: 산술 논리 장치)로 구성된 GPU(통합 그래픽 칩이나 독립형 그래픽 카드로 제공)는 여러 작업을 동시에 수행할 수 있어서 그래픽 렌더링 및 최근에는 딥러닝 모델의 교육 및 배포에 이상적입니다.

<div class="content-ad"></div>

최근 몇 년 동안 우리는 새로운 유형의 처리 장치의 등장을 목격했습니다: NPU(신경 처리 장치). 수학 부가 처리 장치 및 GPU는 부동 소수점 연산 및 대량 데이터 부분 처리를 가속화했지만, NPU는 행렬 곱셈 및 덧셈을 효율적으로 처리하기 위해 설계되었습니다. 이는 인공지능(AI) 및 기계 학습(ML)과 관련된 작업에 필수적인 작업 부하를 위해 이미지 인식, 자연어 처리 및 기계 학습과 같은 작업에 효율적으로 처리할 수 있습니다.

실제로 CPU, GPU 및 NPU는 모두 컴퓨터의 작동에 중요하지만 각각 다른 유형의 계산과 렌더링을 처리하는 데 최적화되어 있습니다. GPU는 비디오 편집 및 게임과 같은 애플리케이션을 위한 복잡한 이미지 렌더링에 특화되어 있으며, NPU는 비디오 통화에서 배경 흐림 또는 사진 및 비디오 편집에서의 물체 감지와 같은 단순하고 반복적인 AI 작업을 처리하여 GPU로부터 이러한 작은 작업을 분산합니다. 이를 통해 CPU 및 GPU가 더 강도 높고 복잡한 활동에 초점을 맞출 수 있게 하여 전체 시스템의 효율성을 향상시키고 오버로드로부터 보호하여 시스템 작동을 부드럽게 유지합니다.

<img src="/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_1.png" />

## 인공지능에서의 행렬

<div class="content-ad"></div>

인공 지능에서 특히 딥 러닝에서는 데이터 처리를 위해 행렬 곱셈과 덧셈(일반적으로 GEMM, "General Matrix Multiplication"으로 알려짐)이 중요합니다.

행렬이란 무엇일까요? 행렬을 숫자 표로 상상해보세요. 예를 들어 흑백 이미지는 픽셀을 나타내는 숫자로 이루어진 행렬로 표현될 수 있습니다. 비슷하게, 문장의 단어는 숫자로 변환되어 행렬에 담길 수 있습니다.

신경망에서는 어떻게 사용될까요? 신경망은 이러한 숫자 행렬을 사용하여 예측을 수행하거나 패턴을 인식합니다. 네트워크의 각 "레이어"는 숫자 행렬을 가져와 다른 행렬로 변환합니다. 이는 행렬 곱셈을 통해 이루어지며, 데이터 간의 복잡한 관계를 이해하는 데 도움을 줍니다.

언어 모델에서는 어떻게 활용될까요? 대규모 언어 모델(LLMs)에서는 토큰을 나타내고 변환하는 데 행렬을 사용합니다. 토큰은 단어나 기호와 같은 텍스트의 작은 부분을 말합니다. 이러한 토큰을 숫자로 변환하고 행렬로 조직화합니다. 이러한 행렬 연산을 통해 모델은 단어나 토큰 간의 관련성을 이해하고, 텍스트의 문맥과 의미를 파악하는 데 도움을 줍니다. 예를 들어, AI 모델이 문장을 처리할 때 각 단어가 다른 단어와 어떻게 연결되는지 이해하는 데 행렬이 도움이 되어 응답을 생성하거나 텍스트를 일관되게 계속할 수 있습니다. LLMs 개념을 깊이 파고들고 싶으시다면, 기술 용어 없이 어떻게 인공 지능의 대규모 언어 모델이 작동하는지 설명하는 Arstechnica의 방대하고 유일무이한 기사를 추천합니다. 또는 Stephen Wolfram이 어떻게 ChatGPT가 작동하는지 설명한 다른 흥미로운 기사도 살펴볼 수 있습니다.

<div class="content-ad"></div>

요약하면, 행렬 곱셈과 덧셈은 인공지능 모델이 원시 데이터를 유용한 결과로 변환하는 데 따르는 레시피와 같습니다. 이미지에서 객체를 인식하거나 문장을 이해하는 등의 결과물을 만들어냅니다. 앞서 언급했듯이, 이것이 바로 NPU가 중요한 역할을 하는 곳입니다. 왜냐하면 NPUs는 특히 행렬 형태로 표현된 대량의 데이터에 대해 빠르게 연산을 수행할 수 있는 것으로 특별히 설계되었기 때문에, 인공지능 애플리케이션에 대해 극도로 효과적입니다.

## NPU 아키텍처

![NPU 아키텍처](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_2.png)

NPUs의 아키텍처는 CPU와 GPU와는 크게 다릅니다. CPU는 여러 가지 명령을 순차적으로 실행하는 데 설계되었고, GPU는 병렬 연산을 수행하는 데 중점을 둔 반면, NPUs는 기계 학습 작업을 특별히 가속화하기 위해 설계되었습니다. 이는 다음을 통해 달성됩니다:

<div class="content-ad"></div>

- 전문화된 컴퓨트 유닛: NPUs는 신경망 모델의 교육 및 추론에 필수적인 곱셈 및 누산 작업을 위한 전용 하드웨어를 통합합니다.
- 고속 온칩 메모리: 메모리 접근과 관련된 병목 현상을 최소화하기 위해 NPUs에는 높은 속도의 통합형 메모리가 탑재되어 있어서 모델 데이터 및 가중치에 신속하게 접근할 수 있습니다.
- 병렬 아키텍처: NPUs는 수천 개의 병렬 작업을 수행하도록 설계되어 있어 데이터 일괄 처리에서 극도로 효율적입니다.

NPU는 분 당 수천 장의 이미지를 처리하며 자세히 분석할 수 있습니다. 이는 장치의 센서와 카메라를 통해 사용자에게 고급 경험을 제공하면서 "주변 현실을 읽어" 면체 인식, 사진 향상, 혼합 현실 애플리케이션과 상호 작용과 같은 복잡한 작업을 수행할 수 있게 합니다.

NPU의 특별한 종류는 TPU(텐서 처리 유닛)입니다. 이는 Google이 데이터 센터에서 기계 학습 작업을 가속화하기 위해 개발한 프로세서입니다. 사실, NPUs는 다양한 제조업체가 다양한 장치 및 응용 프로그램에서 AI 성능을 향상시키기 위해 설계한 보다 넓은 범주의 AI 전용 프로세서인 반면, TPU는 TensorFlow에서 작업을 처리하고 Google 클라우드 서비스에서 텐서 계산을 효율적으로 수행할 수 있도록 설계 및 최적화되었습니다.

## 인공 지능에서 TOPS란 무엇인가요?

<div class="content-ad"></div>

![2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_3](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_3.png)

TOPS (Tera Operations Per Second)는 기술 세계에서 새로운 용어는 아니지만, 최근 고급 AI PC의 등장으로 주목을 받고 있습니다.

TOPS는 NPU 또는 기타 AI 전용 프로세서의 컴퓨팅 용량을 측정하는 데 사용되는 지표입니다. 이 측정치는 NPU가 한 초에 수행할 수 있는 작업 수를 나타내며, 1조(영미식 계산의 경우 1조는 백만의 백만을 나타내며, 10^12 = 1,000,000,000,000으로 10진 표기법으로 표현됩니다). 이러한 작업을 수행하는 주요 단위는 MAC(Multiply-Accumulate)이며, 이는 각 클록 주기에서 곱셈과 덧셈(신경망과 기타 AI 응용 프로그램에 기초적인 작업)을 수행합니다. NPU의 작동 주파수인 즉 클록 주기당 클록 수는 주어진 시간에 수행할 작업 수를 직접적으로 영향을 미쳐, 결국 TOPS를 결정합니다.

TOPS는 완벽한 측정 지표가 아니며 여러 변수가 시스템이 AI 작업을 수행하는 데 성능에 영향을 미칩니다만, 칩 제조업체는 제품을 홍보하기 위해 이 매개변수에 의존하며, 기본적으로 성능 측정을 단순화하고 구매자가 무엇을 얻는지 이해할 수 있도록 돕습니다. 다음과 같은 TOPS를 계산하는 공식은 NPU의 속도를 빠르게 평가하고 다른 장치들과 비교하는 데 빠른 참고 자료를 제공합니다:

<div class="content-ad"></div>

```js
- 표시된 테이블을 마크다운 형식으로 변경하십시오.
```

<div class="content-ad"></div>

## GPU와 NPU의 TOPS 간 차이점

NVIDIA RTX 4090과 같은 데스크톱 GPU는 1,300 이상의 TOPS 성능을 자랑하며, Microsoft의 CoPilot+ 노트북은 45 TOPS만을 주장한다는 것을 읽으면 혼동스러울 수 있습니다. 하지만 이것은 모순되는 것이 없으며, 이 차이에 대해 명확한 설명이 있습니다.

이 숫자는 GPU가 수행할 수 있는 병렬 작업의 이론적 최대 가능성을 나타내며, 이는 그래픽 및 AI 작업을 포함합니다. GPU는 일반 목적으로 사용되며, 3D 그래픽 계산과 AI 가속 등 다양한 작업을 수행할 수 있는 능력을 갖추고 있으며, 따라서 그래픽 및 AI 애플리케이션을 위한 복잡한 병렬 계산을 처리할 수 있도록 설계되었습니다. 따라서, 그들의 TOPS 수는 강도 높은 그래픽 작업과 AI 계산을 동시에 처리할 수 있는 능력을 포함하고 있습니다.

반면에 NPU는 특정 AI 작업만을 최적화하는 데 특화되어 있으며, 행렬 곱셈 및 기타 딥러닝 작업과 같은 AI 작업에만 능력을 집중시킵니다. GPU보다 낮은 TOPS 수를 갖고 있더라도, NPUs는 각각의 특정 도메인에서 더 효율적입니다. 따라서 Qualcomm Snapdragon 프로세서나 Copilot+를 탑재한 Intel 시스템에 통합된 40-45 TOPS의 NPU는 신경망과 같은 특정 AI 계산을 수행하기 위해 최적화되어 있지만, GPU와 같이 다양한 응용분야를 갖지는 않습니다.

<div class="content-ad"></div>

또 하나의 고려해야 할 차이점이 있습니다: GPU는 그래픽 및 AI 계산 성능을 극대화하기 위해 다른 정밀도(FP32, FP16 등)에서 작동할 수 있지만, NPU는 효율성을 최적화하고 전력 소비를 줄이기 위해 낮은 정밀도(INT8, INT4)에서 작동하는 경우가 많습니다. 따라서 RTX 5000 Ada에 보고된 682 TOPS와 같은 값은 FP8과 같은 정밀도를 사용하는 Tensor Cores의 특정 AI Tensor 성능을 나타냅니다.

결국, GPU와 NPU는 AI 컴퓨팅에서 서로 다른 목적을 가지고 있습니다. 고수준의 TOPS를 갖춘 GPU는 그래픽 작업 및 다양한 정밀도에서의 AI를 포함한 여러 작업을 동시에 처리합니다. 반면, TOPS가 적은 NPUs는 낮은 정밀도를 사용하여 특정 AI 작업을 효율적으로 수행하도록 최적화되어 있습니다. 따라서 TOPS는 유용한 측정 항목이지만, 완전한 평가를 제공하지는 않으며, 특정 응용 프로그램 및 시스템 아키텍처의 맥락에서 고려되어야 합니다.

## GPU와 AI: AI 가속기의 진화

NPU의 등장 이전에는 NVIDIA와 같은 회사가 생산한 GPU 및 Apple의 M 시리즈와 같은 프로세서의 통합 솔루션이 로컬 AI 분야를 주도했습니다. 특히 CUDA 및 Tensor Core 아키텍처를 갖춘 NVIDIA 제품들은 병렬 아키텍처와 대량의 병렬 계산을 짧은 시간 내에 수행할 수 있는 능력으로 인해 머신러닝 모델의 훈련 및 추론에서 사실상의 표준이었습니다. 이러한 GPU는 PC뿐만 아니라 데이터 센터 서버도 구동하여 대규모 딥러닝 모델 훈련을 가능하게 하였으며, 데이터 센터 GPU 부문에서 약 98%의 시장 점유율을 차지하여 2023년에 376만 개의 GPU가 선적되었습니다.

<div class="content-ad"></div>

NPUs(인공 지능 가속기로도 알려져 있음)은 처음에 후아웨이와 애플이 Mate 10 Pro 및 iPhone X 모델로 도입되었습니다. 이러한 특수 칩은 인공 지능 및 머신 러닝을 위한 복잡한 계산을 수행하여 성능과 에너지 효율성을 크게 향상시켰습니다. 특히, 애플의 경우 iPhone X와 함께 소개된 A11 Bionic AI 칩은 SoC(시스템 온 칩)의 그래픽 가속기를 지원하여 스튜디오 품질의 애니메이션을 만들고 Face ID 얼굴 인식 및 animoji를 생성했습니다. 후아웨이의 경우, "분산 컴퓨팅" 구조를 갖춘 AI Kirin 970 칩은 이미지 분석, 음성 요청 처리 및 배터리 수명에 과도한 영향을 미치지 않고 실시간 번역을 담당했습니다.
나중에 쿼클롬의 AI SoC인 스냅드래곤 845가 출시되어 반복적이고 집중적인 작업을 처리하며 주 프로세서의 효율성을 향상시키고 스마트폰의 전반적인 작동 속도를 높였습니다.

## 애플 M 프로세서

![image](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_4.png)

M 시리즈 프로세서(M1, M2, M3 및 최신 M4와 같은)가 도입되면서 애플은 소비자 기기에서 로컬 인공 지능을 새로운 수준으로 끌어올렸습니다. 이러한 프로세서는 고급 GPU 및 신경 엔진을 통합하여 클라우드 서비스 없이 기기에서 직접 AI 작업을 가속화합니다. 이는 음성 및 얼굴 인식, 계산 사진술 및 증강 현실 어플리케이션과 같이 대기 시간이 적고 에너지 효율성이 높은 어플리케이션에 특히 유용합니다.
애플의 AI에 최적화된 코어를 통합된 솔루션은 하드웨어가 머신 러닝 워크로드를 처리하도록 특별히 설계될 수 있는 방법을 보여주는 사례로, 이전 솔루션과 비교하여 성능과 에너지 효율성을 크게 향상시킬 수 있습니다.

<div class="content-ad"></div>

## Apple M4 vs Snapdragon X Elite

![이미지](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_5.png)

애플 및 퀄컴이 현재 고급 NPU 기능을 갖춘 칩을 생산하고 있습니다. (애플이 정의한) 애플 M4의 Neural Engine은 16개의 코어를 갖추고 최대 38 TOPS를 수행할 수 있습니다. 이에 비해, 애플 M3의 NPU는 18 TOPS, Apple M2는 16 TOPS, Apple M1은 11 TOPS이며 아이폰 15 Pro의 Apple A17의 NPU는 35 TOPS를 제공합니다. 반면, 스냅드래곤 X Elite의 헥사곤 NPU는 최대 45 TOPS까지 도달합니다.

TOPS 값은 연산 유형과 정확도를 고려하지 않으면 완전한 의미가 없음을 인지해야 합니다. 퀄컴의 45 TOPS와 애플의 38 TOPS는 모두 INT8 연산(8비트 정수)에 기반하고 있으며, 전문가인 벤 바자린이 확인했습니다. 이는 퀄컴이 AI 컴퓨팅 능력 측면에서 우위에 있다는 것을 나타냅니다. 그러나 애플은 인텔과 AMD와 비교하여 소비자 칩셋에서 선두 주자로 남아 있습니다.

<div class="content-ad"></div>

사실, 더 분석해 보면, Apple M4는 Snapdragon X Elite와 비교할 때 우수한 CPU 성능을 제공하는데, 최고급 X Elite 변형보다 23% 빠른 속도를 보여줍니다. 심지어 그래픽 부문에서도 Snapdragon X Elite의 6코어 Adreno GPU가 Apple M4의 10코어 GPU와 경쟁할 수 없습니다.

최종적으로, NPU 성능 측면에서는 Snapdragon X Elite이 45 TOPS로 Apple M4의 38 TOPS를 넘어서 우위를 점합니다. 그러나 Apple M4는 CPU 및 GPU 성능에서 상당한 우위를 가집니다. Snapdragon X Elite은 Apple M3에 가까이 다가가지만 M4에서는 큰 차이로 뒤처지고 있습니다. 특히 에너지 효율성 측면에서 Apple은 경쟁사에 비해 명확한 우위를 보여 주었습니다. 그러나 NPU 측면만 고려할 경우, Snapdragon X Elite은 진정한 장점으로 빛을 발합니다.

## Microsoft Copilot+ PCs: NPU 통합

![이미지](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_6.png)

<div class="content-ad"></div>

최근에 Microsoft가 인공지능을 위해 특별히 설계된 Copilot+ PC라는 새로운 윈도우 PC 카테고리를 소개했습니다. 이 PC는 놀라운 성능을 자랑하는 새로운 칩을 탑재했는데, 초당 40조 회 이상의 작업을 실행할 수 있는 능력을 가지고 있습니다. 이 PC는 처음에 Qualcomm Snapdragon X 시리즈 칩으로 출시될 예정이지만, Intel은 곧 Lunar Lake 프로세서도 출시할 예정입니다. 이 프로세서는 40 TOPS NPU뿐만 아니라 60 GPU TOPS 이상의 성능을 제공하여 총 100 플랫폼 TOPS를 제공할 것입니다. AMD도 50 TOPS 신경 처리장치를 탑재한 새로운 Strix 칩을 개발 중이며, 이는 2024년 7월에 출시될 예정입니다.
Copilot+ PC는 고급 인공지능 모델을 실행하기 위해 신경 처리 장치(NPU)를 활용하여 Recall로 정보 검색, Cocreator로 실시간 이미지 생성, 및 Live Captions로 40여 개 언어로 오디오 번역 등의 혁신적인 경험을 제공합니다.

이 장치들은 고성능 CPU, GPU 및 NPU를 결합한 새로운 시스템 아키텍처를 갖추고 있습니다. Azure 클라우드의 고급 언어 모델에 연결된 Copilot+ PC는 기존 PC와 비교했을 때 AI 워크로드를 처리하는 데 최대 20배 더 많은 성능과 100배 더 효율적인 성능을 제공하여, 기존 제약사항인 지연, 비용 및 개인정보 처리 등의 문제를 제거하고 강력한 AI 경험을 기기에서 직접 실행할 수 있습니다.

Copilot+ PC는 2024년 6월 18일부터 출시되며, 999달러부터 시작하는 가격으로 판매될 예정입니다. Acer, ASUS, Dell, HP, Lenovo, Samsung, 그리고 Microsoft Surface 등의 기기 모델이 제공되며, 각각이 세련되고 가벼우며 강력한 디자인으로 새로운 AI 경험을 제공합니다.

## Windows 작업 관리자에서 NPU 모니터링하기

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_7.png)

새로운 AI 전용 칩이 소개되면서 해당 칩의 사용량을 모니터링해야 하는 필요성이 대두되었습니다. Intel Core Ultra CPU가 장착된 노트북에서는 Windows 작업 관리자에 Intel AI Boost 전용 섹션이 추가되어 사용자가 실시간으로 NPU(신경 처리 장치) 활동을 확인할 수 있습니다. AMD는 Ryzen 8040 시리즈 CPU가 장착된 노트북에서 유사한 기능을 제공할 것이라고 발표했습니다. 미래에는 XDNA 아키텍처를 기반으로 하는 Ryzen AI NPU를 직접 Task Manager에서 모니터링할 수 있을 것입니다. 이 통합은 사용자에게 NPU 성능 및 사용량을 명확히 보여주어 이 기술을 지원하는 시스템에서 AI 워크로드 관리를 용이하게 할 것입니다.

## Raspberry Pi 5에서 AI

![Image](/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_8.png)


<div class="content-ad"></div>

만약 당신이 NPUs가 고급 컴퓨터 전용이라고 생각했다면, 라즈베리 파이 재단이 최근에 라즈베리 파이 5용 AI KIT을 70달러에 출시했다는 것에 놀랄 것입니다. 이 패키지는 라즈베리 파이 M.2 HAT+ (초기에는 NVMe 장치 및 기타 PCIe 액세서리에 연결하기 위해 개발된)과 NPU를 탑재한 AI Hailo-8L M.2 가속 모듈로 구성되어 있습니다. 이 NPU는 작은 프로세서에 13 TOPS(테라 오퍼레이션/초)의 컴퓨팅 파워를 제공할 수 있습니다. 이전에는 구글이 Google Coral과 같은 AI 가속 모듈을 제공했지만, 그 파워는 4 TOPS였습니다.
라즈베리 파이 5용 AI HAT은 아직 대용량 언어 모델(LLM) 실행에 상당한 성능 향상을 제공하지는 못하지만(LLaMA와 같이 수십억 개의 파라미터를 가진 모델), 내장 컴퓨팅에서 가벼운 및 특정 AI 응용 프로그램에 이상적입니다. TensorFlow, TensorFlow Lite, Keras, PyTorch 및 ONNX와 같은 주요 AI 프레임워크 외에도 Hailo-8L M.2 모듈은 음성 인식, 물체 인식을 위한 컴퓨터 비전, 얼굴 감지 및 장면 분석과 같은 응용 프로그램에 이상적입니다. 이때 소형 감시, 자율 주행 차량 및 비디오 분석을 위해 실시간으로 유지하면서 저전력 소비도 유지합니다.

새로운 솔루션을 실험하는 것을 좋아하는 사람들을 위해, 공식 공급업체에서는 지원하지 않는 Frankenstein 구성을 시도한 사람들도 있습니다. 이 솔루션은 13 TOPS의 Hailo-8L과 26 TOPS의 Hailo-8, Coral Dual Edge TPU(8 TOPS) 및 Coral Edge TPU(4 TOPS)가 통합된 라즈베리 파이 5를 사용하여 총 51 TOPS를 달성했습니다. 이 구성은 다양한 컴퓨팅 파워 벤치마크에서 뛰어나도록 설계되었으며, 최소한 40 TOPS의 Copilot+ PC 표준, 45 TOPS의 Qualcomm의 Snapdragon X, 38 TOPS의 Apple의 M4, 48 TOPS의 Intel의 Lunar Lake 및 50 TOPS의 AMD의 AI 300 시리즈를 초과했습니다.

<img src="/assets/img/2024-06-22-CPUGPUandNPUUnderstandingKeyDifferencesandTheirRolesinArtificialIntelligence_9.png" />

## 결론

<div class="content-ad"></div>

신경 처리 장치(NPUs)는 컴퓨팅 환경을 재정의하며, 인공 지능 애플리케이션의 증가하는 요구를 충족하는 데 필수적인 역할을 하고 있습니다. 기계 학습과 인공 지능을 가속화하기 위해 특화된 구조를 갖춘 NPUs는 다양한 분야에서 효율성과 성능을 크게 향상시킵니다.

개발자와 기업들에게 NPUs를 시스템에 통합하는 것은 다음과 같은 실용적인 이점을 제공합니다:

- 지역 및 실시간 실행: NPUs는 복잡한 AI 모델을 지역에서 실행하여 클라우드 서비스에 대한 의존을 줄이고 음성 및 얼굴 인식, 의료 진단, 자율 주행 시스템과 같은 중요 응용 프로그램의 대기 시간을 줄입니다.
- 자원 최적화: GPU가 일반 계산과 수치 그래픽에 대한 대량의 데이터를 처리하는 반면, NPUs는 특정하고 반복적인 AI 작업에 집중하여 GPU 자원을 확보하여 전체적인 운영 효율성을 향상시킵니다.
- 에너지 효율성: NPUs는 낮은 정밀도에서 작동하도록 설계되어 전통적인 GPU와 비교하여 에너지 소비를 줄이는데, 특히 모바일 장치와 엣지 응용 프로그램에서 에너지 관리가 중요한 경우에 이점이 있습니다.
- 소비자 및 기업 응용: 소비자 장치에서 NPUs를 사용하면 비디오 통화에서 배경 흐림과 계산 사진 촬영과 같은 고급 기능을 제공할 수 있습니다. 기업 환경에서는 모델 훈련 및 실시간 추론을 가속화하여 산업 자동화, 데이터 분석, 보안 등에 새로운 가능성을 열어줍니다.

NPUs의 점점 더 많은 채택이 우리가 AI 계산적 도전 과제에 접근하는 방식을 변화시킬 것입니다. 경쟁력을 유지하기 위해 기업과 IT 전문가들은 NPUs의 작동 방식과 실용적인 응용 프로그램을 이해하고, 인공 지능의 잠재력을 완전히 활용하기 위해 솔루션에 통합하는 것이 중요합니다.