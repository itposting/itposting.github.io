---
title: "벡터 DB를 사용하여 실시간 뉴스 검색 엔진을 구축하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_0.png"
date: 2024-06-19 16:12
ogImage: 
  url: /assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_0.png
tag: Tech
originalTitle: "How to build a real-time News Search Engine using Vector DBs"
link: "https://medium.com/decodingml/how-to-build-a-real-time-news-search-engine-using-serverless-upstash-kafka-and-vector-db-6ba393e55024"
---


아파치 카프카, 바이트왁스, 그리고 업스태시 벡터 데이터베이스를 활용한 라이브 뉴스 집계 스트리밍 파이프라인 구현을 위한 실용적인 안내서입니다.

earthweb.com에서 실시한 연구에 따르면, 매일 온라인 및 오프라인에서 유입되는 뉴스 기사는 200-300만 건 사이에 있다고 합니다!

모든 방향에서 우리에게 쏟아지는 뉴스로 인해 정신없을 때가 많습니다. 그래서 우리는 실제로 관심 있는 뉴스를 빠르게 받아볼 수 있는 짧고 빠른 방법을 찾고 있습니다.

본 문서에서는 이러한 문제를 해결하고자 합니다! 좀 더 구체적으로, 여러 출처로부터 데이터를 수집하고 해당 정보 채널을 당신의 관심사에 맞는 종단점으로 좁힐 수 있는 시스템을 구축할 것입니다 — 뉴스 검색 엔진입니다!

<div class="content-ad"></div>

이론에 대해서만 이야기하거나 이러한 시스템을 구현하는 방법을 알려주는 것이 아니라, 우리는 단계별로 설명하고 보여줄 거예요!

시작하기 전에, 이 기사에서 제공하는 모든 것은 Decoding ML Articles GitHub 저장소에서 완전한 코드 지원을 받습니다.

# 목차

- 아키텍처 개요
- 도구 고려 사항
- 전제 조건
3.1 새로운 Upstash Kafka 클러스터 생성
3.2 새로운 Upstash Vector 인덱스 생성
3.3 2개의 라이브 뉴스 API에 등록
3.4 설치
- 데이터 수집
4.1 기사 가져오기 관리자
4.2 Kafka 메시지 제작
4.3 Pydantic을 사용한 데이터 교환 모델
4.4 KafkaProducers 실행
- 수집 파이프라인
5.1 Kafka에서 메시지 수신
5.2 Bytewax 데이터플로 구현
5.3 기사 정제, 형식 지정, 청크화, 삽입
5.4 벡터 작성 및 VectorDB에 업서트
- 파이프라인 시작
- 사용자 인터페이스
- 결론
- 참고문헌

<div class="content-ad"></div>

# 아키텍처 개요

![이미지](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_0.png)

요약하자면, 우리는 뉴스 API에서 뉴스 기사를 가져와서 생생한 시스템을 구축할 것입니다. 가져온 데이터를 정의된 형식으로 파싱하고 포맷팅한 다음 첫 번째 단계로 Kafka 토픽에 메시지를 직렬화하고 스트리밍할 것입니다. 
두 번째 단계에서는 Bytewax를 사용하여 Kafka 토픽에서 메시지를 더 청소, 파싱, 청크, 임베드, 벡터를 업서팅하여 벡터 데이터베이스로 보내고, 데이터베이스와 상호 작용할 수 있는 UI로 마무리됩니다.

# 툴 고려 사항

<div class="content-ad"></div>

올바른 도구를 선택하는 것이 고성능, 확장성, 및 구현 용이성을 달성하는 핵심이었습니다. 프로젝트 전체에서 사용된 도구를 살펴보겠습니다:

- Upstash Serverless Kafka: 인프라 관리에 대해 걱정할 필요 없이 강력하고 확장 가능한 이벤트 스트리밍을 위해 사용됩니다.
- Python 스레딩: 여러 뉴스 API에서 동시에 데이터를 가져오면서 스레드 안전한 Kafka Producer 인스턴스를 공유하여 메모리 풋프린트와 성능을 최적화합니다.
- Pydantic 모델: 일관된 및 유효한 데이터 교환 구조를 보장하기 위해 사용됩니다.
- Bytewax: 스트리밍 데이터를 처리하고 변환하는 데 간편하고 빠른 속도를 제공하기 때문에 사용됩니다.
- Upstash Vector Database: Serverless로 구성이 쉽고 Python, JS, 및 GO 내에서 쉽게 통합됩니다. UI 콘솔 대시보드에서 풍부한 탐색 옵션과 실시간 상태 메트릭을 제공하는 것이 큰 장점입니다.

하드웨어 요구 사항에 따르면 GPU는 필요하지 않습니다.

비용은 얼마입니까? — 무료입니다.
이 안내서는 무료 티어 플랜만 사용하도록 설정했으므로 사용한 플랫폼에 대해 지불할 필요가 없습니다!

<div class="content-ad"></div>

# 준비 사항

어떠한 구현을 하기 전에, 각 서비스에 접근할 수 있는지 확인해야 합니다. 따라서 다음을 설정해야 합니다:

- 새로운 Upstash Kafka 클러스터
- 새로운 Upstash Vector Index
- 뉴스 API 등록
- 환경 설치

처음 시작할 때는 약 5분 정도 걸립니다. 함께 해보세요!

<div class="content-ad"></div>

## 새로운 Upstash Kafka 클러스터 생성

