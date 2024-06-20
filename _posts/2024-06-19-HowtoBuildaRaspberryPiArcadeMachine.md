---
title: "라즈베리 파이 아케이드 머신을 만드는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_0.png"
date: 2024-06-19 17:56
ogImage: 
  url: /assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_0.png
tag: Tech
originalTitle: "How to Build a Raspberry Pi Arcade Machine"
link: "https://medium.com/swlh/how-to-build-a-raspberry-pi-arcade-machine-3de4df2894c6"
---



![Arcade Machine](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_0.png)

어릴 적 친구들과 함께 밤새도록 오래된 CRT TV에서 레트로 게임을 즐기던 추억이 여전히 내 마음속에 살아있어요. 비디오 게임은 제 성장 과정에서 중요한 역할을 해 왔고, 2000년대에 게임 산업이 빠르게 발전함에 따라 옥상 방의 구름 잡힌 빈틈 채우고 있는 빈틈새를 잊고 있었어요. 전문적으로 처음 일하러 간 인턴십 때, 회사에서 DIY 아케이드 기계가 있어 빠도록 내 어린 시절의 향수에 시달리기 시작했죠.

그 이후로 제게 꿈이었던 아케이드를 직접 만드는 것이 되었고, 대학에서 처음 학기에 몇 명의 친구들과 함께 그것을 실현했어요.

저희가 그렇게 만든 방법은 다음과 같아요.


<div class="content-ad"></div>


![How to Build a Raspberry Pi Arcade Machine - Image 1](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_1.png)

![How to Build a Raspberry Pi Arcade Machine - Image 2](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_2.png)

For our design, we chose to build a full-size arcade machine with two sets of controls suitable for fighting games like Street Fighter, Super Smash Brothers, and Tekken.

To streamline our project, we followed a premade plan available at TheGeekPub.


<div class="content-ad"></div>

이 계획들은 여기에서 확인하실 수 있어요.

왼쪽에는 우리 아케이드가 어떻게 보이길 원했는지에 대한 빠른 모형이 있어요.

최종적으로 채택한 디자인은 폭 27인치, 높이 66인치, 그리고 앞에서 뒤까지 길이 24인치였어요.

우리는 설정이 쉽도록 앞쪽에 키보드 트레이를 두고자 했으며, 추가 재료와 도구를 보관할 수 있는 트렁크 문도 설치했어요.

<div class="content-ad"></div>


![Arcade Machine](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_3.png)

기계의 총 비용은 650달러 캐나다 달러이며, 부품 중에서 가장 비용이 많이 드는 것은 모니터, 페인트, 조이스틱, 라즈베리 파이 및 목재입니다.

우리는 다행히도 우리 대학의 기계 공작실에서 대부분의 시간을 보냈기 때문에 도구를 구매할 필요가 없었습니다. 기술적으로 말하면, 여기서 모든 작업은 절단기와 손전드릴만 있으면 충분히 할 수 있지만, 다른 도구를 보유하면 작업이 훨씬 빨라질 것입니다.

여기 우리가 아케이드를 만들기 위해 사용한 모든 하드웨어 목록과 사용된 도구가 있습니다. 부품의 상세 비용 분석 및 구입 링크는 이 스프레드시트에서 확인하실 수 있습니다.


<div class="content-ad"></div>

## 전자제품

- 20 Hikig LED Push Buttons 및 2 조이스틱
- 2x Easyget Zero-Delay USB 인코더
- 27인치 Acer 모니터
- Raspberry Pi 3
- USB 스피커
- 키보드
- 마우스

## 하드웨어

- 2x MDF 우드 3/4인치 x 49 x 97인치
- 2x 인셋 오버레이 클립 힌지
- 8 x 5/8인치 입자 보드 나사
- 지지를 위한 L자 형강
- 브레이크가 장착된 3인치 캐스터 바퀴
- 캐비넷을 위한 우편함 잠금 장치
- 1 1/2인치 못
- 목재 접착제
- 10인치 x 18인치 플렉시글라스 시트
- 평지 블랙 프라이머 5캔
- 블랙 유광 페인트 5캔
- 핑크 스프레이 페인트 3캔
- 형광 노랑 스프레이 페인트 1캔

