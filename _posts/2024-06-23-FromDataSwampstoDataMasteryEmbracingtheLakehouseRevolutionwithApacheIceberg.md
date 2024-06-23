---
title: "데이터 늪에서 데이터 마스터까지 Apache Iceberg와 함께하는 레이크하우스 혁명 "
description: ""
coverImage: "/assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_0.png"
date: 2024-06-23 16:31
ogImage: 
  url: /assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_0.png
tag: Tech
originalTitle: "From Data Swamps to Data Mastery: Embracing the Lakehouse Revolution with Apache Iceberg"
link: "https://medium.com/deutsche-telekom-gurgaon/from-data-swamps-to-data-mastery-embracing-the-lakehouse-revolution-with-apache-iceberg-a26feffc70e6"
---


<img src="/assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_0.png" />

우리의 데이터 인프라는 처음에 Amazon S3를 사용한 데이터 레이크와 Amazon Redshift를 사용한 데이터 웨어하우스의 조합으로 이루어져 있었습니다.

이 구성은 대량의 데이터를 저장하고 분석할 수 있는 장점이 있었지만, 추가 저장 공간 및 유지보수 문제와 ACID 규칙 준수를 지원하지 않는 등 여러 가지 도전 과제가 있었습니다.

# 목표

<div class="content-ad"></div>

호수집 구조로 전환하는 목표는 데이터 레이크와 데이터 웨어하우스의 최상의 특징을 결합하는 것이었습니다. 이미 완전히 발달한 데이터 레이크가 있었기 때문에, 우리의 초점은 데이터 웨어하우스의 기능을 통합하는 데 있었습니다.

## 데이터 레이크하우스와 데이터 레이크 및 데이터 웨어하우스의 차이는 무엇인가요?

이름에서 알 수 있듯이 '데이터 레이크하우스'는 데이터 레이크와 데이터 웨어하우스의 최상의 특징을 결합합니다. 본질적으로 데이터 레이크하우스는 데이터 레이크의 기능을 확장하여 데이터 웨어하우스와 유사한 기능을 통합합니다. 데이터 레이크의 유연성, 확장 가능성 및 비용 효율성을 제공하는 한편, 데이터 웨어하우스와 주로 관련된 튼튼한 데이터 관리와 ACID (원자성, 일관성, 분리, 지속성) 트랜잭션을 제공하려고 합니다.

# 왜 아파치 아이스버그를 선택했나요?

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_1.png" />

- ACID 트랜잭션: ACID 트랜잭션을 지원하여 데이터 일관성과 신뢰성을 보장하고, 동시에 쓰기 및 읽기를 허용하여 데이터 오염이 발생하지 않습니다.
- 비용 및 유지보수 감소: Redshift와 연관된 높은 저장 및 라이선스 비용을 최소화하며, 기본적으로 compaction 및 압축(zstd)을 지원합니다.
- 성능 최적화: 메타데이터 가지치기, 파티셔닝 및 데이터 건너뛰기와 같은 기능을 통해 쿼리 성능을 크게 향상시킵니다.
- 호환성: Apache Spark, Flink, Presto 등 여러 데이터 처리 엔진과 함께 작동하여 작업에 최적인 도구를 선택할 수 있는 유연성 제공.
- Parquet, ORC, Avro와 같은 파일 형식 지원.
- 기존의 AWS 생태계 및 Athena, Glue, Catalog, EMR 등과 시프트레이엘튼랏하는 탐바.
- 성능 향상: 빠르게 쿼리되어 데이터를 효율적으로 검색할 수 있습니다.
- 통합 데이터 처리: 일괄 및 스트리밍 데이터 처리에 대해 통합된 경험을 제공하여 실시간 및 기존 데이터의 원활한 통합 및 처리를 가능하게 합니다.

<img src="/assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_2.png" />

# Iceberg 아키텍처:

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_3.png)

![Image 2](/assets/img/2024-06-23-FromDataSwampstoDataMasteryEmbracingtheLakehouseRevolutionwithApacheIceberg_4.png)

