---
title: "대형 언어 모델 설명  I"
description: ""
coverImage: "/assets/img/2024-06-19-LargeLanguageModelsExplainedI_0.png"
date: 2024-06-19 19:23
ogImage: 
  url: /assets/img/2024-06-19-LargeLanguageModelsExplainedI_0.png
tag: Tech
originalTitle: "Large Language Models Explained — I"
link: "https://medium.com/@prasannasanjay1/large-language-models-explained-i-62a55999b7a2"
---


안녕하세요! ChatGPT가 어떻게 작동하는지 궁금했던 적이 있나요? ChatGPT-3.5는 무료로 제공되지만 ChatGPT-4는 유료인 이유가 궁금하신가요? 그와 같은 대안이 있는지 알아보고 싶나요? 이 기사에서 ChatGPT에 대해 도는 모든 질문에 답해보겠습니다. ChatGPT에 대한 기술적 세부사항에만 근거하여 수학이나 ChatGPT 뒤에 있는 프로그램에 대한 내용은 제외할 것입니다.

![이미지](/assets/img/2024-06-19-LargeLanguageModelsExplainedI_0.png)

ChatGPT를 이해하기 위해서는 뉴럴 네트워크가 무엇인지 알아야 합니다. 우리는 인간 뇌의 기능 단위가 뉴런임을 알고 있습니다. 뉴런은 뇌가 일을 기억하고 자체적으로 생각하도록 하는 길을 만들면서 뉴런의 네트워크를 형성함으로써 작용합니다. 지난 몇10년 동안 많은 과학자들이 인간 뇌를 모방하여 유사한 지능을 끌어내기 위해 노력해왔습니다. 이 넓은 연구 분야를 인공 지능이라고 합니다.

인간 뇌와 유사하게, 여기서 관심 있는 뉴럴 네트워크는 정보를 흡수하고 처리할 수 있는 여러 뉴런으로 이루어져 있습니다. 기본 뉴럴 네트워크의 추상적인 구조는 다음과 같을 것입니다:

<div class="content-ad"></div>

![그림](/assets/img/2024-06-19-LargeLanguageModelsExplainedI_1.png)

입력 레이어를 통해 네트워크로 입력이 전달되는 구조로 구성되어 있습니다. 정보를 수용하는 데 사용되는 여러 개의 은닉 레이어와 신경 네트워크의 성격에 따라 출력을 제공하는 출력 레이어로 구성됩니다. 이들 모든 뉴런은 상호 연결되어 있으며 이러한 연결에는 가중치라는 것이 있습니다. 무엇이 있는지 결정하고 그 뉴런과 경로의 중요도를 결정합니다. 일반적으로 신경망은 뉴런, 가중치, 편향, 활성화 함수 및 최적화기로 구성되어 있습니다. (이 모든 것에 대한 세부사항은 이 기사의 목적이 아니므로 나중에 다룰 것입니다.)

n-gram과 같은 전통적인 언어 모델은 이전 단어에 기초하여 문장에서 다음 단어의 가능성을 예측합니다. 또 다른 모델인 Hidden Markov Model (HMM)은 관찰 시퀀스와 숨겨진 상태 시퀀스 간의 확률적 관계를 설명하는 데 사용됩니다. 언어 모델이 일반적으로 확률적이며 문장에서 다음 단어를 예측하려고 하는 것을 이해합니다. 이 아이디어는 거대한 언어 모델의 기초이며 많은 뉴런이 관련되어 있다는 점을 제외하고도 동일합니다!

이제 CNN(Convolutional Neural networks), RNN(Recurrent Neural Networks), Feed Forward Neural Networks 등과 같은 다양한 유형의 신경망이 있습니다. RNN은 ChatGPT의 기초를 형성합니다. 와우!! 물론, 기본 RNN에는 많은 단점이 있습니다. 따라서 RNN을 기초로 하는 Long Short Term Memory 신경망(LSTM)이 만들어졌습니다. 심지어 LSTM도 잘 작동하지 않았기 때문에 Encoder-Decoder 모델이 제안되었습니다. 인코더는 입력 시퀀스를 받아 고정 길이 벡터로 처리합니다. 이 벡터는 출력 시퀀스를 생성하는 디코더로 보내집니다. (참고: 각 인코더와 디코더에는 여러 개의 신경망이 내장되어 있습니다.) 그러나 인코더가 처리하기에 입력 시퀀스가 너무 길면 정보가 손실될 수 있습니다. 이 문제를 해결하기 위해 어텐션 메커니즘이 제안되었으며, 이를 통해 디코더는 입력 시퀀스를 다시 살펴보고 시퀀스의 중요한 부분에만 주의를 기울일 수 있습니다. 마지막으로, Transformer 아키텍처는 인코더-디코더 모델에서 어텐션 메커니즘의 사용을 결합하여 산업에 혁명을 일으켰습니다! Transformer 모델은 특히 긴 데이터 시퀀스를 처리하는 데 능숙합니다. 기계 번역 및 텍스트 생성과 같은 자연어 처리 작업에 적합합니다.

