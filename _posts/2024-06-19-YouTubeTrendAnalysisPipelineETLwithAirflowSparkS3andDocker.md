---
title: "유튜브 트렌드 분석 파이프라인 Airflow, Spark, S3 및 Docker를 이용한 ETL"
description: ""
coverImage: "/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_0.png"
date: 2024-06-19 09:37
ogImage: 
  url: /assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_0.png
tag: Tech
originalTitle: "YouTube Trend Analysis Pipeline: ETL with Airflow, Spark, S3 and Docker"
link: "https://medium.com/@swathireddythokala16/youtube-trend-analysis-pipeline-etl-with-airflow-spark-s3-and-docker-85a7d76992eb"
---


이 기사에서는 Apache Airflow와 PySpark를 사용하여 자동 ETL (추출, 변환, 로드) 파이프라인을 만드는 방법을 안내합니다. 이 파이프라인은 YouTube Data API에서 트렌드 비디오 데이터를 가져와 처리한 후 처리된 데이터를 S3에 저장할 것입니다.

Twitter API를 사용한 파이프라인을 보여주는 Darshil Parmar의 YouTube 비디오를 시청한 후, 유사한 프로젝트에 도전하기로 영감을 받았습니다. 그러나 Twitter API의 가격 정책 변경으로 인해, 시청자가 YouTube Data API를 대체로 제안했고 이것이 제 흥미를 자극했습니다.

프로젝트에 돌입하기 전에 두 가지 필수 사항이 있습니다:

1. Youtube Data API 키 획득

<div class="content-ad"></div>

- Google Developers Console을 방문해 주세요.
- 새 프로젝트를 생성해 주세요.
- "YouTube Data API"를 검색하고 활성화해 주세요.
- 새 자격 증명을 생성하고 프로젝트에서 나중에 사용할 API 키를 복사해 주세요.

자세한 지침은 YouTube Data API 시작 가이드를 참조해 주세요.

2. AWS 액세스 키 ID 및 비밀 액세스 키 획득

- AWS Management Console에 로그인해 주세요.
- IAM(Identity and Access Management) 섹션으로 이동하고 새 사용자를 생성해 주세요.
- 필요한 S3 액세스 정책을 부여하고 액세스 키를 생성해 주세요.
- 프로젝트에서 사용할 액세스 키 ID와 비밀 액세스 키를 안전하게 저장해 주세요.

<div class="content-ad"></div>

이제 실제 프로젝트를 시작하겠습니다! 준비됐나요 여러분!!

![YouTube Trend Analysis Pipeline ETL with Airflow, Spark, S3, and Docker](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_0.png)

이 글은 4가지 주요 단계로 구성되어 있어요:

- 소프트웨어 설치 및 설정
- Youtube Data API에서 데이터 추출
- PySpark를 사용하여 데이터 변환
- AWS S3로 데이터 로드

<div class="content-ad"></div>

# 1. 소프트웨어 설치 및 설정:

