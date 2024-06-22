---
title: "Spark 심화 학습 Delta 테이블에서 Z-Ordering과 Data Skipping 사용법"
description: ""
coverImage: "/assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_0.png"
date: 2024-06-22 17:20
ogImage: 
  url: /assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_0.png
tag: Tech
originalTitle: "Spark-Beyond Basics: Z-Ordering and Data Skipping in Delta Tables"
link: "https://medium.com/@kohaleavin/spark-beyond-basics-z-ordering-and-data-skipping-in-delta-tables-44102282585c"
---


<img src="/assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_0.png" />

만약 스파크가 말할 수 있다면, 데이터 엔지니어들에 대해 말할 것이고 그들을 우울하게 만들고 예측할 수 있는 미래에 불안감을 주게 될 거에요! 🫢😬

말이지, 이런 데이터 엔지니어들 (내 자신을 포함해서 👀)은 스파크가 문제를 해결할 수 있다고 가정하는데 그들은 해결하지 못해서 불안해해요 (안 코딩해도 돼서 말이지… 내가 말하는 건 나의 경우에요🙈).

하지만 스파크는 실제로 문제를 해결해 주거든요! 그 중 하나는 Z-Ordering을 적용하여 쿼리 실행 속도를 10-12배 빠르게 하는 문제를 해결하는 거에요.

<div class="content-ad"></div>

# Z-Ordering

하루에 "n" 번 쿼리되는 델타 테이블이 있다고 해보죠. 이 쿼리들은 실행될 때마다 특정 열을 기준으로 필터링됩니다. 🤔

Spark은 이미 적절한 파티션 수를 얻기 위해 적응형 쿼리 최적화 (AQE)를 사용하고 있으며, 이를 통해 쿼리의 성능을 높이기 위해 프레디케이트 푸시다운을 수행합니다.

하지만 스파크는 여전히 최고 조절에 이르지 않았습니다! 우리는 스파크가 자신의 능력을 발휘할 수 있도록 도와주어야 합니다😤! 특정 열에 필터를 적용할 것이라는 점은 이미 알고 있기 때문에, 해당 열에 Z-Ordering을 활성화할 수 있습니다 🤨

<div class="content-ad"></div>

컬럼에서 Z-Ordering을 활성화하면 다음과 같은 효과가 있습니다:

- 지정된 열을 기준으로 테이블을 재분할합니다.
- 지정된 열을 기준으로 파티션 내에서 정렬됩니다.

더 잘 이해하기 위해 예시를 살펴보겠습니다: 🤓

## 시나리오

<div class="content-ad"></div>

한 가지 흥미로운 "이름" 열을 제외한 몇 가지 흥미없는 열을 포함한 델타 테이블을 생각해보세요. 이미 Spark의 AQE 이후 최적화된 파티션이 4개 있습니다.

![이미지](/assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_1.png)

- 해당 쿼리를 테이블에서 실행하자마자, Spark는 델타 트랜잭션 로그의 최소-최대 값들을 확인하고 "필요한 데이터가 이 파일에 포함되어 있는가"라고 물을 것입니다. 🧐
- 따라서 Spark는 처음 3개 파티션을 확인하지만, "Dan"보다 더 작은 이름은 없기 때문에 마지막 파티션을 확인하지 않을 것입니다. 이것이 바로 데이터 스킵(Data Skipping)이라고 합니다. 😲

![이미지](/assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_2.png)

<div class="content-ad"></div>

- 그러나 이러한 종류의 데이터 스킵은 'Name' 열에 대해 최적화되지 않았기 때문에 불규칙한 데이터 스킵이라고 할 수 있습니다.
- 'Name' 열에 Z-Order를 적용해보고 무슨 일이 일어나는지 확인해 봅시다! ✨

![image](/assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_3.png)

![image](/assets/img/2024-06-22-Spark-BeyondBasicsZ-OrderingandDataSkippinginDeltaTables_4.png)

- 이제 위의 쿼리를 실행하면 Spark는 첫 번째 파티션만 확인하므로 데이터 스킵을 완벽하게 수행합니다. 😉

<div class="content-ad"></div>

## Z-Ordering 구문:

데이터의 Z-Ordering을 하려면 ZORDER BY 절에 정렬할 열을 지정합니다.

```js
OPTIMIZE table_name ZORDER BY column_name
```

## Z-Ordering의 이점:

<div class="content-ad"></div>

- Z-ordering은 상당한 속도 향상을 가져올 수 있으며, 쿼리 실행 시간을 분 단위에서 초 단위로 줄일 수 있어요🤯
- 작업 태스크를 실행하는 스파크 워커 노드의 코어에서 균형을 유지하는 적절한 파티션 수⚖️

## Z-Ordering과 관련된 도전:

- 파티션 열을 선택하는 과정은 복잡합니다 🥴
- Z-Ordering 작업은 비용이 많이 발생하며 더 오래 걸린다는 것을 염두에 두세요 ⏱️
- Z-Ordering이 활성화된 테이블에서 동시적인 쓰기는 불가능합니다

혜택과 도전을 따져보시면, 사용할지 말지 고민이 될 거예요. 😵‍💫

<div class="content-ad"></div>

데이타브릭스도 이러한 딜레마를 느꼈고, 그들은 최첨단 솔루션을 개발했어요: 리퀴드 클러스터링 🥂

다음 블로그에서 리퀴드 클러스터링에 대해 다뤄볼 예정이에요, 기대해주세요!

만약 블로그가 마음에 들었다면 👏 손뼉을 치셔서 이 내용이 모든 데이터 엔지니어에게 전달되도록 해주세요.

읽어 주셔서 감사합니다! 😁