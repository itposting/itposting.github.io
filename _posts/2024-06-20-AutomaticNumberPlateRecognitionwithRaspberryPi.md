---
title: "라즈베리 파이를 사용한 자동 번호판 인식"
description: ""
coverImage: "/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_0.png"
date: 2024-06-20 17:43
ogImage: 
  url: /assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_0.png
tag: Tech
originalTitle: "Automatic Number Plate Recognition with Raspberry Pi"
link: "https://medium.com/@alexey.yeryomenko/automatic-number-plate-recognition-with-raspberry-pi-e1ac8a804c79"
---



<img src="/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_0.png" />

# 소개

이 프로젝트의 목표는 Raspberry Pi 마이크로 컴퓨터를 사용하여 주차 장벽을 제어하기 위한 자동 번호판 인식 시스템을 설계하는 것입니다.

왜 이 프로젝트를 하게 되었을까요?


<div class="content-ad"></div>

어딘가에 참여 중인 프로젝트가 없는 Rpi가 하나 있고 카메라와 잠재적인 고민이 있는데요 ― 사무실 주차장에 자동 주차 장벽 제어 시스템이 없습니다. 그러니 이 프로젝트를 시작해보는 건 어떨까요?

이 프로젝트의 목적은 생산에 적합한 안정적이고 경쟁력있는 솔루션을 만드는 것이 아니라, 한정된 장비를 사용하여 실제 문제를 위한 작동 제품을 만들면서 재미를 느끼는 것입니다. 그리고 그 이후에는 이 솔루션을 경량 엣지 디바이스에서 빠르게 작동하도록 최적화하는 재미도 봅시다)

![image](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_1.png)

일반적인 아이디어는 Rpi 카메라를 사용하여 일정 주기로 사진을 촬영하고, 이미지를 처리하여 차량 번호판을 감지하고 문자를 인식한 다음 데이터베이스에서 허용된 번호 목록과 비교하는 것입니다. 목록의 번호판과 일치한다면 장벽이 열릴 것입니다.

<div class="content-ad"></div>

기본적인 단계에서는 다음 도구를 사용할 것입니다: 

- 이미지 소스 — Raspberry Pi Camera 모듈 v2;
- 번호판 검출기 — pyTorch를 사용하여 제공되는 Yolo v7;
- 광필 인식 (OCR) — EasyOCR;
- "데이터베이스" — Google 시트의 테이블;

모든 처리 작업과 계산은 Raspberry Pi 4b에서 로컬로 실행되어야 하며, 이 솔루션은 자율적으로 작동해야합니다.

![이미지](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_2.png)

<div class="content-ad"></div>

라즈베리 파이는 "거의 실시간"으로 Pi 카메라에서 프레임을 계속해서 읽습니다. 그런 다음, 사용자 정의 데이터셋 YOLOv7 모델을 미세 조정하여 번호판이 있는 영역을 감지합니다. 그 다음, 필요한 경우 이미지 전처리를 제공하고 EasyOCR 모델이 제공된 자르기된 프레임에서 번호를 감지합니다. 그런 다음 번호판 문자열을 "데이터베이스"에 저장된 번호판 중 어느 것과 일치하는지 확인하고 해당 작업을 실행합니다. 라즈베리 GPIO (General-Purpose Input-Output) - 제어 릴레이 스위치를 사용하여 주차장 장벽과 빛 등 추가 부하를 연결할 수 있습니다.

GPIO 핀을 사용하면 입력 센서 (IR, PIR와 같은)를 연결하고 자동차가 감지됐을 때에만 카메라를 작동시킬 수 있습니다.

이 작업은 여러 가지 방법으로 해결할 수 있습니다. 일부 방법은 특정 요구 사항과 사용 사례에 더 효율적이고 간편할 수 있습니다. 예를 들어, 모든 중요한 처리를 클라우드에서 수행하거나 GPU 기반 엣지 장치를 사용하거나 다른 모델을 사용할 수 있습니다. ONNX, TFLite 등을 사용하여 제공할 수도 있습니다. 그러나 이 프로젝트는 실험으로 진행되었고, 현재 사용 가능한 장비를 사용했으며, 쉬운 방법을 찾는 것이 아니었습니다 =)

# 환경 설정

<div class="content-ad"></div>

## 하드웨어 디자인

필수 하드웨어:

- 카메라 — Raspberry Pi Camera 모듈 v2 (Sony IMX219 8MPx, 1080p30, 720p60)
- 엣지 디바이스 — Raspberry Pi 4 모델 B 4GB (CPU: Broadcom BCM2711, 쿼드 코어 Cortex-A72 (ARM v8) 64비트 SoC @ 1.5GHz; RAM: 4GB LPDDR4–3200 SDRAM; 40핀 GPIO 헤더; 2.4 GHz/5.0 GHz 802.11ac Wi-Fi, 블루투스 5.0)
- SD 카드 (8GB)
- 전원 공급 장치 — 5V 3A USB-C

![image](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_3.png)

<div class="content-ad"></div>

추가 내용:

- 열흡수기, 냉각 팬
- UPS
- 디스플레이 (Waveshare 2.7인치 e-Paper HAT)
- 외부 장치(장벽) 제어용 릴레이 / Raspberry HAT
- 카메라 마운트 ("카메라용 독특한 금속 와이어 마운트" :))

