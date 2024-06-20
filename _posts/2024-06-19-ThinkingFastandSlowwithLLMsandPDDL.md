---
title: "사고, 빠르고 느린, LLMs와 PDDL과 함께"
description: ""
coverImage: "/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_0.png"
date: 2024-06-19 02:50
ogImage: 
  url: /assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_0.png
tag: Tech
originalTitle: "Thinking, Fast and Slow, with LLMs and PDDL"
link: "https://medium.com/towards-data-science/thinking-fast-and-slow-with-llms-and-pddl-111699f9907e"
---


"ChatGPT가 실수를 할 수 있다는 사실을 확인해 주세요." 이제 프롬프트 바로 아래에 적혀 있고, ChatGPT가 날짜부터 전체 참조까지 아무 것이나 단정적으로 만들어 내는 것에 대해 익숙해졌습니다. 하지만 기본적인 추론에 대해서는 어떨까요? 인공지능(AI) 연구 초기에 나온 간단한 탑 재배치 작업을 살펴본다면, 대형 언어 모델(Large Language Models, LLM)이 어떻게 한계에 도달하는지 보여주고, 이에 대처하기 위해 계획 도메인 정의 언어(Planning Domain Definition Language, PDDL)와 상징적 해결사들을 소개하겠습니다. LLM은 본질적으로 확률적이므로, 이러한 도구가 미래의 AI 에이전트의 내장될 가능성이 높습니다. 이는 상식적인 지식과 날카로운 추론을 결합할 것입니다. 이 글에서 최대한 많은 정보를 얻으려면, VS Code의 PDDL 확장 프로그램과 planutils 플래너 인터페이스를 사용하여 직접 PDDL 환경을 설정하고 예제를 따라해 보세요.

대형 언어 모델(LLM)에서는 각 문자가 응답의 이전 문자뿐만 아니라 사용자의 프롬프트의 모든 이전 문자에 대해 조건이 걸립니다. 거의 모든 것을 학습한 LLM은 신의 영역이 되었을 뿐만 아니라 재치도 갖추게 되었습니다. 그러나 LLM이 실제로 문제에 대해 생각하려 하지 않고 근본적으로 게으르다는 것을 깨닫는 데 오래 걸리지 않습니다. 이는 "인공지능" 분야의 고전적인 문제 도메인인 "블록 세계"에서 나오는 간단한 예제로 설명할 수 있습니다. 아래 그림에 나타난 것처럼, 왼쪽의 탑을 오른쪽의 탑으로 변환하는 작업을 고려해보세요.

![image](/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_0.png)

여기에서 작업은 왼쪽의 탑을 오른쪽의 탑으로 바꾸는 것입니다. 로봇이 다음과 같은 기능이 있다고 가정합니다:"

<div class="content-ad"></div>

- pickup `색깔`: 테이블의 아무 곳에 색깔이 `색깔`인 블록을 집어올립니다.
- putdown `색깔`: 테이블의 아무 곳에 색깔이 `색깔`인 블록을 내려놓습니다.
- unstack `색깔1` `색깔2`: 맨 위에 `색깔2`가 있는 탑에서 `색깔1` 색을 가진 블록을 집어올립니다.
- stack `색깔1` `색깔2`: 맨 위에 `색깔2`가 있는 탑에 `색깔1` 색을 가진 블록을 위에 놓습니다.

그래서 ChatGPT3.5는 이런 문제에 어떻게 대처하나요? 이것이 프롬프트입니다:

![이미지](/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_1.png)

ChatGPT는 주어진 구문 형식으로 필요한 조치 순서를 즉시 제공합니다. 놀랍죠! 하지만 기다려주세요. 올바른 조치는 처음 세 가지만 맞는 것 같습니다! 로봇은 먼저 파란색 블록을 탑의 맨 위에서 어디든 테이블로 옮기고, 그런 다음 녹색 블록도 동일한 작업을 합니다. 이제 모든 블록이 테이블 위에 있습니다.

<div class="content-ad"></div>


![ThinkingFastandSlowwithLLMsandPDDL_2](/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_2.png)

