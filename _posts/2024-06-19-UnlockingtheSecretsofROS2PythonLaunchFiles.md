---
title: "ROS 2 Python 런치 파일의 비밀을 해제합니다"
description: ""
coverImage: "/assets/img/2024-06-19-UnlockingtheSecretsofROS2PythonLaunchFiles_0.png"
date: 2024-06-19 06:19
ogImage: 
  url: /assets/img/2024-06-19-UnlockingtheSecretsofROS2PythonLaunchFiles_0.png
tag: Tech
originalTitle: "Unlocking the Secrets of ROS 2 Python Launch Files"
link: "https://medium.com/@cullensun/unlocking-the-secrets-of-ros-2-python-launch-files-cd8e9f03c629"
---


![2024-06-19-UnlockingtheSecretsofROS2PythonLaunchFiles_0.png](/assets/img/2024-06-19-UnlockingtheSecretsofROS2PythonLaunchFiles_0.png)

안녕하세요! ROS 2는 로봇 소프트웨어를 간단하게 만들어주는 강력한 프레임워크와 도구입니다. cartographer_ros, navigation2, ros2_control 등 다양한 유용한 패키지들을 통해 로봇 엔지니어들은 로봇을 자율적으로 움직이도록 빠르게 구현할 수 있습니다.

로봇 소프트웨어를 배우는 초기 단계에서 개발자들은 종종 런치 파일을 작성하는 데 많은 시간을 투자합니다. 이 파일들은 준비된 패키지의 프로세스(Ros 2 노드)를 시작하는 데 사용됩니다. 처음에는 모바일 앱과 같이 로직을 많이 작성하지 않는다는 점이 조금 이상하게 느껴졌습니다. 로봇을 위한 소프트웨어를 작성하는 개념을 이해하는 데 시간이 걸렸죠.

특히, Python 런치 파일을 작성하는 것은 일반적인 Python 프로그래밍과는 다르기 때문에 조금 까다로울 수 있습니다. 그래서 이 글을 쓰게 되었습니다. 함께 런치 파일에 혼동을 겪고 계신 분들을 위해 몇 가지 팁을 공유하고 싶기 때문이죠.

<div class="content-ad"></div>

## DeclareLaunchArgument 및 LaunchConfiguration

TurtleBot3 로봇 런치 파일에서 추출된 DeclareLaunchArgument 및 LaunchConfiguration 예제를 볼 수 있습니다:

```js
use_sim_time = LaunchConfiguration('use_sim_time', default='false')
…
DeclareLaunchArgument(
    'use_sim_time',
    default_value=use_sim_time,
    description='true이면 시뮬레이션 (Gazebo) 시계 사용'
)
```

초보자로서, 두 요소 간의 관계를 종종 잊어버리곤 합니다. 또한 LaunchConfiguration과 DeclareLaunchArgument 생성자는 default 또는 default_value 매개변수를 지원하며, 이는 매우 혼란스러울 수 있습니다.

<div class="content-ad"></div>

위 정의는 ROS 2의 공식 문서에서 발췌되었습니다. **굵게 표시한** 단어에 주목해 주시면 단어의 사용법을 이해하는 데 도움이 됩니다.

여러 번 읽은 후에 그것들은 쌍으로 사용되어야 한다는 것을 깨달았어요. 항상 함께 작성하는 것이 좋은 실천 방법이라고 생각해요. Mini Pupper bringup 런치 파일의 예시에서 보여주는 것처럼요:

```js
use_sim_time = LaunchConfiguration('use_sim_time')
use_sim_time_launch_arg = DeclareLaunchArgument(
    name='use_sim_time',
    default_value='False',
    description='Use simulation (Gazebo) clock if true'
)

hardware_connected = LaunchConfiguration("hardware_connected")
hardware_connected_launch_arg = DeclareLaunchArgument(
    name='hardware_connected',
    default_value='True',
    description='Set to true if connected to a physical robot'
)
```

이렇게 함께 묶으면 코드가 깔끔하고 명확하게 보이죠. LaunchConfiguration 생성자는 실제로 기본 매개변수를 수용하지만, 사용을 권하지 않습니다. 우리는 LaunchConfiguration에서는 설정된 기본 값을 사용하지 말아야 하며, DeclareLaunchArgument에서만 기본 값을 설정해야 해요. LaunchConfiguration은 런치 파일 내에서 값을 사용하기 위해 런치 인자의 값을 획득하는 데 사용됩니다.

