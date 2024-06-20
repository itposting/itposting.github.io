---
title: "컴퓨터에서 RC 모델을 프로그래밍하여 제어하기"
description: ""
coverImage: "/assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_0.png"
date: 2024-06-20 16:51
ogImage: 
  url: /assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_0.png
tag: Tech
originalTitle: "Control any RC model programmatically from computer"
link: "https://medium.com/@kelvinkoko/control-any-rc-model-programmatically-from-computer-2e2cdbc0e4aa"
---


유니버설 RC 컨트롤러와 멀티 모듈을 사용하여 만들기

# RC 모델 제어를 위한 비침입적 방식

"자율주행 미니-Z와 함께 경주하는" 프로젝트의 일환으로, 첫 번째 작업은 컴퓨터에서 미니-Z를 제어하는 방법을 찾는 것입니다. 이를 달성하기 위한 여러 가지 방법이 있습니다. 예를 들어, RC 차량에 마이크로컨트롤러를 추가하거나 무선 송신기를 수정하여 제어 신호를 프로그램 할 수 있습니다. 그러나 저는 제 RC 모델을 수정하지 않는 비침입적인 방법을 선호합니다. 따라서 컴퓨터가 라디오 송신기를 모방하고 기본 Mini-Z를 제어할 수 있는 솔루션을 찾고 있습니다.

이 방식을 택한 이유는 몇 가지가 있습니다. 첫째, Mini-Z는 제 취미이며 아직도 즐겁게 놀고 싶어서 손상을 입히고 싶지 않습니다.: ) 게다가, 제 프로젝트의 목표는 사람과 경주하는 것이기 때문에, 자동차가 일반 플레이어의 자동차와 동일한 구성을 유지하여 공정한 경기를 보장하고 싶습니다.

<div class="content-ad"></div>

# 컴퓨터에서 라디오 신호 전송하기

내 첫 번째 아이디어는 트레이너 포트를 통해 컴퓨터를 라디오 송신기에 연결할 수 있는지 알아보는 것입니다. 라디오 송신기의 트레이너 포트는 주로 모델용 원격 제어(RC) 시스템에서 사용됩니다. 두 송신기를 연결하는 인터페이스 역할을 하며, 일반적으로 강사가 학생을 가르치는 훈련 목적으로 사용됩니다. PPM 신호를 에뮬레이트하고 송신기에 입력할 수 있다면, 주식 모델 컨트롤러의 라디오를 활용할 수 있을 것입니다.

![이미지](/assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_0.png)

실제로, 트레이너 포트에 대한 정보를 찾던 중 이 프로젝트인 PPMControl을 발견했습니다. 누군가가 이미 이 아이디어를 구현했습니다. 이 접근 방식이 괜찮다면, 이 프로젝트를 살펴보시기 바랍니다.

<div class="content-ad"></div>

그러나 이 해결책을 사용할 수 없다는 것을 발견했어요. 현대 RC 모델에서 2.4GHz 무선 신호가 흔하지만, 서로 다른 브랜드나 심지어 같은 브랜드 내의 다른 시리즈도 서로 다른 프로토콜을 사용합니다. 따라서 2.4GHz 송신기를 사용하더라도 모델과 호환되지 않을 수 있습니다. 예를 들어, 내 Mini-Z는 FHSS 프로토콜을 사용하는데, 이를 지원하는 컨트롤러만 호환됩니다. FHSS 프로토콜을 지원하는 컨트롤러를 찾던 중 여러 프로토콜을 지원하는 모듈을 개발한 흥미로운 프로젝트를 발견했어요.

# 멀티 모듈

![이미지](/assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_1.png)

멀티 모듈은 4가지 다른 RF 구성 요소를 통합한 오픈 소스 2.4GHz 송신기 모듈로, 거의 모든 RC 송신기가 다양한 수신기와 모델을 작동할 수 있도록 합니다. 일종의 유니버설 TV 원격 제어기로, 여러 TV 브랜드의 원격 제어 코드를 이미 모두 포함하고 있는 것을 비유할 수 있어요. 마찬가지로 멀티 모듈은 여러 RF 구성 요소를 포함하며 가장 일반적인 RC 프로토콜을 지원합니다. 이는 모듈 포트가 있는 무선 송신기와 사용하도록 처음에 설계되었습니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_2.png" />

이 프로젝트는 오픈 소스로, 새로운 프로토콜을 추가할 수 있도록 허용합니다. 계속 활발히 유지되는 이 프로젝트에는 공동 작업자들이 계속해서 새로운 모델 지원을 추가하고 있습니다. 그래서 나는 컴퓨터와 연결해서 RC 모델을 수정하지 않고도 모든 RC 모델을 프로그래밍 방식으로 제어할 수 있게끔 고려 중입니다.

# 구현

이 모듈은 시리얼 및 PPM 입력을 수락하며, 이상적으로 컴퓨터에서 직접 시리얼 신호를 보내는 것이 좋을 것입니다. 그러나 작성 시점에 라디오 송신기의 시리얼 사양에 대한 명확한 문서를 찾지 못했기 때문에 (참고 자료가 있는 경우 알려주세요!). 개념을 먼저 테스트하고 싶었기 때문에, 컴퓨터에서 시리얼 명령을 수신하고 그에 따라 PPM 신호를 생성하는 변환기로 아두이노를 사용했습니다.


<div class="content-ad"></div>


![Image 3](/assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_3.png)

아두이노에는 이미 PPMEncoder 라이브러리가 있습니다. 따라서 제 프로그램은 주로 시리얼 통신을 초기화하고 라이브러리를 호출하여 PPM 신호를 생성합니다. 컴퓨터 측에서는 시리얼 포트 연결을 지원하고 스티어링(채널 1)과 스로틀(채널 2)의 타겟 펄스 폭을 전송하는 간단한 파이썬 애플리케이션을 작성했습니다.

![Image 4](/assets/img/2024-06-20-ControlanyRCmodelprogrammaticallyfromcomputer_4.png)

# 결론


<div class="content-ad"></div>

마침내 비디오에서 보여준 대로 차량을 수정하지 않고 재고 Mini-Z를 제어할 수 있게 되었어요. 이 설정은 철저히 제품의 조합이며, 납땜도 필요 없고 모든 항목은 다른 목적으로 재사용할 수 있어요. 이 기사가 여러분의 프로젝트에 도움이 되는 비침입적인 방법을 제공하는 데 도움이 되기를 바라요.

참고: 

이 프로젝트의 소스 코드: https://github.com/kelvinkoko/universal-rc-controller