---
title: "만나요, Lawny 라즈베리 파이로 제어하는 FPV 잔디깎이"
description: ""
coverImage: "/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_0.png"
date: 2024-06-19 18:21
ogImage: 
  url: /assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_0.png
tag: Tech
originalTitle: "Meet Lawny: Phone-Controlled FPV Lawnmower with Raspberry PI"
link: "https://medium.com/@gektor650/meet-lawny-phone-controlled-fpv-lawnmower-with-raspberry-pi-100fd48f0488"
---


가정에서 편안한 의자에 앉아 레이싱 시뮬레이터를 즐기고, 동시에 잔디를 풀어낼 수 있는 상상을 해보세요. 멋져 보이나요? 이게 실제로 가능해요.

![Lawny](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_0.png)

Lawny를 만나보세요! 이 잔디 깎는 기계는 앞면 카메라가 장착돼 있어서 원격 조종 로봇을 제어하면서 잔디를 깎을 수 있어요!

라즈베리 파이, H-브리지, 전동 모터, 그리고 카메라를 사용해서 만들었어요. 모바일폰이나 데스크톱에서 제어할 수 있어요.

<div class="content-ad"></div>

프로젝트의 주요 아이디어는 휴대폰을 사용하여 잔디깎이를 제어하고, 같은 그림을 볼 수 있는 것입니다.

다음은 이 프로젝트의 제작 과정과 이 글에 설명된 모든 개념을 담은 전체 비디오입니다:

# 시스템 디자인

저는 Steel Razors 트리머 헤드를 가지고 있습니다. 전기 모터를 추가하면 잔디깎기가 될 것입니다. 모터가 칼날을 회전시키고, 그것들이 잔디를 베어낼 것입니다. 간단하죠.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_1.png)

모터를 제어하려면 릴레이와 컨트롤러가 필요합니다. 제 경우에는 라즈베리 파이 5를 사용했어요 (가지고 있었기 때문에). 그러나 어떤 라즈베리 기기라도 펄스 폭 변조 및 카메라를 지원할 수 있습니다.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_2.png)

그것은 정적 잔디깎이가 될 거예요. 하지만 저는 한 곳뿐만 아니라 어디든 잔디를 자르고, 잔디깎이를 왼쪽과 오른쪽으로 회전시키고 싶어요.


<div class="content-ad"></div>

따라서 전기 모터를 두 대 더 추가하려고 합니다.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_3.png)

건설물은 무거울 것이기 때문에 속도가 아닌 전원이 필요하며, 실제 자동차에서와 같이 방풍 가차 모터를 사용할 것입니다.

이제 속도와 회전 방향을 제어해야 하므로 여러 개의 H-브릿지를 추가할 계획입니다. H-브릿지로 모터를 제어하는 방법에 대한 설명이 있는 별도의 영상이 있어요. 궁금하시면 확인해 보세요:

<div class="content-ad"></div>

첫 번째 제한 사항은 단일 모터를 제어하기 위해 두 개의 펄스 폭 조절 채널이 필요하다는 것입니다. 그러나 저는 두 개의 모터를 가지고 있으므로 네 개의 채널이 필요합니다. 이 문제를 해결하기 위해 두 개의 릴레이를 추가하여 핀 사이의 신호를 전환하고 있습니다.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_4.png)

또한, 잔디 깎는 기계가 어디로 가고 있는지 확인해야 하므로 라즈베리 파이에 카메라 모듈을 추가할 예정입니다.

게다가, 전원 공급원이 필요합니다. 많은 전류를 소비하는 요소에 의한 전원 감소를 방지하기 위해, 모터용 별도의 배터리와 라즈베리 파이 및 전자 장치용 파워 뱅크를 사용할 것입니다.

<div class="content-ad"></div>

마지막으로, 이 시스템을 Wi-Fi를 통해 크로스 플랫폼 애플리케이션을 통해 모바일 폰에서 제어할 거에요.

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_5.png)

잘 봐도 이게 연결 스키마가 아니라 시스템의 개략적인 설명일 뿐이에요.

## Cutter box

<div class="content-ad"></div>

커터 상자부터 시작할게요.

합판 한 조각이 있어요. 바닥면과 벽을 잘라야 해요. 일부 벽은 조금 더 키울 거에요.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_6.png" />