* 색깔 다시 채워주는 시간이 괜찮은 TFT 또는 OLED 유형의 화면을 사용하는 것이 좋지만, 그 당시에는 이 것만 사용할 수 있었습니다.

[이미지](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_4.png)

<div class="content-ad"></div>

설정하기

PyTorch를 사용하여 솔루션을 만들기로 결정했으므로, Arm 64비트(aarch64)용 pip 패키지만 제공되므로 64비트 버전의 OS(데비안 버전: 11 - “Bullseye”)를 설치해야 합니다.

최신 arm64 라즈베리 파이 OS는 공식 사이트에서 다운로드할 수 있으며 rpi-imager를 통해 설치할 수 있습니다.

설치가 완료되면 다음과 같아야 합니다:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_5.png" />

라즈베리 파이에 SD 카드를 삽입한 후 부팅하면 다음과 같은 설정을 수행해야 합니다:

/boot/config.txt 파일을 수정하여 카메라를 활성화합니다.

```js
# 이는 카메라와 같은 확장 기능을 사용하도록합니다.
start_x=1
# 카메라 처리에 적어도 128M이 필요하며 더 크면 그대로 둘 수 있습니다.
gpu_mem=128
# 기존의 camera_auto_detect 줄을 주석 처리/삭제해야합니다. 이것은 OpenCV/V4L2 캡처에서 문제를 일으킵니다.
#camera_auto_detect=1
```

<div class="content-ad"></div>

또한 아마 I2C, SSH 및 VNC을 활성화하려고 할 것입니다. 이 작업은 raspi-config 또는 GUI에서 할 수 있습니다.

![image](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_6.png)

요구 사항 설치

저는 Python 버전 3.9 및 3.10을 사용했습니다. 일부 경우에 따르면 3.11 버전이 더 빠르다고 보고되지만 아직 안정적인 PyTorch가 3.11에는 없습니다.

<div class="content-ad"></div>

`requirements.txt` 파일을 사용하여 pip 패키지 관리자를 통해 모든 필요한 라이브러리와 모듈을 설치하세요:


matplotlib>=3.2.2
numpy>=1.18.5
opencv-python==4.5.4.60
opencv-contrib-python==4.5.4.60
Pillow>=7.1.2
PyYAML>=5.3.1
requests>=2.23.0
scipy>=1.4.1
torch>=1.7.0,!=1.12.0
torchvision>=0.8.1,!=0.13.0
tqdm>=4.41.0
protobuf<4.21.3
tensorboard>=2.4.1
pandas>=1.1.4
seaborn>=0.11.0
easyocr>=1.6.2


수동으로 직접 설치하거나 기존 환경에 구현할 경우 (하지 마세요 :)), 현재 OpenCV 버전에 문제가 있으므로 정확한 버전 4.5.4.60을 설치해야 합니다.

모든 것이 올바르게 설치되었는지 확인하려면 `pip list` 명령어를 사용하세요.

<div class="content-ad"></div>

`<img src="/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_7.png" />`

그럼, 하드웨어와 환경을 설정해놓았으니 코딩을 시작해봅시다.

# 소프트웨어 설계

이미지 캡쳐

<div class="content-ad"></div>

이미지 캡처를 위해 표준 picamera 라이브러리 대신 OpenCV를 사용하여 비디오 프레임을 스트리밍할 것입니다. 64비트 OS에서 picamera 라이브러리를 사용할 수 없고 그 속도도 느립니다. OpenCV는 직접 /dev/video0 장치에 액세스하여 프레임을 캡처합니다.

OpenCV 카메라 읽기를 위한 사용자 정의 간단한 래퍼:

```python
class PiCamera():
    def __init__(self, src=0, img_size=(640,480), fps=36, rotate_180=False):
        self.img_size = img_size
        self.fps = fps
        self.cap = cv2.VideoCapture(src)
        #self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        #self.cap.set(cv2.CAP_PROP_FPS, self.fps)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.img_size[0])
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.img_size[1])
        self.rotate_180 = rotate_180
    def run(self):       
        # 프레임 읽기
        ret, image = self.cap.read()
        if self.rotate_180:
            image = cv2.rotate(image, cv2.ROTATE_180)
        if not ret:
            raise RuntimeError("프레임 읽기 실패")
        return image 
```

여기서 카메라가 뒤집혀 있기 때문에 `image = cv2.rotate(image, cv2.ROTATE_180)`를 사용하고 있습니다.

<div class="content-ad"></div>

버퍼 크기와 FPS 설정은 랙을 고치고 프레임 스트림을 적절하게 정렬하는 데 사용할 수 있습니다. 그러나 제 경우에는 카메라 제조사 및 프레임을 읽는 데 사용된 백엔드에 따라 달라서 작동하지 않습니다.

카메라에서 이미지가 캡처된 후, 우리는 번호판을 감지하는 작업을 시작하여 이미지를 처리해야 합니다.

번호판 감지 모듈

이 작업에는 YOLOv7 사전 훈련된 모델을 사용할 것입니다. 이 모델을 사용하여 사용자 지정 번호판 데이터 세트에 대해 미세 조정할 것입니다.

<div class="content-ad"></div>

YOLOv7는 정확성과 속도 측면에서 최신 기술인 실시간 객체 감지 알고리즘입니다. COCO 데이터셋에 미리 학습되어 있습니다.

