---
title: "시스템 엔지니어, 시스템 관리자 및 사이트 신뢰성 엔지니어가 PowerShell 자동화를 통해 실무 경험을 쌓고 경력을 발전시킬 수 있는 방법"
description: ""
coverImage: "/assets/img/2024-05-27-HowSystemsEngineersSystemsAdministratorsandSiteReliabilityEngineersCanAdvanceTheirCareersthroughPracticalExperiencewithPowerShellAutomation_0.png"
date: 2024-05-27 12:27
ogImage: 
  url: /assets/img/2024-05-27-HowSystemsEngineersSystemsAdministratorsandSiteReliabilityEngineersCanAdvanceTheirCareersthroughPracticalExperiencewithPowerShellAutomation_0.png
tag: Tech
originalTitle: "How Systems Engineers, Systems Administrators, and Site Reliability Engineers Can Advance Their Careers through Practical Experience with PowerShell Automation"
link: "https://medium.com/@ddyagoda/how-systems-engineers-systems-administrators-and-site-reliability-engineers-can-advance-their-7b352a501bd4"
---


자동화는 반복적인 수동 작업을 제거하기 위해 어디서나 진행 중입니다. 나는 2009년에 컴퓨터 시스템과 네트워크 전공 학업을 시작했는데, 동시에 마이크로소프트가 윈도우 XP SP2 및 윈도우 서버 2003 SP1용 파워셸 첫 번째 버전으로 옵션 구성 요소로 출시한 '파워셸 2.0'을 발표했던 해였다. 그 전에는 리눅스 전문가들이 마이크로소프트 OS에 별 관심을 두지 않았는데, 왜냐하면 윈도우 OS는 아이콘만 누르도록 허용하고 자동화 기능이 거의 없었기 때문이다.

나의 첫 "파워셸" 접점은 그의 최초의 공식 OS 통합 릴리스인 2.0, 그리고 윈도우 서버 2008 R2와 윈도우 7에 통합될 때였습니다. 2009년부터 2013년까지 나는 학업적인 과제를 위해 윈도우 서버와 액티브 디렉터리에 대한 지식을 얻었는데, 이는 간단한 파워셸 명령 실행이 포함되었습니다. 그러나 이러한 파워셸 경험이 나의 전문적인 성공에 어떻게 기여할 수 있는지에 대해 고려한 적이 없었습니다.

가장 초기의 파워셸 관련 직무 공고를 발견하세요.

<div class="content-ad"></div>

2015년, 유명한 미국 기업의 SCCM 전문가로 임명되면서, 저의 경력이 PowerShell을 향한 급격한 전환을 겪게 되었습니다.

그 기간 동안, 전 세계적으로 유명한 패스트푸드 가공 회사에 배치되었습니다. 그들은 전 세계에 40만 대 이상의 Windows 기반 엔드포인트를 유지했습니다.

엔드포인트 구성 요구 사항을 분석하여 PowerShell 및 배치 스크립트를 작성하고 이러한 요구 사항을 충족시키며, 이를 SCCM을 통해 실제 상점에 전 세계적으로 배포하는 것이 제 3단계 업무의 일부였습니다.

직무에 이상적인 후보는 아니었지만, 학업 과정에서 PowerShell에 익숙했던 것이 이 직무에 선발되는 데 중요한 요소였습니다.

<div class="content-ad"></div>

2015년에 면접을 볼 때, 기본 PowerShell 명령에 대한 지식을 주로 시험했습니다. 서비스 정보 가져오기, 서버 통계 확인, Active Directory 사용자 세부 정보 수집, 사용자, 파일, 디렉토리 생성 등의 명령이 그 중에 포함됩니다. 이미 이에 익숙해서 어려움 없이 질문에 답했습니다.

따라서 새로운 Powershell 기회를 활용하고 싶은 모든 분들이 첫 번째 Powershell 직업을 성공적으로 얻기 위해 다음 Microsoft Learn 온라인 강좌에서 숙달하길 강력히 권장합니다.

https://learn.microsoft.com/en-us/training/paths/get-started-windows-powershell/

https://learn.microsoft.com/en-us/training/modules/script-with-powershell/

<div class="content-ad"></div>

첫 직장에서 승진 기회 및 PowerShell 노출 기회

직무 배정의 첫 번째 지식 이전 과정 중에, 나는 40만 개 이상의 장치 대규모 배포에 완전히 책임을 져야 했는데, 이는 주로 내가 직접 작성한 사용자 정의 PowerShell 스크립트에 많이 의존하는 SCCM을 통해 진행되었습니다.

게다가, 과거 PowerShell 배포에 대해 문제가 발생했던 사례에 대해 몇 명의 직원들이 언급했는데, 이로 인해 상당한 재정 손실이 발생했다고 했습니다. 그들은 본받을만한 SCCM PowerShell 배포에 대해 자신 있었으며, 실제 환경에서 배포를 수행하기 전에 PowerShell을 사용했습니다. 사실상, 이것은 PowerShell 기술 개발에 도움이 되었습니다. 직무에서 자주 마주치는 측면 중 하나는 대부분 PowerShell을 기반으로 한 매일 새로운 스크립트를 받는 것입니다.

따라서 PowerShell 스크립트를 생성하라는 요청이 있을 때마다 오류가 없도록 하기 위해 항상 아래 절차를 준수했습니다.

<div class="content-ad"></div>

단계 01: PowerShell 스크립트의 정확한 요구사항을 파악합니다.

