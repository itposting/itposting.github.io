---
title: "코로나19 데이터와 의료 시설 분석 인사이트와 추천 사항"
description: ""
coverImage: "/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_0.png"
date: 2024-06-23 16:52
ogImage: 
  url: /assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_0.png
tag: Tech
originalTitle: "Analysis of Healthcare Facilities and COVID-19 Data: Insights and Recommendations"
link: "https://medium.com/@Splendor001/analysis-of-healthcare-facilities-and-covid-19-data-insights-and-recommendations-391d82381db3"
---



![2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations](/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_0.png)

# 소개

본 보고서는 의료 시설과 COVID-19 데이터와의 관련성을 종합적으로 분석하는 것을 목표로 합니다. 이 분석은 COVID-19 사례 수, 사망률, 점유율 및 각 주별 의료 시설의 분포와 같은 주요 측면을 탐구합니다. 데이터는 2020년부터 2023년까지 이어지며, 시간에 따른 트렌드와 패턴을 깊이 파악할 수 있습니다.

지속적인 COVID-19 유행으로 인해 의료 부문에 상당한 영향을 미쳤으며, 의료 시설은 환자 치료와 관리에서 중요한 역할을 합니다. COVID-19 사례 및 의료 시설과 관련된 데이터를 이해하는 것은 공공 보건 및 의료 관리에 관여하는 의료 관리자, 정책 결정자 및 기타 이해 관계자들에게 중요합니다.


<div class="content-ad"></div>

2020년부터 2023년까지 다수의 데이터셋을 결합하여 이 분석에 사용된 데이터를 작성했습니다. 이를 통해 상황이 어떻게 변화되고 있는지를 전체적으로 파악할 수 있었습니다. 이 데이터셋에는 사망자, COVID-19 사례, 및 병원의 점유율, 공급자 이름, 그리고 공급자 주소와 같은 다양한 병원 특성에 관한 세부 정보가 포함되어 있습니다.

이 데이터를 분석하는 목표는 중요한 추세와 통찰을 발견하여 의사 결정을 안내하는 데 있습니다. 이러한 통찰은 COVID-19 바이러스의 확산을 막는 전략을 돕고, 자원을 효율적으로 할당하는 데 도움을 주며, 의료 시스템의 결함을 식별할 수 있습니다.

이 보고서는 COVID-19 사례의 총 수, 사망률, 점유율, 그리고 주별 건강시설의 분포를 포함한 다양한 분석을 다룹니다. 이러한 분석은 건강시설에 미치는 COVID-19 영향에 대한 포괄적인 이해를 제공하며, 개선할 수 있는 분야와 미래 방향을 명확히 합니다.

우리는 이 분석에서 파생된 결과 및 권고사항을 제시함으로써 의료관리자, 정책 결정자, 그리고 의료 데이터 분석 분야에 관심을 가지는 사람들에게 유용한 통찰을 제공하기를 희망합니다. 이 보고서는 의료 부문 대비 준비 상태, 자원 할당, 그리고 기술 개발을 개선하기 위한 조치 및 데이터 기반 의사 결정의 시작점 역할을 합니다.

<div class="content-ad"></div>

아래 섹션에서는 의료 시설 및 COVID-19 데이터를 분석한 결과 도출된 주요 결론, 분석 방법론 및 제안 사항에 대해 다룹니다.

## 의료 시설 개요

본 분석에 사용된 의료 시설 데이터셋에는 다양한 의료 제공자에 대한 포괄적인 정보가 포함되어 있습니다. 해당 데이터셋에는 이러한 시설들이 보고한 COVID-19 사례, 사망자 및 회복자에 대한 데이터가 포함되어 있습니다. 이 데이터셋은 병원, 양로원, 의료 센터 등 다양한 의료 제공자를 다루고 있습니다.

데이터셋은 여기에서 찾을 수 있습니다. 데이터 사전은 여기에서 찾을 수 있습니다.

<div class="content-ad"></div>

# 데이터 정제

의료 시설 데이터 집합을 분석하는 동안 다음과 같은 데이터 정제 및 프로필링 단계가 수행되었습니다:

- 결측값 처리: 결측값을 식별하고 데이터의 완전성과 정확성을 보장하기 위해 적절히 처리하였습니다.
- 데이터 유효성 검사: 데이터 무결성 검사를 수행하여 데이터 집합에서 불일치나 이상을 식별했습니다. 잘못된 또는 일관성 없는 데이터 항목이 수정되거나 제거되어 데이터 품질을 유지하였습니다.
- 데이터 변환: 데이터 유형 변환과 같은 필요한 데이터 변환을 적용하여 분석 및 시각화 작업을 용이하게 하였습니다.
- 데이터 품질 평가: 데이터 집합의 전반적인 품질을 완전성, 정확성, 일관성 및 신뢰성 기준으로 평가하였습니다. 데이터 품질 문제를 해결하여 분석 결과의 신뢰성을 보장하였습니다.

이러한 데이터 정제 및 프로필링 단계를 수행함으로써 데이터 집합이 신뢰성 있고 일관성 있으며 추가 분석을 위해 준비되었습니다. 이는 데이터 집합에서 도출된 통찰력의 신뢰성과 정확성을 향상시킵니다.

<div class="content-ad"></div>

# 분석 및 결과

- 2021년에 가장 많은 평균 일일 COVID-19 케이스를 보유한 의료 시설은 어디인가요? 상위 10개 시설을 표시하세요.

```js
--2021년에 가장 많은 평균 일일 COVID-19 케이스를 가진 의료 시설은 어디인가요? 상위 10개 시설 표시.
SELECT TOP 10 Provider_Name, ROUND(AVG(Residents_Weekly_Confirmed_COVID_19),2) AS average_daily_cases
FROM [dbo].[faclevel_2021]
GROUP BY Provider_Name
ORDER BY average_daily_cases DESC;
```

![Healthcare Facilities Data Analysis](/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_1.png)

<div class="content-ad"></div>

- NELLA'S AT AUTUMN LAKE HEALTHCARE은 평균 29건의 일일 COVID-19 케이스로 가장 높은 평균을 기록하며 돋보입니다. 이는 시설의 위치, 지역 커뮤니티 전파율, 검사 프로토콜, 감염 통제 조치, 환자 인구 통계 및 자원 배정과 같은 다양한 요인으로 인해 발생할 수 있습니다.
- 일일 평균 7.5건의 케이스로 KENT COUNTY NURSING HOME이 뒤를 따르며, LAURELS OF HILLIARD THE는 평균 7건을 보고 있습니다. 이러한 시설들은 효과적인 예방 조치 또는 해당 지역의 COVID-19 유행률이 낮아 낮은 케이스 수를 경험할 수 있습니다.
- 주목할만한 일일 평균 케이스를 가진 다른 시설로는 RIVERSIDE LIFELONG HEALTH AND REHABILITATION - M(4.38), WHITE OAK MANOR - CHARLOTTE(4.12), STOCKDALE RESIDENCE AND REHABILITATION CENTER(3.86), SAN MATEO MEDICAL CENTER D/P SNF(3.63), NORTHAMPTON COUNTY-GRACEDALE(3.37), ALLIED SERVICES SKILLED NURSING CENTER(3.29) 및 THE GRAND REHABILITATION AND NURSING AT UTICA(2.94)이 있습니다.

2. 각 건강 시설의 COVID-19 케이스에 대한 7일 이동 평균을 계산하십시오. 이동 평균에서 가장 높은 피크를 기록한 시설은 무엇입니까?

