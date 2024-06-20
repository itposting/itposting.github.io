---
title: "조사 악성 PDF  OSINT"
description: ""
coverImage: "/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_0.png"
date: 2024-06-19 04:21
ogImage: 
  url: /assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_0.png
tag: Tech
originalTitle: "Investigation: Malicious PDF + OSINT"
link: "https://medium.com/@princeprafull/investigation-malicious-pdf-osint-37380fd2b67f"
---


이 블로그는 다양한 기술과 자원을 활용하여 악성 PDF 파일을 분석하는 데 도움이 될 것입니다. OSINT 방법을 사용하여 조사를 개선하는 방법에 대해 이야기할 것입니다.

![이미지](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_0.png)

## PDF 구조:

PDF는 객체의 조합입니다. 이해해야 할 일부 용어가 있습니다:

<div class="content-ad"></div>

- 헤더: PDF에서 처음 나오는 줄로, PDF의 버전에 대해 말합니다.
- 객체: PDF는 여러 섹션으로 나누어진 객체로 구성됩니다. 각 항목을 식별하기 위해 번호가 할당됩니다.

악성 PDF의 중요한 객체 몇 가지는 다음과 같습니다:

- /OpenAction: 악성 PDF에서 사용되는 주요 객체 중 하나로, PDF 파일을 열 때 악성 스크립트가 즉시 실행되도록 합니다.
- /JavaScript: PDF를 사용하여 악성 자바스크립트 코드를 실행할 수 있게 합니다.

# ⚒️도구 및 요구 사항:

<div class="content-ad"></div>

- PdfID
- Pdf-Parser
- PeePdf
- 격리된 가상 머신, 권장하는 리눅스 배포판. (내 생각에는, 알고 계시겠죠)

## 시작해 볼까요? 🏁

공격자들은 악의적인 PDF를 다양한 방법으로 사용합니다. 일반적인 방법 중 일부는 다음과 같습니다:

- 호스트 머신에서 악의적인 스크립트 실행
- PDF를 사용하여 외부 도메인에서 악성 소프트웨어 다운로드

<div class="content-ad"></div>

우리는 두 가지 방법을 블로그에서 다룰 거에요. 기대해 주세요.

악성 PDF를 수집한 후

# 시나리오 1:

- pdfid를 사용하여 PDF에 있는 모든 객체를 찾아보세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_1.png" />

2. reading objects using peepdf:

<img src="/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_2.png" />

위의 이미지처럼 이 PDF에는 여러 개의 스트림이 있습니다. JS 또는 인코딩된 문자열을 포함한 모든 스트림 및 객체에 대한 정보를 확인해야 합니다.

<div class="content-ad"></div>


![encoded object one by one](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_3.png)

opening encoded object one by one

![better view in VScode or any other code editor tool](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_4.png)


<div class="content-ad"></div>

위의 Javascript 코드에서 우리는 pdf가 stale.exe를 다운로드하고 WScript.Shell을 사용하여 실행한다는 것을 쉽게 이해할 수 있습니다.

이제 Virustotal을 사용하여 stale.exe가 다운로드되는 URL을 확인합니다.

<div class="content-ad"></div>

오 이런, 악성 URL입니다. 어서 이제 exe 파일의 점수를 확인해 봐야 해요.

Virustotal의 세부 정보를 확인하고 exe 파일의 해시를 열어야 합니다.

![image 1](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_7.png)

![image 2](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_8.png)

<div class="content-ad"></div>

# 시나리오 2:

또 다른 샘플을 살펴봅시다 !!

![이미지](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_9.png)

이 PDF에서 몇 개의 스트림이 보입니다. 표시된 PDF 트리는 흐름 이해에 도움이 됩니다.

<div class="content-ad"></div>


![InvestigationMaliciousPDFOSINT_10](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_10.png)

we see uri in one of the object. Lets investigate into that:

![InvestigationMaliciousPDFOSINT_11](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_11.png)

what virustotal says about this URL:


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_12.png)

![이미지](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_13.png)

![이미지](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_14.png)

VT 커뮤니티 섹션에서 파일 스캔 보고서를 발견했습니다.


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-InvestigationMaliciousPDFOSINT_15.png)

커뮤니티 탭과 VirusTotal의 정보를 항상 확인해보세요. 이러한 도구들은 보다 철저한 악성 코드 조사에 도움이 됩니다.

# 샘플:

- [샘플1](https://bazaar.abuse.ch/download/c1290b6740600c80533b4e8f8172f15ca4b3d6d4faab96b56912782a98ac5518/)
- [샘플2](https://bazaar.abuse.ch/download/3779f1b904ee4cf41f4a266505490682559d09337deb30a2cc08793c2e69385c/)


<div class="content-ad"></div>

# 🤙 연락처 :

https://www.linkedin.com/in/prince-prafull-19a477194/

https://twitter.com/princeprafull3/