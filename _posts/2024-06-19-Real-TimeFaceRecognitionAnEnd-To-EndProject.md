---
title: "실시간 얼굴 인식 끝에서 끝까지의 프로젝트"
description: ""
coverImage: "/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_0.png"
date: 2024-06-19 06:12
ogImage: 
  url: /assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_0.png
tag: Tech
originalTitle: "Real-Time Face Recognition: An End-To-End Project"
link: "https://medium.com/towards-data-science/real-time-face-recognition-an-end-to-end-project-b738bb0f7348"
---


단계별로 배우세요! PiCam을 사용하여 실시간으로 얼굴을 인식하는 방법을 배워보세요.

![PiCam Image](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_0.png)

# 1. 소개

OpenCV를 탐구하는 내 교재에서는 자동 비전 객체 추적을 배웠습니다. 이제 PiCam을 사용하여 실시간으로 얼굴을 인식해보겠습니다. 위에서 볼 수 있듯이, 함께해요!

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_1.png)

이 프로젝트는 이 훌륭한 "Open Source Computer Vision Library" 인 OpenCV를 사용하여 수행되었습니다. 이 튜토리얼에서는 Raspberry Pi (즉, Raspbian을 사용한 OS)와 Python에 중점을 두지만 Mac에서 코드를 테스트하고 또한 잘 작동하는 것을 확인했습니다.

OpenCV는 계산 효율성을 위해 설계되었으며 실시간 애플리케이션에 중점을 두고 있습니다. 따라서 카메라를 사용한 실시간 얼굴 인식에 적합합니다.

## 3 단계


<div class="content-ad"></div>

얼굴인식에 대한 완전한 프로젝트를 생성하려면 3가지 매우 다른 단계에서 작업해야 합니다:

- 얼굴 감지 및 데이터 수집
- 인식기 훈련
- 얼굴 인식

다음 블록 다이어그램은 이러한 단계들을 요약합니다:

![Face Recognition Project Phases](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_2.png)

<div class="content-ad"></div>

# 2. OpenCV 3 패키지 설치

저는 최신 버전의 라스비안(Stretch)이 설치된 라즈베리 파이 V3를 사용하고 있습니다. 따라서 OpenCV를 설치하는 가장 좋은 방법은 Adrian Rosebrock이 개발한 훌륭한 튜토리얼을 따라하는 것입니다: "Raspbian Stretch: 라즈베리 파이에 OpenCV 3 + Python 설치".

Adrian의 튜토리얼을 완료하면 라즈베리 파이에서 실험을 실행할 준비가 된 OpenCV 가상 환경이 준비됩니다.

이제 가상 환경으로 이동하여 OpenCV 3이 올바르게 설치되었는지 확인해 보겠습니다.

<div class="content-ad"></div>

에드리안이 새 터미널을 열 때마다 "source" 명령을 실행하여 시스템 변수가 올바르게 설정되었는지 확인하는 것을 권장합니다.

```js
source ~/.profile
```

다음으로, 가상 환경에 들어가 봅시다:

```js
workon cv
```

<div class="content-ad"></div>

만약 당신이 cv 가상환경 앞에 있는 텍스트를 보신다면, cv 가상환경 안에 있습니다:

```js
(cv) pi@raspberry:~$
```

이제 파이썬 인터프리터로 들어가보세요:

```js
python
```

<div class="content-ad"></div>

저희가 현재 3.5 버전 (또는 그 이상)을 실행 중이라고 확인해주세요.

인터프리터 안에 ( 가 표시될 것입니다), OpenCV 라이브러리를 import 해주세요:

```js
import cv2
```

만약 에러 메시지가 나타나지 않는다면, OpenCV가 정확하게 파이썬 가상 환경에 설치된 것입니다.

<div class="content-ad"></div>

설치된 OpenCV 버전을 확인할 수도 있어요:

```js
cv2.__version__
```

3.3.0이 표시되어야 해요 (또는 미래에 출시될 우수한 버전). 

<img src="/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_3.png" />

<div class="content-ad"></div>

위의 터미널 스크린샷은 이전 단계를 보여줍니다.

# 3. 카메라 테스트

RPi에 OpenCV를 설치했다면 카메라가 제대로 작동하는지 확인하기 위해 테스트를 해봅시다.

이미 PiCam을 설치하고 활성화했다는 것을 전제로 합니다.

