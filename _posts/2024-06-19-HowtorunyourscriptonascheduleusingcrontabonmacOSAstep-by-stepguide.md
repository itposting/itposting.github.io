---
title: "맥OS에서 크론탭을 사용하여 스크립트를 정해진 시간에 실행하는 방법 단계별 안내"
description: ""
coverImage: "/assets/img/2024-06-19-HowtorunyourscriptonascheduleusingcrontabonmacOSAstep-by-stepguide_0.png"
date: 2024-06-19 15:14
ogImage:
  url: /assets/img/2024-06-19-HowtorunyourscriptonascheduleusingcrontabonmacOSAstep-by-stepguide_0.png
tag: Tech
originalTitle: "How to run your script on a schedule using crontab on macOS: A step-by-step guide"
link: "https://medium.com/@justin_ng/how-to-run-your-script-on-a-schedule-using-crontab-on-macos-a-step-by-step-guide-a7ba539acf76"
---

맥에서는 쉘(Shell), 노드(Node), 파이썬(Python) 및 데노(Deno) 스크립트를 쉽게 자동화할 수 있습니다.

![이미지](/assets/img/2024-06-19-HowtorunyourscriptonascheduleusingcrontabonmacOSAstep-by-stepguide_0.png)

# 소개

Mac에서 파일 백업, 보고서 생성 또는 이메일 전송과 같은 작업을 자동화하고 싶은 적이 있나요? 이러한 작업은 반복적이고 시간이 많이 소비되지만 crontab을 사용하면 특정 시간에 실행되도록 예약하여 더 중요한 일에 집중할 수 있습니다. 이 기사에서는 crontab 도구를 탐색하고, 쉘, 노드, 파이썬 및 데노로 작성된 스크립트를 예약하는 방법을 보여드리겠습니다.

<div class="content-ad"></div>

# 맥에서의 Crontab 작동 방식

Crontab은 macOS에서 작업을 관리하고 자동화하는 Unix 기반 도구입니다. 예약된 작업, 즉 cron 작업을 저장하는 "crontab 파일"이라는 구성 파일을 사용합니다. Crontab 파일의 각 줄은 cron 식으로 시작하여 실행할 명령을 포함하는 단일 cron 작업을 나타냅니다.

일반적인 crontab 파일은 다음과 같이 보일 수 있습니다:

```shell
# 매일 새벽 3시에 백업 스크립트 실행
0 3 * * * /경로/백업.sh

# 매 시간마다 Node.js 스크립트 실행
0 * * * * /usr/local/bin/node /경로/스크립트.js

# 매주 월요일 오후 4시에 Python 스크립트 실행
0 16 * * 1 /usr/bin/python3 /경로/스크립트.py
```

<div class="content-ad"></div>

표 태그를 마크다운 형식으로 변경해주세요.

<div class="content-ad"></div>

```js
crontab - e;
```

이 명령을 입력하면 일반적으로 Vim이 열리며 기본 텍스트 편집기를 사용하여 crontab 파일을 수정할 수 있습니다. 이 파일에서 cron 작업을 추가, 수정 또는 제거할 수 있습니다. 변경 사항을 적용하려면 편집기에서 저장하고 종료하세요.

## 시각적 텍스트 편집기를 사용하여 Crontab 편집

Visual Studio Code, Sublime Text 또는 Atom과 같은 시각적 텍스트 편집기를 선호하는 경우 VISUAL 환경 변수를 설정하여 기본 편집기를 지정할 수 있습니다. 예를 들어 Visual Studio Code를 사용하려면 터미널에서 다음 명령을 실행하세요:

<div class="content-ad"></div>

```js
export VISUAL="code --wait"
```

그런 다음 crontab -e를 실행하면 crontab 파일이 Visual Studio Code에서 열립니다. 변경 사항을 저장한 다음 편집기를 닫아 변경 사항을 적용하세요.

이 변경 사항을 영구적으로 적용하려면 export VISUAL 명령을 귀하의 셸 설정 파일 (예: ~/.bashrc, ~/.bash_profile 또는 ~/.zshrc)에 추가하세요.

# 크론 표현식 101

<div class="content-ad"></div>

크론 표현식은 공백으로 구분된 다섯 필드의 문자열입니다. 각 필드는 시간 단위를 나타냅니다:

```js
*  *  * * *
│  │  │ │ └───── 요일 (0 - 7, 0과 7은 모두 일요일을 나타냄)
│  │  │ └─────── 월 (1 - 12)
│  │  └───────── 한 달의 날짜 (1 - 31)
│  └──────────── 시 (0 - 23)
└─────────────── 분 (0 - 59)
```

별표(\*)는 와일드카드로 사용되며 "모든 값을" 의미합니다. 쉼표로 구분된 값, 범위 및 증분(/ 기호 사용)을 사용할 수도 있습니다.

## 여러 값 지정에 쉼표 사용하기

<div class="content-ad"></div>

1시 30분 오후와 6시 30분 오후에 작업을 실행하려면:

```js
30 13,18 * * * your-command
```

## 값 범위 지정을 사용하여 값을 범위로 지정하기

오전 9시부터 오후 5시까지 매 30분마다 작업을 실행하려면:

<div class="content-ad"></div>

## 간격 지정을 사용한 작업 실행

매 2시간마다 작업을 실행하려면:

```js
0 */2 * * * your-command
```

