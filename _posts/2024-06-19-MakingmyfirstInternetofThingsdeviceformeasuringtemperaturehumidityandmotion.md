---
title: "첫 번째 인터넷 오브 씽스IoT 디바이스 만들기 온도, 습도 및 동작 측정용"
description: ""
coverImage: "/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_0.png"
date: 2024-06-19 16:49
ogImage: 
  url: /assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_0.png
tag: Tech
originalTitle: "Making my first Internet of Things device (for measuring temperature, humidity, and motion)"
link: "https://medium.com/@datawarrior/making-my-first-internet-of-things-device-for-measuring-temperature-humidity-and-motion-d4b36f1d50a8"
---


약 두 년 전, 나는 어떤 아두이노 기기를 만들고 싶다는 소망에 대해 이야기를 시작한 한 여성과 친해졌어요. 보통 나는 이렇게 되면 흥미를 느끼게 돼요. 그래서 그당시 저는 Freenove 아두이노 알티메이트 스타터 킷이라는 것을 사기로 결정을 했어요. 이 킷에는 아두이노와 함께, 모션, 온도, 습도, 적외선 등 다양한 센서들, 버튼 몇 개, LED 다이오드, 조이스틱, 디스플레이 등 시작하기에 필요한 모든 것이 들어 있어요. 보드 프로그래밍 및 연결하는 방법에 관한 많은 자습서도 함께 제공돼요. 제가 배우기 위해 이를 활용해 몇 가지 흥미로운 것들을 만들어봤어요. 하지만 사물 인터넷 기기를 얘기한다면, 중요한 것이 하나 부족했는데, 그것은 인터넷 접속이었어요. 그래서 그 문제를 해결하려고 Heltech Wifikit 8이라는 것도 구입을 했어요. 이것은 약 10파운드, 또는 약 12유로 정도 하는 가격이었는데, 와이파이 커넥터가 달린 디스플레이라고 생각했어요. 그러나 며칠 전에 이것과 놀기 시작했을 때, 이것이 꽤 강력한 컨트롤러 보드이면서 화면과 와이파이 연결성을 갖추고 있으며 아두이노와 같은 프로그래밍 환경을 사용해 프로그래밍할 수 있다는 것을 깨달았어요.

그 깨달음을 통해 몇 일 전에 나는 내 보드를 디자인하기 시작했어요. 먼저 프로토타입 브레드보드에서, 그리고 나서 디바이스에 납땜을 했어요.

# 인터넷에 연결하기

첫 번째 단계는 ESP8266 (Heltech Wifikit 8)이 디스플레이에 정보를 표시하고 인터넷에 연결하는 작업이었어요. 여기에 디스플레이에 내용을 쓰고 인터넷에 연결하는 방법을 보여주는 몇 가지 코드를 작성할 수 있었던 내용을 보여줘요.

<div class="content-ad"></div>


스크린에 쓰는 것은 Heltec.display->drawString(0, 0, "Hello Nikola!");을 이용하면 매우 간단합니다. 모든 것이 초기화된 후에 호출합니다. 처음 두 개의 숫자는 첫 번째 문자의 위치를 나타냅니다 (이 경우 상단 왼쪽). 그리고 나서 Heltec.display->display()를 호출하여 화면에 표시하거나 화면을 지우려면 clear()를 호출할 수 있습니다. 같은 위치에 여러 문자열을 쓰면 다른 것 위에 계속 그려집니다.

이제 모든 것이 작동하므로 회로 설계를 진행할 수 있습니다.

# 회로 설계


<div class="content-ad"></div>

