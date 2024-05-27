---
title: "ChatGPT를 활용한 스마트 대화를 위한 API 구현하기"
description: ""
coverImage: "/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_0.png"
date: 2024-05-27 14:28
ogImage:
  url: /assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_0.png
tag: Tech
originalTitle: "Implement an API for Smart Conversations with ChatGPT"
link: "https://medium.com/dev-genius/implement-an-api-for-smart-conversations-with-chatgpt-57e7a9b335c7"
---

ChatGPT API를 활용하여 Node.js 및 Express로 대화형 앱을 개발하겠다고 시작하세요.

![이미지](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_0.png)

ChatGPT API는 철저히 문서화되어 있지만 상호 작용하는 방법에 대해 고민해야 합니다. 기능이나 함수를 구현하려고 노력하면서 때로는 놓치기 쉬운 부분들이 있습니다. 또한 명시적으로 언급되지 않았지만 강하게 암시되어 있는 구현 방법도 있습니다. ChatGPT를 적극 활용하는 애플리케이션을 개발 중인데, 이를 통해 얻은 교훈과 빠른 시작 방법을 소개하겠습니다!

# 팁 및 Best Practices

<div class="content-ad"></div>

ChatGPT의 API는 메시지와 함께 반드시 전송해야 하는 3가지 주요 역할이 있습니다:

- “system” 메시지는 모델의 출력에 대한 세밀한 제어를 제공합니다. 특정 “인격”을 가진 모델을 만들고 싶다면 “system” 역할을 사용하여 무엇을 해야 하는지 알려주세요.
- “assistant”는 모델에서 이전 메시지를 계속적인 대화의 맥락으로 보낼 때 사용해야 합니다. 이를 순서대로 유지하는 것이 좋습니다.
- “user” 메시지는 사용자가 자신의 질문이나 발언으로 제출한 내용입니다.

개발 프로세스에 관한 내용:

- 역할은 대화를 주제에 맞게 유지하고 일관된 사용자 경험을 만드는 데 중요합니다. ChatGPT에 무작위 역할을 사용하여 메시지를 보내면 응답은 받을 수 있지만 사용 사례에 최적화되지는 않을 수도 있습니다.
- 대화의 이력을 유지하고 사용자의 대화 중에 다시 보내야 합니다. 순서를 유지하는 것이 중요합니다.
- 환경이 핫 리로드와 함께 빠른 반복 작업을 허용하는지 확인해야 합니다. 시스템 프롬프트 및 데이터 이동을 빈번하게 작업하고 수정할 것입니다.
- 대화의 초기 시스템 컨텍스트(시딩)를 설정할 때, 원하는 바를 구체적으로 명시해야 합니다! 프롬프트 엔지니어링에 대한 다른 많은 글들이 있으므로 초기 메시지가 적절한지 확인해주세요.

<div class="content-ad"></div>

주의할 점:

- 시스템 프롬프트/시딩 사용은 모델을 훈련시키지 않습니다! 단지 모델을 사용 사례에 편향시킬 뿐입니다.
- 환청이란 모델이 정보를 날조하거나 부정확하게 제시하는 것을 의미합니다. LLM은 서로 자주 놓이는 단어를 연달아 놓는 데 능숙합니다. 전문 지식이 필요한 사용 사례를 탐색할 때 이 점을 염두에 두세요!

모든 것을 염두에 두고, 초기 구현을 진행합시다!

독자들이 대부분 NodeJS, Visual Studio Code와 같은 코드 편집기, Docker 및 터미널을 사용할 준비가 되어 있는 것으로 가정합니다. 그렇지 않은 경우, 초기 환경을 설정하는 것이 다소 혼란스러울 수 있습니다. 이 기사의 끝에 이 기사의 코드를 포함한 Github 링크를 첨부하겠으며, 컨테이너화를 건너뛰고 싶은 경우 도커 없이도 프로젝트를 실행할 수 있습니다.

<div class="content-ad"></div>

시작하려면 코드 저장소의 루트에서 터미널에서 프로젝트 구조를 만들어봅시다:

```js
npx create-react-app web --template typescript
```

```js
mkdir api api/src
touch docker-compose.yaml api/Dockerfile web/Dockerfile
cd api
npm init -y
touch src/index.ts
```

이러한 간단한 Docker 구성을 채워넣어 빠르게 반복 작업을 할 수 있도록 할 거에요!

