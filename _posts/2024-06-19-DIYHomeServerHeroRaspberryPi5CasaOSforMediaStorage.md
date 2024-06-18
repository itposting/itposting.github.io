---
title: "DIY 홈 서버 히어로 미디어 및 저장 용 Raspberry Pi 5  CasaOS"
description: ""
coverImage: "/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_0.png"
date: 2024-06-19 06:16
ogImage: 
  url: /assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_0.png
tag: Tech
originalTitle: "DIY Home Server Hero: Raspberry Pi 5 + CasaOS for Media , Storage"
link: "https://medium.com/@kshitijdarwhekar/diy-home-server-hero-raspberry-pi-5-casaos-for-media-storage-17a18c7b4a0b"
---


<img src="/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_0.png" />

# 소개

이 튜토리얼에서는 라즈베리 파이 5를 사용하여 강력한 홈 서버를 구축한 방법을 공유하겠습니다. 이 서버는 미디어 스트리밍과 저렴한 NAS 기능을 해결합니다. 사전 구축된 NAS 솔루션이 있지만, 직접 만드는 과정에서 독특한 만족감이 있습니다.

# 왜 홈 서버를 만들어야 할까요?

<div class="content-ad"></div>

- 비용 효율적: Raspberry Pi 5 기반 NAS는 상업용 NAS 솔루션보다 훨씬 저렴합니다.
- 맞춤 설정: 운영 체제와 서버에서 실행할 서비스를 포함해 설정에 대한 완전한 제어권이 있습니다. 이를 통해 특정한 요구 사항에 맞게 맞춤 설정할 수 있습니다.
- 학습 경험: 홈 서버를 구축하고 유지하는 것은 서버, 저장 솔루션, 네트워킹 개념 및 Cloudflare 터널과 같은 도구와 유사 경험을 쌓는 훌륭한 방법입니다.
- 개인정보 보호: 데이터를 직접 관리할 수 있습니다. 자체 호스팅으로 제3자 클라우드 솔루션에 의존하지 않아 개인정보 관련 우려를 피할 수 있습니다.

# 준비물

## 하드웨어

- Raspberry Pi 5
- 마이크로 SD 카드 (32GB 이상)
- Raspberry Pi 공식 전원 어댑터
- 이더넷 케이블 (안정적인 연결을 위해)
- 외장 하드 드라이브 또는 SSD

<div class="content-ad"></div>

## 소프트웨어

- Raspberry Pi Imager (Ubuntu Server 24.04 LTS)
- Casa OS
- Jellyfin 또는 Plex (미디어 서버)
- Nextcloud (Google Drive 대안)
- Cloudflared 또는 Cloudflare Tunnel Client (네트워크 외부에서 원격 액세스)

# 단계 1 : Ubuntu Server 24.04 LTS 설치

Raspberry Pi Imager를 다운로드하고 Ubuntu Server를 마이크로 SD 카드에 플래시합니다. VNC 또는 모니터를 사용하여 Raspberry Pi에 부팅하고 화면에 표시된 지침에 따라 설정을 완료합니다.

<div class="content-ad"></div>

터미널에서 업데이트 및 업그레이드 명령어를 입력하세요.

```bash
sudo apt-get update

sudo apt-get upgrade
```

Ubuntu Server 24.04 LTS의 특징

- LTS는 Long Term Support의 약자로 다섯 년간의 무료 보안 및 유지 보수 업데이트를 제공합니다.
- Linux 6.8 커널에서는 기본으로 저지연 커널 기능이 활성화되어 있습니다.
- 대부분의 x86 아키텍처 패키지에 대해 프레임 포인터가 기본으로 활성화되어 있습니다.
- Rust 1.75, .NET 8 및 TCK 인증이 포함된 OpenJDK 21과 같은 다른 툴체인 업그레이드
- 2038년 문제를 해결하기 위해 armhf에서는 기본으로 64비트 타임스탬프를 사용합니다.
- AppArmor로 강제된 특권이없는 사용자 이름 영역이 기본적으로 제한됩니다.

<div class="content-ad"></div>