- VS Code — [VS Code 다운로드 및 설치](https://code.visualstudio.com/).
- Docker Desktop — [Docker Desktop 다운로드 및 설치](https://www.docker.com/products/docker-desktop).
- (선택사항) Windows Subsystem for Linux (WSL) — 데이터 엔지니어링에 사용되는 Apache Airflow 및 PySpark와 같은 많은 도구 및 라이브러리가 Unix 계열 시스템을 위해 개발되었습니다. 이러한 도구를 Windows에서 사용할 때 발생할 수 있는 호환성 문제를 피하기 위해 WSL을 통해 네이티브 Linux 환경에서 실행할 수 있습니다.
  - ` 관리자 권한으로 PowerShell을 엽니다.
  - ` 다음 명령을 실행하세요: wsl --install.
  - ` 명령에 따라 WSL을 설치하고 Microsoft Store에서 Linux 배포판(예: Ubuntu)을 선택하세요.
  - ` Linux 배포판에 사용자 이름 및 암호를 설정하세요.

이 프로젝트를 실행하는 데 WSL이 반드시 필요한 것은 아닙니다. Docker Desktop은 Windows에서 네이티브로 실행될 수 있으며 Docker 자체가 관리하는 가벼운 Linux 가상 머신(VM)을 사용합니다. 그러나 Docker Desktop과 함께 WSL을 사용하면 Windows에서 직접 Linux 명령 및 작업을 실행할 수 있어 보다 네이티브한 개발 경험을 제공합니다.

이제 설정을 시작해 봅시다.

<div class="content-ad"></div>

부분 1 — 도커 이미지 만들기

- 프로젝트용 새 폴더를 만들고 "Airflow-Project"로 이름을 지어주세요.
- 해당 폴더에서 명령 프롬프트를 엽니다.
- 명령 프롬프트에서 아래 명령을 실행하세요:

```bash
code .
```

- 이 명령은 VS Code에서 해당 폴더를 프로젝트로 엽니다.
- VS Code에서 "dockerfile"이라는 새 파일을 만들고 아래 코드를 붙여넣으세요:

<div class="content-ad"></div>

```js
FROM apache/airflow:latest

# 시스템 종속성을 설치하기 위해 루트 사용자로 전환합니다
USER root

# git, OpenJDK를 설치하고 apt 캐시를 정리합니다
RUN apt-get update && \
    apt-get -y install git default-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Python 패키지를 설치하기 위해 airflow 사용자로 전환합니다
USER airflow

# 필요한 Python 패키지를 설치합니다
RUN pip install --no-cache-dir pyspark pandas google-api-python-client emoji boto3
```

이 Docker 파일은 프로젝트를 실행하는 데 필요한 모든 패키지를 포함하고 있어요.

- 파일을 마우스 오른쪽 버튼으로 클릭하고 VS Code에서 "이미지 빌드" 옵션을 선택하세요. 이름을 입력하라는 프롬프트가 나타나면 "airflow-project"를 입력하세요. 이 명령은 Docker 이미지를 생성합니다. 그러나 이미지를 사용하려면 docker-compose.yml 파일을 생성하고 이미지를 사용하도록 구성해야 합니다.

(재미있는 사실: 파일에서 Python 설치가 없는 이유 궁금하신가요? 실제로 Dockerfile에서 사용된 기본 이미지인 apache/airflow:latest에는 Python이 이미 설치되어 있어요. 왜냐하면 Airflow 자체가 Python으로 작성되어 있기 때문에 주로 워크플로 및 작업 정의에 Python을 사용합니다. 따라서 Dockerfile에서 별도로 Python을 설치할 필요가 없답니다!)

<div class="content-ad"></div>

파트 2 — 도커 컴포즈 파일 생성하기

도커 컴포즈를 사용하면 멀티 컨테이너 도커 애플리케이션을 쉽게 다룰 수 있습니다. 이를 통해 단일 명령으로 여러 도커 컨테이너를 정의하고 실행할 수 있으며 각 서비스의 환경 변수, 볼륨, 포트 및 기타 설정을 명확하고 조직적인 방식으로 구성할 수 있습니다. 도커 컴포즈를 사용하면 단일 명령어인 docker-compose up 또는 docker-compose down을 사용하여 여러 서비스를 쉽게 시작, 중지 및 관리할 수 있습니다.

- "docker-compose.yml" 파일을 생성하고 다음 코드를 파일에 붙여넣습니다:

```js
version: '3'
services:

  airflowproject:
    image: airflow-project:latest
    environment:
      - AWS_ACCESS_KEY_ID=your-aws-access-key
      - AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
      - YOUTUBE_API_KEY=your-youtube-api-key
    volumes:
      - ./airflow:/opt/airflow
    ports:
      - "8080:8080"
    command: airflow standalone
```

<div class="content-ad"></div>

- 이제 파일을 마우스 오른쪽 버튼으로 클릭한 후 VS Code에서 'Compose Up' 옵션을 선택하세요. 환경을 설정하기 위해 클릭하세요.
- 깜짝 놀랄 일이 벌어졌어요! 이 작업을 완료한 후에는 VS Code 프로젝트 디렉토리에 "airflow"라는 새 폴더가 나타날 수 있습니다.

Docker 데스크톱을 열어서 모든 것이 올바르게 완료되었는지 확인하세요. 올바르게 완료된 경우 다음과 같은 화면이 표시됩니다.

![이미지](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_1.png)

- 이제 Airflow 프로젝트를 클릭하여 Airflow가 8080 포트에서 실행 중임을 나타내는 로그가 표시되는 화면을 엽니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_2.png)

- 포트를 클릭하면 Airflow 로그인 페이지로 이동합니다. 이 링크를 처음 열어보는 경우 자격 증명을 제공해야 합니다.
- 사용자 이름은 "admin"이고 비밀번호는 compose up 명령을 실행한 후 생성된 Airflow 폴더 내의 "standalone_admin_password.txt" 파일에 있습니다.

![이미지](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_3.png)

- 로그인 페이지에서 자격 증명을 입력한 후, 로컬 호스트에서 Airflow가 실행 중인 것을 확인할 수 있습니다. 다음과 같이 나타납니다:


<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_4.png" />

당신의 환경 설정 완료입니다! 휴―!!

# 2. YouTube 데이터 API에서 데이터 추출하기:

<div class="content-ad"></div>

- Airflow 폴더 아래에 "dags"라는 이름의 폴더를 만들고, dags 폴더 아래에 "youtube_etl_dag.py"라는 파이썬 파일을 만듭니다.
- 이제 "youtube_etl_dag.py" 파일에 다음을 import하세요.

```js
import logging
import os
import re
import shutil
from datetime import datetime, timedelta

import boto3
import emoji
import pandas as pd
from googleapiclient.discovery import build
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date, udf
from pyspark.sql.types import (DateType, IntegerType, LongType, StringType,
                               StructField, StructType)

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
```

- 이 프로젝트를 실행하는 데 위의 모든 라이브러리가 필요합니다(코드 작성을 시작하면 모두 유용해집니다)
- VS Code에서 오류가 발생하는 것을 볼 수 있습니다. 그 이유는 모든 종속성이 도커에 설치되어 있지만 로컬 머신에는 설치되어 있지 않기 때문이므로 신경 쓰지 마십시오.
- Airflow에서 구문 오류가 있으면 화면 상단에 표시되고, 논리 오류/예외는 Airflow 로그에서 확인할 수 있습니다.

```js
# DAG와 기본 인수 정의
default_args = {
    'owner': 'airflow',  # DAG 소유자
    'depends_on_past': False,  # 과거 DAG 실행에 종속하는지 여부
    'email_on_failure': False,  # 실패 시 이메일 알림 비활성화
    'email_on_retry': False,  # 재시도 시 이메일 알림 비활성화
    'retries': 1,  # 재시도 횟수
    'retry_delay': timedelta(minutes=5),  # 재시도 간의 지연 시간
     'start_date': datetime(2023, 6, 10, 0, 0, 0),  # 매일 자정(00:00) UTC에 실행
}

dag = DAG(
    'youtube_etl_dag',  # DAG 식별자
    default_args=default_args,  # 기본 인수 할당
    description='간단한 ETL DAG',  # DAG 설명
    schedule_interval=timedelta(days=1),  # 일별 스케줄 간격
    catchup=False,  # 누락된 DAG 실행을 복구하지 않음
)
```  

<div class="content-ad"></div>

매일 자정(0시)에 실행되는 DAG인 'youtube_etl_dag'을 정의하고 있습니다. 이 DAG은 Airflow에서 관리 및 트리거되며, VS Code에서 별도로 실행할 필요가 없습니다. Python 파일을 업데이트하면 Airflow에서 자동으로 변경 사항을 감지하고 반영할 것입니다.

현재 Airflow에는 DAG이 표시되지만 아직 정의된 작업이 없어서 어떤 작업도 표시되지 않습니다. DAG를 기능적으로 만들기 위해 데이터 추출 작업을 만들어봅시다.

```js
# YouTube API에서 데이터를 추출하기 위한 Python callable 함수
def extract_data(**kwargs):
    api_key = kwargs['api_key']
    region_codes = kwargs['region_codes']
    category_ids = kwargs['category_ids']
    
    df_trending_videos = fetch_data(api_key, region_codes, category_ids)
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Youtube_Trending_Data_Raw_{current_date}'
    # DataFrame을 CSV 파일로 저장
    df_trending_videos.to_csv(output_path, index=False)

def fetch_data(api_key, region_codes, category_ids):
    """
    YouTube API에서 여러 나라와 카테고리의 인기 동영상 데이터를 가져옵니다.
    """
    # 비디오 데이터를 저장할 빈 리스트를 초기화합니다.
    video_data = []

    # YouTube API 서비스 빌드
    youtube = build('youtube', 'v3', developerKey=api_key)

    for region_code in region_codes:
        for category_id in category_ids:
            # 각 지역 및 카테고리에 대해 next_page_token을 None으로 초기화
            next_page_token = None
            while True:
                # 인기 동영상을 가져오기 위해 YouTube API에 요청을 보냅니다.
                request = youtube.videos().list(
                    part='snippet,contentDetails,statistics',
                    chart='mostPopular',
                    regionCode=region_code,
                    videoCategoryId=category_id,
                    maxResults=50,
                    pageToken=next_page_token
                )
                response = request.execute()
                videos = response['items']

                # 각 비디오를 처리하고 데이터를 수집합니다.
                for video in videos:
                    video_info = {
                        'region_code': region_code,
                        'category_id': category_id,
                        'video_id': video['id'],
                        'title': video['snippet']['title'],
                        'published_at': video['snippet']['publishedAt'],
                        'view_count': int(video['statistics'].get('viewCount', 0)),
                        'like_count': int(video['statistics'].get('likeCount', 0)),
                        'comment_count': int(video['statistics'].get('commentCount', 0)),
                        'channel_title': video['snippet']['channelTitle']
                    }
                    video_data.append(video_info)

                # 결과의 더 많은 페이지가 있는 경우 다음 페이지 토큰을 가져옵니다.
                next_page_token = response.get('nextPageToken')
                if not next_page_token:
                    break

    return pd.DataFrame(video_data)

# DAG를 위한 데이터 추출 작업 정의
extract_task = PythonOperator(
    task_id='extract_data_from_youtube_api',
    python_callable=extract_data,
    op_kwargs={
        'api_key': os.getenv('YOUTUBE_API_KEY'),
        'region_codes': ['US', 'GB', 'IN', 'AU', 'NZ'],
        'category_ids': ['1', '2', '10', '15', '20', '22', '23']
    },
    dag=dag,
)

extract_task # 이 작업을 실행하도록 DAG를 설정함
```

이 코드에서 두 가지 주요 작업이 이루어지고 있습니다:

<div class="content-ad"></div>

- DAG에 extract_task라는 작업을 만들고 있습니다.
- extract_task에서 호출되는 callable 함수인 extract_data를 정의하고 있습니다. 이 함수는 YouTube Data API에서 데이터를 가져와 "Youtube_Trending_Data_Raw"로 시작하는 CSV 파일에 pandas DataFrame을 사용하여 저장합니다.

YouTube Data API 문서를 참조하여 API의 다른 부분에서 사용 가능한 데이터에 대해 자세히 이해할 수 있습니다. 우리는 트렌딩 비디오 데이터에 관심이 있으므로 API의 해당 부분에 집중할 것입니다. next_page_token은 모든 페이지에서 데이터를 검색하도록 보장합니다.

코드를 수정한 후 Airflow 페이지에 변경 사항이 반영되어야 합니다. DAG를 수동으로 실행하려면 왼쪽 상단에 있는 실행 버튼을 클릭하시면 됩니다. 그래프에서 작업 상태 (대기, 실행 중, 성공 등)는 다른 색상으로 나타납니다. DAG가 실행 중일 때 로그를 보실 수도 있습니다.

<img src="/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_5.png" />

<div class="content-ad"></div>

런 버튼을 클릭하면 데이터를 가져오고 파일에 저장하는 데 시간이 걸립니다. 작업의 각 단계에서 그래프 색상이 변경되는 것을 볼 수 있을 거에요. 멋지죠? :)

