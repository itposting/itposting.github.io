---
title: "판다 라이브러리가 할 수 있는 5가지를 소개합니다"
description: ""
coverImage: "/assets/img/2024-06-20-5ThingsIWishthePandasLibraryCouldDo_0.png"
date: 2024-06-20 15:50
ogImage: 
  url: /assets/img/2024-06-20-5ThingsIWishthePandasLibraryCouldDo_0.png
tag: Tech
originalTitle: "5 Things I Wish the Pandas Library Could Do"
link: "https://medium.com/datadriveninvestor/5-things-i-wish-the-pandas-library-could-do-ddbf9b5039a1"
---


아래는 해당 기사에 대한 코드를 찾을 수 있습니다.

Pandas 라이브러리 덕분에 파이썬에서의 표 데이터 처리, 분석 및 처리가 오늘날 이렇게 쉽고 간단히 수행되는 일은 없습니다.

현재, Pandas API는 표 데이터 관리에 필요한 다양한 기능을 제공하여 거의 모든 데이터 과학 프로젝트를 지원하고 있습니다. 예를 들어:

<div class="content-ad"></div>

- 입력 및 출력 작업
- 데이터 필터링
- 테이블 조인
- 데이터 시각화
- 중복 데이터 처리 등과 같은 여러 기능이 있습니다. 자세한 내용은 여기를 참조해 주세요.

판다스는 실제로 표 형식의 데이터를 다루는 대부분의 데이터 과학자들에게 선택되는 도구이지만, 제 프로젝트에서 이를 활용하면서 판다스의 주요 단점/제약 조건 몇 가지를 깨달았습니다. 이 글에서는 이에 대해 논의하고자 합니다.

따라서, 이 글에서는 현실 세계에서의 표 데이터셋에서 판다스가 해낼 수 있다고 희망하는 다섯 가지 기능을 제시합니다.

이 기사의 하이라이트는 다음과 같습니다:

<div class="content-ad"></div>

#1 Pandas가 CSV 파일을 병렬로 읽을 수 있다면 좋겠어요
#2 Pandas가 한 번에 여러 CSV 파일을 읽을 수 있다면 좋겠어요
#3 Pandas 데이터프레임이 더 적은 메모리를 사용하면 좋겠어요
#4 Pandas가 대규모 데이터셋에 사용될 수 있다면 좋겠어요
#5 Pandas가 SQL처럼 조건부 조인을 지원한다면 좋겠어요

시작해봐요 🚀!

## #1 Pandas가 CSV 파일을 병렬로 읽을 수 있다면

안타깝게도, Pandas의 CSV 파일에서/로의 입출력 작업은 직렬화되어 있어 Pandas에는 내재 된 멀티 쓰레딩 지원이 없습니다.

<div class="content-ad"></div>

우선, CSV 파일을 읽는 문맥에서의 직렬화는 판다스가 CSV 데이터를 한 번에 한 행(또는 한 줄)만 읽는 것을 의미합니다. 아래 애니메이션에서 이것이 설명되어 있습니다:

![serialization](https://miro.medium.com/v2/resize:fit:780/1*2cE0tW6MpSL9o21DzWvsIw.gif)

입력 작업과 비슷하게, 출력 작업 또한 좋지 않습니다. 판다스는 데이터프레임을 CSV 파일에 직렬화된 방식으로 저장합니다.

직렬화된 입력 및 출력 작업의 과정은 굉장히 비효율적이고 시간이 많이 소요되는 작업입니다.

<div class="content-ad"></div>

## 가능한 대안

제 탐색 결과, 전체 입력-출력 실행 시간을 개선하기 위한 두 가지 잠재적인 해결책이 있습니다.

- Pickle, Parquet 및 Feather와 같은 다른 파일 형식을 사용하여 데이터프레임을 읽고 저장하는 것이 좋습니다.

빠르면서도 디스크에 데이터를 저장하기 위해 적은 메모리를 사용하는 이러한 형식에 대해 더 자세히 알아보려면 아래 블로그에서 확인해주세요:

<div class="content-ad"></div>

- Pandas와는 달리 병렬화 기능을 갖춘 DataTable과 같은 라이브러리를 사용하세요.

아래 블로그에서 DataTable에 대해 더 읽어보세요:

## #2 Pandas가 동시에 여러 CSV 파일을 읽을 수 있다면 좋겠다

여러 개의 CSV 파일이 포함된 폴더가 있고, 이를 Pandas DataFrame으로 읽고 가져와야 한다고 상상해보세요.

<div class="content-ad"></div>

판다스에서 이 작업을 수행하는 유일한 방법은 파일 목록을 반복하고 하나씩 읽는 것입니다. 아래에서 보여진 것처럼:

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*9cPCbiuow73SBR4kWHlpAg.gif)

