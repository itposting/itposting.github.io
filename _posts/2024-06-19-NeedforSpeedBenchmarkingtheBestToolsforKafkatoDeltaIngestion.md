---
title: "최고의 Kafka에서 Delta 적재를 위한 도구들을 벤치마킹합니다"
description: ""
coverImage: "/assets/img/2024-06-19-NeedforSpeedBenchmarkingtheBestToolsforKafkatoDeltaIngestion_0.png"
date: 2024-06-19 01:41
ogImage: 
  url: /assets/img/2024-06-19-NeedforSpeedBenchmarkingtheBestToolsforKafkatoDeltaIngestion_0.png
tag: Tech
originalTitle: "Need for Speed: Benchmarking the Best Tools for Kafka to Delta Ingestion"
link: "https://medium.com/@canadiandataguy/need-for-speed-benchmarking-the-best-tools-for-kafka-to-delta-ingestion-e1969121ed2e"
---


# 소개

데이터브릭스 플랫폼에서 카프카에서 델타 테이블로 데이터를 수집하는 시리즈의 두 번째 부분에 다시 오신 것을 환영합니다. 이전에 우리가 논의한 것을 더욱 발전시키면서, 카프카 토픽으로 합성 데이터를 생성하고 스트리밍하는 것에 대해 살펴보겠습니다.

본 블로그 포스트에서는 델타 레이크로부터 아파치 카프카에서 스트리밍 데이터를 수집하기 위한 데이터브릭스 플랫폼에서 사용 가능한 세 가지 강력한 옵션을 벤치마킹합니다: 데이터브릭스 잡, 델타 라이브 테이블(DLT) 및 델타 라이브 테이블 서버리스(DLT 서버리스). 주요 목표는 이러한 접근 방식을 통해 카프카에서 델타 테이블로 데이터를 수집할 때의 엔드 투 엔드 지연 시간을 평가하고 비교하는 것입니다.

지연 시간은 중요한 지표이며, 하류 분석 및 의사 결정 프로세스에 사용 가능한 데이터의 신선도와 적시성에 직접적인 영향을 미칩니다. 모든 세 가지 도구가 Apache Spark의 구조적 스트리밍을 내부적으로 활용한다는 점을 강조해야 합니다.

<div class="content-ad"></div>

# 벤치마크 설정

## 벤치마킹 기준

측정한 주요 메트릭은 대기 시간이었습니다 - 카프카에서 행이 생성된 시점부터 델타 레이크에서 이용 가능해질 때까지 걸리는 시간입니다. 대기 시간은 정밀하게 측정되었으며 정확성을 보장하고 변동성을 고려하기 위해 장기간에 걸쳐 신중하게 측정되었습니다.

## 입력 카프카 피드

<div class="content-ad"></div>

저희가 수행한 벤치마크에서는 매 초 100개의 행을 생성하는 Kafka 피드를 활용했어요. 각 행은 대략 1MB로, 초당 100MB로 이루어져요. 연간으로 계산하면 약 3.15 페타바이트가 되어, 저희가 선택한 도구의 수신 능력을 평가하기 위한 엄격한 테스트 베드가 됐어요.

Confluent Cloud를 사용하여 6개 파티션으로 Kafka 클러스터를 설정했는데, 5분 미만이 걸렸어요. 그리고 실험을 위해 300달러의 크레딧을 제공해 주었어요.

![이미지](/assets/img/2024-06-19-NeedforSpeedBenchmarkingtheBestToolsforKafkatoDeltaIngestion_0.png)

## 비교 도구

<div class="content-ad"></div>

- Databricks 작업: Kafka에서 읽고 Delta Lake 테이블에 쓰기 위해 Apache Spark Structured Streaming을 활용합니다. 작업 구성 및 예약에 유연성을 제공하지만 클러스터 리소스의 수동 관리가 필요합니다.
- Delta Live Tables (DLT): Kafka에서 Delta Lake로 데이터를 입력하기 위해 선언적 접근 방식을 사용하며, 인프라를 자동으로 관리하고 파이프라인 개발을 간소화합니다.
- Delta Live Tables Serverless (DLT Serverless): DLT와 동일한 입력 작업을 수행하면서, 인프라 관리를 더 간소화하기 위한 서버리스 모델을 활용합니다. 자동 스케일링과 리소스 최적화를 제공합니다.