ChatGPT는 지금 파란 블록을 집어 빨간 블록 위에 쌓으라고 제안했습니다. 하지만 이것은 우리가 원하는 바가 전혀 아닙니다: 파란 블록은 바닥에 있어야 합니다. 또한 탑이 완전하지 않습니다. 우리가 도와보겠습니다:

![ThinkingFastandSlowwithLLMsandPDDL_3](/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_3.png)

ChatGPT는 단서를 받고 단순히 마지막에 추가했습니다. 이제 초록 블록이 파란 블록 위에, 그리고 파란 블록이 빨간 블록 위에 쌓여 있습니다. 출력을 올바른 형식으로 만들기 위해 더 많은 단서를 제공함으로써 해결 할 수 있을 수도 있지만, 우리는 모두 ChatGPT가 실제로 두 가지 동일하게 잘못된 솔루션 사이를 왔다갔다하며 순환하기 시작하는 것을 보았습니다.


<div class="content-ad"></div>

ChatGPT4o는 조금 더 나은 작업을 수행하며, 동일한 프롬프트에 대해 다음 출력물을 생성합니다:

```js
unstack blue green
putdown blue
unstack green red
putdown green
pickup blue
stack green blue
pickup red
stack red green
```

이 사실상 맞지만, 중간에 있는 "pickup blue"에 대해 문제가 발생합니다. "You cannot 'stack green blue' after 'pickup blue' as the robot is still holding 'blue'"라는 불만에 의해, ChatGPT-4o는 마지못해 다음과 같이 따릅니다:

```js
unstack blue green
putdown blue
unstack green red
putdown green
pickup blue
putdown blue (if needed, otherwise skip)
pickup green
stack green blue
pickup red
stack red green
```

<div class="content-ad"></div>

ChatGPT-4o가 실제로 ChatGPT-3.5보다 큰 발전이었다는 것이 밝혀졌어요. 초기 프롬프트에 더 많은 정보를 추가하는 것도 도움이 된다는 것을 알게 되었어요. 그러나 위에 표시된 최적의 행동 순서를 ChatGPT에 얻게 하는 것은 매우 어렵고, 더 복잡한 제약 조건에는 "한 번에 테이블에 블록을 두 개만 놓을 수 있다"거나, 인간형 조립 작업에서 두 팔을 사용하는 것과 같은 것은 전혀 불가능하다는 것이 증명되었어요.

LLM에게 일부 신용을 주자면, 문제가 사실 모호하다고 주장할 수도 있어요. 실제로 위의 행동들을 신중하게 생각해보면 더 많은 오해로 이어질 것이라고 생각돼요. 예를 들어, ChatGPT에게 한 블록을 집을 때 다른 블록을 집기 전에 첫 번째 블록을 놓기 전까지 다른 한에 놓을 수 없게 하는 것을 전혀 알려준 적이 없다는 점이요.

# 계획 도메인 정의 언어

그렇다면 어떻게 이러한 문제를 공식적으로 설명하여 마지막 불확실성의 조각을 제거할까요? 한 가지 방법은 인공지능 계획 커뮤니티에서 표준이 되어온 계획 도메인 정의 언어 (PDDL)입니다. PDDL은 1998년부터 존재해오고 지속적으로 영역을 확장해왔으며, 다양한 문제 해결자를 탄생시켰습니다. 현재 계획 커뮤니티가 다루고 있는 문제 유형을 감을 잡기 위해 2023년 국제 계획 대회 작업을 확인해보세요.

<div class="content-ad"></div>

PDDL 정의는 두 개의 파일로 구성됩니다:

- 도메인
- 문제

타워 예제를 사용하여 문제를 시작해봅시다:

```js
(define (problem blocks)(:domain blocksworld)

(:objects
    red green blue  - block
    )

(:init
    (ontable red) ; 블록 red
    (on green red) ; 블록 green
    (on blue green)(clear blue) ; 블록 blue
    (handempty)

)

(:goal (and
    (on green blue)
    (on red green)
))
)
```

<div class="content-ad"></div>

