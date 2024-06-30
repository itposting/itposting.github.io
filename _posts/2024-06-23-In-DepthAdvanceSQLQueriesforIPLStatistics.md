---
title: "IPL 통계 분석을 위한 고급 SQL 쿼리 완벽 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_0.png"
date: 2024-06-23 16:34
ogImage:
  url: /assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_0.png
tag: Tech
originalTitle: "In-Depth Advance SQL Queries for IPL Statistics"
link: "https://medium.com/@israksamir353/in-depth-advance-sql-queries-for-ipl-statistics-3f8f8af0e24f"
---

<img src="/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_0.png" />

# 소개:

상상해보세요. BCCI(인도크리켓통제위원회)에서 IPL 2150의 데이터 분석가로 고용되었다고 가정해 봅시다. 네, 2150 년에도 데이터 분석가는 여전히 높은 수요가 있고, AI가 아직 모든 일자리를 대체하지는 않았습니다. 누가 생각했겠습니까? 아마도 AI는 여전히 크리켓의 규칙을 이해하려고 노력 중일지도 모릅니다! 그런데, 이 프로젝트에서는 2150 년 자료가 제공되지 않습니다. 그래서 신경 쓰지 마세요.

당신의 팀 매니저가 IPL 시즌 전체 기록을 포함하는 여러 CSV 파일을 손에 쥐고 여러분에게 접근합니다. 그들은 여러분에게 포괄적인 분석을 수행하고 이 데이터를 Postgres(RDBMS)로 이전하여 팀 내에서 더 효율적인 데이터 관리를 요청합니다.
모든 데이터 집합과 마찬가지로, 도메인 지식은 데이터 분석가가 효과적으로 데이터 분석을 수행하는 데 중요합니다. IPL 크리켓에 익숙하지 않다면, 분석을 진행하기 전에 데이터 집합의 열을 먼저 살펴봄으로써 도메인 지식을 얻는 것이 좋습니다.

<div class="content-ad"></div>

# 데이터 세트:

CSV 파일에는 아래 그림에 표시된 6개의 테이블이 포함되어 있으며, 이를 pgAdmin (postgreSQL의 RDMS)에서 다음 데이터베이스 스키마처럼 변환해야 합니다.
실제 시나리오에서 기업은 일반적으로 CSV에서 SQL 데이터베이스로의 전환보다 DBMS(데이터베이스 관리 시스템)를 직접 사용합니다. 그러나 우리의 SQL 프로젝트 목적으로 이 전환이 수행되었습니다.

<img src="/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_1.png" />

제약 조건:

<div class="content-ad"></div>

- 주어진 스키마에 포함된 기본 키 (Primary Key)와 외래 키 (Foreign Key) 제약 조건
- out_type은 'caught', 'caught and bowled', 'bowled', 'stumped', 'retired hurt', 'keeper catch', 'lbw', 'run out', 'hit wicket', 또는 NULL(실제 null이 아닌 문자열 형태) 값만 가질 수 있습니다.
- role_desc는 'Player', 'Keeper', 'CaptainKeeper' 또는 'Captain' 값만 가질 수 있습니다.
- toss_name은 'field' 또는 'bat' 값만 가질 수 있습니다.
- win_type은 'wickets', 'runs', 또는 NULL(실제 null이 아닌 문자열 형태) 값만 가질 수 있습니다.
- ball_by_ball 테이블의 runs_scored 값은 0에서 6 사이여야 합니다.
- ball_by_ball 테이블의 innings_no 값은 1 또는 2만 가능합니다.

# 분석적 질문 및 해결책:

자세한 분석을 위해 팀 매니저가 다음 작업을 할당하고 명확한 경로를 제시했습니다.

Q 1: 주어진 데이터베이스 스키마에 따라 CSV 파일을 생성하고, 모든 제약 조건과 테이블 간 관계가 올바르게 반영되도록 하고, 그 후 pgAdmin에 가져오세요. (다른 RDBMS를 사용하는 경우, 모든 쿼리에 대해 구문을 조정하십시오)

