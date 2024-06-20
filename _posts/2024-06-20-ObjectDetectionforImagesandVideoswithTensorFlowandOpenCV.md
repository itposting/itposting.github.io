---
title: "이미지와 비디오를 위한 TensorFlow와 OpenCV를 사용한 객체 감지"
description: ""
coverImage: "/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_0.png"
date: 2024-06-20 18:20
ogImage: 
  url: /assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_0.png
tag: Tech
originalTitle: "Object Detection for Images and Videos with TensorFlow and OpenCV"
link: "https://medium.com/gopenai/object-detection-for-images-and-videos-with-tensorflow-and-opencv-c74d97eb0211"
---


![Image](/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_0.png)

객체 감지는 딥러닝의 한 분야 중 하나로, 많은 발전이 이루어졌습니다. 다양한 모델을 사용하여 우리는 사진에서 물체를 감지할 수 있고, 그 결과로 비디오에서도 물체를 감지할 수 있습니다. 요즘에는 웹캠 이미지를 사용한 실시간 객체 감지가 흔한 일입니다!

이 튜토리얼에서는 TensorFlow를 사용하여 객체 감지 시스템을 구축할 것입니다. 구체적으로 TensorFlow Object Detection API를 사용할 것입니다. 단계별로 모든 필요한 종속성을 설치하고, TensorFlow Model Zoo의 사전 훈련된 모델을 살펴보고, 객체 감지기를 구축할 것입니다.

다시 말해, 이 튜토리얼을 읽은 후에는...

<div class="content-ad"></div>

- TensorFlow 기반 객체 검출기를 구축하기 위해 설치해야 하는 것을 알게 되었습니다.
- 사전 훈련된 모델을 찾고 시스템에 다운로드하는 위치를 알고 있습니다.
- 사진 및 비디오와 함께 사용할 수 있는 실제 객체 검출 시스템을 구축했습니다.

그리고 이미지는 항상 수많은 말보다 많은 것을 전달합니다. 아래 시스템을 만들어 보세요!

