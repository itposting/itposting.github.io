---
title: "본 글에서는 Python, SQL, Power BI를 사용해 특정 소프트웨어 엔지니어링 분야의 국가별 연봉 및 평점 분석 프로젝트를 다루었습니다"
description: ""
coverImage: "/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_0.png"
date: 2024-06-22 17:52
ogImage: 
  url: /assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_0.png
tag: Tech
originalTitle: "Data Analysis Project Using Python, SQL, and Power BI: [Salary and Rating Analysis of Certain Software Engineering Fields by Country]"
link: "https://medium.com/@Mehmtcnangn/data-analysis-project-using-python-sql-and-power-bi-salary-and-rating-analysis-of-certain-9bf4b9cfcb7f"
---


현재 정보 시대에서 데이터 분석의 중요성은 이전보다 더 커졌어요. 이 글에서는 Python, SQL 및 Power BI를 사용하여 진행한 데이터 분석 프로젝트에 대해 자세히 설명할 거예요. Kaggle에서 얻은 데이터셋은 특정 소프트웨어 직종의 채용 공고, 채용자 회사의 평가 비율, 그리고 직원들에게 제공되는 최저, 평균 및 최고 연봉 범위 등의 데이터를 포함하고 있어요. 이 프로젝트는 기존 데이터를 정리하고 구성하는 데 초점을 맞추며 필요한 데이터를 추출하고 이를 시각화하여 통계 비율을 생성합니다. 이 프로젝트의 주요 목표는 나만의 로드맵을 개요화하여 완전한 데이터 엔지니어링 프로젝트를 만드는 것이에요.

이 프로젝트에서:

- Python을 사용한 데이터 정리와 구성,
- Oracle SQL을 사용한 데이터베이스 관리 및 쿼리, 그리고 일부 데이터 업데이트,

<div class="content-ad"></div>

데이터 시각화 및 의미 있는 보고서 작성에 Power BI를 사용합니다.

프로젝트에서 사용된 각 기술이 어떻게 통합되었는지와 이 프로세스의 끝에서 얻은 결과를 단계별로 공유할 것입니다. 이 글이 데이터 분석 프로젝트에 참여하거나 관심을 가지고 있는 모든 분들에게 유용하길 바랍니다.

프로젝트 로드맵 및 사용된 기술

이 프로젝트에서는 구체적인 목표를 달성하기 위한 단계별 로드맵을 개요로 작성했습니다. 이제, 프로젝트에서 사용한 Python, SQL 및 Power BI 기술을 자세히 설명하고 이들을 어떻게 통합했는지 시작하겠습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_0.png)

프로젝트에서 사용된 모든 코드는 GitHub 링크(https://github.com/Revealis)를 통해 확인할 수 있습니다.

1. Python: 데이터 정리 및 분석

프로젝트의 첫 단계에서는 Python을 사용하여 데이터세트를 정리하고 예비 분석을 수행했습니다. Python의 강력한 라이브러리 중 하나인 Pandas를 사용하여 데이터를 정리하고 예비 분석을 수행하며 오류를 해결했습니다.


<div class="content-ad"></div>

2. SQL: 데이터베이스 관리 및 쿼리

프로젝트의 두 번째 단계에서는 SQL을 사용하여 데이터를 저장하고 빠르게 액세스했습니다. SQL의 강력한 쿼리 기능 덕분에 대량 데이터 세트에서 복잡한 쿼리를 수행했고, 전송 단계에서 문제가 발생한 열을 재검토하며 필요한 작업을 수행했습니다.

3. Power BI: 데이터 시각화 및 보고

마지막 단계에서는 Power BI를 사용하여 SQL 데이터베이스에서 데이터를 검색하고 분석된 데이터를 시각화했습니다. Power BI의 대화식 시각화 도구 덕분에 데이터를 더욱 이해하기 쉽고 인상적으로 제시할 수 있었습니다.

<div class="content-ad"></div>

1. 파이썬: 데이터 정제 및 분석

첫 번째 단계로 캐글에서 데이터셋을 다운로드합시다. (https://www.kaggle.com/datasets/imbishal7/glassdoor-salary)

먼저, 데이터셋을 파이썬으로 불러오고 내용을 확인해봅시다. 먼저, Pandas 라이브러리를 import 해주세요:

![Dataset](https://www.example.com/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_1.png)

<div class="content-ad"></div>

다음으로, Python에서 데이터셋을 읽어봅시다:

```python
import pandas as pd
file_path = 'glassdoor-salaries.csv'
data = pd.read_csv(file_path)
data.info()
```

코드를 실행했는데, 실행 후에 CSV 파일에서 호환성 오류가 발생했습니다. 불량 행을 건너뛰도록 데이터셋을 다시 읽으려고 했습니다:

```python
import pandas as pd
file_path = 'glassdoor-salaries.csv'
data = pd.read_csv(file_path, delimiter='\t', on_bad_lines='skip')
print(data.head())
print(data.info())
```

<div class="content-ad"></div>

결과에서 추가 열을 식별했고 데이터 유형을 확인했습니다:

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_2.png)

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_3.png)

추가 및 불필요한 열을 삭제하는 코드에 한 줄을 추가했습니다:

<div class="content-ad"></div>

```js
data = data.drop(columns=['Unnamed: 9'])
```

그런 다음, 다시 확인하기 위해 CSV 파일을 원시 상태로 읽어 오류가 있는 열이 있는지 확인했습니다:

```js
import csv

file_path = 'glassdoor-salaries.csv'
with open(file_path, 'r', encoding='utf-8') as file:
    reader = csv.reader(file, delimiter='\t')
    for i, row in enumerate(reader):
        if len(row) != 9: 
            print(f' Bad line: {i+1}, Content: {row}')
```

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_4.png)