<div class="content-ad"></div>

해결책: 지정된 데이터베이스 스키마와 일치하도록 필요한 테이블을 적절한 제약 조건과 관계와 함께 생성하고 해당 CSV 파일에서 데이터를 가져옵니다.

```js
-- 해결책 1:
-- 테이블을 생성할 때 위의 데이터베이스 스키마에 따라
-- 필요한 제약 조건 및 관계 키를 추가해주세요

-- venue 테이블 생성
create table if not exists venue(
 venue_id int,
 venue_name varchar(50) not null,
 city_name varchar(50) not null,
 country_name varchar(50) not null,
 constraint pk_venue_venue_id primary key (venue_id)
);
-- venue.csv 파일에서 값 가져오기
copy venue
from 'D:\Downloads\A Portfolio Projects\SQL Projects\IPL Analysis\Dataset CSV\venue.csv'
delimiter ','
csv header;

-- team 테이블 생성
create table if not exists team(
 team_id int,
 team_name varchar(50) not null,
 constraint pk_team_team_id primary key(team_id)
);
-- team.csv 파일에서 값 가져오기
copy team
from 'D:\Downloads\A Portfolio Projects\SQL Projects\IPL Analysis\Dataset CSV\team.csv'
delimiter ','
csv header;

-- player 테이블 생성
create table if not exists player(
 player_id int,
 player_name varchar(50) not null,
 dob date not null,
 batting_hand varchar(50) not null,
 bowling_skill varchar(50) not null,
 country_name varchar(50) not null,
 constraint pk_player_player_id primary key(player_id)
);
-- player.csv 파일에서 값 가져오기
copy player
from 'D:\Downloads\A Portfolio Projects\SQL Projects\IPL Analysis\Dataset CSV\player.csv'
delimiter ','
csv header;

-- match 테이블 생성
create table if not exists match(
 match_id int primary key,
 season_year int not null,
 team1 int not null references team(team_id),
 team2 int not null references team(team_id),
 venue_id int not null references venue(venue_id),
 toss_winner int not null references team(team_id),
 match_winner int not null references team(team_id),
 toss_name varchar(50) not null check(toss_name in ('field', 'bat')),
 win_type varchar(50) not null check(win_type in ('wickets', 'runs', 'NULL')),
 man_of_match int not null references player(player_id),
 win_margin int not null
)
-- match.csv 파일에서 값 가져오기
copy match
from 'D:\Downloads\A Portfolio Projects\SQL Projects\IPL Analysis\Dataset CSV\match.csv'
delimiter ','
csv header;

-- player_match 테이블 생성
create table if not exists player_match(
 playermatch_key bigint primary key,
 match_id int not null references match(match_id),
 player_id int not null references player(player_id),
 role_desc varchar(50) not null check(role_desc in ('Player', 'Keeper', 'CaptainKeeper', 'Captain')),
 team_id int not null references team(team_id)
);
-- player_match.csv 파일에서 값 가져오기
copy player_match
from 'D:\Downloads\A Portfolio Projects\SQL Projects\IPL Analysis\Dataset CSV\player_match.csv'
delimiter ','
csv header;

-- ball_by_ball 테이블 생성
create table if not exists ball_by_ball(
 match_id int not null references match(match_id),
 innings_no int not null check(innings_no<3 and innings_no>0),
 over_id int not null,
 ball_id int not null,
 runs_scored int not null check(runs_scored<=6 and runs_scored>=0),
 extra_runs int not null,
 out_type varchar(50) not null check(out_type in ('caught', 'caught and bowled', 'bowled', 'stumped', 'retired hurt', 'keeper catch', 'lbw', 'run out', 'hit wicket', 'NULL')),
 striker int not null references player(player_id),
 non_striker int not null references player(player_id),
 bowler int not null references player(player_id),
 constraint pk_ball_by_ball_id primary key(match_id, innings_no, over_id, ball_id)
)
-- ball_by_ball.csv 파일에서 값 가져오기
copy ball_by_ball
from 'D:\Downloads\A Portfolio Projects\SQL Projects\IPL Analysis\Dataset CSV\ball_by_ball.csv'
delimiter ','
csv header;
```

