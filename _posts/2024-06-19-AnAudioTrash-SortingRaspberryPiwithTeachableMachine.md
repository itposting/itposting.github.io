---
title: "음성 쓰레기 분류 라즈베리 파이와 티처블 머신"
description: ""
coverImage: "/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_0.png"
date: 2024-06-19 02:46
ogImage: 
  url: /assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_0.png
tag: Tech
originalTitle: "An Audio Trash-Sorting Raspberry Pi with Teachable Machine"
link: "https://medium.com/geekculture/an-audio-trash-sorting-raspberry-pi-with-teachable-machine-5cd7f9f8867a"
---



![이미지](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_0.png)

전 세계적으로 매년 20억 톤의 가정 폐기물이 생산됩니다. 이것은 우리 환경에 무거운 부담을 줍니다. 매립지와 환경에 끝내 찌르는 폐기물을 줄이기 위해 전 세계 주민들은 가정 폐기물을 분리 수거해야 합니다. 그리고 쓰레기 분리는 큰 비즈니스입니다. Fortunebusinessinsights.com에 따르면, 2019년 글로벌 폐기물 분류 장비 시장은 약 7억 달러였습니다. 그리고 2027년에는 18억 달러에 이를 것으로 예상됩니다.

![이미지](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_1.png)

하지만 유감스럽게도 중국에서는 쓰레기 분리 시스템이 효과적이지 않습니다. 정책이 약하게 시행되며, 위반에 대한 처벌이 거의 없습니다. 더 나쁜 것은 쓰레기 분류가 혼란스럽습니다. 제 건물에는 섬유, 재활용, 음식물, 잔여 폐기물을 각각 수집하는 다섯 개의 용기가 있습니다. 각 라벨 아래에는 예시의 짧은 목록이 있습니다. 예를 들어, 와인과 플라스틱 병은 "재활용" 용기로 가야 합니다. 그리고 옷과 가방은 "섬유"에 속합니다.


<div class="content-ad"></div>

하지만 목록은 모든 종류의 쓰레기를 다 다루기에는 너무 짧습니다. 나는 종종 우드 또는 금속판이 어느 컨테이너에 들어가야 하는지 모르기 때문에 컨테이너 앞에서 어리둥절해졌어요. 대부분의 경우, 결국 쓰레기는 "잔여 폐기물" 농푸에 들어갑니다. 이런 경우에는 누군가가 올바른 컨테이너를 알려주면 좋겠죠? 그리고 나는 Freethink의 이 YouTube 비디오를 보았습니다.

이 비디오는 인공지능이 도와주는 로봇 쓰레기 분류 시스템을 보여줍니다. 이 시스템은 컴퓨터 비전을 사용하여 다양한 종류의 쓰레기를 인식한 다음 로봇 팔을 사용하여 분리합니다. 요즘에는 인공지능 컴퓨터 비전이 매우 정확합니다. 우리는 쓰레기 분류 문제에 대처하기 위해 완전히 활용해야 합니다.

이 비디오에 영감을 받아 나는 집에 내 쓰레기 분류 라즈베리 파이를 만들었어요 (그림 1 및 비디오 2).

시스템은 라즈베리 파이, 비디오 카메라 및 스피커로 구성되어 있습니다. 카메라가 쓰레기 물체를 "보게 되면", 라즈베리 파이는 스피커를 통해 쓰레기 카테고리를 말합니다. 컴퓨터 비전 모델은 Google의 Teachable Machine에서 훈련되었습니다. 이 기사에서 시스템을 설명합니다. 이 프로젝트의 코드는 여기 내 GitHub 저장소에 호스팅되어 있습니다.

<div class="content-ad"></div>

그리고 Teachable Machine 모델 파일은 제 Google 드라이브에 호스팅되어 있습니다.

# 1. 구성 요소

이 프로젝트에서는 Raspberry Pi 4를 사용했습니다. RAM이 4GB이고 저장 용량이 64GB입니다. 또한 Pi에 USB 비디오 카메라와 USB 스피커를 연결했습니다 (그림 1 및 3). 

![이미지](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_2.png)

<div class="content-ad"></div>

나는 Google의 Teachable Machine 프로젝트를 데스크톱 컴퓨터에서 작업했어. 그리고 나는 모델과 다른 파일을 내 집 네트워크를 통해 Raspberry Pi로 전송했어.

# 2. Teachable Machine에서 쓰레기 분류 모델 훈련하기

이 프로젝트에서, 나는 재활용 가능한(recyclable), 직물(textiles), 그리고 비어 있는(empty) 세 가지 클래스로 모델을 훈련했어. 나는 kaggle.com에서 보틀과 컵 데이터세트 그리고 의류 데이터세트(이 문서에서 설명함)를 발견했어. 나는 또한 처음 두 카테고리에 내 사진 몇 장을 추가했어. 비어 있는 카테고리에는 다양한 종류의 벽 사진을 포함했어. 이 마지막 클래스는 물체가 없을 때 시스템을 대기 상태로 만들고 싶기 때문에 필수적이야.

