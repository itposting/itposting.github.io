---
title: "Claude-Sonnet 35로 텍스트를 SQL로 변환하는 챗봇 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_0.png"
date: 2024-06-27 18:48
ogImage: 
  url: /assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_0.png
tag: Tech
originalTitle: "Build a text to SQL chatbot with Claude-Sonnet 3.5."
link: "https://medium.com/@arslanshahid-1997/build-a-text-to-sql-chatbot-with-claude-sonnet-3-5-621a5bf9f922"
---


## Claude Sonnet 3.5을 사용한 텍스트-SQL 및 GPT 모델과의 벤치마킹

![image](/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_0.png)

Anthropic은 최신 주력 모델인 Claude 3.5를 공개했습니다. 이 광범위한 응용 분야에 이상적인 이 첨단 모델은 인간과 유사한 응답을 이해하고 생성하는 데 뛰어납니다. 이 게시물에서는 Claude 3.5와 Vanna AI를 사용하여 데이터베이스와 상호 작용하기 위한 텍스트-SQL 파이프라인을 구축하는 방법을 시연하겠습니다.

마지막으로, Claude의 SQL 작업 성능을 OpenAI 모델과 비교한 결과를 보여드렸습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_1.png)

![image](/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_2.png)

# 시작하기

```js
from vanna.vannadb.vannadb_vector import VannaDB_VectorStore
from vanna.base import VannaBase
from vanna.anthropic.anthropic_chat import Anthropic_Chat


class MyVanna(VannaDB_VectorStore, Anthropic_Chat):
    def __init__(self, config=None):
        MY_VANNA_MODEL =  # https://vanna.ai/account/profile에서 가져온 모델 이름
        VannaDB_VectorStore.__init__(self, vanna_model=MY_VANNA_MODEL, vanna_api_key= # Vanna_API 키를 여기에 입력, config=config)
        Anthropic_Chat.__init__(self, config=config)

api_key = # 여기에 API 키를 입력해 주세요
# 모델을 원하는 Anthropic 모델로 변경할 수 있습니다
# Sonnet와 Haiku를 사용할 수 있지만, 이 포스트에서는 Opus를 사용합니다
model = "claude-3.5-sonnet-20240620"
config = {'api_key':api_key, 'model':model}

# 설정을 MyVanna 객체에 전달합니다
vn = MyVanna(config=config)
``` 


<div class="content-ad"></div>

# 데이터베이스 연결하기

Vanna에는 이러한 8개의 데이터베이스에 대한 내장 커넥터가 있습니다 (추가 몇 줄의 코드로 다른 데이터베이스에 연결할 수도 있습니다):

- Postgres SQL
- Oracle
- DuckDB
- MySQL
- SQLite
- Big Query
- Snowflake
- Microsoft SQL

문서를 확인하면 특정 데이터베이스에 연결하는 방법을 이해할 수 있습니다. 이 게시물의 목적을 위해, 저는 DuckDB StackOverFlow 데이터베이스에 연결할 것입니다. 데이터베이스는 여기에서 찾을 수 있습니다!

<div class="content-ad"></div>

```js
# DuckDB 데이터베이스에 연결하는 방법입니다
vn.connect_to_duckdb(url='motherduck:[<데이터베이스_이름>]?motherduck_token=<토큰>&saas_mode=true')
```

# 교육

<img src="/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_3.png" />

# 플랜(정보 스키마)에 대한 교육


<div class="content-ad"></div>

```js
# 데이터베이스에 따라 정보 스키마 조회 쿼리를 조정해야 할 수도 있습니다. 이것은 좋은 시작점입니다.
df_information_schema = vn.run_sql("SELECT * FROM INFORMATION_SCHEMA.COLUMNS")
```

```js
# 이 코드는 정보 스키마를 작은 조각으로 나누어서 LLM이 참조할 수 있도록 합니다.
plan = vn.get_training_plan_generic(df_information_schema)
plan
```

```js
# Plan이 마음에 드시면 이 부분을 주석 해제하고 실행하여 학습시키세요.
vn.train(plan=plan)
```

# DDL 학습하기

<div class="content-ad"></div>

```js
# DuckDB에서 describe 문을 사용하여 모든 테이블의 DDL을 가져올 수 있어요
vn.train(ddl="DESCRIBE SELECT * FROM Stackoverflow.users;")
```

# SQL 문장에 대한 학습

```js
# SQL 문장에 대한 학습 예시 입니다.
vn.train(
question="뱃지 수가 가장 많은 상위 10명의 사용자는 누구인가요?"
,sql="""SELECT UserId, COUNT(*) AS badge_count
FROM stackoverflow.main.badges
GROUP BY UserId
ORDER BY badge_count DESC
LIMIT 10
""")
# 또 다른 예시
vn.train(
question="가장 많은 답변을 낸 사용자와 가장 작은 질문을 낸 사용자 간의 총 답변 차이는 무엇인가요?", 
,sql="SELECT MAX(answer_count) - MIN(answer_count) AS difference
FROM (
    SELECT OwnerUserId, COUNT(*) AS answer_count
    FROM stackoverflow.main.posts
    WHERE PostTypeId = 2
    GROUP BY OwnerUserId
) AS answer_counts;
")
```

# 문서에 대한 학습

<div class="content-ad"></div>

```js
# vn.train(documentation="We call the user with the highest answers in a year the Grand master")을 사용하여 맥락 정보를 제공할 수 있습니다.
```

vn.get_training_data()를 사용하여 훈련 데이터를 확인할 수 있습니다.

```js
# vn.ask는 다음 함수들을 순차적으로 실행하는데, 각각을 개별적으로 실행할 수 있습니다
# 1. vn.generate_ql
# 2. vn.run_sql
# 3. vn.generate_plotly_code
# 4. vn.get_plotly_figure
```

```js
# 훈련 후 Vanna에게 질문할 수 있는 방법
vn.ask('가장 많은 배지를 보유한 상위 10명의 사용자를 찾아주세요?')
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_4.png" />

# Flask 앱 사용하기

Vanna에는 내장된 UI Flask 앱이 포함되어 있습니다. 이는 주피터 노트북이나 Python 스크립트 내에서 실행할 수 있습니다.

```js
from vanna.flask import VannaFlaskApp
app = VannaFlaskApp(vn)
app.run()
```

<div class="content-ad"></div>


![image](/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_5.png)

# 벤치마크

클로드 소넷 3.5와 GPT 4o를 비교해보았습니다. 우리가 준비한 벤치마크를 사용하여 비교해보았습니다. (스키마 전용은 Vanna가 데이터 정의 언어(DDL)에만 훈련되었음을 나타내며, 스키마 및 참조 SQL은 SQL 질문 쌍에 대해 훈련되었음을 나타냅니다.)

## 스키마 전용


<div class="content-ad"></div>


<img src="/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_6.png" />

Claude sonnet 3.5 performs rather poorly compared with other LLMs when only trained on schema information. Which is odd.

## Schema-and-reference-SQL

<img src="/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_7.png" />


<div class="content-ad"></div>

상당히 놀라운 사실인데, 레퍼런스 SQL과 SQL 질문 쌍을 사용하여 훈련시킨 Claude-3.5가 모든 다른 LLM들보다 우수한 성능을 보이고 있습니다.

# 평균

![이미지](/assets/img/2024-06-27-BuildatexttoSQLchatbotwithClaude-Sonnet35_8.png)

따라서, 두 점수의 평균을 내면, Claude-Sonnet 3.5는 GPT-4o와 비슷한 범위의 성능을 보여줍니다.

<div class="content-ad"></div>

읽어 주셔서 감사합니다!