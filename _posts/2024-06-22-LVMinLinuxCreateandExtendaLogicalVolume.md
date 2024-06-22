---
title: "리눅스에서 LVM 사용하여 논리 볼륨 생성 및 확장하는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_0.png"
date: 2024-06-22 16:12
ogImage: 
  url: /assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_0.png
tag: Tech
originalTitle: "LVM in Linux — Create and Extend a Logical Volume"
link: "https://medium.com/@yhakimi/lvm-how-to-create-and-extend-a-logical-volume-in-linux-9744f27eacfe"
---


## XFS 파일 시스템에 LVM 논리 볼륨을 생성하고 확장하는 방법 안내서

![image](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_0.png)

## LVM에 대해 간단히 알아봅시다

논리 볼륨 관리자는 기존의 디스크 관리보다 훨씬 더 효율적인 방식으로 저장소를 다룹니다. 표준 디스크 파티션은 각 디스크의 용량에 기반하여 저장 공간을 할당하지만 LVM은 사용 가능한 모든 물리 하드 드라이브를 하나의 풀의 일부인 것처럼 결합하여 저장 공간을 효율적으로 관리하며 개별적으로 다루는 대신 전체로 사용할 수 있게 만듭니다.

<div class="content-ad"></div>

가정 해 보겠습니다. 4개의 1TB 드라이브가 있습니다. 전통적인 디스크 체계에서는 개별적으로 처리하지만 LVM을 사용하면 이 4개의 1TB 드라이브가 4TB 단일 청크 또는 집계된 저장 용량으로 간주됩니다. 이를 통해 디스크 레이아웃에 대한 더 큰 유연성과 제어권을 얻을 수 있으며 디스크를 더 쉽게 조작할 수 있습니다. LVM을 사용하는 주요 이점 중 하나는 파일 시스템을 쉽게 확장할 수 있는 능력입니다.

LVM을 이해하고 사용하기 위해서 우리는 세 가지 주요 구성 요소를 이해해야 합니다. 이들은 서로 연결되어 있으며 함께 하나의 논리적 볼륨이라는 것을 만듭니다. 이러한 구성 요소는 다음과 같습니다:

- 물리적 볼륨
- 볼륨 그룹
- 논리적 볼륨

물리적 볼륨: 이들은 LVM을 만들기 위해 사용되는 기본 블록입니다. 물리적 볼륨 또는 "PVs"는 단순히 물리적 저장 장치인 SSD 또는 HDD 드라이브입니다. 하드 드라이브가 물리적 볼륨로 간주되려면 물리적 볼륨로 초기화되어야 하므로 LVM에서 사용할 수 있습니다.

<div class="content-ad"></div>

Volume Group: 우리는 볼륨 그룹 "VG"를 물리적 볼륨으로 구성된 풀로 생각할 수 있습니다. 예를 들어, 1TB SSD 하드 드라이브 세 개가 볼륨 그룹의 일부인 경우, 이 "VG"는 총 저장 용량이 3TB로 나타나며, 논리적 볼륨을 생성하는 데 사용됩니다.

논리적 볼륨: 우리의 VG가 생성되면, 마침내 논리적 볼륨을 생성할 수 있습니다. 단일 볼륨 그룹에서 하나 이상의 논리적 볼륨을 생성할 수 있습니다. 논리적 볼륨은 디렉터리에 마운트된 기존 파티션으로 처리되고 사용될 것입니다.

아래 그림은 논리적 볼륨의 구조를 설명합니다:

![논리적 볼륨 구조](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_1.png)

<div class="content-ad"></div>

(특정 예시에서 우리가 사용하는 데모 서버가 구성된대로, 여러 논리 볼륨 및 볼륨 그룹이 있습니다.)

물리 장치인 하드 드라이브로부터 시작해요, 이들은 물리 볼륨 또는 PVs를 만드는 데 사용됩니다. 이 예에서, 우리는 세 개의 별도 HDD가 있으며, 각각은 하나의 물리 볼륨을 만드는 데 사용됩니다. 파티션 /dev/sda2는 첫 번째 PV를 만들고, /dev/sdb1은 두 번째이며 sdc1은 세 번째입니다.

이어서 두 개의 별도 볼륨 그룹이 있고, 각각에는 개별적인 논리 볼륨이 있습니다. 언급한 대로, LVs는 볼륨 그룹에서 잘려 나온 것입니다. 한 VG에서 하나 이상의 논리 볼륨이 올 수 있습니다.

