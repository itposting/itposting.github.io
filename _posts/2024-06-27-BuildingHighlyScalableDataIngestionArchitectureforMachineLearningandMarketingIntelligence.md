---
title: "머신러닝 및 마케팅 인텔리전스를 위한 고도로 확장 가능한 데이터 수집 아키텍처 구축 방법"
description: ""
coverImage: "/assets/img/2024-06-27-BuildingHighlyScalableDataIngestionArchitectureforMachineLearningandMarketingIntelligence_0.png"
date: 2024-06-27 18:44
ogImage: 
  url: /assets/img/2024-06-27-BuildingHighlyScalableDataIngestionArchitectureforMachineLearningandMarketingIntelligence_0.png
tag: Tech
originalTitle: "Building Highly Scalable Data Ingestion Architecture for Machine Learning and Marketing Intelligence"
link: "https://medium.com/decodingml/building-highly-scalable-data-ingestion-architecture-for-machine-learning-and-marketing-c65ad39f44fc"
---


## 확장 가능하고 적응 가능한 데이터 파이프라인을 위한 AWS 생태계 및 데이터 크롤링 활용

데이터가 없는 머신 러닝은 재료 없는 요리사와 같습니다. 모든 기술은 있지만 요리할 재료가 없죠.

요즘은 모든 것이 데이터를 중심으로 돌아갑니다. 온라인에서 보는 맞춤형 광고부터 스트리밍 서비스의 추천까지 모든 것이 데이터에 의해 이끌립니다. 데이터는 비즈니스, 의료 및 심지어 스포츠에서 의사 결정을 이끌고 있습니다. 데이터가 없다면 우리의 앱은 당혹해지고, 스마트 기기는 멍청해지며, 우리의 예측은 단순히 추측 이상의 것이 되지 못할 것입니다. 디지털 시대에 있어서 데이터는 그저 새로운 석유가 아니라 혁신과 효율성의 생명수입니다.

좋아요, 하지만 왜 또 다른 데이터 수집에 관한 글을 써야 할까요?

<div class="content-ad"></div>

지금까지 새로 만들어진 많은 도구들 때문에, 최상의 도구를 선택하는 일이 어렵다는 것을 잘 알고 있습니다. 대부분의 경우, 가장 적합한 도구는 프로젝트의 특정 요구 사항에 따라 다릅니다.

이 기사에서는 특정 영역, 마케팅 인텔리전스를 위해 맞춤형으로 구축된 종단간 솔루션을 탐색해볼 것입니다. AWS의 통합된 서비스 생태계를 활용하여 고도로 확장 가능한 데이터 수집 파이프라인을 구축할 수 있으며, 이것을 사용하여 웹을 탐색하고 데이터를 수집하여 영업, 경쟁사 분석, 시장 분석, 고객 인사이트 등 다양한 분석 프로세스에 연결할 수 있습니다.

또한 이 솔루션 구축 과정에서 마주한 일련의 도전 과제를 소개하고 싶습니다. 대부분의 답변은 인터넷 상에 흩어져 있어 완벽한 작동 솔루션을 찾기가 어려울 수 있습니다... 전체 솔루션 코드는 GitHub에서 확인하실 수 있습니다.

중요 사항: 이 솔루션에 뛰어들기 전에, 소셜 미디어 페이지와 같은 일부 데이터 소스로부터 데이터를 수집하는 것의 법적 영향에 대해 인식해야 합니다. 무분별한 데이터 수집으로 인해 아무도 옥살이 가진 않도록 주의해야 합니다. 각 주요 플랫폼의 이용약관을 꼭 읽어보십시오; 이것들은 사용자 프로필과 비공개 페이지의 수집을 제한할 수 있습니다.

<div class="content-ad"></div>

# 목차

- 아키텍처 개요
- 구현
- 도전과 함정
- 로컬 테스트
- 배포

# 1. 아키텍처 개요

우리가 구축하려는 것입니다:

<div class="content-ad"></div>

다음은이 아키텍처로 달성하려고하는 일부 비기능 요구 사항입니다.

