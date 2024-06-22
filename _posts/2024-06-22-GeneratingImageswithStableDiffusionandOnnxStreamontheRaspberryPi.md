---
title: "Raspberry Pi에서 Stable Diffusion과 OnnxStream으로 이미지 생성하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_0.png"
date: 2024-06-22 19:20
ogImage: 
  url: /assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_0.png
tag: Tech
originalTitle: "Generating Images with Stable Diffusion and OnnxStream on the Raspberry Pi"
link: "https://medium.com/towards-data-science/generating-images-with-stable-diffusion-and-onnxstream-on-the-raspberry-pi-f126636b6c0c"
---


## 라즈베리 파이에서 Stable Diffusion XL Turbo를 사용하여 이미지를 생성하는 방법을 배워보세요!

![이미지](/assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_0.png)

지난 기사에서는 라즈베리 파이에서 대형 언어 모델 및 비전 언어 모델을 실행하는 방법을 공유했습니다. 이번에는 LLM 또는 VLM이 아닌 이미지 생성 모델인 Stable Diffusion XL (SDXL) Turbo를 라즈베리 파이 5에서 실행할 것입니다. 또 다른 불가능한 일처럼 들리지만, 오픈 소스의 기이한 점들이 존재하고, 매우 리소스가 제한된 환경에서 SDXL Turbo 모델을 실행하는 것이 그 중 하나입니다.

# OnnxStream

<div class="content-ad"></div>

OnnxStream은 Vito Plantamura가 만든 오픈 소스 프로젝트로, 초기 의도는 메모리 소비를 최소화하여 라즈베리 파이 제로 2에서 Stable Diffusion 1.5(SD1.5)를 실행하는 것이었습니다. 이로 인해 추론 대기 시간/처리량이 증가할 수 있지만 가능한 한 메모리 소비를 최소화하는 것이 목표입니다.

현재 상황에서 이 프로젝트는 Stable Diffusion 1.5 뿐만 아니라 Stable Diffusion XL 1.0 Base (SDXL) 및 Stable Diffusion XL Turbo 1.0도 지원하고 있습니다. 신기한 점은 GitHub 저장소에서 이미 잘 설명되어 있으므로 이 기반 기술에 대해 자세히 다루지 않겠습니다.

대신, 바로 작동하는 방법을 알아보겠습니다.

# 기술적 요구 사항

<div class="content-ad"></div>

다음만 있으면 됩니다:

- Raspberry Pi 5 — 혹은 Raspberry Pi 4 또는 다른 Raspberry Pi가 있어도 괜찮지만 이보다 느릴 것으로 예상됩니다.
- SD 카드 — 최소 16GB, 이미 Raspbian 또는 다른 Linux 배포판이 설정되어 있어야 합니다. SDXL Turbo의 무게는 약 8GB입니다.
- 인터넷 연결

![이미지](/assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_1.png)

# OnnxStream 설정하기

<div class="content-ad"></div>

여기 안내는 GitHub 리포지토리에서 나온 것이지만, 좀 더 자세히 설명하고 있어요.

## 1. XNNPack 빌드

먼저 구글에서 제공하는 "고효율 부동 소수점 신경망 추론 연산자"를 제공하는 라이브러리인 XNNPack을 설치해야 해요. 다만 최신 버전을 가져오면 어떤 중대한 변경사항이 있을지 모르니까, 작성 당시에 OnnxStream 개발자가 작동되는 것을 확인한 버전을 가져와야 해요. 터미널에서 다음을 실행하세요:

```js
git clone https://github.com/google/XNNPACK.git
cd XNNPACK
git checkout 579de32260742a24166ecd13213d2e60af862675
mkdir build
cd build
cmake -DXNNPACK_BUILD_TESTS=OFF -DXNNPACK_BUILD_BENCHMARKS=OFF ..
cmake --build . --config Release
```

<div class="content-ad"></div>

XNNPack을 빌드하는 데 몇 분 정도 소요될 것입니다. 커피 한 잔 마시거나 다른 일을 하세요.

## 2. OnnxStream 빌드하기

이제 OnnxStream을 빌드해야 합니다. 터미널에서 다음을 실행하세요:

```js
git clone https://github.com/vitoplantamura/OnnxStream.git
cd OnnxStream
cd src
mkdir build
cd build
cmake -DMAX_SPEED=ON -DXNNPACK_DIR=<XNNPACK이 클론된 디렉토리 경로> ..
cmake --build . --config Release
```

<div class="content-ad"></div>

`DIRECTORY_WHERE_XNNPACK_WAS_CLONED`를 XNNPack가 복제된 경로로 교체해주세요 (빌드 폴더가 아닙니다). 제 경우에는 /home/admin/XNNPACK/에 있었습니다.

## 3. 모델 가중치 다운로드

