---
title: "Gradient Descent 알고리즘과 맞춤형 웨이포인트로 AWS DeepRacer 성능 향상시키는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_0.png"
date: 2024-06-23 18:29
ogImage: 
  url: /assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_0.png
tag: Tech
originalTitle: "Enhancing Your AWS DeepRacer Performance with Gradient Descent Algorithm and Personalized Waypoints"
link: "https://medium.com/@yangkewenvigorous/enhancing-your-aws-deepracer-performance-with-gradient-descent-algorithm-and-personalized-waypoints-2e5db6ceab63"
---


# AWS DeepRacer에 대해

AWS DeepRacer는 Amazon Web Services (AWS)의 흥미로운 프로젝트로, 자율 주행 레이싱의 즐거움과 강화 학습 (RL)의 힘을 시원하게 결합한 것이죠. DeepRacer의 핵심은 RL 분야를 분석하고 민주화하는 데 중점을 둔 포괄적이고 인터랙티브한 플랫폼입니다. 이를 통해 숙련된 개발자부터 초보자까지 RL 분야에 대한 접근성을 높일 수 있습니다.

# 커뮤니티 레이스

DeepRacer 커뮤니티 레이스는 AWS DeepRacer 생태계 내에서 참여자들 간의 커뮤니티와 경쟁 의식을 촉진하기 위해 디자인된 매력적이고 협업적인 프로그램입니다. 이 흥미진진한 프로젝트는 모든 수준의 참가자들을 초대하여 그들의 AI 레이싱 스킬을 겨룰 수 있게 합니다.

<div class="content-ad"></div>

![DeepRacer Performance](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_0.png)

우리 회사의 DeepRacer 경주에 참여한 기회를 가졌는데, 이 경험은 즐겁고 교육적이었습니다. 이 여정을 통해 강화 학습의 세계에 심취하며 자율 주행 레이싱 카를 훈련하는 데 중추적인 역할을 하는 보상 함수(RF)에 대한 깊은 이해를 얻을 수 있었습니다.

저는 경사하강 알고리즘과 코딩을 통해 3바퀴를 24.58초로 완주한 경험을 공유할 예정입니다.

![DeepRacer GIF](https://miro.medium.com/v2/resize:fit:1200/1*7vcRCVvk4TG3Hy_9AzB9KQ.gif)

<div class="content-ad"></div>

# 최적 경로 계획

AWS Invent:2018 트랙 레이스를 위한 나의 모델 훈련은 핵심 작업인 최적 레이싱 경로 계획으로 시작되었습니다. 이 노력에서는 GitHub Repository에서 제시된 방법론에서 영감을 받았습니다. 이 방법론은 경사 하강 알고리즘의 힘을 이용하고 있습니다. 먼저, 저는 아래와 같이 빨간색으로 표시된 상한선과 하한선을 설정하는 데 집중했습니다:

![그림](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_1.png)

그 후 알고리즘의 목표는 자동차의 최적 경로를 계산하는 것이었습니다. 이때의 주요 목표는 트랙의 직선 구간을 최대화하는 것이었습니다. 이 전략적인 접근 방식은 급한 회전을 줄여주어 자동차가 장기간 최대 속도를 유지할 수 있게 합니다.

<div class="content-ad"></div>

다음으로, AWS에서 제공한 미리 정의된 웨이포인트를 계획된 경로 위에 겹쳤습니다.

그로 인해 차량이 가속해야 하는 최적 구간과 회전을 준비하기 위해 감속해야 하는 지역을 명확히 식별할 수 있었습니다. 이 포괄적인 이해는 내 보상 함수 개발의 기초가 되었습니다:

<div class="content-ad"></div>

아래는 경로 계획에 이어 트랙상의 각 인덱스에 적합한 속도를 결정하는 과정이 집중적으로 다루어졌습니다. 최적의 성능을 보장하기 위해 속도 범위는 1.5에서 4.0 사이로 제한했습니다. 특히, U턴 및 중요 지점 근처에서 계산된 속도가 낮아지는 것을 관찰할 수 있는데, 이는 차량이 정밀하게 이 도전적인 섹션을 운행할 수 있도록 도와줍니다.

이 방식을 활용하여 차량의 속도를 다양한 트랙 구간에 맞게 섬세하게 조절할 수 있는 폭넓은 속도 값 범위를 포착했습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_6.png" />

이 속도 범위는 모델 훈련 과정을 가속화하고 향상시키는 데 중요한 역할을 합니다. 당연히 이러한 범위를 조정하여 여러분의 구체적인 트랙과 목표에 맞출 수 있는 유연성이 있습니다. 이렇게 하면 성능을 더욱 향상시킬 수 있습니다.

앞으로 계획된 작업 공간에 대해 자세히 살펴볼 수 있습니다. 각 행은 예상 작업을 나타내며 각 인덱스에 해당합니다 (웨이포인트와 동일함). 이 작업 공간은 [x, y, speed, time]로 표시됩니다. 훈련 중에 "시간" 구성 요소는 안정성이 다소 일관되지 않았기 때문에 크게 사용하지 않았습니다.

이 트랙에 118개의 인덱스가 존재하지만 할당할 수 있는 작업은 단 30개뿐이므로, 속도와 작업 가능성을 더 관리할 수 있는 집합으로 압축하기 위해 클러스터링 접근 방법이 필요했습니다. 이를 위해 K-means 클러스터링 방법을 선택하여 작업을 13개의 구분된 클러스터로 효과적으로 줄였습니다. 이 접근 방법을 통해 모델이 학습하고 레이싱 결정 중에 적용할 수 있는 보다 간결하고 실용적인 작업 집합이 보장되었습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_7.png)

