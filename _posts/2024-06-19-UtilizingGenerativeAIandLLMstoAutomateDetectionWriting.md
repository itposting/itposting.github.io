---
title: "생성 인공 지능과 LLM을 활용하여 감지 쓰기 자동화하기"
description: ""
coverImage: "/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_0.png"
date: 2024-06-19 21:27
ogImage: 
  url: /assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_0.png
tag: Tech
originalTitle: "Utilizing Generative AI and LLMs to Automate Detection Writing"
link: "https://medium.com/@dylanhwilliams/utilizing-generative-ai-and-llms-to-automate-detection-writing-5e4ea074072e"
---


<img src="/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_0.png" />

안전운영에서 우리는 주로 두 가지에 대한 책임이 있습니다: 검출 및 대응. 탐지 작성은 매우 수고롭고 고통스러운 과정일 수 있습니다. 이 작업을 수행하는 것은 경보 처리 외에 시간이 있는 경우이거나 전용 검출 엔지니어링 팀의 일부일 수도 있습니다. 저는 탐지 엔지니어링에 들어있는 장비에 소모되는 수고를 없앨 수 있는 솔루션을 구축할 수 있는지 살펴보고 싶었습니다. 이것은 위협 아이디어부터 완성된 검출 또는 분석물을 만드는 프로세스입니다. 이 과정에는 위협 행위를 대표하는 아이디어로부터 시작하여 다양한 로그 소스를 연구하고 이해하며, 서로 다른 언어로 검색 쿼리를 작성하고, 서로 다른 언어로 검출 로직을 작성하고, 마침내 검출 테스트를 할 수도 있습니다. 이 전체 프로세스는 수동적이며, 시간이 많이 소요되며, 복잡하며, 여러 영역에 대한 전문지식이 필요합니다. 이 과정에 관련된 단계를 살펴보고 이를 해결하는 데 생성 모델 인공지능 또는 대형 언어 모델 (LLM)을 사용할 수 있는지 살펴봅시다. 이렇게 함으로써 사이버 보안 전문가들은 아이디어에 집중하는 데 더 많은 시간을 할애할 수 있고, 이 전 과정에 많은 시간을 소요하지 않아도 됩니다.

<img src="/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_1.png" />

이 블로그에서는 이 기술을 사용하는 데 배운 몇 가지 유용한 팁과 함께, 직접 시도해볼 수 있는 실용적인 안내서를 제공하겠습니다. 계속 진행하기 전에, 이 블로그의 목적을 위해 여기서 "위협 인텔리전스"로 본다는 것을 명확히 하고 싶습니다: 전술, 기술, 절차 또는 행위와 같이 계층적인 고통 피라미드에서 높은 위치에 있는 것이라면 관심이 있습니다. 이 범주에 속하지 않는 것은 위협 기획에 적합하지 않으며 이 기사의 목적에 맞지 않습니다. 나는 StreamAlert에서 검출을 작성할 것입니다. StreamAlert는 Jack Naglieri, David French 및 Kyle Bailey와 같은 분들이 인기를 얻은 검출-대-A 코드 원칙을 따르는 무료 및 오픈소스 프레임워크입니다. 그러나 감안해야 할 점은 검출을 작성하는 데 무수히 많은 방법이 있기 때문에, 귀하가 속한 조직에서 검출 로직을 위해 사용하는 도구로 대체할 수 있습니다.

<div class="content-ad"></div>

## 어찌나 고생이 많았는지, 아팠으니

우선 가장 먼저: 여기서의 고생을 설명해 드릴 텐데, 왜 이 프로젝트를 처음 시작했는지 이해하실 수 있도록 해볼게요. 아이디어에서 (위협 TTP) → 완료된 StreamAlert 탐지로 가는 중인 인간의 현재 상황을 함께 살펴보죠:

- 블로그, 보고서 또는 오픈 소스 탐지 콘텐츠에서 위협을 읽고 이해합니다. 예를 들어 EBS 스냅샷 유출일 수 있습니다.
- 이 위협을 탐지하기 위해 사용할 수 있는 로그나 보안 데이터를 이해합니다. 이 경우에는 CloudTrail 로그가 해당되며, 모든 필드의 이름, 필드 값, 구조, 로깅 파이프라인이 이를 구조화하는 방법 등을 이해합니다.
- SIEM 동등의 로그를 검색하거나 보안 데이터 레이크/XDR/원하는 이름으로 하고, 노이즈나 양성 결과를 조절합니다.
- 검색 결과에 만족하면 검색 쿼리에서 사용된 로직 (SQL/SPL/KQL 등)을 StreamAlert 파이썬 규칙(탐지 로직)으로 변환합니다.
- 탐지 로직을 트리거하는 매칭 로그 값이 포함된 테스트 JSON 파일을 만듭니다.
- (선택 사항) 여기서의 전체 과정을 문법 오류, 오타, 파이썬, JSON 및 SQL 간의 왕복, 디버깅, 문제 해결 등 를 통해 엉망으로 만듭니다.

