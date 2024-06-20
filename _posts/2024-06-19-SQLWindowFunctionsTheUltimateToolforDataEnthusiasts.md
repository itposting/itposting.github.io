---
title: "SQL 윈도우 함수 데이터 열정가들을 위한 최고의 도구"
description: ""
coverImage: "/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_0.png"
date: 2024-06-19 01:43
ogImage: 
  url: /assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_0.png
tag: Tech
originalTitle: "SQL Window Functions: The Ultimate Tool for Data Enthusiasts"
link: "https://medium.com/code-like-a-girl/sql-window-functions-the-ultimate-tool-for-data-enthusiasts-7a3ff6aac057"
---



![SQL Window Functions](/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_0.png)

요즘에는 엄청난 양의 데이터를 다루고 있습니다. 이 주요한 도전에 따라 다양한 소스의 복잡도도 함께 증가하고 있습니다. 이러한 환경에서 SQL은 여전히 영웅이며, 이 데이터 바다에서 가치 있는 통찰을 추출하고 탐색하는 데 꼭 필요한 도구입니다.

SQL이 제공하는 많은 강력한 기능 중에서도 윈도우 함수는 특히 주목할 만한 요소입니다. 이러한 함수들은 테이블 행 집합을 대상으로 높명한 계산을 가능하게 하며, 고급 데이터 분석에 필수적이며 데이터와 상호작용하는 방법을 변화시키는 데 중요합니다.

이 기사에서는 SQL의 윈도우 함수 개념을 해부하고 이해할 것입니다. 언제 윈도우 함수를 사용해야 하는지, 그리고 SQL 쿼리에서 효과적으로 구현하는 방법에 대해 살펴볼 것입니다. 이 가이드를 마치면 윈도우 함수의 강력함과 유연성에 대한 깊은 이해를 얻게 될 것이며, 데이터 분석 기술을 향상시키기 위한 실제 예제를 활용할 수 있을 것입니다.


<div class="content-ad"></div>

# 윈도우 함수가 뭔가요?

경험 수준에 상관 없이 모든 데이터 애호가는 윈도우 함수에 대해 들어봤거나 사용해 본 적이 있을 것입니다. 이 강력한 도구들은 모든 SQL 강좌에서 퍼져 있으며 데이터 작업을 하는 사람들의 일상생활에서 필수불가결합니다.

구글에서 빠르게 검색을 해보죠…몇 분 후에 혹은 TV 광고를 보고 나서, 우리는 윈도우 함수가 다음과 같다는 사실을 알게 됩니다:

<div class="content-ad"></div>

# 문법에 관해서 뭔가 언급했다고 했나요?

그렇습니다. 이 매우 강력한 도구에는 특정 구문과 같은 트릭이 함께 제공됩니다.

![image](/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_1.png)

위 이미지에서 볼 수 있듯이, 윈도우 함수의 구문은 네 부분으로 나뉠 수 있습니다:

<div class="content-ad"></div>

- 집계/함수: 여기서 집계 (예: AVG, SUM) 또는 LAG(), LEAD(), ROW_NUMBER(), RANK(), DENSE_RANK()과 같은 특정 창 함수를 배치하여 작업을 시작합니다. 몇 가지 더 있지만, 이 중에서는 가장 일반적으로 사용되는 것들이에요 (적어도 저는 이것들을 가장 많이 사용해요 😁)
- OVER: 이 키워드는 윈도우 함수를 사용할 것임을 IDE에 "알리는" 데에 사용됩니다. 이는 "여기서 무언가를 할 것이고, 무언가 복잡한 것에 대비해야 한다"고 말하는 것과 같아요.
- PARTITION BY: 이 절은 결과를 파티션 또는 창으로 나눕니다. 우리는 이 과정에서 초기에 설정한 집계나 함수를 적용할 것입니다. 이 부분을 작성한 후에는 파티션을 기준으로 필드를 개발해야 합니다. 순위 함수와 함께 사용되지 않아요.
- ORDER BY: 경우에 따라 선택 사항일 수 있지만, 이것이 하는 일을 알아두는 것이 좋아요. 이는 각 파티션 내의 행을 정렬하는 데 사용되며, RANK(), DENSE_RANK(), ROW_NUMBER()와 같은 순위 함수를 사용할 때 유용합니다.

# 목표를 달성하기 위한 다양한 창 함수

이전 섹션에서 창 함수 구문에 대해 이야기했어요. 창 함수 구문과 독립적으로 작동하지 않는 몇 가지 함수를 언급했죠.

일부는 각 파티션의 각 행에 대한 순위 값을 반환하기 때문에 순위 함수라고 불리며, 다른 것은 시계열 창 함수입니다.

