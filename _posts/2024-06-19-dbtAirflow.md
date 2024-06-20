---
title: "DBT  Airflow  "
description: ""
coverImage: "/assets/img/2024-06-19-dbtAirflow_0.png"
date: 2024-06-19 09:45
ogImage: 
  url: /assets/img/2024-06-19-dbtAirflow_0.png
tag: Tech
originalTitle: "dbt + Airflow = ❤"
link: "https://medium.com/plum-fintech/dbt-airflow-50b2c93f91cc"
---


![image](/assets/img/2024-06-19-dbtAirflow_0.png)

요즘의 동적이고 경쟁적인 환경에서 기업은 데이터 기반 의사결정에 크게 의존하고 있습니다. 이를 실현하기 위해 조직은 믿을 수 있는 견고한 데이터 플랫폼과 고품질 데이터가 필요합니다. 이는 데이터를 효과적으로 수집하고 저장하는 시스템뿐만 아니라 데이터의 정확성과 신뢰성을 보장하는 것을 의미합니다.

수백 개 또는 수천 개의 데이터 모델을 관리하는 것은 항상 간단한 과정은 아닙니다. 데이터 팀은 종종 데이터 자산을 효과적으로 구축, 테스트 및 유지하는 데 고민합니다. 플럼에서는 데이터 빌드 도구(dbt)를 활용하여 데이터 모델을 효과적으로 관리할 수 있는 CLI 도구에 의존합니다.

그러나 dbt는 명령줄 인터페이스의 특성 때문에 도전적인 요소를 가지고 있습니다. 그렇다면, 제품 환경에 배포할 때 dbt의 장점을 팀이 어떻게 활용할 수 있을까요?

<div class="content-ad"></div>

dbt Cloud가 당연한 선택처럼 보일 수 있지만, 모든 팀 또는 회사가 이 제품에 투자하기에 준비되어 있는 것은 아닙니다. 이러한 상황에서는 dbt 모델의 실행을 조율하고 그 사이의 종속성을 유지하는 대체 방법이 필요합니다.

# 왜 자체 통합을 구축하기로 투자했는가

dbt Cloud에 필요한 투자 외에도, 우리 팀은 특정 기능을 지원받길 원했습니다. 그러나 당시에는 플랫폼에서 이러한 기능 중 일부만 지원되었습니다. 아래에서 가장 기본적인 것들을 개요하겠습니다.

![2024-06-19-dbtAirflow_1.png](/assets/img/2024-06-19-dbtAirflow_1.png)

<div class="content-ad"></div>

- dbt 프로젝트 일정 설정: 우리는 dbt 프로젝트를 cron 작업 스타일로 일정을 잡고, 특정 시간 간격을 지정합니다.
- 작업 세분화: 각 dbt 엔티티(모델, 테스트, 시드, 스냅샷을 포함)는 개별적으로 처리되어 필요한 경우에 개별적으로 트리거될 수 있도록 합니다.
- dbt 의존성 유지: 또한, dbt 엔티티 간의 종속성을 유지해야 합니다. 예를 들어, 모델 A가 테스트를 포함하여 다른 모델 B의 상위 의존성으로 작용하는 경우 실행 순서를 유지해야 합니다.

```js
[dbt run A] -> [dbt test A] -> [dbt run B]
```

4. 다른 워크플로우 트리거: 특정 dbt 엔티티의 성공적인 완료 후에 특정 워크플로우를 시작해야 하며, 전체 dbt 프로젝트가 완료될 필요가 없는 경우가 있습니다. 또한, 두 dbt 엔티티 실행 사이에 특정 워크플로우를 시작해야할 경우가 있을 수 있습니다.

```js
[dbt run A] -> [dbt와 무관한 워크플로우 실행] -> [dbt run B]
```

<div class="content-ad"></div>

5. 알림: 문제가 발생했을 때, 슬랙으로 알림을 받아야 합니다.

