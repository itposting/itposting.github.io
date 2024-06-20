---
title: "마법같은 메이지 글로벌 후크의 마법을 풀어보세요"
description: ""
coverImage: "/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_0.png"
date: 2024-06-20 15:39
ogImage: 
  url: /assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_0.png
tag: Tech
originalTitle: "Unleash the Magic of Mage Global Hooks"
link: "https://medium.com/mage-ai/unleash-the-magic-of-mage-global-hooks-9fee3375f07a"
---



![Global hooks in Mage](/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_0.png)

# TLDR

Mage의 글로벌 훅은 API 작업 앞뒤에서 사용자 정의 코드를 실행할 수 있는 강력한 기능입니다. 이를 통해 응용 프로그램의 다양한 구성 요소 간에 기능을 확장하거나 외부 시스템과 통합하거나 데이터를 유효성 검사하는 유연성을 제공합니다. 대상 조건과 비동기 실행을 통해, 글로벌 훅은 세밀한 제어와 성능 최적화를 제공합니다.

![Global hooks GIF](https://miro.medium.com/v2/resize:fit:1400/1*OirhBHxPRCvHwConOgnGgQ.gif)


<div class="content-ad"></div>

# 개요

- 글로벌 훅이란?
- 왜 글로벌 훅을 사용해야 하나요?
- 글로벌 훅 생성하기
- 결론

# 글로벌 훅이란?

매지(Mage)의 글로벌 훅은 애플리케이션 실행 주기 중 특정 시점에 사용자 정의 코드를 실행할 수 있는 강력한 기능입니다. 이 훅은 데이터 유효성 검사, 변환 또는 외부 시스템과의 통합과 같은 다양한 작업을 수행하는 데 사용할 수 있습니다. 글로벌 훅은 반복적인 작업을 자동화하거나 애플리케이션의 여러 구성 요소에 걸쳐 특정 비즈니스 규칙을 강제 적용해야 할 때 특히 유용합니다.

<div class="content-ad"></div>

메이지(Mage)의 글로벌 훅(Global Hooks)은 파이프라인 실행 중 두 가지 다른 시점에서 트리거될 수 있습니다:

- 블록 완료 전(pre-completion of a Block): 해당 훅은 파이프라인의 특정 블록이 실행되기 전에 실행됩니다. 이를 통해 해당 블록이 데이터를 처리하기 전에 데이터 유효성 검사, 변환 또는 데이터 풍부화와 같은 작업을 수행할 수 있습니다.
- 블록 완료 후(post-completion of a Block): 해당 훅은 파이프라인의 특정 블록 실행이 완료된 후에 실행됩니다. 이를 통해 해당 블록의 출력을 기반으로 외부 시스템 통합, 로깅, 감사 또는 하류 프로세스 트리거와 같은 작업을 수행할 수 있습니다.

이 두 실행 지점을 활용하여, 글로벌 훅(Global Hooks)은 데이터 파이프라인의 기능을 확장하는 유연한 방법을 제공합니다. 특정 요구 사항에 따라 블록 실행 전후에 사용자 정의 코드를 실행할 수 있습니다.

<div class="content-ad"></div>

# 전역 후크의 필요성은 무엇인가요?

개발자들에게 전역 후크는 애플리케이션의 기능을 확장하는 강력하고 유연한 방법을 제공하여 코드 재사용과 유지 보수성을 증진시킵니다. 특정 지점에서 사용자 정의 코드의 실행을 허용함으로써, 전역 후크는 다른 구성 요소 사이에서 반복적으로 동일한 논리를 수동으로 구현해야 하는 문제를 해결합니다. 이 중앙 집중식 접근 방식은 시간과 노력을 절약해주며, 일관성을 유지하고 개발자가 핵심 응용프로그램 논리에 집중할 수 있게 하면서 로깅, 보안 또는 외부 시스템 통합과 같은 사업을 가로지르는 문제를 쉽게 통합할 수 있도록 지원합니다.

전역 후크는 여러 구성 요소나 모듈에 걸쳐 있는 로깅, 오류 처리, 인증 및 권한 부여와 같은 사업을 가로지르는 문제를 구현하는 데 유용할 수 있습니다. 또한, 중앙 집중점을 제공함으로써 외부 서비스나 API와의 통합을 용이하게 할 수 있습니다. 게다가, 전역 후크는 애플리케이션 내에서 비즈니스 규칙, 데이터 유효성 검사 및 변환 논리를 일관되게 강화할 수 있습니다. 많은 구성 요소와 데이터 흐름이 있는 복잡한 애플리케이션의 경우, 전역 후크는 공유 기능을 캡슐화함으로써 코드 재사용과 유지 보수성을 증진시킬 수 있습니다.

후크를 만들기 전에, 개발자들은 전역 후크 설정을 켜놓았는지 확인해야 합니다. Mage Project Overview 페이지에서 왼쪽 탐색 메뉴에서 설정을 선택하십시오. 설정 페이지에 들어가서 전역 후크를 켭니다.

<div class="content-ad"></div>

![마법의 마법을 발휘하라](/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_1.png)

# 훅 만들기

만약 여러분이 팀 내에서 다양한 파이프라인을 소유하고 있고, 파이프라인 이름에 우리의 이니셜을 접두어로 쓰고 싶어서 쉽게 식별할 수 있도록 하고 싶다면 어떻게 해야 할까요?

- 먼저 mage를 열고 새 파이프라인을 만드세요
- mage가 없다면 시작하는 방법에 대한 문서를 확인하세요
- 파이프라인 편집기 페이지에 들어간 후, 아래 그림과 같이 데이터 로더 블록을 선택한 후, 파이썬 위에 마우스를 올리고 일반 (템플릿 없음) 옵션을 클릭하세요

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_2.png" />

- 해당 블록이 로드되면 내용을 삭제한 뒤 아래 코드를 추가해 주세요.

```js
import os
from datetime import datetime

from mage_ai.settings.repo import get_repo_path

@data_loader
def load_data(*args, **kwargs):
    with open(os.path.join(get_repo_path(), f'ping_{datetime.utcnow().timestamp()}'), 'w') as f:
        f.write('')

    payload = kwargs.get('payload', {})
    name = payload.get('name')

    payload['name'] = f'cff_{name}'

    return payload
```

- 접두사 'cff'를 본인의 이니셜로 바꾸거나 코드를 그대로 둘 수 있습니다.
- Shift + Enter를 눌러 블록을 실행하세요 (블록은 `본인의 이니셜_None`을 반환해야 합니다).

<div class="content-ad"></div>

Mage는 개발자들이 대부분의 요구 사항을 선택하거나 전환할 수 있는 사용하기 쉬운 Global Hooks 사용자 인터페이스를 개발했습니다. 주요 파이프라인 페이지의 왼쪽 네비게이션 팝업에서 글로벌 후크를 선택하여 Global Hooks UI로 이동해 봅시다.

- + 새 글로벌 후크 추가 선택
- Global Hooks UI로 이동하면 후크에 고유한 이름, 리소스 유형 및 작업 유형을 생성하세요.
- 각 후크에는 Mage의 API 호출인 리소스 유형을 선택해야 합니다. 파이프라인 리소스를 선택하면 후크가 파이프라인 API 호출에 영향을 미칩니다.
- 새 파이프라인을 만들 때도 이 후크를 사용하므로 작업 유형을 만들기로 선택합니다.

![이미지](/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_3.png)

- 위에서 언급한 대로 후크는 작업이 시작되기 전이나 후에 실행됩니다. 이 경우 파이프라인 이름 앞에 이니셜을 삽입하면 작업이 시작되기 전에 실행됩니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_4.png)