이전에 Arduino 스타터 킷과 함께 제공된 D11 센서를 사용하여 온도 및 습도를 측정하는 회로를 만들었습니다. 이제 동일한 것을 시도해보고 싶었지만 인터넷 연결이 가능한 보드로 진행하여 데이터를 온라인으로 전송하고 웹사이트나 앱을 통해 온라인에서 확인할 수 있도록 하고 싶었습니다. D11 외에도 움직임 감지 센서를 추가해보기로 결정했으며, 문 가까이에 장치를 설치하여 보안 장치로 활용되며 온도 및 습도를 측정할 수 있게 하고 싶었습니다. Arduino 킷에 포함된 브레드보드를 사용하여 보드를 디자인했습니다. 그러나 모든 것이 순조롭지는 않았습니다. 모든 것을 연결한 상태에서 장치를 전원에 USB로 연결하면 화면이 작동하지 않는 이상한 문제가 발생했습니다. 그러나 ESP8266에서 다른 구성 요소로 전력(5V)을 출력하는 핀을 분리하면 화면이 로드되고, 그 후에 핀을 다시 연결하면 모든 것이 원활하게 작동합니다. 그러나 이는 장치에 사용할 수 없는 방법이므로 2개의 스위치로 문제를 해결했습니다. 스위치는 화면이 로드될 때까지 전원을 차단하고, 그런 다음 스위치를 사용하여 센서 독자를 얻을 수 있게 했습니다.

![이미지 1](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_0.png)

![이미지 2](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_1.png)

이 사진으로부터 연결이 어떻게 되는지 쉽게 파악하기 어려울 수 있음을 이해합니다. 따라서 장치의 회로도를 그려보려고 노력했습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_2.png)

프로그래밍 및 입력값을 읽는 부분에서 핀 번호 지정에 약간 어려움을 겪었습니다. 그래서 D11(온도 및 습도 센서)를 ESP8266의 입력 D8에 연결하고 모션 센서 D7에 연결했습니다. 처음에 코드에서 7번 및 8번 핀 id에서 읽을 것으로 생각했지만, 그렇지 않았습니다. ESP8266에는 다음 다이어그램이 함께 제공됩니다.

![이미지](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_3.png)

핀의 실제 id는 GPI로 시작하는 이 분홍색 열에 있습니다. 따라서 핀 8은 GPI015이며, id는 15이고, 핀 7은 GPI013이며, id는 13입니다.


<div class="content-ad"></div>

업로드된 장치용 스케치의 최종 코드는 다음과 같이 보여지며, 제 GitHub에서 확인할 수 있습니다.

# 장치를 위한 웹 서비스 만들기

이제 장치가 완성되었는데, 완전한 IoT 장치가 되려면 데이터를 보내고 표시할 웹 서비스가 필요합니다. 제가 몇 가지 구글 검색을 통해 무료 Python 호스팅 중에 어떤 것이 내가 원하는 데이터베이스도 허용하는지 찾아보았습니다. 꽤 큰 놀라움으로, 원하는 것을 정확히 찾았습니다. 그 사이트는 PythonAnywhere라고 합니다. 그들은 내가 찾던 것을 정확히 제공합니다. 그들은 무료로 Flask와 MySQL 호스팅을 제공합니다. 파일과 데이터베이스의 크기와 같이 일부 제한이 있습니다. 그러나 제가 필요한 것에 대해서는 그들이 완벽히 제공한 것입니다.

그래서 간단한 Flask 서비스를 작성했습니다. 두 가지 주요 엔드포인트가 있습니다. 첫 번째는 장치에서 데이터를 수신하고 데이터를 데이터베이스에 저장할 것입니다. 이 엔드포인트는 데이터를 너무 많이 저장하지 않도록 2일 이전의 데이터를 삭제하도록합니다. 두 번째 엔드포인트는 시각화를 위한 사용자 인터페이스를 제공할 것입니다. 이를 위해 Chart.js를 활용한 템플릿을 사용했습니다.

<div class="content-ad"></div>

플라스크(Flask) 코드는 다음과 같았습니다:

```python
def analytics():
    # 코드 생략
```

페이지 템플릿은 GitHub에서 확인할 수 있습니다. render_template 메서드는 루트 엔드포인트(roots endpoint) 메서드에서 생성된 배열을 사용하여 차트에 데이터를 플로팅하는 자바스크립트를 채웁니다.

해당 엔드포인트의 최종 웹페이지는 다음과 같이 보입니다:

<div class="content-ad"></div>


![Device Image](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_4.png)

# 기기 납땜하기

웹 서비스와 기기가 작동하고 서로 연결된 후에는 기기를 완성하여 영구적으로 만들어야 합니다. 작은 보드에 부품을 납땜합니다. Freenove 키트에는 이 종류의 기기에 적합한 사이즈인 5×7cm 크기의 3~4개의 납땜 보드가 포함되어 있습니다. 새로운 납땜용 인두를 구입해야 했고, 제가 선택한 것은 Meterk Soldering Iron Kit 60 W 14 in 1 입니다. 케이스, 인두, 집게, 납선 등 필요한 모든 것이 포함되어 있습니다.

