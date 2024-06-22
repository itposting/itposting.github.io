---
title: "방어 무력화 T1562012 Linux 감사 로그 변조 탐지 방법 2부"
description: ""
coverImage: "/assets/img/2024-06-22-ImpairDefensesT1562012DetectLinuxAuditLogsTamperingPart2_0.png"
date: 2024-06-22 16:09
ogImage: 
  url: /assets/img/2024-06-22-ImpairDefensesT1562012DetectLinuxAuditLogsTamperingPart2_0.png
tag: Tech
originalTitle: "Impair Defenses [T1562.012]: Detect Linux Audit Logs Tampering (Part 2)"
link: "https://medium.com/detect-fyi/impair-defenses-t1562-012-detect-linux-audit-logs-tampering-part-2-3379e5749f10"
---


![이미지](/assets/img/2024-06-22-ImpairDefensesT1562012DetectLinuxAuditLogsTamperingPart2_0.png)

이 시리즈의 첫 번째 파트에서는 리눅스 감사 데몬(auditd)이 시스템 이벤트의 상세 로그를 기록하여 시스템 보안을 유지하는 중요한 역할을 강조했습니다. 이 핵심 기능은 악의적 활동을 숨기려는 공격자들에게 auditd를 주요 대상으로 삼게합니다.

이전 토론은 auditd의 지속적인 작동을 보증하는 데 중점을 둔 반면, 본 기사에서는 auditd 규칙의 삭제와 설정 변경을 감지하는 데 깊이 파고들었습니다. 이러한 설정의 무결성을 보장하는 것은 효과적인 보안 모니터링에 중요합니다.

본 기사에서는 auditd 규칙 및 설정에 대한 무단 변경을 감지하는 중요성을 다룰 것입니다. 이러한 변경사항을 식별하고 감사 로그의 신뢰성을 확보할 수 있는 방법과 도구, 예를 들어 auditd 규칙 및 Splunk 쿼리 등을 소개하겠습니다.

<div class="content-ad"></div>

끝나면 공격자가 시스템 보안을 강화하는 데 필요한 지식과 도구로 장착될 것입니다. 이를 위해 auditd 규칙과 설정을 감지하여 조작하는 것을 탐지할 수 있습니다.

## 우리가 해결하려는 문제

공격자는 종종 auditd 규칙을 삭제하거나 구성을 수정하여 로깅을 비활성화하고 활동을 숨깁니다. 이러한 무단 변경 사항을 감지하는 것은 공격자가 사용하는 다양한 방법 때문에 어려울 수 있습니다.

우리의 목표는 auditd 규칙과 설정에 대한 무단 삭제 또는 수정을 감지하는 것입니다. 효과적인 감지 메커니즘을 구현함으로써 감사 로그의 신뢰성을 유지하고 시스템 보안을 강화할 수 있습니다.

<div class="content-ad"></div>

## 해결책: 오디트드 규칙 및 설정 변경 감지하기

저희의 해결책은 공격자가 오디트드를 대상으로 하는 도전에 대응하기 위해 두 가지 주요 구성 요소를 활용합니다:

- 오디트드 규칙 삭제 감지: 오디트드에 의해 기록된 감사 레코드 유형(예: CONFIG_CHANGE)을 활용하여 오디트드 규칙의 삭제를 감지하는 모니터링을 구현할 것입니다. 이러한 레코드 유형은 규칙 삭제의 내장 로깅을 제공하여 시스템 보안을 저해할 수 있는 미승인 변경을 사전에 식별하고 대응할 수 있도록 합니다.
- 오디트드 구성 및 중요 파일 변경 모니터링: 중요한 오디트드 구성 변경을 모니터링하기 위해 새로운 오디트드 규칙을 구현할 것입니다. 이러한 규칙은 필수적인 구성 파일의 수정 또는 삭제를 캡처하여 언제든지 미승인 변경이 즉각적으로 조사 대상으로 표시되도록 보장합니다.

## 로그 활동 이해하기

<div class="content-ad"></div>