- 확장성: 이 솔루션을 최대한 많은 페이지를 동시에 처리하고 추가 페이지를 신경 쓰지 않고 추가할 수 있도록 하여 언제든지 시스템이 성장량을 처리할 수 있도록했습니다.
- 유지 보수 및 적응성:이 시스템의 각 구성 요소를 개발 시간을 많이 소비하지 않고 쉽게 변경하고 확장할 수 있도록 설계했습니다.

## 구성 요소 개요:

스케줄러: 이름에서도 알 수 있듯이 여러 역할을 수행하지만 가장 중요한 역할은 가지고있는 각 페이지 링크에 대해 크롤러 lambdas를 트리거하는 것입니다.

<div class="content-ad"></div>

크롤러: 이름만 봐도 목적이 명확하죠. '크롤링' 이 용어가 익숙하지 않다면, 계속 진행하기 전에 이 기사를 멈추고 한 번 살펴보세요. 이 구성 요소는 페이지 링크를 가져와 다양한 게시물 및 관련 정보를 추출하는 역할을 합니다. 구현 부분에서 자세한 내용이 소개될 거예요.

데이터베이스: 데이터 레이크 저장소 인스턴스에는 추후 사용할 게시물이 저장됩니다. 이를 위해 저는 MongoDB를 선택했어요. 대부분의 게시물은 구조화되지 않은 텍스트 데이터지만, 그 중에서도 유용한 정보를 추출할 수 있고 Mongo는 반구조화된 데이터를 처리하는 데 뛰어납니다.

그래서 당신의 솔루션의 전체 흐름을 표시하려면, 스케줄러가 각 페이지마다 크롤러 람다 인스턴스를 트리거하여 페이지 이름과 링크를 보냅니다. 크롤러는 지난 주에 발행된 게시물을 추출하고, 원시 콘텐츠와 게시물 생성 날짜, 링크 자체, 그리고 이름을 저장합니다. 이 멈추지 않아요. 플랫폼이 제공하는 내용에 따라 더 많은 정보를 추출할 수 있어요.

그런 다음 스케줄러는 모든 람다 인스턴스가 실행을 완료할 때까지 기다렸다가 데이터베이스에서 추출된 게시물을 집계하고, 일부 프롬프트 템플릿을 사용하여 게시물과 함께 이를 ChatGPT에 전송하여 몇 가지 보고서를 생성합니다.

<div class="content-ad"></div>

## 도구 및 라이브러리:

- Selenium: 웹 브라우저 자동화 도구입니다. 직접 사용한 적은 없지만 이 솔루션에 포함된 크롤링 라이브러리에서 사용됩니다.
- AWS Lambda: 뛰어난 동시성 능력을 제공해줍니다. 기본 할당량은 1000개의 동시 lambda 함수이며, 필요에 따라 수십만으로 증가할 수 있습니다.
- Eventbridge: 서버리스 이벤트 버스로 여러 애플리케이션을 AWS 생태계에서 연결할 수 있습니다. 저는 cron 규칙을 통해 스케줄러를 자동으로 트리거하는 데 사용했습니다.
- CloudWatch: 로그 모니터링과 알람 서비스로 사용됩니다.
- Instaloader: Instagram에서 메타데이터를 추출하기 위한 오픈 소스 도구입니다.
- Langchain: Large Language Models 주변에 애플리케이션을 만들 수 있게 해주는 강력한 프레임워크입니다.
- Pulumi: 인프라를 코드로 작성할 수 있게 해주는 도구로, 여러 언어로 인프라를 코드로 작성할 수 있습니다. Terraform과 CDK가 합쳐진 것으로 이해하시면 됩니다.

# 2. 구현

이 섹션에서는 주요 구성 요소에 대한 상세한 개요를 제공하고, 코드 샘플과 설명으로 내용을 분해해 드리겠습니다.

<div class="content-ad"></div>

## 2.1 스케줄러

이 문서에 공유된 모든 코드와 함께 여기에서 찾을 수 있는 보고 부분에 너무 많은 초점을 두지는 않겠습니다. 여기의 주요 역할은 스케줄링 부분이며, 전체 흐름이 시작되고 조절되는 시스템의 주요 진입점입니다:

