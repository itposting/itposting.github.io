---
title: "라즈베리 파이를 위한 자체 Linux 이미지 만들기"
description: ""
coverImage: "/assets/img/2024-06-20-BuildyourownLinuxImagefortheRaspberryPi_0.png"
date: 2024-06-20 17:22
ogImage: 
  url: /assets/img/2024-06-20-BuildyourownLinuxImagefortheRaspberryPi_0.png
tag: Tech
originalTitle: "Build your own Linux Image for the Raspberry Pi"
link: "https://medium.com/nerd-for-tech/build-your-own-linux-image-for-the-raspberry-pi-f61adb799652"
---


<img src="/assets/img/2024-06-20-BuildyourownLinuxImagefortheRaspberryPi_0.png" />

라즈베리 파이와 유사한 싱글 보드 컴퓨터는 요즘 매우 인기가 많습니다. 그 가능성은 거의 무한합니다. 홈 서버부터 미디어 스테이션, IoT 프로젝트까지 모든 것이 가능합니다. 사용하기 쉽게 만드는 두 가지 요소는 아마도 거대한 커뮤니티와 Raspian과 같은 준비된 SD 카드 이미지일 것입니다. 웹에서 최신 이미지를 다운로드하고 SD 카드에 플래싱하는 것은 시작하는 가장 쉽고 빠른 방법입니다. Raspberry를 사용하거나 자체 프로젝트를 수행하고 싶을 경우에는 문제가 없습니다. 그러나 동일한 시스템을 다른 시스템이나 여러 시스템에 복제하려 한다면 복잡해집니다. 이미지의 크기와 보안을 신경 쓴다면 더 복잡해집니다. 안전한 리눅스 시스템의 솔루션을 제시할 수 있는 능력이 있다면 상상할 수 없습니다. 그러나 자신만의 이미지를 빌드하고 정확히 이미지에 무엇이 포함되어 있는지를 파악하는 것은 좋은 시작점입니다. 마지막으로 리눅스 작동 방식에 대해 좀 더 배우고, 스크래치에서 자신의 리눅스를 빌드했다고 말할 수 있는 것은 흥미로울 것입니다.

이 첫 번째 기사에서는 깊이에 대해 다루지 않겠습니다. 전체 시스템을 이해하고 필요에 맞게 사용자 정의하고자 한다면 알아야 할 것이 훨씬 더 많습니다. 대신, 빠른 성공을 원하고 첫 번째 이미지를 빌드하는 것에 집중하겠습니다. 깊게 이해하고 싶다면 더 많은 기사를 기대해 주세요.

# Yocto Project

<div class="content-ad"></div>

Yocto를 사용하여 자체 Linux 배포판을 빌드할 거에요.

"Yocto Project, 임베디드 Linux 배포판이 아니에요. 당신을 위해 커스텀한 배포판을 만들어줘요." 이 공식 웹사이트의 설명은 Yocto가 무엇인지 가장 잘 표현한 것 같아요. Yocto를 사용하면 자신만의 Linux 이미지를 만드는 데 도움이 되는 유용한 도구와 구성 요소의 모음으로 생각해야 해요. 대안이 있지만, Yocto는 아마도 가장 인기 있는 것 중 하나일 거에요.

Yocto Project의 다양한 부분을 자세히 살펴보려면 공식 웹사이트를 확인해보세요.

첫 번째 이미지를 위해 접하게 되는 것은 메타 레이어와 BitBake입니다. 이 두 요소가 시스템의 핵심을 형성합니다.

<div class="content-ad"></div>

# 메타 레이어

Yocto는 대부분 레시피와 구성 데이터를 포함하는 여러 가지 레이어 위에 구축됩니다. 레시피는 무엇이 어떻게 빌드되는지 설명하는 데 사용됩니다. 예를 들어, 리눅스 커널의 소스 코드를 다운로드하는 위치와 올바르게 컴파일하기 위해 어떤 명령어 및 도구를 사용해야 하는지가 포함되어 있습니다. 구성 데이터는 예를 들어, Raspberry Pi가 어떤 아키텍처를 사용하는지 설명하므로 레시피가 컴파일해야 하는 대상을 알 수 있습니다. 이것은 과소 평가일 수 있지만, 목표 시스템에 맞는 올바른 메타 레이어가 필요하다는 것을 알면 충분할 것입니다. 이 모든 것 안에 빌드 시스템에서 필요한 모든 것이 제공됩니다.

