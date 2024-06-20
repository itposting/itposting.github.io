---
title: "Chronon, 에어비앤비의 기계 학습 피처 플랫폼, 이제 오픈 소스로 공개합니다"
description: ""
coverImage: "/assets/img/2024-06-20-ChrononAirbnbsMLFeaturePlatformIsNowOpenSource_0.png"
date: 2024-06-20 15:22
ogImage: 
  url: /assets/img/2024-06-20-ChrononAirbnbsMLFeaturePlatformIsNowOpenSource_0.png
tag: Tech
originalTitle: "Chronon, Airbnb’s ML Feature Platform, Is Now Open Source"
link: "https://medium.com/airbnb-engineering/chronon-airbnbs-ml-feature-platform-is-now-open-source-d9c4dba859e8"
---


테이블 태그를 Markdown 형식으로 변경해주세요.

A feature platform that offers observability and management tools, allows ML practitioners to use a variety of data sources, while handling the complexity of data engineering, and provides low latency streaming.

![ChrononAirbnbsMLFeaturePlatformIsNowOpenSource_0](/assets/img/2024-06-20-ChrononAirbnbsMLFeaturePlatformIsNowOpenSource_0.png)

By: Varant Zanoyan, Nikhil Simha Raprolu

![ChrononAirbnbsMLFeaturePlatformIsNowOpenSource_1](/assets/img/2024-06-20-ChrononAirbnbsMLFeaturePlatformIsNowOpenSource_1.png)

<div class="content-ad"></div>

Airbnb에서는 우리의 ML Feature Platform 인 Chronon을 오픈 소스로 공개하게 된 것을 기쁘게 생각합니다. 우리 커뮤니티 Discord 채널에 참여하여 함께 대화해보세요.

우리는 Stripe와 함께 이 프로젝트의 초기 채택자 및 공동 유지 보수자로서 이 공지를 함께 전하게 되어 기쁘게 생각합니다.

이 블로그 글은 Chronon의 주요 동기와 기능에 대해 다루고 있습니다. Chronon의 핵심 개념에 대한 개요는 이전 게시물을 참조해주세요.

# 배경

<div class="content-ad"></div>

Chronon은 ML 실무자들의 공통된 고민을 해소하고자 만들어졌어요: 모델링에 대부분의 시간을 쏟는 대신 모델을 구축하는 데 필요한 데이터를 관리하는 일에 시간을 많이 써야 했기 때문이죠.

Chronon 이전에는, 실무자들은 일반적으로 다음 두 가지 방법 중 하나를 사용했어요:

- 오프라인-온라인 복사: ML 실무자들은 데이터 웨어하우스에서 모델을 학습한 뒤 온라인 환경에서 해당 기능을 복제하는 방법을 찾았죠. 이 방법의 이점은 데이터 웨어하우스 전체, 즉 데이터 소스와 대규모 데이터 변환에 사용되는 강력한 도구를 활용할 수 있다는 것이에요. 그러나 이 방법은 온라인 추론에 모델 기능을 제공하는 명확한 방법을 제공하지 않아 일관성 및 레이블 유출로 모델 성능에 심각한 영향을 미치는 단점이 있어요.
- 기록하고 대기: ML 실무자들은 모델 추론을 실행할 온라인 서빙 환경에서 사용 가능한 데이터로 시작합니다. 관련 특징을 데이터 웨어하우스에 기록합니다. 충분한 데이터가 축적되면, 해당 로그를 사용하여 모델을 학습하고 같은 데이터로 서빙합니다. 이 방법의 이점은 일관성이 보장되며 유출 가능성이 낮다는 것이에요. 그러나 이 방법의 주요 단점은 대기 시간이 길어질 수 있어서 변화하는 사용자 행동에 빠르게 대응하는 능력을 저해할 수 있다는 것이죠.