이 알고리즘에 대한 자세한 내용은 다음 논문에서 확인할 수 있어요: YOLOv7: Trainable bag-of-freebies sets new state-of-the-art for real-time object detectors.

![이미지](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_8.png)

공식 저장소에서 YOLOv7 레포지토리를 복제해보세요.

<div class="content-ad"></div>

```js
git clone https://github.com/WongKinYiu/yolov7.git
cd yolov7
```

요로 요구 사항은 위에서 설치한 프로젝트 요구 사항에 이미 흡수되었습니다.

Fine-tuning을 위해 YOLOv7의 사전 훈련된 작은 버전인 이미지 크기 640을 적용하겠습니다.

```js
# 사전 훈련된 가중치 다운로드
!wget https://github.com/WongKinYiu/yolov7/releases/download/v0.1/yolov7-tiny.pt
```

<div class="content-ad"></div>

기본 사전 훈련된 물체 탐지:

![image](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_9.png)

Numberplate Detection Model training

커스텀 데이터셋에 대한 모델 훈련은 꽤 간단하고 직관적입니다.

<div class="content-ad"></div>

친구야, 좋은 GPU를 이용해 Google Colab에서 모델 파인 튜닝을 진행할 거야.

시작하기 전에 단일 번호판 클래스로 적절한 데이터셋을 생성하고 레이블을 지정해야 해.

나의 데이터셋은 나만의 사진을 기반으로 부분적으로 만들었으며 AUTO.RIA Numberplate Dataset에서 일부를 활용했어 (이 멋진 분들에게 감사합니다!). 총 2000장의 이미지를 사용했어.

레이블링은 Yolo 포맷으로 roboflow 서비스를 통해 진행했어.

<div class="content-ad"></div>

```yaml
train: dataset/train
val: dataset/valid
# Classes
nc: 1  # number of classes
names: ['numberplate']  # class names
```

모델을 훈련하세요.

<div class="content-ad"></div>

```yaml
python train.py --epochs 25 --workers 8 --device 0 --batch-size 32 --data data/numberplates.yaml --img 640 640 --cfg cfg/training/yolov7.yaml --weights 'yolov7-tiny.pt' --name yolov7_tiny_numberplates --hyp data/hyp.scratch.tiny.yaml
``` 

Baseline으로 25회의 에포크가 충분하다고 결정했어요.

![AutomaticNumberPlateRecognitionwithRaspberryPi_11.png](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_11.png)

추론:

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_12.png" />

프로젝트의 첫 번째 버전으로는 충분해 보이지만, 실제 응용 프로그램 중 발견된 특수 사례들을 통해 나중에 업데이트할 수 있습니다.

YOLOv7 디텍터를 위한 추상적인 간단한 래퍼 클래스를 생성하였습니다:

```js
class Detector():
    def __init__(self, model_weights, img_size=640, device='cpu', half=False, trace=True, log_level='INFO', log_dir = './logs/'):
        # 초기화
        self.model_weights = model_weights
        self.img_size = img_size
        self.device = torch.device(device)
        self.half = half  # half = device.type != 'cpu'  # half precision only supported on CUDA
        self.trace = trace  # 모델을 Traced-모델로 변환
        self.log_level = log_level
        if self.log_level:
            self.num_log_level = getattr(logging, self.log_level.upper(), 20) ##log_level 입력 문자열을 로깅 모듈이 허용하는 값 중 하나로 변환합니다. 값이 없다면 20 - INFO로 설정됩니다.
            self.log_dir = log_dir
            log_formatter = logging.Formatter("%(asctime)s %(message)s")
            logFile = self.log_dir + 'detection.log'
            my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=25 * 1024 * 1024,
                                             backupCount=10, encoding='utf-8', delay=False)
            my_handler.setFormatter(log_formatter)
            my_handler.setLevel(self.num_log_level)
            self.logger = logging.getLogger(__name__)  
            self.logger.setLevel(self.num_log_level)
            self.logger.addHandler(my_handler)
        # YOLO 모델의 경로를 추가합니다. ('weights.pt')를 로드할 때마다, pytorch는 path 환경 변수(models/yolo)에서 모델 구성을 찾습니다.
        yolo_folder_dir = str(Path(__file__).parent.absolute()) +"\yolov7" #  모델 폴더 경로
        sys.path.insert(0, yolo_folder_dir)
        # 모델 로드
        self.model = attempt_load(self.model_weights, map_location=self.device)  # FP32 모델 로드
        # 모델을 Traced-모델로 변환
        if self.trace:
            self.model = TracedModel(self.model, self.device, self.img_size)
        # if half:
        #     model.half()  # to FP16
        # 이름과 색상 가져오기
        self.names = self.model.module.names if hasattr(self.model, 'module') else self.model.names
        if len(self.names) > 1:
            self.colors = [[0, 255, 127]] + [[random.randint(0, 255) for _ in range(3)] for _ in self.names[1:]]
        else:
            self.colors = [[0, 255, 127]]
        sys.path.remove(yolo_folder_dir)
    def run(self, inp_image, conf_thres=0.25):
        # 추론 실행
        # 데이터 로드
        dataset = LoadImage(inp_image, device=self.device, half=self.half)
        t0 = time.time()
        self.file_name, self.img, self.im0 = dataset.preprocess()
        # 추론
        t1 = time.time()
        with torch.no_grad():  # 그래디언트를 계산하면 GPU 메모리 누수가 발생할 수 있습니다
            self.pred = self.model(self.img)[0]
        t2 = time.time()
        # NMS 적용
        self.pred = non_max_suppression(self.pred, conf_thres=conf_thres)
        t3 = time.time()
        # 검출 처리
        bbox = None  # 최대 Confidence를 가진 검출 객체의 바운딩 상자
        cropped_img = None  # 최대 Confidence를 가진 검출 객체를 자른 이미지
        det_conf = None  # 최대 Confidence를 가진 검출 객체의 신뢰 수준
        self.det = self.pred[0]  # pred[0] - NMX suppr는 이미지 당 1개의 텐서를 반환합니다;
        if len(self.det):
            # img_size에서 im0 크기로 상자 크기 조정
            self.det[:, :4] = scale_coords(self.img.shape[2:], self.det[:, :4], self.im0.shape).round()
            # 결과 출력
            print_strng = ""
            for c in self.det[:, -1].unique():
                n = (self.det[:, -1] == c).sum()  # 클래스 당 검출
                print_strng += f"{n} {self.names[int(c)]}{'s' * (n > 1)}"  # 문자열에 추가
            # 시간 출력(추론 + NMS)
            print(
                f'{print_strng} 검출. ({(1E3 * (t1 - t0)):.1f}ms)-데이터 로드, ({(1E3 * (t2 - t1)):.1f}ms)-추론, ({(1E3 * (t3 - t2)):.1f}ms)-NMS')
            # 디버그 모드이면 결과를 파일에 기록
            if self.log_level:
                self.logger.debug(
                    f'{self.file_name} {print_strng} 검출. ({(1E3 * (t1 - t0)):.1f}ms)-Load data, ({(1E3 * (t2 - t1)):.1f}ms)-Inference, ({(1E3 * (t3 - t2)):.1f}ms)-NMS')
                if self.logger.getEffectiveLevel() == 10:  # 레벨 10 = 디버그
                    gn = torch.tensor(self.im0.shape)[[1, 0, 1, 0]]  # 정규화 gain whwh
                    for *xyxy, conf, cls in reversed(self.det):
                        # 바운딩 박스와 함께 xywh 형식으로 검출 저장
                        xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # 정규화된 xywh
                        line = (int(cls), np.round(conf, 3), *xywh)  # 라벨 형식
                        self.logger.debug(f"{self.file_name} {('%g ' * len(line)).rstrip() % line}")
            # 최대 Confidence를 가진 검출 찾기:
            indx = self.pred[0].argmax(0)[
                4]  # pred[0] - NMX suppr는 이미지 당 1개의 텐서를 반환; argmax(0)[4] - conf는 [x1,y1,x2,y2,conf,cls]에서 indx 4를 가짐
            max_det = self.pred[0][indx]
            # 검출 바운딩 상자와 해당 자른 이미지 수집
            bbox = max_det[:4]
            cropped_img = save_crop(max_det[:4], self.im0)
            cropped_img = cropped_img[:, :, ::-1] # BGR to RGB
            det_conf = max_det[4:5]
        print(f'검출 총 시간: {time.time() - t0:.3f}s')
        return {'file_name': self.file_name, 'orig_img': self.im0, 'cropped_img': cropped_img, 'bbox': bbox,
                'det_conf': det_conf}
```    


<div class="content-ad"></div>

디버깅 목적을 위해 로깅 감지 데이터를 파일에 활성화할 수 있는 기능을 추가했습니다. 각 파일의 최대 크기는 25Mb이며 최대 10개의 파일을 저장한 후 덮어쓰기합니다.

현재 작업에서는 감지기가 가장 높은 신뢰 점수를 가진 단일 감지만 반환하도록 설정해야 합니다. 감지기는 원본 이미지, 해당 경계 상자와 함께 자르기 감지된 영역, 신뢰 점수, 그리고 디버깅을 용이하게 하기 위해 각 이미지마다 생성된 고유한 이름을 출력합니다.

번호판 영역 이미지 전처리

일반적으로 다음 단계는 특정 이미지 전처리(예: RGB에서 그레이스케일로 변환, 노이즈 제거, 침식 + 팽창, 임계 처리, 히스토그램 평활화 등)를 수행하여 다음 OCR 단계를 위해 준비하는 것입니다. 전처리 작업은 OCR 솔루션 및 촬영 조건에 매우 의존하며 이에 맞게 조정됩니다. 그러나 EasyOCR로 이 기준 버전을 수행 중이며(나중에 사용자 지정 솔루션으로 대체해야 합니다), 저는 그레이스케일 변환 및 투영 프로필 방법을 이용한 기울기 보정이라는 두 가지 범용적인 단계로 전처리를 제한하기로 결정했습니다.

<div class="content-ad"></div>

여기서는 평면 각도 보정을 사용하고 있지만 나중에는 원래의 번호판 모서리 탐지기와 호모그래피 계산 및 원근 변환을 사용한 보정으로 업데이트해야 합니다.

