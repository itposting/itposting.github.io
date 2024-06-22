---
title: "Airflow, DuckDB, Streamlit으로 StarCraft 2 데이터 탐험하기"
description: ""
coverImage: "/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_0.png"
date: 2024-06-22 17:22
ogImage: 
  url: /assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_0.png
tag: Tech
originalTitle: "Exploring StarCraft 2 data with Airflow, DuckDB and Streamlit"
link: "https://medium.com/data-engineer-things/exploring-starcraft-2-data-with-airflow-duckdb-and-streamlit-7c0ad79f9ca6"
---


- 📝 소개 및 개요
- ⏱️ Airflow
- 🦆 DuckDB
· DuckDB: 여러분의 휴대용 분석 데이터베이스
· DuckDB: 여러분의 다재다능한 데이터 조작 도구
- 🚀 Streamlit
- 🎮 Airflow, DuckDB 및 Streamlit을 활용한 StarCraft II 데이터 파이프라인
· 프로젝트 설정
· Airflow 준비
· StarCraft II API 액세스 가져오기
· DAG 구현
· 데이터 가져오기
· 데이터 저장
· Streamlit을 사용하여 데이터 시각화
- 💡 결론

# 소개 및 개요

이 프로젝트와 기사는 지식 공유의 원천일 뿐만 아니라 게임을 사랑하고 데이터가 보유한 끝없는 가능성을 축하하는 것이기도 합니다. 이것은 두 가지 큰 열정, 즉 게임과 데이터 엔지니어링의 융합입니다. 저는 '스타크래프트: 브루드 워'뿐만 아니라 '스타크래프트 II'도 많이 플레이해오면서, 이 게임은 플레이어가 은하 간 전쟁에서 세 개의 독특한 진영 중 하나를 조종하는 실시간 전략 비디오 게임으로, 자원 관리, 건물 건설 및 전술 전투가 특징입니다. 저는 최고 순위 선수들이 서로 경쟁하는 그랜드마스터 래더에 도달하지는 못했지만, 전장에서 군대를 지휘하는 아드레날린 붐을 경험하고 상대를 앞지르며 승리를 차지하는 것을 즐겼습니다 (적어도 때때로).

마치 스타크래프트에서 빌드 오더를 세밀하게 조정하고 적의 전술에 적응했던 것처럼, 지금은 데이터 엔지니어로서 데이터 파이프라인을 최적화하고 트렌드를 분석하며 통찰을 시각화하고 있습니다. 오늘의 현대 데이터 스택에서 강력한 세 가지 기술에 대해 지식을 공유하고 싶습니다.

<div class="content-ad"></div>

- ⏱️ Apache Airflow: 복잡한 작업 흐름을 조정하고 예약하는 플랫폼입니다.
- 🦆 DuckDB: 가벼우면서 다재다능한 분석용 데이터베이스입니다.
- 🚀 Streamlit: 상호작용 웹 애플리케이션을 구축하기 위한 사용자 친화적인 프레임워크입니다.

본 글에서는 이 세 가지 기술에 대한 기본을 설명하고, 일상 업무에서 어떻게 활용할 수 있는지 예시를 드리겠습니다.

마지막으로, StarCraft II 데이터 파이프라인 예제 프로젝트를 생성할 때 모든 것이 결합됩니다. 본 프로젝트에서는 StarCraft II API에서 데이터를 가져와 DuckDB에 결과를 저장하고, Airflow를 통해 조정합니다. 또한 데이터를 시각화하기 위해 Streamlit 앱을 만들어 볼 것입니다. StarCraft II의 현재 그랜드마스터 래더가 어떻게 보이는지 살펴봅니다 (스포일러: 저는 찾아보기 힘들 것입니다). 이것이 최종 결과물입니다:

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_0.png" />

<div class="content-ad"></div>

Github에서 완성된 프로젝트를 찾을 수 있어요 🪄: https://github.com/vojay-dev/sc2-data-pipeline

자, 마우스와 키보드를 쥐고, 내부 프로토스, 저그 또는 테란 지휘관을 소환하고 데이터와 게임 세계를 함께 탐험할 준비를 하세요.

![Airflow](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_1.png)

# Airflow

<div class="content-ad"></div>

아파치 에어플로우는 파이썬을 사용하여 프로그램 방식으로 작성하고 예약하며 워크플로를 모니터링할 수 있는 오픈 소스 플랫폼입니다. 워크플로는 방향성 비순환 그래프(Directed Acyclic Graphs, DAGs)로 표현되며 그래프의 각 정점은 작업의 단위입니다.

일반적으로, 워크플로는 데이터 추출, 변환, 로드(Extract, Transform, Load, ETL) 프로세스로 알려져 있지만, 사실 에어플로우는 매우 유연하여 어떠한 종류의 워크플로도 구현할 수 있습니다.

![Airflow Image](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_2.png)

에어플로우는 웹 인터페이스를 제공하여 DAGs를 관리하고 모니터링할 수 있습니다. 에어플로우에는 네 가지 주요 구성 요소가 있습니다:

<div class="content-ad"></div>

- 🌎 웹서버: Airflow 웹 인터페이스를 제공합니다.
- ⏱️ 스케줄러: 구성된 시간에 DAG를 실행할 수 있도록 일정을 관리합니다.
- 🗄️ 데이터베이스: 모든 DAG 및 작업 메타데이터를 저장합니다.
- 🚀 실행자: 개별 작업을 실행합니다.