<div class="content-ad"></div>

그럼 API 및 웹 프로젝트를 실행할 docker-compose 파일에 간단한 구성을 추가하겠습니다.

docker-compose up으로 도커 구성이 작동하는지 확인한 후 API 작업을 시작하겠습니다. 먼저 API 프로젝트로 이동하여 다음 명령을 실행하세요:

```js
npm i typescript nodemon node-ts express @types/express cors @types/cors openai
```

이러한 종속성은 API가 트래픽을 제공하는 데 도움이 되는 기본 라이브러리가 될 것입니다. 간단한 익스프레스 API를 만들어 시작해볼까요?

<div class="content-ad"></div>

한 번 이 작동하면 curl http://localhost/:3010을 실행할 수 있고, 우리의 API는 Hello World로 응답할 것입니다.

![이미지](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_1.png)

이제 사용자 대화를 ChatGPT API로 전달할 수 있는 API의 기본 구조가 갖춰졌습니다! 신중하게 진행하기 위해, 진행하기 전에 다루고 있는 개념을 모델링해야 합니다.

ChatGPT 위에 단순히 다른 UI를 올려놓는 것이 아닌 무언가를 구축하려면, ChatGPT가 이미 제공하지 않는 이 앱이 무엇을 할 것인지에 대한 개념이 필요합니다. ChatGPT를 다루는 일반적인 Best Practice 중 일부는 대화 시작 시 모델에 personas를 제공하는 것입니다. 모두가 AI를 어떻게 이끌어야 하는지를 이해하는 시간과 의지가 없는 것이 아닐 수도 있으니, 우리는 일반 비기술 사용자를 돕기 위해 그들이 대화를 나눌 수 있는 몇 가지 personas를 만들어주는 것이 가능할 것입니다. 그것이 이 애플리케이션의 기본 개념이 될 것입니다.

<div class="content-ad"></div>

페르소나 구현을 용이하게 하기 위해, 사용하고자 하는 몇 가지 페르소나를 빨리 작성하고 코드베이스의 다른 부분에서 접근할 수 있도록 만들 것입니다. 이를 통해 애플리케이션의 다른 곳에서 우리가 추구하는 기능을 구현하는 데 사용될 것입니다. Craig the Builder, Tom the Gardener, Kate the Bartender, Jen the Beautician 이렇게 4가지 페르소나를 만들어 봅시다.

이제 이 작업이 완료되었으므로, 다음과 같이 매우 간단한 API 엔드포인트를 작성할 수 있습니다:

![API 엔드포인트 이미지](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_2.png)

이제 이것이 설정되었기 때문에 사용자들이 페르소나와 대화할 수 있는 서비스 레이어를 구현할 수 있습니다.

<div class="content-ad"></div>

ChatGPT과 상호 작용할 때 3가지 특정 단계를 반복합니다. 대화를 초기화하는 것, 사용자 입력을 받는 것, 그리고 모델 응답을 하는 것이죠. 하나의 사용자는 동시에 여러 대화를 나눌 수 있습니다. 대화 중 일부는 단순히 처음 메시지 하나와 모델 응답이 이어질 수도 있고, 일부는 더 긴 형태일 수도 있습니다. 이 대화에서 메시지의 주고받는 순서는 중요할 수 있습니다.

![ChatGPT](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_3.png)

이 정보를 바탕으로 API를 구축하는 방법을 찾아야 합니다. 구현을 진행하기 위해 전형적인 POST/PUT/DELETE HTTP 동작을 사용할 것입니다.

- 사용자는 API에 대화를 초기화함으로써 관심 있는 대화 상대자의 개인 정보를 POST하는 방식으로 대화를 시작합니다. 대화를 나중에 이어나갈 수 있도록 프론트엔드에서 생성된 대화 ID를 포함해야 합니다.
- 대화는 새로운 사용자 입력을 API에 PUT하는 것을 통해 계속됩니다. 메시지와 함께 대화 ID를 포함해야 하며, 이를 통해 이전 대화를 쉽게 추출하여 관련 맥락을 유지할 수 있어야 합니다.
- DELETE를 통해 대화를 삭제할 수 있습니다. 사용자는 더 이상 보고 싶지 않은 대화 ID를 전송하여 대화를 삭제할 수 있습니다.

<div class="content-ad"></div>