## 지연 시간은 어떻게 측정되었나요?

지연 시간은 테이블로의 연속적인 스트리밍 업데이트 타임스탬프 간의 밀리초 단위 시간 차이를 계산하여 측정됩니다. 이는 각 순차적 커밋에 대해 이전 업데이트의 타임스탬프를 현재 업데이트의 타임스탬프에서 뺌으로써 수행되며, 각 업데이트가 이전 업데이트에 비해 처리하는 데 얼마나 걸리는지 분석할 수 있습니다. 분석은 현재 300개의 커밋으로 제한되어 있지만 필요에 따라 조정할 수 있습니다.

```js
from pyspark.sql import DataFrame

def run_analysis_about_latency(table_name: str) -> DataFrame:
    # Python 다중 라인 문자열로 형식 지정된 SQL 명령어 텍스트
    sql_code = f"""
        -- 테이블의 업데이트 이력에 대한 가상 뷰 정의
        WITH VW_TABLE_HISTORY AS (
          -- 테이블의 역사적 변화 설명
          DESCRIBE HISTORY {table_name}
        ),
        
        -- 이전 쓰기 작업의 타임스탬프를 계산하는 뷰 정의
        VW_TABLE_HISTORY_WITH_previous_WRITE_TIMESTAMP AS (
          SELECT
            -- 현재 작업 이전의 마지막 쓰기 작업의 타임스탬프를 계산
            lag(timestamp) OVER (
              PARTITION BY 1
              ORDER BY version
            ) AS previous_write_timestamp,
            timestamp,
            version
          FROM
            VW_TABLE_HISTORY
          WHERE
            operation = 'STREAMING UPDATE'
        ),
        
        -- 연속 커밋 간의 밀착 정도를 분석하는 뷰 정의
        VW_BOUND_ANALYSIS_TO_N_COMMITS AS (
          SELECT
            -- 이전 및 현재 쓰기 타임스탬프 간의 밀리초 단위 시간 차이 계산
            TIMESTAMPDIFF(
              MILLISECOND,
              previous_write_timestamp,
              timestamp
            ) AS elapsed_time_ms
          FROM
            VW_TABLE_HISTORY_WITH_previous_WRITE_TIMESTAMP
          ORDER BY
            version DESC
          LIMIT
            300  -- 최근 300개 커밋만 분석
        )
        
        -- 쓰기 지연 시간에 대한 다양한 통계 계산
        SELECT
          avg(elapsed_time_ms) AS average_write_latency,
          percentile_approx(elapsed_time_ms, 0.9) AS p90_write_latency,
          percentile_approx(elapsed_time_ms, 0.95) AS p95_write_latency,
          percentile_approx(elapsed_time_ms, 0.99) AS p99_write_latency,
          max(elapsed_time_ms) AS maximum_write_latency
        FROM
          VW_BOUND_ANALYSIS_TO_N_COMMITS
    """
    # Spark의 SQL 모듈을 사용하여 SQL 쿼리 실행
    display(spark.sql(sql_code))
```

<div class="content-ad"></div>

# 데이터 수집

이 코드는 Apache Spark를 사용하여 Kafka topic에서 데이터를 효율적으로 수집하는 스트리밍 데이터 파이프라인을 설정합니다. Kafka 메시지에서 예상되는 데이터 유형 및 열에 맞게 구성된 스키마를 정의하고, 차량 세부 정보, 지리적 좌표 및 텍스트 필드를 포함합니다. read_kafka_stream 함수는 스트리밍 프로세스를 초기화하고 Kafka에 안전하고 신뢰할 수 있는 연결을 구성하며, 지정된 주제를 구독하여 개선된 처리 속도를 위해 여러 파티션을 통해 데이터를 처리합니다. 스트림은 정의된 스키마에 따라 JSON 형식 메시지를 디코딩하고 필수 메타데이터를 추출합니다.

