---
title: "로봇공학 2 Python으로 원격으로 로봇 제어하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-Robotics2ControllingaRobotRemotelywithPython_0.png"
date: 2024-06-22 19:21
ogImage: 
  url: /assets/img/2024-06-22-Robotics2ControllingaRobotRemotelywithPython_0.png
tag: Tech
originalTitle: "Robotics #2: Controlling a Robot Remotely with Python"
link: "https://medium.com/@athicharttangpong/controlling-a-robot-remotely-with-python-4735ed5c2da9"
---


이전 글 "Raspberry Pi 3, GoPiGo3 및 Python으로 로봇 프로그래밍하기"에서 GoPiGo3 로봇을 관리하기 위한 Python 모듈을 소개했습니다. 이번 글에서는 USB 게임패드 및 USB 키보드를 통한 원격 제어를 가능케 하여 로봇의 기능을 확장할 것입니다. 이 업그레이드로 인해 로봇의 움직임을 관리하고 카메라 서보 모터를 제어할 수 있게 됩니다.

먼저, utils/__init__.py 모듈을 살펴봅시다. 이 모듈은 프로젝트를 위한 필수 유틸리티 함수를 포함하고 있습니다.

- 우리 프로그램은 멀티스레드로 작동하며, 이 스레드들은 ThreadBase 클래스에서 파생됩니다. 이 클래스는 주로 스레드를 정상적으로 종료하는 것을 처리합니다.
- 사용자가 Ctrl-C를 누르거나 운영 체제가 종료 신호(SIGTERM 또는 SIGINT)를 보낼 때 올바른 종료를 보장하기 위해, 프로그램은 메인 스레드 시작 시 install_signal_handler()를 호출해야 합니다. 이로써 프로그램이 정상적으로 종료될 수 있게 됩니다.
- 추가로, 우리 프로그램은 Python 로깅 라이브러리를 이용하며, 이는 setup_logging() 함수를 사용하여 구성될 것입니다.

프로젝트의 핵심인 InputMonitor 스레드입니다. 이 스레드는 처음에 모든 연결된 USB 장치를 스캔하여 Logitech USB 게임패드와 USB 키보드를 감지하고 selectors 모듈로 등록할 것입니다. 이 구현은 특정 Logitech 게임패드와 특정 키보드에만 동작할 수 있으므로, 저희가 사용하는 장치에 의존하는 low-level evdev 모듈을 사용합니다. 높은 수준의 pygame과 같은 모듈을 사용한다면 이 제한을 해결할 수 있지만, 저는 Linux 파일 디스크립터와 함께 작동하는 evdev를 선택했습니다. 이는 selectors 모듈을 사용하여 키보드, 게임패드 및 소켓 파일 디스크립터로부터 입력을 다중화하여 적절히 처리할 수 있게 합니다. pygame이 동일한 기능을 제공하는지에 대해 철저히 조사하지는 않았기 때문에, 이 부분은 잠재적인 개선 가능 영역입니다.

<div class="content-ad"></div>

또한 InputMonitor 스레드는 웹 인터페이스에서의 연결을 수신하기 위해 UDP 소켓을 생성합니다. 이 설정을 통해 사용자는 웹 인터페이스를 통해 로봇의 움직임과 Pi 카메라를 조종하기 위해 명령을 제출할 수 있습니다. 다음 글에서 웹 인터페이스를 살펴보겠습니다. 우리의 서버는 한 번에 하나의 연결만 허용하도록 설계되었음을 기억해주세요.

길이가 상당하지만 이 모듈은 상당히 간단합니다. run() 메서드는 주 스레드 루프로 작동하며 선택기 모듈을 사용하여 다양한 입력 장치 간을 다중화합니다. 그런 다음 각 입력 장치에 적합한 핸들러를 디스패치합니다.

마지막으로, 우리의 주 프로그램은 매우 간단합니다. 사용자 입력 및 로봇의 이동을 처리하기 위해 InputMonitor 스레드를 생성합니다. 주 스레드는 주로 SIGTERM 및 SIGINT 신호를 관리하는 무한 루프를 실행할 것입니다.

# 결론

<div class="content-ad"></div>

이 기사에서는 로봇을 제어하는 간단한 프로그램을 구현했습니다. 이 설정을 통해 이제 USB 게임패드나 USB 키보드를 사용하여 로봇을 조종할 수 있습니다. 다음 기사에서는 웹 인터페이스를 통해 원격으로 로봇을 제어하는 방법을 살펴볼 것입니다.