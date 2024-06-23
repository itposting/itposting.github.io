---
title: "PySpark 완벽 해설 explode와 collect_list 함수 사용 방법"
description: ""
coverImage: "/assets/img/2024-06-23-PySparkExplainedTheexplodeandcollect_listFunctions_0.png"
date: 2024-06-23 16:24
ogImage: 
  url: /assets/img/2024-06-23-PySparkExplainedTheexplodeandcollect_listFunctions_0.png
tag: Tech
originalTitle: "PySpark Explained: The explode and collect_list Functions"
link: "https://medium.com/towards-data-science/pyspark-explained-the-explode-and-collect-list-functions-834f45ff5ac5"
---


PySpark SQL은 Apache PySpark의 SQL을 위한 파이썬 인터페이스로, 데이터 변환 및 분석을 위한 강력한 도구 모음입니다. 데이터베이스 SQL 시스템에서 사용 가능한 가장 일반적인 유형의 작업을 모방하도록 만들어졌으며, Spark에서 사용 가능한 데이터프레임 패러다임을 활용하여 추가 기능을 제공할 수 있습니다.

간단히 말하면, PySpark SQL은 개발자가 데이터를 효율적으로 조작하고 처리할 수 있는 다양한 기능을 제공합니다.

이러한 기능 중에서, 특히 유용한 두 가지 함수는 데이터를 고유한 방식으로 변환하고 집계하는 능력으로 인해 주목할 만합니다. 이것들은 explode 및 collect_list 연산자입니다.

본 문서에서는 이러한 각각의 기능이 정확히 무엇을 하는지 설명하고, 각각에 대한 사용 사례와 샘플 PySpark 코드를 보여드리겠습니다.

<div class="content-ad"></div>

## Explode

PySpark SQL의 `explode` 함수는 배열이나 맵과 같은 중첩 데이터 구조를 변환하고 평평하게 만드는 다목적 도구입니다. 이 함수는 중첩된 컬렉션을 포함하는 복잡한 데이터 세트를 다룰 때 특히 유용합니다. 중첩된 구조 내의 개별 요소를 분석하고 조작할 수 있도록 해줍니다.

Pyspark의 배열은 다른 컴퓨터 언어의 배열과 매우 유사합니다. 주로 동일한 유형의 요소를 특정 순서로 저장하는 데이터 구조로, 보통 연속적인 메모리 위치에 저장됩니다.

Spark의 맵은 파이썬과 같은 언어의 사전과 동등합니다. 특정 키에 대한 값을 매우 빠르게 조회할 수 있는 키-값 쌍의 시리즈를 보유합니다. 나중에 `explode`를 사용하는 예제를 살펴보겠습니다.

<div class="content-ad"></div>

어레이 컬럼에 적용되는 explode 함수는 어레이의 각 요소에 대해 새로운 행을 생성하고 해당 요소 값을 새 열에 저장합니다. 기본적으로 이 새 열은 col이라는 이름으로 지정되지만 별칭을 사용하여 사용자 정의 열 이름을 지정할 수 있습니다.

마찬가지로, 맵 컬럼에 적용되는 explode 함수는 두 개의 새로운 열을 생성합니다: 키를 위한 열과 값을 위한 열. 기본적으로 이 열은 각각 key와 value로 지정되지만 다시 한 번 별칭을 사용하여 사용자 정의 열 이름을 제공할 수 있습니다.

## Collect_list

PySpark SQL의 collect_list 함수는 컬럼에서 값을 모아서 배열로 변환하는 집계 함수입니다. 기존에 다른 PySpark SQL 함수들을 사용하여 평탄화되거나 변환된 데이터를 재구성하거나 집계해야 하는 경우에 특히 유용합니다. 많은 면에서, 이 함수는 explode에 대한 보완 함수로 생각될 수 있습니다.

<div class="content-ad"></div>

이 함수는 데이터를 그룹화하기 위해 하나 이상의 열을 기반으로 한 그룹화 연산자(groupBy operator)와 함께 자주 사용됩니다.

## 무료 Pyspark 개발 환경에 액세스하는 방법

이 글의 코드를 따라하려면 PySpark 개발 환경에 액세스해야 합니다.

귀하의 직장을 통해, 클라우드를 통해 또는 로컬 설치를 통해 PySpark에 액세스할 수 있다면 행운이겠죠. 그렇지 않은 경우, 아래 링크를 확인하여 Databricks Community Edition이라는 훌륭한 무료 온라인 PySpark 개발 환경에 액세스할 수 있는 방법에 대해 자세히 살펴보세요.