그리고 이것이 이산적인 액션들입니다:

![이미지](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_8.png)

# 모델 훈련


<div class="content-ad"></div>

강화 학습을 탐험하면서, 상대적으로 새로운 개념인데도 불구하고, 그 근본적인 원리에 대해 파고들어 내 나름대로의 이해로 정리했습니다:

모델 훈련 측면에서, 제 개인적인 경험은 큰 학습 속도 및 작은 배치 크기로 시작하는 것이 효과적이라는 것을 알려 주었습니다. 이 전략은 모델이 일반적인 경로와 속도 경향을 빠르게 파악하는 데 도움이 됩니다. 점진적으로, 모델이 진행됨에 따라 이러한 초매개변수를 점차 감소시키는 것을 권장하며, 더 구체적이고 정교한 훈련 요구에 적응하도록 합니다. 대부분의 훈련에 사용된 하이퍼파라미터는 다음과 같습니다:

[하이퍼파라미터 테이블](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_9.png)

총 30시간 정도의 시간을 들여, 모델을 복제하고 훈련하여 비교적 안정된 상태에 이르렀습니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_10.png" />

열정적이고 철저한 훈련 노력 끝에, 나는 리더보드에서 선두를 차지했습니다.

이 보상 함수가 효과적인 면에서 이점을 제공하지만, 간단한 보상 함수보다 수렴하는 데 더 많은 시간이 걸릴 수 있다는 점을 인지하는 것이 중요합니다. 이 요소로 인해 마지막 제출이 레이스 마감 시간을 넘어섰고 두 번째 위치를 확보한 타이밍이었습니다. 이것은 강화 학습과 레이싱의 동적 세계에서 복잡성과 수렴 속도 사이의 적절한 균형을 찾는 것이 중요한 도전임을 상기시켜줍니다. 그러나 이는 DeepRacer 여정을 풍부하게 하는 귀중한 학습 경험이기도 합니다.

<img src="/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_11.png" />

<div class="content-ad"></div>

# 데이터 분석으로 보상 기능 향상하기

매 훈련 세션 이후, 훈련 로그를 다운로드하고 분석하는 과정은 여정 중 중추적인 단계가 됩니다. 저는 주로 세 가지 필수 플롯을 분석하여 가치 있는 통찰을 얻습니다:

- 에피소드 진행 플롯 (왼쪽): 이 플롯은 각 에피소드에서 이루어진 진행을 시각적으로 나타내며 학습 곡선을 명확하게 보여줍니다.
- 완주 당 총 단계 플롯 (가운데): 여기서 나는 자동차가 각 랩을 완주하기 위해 필요한 총 단계 수를 평가합니다. 이 통찰은 효율성과 전반적인 성능을 평가하는 데 중요합니다.
- 보상 플롯 (오른쪽): 보상 그래프는 매우 중요한데, 보상 함수의 효과적인지를 시험하는 역할을 합니다. 이 그래프는 함수가 자동차가 더 짧은 걸음으로 최적의 경로를 따르도록 적절하게 장려하는지를 강조합니다.

