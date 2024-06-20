---
title: "윈도우 함수의 해부학"
description: ""
coverImage: "/assets/img/2024-06-19-AnatomyofWindowsFunctions_0.png"
date: 2024-06-19 16:08
ogImage: 
  url: /assets/img/2024-06-19-AnatomyofWindowsFunctions_0.png
tag: Tech
originalTitle: "Anatomy of Windows Functions"
link: "https://medium.com/towards-data-science/anatomy-of-windows-functions-08f04938b12b"
---


## 소극적으로 여겨지는 SQL 작업의 이론과 실무

![이미지](/assets/img/2024-06-19-AnatomyofWindowsFunctions_0.png)

# 소개

IT 분야는 매일 새로운 도구, 새로운 프레임워크, 새로운 클라우드 제공업체, 그리고 새로운 LLM이 생성되는 등 끊임없는 변화로 유명합니다. 그러나 이 바쁜 세계에서도 몇 가지 원칙, 패러다임, 그리고 도구는 '모든 것이 영원하지 않다'는 상태 쿼를 도전하는 것처럼 보입니다. 특히 데이터 분야에서는 SQL 언어만큼 강제적인 예가 없습니다.

<div class="content-ad"></div>

80년대에 탄생한 이후 데이터 웨어하우스 시대를 지나 Hadoop/Data-lake/Big Data로 활용되어 Hive로 거듭난 뒤 지금은 Spark API 중 하나로 살아 숨 쉬고 있어요. 세상은 많이 변했지만 SQL은 여전히 중요하고 존재감이 크죠.

하지만 SQL은 마치 체스와 같아요. 기본 규칙을 이해하기 쉽지만 스스로를 완전히 다루기는 어려운 것 같아요! SQL은 많은 가능성을 지니고 있으며 같은 문제를 해결하는 다양한 방법, 다양한 함수와 키워드를 가지고 있습니다. 불행히도, 더 많이 알려지지 않은 기능들이 많아요. 이를 알면 쿼리를 작성할 때 많은 도움이 될 수 있습니다.

그래서 이번 포스트에서는, 일상적인 쿼리를 작성할 때 굉장히 유용하게 느껴졌던, 그리 잘 알려지지 않은 SQL의 기능 중 하나에 대해 이야기해보려고 해요: 윈도우 함수.

# 윈도우 함수란 무엇인가

<div class="content-ad"></div>

전통적이고 가장 유명한 SGBD(PostgreSQL, MySQL 및 Oracle)는 관계 대수 개념에 기반을 두고 있습니다. 여기에는 행이 튜플로 불리며 테이블은 관계로 불립니다. 관계란 튜플들의 집합으로, 즉 튜플 간의 순서 또는 연결이 없습니다. 그래서 테이블 내의 행에 대한 기본적인 순서가 없으며, 한 행에 수행된 계산은 다른 결과에 영향을 주지 않으며 다른 결과에도 영향을 받지 않습니다. ORDER BY와 같은 절조차도 테이블만을 정렬할 뿐, 다른 행의 값을 기반으로 한 행에서의 계산을 수행하는 것은 불가능합니다.

간단히 말하면, 윈도우 함수가 이를 해결해주며 SQL 기능을 확장하여 다른 행의 값을 기반으로 한 행에서 계산을 수행할 수 있습니다.

# 이해를 돕는 기본 사례/해부학

1- 집계 함수 사용하지 않고 집계하기

<div class="content-ad"></div>

Windows 함수를 이해하는 가장 단순한 예는 '집계하지 않고 집계하는' 능력입니다.

전통적인 GROUP BY를 사용하여 집계를 수행하면 전체 테이블이 두 번째 테이블로 압축되어 각 행이 그룹의 요소를 나타내게 됩니다. 그러나 Windows 함수를 사용하면 행을 압축하는 대신 동일한 테이블에 집계 결과가 포함된 새 열을 생성할 수 있습니다.

예를 들어, 비용 테이블에서 모든 지출을 더해야 한다면, 전통적으로는 다음과 같이 수행할 것입니다:

```js
SELECT SUM(value) AS total FROM myTable
```

<div class="content-ad"></div>

Windows 함수를 사용하면 아래와 같이 만들 수 있어요:

```js
SELECT *, SUM(value) OVER() FROM myTable
-- 창 함수(window function)가 쿼리에서 열 레벨에 정의됨에 주목하세요
```

아래 이미지는 결과를 보여줍니다:

![윈도우 함수의 구조](/assets/img/2024-06-19-AnatomyofWindowsFunctions_1.png)

<div class="content-ad"></div>

