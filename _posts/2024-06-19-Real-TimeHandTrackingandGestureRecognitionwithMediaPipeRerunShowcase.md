---
title: "미디어파이프를 사용한 실시간 손 추적 및 제스처 인식 재생 횟수 쇼케이스"
description: ""
coverImage: "/assets/img/2024-06-19-Real-TimeHandTrackingandGestureRecognitionwithMediaPipeRerunShowcase_0.png"
date: 2024-06-19 18:31
ogImage: 
  url: /assets/img/2024-06-19-Real-TimeHandTrackingandGestureRecognitionwithMediaPipeRerunShowcase_0.png
tag: Tech
originalTitle: "Real-Time Hand Tracking and Gesture Recognition with MediaPipe: Rerun Showcase"
link: "https://medium.com/towards-data-science/real-time-hand-tracking-and-gesture-recognition-with-mediapipe-rerun-showcase-9ec57cb0c831"
---


## 미디어파이프의 손 추척 및 제스처 인식을 Rerun과 함께 시각화하는 방법

![image](https://miro.medium.com/v2/resize:fit:1400/1*pE_4QrsVPV7vMrxB6YS1cQ.gif)

이 게시물에서는 미디어파이프 파이썬과 Rerun SDK를 사용하여 손 추척 및 제스처 인식의 예제를 소개하고 있습니다.

더 깊이 파고들고 이해를 넓히고 싶다면, 미디어파이프 파이썬 및 Rerun SDK를 설치하여 손을 추적하고 다양한 제스처를 인식하고 데이터를 시각화하는 방법을 안내해 드리겠습니다.

<div class="content-ad"></div>

## 그러므로, 다음을 배울 것입니다:

- MediaPipe Python 및 Rerun 설치하는 방법
- MediaPipe 제스처 인식을 사용한 손 추적 및 제스처 인식 방법
- 손 추적 및 제스처 인식 결과를 Rerun Viewer에서 시각화하는 방법

예제를 시도하기를 열망한다면, 아래 제공된 코드를 사용해보세요:

```js
# rerun GitHub 저장소를 로컬 머신에 클론합니다.
git clone https://github.com/rerun-io/rerun

# rerun 저장소 디렉토리로 이동합니다.
cd rerun

# 필요한 Python 패키지를 requirements 파일에 명시된대로 설치합니다.
pip install -r examples/python/gesture_detection/requirements.txt

# 예제를 위한 주요 Python 스크립트를 실행합니다.
python examples/python/gesture_detection/main.py

# 특정 이미지에 대한 주요 Python 스크립트를 실행합니다.
python examples/python/gesture_detection/main.py --image path/to/your/image.jpg

# 특정 비디오에 대한 주요 Python 스크립트를 실행합니다.
python examples/python/gesture_detection/main.py --video path/to/your/video.mp4

# 카메라 스트림으로 주요 Python 스크립트를 실행합니다.
python examples/python/gesture_detection/main.py --camera
```

<div class="content-ad"></div>

# 손 추적 및 제스처 인식 기술

계속하기 전에, 우리가 가능하게 한 기술에 대해 인정해주어야 합니다. 손 추적 및 제스처 인식 기술은 기기가 손 움직임과 제스처를 명령이나 입력으로 해석할 수 있도록 하는 것을 목표로 합니다. 이 기술의 핵심은 미리 훈련된 기계 학습 모델이 시각 입력을 분석하고 손의 랜드마크와 제스처를 식별합니다. 이러한 기술의 실제 응용은 다양하며, 손 움직임과 제스처를 사용하여 스마트 기기를 제어하는 데 사용될 수 있습니다. 인간-컴퓨터 상호 작용, 로봇 공학, 게임 및 증강 현실은 이 기술의 잠재적인 응용 분야 중 가장 유망하게 보입니다.

그러나 이러한 기술을 사용하는 방법에 대해 항상 주의해야 합니다. 민감하고 중요한 시스템에서 사용시 손 제스처를 잘못 해석할 수 있고, 잘못된 양성 또는 음성의 가능성이 작지 않습니다. 이를 활용함으로써 발생하는 윤리적 및 법적 문제가 사용자들이 특히 공공장소에서 자신의 제스처가 기록되는 것을 원치 않을 수 있습니다. 현실 세계 시나리오에서 이 기술을 도입하기로 결정했다면, 윤리적 및 법적 고려 사항을 고려하는 것이 중요합니다.

# 요구 사항 및 설정

<div class="content-ad"></div>

먼저, 필요한 라이브러리를 설치해야 합니다. 이는 OpenCV, MediaPipe 및 Rerun과 같은 라이브러리를 포함합니다. MediaPipe Python은 컴퓨터 비전 및 머신러닝을 위한 온디바이스 ML 솔루션을 통합하려는 개발자들에게 유용한 도구이며, Rerun은 시간이 지남에 따라 변화하는 다중 모달 데이터를 시각화하기 위한 SDK입니다.

```js
# 요구 사항 파일에서 지정된 필수 Python 패키지 설치
pip install -r examples/python/gesture_detection/requirements.txt
```

그런 다음, 여기서 미리 정의된 모델을 다운로드해야 합니다: HandGestureClassifier

# MediaPipe를 사용한 손 추적과 제스처 인식

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Real-TimeHandTrackingandGestureRecognitionwithMediaPipeRerunShowcase_0.png" />

이제 샘플 이미지에 제스처 인식을 위해 MediaPipe 사전 훈련 모델을 사용해봅시다. 아래 코드는 MediaPipe 제스처 인식 솔루션의 초기화 및 구성을 설정하는 기초를 제공합니다.

```js
from mediapipe.tasks.python import vision
from mediapipe.tasks import python

class GestureDetectorLogger:

    def __init__(self, video_mode: bool = False):
        self._video_mode = video_mode

        base_options = python.BaseOptions(
            model_asset_path='gesture_recognizer.task'
        )
        options = vision.GestureRecognizerOptions(
            base_options=base_options,
            running_mode=mp.tasks.vision.RunningMode.VIDEO if self._video_mode else mp.tasks.vision.RunningMode.IMAGE
        )
        self.recognizer = vision.GestureRecognizer.create_from_options(options)


    def detect(self, image: npt.NDArray[np.uint8]) -> None:
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)
  
        # 제스처 검출 모델로부터 결과 가져오기
        recognition_result = self.recognizer.recognize(image)
  
        for i, gesture in enumerate(recognition_result.gestures):
            # 인식된 제스처 중 상위 제스처 가져오기
            print("최상위 제스처 결과: ", gesture[0].category_name)
  
        if recognition_result.hand_landmarks:
            # MediaPipe에서 손 랜드마크 가져오기
            hand_landmarks = recognition_result.hand_landmarks
            print("손 랜드마크: " + str(hand_landmarks))
  
            # MediaPipe에서 손 연결 정보 가져오기
            mp_hands_connections = mp.solutions.hands.HAND_CONNECTIONS
            print("손 연결 정보: " + str(mp_hands_connections))
```

GestureDetectorLogger 클래스 내의 detect 함수는 이미지를 인자로 받아 모델 결과를 출력하며, 인식된 최상위 제스처와 감지된 손 랜드마크를 강조합니다. 모델에 대한 추가 정보는 해당 모델 카드를 참조하세요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-Real-TimeHandTrackingandGestureRecognitionwithMediaPipeRerunShowcase_1.png)

