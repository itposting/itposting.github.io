---
title: "Windows Active Directory 기초 101 초보자를 위한 가이드 및 홈 랩 설정 방법"
description: ""
coverImage: "/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_0.png"
date: 2024-06-27 18:39
ogImage: 
  url: /assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_0.png
tag: Tech
originalTitle: "Windows Active Directory 101: A Beginner’s Guide and Home Lab Setup"
link: "https://medium.com/@yogeshrathod0769/windows-active-directory-101-a-beginners-guide-and-home-lab-setup-422480157314"
---


![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_0.png)

Windows Active Directory의 힘을 해제하세요! 초보자를 위한 가이드로 Windows Active Directory의 기본을 배우고, 홈 랩에서 AD를 구성하는 포괄적인 안내서로 네트워크 자원을 원활하게 관리하고 중앙화된 운영으로 보안을 강화하세요.

이 단계별 자습서는 설치부터 고급 구성까지 모든 것을 다루어 네트워크 관리를 숙달하는 데 도움이 될 것입니다.

Active Directory는 마이크로소프트에서 개발한 디렉터리 서비스로, 대부분의 Windows Server 운영 체제에 포함되어 있습니다. 관리자는 네트워크 자원의 권한과 접근을 관리하여 사용자와 컴퓨터가 도메인 네트워크 내에서 안전하게 상호 작용할 수 있도록 합니다.

<div class="content-ad"></div>

AD는 Windows 도메인 네트워크를 관리하고 컴퓨터, 프린터, 사용자 등과 관련된 정보를 저장하는 데 사용됩니다.

리눅스, 방화벽 등과 같은 비 Windows 장치들도 LDAP 또는 RADIUS를 통해 AD에 인증할 수 있습니다.

Active Directory(AD)에서 어떤 종류의 인증이 사용되나요?

Active Directory(AD) 인증은 주로 사용자가 자격 증명으로 한 번만 로그인하여 다양한 리소스에 액세스할 수 있는 Kerberos 프로토콜을 사용합니다. 사용자 자격 증명을 네트워크를 통해 전송하는 대신, Kerberos는 사용자를 위해 특정 기간 동안 유효한 세션 키를 생성하여 안전하고 유연한 인증을 제공합니다. 또한 사용자의 액세스 권한과 정책을 포함하는 토큰이 생성되어 사용자가 사용 권한이 있는 리소스에만 액세스할 수 있도록 보장합니다.

<div class="content-ad"></div>

목적 — AD를 사용해야 하는 이유

Active Directory는 네트워크 자원의 관리와 관리를 간단하게 합니다. 일부 사용 사례는 다음과 같습니다:

- 중앙 집중식 자원 관리: AD를 통해 관리자는 모든 네트워크 자원을 중앙 위치에서 관리할 수 있어 네트워크를 유지하고 안전하게 하는 것이 쉬워집니다.
- 향상된 보안: AD는 Kerberos와 같은 강력한 인증 프로토콜을 통해 네트워크 보안을 강화하며, 특정 자원에 대한 액세스 권한이 있는 사용자만 액세스할 수 있도록 보장합니다.
- 그룹 정책 관리: AD를 사용하면 그룹 정책 개체(GPO)를 사용하여 전체 네트워크에 보안 설정 및 운영 정책을 강제로 적용하여 조직 기준을 준수합니다.
- 단일 로그인(SSO): 사용자는 하나의 자격 증명 세트로 네트워크 전체에서 여러 서비스 및 자원에 액세스할 수 있어 사용자 경험을 간편하게 만들 수 있습니다.
- 전 세계에서 가장 일반적으로 사용되는 ID 관리 서비스입니다.

AD가 조직의 IT 인프라에 미치는 영향은 무엇인가요?

<div class="content-ad"></div>

- 작업 간소화: AD는 복잡한 네트워크 환경을 간소화하여 오류 가능성을 줄이고 응용 프로그램 및 서비스를 쉽게 배포하고 관리할 수 있도록 도와줍니다.
- 강화된 보안 방어체계: AD의 포괄적인 보안 기능은 무단 액세스로부터 보호하고 조직이 규정 준수를 도와 데이터 침해 위험을 줄입니다.
- 생산성 향상: 네트워크 자원의 관리를 자동화하고 중앙화함으로써, AD는 IT 직원이 루틴 작업에 소요되는 시간을 단축시켜 전략적인 계획에 집중할 수 있도록 돕습니다.

도메인 컨트롤러 – AD의 핵심:

도메인 컨트롤러는 특히 도메인 컨트롤러로 승격된 AD DS 서버 역할이 설치된 서버입니다. 다음과 같은 기능을 수행합니다:

- AD DS 디렉터리 저장소의 사본을 호스팅합니다.
- 인증 및 권한 부여 서비스를 제공합니다.
- 도메인 및 포리스트의 다른 도메인 컨트롤러로 업데이트를 복제합니다.
- 사용자 계정 및 네트워크 자원 관리를 위한 관리 액세스를 허용합니다.

<div class="content-ad"></div>

AD DS 데이터 저장소:

이것은 사용자, 서비스 및 응용 프로그램의 디렉터리 정보를 저장하고 관리하는 데이터베이스 파일 및 프로세스를 포함합니다. 다음과 같은 것들로 구성되어 있습니다:

- NTDS.dit (NT 디렉토리 서비스 디렉토리 정보 트리) 파일은 Active Directory에서 모든 디렉터리 정보를 저장하는 데이터베이스 파일로서 다음을 포함합니다: 사용자 계정 및 암호, 그룹 및 그들의 멤버십, 조직 단위 (OUs), 컴퓨터 계정, 보안 정책 및 권한, 스키마와 구성 데이터, 다른 디렉터리 객체들.
- 이것은 기본적으로 모든 도메인 컨트롤러의 %SystemRoot%\NTDS 폴더에 저장됩니다.
- 도메인 컨트롤러 프로세스와 프로토콜을 통해서만 접근할 수 있습니다.

AD에서의 공통 용어들

<div class="content-ad"></div>

<img src="/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_1.png" />

- **AD Objects**: 이는 Active Directory의 가장 작은 기본 단위입니다. 객체는 사용자, 그룹, 컴퓨터, 라우터, 방화벽, 프린터 등 모든 것이 될 수 있습니다.
- **사용자**: 사용자는 AD 객체의 한 유형입니다. 대부분의 사용자 계정은 개인에게 할당되지만, 일부는 서비스 계정이라고 알려진 애플리케이션 사용을 위해 지정됩니다.
- **그룹**: 그룹 객체는 사용자 계정, 컴퓨터 계정 등을 모아 엑세스 제어를 간단하게 하는 데 사용됩니다 (예: 보안 그룹).
- **조직 단위(OU)**: 관리자는 종종 OUs를 기능이나 부서에 따라 사용자를 그룹화하는 데 사용합니다. OUs는 컴퓨터와 같은 장치를 그룹화하는 데도 사용될 수 있으며, 각 그룹에 관련 정책을 쉽게 적용하기 위해 조직 구조를 반영합니다.
- **도메인**: 사용자, 컴퓨터, 그룹, OUs와 같은 AD 객체의 모음이 저장된 공유 데이터베이스입니다.
- **포레스트**: 포레스트는 하나 이상의 도메인으로 구성된 집합입니다. 조직은 요구 사항과 복잡성에 따라 단일 포레스트 또는 다중 포레스트를 가질 수 있습니다.

# 홈 랩 구축

선결 조건:

<div class="content-ad"></div>

- 1 개의 Windows Server VM
- 1 개의 Windows Workstation VM
- 50-60 GB의 디스크 공간
- 8GB 이상의 메모리

ISO 다운로드:

여기 Windows Server 및 Windows 10 Enterprise의 다운로드 링크가 있습니다. 두 ISO를 다운로드하고 시작해 주세요.

ISO 다운로드를 클릭한 후, 등록 프로세스를 위해 임의의 데이터를 입력하고 다운로드 프로세스가 곧 시작될 것입니다.

<div class="content-ad"></div>

VirtualBox 단계:

- New를 클릭하여 자신의 컴퓨터 용량에 맞게 프로세서 성능과 저장공간을 선택하고 Windows Workstation-1, Windows Server 등과 같이 기계를 식별할 수 있는 이름을 입력하세요.
- Skip Unattended Installation을 선택하고 컴퓨터 용량에 맞게 프로세서 성능과 저장공간을 선택하세요.
- 단계를 완료한 후, VM을 시작하세요.

- 처음 부팅 후, 지역 및 시간대와 같은 세부 정보를 입력하세요.
- 어떤 유형의 설치를 원하십니까? 사용자 정의: Microsoft Server OS만 설치
- 설치하려는 운영 체제를 선택하세요: Windows Server 2022 Standard Evaluation (데스크톱 환경)

다음을 클릭하면 설치 프로세스가 곧 시작됩니다. 창이 다시 부팅되고, 관리자 계정의 비밀번호를 입력하라는 메시지가 나올 것입니다.

<div class="content-ad"></div>

