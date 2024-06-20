---
title: "2024년을 위한 SQL에서 재귀 CTE 사용 방법 알아야 할 모든 것"
description: ""
coverImage: "/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_0.png"
date: 2024-06-20 15:40
ogImage: 
  url: /assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_0.png
tag: Tech
originalTitle: "How to Use Recursive CTEs in SQL: All You Need To Know in 2024"
link: "https://medium.com/learning-sql/some-of-the-useful-recursive-cte-examples-ddd63bced99a"
---


## 데이터 과학

![이미지](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_0.png)

![이미지](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_1.png)

공통 테이블 표현식인 CTE는 SQL에서 가장 강력하고 널리 사용되는 도구 중 하나입니다!

<div class="content-ad"></div>

CTE(공통 테이블 식)를 사용하면 복잡한 쿼리를 간소화하고 가독성이 좋고 유지보수가 쉬운 SQL 쿼리를 작성할 수 있습니다.

CTE를 사용하면 쿼리 결과에서 임시 테이블을 생성할 수 있습니다. 사실, 복잡한 서브쿼리를 간단한 CTE로 분해할 수도 있어요.

CTE에 대해 더 알아보려면 제 이전 이야기 중 하나를 읽어보세요.

그러나 CTE를 더 강력하게 만드는 것은 계층 데이터를 분석하는 능력입니다. CTE는 재귀를 지원하여 서로 다른 엔티티 간의 관계를 분석하기 위해 자신을 참조할 수 있어요.

<div class="content-ad"></div>

간단한 시나리오로 중첩된 인형 예시를 들어보겠습니다 —

![인형 사진](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_2.png)

세트 안에 몇 개의 인형이 있는지 정확히 알고 싶을 때, 동일한 세트를 계속해서 살펴봐야 하며 가장 작은 인형을 찾아야 합니다. 가장 작은 인형은 내부에 더 작은 인형이 없는 인형으로, 이것이 세트 내 인형 수를 세는 중단 조건이 됩니다.

재귀 공통 테이블 표현식(CTE)은 정확히 동일한 논리를 따르며 여러 레이어가 서로 아래에 존재하는 데이터 집합을 탐색하는 데 도움을 줍니다. 재귀 CTE의 각 반복에서는 특정 중단 조건을 만날 때까지 데이터 구조의 한 수준을 탐색합니다.

<div class="content-ad"></div>

현실에서는 소셜 미디어 네트워크(예: 페이스북의 친구 목록), 슬랙의 채팅 스레드, 회사의 직원 구조(고위 경영진부터 개별 직원까지)와 같은 계층적 데이터 유형을 볼 수 있습니다. 재귀 CTE는 이러한 데이터를 다룰 때 매우 유용할 수 있습니다.

# 재귀 CTE의 기본 사항

모든 재귀 CTE에는 두 가지 주요 부분이 포함됩니다 —

- 앵커 부분 — 주 쿼리 또는 초기 쿼리라고 할 수 있습니다. 따라서 재귀 부분에서 참조할 수 있는 시작점입니다.
- 재귀 부분 — 재귀 CTE의 두 번째 부분으로, 앵커 부분을 참조하고 일정 조건을 충족하는 한 반복적으로 실행됩니다. 따라서 한 번 반복의 결과가 다음 반복의 입력으로 사용됩니다.

<div class="content-ad"></div>

위의 두 가지 기본 내용을 처음에 이해하지 못해도 전혀 괜찮아요!

다음 두 사용 사례를 탐험하면서 예제로 설명해드릴 거예요. 이 두 가지 사용 사례에서 재귀 CTE를 사용할 수 있어요.

# 계층적 데이터 다루기

계층 데이터는 이름에서 알 수 있듯이 트리 형식이거나 부모-자식 관계로 구성된 데이터를 포함하고 있어요.

<div class="content-ad"></div>

기관에서는 관리자 - 직원 또는 폴더 - 하위 폴더 구조와 같은 데이터 유형을 일반적으로 관찰할 수 있습니다.

따라서 계층 구조에서 항목은 그 아래에 있는 모든 다른 항목의 '상위 항목'입니다.

재귀 공통 테이블 식(CTE)은 이러한 종류의 데이터에서 통찰력을 얻는 데 매우 유용할 수 있습니다. 자기 자신을 참조하는 CTE를 활용하여 전체 계층 구조를 검색할 수 있습니다.

이 개념을 이해하는 데 가장 좋은 예시를 살펴보겠습니다. 조직적인 계층 구조의 매우 흔한 예시를 살펴보죠.

<div class="content-ad"></div>

아래 표에 표시된 대로 직원 테이블을 가지고 있고 각 목록이 관리자부터 직원까지의 경로를 나타내는 쉼표로 구분된 목록을 얻고 싶다고 가정해보세요.