<div class="content-ad"></div>

순위 함수:

- RANK() : 결과 집합의 파티션 내 각 행에 순위를 할당하며, 동일한 값을 가진 행은 동일한 순위를 받습니다.
- DENSE_RANK() : RANK()와 유사하지만 연속적인 순위 값을 가집니다. 동일한 값은 동일한 순위를 받으며, 다음 순위 값은 다음 연속 정수입니다.
- NTILE() : 결과 집합을 동일한 그룹으로 분할하고 각 행에 속하는 그룹을 나타내는 숫자를 할당합니다.
- ROW_NUMBER() : 결과 집합의 파티션 내 각 행에 고유한 연속 정수를 할당하며, 각 파티션의 첫 번째 행부터 1로 시작합니다.

시계열 함수:

- LAG() : 결과 집합 내 이전 행의 값을 가져오는 함수로, 자체 조인이 필요하지 않습니다. 연속된 행 간의 차이를 계산하는 데 도움이 됩니다.
- LEAD() : 다음 행의 값을 예측하는 데 유용한, 자체 조인 없이 다음 행의 값을 액세스할 수 있습니다. 추세나 값의 변화를 예측하는 데 도움이 됩니다.

<div class="content-ad"></div>

# 영원한 질문: 왜...

많은 것들에 대해 우리가 하는 일반적인 질문들이 있습니다. SQL의 창 함수도 예왽이 아닙니다. 창 함수가 여러분에게 시간과 노력을 절약해줄 수 있는 상황을 이해하려면 다음을 살펴보겠습니다:

왜 그리고 언제 우리는 창 함수를 사용해야 할까요?

언제부터 시작해볼까요. 언제 우리는 창 함수를 사용할까요? 잘, 우리가 창 함수를 사용해야 하는 시점은 언제든지 우리가 필요로 할 때 입니다:

<div class="content-ad"></div>

- 특정 조건에 따라 데이터 하위 집합에서 누적 합계, 순위, 평균 또는 다른 계산을 계산합니다.
- 현재 및 이전/다음 행 값 비교

왜 윈도우 함수를 사용해야 하는지 왜도 빼놓지 마세요. 상황에 필요할 때 윈도우 함수를 사용해야 하는 이유는 무엇인가요?
 
윈도우 함수를 사용해야 하는 이유:

- 행 레벨 세부 정보 유지 — 데이터를 축소하지 않고 계산을 수행할 수 있는데, 이는 원본 데이터를 유지한 채 여러 행을 대상으로 계산할 수 있도록 합니다.
- 복잡한 쿼리 간소화 — 이 도구를 사용하면 가장 복잡한 쿼리를 간소화하여 읽기 좋고 작성하기 쉽고, 무엇보다도 유지보수하기 쉽게 만들어줍니다.
- 성능 향상 — SQL 엔진에서 최적화되어 대량 데이터셋의 경우 더 나은 성능을 제공하는 경우가 많습니다.
- 고급 분석 활성화 — 누적 합계, 이동 평균 및 기타 고급 분석 작업을 실행할 수 있도록 합니다.
- 자세한 분석을 위한 데이터 파티션 — 특정 기준에 따라 데이터를 분할하여 전체 데이터 집계 없이 그룹 내에서 자세한 분석을 가능하게 합니다.
- 시계열 및 변경 감지 지원 — 이전 또는 다음 행 값에 액세스하는 내장 지원을 제공하여 시계열 데이터 및 변경 감지에 유용합니다.

<div class="content-ad"></div>

# 실제 사용 사례

은행 분야에서 데이터 엔지니어로 일하고 있는데, 계약의 "단계"가 변경된 레코드를 식별하고 이 변경 날짜를 기록해야 하는 요청을 받았어요.

쉽게 말해, 그렇게 하는 게 쉽지 않을 것 같죠? 그렇게는 안 돼요. 윈도우 함수를 사용해서 요청을 완료하고 결과를 빠르게 전달하는 데 도움이 되었어요.

우리가 두 개의 테이블이 있다고 가정해 봅시다.

<div class="content-ad"></div>


source.data_records

![Image 2](/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_2.png)

and temp.data_records:

![Image 3](/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_3.png)


<div class="content-ad"></div>

그리고 다음 안에 테이블을 생성해야 합니다. 그 안에는 다음과 같은 정보가 포함되어 있어야 합니다:

- 식별자
- 식별자의 현재 레벨
- 현재 단계의 참조 날짜
- 식별자의 이전 레벨
- 이전 참조 날짜
- 식별자가 레벨을 변경한 날짜