PDDL은 s-표현식을 사용하는데, 이는 LISP에 익숙하지 않은 사람들에게는 조금 적응이 필요할 수 있어요. 일반적으로 "A + B"라고 말하는 대신에 "+" 연산자를 먼저 써서 (+ A B)와 같은 형태로 작성해야 합니다.

위의 예시에서 마지막 부분에서 "goal"이 정의되는 부분을 보실 수 있어요. (on green blue)는 "green on blue"를 읽고, (on red green)은 "red on green"을 읽어요. 마찬가지로 "and" 연산자는 두 문장 모두가 참이어야 한다는 것을 보장합니다. 즉, "red on green and green on blue"가 됩니다. 괄호들은 또 다른 과거의 요구사항입니다: LISP는 "List Processor"의 약자로, 리스트를 Python의 튜플과 유사하게 정의합니다. 예를 들어, (:goal `list`))는 또 다른 리스트를 받아들이는데, 다시 두 개의 리스트를 포함합니다. 여기서 (and `list`)는 내장 연산자이지만 (on `list`)는 아닙니다. 이것이 도메인 파일의 필요성이고, 나중에 소개하도록 하겠습니다.

목표뿐만 아니라, PDDL 문제에는 초기 조건 목록도 필요합니다. 이들은 술어들로 제공되며, True 또는 False만을 가질 수 있는 표현식입니다. PDDL은 이러한 술어들을 (:init `list`) 다음에 오는 리스트에 모아두는데, 여기에는

- (ontable red)
- (on green red)
- (on blue green)
- (clear blue)
- (handempty)

와 같은 조건들이 있습니다.

<div class="content-ad"></div>

이러한 형용사를 변수 또는 함수로 생각하는 것은 유혹적일 수 있습니다. 그러나 이들은 그 둘 다 아닙니다. 단순히 명제입니다. 예를 들어, 문제에 명제 (handempty)가 추가되었다면, 이는 참입니다. 거짓으로 변경하려면 문제에서 제거해야 합니다. 따라서 이는 두 가지 값 중 하나를 포함할 수 있는 변수가 아닙니다. 정의되어 있으면 참이고, 정의되어 있지 않으면 거짓입니다.

나머지 모든 형용사들은 처음 봤을 때에는 함수처럼 보이지만, 이들도 단순히 명제일 뿐입니다. (ontable red)는 빨간 블록이 탁자 위에 앉아 있다고 알려줍니다. (on green red)는 녹색 블록이 빨간 블록 위에 있다고 알려주며, (on blue green)는 파란 블록이 녹색 블록 위에 있다고 시그널을 줍니다. (clear blue)는 파란 블록이 잡을 수 있다는 것을 나타냅니다.

그러나 파라미터 역할을 할 수 없으면 PDDL은 상당히 쓸모가 없을 것입니다. :objects 목록은 형용사를 구성할 수 있는 모든 객체를 정의합니다. 조금 더 엄밀하게 만들기 위해 PDDL은 typing을 제공하기도 합니다. 여기서 "-블록"은 빨간색, 녹색, 파란색이 모두 블록 유형임을 나타냅니다. 이렇게 하면 위의 모든 형용사가 블록 유형의 객체와만 작동하므로 논리 오류를 방지하는 데 조금 더 수월해집니다. 또한, 해당 유형의 객체만 고려하여 해결책을 찾는 것이 더 쉬워지며, 이에 따라 필요한 동작만 고려하면 됩니다.

형용사들은 도메인 설명서에서 정의됩니다. 도메인의 이름은 문제 설명서의 :domain 목록에 지정됩니다. 도메인 이름은 도메인 파일의 첫 줄에도 표시됩니다.

<div class="content-ad"></div>

