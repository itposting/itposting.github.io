---
title: "대형 언어 모델 완벽 이해  두 번째 이야기"
description: ""
coverImage: "/assets/img/2024-06-22-LargeLanguageModelsExplainedII_0.png"
date: 2024-06-22 20:33
ogImage: 
  url: /assets/img/2024-06-22-LargeLanguageModelsExplainedII_0.png
tag: Tech
originalTitle: "Large Language Models Explained — II"
link: "https://medium.com/@prasannasanjay1/large-language-models-explained-ii-9c135ad47abc"
---


ChatGPT의 추상적 진화와 LLM의 일반적인 세부 정보가 'Large Language Models Explained — I'에서 제공되었습니다. 이전 글에서 몇 가지 질문으로 글을 마무리했습니다. 이 글에서는 해당 질문에 대한 답을 논의하고 LLM의 기본 프로그래밍 측면부터 시작하겠습니다.

이전 글에서 언급했듯이, ChatGPT는 GPT(Generative Pre-trained Transformer)라는 LLM을 사용하며, LLM이란 단순히 여러 신경망의 조합일 뿐입니다. 결국 LLM은 딥러닝 모델이나 기계 학습 모델과 유사한 모델에 불과합니다. 그러므로 사용자가 ChatGPT에 질문을 하면 미리 훈련된 모델을 테스트하는 것과 유사합니다(기계 학습 모델을 사용할 때와 같은 방식입니다). 예를 들어, KNN 모델을 훈련하고 sklearn 패키지를 사용하는 경우 다음과 같이 작성할 수 있습니다.

```js
from sklearn.neighbors import KNeighborsClassifier
neigh = KNeighborsClassifier(n_neighbors=3)
neigh.fit(X, y) ##모델을 훈련하기 위해 사용되는 LINE
neigh.predict([[1.1]]) ##모델을 테스트하기 위해 사용되는 LINE
```

위의 코드에서 'neigh.fit()' 함수는 KNN 분류기를 훈련하는 데 사용되고, 'neigh.predict()'는 주어진 테스트 데이터의 출력을 예측하는 데 사용됩니다. 비슷하게 ChatGPT에 묻는 질문은 Transformer 아키텍처를 기반으로 한 GPT 모델에 입력되어 문장의 끝에 도달할 때까지 다음 단어를 예측하게 됩니다. 우리가 KNN과 같은 분류기를 훈련하기 위해 작은 양의 데이터를 사용하는 것과 달리, GPT는 많은 양의 데이터로 훈련되었고 실행에 많은 메모리가 필요한 거대한 모델입니다. (참고: 이때 진짜 영웅 GPU가 필요합니다. GPU에 대해 자세히 설명하지는 않았지만 원한다면 여기서 배울 수 있습니다.)

<div class="content-ad"></div>

이제 이러한 LLM을 실행하기 위해 필요한 메모리 양은 상상 이상으로 많습니다. Openai 및 Google과 같은 몇 개의 회사만이 이러한 대규모 메모리를 확보할 수 있습니다. 만약 우리가 우리의 컴퓨터에서 이러한 거대한 LLM을 실행할 수 없다면, 어떻게 접근하고 그들을 활용할 수 있을까요? 이 질문의 답은 약간 까다롭습니다.  
우선 openai.com에 로그인하면 ChatGPT에 무료 액세스할 수 있습니다. 거기서 질문을 하고 채팅할 수 있습니다. Openai는 이러한 무거운 부하를 관리할 수 있는 강력한 백엔드(부하 분산)를 갖고 있습니다. 회사는 GPT가 실행 중인 서버를 항상 켜놓기 때문에 원하는 때에 질문할 수 있습니다.  
둘째로, 애플리케이션을 구축하는 데 LLM을 활용할 수 있습니다. 여러분이 애플리케이션을 구축하기 시작할 수 있는 기본 아이디어를 제공하겠습니다.  