6. 컨테이너화된 dbt 프로젝트 실행: 각각의 dbt 프로젝트는 자체 Docker 이미지를 가져야 합니다. 필요시 다른 dbt 버전에서 실행할 수 있는 유연성을 제공합니다.

7. 모델 하위 집합 트리거링: dbt 엔티티는 dbt 태그를 기반으로 필터링될 수 있어서 필요한 특정 모델 그룹을 실행할 수 있습니다.

8. 여러 일정 생성: 동일한 프로젝트를 서로 다른 일정으로 실행해야 할 수도 있습니다. 이는 모델 하위 집합을 트리거할 필요와 밀접하게 관려이 있습니다. 예를 들어, 모델을 시간별, 일별, 주간별로 태그 지정하여 해당 일정에 맞춰 실행할 수 있습니다.

<div class="content-ad"></div>

다양한 대안을 탐색해 본 결과, 천문학자가 개발한 Cosmos 패키지를 포함해 어떤 것도 당시의 우리 사용 사례와 명확한 요구 사항에 적합하다는 것을 입증하지 못했습니다.

이러한 도전에 직면하자, 우리는 우리의 요구에 맞게 제작된 자체 Python 패키지를 개발하기로 전략적인 결정을 내렸습니다. 이 맞춤형 솔루션은 우리에게 dbt와 Airflow를 원활하게 통합할 수 있는 유연성과 기능이 제공되어, 데이터 팀이 효과적으로 데이터 모델을 관리하고 최적화할 수 있게 해줍니다.

# 왜 Airflow를 선택했나요?

데이터 파이프라인 Orchestration 전략을 설계할 때, 우리는 특정 간격(시간별, 일별 또는 주별)으로 작업을 예약하고 관리할 수 있는 능력을 지향했습니다. 팀이 Airflow 및 Google Cloud의 Cloud Composer 서비스에 익숙하고 기존 인프라가 있었기 때문에 Airflow를 선택하는 것이 우리의 요구에 적합한 자연스러운 선택이었습니다.

<div class="content-ad"></div>

또한 Airflow와 dbt는 Directed Acyclic Graphs (DAGs) 개념을 중심으로 하고 있어, dbt DAGs를 Airflow DAGs로 변환하여 Orchestration(오케스트레이션)할 수 있습니다.

DAGs는 노드가 닫힌 순환 루프를 형성하지 않고 방향성을 가지고 연결된 작업 또는 데이터 모델을 나타내는 그래프입니다. dbt에서 DAGs는 데이터 모델 간의 관계와 종속성을 나타내고, Airflow에서는 DAGs는 데이터 파이프라인에 포함된 단계와 종속성을 시각화합니다.

# 0부터 1까지: Cloud Composer에서 dbt 실행하기

이 초기 단계에서 우리의 작업은 상대적으로 간단했습니다: Airflow를 사용하여 dbt 프로젝트를 실행하고 테스트하되, 각 모델, 테스트, 스냅샷 또는 시드를 개별 작업으로 설정할 필요가 없었습니다.

<div class="content-ad"></div>

필요한 것은 GitHub Actions를 사용하여 CI/CD 파이프라인을 설정하는 것이었습니다. 이 파이프라인은 관련된 dbt 프로젝트를 Cloud Composer 버킷으로 복사하고 Airflow 내에서 DAG를 구성합니다. 이 DAG에는 모델을 실행하는 하나의 작업 및 해당 작업을 테스트하는 다른 작업이 포함됩니다.

![2024-06-19-dbtAirflow_2](/assets/img/2024-06-19-dbtAirflow_2.png)

이것은 Airflow에서 dbt 프로젝트를 실행하는 가장 간단한 방법일 수 있습니다. DAG는 BashOperator로 생성된 두 개의 작업으로 구성됩니다. 기본적으로, 이는 로컬에서 dbt run 및 dbt test 명령을 실행하는 dbt CLI를 사용한 프로세스를 반영합니다.