<div class="content-ad"></div>

아래 Python 코드를 IDE에 입력해보세요:

```js
import numpy as np
import cv2
cap = cv2.VideoCapture(0)
cap.set(3,640) # 너비 설정
cap.set(4,480) # 높이 설정
while(True):
    ret, frame = cap.read()
    frame = cv2.flip(frame, -1) # 카메라 세로로 뒤집기
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    cv2.imshow('frame', frame)
    cv2.imshow('gray', gray)
    
    k = cv2.waitKey(30) & 0xff
    if k == 27: # 'ESC' 키를 눌러 종료
        break
cap.release()
cv2.destroyAllWindows()
```

위 코드는 PiCam에서 생성된 비디오 스트림을 캡처하여 BGR 색상과 회색 모드로 모두 표시합니다.

또는 GitHub에서 코드를 다운로드할 수도 있습니다: simpleCamTest.py

<div class="content-ad"></div>

해당 스크립트를 실행하려면 다음 명령어를 입력해주세요:

```js
python simpleCamTest.py
```

<img src="/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_4.png" />

위의 그림은 결과를 보여줍니다.

<div class="content-ad"></div>

일부 사용자가 카메라를 열려고 시도할 때 문제가 발생하고 "Assertion failed" 오류 메시지가 표시된다는 것을 발겠어요. 이것은 카메라가 OpenCV 설치 중에 활성화되지 않았거나 카메라 드라이버가 올바르게 설치되지 않아 발생할 수 있습니다. 수정하려면 다음 명령을 사용하세요:

```js
sudo modprobe bcm2835-v4l2
```

OpenCV에 대해 더 알고 싶다면 다음 튜토리얼을 참고해보세요: loading-video-python-opencv-tutorial

# 4. 얼굴 인식

<div class="content-ad"></div>

Face Recognition에서 가장 기본적인 작업은 물론 "얼굴 감지"입니다. 무엇보다 먼저, 미래에 캡처된 새 얼굴과 비교할 수 있도록 얼굴을 캡처해야 합니다(Phase 1).

(혹시 이전에 말한 'Capture'부분 해석이 잘못된 것 같아 원문에서 대체했습니다.)

한 객체를 감지하는 가장 일반적인 방법은 "Haar Cascade classifier"를 사용하는 것입니다.

"Haar 특징 기반 캐스케이드 분류기"를 사용한 객체 감지는 Paul Viola와 Michael Jones가 2001년에 발표한 논문 "Rapid Object Detection using a Boosted Cascade of Simple Features"에서 제안된 효과적인 객체 감지 방법입니다. 이는 많은 양의 긍정 이미지와 부정 이미지로부터 케스케이드 함수가 훈련된 기계 학습 기반 방법으로, 다른 이미지에서 객체를 감지하는 데 사용됩니다.

여기서는 얼굴 감지 작업을 수행할 것입니다. 먼저, 알고리즘에는 분류기를 훈련시키기 위해 많은 양의 양성 이미지(얼굴 이미지)와 음성 이미지(얼굴이 없는 이미지)가 필요합니다. 그런 다음 그로부터 특징을 추출해야 합니다. 좋은 소식은 OpenCV에 트레이너와 탐지기가 함께 제공된다는 것입니다. 자동차, 비행기 등의 모든 객체에 대해 자체 분류기를 훈련시키고 싶다면 OpenCV를 사용해 생성할 수 있습니다. 자세한 내용은 여기를 참고하십시오: 캐스케이드 분류기 훈련.

<div class="content-ad"></div>

만약 여러분이 자체 분류기를 만들고 싶지 않다면, OpenCV에는 이미 얼굴, 눈, 웃음 등을 위한 사전 훈련된 분류기가 많이 포함되어 있습니다. 이러한 XML 파일은 haarcascades 디렉토리에서 다운로드할 수 있습니다.

이론은 이만하고, 이제 OpenCV를 사용하여 얼굴 탐지기를 만들어 봅시다!

제 GitHub에서 파일 faceDetection.py를 다운로드하세요.