이 추상화에서 최종 계층은 논리 볼륨입니다. 예를 들어, vg-data 볼륨 그룹에서 나온 lv-data가 있습니다. lv-data가 준비되면 포맷하여 마운트 지점으로 사용할 수 있습니다. 이 경우: /dev/vg-data/lv-data.

<div class="content-ad"></div>

## LVM 논리 볼륨 만드는 방법:

기존 논리 볼륨을 확장/확장하는 것에 대한 내용을 살펴보기 전에, 이전에 설정되지 않은 시스템에서 처음부터 하나를 만드는 방법을 살펴보고, 그 다음 섹션에서 확장하는 방법을 살펴보겠습니다. 이미 존재하는 LV를 확장하고 싶다면, 이 섹션을 건너뛰시면 됩니다.

새로운 논리 볼륨을 설정하려면 다음 순서대로 진행해야 합니다:

- 기존 하드 드라이브에서 물리 볼륨을 생성합니다.
- 볼륨 그룹을 생성하고 물리 볼륨을 추가합니다.
- 볼륨 그룹에서 논리 볼륨을 생성합니다.
- 필요에 따라 논리 볼륨을 포맷합니다 — xfs, ext4 등.
- 마지막으로 새 파일 시스템을 마운트합니다.

<div class="content-ad"></div>

— 물리 볼륨을 생성하려면 디스크 공간을 사용할 수 있어야 합니다. 이 서버(가상 머신)에서는 논리 볼륨 생성 데모에 사용할 두 개의 별도의 원시 하드 드라이브가 있습니다.

![이미지](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_2.png)

/dev/sdb 및 /dev/sdc 두 개의 원시 디스크가 있는 것을 확인할 수 있습니다. 아직 사용할 수 없으므로 이를 포맷해야 합니다.

이 새 디스크 /dev/sdb를 사용할 수 있게 하는 방법을 빠르게 살펴보겠습니다:

<div class="content-ad"></div>


