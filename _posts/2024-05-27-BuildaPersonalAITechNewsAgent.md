---
title: "개인용 AI 기술 소식 에이전트 구축하기"
description: ""
coverImage: "/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_0.png"
date: 2024-05-27 15:18
ogImage:
  url: /assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_0.png
tag: Tech
originalTitle: "Build a Personal AI Tech News Agent"
link: "https://medium.com/gitconnected/build-a-personal-ai-tech-news-agent-94e7a2e508fe"
---

### 귀하의 선호에 따라 기술 사이트를 크롤링하여 주요 트렌드를 요약합니다

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_0.png)

AI 시대에 이런 것을 구축하는 것이 쉽다고 생각할 수 있습니다. 그러나 고성능 LLM에 접근할 수 있다고 해서 구조화된 데이터가 필요하지 않다는 뜻은 아닙니다.

여기서 구축하려는 것은 매일과 매주 실행되는 개인 맞춤형 기술 보고봇으로, 기술 커뮤니티가 공유하고 이야기하는 내용을 기반으로 기술 트렌드와 뉴스를 요약해야 합니다. 개인적인 선호에 맞게 구축되어야 하므로 요약 내용이 얼마나 간결해야 하는지와 어떤 내용에 초점을 맞춰야 하는지 결정할 수 있어야 합니다.

<div class="content-ad"></div>

사용 중인 데이터는 기술 사이트를 크롤링하여 키워드를 추출하고 이를 집계하여 다양한 카테고리 내에서 어떤 것이 트렌드인지 파악하는 데 도움을 주는 API입니다.

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_1.png)

이 아이디어는 API를 쿼리하고 트렌드 지표와 우리의 선호도에 기반하여 LLM으로 공급해야 하는 소스를 프로그래밍적으로 설정함으로써 올바른 데이터를 요약하도록 도와주는 것입니다.

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_2.png)

<div class="content-ad"></div>

만약 이와 같은 검색 API를 만들고 싶다면, 여기 이전 게시물을 확인해보세요. 이것은 이 API가 어떻게 작동하는지에 대해 좀 더 자세히 다룹니다.

해당 기사에서는 오픈 소스 NLP를 사용하여 키워드를 추출하고 분류하여 수천 개의 텍스트를 분석하고 링크하는 방법에 대해 언급했습니다. 또한 여기서 자신의 NLP 모델을 세밀하게 조정하는 방법에 대해 이야기했고, API를 구축하는 데 도움이 된 모델을 오픈 소스로 공개했습니다.

그러나 이를 처음부터 만들 필요는 없습니다.

저는 이 API를 기반으로 구축될 최종 결과에 더 관심이 있으며, 이를 통해 이와 같은 뉴스 보고서를 생성할 수 있습니다.

<div class="content-ad"></div>


![Personal AI Tech News Agent](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_3.png)

보고서는 우리가 받은 내용의 짧은 스니펫입니다. 최대 열 가지 카테고리를 선택할 수 있고, 물론 매일 또는 매주 기술 봇이 찾을 키워드는 무한합니다.

여기에서 보고서의 전체 예시를 찾을 수 있습니다. 원하는 대로 조정하여 모양을 바꿀 수 있습니다. 한 가지 카테고리에만 집중하거나 몇 가지 키워드에만 초점을 맞출 수도 있습니다.

우리를 대신해서 일을 하는 LLM이 있는데요, 각 카테고리 내에서 제공된 데이터로 그 소스를 요약합니다. 이 뉴스레터나 보고서를 조직하는 사람은 없습니다. 데이터가 있고, 그리고 LLM이 있습니다.


<div class="content-ad"></div>

빌딩 아키텍처는 제외합니다. 그 외에 모든 것은 저희가 처리할게요!

# 소개

저희는 저코드 도구를 사용하지 않아요. 그래서 코딩에 완전히 처음이신 분들에겐 이해하기 어려울 수도 있어요. 하지만 코드 자체는 미리 준비돼 있을 테니, 당신이 해야 할 일은 설정을 당신의 기호에 맞게 조정하는 것뿐이에요. 다만, 무료 AWS 계정이 필요해요.