API 엔드포인트를 고려할 때, 우리는 저장소가 가져야 할 기능을 알 수 있습니다. 이 기사의 범위를 벗어나 데이터 저장 솔루션을 정의하는 대신, 구독할 수 있는 인터페이스를 정의하고 간단한 메모리 내 저장 구현을 실행하겠습니다.

이 인터페이스는 대화를 지속시키는 서비스의 기반이 될 것입니다. ChatGPT를 백엔드로 사용하기 때문에, ChatGPT에 대한 기본 기능을 특히 구현해야 하므로 각각의 기본 클래스를 구현한 후 각 레이어에 필요한 기능에 대해 논의하겠습니다. 먼저, ChatGptConversationService의 뼈대를 구현할 것입니다.

이를 위해 openai 노드 라이브러리를 사용할 것입니다. 환경에 API 키를 저장하며, 이는 도커 컨테이너를 통해 로드됩니다. 9번째 줄에서는 ChatGpt로부터 수신된 메시지를 그대로 저장하고, 전송 날짜와 함께 장식합니다. 전체 대화는 해당 대화가 초기화된 페르소나와 함께 저장되며, 현재까지 수신/송신된 모든 메시지가 포함됩니다. 이를 통해 새로운 메시지마다 전체 대화를 ChatGpt API로 전송하여 대화의 문맥을 유지할 수 있습니다. 이는 "이 두 가지 옵션에 대해 더 말씀해주시겠어요?"와 같은 후속 메시지를 보낼 때 LLM이 무엇을 의미하는지 알고 있는지 여부를 결정할 수 있습니다.

다음으로 InMemoryConversationService를 구조화하고, 생성자에서 ChatGptConversationService를 인스턴스화하여 한 번에 생성되도록 할 것입니다.

<div class="content-ad"></div>

만약 "실제" 서비스 계층을 구현한다면 데이터의 백업 저장소와 사용자 세분화 등을 포함하여 더 많은 작업을 수행할 것입니다. 그러나 우리는 이 예제 앱을 이용하여 실제로 프로덕션 환경으로 넘어가려는 것이 아니에요. 이제 InMemoryDB 서비스와 ChatGPT에서 각 메서드 구현을 동시에 살펴봐서 각 계층에 왜 세부 정보가 "살아있는지"에 대해 이야기할 수 있게 됩니다.

## GET

여기서 시작하기 원하는 첫 번째 일은 두 서비스 간의 GET을 구현하는 것입니다. ChatGPT를 시작으로 하여 InMemory 서비스에 이어 진행하겠습니다:

ChatGpt 서비스에서는, 단순히 대화의 ID를 가져와 Promise.resolve를 통해 반환합니다 (이 서비스가 언젠가 백업 저장소를 사용하도록 업그레이드되는 경우를 대비하여 여기서 promises를 사용하고 있습니다). 또한 사용자 소비용 대화를 가져올 때 역할 "system"을 필터링하여 사용자가 우리의 페르소나 프롬프트를 보지 못하도록 합니다. 또한 chatgpt의 역할을 프론트엔드에서 사용하고자 하는 값으로 다시 매핑합니다 (user/bot).

<div class="content-ad"></div>

InMemory 서비스는 이 경우에 많은 가치를 더하지 않지만, 메시지가 undefined 또는 null을 반환하는 경우 API 레이어에서 문제를 발생시킬 가능성 대신 빈 배열을 반환할 수 있습니다.

이제 API 레이어에서 API URL에서 대화 ID를 추출하여 매우 쉽게 활용할 수 있습니다. 이것은 기존 대화 메시지와 현재 대화 메시지를 모두 가져오는 우리 목적에 완벽히 작동할 것입니다.

# POST

다음으로 새 대화를 생성하고 초기 페르소나/메시지를 구현할 것입니다.

<div class="content-ad"></div>

이제 채팅 순서를 유지하기 위해 메시지가 전송된 시간을 유지하고자 합니다. 따라서 먼저 ChatGpt 서비스에서 메시지가 전송된 시간을 생성합니다. 그런 다음 "시스템" 역할을 사용하여 페르소나의 "성격" 및 "사용자" 역할로 전송된 메시지를 사용하여 ChatCompletionMessageParam을 인스턴스화하여 API 호출을 위한 메시지를 생성합니다. 이렇게하면 openai.chat.completions.create 메소드를 model/messages 매개변수와 함께 사용할 수 있습니다. 응답이 돌아오면 해당 응답을 대화 ID에 저장하고 나중에 메시지를 정렬하는 데 사용할 수 있도록 전송된 날짜를 메시지에 투영합니다. 그런 다음 API의 응답을 반환합니다.

