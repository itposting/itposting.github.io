---
title: "파이썬을 PostgreSQL에 연결하는 방법 데이터 과학자를 위한 단계별 안내"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoconnectPythontoPostgreSQLAStep-by-StepGuideforDataScientists_0.png"
date: 2024-06-19 16:38
ogImage: 
  url: /assets/img/2024-06-19-HowtoconnectPythontoPostgreSQLAStep-by-StepGuideforDataScientists_0.png
tag: Tech
originalTitle: "How to connect Python to PostgreSQL: A Step-by-Step Guide for Data Scientists!"
link: "https://medium.com/@vinny-purgato/how-to-connect-python-to-postgresql-a-step-by-step-guide-for-data-scientists-134b1459a2cd"
---


데이터 과학자들은 종종 분석, EDA, ETL 등의 작업을 수행하기 위해 데이터 웨어하우스에 액세스해야 합니다.

산업에서 가장 인기 있는 데이터베이스 중 하나는 PostgreSQL입니다.

PostgreSQL은 모든 레벨의 개발자와 모든 규모의 기업에서 널리 사용됩니다. 또한 주요 데이터베이스를 완벽하게 구동하는 다양한 확장 기능과 애드온이 있는 멋진 생태계를 가지고 있습니다.

사이드 프로젝트용 사용자 지정 데이터베이스를 만들거나 프로덕션 수준의 트랜잭션/분석용 데이터베이스가 필요한 경우, PostgreSQL은 훌륭한 선택지입니다.

<div class="content-ad"></div>

이해해요, 소리 좋네요. 하지만 여러분이 여기 계신 이유는 파이썬을 PostgreSQL 데이터베이스에 연결하는 방법을 배우기 위해서에요. 따라와서 그 방법을 배우세요!

![이미지](/assets/img/2024-06-19-HowtoconnectPythontoPostgreSQLAStep-by-StepGuideforDataScientists_0.png)

## 1. 가상 환경 생성

많은 데이터 과학자/분석가들이 구글 콜랩 환경에 머물며 가상 환경에 익숙하지 않게 됩니다.

<div class="content-ad"></div>

이것은 코드가 실행될 때마다 항상 올바른 패키지/라이브러리 버전이 일관되게 사용되도록 보장하는 멋진 방법입니다. 따라서 결과의 근본성을 위해 "데이터 과학" 부분을 잊지 마세요.

이를 위한 단계:

- Windows의 명령 프롬프트 또는 Linux/Mac의 터미널을 엽니다.
- 둘째로, 프로젝트 파일을 저장할 새 디렉터리를 만듭니다. 이름은 원하는 대로 할 수 있지만, 저는 'analytics'라고 지을 겁니다:

```js
mkdir analytics
```

<div class="content-ad"></div>

3. 새 디렉토리 안에 내장된 venv 모듈을 사용하여 .venv라는 새 가상 환경을 생성하세요. 문법은 단순합니다. python3 -m venv 만들고자 하는 환경 경로 입니다:

```js
python3 -m venv .venv
```

4. 마지막으로, 가상 환경을 활성화/시작하세요:

```js
# Windows에서
.venv/scripts/activate

# Mac 및 Linux에서
source venv/bin/activate
```

<div class="content-ad"></div>

# 2. psycopg2 모듈 설치

Psycopg2는 PostgreSQL 데이터베이스 드라이버로, 파이썬을 사용하여 PostgreSQL에서 작업을 수행하기 위해 필요합니다.

먼저 다음 pip 명령어를 사용하여 psycopg2 패키지를 설치하세요:

```js
pip install psycopg2
```

<div class="content-ad"></div>

두 번째로, requirements.txt 파일을 만들어주세요:

```js
pip3 freeze > requirements.txt
```

requirements.txt 파일을 작성하면 정확한 패키지 버전을 지정하여 재현성을 확보할 수 있어 일관된 환경과 결과를 얻을 수 있습니다.

# 3. 파이썬에서 PostgreSQL 데이터베이스에 연결하기