데이터베이스와 실행자에 관해서 Airflow는 매우 유연합니다. 예를 들어 SequentialExecutor는 로컬 개발에 사용될 수 있으며 한 번에 하나의 작업을 실행합니다. 한편, CeleryExecutor 또는 KubernetesExecutor는 작업자 노드 클러스터에서 병렬 실행을 가능하게 합니다.

이 프로젝트에서는 Airflow를 사용하여 StarCraft II API에서 데이터를 가져와 DuckDB에 유지하도록 작업 흐름을 조정할 것입니다.

# DuckDB

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_3.png" />

덕디비 세계에 오신 것을 환영합니다! 덕디비를 데이터 분석 영역에서의 신뢰할 수 있는 동반자로 상상해보세요. 가벼우면서도 강력한 도구로, 강력한 효과를 발휘합니다. 덕디비를 스타크래프트 군에서의 민첩한 정찰병으로 상상해보세요. 적의 선을 민첩하게 헤쳐가며 정보를 수집합니다.

본 예제 프로젝트에서는 덕디비를 사용하여 스타크래프트 API의 데이터, 특히 그랜드마스터 랭킹 데이터를 임베디드 방식으로 영구 저장하는 방법을 살펴보겠습니다. 이를 위해 파이썬을 통해 덕디비를 사용하여 데이터를 한 파일에 저장합니다.

하지만 프로젝트에 바로 뛰어들기 전에, 아래 장들에서 덕디비에 대해 더 자세히 소개하고 일상적인 데이터 엔지니어링/분석 비즈니스에서 덕디비를 활용하는 데 어떻게 도움을 받을 수 있는지 설명하겠습니다.

<div class="content-ad"></div>

# DuckDB: 휴대용 분석용 데이터베이스

DuckDB를 데이터베이스의 스위스 아미 나이프로 생각해보세요. 이것은 빠르고 효율적이며 다재다능합니다. 마치 전투터스 제알럿처럼 어떤 상황에도 쉽게 적응할 수 있습니다.

DuckDB는 쉽게 설치할 수 있으며 휴대용이며 오픈소스입니다. SQL 언어에서 기능이 풍부하며 CSV, Parquest, JSON과 같은 다양한 형식의 데이터를 가져오고 내보낼 수 있습니다. 또한 Pandas 데이터프레임과 원활하게 통합되어 있어 데이터 테이블 작업에 강력한 도구로 사용할 수 있습니다. 다음 장에서 자세히 살펴보겠습니다.

Python 프로젝트에 간단히 설치할 수 있습니다:

<div class="content-ad"></div>


```js
pip install duckdb
```

그 후에는 DuckDB를 인메모리 데이터베이스로 즉석에서 사용할 수 있습니다:

```js
import duckdb

duckdb.execute("CREATE TABLE tbl AS SELECT 42 a")
df = duckdb.execute("SELECT * FROM tbl").df()
print(df)
```

```js
    a
0  42
```

<div class="content-ad"></div>

또는 간단한 파일에 데이터를 유지하는 내장 데이터베이스로 DuckDB를 사용할 수도 있어요:

```js
import duckdb

# 영구 데이터베이스를 생성하고 데이터를 씁니다
with duckdb.connect(database="my_duckdb.db") as write_conn:
    write_conn.execute("CREATE TABLE tbl AS SELECT 42 a")

# 다른 곳에서: 데이터를 읽고 처리합니다
with duckdb.connect(database="my_duckdb.db", read_only=True) as read_conn:
    df = read_conn.execute("SELECT * FROM tbl").df()
    print(df)
```

이렇게 하면 모든 데이터가 my_duckdb.db라는 파일에 저장됩니다. 여기서는 DuckDB와 Pandas 데이터프레임 간에 데이터를 교환하는 것 뿐만 아니라 CSV, JSON 등을 읽고 쓸 수도 있어요.

만약 SQLite에 익숙하다면 DuckDB를 그보다 더 성능 중심적이고 더 세련된 씨봉인 것으로 생각해보세요. SQLite가 소규모 프로젝트에 적합하다면 DuckDB는 한 단계 발전된 것입니다. 작은 Terran Hellion에서 강력한 Thor 유닛으로 업그레이드하는 것 같아요. 더 큰 데이터셋과 복잡한 쿼리도 무리 없이 처리할 준비가 되어 있습니다.

<div class="content-ad"></div>

DuckDB는 Command Line Interface (CLI)도 제공합니다. DuckDB CLI는 Windows, Mac 및 Linux용으로 미리 컴파일된 간단한 실행 파일입니다. 내 Mac 환경에서는 간단히 Homebrew를 통해 설치할 수 있어요:

```js
brew install duckdb
```

이를 사용하여 DuckDB 소스에 연결하거나 인메모리 작업을 수행할 수 있어요.

<div class="content-ad"></div>

일부 능력을 보여주기 위해 DuckDB 데이터베이스 파일에 연결하여 프로젝트의 일부로 나준비 한 일부를 실행하기 위해 사용했습니다:

```js
SELECT favorite_race, SUM(wins) AS total_wins, MAX(mmr) AS max_mmr, AVG(mmr) AS avg_mmr
FROM ladder
WHERE favorite_race IN ('protoss', 'terran', 'zerg')
GROUP BY favorite_race
ORDER BY total_wins DESC;
```