<div class="content-ad"></div>

Databricks는 Apache Spark를 중심으로 구축된 데이터 엔지니어링, 머신 러닝 및 분석을 위한 클라우드 기반 플랫폼으로, 대용량 데이터 워크로드를 처리하기 위한 통합 환경을 제공합니다. Databricks의 설립자들은 Spark를 만들었으므로 이 분야에 대해 정통하다는 것을 알 수 있습니다.

## 사용 사례 예시

이제 explode 및 collect_list의 동작에 대해 조금 더 알게 되었으니, 이러한 함수들의 사용 사례를 살펴보겠습니다.

explode 함수

<div class="content-ad"></div>

explode 함수를 사용하여 배열을 변환하는 방법으로 시작하겠습니다. Spark에서 배열은 동일한 유형의 요소를 고정 크기의 순차적 컬렉션으로 저장하는 데이터 구조입니다.

한 텍스트 열에 사람들의 이름을, 또 다른 배열 열에는 그들이 좋아하는 과일을 담은 PySpark 데이터프레임을 설정할 것입니다.

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import explode

# 스파크 세션 초기화
spark = SparkSession.builder.appName("ArrayExplodeExample").getOrCreate()

# 배열 열 "fruits"를 포함하는 DataFrame 생성
data = [
    ("John", ["apple", "banana", "cherry"]),
    ("Mary", ["orange", "grape"]),
    ("Jane", ["strawberry", "blueberry", "raspberry"]),
    ("Mark", ["watermelon"])
]

# 스키마 정의 및 DataFrame 생성
df = spark.createDataFrame(data, ["name", "fruits"])

# 원래 DataFrame 표시
df.show(truncate=False)
```

이 데이터를 분석하는 많은 경우에서 "name"과 "fruit"의 각 기능 조합이 별도의 레코드로 존재하는 것이 훨씬 편리합니다. 이를 위해 explode 함수를 사용하여 이를 달성할 수 있습니다.

<div class="content-ad"></div>

```js
# 배열 열을 펼치기 위해 explode 함수를 사용하세요
exploded_df = df.withColumn("fruit", explode(df.fruits))

# 펼쳐진 DataFrame을 보여주세요
exploded_df["name","fruit"].show(truncate=False)



+----+----------+
|name|fruit     |
+----+----------+
|John|apple     |
|John|banana    |
|John|cherry    |
|Mary|orange    |
|Mary|grape     |
|Jane|strawberry|
|Jane|blueberry |
|Jane|raspberry |
|Mark|watermelon|
+----+----------+
```

이제 데이터는 일반적인 데이터테이블과 비슷하게 보이며, 추가 데이터프레임이나 SQL 작업을 수행하여 추가 분석을 수행할 경우 더 잘 정리되어 있습니다.

Pyspark에서 맵을 다루는 explode 사용법은 매우 유사합니다.

```js
from pyspark.sql import SparkSession
from pyspark.sql.functions import explode, create_map, lit, col
from pyspark.sql.types import MapType, StringType

# Spark 세션 초기화
spark = SparkSession.builder.appName("ExplodeExample").getOrCreate()

# 샘플 데이터
data = [
    ("Tom", {"Salary": "£5000", "Bonus": "£0"}),
    ("Dick", {"Salary": "£2690", "Bonus": None}),
    ("Harry", {"Salary": "£45000", "Bonus": "£20000"})
]

# DataFrame 생성
df = spark.createDataFrame(data, ["Name", "Remuneration"])

# 원본 DataFrame 보기
df.show(truncate=False)



+-------+-----------------------------------+
|Name   |Remuneration                       |
+-------+-----------------------------------+
|Tom    |{Salary -> £5000, Bonus -> £0}     |
|Dick   |{Salary -> £2690, Bonus -> null}   |
|Harry  |{Salary -> £45000, Bonus -> £20000}|
+-------+-----------------------------------+
```

<div class="content-ad"></div>

explode 함수를 적용하면 키-값 쌍이 개별 레코드로 분할됩니다. 이전 예제와 마찬가지로, 이렇게 하면 더 나은 구성이 가능하여 추가 분석이 용이해집니다.

```js
remuneration_exploded = df.select(
    col("Name"),
    explode(col("Remuneration")).alias("key", "value")
)

# 변환된 DataFrame 표시
remuneration_exploded.show(truncate=False)


