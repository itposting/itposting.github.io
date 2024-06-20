---
title: "데이터 분석 프로젝트  스마트폰 데이터 분석"
description: ""
coverImage: "/assets/img/2024-06-19-ADataAnalysisProjectSmartPhonesDataAnalysis_0.png"
date: 2024-06-19 16:37
ogImage: 
  url: /assets/img/2024-06-19-ADataAnalysisProjectSmartPhonesDataAnalysis_0.png
tag: Tech
originalTitle: "A Data Analysis Project — Smart Phones Data Analysis."
link: "https://medium.com/towards-artificial-intelligence/a-data-analysis-project-smart-phones-data-analysis-381ed9be26ff"
---


## SQL 및 SSMS를 사용하여 스마트폰 데이터의 통찰력 추출

![image](/assets/img/2024-06-19-ADataAnalysisProjectSmartPhonesDataAnalysis_0.png)

저는 Kaggle(데이터 세트) 웹사이트에서 수집한 스마트폰 데이터를 이용한 데이터 분석 프로젝트를 진행했습니다. 이 데이터는 최신 업데이트된 데이터로, 산업에 대한 훌륭한 통찰력을 추출하고 이해하기 위해 사용하는 것이 좋습니다.

주어진 데이터 세트에는 다양한 스마트폰 세부 정보에 관한 정보가 포함되어 있습니다. 아래에서 언급된 것과 같이 다양한 정보를 전달하는 열이 있습니다.

<div class="content-ad"></div>

i. 스마트폰 브랜드 이름 및 모델.
ii. 스마트폰 가격, 평가, 5g, 그리고 ir 블라스트의 세부 정보.
iii. 스마트폰의 프로세서 브랜드, 각각의 코어 수, 그리고 처리 속도.
iv. 배터리 용량, RAM 용량, 빠른 충전 지원 여부, 그리고 내부 메모리 세부 정보.
v. 스마트폰 화면 크기, 주사율, 후면 카메라 수, 운영 체제, 그리고 해상도 세부 정보가 제공됩니다.

이것은 주어진 데이터 세트가 전달하는 기본 정보입니다. 이제 우리는 이 데이터에서 다양한 통찰과 분석을 추출할 예정입니다. 추출할 수 있는 다양한 통찰이 많이 있습니다. 아래에 언급된 몇 가지 통찰은 비즈니스가 판매 및 제품 업그레이드를 위해 필요한 작업을 할 수 있도록 도와줍니다.

다음 질문에 대한 조사/추출할 데이터.

여기 내 YouTube 채널이 있습니다. 더 많은 정보를 받고 최신 업데이트를 즉시 확인하려면 구독해 주세요.

<div class="content-ad"></div>

