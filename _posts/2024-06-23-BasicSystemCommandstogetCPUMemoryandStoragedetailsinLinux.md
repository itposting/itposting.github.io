---
title: "리눅스에서 CPU, 메모리, 스토리지 정보를 얻기 위한 기본 시스템 명령어들"
description: ""
coverImage: "/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_0.png"
date: 2024-06-23 15:21
ogImage: 
  url: /assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_0.png
tag: Tech
originalTitle: "Basic System Commands to get CPU, Memory, and Storage details in Linux"
link: "https://medium.com/devops-engineering-on-cloud/basic-system-commands-to-get-cpu-memory-and-storage-details-in-linux-9ee7f2778749"
---


![이미지](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_0.png)

이 문서는 리눅스 쉘 명령어를 사용하여 CPU, 메모리, 저장소 세부 정보를 얻는 방법을 가르쳐 드립니다.

👨🏽‍💻🧑🏻‍💻더 많은 기사를 보려면, 클라우드상의 DevOps 엔지니어링을 팔로우해주세요.

시작해봅시다.

<div class="content-ad"></div>

# 컴퓨터의 핵심 구성 요소 개요

컴퓨터는 일련의 알고리즘과 산술 명령을 실행할 수 있도록 프로그래밍할 수 있는 모든 기계를 말합니다.

게임 시스템이든 가정용 PC이든, 현재 대부분의 컴퓨터를 구성하는 다섯 가지 주요 구성 요소는 다음과 같습니다:

![이미지](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_1.png)

<div class="content-ad"></div>

# Linux에서 lscpu 명령어를 사용하여 CPU 세부 정보 가져오기

lscpu는 Linux에서 CPU 구성에 대해 알아보는 데 필수적인 명령어입니다. lscpu에 대한 자세한 정보는 lscpu --help를 실행하여 얻을 수 있습니다.

![이미지](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_2.png)

Linux의 명령줄 유틸리티 "lscpu"는 시스템의 CPU 정보를 가져오는 데 사용됩니다. "lscpu" 명령어는 CPU 아키텍처 정보를 "sysfs" 및 /proc/cpuinfo 파일에서 가져와 터미널에 표시합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_3.png" />

# Linux에서 free를 사용하여 메모리 세부 정보 가져오기

Linux의 free 명령은 컴퓨터의 RAM 사용량을 전체적으로 확인하는 데 사용됩니다. free 명령의 전체 세부 정보를 확인하려면 free --help 명령을 실행할 수 있습니다.

아래 그림에서 제어 인수를 사용하여 free 명령을 사용할 수 있습니다.👇🏻

<div class="content-ad"></div>


![Free Command Output 1](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_4.png)

This is what the output to the free command looks like in the Linux terminal.

![Free Command Output 2](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_5.png)

If you want the human-readable output of the free command you can use the `-h` argument along with the `free` command.


<div class="content-ad"></div>

```js
free -h
```

![Storage Details](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_6.png)

# Linux에서 df를 사용하여 저장소 세부 정보 가져오기

Linux의 df 명령어는 각 파일이 존재하는 파일 시스템에 대한 정보나 기본적으로 모든 파일 시스템에 대한 정보를 표시하는 데 사용됩니다. 일반적인 용어로 표현하면, df 프로그램은 하드 디스크나 CD, DVD 및 플래시 드라이브를 포함한 모든 하드디스크 또는 마운트된 장치에서 데이터를 검색하는 데 도움이 됩니다.  

<div class="content-ad"></div>

리눅스 터미널에서 다음 명령을 실행하여 df 명령의 전체 사용법을 확인할 수 있어요.

```js
df --help
```

![image](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_7.png)

만약 인간이 읽기 쉬운 형식으로 출력을 원하면 Linux에서 `df -h` 명령을 사용할 수 있어요.

<div class="content-ad"></div>


![image](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_8.png)

현재 작업 디렉토리의 저장소 세부정보를 사람이 읽을 수 있는 형식으로 확인하려면 Linux에서 다음 명령을 실행할 수 있습니다. 여기서 '.'은(는) 현재 작업 디렉토리를 나타냅니다.

