---
title: "안디노 만들기 - 오픈 소스 로봇 2부 하드웨어 조립 및 테스트 방법"
description: ""
coverImage: "/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_0.png"
date: 2024-06-22 18:34
ogImage: 
  url: /assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_0.png
tag: Tech
originalTitle: "Building Andino — Open source robot Part 2 Hardware Assembly , Testing"
link: "https://medium.com/@robofoundry/building-andino-open-source-robot-part-2-hardware-assembly-testing-fcd26028031d"
---


이전 글에서는 호스트 컴퓨터 및 RPi를 설정하여 시뮬레이션 모드에서 로봇을 실행할 수 있는지 확인했습니다. 이번 글에서는 안디노 로봇의 하드웨어 구성에 중점을 두겠습니다. 안디노 로봇 하드웨어의 GitHub 저장소에는 상당히 좋은 다이어그램과 부품 목록이 있지만, 모든 것을 어떻게 조립하거나 조립하는 방법에 대한 구체적인 내용은 제공되지 않습니다. 또한 연결 다이어그램은 매우 고수준이며, 로봇을 처음으로 만들어 보는 사람들에게는 매우 혼란스러울 것입니다.

안디노 로봇의 하드웨어 구성에 필요한 부자재 목록 및 일부 수정과 코멘트:

- Raspberry Pi 4 B (4 Gb)
- Chassis 2 x Print 3d Chassis 또는 GitHub 저장소에서 추천하는 WheelsRobot Smart Car Kit과 같은 제품을 구입할 수 있습니다. 여기는 DFRobot 모터를 사용하는 내가 수정한 버전의 샤시 플레이트 STL 파일 링크입니다. 이 모터는 L-Shape DFRobot 모터를 사용합니다.
- 모터 2 x Hobby Motor with Encoder. 정밀도와 신뢰성을 높이기 위해 임베디드 인코더가 권장됩니다. 이미 가지고 있었기 때문에 GitHub 저장소에서 추천한 모터 대신 DFRobot 모터를 사용했습니다. 이 모터는 내장된 인코더가 장착되어 있습니다. 이들은 L-Shape과 I-Shape이 있으며, L-Shape를 사용했으며, 이에 따라 샤시 플레이트를 재설계해야 했습니다.
- Arduino Uno
- 모터 드라이버 L298N 듀얼 H 브릿지
- RPLidar A1M8
- Raspi Camera Module V2, 8 MP
- Powerbank 5V — 어느 파워뱅크든 적합합니다. 크기/무게/출력 전류에 주의하세요(≥2A). RPi용 파워뱅크와 6V 정도의 전원을 공급할 4xAA 배터리 홀더를 사용했습니다. 이렇게 하면 RPi와 모터에 전원을 분리하여 모터가 배터리 전원을 많이 소비할 경우 RPi에 브라운아웃을 유발하지 않습니다.
- (옵션) 파워 스텝 업 DC — 모터가 5V보다 높은 전압을 지원하는 경우(예: 9V로 스탭업) 파워 뱅크(5V)와 모터 드라이버 사이에 추가할 수 있습니다.
- 고정 및 장착 — M3 볼트/고정부품 — M3 스페이서 — SBC용 M2.5/2.0 볼트/고정부품
- 다양한 길이의 스탠드오프

게다가 몇 가지 더 필요한 것이 있을 수 있습니다.

<div class="content-ad"></div>

- 다양한 조합의 추가 디유폰트 와이어(수컷-수컷, 수컷-수메스 또는 수메스-수메스)가 함께 제공됩니다. 연결 방식에 따라 선택하세요.
- 두 베이스 플레이트 사이의 높이를 늘리기 위해 추가 스탠드오프가 필요할 수 있습니다. 이렇게 하면 다양한 보드에서 튀어나오는 디유폰트 와이어가 들어갈 공간이 확보됩니다.
- 베이스 플레이트에 배터리가 꽉 조이도록 하려면 이와 같은 벨크로 타이 또는 실리콘 타이가 필요할 수 있습니다.
- 우리는 단순함을 유지하기 위해 디유폰트 와이어와 나사 터미널을 사용하여 배선을 하고 있지만, 솔더링에 능숙하다면 더 많은 퍼마 보드를 사용하고 와이어를 솔더링할 수 있습니다. 저는 솔더링에 능숙하지 않아서 여러 연결점을 솔더링하는 대신 PCB를 제작하고 인쇄해야 한다고 생각합니다.

