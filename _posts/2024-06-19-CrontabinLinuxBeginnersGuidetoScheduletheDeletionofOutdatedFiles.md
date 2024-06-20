---
title: "리눅스의 Crontab 오래된 파일 삭제 일정 설정 초보자 가이드"
description: ""
coverImage: "/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_0.png"
date: 2024-06-19 01:02
ogImage: 
  url: /assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_0.png
tag: Tech
originalTitle: "Crontab in Linux: Beginner’s Guide to Schedule the Deletion of Outdated Files"
link: "https://medium.com/devops-dev/crontab-in-linux-beginners-guide-to-schedule-the-deletion-of-outdated-files-e45543f364c0"
---


![Image](/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_0.png)

## 우리의 시나리오:

고객이 서비스의 디스크 공간이 100%로 가득찬 것을 알아차리고, 가장 쉬운 솔루션은 공급자 캐시였습니다. 이 캐시에는 PR에서 사용된 모든 공급자 버전이 포함되어 있으며 매주 안전하게 삭제할 수 있습니다.

크론 작업을 설정하여 매주 월요일 오전 7시에 실행하고 폴더에서 파일을 삭제하십시오. 폴더 자체는 삭제하지 않도록 주의하십시오.

<div class="content-ad"></div>

시작해 봅시다!

## Cron 소개

Cron은 리눅스 환경에서 사용자가 일정 시간에 반복적으로 작업을 예약할 수 있게 해주는 응용 프로그램입니다. Cron은 주로 예약된 백업 실행, 디스크 공간 모니터링, 파일 삭제, 시스템 유지 보수 작업 실행 등에 사용됩니다.

Cron 작업을 사용하면 서버에서 특정 작업을 예약하고 실행할 수 있습니다. Cron 작업은 백그라운드에서 실행되는 작업을 자동화하는 데 사용됩니다.

<div class="content-ad"></div>

대부분의 cron 작업에는 세 가지 구성 요소가 있습니다:

- 호출하거나 실행할 스크립트입니다.
- 주기적으로 스크립트를 실행하는 명령입니다.
- 호출되는 스크립트가 하는 작업 또는 출력이 있습니다. 일반적으로 스크립트는 파일이나 데이터베이스를 수정합니다. 그러나 서버의 데이터를 수정하지 않는 다른 작업도 수행할 수 있습니다. 예를 들어 이메일 알림을 보내는 등의 작업이 있을 수 있습니다.

한 개의 Cron 작업 개체는 crontab(크론 테이블) 파일의 한 줄과 같습니다. 지정된 일정에 주기적으로 작업을 실행하며, 크론 형식으로 작성됩니다. 

Crontab 구문에는 다음과 같은 다섯 가지 필드가 포함되며 가능한 값을 가집니다:

<div class="content-ad"></div>

- 분. 명령이 실행될 시간(0–59 사이)을 나타냅니다.
- 시간. 명령이 실행될 시간(24시간제, 0–23 사이)을 나타냅니다.
- 월별 날짜. 명령이 실행될 날짜(1–31 사이)를 나타냅니다.
- 월. 명령이 실행될 월(1–12 사이, 즉 1월부터 12월까지)을 나타냅니다.
- 요일. 명령이 실행될 요일(0–6 사이, 일요일부터 토요일까지)을 나타냅니다. 일부 시스템에서 값 7은 일요일을 나타냅니다.
- 별표(*)는 해당 필드의 모든 값을 나타냅니다. 예를 들어, 4번째 필드(월)에 별표를 사용하면 매월을 의미합니다.

중요: 필드를 비워두지 마세요.

<img src="/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_1.png" />

## 크론 제한사항:

<div class="content-ad"></div>

- 작업 간 최단 간격은 60초입니다. cron을 사용하면 59초 미만으로 작업을 실행할 수 없습니다.
- 한 대의 컴퓨터에 집중화되어 있습니다. cron 작업을 네트워크 내의 여러 대의 컴퓨터로 분산할 수 없습니다. 그러므로 cron을 실행하는 컴퓨터가 충돌하면 예약된 작업이 실행되지 않고 누락된 작업을 수동으로만 실행할 수 있습니다.
- 자동 재시도 메커니즘이 없습니다. cron은 엄격히 지정된 시간에 실행되도록 설계되었습니다. 작업이 실패하면 다음 예약된 시간까지 다시 실행되지 않습니다. 이로 인해 cron은 점진적 작업에 적합하지 않습니다.

이러한 제한 사항으로 인해 cron은 특정 시간에 정기적인 간격으로 실행되는 간단한 작업에는 훌륭한 솔루션입니다.

## cron이 수행할 수 있는 기본 작업:
- crontab -e: crontab 파일을 생성 또는 편집합니다. 시스템에 crontab 파일이 없는 경우 해당 명령은 자동으로 새 파일을 생성합니다. crontab -e를 사용하면 cron 작업을 추가, 편집 및 삭제할 수 있습니다.
- crontab -l: 시스템에 있는 활성 예약된 작업 목록을 볼 수 있습니다.
- crontab -u username -l: 시스템에 여러 사용자가 있는 경우 su를 입력하여 해당 명령으로 사용자의 crontab 파일 목록을 볼 수 있습니다.
- sudo su crontab -u username -e: 다른 사용자의 예약된 작업을 편집합니다. 루트 권한을 부여하려면 명령의 시작 부분에 sudo su를 추가하십시오. 이 명령을 포함한 일부 명령은 관리자 사용자만 실행할 수 있습니다.
- crontab -r: crontab 파일의 모든 예약된 작업을 삭제하고 새로 시작합니다.
- crontab -i: 해당 명령은 crontab -r과 동일하지만 사용자에게 crontab을 제거하기 전에 yes/no 옵션을 제시합니다.
- man crontab: cron의 매뉴얼 페이지

<div class="content-ad"></div>

# 1| 명령어 테스트

크론 작업을 예약하기 전에 명령을 테스트하기 위해 몇 가지 파일이 들어 있는 새 디렉토리를 만들어 보겠습니다:
mkdir: 새 디렉토리 만들기에 사용됩니다
touch: 일반 파일 생성에 사용됩니다

![이미지](/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_2.png)

이제 test_script의 모든 파일을 삭제해 보겠습니다. 실행할 명령어는 다음과 같습니다:

<div class="content-ad"></div>

```js
$ 찾기 ./test_script -mindepth 1 -delete
```

find 명령어는 파일의 이름을 입력하여 특정 파일을 검색할 수 있습니다. -name 옵션을 사용하여 원하는 파일 이름을 입력한 후 find 명령어를 사용할 수 있습니다.

maxdepth vs. mindepth:
-maxdepth levels
시작점 아래의 디렉토리에서 최대 levels(0 이상의 정수)까지 이동합니다. -maxdepth 0은 시작점 자체에 대해 테스트 및 작업을 적용합니다.

-mindepth levels
levels(0 이상의 정수)보다 작은 수준에서는 어떤 테스트나 작업도 적용하지 않습니다. -mindepth 1은 시작점을 제외한 모든 파일을 처리합니다.


<div class="content-ad"></div>

아래 화면 캡처에서 확인할 수 있듯이 스크립트가 정확히 작동했습니다! 성공!

## 2. 스크립트 만들기

시작하려면 Step 1에서 한 것과 똑같은 단계를 따를 것입니다. 폴더 내에 디렉터리를 만들고 더미 파일을 생성하세요. 이번에는 다른 이름으로 만들어 보겠습니다!

<div class="content-ad"></div>

다음으로, vim을 사용하여 동일한 스크립트를 사용하여 파일을 삭제할 수 있는 스크립트를 만듭니다.

<img src="/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_5.png" />

리눅스에서 스크립트를 실행 가능하게 하려면 "chmod" 명령을 사용하여 파일에 "실행" 권한을 할당하십시오.

<div class="content-ad"></div>

표 태그를 마크다운 형식으로 변경하면 됩니다.

```js
$ chmod u+x script

또는 

$ chmod 744 script
```

<img src="/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_6.png" />

자, 이제 스크립트를 실행해보고 제대로 작동하는지 확인해봅시다!

<div class="content-ad"></div>

아래 Markdown 형식으로 table 태그를 변경하세요.


<img src="/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_7.png" />

성공입니다! 모든 것이 파일에서 지워졌고 실제 파일은 삭제하지 않았습니다! 이제 마지막 퍼즐 조각으로 넘어가 봅시다!!

# 3| Cron 작업 추가

다시 한 번, 위와 같은 단계를 따라하여 폴더 내에 파일을 생성하실 겁니다.


<div class="content-ad"></div>

아래는 Markdown 형식으로 표를 표시합니다.


![Crontab Image 8](/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_8.png)

다음으로, 매주 월요일 오전 7시에 실행되는 cron 작업을 만들어야 합니다. 이를 위해 https://crontab-generator.org/ 로 이동하여 약간의 안내를 받겠습니다.

![Crontab Image 9](/assets/img/2024-06-19-CrontabinLinuxBeginnersGuidetoScheduletheDeletionofOutdatedFiles_9.png)

다음 명령을 실행하여 crontab을 엽니다:


<div class="content-ad"></div>

```js
$ crontab -e
```

파일의 맨 끝에 다음 줄을 추가하세요:

```js
0 7 * * 1 ./Users/kparham/cron_test_folder/cron_delete_files.sh >/dev/null 2>&1
```

˚*•̩̩͙✩•̩̩͙*˚＊성공!!!! ＊ ˚*•̩̩͙✩•̩̩͙*˚

<div class="content-ad"></div>

마크다운 형식으로 테이블 태그를 변경해주세요.