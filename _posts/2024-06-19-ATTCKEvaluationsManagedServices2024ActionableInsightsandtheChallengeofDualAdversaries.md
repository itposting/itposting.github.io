---
title: "ATTCK 평가 관리 서비스2024 실행 가능한 통찰과 이중 적대자 도전"
description: ""
coverImage: "/assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_0.png"
date: 2024-06-19 21:25
ogImage: 
  url: /assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_0.png
tag: Tech
originalTitle: "ATT,CK® Evaluations Managed Services (2024): Actionable Insights and the Challenge of Dual Adversaries"
link: "https://medium.com/mitre-engenuity/att-ck-evaluations-managed-services-2024-actionable-insights-and-the-challenge-of-dual-93fd8506d271"
---


Written By Lex Crumpton and Amy L. Robertson

<img src="/assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_0.png" />

# 소개

안녕하세요! 저희는 ATT&CK® 평가 매니지드 서비스 2024 - 라운드 2에서의 결과를 공개하게 되어 매우 기쁩니다. 참가자 11명이 참여하여 실제 적대적 행위를 탐지하고 보고하는 능력을 자랑했습니다. ATT&CK 평가 웹사이트에서 전체 결과를 확인하고 ATT&CK 평가 라이브러리의 선택한 적대자에 대한 심층적인 배경을 탐색할 수 있습니다.

<div class="content-ad"></div>

사용자들에게 보호 참가자들의 방어 능력에 대한 명확하고 객관적인 통찰력을 제공하는 것이 우리가 관리하는 서비스 평가를 위한 미션입니다. 또한 방어 범위에서의 빈틈과 개선 영역을 식별할 수 있도록 장려하고, 혁신을 촉진하며 산업 전체의 보안 포지션을 진보시키는 환경을 조성하는 데 목표를 두고 있습니다.

이 블로그 포스트에서는 라운드 2에 속한 적들을 공개하고, 참가하는 MSSP를 평가하는 평가팀이 사용하는 새로운 메트릭을 소개하며, 환경 소음의 추가, 그리고 릴리스 구성 요소에 접근하는 방법을 안내할 것입니다.

# 적 해체: 에뮬레이션 개요

관리 서비스 평가를 위해 저희는 "블랙 박스" 방법론을 사용하는데, 여기서 에뮬레이트된 적은 실행 전에 대중 또는 평가 참가자들에게 공개되지 않습니다. 이 접근 방식은 방어자가 적의 정체나 전술에 대한 사전 지식 없이 위협을 식별하고 대응하는 현실 시나리오를 반영하기 위해 설계되었습니다.

<div class="content-ad"></div>

이 라운드는 방어 회피에 중점을 둔 오버랩하는 작업을 가진 다중 자회사 타협을 에뮬레이트했습니다. 신뢰된 관계를 이용하여 데이터 암호화 및 시스템 회복 억제와 같은 작업을 수행하는 것이 목표였습니다.

## 적 대응 프로필: menuPass 및 ALPHV/BlackCat

적어도 2006년부터 활동 중인 menuPass(별칭 APT10)는 중국 국가안보부와 관련되어 있습니다. 글로벌 스파이 작전으로 알려진 menuPass는 항공우주, 건설, 정부 및 통신과 같은 분야를 대상으로 합니다.

2021년에 등장한 상품 및 서비스로써의 랜섬웨어 작전 ALPHV BlackCat은 윈도우, 리눅스 및 VMware 시스템에서 크로스 플랫폼 공격이 가능한 유연한 랜섬웨어 스트레인을 이용해 다양한 산업을 대상으로 합니다.

<div class="content-ad"></div>

The emulation mirrored menuPass's utilization of living-off-the-land techniques, custom fileless malware, anti-analysis tactics, and exploitation of trusted third-party relationships for credential access in defense evasion. For ALPHV/BlackCat, we focused on emulating and evaluating defense evasion, data exfiltration, data encryption, data destruction, and system recovery obstruction behaviors.

## The Multi-Vector Intrusion

In the menuPass scenario, the intrusion targeted two subsidiaries of a fictitious global pharmaceutical company. The attack started with the adversary using stolen credentials from an IIS server administrator to access the Microsoft IIS web server remotely. By employing DLL sideloading, menuPass ran SigLoader and FYAnti, eventually deploying QuasarRAT for establishing command and control (C2) communications.

After gaining initial access, the adversary performed network discovery and obtained keylogging credentials, facilitating lateral movement to the domain controller. Once on the domain controller, menuPass escalated the attack by extracting the NTDS database for additional credentials and discovered a domain trust to a second subsidiary network. Finding a workstation with access to both networks, the adversary pivoted to it and executed SigLoader with SodaMaster using DLL sideloading.

<div class="content-ad"></div>

작업 대상 워크스테이션에 액세스한 menuPass는 Impacket의 secretsdump를 사용하여 파일 서버를 침해하여 추가 자격 증명을 얻었고, 그 후 WMIexec.vbs를 사용하여 파일 서버에서 실행을 얻었습니다. 공격의 파일 단계는 WinRAR과 robocopy를 사용하여 관련 파일을 압축 및 유출하여 침입을 완료했습니다.