auditd는 감사 시스템 구성 변경 시 CONFIG_CHANGE 이벤트를 기록합니다. 이는 감사 규칙을 포함한 구성 변경이 있을 때 발생합니다. 이 레코드 유형은 수정의 타임스탬프와 성격과 같은 세부 정보를 캡처하여 감사 규칙의 무단 삭제를 모니터링하고 감지하는 데 이상적입니다.

![Image](/assets/img/2024-06-22-ImpairDefensesT1562012DetectLinuxAuditLogsTamperingPart2_1.png)

## 로그 검토

감사 규칙 삭제를 감지하기 위한 상관 검색을 확인하기 위해 먼저 Splunk에서 필요한 로그를 생성하기 위해 규칙 삭제 시뮬레이션을 수행했습니다.

<div class="content-ad"></div>

여기서 패턴을 찾기 매우 쉽습니다. type=CONFIG_CHANGE 및 op=remove_rule을 찾아야 합니다.

![이미지](/assets/img/2024-06-22-ImpairDefensesT1562012DetectLinuxAuditLogsTamperingPart2_2.png)

# Splunk에서 오디트된 규칙 삭제 감지 개발

## 설명:

<div class="content-ad"></div>

**검색 기준 (index, sourcetype, type, op, res):**

- linux_audit 인덱스에서 type이 CONFIG_CHANGE이고 op이 remove_rule이며 res가 1인 linux:audit 이벤트를 검색합니다. (성공을 나타냄)

**필드 평가 (eval key):**

- key가 "(null)"인 경우 key를 "unknown"으로 설정하여 필드 일관성을 보장합니다.

<div class="content-ad"></div>

3. 집계 (통계 값(key) AS deleted_rules):

   - _time, host, type, auid, ses 및 op에 따라 이벤트를 집계하고, 삭제된 auditd 규칙의 모든 key 값(이름)을 deleted_rules로 모음.

4. 시간 변환 (convert ctime(_time)):

   - _time의 Unix 타임스탬프를 사람이 읽을 수 있는 날짜 및 시간 형식으로 변환합니다.

<div class="content-ad"></div>

5. 삭제된 규칙 수 세기 (eval count=mvcount(deleted_rules)):

- 삭제된 규칙 발생 횟수를 세줍니다.

6. 이벤트 설명 (eval event_info):

- 삭제된 규칙의 개수를 기반으로 event_info를 구성합니다.
- 삭제된 auditd 규칙의 수와 타임스탬프를 지정합니다.
- 규칙 삭제의 예기치 못한 성격으로 인해 조사를 권장합니다.

<div class="content-ad"></div>

7. 최종 결과 (표 _time, 호스트, 유형, auid, ses, 작업, deleted_rules, 이벤트_정보):

- 타임스탬프(_time), 호스트, 이벤트 유형 (유형), 감사 사용자 ID (auid), 세션 ID (ses), 작업 (op), 삭제된 규칙 (deleted_rules) 및 이벤트 세부정보 (이벤트_정보)를 포함한 구조화된 테이블 형식으로 결과를 제시합니다.

# auditd 구성 수정/삭제를 모니터링하기 위한 탐지 개발

## 단계 1: 구성 수정을 모니터링하기 위한 auditd 규칙 생성

<div class="content-ad"></div>

설정 중인 auditd 규칙은 Linux 감사 인프라에 필수적인 핵심 구성 파일을 모니터링하기 위해 전략적으로 설계되었습니다. 이러한 파일에는 /etc/audit/auditd.conf, /etc/audit/rules.d/test.rules, /etc/audisp/audispd.conf 및 /etc/libaudit.conf이 포함됩니다. 각각이 중요한 이유는 다음과 같습니다:

- /etc/audit/auditd.conf: 감사 데몬 (auditd)의 전역 설정을 제어하며 로그 위치, 보존 정책 및 시스템 전체 감사 구성을 포함합니다.
- /etc/audit/rules.d/test.rules: 특정 이벤트 및 조건을 정의하는 감사 규칙을 포함합니다.
- /etc/audisp/audispd.conf: 감사 이벤트 디스패처 (audispd)를 구성하며 감사 이벤트를 처리하고 전달하는 역할을 담당합니다.
- /etc/libaudit.conf: 감사 프레임워크 (libaudit)의 라이브러리 수준 설정을 관리하며 그 동작과 기능성에 영향을 줍니다.