질문 2: 생성한 테이블에서 각 경기장 마다 스코어된 평균 달성량을 찾으려면 스타디움에서 경기당 평균 달성량(두 팀의 총점)을 계산해야 합니다.
총 점수를 계산하려면 ball_by_ball 테이블에서 runs_scored 및 extra_runs를 합산해야 합니다.

해결책: 각 경기장에서 스코어된 평균 달성량을 찾으려면 다음 단계를 따라야 합니다. 먼저 각 경기장에서 플레이된 총 경기수를 계산하고, 그 다음 각 경기장에서 스코어된 총 점수를 결정합니다. 마지막으로 총 점수를 플레이된 경기수로 나누어 각 경기장의 경기 당 평균 달성량을 얻을 수 있습니다.

<div class="content-ad"></div>

```sql
-- 2단계: 각 구장에서의 경기 수 계산
with
no_of_match_per_venue as
 (
  select v.venue_id, v.venue_name, count(match_id) as no_of_matches
  from match m
  join venue v
  on v.venue_id=m.venue_id
  group by v.venue_id, v.venue_name
 ),
-- 2단계: 각 구장에서의 총 득점 계산
total_run_per_venue as
 (
  select v.venue_id, sum(b.runs_scored+b.extra_runs) as total_run
  from ball_by_ball b
  join match m
  on m.match_id = b.match_id
  join venue v
  on v.venue_id = m.venue_id
  group by v.venue_id
 )
-- 마지막으로 위의 두 임시 테이블을 사용하여
-- 각 구장에서의 경기 당 평균 득점을 계산합니다
select  npv.venue_name, tpv.total_run, npv.no_of_matches,
round(tpv.total_run/npv.no_of_matches::numeric,3) as avg_run
from no_of_match_per_venue npv
join total_run_per_venue tpv
on npv.venue_id = tpv.venue_id
order by avg_run desc;
```

![2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_2.png](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_2.png)

질문 3: 평균으로 경기 당 가장 많은 볼을 친 선수들을 찾고 상위 10명으로 제한하십시오.
스트라이커로서 해당 선수가 등록된 경우 선수가 공을 쳤다고 간주합니다.

해결책: 먼저 각 선수가 참가한 총 경기 수를 계산해야 합니다. 그 다음 각 선수가 스트라이커로서 받은 총 볼 수를 확인해야 합니다. 마지막으로 경기 당 평균으로 가장 많은 볼을 친 상위 10명의 선수를 식별할 수 있습니다.

<div class="content-ad"></div>

-- 솔루션 3:
-- 단계 1: player_match 테이블에서 플레이어가 참가한 경기 수를 세기
with num_of_match_by_player as
(
select player_id, count(match_id) as no_of_match from player_match
group by player_id
),
-- 단계 2: 공격수로서 플레이어가 참가한 총 볼 수 계산
total_ball_played_by_player as
(
select striker, count(ball_id) as total_ball_played from ball_by_ball
group by striker
)
-- 최종적으로 플레이어 당 평균 한 경기에서 가장 많이 볼을 친 상위 10명을 계산
select player_id, player_name, avg_ball_played from
(
select \*,
-- 동률이 있는 경우를 포함하기 위해 rank 함수 사용
rank() over(order by avg_ball_played desc) from
(
-- 평균 계산
select p.player_id, p.player_name,
(tp.total_ball_played/mp.no_of_match) as avg_ball_played
from num_of_match_by_player mp, total_ball_played_by_player tp, player p
where mp.player_id = tp.striker
and
p.player_id = mp.player_id
)
)
where rank<=10; -- 상위 10개 가져오기

