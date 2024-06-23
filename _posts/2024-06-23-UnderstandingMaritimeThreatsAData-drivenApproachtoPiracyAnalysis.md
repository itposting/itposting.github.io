---
title: "해적 위협 이해하기 데이터 기반 해적 분석 방법"
description: ""
coverImage: "/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_0.png"
date: 2024-06-23 16:05
ogImage: 
  url: /assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_0.png
tag: Tech
originalTitle: "Understanding Maritime Threats: A Data-driven Approach to Piracy Analysis"
link: "https://medium.com/code-like-a-girl/exploratory-data-analysis-and-visualization-of-maritime-piracy-attacks-dataset-%EF%B8%8F-53affbd9c728"
---


![Understanding Maritime Threats](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_0.png)

해상 해적 활동은 글로벌 배송 및 해안 지역 커뮤니티에 대한 중요한 우려 사항이며, 해상에서의 공격은 인간의 생명 뿐만 아니라 경제 활동에도 위협을 가합니다. 공격은 해상에서 활동하는 범죄 그룹들에 의해 실시되는 납치, 무장 강도, 납치 등 다양한 불법 활동을 포함합니다. 이러한 공격은 선원의 생명을 위협하며, 세계 경제에 영향을 미치는 국제 무역 노선 및 해상 상업을 방해하여 전 세계 경제에 영향을 줍니다.

해적 사건의 패턴 및 기본 요인을 이해하는 것은 효과적인 대책을 개발하고 해상 안보를 보장하는 데 중요합니다. 본문에서는 20년 이상의 기간에 걸친 포괄적 데이터세트를 활용하여 해상 해적 공격의 분석 및 시각화에 대해 탐구합니다. 지리적 분포, 시간적 추세, 사회 경제 지표와의 상관 관계를 탐색함으로써, 우리는 바다에서의 해적 공격의 역학 및 해양 안전과 안보에 대한 함의를 밝혀내고자 합니다.

# 데이터세트 가져오기

<div class="content-ad"></div>

요즘, CC BY 4.0 DEED로 라이선스 된 이 데이터셋을 발견했어요. 이 데이터셋은 해상 해적 공격에 대한 정보를 제공하며, 1993년부터 2020년까지 7,500건 이상의 해적 공격에 대한 정보와 국가 데이터(Wolrd Bank를 주원천으로 함) 및 지리적 데이터를 포함하고 있어요. 이 데이터는 2021년에 발표된 데이터 논문으로, 해적 공격을 이해하고 예방하기 위해 반해적 조직, 연구자 및 상업 기업에서 사용될 것을 목적으로 하고 있어요. 데이터셋의 일반적인 개념은 기록된 해적 공격을 관련 국가와 해당 사건 발생 시의 사회 경제적 상황과 연결하는 것이에요.

보다 구체적으로, 데이터셋은 세 가지 테이블로 구성되어 있어요:

- pirate_attacks, 각 기록된 공격에 대한 데이터를 제공
- country_indicators, 관련 국가의 사회 및 경제 데이터(연도별)
- country_codes, 사용된 국가 코드를 국가 이름과 지역과 연결하는 테이블

Markdown 포맷으로 표를 변경하면서 다음과 같이 표시할 수 있어요:

![Understanding Maritime Threats: A Data-driven Approach to Piracy Analysis](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_1.png)

<div class="content-ad"></div>

여기 데이터 세트의 각 열에 대한 간단한 설명입니다:

- 첫 번째 이미지:
![](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_2.png)

- 두 번째 이미지:
![](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_3.png)

- 세 번째 이미지:
![](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_4.png)

<div class="content-ad"></div>

Plotly와 잘 어울리기 때문에 분석 작업에 Jupyter Lab을 사용했어요. Python에서 시각화를 만드는 데 좋아하는 Plotly와 함께하는 것이 좋았어요. 데이터셋을 주피터 노트북(Jupyter Notebook)으로 가져오기 위해서 먼저 데이터셋 파일(CSV 파일)이 프로젝트 디렉토리에서 접근 가능한지 확인해야 해요. 그런 다음 다음과 같이 할 수 있어요:

```js
import pandas as pd

pirate_attacks = pd.read_csv('pirate_attacks.csv')
country_indicators = pd.read_csv('country_indicators.csv')
country_codes = pd.read_csv('country_codes.csv')
```

데이터셋을 가져온 후, 데이터프레임을 확인해볼 수 있어요:

```js
pirate_attacks
```

<div class="content-ad"></div>

해적_공격 데이터 프레임의 각 특성에 대한 널 값의 백분율도 확인했습니다:

```js
nan_percentage = pirate_attacks.isna().mean() * 100
print("각 열의 NaN 백분율:")
print(nan_percentage)
```

![이미지](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_5.png)

일부 열에는 상당한 비율의 널 값이 있습니다. 따라서 이러한 속성을 중심으로 분석하는 것은 의미가 없습니다. 예를 들어 vessel_type, time 및 attack_description에 대한 확인은 귀찮습니다. 왜냐하면 이러한 속성의 대부분 값이 널입니다.

<div class="content-ad"></div>

# 탐색적 데이터 분석

Plotly는 제가 가장 선호하는 파이썬 시각화 라이브러리이기 때문에 이 게시물의 모든 시각화는 Plotly로 만들어졌습니다.

이 분석은 세 가지 섹션으로 나뉘어 있습니다:

- 공간 분석
- 시계열 분석
- 상관 분석

<div class="content-ad"></div>

## 1. 공간 분석

데이터를 시각화한 지도는 만드는 것이 가치가 있어요.

```python
import plotly.express as px
import plotly.graph_objects as go

# Plotly Express를 사용하여 산포도 그리기
fig = px.scatter_mapbox(pirate_attacks, lat='latitude', lon='longitude', 
                        title='해적 공격: 위도와 경도',
                        zoom=2, height=600)

# Mapbox를 사용하여 지도 레이아웃 업데이트
fig.update_layout(mapbox_style='open-street-map')
fig.update_layout(margin=dict(l=0, r=0, t=40, b=0))

# 그래프 표시
fig.show()
```

가장 가까운 국가별 공격 횟수를 보여주는 막대 그래프도 만들었어요:

<div class="content-ad"></div>

```python
import plotly.express as px

# pirate_attacks 데이터를 가장 가까운 국가와 연도별로 그룹화하여 각 그룹의 공격 횟수 계산
pirate_attacks['date_datetime'] = pd.to_datetime(pirate_attacks['date'])
yearly_country_counts = pirate_attacks.groupby(['nearest_country', pirate_attacks['date_datetime'].dt.year]).size().reset_index(name='num_attacks')

# 각 국가의 연간 평균 공격 횟수 계산
avg_yearly_country_counts = yearly_country_counts.groupby('nearest_country')['num_attacks'].mean().reset_index()
avg_yearly_country_counts = avg_yearly_country_counts.sort_values(by='num_attacks', ascending=False)

# 국가 지표와 병합하여 국가 이름 가져오기
df_top_10_countries = pd.merge(avg_yearly_country_counts.head(10), country_codes[['country', 'country_name']],
                                left_on='nearest_country', right_on='country', how='left')

# Plotly Express를 사용하여 바 차트 생성
fig = px.bar(df_top_10_countries, x='num_attacks', y='country_name', orientation='h',
             title='평균 공격 횟수가 높은 상위 10개 국가',
             labels={'num_attacks': '연간 평균 공격 횟수', 'country_name': '국가'})
fig.update_layout(height=600, yaxis_categoryorder='total ascending')

# 차트 보이기
fig.show()
```

인도네시아는 연간 평균 공격 횟수가 가장 높은 국가입니다. 기타 국가로는 예멘, 나이지리아, 말레이시아 등이 있습니다.

데이터 포인트를 DBSCAN을 이용해 클러스터링하는 것이 흥미로웠습니다. 특히, DBSCAN 클러스터링을 위해 'eps' 매개변수를 설정했는데, 이는 동일 클러스터에 속하는 두 점 사이의 최대 거리를 정의합니다. 0.05도로 설정했는데, 이는 지구 상의 위치에 따라 약 5km 정도가 되며, 다시 말해 클러스터 내 임의의 두 점 간 최대 거리는 5km보다 작아야 합니다.

또한 'min_samples' 매개변수를 50으로 설정했는데, 이는 클러스터에 속해야 하는 최소한의 점 수를 정의합니다. 다시 말해, 모든 형성된 클러스터는 적어도 50개의 점을 가져야 하며, 이와 거리가 5km 이상 떨어진 다른 점들은 이상점으로 간주됩니다.


<div class="content-ad"></div>