![이미지](https://miro.medium.com/v2/resize:fit:1400/1*XLof11Om75NHy4PY2-2S2Q.gif)

저희가 한 몇가지에 대해 몇 가지 소식을 전합니다:

- 새로운 드라이브 /dev/sdb를 사용할 수 있도록 새로운 파티션을 생성하고 적절한 레이블을 할당함으로써 진행되고 있습니다.
- 이 파티션의 특정 크기를 지정하지 않았지만, 기본값을 선택하여 전체 디스크를 사용할 수 있습니다. 크기를 지정하지 않고 엔터를 누르면 사용 가능한 전체 공간이 할당됩니다.
- 여기서 중요한 부분은 이 새로운 파티션을 레이블링하여 LVM 유형으로 지정하는 “8e” 16진수 코드를 선택하는 것입니다. ext4 파티션을 만들고자 한다면 레이블 코드가 다를 것입니다. 새로운 파티션을 만들 때, 사용하기 전에 레이블링해야 합니다.
- 우리가 한 변경 사항을 저장하기 위해 “w”를 입력해야 합니다.

이제 디스크가 준비되었으니, pvcreate로 물리적 볼륨을 생성하는 것부터 시작해보겠습니다:


<div class="content-ad"></div>

피지컬 볼륨이 성공적으로 생성되었습니다! 이제 pvdisplay를 사용하여 PV가 만들어졌는지 확인해봅시다 (pvs도 사용할 수 있습니다):


[itadmin@localhost ~]$ sudo pvdisplay
[sudo] password for itadmin:
  --- Physical volume ---
  PV Name               /dev/sda2
  VG Name               centos
  PV Size               <19.00 GiB / not usable 3.00 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              4863
  Free PE               0
  Allocated PE          4863
  PV UUID               sa3xFR-jbDb-SKuS-yQN1-VzzW-bveG-aA0yha
"/dev/sdb1"은 "<30.00 GiB"의 새로운 피지컬 볼륨입니다
  --- NEW Physical volume ---
  PV Name               /dev/sdb1
  VG Name
  PV Size               <30.00 GiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               Q54fqC-Np3X-XUaF-j5vE-Px29-pT9H-JYsDUh
[itadmin@localhost ~]$


이미 /dev/sda2에 PV가 있습니다. 이는 루트 파티션도 논리 볼륨 위에 구축되어 있음을 의미합니다. 새로운 디스크 /dev/sdb1은 이제 피지컬 볼륨입니다. 이 새로운 피지컬 볼륨의 VG 이름이 비어있는 것을 알 수 있습니다! 이는 이제까지 볼륨 그룹에 추가되지 않았기 때문입니다! 이를 바로 해결해봅시다:

<div class="content-ad"></div>

```bash
[itadmin@localhost ~]$ sudo vgcreate vg-data /dev/sdb1
  Volume group "vg-data" successfully created
[itadmin@localhost ~]$
```

- 새 볼륨 그룹을 만들 때 vgcreate를 사용하며, 새 볼륨 그룹에 이름을 할당하고 물리 볼륨 또는 볼륨을 추가합니다. 이 경우에는 /dev/sdb1을 이 VG의 일부로 만듭니다.

새로 만든 볼륨 그룹을 확인해봅시다:

```bash
[itadmin@localhost ~]$ sudo vgs
  VG      #PV #LV #SN Attr   VSize   VFree
  centos    1   2   0 wz--n- <19.00g      0
  vg-data   1   0   0 wz--n- <30.00g <30.00g
[itadmin@localhost ~]$
```

<div class="content-ad"></div>

- vg-data은 실제로 존재하며 30GB의 여유 공간이 있어요 — 이는 이전에 추가한 물리 볼륨(새로운 파티션)의 크기입니다.

이제 lvcreate을 사용하여 논리 볼륨을 생성합니다:

```bash
[itadmin@localhost ~]$ sudo lvcreate --name lv-data -l 100%FREE vg-data
논리 볼륨 "lv-data"이(가) 생성되었습니다.
[itadmin@localhost ~]$
```

- -l : 우리가 볼륨 그룹에서 얼마의 공간을 사용할지를 지정하는 데 사용됩니다. 여기서는 해당 그룹의 100%를 할당합니다. 명령어에 볼륨 그룹 이름을 명시해야 합니다.

<div class="content-ad"></div>

새로운 Logical Volume을 lvdisplay로 확인하고 있어요:

![LV](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_3.png)

우리의 Logical Volume이 성공적으로 생성되었어요!

이제 사용할 수 있도록 이 논리적 볼륨을 포맷해야 해요. 새로운 LV를 포맷하는 방법은 mkfs.xfs 명령을 사용하는 거에요:

<div class="content-ad"></div>

```bash
[itadmin@localhost ~]$ sudo mkfs.xfs /dev/vg-data/lv-data
[sudo] itadmin 님의 암호:
meta-data=/dev/vg-data/lv-data   isize=512    agcount=4, agsize=1965824 블록
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=0, sparse=0
data     =                       bsize=4096   블록=7863296, imaxpct=25
         =                       sunit=0      swidth=0 블록
naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
log      =internal log           bsize=4096   블록=3839, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   블록=0, rtextents=0
[itadmin@localhost ~]$
```

.mkfs는 "파일 시스템 생성"을 의미하며, 이를 수행합니다. 이 경우에는 xfs 파일 시스템을 생성하려고 하므로 mkfs.xfs를 사용합니다. xfs 파일 시스템은 여러 측면에서 ext4보다 업그레이드된 것이며 RHEL 서버에서 기본 파일 시스템입니다. 그럼에도 불구하고 상황에 따라 ext4를 사용하는 것이 xfs보다 우위를 가질 수 있습니다.

새로 생성된 논리 볼륨을 마운트하려면 해당 마운트 포인트를 만들고 다음 단계를 수행합니다:

```bash
[itadmin@localhost ~]$ sudo mkdir /data
[itadmin@localhost ~]$ sudo mount /dev/vg-data/lv-data /data
```

<div class="content-ad"></div>

저희는 새 파일 시스템이 마운트될 새로운 디렉토리를 생성했어요. /data 하위에 있는 모든 것들은 이 새 논리 볼륨에 속합니다.

— 부가적인 사항으로 — 새로운 마운트 포인트를 /etc/fstab 파일에 추가해야 부팅 중에도 지속되도록 해야 해요.

새롭게 마운트된 /data 디렉토리를 df 명령어로 살펴봅시다:

![이미지](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_4.png)

<div class="content-ad"></div>

- 파일 시스템이 실제로 XFS인지 확인해야 하기 때문에 df 명령에 "T" 스위치가 필요합니다. 이 스위치는 파일 시스템 유형을 보여주는 데 사용됩니다.
- 우리의 논리 볼륨 lv-data는 모두 준비되어 있고 /data에 마운트되어 있습니다!

작업이 완료되었습니다!

## 논리 볼륨 확장 방법

우리는 처음부터 논리 볼륨을 만드는 방법을 보았지만, 대부분의 경우 이미 존재하는 논리 볼륨의 크기를 늘려야 하므로 더 많은 데이터를 수용할 수 있게 할 필요가 있습니다.

<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경해주세요.

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_5.png)

