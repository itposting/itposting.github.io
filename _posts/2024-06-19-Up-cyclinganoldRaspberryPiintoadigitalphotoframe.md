---
title: "이전에 사용하던 라즈베리 파이를 디지털 포토 프레임으로 재활용하기"
description: ""
coverImage: "/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_0.png"
date: 2024-06-19 06:10
ogImage: 
  url: /assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_0.png
tag: Tech
originalTitle: "Up-cycling an old Raspberry Pi into a digital photo frame"
link: "https://medium.com/@cgarethc/up-cycling-an-old-raspberry-pi-into-a-digital-photo-frame-928d2fa599"
---


라즈베리 파이 프로젝트에 관한 몇 가지 이야기를 게시했어요. "SaaS prepper" 프로젝트 두 가지가 있어요: 하나는 플리커용이고, 다른 하나는 에버노트용이야. 그리고 후에는 휴 조명 자동화와 그에 대한 규칙 언어 추가도 있었어요. 모두 빌트인 와이파이가 있는 최신 모델 Pi에서 작동해.

와이파이가 없는 구형 3 Pi 모델이 두 대 있어. 예전에 여러 프로젝트에 사용했지만 오랫동안 서랍 속에 방치되어 있었어. 정말 안쓰러워서, 저렴한 오프라인 프로젝트를 찾고 있었어.

우리 둘째딸과 맏내아들은 매우 다른 관심사를 가지고 있어서, 각각에게 오프라인 사진액자를 만들어주면 방에 디지턈 장식물로서 멋진 효과를 줄 수 있을 것 같았어. 전체화면으로 슬라이드쇼를 열어서 디렉토리 안의 사진들을 랜덤하게 보여주면 될 거야. 9세 아들을 위한 것은 그의 고양이 사진, 예술품 스캔, 그리고 괴로운 미미들이겠지. 15세 딸을 위한 것은 앨범 커버, 영화 포스터, TikTok에서 찍은 포즈 사진, 가끔 친구들과 함께 한 인스타 셀카가 있겠지.

돈을 많이 쓰기 싫었고, 프레임으로 사용하기에 적합한 상태의 중고 모니터가 많을 거라 생각했어. 디지털 입력이 있는 17"~21" 크기쯤의 뭔가를 찾을 수 있다면, 꽤 좋은 프레임이 될 것 같았어.

<div class="content-ad"></div>

# 파이 준비하기

가장 저렴한 클래스 10 Micro SD 카드를 구했습니다. 클래스 10보다 느린 것은 라즈베리 파이 운영체제를 실행하는 데 잘 작동하지 않습니다. 뉴질랜드에 PB Tech 라는 지역 컴퓨팅 및 전자 제품 소매업자가 있습니다. 그들은 때로는 가격 조작을 당한다는 비판을 받기도 하지만, 나는 그들을 항상 최고로 생각했습니다. 그들의 물류는 훌륭하고 문제가 발생하면 반품 및 교환에 매우 도움이 됩니다. 더 좋은 점은 "PB"가 "팻 & 브렌다"를 의미한다는 것입니다 - 그 창립 부부입니다. 그것만으로 충분히 충성심을 가질만한 이유입니다.

![이미지](/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_0.png)

NZD $6.78은 USD $4.25 정도입니다 - 그 정도로 돈이 많이 나가지는 않겠네요. 요즘에는 32GB가 적당한 크기인 것 같습니다. 저는 최대 12GB 정도만 필요하지만, 그보다 더 많은 용량이 있다면 GB 당 가격이 더 비싸질 것 같네요!

<div class="content-ad"></div>

오피셜 라즈베리 파이 OS 사이트의 올인원 유틸리티는 요즘 정말 멋지네요. 이미지 파일을 다운로드하고 dd 구문을 뒤적일 필요 없이 모든 작업을 대신 해줍니다. 저는 최신 라즈베리 파이 OS 풀 데스크탑 버전으로 SD 카드를 플래싱했어요.

# 모니터 찾기

뉴질랜드에서 중고로 사고 파는 특이한 점은 우리만의 국내 플랫폼이 있다는 거예요. 예전에 이민 진입 가능성에 대해 이베이가 사용한 메트릭이 무엇이었든, 그들은 우리를 방치했죠. 그 때문에 우리에게 생겨난 건 TradeMe이라는 자체적인 경매 플랫폼인데, 2003년부터 사용해왔어요.

제 집에서 차로 5분 거리 내의 리스트를 지켜보고 낮은 입찰을 넣은 후 1주일 정도 지켜보다가 어떤 경매에서 낙찰했어요:

<div class="content-ad"></div>


![Up-cycling an old Raspberry Pi into a digital photo frame](/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_1.png)

$11.50 NZD is approximately $7.20 USD. The resolution is adequate and it has a DVI input. My 9-year-old couldn't believe that such a budget-friendly purchase was possible!

## A few more bits and pieces

Raspberry Pis have an HDMI output, so I needed to convert that into the DVI format. Fortunately, I already had a 0.5m male-to-male HDMI cable that came with electronic items in a drawer. I only needed to buy an adapter to convert it to a female DVI-D.


<div class="content-ad"></div>

![Up-cycling an old Raspberry Pi into a digital photo frame](/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_2.png)

PB Tech가 다시 도와주었습니다. 32GB 마이크로 SD나 전자 모니터보다는 비싸지만 여전히 꽤 합리적인 가격입니다.