```js
from sklearn.cluster import DBSCAN
import numpy as np

# NaN 값을 포함하는 행 삭제
pirate_attacks.dropna(subset=['latitude', 'longitude'], inplace=True)

# DBSCAN을 위해 위도 및 경도 열을 라디안으로 변환
pirate_attacks['lat_rad'] = np.radians(pirate_attacks['latitude'])
pirate_attacks['lon_rad'] = np.radians(pirate_attacks['longitude'])

# lat_rad 및 lon_rad 열을 numpy 배열로 연결
coordinates = pirate_attacks[['lat_rad', 'lon_rad']].values

# DBSCAN 클러스터링 수행
dbscan = DBSCAN(eps=0.05, min_samples=50)  # 필요에 따라 eps 및 min_samples 조정
dbscan.fit(coordinates)

# DataFrame에 클러스터 레이블 추가
pirate_attacks['cluster'] = dbscan.labels_

# Plotly Express를 사용하여 클러스터가 다르게 색칠된 산점도 생성
fig = px.scatter_mapbox(pirate_attacks, lat='latitude', lon='longitude', color='cluster',
                        title='해적 공격 클러스터', zoom=2, height=600,
                        color_continuous_scale=px.colors.qualitative.Light24)

# Mapbox를 사용하여 맵 레이아웃 업데이트
fig.update_layout(mapbox_style='open-street-map')
fig.update_layout(margin=dict(l=0, r=0, t=40, b=0))

# 플롯 표시
fig.show()
```

클러스터링 결과, 지도 시각화에서 모든 이상치를 포함한 20개의 클러스터가 생성되었습니다. 가장 많은 사건 수를 가진 상위 5개 클러스터는 다음과 같습니다:

- 말라카 해협/싱가포르 해협/인도네시아 지역으로 2,699개의 포인트
- 나이지리아와 토고의 다양한 항구(라고스, 로메 등)로 925개의 포인트
- 아덴만, 붉은 바다, 소말리아 지역으로 685개의 포인트
- 방글라데시의 치타공 항구로 509개의 포인트
- 남인도의 다양한 항구(첸나이, 코친, 카키나다 등)로 237개의 포인트

또한 중요한 점은 상위 클러스터 중 하나가 이상치 클러스터임을 언급해야 합니다. 이는 데이터의 상당 부분(957개 관측치)이 특정 패턴을 나타내지 않고 어느 정도 무작위로 분포되어 있음을 의미합니다. 특히, 아프리카 북동 해안을 따라 시각적으로 이상치 포인트를 확인할 수 있지만, 이러한 포인트들은 희소하며 이전에 설정된 DBSCAN 클러스터링 매개변수에 따라 명확한 클러스터를 형성하지 못합니다.


<div class="content-ad"></div>

## 2. 시계열 분석

지도에 표시된 데이터는 상당 기간에 걸쳐 있습니다. 따라서, 공격 수가 시간이 지남에 따라 어떻게 변화했는지 확인하는 것도 중요합니다. 이를 위해 월 단위로 시간에 따른 공격 수를 그래프로 표시합니다.

```js
from statsmodels.tsa.seasonal import seasonal_decompose

# 'date' 열을 날짜 타입으로 변환하고 인덱스로 설정하기
pirate_attacks['date_datetime'] = pd.to_datetime(pirate_attacks['date'])
pirate_attacks.set_index('date_datetime', inplace=True)

# 월별로 공격 수 집계
monthly_attacks = pirate_attacks.resample('M').size()

# 추세 구성 요소에 대한 플롯 생성
fig_trend = go.Figure(go.Scatter(x=result.trend.index, y=result.trend, mode='lines', name='Trend'))
fig_trend.update_layout(title='Trend Component',
                        xaxis_title='Date',
                        yaxis_title='Number of Attacks')

# 플롯 보이기
fig_trend.show()
```

추가로, 시계열의 계절성 구성 요소를 플롯합니다. 계절성 구성 요소는 데이터에서 고정된 시간 간격에서 발생하는 반복적이고 주기적인 변동 또는 패턴을 나타냅니다.

<div class="content-ad"></div>

```js
# 계절 분해를 수행합니다
result = seasonal_decompose(monthly_attacks, model='additive')

# 계절 성분을 위한 그래프를 생성합니다
fig_seasonal = go.Figure(go.Scatter(x=result.seasonal.index, y=result.seasonal, mode='lines', name='Seasonal'))
fig_seasonal.update_layout(title='계절 성분',
                           xaxis_title='날짜',
                           yaxis_title='공격 수')

# 그래프를 표시합니다
fig_seasonal.show()
```

해당 계절 성분은 4월과 5월에 해적 공격이 현저히 많은 것을 나타내며, 월평균 대비 약 네 번의 추가 공격이 있습니다. 이러한 계절성은 주로 이 달에 나타나는 유리한 날씨 조건으로 인해 해적 활동이 용이해지는 것일 수 있습니다.