이번 랩에서는 Root@123이라는 비밀번호를 사용했습니다.

로그인하려면 ALT+CTRL+DEL을 눌러주세요. 키를 보내지 못하면 VirtualBox의 툴바로 이동하여 입력 -` 키보드 -` ALT+CTRL+DEL 삽입을 열어주세요.

## 도메인 컨트롤러 설정

우선, 기본 이름이 아닌 다른 이름으로 머신의 이름을 지정할 것입니다.

<div class="content-ad"></div>

시작 메뉴 - `PC 이름보기`: PC 이름 변경하기

아래에서 볼 수 있듯이, 랩을 위한 DC (도메인 컨트롤러)로 사용할 것이므로 PC 이름을 Yogesh-DC로 변경했습니다.

이름을 변경한 후에는 컴퓨터를 재시작하세요.

![PC 이름 변경](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_2.png)

<div class="content-ad"></div>

## 기능 설치 — Active Directory 도메인 서비스 (AD DS)

Active Directory 도메인 서비스 (AD DS)는 사용자 및 컴퓨터를 관리하고 데이터를 논리적 계층 구조로 구성할 수 있는 Active Directory의 핵심 기능입니다.

AD DS는 보안 인증서, 단일 로그인(SSO), LDAP 및 권한 관리를 제공합니다.

- Server Manager를 엽니다.
- 창의 오른쪽 상단에 있는 Manage 옵션을 클릭합니다.
- Roles 및 기능 추가를 선택합니다.
- 추가할 역할 및 기능 마법사라는 이름의 마법사가 나타납니다. Next를 클릭합니다.
- 설치 유형: 역할 기반 또는 기능 기반 설치.
- 서버 선택: 목록에서 자신의 컴퓨터 이름을 선택합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_3.png)

- 서버 역할: 도메인 서비스가 필요하므로 Active Directory Domain Services (AD DS)라는 옵션을 선택하고 아래에 표시된 팝업이 표시됩니다.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_4.png)

- 기능 추가: 추가 기능을 클릭한 후 다음을 선택합니다.
- 기능: 이 단계에서 추가 조치가 필요하지 않으므로 다음을 클릭합니다.
- AD DS: 다음을 클릭합니다.
- 확인: 필요한 경우 대상 서버를 자동으로 다시 시작하는 옵션을 확인합니다.


<div class="content-ad"></div>


![image](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_5.png)

설치를 완료한 후, 위자드와 명령 표시줄의 알림, 그리고 작업 세부정보를 닫을 수 있습니다.

- 도메인 컨트롤러로 이 서버를 승격하려면 클릭하세요.
- 배포 구성: 기존의 포리스트나 도메인이 없기 때문에 '새 포리스트 추가'를 선택하세요.
- 원하는 도메인 이름을 입력하고 '다음'을 클릭하세요. 이 랩에서의 도메인 이름은 다음과 같습니다: Yogesh.local

![image](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_6.png)


<div class="content-ad"></div>

- 이전에 사용한 동일한 암호를 입력할 수 있습니다; Root@123. 다음을 클릭하세요.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_7.png)

- DNS 위임: 그대로 유지하세요.
- 추가 옵션: NetBIOS 도메인 이름은 자동으로 채워지고 다음을 클릭하세요.
- 경로와 옵션 검토: 기본값으로 유지하세요. 다음을 클릭하세요.
- 사전 요구 사항 확인: 설치를 클릭하세요.

설치 후 시스템이 다시 한 번 재부팅됩니다.

<div class="content-ad"></div>

이제 이전에 설정한 비밀번호로 만든 새 계정으로 로그인하겠습니다. 제 경우에는 도메인 사용자 이름이 Yogesh\Administrator였습니다.

## 라우팅 및 원격 액세스 — DC에서 RAS/NAT 구현

역할 추가:

여기서, 우리는 클라이언트 기기가 호스트 OS에서 직접이 아닌 도메인 컨트롤러 서버를 통해 인터넷 액세스를 받을 수 있는 종류의 사설 네트워크를 구성할 것입니다. 이를 위해 DC에 다른 서비스/역할을 추가해야 합니다.

<div class="content-ad"></div>

서버 관리자를 열고 'Roles 및 기능 추가 마법사'를 클릭한 후, 다음을 클릭합니다. 서버를 선택한 다음,

- 서버 역할: 원격 액세스
- 특징 및 역할 서비스: 라우팅 확인
- 다른 설정은 기본 설정을 유지하고 역할을 설치합니다.

네트워크 변경 후 라우팅 구성을 되돌아올 것입니다.

VM에서 네트워크 어댑터 설정

