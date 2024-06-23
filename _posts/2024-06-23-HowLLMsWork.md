---
title: "LLMs의 작동 원리 - 대형 언어 모델의 비밀 밝혀보기"
description: ""
coverImage: "/assets/img/2024-06-23-HowLLMsWork_0.png"
date: 2024-06-23 19:16
ogImage: 
  url: /assets/img/2024-06-23-HowLLMsWork_0.png
tag: Tech
originalTitle: "How LLMs Work"
link: "https://medium.com/@chitrakumarsai/how-llms-work-0ddfdb0d21e0"
---



![LLMs operation](/assets/img/2024-06-23-HowLLMsWork_0.png)

LLMs (Large Language Models) operate by predicting the next token based on a sequence of previous tokens. Each generated token is then used as input to generate the next one, enabling the model’s text generation capabilities.

## Step 1: Prompts

The process starts with receiving a prompt, which is tokenized and converted into embeddings, or vector representations, of the input text. These embeddings, initially random, are learned during model training and represent a non-contextualized vector form of the input token.


<div class="content-ad"></div>

## 단계 2: 인코딩

이 모델은 층별 어텐션 및 피드포워드 계산을 수행하여 어휘 내 각 단어에 숫자(logit)를 할당합니다(디코더 모델인 GPT-X, LLaMA 등) 또는 컨텍스트화된 임베딩을 출력합니다(버트, 로버타, 일렉트라 등과 같은 인코더 모델).

## 단계 3: 정규화

디코더 모델의 경우, 최종 단계는 Softmax 함수를 사용하여 비정규화된 로짓을 정규화된 확률 분포로 변환하는 것을 포함합니다. 이는 생성된 텍스트에서 다음 단어를 결정합니다.

<div class="content-ad"></div>

# 추가 세부 정보

## 토큰화

원시 입력 텍스트는 토큰화를 통해 종종 하위 단위 또는 단어로 분해됩니다. 이 과정을 통해 입력이 모델의 고정 된 어휘와 일치하도록되어 모델에 인식되도록합니다.

## 임베딩

<div class="content-ad"></div>

각 토큰은 임베딩 행렬을 사용하여 고차원 벡터로 매핑됩니다. 이 벡터 표현은 토큰의 의미적 의미를 포착하고 모델의 후속 계층에 입력으로 작용합니다. 이러한 임베딩에는 위치 인코딩이 추가되어 토큰 순서에 대한 정보를 제공하며, 내재된 시퀀스 인식이 부족한 트랜스포머와 같은 모델에 중요합니다.

## 트랜스포머 아키텍처

현대 LLM의 핵심인 트랜스포머 아키텍처는 여러 계층으로 구성됩니다. 각 계층에는 멀티 헤드 셀프 어텐션 메커니즘과 위치별 피드포워드 네트워크가 포함됩니다.

![트랜스포머 아키텍처](/assets/img/2024-06-23-HowLLMsWork_1.png)

<div class="content-ad"></div>

셀프 어텐션 메커니즘은 토큰이 다른 토큰과의 관련성을 평가할 수 있게 하여 모델이 입력의 관련 부분에 집중할 수 있게 합니다. 그 결과로 얻는 정보는 각 위치에서 독립적으로 피드포워드 신경망을 통해 처리됩니다.

셀프-어텐션 또는 피드포워드 네트워크 등 각 서브 레이어에는 잔차 연결 후 레이어 정규화가 이어집니다. 이 설정은 활성화를 안정화시키고 학습을 가속화하는 데 도움이 됩니다.

트랜스포머 레이어를 통과한 후 각 토큰의 최종 표현은 로짓 벡터로 변환됩니다. 각 로짓은 모델 어휘 중 단어에 해당하며 해당 단어가 시퀀스에서 다음 단어일 가능성을 나타냅니다.

소프트맥스 함수는 로짓에 적용되어 확률로 변환됩니다. 이 정규화에 의해 확률은 합이 1이 되도록 보장되며 각 확률은 0과 1 사이에 있습니다. 가장 높은 확률을 가진 단어가 시퀀스에서 다음 단어로 선택됩니다.

<div class="content-ad"></div>

이 테이블 태그를 마크다운 형식으로 변경해 주세요.