![이미지](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_2.png)

<div class="content-ad"></div>

계속하기 전에 성공을 어떻게 측정할 건지 알아야 해요? InfoSec 블로그, 위협 인텔 보고서, 오픈소스 탐지 콘텐츠, 상대방 에뮬레이션 도구, 내 팀이 내부적으로 고안한 특별한 위협 등과 같은 위협 아이디어에서 출발해야 함을 명확히 만들어야 해요. 저는 이 실험에서 클라우드 위협에만 초점을 맞추었기 때문에, 작성할 탐지 사항은 CloudTrail 로그, Okta 로그 또는 Kubernetes 감사 로그와 같은 소스에서 나올 거에요. 그래서 이제 질문은 LLM에게 이 내용을 전달하고 완성된 탐지 사항을 돌려 받을 수 있을까요? 더 중요한 것은 내 부티크 구현에서 이것을 수행할 수 있을까요?

![이미지](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_3.png)

# Prompt 엔지니어링 기본 사항

이 과정 동안 배운 모든 것을 공유할 거에요. 따라서 LLM을 사용하여 자체 탐지 작성에 관심이 있는 경우 상당한 시간을 절약할 수 있을 거에요. 이 자료는 보물과 같은 가치가 있어요. 아래는 하우 투(How-to)에 대한 간단하고 실용적인 안내서에요. 필자는 꼭 이 순서대로 단계를 따르고 필요할 때 다시 반복하는 것을 추천하고 있어요. 이 용어를 처음 들어보시는 분들을 위해 말씀드리자면, Prompt 엔지니어링은 모델에 전송하는 프롬프트 또는 질문을 작성하는 과정입니다. 이건 1, 2, 3 단계 진행하면 끝이 아닙니다. 오히려 결과에 만족할 때까지 반복적으로 계속 해야 해요. 친구 베이컨을 믿고 과학적 방법을 따르세요. 그 베이컨이 아니라, 이 베이컨을 믿으세요.

<div class="content-ad"></div>

## 1. LLM이 스스로 프롬프트를 작성하게 하기

왜냐하면 이것이 그것에 능숙하고 당신의 시간을 절약해줄 수 있기 때문이죠. 이것은 훌륭한 첫 번째 초안을 작성해줄 것입니다. 아이디어를 떠올리고 즐거운 시간을 보내고 싶다면 여기와 같은 프롬프트 라이브러리를 확인하거나 이와 같은 프롬프트 생성기를 사용할 수 있습니다. Claude, Llama 또는 GPT와 같은 모델을 선택하고 해당 모델이 첫 번째 초안을 작성하도록 하세요. 나중에 문제에 부딪히게 되면 프롬프트 평가 또는 프롬프트 자체를 다시 작성하도록 돌아가도 괜찮습니다.

## 2. Few-Shot (예시 제공)

이 단계는 몇 가지 다른 단계와 함께 가장 중요할 것입니다. 저희 경우에는 TTP들과 그에 해당하는 탐지의 고품질과 다양성 있는 예시를 제공하고 싶습니다. 예를 들어, Okta 탐지, CloudTrail 탐지 및 Kubernetes 탐지 각각 2~3가지 예시를 제공하고 특정한 로그 필드와 그 값들 간에 다양성을 최대한 유지하려고 노력합니다. 결과를 향상시키기 위해 예시의 수와 품질을 실험해보세요.

<div class="content-ad"></div>

## 3. Chain of Thought (CoT)

이 모든 것은, 모델에게 사람에게 하는 것처럼 명확한 단계별 지침을 제공하는 것입니다. 새로운 직원이 팀에 합류한다고 상상해보세요. 스스로에게 생각해보세요: 이 작업을 완료하는 데 정확한 데이터와 정보는 무엇입니까? 이들은 기본적인 사이버 보안 지식을 갖추고 있다고 가정하고 (많은 사전 훈련된 모델들이 그렇듯) XYZ 언어로 감지를 작성하도록 요청합니다. 이제 앉아서 가능한 한 명확하고 상세히 단계별 지침을 작성하세요. 성공을 위해 그들을 잘 준비하고 싶으실 것입니다! 추측할 여지를 남겨두지 마세요. 나는 모델들이 환청을 듣는 근본적인 원인으로 발견한 것입니다. 왜냐하면 (안내 엔지니어로서) 충분한 정보를 제공하지 않았기 때문입니다!

![이미지](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_4.png)

첫 번째 초안을 마치면 팀에게 동일한 지침을 제공하여 명확성과 세부 사항에 대한 피드백을 요청할 수 있습니다.

<div class="content-ad"></div>

