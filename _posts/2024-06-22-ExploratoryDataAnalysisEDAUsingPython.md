---
title: "파이썬을 사용한 탐색적 데이터 분석 EDA 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_0.png"
date: 2024-06-22 16:56
ogImage: 
  url: /assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_0.png
tag: Tech
originalTitle: "Exploratory Data Analysis (EDA) Using Python"
link: "https://medium.com/@teppan_noodle/exploratory-data-analysis-eda-using-python-f85938cb1810"
---


## Python에서 탐색적 데이터 분석 및 데이터 시각화에 대한 기본 예제

![image](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_0.png)

# 소개

탐색적 데이터 분석(EDA)는 데이터 분석 과정에서 중요한 단계로, 데이터셋을 더 잘 이해하기 위한 작업입니다. EDA를 통해 데이터의 주요 특징, 변수 간의 관계, 문제에 관련이 있는 변수들을 이해할 수 있습니다. 또한 EDA를 통해 데이터에서 누락된 값, 중복된 값, 이상값 및 오류를 식별하고 처리할 수 있습니다.

<div class="content-ad"></div>

이 게시물에서는 Pandas, Numpy, Matplotlib 및 Seaborn과 같은 다양한 라이브러리를 사용하여 EDA(탐색적 데이터 분석)를 수행할 때 Python을 사용합니다. Pandas는 데이터 조작 및 분석을 위한 라이브러리입니다. Numpy는 숫자 계산을 위한 라이브러리입니다. Matplotlib 및 Seaborn은 데이터 시각화를 위한 라이브러리입니다.

이 프로젝트에서는 2023년 Goodreads Choice Awards 베스트 북을 분석할 것입니다.

![image](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_1.png)

분석을 수행하고 연습을 시작하려면 Kaggle에서 이 데이터셋을 찾을 수 있습니다.

<div class="content-ad"></div>

# 데이터 이해하기

## 필요한 라이브러리 가져오기

```js
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')
```

## 데이터셋을 판다스 데이터프레임에 불러오기

<div class="content-ad"></div>

```python
# CSV 파일에 데이터가 저장되어 있으므로, Pandas 함수를 사용하여 CSV 파일을 읽을 것입니다.
df = pd.read_csv('Good_Reads_Book_Awards_Crawl_2023_12_27_11_14.csv')

df.sample(5) # 데이터 샘플을 표시합니다

```

![image](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_2.png)

다음으로 데이터셋에서 일부 불필요한 열을 제거할 것이며, 이 단계는 선택 사항입니다. 사용하지 않을 열을 제거하여 DataFrame의 크기를 줄이는 것이 좋습니다.

```python
# 사용하지 않을 열은 source_URL, Book Description, About the Author입니다
df.drop(['source_URL','Book Description','About the Author'], axis=1, inplace=True)
```

<div class="content-ad"></div>

## 데이터프레임 확인하기

이제 각 열의 데이터 유형을 확인하고 숫자 열의 요약을 확인하여 다음 단계를 결정할 수 있습니다.

```js
df.info()
```

![이미지](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_3.png)

<div class="content-ad"></div>

.info()를 통해 데이터 세트는 누락된 값이 없는 상태로 괜찮아 보입니다. 또한 데이터 세트의 형태(컬럼 수: 12, 행 수: 299) 및 각 컬럼의 데이터 유형과 같은 정보를 제공해줍니다.

```js
df.describe()
```

![이미지](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_4.png)

.describe() 메서드는 DataFrame의 숫자형 열에 대한 요약 통계를 제공합니다. 각 숫자형 열의 평균값, 중간값, 표준 편차, 최솟값 및 최댓값을 보여줍니다.

<div class="content-ad"></div>

## Int/Float 크기를 축소하고 데이터 유형 할당하기

데이터의 외관과 숫자 구성을 식별했다면, 데이터 분석의 후속 단계를 결정할 수 있습니다. .info()로부터 데이터의 크기인 28.2 KB와 각 열의 데이터 유형을 알 수 있습니다. .describe() 메서드는 각 열의 최솟값과 최댓값, 그리고 평균값과 같은 숫자 열의 통계를 보여줍니다.