## 조립 및 테스트를 위한 고수준 계획

기본적인 조립은 다음과 같은 고수준 단계로 진행됩니다:

- 하단 샤시 플레이트 — 모터를 하단 샤시 플레이트 아래에 부착합니다.
- RPi4, L298N 및 Arduino UNO를 하단 샤시 플레이트 위에 설치합니다. UNO의 경우 케이스를 직접 샤시에 부착하는 대신 케이스를 사용하여 홀 패턴을 일관성 있게 만들었습니다. 링크는 사실 SCAD 파일이므로 OpenSCAD를 설치하고 STL 파일을 내보내어야 합니다.
- 상단 샤시 플레이트를 높은 스탠드오프를 사용하여 부착하여 모든 구성 요소의 높이를 맞추고, 디유폰트 와이어에 추가 공간을 제공합니다.
- RPLidar, RPi 카메라, RPi 배터리 및 모터 배터리를 상단 샤시 플레이트 위에 부착합니다.

<div class="content-ad"></div>

저희 제품의 각 층에 구성 요소를 부착하시는 경우, 아래 배선도에 따라 전선 연결을 시작하는 것이 좋습니다.

Top chassis plate를 추가하기 전에 다음 사항들이 작동하는지 확인할 때까지 모든 테스트를 실행하는 것을 강력히 권장합니다:

- Arduino를 호스트 컴퓨터에 직접 연결하면 Arduino 프로그램을 모터 컨트롤러용으로 업로드하고 테스트할 수 있습니다. Arduino UNO에 직접 시리얼 명령을 사용하여 모터를 구동할 수 있도록 확인
- 그 다음 RPi 및 Arduino UNO를 연결하고 호스트 컴퓨터가 아닌 RPi에서 직접 시리얼 명령 테스트를 반복할 수 있는지 확인
- 마지막으로 ROS2를 사용하여 조이스틱 제어로 모터를 구동할 수 있는지 확인

이 시점에서 Top chassis plate를 추가하고 RPLidar, RPi Camera를 부착하고 두 배터리를 설치할 수 있습니다. 이제 로봇을 케이블에 묶이지 않은 이동식으로 테스트할 수 있습니다.

<div class="content-ad"></div>

이 시점에서 실제로 이러한 일들을 시도해볼 수 있습니다:

- 조이스틱을 사용하여 배터리로 구동되는 로봇을 방 안을 주행시키기
- 주변을 매핑하기 시작하고 실제로 지도를 저장할 SLAM 실행
- 생성된 지도를 사용하여 장애물을 피하면서 Nav2를 기반으로 한 자율 주행 실행

## 조립 지시서 및 사진

Andino 로봇을 조립하려고 할 때, DFRobot의 나만의 L-Shape 모터와 그림 레포지토리의 Andino 챠시를 사용할 것을 알고 있었지만 그것은 내게 적합하지 않았습니다. 그래서 나는 FreeCAD를 사용하여 전체 챠시 플레이트를 처음부터 만들었고 이 STL 파일들을 내 Andino git 레포지토리의 내 분기에 추가할 것입니다. 또한, 어떤 구성 요소를 어디에 장착해야 하는지 식별하는 것이 어려워서, 다음 다이어그램에서 각 구성 요소에 대한 구멍을 색상 코드로 표시했습니다. 이렇게 하면 특정 구성 요소를 어디에 장착해야 하는지 따라갈 누군가에게 편리할 것입니다.

<div class="content-ad"></div>

잊지 말아야 할 몇 가지 추가 지점