다음으로, 벽을 판에 부착할 거에요. 목재 브라켓 커넥터를 사용하고 다시 많이 드릴링할 거에요. 게다가, 커터 모터를 수용할 몇 개의 구멍을 더 만들어야 해요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_7.png" />

그리고 마지막으로, 모든 것을 함께 조립할 수 있어요.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_8.png" />

그리고 모터를 설치할 거에요.

<div class="content-ad"></div>

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_9.png)

## 이동 개념

지금은 모터가 달린 면도기가 있어요. 그러나 이것은 정적인 블록입니다. 이 면도기를 움직이려면 나머지 몸통을 만들어야 합니다. 몸체에 면도기 상자를 놓고 전체 구조물을 왼쪽과 오른쪽으로 움직일 수 있게 해주어야 합니다.

세 개의 바퀴 설정을 사용할 거에요 - 두 개의 전방 바퀴와 하나의 후방 바퀴로, 피벗 상에 회전합니다.

<div class="content-ad"></div>

만일 왼쪽 바퀴가 더 빠르다면, 잔디 깎기는 오른쪽으로 이동하고, 후방 바퀴는 몸체의 힘으로 회전될 것입니다.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_10.png" />

만일 오른쪽 바퀴가 더 빠르다면, 잔디 깎기는 왼쪽으로 이동하고, 후방 바퀴는 그에 따라 회전될 것입니다.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_11.png" />

<div class="content-ad"></div>

마지막으로, 속도가 같으면 직진합니다.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_12.png)

# Lawny의 몸을 만들기

나는 몸의 측면을 형성하며 시작합니다. 이를 판자로 잘라야 합니다.

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_13.png)

옆면이 완료되면 자동차 풀비둘기 모터 2개를 추가합니다. 이 전기 모터는 더 많은 토크를 가진 기어박스가 있어 무거운 프로젝트에 더 잘 작동할 것입니다.

![이미지2](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_14.png)

다음으로, 전자 부품을 위한 앞쪽 상자를 만들어야 합니다. 이 상자는 밀폐되어 있어야 하며 부품이 습기와 풀로부터 안전하게 보호되도록 도와줍니다.


<div class="content-ad"></div>

또한, 후면을 추가하고 있습니다. 세 번째 바퀴가 들어갈 부분입니다.

![Image1](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_15.png)

이제 바퀴를 추가할 시간입니다.

![Image2](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_16.png)

<div class="content-ad"></div>

이 프로젝트에서는 여러 종류의 바퀴를 사용했어요. 가장 저렴한 옵션부터 시작해서 안에 커플링 너트를 망치로 박기로 결정했어요. 바퀴가 깨졌지만, 그게 제가 가진 최고의 바퀴였어요 :)

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_17.png" />

마지막으로, 세 번째 바퀴가 로니의 이동 부분을 완성했어요.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_18.png" />

<div class="content-ad"></div>

# 수직 조절

다양한 높이에서 잔디를 자를 수 있도록 추출기 덱에 사각형 구멍 네 개를 만들 것입니다. 커터는 볼트로 측면에 부착되며, 이 구멍들은 그 수직 조절을 가능하게 합니다.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_19.png)

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_20.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_21.png" />

# Painting

다음 단계는 도색입니다. 저는 Home Depot에서 가장 싼 흰색 페인트를 샀고 지하실에서 몇 가지 색소를 가져왔어요.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_22.png" />

<div class="content-ad"></div>

이미지 태그를 다음과 같이 변경하겠습니다.


![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_23.png)


# 하나의 PWM 신호, 하나의 릴레이, 두 가지 방향

먼저 H-브리지와 릴레이를 사용하여 PWM 신호와 GPIO 하나로 모터를 제어하는 방법을 검토해봅시다.

Input 1에 신호를 보내면 모터가 회전합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_24.png)

Input 2로 신호를 보내면 H-Bridge는 전류 극성을 변경하고 모터는 반대 방향으로 회전합니다.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_25.png)

Raspberry PI의 두 핀 간에 입력을 전환하기 위해 간단한 릴레이를 추가할 수 있습니다.


<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_26.png)

# Connection schema

I will have two electric circuits. The first one is a 5V circuit with controller elements. Twelve-volt connections have thin lines on the schema.

We have :


<div class="content-ad"></div>