<div class="content-ad"></div>

네트워크 다이어그램을 보면 VM 인프라 내에서 작동할 내부 네트워크를 설정해야한다는 것을 알 수 있습니다.

첫 번째 단계는 네트워크 어댑터를 추가하는 것입니다. DC가 설치된 Windows Server에서 NAT(기본) 및 내부 네트워크를 추가했습니다. 동일한 작업을 진행해보세요.

<div class="content-ad"></div>

만약 필요하다면 재부팅 후에 "네트워크 및 인터넷" 설정을 찾아보세요. 아래 이미지와 같이 "네트워크 어댑터 옵션 변경"을 클릭하세요.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_10.png)

- 아래 이미지처럼 두 가지 다른 이름으로 된 인터페이스를 볼 수 있을 겁니다. 하나는 NAT를 위한 것이고, 다른 하나는 내부 네트워크를 위한 것입니다. 이제 할 일은 어떤 것이 어떤 것인지 구별하는 것입니다.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_11.png)

<div class="content-ad"></div>

- 네트워크 어댑터를 식별한 후, Internal (DHCP 및 RAS를 구성할 예정인) 및 Internet (NAT를 통해 연결된) 등으로 이름을 변경해주세요.
- Internal이라는 인터페이스를 마우스 오른쪽 버튼으로 클릭한 다음 속성을 클릭하세요. 그리고 아래에 표시된 대로 Internet Protocol Version 4 (TCP/IPv4)을 두 번 클릭하세요.

![IPv4 Properties](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_12.png)

- IPv4 속성을 열고, 아래에 표시된 대로 다음 IP 주소 사용을 선택하고 구성하세요.

![IP Address Configuration](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_13.png)

<div class="content-ad"></div>

- 여기서 DNS 서버의 IP 주소를 클라이언트 기기에 할당되는 IP 주소가 DC에서 구현한 DHCP 서비스를 통해 127.0.0.1 (루프백)로 설정했습니다.
- 구성이 완료되면 확인을 클릭하세요.

Routing 및 원격 액세스 서비스 구성

- 설치 후에 도구 - `Routing 및 원격 액세스로 이동합니다.
- DC를 마우스 오른쪽 버튼으로 클릭하고 "라우팅 및 원격 액세스 구성 및 활성화"를 클릭합니다.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_14.png)

<div class="content-ad"></div>

- 위자드를 열고 "다음"을 클릭하세요. 설정에서 NAT 옵션을 선택하세요.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_15.png)

다음을 클릭한 후 완료를 클릭하세요.

이제 다음 단계는 클라이언트 기기가 인터넷에 연결하기 위해 사용할 DC에서 IP 주소를 받게 해줄 DHCP 서비스를 추가하는 것입니다.

<div class="content-ad"></div>

DHCP 설정

- Manage -` Add Role or Feature -` DHCP으로 다시 이동하세요.
- 기본 설정을 유지한 채로 서비스를 설치하세요.

<img src="/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_16.png" />

- 설치가 완료되면 Tools -` DHCP로 이동하여 열어보세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_17.png" />

- 이제 IPv4를 마우스 오른쪽 버튼으로 클릭하고 도메인 아래에서 새 범위를 클릭합니다.
- 아래 그림과 같이 원하는 범위 이름을 입력하십시오. 가능한 한 설명적인 이름을 유지하였습니다. 이전에 DC의 내부 네트워크 설정에서 동일한 네트워크 범위를 구성했기 때문에 172.16.0.100–200/24 네트워크 범위를 사용할 것입니다.

<img src="/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_18.png" />

- 이제 시작 및 끝 IP 주소 범위를 아래와 같이 추가하십시오.

<div class="content-ad"></div>


![image](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_19.png)

- 클릭 다음 및 "예, 이제 이러한 옵션을 구성하고 싶습니다."를 선택합니다.

![image](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_20.png)

- 임대 기간: 이 랩의 목적으로, 시스템에 할당된 IP 주소의 임대 기간을 10일로 설정했습니다. 이후에 IP가 변경될 것입니다.


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_21.png)

- 라우터: 이전에 설명한 대로, DC가 클라이언트 기기를 위한 라우터 역할을 할 것이므로 DC의 라우터 IP 주소를 172.16.0.1로 설정할 것입니다.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_22.png)

- 도메인 이름과 DNS 서버는 기본값으로 유지하십시오.


<div class="content-ad"></div>


![Image 23](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_23.png)

- Lastly, select “Yes, Activate this scope now.”

![Image 24](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_24.png)

Post DHCP Install Configuration