전체 튜토리얼은 5에서 10분 정도 걸릴 거예요. 이에 따른 비용은 OpenAI 토큰만 사용하는 것이에요.

<div class="content-ad"></div>

여기에서 사용할 리포지토리를 찾을 수 있어요.

간단한 소개와 봇의 아키텍처를 살펴보고, 그 후에 봇을 만들기 시작할 거에요.

## 몇 가지 질문과 답변

이 작업에 얼마나 기술적으로 이해해야 하나요? 매우 기술적으로 해줄 필요는 없어요. AWS에 배포하기 위해 Serverless Framework를 사용하기 때문에 시작부터 AWS 계정이 설정되어 있다면 더 좋을 거에요.

<div class="content-ad"></div>

얼마든지 비용이 발생합니까? AWS 무료 티어 한도를 초과하지는 않을 겁니다. 따라서 비용은 LLM 토큰을 위한 것입니다 - 이 경우에는 GPT-3.5. 하루에 요청하는 카테고리 및 키워드 수에 따라 보고서 하나당 보통 $0.05 이하의 비용이 듭니다.

시간 투자는 얼마나 되나요? 이미 제가 코드를 작성해 놓았기 때문에 크지 않아요. 여러분은 그대로 가져다 쓸 수 있습니다. 다만 원하시는 대로 조정하실 수도 있어요.

## 인프라

API 자체를 구축하는 작업은 이미 완료되었기 때문에 대부분의 작업은 그냥 이 데이터를 활용하는 것뿐이에요.

<div class="content-ad"></div>

위 기술 봇을 구축하기 위해선, 함수에 AWS Lambda를 사용하고 스케줄에 따라 매주 평일 10 UTC에 실행되도록 AWS EventBridge를 사용할 것입니다. AWS를 배포하기 위해 Serverless Framework를 사용할 것인데, 이는 프로세스를 간단화해줍니다.

여기서 사용할 언어는 파이썬입니다.

![Tech Bot](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_4.png)

이메일을 보내기 위해 AWS Simple Email Service를 사용할 것이지만, 원하는 매체를 자유롭게 선택하셔도 됩니다.

<div class="content-ad"></div>

슬랙이나 WhatsApp으로 업데이트를 받고 싶다면, 코드를 조정하여 해당 정보를 거기로 보내도록 설정할 수 있어요. 그러나, 이 튜토리얼에서는 이메일을 보내는 방법만 알려드릴 거에요.

그럼 데이터를 위한 API는 어떨까요? 우리에게 데이터를 제공하는 API에 대해 더 알고 싶다면 여기를 확인해보세요. 당신만의 API를 생성할 수도 있어요. 하지만, 이 경우에는 제가 사용하는 것을 사용할 수 있어요. 무료이며 작고 정교한 NLP 모델을 사용하여 유지 비용이 최소화되고 있답니다.

이전에 키워드를 추출하는 NLP 모델을 오픈소스로 공개했었어요. 따라서 여러분도 완전히 본인의 것을 만드는 것이 가능해요.

우리가 작업할 데이터를 확인하려면, 빠른 API 호출로 테이블 엔드포인트를 확인할 수 있어요.

<div class="content-ad"></div>

```js
curl -X GET "https://safron.io/api/table?period=daily&sort=trending"
```

어제 여러 기술 웹사이트에서 NLP 모델이 추출한 키워드의 양과 트렌딩 키워드를 먼저 정렬할 것입니다.

특정 키워드나 행 ID에 대한 검색 결과를 얻으려면 소스 엔드포인트를 사용합니다.

```js
curl -X POST \
-H "Content-Type: application/json" \
-d '{"keywords": ["ChatGPT", "AI"]}' \
"https://safron.io/api/sources"
```

<div class="content-ad"></div>

이렇게 하면 'AI'와 'ChatGPT'라는 키워드를 기반으로 최근 6일간의 소스 또는 검색 결과를 얻을 수 있어요. 여기서 날짜와 소스를 제어할 수도 있습니다.

하지만, 이 애플리케이션에서는 뉴스레터를 작성하기 위해 키워드 대신 JSON 요청의 본문에 ID를 사용하고 있어요. 코드 리포지토리를 엿볼 수 있다면 어떻게 하는지 확인할 수 있어요.