![Employee Table](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_3.png)

다음 쿼리를 사용하여 이 입력 데이터를 다시 생성할 수 있습니다.

MySQL Workbench에 있는 analyticswithsuraj는 스키마 이름입니다. 여러분의 스키마로 대체할 수 있습니다.

<div class="content-ad"></div>

```js
DROP TABLE IF EXISTS analyticswithsuraj.employee;
CREATE TABLE analyticswithsuraj.employee (
    EmployeeID VARCHAR(10),
    EmployeeName VARCHAR(50),
    ManagerID VARCHAR(10)
);

-- Insert sample data
INSERT INTO analyticswithsuraj.employee VALUES (1, 'John', NULL);
INSERT INTO analyticswithsuraj.employee VALUES (2, 'Jane', 1);
INSERT INTO analyticswithsuraj.employee VALUES (3, 'Bob', 1);
INSERT INTO analyticswithsuraj.employee VALUES (4, 'Alice', 2);
INSERT INTO analyticswithsuraj.employee VALUES (5, 'Charlie', 2);
INSERT INTO analyticswithsuraj.employee VALUES (6, 'David', 3);
INSERT INTO analyticswithsuraj.employee VALUES (7, 'Eva', 3);
```

문제에 돌아가서... 완전한 해결책을 보여드릴게요. 그리고 그 후에 설명을 따라 읽어볼게요.

```js
WITH RECURSIVE RecursiveCTE AS (
    SELECT
        EmployeeID,
        EmployeeName,
        ManagerID,
        EmployeeName AS Path -- 초기 경로는 직원의 ID입니다
    FROM
        analyticswithsuraj.employee
    WHERE
        ManagerID IS NULL -- 앵커 부분

    UNION ALL

    SELECT
        e.EmployeeID,
        e.EmployeeName,
        e.ManagerID,
        concat_ws(',', rc.Path, e.EmployeeName) AS Path
    FROM
        analyticswithsuraj.employee e
    JOIN
        RecursiveCTE rc ON e.ManagerID = rc.EmployeeID -- 재귀 부분
)
```

MySQL Workbench에서 재귀 CTE를 작성하려면 CTE 이름 앞에 RECURSIVE 키워드를 입력해야 합니다.


<div class="content-ad"></div>

Caveat: 재귀 CTE의 기본 개념을 읽으신다면, 솔루션은 두 부분으로 이뤄져야 합니다.

첫 번째는 시작점인 앵커 부분입니다. 재귀 쿼리에서 참조할 수 있는 시작점으로, 아래와 같이 간단한 SELECT 문으로 표현됩니다.

```js
    SELECT
        EmployeeID,
        EmployeeName,
        ManagerID,
        EmployeeName AS Path -- 초기 경로는 직원의 ID만 포함합니다
    FROM
        analyticswithsuraj.employee
    WHERE
        ManagerID IS NULL -- 앵커 부분
```

여기서는 직원의 전체 계층 구조를 저장할 추가적인 Path 열을 생성합니다.

<div class="content-ad"></div>

이 앵커 쿼리는 항상 ManagerID가 NULL 인 직원만 포함합니다. 즉, 그들 위에 매니저가 없는 직원만을 선택합니다.

재귀 CTE의 두 번째 부분은 재귀 부분으로, 직원 이름을 선택하고 Path 열의 값을 업데이트하여 아래와 같이 쉼표로 구분된 경로를 만듭니다.

```js
    UNION ALL

    SELECT
        e.EmployeeID,
        e.EmployeeName,
        e.ManagerID,
        concat_ws(', ', rc.Path, e.EmployeeName) AS Path
    FROM
        analyticswithsuraj.employee e
    JOIN
        RecursiveCTE rc ON e.ManagerID = rc.EmployeeID -- Recursive part
```

보시다시피 이 재귀 부분은 원래의 직원 테이블에서 데이터를 조회하고 안에 쓰여진 CTE와 조인합니다.

<div class="content-ad"></div>

UNION ALL은 앵커 쿼리와 순환 쿼리의 결과를 결합하는 데 사용됩니다.

최종적으로는 이 순환 CTE를 간단한 SELECT 문으로 쿼리할 수 있습니다.

```js
SELECT
    EmployeeID,
    EmployeeName,
    ManagerID,
    Path
FROM
    RecursiveCTE;
```

![이미지](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_4.png)

<div class="content-ad"></div>

결과적으로 각 레코드마다 직원의 완전한 계층 구조를 볼 수 있습니다. 여기에는 John이 최종 관리자로 나타나며 그의 상사가 없는 것을 나타내고, Jane과 Bob이 그의 직속 보고자들이라는 것을 보여줍니다.

