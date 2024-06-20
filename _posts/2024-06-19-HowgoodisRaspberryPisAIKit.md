---
title: "라즈베리 파이의 AI 키트는 얼마나 좋은가요"
description: ""
coverImage: "/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_0.png"
date: 2024-06-19 02:45
ogImage: 
  url: /assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_0.png
tag: Tech
originalTitle: "How good is Raspberry Pi’s AI Kit"
link: "https://medium.com/generative-ai/how-good-is-raspberry-pis-ai-kit-3a6d65884bee"
---


![image](/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_0.png)

라즈베리 파이가 머신 러닝 기능을 갖춘 싱글 보드 컴퓨터 AI Kit을 출시했습니다. 최근 IPO 출시를 촉진하기 위한 것일 수도 있지만, 성능 데이터를 보면 AI 엣지 컴퓨팅 시장을 뒤흔들 것으로 보입니다.

이 AI 키트는 Hailo-8L 가속기와 라즈베리 파이의 자체 M.2 HAT+ 보드로 구동됩니다.

어쨌든, 이 $70의 AI 가속기는 정말 좋은 품질입니다. 아래 섹션에서 제시된 것처럼 임베디드 애플리케이션을 위한 강력한 가격을 얻을 것입니다.

<div class="content-ad"></div>

## Hailo-8L 소개:

라즈베리 파이는 액셀러레이터 제공 업체로 Hailo를 선택했습니다. Hailo-8L은 최근 발표된 Hailo-8 칩의 간소화된 버전으로, 26TOPS를 제공합니다. Hailo-8L은 칭찬받을 만한 13TOPS를 제공하여 라즈베리 파이에 필요한 AI 성능을 제공합니다.

![이미지](/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_1.png)

최근 몇 주 사이에 TOPS 레코드가 빠르게 깎이고 있다는 글을 작성했습니다. 최근 AMD가 50TOPS로 TOPS 차트를 석권하고 있어, 13TOPS는 낮아 보일 수도 있습니다.

<div class="content-ad"></div>

그런데 중요한 점을 고려해야 합니다. 이 내용은 임베디드 환경에서 사용될 것이며, 13TOPS는 컴퓨터 비전 분야의 엣지 애플리케이션에 큰 이점을 제공할 것입니다. 또한, 작성 시점에서 RISC-V Linux 랩탑은 단지 2TOPS를 제공합니다.

Hailo는 특히 저전력 엣지 AI 애플리케이션에 중점을 둔다는 사실을 알아두세요. 그들은 심지어 NVIDIA를 훌륭하게 이길 수 있습니다. 아래는 NVIDIA의 Jetson Nano 및 Xavier NX와 비교한 Hailo의 성능입니다.

![Hailo Performance Comparison](/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_2.png)

이 칩은 TensorFlow, TensorFlow Lite, Keras, PyTorch 및 ONNX를 포함한 다양한 AI 프레임워크를 널리 지원합니다.

<div class="content-ad"></div>

상기 숫자 및 성능 이점을 고려하면, Hailo와 함께 Raspberry Pi를 선택하는 것이 명백해 보입니다.

## Raspberry Pi 인공지능 키트 아키텍처 및 디자인

현재 이 AI 키트는 x86 및 Arm 호스트 아키텍처를 모두 지원합니다.

Raspberry Pi CEO인 Eben은 Apple 및 Qualcomm SoC의 AI PC를 위해 최근 출시된 통합 NPU와는 달리 별도의 가속기 보드를 계획적으로 준비했다고 전했습니다.

<div class="content-ad"></div>


![Raspberry Pi AI Kit](/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_3.png)

라즈베리 파이는 이미 저렴한 40나노미터에서 IO 기능을 사용하여 분리된 아키텍처를 갖고 있습니다. CPU 및 GPU는 16나노미터에 있습니다. 코어는 16나노미터에 있지만 NPU를 추가하면 면적이 커져 비용이 많이 드는 문제가 발생할 수 있습니다.

비 AI 응용 프로그램을 위해 라즈베리 파이 5를 사용하려는 사용자도 있을텐데요 ;-) 이들은 불필요한 NPU 다이 면적 비용을 위해 더 많은 돈을 지불해야 합니다. 이제 선택권이 생겼고 하드웨어 엔지니어들은 선택권을 좋아합니다. . .

라즈베리 파이 3 버전 자체는 AI 응용 프로그램에 사용되었지만 AI 워크로드는 클라우드에서 실행되었습니다. 이 새로운 라즈베리 파이 5는 Hailo-8L을 사용하여 에지에서 작은 모델과 최적화된 LLM(로컬 모델 매니저)을 직접 수행할 수 있습니다.


