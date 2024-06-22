---
title: "Raspberry Pi Zero W로 궁극의 휴대용 해킹 키트 만들기 방법"
description: ""
coverImage: "/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_0.png"
date: 2024-06-22 19:27
ogImage: 
  url: /assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_0.png
tag: Tech
originalTitle: "Building The Ultimate Portable Hacking Suite With A Raspberry Pi Zero W"
link: "https://medium.com/@assume-breach/building-the-ultimate-portable-hacking-suite-with-a-raspberry-pi-zero-w-dbc60704d872"
---


---
이미지: <img src="/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_0.png" />

라즈베리 파이 제로 W는 세계적으로 귀하다고 할 수 있는 무선 장치 중 하나로 주목받고 있습니다.

가정용 저렴한 와이파이 익스텐더가 필요하거나 예산을 고려해 레트로 게임을 하고 싶다면, 이 다재다능한 장치로 모든 것이 가능하며, 적절한 설정으로 주머니에 넣을 수 있습니다.

라즈베리 파이 제로 W로 궁극의 휴대용 해킹 스위트를 구축하기로 결정했을 때 원했던 몇 가지 기능도 있었습니다.
---

<div class="content-ad"></div>

왜 이것을 만들었는지 궁금해요?

몇 달 전에 iPhone X를 처분하고 안드로이드로 다시 전환하려고 했습니다. 이전에 삼성 노트 5를 사용해봤는데 그 기능을 좋아했었죠.

구매 당시에 애플이 256GB 버전의 폰만을 제공했기 때문에 모든 음악을 핸드폰에 넣고 500GB 수정된 iPod를 더 이상 들고 다니지 않으려 했습니다.

새로운 노트 20 Ultra를 구입할 때 펜테스팅 소프트웨어인 Nethunter나 Andrax와 같은 소프트웨어를 로드하기 위해 루팅하고 싶었습니다. 지역 와이파이 환경을 스캔하고 Kali 배포판의 기능 중 일부를 손안에 넣고 싶었어요.

<div class="content-ad"></div>

하지만 스마트폰 루팅 프로세스를 살펴보기 시작하자, 아마도 고장을 내게 될 것 같아서 결정했습니다. 결국 새로 산 스마트폰을 루팅하는 아이디어를 포기하고 대안을 찾기로 결심했습니다.

그래서 라즈베리 파이 제로 W로 이끌어졌습니다. 주머니에 넣어두고 전원을 공급할 수 있다면, 터미널 액세스를 위해 스마트폰에서 Termux나 다른 SSH 클라이언트를 사용할 수 있을 것입니다. 이 놀라운 작은 싱글 보드 컴퓨터는 바로 원했던 것이지만 일부 제한이 있었습니다.

제작 과정

라즈베리 파이 제로 제작은 전혀 어렵지 않았으며, 그리 비싸지 않았습니다. 초기 구성 요소는 모두 지역 Microcenter에서 구입했지만, Amazon에서 쉽게 구매하고 한꺼번에 모두 배송 받을 수 있습니다. 아래에 제 제작을 위한 Amazon 제휴 링크를 포함하겠습니다. 전체 제작 비용은 80달러 미만이었습니다.

<div class="content-ad"></div>

기능

원하는 기능이 세 가지 있었습니다.

1.) Captive Portal 기능과 Rouge Access Point/Evil Twin 기능

Captive portals과 evil twin 공격은 사기 캠페인의 핵심입니다. 이러한 공격은 대상을 속여 웹 폼에 와이파이 비밀번호나 이메일 계정 및 비밀번호 같은 액세스 자격 증명을 입력하도록 유도합니다.

<div class="content-ad"></div>

2.) Wifi 스캐닝

Wifi 스캐닝을 하려면 monitor 모드로 설정할 수 있는 추가적인 wifi 어댑터가 필요합니다. Raspberry Pi Zero W에는 두 개의 microUSB 포트가 있지만 하나는 전원으로 사용되기 때문에 이 문제를 해결해야 했습니다.

3.) 전통적인 Penetration Testing 도구

제 Kali 배포본에 있는 대부분의 도구들을 가지고 있고 이동 중에 Hydra, GoBuster 또는 SEToolKit를 즉시 실행할 수 있는 환경을 갖고 싶었습니다.