프로 팁: 모델의 논리를 디버그하기 위해 스텝 사이에서 결과를 출력하도록 설정하세요. 예를 들어, "당신의 추론을 설명해보세요"와 같이 모델에 요청하세요. 프롬프트가 커져서 복잡해진 경우, 이것은 어떤 스텝이 환영이나 오버피팅을 일으키는지 식별하는 데 도움이 됩니다.

## 4. 프롬프트 구조

저를 도와준 멋진 자료는 COSTAR 프레임워크였습니다. 이를 전반적인 프롬프트의 고수준 구조로 사용하세요. 탐지를 작성하는 데 수많은 단계가 포함되었다는 사실을 알고 있기 때문에 당연히 이 프롬프트는 매우 길고 복잡해집니다. 이것은 프롬프트를 구분자로 분할하여 별도의 섹션으로 나누는 데 장점을 취할 수 있는 곳입니다. 아래 예시에서 이를 어떻게 활용했는지 확인할 수 있을 것입니다. 특히 Claude와 같은 모델에서 매우 큰 컨텍스트 윈도우를 사용하는 경우에 중요합니다.

![이미지](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomatedetectionWriting_5.png)

<div class="content-ad"></div>

## 5. 모델별 프롬프팅

ChatGPT가 다른 모델을 위해 프롬프트를 작성하도록하지 마세요! 각 모델의 최적의 사용 방법에 대해 문서를 읽으세요. 차이가 없다고 생각하십니까? 모델별 기술을 사용할 때 Claude의 경우에도이 간단한 차이를 살펴보십시오. Claude를 사용하는 경우, 최상의 결과를 얻기 위해 여기서 시작하는 것을 추천합니다. Anthropic의 문서도 함께 참고하십시오.

## 6. 환각 방지 막대

모델에게 "모르겠어요"라고 말할 기회를 제공하여 인간처럼 행동하십시오. 적절한 정보가 없으면 당연히 대답할 수 없을 것입니다. 예를 들어, 사람이 제공한 위협 아이디어가 불완전한 경우 (즉, 보안 데이터의 위협 증거에 관한 충분한 정보가 포함되어 있지 않은 경우)에는 모델이 탐지를 완료하지 않고 더 많은 정보가 필요하다고 알려줄 수 있도록 하고 싶습니다. 또한 모델을 올바른 방향으로 이끌기 위해 이 방법을 사용할 수 있습니다. 제 경우에는 CloudTrail, Okta 또는 Kubernetes 감사 로그를 사용할 수있는 잠재적인 탐지 결과에만 관심이 있습니다. Linux 또는 Windows의 TTP만 포함 된 보고서를 제공하면 모델이 무시하도록하고 싶습니다. 또한 모델이 만나는 협박 정보 중에서 로그 필드 이름과 같은 중요한 정보가 누락된 경우 로그 스키마를 참조하여 정보를 완성하도록 모델에 지시하는 단계별 지침에서 이 기술을 사용합니다.

<div class="content-ad"></div>

## 7. RAG을 사용할 것인가 말 것인가

검색 증대 생성 (RAG)은 이러한 모델에 데이터 접근을 제공하는 방법입니다. 이는 모델이 보유하거나 훈련하지 않은 데이터에 접근할 수 있도록 합니다. 즉, 탐지 결과물 코퍼스, 조직 데이터, 보안 로그 구조 등이 그려집니다. 여기서 발견한 큰 오해는 "LLM과 외부 데이터를 사용해야 한다" = RAG를 사용해야 한다는 것입니다. 반드시 그렇지는 않습니다. 우리의 경우, 모델에 내부 문서를 제공하고 탐지 방식 작성 방법, 사용자 정의 로그 스키마, 사용자 정의 로그 및 작성한 기존 탐지 결과물 등을 알려줄 필요가 있을 수 있습니다. 따라서 이러한 모든 것을 가져와 RAG에 연결하면 끝나는 건가요? 그렇지 않습니다. 여기서 실제로 무슨 일이 일어나고 있는지 이해해 봅시다. 이것은 외부 데이터를 모델에 연결하는 플러그 앤 플레이가 아닙니다. 지침/문서를 마법처럼 읽고 끝내는 것도 아닙니다. RAG를 사용해야 하는지 여부를 모를 경우, 사용 사례에 맞는 기술을 결정하기 위해 바탕이 되는 최고의 실천 안내서부터 시작하십시오. 처음에 이 프로젝트에 많은 시간을 낭비한 이유는 언제 RAG를 사용해야 하는지, 언제 사용하지 말아야 하는지를 이해하지 못했기 때문입니다.

![image](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_6.png)

