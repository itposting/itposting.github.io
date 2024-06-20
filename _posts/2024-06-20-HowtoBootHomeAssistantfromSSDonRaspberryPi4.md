---
title: "라즈베리 파이 4에서 SSD로 홈 어시스턴트 부팅하는 방법"
description: ""
coverImage: "/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_0.png"
date: 2024-06-20 16:16
ogImage: 
  url: /assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_0.png
tag: Tech
originalTitle: "How to Boot Home Assistant from SSD on Raspberry Pi 4"
link: "https://medium.com/@uliandim/how-to-boot-home-assistant-from-ssd-on-raspberry-pi-4-ede6fbf0c721"
---


<img src="/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_0.png" />

이전 글("From MicroSD to SSD: Ended up with a New Raspberry Pi 4 Case")에서는 마이크로SD 카드 대신 SSD로 전환하고 싶어서 새로운 Raspberry Pi 4 케이스를 구한 경험에 대해 이야기했어. 하지만, 실제로 운영 체제와 데이터를 어떻게 옮겼는지는 언급하지 않았지. 나의 경우엔 Home Assistant OS가 관련되어 있었고, 내 데이터와 설정을 모두 보존하는 것이 중요했어. 처음부터 스마트 홈 시스템의 설정 작업을 피하기 위해 말이야.

이제 이 글에서 GeeekPi Mini Tower NAS Kit의 도움을 받아 이를 성취하는 과정과 내가 취한 단계를 안내해볼게.

# 백업 만들기

<div class="content-ad"></div>

라즈베리 파이 4에 어떠한 변경을 가하기 전에, 현재 홈 어시스턴트 설정의 백업을 만드는 것이 중요합니다. 아래 단계를 따라주세요:

- 홈 어시스턴트 대시보드에서 설정 ` 시스템 ` 백업으로 이동합니다.
- 시스템의 완전한 백업을 생성하기 위해 "전체 백업"을 선택합니다.

![이미지](/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_1.png)

백업 프로세스가 완료되면 백업 파일을 컴퓨터로 다운로드하여 안전하게 보관하세요.

<div class="content-ad"></div>

알림: 홈 어시스턴트에서는 "설정 ` 시스템 ` 저장소" 메뉴와 "데이터 디스크 이동" 버튼을 사용하여 데이터를 다른 저장 위치로 이동할 수 있는 옵션이 있습니다. 그러나 이 방법은 데이터만 전송되고 부팅 및 운영 체제는 마이크로SD 카드에 남아 있게 됩니다. 원하는 결과가 아닌 경우 이 옵션을 피하는 것이 좋습니다.

본 게시물에는 제휴 링크가 포함되어 있어 링크를 통해 구매를 하신다면 추가 비용 없이 작은 커미션이 전달될 수 있음을 알려드립니다.

# 홈 어시스턴트를 SSD로 이전하기

백업을 만든 후에는 문제가 발생할 경우 대비하여 홈 어시스턴트 마이크로SD 카드를 따로 보관해 두세요. SSD에 홈 어시스턴트를 설치하려면 SSD M.2 SATA 어댑터가 필요합니다. 저는 ORICO M.2 NVMe SATA SSD 엔클로저 어댑터를 선택했습니다. 선택한 어댑터가 M.2 NGFF SATA B+M 키를 지원하는지 확인하세요. 아래는 진행 방법입니다:

<div class="content-ad"></div>

- GeeekPi Mini Tower NAS Kit 케이스의 하단 부분을 분해하여 SSD에 접근하고 분리합니다.
- SSD를 어댑터에 설치합니다.
- 어댑터를 사용하여 SSD를 컴퓨터에 연결합니다.

# SSD에 Home Assistant OS 설치하는 방법:

Home Assistant OS를 SSD에 설치하려면 Raspberry Pi Imager를 사용해야 합니다:

- SATA 어댑터를 사용하여 SSD를 컴퓨터에 연결합니다.
- Raspberry Pi Imager를 엽니다.

<div class="content-ad"></div>

\<img src="/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_2.png" />

3. 대상 장치로 "Raspberry Pi 4"를 선택하세요.

\<img src="/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_3.png" />

4. "운영체제 선택"에서 "기타 특정용도 OS" ` "홈 어시스턴트 및 홈 자동화" ` "Home Assistant"를 선택하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_4.png" />