먼저 Upstash에 등록해야 합니다. 로그인 후에 다음과 같은 대시보드가 나타납니다:

![대시보드 이미지](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_1.png)

다음으로 상단 바에서 Kafka를 선택하고 + 클러스터 생성 버튼을 클릭하여 새 클러스터를 만들어야 합니다. 클릭하면 다음 모달이 나타납니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_2.png" />

클러스터에 이름을 지정하고 본인의 위치와 가장 가까운 지역을 선택한 후, 클러스터 생성을 클릭하여 완료하세요. 완료되면 새로운 Kafka 클러스터가 아래에 표시됩니다. 새로운 Kafka 클러스터를 선택하고 아래 화면으로 이동하게 됩니다:

<img src="/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_3.png" />

이 뷰에서 주요 구성 요소를 살펴보겠습니다:

<div class="content-ad"></div>

- 상세 정보: 클러스터 개요 및 Upstash가 제공하는 기능을 보여줍니다.
- 사용량: 생성/소비된 메시지 수, 비용 영향 등을 보여주는 차트입니다.
- 주제: 이 탭에서는 Kafka 주제를 만들고 세부 정보를 모니터링할 수 있습니다.

클러스터를 생성한 다음 해야 할 다음 단계는 메시지를 생성(보내기)하고 소비(받기)할 수 있는 주제를 정의하는 것입니다.

주제 탭 아래에서 "주제 생성"을 선택하면 다음과 같은 화면이 나타납니다:

<img src="/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_4.png" />

<div class="content-ad"></div>

주제 이름을 지정하고, 나머지는 기본 상태로 두어서 Create를 클릭하세요.

카프카 클러스터를 성공적으로 생성했습니다. 이제 클러스터에 연결하는 데 도움이 되는 환경 변수를 복사하고 설정해야 합니다. 이를 위해 클러스터 대시보드로 이동하여 세부 정보 탭에서 엔드포인트, 사용자 이름 및 비밀번호를 복사하여 .env 파일에 붙여넣으세요.
그 후, Topics로 이동하여 카프카 토픽 이름을 복사하세요.

지금까지 .env 파일이어야 하는 모습은 다음과 같습니다:

```js
UPSTASH_KAFKA_UNAME="[사용자 이름]"
UPSTASH_KAFKA_PASS="[비밀번호]"
UPSTASH_KAFKA_ENDPOINT="[엔드포인트]"
UPSTASH_KAFKA_TOPIC="[토픽 이름]"
```

<div class="content-ad"></div>

## 새 Upstash Vector 색인 만들기

이제 새로운 Vector 데이터베이스를 만들어 보겠습니다. 이를 위해 대시보드에서 Vector를 선택하고 + Index 작성을 클릭하세요. 그러면 다음 뷰로 이동됩니다:

![이미지](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_5.png)

벡터 데이터베이스에 이름을 할당하고, 위치에 가장 가까운 지역을 선택한 다음 Embedding을 생성할 때 사용할 모델로 sentence-transformers/all-MiniLM-L6-v2을 선택하세요. 뉴스 기사의 임베딩을 생성할 때 사용할 모델과 벡터 간 거리 비교에 코사인 유사도 메트릭을 사용할 것입니다.

<div class="content-ad"></div>

새로운 Vector Index를 만든 후에는 Kafka Cluster와 동일한 작업 흐름을 따를 수 있습니다. Index Name, Endpoint, Token을 복사하고 .env 파일에 붙여넣기하세요.

현재 .env 파일은 다음과 같이 보여야 합니다:

```js
UPSTASH_KAFKA_UNAME="[여기에 사용자명 입력]"
UPSTASH_KAFKA_PASS="[여기에 비밀번호 입력]"
UPSTASH_KAFKA_ENDPOINT="[여기에 엔드포인트 입력]"
UPSTASH_KAFKA_TOPIC="[여기에 토픽 이름 입력]"

UPSTASH_VECTOR_ENDPOINT="[Vector 엔드포인트 입력]"
UPSTASH_VECTOR_TOPIC="[Vector 이름 입력]"
UPSTASH_VECTOR_KEY="[Vector 토큰 입력]"
``` 

## 뉴스 API에 등록하기

<div class="content-ad"></div>

다음 APIs를 사용하여 기사를 가져올 예정입니다:

- 🔗 NewsAPI

하루에 100번의 API 호출을 할 수 있는 무료 개발자 플랜을 제공합니다.

2. 🔗 NewsData

<div class="content-ad"></div>

무료 요금제가 제공되며 하루에 200개의 크레딧을 받습니다. 각 크레딧은 10개의 기사와 동일하며, 이는 하루에 총 2000개의 기사를 가져올 수 있다는 것을 의미합니다.

저희 현재의 사용 사례에는 이 API들이 충분한 기능을 제공하여 구축 중인 뉴스 검색 엔진을 구현하고 유효성을 검사할 수 있습니다. 동시에 기존 워크플로우가 동일하게 유지되므로 개선 및 확장할 여지도 남겨두고 있습니다.
무료 요금제에 따른 유일한 제약은 타임드-배치 페치를 수행할 수 없다는 것입니다. 즉, 이 API들을 쿼리할 때 from_date, to_date를 사용할 수 없습니다. 하지만 이는 문제가 되지 않습니다.
대신 페치 호출 간의 대기 시간을 이용하여 이 동작을 모방할 예정입니다.

