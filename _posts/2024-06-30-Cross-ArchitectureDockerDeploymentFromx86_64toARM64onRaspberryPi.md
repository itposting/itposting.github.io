---
title: "라즈베리파이에서 x86_64부터 ARM64까지 크로스 아키텍처 도커 배포 방법"
description: ""
coverImage: "/assets/img/2024-06-30-Cross-ArchitectureDockerDeploymentFromx86_64toARM64onRaspberryPi_0.png"
date: 2024-06-30 19:06
ogImage: 
  url: /assets/img/2024-06-30-Cross-ArchitectureDockerDeploymentFromx86_64toARM64onRaspberryPi_0.png
tag: Tech
originalTitle: "Cross-Architecture Docker Deployment: From x86_64 to ARM64 on Raspberry Pi"
link: "https://medium.com/@tobibot/cross-architecture-docker-deployment-from-x86-64-to-amd64-on-raspberry-pi-1e097e43b644"
---


애플리케이션을 일관된 환경에서 다양한 아키텍처로 배포하는 것은 컨테이너화에서 처음으로 겪은 중요한 도전 중 하나였어요. 이 글에서는 x86_64 머신에서 Docker 이미지를 빌드하고 ARM64 라즈베리 파이에서 실행하는 경험을 공유하려고 해요. 이 여정은 Docker Buildx를 사용하고 이미지를 전송하며 cron과 함께 Python 스크립트를 실행하도록 컨테이너를 구성하는 과정을 포함하고 있답니다.

여기서는 KISS 원리(Keep It Simple, Stupid)를 준수하고자 하며 관련된 코드에 집중하기로 하고 불필요한 설명은 건너뛸 거예요. 시스템과 필수 구성 요소가 최신 상태임을 전제로 하고 업데이트는 생략할 거에요.

# 1. Docker Buildx 설정

```js
docker buildx install
docker buildx create --use
```

<div class="content-ad"></div>

# 2. ARM64용 도커 이미지 빌드하기

```js
docker buildx build --platform linux/arm64 -t <my-python-app> --load .
```

# 3. 이미지 내보내고 전송하기

```js
docker save <my-python-app> -o <my-python-app>.tar
sudo scp <my-python-app>.tar pi@raspberrypi:/home/pi/
```

<div class="content-ad"></div>

이 예시에서 사용자 이름은 pi입니다. 여러분의 자격 증명으로 교체해 주세요

## 4. 라즈베리 파이에 이미지 로드하기

```js
docker load -i <나의-파이썬-앱>.tar
```

## 5. 특권 플래그를 사용하여 컨테이너 실행하기

<div class="content-ad"></div>

컨테이너를 실행하려면 여러 속성을 지정해야 했어요. 예를 들어, 환경 변수를 포함시키고 호스트와 컨테이너 간 데이터 공유를 위해 폴더를 마운트했어요. 또한 반드시 --privileged 플래그를 설정해야 했어요. 그렇지 않으면 컨테이너가 제대로 작동하지 않았어요.

```js
docker run -d \
  --name <name> \
  --platform linux/arm64 \
  -e MY_ENV_VAR=value\
  --privileged \
  --mount type=bind,source=<path on raspberry>,target=<path inside container> \
  <my-python-app>
```

# 6. 크론 작업 설정

크론 작업이 제대로 실행되려면 환경 변수가 crontab 파일에 정의되어 있고 Python 인터프리터의 전체 경로가 지정되어 있어야 했어요.

<div class="content-ad"></div>

```js
# 환경 변수 정의
MY_ENV_VAR=value

# m h  dom mon dow   command
* * * * * /usr/local/bin/python /app/my_script.py >> /var/log/cron.log 2>&1
```

주된 문제는 플랫폼을 (--platform) 지정하는 것, --privileged 플래그를 설정하는 것, 그리고 환경 변수가 cron 파일에 올바르게 정의되는 것이었습니다. 이 기사가 누군가에게 도움이 되어 도커와 라즈베리 파이를 사용해 실험하는 데 시간을 절약할 수 있기를 바랍니다. 즐거운 하루 되세요! :)