```js
from pyspark.sql.types import StructType, StringType, FloatType
from pyspark.sql.functions import *

# DataFrame 구조에 기반한 스키마 정의
schema = StructType() \
    .add("event_id", StringType()) \
    .add("vehicle_year_make_model", StringType()) \
    .add("vehicle_year_make_model_cat", StringType()) \
    .add("vehicle_make_model", StringType()) \
    .add("vehicle_make", StringType()) \
    .add("vehicle_model", StringType()) \
    .add("vehicle_year", StringType()) \
    .add("vehicle_category", StringType()) \
    .add("vehicle_object", StringType()) \
    .add("latitude", StringType()) \
    .add("longitude", StringType()) \
    .add("location_on_land", StringType()) \
    .add("local_latlng", StringType()) \
    .add("zipcode", StringType()) \
    .add("large_text_col_1", StringType()) \
    .add("large_text_col_2", StringType()) \
    .add("large_text_col_3", StringType()) \
    .add("large_text_col_4", StringType()) \
    .add("large_text_col_5", StringType()) \
    .add("large_text_col_6", StringType()) \
    .add("large_text_col_7", StringType()) \
    .add("large_text_col_8", StringType()) \
    .add("large_text_col_9", StringType())

def read_kafka_stream():
    kafka_stream = (spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafka_bootstrap_servers_tls ) 
      .option("subscribe", topic )
      .option("failOnDataLoss","false")
      .option("kafka.security.protocol", "SASL_SSL")
      .option("kafka.sasl.mechanism", "PLAIN") 
      .option("kafka.sasl.jaas.config", f'kafkashaded.org.apache.kafka.common.security.plain.PlainLoginModule required username="{kafka_api_key}" password="{kafka_api_secret}";')
      .option("minPartitions",12)
      .load()
      .select(from_json(col("value").cast("string"), schema).alias("data"), "topic", "partition", "offset", "timestamp", "timestampType" )
      .select("topic", "partition", "offset", "timestamp", "timestampType", "data.*")
    )
    return kafka_stream
```

## 설명:

<div class="content-ad"></div>

- Connection Setup: 특정 부트스트랩 서버를 사용하여 Kafka에 연결하고 SASL_SSL과 같은 보안 설정을 포함하여 암호화 및 인증된 데이터 전송을 합니다.
- Topic Subscription: 지정된 Kafka 주제에 가입하여 계속해서 새로운 데이터를 수신합니다.
- Stream Configuration: 잠재적인 데이터 손실을 처리하고 여러 파티션 간의 데이터를 처리 속도를 높이기 위해 견고하게 구성됩니다.
- Data Transformation: 수신된 JSON 메시지를 설정된 스키마에 따라 디코딩하기 위해 from_json을 사용하며 Spark 내에서 구조화된 형식으로 변환합니다.
- Metadata Extraction: Kafka 주제, 파티션 및 메시지 타임 스탬프와 같은 필수 메타데이터를 추출합니다.

이 설정은 Kafka에서 Spark로의 데이터 흡수를 최적화하고 데이터를 추가적으로 처리하거나 Delta Lake와 같은 저장 시스템으로 통합하기 위한 준비를 합니다.

## Databricks Jobs을 위한 추가 코드

구성: 이 방법은 Databricks 작업 및 클러스터 리소스를 설정하는 것을 포함하며 유연한 스케줄링 및 흡수 프로세스 모니터링을 가능하게 합니다만, 올바른 컴퓨팅을 선택하는 것을 이해해야 합니다.

<div class="content-ad"></div>

```js
(  
  read_kafka_stream()
  .writeStream
  .option("checkpointLocation",checkpoint_location_for_delta)
  .trigger(processingTime='1 second')
  .toTable(target)
)
```

## Delta Live Tables에 대한 추가 코드

구성: Delta Live Tables는 인프라를 자동으로 관리하여 데이터 파이프라인을 구성하는 간단하고 선언적인 방식을 제공합니다.

이 코드 스니펫은 Delta Live Tables (DLT) API를 사용하여 Kafka에서 스트리밍 데이터를 수신하는 데이터 테이블을 정의합니다. @dlt.table 데코레이터를 사용하여 테이블의 이름을 지정하고 (원하는 테이블 이름으로 대체), 파이프라인을 매 초 Kafka를 폴링하도록 설정합니다. 이 신속한 폴링은 거의 실시간 데이터 처리 요구를 지원합니다. dlt_kafka_stream() 함수는 read_kafka_stream()을 호출하여 Kafka 스트리밍을 DLT로 직접 통합하여 Databricks 환경 내에서의 관리 및 운영을 간소화합니다.