![](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_3.png)

Q 4: 가장 빈도가 높은 6타자를 찾아보세요.
즉, 플레이어가 차지한 볼 중에서 가장 높은 비율로 6점을 친 플레이어를 찾으세요. 플레이어 ID, 플레이어 이름, 플레이어가 6점을 얻은 횟수, 차진 볼 수, 6의 비율을 출력하세요.

솔루션: 먼저 각 플레이어가 차진 볼 수를 계산합니다. 그런 다음, 각 플레이어가 친 6점을 결정합니다. 마지막으로 각 플레이어의 6의 비율을 계산하세요.

<div class="content-ad"></div>

```sql
-- Solution 4:
-- 각 세션에서 각 선수가 참가한 공의 수 계산
with ball_by_player as(
 select striker, count(ball_id) as ball_played from ball_by_ball
 group by striker
),
-- 각 선수가 기록한 6점 수 계산
six_by_player as(
 select striker, count(ball_id) as no_of_six from ball_by_ball
 where runs_scored = 6
 group by striker
)
-- 최종 비율 얻기
select p.player_id, p.player_name, bp.ball_played, sp.no_of_six,
round((sp.no_of_six::numeric/bp.ball_played),2) as fraction
from ball_by_player as bp, six_by_player as sp, player as p
where bp.striker = sp.striker and bp.striker = p.player_id
order by fraction desc;
```

<img src="/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_4.png" />

Q 5: 각 시즌에서 가장 많은 득점을 기록한 상위 3 타자 및 가장 많은 wickets를 따낸 상위 3 볼러 player_ids를 찾아보세요. Output (season_year, batsman, runs, bowler, wickets). 여기서 batsman 및 bowler는 선수들의 player_ids입니다. 동점인 경우 더 낮은 player_id를 먼저 출력합니다. season_year (날짜가 빠른 순)와 rank(특정 시즌에 더 많은 득점 및 wickets를 기록한 타자와 볼러)로 정렬합니다. (no_of_seasons\*3)개의 행이 있을 것입니다.

Solution: 먼저, 각 시즌에서 가장 많은 wickets를 기록한 상위 3 타자를 식별합니다. 다음으로, 각 시즌에서 가장 많은 wickets를 기록한 상위 3 볼러를 결정합니다. 마지막으로, 이러한 결과를 결합하여 최종 목록을 얻습니다.

<div class="content-ad"></div>

```js
-- 솔루션 5:
-- 먼저 각 시즌에서 각각 가장 많은 횟수의 릴리를 기록한 상위 3명의 타자를 찾습니다.
with top_batsman as
 (
 select *,
 rank() over(partition by season_year order by run desc, striker) from
  (
  select m.season_year, b.striker, p.player_name, sum(runs_scored) as run
  from ball_by_ball as b, match as m, player as p
  where b.match_id = m.match_id and p.player_id = b.striker
  group by m.season_year, b.striker, p.player_name
  )
 ),
-- 그리고 두 번째로, 각 시즌에서 각각 가장 많은 볼을 기록한 상위 3명의 볼러를 찾는다.
top_bowlers as(
 select *,
 rank() over(partition by season_year order by wicket desc, bowler) from
  (
  select m.season_year, b.bowler, p.player_name, count(out_type) as wicket
  from ball_by_ball as b, match as m, player as p
  where b.match_id = m.match_id and p.player_id = b.bowler
  and b.out_type not in ('run out', 'retired hurt')
  group by m.season_year, b.bowler, p.player_name
  )
 )
-- 위 두 가지를 조인하여 최종 결과를 얻으세요
select tbt.season_year, tbt.striker, tbt.player_name, tbt.run, tbo.bowler, tbo.player_name, tbo.wicket
from top_batsman as tbt, top_bowlers as tbo
where tbt.rank=tbo.rank and tbt.rank<=3 and tbo.rank<=3 and tbt.season_year = tbo.season_year
order by season_year;
```

