---
title: "SQL 윈도우 함수 완벽 정복 종합 튜토리얼"
description: ""
coverImage: "/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_0.png"
date: 2024-06-23 16:48
ogImage: 
  url: /assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_0.png
tag: Tech
originalTitle: "Mastering SQL Window Functions: A Comprehensive Tutorial"
link: "https://medium.com/@manutej/mastering-sql-window-functions-guide-e6dc17eb1995"
---


# SQL 창 함수의 전체 잠재력을 발휘하세요. 기본적인 이해부터 고급 기술까지, 데이터 분석 및 쿼리 기술을 높이는 방법을 알아봅니다.

![SQL Window Functions](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_0.png)

# 창 함수란?

데이터베이스 관리와 데이터 분석의 복잡한 영역을 탐험하는 것은 종종 미개척된 영토에서 탐험하는 것과 같은 기분일 수 있습니다. 숨겨진 패턴을 발견하고 원시 데이터에서 의미 있는 통찰력을 얻는 것에는 특별한 즐거움이 있습니다. SQL은 강력한 도구 세트로 이 여정에서 우리의 나침반 역할을 합니다.

<div class="content-ad"></div>

길을 따라 가다 보면 기존 도구나 기술로 해결하기 어려운 도전이나 장애물에 부딪히곤 합니다. GROUP BY 작업에서 사용되는 "집계 함수"의 한계가 그 중 하나인 것이죠. 데이터 각 행에 대한 새로운 필드를 계산해야 하는 경우가 있을텐데, 이 경우에는 집계 함수 작업이 불가능합니다. 또한, 들어오는 데이터의 량이 지속적으로 변하는(즉, 정적이지 않은 데이터) 경우에 러닝 토탈, 평균 또는 다른 통계 측정치를 찾아야 하는 상황일 수도 있습니다.

처음에는 SQL 창 함수(Window Functions)가 방대한 SQL 레퍼토리에 있는데 또다른 일련의 명령들로 보일 수 있지만, 이들은 특별한 힘을 지녔으며 숨겨진 묻힌 브러시로, 데이터를 다양한 가능성의 캔버스로 변신시키는 능력을 가지고 있습니다. 오늘은 이 강력한 함수들을 해부하고, 내재된 예술성과 효율성을 데이터 분석에 가져다주는 과정으로 나아가겠습니다.

우리가 창 함수의 복잡함을 탐험하면서, 이들의 질문에 답하는 능력 뿐만 아니라 데이터와 함께 이야기를 만들어내며 행의 리듬과 숫자의 멜로디를 찾는 능력을 발견할 수 있을 것입니다. 데이터에 대한 감이 있는 데이터 초보자든, 숙련된 SQL 마에스트로든, 이 안내서는 창 함수의 복잡한 댄스를 안내하고 데이터의 심포니를 엿볼 수 있도록 디자인되어 있습니다.

# 언제 창 함수를 사용해야 할까요? (ELI5)

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_1.png)

어떤 건물 블록들이 있다고 상상해보세요. 각 건물 블록은 어떤 데이터를 나타냅니다. 여러분의 작업은 특정한 블록 그룹을 살펴보거나 이미 있는 블록들에 의존하여 새로운 블록을 만드는 것입니다.

## 1. 블록을 섞지 않고 비교하려면?

한 블록이 옆에 있는 블록들보다 더 큰지 확인하고 싶다고 상상해보세요. 윈도우 함수를 사용하면 모든 블록들을 섞지 않고 각 블록과 그 이웃들을 쉽게 비교할 수 있습니다.


<div class="content-ad"></div>

## 2. 한 행의 블록을 세거나 더하려고 합니다

만약 한 열에 총 몇 개의 블록이 있는지 세고, 블록의 숫자를 더하려면, 창 함수를 사용하여 각 블록을 하나씩 살펴보고 누적 합계를 유지할 수 있습니다. 이를 통해 해당 블록들의 러닝 평균을 찾을 수도 있습니다!

