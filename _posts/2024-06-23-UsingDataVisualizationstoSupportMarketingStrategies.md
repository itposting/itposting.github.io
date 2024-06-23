---
title: "마케팅 전략을 지원하는 데이터 시각화 사용법"
description: ""
coverImage: "/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_0.png"
date: 2024-06-23 16:09
ogImage: 
  url: /assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_0.png
tag: Tech
originalTitle: "Using Data Visualizations to Support Marketing Strategies."
link: "https://medium.com/@datageek22/using-data-visualizations-to-support-marketing-strategies-a50c807c10bb"
---


## R을 사용하여 호텔 예약 회사를 위한 데이터 시각화 작업을 합니다.

![image](/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_0.png)

# 시나리오

저는 호텔 예약 회사의 주니어 데이터 분석가로서 호텔 예약 데이터를 정리하고 `ggplot2`로 시각화를 생성하여 데이터를 분석하고 시각화를 통해 데이터의 다양한 측면을 제시하는 작업을 맡게 되었습니다.

<div class="content-ad"></div>

다음으로, 다음 단계를 살펴봅시다 👇🏽

## 단계 1: 데이터 가져오기

저는 RStudio에 데이터 세트를 가져와서 비즈니스 업무를 시작했어요.

코드:

<div class="content-ad"></div>

```R
hotel_bookings <- read.csv("hotel_bookings.csv")
```

## 단계 2: ggplot2 패키지 설치 및 불러오기

ggplot2를 사용하려면 tidyverse 패키지를 설치하고 로드해야 했어요.

코드:


<div class="content-ad"></div>


``` r
install.packages("tidyverse")
library(tidyverse)
```

### Step 3: Making different Charts

#### Chart 1:

A stakeholder was interested in developing promotions based on different market segments, but first he needed to know how many of the transactions were occurring for each market segment and if it was dependent on the type of hotel.


<div class="content-ad"></div>

해당 코드는 Markdown 형식으로 변경해야 합니다. 

코드:

```js
ggplot (data = hotel_bookings) + geom_bar (mapping = aes (x=market_segment, fill = market_segment)) + facet_wrap(~hotel)
```

시각화:

<img src="/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_1.png" />

<div class="content-ad"></div>

데이터 시각화를 한 후, 차트가 깔끔하지 않고 내 발견물을 명확하게 전달하지 못한다는 것을 깨달았어요. 그래서 다음 차트를 제작하게 되었어요.

## 차트 2:

이해를 돕기 위해 이 시각화를 정리하고 주석을 추가해야 했어요. 제목, 부제목, 그리고 데이터가 cover하는 기간을 보여주는 캡션을 추가했어요. 더 나아가 x-축 포인트를 정리하고, y-축 레이블을 "예약 횟수"로 변경하여 정말 명확하게 만들었어요.

코드:

<div class="content-ad"></div>

```js
ggplot (data = hotel_bookings) + geom_bar (mapping = aes (x=market_segment, fill = market_segment)) + facet_wrap(~hotel) +

theme(axis.text.x = element_text (angle = 90)) +
labs(title = "호텔 예약: 호텔별 시장 세그먼트 비교", subtitle = "두 종류의 호텔 샘플", caption = "데이터 출처: 2015-2017", y="예약 건수")
```

시각화:

<img src="/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_2.png" />

## 차트 3:

<div class="content-ad"></div>

또 다른 이해관계자가 말했습니다. "일찍 예약하는 사람들을 대상으로 하고 싶고, 아이를 둔 사람들은 미리 예약해야한다는 가설이 있습니다." 데이터를 탐색한 후, 제가 기대한 것과는 다르게 나타나서 더 나아가 산포도를 만들었습니다. 산포도를 통해 가설이 부정확했음을 확인하고 결과를 보고했습니다.

코드:

```js
ggplot (data = hotel_bookings) + geom_point (mapping = aes (x = lead_time, y = children))
```

시각화:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_3.png" />

## Chart 4:

이 차트를 위해 먼저 데이터를 필터링하여 "City Hotel" 호텔 유형의 "Online TA" 시장 세그먼트만 포함하도록 했습니다. 이 새로운 데이터 프레임의 이름을 "onlineta city hotels"로 지었습니다.

코드:

<div class="content-ad"></div>

```r
onlineta_city_hotels <- hotel_bookings %>%
filter(hotel == "City Hotel" & market_segment == "Online TA")
```

새 데이터 프레임에서 내 시각화를 만들었고, 차트는 아이들과 함께하는 예약의 리드 타임도 보여줍니다.

코드:

```r
ggplot(data = onlineta_city_hotels) + geom_point(mapping = aes(x = lead_time, y = children))
```

<div class="content-ad"></div>

시각화:

![시각화](/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_4.png)

## 차트 5:

다음 차트는 어떤 게스트 그룹이 가장 많은 주말 밤을 예약하는지 알아내어 새 마케팅 캠페인에서 해당 그룹을 대상으로 할 수 있도록 하는 것이 목적이었습니다. 내 이해관계자의 가설은; 아이가 없는 게스트가 가장 많은 주말 밤을 예약한다는 것입니다. 데이터를 시각화한 결과, 그녀의 가설이 실제로 정확하다는 것을 보여 주었습니다.

<div class="content-ad"></div>

아래는 바뀐 마크다운 형식입니다:


The Code:

```js
ggplot (data = hotel_bookings) + geom_point (mapping = aes (x = stays_in_weekend_nights, y = children))
```

The Visual:

![Visualization](/assets/img/2024-06-23-UsingDataVisualizationstoSupportMarketingStrategies_5.png)


<div class="content-ad"></div>

# 데이터 개요

저는 사용한 호텔 예약 데이터는 Nuno Antonio, Ana Almeida 및 Luis Nunes가 Data in Brief, Volume 22, February 2019에 게재한 논문인 'Hotel Booking Demand Datasets' (https://www.sciencedirect.com/science/article/pii/S2352340918315191)에서 원래 비롯되었습니다.

이 데이터는 Thomas Mock과 Antoine Bichat에 의해 2020년 2월 11일 주간 #TidyTuesday를 위해 다운로드 및 정리되었습니다 (https://github.com/rfordatascience/tidytuesday/blob/master/data/2020/2020-02-11/readme.md).