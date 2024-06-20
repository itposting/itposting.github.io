---
title: "SQL과 Power BI를 활용한 고객 세분화 보고서"
description: ""
coverImage: "/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_0.png"
date: 2024-06-19 09:28
ogImage: 
  url: /assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_0.png
tag: Tech
originalTitle: "Customer Segmentation Report with SQL and Power BI"
link: "https://medium.com/@siriboekofiduodu/customer-segmentation-report-with-sql-and-power-bi-92fef2acfd44"
---


이 프로젝트에서는 RFM(Recency, Frequency, Monetary) 개념을 사용하여 판매 데이터 세트를 분석할 것입니다. 저의 목표는 고객을 세분화하여 최상위 구매자와 무시되고 있을 수 있는 고객 및 그들을 유지하기 위해 타겟 광고 노력이 더 필요한 사람들을 식별하는 것입니다.

RFM 보고서는 세 가지 주요 지표를 사용하여 고객을 세분화하는 방법입니다:

1. Recency(최근성): 고객의 마지막 구매가 얼마나 오래되었나요?
   
2. Frequency(빈도): 고객이 얼마나 자주 구매하나요?

<div class="content-ad"></div>

3: 금액: 고객이 구매에 얼마나 지출하는가?

## 프로젝트 계획

- 데이터 정리
- 데이터셋 개요
- 분석
- 최근성, 빈도, 금액 (RFM) 보고서
- RFM을 사용한 고객 세분화
- Power BI 대시보드

## 1. 데이터 정리

<div class="content-ad"></div>

데이터를 조사한 결과 특정 기능에 누락된 값이 있는 것을 발견했어요. 그래서 이를 "없음"으로 대체해 주었어요. 다행히도, 저가 분석할 주요 기능들에는 누락된 값이 없었어요.

```js
-- 데이터 확인하기 --
select*
from [dbo].[sales_data];

-- 데이터 정리하기 --

-- Addressline2, Postalcode 및 State 열의 누락된 값 찾기
select *
from [dbo].[sales_data]
where ADDRESSLINE2 IS NULL OR STATE IS NULL OR POSTALCODE IS NULL;

-- 누락된 값 처리하기
update [dbo].[sales_data]
set ADDRESSLINE2 = case when ADDRESSLINE2 IS NULL then 'None' else ADDRESSLINE2 end,
    STATE = case when STATE IS NULL then 'Unknown States' else STATE end,
    POSTALCODE = case when POSTALCODE IS NULL then 'None' else POSTALCODE end;
```

![이미지](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_0.png)

## 2. 데이터셋 개요

<div class="content-ad"></div>

2.1 몇 가지 변수에서의 독특한 관찰

회사는 "Productline" 열에서 나타나는 것처럼 열차, 오토바이, 비행기, 클래식 자동차 등의 판매에 특화되어 있습니다. 데이터는 2003년부터 2005년까지의 기간을 다룹니다.

```js
-- 일부 특성의 고유 관측치
select distinct STATUS from [dbo].[sales_data]
select distinct YEAR_ID from [dbo].[sales_data]
select distinct PRODUCTLINE from [dbo].[sales_data]
select distinct COUNTRY from [dbo].[sales_data]
select distinct DEALSIZE from [dbo].[sales_data]
select distinct TERRITORY from [dbo].[sales_data]
```

<img src="/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_1.png" />

<div class="content-ad"></div>

1.2 각 연도별 고유한 월

2005년의 월만 표시한 것은 그렇다고 하더라도, 2003년과 2004년은 둘 다 모든 12개월을 포함했다는 것을 기억하는 것이 중요합니다. 아래 출력에서 확인할 수 있듯이, 2005년 데이터는 5월까지만 있는 것을 알 수 있습니다.

```js
-- 각 연도별 고유한 월
select distinct MONTH_ID as Month_Id_2003  from [dbo].[sales_data]  where YEAR_ID = 2003 order by MONTH_ID ASC;

select MONTH_ID as Month_Id_2004 from [dbo].[sales_data]  where YEAR_ID = 2004 order by MONTH_ID ASC;

select distinct MONTH_ID  as Month_Id_2005 from [dbo].[sales_data]  where YEAR_ID = 2005 order by MONTH_ID ASC;
```