```js
(define (도메인 블록월드)

(:requirements :typing :negative-preconditions)

(:types block) 

(:predicates
 (on ?a ?b - block)
 (clear ?a - block)
 (holding ?a - block)
 (handempty)
 (ontable ?x - block)
)

(:action pickup ; 이 액션은 테이블에서 들어올 때만 사용됩니다
:parameters (?x - block)
:precondition (and (ontable ?x)
    (handempty)
    (clear ?x)
   )
:effect (and (holding ?x)
    (not (handempty))
    (not (clear ?x))
    (not (ontable ?x))
  )
)
(:action unstack ; 블록에서 들어올 때만 적합
:parameters (?x ?y - block)
:precondition (and (on ?x ?y)
    (handempty)
    (clear ?x)
   )
:effect (and (holding ?x)
    (not (handempty))
    (not (clear ?x))
    (clear ?y)
    (not (on ?x ?y))
  )
)

(:action putdown
:parameters (?x - block)
:precondition (and (holding ?x)
   )
:effect (and (ontable ?x)
    (not (holding ?x))
    (handempty)
    (clear ?x)
  )
)

(:action stack
:parameters (?x ?y - block)
:precondition (and (holding ?x)
    (clear ?y)
   )
:effect (and (on ?x ?y)
    (not (holding ?x))
    (handempty)
    (not (clear ?y))
    (clear ?x)
  )
)

)

이 두 파일을 problem.pddl 및 domain.pddl로 저장하면 VS Code 확장 프로그램을 사용하여 Figure 1에 표시된 것과 같은 계획을 생성할 수 있습니다. 그렇지 않으면 온라인 PDDL 편집기를 사용하고 LAMA 솔버를 사용할 수도 있습니다.

블록월드 도메인을 위한 유형과 술어는 도메인 파일에서 매우 일찍 정의되어 있습니다:

(:types block) 

(:predicates
 (on ?a ?b - block)
 (clear ?a - block)
 (holding ?a - block)
 (handempty)
 (ontable ?x - block)
)

<div class="content-ad"></div>

여기서 사용된 유형 (block만)은 :types 목록에 제공됩니다. 술어는 :predicates에 입력되며 전체를 "?로 표시된 자리 표시자"가 사용합니다. 모든 술어가 실제로 위의 패턴을 따르는지 확인하려면 위에 정의된 문제를 확인할 수 있습니다.

유의할 점은 타이핑이 이미 PDDL의 비표준 기능임을 의미합니다. 타입이 사용됨을 파서와 솔버에 알리려면 :requirements 목록의 맨 처음에 :typing이 제공됩니다.

이제 작업을 사용하여 술어를 조작할 수 있습니다. :action은 매개변수, 선행 조건 및 효과로 구성된 목록입니다. 작업은 모든 선행 조건이 True인 경우에만 실행됩니다. 작업의 효과는 술어의 생성 또는 삭제입니다. 여기서는 :negative-preconditions를 추가하여 가능하게 된 (not `list`) 연산자를 사용합니다.

```
(:action pickup ; 이 작업은 테이블에서 선택하는 것만을 위한 작업입니다
:parameters (?x - block)
:precondition (and (ontable ?x)
    (handempty)
    (clear ?x)
   )
:effect (and (holding ?x)
    (not (handempty))
    (not (clear ?x))
    (not (ontable ?x))
  )
)


<div class="content-ad"></div>

픽업 액션은 블록 오브젝트 하나의 매개변수를 갖고 있어요. 여기서는 동일한 오브젝트를 가리킬 때 ?x를 사용해요. 액션이 실행되려면 세 가지 조건이 참이어야 해요:

- (ontable ?x)
- (handempty)
- (clear ?x)

오브젝트는 테이블 위에 있어야 하고, 그리퍼는 비어 있어야 하며, 오브젝트는 집을 수 있어야 해요. ontable ?x와 clear ?x는 함수가 아니에요. 이것들은 문제의 :init 목록에 제공되었거나 런타임에 액션에 의해 생성되어야 하는 술어들이에요.

여기서 :effect가 등장해요. 이 목록에는 액션이 실행된 후 참이 될 술어들이 포함되어 있어요. 요것들이죠:

<div class="content-ad"></div>

- (?x을(를) 잡고)
- (손이 비어 있지 않음)
- (?x가 비어있지 않음)
- (?x가 테이블 위에 없음)

즉, 작업 (pickup ?x)을 성공적으로 실행하면 로봇이 ?x를 잡고 있게 되며, (손이 비어 있지 않음), (?x가 비어있지 않음) 및 (?x가 테이블 위에 없음)과 같은 예측이 삭제됩니다.