Teachable Machine 웹사이트로 이동해서 이미지 프로젝트를 시작해봐. 내가 언급한 세 가지 클래스를 생성해. 각 클래스에 사진을 업로드해. 또는 위에서 제공한 내 공유 모델 파일을 열어볼 수도 있어.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_3.png)

이제 Train Model 버튼을 클릭하여 훈련 프로세스를 시작할 수 있습니다. 훈련 이후 모델을 몇 장의 사진 또는 카메라를 사용하여 테스트할 수 있습니다.

![이미지](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_4.png)

결과에 만족하셨다면 Export Model 버튼을 클릭하세요. Tensorflow 탭을 선택하고 Savedmodel 옵션을 선택한 후 Download my model 버튼을 클릭하세요.


<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_5.png)

당신의 브라우저가 모델이 준비되면 다운로드가 시작됩니다.

# 3. 앱 작성

호스트 컴퓨터에서 pi_garbage_classifier라는 폴더를 만듭니다. 다운로드한 파일을 프로젝트 폴더에 압축해제합니다. 이제 app.py라는 파일을 만들어 각 부분을 조합할 것입니다. 이것은 Teachable Machine의 코드 스니펫에 기반합니다 (Figure 6). 그러나 놀랍게도 샘플 코드는 잘못되었고 오도독도 못하다. keras_model.h5를 열려고 시도했지만 다운로드한 모델은 model.savedmodel이라는 이름입니다.


<div class="content-ad"></div>

여기는 app.py의 코드입니다.

```python
import cv2
import numpy as np
from keras.models import load_model
import os
import time
import re
import sys

pathname = os.path.dirname(sys.argv[0])

print('sys.argv[0] =', sys.argv[0], "pathname", pathname)    

# 모델 불러오기
model = load_model(f'{pathname}/model.savedmodel')

# 레이블을 labels.txt 파일에서 가져옵니다. 이것은 나중에 사용됩니다.
labels = open(f'{pathname}/labels.txt', 'r').readlines()

while True:
    time.sleep(5)

    # CAMERA는 컴퓨터의 기본 카메라에 따라 0 또는 1이 될 수 있습니다.
    camera = cv2.VideoCapture(0)
    # 웹캠 이미지 불러오기
    ret, image = camera.read()
    camera.release()
    
    # 이미지를 (224-높이,224-너비) 픽셀로 크기 조정합니다.
    image = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)
    
    # 이미지를 윈도우에 표시합니다.
    
    image = np.asarray(image, dtype=np.float32).reshape(1, 224, 224, 3)
    
    image = (image / 127.5) - 1
    
    probabilities = model.predict(image)
    
    max_prob = np.max(probabilities)
    label = re.sub(r'\d+\s+', '', labels[np.argmax(probabilities)]).strip()

    print (label, f"proba: {max_prob}")
    
    if label != "empty" and max_prob > 0.9:
        os.system(f"festival --tts {pathname}/voice/{label}.txt")

    keyboard_input = cv2.waitKey(1)
    
    if keyboard_input == 27:
        break
```

내 코드에 메인 루프에 sleep 함수를 추가했습니다. 이를 통해 시스템은 5초마다 이미지를 캡처합니다. OpenCV는 캡처된 프레임을 버퍼링하기 때문에 각 반복에서 카메라를 초기화해야 합니다. 코드는 또한 예측 확률이 0.9보다 높으면 쓰레기 카테고리를 발표하기 위해 페스티벌 유틸리티를 사용합니다. 페스티벌은 텍스트 음성 변환 유틸리티입니다. 텍스트 파일을 읽어 내용을 읽어 줄 수 있습니다. 이 프로젝트에서는 voice라는 폴더를 만들고 발표 파일을 넣었습니다. 각 발표 파일에는 카테고리 이름만 작성했습니다. 읽기 편의를 위해 파일 내용을 수정하여 발표를 사용자 정의할 수 있습니다. 

그래서 최종적으로 폴더 구조는 다음과 같아야 합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_6.png" />

# 4. Raspberry Pi 설정하기

저는 learn.adafruit.com에 있는 훌륭한 설정 안내서를 따랐어요. 먼저, Raspberry Pi Imager를 사용하여 마이크로 SD 카드에 Raspberry Pi OS (64비트)를 기록하세요. 고급 옵션에서 SSH를 활성화하고 사용자 이름과 암호를 설정하세요.

카드를 Pi에 넣고 전원을 켜세요. 네트워크에 연결하고 다음 SSH 명령어로 로그인하세요.

<div class="content-ad"></div>

```js
# 만약 콘솔에서 "REMOTE HOST IDENTIFICATION HAS CHANGED!" 라고 나오면
# 다음 명령어를 실행하여 리셋하세요
# ssh-keygen -R raspberrypi.local

ssh pi@raspberrypi.local
```

라즈베리 파이 쉘이 준비되면, 아래 명령어를 하나씩 사용하여 필요한 소프트웨어를 설치하세요.