<div class="content-ad"></div>

전원 및 하우징

Pi Zero W에는 전원 공급원이 필요했습니다. 먼저 다뤄야 할 첫 번째 문제였습니다. Pi Zero W 케이스를 제공하지 않는 PiZ Uptime 2.0 또는 Pisugar2 Portable과 같은 몇 가지 해결책이 있었습니다.

(일반적인 Pi Zero W 케이스에 맞출 방법을 찾았기 때문에 PiZ Uptime 2.0에 대한 별도의 포스트를 작성할 예정입니다!)

내가 찾은 해결책은 래즈베리 파이 3와 Pi Zero W를 위해 설계된 아마존의 소형 휴대용 배터리 팩이었습니다.

<div class="content-ad"></div>

![BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_1](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_1.png)

사진을 보시다시피, 배터리 팩에는 마이크로 USB 케이블이 내장되어 있고 표준 USB A 케이블이 내장되어 있습니다. USB A 케이블은 배터리를 충전하는 데 사용되며 마이크로 USB 케이블은 Raspberry Pi의 전원을 공급하는 데 사용됩니다. 크기는 적당했지만, 전원 케이블을 약간 수정해야 했습니다.

![BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_2](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_2.png)

전원 케이블의 빨간 고무 부분을 너무 두꺼워서 제거했습니다.

<div class="content-ad"></div>

파이를 배터리 팩에 연결했을 때, 고무 재질이 다른 마이크로USB 포트에 다른 장치를 꽂는 데 방해가 되었어요.

파워 코드에서 고무를 떼어내니 다른 어댑터를 다른 마이크로USB 포트에 꽂을 수 있게 되었어요. 

케이스에는 표준 Pi Zero W 케이스를 사용했지만, 다른 케이스로 교체할 수도 있어요. 케이스를 배터리 팩에 고정하기 위해 간단히 초강력 접착제를 사용했어요. 아주 잘 고정되고 배터리 팩의 고무에 잘 붙었어요.

와이파이 동글 및 어댑터

<div class="content-ad"></div>

와이파이 동글은 빌드에서 매우 중요한 부분이었습니다. 패킷 주입을 위해 모니터 모드로 추가 와이파이 어댑터가 필요했기 때문이었죠.

![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_3.png)

문제는 동글을 라즈베리파이에 연결하기 위해 OTG 케이블을 사용하고 싶지 않았다는 것이었습니다. OTG 케이블은 부피가 크고 주머니에서 걸리기 쉬운 위험이 있었거든요.

이에, eBay에서 USB A 어댑터를 구입했는데, 아주 잘 작동했고 배터리 팩의 전원 코드와 함께 들어가기에 측면이 충분히 얇았습니다. 링크는 없지만 eBay에서 2.99달러에 구매 가능합니다.

<div class="content-ad"></div>

실제 Wi-Fi 동글은 Raspberry Pi Zero W와 호환되어야 하며 모니터 모드로 전환할 수 있어야 합니다. 저는 Microcenter에서 구입할 수 있는 Wi-Fi 동글을 선택했지만, Amazon에서도 다양한 선택지가 많습니다.

대부분의 TP-Link 어댑터인 TL-WN725N과 같은 제품들은 작동하나, 이를 위해 r8188eu 드라이버를 설치해야 합니다. 드라이버를 설치하는 방법에 관한 많은 튜토리얼이 있으며, 이 작업은 정말 간단하지만, 저는 MCM Electronics 어댑터의 플러그 앤 플레이를 선호합니다.

![image](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_4.png)

MCM Electronics 어댑터는 rt2800usb 드라이버를 사용하며, 사용자가 별도의 설정없이 바로 사용할 수 있습니다.

<div class="content-ad"></div>

노트:

내가 생각한 한 가지 아이디어는 TL-WN722N 어댑터 중 하나를 배터리 팩의 바닥에 붙이고 OTG 케이블을 사용하여 어댑터의 USB 포트에 연결하는 것이었습니다. 이 아이디어의 배경은 안테나 덕분에 더 나은 브로드캐스팅이 가능하다는 것이었습니다.

그러나 이 아이디어를 포기했습니다. 주머니에 들고 다니기에 상당히 거추장스럽고 휴대용이고 소형 장치를 가지는 목적을 상쇄시킬 수 있기 때문입니다. 게다가, 정말 어색해 보일 것 같습니다.

