---
title: "Anomalib v101 플라스틱 표면의 이상 감지 공개"
description: ""
coverImage: "/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_0.png"
date: 2024-06-20 18:04
ogImage: 
  url: /assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_0.png
tag: Tech
originalTitle: "Anomalib v1.0.1: Unveiling Anomaly Detection on Plastic Surfaces"
link: "https://medium.com/ai-advances/anomalib-v1-0-1-unveiling-anomaly-detection-on-plastic-surfaces-c91cd48d8806"
---


# 소개

![이미지](/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_0.png)

컴퓨터 비전에서의 이상 감지는 긴 여정을 거쳤습니다. 다양한 이상 감지 작업이 이미 현실 응용 프로그램에서 사용되어 왔습니다. 이상 탐지의 비지도 학습 솔루션은 제품화에 도움이 되었습니다. 이상 데이터가 필요하지 않고 정상 샘플만을 사용하여 이미지의 섬세한 차이점을 식별하는 모델을 훈련할 수 있습니다.

본 문서에서는 OpenVINO의 Anomalib¹를 사용하여 이상 감지의 또 다른 사용 사례를 살펴보겠습니다. 다음 섹션에서는 훈련 및 테스트 단계를 다룹니다. Anomalib를 사용한 이미지 이상 감지의 최신 자습서를 찾고 계시다면 정확한 위치에 계십니다.

<div class="content-ad"></div>

# 실험

이 섹션에서는 실행 환경, 훈련에 사용된 데이터 세트, 그리고 평가를 진행하는 모델 훈련 단계에 대해 알아보겠습니다.

## 환경

- 운영 체제: Windows 10 / MacOS Sonoma
- Python: v3.10
- Anomalib: v1.0.1

<div class="content-ad"></div>

## 데이터셋

이 실험에서 사용한 데이터셋은 플라스틱 표면의 패치 세트입니다. 그림 1에서는 몇 가지 샘플이 제공되는데, 첫 번째 행에는 4개의 정상 샘플이 나오고 두 번째 행에는 4개의 이상 샘플이 있습니다. 전체 훈련 데이터셋은 다음과 같습니다.

- 정상(이상 없는) 샘플 x 50
- 비정상(이상이 있는) 샘플 x 20, 반사, 홀로그램, 얼룩, 혹은 스트로크로 인해 영향을 받음

단, 훈련에는 정상 50개의 케이스만 참여한다는 점을 유의해 주세요. 비정상 샘플은 검증에 사용되며 모델 수렴에 기여하지 않습니다.

<div class="content-ad"></div>

## 데이터셋

```js
from anomalib import TaskType
from anomalib.models import EfficientAd
from anomalib.engine import Engine
from anomalib.deploy import ExportType
from anomalib.callbacks import ModelCheckpoint
from anomalib.data import Folder

def train():
    # 데이터 모듈 생성
    datamodule = Folder(
        name="card_stain",
        root="anomalib_surface/train",
        normal_dir="normal",
        abnormal_dir="abnormal",
        task=TaskType.CLASSIFICATION
    )
    datamodule.setup()

    model = EfficientAd()
    engine = Engine(max_epochs=350, task=TaskType.CLASSIFICATION,
                    callbacks=[ModelCheckpoint(dirpath='checkpoint/', every_n_epochs=10, save_last=True)])

    # logger.info("체크포인트 경로: {}".format(engine.trainer.default_root_dir))

    # 모델 훈련
    engine.fit(datamodule=datamodule, model=model)
    engine.export(export_type=ExportType.OPENVINO,
                  model=model,
                  export_root='anomalib_weight')

if __name__ == "__main__":
    train()
```

위는 Anomalib을 기반으로 한 훈련 스크립트로, 데이터셋, 네트워크, 트레이너로 구성됩니다.

<div class="content-ad"></div>


![Anomalib](/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_1.png)