아래 코드를 사용하여 직접 시도해볼 수 있어요:

```js
def run_from_sample_image(path)-> None:
    image = cv2.imread(str(path))
    show_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    logger = GestureDetectorLogger(video_mode=False)
    logger.detect_and_log(show_image)

# 샘플 이미지로 제스처 인식 실행하기
run_from_sample_image(SAMPLE_IMAGE_PATH)
```

# 재실행을 사용하여 확인, 디버그 및 데모하기


<div class="content-ad"></div>

이 단계는 솔루션의 신뢰성과 효과성을 보장하는 데 도움이 됩니다. 모델을 준비한 상태로 결과를 시각화하여 정확성을 확인하고 잠재적인 문제를 해결하며 능력을 시연할 수 있습니다. 결과를 시각화해서 Rerun SDK를 사용하면 간단하고 빠르게 가능합니다.

## Rerun을 어떻게 사용할까요?

![이미지](/assets/img/2024-06-19-Real-TimeHandTrackingandGestureRecognitionwithMediaPipeRerunShowcase_2.png)

- Rerun SDK를 사용하여 코드에서 로깅하여 다중 데이터를 스트림으로 전송
- 현지 또는 원격으로 라이브 또는 녹화된 스트림을 시각화하고 상호 작용
- 레이아웃을 대화식으로 구축하고 시각화를 사용자 정의
- 필요할 때 Rerun을 확장