<img src="/assets/img/2024-06-22-ImpairDefensesT1562012DetectLinuxAuditLogsTamperingPart2_3.png" />

이 auditd 규칙의 논리는 다른 설정 파일 간에 일관성을 유지합니다:

<div class="content-ad"></div>

- 각 규칙은 관련 작업이 발생할 때마다 감사 이벤트가 생성되도록 항상 -a를 사용합니다.
- 모두 -F path=를 지정하여 감시되는 특정 구성 파일의 경로를 정의합니다.
- -F perm=wa는 쓰기(w) 및 속성 변경(a) 권한에 대해 이벤트가 트리거되도록 지정합니다.
- -F success=1은 작업이 성공했을 때에만 이벤트가 기록되도록 합니다.
- -k 매개변수는 auditd 규칙의 이름을 지정합니다.
- 차이점은 지정된 경로(-F path=)에만 있으며, 다른 구성 파일(/etc/audit/auditd.conf, /etc/audit/rules.d/test.rules, /etc/audisp/audispd.conf, /etc/libaudit.conf)을 가리킵니다.

구성 파일을 모니터링하기 위해 auditd 규칙을 구성하면 감지된 모든 수정 사항에 대한 로그가 생성됩니다. 이러한 로그는 Splunk에서 침입 탐지 규칙을 생성하기 위한 입력으로 사용됩니다.

이러한 감사 로그를 상호 연관시키고 분석함으로써 Splunk는 무단 변경에 대한 예방적인 모니터링 및 경고를 제공합니다.

## 단계 2: Splunk에서 상호 연관 검색 개발

<div class="content-ad"></div>

새 감사 규칙을 테스트하여 auditd.conf에 다양한 수정 사항을 시뮬레이션하여 올바르게 작동하는지 확인했습니다.

첫 번째 테스트에서는 rm 명령어를 사용하여 auditd.conf를 삭제하는 것을 포함했습니다. 두 번째 테스트에서는 설정 파일을 다른 디렉토리로 이동하고, 세 번째 테스트에서는 vim 텍스트 편집기를 사용하여 수정했습니다.

## 설명:

- 검색 기준 (인덱스, 소스 유형, 유형, 키):

<div class="content-ad"></div>

- linux_audit 인덱스에서 linux:audit 소스 유형 및 type이 SYSCALL인 이벤트를 검색합니다.
- 키 필드가 생성한 특정 감사 규칙 (auditrule_modification, auditd_conf_modification, audispd_conf_modification, libauditd_conf_modification) 중 하나와 일치하는 이벤트를 필터링합니다.

2. 집계 (transaction host maxpause=1s):

- 1초 시간 간격 내(최대 일시 중지 = 1초) 동일 호스트에서 연속된 이벤트 (SYSCALL 항목)를 그룹화합니다.
- 이 집계는 위협 행위자의 특정 작업에 대한 추가 컨텍스트를 제공할 수 있는 시스템 호출 순서를 분석하는 데 도움이 됩니다.

3. 통계 요약 (stats count by _time, host, key, comm, exe, uid, gid, _raw):

<div class="content-ad"></div>

- 다양한 필드별로 그룹화된 카운트를 계산합니다: _time (타임스탬프), host (컴퓨터 이름), key (감사 키), comm (명령어 이름), exe (실행 파일 경로), uid (사용자 ID), gid (그룹 ID) 및 _raw (원시 로그 항목). 이 요약은 트랜잭션 내에서 이러한 속성의 각 고유한 조합의 빈도수를 나타냅니다.

## SYSCALL 이벤트의 중요 역할

SYSCALLs (시스템 콜)은 Linux 시스템의 감사 로그 내에서 이벤트를 탐지하고 이해하는 데 중요한 역할을 합니다. 이것이 어떻게 이벤트 탐지에 기여하는지 살펴보겠습니다:

기본 시스템 작업: SYSCALLs는 Linux 시스템에서 프로세스가 수행하는 기본 작업을 나타내기 때문에 필수적입니다. 이러한 작업에는 파일 시스템 접근 (예: open, read, write, unlink), 프로세스 관리 (예: fork, execve, exit), 그리고 네트워크 통신 (예: socket, connect, sendmsg)이 포함됩니다.