- 상단 및 하단 샤시 플레이트는 동일하며, 서로 분리되어있는 많은 스탠드오프로 구별된 같은 플레이트가 두 번 인쇄된 것입니다.
- UNO는 매우 이상한 부착 패턴을 가지고 있어서 원래 CAD 디자인에서 구축했지만, 더 직사각형 모양의 구멍 패턴이 있는 무료로 제공되는 UNO 홀더를 사용하여 결정하여 이 Chassis에 그 플레이트를 설치하기 전에 UNO 베이스 플레이트를 3D로 출력해야 합니다. 여기서 디자인 파일을 다운로드하고 OpenSCAD를 설치하여 직접 STL 파일을 생성할 수 있습니다.
- RPLidar의 경우, 리다가 어느 방향을 향하고 있는지를 모르기 때문에 먼저 이중 홀 패턴을 만들었으므로 큰 회전 실린더가 로봇의 전방 둥근 부분을 향하고 작은 풀리가 로봇의 뒷면을 향하도록 하는 패턴을 사용할 수 있습니다.
- 뒷면의 슬롯은 RPi와 모터의 배터리를 고정하기 위해 벨크로 스트랩이나 집게띠를 통과시킬 수 있도록 제공됩니다.
- 사용한 캐스터 휠은 주 휠보다 약간 짧았기 때문에 로봇 샤시가 수평으로 유지되도록 캐스터 휠의 높이를 조정하기 위해 스페이서를 3D로 출력해야 했습니다. 이것은 좋지만, 3D 프린트를 하기 싫다면 나사 구멍이 뚫린 목재 조각을 사용하여 높이를 조절할 수 있습니다.
- RPi 카메라는 PiHut에서 구입했으며, RPi 카메라를 설치하기 위한 마운팅 플레이트도 구입했습니다. 정면의 샤시에 그 마운트를 부착하기 위해 두 구멍이 있는 작은 조각을 인쇄해야 했습니다. 이를 달성하기 위해 나사 구멍이 있는 목재 조각이나 플렉시 글라스 조각을 사용할 수 있습니다.

아래 두 이미지는 여러 구성 요소의 부착 홀을 보여줍니다. 이미지는 상단과 하단 샤시 플레이트를 나타내는 것이 아니며, 각각의 마운팅 홀을 명확히 표시하기 위해 두 개의 별도 이미지로 표시됩니다. 상단 및 하단 플레이트는 동일한 사본이며, 위에 설명된 대로 반드시 설치해야합니다. 다시 말해, 이것은 제가 시도한 것이 잘 작동했던 것이고 가이드라인이며, 모든 구성 요소를 플레이트에 부착하고 로봇이 균형을 잘 유지할 수 있다면 그게 중요한 부분입니다.

<img src="/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_0.png" />

<div class="content-ad"></div>

바텀 샤시 플레이트 위에 구성 요소를 기계적으로 설치한 후, 즉 모터, RPi, L298N, 그리고 아두이노 UNO를 설치한 후에는 배선도와 아래 표를 따라서 모든 구성 요소가 올바르게 연결되었는지 확인하세요.

아래에서 제안된 핀 번호를 사용하는 경우, andino_firmware/src/hw.h 파일을 업데이트하여 사용된 핀 번호와 일치시키는 것이 좋습니다.

또 다른 기억할 점은, 모터를 3초 이상 테스트하고 있다면, constants.h 파일에서 정의된 3000 밀리초 제한 시간 상수인 kAutoStopWindow 때문에 모터가 멈출 수 있습니다. 테스트 중에 충분한 시간을 확보할 수 있도록 나는 테스트 중에 30000으로 변경했습니다.

## 배선도

<div class="content-ad"></div>

![Building Andino Opensource Robot](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_1.png)

## Wiring Table

I used different pin numbers than specified in the Andino repository, as these pins worked for me. However, you can easily change them in the header file of Andino hardware if you decide to use different pin numbers.

![Building Andino Opensource Robot](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_2.png)

<div class="content-ad"></div>

조립 중인 사진들

![image1](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_3.png)

![image2](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_4.png)

![image3](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_5.png)

<div class="content-ad"></div>


![Image 6](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_6.png)

![Image 7](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_7.png)

## 독립 모드에서 모터 테스트 [Arduino 직접 제어]

호스트 컴퓨터 [노트북이나 데스크탑]을 USB 케이블을 사용하여 아두이노 UNO에 연결하세요. 그리고 아두이노 UNO에 andino_firmware를 업로드했는지 확인해주세요.