다음 단계는 두 플랫폼에 등록하는 것입니다 — 걱정 마세요, 가능한 간단합니다.

- NewsAPI에 등록한 후, /account로 이동하여 API_KEY 필드를 확인한 후 이를 .env 파일의 NEWSAPI_KEY에 복사하여 붙여넣으십시오.
- NewsData에 등록한 후, /api-key로 이동하여 API KEY를 확인한 후 이를 .env 파일의 NEWSDATAIO_KEY에 복사하여 붙여넣으십시오.

<div class="content-ad"></div>

지루한 부분은 끝났습니다. 이제 이러한 API에 액세스할 수 있고, 기사를 가져올 수 있습니다. 각 API에서 페이로드가 어떻게 보이는지 살펴봅시다:

![image](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_6.png)

## 사전 준비 조치 요약

Kafka 클러스터를 생성하고, 벡터 인덱스를 생성하고, 뉴스 API에 등록하는 이 3단계를 모두 마친 후에 .env 파일은 다음과 같은 모습이어야 합니다:

<div class="content-ad"></div>

```js
UPSTASH_KAFKA_UNAME="[여기에 사용자 이름 입력]"
UPSTASH_KAFKA_PASS="[여기에 암호 입력]"
UPSTASH_KAFKA_ENDPOINT="[여기에 엔드포인트 입력]"
UPSTASH_KAFKA_TOPIC="[토픽 이름 입력]"

UPSTASH_VECTOR_ENDPOINT="[벡터 엔드포인트 입력]"
UPSTASH_VECTOR_TOPIC="[벡터 이름 입력]"
UPSTASH_VECTOR_KEY="[벡터 토큰 입력]"

NEWSAPI_KEY="[NEWSAPI 키 입력]"
NEWSDATAIO_KEY="[NEWSDATA 키 입력]"
NEWS_TOPIC = "news" # 이것은 가져올 기사의 카테고리입니다

다음 단계는 구현 세부 정보에 들어가기 전에 환경과 필수 패키지를 설치하는 것입니다.
다음은 Makefile 설치 단계의 모습입니다:

# Makefile
...
install:
 @echo "$(GREEN) [CONDA] [$(ENV_NAME)] 파이썬 환경 생성 $(RESET)"
 conda create --name $(ENV_NAME) python=3.9 -y
 @echo "환경 활성화 중..."
 @bash -c "source $$(conda info --base)/etc/profile.d/conda.sh && conda activate $(ENV_NAME) \
   && pip install poetry \
   poetry env use $(which python)"
 @echo "패키지 설치 중"
 @echo "pyproject.toml 위치로 변경 중..."
 @bash -c " PYTHON_KEYRING_BACKEND=keyring.backends.fail.Keyring poetry install"
...

환경을 준비하려면 make install을 실행하세요.

<div class="content-ad"></div>

이제 이 소스로부터 기사를 가져오는 핸들러 구현을 조사해 봅시다.

# 데이터 수집

이 모듈의 목적은 두 API를 쿼리하는 기능을 캡슐화하고, 페이로드를 구문 분석하여 두 페이로드에 모두 존재하는 속성을 사용하여 공통 문서 형식으로 포매팅하고, 클러스터로 메시지를 보내기 위해 공유 KafkaProducer 인스턴스를 사용하는 것입니다.

자세히 살펴볼 내용은 다음 하위 모듈들입니다:

<div class="content-ad"></div>

- Articles Fetching Manager Class
- 카프카 클러스터로 메시지를 보내는 방법
- Pydantic 데이터 모델
- 파이프라인 실행

## Articles Fetching Manager Class

구현 내용에 대해 알아보겠습니다:

import datetime
import functools
import logging
from typing import Callable, Dict, List

from newsapi import NewsApiClient
from newsdataapi import NewsDataApiClient
from pydantic import ValidationError

from models import NewsAPIModel, NewsDataIOModel
from settings import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def handle_article_fetching(func: Callable) -> Callable:
    """
    뉴스 기사 가져오기 기능에 대한 예외 처리를 담당하는 데코레이터입니다.

    이 데코레이터는 기사 가져오기 기능을 감싸서 발생하는 예외를 catch하고 로깅합니다.
    오류가 발생하면 오류를 기록하고 빈 목록을 반환합니다.

    Args:
        func (Callable): 감쌀 기사 가져오기 함수.

    Returns:
        Callable: 감싼 함수.
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            logger.error(f"기사 처리 중 유효성 검사 오류 발생: {e}")
        except Exception as e:
            logger.error(f"소스로부터 데이터를 가져오는 도중 오류 발생: {e}")
            logger.exception(e)
        return []

    return wrapper

class NewsFetcher:
    """
    다양한 API에서 뉴스 기사를 가져오는 클래스입니다.

    속성:
        _newsapi (NewsApiClient): NewsAPI 클라이언트.
        _newsdataapi (NewsDataApiClient): NewsDataAPI 클라이언트.

    메서드:
        fetch_from_newsapi(): NewsAPI로부터 기사 가져오기.
        fetch_from_newsdataapi(): NewsDataAPI로부터 기사 가져오기.
        sources: 호출 가능한 가져오기 함수 목록을 반환합니다.
    """

    def __init__(self):
        self._newsapi = NewsApiClient(api_key=settings.NEWSAPI_KEY)
        self._newsdataapi = NewsDataApiClient(apikey=settings.NEWSDATAIO_KEY)

    @handle_article_fetching
    def fetch_from_newsapi(self) -> List[Dict]:
        """NewsAPI에서 상위 뉴스 가져오기."""
        response = self._newsapi.get_everything(
            q=settings.NEWS_TOPIC,
            language="en",
            page=settings.ARTICLES_BATCH_SIZE,
            page_size=settings.ARTICLES_BATCH_SIZE,
        )
        return [
            NewsAPIModel(**article).to_common()
            for article in response.get("articles", [])
        ]

    @handle_article_fetching
    def fetch_from_newsdataapi(self) -> List[Dict]:
        """NewsDataAPI에서 뉴스 데이터 가져오기."""
        response = self._newsdataapi.news_api(
            q=settings.NEWS_TOPIC,
            language="en",
            size=settings.ARTICLES_BATCH_SIZE,
        )
        return [
            NewsDataIOModel(**article).to_common()
            for article in response.get("results", [])
        ]

    @property
    def sources(self) -> List[callable]:
        """뉴스 가져오기 함수 목록입니다."""
        return [self.fetch_from_newsapi, self.fetch_from_newsdataapi]

<div class="content-ad"></div>

이 구현에서 고려해야 할 몇 가지 중요 사항이 있습니다:

- NewsAPIModel과 NewsDataIOModel은 특정 페이로드 형식에 익숙한 Pydantic 모델입니다.
- 우리는 handle_article_fetching 데코레이터를 사용하여 원시 페이로드를 Pydantic 모델로 변환할 때 유효성 오류나 더 넓은 예외를 잡습니다.
- 우리에게는 API를 쿼리하는 callable 메서드를 반환하는 sources라는 속성이 있습니다. 이것은 데이터 수집 모듈 내에서 사용될 것이며 멀티 프로듀서 스레드를 생성하여 Kafka 클러스터로 메시지를 전송합니다. 다음에 이어서 설명하겠습니다.

## Kafka 메시지 생성

다음에 우리가 구현할 작업 흐름입니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_7.png" />

여기서 중요한 포인트들입니다:

- API에서 가져오는 작업에 별도 스레드를 사용합니다.
- 메시지를 보내기 위해 공통 카프카 프로듀서 인스턴스를 공유합니다.
- 데이터 교환을 보증하기 위해 Pydantic 모델을 사용합니다.

기사를 가져오는 데 별도 스레드를 사용하고, 클러스터로 메시지를 보내기 위해 단일 카프카 프로듀서 인스턴스를 사용하는 것이 우리의 사용 사례에서 권장되는 방법입니다. 그 이유는 다음과 같습니다:

<div class="content-ad"></div>

- 효율성 및 성능: KafkaProducer는 스레드 안전합니다. 새 인스턴스를 만드는 것은 네트워크 연결과 일부 설정이 필요합니다. 여러 스레드 간에 하나의 단일 인스턴스를 공유하면 이러한 작업과 관련된 오버헤드를 줄일 수 있습니다.
- 처리량: 단일 프로듀서 인스턴스는 메시지를 Kafka 클러스터로 보내기 전에 메시지를 일괄 처리합니다.
- 자원: 사용 사례에 완전히 적용되지는 않지만, 우리는 오직 2개의 프로듀서 스레드만 가지고 있기 때문에 인스턴스 수를 제한함으로써 시스템 자원 이용률을 최적화할 수 있습니다.

여기 Kafka로 메시지 처리를 담당하는 주요 기능이 있습니다:

def run(self) -> NoReturn:
        """지속적으로 Kafka 주제로 메시지를 가져와 보냅니다."""
        while self.running.is_set():
            try:
                messages: List[CommonDocument] = self.fetch_function()
                if messages:
                    messages = [msg.to_kafka_payload() for msg in messages]
                    self.producer.send(self.topic, value=messages)
                    self.producer.flush()
                logger.info(
                    f"프로듀서 : {self.producer_id}이(가) {len(messages)}개의 메시지를 전송함."
                )
                time.sleep(self.wait_window_sec)
            except Exception as e:
                logger.error(f"프로듀서 작업자 {self.producer_id}에서 오류 발생: {e}")
                self.running.clear()  # 오류 시 스레드를 중지합니다

구현에서 고려해야 할 중요 사항:

<div class="content-ad"></div>

- 우리는 fetch sources의 수만큼 KafkaProducerThread 인스턴스가 생성됩니다.
- 우리는 모든 스레드를 KafkaProducerSwarm 아래에 랩합니다.
- 모든 스레드 사이에서 단일 KafkaProducer 인스턴스를 공유하며, 이는 클러스터와 통신할 것입니다.
- 우리는 N개의 fetching 스레드로 확장할 수 있지만 여전히 단일 KafkaProducer 인스턴스를 유지하기 위해 싱글톤 디자인 패턴을 따릅니다.

## Pydantic을 사용한 데이터 교환 모델

위에서 제시한 코드 스니펫 구현에서, 이전에 설명되지 않았던 *Document, *Model 객체의 사용을 관찰했을 수 있습니다. 이 섹션에서 이들이 무엇인지 자세히 살펴보겠습니다.

이들은 데이터 교환을 위한 Pydantic 모델들이며, 우리가 구축 중인 응용 프로그램 내에서 이러한 모델들은:

<div class="content-ad"></div>

- NewsDataIOModel: NewsData API에서 가져온 원시 페이로드를 래핑하고 포맷합니다.
- NewsAPIModel: NewsAPI API에서 가져온 원시 페이로드를 래핑하고 포맷합니다.
- CommonDocument: 위에서 언급한 다양한 뉴스 형식 사이의 공통 형식을 설정합니다.
- RefinedDocument: metadata 아래에 유용한 필드를 그룹화하고 기사 설명 텍스트와 같은 주요 필드를 강조하는 공통 형식을 필터링합니다.
- ChunkedDocument: 텍스트를 청크로 나누고 chunk_id와 document_id 사이의 계보를 보장합니다.
- EmbeddedDocument: 청크를 임베드하여 chunk_id와 document_id 사이의 계보를 보장합니다.

예를 들어, 위 CommonDocument 모델은 다양한 뉴스 페이로드 형식 사이의 연결 역할을 나타내므로 이와 같이 구성됩니다:

class CommonDocument(BaseModel):
    article_id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = Field(default_factory=lambda: "N/A")
    url: str = Field(default_factory=lambda: "N/A")
    published_at: str = Field(
        default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    source_name: str = Field(default_factory=lambda: "Unknown")
    image_url: Optional[str] = Field(default_factory=lambda: None)
    author: Optional[str] = Field(default_factory=lambda: "Unknown")
    description: Optional[str] = Field(default_factory=lambda: None)
    content: Optional[str] = Field(default_factory=lambda: None)

    @field_validator("title", "description", "content")
    def clean_text_fields(cls, v):
        if v is None or v == "":
            return "N/A"
        return clean_full(v)

    @field_validator("url", "image_url")
    def clean_url_fields(cls, v):
        if v is None:
            return "N/A"
        v = remove_html_tags(v)
        v = normalize_whitespace(v)
        return v

    @field_validator("published_at")
    def clean_date_field(cls, v):
        try:
            parsed_date = parser.parse(v)
            return parsed_date.strftime("%Y-%m-%d %H:%M:%S")
        except (ValueError, TypeError):
            logger.error(f"Error parsing date: {v}, using current date instead.")

    @classmethod
    def from_json(cls, data: dict) -> "CommonDocument":
        """JSON 객체에서 CommonDocument를 만듭니다."""
        return cls(**data)

    def to_kafka_payload(self) -> dict:
        """Kafka 페이로드의 공통 표현을 준비합니다."""
        return self.model_dump(exclude_none=False)

해석해보겠습니다:

<div class="content-ad"></div>

- 뉴스 기사 형식에 공통 속성 시리즈가 포함되어 있습니다.
- 각 필드를 유효성 검사하거나 field_validator 데코레이터를 사용하여 기본값을 지정합니다.
- to_kafka_payload 메서드는 메시지 직렬화를 보장하여 Kafka 클러스터로 전송하기 전에 처리합니다.

## 텍스트 필드 클린업 프로세스

클린업 프로세스는 간단합니다. 텍스트를 정리하고 다음을 보장하기 위해 메서드를 사용합니다:

- 끝에 있는 공백이나 \n, \t를 제거합니다.
- ul/li 목록 항목을 제거합니다.
- 텍스트 내에 HTML 태그가 있으면 제거합니다.

<div class="content-ad"></div>

우리는 이러한 변환을 간소화하기 위해 구조화되지 않은 [7] Python 라이브러리를 사용하고 있습니다.

## KafkaProducers 실행

지금까지 다음 모듈을 수행/구현했습니다:

- 필요한 모든 서비스에 등록
- Kafka 클러스터 및 벡터 데이터베이스 생성
- 뉴스 기사 검색 핸들러 구현
- 데이터 교환을 위한 Pydantic 모델 구현
- KafkaProducer 로직 구현

<div class="content-ad"></div>

작업이 완료되면 이제 안전하게 우리의 파이프라인에서 생산 단계를 실행하고 Upstash의 KafkaCluster에서 메시지를 확인할 수 있습니다.

그럼 시작해봐요!
프로젝트의 루트 디렉토리에서, Makefile에 데이터 수집을 실행하는 명령어가 있습니다:

....

run_producers:
 @echo "$(GREEN) [실행 중] 데이터 수집 파이프라인 Kafka 프로듀서 $(RESET)"
 @bash -c "poetry run python -m src.producer"

...

이 🔗Makefile은 우리가 구축 중인 솔루션과 상호작용하기 위한 유용한 명령어가 포함되어 있습니다. 이 경우에는 make run_producers를 사용하여 run_producers를 실행해야 합니다. 이렇게 하면 KafkaSwarm이 시작되고 NewsAPIs에서 기사를 가져와 형식을 지정한 다음 Kafka 클러스터로 보내는 스레드를 다룰 것입니다.

<div class="content-ad"></div>

```
![이미지](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_8.png)