```js
| favorite_race | total_wins | max_mmr |      avg_mmr      |
|    varchar    |   int128   | double  |      double       |
|---------------|------------|---------|-------------------|
| protoss       |      11816 |  6840.0 |            5541.3 |
| terran        |       7207 |  7140.0 | 5501.839285714285 |
| zerg          |       5380 |  7080.0 | 5591.622222222222 |
```

- 🥇 Protoss가 그랜드마스터 래더에서 가장 높은 총 승리 수를 가졌지만 최대 MMR는 가장 낮습니다.
- 🥈 Terran은 그랜드마스터 래더에서 최고의 최대 MMR을 가지고 있습니다.
- 🥉 Zerg는 그랜드마스터 래더에서 가장 적은 승리를 가지고 있지만 평균 MMR이 가장 높습니다.

<div class="content-ad"></div>

# DuckDB: 다목적 데이터 조작 도구

덕DB에 대해 처음 프로젝트를 진행하면서, 휴대용 가벼운 분석 데이터베이스 이상의 기능을 발견할 수 있었어요. 실제로 덕DB를 데이터 처리 작업에 사용하면 매우 강력해질 수 있답니다. 

덕DB의 핵심은 SQL 기반 작업과 Pandas와 같은 다른 데이터 처리 도구 사이에 원활한 통합 기능을 제공하는 것입니다. 이 독특한 기능 덕분에 데이터 처리 스크립트 내에서 다른 기술들 간에 쉽게 전환할 수 있어요.

Pandas나 NumPy와 같은 전형적인 라이브러리를 사용하여 Python 스크립트 내에서 데이터 처리를 완전히 구현하는 대신, 복잡한 데이터베이스 통합 설정 없이 이러한 환경들 간에 전환할 수 있어요.

<div class="content-ad"></div>

API로부터 데이터를 가져와 Pandas 데이터프레임에 로드하고 메모리 내 DuckDB에 삽입하여 SQL을 사용하여 집계를 수행한 다음 결과를 또 다른 데이터프레임에 다시 작성하여 계속 진행할 수 있습니다. 특히 SQL과 함께 많이 작업하는 데이터 엔지니어로서 이는 더 직관적인 데이터 흐름을 만들기 위한 제 도구 상자에 강력한 도구를 제공했습니다.

스타크래프트와 마찬가지로, 상황에 맞는 올바른 유닛을 선택해야 합니다.  Zealots의 군대를 만들 수 있지만 상대가 많은 Roaches로 공격할 때에는 군대 구성을 조정하고 Immortals와 Void Rays를 추가해야 합니다. 데이터 처리 스크립트도 마찬가지입니다: DuckDB와 같은 도구를 전체 구성에 추가함으로써 데이터 처리 시 더 많은 도전에 대처할 수 있는 가능성을 가질 수 있습니다.

다음 예시는 Airflow DAG로 채울 StarCraft II 래더 데이터를 읽어와 SQL을 사용하여 집계하고 결과를 Pandas 데이터프레임으로 작성한 다음 Pandas를 사용하여 일부 열을 추가하고 결과를 다시 메모리 내 DuckDB 테이블로 이동하여 최종적으로 Pandas 데이터프레임으로 돌아가게 됩니다.

```js
import duckdb

if __name__ == '__main__':
    # 영구 DuckDB 사용
    with duckdb.connect(database="sc2data.db") as conn:
        df = conn.sql(f"""
            SELECT
                favorite_race,
                SUM(wins) AS total_wins,
                SUM(losses) AS total_losses,
                MAX(mmr) AS max_mmr,
                AVG(mmr) AS avg_mmr
            FROM ladder
            WHERE favorite_race IN ('protoss', 'terran', 'zerg')
            GROUP BY favorite_race
            ORDER BY total_wins DESC;
        """).df()
        print(df)

    # 팬더스에서 데이터 처리
    df["win_pct"] = (df["total_wins"] / (df["total_wins"] + df["total_losses"]) * 100)

    # 추가 처리를 위해 메모리 내 DuckDB 사용
    duckdb.sql("""
        CREATE TABLE aggregation AS
        SELECT CASE
            WHEN favorite_race = 'protoss' THEN 'p'
            WHEN favorite_race = 'terran' THEN 't'
            WHEN favorite_race = 'zerg' THEN 'z'
        END AS fav_rc,
        total_wins + total_losses AS total_games,
        win_pct
        FROM df;
    """)

    # 팬더스로 변경
    df_agg = duckdb.sql("SELECT * FROM aggregation;").df()
    print(df_agg)
```

<div class="content-ad"></div>

위 코드와 StarCraft II API 그랜드마스터 래더 데이터를 사용하여 위와 같은 결과가 생성됩니다:

```js
  favorite_race  total_wins  total_losses  max_mmr      avg_mmr
0       protoss     11816.0        8927.0   6840.0  5541.300000
1        terran      7207.0        5655.0   7140.0  5501.839286
2          zerg      5380.0        3985.0   7080.0  5591.622222
  fav_rc  total_games    win_pct
0      p      20743.0  56.963795
1      t      12862.0  56.033276
2      z       9365.0  57.447944
```

우리는 그랜드마스터 래더에서 프로토스가 가장 인기 있는 선택이라는 것을 배울 수 있을 뿐만 아니라, DuckDB가 Pandas와의 호환성으로 데이터 과학자와 분석가들에게 새로운 가능성을 열어 줍니다. DuckDB의 SQL 능력과 Pandas의 데이터 조작 기능을 원활하게 전환하여 사용자들은 두 플랫폼의 강점을 활용하여 업무 효율성과 유연성을 극대화할 수 있습니다.

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_5.png" />