# Apache Iceberg을 활용한 Lakehouse 전환 단계

환경 설정:


<div class="content-ad"></div>

- 저장소 구성: Amazon S3와 같은 확장 가능한 저장소 솔루션을 설정하여 원본 데이터와 처리된 데이터를 저장하세요. 이미 저희와 같이 S3를 활용 중이라면 데이터 및 메타데이터를 저장할 대상 버킷을 정의하세요.
- Iceberg 설치 및 구성: EMR을 사용 중이므로 Spark 세션을 생성할 때 Iceberg 관련 설정을 추가해야 합니다.

```js
spark = SparkSession.builder \
    .appName("user_device_data") \
    .master("yarn") \
    .config("spark.sql.defaultCatalog", catalog) \
    .config(f"spark.sql.catalog.{catalog}", "org.apache.iceberg.spark.SparkCatalog") \
    .config(f"spark.sql.catalog.{catalog}.warehouse",
            "<Your S3 Warehouse Path>") \
    .config("spark.sql.catalog.glue_catalog.catalog-impl", "org.apache.iceberg.aws.glue.GlueCatalog") \
    .config("spark.sql.catalog.glue_catalog.io-impl", "org.apache.iceberg.aws.s3.S3FileIO") \
    .config("spark.sql.extensions", "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions") \
```

데이터 이전:

- 데이터레이크 — 기존 Parquet에서 Iceberg로 데이터 마이그레이션: 먼저 테이블을 만들었고, 기존 데이터레이크에서 데이터를 읽어와 Apache Spark를 사용하여 Iceberg 테이블에 기록함으로써 메타데이터가 올바르게 캡처되도록합니다.
- 데이터웨어하우스 — Redshift 데이터를 Iceberg 형식으로 투입: Redshift에서 언로드한 데이터를 S3로 복사한 후, 데이터레이크와 동일한 접근 방식을 따랐습니다.

<div class="content-ad"></div>

아래와 같은 방법으로 인플레이스 마이그레이션을 수행할 수 있습니다:

- add_files 사용
- migrate 사용