다음과 같은 방식으로 기본적인 API에 대한 개념을 가지고 있어야 합니다. 간단히 말해 Application Programming Interface(API)는 두 대 이상의 컴퓨터가 통신하는 방법입니다. 우리의 경우, 클라이언트는 애플리케이션을 구축하려는 사용자이며, 서버는 LLM이 실행 중인 곳입니다. 이 두 대 사이에 채널을 구축하려면 API를 사용해야 합니다. API는 키 형식으로 제공됩니다(일반적으로 알파벳과 숫자의 혼합).  
이제 서버와 통신하기 위한 API 키를 어떻게 얻을까요?  
1) openai.com에 방문합니다.  
2) 제품으로 이동합니다.  
3) API 로그인으로 이동합니다. 세부 정보를 제공하고 로그인(또는 회원 가입)합니다.  

![이미지](/assets/img/2024-06-22-LargeLanguageModelsExplainedII_0.png)

4) API로 이동(OpenAI 모델을 응용 프로그램이나 비즈니스에 통합).  
5) 대시보드로 이동합니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-22-LargeLanguageModelsExplainedII_1.png)

6) 왼쪽 패널에서 API 키로 이동합니다.

![이미지](/assets/img/2024-06-22-LargeLanguageModelsExplainedII_2.png)

7) 휴대폰 번호로 등록한 후 '새 비밀 키 생성' 옵션을 볼 수 있습니다. 해당 옵션을 클릭하여 키를 복사하고, 다른 곳에 키를 저장해주세요. 그렇지 않으면 '확인'을 클릭한 후 키가 보이지 않을 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-LargeLanguageModelsExplainedII_3.png" />

와우! 이제 챗지피티 서버와 시스템 간의 통신 경로를 구축할 API 키가 있습니다.

중요한 노트:
GITHUB나 LINKEDIN을 포함하여 인터넷 상 어디에도 API 키를 노출시키지 마십시오. OPENAI에서 키 액세스를 취소하고 계정을 차단할 수 있습니다.
— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —

우리는 이제 LLMs를 사용한 애플리케이션을 구축하는 방법에 도달했습니다. Langchain은 Large Language Models (LLM)을 사용한 애플리케이션 생성을 간소화하기 위해 설계된 프레임워크입니다. Langchain은 Python 및 Javascript 언어로 사용할 수 있습니다. 이 기사에서는 Python 언어를 통해 langchain을 소개하고 모델을 사용하여 애플리케이션을 구축하는 방법을 소개하겠습니다.
여기서 Visual Studio Code 내부의 Python 노트북을 사용했습니다. 사용하고자 하는 편집기를 선택하실 수 있습니다.
먼저 새 폴더를 생성하고 해당 폴더를 Visual Studio Code에서 엽니다. 가상 환경을 생성하고 해당 환경 내에서 필요한 모든 라이브러리를 설치합니다.
가상 환경을 생성하려면,

<div class="content-ad"></div>

```js
pip install virtualenv
```

그런 다음 터미널에서,

virtualenv `env_name`를 입력하고 `env_name`\Scripts\activate를 실행하세요.

- 필수 라이브러리 설치하기


<div class="content-ad"></div>

```js
pip install langchain openai langchain_community ipykernel
```

노트북에서,

2.기본 쿼리

```js
from langchain.llms import OpenAI
api_key="<your_api_key>"
llm=OpenAI(model="gpt-3.5-turbo",openai_api_key=api_key,temperature=0.5)
llm.predict("Who is the Prime Minister of India?")
```

<div class="content-ad"></div>

먼저, langchain에서 OpenAI 모듈을 가져와서 모델 이름, API 키, 온도로 모델을 초기화합니다. 온도는 LLM의 창의성을 결정하는 것입니다. 온도가 낮을수록 LLM은 매번 유사한 답변을 생성하지만, 온도가 높으면 LLM은 더 창의적이 되어 다양한 답변을 제공합니다. llm.predict()은 최종 답변을 제공합니다.