이 결과를 통해 Number of Ratings와 Number of Reviews와 같이 여전히 숫자 열이어야 하는 열이 누락되어 있는 것을 알 수 있습니다. 이러한 열들은 천 단위 구분자로 쉼표 “,”를 사용합니다. Readers Choice Votes와 같이 일반 서식으로 저장된 열은 천 단위 구분자가 없습니다. 숫자를 쉼표로 구분하지 않고 일반 숫자를 사용하는 이유는 식별자일 수도 있고 여러 자리 숫자일 수도 있어 숫자를 분리하는 것이 적절하지 않을 수 있기 때문입니다. 따라서 쉼표를 제거하고 공백으로 대체해야 합니다.

```js
numeric_columns = ['Number of Ratings', 'Number of Reviews']

# 해당 열에서 캐릭터 쉼표를 제거하고 Int32로 변환
for column in numeric_columns:
    df[column] = df[column].replace(',', '', regex=True).astype('int32')
```

<div class="content-ad"></div>

이 방법은 위의 열에서 모든 쉼표를 제거할 것입니다. .astype(`int32`) 이 부분은 남겨두셔도 좋습니다. 왜냐하면 판다스가 자동으로 데이터 유형을 int64로 할당해줄 것이기 때문입니다. 여기서 64와 32는 각 행당 메모리 양이나 비트 수를 나타냅니다.

그대로 둘 수 있지만, 데이터프레임을 더 효율적으로 만들기 위해 이러한 값을 낮은 값으로 다운캐스팅하고 있습니다. 아래 숫자형 열의 범위를 살펴보면:

![이미지](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_5.png)

각 숫자형 열의 가장 작은 값과 가장 큰 값을 보여줍니다. 예를 들어 'Readers Choice Votes' 열에서, 가장 작은 값은 935이고 가장 큰 값은 397565입니다.

<div class="content-ad"></div>

값의 범위를 알면 해당 값을 저장하는 데 필요한 비트를 결정할 수 있습니다. 참고로:

- Int8 변수는 -128에서 127까지의 값을 저장할 수 있습니다.
- Int16 변수는 -32,768에서 32,767까지의 값을 저장할 수 있습니다.
- Int32 변수는 -2,147,483,648에서 2,147,483,647까지의 값을 저장할 수 있습니다.
- Int64 변수는 -9,223,372,036,854,775,808에서 9,223,372,036,854,775,807까지의 값을 저장할 수 있습니다.

Int32가 값 범위에 딱 맞는 옵션입니다. Int64를 사용할 수도 있지만 더 많은 메모리를 사용하고 DataFrame을 덜 효율적으로 만든다는 점에서 적절하지 않습니다.

실수의 경우에는 약간 다릅니다. 실수는 데이터가 저장할 수 있는 소수 자릿수에 실제로 영향을 줍니다. Float16는 4자리 소수를 저장하고, Float32는 8자리 소수를 저장하며, Float64는 16자리 소수를 저장할 수 있습니다. DataFrame에서 많은 소수 자릿수를 사용할 필요는 없지만 원래 값과 동일하게 유지하고 싶은 경우 Float16을 사용하는 것이 가장 좋은 선택입니다.

<div class="content-ad"></div>

이제 각 열의 값을 범위로 알고 있으므로 해당 열을 올바른 데이터 유형으로 할당할 것입니다.

또한 일부 열은 텍스트 값을 저장합니다. 해당 열의 데이터 유형을 문자열 또는 범주로 할당할 수 있습니다. 판다스 문서에 따르면 범주형 데이터 유형은 소수의 다른 값으로 구성된 문자열 변수(예: 성별, 사회 계급, 혈액형, 국가 소속 등)에 유용합니다. 이 정의에 따라 'Column Readers Choice Category'가 범주형 데이터 유형을 사용하는 가장 적합한 선택입니다.

```js
# 나머지 열을 올바른 데이터 유형으로 변환합니다.
convert_dict = {'Readers Choice Votes': 'int32',
                'Readers Choice Category': 'category',
                'Title': 'string',
                'Author': 'string',
                'Total Avg Rating': 'float16',
                'Number of Pages': 'int16',
                'Edition': 'category',
                'First Published date': 'datetime64[ns]',
                'Kindle Price': 'float16'}
df = df.astype(convert_dict)
```

'Kindle Version and Price' 열의 경우 이미 가격 데이터를 저장하는 'Kindle Price'라는 다른 열이 있으므로 가격을 제거할 것입니다.

<div class="content-ad"></div>

```jsx
#텍스트에서 통화를 분리하여 새 열에 넣습니다
df['Kindle Version'] = df['Kindle Version and Price'].str.extract('([a-zA-Z ]+)', expand=False).str.strip()

#열을 올바른 데이터 유형으로 변경합니다
df['Kindle Version'] = df['Kindle Version'].astype('category')

#이전 열을 제거합니다
df = df.drop('Kindle Version and Price', axis=1)
```

