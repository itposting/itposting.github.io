---
title: "Linux 프로세스 여행 - dmesg 커널 링 버퍼 제어 프린팅"
description: ""
coverImage: "/assets/img/2024-06-19-TheLinuxProcessJourneydmesgPrintControltheKernelRingBuffer_0.png"
date: 2024-06-19 08:36
ogImage: 
  url: /assets/img/2024-06-19-TheLinuxProcessJourneydmesgPrintControltheKernelRingBuffer_0.png
tag: Tech
originalTitle: "The Linux Process Journey — “dmesg” (Print Control the Kernel Ring Buffer)"
link: "https://medium.com/@boutnaru/the-linux-process-journey-dmesg-print-control-the-kernel-ring-buffer-dc78abeb87b7"
---


"dmesg"은 "/usr/bin/dmesg" (또는 "/bin/dmesg")에 위치한 ELF 바이너리입니다. Linux 커널은 부팅 시간과 시스템이 실행 중일 때 다양한 메시지를 커널 링 버퍼에 기록합니다. 따라서 커널 링 버퍼는 다양한 로그 메시지를 보유하며 버퍼 크기가 고정되어 있어 가득 차면 이전 항목이 덮어쓰기됩니다. "kern" (커널 메시지), "user" (사용자 레벨 메시지), "mail" (메일 시스템), "daemon" (시스템 데몬), "auth" (보안/승인 메시지), "syslog" 등과 같은 다양한 로그 시설이 커널 링 버퍼에 작성할 수 있습니다.

전반적으로 "dmesg"를 루트 권한없이 실행할 수 있는지는 "kernel.dmesg_restrict" sysctl 키에 따라 다릅니다. "0" 값은 제한이 없음을 나타내고, "1"은 CAP_SYSLOG 기능을 가진 사용자만 액세스를 제한합니다. 또한 커널을 컴파일할 때 "CONFIG_SECURITY_DMESG_RESTRICT" 커널 구성 옵션을 사용하여 기본 값을 설정할 수 있습니다.

또한 "dmesg"는 문자 장치 "/dev/kmsg"에서 정보를 읽는 데 기반을 두고 있습니다. 이 도구는 출력 후 링 버퍼를 지우거나 (" -c "/" - -read-clear"), 로깅 메시지의 수준 설정, 인간이 읽을 수 있는 형식 활성화 (" -H "/" - -human"), JSON 형식 사용 (" -J "/" - -json"), 인간이 읽을 수 있는 타임스탬프 인쇄 ("T "/" - -ctime") 등 다양한 인수를 받을 수 있습니다.

마지막으로 "dmesg"는 "util-linux" 패키지의 일부이며 패키지의 리포지토리에서 유틸리티의 소스 코드를 확인할 수 있습니다. 또한 "dmesg"를 "/dev/kmsg"를 사용하는 대신 "syslog" 시스콜을 사용하도록 강제할 수도 있습니다. 간 현황에서 보듯 동일한 항목 수를 얻을 수 있는 것은 아닙니다.

<div class="content-ad"></div>

다음 글에서 뵙겠습니다;-) 트위터에서 저를 팔로우할 수 있어요 — @boutnaru (https://twitter.com/boutnaru). 또한, 미디엄에서 다른 글도 읽어볼 수 있어요 — https://medium.com/@boutnaru. 무료 eBook은 https://TheLearningJourneyEbooks.com 에서 찾아볼 수 있어요.

![이미지](/assets/img/2024-06-19-TheLinuxProcessJourneydmesgPrintControltheKernelRingBuffer_0.png)