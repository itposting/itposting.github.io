---
title: "Pwnagotchi Wi-Fi 핸드셰이크를 간식으로 먹는 가상 애완 동물"
description: ""
coverImage: "/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_0.png"
date: 2024-06-19 04:22
ogImage: 
  url: /assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_0.png
tag: Tech
originalTitle: "Pwnagotchi: A Virtual Pet That Eats Wi-Fi Handshakes As Treats"
link: "https://medium.com/radio-hackers/pwnagotchi-a-virtual-pet-that-eats-wi-fi-handshakes-as-treats-93b741630aa6"
---


![image](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_0.png)

안녕하세요! 이 글에서는 라즈베리 파이 제로 W 시스템에서 작동하는 A2C 기반 가상 애완동물 인 Pwnagotchi에 대한 정보를 알려드릴게요. 이 장치는 "AI"를 지원하며 자신의 Wi-Fi 환경에서 학습하여 포착하는 crackable WPA 키 자료를 최대화합니다. 우리 작은 친구는 Wi-Fi 네트워크의 핸드셰이크를 잡기 위해 양 passively하거나 actively하라는 더 나은 켑틴을 이용합니다. 해당 자료는 시스템에 ".pcap" 파일로 저장되며 나중에 hashcat, aircrack 또는 .pcap 크래킹을 지원하는 다른 크래킹 도구를 사용하여 크랙할 수 있습니다.

면책 사항: 이 도구는 교육 목적으로 만들어졌으며 네트워크 암호를 크랙하고 노출하는 것은 여러분에게 많은 불쾌한 결과를 초래할 수 있습니다. 사려 깊게 생각하고 애완동물을 선량한 목적으로 사용해주세요.

이 장치의 목적은 (윤리적인) 해커들이 강화 학습, Wi-Fi 네트워킹 및 정찰, 핸드셰이크 프로세스에 대해 학습하고 더 많은 산책을 나가는 이유를 제공하는 것입니다.

<div class="content-ad"></div>

버추얼 펫을 더 자주 사용할수록, 핸드셰이크를 캡처하고 pcap 파일을 얻는 것이 더욱 빠르고 효과적으로 이루어집니다. 당신의 기기는 당신과 함께 학습하여 효율성을 최적화할 것입니다.

이제 한 단계씩 어떻게 가상 펫을 만들었는지 알려드릴게요.

- 하드웨어
- 설치/소프트웨어
- 구성

# 하드웨어:

<div class="content-ad"></div>

제 장치에 선택한 하드웨어 구성 요소로 시작해 보겠습니다:

- 라즈베리 파이 제로 W: 라즈베리 파이 제로의 W 버전을 사용해야만 장치가 Wi-Fi 신호를 스캔할 수 있습니다.
- 마이크로 SD 카드: 최소 8GB의 SD 카드가 충분하지만, 장치를 더 잘 활용하고 빠르게 사용하기 위해 32GB의 SD 카드를 선택했습니다.
- 마이크로 USB 케이블: 데이터 전송을 지원하는 케이블을 구입해야 합니다. 데이터 전송 및 전원 공급에는 데이터 포트와 전원 포트를 사용하게 됩니다. 저는 산책할 때 전원 모드만 지원하는 짧은 케이블을 사용합니다.
- 휴대용 파워 뱅크: 파워 뱅크는 애완동물과 산책할 때 배터리 역할을 합니다. 다만 파워 뱅크의 최대 전압 용량이 라즈베리 파이 제로의 용량을 초과하지 않도록 주의해야 합니다. 저는 6000mAh 용량, 5V/2A 입력 및 5V/2.1A 출력을 지원하는 파워 뱅크를 사용하고 있습니다.
- 화면 디스플레이: Pwnagotchi를 PC에 연결하고 웹 브라우저에서 UI를 확인할 수 있지만, 밖에 나가면서 애완동물의 귀여운 얼굴을 보기 위해 화면을 사용하시는 것이 어떨까요. 저는 라즈베리 파이 제로 W와 잘 어울리는 2.13인치 Waveshare V4 화면을 사용합니다.

모든 하드웨어 부품을 모은 후 라즈베리 파이 제로 W를 메일 핀 헤더를 사용해 Waveshare V4 화면 디스플레이에 납땜했습니다. 그 다음 원하시는 방식대로 부품을 모두 함께 조립하시면 됩니다.

휴대용 장치로 만들기 위해 단순히 테이프로 모든 부품을 함께 고정했습니다. 정말 수제 같이 보이죠 :) 다른 다양한 소재를 사용할 수 있습니다. 가상 애완동물을 위한 케이스를 3D 프린팅하여 제작할 수도 있습니다. 아래 링크에서 다른 대안을 확인해보세요:

