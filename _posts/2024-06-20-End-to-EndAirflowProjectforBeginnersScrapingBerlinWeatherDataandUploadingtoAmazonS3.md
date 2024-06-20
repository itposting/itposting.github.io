---
title: "초보자를 위한 엔드 투 엔드 Airflow 프로젝트 베를린 날씨 데이터 스크래핑 및 Amazon S3에 업로드하기"
description: ""
coverImage: "/assets/img/2024-06-20-End-to-EndAirflowProjectforBeginnersScrapingBerlinWeatherDataandUploadingtoAmazonS3_0.png"
date: 2024-06-20 15:21
ogImage: 
  url: /assets/img/2024-06-20-End-to-EndAirflowProjectforBeginnersScrapingBerlinWeatherDataandUploadingtoAmazonS3_0.png
tag: Tech
originalTitle: "End-to-End Airflow Project for Beginners: Scraping Berlin Weather Data and Uploading to Amazon S3"
link: "https://medium.com/@soumyabhimakkanavar/end-to-end-airflow-project-for-beginners-scraping-berlin-weather-data-and-uploading-to-amazon-s3-6ff527c8776d"
---


파이썬 개발과 Apache Airflow에 열정을 가진 데이터 엔지니어로서, 베를린의 최신 날씨 데이터를 가져 와 CSV 파일로 저장하고 Amazon S3로 업로드하는 프로젝트를 시작했습니다. 이 튜토리얼에서는 Python, 웹 스크래핑을 위한 BeautifulSoup, 데이터 조작을 위한 Pandas, 그리고 오케스트레이션을 위한 Airflow를 사용한 전체 설정 및 구현 방법을 안내해 드릴 겁니다.

# 프로젝트 개요

이 프로젝트에서는 다음을 목표로 합니다:

- 날씨 데이터 스크래핑: 날씨 웹사이트에서 베를린의 실시간 날씨 정보를 가져 오는 웹 스크래핑 기술을 활용합니다.
- 데이터 로컬 저장: 가져온 데이터를 로컬 파일 시스템의 CSV 파일에 저장합니다.
- Amazon S3로 업로드: 날씨 데이터가 포함된 CSV 파일을 Amazon S3 버킷에 업로드하는 메커니즘을 구현합니다.
- Airflow로 자동화: Apache Airflow를 사용하여 매 시간마다 데이터 가져오기와 업로드 프로세스를 자동화하고 예약합니다.

<div class="content-ad"></div>

# 사용된 도구 및 기술

- Python: 스크립팅 및 데이터 조작에 사용됩니다.
- BeautifulSoup: HTML 및 XML 문서 구문 분석을 위한 Python 라이브러리로, 여기서 웹 스크래핑에 사용됩니다.
- Pandas: 파이썬에서 데이터를 분석하고 조작하는 강력한 도구로, 표 형식의 데이터를 처리하고 다루는 데 활용됩니다.
- Apache Airflow: 워크플로우를 프로그래밍적으로 작성, 예약 및 모니터링하는 오픈 소스 도구입니다.
- Amazon S3: 스케일링 가능한 객체 저장 서비스인 Amazon Simple Storage Service로, 데이터를 저장하고 검색하는 데 사용됩니다.

# 구현 단계별 안내

# 1. 환경 설정하기

<div class="content-ad"></div>

Python이 설치되어 있고 필요한 라이브러리(requests, beautifulsoup4, pandas, AWS SDK의 boto3)가 함께 설치되었는지 확인하기 위해 다음 명령을 실행해주세요:

```js
pip install requests beautifulsoup4 pandas boto3
```

# 2. 날씨 데이터 수집 및 로컬에 데이터 저장

추출한 날씨 데이터를 Pandas를 사용하여 로컬 CSV 파일에 저장하세요:

<div class="content-ad"></div>

