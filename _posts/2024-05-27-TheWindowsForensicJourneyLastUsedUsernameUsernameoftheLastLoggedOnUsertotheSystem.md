---
title: "윈도우 포렌식 여정 - LastUsedUsername 시스템에 마지막으로 로그인한 사용자의 사용자 이름"
description: ""
coverImage: "/assets/img/2024-05-27-TheWindowsForensicJourneyLastUsedUsernameUsernameoftheLastLoggedOnUsertotheSystem_0.png"
date: 2024-05-27 12:38
ogImage: 
  url: /assets/img/2024-05-27-TheWindowsForensicJourneyLastUsedUsernameUsernameoftheLastLoggedOnUsertotheSystem_0.png
tag: Tech
originalTitle: "The Windows Forensic Journey — “LastUsedUsername” (Username of the Last Logged On User to the System)"
link: "https://medium.com/@boutnaru/the-windows-forensic-journey-lastusedusername-username-of-the-last-logged-on-user-to-the-04941181a448"
---


"LastUsedUsername"은 레지스트리에서 값 이름으로, 시스템에 마지막으로 로그인한 사용자의 사용자 이름을 저장합니다. 레지스트리 내에서의 전체 위치는 "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"입니다. 이 정보가 시스템 전체에 대해 전역적이므로 HKLM 하이브의 일부입니다 — 아래 스크린샷에 표시된 것처럼.

따라서 우리는 시스템에 마지막으로 로그인한 사용자를 알기 위해 이 값을 읽을 수 있습니다 (관련된 이벤트 로그 항목이 삭제되었더라도). 또한 사용자 프로필 디렉토리의 폴더의 MAC (수정/액세스/생성) 시간과 연관시킬 수 있습니다.

마지막으로, 우리는 라이브 머신을 조사하거나 오프라인 SYSTEM 하이브 또는 원격 머신(원격 레지스트리 서비스가 실행 중이고 SMB/MS-RPC를 사용하여 접근 가능한 경우)에서 이 정보에 접근할 수 있습니다. 다음 글에서 만나요. :-) 트위터에서 제 소식을 확인하실 수 있습니다 — @boutnaru(https://twitter.com/boutnaru). 또한, 중간 — https://medium.com/@boutnaru에서 다른 글을 읽을 수 있습니다. 무료 eBook은 https://TheLearningJourneyEbooks.com에서 확인하실 수 있습니다."