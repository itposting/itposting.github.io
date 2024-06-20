---
title: "ROS 2 Humble과 PyTorch로 자세 추정 노드 만들기"
description: ""
coverImage: "/assets/img/2024-06-20-BuildingaPoseEstimationNodewithROS2HumbleandPyTorch_0.png"
date: 2024-06-20 17:48
ogImage: 
  url: /assets/img/2024-06-20-BuildingaPoseEstimationNodewithROS2HumbleandPyTorch_0.png
tag: Tech
originalTitle: "Building a Pose Estimation Node with ROS 2 Humble and PyTorch"
link: "https://medium.com/@kabilankb2003/building-a-pose-estimation-node-with-ros-2-hu-and-pytorch-0d6a4b71f620"
---


<img src="/assets/img/2024-06-20-BuildingaPoseEstimationNodewithROS2HumbleandPyTorch_0.png" />

이 튜토리얼에서는 PyTorch에서 미리 학습된 딥 러닝 모델을 사용하여 실시간 인간 포즈 추정을 위한 ROS 2 노드를 만들겠습니다. 이 노드는 웹캠 이미지를 구독하고 포즈 추정을 수행한 뒤 주석이 달린 이미지를 발행할 것입니다. 구현 세부 내용으로 들어가 봅시다.

## 요구 사항

시작하기 전에 다음이 설치되어 있는지 확인하세요:

<div class="content-ad"></div>

- ROS 2
- Python 3
- PyTorch
- torchvision
- OpenCV
- cv_bridge (ROS 패키지로 ROS와 OpenCV 이미지 간 변환을 위한 것)

모델: keypointrcnn_resnet50_fpn

우리는 torchvision의 keypointrcnn_resnet50_fpn 모델을 사용합니다. 이 모델은 사람 자세 추정을 위해 설계되어 여러 신체 부위의 키포인트를 예측합니다. 여기에 이 모델의 구성 요소가 있습니다:

- ResNet-50 백본: ResNet-50는 특징 추출기로 작용하는 합성곱 신경망입니다. 공간적 계층을 효과적으로 캡처하는 데 알려져 있습니다.
- FPN (Feature Pyramid Network): FPN은 다중 스케일에서 특성 맵을 구축하여 감지 능력을 향상시킵니다.
- Keypoint R-CNN: 이 Faster R-CNN의 변형은 바운딩 박스 외에도 키포인트를 감지하는 데 특화되어 있습니다.

<div class="content-ad"></div>

<img src="https://miro.medium.com/v2/resize:fit:1400/1*LbBdaJJRpnNGRLdKExdzdw.gif" />

자율 이동 로봇(AMR) 및 로보틱스에서 실시간 포즈 추정의 응용

포즈 추정은 로보틱스 분야에서 강력한 도구이며 자율 이동 로봇(AMR)의 성능을 크게 향상시킬 수 있습니다. 실시간 포즈 추정을 통합함으로써 로봇은 상황 인식, 인간과의 상호 작용, 다양한 작업에서의 성능을 향상시킬 수 있습니다. 다음은 주요 응용 분야 몇 가지입니다:

- 협업 로봇 (Cobots)
- 감시 및 보안
- 제조 및 조립 라인
- 내비게이션 및 장애물 회피

<div class="content-ad"></div>

단계별 실행

- 노드 초기화 및 구독

우리는 필요한 라이브러리를 가져오는 것으로 시작합니다. 이에는 ROS 2 Python 클라이언트 라이브러리 (rclpy), ROS 메시지 종류 (Image), 이미지 변환을 위한 CvBridge, 그리고 딥러닝을 위한 PyTorch 및 torchvision이 포함됩니다.

2. 노드 클래스 생성

<div class="content-ad"></div>

PoseEstimationNode 클래스를 정의하고 Node를 상속합니다. 생성자에서는:

- 노드를 pose_estimation_node으로 이름을 지정하여 초기화합니다.
- 이미지를 수신하기 위해 /jetson_webcam 토픽에 구독합니다.
- 이미지_pose 토픽에 주석 처리된 이미지를 게시할 발행자를 만듭니다.
- ROS 및 OpenCV 이미지 간 변환을 위해 CvBridge를 초기화합니다.
- torchvision에서 사전 학습된 자세 추정 모델 keypointrcnn_resnet50_fpn을 평가 모드로 설정하여 로드합니다.
- 이미지를 텐서로 변환하기 위한 변환을 정의합니다.

3. 수신된 이미지 처리

listener_callback 메서드에서 수신된 이미지를 처리합니다.

<div class="content-ad"></div>

- 받은 이미지의 인코딩을 기록합니다.
- CvBridge를 사용하여 이미지를 ROS 형식에서 OpenCV 형식으로 변환하고 다양한 이미지 인코딩을 처리합니다.

4. 포즈 추정

다음으로, OpenCV 이미지를 PIL 이미지로 변환하고 텐서로 변환하기 위한 변환이 적용됩니다. 이 텐서를 모델에 전달하여 예측을 얻고, torch.no_grad()를 사용하여 기울기 계산이 이루어지지 않도록 합니다.

5. 이미지 주석 및 게시

<div class="content-ad"></div>

그런 다음 이미지에서 주요 지점 위치에 원을 그립니다. 이러한 주요 지점은 모델의 예측에서 추출되어 OpenCV로 그리기 위해 numpy 배열로 변환됩니다. 마지막으로 주석이 달린 이미지를 ROS 메시지로 변환하여 발행합니다.

![이미지](/assets/img/2024-06-20-BuildingaPoseEstimationNodewithROS2HumbleandPyTorch_1.png)

6. 노드 실행하기

main 함수는 ROS 2 Python 클라이언트 라이브러리를 초기화하고 노드의 인스턴스를 생성한 다음 종료될 때까지 작동하도록 유지하도록 되어 있습니다. 그 후에는 노드가 제거되고 ROS 2 컨텍스트가 종료됩니다.

<div class="content-ad"></div>


![Building a Pose Estimation Node with ROS 2](/assets/img/2024-06-20-BuildingaPoseEstimationNodewithROS2HumbleandPyTorch_2.png)

# 결론

본 튜토리얼을 따라하면 최신 딥러닝 기법을 사용하여 실시간 포즈 추정이 가능한 견고한 ROS 2 노드를 만들 수 있습니다. 이 설정은 인간-로봇 상호작용 및 감시를 포함한 다양한 로봇 응용 프로그램으로 확장할 수 있습니다.

실시간 포즈 추정은 AMR 및 로봇의 능력에 새로운 차원을 추가하여 인간의 동작 및 자세를 이해하고 반응할 수 있습니다. 이 기능은 인간-로봇 상호작용을 향상시키며 안전성을 향상시키고 로봇이 자율적으로 또는 협업적으로 수행할 수 있는 작업 범위를 확장시킵니다. 기술이 계속 발전함에 따라 로봇학의 다양한 분야에서 더 많은 혁신적인 응용 프로그램이 예상됩니다.


<div class="content-ad"></div>

# NVIDIA Jetson 플랫폼에서 ROS 2 및 인공지능을 이용한 로봇 응용 프로그램 구현

https://developer.nvidia.com/blog/implementing-robotics-applications-with-ros-2-and-ai-on-jetson-platform-2/#ros_2_nodes_for_human_pose_estimation