```js
# Skew Correction (projection profile)
def _find_score(arr, angle):
    data = rotate(arr, angle, reshape=False, order=0)
    hist = np.sum(data, axis=1)
    score = np.sum((hist[1:] - hist[:-1]) ** 2)
    return hist, score

def _find_angle(img, delta=0.5, limit=10):
    angles = np.arange(-limit, limit+delta, delta)
    scores = []
    for angle in angles:
        hist, score = _find_score(img, angle)
        scores.append(score)
    best_score = max(scores)
    best_angle = angles[scores.index(best_score)]
    print(f'Best angle: {best_angle}')
    return best_angle

def correct_skew(img):
    # correctskew
    best_angle = _find_angle(img)
    data = rotate(img, best_angle, reshape=False, order=0)
    return data
```

![이미지](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_13.png)

위 이미지 처리 단계 이후에는 인식을 위해 충분히 좋은 이미지로 간주할 수 있습니다.

<div class="content-ad"></div>

번호판 인식 (OCR)

기준으로 EasyOCR 솔루션을 사용하기로 결정했어요. 쓰기 편하고 인식 정확도가 높아서 그리고 지루한 테서랙트에 비해 내가 알고 있는 괜찮은 대체재인 것 같아서요)

EasyOCR을 이용한 번호판 인식을 위한 간단한 래퍼 클래스:

```js
class EasyOcr():
    def __init__(self, lang = ['en'], allow_list = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', min_size=50, log_level='INFO', log_dir = './logs/'):
        self.reader = easyocr.Reader(lang, gpu=False)
        self.allow_list = allow_list
        self.min_size = min_size
        self.log_level = log_level
        if self.log_level:
            self.num_log_level = getattr(logging, log_level.upper(),
                                         20)  ## log_level 입력 문자열을 로깅 모듈에서 허용하는 값 중 하나로 변환하고, 만약 없으면 20(INFO)으로 설정
            self.log_dir = log_dir
            # 로거 설정
            log_formatter = logging.Formatter("%(asctime)s %(message)s")
            logFile = self.log_dir + 'ocr.log'
            my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=25 * 1024 * 1024,
                                             backupCount=10, encoding='utf-8', delay=False)
            my_handler.setFormatter(log_formatter)
            my_handler.setLevel(self.num_log_level)
            self.logger = logging.getLogger(__name__)  
            self.logger.setLevel(self.num_log_level)
            self.logger.addHandler(my_handler)

    def run(self, detect_result_dict):
        if detect_result_dict['cropped_img'] is not None:
            t0 = time.time()
            img = detect_result_dict['cropped_img']
            img = ocr_img_preprocess(img)
            file_name = detect_result_dict.get('file_name')
            ocr_result = self.reader.readtext(img, allowlist = self.allow_list, min_size=self.min_size)
            text = [x[1] for x in ocr_result]
            confid = [x[2] for x in ocr_result]
            text = "".join(text) if len(text) > 0 else None
            confid = np.round(np.mean(confid), 2) if len(confid) > 0 else None   
            t1 = time.time()
            print(f'인식된 번호판: {text}, 신뢰도: {confid}.\nOCR 총 시간: {(t1 - t0):.3f}s')
            if self.log_level:
                # 디버그 모드일 때 결과를 파일에 작성
                self.logger.debug(f'{file_name} 인식된 번호판: {text}, 신뢰도: {confid}, OCR 총 시간: {(t1 - t0):.3f}s.')

            return {'text': text, 'confid': confid}
        else:
            return {'text': None, 'confid': None}
```

<div class="content-ad"></div>

디버그 목적으로 Detector와 마찬가지로 OCR 데이터를 파일에 기록할 수 있는 기능도 추가되었다.

인식 모듈은 인식된 문자열과 신뢰도 점수를 반환합니다.

검증 및 조치

검출된 번호판에서 성공적으로 인식된 텍스트를 가져왔으면, 이를 확인하고 일부 조치를 취해야 합니다. 번호판 확인 단계에서 가장 합리적인 일은 고객이 업데이트하는 데이터베이스를 사용하는 것입니다. 이 데이터베이스는 매번 또는 하루에 한 번씩 읽어서 로컬 저장소에 목록을 저장할 것입니다. 현재 기준 버전에서 데이터베이스를 설정하지 않고 주요 기능에 집중하기로 결정했습니다. 대신 Google Sheets를 예시로 사용할 것입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_14.png" />

이 순간에는 아무런 조치 단계가 설정되어 있지 않습니다. 허용 목록에 있는 라이선스 번호 확인 결과만 표시됩니다. 하지만 라즈베리파이를 사용하면 GPIO 제어 릴레이 스위치를 통해 어떤 하중이든 매우 쉽게 작동시킬 수 있습니다.

시각화

해결책을 편안하게 모니터링하고 디버그할 수 있도록 시각화 모듈을 추가했습니다. 이 모듈은 번호판 인식 프로세스 표시, 입력 이미지 저장, 검출된 번호판이 있는 자르기된 영역 및 출력 결과 이미지 표시를 처리합니다. 또한, e-ink 스크린에 번호판 영역 및 인식된 텍스트를 표시하는 기능을 추가했습니다.

<div class="content-ad"></div>

현재, 편의를 위해 이미지는 압축된 JPG로 저장되며 로그 폴더에 10800개의 이미지가 한정된 양으로 저장됩니다(폴더 최대 크기 약 500Mb). 프로덕션 솔루션에서 시각화가 필요하지 않으며, 디버깅을 위해 이미지는 NumPy ndarrays나 이진 문자열에 저장하는 것이 더 좋습니다.