```js
# 라즈베리 파이에서 실행하세요

sudo apt update
sudo apt upgrade -y

# 선택 사항
# sudo apt install -y python3-pip

pip3 install --upgrade setuptools

pip3 install Pillow==9.2.0

pip install opencv-python

RELEASE=https://github.com/PINTO0309/Tensorflow-bin/releases/download/v2.10.0/tensorflow-2.10.0-cp310-none-linux_aarch64.whl

CPVER=$(python --version | grep -Eo '3\.[0-9]{1,2}' | tr -d '.')

pip install $(echo "$RELEASE" | sed -e "s/cp[0-9]\{3\}/CP$CPVER/g")

sudo apt install -y festival

# 선택 사항
# sudo reboot

mkdir ~/pi_garbage_classifier
```

위의 마지막 명령어는 라즈베리 파이의 홈 디렉토리에 pi_garbage_classifier 라는 폴더를 만듭니다. 프로젝트 파일을 데스크톱 컴퓨터에서 이 폴더로 전송하려면 다음 명령어를 사용하세요.

<div class="content-ad"></div>


# 호스트 데스크톱에서

cd [your_desktop_pi_garbage_classifier_path]
scp -r ./* pi@raspberrypi.local:~/pi_garbage_classifier/


파일을 복사한 후에는 다음 명령어로 앱을 테스트하세요:


# 라즈베리 파이에서

python /home/pi/pi_garbage_classifier/app.py


앱이 시작하는 데 몇 초 정도 걸립니다. 카메라 램프가 깜박일 때, 카메라 앞에 다양한 물체를 두어 시스템을 테스트할 수 있습니다. 물체의 클래스를 알리고 콘솔에 다음 출력이 나타날 것입니다 (그림 8).

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_7.png)

앱은 종료할 때까지 계속 실행될 거에요.

# 5. 라즈베리 파이(Pi) 배포

이제 시스템을 독립적으로 만들어 배포할 시간입니다. 앱을 Pi의 자동 시작 파일에 추가해야 합니다. rc.local과 cron 두 가지 방법을 시도해봤는데, 이 방법들은 데스크톱을 시작하기 전에 앱을 시작하기 때문에 USB 스피커를 활용할 수 없었어요. 그래서 이 포스트에서 해결책을 찾았어요. 시스템 자동 시작 파일에 관련된 것이죠. 따라서 이 명령어를 실행하여 파일을 편집해보세요.

<div class="content-ad"></div>

```js
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```

다음 줄을 파일에 추가하세요.

```js
@python /home/pi/pi_garbage_classifier/app.py
```

이렇게 autostart 파일이 보이게 됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AnAudioTrash-SortingRaspberryPiwithTeachableMachine_8.png" />

프로그램을 종료하려면 Ctrl+X를 누르고 동일한 파일에 변경 사항을 저장하려면 Y를 누르세요. 다음 명령어를 사용하여 장치를 다시 부팅하세요.

```js
sudo reboot
```

부팅 후 시스템은 자동으로 작업을 수행해야 합니다. 이제 네트워크 케이블을 제거하고 Pi를 원하는 곳에 배치할 수 있습니다 (비디오 2). 이제 쓰레기의 목적지에 대해 확실하지 않을 때에는 항상 상담할 수 있습니다.

<div class="content-ad"></div>

# 결론

이 기사에서는 시범용 쓰레기 분류 시스템을 구축하는 방법을 보여드렸어요. 설정하는 데 약 30분 가량 밖에 걸리지 않았죠. 아직까지는 두 가지 종류의 쓰레기와 전체 가정 쓰레기의 일부만 인식할 수 있지만 필수 구성 요소들은 모두 갖추고 있어요. 모델에 더 많은 객체와 클래스를 추가할 수 있습니다. 또한 이 프로젝트는 일종의 프레임워크입니다. 다시 말해, 새로운 모델을 훈련하고 Pi에 모델 파일을 교체하여 식물 분류 시스템이나 물체 인식기와 같이 완전히 다른 것으로 변환할 수 있어요.

Google의 티처블 머신은 정말 우리에게 빛이 되어줬어요. 이전에는 서로 다른 화가들의 그림을 분석하는 데 사용했었죠. 물론 PyTorch나 Keras로 직접 컴퓨터 비전 모델을 사용자화할 수도 있어요. 하지만 그런 작업은 상당한 시간과 노하우를 요구할 수 있어요. 반면, 티처블 머신은 이 모든 것을 아주 간단하게 만들어줘요. 몇 번의 클릭만으로 과연성 있는 모델을 쉽게 얻을 수 있어요. 더불어 모델을 확장하고 수정하는 것도 쉬워요.

하지만 생각해 볼 수 있는 작은 단점도 있어요. 티처블 머신은 인터페이스에서 모델 성능을 보여주지 않아요. 따라서 우리는 모델이 얼마나 잘 작동할지를 알 방법이 없어요. 더 많은 클래스를 추가할수록 모델 성능이 떨어지기 때문에 우리는 모델을 충분히 신뢰하고 배포하기 전에 모델의 정확도를 측정해야 해요.

<div class="content-ad"></div>

이 프로젝트를 시도해 보라고 권장합니다. 그리고 피드백을 주시면 좋을 것 같아요!