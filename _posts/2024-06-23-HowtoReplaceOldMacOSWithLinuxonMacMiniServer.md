---
title: "맥 미니 서버에 오래된 MacOS를 리눅스로 교체하는 방법 "
description: ""
coverImage: "/assets/img/2024-06-23-HowtoReplaceOldMacOSWithLinuxonMacMiniServer_0.png"
date: 2024-06-23 15:41
ogImage: 
  url: /assets/img/2024-06-23-HowtoReplaceOldMacOSWithLinuxonMacMiniServer_0.png
tag: Tech
originalTitle: "How to Replace Old MacOS With Linux on Mac Mini Server"
link: "https://medium.com/by-devops-for-devops/how-to-replace-old-macos-with-linux-on-mac-mini-server-cc618d1052a8"
---



![macos-linux-replacement](/assets/img/2024-06-23-HowtoReplaceOldMacOSWithLinuxonMacMiniServer_0.png)

오래된 맥 미니에 우분투를 설치하는 것을 고려해야 하는 몇 가지 이유가 있습니다:

- 성능 향상: 우분투는 오래된 하드웨어에서 효율적으로 작동하는 가벼운 운영 체제입니다. 오래된 맥 미니에 우분투를 설치하면 기기에 새 숨을 불어넣고 전체적인 성능을 향상시킬 수 있습니다.
- 오픈 소스 소프트웨어: 우분투는 다양한 무료 오픈 소스 소프트웨어를 보유한 오픈 소스 운영 체제입니다. 이는 비싼 프로프리터리 소프트웨어 비용을 피하고 싶은 사용자에게 훌륭한 옵션이 될 수 있습니다.
- 보안: 우분투는 강력한 보안 기능으로 알려져 있어 데이터를 보호하고 시스템을 바이러스 및 기타 위협으로부터 안전하게 유지할 수 있습니다.
- 사용자 정의: 우분투는 매우 사용자 정의가 가능하여 시스템을 조정하고 조절할 수 있습니다. 사용자의 요구에 맞게 운영 체제를 맞춤 설정하고 싶은 사용자에게 훌륭한 선택이 될 수 있습니다.
- 커뮤니티 지원: 우분투에는 사용자 및 개발자로 이루어진 큰 활발한 커뮤니티가 있어 시스템에 문제가 발생할 경우 지원과 가이던스를 제공할 수 있습니다.

어린 시절의 맥 미니에 우분투를 설치하는 것은 기기의 수명을 연장하고 더 많은 이점을 얻을 수 있는 좋은 방법일 수 있습니다. 그러나 맥 미니에 우분투를 설치하는 것은 복잡할 수 있으며 몇 가지 기술적인 단계가 필요할 수 있습니다.


<div class="content-ad"></div>

# 설치 단계

아래는 오래된 맥 미니에 우분투를 설치하는 일반적인 단계입니다:

- 우분투를 포함한 부팅 가능한 USB 드라이브를 만듭니다: 우분투 ISO 파일은 공식 웹사이트에서 다운로드할 수 있으며 다음 명령어를 사용하여 부팅 가능한 USB 드라이브를 만들 수 있습니다.

```js
diskutil list  # 볼륨 확인
# 플래시 드라이브를 삽입하세요
diskutil list   # 새로운 장치 확인, 예: /dev/disk2
diskutil unmountDisk /dev/diskN
sudo dd if=ubuntu-22.04.2-live-server-amd64.iso of=/dev/rdiskN bs=1m
diskutil eject /dev/diskN
```

<div class="content-ad"></div>

2. USB 드라이브에서 부팅하기: USB 드라이브를 맥 미니에 연결하고 시스템을 다시 시작하세요. 시스템이 다시 시작될 때 옵션 키를 눌러 부팅 메뉴로 진입하고 USB 드라이브를 부팅 장치로 선택하세요.

3. Ubuntu 설치 프로그램 시작하기: USB 드라이브에서 부팅한 후 Ubuntu 설치 프로그램이 표시됩니다. 언어, 시간대 및 키보드 레이아웃을 선택하라는 화면 안내에 따라 진행하세요.

4. 화면 안내에 따라 진행하기: Ubuntu 설치 프로그램이 설치 과정을 안내할 것이며, 완료하는 데 시간이 소요될 수 있습니다.

5. 시스템을 다시 시작하기: 설치가 완료되면 시스템을 다시 시작하라는 메시지가 나타납니다. 다시 시작한 후 맥 미니가 Ubuntu로 부팅되어야 합니다.

<div class="content-ad"></div>

# 선택 사항

## 두 번째 하드 드라이브 추가하기

먼저 Ubuntu에 SSH로 연결하세요. Ubuntu에서 다음 명령을 사용하여 IP 주소를 확인할 수 있습니다:

```js
ip r
  default via 10.0.1.1 dev enp4s0f0 proto dhcp src 10.0.1.75 metric 100
  10.0.1.0/24 dev enp4s0f0 proto kernel scope link src 10.0.1.75 metric 100
  10.0.1.1 dev enp4s0f0 proto dhcp scope link src 10.0.1.75 metric 100
```

<div class="content-ad"></div>

이제 원격으로 Ubuntu로 SSH를 사용할 수 있습니다:


ssh <user_name>@10.0.1.75


현재 볼륨 그룹 이름을 확인하세요:


sudo -s
vgs
  VG        #PV #LV #SN Attr   VSize    VFree
  ubuntu-vg   1   1   0 wz--n- <462.71g <362.71g


<div class="content-ad"></div>

첫 번째 열인 "VG" 아래를 보세요. 만약 Ubuntu 설치 프로그램이 만들었다면, 이름은 "-vg"와 같을 것입니다.

모든 메타데이터를 제거하세요. 전체 디스크를 완전히 삭제할 것이므로 주의하세요.

```js
wipefs --all --backup /dev/sdb
  /dev/sdb: 8 bytes were erased at offset 0x00000200 (gpt): 45 46 49 20 50 41 52 54
  /dev/sdb: 8 bytes were erased at offset 0x7470c05e00 (gpt): 45 46 49 20 50 41 52 54
  /dev/sdb: 2 bytes were erased at offset 0x000001fe (PMBR): 55 aa
  /dev/sdb: calling ioctl to re-read partition table: Success
```

두 번째 드라이브를 물리적 볼륨으로 표시하고, 볼륨 그룹에 추가하세요:

<div class="content-ad"></div>

```js
pvcreate /dev/sdb
  물리 볼륨 "/dev/sdb"가 성공적으로 생성되었습니다.
vgextend ubuntu-vg /dev/sdb
  볼륨 그룹 "ubuntu-vg"가 성공적으로 확장되었습니다.
```

pvs를 사용하여 두 개의 물리 볼륨을 확인해보세요.

```js
pvs
  PV         VG        Fmt  Attr PSize    PFree
  /dev/sda3  ubuntu-vg lvm2 a--  <462.71g <362.71g
  /dev/sdb   ubuntu-vg lvm2 a--  <465.76g <465.76g
```

새로운 논리 볼륨을 생성하고 /data 아래에 마운트하세요.

<div class="content-ad"></div>

```js
lvcreate --size 300G --stripes 2 --stripesize 4096 --name data ubuntu-vg
  Logical volume "data" 가 생성되었습니다.
mkfs.ext4 -m 0 /dev/ubuntu-vg/data
  mke2fs 1.46.5 (2021년 12월 30일)
  78643200개의 4k 블록과 19660800개의 아이노드로 파일시스템을 생성하는 중
  파일시스템 UUID: cd2f1059-a3d9-4eb2-9fde-0d2d9cb5af98
  슈퍼블록 백업은 다음 블록에 저장됨:
   32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
   4096000, 7962624, 11239424, 20480000, 23887872, 71663616

  그룹 테이블 할당: 완료
  아이노드 테이블 작성: 완료
  저널 생성 (262144 블록): 완료
  슈퍼블록 및 파일시스템 회계 정보 작성: 완료

mkdir /data
```

`/etc/fstab` 파일에 다음 라인을 추가하세요

```js
cat /etc/fstab
...
/dev/ubuntu-vg/data  /data  ext4    noatime         0       2
```

그리고 `/data`를 마운트하십시오.

<div class="content-ad"></div>

```js
마운트 /data
df -h
  파일시스템                        크기  사용 중 사용 가능 사용% 마운트된 위치
  tmpfs                             770M  1.5M  768M      1% /run
  /dev/mapper/ubuntu--vg-ubuntu--lv  98G  7.1G   86G      8% /
  tmpfs                             3.8G     0  3.8G     0% /dev/shm
  tmpfs                             5.0M     0  5.0M     0% /run/lock
  /dev/sda2                         2.0G  131M  1.7G      8% /boot
  /dev/sda1                         1.1G  6.1M  1.1G      1% /boot/efi
  tmpfs                             770M  4.0K  770M      1% /run/user/1000
  /dev/mapper/ubuntu--vg-data       295G   28K  295G      1% /data
```

작업을 확인하여 각 논리 볼륨이 어떤 물리 볼륨을 사용하는지 확인하십시오:

```js
lvs -a -o name,lv_size,devices
  LV        LSize   Devices
  data      300.00g /dev/sda3(25600),/dev/sdb(0)
  ubuntu-lv 100.00g /dev/sda3(0)
```

# 결론


<div class="content-ad"></div>

이전 Mac Mini 서버를 버리지 마세요. 보시다시피 Linux 서버(Ubuntu를 사용하는 경우)로 변환하는 것이 어렵지 않습니다. 꽤 좋은 하드웨어를 갖추고 있으며, 공간을 적게 차지하며 전기를 적게 소비하며 조용합니다.