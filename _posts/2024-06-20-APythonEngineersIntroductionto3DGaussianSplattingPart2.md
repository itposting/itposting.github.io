---
title: "파이썬 엔지니어를 위한 3D 가우시안 스플래팅 소개 파트 2"
description: ""
coverImage: "/assets/img/2024-06-20-APythonEngineersIntroductionto3DGaussianSplattingPart2_0.png"
date: 2024-06-20 19:11
ogImage: 
  url: /assets/img/2024-06-20-APythonEngineersIntroductionto3DGaussianSplattingPart2_0.png
tag: Tech
originalTitle: "A Python Engineer’s Introduction to 3D Gaussian Splatting (Part 2)"
link: "https://medium.com/towards-data-science/a-python-engineers-introduction-to-3d-gaussian-splatting-part-2-7e45b270c1df"
---


## 3D 가우시안 스플래팅 내에서 가우시안 함수가 어떻게 사용되는지 이해하고 코딩하기

이제 가우시안에 대해 이야기해보겠습니다! 모두가 좋아하는 분포입니다. 지금부터 함께하는 분들을 위해, 카메라의 위치를 이용하여 3D 점을 2D로 변환하는 방법에 대해 part 1에서 다룬 바 있습니다. 이 글에서는 가우시안 스플래팅의 가우시안 부분을 다룰 것입니다. 우리는 GitHub에서 part_2.ipynb를 사용할 것입니다.

여기서 우리가 만들게 될 약간의 변경사항은, 이전 글에서 보여준 것과는 다른 내부 매트릭스를 활용하는 원근 투영을 사용할 것이라는 것입니다. 그러나 2D로 점을 투영할 때 두 방법은 동등하며, 저는 part 1에서 소개된 첫 번째 방법이 이해하기 쉽다고 생각합니다. 그러나 가능한한 저자의 코드를 파이썬으로 복제하기 위해 저희는 방법을 변경할 것입니다. 구체적으로 우리의 "내부" 매트릭스는 이곳에 표시된 OpenGL 투영 매트릭스에 의해 이제 제공되며, 곱셈의 순서는 이제 points @ external.transpose() @ internal으로 변경될 것입니다.

<img src="/assets/img/2024-06-20-APythonEngineersIntroductionto3DGaussianSplattingPart2_0.png" />

<div class="content-ad"></div>

호기심이 있는 분들을 위해 새로운 내부 매트릭스에 대해 알고 싶은 경우(그렇지 않으면 이 단락을 건너뛰어도 괜찮아요) r과 l은 오른쪽과 왼쪽 측면의 클리핑 평면이며, 사진의 너비에 관한 시야에 포함될 수 있는 지점을 기본적으로 나타내고 있습니다. t와 b는 상단과 하단 클리핑 평면이고, N은 가까운 클리핑 평면(투영될 점들이 있는 곳)이며, f는 먼 클리핑 평면입니다. 더 자세한 정보는 scratchapixel의 챕터들이 여기에서 매우 유익하다고 생각합니다(https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix.html). 이것은 또한 점들을 정규화된 장치 좌표( -1과 1 사이)로 반환하며, 이를 픽셀 좌표로 투영합니다. 이론에서 벗어나서 우리의 작업은 같습니다, 3D에서 점을 가져와 2D 이미지 평면으로 투영하는 것입니다. 그러나 이 튜토리얼의 이 부분에서는 이제 포인트 대신 가우시안 함수를 사용합니다.