'Alex The Analyst' YouTube 채널에서 BeautifulSoup를 사용하여 스크랩을 배웠어요. 완성된 재생 목록을 확인해보세요.

```js
from bs4 import BeautifulSoup
import requests
import pandas as pd
import pytz
```

```js
# 날씨 데이터를 업데이트하고 CSV로 저장하는 함수
def update_weather(**kwargs):
    url = 'https://weather.com/weather/today/l/52.52,13.40'
    page = requests.get(url)
    if page.status_code != 200:
        raise Exception(f"페이지를 가져오지 못했습니다: {page.status_code}")
    soup = BeautifulSoup(page.text, 'html.parser')
    # 체감 온도에 대한 제목 찾기
    title_element = soup.find(class_='TodayDetailsCard--feelsLikeTempLabel--1UNV1')
    if title_element:
        title = title_element.text.strip()
    else:
        title = "체감 온도"
    # DataFrame을 저장할 파일 경로
    file_path = '/opt/airflow/dags/weather_checkin.csv'
    # 파일이 있는지 확인
    if os.path.exists(file_path):
        logging.info(f"파일 {file_path}이 존재합니다. 기존 DataFrame을 불러옵니다.")
        # 기존 DataFrame 불러오기
        current_weather_berlin_df = pd.read_csv(file_path)
    else:
        logging.info(f"파일 {file_path}이 존재하지 않습니다. 새 DataFrame을 생성합니다.")
        # 제목과 날짜 및 시간 열을 가진 새 DataFrame 초기화
        current_weather_berlin_df = pd.DataFrame(columns=[title, 'date_time'])
    # 체감 온도 값 찾기
    value_element = soup.find('span', class_='TodayDetailsCard--feelsLikeTempValue--2icPt')
    if value_element:
        feels_like_temp = value_element.text.strip()
    else:
        feels_like_temp = None
    # 베를린 시간대의 현재 날짜 및 시간 가져오기
    berlin_tz = pytz.timezone('Europe/Berlin')
    current_datetime = datetime.now(berlin_tz).strftime("%Y-%m-%d %H:%M:%S")
    # DataFrame에 데이터 추가
    if feels_like_temp:
        logging.info(f"새 데이터 추가 중: {feels_like_temp}, {current_datetime}")
        new_data = {title: [feels_like_temp], 'date_time': [current_datetime]}
        current_weather_berlin_df = current_weather_berlin_df.append(pd.DataFrame(new_data), ignore_index=True)
    else:
        logging.error("체감 온도 값 찾기를 실패했습니다")
    # DataFrame을 CSV 파일로 저장
    logging.info(f"{file_path}에 DataFrame을 저장 중")
    current_weather_berlin_df.to_csv(file_path, index=False)
    logging.info(current_weather_berlin_df)
    # S3에 CSV 업로드
    bucket_name = 'myfirstbucketsoumya'  # S3 버킷 이름으로 대체
    s3_key = 'current_weather_berlin.csv'  # 원하는 S3 키로 대체
    upload_to_s3(file_path, bucket_name, s3_key)
```

# 3. Amazon S3로 업로드하기

<div class="content-ad"></div>

아래는 boto3를 사용하여 CSV 파일을 Amazon S3에 업로드하는 기능을 구현한 것입니다:

```python
import boto3
```

```python
# AWS 자격 증명
AWS_ACCESS_KEY_ID = 'your-access-key-id' # 자격 증명을 하드코딩합니다.
AWS_SECRET_ACCESS_KEY = 'your-secret-access-key'
AWS_REGION = 'eu-central-1'
# 현재 날씨 CSV를 S3에 업로드하는 함수
def upload_to_s3(file_path, bucket_name, s3_key):
    try:
        # 자격 증명을 사용하여 Amazon S3와의 세션을 초기화합니다.
        s3 = boto3.client(
            's3',
            aws_access_key_id='your-access-key-id', # 값을 하드코딩합니다.
            aws_secret_access_key='your-secret-access-key', # 값을 하드코딩합니다.
            region_name='eu-central-1' # 값을 하드코딩합니다.
        )
        bucket_name = 'myfirstbucketsoumya'
        file_key = 'hourly_berlin_weather.txt'
        # CSV 파일을 S3에 업로드합니다.
        s3.upload_file(file_path, bucket_name, s3_key)
        logging.info(f"날씨 데이터를 S3에 업로드했습니다: s3://{bucket_name}/{s3_key}")
    except Exception as e:
        logging.error(f"S3로 업로드 실패: {e}")
```

