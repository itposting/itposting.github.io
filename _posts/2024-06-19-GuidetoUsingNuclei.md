---
title: "가이드 Nuclei 사용법"
description: ""
coverImage: "/assets/img/2024-06-19-GuidetoUsingNuclei_0.png"
date: 2024-06-19 14:51
ogImage: 
  url: /assets/img/2024-06-19-GuidetoUsingNuclei_0.png
tag: Tech
originalTitle: "Guide to Using Nuclei"
link: "https://medium.com/@learntheshell/guide-to-using-nuclei-9c37869be30e"
---


Nuclei라는 강력한 취약점 스캐너 사용 방법을 배우세요.

# 소개

Nuclei는 보안 연구원과 전문가를 위해 설계된 강력하고 유연한 오픈 소스 취약점 스캐너입니다. 웹 애플리케이션, API 및 네트워크 서비스의 다양한 취약점을 식별하고 보고하기 위해 사용자 정의 가능한 템플릿을 사용합니다. Nuclei는 다른 보안 도구와 통합되어 자동화된 워크플로에 매끄럽게 포함될 수 있습니다. 속도 제한, 사용자 지정 헤더, 외부 테스트, 다양한 구성 옵션과 같은 기능을 갖춘 Nuclei는 적극적인 취약점 관리와 보안 평가를 위한 효율적이고 철저한 솔루션을 제공합니다.

![Nuclei 사용 가이드](/assets/img/2024-06-19-GuidetoUsingNuclei_0.png)

<div class="content-ad"></div>

## TL;DR

이 문서의 간략한 요약 버전을 여기에서 확인할 수 있습니다.

# Basic Usage

Nuclei는 단일 대상물을 스캔하거나 파일에서 여러 대상물을 스캔하고 다른 도구들과의 워크플로에 통합할 수 있습니다.

<div class="content-ad"></div>

## 단일 대상 스캔

취약점을 찾기 위해 단일 대상 URL을 스캔하려면 다음 명령을 사용하세요:

```js
nuclei -u http://example.com
```

다른 방법으로는 아래와 같이 사용할 수 있습니다:

<div class="content-ad"></div>

```js
nuclei -target http://example.com
```

두 명령 모두 지정된 URL을 스캔하여 사용 중인 템플릿을 기반으로 알려진 취약점을 찾습니다.

## 파일에서 대상 스캔

대상 목록이 있는 경우 파일에 저장하고 각 대상을 스캔할 수 있습니다:

<div class="content-ad"></div>

```js
nuclei -l targets.txt
```

이 방법은 여러 대상을 스캔하고 프로세스를 자동화하며 모든 지정된 URL이 취약점을 확인하는 데 효율적입니다.

## 다른 도구와 Nuclei 통합하기

Nuclei를 다른 보안 도구와 통합하여 포괄적인 워크플로우를 만들 수 있습니다. 예를 들어 `subfinder`와 `httpx`를 Nuclei와 결합하여 하위 도메인을 찾은 다음 노출에 대해 스캔할 수 있습니다:

<div class="content-ad"></div>

```js
subfinder -d targetdomain.site -silent | httpx | nuclei -t http/exposures/
```

이 워크플로우는 먼저 `subfinder`를 사용하여 `targetdomain.site`의 서브도메인을 발견한 후, `httpx`로 해당 서브도메인의 HTTP 상태를 확인하고, 마지막으로 `http/exposures/` 디렉토리에 있는 Nuclei 템플릿을 사용하여 취약점을 스캔합니다.

# 템플릿

템플릿은 Nuclei가 스캔 중에 무엇을 찾을지를 정의합니다. 특정 유형의 취약점에 대한 것이거나 보다 일반적인 내용일 수도 있습니다.

<div class="content-ad"></div>

## 템플릿 폴더 사용하기

특정 폴더의 모든 템플릿을 사용하여 스캔할 수 있습니다. 예를 들어, `http/exposures/` 폴더의 모든 템플릿을 사용하려면:

```js
nuclei -t http/exposures/
```

이 명령은 지정된 디렉토리의 모든 템플릿을 사용하여 대상을 스캔하며 다양한 유형의 노출을 확인합니다.

<div class="content-ad"></div>

## 특정 템플릿 사용하기

특정 템플릿을 활용하여 스캔하려면 `-t` 플래그와 함께 해당 템플릿을 나열하면 됩니다. 이를 통해 특정 취약점이나 기술을 기반으로 한 타겟 스캔이 가능합니다:

```js
nuclei -t http/technologies/tech-detect.yaml -t http/technologies/nginx/nginx-version.yaml
```

위 예시는 특정 기술을 스캔하고 사용 중인 Nginx 버전을 체크하는데, 지정된 템플릿을 활용합니다.

<div class="content-ad"></div>

## 템플릿 태그 사용하기

