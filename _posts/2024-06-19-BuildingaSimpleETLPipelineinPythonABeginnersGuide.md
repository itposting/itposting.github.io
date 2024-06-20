---
title: "파이썬으로 간단한 ETL 파이프라인 구축하기 초보자를 위한 안내"
description: ""
coverImage: "/assets/img/2024-06-19-BuildingaSimpleETLPipelineinPythonABeginnersGuide_0.png"
date: 2024-06-19 16:10
ogImage: 
  url: /assets/img/2024-06-19-BuildingaSimpleETLPipelineinPythonABeginnersGuide_0.png
tag: Tech
originalTitle: "Building a Simple ETL Pipeline in Python: A Beginner’s Guide"
link: "https://medium.com/@sanjayramrajasrinivasan/building-a-simple-etl-pipeline-in-python-a-beginners-guide-d2ab9204e207"
---


소개:

ETL (추출, 변환, 로드)은 데이터 엔지니어링에서 필수적인 프로세스로, 다양한 소스에서 데이터를 수집, 변환 및 저장하는 기능을 제공합니다. 이 안내서에서는 Python을 사용하여 날씨 데이터를 API에서 추출, 변환하고 CSV 파일에 저장하는 간단한 ETL 파이프라인을 구축하는 방법을 안내해 드리겠습니다.

설치:

시작하려면 Python 3.8 이상 버전 및 몇 가지 라이브러리가 설치되어 있어야 합니다. 터미널을 열고 다음 명령을 실행하세요:

<div class="content-ad"></div>

```js
pip install requests pandas
```

**단계 1: 날씨 데이터 추출 기능용 액세스 키 얻기**

날씨 데이터를 가져오기 위해 OpenWeatherMap API를 사용할 것입니다. 먼저 API 키를 얻어야 합니다.

1. API 키 등록하세요:


<div class="content-ad"></div>

- OpenWeatherMap 웹사이트로 이동해 주세요.
- 무료 계정을 등록하고 API 키를 획득해 주세요.

**2. API 문서:**

- 현재 날씨 데이터 섹션으로 이동해 주세요.
- "Current Weather Data"를 클릭한 다음 "API 문서"를 클릭해 주세요.
- 요청하는 방법을 이해하기 위해 "도시 이름으로 내장된 API 요청"으로 스크롤해 주세요.

**단계 2: 함수 추출**

<div class="content-ad"></div>

이제 API 키가 있으니, API에서 날씨 데이터를 가져오는 추출 함수를 작성해 봅시다.

```js
# 중요한 라이브러리들

import requests
import pandas as pd
```

```js
def fetch_weather_data(city: str, api_key: str):
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# 예시 사용법
api_key = '당신의_openweathermap_api_키'
city = '런던'
weather_data = fetch_weather_data(city, api_key)
print(weather_data)
```

fetch_weather_data 함수는 도시 이름과 API 키를 사용하여 API 요청 URL을 작성하고, API로 GET 요청을 보내 성공적인 요청이면 JSON 형식의 응답 데이터를 반환합니다.

<div class="content-ad"></div>

### 단계 3: 변환 함수

이제 데이터를 보다 구조화된 형식으로 변환할 것입니다:

```js
def transform_weather_data(data: dict):
    if not data:
        return None

    weather_info = {
        'city': data['name'],
        'temperature': data['main']['temp'],
        'humidity': data['main']['humidity'],
        'weather': data['weather'][0]['description'],
        'wind_speed': data['wind']['speed'],
        'wind_deg': data['wind']['deg']
    }
    return weather_info

# 예제 사용법
transformed_data = transform_weather_data(weather_data)
print(transformed_data)
```

### 단계 4: 모든 단계를 결합하는 함수

<div class="content-ad"></div>

마지막으로, 변환된 데이터를 CSV 파일로 로드하겠습니다:

```js
def load_data_to_csv(data: dict, file_path: str):
    df = pd.DataFrame([data])
    df.to_csv(file_path, index=False)

# 사용 예시
output_file = 'weather_data.csv'
load_data_to_csv(transformed_data, output_file)
print(f'{output_file}에 데이터 저장 완료')
```

모든 단계를 통합한 완전한 스크립트입니다:

<div class="content-ad"></div>

```python
def fetch_weather_data(city: str, api_key: str):
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def transform_weather_data(data: dict):
    if not data:
        return None

    weather_info = {
        'city': data['name'],
        'temperature': data['main']['temp'],
        'humidity': data['main']['humidity'],
        'weather': data['weather'][0]['description'],
        'wind_speed': data['wind']['speed'],
        'wind_deg': data['wind']['deg']
    }
    return weather_info

def load_data_to_csv(data: dict, file_path: str):
    df = pd.DataFrame([data])
    df.to_csv(file_path, index=False)

def main():
    api_key = 'your_openweathermap_api_key'
    city = 'London'
    weather_data = fetch_weather_data(city, api_key)
    if weather_data:
        transformed_data = transform_weather_data(weather_data)
        output_file = 'weather_data.csv'
        load_data_to_csv(transformed_data, output_file)
        print(f'Data saved to {output_file}')
    else:
        print('Failed to fetch data')

if __name__ == '__main__':
    main()
```

**결론**

이번 튜토리얼에서는 Python으로 간단한 ETL(추출, 변환, 적재) 파이프라인을 만들었습니다. API에서 데이터를 가져와 변환한 뒤 CSV 파일로 저장했습니다. 이 기본 프로젝트를 통해 데이터 엔지니어링 및 분석에서 중요한 ETL 프로세스를 이해할 수 있습니다.

**추가 자료**


<div class="content-ad"></div>

- OpenWeatherMap API