<div class="content-ad"></div>

가장 간단한 방법은 플랫폼IO 명령줄 버전을 설치하는 것입니다. [아두이노 IDE를 사용하여 동일한 작업을 수행할 수도 있습니다].

플랫폼IO를 설치했다고 가정하고, 아니라면 여기에 있는 단계를 따르세요. 그리고ino_firmware/src/constants.h 안의 Constants.h 헤더 파일에 정의된 보레이트를 확인해보세요. Andino 저장소에는 57600으로 설정되어 있습니다 [연결을 시작할 때 나중에 명령에서 동일한 보레이트를 사용하도록하세요].

아두이노 UNO가 호스트 컴퓨터에 연결되어 있는 경우 아래 명령을 실행하세요.

```bash
# 터미널을 열고, andino_robot_ws/src/andino/andino_firmware 폴더로 이동하세요.

# 다음 명령을 실행하여 andino_firmware를 아두이노 UNO에 업로드하세요.
pio run --target upload -e uno

# 업로드 성공 메시지를 본 후에 다음 명령을 실행하여 연결하세요.
pio device monitor -p /dev/ttyACM0 -b 57600

# 이것은 시작하여 직렬 명령을 입력할 수 있는 프롬프트를 보여줍니다.

# 엔코더 읽기
e [ENTER]

# 모터를 700 틱/초로 전진시키기
m 700 700

# 모터 정지
m 0 0

# 모터를 후진시키기
m -700 -700

# 모터 정지
m 0 0
```



<div class="content-ad"></div>

두 모터의 회전 방향을 확인해야 합니다. 모터의 방향이 올바르지 않은 경우, M1 또는 M2 모터의 IN 핀을 교환하여 수정할 수 있습니다. 두 모터가 동일한 방향으로 이동할 때 엔코더 값 부호 [+ 또는 -]가 동일하지 않으면, 해당 모터의 엔코더 핀 [채널 A 및 B]을 교환하여 전진할 때 부호가 +이고 후진할 때 부호가 -가 되도록 설정할 수 있습니다.

모터의 틱 속도 측정:

각 바퀴에 유사한 위치에 테이프를 붙입니다. 모터가 아두이노에 연결되어 있고 멈춰있는지 확인하세요 [엔코더가 전원에 연결되어 있는지 확인하세요].

아래 두 명령어를 시리얼 모니터를 통해 아두이노 UNO에 전송해야 합니다:

<div class="content-ad"></div>

테이블 태그를 다음과 같이 마크다운 형식으로 변경해주세요.

|r|
|---|
|e|
|r — 해당 명령은 인코더를 재설정하고, e — 해당 명령은 즉시 바로 실행하여 현재 값을 0 0으로 출력합니다. 이것이 우리가 원하는 바입니다.

이제, 한 번에 한 바퀴씩 바퀴를 대략적으로 10번 회전해주세요.

<div class="content-ad"></div>

그런 다음 명령 `e`을 다시 실행하고 각 바퀴에 대한 값들을 기록하세요. 각 바퀴에 대한 틱 수를 구하기 위해 마지막 틱수를 10으로 나누세요. 이제 각 모터의 초당 틱 수를 얻을 수 있습니다. 모터 명세서를 참고하여 초당 틱 수를 구할 수도 있습니다. [또는 광학적 RPM 측정기를 이용하여 모터 속도를 측정하고 틱 당 회전수에 분당 회전수를 곱할 수 있습니다.] 이렇게 계산하세요:

tpr [틱 당 회전수] — DFRobot에서 제시된 명세서에 따르면 1회전 당 960틱

rpm [모터의 회전수] — DFRobot에서 제시된 명세서에 따르면 160 rpm

초당 틱 수 = (tpr * rpm)/60 = (960 * 160)/60 = 2560 틱/초 최대

<div class="content-ad"></div>

Andino 리포지토리의 루트 디렉토리에서 RPi에서 모터를 테스트할 때 최대 틱 수를 사용하는 m 명령을 사용할 수 있습니다.

## 스탠드얼론 모드에서 모터 테스트 [RPi로부터]

