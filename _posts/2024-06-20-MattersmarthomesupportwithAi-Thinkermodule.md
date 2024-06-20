---
title: "Matter 스마트 홈 지원 및 Ai-Thinker 모듈"
description: ""
coverImage: "/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_0.png"
date: 2024-06-20 16:23
ogImage: 
  url: /assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_0.png
tag: Tech
originalTitle: "Matter smart home support with Ai-Thinker module"
link: "https://medium.com/@taraqiuaithinker/matter-smart-home-support-with-ai-thinker-module-7e5cd23976df"
---


# Ai-Thinker Ai-WB2 시리즈 모듈이 Matter을 지원합니다

## Matter이란:
Matter(이전명 CHIP 프로젝트)은 안전하고 신뢰할 수 있는 무선 연결을 제공하는 통합 스마트 홈 연결 표준으로, 가정 자동화 프로젝트에 사용됩니다. Matter는 2019년에 설립되었으며, Connected Standards Consortium(연결 표준 얼라이언스, 이전명: Zigbee 얼라이언스)가 주도하는 데에 참여하고 있으며, 서로 다른 제조업체의 스마트 홈 제품 간의 호환성과 상호 운용성을 향상시키기 위해 설립되었습니다.

## Matter의 장점:

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_0.png)

장치 제조업체에 대한 쉬운 개발, 효율성 향상; Matter의 지원을 받아 장치 공급업체는 더 이상 다중 생태계를 유지하거나 여러 인증을 동시에 통과할 필요가 없어져서 시간과 노동력 비용을 절약할 수 있습니다. 개방 프로토콜, 오픈 소스 코드; 많은 생태 계발자가 개발에 리소스를 투자합니다.
소규모 및 중소 규모 장비 제조업체는 브랜드 제조업체 장비와 연결할 수 있는 이점을 누릴 수 있습니다.
최종 사용자에게는 생태 장벽과 브랜드 장벽을 깨고, Matter 프로토콜을 지원하는 서로 다른 브랜드의 장치를 제어하기 위해 앱을 사용할 수 있습니다.
더 효율적인 통신; 지역 장치가 직접 통신하도록 허용하며, 데이터는 클라우드 도킹 흐름을 통과할 필요가 없습니다.
보안이 더욱 강력해집니다; 여러 산업 선두 기업들이 공동으로 후원하고 개발하고 검증한 보안 메커니즘

## Matter의 연결 메커니즘:

Zigbee, Z-Wave, Bluetooth LE Mesh 등의 프로토콜을 기반으로 하는 IoT 장치. 이러한 비-Matter 장치들이 Matter 장치와 함께 작동할 수 있을까요? 답변: 네. Matter는 브리지 메커니즘을 지원하며, 브리지 장치를 중간에 추가하여 데이터를 전달하고 구문 분석할 수 있습니다.

<div class="content-ad"></div>


![Device Architecture](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_1.png)

## Matter의 기기 아키텍처 및 어떤 장치들이 Matter에 액세스할 수 있는가

1. WiFi 및 Ethernet 지원 장치는 LAN 라우터에 직접 연결할 수 있습니다.

2. Matter 프로토콜(주로 Thread 프로토콜을 지원하는 하위 장치, Zigbee 프로토콜이나 Bluetooth 프로토콜을 지원하는 하위 장치 등)를 지원하는 하위 장치는 먼저 Matter 프로토콜을 지원하는 게이트웨이 장치에 연결한 다음 게이트웨이 장치를 홈 라우터에 연결합니다.


<div class="content-ad"></div>

3. Matter를 지원하지 않는 하위 기기들은 먼저 네트워크 브릿지(Matter Bridge)에 연결되고, 그 다음 Matter Bridge 기기가 프로토콜 변환을 통해 이전의 엣지 박스 제품과 마찬가지로 홈 라우터에 연결됩니다.
역할:
콤보 라우팅 장비, Thread, 경계 전달(와이파이 직접 데이터가 아님), 브릿지 장비(Matter 호환 장비)

## WB2 모듈은 Apple 기기와의 페어링 및 제어를 지원합니다