<div class="content-ad"></div>

## 사용된 도구

- 원형 톱
- 죽 쏘
- 다양한 포스터너 비트가 장착된 드릴 프레스
- 라우터
- 오비탈 샌더
- 밀링 머신
- 무선 드릴
- 목공 클램프

![이미지 1](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_4.png)

![이미지 2](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_5.png)

<div class="content-ad"></div>

# 초기 계획

우리는 두 장의 MDF 시트를 가져다가 각 구성 요소의 치수를 추적했습니다. 그런 다음 원형 톱을 사용하여 시트를 자르기 시작했습니다.

![이미지](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_6.png)

# 측면 자르기

<div class="content-ad"></div>

아케이드 한 쪽을 MDF 시트에 나선 그리기로 윤곽을 잡았어요. 그 후 천막톱으로 그 부분을 잘라내고, 또 다른 부분 위에 올려서 그 선을 옮겼어요. 두 번째 부분을 잘라낸 후 양쪽을 맞추기 위해 모두 세웠어요.

![Arcade Image](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_7.png)

## 백어 블록

조립을 위해 스크랩 우드를 사용하여 다른 부분이 올려질 1x1인치 백어 블록을 잘라내기로 준비했어요. 블록의 크기/길이는 중요하지 않지만, 두 번 다른 부분에 맞추는 데 주의를 기울이는 것이 중요해요. 저희의 경우 약간 차이가 있어서 문제가 많았어요.

<div class="content-ad"></div>


![HowtoBuildaRaspberryPiArcadeMachine_8](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_8.png)

# 페인팅 (시도 1)

우리는 오비탈 샌더와 점점 더 가는 모래지를 사용하여 조각들을 갈아주었습니다. 그 후에 매트 프라이머를 바르고 유광 검정 마감을 하였습니다. 유광 층은 매우 균일한 층을 얻기가 어려웠고 스프레이 캔을 사용하면서 조차도 작은 먼지 입자가 오렌지 껍질이라는 효과를 일으키게 되었습니다. 회고적으로 생각해보면, 아마도 페인트 양동이와 붓을 사용하는 편이 나을 것이었을지도 모릅니다.

![HowtoBuildaRaspberryPiArcadeMachine_9](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_9.png)


<div class="content-ad"></div>

# ... 시도 3 

이전 도료를 깎아내고 다시 바르고 다시 도색하는 과정을 여러 차례 반복해야 했지만, 결국 깔끔한 마무리를 이룰 수 있었어요.

스프레이 캔을 각도로 사용하는 것이 많은 도움이 되었어요.

과정을 마치고 나니 우리는 도료에 거의 $100을 썼어요. 그래도 적어도 예쁘다고 할 수 있지 않을까요? ¯\_(ツ)_/¯

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_10.png" />

# 베이퍼웨이브 스타일링

레트로 룩을 완성하기 위해, 태양과 수평선으로 구성된 디자인을 만들었습니다. 이 패턴은 엑스엑토 나이프로 잘라 낸 페인터 테이프 조각들로 측면 패널에 전달되었습니다.

아..에..에스..테~틱~

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_11.png" />

<img src="/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_12.png" />

# 바퀴

우리의 아케이드를 쉽게 이동할 수 있도록 하기 위해, 바닥 패널에 몇 개의 캐스터를 설치했습니다.

<div class="content-ad"></div>

팁: 이 단계를 먼저 완료하면 다른 부분을 전송하는 데 사용할 수 있어요.

![Speaker](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_13.png)

## 스피커

스피커를 만들기 위해 우리는 드릴링 템플릿을 사용했고 일반 핸드 드릴을 사용하여 진행했어요. 그리고 나서 달러 스토어에서 $5 스피커를 고무 줄과 못을 사용하여 고정했어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_14.png" />

# 캐비닛 자물쇠

우리 아케이드의 전면 문은 캐비닛으로 사용하기 위해 나무를 밀어내어 표준 메일박스 자물쇠를 맞출 수 있도록 만들었습니다.

자물쇠 메커니즘은 캐비닛 오른쪽 쪽면에 장착된 L자 모양 지지대에 고정되어 작동합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_15.png)