이제 데이터프레임을 다시 확인해보겠습니다:

```jsx
df.info()
```

![이미지](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_6.png)

<div class="content-ad"></div>

```js
df.describe()
```

![Exploratory Data Analysis using Python](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_7.png)

```js
df.sample(10)
```

![Exploratory Data Analysis using Python](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_8.png)


<div class="content-ad"></div>

최근 결과에서 보듯이 데이터프레임의 메모리 크기를 크게 줄일 수 있습니다. 데이터 유형을 변경하고 정수 및 부동 소수점을 다운캐스팅하여 메모리 크기를 줄이는 방법입니다. 이 단계는 선택 사항이지만 대규모 데이터셋을 다룰 때 매우 유용할 수 있습니다.

# 데이터 분석 및 시각화

## 카테고리 분포

첫 번째 분석은 데이터셋 내의 다양한 카테고리별 책 분포를 찾는 것입니다. 그런 다음 seaborn 모듈을 사용하여 시각화할 것입니다.

<div class="content-ad"></div>

```js
cat_counts = df['독자 선호 카테고리'].value_counts()
print(cat_counts)

plt.figure(figsize=(12, 6))
sns.barplot(x=cat_counts.index, y=cat_counts.values, palette='Blues_d')
plt.title('카테고리별 분포')
plt.xlabel('카테고리')
plt.ylabel('책 수')
plt.xticks(rotation=30, ha='right')
plt.show()
```

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_9.png" />

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_10.png" />

우리 데이터는 모든 카테고리에 고르게 분포되어 있습니다. 다만, 데뷔 소설 카테고리만 19권의 책이 있습니다.

<div class="content-ad"></div>

다음은 각 카테고리별 투표, 평점, 리뷰, 페이지 및 가격 분포를 분석할 것입니다. 이 분포를 시각화하기 위해 상자 그림을 사용할 것입니다.

```js
fig, axes = plt.subplots(3, 2, figsize=(16, 18), sharey=False, sharex=True)

# 첫 번째 플롯: 독자 선호 투표 분포
sns.boxplot(data=df, x='Readers Choice Category', y='Readers Choice Votes', palette='Set3', ax=axes[0, 0])
axes[0, 0].set_title('각 카테고리별 독자 선호 투표 분포')
axes[0, 0].set_ylabel('투표')

# 두 번째 플롯: 평균 평점 분포
sns.boxplot(data=df, x='Readers Choice Category', y='Total Avg Rating', palette='Set3', ax=axes[0, 1])
axes[0, 1].set_title('각 카테고리별 평균 평점 분포')
axes[0, 1].set_ylabel('평균 평점')

# 세 번째 플롯: 평가 수 분포
sns.boxplot(data=df, x='Readers Choice Category', y='Number of Ratings', palette='Set3', ax=axes[1, 0])
axes[1, 0].set_title('각 카테고리별 평가 수 분포')
axes[1, 0].set_ylabel('평가 수')

# 네 번째 플롯: 리뷰 수 분포
sns.boxplot(data=df, x='Readers Choice Category', y='Number of Reviews', palette='Set3', ax=axes[1, 1])
axes[1, 1].set_title('각 카테고리별 리뷰 수 분포')
axes[1, 1].set_ylabel('리뷰 수')

# 다섯 번째 플롯: 페이지 수 분포
sns.boxplot(data=df, x='Readers Choice Category', y='Number of Pages', palette='Set3', ax=axes[2, 0])
axes[2, 0].set_title('각 카테고리별 페이지 수 분포')
axes[2, 0].set_ylabel('페이지 수')

# 여섯 번째 플롯: 킨들 가격 분포
sns.boxplot(data=df, x='Readers Choice Category', y='Kindle Price', palette='Set3', ax=axes[2, 1])
axes[2, 1].set_title('각 카테고리별 킨들 가격 분포')
axes[2, 1].set_ylabel('킨들 가격')

for ax in axes[2, :]:
    ax.set_xticklabels(ax.get_xticklabels(), rotation=30, ha='right')
    
fig.tight_layout()
plt.show()
```

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_11.png" />

대부분의 분포가 편향되어 있으며, 몇몇 카테고리에서 극단값이 있습니다. 평균 평점 분포는 데이터가 정규 분포되어 있습니다. 편향된 데이터의 중심 경향성을 측정하는 가장 좋은 방법은 중앙값을 사용하는 것입니다. 중앙값은 극단값(이상치)에 민감하지 않기 때문에 적합합니다.