```js
import json
import os
import time
from datetime import datetime, timedelta

import boto3
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext

from src.constants import PAGE_LINK
from src.db import database
from src.utils import monitor

logger = Logger(service="decodingml/scheduler")

_client = boto3.client("lambda")

def lambda_handler(event, context: LambdaContext):
    correlation_ids = []

    for link in PAGE_LINK:
        response = _client.invoke(
            FunctionName="lambda",
            InvocationType="Event",
            Payload=json.dumps({"link": link}),
        )
        logger.info(f"Triggered crawler for: {link}")

        correlation_ids.append(response["ResponseMetadata"]["RequestId"])

    logger.info(f"Monitoring: {len(correlation_ids)} crawler processes")

    while True:
        time.sleep(15)
        completed = monitor(correlation_ids)

        correlation_ids = [c for c in correlation_ids if c not in completed]

        if not correlation_ids:
            break

        logger.info(f"Still waiting for {len(correlation_ids)} crawlers to complete")

    now = datetime.now()
    posts = list(
        database.profiles.find(
            {
                "date": {"$gte": (now - timedelta(days=7)), "$lte": now},
            }
        )
    )

    logger.info(f"Gathered {len(posts)} posts")

    if not posts:
        logger.info("Cannot generate report, no new posts available")
        return

    reports = generate_profiles_report(posts)

    logger.info("Generated new report!")
```

보시다시피, 스케줄러는 산발자 역할을 합니다. 페이지 링크 목록을 반복하며 InvocationType 매개변수를 Event로 설정하여 크롤러를 비동기적으로 호출합니다. 이렇게 함으로써 스케줄러가 단일 페이지를 기다리기 위해 전체 프로세스를 차단하지 않도록 합니다.

<div class="content-ad"></div>

그럼, 각 람다의 상관 ID를 목록에 저장하고 모든 람다가 실행을 완료할 때까지 기다립니다. 저는 15초의 대기 시간을 정의했어요; 여러분이 크롤러가 작업을 완료하는 데 걸리는 평균 시간에 따라 조절하셔서 Cloudwatch를 그렇게 자주 호출하지 않도록 하세요.

마지막으로, 이 페이지에서 모든 크롤된 게시물을 찾아서 보고서 생성 단계로 보냅니다.

## 2.2 크롤러

여기서 실제 크롤링 프로세스를 세분화해서 설명할 거예요. 좋은 소프트웨어 관행이 적용되어 있어서 이를 쉽게 따라갈 수 있어요 [계속하기]


<div class="content-ad"></div>

```js
import abc
import os
from datetime import datetime, timedelta
from itertools import takewhile, dropwhile
from typing import List, Dict, Any

import instaloader

from src.crawlers.base import BaseAbstractCrawler

class BaseAbstractCrawler(abc.ABC):

    @abc.abstractmethod
    def extract(self, link: str, **kwargs) -> None: ...


class InstagramCrawler(BaseAbstractCrawler):

    def __init__(self, link: str, proxy=None):
        self.link = link
        self.loader = instaloader.Instaloader()
        self._until = datetime.now()
        self._since = self._until - timedelta(days=7)
        self._proxy = proxy

    def extract(self, **kwargs) -> List[Dict[str, str | Any]]:
        parsed_url = urlparse(self.link)

        if self._proxy:
            os.environ['https_proxy'] = self._proxy.__dict__().get('http')
        profile = instaloader.Profile.from_username(self.loader.context, parsed_url.path.strip('/').split('/')[0])
        posts = takewhile(lambda p: p.date > self._since, dropwhile(lambda p: p.date > self._until, profile.get_posts()))

        return [
            {'content': post.caption, 'date': post.date, 'link': self.link}
            for post in posts
        ]
```

여기에는 모든 유형의 크롤러를 위한 주요 추상화 지점을 정의했습니다. 모든 파생된 크롤러가 구현해야 하는 공통 인터페이스를 정의하고 모든 하위 클래스는 extract() 메서드에 대한 자체 구현을 제공해야 합니다. 따라서 새로운 크롤러를 작성해야 할 때마다 이 추상화에서 재사용성과 일관성을 많이 얻을 수 있습니다. 더 나아가, 그 아래에 나타나는 귀중한 이점을 제시하겠습니다:

```js
import re

from src.crawlers.base import BaseAbstractCrawler
from src.crawlers.instagram import InstagramCrawler


class CrawlerDispatcher:

    def __init__(self) -> None:
        self._crawlers = {}

    def register(self, domain: str, crawler: type[BaseAbstractCrawler]) -> None:
        self._crawlers[r"https://(www\.)?{}.com/*".format(re.escape(domain))] = crawler

    def get_crawler(self, url: str) -> BaseAbstractCrawler:
        for pattern, crawler in self._crawlers.items():
            if re.match(pattern, url):
                return crawler()
        else:
            raise ValueError("No crawler found for the provided link")


dispatcher = CrawlerDispatcher()
dispatcher.register('instagram', InstagramCrawler)
```

각 크롤러를 쉽게 홍보하고 자동으로 호출할 수 있도록 만들고 싶었습니다. 이 경우, 제공된 링크를 기반으로 올바른 크롤러 클래스를 선택하고 인스턴스화하는 역할을 하는 디스패처를 구축했습니다. 이는 실제로 크롤러에 대한 레지스트리 및 팩토리로 작동하며 우리가 이들을 위해 생성한 통일된 인터페이스와 구조 아래에서 이를 관리합니다. 이에는 특정한 이점이 있습니다. 여기서 소개하겠습니다:

<div class="content-ad"></div>

- 유연성 및 확장성: 이 구성 요소는 기존 코드베이스를 수정하지 않고 더 쉽게 추가할 수 있는 가능성을 제공합니다. 이를 통해 시스템을 쉽게 확장할 수 있어 더 많은 도메인과 특수 크롤러를 포함시키고자 하는 경우, 그냥 연결하고 작동시킬 수 있습니다.
- 캡슐화 및 모듈화: 디스패처는 링크에 기반한 어떤 크롤러를 사용할지 결정하는 로직을 캡슐화합니다. 이를 통해 시스템을 더 모듈식으로 만들고 각 크롤러가 핵심 비즈니스 로직에 집중할 수 있도록 패턴 매칭에 대해 걱정하지 않고 작동할 수 있습니다.

```python
from datetime import datetime, timedelta

from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext

from src.crawlers import dispatcher
from src.db import database

logger = Logger(service="decodingml/crawler")


def lambda_handler(event, context: LambdaContext):

    link = event.get('link')

    logger.info(f"{link}에 대한 포스트 추출 시작")

    crawler = dispatcher.get_crawler(event.get('link'))

    posts = [{**page, 'correlation_id': context.aws_request_id} for page in crawler.extract()]

    now = datetime.now()
    existing_posts = database.profiles.find({
        "date": {"$gte": (now - timedelta(days=7)), "$lte": now},
        "name": link
    }, projection={'date': 1})

    existing_posts = [post.get('date') for post in list(existing_posts)]

    posts = [post for post in posts if post.get('date') not in existing_posts]

    if not posts:
        logger.info("페이지에 새로운 포스트가 없습니다")
        return

    logger.info(f"{len(posts)}개의 포스트를 성공적으로 추출했습니다")
    database.profiles.insert_many(posts)
    logger.info("데이터를 성공적으로 데이터베이스에 추가했습니다")
```

여기서 이벤트 본문에서 링크를 가져와 올바른 크롤러를 선택하고 추출 작업을 시작하는 주요 진입점을 조립했습니다. 작업이 완료되면 데이터베이스에 이미 추가된 포스트가 있는지 확인하여 불필요한 중복을 추가하지 않도록하고, 그런 다음 포스트를 추가합니다.

# 3. 도전과 위험부분

<div class="content-ad"></div>

## 3.1 람다 런타임 환경에서 세레니움을 사용하여 무인 브라우저 인스턴스 실행하기

