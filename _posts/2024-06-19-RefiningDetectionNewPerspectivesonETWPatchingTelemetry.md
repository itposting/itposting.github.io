---
title: "탐지 개선 ETW 패치 텔레미트리에 대한 새로운 관점"
description: ""
coverImage: "/assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_0.png"
date: 2024-06-19 09:11
ogImage: 
  url: /assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_0.png
tag: Tech
originalTitle: "Refining Detection: New Perspectives on ETW Patching Telemetry"
link: "https://medium.com/@jsecurity101/refining-detection-new-perspectives-on-etw-patching-telemetry-e6c94e55a9ad"
---


# 소개

얼마 전에 'ETW 패치 이해하기'라는 블로그를 썼는데, 그 글에서 ETW 패칭이 함수 패치의 초고도 버전이라는 내용을 설명했어. Defenders 부분에서는 프로세스 내에서 공급자 DLL이 로드되었지만 ETW 이벤트가 발생하지 않는 걸 볼 수 있는 방법에 대해 언급했어. 이 방법은 특정 공급자에 대해서만 작동해서 좋은 방법은 아니야. 이 초기 생각에 대해 더 알고 싶다면 [요 트윗](링크)을 참조해봐. 그 이후로 좀 더 깊게 파보았고, 이번 글에서는 이 접근 방식에 대해 이야기할 거야.

# 로컬 ETW 패칭

이전 글에서 언급했듯이, 이벤트 발생을 막는 일반적인 방법 중 하나는 ntdll 함수인 특히 EtwEventWrite 또는 NtTraceEvent에 초점을 맞추는 것이야. 이를 수행하는 단계는 다음과 같아:

<div class="content-ad"></div>

- DLL 로딩: 이미 로드되지 않은 경우, 함수를 패치하고 싶은 DLL을 로드하세요.
- 함수 포인터 획득: 원하는 함수에 대한 함수 포인터를 가져오세요.
- 메모리 보호 변경: 쓰기 액세스를 허용하기 위해 메모리 영역의 보호 값을 변경하세요.
- 패치 적용: 패치를 작성하세요.
- 메모리 보호 복원: 선택적으로, 메모리 영역의 보호 값을 원래 설정으로 돌려놓으세요.

원하는 함수에 대한 함수 포인터를 획들한 후, 이러한 바이트를 임의로 패치할 수 없다는 것을 알 수 있습니다. 각 함수의 메모리 주소의 보호 수준을 먼저 변경해야합니다. 이러한 함수가 메모리 영역에 대한 쓰기 권한이 있는 경우 가능할 것입니다. 하지만 곧 보게 될 것처럼, 그렇지 않습니다.

메모리 영역은 수행할 수 있는 작업을 제한하는 보호 상수를 가지고 있습니다. 이러한 함수들에 대해서는 해당 메모리 섹션에 쓰기가 지원되지 않음을 볼 수 있습니다. 아래에서 이러한 함수들의 메모리 영역 보호 값이 표시됩니다.

```js
0:012> !vprot ntdll!EtwEventWrite
BaseAddress: 00007ffaafbbf000
AllocationBase: 00007ffaafb90000
AllocationProtect: 00000080 PAGE_EXECUTE_WRITECOPY
RegionSize: 0000000000103000
State: 00001000 MEM_COMMIT
Protect: 00000020 PAGE_EXECUTE_READ
Type: 01000000 MEM_IMAGE

0:012> !vprot ntdll!NtTraceEvent
BaseAddress: 00007ffaafc30000
AllocationBase: 00007ffaafb90000
AllocationProtect: 00000080 PAGE_EXECUTE_WRITECOPY
RegionSize: 0000000000092000
State: 00001000 MEM_COMMIT
Protect: 00000020 PAGE_EXECUTE_READ
Type: 01000000 MEM_IMAGE
```

<div class="content-ad"></div>

위의 내용은 코드가 읽히고 실행되지만 작성되지는 않음을 의미합니다. 따라서 이러한 함수 중 하나를 수정할 때 보호 값이 변경되어야 합니다. 일반적으로 PAGE_EXECUTE_READWRITE (0x40/60)로 변경하여 VirtualProtect를 사용합니다. VirtualProtect 작업 이전에 수집된 텔레메트리는 함수 패치의 신뢰할 수 있는 지표가 아닐 수 있습니다. VirtualProtect 작업조차 직접적인 함수 패치를 나타내지는 않습니다. 그러나 VirtualProtect에 대한 텔레메트리 데이터가 있는 경우, 해당 메타데이터에서 함수 패치가 발생했는지 추측하는 데 충분한 맥락을 제공할 수 있습니다.