## 3. 섹션에서 가장 큰 또는 작은 블록을 찾고 싶습니다

예를 들어, 색으로 정렬된 블록이 행별로 있고, 각 행에서 가장 큰 블록을 찾고 싶다고 가정해 봅시다. 창 함수를 사용하면 각 행을 개별적으로 살펴보고 각 행에서 가장 큰 블록을 선택할 수 있습니다.

<div class="content-ad"></div>

## 4. 블록에 점수 또는 순위를 부여하고 싶다면

만약 각 블록에 크기나 색상에 따라 점수나 순위를 부여하고 싶으면 창 함수가 그 역할을 맡을 수 있습니다. 이 함수는 모든 블록을 살펴보고, 원하는 대로 정렬한 뒤, 각 블록에 번호를 부여하여 해당 블록이 전체 블록 세트에서의 순위를 표시합니다.

## 5. 블록이 주변 블록들과 비교되는 방법을 알고 싶다면

어떤 블록이 주변 블록들의 평균 높이보다 크다면 어떨지 보고 싶을 수 있습니다. 창 함수는 특정 블록과 그 주변 블록들을 살펴보고, 평균 높이를 계산한 다음 해당 블록이 어떻게 비교되는지 알려줄 수 있습니다.

<div class="content-ad"></div>

윈도우 함수는 현재 행과 관련된 일련의 행을 기반으로 계산을 수행하는 SQL 작업입니다. 집계 함수와 달리 행을 단일 출력 행으로 그룹화하지 않으며, 행은 각각 별도로 유지됩니다. 윈도우 함수는 현재 행과 관련된 일련의 행을 기반으로 계산을 수행할 수 있습니다. 이러한 함수는 행들의 “윈도우”를 통해 계산을 수행하므로 윈도우 함수라고 불립니다. 예를 들어, 매출의 누적 합계를 계산하거나 그룹에서 가장 높은 점수를 찾을 수 있습니다.

집계 함수와 비교하면 어떻게 다른지 아래 이미지를 참조하세요.

![윈도우 함수 이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_2.png)

# 윈도우 함수의 구조

<div class="content-ad"></div>

Window Functions을 설명하는 것은 많은 사람들이 매우 복잡한 방법을 사용하는데, 저의 목표는 여러분을 위해 정말 쉽게 설명하는 것입니다!

창문 함수(Window Functions)를 상상해보세요. 관광 버스에 타고 창문을 통해 바라보고 있는 것과 같아요. 한 가지씩 보여지는 것을 보죠, 맞죠? SQL 창문 함수는 그것처럼 작동합니다. 데이터를 한 행씩 보며, 그 전에 봤던 것과 다음에 오는 것을 기억해요. 관광 중에 사진 기억력이 있는 것과 같아요!

![이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_3.png)

- 함수(Function): 이것은 SUM, AVG, MAX 또는 필요한 다른 함수일 수 있어요. 수학 연산을 수행하려는 핵심입니다. 이것들은 일반적인 집계 함수와 유사하지만 반환되는 행의 수를 줄이지는 않아요.
- OVER(): SQL에게 특별한 작업을 할 것이라고 알리는 부분으로, 창문 함수(Window Function)를 준비하는 역할을 해요. OVER()는 SQL의 창문 함수의 기초입니다. 이 절은 함수가 처리할 "창문" 또는 데이터 하위 집합을 지정할 수 있도록 권한을 부여해요.
- PARTITION BY: (선택 사항) 데이터의 특정 청크(그룹)에 대해 계산을 수행하려면 SQL에 나눌 방법을 알려주는 것입니다. PARTITION BY가 지정되지 않으면 함수는 쿼리 결과 세트의 모든 행을 단일 파티션으로 처리해요. GROUP BY 절과 유사하게 작동하지만 GROUP BY는 데이터를 집계하지만 PARTITION BY는 데이터를 그룹화하지만 창 함수의 목적을 위해 데이터를 그룹화하지 않아요.
- ORDER BY: (선택 사항) 각 파티션 내의 행을 순서대로 정렬합니다. ORDER BY가 지정되지 않으면 함수는 파티션의 모든 행을 단일 그룹으로 처리해요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_4.png" />