<div class="content-ad"></div>

저는 출력을 확인했고, 오직 열 이름만 잘못된 행으로 계산되었다는 것을 알았습니다. 그래서 첫 번째 행을 "헤더"로 표시했습니다. 먼저 데이터셋의 특수 문자를 공백으로 대체했습니다. 그런 다음 데이터셋에서 누락된 값을 식별하고 해당 열을 수정했습니다:

```js
import pandas as pd

data = pd.read_csv('glassdoor-salaries.csv',header=0, delimiter='\t')
pd.set_option('display.max_column', None)
pd.set_option('display.max_rows', None)
data = data.replace('\xa0', ' ', regex=True) 
data = data.drop(columns=['Unnamed: 9'])
mean_rating = data['company_rating'].mean()
data['company_rating'].fillna(mean_rating, inplace=True)
if 'company' in data.columns:
    data['company'] = data['company'].fillna("No Company")
```

그런 다음 단위 열을 더 읽기 쉽게 만드는 함수를 작성했습니다:

```js
def chg_unit(unit):
    if unit == ' / yr':
        return 'Yearly'
    elif unit == ' / mo':
        return 'Monthly'
    elif unit == ' / hr':
        return 'Hourly'
data['unit'] = data['unit'].apply(chg_unit)
```

<div class="content-ad"></div>

이 프로세스 후에 데이터셋의 낮은, 평균 및 높은 급여 열의 숫자 데이터가 통화 단위와 결합되어 분석 과정에서 문제가 될 수 있습니다. 따라서 통화 단위를 추출하여 "통화"라는 다른 열에 할당했습니다:

```js
def clmn_currency(x):
    units = x.split(' ')
    if len(units) == 1:
        return x[0]
    else:
        return units[0]
data['currency'] = data['median'].apply(clmn_currency)
```

```js
def format_salary(x):
    x = str(x)
    unit = clmn_currency(x)
    x = x.replace(unit,'')
    x = x.replace(',','')
    x = x.replace('M','000000')
    x = x.replace('K','000')
    return x              

data['median'] = data['median'].apply(format_salary)
data['low'] = data['low'].apply(format_salary)
data['high'] = data['high'].apply(format_salary)
```

또한 열에 있는 수백만, 수천 등을 나타내는 문자를 숫자로 변환했습니다. SQL 전의 마지막 단계는 정리된 데이터를 저장하는 것이었습니다:

<div class="content-ad"></div>

```js
data.to_csv('cleaned_glassdoor-salaries.csv', index=False)
```

2. SQL: 데이터베이스 관리 및 쿼리

두 번째 단계에서는 정제된 데이터를 Oracle SQL 데이터베이스로 전송하였습니다. 첫 번째 단계로, SQL Developer를 사용하여 `employee_data`라는 테이블을 생성해보겠습니다:

<img src="/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_5.png" />


<div class="content-ad"></div>

다음으로, 컴퓨터에 텍스트 파일을 생성하여 SQL 명령을 작성하고, 데이터를 정리한 경로, 데이터가 로드될 대상 테이블, 파일 내에서 데이터가 구분되는 방법을 포함하여 저장하세요:

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_6.png)

그런 다음, 컴퓨터의 시작 메뉴에서 명령줄을 열고 저장된 텍스트 파일 안에 있는 SQL 명령을 실행하세요. 명령줄에 작성한 코드에는 사용자 이름, 비밀번호, 데이터베이스 문자열 (TNS 이름) 및 데이터베이스에 연결할 파일의 경로가 포함됩니다:

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_7.png)

<div class="content-ad"></div>

