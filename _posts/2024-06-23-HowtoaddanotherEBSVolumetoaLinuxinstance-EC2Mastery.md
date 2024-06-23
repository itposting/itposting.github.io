---
title: "EC2 마스터 리눅스 인스턴스에 다른 EBS 볼륨 추가하는 방법 - 완벽 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-HowtoaddanotherEBSVolumetoaLinuxinstance-EC2Mastery_0.png"
date: 2024-06-23 15:22
ogImage: 
  url: /assets/img/2024-06-23-HowtoaddanotherEBSVolumetoaLinuxinstance-EC2Mastery_0.png
tag: Tech
originalTitle: "How to add another EBS Volume to a Linux instance - EC2 Mastery"
link: "https://medium.com/@galazkaryan/how-to-add-another-ebs-volume-to-a-linux-instance-ec2-mastery-6b8e20a7ea6e"
---


AWS의 핵심은 EC2에 있습니다. 클라우드 서비스 제공업체를 사용하기 시작할 때 대부분 처음 배우는 서비스 중 하나입니다. 이를 염두에 둔다면, 배울 것이 많고 현재 사용 중인 use case에 다른 서비스를 통합하는 다양한 방법이 있습니다.

이 새로운 시리즈인 'EC2 마스터리'에서는 EC2의 여러 실제 사용 예제를 배울 것입니다.

![이미지](/assets/img/2024-06-23-HowtoaddanotherEBSVolumetoaLinuxinstance-EC2Mastery_0.png)

'EC2 마스터리'의 이번 에피소드에서는 EC2 Linux 인스턴스에 추가 EBS 볼륨을 추가하는 방법을 살펴볼 것입니다.

<div class="content-ad"></div>

# 1. 명령 줄 및 fstab 파일(Linux)을 통해 추가적인 EBS 볼륨 추가하기

## 단계 1: EBS 볼륨 연결하기

CloudShell 탭을 열거나 AWS 계정에 명령 줄을 통해 상호 작용합니다. 아래는 제가 입력한 명령어의 스크린샷입니다.

EBS 볼륨 생성:

<div class="content-ad"></div>

```js
 aws ec2 create-volume --availability-zone <your-az> --size <size-in-gb>
```

다음은 사용할 수 있는 다른 옵션들입니다:

--volume-type: EBS 볼륨의 유형을 지정합니다 (예: gp3, io2).
--iops: io1 또는 io2 볼륨의 IOPS 수를 설정합니다.
--encrypted: 볼륨을 위해 암호화를 활성화합니다.
--kms-key-id: 암호화를 위한 KMS 키를 지정합니다.
--snapshot-id: 기존 스냅샷에서 볼륨을 생성합니다.
--tag-specifications: 볼륨에 태그를 추가합니다.
--multi-attach-enabled: 볼륨을 여러 인스턴스에 동시에 연결할 수 있도록 허용합니다 (io1 또는 io2용).

EC2 인스턴스에 EBS 볼륨을 연결하기:

<div class="content-ad"></div>

```js
aws ec2 attach-volume --volume-id <볼륨-id> --instance-id <인스턴스-id> --device /dev/xvdf
```

`볼륨-id`에 방금 생성한 볼륨의 ID를, `인스턴스-id`에는 EC2 인스턴스 ID를 입력해주세요.

<img src="/assets/img/2024-06-23-HowtoaddanotherEBSVolumetoaLinuxinstance-EC2Mastery_1.png" />

이제 AWS 측에서의 작업이 완료되었으니, 우리의 인스턴스 내부에서 작업을 완료해야 합니다.

<div class="content-ad"></div>

## 단계 2: EBS 볼륨을 마운트합니다

인스턴스에 SSH로 로그인하거나 콘솔을 사용하세요.

볼륨 포맷:

```js
sudo mkfs -t ext4 /dev/xvdf
```

<div class="content-ad"></div>

마운트 지점 생성하기:

```js
sudo mkdir /mnt/data
```

볼륨 마운트하기:

```js
sudo mount /dev/xvdf /mnt/data
```

<div class="content-ad"></div>

아래에서 우리는 인스턴스에 10gb EBS 볼륨을 성공적으로 추가했음을 확인할 수 있습니다.

<img src="/assets/img/2024-06-23-HowtoaddanotherEBSVolumetoaLinuxinstance-EC2Mastery_2.png" />

<div class="content-ad"></div>

# 3. fstab 파일에 추가하여 마운트 영구화하기:

어떤 시점에서든 인스턴스를 끄거나 다시 부팅하게 되면 최근에 생성하고 추가한 EBS 볼륨이 유지되지 않습니다. 그러므로 /etc/fstab 파일에 추가해주어야 합니다.

```bash
sudo bash -c 'echo "/dev/xvdf /mnt/data ext4 defaults,nofail 0 2" >> /etc/fstab'
```

<div class="content-ad"></div>

# 결론

이것은 Linux EC2 인스턴스에 다른 EBS 볼륨을 추가하는 과정입니다.

박수를 치고 팔로우해 주세요. EC2 마스터리 시리즈의 시작에 불과해요!