이제 SQL 코드에서 이를 실제로 확인해 봅시다:

```js
SELECT column_name, 
       WINDOW_FUNCTION(column_name) OVER (
           PARTITION BY column_name 
           ORDER BY column_name 
           RANGE/ROWS BETWEEN ... AND ...
       ) 
FROM table_name;
```

그렇습니다! 이제 윈도우 함수가 어떻게 작동하는지 간단히 살펴보았습니다. 물론 이를 연결시키기 위해 몇 가지 기본적인 예제를 살펴보고 싶으실 것입니다. 그러므로 다음에 그것을 살펴보겠습니다.

<div class="content-ad"></div>

# 기억에 남는 예시

간단한 판매 데이터와 이 판매 데이터의 항목들이 있다고 상상해 봅시다.

# 1. 러닝 토탈

```js
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  SaleDate, 
  SUM(SaleAmount) OVER (ORDER BY SaleDate) AS RunningTotal
FROM Sales;
``` 

<div class="content-ad"></div>

이 코드는 SaleDate 기준으로 각 행의 SaleAmount 누적 총액을 계산합니다. 아래 결과를 확인해보세요. 새로운 RunningTotal이라는 열을 주목해주세요! 여기서 새로운 열을 만들었습니다! 다른 곳에서 "계산된 필드"로 본 적이 있을 수도 있어요.

# 2. 누적 합계 (판매 담당자별)

이제 만약 판매 팀 구성원마다 시간이 지남에 따라 어떻게 변하는지 확인하고 싶다면 어떻게 할까요? 판매 팀에서 숫자(즉, 목표)를 추적하는 것은 매우 중요하므로 우리는 데이터 집합 전체에 대한 Running Total을 계산하는 것이 아니라 각 팀 구성원마다 총액을 계산하는 다른 요구 사항을 가질 수 있습니다. 이런 경우를 어떻게 다룰까요?

먼저 코드와 결과를 확인해보고, 모든 것이 더 분명해질 것입니다. 그런데 먼저 이 코드에서 지난 예제와 비교했을 때 어떤 변경 사항이 있는지 찾아보세요.

<div class="content-ad"></div>

```js
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  SaleDate, 
  SUM(SaleAmount) OVER (PARTITION BY Salesperson ORDER BY SaleDate) AS CumulativeSalePerPerson
FROM Sales;
```

만약 새로운 필드 "CumulativeSalePerPerson"을 살펴보면 패턴이 조금 더 어려운 것을 알 수 있지만, 세 번째 행에 도달하면 훨씬 명확해집니다. "Alice"는 첫 번째 행에서 "300"의 판매를 하였고, 그 다음 세 번째 행에서 "200"의 판매를 하여 해당 시점에서 누적 판매액은 "500"이 되었습니다. 비슷하게, Bob은 두 번째와 다섯 번째 행에 판매 내역이 있으므로, 다섯 번째 행에서 "300"의 판매를 기록하여 이전의 "150"에 더하여 "450"에 도달합니다. 이렇게 간단합니다! 일반 SQL 쿼리로 이 작업을 어떻게 수행할지 생각해 보는 것은 불가능할 것입니다!

<img src="/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_5.png" />

# 3. 판매 금액에 따른 판매 순위 매기기


<div class="content-ad"></div>

이제 상상해 봐주세요. 우리가 가장 큰 승리(가장 큰 물고기를 낚는)가 성공적인 판매 대회가 진행 중이라면 어떨까요?

![이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_6.png)

당연히 우리는 순위를 쉽게 매길 방법을 원할 것입니다. 일반 쿼리로는 SaleAmount를 기준으로 ORDER BY SaleAmount DESC로 간단히 정렬하고 싶을 수 있지만, 다른 데이터의 기존 순서를 잃어버릴 수 있습니다. 이때 RANK() 함수가 필요합니다!