Anomalib에서는 Visa, MVTec 및 Kolektor와 같은 내장 데이터 세트뿐만 아니라 Folder 클래스를 사용하여 사용자 정의 데이터 세트를 정의할 수 있는 옵션이 있습니다. Figure 2에서 보이는 대로 데이터 디렉토리를 전달하여 데이터 개체를 초기화합니다.

데이터 디렉토리는 root 디렉토리 root와 두 가지 필수 하위 폴더인 normal_dir, abnormal_dir로 구성되어 있으며 각각 정상 및 비정상 샘플을 저장합니다. 세분화 작업을 실행하는 경우 비정상 사례의 마스크를 위한 추가 폴더가 필요합니다.

Network


<div class="content-ad"></div>

Anomalib은 이상 감지에서 발행된 최신 네트워크를 통한 지속적인 업데이트로 유명합니다. Anomalib v1.0.1에는 이미지 이상의 17개 네트워크가 구현되어 있습니다. 이 연습에서는 2022년에 출시된 강력한 네트워크 중 하나인 EfficientAD를 선택했습니다. 이 네트워크는 높은 정확도를 보이는데 그치지 않고 효율성이 뛰어나어 GPU 없이도 학습이 가능합니다.

Trainer

![Trainer](/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_2.png)

Anomalib에서 학습 과정은 다른 딥러닝 프레임워크와 마찬가지로 트레이너 클래스 엔진에 의해 이끌립니다. 우리는 에포크 수, 결과를 저장할 기본 디렉토리, 콜백 및 작업 유형과 같은 학습 매개변수를 구성할 수 있습니다. 이 과정에서 두 가지 주요 기능이 있습니다:

<div class="content-ad"></div>

Engine.fit(): 정의된 네트워크와 데이터셋을 기반으로 학습 프로세스를 시작합니다. 학습 과정에서 처음 세 번의 에포크에 대한 로그가 그림 3에 제공됩니다. 각 에포크의 끝에는 다음 정보가 출력됩니다:

- 학습 단계: teacher-student, teacher-autoencoder, autoencoder-student distill 학습의 단계.
- AUROC 및 F1 점수: 학습 중 검증 결과.
- 손실: teacher-student, teacher-autoencoder, autoencoder-student distill 학습의 손실.

EfficientAD 내의 세 가지 학습 내용에 대한 자세한 내용은 EfficientAD 내부의 세 네트워크(teacher, student, autoencoder)를 다루는 다른 이야기²를 참조해주세요.

Engine.export(): 학습 후 결과를 지정된 형식(OpenVINO/torch/onnx)으로 내보냅니다. 우리는 이 연습에서 IR 모델 및 메타데이터 파일을 포함하는 OpenVINO 형식(ExportType.OPENVINO)을 선택했습니다. 추가적으로, 학습된 가중치를 저장할 대상 디렉토리를 export_root 매개변수로 전달할 수 있습니다.

<div class="content-ad"></div>

## 추론

```js
inferencer = OpenVINOInferencer(
        path='anomalib_weight/weights/openvino/model.bin',  # OpenVINO IR 모델의 경로.
        metadata='anomalib_weight/weights/openvino/metadata.json',  # 메타데이터 파일의 경로.
        device="CPU",  # 인텔 CPU에서 실행하고 싶습니다.
        task=TaskType.CLASSIFICATION
    )
logger.info('모델을 성공적으로 로드했습니다.')

test_dir = 'anomalib_surface/test/normal/'
img_paths = list(Path(test_dir).rglob('*.jpg')) + list(Path(test_dir).rglob('*.jpeg'))
img_paths = list(map(str, img_paths))
img_paths.sort()

for img_path in img_paths:
    img_name = os.path.basename(img_path)
    predictions = inferencer.predict(img_path)
    logger.info('{}: {}, {:.4f}'.format(img_name, predictions.pred_label, predictions.pred_score))
```

