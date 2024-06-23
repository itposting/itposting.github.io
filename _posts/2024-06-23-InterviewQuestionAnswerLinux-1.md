---
title: "면접 질문, 답변  Linux-1"
description: ""
coverImage: "/assets/img/2024-06-23-InterviewQuestionAnswerLinux-1_0.png"
date: 2024-06-23 15:19
ogImage: 
  url: /assets/img/2024-06-23-InterviewQuestionAnswerLinux-1_0.png
tag: Tech
originalTitle: "Interview Question , Answer — Linux-1"
link: "https://medium.com/@ibrahims/interview-question-answer-linux-1-5af0ad4edf57"
---


❓리눅스 부팅 프로세스는 무엇인가요?

리눅스 부팅 프로세스는 여섯 가지의 고수준 단계로 나뉩니다:

- BIOS — Basic Input/Output System이 MBR을 실행합니다.
- MBR — Master Boot Record가 GRUB를 실행합니다.
- GRUB — Grand Unified Bootloader가 커널을 실행합니다.
- Kernel — 커널이 /sbin/init을 실행합니다.
- Init — Init이 런레벨 프로그램을 실행합니다.
- Runlevel — 런레벨 프로그램은 /etc/rc.d/rc*.d/에서 실행됩니다.

<div class="content-ad"></div>

buymeacoffee ☕ 👈 클릭해보세요

❓리눅스에서 어떻게 제로 사이즈 파일을 만들 수 있을까요?

쉘 명령어 $ touch 파일이름 을 입력하면 파일 이름의 사이즈가 0바이트인 파일이 생성됩니다.

❓리눅스에서 소프트 링크와 하드 링크는 무엇이며, 이들을 어떻게 생성할 수 있을까요? 이 두 링크 유형의 차이는 무엇일까요?

<div class="content-ad"></div>


![Link](/assets/img/2024-06-23-InterviewQuestionAnswerLinux-1_1.png)

A “soft link” takes more, as it has an inode, and file contents (the path to the target file) it also has the name in the directory.

Softlink 👈

A “hardlink” only exists in the name in a directory- and specifies the inode number of the file.


<div class="content-ad"></div>

하드 링크 👈

```js
ln [원본 파일명] [링크 이름] --> 하드 링크 생성
ln -s [원본 파일명] [링크 이름] --> 심볼릭 링크 생성
```

하드 링크: 파일 이름 = `Inode` = 내 하드 링크

심볼릭 링크: inode `=== 파일 이름 `== 소프트 링크

<div class="content-ad"></div>

❓ 쉘 스크립트에서 일반적으로 첫 줄은 무엇인가요? 그 의미는 무엇인가요? 만약 이 줄이 생략된다면 어떤 일이 발생하고, 이 경우 스크립트를 어떻게 실행하나요?

스크립트의 첫 줄은 어떤 프로그램을 사용할지를 지시합니다. 첫 줄은 #! 두 문자의 시퀀스로 시작하는데, 이를 "shebang"이라고 합니다. 그 다음에는 운영 체제에게 파일의 나머지 부분을 파싱하는 데 사용할 해석기를 알려주는 프로그램이 옵니다.

#!는 사람이 읽기 편하지만, 반드시 그렇게 되어야 하는 것은 아닙니다.

❓ 리눅스에서 쉘 스크립트를 백그라운드에서 실행하는 방법은 무엇인가요?

<div class="content-ad"></div>


```js
& Symbol
```

프로세스를 백그라운드에서 실행하는 또 다른 방법은 실행하는 명령어 뒤에 앰퍼샌드(&) 기호를 추가하는 것입니다.

```js
script.sh &
command &
```

❓리눅스에서 크론탭(crontab)은 무엇인가요? 크론탭을 이용하여 작업을 설정하고 예약하는 방법에 대해 설명해주세요.


<div class="content-ad"></div>

Crontab은 cron 테이블의 약어로, 특정 시간에 실행되어야 하는 다양한 cron 항목의 일정을 포함하는 파일입니다.

Crontab은 백그라운드에서 cron 데몬에 의해 정기적으로 자동으로 실행되도록 하는 유틸리티로 설명할 수도 있습니다.

![이미지](/assets/img/2024-06-23-InterviewQuestionAnswerLinux-1_2.png)

Crontab → 미래의 어느 시점에 실행되어야 할 작업을 예약하는 것.

<div class="content-ad"></div>

크론탭 링크를 참조하세요

- 스크립트 작성 (옵션): 이 섹션에서는 예제 스크립트를 만드는 방법을 설명합니다.
- 크론텝 파일 생성 또는 편집: 다음 명령을 입력하여 현재 사용자의 크론텝 구성 파일을 엽니다: crontab -e.
- 크론 작업 생성
- 출력 (옵션)
- 저장
- 활성 크론 작업 확인

❓리눅스에서 포트를 허용하려면 어떻게 해야 하나요?

```js
sudo ufw allow 53/tcp
```

<div class="content-ad"></div>

❓원격 서버에서 문제가 발생하는 경우 어떻게 문제를 해결할 수 있을까요?

- 서버에서 원격 데스크톱 서비스가 실행 중인지 확인합니다.
- 서버 방화벽이 원격 데스크톱 연결을 차단하고 있는지 확인합니다.
- 서버가 원격 데스크톱 연결을 허용하도록 구성되어 있는지 확인합니다.
- 서버의 네트워크 설정이 올바른지 확인합니다.