```python
import numpy as np
import cv2
faceCascade = cv2.CascadeClassifier('Cascades/haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)
cap.set(3,640) # 너비 설정
cap.set(4,480) # 높이 설정
while True:
    ret, img = cap.read()
    img = cv2.flip(img, -1)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(20, 20)
    )
    for (x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]
    cv2.imshow('video',img)
    k = cv2.waitKey(30) & 0xff
    if k == 27: # 'ESC'를 눌러 종료
        break
cap.release()
cv2.destroyAllWindows()
```

<div class="content-ad"></div>

믿을 수 있건대, Python과 OpenCV를 사용하여 얼굴을 감지하는 데 필요한 코드는 바로 위의 몇 줄 뿐입니다.

카메라를 테스트하는 데 사용된 마지막 코드와 비교해보면, 약간의 부분이 추가되었음을 깨달을 것입니다. 아래의 줄을 주목해주세요:

```js
faceCascade = cv2.CascadeClassifier('Cascades/haarcascade_frontalface_default.xml')
```

이 줄은 "classifier"를 로드하는 줄입니다 (프로젝트 디렉토리 하위에 "Cascades/"라는 디렉토리에 있어야 합니다).

<div class="content-ad"></div>

그럼, 우리는 카메라를 설정하고 루프 내에서 입력 비디오를 회색조 모드로 불러올 것입니다 (이전에 보았던 것과 동일합니다).

이제 분류기 함수를 호출해야 하는데, 이때 매우 중요한 매개변수들을 전달해주어야 합니다. 이들은 scale factor, 이웃의 수, 그리고 감지된 얼굴의 최소 크기입니다.

```js
faces = faceCascade.detectMultiScale(
        gray,     
        scaleFactor=1.2,
        minNeighbors=5,     
        minSize=(20, 20)
        )
```

여기서,

<div class="content-ad"></div>

- gray는 입력 그레이스케일 이미지입니다.
- scaleFactor는 각 이미지 스케일에서 이미지 크기가 감소하는 정도를 지정하는 매개 변수입니다. 스케일 피라미드를 만드는 데 사용됩니다.
- minNeighbors는 각 후보 사각형이 유지해야 하는 이웃 수를 지정하는 매개 변수입니다. 숫자가 높을수록 낮은 거짓 양성이 발생합니다.
- minSize는 고려해야 할 최소 사각형 크기입니다.

함수는 이미지에서 얼굴을 감지합니다. 다음으로 이미지에서 얼굴을 "표시"해야 합니다. 예를 들어, 파란색 사각형 등을 사용합니다. 이 작업은 다음 코드 부분으로 수행됩니다:

```js
for (x,y,w,h) in faces:
    cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
    roi_gray = gray[y:y+h, x:x+w]
    roi_color = img[y:y+h, x:x+w]
```

얼굴이 발견되면, 감지된 얼굴의 위치를 왼쪽 위 모서리인 (x,y)로 하는 네모 상자로 반환하며, "w"를 너비, "h"를 높이로 가집니다 == (x, y, w, h). 사진을 참조하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_5.png" />

이 위치들을 얻으면, 얼굴을 위한 "ROI" (사각형으로 그린)를 만들고 imshow() 함수를 사용하여 결과를 표시할 수 있습니다.

Rpi 터미널을 사용하여 위의 Python 스크립트를 Python 환경에서 실행해보세요:

```js
python faceDetection.py
```

<div class="content-ad"></div>

결과:

<img src="/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_6.png" />

당신은 "눈 탐지" 또는 "미소 탐지"를 위한 분류기도 포함할 수 있습니다. 해당 경우에는 얼굴 루프 내에 분류기 함수와 사각형 그리기를 포함해야 합니다. 왜냐하면 얼굴 외부에서 눈이나 미소를 탐지하는 것은 의미가 없기 때문입니다.

## 예시

<div class="content-ad"></div>

내 GitHub에서 다른 예제들을 찾을 수 있어요:

- faceEyeDetection.py
- faceSmileDetection.py
- faceSmileEyeDetection.py

그리고 사진에서 결과를 확인할 수 있어요.

![image](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_7.png)

<div class="content-ad"></div>

아래 튜토리얼을 따라해서 얼굴 감지에 대해 더 잘 이해할 수 있어요:

Haar Cascade Object Detection Face & Eye OpenCV Python Tutorial

# 5. 데이터 수집

우선, 사진을 통한 얼굴 인식에 대한 람리즈 라자의 훌륭한 작업에 감사드려야 해요!

<div class="content-ad"></div>

