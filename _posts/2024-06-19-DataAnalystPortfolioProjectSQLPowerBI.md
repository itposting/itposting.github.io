---
title: "데이터 분석가 포트폴리오 프로젝트SQL  Power BI"
description: ""
coverImage: "/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_0.png"
date: 2024-06-19 05:05
ogImage: 
  url: /assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_0.png
tag: Tech
originalTitle: "Data Analyst Portfolio Project(SQL + Power BI)"
link: "https://medium.com/@shana21619/new-york-city-airbnb-listings-0cd5520596a9"
---


## 뉴욕 시티 Airbnb 리스트

![이미지](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_0.png)

에어비앤비는 2008년부터 짧은 기간과 장기 체류 및 경험을 위한 온라인 마켓플레이스로 활동하는 미국 회사입니다. 에어비앤비는 주택 소유주와 부동산 관리자가 싱글 룸, 아파트부터 전체 집까지 다양한 숙박 옵션을 나열하도록하여 숙박 업계의 모습을 완전히 바꿨습니다.

나는 뉴욕 시티의 Airbnb 리스트 데이터를 탐색해보고 몇 가지 통찰을 발견해보려고 합니다.

<div class="content-ad"></div>

문제를 정의하는 것이 첫 번째 단계입니다. 다루어야 할 비즈니스 목표는 다음과 같습니다:

1. 다양한 호스트와 지역에 대해 어떤 것을 배울 수 있나요?

2. 객실 분포는 어떠한가요?

3. 어떤 호스트가 가장 바쁘고 그 이유는 무엇인가요?

<div class="content-ad"></div>

4. 다른 지역 간의 교통량에 뚜렷한 차이가 있나요? 이에 대한 이유가 무엇일 수 있습니까?

나 자신을 이해관계자로 생각할 때, 위의 비즈니스 목표를 기반으로 추세를 파악하고 싶습니다.

## 데이터 수집

통찰력을 얻기 위해, 데이터가 필요합니다! 나는 캐글(Kaggle)에서 데이터를 다운로드했습니다 (뉴욕 시티 에어비앤비 공개 데이터).

<div class="content-ad"></div>

이 데이터셋에는 id, name, host_id, host_name, neighbourhood_group, neighbourhood, latitude, longitude, room_type, price, minimum_nights, number_of_reviews, last_review, reviews_per_month, calculated_host_listings_count, availability_365 등 총 16개 열이 있고, 48,000행 이상의 데이터가 포함되어 있습니다.

이 공개 데이터셋은 에어비앤비의 일부이며, 원본 소스는 해당 웹사이트에서 확인할 수 있습니다.

## 데이터 가져오기

이 데이터셋은 CSV 형식으로 다운로드했습니다. MySQL 프로젝트에서 작업 중이므로 MySQL에 데이터를 가져와야 합니다. MySQL로 데이터를 가져오는 방법은 다양합니다.

<div class="content-ad"></div>

- 스키마를 생성한 후 해당 스키마 이름 아래의 테이블을 마우스 오른쪽 버튼으로 클릭하고 "테이블 가져오기 데이터 마법사" 옵션을 선택하세요. csv 파일 경로를 지정하고 다음을 클릭하세요. 새 테이블을 생성하거나 기존 테이블을 사용할 수 있습니다. 데이터가 MySQL로 쉽게 가져와집니다.
- 다음으로 LOAD DATA 문을 사용하는 방법이 있습니다. 데이터베이스에 연결한 후 테이블을 만들고 LOAD DATA 문을 실행하세요. CSV 파일 내용이 MySQL로 가져와집니다.