```js
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  SaleDate, 
  RANK() OVER (ORDER BY SaleAmount DESC) AS SaleRank
FROM Sales;
```

<div class="content-ad"></div>

9번째 행으로 내려갔을 때, Alice가 "450"의 가장 큰 어핻을 잡아 1위에 올랐음을 확인할 수 있어요! 그녀는 또한 3번째, 5번째, 10번째, 12번째, 14번째 "순위" 어핻을 잡았습니다.

# 4. 판매액의 이동평균 (3일)

바쁜 판매 팀으로서, 팀이 매출 목표를 달성하기 위해 나아가고 있는 전체적인 추세를 찾는 것은 중요합니다. 총계보다는 추세를 찾고 있다면, 3일 이동평균은 일일 변동을 완화하고 매출의 전반적인 방향을 강조합니다. 이는 개별적인 브러쉬 스트로크에 집중하는 대신 그림 전체를 보기 위해 일어서서 바라볼 때와 같은 느낌입니다.

![image](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_7.png)

<div class="content-ad"></div>

이 예제는 간단화를 위해 3일 창으로 설정하였지만, 7일 (주간 이동평균), 30일 (월간), 또는 어떤 기간을 살펴볼지 결정하셔도 됩니다! (참고: 이러한 창 함수는 한 줄에 굉장히 길어져서 코드 스타일링을 위해 적절한 공백으로 구분하셔야 합니다).

```js
SELECT SaleID, SaleDate, Salesperson, SaleAmount, 
       AVG(SaleAmount) OVER (
                    ORDER BY SaleDate 
                    ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
                            ) AS MovingAverage
FROM Sales;
```

우리는 ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING을 사용하여 각 행의 이전 날과 다음 날을 살펴보았습니다 (즉, "창"을 생성하였습니다). 아마도 이것이 왜 누군가 이러한 함수들을 이런 이름으로 부르게 된 가장 관련성 있는 이유일 것입니다!

이제 창 함수를 이용한 몇 가지 시행을 끝냈으니, 여러분이 스스로 묻고 있는 굉장히 중요한 질문이 있을 수 있습니다...

<div class="content-ad"></div>

## 창 함수의 중요성

창 함수(Window Functions)와 GROUP BY 집계 함수(Aggregate Functions)의 주요 차이점은 집계 함수가 각 그룹의 행에 대해 단일 결과를 반환하는 반면에(예: 그룹의 합계 또는 평균), 창 함수는 각 행마다 결과를 반환하며 종종 창(Window) 내 다른 행과 관련하여 작동합니다(예: 각 행에 대한 러닝 토탈). 제 학생들 중에는 이것이 창 함수가 작동하는 방법을 이해하는 핵심이자 더욱 중요한 이유라고 생각하는 경우가 많습니다.

SQL 창 함수를 마스터하는 것은 데이터 조작 도구 상자에 강력한 도구를 추가하는 것과 같습니다. 이들은 복잡한 데이터 분석과 보고를 위한 고급 기능을 제공하여 통찰력을 얻고 정보 기반 결정을 내릴 수 있게 해줍니다. 러닝 토탈 계산, 결과 순위 매기기 또는 개별 행을 집계된 데이터셋 측정 지표와 비교하는 등, 창 함수는 필수불가결합니다. SQL 여정에서 이를 받아들이면 쿼리가 효율적이고 명확해지는 새로운 수준에 도달할 것입니다!

창 함수의 복잡성에 더 깊이 파고들기 전에, SQL은 데이터 조작 기술을 향상시키기 위한 다양한 도구와 기능을 제공한다는 점을 어떻게든 눈여겨보는 것이 가치가 있습니다. 저희의 SQL 마스터리 시리즈를 따라오고 계시다면, 과거에 해당 주제에 대해 자세히 다룬 SQL 서브쿼리 마스터리 가이드를 기억하실 수도 있습니다. 서브쿼리를 이해하는 것은 더 고급 SQL 주제인 창 함수를 포함한 강력한 기초를 다지는 중요한 단계입니다. 아직 이 주제를 탐험해보지 못하셨다면, 읽어 보는 것을 강력히 추천합니다(또는 날씨가 구름낀 날을 위해 독서 목록에 저장하는 것도 좋습니다). 이를 통해 이해를 확고히 하고 복잡한 SQL 쿼리 작성 능력을 향상시킬 수 있을 것입니다.