이 단계를 거친 후에 내가 데이터를 테이블에 넣어 두었음을 확인했다. DML을 사용하여 쿼리했을 때, 데이터를 CSV 파일로 변환했기 때문에 다시 오류가 발생했다. 통화를 확인했을 때, 특수 문자가 데이터베이스 문자 설정 때문에 나오지 않았음을 발견했다.

페이지를 마크다운 형식으로 변경해주세요:

|Header1|Header2|Header3|
|-------|-------|-------|
|Data1  |Data2  |Data3  |

SQL 명령어로 문제를 해결하고 세계 각국의 통화를 국가 코드로 변경했다.

<div class="content-ad"></div>

그런 다음, 평균 열을 쿼리하고 정렬했을 때 문자에 오류가 있는 것을 발견했습니다:

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_10.png)

이 열 및 기타 열의 오류를 수정하기 위해 SQL의 REPLACE 명령을 사용하여 불필요한 문자를 공백으로 대체했습니다:

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_11.png)

<div class="content-ad"></div>

이러한 작업을 수행한 후에는 문제가 있는지 확인하기 위해 열을 확인하고 필요한 최종 조정을 했습니다. 회사 열에서 문제가 있는 열을 삭제하는 대신 효율성을 위해 이름을 바꿔주었습니다:

![Company Column](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_12.png)

계산에서 혼란을 방지하기 위해 Round 명령을 사용하여 평점 열을 소수점 한 자리로 반올림했습니다:

![Rating Column](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_13.png)

<div class="content-ad"></div>

3. 파워 BI: 데이터 시각화와 보고서

파워 BI 부분에서는 프로젝트의 시각화와 마지막 단계로, 데이터를 가져와서 내 테이블에서 데이터가 들어왔는지 확인했습니다. 필요한 필터를 만들고, 오른쪽 메뉴에서 시각화할 데이터를 선택하고, 보고서에 맞게 그래프를 조정했습니다:

![이미지](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_14.png)

그런 다음 차트를 만들기 시작했고, 첫 번째 차트에서는 회사들이 직무 역할에 대한 고용 비율을 보여주는 파이 차트를 만들었습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_15.png" />

참고: 숫자의 단위는 터키어로 제공됩니다. 이를 설정 섹션에서 사용자 정의할 수 있습니다.

제가 두 번째 차트를 만들었고 회사 수의 분포를 국가별로 막대 차트로 조사했습니다:

<img src="/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_16.png" />

<div class="content-ad"></div>

저는 세 번째 차트를 만들었고, 기업들의 평가 분포율을 막대 그래프를 사용하여 분석했어요:

![Company Rating Distribution Rates](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_17.png)

네 번째 차트를 만들었는데, 이 차트에는 통화 단위를 선택하여 전문직의 평균 연봉을 플롯했어요. 이 표에 카드를 추가하여 정확한 수치를 볼 수도 있어요. 우리는 표 옆의 슬라이서로 원하는 통화를 선택할 수 있어요:

![Average Salaries of Professions by Currency Units](/assets/img/2024-06-22-DataAnalysisProjectUsingPythonSQLandPowerBISalaryandRatingAnalysisofCertainSoftwareEngineeringFieldsbyCountry_18.png)

<div class="content-ad"></div>

최종 차트에서 이해를 돕기 위해 행렬을 사용했습니다. 이 표에서는 회사들이 직무별로 제공하는 결제 방법의 분포 백분율을 조사했습니다:

| 구분 | 시간당 | 월별 | 연간 |
|---|---|---|---|
| 엔지니어 | 20% | 50% | 30% |
| 디자이너 | 30% | 40% | 30% |
| 분석가 | 25% | 45% | 30% |
| 기타 | 20% | 50% | 30% |

프로젝트의 종합 평가

얻은 결과

<div class="content-ad"></div>

데이터 클린징: 파이썬을 사용하여 데이터셋에서 누락된 데이터와 오류 데이터를 성공적으로 정리했습니다. 이 단계는 분석을 위한 견고한 기반을 마련했습니다.

데이터 분석: SQL 쿼리를 통해 데이터베이스의 데이터에 복잡한 분석을 수행할 수 있었습니다. 이러한 분석을 통해 조정해야 하는 불필요한 행과 열에 대한 유용한 정보를 얻을 수 있었습니다.

데이터 시각화: Power BI를 사용하여 만든 시각화를 통해 데이터를 더 명확하고 효과적으로 표현할 수 있었습니다. 이러한 시각화는 다음 단계의 결정을 지원하는 명확하고 설득력 있는 결과를 제공했습니다.

## 이 포괄적인 데이터 엔지니어링 프로젝트와 로드맵 그리고 전적으로 제 자신의 코드에 관심을 가져 주셔서 감사합니다.