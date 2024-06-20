---
title: "새로운 홈랩 테스트하기"
description: ""
coverImage: "/assets/img/2024-06-19-TestingmynewHomeLab_0.png"
date: 2024-06-19 08:43
ogImage: 
  url: /assets/img/2024-06-19-TestingmynewHomeLab_0.png
tag: Tech
originalTitle: "Testing my new HomeLab"
link: "https://medium.com/@josejgp/testing-my-new-homelab-427e433f1ca9"
---



![이미지](/assets/img/2024-06-19-TestingmynewHomeLab_0.png)

새로운 홈랩을 설정했어요. 계속 공부를 하기 위한 아이디어인데, 설정은 아주 간단해요. 인터넷에서 볼 수 있는 멋진 홈랩들과는 거리가 먼데, 누구나 출발점으로 달성할 수 있는 것이에요.

- HP ProDesk (홈랩)
- D-Link DES-1016D 스위치 (모든 것을 연결)
- 내 개인 컴퓨터 (HP ProDesk에 SSH 연결하는 용도로 사용 중)
- TP-Link TL-PA4010P (D-Link에 연결하고 홈 와이파이를 사용하지 않으려고 이것을 사용하여 모든 것을 함께 사용함)

![이미지](/assets/img/2024-06-19-TestingmynewHomeLab_1.png)


<div class="content-ad"></div>

비관리 스위치는 관리 스위치보다 싸지만, MAC 주소 학습을 통해 네트워크 트래픽을 효율적으로 제어하여 허브에 비해 상당한 이점을 제공합니다. 허브가 모든 연결된 장치로 데이터를 브로드캐스트하는 반면, 비관리 스위치는 트래픽을 목적지에만 전달합니다. 이로써 네트워크 혼잡을 줄이고 전반적인 성능을 향상시킵니다. 그러나 이 이점은 제한된 제어 기능과 함께 제공됩니다. 관리 스위치와 달리, 비관리 스위치는 서비스 품질 (QoS) 또는 고급 보안 설정과 같은 기능을 구성할 수 없습니다. 또한 모니터링 기능이 없어서 문제 해결이 어려울 수 있습니다.

요약하자면, 기본적인 요구 사항을 갖춘 소규모 네트워크에 적합한 비관리 스위치입니다. 허브와 비교했을 때 가격 대비 성능 향상의 균형을 제공합니다. 그러나 보안, 우선 순위 부여, 심층적인 모니터링과 같은 기능이 필요한 복잡한 네트워크의 경우 관리 스위치를 선택하는 것이 좋습니다.

어쨌든 관리 스위치는 저렴한 가격에 구할 수 있습니다 (아마존에서 30파운드쯤에 판매 중이며 비관리 버전은 반값입니다), 그래서 하나가 필요하다면 얼마든지 구입하세요. 큰 스위치의 아이디어는 미래에 내 라즈베리를 쉽게 연결할 수 있는 확장성입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-TestingmynewHomeLab_3.png" />

내 홈랩에서 우분투 서버를 운영 체제로 선택했어요. Arch Linux는 맞춤 설정을 통해 명성을 얻었지만, 우분투는 데비안 기반 배포판과의 친근함으로 안정적인 기초를 제공해줍니다. Proxmox라는 또 다른 데비안 기반 옵션이 인기 있긴 했지만, 하드웨어 한계(램과 CPU 코어, 하이퍼스레딩 제외)를 고려할 때 우분투가 더 효율적인 솔루션을 제공할 것 같았어요. 학습 기회를 극대화하기 위해 Docker 컨테이너를 활용하기로 결정했어요. 이를 통해 다른 프로젝트와 함께 Docker를 탐구하면서 홈랩의 교육적 잠재력을 최대한 발휘할 수 있어요.

첫 번째 테스트를 시작하기 위해 Arch Linux 컨테이너를 설치하고 네트워크에서 nmap을 실행하기로 결정했어요.

<img src="/assets/img/2024-06-19-TestingmynewHomeLab_4.png" />

<div class="content-ad"></div>

```js
도커 풀 archlinux
sudo docker rename NAME_CONTAINER 새_이름 # 제 경우에는 myarch
sudo docker start myarch
sudo docker exec -it myarch /bin/bash

#(컨테이너 내부)
pacman -Syu
pacman -S nmap

nmap -sn IP
nmap -p443 --script http-waf-detect --script-args="http-waf-detect.aggro,http-waf-detect.detectBodyChanges" www.google.com
nmap -Pn -sV --script=vulners
```

![이미지](/assets/img/2024-06-19-TestingmynewHomeLab_5.png)

작업을 마치면 컨테이너를 중지시킬 수 있습니다: sudo docker stop myarch

집 서버를 실행하는 컨테이너를 손쉽게 설정할 수 있습니다. 다음 단계는 Docker 네트워크를 설정하는 것입니다.

<div class="content-ad"></div>

확인해보세요: [https://www.redhat.com/sysadmin/quick-nmap-inventory](https://www.redhat.com/sysadmin/quick-nmap-inventory)