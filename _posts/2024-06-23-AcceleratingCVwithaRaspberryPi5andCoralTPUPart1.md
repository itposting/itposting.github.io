---
title: "Raspberry Pi 5와 Coral TPU로 컴퓨터 비전 가속화 Part 1"
description: ""
coverImage: "/assets/img/2024-06-23-AcceleratingCVwithaRaspberryPi5andCoralTPUPart1_0.png"
date: 2024-06-23 18:18
ogImage: 
  url: /assets/img/2024-06-23-AcceleratingCVwithaRaspberryPi5andCoralTPUPart1_0.png
tag: Tech
originalTitle: "Accelerating CV with a Raspberry Pi 5 and Coral TPU: Part 1"
link: "https://medium.com/@tstom3/accelerating-cv-with-a-raspberry-pi-5-and-coral-tpu-part-1-66fe816fc65f"
---


Raspberry Pi 5은 PCIe 인터페이스를 갖추고 있어 주변 장치에 고속 하드웨어 연결이 가능합니다. 이는 이제 Google의 Coral TPU를 Pi에 연결하고 초고속 컴퓨터 비전을 얻는 것이 가능하다는 것을 의미합니다. 이 튜토리얼에서는 TPU를 구성하고 TPU에 MobileNet을 배포하여 224x224 크기의 이미지에 대한 추론 속도를 2.5밀리초(!)로 얻는 과정을 안내해 드리겠습니다.

우리는 pineboard의 Hat AI 보드를 사용하여 TPU를 Pi에 PCIe로 연결했습니다:

![이미지](/assets/img/2024-06-23-AcceleratingCVwithaRaspberryPi5andCoralTPUPart1_0.png)

이 첫 번째 튜토리얼에서는 Pi가 Coral TPU를 인식할 수 있도록 커널을 구성하는 과정을 안내해 드리겠습니다. 이 내용은 Jeff Geerling의 작업을 요약한 것이며 저 자신이 작동시키기 위해 몇 가지 조정이 필요했습니다. 그의 작업이 없었더라면 저는 결코 이것을 이해하지 못했을 것입니다!

<div class="content-ad"></div>

코랄 TPU는 호스트 OS가 4K 페이지 크기여야한다고 요구합니다. 나는 그 이유가 코랄이 직접 메모리 액세스(DMA)를 수행할 수 있어서 Pi의 RAM에 CPU 개입없이 직접 접근할 수 있기 때문일 것으로 의심합니다. 이는 고정된 페이지 크기가 필요하기 때문에 발생합니다. 기본 라즈베리 파이 OS는 16k 페이지 크기로 제공되지만, 다음 명령어로 확인할 수 있습니다: getconf PAGE_SIZE .

이제 4K 커널을 설치하기 위해 여러 옵션이 있습니다:

- 아마도 4K 커널은 이미 Pi에 16K 커널과 함께 설치되어 있을 것이므로, /boot/firmware에 kernel8.img 파일이 있는지 확인할 수 있습니다. 이 파일이 있다면, /boot/firmware/config.txt 파일 가장 아래에 kernel=kernel8.img 라인을 추가하여 Pi가 이 커널을 부팅하도록 지시할 수 있습니다. 다음으로 시스템에 커널 헤더를 설치해야 합니다: 나중에 gasket 드라이버를 컴파일하기 위해 sudo apt install linux-headers-$(uname -r) 명령어를 실행해 주세요.
- 또는 공식 지침을 따라 Pi에 새로운 4K 커널을 다운로드, 빌드 및 설치할 수 있습니다. 이 옵션은 Pi 내에서 언제든지 커널을 빌드할 수 있어 가장 유연합니다. 나중에 TPU 드라이버를 빌드하기 위해 필요한 커널 헤더도 자동으로 설치됩니다.
- 마지막으로, PI 웹 사이트에서 설명하는 대로 커널을 크로스 컴파일할 수도 있습니다. 작동하는 커널을 얻지만, 데비안 도커 컨테이너 내에서 크로스 컴파일할 때 컴파일러 불일치로 인해 나중에 TPU 드라이버를 컴파일하는 데 문제가 있었습니다. 크로스 컴파일 중에 정확히 동일한 컴파일러를 사용해도 형식 실행 오류로 인해 드라이버를 성공적으로 컴파일할 수 없었습니다. 이 옵션을 작동시킨 경우 댓글로 남겨주세요 :)

