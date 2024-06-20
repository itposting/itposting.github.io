---
title: "파이썬에서 SQLite3를 활용하여 시작하기 테이블 생성 및 행 추출하기"
description: ""
coverImage: "/assets/img/2024-06-19-GetStartedwithSQLite3inPythonCreatingTablesandFetchingRows_0.png"
date: 2024-06-19 16:21
ogImage: 
  url: /assets/img/2024-06-19-GetStartedwithSQLite3inPythonCreatingTablesandFetchingRows_0.png
tag: Tech
originalTitle: "Get Started with SQLite3 in Python, Creating Tables and Fetching Rows"
link: "https://medium.com/towards-data-science/get-started-with-sqlite3-in-python-creating-tables-fetching-rows-a52bdf41e52a"
---


<img src="/assets/img/2024-06-19-GetStartedwithSQLite3inPythonCreatingTablesandFetchingRows_0.png" />

# 개요

- 소개 — SQLite 및 SQLite3이란 무엇인가?
- 첫 번째 SQLite 데이터베이스 만들기
- 커넥터 및 커서
- 테이블 생성
- 데이터베이스에 행 삽입
- 데이터베이스에서 행 가져오기
- 마무리

<div class="content-ad"></div>

현대 IT 전문가들에게 가장 중요한 핵심 기술 중 하나는 구조화된 질의 언어(SQL)입니다. 이는 관계형 데이터베이스와 상호 작용하기 위해 사용되는 선언형 언어입니다. 데이터 엔지니어와 분석가들은 주로 SQL을 사용하여 데이터 파이프라인을 실행하고 데이터 내에서 유용한 관계를 조사합니다.

SQL 경험이 없을 때는 PostgreSQL 또는 MySQL과 같은 일반적인 데이터베이스 관리 시스템(DBMS)으로 넘어가는 것이 다소 무섭습니다. 다행히 SQLite는 SQL 기초를 배우기에 좋은 옵션입니다. 별도의 서버 프로세스가 없기 때문에 설정하기 쉽고 관리하기 쉽습니다. 따라서 데이터 엔지니어와 데이터 분석가들은 일반적으로 SQLite보다 다른 데이터베이스 관리 시스템을 사용하지만 SQL을 배우기 좋은 장소입니다. 실제로 SQLite는 세계에서 가장 널리 사용되는 DBMS입니다!

게다가, Python 라이브러리인 sqlite3은 SQLite와 상호 작용하기 위한 간단한 인터페이스입니다. 이 블로그 포스트에서는 SQLite와 sqlite3 라이브러리를 사용하여 두 가지 주요 개념을 배웁니다:

- CREATE TABLE, INSERT INTO, 그리고 SELECT — FROM과 같은 가장 기본적이고 유용한 SQL 명령어 사용 방법.
- 어떻게 프로그래밍 언어(우리의 경우 Python)를 사용하여 관계형 데이터베이스와 상호 작용할 수 있는지.

<div class="content-ad"></div>

SQLite 데이터베이스를 설정하고 Python에서 sqlite3를 사용하여 데이터베이스 연결을 만들고 데이터범들을 삽입/검색할 것입니다. SQL 전문가가 되는 것이 목표는 아니고, SQL이 어떻게 사용되는지 보고 시작하기 위한 몇 가지 기본 명령을 배우는 것입니다. 더 배우고 싶다면, 이 블로그 포스트와 같이 시작하는 8개의 무료 YouTube 비디오가 있습니다.

# 우리 첫 번째 SQLite 데이터베이스 생성

SQLite 공식 웹페이지에서 SQLite 다운로드에 대한 정보를 찾을 수 있습니다. 그러나 대부분의 경우 SQLite는 이미 대부분의 기기에 포함되어 있으므로 필요하지 않습니다. 또한 Python에서 sqlite3 라이브러리가 필요하지만, 이것은 표준 라이브러리에 포함되어 있고 대부분의 Python 배포판에 포함되어 있습니다. 따라서 대부분의 경우 설치할 것이 없을 것입니다 😃

이미 모든 것이 설치되어 있는지 확인하려면 새로운 Python 파일을 열고 다음 단일 명령어를 작성하십시오:

<div class="content-ad"></div>

```js
import sqlite3
```

만약 위의 파일이 잘 실행된다면, SQLite와 Python 라이브러리 sqlite3이 모두 설치된 것입니다. 준비가 된 것입니다!

import 단계 이후, 데이터베이스에 연결을 생성해야 합니다. 이는 sqlite3 라이브러리의 connect() 함수를 사용하여 수행됩니다:

```js
# 데이터베이스에 연결 생성
connection = sqlite3.connect("music.db")
```

<div class="content-ad"></div>

connect() 함수에 전달된 인수는 데이터베이스의 이름이 될 것입니다. 아직 데이터베이스가 없기 때문에, 이는 우리를 위해 새 데이터베이스를 단순히 생성할 것입니다. 이제 Python 파일을 실행하면, 작업 중인 디렉토리에 music.db라는 새 파일이 나타날 것입니다. 이것이 우리의 데이터베이스입니다!

관계형 데이터베이스는 여러 테이블로 구성됩니다. 이것이 처음이시라면, 이를 엑셀 시트 모음과 같다고 생각할 수 있습니다. 이는 관계형 데이터베이스가 얼마나 강력한지를 과소평가하지만, 처음에는 좋은 정신적 모델입니다.

연결 객체를 만든 후에는 커서를 만들어야 합니다. 커서는 데이터베이스에 대해 SQL 명령을 실행할 수 있습니다. 이를 만들기 위해, 연결 객체에서 .cursor() 메서드를 사용합니다.

```js
# 커서 만들기
cursor = connection.cursor()
```

<div class="content-ad"></div>

현재 변수 cursor에는 데이터베이스에서 데이터를 삽입하고 가져올 수 있는 커서 개체가 포함되어 있습니다. 지금까지 다음 코드를 작성했어야 합니다:

```js
import sqlite3

# 데이터베이스 연결 생성
connection = sqlite3.connect("music.db")

# 커서 생성
cursor = connection.cursor()
```

# 테이블 생성

우선 데이터베이스에 테이블이 필요합니다. 우리는 80년대 노래를 나타내는 데이터를 사용할 것입니다. 커서 개체에서 execute() 메서드를 호출하여 SQL 문을 실행할 수 있습니다. 우리가 배울 첫 번째 문은 CREATE TABLE 문입니다.

<div class="content-ad"></div>

```js
# 테이블 만들기
cursor.execute("CREATE TABLE IF NOT EXISTS songs(name, artist, album, year, duration)")
```

위 명령어에서 볼 수 있듯이, 우리는 노래라는 테이블을 생성합니다. 이 테이블은 이름, 아티스트, 앨범, 연도 및 재생 시간 다섯 가지 열을 가지고 있습니다. 옵션인 IF NOT EXISTS는 테이블이 이미 존재하지 않을 경우에만 테이블을 생성하도록 보장합니다. 테이블이 이미 존재하는 경우에는 명령이 실행되지 않습니다.

지금은 테이블이 비어 있지만, 스키마는 명확합니다. 우리는 각 노래의 이름, 아티스트, 앨범, 연도 및 재생 시간과 같은 관련 정보를 기록하는 테이블을 설정하고 있습니다. 곧 이 테이블을 다양한 노래를 나타내는 행으로 채워 넣을 것입니다.

Python 파일을 실행한 후에 당신의 첫 번째 생각은 현재 디렉토리에 있는 music.db 데이터베이스 파일을 열어서 어떤 일이 발생했는지 조사하는 것이 될 것입니다. 그러나 music.db 파일의 정보는 이렇게 직접 열어서 확인할 목적으로는 설정되지 않았습니다. 여기에 있는 정보는 열람하려는 목적으로는 표시되지 않은 형식으로 보일 것입니다. 우리는 데이터베이스의 정보를 읽기 위해 더 많은 SQL 명령어를 작성해야 할 것입니다.

<div class="content-ad"></div>