테이블은 아래 코드를 기반으로 생성되었습니다:

```js
create table tmp_change_level_date as
(
select distinct * from ( 
    select 
        fct.identifier, fct.level, fct.date_ref,
        lag(fct.level) over (partition by fct.identifier order by fct.date_ref) as previous_level,
        lag(fct.date_ref) over (partition by fct.identifier order by fct.date_ref) as previous_date,
        case
            when lag(fct.level) over (partition by fct.identifier order by fct.date_ref) is not null then fct.date_ref
            else NULL
        end as change_level_date,
        dense_rank() over (partition by fct.identifier order by fct.date_ref desc) as ranks
    from source.data_records fct  join temp.data_records TFCT 
    on fct.identifier = TFCT.identifier
    where TFCT.amount <> 0 and TFCT.account in (select account_code from accounts_list)
    ) x
where ranks = 1 
and level <> previous_level
and previous_date <> change_level_date
)
commit;
```

<div class="content-ad"></div>

자, 이제 설명으로 들어가볼게요:

- 우선적으로, loan identifier(대출 식별자), level, date_ref(대출의 실제 단계 및 현재 단계의 기준 날짜)와 같은 정보를 가져오는 주요 SELECT 문을 만들었습니다:

```js
select 
        fct.identifier, fct.level, fct.date_ref,
        lag(fct.level) over (partition by fct.identifier order by fct.date_ref) as previous_level,
        lag(fct.date_ref) over (partition by fct.identifier order by fct.date_ref) as previous_date,
        case
            when lag(fct.level) over (partition by fct.identifier order by fct.date_ref) is not null then fct.date_ref
            else NULL
        end as change_level_date,
        dense_rank() over (partition by fct.identifier order by fct.date_ref desc) as ranks
    from source.data_records fct  join temp.data_records TFCT 
    on fct.identifier = TFCT.identifier
    where TFCT.amount <> 0 and TFCT.account in (select account_code from accounts_list)
    ) x
```

그 다음으로, 각 대출에 대해 이전 대출 단계와 이전 참조 날짜를 가져오기 위해 LAG() 함수를 사용했습니다. PARTITION BY를 사용하여 식별자에 따라 데이터셋을 작은 파티션으로 나누고, 각 파티션 내에서 레코드를 date_ref에 따라 정렬했습니다.

<div class="content-ad"></div>


lag(fct.level) over (partition by fct.identifier order by fct.date_ref) as previous_level,
lag(fct.date_ref) over (partition by fct.identifier order by fct.date_ref) as previous_date


and assign a rank to each record within the partition by using DENSE_RANK() function:


dense_rank() over (partition by fct.identifier order by fct.date_ref desc) as ranks


This code will return the following result:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_4.png" />

더 나아가서, 이전 결과에서 일부 필터를 적용할 수 있도록 다음 SELECT문을 작성합니다 (위의 표에 해당하는):

```js
select distinct * from (

---- 이전 select를 하위 쿼리로 사용 ----

) x
where ranks = 1 
and level <> previous_level
and previous_date <> change_level_date
```

그리고 각 식별자에 대해 가장 최근 레코드만 가져와서 (ranks = 1은 설명에서 앞에서 언급한 가장 최근 레코드에 해당함), 현재 레벨이 이전 레벨과 다른 레코드만 가져오도록 필터를 적용하며 (level != previous_level), 변경 날짜가 유효하고 이전 참조 날짜와 다른지 확인합니다. 이러한 필터를 기반으로 결과를 새로운 테이블 tmp_change_level_date에 삽입합니다 (CREATE TABLE table_name AS와 유명한 구문을 사용하여 만든 것):

<div class="content-ad"></div>


![SQL Window Functions](/assets/img/2024-06-19-SQLWindowFunctionsTheUltimateToolforDataEnthusiasts_5.png)

이 결과를 통해 다음을 알 수 있습니다:

- 식별자 2의 경우: 레벨이 2023년 03월 15일에 A에서 C로 변경되었습니다.
- 식별자 3의 경우: 레벨이 2023년 02월 20일에 B에서 A로 변경되었습니다.

# 결론


<div class="content-ad"></div>

SQL 윈도우 함수는 복잡한 데이터 분석을 간편하게 하고 성능을 향상시킵니다. 이 글에서는 기본 사항, 구문, 랭킹 및 시계열 분석과 같은 일반적인 사용 사례, 실제 예제에 대해 다룹니다. 이러한 함수를 숙달하면 SQL 쿼리를 더 효율적이고 통찰력 있게 만들 수 있습니다.

실습하고 실험하여 그 능력을 최대로 발휘하고 데이터 분석 능력을 향상시키세요.