더 큰 LLM은 어떻게 되죠? 마지막으로, 우리는 데이터를 제공하는 더 큰 LLM을 통합하고 있어요. 이것에 대한 오픈 소스 사용 여부는 당신에게 달려있어요. 그러나 간편함을 위해 OpenAI에서 방금 출시한 새로운 GPT-3.5-turbo-1205 모델을 사용중이에요.

이 부분을 잘 수행하기 위해 충분히 큰 모델이 필요하니 GPT-3.5, Claude Haiku 또는 Mistral Medium로 시작하는 것을 권장해요. 최소 16k의 컨텍스트 창이 필요할 거에요.

<div class="content-ad"></div>

# 기술적인 부분

이를 구축하기 위해서 몇 가지가 필요합니다.

AWS 계정이 필요합니다. 이미 가지고 있지 않다면 만들어 주세요. 이 프로젝트에서는 무료 티어를 초과하지 않겠지만, 빌링 알림을 설정하는 것이 좋습니다.

로컬에 NodeJS, npm 및 Python이 설치되어 있는지 확인해 주세요. API를 테스트하는 데 Postman을 가지고 있는 것도 좋지만 필수는 아닙니다.

<div class="content-ad"></div>

이 애플리케이션을 완료하는 단계는 다음과 같습니다.

- AWS에서 IAM 사용자 구성
- OpenAI API 키 획득
- 로컬 환경 설정
- API에서 데이터 테스트
- 봇에 대한 개인 설정 구성
- 이메일을 위해 AWS SES 설정
- 일정에 따라 애플리케이션 배포

## AWS 구성

먼저 AWS 콘솔에서 IAM 사용자를 설정해야합니다.

<div class="content-ad"></div>

AWS 콘솔에서 IAM으로 이동하세요. 새로운 사용자를 만들어 마음에 드는 이름을 지어보세요. 이 사용자는 관리 콘솔에 액세스할 필요가 없을 거에요.

권한 설정에서는 직접 정책을 연결하고 다음으로 정책을 생성해야 합니다.

아래 허용 권한을 붙여넣기하려면 JSON 형식을 선택하세요.

<div class="content-ad"></div>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "events:DescribeRule",
        "apigateway:*",
        "s3:*",
        "logs:*",
        "events:PutRule",
        "events:RemoveTargets",
        "events:PutTargets",
        "events:DeleteRule",
        "iam:CreateRole",
        "cloudformation:*",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy",
        "events:PutTargets",
        "iam:PassRole",
        "lambda:*",
        "iam:TagRole",
        "iam:UntagRole"
      ],
      "Resource": "*"
    }
  ]
}
```

이것은 매우 광범위한 권한 집합을 포함하고 있어서 항상 주의해야 합니다. 그러나 Serverless는 모든 것이 원할하게 작동하려면 꽤 많은 권한이 필요합니다. 더 세밀한 권한 집합을 설정할 수 있는지 Serverless 문서를 살펴볼 수 있지만, 그렇지 않으면 계속 진행할 것입니다.

정책에 의미 있는 이름을 지어 '저장'을 클릭하십시오. 저는 내 것을 serverless로 지었습니다.

정책을 보려면 IAM 사용자를 다시 만들어야 할 수도 있지만, 페이지를 새로 고침하면 표시될 것입니다.



<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_6.png" />

사용자를 생성한 다음 액세스 키를 생성할 수 있는 위치를 찾습니다.

사용 목적을 묻는 질문에 답할 때 '로컬 코드'를 선택하고 .csv 파일을 다운로드합니다. 나중에 Serverless가 응용 프로그램을 만들 때 이 자격 증명이 필요합니다.

일반적으로 응용 프로그램을 배포한 후에이 사용자의 권한을 취소하지만, 나는 본능적으로 겁쟁이입니다. 그러나 응용 프로그램을 배포한 후까지 기다리겠습니다.

<div class="content-ad"></div>

## OpenAI API 키 얻기

platform.openai.com으로 가서 새 계정을 만들거나 로그인하세요. 'API 키'로 이동하세요.

새 API 키를 받아 안전한 곳에 저장하세요.

이 어플리케이션에 필요한 유일한 비용은 토큰이나 직불 카드를 추가해야 한다는 것입니다. 하지만 대부분의 사용자들이 이미 계정을 가지고 있을 것이라고 생각합니다.

<div class="content-ad"></div>

## 로컬 환경 설정

이 작업을 위해 NodeJS, npm 및 Python이 설치되어 있는지 확인하세요.

터미널에서 node -v 및 npm -v를 실행하여 Node.js 및 npm이 설치되어 있는지 확인할 수 있습니다. 그렇지 않은 경우 Node.js를 설치해야 합니다 (npm은 Node.js와 함께 제공됩니다). Node.js와 npm을 설치하려면 Node.js 웹사이트를 방문하여 설치 프로그램을 로컬로 다운로드하세요.

또한 Python이 설치되어 있는지 및 해당 버전을 확인하세요.

<div class="content-ad"></div>

```js
python --version
```

이 명령을 실행하면 'Python 3.11.5.'가 반환됩니다.

만약 다른 버전을 가지고 있다면, serverless.yml 파일에서 런타임을 업그레이드하거나 변경해주세요.

```yaml
provider:
  name: aws
  runtime: python3.11