가장 열등함과 악몽을 주었던 부분이라고 생각합니다. 람다 실행 환경은 읽기 전용이기 때문에 디스크에 쓰기를 원하는 모든 작업은 일시적인 파일에 수행해야 합니다. 이는 이진 드라이버를 자동으로 설치하는 꿈을 망할 것입니다. 따라서 도커 이미지에서 직접 설치하고 Selenium의 드라이버 옵션에서 수동으로 참조해야 합니다. 이 설정에 사용할 수 있는 유일한 드라이버는 Google의 이진 드라이버였습니다.

```js
FROM  public.ecr.aws/lambda/python:3.11 as build

# 크롬 드라이버 및 브라우저를 다운로드하고 수동으로 해당 폴더에 풀기
RUN yum install -y unzip && \
    curl -Lo "/tmp/chromedriver-linux64.zip" "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/119.0.6045.105/linux64/chromedriver-linux64.zip" && \
    curl -Lo "/tmp/chrome-linux64.zip" "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/119.0.6045.105/linux64/chrome-linux64.zip" && \
    unzip /tmp/chromedriver-linux64.zip -d /opt/ && \
    unzip /tmp/chrome-linux64.zip -d /opt/

FROM  public.ecr.aws/lambda/python:3.11

# yum을 사용하여 함수의 OS 종속성 설치
RUN yum install -y \
    atk \
    cups-libs \
    gtk3 \
    libXcomposite \
    alsa-lib \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXrandr \
    libXScrnSaver \
    libXtst \
    pango \
    at-spi2-atk \
    libXt \
    xorg-x11-server-Xvfb \
    xorg-x11-xauth \
    dbus-glib \
    dbus-glib-devel \
    nss \
    mesa-libgbm \
    ffmpeg \
    libxext6 \
    libssl-dev \
    libcurl4-openssl-dev \
    libpq-dev

COPY --from=build /opt/chrome-linux64 /opt/chrome
COPY --from=build /opt/chromedriver-linux64 /opt/

COPY ./pyproject.toml ./poetry.lock ./

# Poetry 설치, 종속성을 requirements.txt로 내보내고 Lambda 작업 디렉토리에 종속성 설치, 최종적으로 manifest 파일 정리
RUN python3 -m pip install --upgrade pip && pip install poetry
RUN poetry export -f requirements.txt > requirements.txt && \
    pip3 install  --no-cache-dir -r requirements.txt --target "${LAMBDA_TASK_ROOT}" && \
    rm requirements.txt pyproject.toml poetry.lock

# 함수 코드 복사
COPY ./src ${LAMBDA_TASK_ROOT}/src
```

이 Dockerfile의 주요 아이디어는 Chrome 드라이버와 브라우저를 수동으로 다운로드하고 Selenium에서 액세스할 수 있는 위치에 푼 것입니다. 일반적으로는 이를 직접 수행했을 것입니다.

<div class="content-ad"></div>

람다 환경에서 필수적인 단계입니다. 모든 것이 읽기 전용이기 때문에 다음 코드 샘플에서 Selenium을 올바른 드라이버 및 브라우저 위치로 연결하는 방법을 보여드리겠습니다:

```js
from tempfile import mkdtemp

def init_driver(self):
    options = Options()
    # 드라이버 이진 파일 위치 수동으로 설정
    options.binary_location = '/opt/chrome/chrome'
    # 브라우저를 헤드리스 모드로 실행
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--single-process')
    options.add_argument('--window-size=1420,1080')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-popup-blocking')
    options.add_argument('--disable-notifications')
    options.add_argument('--disable-dev-tools')
    options.add_argument('--log-level=3')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument("--no-zygote")
    options.add_argument(f"--user-data-dir={mkdtemp()}")
    options.add_argument(f"--data-path={mkdtemp()}")
    options.add_argument(f"--disk-cache-dir={mkdtemp()}")
    options.add_argument('--remote-debugging-port=9222')

    self._driver = webdriver.Chrome(
        service=Service("/opt/chromedriver"),
        options=options,
    )
```

여기서 Dockerfile에 설치한 드라이버 및 브라우저 위치를 하드코딩했습니다.