![이미지](/assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_1.png)

ALPHV BlackCat 시나리오는 ALPHV BlackCat 그룹의 제휴사가 같은 가상 글로벌 제약 회사의 자회사를 대상으로 공격을 시작한 것을 묘사합니다. 시뮬레이션은 초기 액세스 브로커가 계약 업체에 액세스한 후에 ALPHV BlackCat 제휴사에게 조직의 네트워크에 대한 원격 데스크톱 프로토콜(RDP) 액세스를 제공함으로써 시작했습니다.

액세스를 획득한 후, 공격자는 네트워크 발견을 수행하고 초기 워크스테이션의 암호 저장소로부터 자격 증명을 수집했습니다. 이러한 자격 증명을 사용하여 관리자 권한이 있는 백업 서버를 침해했습니다. 침해된 관리자 자격 증명을 사용하여 공격자는 ExMatter 유출 도구를 사용하여 여러 호스트에서 데이터를 유출했습니다. 데이터 유출 이후, BlackCat 랜섬웨어가 실행되어 리눅스 서버에서 실행되는 가상 머신과 네트워크의 Windows 호스트 파일을 암호화했습니다.

<div class="content-ad"></div>

데이터를 암호화하는 것 외에도 BlackCat 랜섬웨어는 볼륨 그림자 복사본을 삭제하고 Windows 이벤트 로그를 지우면서 시스템 복구 옵션을 방해하여 복구 작업을 복잡하게 만들고 공격의 영향을 증가시켰습니다.

![이미지](/assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_2.png)

# 적대적 시뮬레이션에 대한 세련된 접근 방식

사용자가 자신의 사용 사례 및 환경에 가장 가치 있는 관리 보안 서비스 제공 업체(MSSP) 능력에 대해 정보를 얻는 데 도움을 주기 위해 다음을 도입했습니다:

<div class="content-ad"></div>

- 업체 참가자 결과에 기반한 새로운 보고 지표가 도입되었습니다. MSSP 성과를 명확하고 포괄적이며 실행 가능한 평가를 제공하기 위해 설계되었습니다.

![이미지](/assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_3.png)

- 수행된 행동의 집중된 하위 집합을 엄격한 기준에 따라 검토하여, 평가의 심도와 품질을 향상시키는 것을 목표로 합니다.

![이미지](/assets/img/2024-06-19-ATTCKEvaluationsManagedServices2024ActionableInsightsandtheChallengeofDualAdversaries_4.png)

<div class="content-ad"></div>

# 새로운 보고 지표

이러한 Actionability, Volume, Mean Time to Detect (MTTD), 그리고 Analysis/Enrichment 지표는 전통적인 평가를 뛰어넘어 제공된 보안 서비스의 품질과 효과를 강조합니다.

Actionability: 이 지표는 경보에 자세하고 관련성 있는 정보가 포함되어 SOC 분석가가 사건에 효과적으로 대응하고 조치할 수 있도록 보장합니다. Actionability는 경보가 사건의 필수적인 측면(무엇, 어디서, 언제, 누구, 왜)을 다루는지를 평가하여 사고 대응 프로세스를 간소화하고 분석가들이 추가 정보를 수집하는 데 소요하는 시간을 줄이는 데 도움이 됩니다.

Volume: 각 참가자로부터 수신된 경보의 총수를 캡처함으로써, 이 지표는 경보 전략의 균형 잡힌 시각을 제공합니다. Volume은 이메일 경보와 콘솔 경보로 세분화되며 심각성(낮은, 중간, 높음, 중대한)별로 더 분류됩니다. 이 데이터는 MSSP가 경보 빈도와 관련성 사이의 적절한 균형을 맞추도록 도와줍니다. 이는 각 SOC에게 공통적인 과제입니다.

<div class="content-ad"></div>

평균 탐지 시간(MTTD): MTTD는 MSSP가 보안 사고나 침해를 탐지하는 데 걸리는 평균 시간을 측정합니다. 빠른 탐지는 신속한 대응을 의미하며, 상대방이 피해를 입힐 시간을 줄입니다. 이 지표는 적시에 탐지하는 중요성을 강조하며, 사건 발생 후 적대적 활동에 대한 이메일 경보를 보내는 데 걸린 시간을 평균 내어 계산됩니다.

분석/보강: 이 지표는 MSSP 사후 조치 보고서(AARs)의 품질과 효율성을 평가하며, 명료성, 정확성, 보강 및 사용성에 초점을 맞춥니다. 고품질의 분석은 고객이 사건을 철저히 이해하고 이러한 통찰을 전체적인 보안 자세 및 미래 위협에 대비하기 위해 적용할 수 있도록 돕습니다.

# 집중 평가

선택 기준에는 라운드의 목표와 일치, 새로운 또는 다양한 행동 구현의 포함, 적대적 거래소 및 활동을 반영하는 것이 강조됩니다. 우선순위를 정하고 평가 대상 행동을 신중하게 선택된 하위 집합으로 범위화함으로써, 단순히 상태 보고 이상으로 의미 있는 지표를 훨씬 심도 있게 분석하고 수집할 수 있습니다.