```js
class Visualize():
    def __init__(self, im0, file_name, cropped_img=None, bbox=None, det_conf=None, ocr_num=None, ocr_conf=None, num_check_response=None, out_img_size=(720,1280), outp_orig_img_size = 640, log_dir ='./logs/', save_jpg_qual = 65, log_img_qnt_limit = 10800):
        self.im0 = im0
        self.input_img = im0.copy()
        self.file_name = file_name
        self.cropped_img = cropped_img
        self.bbox = bbox
        self.det_conf = det_conf
        self.ocr_num = ocr_num
        self.ocr_conf = ocr_conf
        self.num_check_response = num_check_response
        self.out_img_size = out_img_size
        self.save_jpg_qual = save_jpg_qual
        self.log_dir = log_dir
        self.imgs_log_dir = self.log_dir + 'imgs/'
        os.makedirs(os.path.dirname(self.imgs_log_dir), exist_ok=True)
        self.crop_imgs_log_dir = self.log_dir + 'imgs/crop/'
        os.makedirs(os.path.dirname(self.crop_imgs_log_dir), exist_ok=True)
        self.orig_imgs_log_dir = self.log_dir + 'imgs/inp/'
        os.makedirs(os.path.dirname(self.orig_imgs_log_dir), exist_ok=True)
        self.log_img_qnt_limit = log_img_qnt_limit

        # Create blank image
        h, w = self.out_img_size
        self.img = np.zeros((h, w, 3), np.uint8)
        self.img[:, :] = (255, 255, 255)

        # Draw bounding box on top the image
        if (self.bbox is not None) and (self.det_conf is not None):
            label = f'{self.det_conf.item():.2f}'
            color = [0, 255, 127]
            plot_one_box(self.bbox, self.im0, label=label, color=color, line_thickness=3)

        # Resize img width to fit the plot, keep origin aspect ratio
        h0, w0 = im0.shape[:2]
        aspect = w0 / h0
        if aspect > 1:  # horizontal image
            new_w = outp_orig_img_size
            new_h = np.round(new_w / aspect).astype(int)
        elif aspect < 1:  # vertical image
            new_h = outp_orig_img_size
            new_w = np.round(new_h * aspect).astype(int)
        else:  # square image
            new_h, new_w = outp_orig_img_size, outp_orig_img_size
        self.im0 = cv2.resize(self.im0, (new_w, new_h), interpolation=cv2.INTER_AREA)
        im0_h, im0_w = self.im0.shape[:2]

        # Add original full image
        im0_offset = 0
        self.img[im0_offset:im0_h + im0_offset, im0_offset:im0_w + im0_offset] = self.im0

        # Add cropped image with detected number bbox
        if self.cropped_img is not None:
            # Resize cropped img
            target_width = int((w - (im0_w + im0_offset)) / 3)
            r = target_width / self.cropped_img.shape[1]
            dim = (target_width, int(self.cropped_img.shape[0] * r))
            self.cropped_img = cv2.resize(self.cropped_img, dim, interpolation=cv2.INTER_AREA)
            crop_h, crop_w = self.cropped_img.shape[:2]
            # Add cropped img
            crop_h_y1 = int(h/7)
            crop_w_x1 = im0_w + im0_offset + int((w - (im0_w + im0_offset) - crop_w) / 2)
            self.img[crop_h_y1:crop_h + crop_h_y1, crop_w_x1:crop_w + crop_w_x1] = self.cropped_img
            # Add `_det` to filename
            self.file_name = Path(self.file_name).stem + "_det" + Path(self.file_name).suffix

        # Add ocr recognized number
        if self.ocr_num is not None:
            label = f"{self.ocr_num} ({self.ocr_conf})"
            t_thickn = 2  # text font thickness in px
            font = cv2.FONT_HERSHEY_SIMPLEX  # font
            fontScale = 1.05
            # calculate position
            text_size = cv2.getTextSize(label, font, fontScale=fontScale, thickness=t_thickn)[0]
            w_center = int((im0_w + im0_offset + w)/2)
            ocr_w_x1 = int(w_center - text_size[0]/2)
            ocr_h_y1 = int(crop_h_y1 + crop_h + 55)
            org = (ocr_w_x1, ocr_h_y1)  # position
            # Plot text on img
            cv2.putText(self.img, label, org, font, fontScale,  color=(0, 0, 0), thickness=t_thickn, lineType=cv2.LINE_AA)

        # Add number check response if in allowed list
        if self.num_check_response == 'Allowed':
            label = "-=Allowed=-"
            fontColor = (0,255,0)
        else:
            label = "-=Prohibited!=-"
            fontColor = (0,0,255)
        t_thickn = 2  # text font thickness in px
        font = cv2.FONT_HERSHEY_SIMPLEX  # font
        fontScale = 1.05
        # calculate position
        text_size = cv2.getTextSize(label, font, fontScale=fontScale, thickness=t_thickn)[0]
        w_center = int((im0_w + im0_offset + w) / 2)
        response_w_x1 = int(w_center - text_size[0] / 2)
        response_h_y1 = int(h*3/7) #TBD
        org = (response_w_x1, response_h_y1)  # position
        # Plot text on img
        cv2.putText(self.img, label, org, font, fontScale, color=fontColor, thickness=t_thickn, lineType=cv2.LINE_AA)

    def show(self):
        # Show the image
        cv2.imshow('image', self.img)

    def save(self):
        # Remove oldest file if reach quantity limit
        if self.get_dir_file_quantity(self.imgs_log_dir) > self.log_img_qnt_limit:
            oldest_file = sorted([self.imgs_log_dir+f for f in os.listdir(self.imgs_log_dir)])[
                0]  
            os.remove(oldest_file)
        # Write compressed jpeg with results
        cv2.imwrite(f"{self.imgs_log_dir}{self.file_name}", self.img, [int(cv2.IMWRITE_JPEG_QUALITY), self.save_jpg_qual])

    def save_input(self):
        if self.input_img is not None:
            # Remove oldest file if reach quantity limit
            if self.get_dir_file_quantity(self.orig_imgs_log_dir) > self.log_img_qnt_limit:
                oldest_file = sorted([self.orig_imgs_log_dir+f for f in os.listdir(self.orig_imgs_log_dir)])[
                    0]  
                os.remove(oldest_file)
            # Write compressed jpeg with results
            cv2.imwrite(f"{self.orig_imgs_log_dir}orig_inp_{self.file_name}", self.input_img)

    def save_crop(self):
        if self.cropped_img is not None:
            # Remove oldest file if reach quantity limit
            if self.get_dir_file_quantity(self.crop_imgs_log_dir) > self.log_img_qnt_limit:
                oldest_file = sorted([self.crop_imgs_log_dir+f for f in os.listdir(self.crop_imgs_log_dir)])[
                    0]  
                os.remove(oldest_file)
            # Write compressed jpeg with results
            cv2.imwrite(f"{self.crop_imgs_log_dir}crop_{self.file_name}", self.cropped_img)

    def display(self):
        # Display img using e-ink display 176*264
        disp_img = np.zeros((epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT,3), np.uint8)
        disp_img[:, :] = (255, 255, 255)
        
        if self.cropped_img is not None:
            # Add cropped number
            crop_resized = cv2.resize(self.cropped_img, (epd2in7.EPD_HEIGHT-4, 85), interpolation=cv2.INTER_AREA)
            crop_resized_h, crop_resized_w = crop_resized.shape[:2]
            crop_w_x1 = int(epd2in7.EPD_HEIGHT/2 - crop_resized_w/2)
            disp_img[2:crop_resized_h+2, crop_w_x1:crop_resized_w+crop_w_x1] = crop_resized
        
        if

<div class="content-ad"></div>

지금까지 이룩한 것을 시험해 봅시다. 정지 이미지에서의 탐지 및 인식 파이프라인:

![image1](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_15.png)

길거리에서 기기 카메라를 사용한 종단간 솔루션 테스트:

![image2](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_16.png)

<div class="content-ad"></div>

```
![Image 1](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_17.png)