이 설정은 계획을 만드는 방법에 대한 첫 번째 단서를 제공합니다. 원하는 결과로 이어지는 효과를 살펴보고, 동일한 방법으로 선행 조건을 충족하도록 하여 초기 상태에 이르기까지 도달할 수 있습니다. 또는 초기 조건 집합에 모든 가능한 작업을 적용하고 목표를 찾을 때까지 이러한 결과 상태를 처리할 수 있습니다. 이 두 가지 모두 어려운 문제로, 계획은 NP-어렵다고 합니다.

이제 남은 작업을 살펴보겠습니다. 먼저, unstack은 블록 ?x를 블록 ?y에서 집습니다. 이를 위해서는 ?x가 ?y에 있고, 손이 비어 있으며, ?x가 비어 있어야 합니다.

<div class="content-ad"></div>

```js
(:action unstack ; block을 가져오기에 적합
:parameters (?x ?y - block)
:precondition (and (on ?x ?y)
    (handempty)
    (clear ?x)
   )
:effect (and (holding ?x)
    (not (handempty))
    (not (clear ?x))
    (clear ?y)
    (not (on ?x ?y))
  )
)

로봇이 블록 ?y를 들 수 있도록 되었습니다. 이에 따라 (handempty), (clear ?x), (on ?x ?y)이 삭제되었습니다. 또한 (clear ?y)가 True로 변경되어, 블록 ?y가 현재 들어올 수 있는 상태가 되었습니다. putdown 및 stack 동작도 동일한 패턴을 따릅니다.

# PDDL 문제 해결

여기서 설명한 계획 문제는 AI 분야의 가장 오래된 주제 중 하나이지만, 여전히 활발히 연구되고 있는 분야입니다. PDDL의 최신 버전에는 시간 및 양에 대한 추론 능력이 포함되어 있으며, 특정 계획 문제는 일부 알고리즘을 사용하여 더 잘 해결할 수 있습니다. 가장 일반적인 플래너 중 하나인 "FastDownward" (https://www.fast-downward.org/)는 PDDL 2.1 기능 대부분을 지원합니다. 대부분의 플래너 목록은 https://planning.wiki/ref/planners/atoz에서 찾을 수 있으며, 대부분의 플래너는 지원하는 요구 사항 목록을 표시합니다.
```

<div class="content-ad"></div>

문제 설명을 공식화하는 것 외에도 AI 커뮤니티는 플래너 인터페이스를 통합하고 https://github.com/AI-Planning/planutils 프로젝트가 도커 컨테이너를 제공하여 다양한 플래너 중에서 선택할 수 있도록 하고 로컬 웹서버를 통해 사용 가능하게 합니다. 이 방법은 VSCode의 Planning Domain Definition Language 확장 기능에 통합되어 있습니다. 구문 강조 기능 뿐만 아니라 해당 도구를 사용하여 초기 및 목표 상태, 그리고 결과 계획을 시각화할 수 있습니다. 또한 블록 작업과 같은 자체 JavaScript 시각화를 추가할 수 있습니다. 이 예제는 여기에서 찾을 수 있습니다.

![이미지](/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_4.png)

Linux, Mac 또는 Windows에서 planutils를 Docker 컨테이너에 설정하는 것은 VS Code 확장 프로그램 안내에 따라 간단합니다. 그러나 Docker 컨테이너 내의 planutils의 Flask 서버에 액세스할 수 있도록 "호스트 네트워킹"을 활성화해야 합니다.

#Planning and ChatGPT

<div class="content-ad"></div>