<div class="content-ad"></div>

실은 때로는 동일한 작업을 수행하기 위해 창 함수 또는 하위 쿼리를 모두 사용할 수 있는 경우도 있습니다. 진정한 SQL 숙련도를 갖추려면 답을 찾는 데 여러 가지 방법에 능숙해지고 가장 효율적인 경로를 선택하는 능력이 필요합니다. 이는 Query Optimization 측면에서 가장 효율적인 것을 고려하기도 하며, 이에 대한 자세한 내용은 Mastering SQL 시리즈 다른 부분에서 다룰 예정입니다.

# 창 함수의 종류

![창 함수 이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_8.png)

이제 창 함수에 대한 탄탄한 소개가 있으니, 사용 가능한 창 함수의 다양한 종류를 알아보는 시간을 갖도록 하겠습니다.

<div class="content-ad"></div>

집계 윈도우 함수

이것들은 일반 집계 함수와 비슷하지만 반환된 행의 수를 줄이지 않습니다. 예시로는 SUM(), AVG(), MIN(), MAX(), COUNT() 등이 있습니다.

- SUM(): 이 함수는 숫자 열의 합계를 반환합니다.
- AVG(): 이 함수는 숫자 열의 평균을 반환합니다.
- COUNT(): 이 함수는 지정된 조건과 일치하는 행의 수를 반환합니다.
- MIN(): 이 함수는 선택한 열의 가장 작은 값 반환합니다.
- MAX(): 이 함수는 선택한 열의 가장 큰 값을 반환합니다.

## 순위 윈도우 함수:

<div class="content-ad"></div>

이러한 함수들은 결과 집합의 파티션 내 각 행에 고유한 순위를 할당합니다(또는 전체 데이터 집합). 예시로는 ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE()이 있습니다.

![이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_9.png)

- RANK(): 이 함수는 결과 집합의 파티션 내 각 고유한 행에 고유한 순위를 할당합니다. 순위는 OVER() 절의 ORDER BY 절에서 지정된 순서대로 할당됩니다. 만약 두 개 이상의 행이 동일한 순위를 가지게 되면, 각 같은 순위의 행에 동일한 순위가 할당되고, 다음 순위들은 건너뜁니다.
- DENSE_RANK(): 이 함수는 RANK()와 유사하게 작동하지만, 두 개 이상의 행이 동일한 순위를 가질 때, 다음 순위가 건너뛰지 않습니다. 따라서 만약 랭크 2에 세 개의 항목이 있다면, 다음 순위로 나열된 것은 3이 됩니다.
- ROW_NUMBER(): 이 함수는 중복 여부와 상관 없이 파티션 내 각 행에 고유한 행 번호를 할당합니다. 정렬된 집합 내에 중복 값이 있는 경우에도 각 행에 다른 행 번호가 할당됩니다.
- NTILE() 함수는 정렬된 파티션을 지정된 그룹 수 또는 "타일"로 나누고, 각 행에 그룹 번호를 할당합니다. 이는 데이터 집합을 사분위수, 십분위수 또는 다른 크기의 균등한 그룹으로 나누는 데 유용합니다.

아래에서 각각의 순위 함수들을 코드로 어떻게 작성할 수 있는지 살펴보세요.

<div class="content-ad"></div>

```js
-- RANK() 예시
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  RANK() OVER (ORDER BY SaleAmount DESC) AS RankByAmount
FROM Sales;

-- DENSE_RANK() 예시
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  DENSE_RANK() OVER (ORDER BY SaleAmount DESC) AS DenseRankByAmount
FROM Sales;

-- ROW_NUMBER() 예시
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  ROW_NUMBER() OVER (ORDER BY SaleAmount DESC) AS RowNumByAmount
FROM Sales;

-- NTILE() 예시
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  NTILE(4) OVER (ORDER BY SaleAmount DESC) AS Quartile
FROM Sales;
```

