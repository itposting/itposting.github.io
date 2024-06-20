---
title: "NGINX LXC에 Proxy Manager 설치하기 - V2, Debian"
description: ""
coverImage: "/assets/img/2024-06-20-NGINXInstallingProxyManagerinLXCV2Debian_0.png"
date: 2024-06-20 17:18
ogImage: 
  url: /assets/img/2024-06-20-NGINXInstallingProxyManagerinLXCV2Debian_0.png
tag: Tech
originalTitle: "NGINX: Installing Proxy Manager in LXC — V2, Debian"
link: "https://medium.com/@rar1871/nginx-installing-proxy-manager-in-lxc-v2-debian-d4d4c98109b1"
---


이 문서는 아래 링크에서 확인할 수 있는 이전 버전의 업데이트입니다. 작년에는 이전 가이드에서 사용했던 설치 스크립트가 Debian 및 Ubuntu를 지원하도록 업데이트되었습니다. Alpine Linux를 사용하려면 이전 가이드를 따르세요:

지금은 Alpine을 참지 못해요. 사용 용도는 있을 텐데, 저는 Debian에서 더 편안해요. 따라서 Alpine 설정을 Debian으로 변경하고 프로세스를 문서화하기로 결정했어요.

참고: 이 가이드를 따르기 위해 나와 같이 기존 설치가 필요하지 않아요.

Nginx Proxy Manager에 대한 자세한 정보나 역방향 프록시가 무엇인지 알고 싶다면 이전 가이드를 참조하세요.

<div class="content-ad"></div>

요구 사항:

- Proxmox 설정 및 접근 가능
- LXC 생성에 대한 기본 지식
- 인터넷 액세스
- 정적 IP 주소 설정을 위한 라우터 관리 패널 액세스

새 컨테이너 생성:

이 프로세스의 첫 번째 단계는 제가 이주하거나 새롭게 설치하는 경우와 상관없이 컨테이너를 만드는 것입니다. 이를 수행하는 방법은 가이드의 "컨테이너 생성" 섹션을 참조하면 됩니다. Debian 또는 Ubuntu 컨테이너를 생성할 수 있습니다. 사용자 편의를 위해 Debian을 사용하겠습니다.

<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>

```js
sh -c "$(wget --no-cache -qO- https://raw.githubusercontent.com/ej52/proxmox/main/install.sh)" -s --app nginx-proxy-manager
```

아주 빨리 다음과 같은 화면이 표시됩니다:

<img src="/assets/img/2024-06-20-NGINXInstallingProxyManagerinLXCV2Debian_1.png" />

설치 프로그램이 작업을 수행하도록 해주세요... 이 작업은 몇 분 정도 소요될 수 있으니 이 기회에 물 한 잔 마시는 것으로 하루를 시작하는 것을 상기해보세요.

<div class="content-ad"></div>

설치 프로그램이 완료되면 다음과 같은 화면이 나타날 것입니다:

![이미지](/assets/img/2024-06-20-NGINXInstallingProxyManagerinLXCV2Debian_2.png)

완벽합니다! 설치가 완료되었습니다! 이 설치 스크립트에 뛰어난 작업을 한 @github/ej52님에게 큰 박수를 보냅니다.

프록시 매니저 구성중:

<div class="content-ad"></div>

프록시 관리자 설정은 이전 버전과 비슷합니다. 이전 버전의 프록시 관리자를 사용 중이라면, 모든 것을 옮기기 시작하려면 여기서 시작해야 합니다. 안타깝게도 이 과정을 간단하게 처리할 방법은 없습니다 (가져오기/내보내기 기능이 있으면 좋을텐데요). 따라서 물을 한 모금 마시고, 모두 수동으로 해야 합니다!

이 가이드를 사용하여 프록시 호스트와 SSL 인증서를 만드세요.

참고: 모든 프록시 호스트를 이동한 후에 WAN의 HTTP 및 HTTPS 포트로 포트 포워딩을 업데이트해야 합니다. 서비스 다운타임을 최소화하기 위해 호스트를 옮긴 후에 이 작업을 수행하세요.

프록시 관리자 업데이트 중:

<div class="content-ad"></div>

프록시 관리자를 업데이트하려면 설치 스크립트를 실행하면 됩니다!

Tailscale로 전역 액세스를 어떻게 하나요?

아직 가능합니다! 실제로 Tailscale이 데비안을 공식적으로 지원하기 때문에 이제는 더 쉽습니다! 해당 가이드를 업데이트하는 중이지만 그 사이에 Tailscale 웹 사이트에서 설치 파일을 다운로드하고 이 가이드를 따라 전역 액세스를 설정할 수 있습니다.

추가 고려 사항:

<div class="content-ad"></div>

이번에도 반복되지만, 로컬 네트워크에서 세계로 노출하는 것은 매우 위험합니다. 반대 프록시 뒤에 있더라도 외부 트래픽을 내부 네트워크로 유입하는 것은 서버가 해킹되거나 더 나아가 개인 기기가 침해당할 수 있습니다. 경고드립니다.

다행히도 Crowdsec를 설치하여 반대 프록시를 더 안전하게 설정할 수 있습니다. Crowdsec는 악성 트래픽을 자동으로 감지하고 차단합니다. 또한 차단된 악성 행위자의 공개 목록을 유지하므로 이러한 IP 주소가 서비스에 도달하기도 전에 차단됩니다! 곧 자세히 알려드리겠습니다 :)

참고 사항:

본 가이드는 본격적인 또는 비즈니스 환경에서의 설정을 위한 것이 아닙니다. 공개 또는 본격적인 환경 설정에 대해 자체적인 연구를 먼저 진행해주시기 바랍니다.

<div class="content-ad"></div>

저는 IT 전문가가 아닙니다. 기술 지원은 제가 할 수 없어요. 대학생이고 서버를 가지고 있는데, 시스템에 실행하는 모든 명령에 대해서는 본인이 책임을 져야 합니다.

질문이 있으시면 댓글을 남겨주세요. 즐기세요!