<div class="content-ad"></div>

## 라즈베리 파이 AI 키트의 현재 상태:

이 라즈베리 파이는 PCIe 2.0 인터페이스를 통해 Hailo-8L 가속기와 통신합니다. 그리고 PCIe 2.0은 라즈베리 파이 5 버전에만 있습니다. 따라서 AI 기능을 시도하려면 보드를 교체해야 합니다. 하지만, 심지어 라즈베리 파이 5의 M.2 HAT+도 약 80달러 정도에 구매할 수 있습니다.

이 키트에는 Hailo-8L의 열을 효과적으로 방출하기 위한 사전 부착된 열 패드가 포함되어 있습니다. Hailo-8L은 소비전력은 적지만 상당히 더울 수 있습니다.

라즈베리 파이는 이것이 많은 메이커 커뮤니티에게 새로운 영역임을 이해합니다. 따라서 사용자가 AI 기능을 개발하는 데 필요한 데모 및 소프트웨어 유틸리티를 제공할 계획입니다.

<div class="content-ad"></div>

하드웨어는 그대로 작동하지만 중요한 점은 소프트웨어가 아직 완전하지 않다는 것입니다. 그러나 몇 달 안에 상황이 변할 것입니다.

Tom's Hardware 팀이 리뷰 키트를 받았을 때 몇 가지 문제가 발생했습니다. Raspberry Pi OS 업데이트가 AI 기능 일부를 활성화할 예정이라는 것을 알았습니다. 현재 사용이 제한되지만, 이미 teddy bear를 포함한 이미지를 감지할 수 있었습니다. 따라서 현재는 약간의 노력이 필요합니다.

이 데모는 속도 측정을 수행하지 않았지만, 팀은 몇 가지가 더 빠르다고 "느꼈다"고 언급했습니다. 미래에 Raspberry Pi가 필요한 경우에는 우리 자신의 모델을 실행할 수 있다고 언급했다.

<div class="content-ad"></div>

## 사용 사례:

라즈베리 파이 & 헤일로는 이미지 인식을 포함한 컴퓨터 비전 하드웨어의 저전력 장점이 엣지 노드에서 중요하다고 주장합니다.

이 회사는 또한 게임에 AI 기능을 추가하는 데 적합한 몇 가지 모델을 보유하고 있다고 합니다. — 음, 인간들...

![이미지](/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_5.png)

<div class="content-ad"></div>

Windows 11이 라즈베리 파이가 목표로 하는 대상이 아니라서, 이 키트는 Microsoft Copilot 소프트웨어용이 아니라는데요. 그러나 일부 기능이 작동할 수 있는 가능성은 배제되지 않습니다. Copilot+ PC에 요구되는 40TOPS 중 13TOPS는 거의 1/3이므로 어떤 부분은 실제로 작동할 것으로 예상됩니다.

## 결론

양 회사 모두 메이커 커뮤니티가 자체 문제를 해결할 독특한 사용 사례를 개발할 것으로 기대하고 있습니다. 저 또한 라즈베리 파이 커뮤니티의 힘으로 인해 차이가 날 것이라고 믿습니다. 교실 프로젝트 외에도 많은 로봇 응용 프로그램이 새롭게 발견된 13TOPS AI 기능을 사용하기 시작할 것입니다.

보다 원활한 플랫폼 작동을 위해 더 많은 라즈베리 파이 소프트웨어 업데이트를 기다려야 합니다. 흥미로운 사실은 라즈베리 파이 CEO가 Hailo와의 협력이 이로써 끝나지 않는다고 언급했다는 것입니다. . . .

<div class="content-ad"></div>

에지 AI의 미래가 무엇을 가지고 있는지 정말 흥미로울 것입니다.

더 많은 혁신 및 딥 테크 이야기를 보려면 박수를 보내 주시고 저를 팔로우해주세요. 매주 발송되는 혁신 스냅 소식지를 구독하여 혁신을 영감받으세요.

![2024-06-19 How good is Raspberry Pi's AI Kit](/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_6.png)

이 이야기는 Generative AI에 게재되었습니다. LinkedIn에서 저희와 연결하고 최신 AI 이야기에 대한 소식을 받으려면 Zeniteq를 팔로우하세요.

<div class="content-ad"></div>

최신 생성적 AI 뉴스와 업데이트를 받으려면 뉴스레터를 구독해주세요. 함께 AI의 미래를 만들어봐요!

`<img src="/assets/img/2024-06-19-HowgoodisRaspberryPisAIKit_7.png" />`