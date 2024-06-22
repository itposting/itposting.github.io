---
title: "실시간 통합 기능이 탑재된 Python 대시보드 만들기 "
description: ""
coverImage: "/assets/img/2024-06-22-BeautifuldashboardsinPythonwithfirst-classreal-timeintegration_0.png"
date: 2024-06-22 16:43
ogImage: 
  url: /assets/img/2024-06-22-BeautifuldashboardsinPythonwithfirst-classreal-timeintegration_0.png
tag: Tech
originalTitle: "Beautiful dashboards in Python with first-class real-time integration"
link: "https://medium.com/@deephavendatalabs/beautiful-dashboards-in-python-with-first-class-real-time-integration-cd3a4d9ed807"
---


## deephaven.ui

작성자: Alex Peters

![이미지](/assets/img/2024-06-22-BeautifuldashboardsinPythonwithfirst-classreal-timeintegration_0.png)

파이썬 개발자들은 실시간 데이터 혁명에 준비가 되어 있나요? 가장 일반적인 파이썬 툴킷들 중에는 필수 대시보드 패키지도 포함되어 있지 않습니다. 그래서 우리는 강력한 Deephaven 실시간 데이터 엔진 위에 구축된 실시간 대시보드 라이브러리인 deephaven.ui를 자랑스럽게 소개합니다. 파이썬에서 실시간 대시보드를 만드는 것이 이렇게 쉬워진 적이 없었습니다.

<div class="content-ad"></div>

이 기사에서는 deephaven.ui의 시작을 탐구하고 이를 사용하여 스트리밍 대시보드를 만드는 예제를 제시할 것입니다:

![예시 이미지](https://miro.medium.com/v2/resize:fit:1400/1*4bXAHvIHjwx2tT-X1i27FQ.gif)

# 왜 귀찮게 할까요?

Python과 대시보드는 오랜 시간 동안 함께 해왔습니다. Python 개발자들은 종종 아이디어를 효과적이고 매력적인 방식으로 제시해야 할 필요가 있는데, 그러기 위해 필요한 모든 프론트엔드 기술을 배우는 시간이 부족합니다. Dash, Streamlit, Shiny와 같은 플랫폼은 이 문제에 대한 Pythonic한 해결책으로 등장했습니다. 개발자들은 프론트엔드 지식이 거의 없이 아름다운 대시보드를 만들고 한 번의 클릭으로 넓은 커뮤니티와 자신의 작품을 공유할 수 있습니다.

<div class="content-ad"></div>

그러나 큰 문제가 하나 있습니다. 이러한 플랫폼은 매우 제한적인 실시간 지원을 제공합니다. 여기저기 살펴보면 이러한 플랫폼을 사용하여 대략 실시간 대시보드를 만드는 예제 몇 가지를 찾을 수 있지만, 그들의 실시간 지원은 여과 없이 그런 데로 납치한 것처럼 보입니다. 중요한 것이 그들이 그 실행 모델의 중심요소로 만들 계획이 전혀 없었습니다. 그들은 그저 실시간 지원을 위해 대시보드를 규칙적인 간격으로 새롭게 표시하는 스냅샷 기반 접근 방식을 취합니다. 저사양의 경우에는 작동할지 몰라도, 현대의 대용량 스트리밍 데이터에는 이를 견딜 수 없는 문제가 발생합니다.

왜 이것이 중요한가요? 스트리밍 데이터는 앞으로 시장을 지배할 것으로 전망됩니다. 스트리밍 데이터 파이프라인은 연결된 장치와 빠른 통신을 가능하게 하며, 사기 탐지나 맞춤형 제안과 같은 사용 사례를 구동합니다. 포브스는 2025년까지 생성된 데이터의 거의 30%가 실시간일 것으로 추정하여, 경쟁력 유지를 위해 실시간 데이터 통합이 중요해질 것이라고 합니다. 포츈 비즈니스 인사이츠는 거대한 예측을 내놓았습니다: 2030년까지 스트리밍 분석 시장 규모는 1,250억 달러를 넘길 것으로 예상합니다.

그래서 파이썬 데이터 과학자와 점점 더 필요해질 실시간 대시보드 사이에는 격차가 있습니다. 이 문제에 대한 훌륭한 해결책을 찾아나섰지만, 우선 순위 목록의 맨 위에 스트리밍 대시보드가 있는 솔루션을 찾을 수 없었습니다. 그래서 우리는 직접 제작했습니다: deephaven.ui. 이 새로운 대시보드 패러다임은 유연한 React Spectrum 기반 구문, 모듈식 구성 요소 설계, 그리고 가장 중요한, 실시간을 최우선으로 합니다.

deephaven.ui는 새롭게 출시되어 매우 열심히 개발 중인 상태이지만, 이미 최상의 플랫폼으로 자리잡고 있습니다. 곧 제공될 방대한 문서를 통해 deephaven.ui의 모든 면을 손쉽게 탐색할 수 있을 것입니다.

<div class="content-ad"></div>

deephaven.ui가 어떻게 작동하는지 보고 싶다면 데모 시스템의 새로운 deephaven.ui 노트북을 확인해보세요. 현재 이 노트북은 데모의 Code Studio 쪽에만 있습니다.

# deephaven.ui로 시작하기

deephaven.ui를 시작하는 가장 쉬운 방법은 미리 설치된 Docker 이미지를 실행하는 것입니다:

```js
docker run --rm --name deephaven-ui -p 10000:10000 --pull=always ghcr.io/deephaven/server-ui:latest
```

<div class="content-ad"></div>

그럼 http://localhost:10000/ide/로 이동하여 deephaven.ui를 사용해보세요.

아래는 mock 스트리밍 데이터셋 아래에 있는 상대적으로 복잡한 deephaven.ui 대시보드입니다. 이것을 IDE로 복사하여 붙여넣기하고 deephaven.ui가 얼마나 유연하고 반응성 있는지 살펴보세요:

```js
from deephaven import ui, agg, empty_table

from deephaven.stream.table_publisher import table_publisher
from deephaven.stream import blink_to_append_only

from deephaven.plot import express as dx
from deephaven import updateby as uby
from deephaven import dtypes as dht

stocks = dx.data.stocks().reverse()

...

dashboard = ui.dashboard(my_layout(stocks, _stocks_with_stats))
```