그러나 이 방법에는 여러 가지 제약이 있습니다:

<div class="content-ad"></div>

- 만약에 dbt_run 작업 내에서 모델 실행이 실패한다면, 문제를 해결하기 위해 작업을 다시 실행해야 합니다. 이는 이전에 성공했던 모델들을 포함하여 모든 모델을 다시 실행해야 하므로 실행 시간과 비용이 증가하는 것을 의미합니다.
- 모델 실행과 테스트는 완전히 독립적입니다. 모든 테스트는 워크플로우의 끝에 실행됩니다. 따라서 다른 모델들의 상위 종속성인 모델들에서 문제가 발생할 경우 너무 늦기 전까지 알아차리지 못할 수 있습니다.
- 만약에 dbt_test 작업에서 모델 테스트가 실패한다면, 이 문제를 해결하기 위해 영향을 받는 모든 모델을 수정하기 위해 dbt_run과 dbt_test 작업을 검토하고 재실행해야 합니다.
- Airflow 작업은 BashOperator를 사용하여 생성되며, Airflow 환경에 dbt 패키지 의존성이 설치되어 있어야 합니다. 이는 패키지 버전 호환성 문제로 인해 문제가 될 수 있으며, 특히 GCP의 Cloud Composer나 AWS의 MWAA와 같은 관리형 Airflow 서비스에서 더욱 그렇습니다.

이 초기 시도는 Proof-of-Concept(PoC)로서의 느낌이 더 큰 노력입니다. 제한사항과 확장성 부족에도 불구하고, 팀의 기대에 부합하는 해결책을 개발할 자신감을 제공했습니다.

우리의 다음 과제는 dbt 프로젝트를 Airflow DAG로 변환하여 각 dbt 엔티티가 해당하는 Airflow 작업으로 매핑되고 모든 종속성이 유지되도록 하는 것이었습니다.

# dbt-airflow 빌딩

<div class="content-ad"></div>

dbt DAG를 Airflow DAG로 변환하기 위해 첫 번째 작업은 dbt 엔터티에서 의존성을 추출하는 것이었습니다. 이는 데이터 모델 간의 관계를 구문 분석하고 DAG 내의 Airflow 작업에 매핑하는 것을 포함했습니다.

dbt 의존성을 Airflow 작업으로 표현함으로써 데이터 워크플로를 원활하게 조정할 수 있었습니다. 작업(예: 모델 실행 또는 테스트)이 실패하면 분석가와 분석 엔지니어는 DAG의 나머지 부분을 해제하기 위해 기초 모델 문제에 대처해야 했습니다.

이 접근 방식은 처음에는 방해적으로 보일 수 있지만, 물론 목표는 신뢰할 수 없는 데이터로 모델을 구축하는 것이 아닙니다. 그러나 초기 오류 감지는 우리 설계의 중요한 측면이었습니다. 이렇게 함으로써 비용을 최소화하고 계산 속도를 절약하며 데이터에 대한 신뢰를 유지할 수 있었습니다.

## 반복 1: manifest.json 파일 활용

<div class="content-ad"></div>

첫 번째 반복에서는 dbt가 생성한 manifest.json 파일을 읽는 파서를 개발했습니다. 이 메타데이터 파일은 dbt가 실행, 테스트 및 컴파일 중에 생성됩니다.

이 파일의 내용을 사용하여 모든 dbt 엔티티와 해당 의존성을 추출할 수 있었습니다. 이 이정표는 dbt-airflow shaping의 탄생을 알리는 중요한 순간이었습니다.

첫 릴리스는 manifest.json 파일에서 프로젝트를 읽고 모델 의존성을 추출하여 Airflow DAG 내의 TaskGroup으로 변환하는 능력을 갖추었습니다.

이제 특정 작업이 실패할 때와 같이, 하류 의존성은 누군가 기본 문제를 해결할 때까지 일시 중지되어 DAG의 나머지 부분이 차단 해제됩니다.

