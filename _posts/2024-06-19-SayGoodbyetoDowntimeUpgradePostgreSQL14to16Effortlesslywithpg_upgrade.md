---
title: "다운타임과 작별하자 pg_upgrade로 PostgreSQL 14에서 16으로 손쉽게 업그레이드하기"
description: ""
coverImage: "/assets/img/2024-06-19-SayGoodbyetoDowntimeUpgradePostgreSQL14to16Effortlesslywithpg_upgrade_0.png"
date: 2024-06-19 15:02
ogImage: 
  url: /assets/img/2024-06-19-SayGoodbyetoDowntimeUpgradePostgreSQL14to16Effortlesslywithpg_upgrade_0.png
tag: Tech
originalTitle: "Say Goodbye to Downtime: Upgrade PostgreSQL 14 to 16 Effortlessly with pg_upgrade"
link: "https://medium.com/@malymohsem/say-goodbye-to-downtime-upgrade-postgresql-14-to-16-effortlessly-with-pg-upgrade-42ef4dbf8524"
---


# 목차

- PostgreSQL 16에서 당신을 기다리고 있는 것은?
- 시작하기
- Debian/Ubuntu용
- RHEL/AlmaLinux/RockyLinux용

![이미지](/assets/img/2024-06-19-SayGoodbyetoDowntimeUpgradePostgreSQL14to16Effortlesslywithpg_upgrade_0.png)

데이터베이스 업그레이드와 다운타임 스트레스로 고생하는 것 지겨우신가요? 걱정 마세요, 개발자 여러분! 본 블로그 포스트에서는 PostgreSQL 14에서 PostgreSQL 16으로의 막연한 전환을 가능케 하는 강력한 도구인 pg_upgrade의 비밀 무기를 소개합니다. 한 줄의 코드도 놓치지 않고 데이터베이스에 터보를 걸겠습니다. 함께 가즈아~!

<div class="content-ad"></div>

안녕히 가세요:

- 다운타임 공지로 사용자들을 헷갈리게 만들지 않아도 됩니다.
- 서커스 공연자처럼 데이터베이스 백업을 번갈아가며 처리할 필요가 없습니다.
- 업그레이드 과정에 땀을 흘리며 데이터 무결성을 빌기를 하지 않아도 됩니다.

pg_upgrade가 여러분 곁에 있다면, PostgreSQL 14에서 16으로 원활하게 전환할 수 있고 데이터베이스는 행복하게 동작할 것입니다. 다운타임이 없고, 머리 아픔도 없고, 어떠한 타협도 필요하지 않습니다. 순수하고 정갈한 데이터베이스의 행복을 경험하게 될 거에요.

# PostgreSQL 16에서 여러분을 기다리는 것은 무엇일까요?

<div class="content-ad"></div>

- 성능 향상: 쿼리가 개선된 인덱싱과 실행 계획으로 속도를 높이는 것을 지켜보세요.
- 강화된 보안: 더 강력한 액세스 제어와 암호화 옵션으로 소중한 데이터가 안전하게 보호되고 있음을 안심하세요.
- 다양한 새로운 기능: 병렬 쿼리 실행부터 개선된 복제까지 다양한 새로운 기능의 보물창고에 뛰어들어 새로운 앱 가능성을 열어보세요.

# 시작하기

# Debian/Ubuntu용

단계 1: PostgreSQL 16을 환영합니다.

<div class="content-ad"></div>

저희 공연의 주인공 PostgreSQL 16을 설치해보세요. 마법이 펼쳐질 겁니다!

```js
# 파일 저장소 구성 파일을 만듭니다:
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# 저장소 서명 키를 가져옵니다:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# 패키지 목록을 업데이트합니다:
sudo apt-get update

# PostgreSQL의 최신 버전을 설치합니다.
# 특정 버전을 원하시면 'postgresql-12' 등을 대신 사용하시면 됩니다:
sudo apt-get -y install postgresql-16
```

단계 2: 데이터베이스 클러스터 확인

pg_lsclusters 명령어를 사용하여 서버가 자랑스럽게 PostgreSQL 14와 PostgreSQL 16을 모두 호스팅하고 있는지 확인해보세요.

<div class="content-ad"></div>

```js
sudo pg_lsclusters
```

Step 3: 업그레이드를 준비합니다.

업그레이드를 위해 PostgreSQL 16 클러스터를 중지합니다.

```js
sudo pg_dropcluster 16 main --stop
```

<div class="content-ad"></div>

Step 4: 업그레이드 프로세스 시작

다음 명령어를 실행하여 업그레이드 프로세스를 시작하세요:

```js
sudo pg_upgradecluster 14 main
```

프로세스를 모니터링하고 성공적으로 완료되면 이전 버전을 자신있게 제거하세요.

<div class="content-ad"></div>


sudo pg_dropcluster 14 main


단계 5: 마지막 작업 — 이전 패키지 제거