InMemory 서비스로 돌아와서, ChatGpt API가 실제로 응답했는지를 다시 확인하고, 그렇지 않은 경우에는 오류를 발생시킵니다. 그렇지 않으면 기본 ChatGpt 서비스 getConversation 메서드에서 전체 대화를 반환합니다. 이는 매번 메시지를 보낼 때 응답이 모든 메시지를 포함하며 프론트엔드 시각화를 쉽게 교체할 수 있음을 의미합니다.

이 작업은 기존 경로 /conversation/:id의 POST 메서드에 추가해야합니다. 이렇게하면 페르소나와의 새로운 대화를 시작할 수 있습니다. 간단한 CURL 요청으로 테스트할 수 있습니다:

<img src="/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_4.png" />

<div class="content-ad"></div>

# PUT

'새 대화를 시작하려면 초기 상태를 설정하고 초기 인격/시스템 프롬프트로 대화를 시작해야 해서 "추가"적인 작업이 많이 필요합니다. 반면에 "진행중인" 대화 메서드와 엔드포인트는 비교적 간단할 것입니다.

ChatGpt 서비스의 sendMessages 함수는 새 메시지를 저장하고 유지하기 위해 메시지를 먼저 저장소에 푸시한 다음 ChatGpt API로 보냅니다. 그리고 응답이 돌아오면 그것을 날짜 투영을 다루는 private 메서드인 newMessage를 사용하여 저장합니다. 이것은 서로 다른 메시지에서 공통적으로 사용되는 함수이기 때문에 날짜 투영을 처리해주죠. ChatGpt 서비스는 메시지 내용을 반환하지만, 이전 방식대로 API가 응답했는지를 확인하기 위해 사용할 것이므로 이를 통해 엔드포인트에서 전체 대화를 반환할 것입니다.

이것을 API에서 간단하게 연결할 수 있습니다:

<div class="content-ad"></div>

기존 루트인 /conversation/:id에 PUT 메서드 아래에 이 메소드가 추가될 것입니다. 이를 통해 페르소나와의 대화를 계속할 수 있게 될 것입니다. 아래 요청은 이전 대화를 계속할 것입니다:

![이미지](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_5.png)

이제 GET 액션을 "테스트"하는 것이 중요합니다. 이전 요청과 동일한 내용을 반환할 것입니다. 그러나 테스트 목적으로 명령어는 다음과 같습니다:


# DELETE


<div class="content-ad"></div>

저희는 삭제 작업이 꽤 간단합니다. ChatGpt 서비스는 메모리 저장소만을 사용하고 있으므로 대화 ID로 저장된 데이터를 삭제할 수 있습니다. 이를 아주 빠르게 구현할 수 있습니다:

InMemory 서비스는 삭제 세부 정보를 ChatGpt 서비스에 위임하며, 대화가 저장소에 있는지 확인하고 있다면 삭제하고 해결된 "true" 프로미스를 반환하여 삭제를 구현할 것입니다. 삭제를 테스트하려면 curl을 실행하여 동일한 대화를 삭제한 후 가져올 수 있습니다:

![Conversation Listing](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_6.png)

# 대화 목록

<div class="content-ad"></div>

지금 API의 유일한 미해결 사항은 기존 대화 목록을 나열할 수 있는 기능이 없다는 것입니다. 현재 우리가 가지고 있는 구현으로는 매우 쉽습니다.

지금 우리는 저장소를 반환하고 Object.keys를 활용하여 프론트엔드 표현으로 매핑할 수 있습니다. 표시하고 싶은 정보에는 사용 중인 페르소나와 첫 번째 메시지가 포함되어 있어서 최소한 그것을 대화의 메모로 표시할 수 있습니다. 대화에 대한 요약기를 작성하는 것이 이상적일 수 있지만, 여기서는 제품으로 출시할 준비를 하고 있지는 않습니다!

API도 복잡하지 않습니다! 새 경로를 추가할 것이지만, 상당히 직접적인 호출로 연결할 수 있습니다:

지금까지 백엔드에서의 구현은 ChatGpt와 함께 작업하는 세부 정보를 어떻게 처리할 것인지에 대한 내용과 InMemory 서비스 인터페이스의 모양을 보여줍니다. ChatGpt 서비스의 세부 정보를 인지하지만 해당 정보를 API 레이어로 노출시키지는 않습니다. 이를 통해 서비스 계층의 입력/출력을 조정할 수 있는 옵션이 주어지므로, ChatGpt 서비스 구현에는 영향을 미치지 않으면서 서비스 계층의 입력/출력을 조정할 수 있고 그 반대도 가능합니다. ChatGpt 서비스의 기본 저장소 공급자를 조정하여 백엔드에 동기화되거나 InMemory 서비스에 사용자 계정 ID를 추가하여 사용자들이 서로의 대화에 접근을 제한할 수도 있습니다!

<div class="content-ad"></div>

이 앱에 대한 기본 프론트 엔드 구현은 간단합니다. 우리가 필요로 하는 API 엔드포인트는 오로지 5개뿐입니다 (GET Persona, GET Conversation List, GET/POST/PUT Conversation Messages). 대화 삭제는 여기에서 원하는 목표에 절대적으로 필요하지 않을 것으로 생각됩니다.

우선, 웹 프로젝트로 이동하여 앱을 구현하는 데 필요한 것들을 조립해 보겠습니다. API 엔드포인트를 모두 설정해야 하므로, 동일한 유형을 활용하여 API 레이어를 구축하겠습니다.

이는 매우 간단한 구현이며 URL을 쉽게 교체할 수 있는 기능이 부족하지만 필요 시 빠르게 구현할 수 있습니다.

여기서부터는 스타일 선택에 따라 다릅니다. UI 예시는 다음과 같을 것입니다:

<div class="content-ad"></div>


![Screenshot](/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_7.png)

이를 몇 가지 간단한 리액트 컴포넌트를 사용하여 쉽게 구현할 수 있습니다. 이 UI와 API는 다음 저장소에서 React로 구현되었습니다: https://github.com/christopherbauer/chatgpt-example. 실행하려면 OPEN_AI_API_KEY 변수를 설정한 .env 파일을 추가하고 프로젝트를 보통대로 실행하면 됩니다.

# 보너스

매우 다른 챗봇 역할을 보려면 다른 페르소나인 JaSON the Robot을 매우 쉽게 구현하여 JSON 코드로만 응답하게 만들 수 있습니다. 이를 통해 응답을 실제 JSON으로 해석하여 앱에 통합 가능성을 개선할 수 있습니다.


<div class="content-ad"></div>

이것은 매우 간단한 변화로 여러분이 작업할 수있는 추가적인 페르소나를 제공합니다. 몇 가지 다른 페르소나를 추가하고 그들의 반응을 확인해보는 것을 즐겨보세요!


<img src="/assets/img/2024-05-27-ImplementanAPIforSmartConversationswithChatGPT_8.png" />


ChatGPT API를 사용하여 앱을 빌드하려면 역할에 대한 좋은 이해, 잘 구조화된 백엔드, 그리고 사용자 친화적인 프론트엔드가 필요합니다. API의 세 가지 주요 역할인 "시스템", "어시스턴트", "사용자"는 대화를 추적하고 의미 있는 상호 작용을 제공하는 데 중요합니다.

도커, NodeJS, Express를 사용하여 견고한 프로젝트 기반을 구축하고 ChatGPT와의 트래픽을 처리하는 기본 API를 설정할 수 있습니다. 페르소나를 추가하면 사용자 상호 작용이 향상되어 AI가 더 관련성 있고 매력적으로 보입니다. 대화 기록을 유지하고 역할을 활용하여 다양한 요구 사항을 해결하는 서비스를 개발할 수 있습니다.

<div class="content-ad"></div>

이 문서는 프로젝트를 시작하고 personas를 정의하며 필요한 API 엔드포인트를 구축하는 주요 단계를 다루었습니다. 더 심층적으로 알아보고 싶은 사람들을 위해, 링크된 GitHub 저장소에는 완전한 코드베이스가 포함되어 있으며 설정하기 쉽습니다. 이 실용적인 방법을 통해 특정 요구 사항을 충족하기 위해 사용자 정의할 수 있는 예제 응용 프로그램을 탐색하고 확장할 수 있습니다.