- 다음으로 실행 드롭다운을 클릭하고 후크를 위해 파이프라인을 선택하세요.
- 후크의 스냅샷을 생성하려면 '스냅샷 업데이트' 버튼을 클릭하세요. 스냅샷이 유효할 때 개발자들은 초록색 스냅샷 유효 표시를 볼 수 있습니다.

![이미지](/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_5.png)

- 프로젝트에서 블록 이름으로 데이터를 추출할 블록을 추가하세요.
- 병합될 데이터의 출력 유형을 선택하세요.
- 마지막으로 화면 하단의 '변경 사항 저장'을 클릭하여 후크를 저장하세요.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_6.png" />

- 이제 파이프라인 생성 페이지로 이동하여 + 새로 만들기 버튼을 클릭하세요.
- 파이프라인을 위한 새로운 이름을 입력하세요.
- 생성을 클릭하세요.

<img src="/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_7.png" />

위에서 안내한 대로 Global Hook을 구성했다면, 데이터 로더 블록에서 제공한 이니셜로 모든 파이프라인 이름이 시작됨을 확인할 수 있을 것입니다. 회사는 파이프라인을 생성하고 소유하는 개발자들이 쉽게 파이프라인을 찾을 수 있도록 명명 규칙을 만들 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-UnleashtheMagicofMageGlobalHooks_8.png)

# 결론

마지막으로, 글로벌 후크는 개발자들에게 애플리케이션을 강화하고 사용자 정의 기능을 원활하게 통합할 수 있는 유연하고 확장 가능한 기능을 제공하는 강력한 기능입니다. 사용자 정의 코드를 애플리케이션 라이프사이클의 특정 시점에서 실행할 수 있도록 허용함으로써, 글로벌 후크는 코드 중복, 교차 관심사 및 외부 시스템 통합과 같은 일반적인 문제를 해결합니다. 데이터 유효성 검사 및 변환부터 로깅 및 모니터링까지, 글로벌 후크는 개발자가 프로젝트 전반에 걸쳐 일관되게 다양한 사용 사례를 실행할 수 있도록 합니다. 또한, 특정 구성 요소를 대상으로 하거나 비동기 실행과 같은 기능은 세밀한 제어와 성능 최적화를 제공합니다. Mage의 글로벌 후크에 대한 자세한 정보는 문서를 참조하십시오.