<div class="content-ad"></div>

# macOS에서 가장 일반적인 Cron 표현식

## 지정된 시간에 매일 작업 실행하기

매일 새벽 2시 30분에 작업을 실행하려면:

```js
30 2 * * * 실행할-명령어
```

<div class="content-ad"></div>

## 매 시간마다 작업 실행

매 시간의 처음부터 작업을 실행하려면:

```js
0 * * * * your-command
```

## 특정 요일과 시간마다 매주 작업 실행

<div class="content-ad"></div>

매주 수요일 오후 3:45에 작업을 실행하려면:

```js
45 15 * * 3 your-command
```

## 특정 날짜와 시간에 매달 작업 실행하기

매월 15일 오후 1시에 작업을 실행하려면:

<div class="content-ad"></div>

```js
0 13 15 * * your-command
```

# 작업 예약하는 단계별 가이드

## 쉘 스크립트 예제

- "backup.sh" 라는 쉘 스크립트 파일을 만들고 실행 가능하게 만듭니다:



<div class="content-ad"></div>

```js
#!/bin/bash
# 백업 명령어
```

2. 스크립트를 매일 새벽 3시에 실행되도록 스케줄링하십시오:

```js
0 3 * * * /path/to/backup.sh
```

## Node.js 스크립트 예제

<div class="content-ad"></div>

- "email.js"라는 Node.js 스크립트 파일을 생성해보세요:

```js
const nodemailer = require("nodemailer");

// 여러분의 이메일 전송 로직을 작성해주세요
```

2. 매 시간마다 스크립트가 실행되도록 예약해보세요:

```js
0 * * * * /usr/local/bin/node /path/to/email.js
```

<div class="content-ad"></div>

## 데모 스크립트 예시

- "report.ts"라는 Deno 스크립트 파일을 만들어보세요:

```ts
import { generateReport } from "./reportGenerator.ts";

// 보고서 생성 후 파일로 저장
```

2. 매주 화요일 오후 8시에 스크립트를 실행할 수 있습니다:

<div class="content-ad"></div>

```js
0 20 * * 2 /usr/local/bin/deno run --allow-read --allow-write /path/to/report.ts
```

## Python 스크립트 예시

- "analytics.py"라는 Python 스크립트 파일을 생성하세요:

```js
import pandas as pd

# 데이터 분석 및 시각화 로직을 작성하세요
```

<div class="content-ad"></div>

2. 매주 금요일 오후 12시에 스크립트를 실행하도록 일정을 예약해주세요:

```js
0 12 * * 5 /usr/bin/python3 /path/to/analytics.py
```

# 크론 표현식을 만들 수 있는 도구

macOS용 크론 표현식을 만들 수 있는 여러 웹사이트 및 앱이 있습니다.

<div class="content-ad"></div>

- Crontab Generator
- CronTab.guru
- CronMaker

이 도구들을 사용하면 원하는 일정을 지정하고 해당하는 cron 식을 제공받아 cron 작업을 쉽게 생성하고 테스트할 수 있습니다.

# Crontab을 사용한 스케줄된 작업 모니터링 및 로깅

스케줄된 작업을 효과적으로 관리하기 위해서는 현재 예약된 작업을 확인하고 이전 실행 로그를 확인하는 방법을 알아야 합니다. 이 섹션에서는 이러한 중요한 모니터링 및 로깅 작업을 안내해 드립니다.

<div class="content-ad"></div>

## 예약된 작업 확인하기

현재 예약된 작업 목록을 확인하려면 터미널을 열고 다음 명령어를 입력하세요:

```js
crontab - l;
```

이 명령은 현재의 crontab 파일을 표시하며, 모든 예약된 cron 작업을 보여줍니다. 각 줄은 하나의 cron 작업을 나타내며, cron 표현식 다음에 실행할 명령이 오게 됩니다.

<div class="content-ad"></div>

## 이전 실행 로그 보기

기본적으로 macOS는 cron 작업의 자세한 로그를 저장하지 않습니다. 하지만 cron 작업의 출력을 로그 파일로 리다이렉트하여 실행을 추적할 수 있습니다. 이를 위해 crontab 파일을 수정하여 각 cron 작업에 출력 리다이렉션을 추가하세요.

예를 들어, 매일 새벽 3시에 실행되는 셸 스크립트의 출력을 기록하려면 crontab 항목을 다음과 같이 업데이트하세요:

```js
0 3 * * * /path/to/backup.sh >> /path/to/backup.log 2>&1
```

<div class="content-ad"></div>

``` operator는 출력을 지정된 로그 파일에 추가하고, 2`&1을 사용하여 표준 출력(stdout)과 표준 오류(stderr)를 모두 캡처합니다.

크론 작업이 출력을 로깅하도록 설정되면, 이러한 로그 파일을 확인하여 작업에 의해 생성된 결과 및 오류 메시지를 확인할 수 있습니다.

또는 크론 작업의 실행에 대한 기본 정보를 확인하기 위해 시스템 로그를 확인할 수도 있습니다. 이를 위해 터미널을 열고 아래 명령어를 입력하세요:

grep -i cron /var/log/system.log

<div class="content-ad"></div>

이 명령은 크론 작업과 관련된 모든 로그 항목을 표시하여 예약된 작업의 실행에 관한 타임스탬프와 기본 정보를 제공합니다.
