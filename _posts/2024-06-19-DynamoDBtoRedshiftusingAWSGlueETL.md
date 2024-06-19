---
title: "AWS Glue ETL을 사용하여 DynamoDB에서 Redshift로 데이터 이전하기"
description: ""
coverImage: "/assets/img/2024-06-19-DynamoDBtoRedshiftusingAWSGlueETL_0.png"
date: 2024-06-19 16:04
ogImage: 
  url: /assets/img/2024-06-19-DynamoDBtoRedshiftusingAWSGlueETL_0.png
tag: Tech
originalTitle: "DynamoDB to Redshift using AWS Glue ETL"
link: "https://medium.com/@taniabanerjee92/dynamodb-to-redshift-using-aws-glue-etl-e17bc845b176"
---


AWS Glue ETL을 사용하여 DynamoDB에서 Redshift로의 파이프라인을 구축하는 과정은 여러 단계로 이루어져 있습니다. 아래에 이를 설정하는 자세한 가이드가 있어요:

단계 1: DynamoDB와 Redshift 설정하기

1. DynamoDB:
이미 하지 않았다면 DynamoDB 테이블을 생성하고 데이터로 채워 넣어주세요.

2.Redshift:
Amazon Redshift 클러스터를 설정하세요.
Redshift에 DynamoDB 테이블 구조와 일치하도록 데이터베이스와 테이블을 생성해주세요.

<div class="content-ad"></div>

단계 2: DynamoDB용 AWS Glue 크롤러 생성하기

1. AWS Glue 콘솔을 엽니다.
2. 새 크롤러를 생성합니다:
이름: 크롤러에 이름을 지정합니다.
데이터 원본: DynamoDB를 선택하고 테이블을 선택합니다.
IAM 역할: 없는 경우 필요한 권한을 가진 IAM 역할을 생성합니다.
데이터베이스: 기존의 Glue 데이터베이스를 선택하거나 새 데이터베이스를 생성합니다.
실행 빈도: 요구 사항에 따라 설정합니다.

3. 크롤러 실행:
이 작업을 통해 Glue 데이터 카탈로그에 DynamoDB 테이블을 위한 테이블이 생성됩니다.

단계 3: AWS Glue ETL 작업 생성하기

<div class="content-ad"></div>

1. AWS Glue 콘솔을 엽니다.
2. 새 작업을 만듭니다:
이름: 작업에 이름을 지정합니다.
IAM 역할: 동일한 역할 또는 필요한 권한이 있는 다른 역할을 사용합니다.
유형: "Spark"를 선택합니다.
Glue 버전: 적절한 Glue 버전을 선택합니다.
보안 구성, 스크립트 라이브러리 및 작업 매개변수: 필요에 따라 구성합니다.
작업 북마킹: 처리된 데이터를 추적하려면 활성화합니다.

3. 스크립트 편집기:
Glue Studio 시각적 편집기를 사용하거나 스크립트를 직접 편집할 수 있습니다.

단계 4: ETL 스크립트 작성

다음은 다이나모DB에서 Redshift로 데이터를 이동하는 예제 스크립트입니다:

<div class="content-ad"></div>

```python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

# Glue 컨텍스트 초기화
args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# DynamoDB 테이블을 소스로 정의
dynamodb_table = "dynamodb_table_name"
datasource0 = glueContext.create_dynamic_frame.from_catalog(
    database="your_glue_database",
    table_name=dynamodb_table
)

# 필요한 변환 작업 적용
applymapping1 = ApplyMapping.apply(
    frame=datasource0,
    mappings=[
        ("dynamodb_column1", "string", "redshift_column1", "string"),
        ("dynamodb_column2", "number", "redshift_column2", "int"),
        # 필요한 경우 더 많은 열 추가
    ]
)
```  

<div class="content-ad"></div>

# Redshift 연결 옵션 정의하기
redshift_tmp_dir = “s3://your-bucket/temp-dir/”
redshift_connection_options = '
“url”: “jdbc:redshift://your-redshift-cluster:5439/your_database”,
“user”: “your_redshift_user”,
“password”: “your_redshift_password”,
“dbtable”: “your_redshift_table”,
“redshiftTmpDir”: redshift_tmp_dir
'

# Redshift로 쓰기
datasink4 = glueContext.write_dynamic_frame.from_jdbc_conf(
frame = applymapping1,
catalog_connection = “your_redshift_connection”,
connection_options = redshift_connection_options
)

# 작업 완료하기
job.commit()

단계 5: Glue Job 실행 및 예약하기

<div class="content-ad"></div>

1. 작업 실행
AWS Glue 콘솔에서 작업을 수동으로 실행할 수 있습니다.
2. 작업 일정 설정:
Glue 트리거를 사용하여 특정 간격에 작업을 실행할 수 있는 일정을 설정하세요.

단계 6: ETL 작업 모니터링 및 관리

1. 모니터링:
AWS Glue의 모니터링 기능을 사용하여 작업 실행, 오류 및 성능을 추적하세요.
2. 오류 처리:
필요한 경우 스크립트에 오류 처리를 구현하세요.
3. 최적화:
특히 대규모 데이터 집합을 처리할 때 성능을 위해 ETL 작업을 최적화하세요.

이러한 단계를 따르면 AWS Glue ETL 작업을 사용하여 DynamoDB에서 Redshift로 데이터를 전송하는 파이프라인을 설정할 수 있습니다. 감사합니다.