docker-compose.yaml에 몇 가지 변경 사항이 있습니다. AWS 자격 증명과 requirements.txt 컨테이너를 업데이트하십시오.

<div class="content-ad"></div>

```js
#변경 1
x-airflow-common:
  &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:2.9.1}
  environment:
    &airflow-common-env
    PYTHONPATH: /opt/airflow/dags/airflow_env_bs/lib/python3.12/site-packages
 
    #AWS_ACCESS_KEY_ID: your-access-key-id #값을 하드코딩
    #AWS_SECRET_ACCESS_KEY: your-secret-access-key #값을 하드코딩
    #AWS_REGION: eu-central-1 #값을 하드코딩

#변경-2
airflow-init:
    <<: *airflow-common
    entrypoint: /bin/bash
    command: >
      -c "pip install -r /requirements.txt && airflow webserver" 
```

# 5. Apache Airflow로 자동화하기

마지막으로 Apache Airflow를 사용하여 전체 프로세스를 조율하세요. 다음은 DAG를 정의하는 방법입니다:

```js
from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
```

<div class="content-ad"></div>

```js
# DAG 정의
DAG_NAME = 'berlin-weather'
default_args = 
{'owner': 'airflow',
'depends_on_past': False,
'start_date': datetime(2023, 6, 19),
'retries': 1,
'retry_delay': timedelta(minutes=5),
}
dag = DAG(
dag_id=DAG_NAME,
description='베를린 날씨 매 시간 갱신',
schedule_interval='@hourly',
default_args=default_args,
catchup=False,
)
# 작업 정의
update_weather_task = PythonOperator(
task_id='update_weather',
python_callable=update_weather,
dag=dag,
)
# 작업 의존성
update_weather_task
```

# 5. CSV 파일을 위한 S3 버킷 확인

Airflow 웹 서버를 열고 DAG를 실행하세요.

<img src="/assets/img/2024-06-20-End-to-EndAirflowProjectforBeginnersScrapingBerlinWeatherDataandUploadingtoAmazonS3_0.png" />

<div class="content-ad"></div>

DAG를 트리거한 후에 "current_weather_berlin.csv"라는 S3 Bucket을 확인해보세요. 거기에는 데이터 폴더가 있을 겁니다.

![이미지](/assets/img/2024-06-20-End-to-EndAirflowProjectforBeginnersScrapingBerlinWeatherDataandUploadingtoAmazonS3_1.png)

# 결론

이 프로젝트에서는 Python을 사용하여 베를린 날씨 데이터를 가져오고 로컬에 저장하며 Amazon S3로 업로드하는 프로세스를 자동화하는 방법을 탐색했습니다. 이를 위해 웹 스크래핑용 BeautifulSoup, 데이터 처리용 Pandas, 그리고 워크플로우 자동화용 Apache Airflow를 사용했습니다. 이러한 단계를 따라가면 이 프로젝트를 적응하고 확장하여 보다 복잡한 데이터 파이프라인 및 통합을 처리할 수 있습니다.

<div class="content-ad"></div>

제 Github 저장소를 확인하러 가보세요: Scraping-Berlin-Weather-Data-and-Uploading-to-Amazon-S3

태그: airflow, 데이터 엔지니어링 프로젝트, AWS S3, 도커, 초보자 프로젝트