ChatGPT와 달리, 계획자는 항상 올바른 작업 순서를 제시할 것입니다. 특정 문제에 대해 모든 술어 및 동작을 설정하는 것이 번거로워 보일 수 있지만, 실제 환경에서는 그렇게 하는 것이 무리하지 않습니다. 복잡한 여행 일정을 만들거나 긴 구매 주문을 처리하거나 식료품을 쇼핑하거나 복잡한 조립을 실행할 인간형 로봇을 만들기 위해 소프트웨어 에이전트를 구축한다면, 사용 가능한 API 종류를 잘 파악하고 그들이 작동하기 위해 필요한 것들(전제 조건)과 성공적으로 실행된 경우 무엇이 발생할지 알고 있어야 합니다. 그런 다음 계획 실행에는 (1) 세계의 상태를 기반으로 술어 목록을 작성하는 것, (2) 계획자가 하나씩 내뱉는 모든 동작을 호출하는 것, 그리고 (3) 실행 중 환경이 변경될 경우 선택적으로 다시 계획하는 것이 필요합니다. 이 프레임워크를 구현한 후 ChatGPT를 간단히 프롬프트하여 적합한 목표를 생성시킬 수 있습니다:

![이미지](/assets/img/2024-06-19-ThinkingFastandSlowwithLLMsandPDDL_5.png)

이 접근 방식은 결국 동일한 한계에 부딪힐 것이지만, 적절한 목표를 설정하는 것은 "자동차 조립"과 같이 수천 개의 동작이 필요할 수도 있는 목표에 대한 긴 목록보다 훨씬 처리가능합니다. 또한 ChatGPT가 심볼의 이름을 어떻게 지정할지 추측했습니다. 블록월드 예시가 매우 잘 문서화되어 있어서 색상을 사용하기로 선택한 것일 수도 있습니다.

# 카운터와 시간을 고려한 계획들

<div class="content-ad"></div>

지금까지는 부울 술어에 대해 이야기했습니다. PDDL의 최신 버전은 양과 시간을 지원합니다. 아래 예시에서는 카운터 변수를 사용하여 초기값이 0이며 3에 도달해야 하는 문제가 제시됩니다.

```js
(define (problem say-hello-3-times) 
(:domain counter-test)

(:init
    (= (counter) 0)
)

(:goal
    (and 
        (= (counter) 3)
    )
)
)
```

이 문제를 해결할 액션을 제공하는 도메인은 다음과 같습니다:

```js
(define (domain counter-test)

(:requirements :strips :fluents)

(:functions
        (counter)
)

(:action hello-world
    :parameters ()
    :precondition ()
    :effect (and 
     (increase (counter) 1)
    )
)

)
```

<div class="content-ad"></div>

counter 함수는 :fluents에서 사용 가능한 functions에 정의되어 있습니다. "Hello World"를 출력할 수 있는 hello-world 동작은 그런 다음 (counter를 1 증가시키는) 효과를 제공합니다. PDDL fluents는 시간이 지남에 따라 변할 수 있는 상태 변수입니다. 이는 단순히 카운터 이상의 가치가 있습니다. 연료 수준, 에너지 소비, 또는 이커머스 카트에 있는 승객 또는 상품의 수에 대해 추론할 수 있게 합니다.

따라오신 분들께서는 FastDownward 솔버가 :fluents 요구 사항을 처리할 수 없다는 것을 알 수 있을 것입니다. 이를 처리할 수 있는 계획자는 planutils를 통해 사용할 수 있는 Expressive Numeric Heuristic Search Planner (ENHSP)입니다. planutils 도커 컨테이너에서 planutils install enhsp-2020을 사용하여 설치하거나 온라인 편집기에서 EHSP 솔버를 사용할 수 있습니다.

또한 각각의 동작에 타이밍을 연관시켜 계획을 시간 영역으로 확장할 수 있습니다. 이 내용은 VS Code PDDL 익스텐션 제작자의 이 튜토리얼에서 잘 설명되어 있습니다:

# 조건부 효과

<div class="content-ad"></div>

조건부 효과는 when 키워드를 사용하여 특정 조건에 따라 다른 결과를 지정할 수 있는 기능입니다 (:conditional-effects가 필요합니다). 트럭 적재 예제에서, 상태 표현식 requires-caution은 일반적인 경우 패키지가 부서지기 쉬울 때에만 True로 설정됩니다.