새로운 테이블을 생성하는 대신, 집계 값은 새로운 열에 반환됩니다. 값은 같지만 테이블이 '요약'되지 않았습니다. 원본 레코드가 유지되었고 계산된 집계를 집계하지는 않았다는 것을 주목하세요 ;)

OVER 절은 윈도우 함수를 생성함을 나타냅니다. 이 절은 계산이 이루어질 레코드를 정의합니다. 위의 코드가 비어있으므로 모든 레코드에 대해 SUM()을 계산합니다.

이는 열의 합계(또는 평균, 최솟값, 최댓값)을 기반으로 계산이 필요할 때 유용합니다. 예를 들어 각 비용이 총 비용에 대한 백분율로 얼마나 기여하는지를 계산하는 경우입니다.

실제 케이스에서는 회사 부서별로 비용이 있는 예처럼 특정 카테고리에 대한 자세한 내용이 필요할 수 있습니다. 다시 말해서, 각 부서별 총 지출을 간단한 GROUP BY로 얻을 수 있습니다:

<div class="content-ad"></div>

```js
myTable에서 depto 및 총합(value)을 그룹화하여 SELECT합니다.

또는 윈도우 함수에서 PARTITION 로직을 지정할 수 있습니다.

myTable을 PARTITION BY depto로 지정하여 SELECT 및 SUM(value)을 실행합니다.

결과를 확인하세요.
```

<div class="content-ad"></div>


![AnatomyofWindowsFunctions_2](/assets/img/2024-06-19-AnatomyofWindowsFunctions_2.png)

이 예제는 해당 기능이 '창' 함수로 불리는 이유를 이해하는 데 도움이 됩니다. OVER 절은 해당 함수가 작동할 '창' 즉, 테이블의 일련의 줄을 정의합니다.

위의 경우, SUM() 함수는 depto 열 (RH 및 SALES)에 의해 생성된 파티션에서 작동합니다. 이 함수는 depto 열의 각 항목에 대해 '값' 열의 모든 값들을 각각 개별적으로 합산합니다. 줄이 속한 그룹 (RH 또는 SALES)에 따라 '총계' 열의 값이 결정됩니다.

2 — 시간과 순서의 인식


<div class="content-ad"></div>

가끔은 다른 행의 값에 기반하여 하나의 행 안의 열의 값을 계산해야 할 때가 있습니다. 전형적인 예로 현재 값과 이전 값에서 계산한 국가의 GDP의 연간 증가율이 있습니다.

지난 해의 값을 필요로 하는 이러한 계산, 현재 및 이전 행의 차이, 시리즈의 첫 번째 값 등을 필요로 하는 경우는 윈도우 함수의 강력함을 증명합니다. 사실, 표준 SQL 명령어로 이러한 동작을 달성할 수 있는지 모르겠습니다! 아마 가능할 것이지만, 매우 복잡한 쿼리가 될 것입니다...

그러나 윈도우 함수를 사용하면 간단하게 할 수 있습니다. 아래 이미지는 (어린이의 키를 기록하는 테이블입니다):

![테이블 스냅샷](/assets/img/2024-06-19-AnatomyofWindowsFunctions_3.png)

<div class="content-ad"></div>

```js
SELECT 
  year, height, 
  LAG(height) OVER (ORDER BY year) AS height_last_year
FROM myTable
```

LAG('column') 함수는 이전 행의 'column' 값을 참조하는 역할을 합니다. 이것을 한 단계씩의 순차적인 단계로 상상해볼 수 있습니다: 두 번째 행에서는 첫 번째 값을 고려하고, 세 번째 행에서는 두 번째 값을 고려하고, 그 다음 계속 됩니다... 첫 번째 행은 카운트되지 않습니다(따라서 NULL 값이 반환되는 것), 이전 행이 없기 때문입니다.

당연히 '이전 행'을 정의하기 위해 어떤 순서 조건이 필요합니다. 여기에서 윈도우 함수의 또 다른 중요한 개념인 분석 함수가 필요합니다.

전통적인 SQL 함수와 대조적으로 분석 함수(LAG과 같은)는 행들 사이에 순서가 존재한다고 가정합니다 — 이 순서는 OVER() 안에 있는 ORDER BY 절에 의해 정의됩니다, 즉, 처음, 두 번째, 세 번째 행 등의 개념은 OVER 키워드 내에서 정의됩니다. 이러한 함수들의 주요 특징은 현재 행과 상대적인 다른 행을 참조할 수 있는 능력입니다: LAG는 이전 행을 참조하고, LEAD는 다음 행을 참조하고, FIRST는 분할 내 첫 번째 행을 참조하고, 등등이 있습니다.