일부 임시 디렉토리 위치로 몇 가지 폴더를 지정했음을 볼 수 있습니다. user-data-dir, disk-cache-dir 및 disk-cache-dir를 참조합니다. Selenium은 이러한 디렉토리를 자동으로 생성할 것이며, 람다의 디스크 제한으로 인해 수동으로 설정하지 않으면 오류가 발생할 수 있기 때문에 이러한 설정을 수동으로 지정하려고 합니다.

<div class="content-ad"></div>

## 3.2 빈 페이지를 집계합니다

첫 번째 모니터링 알고리즘은 꽤 기본적이었습니다. 각 람다 호출의 상관 ID를 루프로 돌며, 생성된 게시물을 데이터베이스에서 확인했습니다. 그런데 어떤 페이지에서는 내가 검색한 시간 범위 내에 새로운 게시물이 생성되지 않은 경우가 발생하여 알고리즘이 무한 루프에 빠졌습니다.

그 후 CloudWatch 로그를 활용하기 위한 아이디어를 떠올렸습니다: 

```js
import datetime
import re
from typing import List

import boto3

_client = boto3.client('logs')


def monitor(correlation_ids: List[str]):
    finished = []

    now = int((datetime.datetime.now() - datetime.timedelta(days=1)).timestamp() * 1000)

    response = _client.filter_log_events(
        logGroupName='/aws/lambda/crawler',
        startTime=now,
        filterPattern="REPORT RequestId"
    )

    for event in response['events']:
        match = re.search(r'REPORT RequestId: ([^\s]+)', event.get('message'))
        if match:
            correlation_id = match.group(1)
            if correlation_id in correlation_ids:
                finished.append(correlation_id)

    return finished
```

<div class="content-ad"></div>

현재 날짜에 생성된 각 람다의 모든 로그 스트림을 검색하고 일반적으로 다음 형식을 갖는 메시지를 찾습니다: REPORT RequestId: `correlation_id`. 이는 람다가 실행의 끝에 도달했음을 나타내며, 나는 어떤 correlation ID가 완료되었는지 표시할 수 있습니다.

## 3.3 소셜 미디어 플랫폼에서 차단되지 않도록 방지

이것은 안타까운 오류였습니다 - 여러 날을 썼을 가능성이 있는 종류의 오류였고, 해결책은 다른 관점에서 문제를 관찰하는 것이었습니다. 인기 있는 소셜 미디어 플랫폼은 크롤링을 방지하기 위해 다양한 안티-봇 보호 메커니즘을 구현합니다. 요청 헤더 분석부터 속도 제한, IP 차단까지 다양한 방법을 사용합니다.

그리고 현실적인 사용자-브라우저 상호작용을 모방하기 위해 브라우저를 헤드리스 모드로 실행하고 모든 크롤러가 동일한 IP 주소로 여러 페이지에 동시에 반복적으로 요청을 보내는 경우, 이는 '제발 차단해 주세요' 라고 소리칩니다.

<div class="content-ad"></div>

이 문제에 대처하려면 IP 주소 및 위치를 가리기 위해 프록시를 사용했습니다:

```js
import os


class ProxyConnection:

    def __init__(
        self,
        host: str = None,
        port: str = None,
        username: str = None,
        password: str = None,
        verify_ssl: bool = False
    ):
        self.host = host or os.getenv('PROXY_HOST')
        self.port = port or os.getenv('PROXY_PORT')
        self.username = username or os.getenv('PROXY_USERNAME')
        self.password = password or os.getenv('PROXY_PASSWORD')
        self.verify_ssl = verify_ssl
        self._url = f"{self.username}:{self.password}@{self.host}:{self.port}"

    def __dict__(self):
        return {
            'https': 'https://{}'.format(self._url.replace(" ", "")),
            'http': 'http://{}'.format(self._url.replace(" ", "")),
            'no_proxy': 'localhost, 127.0.0.1',
            'verify_ssl': self.verify_ssl
        }
```

좋은 프록시 솔루션이 많이 있습니다. 그러나 SmartProxy와 같은 유료 프록시를 추천해드릴게요. 이 솔루션은 회전하는 프록시 IP 풀을 제공하여 각 크롤러에 대해 다른 IP를 할당할 수 있습니다.

