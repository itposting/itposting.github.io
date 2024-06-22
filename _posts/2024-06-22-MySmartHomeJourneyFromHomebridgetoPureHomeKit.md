---
title: "나의 스마트 홈 여정 Homebridge에서 Pure HomeKit까지"
description: ""
coverImage: "/assets/img/2024-06-22-MySmartHomeJourneyFromHomebridgetoPureHomeKit_0.png"
date: 2024-06-22 18:19
ogImage: 
  url: /assets/img/2024-06-22-MySmartHomeJourneyFromHomebridgetoPureHomeKit_0.png
tag: Tech
originalTitle: "My Smart Home Journey From Homebridge to Pure HomeKit"
link: "https://medium.com/@bhoven/my-smart-home-journey-from-homebridge-to-pure-homekit-ba7c84e7f6b8"
---



![Smart Home Journey](/assets/img/2024-06-22-MySmartHomeJourneyFromHomebridgetoPureHomeKit_0.png)

내가 너드라서 스마트 홈이 제공하는 편의성을 좋아해요. 몇 년 전에 지금은 아내의 집에 이사를 왔을 때, 우리는 서로 다른 스마트 홈 디바이스들을 사용했는데, 그 중 많은 디바이스가 HomeKit과 호환되지 않았어요.

모든 것을 Home 앱에 통합하기 위해, HomeKit과 호환되지 않는 디바이스 간의 다리 역할을 하는 라즈베리 파이를 설치했어요. 어느 정도의 시간 동안 잘 작동했지만, 아래에서 자세히 설명할 주요 단점들이 있었어요.

## 온도 조절기


<div class="content-ad"></div>

저의 아내는 저희가 함께 살기 전에 이미 Nest Thermostat을 사용하고 계셨는데, 이 장치를 Homebridge와 연결하기가 가장 어려웠어요. Google Home 웹사이트에 가서 로그인한 다음 브라우저의 개발자 도구를 사용하여 플러그인이 Google의 API에 연결하는 데 사용할 수 있는 쿠키에서 토큰 값을 복사해야 했어요. 이 토큰은 약 6개월 후에 만료되었는데, 그때부터는 경고 없이 열쇠 조절 장치가 작동을 중지했고, 제가 이 과정을 반복할 때까지 계속 작동하지 않았어요.

이것은 저가 HomeKit 호환 대체품인 Ecobee로 교체한 첫 번째 장치였어요.

## 도어벨

저희 집은 저가 이사 올 때도 도어벨이 없었어요. 특히 지하실에 계시는 경우에는 위층에서 노크 소리를 듣기 어려운 경우가 있었어요. 저는 Ring을 설치하고 Homebridge에 연결하여 Home 앱에서 비디오를 볼 수 있도록 했고, HomePod를 통해 도어벨 소리를 울릴 수 있었어요. 불행히도 비디오가 끊겼을 때와 도어벨 소리가 울릴 때 모두 지연이 있었어요.

<div class="content-ad"></div>

둥근 비디오 도어벨로 교체했어요. 이제 훨씬 빨라졌어요. 홈킷 기반으로 인터페이스가 다른 것인지, 이 제품이 별도의 전원 연결을 갖고 있어서일지(리그는 배터리를 사용했음), 그 차이에 대해 정확히는 모르겠지만, 큰 향상이 있어요.

## 차고 문 오프너

몇 년 전 프라임 데이에 myQ를 구입했어요. 이것이 마지막으로 교체한 Homebridge 지원 기기였어요. zu 아주 신뢰할 수 있었고 반응이 빨랐기 때문에 새로운 해결책에 돈을 쓸 이유가 없었죠... 그런데 갑자기 작동이 멈췄네요. myQ를 만드는 차밀런은 경고 없이 Homebridge 플러그인이 의존하는 API 접근을 차단했어요. 사용자에게 경고 이메일을 보내는 일은 쉬웠을 텐데요. 그들이 그 API에 접근했던 계정들의 로그를 가지고 있으니까요. 대신 Homebridge에서 그들의 서비스로 HTTP 연결 오류가 발생하기 시작했고 좀 검색한 후 새로운 차고 솔루션이 필요하다는 것을 깨달았어요.

방금 Meross MSG200HK를 설치했어요. 이제 차고 문들이 다시 홈 앱에 있어요.

<div class="content-ad"></div>

## 안녕하세요 Homebridge

이것들이 모두 교체되면서 Homebridge를 더 이상 사용하지 않아서 제거했습니다. 그것이 나에게 특별한 매력이 있었기에 아쉬워요. 여러 가지 스마트 홈 기기를 한데 모아 해결책을 제공하는 것이 내 특이한 방법이었기 때문입니다. 하지만 종종 리부팅이 필요했던 소프트웨어 용어로 "단일 고장 지점(single point of failure)"을 도입하게 되었고, 비공식으로 지원되는 수단을 통해 제 3자와의 통합에 의존하여 갑자기 연결이 끊길 수도 있었습니다.

Matter는 다양한 기기를 스마트 홈 플랫폼에 연결하기 위한 산업 표준으로 지정되었지만, Matter의 전개는 느리다는 것이 밝혀졌습니다. 한편, 이제는 내 스마트 홈 필요에 맞는 좋은 HomeKit 호환 옵션이 거의 모든 것이 있습니다.