# BitBake

BitBake는 빌드를 위한 중앙 명령줄 도구입니다. 이것은 원래 OpenEmbedded 프로젝트의 일부였지만, 현재 Yocto 프로젝트와 OpenEmbedded 프로젝트에서 유지보수되는 독립적인 도구입니다.

<div class="content-ad"></div>

# 빌드 시스템 설정

이제 처음으로 자신만의 이미지를 설정하는 시간입니다. 빌드 환경을 설정하는 단계는 꽤 간단하지만 빌드가 완료될 때까지 시간이 걸립니다. Linux 이미지를 처음부터 빌드하는 것은 단점이 있습니다. 모든 것을 빌드해야 하며 이 과정은 CPU, RAM 및 HDD를 많이 사용합니다. 보통 컴퓨터에서 최대 8시간이 걸릴 수 있습니다. 하지만 걱정하지 마세요. 첫 번째 빌드가 완료되면 Yocto의 좋은 캐싱 알고리즘이 실행되어 새로운 요소와 변경된 요소만 빌드됩니다. 컴퓨터의 최소 무료 디스크 공간은 적어도 50GB여야 합니다. (참고: 저는 16 코어 AWS 클라우드 인스턴스에서 약 1시간 정도에 이 이미지를 빌드했습니다. 빌드 시간은 CPU 성능 및 다운로드 속도에 매우 의존적입니다. 클라우드에서 Yocto 이미지를 빌드하는 주제에 대해 자세한 내용은 후속 기사에서 다룰 수 있습니다.)

Yocto 프로젝트의 Mega Manual에서 빌드 시스템 호스트로 최종 테스트된 Linux 배포판 목록을 찾을 수 있습니다. 다른 배포판에서도 작동하지만 예상치 못한 문제가 발생할 수 있습니다. 이 기사의 모든 예제에서 나는 Ubuntu 18.04 LTS를 사용할 것입니다.

첫 번째 단계는 Yocto의 선행 조건을 설치하는 것입니다. 이 명령어는 Ubuntu 또는 Debian에서 모든 패키지를 설치합니다. Mega Manual에서 다른 예제를 찾을 수 있습니다.

<div class="content-ad"></div>

# 메타 레이어 가져오기

모든 메타 레이어는 일반적으로 git을 통해 사용할 수 있습니다. 지금은 git이 무엇인지 알지 못해도 걱정하지 마세요. 우리는 지금 하나의 명령어만 사용할 것입니다. git clone 명령은 인터넷에서 저장소를 가져옵니다. 우리가 사용하는 -b dunfell 스위치는 가져올 버전을 지정합니다. 작성 시점에서 던펠(dunfell) 버전은 장기 지원을 받는 최신 버전입니다. 가장 최근 릴리스에 대한 개요는 https://wiki.yoctoproject.org/wiki/Releases를 참조하세요.

어떤 메타 레이어도 가져오기 전에 우리는 yocto라는 프로젝트 폴더와 모든 메타 레이어를 담을 source 폴더를 만들 것입니다.

```bash
mkdir yocto
cd yocto
mkdir sources
```

<div class="content-ad"></div>

항상 필요한 메타 레이어는 poky입니다. yocto가 작동하는 데 필요한 모든 기본적인 것들이 포함되어 있어요. 아래의 git 명령어를 실행하여 가져올 수 있어요.

```js
git clone git://git.yoctoproject.org/poky -b dunfell
```

라즈베리 파이를 위한 메타 레이어도 있어요. 라즈베리 파이를 실행하는 데 필요한 모든 정의가 포함되어 있는 멋지게 제작된 메타 레이어에요. 아래 명령어로 가져올 수 있어요.

```js
git clone git://git.yoctoproject.org/meta-raspberrypi -b dunfell
```

