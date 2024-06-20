---
title: "파이썬을 사용한 탐색적 데이터 분석EDA 완료하기"
description: ""
coverImage: "/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_0.png"
date: 2024-06-20 15:10
ogImage: 
  url: /assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_0.png
tag: Tech
originalTitle: "Complete Exploratory Data Analysis(EDA) using Python"
link: "https://medium.com/@navamisunil174/exploratory-data-analysis-of-breast-cancer-survival-prediction-dataset-c423e4137e38"
---


## 유방암 생존 예측 데이터 집합의 EDA 단계별 안내서

![이미지](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_0.png)

탐색적 데이터 분석 또는 EDA는 데이터 분석의 가장 중요한 단계 중 하나입니다. 이는 데이터 집합의 체계적 조사로 데이터 내의 패턴을 발견하고 이상값을 식별하며 숨겨진 통찰을 발굴하는 과정입니다.

이 블로그에서는 유방암 생존 예측을 중심으로 한 데이터 집합에 EDA 기술을 적용하는 데 초점을 맞출 것입니다. 유방암 생존 예측 데이터 집합을 탐색함으로써 생존률에 영향을 미치는 요인에 대한 통찰을 얻고자 합니다. 요약 통계 및 시각화와 같은 EDA 기술을 사용하여 유용한 정보를 발굴하여 유방암 진닝 및 치료에 대한 이해에 기여할 것입니다. 데이터 집합에는 수술 시 환자의 나이, 수술 연도, 양성 겨드랑이 노드 수 및 생존 상태와 같은 다양한 정보가 포함되어 있습니다. Python과 pandas 라이브러리를 사용하여 데이터 집합 내의 신비를 해결하고 유방암 진닝 및 치료에 대한 이해에 기여할 것입니다.

<div class="content-ad"></div>

# 데이터셋에서 얻은 통찰

데이터셋을 가져온 후, 첫 번째 단계는 데이터가 올바르게 가져와졌는지 확인하는 것입니다. 이를 위해 아래 코드를 사용할 수 있습니다.

```python
df.shape
```

<div class="content-ad"></div>

해당하는 텍스트는 다음과 같습니다:

데이터셋에는 2000개의 관측치와 10가지 특징이 있습니다.

head()를 사용하여 데이터셋의 상위 5개 관측치를 표시하겠습니다.

<div class="content-ad"></div>

```js
df.head()
```