또한, 해양 생물, 어업 선박 및 기타 해양 활동의 계절 이동 패턴은 해적 행동에 영향을 미칠 수 있습니다. 그러나 이러한 계절성을 설명하는 다른 요인으로는 경제적, 문화적 또는 정치적 사건 등이 있을 수 있습니다.

## 3. 상관 분석


<div class="content-ad"></div>

마침내, 해적 사건과 국가 지표 간의 잠재적 상관 관계를 탐색하기 위해 세 개의 데이터 프레임을 하나로 통합하는 새로운 통합 데이터 프레임을 만들었습니다.

다음은 Markdown 형식으로 표(tag)를 변경한 코드입니다:


# 'date' 열에서 연도를 추출
pirate_attacks['year'] = pirate_attacks['date_datetime'].dt.year

# nearest_country와 year로 데이터를 그룹화하고 각 그룹의 공격 횟수를 계산
grouped_pirate_attacks = pirate_attacks.groupby(['nearest_country', 'year']).size().reset_index(name='num_attacks')

# 'nearest_country'와 'year'를 기준으로 pirate_attacks와 country_indicators를 병합
df = pd.merge(grouped_pirate_attacks, country_indicators, left_on=['nearest_country', 'year'], right_on=['country', 'year'])

# 'country'를 기준으로 결과 DataFrame을 country_codes와 병합
df = pd.merge(df, country_codes, on='country')


그런 다음, 가장 많은 사건이 발생한 국가인 인도네시아에 중점을 두어 인도네시아의 국가 지표와 해적 공격 횟수에 대한 상관 관계 행렬을 만들었습니다.


df = df[df['nearest_country'] == 'IDN']

# 상관 관계 행렬 계산
correlation_matrix = df[['num_attacks', 'corruption_index', 'homicide_rate', 'GDP',
                         'total_fisheries_per_ton', 'total_military', 'population',
                         'unemployment_rate', 'totalgr', 'industryofgdp']].corr()

# Plotly를 사용하여 히트맵 생성
fig = go.Figure(data=go.Heatmap(z=correlation_matrix.values,
                                 x=correlation_matrix.columns,
                                 y=correlation_matrix.columns,
                                 colorscale='RdYlBu'))

# 레이아웃 업데이트
fig.update_layout(title='선택한 변수의 상관 관계 행렬',
                  xaxis_title='변수',
                  yaxis_title='변수',
                  height=800,
                  width=800
                 )

# 플롯 표시
fig.show()


<div class="content-ad"></div>


![Understanding Maritime Threats](/assets/img/2024-06-23-UnderstandingMaritimeThreatsAData-drivenApproachtoPiracyAnalysis_6.png)

인도네시아의 경우, 상관 행렬은 흥미로운 결과를 나타냈습니다. 공격 횟수와 살인 비율 간에는 양의 상관 관계(0.49)가 있어 나라 내 해적 사건의 빈도와 폭력 범죄 수준 사이에 관련성을 보여줍니다.

그 외 양의 상관 관계가 있는 변수로는 실업률(0.33)과 총 군사(0.27)가 있습니다. 이러한 양의 상관 관계는 범죄율, 고용 기회 및 군사 존재와 같은 사회 경제적 요소와 해적 활동 사이의 잠재적 연결을 나타냅니다.

# 제 생각


<div class="content-ad"></div>

제공된 데이터셋을 사용하여 해적 공격의 분석 및 시각화는 해당 사건과 관련된 양식 및 요소에 대한 유용한 통찰을 제공할 수 있습니다. 데이터셋의 탐색을 통해 해적 활동의 지리적 핫스팟, 계절적 추이 및 사회경제 지표와의 상관 관계가 나타납니다. 이를 통해 기관은 해적 발생을 모델링하거나 예측하여 선원 및 해안 지역 사회를 안전하게 보호하고 안전한 배상 노선을 결정할 수 있습니다. 해적 사건을 주도하는 기본 요인을 이해함으로써 정책 결정자와 해양 당국은 해적을 근절하고, 해상 안보를 증진하며, 취약한 지역에서 해양 활동의 안전을 향상시키기 위한 보다 효과적인 전략과 개입을 개발할 수 있습니다.

# 참고 자료 

Benden, P., Feng, A., Howell, C., & Dalla Riva G. V. (2021). Crime at Sea: A Global Database of Maritime Pirate Attacks (1993–2020). Journal of Open Humanities Data, 7: 19, pp. 1–6. DOI: https://doi.org/10.5334/johd.39

✨독서해 주셔서 감사합니다!✨

<div class="content-ad"></div>

💼 Upwork에서 함께 일해요!

💌 Medium이나 LinkedIn에서 함께 하세요!