<div class="content-ad"></div>

이 방법을 통해 문제가 발생했을 때 전체 모델 또는 테스트 세트를 다시 실행할 필요가 없어졌어요. 결과적으로, 이 전략은 Airflow에서 실행되는 dbt 프로젝트의 실행 및 유지에 관련된 비용을 크게 줄였어요.

초기 Airflow DAG는 다음과 같았어요;

```js
import functools
from datetime import datetime 
from datetime import timedelta
from pathlib import Path

from airflow import DAG
from airflow.operators.empty import EmptyOperator
from airflow.operators.python import PythonOperator
from dbt_airflow.core.config import DbtAirflowConfig
from dbt_airflow.core.config import DbtProfileConfig
from dbt_airflow.core.config import DbtProjectConfig
from dbt_airflow.core.task_group import DbtTaskGroup
from dbt_airflow.operators.execution import ExecutionOperator


with DAG(
    dag_id='test_dag',
    start_date=datetime(2021, 1, 1),
    catchup=False,
    tags=['example'],
    default_args={
        'owner': 'airflow',
        'retries': 1,
        'retry_delay': timedelta(minutes=2),
        },
    on_failure_callback=functools.partial(
        our_callback_function_to_send_slack_alerts
    ),
) as dag:

    t1 = EmptyOperator(task_id='extract')
    t2 = EmptyOperator(task_id='load')

    tg = DbtTaskGroup(
        group_id='transform',
        dbt_project_config=DbtProjectConfig(
            project_path=Path('/path/to/example_dbt_project/'),
            manifest_path=Path('/path/to/example_dbt_project/target/manifest.json'),
        ),
        dbt_profile_config=DbtProfileConfig(
            profiles_path=Path('/path/to/example_dbt_project/profiles'),
            target='dev',
        ),
        dbt_airflow_config=DbtAirflowConfig(
            execution_operator=ExecutionOperator.BASH,
        ),
    )

    t1 >> t2 >> tg
```

프로젝트를 Cloud Composer에 배포하는 관점에서 이번 반복에서는 아무런 변경 사항이 없었어요.

<div class="content-ad"></div>


![Screenshot 1](/assets/img/2024-06-19-dbtAirflow_3.png)

By the end of this first iteration, we were able to meet half of the requirements we specified during ideation:

![Screenshot 2](/assets/img/2024-06-19-dbtAirflow_4.png)

## Iteration 2: Introducing Extra Tasks


<div class="content-ad"></div>

이번 반복에서는 초기 설계의 핵심 측면으로 초점을 옮겼습니다: 기존 모든 모델을 Airflow로 원활하게 마이그레이션할 수 있는 능력입니다.

Machine Learning 워크플로우를 모델 실행 사이에 통합하여 하향 모델이 필요로 하는 데이터를 생성할 수 있도록 목표를 설정했습니다. 이 접근은 결과적으로 강하게 결합된 시스템을 만들어 내어 최선의 방법에 부합하지 않을 수 있지만, 이는 당시 실행 흐름을 대표했습니다. dbt-airflow가 이 흐름을 재현할 수 있도록 보장하는 것이 우선이었고, 이러한 구성 요소를 분리하는 구조 변경을 고려하기 전에 기술적 부채에 대한 대응은 그때의 주요 초점이 아니었습니다.

그러나 이것은 다른 작업을 가속화할 수 있는 가치 있는 기능이었습니다. 예를 들어, 특정 dbt 모델에서 데이터에 의존하는 워크플로우는 해당 모델이 완료된 직후에 즉시 트리거될 수 있었고, 전체 DAG가 완료될 때까지 기다릴 필요가 없었습니다.

기술적으로는 관심있는 dbt 프로젝트를 구문 분석한 후 생성된 Airflow 작업 이후에 Airflow Operator를 도입하려고 했습니다. 이를 달성하기 위해 Extra Task의 상위 또는 하위 작업을 명시해야 했습니다.