작업 상태가 성공을 나타내는 녹색으로 변하면, 새 파일인 "Youtube-Trending-Data-Raw"가 생긴 것을 확인할 수 있어요.

우리의 Raw 데이터는 이렇게 생겼어요:

![이미지](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_6.png)

<div class="content-ad"></div>

이제 추출 작업이 완료되었습니다. 다음 작업으로 넘어가 봅시다!

## 3. PySpark를 사용하여 데이터 변환하기:

원시 데이터 파일을 살펴보면 데이터에 많은 해시태그와 이모지가 있는데, 이는 우리 프로젝트에는 필요하지 않습니다. 데이터를 전처리하고 정리하여 추가 분석에 유용하도록 만들어 봅시다.

이 작업에 PySpark를 사용할 것입니다. PySpark는 대용량 데이터 세트를 처리하고 변환 작업을 수행하기 위해 설계된 강력한 프레임워크입니다. 데이터 세트가 특히 크지 않기 때문에 Pandas를 사용할 수도 있지만, 전에 PySpark를 사용한 적이 있어 이번에도 PySpark를 사용하기로 결정했습니다. 최근 PySpark를 공부하고 있으며, 이론을 공부하는 것보다 실제 구현이 더 흥미롭다고 느낍니다.

<div class="content-ad"></div>