<div class="content-ad"></div>

이제 PostgreSQL 데이터베이스에 연결할 준비가 되었습니다.

먼저, 프로젝트 디렉토리에 데이터베이스 연결 매개변수를 저장할 database.ini라는 구성 파일을 생성해야합니다.

```js
[postgresql]
host=호스트_주소
database=데이터베이스_이름
user=사용자_이름
password=비밀번호
```

database.ini 파일에서 호스트_주소, 데이터베이스_이름, 사용자_이름, 비밀번호를 실제 값으로 변경해주세요.

<div class="content-ad"></div>

이제 프로젝트 디렉토리에 config.py라는 새 파일을 생성합니다:

```js
touch config.py
```

이제 데이터베이스.ini 파일에서 구성 데이터를 읽는 함수를 작성해 봅시다:

```js
from configparser import ConfigParser

def load_config(filename='database.ini', section='postgresql'):
  parser = ConfigParser()
  parser.read(filename)

  # 섹션 가져오기, 기본값은 postgresql
  config = {}
  if parser.has_section(section):
    params = parser.items(section)
    for param in params:
      config[param[0]] = param[1]
  else:
    raise Exception('섹션 {0}을 {1} 파일에서 찾을 수 없습니다.'.format(section, filename))
  return config

if __name__ == '__main__':
  config = load_config()
  print(config)
```

<div class="content-ad"></div>

load_config() 함수는 Python의 내장 configparser 패키지를 사용하여 database.ini 파일에서 데이터를 읽습니다.

database.ini를 사용하면 Python에 직접 자격 증명을 하드 코딩하는 것이 아니기 때문에 PostgreSQL 연결 매개변수는 서로 다른 환경(예: 테스트, 운영 및 개발)에서 사용될 때 유연해집니다.

그러나 귀하의 database.ini 파일을 .gitignore 파일에 항상 추가하여 코드를 Git Hub에 푸시할 때 외부에 귀하의 자격 증명을 노출하지 않도록하십시오.

단순히 .gitignore 파일을 만들고 다음 줄을 추가하십시오:

<div class="content-ad"></div>

마지막으로 database.ini 파일을 생성하겠습니다. 그리고 load_config() 함수를 사용하여 데이터베이스 구성을 읽고, 최종적으로 코드를 PostgreSQL에 연결할 connect.py라는 새 파일을 만들어보겠습니다:

```js
import psycopg2
from config import load_config

def connect(config):
  """ PostgreSQL 데이터베이스 서버에 연결 """
  try:
    with psycopg2.connect(**config) as conn:
      print('PostgreSQL 서버에 연결되었습니다.')
      return conn
  except (psycopg2.DatabaseError, Exception) as error:
    print(error)

if __name__ == '__main__':
  config = load_config()
  connect(config)
```

config.py 모듈을 사용하기 때문에 구성을 connect() 함수로 전달하고, ** 연산자를 사용하여 언패킹할 수 있습니다.

<div class="content-ad"></div>

위의 방법이 다음과 같이 자격 증명을 직접 함수에 전달하는 대안보다 더 나은 방법이며 안전합니다.

```js
conn = psycopg2.connect(
    host="호스트 주소",
    database="데이터베이스 이름",
    user="귀하의 사용자 이름",
    password="귀하의 비밀번호"
)
```

# 마무리 맺음

PostgreSQL은 멋지며 Python과 결합되면 더욱 좋습니다. 데이터베이스.ini, connect.py 및 config.py 파일을 구성 폴더에 보관하는 것을 적극 권장합니다. 이렇게 결정하신 경우 load_config() 함수의 'filename' 인수를 "config/database.ini"로 수정해야 합니다.

<div class="content-ad"></div>

만약 이 튜토리얼이 마음에 드셨다면 친구들과 공유하고, 어떤 부분이 가장 마음에 들었고 더 개선할 점이 있다면 댓글을 남겨주세요. LinkedIn과 GitHub에서 저를 팔로우하시고 궁금한 점이 있으면 언제든지 연락해 주세요.