<div class="content-ad"></div>

## 카테고리별 분석

이제 투표, 평점, 리뷰, 페이지 및 가격별로 카테고리를 조사하여 2023년 가장 인기 있는 카테고리를 찾아보겠습니다.

```js
# 집계할 열을 결정합니다.
aggregations = {'Readers Choice Votes': 'sum', 
                'Total Avg Rating': 'mean',
               'Number of Ratings': 'sum',
               'Number of Reviews': 'sum',
                'Number of Pages': 'median',
                'Kindle Price': 'median',
               }

# 책 분야별로 그룹화합니다.
category_vote = df.groupby('Readers Choice Category').agg(aggregations).sort_values('Readers Choice Votes', ascending=False)

# 각 카테고리의 총 투표, 총 평점 및 총 리뷰의 백분율을 계산합니다.
total_votes = category_vote['Readers Choice Votes'].sum()
total_ratings = category_vote['Number of Ratings'].sum()
total_reviews = category_vote['Number of Reviews'].sum()
percent_of_total_votes = (category_vote['Readers Choice Votes'] / total_votes) * 100
percent_of_total_ratings = (category_vote['Number of Ratings'] / total_ratings) * 100
percent_of_total_reviews = (category_vote['Number of Reviews'] / total_reviews) * 100

# 새로운 Votes, Ratings 및 Reviews의 데이터프레임을 생성합니다.
result_df = pd.DataFrame({
    'Votes (합산)': category_vote['Readers Choice Votes'], 
    '% 투표': percent_of_total_votes, 
    '평균 평점': category_vote['Total Avg Rating'].round(2),
    'Number of Ratings': category_vote['Number of Ratings'],
    '% 총 평점': percent_of_total_ratings.round(2),
    'Number of Reviews': category_vote['Number of Reviews'],
    '% 총 리뷰': percent_of_total_reviews.round(2),
    'Median Pages': category_vote['Number of Pages'],
    'Median Kindle Price': category_vote['Kindle Price'].round(2)
    })

# 가장 많이 투표된 카테고리 찾기
max_voted_cat = result_df['Votes (합산)'].idxmax()
max_votes = result_df['Votes (합산)'].max()
avg_rat = result_df.loc[max_voted_cat, '평균 평점']

# 가장 많이 평가된 카테고리 찾기
max_rated_cat = result_df['Number of Ratings'].idxmax()
max_rates = result_df['Number of Ratings'].max()
pct_max_rates = result_df['% 총 평점'].max()

# 가장 많이 리뷰된 카테고리 찾기
max_reviewed_cat = result_df['Number of Reviews'].idxmax()
max_reviews = result_df['Number of Reviews'].max()
pct_max_reviews = result_df['% 총 리뷰'].max()

# 결과 출력
print(f"'{max_voted_cat}' 카테고리가 2023년 가장 많이 투표된 카테고리로 선정되었습니다. {max_votes:,}표를 획득했습니다.")
print(f"'{max_rated_cat}' 카테고리가 2023년 가장 많이 평가된 카테고리로 선정되었습니다. 평균 평점은 {format(avg_rat, '.2f')}이며, 평가 횟수는 {max_rates:,}회이며, 전체 평점의 {format(pct_max_rates, '.2f')}%를 차지하고 있습니다.")
print(f"'{max_reviewed_cat}' 카테고리가 2023년 가장 많이 리뷰된 카테고리로 선정되었습니다. 리뷰 수는 {max_reviews:,}개이며, 전체 리뷰의 {format(pct_max_reviews, '.2f')}%를 차지하고 있습니다.")

result_df
```

![이미지](/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_12.png)


<div class="content-ad"></div>

다음으로는 데이터를 시각화하여 더 나은 이해와 시각화를 하려고 합니다.

