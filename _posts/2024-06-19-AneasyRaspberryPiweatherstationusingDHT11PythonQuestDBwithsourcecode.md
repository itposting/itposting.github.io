---
title: "Raspberry Pi 날씨 스테이션 만들기 DHT11  Python  QuestDB 소스 코드 포함"
description: ""
coverImage: "/assets/img/2024-06-19-AneasyRaspberryPiweatherstationusingDHT11PythonQuestDBwithsourcecode_0.png"
date: 2024-06-19 02:42
ogImage: 
  url: /assets/img/2024-06-19-AneasyRaspberryPiweatherstationusingDHT11PythonQuestDBwithsourcecode_0.png
tag: Tech
originalTitle: "An easy Raspberry Pi weather station using DHT11 + Python + QuestDB (with source code)"
link: "https://medium.com/gitconnected/an-easy-raspberry-pi-weather-station-using-dht11-python-questdb-with-source-code-65e78e63047a"
---


가끔은 예전 프로젝트로 돌아가서 업데이트하고 다시 생각해보는 것도 재미있어요. 몇 년 전에 라즈베리 파이, 파이썬, 포테이너, 프로메테우스 및 그라파나를 사용하여 간단한 온도 및 습도 모니터를 만들었어요. 전체 프로젝트와 자습서는 여기에서 확인할 수 있어요. 이 서비스 스택은 RPi 3B(1GB RAM만 있는)에 호스팅되었고, 해당 서비스들이 이 목적을 위해 많은 리소스를 사용하고 있었는데, 그 이후로 이 디자인을 개선하고 싶어했어요.

## 이전 아키텍처

이전에는 15초마다 프로메테우스가 센서 데이터를 읽는 Python API에 도달했지만, 잘못된 값과 같은 에러를 확인하지 않았어요. 이 값들은 프로메테우스에 저장되어 사용자가 대시보드를 요청할 때마다 그라파나에서 읽었어요. 이 서비스들은 모두 좋지만, 모든 메모리와 CPU가 제한된 환경에서 작동하기 때문에 많은 리소스가 필요해요.

![이전 아키텍처 이미지](/assets/img/2024-06-19-AneasyRaspberryPiweatherstationusingDHT11PythonQuestDBwithsourcecode_0.png)

<div class="content-ad"></div>

## 새 아키텍처

새 아키텍처를 위한 주요 목표는 이 서비스의 오버헤드를 줄이는 것이었습니다. 여전히 모든 서비스를 구성하기 위해 도커를 사용하고 있지만, 더 적은 자원을 사용하면서도 동일한 가치를 제공합니다.

이제 사용자 인터페이스(프론트엔드)는 간단한 정적 SPA(NuxtJS로 제작됨)로 처리되고, 가벼운 Apache 컨테이너 (Nginx 또는 다른 웹 서버)를 사용하여 제공됩니다. 사용자가 이 페이지를 처음 요청할 때 브라우저로 다운로드되어 그 곳에서 실행되므로 서버 측에서 처리할 내용이 줄어듭니다.

이제 Python API는 백그라운드 스케줄러를 사용하여 매 분마다 센서에서 데이터를 읽고, 이를 고성능 시간 기반 저장 및 쿼리에 능한 PostgreSQL 기반 데이터베이스 인 questdb에 저장하는 역할을 합니다. 또한 DHT11용 최신 라이브러리를 이용합니다. API는 또한 Flask를 사용하여 센서의 최신 측정치를 읽을 수 있는 엔드포인트를 노출시켜 SPA에서 사용합니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-AneasyRaspberryPiweatherstationusingDHT11PythonQuestDBwithsourcecode_1.png" />

SPA는 80번 포트에서 제공되며, Python API는 81번 포트에서 제공되어 questdb 인스턴스에서 데이터를 검색하여 JSON payload로 반환합니다. 이러한 모든 서비스는 쉬운 배포와 구성을 위해 docker-compose 파일을 사용하여 생성되었습니다.

<img src="/assets/img/2024-06-19-AneasyRaspberryPiweatherstationusingDHT11PythonQuestDBwithsourcecode_2.png" />

전체 프로젝트는 github.com/gmullernh/dht11-weather-station에서 확인할 수 있습니다.


<div class="content-ad"></div>

## 결과

스택은 이제 더 적은 리소스를 사용하며 머신에 더 많은 서비스를 추가하고 더 나은 최적화 결과를 얻을 수 있습니다. questdb에서 데이터를 쓰거나 읽을 때 CPU 및 RAM 사용량이 증가하는 경우가 있지만, 그 외에는 값들이 낮은 백분위수 주변에 있습니다.

![이미지](/assets/img/2024-06-19-AneasyRaspberryPiweatherstationusingDHT11PythonQuestDBwithsourcecode_3.png)

## 향후 개선사항

<div class="content-ad"></div>

이 디자인을 개선하는 데 경량 데이터베이스 엔진(questdb는 정말 좋지만 이 규모에는 더 작은 것이 있을 수 있습니다)을 사용하거나 Python API를 Rust, Go 또는 유사한 경량 런타임 언어로 교체하고 SPA에 그래프 시각화 및 더 많은 데이터 분석과 같은 기능을 추가할 수 있습니다. 또한, 프로젝트를 개선하는 데 도움을 주시면 감사하겠습니다.