<div class="content-ad"></div>

- 서버 관리자의 알림 패널에서 Post DHCP 설치 구성 옵션을 볼 수 있다면, 그냥 승인해 주세요.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_25.png)

## OU 및 사용자 추가

여기에서는 Network Admins라는 OU 하나와 John Doe라는 사용자 하나를 만들 것입니다. 이 사용자를 통해 워크스테이션 컴퓨터에 로그인하게 될 것이며, 사용자에게 관리자 권한을 할당할 것입니다.

<div class="content-ad"></div>

- 윈도우 키를 눌러 'Windows 관리 도구'를 검색한 후, 'Active Directory 사용자 및 컴퓨터'를 열어주세요.
- 이제, 도메인 이름을 우클릭하여 `새로 만들기 -` 조직 단위를 선택해주세요.

![이미지 1](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_26.png)

![이미지 2](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_27.png)

- 조직 단위를 추가한 후, 해당 단위에 사용자를 추가하겠습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_28.png" />

- 다음 페이지에서 사용자 세부 정보와 비밀번호를 입력하고 원하는 정책을 적용한 후 완료를 클릭하세요.

<img src="/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_29.png" />

## 클라이언트 머신 설정

<div class="content-ad"></div>

이제, 클라이언트 윈도우 머신을 설정해야 합니다. Windows 10 Enterprise ISO를 다운로드할 수 있는 링크를 여기에 제공합니다.

- 다운로드 후 원하는 설정으로 Virtual에 새로운 VM을 추가하고 작업을 완료하면 이 블로그로 계속 진행하세요.

- 설치가 완료되면 내부 네트워크에 성공적으로 연결되었는지 확인합니다.
- 네트워크 및 인터넷 설정으로 이동 - ` 어댑터 옵션 변경 - ` 이더넷에서 마우스 오른쪽 클릭 - ` 속성 클릭

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_30.png)

<div class="content-ad"></div>

- 이제 IPv4 설정을 두 번 클릭하고 "다음 DNS 서버 주소 사용" 옵션을 선택하여 DNS IP 주소를 입력하세요.
- DNS IP 주소는 DC에서 설정한 것과 동일하게 설정해야 합니다.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_31.png)

- 이제 서버 기기와 같은 방식으로 워크스테이션의 이름을 바꿀 수 있습니다.하지만 작은 변화를 줄게요.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_32.png)

<div class="content-ad"></div>

이제 "시스템 속성"이라는 제목의 마법 상자가 나타날 것입니다. 아래에 표시된대로 '변경' 버튼을 클릭하세요.

![System Properties](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_33.png)

- 도메인 컨트롤러에 연결을 시도해 보겠습니다. 도메인 이름을 추가하면 됩니다.
- 원하는 컴퓨터 이름을 입력하고, '멤버: 도메인'을 선택한 후 도메인 이름을 입력하세요.

![Connect to Domain Controller](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_34.png)

<div class="content-ad"></div>

- 이전에 만든 DC에서 사용자 이름을 입력하세요. 제 경우에는 John@Yogesh.local 이었습니다.

![image1](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_35.png)

- 설정을 변경한 후, 컴퓨터를 재시작하고 새 자격 증명으로 로그인하세요.

![image2](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_36.png)

<div class="content-ad"></div>

인터넷 연결 테스트

모든 단계를 완료한 후에는 인터넷에 연결할 수 있어야 합니다.

다음은 그를 위한 간단한 테스트입니다. 구글 핑을 보내고 나서 길을 확인하기 위해 tracert 명령어를 사용했습니다. 여기에서 확인할 수 있습니다.

![이미지](/assets/img/2024-06-27-WindowsActiveDirectory101ABeginnersGuideandHomeLabSetup_37.png)

<div class="content-ad"></div>

요약하면,이 안내서는 Windows Active Directory (AD) 홈 랩을 설정하는 포괄적인 안내를 제공합니다. AD의 기본 사항, 중요성 및 VirtualBox를 사용하여 도메인 컨트롤러, DHCP 및 클라이언트 기기를 구성하기 위한 단계별 지침을 다룹니다. 이 상세한 단계를 따라가면 사용자는 네트워크 자원을 관리하고 보안을 강화하며 IT 운영을 간소화할 수 있는 기능적인 AD 환경을 만들어 실제 기업 환경을 시뮬레이션하여 학습 및 테스트 목적으로 사용할 수 있습니다.

참고 자료:

Josh Madakor의 훌륭한 자료 (How to Setup a Basic Home Lab Running Active Directory (Oracle VirtualBox) | Add Users w/PowerShell)