OPENCV와 Python을 사용한 얼굴 인식: 초보자를 위한 안내서

그리고 비디오를 사용해 매우 포괄적인 튜토리얼을 개발한 Anirban Kar:

얼굴 인식 - 3 부분

두 튜토리얼을 꼭 확인해보시기를 적극 추천합니다.

<div class="content-ad"></div>

그렇게 말씀하시면 프로젝트의 첫 단계를 시작하겠습니다. 여기서 우리가 할 일은 마지막 단계(얼굴 감지)부터 시작하여 간단히 데이터 세트를 만드는 것입니다. 각 ID에 대해, 얼굴 감지에 사용된 부분이 회색으로 표시된 사진 그룹을 저장할 것입니다.

![이미지](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_8.png)

먼저, 프로젝트를 개발할 디렉터리를 만드세요. 예를 들어, FacialRecognitionProject:

```js
mkdir FacialRecognitionProject
```

<div class="content-ad"></div>

이 디렉토리에는 프로젝트용으로 만들 3개의 Python 스크립트뿐만 아니라 Facial Classifier도 저장해 두어야 해요. 이를 다운로드할 수 있는 GitHub 링크는 haarcascade_frontalface_default.xml입니다.

그리고 우리의 얼굴 샘플을 저장할 하위 디렉토리를 만들어 이름을 "dataset"으로 지어줘요:

```bash
mkdir dataset
```

그리고 저의 GitHub에서 코드를 다운로드하세요: 01_face_dataset.py

<div class="content-ad"></div>

```js
import cv2
import os
cam = cv2.VideoCapture(0)
cam.set(3, 640) # 비디오 너비 설정
cam.set(4, 480) # 비디오 높이 설정
face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
# 각 사람에 대해 하나의 숫자 얼굴 ID 입력
face_id = input('\n 사용자 ID를 입력하고 <return>을 누르세요 ==> ')
print("\n [INFO] 얼굴 캡처 초기화. 카메라를 응시하고 기다리세요 ...")
# 개별 샘플링 얼굴 카운트 초기화
count = 0
while(True):
    ret, img = cam.read()
    img = cv2.flip(img, -1) # 비디오 이미지 수직으로 뒤집기
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, 1.3, 5)
    for (x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)     
        count += 1
        # 캡처된 이미지를 데이터셋 폴더에 저장
        cv2.imwrite("dataset/User." + str(face_id) + '.' +  
                    str(count) + ".jpg", gray[y:y+h,x:x+w])
        cv2.imshow('image', img)
    k = cv2.waitKey(100) & 0xff # 'ESC' 키를 눌러 비디오 종료
    if k == 27:
        break
    elif count >= 30: # 30개의 얼굴 샘플 촬영 후 비디오 중지
         break
# 청소 조금
print("\n [INFO] 프로그램 종료 및 정리 진행")
cam.release()
cv2.destroyAllWindows()
``` 

코드는 얼굴 감지를 위한 코드와 매우 유사합니다. 추가한 부분은 "사용자 ID를 캡처하기 위한 입력 명령"이며, 이는 정수 번호(1, 2, 3 등)여야 합니다.

```js
face_id = input('\n 사용자 ID를 입력하고 <return>을 누르세요 ==> ')
```

그리고 각 캡처된 프레임마다 "데이터셋" 디렉토리에 파일로 저장해야 합니다. 

<div class="content-ad"></div>

```js
cv2.imwrite("dataset/User." + str(face_id) + '.' + str(count) + ".jpg", gray[y:y+h,x:x+w])
```

위의 파일을 저장하기 위해서는 라이브러리 "os"를 import해야 합니다. 각 파일의 이름은 다음과 같은 구조를 따릅니다:

```js
User.face_id.count.jpg
```

예를 들어, face_id가 1인 사용자의 경우, dataset/ 디렉토리에 있는 네 번째 샘플 파일은 아래와 같이 될 것입니다:

<div class="content-ad"></div>

```js
User.1.4.jpg
```

PI 사진에서 보여지는 것과 같이:


![Image](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_9.png)

내 코드에서는 각 ID로부터 30개의 샘플을 캡처하고 있습니다. 마지막 "elif"에서 이를 변경할 수 있습니다. 샘플의 수는 얼굴 샘플을 캡처하는 루프를 종료하는 데 사용됩니다.

<div class="content-ad"></div>

