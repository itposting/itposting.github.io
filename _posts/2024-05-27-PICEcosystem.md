---
title: "PIC 생태계"
description: ""
coverImage: "/assets/img/2024-05-27-PICEcosystem_0.png"
date: 2024-05-27 13:11
ogImage:
  url: /assets/img/2024-05-27-PICEcosystem_0.png
tag: Tech
originalTitle: "PIC Ecosystem"
link: "https://medium.com/@lfoster.se.be/pic-ecosystem-f8268a6c3d72"
---

# PIC16LF18324 코딩을 시작하는 방법

만약 이미 라즈베리 파이코나 다양한 아두이노로 몇 가지 프로젝트를 해 보셨고 다른 마이크로컨트롤러에서 작업을 시도해보고 싶다면, Microchip 사의 PIC를 사용해보시길 권해드립니다. 여기에는 때로는 흥미로운 도전이 될 수 있는 8비트 마이크로컨트롤러들이 포함되어 있습니다. 셋업하기 위해 약간의 비용이 들 수는 있지만, 칩 자체는 저렴하며 즐겁게 만들고 탐험할 수 있습니다.

이 글은 시작하는 데 필요한 도구에 대해 설명합니다. 이 글은 개발 보드가 아닌 PIC 마이크로컨트롤러 자체에 대한 것입니다. 여기에서 다루고 있는 유형의 개별 PIC 마이크로컨트롤러보다 비쌌지만 PicKit 항목을 구입할 필요가 없도록 도와주는 PIC 마이크로컨트롤러용 개발 보드가 있습니다.

만약 여전히 관심이 있다면, 개발 보드를 넘어서거나 다른 사전에 납땜된 방법을 넘어서고 싶다면, 계속해서 읽어보세요.

<div class="content-ad"></div>

# 왜 PIC를 선택해야 하는가?

PIC의 흥미로운 측면 중 하나는 그 가족 중 특별한 저전력 칩이 있다는 것입니다. 저전력 사용은 빠른 알고리즘을 설계하는 것과 유사한 도전 과제입니다. 그러나 적절한 MCU를 선택함으로써 큰 도움을 받을 수 있습니다. 아두이노 "플랫폼"은 많은 사람들에게 좋은 시작점입니다. 그것은 간단히 ATTiny85와 같은 관련 AVR 칩을 탐구할 수 있도록 쉽게 사용할 수 있습니다. 그러나 마이크로컨트롤러에 대한 보다 폭넓은 이해를 원하고 아두이노의 세계를 벗어나려면, PIC 패밀리는 매우 낮은 전력을 제공하여 그 방법을 제공할 수 있습니다. PIC16LF18324 (또한: 18324, 이후로는 "칩" 또는 "픽"으로 지칭)는 이러한 제안 중 하나입니다. 이 칩은 이름과는 달리 16이 아닌 8비트 칩입니다. 14개의 핀이 있으며, 그 중 12개는 I/O 핀입니다. PIC 패밀리의 다른 구성원들은 다양한 핀 수를 갖고 있습니다. 이름에 'L'이 있는 것은 "저전력"을 의미합니다. 이름에 'L'이 없는 비저전력 모델도 있지만 이 모델은 여기에서 다루지 않겠습니다. PIC16LF18324 칩만 구입하는 비용은 ATTiny85와 비슷합니다. ATTiny85처럼 스룰 구멍 또는 표면실장 패키지로 구입할 수 있으며, 내장 오실레이터도 내장되어 있습니다.

18324는 7K의 RAM을 제공하며, 외부 크리스탈이 필요하지 않고 제공되는 32MHz의 속도로 실행됩니다. 내장 오실레이터는 공장에서 보정되었습니다. 7KB의 플래시와 1/2K (512바이트)의 정적 RAM이 탑재되어 있습니다. 다양한 주변 기기(많은 MCU들처럼)를 갖고 있습니다.

- USART (증강 USART 또는 EUSART라고 불림)
- I2C
- SPI
- PWM (모터 제어나 TV 및 기타 리모컨에서 자주 사용됨)
- 타이머 (캡처/비교 포함); 또한 "와치독" 타이머도 있음
- 아날로그/디지털 변환기 및 디지털/아날로그 변환기
- 물론: 핀을 읽거나 핀에 디지털 값을 쓸 수 있는 능력(1은 LED 켜기; 0은 LED 끄기)

<div class="content-ad"></div>

18324에서 특히 좋은 기능 중 하나는 PPS입니다. 이 "주변 핀 선택" 기능을 사용하면 대부분의 핀을 어떤 주변 장치에도 사용할 수 있습니다. 다양한 마이크로컨트롤러의 핀 배치도를 보신 적이 있을 수도 있습니다. 18324는 핀에 대한 일부 기본 설정이 있을 수 있지만, 상당한 유연성으로 라우팅할 수 있습니다. 이에는 일부 제한 사항이 있을 수 있지만(클럭 속도 등을 기반으로 한 PPS 매핑이 불가능한 특정 핀 등), 예를 들어 EUSART TX 핀을 RC4로 라우팅할 수 있습니다.

