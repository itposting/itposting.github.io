---
title: "dbt 프로젝트 작업 흐름을 빠르게하는 방법 Makefile 사용하기"
description: ""
coverImage: "/assets/img/2024-06-19-HowtouseaMakefiletospeedupyourdbtprojectworkflow_0.png"
date: 2024-06-19 16:02
ogImage: 
  url: /assets/img/2024-06-19-HowtouseaMakefiletospeedupyourdbtprojectworkflow_0.png
tag: Tech
originalTitle: "How to use a Makefile to speed up your dbt project workflow"
link: "https://medium.com/inthepipeline/how-to-use-a-makefile-to-speed-up-your-dbt-project-workflow-fb36eb676910"
---


## 명령 체계를 간소화하고 관련 명령을 그룹화하여 재사용성을 높이세요

빌드, 실행, 테스트, 문서, 스냅샷, 복제 등 dbt 명령이 많이 있습니다. 저와 같은 경우면 필요한 명령어를 다시 입력하기 싫어서 명령어 히스토리를 계속 찾아다니고 있을 것입니다. 특히 여러 명령을 자주 함께 사용할 때는 더 그렇습니다. 더 나은 해결책이 있을 것입니다.

![Makefile](/assets/img/2024-06-19-HowtouseaMakefiletospeedupyourdbtprojectworkflow_0.png)

# Makefile이 구원해줄 것입니다

<div class="content-ad"></div>

소프트웨어를 컴파일한 적이 없다면 메이크파일을 본 적이 없을 수도 있어요. 메이크파일은 코드를 컴파일하는 데 필요한 모든 종속성과 명령을 관리하는 데 사용되지만, 리눅스나 맥 OS에서 어떤 작업을 자동화하는 데도 사용할 수 있어요.

메이크파일을 사용하면 기본적으로 자신만의 추상화된 명령을 만들 수 있어요. 이를 필요로 하는 경우가 있습니다:

- 같은 명령을 자주 실행하는 경우
- 명령이 길고 매번 입력하기 귀찮거나 명령 기록을 찾기 싫은 경우
- 명령을 논리적으로 && 그룹으로 묶고 싶은 경우
- 명령을 공유하거나 일반적인 명령 패턴을 프로젝트에 포함하고 싶은 경우

메이크파일의 미세한 세부 사항에 너무 심술을 파는 것은 필요하지 않아요. 알아야 할 주요한 점은 우리가 타겟과 명령으로 구성된 규칙을 만들 수 있다는 것이에요. 'Phony'라는 특별한 타겟을 사용할 것인데요, 아래에서 좀 더 자세히 알아볼게요.

<div class="content-ad"></div>

# 간단한 예제

다음은 dbt 문서를 생성하고 제공하는 간단한 makefile입니다:

```js
# 기본 대상에 대한 문서 생성 및 제공
.PHONY: docs
docs:
 dbt docs generate && dbt docs serve
```

- 프로젝트의 루트 디렉토리에 위 줄을 포함한 Makefile(확장자 없음)이라는 파일을 만듭니다.
- 프로젝트의 루트에서 make docs를 실행하면 dbt docs generate && dbt docs serve 명령이 실행됩니다.

<div class="content-ad"></div>

```js
$ make docs
dbt docs generate && dbt docs serve
04:35:12  dbt 실행 중=1.7.9
04:35:12  등록된 어댑터: duckdb=1.7.2
04:35:12  모델 7개, 테스트 25개, 소스 3개, 노출 0개, 메트릭 0개, 매크로 582개, 그룹 0개, 의미 모델 0개 발견됨
...
...
```

# .PHONY

.PHONY로 시작하는 줄을 본 적이 있을지도 모르겠죠. 이것은 홀덴 코필드와는 아무 상관이 없습니다. 이것은 'Phony targets'라고 불리는 사용자 정의 대상을 정의하는 방법입니다. 이는 파일이 아닌 명령을 참조하는 makefile 규칙입니다.

기억해야 할 것은 대상을 올바르게 작동하도록 'Phony'로 식별하는 것입니다. 이를 간단한 예제처럼 각 대상 위에 할 수도 있고, 대신에 다음과 같이 한 곳에 모두 선언할 수도 있습니다.

<div class="content-ad"></div>

```js
.PHONY: build test docs help
```

이렇게 하면 build, test, docs, help 네 개의 가짜 대상이 정의되며, 여러분의 makefile 상단에 위치합니다.

# 이것으로 빌드합니다

추가하는 명령어는 실제로 여러분의 개인적인 워크플로우에 따라 다양합니다. 그것이 바로 이에 대한 아름다움입니다 — 그것들은 여러분의 프로젝트에 유용한 명령어로 이루어진 여러분만의 특정 명령어 세트입니다.

<div class="content-ad"></div>

다음은 추가적인 기본 예시 몇 가지가 있어요:

```js
.PHONY run seed docs kitchen-sink clean 

run:
 dbt run && dbt test
 
seed:
 dbt seed && dbt run
 
docs:
 dbt docs generate && dbt docs serve

kitchen-sink:
 dbt clean && dbt deps && dbt seed && dbt run && dbt test

clean:
 dbt clean && dbt deps
```

# 고급 예시