저의 사용 사례에서는 다음과 같은 질문으로 결정되는 것 같습니다: 사용하는 외부 데이터는 자주 변경되는가요? 모델이 작업을 완료하는 데 정말 많은 데이터가 필요한가요? RAG 대 매우 큰 문맥 창을 사용하는 것에 대한 논쟁이 많습니다. 이것이 정확도에 미치는 영향도 있습니다. 우리의 사용 사례로 돌아와서, 어떤 결과가 가장 좋았을까요? 200개의 탐지 + RAG를 사용하는 것이 좋을까요, 아니면 각 로그 소스 당 2-3개의 고품질 다양한 예제를 프롬프트에 하드 코딩하는 것이 좋을까요? 이 질문을 스스로에게 물어보세요. (사람이) 의미 검색보다 문맥을 수동으로 선택하는 데 더 능숙한가요? 이 모든 것이 결국 RAG가 하는 것입니다: 외부 데이터의 의미 검색 및 프롬프트 증강. 자녀이 문맥 및 예제를 수동으로 선택하고 프롬프트에 하드 코딩하는 것이 더 나은 결과를 가져온다면 그렇게 하는 것이 좋습니다. 이 사용 사례에서는 탐지 로직 작성 방식 (예: Python, KQL, SPL) 및 보안 데이터 구조가 일반적으로 자주 변경되지 않습니다. 확신이 들지 않는다면, 프롬프트 엔지니어링만으로 결과를 비교하고 RAG와 RAG 결과에 사용된 데이터의 원본을 확인하세요. 이 사용 사례에서는 프롬프트 엔지니어링만으로도 매우 성공적인 결과를 얻을 수 있었습니다.

<div class="content-ad"></div>

# 고급 프롬프트 엔지니어링

만약 여기까지 오셨다면, 멈추세요. 먼저 위의 내용을 모두 시도해보고 결과물을 확인한 후 더 많은 기술을 실험하기 전에 얼마나 발전할 수 있는지 확인해 보세요. 여전히 결과물에서 더 정확성을 얻고 싶다면, 몇 가지 더 고급 기술을 함께 실험해 볼 수 있습니다.

## 8. 사용자 정의 매개변수 변경

대부분의 모델에 대해 조정할 수있는 매개변수가 소수 있습니다. 이들은 전반적으로 두 가지를 제어합니다: 무작위성과 다양성입니다. 온도(0 ~ 1)를 변경하여 모델의 응답이 결정적인지 무작위적인지에 따라 조정할 수 있습니다. 예를 들어 저의 사용 사례의 경우, JSON 및 python 파일의 구조 때문에 결과물이 일관되고 예측 가능하게 나오기를 원하므로 온도가 0에 가까운 것이 더 적합합니다. 이는 탐욕 디코딩이라고 불리는 것의 한 예이며 여기서의 타협은 더 광범위한 확률 공간을 놓치게 된다는 것입니다. 모델이 감지 논리를 효율적이거나 창의적인 방법으로 구현할 수 있을 수도 있습니다. 예를 들어, 다양한 온도 값을 시도하고 특정 사용 사례에 가장 적합한 값을 찾아보세요.

<div class="content-ad"></div>

Top P과 Top K는 모델이 응답을 작성할 때 사용하는 "어휘 크기"를 제어합니다. 질문을 한 후에, 상위 50개 또는 상위 1500개에서 선택할 수 있습니다. 감지를 작성하는 목적으로, 더 결정론적인 응답을 갖는 것이 좋다고 생각했습니다. 감지 로직을 일관적으로 유지하려면 가능한 한 무작위성을 줄이는 것이 좋습니다.

## 9. 프롬프트 체이닝

이것이 LLM을 활용하여 수고를 줄이는 데에 있어 실제 잠재력을 발견했던 곳입니다. 지금까지 한 일은 하나의 프롬프트에 더해진 것뿐이었습니다. 하지만 실제 힘은 여러 프롬프트나 작업을 연결하는 곳에서 나옵니다. 프롬프트 체이닝은 하나의 프롬프트의 출력을 다른 프롬프트로 보내는 것입니다. 모든 것을 하나의 거대하고 복잡한 프롬프트에 넣으려 하기보다는 여러 개로 분할하는 것을 시도해보세요. 예를 들어, 여기서는 기사에서 위협을 분석하고 추출하는 별도의 프롬프트가 필요할 수 있습니다. 의미 있는 또는 실용적인 감지를 쓰기에 충분한 기사를 위해 제대로 분석하는 프롬프트를 사용할 수 있습니다 (즉, 원자적 IOCs X, 행위 신호 O). 원하는 쿼리 언어로 실제 감지 로직을 작성하는 것은 독립적인 전문성의 한 형태이므로, 이 내용을 별도의 프롬프트로 나누고 마칠 때까지 결과에 대해 QA하는 다른 프롬프트도 만들어보세요. 감지 엔지니어링과 같이 큰, 복잡한 작업들을 하나의 프롬프트에서 여러 개로 나누면 결과가 놀라운 성과를 낳을 것입니다. 체이닝을 실험하기 위해 빠르게 프로토타입을 만들기 위해 AWS 스텝 함수, Flowise 또는 유사한 도구를 확인해보세요.