# Python callable function to extract data from YouTube API
def extract_data(**kwargs):
    api_key = kwargs['api_key']
    region_codes = kwargs['region_codes']
    category_ids = kwargs['category_ids']
    
    df_trending_videos = fetch_data(api_key, region_codes, category_ids)
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Youtube_Trending_Data_Raw_{current_date}'
    # Save DataFrame to CSV file
    df_trending_videos.to_csv(output_path, index=False)

def fetch_data(api_key, region_codes, category_ids):
    """
    Fetches trending video data for multiple countries and categories from YouTube API.
    Returns a pandas data frame containing video data.
    """
    video_data = []

    # Build YouTube API service
    youtube = build('youtube', 'v3', developerKey=api_key)

    for region_code in region_codes:
        for category_id in category_ids:
            # Initialize the next_page_token to None for each region and category
            next_page_token = None
            while True:
                # Make a request to the YouTube API to fetch trending videos
                request = youtube.videos().list(
                    part='snippet,contentDetails,statistics',
                    chart='mostPopular',
                    regionCode=region_code,
                    videoCategoryId=category_id,
                    maxResults=50,
                    pageToken=next_page_token
                )
                response = request.execute()
                videos = response['items']

                # Process each video and collect data
                for video in videos:
                    video_info = {
                        'region_code': region_code,
                        'category_id': category_id,
                        'video_id': video['id'],
                        'title': video['snippet']['title'],
                        'published_at': video['snippet']['publishedAt'],
                        'view_count': video['statistics'].get('viewCount', 0),
                        'like_count': video['statistics'].get('likeCount', 0),
                        'comment_count': video['statistics'].get('commentCount', 0),
                        'channel_title': video['snippet']['channelTitle']
                    }
                    video_data.append(video_info)

                # Get the next page token, if there are more pages of results
                next_page_token = response.get('nextPageToken')
                if not next_page_token:
                    break

    return pd.DataFrame(video_data)