SQL 명령어를 처음 배우셨군요! SQL 명령어와 Python 라이브러리 sqlite3을 구분해야 합니다. SQL 명령어는 CREATE TABLE ... 이라는 문장 뿐입니다. 연결(connection)과 커서(cursor)는 데이터베이스와 상호 작용하는 데 사용되는 Python 객체입니다.

# 데이터베이스에 행 삽입하기

이제 단일 테이블이 있는 데이터베이스를 가지게 되었어요. 하지만 테이블은 비어 있습니다! 데이터베이스를 유용하게 활용하기 위해서는 데이터가 필요합니다. 이제 SQL 키워드 INSERT INTO을 사용하여 데이터를 데이터베이스 테이블에 삽입하는 방법을 살펴봅시다. 먼저 각 노래를 정보 튜플로 나타낸 노래 목록을 만듭니다:

```js
# 노래 테이블의 행
songs = [
    ("I Wanna Dance with Somebody (Who Loves Me)", "Whitney Houston", "Whitney", 1987, 291),
    ("Dancing in the Dark", "Bruce Springsteen", "Born In The U.S.A.", 1984, 241),
    ("Take On Me", "a-ha", "Hunting High and Low", 1985, 225),
    ("Africa", "TOTO", "Toto IV", 1982, 295),
    ("Never Gonna Give You Up", "Rick Astley", "Whenever You Need Somebody", 1987, 213)
]
```

<div class="content-ad"></div>

각 튜플에는 노래 테이블의 열과 대응하는 다섯 부분이 있음을 확인할 수 있습니다. 첫 번째 노래에 대해 다음과 같습니다:

- 이름: I Wanna Dance with Somebody (Who Loves Me)
- 아티스트: Whitney Houston
- 앨범: Born In The U.S.A.
- 발매 연도: 1987년
- 재생 시간 (초): 291

이제 준비된 행이 있으니, 이를 music.db 데이터베이스의 songs 테이블에 삽입해야 합니다.

이 작업을 수행하는 한 가지 방법은 한 번에 한 개의 행을 테이블에 삽입하는 것입니다. 다음 코드는 첫 번째 노래를 테이블에 삽입합니다:

<div class="content-ad"></div>

```js
# 데이터베이스에 단일 값을 삽입합니다
cursor.execute("INSERT INTO songs VALUES(?, ?, ?, ?, ?)", songs[0])
connection.commit()
```

여기서는 노래 목록에서 첫 번째 노래를 선택하여 이를 테이블 songs에 삽입합니다. 테이블을 삽입할 때는 SQL 명령어 INSERT INTO table VALUES를 사용합니다. 마지막으로 .commit() 메소드를 사용하여 트랜잭션이 완전히 완료되도록 합니다.

이 접근법을 Python의 for 루프로 반복하면 다음 코드를 사용하여 테이블에 모든 행을 삽입할 수 있습니다:

```js
# 루핑을 통해 모든 값들을 테이블에 삽입합니다
for song in songs:
    cursor.execute("INSERT INTO songs VALUES(?, ?, ?, ?, ?)", song)
    connection.commit()
```

<div class="content-ad"></div>

이곳에는 새로운 SQL 명령이 없습니다. 노래 테이블에 모든 행이 삽입되도록 하는 몇 가지 Python 논리만 있습니다.

위 방법의 단점은 많은 행을 삽입해야 할 때 상당히 느리다는 것입니다. 우리의 예제에서는 노래가 몇 곡뿐이기 때문에 모든 것이 빠릅니다. 그러나 관계형 데이터베이스의 테이블에는 수백만 또는 심지어 수십억 개의 행이 들어갈 수 있습니다. 그런 경우에는 Python에서 루핑이 삽입 작업을 느리게 만들 수 있습니다.

이를 해결하기 위한 방법은 한꺼번에 모든 행을 삽입하는 것이며, 순환하지 않는 것입니다. 지금까지 사용한 .execute() 메서드 대신 커서 객체의 .executemany() 메서드를 사용하여이 작업을 수행할 수 있습니다. 다음 코드는 모든 행을 한 번에 삽입하는 방식입니다:

```js
# 일괄 처리 방식으로 한꺼번에 모든 값을 삽입할 수 있음
cursor.executemany("INSERT INTO songs VALUES(?, ?, ?, ?, ?)", songs)
connection.commit()
```