```js
fig, axes = plt.subplots(3, 2, figsize=(16, 18), sharey=False)

# 첫 번째 그래프
sns.barplot(x=result_df.index, y=result_df['Votes (sum)'], palette='Blues_d', order=result_df.index, ax=axes[0, 0])
axes[0, 0].set_title('각 카테고리별 독자 투표수')
axes[0, 0].set_ylabel('투표수')
axes[0, 0].set_xticklabels(labels=result_df.index, rotation=30, ha='right')

# 두 번째 그래프
result_df_sorted = result_df.sort_values(by='Avg Ratings', ascending=False)
sns.barplot(x=result_df_sorted.index, y=result_df_sorted['Avg Ratings'], palette='Blues_d', order=result_df_sorted.index, ax=axes[0, 1])
axes[0, 1].set_title('각 카테고리별 평균 평점')
axes[0, 1].set_ylabel('평균 평점')
axes[0, 1].set_xticklabels(labels=result_df_sorted.index, rotation=30, ha='right')

# 세 번째 그래프
result_df_sorted = result_df.sort_values(by='Number of Ratings', ascending=False)
sns.barplot(x=result_df_sorted.index, y=result_df_sorted['Number of Ratings'], palette='Blues_d', order=result_df_sorted.index, ax=axes[1, 0])
axes[1, 0].set_title('각 카테고리별 평점 수')
axes[1, 0].set_ylabel('평점 수')
axes[1, 0].set_xticklabels(labels=result_df_sorted.index, rotation=30, ha='right')

# 네 번째 그래프
result_df_sorted = result_df.sort_values(by='Number of Reviews', ascending=False)
sns.barplot(x=result_df_sorted.index, y=result_df_sorted['Number of Reviews'], palette='Blues_d', order=result_df_sorted.index, ax=axes[1, 1])
axes[1, 1].set_title('각 카테고리별 리뷰 수')
axes[1, 1].set_ylabel('리뷰 수')
axes[1, 1].set_xticklabels(labels=result_df_sorted.index, rotation=30, ha='right')

# 다섯 번째 그래프
result_df_sorted = result_df.sort_values(by='Median Pages', ascending=False)
sns.barplot(x=result_df_sorted.index, y=result_df_sorted['Median Pages'], palette='Blues_d', order=result_df_sorted.index, ax=axes[2, 0])
axes[2, 0].set_title('각 카테고리별 평균 페이지 수')
axes[2, 0].set_ylabel('페이지 수')
axes[2, 0].set_xticklabels(labels=result_df_sorted.index, rotation=30, ha='right')

# 여섯 번째 그래프
result_df_sorted = result_df.sort_values(by='Median Kindle Price', ascending=False)
sns.barplot(x=result_df_sorted.index, y=result_df_sorted['Median Kindle Price'], palette='Blues_d', order=result_df_sorted.index, ax=axes[2, 1])
axes[2, 1].set_title('각 카테고리별 평균 킨들 가격')
axes[2, 1].set_ylabel('킨들 가격 ($)')
axes[2, 1].set_xticklabels(labels=result_df_sorted.index, rotation=30, ha='right')

plt.tight_layout()
plt.show()
```

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_13.png" />

그럼 여기까지입니다. 평균 평점이 가장 높지 않은에도 불구하고, Romance이 2023년에 가장 인기 있는 책 카테고리로 선정되었습니다. 다른 카테고리보다 투표, 평점 및 리뷰에서 우위를 차지했습니다. Ratings와 Reviews에서 두 번째로 높은 등수를 차지하며 숫자가 두 배 더 많습니다. 한편, Humor와 History & Biography는 2023년에 가장 인기 없는 두 가지 책 카테고리로 순위했습니다.

<div class="content-ad"></div>

각 카테고리의 가격은 매우 유사한 편이지만, Romance과 Romantasy는 모든 카테고리 중에서 가장 낮은 중간 가격을 가지고 있습니다. 이에도 불구하고 투표 수, 평점 및 리뷰 수가 많습니다.

## 상관 관계 찾기

이제 질문이 등장합니다. 투표 수, 리뷰, 평점 또는 페이지 수와 가격 사이에 어떤 상관 관계가 있는지 알아볼까요? 페이지 수가 많으면 평점이 높을까요? 아니면 낮은 가격 카테고리일수록 더 많은 리뷰와 높은 평점을 받게 될까요? 알아보도록 하겠습니다.

```js
# 열 할당
columns_of_interest = ['리뷰 수', '평가 수', '페이지 수', '총평균 평점', '최다선정 표', '킨들 가격']

# 상관 행렬 계산
correlation_matrix = df[columns_of_interest].corr()

# 상관 행렬 표시
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5)
plt.title('상관 행렬')
plt.xticks(rotation=30, ha='right')
plt.show()
```

<div class="content-ad"></div>


<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_14.png" />

이 행렬을 통해 독자 선호투표와 리뷰 수와 평가 수 간에 높은 상관 관계가 있다는 것을 알 수 있습니다. 높은 리뷰와 평점은 높은 투표와 관련이 있습니다. 페이지 수와 가격은 투표, 평점, 리뷰 사이에 강한 연결이 없습니다. 즉, 책의 가격과 두께가 투표, 평점, 리뷰에 실제로 영향을 미치지 않는다는 것을 의미합니다.

## 책으로 분석하기

2023년 가장 투표를 많이 받은 책이 무엇인지 확인해 보는 시간입니다.


<div class="content-ad"></div>

```js
most_voted_books = df[['Title', 'Readers Choice Category', 'Readers Choice Votes', 'Total Avg Rating', 'Number of Ratings', 'Number of Reviews', 'Number of Pages']].sort_values(by=['Readers Choice Votes', 'Number of Ratings', 'Number of Reviews'], ascending=False).head(20)

plt.figure(figsize=(14, 6))
sns.barplot(x=most_voted_books['Title'], y=most_voted_books['Readers Choice Votes'], data=most_voted_books, palette='Blues_d')
plt.title('2023년 가장 많이 투표된 책')
plt.xlabel('책 제목')
plt.ylabel('투표 수')
plt.xticks(rotation=30, ha='right')
plt.show()

most_voted_books
```

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_15.png" />

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_16.png" />

그래서 이겨낸 책이 결정되었습니다. Fourth Wing은 2023 독자 선호 투표에서 가장 인기 있는 책으로 우승을 차지했습니다. 2위인 Yellowface보다 거의 2배 많은 표를 받아 거의 백만 개의 평가를 받았습니다. 로맨티지 카테고리에 해당하는 투표 중 절반 이상을 차지했어요.

<div class="content-ad"></div>


이제 모든 카테고리에서 수상자들을 살펴보겠습니다.

```js
max_votes_index = df.groupby('Readers Choice Category')['Readers Choice Votes'].idxmax()
titles_with_max_votes = df.loc[max_votes_index, ['Readers Choice Category', 'Title', 'Readers Choice Votes', 'Total Avg Rating', 'Number of Ratings', 'Number of Reviews', 'Number of Pages']].sort_values('Readers Choice Votes', ascending=False)
titles_with_max_votes
```

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_18.png" />


<div class="content-ad"></div>

다음으로, 2023년에 각 월별로 발행된 책의 수를 알아내기 위해 barplot을 사용하여 분석할 예정입니다.

```js
import calendar
df['First Published date'] = pd.to_datetime(df['First Published date'])

# 2023년에 발행된 책만 추출합니다.
books_2023 = df[df['First Published date'].dt.year == 2023]

# 각 월별 발행된 책의 수를 계산합니다.
books_per_month = books_2023.groupby(books_2023['First Published date'].dt.month)['Title'].count().reset_index()
books_per_month['Month'] = books_per_month['First Published date'].apply(lambda x: calendar.month_abbr[x])

plt.figure(figsize=(14, 8))
sns.barplot(data=books_per_month, x='Month', y='Title', palette='Blues_d')
plt.title('2023년에 발행된 책의 분포')
plt.xlabel('월')
plt.ylabel('발행된 책의 수')
plt.show()

books_per_month[['Month','Title']]
```

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_19.png" />

<img src="/assets/img/2024-06-22-ExploratoryDataAnalysisEDAUsingPython_20.png" />

<div class="content-ad"></div>

이 그래프를 통해 우리는 11월에 가장 적은 책이 출간되었음을 발견했습니다. 반면에 9월과 1월은 가장 많은 책이 출간된 달이었습니다.

# 결론

우리의 분석을 통해 2023년에 어떤 카테고리가 가장 인기가 많고 가장 인기가 적은지를 결정했습니다. 또한 페이지, 투표, 평점 및 리뷰 사이의 연결 여부를 확인하기 위해 분포 분석과 상관 분석을 수행했습니다.

내가 방금 보여준 것은 Python을 데이터 분석과 시각화 도구로 사용하는 놀라운 방법의 일감입니다. 이 기사에서는 데이터 집합을 더 깊게 이해할 수 있도록 중요한 기본 단계를 다루었는데, 이를 위해 분석을 위한 pandas와 시각화를 위한 matplotlib/seaborn과 같은 라이브러리를 사용했습니다.

<div class="content-ad"></div>

제 글을 읽어 주셔서 감사합니다. 읽으시는 데 즐거움을 느끼셨기를 바라고 파이썬에서의 탐색적 데이터 분석을 이해하는 데 도움이 되었기를 바랍니다.

여기서 저의 전체 코드를 제 Github에서 찾아볼 수 있습니다.