Chronon 접근 방식은 양쪽을 모두 최대한 활용할 수 있게 해줘요. Chronon을 사용하면 ML 실무자들은 특징을 한 번 정의하면 됩니다. 이를 통해 오프라인 흐름은 모델 학습을 위한 것뿐만 아니라 온라인 흐름에서 모델 추론에도 사용됩니다. 또한, Chronon은 특징 연결, 가시성 및 데이터 품질을 위한 강력한 도구, 특징 공유 및 관리도 제공해요.

<div class="content-ad"></div>

# 작동 방식

아래에서는 Chronon의 대부분의 기능을 구동하는 주요 구성 요소를 살펴보며 빠른 시작 가이드에서 파생된 간단한 예제를 사용합니다. 이 예제를 실행하려면 해당 가이드를 따를 수 있습니다.

온라인 대규모 소매업체라고 가정해 보겠습니다. 사용자들이 구매를 하고 나중에 상품을 반품하는 사기 벡터를 감지했습니다. 주어진 거래가 사기적인 반품으로 이어질 가능성을 예측하는 모델을 훈련하고자 합니다. 사용자가 체크아웃 과정을 시작할 때마다 이 모델을 호출할 것입니다.

## 기능 정의

<div class="content-ad"></div>

구매 데이터: 구매 로그 데이터를 사용자 수준으로 집계하여이 사용자가 플랫폼에서 이전에 수행한 활동을 볼 수 있습니다. 구체적으로 다양한 시간 창을 통해 이전 구매 금액의 SUM, COUNT 및 AVERAGE를 계산할 수 있습니다.

```js
source = Source(
    events=EventSource(
        table="data.purchases", # 이는 매일 일괄 업데이트되는 데이터 웨어하우스의 로그 테이블을 가리킵니다.
        topic="events/purchases", # 스트리밍 소스 토픽
        query=Query(
            selects=select("user_id","purchase_price"), # 우리가 관심 있는 필드를 선택합니다.
            time_column="ts") # 이벤트 시간
    ))

window_sizes = [Window(length=day, timeUnit=TimeUnit.DAYS) for day in [3, 14, 30]] # 아래에서 사용할 몇 가지 창 크기를 정의합니다.

v1 = GroupBy(
    sources=[source],
    keys=["user_id"], # 사용자별 집계 중
    online=True,
    aggregations=[Aggregation(
            input_column="purchase_price",
            operation=Operation.SUM,
            windows=window_sizes
        ), # 다양한 창에서 구매 가격의 합
        Aggregation(
            input_column="purchase_price",
            operation=Operation.COUNT,
            windows=window_sizes
        ), # 다양한 창에서 구매 횟수
        Aggregation(
            input_column="purchase_price",
            operation=Operation.AVERAGE,
            windows=window_sizes
        ), # 다양한 창에서 사용자별 평균 구매
        Aggregation(
            input_column="purchase_price",
            operation=Operation.LAST_K(10),
        ), # 목록으로 집계된 마지막 10개 구매 가격
    ],
)
```

이렇게하면 `GroupBy`가 생성되어 `purchases` 이벤트 데이터를 사용자별 주요 키로 계속하여 시간 범위별로 다양한 필드를 집계하여 유용한 기능으로 변환합니다.

이는 사용자 수준에서 구매 기록 데이터를 유용한 기능으로 변환합니다.

<div class="content-ad"></div>

유저 데이터: 유저 데이터를 피처로 변환하는 것은 조금 더 간단합니다. 주로 집계를 수행할 필요가 없기 때문입니다. 이 경우, 원본 데이터의 주요 키와 피처의 주요 키가 동일하므로 행을 대상으로 집계를 수행하는 대신 단순히 열 값을 추출할 수 있습니다:

```js
source = Source(
    entities=EntitySource(
        snapshotTable="data.users", # 모든 사용자의 일별 스냅샷을 포함하는 테이블을 가리킴
        query=Query(
            selects=select("user_id","account_created_ds","email_verified"), # 관심 있는 필드를 선택
        )
    ))

v1 = GroupBy(
    sources=[source],
    keys=["user_id"], # 주요 키는 소스 테이블의 주요 키와 동일함
    aggregations=None, # 이 경우 집계나 윈도우를 정의할 필요가 없음
    online=True,
) 
```