Part 1 — 소프트웨어 및 캡티브 포털 설정하기

<div class="content-ad"></div>

라즈베리 파이에서 캡티브 포털을 설정하는 것이 좀 귀찮았죠. 시도한 여러 튜토리얼이 모두 도움이 되지 않았던 것 같아요. 파이 제로 W는 내장 와이파이 어댑터를 사용하여 별도의 인터페이스를 구축할 수 있는 능력을 갖고 있어요.

즉, uap0과 같은 무선 인터페이스를 만들고, 이를 와이파이 액세스 포인트로 사용하면서 wlan0을 통해 인터넷 연결을 유지할 수 있습니다. 이 기능은 매우 편리한데요, uap0에 캡티브 포털을 설정한 채로 wlan0을 통해 SSH로 명령 및 제어를 할 수 있기 때문이죠.

이 설정을 하다 보면 wlan0 또는 uap0 중 하나에는 연결이 되지만, 다른 하나에는 연결이 안 될 때가 있죠. 그래서 제가 스크립트를 사용하게 되었답니다.

참고:

<div class="content-ad"></div>

파이 제로 W용 Kali 배포본이 있지만, 저는 Raspian을 사용하고 있어요. Kali의 Network-Manager를 사용하면 와이파이 인터페이스를 모니터 모드로 변경하고 SSH를 통해 명령 및 제어를 유지하는 것이 귀찮아요.

이를 작동시키는 데 성공할 수 있지만, Metasploit을 실행할 수 있는 것 외에는 그다지 이점을 찾지 못했어요. 대부분의 다른 도구는 파이 제로 W에 쉽게 설치할 수 있어요.

저는 RogueAP를 설정하기 위해 RPIHotSpot 스크립트를 사용했어요. 상당히 긴 설정 명령이 있지만, 완벽하게 작동해요. 레포지토리에 git clone을 한 다음 설정 명령을 실행해주세요.


./setup-network.sh --install --ap-ssid="NetworkName" --ap-password="Password" --ap-country-code="US" --ap-ip-address="10.1.1.1" --wifi-interface="wlan0"


<div class="content-ad"></div>

필요에 따라 네트워크 이름과 비밀번호를 변경할 수 있지만, 이후 hostapd.conf 파일에서 변경할 수도 있습니다.

스크립트가 완료되고 Raspberry Pi가 다시 시작되면 액세스 포인트가 설정될 것입니다.

hostapd와 기타 몇 가지 패키지가 설치되어 있어야 합니다. 이 시점에서는 wlan0 인터페이스에서 연결 및 IP 주소를 가지고 있어야 합니다.

Wlan0은 SSH를 통해 명령 및 제어 인터페이스로 사용될 것입니다. wlan0을 통해 wlan1을 모니터 모드로 설정하고 RogueAP를 제어할 수 있게 될 것입니다.

<div class="content-ad"></div>

위의 스크린샷에서 볼 수 있듯이 wlan0과 wlan1 둘 다 내부 IP를 가지고 있습니다. 내 액세스 포인트 인터페이스 uap0은 10.1.1.1의 정적 IP를 가지고 있습니다.

이 시점에서 Pi에 apache2를 설치하고 서비스가 실행 중인지 확인할 것입니다.

액세스 포인트에 연결하고 10.1.1.1 주소로 브라우징하면 Apache 기본 페이지가 표시되어야 합니다.

<div class="content-ad"></div>

PiZeroEvilTwin

파이 이블 트윈 스크립트가 정말 멋져요. 닉 정겐스가 만든 이 스크립트는 다른 사용자 정의 피싱 페이지와 쉽게 통합할 수 있는 기본적인 포털을 제공합니다.

이제 액세스 포인트를 설정했으니, 포털을 설정하려면 몇 가지 구성 변경을 해야 합니다. git 클론을 통해 PiEvilTwin 프레임워크를 가져와서 이를 우리 RougeAP에 통합하는 것부터 시작해보겠습니다.

/etc/hostapd/hostapd.conf의 hostapd.conf로 이동하세요. 타겟에서 작동하도록 하기 위해 액세스 포인트를 오픈해야 합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_6.png" />