ETW 위협 인텔리전스 프로바이더 내에는 THREATINT_PROTECTVM_LOCAL (EID: 7)라는 이벤트가 있습니다. 이 이벤트는 VirtualProtect가 로컬에서 수행될 때 텔레메트리 정보를 제공하는 것으로 보입니다. TelemetrySource 프로젝트를 살펴보거나 EtwInspector를 실행하여 이를 확인할 수 있습니다:

![이미지](/assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_0.png)

더 깊이 조사한 결과로 메모리 영역의 보호 수준을 변경하는 경우에 대한 이벤트가 있음을 확인할 수 있습니다.

<div class="content-ad"></div>

사전 패치: 보호 값이 PAGE_EXECUTE_READ(0x20)에서 PAGE_EXECUTE_READWRITE(0x40)로 변경되었습니다.

![이미지](/assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_1.png)

이 이벤트에는 몇 가지 귀중한 정보가 있습니다:

- BaseAddress — 보호 값이 변경된 메모리 주소입니다.
- RegionSize Value — 2. 여기서는 보호가 변경된 바이트가 2개임을 보여줍니다. 이것은 보통 4096 또는 그 이상인데, 이 값이 낮은 것이 불통입니다. 또 내용을 찾아보니 이 값이 (0xc3, 0x00)으로 변경되었을 때이며 이 값은 x64 시스템에서 반환값입니다.
- ProtectionMask — 값이 PAGE_EXECUTE_READWRITE로 변경되었음을 나타냅니다.
- Last ProtectionMask — 값이 PAGE_EXECUTE_READ에서 변경되었음을 나타냅니다.
- Callstack — VirtualProtect가 호출된 것을 보여줍니다.

<div class="content-ad"></div>

포스트 패치: 페이지 보호 값을 PAGE_EXECUTE_READWRITE(0x20)에서 PAGE_EXECUTE_READ(0x40)으로 변경합니다.

![이미지](/assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_2.png)

포스트 보호 값이 반드시 이루어질 필요는 없습니다. 그러나 보호 값이 한 값에서 다른 값으로 변경된 시기를 알고 싶어하는 사람이 있다면 좋은 신호입니다. 이는 누군가가 한 값으로 변경한 다음 다시 다른 값으로 바꾸는 것은 매우 이상하다는 것을 의미합니다. 실제로 변경된 바이트를 볼 수 없기 때문에 이것은 잘못된 양성 결과를 방지하는 데 도움이 될 수 있습니다.

이제 아마도 당신은 생각할 것입니다 — 실제 바이트 패치는 어떻게 할까요? 처음에는 WriteProcessMemory 함수가 작동할 것이라고 생각했지만, C 함수를 호출할 때 — memcpy/memmove 함수가 실제로 WriteProcessMemory를 호출하지 않는다는 사실을 깨달았습니다. 원격 패치에 대해 아래에서 계속 탐구할 것입니다.

<div class="content-ad"></div>

# 탐지 아이디어:

- 이벤트 ID 7을 수집합니다: Local Virtual Protect — 초기 ProtectionMask 변경

- 관심 있는 함수들에서 패치된 바이트의 공통 숫자(RegionSize 값)를 찾아보세요. x64/x86의 경우 EtwEventWrite와 같은 함수에서 패치된 바이트의 수는 종종 2입니다. 이는 함수가 실행된 후 반환 값이 패치되기 때문입니다.
- New ProtectionMask가 PAGE_READWRITE (0x04) 또는 PAGE_EXECUTE_READWRITE (0x40)로 열렸을 때를 확인해보세요.

2. 이벤트 ID 7을 수집합니다: Local Virtual Protect — ProtectionMask 복원

<div class="content-ad"></div>

- 누군가가 보호 값을 다시 원래 값으로 변경할 필요는 없지만, 일반적으로 그렇게 하는 것이 좋습니다. 보호 마스크를 더 엄격한 0x20에서 0x40로 변경한 다음 다시 0x20으로 변경되는 것을 보면 꽤 의심스럽습니다. 따라서 동일한 메모리 주소에서 보호 마스크가 계속 왔다갔다 하면 2 EID 7을 검사하는 것이 높은 결과를 얻을 수 있을 것입니다.

# 원격 ETW 패치

원격 패치는 더 드물지만, 듣보잡은 아니며 이에 대한 좋은 프로젝트는 RemotePatcher입니다. 이는 원격 함수 패치를 수행하는 것이 더 위험하기 때문에 감지될 가능성이 높기 때문입니다. memcpy/memmove는 원격 프로세스 내에서 바이트를 쓰는 것을 지원하지 않기 때문에 WriteProcessMemory를 사용해야 하며, RemotePatcher는 patchAMSI 함수에서 이 작업을 수행합니다.