![Exploratory Data Analysis using Python](https://www.example.com/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_2.png)

head( )와 비슷하게 tail( )을 사용할 수 있습니다. 이를 통해 마지막 5개의 관측값을 표시합니다. 만약 마지막 10개를 표시하고 싶다면, 괄호 안에 숫자를 지정하면 됩니다.

```js
df.tail(10)
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_3.png)

데이터에 대해 더 잘 이해하기 위해 각 열의 비 널 레코드 수, 데이터 유형, 데이터 세트의 메모리 사용량을 확인하기 위해 info()를 사용합니다.

```js
df.info()
```

![image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_4.png)


<div class="content-ad"></div>

데이터셋은 각각 다른 데이터 유형으로 구분되는 다양한 기능을 포함하고 있어요. 'Patient_ID,' 'Marital_Status,' 'Radiation_Therapy,' 'Chemotherapy,' 및 'Hormone_Therapy'와 같은 범주형 기능들은 객체 (문자열)로 표현돼요.

정수 데이터 유형 (int64)은 'Age,' 'Year of Operation,' 'Positive_Axillary_Nodes,' 그리고 'Survival_Status'에 할당되어 있어요. 반면 'Tumor_Size' 기능은 소수점 정밀도 정보를 포함하는 float (float64)로 표현돼요.

누락된 값이 존재하는 경우, 정수로 분류된 'Age' 열은 정보가 불완전한 10개의 인스턴스를 가지고 있어요. 마찬가지로, 객체로 표현된 'Marital_Status' 열에는 6개의 누락된 값이 들어있어요. 누락된 값들을 적절하게 처리하는 것은 후속 데이터 분석이나 모델링 과정에서 데이터셋의 무결성을 유지하는 데 중요해요.

DataFrame에서 각 열에 대응하는 고유 값 수를 찾기 위해 nunique( )를 사용해요:

<div class="content-ad"></div>

```js
for column in df.columns:
    num_unique_values = df[column].nunique()
    print(f'열 {column}의 고유 값 개수: {num_unique_values}')
```

![EDA Image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_5.png)

# 피처 분석

우리 데이터셋에는 언급된대로 10가지의 피처가 포함되어 있습니다. 각각의 피처를 자세히 살펴보고 그들이 얼마나 관련이 있는지 확인해 봅시다.

<div class="content-ad"></div>

# 환자 ID:

- 설명: 각 환자를 식별하는 기밀적이고 고유한 식별자로, 데이터셋 내에서 추적을 용이하게 하면서도 프라이버시를 보장합니다.

# 나이:

- 유형: 숫자 (정수)
- 범위: 30세에서 84세
- 설명: 유방암에 영향을 받는 다양한 연령대를 반영합니다. 나이는 예후와 치료 결정에 중요한 요소이며, 생존 패턴을 이해하기 위해 탐색하기에 중요한 요소입니다.

<div class="content-ad"></div>

# 결혼 상태:

- 유형: 범주형 (문자열)
- 값: 싱글, 기혼
- 설명: 환자들의 결혼 상태를 나타내며, 생존 결과와의 잠재적 상관 관계를 제공합니다.

# 수술 연도:

- 유형: 수치형 (정수)
- 범위: 1958년부터 1970년까지
- 설명: 거의 백 년에 걸쳐 역사적 관점을 캡처합니다. 이 속성을 통해 의학적 실천의 발전이 시간을 통해 생존 결과에 어떤 영향을 미쳤는지 조사할 수 있습니다.

<div class="content-ad"></div>

# 양성 겨드랑이 림프절 (림프절):

- 유형: 숫자 (정수)
- 설명: 양성 겨드랑이 림프절의 수를 나타내며, 암 전이 정도에 대한 통찰을 제공합니다. 이 정보는 분류 및 치료 결정에 영향을 미치며, 예후에 매우 중요합니다.

림프절: 림프절은 림프 유체 채널을 따라 여과기로 작용하는 작고 콩 모양의 장기들입니다. 유방에서 림프 유체가 빠져나가 최종적으로 혈류로 돌아갈 때, 림프절은 다른 신체 부위에 도달하기 전에 암 세포를 잡아 남기려고 노력합니다. 겨드랑이 아래의 림프절에 암 세포가 있다면 암이 퍼질 위험이 높다는 것을 나타냅니다.

# 종양 크기:

<div class="content-ad"></div>

- 유형: 숫자 (부동 소수점)
- 범위: 0.5에서 5.0
- 설명: 종양의 신체 치수를 직접 측정합니다. 종양 크기는 암의 침습성 및 치료 옵션과 관련이 있어서, 우리 분석에서 중요한 요소입니다.

## 방사선 요법, 화학 요법, 호르몬 요법:

- 유형: 범주 (문자열)
- 값: 예, 아니요
- 설명: 유방암과의 싸움에서 다양한 치료 접근 방식을 나타냅니다. 생존 결과에 미치는 영향을 탐구하여 미래 치료 전략에 도움이 됩니다.

## 생존 상태:

<div class="content-ad"></div>

- 유형: 이진 (정수)
- 값: 1 (생존), 2 (사망)
- 설명: 각 환자의 궁극적인 결과를 밝혀내는 분석의 중심, 희망과 상실 사이의 미묘한 균형에 영향을 미치는 요인을 해부하는 것이 우리의 탐험적 여정의 핵심입니다.

# 기술 통계 분석

데이터 세트에는 앞서 설명한 모든 속성의 값들이 포함되어 있습니다. 데이터 세트의 기술적인 통계 분석을 수행하기 위해 describe()를 사용하여 시작해봅시다.

```js
df.describe(include="all")
```

<div class="content-ad"></div>

`include` 속성에 'all' 값을 할당하여 범주형 피처도 결과에 포함되도록합니다.

결과는 다음과 같이 나타납니다:

![Image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_6.png)

# 데이터 정리

<div class="content-ad"></div>

데이터에는 다양한 품질 문제가 발생할 수 있습니다. 그러므로 데이터를 정리하는 것이 중요합니다. 방이 지저분하면 좋지 않은 것처럼 데이터도 지저분하게 되면 분석 결과에 오류가 생기거나 부적절한 결과가 발생할 수 있습니다. 이러한 문제는 데이터 분석 전에 해결해야 합니다. 다양한 데이터 정리 기술이 있으며, 일부는 아래에서 설명했습니다:

## 1. 누락된 값 처리

다음 단계는 데이터셋에서 누락된 값을 확인하는 것입니다. 데이터셋에 누락된 값이 있는 것은 매우 일반적입니다. 이러한 누락된 값은 None이나 NaN 값으로 표시되며 대부분의 머신 러닝 알고리즘에서 지원하지 않습니다.

누락된 데이터에는 세 가지 주요 유형이 있습니다:

<div class="content-ad"></div>

- Missing completely at random (MCAR)
- Missing at random (MAR)
- Not missing at random (NMAR)

데이터셋에서 누락된 값의 양을 파악하기 위해 isnull() 함수를 사용할 것입니다.

```js
df.isnull().sum()
```

<div class="content-ad"></div>

데이터셋에는 ‘Age’에서 10개, ‘Marital_Status’에서 6개의 결측값이 있음을 보여줍니다.

데이터셋의 결측값 백분율을 찾기 위해 다음을 사용합니다:

```js
missing_percentage = df.isnull().mean() * 100
print("각 열의 결측값 백분율:")
print(missing_percentage)
```

# 결측값 시각화

<div class="content-ad"></div>

의심할 여지 없이 데이터셋에서 NaN 값이 어떻게 분포되어 있는지를 잘 이해해야 합니다. Missingno 라이브러리는 NaN 값의 분포를 시각화하는 데 효율적인 방법을 제공합니다. 이 라이브러리는 파이썬 라이브러리로 Pandas와 호환됩니다.

라이브러리 설치 방법

```js
pip install missingno
```

데이터셋에서 누락된 값을 시각화하는 프로그램

<div class="content-ad"></div>

```js
import pandas as pd
import missingno as msno
msno.bar(df)
```

![CompleteExploratoryDataAnalysisEDAusingPython](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_8.png)

이 막대그래프는 데이터셋에서 누락되지 않은 데이터에 비례하는 값을 보여줍니다. 누락된 값의 수도 함께 표시됩니다. 데이터 포인트의 총 수가 2000개이므로, 이보다 적은 수의 데이터를 갖는 열에는 누락된 값이 있습니다. 예를 들어, '나이'에 해당하는 '1990' 값은 '나이' 열에 1990개의 누락되지 않은 값이 있다는 것을 의미합니다.

# 누락된 값 보완하기


<div class="content-ad"></div>

한 가지 가능한 해결책은 누락된 데이터가 포함된 관측값을 제거하는 것입니다. 그러나 이렇게 하면 중요한 정보를 잃을 수 있습니다. 더 나은 전략은 누락된 값을 보충하는 것입니다. 다시 말해, 우리는 기존 데이터의 일부에서 누락된 값을 추론해야 합니다.

누락된 값 처리하기

## 누락된 값 보충 방법

암 생존 데이터셋에서 '환자_ID', '결혼 여부', '방사선 치료', '화학 요법' 및 '호르몬 치료' 특성은 객체(문자열)로 표현됩니다. '나이', '수술 연도', '양성 겉 부분 림프절', '생존 상태'에 대해 정수 데이터 유형(int64)이 할당됩니다. '종양 크기'는 부동소수점(float64)으로 표시됩니다.

<div class="content-ad"></div>

이러한 기능 내 누락된 값을 처리하는 여러 가지 방법이 존재합니다.

- 임의 값 대체: 'Patient_ID' 또는 'Marital_Status'에 대한 누락된 값에 대한 특정 가정이 있다면, fillna 메서드를 사용하여 교육된 추측치로 대체할 수 있습니다.
- 평균/중앙값/최빈값 대체: 'Age' 및 'Year of Operation'과 같은 숫자 기능은 평균, 중앙값 또는 최빈값을 사용하여 fillna 메서드로 보완할 수 있습니다.
- 가장 빈번한 값 대체: 'Marital_Status', 'Radiation_Therapy', 'Chemotherapy', 'Hormone_Therapy'와 같은 범주형 기능은 가장 빈번한 값으로 fillna 메서드를 사용하여 보완할 수 있습니다.
- 고급 보충 기술: Forward fill, backward fill, 보간 또는 KNNImputer와 같은 머신러닝 기반 방법과 같이 더 정교한 보충을 위해 사용될 수 있습니다.

그러나 우리의 데이터 세트에서는 'Age' 열과 'Marital_Status' 열만이 누락된 값이 있습니다.

'Age' (숫자형 특성)에 대한 보충:

<div class="content-ad"></div>

```js
# 평균을 사용하여 'Age' 열의 결측값 보정
df['Age'].fillna(df['Age'].mean(), inplace=True)
```

'Marital_Status'에 대한 대체값 (범주형 특성):

```js
# 최빈값을 사용하여 'Marital_Status' 열의 결측값 보정
df['Marital_Status'].fillna(df['Marital_Status'].mode()[0], inplace=True)
```

이러한 대체 작업을 완료한 후에는 'Age' 및 'Marital_Status'의 모든 결측값이 처리되었는지 확인하기 위해 데이터셋을 다시 확인할 수 있습니다:

<div class="content-ad"></div>

```js
missing_after_imputation = df.isnull().sum()
print("Imputation 후 누락된 값:")
print(missing_after_imputation)
```

## 2. 관련 없는 속성 제거

일부 속성은 분석에 어떤 가치도 제공하지 않는 경우 데이터 세트에서 제거할 수 있습니다.

예를 들어, 데이터 세트의 'Patient_ID' 열은 의존 변수를 예측하는 데 예측력이 없다고 가정할 때 제거할 수 있습니다.

<div class="content-ad"></div>

```js
df = df.drop('Patient_ID', axis=1)
```

# 3. 중복 행 제거

중복된 데이터를 처리하는 것은 데이터 정리 과정에서 중요한 단계로, 데이터셋에 중복 정보가 없는지 확인하는 것이 중요합니다. 데이터셋에서 중복된 행 또는 관측치를 식별하고 제거하는 방법은 다음과 같습니다:

```js
duplicates = df[df.duplicated()]
print("중복된 행:")
print(duplicates)
```

<div class="content-ad"></div>

아래 사진은:

![image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_9.png)

drop_duplicates() 함수는 DataFrame에서 중복된 행을 제거합니다. 중복이 제거된 새로운 DataFrame을 반환하며 기존 DataFrame은 변경되지 않습니다.

해당 행이 중복으로 보입니다. 데이터셋에서 이 행을 제거해 보겠습니다.

<div class="content-ad"></div>

```js
# 중복 행 제거 및 데이터프레임 업데이트
df_cleaned = df.drop_duplicates()
```

# 4. 이상치 탐지

# 이상치란?

이상치는 데이터 포인트 중 전체 데이터셋의 패턴에서 크게 벗어나며 비정상적이거나 드문 경우를 나타낼 수 있습니다.

<div class="content-ad"></div>

의료 데이터에서 이상값은 일반적인 패턴과 크게 벗어나는 독특한 케이스나 이상 현상을 나타낼 수 있으며, 이들의 존재는 예상할 수 있는 것입니다.

이상값을 식별하고 이해하는 것은 종합적인 분석에 중요합니다. 이들은 통계 측정치를 영향을 미치고 데이터셋 내의 기저 의료 상태의 다양성과 복잡성에 대한 통찰을 제공할 수 있습니다.

데이터셋에서 이상값을 감지하려면 통계적 방법이나 시각화를 사용할 수 있습니다. 다음은 몇 가지 방법입니다:

1. 상자그림: 상자그림을 사용하여 각 수치적 특성의 분포를 시각화합니다. 상자 그림의 "수염"을 넘어간 점들은 잠재적인 이상값으로 간주될 수 있습니다.

<div class="content-ad"></div>

```js
import seaborn as sns 
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 6)) 
sns.boxplot(x=df['Positive_Axillary_Nodes'], color='lightgreen')
```

![Image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_10.png)

2. Z-Score: Calculate the Z-score for each data point, and points with a Z-score beyond a certain threshold (e.g., 3 or -3) can be considered outliers.

```js
from scipy.stats import zscore
z_scores = zscore(df)
abs_z_scores = np.abs(z_scores)
outliers = (abs_z_scores > 3).all(axis=1)
```

<div class="content-ad"></div>


![Exploratory Data Analysis](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_11.png)

3. IQR (Interquartile Range): 이상치를 IQR을 기반으로 식별합니다. IQR 바깥의 일정 범위를 벗어나는 포인트는 이상치로 간주될 수 있습니다.

```js
Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1