<img src="/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_2.png" />

<div class="content-ad"></div>

## 2. 분석

2.1 각 제품 라인에서 얼마나 벌고 있나요?

클래식 자동차가 가장 많은 구매를 했고, 가장 적은 구매는 기차였습니다.

```js
--- 제품 라인별로 매출을 그룹화하여 계산해 봅시다
select PRODUCTLINE, SUM(sales) Revenue 
from   [dbo].[sales_data]
group by PRODUCTLINE
order by 2 desc
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_3.png" />

2.2 매년 매출액은 어떻게 되나요?

결과를 통해 2004년이 가장 높은 매출을 기록했으며, 2003년이 이어서 나왔으며, 2005년의 매출액은 가장 낮았다는 것을 알 수 있습니다. 이 차이는 2005년이 단 5개월에 불과하기 때문에 전체 매출량이 2003년과 2004년의 연간 데이터와 비교하여 상대적으로 작기 때문입니다.

```js
-- 매년 매출액
select YEAR_ID, SUM(sales) Revenue 
from [dbo].[sales_data]
group by YEAR_ID
order by 2 desc 
```

<div class="content-ad"></div>


![Customer Segmentation Report](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_4.png)

2.3. What was the best month for sales in a specific year and how much was earned that month?

In 2003

There were more purchases in November and the next highest sales was October.


<div class="content-ad"></div>

```js
-- 2003년 정보에 대하여
select MONTH_ID, sum(sales) as 수익, count(ordernumber) as 빈도 
from [dbo].[sales_data]
where YEAR_ID = 2003
group by MONTH_ID
order by 2 desc
```

![고객 세분화 보고서](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_5.png)

2004년에도

2004년에도 11월에 가장 높은 매출이 있었으며, 다음으로 10월에 높은 매출이 있었습니다.

<div class="content-ad"></div>

```js
-- 2004 년도를 위한
select MONTH_ID, sum(sales) as Revenue, count(ordernumber) as Frequency 
from [dbo].[sales_data]
where YEAR_ID = 2004
group by MONTH_ID
order by 2 desc
```

<img src="/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_6.png" />

2005년도에

2005년에는 최다 구매가 5월에 발생하여 올해의 판매 정점을 나타냈습니다. 세 연도 동안의 처음 다섯 개월 구매를 비교하면, 2005년의 판매량이 비교적 높고, 그 다음이 2004년이며, 가장 낮은 것은 2003년입니다. 이는 회사의 매출이 연도를 통틀어 꾸준히 증가하고 있다는 것을 시사합니다.

<div class="content-ad"></div>

```js
-- 2005년 기준
select MONTH_ID, sum(sales) as 매출액, count(ordernumber) as 주문빈도
from [dbo].[sales_data]
where YEAR_ID = 2005
group by MONTH_ID
order by 2 desc
```

![이미지](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_7.png)

2.4. 회사가 11월에 일반적으로 가장 높은 매출액을 기록하는 제품은 무엇인가요?

11월에는 클래식 및 빈티지 자동차의 구매가 두드러지게 증가하여 2003년부터 2004년까지 전반적인 높은 매출에 크게 기여했습니다. 반면에 기차는 동일한 달에 회사의 수익 최소화를 보여주었습니다.


<div class="content-ad"></div>

```js
-- 2003년 11월
select MONTH_ID as November_2003, PRODUCTLINE, sum(sales) as Revenue, count(ordernumber) as Frequency 
from [dbo].[sales_data]
where YEAR_ID = 2003 and MONTH_ID=11
group by MONTH_ID, PRODUCTLINE
order by 3 desc

