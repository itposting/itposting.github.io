---
title: "파이썬으로 간단한 ROS2 장애물 회피 로봇 만들기 방법"
description: ""
coverImage: "/assets/img/2024-06-23-BuildingaSimpleROS2ObjectAvoidanceRobotusingPython_0.png"
date: 2024-06-23 18:23
ogImage: 
  url: /assets/img/2024-06-23-BuildingaSimpleROS2ObjectAvoidanceRobotusingPython_0.png
tag: Tech
originalTitle: "Building a Simple ROS2 Object Avoidance Robot using Python"
link: "https://medium.com/@kabilankb2003/building-a-simple-ros2-object-avoidance-robot-using-python-962f5b8485d7"
---


<img src="/assets/img/2024-06-23-BuildingaSimpleROS2ObjectAvoidanceRobotusingPython_0.png" />

이 튜토리얼에서는 ROS2 (로봇 운영 시스템 2) 및 Python을 사용하여 간단한 물체 회피 로봇을 구축할 것입니다. 이 로봇은 장애물을 감지하기 위해 LIDAR 센서를 사용하고, 이동을 조정하여 주변을 피해 이동합니다. 이 프로젝트는 ROS2를 시작하는 좋은 방법이며, 센서를 사용하고 로봇의 이동을 제어하는 방법을 배우는 데 도움이 될 것입니다.

# 준비물

시작하기 전에 다음을 갖추고 있는지 확인하세요:

<div class="content-ad"></div>

- ROS2 설치 (Foxy, Galactic 또는 그 이후 버전).
- Python 프로그래밍에 대한 기본 지식.
- ROS2를 사용하여 제어되는 LIDAR 센서가 장착된 시뮬레이션된 또는 실제 로봇.

# 프로젝트 개요

우리 프로젝트의 주요 구성 요소는 다음과 같습니다:

- LIDAR 센서: 로봇 주변의 장애물을 감지하는 데 사용됩니다.
- LaserScan 메시지: LIDAR에서의 거리 데이터를 포함하는 ROS 메시지 유형.
- Twist 메시지: 로봇의 선형 및 각속도를 제어하는 ROS 메시지 유형.
- 노드: LIDAR 데이터를 구독하고 속도 명령을 게시하는 ROS2 노드.

<div class="content-ad"></div>

# 코드 설명

아래는 우리의 객체 회피 노드에 대한 완전한 코드입니다:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

class ObjectAvoidanceNode(Node):
    def __init__(self):
        super().__init__('object_avoidance_node')
        self.subscription = self.create_subscription(
            LaserScan,
            'scan',
            self.lidar_callback,
            10)
        self.publisher = self.create_publisher(Twist, 'cmd_vel', 10)
        self.safe_distance = 0.5  # 미터
        self.get_logger().info('Object Avoidance Node Started')

    def lidar_callback(self, msg):
        ranges = msg.ranges
        min_distance = min(ranges)
        
        twist_msg = Twist()

        if min_distance < self.safe_distance:
            # 장애물 감지, 로봇을 회전시킵니다
            twist_msg.linear.x = 0.0
            twist_msg.angular.z = 0.5  # 시계 반대방향으로 회전
        else:
            # 장애물 감지되지 않음, 전진합니다
            twist_msg.linear.x = 0.2
            twist_msg.angular.z = 0.0

        self.publisher.publish(twist_msg)

def main(args=None):
    rclpy.init(args=args)
    node = ObjectAvoidanceNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Keyboard Interrupt (SIGINT)')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

# 코드 설명

<div class="content-ad"></div>

- Imports: 필요한 모듈을 rclpy, sensor_msgs.msg 및 geometry_msgs.msg에서 가져옵니다.
- 노드 초기화: Node를 상속하는 ObjectAvoidanceNode 클래스를 정의합니다. 생성자에서는 LaserScan 메시지를 수신할 /scan 토픽에 대한 구독 및 Twist 메시지를 보낼 /cmd_vel 토픽에 대한 게시자를 설정합니다.
- LIDAR 콜백: lidar_callback 메서드는 수신된 LaserScan 메시지를 처리합니다. LIDAR가 감지한 장애물까지의 최소 거리를 찾습니다. 이 거리가 self.safe_distance(0.5 미터)보다 작으면 로봇은 전진을 멈추고 장애물을 피하기 위해 회전을 시작합니다. 안전 거리 내에 장애물이 없으면 로봇은 전진합니다.
- 명령 게시: 감지된 거리에 따라 Twist 메시지에 적절한 선형 및 각속도를 할당하고 /cmd_vel 토픽으로 게시합니다.
- 메인 함수: 메인 함수는 ROS2 Python 클라이언트 라이브러리를 초기화하고 ObjectAvoidanceNode의 인스턴스를 생성한 다음 (콜백을 처리하며) 스핀을 시작합니다. 노드가 (예: Ctrl+C를 눌러) 중단되면 깔끔하게 종료됩니다.

# 노드 실행

ROS2 환경이 정상적으로 소스로드되고 필요한 토픽 (/scan 및 /cmd_vel)이 사용 가능한지 확인하세요.

<img src="https://miro.medium.com/v2/resize:fit:1400/1*XNR1_8EGSFbgsAnJUJ05FQ.gif" />

<div class="content-ad"></div>

# 결론

이 튜토리얼은 ROS2와 Python을 사용하여 객체 회피 로봇의 기본 프레임워크를 제공합니다. 이 코드를 확장하여 장애물 맵핑, 경로 계획 및 다른 센서 통합과 같은 고급 기능을 구현할 수 있습니다. ROS2의 모듈식 아키텍처와 방대한 커뮤니티 지원으로 로봇 개발에 우수한 선택지입니다. 즐거운 코딩되세요!