<div class="content-ad"></div>

```js
@dlt.table(name="여기에 바꿔야 할 DLT 테이블 이름",
           spark_conf={"pipelines.trigger.interval" : "1 초"})
def dlt_kafka_stream():
    read_kafka_stream()
```

# 결론

저희의 벤치마크 결과에 따르면, 델타 라이브 테이블 서버리스는 대기 시간 성능과 운영 간소화 측면에서 우수한 성과를 보여주며, 다양한 데이터 부하가 있는 시나리오에 매우 적합합니다. 한편, 데이타브릭스 잡과 델타 라이브 테이블도 실용적인 솔루션을 제공합니다.

- 대기 시간 비교: 델타 라이브 테이블의 서버리스 버전은 모든 측정 백분위수에서 대기 시간 측면에서 다른 것들을 능가합니다.
- 운영 복잡성: 델타 라이브 테이블 서버리스는 수동 인프라 관리가 필요하지 않은 가장 단순한 설정을 제공하며, 그 다음으로 델타 라이브 테이블, 그리고 데이타브릭스 잡이 이어집니다. 

<div class="content-ad"></div>

## Delta Live Tables Serverless가 표준 Delta Live Tables를 능가하는 이유

Delta Live Tables Serverless가 표준 Delta Live Tables보다 우수한 성능을 발휘하는 핵심 요소는 Stream Pipelining을 활용한 것입니다. 표준 구조화된 스트리밍과 달리 DLT Serverless는 마이크로배치를 동시에 처리함으로써 처리량을 향상시키고 응답 시간을 크게 향상시킵니다. 이 기능을 통해 전체 컴퓨팅 자원 활용도도 크게 향상됩니다. Stream Pipelining은 서버리스 DLT 파이프라인의 기본 기능이며, 데이터 입력과 같은 스트리밍 데이터 워크로드를 위해 성능을 최적화합니다.

또한, 수직 자동 스케일링은 DLT Serverless의 효율성을 향상시키는 중요한 역할을 합니다. 이 기능은 Databricks Enhanced Autoscaling의 수평 자동 스케일링 기능을 보완하여 DLT 파이프라인을 실행하는 데 필요한 가장 비용 효율적인 인스턴스 유형을 자동으로 선택합니다. 더 많은 자원이 필요할 때 적절하게 대규모 인스턴스로 확장하고, 메모리 사용률이 지속적으로 낮을 때 축소합니다. 이러한 다이내믹한 조정은 실시간 요구 사항에 기반하여 드라이버 및 워커 노드를 최적으로 조정하여 중요한 역할을 합니다. 제품 모드에서 파이프라인을 업데이트하거나 개발 중 수동으로 조정하는 경우에도, 수직 자동 스케일링은 메모리 부족 오류가 발생한 후 신속하게 더 큰 인스턴스를 할당하여 서비스 중단 없이 자원 할당을 최적화합니다.

Stream Pipelining과 수직 자동 스케일링은 운영 복잡성을 감소시키고 Serverless DLT 파이프라인의 신뢰성 및 비용 효율성을 향상시킵니다. 이러한 기능을 통해 Serverless DLT는 수동 개입을 최소화하면서 변동하는 데이터 입력 부하를 처리하는 데 이상적인 선택지가 되어 더 빠르고 효율적인 데이터 파이프라인 실행을 실현합니다.

<div class="content-ad"></div>

# 각주:

이 글을 읽어 주셔서 감사합니다. 도움이 되었거나 즐거우셨다면 박수를 치는 것을 고려해 주시고, 다른 사람들이 이를 발견할 수 있도록 도와주세요. 더 많은 정보를 찾으려면 제 웹사이트 CanadianDataGuy.com을 방문하시고, 더 많은 통찰력 있는 콘텐츠를 제공하기 위해 제 팔로우도 잊지 마세요. 여러분의 지원과 피드백은 제게 귀중하며, 제 작품에 대한 여러분의 참여를 감사히 여깁니다.