![이미지](https://miro.medium.com/v2/resize:fit:1200/1*qa_qXkly0MvO82-7uV7LpA.gif)

한번 살펴보시죠!

<div class="content-ad"></div>

## 객체 탐지기 구축: 필수 조건

텐서플로 Object Detection API를 사용하여 객체 탐지 시스템을 구축하려면 다음 세 가지 단계를 완료해야 합니다:

- TensorFlow 및 OpenCV 설치하기. 우리는 TF 기능을 위해 TensorFlow가 필요하며, 이미지 I/O를 위해 OpenCV가 필요합니다. 보통 시스템에 이미 설치되어 있지만, 완전성을 위해 여기에 포함시켰습니다.
- TensorFlow Object Detection API 설치하기. 이 추가 기능 세트는 별도로 설치해야 합니다. 어떻게 설치할 수 있는지 살펴보겠습니다.
- TensorFlow Model Zoo에서 적절한 사전 학습된 모델 찾기. TensorFlow의 제작자들이 다양한 모델 아키텍처를 사용하여 사전 학습된 여러 모델을 TensorFlow Model Zoo에 넣었습니다. 간단히 살펴보고 모델을 선택할 것입니다.

![이미지](/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_1.png)

<div class="content-ad"></div>

## TensorFlow와 OpenCV 설치하기

실제 객체 탐지기를 구축하기 전에 TensorFlow와 OpenCV를 설치해야 합니다.

여기서는 이미 시스템에 Python이 설치되어 있다고 가정합니다. 그렇지 않은 경우 먼저 Python을 설치해 주세요.

요즘은 TensorFlow를 설치하는 것이 정말 쉽습니다. Python에 액세스할 수 있는 터미널에서 다음을 실행하면 됩니다:

<div class="content-ad"></div>

```js
# 최신 버전의 pip가 필요합니다
pip install --upgrade pip

# CPU 및 GPU용 현재 안정적인 릴리스
pip install tensorflow
```

먼저 pip를 최신 버전으로 업그레이드하고 TensorFlow를 설치합니다. 이제 CPU 또는 GPU 버전을 수동으로 지정해야 했던 것이 오늘에는 그렇지 않습니다. 그냥 tensorflow를 설치하면 GPU 버전이 정확하게 설정된 경우 GPU 버전이 자동으로 설치됩니다. 실제로 GPU와 CPU 사이를 자유롭게 전환할 수 있지만, 이에 대해서는 나중에 다시 이야기하겠습니다.

OpenCV를 설치하는 것도 어렵지 않습니다: pip install opencv-python으로 해결할 수 있습니다.

이제 기본 패키지가 설치되었으므로 TensorFlow Object Detection API를 살펴볼 수 있습니다.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_2.png" />

강아지... 와우!

## TensorFlow Object Detection API 설치

GitHub에서 tensorflow/models에서 Object Detection API를 찾을 수 있습니다:

<div class="content-ad"></div>

이름에서 알 수 있듯이, 이것은 객체 감지 목적으로 사용할 수 있습니다. 특히, 사전 훈련된 모델을 로드하고 이미지 및 비디오에 경계 상자를 추가하는 기능을 제공합니다. 우리의 객체 감지 시스템이 이러한 API를 활용할 수 있다는 것은 우리가 모든 것을 직접 개발할 필요가 없다는 멋진 점입니다.

나중에 사전 훈련된 모델을 살펴볼 것입니다. 먼저 Object Detection API를 설치해 봅시다. 이것은 시스템에 Git이 설치되어 있는 것을 가정합니다. 또한 protoc 명령을 실행할 수 있는지 확인해 주세요. 여기서 확인하는 방법을 찾아보세요.

- 먼저 tensorflow/models 저장소 전체를 복제합니다. 한 단계 깊이만 복제하도록 주의하세요. 다음 명령을 실행하여 저장소를 복제하세요: git clone --depth 1 https://github.com/tensorflow/models
- 이제 models/research/ 디렉토리로 이동한 다음 protoc object_detection/protos/*.proto --python_out=. 명령을 실행하세요.
- 그런 다음 cp object_detection/packages/tf2/setup.py 명령을 사용하여 설정 파일을 현재 디렉토리로 복사합니다.
- 마지막으로 python -m pip install 명령을 통해 Object Detection API를 pip를 통해 설치하세요.

## TensorFlow 모델 동물원: 객체 감지용 사전 훈련된 모델

<div class="content-ad"></div>

저희 물체 감지 시스템은 TensorFlow 모델 위에 구축될 예정이에요. 이 모델은 다양한 종류의 물체를 감지할 수 있어요. 이 모델을 훈련하는 과정은 다음과 같아요:

- 다양한 물체가 포함된 많은 이미지를 수집하는 것
- 이러한 이미지들에 레이블을 달아 모든 클래스가 균형을 이루도록 하는 것
- 모델을 훈련하는 것

이 과정은 많은 노력이 필요할 거예요. 다행히 TensorFlow 팀은 TensorFlow Detection Model Zoo에서 다양한 사전 훈련된 물체 감지 모델을 제공하고 있어요.

이러한 물체 감지기는 이미 훈련이 완료되어 있으며 TensorFlow Object Detection API에서 이용할 수 있어요 (괄호 안에는 내부 모델 구조가 나와 있어요):

<div class="content-ad"></div>

- CenterNet (HourGlass104, Resnet50 V1, Resnet101 V1, Resnet50 V2).
- EfficientDet (D0, D1, D2, D3, D4, D5, D6, D7).
- SSD (MobileNet V1 FPN, V2, V2 FPNLite; ResNet50 V1; Resnet101 V1).
- Faster R-CNN (ResNet50; ResNet101; ResNet152; Inception ResNet V2).
- Mask R-CNN (Inception ResNet V2).
- ExtremeNet.

당연히 직접 모델을 만드실 수도 있습니다. 하지만 이 강좌에서 다루지는 않습니다.

오늘은 SSD MobileNet V2 FPNLite 640x640 모델을 사용할 것입니다. Zoo에서 원하는 모델을 선택하실 수 있지만, 이 사전 훈련된 모델은 용량이 20MB밖에 되지 않아서 빠른 인터넷 속도를 가진 많은 사람들이 다운로드할 수 있습니다.

이제 우리의 디텍터를 만들어봅시다!

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_3.png" />

## 객체 탐지기 생성

여기서는 객체 탐지 시스템을 구축하는 방법을 살펴보겠습니다. 이 과정은 세 가지 별개이지만 순차적인 단계로 나눌 수 있습니다:

- 기반을 놓기. 이곳에서는 중요한 imports를 지정하고, 클래스를 정의하고, 초기화 작업을 설명하고, 준비 작업 정의를 작성할 것입니다.
- 탐지 함수 작성. 이것이 탐지기의 핵심입니다. 이것은 일반적으로 탐지를 수행하고, 특히 이미지와 비디오에 대한 예측을 생성할 수 있게 합니다.
- 탐지 호출 생성. 마지막으로, 우리의 탐지기가 준비되면 사용할 수 있도록 다음 추가 코드를 추가할 것입니다.

<div class="content-ad"></div>

코드 에디터를 열고 objectdetector.py와 같은 Python 파일을 생성해 주세요. 코드 작성 시작할까요?

## 파트 1: 기반 구축하기

TensorFlow Object Detection API를 기억하시나요? 이것은 물체 감지기를 구축하기 위한 TensorFlow 위의 프레임워크입니다. 다시 말해, 머신 러닝 모델을 만들기 위한 잘 알려진 라이브러리 위에 또 다른 층이란 의미죠. 이 API 위에 Object Detection API를 사용하는 물체 감지기 층을 추가할 계획입니다.

이 TFObjectDetector의 기반을 구축하기 위해서는 Python 임포트 추가, 필요한 경우 GPU 비활성화, TFObjectDetector 클래스 작성 및 초기화, 물체 감지기를 위한 설정 메커니즘 작성, 마지막으로 몇 가지 도우미 함수를 작성해야 합니다.

<div class="content-ad"></div>

## 파이썬 라이브러리 가져오기

첫 번째 코드는 항상 파이썬 라이브러리를 가져와야 합니다. 오늘도 마찬가지에요:

```js
# 모델 라이브러리 지정
from object_detection.builders import model_builder
from object_detection.utils import config_util
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
import cv2
import numpy as np
import os
import tensorflow as tf
```

object_detection 패키지에서 많은 함수를 가져왔네요 - 이는 TensorFlow Object Detection API를 나타냅니다. 모델 빌더를 사용하여 감지 모델(예: SSD MobileNet 모델)을 구축할 거에요. config_util을 사용하면 TensorFlow에 올바른 모델을 로드하도록 알려주는 구성을 로드할 수 있습니다. 클래스 이름을 나타내는 레이블은 label_map_util을 사용하여 로드할 수 있고, viz_utils는 이미지나 비디오에 경계 상자를 추가하는 데 유용하게 사용될 거에요.

<div class="content-ad"></div>

OpenCV (cv2)는 이미지의 입력 및 출력에 사용되며, NumPy (np)는 숫자 처리에 사용되고, os는 운영 체제 기능에 사용되며, 마지막으로 TensorFlow를 import합니다.

## 필요한 경우 GPU 비활성화

두 번째 단계는 GPU를 비활성화하는 것인데, 이것은 선택 사항입니다 — 다시 말해, 원할 경우에만 수행하십시오. 특히 GPU를 보유하고 있지만 구성이 잘못된 경우에 유용할 수 있습니다. 그때 CUDA 가시 장치를 환경에서 모두 지워야 합니다. TensorFlow의 GPU 버전을 사용하지 않는 경우에는 이 코드를 생략할 수 있습니다.

```js
# 필요한 경우 GPU 비활성화
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
```

<div class="content-ad"></div>

## 클래스와 초기화자 만들기

이제 진짜 작업을 시작할 시간입니다. 우리의 객체 탐지기의 모든 기능을 다루는 TFObjectDetector 클래스를 만들어봅시다.

```js
# 객체 탐지기 생성
class TFObjectDetector():
```

우리는 즉시 __init__ 정의를 추가합니다. 이는 클래스의 생성자를 나타내며 다시 말해, TFObjectDetector를 로딩하는 즉시 실행됩니다. 입력 값으로 다음을 받는다는 것을 주목하세요:

<div class="content-ad"></div>

- 객체 검출에 대한 경로는 시스템에 설치된 Object Detection API의 TensorFlow 2.x 구성 파일 경로를 나타냅니다.
- 실행 중인 모델의 모델 체크포인트 경로 (우리의 경우 SSD MobileNet 모델).
- 텍스트 레이블에 클래스 ID를 매핑하는 사전을 구성할 수 있도록 하는 레이블 파일의 경로.
- 모델 이름.

⚠ 나중에 실제로 검출기를 사용할 때 상황에 맞게 입력값을 설정하는 방법을 설명할 것입니다.

생성자에서는 여러 작업을 수행합니다. 우선, 입력값을 검출기 전체에 재사용할 수 있도록 많은 인스턴스 변수를 채웁니다. 또한 Object Detection API 폴더에 있는 파이프라인 구성을 로드하고, 우리 모델에 해당하는 구성 파일을 로드하며, 마지막으로 self.setup_model()을 호출합니다.

이로써 모델의 설정 메커니즘을 시작하며, 지금 바로 살펴보겠습니다.

<div class="content-ad"></div>

```js
# 객체 검출기 생성
class TFObjectDetector():

  # 생성자
  def __init__(self, path_to_object_detection='./models/research/object_detection/configs/tf2',\
    path_to_model_checkpoint='./checkpoint', path_to_labels='./labels.pbtxt',\
      model_name='ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8'):
    self.model_name = model_name
    self.pipeline_config_path = path_to_object_detection
    self.pipeline_config = os.path.join(f'{self.pipeline_config_path}/{self.model_name}.config')
    self.full_config = config_util.get_configs_from_pipeline_file(self.pipeline_config)
    self.path_to_model_checkpoint = path_to_model_checkpoint
    self.path_to_labels = path_to_labels
    self.setup_model()
```

## 설정 매커니즘

설정 매커니즘은 모델을 백그라운드에서 설정하고 객체 검출기를 사용할 수 있게 만드는 역할을 담당합니다. 다음 단계로 구성됩니다:

- __init__ 함수에서 로드된 모델 구성을 사용하여 모델을 빌드하는 과정.
- 특정 상태로 모델을 복원하는 단계, 즉 훈련된 특정 상태로 모델을 복원합니다.
- 예측을 생성하는 데 사용할 수있는 tf.function인 모델 검출 함수를 검색하는 단계.
- 클래스 ID 및 텍스트 라벨 간의 매핑을 생성하는 단계으로, 라벨을 준비하는 과정입니다.

<div class="content-ad"></div>

위의 단계들의 실행을 setup_model() 정의로 그룹화해 봅시다. 이 정의는 위에서 지정된 __init__ 정의에서 호출되며, 따라서 우리의 객체 탐지기를 생성할 때 호출됩니다.

```js
  # 모델 설정
  def setup_model(self):
    self.build_model()
    self.restore_checkpoint()
    self.detection_function = self.get_model_detection_function()
    self.prepare_labels()
```

그 다음으로 build_model()를 만들어 봅시다:

```js
  # 탐지 모델 빌드
  def build_model(self):
    model_config = self.full_config['model']
    assert model_config is not None
    self.model = model_builder.build(model_config=model_config, is_training=False)
    return self.model
```

<div class="content-ad"></div>

이 정의는 구성을 검색하고 존재하는지 확인한 뒤 모델을 빌드합니다. 이 모델은 인스턴스 변수에 할당되어 객체 탐지기 전반에 걸쳐 재사용될 수 있도록 합니다.

restore_checkpoint() 함수를 사용하면 TensorFlow Detection Model Zoo에서 제공하는 체크포인트 위치/상태로 모델을 되돌릴 수 있습니다.

```js
  # 모델로 체크포인트 복원
  def restore_checkpoint(self):
    assert self.model is not None
    self.checkpoint = tf.train.Checkpoint(model=self.model)
    self.checkpoint.restore(os.path.join(self.path_to_model_checkpoint, 'ckpt-0')).expect_partial()
```

그런 다음 탐지를 위한 tf.function을 생성할 수 있습니다. 이 함수는 모델을 활용하여 이미지를 전처리하고 예측을 생성한 후 감지를 처리하고 모든 것을 반환합니다.

<div class="content-ad"></div>

```js
  # 탐지를 위한 tf.function 가져오기
  def get_model_detection_function(self):
    assert self.model is not None
    
    @tf.function
    def detection_function(image):
      image, shapes = self.model.preprocess(image)
      prediction_dict = self.model.predict(image, shapes)
      detections = self.model.postprocess(prediction_dict, shapes)
      return detections, prediction_dict, tf.reshape(shapes, [-1])
    
    return detection_function
```

마지막으로, prepare_labels()라는 정의를 생성합니다. TensorFlow의 사람들에 의해 만들어졌으며 클래스 식별자를 텍스트 레이블로 매핑하는 책임이 있습니다. 이것은 이 인스턴스 변수로 설정됩니다.

```js
  # 레이블 준비
  # 출처: https://github.com/tensorflow/models/blob/master/research/object_detection/colab_tutorials/inference_tf2_colab.ipynb
  def prepare_labels(self):
    label_map = label_map_util.load_labelmap(self.path_to_labels)
    categories = label_map_util.convert_label_map_to_categories(
        label_map,
        max_num_classes=label_map_util.get_max_label_map_index(label_map),
        use_display_name=True)
    self.category_index = label_map_util.create_category_index(categories)
    self.label_map_dict = label_map_util.get_label_map_dict(label_map, use_display_name=True)
```

## 도우미 함수들

<div class="content-ad"></div>

지금까지 우리는 객체 탐지기를 준비할 수 있는 기반을 만들었습니다. 이 부분을 완료하려면 두 가지 더 도와주는 함수를 만들기만 하면 됩니다. 첫 번째 함수는 키포인트 튜플을 재구성하고, 두 번째 함수는 이미지를 준비합니다. 즉, 이미지를 텐서로 변환해줍니다.

```js
  # Get keypoint tuples
  # 출처: https://github.com/tensorflow/models/blob/master/research/object_detection/colab_tutorials/inference_tf2_colab.ipynb
  def get_keypoint_tuples(self, eval_config):
    tuple_list = []
    kp_list = eval_config.keypoint_edge
    for edge in kp_list:
      tuple_list.append((edge.start, edge.end))
    return tuple_list

  
  # Prepare image
  def prepare_image(self, image):
    return tf.convert_to_tensor(
      np.expand_dims(image, 0), dtype=tf.float32
    )
```

## 파트 2: 탐지 함수 작성

와우, 이미 2부에 도착했네요! 이번에는 탐지 함수를 작성할 거예요. 더 자세히 말하면, 세 가지 정의를 만들 것입니다:

<div class="content-ad"></div>

- 일반 탐지 기능입니다. 이 기능은 이미지 및 비디오 감지에 재사용할 수 있는 일반 탐지 코드를 포함하고 있습니다.
- 이미지 감지입니다. 이 코드는 이미지 내 객체 감지를 위해 특히 사용됩니다.
- 비디오 감지입니다. 이 코드는 비디오 내 객체 감지를 위해 사용됩니다.

## 일반 탐지 기능

첫 번째 정의는 일반 탐지 기능입니다. 이곳에서 일반은 이미지와 비디오에서 감지하는 기능을 공유한다는 뜻입니다. 다시 말해, 무의미하게 두 번 추가할 필요가 없는 것들을 포함합니다! 다음 세그먼트가 포함되어 있습니다:

- 우선, 감지 함수가 None이 아닌지 확인합니다 (위의 Part 1에서). 이는 설정되어 있지 않으면 감지를 수행할 수 없음을 의미합니다.
- 이미지를 복사하고 텐서로 변환하여 준비합니다. 그런 다음 예측이 포함된 사전 및 모양 정보를 가진 객체를 생성합니다.
- 키포인트가 있는 경우 사용합니다.
- Object Detection API에서 제공하는 viz_utils API를 사용하여 예측과 함께 바운딩 박스를 이미지에 추가합니다.
- 마지막으로 바운딩 박스가 있는 이미지를 반환합니다.

<div class="content-ad"></div>

```python
# 객체 감지 실행
def detect(self, image, label_offset = 1):
    # 감지 함수가 있는지 확인
    assert self.detection_function is not None
    
    # 이미지 준비 및 예측 수행
    image = image.copy()
    image_tensor = self.prepare_image(image)
    detections, predictions_dict, shapes = self.detection_function(image_tensor)

    # 제공된 키포인트 사용
    keypoints, keypoint_scores = None, None
    if 'detection_keypoints' in detections:
        keypoints = detections['detection_keypoints'][0].numpy()
        keypoint_scores = detections['detection_keypoint_scores'][0].numpy()
    
    # 출력 이미지/프레임에 시각화 수행
    viz_utils.visualize_boxes_and_labels_on_image_array(
        image,
        detections['detection_boxes'][0].numpy(),
        (detections['detection_classes'][0].numpy() + label_offset).astype(int),
        detections['detection_scores'][0].numpy(),
        self.category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=25,
        min_score_thresh=.40,
        agnostic_mode=False,
        keypoints=keypoints,
        keypoint_scores=keypoint_scores,
        keypoint_edges=self.get_keypoint_tuples(self.full_config['eval_config']))
    
    # 이미지 반환
    return image
```

## 이미지용 감지 함수

이제 어떤 이미지 위의 객체를 감지하는 것이 쉽습니다. OpenCV를 사용하여 경로에서 이미지를 읽고, 일반적인 감지 정의를 호출한 후 결과를 출력 경로에 작성하는 것으로 간단하게 수행할 수 있습니다.

```python
# 폴더에서 이미지 예측
def detect_image(self, path, output_path):

    # 이미지 로드
    image = cv2.imread(path)

    # 객체 감지 수행 및 출력 파일에 추가
    output_file = self.detect(image)
    
    # 출력 파일을 시스템에 작성
    cv2.imwrite(output_path, output_file)
```

<div class="content-ad"></div>

## 비디오용 Detect 함수

비디오에서 객체를 감지하는 것은 조금 더 어렵지만 여전히 매우 쉽습니다. 비디오는 종종 초당 25프레임의 이미지로 이루어진 이미지 집합에 불과하다는 것을 상기해주세요. 이 특성을 활용하여 비디오에서 객체 감지를 수행할 것입니다!

이 세그먼트는 다음 단계로 구성되어 있습니다:

- 먼저 출력 비디오 라이터와 코덱을 설정합니다. 이를 통해 바운딩 박스가 그려진 각 프레임을 출력 비디오에 작성할 수 있습니다. 이것은 사실상 비디오 프레임을 바운딩 박스와 함께 한 프레임씩 재구성하는 것을 의미합니다.
- 그런 다음 OpenCV의 VideoCapture 기능을 사용하여 경로에서 비디오를 읽습니다.
- vidcap.read()를 사용하여 첫 번째 프레임(이미지)을 읽고 성공적으로 읽었는지 표시합니다. 프레임 수를 0으로 설정합니다.
- 이제 프레임을 순환하며 감지를 수행하고(이것이 사실상 이미지에서의 감지임을 알아두세요!) 프레임을 출력 비디오에 작성합니다. 다음 프레임을 읽어 나가며, 더 이상 프레임을 읽을 수 없을 때(즉, frame_read != True가 될 때까지) 계속합니다.
- 모든 프레임을 처리한 후 출력 비디오를 out.release()를 사용하여 해제합니다.

<div class="content-ad"></div>

```js
  # 폴더로부터 비디오를 예측합니다
  def detect_video(self, path, output_path):
    
    # 코덱을 사용하여 출력 비디오 작성기를 설정합니다
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, 25.0, (1920, 1080))
    
    # 비디오를 읽어옵니다
    vidcap = cv2.VideoCapture(path)
    frame_read, image = vidcap.read()
    count = 0
    
    # 각 프레임을 반복하면서 예측을 수행합니다
    while frame_read:
        
      # 물체 감지를 수행하고 출력 파일에 추가합니다
      output_file = self.detect(image)
      
      # 예측과 함께 프레임을 비디오에 작성합니다
      out.write(output_file)
      
      # 다음 프레임 읽기
      frame_read, image = vidcap.read()
      count += 1
        
    # 비디오 파일을 릴리스합니다
    out.release()
```

## 섹션 3: ​​감지 호출 생성

1부 및 2부에서 TFObjectDetector 클래스를 작성하며 감지기를 완성했습니다. 이제 완료 되었으므로 호출해 보는 시간이 됐어요. 다음 코드로 호출할 수 있습니다.

```js
if __name__ == '__main__':
  detector = TFObjectDetector('../../tf-models/research/object_detection/configs/tf2', './checkpoint', './labels.pbtxt', 'ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8')
  detector.detect_image('./shop.jpg', './shopout.jpg')
  detector.detect_video('./video.mp4', './videooutput.mp4')
```

<div class="content-ad"></div>

이 코드는 다음을 수행합니다:

- 직접적으로 실행될 때, 즉 다른 클래스의 컨텍스트 내에서 실행되지 않을 때, 먼저 TFObjectDetector의 새 인스턴스를 생성합니다. 여기에서는 다음 정보를 전달합니다:
- 클론된 TensorFlow 모델의 tf2 구성 폴더로의 절대 또는 상대 경로입니다.
- 다운로드한 모델의 모델 체크포인트 폴더로의 절대 또는 상대 경로입니다. 사용하는 SSD MobileNet의 경우, 폴더를 해제하고 열면 ./checkpoint 폴더가 나타납니다. 거기를 참조하세요.
- 클래스 인덱스와 레이블 이름 간의 매핑에 사용되는 레이블 파일의 절대 또는 상대 경로입니다. 없는 경우 TensorFlow Detection Model Zoo 모델 중 하나에 대해 여기에서 다운로드할 수 있습니다.
- 모델의 이름입니다. 우리 경우에는 지정한 어려운 이름입니다. Model Zoo에서 다른 이름들 중 하나를 사용할 수도 있지만 그에 맞는 체크포인트를 사용해야 합니다.
- ./shop.jpg라는 이미지에서 이미지 검출을 수행하고 결과물(즉, 바운딩 상자가 오버레이된 이미지)을 ./shopout.jpg에 저장합니다.
- ./video.mp4라는 비디오에서 비디오 검출을 수행하고 출력물을 ./videooutput.mp4로 저장합니다.

## 전체 모델 코드

바로 코드로 이동하려는 사용자를 위해 전체 모델 코드는 내 Github 저장소에서 찾을 수 있습니다.

<div class="content-ad"></div>

## 객체 탐지기 실행하기

이제 객체 탐지기를 실행한 결과를 살펴보겠습니다.

이 사진들과 동영상은 Pexels 라이선스 하에 다운로드되어 사용되었습니다.

## 사진에서

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_4.png)

![Image 2](/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_5.png)

![Image 3](/assets/img/2024-06-20-ObjectDetectionforImagesandVideoswithTensorFlowandOpenCV_6.png)

## On videos


<div class="content-ad"></div>

아래는 Markdown 형식으로 표시한 이미지 링크입니다.

![이미지1](https://miro.medium.com/v2/resize:fit:1200/1*alxO3bGUDN3dzJnQ6wIoZQ.gif)

![이미지2](https://miro.medium.com/v2/resize:fit:1200/1*hTy8jS8LYMGNPgJ6Q_jj2w.gif)

## 요약

머신 러닝에서 객체 감지에는 많은 유용한 사례가 있습니다. 이 튜토리얼을 통해 TensorFlow 객체 감지 API와 사전 훈련된 모델을 사용하여 이미지와 비디오에서 객체 감지를 수행하는 방법을 배웠습니다.

<div class="content-ad"></div>

오늘의 글에서 무언가를 배워가셨나요? 궁금한 점, 의견 또는 제안이 있으면 언제든지 환영합니다. 읽어 주셔서 감사합니다!

## 참고 자료

TensorFlow, TensorFlow 로고 및 관련 상표는 Google Inc.의 상표입니다.

TensorFlow. (2020, 9월 9일). TensorFlow/models. GitHub. https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md

<div class="content-ad"></div>

TensorFlow. (2020, 11). TensorFlow/models. GitHub. https://github.com/tensorflow/models/blob/master/research/object_detection/colab_tutorials/inference_tf2_colab.ipynb

TensorFlow. (n.d.). TensorFlow/models. GitHub. https://github.com/tensorflow/models/tree/master/research/object_detection

"현대 합성곱 객체 탐지기의 속도/정확도 균형." 황재식, 라토드 비니트, 썬 첸, 주 만멍, 코라티카라 아니쉬, 파티 아드리아노, 피셔 이안, 우예노비치 세르게이, 송 양초, 과다라마 세르게이, 머피 케빈, CVPR 2017