def preprocess_data_pyspark_job():
    spark = SparkSession.builder.appName('YouTubeTransform').getOrCreate()
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Youtube_Trending_Data_Raw_{current_date}'
    df = spark.read.csv(output_path, header=True)
    
    # Define UDF to remove hashtag data, emojis
    def clean_text(text):
     if text is not None:
        # Remove emojis
        text = emoji.demojize(text, delimiters=('', ''))
        
        # Remove hashtag data
        if text.startswith('#'):
            text = text.replace('#', '').strip()
        else:
            split_text = text.split('#')
            text = split_text[0].strip()
        
        # Remove extra double quotes and backslashes
        text = text.replace('\\"', '')  # Remove escaped quotes
        text = re.sub(r'\"+', '', text)  # Remove remaining double quotes
        text = text.replace('\\', '')  # Remove backslashes
        
        return text.strip()  # Strip any leading or trailing whitespace

     return text
    # Register UDF
    clean_text_udf = udf(clean_text, StringType())

    # Clean the data
    df_cleaned = df.withColumn('title', clean_text_udf(col('title'))) \
                   .withColumn('channel_title', clean_text_udf(col('channel_title'))) \
                   .withColumn('published_at', to_date(col('published_at'))) \
                   .withColumn('view_count', col('view_count').cast(LongType())) \
                   .withColumn('like_count', col('like_count').cast(LongType())) \
                   .withColumn('comment_count', col('comment_count').cast(LongType())) \
                   .dropna(subset=['video_id'])
    
    # Generate the filename based on the current date
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Transformed_Youtube_Data_{current_date}'
    
    # Write cleaned DataFrame to the specified path
    df_cleaned.write.csv(output_path, header=True, mode='overwrite')   


