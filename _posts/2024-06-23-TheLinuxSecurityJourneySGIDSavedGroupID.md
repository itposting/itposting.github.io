---
title: "리눅스 보안 여정  SGID 저장된 그룹 ID 이해하기"
description: ""
coverImage: "/assets/img/2024-06-23-TheLinuxSecurityJourneySGIDSavedGroupID_0.png"
date: 2024-06-23 15:17
ogImage: 
  url: /assets/img/2024-06-23-TheLinuxSecurityJourneySGIDSavedGroupID_0.png
tag: Tech
originalTitle: "The Linux Security Journey — SGID (Saved Group ID)"
link: "https://medium.com/@boutnaru/the-linux-security-journey-sgid-saved-group-id-07b4507b319e"
---


이 문맥에서 SGID는 "Saved Group ID"의 약자이며 SGID 비트와는 다릅니다. 이는 루트와 같은 고권한(하지만 그에 국한되지는 않는) 상태에서 일을 하다가 무권한으로 무언가를 수행해야 하는 경우 사용됩니다. 우리는 "최소한의 권한" 원칙을 따르고자 하기 때문에 높은 권한은 반드시 필요한 경우에만 사용해야 합니다.

따라서, 우리는 SGID를 사용하여 EGID를 저장한 후 변경을 수행하여 작업이 무권한 사용자로 실행되도록 합니다. 작업이 완료되면 SGID에서 EGID를 다시 가져옵니다.

마지막으로, EGID와 SGID 간에 다른 값을 설정하기 위해 "setresgid" 시스템 호출을 사용할 수 있습니다. 우리는 sgid=0이면 egid=0을 사용할 수 있지만 sgid!=0이면 그렇게 할 수 없습니다. 따라서 SGID는 SGID와 같은 개념을 사용합니다. SGID는 "struct cred"의 일부로 저장되는 속성이기도 합니다.

다음 글에서 다시 만나요 ;-) 트위터(@boutnaru)를 통해 제 소식을 확인할 수 있습니다. 또한 매체(medium)에서 다른 글도 읽을 수 있습니다. 무료 eBook은 https://TheLearningJourneyEbooks.com에서 찾을 수 있습니다.

<div class="content-ad"></div>


![2024-06-23-TheLinuxSecurityJourneySGIDSavedGroupID_0.png](/assets/img/2024-06-23-TheLinuxSecurityJourneySGIDSavedGroupID_0.png)
