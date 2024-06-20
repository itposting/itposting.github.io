---
title: "리눅스 보안 여정 - 안전한 실행 모드"
description: ""
coverImage: "/assets/img/2024-06-19-TheLinuxSecurityJourneySecureExecutionMode_0.png"
date: 2024-06-19 14:57
ogImage: 
  url: /assets/img/2024-06-19-TheLinuxSecurityJourneySecureExecutionMode_0.png
tag: Tech
originalTitle: "The Linux Security Journey — Secure Execution Mode"
link: "https://medium.com/@boutnaru/the-linux-security-journey-secure-execution-mode-325137c3c76a"
---


일반적으로 "Secure Execution Mode"에서는 보조 벡터의 "AT_SECURE" 항목에 0이 아닌 값이 포함되어 있는 경우 이진 파일이 실행됩니다. LSM(https://medium.com/@boutnaru/linux-security-lsm-linux-security-modules-907bbcf8c8b4)이 값을 설정한 경우, 작업/프로세스의 "실제 UID"(https://medium.com/@boutnaru/the-linux-security-journey-ruid-real-user-id-b23abcbca9c6) 및 "유효 UID"(https://medium.com/@boutnaru/the-linux-security-journey-euid-effective-user-id-65f351532b79)가 다른 경우(그룹 값도 동일)에도 이 값을 0이 아닌 값으로 만들 수 있습니다. 또한, 일반 사용자가 실행한 이진 파일이 프로세스에 권한을 부여했을 경우에도 이 값이 0이 아닌 값이 됩니다(https://man7.org/linux/man-pages/man8/ld.so.8.html).

전반적으로, 안전한 실행 모드는 동적 링커/로더의 기능입니다. 이 모드가 활성화되어 있는 경우 특정 환경 변수가 이진 파일을 실행할 때 무시됩니다. 이러한 변수의 예로는 "LD_LIBRARY_PATH", "LD_DEBUG"(단, /etc/suid-debug가 있는 경우는 제외), "LD_DEBUG_OUTPUT", "LD_DEBUG_WEAK"(glibc 2.3.4부터), "LD_ORIGIN_PATH", "LD_PROFILE"(glibc 2.2.5부터), "LD_SHOW_AUXV"(glibc 2.3.4부터) 및 "LD_AUDIT"이 있습니다(https://manpages.ubuntu.com/manpages/focal/en/man8/ld.so.8.html) — 아래 스크린샷에서 확인할 수 있습니다.

마지막으로, 안전한 실행 모드의 목표는 "setuid"/"setgid"로 실행할 수 있는 이진 파일이 임의의 코드를 로드/실행하는 능력을 차단하여 특권 상승을 수행하는 것을 방지하는 것입니다(사용자 한 명이 실행하지만 다른 사용자(루트일 수도 있음) 권한으로 실행될 때).

다음 글에서 만나요 ;-) 트위터에서 제 소식을 확인하려면 @boutnaru(https://twitter.com/boutnaru)를 팔로우해주세요. 또한, 미디엄(https://medium.com/@boutnaru)에서 다른 글도 읽어볼 수 있습니다. 무료 eBook은 https://TheLearningJourneyEbooks.com에서 찾아볼 수 있습니다.

<div class="content-ad"></div>


![2024-06-19-TheLinuxSecurityJourneySecureExecutionMode](/assets/img/2024-06-19-TheLinuxSecurityJourneySecureExecutionMode_0.png) 
