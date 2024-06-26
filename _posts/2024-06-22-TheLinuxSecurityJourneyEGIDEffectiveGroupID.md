---
title: "리눅스 보안 여정  EGID 유효 그룹 ID 이해하기"
description: ""
coverImage: "/assets/img/2024-06-22-TheLinuxSecurityJourneyEGIDEffectiveGroupID_0.png"
date: 2024-06-22 00:26
ogImage: 
  url: /assets/img/2024-06-22-TheLinuxSecurityJourneyEGIDEffectiveGroupID_0.png
tag: Tech
originalTitle: "The Linux Security Journey — EGID (Effective Group ID)"
link: "https://medium.com/@boutnaru/the-linux-security-journey-egid-effective-group-id-bda1c56b4995"
---


EUID(Effective User ID)와 마찬가지로 EGID(Effective Group ID)도 있어요. 리눅스 시스템에서 특정 작업(프로세스/쓰레드)의 권한을 결정하는 데 주로 사용되며 그룹 소속을 의미합니다.

또한, 특권 사용자인 root와 같이 특권 사용자만 액세스하는 파일에 액세스할 수 있도록 비특권 사용자가 RGID(Real Group ID)와 다른 경우도 있습니다. "current_egid" 매크로를 사용하여 커널 내에서 EGID에 액세스할 수 있습니다.

마지막으로 효과적인 그룹 ID를 출력하는 "id" 명령 줄 유틸리티를 사용할 수 있습니다. 또한 사용자 모드에서는 "getegid()" 시스템 호출을 사용하여 호출한 프로세스/작업의 효과적인 그룹 ID를 검색할 수 있습니다. 동일한 이름의 라이브러리 호출도 있습니다.

다음 글에서 뵐게요 ;-) 트위터에서 저를 팔로우할 수도 있습니다 - @boutnaru. 미디엄에서 다른 글도 읽어보세요 - https://medium.com/@boutnaru. 무료 eBook은 https://TheLearningJourneyEbooks.com에서 다운로드할 수 있어요.

<div class="content-ad"></div>

![Linux Screenshot](/assets/img/2024-06-22-TheLinuxSecurityJourneyEGIDEffectiveGroupID_0.png)