---
title: "AWS EC2 Linux 인스턴스의 디스크 크기 늘리는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_0.png"
date: 2024-06-23 15:16
ogImage: 
  url: /assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_0.png
tag: Tech
originalTitle: "How to Increase Disk Size on Your AWS EC2 Linux Instance"
link: "https://medium.com/@bhuvi01/how-to-increase-disk-size-on-your-aws-ec2-linux-instance-6fcd064e8222"
---


<img src="/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_0.png" />

클라우드 컴퓨팅 세계에서는 유연성이 모든 것입니다. 프로젝트가 성장함에 따라 저장 공간 요구도 증가합니다. AWS EC2에서 Linux 인스턴스를 실행 중이고 디스크 공간이 더 필요하다면 걱정하지 마십시오! AWS는 저장 용량을 확장하는 과정을 간단하게 만들어 두었습니다. 이 안내서에서는 XFS 파일 시스템에 대해 xfs_growfs 명령을 사용하는 방법에 중점을 두고 디스크 크기를 증가시키는 단계별 작업을 안내해 드리겠습니다.

# 시작하기 전에

시작하기 전에 다음을 확인하십시오:

<div class="content-ad"></div>

- AWS 콘솔 접속: AWS 콘솔에 로그인해야 합니다.
- EC2 인스턴스: 우분투 또는 아마존 리눅스와 같은 Linux 기반 EC2 인스턴스가 실행 중인지 확인하세요.

# 단계 1: 현재 설정 확인하기

- 인스턴스 연결: 즐겨 사용하는 SSH 클라이언트를 사용하여 인스턴스에 연결합니다. 연결하는 방법을 모르는 경우, AWS 문서를 참조하실 수 있습니다.
- 디스크 사용량 확인: 연결된 후, 현재 디스크 공간 사용량을 확인하려면 다음 명령을 실행하세요:

```bash
df -h
```

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_1.png)

모든 마운트된 파일 시스템의 현재 디스크 사용량을 보여줍니다.

# 단계 2: AWS 콘솔에서 볼륨 수정하기

- AWS 콘솔로 이동: AWS 관리 콘솔로 이동하여 EC2 대시보드로 이동합니다.
- 인스턴스 찾기: "인스턴스" 아래에서 인스턴스를 찾아 루트 EBS 볼륨의 볼륨 ID를 메모합니다.

<div class="content-ad"></div>

볼륨 크기를 조정하세요:

- 볼륨을 선택한 후 "작업"을 클릭한 다음 "볼륨 수정"을 클릭합니다.

![image](/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_2.png)

- 원하는 새 크기를 입력하십시오 (크기를 늘릴 수는 있지만 줄일 수는 없습니다).
- 변경 사항을 적용하려면 "수정"을 클릭하세요.

<div class="content-ad"></div>

# 단계 3: Linux에서 파일 시스템 확장하기

- 볼륨 크기 변경 확인: SSH 세션으로 돌아가서 새로운 크기를 인스턴스가 인식하는지 확인하세요.

```js
# lsblk
```

<img src="/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_3.png" />

<div class="content-ad"></div>

이 명령어를 사용하면 업데이트된 디스크 크기가 표시됩니다.

2. 파티션 크기 조정: 디스크가 파티션을 사용하는 경우 (/dev/xvda4와 같이), growpart를 사용하여 파티션 크기를 조정해야 합니다:

```js
# growpart /dev/xvda 4
```

<img src="/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_4.png" />

<div class="content-ad"></div>

디스크 식별자와 필요에 따라 파티션 번호를 조정해 /dev/xvda를 변경하세요.

3. 파일 시스템 크기 조정: XFS 파일 시스템의 경우 xfs_growfs를 사용하여 파일 시스템을 새 파티션 크기로 확장할 수 있습니다. 또한 ext 기반 파일 시스템을 resize2fs 명령을 사용하여 크기를 조정할 수도 있습니다.

```js
# xfs_growfs -d /dev/xvda1
```

![이미지](/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_5.png)

<div class="content-ad"></div>

특정 파티션 (/dev/xvda4)으로 테이블 태그를 변경하십시오.

# 단계 4: 확인 및 정리

- 디스크 공간 확인: 파일 시스템이 성공적으로 확장되었고 추가된 공간을 사용 중인지 확인하기 위해 df -h를 한 번 더 실행해주세요.

![이미지](/assets/img/2024-06-23-HowtoIncreaseDiskSizeonYourAWSEC2LinuxInstance_6.png)

<div class="content-ad"></div>

2. 정리하기: 모든 것이 올바르게 작동하는 것에 만족하셨다면, 볼륨을 조정할 때 AWS가 자동으로 생성한 스냅샷을 삭제할 수 있습니다.

# 결론

여기까지 왔습니다! xfs_growfs 명령어를 사용하여 AWS EC2 Linux 인스턴스에서 XFS 파일 시스템의 디스크 크기를 성공적으로 증가시켰습니다. AWS는 이 과정을 꽤 간편하게 만들었지만, 중요한 데이터를 백업하는 것은 인프라를 변경하기 전 좋은 아이디어입니다.

클라우드 리소스를 효과적으로 관리하는 능력은 가치 있는 기술입니다. 이제 프로젝트가 성장함에 따라 EC2 인스턴스의 스토리지를 확장할 수 있는 노하우를 갖추고 있습니다. 질문이 있거나 어려움을 겪는 경우, AWS 문서 및 커뮤니티 포럼은 더 많은 지침을 얻을 수 있는 훌륭한 자료입니다.