```js
--각 건강 시설의 COVID-19 케이스에 대한 7일 이동 평균 계산. 가장 높은 피크를 기록한 시설은 무엇입니까?
WITH cte AS (
  SELECT 
    Provider_Name,
    [Week_Ending],
    [Residents_Weekly_Confirmed_COVID_19],
    AVG([Residents_Weekly_Confirmed_COVID_19]) OVER (
      PARTITION BY [Provider_Name] 
      ORDER BY CONVERT(DATE, [Week_Ending]) 
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_average
  FROM (
    SELECT [Provider_Name], [Week_Ending], [Residents_Weekly_Confirmed_COVID_19] 
    FROM [dbo].[faclevel_2020]
    UNION ALL
    SELECT [Provider_Name], [Week_Ending], [Residents_Weekly_Confirmed_COVID_19]
    FROM [dbo].[faclevel_2021]
    UNION ALL
    SELECT [Provider_Name], [Week_Ending], [Residents_Weekly_Confirmed_COVID_19]
    FROM [dbo].[faclevel_2022]
    UNION ALL
    SELECT [Provider_Name], [Week_Ending], [Residents_Weekly_Confirmed_COVID_19]
    FROM [dbo].[faclevel_2023]
  ) AS combined_data
)
SELECT TOP 10 [Provider_Name], MAX(moving_average) AS highest_peak
FROM cte
GROUP BY [Provider_Name]
ORDER BY highest_peak DESC;
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_2.png" />

<div class="content-ad"></div>

분석 결과, 최고 일일 COVID-19 케이스를 기록한 의료 시설이 강조되었습니다. 이러한 시설들은 특정 기간 동안 COVID-19 감염 증가로 큰 위기를 겪었습니다. 최고 피크 케이스를 가진 상위 10개 시설은 다음과 같습니다:

- BRIGHTON REHABILITATION AND WELLNESS CENTER — 312 건
- CHAPEL MANOR — 252 건
- BERGEN NEW BRIDGE MEDICAL CENTER — 222 건
- FAIR ACRES GERIATRIC CENTER — 178 건
- ARDEN HOUSE — 173 건
- MARPLE GARDENS REHABILITATION AND NURSING CENTER — 172 건
- SPRING CREEK REHABILITATION AND NURSING CENTER — 168 건
- ST JAMES REHABILITATION & HEALTHCARE CENTER — 166 건
- COURTYARD NURSING CARE CENTER — 162 건
- NEW VISTA NURSING & REHABILITATION CTR — 162 건

이러한 결과는 COVID-19 전파를 완화하기 위해 의료 시설에서 견고한 감염 방지 조치 및 적시의 개입이 필요함을 강조합니다. 이러한 시설의 주민, 직원 및 방문객의 건강과 안녕을 보호하기 위해 효과적인 전략이 필수적입니다.

3. 각 주별 COVID-19 케이스, 사망자 및 회복자의 총 수를 결정하십시오. 결과에는 주 이름과 해당 수를 포함하십시오.

<div class="content-ad"></div>

```js
-- 각 주별 COVID-19 총 환자 수, 사망자 수 및 회복자 수를 결정하세요. 결과에는 주 이름과 해당 수를 포함합니다.
WITH cte AS (
  SELECT
    [Provider_State] AS State,
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS TotalCases,
    SUM([Residents_Weekly_All_Deaths]) AS TotalDeaths,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS TotalRecoveries
  FROM (
    SELECT [Provider_State], [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2020]
    UNION ALL
    SELECT [Provider_State], [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2021]
    UNION ALL
    SELECT [Provider_State], [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2022]
    UNION ALL
    SELECT [Provider_State], [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2023]
  ) AS combined_data
  GROUP BY [Provider_State]
)
SELECT State, TotalCases, TotalDeaths, TotalRecoveries
FROM cte;
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_3.png" />

분석은 주별 COVID-19 사례, 사망 및 회복 요약을 제공합니다. 다음 중요 지표가 제시됩니다:

- TotalCases: 각 주에서보고된 COVID-19 사례의 총 수.
- TotalDeaths: 각 주에서 COVID-19로 인한 사망한 사람들의 총 수.
- TotalRecoveries: 각 주에서 COVID-19 완치한 사람들의 총 수.

<div class="content-ad"></div>

다음은 주목할 만한 관찰 내용입니다:

- 총 확진자 수가 가장 높은 주는 캘리포니아(132,178)이며, 그 뒤를 텍사스(118,726)와 뉴욕(103,308)이 따릅니다.
- 총 사망자 수가 가장 높은 곳은 뉴욕(81,941)으로, 그 뒤를 오하이오(63,129)와 일리노이(49,104)가 차지합니다.
- 플로리다(40,989), 일리노이(33,064), 캘리포니아(79,929) 등 여러 주에서 상당 수의 회복 사례가 보고되었습니다.

이 통계 자료는 각 주에서의 COVID-19의 영향을 엿보게 해주며, 각 주별 사례, 사망자 수, 회복 방향의 다양성을 강조합니다. 바이러스 전파를 방지하고 각 주 개인의 안녕을 위해 효과적인 조치를 시행하는 것이 얼마나 중요한지를 강조합니다.

2022년에 사망률(COVID-19 사례당 사망자 수)이 가장 높은 상위 5개 주를 찾아보세요.

<div class="content-ad"></div>