<div class="content-ad"></div>

아래 링크를 확인하시면 부품들을 모두 모아 조립하는 데 도움을 받을 수 있습니다:

- [동영상 1](https://www.youtube.com/watch?v=R-fTPv09vQ8)
- [동영상 2](https://www.youtube.com/watch?v=gyKT_mASSuc&t=1288s)

<div class="content-ad"></div>

# 설치 및 소프트웨어:

Pwnagotchi는 여러 해 동안 진행되었고 많은 변경/업데이트를 거쳤습니다. 따라서 설치 부분에서 어떤 문제도 마주치지 않도록 하기 위해 Pwnagotchi 이미지의 최신 버전을 설치하고 사용하는 방법을 알려 드리겠습니다. 당신의 장치를 올바르게 구동시키기 위해서 이 부분은 중요합니다. 만약 설정이 잘못되었을 경우를 대비하여 가이드를 시청하고 프로세스를 거슬러 올라가도록 비디오 링크를 남겨 두겠습니다.

먼저 이 페이지로 이동하여 최신 Pwnagotchi 이미지를 다운로드해 주세요.

https://github.com/jayofelony/pwnagotchi/releases

<div class="content-ad"></div>

작업을 완료한 후 SD 카드를 PC에 연결하십시오. 이제 우리는 balenaEtcher를 사용하여 Pwnagotchi 이미지를 SD 카드에 플래싱할 것입니다. 이 SD 카드는 가상 장치의 메모리 은행이 될 것입니다. 다음 URL을 방문하여 다운로드하십시오:

https://etcher.balena.io

이제 balenaEtcher을 열고, SD 카드에 쓰고 싶은 Pwnagotchi 이미지 파일을 선택하십시오. 이미지를 쓰고자 하는 SD 카드를 선택하십시오. 그러나 SD 카드를 제거하기 전에 조심하고 기다려야 합니다. 정상적으로 작동하도록 초기 구성 파일을 하나 더 만들어야 할 것입니다.

![Pwnagotchi 이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_1.png)

<div class="content-ad"></div>

우리가 이미지를 플래시하고 나서 SD 카드를 라즈베리 파이에 넣은 다음, 라즈베리 파이를 PC에 연결하세요. 장치의 데이터 포트와 데이터 케이블을 사용하여 파일을 변경/편집/전송할 수 있도록 해주세요.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_2.png)

이제 라즈베리 파이를 PC에 네트워크 어댑터로 소개하여 장치가 인터넷에 연결되고 플러그인을 다운로드/업데이트하고 PC의 기본 네트워크를 사용하여 다른 장치를 핑할 수 있도록 해야합니다. 이를 위해 파일을 다운로드해야 합니다. 이 파일 링크는 이 섹션 맨 끝에 제공한 비디오의 URL에서 찾을 수 있습니다.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_3.png)

<div class="content-ad"></div>

이제 장치의 네트워크 어댑터 설정을 편집하여 인터넷을 사용하고 cmd를 통해 ssh 포트를 사용하여 장치에 액세스할 수 있도록 할 것입니다.

![image](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_4.png)

네트워크 연결과 관련하여 문제가 발생할 수 있습니다. 그런 경우 주요 Wi-Fi 어댑터의 설정으로 이동하여 장치에 인터넷 연결을 공유합니다.

![image](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_5.png)

<div class="content-ad"></div>

이제 모든 준비가 끝났어요. SSH 포트를 사용하여 디바이스에 연결하세요. 기본 비밀번호는 "raspberry"입니다. 시스템에 접속한 후 비밀번호를 변경할 수 있어요.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_6.png)

네트워크 연결 상태를 확인하려면 단순히 IP 주소에 핑을 보내세요.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_7.png)

<div class="content-ad"></div>

우리가 핑을 치면 존재합니다. 이제 우리는 인터넷 연결이 확실히 되어 있는지 확인했습니다.

Pwnagotchi에서 PC로 파일을 빠르게 다운로드하기 위해 FileZilla와 같은 파일 전송 프로그램을 사용하는 것이 좋을 것 같아요.

