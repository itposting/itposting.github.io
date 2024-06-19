---
title: "가상에서 현실로 산업 응용 프로그램을 위한 더 똑똑한 로봇을 훈련시킬 합성 데이터"
description: ""
coverImage: "/assets/img/2024-06-19-FromVirtualtoRealityHowSyntheticDataWillTrainSmarterRobotsforIndustrialApplications_0.png"
date: 2024-06-19 18:29
ogImage: 
  url: /assets/img/2024-06-19-FromVirtualtoRealityHowSyntheticDataWillTrainSmarterRobotsforIndustrialApplications_0.png
tag: Tech
originalTitle: "From Virtual to Reality: How Synthetic Data Will Train Smarter Robots for Industrial Applications"
link: "https://medium.com/@nvidiaomniverse/from-virtual-to-reality-how-synthetic-data-will-train-smarter-robots-for-industrial-applications-0c4b744d4ae0"
---


## OpenUSD를 활용한 합성 데이터 생성이 산업용 AI 로봇에 대한 새로운 기회를 열고 있습니다

글: NVIDIA의 제라드 앤드류스 상급 제품 마케팅 매니저

![이미지](https://miro.medium.com/v2/resize:fit:1200/1*K8WDd-MWHkJz2p72nF1csQ.gif)

매년 전 세계 시장에는 대략 40만대의 새 로봇이 도입됩니다. 이들은 2028년까지 700억 달러를 넘을 것으로 예상되는 거의 450억 달러에 이르는 성장하는 산업용 로봇 시장에 기여합니다. 창고 및 공장부터 병원 및 배송 서비스까지, 이 로봇들은 우리가 일하고 살아가는 방식을 변화시키고 있습니다.

<div class="content-ad"></div>

로봇 시스템은 반복적인 작업을 정밀하고 효율적으로 수행할 수 있는 능력으로 다양한 분야에서 중요한 요소가 되어 왔습니다. 물류 및 제조업과 같은 산업에서는 공정을 최적화하고 제품 결함과 같은 이상을 탐지하는 데 도움을 줄 수 있습니다. AI를 활용한 로봇의 융통성과 다재다능성으로 인해, 해당 수요는 앞으로 더욱 증가할 것으로 예상됩니다.

하지만 실제 세계 시나리오에 로봇을 훈련시키는 것은 방대한 데이터 수집, 훈련 및 시뮬레이션으로 이루어진 복잡한 작업 흐름입니다. 이러한 데이터 수집은 시간이 많이 소요되거나 비용이 많이 들거나 때로는 위험할 수 있습니다. 이런 경우 합성 데이터가 중요한 역할을 합니다.

합성 데이터란 실제 환경을 모방하도록 설계된 인공적으로 생성된 데이터를 말합니다. 합성 데이터를 활용하면 팀은 훈련 프로세스를 가속화하고 로봇이 다양한 도전에 대비할 수 있도록 보장할 수 있습니다.

합성 데이터는 NVIDIA Omniverse Replicator를 사용하여 생성할 수 있습니다. 이는 합성 데이터 생성( SDG) 도구와 파이프라인을 구축할 수 있는 개발자 프레임워크입니다. Universal Scene Description (OpenUSD)에 기반한 Omniverse는 3D 작업 흐름, 도구 및 응용 프로그램을 구축하기 위한 개발 플랫폼입니다. Omniverse는 또한 로봇 공학자가 AI 기반 로봇을 설계, 테스트 및 훈련할 수 있는 확장 가능한 로보틱스 시뮬레이션 응용 프로그램 인 NVIDIA Isaac Sim을 지원합니다.

<div class="content-ad"></div>

Omniverse Replicator은 매우 사용자 정의 가능하며 API에 의해 확장 가능하며 특수한 SDG 파이프라인을 개발할 수 있습니다. 개발자로서 여러 가지 속성을 프로그래밍 방식으로 무작위로 설정할 수 있습니다. 또한 굽힌 상자와 세분화 마스크와 같은 사용자 정의 어노테이터 및 작성기를 작성할 수도 있습니다.

# Edge Impluse가 시각 검사용 Omniverse Replicator를 사용자 정의합니다

인공 지능은 이미 산업 시각 검사에서 엄청난 가치를 보여줍니다. 그러나 정확한 물체 감지 모델을 개발하는 것은 실제 세계 데이터셋이 제한되어 있는 경우 도전일 수 있습니다.

데이터 갭을 좁히기 위해 공장 라인의 디지털 트윈을 생성하여 인공 지능 모델이 학습할 수 있는 테스트용 지면을 만들 수 있습니다.

<div class="content-ad"></div>

Edge Impulse의 선두 개발자인 Jenny Plunkett은 결함 검출용 사전을 생성하기 위해 자체 맞춤형 파이프라인을 구축했습니다. 그녀는 결함이 있는 소다 캔을 운반하는 컨베이어 벨트의 장면으로 시작했습니다. 그런 다음, Replicator에서 루틴을 구축하여 조명, 색상, 질감, 배경, 전경, 그리고 캔의 위치 등 장면의 속성을 프로그래밍적으로 임의로 변경하여 Omniverse Replicator에서 생성된 합성 이미지 집합을 모델이 학습할 수 있도록 다채롭고 많은 양의 합성 이미지를 생성했습니다.

합성 데이터가 준비되면, Edge Impulse와 같은 AI 개발 플랫폼으로 공급하여 데이터에 주석을 달고 모델을 구축하고 실제 물체로 테스트할 수 있습니다. 작업 흐름에 대해 자세히 알아보세요.

![이미지](/assets/img/2024-06-19-FromVirtualtoRealityHowSyntheticDataWillTrainSmarterRobotsforIndustrialApplications_0.png)

# 물체 감지를 위한 창고 로봇 교육용 맞춤형 SDG 파이프라인

<div class="content-ad"></div>

자율 로봇은 창고에서 널리 배치되어 있으며, 상품을 효율적이고 안전하게 운송하거나 재고 관리를 최적화하는 등의 작업에 도움을 줄 수 있습니다. 결함 감지 사용 사례와 유사하게, 개발자들은 물체 감지 사용 사례를 위해 Omniverse Replicator를 사용자 정의할 수 있습니다.

본 블로그에서는 SDG 파이프라인을 구축하여 창고에서 파레트 잭을 감지하는 자율 이동 로봇(AMRs) 모델의 성능을 반복적으로 향상시키기 위해 합성 데이터를 생성하는 방법을 소개합니다.

작업 흐름은 색상 및 카메라 위치가 무작위로 변경된 5,000개의 합성 이미지를 생성하는 것으로 시작됩니다. 두 번째 반복에서는 파레트 잭에 다양한 질감이 추가되고 조명이 무작위로 변경됩니다. 창고 내의 다른 물체로 모델이 산만해지지 않도록, 세 번째 반복에서는 합성 데이터에 교통 컵, 젖은 바닥 표지판 및 파레트 잭 옆에 있는 통 등 다양한 무작위 객체가 추가됩니다.

<div class="content-ad"></div>

다양한 매개변수를 무작위로 설정하여 합성 이미지를 생성한 후, 모델은 팔레트 잭을 정확하게 감지할 수 있었습니다. 이전에 수개월이 걸렸을 데이터를 단 몇 일만에 생성할 수 있게 되었습니다. 전체 워크플로우는 여기에서 확인할 수 있어요.

![링크 텍스트](/assets/img/2024-06-19-FromVirtualtoRealityHowSyntheticDataWillTrainSmarterRobotsforIndustrialApplications_2.png)

# FlexSim을 활용한 이산 사건 시뮬레이션

자동 유도 차량(AGV), 와이어 가이드 산업 로봇 시스템 기획자 및 AMR과 같은 로봇들이 시험되는 한 가지 방법은 이산 사건 시뮬레이션을 통한 것입니다.

<div class="content-ad"></div>

이산 사건 시뮬레이션은 시간에 따라 발생하는 일련의 이벤트로 시스템의 작동을 모델링합니다. 이를 통해 엔지니어, 디자이너 및 시뮬레이션 전문가들은 복잡한 모델을 실험하고 단계별로 테스트함으로써 프로세스를 최적화할 수 있습니다.

이산 사건 시뮬레이션을 실행하려면 다수의 사용자가 사용하는 강력한 모델링 및 시뮬레이션 소프트웨어 도구인 FlexSim을 사용합니다. FlexSim은 최근 Omniverse Connector를 개발했는데, 이를 통해 팀이 3D 모델 및 자산을 OpenUSD로 내보낼 수 있습니다.

FlexSim의 Omniverse Connector는 팀이 시뮬레이션 데이터와 실시간 3D 시각화 사이의 간격을 줄이는 데 도움을 주며, 이를 통해 현실 세계의 프로세스를 분석, 시각화 및 개선할 수 있습니다.

<div class="content-ad"></div>

이 블로그에서 FlexSim이 Omniverse 커넥터를 개발하고 USD가 고객들에게 제공하는 혜택에 대해 더 알아보세요.

# 합성 데이터를 활용하여 AI가 가능한 로봇 교육 시작하기

Omniverse 플랫폼을 통해 팀은 AI 기반 로봇을 빠르게 디자인, 테스트 및 교육을 시작할 수 있습니다.

NVIDIA Isaac Sim은 Omniverse 기술을 기반으로 한 확장 가능한 로봇 시뮬레이터로, 개발자들은 현실적인 로봇 시뮬레이션을 만들어 다양한 작업에 대한 AI 로봇을 교육 및 최적화할 수 있습니다. Isaac Sim 2023.1은 최근에 발표되었으며, 성능 향상된 인식 및 고품질 시뮬레이션을 위한 주요 업데이트가 있습니다.

<div class="content-ad"></div>

Isaac Sim의 핵심 기능은 Omniverse Replicator에서 옵니다. Omniverse Replicator은 Omniverse의 확장으로, 개발자들이 사용자 정의 SDG 도구와 파이프라인을 구축할 수 있도록 합니다. 최근에 릴리스된 Omniverse Replicator 1.10에는 Low-code, YAML 기반의 워크플로우, 스케일된 렌더링 및 더 큰 유연성을 제공하는 새로운 지원이 포함되어 있습니다.

NVIDIA Omniverse를 무료로 다운로드하여 시작하세요. 개발자들은 Omniverse 리소스에 액세스하고 OpenUSD에 대해 더 자세히 알아갈 수 있습니다.

NVIDIA Omniverse의 소식을 놓치지 마세요. 뉴스레터를 구독하고 Omniverse를 Instagram, LinkedIn, Medium, Threads, Twitter에서 팔로우하세요. 더 많은 정보를 얻으려면 포럼, Discord 서버, Twitch, YouTube 채널을 확인하세요.

# 저자 소개

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-FromVirtualtoRealityHowSyntheticDataWillTrainSmarterRobotsforIndustrialApplications_4.png)

저는 지능형 로봇의 개발, 훈련, 테스트 및 배포 방법을 혁신하는 데 초점을 맞춘 고급 제품 마케팅 매니저인 제러드 앤드류스입니다. NVIDIA Isaac Robotics 플랫폼의 채택을 촉진하여 이를 이루기 위해 노력하고 있습니다. NVIDIA에 합류하기 전에, 제러드는 Cadence에서 제품 마케팅 디렉터로 근무했으며, 라이선스 가능한 프로세서 IP의 제품 기획, 마케팅 및 비즈니스 개발을 담당했습니다. 그는 조지아 공과대학교에서 전기 공학 석사 학위를, 남부 메소디스트 대학교에서 전기 공학 학사 학위를 받았습니다.