```js
def getIntinsicMatrix(
    focal_x: torch.Tensor,
    focal_y: torch.Tensor,
    height: torch.Tensor,
    width: torch.Tensor,
    znear: torch.Tensor = torch.Tensor([100.0]),
    zfar: torch.Tensor = torch.Tensor([0.001]),,
) -> torch.Tensor:
    """
    내부 퍼스펙티브 투영 매트릭스 가져오기
    
    znear: 사용자가 지정한 가까운 평면
    zfar: 사용자가 지정한 먼 평면
    fovX: 초점 길이에서 계산된 x의 시야
    fovY: 초점 길이에서 계산된 y의 시야
    """
    fovX = torch.Tensor([2 * math.atan(width / (2 * focal_x))])
    fovY = torch.Tensor([2 * math.atan(height / (2 * focal_y))])
    
    tanHalfFovY = math.tan((fovY / 2))
    tanHalfFovX = math.tan((fovX / 2))

    top = tanHalfFovY * znear
    bottom = -top
    right = tanHalfFovX * znear
    left = -right
    P = torch.zeros(4, 4)
    z_sign = 1.0

    P[0, 0] = 2.0 * znear / (right - left)
    P[1, 1] = 2.0 * znear / (top - bottom)
    P[0, 2] = (right + left) / (right - left)
    P[1, 2] = (top + bottom) / (top - bottom)
    P[3, 2] = z_sign
    P[2, 2] = z_sign * zfar / (zfar - znear)
    P[2, 3] = -(zfar * znear) / (zfar - znear)
    return P
```

3D 가우시안 splat은 x, y, z 좌표 및 관련 공분산 행렬로 구성됩니다. 저자들이 언급한 대로: "명백한 접근 방식은 공분산 행렬 Σ를 직접 최적화하여 빛의 필드를 나타내는 3D 가우시안을 얻는 것일 것입니다. 그러나, 공분산 행렬은 양의 준정치일 때만 물리적인 의미를 갖습니다. 우리가 모든 매개변수를 최적화하기 위해 사용하는 경사 하강법은 이러한 유효한 행렬을 생성하기가 쉽지 않으며, 업데이트 단계와 그래디언트는 쉽게 유효하지 않은 공분산 행렬을 만들어냅니다."

그래서 저자들은 항상 양의 준정부 공분산 행렬을 생성할 수 있는 공분산 행렬의 분해를 사용합니다. 특히, 3개의 "크기" 매개변수와 4개의 쿼터니언을 사용하여 3x3 회전 행렬(R)로 변환합니다. 그런 다음 공분산 행렬은 다음과 같이 주어집니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-APythonEngineersIntroductionto3DGaussianSplattingPart2_1.png)

쿼터니온 벡터를 회전 행렬로 변환하기 전에 정규화해야만 유효한 회전 행렬을 얻을 수 있습니다. 따라서 저희 구현에서 가우스 포인트는 다음 매개변수로 구성됩니다. 좌표 (3x1 벡터), 쿼터니온 (4x1 벡터), 스케일 (3x1 벡터) 및 불투명도(스플래팅이 얼마나 투명한지를 나타내는 최종 float 값)입니다. 이제 모든게 갖춰졌네요! 이 11개의 매개변수를 최적화하여 우리의 씬을 만들 수 있습니다 — 간단하지요!

하지만 실제로는 조금 복잡합니다. 고등학교 수학을 기억한다면 특정 지점에서의 가우시안의 세기는 아래의 방정식으로 주어집니다:

![이미지](/assets/img/2024-06-20-APythonEngineersIntroductionto3DGaussianSplattingPart2_2.png)


<div class="content-ad"></div>

하지만, 우리는 이미지 평면인 2D에서 3D 가우시안의 강도에 중점을 두고 있습니다. 하지만 여러분은 아마 "우리는 2D로 점을 투영하는 방법을 알고 있다고?" 할 수 있겠지만요! 그럼에도 불구하고, 아직 2D로 공분산 행렬을 투영하는 방법에 대해 다루지 않았기 때문에, 만약 우리가 2D 공분산 행렬의 역행렬을 찾지 않았다면 이 무슨 얘기인지 알 수 없겠죠.

이제 재미있는 부분입니다(어떻게 보느냐에 따라 다를 수 있습니다). 3D 가우시안 스플래팅 저자들의 논문인 EWA Splatting은 3D 공분산 행렬을 2D로 투영하는 정확한 방법을 보여줍니다. 그러나 이것은 알려진 야코비안 아핀 변환 행렬의 지식을 전제로 한다는 것에 유념해야 합니다. 아래에서 계산하는 것처럼. 어려운 개념을 풀어갈 때 가장 도움이 되는 것은 코드이므로, 3D 공분산 행렬에서 2D로 전환하는 방법을 실제로 어떻게 하는 지 보여주기 위해 아래에 일부 코드를 제공했습니다.

