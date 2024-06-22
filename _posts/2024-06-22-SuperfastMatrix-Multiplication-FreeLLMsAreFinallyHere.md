---
title: "초고속 행렬 곱셈 필요 없는 LLMs대규모 언어 모델 드디어 등장"
description: ""
coverImage: "/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_0.png"
date: 2024-06-22 21:03
ogImage: 
  url: /assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_0.png
tag: Tech
originalTitle: "Superfast Matrix-Multiplication-Free LLMs Are Finally Here"
link: "https://medium.com/gitconnected/superfast-matrix-multiplication-free-llms-are-finally-here-cac5b78a4fa7"
---


최근 ArXiv에 발표된 연구 논문은 오늘날 우리가 알고 있는 LLM(Large Language Model)에 대해 대대적인 변화를 제안했습니다.

이 프로젝트에 참여한 연구진들은 LLM에서 수행되는 핵심 수학적 연산인 Matrix Multiplication (MatMul)을 제거했습니다.

그들은 새로운 MatMul이 없는 LLM이 어떻게 10억 개의 파라미터 규모에서도 강력하게 수행될 수 있으며, 특정 작업에서는 전통적인 LLM보다 성능을 능가할 수 있다는 것을 보여주었습니다!

이것은 단 하나의 최적화로 가능해진 거대한 변화입니다!

<div class="content-ad"></div>

표 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>

행렬 곱셈은 첫 번째 행렬의 열 수가 두 번째 행렬의 행 수와 같아야 하는 조건 하에 두 행렬을 곱하여 세 번째 행렬을 생성하는 대수 연산입니다.

![이미지](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_0.png)

# LLMs가 행렬 곱셈을 사용하는 방법

행렬 곱셈(MatMul)은 LLMs에서 수행되는 핵심 수학 연산입니다.

<div class="content-ad"></div>

먼저, MatMul은 입력 텍스트에서 토큰과 위치 임베딩을 생성하는 데 사용됩니다.

그런 다음 LLM 내의 트랜스포머에서 Self-attention 메커니즘은 Query(Q), Key(K) 및 Value(V) 행렬을 사용하여 관심 점수 행렬을 계산하는 데 MatMul을 사용합니다.

이러한 Q, K 및 V 행렬은 다시 입력 및 학습된 가중치 행렬을 사용하여 MatMul 작업을 통해 얻어집니다.

다음으로, MatMul은 입력값, 가중치 및 편향에 적용되어 (비선형 활성화 함수를 거친) 밀집 피드포워드 네트워크 내의 출력을 생성합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_1.png" />

마침내, LLM의 출력 레이어는 최종 예측을 생성하는 데 이 작업을 사용합니다.

## 오늘날 행렬 곱셈은 어떻게 최적화되나요

CUDA 및 cuBLAS와 같은 라이브러리를 사용하여 MatMul 연산을 강력한 GPU를 사용하여 병렬화하고 가속화하여 효율적으로 수행됩니다.

<div class="content-ad"></div>

그러나 LLMs의 훈련 및 추론 단계에서 계산 비용의 가장 큰 비율을 차지하고 있다.

지금까지 이러한 연산을 대체하기 위해 많은 노력이 기울어졌지만(AdderNet, 스파이킹 신경망, 이진화된 신경망, BitNet으로), 모두 규모에 사용되었을 때 실패했습니다.

하지만 이제는 다릅니다!

하지만, 우리가 전진해 이해하기 전에 이 MatMul-free LLMs에 대해 자세히 알아야 할 전통적인 LLMs를 이루는 구성 요소에 대해 더 배워보아야 합니다.

<div class="content-ad"></div>

# 전통 LLM 구성 요소 이해하기

전통 LLM의 Transformer 구조에는 순차 정보를 이해하는 데 도움이 되는 핵심 구성 요소 두 가지가 있습니다.

## 토큰 믹서

이 구성 요소는 순서열 내에서 서로 다른 토큰 간의 관계를 처리합니다.

