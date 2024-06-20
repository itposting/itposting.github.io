---
title: "윈도우 포렌식 오피스 문서"
description: ""
coverImage: "/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_0.png"
date: 2024-06-19 09:02
ogImage: 
  url: /assets/img/2024-06-19-WindowsForensicsOfficeDocuments_0.png
tag: Tech
originalTitle: "Windows Forensics: Office Documents"
link: "https://medium.com/@andrewss112/windows-forensics-office-documents-7f51bde27140"
---


# Windows 포렌식 - 파일/폴더 오픈, 응용프로그램 실행과 관련된 증거

## 개요

이 글은 프리패치 파일부터 셸 항목 및 레지스트리 분석까지 여러 가지를 다룰 것입니다. 우리는 대상 사용자가 Microsoft Office 제품을 실행하고 Word 문서와 활발히 작업한 사실을 보여줄 것입니다. 마지막으로 우리는 Word에서 사용자가 본 정확한 페이지를 확인하고 해당 페이지를 우리 자신의 기계에서 재작성하여 용의자 사용자가 마지막으로 본 것을 확인할 수 있게 될 것입니다.

## 시스템에서 Microsoft Office 제품이 실행되었는지 확인하는 방법

<div class="content-ad"></div>

## 사전 로드 파일

사전 로드 파일은 응용 프로그램 실행에 대한 자세한 정보를 제공합니다. 그들의 주요 기능은 응용 프로그램의 일부 메모리를 디스크에 기록하여 사용자가 특정 응용 프로그램을 두 번째로 실행할 때 일부 데이터가 이미 캐싱되어 있어 더 빨리 시작되도록 하는 것입니다. 사전 로드가 캐시하는 정보는 다음과 같습니다:

- 로드된 DLL
- 응용 프로그램이 상호 작용한 다른 파일(다른 PE 파일 포함)
- 응용 프로그램이 상호 작용한 디렉터리의 상대 경로
- 응용 프로그램을 실행한 횟수
- 응용 프로그램을 실행한 마지막 8개의 타임스탬프
- 파일 시스템 타임스탬프(생성, 수정, 액세스)
- 파일 크기
- 응용 프로그램 해시
- 볼륨 정보

사전 로드 파일은 C:\Windows\Prefetch에 저장되며 파일 확장자는 .pf입니다. 이것이 우리가 시작할 지점이 될 것이며, 대상 시스템에서 Office 제품이 실행되었는지 확인할 수 있습니다.

<div class="content-ad"></div>

에릭 짐머만의 PECmd 도구를 사용하면 전체 디렉토리를 구문 분석하여 CSV 파일로 출력하거나 한 번에 하나의 .pf 파일을 구문 분석할 수 있습니다. 우리는 사무 문서에만 관심이 있기 때문에 Microsoft Word용 prefetch 파일 하나를 구문 분석할 것입니다.

## Word Prefetch (Application Execution)

```js
# 하나의 prefetch 파일을 구문 분석하는 구문
pecmd -f $파일
```

![이미지](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_0.png)

<div class="content-ad"></div>

가장 먼저 지적하고 싶은 것은 최근 실행된 타임스탬프와 파일 시스템 수정된 타임스탬프 간의 불일치입니다. 이론적으로는 응용 프로그램이 실행될 때 NTFS 파일 시스템에서 수정된 타임스탬프가 업데이트되므로 이러한 타임스탬프는 일치해야 합니다. 그러나 최근 실행 시간이 파일 시스템보다 2초 빠르게 기록되었습니다. 이것은 중요한 고려 사항이며 파일 시스템 타임스탬프만 놓고 보면 고려해야 할 사항입니다. 실행 후 파일 시스템이 수정된 시간을 업데이트하기까지 최대 10초가 소요될 수 있습니다.

이제 우리는 컴퓨터에서 Word가 실행되었음을 알고 있으며 다음과 같은 세부 사항이 있습니다:

- Word가 23번 실행되었습니다
- 최근 실행 시간은 2024년 5월 30일 12:50:01에 있었습니다 (모든 타임스탬프는 UTC, 24시간 형식입니다)
- 볼륨 GUID
- 그리고 응용 프로그램이 상호 작용한 디렉토리 및 파일 목록 (스크린샷에 포함되지 않음)

# 문서가 열렸는지 확인하기

<div class="content-ad"></div>

## 바로 가기 파일 (LNK)

Word가 열려 있다고 해서 그와 함께 문서가 열리는 것은 아닙니다. LNK 파일을 활용하여 어떤 문서가 열렸는지 추측하는 데 도움을 받을 수 있습니다. 이러한 증거들은 사용자의 프로필에 저장됩니다: C:\Users\$user\AppData\Roaming\Microsoft\Windows\Recent.

LNK 파일은 파일이나 폴더가 열릴 때 기록이 되며, 제어판 앱도 포함됩니다. 이러한 쉘 항목들은 다음을 기록합니다:

- 파일 시스템 타임스탬프
- 대상 타임스탬프 (쉘 항목은 대상 파일을 가리키며, LNK 파일은 실제로 다른 개체에 액세스하는 방법에 대한 메타데이터를 저장)
- 파일 크기, 속성 및 플래그
- 대상 파일의 상대 경로
- 대상 파일의 작업 디렉토리
- 볼륨 정보
- 그리고 $MFT 레코드 정보

