---
title: "윈도우에서 MAC 주소 스푸핑하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_0.png"
date: 2024-06-19 09:14
ogImage: 
  url: /assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_0.png
tag: Tech
originalTitle: "How to Spoof Your MAC Address on Windows"
link: "https://medium.com/@cybersecuritystephen/how-spoof-your-mac-on-windows-683aa9a130af"
---


<img src="/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_0.png" />

MAC 주소 스푸핑에 대해 이야기하기 전에, MAC 주소가 정확히 무엇인지 이해해야 합니다. MAC(Media Access Control) 주소는 네트워크 상의 장치에 할당된 12자리 16진수 번호입니다(예: 02-1B-63-84-D5-E6). MAC 주소는 장치 제조 중에 인쇄되는 고유 식별자로, 일반적으로 네트워크 인터페이스 카드(NIC)에 기록되어 있습니다. 장치를 찾거나 진단하기 위해서 MAC 주소가 필요합니다. MAC 주소는 Open Systems Interconnection(OSI) 모델의 2계층인 데이터 링크 계층에 속합니다. 각 장치의 네트워크 인터페이스마다 고유 MAC 주소가 할당되므로 장치에 여러 개의 MAC 주소가 있을 수 있습니다.¹

# 과정

먼저, 당신의 장치에서 MAC 주소를 찾아야 합니다. Windows 운영 체제를 사용 중이라면 명령 프롬프트로 이동하여 "ipconfig/all"을 입력한 다음 Enter 키를 누르세요. "물리적 주소(Physical Address)"의 값이 장치의 MAC 주소입니다. macOS를 사용 중이라면 화면 좌측 상단의 Apple 아이콘을 클릭하고 System Preferences ` Network ` Interface ` Advanced ` Hardware을 선택하여 MAC 주소를 확인할 수 있습니다.¹

<div class="content-ad"></div>

Windows 11과 같은 최신 버전의 Windows에서는 MAC 주소를 수동으로 다시 구성할 수 없지만 MAC 주소를 무작위로 설정하는 옵션을 사용할 수 있습니다. Wi-Fi/Ethernet 설정에서 무작위 하드웨어 주소를 사용하도록 옵션을 토글 할 수 있습니다.¹ 아래 그림 1은 메뉴에서 옵션이 켜져 있는 것을 보여줍니다.

<img src="/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_1.png" />

Windows 10 이하와 같은 이전 버전의 Windows를 사용 중이라면 다음 단계로 MAC 주소를 수동으로 구성할 수 있습니다:

1) 제어판으로 이동하여 "네트워크 연결"을 검색하면 그림 2와 같은 화면이 나타납니다. "네트워크 연결 보기"를 클릭하십시오.³

<div class="content-ad"></div>

![How to Spoof Your MAC Address on Windows - Step 2](/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_2.png)

2) 인터넷에 연결된 인터페이스를 선택하세요. 빨간 X 표시가 없어야 합니다.

3) 인터페이스를 선택한 후(예시에서는 이더넷), 왼쪽 하단에 있는 속성을 클릭하면 됩니다. Figure 3에서 확인할 수 있습니다.

![How to Spoof Your MAC Address on Windows - Step 3](/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_3.png)

<div class="content-ad"></div>

4) 이후에는 그림 4에 표시된대로 "구성"을 클릭하세요.

![이미지](/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_4.png)

5) "고급" 탭으로 전환한 후 "로컬 관리자 주소"를 찾아 아래로 스크롤하세요. 값 탭을 클릭하여 12자리의 16진수 주소를 입력하면 MAC 주소를 변경할 수 있습니다.² 이는 그림 5에서 확인할 수 있습니다.

![이미지](/assets/img/2024-06-19-HowtoSpoofYourMACAddressonWindows_5.png)

<div class="content-ad"></div>

6) "ipconfig/all"을 입력하여 명령 프롬프트로 이동하여, 변경한 네트워크 인터페이스 MAC 주소의 물리적 주소와 일치하는지 확인하세요.

# 결론

지금은 윈도우 운영 체제에서 MAC 주소를 변경하는 두 가지 방법을 배웠습니다. 하나는 무작위로 변경되며 제어가 불가능한 방식이고, 다른 하나는 수동으로 구성되어 완전한 통제를 할 수 있는 방식입니다. 네트워크에서 진단을 실행해야 하는 경우 MAC 주소 문제가 발생할 수 있으므로 유용한 지식입니다. 네트워크에서 MAC 필터링을 사용하고 있다면 기기의 MAC 주소를 변경하여 필터링이 올바르게 작동하는지 확인할 수 있습니다. 네트워크의 방어 시스템을 침투하고 테스트하려는 경우 MAC 주소 위조 방법을 알고 있는 것도 다양한 공격에 유용할 것입니다. MAC 주소는 네트워크 내에서 장치를 구별하는 데 중요하며, 인터넷 동작에 필수인 TCP/IP에 중요한 역할을 합니다.

# 참고문헌

<div class="content-ad"></div>

(1) Yasar, Kinza. (n.d.). MAC 주소 (미디어 접속 제어 주소). TechTarget. [링크](https://www.techtarget.com/searchnetworking/definition/MAC-address#:~:text=A%20MAC%20address%20(media%20access%20control%20address)%20is%20a%2012,network%20interface%20card%20(NIC)).

(2) Costa, Andre. (2021, 8월 19일). 윈도우 10에서 MAC 주소를 변경하는 방법 (그리고 왜 변경해야 하는지). Groovy Post. [링크](https://www.groovypost.com/howto/change-mac-address-windows-10-why/)

(3) Android Authority. (2023, 7월 21일). 거의 모든 기기에서 MAC 주소를 변경하는 방법. [링크](https://www.androidauthority.com/how-to-change-mac-address-3192669/)