## 10. 자기일관성

<div class="content-ad"></div>

위에서 언급한 대로, 매개변수의 값을 변경함으로써, 이러한 모델들로부터 얻는 응답의 종류를 변경할 수 있습니다. 실제로 이를 시도하는 한 가지 방법은 자일일성 기법을 사용하는 것입니다. 동일한 TTP에 대한 탐지를 다섯 사람이 모두 작성한다고 상상해보세요. 탐지 논리를 구현하는 방법은 매우 다양하기 때문에, 세 개의 아주 다른 탐지가 나올 수 있지만 모두 위협을 올바르게 식별할 수 있습니다. 이 개념은 모델이 온도, 상위 k 등 다양한 변수에 기반하여 여러 가지 답변을 생성하도록 하고 그 중에서 "최선"을 선택하도록 하는 방식으로 사용할 수 있습니다.

# 결과

모든 것이 좋은데.. 작동했나요? 정확도는 어떻습니까? 이 단계에서 우리는 선택된 입력 목록을 기반으로 우리의 모델 + 프롬프트를 평가해볼 수 있습니다. 기존의 탐지 코퍼스에서 일부 TTP를 가져올 수도 있고, 백로그에서 일부 탐지를 가져올 수도 있으며 심지어 AWS 계정 Y의 X 네임스페이스 내에서 쿠버네티스 팟에서 서비스 계정 bob.dylan이 실행될 때의 위협 설명과 같은 자연어의 위협 설명을 사용할 수도 있습니다. 이 변환은 단순한 텍스트 검색 또는 요약과 같지 않기 때문에 (예: 프랑스의 수도는 파리입니다) 고정된 옳고 그른 답을 비교할 수는 없습니다. 따라서 결과를 평가하기 위해 인간을 사용해야 합니다. 그러나 이 경우에는 StreamAlert가 훌륭하니까 단순히 json 파일을 python 규칙에 대해 테스트하면 통과하거나 실패할 것입니다!

결과를 살펴보겠습니다! D.I.A.N.A. (신규 경보에 대한 탐지 및 정보 분석)를 소개합니다. 예를 들어, Sigma의 CloudTrail 규칙, Stratus Red Team, Anvilogic의 무기고 등의 내용을 모두 가져와 내가 선택한 언어로 그들을 위한 탐지 규칙을 작성하고 싶을 수 있습니다.

<div class="content-ad"></div>

개인적으로 나는 블로그나 기사에서 가장 좋은 탐지 아이디어를 찾는 경향이 있어요. 그래서 모델에게 이것들도 주는 게 좋을 것 같아요: Invictus IR, Permiso Security, Gem Security.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*-_O8uCNsHtls5mnw0G2Img.gif)

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*o4ikwiKLdrTNwFMrL7-_5A.gif)

이 특정 사용 사례에서 StreamAlert를 사용했지만, 이를 대체할 수 있는 다른 쿼리나 탐지 언어를 사용하여 동일한 목표를 달성할 수 있도록 프롬프트 템플릿을 제공하고 싶었어요. 예를 들어, 모든 탐지 및 로그 예제를 제외한 후 남은 나의 프롬프트는 약 11k 토큰이었어요 (이는 대략 7500 단어이고 Claude에는 200k 토큰 컨텍스트 창이 있는 것을 감안하면 모델에게 제공하고 다시 받을 수 있는 토큰 수인거예요).

<div class="content-ad"></div>