먼저 충돌하는 패키지를 모두 제거해야 해요. 다음 명령어를 실행해서 충돌하는 모든 패키지를 제거하세요.

```js
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

- Docker apt 저장소를 설정하세요.

```js
# 도커의 공식 GPG 키를 추가하세요:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# Apt 소스에 저장소를 추가하세요:
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

<div class="content-ad"></div>

2. 도커 패키지를 설치하세요.

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. 도커 설치가 성공적인지 확인하려면 hello-world 이미지를 실행하세요.

```bash
sudo docker run hello-world
```

<div class="content-ad"></div>

이 명령은 테스트 이미지를 다운로드하여 컨테이너에서 실행합니다. 컨테이너가 실행되면 확인 메시지를 출력한 후 종료됩니다.

# 단계 3: Casa Os 설치

Casa OS와 Casa Os를 선택한 이유는 무엇인가요?

- Casa OS는 간단한 가정용 클라우드 경험을 제공하는 커뮤니티 기반의 오픈 소스 소프트웨어입니다.
- 아무 싱글 보드 컴퓨터(SBC), 오래된 PC 또는 Linux를 실행하는 장치에서 실행할 수 있습니다.
- 간단히 말해 Casa Os는 앱 스토어를 통해 도커 컨테이너를 관리하는 멋진 대시보드입니다.
- 도커 컨테이너를 관리하기 위한 여러 대안이 인터넷에서 제공되지만, 그 중 몇 가지는 portainer, proxmox가 있습니다.
- 저는 Casa Os를 선택했는데, 이는 초보자 친화적이며 설정이 쉽고 proxmox와 같은 다른 소프트웨어보다 적은 시스템 자원을 필요로 하기 때문입니다. Portainer는 검토할 수 있는 좋은 대안입니다.

<div class="content-ad"></div>

- 다음 명령을 사용하여 시스템에 Casa Os를 설치하세요

```js
curl -fsSL https://get.casaos.io | sudo bash
```

2. Casa Os에 액세스하기

사용 중인 브라우저를 열어 Casa Os 웹 UI가 준비되었는지 확인하세요. 터미널에서 얻은 URL을 사용해주세요. 이 URL은 라즈베리 파이의 IP 주소입니다. Casa Os에 액세스하려는 기기가 라즈베리 파이가 연결된 동일한 네트워크에 연결되어 있는지 확인하세요. 설정을 완료하기 위해 화면 안내에 따라 진행하세요.

<div class="content-ad"></div>

가서 계정 설정을 시작하려면 Go를 클릭하세요

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_1.png)

세부 정보를 입력하고 생성을 클릭하세요.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_2.png)

<div class="content-ad"></div>

다음 페이지에서는 까사 오스(Casa Os)에 대한 최신 소식을 받고 싶은지 물어볼 것입니다. 원하시는 대로 '예' 또는 '아니오'를 선택하실 수 있습니다.

그 다음 페이지에서는 까사 오스(Casa Os) 대시보드를 볼 수 있습니다.

![Casa Os Dashboard](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_3.png)

# 단계 4 : 앱 스토어에서 앱 설치하기.

<div class="content-ad"></div>

원하는 모든 필수 앱 (기본적으로 도커 이미지입니다)을 다운로드하세요. 이 튜토리얼에서는 다음을 다운로드할 것입니다.

- Jellyfin (미디어 서버)

![Jellyfin](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_4.png)

2. Nextcloud (Google 드라이브 대안)

<div class="content-ad"></div>

천천히 즐기며 작업하시고 계속 진행하시기 바랍니다.

<div class="content-ad"></div>

외부 드라이브 또는 SSD가 라즈베리 파이의 USB 3.0 포트에 연결되어 있는지 확인해주세요. 앱이 설치된 후, 앱에 표시된 세 개의 점을 클릭하고 설정으로 이동해주세요. 여기서 도커의 모든 설정을 볼 수 있을 거에요. 포트, 네트워크, 볼륨, 환경 변수 등이 있어요. '볼륨'이 보이기 전까지 스크롤을 내려주세요. '호스트' 섹션에 외부 드라이브의 경로를 추가하고 '컨테이너' 섹션에 원하는 이름을 추가해주세요. 저는 "Lap"을 추가했어요. 아래 그림에서 확인할 수 있어요.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_7.png)