<div class="content-ad"></div>

코드 작성에 앞서, Rerun Viewer를 설치하기 위해 해당 페이지를 방문하는 것이 좋습니다. 그런 다음, Rerun SDK에 대해 읽어보는 것을 권해드립니다. 파이썬 빠른 시작 가이드와 파이썬에서 데이터 기록하기를 읽어보세요. 이러한 초기 단계는 원활한 설정을 보장하고 다가오는 코드 실행에 도움이 될 것입니다.

## 비디오 또는 실시간 실행

비디오 스트리밍에는 OpenCV가 사용됩니다. 특정 비디오의 파일 경로를 선택하거나 0 또는 1의 인수를 제공하여 자체 카메라에 액세스할 수 있습니다 (기본 카메라를 사용하려면 0을 사용하고, 맥에서는 1을 사용할 수 있습니다).

타임라인의 소개를 강조하는 것이 중요합니다. Rerun 타임라인의 기능은 데이터를 하나 이상의 타임라인과 연관시킬 수 있게 합니다. 결과적으로, 비디오의 각 프레임은 해당 타임스탬프와 연관되어 있습니다.

<div class="content-ad"></div>

```js
def run_from_video_capture(vid: int | str, max_frame_count: int | None) -> None:
    """
    비디오 스트림에서 탐지기를 실행합니다.

    매개변수
    ----------
    vid:
        탐지기가 실행될 비디오 스트림입니다. 기본 카메라에는 0/1을 사용하거나 비디오 파일의 경로를 지정하세요.
    max_frame_count:
        처리할 최대 프레임 수입니다. None이면 모든 프레임을 처리합니다.
    """
    cap = cv2.VideoCapture(vid)
    fps = cap.get(cv2.CAP_PROP_FPS)

    detector = GestureDetectorLogger(video_mode=True)

    try:
        it: Iterable[int] = itertools.count() if max_frame_count is None else range(max_frame_count)

        for frame_idx in tqdm.tqdm(it, desc="프레임 처리 중"):
            ret, frame = cap.read()
            if not ret:
                break

            if np.all(frame == 0):
                continue

            frame_time_nano = int(cap.get(cv2.CAP_PROP_POS_MSEC) * 1e6)
            if frame_time_nano == 0:
                frame_time_nano = int(frame_idx * 1000 / fps * 1e6)

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            rr.set_time_sequence("프레임 번호", frame_idx)
            rr.set_time_nanos("프레임 시간", frame_time_nano)
            detector.detect_and_log(frame, frame_time_nano)
            rr.log(
                "미디어/비디오",
                rr.Image(frame)
            )

    except KeyboardInterrupt:
        pass

    cap.release()
    cv2.destroyAllWindows()
```

## 시각화를 위한 데이터 로깅

<img src="https://miro.medium.com/v2/resize:fit:1400/1*c1Us-7PoWSP0rgVdlMQUhA.gif" />

Rerun Viewer에서 데이터를 시각화하려면 Rerun SDK를 사용하여 데이터를 로깅하는 것이 중요합니다. 이전에 언급된 가이드는 이 프로세스에 대한 통찰을 제공합니다. 이 문맥에서는 정규화된 값으로 손 랜드마크 포인트를 추출한 다음, 이미지의 너비와 높이를 사용하여 이미지 좌표로 변환합니다. 이러한 좌표는 2D 포인트로 Rerun SDK에 로깅됩니다. 추가로, 랜드마크 간의 연결을 식별하고 2D 라인스트립으로 로깅합니다.

<div class="content-ad"></div>

제스처 인식을 위해 결과는 콘솔에 출력됩니다. 그러나 소스 코드 안에서는 TextDocument 및 이모지를 사용하여 이러한 결과를 시청자에게 제시하는 방법을 탐구할 수 있습니다.