```js
사람: 귀하에게 주어진 작업은 사이버 보안 위협 인텔리전스를 StreamAlert.io 규칙으로 변환하고 이에 해당하는 JSON 테스트 파일을 작성하는 것입니다. GitLab, CloudTrail, Okta, AWS EKS 등과 같은 다양한 로그 소스에 대한 JSON 테스트 파일을 작성해주세요. 
귀하의 위협 인텔리전스는 탐지, 위협 인텔리전스 보고서, 적대적 에뮬레이션 도구 또는 적대자의 기술, 전술 또는 절차를 설명하는 텍스트와 같은 형태로 제공될 것입니다. 이 위협 인텔리전스는 귀하의 입력으로 <question> 태그에서 제공될 것입니다.
귀하의 출력물은 마크다운 형식의 streamalert 규칙과 해당하는 JSON 파일일 것입니다. 나에게 명확하게 보이도록 streamalert_rule.py와 streamalert_rule.json과 같이 나눠주세요.

위협 인텔리전스를 분석하는 데 <context> 태그 내의 정보를 사용해주세요.
만약 답을 모르는 경우, 그냥 모른다고 말하면 됩니다. 답을 꾸며내려고 하지 말아주세요.

<context>
- 귀하가 선택한 감지 도구에 관한 모든 정보 위치
- 본사 구현과 모델이 알지 못하는 데이터에 대해 생각
- 로그 스키마, 예제 포함
- 감지, 예제 포함
- 아래 단계별 지침에서 참조할 수 있는 데이터 포함
</context>

<steps> 태그 내의 절차를 따라 작업을 완료해주세요:

Step 1: 위협을 이해합니다:
질문에서 제공된 위협 인텔리전스를 포괄적으로 이해하여 분석을 시작합니다. 로그 필드 이름, 값, 이벤트 소스, 이벤트 이름, 특정 파라미터 또는 조건과 같은 주요 속성을 식별해주세요.
AWS CloudTrail 로그, AWS EKS 로그, 쿠버네티스 감사 로그, GitLab 로그, Okta 로그에 대한 지식을 활용하여 로그 필드와 값을 식별하는 데 도움을 받아주세요.
도움이 필요하다면 각 로그의 문서를 참고해주세요.

Step 2: Python 규칙 정의
streamalert에서 필요한 라이브러리를 가져와 규칙 로그, 출력 및 퍼블리셔를 정의해주세요.

로직 함수: 위협 논리를 포착하는 Python 함수를 작성해주세요. 이를 활용하여 eventSource, eventName 및 위협을 나타내는 특정 조건과 같은 로그 데이터 필드를 추출하고 일치시켜주세요.
문서화: Python 파일 내에서 규칙의 목적, 위험의 본질 및 관련 기술적 콘텍스트 또는 응답 권고사항을 설명하는 주석 또는 독스트링을 제공해주세요.

Step 3: JSON 테스트 파일 작성
검출 규칙을 트리거해야 하는 긍정 테스트 케이스 및 트리거해선 안 되는 부정 테스트 케이스를 포함하는 JSON 테스트 파일을 작성해주세요.
테스트 시나리오가 지정된 로그 소스의 로그 데이터 형식을 정확히 반영하도록 확인해주세요.
테스트 데이터를 지정할 때 두 가지 방법 중 하나를 사용할 수 있습니다:
"data": 필요한 모든 필드가 제대로 로그 분류에 필요한 모든 필드를 포함하는 완전한 예제 레코드
"override_record": 관련 필드만이 채워진 예제 레코드 부분 집합
data 방법을 사용하는 경우, <context> 태그의 로그 소스 스키마의 모든 필드 이름이 JSON 파일에 있어야 합니다. 그렇지 않으면 작동하지 않습니다.
override_record 방법을 사용하는 경우, 검출 로직을 위한 관련 필드만이 JSON 파일에 채워져 있어야 합니다.
혼란이 생기면 streamalert.io 작동 방식을 참조해주세요.

Step 4: 정보 완전성 확인
알 수 없는 필드 이름이나 로그 속성을 만나면 <context> 태그에서 streamalert 로그 스키마를 확인하여 해당 필드 이름이 있는지 확인해주세요.
모든 코드와 JSON 예제가 문법적으로 올바르고 가독성을 위해 형식화되었는지 확인해주세요. 제공되지 않은 민감한 또는 구체적인 정보를 위한 플레이스홀더를 사용해주세요.

Step 5: 문서화 및 응답
각 탐지 규칙을 목적, 논리 및 해당하는 TTP를 명확하게 설명하여 문서화해주세요. streamalert 규칙 자체에 인용된 설명으로 이 정보를 제공해주세요.
streamalert 규칙과 해당하는 json 파일을 분리해서 제공하여 명확히 볼 수 있도록 해주세요. 각 규칙의 제목을 위에 써주세요.
<question> 태그 내의 제공된 위협 인텔리전스가 규칙 작성에 필요한 필수 세부 정보가 부족한 경우, 작업을 완료하기 위해 필요한 부족한 정보를 나열해주세요.
</steps>

<style>
답변은 사이버 보안 전문가에게 적합한 명확하고 간결한 기술적 스타일로 작성되어야 합니다. 사이버 보안 위협 분석 및 탐지 개발에 익숙한 용어 및 구조를 사용해주세요.
</style>

<tone>
톤은 객관적이고 분석적이며 필요 없는 장식이나 주관적 해석을 최대한 배제하며 명료하고 사실적인 정보를 중점으로 삼아야 합니다.
</tone>

<audience>
목표 대상은 새로운 탐지를 만들어야 하는 사이버 보안 분석가 및 엔지니어로서 사이버 보안 개념, 위협 인텔리전스 및 탐지 메커니즘에 대한 깊은 이해를 갖고 있습니다.
</audience>

<question>
{질문} #<-- 여기에 '위협 아이디어'가 들어갑니다
</question>

답변을 제공하기 전에 정답을 고려해주세요.

도움이 되었기를 바랍니다.
```

<div class="content-ad"></div>


![이미지를 여기에 넣어주세요](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_7.png)

# 보너스 팁