# Define extract task for the DAG
extract_task = PythonOperator(
    task_id='extract_data_from_youtube_api',
    python_callable=extract_data,
    op_kwargs={
        'api_key': os.getenv('YOUTUBE_API_KEY'),
        'region_codes': ['US', 'GB', 'IN', 'AU', 'NZ'],
        'category_ids': ['1', '2', '10', '15', '20', '22', '23']
    },
    dag=dag,
)

# Define preprocessing task for the DAG
preprocess_data_pyspark_task= PythonOperator(
    task_id='preprocess_data_pyspark_task',
    python_callable=preprocess_data_pyspark_job,
    dag=dag
)

extract_task >> preprocess_data_pyspark_task


여기서는 이 코드가 하는 일을 설명해 드렸습니다.

- "preprocess_data_pyspark_task"라는 작업을 만듭니다.
- 이 작업은 preprocess_data_pyspark_job 함수를 호출합니다.
- preprocess_data_pyspark_job 함수는 데이터를 정리합니다.
- 그리고 정리된 데이터는 "Transformed_Youtube_Data_currentDate"라는 폴더에 저장됩니다.
- 이 폴더 안에는 정리된 데이터가 담긴 "part-" 접두사가 붙은 새 CSV 파일이 생성됩니다.

만약 Airflow를 보신다면 아래와 같이 첫 번째 작업에 새로운 작업이 추가된 것을 보실 수 있습니다:

<div class="content-ad"></div>

아래는 우리가 변환한 데이터의 모습입니다:

![Transformed Data](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_8.png)

이 작업은 완료되었습니다. 이제 최종 작업으로 넘어갈 차례입니다.

<div class="content-ad"></div>

# 4. S3로 데이터 로드하기:

이 작업을 시작하기 전에 처음에 설정한 IAM 사용자를 사용하여 S3 버킷을 생성하고 버킷 이름을 메모해주세요.

우리의 최종 코드입니다!