저의 hostapd 구성 파일 스크린샷이에요. WPA 라인들을 모두 주석 처리하여 액세스 포인트를 열어 두었음을 주목하세요. 이렇게 하면 변경 사항이 적용되려면 Pi를 재시동해야 합니다.

PiEvilTwin을 설치하지 마세요! 우리는 몇 가지 명령어를 차용할 예정이에요. 이것을 실행하면 설정이 망가집니다.

PiEvilTwin 디렉토리의 install.sh 파일을 열어주세요.

<div class="content-ad"></div>

![image](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_7.png)

위 스크린샷을 보면 해당 스크립트는 hostapd.conf 및 dnsmasq.conf와 같은 다양한 파일을 복사하려고 시도할 것을 알 수 있습니다. hostapd.conf 파일이 이미 구성되어 있으므로 그것은 필요하지 않습니다. 실행해야 하는 명령어 목록은 다음과 같습니다.

이 명령어들을 전송한 후에는 PiEvilTwinStart.sh 파일을 열어주세요.

![image](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_8.png)

<div class="content-ad"></div>

위의 스크린샷에서 우리는 액세스 포인트와 작동하기 위해 몇 가지 변경 사항을 해야 한다는 것을 알 수 있습니다. 가장 중요한 것은 인터페이스의 이름입니다.

다음 명령어를 실행하세요.

iptables가 구성되었으므로 dnsmasq.conf를 열어봅시다.

<img src="/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_9.png" />

<div class="content-ad"></div>

이것은 제 dnsmasq.conf 파일입니다. 이 파일은 PiEvilTwin 디렉토리의 dnsmasq.conf 파일에서 크게 차용되었습니다. 이 파일을 맞추도록 구성한 후에는 작동하는 캡티브 포털이 있어야 합니다.

파이를 다시 시작하고 액세스 포인트가 활성화될 때까지 기다리세요. Apache와 dnsmasq가 실행 중인지 확인하세요.

참고: wlan0에서 인터넷 액세스를 원하면 dnsmasq를 중지해야 합니다. 모든 것이 10.1.1.1로 해석되어 웹페이지에 git clone 할 수 없습니다.

이제 캡티브 포털을 테스트할 시간입니다. 휴대전화나 가상 머신 중 하나를 사용하여 액세스 포인트에 연결하세요. 자동으로 /var/www/html 디렉토리의 index.html 페이지로 리디렉션될 것입니다.

<div class="content-ad"></div>

제 Ubuntu 가상 머신에서 시험해봤는데 자동으로 알림이 뜨더라고요. 아이폰, 맥, 안드로이드 및 일부 더 많은 구성에서도 작동한다는 것을 알고 있어요.

![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_10.png)

여기는 제 맥에서 찍은 스크린샷입니다.

![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_11.png)

<div class="content-ad"></div>

창 상단을 보시면 실제 URL이 http://10.1.1.1/gmail임을 확인할 수 있습니다. 나중에 더 이야기하겠습니다.

이제 이메일과 비밀번호를 입력해보겠습니다. 저는 usernametest와 passwordtest를 입력할 겁니다.

사용자 이름과 비밀번호를 입력한 후 Loading, please wait... 화면으로 이동해야 합니다. 그냥 텍스트일 뿐이기 때문에 해결되지 않을 겁니다.

파이에 돌아가 봅시다. 사용자 이름과 비밀번호가 캡처되었는지 확인해 봅시다. /var/www/html로 이동하여 usernames.txt를 cat해야 합니다. 화면 캡쳐와는 경로가 다를 수 있습니다.

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_12.png)

As you can see, the username and password were successfully captured.

Customizing Captive Portal Phishing Pages

Let’s take a look at the structure of Nick Jongen’s captive portal that he created for Gmail.


<div class="content-ad"></div>


![그림](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_13.png)

index.html 파일을 살펴보겠습니다.

![그림](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_14.png)

이 파일에서 가장 중요한 부분은 "action=post.php" 코드입니다. 이 코드는 로그인 폼 자격 증명을 post.php 파일로 보냅니다. 그러니 그것을 한 번 살펴볼까요?


<div class="content-ad"></div>


![image](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_15.png)