<div class="content-ad"></div>

전통적인 LLMs에서의 토큰 혼합은 Self-attention 메커니즘을 사용하여 달성됩니다.

## 채널 믹서

이 구성 요소는 입력 표현의 서로 다른 채널이나 특징 차원 간의 정보 통합을 처리합니다.

채널 혼합은 위치별 피드포워드 네트워크를 사용하여 달성되며, 이는 토큰 혼합 단계에서 추출된 피처를 정제하고 통합합니다.

<div class="content-ad"></div>

Transformer 아키텍처에서 이 두 단계를 아래에서 확인할 수 있어요.

![사진](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_2.png)

이제 우리가 이들을 알았으니, 진짜 주요 내용으로 넘어가봐요!

# 새로운 LLM 아키텍처에서 MatMul은 어떻게 제거되나요?

<div class="content-ad"></div>

MatMul이 없는 LLM은 전통적인 LLM 아키텍처에 세 가지 주요 변경을 가한 후 만들어 졌어요.

- MatMul이 없는 밀도 레이어
- MatMul이 없는 토큰 혼합 또는 셀프 어텐션
- MatMul이 없는 채널 믹서

각각을 자세히 살펴보죠.

## 1. MatMul이 없는 밀도 레이어

<div class="content-ad"></div>

비트넷에 영감을 받아, 밀도 레이어들을 먼저 비트린어 모듈로 대체했습니다.

이 모듈은 삼중 가중치 또는 가중치 행렬의 가중치를 -1, 0 및 +1의 세 가지 가능한 값만 가질 수 있는 테너리 가중치를 사용합니다.

이 제한은 테너리 양자화라고 불리며 MatMul에서의 곱셈 연산을 간단한 덧셈 또는 뺄셈 연산으로 대체합니다.

## 하드웨어 효율적인 융합된 비트린어 레이어

<div class="content-ad"></div>

원래의 BitNet에서의 BitLinear 레이어는 BitLinear 입력에 앞서 RMSNorm 활성화를 적용합니다.

그러나 이 구현은 GPU의 다양한 유형의 메모리 간에 많은 I/O 작업을 도입하여 효율적이지 않다는 것이 밝혀졌습니다 (HBM 및 SRAM).

따라서 연구원들은 RMSNorm 활성화 및 양자화 단계를 별도의 메모리 작업을 사용하여 따로 수행하는 대신에 SRAM에서 하나의 작업으로 퓨즈된 하드웨어 효율적인 퓨즈드 비트리니어 레이어를 도입했습니다.

## 2. MatMul-free Token Mixer

<div class="content-ad"></div>

셀프 어텐션 토큰 믹서는 Query(Q), Key(K) 및 Value(V) 매트릭스 간의 MatMul을 포함하고 있는데, 수정된 게이트 순환 유닛(GRU) 아키텍처로 교체되었습니다.

![이미지](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_3.png)

다음 변경 사항이 이 수정된 GRU 아키텍처로 이어졌습니다 —

- 이러한 은닉 상태 간의 가중치 및 tanh 활성화가 제거되었습니다.
- 후보 은닉 상태 계산을 은닉 상태와 연동 해제하고 입력의 선형 변환이 간소화되었습니다.
- LSTM 아키텍처에서 영감을 받아 은닉 상태와 출력 사이에 데이터 종속적인 출력 게이트가 추가되었습니다.
- 모든 가중치가 -1, 0 및 +1 세 가지 가능한 값을 갖는 삼진 가중치로 대체되었습니다.

<div class="content-ad"></div>

## 3. 매트릭스 곱셈 없이 채널 믹서

피드포워드 네트워크 대신, 게이트된 선형 유닛(GLU)이 매트릭스 곱셈 없는 아키텍처에서 채널 믹서로 사용되었습니다.

GLU와 함께 삼진 가중치를 다시 사용하여 매트릭스 곱셈을 간단한 덧셈과 뺄셈 연산으로 대체했습니다.

![이미지](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_4.png)

