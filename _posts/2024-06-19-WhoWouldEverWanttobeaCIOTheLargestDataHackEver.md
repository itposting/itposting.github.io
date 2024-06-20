---
title: "누가 최고 정보 책임자가 되고 싶을까요 사상 최대의 데이터 해킹 사건"
description: ""
coverImage: "/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_0.png"
date: 2024-06-19 21:15
ogImage: 
  url: /assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_0.png
tag: Tech
originalTitle: "Who Would Ever Want to be a CIO: The Largest Data Hack Ever?"
link: "https://medium.com/@billatnapier/who-would-ever-want-to-be-a-cio-the-largest-data-hack-ever-46f10e323639"
---



![이미지](/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_0.png)

외주 업체에 데이터와 처리를 맡기면 자신의 데이터 보호를 다른 사람에게 의지하게 됩니다. 그렇다면, 왜 2020년대에도 우리는 아직도 고객 데이터를 제대로 암호화하고 보호하지 않는 걸까요? 따라서 침입자가 접근 통제를 우회하더라도 암호화된 데이터와 여러 겹의 암호화층을 마주해야 합니다. 데이터베이스의 경우 안전한 격리 내에서 처리하고 열 암호화를 사용해야 합니다.

그리고, 무언가 잘못되면 누가 책임을 져야할까요? 아마도 CIO(최고 정보 책임자)일 것입니다. 사실, 사이버 보안 분야에서 이는 가장 스트레스 받는 일 중 하나일 겁니다. CIO들에게는 가장 많은 기업이 사이버 보안 예산을 위험에 대비해서 균형을 맞추어야 한다는 부담이 있습니다. 또한, CIO는 개발자와 관리자의 실수에 대한 책임을 져야 할 수도 있습니다.


<div class="content-ad"></div>

이번 주에는 Snowflake와 관련된 역사상 가장 대형의 데이터 해킹이 있었어요. Snowflake는 클라우드 스토리지 및 분석 회사입니다. 이에는 Ticketmaster와 Santander에 대한 침해도 포함되어 있어요. 핵심은 Shiny Hunters 그룹이며 이들은 악성 소프트웨어를 만드는 것으로 알려졌어요.

해킹 세부 정보는 5월 27일 BreachForums에 등장했습니다. 그들은 50만 달러의 랜섬을 요구하며 Ticketmaster 데이터 1.3 TB를 보유했고, 여기에는 5억 6천만 명이 넘는 고객 데이터 레코드가 포함되어 있어요. 이에는 이름, 주소, 이메일 주소, 전화 번호, 일부 신용 카드 상세 정보, 티켓 판매 및 주문 상세 정보 등이 포함되어 있었어요. 그들은 데이터베이스에 50만 달러를 요구했답니다. 며칠 후, ShinyHunters는 Santander로부터 3천만 명 이상의 고객 정보와 직원 정보를 보유했으며 200만 달러의 랜섬을 요구했어요. FBI는 BreachForums을 5월 15일에 실제로 폐쇄했지만, 그 후 재등장했어요. 일부 사람들은 이러한 데이터 침해의 발표는 웹 사이트가 여전히 운영 중임을 알리는 방법이라고 생각합니다.

Snowflake는 다른 회사를 위해 클라우드 시스템을 운영하므로 이러한 해킹은 빙산의 일각에 불과할 수 있어요.

<div class="content-ad"></div>

400개 이상의 기업이 데이터 스크래핑을 당한 증거가 있습니다. 스노우플레이크의 CIO인 브래드 존스는 잠재적인 침해를 인정하고 고객들에게 계정을 어떻게 보호해야 하는지 설명했습니다:

![브래드 존스 CIO](/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_2.png)

우리는 다음과 같은 발언을 볼 수 있습니다:

결론적으로, Snowflake는 "rapeflake"로부터 악성 트래픽을 감지했습니다. 또 다른 클라이언트인 "DBeaver_DBeaverUltimate"로부터 악의적일 수 있는 IP 주소 범위가 확인되었습니다: [링크]

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_3.png)

고객들은 다음과 같이 rapeflake의 사용량을 확인할 수 있습니다:

```js
SELECT
    *
FROM
    snowflake.account_usage.sessions
WHERE
    PARSE_JSON(CLIENT_ENVIRONMENT):APPLICATION = 'rapeflake'
    OR
    (
        PARSE_JSON(CLIENT_ENVIRONMENT):APPLICATION = 'DBeaver_DBeaverUltimate'
        AND
        PARSE_JSON(CLIENT_ENVIRONMENT):OS = 'Windows Server 2022'
    )
ORDER BY CREATED_ON;
```

이 규칙을 감지하는 Python 프로그램은 여기에서 제공됩니다. 해킹으로부터의 가능성은 [이 기사]에 개요가 되어 있습니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_4.png" />

Snowflake의 권장사항은 계정에 멀티팩터 인증(MFA)을 시행하고 자격 증명을 재설정해야 한다는 것을 강조합니다:

- 모든 계정에 멀티팩터 인증(MFA)을 강제로 적용하기;
- 네트워크 정책 규칙을 설정하여 인가된 사용자만 허용하거나 신뢰할 수 있는 위치(VPN, 클라우드 워크로드 NAT 등)에서만 트래픽을 허용하기;
- 영향을 받는 기관은 Snowflake 자격 증명을 재설정하고 회전시켜야 합니다.

개발자들이 일반적으로 테스트를 위해 높은 권한을 가진 계정을 유지하는 데 데모 계정이 사용되었다는 증거가 있습니다. 현재 회사는 데이터 유출이 Snowflake의 제품의 취약성, 잘못된 구성 또는 침해로 인해 발생한 것이 아닌 것으로 생각하고 있습니다. 그러나 주요 질문들이 아직 해결되지 않은 상태이며, 레코드에 암호화가 적용되어야 했고 각 레코드에 강력한 액세스 제어가 있어야했던 곳에 관한 문제가 남아 있습니다.

<div class="content-ad"></div>

현재 SnowFlake는 Crowdstrike가 시스템을 조사하였고 문제가 그들의 사이트에 없다고 말했으며, 그들은 이후 고객들이 권장하는 보안 지침을 따르지 않았다고 지적했습니다.

세계의 일부 사이버 보안 기관은 이미 해당 해킹을 고위험으로 식별했습니다.

[여기](/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_5.png)에서 사진을 확인하실 수 있습니다.

그리고 Sandandar의 발표문은 [여기](해당 링크를 삽입해주세요)에 있습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WhoWouldEverWanttobeaCIOTheLargestDataHackEver_6.png" />

## 결론

곧 큰 일이 벌어질 것 같아요!

그래서, 데이터 유출 사고를 누구에게 돌려야 할까요? 클라우드 제공 업체(AWS 등), 클라우드 플랫폼(SnowFlake 등) 또는 플랫폼 사용자? 전반적으로, 신뢰도가 높은 환경이기 때문에 클라우드 제공 업체를 비난할 필요는 없습니다. 그래서, 이번 주에는 누가 실제로 이 데이터 유출 사고의 책임을 져야 하는지, 그리고 사고의 범위가 어떤지 알게 될 거예요.

<div class="content-ad"></div>

그게 정말 궁금하죠. 왜 2020년대에도 시민 데이터를 암호화하지 않는 걸까요?