```js
-- 2022년에 사망률이 가장 높은 상위 5개 주를 찾습니다.
WITH cte AS (
  SELECT
    [Provider_State] AS State,
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS TotalCases,
    SUM([Residents_Weekly_All_Deaths]) AS TotalDeaths,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS TotalRecoveries
  FROM [dbo].[faclevel_2022]
  GROUP BY [Provider_State]
)
SELECT TOP 5
  State,
  TotalDeaths,
  TotalCases,
  ROUND(TotalDeaths * 100.0 / TotalCases, 2) AS MortalityRate
FROM cte
ORDER BY MortalityRate DESC;
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_4.png" />

다음은 주목할 만한 관측 결과입니다:

- 북 다코타(ND)가 84.46%의 가장 높은 사망률을 보유하고 있으며, 남 다코타(SD)가 77.65%로 그 뒤를 이었으며, 네브래스카(NE)는 74.62%로 세 번째입니다.
- 미네소타(MN)와 위스콘신(WI)도 각각 72.82%와 71.45%로 비교적 높은 사망률을 갖고 있습니다.

<div class="content-ad"></div>

COVID-19이 특정 주에 미친 영향의 심각성을 강조하며, 더 높은 사망률은 총 사례 대비 사망 비율이 높음을 나타냅니다.

5. 2020년부터 2021년까지 COVID-19 사례에서 상당한 증가를 경험한 의료 시설을 식별하세요 (50% 이상 증가).

```js
--2020년부터 2021년까지 COVID-19 사례에서 상당한 증가를 경험한 의료 시설을 식별하세요 (50% 이상 증가).
--시설명 및 백분율 증가를 표시하세요.
WITH cte AS (
  SELECT
    [Provider_Name],
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS Cases_2020,
    (SELECT SUM([Residents_Weekly_Confirmed_COVID_19])
     FROM [dbo].[faclevel_2021]
     WHERE [Provider_Name] = f.[Provider_Name]) AS Cases_2021
  FROM [dbo].[faclevel_2020] AS f
  GROUP BY [Provider_Name]
)
SELECT TOP 10
  [Provider_Name],
  CASE WHEN Cases_2020 = 0 THEN NULL
       ELSE ((Cases_2021 - Cases_2020) * 100.0 / NULLIF(Cases_2020, 0))
  END AS PercentageIncrease
FROM cte
WHERE Cases_2021 > Cases_2020 * 1.5
ORDER BY PercentageIncrease DESC;
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_5.png" />

<div class="content-ad"></div>

가장 높은 증가율을 기록한 상위 10개 시설은 다음과 같습니다:

- Chautauqua Nursing and Rehabilitation Center — 증가율: 11,200%
- Delmar Center for Rehabilitation and Nursing — 증가율: 10,300%
- Carthage Center for Rehabilitation and Nursing — 증가율: 9,800%
- Cheshire Regional Rehab Center — 증가율: 9,500%
- Cityview Nursing and Rehabilitation Center — 증가율: 9,000%
- McCormick Rehabilitation and Healthcare Center — 증가율: 8,800%
- MediLodge of Okemos — 증가율: 8,700%
- MediLodge of Howell — 증가율: 8,600%
- Auburn Rehabilitation & Nursing Center — 증가율: 8,500%
- Park Bend Health Center — 증가율: 8,500%

이러한 시설들은 이전과 비교해 COVID-19 사례가 상당히 증가했음을 나타냅니다. 그들의 시설 내 감염율이 높아졌음을 시사합니다.

6. 데이터셋에 기록된 COVID-19 사례, 사망자 수, 회복자 수의 총합은 무엇입니까?

<div class="content-ad"></div>