<div class="content-ad"></div>

# MatMul 미사용 LLM이 얼마나 잘 수행되었는지

MatMul을 사용하지 않은 LM 모델은 다양한 언어 작업에서 강력한 제로샷 성능을 보여주었습니다. 이 작업은 질문 답변과 상식적 추론부터 물리 이해에 이르기까지 다양합니다.

Llama-2와 같은 많은 인기 있는 LLM에 사용된 Transformer ++ 구조와 비교했을 때 경쟁력 있는 성능을 달성했습니다.

MatMul을 사용하지 않은 27억 개 LLM은 ARC-Challenge 및 OpenbookQA 벤치마크에서 Transformer++ 대응 모델보다 뛰어난 성과를 거뒀다는 점을 기억할 수 있습니다!

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_5.png)

메모리 효율성 측면에서 MatMul-free LLM은 Transformer++보다 모든 모델 크기에서 더 낮은 메모리 사용량과 지연 시간을 보여주었습니다.

13B 매개변수를 가진 가장 큰 모델 크기의 경우, MatMul-free LLM은 GPU 메모리에서 4.19 GB만 사용하고 지연 시간은 695.48밀리초였으며, 반면에 Transformer++은 48.50 GB의 메모리가 필요했고 지연 시간은 3183.10밀리초였습니다.

![이미지](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_6.png)


<div class="content-ad"></div>

연구자들은 자사의 Fused BitLinear 구현과 일반적인 BitLinear 구현을 비교하여 LLM 훈련 속도를 25.6% 향상시키고 메모리 소비량을 61.0% 감소시켰다고 언급했습니다!

![image](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_7.png)

그들은 그 후에 MatMul-free LLMs의 삼항 작업을 더 잘 수행하기 위해 Field-programmable gate arrays (FPGA)를 사용한 맞춤형 하드웨어 솔루션을 구축하여 이 모델들의 전력 소비, 대기 시간 및 메모리 사용량을 더 낮췄습니다.

특히, 그들의 13W 파워를 사용하는 13억 개 파라미터 모델은 인간의 독해 속도를 달성하며, 인간 두뇌의 전력 소비와 유사한 효율성을 달성했습니다!

<div class="content-ad"></div>


![SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_8.png)

드디어 MatMul-free LLMs의 투사를 확장하면, Transformer++보다 오류가 급격하게 감소하는 것을 보여주었습니다.

이는 이러한 LLMs가 성능을 향상시키는 데 도움이 되는 추가 훈련 계산 리소스를 더 효율적으로 사용한다는 것을 의미합니다.

이것은 수조 개 또는 수조 매개변수로 확장되는 미래 MatMul-free LLMs에 매우 유망한 속보입니다.


<div class="content-ad"></div>


![image](/assets/img/2024-06-22-SuperfastMatrix-Multiplication-FreeLLMsAreFinallyHere_9.png)

저희 연구팀이 직면한 계산 제약으로 인해, MatMul-free LLMs는 아직 극단적으로 대규모로 테스트되지 않았으며 GPT-4와 같이 100B+ 매개변수를 가진 모델과 비교할 수 없습니다.

하지만 저는 그들이 강력한 GPU에 과도하게 의존하는 것 없이 LLM의 교육 및 사용 방법을 개선하기 위한 큰 진전으로 간주합니다. 오늘날 흔한 것입니다.

이에 대한 당신의 생각은 무엇인가요? 댓글에서 알려주세요.


<div class="content-ad"></div>

# 더 많은 자료

- ArXiv에 등재된 'Scalable MatMul-free Language Modeling' 논문
- MatMul-free LLMs 구현체가 있는 GitHub 저장소
- ArXiv에 등재된 'BitNet: Scaling 1-bit Transformers for Large Language Models'에 관한 연구 논문
- 하버드 대학 NLP의 'The Annotated Transformer' 라는 문서

## 만약 나의 작업과 연결을 유지하고 싶다면, 여기에 내 메일링 리스트 링크들이 있습니다 —