이번이 제 인생에서 처음으로 납땜을 해 보았습니다. 아마도 필요한 것보다 훨씬 많은 납선을 사용했을 것으로 생각됩니다만, 모든 것은 어느 정도 괜찮았습니다. 몇 가지 실수로 인해 일부 부분을 납땜을 다시 해야 했고, 또는 납땜이 제자리에 있지 않을 때도 있었습니다. 납땜 중 문제가 발생한 것 중 하나는 두 센서 모두 데이터 핀이 가운데에 있고, GND와 VCC 핀이 옆에 있는 것이었습니다. 초반 계획대로 두 센서 모두 보드에 납땜하기(일반적인 계획) 위해서는 보드 상에서 전선이 교차하지 않도록 하는 것이 꽤 까다로웠습니다. 따라서 운동 센서에 외부 전선을 납땜했습니다. 만약 케이스를 만든다면, 다른 센서와 비교하여 조금 더 밖쪽에 있고 높은 것이 합리적일 것입니다.


<div class="content-ad"></div>

마지막으로, 모든 것이 이렇게 보였어요:

![image](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_5.png)

![image](/assets/img/2024-06-19-MakingmyfirstInternetofThingsdeviceformeasuringtemperaturehumidityandmotion_6.png)

그리고 조금 노닥거린 뒤에 작동했어요. 센서를 단계별로 납땜하고 각 단계에서 모든 것이 잘 작동하는지 테스트하는 것을 추천합니다. 이렇게 하니 문제가 생겼을 때 해결하기가 더 쉬웠어요. 마지막으로 기기에 케이싱을 만들어야 합니다. 저는 이 부분을 고려하면서 생각했는데, 사용자 지정 차원의 사용자 지정 기기가 생기게 됩니다. 단지 일반적인 상자를 재활용해서 케이싱을 만들고자 합니다. 더 적절한 플라스틱 케이싱은 좀 더 어려울 것 같고 그런 장비가 부족할 수도 있어요.

<div class="content-ad"></div>

# 비용

최종적으로 비용을 합산할 때, 이와 같은 장치를 만드는 데 약 20유로가 소요됩니다:

- 12유로는 WifiKit 비용
- 각각 약 3유로씩 드는 센서 (따라서 총 6~7유로)
- 솔더링 와이어와 솔더링 보드에 약 1~2유로
- LED 다이오드, 스위치 및 모든 배선에 대해 약 1~2유로 정도가 소요될 수 있습니다

아마존에서 비인터넷 연결만 지원하는 비 스마트 습도/온도계의 가격이 13~20유로, 모션 감지기가 10~30유로 사이에 있음을 고려하면, 이 비용은 꽤 합리적으로 보입니다. 비슷한 기기를 찾아봤을 때 최소 30유로에 이를 가장 저렴한 제품이었습니다.

<div class="content-ad"></div>

# 앞으로 가능한 통합

장치의 관점에서, 데이터를 기록하고 웹 서비스로 전송하는 것이 가장 중요합니다. 데이터가 있으면 더 많은 통합을 할 수 있습니다. 웹 서비스를 사용하여 푸시 알림을 하는 모바일 앱을 만들 수도 있습니다. 웹 서비스는 데이터를 JSON 형식으로 다시 보내기 위해 약간의 수정이 필요하며, 그러면 모바일 앱에서 조작할 수 있습니다. 또한 API를 사용하여 Google 어시스턴트에 통합할 수도 있습니다. 이를 위해서는 주로 무료가 아닌 HTTPS 호스팅을 찾아야 합니다. 그래서 무료 HTTPS 파이썬 호스팅을 구할 때까지 이 아이디어를 포기했습니다. 그러나 Facebook이나 다른 플랫폼에서 메시지 형식으로 알림을 보내거나 기기가 기록하는 데이터에 대한 질문에 답변할 수 있는 챗봇을 만들 수도 있습니다. 이것은 나중에 구현할 수 있고, 그렇게 하면 분명 블로그에 기록할 것입니다.

이와 같은 이야기를 더 보려면 https://inspiratron.org/을 방문해주세요.