```sql
-- 데이터셋에 기록된 총 COVID-19 환자 수, 사망자 수 및 회복자 수는 얼마인가요?
SELECT
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS 총확진자수,
    SUM([Residents_Weekly_All_Deaths]) AS 총사망자수,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS 총회복자수
FROM (
    SELECT [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2020]
    UNION ALL
    SELECT [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2021]
    UNION ALL
    SELECT [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2022]
    UNION ALL
    SELECT [Residents_Weekly_Confirmed_COVID_19], [Residents_Weekly_All_Deaths]
    FROM [dbo].[faclevel_2023]
) AS 결합된_데이터;
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_6.png" />

제공된 데이터를 기반으로:

- 총 COVID-19 환자 수: 1,632,695
- 총 COVID-19 사망자 수: 1,058,889
- 총 COVID-19 회복자 수: 573,806


<div class="content-ad"></div>

이 숫자들은 COVID-19 환자 수, 사망자 수 및 회복자 수를 누적한 것입니다. 새로운 사례가 보고되고 사람들이 바이러스로부터 회복됨에 따라 이 숫자들이 시간이 지남에 따라 변할 수 있다는 점을 주목하는 것이 중요합니다.

6. COVID-19 사례가 연이어 5개월 이상 증가한 의료 시설을 찾아보세요. 해당 시설 이름과 해당하는 월을 표시하세요.

```js
--COVID-19 사례가 연이어 5개월 이상 증가한 의료 시설을 찾아보세요. 해당 시설 이름과 해당하는 월을 표시하세요.
WITH cte AS (
  SELECT
    [Provider_Name],
    [Week_Ending],
    [Residents_Weekly_Confirmed_COVID_19],
    ROW_NUMBER() OVER (PARTITION BY [Provider_Name] ORDER BY [Week_Ending]) AS RowNum
  FROM [dbo].[faclevel_2020]
  UNION ALL
  SELECT
    [Provider_Name],
    [Week_Ending],
    [Residents_Weekly_Confirmed_COVID_19],
    ROW_NUMBER() OVER (PARTITION BY [Provider_Name] ORDER BY [Week_Ending]) AS RowNum
  FROM [dbo].[faclevel_2021]
  UNION ALL
  SELECT
    [Provider_Name],
    [Week_Ending],
    [Residents_Weekly_Confirmed_COVID_19],
    ROW_NUMBER() OVER (PARTITION BY [Provider_Name] ORDER BY [Week_Ending]) AS RowNum
  FROM [dbo].[faclevel_2022]
  UNION ALL
  SELECT
    [Provider_Name],
    [Week_Ending],
    [Residents_Weekly_Confirmed_COVID_19],
    ROW_NUMBER() OVER (PARTITION BY [Provider_Name] ORDER BY [Week_Ending]) AS RowNum
  FROM [dbo].[faclevel_2023]
)
SELECT
  [Provider_Name],
  MIN([Week_Ending]) AS StartMonth,
  MAX([Week_Ending]) AS EndMonth
FROM cte
WHERE [Residents_Weekly_Confirmed_COVID_19] > 0
GROUP BY [Provider_Name], [Residents_Weekly_Confirmed_COVID_19] - RowNum
HAVING COUNT(*) >= 5;
```

![이미지](/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_7.png)

<div class="content-ad"></div>

7. 각 의료 시설의 사망률(사망자 수 대비 COVID-19 사례)을 계산하세요.

```js
-- 각 의료 시설의 사망률(사망자 수 대비 COVID-19 사례)을 계산하세요.
WITH cte AS (
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2020]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2021]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2022]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2023]
  GROUP BY [Provider_Name]
)
SELECT
  [Provider_Name],
  ROUND(Deaths * 100.0 / Cases,0) AS MortalityRate
FROM cte
WHERE Cases > 0
ORDER BY MortalityRate DESC;
```

![2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_8.png](/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_8.png)

다음은 각 요양원 및 관련 사망률 목록입니다:

<div class="content-ad"></div>

- WESTPARK A WATERS COMMUNITY — 1675.00
- NASSAWADOX REHABILITATION AND NURSING — 1600.00
- THIBODAUX HEALTHCARE AND REHABILITATION CENTER — 1600.00
- MONTROSE HEALTHCARE CENTER — 1500.00
- THE OASIS AT BEAUMONT — 1500.00
- PARK MERRITT CARE CENTER — 1300.00
- MILTON HOME, THE — 1200.00
- PRUITTHEALTH — ASHBURN — 1200.00
- LEGACY TRANSITIONAL CARE & REHABILITATION — 1200.00
- THE LODGE AT TAYLOR — 1200.00
- ANDBE HOME, INC — 1150.00
- STERLING HEALTH CARE AND REHAB CENTER — 1100.00
- WILMINGTON REHAB CENTER — 1067.00
- OAK HILL REHABILITATION AND NURSING CARE CENTER — 1050.00
- LAKE PLEASANT POST ACUTE REHABILITATION CENTER — 1033.00
- CAMBRIDGE REHABILITATION & NURSING CENTER — 1000.00
- ABRAMSON SENIOR CARE AT LANKENAU MEDICAL CENTER — 1000.00
- BRIA OF GENEVA — 950.00
- DE LUNA HEALTH AND REHABILITATION CENTER — 900.00
- CAMELLIA GARDENS CENTER FOR NURSING AND REHAB — 900.00

이 요금은 각 요양원과 관련된 사망률을 나타냅니다.

8. 건강 시설 유형(예: 병원, 요양원)에 따라 COVID-19 결과에 중요한 차이가 있습니까?

```js
--각 건강 시설별 사망률(COVID-19 사망자 수당 사망자 수) 계산하기
WITH cte AS (
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2020]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2021]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2022]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    SUM(CAST([Residents_Weekly_Confirmed_COVID_19] AS int)) AS Cases,
    SUM(CAST([Residents_Weekly_COVID_19_Deaths] AS int)) AS Deaths
  FROM [dbo].[faclevel_2023]
  GROUP BY [Provider_Name]
)
SELECT TOP 20
  [Provider_Name],
  ROUND(Deaths * 100.0 / Cases,0) AS MortalityRate