Matter 주소: https://github.com/Ai-Thinker-Open/connectedhomeip-1

## 원래 칩 제조업체인 Bouffalolab은 Google과 초기 액세스 프로그램(EAP) 파트너십을 맺었습니다

<div class="content-ad"></div>

구글과 협력 중인 소수 파트너 그룹의 일원으로서, 우리는 관련 특징 경험을 개발할 첫 번째 사람이 될 것입니다. 이 초기 파트너십 프로그램(EAP)의 일환으로, 구글의 SDK, Matter 개발 도구에 액세스하고 구글의 제품 로드맵에 영향을 미칠 기회를 얻을 것입니다.

Matter 주소: https://github.com/Ai-Thinker-Open/connectedhomeip-1

![이미지](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_2.png)

## Matter SDK 개발 환경

- ubuntu20 이상을 사용하는 것이 가장 좋습니다. 테스트 결과, ubuntu18의 환경을 구축할 때 python 버전이 3.6이라는 메시지가 표시되어 환경이 구축되지 않았습니다. 나중에 공식 웹사이트에서 Matter는 python 3.8 이상을 필요로 한다는 사실을 알게 되었습니다.
- 현재 ubuntu20 및 ubuntu22에서 환경을 정상적으로 구축할 수 있음을 확인하였습니다.
- Matter SDK: 링크를 클릭해주세요.

<div class="content-ad"></div>

## 커튼 소재 SDK 다운로드

```js
git clone https://github.com/shchen-Lab/connectedhomeip.git
cd connectedhomeip
git submodule update --init --recursive
source ./scripts/activate.sh -p bouffalolab
```

위 명령을 실행한 후, Matter가 실행되기 위해 필요한 환경이 다운로드됩니다. 이 과정에서 다운로드가 완료될 때까지 기다려주셔야 합니다. 위에 표시된대로 환경 설정이 완료됩니다.

![image](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_3.png)

<div class="content-ad"></div>

## Bouffalo SDK 컴파일 환경 설정

다음 명령을 실행하여 Bouffalo SDK를 다운로드하고 환경 변수에 적용하세요.

```js
cd third_party/bouffalolab/repo
sudo bash scripts/setup.sh
export BOUFFALOLAB_SDK_ROOT=/opt/bouffalolab_sdk
```

커튼 장비 컴파일 지침

<div class="content-ad"></div>

```js
./scripts/build/build_examples.py --target bouffalolab-bl602-iot-matter-v1-window-covering build
./scripts/build/build_examples.py --target bouffalolab-bl706dk-window-covering build
./scripts/build/build_examples.py --target bouffalolab-bl704ldk-window-covering build
```

![2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_4](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_4.png)

![2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_5](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_5.png)

![2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_6](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_6.png)


<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_7.png)

![Image 2](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_8.png)

![Image 3](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_9.png)

![Image 4](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_10.png)


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_11.png)

왜 인증이 필요할까요?
매터 제품이 시장에 출시되기 전에 "장치 인증 인증서(Device Attestation Certificate)"와 "제품 규정 준수 인증(Product Compliance Certification)"이 모두 필요합니다.

장치 인증 인증서
장치 인증 인증서(즉, DAC, 장치 인증 인증서)는 단순히 매터 장치 ID입니다. 장비 제조업체는 이 ID를 CSA 얼라이언스 또는 얼라이언스 회원에서 얻을 수 있습니다. (Ai-Thinker는 얼라이언스 회원 중 하나입니다.)

제품 규정 준수 인증
매터 장비가 매터 프로토콜을 준수하는지 확인하기 위해, CSA 얼라이언스는 장비가 시장에 출시되기 전에 "제품 규정 준수 인증(Product Compliance Certification)"을 통과해야 합니다.

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_12.png)

![Image 2](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_13.png)

![Image 3](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_14.png)

![Image 4](/assets/img/2024-06-20-MattersmarthomesupportwithAi-Thinkermodule_15.png)


<div class="content-ad"></div>

만약 Matter Smart Home 지원 모듈에 대해 더 많은 정보를 원하신다면, tara@aithinker.com 또는 +8615817421307(whatsapp/wechat)로 문의해주세요!