로그를 통해 프로듀서 스레드가 각각 5개의 메시지를 보냈다는 것을 확인했습니다. 메시지들이 클러스터에 도달했는지 확인하려면 Upstash 콘솔로 이동하여 Kafka 클러스터 → 메시지를 확인하십시오. 다음과 같은 화면이 나타날 것입니다:

![이미지](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_9.png)

이 시점에서는 API에서 뉴스 기사를 가져와 형식을 맞춘 후 Kafka로 메시지를 보내는 데이터 수집 파이프라인의 구현 및 테스트가 완료되었습니다. 다음으로는 Kafka에서 새 메시지를 처리하는 "컨슈머" 또는 적재 파이프라인을 구현할 것입니다.


<div class="content-ad"></div>

# 데이터 수집 파이프라인

우리가 Kafka 주제에서 메시지를 받았다는 것을 확인한 후에는 "소비자" 파이프라인을 구현해야 합니다. 이는 다음을 의미합니다:

- Kafka 주제에서 메시지 읽기
- 파싱, 형식 지정, 청크화, 임베딩 생성
- 벡터 객체 생성 및 Upstash Vector Index에 업서트

![이미지](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_10.png)

<div class="content-ad"></div>

이를 위해 Bytewax [4]를 사용하여 이러한 단계를 올바른 순서로 연결하는 DataFlow를 정의할 것입니다.