## 값 윈도우 함수

이 함수들은 각 파티션에서 특정 값을 반환합니다. 이러한 함수는 파티션에서 특정 데이터에 액세스하는 방법을 제공하여 결과 집합 내의 값들 간의 차이를 비교하거나 계산할 수 있게 합니다.

![이미지](/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_10.png)


<div class="content-ad"></div>

예시로는 FIRST_VALUE(), LAST_VALUE(), LEAD(), LAG() 함수가 있습니다.

- FIRST_VALUE(): 이 함수는 파티션 내에서 정렬된 값 세트에서 첫 번째 값을 반환합니다. 예를 들어, 이 함수를 사용하여 판매원이 한 초기 판매를 찾을 수 있습니다.
- LAST_VALUE(): 이 함수는 파티션 내에서 정렬된 값 세트에서 마지막 값을 반환합니다. 특정 제품의 가장 최근 판매 금액을 찾는 데 사용할 수 있습니다.
- LEAD(): 이 함수는 동일한 결과 집합의 후속 행에서 데이터에 액세스할 수 있도록 하여 현재 값과 다음 행의 값을 비교하는 방법을 제공합니다. 두 연속 일자 간의 판매 금액 차이를 계산하는 데 유용합니다.
- LAG(): LEAD()와 유사하지만, LAG() 함수는 결과 집합의 이전 행에서 데이터에 액세스할 수 있도록 해줍니다. 이것은 현재 데이터를 과거 데이터와 비교하는 데 유용합니다. 이러한 함수들은 데이터 분석을 위한 강력한 도구로, 데이터를 탐색하고 특정 데이터를 다른 데이터 포인트와 관련하여 통찰력을 얻을 수 있도록 도와줍니다.

```js
-- FIRST_VALUE()와 LAST_VALUE() 예제
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  FIRST_VALUE(SaleAmount) OVER (ORDER BY SaleDate) AS FirstSaleAmount,
  LAST_VALUE(SaleAmount)  OVER (ORDER BY SaleDate 
                               RANGE BETWEEN UNBOUNDED PRECEDING AND 
                               UNBOUNDED FOLLOWING
                               ) AS LastSaleAmount
FROM Sales;

-- LEAD()와 LAG() 예제
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  LAG(SaleAmount) OVER (ORDER BY SaleDate) AS PreviousSaleAmount,
  LEAD(SaleAmount) OVER (ORDER BY SaleDate) AS NextSaleAmount
FROM Sales;
```

# 윈도우 프레임 명시화

<div class="content-ad"></div>

이 개념은 특정 행에 대한 계산을 수행하는 subset을 의미합니다. 창 프레임은 ROWS 또는 RANGE 절을 사용하여 지정할 수 있으며, 모든 행을 고려하는 비바운드(unbounded)일 수도 있고 특정 범위로 제한될 수도 있습니다.

ROWS: 물리적 행을 기준으로 창 프레임을 정의합니다. 정해진 행 수를 지정하거나 UNBOUNDED PRECEDING 및 UNBOUNDED FOLLOWING을 사용하여 모든 행을 포함할 수 있습니다.

RANGE: 논리적 행 그룹을 기준으로 창 프레임을 정의합니다. ROWS와 유사하게 범위를 지정하거나 UNBOUNDED 옵션을 사용할 수 있습니다.

```js
-- ROWS 창 프레임 명세
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  AVG(SaleAmount) OVER (ORDER BY SaleDate ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS MovingAvg
FROM Sales;

-- RANGE 창 프레임 명세
SELECT 
  SaleID, 
  Salesperson, 
  SaleAmount, 
  SUM(SaleAmount) OVER (ORDER BY SaleAmount RANGE BETWEEN 50 PRECEDING AND 50 FOLLOWING) AS CumulativeSum
FROM Sales;
```