<div class="content-ad"></div>

숫자를 다루거나 데이터 집합을 변환하거나 복잡한 분석을 수행하더라도, DuckDB는 신뢰할 수 있는 동반자로 빛을 발합니다. SQL의 편리함과 Pandas 및 기타 라이브러리의 다양성을 통해 데이터 조작을 효율적으로 진행할 수 있습니다.

# Streamlit

Streamlit의 오픈 소스 앱 프레임워크를 통해 데이터 시각화 및 상호 작용 가능한 웹 앱을 만들 수 있습니다. 이러한 앱을 로컬에서 실행하거나 무료로 Streamlit Community Cloud에 배포할 수도 있습니다. Streamlit 자체에는 모든 종류의 데이터를 렌더링할 요소가 이미 포함되어 있지만, Streamlit의 가능성을 확장하는 서드파티 모듈(구성 요소)도 많이 있습니다.

간단히 Python 프로젝트에 설치할 수 있습니다:

<div class="content-ad"></div>

```js
streamlit 설치하기
```

그런 다음, 전용 스크립트 파일에서 앱을 만들고 streamlit run 명령어를 통해 실행합니다:

```js
streamlit run your_script.py [-- 스크립트 인수]
```

파이썬 스크립트를 코드로 상상해 보세요. 위에서부터 아래로 앱을 나타내죠. 함께 하면:


<div class="content-ad"></div>

```js
import streamlit as st

st.title("내 Streamlit 앱")
```

간단한 헤더가 있는 웹 앱이 생성됩니다.

![img](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_6.png)

다음 코드를 사용하면:


<div class="content-ad"></div>

```python
import streamlit as st

st.dataframe(df)
```

대화형 테이블로 데이터프레임을 표시할 수 있어요. 데이터를 시각화하는 많은 가능성이 있습니다. StarCraft II 데이터를 렌더링하는 앱을 구현할 때 구체적인 사용 사례를 보게 될 거에요. 기대하시고 즐겁게 읽어 주세요.

# Airflow, DuckDB 및 Streamlit을 사용한 StarCraft II 데이터 파이프라인

프로젝트의 기본 아이디어는 StarCraft II API에서 데이터를 가져오는 것이에요. 보다 정확하게 말하자면 현재 게임에서 가장 우수한 사람을 알아보기위해 그랜드마스터 래더에 대한 정보를 가져올 거에요.

<div class="content-ad"></div>

저희는 그 데이터를 DuckDB 파일에 저장한 다음 Airflow DAG와 TaskFlow API를 사용하여 이 프로세스를 조정할 것입니다. 마지막으로, Streamlit을 사용하여 간단한 앱을 만들 것입니다.

최종 프로젝트는 Github에서도 확인하실 수 있어요 🪄: https://github.com/vojay-dev/sc2-data-pipeline 하지만 이어지는 챕터에서는 이 스타크래프트 II 데이터 파이프라인을 어떻게 단계별로 구현하는지 설명할 거예요.

제가 사용하고 있는 환경은 다음과 같아요:

- OS: macOS Sonoma
- Python: 3.11.8

<div class="content-ad"></div>

# 프로젝트 설정

새로운 파이썬 프로젝트를 만들기 위해 시작합니다. 먼저 새로운 폴더를 만듭니다. 이 폴더 안에서 빌트인 venv 모듈을 사용하여 가상 환경을 만듭니다:

```bash
mkdir sc2-data-pipeline
cd sc2-data-pipeline
python -m venv .venv
source .venv/bin/activate
```

![이미지](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_7.png)

<div class="content-ad"></div>

마지막 명령어로 가상 환경도 활성화되었습니다. 이는 말하자면: 해당 터미널 세션에서 실행하는 모든 것이 시스템 전역 Python이 아닌 가상 Python을 사용하게 됩니다. 이는 우리가 다음에 설치할 종속성을 프로젝트 내에서 격리시키고 싶어하는 중요한 부분입니다.

이 프로젝트는 Airflow, DuckDB, Streamlit, Pandas 및 PyArrow을 사용하므로, 다음 단계는 모든 요구 사항을 설치하는 것입니다:

```javascript
# Airflow 설치
AIRFLOW_VERSION=2.8.2
PYTHON_VERSION="$(python --version | cut -d " " -f 2 | cut -d "." -f 1-2)"
CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"
pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "${CONSTRAINT_URL}"

# DuckDB 설치
pip install duckdb

# Pandas 및 PyArrow 설치
pip install pandas
pip install pyarrow

# Streamlit 설치
pip install streamlit
```

이 과정은 조금 시간이 걸릴 수 있으니, 이는 커피를 마실 좋은 순간입니다. ☕️

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_8.png" />

위에서 보듯이 Airflow 2.8.2를 사용하고 있습니다. 또한, 왜 Poetry나 최소한 requirements.txt를 사용하는 대신 이러한 종속성을 수동으로 설치하는지 궁금해할 수도 있습니다. Airflow를 로컬에 설치할 때는 이 접근 방식이 가장 안정적으로 작동하며, 공식적인 Poetry 지원이 아직 없습니다. 이러한 이유로 그리고 간단하게 유지하기 위해 수동 방식을 선택했습니다.

# Airflow 준비하기