핀에 대해 이야기할 때, 14개의 핀에 제한된 18324는 그 I/O 핀을 RAn 또는 RCn 중 하나로 지정합니다. PIC16 패밀리의 더 큰 멤버들은 RBn도 설정합니다. 두 핀은 전원 공급용으로 "바쁩니다" (VDD와 VSS). 많은 다른 칩들과 달리 전원 핀이 대각선에 위치하는 칩들과 달리, VDD(전원)와 VSS(그라운드)는 한쪽 끝의 노치 반대편에 있습니다. 전원 핀은 18324 칩의 한쪽 끝에 있습니다. 전체 핀 배치도는 아래에 표시되어 있습니다.

이 간단한 소개가 제공된 이제 PIC16lf18324에서 시작하기 위해 필요한 설정 또는 "장비"를 살펴보는 시간입니다.

# 사전 준비 조건

<div class="content-ad"></div>

만약 이 글을 그냥 흥미로이 읽고 싶다면 맘껏 읽어보세요. 하지만 이 글과 함께 코딩하길 원한다면, 다음 사항을 준비해야 하거나 받아야 할 수도 있습니다.

- 브레드보드
- PIC16LF18324 칩
- 프로그래밍 장비
- 와이어 (또는 두폰트 케이블)
- LED
- 두 개의 저항
- 100Ω에서 330Ω의 저항 값이 적당합니다. 더 높은 값도 괜찮지만, LED가 어두워질 수 있습니다.
- 5.1 kΩ 풀업 저항기 (또는 근사값)
- 0.1 µF 캐패시터. 세라믹, 비편광이 권장됩니다.
- 어떤 종류의 전원 공급 장치. 건전지가 적당합니다. 약 3.3V 정도 필요합니다.
- 'C' 코드에 대한 약간의 지식이 있으면 유용합니다. 코드는 제공됩니다.

# 칩 구매

이들은 DigiKey 또는 Mouser에서 주문할 수 있습니다. 둘 다 각각 2달러 미만입니다 (2024년 5월에 각각 1.29달러에서 1.56달러로 확인되었습니다). 대량 구매할 경우 할인이 적용되어 가격이 더욱 내려갈 수 있습니다. 필요한 패키징을 획득하기 위해 주의해야 합니다. 이 칩을 브레드보드에 꽂으려면 "PDIP"와 같은 스루홀 패키지가 필요합니다. 이는 "14 PDIP" 또는 "PDIP-14"로 불릴 수 있습니다. 또한 배송 비용을 주의하세요. 이 비용이 여러 칩의 가격보다 비쌀 수 있습니다. 세 개 이상을 그룹으로 구매하면 배송비를 절감할 수도 있습니다. 아마존에서는 (이 지침과 호환되지 않지만 보통 사용하기 쉬운) PIC 보드를 20달러 미만으로 구매할 수 있습니다.

<div class="content-ad"></div>

# 가장 큰 비용: 프로그래머

PIC16 패밀리 칩에 노출되기 위해 인-시스템 프로그래밍용 개발 보드를 사용하는 것이 가능할 수 있습니다. 독자가 투자를 활용하고 싶다면 좋은 구글링을 해볼 만한 가치가 있을지도 모릅니다. 그러나 '훈련 바퀴를 제거하고', 생태계에 깊숙이 들어가려면 로우 마이크로컨트롤러를 사용해야 합니다. 이는 마이크로컨트롤러 작업 시 지출이 반복적으로 필요한 사항입니다. 이 기기 없이도 성공적으로 진행할 수 있다면 언제든지 자유롭게 해보십시오.

과거에는 PICkit 4®가 약 $100에 구매 가능했으며, 아래에서 설명합니다. 보다 최근에 PicKit 5가 소개되었으며 제조사에 의해 PICkit 4가 지연 폐기되었습니다. 그러나 가격은 대략 동일합니다. 유사한 기능을 갖춘 것으로 가정됩니다. 두 제품 모두 MPLAB X IDE v6 소프트웨어와 호환됩니다(아래 더 자세히 설명함). 이제는 더 저렴한 기기(약 $40)도 구매할 수 있을 수 있습니다. 개인별 사용환경에 따라 다를 수 있습니다.

MPLAB PICKit4에는 한쪽 끝에 연결 커넥터 구멍이 있습니다(또는 참조로 사용하는 레이블링에 따라서 '밑면'입니다). 매우 특정한 핀배열을 갖추고 있습니다. 이 구멍을 브레드보드에 연결해야 합니다. Dupont 케이블이나 일반 와이어로도 잘 작동합니다. 이 칩에 대한 다양한 프로젝트를 수행한다면, 더 편리한 것이 필요할 수 있음을 발견할 수 있습니다.