단계 02: 비슷한 요구사항을 충족시킬 수 있는 모든 관련 PowerShell 함수\명령을 읽고 이해합니다.

단계 03: 단계 02에서 찾은 내용을 활용하여 최적의 PowerShell 스크립트를 작성합니다.

단계 04: 단일 테스트 머신을 사용하여 스크립트를 테스트합니다.

<div class="content-ad"></div>

Step 05: 3대의 테스트 머신을 사용하여 스크립트를 테스트합니다.

Step 06: 내 머신에 스크립트를 배포하여 잘못된 구성의 피해자가 되도록 합니다.

Step 07: 3대의 프로덕션 머신에 스크립트를 배포하고 결과를 모니터링합니다.

Step 08: 10대의 프로덕션 머신에 스크립트를 배포하고 결과를 모니터링합니다.

<div class="content-ad"></div>

Step 09: 스크립트를 100대의 프로덕션 머신에 배포하고 결과를 모니터링합니다.

Step 10: 스크립트를 1000대의 프로덕션 머신에 배포하고 결과를 모니터링합니다.

Step 11: 스크립트를 100,000대 이상의 프로덕션 머신에 배포하고 결과를 모니터링합니다.

저는 회사에서 3년 동안 업무 중 오류를 하나도 범하지 않았고, 오류 없는 배포 엔지니어 중 한 명이었습니다.

오늘 일을 완벽하게 처리하는 것은 탁월한 성과로 간주되지 않습니다. 기대치를 충족하는 것뿐입니다. 우수한 팀원이 되려면 시간과 비용을 절약하고 생산성을 높이는 새로운 방법을 끊임없이 모색해야 합니다.

<div class="content-ad"></div>

생산성을 향상시키고 시간과 비용을 절약하는 가장 좋은 방법 중 하나는 Powershell을 활용하여 수동 프로세스를 자동화하는 것입니다. 시스템 아키텍트를 포함한 대부분의 시스템 엔지니어링 전문가는 여전히 Windows GUI를 사용하여 작업을 수행합니다. 자세히 살펴보면 Windows 플랫폼 전문가들이 매일 많은 반복 작업을 실행하는 것을 볼 수 있습니다. 그에 따라 PowerShell은 이러한 활동을 자동화하는 데 사용될 수 있으며 여러분의 기술을 보여주고 팀 내에서 여러분의 중요성을 강조할 수 있습니다. 

저는 이전 기업에서의 경력 중 PowerShell을 활용한 주목할만한 자동화 프로젝트 중 하나인 PowerShell 기반 스크립트에 의한 자동화된 장치 복구 및 에스컬레이션을 시작했습니다. 이 고급 PowerShell 스크립트는 2017년에 개발되었으며 2년간의 매일 PowerShell 스크립팅 경험을 통해 만들어졌습니다. 이 스크립트는 Windows 기기의 건강 상태를 실시간으로 식별하고, SCCM 및 SCOM과 같은 에이전트를 배포하여 건강 상태와 잠재적 문제를 확인하고, 문제가 지속되면 이러한 기기를 Excel로 필터링하여 문제를 관련 팀에 자동 이메일을 통해 필요한 조치가 취해지도록 전달할 수 있었습니다. 이 프로젝트의 결과는 회사의 전달 리뷰에서 매우 높게 평가되었으며, 저는 회사의 최고 인재로 선정되어 금융 장려도를 받았습니다. 이를 바탕으로 저는 이 Powershell 프로젝트로 인해 3년 동안 두 번의 승진을 했습니다.

그러므로 Powershell 전문 지식을 통해 여러분의 우수한 성과를 효과적으로 시연할 수 있는 중요한 수단임을 강조합니다. 

이전 Powershell 경험과 성공적인 경력 간의 연결하기

<div class="content-ad"></div>

나는 내 이전 직장에서 거의 4년간 봉사한 후, 유명 은행이 Active Directory 및 도메인 이름 시스템의 시스템 아키텍처 포지션을 제안하여 나에게 제공해주었습니다.

내 ob은 Active Directory와 관련이 많이 있어 PowerShell 전문 지식을 유용하게 활용하고 PowerShell을 통해 Active Directory 능력의 모든 측면에서 자신감을 얻을 수 있었어요.

가장 강조하고 싶은 것은 내가 ConnectWise Automate 전문가로 다음 직업을 얻은 방법입니다. 여기서 Windows 플랫폼을 Powershell로 자동화하고 글로벌 규모에서 7000개 이상의 장치 설정을 관리할 것입니다. 나는 이 기회를 위해 공식 지원서를 제출하지 않았습니다. 대신, 고용주가 나를 LinkedIn에서 발견하고 SCCM과 Powershell 경험에 관심이 있었어요. 회사에 합류한 후에 내 위치가 ConnectWise 플랫폼을 관리할 능력이 필요한 적절한 후보 부재로 두 번이나 공고 되었다는 것을 들었습니다.

내 PowerShell 능력 덕분에 회사에서 일을 시작한 후 상대적으로 짧은 시간 안에 ConnectWise Automate Certified 전문가가 되었습니다. ConnectWise Automate 플랫폼 내에서 PowerShell을 활용함으로써 우수한 자동화를 신속히 수행하여 CEO 상, 빠른 직원 인정상, 최우수 수행자상 3개 주요 성과를 이루었습니다. 따라서 시스템 엔지니어, 시스템 관리자 또는 사이트 신뢰성 엔지니어라면 Powershell 학습을 강력히 권장합니다. 당신의 경력에 큰 변화를 가져다 줄 것입니다.