<div class="content-ad"></div>

LAG 및 LEAD의 멋진 점 중 하나는 두 번째 인수인 오프셋을 받아들인다는 것입니다. 이 오프셋은 LEAD의 경우 앞으로 몇 개의 행(LEAD) 또는 뒤로 몇 개의 행(LAG)을 살펴볼지를 지정합니다.

```js
SELECT 
    LAG(height,  2) OVER (ORDER BY year) as height_two_years_ago,
    LAG(height,  3) OVER (ORDER BY year) as height_three_years_ago,
    LEAD(height)    OVER (ORDER BY year) as height_next_year
FROM ...
```

또한 이러한 함수들로 계산을 수행하는 것도 완벽하게 가능합니다:

```js
SELECT 
    100*height/(LAG(height) OVER (ORDER BY year)) 
    AS "annual_growth_%"
FROM ...
```

<div class="content-ad"></div>

3 - 시간 인식과 집계

시간과 공간은 하나라고 아인슈타인이 한번 말했던 적이 있는데, 그런 느낌인 것 같아요. 잘 모르겠어요 ¯\_(ツ)_/¯

이제 파티션 분할과 정렬하는 방법을 알았으니, 두 가지를 함께 사용할 수 있어요! 이전 예제로 돌아와서, 그 표 위에 더 많은 아이들이 있다고 상상해 봅시다. 우리는 각 아이의 성장률을 계산해야 할 때가 왔어요. 매우 간단해요. 정렬과 파티션을 결합해 보세요! 년도별로 정렬하고 아이 이름별로 파티션하면 되겠네요.