```js
LOAD DATA INFILE '파일/경로'
INTO TABLE 테이블_이름
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

일부 날짜 형식 오류로 인해 LOAD DATA 문이 다릅니다. 먼저 "airbnb"라는 스키마를 생성했습니다. 해당 데이터베이스 아래에 "airbnb_listings" 테이블을 만들었습니다.

![이미지](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_1.png)

<div class="content-ad"></div>

데이터베이스와 테이블을 생성한 후에는 CSV에서 MySQL로 데이터를 가져와야 합니다. 데이터 세트가 정리되지 않았기 때문에 LOAD DATA 문이 다소 까다로울 수 있습니다.

![이미지](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_2.png)

'@variable' — 데이터를 사용자 변수로 로드합니다.

NULLIF — 빈 문자열을 NULL로 변환합니다.

<div class="content-ad"></div>

'last_review'에 대한 CASE 문을 사용했습니다. 'last_review' 변수가 빈 문자열인 경우 NULL 값으로 설정됩니다. 다음 조건은 문자열이 'dd-mm-yyyy' 패턴과 정확히 일치하는지 확인합니다. 날짜가 dd-mm-yyyy 형식이면 STR_TO_DATE를 사용하여 변환합니다. 다음 조건은 문자열이 'yyyy-mm-dd' 패턴과 정확히 일치하는지 확인합니다. 날짜가 'yyyy-mm-dd' 형식이면 STR_TO_DATE를 사용하여 변환합니다. 위의 어떤 조건도 충족하지 않으면 NULL로 설정됩니다.

<img src="/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_3.png" />

데이터 가져오기가 성공적으로 완료되었습니다! 다음으로 데이터를 처리하고 정리하여 정확한 결과를 얻어야 합니다. 지저분하고 일관성이 없는 데이터를 사용하면 부정확한 통찰력을 얻게 됩니다.

## 데이터 정리

<div class="content-ad"></div>

데이터 클리닝은 데이터 분석에서 매우 중요합니다.

자세히 살펴봅시다!

중복 제거

MySQL 데이터베이스의 데이터 세트에서 중복 값을 제거하려면 먼저 특정 열의 유사한 값이 있는 행을 찾아 중복 행을 식별해야 합니다. 추가로 발생한 행을 삭제하여 각 중복 행의 발생을 하나로 줄입니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 테이블 태그를 수정한 내용입니다.


![이미지](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_4.png)

중복 행의 각 파티션별로 'id'를 선택하고 각 행에 번호를 할당하는 서브쿼리를 생성했습니다. 이 테이블에는 중복 된 행이 없습니다.

결측치/NULL 값 제거

- 호스트 이름이 NULL 인 행을 삭제했습니다. 나에게는 null 값이 있는 호스트 이름들은 중요하지 않다고 생각합니다.


<div class="content-ad"></div>


![테이블](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_5.png)

테이블에서 행을 제거하기 위해서는 삭제 문을 사용합니다. 이 쿼리에서는 모든 null 값을 가진 호스트 이름이 제거되었습니다. null 값을 가지는 행은 21개 있습니다.

2. 'last_review' 및 'reviews_per_month' 열에는 10k+ 개의 NULL 값을 가진 행이 있습니다. 데이터를 살펴본 결과, 이러한 값이 null인 이유는 호스트가 리뷰를 받지 않았기 때문입니다. 따라서 'number_of_reviews' 열이 0입니다.

![테이블](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_6.png)


<div class="content-ad"></div>

널 값 모두 제거하는 건 좋은 선택이 아닙니다. 나는 대신 보완과 플래깅을 결합할 것이에요.

'last_review'의 경우, 가장 최근의 리뷰 날짜 또는 '2000-01-01'과 같은 플레이스홀더 날짜로 널 값을 대체할 수 있어요. 'reviews_per_month'의 경우, 해당 열의 평균 또는 중앙값을 사용할 수 있어요. 나는 해당 열의 평균을 사용할 거에요.

플래깅은 원래 값이 널인 행을 플래그하는 새 열을 추가하는 과정이에요. 이는 나중에 분석에 유용할 수 있어요. 나는 'last_review_null'과 'reviews_per_month_null'이라는 새 열을 만들어 원래 값이 널인 행을 플래그할 거에요.

![이미지](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_7.png)

<div class="content-ad"></div>

여기 작동 방식을 보여드리겠습니다!

![이미지](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_8.png)

이제 데이터가 깨끗하고 일관적입니다. 분석을 시작해보겠습니다. 위에서 언급한 질문에 대한 답을 찾아보겠습니다.

## 데이터 분석

<div class="content-ad"></div>

이해관계자가 해결하고 싶어하는 첫 번째 질문은 "다른 호스트들과 지역에 대해 무엇을 배울 수 있을까요?"

![이미지1](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_9.png)

![이미지2](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_10.png)

가장 많은 숙박 시설을 보유한 호스트는 Michael로, 418개의 숙박 시설을 보유하며 평균 평점은 26.52입니다. Williamsburg의 브루클린 이웃 지역은 대략 3919개의 숙박 시설이 있으며 평균 가격은 $143.8입니다.

<div class="content-ad"></div>

두 번째 질문은 "객실의 분포는 무엇인가요?"입니다.

![image](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_11.png)

대다수의 관광객이 "전체집/아파트"를 선호합니다(대략 25400명). 그 다음으로는 약 22314명의 "개인실"을 선호합니다. 사람들은 "공용 공간"을 예약하는 경우가 적습니다. 이 정보는 임대용으로 제공되는 다양한 객실 유형의 분포를 이해하는 데 도움이 됩니다.

세 번째 질문은 "가장 바쁜 호스트는 누구이며 그 이유는 무엇인가요?"입니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_12.png)

가장 바쁜 호스트는 "Nalicia"로 월평균 리뷰 수가 약 18.12정도로 해당 지역에서 매우 인기가 있다는 것을 의미합니다. 그 다음으로 "Dona"가 월평균 13.9 리뷰를 받았습니다.

네 번째 질문은 "다른 지역 간 교통량에 뚜렷한 차이가 있는가 있으며 그 이유는 무엇일까요?"

![image](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_13.png)

<div class="content-ad"></div>

가장 많은 트래픽이 있는 동네는 "이스트 엘머스트"인데요, 월평균 후기 개수가 4.56개입니다. 이스트 엘머스트가 가장 많은 트래픽을 가지고 있는 이유는 여러 가지가 있을 수 있습니다. 가능한 이유로는 인기가 많거나 높은 수요가 있는 지역에 위치해 있어 더 많은 방문객과 잠재적인 손님들을 유치하는 것일 수도 있습니다. 그리고, 이스트 엘머스트가 이전 손님들로부터 긍정적인 후기와 추천을 받았기 때문에 동네에 머무르는 사람들이 더 많아져서 트래픽이 증가할 수 있습니다.

## 대시보드

![대시보드](/assets/img/2024-06-19-DataAnalystPortfolioProjectSQLPowerBI_14.png)

## 주요 인사이트

<div class="content-ad"></div>

서로 다른 호스트 및 지역에 대한 통찰:

나리시아는 월 평균 후기 18.1개로 선두를 달리고 있으며, 도나(14.0), 에이슬링(13.4), 말리니(13.2), 애나벨(13.0)이 그 뒤를 이었습니다. 이는 나리시아가 탁월한 서비스를 제공하거나 손님들이 호감을 갖는 독특한 숙소를 제공하고 있을 수 있다는 것을 시사합니다. 윌리엄스버그가 3.9천개로 가장 많은 숙소를 보유하고 있으며, 그 뒤를 베드포드-스테이븐턴트(3.7천), 할렘(2.7천), 부시윅(2.5천), 그리고 어퍼 웨스트 사이드(2.0천)가 이었습니다. 이러한 지역들의 인기는 위치, 문화적 의미, 또는 가격 등의 이유로 해석될 수 있습니다.

객실 분포에 대한 통찰:

집/아파트 전체가 숙소의 51.97%를 차지하고, 개인실이 45.66%, 공용실은 2.37%에 그칩니다. 이 분포는 사생활과 공간에 대한 선호도를 나타내며, 집 전체와 개인실이 대다수를 차지하고 있음을 시사합니다.

<div class="content-ad"></div>

가장 바쁜 호스트와 이유에 대한 통찰:

평균 월별 리뷰를 기준으로, Nalicia가 가장 바쁜 호스트입니다. 높은 리뷰 수는 일반적으로 많은 게스트의 이용과 만족을 나타내며, Nalicia는 많은 게스트를 끌어들이는 것뿐만 아니라 만족시키고 있다는 것을 시사합니다.

다른 지역 간 트래픽 차이와 가능한 이유에 대한 통찰:

East Elmhurst가 4.6으로 선두를 달리고 있으며, 이어서 Silver Lake와 Springfield Gardens(모두 4.3) 그리고 Rosebank와 Huguenot(모두 3.8)가 뒤를 따르고 있습니다. 이러한 지역의 높은 트래픽은 관광명소나 공항과의 근접성, 전반적인 가격 대비 편의성 등 여러 요인으로 인한 것일 수 있습니다.

<div class="content-ad"></div>

## 추천사항

- 고성능 호스트 및 지역에 집중: 고밀도 이웃 지역에 위치한 호스트들을 장려하여 그들의 위치 장점을 강화할 수 있도록 품질을 유지하거나 향상시키기를 권장합니다. 
Nalicia와 같은 최고 호스트의 인사이트를 공유하여 다른 사람들이 서비스를 개선할 수 있도록 돕습니다.
- 마케팅 및 전략 개선: Williamsburg와 Bedford-Stuyvesant와 같은 고리스팅 지역에서의 마케팅 노력을 강화하여 더 많은 손님을 유치합니다.
- 호스트 지원: 교통량이 적은 지역에 위치한 호스트들을 위해 집중 지원과 교육을 제공하여 경쟁력을 향상하도록 합니다. Top 호스트들의 데이터 및 성공 요인을 다른 이들과 공유하여 서비스를 향상시키도록 돕습니다.
- 상품 다양화: 시장 조사에 따르면 필요성이 있을 경우, 이집트룸과 같이 보조되는 공유 공간의 종류에 대한 다양성을 촉진합니다.

보이라~~!

이것이 에어비앤비 리스트 데이터 프로젝트에 관한 모든 것입니다. 이제 이해당사자는 제시된 인사이트와 권장 사항에 대해 실천할 수 있습니다.

<div class="content-ad"></div>

제 세션을 읽어주셔서 감사합니다! 피드백이나 제안이 있다면 자유롭게 남겨주십시오. 데이터 여정을 즐기시길 바랍니다!

전문분야는 Excel, SQL, Tableau, Power BI, 그리고 R을 활용한 입문 레벨 프리랜서 데이터 분석가입니다. 흥미로운 대시보드와 프레젠테이션을 제작합니다. shana.nasrin2601@gmail.com으로 고용해주세요.