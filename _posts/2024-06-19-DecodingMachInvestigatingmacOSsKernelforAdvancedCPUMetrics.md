---
title: "맥 해독하기 macOS 커널에서 고급 CPU 메트릭스 조사하기"
description: ""
coverImage: "/assets/img/2024-06-19-DecodingMachInvestigatingmacOSsKernelforAdvancedCPUMetrics_0.png"
date: 2024-06-19 08:54
ogImage: 
  url: /assets/img/2024-06-19-DecodingMachInvestigatingmacOSsKernelforAdvancedCPUMetrics_0.png
tag: Tech
originalTitle: "Decoding Mach: Investigating macOS’s Kernel for Advanced CPU Metrics"
link: "https://medium.com/@federicosauter/decoding-mach-investigating-macoss-kernel-for-advanced-cpu-metrics-6627bf5429a4"
---


<img src="/assets/img/2024-06-19-DecodingMachInvestigatingmacOSsKernelforAdvancedCPUMetrics_0.png" />

우리의 지난 탐험에서는 인텔과 애플 실리콘 간 CPU 사용량 차이에 대해 표면을 긁었습니다. 이제는 더 깊이 파고들어볼 시간입니다. macOS 커널은 CPU 사용량을 어떻게 추적하고, 다른 커널 서브시스템들이 시간 기록에 대해 어떤 가정을 하는지 살펴봅니다. 본 글은 Mach 리카운트 서브시스템으로 빠져들어, CPU 시간의 매 틱이 면밀하게 기록되는 과정을 안내합니다.

외부에서 커널 밖에서 CPU 부하를 정확히 결정하는 것은 불가능하다는 것을 이해한 뒤, 서로 다른 CPU 코어가 서로 다른 속도로 동작한다는 점에서 좋은 근사치를 찾겠다는 다짐을 하였습니다. 결국, 우리는 시스템 문제 진단을 제공하고 정확한 시스템 사용 보고서를 제공하는 대신에 도움을 제공해야 합니다.

proc_pidinfo(PROC_PIDTASKINFO) 시스템 호출을 통해 프로세스별 CPU 시간 사용량을 사용할 수 있게 되었는데, 우리가 찾고 있는 것은 전체 시스템에서 (유휴 시간 포함) 사용된 CPU 시간을 결정하여 프로세스별 비율을 수립하는 방법입니다.

<div class="content-ad"></div>

# 초기 접근 방식: host_process_info 메트릭 값을 합산하기

일반적으로 가장 명백한 해결책을 먼저 시도하고, 그 후에 이를 발전시키는 편입니다. 이 경우, host_process_info() API는 이미 각 프로세서별 전체 CPU 부하를 반환하며, 여기에 idle 시간이 포함되어 있기 때문에 이를 합산하는 것은 각 프로세스를 측정할 기준을 결정하는 명백한 방법일 수 있습니다.

그러나 결과를 보고 실망했습니다: 테스트 프로세스를 설정하여 전체 CPU 시간의 약 10%를 사용하도록 하였으나, 이 방법을 따르면 보고된 사용량이 약 0.01%와 같은 수준으로 표시되었습니다. 결과에 일정한 배수를 곱하면 일부 결과가 더 좋아지지만, 유감스럽게도 동일한 배수로 모든 결과를 의미 있게 변환할 수 없었습니다.

점점 더 가까워지는 기분이었습니다. 이러한 차이로 인해 처음에 host_process_info()와 proc_pidinfo API에서 사용되는 시간 단위에 차이가 있을 수 있다고 생각하게 되었습니다. 내 관찰 아래에 정확히 무엇이 있는지 알아보기 위해, 시스템 질문에 대한 모든 답을 찾을 수 있는 유일한 장소인 케널 소스로 의존하게 되었습니다.

<div class="content-ad"></div>

# 유일한 진실의 근원