이를 통해 `user_id`를 주요 키로 사용하여 `data.users` 테이블로부터 차원을 추출하는 `GroupBy`가 생성됩니다.

피처를 결합하기: 다음으로, 이전에 정의된 피처를 백필링되어 모델 훈련에 사용되고 모델 추론을 위해 온라인으로 제공될 수 있는 단일 뷰로 결합해야 합니다. Join API를 사용하여 이를 달성할 수 있습니다.

<div class="content-ad"></div>

우리의 사용 사례에서 피처가 올바른 타임스탬프로 계산되는 것이 매우 중요합니다. 모델이 체크아웃 플로우를 시작할 때 실행되기 때문에, 온라인 추론에서 모델이 볼 것과 일치하는 피처 값이 모델 훈련을 위해 논리적으로 일치하도록 백필에 해당 타임스탬프를 사용하고 싶습니다.

아래는 정의가 어떻게 보이는지에 대한 예시입니다. 기존에 정의된 피처와 returns(반품)이라는 다른 피처 세트를 API의 right_parts 부분에 결합하는 것을 확인할 수 있습니다.

```js
source = Source(
    events=EventSource(
        table="data.checkouts",
        query=Query(
            selects=select("user_id"), # 다양한 GroupBy를 함께 결합하기 위해 사용되는 기본 키
            time_column="ts",
            ) # 피처 값을 계산하기 위해 사용되는 이벤트 시간
    ))

v1 = Join(
    left=source,
    right_parts=[JoinPart(group_by=group_by) for group_by in [purchases_v1, returns_v1, users]] # 세 가지 GroupBy를 포함
)
```

# 백필/오프라인 계산

<div class="content-ad"></div>

위에 나와 있는 Join 정의로 사용자가 할 수 있는 첫 번째 작업은 역사적인 피쳐 값들을 모델 훈련을 위해 생성하기 위해 백필을 실행하는 것입니다. Chronon은 몇 가지 주요 이점을 갖고 이 백필을 수행합니다:

- 시점 정확도: 위의 Join에서 "left" 쪽으로 사용된 소스를 주목해보세요. 이 소스는 각 행마다 해당 특정 체크아웃의 논리적 시간에 해당하는 "ts" 타임스탬프를 포함하는 "data.checkouts" 소스 위에 구축되어 있습니다. 모든 피쳐 계산은 해당 타임스탬프를 기준으로 창 정확성이 보장됩니다. 따라서 이전 사용자 구매의 1개월 합계에 대한 경우, 왼쪽 소스에서 제공된 타임스탬프를 기준으로 각 행이 사용자에 대해 계산될 것입니다.
- Skew 처리: Chronon의 백필 알고리즘은 매우 편향된 데이터셋을 처리하는 데 최적화되어 있어, 귀찮은 OOM과 작업 멈춤을 피할 수 있습니다.
- 계산 효율 최적화: Chronon은 백엔드에 직접 여러 최적화를 적용할 수 있어 계산 시간과 비용을 줄일 수 있습니다.

# 온라인 계산

Chronon은 온라인 피쳐 계산을 위한 많은 복잡성을 추상화합니다. 위의 예에서 해당 피쳐가 일괄 피쳐인지 또는 스트리밍 피쳐인지에 따라 피쳐를 계산할 것입니다.

<div class="content-ad"></div>

일괄 기능 (예: 위의 사용자 기능)

사용자 기능은 기존의 일괄 테이블 위에 구축되어 있기 때문에, Chronon은 매일 배치 작업을 실행하여 새 데이터가 일괄 데이터 저장소에 도착하면 새 기능 값을 계산하고 이를 온라인 KV 저장소에 업로드하여 제공합니다.

스트리밍 기능 (예: 위의 구매 기능)