이제 앱이 새로고침되고 열 수 있게 되며 Jellyfin 설정을 완료하기 위해 화면 안내에 따라 진행하실 수 있어요. 이 설정을 하기 전에 Jellyfin에서 권장하는 폴더 구조를 따르는지 확인해주세요. 이를 위해 공식 Jellyfin 문서를 참고하실 수 있어요:

- TV 프로그램 : [https://jellyfin.org/docs/general/server/media/shows/](https://jellyfin.org/docs/general/server/media/shows/)
- 영화 : [https://jellyfin.org/docs/general/server/media/movies](https://jellyfin.org/docs/general/server/media/movies)
- 음악 : [https://jellyfin.org/docs/general/server/media/music](https://jellyfin.org/docs/general/server/media/music)

<div class="content-ad"></div>

# 단계 5: 원격 액세스를 위한 Cloudflare 터널 설정. (선택사항)

이제 모든 앱이 설치되고 설정이 완료되었습니다. 당신만의 홈 서버를 구축하는 마지막 단계입니다. 가정 내 홈 서버가 설정되어 있고 당신은 다른 곳에 있다면서도 서버에 액세스하고 싶을 때 Cloudflare 터널을 사용할 수 있습니다 (미디어 서버를 제외하고). Cloudflare의 이용 약관에 따라 클라우드플레어 무료 티어를 사용하여 미디어 서버에 원격 액세스할 수 없습니다. 아래 단계를 따라 Cloudflare 터널을 설정하세요

- Cloudflare 터널을 사용하려면 도메인 이름이 필요합니다. hostinger, namecheap, cloudflare 등의 도메인 공급업체에서 매우 저렴하게 구매할 수 있습니다.
- 도메인 이름을 구매한 후에는 도메인 이름 공급업체의 웹사이트에서 네임서버를 cloudflare로 변경해야 합니다.
- cloudflare.com에 가서 '회원 가입'을 클릭하세요. 사용 가능한 옵션 중 '무료 티어'를 클릭하세요. 이메일과 비밀번호를 입력하여 회원 가입을 완료하세요.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_8.png)

<div class="content-ad"></div>

4. "웹 사이트 또는 애플리케이션 추가"를 클릭하세요.

5. 방금 구매한 도메인 이름을 입력하거나 Cloudflare에서 도메인 이름을 등록할 수 있습니다.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_9.png)

6. 아래로 스크롤하여 무료 요금제를 클릭하세요.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_10.png)

7. 도메인 이름과 관련된 DNS 레코드를 찾으려면 스캔을 클릭하세요.

8. 다음 단계는 활성화입니다. 여기에서는 도메인 이름을 구매한 웹사이트로 돌아가서 화면에 제공된 클라우드플레어 이름 서버로 웹사이트의 네임서버를 변경해야 합니다. 이 작업은 일반적으로 시간이 걸리며 프로세스가 완료되면 이메일로 통보받게 됩니다.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_11.png)

<div class="content-ad"></div>

9. 이제 Cloudflare 터널 설정을 진행합니다. 사이드바에서 '제로 트러스트'를 선택하세요. 팀 이름을 선택해주세요. 원하는 것으로 입력하시면 됩니다.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_12.png)

10. 다음 화면에서 무료 요금제를 선택하세요. 작업을 위해 카드 세부 정보를 입력해주셔야 합니다. 하지만 걱정마세요, 클라우드플레어 이용 약관을 준수할 때까지 요금이 청구되지는 않습니다.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_13.png)

<div class="content-ad"></div>

11. 지금 결제 세부 정보가 추가되었습니다. 네트워크의 사이드바 하단에 터널이 표시됩니다. 터널을 추가하고 클라우드플레어드를 커넥터로 선택해 주세요.

![image](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_14.png)

12. 터널을 이름 붙이고 환경을 선택하세요 (도커가 권장됩니다). 화면에 표시된 명령어를 복사하여 Casa Os에 다운로드한 클라우드플레어 앱에 붙여넣으세요. 시작을 클릭하면 클라우드플레어 대시보드에서 커넥터 상태를 확인할 수 있습니다.