outliers = ((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)
```

![Exploratory Data Analysis](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_12.png)


<div class="content-ad"></div>

저희 데이터셋에 이상값이 확인되었습니다. 의료 데이터에서 이상값은 데이터셋 내 전형적인 패턴에서 현저하게 벗어나는 비정상적이거나 극단적인 관측치를 나타낼 수 있습니다. 이러한 관측치는 독특한 사례, 드문 조건 또는 대부분의 데이터와 다른 특성을 나타내는 이상점을 가리킬 수 있습니다. 이상값은 종종 일부 데이터셋에서 노이즈나 오류로 간주되지만, 의료 데이터에서는 중요한 임상적 영향을 미칠 수 있습니다.

의료 데이터에서의 이상값은 예상되는 현상이지만, 이를 처리하는 방법을 결정할 때 신중한 고려가 필요합니다. 데이터의 맥락, 이상값의 성격 및 분석이나 모델링에 미칠 수 있는 잠재적인 영향을 철저히 평가해야 합니다.

# 데이터 시각화의 기술

# 일변량 분석

<div class="content-ad"></div>

암 생존 예측 데이터셋을 탐색하면서 데이터 분석 여정에서 중요한 단계인 일변량 분석으로 시작합니다. 일변량 분석은 단일 변수의 분포와 특성을 이해하는 데 도움이 되며, 패턴 인식, 요약 및 통계적 탐색에 기여합니다. 선택한 시각화 방법은 데이터의 성격에 따라 달라지며, 이산형 데이터에는 막대 차트, 연속형 데이터에는 히스토그램, 범주별 분석에는 파이 차트 등을 사용할 수 있습니다.

데이터 시각화의 힘을 활용하여 데이터셋에 대해 중요한 질문에 답해봅시다:

예를 들어:

- 질문: 환자들의 겸상림부 림프절의 분포는 어떻게 되는가?

<div class="content-ad"></div>

```js
sns.histplot(df['Positive_Axillary_Nodes'], bins=15, kde=True, color='lightgreen')
```

![Exploratory Data Analysis in Python](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_13.png)

"kernel density estimate (kde=True)"의 존재는 부드러운 확률 밀도 함수를 나타내며, 기저 분포 패턴에 대한 통찰을 제공합니다.

<div class="content-ad"></div>

분석: 분포가 왼쪽으로 치우쳐져 있는 것으로 보이며, 양성 겨릭 림프절 수가 약 0에서 가장 빈번하게 나타납니다. 분포의 상단에는 최대 50개의 양성 겨릭 림프절에 대한 데이터 포인트도 있습니다. 분포의 왼쪽 꼬리가 오른쪽 꼬리보다 긴 것으로, 양성 겨릭 림프절 수가 적은 데이터 포인트가 더 많음을 의미합니다.

- 질문: 데이터셋이 다양한 결혼 상태에 분포되어 있고, 각 카테고리에 속한 환자의 백분율은 어떻게 되나요?


marital_counts = df['Marital_Status'].value_counts()
plt.figure(figsize=(10, 6))
plt.pie(marital_counts, labels=marital_counts.index, autopct='%1.1f%%', startangle=90, colors=sns.color_palette('Blues'))


![Marital Status Distribution](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_14.png)


<div class="content-ad"></div>

분석: 데이터셋에서 결혼한 사람은 70.4%이고 싱글인 사람은 29.6%입니다.

- 질문: 암 생존 예측 데이터셋의 연령대 누적 분포는 무엇이며, 이는 다른 연령 그룹 간 환자 전체 분포를 어떻게 보여줄까요?

```js
plt.figure(figsize=(10, 6))
sns.ecdfplot(df['Age_Group'], color='purple')
```

<img src="/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_15.png" />

<div class="content-ad"></div>

# 이변량 및 다변량 분석

이변량 분석은 산점도, 추이를 보기 위한 선 그래프, 분포를 보기 위한 상자그림, 상관 관계를 확인하기 위한 히트맵을 사용하여 변수 쌍 간의 관계를 조사합니다. 이러한 시각화는 데이터 세트에서 연결 및 종속성을 발견하는 데 중요합니다.

다변량 분석은 두 개 이상의 변수 간의 상호 작용을 동시에 탐색함으로써 이를 한 단계 발전시킵니다. 주성분 분석 및 클러스터 분석과 같은 기법은 여러 요소를 동시에 고려함으로써 복잡한 데이터 세트에 대한 깊은 이해를 제공합니다. 요약하면, 이변량 및 다변량 분석은 다양한 데이터 세트에서 통찰을 추출하는 강력한 도구입니다.

# 1. 히트맵

<div class="content-ad"></div>

데이터셋을 더 자세히 살펴보고 데이터셋 내 다른 피처들 간의 관계를 깊게 이해하기 위해 상관 분석을 수행할 수 있습니다. 히트맵은 데이터셋 내 피처 변수들 간의 상관 관계를 시각화하는 강력한 도구입니다. 이들은 회귀 분석이나 기타 통계 모델링 작업의 맥락에서 변수 간의 패턴과 관계를 식별하는 직관적인 방법을 제공합니다.

상관 행렬의 맥락에서 각 셀은 두 변수 간의 상관 계수를 나타냅니다. 값은 -1부터 1까지 범위를 가지며 다음을 의미합니다:

- 1은 완벽한 양의 상관 관계를 나타냅니다(한 변수가 증가하면 다른 변수도 증가합니다),
- -1은 완벽한 음의 상관 관계를 나타냅니다(한 변수가 증가하면 다른 변수는 감소합니다),
- 0은 상관 관계가 없음을 나타냅니다.

# 데이터 변환

<div class="content-ad"></div>

문제는 숫자가 아닌(범주형) 값이 포함된 데이터 세트에 대한 히트맵을 작성하려고 할 때 발생합니다. 상관 계수는 숫자 데이터를 기반으로 계산되며, 숫자가 아닌 값이 포함되면 오류가 발생할 수 있습니다.

데이터 변환

이 문제를 해결하기 위해 범주형 변수를 숫자 형식으로 인코딩해야 합니다. 인코딩 과정은 각 카테고리에 고유한 숫자 식별자를 할당하는 것을 포함합니다. 이를 통해 히트맵이 숫자 데이터와 함께 작동하므로 상관 관계를 효과적으로 계산할 수 있습니다.

```js
from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()
```

<div class="content-ad"></div>

```js
# 객체 유형의 열을 숫자 표현으로 변환합니다
df['Radiation_Therapy'] = label_encoder.fit_transform(df['Radiation_Therapy'])
df['Chemotherapy'] = label_encoder.fit_transform(df['Chemotherapy'])
df['Hormone_Therapy'] = label_encoder.fit_transform(df['Hormone_Therapy'])
df['Marital_Status'] = df['Marital_Status'].astype('category').cat.codes
```

우리의 피처들 사이에 상관관계가 있는지 히트맵으로 확인해보겠습니다.

```js
# 상관 행렬 계산
corr_matrix = df.corr()
```

```js
# 히트맵 생성
plt.figure(figsize=(12, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', square=True)
```

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_16.png" />

결과적으로 나타나는 상관 행렬 및 히트맵은 데이터셋 내의 수치적 특징 사이의 관계를 시각적으로 제공합니다. 상관 행렬을 분석함으로써 어떤 특징이 유방암 생존 예측에 상당한 영향을 미칠 수 있는지 통찰력을 얻을 수 있습니다. 이 정보는 우리의 추가 분석을 이끄는 데 도움이 되며, 생존률에 영향을 미치는 중요한 요소의 발견으로 이어질 수도 있습니다.

기억하세요, 탐색적 데이터 분석은 반복적인 과정이며, 초기 단계에서 얻은 통찰력을 바탕으로 추가 분석 및 시각화를 수행할 수 있습니다.

다변량 분석


<div class="content-ad"></div>

# 열지도를 사용하여 데이터를 분석하는 방법은 무엇인가요?

질문: 각 연도별로 각 연령 그룹에서 몇 명의 환자가 수술을 받았나요?

![이미지](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_17.png)

열지도를 통해 연령 그룹의 동적 및 연도별 분포를 확인할 수 있습니다. 이는 정보를 토대로 한 비즈니스 결정에 중요한 세부사항과 패턴을 알려줍니다.

<div class="content-ad"></div>

특정 연도와 연령 그룹의 조합이 두드러지게 나타납니다. 예를 들어, X-축의 '1964'와 Y-축의 '70-75' 조합이 가장 높은 값을 갖습니다. 이는 1964년에 70-75세 연령 그룹에서 수술을 받은 환자 수가 많았다는 것을 시사합니다. 반면에, '1963'과 '80-85'의 조합은 가장 낮은 값을 갖는데, 해당 연도에 해당 연령 그룹의 환자 수가 적다는 것을 의미합니다.

차트를 더 자세히 분석하려면, 두 축의 주요 카테고리를 살펴볼 수 있습니다. X-축에서는 연도 '1964'가 가장 흔한 수술 연도로 돋보이며, Y-축에서는 연령 그룹 '30-35'가 가장 많습니다. 이 정보는 비즈니스 결정과 전략에 유용할 수 있습니다. 다양한 연도와 연령 그룹에 걸쳐 환자 분포에 대한 통찰을 제공하기 때문입니다.

# 2. 상자 그림

상자 그림은 데이터셋의 분포를 시각적으로 효과적으로 나타내는 간결하고 정보를 제공하는 방법입니다. 최솟값, 최댓값, 중앙값, 그리고 사분위수를 포함한 주요 통계 측정치를 요약합니다.

<div class="content-ad"></div>

일부 상자 플롯을 그려볼까요?

```js
plt.figure(figsize=(15, 4))
```

```js
# 서브플롯 1
plt.subplot(1, 3, 1)
sns.boxplot(x='Survival_Status', y='Age', data=df, hue='Survival_Status', palette='Blues', legend=False)
# 서브플롯 2
plt.subplot(1, 3, 2)
sns.boxplot(x='Survival_Status', y='Year of Operation', data=df, hue='Survival_Status', palette='Blues', legend=False)
# 서브플롯 3
plt.subplot(1, 3, 3)
sns.boxplot(x='Survival_Status', y='Positive_Axillary_Nodes', data=df, hue='Survival_Status', palette='Blues', legend=False)
```

질문:

<div class="content-ad"></div>

- 생존한 환자와 그렇지 않은 환자 사이의 연령 분포가 다른가요? 서로 다른 생존 결과에 대해 중앙 연령이나 연령 분포에 뚜렷한 차이가 있나요?
- 환자들의 생존 상태에 따라 수술 연도 분포에 어떤 추이나 패턴이 있나요? 상자 그림(boxplot)을 통해 생존한 환자와 그렇지 않은 환자들 간의 수술 연도에 뚜렷한 차이가 있나요?
- 양성 겨드랑이 림프절의 분포는 생존 결과에 따라 어떻게 다른가요? 생존자와 비 생존자 간의 양성 겨드랑이 림프절 분포에 뚜렷한 차이가 있나요?

![이미지](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_18.png)

인사이트: 환자의 연령 및 수술 연도에 대한 상자그림은 유사한 특성을 공유할 수 있음을 나타내는 비교 가능한 통계를 보여줍니다. 반면, 양성 겨드랑이 림프절에 대한 상자그림은 이상치가 많이 존재함을 보여주는데, 이는 의료 데이터셋에서 흔히 관측되는 현상입니다.

암 생존의 맥락에서 양성 겨드랑이 림프절의 이상치는 환자들이 유난히 높은 수의 양성 겨드랑이 림프절을 가지고 있었던 경우를 시사할 수 있습니다.

<div class="content-ad"></div>

# 3. 바이올린 플롯

바이올린 플롯은 상자 그림과 커널 밀도 플롯의 측면을 결합한 인사이트 있는 시각화 기법입니다. 데이터 분포에 대한 더 깊은 이해를 제공하며 전통적인 상자 그림보다 미묘한 표현을 제공합니다. 바이올린 플롯에서 특정 값에서 플롯의 너비는 해당 값의 데이터 포인트 밀도에 해당합니다. 데이터 세트에서 선택한 특징에 대해 바이올린 플롯을 작성하는 방법은 다음과 같습니다:

```js
# 흥미로운 특징
selected_features = ['나이', '수술 연도', '양성 겨드랑이 림프 노드']
```

```js
# 선택한 특징에 대한 바이올린 플롯 플로팅
for feature in selected_features:
    plt.figure(figsize=(8, 6))
    sns.violinplot(x='생존 상태', y=feature, data=df, hue='생존 상태', palette='Blues', inner='quartile', legend=False)
    plt.title(f'{feature}에 대한 바이올린 플롯(생존 상태 별)')
    plt.xlabel('생존 상태')
    plt.ylabel(feature)
    plt.show()
```

<div class="content-ad"></div>

- 생존한 환자와 그렇지 않은 환자 사이의 연령 분포는 어떻게 다른가요?
- 서로 다른 생존 결과를 가진 환자들의 수술 연도에 관한 어떤 통찰을 얻을 수 있나요?
- 서로 다른 생존 결과를 가진 환자들의 양성 겨드랑이 림프 결절 분포가 어떻게 다른가요?

![이미지](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_19.png)

통찰: 바이올린 플롯은 상자 플롯에 비해 정보를 더 많이 제공하기 때문에 데이터의 기본 분포와 통계 요약을 나타내는데 더 유익합니다. 양성 겨드랑이 림프 노드의 바이올린 플롯에서 '예' 및 '아니오' 클래스 레이블에 대해 분포가 매우 치우쳐 있는 것을 확인할 수 있습니다. 이는 -

- 대부분의 환자(두 클래스 모두)의 양성 겨드랑이 림프 노드가 적게 감지된다는 것을 나타냅니다.

<div class="content-ad"></div>

이러한 관찰은 이전 섹션에서 우리가 한 관찰과 일관성이 있습니다.

## 4. 쌍 플롯

쌍 플롯은 여러 변수 간의 관계를 동시에 탐색하는 강력한 도구로 작용합니다. 이 시각화 기술은 두 변수 간의 연결을 보여주는 그래프 그리드를 생성합니다. 이러한 쌍별 상호작용을 검토함으로써 우리는 패턴, 상관 관계 및 의존성을 발견할 수 있습니다. 이러한 요인은 변수를 개별적으로 살펴볼 때 뚜렷하지 않을 수 있습니다.

이 분석에서 우리는 변수 간의 관계를 시각화하는 것뿐만 아니라 생존 상태에 따라 패턴을 구별하기 위해 쌍 플롯을 사용했습니다. 환자가 생존했는지 여부에 따라 데이터 포인트를 색상으로 구분함으로써, 특정 변수 조합이 더 나은 결과 또는 더 나쁜 결과와 연관이 있는지 여부를 파악할 수 있습니다. 이 접근 방식을 통해 우리는 유방암 생존에 영향을 미치는 요인들의 복잡한 상호작용을 보다 심층적으로 탐구할 수 있습니다.

<div class="content-ad"></div>

```js
sns.pairplot(df, hue='Survival_Status')
```

![Pair Plot](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_20.png)

분석: Pair plot을 통해 대각선의 상단과 하단에 대칭 패턴이 나타납니다. 이는 특징 쌍 간의 관계가 축을 교환해도 일관되게 유지됨을 나타냅니다. 이 대칭성은 상삼각형 또는 하삼각형 중 하나를 분석해도 본질적으로 동일한 정보를 제공한다는 것을 시사합니다.

Pair plot의 대각선 플롯은 각 구체적인 특징의 단일 변수 분포를 시각적으로 나타내는 커널 밀도 부드러운 히스토그램을 보여줍니다. 이를 통해 각 변수의 분포를 살펴볼 수 있습니다.


<div class="content-ad"></div>

그러나 우리의 쌍 플롯에서 주목할 만한 관측 결과는 두 기능 간의 상당한 중첩이 있다는 것인데, 이는 이러한 기능 쌍을 고려할 때 클래스 레이블 간의 명확한 구분이 부족하다는 것을 나타냅니다.

## 5. 산점도

산점도는 일반적으로 그래프 상에 점으로 나타낸 개별 데이터 포인트들을 포함합니다. 그것은 본래 선이 없지만, 변수 간의 추세나 관계를 시각화하기 위해 최적 적합 선이나 회귀 선을 추가하여 나타낼 수 있습니다.

- 질문: Tumor_Size와 Positive_Axillary_Nodes의 수 사이에 상관 관계가 있습니까?

<div class="content-ad"></div>

```js
plt.figure(figsize=(7, 6))
sns.scatterplot(x='종양_크기', y='양성_겨드랑이_림프_절', data=df, hue='생존_상태', palette='pastel')
```

![이미지](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_21.png)

인사이트: 이 산점도에서 양성 겨드랑이 림프절의 수와 종양 크기 간에 중간 정도의 양의 관계를 관찰합니다. 점의 밀도는 데이터의 분포를 시사하며, 종양 크기가 클수록 양성 겨드랑이 림프절 수가 증가하는 경향을 보입니다. 그러나 많은 이상치 점이 이 경향에서 벗어나며, 잠재적 이상 현상을 조사해야 합니다. 이 그래프는 특정 범위의 양성 겨드랑이 림프절 및 종양 크기를 대표하는 밀도 높은 클러스터를 강조하며, 의료 의사 결정에 유용한 통찰을 제공합니다.

# 6. 조인트 플롯


<div class="content-ad"></div>

시본의 Joint Plot은 두 개의 그래프가 한 번에 표시됩니다! 이는 두 개의 숫자 변수에 대한 다각적인 시각을 제공하여 산점도와 유익한 히스토그램이 우아하게 결합됩니다. 산점도는 변수 간의 잠재적 상관 관계와 패턴을 보여주며, 축을 따라 나타나는 히스토그램은 각각의 분포를 보여줌으로써 한 눈에 이해할 수 있는 시각화를 제공합니다. 상관 계수와 함께 제공되는 Joint Plot은 선형 관계의 강도와 방향을 측정하여 초기 데이터 탐색과 가설 생성을 돕습니다.

```python
import seaborn as sns
import matplotlib.pyplot as plt
```

```python
sns.jointplot(x='나이', y='양성 겨드랑이 림프 결절', data=df, color='연한 파랑색')
plt.show()
```

<img src="/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_22.png" />

<div class="content-ad"></div>

통찰력:

- 중앙에 있는 산점도는 환자의 연령과 양성 겨드랑이 림프 노드 수 사이의 관계를 보여줍니다.
- 축을 따라 있는 히스토그램은 각 변수의 분포를 개별적으로 보여줍니다.
- 상단 가장자리의 히스토그램은 모든 연령 그룹이 수술을 받을 가능성이 거의 동일하다는 것을 나타냅니다.
- 오른쪽 가장자리의 히스토그램은 대부분의 환자가 양성 겨드랑이 림프 노드 수가 10개 미만임을 나타냅니다.

# 7. 분포 플롯

분포 플롯은 연속 변수의 분포를 시각적으로 나타내는 확률 밀도 함수(PDF) 플롯으로 종종 언급됩니다. 이는 변수 내에서 다른 값들의 빈도수 또는 확률에 대한 통찰력을 제공합니다. 일반적으로 플롯은 분포의 모양과 특성을 보여줌으로써 분석가가 데이터의 중심 경향, 분산 및 잠재적인 패턴을 이해할 수 있게 합니다.

<div class="content-ad"></div>

질문: 생존한 환자와 그렇지 않은 환자 간의 연령 그룹 분포가 어떻게 다른가요?

![plot](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_23.png)

이 도표는 흥미로워 보여요!

- 모든 연령 그룹 중 50세 미만의 환자들이 가장 많아요.
- 클래스 레이블 간에 많은 중첩이 있어요. 이는 수술 후 환자의 생존 상태를 환자의 나이로 확인할 수 없다는 것을 의미해요.

<div class="content-ad"></div>

# 8. Contour plot

등고선 그림은 3차원 표면을 2차원 형식으로 그리는 것으로, 상수 z 단면을 등고선이라는 이름으로 표현하는 그래픽 기술입니다. 등고선 그림을 사용하면 데이터를 2차원 플롯으로 시각화할 수 있습니다. 다음은 3차원에서의 정보가 평평한 2차원 차트로 합쳐지는 방식을 도식적으로 나타낸 것입니다 -

![Diagrammatic Representation](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_24.png)

환자의 나이

<div class="content-ad"></div>

시각화한 결과가 멋지네요! seaborn 라이브러리를 사용하여 환자의 나이를 x축으로, 수술 년도를 y축으로 하는 등고선 그림을 그렸어요 —

```js
sns.jointplot(x='patient_age', y='operation_year', data=df, kind='kde', fill=True)
plt.show()
```

결과:
![Image](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_25.png)

<div class="content-ad"></div>

인사: 위의 등고선 그래프에서 1961년부터 1963년까지 58세에서 75세 사이의 환자들이 더 많이 관찰되었음을 알 수 있습니다.

# 결론:

![그림](/assets/img/2024-06-20-CompleteExploratoryDataAnalysisEDAusingPython_26.png)

유방암 생존 예측 데이터셋의 탐색적 데이터 분석(EDA) 여정을 통해, 우리의 주요 목표는 생존율에 영향을 미치는 요인을 밝혀내고 패턴을 파악하며 의미 있는 통찰을 추출하는 것이었습니다. 다양한 EDA 기술과 Python 및 판다스 라이브러리의 활용은 이러한 목표를 달성하는 데 중요한 역할을 하였습니다. 기술 통계와 시각화는 이상치와 생존 결과에 미치는 잠재적인 영향을 명확히 나타내었습니다. 이 EDA는 데이터셋에 대한 깊은 이해를 제공하며 더 많은 분석과 모델링을 위한 기반 단계로 작용합니다.