[기존 데이터 레이크를 Apache Iceberg를 사용한 트랜잭션 데이터 레이크로 마이그레이션하기](https://aws.amazon.com/blogs/big-data/migrate-an-existing-data-lake-to-a-transactional-data-lake-using-apache-iceberg/)

기존 ETL 프로세스에서의 조정:

<div class="content-ad"></div>

- 우리는 모든 ETL 작업에 대한 싱크 구성을 변경하여 데이터 아이스버그 형식으로 쓰게 했습니다. 위에서 언급한 구성은 스파크 세션을 만들 때 사용되었습니다.

데이터 거버넌스 및 메타데이터 관리:

Iceberg 테이블의 유지 보수 작업.

- Compact : 우리는 다시 쓰고 결과 파일의 원하는 크기로 재작성하기 위해 rewriteDataFiles 절차를 실행합니다. 이것은 읽기 시간을 최적화하는 데 도움이 됩니다.

<div class="content-ad"></div>


('write.parquet.target-file-size-bytes '='52428800') 
# 약 이만큼의 바이트를 대상으로 생성된 파일의 크기를 제어합니다.

2. 스냅샷 만료: 분석에 더 이상 필요하지 않은 데이터에 대해 스냅샷 만료를 실행하여 불필요한 저장 비용을 피합니다. 만료된 스냅샷과 연결된 매니페스트 목록, 매니페스트 및 데이터 파일은 여전히 유효한 스냅샷과 연관되어 있지 않은 한 스냅샷 삭제 시에 삭제됩니다.

우리는 이 작업을 수행하기 위해 expireSnapshots 프로시저를 실행합니다.

3. 오래된 메타데이터 파일 제거: Iceberg는 새 메타데이터 파일이 생성될 때 오래된 메타데이터 파일을 삭제하는 설정을 활성화할 수 있습니다. 또한 테이블이 보유해야 하는 메타데이터 파일 수를 설정할 수 있습니다. 우리는 그 수를 5로 설정했습니다.


<div class="content-ad"></div>

```js
write.metadata.delete-after-commit.enabled  true
write.metadata.previous-versions-max 5
```

4. Orphan 파일 삭제 : Orphan 파일 제거를 위해 deleteOrphanFiles 절차를 실행하여 필요 없는 파일을 저장하지 않습니다. 이러한 파일들은 정기적인 정리 프로세스에서 선택되지 않습니다.

쿼리 및 분석:

- 쿼리 최적화: Iceberg는 메타데이터 가지치기(metadata pruning) 및 프리디케이트 푸시다운(predicate pushdown)과 같은 기능을 지원하여 쿼리 성능을 최적화할 수 있습니다. 데이터와 메타데이터 모두에 대한 쿼리 엔진으로 Athena를 사용하고 있습니다.

<div class="content-ad"></div>

메타데이터 쿼리 치트 시트 : [https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-table-metadata.html](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-table-metadata.html)

- 실시간 분석 활성화: 스파크 ETL 프로세스에서 데이터 수집 및 업데이트가 발생하여 배치 및 스트리밍 데이터 처리에 통합된 경험을 제공합니다.

# Apache Iceberg 구현의 장점

비용 효율성:

<div class="content-ad"></div>

- 저장 비용 절감: Apache Iceberg는 기본 Z-표준 (zstd) 압축을 사용하여 저장 공간 요구 사항을 크게 줄입니다. 또한 파티션 분할을 지원하여 데이터 스캔을 제한하여 저장 공간 사용을 최적화합니다.
- 중복 데이터 웨어하우징 솔루션 소거: Iceberg의 ACID 규정 준수로 기존 데이터 웨어하우징 솔루션이 불필요해집니다. Amazon S3의 저장 비용은 Redshift의 그것보다 상당히 낮기 때문에 Redshift 라이선싱 비용을 상당히 절약할 수 있습니다.

Apache Iceberg의 채택으로 일반 Parquet 형식으로 데이터를 저장하는 비용과 전체 S3 비용 모두 30%의 저장 비용 절감과 20%의 S3 비용 절감을 이끌었습니다.

성능 향상:

- 쿼리 성능 개선: Iceberg의 최적화된 데이터 관리 및 인덱싱으로 쿼리 성능과 데이터 검색 시간이 상당히 향상되었습니다.

<div class="content-ad"></div>

역사적 데이터 수정:

- 간편화된 데이터 업데이트: 이전에는 역사적 데이터를 수정하기 위해 작은 배치 작업을 작성해야 했습니다. 아이스버그를 사용하면 몇 가지 업데이트 명령을 실행함으로써 이를 달성할 수 있어, 프로세스가 간소화되었습니다.  

접근 제어:

- 간편화된 행 수준 접근: Redshift에서 서로 다른 국가에 대한 행 수준 접근을 제공하는 것은 복잡했습니다. 아이스버그를 통해 데이터 파티셔닝을 사용하여 특정 버킷에 대한 접근 정책을 쉽게 구현할 수 있어, 접근 관리가 간소화됩니다.

<div class="content-ad"></div>

Apache Iceberg를 구현함으로써 비용 효율성, 향상된 성능, 간단화된 기존 데이터 수정 및 향상된 액세스 관리를 달성했습니다.

# 결론

여러 데이터셋을 Apache Iceberg로 이관하는 작업을 성공적으로 완료했으며 이미 상당한 비용 및 성능 이점을 확인하고 있습니다. 레이크하우스 아키텍처로의 전환은 데이터 레이크와 데이터 웨어하우스의 최상의 기능을 활용할 수 있게 해주어 더 효율적이고 확장 가능한 데이터 인프라를 구축하게 되었습니다.

이 구현 기간 동안 빈말 야다브와 시바무 구프타에게 놀라운 헌신과 값진 기여에 진심으로 감사드립니다.

<div class="content-ad"></div>

사실, 한국어로 "테이블" 태그를 "Markdown" 형식으로 변환하면 되는 것 같아요.