바로 구현에 들어가서 주요 개념을 설명해보겠습니다!

- Bytewax Flow에 입력으로 Kafka Source를 정의합니다.

```js
import json
from typing import List

from bytewax.connectors.kafka import KafkaSinkMessage, KafkaSource

from logger import get_logger
from models import CommonDocument
from settings import settings

logger = get_logger(__name__)

def build_kafka_stream_client():
    """
    Build a Kafka stream client to read messages from the Upstash Kafka topic using the ByteWax KafkaSource connector.
    """
    kafka_config = {
        "bootstrap.servers": settings.UPSTASH_KAFKA_ENDPOINT,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-256",
        "sasl.username": settings.UPSTASH_KAFKA_UNAME,
        "sasl.password": settings.UPSTASH_KAFKA_PASS,
        "auto.offset.reset": "earliest",  # Start reading at the earliest message
    }
    kafka_input = KafkaSource(
        topics=[settings.UPSTASH_KAFKA_TOPIC],
        brokers=[settings.UPSTASH_KAFKA_ENDPOINT],
        add_config=kafka_config,
    )
    logger.info("KafkaSource client created successfully.")
    return kafka_input

def process_message(message: KafkaSinkMessage):
    """
    On a Kafka message, process the message and return a list of CommonDocuments.
    - message: KafkaSinkMessage(key, value) where value is the message payload.
    """
    documents: List[CommonDocument] = []
    try:
        json_str = message.value.decode("utf-8")
        data = json.loads(json_str)
        documents = [CommonDocument.from_json(obj) for obj in data]
        logger.info(f"Decoded into {len(documents)} CommonDocuments")
        return documents
    except StopIteration:
        logger.info("No more documents to fetch from the client.")
    except KeyError as e:
        logger.error(f"Key error in processing document batch: {e}")
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from message: {e}")
        raise
    except Exception as e:
        logger.exception(f"Unexpected error in next_batch: {e}")
```

