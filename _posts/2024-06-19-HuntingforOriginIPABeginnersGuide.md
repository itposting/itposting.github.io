---
title: "원본 IP 추적하기 초보자를 위한 안내"
description: ""
coverImage: "/assets/img/2024-06-19-HuntingforOriginIPABeginnersGuide_0.png"
date: 2024-06-19 04:16
ogImage: 
  url: /assets/img/2024-06-19-HuntingforOriginIPABeginnersGuide_0.png
tag: Tech
originalTitle: "Hunting for Origin IP: A Beginner’s Guide"
link: "https://medium.com/@pruthu.raut/hunting-for-origin-ip-a-beginners-guide-70235f3dd415"
---


안녕하세요,

제 이름은 Pruthu Raut이고 Bug Bounty에 초보입니다. 이번 글은 원본 IP를 찾는 것에 초점을 맞추어 처음으로 작성한 것입니다. 웹 애플리케이션 방화벽(WAF) 우회 및 서버에 직접 액세스하여 여러 취약점을 악용하는 것이 주요 관심사입니다. 이제 원본 IP를 찾기 위해 시작해봅시다.

# 단계 1: 도메인 획득

먼저 도메인을 획득합니다. 도메인을 얻은 후 도메인 주소를 복사하고 웹 브라우저에서 엽니다. 웹 브라우저에서 열면 홈페이지가 나타납니다. 그런 다음 추가 단계를 위해 다시 도메인을 얻습니다. 웹사이트가 Cloudflare를 사용 중임을 명확히 알 수 있습니다.

<div class="content-ad"></div>


![Step 2: Using Shodan](https://www.shodan.io/)

![Image 1](/assets/img/2024-06-19-HuntingforOriginIPABeginnersGuide_1.png)


<div class="content-ad"></div>

우리의 첫 번째 방법은 Shodan을 사용하는 것입니다. Shodan을 사용하면, 아래와 같은 shodan dork와 함께 도메인을 붙여넣습니다.

ssl:”redacted.com”

그런 다음 검색 창에 붙여넣습니다. Shodan은 해당 도메인과 관련된 여러 IP 주소를 반환합니다. 각 IP 주소를 웹 브라우저에서 열어 해당 도메인과 동일한 홈페이지에 접속할 수 있는지 확인합니다. 올바른 IP를 찾지 못하면 다음 검색 엔진으로 넘어갑니다.

# 단계 3: Censys 사용하기

<div class="content-ad"></div>

https://search.censys.io/

![Hunting for Origin IP - Beginner's Guide](/assets/img/2024-06-19-HuntingforOriginIPABeginnersGuide_2.png)

그런 다음, 우리는 Censys를 사용합니다. 도메인을 Censys 검색 창에 입력합니다. 결과에서 첫 번째 IP 주소가 도메인과 동일한 웹페이지로 이어진다면, 원본 IP를 찾은 것입니다. Wappalyzer 확장 프로그램을 사용하여 WAF를 확인함으로써 이를 확인할 수 있습니다.

# 단계 4: 웹 애플리케이션 방화벽 (WAF) 확인

<div class="content-ad"></div>

![텍스트](/assets/img/2024-06-19-HuntingforOriginIPABeginnersGuide_3.png)

이제 메인 도메인 웹사이트에 Cloudflare와 같은 WAF가 있는지 확인해 봅시다. 반면, IP 주소를 확인할 때는 WAF가 없는지 확인해 봅니다. WAF가 없다면 DDoS 공격을 할 수 있고, 속도 제한 우회, SQL Injection 수행 및 다른 취약점에 접근할 수 있습니다.

# 단계 5: Foofa 사용하기

[https://en.fofa.info/](https://en.fofa.info/)

<div class="content-ad"></div>

만약 Shodan이나 Censys를 사용하여 원본 IP를 찾는 데 어려움을 겪는다면, Foofa라는 다른 검색 엔진이 있습니다. 도메인을 입력하면 Foofa가 관련된 IP 주소를 제공해줍니다.

더 많은 검색 엔진 :

- [https://securitytrails.com/](https://securitytrails.com/)

# 결론

<div class="content-ad"></div>

이 테이블 태그를 마크다운 형식으로 바꿔보겠습니다.

이렇게 원본 IP를 찾을 수 있어요. 이 가이드가 도움이 되었으면 좋겠어요. 원본 IP를 신고하고 관련 정보를 기재한 리포트도 곧 보내드릴게요. 버그를 신고하거나 회사와 플랫폼에 제출할 때 비슷한 형식을 사용하시면 좋을 거예요.

그럼 그때까지, 안녕히 가세요. 다음에 또 만나요!

제 소셜 미디어:

X: [https://x.com/techypruthu](https://x.com/techypruthu)

<div class="content-ad"></div>

LinkedIn: [Pruthu Raut](https://www.linkedin.com/in/pruthu-raut-89260a26a/)

## 보고서

## 개요

웹 응용 프로그램 방화벽 (WAF)은 패턴 일치 및 트래픽 분석을 사용하여 교차 사이트 스크립팅 (XSS), SQL 삽입 및 악성 문자열과 같은 공격으로부터 응용 프로그램을 보호합니다. 일부 응용프로그램은 주요 방어 수단으로 WAF에 완전히 의존합니다. WAF를 우회하는 공격자는 특별히 만든 페이로드를 통해 응용 프로그램 서버에 직접 액세스할 수 있습니다.

<div class="content-ad"></div>

# 사업 영향

WAF 우회는 고객의 응용 프로그램 보안에 대한 신뢰에 영향을 미쳐, 사업에 평판 피해와 간접적인 재정적 손실을 가져올 수 있습니다. 공격자가 서버에 직접 액세스 권한을 성공적으로 얻으면 사용자 계정 침해와 데이터 유출로 이어질 수 있습니다.

# 재현 단계

- 대상 웹 사이트 방문하고 확장 프로그램 "Wappalyzer"를 사용하여 사이트가 Cloudflare WAF를 사용하는지 확인합니다.
- https://search.censys.io/ 방문합니다.
- 대상 도메인을 검색 상자에 붙여넣습니다.
- 찾은 IP 주소 'IP'를 방문합니다.
- 방화벽이 없음을 확인합니다.
- 확장 프로그램 "Wappalyzer"를 사용하여 사이트가 Cloudflare WAF를 사용하고 있지 않은지 확인합니다.

<div class="content-ad"></div>

# 권장 사항

- 클라우드플레어로부터 "직접 IP" DNS 공급 업체로 이동하더라도 서버 IP는 노출될 수 있습니다.
- 서버 방화벽을 구성하여 클라우드플레어 IP 범위만 허용하십시오.
- 사람들에게 호스트 이름을 사용하도록 강제하세요; 이 작업은 000_default 구성 파일에서 수행할 수 있습니다.
- 클라우드플레어 자체 가이드라인과 일치하는 이러한 권장 사항은, 원본 서버가 클라우드플레어의 IP 주소 범위와 전용 통신해야 한다는 것입니다. 그렇지 않으면 클라우드플레어 블로그의 게시물에 보고된 것처럼, 역방향 프록시를 보유하는 것에 의한 보호 기능이 사실상 무용지물이 될 수 있습니다.