```js
-----1. 상점에서 브랜드 및 모델 수 그리고 브랜드 당 모델 수를 찾아보세요.
정렬 기능을 사용하여 롤링 합계로 모델 수를 확인하세요.

select count(distinct brand_name) as Number_of_brands from SmartPhones_data;
select count(distinct model) as number_of_models from SmartPhones_data;

with cte as(
select brand_name, count(distinct model) as number_of_models from SmartPhones_data 
group by brand_name)
select c.*, sum(c.number_of_models) over(order by number_of_models desc, brand_name asc) as total_number_of_models from cte c

----2. 각 브랜드의 휴대폰 및 모델의 총 가격, 또한 브랜드 및 모델과 함께 각 브랜드의 휴대폰 가격을 찾아보세요.
sql
select brand_name, sum(price) as total_cost from SmartPhones_data group by brand_name order by 1 asc;
select model, sum(price) as total_cost from SmartPhones_data group by model order by 2 desc;
select brand_name, model, sum(price) as total_cost from SmartPhones_data group by brand_name, model order by 1;

with cte as(
select brand_name, model, sum(price) as total_cost from SmartPhones_data group by brand_name, model),
cte2 as(select c.*, sum(total_cost) over(partition by brand_name order by total_cost) as total_cost_by_brand from cte c)
,cte3 as(select c1.*, dense_rank() over(partition by brand_name order by total_cost_by_brand desc) as rnk from cte2 c1)
select brand_name, total_cost_by_brand from cte3 where rnk=1

저는 window 함수를 사용하여 각 브랜드의 총 비용을 롤링 합산하여 결과를 확인했습니다. (역공학)

----3. 최고 평점을 받은 상위 3개 브랜드와 모델을 찾아보세요.
sql
select brand_name, model from(
select distinct brand_name, model, rating, dense_rank() over(order by rating desc) as rnk from SmartPhones_data)a 
where a.rnk<=3 order by rnk

<div class="content-ad"></div>

이 데이터를 사용하여 안전하지만 5G는 아닌 더 빠른 모델을 선택할 수 있습니다. 이는 5G 모델이 아닙니다. 

---4. 5g를 갖고 있지 않거나 ir 블라스터를 갖고 있는 모바일 기기.
select 모델 from SmartPhones_data where has_5g = 0 and has_ir_blaster = 1

select count(distinct processor_brand) number_of_processor_brands from smartphones_data

select processor_brand, count(모델) from SmartPhones_data where processor_brand is not null 
group by processor_brand
order by 2 desc 

---6. 모델당 코어 수. 코어 수에 따라 순위를 매깁니다.
select distinct 모델, num_cores as number_of_cores from SmartPhones_data

select * from (
select distinct 모델, num_cores as number_of_cores, dense_rank() over(order by num_cores desc) as rank from 
SmartPhones_data)a order by 3

<div class="content-ad"></div>

----7. 브랜드와 모델별로 가장 높은 프로세서 속도.
select brand_name, model, processor_speed from(
select brand_name, model, processor_speed, dense_rank() over(order by processor_speed desc) as rnk
from SmartPhones_data)a where a.rnk=1

<img src="/assets/img/2024-06-19-ADataAnalysisProjectSmartPhonesDataAnalysis_1.png" />

----8. 가장 높은 배터리 용량을 가진 상위 5개 모델 및 그들의 브랜드.
select brand_name, model, battery_capacity from (
select brand_name, model, battery_capacity, dense_rank() over(order by battery_capacity desc) as rnk 
from SmartPhones_data )a where a.rnk<=5

----9. 가장 높은 RAM 용량과 내부 메모리를 가진 상위 5개 브랜드 및 모델 나열.
select brand_name, model, ram_capacity, internal_memory from(
select brand_name, model, ram_capacity, internal_memory, dense_rank() over(order by ram_capacity desc, internal_memory desc) as
rnk from smartphones_data)a where rnk <=5

<div class="content-ad"></div>

---10. 화면 크기가 작은 상위 10개 모델 및 브랜드를 나열합니다.
select brand_name, model, screen_size from(
select brand_name, model, screen_size, dense_rank() over(order by screen_size) as rnk from SmartPhones_data)a
where a.rnk<=10

이와 유사하게, 나머지로부터도 통찰을 얻을 수 있습니다. 이전 질문을 참조하여 이러한 작업을 수행할 수 있었으면 좋겠습니다. 그렇지 않으면 아래 질문에 대한 통찰을 얻는 데 대해 궁금한 점이 있으면 댓글을 통해 질문할 수 있습니다.

데이터 분석 프로젝트에 대해 더 많이 보고 싶으신가요?
아래에 언급된 데이터 분석 프로젝트를 확인하실 수 있습니다.

# 데이터 분석 프로젝트 시리즈:


<div class="content-ad"></div>

i. 데이터 분석 프로젝트 - 커피숍 매출 분석.

ii. 데이터 분석 프로젝트 - 아디다스 매출 보고서.

iii. 데이터 분석 프로젝트 - 전기 차량 보급 데이터.

iv. 데이터 분석 프로젝트 - 데이터 과학 채용 공고.

<div class="content-ad"></div>

이 기사가 SQL을 사용한 데이터 분석을 진행하고 기본 개념을 적용하는 데 도움이 되기를 바랍니다.

[여기를 클릭](https://github.com/)하여 데이터 분석에 중점을 둔 내 독서 목록에서 몇 가지 데이터 분석가 면접 질문과 사용 사례를 준비하세요. 내 GitHub에서 데이터와 SQL 파일을 볼 수 있습니다.

향후 프로젝트에 연계되기 위해 모든 프로젝트에 접근하려면 꼭 나의 GitHub를 팔로우하세요.

포트폴리오를 구축하고 다양한 클라이언트의 신뢰를 얻기 위해 최소 요율로 프리랜서로서 나의 서비스를 제공하고 있습니다.

<div class="content-ad"></div>

개인(1:1) 트레이닝 전 세계 어디서나 가능하며 Zoom을 통해 연결할 거에요.

mahendraee204@gmail.com 으로 연락주세요.

저를 팔로우하면 중요한 소식을 놓치지 않을 수 있어요.

감사합니다 :)