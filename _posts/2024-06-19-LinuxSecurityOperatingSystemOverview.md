---
title: "Linux 보안  운영 체제 개요"
description: ""
coverImage: "/assets/img/2024-06-19-LinuxSecurityOperatingSystemOverview_0.png"
date: 2024-06-19 15:06
ogImage: 
  url: /assets/img/2024-06-19-LinuxSecurityOperatingSystemOverview_0.png
tag: Tech
originalTitle: "Linux Security — Operating System Overview"
link: "https://medium.com/@cybersecuritystephen/linux-security-operating-system-overview-99e9bacb1616"
---



![Linux Security Operating System Overview](/assets/img/2024-06-19-LinuxSecurityOperatingSystemOverview_0.png)

Windows와 Linux을 비교하는 통계 기사에 따르면, Linux 운영 체제가 모든 웹사이트 중 38.5%에서 사용되며 상위 백만 웹사이트 중 46.8%에서 사용됩니다.¹ 이는 인터넷의 상당 부분이 웹사이트에 Linux를 사용하고 있다는 것을 의미하므로 Linux의 실제 보안 상태를 알고 싶어합니다.

# 간략한 역사

Linux의 모든 보안 기능에 대해 탐구하기 전에 시간을 내어 Linux가 어떻게 발전해 왔는지 살펴봅시다. "Linux는 초기에 1990년대 초에 Unix 운영 체제의 클론으로 개발되었습니다. 따라서 Linux는 핵심 Unix 보안 모델인 Discretionary Access Control (DAC)의 형태를 계승합니다."²


<div class="content-ad"></div>

DAC은 데이터 소유자가 누가 무엇에 액세스할 수 있는지에 대한 정책을 설정할 수 있도록 합니다. 소유자, 특정 그룹 및 기타 사람들(다른 사용자들)은 데이터에 대한 액세스 권한이 다를 수 있습니다. 이는 액세스 제어 목록(ACLs)의 상대적으로 간단한 형태입니다. 그리고 슈퍼 유저라고 불리는 한 명의 특별한 사용자가 더 있습니다. 슈퍼 유저는 시스템에 로그인할 때 어떤 작업도 제한받지 않습니다.

Linux 커널에 새로운 보안 기능을 통합할 때의 중요한 설계 제한 사항은 기존 응용 프로그램을 망가뜨리지 않아야 한다는 것입니다. 본질적으로, 보안 시스템이 처음부터 만들어질 수 없기 때문에 모놀리틱 보안 아키텍처 대신 보안 향상의 대규모 모음이 있다는 의미입니다.

![Linux Security Operating System Overview](/assets/img/2024-06-19-LinuxSecurityOperatingSystemOverview_1.png)

# 보안 기능

<div class="content-ad"></div>

리눅스 운영 체제는 운영 체제 자체의 설계로부터 보안을 제공합니다. 오픈 소스이므로 매우 유연하고 구성 가능하며 다양합니다. 모든 사람이 소스 코드에 액세스할 수 있기 때문에 취약점은 보통 짧은 기간동안 존재합니다. 또한 리눅스 소스 코드는 전 세계 오픈 소스 커뮤니티 구성원들에 의해 지속적으로 철저히 검토되어 발견된 모든 취약점을 수정하는 과정을 가속화합니다. 역사에서 언급했듯이 리눅스는 매우 엄격한 권한 모델을 통해 루트 액세스를 엄격하게 제한하는 것으로도 알려져 있습니다. 슈퍼유저만 모든 권한을 가지고 있고, 일반 사용자는 제한적인 액세스 권한을 갖습니다.

리눅스 커널에는 UEFI Secure Boot 펌웨어 검증 메커니즘을 사용하는 방화벽, 커널 내의 패킷 필터, SELinux 또는 AppArmor 의무 액세스 제어(MAC), 그리고 리눅스 커널 락다운 구성 옵션을 포함한 다양한 내장 보안 보호 기능이 포함되어 있습니다. 이러한 기능을 활성화하고 올바르게 구성하면 가능한 최고 수준의 보안을 제공받을 수 있습니다.

리눅스가 안전한 환경을 제공하는 한 가지 방법은 다양성을 통해 이루어집니다. 수많은 리눅스 배포판이 있으며 각각이 개별 사용자의 요구에 맞게 맞춤 설정될 수 있습니다. 또한, 공격자들에게는 공격을 어렵게 만드는데, 이것은 다양한 배포판과 다양한 보안 수준을 갖춘 운영 체제에 대한 공격을 만들기 어렵게 만듭니다. 고급 보안 및 개인 정보 보호에 중점을 둔 리눅스 배포판도 있습니다.