<div class="content-ad"></div>

'Extra Tasks'를 표현하기 위해 우리는 ExtraTask라는 객체를 개발했습니다. 이 객체는 렌더링된 dbt 프로젝트 내에서 이러한 작업을 소개하는 데 활용될 수 있습니다.

```js
from airflow.operators.python import PythonOperator
from dbt_airflow.core.task import ExtraTask


ExtraTask(
    task_id='test_task',
    operator=PythonOperator,
    operator_args={
        'python_callable': lambda: print('Hello world'),
    },
    upstream_task_ids={
        'model.example_dbt_project.int_customers_per_store',
        'model.example_dbt_project.int_revenue_by_date',
    },
)
```

다음은 dbt-airflow의 Extra Task 기능을 활용하여 유명한 Sakila 프로젝트를 사용하여 생성된 더미 dbt 프로젝트를 렌더링하고 실행하는 예시 DAG입니다.

```js
import functools
from datetime import datetime
from datetime import timedelta
from pathlib import Path

from airflow import DAG
from airflow.operators.empty import EmptyOperator
from airflow.operators.python import PythonOperator
from dbt_airflow.core.config import DbtAirflowConfig
from dbt_airflow.core.config import DbtProfileConfig
from dbt_airflow.core.config import DbtProjectConfig
from dbt_airflow.core.task import ExtraTask
from dbt_airflow.core.task_group import DbtTaskGroup
from dbt_airflow.operators.execution import ExecutionOperator


with DAG(
    dag_id='test_dag',
    start_date=datetime(2021, 1, 1),
    catchup=False,
    tags=['example'],
    default_args={
        'owner': 'airflow',
        'retries': 1,
        'retry_delay': timedelta(minutes=2),
    },
    'on_failure_callback': functools.partial(
        our_callback_function_to_send_slack_alerts
    ),
) as dag:

    t1 = EmptyOperator(task_id='extract')
    t2 = EmptyOperator(task_id='load')

    extra_tasks = [
        ExtraTask(
            task_id='test_task',
            operator=PythonOperator,
            operator_args={
                'python_callable': lambda: print('Hello world'),
            },
            upstream_task_ids={
                'model.example_dbt_project.int_customers_per_store',
                'model.example_dbt_project.int_revenue_by_date',
            },
        ),
        ExtraTask(
            task_id='another_test_task',
            operator=PythonOperator,
            operator_args={
                'python_callable': lambda: print('Hello world 2!'),
            },
            upstream_task_ids={
                'test.example_dbt_project.int_customers_per_store',
            },
            downstream_task_ids={
                'snapshot.example_dbt_project.int_customers_per_store_snapshot',
            },
        ),
        ExtraTask(
            task_id='test_task_3',
            operator=PythonOperator,
            operator_args={
                'python_callable': lambda: print('Hello world 3!'),
            },
            downstream_task_ids={
                'snapshot.example_dbt_project.int_customers_per_store_snapshot',
            },
            upstream_task_ids={
                'model.example_dbt_project.int_revenue_by_date',
            },
        )
    ]

    tg = DbtTaskGroup(
        group_id='my-dbt-project',
        dbt_project_config=DbtProjectConfig(
            project_path=Path('/path/to/example_dbt_project/'),
            manifest_path=Path('/path/to/example_dbt_project/target/manifest.json'),
        ),
        dbt_profile_config=DbtProfileConfig(
            profiles_path=Path('/path/to/example_dbt_project/profiles'),
            target='dev',
        ),
        dbt_airflow_config=DbtAirflowConfig(
            extra_tasks=extra_tasks,
            execution_operator=ExecutionOperator.BASH,
        ),
    )

    t1 >> t2 >> tg
```

<div class="content-ad"></div>