```js
(define (domain truck)

(:requirements :strips  :conditional-effects)
(:predicates 
  (in ?package ?truck)  
  (empty ?truck)
  (requires-caution ?truck)
  (fragile ?object)
  )

(:action load-truck
    :parameters (?package ?truck)
    :precondition (and 
                    (empty ?truck))
    :effect (and
        (in ?package ?truck)
        (when (fragile ?package)
            (requires-caution ?truck))))
)
```

이 도메인과 관련된 샘플 문제는 다음과 같습니다:

```js
(define (problem load-truck) 
(:domain truck)

(:objects truck77 shipment123)
(:init 
    (empty truck77) 
    (fragile shipment123))   

(:goal (and (in shipment123 truck77)))
)
```

<div class="content-ad"></div>

FastDownward를 사용하여이 문제를 해결할 수 있습니다. 불확실성을 구현하는 방법으로 'when'에 대해 생각하는 것은 유혹적입니다. 두 가지 상호 배타적 'when' 문을 사용할 수 있으며, 이를 통해 로봇 장애물을 모델링하는 방법은 인터넷에서 흔히 볼 수 있는 예입니다. 그러나 이는 실시간으로 술어를 평가하지 않기 때문에 실제로 말이 되지 않습니다. 동작의 다른 가지에 확률을 연결할 수 있도록 허용하는 PPDDL(Probabilistic PDDL)이라는 PDDL의 확률론적 버전도 존재합니다. 그러나 PPDDL도 동일한 문제를 가지고 있으며, 확률론적 방식으로 문제를 해결할 수 있게만 해주며 마치 Markov Decision Problem과 유사합니다.

# 최신 트렌드

최근에는 커뮤니티가 직접 Python으로 계획 문제를 구현하도록 이동하는 추세입니다. 예를 들어, PDDL로 가져오고 내보낼 수 있는 Unified Planning 라이브러리가 있으며 최신 솔루션과 통합되어 있으며 리플래닝과 계획 복구를 지원하며 리얼타임 애플리케이션에 중요한 기능입니다. Scikit-decide는이를 한 단계 더 나아가서, 심볼릭 계획 또는 강화 학습과 함께 사용할 수있는 계획 문제에 대한 통합 접근 방식을 제공합니다. 더 많은 정보를 원하시면 ICAPS-2024에서 튜토리얼을 확인해보세요.

<div class="content-ad"></div>

상징적 계획자들의 능력은 모든 가능성을 체계적으로 평가하여 수량과 시간에 대한 제약을 고려하여 올바른 작업 순서를 찾는 데 있습니다. 이 능력은 ChatGPT와 같은 LLM의 추론 능력과는 별개입니다. 이 둘의 시스템은 결국 같은 문제를 해결하도록 밀어붙이지만, 이 이분법은 또한 인간 경험을 모델링합니다. 우리의 정신 장치가 한계에 도달하면, 우리는 손전등이나 종이와 연필 또는 다른 도구를 사용하여 알고리즘을 고수하여 문제를 해결합니다.

ChatGPT가 훈련을 통해 일반적인 문제 해결자가 되는 것은 그다지 가능성이 낮습니다. 우리가 모든 가능한 영역을 포괄할 수 있는 예제를 제공하는 일은 너무나도 어렵기 때문이며, LLM은 정확성을 강제할 방법을 제공하지 않습니다. 이것은 비즈니스 애플리케이션이나 현실 세계에서 운영되는 로봇과 같은 제품 시스템에게 특히 중요합니다. 불행히도, 모든 솔버가 PDDL의 모든 기능을 지원하는 것은 아니며, 올바른 PDDL 정의와 솔버의 조합을 찾는 것은 어려울 수 있습니다.

ChatGPT를 상징적 계획과 보완하는 것 외에도, 오픈 월드 추론과 상징적 계획을 훨씬 더 밀접하게 통합할 수 있는 큰 기회가 있습니다. 예를 들어, LLM은 상식 정보를 사용하여 한 방향으로의 검색을 다른 방향보다 우선시하는 데 사용될 수 있습니다. 마찬가지로, 자연어의 PDDL 기호 및 술어는 OWL-ViT와 같은 도구를 사용하여 실제 세계의 이미지를 감지하는 데 사용될 수 있습니다.