[FileZilla](https://filezilla-project.org)

여기에 최신 소프트웨어를 올바르게 설치하는 방법을 보여주는 비디오 링크가 있습니다:

<div class="content-ad"></div>

[링크](https://www.youtube.com/watch?v=OFxKN3N4gE8)

소프트웨어 설치가 완료되면, 제가 가장 좋아하는 부분, 설정을 계속합니다.

# 설정:

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_8.png)

<div class="content-ad"></div>

우리 사랑하는 Pwnagotchi에는 3가지 모드가 있어요:

수동: 데이터 케이블을 사용하여 Pwnagotchi를 데이터 포트에 연결하면 PC를 통해 ssh 포트를 사용하여 액세스할 수 있어요. 이 모드에서 기계는 종종 잠자는 모드와 같아요. 구성을 편집하거나, 플러그인을 추가/제거/업데이트하거나, 색상을 변경하거나, 화면에 표시할 내용을 변경할 수 있어요. 데이터를 전송하거나 전송받을 때 유닛을 사용할 때 이 모드를 사용할 거에요.

자동: 전원 포트를 통해 장치를 연결하면 근처 환경을 스캔하여 패시브 스캔 및 능동적인 인증 제거 공격을 수행하여 핸드셰이크를 캡처할 거에요. 수동 모드에서 조정하고 구성한 사항은 자동 모드에서 기본적으로 사용될 거에요. Pwnagotchi의 전원 포트를 사용할 때 기본 모드로 시작할 거에요.

AI: Pwnagotchi는 기본적으로 AUTO 모드에서 이 모드로 전환해요. 여기서 AI가 등장하여 공격에서 더 효과적일 수 있는 방법을 결정하기 위해 알고리즘을 사용할 거에요. 예를 들어 핸드셰이크를 캡처한 모뎀인 경우, 다시 핸드셰이크를 빠르게 얻기 위한 가장 빠른 방법을 사용할 거에요.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_9.png)

기기를 데이터 케이블을 사용하여 연결하고 명령 프롬프트를 통해 ssh 포트에 액세스하면 시스템에 액세스할 수 있습니다. 사용되는 OS는 데비안 배포판과 유사한 Raspberry Pi OS입니다. Linux 사용자라면 이 시스템에 익숙할 것입니다.

기본 암호는 "raspberry"이지만 터미널이나 아래에서 언급된 구성 설정 파일에서 변경할 수 있습니다.

![image](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_10.png)


<div class="content-ad"></div>

기본 시스템 설정에서 'handshakes'라는 디렉토리가 있습니다. 여기에 캡처한 .pcap 파일이 다운로드됩니다.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_11.png)

장치의 구성 설정을 확인하거나 변경하려면 간단히 /etc/pwnagotchi/config.toml 파일을 편집하면 됩니다. Pwnagotchi가 “pwn”하고 싶지 않은 Wi-Fi 네트워크를 추가하거나 활성화/비활성화할 플러그인을 편집하고, 가상 애완 동물의 색상을 조정하고, 장치의 이름을 변경하고, 캡처한 .pcap 파일을 다른 디렉토리에 저장할 수 있습니다.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_12.png)

<div class="content-ad"></div>

사용 가능한 플러그인을 확인하려면 아래 명령을 실행할 수 있어요. 원하시는 대로 플러그인을 추가/업데이트/삭제할 수 있어요.

![이미지](/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_13.png)

만약 저처럼 일반 터미널 사용자보다는 UI/UX 유형의 사람이라면, 기기의 웹 페이지에서 플러그인 페이지를 방문해보세요. 단순히 "10.0.0.2:8080/your_devices_name/plugins"를 방문하시면 돼요.

이렇게 하면 원하는 대로 손쉽게 플러그인을 활성화/비활성화할 수 있어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_14.png" />

더 많은 플러그인에 대해 검색하고 원본 Pwnagotchi 저장소를 확인하여 자세한 정보를 찾아보는 것을 제안합니다. 그러면 Pwnagotchi를 원하는 대로 사용자 정의할 수 있습니다. 효율적이고 가장 적합한 플러그인을 확인하기 위해 플러그인을 활성화하거나 비활성화해보세요. 기기와 플러그인이 어떻게 작동하는지 더 잘 이해할수록, 보다 효율적으로 사용하면서 더욱 재미를 느낄 수 있을 것입니다.

이제 주변 Wi-Fi 환경에서 핸드셰이크 파일을 캡쳐하는 완벽히 작동하는 가상 애완 동물이 생겼습니다. Pwnagotchi에 대해 더 알아보려면 공식 웹사이트를 확인해보세요.

https://pwnagotchi.ai/intro/

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-PwnagotchiAVirtualPetThatEatsWi-FiHandshakesAsTreats_15.png" />

# 친애하는 독자여, 소중한 시간 내어주셔서 감사합니다. 이 기사가 여러분에게 Pwnagotchi의 기본을 이해하는 데 도움이 되었기를 바라며, 더 많은 정보를 얻고자 하는 열망을 갖길 바랍니다. 더 많은 프로젝트가 준비되어 있으니 기대해 주세요!!!