추론은 학습보다는 비교적 간단합니다. Anomalib에서 각 ExportType에는 해당 추론 클래스가 있습니다. 우리는 OpenVINO를 출력 형식으로 선택했으므로 OpenVINOInferencer 추론 클래스의 생성자에서 내보낸 모델을로드합니다. .predict() 함수는 예측을 수행하고 결과를 출력 객체로 반환합니다. 우리는 pred_label 및 pred_score에서 예측된 점수와 레이블에 액세스할 수 있습니다. 이상 점수는 [0,1] 범위 내의 정규화된 값이며, 점수가 높을수록 이미지에 이상이 포함될 가능성이 더 높습니다.

## 결과

<div class="content-ad"></div>

모델 평가를 위해 16개의 샘플을 수집했습니다. 이상한 샘플들은 얼룩, 홀로그램, 그리고 스트로크가 있지만 정상 케이스에는 인식할 수 없는 이상이 포함되어 있지 않습니다. 예측된 이상 점수와 해당하는 샘플은 아래 그림 4에서 확인할 수 있습니다. 각 범주에서 모델에 의해 예측된 이상 점수를 기준으로 오름차순으로 정렬되어 있습니다.

![Figure 4](/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_3.png)

더불어, 점수 분포를 조사하기 위해 선 그래프를 그렸습니다. 정상과 이상 점수는 각각 녹색과 빨강으로 표시되어 있습니다. 두 클래스를 완벽하게 분리할 수 있는 단일 값을 기준으로 구분할 수 있는 임계값은 없다는 것을 볼 수 있습니다. 즉, 우리는 잘못된 분류를 제로로 만들어주는 임계값을 찾을 수 없습니다. 우리가 갖고 있는 최상의 임계값은 [0.49, 0.5] 범위 내에 있으며, 거짓 거부와 거짓 수락을 균형있게 유지하려면 이 범위 안에서 선택해야 합니다. 거짓 수락률과 거짓 거부율은 모두 25% (=2/8) 입니다.

![Figure 5](/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_4.png)

<div class="content-ad"></div>

한편, 수동 조작의 존재 여부를 식별할 기회를 발견하기를 원합니다. 다른 네 개의 샘플을 조작하고 원본 이미지와 수정된 이미지에 대해 추론을 실행합니다. 예상대로, 변조 후 이상 점수가 증가하는 것을 확인할 수 있습니다. 아래 그림에는 이미지와 해당 점수가 제공됩니다.

![이미지](/assets/img/2024-06-20-Anomalibv101UnveilingAnomalyDetectiononPlasticSurfaces_5.png)

본 글의 동기는 실제 사용 사례에서 이상 탐지를 수행하는 방법을 공유하는 것이기 때문에 데이터 확대, 오류 분석 및 매개변수 조정과 같은 최적화 작업에 대한 추가 노력은 하지 않습니다.

요약하면, 훈련한 EfficentAD 모델이 목적을 제대로 수행합니다. 그림 5에서 두 클래스의 분포가 뚜렷하게 분리되어 있는 것을 확인할 수 있으며, 수동으로 조작된 이미지의 이상 점수가 그림 6에서 더 높게 나타납니다.

<div class="content-ad"></div>

# 요약

이 글에서는 플라스틱 표면에 여러 이상을 식별하는 이상 탐지 연습을 보여드립니다. Anomalib 덕분에 간결한 스크립트로 이상을 탐지하는 여행을 떠날 수 있습니다. 이 연습에 사용된 데이터셋을 다른 비즈니스에 맞춘 선호 데이터셋으로 간단히 대체하여 또 다른 맞춤형 모델을 훈련할 수 있습니다.

이 튜토리얼이 유용하길 바라며 읽어 주셔서 감사합니다. 피드백과 코멘트를 기다립니다.

# 참고

<div class="content-ad"></div>

[1] Anomalib 공식 저장소
[2] EFFICIENTAD 탐구: 밀리초 수준의 정확한 시각적 이상 감지: 간단한 개요