<div class="content-ad"></div>

(참고: 위 단락에서는 자세히 설명하지 않았습니다. 대신, 모든 것을 깊이 있는 연구할 수 있는 모든 필요한 링크를 제공했습니다. 다가오는 기사에서도 모든 것을 자세히 다룰 예정입니다).

Large Language Models는 방대한 양의 데이터로 훈련된 언어 모델에 대한 것입니다. 따라서 LLM의 기본 모델은 주로 방대한 양의 데이터로 훈련된 transformer 모델이라는 것이 이해됩니다.

![Large Language Models](/assets/img/2024-06-19-LargeLanguageModelsExplainedI_2.png)

Generative Pre-trained Transformer (GPT)은 Encoder만 사용하는 BERT 및 Encoder-Decoder를 사용하는 BART와 달리 Decoder 모델만 사용하는 LLM 중 하나입니다. 본 문서에서는 GPT-3.5를 고려합니다. 이는 약 96개의 레이어와 175B의 파라미터를 가진 풍부한 데이터로 훈련되었습니다. ChatGPT는 이전 버전인 GPT-3의 세분화된 버전으로, ‘Reinforcement Learning With Human Feedback’(RLHF)라는 개념을 포함하고 있습니다. 3.5 버전은 텍스트 생성에만 중점을 둔 것으로, 텍스트 형식으로 묻는 질문에 텍스트 형식으로 답변합니다.

<div class="content-ad"></div>

하지만 실제로 어떻게 작동하는 건가요?

우리가 하는 모든 질문마다, 입력은 GPT로 순차적으로 전달되며 96개의 레이어를 거쳐 다음 단어를 예측합니다 (이제 ChatGPT가 검색 엔진과 같이 한꺼번에 단어를 반환하지 않는 이유를 알게 되었죠).

예를 들어, "인도의 수도는 무엇인가요?"라고 묻는다고 해봅시다. 이 입력은 GPT로 한 단어씩 전송됩니다 (필요한 모든 벡터 생성과 함께) 그리고 마지막으로 모든 문맥 단어들과 함께 "다음 단어를 예측합니다. "수도", "인도", "델리"라는 단어들이 데이터에서 다른 단어보다 많이 함께 나타날 수 있죠.

![이미지](/assets/img/2024-06-19-LargeLanguageModelsExplainedI_3.png)

<div class="content-ad"></div>

마지막으로, GPT는 실제로는 신경망에 의해 형성된 LLM이기도 합니다. 따라서 어떤 질문을 하면, 이는 사전 훈련된 모델을 테스트하는 것이며 우리가 얻는 답변은 모델의 예측입니다. 하지만 모델이 어디에서 실행되는 걸까요? 모델을 로컬 머신에서 실행시킬 수 있을까요? 사전 훈련된 모델을 특정 도메인 질문에 대답하도록 할 수 있을까요?
이 모든 질문에 대한 답변은 다음 기사에서 제공할 예정입니다. 그때까지 지식에 대한 갈증을 유지해 주세요!
독자 여러분의 읽어주셔서 감사합니다.

- https://www.labellerr.com/blog/evolution-of-neural-networks-to-large-language-models/
- https://www.v7labs.com/blog/neural-network-architectures-guide
- https://medium.com/@amanatulla1606/transformer-architecture-explained-2c49e2257b4c
- https://www.geeksforgeeks.org/hidden-markov-model-in-machine-learning/
- https://iq.opengenus.org/gpt-3-5-model/
- https://manikanthgoud123.medium.com/what-is-rlhf-reinforcement-learning-from-human-feedback-d0ec88e0866c#:~:text=RLHF%20involves%20an%20ongoing%20training,creative%20and%20user%2Daligned%20results.