```js
SELECT 1-height/LAG(height) OVER (ORDER BY year PARTITION BY name) ...
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AnatomyofWindowsFunctions_4.png" />

위의 쿼리는 다음을 수행합니다 — child에 따라 테이블을 분할하고 각 분할에서 년도별로 값을 정렬한 후 현재 년도의 높이 값을 이전 값으로 나눈 다음 (결과를 1에서 빼서) 계산합니다.

'윈도우(window)'의 전체 개념에 점점 다가가고 있어요! 이것은 '윈도우(window)'가 테이블 슬라이스이며, PARTITION BY에서 정의된 열로 그룹화된 행 세트로서, ORDER BY에서 정의한 필드로 정렬되어, 동일한 그룹(분할) 내의 행만을 고려하며 특정 순서로 모든 계산이 이루어진다는 것입니다.

4-순위 및 위치

<div class="content-ad"></div>

Windows 함수는 세 가지 카테고리로 나뉠 수 있는데, 그 중 두 가지에 대해 이미 이야기했습니다: 집계 함수 ( COUNT, SUM, AVG, MAX, ... )와 분석 함수 ( LAG, LEAD, FIRST_VALUE, LAST_VALUE, ... ).

세 번째 그룹은 가장 간단한 순위 함수입니다. 그 중에서도 row_number() 함수가 가장 큰 영향을 미칩니다. 해당 함수는 그룹 내에서 행의 위치를 나타내는 정수를 반환합니다 (정의된 순서에 따라).

```js
SELECT row_number() OVER(ORDER BY score)
```

순위 함수는 이름에서 알 수 있듯이 그룹 내 라인의 위치에 따라 값이 반환되며, 정렬 기준에 따라 정의된 그룹입니다. ROW_NUMBER, RANK 및 NTILE이 가장 많이 사용되는 함수 몇 가지입니다.

<div class="content-ad"></div>

위의 이미지에서 각 플레이어의 점수에 기반한 행 번호가 생성됩니다.

... 그리고 네, 1부터 시작하는 끔찍한 프로그래밍 죄악을 저질립니다.

5-창 크기

<div class="content-ad"></div>

현재까지 소개된 모든 함수들은 결과를 계산할 때 파티션/그룹 내의 모든 행을 고려합니다. 예를 들어, 첫 번째 예제에서 설명한 SUM() 함수는 총계를 계산할 때 모든 부서의 행을 고려합니다.

하지만 더 작은 창 크기를 지정하여 현재 행 전후 몇 줄을 계산에 고려할 수도 있습니다. 이는 이동 평균/롤링 윈도우를 계산하는 데 유용한 기능입니다.

다음 예제를 고려해 봅시다. 특정 질병의 일일 발병 건수를 포함하는 표가 있고, 현재 날짜와 이전 2일을 고려하여 발병 건수의 평균을 계산해야 하는 경우를 생각해 봅시다. 앞서 소개된 LAG 함수로도 이 문제를 해결할 수 있다는 점을 주목해 주세요:

```js
SELECT
( n_cases + LAG(n_cases, 1) + LAG(n_cases, 2) )/3
OVER (ORDER BY date_reference)
```

<div class="content-ad"></div>

하지만 더 우아하게 동일한 결과를 얻을 수 있습니다. 프레임 개념을 사용하여:

```js
SELECT
AVG(n_cases)
OVER (
 ORDER BY date_reference
 ROWS BETWEEN 2 PRECEDING AND CURRENT ROW 
)
```

위의 프레임은 이전 2개의 행과 현재 행에 대해서만 평균을 계산해야 함을 지정합니다. 이전, 현재 행 및 다음 행을 모두 고려하고 싶다면, 프레임을 변경할 수 있습니다:

```js
AVG(n_cases)
OVER (
 ORDER BY date_reference
 ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
)
```

<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경하세요.

그것이 프레임이란 거에요 — 특정한 범위 내에서 함수의 작용을 제한하는 방법입니다. 대부분의 경우, 윈도우 함수는 다음과 같은 프레임을 고려합니다:

```js
ROWS BETWEEN UNBOUDED PRECEDING AND CURRENT ROW
-- 이전의 모든 행 + 현재 행
```

<img src="/assets/img/2024-06-19-AnatomyofWindowsFunctions_6.png" />

이 소개가 윈도우 함수가 무엇이고, 어떻게 작동하며, 실제 구문은 어떻게 되는지 더 잘 이해하도록 도와드리기를 바랍니다. 당연히 윈도우 함수에는 많은 다른 키워드가 추가될 수 있지만, 이미 다룬 명령어들이 일상 생활에서 많이 사용될 것으로 생각합니다. 이제 제가 일상에서 문제를 해결하기 위해 사용하는 흥미로운 실용적인 응용 프로그램 중 일부를 살펴보겠습니다 — 아주 흥미로운 것들이 있답니다!

<div class="content-ad"></div>

# Windows 함수의 흥미로운 사용 사례

## 시간별 누적 합계

이것은 Windows 함수를 사용하는 가장 고전적인 사례 중 하나입니다.

매월 당신의 급여가 나와 있는 표가 있다고 상상해보세요. 각 달에 얼마를 벌었는지 누적으로 알고 싶다면(이전 달 모두를 고려하여), 이것이 작동하는 방식입니다:

<div class="content-ad"></div>

아주 쉽죠?

이 쿼리에서 흥미로운 점은 SUM() 함수가 현재 행 및 이전 모든 행을 고려하여 집계를 계산한다는 것입니다.

## 로그 테이블의 이벤트 지속 시간

<div class="content-ad"></div>

제가 최근에 작성한 포스트인 "덕DB의 My First Billion (of Rows)"에서는 브라질의 전자 투표 기계에서 로그를 조작하는 내용을 다뤘어요. 대량의 데이터 처리에 관심이 있다면 한 번 확인해보세요.

요약하면, 각 이벤트가 시작된 시간을 나타내는 타임스탬프와 이름, 그리고 고유 식별자로 구성된 로그 테이블을 상상해보세요. 각 이벤트는 이전 이벤트가 끝날 때 시작되기 때문에, 이벤트 기간을 나타내는 열을 쉽게 추가할 수 있어요:

![이미지](/assets/img/2024-06-19-AnatomyofWindowsFunctions_8.png)

## 누락된 값 채우기 (마지막 발생으로)

<div class="content-ad"></div>

판다스를 활용한 머신 러닝 클래식! fillna, bfill 또는 다른 방법으로 널 값을 채우는 것만으로도 데이터 처리를 해결할 수 있어요.

SQL에서는 이를 어떻게 할까요? 간단해요!

![이미지](/assets/img/2024-06-19-AnatomyofWindowsFunctions_9.png)

머신 러닝을 처음 공부할 때는 판다스와 같은 고수준의 함수들을 많이 사용하곤 해요. 하지만 실제 프로젝트를 진행할 때는 데이터 양이 매우 많아 판다스를 사용할 수 없는 경우가 많아요. 그럴 때는 PySpark, Snowflake, Hive+hadoop 등의 도구를 사용해야 하는데, 이들은 어떤 식으로든 SQL에서 작업이 가능해요. 그렇기 때문에 SQL에서 이러한 처리와 전처리를 어떻게 하는지 배우는 것이 중요하다고 생각해요.

<div class="content-ad"></div>

## 누락된 값 채우기 (앞 행의 평균으로)

널(빈 값)을 채우는 더 다양한 방법, 그래도 간단합니다!

![Windows Functions](/assets/img/2024-06-19-AnatomyofWindowsFunctions_10.png)

이 예는 윈도우 함수가 복잡하고 특별한 것으로 보일지라도 일반 열처럼 사용할 수 있다는 것을 강조합니다! CASE에 포함시킬 수 있고, 계산에 활용할 수 있습니다. 알고 있는 제한 사항 중 일부는 WHERE 절에 직접적으로 배치할 수 없다는 것뿐입니다.

<div class="content-ad"></div>

```sql
SELECT * FROM
WHERE SUM() OVER() > 10 -- 이 기능은 postgres에서는 불가능합니다.
```

## 특정 열 기반의 행 중복 제거

윈도우 함수의 또 다른 고전적인 사례! 때로는 하나의 열 집합을 기준으로 하여 테이블의 행을 중복 제거해야 할 때가 있습니다.

물론 SQL에서는 DISTINCT 절을 사용할 수 있지만, 이는 전체 행이 중복될 때만 작동합니다. 테이블에 같은 ID 열의 값이지만 나머지 열에서는 다른 값이 있는 여러 행이 있는 경우 다음 로직을 사용하여 중복을 제거할 수 있습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AnatomyofWindowsFunctions_11.png" />

```js
SELECT *
  FROM (
   SELECT
   ROW_NUMBER() OVER (PARTITION BY id) as row_number
  )