```js
import logging
import os
import re
import shutil
from datetime import datetime, timedelta

import boto3
import emoji
import pandas as pd
from googleapiclient.discovery import build
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date, udf
from pyspark.sql.types import (DateType, IntegerType, LongType, StringType,
                               StructField, StructType)

from airflow import DAG
from airflow.operators.python_operator import PythonOperator

# DAG 및 기본 인자 정의
default_args = {
    'owner': 'airflow',  # DAG 소유자
    'depends_on_past': False,  # 이전 DAG 실행에 의존 여부
    'email_on_failure': False,  # 실패 시 이메일 알림 비활성화
    'email_on_retry': False,  # 재시도 시 이메일 알림 비활성화
    'retries': 1,  # 재시도 횟수
    'retry_delay': timedelta(minutes=5),  # 재시도 사이 간격
    'start_date': datetime(2023, 6, 10, 0, 0, 0),  # 매일 자정(00:00) UTC에 실행
}

# DAG 정의
dag = DAG(
    'youtube_etl_dag',  # DAG 식별자
    default_args=default_args,  # 기본 인수 할당
    description='간단한 ETL DAG',  # DAG 설명
    schedule_interval=timedelta(days=1),  # 스케줄 간격: 매일
    catchup=False,  # 누락된 DAG 실행을 복구하지 않음
)

# YouTube API에서 데이터를 추출하는 Python 유형의 함수
def extract_data(**kwargs):
    api_key = kwargs['api_key']
    region_codes = kwargs['region_codes']
    category_ids = kwargs['category_ids']
    
    df_trending_videos = fetch_data(api_key, region_codes, category_ids)
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Youtube_Trending_Data_Raw_{current_date}'
    # DataFrame을 CSV 파일로 저장
    df_trending_videos.to_csv(output_path, index=False)

# YouTube API에서 데이터 가져오는 함수
def fetch_data(api_key, region_codes, category_ids):
    """
    YouTube API에서 여러 국가 및 카테고리의 트렌드 비디오 데이터를 가져옵니다.
    비디오 데이터가 포함된 Pandas 데이터 프레임 반환.
    """
    # 비디오 데이터를 보관할 빈 리스트 초기화
    video_data = []

    # YouTube API 서비스 빌드
    youtube = build('youtube', 'v3', developerKey=api_key)

    for region_code in region_codes:
        for category_id in category_ids:
            # 각 지역 및 카테고리마다 next_page_token을 None으로 초기화
            next_page_token = None
            while True:
                # YouTube API에 트렌드 비디오를 가져오도록 요청
                request = youtube.videos().list(
                    part='snippet,contentDetails,statistics',
                    chart='mostPopular',
                    regionCode=region_code,
                    videoCategoryId=category_id,
                    maxResults=50,
                    pageToken=next_page_token
                )
                response = request.execute()
                videos = response['items']

                # 각 비디오 처리 및 데이터 수집
                for video in videos:
                    video_info = {
                        'region_code': region_code,
                        'category_id': category_id,
                        'video_id': video['id'],
                        'title': video['snippet']['title'],
                        'published_at': video['snippet']['publishedAt'],
                        'view_count': video['statistics'].get('viewCount', 0),
                        'like_count': video['statistics'].get('likeCount', 0),
                        'comment_count': video['statistics'].get('commentCount', 0),
                        'channel_title': video['snippet']['channelTitle']
                    }
                    video_data.append(video_info)

                # 결과의 추가 페이지가 있는 경우 다음 페이지 토큰 가져오기
                next_page_token = response.get('nextPageToken')
                if not next_page_token:
                    break

    return pd.DataFrame(video_data)

# PySpark 작업 전처리 함수
def preprocess_data_pyspark_job():
    spark = SparkSession.builder.appName('YouTubeTransform').getOrCreate()
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Youtube_Trending_Data_Raw_{current_date}'
    df = spark.read.csv(output_path, header=True)
    
    # 해시태그 데이터, 이모지 제거를 위한 UDF 정의
    def clean_text(text):
     if text is not None:
        # 이모지 제거
        text = emoji.demojize(text, delimiters=('', ''))
        
        # 해시태그 및 이후 모든 것 제거
        if text.startswith('#'):
            text = text.replace('#', '').strip()
        else:
            split_text = text.split('#')
            text = split_text[0].strip()
        
        # 추가 이중 인용부호와 백슬래시 제거
        text = text.replace('\\"', '')  # 이스케이프된 따옴표 제거
        text = re.sub(r'\"+', '', text)  # 남은 이중 인용부호 제거
        text = text.replace('\\', '')  # 백슬래시 제거
        
        return text.strip()  # 선행 또는 후행 공백 제거

     return text
    # UDF 등록
    clean_text_udf = udf(clean_text, StringType())

    # 데이터 정리
    df_cleaned = df.withColumn('title', clean_text_udf(col('title'))) \
                   .withColumn('channel_title', clean_text_udf(col('channel_title'))) \
                   .withColumn('published_at', to_date(col('published_at'))) \
                   .withColumn('view_count', col('view_count').cast(LongType())) \
                   .withColumn('like_count', col('like_count').cast(LongType())) \
                   .withColumn('comment_count', col('comment_count').cast(LongType())) \
                   .dropna(subset=['video_id'])
    
    # 현재 날짜를 기반으로 파일 이름 생성
    current_date = datetime.now().strftime("%Y%m%d")
    output_path = f'/opt/airflow/Transformed_Youtube_Data_{current_date}'
    
    # 정리된 DataFrame을 지정된 경로에 작성
    df_cleaned.write.csv(output_path, header=True, mode='overwrite')   

# S3로 데이터 업로드 함수
def load_data_to_s3(**kwargs):
    bucket_name = kwargs['bucket_name']
    today = datetime.now().strftime('%Y/%m/%d')
    prefix = f"processed-data/{today}"
    current_date = datetime.now().strftime("%Y%m%d")
    local_dir_path  = f'/opt/airflow/Transformed_Youtube_Data_{current_date}'
    upload_to_s3(bucket_name, prefix, local_dir_path)

def upload_to_s3(bucket_name, prefix, local_dir_path):
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

    s3_client = boto3.client(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )

    for root, dirs, files in os.walk(local_dir_path):
         for file in files:
            if file.endswith('.csv'):
                file_path = os.path.join(root, file)
                s3_key = f"{prefix}/{file}"
                logging.info(f"Uploading {file_path} to s3://{bucket_name}/{s3_key}")
                s3_client.upload_file(file_path, bucket_name, s3_key)

# DAG의 추출 작업 정의
extract_task = PythonOperator(
    task_id='extract_data_from_youtube_api',
    python_callable=extract_data,
    op_kwargs={
        'api_key': os.getenv('YOUTUBE_API_KEY'),
        'region_codes': ['US', 'GB', 'IN', 'AU', 'NZ'],
        'category_ids': ['1', '2', '10', '15', '20', '22', '23']
    },
    dag=dag,
)

# DAG의 데이터 전처리 작업 정의
preprocess_data_pyspark_task= PythonOperator(
    task_id='preprocess_data_pyspark_task',
    python_callable=preprocess_data_pyspark_job,
    dag=dag
)



<div class="content-ad"></div>

이제 저희가 만든 최종 작업인 load_data_to_s3_task를 소개합니다. 이 작업은 load_data_to_s3 함수를 호출하여 파일을 S3 버킷에 업로드합니다. 업로드가 잘 되었는지 확인하려면 S3 버킷의 내용을 확인하세요.

마침내 우리의 Airflow는 이렇게 생겼습니다!

![Airflow](/assets/img/2024-06-19-YouTubeTrendAnalysisPipelineETLwithAirflowSparkS3andDocker_9.png)

이제 이 데이터를 Tableau나 다른 BI 도구에 연결하여 흥미로운 대시보드를 만들고 인사이트를 시각화해 보세요!

<div class="content-ad"></div>

함께 이 파이프라인을 따라 오면서 새로운 기술 몇 가지를 배웠으면 좋겠어요! 🚀 성공적으로 여기까지 왔다면 축하해요! 🎉 이 새롭게 얻은 지식이 데이터 엔지니어링에서의 향후 모험에 큰 도움이 되길 바래요!

이 프로젝트의 Github 저장소를 첨부합니다:

만약 이 글을 좋아하셨다면, 공유하고, 좋아요를 눌러주시고, 아래에 댓글을 남겨주시고 구독해주세요. 🎉👏📝

커튼을 닫습니다! 🎭