템플릿에 태그를 달아서 보다 쉽게 정리하고 활용할 수 있습니다. 특정 기준과 일치하는 템플릿을 사용하기 위해 태그를 지정할 수 있습니다:

```js
nuclei -u https://jira.targetdomain.site -tags jira,generic
```

이 명령은 `jira`와 `generic` 태그가 달린 템플릿을 사용하여 대상 URL을 스캔하여 관련 있는 취약점을 확인합니다.

<div class="content-ad"></div>

## 심각도별 필터링

더 중요한 문제에 집중하기 위해 심각도에 따라 템플릿을 필터링할 수 있습니다. 예를 들어:

```js
nuclei -u https://targetdomain.site -s critical,high,medium
```

이 명령은 심각하거나 높거나 중간 심각도로 분류된 템플릿을 사용하여 대상을 검사하며, 중요한 취약점을 우선적으로 처리합니다.

<div class="content-ad"></div>

## 템플릿 제외하기

스캔에서 특정 템플릿을 제외하려면 `-et` 플래그를 사용하세요. 이는 스캔을 개선하여 관련없거나 중요하지 않은 체크를 제외하는 데 도움이 됩니다:

```js
nuclei -et http/fuzzing/
```

이 명령은 스캔에서 `http/fuzzing/` 디렉토리의 모든 템플릿을 제외합니다.

<div class="content-ad"></div>

# 헤더 설정

스캔 중 HTTP 요청에 포함될 사용자 지정 헤더를 설정할 수 있습니다. 특정 상호 작용을 위해 특정 헤더가 필요한 응용 프로그램을 스캔할 때 유용합니다.

## 사용자 지정 헤더

`-H` 플래그를 사용하여 사용자 지정 헤더를 설정할 수 있습니다. 예를 들어, User-Agent 헤더를 설정하는 방법은 다음과 같습니다:

<div class="content-ad"></div>

```js
nuclei -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' -l targets.txt
```

이 명령어는 `targets.txt`에 나열된 모든 대상을 스캔하면서 각 요청마다 지정된 User-Agent 헤더를 보냅니다.

# 속도 제한

대상 서버를 과부하시키지 않도록 요청률과 동시 스레드 수를 제한할 수 있습니다.

<div class="content-ad"></div>

## 요청 및 쓰레드 제한

초당 요청 수와 동시 쓰레드 수를 설정하여 스캔 속도를 제어하세요:

```js
nuclei -l targets.txt -rl 20 -c 5
```

이 명령은 Nuclei를 초당 20개의 요청으로 제한하고 최대 5개의 동시 쓰레드를 사용하여 속도와 서버 부하를 균형있게 유지합니다.

<div class="content-ad"></div>

# 최적화

Nuclei는 스캔 성능을 최적화하고 오류를 효율적으로 처리하기 위한 여러 옵션을 제공합니다.

## 타임아웃 설정

스캔 속도를 높이기 위해 요청의 타임아웃을 줄일 수 있습니다. 기본 타임아웃은 10초이지만 필요에 따라 더 낮출 수 있습니다.

<div class="content-ad"></div>

```js
nuclei -l targets.txt -timeout 3
```

이 명령어는 요청 제한 시간을 3초로 설정합니다.

## 오류 처리와 재시도

Nuclei가 오류를 처리하고 재시도하는 방법을 구성하세요. 일정 횟수의 오류 후 호스트를 건너뛰거나 실패한 요청에 대한 재시도 횟수를 설정하세요:

<div class="content-ad"></div>

```js
nuclei -l targets.txt --max-host-errors 5
```

```js
nuclei -l targets.txt --retries 3
```

이 명령어들은 5번의 오류 발생 후 호스트를 건너뛰고, 실패한 요청을 최대 3번까지 다시 시도합니다.

## 스캔 전략

<div class="content-ad"></div>

로드와 효율성을 균형 있게 유지할 스캔 전략을 선택하세요. `host-spray`는 다음 대상으로 이동하기 전에 모든 템플릿을 단일 대상에 적용하고, `template-spray`는 여러 대상에 걸쳐 템플릿을 실행합니다:

```js
nuclei -l targets.txt -ss host-spray
```

이 명령은 `host-spray` 전략을 사용하며, 각 대상에 대한 부하를 줄일 수 있습니다.

# 결과

<div class="content-ad"></div>

**저장 결과**

나중에 분석할 파일로 스캔 결과를 저장해보세요:

```js
nuclei -l targets.txt -o nuclei.log
```

<div class="content-ad"></div>

이 명령어는 스캔 결과를 `nuclei.log`에 기록합니다.

## JSONL 출력

스캔 결과를 JSONL (JSON Lines) 형식으로 출력하여 쉽게 구문 분석하고 다른 도구와 통합할 수 있습니다:

```js
nuclei -l targets.txt -jsonl
```