FROM cte
WHERE Cases > 0
ORDER BY MortalityRate DESC;

--건강 시설 유형(예: 병원, 요양원)에 따라 COVID-19 결과에 중요한 차이가 있습니까?
WITH cte AS (
  SELECT
    [Provider_Name],
    CASE
      WHEN [Provider_Name] LIKE '%HOSPITAL%' THEN '병원'
      WHEN [Provider_Name] LIKE '%NURSING HOME%' THEN '요양원'
      WHEN [Provider_Name] LIKE '%HEALTH CENTER%' THEN '의료 센터'
      WHEN [Provider_Name] LIKE '%HEALTHCARE AND REHAB CENTER%' THEN '의료 및 재활 센터'
      WHEN [Provider_Name] LIKE '%CARE CENTER%' THEN '치료 센터'
      ELSE '기타'
    END AS 시설_유형,
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS 총_사례,
    SUM([Residents_Weekly_All_Deaths]) AS 총_사망자,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS 총_회복자
  FROM [dbo].[faclevel_2020]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    CASE
      WHEN [Provider_Name] LIKE '%HOSPITAL%' THEN '병원'
      WHEN [Provider_Name] LIKE '%NURSING HOME%' THEN '요양원'
      WHEN [Provider_Name] LIKE '%HEALTH CENTER%' THEN '의료 센터'
      WHEN [Provider_Name] LIKE '%HEALTHCARE AND REHAB CENTER%' THEN '의료 및 재활 센터'
      WHEN [Provider_Name] LIKE '%CARE CENTER%' THEN '치료 센터'
      ELSE '기타'
    END AS 시설_유형,
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS 총_사례,
    SUM([Residents_Weekly_All_Deaths]) AS 총_사망자,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS 총_회복자
  FROM [dbo].[faclevel_2021]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    CASE
      WHEN [Provider_Name] LIKE '%HOSPITAL%' THEN '병원'
      WHEN [Provider_Name] LIKE '%NURSING HOME%' THEN '요양원'
      WHEN [Provider_Name] LIKE '%HEALTH CENTER%' THEN '의료 센터'
      WHEN [Provider_Name] LIKE '%HEALTHCARE AND REHAB CENTER%' THEN '의료 및 재활 센터'
      WHEN [Provider_Name] LIKE '%CARE CENTER%' THEN '치료 센터'
      ELSE '기타'
    END AS 시설_유형,
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS 총_사례,
    SUM([Residents_Weekly_All_Deaths]) AS 총_사망자,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS 총_회복자
  FROM [dbo].[faclevel_2022]
  GROUP BY [Provider_Name]
  UNION ALL
  SELECT
    [Provider_Name],
    CASE
      WHEN [Provider_Name] LIKE '%HOSPITAL%' THEN '병원'
      WHEN [Provider_Name] LIKE '%NURSING HOME%' THEN '요양원'
      WHEN [Provider_Name] LIKE '%HEALTH CENTER%' THEN '의료 센터'
      WHEN [Provider_Name] LIKE '%HEALTHCARE AND REHAB CENTER%' THEN '의료 및 재활 센터'
      WHEN [Provider_Name] LIKE '%CARE CENTER%' THEN '치료 센터'
      ELSE '기타'
    END AS 시설_유형,
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS 총_사례,
    SUM([Residents_Weekly_All_Deaths]) AS 총_사망자,
    SUM([Residents_Weekly_Confirmed_COVID_19] - [Residents_Weekly_All_Deaths]) AS 총_회복자
  FROM [dbo].[faclevel_2023]
  GROUP BY [Provider_Name]
)