리눅스는 안티바이러스 소프트웨어가 기본으로 제공되지 않기 때문에 온라인 보안을 유지하기 위해서는 적절한 것을 다운로드하는 것이 중요합니다. Security.org의 기사에 따르면 각 사용자의 필요에 따라 최고의 안티바이러스 소프트웨어를 선택했습니다. 혼합 플랫폼 IT 솔루션용 최고의 안티바이러스는 Kaspersky Antivirus이며, 중소기업용 최고의 소프트웨어는 Bitdefender Antivirus입니다. 파일 서버를 보호하려면 Avast Antivirus가 최적입니다. 기업을 위한 최고의 안티바이러스 소프트웨어는 McAfee Antivirus이며, 개인용으로는 ESET Antivirus가 최선입니다.

<div class="content-ad"></div>

# Best Practices

리눅스를 사용할 때 최선의 방법을 다룬 기사에 따르면 아래 목록은 리눅스 시스템을 사용할 때 가장 좋은 보안 관행을 제공합니다:

- 강력한 암호 사용
- 모든 계정에 암호가 있는지 확인
- 암호 만료 날짜 설정
- 이전 암호 사용 제한
- OpenSSH 서버 보안 보장
- SSH를 통한 루트 로그인 비활성화
- sudo 사용 제한
- User ID가 0으로 설정된 사용자가 루트만 있는지 확인
- 로그인 실패 후 사용자 계정 잠금
- 이중 인증 활성화
- 리눅스를 최신 상태로 유지
- 리눅스 보안 확장 사용
- 리눅스 방화벽 구성
- 격리를 통해 네트워크 서비스 취약점 감소
- 웹 서버 보안
- 수신 대기 중인 네트워크 포트 감지
- 필요 없는 리눅스 서비스 비활성화
- 중앙 인증 서비스 사용
- 침입 탐지 시스템 설정
- 리눅스 파일 권한 관리
- 액세스 제어 목록 (ACL) 사용
- 수상한 서버 로그 모니터링
- 전체 사용자 쓰기 가능 파일 제한
- 로깅 및 감사 프로세스 설정
- 필요 없는 SUID 및 SGID 이진 파일 비활성화
- 데이터 통신 암호화
- 민감한 데이터 보호를 위해 암호화 도구 사용
- VPN 사용
- 리눅스 커널 강화
- 별도의 디스크 파티션
- 디스크 할당량 활성화
- “소유자 없음” 파일 관리
- 리눅스 시스템 백업
- 백신 프로그램 설치
- 정기적으로 취약점 평가 수행
- 재해 복구에 투자
- 보안 사고 대응 계획 업그레이드 (CSIRP)
- 보안에 포커싱된 웹 브라우저 사용
- 리눅스 서버 물리적 보안 보장⁵

이 목록이 다소 방대하다는 것을 알지만, 이러한 관행을 따른다면 리눅스 시스템의 보안 수준에 대해 자신감을 가질 수 있을 것입니다. 이러한 관행이 초보자 친화적이지는 않지만, 자체적으로 리눅스 환경을 탐색하며 이러한 아이디어에 익숙해질 수 있습니다. IT 분야에서의 자기 학습이 모든 과정의 일부입니다.

<div class="content-ad"></div>


![Linux Security](/assets/img/2024-06-19-LinuxSecurityOperatingSystemOverview_2.png)

# 결론

Linux 운영 체제는 다양한 내장 보안 기능을 제공하지만, 최종 사용자는 온라인에서 보다 안전하게 보호하기 위해 방화벽을 구성하고 백신 소프트웨어를 설치해야 합니다. 귀하의 Linux 배포본의 모든 설정을 구성하는 것이 보안의 효과적인 도움으로 중요하므로 각 배포본에 대한 최선의 정책을 연구하는 것이 항상 권장됩니다. 본 논문에 나열된 모든 최상의 실천 방법을 고려한다면, 귀하의 Linux 시스템이 매우 안전하다고 확신할 수 있을 것입니다.

# 참고문헌


<div class="content-ad"></div>

(1) W3Techs. (없음). 웹 사이트에 대한 Linux 대 Windows 사용 통계 비교. 2023년 4/8일에 https://w3techs.com/technologies/comparison/os-linux,os-windows 에서 검색함

(2) 모리스, 제임스. (2013, 7월 11일). Linux 커널 보안 기능 개요. Linux. https://www.linux.com/training-tutorials/overview-linux-kernel-security-features/

(3) 데이, 브리타니. (2021, 10월 25일). Linux의 보안 수준은 어떨까요?. Linux 보안. https://linuxsecurity.com/features/how-secure-is-linux

(4) 비그더만, 알리자. (2022, 10월 19일). Linux용 최고의 백신 소프트웨어. 보안. https://www.security.org/antivirus/best/linux/

<div class="content-ad"></div>

(5) PhoenixNAP. (2023, 3월 16일). Linux 보안 통계, 도구 및 모범 사례. [링크](https://phoenixnap.com/kb/linux-security)