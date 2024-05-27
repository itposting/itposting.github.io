---
title: "블라인드 SQL Injection 관리자 패스워드 한 글자씩 알아내기-Lab9"
description: ""
coverImage: "/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_0.png"
date: 2024-05-27 13:06
ogImage: 
  url: /assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_0.png
tag: Tech
originalTitle: "Blind SQL Injection: Uncovering Administrator Password One Character at a Time-Lab9"
link: "https://medium.com/@callgh0st/blind-sql-injection-uncovering-administrator-password-one-character-at-a-time-lab9-b6cbfd8d1cef"
---


안녕 친구. 다시 오신 걸 환영합니다. 이번에도 이전 글을 이번 글의 끝에 링크하겠습니다.

# Lab9: 조건부 응답으로 인한 Blind SQL Injection

이 랩에는 Blind SQL Injection 취약점이 포함되어 있습니다. 애플리케이션은 분석을 위해 추적 쿠키를 사용하고, 제출된 쿠키 값이 포함된 SQL 쿼리를 수행합니다.

<div class="content-ad"></div>

SQL 쿼리의 결과가 반환되지 않고 오류 메시지가 표시되지 않습니다. 그러나 쿼리가 어떤 행도 반환할 때 페이지에 "다시 오신 것을 환영합니다" 메시지가 표시됩니다.

데이터베이스에는 사용자 이름과 비밀번호라는 열이 있는 다른 테이블인 사용자가 있습니다. 관리자 사용자의 비밀번호를 알아내기 위해 시각 SQL 인젝션 취약점을 악용해야 합니다.

이 랩을 해결하려면 관리자 사용자로 로그인하세요.

해결책

<div class="content-ad"></div>

이 시나리오는 이전에 다룬 문제와 비슷해 보입니다. 이전에 작성한 글에서는 카테고리를 클릭하면 인터페이스의 왼쪽 상단에 표시되는 웰컴 백 메시지가 나타납니다.

![이미지](/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_1.png)

버프 스위트를 열고 몇 가지 요청을 보냈으며, 이 중 하나를 Repeater로 보내어 불리언 페이로드를 사용하여 SQLi 취약점을 가진 쿠키 값을 테스트했습니다.

```js
' AND 1=1-- # 웰컴 백 메시지를 받는 결과

' AND 1=2-- # 웰컴 백 메시지를 받지 못함.
```

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_2.png" />

내가 시도한 것은 다음과 같았어:

```js
' UNION SELECT username,password FROM users--
```

하지만 잘 되지 않았어. 심지어 시간 기반 페이로드도 작동하지 않았어.

<div class="content-ad"></div>

수업 실습을 검토하면, 데이터를 추출하기 위해 substring을 사용할 수 있다는 제안이 있었습니다. 따라서, username이 "administrator"인 것을 알면, 비밀번호만을 추출할 필요가 있습니다.

<img src="/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_3.png" />

우리의 페이로드는 다음과 같아야 합니다:

```js
' AND SUBSTRING((SELECT password FROM users WHERE username='administrator'), 1, 1) = 'a
```

<div class="content-ad"></div>

1 (시작 위치): 이는 부분 문자열 추출이 문자열(비밀번호)의 첫 번째 문자에서 시작해야 함을 지정합니다.
1 (길이): 이는 하나의 문자만 추출해야 함을 나타냅니다.

이것을 침입자에게 보내서 payload가 작동하는지 확인하기 위해 a=z로 대체하고 0-9로 자동으로 테스트하도록 지시합시다.

![이미지](/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_4.png)

<div class="content-ad"></div>

저희의 페이로드가 작동 중이에요. 아래 스크린샷을 확인해주세요. 컨텐츠 길이의 차이를 주목해 주세요. A에 도달하면 "welcome back" 메시지가 반환돼요.

![이미지](/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_5.png)

다음 단계로 넘어가야 해요. 다만, 패스워드의 길이를 모르기 때문에 패스워드를 알아내는 데 얼마나 시간이 걸릴지 알 수가 없어요. 수동으로 해야 할 것 같아요.

다음에 사용할 페이로드는 다음과 같을 거에요:

<div class="content-ad"></div>

```js
' AND SUBSTRING((SELECT password FROM users WHERE username='administrator'), 2, 1) = 'a
```

![Blind SQL Injection](/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_6.png)

![Blind SQL Injection](/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_7.png)

제가 'a7eb5rsh00a9n7jffq9v'라는 패스워드를 추출했어요. 하지만, Burp Suite Repeater를 사용하여 확인해보겠습니다.

<div class="content-ad"></div>

페이로드:

```js
' AND SUBSTRING((SELECT username FROM users WHERE password='a7eb5rsh00a9n7jffq9v'), 1, 1) = 'a
```

![이미지](/assets/img/2024-05-27-BlindSQLInjectionUncoveringAdministratorPasswordOneCharacterataTime-Lab9_8.png)

관리자용으로 올바른 자격 증명이 필요합니다. 도전적이었지만 새로운 것을 배웠어요😊. 끝까지 머물러 주셔서 감사합니다. 재미있고 유익했다면 50번 클릭해주세요😊.