PostgreSQL 14의 잔해를 제거하여 이전 패키지를 정리합니다.

```js
sudo apt purge postgresql-14 postgresql-client-14
```

<div class="content-ad"></div>

스텝 6: 확인 - 성공적인 업그레이드 확인하기

업그레이드가 성공적으로 이루어졌는지 확인하기 위해 현재 클러스터를 두 번 확인해보세요.

```js
sudo pg_lsclusters
```

# RHEL/AlmaLinux/RockyLinux

<div class="content-ad"></div>

단계 1: 디지털 하늘 점검

디지턷 우주에 원활하게 연결되었는지 확인하여 여행을 시작해보세요. 별들에 핑을 보내 데이터베이스 모험이 준비됐는지 확인하세요.

```js
ping google.com
```

단계 2: 우주 본질 포착 - 데이터베이스 백업

<div class="content-ad"></div>

여러분의 데이터의 본질을 보존하기 위해 강력한 pg_dumpall 명령을 사용하여 천체적 백업을 만들어 보세요.

```js
sudo su - postgres
pg_dumpall > /path/to/backup/all.sql
exit
```

3단계: 미래를 밝히다 — PostgreSQL 16 등장

우리 우주 쇼의 주인공을 소개합니다 — PostgreSQL 16! 그의 뜨거운 소개를 준비하여 그의 웅대한 데뷔를 위한 무대를 준비하세요.

<div class="content-ad"></div>


# 클러스터 초기화
sudo su
yum install postgresql16-server postgresql16
/usr/pgsql-16/bin/postgresql-16-setup initdb

# 포트 5432에서 5433으로 수정
sudo su - postgres
vim /var/lib/pgsql/16/data/postgresql.conf

# 시작
sudo systemctl start postgresql-16


제 4단계: 대코스믹 변화 — pg_upgrade 심포니

우주의 장엄한 공연 중 하이라이트 — 멋진 pg_upgrade 유틸리티! 버전 14에서 우주의 PostgreSQL 16로의 원활한 전환을 경험해보세요.


/usr/pgsql-16/bin/pg_upgrade \
  -b /usr/pgsql-14/bin/ \
  -B /usr/pgsql-16/bin/ \
  -d /var/lib/pgsql/14/data/ \
  -D /var/lib/pgsql/16/data/ \
  -o ' -c config_file=/var/lib/pgsql/14/data/postgresql.conf' \
  -O ' -c config_file=/var/lib/pgsql/16/data/postgresql.conf'


<div class="content-ad"></div>

단계 5: 천왕의 조화 - pg_hba.conf 편곡

신과 새로운 데이터 디렉터리 사이의 완벽한 동기화를 위해 pg_hba.conf에서 우주 댄스 단계를 조정하세요.

단계 6: 은하 박수! PostgreSQL 16이 무대에 오릅니다

PostgreSQL 16을 위해 일어설 박수를 시작하세요. 박수가 서버 환경에 울려 퍼지도록 해보세요.

<div class="content-ad"></div>

```js
sudo systemctl start postgresql-16
```

7단계: 우주적 향연 — 은하 업그레이드 확인하기

PostgreSQL 16이 우주적인 빛 속에서 빛나도록 해주세요.

```js
bashCopy 코드sudo systemctl status postgresql-16
```

<div class="content-ad"></div>

단계 8: 유성 연결 - 데이터베이스 연결 테스트

우주적인 멋으로 데이터베이스 연결을 테스트하여 유성 세계로 진입하세요.

```js
psql -h localhost -p 5433 -U your_username -d your_database
```

단계 9: 커튼콜 - 은하 무대 청소

<div class="content-ad"></div>

최종 행위가 펼쳐지면서, 우주 시대를 위해 오래된 PostgreSQL 버전을 우아하게 제거해보세요.

```js
sudo su
yum remove postgresql14-server postgresql14
```

그리고 최고의 부분은? 이 업그레이드 축제를 즐기면서도 가동 시간을 희생하지 않아도 된다는 것입니다. 코드를 작성하는 동안에도 계속 데이터베이스 뷔페를 즐길 수 있습니다. 맛있게 즐기세요!

더 많이 배우고 싶나요? 이 블로그 포스트는 업그레이드 낙원으로 가는 길을 안내해줄 것입니다. 처음 준비부터 업그레이드 후 확인까지 과정을 단계별로 안내하여, 여러분이 새로운 높이로 프로젝트를 이끌 준비가 된 세련된, 강력한 PostgreSQL 16 데이터베이스에 도달하도록 보장합니다.

<div class="content-ad"></div>

그래서, 함께하는 개발자 여러분들, 다운타임 문제를 버리고 pg_upgrade 혁명을 받아들이세요. PostgreSQL 16의 모든 잠재력을 발휘하기 위해 함께 하십시오. 당신의 사용자들은 중단되지 않는 데이터베이스 햇빛을 누릴 수 있을 것입니다. 함께 즐거운 여정에 참여해 보세요!