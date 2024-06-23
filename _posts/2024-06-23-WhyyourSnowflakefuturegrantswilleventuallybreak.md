---
title: "Snowflake의 미래 부여가 결국 실패할 이유"
description: ""
coverImage: "/assets/img/2024-06-23-WhyyourSnowflakefuturegrantswilleventuallybreak_0.png"
date: 2024-06-23 16:32
ogImage: 
  url: /assets/img/2024-06-23-WhyyourSnowflakefuturegrantswilleventuallybreak_0.png
tag: Tech
originalTitle: "Why your Snowflake future grants will eventually break"
link: "https://medium.com/@duran9987/why-your-snowflake-future-grants-will-eventually-break-0d74299ffe69"
---


<img src="/assets/img/2024-06-23-WhyyourSnowflakefuturegrantswilleventuallybreak_0.png" />

여기 설정이 있어요...

방금 MyFirstRole이라는 새 역할을 만들었습니다.

```js
create role MyFirstRole;
```

<div class="content-ad"></div>

계획은 이 역할에 대해 MyDatabase 라는 데이터베이스에 대해 완전한 읽기 액세스 권한을 부여하는 것입니다. MyDatabase 내의 모든 스키마의 모든 현재 테이블 및 뷰를 선택할 수 있도록하고 싶습니다.

```js
grant usage on database MyDatabase to role MyFirstRole;
grant usage on all schemas in database MyDatabase to role MyFirstRole;
grant select on all tables in database MyDatabase to role MyFirstRole;
grant select on all views in database MyDatabase to role MyFirstRole;
```

위 명령문을 설정하면 우리의 역할은 이제 MyDatabase의 모든 항목을 선택할 수 있습니다.

그러나 시간이 흐른다면 데이터베이스에 새로운 테이블 및 뷰가 생성될 것입니다. 새로운 개체가 생성될 때마다 MyFirstRole에게 수동으로 선택 권한을 부여하는 것은 비현실적입니다. 다행히도 미래의 권한 부여가 이 문제를 해결해 줄 것입니다.

<div class="content-ad"></div>

```js
미래 스키마에서 MyDatabase 내의 향후 역할에 대한 사용 권한을 MyFirstRole 역할에 부여합니다.
미래 테이블에서 MyDatabase 내의 향후 테이블에 대한 선택 권한을 MyFirstRole 역할에 부여합니다.
미래 뷰에서 MyDatabase 내의 향후 뷰에 대한 선택 권한을 MyFirstRole 역할에 부여합니다.
```

이제 MyFirstRole은 앞으로 생성되는 테이블이나 뷰에서 select 문을 실행할 수 있습니다.

모든 것이 잘 되고 예상대로 작동하고 있습니다. MyFirstRole에 대한 select 권한을 수동으로 업데이트할 필요가 없으며, 새롭게 생성된 테이블과 뷰에 액세스를 부여해야 하는 경우를 제외하고는요. 이때, MyDatabase에 제한적인 액세스를 갖는 새로운 역할인 MySecondRole을 생성해야 할 때가 올 것입니다.

MyDatabase에는 MySchema라는 스키마가 있다고 가정합시다. MySecondRole은 MySchema 내의 현재 및 향후 테이블 및 뷰에서만 선택할 수 있고 다른 작업은 제한되어야 한다고 합니다.

<div class="content-ad"></div>

조금만 더 해야겠어요...

```js
create role MySecondRole;
grant usage on database MyDatabase to role MySecondRole;
grant usage on schema MyDatabase.MySchema to role MySecondRole;
grant select on all tables in schema MyDatabase.MySchema to role MySecondRole;
grant select on future tables in schema MyDatabase.MySchema to role MySecondRole;
grant select on all views in schema MyDatabase.MySchema to role MySecondRole;
grant select on future views in schema MyDatabase.MySchema to role MySecondRole;
```

다시 한 번, MySecondRole에 대한 새 테이블 및 뷰가 MySchema에 생성되는 것처럼 모든 것이 예상대로 작동하는 것처럼 보입니다. 그러나 몇 주 후에 MyFirstRole이 MySecondRole에 대한 그랜트 이후에 생성된 테이블 또는 뷰에 더 이상 액세스 권한이 없다는 것을 깨닫게 됩니다.

그리고 이것이 미래의 권한이 결국 망가지게 되는 이유입니다...

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-WhyyourSnowflakefuturegrantswilleventuallybreak_1.png" />

간단한 영어로, MyFirstRole은 데이터베이스 수준에서 미래 객체에 권한을 부여받았습니다. ... 데이터베이스에서 미래 테이블을 부여했습니다. 그와 반대로, MySecondRole은 스키마 수준에서 미래 부여를 받았습니다. ... 스키마 수준의 부여는 동일한 데이터베이스 내에서 데이터베이스 수준의 부여보다 우선합니다. 이는 MyFirstRole이 MySecondRole의 미래 부여가 실행된 시점에 테이블 및 뷰에 대한 미래 부여가 무효화되었음을 의미합니다.

이에 대한 해결책은 없습니다. 동일한 데이터베이스에서 데이터베이스 및 스키마 수준에서 미래 부여가 동시에 존재하는 세계에서 살 수 없습니다. 해결책은 데이터베이스의 액세스 패턴을 사전에 파악하고 이에 맞게 부여하는 것입니다. 액세스 요구 사항이 복잡하고 여러 역할 간에 맞춤형인 경우 스키마 수준에서 미래 부여가 적합합니다. 더 간단하고 단일 목적의 데이터베이스(스테이징이 좋은 예시입니다)의 경우에는 데이터베이스 수준의 부여를 사용할 수도 있습니다.

읽어 주셔서 감사합니다!

<div class="content-ad"></div>

안녕하세요! 부담 가지지 마시고 언제든지 인사해주세요 👋

트위터 — https://x.com/jduran9987

링크드인 — https://www.linkedin.com/in/jonathan-duran-80974a183/