Airflow는 구성 파일과 같은 데이터를 관리하기 위해 로컬 디스크에 airflow라는 폴더를 사용합니다. 보통 이 폴더는 현재 사용자의 홈 디렉터리에 배치됩니다. 그러나 다른 프로젝트와 충돌을 피하기 위해 AIRFLOW_HOME 환경 변수를 해당하는 프로젝트 폴더로 설정하여 airflow 폴더의 기준으로 사용할 것입니다.

<div class="content-ad"></div>

Airflow를 독립 실행 모드로 처음 시작하면, 지정된 위치에 폴더를 생성하고 기본 구성을 사용합니다. SequentialExecutor와 SQLite를 데이터베이스로 사용하며, 데이터베이스 파일은 AIRFLOW_HOME 위치에 저장됩니다.

다음 명령어는 AIRFLOW_HOME 환경 변수를 현재 디렉토리(프로젝트 디렉토리)에 airflow라는 폴더로 설정하고 Airflow를 독립 실행 모드로 시작합니다. 또한 명령에 NO_PROXY라는 다른 환경 변수를 추가합니다. 이는 macOS에서 DAG를 Airflow 웹 인터페이스를 통해 실행할 때 발생하는 SIGSEGV 문제로 인한 것입니다.

```sh
NO_PROXY="*" AIRFLOW_HOME="$(pwd)/airflow" airflow standalone
```

이로써 Airflow를 시작할 뿐만 아니라 프로젝트 디렉토리에 airflow 폴더를 자동으로 생성할 것입니다. 또한 웹 인터페이스를 위해 관리자 사용자를 자동으로 생성합니다. 로그 출력에 사용자 이름과 비밀번호를 확인할 수 있어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_9.png" />

```js
standalone | Airflow is ready
standalone | Login with username: admin password: FZCvvSd8WVYDb2Vm
standalone | Airflow Standalone is for development purposes only. Do not use this in production!
```

브라우저에서 http://localhost:8080/을 열어서 로그 출력에서 제공된 자격 증명을 사용하여 로그인할 수 있습니다.

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_10.png" />

<div class="content-ad"></div>

축하해요 🎉, 실용적이고 로컬 Airflow 환경을 갖추셨군요. 웹 인터페이스의 경고 메시지가 표시되는 이유는 자동으로 SequentialExecutor와 스탠드얼론 모드의 SQLite 데이터베이스를 사용하고 있기 때문입니다. 당연히 이는 본격적인 운영용이 아닌 것이죠.

스탠드얼론 프로세스를 종료하려면 컨트롤+c를 누르세요.

DAG 작업에 앞서 환경을 좀 더 준비해보겠습니다.

한 가지 주목할 점이 있을 겁니다: 예제 DAG들이 많이 있습니다. 저는 개인적으로 깔끔한 환경으로 시작하는 것을 좋아해요. 이 예제들은 특정 구성 변수가 설정되었을 때 시작됩니다. 그러니 먼저 이 부분을 구성 수정해 볼게요.

<div class="content-ad"></div>

프로젝트 폴더 내의 airflow 폴더에 AIRFLOW_HOME 변수를 설정했기 때문에 구성 파일의 위치는 airflow/airflow.cfg입니다.

![이미지](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_11.png)

즐겨 사용하는 편집기에서 구성을 열어 다음 구성을 변경하세요:

```js
load_examples = False
```

<div class="content-ad"></div>

혼자서 실행되는 프로세스를 다시 시작하더라도 예시 DAG들은 데이터베이스에 남아있기 때문에 계속 나타날 수 있습니다. 따라서 다음 명령어로 데이터베이스를 재설정해야 합니다. (가상 환경을 활성화하고 프로젝트 폴더 내에 있어야 함을 확인하세요).

```bash
NO_PROXY="*" AIRFLOW_HOME="$(pwd)/airflow" airflow db reset
```

정상적으로 재설정했다면, 환경을 다시 시작하고 이제는 깨끗한 상태입니다. 이제 새로운 관리자 사용자를 생성하지만 이번에는 예시 DAG는 생성되지 않습니다.

```bash
NO_PROXY="*" AIRFLOW_HOME="$(pwd)/airflow" airflow standalone
```

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_12.png)

DAG를 생성하기 전에 조정해야 할 사항이 하나 더 있습니다. 일반적으로 프로젝트를 Git 저장소에 커밋할 때 airflow 폴더를 추가하고 싶지 않습니다. 그 이유는 프로덕션 환경에서 프로젝트 폴더에 위치하지 않고 로컬 환경이기 때문에 다른 개발자들이 각자의 환경을 설정할 수 있도록 하기 위함입니다.

그래서 .gitignore 파일에 airflow/를 추가할 것입니다. 그러나 이 접근 방식에 문제가 있습니다. 기본적으로 Airflow는 airflow 폴더 내의 dags라는 폴더에서 DAG를 찾기 때문에 airflow/dags로 지정합니다. 이 폴더에 DAG 구현을 추가하고 .gitignore 파일에서 airflow/ 폴더를 무시한다면, 우회 방식 없이 코드를 저장소에 커밋할 수 없게 됩니다.

다행히도, 해결책은 Airflow 구성에서 DAGs 폴더를 변경하는 것뿐입니다. 이를 해결하기 위해 이 변수를 프로젝트 폴더 내에 있는 dags라는 폴더로 설정하겠습니다.

<div class="content-ad"></div>

해당 목적을 달성하려면 Airflow/airflow.cfg 파일을 다시 열어서 dags_folder 변수를 찾으세요. 이 변수를 프로젝트 폴더 내의 dags라는 폴더를 가리키도록 설정하십시오. 예를 들어:

```js
dags_folder = /tmp/sc2-data-pipeline/dags
```

마지막으로, 프로젝트 내에 빈 dags 폴더를 생성하고 준비 완료입니다.

```js
mkdir dags
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_13.png)

# 스타크래프트 II API 액세스 받기

우리가 사용하고 있는 API는 스타크래프트 II 커뮤니티 API의 일부입니다.

![image](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_14.png)


<div class="content-ad"></div>

제한은 매우 관대합니다: 1시간당 36000개의 요청 및 1초당 100개의 요청이 가능하므로 이 시나리오에서 DAG를 자유롭게 실행할 수 있습니다.

액세스를 받으려면 무료로 battle.net 계정을 사용하여 OAuth 클라이언트를 생성해야 합니다. 단순히 https://develop.battle.net/access/clients 로 이동하여 battle.net 계정으로 로그인하고 클라이언트를 생성하면 됩니다.

![이미지](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_15.png)

이렇게 하면 다음을 얻을 수 있습니다:

<div class="content-ad"></div>

- 클라이언트 ID 및
- 클라이언트 비밀번호

둘 다 API에 액세스하기 위해 필요하니 안전하게 보관하세요.

기본 흐름은 먼저 클라이언트 ID와 비밀번호를 사용하여 액세스 토큰을 가져온 후 이 토큰을 사용하여 커뮤니티 API에서 데이터를 가져오는 것입니다. 다음 예시는 터미널에서 curl 및 jq를 사용하여 이 작업을 수행하는 방법을 보여줍니다. jq는 brew install jq를 사용하여 설치할 수 있습니다.

액세스 토큰 가져오기 예시

<div class="content-ad"></div>


```js
curl -s -u your_client_id:your_client_secret -d grant_type=client_credentials https://oauth.battle.net/token | jq .
```

```js
{
  "access_token": "super_secret_token",
  "token_type": "bearer",
  "expires_in": 86399,
  "sub": "xxx"
}
```

데이터 가져오는 예시

```js
curl -s --header "Authorization: Bearer super_secret_token" "https://eu.api.blizzard.com/sc2/ladder/season/2" | jq .
```


<div class="content-ad"></div>

```json
{
  "seasonId": 58,
  "number": 1,
  "year": 2024,
  "startDate": "1704412800",
  "endDate": "1711929600"
}
```

클라이언트 ID 및 시크릿이 준비되었으니 이제 DAG를 구현하여 그랜드마스터 래더 데이터를 가져와 유지할 수 있습니다.

# DAG 구현

dags 폴더에 Python 파일 sc2.py를 만들어 DAG의 구현을 실행할 것입니다. 아래 코드를 추가하십시오. 이 코드는 TaskFlow API를 사용한 DAG 구현입니다. 이후에 일부 세부 정보를 살펴보겠습니다.

<div class="content-ad"></div>

```python
import logging

import pendulum
import requests
from airflow.decorators import dag, task, task_group
from airflow.models import Variable
from requests.adapters import HTTPAdapter
from urllib3 import Retry
import duckdb
import pandas as pd

logger = logging.getLogger(__name__)

DUCK_DB = "sc2data.db"

CLIENT_ID = "your_client_id"
CLIENT_SECRET = "your_client_secret"

BASE_URI = "https://eu.api.blizzard.com"
REGION_ID = 2  # Europe

# retry strategy for contacting the StarCraft 2 API
MAX_RETRIES = 4
BACKOFF_FACTOR = 2


@dag(start_date=pendulum.now())
def sc2():
    retry_strategy = Retry(total=MAX_RETRIES, backoff_factor=BACKOFF_FACTOR)
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session = requests.Session()
    session.mount('https://', adapter)

    @task
    def get_access_token() -> str:
        data = {"grant_type": "client_credentials"}
        response = session.post("https://oauth.battle.net/token", data=data, auth=(CLIENT_ID, CLIENT_SECRET))
        return response.json()["access_token"]

    @task
    def get_grandmaster_ladder_data(token: str):
        headers = {"Authorization": f"Bearer {token}"}

        response = session.get(f"{BASE_URI}/sc2/ladder/grandmaster/{REGION_ID}", headers=headers)
        ladder_teams = response.json().get("ladderTeams", [])
        return [{
            "id": lt["teamMembers"][0]["id"],
            "realm": lt["teamMembers"][0]["realm"],
            "region": lt["teamMembers"][0]["region"],
            "display_name": lt["teamMembers"][0]["displayName"],
            "clan_tag": lt["teamMembers"][0]["clanTag"] if "clanTag" in lt["teamMembers"][0] else None,
            "favorite_race": lt["teamMembers"][0]["favoriteRace"] if "favoriteRace" in lt["teamMembers"][0] else None,
            "previous_rank": lt["previousRank"],
            "points": lt["points"],
            "wins": lt["wins"],
            "losses": lt["losses"],
            "mmr": lt["mmr"] if "mmr" in lt else None,
            "join_timestamp": lt["joinTimestamp"]
        } for lt in ladder_teams if lt["teamMembers"] and len(lt["teamMembers"]) == 1]

    def get_profile_metadata(token: str, region: str, realm: int, player_id: int) -> dict:
        headers = {"Authorization": f"Bearer {token}"}

        response = session.get(f"{BASE_URI}/sc2/metadata/profile/{region}/{realm}/{player_id}", headers=headers)
        return response.json() if response.status_code == 200 else None

    @task
    def enrich_data(token: str, data: list) -> list:
        logger.info("Fetching metadata for %d players", len(data))

        for i, player in enumerate(data, start=1):
            logger.info("Fetching metadata for player %d/%d", i, len(data))
            metadata = get_profile_metadata(token, player["region"], player["realm"], player["id"])

            player["profile_url"] = metadata.get("profileUrl") if metadata else None
            player["avatar_url"] = metadata.get("avatarUrl") if metadata else None
            player["name"] = metadata.get("name") if metadata else None

        return data

    @task
    def create_pandas_df(data: list) -> pd.DataFrame:
        return pd.DataFrame(data)

    @task
    def store_data_in_duckdb(ladder_df: pd.DataFrame) -> None:
        with duckdb.connect(DUCK_DB) as conn:
            conn.sql(f"""
                DROP TABLE IF EXISTS ladder;
                CREATE TABLE ladder AS
                SELECT * FROM ladder_df;
            """)

    @task_group
    def get_data() -> list:
        access_token = get_access_token()
        ladder_data = get_grandmaster_ladder_data(access_token)
        return enrich_data(access_token, ladder_data)

    @task_group
    def store_data(enriched_data: list) -> None:
        df = create_pandas_df(enriched_data)
        store_data_in_duckdb(df)

    store_data(get_data())