<img src="/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_5.png" />

질문 6: 각 경기에서 최대 파트너십 득점을 달성한 선수의 ID를 찾기 위한 SQL 쿼리를 작성하세요. 결과에는 (match_id, player1, runs1, player2, runs2)가 포함되어야 하며, 파트너십 득점의 내림차순으로 정렬되어야 합니다. 동점의 경우 match_id가 오름차순으로 정렬되어야 합니다. runs1이 항상 runs2보다 큰지 확인하고, runs1과 runs2가 동일한 경우 player1_id가 player2_id보다 커야 합니다. extra_runs는 포함되어서는 안 됩니다. 서로 다른 선수가 동일한 파트너십 득점을 여러 번 달성하는 경우 각 경기의 여러 행이 존재할 수 있습니다.

솔루션:
단계 1- partnership이라는 공통 테이블 표현(CTE)을 사용하여 각 파트너십(경기 ID 및 연결된 선수 ID로 식별)이 가져온 총 득점(extr):
단계 2- 다른 CTE인 striker_run_contributed는 각 파트너십에서 스트라이커가 기여한 총 득점을 계산합니다.
단계 3- CTE final_table은 파트너십 득점을 스트라이커의 득점 기여와 결합하고, 비 스트라이커의 득점을 계산합니다. 각 경기의 최고 파트너십 득점만 포함하도록 필터링합니다.
단계 4- 주 쿼리는 결과를 선택하고 정렬하여 더 높은 득점자가 항상 먼저 나오고 run1이 항상 run2보다 크도록 합니다. 두 선수가 동일한 득점인 경우 더 높은 ID를 가진 선수가 먼저 표시됩니다.

<div class="content-ad"></div>

```js
-- 질문 5:
-- 각 경기에서 가장 많은 협력 득점을 얻은 플레이어들의 ID 찾기?
-- 한 경기에 여러 개의 행이 있을 수 있습니다.
-- 출력 (match_id, player1, runs1, player2, runs2),
-- 협력 득점의 내림차순으로(동점인 경우 match_id는 오름차순으로 비교).
-- 각 행에서 run1 > run2
-- runs1=runs2인 경우 player1_id > player2_id. 참고: extra_runs는 계산하지 않아야 함
-- 솔루션

with partnership as
(
 select match_id, striker, non_striker, p_id, p_run from
 (
  select *,
  sum(runs_scored) over(partition by match_id, p_id order by match_id) as p_run,
  row_number() over(partition by match_id, p_id order by match_id) as rank
  from(
   select b.match_id, b.runs_scored, b.striker, b.non_striker,
   case when striker<non_striker then concat(non_striker,' ',striker)
   else concat(striker, ' ', non_striker)
   end as p_id
   from ball_by_ball as b
  )
 ) where rank=1
 order by p_run desc, match_id asc
),
striker_run_contributed as
 (
 select b.match_id, b.striker, b.non_striker, sum(b.runs_scored) as striker_run
 from ball_by_ball as b
 group by b.match_id, b.striker, b.non_striker
  ),
final_table as
(
 select p.match_id, p.striker, p.non_striker, sr.striker_run, (p.p_run-sr.striker_run) as non_striker_run,
 p.p_run
 from partnership as p, striker_run_contributed as sr
 where p.match_id = sr.match_id and p.striker = sr.striker and p.non_striker = sr.non_striker
 and p.p_run = (select max(p_run) from partnership as pt where pt.match_id = p.match_id)
 order by p.p_run desc, p.match_id asc
  )
select match_id,
case when (striker_run = non_striker_run and striker>non_striker) then striker
  when striker_run>non_striker_run then striker
  else non_striker end as player_1,
case when (striker_run>non_striker_run) then striker_run
  else non_striker_run end as run1,
case when (striker_run = non_striker_run and striker>non_striker) then non_striker
  when striker_run>non_striker_run then non_striker
  else striker end as player_2,
case when (striker_run>non_striker_run) then non_striker_run
  else striker_run end as run2,
p_run as total_partnership
from final_table;
```

