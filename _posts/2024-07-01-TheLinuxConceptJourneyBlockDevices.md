---
title: "리눅스 개념 여정  블록 디바이스 쉽게 이해하기"
description: ""
coverImage: "/assets/img/2024-07-01-TheLinuxConceptJourneyBlockDevices_0.png"
date: 2024-07-01 20:23
ogImage: 
  url: /assets/img/2024-07-01-TheLinuxConceptJourneyBlockDevices_0.png
tag: Tech
originalTitle: "The Linux Concept Journey — Block Devices"
link: "https://medium.com/@boutnaru/the-linux-concept-journey-block-devices-f6f775852091"
---


블록 디바이스는 고정 크기의 블록으로 구성된 데이터에 무작위 액세스 기능을 제공합니다. 이러한 디바이스의 예는 RAM 디스크, CD-ROM 드라이브 및 하드 드라이브 등이 있습니다. 블록 디바이스의 속도는 일반적으로 캐릭터 디바이스의 속도보다 빠릅니다. 캐릭터 디바이스와의 다른 점 중 하나는 캐릭터 디바이스에는 단일 현재 위치가 있지만, 블록 디바이스의 경우 데이터를 읽고 쓰기 위해 임의의 위치로 이동할 수 있어야 합니다. 캐릭터 디바이스와 블록 디바이스의 비교(예시 포함)를 아래 다이어그램에서 확인할 수 있습니다.

또한, 모든 디바이스와 마찬가지로 블록 디바이스에는 주 번호와 부 번호가 있습니다. 주 번호는 드라이버를 식별하고, 부 번호는 해당 드라이버가 처리하는 각 물리적 디바이스를 식별하는 데 사용됩니다. 블록 디바이스에는 데이터가 일반적으로 읽을 때(지원되는 경우 쓸 때도) 버퍼링되고 캐싱되며, 사용자가 쉽게 사용할 수 있도록 대부분의 데이터가 파일과 디렉토리로 구성됩니다.

마지막으로, 캐릭터 디바이스 드라이버를 추가하려면 해당 드라이버를 커널에 등록해야 합니다. 이는 "include/linux/fs.h" 헤더 파일의 일부인 "register_blkdev" 매크로를 활용하여 수행될 수 있습니다. 커널 버전 "6.9.7"에서는 해당 매크로를 참조하는 파일이 33개가 있다는 사실이 있습니다.

제 다음 글에서 만나요 ;-) 트위터에서 제 소식을 받아보려면 — @boutnaru(https://twitter.com/boutnaru)를 팔로우해주세요. 또한 미디엄에서 다른 글을 읽을 수도 있습니다 — https://medium.com/@boutnaru. 무료 eBook은 https://TheLearningJourneyEbooks.com에서 확인하실 수 있습니다.

<div class="content-ad"></div>


![2024-07-01-TheLinuxConceptJourneyBlockDevices_0.png](/assets/img/2024-07-01-TheLinuxConceptJourneyBlockDevices_0.png)