리눅스를 기반으로 한 네트워크 보안 장치를 개발하던 시절, 리눅스 네트워킹 구현을 이해하기 위한 책을 추천해 줄 수 있느냐고 동료에게 물어보았어요. 그때 동료가 한 말을 절대로 잊지 못할 거예요: 왜 구식 책을 사서 읽느냐고 할 때, 커널 소스로부터 가장 정확한 답변을 받을 수 있는데?

그 이후로는 언제나 코드베이스에 접근하는 방식이 바뀌었어요.

커널 소스에 내 질문에 대한 답변이 반드시 포함되어 있을 것이라고 확신을 가지고, 이 버그를 최종적으로 해결하기로 결심했어요.

<div class="content-ad"></div>

## 올바른 질문하기

커널 소스를 연구하기 전에 항상 답변하고자하는 구체적인 질문을 생각해냅니다. 이러한 질문들을 프로그램이라는 복잡한 운영 체제 커널을 특징 짓는 지나치게 많은 세부 사항을 탐색하는 데 도움이 되는 지도로 생각하세요.

host_process_info()와 proc_pidinfo(PROC_PIDTASKINFO)은 아마도 서로 다른 시간 단위를 사용할 것으로 의심했기 때문에 아직 찾아야 할 것이 있었습니다:

- 각 API가 사용하는 시간 단위는 무엇인가요?
- 이러한 시간 단위를 서로 변환하는 방법은 무엇인가요?

<div class="content-ad"></div>

세부적으로 각 API를 살펴보기 전에 Mach 커널이 리소스 회계를 수행하는 방법을 이해하려면 우회해야 합니다.

# Mach 재계산 서브시스템

작업 리소스 사용에 대한 카운터를 유지하는 Mach 커널의 일부는 재계산(Recount)이라고 합니다. recount_context_switch() 함수는 문맥 전환이 발생할 때 호출되며 현재 실행 중인 작업에 대한 사용량 카운터를 업데이트하는 역할을 합니다.

재계산 서브시스템은 다른 리소스 유형에 대해 서로 다른 세분도를 사용하며, 청소 및 메모리 사용의 효율성 사이의 균형을 유지합니다.

<div class="content-ad"></div>

저는 당신의 조사와 관련된 사안으로, Recount 이름이 곧 커널 소스에 나타날 것임을 확인했습니다.

# 첫 번째 정착지: proc_pidinfo

proc_pidinfo API를 살펴보면서 시작했습니다. 이 API는 단일 프로세스가 사용한 CPU 시간을 보고합니다.

해당 함수를 검색하고 스택 추적을 따라가 보니, fill_taskprocinfo 함수가 Mach 커널에서 작업 정보를 획득하고 보고하는데 궁극적으로 관여하고 있음을 알 수 있었습니다. task_info 속성인 pti_total_system과 pti_total_user를 거슬러 올라가면 proc_pidinfo() API와 Mach Recount 서브시스템 사이의 관련성이 드러납니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-DecodingMachInvestigatingmacOSsKernelforAdvancedCPUMetrics_1.png)

해설: fill_taskprocinfo 함수에서 이 코드 조각은 CPU 시간 정보를 수집하는 방법을 보여줍니다. recount_task_times 함수는 작업에 대한 총 시스템 및 사용자 시간을 수집하며, proc_pidinfo API가 CPU 사용량을 보고하는 방법을 이해하는 데 중요합니다.

recount_task_times()로 호출 스택을 따라가면, 최종적으로 집계되는 필드는 rt_usage라는 것을 알 수 있습니다:

![이미지](/assets/img/2024-06-19-DecodingMachInvestigatingmacOSsKernelforAdvancedCPUMetrics_2.png)


<div class="content-ad"></div>

설명: recount_usage 구조는 Mach 시간 단위에서 사용자 및 시스템 시간을 구체적으로 유지하는 CPU 사용 메트릭을 저장합니다. 이를 통해 proc_pidinfo API가 CPU 시간을 어떻게 검색하고 보고하는지 이해할 수 있습니다.

저는 recount_usage 구조의 필드가 동일한 접미사(_time_mach)를 가지고 있는 것을 발견했습니다. 이는 사용된 시간 단위에 대한 초기 힌트로 이해했습니다.