<img src="/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_6.png" />

질문 7: 이닝 유형이 wickets인 모든 경기에서 득점이 6점 미만인 이닝 ID를 찾으세요.
출력 (match_id, innings_no, over_id). 참고: 이닝에서 득점된 점수에는 extra_runs도 포함됨.

솔루션: 먼저 ball_by_ball 테이블과 이긴 경기 정보를 포함하는 match 테이블을 조인한 후, 득점이 6점 미만인 경우에 해당하는 over_id를 가져옵니다.

<div class="content-ad"></div>

```sql
-- 질문 7:
-- 이닝 종료로 승리한 경기 중에서 6 미만의 점수를 기록한 이닝 ID를 찾아주세요.
-- 출력 (match_id, innings_no, over_id). 참고: 이닝에서 기록된 점수에는 추가 점수도 포함됩니다.

-- 해결 방법 7:

select b.match_id, b.innings_no, b.over_id
from ball_by_ball as b
join match as m on m.match_id = b.match_id
where win_type = 'wickets'
group by b.match_id, b.innings_no, b.over_id
having sum(b.runs_scored) + sum(extra_runs) < 6
```

![이미지](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_7.png)

Q 8: 2013 시즌에서 가장 많은 홈런을 친 상위 5명의 타자 나열하기?
출력 (player_name).

해결 방법: ball_by_ball 테이블을 match 테이블과 연결하여 시즌 연도를 얻고, player 테이블과 연결하여 선수명을 얻습니다. 2013년에 홈런을 세어 상위 5명을 제한하겠습니다.

<div class="content-ad"></div>

```sql
-- 질문 8:
-- 2013 시즌에서 가장 많은 홈런을 친 상위 5명의 타자를 나열하십시오.
-- 알파벳순으로 동점이 발생했을 경우를 고려하십시오. 결과 (선수 이름).

-- 해결책 8:
select p.player_name from ball_by_ball as b, match as m, player as p
where (b.match_id = m.match_id and b.striker = p.player_id)
and (m.season_year = 2013 and b.runs_scored = 6)
group by b.striker, p.player_name order by count(runs_scored) desc limit 5
```

![2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_8.png](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_8.png)

Q 9: 2013 시즌에서 가장 낮은 스트라이크 비율(평균 당 탈아웃당한 볼의 수)으로 상위 5명의 볼러를 나열하십시오. 알파벳순으로 동점이 발생했을 경우를 고려하십시오. 결과 (선수 이름).

해결책: 우선 2013년에 각 선수가 얼마나 많은 아웃을 기록했는지를 계산하십시오. 'NULL', 'retired hurt', 'run out'과 같은 out_type은 볼러로 카운트되지 않습니다. 그래서 데이터 분석가는 데이터 세트에 대한 도메인 지식을 어느 정도 알고 있는 것이 중요합니다. 그런 다음 각 볼러가 한 공을 던진 횟수를 계산하십시오. 마지막으로 평균 비율을 구하고, 비율이 높을수록 볼러로서의 스트라이크 비율이 낮습니다.

<div class="content-ad"></div>