파이썬 스크립트를 실행하고 몇 개의 ID를 캡처하세요. 새 사용자를 집계하거나 이미 존재하는 사용자의 사진을 변경하려면 매번 스크립트를 실행해야 합니다.

# 6. 트레이너

이 두 번째 단계에서는 데이터셋에서 모든 사용자 데이터를 가져와 OpenCV Recognizer를 "트레이닝"해야 합니다. 이 작업은 특정한 OpenCV 함수를 사용하여 직접 수행됩니다. 결과는 "trainer/" 디렉토리에 저장된 .yml 파일이 될 것입니다.

![이미지](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_10.png)

<div class="content-ad"></div>

그러면, 훈련 데이터를 저장할 하위 디렉토리를 만드는 것으로 시작해봐요:

```js
mkdir trainer
```

제 GitHub에서 두 번째 파이썬 스크립트를 다운로드하실 거에요: 02_face_training.py

```js
import cv2
import numpy as np
from PIL import Image
import os
# 얼굴 이미지 데이터베이스 경로
path = 'dataset'
recognizer = cv2.face.LBPHFaceRecognizer_create()
detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml");
# 이미지 및 레이블 데이터 가져오는 함수
def getImagesAndLabels(path):
    imagePaths = [os.path.join(path,f) for f in os.listdir(path)]     
    faceSamples=[]
    ids = []
    for imagePath in imagePaths:
        PIL_img = Image.open(imagePath).convert('L') # 흑백
        img_numpy = np.array(PIL_img,'uint8')
        id = int(os.path.split(imagePath)[-1].split(".")[1])
        faces = detector.detectMultiScale(img_numpy)
        for (x,y,w,h) in faces:
            faceSamples.append(img_numpy[y:y+h,x:x+w])
            ids.append(id)
    return faceSamples,ids
print ("\n [INFO] 얼굴을 학습 중입니다. 몇 초가 걸릴 것입니다. 기다려 주세요...")
faces,ids = getImagesAndLabels(path)
recognizer.train(faces, np.array(ids))
# 모델을 trainer/trainer.yml에 저장하기
recognizer.write('trainer/trainer.yml') 
# 학습된 얼굴 수 및 프로그램 종료 출력
print("\n [INFO] {0} 개의 얼굴을 학습했습니다. 프로그램을 종료합니다.".format(len(np.unique(ids))))
```

<div class="content-ad"></div>

라즈베리파이에 PIL 라이브러리가 설치되어 있는지 확인해주세요. 만약 설치되어 있지 않다면, 아래의 명령을 터미널에서 실행해주세요:

```js
pip install pillow
```

우리는 OpenCV 패키지에 포함된 LBPH (LOCAL BINARY PATTERNS HISTOGRAMS) 얼굴 인식기(recognizer)를 사용할 것입니다. 아래와 같이 코드를 작성해주세요:

```js
recognizer = cv2.face.LBPHFaceRecognizer_create()
```

<div class="content-ad"></div>

"getImagesAndLabels (path)" 함수는 "dataset/" 디렉토리의 모든 사진을 가져와서 "Ids"와 "faces" 두 가지 배열을 반환합니다. 이 배열을 입력으로 사용하여 "인식기를 학습"할 것입니다:

```js
recognizer.train(faces, ids)
```

이 결과로 "trainer.yml"이라는 파일이 우리가 이전에 생성한 트레이너 디렉토리에 저장됩니다.

여기까지입니다! 훈련시킨 사용자의 얼굴 수를 확인하기 위해 마지막으로 출력 문을 포함했습니다.

<div class="content-ad"></div>

매번 Phase 1을 실행할 때마다 Phase 2도 실행해야 합니다.

# 7. 인식기

지금까지 우리 프로젝트의 마지막 단계에 도달했습니다. 여기서 우리는 카메라로 새로운 얼굴을 촬영하고, 이 사람이 이전에 그의 얼굴을 촬영하고 훈련했다면, 우리의 인식기는 "예측"을 수행하여 해당 ID와 일치 여부를 나타내는 지수를 반환합니다. 이로써 해당 일치에 대해 인식기가 얼마나 확신하는지 보여줍니다.

![이미지](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_11.png)

<div class="content-ad"></div>

GitHub에서 3단계 Python 스크립트를 내려받아봅시다: 03_face_recognition.py.