이제 SDXL Turbo 모델 가중치를 다운로드해야 합니다. 터미널에서 다음을 실행하세요:

```js
git lfs install
git clone --depth=1 https://huggingface.co/AeroX2/stable-diffusion-xl-turbo-1.0-onnxstream
```

<div class="content-ad"></div>

아직 git-lfs를 설치하지 않았다면 먼저 설치해주세요. 모델 가중치가 상당히 크기 때문에 이전 단계보다 시간이 훨씬 더 걸릴 것입니다. 점심 시간 동안 가져가세요!

또한 지원되는 다른 두 모델을 실행할 수도 있습니다 — Stable Diffusion 1.5와 Stable Diffusion XL 1.0 Base는 OnnxStream의 GitHub 저장소에서 제공된 링크를 통해 가중치를 다운로드하여 사용할 수 있습니다. 이 모든 모델을 다운로드하는 경우 SD 카드에 충분한 공간이 있는지 확인해주세요!

다 되었다면, 이제 준비가 끝났습니다! Raspberry Pi에서 이미지를 생성할 준비가 된 것입니다!

# 이미지 생성 중

<div class="content-ad"></div>

아래의 코드 블록을 실행하여 이미지를 생성하세요:

```js
cd ~/OnnxStream/src/build/
./sd --turbo --models-path /home/admin/stable-diffusion-xl-turbo-1.0-onnxstream --prompt "화성에서 말을 탄 우주 비행사" --steps 1 --output astronaut.png
```

생성하고 싶은 내용에 해당하는 프롬프트로 교체하세요. 여기서는 대표적인 우주 비행사 프롬프트를 사용했습니다. 이미지를 생성하는 데 좋아보이는 이미지를 생성하기 위해 SDXL Turbo는 많은 단계가 필요하지 않으니 단계를 1로 설정했습니다.

SDXL Turbo를 제외한 다른 두 모델에는 네거티브 프롬프트를 위해 사용할 수 없지만, 생성 단계 수를 설정하는 --steps 및 무작위 시드를 설정하는 --seed와 같은 다른 인수도 전달할 수 있습니다.

<div class="content-ad"></div>

모델의 종류에 따라 필요한 인수가 변경될 수 있으니, SDXL Turbo 이외의 것을 사용하는 경우 전달해야 하는 인수의 전체 목록은 OnnxStream의 GitHub 리포지토리를 확인해 주세요.

![image](/assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_2.png)

위 이미지에서 확인할 수 있듯이, 라즈베리 파이 5에서 확산 단계마다 약 1분이 소요되며, 전처리 및 디코딩을 포함하여 한 장의 이미지를 생성하는 데 약 3분이 소요됩니다.

![image](/assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_3.png)

<div class="content-ad"></div>

여기 동일한 시드를 사용하여 1단계부터 10단계까지 동일한 프롬프트의 비교 및 진전이 있습니다. 단 한 걸음의 향상으로도 이미 생성된 이미지가 이미 매우 잘 완료되었음을 볼 수 있습니다. 이는 SDXL이나 SD1.5와는 대조적이며 해당 품질에 도달하기 위해서는 상당히 많은 단계가 필요합니다.

# 결론

이미지를 생성하는 데 최소한 몇 분이 걸리는 것을 감안하면, 그에 대한 사용 사례가 부족한지에 대한 질문이 떠오릅니다.

![이미지](/assets/img/2024-06-22-GeneratingImageswithStableDiffusionandOnnxStreamontheRaspberryPi_4.png)

<div class="content-ad"></div>

저에게 가장 명백하고 재미있는 사용 사례는 몇 분마다 새 이미지를 생성하는 변화무쌍한 사진 프레임입니다. 실제로 GitHub의 rvdveen이 OnnxStream을 사용한 이와 비슷한 프로젝트가 있습니다. 라즈베리 파이 제로 2 W에서 OnnxStream을 사용하여 뉴스 기사 이미지를 생성하고 전자잉크 디스플레이를 통해 사진 프레임에 표시하는 프로젝트입니다. 물론 실시간으로 보여주는 사진 프레임이 반드시 필요한 것은 아니지만, 라즈베리 파이 제로 2 W에서 이미지를 생성하는 데 약 5시간이 소요되며 SD1.5가 필요합니다. 

또는 로컬에서 호스팅되는 이미지 생성기를 원할 수도 있습니다. 네트워크에서 주요 계산 장치를 점유하지 않고도 양호한 품질의 이미지를 생성할 수 있습니다.

라즈베리 파이에서 SDXL Turbo와 놀면서 즐기세요!

참고: 저는 OnnxStream이나 StabilityAI와 제휴 관계가 없습니다. 모든 의견은 본인의 의견이며 어떤 조직도 대표하지 않습니다.