<div class="content-ad"></div>

PICKit4의 다른 쪽에는 작은 USB 2 커넥터가 있습니다. 이를 PC에 연결할 수 있습니다 (사람들은 포럼 게시물에 따르면 MAC 및 Linux도 사용합니다). 연결하고 나면 IDE에서 프로그램을 할 수 있습니다.

# 소프트웨어

마이크로컨트롤러에 코드를 로드하는 것은 C 컴파일러와 MPLAB X IDE라는 다운로드 가능한 소프트웨어로 처리할 수 있습니다. 이 문서 작성 시에는 버전 6입니다.

![이미지](/assets/img/2024-05-27-PICEcosystem_0.png)

<div class="content-ad"></div>

아래에 전체 지침이 있지만, 대체로 Microchip의 개발자 도움 페이지인 Install MPLAB® X IDE Version 6.00 Walkthrough에서도 확인할 수 있습니다. MPLAB X는 다른 IDE와 유사하게 설치됩니다(실제로, 설치 파일을 기반으로 하면 Apache의 NetBeans IDE를 기반으로 한 것으로 보이며, 마이크로컨트롤러와 함께 사용하기 위해 많은 사용자 정의가 있습니다).

이 IDE에서 완전히 새로운 PIC16LF18324 프로젝트를 설정하는 방법은 아래에 설명되어 있지만, 먼저 몇 가지 유용한 도구와 필요한 대화 상자에 대해 살펴보겠습니다.

# 몇 가지 도구와 대화 상자

프로젝트를 만든 후에는 프로퍼티 페이지를 살펴보는 것이 매우 유용합니다. 왼쪽에 설명된 대로, "마우스 클릭"(Windows에서 좌 클릭하거나 기타 OS에서는 일반적으로 OS와 같은 방식으로 메뉴를 띄워주십시오)하고 나서 "Properties" 메뉴 항목을 가장 아래에서 클릭합니다. IDE의 나중/이전 버전은 이것을 다르게 배치할 수 있지만, "Properties"는 매우 가능성이 높은 이름입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-PICEcosystem_1.png" />

클릭하면 아래와 같이 새로운 팝업 대화 상자가 나타납니다. 이 대화 상자에는 작업할 기기 이름 설정이 포함되어 있습니다. 이 설정은 디버깅 및 내장 플래시 드라이브에 코드를 불러올 때 필요합니다.

<img src="/assets/img/2024-05-27-PICEcosystem_2.png" />

왼쪽에 트리 구조를 주목해주세요. 이것은 오른쪽 창의 모드를 변경합니다. "PICKit4" 노드를 클릭하면 아래 모드로 변경됩니다.

<div class="content-ad"></div>


![PICEcosystem Image 3](/assets/img/2024-05-27-PICEcosystem_3.png)

이것은 "Options categories" 드롭다운을 사용하는 데 매우 중요한 부분입니다. 이것은 여전히 보이는 컨트롤을 더 조정합니다.

![PICEcosystem Image 4](/assets/img/2024-05-27-PICEcosystem_4.png)

"Power target circuit from the PICkit 4"를 선택해야 합니다. 이 설정은 컴퓨터의 USB 드라이브를 통해 PICkit 4와 PIC 칩을 연결한 경우에 사용됩니다. 디버깅 및 플래시 드라이브에 코드를 업로드하는 데 필요합니다. 이 값은 USB 전원을 보드로 공급합니다. 이를 사용하지 않으면 보드 자체의 전원이 사용됩니다. 그림에서와 같이 단순한 브레드보드에 칩을 연결한 경우, PICkit으로부터 전원을 공급하는 것이 올바른 선택입니다. 이 값은 기본적으로 선택되지 않습니다. 아마도 소프트웨어가 모든 하드웨어를 보호하려고 하기 때문일 것입니다. 대상 보드에 백업 전원 공급이 사용 중인 경우 이 설정은 좋은 선택이 아닙니다. 실제로 이 설정을 "Power target circuit from PICkit 4"로 변경하지 말아야 할 때까지 변경하지 않으려다고 말할 정도입니다. 필요한 경우 팝업 메시지가 표시될 때까지 변경하지 마세요. 이 설정이 필요하지만 설정되지 않은 경우 PICkit / IDE 조합은 팝업 오류 대화상자로 경고합니다. 설정을 저장하려면 "확인" 버튼을 클릭해야 합니다.


<div class="content-ad"></div>

# 구성 비트

![PICEcosystem_5](/assets/img/2024-05-27-PICEcosystem_5.png)

이 메뉴 항목은 "구성 비트"를 엽니다. PIC 영역에서는 하드웨어를 낮은 수준에서 설정하는 특수 플래시 버닝 설정이 선택됩니다. 다른 마이크로컨트롤러에서는 이러한 설정을 "퓨즈"라고 할 수 있습니다.

