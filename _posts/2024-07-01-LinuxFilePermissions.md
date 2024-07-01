---
title: "리눅스 파일 권한 설정 완벽 가이드 이해와 사용 방법"
description: ""
coverImage: "/assets/img/2024-07-01-LinuxFilePermissions_0.png"
date: 2024-07-01 17:24
ogImage: 
  url: /assets/img/2024-07-01-LinuxFilePermissions_0.png
tag: Tech
originalTitle: "Linux File Permissions"
link: "https://medium.com/@GibzB/linux-file-permissions-48bb9221c0ea"
---



![이미지](/assets/img/2024-07-01-LinuxFilePermissions_0.png)

본 글은 AWS에서 EC2 인스턴스를 사용하여 파일 권한 관리에 대해 설명합니다. 명령어, 출력물 및 핵심적인 기술들을 강조하며 클라우드 관련 역할에서의 중요성을 강조할 것입니다.

배운 주요 기술:

- 이 랩을 통해 EC2 인스턴스에 SSH를 사용하여 연결하고, chown 및 chmod 명령어를 사용하여 파일 및 폴더 권한을 관리하는 등 중요한 기술을 연습할 수 있었습니다.
- 파일 권한을 이해하는 것은 클라우드 시스템 보안에 매우 중요합니다. 사용자 및 그룹에 적절한 액세스 권한을 부여하여 데이터의 기밀성과 무결성을 보장하는 방법을 배웠습니다.


<div class="content-ad"></div>

현실적인 업무 시나리오:

- 시스템 관리자: 기업의 클라우드 인프라 내에서 민감한 데이터에 대한 사용자 액세스를 제어하기 위해 파일 권한을 정기적으로 관리합니다.
- 보안 전문가: 보안 모범 사례와 규정을 준수하기 위해 권한 구조를 구현하고 유지합니다.
- 클라우드 아키텍트: 세밀한 권한 제어를 통합한 안전하고 확장 가능한 클라우드 환경을 설계합니다.

시작해봅시다!

아마존 리눅스 EC2 인스턴스에 연결하고 SSH 명령을 사용하여 파일 및 폴더 권한을 관리할 것입니다.

<div class="content-ad"></div>


![Linux File Permissions](/assets/img/2024-07-01-LinuxFilePermissions_1.png)

SSH 연결:

EC2 인스턴스에 연결하려면 PuTTY(Windows)와 같은 SSH 클라이언트를 사용할 수 있습니다. 제공된 자격 증명(공용 IP 주소 및 키 파일)는 안전한 연결을 확립하는 데 필수적입니다.

제 경우에는 SSH 클라이언트로, Chrome용으로 구성된 Secure Shell을 사용했습니다. Secure Shell은 xterm 호환 터미널 에뮬레이터 및 독립형 SSH 클라이언트입니다.


<div class="content-ad"></div>


![LinuxFilePermissions_2](/assets/img/2024-07-01-LinuxFilePermissions_2.png)

Changing Ownership:

폴더의 소유권을 변경하는 방법을 살펴봅니다. chown 명령을 사용할 것입니다. 명령어는 다음과 같은 형식을 따릅니다:

```bash
sudo chown -R <username>:<groupname> <folder_path>
```

<div class="content-ad"></div>

- sudo: 소유권 변경에 대한 관리자 권한을 부여합니다.
- -R: 지정된 폴더 내의 모든 파일 및 하위 폴더에 변경을 재귀적으로 적용합니다.
- `username`: 폴더의 새 소유자입니다.
- `groupname`: 폴더와 관련된 새 그룹입니다.
- `folder_path`: 소유권을 변경하려는 폴더의 경로입니다.

예를 들어, "companyA" 폴더의 소유권을 사용자 "mjackson" 및 그룹 "Personnel"로 변경하려면 다음을 사용하면 됩니다:

```js
sudo chown -R mjackson:Personnel /home/ec2-user/companyA
```

![Linux 파일 권한 이미지](/assets/img/2024-07-01-LinuxFilePermissions_3.png)