```js
class GestureDetectorLogger:

    def detect_and_log(self, image: npt.NDArray[np.uint8], frame_time_nano: int | None) -> None:
        # 이미지에서 제스처 인식
        height, width, _ = image.shape
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)

        recognition_result = (
            self.recognizer.recognize_for_video(image, int(frame_time_nano / 1e6))
            if self._video_mode
            else self.recognizer.recognize(image)
        )

        # 값 지우기
        for log_key in ["Media/Points", "Media/Connections"]:
            rr.log(log_key, rr.Clear(recursive=True))

        for i, gesture in enumerate(recognition_result.gestures):
            # 인식된 제스처를 기록
            gesture_category = gesture[0].category_name if recognition_result.gestures else "None"
            print("제스처 카테고리:", gesture_category)

        if recognition_result.hand_landmarks:
            hand_landmarks = recognition_result.hand_landmarks

            # 정규화된 좌표를 이미지 좌표로 변환
            points = self.convert_landmarks_to_image_coordinates(hand_landmarks, width, height)

            # 이미지 및 Hand Entity에 점 기록
            rr.log(
               "Media/Points",
                rr.Points2D(points, radii=10, colors=[255, 0, 0])
            )

            # MediaPipe에서 손 연결 가져오기
            mp_hands_connections = mp.solutions.hands.HAND_CONNECTIONS
            points1 = [points[connection[0]] for connection in mp_hands_connections]
            points2 = [points[connection[1]] for connection in mp_hands_connections]

            # 이미지와 Hand Entity에 연결 기록
            rr.log(
               "Media/Connections",
                rr.LineStrips2D(
                   np.stack((points1, points2), axis=1),
                   colors=[255, 165, 0]
                )
             )

    def convert_landmarks_to_image_coordinates(hand_landmarks, width, height):
        return [(int(lm.x * width), int(lm.y * height)) for hand_landmark in hand_landmarks for lm in hand_landmark]
```

## 3D Points

마지막으로, 손 랜드마크를 3D 포인트로 표시하는 방법을 살펴봅니다. 먼저 init 함수에서 Annotation Context의 키포인트를 사용하여 포인트 사이의 연결을 정의한 다음 3D 포인트로 기록합니다.

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*rNILX857c8TfScr6t7KKgQ.gif)

```python
class GestureDetectorLogger:

    def __init__(self, video_mode: bool = False):
        # ... existing code ...
        rr.log(
            "/",
            rr.AnnotationContext(
                rr.ClassDescription(
                    info=rr.AnnotationInfo(id=0, label="Hand3D"),
                    keypoint_connections=mp.solutions.hands.HAND_CONNECTIONS
                )
            ),
            timeless=True
        )
        rr.log("Hand3D", rr.ViewCoordinates.RIGHT_HAND_X_DOWN, timeless=True)


    def detect_and_log(self, image: npt.NDArray[np.uint8], frame_time_nano: int | None) -> None:
        # ... existing code ...

        if recognition_result.hand_landmarks:
            hand_landmarks = recognition_result.hand_landmarks

            landmark_positions_3d = self.convert_landmarks_to_3d(hand_landmarks)
            if landmark_positions_3d is not None:
                rr.log(
                    "Hand3D/Points",
                    rr.Points3D(landmark_positions_3d, radii=20, class_ids=0, keypoint_ids=[i for i in range(len(landmark_positions_3d))])
                )

        # ... existing code ...
```

준비 완료! 마법이 시작됩니다:

```python
# For image
run_from_sample_image(IMAGE_PATH)

# For saved video
run_from_video_capture(VIDEO_PATH)

# For Real-Time
run_from_video_capture(0) # mac may need 1
```

<div class="content-ad"></div>

이 예제의 전체 소스 코드는 GitHub에서 확인할 수 있습니다. 탐색하고 변경하며 구현의 내부 작업을 이해하는 데 자유롭게 사용하세요.

# 손 추적 및 제스처 인식을 넘어서

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*zc2gezkjPuJMjuToD4gBOw.gif)

마침내, 다양한 애플리케이션 범위에서 다양한 종류의 다중 모달 데이터를 시각화하는 데 관심이 있다면, Rerun Examples를 살펴보고 탐구할 것을 권장합니다. 이러한 예제는 잠재적인 현실 세계 사례를 강조하고 그러한 시각화 기술의 실용적인 응용에 대한 소중한 통찰력을 제공합니다.

<div class="content-ad"></div>

만약 이 글이 유익하고 통찰력이 있었다면, 더 많은 내용을 기대해주세요! 나는 로봇공학과 컴퓨터 비전 시각화 게시물에 대해 깊이 있는 내용을 정기적으로 공유하고 있습니다. 놓치고 싶지 않은 미래 업데이트와 흥미로운 프로젝트를 위해 팔로우해주세요!

또한, LinkedIn에서 저를 찾을 수 있습니다.

비슷한 글: