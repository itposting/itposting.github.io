---
title: "라즈베리 파이 클러스터에 Airflow 설치하기 하드웨어 및 설정 방법"
description: ""
coverImage: "/assets/img/2024-06-22-InstallingAirflowonaRaspberryPiClusterHardwareandSetup_0.png"
date: 2024-06-22 19:15
ogImage: 
  url: /assets/img/2024-06-22-InstallingAirflowonaRaspberryPiClusterHardwareandSetup_0.png
tag: Tech
originalTitle: "Installing Airflow on a Raspberry Pi Cluster: Hardware and Setup"
link: "https://medium.com/@robronayne/installing-airflow-on-a-raspberry-pi-cluster-hardware-and-setup-7b34ae5655bd"
---


![이미지](/assets/img/2024-06-22-InstallingAirflowonaRaspberryPiClusterHardwareandSetup_0.png)

라즈베리파이 클러스터를 구축하는 데 사용한 구성 요소 및 단계 개요입니다. 이 프로젝트의 동기는 Kubernetes 및 Airflow를 실행하는 데 적합하고 효율적이며 유연한 클러스터 환경을 만들기 위한 것이었습니다. 여러 웹 크롤링 스크립트에 대한 DAG 스케줄링을 자동화하여 자동 캠프장 예약 및 서핑 조건 크롤링을 포함한 작업을 수행하는 것이 목표입니다.

## 자재 목록:

![이미지](/assets/img/2024-06-22-InstallingAirflowonaRaspberryPiClusterHardwareandSetup_1.png)

<div class="content-ad"></div>

- Raspberry Pi 4 모델 B — 1GB RAM (x4)
가격: $140.00 (각 $35)
Adafruit 제품 링크
- Raspberry Pi PoE+ HAT (x4)
가격: $80.00 (각 $20)
Adafruit 제품 링크
- 검정 이더넷 패치 케이블 — 0.5피트 (x4)
가격: $8.94 (각 $1.49)
아마존 제품 링크
- 파란색 이더넷 패치 케이블 — 2피트
가격: $4.68
아마존 제품 링크
- TP-Link TL-SG1005P, 5포트 PoE 스위치
가격: $49.99
아마존 제품 링크
- UCTRONICS 래스베리 파이 클러스터용 케이스
가격: $79.99
아마존 제품 링크
- SanDisk 32GB microSD (x4)
가격: $50.44 (각 $12.61)
아마존 제품 링크
- SSD용 USB to SATA 어댑터
가격: $6.96
아마존 제품 링크
- HP S750 256GB SSD
가격: $32.99
아마존 제품 링크

총 비용: $454.99

## 빌드 지침:

<img src="/assets/img/2024-06-22-InstallingAirflowonaRaspberryPiClusterHardwareandSetup_2.png" />

<div class="content-ad"></div>

- 선풍기 설치: 선풍기를 배면에 부착하고 스티커가 라즈베리 파이를 향하도록 확인하세요. M5*10 나사로 냉각 선풍기를 고정하세요.
- 프레임워크 설치: M3*4 플랫헤드 나사를 사용하여 두 개의 프레임워크를 배면에 설치한 다음 측면 패널을 이러한 프레임워크에 장착하세요. 다른 측면 패널에 두 개의 추가 프레임워크를 부착하고 전면 패널을 장착하세요. 최상부 패널로 케이스를 덮고 바닥 패널을 밀어 넣어 고정하세요.
- 마스터 노드 설정: 마스터 노드의 왼쪽 장착 브라켓에 라즈베리 파이를 설치하세요. 2.5인치 SSD를 마스터 노드 브라켓에 M3*5 나사로 고정하세요.
- 선풍기 어댑터 보드: 선풍기 어댑터 보드를 마스터 노드의 라즈베리 파이 전원 인터페이스에 삽입한 후 선풍기 전선 (양극성 위의 빨간 전선, 음극성 위의 검은 전선)을 연결하세요.
- PoE Hats 설치: 각 라즈베리 파이 보드에 PoE Hats를 설치하고 다이어그램에 따라 홀 3과 4에 M2.5 나사로 스탠드오프를 연결하세요. 홀 1과 2에 M2.5*5 나사로 보드를 장착하세요.
- MicroSD 카드 삽입: 각 라즈베리 파이 보드에 MicroSD 카드를 삽입하세요.
- 브라켓 삽입: 설치된 브라켓을 케이스에 기울여 삽입한 후 Captive Loose-Off Screws로 고정하세요. 이더넷 케이블이 짧기 때문에 이더넷 포트가 아래를 향하도록 브라켓을 설치하세요.
- 나머지 브라켓: 다른 라즈베리 파이 장착 브라켓을 케이스에 삽입하세요.
- 이더넷 케이블 및 SSD 연결: PoE 스위치에서 각 라즈베리 파이로 이더넷 케이블을 연결하세요. 마스터 노드에 USB to SATA 어댑터 케이블을 사용하여 SSD를 연결하세요.
- 바닥패드: 설치를 완료하기 위해 바닥 패널에 발패드를 부착하세요.

<img src="/assets/img/2024-06-22-InstallingAirflowonaRaspberryPiClusterHardwareandSetup_3.png" />

클러스터를 설정한 후 K3s(가벼운 Kubernetes 배포 버전)를 설치하고 Apache Airflow를 설정할 것입니다. 이를 통해 다양한 웹 스크래핑 스크립트에 대한 자동 DAG 스케줄링이 가능해집니다. 이러한 단계를 따르면 Raspberry Pi 클러스터를 성공적으로 구축하고 프로젝트에 활용할 수 있는 능력을 갖추게 될 것입니다.