```

<div class="content-ad"></div>

내 노트북에는 Docker도 설치되어 있습니다. Docker가 실행 중이 아니라면 종속 항목을 Docker와 함께 패키징하도록 serverless.yml 파일을 false로 변경하십시오.

```js
custom: pythonRequirements: dockerizePip: false;
```

우리가 Docker를 사용할 필요가 없다고 생각하기 때문에 이 부분은 생략해도 문제가 되지 않습니다.

모든 것이 올바르게 설정되었다고 확신이 드시면 새 폴더를 로컬로 설정하는 방법으로 계속 진행할 수 있습니다.

<div class="content-ad"></div>

```js
mkdir tech-bot
cd tech-bot
```

서버리스 프레임워크를 전역으로 설치했는지 확인해주세요.

```js
npm install -g serverless
```

그런 다음 다음과 같이 작업할 리포지토리를 복제해주세요.

<div class="content-ad"></div>

```js
git clone https://github.com/ilsilfverskiold/ai-tech-news-bot.git
cd ai-tech-news-bot
```

가상 환경을 설정하고 활성화하세요.

```js
python -m venv venv
source venv/bin/activate  # Windows에서는 `venv\Scripts\activate`
```

의존성을 설치할 수 있도록 서버리스 플러그인을 설치해주세요.

<div class="content-ad"></div>

```js
serverless plugin install -n serverless-python-requirements
```

requirements.txt 파일에 저장된 필수 종속성을 설치하세요.

```js
pip install -r requirements.txt
```

마지막으로, AWS에서 IAM 사용자를 생성할 때 다운로드한 AWS 자격 증명을 추가해야 합니다.

<div class="content-ad"></div>

다음과 같이 설정해주세요.

```js
serverless config credentials --provider aws --key YOUR_AWS_ACCESS_KEY --secret YOUR_AWS_SECRET_KEY
```

이렇게 하면 AWS에 우리 애플리케이션을 배포할 수 있게 될 거에요.

## API 테스트

<div class="content-ad"></div>

이 LLM에 곧 넣을 데이터를 테스트해봅시다. 어떤 결과를 얻는지 확인해보세요.

브라우저에서 아래 내용을 검색 창에 붙여넣어보세요.

```js
https://www.safron.io/api/table?period=daily&sort=trending
```

우리가 받게 될 결과는 이런 식일 겁니다.

<div class="content-ad"></div>

```json
{
update_date: "2024-02-19",
rows: 2983,
results: [
  {
    keyword: "AWS",
    date: "2024-02-19T00:00:00.000Z",
    count: 72,
    category: "Platforms & Search Engines",
    row_ids: [],
    sentiment: {},
    yesterday_count: 34,
    sentiment_previous: {},
    countChange: 111.76470588235294,
    trending: true
  },
  {
    keyword: "Security",
    date: "2024-02-19T00:00:00.000Z",
    count: 40,
    category: "Subjects",
    row_ids: [],
    sentiment: {},
    yesterday_count: 27,
    sentiment_previous: {},
    countChange: 48.148148148148145,
    trending: true
  }
  ...
]
```

여기서 보면, 이제 'trending'인지, 특정 키워드인지 또는 특정 카테고리에 속하는지에 따라 객체를 프로그래밍적으로 필터링할 수 있습니다.

필터링한 후에는 소스 엔드포인트의 row_ids를 사용하여 이러한 키워드에 대한 소스를 가져올 수 있습니다.

```json
https://safron.io/api/sources
```

<div class="content-ad"></div>

이 엔드포인트는 POST 요청을 필요로 합니다. Postman을 사용하여 이를 테스트할 것입니다.

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_7.png)

소스 엔드포인트에는 JSON 본문에 'keywords' 또는 'ids'를 전달할 수 있습니다. 여기서는 'ids'를 사용하고 있습니다. 이 'ids'는 테이블 엔드포인트의 row_ids에서 얻을 수 있습니다. 애플리케이션에서도 이것을 수행할 것입니다.

먼저 특정 키워드의 row_ids를 가져오기 위해 테이블 API를 쿼리하고, 그런 다음 이러한 'ids'를 다른 요청에 사용하여 소스/search 엔드포인트로 이동하여 올바른 소스와 URL을 얻어올 것입니다.

<div class="content-ad"></div>

걱정 마세요, 이를 위해 코드를 설정할 필요는 없지만 이게 어떻게 작동하는지 알려드릴게요.

## 선호도 설정 및 개인화하기

클론한 저장소의 코드를 로컬에서 열어주세요. 보통 저는 이를 간단한 바로 가기 단축키를 사용해서 VSCode에서 합니다.

```js
.code
```

<div class="content-ad"></div>

해당 단축키를 설정해야 하므로, 편리하다면 코드 디렉토리를 직접 선택하여 원하는 코드 편집기에서 엽니다.

설정을 구성하려면 config.py로 이동하세요.

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_8.png)

여기에서 세 가지 선택 사항이 있습니다:

<div class="content-ad"></div>

- 발견된 트렌딩 키워드에 대한 카테고리 제한을 설정할 수 있어요.
- 관심 키워드를 설정할 수 있어요. 이러한 키워드들은 트렌딩 여부와 상관없이 항상 발견 대상이 되어야 해요.
- 각 카테고리 내의 키워드 수와 함께 발견할 카테고리를 설정할 수 있어요.

여기서 좀 더 시도해보거나 그대로 둬도 돼요. 임시 프론트엔드가 준비돼 있어서 다른 키워드를 발견하고 무엇이 있는지 확인할 수 있어요.

## 이메일 알림을 위한 AWS SES 설정하기

LLM이 생성한 이메일도 보내야 해요.

<div class="content-ad"></div>

"이미 generate_html_report 함수를 위한 email 템플릿을 helper_functions.py에 설정해 두었어요.

코드 베이스로 이동해서 generate_html 함수를 찾아 이메일 레이아웃을 조정할 수 있어요. 이건 선택 사항이에요.

<img src="/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_9.png" />

만약 괜찮다면, 이 부분은 넘어가도 돼요."

<div class="content-ad"></div>

가장 중요한 것은 AWS SES에서 확인된 원본 주소를 설정하는 것입니다.

그래서 AWS 콘솔로 돌아가주세요. Simple Email Service를 찾으세요.

이메일을 보낼 수 있는 이메일 주소를 추가해야 합니다. 그리고 해당 이메일 주소로 이메일을 보내기 전에 확인을 받아야 합니다.

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_10.png)

<div class="content-ad"></div>

이메일 뉴스레터를 받고 싶은 이메일 주소를 식별하기 위한 식별자를 만들어보세요. safron.io라는 도메인을 가지고 있기 때문에 그것을 발신지로 사용했지만, 개인 이메일 주소를 사용해야 합니다.

config.py 파일 아래 코드에서 올바른 지역, 수신 및 발신 주소를 설정하는 것도 잊지 마세요.

![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_11.png)

로컬에서 테스트하기 전에 마지막으로 IAM 사용자에게 SES 액세스 권한도 부여해야 합니다.

<div class="content-ad"></div>

이제 이 작업을 수행하기 위해 IAM으로 돌아가서 이전에 생성한 사용자를 찾아서 권한 추가를 클릭한 후 AmazonSESFullAccess를 찾아 IAM 사용자에 추가하면 됩니다.

![image](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_12.png)

이제 응용 프로그램은 이메일을 보낼 수 있게 됩니다.

만약 "저는 무작위 사람들에게도 이 이메일을 보내고 싶어요!"라고 생각하신다면 도메인 이름과 AWS로부터 샌드박스 환경을 벗어나기 위한 확인이 필요합니다. 이는 조금 복잡한 과정일 수 있습니다.

<div class="content-ad"></div>

기술적으로 여기에 Slack, Whatsapp를 사용하거나 그 경우에는 MailChimp를 설정할 수도 있습니다.

## AWS에 배포

마지막 단계는 이를 테스트하고 AWS에 푸시하는 것입니다.

저는 개인적으로 먼저 로컬에서 시도해보겠습니다. 뉴스레터 템플릿을 조금 개선하고 뉴스레터가 어떻게 보이는지 확인하고 싶을 수도 있습니다.

<div class="content-ad"></div>

터미널에서 다음을 실행하세요.

```js
serverless invoke local --function newsletterTrigger
```

로컬에서 실행하면 어떻게 되어야 할까요? 아래에서 제 코드를 확인해보세요.

<img src="https://miro.medium.com/v2/resize:fit:1400/1*fhNnFNqkI4IGIntv2_nP9Q.gif" />

<div class="content-ad"></div>

이메일이 발신된 후 어떻게 될까요? 이메일 받은 편지함에는 다음과 같은 내용이 표시됩니다.


![이미지](/assets/img/2024-05-27-BuildaPersonalAITechNewsAgent_13.png)


사용자 설정, 시스템 템플릿, 그리고 LLM 선택에 따라 달라질 수 있어요.

이미 serverless.yml 파일에 EventBridge 일정을 설정했기 때문에, 평일에 10시(UTC)에 트리거됩니다. 보고서를 발송할 시간을 변경하고 싶다면 그렇게 할 수 있습니다.

<div class="content-ad"></div>

행복하다면, AWS로 푸시하세요.

```js
serverless deploy
```

## 완료 결과

이제 매일 오전 10시 UTC에 자동으로 실행되는 개인 기술 뉴스레터가 있습니다. 그리고 주간 뉴스레터는 매주 금요일에 실행됩니다. 특히 관심 있는 내용을 기반으로 작동해야 합니다.

<div class="content-ad"></div>

## 몇 가지 메모

일주일에 한 번만 스카우트하고 싶을 키워드와 매일 스카우트하고 싶을 키워드가 있을 것 같아요. 'AI'는 매일 검색하는 것이 좋은데, 데이터 소스가 많기 때문이에요. 반면 'Mistral'과 같은 소스가 적은 키워드를 확인할 때는 6일 동안 데이터를 수집하는 것이 더 좋아요. 이렇게 하면 데이터를 요약하기에 더 많은 정보를 얻을 수 있어요.

LLMs는 맥락 창이 매우 짧기 때문에 키워드 당 최대 150개의 소스와 요약 정보만 처리할 수 있어요.

그랬던가요?

<div class="content-ad"></div>

멋진 프로젝트네요! 제가 원하는 것을 제공해줘서 좋지만, 아직 진행 중인 프로젝트이죠.

다음에는 무엇이 있을까요?

이 데이터에 더 많은 ML 프로세스를 적용하여 보다 나은 추세 지표를 얻는 것이 흥미로울 수 있을 것 같아요. 현재 사용 중인 알고리즘이 조금 불안정하기 때문에 그 부분을 개선하는 것도 흥미로울 수 있겠죠. 또한, 검색하는 키워드를 기반으로 보고서를 받기 위해 더 나은 UI를 만드는 것도 흥미로울 것 같아요.

게다가, 테크 분야 외부의 데이터를 더 넣어주면, 다양한 분야에서 사람들이 무엇에 대해 이야기하는지 이해할 수도 있을 거예요.

<div class="content-ad"></div>

알겠어요.

유용한 기술 봇을 설정했거나 상상력을 자극했기를 바랍니다.

❤