두 번째 반복을 마칠 때, 우리는 더욱 우리가 목표로 한 최종 제품에 한 발짝 더 가까워졌어요.

![이미지](/assets/img/2024-06-19-dbtAirflow_5.png)

## 반복 3: 필터링 태그 및 다중 스케줄 생성

이 반복에서, 우리의 목표는 특정 DAG 내에서 특정 dbt 엔티티의 하위 집합만 렌더링할 수 있게 하는 기능을 구현하는 것이었어요. 이는 여러 목적을 달성하기 위한 것이었죠:

<div class="content-ad"></div>

- 동일한 모델에 대해 시간별, 일별 또는 주간별로 다른 일정을 생성하려면 해당 태그가 지정된 모델만 선택하여 선택하면 됩니다.
- 특정 이유로 특정 태그가 지정된 모델을 특정 DAG에 포함하지 않으려면 필터링을 해야 합니다.
- 다른 워크플로에서 특정 시점에 일부 모델을 새로 고침해야 할 때 일부 모델만 렌더링해야 할 수 있습니다.

이를 달성하기 위해, DbtAirflowConfig 객체에 'include_tags'와 'exclude_tags' 두 가지 추가 인수를 도입했습니다. 두 인수 모두 렌더링된 프로젝트에서 Entity를 포함하거나 제외하는 데 사용되는 dbt 태그와 일치하는 문자열 목록을 수용합니다.

이 기능 추가의 주요 도전 과제는 필터링된 노드가 올바른 종속성을 유지하는 것이어서 예상보다 복잡했습니다.

이 반복에서 우리는 이 프로젝트를 시작할 때 목표로 했던 최종 버전에 한 걸음 가까워졌습니다!

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-dbtAirflow_6.png" />

## 이터레이션 4: 컨테이너화된 프로젝트 실행

에어플로우에서 BashOperator를 통해 dbt 명령을 실행할 때는 Airflow 환경 내에서 결과가 자료화되는 대상 시스템을 기준으로 dbt-core 및 해당 dbt 어댑터를 설치하는 것이 중요합니다.

그러나 이 접근 방식은 패키지의 호환성 문제 등의 위험과 어려움을 야기할 수 있습니다. 특히 제공 업체의 다른 클라우드 서비스와의 통합을 용이하게하기 위해 미리 정의된 종속성을 함께 제공하는 클라우드의 관리형 Airflow 서비스인 클라우드 컴포저와 같은 서비스를 사용할 때 이 문제가 발생할 가능성이 높아집니다.

<div class="content-ad"></div>

그리고, 여러 개의 dbt 프로젝트를 관리하는 것은 서로 다른 dbt 버전에서 실행해야 할 수도 있습니다. 안타까운 점은 Airflow 환경에 dbt를 직접 설치하면 기술적으로 이것이 불가능하다는 것입니다.

이러한 도전에 대처하고 버전 관리의 유연성을 보장하기 위해 우리는 dbt 프로젝트를 컨테이너화하고 k8s에서 실행하기로 결정했습니다. 이 방법은 다양한 사용 사례를 지원할뿐만 아니라 필요에 따라 dbt 버전을 업그레이드 또는 다운그레이드할 수 있는 유연성을 제공합니다.

![이미지](/assets/img/2024-06-19-dbtAirflow_7.png)

새 CI/CD 파이프라인이 트리거될 때마다, dbt 프로젝트를 포함하는 Docker 이미지가 빌드되어 Google Cloud의 Artifact Registry로 푸시됩니다. 그러나 dbt-airflow는 여전히 DAG를 렌더링하기 위해 manifest.json 파일에 의존하므로 전체 dbt 프로젝트를 복사하는 대신 manifest 파일만 Cloud Composer GCS 버킷으로 복사해야 합니다.

<div class="content-ad"></div>

