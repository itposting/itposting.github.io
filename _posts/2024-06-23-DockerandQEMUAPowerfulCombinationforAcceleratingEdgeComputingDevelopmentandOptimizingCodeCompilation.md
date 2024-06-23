---
title: "Docker와 QEMU 엣지 컴퓨팅 개발 가속화 및 코드 컴파일 최적화를 위한 강력한 조합"
description: ""
coverImage: "/assets/img/2024-06-23-DockerandQEMUAPowerfulCombinationforAcceleratingEdgeComputingDevelopmentandOptimizingCodeCompilation_0.png"
date: 2024-06-23 18:22
ogImage: 
  url: /assets/img/2024-06-23-DockerandQEMUAPowerfulCombinationforAcceleratingEdgeComputingDevelopmentandOptimizingCodeCompilation_0.png
tag: Tech
originalTitle: "Docker and QEMU: A Powerful Combination for Accelerating Edge Computing Development and Optimizing Code Compilation"
link: "https://medium.com/@nullbyte.in/docker-and-qemu-a-powerful-combination-for-accelerating-edge-computing-development-and-optimizing-42da00259a02"
---


![Docker & QEMU: 강력한 조합](/assets/img/2024-06-23-DockerandQEMUAPowerfulCombinationforAcceleratingEdgeComputingDevelopmentandOptimizingCodeCompilation_0.png)

QEMU는 호스트 시스템에서 가상 머신을 실행할 수 있는 타입-2 하이퍼바이저입니다. x86 및 ARM을 포함한 다양한 아키텍처를 에뮬레이트할 수 있습니다. qemu-system-aarch64 패키지는 AArch64 (ARM64) 시스템 에뮬레이터를 제공하며 CPU 및 다양한 주변장치를 에뮬레이트할 수 있습니다.

Raspberry Pi용 코드를 컴파일하거나 테스트할 때, QEMU를 사용하여 x86 머신에서 AArch64 시스템을 모의 실행할 수 있습니다. 이는 개발자가 실제 Raspberry Pi를 가지고 있지 않아도 해당 코드를 컴파일하고 테스트할 수 있다는 것을 의미합니다. 이는 Jetson, Beaglebone 등 다른 엣지 디바이스에도 적용됩니다.

Raspberry Pi용 코드를 컴파일하기 위해 QEMU를 사용하는 프로세스에는 qemu-system-aarch64 패키지를 사용하여 가상 머신을 설정한 다음 가상 머신에 필요한 도구 및 종속성을 설치하는 과정이 포함됩니다. ARM 아키텍처용 코드를 컴파일하는 데 필요한 GCC 컴파일러 및 기타 도구가 포함됩니다.

<div class="content-ad"></div>

라즈베리 파이용 코드를 컴파일하기 위해 QEMU를 사용하는 장점 중 하나는 일반적으로 라즈베리 파이보다 강력한 x86 머신에서 코드를 테스트하고 디버깅할 수 있다는 것입니다.

![이미지](/assets/img/2024-06-23-DockerandQEMUAPowerfulCombinationforAcceleratingEdgeComputingDevelopmentandOptimizingCodeCompilation_1.png)

도커 이미지 내에서 QEMU를 사용하면 라즈베리 파이용 코드를 컴파일하고 테스트하는 방법이 더욱 효율적이고 효율적해질 수 있습니다.

도커 이미지는 가벼우며 휴대 가능하며 독립적인 컨테이너로, 어떤 머신에서도 쉽게 배포하고 실행할 수 있습니다. 라즈베리 파이용 코드를 컴파일하기 위한 필수 도구 및 종속성을 포함한 QEMU와 함께 도커 이미지를 생성하면 Docker가 설치된 모든 머신에서 이미지를 쉽게 실행할 수 있습니다.

<div class="content-ad"></div>

예를 들어, PyTorch의 C++ 인터페이스 인 libtorch와 같은 대규모 라이브러리를 컴파일하는 것은 Raspberry Pi나 다른 엣지 장치에서 자원이 제한되기 때문에 상당한 시간이 소요될 수 있습니다. QEMU를 사용하여 Docker 이미지 내에서 AArch64 시스템을 x86 머신에서 에뮬레이션함으로써, 개발자는 x86 머신에서 사용 가능한 빠른 처리 속도와 코어 수를 활용하여 컴파일 시간을 크게 줄일 수 있습니다.

