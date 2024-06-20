---
title: "3분 안에 Airflow와 DAG 이해하기"
description: ""
coverImage: "/assets/img/2024-06-20-UnderstandingAirflowandDAGsin3minutes_0.png"
date: 2024-06-20 15:27
ogImage: 
  url: /assets/img/2024-06-20-UnderstandingAirflowandDAGsin3minutes_0.png
tag: Tech
originalTitle: "Understanding Airflow and DAGs in 3 minutes"
link: "https://medium.com/@swathireddythokala16/understanding-airflow-and-dags-in-3-minutes-9a8067b9233d"
---


![Understanding Airflow and DAGs in 3 minutes](/assets/img/2024-06-20-UnderstandingAirflowandDAGsin3minutes_0.png)

안녕하세요! 이 기사에서는 Apache Airflow가 무엇인지 그리고 전통적인 ETL(Extract-Transform-Load) 워크플로우 내에서 어떤 문제를 해결하는지 예를 통해 알아보겠습니다. 또한, Directed Acyclic Graphs (DAGs)가 Airflow 내에서 작업을 구현하는 데 어떻게 활용되는지 살펴볼 것입니다.

예시: 매일 새벽 12시에 벤더 서버에서 매출 데이터 파일을 검색하여 변환한 후 데이터 웨어하우스에 로드하는 ETL 작업이 있다고 상상해보세요. cron 스케줄러를 사용하여 이 작업을 프로덕션 서버에서 성공적으로 트리거합니다.

문제 1: 만약 어느 날 이 작업이 실패한다면 어떻게 될까요? 문제는 추출, 변환 또는 로딩 프로세스에서 발생한 것일까요? 문제 해결을 위해 흩어진 로그를 통해 쥐잡이 게임이 되어버립니다.

<div class="content-ad"></div>

문제 2: 이제 10에서 50개의 ETL 작업을 관리하는 시나리오로 확장해 봅시다. 의존 관계를 추적하고 단일 작업 실패가 혼란을 일으킬 수 있는 것을 방지하는 것은 어려운 과제가 됩니다.

문제 3: 게다가, 한 작업이 다른 작업을 트리거해야 하는 경우가 있고, 그들의 타이밍이 동기화되어 있지 않다면 어떻게 해야 할까요? 생산 서버와 크론 작업만을 이용해서 이러한 복잡성을 관리하는 것은 가리지 않은 눈으로 고양이들을 몰고 다니는 것과 같습니다.

Airflow를 당신의 명령 센터로 생각해보세요. 여기서 ETL 작업을 시각화하고 손쉽게 관리할 수 있습니다. DAG를 사용하여 Airflow는 작업의 순서를 지도화하여 의존 관계가 명확하고 실패가 격리되도록 합니다. DAG가 무엇인지 이해해 봅시다...

DIRECTED ACYCLE GRAPH(DAG):

<div class="content-ad"></div>

Apache Airflow의 DAG는 각 작업을 나타내는 작업 단위로 구성되며 작업 간의 관계가 워크플로를 정의합니다.

위의 예에서는 세 가지 작업으로 구성된 "SALES_ETL_DAG"를 개념적으로 구성할 수 있습니다:

- 작업 A: 공급 업체 서버에서 Sales 파일에서 데이터 추출
- 작업 B: 추출한 데이터 변환
- 작업 C: 변환된 데이터를 데이터 웨어하우스에 로드

(참고: 이러한 모든 작업은 Python으로 작성할 수 있으며 Airflow 자체가 Python으로 개발되었으며 주로 Python과 함께 작동합니다)

<div class="content-ad"></div>

실행 순서는 중요합니다: 작업 A는 성공적으로 완료되어야 작업 B가 시작할 수 있고, 작업 B는 완료되어야 작업 C가 시작할 수 있습니다. 이 순차적인 흐름은 의존성을 존중하고 작업이 역행 없이 단방향으로 진행되도록 보장합니다 — 이것이 DAG의 "Directed" 측면입니다.

이 구조 내에는 순환 의존성이나 루프가 없습니다 : 각 작업은 의존성에 의해 정의된 구조적인 순서대로 실행되어 정돈된 작업 진행이 보장됩니다 — 이는 DAG가 "Acyclic"임을 보장합니다.

DAG 표현: 작업은 노드로 표시되고 작업 간의 의존성은 이러한 노드 사이의 방향성 있는 에지로 표시됩니다 — 이는 워크플로우의 "Graph" 표현을 형성합니다.

![Understanding Airflow and DAGs](/assets/img/2024-06-20-UnderstandingAirflowandDAGsin3minutes_1.png)

<div class="content-ad"></div>

Airflow은 작업의 종속성과 지정된 논리에 따라 작업을 예약하고 모니터링하는 DAGs를 사용하여 복잡한 워크플로우를 쉽게 관리하고 시각화할 수 있습니다.

Airflow은 작업을 예약하고 모니터링하는 것뿐만 아니라 실패한 작업을 다시 시도하고 각 단계를 로깅하며 잠재적인 문제에 대한 경고를 제공합니다. 데이터 작업에 대한 제어 탑을 가지고 있는 것과 같으며 다양한 기술과 서비스와 매끄럽게 통합됩니다.

요약하면, Airflow은 그냥 다른 도구가 아니라 현대 데이터 엔지니어링에 필수적인 자산입니다. ETL 프로세스에 질서, 신뢰성 및 효율성을 제공하여 팀이 혁신에 집중할 수 있도록 도와줍니다. Airflow에 대한 이 개요가 유익하고 통찰력 있었기를 바랍니다.

Airflow 환경을 처음부터 설정하고 기본 ETL 파이프라인을 구현해 보고 싶다면 제 다른 글을 확인해보세요. 여기 링크입니다:

<div class="content-ad"></div>

여기서 중요한 것은 테이블 태그를 마크다운 형식으로 변경하는 것입니다.