<div class="content-ad"></div>

Audit Logging: Linux 시스템은 SYSCALL 이벤트를 기록하기 위해 감사 메커니즘을 사용합니다. 감사 로그에 기록된 각 SYSCALL 이벤트에는 작업 유형 (시스템 호출), 성공 또는 실패 여부 (성공=yes/no), 관련된 프로세스 ID (pid, ppid), 사용자 및 그룹 ID (uid, gid), 그리고 실행 가능한 경로 (exe)와 같은 세부 정보가 포함됩니다.

## Raw Log Entry 분석:

- type=SYSCALL: 로그 항목이 시스템 호출 이벤트와 관련되어 있음을 나타냅니다.
- msg=audit(1715771488.665:75612745): 감사 이벤트의 타임스탬프 및 일련 번호.
- syscall=263: 시스템 호출 번호를 지정합니다.
- success=yes: 시스템 호출이 성공했음을 나타냅니다 (yes).
- a0, a1, a2, a3: 감사 로그 항목의 이 필드는 시스템 호출 (syscall=263) 실행 시 전달된 인수 (a0부터 a3)를 나타냅니다. 이들은 시스템 호출 작업에 대한 구체적인 세부 정보를 제공합니다.
- exit=0: 시스템 호출의 종료 상태 (0은 성공을 나타냅니다).
- auid=*****: 감사 사용자 ID.
- uid=0, gid=0, euid=0, suid=0, fsuid=0, egid=0, sgid=0, fsgid=0: 프로세스와 관련된 사용자 및 그룹 ID (사용자 ID에 대한 uid 및 그룹 ID에 대한 gid).
- comm=”rm”: 프로세스에 의해 실행된 명령 이름 (이 경우 'rm').
- exe=”/usr/bin/rm”: 명령과 관련된 실행 가능 경로 (/usr/bin/rm).
- key=”auditd_conf_modification”: 이 이벤트와 관련된 감사 키를 식별합니다 (auditd_conf_modification은 감사 구성에 관련된 수정을 나타냅니다).

## 결론

<div class="content-ad"></div>

리눅스 감사 로그 변조를 탐지하는 이 두 부작에서는 auditd 규칙과 구성의 무결성을 보호하는 필수 전략을 탐구했습니다. 우선, 우리는 보안 모니터링에서의 auditd의 중요 역할과 악의적인 변조에 대한 취약성을 강조했습니다. 이를 통해 auditd 규칙의 삭제와 구성 변경을 탐지하는 것에 중점을 두었는데, 이는 견고한 보안 관행을 유지하는 데 중요합니다.

auditd 규칙과 Splunk 쿼리를 활용한 실용적인 구현을 통해 무단 수정을 모니터링하고 감지하는 효과적인 방법을 시연했습니다. CONFIG_CHANGE 및 SYSCALL과 같은 audit 레코드 유형을 활용하여 의심스러운 활동을 신속하게 식별할 수 있는 탐지 메커니즘을 개발했습니다. 이러한 노력은 사건 대응과 규정 준수에 중요한 감사 로그의 신뢰성을 보장합니다.

## 다음 단계:

앞으로의 다음 단계는:

<div class="content-ad"></div>

- 지속적 모니터링: auditd 규칙과 설정을 계속 모니터링하여 향후 무단 변경을 감지합니다.
- 향상된 경보 설정: Splunk에서 경보 메커니즘을 세밀하게 조정하여 auditd와 관련된 수상한 활동에 대한 실시간 알림을 제공합니다.
- 사고 대응 준비: 신속하게 수사할 수 있도록 사고 조치를 준비하고 식별된 보안 위반 사항에 대해 대응합니다.
- 주기적 검토: 진화하는 보안 위협과 조직적 요구에 적응하기 위해 auditd 설정과 규칙을 정기적으로 검토하고 업데이트합니다.

이러한 실천 방법을 보안 운영에 통합함으로써 Linux 환경의 변경 방지 방어를 강화하고 효과적인 보안 모니터링과 규정 준수를 보장할 수 있습니다.

Aleksandar Matev 작성