쓰레기를 넣으면 쓰레기가 나온다. 이 부분은 놀라운 이야기는 아니지만 새로운 기술을 사용할 때 쉽게 잊기 쉽습니다. 모델에 제공하는 "위협 인텔"이 이미 로그 소스 증거를 포함하는 거친 TTPs로 증류되어 있음을 알게 될 것입니다. 모델에 아무 것이나 공급하고 올바른 정보 없이 정확한 결과를 기대하면 안 됩니다. 마치 사람처럼요. 만약 여러분에게 이 atomic red 테스트를 주고 이에 대한 탐지 작성을 부탁한다면, 이 작업을 완료하기 위해 정확히 어떤 정보가 필요한지 생각해 보세요. 외부 데이터를 연결하고 단순히 실행하길 원하지 마세요. 최상의 결과는 품질 좋은 데이터, 신중하게 고안된 지침 및 빠른 콘텐츠로부터 얻어질 것입니다.

만약 결과물의 품질을 개선할 수 없고 막힌 상황에 있다면, 여러분의 프롬프트가 너무 복잡하거나 너무 길었을 수 있습니다. 프롬프트가 너무 짧을 수도 있고 지시 사항 또는 세부 사항이 충분하지 않을 수도 있습니다. 이런 경우에는 모델에게 프롬프트를 다시 쓰도록 요청하세요. 처음에는 (아마도 아직도) 내 지침에 많은 중복이 있어서 명확성이 오히려 감소할 것입니다. 이것은 균형 맞추기 행위이며, 여기에는 그 달콤한 지점을 찾기 위해 많은 실험이 필요할 것입니다. 위에서 말한 것처럼 모델에게 "소리치는 것"을 하도록 요청하여 걸음별 사고를 디버깅할 수 있습니다. 이렇게 함으로써 프롬프트의 어떤 부분이 오류를 일으키는지 확인하고 작업을 정확하게 완료하기 위해 더 많은 정보나 명확성이 필요한지 알 수 있을 것입니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_8.png" />

천천히 하나의 기술에 집중하세요. 에이전트 떼 뇌를 만들어내는 것이 멋지고 무서워서 흥분될 수 있지만요. 하나의 구체적인 문제를 선택하고 결과를 측정한 다음 정확도를 얼마나 올릴 수 있는지 확인하세요. 그런 다음 다음 문제로 넘어가세요. 사이버 보안 전문가, 로그/데이터 엔지니어, 탐지 엔지니어, 파이썬 전문가, 데이터베이스/SQL 전문가를 모두 하나의 프롬프트에 넣으려고 했더니 너무 많았죠! 각 전문 분야를 서로 다른 프롬프트로 나눠보세요.

내 팁 하나는: 프롬프트 엔지니어링만으로 얼마나 나아질 수 있는지 확인해보세요.

# 다음은 무엇일까요?

<div class="content-ad"></div>

보안 전문가들에게 LLM을 더 쉽게 이해할 수 있도록 이 게시물을 작성했지만, 무엇보다도 그들이 어떻게 사용하는지에 대한 실용적인 안내서를 제공하기 위해서예요. 이 기술은 정말 놀라울 뿐만 아니라, 올바르게 적용되면 올바른 문제에 대해 상당한 효과를 얻을 수 있어요.

![이미지](/assets/img/2024-06-19-UtilizingGenerativeAIandLLMstoAutomateDetectionWriting_9.png)

다음 글에서는 LLM 에이전트를 사용하여 초기 위협 아이디어에 기반한 Athena 쿼리를 자동으로 작성하고 실행한 후 결과를 반환하고, 마지막으로 노이즈/양성 결과를 수정하는 방법을 안내할 거에요. 그 후에는 detection.fyi나 sigma 릴리스에서 자동으로 결과를 수집하고 모델이 탐지를 생성하고, 인간이 검토할 티켓을 생성하는 것도 흥미로울 수 있어요. 또한, API 호출 수가 시간 창에 걸쳐 많을 때와 같은 더 복잡한 탐지 로직을 다루는 것에 대한 부분도 놓치지 않았을 거예요. 이는 StreamAlert에서 실제로 다르게 구현되며, 더 많은 전문 지식이 필요할 거예요. 또 다른 아이디어는 각 탐지가 ADS 프레임워크를 준수하도록하거나, 기존 플레이북/SOP를 피드하면서 귀하의 기관에 특별한 것을 만드는 것일 수 있어요. 또한, securityfrontiers.ai에서 이 프로젝트에 대해 간단한 발표도 했으니, 다른 흥미로운 프로젝트가 많아서 동기부여를 받을 수 있어요. 그 외에도 읽어 주셔서 감사합니다! 보안이나 인공지능에 대해 이야기를 나누고 싶으시다면 링크드인에서 연락주시면 되고, 이 프로젝트에 대해 더 많은 아이디어가 있다면 알려주세요.

# 참고문헌

<div class="content-ad"></div>

만약 문제를 연구하고 LLM이 작동하는 방식을 이해하는 데 사용한 대부분의 자료를 찾고 싶다면 아래 정보를 참고해보세요.

