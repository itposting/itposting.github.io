---
title: "좀비 프로세스의 비밀을 밝히다 Linux에서 알아야 할 모든 것"
description: ""
coverImage: "/assets/img/2024-06-21-LinuxUnveilingtheMysteriesofZombieProcesses_0.png"
date: 2024-06-21 23:58
ogImage: 
  url: /assets/img/2024-06-21-LinuxUnveilingtheMysteriesofZombieProcesses_0.png
tag: Tech
originalTitle: "Linux — Unveiling the Mysteries of Zombie Processes"
link: "https://medium.com/@tonylixu/linux-unveiling-the-mysteries-of-zombie-processes-d4ea68605e64"
---



![LinuxUnveilingtheMysteriesofZombieProcesses](/assets/img/2024-06-21-LinuxUnveilingtheMysteriesofZombieProcesses_0.png)

어떤 프로세스가 "exit"를 호출하면 즉시 사라지지 않는다는 사실을 아는 사람은 적을 것입니다. 대신, "좀비" 프로세스라고 불리는 데이터 구조를 남깁니다. Linux 프로세스의 다섯 가지 상태 중에서 좀비 프로세스는 특히 독특합니다.

거의 모든 메모리 공간을 포기했으며 실행 가능한 코드가 전혀 없으며 스케줄링될 수 없으며 단지 ...에 위치하고...