<div class="content-ad"></div>

에릭 짐머만의 도구 중 하나인 LECmd를 사용하여 이 파일들을 구문 분석할 수 있습니다.

```js
# LECmd 사용법
lecmd -f $file
```

![이미지](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_1.png)

위 스크린샷에서 우리는 CIRT_SOP.docx라는 문서를 위한 LNK 파일을 볼 수 있습니다. 이 파일이 마지막으로 수정된 날짜는 Word가 마지막으로 실행된 날짜와 같음을 알 수 있습니다. 하나 이상의 문서가 열렸다는 것을 알기 때문에 사용자 레지스트리를 확인하여 파일이 마지막으로 열리고 닫힌 시간을 결정할 수 있습니다.

<div class="content-ad"></div>

# 파일 활동 기간 결정하기

사용자의 NTUSER.dat 파일에서 Microsoft Office 문서와 관련된 레지스트리 키를 찾을 수 있습니다. 주로 이러한 키들은 NTUSER\Software\Microsoft\Office\16.0\Word 경로에 있습니다.

## 파일이 마지막으로 열린 날짜

저는 Microsoft 365 계정을 사용하고 있기 때문에 NTUSER\Software\Microsoft\Office\16.0\Word\File MRU에는 문서가 나열되지 않습니다. 대신 개인 Office 365 라이선스와 관련된 키를 참조해야 합니다: NTUSER\Software\Microsoft\Office\16.0\Word\User MRU\LiveId_$hash\File MRU. 이 항목들은 가장 최근에 사용된 순서대로 나열됩니다.

<div class="content-ad"></div>


![이미지 1](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_2.png)

파일이 처음 열린 시간을 나타내는 타임스탬프는 64비트 FILETIME에서, big endian 형식으로 “T” 뒤에 나오는 바이트 입니다. 아래 화면은 아이템 1에 대한 디코딩된 시간을 보여줍니다.

![이미지 2](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_3.png)

![이미지 3](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_4.png)


<div class="content-ad"></div>

## 파일 종료 날짜

파일이 마지막으로 닫힌 날짜를 확인하려면 다른 레지스트리 키인 NTUSER\Software\Microsoft\Office\16.0\Word\Reading Locations로 전환해야 합니다. 각 문서에는 중요한 하위 키/값 쌍을 포함하는 자체 하위 키가 생성됩니다.

![image](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_5.png)

![image](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_6.png)

<div class="content-ad"></div>

Datetime에 나열된 값에 유의하세요. 이 값은 시스템의 로컬 시간입니다 (정확한 시스템 프로필링이 반드시 필요함을 증명합니다). Datetime에 나열된 시간을 UTC로 변환하면 레지스트리의 마지막 쓰기 시간 (2024–05–30 20:45:56)과 일치하는 것을 볼 수 있습니다. 이것은 파일이 마지막으로 닫힌 시간입니다.

Position 값은 사용자가 마지막으로 보고 있던 문서의 위치를 기록합니다. 이것은 Word가 시행하는 "이전에 멈췄던 곳부터 다시 시작" 기능입니다. 이론적으로, 사용자가 마지막으로 머물렀던 정확한 페이지를 결정할 수 있습니다:

- 해당 대상 파일을 우리 시스템으로 복사
- 문서를 열기
- 문서를 닫아 우리의 NTUSER 하이브에 기록되도록 함
- 용의자의 NTUSER 하이브에서 Position 값 복사하여 우리 NTUSER 하이브로 이동.

# 문서의 마지막 위치 결정

<div class="content-ad"></div>

일하고 있는 문서를 추적 중이었던 것이 회사 작업을 위해 작업 중이던 것이기 때문에 사용자가 마지막으로 중지한 위치를 확인할 때 concept 확인을 위해 다른 문서로 전환할 것입니다. Reading Locations에 나열된 Document 1이라는 파일을 사용할 것입니다.


![이미지](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_7.png)



![이미지](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_8.png)



![이미지](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_9.png)


<div class="content-ad"></div>

이론적으로는 Position에 나열된 값과 일치하도록 변경하여 사용자가 마지막으로 보고 있던 내용을 복원할 수 있어야 합니다.

![image1](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_10.png)

이제 파일을 다시 열 때, 우리는 중단했던 곳부터 이어서 작업할 것을 요청받아야 합니다.

![image2](/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_11.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WindowsForensicsOfficeDocuments_12.png" />

# 이 기사의 목적

저는 이 기사를 쓴 이유는 학습하고 있는 개념을 강화하고 있는 것인데, 메모에 너무 의존하는 것을 줄이고 지식을 내재화하는 노력에 있습니다. 사용자가 마지막으로 머물렀던 정확한 페이지를 확인할 수 있는 것이 가능하다는 것을 알게 되었을 때 정말 멋있었고, HackTheBox 머신에서 사용자/루트 쉘을 얻는 것보다 더 흥미로웠습니다. 이 글을 통해 새로운 지식을 얻거나 흥미를 느낀 사람이 있다면 좋겠습니다. 배운 것들을 다른 사람들과 공유해주세요!