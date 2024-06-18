---
title: "차트 전쟁 - 쌓인 막대 차트 대 히트맵"
description: ""
coverImage: "/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_0.png"
date: 2024-06-19 05:07
ogImage: 
  url: /assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_0.png
tag: Tech
originalTitle: "Chart Wars — Stacked Bar Chart vs. Heatmap"
link: "https://medium.com/towards-data-science/chart-wars-stacked-bar-chart-vs-heatmap-959423de6fee"
---


## 빠른 성공 데이터 과학

![이미지](/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_0.png)

빠르게 하나의 숫자 변수를 공유하는 두 가지 범주 변수가 있을 때, 그들을 비교할 수 있는 가장 좋은 시각화 방법은 무엇인가요?

"스택된 막대 차트"라고 생각했다면, 그것은 이해할 수 있어요. 어쩌면 시간이 부족한 상황이었으니까요.

<div class="content-ad"></div>

스택된 막대 차트는 금방 혼잡해지기 쉽습니다. 여기에는 미국 노동통계국의 공개 도메인 데이터를 사용한 예시가 있습니다. 두 가지 범주형 변수는 소비 유형(예: 식품 및 교통)과 연령대입니다. 수치 변수는 전체 지출의 백분율입니다.

![차트](/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_1.png)

가장 큰 전체 지출을 쉽게 파악할 수 있지만, 각 연령대별로 해석하는 것은 돋보기를 사용해도 어려울 수 있습니다. 또한 x축이 100%를 초과하므로 혼란스러울 수 있습니다.

그룹화된 막대 차트를 사용하면 조금 더 나아지지만 여전히 읽기 어려울 수 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_2.png" />

이런 차트를 보면 제작자가 무엇을 하려고 했는지 알았는지, 아니면 의도적으로 데이터를 혼란스럽게 만들려고 했는지 궁금해집니다.

대안으로는 히트맵이 있습니다. 히트맵은 색상을 사용하여 2차원 공간에서 값을 보여주는 데이터 시각화 기술입니다. 이전 데이터를 히트맵으로 표현한 것은 다음과 같습니다:

<img src="/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_3.png" />

<div class="content-ad"></div>

히트맵은 막대 차트보다 여러 가지 개선 사항을 가지고 있어요. 우선, 환영 느낌이 들어서, 복잡한 막대 차트보다 혐오스럽지 않아요. 각 셀의 크기가 같아서 작은 항목이 눈에 잘 띄게 축소되지 않아요. 실제 값들을 게시할 공간도 있어요.

한눈에 가장 큰 지출을 파악할 수 있고, 세부 등급은 명백해요. 상당한 차이점들이 두드러지고, 색이 변하지 않는 행들은 연령 그룹 전체에서 지출 수준이 비슷했음을 의미해요.

주택이 가장 큰 지출이라는 것과 평생에 걸쳐 일정한 것인 것을 쉽게 알 수 있어요. 음식 역시 일정해요. 이동 수단은 점차 청소년 시기부터 고령 시기까지 천천히 줄어들어요; 의료비는 대략 세 배; 보험료는 급격히 낮아지고; 그리고 현금 기부(자녀나 자선 단체에)는 꾸준히 증가해요.

다음 섹션에서, 저는 Python, pandas 및 Plotly Express를 사용해 이 히트맵을 어떻게 생성했는지 확인할 거에요.

<div class="content-ad"></div>

# 히트맵 코드

다음 코드는 CSV 파일을 팬더스 데이터프레임으로 로드한 다음, Plotly Express를 사용하여 히트맵으로 플롯합니다. 입력 데이터는 미국 인구조사국이 편성한 2021년 소비자 지출 조사의 요약판입니다.

## 라이브러리 가져오기 및 파일 로드

이 프로젝트에서는 외부 라이브러리 팬더스와 Plotly Express를 사용할 것입니다. 이전 링크에서 설치 지침을 찾을 수 있습니다.

<div class="content-ad"></div>

GIST에서 URL 주소를 사용하여 CSV 파일을 로드할 거예요. 그리고 DataFrame의 인덱스를 "Expenditure Type" 열로 설정해서 편하게 플로팅할 거예요.

```js
import pandas as pd
import plotly_express as px

# CSV 파일을 DataFrame으로 읽기:
df = pd.read_csv('https://bit.ly/3RsVQkF', header=1)
df.set_index('Expenditure Type', inplace=True)
display(df)
```

<img src="/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_4.png" />

각 카테고리의 총 지출 비율을 나타내는 값이에요. 다시 한 번 언급하자면, 약간의 작은 카테고리는 제외했기 때문에 100%에 완전히 더해지지는 않을 거예요.

<div class="content-ad"></div>

## 히트맵 그리기

Plotly Express는 Matplotlib의 Seaborn과 같은 라이브러리인 Plotly 라이브러리입니다: 더 친절하고 부드러운 플로팅 선택지입니다. Plotly Express를 사용하면 최소한의 코드로 다양한 시각화를 만들 수 있습니다.