명령줄에서 변수를 makefile로 전달하거나 환경 변수를 로드하여 더 심화된 수준으로 이어갈 수 있어요.

<div class="content-ad"></div>

## CLI에서 변수 전달하기

가정해보자. dbt 빌드 명령을 실행하고 dbt 환경 대상을 지정하고 싶다면 다음과 같이 코드를 작성할 수 있습니다:

```js
.PHONY: build

build:
 @echo "Building project with environment: $(TARGET)"
 dbt build --target $(TARGET)
```

그런 다음 make 명령을 실행할 때 사용할 dbt 대상을 지정할 수 있습니다.

<div class="content-ad"></div>

```js
$ make build TARGET=dev
환경: dev으로 프로젝트 빌드 중
dbt 빌드 --target dev
04:11:42  dbt=1.7.9 버전으로 실행 중
...
```

환경 변수와 함께 사용하면 makefile이 프로젝트를 조작하는 데 매우 강력한 도구가 될 수 있음을 알 수 있습니다.

## 환경 변수 로드

.env 파일을 로드하려면 makefile 맨 위에 다음을 추가하세요.

<div class="content-ad"></div>

```js
include .env
export
```

이제 당신의 makefile은 모든 .env 변수를 불러올 것입니다. 예를 들어 기본 dbt 타겟을 지정할 수 있습니다:

```js
TARGET=dev
```

그런 다음, makefile을 업데이트하여 .env 변수가 설정되었는지 확인해주세요:

<div class="content-ad"></div>

```js
include .env
export

# Default value for TARGET if not set
TARGET ?= $(TARGET)

.PHONY: build

build:
 @echo "프로젝트를 환경과 함께 빌드 중: $(TARGET)"
 dbt build --target $(TARGET)
```

이제 make build를 실행할 때, .env 파일에 정의된 대상인 dev가 사용됩니다. 그러나 make 명령을 실행할 때 TARGET를 지정하여 재정의할 수도 있습니다:

```js
# 기본 .env 대상 재정의
make build TARGET=prod
```

이로써 makefile이 일종의 bash 스크립트로 변환되었습니다 (이것을 말할 때 리눅스 전문가들이 나를 죽일지도 모릅니다). 특히 환경 변수를 로드할 수 있다는 점을 고려할 때입니다.

<div class="content-ad"></div>

# 도움말 섹션

명령을 완료하면 만든 모든 사용 가능한 명령에 대해 설명하는 도움말 섹션을 추가하십시오. 이렇게 하면 거의 자체 CLI 도구처럼 만들어집니다!

```js
# 사용 가능한 명령 표시
.PHONY: help
help:
 @echo "사용 가능한 명령:"
 @echo "  docs - 기본 대상의 문서 생성 및 서비스"
``` 

# 일반 dbt 작업을 위한 보일러플레이트 makefile

<div class="content-ad"></div>

여기 시작할 수 있는 보일러플레이트가 있어요. 별로 복잡하지 않지만 시작할 때 도움이 될 거에요:

프로젝트를 위한 기본 TARGET 및 PROFILE을 가진 .env 파일을 만들어놓지 않았다면 기억하세요.

## Makefile 활용

구체적인 요구 사항과 의존성을 갖는 실제 프로젝트에서 makefile이 어떻게 보일 수 있는지 알고 싶다면, Alex가 Zero to dbt 프로젝트의 makefile에서 어떤 작업을 했는지 확인해보세요.

<div class="content-ad"></div>


```js
.include .env
.export

.PHONY: run clean clean_log duck_dev duck_prod

DBT_TARGET = dev

run:
 @echo "SPODBTIFY_SOURCE_PARQUET = $$SPODBTIFY_SOURCE_PARQUET"
 dbt run --target $(DBT_TARGET)

doc: 
 dbt docs generate && dbt docs serve 

duck_dev:
 duckdb spodbtify.duckdb -cmd "USE spodbtify.dev; show all tables"

duck_prod:
 duckdb spodbtify.duckdb -cmd "USE spodbtify.prod; show all tables"

clean: 
 unset SPODBTIFY_SOURCE_PARQUET && dbt clean && rm -rf *.duckdb

clean_log:
 rm -rf logs/*.log
```

이 프로젝트는 duckdb를 사용하므로 Alex가 duckdb를 실행하고 prod 및 dev의 테이블을 표시하는 몇 가지 타겟을 만들었습니다. 따라서 프로젝트에서 makefile을 사용하는 방식은 구성에 매우 의존함을 알 수 있습니다.

# 결론

Makefiles는 사용하는 명령어를 소유하는 강력한 방법이 될 수 있습니다. 여러 명령어를 자주 실행하거나 프로젝트별 공통 작업이 있는 경우 생명 구원자가 될 수 있습니다.


<div class="content-ad"></div>

한 가지 단점은 원래 명령어를 추상화함으로써 해당 명령어로부터 동떨어져 있게 될 수 있다는 점입니다. 원래 명령어를 잊어버릴 수도 있고, 새로운 기능이나 사용 패턴을 놓칠 수도 있습니다. 따라서 자주 자신의 makefile을 다시 살펴보는 것이 좋습니다.

프로젝트에서 makefile을 사용하고 계신가요? 팁이나 멋진 사용 예시가 있다면 댓글로 공유해주세요!