<div class="content-ad"></div>

이 구현에서 중요한 점들:

- build_kafka_stream_client : 미리 정의된 Bytewax KafkaSource 커넥터를 사용하여 KafkaConsumer의 인스턴스를 생성합니다.
- process_message : Kafka Topic에서 메시지를 처리할 콜백 함수입니다.

2. Bytewax 플로우의 출력으로 Upstash Vector (Index)를 정의합니다.

```js
from typing import Optional, List

from bytewax.outputs import DynamicSink, StatelessSinkPartition
from upstash_vector import Index, Vector
from models import EmbeddedDocument
from settings import settings
from logger import get_logger


logger = get_logger(__name__)


class UpstashVectorOutput(DynamicSink):
    """Upstash 벡터 출력을 나타내는 클래스입니다.

    이 클래스는 at-least-once 처리를 지원하는 동적 출력 유형인 Upstash 벡터 출력을 생성하는 데 사용됩니다.
    resume 이후의 메시지는 resume 즉각적으로 복제됩니다.

    Args:
        vector_size (int): 벡터의 크기.
        collection_name (str, optional): 컬렉션의 이름입니다. 기본값은 constants.VECTOR_DB_OUTPUT_COLLECTION_NAME입니다.
        client (Optional[UpstashClient], optional): Upstash 클라이언트입니다. 기본값은 None입니다.
    """

    def __init__(
        self,
        vector_size: int = settings.EMBEDDING_MODEL_MAX_INPUT_LENGTH,
        collection_name: str = settings.UPSTASH_VECTOR_TOPIC,
        client: Optional[Index] = None,
    ):
        self._collection_name = collection_name
        self._vector_size = vector_size

        if client:
            self.client = client
        else:
            self.client = Index(
                url=settings.UPSTASH_VECTOR_ENDPOINT,
                token=settings.UPSTASH_VECTOR_KEY,
                retries=settings.UPSTASH_VECTOR_RETRIES,
                retry_interval=settings.UPSTASH_VECTOR_WAIT_INTERVAL,
            )

    def build(
        self, step_id: str, worker_index: int, worker_count: int
    ) -> StatelessSinkPartition:
        return UpstashVectorSink(self.client, self._collection_name)


class UpstashVectorSink(StatelessSinkPartition):
    """
    Upstash Vector 데이터베이스 컬렉션에 문서 임베딩을 작성하는 싱크입니다.
    이 구현은 효율성을 높이기 위해 배치 업서트를 활용하며, 오류 처리 및 로깅을 향상시키고 가독성 및 유지 보수성을 위해 Pythonic한 모법을 따릅니다.

    Args:
        client (Index): 쓰기에 사용할 Upstash Vector 클라이언트입니다.
        collection_name (str, optional): 쓸 컬렉션의 이름입니다. 기본값은 UPSTASH_VECTOR_TOPIC 환경 변수의 값입니다.
    """

    def __init__(
        self,
        client: Index,
        collection_name: str = None,
    ):
        self._client = client
        self._collection_name = collection_name
        self._upsert_batch_size = settings.UPSTASH_VECTOR_UPSERT_BATCH_SIZE

    def write_batch(self, documents: List[EmbeddedDocument]):
        """
        구성된 Upstash Vector 데이터베이스 컬렉션에 문서 임베딩의 배치를 작성합니다.

        Args:
            documents (List[EmbeddedDocument]): 쓸 문서들입니다.
        """
        vectors = [
            Vector(id=doc.doc_id, vector=doc.embeddings, metadata=doc.metadata)
            for doc in documents
        ]

        # 효율성을 위한 배치 업서트
        for i in range(0, len(vectors), self._upsert_batch_size):
            batch_vectors = vectors[i : i + self._upsert_batch_size]
            try:
                self._client.upsert(vectors=batch_vectors)
            except Exception as e:
                logger.error(f"배치 업서트 중 예외 발생 {e}")
```

