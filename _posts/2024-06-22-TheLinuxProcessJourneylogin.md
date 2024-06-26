---
title: "리눅스 프로세스 여정  로그인 과정 깊이 파헤치기"
description: ""
coverImage: "/assets/img/2024-06-22-TheLinuxProcessJourneylogin_0.png"
date: 2024-06-22 00:28
ogImage: 
  url: /assets/img/2024-06-22-TheLinuxProcessJourneylogin_0.png
tag: Tech
originalTitle: "The Linux Process Journey — login"
link: "https://medium.com/@boutnaru/the-linux-process-journey-login-02b6d83ab6c5"
---


일반적으로 "login"은 Linux 시스템에서 세션을 시작하는 데 사용되는 ELF 바이너리로 기본적으로 "/usr/bin/login" (또는 /bin/login)에 위치합니다. Linux 시스템에 로그인할 때 사용되며 인자를 전달하지 않으면 사용자의 프롬프트가 표시됩니다. (https://man7.org/linux/man-pages/man1/login.1.html) - 아래 스크린샷에 나와 있습니다 (https://www.tecmint.com/understanding-shell-initialization-files-and-user-profiles-linux/).

전체적으로, login은 "util-linux" 패키지의 일부이며 이는 "Linux Kernel Organization"에 의해 배포되는 표준 패키지입니다. kill, more, renice, su 등과 같은 이 패키지에 포함된 다른 실행 파일도 있음을 이해하는 것이 중요합니다 (https://en.wikipedia.org/wiki/Util-linux). "login"의 소스 코드를 "util-linux" 깃허브 레포지토리 (https://github.com/util-linux/util-linux/blob/master/login-utils/login.c)에서 확인할 수 있습니다.

또한, login은 시스템 전체 사용자 인증을 위한 프레임워크를 제공하는 PAM (Package Authentication Modules)에 기반합니다. 이를 확인하기 위해 "ldd" (https://medium.com/@boutnaru/linux-instrumentation-part-4-ldd-888502965a9b)를 사용할 수 있으며 libpam.so 및 아마도 libpam_misc.so도 표시될 것입니다 (https://medium.com/@boutnaru/the-linux-security-journey-pam-pluggable-authentication-module-388496a8785c).

마지막으로, "login"의 동작에 영향을 주는 다양한 구성 파일이 있습니다 (PAM 구성 파일 외). 이러한 구성 파일 중에는 "/etc/login.def", /etc/motd, /etc/passwd 및 /etc/nologin이 있으며 미래의 글에서 자세한 정보를 확인할 수 있습니다. 또한 "login"에 의해 처리되는 로그 기반 파일도 있습니다. 예를 들어 /var/run/utmp, /var/log/wtmp 및 /var/log/lastlog이 있으며 미래의 글에서 자세히 다루겠습니다 (https://linux.die.net/man/1/login).

<div class="content-ad"></div>

제 다음 글에서 만나요 ;-) 트위터에서 제 계정을 팔로우할 수 있어요 — @boutnaru (https://twitter.com/boutnaru). 그리고 다른 글들은 미디엄에서도 읽을 수 있어요 — https://medium.com/@boutnaru. 무료 eBook도 https://TheLearningJourneyEbooks.com에서 찾을 수 있어요.

![이미지](/assets/img/2024-06-22-TheLinuxProcessJourneylogin_0.png)