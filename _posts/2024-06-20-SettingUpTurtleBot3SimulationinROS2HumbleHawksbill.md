---
title: "ROS 2 Humble Hawksbill에서 TurtleBot3 시뮬레이션 설정하기"
description: ""
coverImage: "/assets/img/2024-06-20-SettingUpTurtleBot3SimulationinROS2HumbleHawksbill_0.png"
date: 2024-06-20 17:55
ogImage: 
  url: /assets/img/2024-06-20-SettingUpTurtleBot3SimulationinROS2HumbleHawksbill_0.png
tag: Tech
originalTitle: "Setting Up TurtleBot3 Simulation in ROS 2 Humble Hawksbill"
link: "https://medium.com/@nilutpolkashyap/setting-up-turtlebot3-simulation-in-ros-2-humble-hawksbill-70a6fcdaf5de"
---


# 요구 사항 -

a. Ubuntu 22.04 (Jammy Jellyfish)

b. ROS 2 Humble Hawksbill

# 1. ROS 2 환경 변수 설정

<div class="content-ad"></div>

ROS 2 설정 파일을 소스로 가져오면 ROS 2를 실행하는 데 필요한 여러 환경 변수가 설정됩니다.

ROS 2 명령에 액세스하려면 모든 터미널에 다음 명령을 입력하여 ROS2 Humble 환경을 소스화하세요:

```js
source /opt/ros/humble/setup.bash
```

새 쉘을 열 때마다 설정 파일을 소스로 가져오지 않으려면 셸 시작 스크립트에 해당 명령을 추가할 수 있습니다.

<div class="content-ad"></div>

```shell
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
```

이 명령어를 .bashrc 파일에 추가한 후에는 해당 파일을 소스하세요:

```shell
source ~/.bashrc
```

# 2. Gazebo 시뮬레이터 설치하기

<div class="content-ad"></div>

쉘 스크립트에서 다음 명령을 입력하여 Gazebo11과 관련된 ROS 2 메타 패키지를 설치해보세요:

```js
sudo apt install gazebo11
sudo apt install ros-humble-gazebo-ros-pkgs
```

# 3. ROS 2 의존 패키지 설치

3.1. Cartographer

<div class="content-ad"></div>

카토그래퍼는 여러 플랫폼과 센서 구성에서 2D 및 3D 실시간 동시 위치추적 및 매핑(SLAM)을 제공하는 시스템입니다.

ROS 2 Cartographer 패키지를 설치하려면 셸에서 다음 명령을 입력하세요:

```js
sudo apt install ros-humble-cartographer 
sudo apt install ros-humble-cartographer-ros
```

3.2. ROS 2를 위한 네비게이션 스택

<div class="content-ad"></div>

ROS 2 내비게이션 스택은 로봇이 시작 위치에서 목표 위치로 이동하는 데 도움을 주는 패키지 세트입니다.

ROS 2 내비게이션 스택 패키지를 설치하려면 셸에 다음 명령을 입력하세요:

```js
sudo apt install ros-humble-navigation2
sudo apt install ros-humble-nav2-bringup
```

# 4. ROS2 Workspace 생성

<div class="content-ad"></div>

작업 공간은 모든 ROS 2 패키지를 포함하는 디렉토리 세트입니다.

다음 명령어를 입력하여 새 작업 공간 디렉토리를 생성하세요:

```js
mkdir -p ~/turtlebot3_ws/src
```

# 5. Turtlebot3 패키지 설치

<div class="content-ad"></div>

5.1. 워크스페이스의 src 디렉토리 안으로 이동해주세요:

```js
cd ~/turtlebot3_ws/src
```

5.2. Turtlebot3 패키지를 클론해주세요:

```js
git clone https://github.com/ROBOTIS-GIT/turtlebot3_simulations.git -b humble-devel

git clone https://github.com/ROBOTIS-GIT/turtlebot3.git -b humble-devel

git clone https://github.com/ROBOTIS-GIT/turtlebot3_msgs.git -b humble-devel

git clone https://github.com/ROBOTIS-GIT/DynamixelSDK.git -b humble-devel
```

<div class="content-ad"></div>

# 6. 패키지 빌드하기

작업 공간의 루트(turtlebot3_ws)에서 다음 명령을 사용하여 colcon을 이용해 ROS 2 패키지를 빌드하세요.

```js
cd ~/turtlebot3_ws

colcon build 
```

turtlebot3_ws 작업 공간을 소스하세요.

<div class="content-ad"></div>

```js
~/turtlebot3_ws/install/setup.bash
```

## 7. 터틀봇3 가제보 시뮬레이션 실행하기

작업 공간 (turtlebot3_ws) 안으로 이동한 후, 다음 명령을 실행하여 작업 공간을 소스하는 명령을 실행하세요.

```js
~/turtlebot3_ws/install/setup.bash
```

<div class="content-ad"></div>

TurtleBot3에는 버거, 와플, 와플_파이 세 가지 모델이 있습니다. 따라서 사용하기 전에 어떤 모델을 사용할지 설정해야 합니다.

우분투에서 이를 수행하려면 export 명령어를 사용하여 사용할 모델을 지정합니다.

다음과 같이 명령어를 셸에 입력하여 TURTLEBOT3_MODEL을 버거로 .bashrc 파일에 추가합니다. 그 후 .bashrc 파일을 재로드하세요:

```js
echo 'export TURTLEBOT3_MODEL=burger' >> ~/.bashrc
source ~/.bashrc
```

<div class="content-ad"></div>

## 7.1. Gazebo에서 Turtlebot3 시뮬레이션 월드 실행하기

새 셸 창을 열고 turtlebot3 워크스페이스를 소스로 설정하세요:

```js
source ~/turtlebot3_ws/install/setup.bash
```

다음 명령을 입력하여 Turtlebot3 로봇을 TurtleBot3 World에서 실행하세요:

<div class="content-ad"></div>

```js
ros2 launch turtlebot3_gazebo empty_world.launch.py
```

다른 시뮬레이션 런치 파일을 실행하여 시뮬레이션 월드를 변경할 수 있어요:

## TurtleBot3 World:

```js
ros2 launch turtlebot3_gazebo turtlebot3_world.launch.py
```

<div class="content-ad"></div>

## TurtleBot3 집:

```js
ros2 launch turtlebot3_gazebo turtlebot3_house.launch.py
```

## 7.2. Turtlebot3 텔레오퍼레이션 노드 실행하기

새로운 쉘 창을 열고 turtlebot3 workspace에 소스를 입력하세요.

<div class="content-ad"></div>

```js
source ~/turtlebot3_ws/install/setup.bash
```

이 명령어를 사용하여 키보드로 TurtleBot3를 텔레오퍼레이션하려면 다음 명령어로 텔레오퍼레이션 노드를 실행하십시오:

```js
ros2 run turtlebot3_teleop teleop_keyboard
```