<div class="content-ad"></div>

데이터베이스 music.db에 테이블 songs가 있고 몇 개의 행이 이미 삽입되어 있습니다. 지금까지 작성한 코드(주석 제외)는 다음과 같습니다:

```js
import sqlite3

songs = [
    ("I Wanna Dance with Somebody (Who Loves Me)", "Whitney Houston", "Whitney", 1987, 291),
    ("Dancing in the Dark", "Bruce Springsteen", "Born In The U.S.A.", 1984, 241),
    ("Take On Me", "a-ha", "Hunting High and Low", 1985, 225),
    ("Africa", "TOTO", "Toto IV", 1982, 295),
    ("Never Gonna Give You Up", "Rick Astley", "Whenever You Need Somebody", 1987, 213)
]

connection = sqlite3.connect("music.db")

cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS songs")

cursor.execute("CREATE TABLE IF NOT EXISTS songs(name, artist, album, year, duration)")

cursor.executemany("INSERT INTO songs VALUES(?, ?, ?, ?, ?)", songs)
connection.commit()
```

자세히 살펴보면 코드에 새 줄을 sneaked했습니다. 이 줄은 SQL 명령문 DROP TABLE IF EXISTS songs를 실행하는 줄입니다. 위의 코드를 실행하면 먼저 테이블이 있으면 삭제한 다음 다시 만듭니다.

이렇게 하면 다른 결과가 나오지 않도록 합니다. 위의 Python 파일을 실행하면 데이터베이스 상태를 재설정하고 다음 섹션에서 동일한 결과를 얻어야 합니다. 프로덕션 시스템에서 이런 문을 사용하면 행을 삽입할 때마다 전체 테이블이 다시 만들어져 매우 비용이 발생할 수 있습니다. 그러나 여기서 하는 실험에는 적합합니다.

<div class="content-ad"></div>

# 데이터베이스에서 행을 불러오는 중

![이미지](/assets/img/2024-06-19-GetStartedwithSQLite3inPythonCreatingTablesandFetchingRows_1.png)

이제 데이터베이스에서 행을 다시 불러오는 시간이에요. 이를 위해 SQL 키워드 SELECT와 FROM을 사용할 거에요. 데이터베이스에서 한 곡을 가져오는 것부터 시작해볼까요:

```js
# 한 곡 가져오기
single_song = cursor.execute("SELECT * FROM songs").fetchone()
print(single_song)
```

<div class="content-ad"></div>

보통은 SQL 문을 실행하기 위해 커서 개체에 .execute() 메서드를 사용합니다. 문 SELECT * FROM songs는 데이터베이스에서 모든 열과 모든 행을 불러옵니다. 그러므로 이는 모든 것을 우리에게 제공합니다. 그러나 sqlite3에서 .fetchone() 메서드를 사용하여 이러한 행 중 하나만 불러옵니다. 이렇게 하면 우리가 Python 파일을 실행할 때 하나의 노래만 출력하게 됩니다.

와일드카드 심볼 *을 사용하여 모든 열을 다시 검색했습니다. 일부 열만 필요한 경우 다음과 같이 지정할 수 있습니다:

```js
# 하나의 노래의 이름과 아티스트 열만 불러오기
name_and_artist = cursor.execute("SELECT name, artist FROM songs").fetchone()
print(name_and_artist)
```

.fetchone() 메서드 외에도 .fetchmany(number_of_rows) 및 .fetchall() 메서드를 사용하여 더 많은 행을 가져올 수 있습니다. 다음 코드는 .fetchall() 메서드를 사용하여 모든 노래를 선택합니다:

<div class="content-ad"></div>

```js
# 모든 행과 열을 다시 가져오기
full_songs = cursor.execute("SELECT * FROM songs").fetchall()
print(full_songs)
```

파이썬으로 정보를 가져온 후에는 유용한 통찰을 얻기 위해 표준 파이썬 논리를 사용할 수 있습니다. 다음 코드는 데이터베이스의 모든 노래에 대한 평균 재생 시간을 찾아내는 예시입니다.