SELECT
  시설_유형,
  SUM(총_사례) AS 총_사례,
  SUM(총_사망자) AS 총_사망자,
  SUM(총_회복자) AS 총_회복자,
  CASE
    WHEN SUM(총_사례) > 0 THEN SUM(총_사망자) * 1.0 / SUM(총_사례)
    ELSE 0
  END AS 사망률
FROM cte
GROUP BY 시설_유형
ORDER BY 총_사례 DESC;
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_9.png" />

- 기타 시설: 총 사례 수: 1,290,082, 총 사망자 수: 843,209, 총 완치자 수: 446,873, 치명률: 65.36%
- 요양원: 총 사례 수: 261,974, 총 사망자 수: 155,319, 총 완치자 수: 106,655, 치명률: 59.29%
- 양로원: 총 사례 수: 41,367, 총 사망자 수: 31,065, 총 완치자 수: 10,302, 치명률: 75.10%
- 보건 센터: 총 사례 수: 22,650, 총 사망자 수: 17,256, 총 완치자 수: 5,394, 치명률: 76.19%
- 병원: 총 사례 수: 15,126, 총 사망자 수: 11,191, 총 완치자 수: 3,935, 치명률: 73.99%
- 의료 재활 센터: 총 사례 수: 1,496, 총 사망자 수: 849, 총 완치자 수: 647, 치명률: 56.75%

이러한 통계는 각 시설 유형별로 총 사례, 사망자, 완치자 및 치명률을 보여줍니다.

9. COVID-19 사례 수가 시간이 지남에 따라 어떻게 변화했습니까(월별 또는 분기별)?

<div class="content-ad"></div>

```sql
-- COVID-19 환자 수가 시간이 지남에 따라 어떻게 변화했습니까 (월별 또는 분기별)?
WITH cte AS (
  SELECT
    '2020' AS [Year],
    DATEPART(MONTH, [Week_Ending]) AS [Month],
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS TotalCases
  FROM [dbo].[faclevel_2020]
  GROUP BY DATEPART(MONTH, [Week_Ending])
  UNION ALL
  SELECT
    '2021' AS [Year],
    DATEPART(MONTH, [Week_Ending]) AS [Month],
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS TotalCases
  FROM [dbo].[faclevel_2021]
  GROUP BY DATEPART(MONTH, [Week_Ending])
  UNION ALL
  SELECT
    '2022' AS [Year],
    DATEPART(MONTH, [Week_Ending]) AS [Month],
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS TotalCases
  FROM [dbo].[faclevel_2022]
  GROUP BY DATEPART(MONTH, [Week_Ending])
  UNION ALL
  SELECT
    '2023' AS [Year],
    DATEPART(MONTH, [Week_Ending]) AS [Month],
    SUM([Residents_Weekly_Confirmed_COVID_19]) AS TotalCases
  FROM [dbo].[faclevel_2023]
  GROUP BY DATEPART(MONTH, [Week_Ending])
)

SELECT
  [Year],  [Month],
  TotalCases AS [Total_Cases]
FROM cte
ORDER BY [Year], [Month];
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_10.png" />

여기에 월별 및 연도별 총 환자 수에 대한 요약이 있습니다:

2020:  

<div class="content-ad"></div>

- 5월: 103,428
- 6월: 30,173
- 7월: 40,303
- 8월: 49,419
- 9월: 29,419
- 10월: 39,038
- 11월: 110,936
- 12월: 130,114

2021:

- 1월: 104,550
- 2월: 14,656
- 3월: 4,633
- 4월: 4,162
- 5월: 4,550
- 6월: 1,604
- 7월: 3,403
- 8월: 19,983
- 9월: 20,765
- 10월: 18,248
- 11월: 16,128
- 12월: 20,437

2022:

<div class="content-ad"></div>

- 1월: 194,558
- 2월: 58,284
- 3월: 9,592
- 4월: 8,612
- 5월: 36,194
- 6월: 35,521
- 7월: 66,508
- 8월: 52,004
- 9월: 37,699
- 10월: 51,372
- 11월: 49,122
- 12월: 74,699

2023:

- 1월: 81,054
- 2월: 45,031
- 3월: 35,215
- 4월: 27,795
- 5월: 3,486

이 수치들은 각 월과 연도별로 보고된 총 사례 수를 나타냅니다.

<div class="content-ad"></div>

10. 주별 의료 시설 분포는 어떻게 되나요?

```js
--주별 의료 시설 분포는 어떻게 되나요?
WITH cte AS (
  SELECT
    [Provider_Name] AS Provider_Name,
    [Provider_State] AS Provider_State
  FROM [dbo].[faclevel_2020]
  UNION ALL
  SELECT
    [Provider_Name] AS Provider_Name,
    [Provider_State] AS Provider_State
  FROM [dbo].[faclevel_2021]
  UNION ALL
  SELECT
    [Provider_Name] AS Provider_Name,
    [Provider_State] AS Provider_State
  FROM [dbo].[faclevel_2022]
  UNION ALL
  SELECT
    [Provider_Name] AS Provider_Name,
    [Provider_State] AS Provider_State
  FROM [dbo].[faclevel_2023]
)