<div class="content-ad"></div>

이 구현에서 중요한 사항들입니다:

- UpstashVectorOutput: 다양한 대상으로 데이터를 전달하기 위해 설계된 Bytewax DynamicSink 추상화를 인스턴스화합니다. 우리의 경우, 이는 Upstash Vector Index 클라이언트 연결 위에 래핑될 것입니다.
- UpstashVectorSink: 우리의 DynamicSink을 래핑하고 업서트 벡터를 우리의 VectorDatabase에 처리하는 기능을 담당합니다. 이 StatelessSinkPartition은 DynamicSink가 어떠한 상태도 유지하지 않고 우리의 Sink에 대한 모든 입력을 write_batch 기능 구현에 따라 처리합니다.

## 나머지 Bytewax Flow 빌드하기

여기 Upstash Kafka Topic에서 메시지를 가져와 정제, 수정, 분할, 삽입하고 Upstash Vector Index에 벡터를 업서트하는 저희 DataFlow의 전체 구현입니다.

<div class="content-ad"></div>

```js
"""
    이 스크립트는 Upstash 사용 사례에 대한 ByteWax 데이터플로 구현을 정의합니다.
    데이터플로에는 다음 단계가 포함되어 있습니다:
        1. 입력: 카프카 스트림에서 데이터를 읽기
        2. 정제: 입력 데이터를 공통 형식으로 변환 
        3. 청크 분리: 입력 데이터를 더 작은 청크로 분리
        4. 임베드: 입력 데이터에 대한 임베딩 생성
        5. 출력: 출력 데이터를 Upstash 벡터 데이터베이스에 쓰기
"""

from pathlib import Path
from typing import Optional

import bytewax.operators as op
from vector import UpstashVectorOutput
from consumer import process_message, build_kafka_stream_client
from bytewax.connectors.kafka import KafkaSource
from bytewax.dataflow import Dataflow
from bytewax.outputs import DynamicSink
from embeddings import TextEmbedder
from models import ChunkedDocument, EmbeddedDocument, RefinedDocument
from logger import get_logger

logger = get_logger(__name__)


def build(
    model_cache_dir: Optional[Path] = None,
) -> Dataflow:
    """
    Upstash 사용 사례에 대한 ByteWax 데이터플로를 구축합니다.
    다음과 같은 데이터플로를 따릅니다:
        * 1. Tag: ['kafka_input']   = KafkaSource에서 입력 데이터 읽기
        * 2. Tag: ['map_kinp']      = KafkaSource에서 CommonDocument로 메시지 처리
            * 2.1 [Optional] Tag ['dbg_map_kinp'] = ['map_kinp'] 후 디버깅
        * 3. Tag: ['refine']        = 메시지를 정제된 문서 형식으로 변환
            * 3.1 [Optional] Tag ['dbg_refine'] = ['refine'] 후 디버깅
        * 4. Tag: ['chunkenize']    = 정제된 문서를 더 작은 청크로 나누기
            * 4.1 [Optional] Tag ['dbg_chunkenize'] = ['chunkenize'] 후 디버깅
        * 5. Tag: ['embed']         = 청크에 대한 임베딩 생성
            * 5.1 [Optional] Tag ['dbg_embed'] = ['embed'] 후 디버깅
        * 6. Tag: ['output']        = 임베딩을 Upstash 벡터 데이터베이스에 쓰기
    노트:
        각 선택적 태그는 문제 해결을 위해 활성화할 수 있는 디버깅 단계입니다.
    """
    model = TextEmbedder(cache_dir=model_cache_dir)

    dataflow = Dataflow(flow_id="news-to-upstash")
    stream = op.input(
        step_id="kafka_input",
        flow=dataflow,
        source=_build_input(),
    )
    stream = op.flat_map("map_kinp", stream, process_message)
    # _ = op.inspect("dbg_map_kinp", stream)
    stream = op.map("refine", stream, RefinedDocument.from_common)
    # _ = op.inspect("dbg_refine", stream)
    stream = op.flat_map(
        "chunkenize",
        stream,
        lambda refined_doc: ChunkedDocument.from_refined(refined_doc, model),
    )
    # _ = op.inspect("dbg_chunkenize", stream)
    stream = op.map(
        "embed",
        stream,
        lambda chunked_doc: EmbeddedDocument.from_chunked(chunked_doc, model),
    )
    # _ = op.inspect("dbg_embed", stream)
    stream = op.output("output", stream, _build_output())
    logger.info("성공적으로 ByteWax 데이터플로를 생성했습니다.")
    logger.info(
        "\t단계: Kafka 입력 -> 매핑 -> 정제 -> 청크 분리 -> 임베딩 -> 업로드"
    )
    return dataflow


def _build_input() -> KafkaSource:
    return build_kafka_stream_client()


def _build_output() -> DynamicSink:
    return UpstashVectorOutput()
```