```js
# Python 논리로 평균 재생 시간 얻기
average_duration = 0
for song in full_songs:
    average_duration += song[-1]
average_duration = average_duration / len(full_songs)
print(f"평균 80년대 노래 재생 시간은 {int(average_duration // 60)}분 {int(average_duration % 60)}초 입니다.")
```

우리는 조금 많이 오고 간다고 생각할 수도 있습니다. 이미 파이썬 스크립트에 원본 노래 목록이 있으므로, 왜 먼저 이를 데이터베이스에 삽입한 다음 다시 검색해야 할까요? 이것은 튜토리얼이 조금 인위적인 부분입니다. 실제로 데이터베이스로부터 데이터를 삽입하고 검색하는 파이썬 스크립트가 동일하지는 않습니다. 데이터베이스에 데이터를 삽입하는 여러 파이썬 스크립트(또는 다른 인터페이스)가 있을 수도 있습니다. 따라서 데이터베이스에서 데이터를 가져오고 평균 재생 시간을 계산하는 것이 이 정보를 얻는 유일한 방법일 수 있습니다.

<div class="content-ad"></div>

마지막으로, 작업을 마무리하기 전에 데이터베이스 연결을 닫아야 합니다. 이전에 connection() 함수로 데이터베이스에 연결을 열었습니다. 이를 닫지 않으면 계속 열려 있어 복잡한 애플리케이션에서 성능 및 지속성 문제를 일으킬 수 있습니다. 데이터베이스 연결이 항상 닫혀 있는지 확인하는 것이 좋은 관행입니다. sqlite3에서는 연결 객체의 .close() 메서드를 사용하여 이 작업을 수행할 수 있습니다:

```js
# 연결 닫기
connection.close()
```

다음 코드는 우리가 수행한 모든 작업을 보여줍니다:

```js
import sqlite3

songs = [
    ("I Wanna Dance with Somebody (Who Loves Me)", "Whitney Houston", "Whitney", 1987, 291),
    ("Dancing in the Dark", "Bruce Springsteen", "Born In The U.S.A.", 1984, 241),
    ("Take On Me", "a-ha", "Hunting High and Low", 1985, 225),
    ("Africa", "TOTO", "Toto IV", 1982, 295),
    ("Never Gonna Give You Up", "Rick Astley", "Whenever You Need Somebody", 1987, 213)
]

connection = sqlite3.connect("music.db")

cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS songs")

cursor.execute("CREATE TABLE IF NOT EXISTS songs(name, artist, album, year, duration)")

cursor.executemany("INSERT INTO songs VALUES(?, ?, ?, ?, ?)", songs)
connection.commit()

full_songs = cursor.execute("SELECT name, artist, album, year, duration FROM songs").fetchall()

average_duration = 0
for song in full_songs:
    average_duration += song[-1]
average_duration = average_duration / len(full_songs)
print(f"평균 80년대 노래의 재생 시간은 {int(average_duration // 60)}분 {int(average_duration % 60)}초 입니다.")

connection.close()
```

<div class="content-ad"></div>

# 마무리

![이미지](/assets/img/2024-06-19-GetStartedwithSQLite3inPythonCreatingTablesandFetchingRows_2.png)

이 블로그 포스트가 SQL 명령어와 파이썬의 sqlite3 라이브러리에 대해 이해하는 데 도움이 되었기를 바랍니다. 만약 AI, 데이터 과학, 또는 데이터 엔지니어링에 관심이 있다면 저를 팔로우하거나 LinkedIn에서 연락을 취해 주세요.

제 글이 마음에 드셨나요? 더 많은 콘텐츠를 보시려면 제 다른 글도 확인해보세요!

<div class="content-ad"></div>

- 데이터 과학자로 성공하기 위해 필요한 소프트 스킬
- 데이터 과학자로서 고품질 파이썬 쓰는 법
- 아름다운 타입 힌트를 활용하여 파이썬 코드 현대화하기
- 파이썬으로 결측값 시각화는 놀랍게 쉬워요
- PyOD로 파이썬에서 이상 감지/이상 값 탐지 소개하기 🔥