![PICEcosystem_6](/assets/img/2024-05-27-PICEcosystem_6.png)

<div class="content-ad"></div>

여기에서 구성할 수 있는 설정 사항입니다. 이 작은 칩이 실제로 수행할 수 있는 몇 가지 흥미로운 작업의 아이디어를 제공할 수 있습니다 (브라운 아웃 감지, 위에서 언급한 PPS(주변 핀 선택), 그리고 와치독 타이머까지 모두 여기서 암시됩니다). 이 토론과 가장 관련된 것은 아마 위쪽에 있는 "FEXTOSC"/"RSTOSC" 설정 쌍일 것입니다. 이 PIC 칩은 클럭 구동에 있어 유연합니다. 외부 오실레이터를 사용할 수 있지만, 사용 중이 아닌 경우 여기서 비트를 설정하지 않아야 합니다. 이 토론 목적상 FEXTOSC(외부 오실레이터)를 off로 설정하고, RSTOSC(리셋 기본 오실레이터)를 NFINT32(내부 32,000,000 Hz로 읽음) 설정으로 설정하세요. 이것은 1 MHz로도 설정할 수 있습니다. 그러나 외부 설정은 칩을 구동하는 오실레이터를 배선해야 하며, 이 토론의 범위를 벗어납니다. 또한 핀을 사용하고 더 많은 비용이 소요되며 더 많은 하드웨어 조작이 필요합니다.

이 문서의 다른 곳에서 제시된 코드에 관해: 작업 부분 외에도 실제로 운영 부분에 대한 추가 코드가 상단의 “Generate Source Code to Output” 버튼을 클릭하여 생성되었습니다. 이것은 다음과 같은 코드를 생성합니다: 코드 값 시작부)을 보여줍니다.

<div class="content-ad"></div>

XC8 컴파일러를 설치할 겁니다. 다운로드할 수 있는 링크는 아래와 같아요: https://www.microchip.com/en-us/tools-resources/develop/mplab-xc-compilers .

![이미지](/assets/img/2024-05-27-PICEcosystem_7.png)

컴파일러를 선택하는 것은 당신이 작성하는 코드와 최적화 수준에 영향을 줄 거예요. 이 컴파일러는 IDE와 칩이 같은 회사에서 제공하는 것이라 안전한 선택이에요. 다운로드 페이지에는 "수상 경력"이 있다고 쓰여 있어요. 당연히 독자께서는 리뷰와 대안을 확인하실 수도 있어요. 다른 하드웨어를 구입해야 할 수도 있지만, ATTiny 시리즈 같은 AVR을 더 좋아하는 경우, 이 글에서 소개된 설정과 유사한 것을 사용하면 Arduino의 세계에서 벗어날 수도 있어요.

해당 버튼을 클릭하면 라이선스를 보여주는 큰 페이지로 이어지는데, 이는 이 소프트웨어를 기반으로 한 프로젝트를 배포할 계획이 있다면 중요한 고려 사항이에요. 또한 다운로드 컨트롤이 나와 있어요.

<div class="content-ad"></div>


![PICEcosystem_8](/assets/img/2024-05-27-PICEcosystem_8.png)

현재 작성 시점보다 몇 달 전의 날짜를 가진 것이 있습니다. 이는 코드가 꾸준히 유지되고 있는 좋은 신호입니다. IDE는 업데이트 프롬프트를 정기적으로 제공합니다.

여기서 다운로드는 설치 프로그램을 위한 것입니다. 해당 설치 프로그램을 실행하면 아래의 대화 상자들이 팝업됩니다.

![PICEcosystem_9](/assets/img/2024-05-27-PICEcosystem_9.png)


<div class="content-ad"></div>


![PICEcosystem_10](/assets/img/2024-05-27-PICEcosystem_10.png)

![PICEcosystem_11](/assets/img/2024-05-27-PICEcosystem_11.png)

![PICEcosystem_12](/assets/img/2024-05-27-PICEcosystem_12.png)

![PICEcosystem_13](/assets/img/2024-05-27-PICEcosystem_13.png)


<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-PICEcosystem_14.png)

![이미지](/assets/img/2024-05-27-PICEcosystem_15.png)

# Tool Chains

MPLAB X IDE는 빌드를 수행하기 위해 "툴 체인" (컴파일러 및 기타 관련 코드를 포함하는 도구)을 사용합니다. "도구/옵션"을 이용하여 관리할 수 있으며, 이어지는 대화 상자에서 임베디드 아이콘을 클릭하세요.


<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-PICEcosystem_16.png)

![이미지](/assets/img/2024-05-27-PICEcosystem_17.png)

# 프로젝트 생성하기

이것이 여러분이 처음으로 만드는 PIC16LF18324 프로젝트일 수도 있습니다. 혹시 그보다 더 큰 프로젝트라면 환영합니다! 여기서는 간단한 LED 프로젝트를 만들어 보겠습니다.