```js
def compute_2d_covariance(
    points: torch.Tensor,
    external_matrix: torch.Tensor,
    covariance_3d: torch.Tensor,
    tan_fovY: torch.Tensor,
    tan_fovX: torch.Tensor,
    focal_x: torch.Tensor,
    focal_y: torch.Tensor,
) -> torch.Tensor:
    """
    각 가우시안의 2D 공분산 행렬 계산
    """
    points = torch.cat(
        [points, torch.ones(points.shape[0], 1, device=points.device)], dim=1
    )
    points_transformed = (points @ external_matrix)[:, :3]
    limx = 1.3 * tan_fovX
    limy = 1.3 * tan_fovY
    x = points_transformed[:, 0] / points_transformed[:, 2]
    y = points_transformed[:, 1] / points_transformed[:, 2]
    z = points_transformed[:, 2]
    x = torch.clamp(x, -limx, limx) * z
    y = torch.clamp(y, -limy, limy) * z

    J = torch.zeros((points_transformed.shape[0], 3, 3), device=covariance_3d.device)
    J[:, 0, 0] = focal_x / z
    J[:, 0, 2] = -(focal_x * x) / (z**2)
    J[:, 1, 1] = focal_y / z
    J[:, 1, 2] = -(focal_y * y) / (z**2)

    # 초기에 원근 투영을 위해 설정한 대로 전치함
    # 이제 우리가 다시 변환하는 것이므로
    W = external_matrix[:3, :3].T

    return (J @ W @ covariance_3d @ W.T @ J.transpose(1, 2))[:, :2, :2]
```

먼저, tan_fovY와 tan_fovX는 시야각의 반을 나타내는 tangent 값입니다. 이러한 값들을 사용하여 투영을 클램핑하여 화면 바깥으로 너무 많이 벗어났을 때 렌더에 영향을 미치지 않도록 합니다. 우리는 초기 순방향 변환으로부터 주어진 3D에서 2D로의 변환으로부터 야코비안을 유도할 수 있지만, 여러분이 귀찮을 일을 덜어드리기 위해 위에서 기대할 수 있는 유도를 보여드릴게요. 마지막으로, 우리가 회전 행렬을 변환하면서 처음에 전치했습니다만, 최종 공분산 계산을 반환하기 전에 다시 전치해야 합니다. EWA 스플래팅 논문에 따르면, 우리는 2D 이미지 평면에만 관심이 있으므로 세 번째 행과 열은 무시할 수 있습니다. 처음부터 그렇게 할 수 없었던 이유에 대해 궁금할 수도 있습니다. 대부분의 경우, 이는 완벽한 구로 표현되지 않을 것이기 때문에 각도에 따라 공분산 행렬 매개변수가 달라지기 때문입니다! 이제 올바른 관점으로 변환했으므로, 공분산 z축 정보는 쓸모없으며 버릴 수 있게 되었습니다.

<div class="content-ad"></div>

주어진 2D 공분산 행렬이 있으면 이미지의 임의의 픽셀에 각 가우시안이 미치는 영향을 계산할 수 있게 되었습니다. 이제 역 공분산 행렬을 찾아야 합니다. 선형 대수학에서 다시 상기해보면 2x2 행렬의 역행렬을 찾으려면 행렬식을 찾고 일부 용어를 재배열하면 됩니다. 이 코드를 통해 해당 프로세스를 안내해드릴게요.