-- 2004년 11월
select MONTH_ID as November_2004,PRODUCTLINE, sum(sales) as Revenue, count(ordernumber) as Frequency 
from [dbo].[sales_data]
where YEAR_ID = 2004 and MONTH_ID=11
group by MONTH_ID, PRODUCTLINE
order by 3 desc
```

<img src="/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_8.png" />

## 4. 최근성, 주파수 및 금액 (RFM) 보고서

최근성은 마지막 주문 또는 구매 이후 경과한 일 수를 나타내며, Euro Shopping Channel과 La Rochelle Gifts는 데이터에서 가장 최근 구매를 한 날짜에 해당합니다(최대 날짜). 최근성 값이 높을수록 마지막 구매 이후의 기간이 길어집니다. RFM 결과에 따르면 Toys of Finland. Co는 데이터 집합에서 현재 또는 최대 날짜로부터 100일 이상이 지난 마지막 구매를 했습니다.
또한, 주문 사이의 평균 일 수를 살펴보면 고객들이 얼마나 자주 구매를 하는지에 대한 통찰을 제공합니다. Euro Shopping Channel은 평균 3일 간격으로 가장 꾸준한 고객 중 하나로 나타납니다.
마찬가지로, 고객 당 금액 값을 검토하면 Euro Shopping Channel이 가장 많이 지출한 것을 확인할 수 있습니다.


<div class="content-ad"></div>

```sql
-- RFM 분석
select CUSTOMERNAME,
   sum(sales) as MonetaryValue,
   avg(sales) as AvgMonetaryValue,
   count(*) as Frequency_of_orders,
   count(distinct convert(DATE, orderdate)) AS Number_of_unique_order_dates,
   convert(INT, round(cast(datediff(dd, min(ORDERDATE), max(ORDERDATE)) as decimal)/(count(*)-1),0)) as [Aveg_day_between_orders],
   datediff(DD,max(orderdate),( select max(orderdate) from [dbo].[sales_data])) as recency 
from [dbo].[sales_data]
group by CUSTOMERNAME
having count(*)>1
order by recency
```

![RFM Analysis](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_9.png)

## 5.0 RFM 보고서 기반의 고객 세분화

제공된 결과는 RFM 기준에 따른 고객 세분화에 대한 통찰을 제공합니다. rfm_recency=1에 속한 고객은 최근 구매 이후 지난 기간이 길어서, 데이터 세트에서 최대 날짜로부터 112일까지 구매를 한 Boards & Toys Co.와 같이 특징 지어집니다. 반면, rfm_recency=4는 최근 구매를 나타내며, 데이터 세트에서 가장 최근 구매가 14일 전인 Salzburg Collectables과 같은 상황입니다. 이는 rfm_recency=1 또는 2에 속한 고객이 마지막 주문 이후 상당한 시간이 지나자 "잠재적 이탈 고객"일 수 있다는 것을 나타냅니다.


<div class="content-ad"></div>

비슷하게, rfm_monetary에 대해서는 소비가 높은 고객이 rfm_monetary=4로 분류되며, 소비가 적은 고객은 rfm_monetary=1로 분류됩니다. rfm_frequency에 대해, rfm_frequency=4인 고객은 가장 많은 주문을 보유하고 있으며, rfm_frequency=1은 가장 적은 주문을 가진 고객을 나타냅니다.

이러한 RFM 카테고리를 분석하여, 최근 구매를 보유한 최고의 고객은(rfm_recency=4), 가장 높은 금액을 지출한 고객(rfm_monetary=4) 및 가장 많은 주문을 가진 고객(rfm_frequency=4)으로 식별할 수 있습니다.


---고객을 네 가지 세분류로 분류합니다.

with customer_segment as
(
 select 
   CUSTOMERNAME,
   sum(sales) as MonetaryValue,
   count(ordernumber) as Frequency_of_orders,
   max (orderdate) as last_order_date,
   (select max(orderdate) from [dbo].[sales_data]) as max_order_date,
   datediff(dd, max(orderdate),(select max(orderdate) from [dbo].[sales_data])) as Recency 
 from [dbo].[sales_data]
 group by CUSTOMERNAME 
)
select*,
  NTILE(4) OVER (order by Recency desc) as rfm_recency,
  NTILE(4) OVER (order by Frequency_of_orders) as rfm_frequency,
  NTILE(4) OVER (order by MonetaryValue) as rfm_monetary
from customer_segment 


![Customer Segmentation Report](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_10.png)


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_11.png" />

5.1 상기 Segmentation을 기반으로 고객에게 Segment 이름 할당하기.
고객 Segmentation을 고려할 때, 복합 코드가 444인 고객이 최고의 고객을 대표합니다. 첫 번째 4는 rfm_recency 그룹 4에 속한 고객을 나타내며 최근 구매를 의미합니다. 두 번째 4는 rfm_frequency 그룹 4에 속한 고객을 나타내어 많은 주문을 했음을 의미합니다. 마지막 4는 rfm_monetary 그룹 4에 속한 고객들을 나타내어 더 많은 돈을 소비했다는 것을 의미합니다.

반대로, 복합 그룹이 111인 고객들은 오랜 시간 구매를 하지 않은, 주문 수가 적고 지금까지 가장 적은 금액을 소비한 고객들입니다.

```js
-- 우리 최고의 고객은 누구인가요?