<div class="content-ad"></div>

우리는 "파일 / 새 프로젝트"로 시작합니다.

![File / New Project](/assets/img/2024-05-27-PICEcosystem_18.png)

이렇게하면 위자드 대화 상자가 표시됩니다.

![Wizard Dialog](/assets/img/2024-05-27-PICEcosystem_19.png)

<div class="content-ad"></div>

우리는 Microchip 임베디드 독립 프로젝트를 진행할 것입니다. "샘플" 서브트리가 상당히 유혹적이지만, 우리가 선택한 칩과 관련이 없습니다. 독립 프로젝트는 실제로 다루기 매우 간단합니다.

![image](/assets/img/2024-05-27-PICEcosystem_20.png)

![image](/assets/img/2024-05-27-PICEcosystem_21.png)

![image](/assets/img/2024-05-27-PICEcosystem_22.png)

<div class="content-ad"></div>

다음 화면에서는 컴파일러를 선택할 수 있어요. 이 IDE에서는 이에 대한 유연성을 제공합니다.

![이미지](/assets/img/2024-05-27-PICEcosystem_23.png)

이전에 설치한 것을 사용하세요.

![이미지](/assets/img/2024-05-27-PICEcosystem_24.png)

<div class="content-ad"></div>

"Set as main project"를 선택한 채로 두면 여러 제어에서 이것을 기본 선택으로 지정할 수 있습니다. 아래에서 LED를 깜빡이는 코드가 간단하게 포함될 것입니다.

![LED Blinking](/assets/img/2024-05-27-PICEcosystem_25.png)

# 코드

지금까지 진행한 내용으로 코드를 추가하는 시작점을 얻었습니다. 이를 위해 IDE의 projects 탭을 사용하여 Projects 창을 표시하고 싶을 것입니다. 아래 이미지에서 소스 파일 트리 노드가 비어 있는 것을 볼 수 있습니다 ('+' 표시가 없는 상태로 확장해도 파일이 없습니다).

<div class="content-ad"></div>

아래는 표 형식을 Markdown 포맷으로 바꾸는 방법입니다:


<img src="/assets/img/2024-05-27-PICEcosystem_26.png" />

We will remedy that.

<img src="/assets/img/2024-05-27-PICEcosystem_27.png" />

Using this control, we can add a “main.c” file. ‘C’ is the language we will use for this program.


<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-PICEcosystem_28.png)

이미지를 삽입한 코드는 아래와 같습니다.

/*

* File: blinker.c


<div class="content-ad"></div>

- 작성자: you

-

- 2024년 5월 23일 오전 12:21에 작성함

\*/

<div class="content-ad"></div>

```c
#include `xc.h`

void main(void) '

return;

'
```

<div class="content-ad"></div>

이것은 그렇게 많은 것을 하지 않아. 하지만 완전한 프로그램인 건 맞아. 이제 하는 일은 세부 사항을 채우는 거야. 자세히 구성하면 요런 느낌이 될 거야.


// PIC16LF18324 Configuration Bit Settings

// ‘C’ source line config statements

// CONFIG1


<div class="content-ad"></div>


- FEXTOSC = LP: 외부 오실레이터 모드 선택 비트 (32.768 kHz에 최적화된 LP(크리스탈 오실레이터))
- RSTOSC = HFINT32: COSC 비트의 전원 업 기본 값 (2x PLL과 함께 HFINTOSC(32MHz)가 기본값)
- CLKOUTEN = ON: 클록 출력 활성화 비트 (CLKOUT 기능이 활성화되어 OSC2에서 FOSC/4 클록이 나타남)
- CSWEN = OFF: 클록 전환 활성화 비트 (사용자 소프트웨어로 NOSC 및 NDIV 비트를 변경할 수 없음)


<div class="content-ad"></div>


#pragma config FCMEN = OFF // 실패 안전 클럭 모니터 활성화 (실패 안전 클럭 모니터가 비활성화됨)

// CONFIG2

#pragma config MCLRE = OFF // 마스터 클리어 활성화 비트 (MCLR/VPP 핀 기능은 디지턼 입력; MCLR 내부적으로 비활성화됨; 약한 풀업은 포트 핀의 WPU 제어 비트에 따라 제어됨.)

#pragma config PWRTE = ON // 파워업 타이머 활성화 비트 (PWRT 활성화됨)


<div class="content-ad"></div>

Markdown 형식으로 테이블 태그를 변경해주세요:


| Configuration | Setting  |
|---------------|----------|
| WDTE          | OFF      |
| LPBOREN       | ON       |
| BOREN         | OFF      |
| BORV          | HIGH     |


<div class="content-ad"></div>


#pragma config PPS1WAY = OFF // PPSLOCK bit One-Way Set Enable bit (The PPSLOCK bit can be set and cleared repeatedly (subject to the unlock sequence))

