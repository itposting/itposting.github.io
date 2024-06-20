---
title: "시그널 인텔리전스, 라즈베리 파이"
description: ""
coverImage: "/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_0.png"
date: 2024-06-19 02:43
ogImage: 
  url: /assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_0.png
tag: Tech
originalTitle: "Signals Intelligence , The Raspberry Pi"
link: "https://medium.com/@investigator515/signals-intelligence-the-raspberry-pi-d191d968a425"
---



![이미지](/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_0.png)

라즈베리파이는 소형이면서도 효과적인 SIGINT 연구 스테이션을 제공합니다.

미디엄 회원이 아니라면 substack를 통해 무료로 읽을 수 있습니다.

신호 분석을 초보자의 관점에서 시작할 때, 시작하기가 어렵고 다루어야 할 정보가 많을 수 있습니다. 하드웨어 기반 시스템, 웹 기반 시스템이 있으며 무엇이라도 라디오 스펙트럼에서 보고 있는 것이죠?! 이렇게 하면 새로운 프로젝트가 재미있고 흥미로운 것으로 변할 수 있는데, 여기에 참여하는 동안 인내력과 동기부여를 빼앗기기도 합니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_1.png" />

안녕하세요! 오늘은 주요 싱글 보드 컴퓨터를 사용하여 몇 가지 선택된 하드웨어와 결합하여 기본 SIGINT 수신 스테이션을 만드는 방법에 대해 이야기하려고 합니다. 이를 사용하여 항공기, 지역 신호, ISM 신호 및 올바른 안테나를 사용하면 우주 신호까지 감지할 수 있습니다. 기본 Raspbian OS를 사용하는 대신 전용 SIGINT에 포커싱된 OS를 사용할 것입니다. 하드웨어를 준비하고 시작해 봅시다!

<img src="/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_2.png" />

이 프로젝트를 완료하려면 SD 카드에 플래싱하는 경험과 기본적인 Linux 경험이 필요합니다.

<div class="content-ad"></div>

# 드래곤 소개

코로나 대유행 중에 만들어진 Dragon OS는 라디오 중심의 펜 테스트 및 분석 배포판으로, Kali Linux나 Parrot OS와 유사합니다. 다양한 신호 프로토콜과 하드웨어와 함께 작동할 수 있으며, Bluetooth, Wi-Fi, ISM, 전화 및 대부분의 라디오 스펙트럼을 싼 가격의 장치인 RTL-SDR 또는 블레이드RF 또는 hackRF 시스템과 같은 전용 SDR 장치를 사용하여 즉시 사용할 수 있도록 설정되어 있습니다.

신호 기반 배포판 중 처음은 아니지만 쉽게 시작할 수 있는 것 중 하나이며 미리 설치된 다양한 도구와 표준 패키지 관리자로 초보자에게 매우 친숙합니다. 라즈베리 파이와 결합하면 매우 멋진 장비가 됩니다.

# 요구 사항

<div class="content-ad"></div>

라즈베리 파이 보드

주변기기 (전원 공급 장치, SD 카드, 키보드 및 모니터 또는 SSH 액세스를 위한 장치)

RTL-SDR 동글

모니터 모드 Wi-Fi 카드

<div class="content-ad"></div>

# 운영 체제

기본 Raspbian 배포본은 다양한 용도에 좋은 OS이지만, SIGINT 용도로는 다소 부족합니다. 적절히 구성할 수는 있지만, 이에는 추가 시간이 소요될 것입니다. 효율성이 중요한 우리에게 시간은 소중하니 이제 다른 옵션이 있습니다. 우리는 DragonOS를 사용할 것입니다. 이 OS는 라디오 스펙트럼을 탐색하는데 도움이 되는 다양한 유용한 도구로 구성되어 있어서 불필요한 노력 없이 사용할 수 있습니다.

![이미지](/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_3.png)

또한 다양한 소프트웨어 정의 라디오를 위한 사전 구성된 드라이버가 많이 제공됩니다. 이에는 RTL-SDR, bladeRF, hackRF 등이 포함되어 있습니다. 이는 대부분의 장치가 일반적으로 플러그 앤 플레이가 가능하다는 것을 의미합니다. 초보자에게 이는 이상적입니다. 대부분의 프로젝트를 쉽게 구성하도록 만들어주어 작업에 집중할 수 있게 해주며, 필요한 드라이버를 찾느라 고생할 필요가 없습니다.

<div class="content-ad"></div>

# 설정하기

우리의 Pi를 적절한 이미지로 구성하려면, 먼저 해당 이미지를 다운로드한 다음 SD 카드에 플래시해야 합니다. 하지만 먼저 OS 이미지가 필요합니다.

최신 버전의 Dragon이 SourceForge 리포지토리에서 다운로드할 수 있습니다. 다음 링크에서 찾을 수 있습니다.

![Image](/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_4.png)

<div class="content-ad"></div>