이렇게 하면 다른 위치에서 페이지에 액세스하려는 일반 사용자처럼 보일 것입니다.

<div class="content-ad"></div>

여기 한가지 주의할 점이 있어요: 많은 소셜 미디어 플랫폼은 로그인하지 않은 사용자들에게 심지어 공개 페이지에 접근을 제한하는 경우가 많아요. 그래서 프록시를 사용하여 이 제한이 없는 나라를 찾아 해당 국가의 IP 주소를 얻을 수 있어요.

# 4. 로컬 테스트

이 작업이 작동하는지 증명하기 위해, 크롤러와 람다에 대한 간단한 명령어를 포함한 메이크파일을 작성했어요. 문제는 크롤러만 로컬로 테스트했을 뿐이에요. 스케줄러는 크롤러를 활성화하기 때문에 이미 AWS에 배포되어 있어야 해요.

```js
로컬테스트-크롤러: # 람다를 테스트하기 위해 로컬에서 테스트 명령어를 전송해요
 curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"link": "https://www.instagram.com/mcdonalds"}'

로컬테스트-스케줄러: # 람다를 테스트하기 위해 로컬에서 테스트 명령어를 전송해요
 curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

<div class="content-ad"></div>

대부분의 사람들이 로컬 환경에서 람다 함수를 테스트할 때 AWS Lambda RIE (Runtime Interface Emulator)를 사용합니다. 이 도구는 람다 함수 패키지를 컨테이너에서 테스트할 수 있게 해줍니다. 기본적으로 로컬 머신에서 람다 실행 환경을 흉내냅니다. 제가 에뮬레이터를 사용하지 않고도 이것을 해낸 것을 보실 수 있습니다. 이것으로 제 환경이 약간 더 간편해졌습니다.

각 구성 요소를 테스트하기 위해 이 명령어를 사용할 수 있습니다. 예를 들어, 크롤러를 테스트하고 싶다면 터미널에 다음 명령어를 입력하세요:

```js
> make local-test-crawler
```

크롤링 프로세스가 시작되었음을 확인하실 수 있습니다. 이 페이지에서는 지난 일주일 동안 세 개의 새로운 포스트를 찾았습니다:

<div class="content-ad"></div>

# 5. 배포

배포 프로세스는 ops 폴더 아래의 GitHub 저장소에서 정의되어 있습니다. 여기서 Pulumi로 작성된 전체 솔루션을 살펴볼 수 있습니다.

Makefile을 활용할 수 있습니다. 인프라를 구축하고 실행하는 데 필요한 모든 명령어가 포함되어 있습니다.

# 결론

<div class="content-ad"></div>

이 기사에서는 여러 크롤 가능한 소스에서 기존 데이터를 활용하여 ML 트레이닝, 데이터 분석 등 다양한 프로세스를 위한 고도로 확장 가능한 데이터 수집 파이프라인을 구축하는 완전한 엔드 투 엔드 견고한 솔루션을 탐색했습니다.

이 프로세스에서 마주칠 수 있는 구체적인 도전 과제와 이를 극복하는 방법을 살펴보았습니다.

| 🔗 GitHub에서 코드를 확인하고 ⭐️로 지원해주세요

이 기사를 쓰는 데 즐거움을 느꼈듯이 여러분도 이 기사를 즐겨주셨으면 좋겠습니다. 만약 그렇다면...

<div class="content-ad"></div>

↓↓↓

7.5천 명 이상의 엔지니어와 함께  𝗗𝗲𝗰𝗼𝗱𝗶𝗻𝗴 𝗠𝗟 𝗡𝗲𝘄𝘀𝗹𝗲𝘁𝘁𝗲𝗿의 전투 검증된 콘텐츠를 경험해보세요. 매주 업데이트되는 내용들을 놓치지 마세요:

# 참고 자료

[1] 파이썬으로 웹 스크래핑: 닌자처럼 감지 피하기

<div class="content-ad"></div>

# 이미지

그 외 명시되지 않은 경우, 모든 이미지는 저자가 제작한 것입니다.