![image](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_15.png)

<div class="content-ad"></div>

13. 마지막 페이지에 터널을 위한 공개 호스트 이름을 추가하세요. 도메인 이름, 서브도메인(선택 사항) 및 서비스 유형을 입력하십시오. URL에는 IP 주소 및 특정 포트의 세부 정보를 입력합니다. 터널을 저장하고 나면 앱에 원격으로 액세스할 수 있습니다.

![이미지](/assets/img/2024-06-19-DIYHomeServerHeroRaspberryPi5CasaOSforMediaStorage_16.png)

# 도전과 해결책:

## 도전 1: 원격 액세스를 위한 SSH 설정

<div class="content-ad"></div>

제가 모니터가 없어서 Raspberry Pi에 Putty 소프트웨어를 사용하여 ssh하고 싶었지만, 라즈베리 파이에 Ubuntu Server 24.04를 처음 설치했을 때 라즈베리 파이에 부팅할 수 없는 문제가 발생했습니다.

해결책:

- 문제 해결: 일부 문제 해결 후 Ubuntu Server에 ssh할 수 있었습니다.

## 도전 2: 원격 액세스 설정

<div class="content-ad"></div>

저는 집 서버에 원격으로 액세스하고 싶었습니다. 그렇게 하면 집에 없을 때도 파일을 관리하고 미디어를 스트리밍할 수 있을 것 같았어요. 그러나 원격 액세스를 안전하게 구성하는 것은 조금 복잡할 수 있어요.

해결책:

- 조사: SSH 터널 및 Cloudflare 터널을 포함한 다양한 원격 액세스 방법을 조사했어요.
- Cloudflare 터널 선택: Cloudflare 터널을 사용하기로 결정했는데, 그들의 사용 편의성과 보안 기능 때문이었어요.
- 구성 과제: Cloudflare 터널 설정에는 DNS 레코드 생성 및 라즈베리 파이에서 방화벽 규칙 구성이 포함되었어요. 온라인에서 안내하는 유익한 자습서를 찾아 프로세스를 단계별로 진행할 수 있었어요.
- 문제 해결: 처음에 원격으로 서버에 액세스할 수 없는 문제가 발생했어요. 문제 해결 후 DNS 레코드 구성에 오타가 있었음을 발견했어요. 그 오타를 고치면 문제가 해결되었어요.

# 향후 계획

<div class="content-ad"></div>

- 클라우드플레어 터널 대신 tailscale 및 twingate 같은 소프트웨어를 사용하여 라즈베리 파이에 원격으로 액세스할 수 있습니다.
- 미디어 서버를 자동화해서 사용자가 arr 앱을 사용하여 볼 미디어를 요청할 수 있습니다.
- 서버에 자체 서명 SSL 인증서를 설정하여 보안 경고를 피할 수 있습니다.
- 서버에 개인 웹 사이트를 호스팅할 수 있지만, 서버 다운 시에 웹 사이트에 액세스할 수 없기 때문에 권장되지 않습니다.
- Raspberry Pi 5에 UPS를 설정하여 다운 타임을 없앨 수 있습니다.

# 결론

이 홈 서버 구축은 정말 즐거운 프로젝트였습니다. 가끔 발생하는 문제 해결이 괴로울 수도 있지만, 처음부터 완전히 기능적인 홈 서버를 만들어내는 엄청난 만족감은 모든 어려움을 뛰어넘었습니다. 재미 이상으로, 이 프로젝트는 귀중한 학습 경험이 되었습니다. 서버 관리, 네트워킹 개념 및 Docker에 대한 실용적인 지식을 습득하며, 모든 기술 애호가에게 필수적인 기술들을 얻을 수 있었습니다. 이 프로젝트에 착수한 저 자신을 자랑스럽게 생각하고, 여러분도 고유의 홈 서버를 구축하는 것을 고려해 보라고 추천하고 싶습니다. 보상적이고 교육적인 여정이 될 수 있습니다.