<div class="content-ad"></div>

## 콘솔에 대체값 출력하는 방법

소프트웨어 엔지니어로서, 코드를 디버깅하는 일이 종종 필요합니다. 지금까지 실행 중에 런치 파일에서 중단점을 설정하고 변수 값들을 살펴볼 수 있는 IDE는 없다고 알고 있습니다. 디버깅 방법 중 하나는 콘솔에 일부 정보를 로깅(출력)하는 것입니다.

Python의 print 함수를 사용하면 문자열과 같은 원래 변수를 쉽게 출력할 수 있습니다. 그러나 ROS 2 런치 파일에서 Substitution이라는 특수 유형의 변수를 처리하는 경우가 많습니다. 아래는 ROS 2 공식 문서에서 복사한 정의입니다.

LaunchConfiguration, PathJoinSubstitution 또는 PythonExpression과 같은 종류의 Substitution을 로깅하려면 launch.actions.LogInfo를 사용해야 합니다. rviz2를 위한 런치 파일 예시에서 변수 rviz_config_path의 정확한 값을 알고 싶은 경우를 살펴봅니다:

<div class="content-ad"></div>

```js
import launch
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare
from launch_ros.actions import Node
from launch.actions import LogInfo

def generate_launch_description():
    description_package = FindPackageShare('mini_pupper_description')

    rviz_config_path = PathJoinSubstitution(
        [description_package, 'rviz', 'urdf_viewer.rviz']
    )

    a = "Mini Pupper"
    b = "has 4 legs"
    sentence = a + " " + b
    print(sentence)

    return launch.LaunchDescription([
       Node(
            package="rviz2",
            namespace="",
            executable="rviz2",
            name="rviz2",
            arguments=["-d", rviz_config_path]
        ),
        LogInfo(msg='rviz_config_path is'),
        LogInfo(msg=rviz_config_path)
    ])
```

LogInfo를 사용하면 콘솔 출력이 아래와 같이 됩니다. "urdf_viewer.rviz" 파일의 정확한 위치를 명확하게 확인할 수 있습니다. 참고로, 일반적인 Python 문자열 유형인 "sentence" 변수는 Python의 print 함수를 사용하여 쉽게 인쇄되었습니다.

```js
cullensun@ubuntu:~/ros2_ws$ ros2 launch mini_pupper_bringup rviz.launch.py
[INFO] [launch]: All log files can be found below /home/cullensun/.ros/log/2024-06-18-00-34-07-704969-ubuntu-7389
[INFO] [launch]: Default logging verbosity is set to INFO
Mini Pupper has 4 legs
[INFO] [launch.user]: rviz_config_path is
[INFO] [launch.user]: /home/cullensun/ros2_ws/install/mini_pupper_description/share/mini_pupper_description/rviz/urdf_viewer.rviz
[INFO] [rviz2-1]: process started with pid [7390]
```

## 결론


<div class="content-ad"></div>

이 기사는 ROS 2 Python 런치 파일 작성의 까다로운 측면 중 일부를 탐색했는데, 특히 DeclareLaunchArgument와 LaunchConfiguration에 초점을 맞추고, 디버깅 목적으로 콘솔에 대체 값을 인쇄하는 방법을 다뤘습니다. 이러한 개념을 이해하는 것은 서로 다른 시나리오에 쉽게 적용할 수 있는 견고하고 유연한 런치 파일을 작성하는 데 중요합니다.

DeclareLaunchArgument와 LaunchConfiguration 쌍을 사용하면 명확하고 조직적인 런치 파일을 보장할 수 있습니다. 또한 launch.actions.LogInfo를 활용하면 대체 값을 콘솔에 인쇄하여 디버깅을 지원하고 런치 파일의 동작을 이해하는 데 도움을 줍니다.

ROS 2와 함께하는 여정을 계속하면서, 런치 파일은 로봇 응용 프로그램을 관리하는 강력한 도구임을 기억해주세요. 이러한 기술을 숙달함으로써 더 효율적이고 유지 보수가 용이한 런치 파일을 작성하여 개발 프로세스를 보다 원활하고 즐거운 경험으로 만들 수 있습니다.