위의 그림은 다음과 같이 프로그래밍적으로 시연될 수 있습니다:

판다스에서 멀티스레딩을 지원하지 않기 때문에 병렬로 읽을 수 있는 파일 세트는 한 번에 하나씩 읽어야 하며, 이로 인해 실행 시간이 늘어나고 자원이 비효율적으로 사용될 수 있습니다.

<div class="content-ad"></div>

## 가능한 대안

DataTable 라이브러리는 다시 한 번 이 제한 사항을 해결하기 위한 Pandas의 좋은 대안으로 자리를 잡고 있습니다.

DataTable을 사용하면 여러 CSV 파일을 효율적으로 읽을 수 있습니다. 아래에서 이를 확인해보세요:

아래 블로그에서 런타임 성능에 대해 더 많이 알아보세요:

<div class="content-ad"></div>

# #3 판다 데이터프레임이 더 적은 메모리를 사용하도록 했으면 좋겠어요

판다 데이터프레임은 작업에 있어서 굉장히 비효율적이고 메모리를 많이 소비합니다. 예를 들어, 아래에 보여지는 두 개의 열로 이루어진 데이터프레임을 생성한다고 가정해 봅시다:

이제, 위의 데이터프레임 df의 두 열에 판다가 할당한 데이터 유형을 알아보기 위해 dtypes 속성을 사용해 봅시다:

기본적으로, 판다는 항상 열에 가장 큰 메모리 데이터 유형을 할당합니다. 예를 들어, 판다가 위에서 colA를 정수 값으로 해석했을 때, 선택할 수 있는 4가지 하위 카테고리가 있었습니다.

<div class="content-ad"></div>

- int8: 8비트 정수 데이터 유형으로 [-2⁷, 2⁷] 범위의 정수를 포함합니다.
- int16: 16비트 정수 데이터 유형으로 [-2¹⁵, 2¹⁵] 범위의 정수를 포함합니다.
- int32: 32비트 정수 데이터 유형으로 [-2³¹, 2³¹] 범위의 정수를 포함합니다.
- int64: 64비트 정수 데이터 유형으로 [-2⁶³, 2⁶³] 범위의 정수를 포함합니다.

그러나 판다스는 해당 열의 현재 값 범위와 관계없이 정수 값 열의 데이터 유형을 int64로 할당했습니다. 우리는 colB와 유사한 데이터 유형 행동을 발견했습니다.

## 가능한 대안

메모리 활용을 최적화하기 위해, "민맥스 감소 분석(min-max-reduce analysis)"이라고 부르는 방향이 있을 수 있습니다.

<div class="content-ad"></div>

우선, 관심 있는 열에서 최소값과 최대값을 찾는 것부터 시작해요.

마지막 단계는 열의 데이터 유형을 축약(줄이기)하는 것이에요.