<div class="content-ad"></div>

```js
sudo chown -R eowusu:Shipping Shipping
```

![Linux File Permissions](/assets/img/2024-07-01-LinuxFilePermissions_4.png)

파일 권한 변경:

이 랩은 파일 권한을 수정하는 chmod 명령어를 소개합니다. Symbolic 모드와 Absolute 모드 두 가지가 있습니다.


<div class="content-ad"></div>

Symbolic Mode:

간단한 권한 변경을 기억하기 쉽습니다.

특정 작업을 나타내는 문자와 기호를 사용합니다:

- r - 읽기 권한
- w - 쓰기 권한
- x - 실행 권한
- + - 권한 추가
- - - 권한 제거
- = - 정확한 권한 설정 (기존 권한을 모두 제거하고 지정된 권한을 설정합니다)

<div class="content-ad"></div>

예시:

- g+w: 그룹에 쓰기 권한 부여
- u-x: 소유자의 실행 권한 제거
- o=rw: 다른 사용자에 대한 정확한 권한 설정 (읽기 및 쓰기만)

```js
sudo chmod <허가_모드> <파일_경로>
```

![이미지](/assets/img/2024-07-01-LinuxFilePermissions_5.png)

<div class="content-ad"></div>

Absolute Mode:

- 복잡한 허가 할당에 대해 더 간결합니다.
- 모든 권한을 표현하기 위해 세 자리의 8진수를 사용합니다.
- 각 숫자는 특정 사용자 그룹에 해당합니다:
    - 첫 번째 숫자 (백의 자리): 소유자의 권한
    - 두 번째 숫자 (십의 자리): 그룹의 권한
    - 세 번째 숫자 (일의 자리): 다른 사용자들의 권한

각 숫자 자체는 권한 값을 결합한 것입니다:
- 4: 읽기 권한
- 2: 쓰기 권한
- 1: 실행 권한

<div class="content-ad"></div>

권한을 설정하려면 해당 값을 추가하십시오. 권한을 제거하려면 기존 숫자에서 해당 값을 뺍니다 (0이 됨).

예시:

- 764: 소유자에게 읽기, 쓰기, 실행 권한 (4+2+1)을 부여합니다 (7), 그룹에게 읽기 및 쓰기 권한 (4+2)을 설정하며, 다른 사용자에게는 읽기 전용 권한 (4)을 줍니다.
- 600: 그룹과 다른 사용자에게 모든 권한을 제거하고, 소유자에게 읽기와 쓰기 권한만 설정합니다 (6).

적절한 모드 선택:

<div class="content-ad"></div>

- 심볼릭 모드를 사용하여 특정 사용자 그룹에 대한 특정 권한 추가 또는 제거와 같은 간단한 조정을 하세요.
- 절대 모드를 사용하여 복잡한 권한 설정이 필요하거나 여러 권한 변경을 더 간결하게 나타내는 방법이 필요할 때 사용하세요.
- 궁극적으로, 선택은 개인 취향과 편안함에 달려 있습니다. 두 모드 모두 파일 권한을 수정하는 동일한 결과를 얻습니다.

변경 내용 확인:

폴더와 해당 내용에 대한 소유권 및 권한 세부 정보를 보려면 ls -laR 명령을 사용하시면 됩니다. 이는 권한 변경이 성공적으로 이루어졌는지 확인하는 데 도움이 됩니다.

![Linux 파일 권한](/assets/img/2024-07-01-LinuxFilePermissions_6.png)

<div class="content-ad"></div>

결론:

위 단계를 따르면 AWS EC2 인스턴스에서 파일 권한을 관리하는 실용적인 경험을 얻을 수 있습니다. 이는 클라우드에서 일하는 누구에게나 가치 있는 기술입니다, 특히 시스템 관리자, 보안 전문가, 그리고 클라우드 아키텍트들에게 유용합니다.

기억하세요: 언제나 조직의 보안 정책과 데이터 접근 요구와 일치하는 권한 구조를 구현해야 합니다.