SELECT
  [Provider_State],
  COUNT(DISTINCT [Provider_Name]) AS FacilityCount
FROM cte
GROUP BY [Provider_State]
ORDER BY FacilityCount DESC;
```

<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_11.png" />

# 대시보드

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-AnalysisofHealthcareFacilitiesandCOVID-19DataInsightsandRecommendations_12.png" />

# 추천사항

데이터 분석을 토대로 다음과 같은 추천사항이 제안되었습니다:

1. 예방 조치 강화: 마스크 착용, 적절한 손 위생 실천, 거리두기 등의 예방 조치를 계속 강화하고 시행해야 합니다. 대중에게 이러한 조치가 COVID-19 전파 감소에 어떠한 중요성을 가지는지 강조하는 공공 인식 캠페인이 실시되어야 합니다.


<div class="content-ad"></div>

2. 예방 접종 캠페인: COVID-19 백신을 홍보하고 모든 자격을 갖춘 사람들에게 백신을 제공할 수 있도록 노력을 강화하세요. 백신 망설임에 대처하고 접종률을 높이기 위해 대상 지역에 대한 열심히 홍보하고 교육을 실시하세요.

3. 대상 중재: 증가된 사례 수를 갖는 지역이나 인구통계에 대한 대상 중재를 식별하고 증가된 검사, 접촉 추적 및 집중적인 의료 자원에 우선하여 대상 중재를 진행하세요. 전염병의 확산을 억제하고 그들의 추가 확산을 방지하기 위해 지역적인 전략을 시행하세요.

4. 건강 시스템 대비: 의료 시설이 잠재적인 환자 수 증가에 대비할 충분한 수용량, 자원 및 인력을 갖추고 있는지 확인하세요. 의료 제공자와 협력하여 증가된 수용량 관리 및 보건 당국과의 협조를 포함한 대비 계획을 강화하세요.

5. 데이터 모니터링 및 분석: 계속해서 데이터를 모니터링하고 분석하여 신흥되는 추세, 핫스팟 및 문제 지역을 식별하세요. 이 정보를 활용하여 의사 결정, 자원 할당 및 효과적인 공중보건 조치의 실행에 활용하세요.

<div class="content-ad"></div>

# 결론

마무리하면, COVID-19 데이터 분석을 통해 공중 보건 대응과 의사 결정을 안내하는 가치 있는 통찰력과 권고사항을 제공했습니다.

우리의 결론은 사용 가능한 데이터와 분석된 지역의 구체적인 상황을 기반으로 하고 있음을 강조하고 싶습니다. 지역 보건 당국은 이러한 발견을 공중 보건 전략을 수립하고 시행할 때 자신들의 데이터와 지침과 함께 고려해야 합니다.

COVID-19 대유행 대응은 정부 기관, 의료기관 및 대중의 협력과 집단적 노력이 필요합니다. 권고사항을 따르고 데이터 분석을 기반으로 전략을 계속적으로 적응시킴으로써 예방 조치의 효과를 향상시키고 접종률을 증가시키며 바이러스의 영향을 감소시킬 수 있습니다.

<div class="content-ad"></div>

상황이 발전함에 따라 COVID-19 팬데믹으로 인한 도전에 대응하기 위해 계속해서 모니터링, 평가 및 전략적 적응이 필요할 것입니다. 함께 노력하여 바이러스 전파를 통제하고 공중 보건을 보호하며 정상 상태로 돌아가는 데 일조할 수 있습니다.

트위터와 링크드인에서 저와 소통해보세요.

여기서 저를 팔로우하지 않는 것을 잊지 마시고 더 많은 흥미로운 프로젝트를 확인하려면 내 미디엄 프로필을 읽어보세요.