예를 들어, 고속 CPU를 탑재한 10코어 x86 머신에서 Raspberry Pi에서 보통 4~5시간 소요되는 libtorch의 컴파일 시간이 30분으로 단축될 수 있습니다. 이는 개발자들에게 상당한 시간을 절약해줄 수 있습니다.

이제 Raspberry Pi 4를 위한 libtorch 라이브러리 빌드 프로세스 예제를 살펴보겠습니다.

호스트 머신 설정:
Docker 설치

<div class="content-ad"></div>

```js
# QEMU 및 크로스 플랫폼 패키지 설치
sudo apt-get install -y gcc-arm-linux-gnueabihf libc6-dev-armhf-cross qemu-user-static qemu-system-i386
```

```js
FROM arm64v8/ubuntu:focal
# 참고:
# /usr/bin/qemu-system-aarch64를 로컬 bin 폴더로 복사
COPY ./bin/qemu-system-aarch64 /usr/bin/qemu-system-aarch64

ARG DEBIAN_FRONTEND=noninteractive

# 기본적인 apt 업데이트
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends locales ca-certificates 
 
# 로캘을 en_US.UTF-8로 설정(로캘이 없으면 Yocto 빌드 실패함)
RUN locale-gen en_US.UTF-8 && update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# 기본 패키지 설치
RUN apt-get update && apt-get install -y \
    apparmor \
    aufs-tools \
    automake \
    bash-completion \
    build-essential \
    cmake \
    curl \
    dpkg-sig \
    g++ \
    gcc \
    git \
    iptables \
    jq \
    libapparmor-dev \
    libc6-dev \
    libcap-dev \
    libsystemd-dev \
    libyaml-dev \
    mercurial \
    net-tools \
    parallel \
    pkg-config \
    golang-go \
    iproute2 \
    iputils-ping \
    vim-common \
    vim \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt install -y software-properties-common && add-apt-repository main && add-apt-repository universe && add-apt-repository restricted && add-apt-repository multiverse

# libtorch 의존성 설치
RUN apt-get install -y clang ninja-build git cmake libjpeg-dev libopenmpi-dev libomp-dev ccache \
    libopenblas-dev libblas-dev libeigen3-dev 
RUN apt-get install -y python3-pip
RUN pip3 install -U --user wheel mock pillow
RUN pip3 install setuptools==58.3.0

# 소스 코드 다운로드
RUN mkdir ~/torch/ && cd ~/torch/ && \
    git clone -b v1.13.0 --depth=1 --recursive https://github.com/pytorch/pytorch.git && \
    cd pytorch && pip3 install -r requirements.txt

# 컴파일 환경 변수 설정
ENV BUILD_CAFFE2_OPS=OFF
ENV USE_FBGEMM=OFF
ENV USE_FAKELOWP=OFF
ENV BUILD_TEST=OFF
ENV USE_MKLDNN=OFF
ENV USE_NNPACK=ON
ENV USE_XNNPACK=ON
ENV USE_QNNPACK=ON
ENV MAX_JOBS=12
ENV USE_NUMPY=ON
ENV USE_OPENCV=OFF
ENV USE_NCCL=OFF
ENV BUILD_SHARED_LIBS=ON
ENV PATH=/usr/lib/ccache:$PATH
ENV CC=clang

# C++ torch 인터페이스 라이브러리(.so) 파일 빌드
RUN cd ~/torch/pytorch/ && python3 tools/build_libtorch.py
```