이러한 플롯들은 훈련 진행 상황에 대한 종합적인 시각을 제공하며 최적의 결과를 위해 모델 수정을 도와줍니다.

<div class="content-ad"></div>

아래와 같이 Markdown 형식으로 수정하세요.


![이미지](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_12.png)

실제로 리워드 대 웨이포인트 그래프는 특정 웨이포인트를 찾아내는 데 매우 유용한 도구입니다. 이 그래프를 면밀히 살펴보면, 리워드가 낮은 웨이포인트를 식별하여 자동차가 코스를 이탈하게 하는 요인을 찾아낼 수 있습니다. 이러한 특정 통찰력은 리워드 기능을 정밀하게 조정하여 자동차의 전반적인 성능을 향상시키고, 더 일관되게 코스를 유지할 수 있도록 하는 데 도움이 됩니다.

![이미지](/assets/img/2024-06-23-EnhancingYourAWSDeepRacerPerformancewithGradientDescentAlgorithmandPersonalizedWaypoints_13.png)

당연히, 훈련 트랙을 시각화할 수 있는 능력은 최적 경로를 설계하는 데만 있는 것이 아니라, 훈련 과정에 대한 보다 깊은 통찰력을 얻을 수 있는 귀중한 자원입니다. "Training_analysis.ipynb"를 탐험하는 것을 강력히 권장합니다. 이 파일은 이러한 유용한 플롯 생성을 자동화하여 분석을 단순화하고, 모델을 더욱 개선하기 위한 데이터 기반 의사결정을 도와줍니다. DeepRacer 여정에서 귀하의 성공에 크게 기여할 수 있는 강력한 도구입니다.


<div class="content-ad"></div>

# 코드 세부 정보

보상 함수는 다음과 같습니다:

```js
# 속도 범위: 1.5 - 4
import math


class Reward:
    def __init__(self):
        self.first_racingpoint_index = 0

    def reward_function(self, params):

        ################## 도우미 함수 ###################

        def dist_2_points(x1, x2, y1, y2):
            return abs(abs(x1-x2)**2 + abs(y1-y2)**2)**0.5

        def closest_2_racing_points_index(racing_coords, car_coords):

            # 모든 레이싱 포인트까지의 거리 계산
            distances = []
            for i in range(len(racing_coords)):
                distance = dist_2_points(x1=racing_coords[i][0], x2=car_coords[0],
                                         y1=racing_coords[i][1], y2=car_coords[1])
                distances.append(distance)

            # 가장 가까운 레이싱 포인트의 인덱스 가져오기
            closest_index = distances.index(min(distances))

            # 두 번째로 가까운 레이싱 포인트의 인덱스 가져오기
            distances_no_closest = distances.copy()
            distances_no_closest[closest_index] = 999
            second_closest_index = distances_no_closest.index(
                min(distances_no_closest))

            return [closest_index, second_closest_index]

        def dist_to_racing_line(closest_coords, second_closest_coords, car_coords):

            # 가장 가까운 2개 레이싱 포인트 사이의 거리 계산
            a = abs(dist_2_points(x1=closest_coords[0],
                                  x2=second_closest_coords[0],
                                  y1=closest_coords[1],
                                  y2=second_closest_coords[1]))

            # 차와 가장 가까운 레이싱 포인트 사이의 거리와 두 번째로 가까운 레이싱 포인트 사이의 거리
            b = abs(dist_2_points(x1=car_coords[0],
                                  x2=closest_coords[0],
                                  y1=car_coords[1],
                                  y2=closest_coords[1]))
            c = abs(dist_2_points(x1=car_coords[0],
                                  x2=second_closest_coords[0],
                                  y1=car_coords[1],
                                  y2=second_closest_coords[1]))

            # 차와 레이싱 라인 사이의 거리 계산 (가장 가까운 2개의 레이싱 포인트를 통과)
            # DeepRacer에서 드문 버그인 경우를 위해 try-except 사용
            try:
                distance = abs(-(a**4) + 2*(a**2)*(b**2) + 2*(a**2)*(c**2) -
                               (b**4) + 2*(b**2)*(c**2) - (c**4))**0.5 / (2*a)
            except:
                distance = b

            return distance

        # 다음인 레이싱 포인트 및 이전 레이싱 포인트 계산
        def next_prev_racing_point(closest_coords, second_closest_coords, car_coords, heading):

            # 차를 더 많이 향하도록 설정
            heading_vector = [math.cos(math.radians(
                heading)), math.sin(math.radians(heading))]
            new_car_coords = [car_coords[0]+heading_vector[0],
                              car_coords[1]+heading_vector[1]]

            # 새로운 차 좌표와 두 가장 가까운 레이싱 포인트까지의 거리 계산
            distance_closest_coords_new = dist_2_points(x1=new_car_coords[0],
                                                        x2=closest_coords[0],
                                                        y1=new_car_coords[1],
                                                        y2=closest_coords[1])
            distance_second_closest_coords_new = dist_2_points(x1=new_car_coords[0],
                                                               x2=second_closest_coords[0],
                                                               y1=new_car_coords[1],
                                                               y2=second_closest_coords[1])

            if distance_closest_coords_new <= distance_second_closest_coords_new:
                next_point_coords = closest_coords
                prev_point_coords = second_closest_coords
            else:
                next_point_coords = second_closest_coords
                prev_point_coords = closest_coords

            return [next_point_coords, prev_point_coords]

        def racing_direction_diff(closest_coords, second_closest_coords, car_coords, heading):

            # 가장 가까운 웨이포인트를 기반으로 센터 라인의 방향 계산
            next_point, prev_point = next_prev_racing_point(closest_coords,
                                                            second_closest_coords,
                                                            car_coords,
                                                            heading)

            # 방향 계산(radian 값, arctan2(dy, dx), 결과는 라디안 단위로 (-pi, pi))
            track_direction = math.atan2(
                next_point[1] - prev_point[1], next_point[0] - prev_point[0])

            # 도수로 변환
            track_direction = math.degrees(track_direction)

            # 트랙 방향과 차량의 진행 방향 간의 차이 계산
            direction_diff = abs(track_direction - heading)
            if direction_diff > 180:
                direction_diff = 360 - direction_diff

            return direction_diff

        #################### 레이싱 라인 ######################

        # Spain 트랙을 위한 최적의 레이싱 라인
        # 각 행: [x,y,speed,timeFromPreviousPoint]
        racing_track = [
            [3.06664, 0.69989, 4.0, 0.03654],
            ...
            [2.77639, 0.72086, 4.0, 0.03581],
            [2.92074, 0.70874, 4.0, 0.03621]]

        ...

reward_object = Reward()


def reward_function(params):
    return reward_object.reward_function(params)
```

<div class="content-ad"></div>

코드 구현의 세부 사항에 관심이 있는 분들을 위해, 제 GitHub 저장소를 살펴보실 것을 초대합니다:

# 감사의 말

이 모델을 교육하는 경험은 절대적으로 즐거웠으며 가치 있는 학습 여정이었습니다. 강화 학습에 대한 실용적인 통찰을 얻을 뿐만 아니라, 즐거운 레이싱 게임 측면 때문에 이를 수행하는 데 즐거움을 느꼈습니다. 이 경험을 가능하게 해 준 주최자들께 감사의 말씀을 전하고 싶습니다 (교육 시간은 싸지 않습니다)!

이 GitHub 저장소를 완성하는 데 중요한 참고 자료로 사용된 두 명의 저자 dgnzlz 및 GitHub 사용자 oscarYCL의 역할에 감사의 의미를 표합니다. Capstone_AWS_DeepRacer 및 deepracer-waypoints-workshop이라는 저장소는 그들의 창의성과 기여가 귀중했습니다.

<div class="content-ad"></div>

마지막으로, 이겪은 것은 팀워크입니다. 제 동료들과 함께 이 모델을 개발하는 과정을 즐겼습니다.

# 참고

- https://github.com/dgnzlz/Capstone_AWS_DeepRacer
- https://github.com/oscarYCL/deepracer-waypoints-workshop
- https://docs.aws.amazon.com/deepracer/latest/developerguide/deepracer-reward-function-input.html