이 파일에서 우리는 자격 증명이 "usernames.txt"에 로드되고 해당 파일이 loading.html 문서를로드할 것임을 볼 수 있습니다.

이것은 중요합니다. 왜냐하면 웹 사이트를 저장하고 웹 양식에서 "action=" 코드를 찾아 post.php 파일로 연결할 수 있습니다. 예를 들어 자세히 설명하겠습니다.

인기 있는 소셜 미디어 웹 사이트의 로그인 페이지로 이동하여 컴퓨터에 저장했습니다. index.html 파일이 있었고 해당 웹 사이트의 모든 이미지가 포함된 다른 폴더가 있었습니다.


<div class="content-ad"></div>

인덱스.html 파일과 폴더를 라즈베리파이의 /var/www/html/ 디렉토리로 옮겼어요. 나노를 사용해서 인덱스.html 파일을 열었고 "action="을 찾았어요. 그것을 "action=post.php"로 변경하고 인덱스.html 파일을 저장했어요.

post.php와 loading.html 파일을 /html 아래의 소셜 미디어 폴더로 옮겼어요.

http://10.1.1.1/socialmediasite로 이동하면 로그인 화면이 나와요. 가짜 자격 증명을 입력하고 loading.html 텍스트가 나왔어요. 그 텍스트들은 usernames.txt 폴더에 기록되었어요.

이 방법은 참여자들을 위한 간단한 캡티브 포털 피싱 페이지를 만드는 방법이에요.

<div class="content-ad"></div>

이동 중에 강제 포턜 변경하기

Pi Zero W에서 원했던 능력 중 하나는 시나리오에 따라 자유롭게 강제 포털을 변경할 수 있는 기능이었습니다. 레드 팀 참여나 데모에서 사용해야 할 때는 다른 강제 포턈 페이지가 필요할 것입니다.

WiFi Pineapple에서 유용한 몇 가지를 사용했지만, 이 기능을 Pi Zero W로 가져오고 싶었습니다. PiEvilTwin의 구조를 활용하여 /var/www/html 아래에 gmail이라는 하위 폴더를 생성했습니다.

/var/www/html/ 디렉터리에 마스터 index.html 파일이 있어야 합니다. 여러 강제 포털 사이트를 만들었으면 다양한 시나리오에 따라 사용할 강제 포털을 변경하고 싶을 것입니다.

<div class="content-ad"></div>

Gmail 포털은 기업을 사칭할 때 도움이 되지 않아요. 그래서 index.html 파일에 리다이렉트를 넣어서 쉽게 사용할 포털을 선택할 수 있도록 도와줄 거예요.

나는 모든 것을 gmail 디렉토리로 해결하기 위해 이 리다이렉트를 사용해. 만약 나랑 협력 중이라면 http://10.1.1.1/gmail 을 http://10.1.1.1/corporate-phishing-page 로 변경할 거야.

이렇게 하면 대규모 피싱 라이브러리를 가질 수 있고, 실시간으로 해결 주소를 바꿀 수 있어. 아... 그리고 index.html 파일에 BEEF 후크를 넣어 브라우저 정보를 즉시 얻고 브라우저 제어할 수도 있어.

그냥 hostapd.conf에서 접속점 SSID 이름을 조화시키기 위해 변경하는 걸 잊지 마세요.

<div class="content-ad"></div>

부분 2 — 펜테스팅 애플리케이션 설정

이 빌드에서 사용한 대부분의 펜테스팅 도구들은 완벽하게 작동했습니다. 저는 fsociety, Red Hawk, Lazy Script와 같은 대량 도구 배포에 중점을 두기로 선택했는데, 이러한 도구들은 매우 적은 시간에 수많은 도구들을 쉽게 설치할 수 있기 때문입니다.

Fsociety

Fsociety는 다양한 도구들을 제공하며, 휴대폰 한 번 터치로 쉽게 설치할 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_16.png)

정보 수집 섹션에는 최고의 도구들이 있어요.

![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_17.png)

Host to IP, Nmap, 그리고 SeToolKit이 외출할 때 가장 유용할 것 같아요.


<div class="content-ad"></div>

```html
![BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_18.png](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_18.png)
```

웹사이트 공격 벡터 및 무선 액세스 포인트 공격 벡터가 모두 잘 작동합니다. 여기서 설치할 수 있습니다:

Red Hawk