<div class="content-ad"></div>

- kafka_input: 카프카 메시지를 가져와 CommonDocument Pydantic 형식으로 변환하는 단계입니다.
- map_kinp: 카프카 입력을 의미하며, 수신된 메시지에 flat map을 적용하여 List[CommonDocument] Pydantic 객체를 생성합니다.
- refine: List[CommonDocument]를 순회하고 RefinedDocument 인스턴스를 생성하는 단계입니다.
- chunkenize: List[RefinedDocument]를 순회하고 ChunkedDocument 인스턴스를 생성하는 단계입니다.
- embed: List[ChunkedDocuments]를 순회하고 EmbeddedDocument 인스턴스를 생성하는 단계입니다.
- output: List[EmbeddedDocument]를 순회하고 Vector 객체를 생성하여 Upstash Vector Index에 업서트하는 단계입니다.

# 파이프라인 시작

지금까지 구현한 것은 다음과 같습니다:

- 데이터 수집 파이프라인: 주기적으로 NewsAPI에서 원시 페이로드를 가져와 형식을 지정한 뒤, 카프카 토픽으로 메시지를 전송하는 단계입니다.
- 인제션 파이프라인: 이는 Bytewax DataFlow로, 카프카 토픽에 연결되어 메시지를 소비하고, 최종적으로 벡터를 업서트하는 Vector 데이터베이스에 업데이트합니다.

<div class="content-ad"></div>

프로젝트 루트에있는 Makefile에서 미리 정의된 명령을 사용하여 이 두 서비스를 모두 시작할 수 있습니다:

```js
# 카프카 메시지를 생성하기 위해 데이터 수집 파이프라인 실행
make run_producers

# 카프카 메시지를 소비하고 벡터를 업데이트하기 위해 인제스처리 파이프라인 실행
make run_pipeline
```

그리고... 완료되었습니다!
성공적으로 프로듀서/컨슈머 서비스를 시작했습니다.
남은 모듈은 UI입니다. 벡터 데이터베이스와 뉴스 기사를 검색하는 데 상호 작용하는 데 사용됩니다.

# 사용자 인터페이스

<div class="content-ad"></div>

UI는 다음과 같은 기능을 갖춘 기본 Streamlit [8] 애플리케이션입니다:

- 텍스트 검색 창
- 벡터 데이터베이스에서 가져온 기사로 채워진 카드가 표시되는 div 섹션

카드에는 다음과 같은 데이터 필드가 포함되어 있습니다:

- 발행일
- 유사도 점수
- 기사 이미지
- SeeMore 버튼을 클릭하면 원본 기사 URL로 이동합니다.

<div class="content-ad"></div>

한번 메시지/질문을 텍스트 상자에 입력하면 입력이 정리되고 (소문자로 변환, 비ASCII 문자 제거 등) 그리고 삽입됩니다. 새로운 삽입물을 사용하여 벡터 데이터베이스를 쿼리하여 가장 유사한 항목을 가져옵니다. 그 결과는 구성되어 렌더링될 것입니다.

다음은 예시입니다:


![How to build a real-time News Search Engine using VectorDBs - Part 1](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_11.png)

![How to build a real-time News Search Engine using VectorDBs - Part 2](/assets/img/2024-06-19-Howtobuildareal-timeNewsSearchEngineusingVectorDBs_12.png)


<div class="content-ad"></div>

# 결론

축하합니다!

성공했습니다! 멋진 프로젝트만큼이나 라이브로 출시할 준비가 된 뉴스 검색 엔진을 만들었습니다. 단순히 무작정 던지는 것이 아니라, 우리는 최고의 소프트웨어 개발 관행을 따르기도 했습니다.

Pydantic을 사용하여 데이터를 잘 처리했고, 유닛 테스트를 작성하고, 스레딩을 활용하여 작업을 가속화했으며, Upstash의 서버리스 카프카와 벡터 데이터베이스를 활용하여 파이프라인을 쉽게 설정할 뿐만 아니라 빠르고 확장 가능하며 오류 대비 가능하도록 만들었습니다.

<div class="content-ad"></div>

이제 당신은 이 청사진을 대부분의 데이터 기반 아이디어에 적용할 수 있는 능력을 갖게 되었어요. 이건 이 프로젝트뿐만 아니라 앞으로 만들게 될 멋진 것들을 위한 큰 승리에요.

# 참고 자료

[1] News Search Engine using Upstash Vector — Decoding ML Github (2024)
[2] Upstash Serverless Kafka
[3] Upstash Serverless Vector Database
[4] Bytewax Stream Processing with Python
[5] Singleton Pattern
[6] sentence-transformers/all-MiniLM-L6-v2
[7] unstructured Python Library
[8] Streamlit Python

# 더 읽을 거리

<div class="content-ad"></div>

이 글과 관련성 순으로 정렬되었습니다.