<div class="content-ad"></div>

창 프레임 명세는 현재 행과 전체 파티션 대신 일부 행 집합에 걸쳐 계산을 수행하려는 경우 중요합니다.

# 창 함수 문제 해결

창 함수가 예상대로 작동하지 않는 경우 다음을 고려해보세요:

- OVER 절을 확인하세요: OVER 절은 창 함수의 동작 방식을 결정합니다. PARTITION BY 및 ORDER BY 절을 올바르게 지정했는지 확인하세요.
- 함수 구문을 검토하세요: 각 창 함수마다 고유한 구문이 있습니다. 사용 중인 함수의 구문을 확인하여 올바른지 확인하세요.
- 데이터 유형을 검토하세요: 사용 중인 함수의 데이터 유형이 호환되는지 확인하세요. 예를 들어, 텍스트 필드(또는 숨겨진 문자열 값이 있는 열)에서 SUM 작업을 수행할 수 없습니다.

<div class="content-ad"></div>

# 창 함수 최적화

창 함수는 여러 행을 대상으로 계산을 수행하기 때문에 종종 쿼리 실행이 느려질 수 있습니다. 다음은 창 함수를 최적화하는 몇 가지 팁입니다:

- 행 수 줄이기: 가능하다면 창 함수를 적용하기 전에 데이터를 필터링하세요. 함수가 작업해야 하는 행이 적을수록 쿼리가 더 빨리 실행됩니다. 이는 데이터의 전체 범위에 대해 거인을 풀기 전 코드를 디버그하고 실행할 수 있도록 보다 효율적으로 작업할 수 있는 최선의 방법입니다.
- 적절한 인덱싱 사용: 데이터를 파티셔닝하거나 정렬하는 경우 해당 열에 적절한 인덱스가 있는지 확인하세요. 이렇게 하면 창 함수의 성능이 크게 향상될 수 있습니다.
- 복잡한 정렬 피하기: 가능하다면 창 함수 내 ORDER BY 절에서 여러 열을 사용하는 것을 피하세요. 각 추가 열은 계산 시간을 증가시킬 수 있습니다.
- 창 프레임 제한: 기본적으로 창 함수는 파티션 내 모든 행을 고려합니다. 모든 행을 고려할 필요가 없다면 ROWS 또는 RANGE 절을 사용하여 창 프레임을 제한하세요.

이러한 고급 창 함수 및 컨셉을 활용하면 데이터에 복잡한 변환 및 계산을 수행하여 SQL 쿼리를 더 강력하고 통찰력 있게 만들 수 있습니다. 결과를 순위 매기거나 누적 합계를 계산하거나 파티션 내 특정 값에 액세스하는 경우, 창 함수는 고급 데이터 분석에 필요한 유연성과 기능성을 제공합니다. 이제 이를 깊이 이해한 후 항상 참고할 수 있는 편리한 치트 시트 (출처: learnsql.com)가 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-MasteringSQLWindowFunctionsAComprehensiveTutorial_11.png" />

SQL 윈도우 함수의 복잡한 기능을 탐험하면서, 복잡한 데이터 분석을 더 쉬운 작업으로 변환할 수 있다는 것을 발견했습니다. 이러한 고급 함수는 우리의 쿼리를 최적화하는 뿐만 아니라 데이터 탐색과 보고의 가능성을 열어줍니다. SQL 레퍼토리에 윈도우 함수를 접목하면서, 숙련의 핵심은 실습과 실험이라는 것을 기억하세요. 그러니, 깊이 파고들어 탐험하고, 고급 SQL 쿼리의 영역에서 윈도우 함수가 당신의 안내자 역할을 하게 해보세요.

## WINDOW 함수 즐기기

이 내용을 즐겼다면? 최신 프로그래밍 및 데이터 과학 안내서와 자습서를 Medium 피드로 바로 받아보려면 팔로우 버튼을 클릭하세요!

<div class="content-ad"></div>

읽어 주셔서 감사합니다.