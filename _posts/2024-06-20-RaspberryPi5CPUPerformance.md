---
title: "라즈베리 파이 5 CPU 성능"
description: ""
coverImage: "/assets/img/2024-06-20-RaspberryPi5CPUPerformance_0.png"
date: 2024-06-20 17:40
ogImage: 
  url: /assets/img/2024-06-20-RaspberryPi5CPUPerformance_0.png
tag: Tech
originalTitle: "Raspberry Pi 5 CPU Performance"
link: "https://medium.com/@davidly_33504/raspberry-pi-5-cpu-performance-2d019aa6c0df"
---


라즈베리 파이 기기들은 사용하기 정말 재미있어요. 가격도 저렴하고 성능도 좋아서 다양한 문제를 해결하는 방법에 대한 예제를 쉽게 찾을 수 있어요. Pi 5가 9월 28일에 발표되었을 때 저는 그것을 만져보고 싶었어요.

![라즈베리 파이 5 CPU 성능](/assets/img/2024-06-20-RaspberryPi5CPUPerformance_0.png)

저는 대부분의 프로젝트가 CPU에 의존적이기 때문에 CPU 성능을 측정하여 시작했어요. 아래에서 Pi 5를 최근의 Intel 13세대, SiPeed Lichee Pi 4A, Microsoft/Qualcomm SQ3, Apple M1, 이전 라즈베리 파이 모델 4와 3B, 그리고 열년 전의 Intel i7-4770K 칩과 비교해보았어요.

벤치마크에는 다양한 환경에서 작성, 빌드 및 실행된 하나의 앱을 사용했어요. 이 앱은 간단합니다 - 상대방이 유능하다면 틱택토에서 이길 수 없다는 것을 증명합니다. 이는 알파/베타 가지치기 알고리즘을 사용하여 3가지 고유한 시작 수를 평가합니다. 6493개의 판 상태가 검토되었어요. 변형에는 다음이 포함돼요:

<div class="content-ad"></div>

- 각 대상 CPU에 대한 원시 어셈블리 버전이 있습니다. 코드를 더 최적화할 수 있다고 생각하지만, 각 CPU의 명령어 세트와 레지스터를 활용하려고 노력했습니다. Arm32, Arm64, RISC-V 64 및 AMD64와 같은 다양한 변형이 있습니다.
- 6502, 8080, 8086 및 RISC-V 64 CPU에 대한 원시 어셈블리 버전은 다양한 에뮬레이터에서 실행됩니다: NTVAO (6502 + Apple 1), NTVCM (8080 + CP/M 2.2), NTVDM (8086 + DOS 3.3), RVOS (RISC-V 64 + Linux). 모든 에뮬레이터는 C++로 작성되었으며 대상 플랫폼의 원시 컴파일러를 사용하여 생성되었습니다.
- 알고리즘의 C++ 버전이 있습니다. 플랫폼의 기본 컴파일러를 사용했습니다 — Windows의 경우 Microsoft, MacOS의 경우 clang, Linux 배포판의 경우 Gnu를 사용했습니다. Gnu 및 clang는 Windows를 대상으로 할 수 있으며 Microsoft의 컴파일러보다 훨씬 빠른 코드(일반적으로 20% 이상)를 생성합니다. 하지만 대부분의 사람들이 기본값으로 사용할 것으로 생각하여 해당 컴파일러를 선택했습니다.

![RaspberryPi5CPUPerformance_1](/assets/img/2024-06-20-RaspberryPi5CPUPerformance_1.png)

![RaspberryPi5CPUPerformance_2](/assets/img/2024-06-20-RaspberryPi5CPUPerformance_2.png)

Raspberry Pi 5는 이전 Pi 버전보다 상당히 빠릅니다. 이를 통해 많은 새로운 Pi 솔루션이 가능해질 것으로 기대됩니다. 기대되는 결과물이 무엇인지 기대됩니다.

<div class="content-ad"></div>

벤치마크 결과에 대한 몇 가지 참고 사항:

- 모든 시간은 틱택토에서 이기지 못 한 것을 증명하는 한 번의 반복에 대한 밀리초로 표시됩니다.
- Pi 5에 대해 5볼트 3암프 어댑터를 사용했습니다. 이 기기는 5볼트 5암프를 요구하며 제 어댑터로 화면의 알림 영역에 "저전압" 오류가 표시됩니다. 공식 어댑터는 Pi 5 공급 업체에서 구할 수 있지만 현재는 드물습니다. 그리고 5암프를 전달하는 일반 어댑터를 쉽게 찾을 수 없었습니다. 제 집에 있는 열두 개의 USB 어댑터는 모두 5V에서 1에서 3 암프를 제공합니다. 낮은 전력 어댑터를 인식하면 Pi 5가 언더클럭될 수 있기 때문에 실제 어댑터를 사용하면 벤치마크 시간이 개선될 수 있습니다. 업데이트: 공식 Pi 5 어댑터는 5.1V에서 5암프입니다. 이 어댑터를 사용하면 더 이상 "저전압" 경고를 받지 않습니다. 싱글 코어 성능은 동일하지만 3코어 성능은 11% 이상 향상되었습니다. 이를 반영하기 위해 위의 표에 새 열을 추가했습니다.
- Pi 5는 Apple M1보다 두 배 정도 느립니다. 실제로 아주 빠릅니다.
- 위에서 언급한 대로, AMD64용 Microsoft C++ 컴파일러는 clang과 Gnu 컴파일러보다 나쁩니다. 그러나 Arm64에 대한 성능 차이는 훨씬 더 커집니다. Microsoft/Qualcomm SQ3는 Arm64 어셈블러 코드를 M1과 대략 같은 속도로 실행하지만 C++ 앱은 현격히 느립니다. 이로 인해 Pi 5는 CPU가 덜 강력함에도 불구하고 윈도우 기기와 경쟁력이 높아졌습니다.
- Intel i7-4770K는 Pi 5보다 10년 더 오래되었지만 Microsoft의 더 느린 컴파일러에도 불구하고 더 나은 성능을 발휘합니다.
- 표에는 RVOS 에뮬레이터가 중첩된 버전을 실행하는 런타임이 나와있습니다. 여기서 Pi 5는 64비트 CPU를 32비트 기계에서 에뮬레이션하는 것이 비용이 많이 들기 때문에 이전 Pi 모델들보다 훨씬 우수한 성능을 보여줍니다. 64비트 OS가 탑재된 Pi 4는 32비트 OS보다 성능이 향상될 것이라고 생각합니다.

이러한 벤치마크는 제게 중요한 시나리오에 대한 성능을 반영하며, Pi 5가 이전 버전보다 훨씬 빠르다는 것을 명백하게 보여줍니다. 이제 더 나은 전원 공급원을 찾아봐야겠어요.

(참고: 틱택토 구현의 소스 코드는 https://github.com/davidly/ttt 에 있습니다. 에뮬레이터 코드는 https://github.com/davidly/ntvao, https://github.com/davidly/ntvcm, https://github.com/davidly/ntvdm, https://github.com/davidly/rvos 에서 찾을 수 있습니다.)

<div class="content-ad"></div>

(참고 2: 1970년대에 라디오 샥에서 구입한 부품들로 TTL 칩으로 만든 프로젝트에 전원을 공급하기 위해 5V 전원 공급기를 제작했습니다. 50년 후에 다시 5V 전원 공급기를 만들어야 할 것 같네요.)

(참고 3: Anker USB 전원 공급기를 구입했는데, 5V를 4.5A로 공급할 수 있습니다. 그런데 라즈베리 파이 5에서 여전히 "저전압 경고" 알림이 표시되며 성능이 크게 향상되지 않습니다.)

(참고 4: 라즈베리 파이 5에서 어셈블리 앱의 Arm32 버전을 실행했습니다. 1개와 3개의 스레드에 대한 시간은 각각 0.0919 및 0.0407입니다. Arm32는 Arm64보다 레지스터가 적기 때문에 느립니다만, 여전히 라즈베리 파이 4보다 약 2배 빠릅니다.)