현재 값의 범위를 int16 데이터 유형으로 압축할 수 있기 때문에 (왜냐하면 -2¹⁵` 10000 (min)` 30000 (max) `2¹⁵), 아래에 보여지는 것처럼 astype() 메서드를 사용하여 데이터 유형을 int64에서 int16으로 변환할 거예요:

이 간단한 한 줄짜리 데이터 유형 변환으로 colA 열이 사용하는 총 메모리가 약 40% 정도 감소했어요.

<div class="content-ad"></div>

비슷한 최소-최대-축소 분석을 통해 다른 정수 및 부동 소수점 값 열의 데이터 유형을 변경할 수도 있습니다.

아래 블로그에서 메모리 최적화 기술에 대해 더 읽어보세요:

# #4 파이썬 Pandas를 대규모 데이터셋에 사용할 수 있다면 좋겠어요

위에서 논의한 대로, Pandas에는 내재적인 멀티 스레딩 지원이 없습니다. 결과적으로 데이터 규모와 관계없이 Pandas는 항상 단일 코어를 활용하므로 데이터 크기에 비례한 실행 시간 증가가 발생합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-5ThingsIWishthePandasLibraryCouldDo_1.png)

For instance, consider an experiment to study the correlation between DataFrame size and the run-time to execute a function on the DataFrame.

We start with a random DataFrame comprising a thousand rows and two columns.

Next, we define a function that takes a row of the DataFrame and returns its sum. This function is implemented below:


<div class="content-ad"></div>

각 반복마다 DataFrame의 각 행의 합을 계산하는 데 걸리는 시간을 결정합니다. 무작위성을 제거하기 위해 각 반복을 run 번 반복할 것입니다. 각 반복의 끝에서 DataFrame의 크기를 두 배로 증가시킬 것입니다.

다음에 실험이 구현되어 있습니다:

아래 플롯은 반복 대 실행 시간 그래프를 나타냅니다. 각 반복마다 DataFrame의 크기가 두 배씩 증가하고 Pandas의 실행 시간도 그렇게 늘어납니다. 이는 Pandas의 실행 시간이 항상 DataFrame의 크기에 비례하며 병렬 처리를 채택하지 않는다는 것을 나타냅니다.

<img src="/assets/img/2024-06-20-5ThingsIWishthePandasLibraryCouldDo_2.png" />

<div class="content-ad"></div>

## 가능한 대안

Pandas는 작은 데이터셋에서 작업하기에 매우 좋습니다. 그러나 데이터 규모와 파이프라인의 복잡성이 증가함에 따라 데이터 과학자로서는 상기한 실행 시간 문제 때문에 활용을 자제해야 합니다.

프로젝트를 제품화하는 것이 목표라면 PySpark가 이상적입니다. 다른 대안으로는 Terality, Vaex, DataTable 및 Dask가 있습니다 — 주로 대용량 데이터셋에 대한 Pandas보다 지역 계산을 권장합니다.

# #5 Pandas가 SQL과 유사한 조인 조건을 지원했으면 좋겠네요 (어떤 방식으로든)

<div class="content-ad"></div>

SQL 작업을 하는 사람들은 테이블을 병합하기 위해 복잡한 조인 조건을 쓰는 것을 즐기지 않나요?

이름에서 알 수 있듯이 조건부 조인은 단순한 등가성 기반의 병합 조건을 넘어섭니다. 다시 말해, 여러 테이블에서 필드 간의 등가성 이외의 조건을 기반으로 조인을 설정할 수 있습니다.

예를 들어, table1과 table2라는 두 테이블이 있다고 가정해 봅시다:

다음 조건에 따라 이 두 테이블을 결합하는 것이 목적입니다.

<div class="content-ad"></div>

```sql
(table1.col1 = table2.col1 + 2) 그리고 (table2.col2 >= table2.col2 - 2) 그리고 (table2.col2 <= table2.col2 + 2)
```

## SQL 조인

위의 조건부 조인은 SQL에서 매우 간단하게 작업할 수 있습니다. 아래에 구현된 SQL 쿼리가 출력을 생성합니다:

## 판다스 조인

<div class="content-ad"></div>

판다는 데이터프레임에서 동일성을 기반으로 한 조인만 수행할 수 있습니다. 다시 말하면, 판다의 merge() 메소드는 조인 열의 값이 동일할 때에만 두 레코드를 조인하는 것이 가능하며, 조건부 조인의 가능성이 없어집니다.

따라서, 판다의 merge() 메소드를 사용하여 조건부 조인을 수행하는 몇 가지 방법은 다음과 같습니다:

- 조인 조건에서 정의된 연산을 사용하여 조인 열을 생성하고, 새 열에 대해 merge를 실행합니다.
- 교차 조인을 수행하고 데이터프레임을 필터링합니다. 이는 대규모 데이터셋의 경우에 매우 어려울 수 있습니다.

아래에서 접근 방법 1과 접근 방법 2를 조합한 예시가 제시되어 있습니다.

<div class="content-ad"></div>

먼저, 병합할 두 데이터프레임을 만들고 join 조건을 정의합니다.

```js
(table1.col1 = table2.col3 + 2) and (table2.col2 >= table2.col4 - 2) and (table2.col2 <= table2.col4 + 2)
```

join 조건이 부등식으로 이루어져 있기 때문에 일단 부등식들을 잠시 두고, 처음에는 동등식 (table1.col1 = table2.col3 + 2) 에 따라 먼저 join을 수행합니다. 그런 다음 결과를 필터링하여 다음 두 조건을 반영할 것입니다.

먼저, table2에 새로운 열을 생성할 것입니다. 이를 col3_1이라고 해보죠.

<div class="content-ad"></div>

이제 table1의 col1과 table2의 col3_1을 기준으로 조인을 수행하고, 조인 조건으로부터 남은 조건을 기반으로 얻은 레코드를 필터링할 것입니다. 아래에서 구현되어 있습니다:

## 가능한 대안

PandaSQL은 Pandas와 SQL을 혼합한 인기 있는 Python 패키지로, SQL 문법의 강력함을 파이썬 환경에서 활용할 수 있습니다.

따라서, PandaSQL을 사용하면 SQL 문법을 사용하여 pandas 데이터프레임을 쿼리할 수 있습니다. SQL과 유사한 조인을 실행하려면 PandaSQL을 탐색해보세요.

<div class="content-ad"></div>

SQL을 Pandas DataFrames와 함께 사용하는 쉬움은 실행 시간이라는 대가를 지는데요. 이에 대해 이전 블로그 글에서 다뤄보았습니다:

# 결론

이번 포스트에서 다뤄본 바와 같이, Pandas의 주요 제한 사항 다섯 가지와 이러한 상황에서 갇힌 경우 대처 방법을 논의했습니다.

Pandas는 일상적인 탭형 데이터 분석, 관리 및 처리 작업에 놀라울 정도로 유용합니다.

<div class="content-ad"></div>

하지만, 제작 수준의 솔루션을 개발하거나 처리할 데이터가 많을 경우, Pandas는 병렬화와 자원 활용에 제한이 있어 도움이 되지 않을 수 있습니다.

읽어 주셔서 감사합니다!

🚀 무료 데이터 과학 PDF(550페이지 이상)를 받아보세요. 매일 뉴스레터를 구독하시면 320개 이상의 게시물을 만나볼 수 있습니다:

![image](https://miro.medium.com/v2/resize:fit:1400/0*6rHTrx_iItXjC1hm.gif)

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-5ThingsIWishthePandasLibraryCouldDo_3.png)

Visit us at DataDrivenInvestor.com

Subscribe to DDIntel [here](link_here).

Have a unique story to share? Submit to DDIntel [here](link_here).


<div class="content-ad"></div>

저희 창조자 생태계에 참여해 주세요.

DDIntel은 주요 사이트와 인기 있는 DDI Medium 출판물에서 가장 주목할 만한 내용을 담고 있습니다. 커뮤니티에서 더 많은 통찰력 있는 작업을 확인해보세요.

DDI 공식 텔레그램 채널: [https://t.me/+tafUp6ecEys4YjQ1](https://t.me/+tafUp6ecEys4YjQ1)

LinkedIn, Twitter, YouTube, 그리고 Facebook에서 팔로우해 주세요.