```js
def compute_inverted_covariance(covariance_2d: torch.Tensor) -> torch.Tensor:
    """
    역 공분산 행렬 계산

    2x2 행렬의 경우
    다음과 같이 주어질 때
    [[a, b],
     [c, d]]
     행렬식은 ad - bc입니다.

    역행렬을 구하려면 다음과 같이 용어를 재배열하고
    행렬식의 역수를 곱하면 됩니다
    [[d, -b],
     [-c, a]] * (1 / 행렬식)
    """
    행렬식 = (
        covariance_2d[:, 0, 0] * covariance_2d[:, 1, 1]
        - covariance_2d[:, 0, 1] * covariance_2d[:, 1, 0]
    )
    행렬식 = torch.clamp(행렬식, min=1e-3)
    역_공분산 = torch.zeros_like(covariance_2d)
    역_공분산[:, 0, 0] = covariance_2d[:, 1, 1] / 행렬식
    역_공분산[:, 1, 1] = covariance_2d[:, 0, 0] / 행렬식
    역_공분산[:, 0, 1] = -covariance_2d[:, 0, 1] / 행렬식
    역_공분산[:, 1, 0] = -covariance_2d[:, 1, 0] / 행렬식
    return 역_공분산
```

그리고 이제 이미지의 모든 픽셀에 대해 픽셀 강도를 계산할 수 있습니다. 그러나 이렇게 하는 것은 굉장히 느리고 불필요합니다. 예를 들어, (0,0)에서 스플래시가 (1000,1000)의 픽셀에 어떤 영향을 미치는지 계산하는 데 계산 시간을 낭비할 필요가 없습니다. 공분산 행렬이 거대하지 않다면 말이죠. 따라서 저자들은 각 스플래시마다 "반경"이라고 부르는 값을 계산하기로 결정했습니다. 아래 코드에서 볼 수 있듯이 각 축을 따라 고유값을 계산합니다(고유값은 변화를 나타냅니다). 그런 다음 가장 큰 고유값의 제곱근을 취하여 표준 편차를 얻고 3.0을 곱합니다. 이것은 분포의 99.7%를 3표준 편차 내에 포함시킵니다. 이 반경을 사용하면 스플래시가 닿는 x 및 y 값의 최솟값과 최댓값을 파악할 수 있습니다. 렌더링할 때 이러한 경계 내의 픽셀에 대해만 스플래시 강도를 계산하며 불필요한 계산을 피합니다. 상당히 똑똑한 방법이죠?

```js
def compute_extent_and_radius(covariance_2d: torch.Tensor):
    mid = 0.5 * (covariance_2d[:, 0, 0] + covariance_2d[:, 1, 1])
    det = covariance_2d[:, 0, 0] * covariance_2d[:, 1, 1] - covariance_2d[:, 0, 1] ** 2
    intermediate_matrix = (mid * mid - det).view(-1, 1)
    intermediate_matrix = torch.cat(
        [intermediate_matrix, torch.ones_like(intermediate_matrix) * 0.1], dim=1
    )

    max_values = torch.max(intermediate_matrix, dim=1).values
    lambda1 = mid + torch.sqrt(max_values)
    lambda2 = mid - torch.sqrt(max_values)
    # 이제 고유값을 갖고 있으므로 최대 반경을 계산할 수 있습니다
    max_radius = torch.ceil(3.0 * torch.sqrt(torch.max(lambda1, lambda2)))

    return max_radius
```

<div class="content-ad"></div>

위의 모든 단계를 거쳐 우리는 그것을 렌더 단계에서 사용할 수 있는 전처리된 장면을 얻습니다. 간단히 말해 이제 2D에서의 포인트, 해당 포인트와 관련된 색, 2D에서의 공분산, 2D에서의 역공분산, 정렬된 깊이 순서, 각 스플랫에 대한 최소 x, 최소 y, 최대 x, 최대 y 값, 그리고 관련 투명도를 가지게 되었어요. 이러한 모든 구성 요소를 갖고 이미지 렌더링으로 넘어 갈 수 있습니다!

- Kerbl, Bernhard, et al. “3d gaussian splatting for real-time radiance field rendering.” ACM Transactions on Graphics 42.4 (2023): 1–14.
- Zwicker, Matthias, et al. “EWA splatting.” IEEE Transactions on Visualization and Computer Graphics 8.3 (2002): 223–238.