구매 기능은 소스에 스트리밍 구성 요소를 포함한 소스에 기초로 구축되어 있습니다. 이는 소스에 "주제"가 포함되어 있음으로 나타납니다. 이 경우 Chronon은 실시간 업데이트를 위해 배치 업로드와 함께 스트리밍 작업도 실행합니다. 배치 작업은 다음을 담당합니다:

<div class="content-ad"></div>

- 값 시딩하기: 긴 윈도우의 경우, 스트림을 되감아서 모든 원시 이벤트를 재생하는 것은 실용적이지 않을 수 있습니다.
- "윈도우의 중간"을 압축하고 꼬리 정확도 제공하기: 정확한 윈도우 정확도를 위해서는, 윈도우의 머리와 꼬리에서 원시 이벤트가 필요합니다.

그러면 스트리밍 작업이 업데이트를 KV 스토어에 기록하여, 추출 시 특성 값을 최신 상태로 유지합니다.

# 온라인 서빙 / 추출 API

Chronon은 낮은 대기 시간으로 특성을 추출하기 위한 API를 제공합니다. 우리는 개별 GroupBys(즉, 위에서 정의한 사용자 또는 구매 특성)에 대한 값이나 Join에 대한 값 중 하나를 가져올 수 있습니다. 다음은 Join에 대한 하나의 해당 요청과 응답의 예시입니다:

<div class="content-ad"></div>

```js
// 사용자=123에 대한 모든 기능을 검색 중
Map<String, String> keyMap = new HashMap<>();
keyMap.put("user", "123")
Fetcher.fetch_join(new Request("quickstart_training_set_v1", keyMap));
// 샘플 응답 (기능 이름과 값의 맵)
'{"purchase_price_avg_3d":14.2341, "purchase_price_avg_14d":11.89352, ...}'
```

사용자 123에 대한 모든 기능을 가져오는 Java 코드입니다. 반환 형식은 기능 이름과 기능 값의 맵입니다.

위 예제는 Java 클라이언트를 사용합니다. 쉬운 테스트와 디버깅을 위해 Scala 클라이언트와 Python CLI 도구도 있습니다:

```js
run.py --mode=fetch -k '{"user_id":123}' -n quickstart/training_set -t join

> {"purchase_price_avg_3d":14.2341, "purchase_price_avg_14d":11.89352, ...}
```

<div class="content-ad"></div>

run.py CLI 도구를 활용하여 상단의 Java 코드와 동일한 가져오기 요청을 수행할 수 있어요. run.py는 Chronon 워크플로우를 빠르게 테스트하는 편리한 방법이에요.

또 다른 옵션은 이러한 API를 서비스로 래핑하여 REST 엔드포인트를 통해 요청하는 것이에요. 이 방법은 Airbnb 내에서 Ruby와 같은 Java 이외의 환경에서 기능을 가져오기 위해 사용돼요.

# 온라인-오프라인 일관성

Chronon은 온라인-오프라인 정확도에 도움을 주는 것뿐만 아니라 이를 측정하는 방법도 제공해요. 측정 파이프라인은 온라인 가져오기 요청의 로그에서 시작돼요. 이 로그에는 요청의 기본 키와 타임스탬프가 포함되어 있습니다. 그리고 가져온 기능 값도 포함돼요. 그런 다음, Chronon은 키와 타임스탬프를 왼쪽 측으로 하는 Join backfill로 전달하고, 계산 엔진에게 기능 값을 backfill하도록 요청해요. 그런 다음 backfill된 값을 실제 가져온 값과 비교하여 일관성을 측정해요.

<div class="content-ad"></div>

# 다음은 무엇인가요?

오픈 소스는 Stripe와 넓은 커뮤니티와 함께 나아갈 흥미로운 여정의 첫걸음일 뿐입니다.

저희의 비전은 ML 실무자들이 자신들의 데이터를 활용하는 가장 최선의 결정을 내릴 수 있도록 돕고, 이 결정을 실행하는 과정을 가능한 쉽게 만들어 주는 플랫폼을 만드는 것입니다. 현재 우리의 로드맵을 구성하는 데 사용 중인 몇 가지 질문입니다:

반복과 계산 비용을 얼마나 더 낮출 수 있을까요?

<div class="content-ad"></div>

크로논은 이미 Airbnb 및 Stripe와 같은 대기업이 처리하는 데이터 규모에 적합하게 구축되어 있습니다. 그러나 우리의 컴퓨트 엔진을 최적화하여 컴퓨트 비용을 줄이고 새로운 기능을 만들고 실험하는 "시간 비용"을 줄일 수 있는 방법이 항상 있습니다.

새로운 기능을 작성하는 것을 얼마나 더 쉽게 만들 수 있을까요?

기능 엔지니어링은 인간이 도메인 지식을 표현하여 모델이 활용할 수 있는 신호를 생성하는 과정입니다. 크로논은 NLP를 통합하여 ML 전문가들이 이러한 기능 아이디어를 자연어로 표현하고 작동하는 기능 정의 코드를 생성할 수 있도록 하여 이터레이션을 시작할 수 있도록 지원할 수 있습니다.

기술적 장벽을 낮추어 기능 생성을 보다 쉽게 하는 것은 결과적으로 ML 전문가들과 가치 있는 도메인 전문 지식을 보유한 파트너들 간의 새로운 협력을 열 수 있습니다.

<div class="content-ad"></div>

모델 유지 관리 방식을 개선할 수 있을까요?

사용자 행동 변경으로 모델 성능이 변화할 수 있습니다. 왜냐하면 모델이 훈련된 데이터가 현재 상황에 적용되지 않을 수 있기 때문입니다. 우리는 이러한 변화를 감지하고 이에 대응하는 전략을 조기에 예방적으로 만들어내는 플랫폼을 상상합니다. 이를 위해 모델을 재학습하거나 새로운 기능을 추가하거나 기존 기능을 수정하거나 그 이상의 조합으로 전략을 개발할 수 있습니다.

플랫폼 자체가 ML 실무자가 최상의 모델을 구축하고 배포하는 데 도움이 되는 지능형 에이전트가 될 수 있을까요?

플랫폼 레이어로 수집하는 메타데이터가 많아지면, 일반적인 ML 어시스턴트로서 플랫폼이 더욱 강력해질 수 있습니다.

<div class="content-ad"></div>

새로운 데이터로 실험을 자동으로 실행하여 모델을 개선하는 방법을 식별하는 플랫폼을 만드는 목표를 언급했습니다. 이러한 플랫폼은 ML 전문가들이 "이 사용 사례를 모델링할 때 가장 유용한 특성은 무엇인가요?" 또는 "이 목표에 관한 신호를 캡처하는 특성을 만들 수 있는 어떤 데이터 소스가 있을까요?"와 같은 질문을 할 수 있도록하여 데이터 관리에도 도움이 될 수 있습니다. 이러한 종류의 질문에 답변할 수 있는 플랫폼은 지능적 자동화의 다음 수준을 나타냅니다.

# 시작하기

다음은 시작하는 데 도움이 되는 리소스 또는 팀에 적합한지 평가하는 데 도움이 되는 리소스입니다.

- Github 프로젝트, Chronon 웹 사이트 및 특히 빠른 시작 가이드를 확인해보세요.
- 커뮤니티 디스코드 채널에 들러보세요. 에어비앤비 및 Stripe 팀은 Chronon이 여러분의 스택에 어떻게 맞을지에 대해 여러분과 채팅하는 데 열정적입니다.

<div class="content-ad"></div>

이런 종류의 작업에 관심이 있으세요? 여기에서 열려 있는 역할을 확인해보세요 — 채용 중입니다.

# 감사의 말

후원자: Henry Saputra Yi Li Jack Song

기여자: Pengyu Hou Cristian Figueroa Haozhen Ding Sophie Wang Vamsee Yarlagadda Haichun Chen Donghan Zhang Hao Cen Yuli Han Evgenii Shapiro Atul Kale Patrick Yoon