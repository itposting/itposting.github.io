---
title: "제목 제로부터 dbt까지 스포티파이의 백만 개 플레이리스트 데이터를 분석하고 데이터 모델 구축하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_0.png"
date: 2024-06-19 09:52
ogImage: 
  url: /assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_0.png
tag: Tech
originalTitle: "From Zero to dbt: How to Analyze and Build Data Models from Spotify’s Million Playlist Data"
link: "https://medium.com/inthepipeline/from-zero-to-dbt-how-to-analyze-and-build-data-models-from-spotifys-million-playlist-data-241c3d8c9b5d"
---


<img src="/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_0.png" />

앞으로 몇 주 동안, dbt (data build tool)를 사용하여 Spotify의 백만 개 플레이리스트 데이터셋을 엔드 투 엔드 분석 프로젝트로 변환하는 방법을 안내할 것입니다. 중소형 대형 실제 세계 원시 데이터를 상호 작용적인 데이터 모델로 변환하는 방법을 배우게 될 거에요. (어떤걸 🤣 기반으로 한 George Orwell의 하층층상 중간층에요)

## 배울 내용

- 30GB의 원시 JSON 데이터를 효율적이고 확장 가능하게 5GB Parquet 파일로 변환하기.
- Parquet 파일을 심층적인 탐색과 분석을 위한 여러 dbt 모델로 변환하기.
- 데이터 변환 프로세스에서 dbt를 사용하는 것이 왜 최선의 실천법인지 이해하기.
- 데이터 무결성과 정확성을 보장하기 위해 각 dbt 모델 변경을 검증하는 방법에 대해 배우기 (스포일러: 오픈 소스 dbt 모델 코드 리뷰 도구인 Recce를 사용하세요).

<div class="content-ad"></div>

## 데이터로부터 중요한 질문에 답변해주세요

매주 Recce LinkedIn 페이지에 스포티파이 데이터셋에 관한 두 가지 질문을 게시할 것입니다. 예를 들어,

- 적어도 3곡의 테일러 스위프트 노래를 포함하는 재생 목록은 몇 개인가요?
- 제이 체오의 인기 있는 상위 10곡은 무엇인가요?
- BLACKPINK 💗과 Post Malone이 모두 포함된 재생 목록은 몇 개인가요?

그 후에 투표를 가장 많이 받은 질문을 오픈 소스 저장소에 구현할 것입니다.

<div class="content-ad"></div>

## 누구를 위한 것인가요?

비즈니스 BI 또는 ML을 위해 데이터 변환에 dbt를 사용하는 방법에 관심이 있는 모든 분들을 환영합니다. 뿐만 아니라, 데이터 또는 분석 엔지니어로 계속된 작업에 유용한 몇 가지 dbt 모베스트 사항을 함께 공유할 예정입니다.

# 백만 플레이리스트 데이터 준비하기

시작할 준비가 되셨나요? 멋지네요. 이 프로젝트에서는 스포티파이 백만 플레이리스트 데이터셋을 사용할 예정입니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_1.png)

## 데이터셋 다운로드

Spotify 정책에 따라 등록하고 여기서 원시 데이터를 다운로드해야 합니다. 우리는 spotify_million_playlist_dataset.zip 파일을 사용할 거에요 (크기는 5.4 GB 👀).

이 zip 파일은 31GB로 풀리니 충분한 공간이 있는지 확인해주세요! (나중에 Parquet으로 변환하면 용량이 줄어듭니다)


<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:960/1*HbIZkLZc-9ClzgToTNLvsg.gif)

데이터셋을 다운로드하고 압축 해제한 후, data 폴더에는 천 개의 분할된 JSON 파일로 구성되어 있음을 발견할 것입니다. 이러한 파일들은 다음과 같은 패턴으로 명명되어 있습니다:

- mpd.slice.0–999.json
- mpd.slice.1000–1999.json
- …
- mpd.slice.999000–999999.json

분할된 JSON 파일 중 하나에서 플레이리스트 항목의 전형적인 예시는 다음과 같습니다:


<div class="content-ad"></div>

![링크](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_2.png)

데이터셋의 각 JSON 파일은 1,000개의 재생목록을 나타내며, 총 1백만 개의 재생목록이 포함되어 있습니다. 파일 접두사 "mpd"는 "Million Playlist Dataset"의 약자입니다.

Spotify 팀은 이러한 JSON 파일의 무결성을 확인하고 MD5 체크섬을 사용하여 기본 통계를 계산하는 데 도움이 되도록 ./src 폴더에 스크립트를 제공했습니다. 아래 명령어로 기본 통계를 계산할 수 있습니다:

```js
$ python src/stats.py data
```

<div class="content-ad"></div>

Spotify의 README 문서에 따르면, 이 프로그램의 결과물은 'stats.txt' 내용과 일치해야 합니다. stats.py의 실행 시간은 노트북의 성능에 따라 다를 수 있으며, 30분을 초과할 수도 있습니다.

# 초기 인사이트

우리는 우선적으로 몇 가지 탐구를 시작해 초기 인사이트를 얻고 데이터셋을 더 잘 이해할 것입니다. 이 작업은 raw json을 사용하여 이루어질 것이지만, 더 고급 데이터 상호작용을 위해서는 데이터를 더 효율적인 형식으로 변환해야 할 것입니다. 이에 Parquet을 사용할 것이며 (자세한 내용은 아래에 소개되어 있음), 이는 dbt와 함께 사용하기에 이상적이며 raw 데이터를 변환하는 데 유용합니다.

Spotify의 1000개 raw 데이터 파일로 되돌아가보죠. 모든 데이터 분석 처리 워크플로우에서 겪었던 노고와 눈물이 어떤 것이었는지 보여드리겠습니다.

<div class="content-ad"></div>

# DuckDB 및 jq

DuckDB와 jq는 모두 JSON 데이터와 상호 작용하기 위한 훌륭한 도구입니다. 이 멋진 도구들을 설치하려면 선호하는 패키지 관리자를 사용하십시오. 예를 들어:

```sh
$ brew install duckdb
$ brew install jq
```

## JSON 구조 이해하기

<div class="content-ad"></div>

우리는 JSON 데이터를 빠르게 확인하기 위해 jq를 사용할 수 있습니다. 이후 보다 심층적인 분석을 위해 DuckDB를 활용할 수 있습니다. 1000개 파일 중 하나를 살펴보겠습니다:

```js
$ cd spotify_million_playlist_dataset/data
$ jq 'keys' mpd.slice.0-999.json
```

Markdown 양식으로 표를 변경했습니다:

![표](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_3.png)

JSON의 모든 조각은 두 개의 키만 포함하고 있습니다.

<div class="content-ad"></div>

- 정보 — 이것은 단순히 JSON 파일의 메타데이터입니다.
- 재생 목록 — 실제로 관심 있는 데이터

아마도 "재생 목록"이 배열이라는 것을 짐작하실 수 있습니다. 따라서 재생 목록에서 첫 번째 요소를 살펴보겠습니다.

![이미지](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_4.png)

부분 재생 목록 데이터(첫 번째 트랙만 표시)는 다음과 같이 보일 것입니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_5.png)

# 덕DB로 분석하기

JSON 데이터의 구조를 파악한 후에는 DuckDB를 사용하여 데이터를 분석할 수 있습니다. DuckDB는 SQL 데이터 유형을 JSON 파일 내에서 자동으로 감지하는 기능을 제공하므로 분석에 SQL 구문을 손쉽게 적용할 수 있습니다.

## DuckDB 대화형 셸 열기


<div class="content-ad"></div>

터미널에 duckdb를 입력하면 PostgreSQL의 psql 및 SQLite 셸과 유사한 대화형 셸에 들어갈 수 있어요.

```js
$ duckdb
```

## DuckDB의 maximum_object_size 조정

다음 명령을 실행하면 아래의 오류가 표시됩니다:

<div class="content-ad"></div>

```js
SELECT * FROM read_json_auto('./mpd.slice.0-999.json');

-- "maximum_object_size" of 16777216 bytes exceeded 
-- while reading file "./mpd.slice.0-999.json" (>33554428 bytes).
-- "maximum_object_size"을 늘려주세요.
```

이 오류는 밀리언 플레이리스트 데이터셋의 JSON 슬라이스가 DuckDB의 기본 maximum_object_size보다 크기 때문에 발생했습니다. 따라서 이를 조정하여 40MB로 설정해야 합니다 🫰:

```js
SELECT * 
FROM read_json_auto('./mpd.slice.0-999.json', maximum_object_size = 40000000); 

┌──────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         info         │                                                                            playlists                                                                             │
│ struct(generated_o…  │ struct("name" varchar, collaborative varchar, pid bigint, modified_at bjigint, num_tracks bigint, num_albums bigint, num_followers bigint, tracks struct(pos bi…  │
├──────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ {'generated_on': 2…  │ [{'name': Throwbacks, 'collaborative': false, 'pid': 0, 'modified_at': 1493424000, 'num_tracks': 52, 'num_albums': 47, 'num_followers': 1, 'tracks': [{'pos': …  │
└──────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## JSON 해제하기

<div class="content-ad"></div>

우리는 컬럼 안에 중첩 구조인 재생 목록에만 관심이 있다는 것을 알고 있습니다. 그러므로 플레이리스트 열을 정규화하기 위해 UNNEST를 사용할 수 있습니다:

```js
SELECT UNNEST(playlists) 
FROM read_json_auto('./mpd.slice.0-999.json', maximum_object_size = 40000000) 
LIMIT 5;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                    unnest(playlists)                                                                                    │
│ struct("name" varchar, collaborative varchar, pid bigint, modified_at bigint, num_tracks bigint, num_albums bigint, num_followers bigint, tracks struct(pos bigint, artist_name varch…  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ {'name': Throwbacks, 'collaborative': false, 'pid': 0, 'modified_at': 1493424000, 'num_tracks': 52, 'num_albums': 47, 'num_followers': 1, 'tracks': [{'pos': 0, 'artist_name': Missy …  │
│ {'name': Awesome Playlist, 'collaborative': false, 'pid': 1, 'modified_at': 1506556800, 'num_tracks': 39, 'num_albums': 23, 'num_followers': 1, 'tracks': [{'pos': 0, 'artist_name': …  │
│ {'name': korean , 'collaborative': false, 'pid': 2, 'modified_at': 1505692800, 'num_tracks': 64, 'num_albums': 51, 'num_followers': 1, 'tracks': [{'pos': 0, 'artist_name': Hoody, 't…  │
│ {'name': mat, 'collaborative': false, 'pid': 3, 'modified_at': 1501027200, 'num_tracks': 126, 'num_albums': 107, 'num_followers': 1, 'tracks': [{'pos': 0, 'artist_name': Camille Sai…  │
│ {'name': 90s, 'collaborative': false, 'pid': 4, 'modified_at': 1401667200, 'num_tracks': 17, 'num_albums': 16, 'num_followers': 2, 'tracks': [{'pos': 0, 'artist_name': The Smashing …  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

DuckDB는 UNNEST 함수에서 `recursive := true`와 같이 매우 편리한 옵션을 제공합니다. 이 옵션은 열을 재귀적으로 정규화합니다:

```js
SELECT UNNEST(playlists, recursive := true) 
FROM read_json_auto('./mpd.slice.0-999.json', maximum_object_size = 40000000) 
LIMIT 5;
```

<div class="content-ad"></div>

이렇게 하면 깊게 중첩된 JSON 데이터를 다루기가 매우 편리합니다.

## JSON을 단일 표로 결합

현재, 우리는 하나의 JSON 파일만 처리하고 있습니다. 만약 1,000개의 나누어진 JSON 파일을 모두 한 표로 합치고 싶다면 어떻게 해야 할까요?

DuckDB는 여러 JSON 파일을 한 번에 읽을 수 있게 해주는 glob 구문을 제공합니다. `./mpd.slice.0-999.json`을 `./mpd.slice*.json`로 수정하면 됩니다.

<div class="content-ad"></div>

```js
테이블 태그를 Markdown 형식으로 변경하세요.

CREATE TABLE playlists AS 
SELECT UNNEST(playlists , recursive:= true) 
FROM read_json_auto('./mpd.slice*.json', maximum_object_size = 40000000);
```

내 노트북(M3 MacBook)에서 playlists DuckDB 테이블을 만드는 데 30초가 걸렸어요. 이제 데이터를 Parquet으로 변환할 준비가 되었어요.

## Parquet으로 변환

변환 과정 중간에 메모리 부족 오류를 방지하기 위해 일부 임시 파일이 필요할 수 있습니다. DuckDB 쉘에서 계속하여, 먼저 다음을 실행하세요:

<div class="content-ad"></div>

```js
SET temp_directory='./tmp';
```

이제 DuckDB 테이블에서 플레이리스트를 Parquet 파일로 내보낼 준비가 되었습니다. copy 명령을 사용하여 .parquet 확장자를 갖는 파일을 지정하면 DuckDB가 자동으로 Parquet 파일로 내보내기를 원한다는 것을 알게 됩니다.

```js
COPY playlist TO 'playlists.parquet';
```

쉽죠?


<div class="content-ad"></div>

# Parquet 대 JSON

그래서, 왜 Parquet을 사용해야 할까요?

Parquet은 분석을 위한 우수한 파일 포맷으로, 컬럼 저장 방식을 통해 JSON에 비해 주목할만한 장점을 제공합니다. 이 설계는 데이터 압축 및 인코딩을 향상시켜 저장 공간을 줄이고 데이터 분석 워크플로우의 데이터 액세스 속도를 높이는데 도움이 됩니다.

<div class="content-ad"></div>

복잡한 중첩 데이터 구조도 지원하며 기존 데이터를 수정하지 않고 새 열을 추가할 수 있는 유연한 스키마 진화를 제공합니다. 이는 스키마 변경이 자주 발생하는 시나리오에 이상적인 형식이 됩니다.

또한, 주요 데이터 웨어하우스와의 호환성을 통해 Parquet은 특히 dbt 사용자에게 매우 중요하며 데이터 통합 및 분석 워크플로우를 간소화합니다. 즐겨 사용하는 데이터 웨어하우스에서 쉽게 Parquet 파일을 가져오고 내보낼 수 있습니다.

DuckDB와 jq를 사용하면 기가바이트의 JSON 데이터를 노트북에서 간단하게 분석할 수 있습니다.

"ON - YOUR - LAPTOP"을 반복해보세요 💻

<div class="content-ad"></div>

# 요약

원본 데이터 세트는 1,000개의 JSON 파일로 이루어져 있으며 총 31GB입니다.

![이미지](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_7.png)

세 가지 간단한 DuckDB 쿼리를 실행한 후 1분의 처리 시간을 거쳐 단일 5.7GB Parquet 파일을 얻게 되어, 500% 개선이 이뤄졌습니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_8.png)

지금은 몇 초 안에 노트북으로 "플레이리스트에 테일러 스위프트 노래가 몇 개 있는지?"와 같은 질문에 빠르게 답변할 수 있습니다. 마음이 홀립니다.

![이미지](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_9.png)

이 데이터 분석 프로젝트의 첫 번째 부분은 여기까지입니다. 곧 두 번째 부분도 뵙겠습니다.

<div class="content-ad"></div>

# 다음에는...

![이미지](/assets/img/2024-06-19-FromZerotodbtHowtoAnalyzeandBuildDataModelsfromSpotifysMillionPlaylistData_10.png)

데이터셋을 Parquet 파일로 성공적으로 전환한 후, 다음 목표는 dbt의 파워를 활용하여 One Million Playlists 데이터셋에서 더 깊고 더 매력적인 분석적 인사이트를 발굴하는 것입니다.

## 데이터에 소프트웨어 엔지니어링 최상의 실천 방법 적용

<div class="content-ad"></div>

덕DB 셸은 데이터 집합을 대화식으로 분석할 수 있는 기능을 제공하지만, 우리의 SQL 변환에 보다 구조화되고 협업적이며 버전 관리된 접근이 필요함을 알 수 있습니다.

여기서 dbt가 빛을 발합니다 🤩. dbt를 사용하면 데이터 변환을 코드로 처리할 수 있어 소프트웨어 엔지니어링 관행인 버전 관리, 코드 리뷰(Recce 빛나요 💖), 그리고 자동화된 테스트를 데이터 워크플로에 적용할 수 있습니다.

## 함께 작업하기

여러 SQL 쿼리를 논리적인 dbt 모델로 구성함으로써, 데이터 변환의 명확성과 유지 관리성을 향상시킬 뿐만 아니라, 데이터 팀이 서로 협력하여 서로의 작업을 점진적으로 빌드할 수 있습니다. 이 협업적인 접근은 데이터 모델이 견고하고 정확하며 최신 비즈니스 로직과 분석적 통찰을 반영하도록 보장합니다.

<div class="content-ad"></div>

## 신뢰할 수 있는 환경

또한, dbt의 문서 기능을 사용하면 데이터 모델의 포괄적인 문서를 자동으로 생성하여 새 팀원들이 데이터 환경을 이해하기 쉽고 이해관계자들이 데이터 주도적 의사결정을 신뢰할 수 있게 합니다.

## 데이터 주도적 개발

요약하면, dbt는 SQL 변환을 효율적으로 관리할 수 있는 필수 도구와 함께 제공하여 협업적이고 반복적인 데이터 문화를 육성하는 데 도움이 되어, 오늘날의 데이터 주도적 세상에서 경쟁력을 유지하는 데 필수적입니다.

<div class="content-ad"></div>

# Part 2에서 만나요

최신 소식을 받아보고 더 흥미로운 소식을 확인하려면 LinkedIn을 팔로우하세요! 🤩

업데이트: Part 2가 이제 사용 가능합니다. 저의 샘플 프로젝트를 따라가면서 dbt가 데이터 프로젝트 모델링에 적합한 이유를 살펴보겠습니다. 아, 그리고 중요한 Spotify 플레이리스트 질문에 대해 답변도 해드립니다!

# 파이프라인에서 더 많은 기사