<div class="content-ad"></div>

메타 레이어는 항상 어떤 메타 레이어에 의존하는지를 명시합니다. meta-raspberrypi의 readme에는 우리가 이미 가지고 있는 poky와 meta-openembedded이 필요하다고 나와 있습니다. 이 메타 레이어 자체는 여러 레이어로 나뉘어져 있습니다. 이 명령어를 통해 그 모든 레이어를 가져올 수 있습니다.

```js
git clone https://git.openembedded.org/meta-openembedded -b dunfell
```

우리가 필요한 모든 메타 레이어입니다. 이제 프로젝트 폴더로 돌아가서 빌드 환경을 초기화해봅시다.

```js
cd ..
. sources/poky/oe-init-build-env
```

<div class="content-ad"></div>

첫 번째 이미지를 생성할 준비가 거의 끝났어요. 두 개의 구성 파일을 편집하기만 하면 됩니다.

conf 폴더에 있는 bblayers.conf 파일은 사용할 메타 레이어의 모든 경로가 들어 있어요.

```js
nano conf/bblayers.conf
```

마지막으로, conf 폴더에 있는 local.conf 파일은 몇 가지 기본 구성 및 우리에게 가장 중요한 빌드할 기기의 이름이 포함되어 있어요. 만약 라즈베리 파이 4를 위해 빌드하려면 raspberrypi4를 사용하고, 라즈베리 파이 3을 위해 빌드하려면 raspberrypi3를 사용하세요. 이게 Yocto를 사용하는 큰 이점 중 하나에요. 다른 시스템을 위해 동일한 이미지를 빌드하려면 한 줄의 구성만 바꾸면 돼요.

<div class="content-ad"></div>

```js
nano conf/local.conf
[...]
MACHINE ?= "raspberrypi4"
[...]
```

위 모든 단계를 완료했으므로 이제 실제 빌드를 시작하고 완료될 때까지 기다리면서 커피를 한 잔 이상 마실 시간입니다.

```js
bitbake core-image-base
```

축하합니다! 라즈베리 파이를 위한 첫 번째 Linux 이미지를 빌드했습니다. 완성된 이미지는 tmp/deploy/images/repberrypi4/core-image-base-raspberrypi4.wic.bz2 경로에 있습니다. 이 파일은 압축되어 있습니다. 압축을 해제하려면 bzip2 명령 또는 7zip과 같은 도구를 사용하세요. 

<div class="content-ad"></div>

```js
bzip2 -d -f tmp/deploy/images/raspberrypi4/core-image-base-raspberrypi4.wic.bz2
```

우리는 다른 라스비안 이미지처럼 SD 카드에 플래시만 하면 바로 부팅할 수 있어요. https://www.raspberrypi.org/documentation/installation/installing-images/

![Image](/assets/img/2024-06-20-BuildyourownLinuxImagefortheRaspberryPi_1.png)

기본적으로 사용자 이름은 root이고 비밀번호는 비어 있어요.

<div class="content-ad"></div>

# 다음 단계

이 이정표를 달성하여 자랑스러워하는 것을 기대합니다. Yocto는 강력한 도구이며 더 많은 것을 배울 수 있습니다. 더 많은 정보를 얻고 싶다면 저를 팔로우해 다음 Yocto 관련 글을 놓치지 않도록 하세요.

그동안 당신이 Yocto에 대해 계속 학습하고자 한다면, 스스로 학습을 계속하기 위한 시작점을 제공하겠습니다. 이미지에 추가 소프트웨어가 필요하다면, 먼저 OpenEmbedded Layer Index에서 시작해보세요. 거기서 소프트웨어 레시피가 포함된 메타 레이어를 검색할 수 있습니다. 그 레이어를 다운로드하여 bblayers.conf에 추가하고, 이미 존재하지 않은 경우에만 추가하세요. 그런 다음 레시피 이름을 local.conf 파일의 IMAGE_INSTALL_append에 추가하세요.

```js
IMAGE_INSTALL_append = " nano"
```  

<div class="content-ad"></div>

이미지를 다시 빌드하고 플래시하세요. 그러면 준비 끝!