![Image 2](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_18.png)

![Image 3](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_19.png)

Performance


<div class="content-ad"></div>

현재 구성으로는 감지에 약 700~800ms, OCR 단계에 약 900~1200ms가 소요되며, 평균 FPS는 약 0.4~0.5입니다.

![이미지](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_20.png)

현재 주차 장벽 자동화 프로젝트에는 이러한 프레임 속도 값이 중요하지 않지만, 개선할 여지가 분명히 많습니다.

htop에서 CPU 활용률이 거의 100%에 가깝다는 것을 알 수 있습니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_21.png)

모든 테스트는 Raspberry Pi OS의 기본 설정으로 수행되었습니다. UI를 비활성화하고 기본적으로 활성화된 다른 백그라운드 서비스를 모두 제거하면 성능과 안정성이 높아집니다.

보너스

추가 조정 없이도 우리의 감지기 모듈은 LEGO 자동차의 번호판을 완벽하게 감지할 수 있다는 것이 밝혀졌습니다.

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_22.png)

![이미지2](/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_23.png)

그래서 레고를 아들에게 빌려 Raspberry Pi Build Hat을 사용하여 나만의 주차장 바리어를 만들기로 결정했고, "실제" 조건에서 완전한 엔드 투 엔드 테스트를 제공하기로 했습니다.

LEG 월드 햇 프로프라이어터리 라이브러리를 기반으로 한 Action 모듈용 간단한 랩퍼:


<div class="content-ad"></div>

```python
class Action():
    def __init__(self):
        self.motor = Motor('A')
        self.motor.set_default_speed(25)
        self.matrix = Matrix('B')
        self.ok_color = [[(6, 10) for x in range(3)] for y in range(3)]
        self.nok_color = [[(9, 10) for x in range(3)] for y in range(3)]
        self.matrix.set_transition(2) #fade-in/out
        self.matrix.set_pixel((1, 1), ("blue", 10))

    def _handle_motor(self, speed, pos, apos):
        print("Motor:", speed, pos, apos)

    def run(self, action_status):
        while True:
            if action_status[0] == 'Allowed':
                self.matrix.set_pixels(self.ok_color)
                time.sleep(1)
                self.motor.run_for_degrees(-90, blocking=False)
                time.sleep(5)
                self.motor.run_for_degrees(90, blocking=False)
                time.sleep(1)
            elif action_status[0] == 'Prohibited':
                self.matrix.set_pixels(self.nok_color)
                time.sleep(3)
            else:
                self.matrix.clear()
                self.matrix.set_pixel((1, 1), ("blue", 10))
                time.sleep(1)
                self.matrix.set_pixel((1, 1), (0, 10))
                time.sleep(1)
```

