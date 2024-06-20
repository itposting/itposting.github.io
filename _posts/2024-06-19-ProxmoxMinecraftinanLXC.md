---
title: "프록시목스 LXC로 마인크래프트하기"
description: ""
coverImage: "/assets/img/2024-06-19-ProxmoxMinecraftinanLXC_0.png"
date: 2024-06-19 02:34
ogImage: 
  url: /assets/img/2024-06-19-ProxmoxMinecraftinanLXC_0.png
tag: Tech
originalTitle: "Proxmox: Minecraft in an LXC"
link: "https://medium.com/@rar1871/proxmox-minecraft-in-an-lxc-792419c93b16"
---


다시 안녕하세요 여러분! 혼자 방에서 마인크래프트를 하는 것에 지루해 하셨나요? 사기를 당하거나 품질이 낮은 온라인 호스트를 사용하지 않고 친구들과 함께 플레이하고 싶으신가요? 매달 전기 요금을 두 배로 올리는 서버가 있나요? 그렇다면 정말 좋아요! 이 기사는 여러분을 위해 준비되었습니다. Proxmox의 LXC에 Minecraft(구체적으로 PaperMC)를 설치하고, 어디에서나 액세스할 수 있도록 열어 보겠습니다!

![이미지](/assets/img/2024-06-19-ProxmoxMinecraftinanLXC_0.png)

요구 사항:

- Proxmox 서버가 실행되고 구성되어 있어야 합니다.
- 좋은 인터넷 연결이 필요합니다.
- 기본적인 CLI 지식이 필요합니다.

<div class="content-ad"></div>

LXC를 생성하는 방법:

네, 서버에 원하는 만큼의 RAM을 부여할 수 있어요. 저는 개인적으로 코어 4개, RAM 8GB, 스토리지 16GB로 운영 중이고 완벽히 작동해요! 물론 더 많은 플레이어가 있을 경우 더 많은 자원이 필요할 거에요. 이 안내서의 단계를 따라 컨테이너를 설정하세요. 저는 컨테이너로 Debian 11을 사용하고 있어요. 다른 유사한 배포판을 사용할 수도 있지만, 아래의 설치 단계는 설치 환경에 따라 다를 수 있어요.

서버를 외부 세계에 직접 노출시키려면 해당 가이드의 Assigning a Static IP 섹션도 읽어보셔서 컨테이너에 정적 IP 주소를 라우터에 할당하세요.

<div class="content-ad"></div>

LXC를 설정하는 방법:

마인크래프트를 실행하기 전에 Java 런타임을 설치해야 합니다. 다행히 이 작업이 꽤 쉽습니다:

```js
apt install openjdk-17-jdk
```

설치가 완료되면 마인크래프트 서버를 위해 폴더를 생성해야 합니다. 제 경우에는 mkdir /opt/minecraft/ 입니다. 이 폴더의 위치를 기억해 두세요. 이 위치는 나중에 컨테이너를 시작할 때 자동으로 마인크래프트를 시작하는 서비스를 구성할 때 필요합니다.

<div class="content-ad"></div>

PaperMC 설정하는 방법:

PaperMC는 기본 Minecraft 서버보다 성능이 우수한 초경량 Minecraft 서버 패키지입니다. 이 튜토리얼에서는 Paper를 사용할 것이지만, 기본 서버나 Forge와 같이 수정된 서버를 사용해도 괜찮습니다. 수정된 서버에 대한 설치 단계는 여기서 다루는 것과 다를 수 있으니 귀하의 서버에 대한 특별한 요구 사항을 확인해주시기 바랍니다.

이전에 생성한 Minecraft 폴더로 이동하여 Paper를 다운로드하세요.

```js
wget https://api.papermc.io/v2/projects/paper/versions/1.20.4/builds/435/downloads/paper-1.20.4-435.jar
```

<div class="content-ad"></div>

개인적으로 파일 이름을 바꾸는 것이 좀 더 나중에 쉽게 입력할 수 있도록 만드는 것을 좋아합니다. 어떤 사람들은 이렇게 하면 실행 중인 버전을 추적하기가 더 어려워진다고 언급했습니다. 이는 사실이지만, 저는 서버의 정확한 버전을 추적하는 데 신경을 쓰지 않습니다. 서버 측 모드를 사용하지 않기 때문에 실제로 중요하지 않습니다. 몇 달에 한 번씩 확인하고 서버를 업데이트하기만 합니다.