sc2()
```

DAG의 기본 흐름은 꽤 간단합니다. 앞서 설명한 두 주요 태스크 그룹인 get_data와 store_data가 연결됩니다.

![image](/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_16.png)

이제 이러한 태스크 그룹의 주요 요소들을 살펴보겠습니다.

<div class="content-ad"></div>

# 데이터 가져오기

데이터 가져오기는 Airflow에서 각각의 태스크로 실행되는 다음 3단계로 이루어집니다:

- 🔐 get_access_token: 클라이언트 ID와 비밀번호를 사용하여 최신 엑세스 토큰을 가져옵니다.
- 📝 get_grandmaster_ladder_data: 토큰을 사용하여 모든 플레이어의 최신 그랜드마스터 래더 데이터를 가져옵니다.
- 👥 enrich_data: 다른 API 엔드포인트를 사용하여 래더의 각 항목을 플레이어 프로필 URL, 아바타 및 이름과 함께 풍부하게 만듭니다.

request.get 또는 request.post 함수를 직접 사용하는 대신, 모든 요청에 사용하는 세션을 생성합니다. 이를 통해 재시도 및 백오프 전략을 정의할 수도 있습니다. 외부 API 소스에서 데이터를 가져오는 경우 DAG가 일시적으로 사용할 수 없는 API 때문에 실패하지 않도록 하려면 이 방법이 권장됩니다.

<div class="content-ad"></div>

```js
MAX_RETRIES = 4
BACKOFF_FACTOR = 2

retry_strategy = Retry(total=MAX_RETRIES, backoff_factor=BACKOFF_FACTOR)
adapter = HTTPAdapter(max_retries=retry_strategy)
session = requests.Session()
session.mount('https://', adapter) 
```

여기에, 우리는 세션을 사용하여 작업에서 요청을 보낼 수 있습니다. 예를 들어, 액세스 토큰을 얻기 위해:

```js
    @task
    def get_access_token() -> str:
        data = {"grant_type": "client_credentials"}
        response = session.post("https://oauth.battle.net/token", data=data, auth=(CLIENT_ID, CLIENT_SECRET))
        return response.json()["access_token"]
```

get_grandmaster_ladder_data에서는 https://eu.api.blizzard.com/sc2/ladder/grandmaster/'REGION_ID' 엔드포인트에서 최신 그랜드마스터 래더를 가져옵니다. 여기서 REGION_ID는 유럽 데이터를 얻기 위해 우리의 경우에 2로 설정됩니다.

<div class="content-ad"></div>

마지막으로, enrich_data 작업에서는 래더의 각 플레이어에 대해 https://eu.api.blizzard.com/sc2/metadata/profile/'region'/'realm'/'player_id' 엔드포인트를 호출하여 기존 플레이어 항목을 보강합니다. 엔드포인트 호출 자체는 get_profile_metadata 도우미 함수에 캡슐화되어 있습니다.

# 데이터 저장

데이터 저장은 다음 2 단계에서 발생하며 각각 Airflow에서 작업으로 실행됩니다:

- 🐼 create_pandas_df: 플레이어 목록을 기반으로 판다스 데이터프레임 생성.
- 🦆 store_data_in_duckdb: 데이터프레임을 파일에 저장된 DuckDB에 저장합니다.

<div class="content-ad"></div>

이전에도 언급했듯이, DuckDB는 Pandas 데이터프레임을 포함한 다양한 형식을 읽고 쓸 수 있습니다. 따라서 첫 번째 단계는 사다리의 각 플레이어가 되는 딕셔너리 목록에서 데이터프레임을 생성하는 것입니다.

```js
    @task
    def create_pandas_df(data: list) -> pd.DataFrame:
        return pd.DataFrame(data)
```

DuckDB에 이 데이터프레임을 저장하는 것은 놀랍도록 쉽습니다. 처음 보는 코드를 읽을 때 놀라실 수도 있지만, 네: SQL에서 데이터프레임 변수를 참조할 수 있습니다.

```js
    @task
    def store_data_in_duckdb(ladder_df: pd.DataFrame) -> None:
        with duckdb.connect(DUCK_DB) as conn:
            conn.sql(f"""
                DROP TABLE IF EXISTS ladder;
                CREATE TABLE ladder AS
                SELECT * FROM ladder_df;
            """)