# 다음 정거장: host_process_info

host_process_info() 함수는 각 CPU 코어가 사용한 전체 CPU 시간을 보고합니다. processor_cpu_load_info() 함수가 이 정보를 보고하는 데 책임이 있다는 것을 알아보는 데 시간이 오래 걸리지 않습니다.

<div class="content-ad"></div>



![이미지](/assets/img/2024-06-19-DecodingMachInvestigatingmacOSsKernelforAdvancedCPUMetrics_3.png)

설명: 이 함수에서는 recount_processor_usage가 Mach 시간의 CPU 사용률 데이터를 제공하고, hz_tick_interval을 사용하여 해당 데이터를 틱으로 변환합니다. 이 변환 단계는 서로 다른 API 간에 CPU 시간 보고에 대한 불일치를 이해하는 데 중요합니다.

이것은 host_process_info와 Mach Recount 서브시스템 간의 연결이고, Recount로부터 얻은 지표가 Mach 시간으로 보고되며 반환되기 전에 상수 요소 hz_tick_interval로 나눠진다는 사실이 더 중요합니다.

저는 실험 중에 이전에 관찰했던 내용이 변환 시간 단위 사이에 상수 요소가 포함되어 있다는 명백한 확인을 발견해서 기뻤습니다.


<div class="content-ad"></div>

이를 통해 proc_pidinfo API가 Mach 시간 단위로 CPU 사용량을 반환하고 host_process_info API가 대신 틱을 사용한다는 것을 알았습니다. 두 단위는 hz_tick_interval 요소를 사용하여 변환할 수 있습니다. 즉, hz_tick_interval 값을 결정할 수 있다면 두 시간 단위를 변환하고 버그를 해결할 수 있을 것입니다.

그러므로, 다음으로 해야 할 당연한 단계는 hz_tick_interval 값을 찾는 것입니다.

## hz_tick_interval 역추적

안타깝게도 hz_tick_interval은 사용자 공간에서 접근할 수 없습니다. 빠른 해결책에 대한 희망이 사라졌지만, 최소한 값을 가져와서 아이디어가 유효한지 확인할 수 있다면 좋겠습니다.

<div class="content-ad"></div>

이 상수를 찾는 것은 커널의 어느 부분이 관련되느냐에 따라 달랜 시간 기록 가정들의 미로에 들어간 것 같았습니다. 예를 들어, hz_tick_interval의 정의를 보며 BSD 부분에서 틱이 10ms를 나타내는 것으로 예상한다는 코멘트를 보았습니다. 이것이 서로 다른 API에서 서로 다른 시간 단위가 사용되는 이유일 것입니다.

사용할 수 있는 변환 루틴을 찾아보았습니다. 궁극적으로는 사용자 공간에서 접근할 수 없는 rtclock_sec_divisor 상수인 것 같습니다. 이 값은 부트로더가 시스템 부팅 시 채우는 것입니다. 따라서, 제 가정을 수동으로 확인하기 위해 이 값을 설정하는 것은 성공하지 못했습니다.

이 값을 제공할 것으로 예상했던 사용자 공간 API인 mach_timebase_info가 실제로는 기대한 결과를 제공하지 않았습니다. 따라서 다시 한 번 원점으로 돌아간 것 같은 느낌이 들었습니다!

proc_pidinfo와 host_process_info 간의 시간 단위 불일치를 추적하는 것은 도전적이지만 유익한 여정이었습니다. Mach Recount 하위 시스템을 면밀히 살펴보고 macOS에서의 CPU 시간 보고 복잡성을 밝혀냈습니다. 문제의 근원을 이해했지만, 사용자 공간에서 hz_tick_interval에 접근할 수 없어 해결책을 찾는 것이 쉽지 않습니다. 그러나 이 도전은 끝이 아니라 혁신적인 해결책을 찾을 기회입니다. 다음 부분에서 이러한 시간 단위를 변환하고 정확한 CPU 메트릭을 보장하는 방법을 탐색할 것입니다. 더 많은 통찰과 실용적인 응용 프로그램을 기대해 주세요!