WHERE row_number = 1
```

이 작업은 데이터 버전 관리도 가능합니다! 예를 들어, 시스템에서 사용자가 이름을 변경할 때마다 변경 날짜와 함께 새로운 줄을 저장하면(기존 줄을 변경하는 대신), 각 사용자의 현재 이름을 검색할 수 있습니다:

```js
SELECT
    *
FROM
(
  SELECT 
    name, 
    row_number() OVER (PARTITION BY id ORDER BY DATE DESC) AS row_number
  FROM myTable
) AS subquery
WHERE row_number = 1
```

<div class="content-ad"></div>

<table> 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>

그리고 여러분, Windows 함수의 흥미로운 케이스가 있나요? 공유하고 싶은 내용이 있다면 댓글에 남겨주세요!

# 결론

SQL이 고전적이거나 클래식하다고 말할 수 없겠죠. 이런 용어들은 과거를 가리키지만, SQL은 저에게 있어 현재에서 매우 중요하며 데이터 분야에서 일하는 사람들에게 꼭 필요한 언어입니다.

그렇지만 SQL로만 해결하기 어려운 문제들이 몇 가지 있을 수도 있습니다. 이럴 때는 언어와 그 능력에 대한 좋은 이해가 정말 중요합니다. Windows 함수가 없다면, Python 관점에서는 보편적으로 간주되는 많은 문제들이 매우 어려우거나 심지어 불가능할 수도 있습니다. 하지만 우리가 도구를 올바르게 사용하는 방법을 안다면 마법을 부릴 수 있습니다!

<div class="content-ad"></div>

이 게시물이 Windows 기능이 작동하는 방식과 실제로 해결할 수 있는 문제 유형을 더 잘 이해하는 데 도움이 되었으면 좋겠습니다. 여기에 제시된 모든 자료는 주로 PostgreSQL 구문을 기반으로 하고 있으며, 다른 데이터베이스에서는 바로 작동하지 않을 수 있지만 가장 중요한 것은 논리 자체입니다. 항상 전문가가 아니며, 해당 주제에 관심이 있는 모든 분들에게 깊이 있는 학습 및 많은 실습을 권장합니다.

독자 여러분, 감사합니다! ;)

# 참고 문헌

[1] PostgreSQL 윈도우 함수를 사용한 데이터 처리. (미상). Timescale. 링크.
[2] Kho, J. (2022, June 5). 고급 SQL 윈도우 함수 쉬운 안내 — Towards Data Science. Medium.
[3] Markingmyname. (2023, November 16). Funções analíticas (Transact-SQL) — SQL Server. Microsoft Learn.
[4] PostgreSQL Tutorial. (2021, April 27). PostgreSQL 윈도우 함수: 궁극의 안내. 링크.
[5] VanMSFT. (2023, May 23). OVER 절 (Transact-SQL) — SQL Server. Microsoft Learn.
[6] 윈도우 함수. (미상). SQLite 공식 문서.
[7] 윈도우 함수. (2014, July 24). PostgreSQL 문서.

<div class="content-ad"></div>

이 게시물의 모든 이미지는 저자가 제작했습니다.