- 우리는 Volume Group vg-data에 사용 가능한 빈 공간이 없음을 확인할 수 있습니다. 새 물리 볼륨을 추가해 보겠습니다.

먼저, 이 새 드라이브를 사용할 수 있도록 새 파티션을 만들고 "LVM" 레이블을 할당해야 합니다. 이를 위해 아래와 같이 fdisk를 사용하여 수행합니다:

![image](https://miro.medium.com/v2/resize:fit:1400/1*qB2R3x5Zc2Lt46xIq-bEFQ.gif)


<div class="content-ad"></div>

- fdisk를 사용하여 새 파티션을 만들고, 크기를 지정하지 않은 전체 크기를 할당했어요 (값을 지정하지 않고 Enter를 누르면 사용 가능한 크기를 할당합니다).
- 정확한 라벨을 지정해야 해요, "LVM 타입"으로 만들기 위해 필요한 라벨은 8e에요.

디스크가 준비되었고, 이제 물리 볼륨을 생성할 수 있어요:

```js
[root@localhost ~]$ pvcreate /dev/sdc1
  Physical volume "/dev/sdc1" successfully created.
[root@localhost ~]$
```

생성 완료! 이제 vg-data 볼륨 그룹에 추가하려면, vgextend 명령어를 사용해요:

<div class="content-ad"></div>

```bash
[root@localhost ~]$ vgextend vg-data /dev/sdc1
  Volume group "vg-data" successfully extended
[root@localhost ~]$
```

VG가 확장되었습니다! 한 번 더 확인해 봐요:

![이미지](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_6.png)

훌륭해요! 이제 vg-data에 25GB의 여유 공간이 있는 것을 확인할 수 있어요.

<div class="content-ad"></div>

지금은 Logical Volume에 뛰어들어 보겠습니다. 지금 상태는 다음과 같습니다:

![Logical Volume Status](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_7.png)

우리는 lvextend 명령어로 lv-data Logical Volume을 확장했습니다:

```js
[root@localhost ~]$ lvextend -l +100%FREE /dev/vg-data/lv-data
  Size of logical volume vg-data/lv-data changed from <30.00 GiB (7679 extents) to 54.99 GiB (14078 extents).
  Logical volume vg-data/lv-data successfully resized.
[root@localhost ~]$
```

<div class="content-ad"></div>

- lvextend 명령은 lv-data 논리 볼륨을 확장하며, +100%FREE 옵션은 해당 볼륨을 볼륨 그룹에서 남아있는 모든 가능한 크기로 확장합니다.
- 만약 우리가 논리 볼륨을 특정 크기로 확장하고 싶었다면, 예를 들어 5GB로 확장하고 싶다면 다음과 같이 진행할 것입니다:

```js
[root@localhost ~]$ lvextend -L +5G /dev/vg-data/lv-data
```

이제 우리의 논리 볼륨 상태를 확인해봅시다:

![논리 볼륨 상태](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_8.png)

<div class="content-ad"></div>

출력을 통해 LSize가 실제로 증가했고, 논리 볼륨이 확장되었습니다!

아직 끝나지 않았어요! 마지막 단계는 새로 추가된 저장 용량을 사용할 수 있도록 파일 시스템의 크기를 조정하는 것입니다. 이 작업은 xfs_growfs 명령으로 수행할 수 있어요:

```js
[root@localhost ~]$ xfs_growfs /dev/vg-data/lv-data
```

<img src="https://miro.medium.com/v2/resize:fit:1400/1*yu72eMpz12FUdIOTeL0qgg.gif" />

<div class="content-ad"></div>

- 데이터 블록이 변경되고 파일 시스템이 확장되었음을 알 수 있습니다.
- 여기서 언급해야 할 또 다른 훌륭한 점은 파일 시스템을 확장할 때 마운트 포인트인 /data를 해제할 필요가 없었다는 것입니다!

df -kh 명령의 출력에서 /data 마운트 포인트가 확장되었음을 확인할 수 있습니다. 여기에는 lv-data 논리 볼륨이 마운트된 곳입니다:

![Image](/assets/img/2024-06-22-LVMinLinuxCreateandExtendaLogicalVolume_9.png)

모두 완료되었습니다. 논리 볼륨이 성공적으로 확장되었습니다!

<div class="content-ad"></div>

이 글은 Linux에서 논리 볼륨 매니저에 대해 간략히 다룬 내용이었습니다. 논리 볼륨을 생성하고 확장하는 방법에 대해 설명했습니다. 궁금한 점이나 의견, 추가할 내용이 있으면 자유롭게 남겨주세요.

읽어주셔서 감사합니다! 다음 포스트에서 만나요 :)