+-------+------+-------+
| Name  | key  | value |
+-------+------+-------+
|Tom    |Salary|£5000  |
|Tom    |Bonus |   £0  |
|Dick   |Salary|£2690  |
|Dick   |Bonus | null  |
|Harry  |Salary|£45000 |
|Harry  |Bonus |£20000 |
+-------+------+-------+
```

조금 더 복잡한 예제로 마무리해 보겠습니다. 다음과 같은 PySpark 데이터프레임이 있다고 가정해 봅시다.

```js
+----+-----------+-----------+
|col1|     col2  |     col3  |
+----+-----------+-----------+
| a  | [1, 2, 3] | [4, 5, 6] |
+----+-----------+-----------+
```

<div class="content-ad"></div>

그리고 우리는 다음과 같은 출력을 얻고 싶습니다.

```js
+------+-----+-------+
|col1  |col2  |col3  |
+------+------+------+
|   a  |   1  |   4  |
|   a  |   2  |   5  |
|   a  |   3  |   6  |
+------+------+------+
```

이 작업은 생각보다 어렵습니다. 먼저, 입력 테스트 데이터를 생성해 봅시다.

```js
testData = [('a',[1,2,3],[4,5,6]),]

df = spark.createDataFrame(data=testData, schema=['col1','col2','col3'])
```

<div class="content-ad"></div>

일단 보면 col2와 col3를 각각 터뜨릴 수 있다고 생각할 수 있지만, 여러분은 각 번 열을 번 열 씩만 터뜨릴 수 있다는 것이기 때문에 그렇게 하지 못할 거라고요. 한 번 해보세요, 그러면 제가 무슨 말을 하는지 이해하실 거에요.

```js
df.select("col1", explode("col2").alias("col2"), "col3").select("col1","col2", explode("col3").alias("col3")).show()
```

```js
+----+----+----+
|col1|col2|col3|
+----+----+----+
|   a|   1|   4|
|   a|   1|   5|
|   a|   1|   6|
|   a|   2|   4|
|   a|   2|   5|
|   a|   2|   6|
|   a|   3|   4|
|   a|   3|   5|
|   a|   3|   6|
+----+----+----+
```

흠, 우리가 원하는 것과는 조금 다르네요. 원하는 대로 하려면, PySpark 배열의 경우 Python의 zip 연산과 동일한 작업을 수행하는 중간 단계가 필요합니다. Python zip 연산자는 두 가지 반복 가능한(iterable) 항목을 묶어줍니다. 예를 들어, 만약 우리가 아래와 같은 것이 있었다면,

<div class="content-ad"></div>

```js
numbers = [1, 2, 3]

letters = ['a', 'b', 'c']

zipped = zip(numbers, letters)

print(list(zipped))

[(1, 'a'), (2, 'b'), (3, 'c')]
```

Arrays의 동등한 명령어는 arrays_zip이라고 부르기 쉽습니다. 그래서 먼저 그것을 사용하여 배열을 "짜맞추고", 그런 다음 폭파해야 합니다. Pyspark SQL이나 데이터프레임 작업을 사용하여 구현할 수 있습니다. 다음은 SQL에서의 해결 방법입니다.

```js
from pyspark.sql.functions import *

# 입력 데이터의 데이터베이스 테이블 만들기

df.createOrReplaceTempView("test_table")

spark.sql("select col1, tmp.col2, tmp.col3 from (select col1, explode(tmp) as tmp from (select col1, arrays_zip(col2, col3) as tmp from test_table))").show()

+------+------+------+
| col1 | col2 | col3 |
+------+------+------+
|   a  |   1  |   4  |
|   a  |   2  |   5  |
|   a  |   3  |   6  |
+------+------+------+
```

collect_list 함수

<div class="content-ad"></div>

collect_list 함수는 PySpark 데이터프레임 데이터를 레코드 단위로 저장하고 해당 데이터의 컬럼을 컬렉션으로 반환합니다. 이런 면에서, explode 함수의 반대 역할을 합니다. 간단한 예시로 설명드리겠습니다. 만약 다음과 같은 입력 데이터셋이 있다고 가정해봅시다.

```js
testData = (['a'],['b'],['c']) 

df = spark.createDataFrame(data=testData, schema = ['letter_column']) 

df.printSchema() 

df.show() 

+-------------+ 
|letter_column| 
+-------------+ 
|            a| 
|            b| 
|            c| 
+-------------+ 
```

데이터에 collect_list를 적용한 결과는 다음과 같습니다.

```js
from pyspark.sql.functions import collect_list

