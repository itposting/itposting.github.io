---
title: "명령 줄 정복하기 필수 리눅스 CLI 명령어 9가지"
description: ""
coverImage: "/assets/img/2024-06-20-ConquertheCommandLine9EssentialLinuxCLICommands_0.png"
date: 2024-06-20 14:22
ogImage: 
  url: /assets/img/2024-06-20-ConquertheCommandLine9EssentialLinuxCLICommands_0.png
tag: Tech
originalTitle: "Conquer the Command Line: 9 Essential Linux CLI Commands"
link: "https://medium.com/nerdytest/conquer-the-command-line-20-essential-linux-cli-commands-4729186616e0"
---


리눅스 명령줄 인터페이스(CLI)는 처음 보는 사람에게는 어렵게 보일 수 있습니다. 암호화된 텍스트와 깜박이는 커서가 기술 마법사들을 위해 예약된 것처럼 보입니다. 그러나 걱정하지 마세요! 이 복잡해 보이는 외부 아래에는 잠재력 가득한 강력한 도구가 숨어 있습니다. 필수 명령어 몇 가지만 습득하면 시스템을 쉽게 탐색하고 파일을 효율적으로 관리하며 작업을 자동화할 수 있습니다. 이 안내서는 여러분을 당혹스러운 초보자에서 숙련된 CLI 닌자로 변몽해주는 20가지 기본 리눅스 CLI 명령어로 여러분을 장비시킵니다.

- pwd: 현재 위치 스카우트

리눅스 시스템의 디렉토리 미로에 잃혀진 적이 있나요? pwd (print working directory)가 신뢰할 수 있는 스카우트처럼 도와줍니다. 이 명령은 즉시 현재 디렉토리의 절대 경로를 표시하여 방대한 파일 시스템 내에서 위치를 명확히 알 수 있게 해줍니다. 예를 들어 다운로드 폴더에서 문서를 작업 중이라고 상상해보세요. 터미널에 pwd를 입력하면 "/home/사용자명/Downloads"와 같은 내용이 나타납니다. 디지털 세계에서의 현재 위치가 엿보이는 것이죠.

- cd: 정확히 이동하는 디렉토리 미로

<div class="content-ad"></div>

복잡한 디렉터리 미로를 탐험하는 것은 cd(디렉터리 변경)로 간단합니다. 이 명령어와 목표 디렉터리 경로를 가지고 있으면 파일 시스템의 계층 구조를 순찰하며 원하는 위치로 정확하게 이동할 수 있습니다. 마치 마법의 순간이동 장치 같은 느낌이죠 – cd Documents를 입력하여 즉시 Documents 폴더로 전환하거나, /usr/local/bin을 입력하여 실행 가능한 프로그램을 포함한 시스템 디렉토리로 이동할 수 있습니다.

- ls: 보물 지도처럼 디렉터리 내용 공개

현재 디렉터리의 내용이 궁금한가요? ls(list)만큼 좋은 대답은 없습니다. 이 다재다능한 명령어는 보물 지도처럼 작용하여 현재 위치에 있는 파일 및 하위 디렉터리 목록을 공개합니다. 홈 디렉터리에서 ls를 입력하면 "resume.docx"와 "Pictures", "Music"과 같은 폴더가 파일 목록을 보여줄 수 있습니다. 그렇게 함으로써 저장된 내용에 대한 빠른 개요를 얻을 수 있습니다.

- mkdir: 새 디렉터리 생성 — 디지털 요새 구축

<div class="content-ad"></div>

파일 시스템의 조직적 경계를 확장하는 것은 mkdir (make directory)를 사용하면 간단합니다. 이 명령어를 사용하면 새 디렉토리를 만들어 파일과 프로젝트를 보관할 구조적인 계층을 만들 수 있습니다. 디지털 요새를 건설하는 것과 같습니다. mkdir projects를 사용하여 작업용 새 폴더를 만든 다음 mkdir projects/webdev를 사용하여 웹 개발 프로젝트를 위한 하위 폴더를 만들어보세요.

- touch: 빈 파일 생성 — 플레이스홀더 마법

touch를 사용하면 빈 파일을 손쉽게 생성할 수 있습니다. 이 명령어는 디지털 완드와 같이 작동하여 빈 파일을 만들어냅니다. 이 파일들은 미래 콘텐츠를 위한 플레이스홀더로 사용하거나 조직적 목적을 위한 표식으로도 활용할 수 있습니다. 새 프로젝트를 계획 중이지만 아직 콘텐츠가 준비되지 않았다면 touch README.md를 사용하여 아직 내용을 작성하지 않아도 프로젝트 readme를 위한 빈 파일을 만들어보세요.

- cp: 복제 마법 — 파일 복제의 기술

<div class="content-ad"></div>

파일 복제는 cp (복사)로 아주 간단합니다. 이 명령은 복제의 마스터로 파일 또는 전체 디렉토리를 매끄럽게 복제하여 백업, 배포 또는 여러분의 편의를 위해 복사본을 만들 수 있습니다. 다른 채용 지원을 위해 이력서 복사본이 필요하다고 상상해보세요. cp resume.docx backup_resume.docx를 사용하여 다른 이름으로 복제본을 만들어보세요.

- mv: 이름 변경 및 이동 - 두 마리 트릭 포니

파일 이름 바꾸기와 디렉토리 간 이동은 mv (이동/이름 바꾸기)로 아주 간단합니다. 이 다재다능한 명령은 두 마리 트릭 포니처럼 작동하여 파일에 새로운 이름을 부여하거나 파일을 파일 시스템 내에서 더 적합한 위치로 옮길 수 있습니다. "report_draft.docx"란 이름의 문서를 작업 중이라면 mv report_draft.docx final_report.docx를 사용하여 이름을 변경하세요. 다른 폴더로 이동해야 한다면 mv final_report.docx /home/username/Documents를 사용하여 이동하세요.

- cat: 파일 내용 공개 - 텍스트 보관소 내부 엿보기

<div class="content-ad"></div>

텍스트 파일 내용을 별도의 편집기를 열지 않고 엿보고 싶나요? cat (concatenate)이 여러분의 동반자가 될 거예요. 이 명령은 열고자 하는 파일의 텍스트 보관고를 열고 해당 내용을 원시 상태 그대로 터미널 화면에 표시해줍니다. important_message.txt라는 파일의 내용을 읽고 싶다면 cat important_message.txt를 사용하세요.

- grep: 텍스트의 심층을 탐험하라 — 텍스트 탐정

파일 내에서 특정 텍스트 단편을 발굴하는 것은 grep(global search for regular expression)를 통해 가능한 강력한 작업입니다. 이 명령은 파일을 한 줄씩 꼼꼼히 살펴가며 지정한 패턴의 인스턴스를 찾아내는데, 당신을 텍스트 탐정으로 변신시켜줍니다. 마치 여러분이 파일을 뒤져가는 듯한 생각이 들지 않나요?