```js
mv paper-1.20.4-435.jar server.jar
```

이제 서버를 실행하세요.

```js
java -jar server.jar
```

<div class="content-ad"></div>

서버가 시작되는 것을 보게 될 것입니다. 폴더에 몇 가지 파일이 생성되고, EULA를 수락하지 않았다는 오류가 발생한 후에 작업이 실패할 것입니다. 이 문제를 해결하기 위해 다음과 같이 EULA를 수락하세요.

```js
nano eula.txt
```

eula=false를 eula=true로 변경하고 파일을 저장하세요.

이제 EULA를 수락했으므로 모든 것이 잘 작동합니다! 그러나 작은 문제가 하나 있습니다. 명령어 java -jar server.jar를 사용하여 서버를 시작하면 현재 터미널이 사용 중인 상태로 남아 있습니다. 현재 환경을 나와도 서버가 중지됩니다. 또한 현재 터미널에서 다른 명령어를 실행할 수 없으므로 매우 불편합니다. 터미널에서 스크린을 사용할 수 있지만, 저는 이것이 과도한 방법이라고 생각해요. 저에게 가장 간단한 방법은 Minecraft 서버를 실행할 서비스를 만드는 것입니다. 컨테이너를 켤 때 자동으로 시작하도록 구성하여 필요할 때마다 수동으로 켤 필요가 없도록 할 것입니다.

<div class="content-ad"></div>

서비스 생성하기

/etc/systemd/system으로 이동하세요.

서비스 파일을 생성하세요. `nano minecraft.service`

다음 구성을 서비스 파일에 붙여넣으세요.

<div class="content-ad"></div>


[Unit]
Description=Minecraft 서버
After=network.target
StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
WorkingDirectory=/opt/minecraft
ExecStart=java -Xms2G -Xmx8G -jar /opt/minecraft/server.jar --nogui

[Install]
WantedBy=multi-user.target


파일을 저장합니다. 그런 다음 systemctl daemon-reload를 실행하여 새 서비스가 인식되도록하고, 부팅 시 실행되도록 systemctl enable minecraft를 사용하여 활성화한 다음 systemctl start minecraft를 사용하여 서버를 시작합니다. 이것은 수동으로 시작해야 하는 유일한 시간입니다. 이 구성에서 몇 가지 중요한 옵션을 주목합시다.

- WorkingDirectory: 이전에 생성한 폴더의 절대 경로입니다.
- -Xms2G: Minecraft 서버에 언제든지 할당되어야 하는 RAM의 최소량이며 서버의 부하 양에 관계없이 2GB입니다.
- -Xmx8G: 서버가 사용할 수있는 RAM의 최대량입니다. 여기서는 컨테이너의 총 RAM 양으로 설정했습니다. 문제를 방지하기 위해 총 RAM 양보다 약간 작은 값으로 설정할 수 있지만, 지금까지 문제가 발생하지 않았습니다.
- /opt/minecraft/server.jar: 서버 파일의 절대 경로입니다 (파일 및 디렉토리 이름에 따라 달라질 수 있음).

집 네트워크에서만 게임을 하려면 바로 진행하면 됩니다! 그러나 아직도 연락하는 고등학교 친구와 15개 시간대가 떨어진 곳에서 게임을 하고 싶다면 Minecraft 서버를 인터넷에 노출해야 합니다. 아래에서 계속 읽어보세요.


<div class="content-ad"></div>

서버 노출하기:

여기서 두 가지 옵션이 있습니다. 마인크래프트 서버를 라우터를 통해 포트 포워드하거나, Minekube Connect와 같은 프록시를 사용할 수 있습니다. 여기에서 두 가지 옵션에 대해 설명하겠습니다.

옵션 1: 포트 노출

여기에서는 라우터를 통해 서버의 포트(보통 25565)를 포트 포워드해야 합니다. 이 방법은 가장 직접적인 방법이지만 가장 불안전합니다. 포트를 직접 인터넷에 공개하는 것은 악성 트래픽을 처리하기 위해 Paper와 같은 서비스에 완전히 신뢰를 두는 것이므로 매우 위험하다는 것은 명백합니다. 그러나 가끔씩만 플레이하고 빠른 옵션이 필요하다면 이것이 좋은 방법일 수 있습니다. 이를 수행하는 방법은 각기 다른 라우터마다 다르므로 이 안내서에서 모두 다루지는 않겠습니다.