![이미지](/assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_3.png)

<div class="content-ad"></div>

지금, 우리는 NtProtectVirtualMemory가 두 번 호출된 것을 볼 수 있습니다. 한 번은 보호 값을 PAGE_READWRITE(0x04)로 변경하고 다시 원래 값으로 변경하기 위해 호출됩니다. 차이점은 NtWriteVirtualMemory가 호출된다는 것입니다. TelemetrySource 내부에서 event ID 14로 이어진다는 것을 알 수 있습니다. 이것을 살펴보겠습니다:

![이미지](/assets/img/2024-06-19-RefiningDetectionNewPerspectivesonETWPatchingTelemetry_4.png)

위에 표시된 이벤트들이 멋진 점은 원격 프로세스에 액세스한 프로세스가 있고, 메모리 영역의 보호 값을 변경하고 대상 프로세스에 데이터를 쓰고 다시 보호 값을 변경했다는 것이 명백하다는 것입니다. 이러한 연산 순서는 Windows에서 빈번하게 발생하지 않습니다.

# 탐지 아이디어:

<div class="content-ad"></div>

- 이벤트 ID 2를 수집하세요: 원격 가상 보호 — 초기 ProtectionMask 변경

- New ProtectionMask가 PAGE_READWRITE (0x04) 또는 PAGE_EXECUTE_READWRITE (0x40)로 열렸을 때를 찾아보세요.

2. 이벤트 ID 2를 수집하세요: 원격 가상 보호 — ProtectionMask 되돌리기

- 누군가는 보호 값을 원래 값으로 되돌릴 필요는 없지만, 이는 일반적인 관행입니다. 보호 마스크가 0x20처럼 더 많이 잠긴 마스크에서 0x40로 변경되고 다시 0x20으로 돌아가는 것을 보는 것은 상당히 수상합니다. 따라서 동일한 메모리 주소의 보호 마스크가 그렇게 왔다갔다하는 2개의 EID 2를 주시하면 높은 결과를 얻을 수 있을 겁니다.

<div class="content-ad"></div>

3. 이벤트 ID 14를 수집하세요: 프로세스 메모리 쓰기 - 패치용 바이트를 기록

- 이를 원격 VirtualProtect가 메모리 쓰기 전후에 수행되는 상황에서 관찰하는 것은 의심스러울 수 있습니다.
- 이것이 ETW 패칭인지에 대해 분간하기가 어려울 수 있지만, 이것은 어쨌든 프로세스 주입 가시성에 사용될 수 있습니다. 기술적으로 이것은 데이터가 대상 프로세스에 쓰여지기 때문에 프로세스 주입으로 간주될 수 있습니다.

# 결론

이 포스트에서는 ETW 패칭 및 이 활동을 관찰하는 실용적인 접근 방식을 간단히 탐색하고자 했습니다. 로컬 패칭이 원격 패칭보다 훨씬 더 흔합니다. 유감스럽게도, memcpy와 memmove는 WriteProcessMemory를 호출하지 않기 때문에 로컬에서 실제 패치를 식별하는 것은 매우 어렵습니다. 그러나 패치가 발생할 메모리 영역의 보호 마스크에 대한 변경을 감지하는 것은 여전히 좋은 지표로 남아 있습니다.

<div class="content-ad"></div>

이 보호 마스크가 읽기/실행에서 읽기/쓰기/실행으로 변경되는 것은 흔하지 않습니다. 또한, 이러한 이벤트에서 바뀌는 바이트 수는 보통 다른 일반적인 VirtualProtect 이벤트보다 낮습니다. 일반적으로 4096바이트 이상이 관련된 것들이 대부분입니다. RemotePatcher에서 볼 수 있듯이, 누군가가 4096바이트 메모리 영역의 보호 값 변경을 위해 조용히 하는 경우가 있습니다.

만약 이 방식을 구현하고 싶다면, 데이터를 분석하여 연속적으로 여러 작업이 발생하는 패턴을 식별하는 것을 권장합니다. 또한, 공격자가 변경할 수 있는 모든 가능한 보호 값과 함께 쓰기 권한을 포함하는 것들을 모두 살펴보세요. 이 정보가 도움이 되었기를 바랍니다. 아이디어를 공유하거나 질문이 있으면 언제든지 연락 주세요.

Arash Parsa에게 연락해주고 다시 이 주제를 재방문하고 문서화하도록 하도록 도와준 것에 감사드립니다.