<div class="content-ad"></div>

총 174개 하위 단계가 실행되었고, 우리는 집중 평가를 위해 44개의 주요 하위 단계를 선정했습니다. 이 선택은 다음 고려 사항에 따라 이뤄졌습니다:

- 실행 가능성: 레드 팀(RT)이 모든 벤더에 대해 기법을 성공적으로 실행할 수 있도록 보장하는 것.
- 탐지 능력: MSSP들이 해당 기법을 감지할 수 있는 능력을 확인하는 것.
- 감지 기준의 명확성: 해석의 여지가 없는 간결하고 명확한 감지 기준을 보장하는 것.
- 적대자 전투 기술의 반영: 적대자 전투 기술과 작전을 정확히 반영하는 기법을 선택하는 것.
- 차별화와 정교함: 새로운 복합 구현과 이전에 테스트된 기법의 사용을 균형있게 조정하여 방어 수준을 기준선으로 설정하거나 높이는 것.

이러한 특정 영역을 중점으로 삼아 우리의 목표는 평가의 품질을 향상시키고 벤더에게 감지 능력에 대한 실질적인 통찰력을 제공하는 것입니다.

# 평가 인프라 업데이트

<div class="content-ad"></div>

2024년 관리 서비스 평가는 Amazon Web Services (AWS) 클라우드 인프라에서 처음으로 진행되었으며 참가자들이 AWS Traffic Mirroring 데이터에 네이티브로 접근할 수 있게 했습니다. 이러한 변화는 향후 Enterprise 2024 ATT&CK 평가에 macOS를 포함할 수 있게 했습니다.

## 환경 소음

첫 번째 라운드에서는 환경 내에서 소음이 발생했지만, 이번 라운드에서는 일관성과 견고성을 향상시키기 위해 소음을 자동으로 생성하는 접근 방식을 도입했습니다. 네트워크 내에서 여러 사용자와 관리자의 활동을 모방함으로써 소음 생성은 미래 평가 라운드를 위한 여러 측정 항목의 기초를 마련하면서 총 경고 볼륨을 측정할 수 있게 했습니다.

# 릴리스 구성 요소

<div class="content-ad"></div>

ATT&CK Evaluations 웹 사이트에서 자세한 결과, 기법 범위, 환경 다이어그램 및 악성 코드 개요를 살펴보세요. ATT&CK Evaluations 라이브러리 웹 사이트에서 기술 자료와 에뮬레이션 계획에 액세스하여 이 평가에서 소개된 적대적 행위에 대해 이해하고 재현하며 대비하는 방법을 이해하세요.

# 앞으로 기대되는 점

ATT&CK Evaluations을 계속 발전시키는 동안 향후 계획을 공유할 때 더욱 더 미래가 기대됩니다. 다가오는 라운드(Enterprise 2024 ATT&CK Evaluations)에서는 평가 방법을 더욱 정교화하고 더욱 정교한 적대적 행위와 감지 기술을 포함하여 초점을 확대할 계획입니다. 저희가 제공할 블로그 게시물을 기대해주시고 결과를 탐색하는 방법을 안내하고 결과를 정확하고 공정하게 보장하기 위한 결과 보정 방법에 대해 설명하며 이러한 결과를 효율적으로 활용하여 보안 자세를 강화하는 데 도움이 되는 통찰을 제공할 것입니다. 저희의 목표는 여러분께 MSSP(관리 보안 서비스 공급자)에 대한 정보와 도구를 제공하여 변화하는 위협에 앞서 나가는 데 필요한 지식과 도구를 제공하는 것입니다. 이 여정에 함께해 주셔서 감사하며 방어 능력에 대한 명확하고 객관적인 통찰을 최종 사용자에게 제공할 수 있도록 노력할 것입니다.

# MITRE Engenuity ATT&CK® Evaluations에 대해

<div class="content-ad"></div>

ATT&CK® Evaluations은 MITRE의 객관적인 통찰력과 갈등이 없는 관점을 기반으로 구축되었습니다. 사이버 보안 업체들은 자사의 제품을 개선하고, 방어자들에게 제품의 능력과 성능에 대한 통찰을 제공하기 위해 ATT&CK Evals 프로그램에 의존합니다. ATT&CK Evals은 방어자들이 네트워크를 안전하게 유지하는 제품을 활용하는 방법에 대해 더 나은 결정을 내릴 수 있도록 돕습니다. 이 프로그램은 협력적이고, 위협에 대비하고, 퍼플 티밍 방식을 사용하여 업체와 MITRE 전문가들이 ATT&CK의 맥락 안에서 솔루션을 평가할 수 있도록 엄격하고 투명한 방법론을 따릅니다. MITRE Engenuity의 대중에 봉사하는 의지에 따라, ATT&CK Evals 결과 및 위협 에뮬레이션 계획은 무료로 액세스할 수 있습니다. (https://attackevals.mitre-engenuity.org/)

© 2024 MITRE Engenuity, LLC. 공개 배포 승인. 배포 무제한 23-03986-1.