```js
df -h .
```

![image](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_9.png)


<div class="content-ad"></div>

# Linux에서 du를 사용하여 디스크 사용량 세부 정보 가져오기

Linux에서 du 명령어는 디스크 사용량을 가져오는 데 사용됩니다. 이 du 명령어는 각 폴더를 재귀적으로 통과하면서 각 파일의 저장소 세부 정보를 가져옵니다.

간단히 말해, du 명령어는 파일 집합의 디스크 사용량을 요약하여 디렉토리에 대해 재귀적으로 작동합니다. du 명령어의 전체 세부 정보를 얻으려면 du --help을 실행하면 됩니다.

![이미지](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_10.png)

<div class="content-ad"></div>

du 명령어의 출력 결과는 아래 이미지와 같을 것입니다.

![이미지](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_11.png)

만약 파일의 세부 정보를 찾는 대신 폴더 수준에서 저장소의 세부 정보만을 원한다면 모든 폴더를 재귀적으로 검색하지 않고 다음과 같은 Linux 명령어를 사용할 수 있습니다.

```bash
du -sh *
-s, --summarize        각 인수에 대한 총합만 출력
-h, --human-readable   사람이 읽을 수 있는 형식으로 크기 출력 (예: 1K 234M 2G)
```

<div class="content-ad"></div>

아래와 같은 결과가 출력됩니다👇🏻

![이미지](/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_12.png)

# du 및 sort 명령어를 사용하여 Linux에서 가장 큰 폴더 및 파일 가져오기

du 명령어와 sort 명령어를 사용하여 Linux 파일 시스템에서 저장 용량을 가장 많이 사용하는 파일을 해결할 수 있습니다. du 명령어의 출력을 sort 명령어로 연결하는 방식으로 이 작업을 수행할 수 있습니다.

<div class="content-ad"></div>

```js
du -s * | sort -n
```

위의 명령어를 실행하면 결과는 아래와 같이 나타날 것입니다👇🏻

<img src="/assets/img/2024-06-23-BasicSystemCommandstogetCPUMemoryandStoragedetailsinLinux_13.png" />

# Windows에서 du를 사용하여 디렉터리의 저장 세부 정보 이해하기

<div class="content-ad"></div>

다음 비디오 타임 스탬프에서 윈도우의 디렉토리 저장소 세부 정보에 대한 설명을 확인하실 수 있어요.

# 폴더 및 파일의 저장소 사용량 얻기

다음 명령어를 실행하여 리눅스 터미널에서 파일 및 폴더의 저장소 사용량을 얻을 수 있어요

```js
du -sh .
```

<div class="content-ad"></div>

리눅스 터미널에서 위 명령을 실행할 때 권한 관련 문제가 발생하면 다음 명령을 사용하여 'Operation not permitted' 메시지를 무시할 수 있습니다.

```js
du -sm * 2>/dev/null
```

출력은 권한 관련 오류 없이 표시됩니다.

위 출력을 sort 명령에 파이핑하여 결과를 오름차순으로 정렬할 수 있습니다.

<div class="content-ad"></div>

```sh
du -sm * 2>/dev/null | sort -n
```

# find와 du를 사용하여 더 큰 파일의 저장소 세부 정보 가져 오기

더 큰 파일 세부 정보를 얻으려면 find 명령어와 du 명령어를 함께 사용할 수 있습니다.

```sh
find [STRING] -type f -exec du -m {} +;
```

<div class="content-ad"></div>

위 명령어에 | sort -n을 추가하여 출력을 정렬할 수도 있습니다.

```js
find [STRING] -type f -exec du -m {} + | sort -n
```

이렇게 하면 Linux 시스템에서 저장 공간을 많이 차지하는 파일 및 폴더를 해결할 수 있습니다.

🙏🏼글을 읽어주셔서 감사합니다. 유용하다고 느껴지면 DevOps Engineering on Cloud 게시물을 팔로우해주세요.