DROP TABLE IF EXISTS #customer_segment; -- 테이블 #rfm 생성
with customer_segment as
(
 select 
 CUSTOMERNAME,
 sum(sales) as MonetaryValue,
 avg(sales) as AvgMonetaryValue,
 COUNT(ordernumber) as Frequency,
 MAX(orderdate) as last_order_date,
 (select max(orderdate) from [dbo].[sales_data]) as max_oder_date,
 DATEDIFF(DD, MAX(orderdate),(select max(orderdate) from [dbo].[sales_data])) as Recency 
 from [dbo].[sales_data]
 group by CUSTOMERNAME 
),

rfm_segmentation as 
  (
  select*,
  NTILE(4) OVER (order by Recency desc)as rfm_recency,
  NTILE(4) OVER (order by Frequency) as rfm_frequency,
  NTILE(4) OVER (order by MonetaryValue) as rfm_monetary
   --(NTILE(4) OVER (order by Recency)) + (NTILE(4) OVER (order by Frequency)) + (NTILE(4) OVER (order by AvgMonetaryValue)) AS CompositeScore
  from customer_segment 
 )

select 
 c.*, rfm_recency + rfm_frequency + rfm_monetary as rfm_cell,
 CAST(rfm_recency as varchar)+ CAST(rfm_frequency as varchar)+ CAST(rfm_monetary as varchar) as rfm_cell_string

into #customer_segment -- 스크립트를 실행하면서 테이블을 생성하는 데 도움이 됩니다. 맨 위에 #rfm 테이블이 이미 생성되었습니다.
from rfm_segmentation c



select CUSTOMERNAME, rfm_recency,rfm_frequency, rfm_monetary,rfm_cell_string,
  CASE
  when rfm_cell_string in (111, 112, 121, 122, 211, 212, 114, 141, 123, 131,132,141,142,221, 231,232,242,241) then '잃어버린 나 새로운 고객'
  when rfm_cell_string in (222,223, 233,134,143,133,144,234,232,244) then '사라져가지만 돈을 많이 쓰는 고객' -- 회사는 그들이 떠나는 것을 방치해서는 안됩니다
  when rfm_cell_string in (411,412,421,422,342,442,322,332,311) then '정기적이지만 소비가 적은 고객'
  when rfm_cell_string in (424,423,432,324,414,324,331) then '좋은 고객들' 
  when rfm_cell_string in (444,443,434,344,333,334, 343,433) then '최고의 고객들' 
  end rfm_segment

from #customer_segment
```

<div class="content-ad"></div>

![RFM Report with Power BI](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_12.png) 

![RFM Report with Power BI](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_13.png) 

## 6. Power BI를 사용한 RFM 보고서

Power BI 대시보드를 통해 Euro Shopping Channel이 최고의 성과를 거두었음이 명확히 드러납니다. 해당 채널은 가장 많은 고유 주문을 하여 총 25개를 달성하였고, 또한 최근 구매자 중에서도 속해 있습니다.

<div class="content-ad"></div>

대시보드에서 주목할 만한 관찰 중 하나는 고객 세그먼트별 매출을 분석할 때 "우수 고객"으로 표시된 범주가 의외로 가장 낮은 매출을 보인다는 것입니다. 이는 세분화 규칙을 적용한 후 이 범주에 속하는 고객이 단 하나뿐이기 때문입니다. 따라서 이 한 명의 고객으로부터 발생한 총 매출이 다른 세그먼트에 속한 여러 고객들의 집계 매출보다 낮을 수밖에 없는 것입니다.

![이미지](/assets/img/2024-06-19-CustomerSegmentationReportwithSQLandPowerBI_14.png)

끝
프로젝트를 읽어 주셔서 감사합니다.
LinkedIn: www.linkedin.com/in/kofi-duodu-siriboe-a184021b2