<div class="content-ad"></div>

저는 방화벽을 통해 포트를 직접 노출시키는 것을 선호하지 않습니다. 이런 방식은 중간에 버퍼 없이 곧바로 노출시키는 것으로, 이 접근 방식을 권장하지 않습니다. 대신에 옵션 2를 추천합니다(프록시 사용).

옵션 2: 프록시 사용

Minekube Connect는 무료 프록시로, 방화벽을 통해 포트를 직접 노출시키지 않고 Minecraft 서버에 연결할 수 있는 방법입니다. 이를 클라우드플레어 터널과 같이 생각해보세요. 또한, DDoS 방어 기능도 포함되어 있어, 작은 서버에는 필수적이지는 않지만 확실히 장점이 될 것입니다. 설정도 매우 쉽습니다. 함께 설정해 봅시다.

- Minekube에 가서 계정을 만듭니다: https://app.minekube.com
- 그런 다음, 왼쪽 사이드바에서 Endpoints > Add Endpoint로 이동합니다.
- 엔드포인트에 이름을 지정합니다. 참고: 엔드포인트 이름은 생성 후 변경할 수 없습니다.
- 실행 중인 서비스에 대해 Paper/Spigot(기본 옵션)을 선택합니다.
- 해당 웹페이지 맨 아래로 스크롤하여 토큰을 생성합니다. 토큰을 변경하려는 의사를 확인합니다. 이 토큰은 다시 표시되지 않으니 잘 메모해 둡시다.
- 플러그인 다운로드 링크를 복사하여 LXC 컨테이너로 돌아갑니다. (저의 경우 /opt/minecraft 디렉터리로 이동) 그리고 플러그인 폴더로 이동합니다 (cd ./plugins).
- 플러그인 파일을 다운로드합니다: wget https://...플러그인 URL...
- Minecraft 서비스를 재시작합니다: systemctl restart minecraft. 기본 연결 파일이 생성됩니다.
- 플러그인 폴더 안에 있으면, 설정 파일을 엽니다: nano config.yml
- endpoint-name을 Minekube 웹사이트에서 생성한 엔드포인트 이름으로 대체합니다. 변경한 후 파일을 저장하고 닫습니다.
- 그런 다음, 토큰 파일을 엽니다: nano token.json
- 토큰 문자열을 5단계에서 생성한 토큰으로 대체합니다. 파일을 저장하고 닫습니다.
- Minecraft 서비스를 마지막으로 한 번 더 재시작합니다!

<div class="content-ad"></div>

그게 다야! 이제 모든 준비가 끝났어요. 서버는 ENDPOINT_NAME.play.minekube.net 에서 접속 가능할 거에요.

서버 업데이트 방법:

서버를 업그레이드하고 싶다면:

- Minecraft 서비스를 중지하려면 systemctl stop minecraft를 실행하세요.
- 서버 폴더로 이동하세요: cd /opt/minecraft
- 이전 서버 파일을 삭제하세요: rm server.jar
- 새로운 서버 파일을 다운로드하세요: wget ...DOWNLOAD URL...
- 파일 이름을 변경하세요: mv ...FILE NAME.jar... server.jar
- 서비스를 시작하세요: systemctl start minecraft
- 수익 창출하기!

<div class="content-ad"></div>

이 작업을 수행할 때 "apt update && apt upgrade"도 실행하는 것을 추천합니다. 시스템 패키지도 컨테이너에서 최신 상태인지 확인할 수 있습니다.

그것이 전부입니다! 이제 완료되었습니다! 이제 친구들과 함께 자신의 서버에서 Mincraft를 즐길 수 있습니다!

면책 조항:

이 문서는 제품 또는 비즈니스 환경에서 설정하는 가이드가 아닙니다. 인터넷에 노출하기 전에 노출되는 모든 서비스가 적절히 보안되어 있는지 확인하세요. VPN을 사용하더라도.

<div class="content-ad"></div>

저는 IT 전문가가 아닙니다. 기술 지원팀도 아니에요. 대학생이자 서버를 가진 사용자입니다. 시스템에서 실행하는 모든 명령에 대한 최종 책임은 여러분에게 있습니다.

질문이 있으면 댓글을 남겨주세요. 즐겨보세요!