#pragma config STVREN = OFF // Stack Overflow/Underflow Reset Enable bit (Stack Overflow or Underflow will not cause a Reset)

#pragma config DEBUG = ON // Debugger enable bit (Background debugger enabled)

// CONFIG3


<div class="content-ad"></div>


#pragma config WRT = ALL // User NVM self-write protection bits (0000h to 0FFFh write protected, no addresses may be modified)

#pragma config LVP = OFF // Low Voltage Programming Enable bit (High Voltage on MCLR/VPP must be used for programming.)

// CONFIG4

#pragma config CP = ON // User NVM Program Memory Code Protection bit (User NVM code protection enabled)


<div class="content-ad"></div>


#pragma config CPD = ON // 데이터 NVM 메모리 코드 보호 비트 (데이터 NVM 코드 보호 활성화)

// #pragma 구문은 프로젝트 파일 포함보다 앞에 있어야 합니다.

// ON 및 OFF에 대한 #define 대신 프로젝트 열거형 사용.

#include `xc.h`


<div class="content-ad"></div>

```c
#define _XTAL_FREQ 32000000 // 20MHz 크리스탈 주파수로 정의

void main(void) '

TRISC0 = 0; // RC0 핀을 디지턀 출력 핀으로 설정

while (1) '
```

<div class="content-ad"></div>

```c
RC0 = 1; // RC0 핀을 논리 High로 설정하고 켭니다

__delay_ms(250); // 1/4초의 지연을 추가합니다

RC0 = 0; // RC0 핀을 논리 Low로 설정하고 끕니다

__delay_ms(1000); // 1초의 지연을 추가합니다
```

<div class="content-ad"></div>

MCU(칩)의 핀이 올바르게 배선되면 이것이 칩에 적재되어 LED가 아래에 연결한 상태로 깜박이게 만들 것입니다.

<div class="content-ad"></div>

코드의 시작 부분부터 (대부분을 포함하여) 이전에 언급한 'bit' 설정이 있습니다. 이러한 설정을 제거하면 'C' pragma 설정으로 주로 구성되어 있지만 실제로 다른 동작을 일으킬 수 있습니다. 이 설정은 실제로 자동으로 생성되므로 특별히 이해할 필요는 없습니다.

이 코드에서 주목할 점은 선언되지 않은 변수에 대한 모든 참조입니다. 이들은 실제로 'register' 위치입니다. 마이크로컨트롤러(MCU)의 핀은 일반적으로 특수 하드웨어로 지원되며 매우 유연한 기능을 갖고 있습니다. 여기서 PIC은 유연성에서 뛰어나지만 선택을해야 하는 대가가 따릅니다. 이것은 Arduino 스케치와 같은 것과는 다른, 좀 더 복잡한 세계입니다. 여기서 RC0 핀은 먼저 설정해야 합니다. 다행히 이 작업은 꽤 간단하고 "가능성이 높은" 작업입니다 - 핀에 쓰기 작업을 수행해야 합니다. 다른 기능에는 더 많은 단계가 필요합니다.

"while(1)"은 "영원한 루프"의 구현입니다. 계속해서 실행됩니다. 이 루프는 지정된 시간 간격으로 1과 0을 쓰면서 RC0 핀에서 높은 또는 낮은 전압을 생성합니다. 이전에 언급한 핀배치에 대해 아래에서 살펴보겠습니다.

# 코드 번쩍이기

<div class="content-ad"></div>

제공되는 우수한 도구 세트를 이용하여, 우리는 MCU에 코드를 'burn'하거나 'flash'할 수 있습니다. MCU에 프로그래밍을 하려면, 위에서 언급한 특별한 하드웨어를 통해 해야 합니다. 왜냐하면 MCU는 일반용 컴퓨터와는 달리 매우 독립적이기 때문입니다. 이 간단한 MCU의 연결성은 그 핀에 연결하는 모듈에 달려 있습니다. 인터넷 연결기나 무선 기능은 없지만, 자체 메모리(여러 유형)를 갖고 있으며, 프로그램을 플래시에 넣기 위해서는 (리셋이나 전원 차단 후에도 동일하게 유지될) 칩에 PICkit 4와 같은 장치를 사용하여 프로그램을 넣어주어야 합니다. 이러한 장치는 종종 특별한 전압 수준을 사용합니다. 이를 통해 칩이 실수로 재프로그램되지 않고 정상적으로 실행되도록 할 수 있습니다(그리고 'brick'이나 쓸모없어지는 것을 막을 수 있습니다).

## 배선

코드 플래싱 작업 중에, C 코드는 적절한 형식으로 컴파일됩니다. 이 때 브레드보드가 처음으로 등장합니다. 프로그램을 burn하기 위해서는 두 가지를 알아야 합니다. 첫째, PIC16LF18324 자체의 핀 배치도를 알아야 합니다.