3. 체인과 프롬프트 템플릿

```js
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chains import SimpleSequentialChain

template_1=PromptTemplate(input_variables=['country'],
template="Tell me the president of {country}")

chain_1=LLMChain(llm=llm,prompt=template_1)

template_2=PromptTemplate(input_variables=['president'],
template="Give me the list of changes made by the {president}")

chain_2=LLMChain(llm=llm,prompt=template_2)

chain=SimpleSequentialChain(chains=[chain_1,chain_2])
chain.run("United States of America")
```

아마 궁금하실거에요. 위 코드에서 두 가지 중요한 것들을 눈치채실 수 있어요. 프롬프트 템플릿과 체인입니다.
영어 웅변 대회에 참가 중이라고 상상해보세요. 심사위원들이 '나렌드라 모디'라는 주제를 주고 "인도는 민주국가이며 현재 나렌드라 모디 총리가 이끄는 중입니다"라고 시작해서 이어가라고 하면 쉬울 거에요. 단순히 주제만 주고 계속 이어가라고 하면 조금 어려울 수도 있어요.
이게 바로 프롬프트 템플릿이에요. 이는 ChatGPT에 답변을 제시하도록 모델을 유도하는 템플릿과 같아요. 이 코드에서는 "Tell me the president of 'country'"와 같은 프롬프트를 제공했는데, run() 함수에서 국가 이름을 언제든지 변경할 수 있어요.
이제 하나의 템플릿의 답변을 다른 템플릿으로 전달하고 싶다면, 다른 질문의 답변에 의존하는 경우에는 체인이라는 개념을 사용해야 해요. 체인은 LLM에 대한 단일 API 호출을 넘어 여러 호출을 순차적으로 연결할 수 있게 해줘요. 여기서 LLMChain은 LLM과 해당 템플릿을 묶는 데 사용됩니다. 여기서 사용한 것은 2개 이상의 LLMChain(체인 1, 체인 2)을 사용하는 간단한 순차 체인이며, 하나의 입력(United States of America)에 기반한 답변을 제공합니다.
요약하면, 이 간단한 코드 조각은 프롬프트 템플릿과 체인의 사용법을 보여줍니다. 여기서는 Langchain에서 직접 가져온 SimpleSequentialChain과 Prompt Template의 사용법을 보여줬어요. 첫 번째 템플릿은 "Who is the president of United States of America"이며, 답은 "Joe Biden"이고, 이는 다음 템플릿인 "List the changes made by Joe Biden"에 입력으로 전달되어 마지막 답변이 표시됩니다.

<div class="content-ad"></div>

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

이 기사에서는 대형 언어 모델에 대한 토론을 이어가겠습니다. ChatGPT의 추상 작동 방식으로 시작하여 GPT를 API 키를 통해 대형 언어 모델로 사용하는 방법에 대해 설명했습니다. 마지막으로 API 키를 사용하고 Langchain이라는 프레임워크를 활용하여 LLM에 쿼리하는 기본 아이디어를 소개했습니다. 모든 LLM을 활용하고 커스텀 애플리케이션을 구축하는 경우가 많이 있습니다. 또한 이곳에서 논의되지 않은 LLM의 많은 구성 요소가 있습니다. 본 기사는 ChatGPT와 Langchain의 작동 방식에 대한 스타터 팩을 제공하는 것을 목표로 합니다. 본 기사에서 언급한 모든 기술 용어에 대해 자세히 논의할 내용이 더 많습니다. 이전 기사에서 받은 질문에 대한 답변을 통해 적절히 대답했기를 바랍니다. 
모든 것을 천천히 다룰 것을 약속합니다. 그때까지 '계속 배우기'!
감사합니다!

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

- https://openai.com/
- https://python.langchain.com/v0.2/docs/tutorials/llm_chain/
- https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/llms
- https://www.youtube.com/playlist?list=PLZoTAELRMXVORE4VF7WQ_fAl0L1Gljtar

<div class="content-ad"></div>

---