# Keyboard Tray

We installed a keyboard tray by attaching a pair of rollers to a piece of wood. Since we are new to handling hardware, we were not aware of the clever design of the rails that allows you to adjust the height and inset before tightening the screws.

![image](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_16.png)


<div class="content-ad"></div>

# 마퀴

우리는 포토샵으로 마퀴를 디자인하고 약 10달러에 인쇄해 냈습니다. 그런 다음 플렉시글라스 조각을 잘라서 백어 블록에 장착했어요.

![이미지](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_17.png)

# 컨트롤 패널

<div class="content-ad"></div>

컨트롤 패널을 만들기 위해 MDF 나무 조각에 드릴링 템플릿을 테이프로 고정한 뒤, 1 1/8인치 포스터 비트를 장착한 드릴 프레스를 사용하여 버튼을 위한 구멍을 뚫었어요.

다양한 버튼 레이아웃이 있으니 신중히 선택해주세요! 저희는 손가락의 굴곡과 일치하지 않는 버튼 레이아웃을 선택한 실수를 저질렀었어요. 그래서 조금 서투른 경험을 했죠.

![이미지](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_18.png)

# 연결하기

<div class="content-ad"></div>

이 과정은 상당히 간단합니다: 버튼을 제어 패널에 나사로 고정하고, 각 버튼을 USB 인코더에 연결한 후 USB 출력을 라즈베리 파이에 연결하면 됩니다.

컨트롤이 준비되면 단순히 모니터, 키보드 및 마우스를 라즈베리 파이에 연결하고 RetroPie 설치 안내에 따라 이 단계를 수행하면 됩니다.

게임을 실행하는 데 필요한 모든 것이 여기에 담겨 있을 것입니다!

![Raspberry Pi 아케이드 머신 만들기](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_19.png)

<div class="content-ad"></div>

# 모든 것을 함께 조립하기

우리가 해야 할 마지막 일은 모든 것을 조립하는 것입니다. 우리는 이미 모든 구성 요소를 갖고 있으므로 이 작업은 그리 오래 걸리지 않을 것입니다.

일단 한 쪽 패널을 표면에 평평하게 두고 상판, 중판, 하판 및 뒷면 패널을 백어 블록에 고정하기 위해 못을 사용합니다. 추가적인 지원을 위해 L자 모양 지지대와 목재 접착제를 사용할 수 있습니다.

그런 다음, 다른 쪽 패널을 위에 올려두고 다시 못을 사용해 모든 것을 제자리에 고정합니다.

<div class="content-ad"></div>

안녕하세요! 다음은 인셋 클립 힌지를 사용하여 현관문을 설치할 수 있습니다.

![Front Door](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_20.png)

# 모니터 설치

마지막 단계는 모니터를 설치하는 것입니다. 가장 좋은 방법은 먼저 모니터를 구입하고 아케이드의 너비를 계획하여 적당한 폭을 남기는 것입니다. 각 측면에 3/4인치 백어 블록을 위한 여유 공간을 1인치 정도 남기면 좋습니다.

<div class="content-ad"></div>

혹은 모니터의 형태가 허용된다면, 전체 너비에 걸쳐 설치할 수 있는 패널을 선택할 수도 있어요.

어떤 방법을 선택하더라도, 뒷면 블록을 정렬/자취하는 일을 한 사람이 하고 다른 사람이 모니터를 홀딩하는 게 좋아요 (떨어뜨리지 않도록 주의하면서!)

# 마무리

여기까지입니다! 조립한 아케이드 모습이에요, 완성했습니다!

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-HowtoBuildaRaspberryPiArcadeMachine_21.png)

워터루 공과대학의 기계 학생 샵에서 우리 프로젝트를 도와주신 분들 덕분에 가능했어요. 우리가 가진 모든 질문에 도움을 주시고, 다양한 도구를 사용하는 법을 가르쳐 주셔서 감사합니다.

## 함께 소통해요!

켈빈 장
윌리엄 트란
케빈 장
프랭크 첸

<div class="content-ad"></div>

Sure! Here is the translation of your text into Korean:

당신이 개발자이시군요. 위의 텍스트를 한국어로 친근하게 번역해 드리겠습니다.