입력 테이블에서 4번째 레코드에서 Jane이 Alice의 관리자이고 John이 Jane의 관리자인 것을 볼 수 있으므로 Alice의 전체 계층은 'John, Jane, Alice'입니다.

그러나 데이터는 단순한 계층보다 복잡할 수 있습니다. Facebook 친구 목록이나 다른 소셜 네트워킹 데이터와 같이 요롯한 경우도 있습니다. 재귀 CTE가 어떻게 활용될 수 있는지 살펴보겠습니다.

# 네트워크 데이터 처리하기

<div class="content-ad"></div>

네트워크 데이터는 이름에서 알 수 있듯이 사물, 엔티티 및 사람들의 네트워크에 대한 것입니다. 아래 그림에서 보이는 것처럼 네트워크 데이터를 노드(블록)와 노드를 연결하는 엣지(선)로 시각화할 수 있습니다.

![그림](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_5.png)

노드는 사용자 또는 엔티티를 나타내며, 엣지는 그들 사이의 관계를 나타냅니다.

간단히 말해서, 두 노드 사이에 엣지(선)가 있다면, 두 노드는 직접적으로 서로 연결되어있다는 것을 의미합니다.

<div class="content-ad"></div>

아래는 테이블 `network_connections`에 표시된 11명의 친구들 중 파올로와 연결된 사람들을 분석하고 있습니다. 파올로의 친구와 친구의 친구들을 파악하고 싶습니다.

```js
DROP TABLE IF EXISTS alldata.network_connections;
CREATE TABLE alldata.network_connections (
    source_node VARCHAR(50),
    target_node VARCHAR(50)
);

INSERT INTO alldata.network_connections (source_node, target_node) VALUES
('Paolo', 'David'),
('Paolo', 'Anna'),
('David', 'Mark'),
('Anna', 'Peter'),
('Samar', 'Patrik'),
('Mark', 'Vivan'),
('Patrik', 'Maya'),
('Julia', 'Robert');
```

<div class="content-ad"></div>

알다타는 MySQL Workbench에서의 스키마 이름입니다. 이를 여러분의 스키마 이름으로 바꿔 사용하실 수 있습니다.

이전 계층 데이터의 예제에서 이미 앵커 부분과 재귀 부분을 설명했으니, 여기서 바로 솔루션으로 넘어가겠습니다.

```js
WITH RECURSIVE NetworkCTE AS (
    -- 시작 노드를 선택하는 앵커 부분
    SELECT source_node,
            target_node
    FROM network_connections
    WHERE source_node = 'Paolo' -- 다른 사람의 네트워크를 보려면 여기를 변경하세요
    
    UNION ALL
    
    -- 연결된 노드를 선택하는 재귀 부분
    SELECT nc.source_node,
            nc.target_node
    FROM network_connections nc
    JOIN NetworkCTE n ON nc.source_node = n.target_node
)

SELECT * FROM NetworkCTE;
```

코드에서 설명한 대로, 앵커 부분은 먼저 모든 레코드를 가져와 Paolo를 소스 노드로 하는 것 즉, Paolo의 직접적인 친구들을 모두 가져옵니다. 반면 재귀 부분은 Paolo의 친구의 친구를 모두 가져옵니다.

<div class="content-ad"></div>

그래서 Paolo의 네트워크를 최종적으로 다음과 같이 볼 수 있습니다.

![image](/assets/img/2024-06-20-HowtoUseRecursiveCTEsinSQLAllYouNeedToKnowin2024_7.png)

네트워크 데이터 분석의 다른 사용 사례들은 공급망 산업에서 서로 다른 개체간의 의존 관계를 분석하거나 재무 거래 분석에 계정을 통해 자금 이동을 추적하는 데 사용될 수 있습니다.

더 많은 재귀 CTE를 효과적으로 사용할 수 있는 예시가 있다면 댓글에 언급하지 않을래요?

<div class="content-ad"></div>

이 글이 유용하고 정보가 풍부하게 느껴졌으면 좋겠어요!

공통 테이블 표현식(CTE)은 SQL에서 널리 사용되며 재귀 CTE는 특수한 경우입니다. 이 간편한 글에서 재귀 CTE를 사용하여 계층적 및 네트워크 데이터를 다루는 방법을 알아보았어요.

여기서 실제 예시를 통해 배운 것처럼, 특정 시나리오에서 SQL에서 재귀 CTE가 게임 체인저가 될 수 있다는 점을 알게 되었어요. 동일한 내용에 대한 다른 통찰이 있으면 댓글로 자유롭게 공유해주시기 바랍니다!

💡 저를 팔로우하고 제 이메일 목록에 가입하여 데이터 과학, SQL, Python 및 취업 검색 팁에 관한 다른 글을 더 이상 놓치지 않도록 해보세요!

<div class="content-ad"></div>

읽어 주셔서 감사합니다!