- [detectient](https://gitlab.com/coonsmatthew/detectient)
- [MITRE Engenuity: Our TrAM Large Language Model Automates TTP Identification in CTI Reports](https://medium.com/mitre-engenuity/our-tram-large-language-model-automates-ttp-identification-in-cti-reports-5bc0a30d4567)
- [Introducing SIFT: Automated Threat Hunting](https://www.greynoise.io/blog/introducing-sift-automated-threat-hunting)
- [Accelerating Elastic Detection Tradecraft with LLMs](https://www.elastic.co/security-labs/accelerating-elastic-detection-tradecraft-with-llms)
- [From Soup to Nuts: Building a Detection-as-Code Pipeline](https://medium.com/threatpunter/from-soup-to-nuts-building-a-detection-as-code-pipeline-28945015fc38)
- [SigmAIQ by AttackIQ](https://github.com/AttackIQ/SigmAIQ/tree/master)
- [Exploring Defensive Challenges with Artificial Intelligence](https://blog.openthreatresearch.com/exploring-defensive-challenges-with-artificial-intelligence-from-traditional-to-generative/)
- [How We Scale Detection and Response at Google](https://cloud.withgoogle.com/cloudsecurity/podcast/ep75-how-we-scale-detection-and-response-at-google-automation-metrics-toil/)
- [Using Limacharlie and ChatGPT for Malware Anomaly Detection](https://www.signalblur.io/using-limacharlie-and-chatgpt-to-perform-malware-anomaly-detection)
- [SigmaIQ: AttackIQ's Latest Innovation for Actionable Detections](https://www.attackiq.com/2024/01/10/sigmaiq-attackiqs-latest-innovation-for-actionable-detections/)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Generate AI-Powered Insights for Amazon Security Lake using Amazon Sagemaker Studio and Amazon Bedrock](https://aws.amazon.com/blogs/security/generate-ai-powered-insights-for-amazon-security-lake-using-amazon-sagemaker-studio-and-amazon-bedrock/)
- [Experience Fully-Managed RAG in Amazon Bedrock Knowledge Bases](https://aws.amazon.com/blogs/aws/knowledge-bases-now-delivers-fully-managed-rag-experience-in-amazon-bedrock/)
- [Build a Contextual Chatbot Application using Knowledge Bases for Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/build-a-contextual-chatbot-application-using-knowledge-bases-for-amazon-bedrock/)
- [Best Practices for Prompt Engineering with LLMs on Amazon Bedrock](https://d1.awsstatic.com/events/Summits/reinvent2023/AIM377_Prompt-engineering-best-practices-for-LLMs-on-Amazon-Bedrock.pdf)
- [Why Use Retrieval Instead of Larger Context](https://www.pinecone.io/blog/why-use-retrieval-instead-of-larger-context/)
- [LLM Optimization Parameters in Generative AI](https://attri.ai/generative-ai-wiki/llm-optimization-parameters#:~:text=The%20top%2Dk%20parameter%20effectively,which%20the%20model%20can%20choose.)
- [Best Practices to Build Generative AI Applications on AWS](https://aws.amazon.com/blogs/machine-learning/best-practices-to-build-generative-ai-applications-on-aws/)
- [Explore Data with SQL and Text-to-SQL in Amazon Sagemaker Studio JupyterLab Notebooks](https://aws.amazon.com/blogs/machine-learning/explore-data-with-ease-using-sql-and-text-to-sql-in-amazon-sagemaker-studio-jupyterlab-notebooks/)
- [Amazon Bedrock Serverless Prompt Chaining](https://github.com/aws-samples/amazon-bedrock-serverless-prompt-chaining?tab=readme-ov-file)
- [Introduction to LLM Agents](https://github.com/Rachnog/intro_to_llm_agents/tree/main)
- [Prompting Guide](https://www.promptingguide.ai/)
- [Colab Notebook for LLM](https://colab.research.google.com/drive/1SoAajN8CBYTl79VyTwxtxncfCWlHlyy9#scrollTo=NTOiFKNxqoq2)
- [Best Practices for LLM Autoevaluation with RAG](https://www.databricks.com/blog/LLM-auto-eval-best-practices-RAG)
- [Claude Prompt Library by Anthropic](https://docs.anthropic.com/claude/prompt-library)
- [Assisted Prompt Bootstrapping with Elvis Bot](https://github.com/langchain-ai/langsmith-cookbook/blob/main/optimization/assisted-prompt-bootstrapping/elvis-bot.ipynb)
- [Raptor Recursive Abstractive Processing for Tree-Organized Retrieval](https://aman.ai/primers/ai/RAG/#raptor-recursive-abstractive-processing-for-tree-organized-retrieval)
- [Amazon Bedrock Workshop Repository](https://github.com/aws-samples/amazon-bedrock-workshop/tree/main)