Main 프로그램에서 action_status가 감지되고 변경될 때 메인 프로그램에서 액션을 트리거하여 병렬 스레드에서 이 모듈을 실행합니다.

<img src="/assets/img/2024-06-20-AutomaticNumberPlateRecognitionwithRaspberryPi_24.png" />

LEGO 번호판 중 하나를 Google 시트 "데이터베이스"에 추가했으므로 이제 모든 조각들을 함께 조합하여 실행할 수 있습니다.

<div class="content-ad"></div>

<img src="https://miro.medium.com/v2/resize:fit:1400/1*ZHTFqk1E0pKLGAht0W_mnw.gif" />

# 최종 결론

전반적으로 라즈베리 파이를 사용하여 주차장 장벽을 제어하기 위한 자동 번호판 인식 시스템을 완전히 구현하는 데 성공했습니다.

강조해야 할 문제 중 하나는 처리 속도가 느린 관계로 이미지 지연이 발생할 수 있다는 점입니다. 카메라는 자체 버퍼가 있으며 이미지를 느린 속도로 캡처하는 동안 씬이 변경되어도 버퍼에서 여전히 "이전" 프레임을 읽는 문제가 있습니다. 현재 사용 사례에서는 그다지 중요하지 않지만 개선을 위해 전체 처리 시간과 거의 동일한 간격으로 프레임 스킵을 추가했습니다. 이렇게 하면 더 빠른 프레임 읽기와 버퍼의 정리가 가능하며 CPU의 부하를 줄일 수 있습니다. 그러나 지연 없이 거의 실시간 스무스한 이미지 스트리밍이 필요하다면 최상의 옵션은 카메라 읽기를 별도의 병렬 스레드로 설정하여 버퍼에서 가능한 최대 속도로 프레임을 읽도록 하는 것이며, 주 프로그램이 필요 시에만 이 프로세스에서 프레임을 가져 올 수 있도록 합니다. 그러나 파이썬에서 멀티 스레딩은 실제 다중 프로세스 처리가 아니라 아키텍처적 관점에서 코드를 보다 명확하게 조직화하고 실행하는 데 도움이 되는 시뮬레이션인 것을 기억해야 합니다.

<div class="content-ad"></div>

# 추가 단계

- OCR. 현재 병목 현상인 OCR을 빠르게 처리할 수 있도록 개선해보세요. 나는 속도를 올리기 위해 작은 커스텀 RNN 기반 모델을 개발하기로 했습니다. 시간이 중요하지 않고 정확도만 필요한 경우 EasyOCR에서 다양한 모델을 사용하고 이를 여러분의 사례에 맞게 튜닝할 수 있습니다. 또는 WPOD-NET과 같은 다른 솔루션을 시도해볼 수도 있습니다. 또한 인식 품질을 향상시키는 중요한 포인트로는 정확한 사용 사례에 맞게 이미지 전처리를 조정하는 것이 있습니다.
- Detector. 속도를 높이기 위해 카메라가 근거리에 있는 자동차에서만 작업해야 하는 경우 해상도가 높은 이미지가 필요하지 않습니다. 또 다른 옵션은 가능하다면 카메라와 차량의 위치가 대략 고정되어 있다면 전체 프레임이 아닌 번호판이 위치할 것으로 예상되는 영역만 캡처할 수 있습니다.

나중에 이 두 모델 모두 전이 학습, 양자화, 가지치기 및 기타 방법을 사용하여 경량화하고 엣지 장치에서 더 빠르고 가벼운 작동이 가능하도록 할 수 있습니다.

그러나 아무리 빠른 실시간 처리가 필수적이더라도 (물론 자동 주차 장벽에는 해당하지 않을 것입니다), 텐서 코어가 있는 장치가 없으면 NVIDIA Jetson과 같은 장치가 없으면 속도와 품질 사이에 항상 트레이드오프가 존재할 것입니다. CPU 전용 장치에서는 항상 속도와 품질 사이의 교환 관계가 발생할 것입니다.

<div class="content-ad"></div>

더 개선할 수 있는 다른 옵션이 있어요 — 현재 상황에서는 CPU를 24시간 7일 돌릴 필요가 없어요. 자동차가 다가올 때만 PIR 또는 IR 센서에 의해 카메라가 작동될 수 있어요.

다음 번에 구현해보려고 하는 마지막 포인트 — 솔루션을 마이크로서비스로 전환하고 생산자-소비자 데이터 흐름 패턴을 구현할 거예요.

그럼 이만 하겠습니다. 이 긴 지루한 프로젝트 구현 설명을 읽어 주셔서 감사해요.

건강하게 지내시고 우크라이나를 응원해주세요 ❤.

<div class="content-ad"></div>

# 프로젝트에서 사용된 장비에 대한 링크:

- Raspberry Pi 4 Model B 4GB
- Raspberry Pi Camera Module v2
- Raspberry Pi 4 Aluminum Case with Dual Cooling Fan
- GeeekPi(52pi) Raspberry Pi UPS EP-0136
- 264x176 2.7인치 E-Ink 디스플레이 HAT for Raspberry Pi
- Raspberry Pi Build HAT
- LEGO 3x3 컬러 라이트 매트릭스
- LEGO 작은 테크닉 직각 모터