다음 코드는 주석이 있는 셀 값이 추가되어 일반적인 Plotly Express의 코드보다 더 많은 양의 코드로 구성되어 있습니다. 또한 이전에 사용하던 노란색-주황색-갈색 (YlOrBr) 스케일 대신 회색 색상 스케일을 사용하고 있습니다.

```js
# 히트맵 생성:
fig = px.imshow(df, 
                labels=dict(x="연령대", 
                            y="지출 유형", 
                            color="지출 비율"),
                color_continuous_scale='Greys',
                title='<br><br>\
                       2021 연령대별 지출 (비율)')

# 셀 값 주석 추가:
for i, expenditure_type in enumerate(df.index):
    for j, age_bracket in enumerate(df.columns):
        fig.add_annotation(x=j, y=i, 
                           text=str(df.loc[expenditure_type, age_bracket]), 
                           showarrow=False)
fig.update_annotations(font=dict(family="Arial", 
                                 size=12, 
                                 color="firebrick"))

# 그림 크기 및 여백 설정:
fig.update_layout(width=600, height=1000, 
                  margin=dict(l=20, r=10, t=20, b=20))

# 축 레이블을 굵게 설정:
fig.update_yaxes(tickfont_family="Arial Black")
fig.update_xaxes(tickfont_family="Arial Black")

# 색상 스케일 끄기:
fig.update(layout_coloraxis_showscale=False)
```

<div class="content-ad"></div>

히트맵은 Plotly Express의 imshow() 메서드에 의해 생성됩니다. 해당 인수에는 데이터프레임, x-y 라벨 및 히트맵 셀 색상(딕셔너리 데이터 형식으로 전달), 색상 스케일 및 제목이 포함됩니다.

제목 문자열의 시작에 HTML 줄 바꿈 문자(`br`)이 있는 것을 주목해주세요. 이 문자가 없으면 Plotly Express의 기본값으로 제목이 예기치 않게 히트맵 행렬 위에 높게 나타납니다. 누군가 이에 대해 불평해야 합니다.

여기서 가장 간단하지 않은 코드는 셀을 주석으로 설명하기 위해 사용된 for 루프입니다. 셀의 값에 텍스트를 추가하는 것은 선택 사항이며, 색상 스케일이 이를 처리하지만, 저는 그래픽을 크게 향상시킨다고 생각합니다. 두 개의 범주형 열을 반복하고 Plotly의 add_annotations() 메서드를 사용하여 값을 게시하는 프로세스입니다.

나머지 코드는 플롯을 형식화하고 주석 덕분에 더 이상 필요하지 않은 색상 스케일을 해제하는 것입니다.

<div class="content-ad"></div>

다음은 회색-빨강 색상 체계의 히트맵입니다:

![히트맵](/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_5.png)

Plotly Express는 팝업 호버 창과 같은 유용한 기능이 있는 동적 시각화를 제공합니다. 이 창은 마우스 커서가 히트맵 셀과 같은 선택된 그래픽 요소 위를 지날 때 정보를 표시합니다:

![동적 시각화](/assets/img/2024-06-19-ChartWarsStackedBarChartvsHeatmap_6.png)

<div class="content-ad"></div>

이 hover 창들은 색상이나 주석이 해석하기 어려울 때 명확성을 더해줍니다. 또한 시각화에 직접적으로 포함되지 않은 DataFrame 열의 값과 같은 추가 정보를 표시할 수 있습니다.

# 요약

히트맵은 데이터 포인트의 크기를 시각화하기 위해 이차원 그리드와 색상 그라데이션을 사용합니다. 패턴과 상관 관계를 드러내고 핫스팟을 식별하며 여러 변수를 동시에 비교하는 데 유용합니다.

다른 시각화인 쌓인 막대 차트와 같은 경쟁 시각화는 지나치게 복잡해질 수 있는 반면, 히트맵은 접근하기 쉽습니다. 모든 셀이 동일한 크기이므로 작은 기여도가 "줄어들지 않고" 모든 데이터 포인트가 명확하게 주석 처리될 수 있습니다.

<div class="content-ad"></div>

Plotly Express에는 pandas DataFrame에서 쉽게 heatmap을 생성하는 내장 메소드가 있습니다. 이 hover 창 기능을 사용하면 표를 조사하고 DataFrame에 저장된 추가 데이터를 표시할 수 있습니다.

# 데이터로 이야기하기

가장 중요한 데이터 시각화 결정은 올바른 차트 유형을 선택하는 것입니다. 이 결정에 어려움이 있는 경우, 'From Data to Viz' 웹사이트와 'Storytelling with Data' 차트 안내를 방문해보세요. 두 사이트 모두 데이터 과학자들에게 유용한 리소스입니다.

# 더 나은 쌓인 막대 차트

<div class="content-ad"></div>

스텍 바 차트 모두 좋은 것은 아닙니다. "Marimekko" 차트라는 변형은 꽤 매력적일 수 있어요:

# 감사합니다!

읽어 주셔서 감사합니다. 앞으로 더 많은 퀵 서클러스 데이터 과학 프로젝트를 위해 저를 팔로우해 주세요.