라즈베리 파이는 하드웨어를 커널에 설명하기 위해 디바이스 트리를 사용합니다. 우리는 커널에 PCIe 인터페이스를 사용하고 싶다고 알리기 위해 dtparam(디바이스 트리 매개변수)를 설정해야합니다. 다음과 같은 라인을 /boot/firmware/config.txt 파일에 추가하여 이 작업을 수행할 수 있습니다(가장 아래에 추가):

<div class="content-ad"></div>


해당 테이블은 마크다운 형식으로 변경되었습니다.

```js
dtparam=pciex1
dtparam=pciex1_gen=2 # 이는 속도를 설정합니다. 최대 3까지 설정할 수 있습니다.
```

TPU를 위해 활성 상태 전원 관리(ASPM)를 비활성화해야 한다고 하는군요. 이를 위해 /boot/firmware/cmdline.txt 파일에서 rootwait 바로 앞에 pcie_aspm=off를 추가하여 수행할 수 있습니다.

재부팅한 후 lspci 명령을 실행하면 TPU가 목록에 표시될 것입니다.

이제 커널이 TPU의 존재를 인식했지만, 상호 작용하려면 커널 드라이버가 필요합니다. 이는 사용자 응용 프로그램이 안전 상의 이유로 하드웨어와 직접 통신하는 것을 허용하지 않기 때문에 필요한 조치입니다. 모든 하드웨어 상호 작용은 시스템 호출을 통과해야 하며, 이를 통해 프로그램 실행이 커널 모드로 이동하여 하드웨어에 안전하게 액세스할 수 있습니다.


<div class="content-ad"></div>

코랄 TPU 드라이버는 Google Gasket(Google ASIC 소프트웨어, 커널 익스텐션 및 도구) 드라이버와 TPU 드라이버 소프트웨어인 libedgetpu로 구성됩니다.

Libedgetpu는 APT(Advanced Package Tool) 패키지 관리자를 통해 설치할 수 있습니다. libedgetpu의 소스를 소스 목록 파일에 추가하면 apt가 패키지를 찾을 때 스캔하는 것이 필요합니다. 또한 패키지의 무결성을 확인하기 위해 SHA 키를 추가해야 합니다:

```bash
sudo apt update
echo "deb https://packages.cloud.google.com/apt coral-edgetpu-stable main" | sudo tee /etc/apt/sources.list.d/coral-edgetpu.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install libedgetpu1-std
```

그런 다음 시스템에 Gasket 커널 모듈을 설치해야 합니다. 이를 위한 하나의 방법은 커널 소스 트리에 소스 코드를 추가하고 커널 드라이버로 컴파일하는 것입니다(이 방법으로 성공하지 못했지만 가능할 것으로 생각됩니다). 그러나 이를 수행하는 선호되는 방법은 DKMS(Dynamic Kernel Support Module)를 사용하는 것입니다. DKMS를 사용하면 소스 코드가 기본적인 커널 소스 외부에 있는 커널 모듈을 빌드할 수 있습니다. 이 방법의 추가적인 장점은 새 커널이 설치될 때 자동으로 모듈을 다시 빌드한다는 것입니다.

<div class="content-ad"></div>

```js
sudo apt install -y devscripts debhelper  # dkms 종속성 설치
sudo apt install dkms 
sudo apt-get install dh-dkms # dkms 도우미 모듈
```

이제 공식 가스켓 드라이버를 다운로드하고 설치하기 위해 필요한 모든 종속성이 준비되었습니다:

```js
# 가스켓 드라이버 리포지토리 복제
sudo git clone https://github.com/google/gasket-driver.git
cd gasket-driver
sudo debuild -us -uc -tc -b # 가스켓 드라이버 패키지 빌드
cd .. 
sudo dpkg -i gasket-dkms_1.0-18_all.deb
```

exec 포맷 오류(컴파일러 불일치)로 .deb 패키지를 여러 번 설치하는 데 문제가 생겼다고 해요. 나는 Pi에서 커널을 빌드하고 로컬로 설치하여 이 문제를 해결했다고 해요.

<div class="content-ad"></div>

커널 드라이버는 하드웨어를 응용 프로그램에 노출시켜 /dev 하위에 장치로 노출시킴으로써 하드웨어를 노출합니다. TPU에 대한 사용자 프로그램의 액세스를 수동으로 허용해야 합니다. /dev/apex 장치를 통해 TPU에 접근할 수 있도록 해야 합니다. (왜 'apex'이라고 불리는지 전혀 모르겠습니다):

```js
sudo sh -c "echo 'SUBSYSTEM==\"apex\", MODE=\"0660\", GROUP=\"apex\"' >> /etc/udev/rules.d/65-apex.rules"
sudo groupadd apex
sudo adduser $USER apex
```

이 과정의 마지막 단계는 TPU로부터 인터럽트를 처리하는 인터럽트 컨트롤러를 변경하는 것입니다. TPU는 MSI (Message Signaled Interrupts)를 사용하는데, 이는 일반적인 인터럽트 (IRQ)와 다르게 인터럽트 레지스터가 CPU의 IO 레지스터로 메모리 매핑된다는 면에서 다릅니다 (제대로 이해했다면요). 커널 6.6.30부터는 이를 /boot/firmware/config.txt 파일에 추가할 dtoverlay를 통해 쉽게 변경할 수 있습니다: dtoverlay=pineboards-hat-ai . 재부팅하면 CV 모델을 TPU에 배포할 준비가 끝납니다!

그러나 이전 버전의 커널을 사용하고 있다면, 장치 트리 소스 코드에서 msi-parent 속성을 수동으로 변경해야 합니다. 커널을 처음부터 컴파일했다면 커널 소스 코드에서 직접 소스 코드를 변경할 수 있지만, 그렇지 않으면 먼저 컴파일된 .dtb (장치 트리 바이너리) 파일을 .dts (장치 트리 소스) 파일로 디컴파일해야 합니다. 그런 다음 msi-parent를 phandle의 값으로 변경해야 합니다. 제 경우에는 0x6e였지만, 이 값은 변경될 수 있습니다. 소스 코드를 찾아보면 해당 값이 있습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-AcceleratingCVwithaRaspberryPi5andCoralTPUPart1_1.png)

```js
sudo cp /boot/firmware/bcm2712-rpi-5-b.dtb /boot/firmware/bcm2712-rpi-5-b.dtb.bak
sudo dtc -I dtb -O dts /boot/firmware/bcm2712-rpi-5-b.dtb -o ~/test.dts
sudo sed -i '/pcie@110000 {/,/};/{/msi-parent = <[^>]*>;/{s/msi-parent = <[^>]*>;/msi-parent = <0x6e>;/}' ~/test.dts
sudo dtc -I dts -O dtb ~/test.dts -o ~/test.dtb
sudo mv ~/test.dtb /boot/firmware/bcm2712-rpi-5-b.dtb
sudo reboot now
```

다음 튜토리얼에서 TPU에서 Mobilenet을 훈련하고 실행할 거에요.

소스:


<div class="content-ad"></div>

- [https://gist.github.com/dataslayermedia/714ec5a9601249d9ee754919dea49c7e](https://gist.github.com/dataslayermedia/714ec5a9601249d9ee754919dea49c7e)
- [https://www.jeffgeerling.com/blog/2023/pcie-coral-tpu-finally-works-on-raspberry-pi-5](https://www.jeffgeerling.com/blog/2023/pcie-coral-tpu-finally-works-on-raspberry-pi-5)