5. 저장 장치로 SSD를 선택합니다.

6. '다음'을 클릭하고 화면 안내에 따라 설치를 완료하세요.

7. SSD를 컴퓨터와 SATA 어댑터에서 분리하고 GeeekPi 미니 타워 NAS 킷 케이스에 다시 넣어주세요.

<div class="content-ad"></div>

# 라즈베리 파이 4 부팅 순서 변경

다음으로 진행한 단계는 부팅 순서를 변경하는 것이었습니다. 초기에 라즈베리 파이는 마이크로SD 카드에서 부팅하고, 그 후에만 카드가 없는 경우 USB 장치에서 부팅하는 방식이었습니다. 그러나 이 순서를 변경하고 싶었습니다. 이를 달성하는 여러 가지 방법이 있지만, 라즈베리 파이 4를 모니터에 연결할 수 있는 마이크로HDMI 케이블이 없어 살짝 어려움을 겪었습니다.

그러나 백업용 마이크로SD 카드에 부트로더를 설치하는 우회 방법을 찾았습니다. Home Assistant 설정에 처음 사용한 것과는 다른 마이크로SD 카드가 필요했습니다. 다행히도, Smart Camera에서 더 작은 것을 찾을 수 있었고, 다시 한 번 도움이 필요할 때 라즈베리 파이 이미저를 활용했습니다.

- 컴퓨터에 Anker SD 카드 리더와 같은 장치를 사용하여 마이크로SD 카드를 연결합니다.
- 라즈베리 파이 이미저를 엽니다.
- 장치로 "Raspberry Pi 4"를 선택합니다.
- 'OS 선택' 버튼을 클릭한 후 "Misc utility images" → "Bootloader (Pi 4 family)" → "USB Boot"으로 이동합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_5.png" />

5. 저장 장치로 microSD 카드를 선택합니다.

6. "다음"을 클릭한 후 지시 사항을 따릅니다.

부트로더를 microSD 카드에 설치한 후에 라즈베리 파이에 삽입하고 전원을 연결하고 30초를 기다린 다음에 장치의 전원을 끕니다.

<div class="content-ad"></div>

참고: 안타깝게도 저는 microHDMI 케이블이 없어서 연결된 모니터에 그린 스크린이 있는지 확인할 수 없었습니다. 그러나 몇 가지 온라인 가이드에서 언급한 LED가 고정 녹색으로 변해야 한다는 것을 관찰했고, 이 행동을 보이지 않았습니다. 그럼에도 불구하고 프로세스가 완료된 것으로 가정했습니다. 마이크로SD 카드의 부트로더가 마법을 부리기에 충분한 30초가 일반적으로 적당하다고 생각했기 때문이죠.

Raspberry Pi 4를 다시 시작하고 Home Assistant의 로컬 IP 주소와 포트에 연결하니, 알짜배기! Home Assistant가 SSD에서 성공적으로 부팅되어 초기 설정 과정을 시작했습니다.

# 백업에서 복원하기

설치 후 두 가지 옵션인 새로운 스마트 홈 설정을 만들어야 할지, 아니면 백업에서 복원할지 선택하게 됩니다. 저는 백업에서 복원하기를 선택했습니다. 인터페이스는 다음과 같이 보였습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-HowtoBootHomeAssistantfromSSDonRaspberryPi4_6.png" />

'백업 복원' 버튼을 클릭한 후에는 컴퓨터에서 백업 파일을 선택하고 백업 복원 프로세스를 진행해야 합니다.

잠시 기다린 후, 모든 작업이 완료되었습니다. 저는 SSD로 Raspberry Pi 4 및 Home Assistant를 부팅하는 것을 성공했습니다.

# 결론

<div class="content-ad"></div>

좋은 소식은 모든 것이 잘 진행되어 원래의 홈 어시스턴트 설정에서 데이터 손실이나 구성 문제가 없었습니다.이 같은 방법론을 라즈베리 파이의 다른 운영 체제에도 적용할 수 있습니다.

홈 어시스턴트를 마이크로SD에서 SSD로 이전하는 과정에 대한 제 경험이 유익하고 즐거웠기를 바랍니다. 아래 댓글 섹션에서 여러분의 생각, 질문 또는 과정에 대한 독특한 경험을 자유롭게 공유해 주세요.