![PIC16LF18324 Pinout](/assets/img/2024-05-27-PICEcosystem_29.png)

<div class="content-ad"></div>

PIC16(L)F183XX 제품 브리프에서 확인할 수 있어요.

다음으로, 이 핀들이 PICKit4에 어떻게 연결되어야 하는지 알아야 해요.

![이미지를 찾을 수 없습니다](/assets/img/2024-05-27-PICEcosystem_30.png)

MPLAB PICkit 4 인-서킷 디버거 사용자 가이드에 이 자세한 내용이 있어요.

<div class="content-ad"></div>

여기에는 특별히 중요한 핀이 있습니다. 핀 1은 MCLR 핀으로 "액티브 로우"입니다. 이 핀은 칩의 일부이기 때문에 정상 작동 시에는 이 핀을 "풀드 하이"로 유지해야 합니다. 우리는 PIC 칩의 해당 핀에서 브레드보드의 전원 레일로 이어지는 상당히 큰(5.1kΩ) 저항을 사용하여 이를 수행할 것입니다. 왼쪽에 있는 핀들의 중간에 있는 이 핀으로부터 실행되는 와이어는 위와 같이 정렬된 칩의 왼쪽 측 핀 중간에 있습니다. 그렇지 않으면, 프로그래머의 핀 1로 동일하게 연결해야 합니다. 그렇지 않으면, 다섯 개의 핀을 연결해야 합니다.

# 배선

지금까지 알게 된 내용을 고려하면, 여기서 설명하는 대로 연결해야 합니다.

![PICEcosystem_31.png](/assets/img/2024-05-27-PICEcosystem_31.png)

<div class="content-ad"></div>


![2024-05-27-PICEcosystem_32](/assets/img/2024-05-27-PICEcosystem_32.png)

![2024-05-27-PICEcosystem_33](/assets/img/2024-05-27-PICEcosystem_33.png)

"top"을 나타내는 칩 상단 가장자리의 작은 들여쓰기 위치를 주목해주세요. 그 위치에서 왼쪽에는 전원, 오른쪽에는 접지가 있습니다. 가능한 명확하게 하기 위해, 화살표로 가리킨 핀(PICkit의 핀 1)은 왼쪽에 있는 칩의 중간 핀과 연결되어 있습니다(거기에는 저항도 있습니다). 그게 바로 노란색 와이어입니다. 빨간색 VDD 와이어는 기판 왼쪽의 빨간 전원 레일에 연결되어 있습니다. 접지 와이어는 기판 오른쪽의 접지 전원 레일로 연결되어 있습니다. PIC 칩을 전원 공급하기 위해, 작은 빨간색 와이어가 맨 위/왼쪽 쪽 핀으로 이어지고, 작은 회색 와이어가 맨 위/오른쪽 쪽 핀으로 이어지고 있습니다. 파란 와이어는 접지 와이어 아래에 연결되어 있습니다. 하얀 와이어는 파란 와이어 아래에 연결되어 있습니다.

PICkit 쪽에서, 노란 와이어는 핀 1에, 빨간 와이어는 핀 2에, 검정 와이어는 핀 3에, 파란 와이어는 핀 4에, 하얀 와이어는 핀 5에 연결되어 있습니다. 확인을 위해, 화살표 표식으로부터 가장 먼 PICkit 상에 3개의 빈 구멍이 보여야 합니다. 다시 말씀드리면 노란-빨간-검정-파란-하얀 순입니다."


<div class="content-ad"></div>

# 플래시 데모

![이미지](/assets/img/2024-05-27-PICEcosystem_34.png)

플래시를 시도하기 전에 이 연결을 끊는 것이 더 원할한 경험을 보장할 수 있습니다.

![이미지](/assets/img/2024-05-27-PICEcosystem_35.png)

<div class="content-ad"></div>

이 콘트롤은 그림을 쓸 수 있도록 하는 것입니다.

![image](/assets/img/2024-05-27-PICEcosystem_36.png)

아래 화면이 나타납니다. 이 메시지를 다시 표시하지 않으려면 해당 상자를 체크해주세요. 그럼 플래시가 시작됩니다. 몇 가지 기기는 3.3V이고 다른 기기는 5V일 수 있으니 주의가 필요합니다. PIC16LF18324는 3.3V에서 작동합니다. 또한 IDE에서 설정을 해야 하는 문제가 하나 더 있습니다. 여기서도 이 경고를 남겨두었는데, 이것 역시 소홀히 할 수 있기 때문입니다.

![image](/assets/img/2024-05-27-PICEcosystem_37.png)

<div class="content-ad"></div>

PIC16LF18324는 3.3 볼트 장치입니다. 다른 장치에 대해 이 경고에 주의하십시오.

# 주의

이 설정에서 MCU를 프로그래밍 / 플래싱하기 전에 수행해야 할 단계가 있습니다. 아래 오류 메시지:

![PICEcosystem_38](/assets/img/2024-05-27-PICEcosystem_38.png)

<div class="content-ad"></div>

…기본 설정은 "장치 전원이 켜짐"임을 알려줍니다. 이것은 PICkit 4의 중요한 기능입니다. 장치에 전원을 공급하거나 자체 전원이 있는 장치에 프로그램을 할 수 있습니다. 그러나 설정은 안전을 우선시합니다.

변경할 설정은 다음 순서로 찾을 수 있습니다:

![이미지](/assets/img/2024-05-27-PICEcosystem_39.png)

![이미지](/assets/img/2024-05-27-PICEcosystem_40.png)

<div class="content-ad"></div>


![Image 1](/assets/img/2024-05-27-PICEcosystem_41.png)

To be safe, after completing this step, check if the setting is still there. It might be helpful to click Debug / Disconnect debug tool after an unsuccessful attempt. Now, try the burning step again.

![Image 2](/assets/img/2024-05-27-PICEcosystem_42.png)

If things don't go well, please double-check the wiring. If the wires are incorrect, you may encounter this situation.


<div class="content-ad"></div>

![PICEcosystem_43](/assets/img/2024-05-27-PICEcosystem_43.png)

# 재미있는 부분

대부분의 프로그래머는 "Hello, world" 순간을 인지하고 있습니다. 이것은 작동하는 채크된 프로그램이 있다는 순간을 의미합니다. 새로운 프로그래밍 언어, 프레임워크 또는 시스템을 배우고 있을 때, 이것이 작동한다면 적어도 연결되어 있고 문법 오류가 없다는 것을 보여줍니다. 마이크로컨트롤러의 세계에서는 동일한 이정표는 주로 깜박이는 LED로 이루어집니다. 마이크로컨트롤러는 비디오 디스플레이를 필요로하지 않습니다. LED가 깜박이는 것은 중요합니다. 왜냐하면 실수로 LED를 전원에 연결할 수도 있기 때문이며(반듯한 저항 없이는 하지 마세요) 또는 잘못 구성된 핀에 연결해서 계속 켜져 있을 수도 있습니다. 깜박이면, 여러분이 실제 프로그램을 실행하고 일어나는 일들이 있음을 증명해줍니다.

여기서 이것을 실현하기 위해 다른 배선이 필요합니다. 왼쪽 측면의 전원 레일에 3.3V 전원을 연결하고, 공급의 접지를 지시된 대로 접지 레일에 연결해야 합니다. 그런 다음, RC0는 18324의 오른쪽 하단에서부터 세 번째 핀입니다. 이것은 100에서 330옴 저항체에 연결되어야 합니다. 저항체의 다른 끝은 LED의 전방 편향 핀(또는 전원 수신 핀)에 연결돼야하며, 다른 핀은 다시 지지에 연결돼야 합니다. 0.1µF 커패시터의 두 리드를 빵판의 "전원 레일"에 눌러 넣으세요. 또한 두 지지 레일을 연결하는 선이 있는지 확인해야 합니다. 이것은 이를 연결하는 한 가지 가능한 방법일 뿐입니다. 중요한 것은 칩과 LED의 전원 및 접지, 핀이 LED에 연결되도록하는 것입니다.

<div class="content-ad"></div>

# 전선 관련 이야기

이곳에 보여지는 세팅은 매우 최소한입니다. 데이터 시트에서는 리셋 핀에 커패시터를 달아 볼트 스플리터를 사용하도록 권장합니다. 우리는 오직 하나의 저항만을 사용하고 있습니다.

![이미지1](/assets/img/2024-05-27-PICEcosystem_44.png)

![이미지2](/assets/img/2024-05-27-PICEcosystem_45.png)

<div class="content-ad"></div>

코드와 배선이 올바르고 칩이 올바르게 프로그램되었다면 LED가 1초에 한 번씩 깜박일 것이며, 각 켜진 시간은 ¼초여야 합니다.

중요한 주의: 이 기사에서는 저전력 운영에 대해 언급했지만, 여기서 사용된 입문용 코드는 그것을 달성하기에는 아주 멀었습니다. 이 칩으로 할 수 있는 최선의 방법이라고 생각하지 마십시오.

# 결론

이것으로 도구 세트의 요약을 마치며, 가능한 것을 시연하는 데 대한 데모를 제공했습니다. 물론 이것은 단순히 시작에 불과합니다. 이와 같은 MCU를 사용하면 수많은 다른 기능과 능력이 함께 제공됩니다. 1/0 입력을 읽거나 1/0 출력을 생성할 수 있는 이렇게 간단한 하드웨어조차도 다양한 방법으로 활용할 수 있으며, MCU로 할 수 있는 것은 훨씬 더 많습니다. 마이크로컨트롤러에서 코드를 실행하는 방법을 알면, 그 외의 모든 가능성을 탐험할 수 있습니다.