```js
# Docker 이미지 빌드
sudo docker build --rm --tag arm64v8_libtorch -f arm64v8.Dockerfile .

# 터미널 1
# 컴파일된 패키지 실행 및 복사
mkdir libtorch
sudo docker run -v /etc/localtime:/etc/localtime:ro --rm -it -e http_proxy -e https_proxy -e ftp_proxy -v `pwd`:/work arm64v8_libtorch

# 터미널 2
# 실행 중인 컨테이너 ID 가져오기
sudo docker ps

# 터미널 3
# 컨테이너에서 호스트 머신으로 파일 복사
sudo docker cp 389143f92f85:~/torch/pytorch/torch/bin/ libtorch/
sudo docker cp 389143f92f85:~/torch/pytorch/torch/lib/ libtorch/
sudo docker cp 389143f92f85:~/torch/pytorch/torch/include/ libtorch/
sudo docker cp 389143f92f85:~/torch/pytorch/torch/share/ libtorch/

# 권한 설정
sudo chmod -R 755 libtorch/* 

# 소유자 변경(scp용)
sudo chown -R username:username libtorch

# 이제 libtorch 폴더를 RPI로 복사할 수 있습니다
scp -r libtorch/ ubuntu@static_ip_address:/home/ubuntu/
``` 

Docker 이미지인 "arm64v8_libtorch"를 "arm64v8.Dockerfile" 파일을 사용하여 빌드합니다. "--rm" 플래그는 컨테이너가 종료될 때 자동으로 제거되도록 사용됩니다.

터미널 1:
"arm64v8_libtorch"이라는 빌드된 Docker 이미지를 실행하고 현재 디렉토리를 컨테이너 내의 볼륨으로 마운트합니다.

터미널 2:
실행 중인 컨테이너의 ID를 가져옵니다.

터미널 3:
1. 컨테이너에서 호스트 머신으로 파일을 복사합니다.
2. "libtorch" 폴더 내의 모든 파일의 권한을 755로 변경합니다.
3. "libtorch" 폴더 내의 모든 파일의 소유권을 현재 사용자 이름으로 변경합니다.

터미널 4:
"libtorch" 폴더를 scp를 통해 원격 머신[RPI4]으로 복사합니다.


<div class="content-ad"></div>

ROS2를 X86 호스트 시스템에서 RPI용으로 빌드하는 또 다른 예제를 확인해보세요.

```js
FROM arm64v8/ubuntu:focal
COPY ./bin/qemu-system-aarch64 /usr/bin/qemu-system-aarch64

ARG DEBIAN_FRONTEND=noninteractive

# 기본적인 apt 업데이트
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends locales ca-certificates 
 
# Yocto 빌드에 로캘이 설정되어 있지 않으면 빌드에 실패할 수 있으므로 로캘이 en_US.UTF-8로 설정됩니다.
RUN locale-gen en_US.UTF-8 && update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# 기본 패키지 가져오기
RUN apt-get update && apt-get install -y \
    apparmor \
    aufs-tools \
    automake \
    bash-completion \
    build-essential \
    cmake \
    curl \
    dpkg-sig \
    g++ \
    gcc \
    git \
    iptables \
    jq \
    libapparmor-dev \
    libc6-dev \
    libcap-dev \
    libsystemd-dev \
    libyaml-dev \
    mercurial \
    net-tools \
    parallel \
    pkg-config \
    golang-go \
    iproute2 \
    iputils-ping \
    vim-common \
    vim \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

...

# 전체 흐름을 간략하게 말하자면, Docker와 QEMU는 엣지 컴퓨팅 개발을 가속화하고 코드 컴파일을 최적화하는 강력한 조합입니다. 이 설정을 통해 개발자들은 x86 기계의 빠른 처리 능력과 리소스를 활용하면서도 라즈베리파이나 젯슨과 같은 ARM 기반 에뮬레이터에서 코드를 테스트하고 디버깅할 수 있습니다. 이 접근 방식은 컴파일 시간을 크게 단축하고 개발 주기를 가속화할 수 있습니다.
```

<div class="content-ad"></div>

제가 몇 가지 도커 예제를 여기에 만들어 놨어요. 참고용으로 활용하시면 좋을 것 같아요! 설정 프로세스에 대해 궁금한 점이 있거나 추가 도움이 필요하면 언제든지 알려주세요.

흥미로운 기사나 업데이트는 항상 LinkedIn에 공유하고 있어요. 최신 소식을 받아보고 싶으시면 편하게 저를 팔로우해주세요!