```sql
-- 질문 9: 2013 시즌에서 볼링 스트라이크율(얻은 퍼스트볼당 볼이 던져진 평균 수)이 가장 낮은 5명의 볼러를 나열하십시오. 알파벳순으로 동률 발생 시 이름순으로 정렬하십시오. 결과값은 (선수 이름)으로 출력합니다.

-- 해결책 9:
with wicket as
(
 select b.bowler, p.player_name, count(out_type) as no_of_wicket
 from ball_by_ball as b, player as p, match as m
 where (b.bowler = p.player_id and b.match_id = m.match_id)
 and (b.out_type not in ('NULL', 'retired hurt', 'run out')
 and m.season_year = 2013)
 group by b.bowler, p.player_name
),
balls as
(
 select b.bowler, p.player_name, count(ball_id) as no_of_ball
 from ball_by_ball as b, player as p, match as m
 where (b.bowler = p.player_id and b.match_id = m.match_id)
 and m.season_year = 2013
 group by b.bowler, p.player_name

)
select b.player_name, b.no_of_ball/w.no_of_wicket as ratio from wicket as w, balls as b
where w.bowler = b.bowler
order by ratio desc , b.player_name limit 5;
```

![이미지](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_9.png)

Q 10: 각 나라(적어도 한 명의 선수가 아웃 처리됨)별로 어떤 경기에서 볼 아웃된 선수의 수를 찾아내십시오? 결과값은 (나라 이름, 수)으로 출력합니다. 여기서 나라는 선수의 속한 국적입니다.

해결책: 볼링 백볼 테이블을 선수 테이블과 조인하여 국가 이름을 얻고, out_type = "볼드"로 필터링합니다. 적어도 한 명의 선수가 있는 각 나라별로 볼드 아웃된 선수의 수를 그룹화하여 계산합니다.

<div class="content-ad"></div>

```sql
-- 질문 10:
-- 적어도 한 명의 선수가 볼을 던진 나라마다
-- 임의의 경기에서 볼 처리를 받은 플레이어의 수를 찾으세요.
-- 출력 (country_name, count). 여기서 나라는 선수의 국적입니다.

-- 해결 방법:
select p.country_name, count(striker) no_of_bowled_out
from ball_by_ball as b, player as p
where p.player_id = b.striker and b.out_type = 'bowled'
group by p.country_name having count(striker) > 0 order by no_of_bowled_out desc
```

![이미지](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_10.png)

Q 11: ‘푸네’에서 진행된 임의의 경기에서 적어도 백을 득점한 오른손 타자의 이름을 나열해주세요? 출력 (player_name, run).

해결 방법:

<div class="content-ad"></div>

```sql
-- 질문 11:
-- 'Pune'에서 플레이된 모든 경기 중에서 적어도 한 번 센추리를 기록한 우포수 선수들의 이름을 나열하십시오. player_name을 알파벳순으로 출력하십시오.

-- 해결책:
select p.player_name, sum(runs_scored) as run
from ball_by_ball as b, match as m, venue as v, player as p
where (b.match_id = m.match_id and m.venue_id = v.venue_id
    and p.player_id = b.striker and v.city_name = 'Pune'
    and p.batting_hand = 'Right-hand bat')
group by b.striker, p.player_name having sum(runs_scored)>=100
order by run desc, p.player_name;
```

![이미지](/assets/img/2024-06-23-In-DepthAdvanceSQLQueriesforIPLStatistics_11.png)

보너스 질문:
자체 해결해보기-
적어도 한 번의 경기를 이겨온 모든 팀에 대한 승률을 찾으십시오(모든 시즌에 걸쳐). 팀 이름으로 알파벳순으로 결과를 정렬하십시오. 출력 (team_name, win_percentage).
팀의 승률은 = (팀이 이긴 경기수 / 팀이 플레이한 총 경기수) \* 100로 계산될 수 있습니다.
참고: 소수점 셋째 자리까지 백분율로 계산하십시오.

# 결론:

<div class="content-ad"></div>

간단히 말씀드리자면, SQL을 사용하여 IPL 통계에 뛰어들어 본 것은 정말 즐거운 경험이었어요! 선수, 팀 및 경기에 관한 멋진 통찰력을 발견하여 트렌드와 우수한 성적을 눈에 띄게하기 쉬웠습니다.

저의 Github 저장소를 참조하여 SQL 쿼리, 질문 및 데이터셋을 이용할 수 있습니다.

도움이 되었기를 바라며 다시 한번 감사합니다.