한 번 Sourceforge 페이지에 접속하면, 가장 최근 업데이트 날짜를 확인하여 최신 버전을 받고 있는지 확인할 수 있습니다. 우리가 사용하는 Raspberry Pi 모델의 올바른 이미지를 받는지도 확인해야 합니다. 다양한 모델 간에 소량의 차이가 있기 때문입니다. 그런 다음, 확인이 완료되면 다운로드 탭을 눌러 로컬에서 이용 가능하게 대기하면 됩니다.

![Signals Intelligence The Raspberry Pi_5](/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_5.png)

로컬 머신에 설치되면, SD 카드에 플래시가 필요합니다. 이를 위해 다른 프로젝트에서와 같이 Balena Etcher를 사용할 수 있습니다. 하지만 먼저 다운로드의 무결성을 확인하기 위해 MD5 합을 비교해야 합니다. Linux 사용자라면 다음 명령어로 터미널에서 이를 할 수 있습니다.

```js
md5sum /다운로드한/파일의/경로
```

<div class="content-ad"></div>

무결성을 확인하려면 표시된 출력물을 Sourceforge 웹사이트에 저장된 출력물과 비교해야 합니다. 일치하면 파일이 정상이며 준비된 상태입니다.

최종 단계는 우리의 Raspberry Pi와 함께 사용할 수 있도록 OS를 SD 카드에 플래시하는 것입니다. 이는 상당히 간단한 단계이므로 자세히 설명하지는 않겠습니다. 그러나 문제가 발생하면 Balena 웹사이트를 사용하여 문제 해결할 수 있습니다.

플래시가 완료되면 SD 카드를 Pi에 넣고 전원을 공급하고 부팅이 완료될 때까지 기다리면 됩니다. 설치가 올바르게 되었다면 데스크톱으로 부팅할 수 있어야 합니다. 이 시점에서 기본 사용자/비밀번호 조합을 변경했는지 확인해야 합니다.

<div class="content-ad"></div>

터미널에 들어가서 ls 명령어를 사용하여 사용 가능한 파일/프로그램을 검색해볼 수 있어요.

```js
ls -la
```

<img src="/assets/img/2024-06-19-SignalsIntelligenceTheRaspberryPi_7.png" />

# 마지막으로 함께 하고 싶은 말씀

<div class="content-ad"></div>

여기 요즘 만들어놓은 Raspberry Pi 보드를 활용해 기본적이면서도 광대한 신호 분석 스테이션으로 변신시켰습니다. 이제 여러분의 라디오 수신기 및 기본 센서 패키지의 범위에만 한정되어 있는 프로젝트입니다.

Dragon과 함께 미리 설치된 소프트웨어의 폭넓은 범위를 고려했을 때, 설치는 쉽지만 다음 단계가 무엇인지 궁금할 수 있습니다. 그러나 우리는 앞으로 몇 달 동안 Dragon OS에서 사용 가능한 일부 도구를 통해 작동하는 자습서를 통해 도움을 드릴 예정입니다.

Raspberry Pi를 홈 빌트 프로젝트에 사용한 적이 있나요? 프로젝트 제안이 있거나 특정 주제를 다루는 자습서를 보고 싶으신가요? 댓글에 제안을 남겨주세요. 여러분의 소중한 의견을 기다리고 있습니다!

Medium은 최근 일부 알고리즘 변경을 도입하여 이와 같은 기사의 발견 가능성을 개선했습니다. 이 변경 사항은 높은 품질의 콘텐츠가 보다 넓은 관객에게 도달하도록 하는 데 중요한 역할을 합니다. 여러분의 참여가 이를 실현하는 데 결정적인 역할을 하고 있습니다.

<div class="content-ad"></div>

만약 이 기사가 유익하고 정보가 많거나 재미있었다면, 우리는 친절히 당신의 지원을 보여주시도록 권장합니다. 이 기사에 박수를 보내면 작가에게 그들의 작품이 감사히 받아들여지고, 또한 그것을 이용할 수 있는 다른 사람들에게 그 가시성을 높이는 데 도움이 됩니다.

🌟 이 기사를 즐겼다면? 우리의 작품을 지원하고 커뮤니티에 참여해보세요! 🌟

💙 Ko-fi에서 저를 지원해주세요: Investigator515

📢 독점 업데이트를 위해 OSINT 텔레그램 채널에 참여하세요.

<div class="content-ad"></div>

📢 최신 이벤트 정보를 받으시려면 우리의 크립토 텔레그램을 팔로우해주세요

🐦 트위터에서도 팔로우해주세요

🟦 블루스카이에도 참여하실 수 있습니다!

🔗 추천하는 기사들:

<div class="content-ad"></div>

- 뭐야 이건?! 로켓 엔진
- OSINT 수사관을 위한 셀프 케어 & 회복 가이드

✉️ 이와 같은 콘텐츠를 더 보고 싶으세요? 이메일 업데이트 신청하세요