<div class="content-ad"></div>

## 프린팅 통계

스캔 중에 진행 상황과 성능을 모니터링하는 통계를 표시하십시오:

```js
nuclei -l targets.txt -stats
```

## 마크다운 출력

<div class="content-ad"></div>

아래는 Markdown 형식으로 결과를 저장하세요:

```js
nuclei -l targets.txt -me results/
```

이 명령은 스캔 결과를 `results/` 디렉토리에 Markdown 형식으로 저장합니다.

# 외부 밴드 테스팅

<div class="content-ad"></div>

외부 밴드 (OOB) 테스트는 일반적인 HTTP 요청/응답 주기 외에 발생하는 상호 작용을 테스트하는 것을 의미합니다.

## OOB 테스트 비활성화

OOB 테스트가 필요하지 않은 경우 비활성화할 수 있습니다:

```js
nuclei -l targets.txt -ni
```

<div class="content-ad"></div>

## 인터랙트 서버 사용하기

OOB 상호 작용을 처리하기 위해 자체 호스트된 Interactsh 서버를 지정하십시오:

```js
nuclei -l targets.txt -iserver <server-addr> -itoken <server-token>
```

상호 작용 유출 시간:

<div class="content-ad"></div>

```js
nuclei -l targets.txt -interactions-eviction 120
```

그리고 사용자 지정 폴링 기간을 정의하십시오:

```js
nuclei -l targets.txt -interactions-poll-duration 10
```

이 명령어들은 Nuclei를 특정 Interactsh 서버를 사용하도록 구성하고 상호 작용을 기다릴 시간을 조절합니다.

<div class="content-ad"></div>

# 설정

세팅을 간편하게하고 일관된 스캔을 보장하기 위해 YAML 파일에서 구성을로드합니다. 기본 구성 파일은 `~/.config/nuclei/config.yaml`에 위치해 있습니다.

## 구성 파일 사용

`-config` 플래그를 사용하여 구성을 로드할 수 있습니다.

<div class="content-ad"></div>

```js
nuclei -config nuclei.yaml -l targets.txt
```

## 구성 예시

예시 구성 파일에는 사용자 지정 헤더, 템플릿 경로, 태그, 심각도 필터 및 속도 제한 설정이 포함될 수 있습니다:

```js
header:
  - 'X-BugBounty-Hacker: h1/nickname'

templates:
  - cves/
  - vulnerabilities/
  - misconfiguration/

tags: exposures,cve
severity: critical,high,medium

include-templates:
  - vulnerabilities/xxx
  - misconfiguration/xxxx

exclude-tags: info,fuzz
exclude-templates:
  - vulnerabilities/xxx
  - misconfiguration/xxxx

# 속도 제한 설정
rate-limit: 50
bulk-size: 20
concurrency: 20
```

<div class="content-ad"></div>

이 구성은 스캔 프로세스를 최적화하기 위해 사용자 지정 헤더를 설정하고 템플릿을 지정하며 속도 제한 및 기타 설정을 정의합니다.

# 업데이트

Nuclei 및 해당 템플릿을 최신 상태로 유지하여 최신 취약점을 확인할 수 있도록 합니다.

## 업데이트 확인 비활성화

<div class="content-ad"></div>

자동 업데이트 확인을 비활성화하여 스캔 중단을 방지하세요:

```js
nuclei -l targets.txt -duc
```

## 템플릿 및 Nuclei 업데이트

Nuclei 설치를 최신 버전으로 업데이트하세요.

<div class="content-ad"></div>

```js
nuclei -up
```

템플릿을 업데이트하려면:

```js
nuclei -ut
```

이 명령어들은 최신 기능 및 취약점 검사를 보장하여 템플릿과 Nuclei 도구 자체를 업데이트합니다.

<div class="content-ad"></div>

# 결론

Nuclei는 보안 전문가와 연구자들에게 필수적인 도구로, 취약성 스캔을 위한 견고하고 유연한 솔루션을 제공합니다. 사용자는 다양한 타깃에서 보안 위험을 효과적으로 식별하고 관리할 수 있도록, 다양한 커스터마이즈 가능한 템플릿, 통합 기능 및 포괄적인 구성 옵션을 제공합니다. 레이트 제한, 커스텀 헤더, out-of-band 테스팅과 같은 강력한 기능을 활용함으로써 사용자들은 스캔 전략을 특정 요구사항과 환경에 맞게 맞춤화할 수 있습니다. Nuclei를 일상적인 보안 점검이나 더 큰 보안 작업 흐름에 도입할 때, 이 도구는 견고한 보안 자세를 유지하기 위해 필요한 다양성과 심도를 제공합니다. Nuclei의 파워를 활용하여 취약성 관리 방법을 향상시키고 잠재적인 위협에 선제적으로 대처하세요.