이제 Arduino 시리얼 모니터 명령을 사용하여 모터를 직접 실행하는 모터 컨트롤러를 테스트했으므로, Raspberry Pi가 Arduino에 연결된 상태에서 동일한 테스트를 반복할 수 있습니다. 호스트 컴퓨터와 RPi의 USB 포트 사이에 연결된 USB 케이블을 제거하고 Arduino UNO 사이에 연결하세요. 그리고 다음 단계를 따르세요:

RPi의 Andino 리포지토리 루트 디렉토리에 있을 때 ROS2 워크스페이스를 빌드하고 소스를 만드십시오.

<div class="content-ad"></div>

참고: 안디노 레포에 문서화된대로 "o" 명령어를 시도해 보았지만 어떤 이유로 인해 작동하지 않아서 "m" 명령어를 계속 사용하고 있습니다.

터미널에서 다음 명령어를 실행하여 RPi에 연결된 모터를 테스트하세요.

```js
colcon build
source install/setup.bash
```

```js
# 1. 양 모터의 현재 엔코더 판독 값을 얻기
motor_driver_demo --serial_port=/dev/ttyACM0 --msg='e'

# 결과는 다음과 유사할 것입니다
모터 드라이버가 연결되어 있습니다: True
마이크로컨트롤러가 준비되기까지 2초 기다립니다...
메시지 전송: e
응답: 0 0

# 2. 모터를 지정된 틱 수(예: 700)로 전진 방향으로 이동시키기
motor_driver_demo --serial_port=/dev/ttyACM0 --msg='m 700 700'

# 3. 모터 정지 
motor_driver_demo --serial_port=/dev/ttyACM0 --msg='m 0 0'

# 4. 모터를 지정된 틱 수(예: -700)로 후진 방향으로 이동시키기
motor_driver_demo --serial_port=/dev/ttyACM0 --msg='m -700 -700'

# 5. 모터 정지 
motor_driver_demo --serial_port=/dev/ttyACM0 --msg='m 0 0'
```

<div class="content-ad"></div>

## ROS2와 조이스틱으로 모터 테스트하기

로봇을 안전하게 테스트하기 위해 지면에 바퀴가 닿지 않은 채로 조이스틱을 사용하여 로봇을 테스트하고자 합니다. 조이스틱을 사용하여 원격으로 바퀴를 제어할 수 있는지 확인하려면 RPi에서 아래와 같이 설명된 명령을 실행해야 합니다. 여기서 가정은 조이스틱 컨트롤러의 USB 키포트 중 하나에 조이스틱을 연결하고 해당 조이스틱이 블로그 게시물에서 설명된 프로세스를 사용하여 joy 명령을 생성하는지 테스트했다는 것입니다.

```js
cd andino_ws

colcon build

# RPi 터미널 창 1에서
source install/setup.bash
ros2 launch andino_bringup andino_robot.launch.py include_rplidar:=false include_camera:=false

# RPi 터미널 창 2에서
source install/setup.bash
ros2 launch andino_bringup teleop_joystick.launch.py

# 호스트 컴퓨터에서 호스트 컴퓨터에서 rqt를 실행하여 모든 노드의 노드 그래프를 확인할 수도 있습니다
rqt&
```

rqt 그래프는 다음과 같이 보일 것입니다:

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-22-BuildingAndinoOpensourcerobotPart2HardwareAssemblyTesting_8.png)

위에서 보듯이 twist_mux는 teleop_twist, teleop_keyboard 및 Nav2를 통해 직접 cmd_vel 토픽에서 입력을 받을 수 있습니다. 또한 어떤 명령이 최종 cmd_vel 토픽으로 보내질지를 우선 순위를 정할 수 있습니다.

여기에는 로봇이 서 있는 상태로 움직이는 동영상도 있습니다:

다음 기사에서는 이번 단계가 끝나면 로봇을 이동하고 SLAM 및 Nav2를 시도해 볼 것입니다.

<div class="content-ad"></div>

즐거운 빌딩하세요!!!

## 참고 자료

[PlatformIO 설치 방법](https://docs.platformio.org/en/stable/core/installation/methods/installer-script.html#super-quick-macos-linux)