Red Hawk는 다재다능한 취약점 스캐너입니다.

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_19.png)

It offers a wide range of scanning options.

![Image 2](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_20.png)

As you can see, there are SQLi scans and basic recon scripts that you can run. The CMS detection module is pretty great too!


<div class="content-ad"></div>

여기서 확인할 수 있어요.

Lazy Script

![Lazy Script](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_21.png)

Lazy Script은 시스템 관리자의 꿈이자, 펜테스터의 베스트 프렌드입니다. 만약 그들이 Termux에서의 배포를 제어한다면 더욱 그렇습니다. 이를 실행하려면 설치할 때 처음으로 모니터를 사용해야 합니다. 처음 사용할 때 설치를 완료하기 위해 새 창을 시작합니다.

<div class="content-ad"></div>

그 다음에 할 일은 alias를 설정하여 명령 프롬프트에 "l"을 입력하면 스크립트에 액세스할 수 있도록 하는 것입니다.

Alias를 설정하려면 홈 폴더에 있는 .bashrc 파일을 열어야 합니다. 제 경우에는 다음과 같은 명령을 사용했습니다.

그런 다음 aliases로 스크롤하여 내 라인을 추가했습니다.

![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_22.png)

<div class="content-ad"></div>

저장했고, Lazy Script가 라즈베리 파이에서 작동 중이에요.

파트 3 — 와이파이 스캔

와이파이 스캔은 이 프로젝트에서 필요한 마지막 부분이었어요. 이미 모니터 모드를 지원하는 와이파이 어댑터를 wlan1에 설치했기 때문에 필요한 건 몇 가지 스캔 스크립트들뿐이었어요.

Wifite

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_23.png)

Wifite 설치는 와이파이 네트워크를 스캔할 때 쉽게 이기기 위해 필수적입니다. 아래에서 찾을 수 있습니다.

wifite2 디렉토리로 이동하여 다음 명령을 사용하여 스크립트를 pi에 설치하십시오.

이제 터미널에서 어디서나 Wifite를 실행할 수 있게 됩니다. 설치되면 wlan1 인터페이스를 통해 이동 중에 스캔을 시작할 수 있습니다.


<div class="content-ad"></div>

에어게든

![에어게든](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_24.png)

에어게든 설치는 매우 간단하며 와이파이 감사용 완벽한 패키지입니다. 아래에서 찾을 수 있습니다.

디렉터리의 .airgeddonrc 파일로 이동하여 창을 tmux로 변경해야 핸드폰에서 작동합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-BuildingTheUltimatePortableHackingSuiteWithARaspberryPiZeroW_25.png)

이 줄을 xterm 대신 "tmux"로 변경하고 파일을 저장하십시오. 이렇게하면 터머나 다른 SSH 클라이언트를 핸드폰에서 사용할 수 있습니다.

종합적인 견해

이 장치를 구성하는 데 많은 시간이 걸렸습니다. 개념은 여러 부품을 맞추는 데 많은 시간이 걸릴 것이란 것을 알고 있었습니다. 서로 다른 사이트에서 다른 구성 요소를 주문해야 했지만, 모두 함께 조합하는 데 많은 재미가 있었습니다.


<div class="content-ad"></div>

이 글이 라즈베리 파이 제로 W를 펜테스팅과 와이파이 감사용으로 매우 다재다능하고 휴대성 있는 장치로 변환하는 방법에 대해 몇 가지 살펴보는 데 도움이 되었으면 좋겠습니다. 더 추가하고 싶은 것이 몇 가지 있어요.

첫 번째로 추가하고 싶은 것은 내부 와이파이 모듈에 외부 안테나를 추가하는 것입니다. 몇몇 블로그에서 이 모디파이를 본 적이 있는데, 파이 케이스 측면에 구멍을 뚫어서 루지 액세스 포인트의 더 넓은 범위를 위해 장착하고 싶어요.

라즈베리 파이와 배터리의 크기가 상당히 작지만, 이를 더 작게 만들고 싶어요. 'PiZ Uptime 2.0'을 최소화하고 표준 케이스 내에 맞출 수 있는지 확인해보세요!

더 많은 소식을 보고 싶다면 여기 Medium이나 Twitter(@assume_breach)에서 저를 팔로우해주세요.