df.select(collect_list("letter_column").alias("letter_row")).show()

+----------+  
|letter_row|  
+----------+  
| [a, b, c]| 
+----------+ 
```

<div class="content-ad"></div>

보통은 데이터의 한 열만 다루는 것이 아니기 때문에, 좀 더 복잡한 문제를 고려해보면 다음과 같은 PySpark 데이터프레임이 있는 경우가 있습니다. 이는 3일 동안의 가스 및 전기의 도매 가격을 보여주는 데이터입니다.

```js
|연료       |      날짜| 가격| 
|-----------|----------|------| 
|Gas        |2019-10-11|121.56| 
|Gas        |2019-10-10|120.56| 
|Electricity|2019-10-11|100.00| 
|Gas        |2019-10-12|119.56| 
|Electricity|2019-10-10| 99.00| 
|Electricity|2019-10-12|101.00| 
```

다음 형식의 새로운 데이터 세트를 반환하려고 합니다. 중요한 점은 각 연료의 가격이 왼쪽에서 오른쪽으로 날짜 순서대로 나열되어야 한다는 것입니다.

```js
|연료       |Price_hist              |
|-----------|------------------------|
|Electricity|[99.0, 100.0, 101.0]    |
|Gas        |[120.56, 121.56, 119.56]|
```

<div class="content-ad"></div>

우리는 입력 데이터 세트를 만들기 위한 코드를 작성할 것입니다.

```js
data = [
    ("가스", "2019-10-11", 121.56),
    ("가스", "2019-10-10", 120.56),
    ("전기", "2019-10-11", 100.00),
    ("가스", "2019-10-12", 119.56),
    ("전기", "2019-10-10", 99.00),
    ("전기", "2019-10-12", 101.00)
]

# DataFrame 생성
df = spark.createDataFrame(data, ["연료", "날짜", "가격"])

# DataFrame 표시
df.show()
```

이제 코드를 실행하면,

```js
from pyspark.sql.functions import collect_list

df.select("연료", collect_list("가격").alias("가격 이력")).show(truncate=False)
```

<div class="content-ad"></div>

위의 코드를 번역하였습니다.

```js
...
...
AnalysisException: [MISSING_GROUP_BY] 쿼리에 GROUP BY 절이 포함되어 있지 않습니다. GROUP BY를 추가하거나 OVER 절을 사용하여 윈도우 함수로 변환하십시오.;
Aggregate [Fuel#2, collect_list(Price#4, 0, 0) AS Price Hist#22]
+- LogicalRDD [Fuel#2, Date#3, Price#4], false
```

이 부분은 좋지 않아요. 명확히, 연료 이름에 대해 어떤 종류의 그룹화를 수행해야 합니다. 운이 좋게도, collect_list 함수는 실제로 집계 함수이므로 원하는 결과를 얻기 위해 데이터프레임에서 사전 정렬 작업과 함께 agg 및 groupBy 작업을 사용할 수 있습니다. 다음을 실행하면 원하는 결과를 얻을 수 있습니다.

```js
from pyspark.sql.functions import collect_list

# 날짜 순으로 정렬하여 가격을 날짜 순으로 정렬합니다
sorted_df = df.sort("Fuel", "Date")

# 연료별로 그룹화하여 가격을 목록으로 수집합니다
result_df = sorted_df.groupBy("Fuel").agg(collect_list("Price").alias("Price_hist"))

# 결과 DataFrame 표시
result_df.show(truncate=False)
```

<div class="content-ad"></div>

요구하는 출력은 다음과 같습니다.


| Fuel       | Price_hist              |
|------------|-------------------------|
| Electricity| [99.0, 100.0, 101.0]    |
| Gas        | [120.56, 121.56, 119.56]|


## 요약

본 문서에서는 PySpark SQL의 더 이상하고 유용한 데이터 조작 함수 두 가지를 소개했으며, 그들이 귀하에게 어떻게 가치있는지에 대한 사용 사례도 제시했습니다.

<div class="content-ad"></div>

만약 데이터프레임에서 배열이나 사전 데이터 필드를 변환하여 별도 레코드로 넣어야 할 경우 explode 함수를 사용하세요.

collect_list 함수는 explode 함수의 반대로 생각할 수 있습니다. 이를 사용하여 개별 데이터프레임 레코드에서 항목을 컬렉션으로 집계하세요.

이 내용이 마음에 들었다면, 아래 글들도 흥미롭게 보실 수 있을 것 같아요.