```

<div class="content-ad"></div>

파일에 데이터를 유지하는데, 각 실행에서 기존 데이터를 삭제하여 가장 최신 정보만 저장합니다. 우리는 INSERT OR REPLACE를 사용할 수 있지만, 그런 경우에는 기본 키 제약 조건을 정의해야 합니다. 이는 데이터프레임을 기반으로 직접 테이블을 생성할 때 불가능합니다. 하지만 우리의 사용 사례에는 이 방법이 충분합니다. 이런 경우에 저는 사람들에게 KISS 원칙을 상기시키는 것을 좋아합니다:

데이터를 저장한 후에는 DAG가 완료되어 시각화할 수 있습니다.

# Streamlit을 사용한 데이터 시각화

Streamlit 앱을 위해 프로젝트의 루트 디렉토리에 새 파일을 만듭니다: app.py. 다음 내용을 간단히 추가할 수 있습니다:


<div class="content-ad"></div>


import streamlit as st

st.title("StarCraft 2 Grandmaster Ladder")


앱을 실행하려면 다음을 사용하세요:


streamlit run app.py


헤더가 있는 간단한 웹 페이지가 표시됩니다. 앱을 확장할 때마다 자동으로 새로 고침됩니다. 이제 DuckDB에서 데이터를 읽고 렌더링하는 실제 앱으로 내용을 바꿔봅시다:


<div class="content-ad"></div>


import streamlit as st
import duckdb

con = duckdb.connect(database="sc2data.db", read_only=True)

st.title("StarCraft 2 Grandmaster Ladder")

@st.cache_data
def load_ladder_data():
    df = con.execute("SELECT * FROM LADDER").df()

    # mmr로 정렬하고 아바타를 첫 번째 열로 이동
    df.sort_values("mmr")
    avatar_url = df.pop("avatar_url")
    df.insert(0, "avatar", avatar_url)

    return df

@st.cache_data
def load_favorite_race_distribution_data():
    df = con.execute("""
        SELECT favorite_race, COUNT(*) AS count
        FROM LADDER
        WHERE favorite_race IS NOT NULL
        GROUP BY 1
        ORDER BY 2 DESC
    """).df()
    return df

ladder = load_ladder_data()

st.dataframe(ladder, column_config={
    "avatar": st.column_config.ImageColumn("avatar")
})

distribution_data = load_favorite_race_distribution_data()
st.bar_chart(distribution_data, x="favorite_race", y="count")


마지막으로, MMR순으로 정렬된 StarCraft II 그랜드마스터 래더 데이터를 시각화하고, 플레이어들의 아바타도 보여줍니다:

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_17.png" />

Pandas 데이터프레임과 DuckDB를 강력한 데이터 가공 툴킷으로 결합하는 좋은 예시를 보여주는 앱 구현입니다:


<div class="content-ad"></div>

```js
df = con.execute("SELECT * FROM LADDER").df()

# mmr을 기준으로 정렬하고 아바타를 첫 번째 열로 옮깁니다
df.sort_values("mmr")
avatar_url = df.pop("avatar_url")
df.insert(0, "avatar", avatar_url)

return df
```

Streamlit을 사용하면 데이터프레임을 쉽게 렌더링할 수 있을 뿐만 아니라 특정 열을 교체하여 앱에서 렌더링하는 방식을 수정할 수도 있습니다. 이 예시에서는 아바타 열에서 URL을 가져와 이미지로 렌더링합니다:

```js
st.dataframe(ladder, column_config={
    "avatar": st.column_config.ImageColumn("avatar")
})
```

마지막으로, 그랜드마스터 래더에서 프로토스가 가장 주요한 진영으로 보이는 것을 확인할 수 있습니다. 제가 전 프로토스 플레이어였기 때문에 이 소식을 듣는 것은 좋습니다 😉. 


<div class="content-ad"></div>

# 결론

마지막으로, Apache Airflow, Streamlit, 그리고 DuckDB를 활용하여 데이터 파이프라인을 구축하는 여정은 데이터 파이프라인을 조율하고 대화형 데이터 애플리케이션을 개발하는 데 소중한 기술적 통찰력을 제공했습니다.

DuckDB는 데이터 wrangling 도전에 강력한 동반자로 나타났으며, Pandas 데이터프레임과 고급 분석 SQL 기능과의 원활한 통합을 제공했습니다. 가벼운 성격과 효율적인 성능을 통해 리소스 제한적 환경에서 분석 워크로드에 적합함을 입증했습니다.

직관적인 인터페이스와 강력한 시각화 기능을 갖춘 Streamlit은 대화형 데이터 애플리케이션의 신속한 개발 잠재력을 보여주었습니다.

<div class="content-ad"></div>

이러한 기술을 탐색한 것을 되돌아보면, 현대 데이터 엔지니어링 및 분석 워크플로우에서 그 역할의 중요성을 인지합니다. 별Craft II 그랜드마스터 플레이어처럼, 당신의 유닛 구성을 신중하게 계획하고, 항상 데이터 엔지니어링 도구 상자를 확장하고 최적화하세요. 데이터 영역에서의 다음 임무까지, 여러분의 파이프라인이 원활히 흐르고 승리가 시간이 잘 맞은 레베이저 사격만큼 달콤하길 바랍니다.

<img src="/assets/img/2024-06-22-ExploringStarCraft2datawithAirflowDuckDBandStreamlit_18.png" />