```python
import cv2
import numpy as np
import os 
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainer/trainer.yml')
cascadePath = "haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascadePath)
font = cv2.FONT_HERSHEY_SIMPLEX
# 아이디 카운터 초기화
id = 0
# id에 대응하는 이름: 예) Marcelo: id=1,  등
names = ['없음', '마르셀로', '파울라', '일자', 'Z', 'W'] 
# 실시간 비디오 캡처 시작
cam = cv2.VideoCapture(0)
cam.set(3, 640) # 비디오 너비 설정
cam.set(4, 480) # 비디오 높이 설정
# 얼굴 인식으로 인정할 최소 윈도우 크기 정의
minW = 0.1*cam.get(3)
minH = 0.1*cam.get(4)
while True:
    ret, img =cam.read()
    img = cv2.flip(img, -1) # 수직으로 뒤집기
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    
    faces = faceCascade.detectMultiScale( 
        gray,
        scaleFactor = 1.2,
        minNeighbors = 5,
        minSize = (int(minW), int(minH)),
       )
    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
        id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
        # 신뢰도가 100 미만이면 "0" : 완벽 일치
        if (confidence < 100):
            id = names[id]
            confidence = "  {0}%".format(round(100 - confidence))
        else:
            id = "알수없음"
            confidence = "  {0}%".format(round(100 - confidence))
        
        cv2.putText(
                    img, 
                    str(id), 
                    (x+5,y-5), 
                    font, 
                    1, 
                    (255,255,255), 
                    2
                   )
        cv2.putText(
                    img, 
                    str(confidence), 
                    (x+5,y+h-5), 
                    font, 
                    1, 
                    (255,255,0), 
                    1
                   )  
    
    cv2.imshow('camera',img) 
    k = cv2.waitKey(10) & 0xff # 'ESC'를 눌러 비디오 종료
    if k == 27:
        break
# 정리 작업
print("\n [INFO] 프로그램 종료 및 정리 작업")
cam.release()
cv2.destroyAllWindows()
```

여기에 새 배열을 추가했으므로, 숫자로 된 ID 대신 "names"를 표시할 것입니다:

```python
names = ['없음', '마르셀로', '파울라', '일자', 'Z', 'W']
```

<div class="content-ad"></div>

예를 들어, Marcelo는 id=1인 사용자이고, Paula는 id=2인 등입니다.

다음으로, 우리는 얼굴을 감지할 것이며, 이전과 같이 haasCascade 분류기를 사용할 것입니다. 감지된 얼굴을 가지고 우리는 위의 코드에서 가장 중요한 함수를 호출할 수 있습니다:

```js
id, confidence = recognizer.predict(얼굴의 회색 부분)
```

recognizer.predict()는 분석할 얼굴의 캡처된 부분을 매개변수로 사용하고, 해당 소유자와 일치에 대한 신뢰도를 나타내는 id 및 인식기의 신뢰도 값을 반환할 것입니다.

<div class="content-ad"></div>

그리고 마지막으로, 인식기가 얼굴을 예측할 수 있다면, 이미지 위에 “확률적 ID”와 일치가 올바른지에 대한 “확률”이 표시됩니다 (“확률” = 100 - 신뢰도 지수). 그렇지 않으면, “알 수 없음” 레이블이 얼굴 위에 표시됩니다.

아래는 결과를 보여주는 gif입니다:

![결과](/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_12.png)

이 사진에서는 이 프로젝트로 수행한 일부 테스트를 보여드립니다. 여기서 인식기가 작동하는지 확인하기 위해 사진을 사용했습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_13.png" />

# 8. 결론

<img src="/assets/img/2024-06-19-Real-TimeFaceRecognitionAnEnd-To-EndProject_14.png" />

언제나처럼, 이 프로젝트가 다른 사람들이 전자기술의 흥미로운 세계로 진입하는 데 도움이 되기를 바랍니다!

<div class="content-ad"></div>

세부 정보 및 최종 코드는 제 GitHub 저장소를 방문해주세요:

https://github.com/Mjrovai/OpenCV-Face-Recognition

더 많은 프로젝트를 보시려면 제 블로그를 방문해주세요: MJRoBot.org

이른 아침 인사드립니다!

<div class="content-ad"></div>

다음 글에서 봐요!

감사합니다,

마르셀로