물론 Pi에는 전원이 필요합니다. 뒷면에 USB에 최소 1.5암페어를 가진 모니터를 찾았지만, 이런 기능이 없는 거였다. Pi의 전원 공급은 약간 까다로울 수 있습니다. 전체 성능을 발휘하려면 공식 전원 공급이 정말 좋습니다. 이 가격은 합리적이지만, 마이크로 USB 플러그가 달린 구형 제품은 수급이 부족합니다 (새로운 모델은 USB-C를 사용합니다).

아래 충전기는 이용하기 거의 완벽합니다. 대부분의 경우 잘 작동하지만 Pi가 무언가 I/O 또는 CPU 집약적인 작업을 수행해야 할 때 전압 경고가 발생하여 성능이 제한됩니다. 그래도 내 목적에는 괜찮다고 생각했습니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 변환해 보겠습니다.


![Image 1](/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_3.png)

그리고... $6.54 NZD: SD 카드보다 심지어 더 싸요.

마지막 항목은 USB-A에서 USB-micro로 변환하는 것이었어요: $3.82. 제 서랍에 다 떨어져 있었던데요 — 이제는 USB-C 세상이에요.

![Image 2](/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_4.png)


<div class="content-ad"></div>

# 슬라이드 쇼 설정

Pi OS는 기본적으로 십 분 후에 화면을 꺼버립니다. 이 기능을 비활성화하려면 raspi-config의 "Display Options"에서 설정할 수 있습니다.

빠른 구글링 결과, Linux 및 Pi 슬라이드 쇼에는 FEH가 필수적이라고 합니다. 기본 Apt 저장소에 있으므로 sudo apt-get install feh을 실행하여 Pi에 FEH를 추가했습니다.

32GB SD 카드로 공간이 많이 남아 있어 Pi에 SSH를 활성화하고 라우터의 네트워크 소켓에 연결하여 큰 양의 사진을 scp로 전송했습니다.

<div class="content-ad"></div>

FEH 문서가 너무 최신이 아니라서 찾는 데 시간이 좀 걸렸어요. 제 요구 사항에 맞는 명령어를 찾는 데 조금 더 구글링을 해야 했어요. 다음과 같은 명령어를 사용했어요:

```js
DISPLAY=:0.0 feh --randomize --full-screen --slideshow-delay 30 --auto-rotate /home/pi/images
```

이 명령어는 다음을 제공해줘요:
- X Windows의 첫 번째, 기본 가상 데스크톱
- 디렉토리에서 랜덤 사진 선택
- 전체 화면
- 각 사진 변경 사이의 30초
- 사진이 EXIF 태그에 포함된 방향에 따라 자동으로 회전됨 (기본적으로 그렇게 설정되어야겠죠!)
- 기본 사용자의 홈 디렉토리의 "images" 디렉토리에서 읽기

<div class="content-ad"></div>

지금 작동 중인 슬라이드 쇼가 있으나 작업을 끝내고 네트워크에서 연결을 해제하고 그 일을 맡길 수 있도록 하기 전에 할 일이 몇 가지 더 남았어요.

# 부팅 시 자동 시작

키보드가 연결되지 않은 상태에서 사진 프레임이 작동해야 했기 때문에 OS가 부팅될 때 바로 슬라이드 쇼가 실행되어야 했어요. rc.local을 사용하는 것에 대한 제안을 보았지만, 그 스크립트가 X가 실제로 업 및 완전히 사용 가능해지기 전에 실행될 수 있기 때문에 매우 신뢰할 수 없다는 점을 알았어요. 따라서 Pi 데스크톱 관리자인 LXDE에 내장된 "자동 시작" 기능을 사용하기로 했어요.

/home/pi/runshow.sh에 셸 스크립트의 명령어를 넣고 이와 함께 .config/autostart/photos 경로에 이 텍스트 파일을 만들었어요:

<div class="content-ad"></div>

```js
[Desktop Entry]
Type=Application
Name=Slide show
Exec=/usr/bin/bash /home/pi/runshow.sh
```

LXDE가 X가 실행되었을 때 이를 읽고 명령을 실행합니다. 좋아요.

# 마우스 커서 숨기기

마우스가 없더라도 LXDE의 기본 동작은 화면 가운데에 마우스 포인터를 표시하는 것입니다. 짜증나죠.

<div class="content-ad"></div>

다행히도, 이와 같은 거북한 상황을 다루는 기능이 기본 Apt 저장소에도 있습니다. 해당 튜토리얼에서 자세한 내용을 확인할 수 있지만, 제 간략한 버전은:

```js
sudo apt-get install unclutter
mkdir -p ~/.config/lxsession/LXDE-pi
echo "@unclutter -idle 0" > ~/.config/lxsession/LXDE-pi/autostart
```

# 데스크톱에서 저전압 경고 비활성화

제 성능이 약간 떨어지지만 매우 검소한 전원 공급 구매를 기억하시나요?

<div class="content-ad"></div>

전압이 떨어질 때마다 화면 오른쪽 상단에 "토스트"가 나타나 경고로 팝업됩니다. 짜증나죠.

다행히도, 이 경고는 전용 Apt 패키지에서 제공됩니다. 이것을 제거하면 그런 일이 일어나지 않습니다: sudo apt remove lxplug-ptbatt

# 모두 끝났습니다

이렇게 해서 50뉴질랜드 달러 미만으로 빈번하게 사용하지 않는 Pi를 재활용한 독립적인 사진 프레임을 만들었습니다!

<div class="content-ad"></div>

그 행복한 고양이를 보세요...

![행복한 고양이](/assets/img/2024-06-19-Up-cyclinganoldRaspberryPiintoadigitalphotoframe_5.png)