- 라즈베리 파이: 시스템의 두뇌 역할을 합니다.
- Lawny 이동을 제어하기 위해 두 개의 H-브릿지.
- 세 개의 릴레이: 이동을 위한 두 개의 추가 릴레이 및 잔디깎이 모터를 제어하기 위한 하나의 릴레이.
- 두 개의 와이퍼 모터
- 잔디깎이 모터
- 12V 배터리 (최소 9AH)
- 파워 뱅크

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_27.png)

# 부품 조립

이제 우리가 구상한 스키마를 실현해 볼 차례입니다. 전자 부품을 상자에 배치하기 시작하겠습니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_28.png)

Further, I am adding both windshield wiper motors and connecting their black and yellow wires to the H-Bridge motor’s output.

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_29.png)

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_30.png)


<div class="content-ad"></div>

마지막으로 물리적 스위처를 추가하고 있어요. 한 번에 하나의 버튼으로 모든 모터를 비활성화할 수 있다면 매우 도움이 될 거예요.

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_31.png)

남은 부분은 모든 전선을 연결하고 배터리와 파워 뱅크를 추가하는 것이에요.

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_32.png)

<div class="content-ad"></div>

그리고 또 한 번 대실패야. 이 바퀴들은 잔디 깎이를 움직이고 조향하기에 충분한 그립이 없어.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_33.png)

실제 동작 중:

게다가 각 바퀴의 금이 새어도 내구성을 높여주지 않아.

<div class="content-ad"></div>

# 업그레이드

그래서 첫 번째 업그레이드 시간이에요!

낡은 바퀴는 버리고 더 좋은 쌍을 살펴볼 수 있어요.

![image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_34.png)

<div class="content-ad"></div>

이제는 내부에서 커플링 너트를 박아 넣지 않을 거예요. 대신에 가열하고 내부에서 가압할 거에요. 보세요, 배우고 있어요!

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_35.png)

다음 업그레이드는 — 후륜입니다. 그것도 그립이 좋지 않고 로니에게 너무 작아요. 게다가 멋있어 보이지도 않아요.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_36.png)

<div class="content-ad"></div>

그럼 이제 우리 얘기하고 있어요!

남은 부분은 설치하는 것이에요. 믿을 수 있게 만들기 위해 다시 드릴링하고 절단 중이에요.

<img src="/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_37.png" />

# 카메라 설치

<div class="content-ad"></div>

제 아내가 두 번째로 나를 구해주었어요. 그녀가 너무 멋진 얼굴을 만들었어요!

![Face Painting](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_38.png)

그리고 저는 앞면에 카메라를 추가하고 있어요.

![Adding Camera](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_39.png)

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_40.png)

Finally, I can do another Lawny test!

## Upgrades #2

On the second test, Lawny didn’t manage to go on top of the tall grass.


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_41.png)

손잡이는 훨씬 좋아졌지만 여전히 키가 큰 잔디를 다루기에는 부족해요.

지하실로 돌아갑니다. 이제 고칠 방법을 알았어요. 많은 나사가 있어요.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_42.png)

<div class="content-ad"></div>

비싼 바퀴에 돈을 털어서 사지 않아도, 우리가 매드 맥스 모드로 가서 현재 바퀴를 튜닝할 수 있다. 

이 비디오의 마지막 개선은 블레이드입니다. 솔직히 전기 모터가 풀잎을 잘라내기에는 너무 약합니다. 멈추고 열이 나고 의도한 대로 작동하지 않습니다. 

다행히 이전 블레이드를 튼튼한 옵션으로 대체할 수 있고, 최대한 날카롭게 갈아내고 있어요.

![이미지](/assets/img/2024-06-19-MeetLawnyPhone-ControlledFPVLawnmowerwithRaspberryPI_43.png)

<div class="content-ad"></div>

결과가 공격적으로 보이고, 그것이 멋지네요.

# 결과

최종적으로, 저는 높은 풀을 깎고 Lawny를 모든 장애물을 피해 이동시키는 데 어떤 문제도 없었습니다. Lawny는 쉽게 규칙적인 깎기를 할 수 있었습니다. 너무 자란 잔디는 더 많은 시간이 필요하지만, 결국 로얄 라운지가 처리할 것입니다. 잔디 깎는 모터는 잔디와 사용 빈도에 따라 더 강력할 수 있습니다.

실제 작동 중:

<div class="content-ad"></div>

댓글이나 비디오에서 소프트웨어 부분을 알고 싶거나 일반적으로 생각을 공유하고 싶다면 알려주세요!

읽어주셔서 감사합니다 (또는 스크롤해 주셔서 🙂)!