dbt-airflow에서는 라이브러리를 확장하여 KubernetesPodOperator를 사용하여 Airflow Tasks를 실행하는 지원을 추가했어요. 이 기능을 통해 DbtAirflowConfig 내에서 execution_operator=ExecutionOperator.KUBERNETES를 지정할 수 있게 되었어요. 이 설정을 사용하면 TaskGroup 내의 각 작업이 자체 Kubernetes pod에서 실행되며 지정된 컨테이너 및 추가 구성을 활용할 수 있어요.

```python
import functools
from datetime import datetime 
from datetime import timedelta
from pathlib import Path

from airflow import DAG
from airflow.operators.empty import EmptyOperator
from airflow.operators.python import PythonOperator
from dbt_airflow.core.config import DbtAirflowConfig
from dbt_airflow.core.config import DbtProfileConfig
from dbt_airflow.core.config import DbtProjectConfig
from dbt_airflow.core.task_group import DbtTaskGroup
from dbt_airflow.operators.execution import ExecutionOperator


with DAG(
    dag_id='test_dag',
    start_date=datetime(2021, 1, 1),
    catchup=False,
    tags=['example'],
    default_args={
        'owner': 'airflow',
        'retries': 1,
        'retry_delay': timedelta(minutes=2),
    },
    'on_failure_callback': functools.partial(
        our_callback_function_to_send_slack_alerts
    ),
) as dag:

    t1 = EmptyOperator(task_id='extract')
    t2 = EmptyOperator(task_id='load')

    tg = DbtTaskGroup(
        group_id='transform',
        dbt_airflow_config=DbtAirflowConfig(
            create_sub_task_groups=True,
            execution_operator=ExecutionOperator.KUBERNETES,
            operator_kwargs={
                'name': f'dbt-project-1-dev',
                'namespace': 'composer-user-workloads',
                'image': 'gcp-region-docker.pkg.dev/gcp-project-name/ar-repo/dbt-project-1:latest',
                'kubernetes_conn_id': 'kubernetes_default',
                'config_file': '/home/airflow/composer_kube_config',
                'image_pull_policy': 'Always',
            },
        ),
        dbt_project_config=DbtProjectConfig(
            project_path=Path('/home/project-1/'),  # 도커 컨테이너 내의 경로
            manifest_path=Path('/home/airflow/gcs/dags/dbt/project-1/target/manifest.json'),  # Cloud Composer GCS 버킷에 있는 경로
        ),
        dbt_profile_config=DbtProfileConfig(
            profiles_path=Path('/home/project-1/profiles/'),  # 도커 컨테이너 내의 경로
            target=dbt_profile_target,
        ),
    )

    t1 >> t2 >> tg
```

그리고 이 기능 추가로 프로젝트 초반에 지정된 초기 요구 사항 집필을 성공적으로 구현했어요.

<img src="/assets/img/2024-06-19-dbtAirflow_8.png" />

<div class="content-ad"></div>

# dbt-airflow을 시작해 보세요

dbt 프로젝트를 배포하고 일정을 예약하는 방법을 찾고 있다면, dbt-airflow를 사용하면 귀찮음을 덜 수 있습니다. Plum의 데이터팀은 이미 1년 이상 운영 중인 이 도구를 안정적이고 확장 가능하다고 입증했습니다. 그래서 여러분의 프로젝트에도 실제 가치를 제공할 수 있다고 자신합니다. 이 패키지는 플랫폼에 구애받지 않으며 dbt에서 지원하는 모든 대상과 함께 사용할 수 있습니다.

이 프로젝트는 GitHub에서 유지되고 PyPI에서도 사용할 수 있습니다.

또한 공식 문서에서 더 많은 세부 정보를 찾을 수 있습니다. 사실, 이 문서에서는 패키지가 제공하는 전체 기능 중 일부만 다루었습니다.

<div class="content-ad"></div>

프로젝트에 기여하는 것을 장려합니다. 무언가 부족한 부분이 있으면 참여해 주시기를 바랍니다.

코딩 즐기세요,

Plum Data Engineering Team ❤