---
title: "모든 개발자를 위해 도움이 되는 5가지 Bash 문자열 조작 방법"
description: ""
coverImage: "/assets/img/2024-05-27-5BashStringManipulationMethodsThatHelpEveryDeveloper_0.png"
date: 2024-05-27 12:16
ogImage:
  url: /assets/img/2024-05-27-5BashStringManipulationMethodsThatHelpEveryDeveloper_0.png
tag: Tech
originalTitle: "5 Bash String Manipulation Methods That Help Every Developer"
link: "https://medium.com/gitconnected/5-bash-string-manipulation-methods-that-help-every-developer-49d4ee38b593"
---

![Bash String Manipulation Methods](/assets/img/2024-05-27-5BashStringManipulationMethodsThatHelpEveryDeveloper_0.png)

배시는 모든 유닉스류 또는 유닉스 기반 운영 체제의 기본 자동화 언어가 되었습니다. 시스템 관리자, 데브옵스 엔지니어 및 프로그래머는 일반적으로 반복적인 명령 시퀀스를 사용하여 셸 스크립트를 작성하는 데 Bash를 사용합니다. Bash 스크립트에는 일반적으로 다른 프로그램 이진 파일을 실행하는 명령이 포함되어 있습니다. 대부분의 시나리오에서 데이터를 처리하고 셸 스크립트 내에서 논리적 흐름을 생성해야 할 수 있습니다. 따라서 우리는 종종 셸 스크립트에 조건문과 텍스트 조작 문을 추가해야 합니다.

전통적인 Bash 스크립트와 이전 버전의 Bash 해석기를 사용한 이전 프로그래머들은 텍스트 조작을 위해 awk, sed, tr 및 cut 명령을 일반적으로 사용했습니다. 이들은 별개의 프로그램입니다. 이 텍스트 처리 프로그램들은 좋은 기능을 제공하지만 각 명령마다 상당한 프로세스 생성 시간이 소요되기 때문에 Bash 스크립트를 느리게 만듭니다. 현대의 Bash 버전은 잘 알려진 매개변수 확장 기능을 통해 내장된 텍스트 처리 기능을 제공합니다.

본 기사에서는 Bash 스크립트에서 효율적으로 텍스트를 처리하는 데 사용할 수 있는 내장 문자열 조작 구문 몇 가지에 대해 설명하겠습니다.

<div class="content-ad"></div>

# 부분 문자열 추출 및 대체

부분 문자열은 특정 문자열의 연속된 세그먼트 또는 일부를 가리킵니다. 다양한 스크립팅 시나리오에서 문자열 세그먼트에서 부분 문자열을 추출해야 하는 경우가 있습니다. 예를 들어, 파일 확장자가 포함된 완전한 파일 이름에서 파일 이름 세그먼트만 얻어야 하는 경우가 있습니다. 또한 부분 문자열을 특정 문자열 세그먼트로 대체해야 할 수도 있습니다 (즉, 파일 이름의 확장자를 변경하는 경우).

문자의 위치와 길이를 제공함으로써 부분 문자열을 추출하는 것은 매우 쉽습니다:

```js
#!/bin/bash

str="2023-10-12"

echo "${str:5:2}" # 10
echo "${str::4}" # 2023
echo "2022-${str:5}" # 2022-10-12
```

<div class="content-ad"></div>

다음과 같이 오른쪽 기준으로 부분 문자열 계산도 할 수 있습니다.

```js
#!/bin/bash

str="backup.sql"

echo "original${str:(-4)}" # original.sql
```

Bash는 부분 문자열을 대체하는 데 유용한 내장 구문도 제공합니다.

```js
#!/bin/bash

str="obin-linux_x64_bin"

echo "${str/x64/armhf}" # obin-linux_armhf_bin
echo "${str/bin/dist}" # odist-linux_x64_bin
echo "${str//bin/dist}" # odist-linux_x64_dist
```

<div class="content-ad"></div>

일부 문자열(예: 파일 이름, 경로 등)을 작업할 때는 문자열의 접두사와 접미사를 대체해야 할 수도 있습니다. 파일 확장자를 다른 확장자로 바꾸는 것이 좋은 예시입니다. 다음 예시를 살펴보세요:

```bash
#!/bin/bash

str="db_config_backup.zip"

echo "${str/%.zip/.conf}" # db_config_backup.conf
echo "${str/#db/settings}" # settings_config_backup.zip
```

위의 부분 문자열 대체 예시에서 일치시키기 위해 정확한 부분 문자열 세그먼트를 사용했지만, 다음과 같이 '\*' 와일드카드 문자를 사용하여 부분 문자열을 사용할 수도 있습니다:

```bash
#!/bin/bash

str="db_config_backup.zip"

echo "${str/%.*/.bak}" # db_config_backup.bak
echo "${str/#*_/new}" # newbackup.zip
```

<div class="content-ad"></div>

위의 방법은 정확한 부분 문자열을 모를 때 도움이 됩니다.

# 정규 표현식 일치, 추출 및 치환

이미 많은 유닉스 또는 GNU/Linux 사용자들이 알고 있는 대로, grep과 sed를 사용하여 정규 표현식 기반 텍스트 검색이 가능합니다. sed는 우리에게 정규 표현식 치환을 도와줍니다. 당신은 내장된 Bash 정규 표현식 기능을 사용하여 이러한 외부 이진 파일보다 빠르게 텍스트 처리를 처리할 수 있습니다.

다음의 코드 스니펫에서 보여지는 것처럼, if 조건문과 =~ 연산자를 사용하여 정규 표현식 일치를 수행할 수 있습니다:

<div class="content-ad"></div>

```js
#!/bin/bash

str="db_backup_2003.zip"

if [[ $str =~ 200[0-5]+ ]]; then
    echo "regex_matched"
fi
```

만약 원하시면 if 문을 인라인 조건문으로 바꿀 수도 있어요:

```js
[[ $str =~ 200[0-5]+ ]] && echo "regex_matched"
```

Bash 해석기가 정규 표현식을 찾은 후에는 일반적으로 모든 일치 항목을 BASH_REMATCH 쉘 변수에 저장합니다. 이 변수는 읽기 전용 배열이며, 전체 일치 데이터를 첫 번째 인덱스에 저장합니다. 서브 패턴을 사용하는 경우, Bash는 그에 해당하는 일치 항목을 다른 인덱스에 차례대로 보관합니다.

<div class="content-ad"></div>

```js
#!/bin/bash

str="db_backup_2003.zip"

if [[ $str =~ (200[0-5])(.*)$ ]]; then
    echo "${BASH_REMATCH[0]}" # 2003.zip
    echo "${BASH_REMATCH[1]}" # 2003
    echo "${BASH_REMATCH[2]}" # .zip
fi
```

이전에 substring matching을 wildcard와 함께 사용했던 것을 기억하시나요? 비슷하게, 다음 예시에서 보여지는 것처럼 파라미터 확장 내에서 regex 정의를 사용할 수 있습니다.:

```js
#!/bin/bash

str="db_backup_2003.zip"
re="200[0-3].zip"

echo "${str/$re/new}.bak" # db_backup_new.bak
```

# Substring Removal Techniques



<div class="content-ad"></div>

자주 텍스트 처리 요구 사항에서는 원하는 부분 문자열을 제거하여 텍스트 세그먼트를 사전 처리해야 할 때가 있습니다. 예를 들어, v 접두사와 일부 빌드 번호를 포함한 버전 번호를 추출하고 주 버전 번호를 찾으려면 일부 부분 문자열을 제거해야 합니다. 똑같은 부분 문자열 교체 구문을 사용할 수 있지만, 문자열 제거를 위해 교체 문자열 매개변수를 생략할 수도 있습니다.

```js
#!/bin/bash

str="ver5.02-2224.e2"

ver="${str#ver}"
echo $ver # 5.02-2224.e2

maj="${ver/.*}"
echo $maj # 5
```

위 예제에서는 정확한 부분 문자열과 와일드카드를 사용하여 부분 문자열을 제거했지만, 정규 표현식을 사용할 수도 있습니다. 과도한 문자 없이 깔끔한 버전 번호를 추출하는 방법을 확인해보세요.

```js
#!/bin/bash

str="ver5.02-2224_release"

ver="${str//[a-z_]}"
echo $ver # 5.02-2224
```

<div class="content-ad"></div>

# 대 소문자 변환 및 대 소문자 기반 변수

심지어 표준 C 언어에는 문자의 대 소문자를 변환하는 함수가 있습니다. 대부분의 현대적인 프로그래밍 언어들은 대소문자 변환을 위한 내장 함수를 제공합니다. 셸 스크립트 언어인 Bash는 대소문자 변환을 위한 함수를 제공하지는 않지만, 매개변수 확장과 변수 선언을 통해 대소문자 변환 기능을 제공합니다.

다음 예제를 살펴보세요. 이 예제는 글자의 대소문자를 변환합니다:

```bash
#!/bin/bash

str="안녕 Bash!"

lower="${str,,}"
upper="${str^^}"

echo $lower # 안녕 bash!
echo $upper # 안녕 BASH!
```

<div class="content-ad"></div>

다음처럼 특정 문자열의 첫 글자만 대문자 또는 소문자로 변경할 수도 있습니다:

```js
#!/bin/bash

ver1="V2.0-release"
ver2="v4.0-release"

echo "${ver1,}" # v2.0-release
echo "${ver2^}" # V4.0-release
```

만약 특정 변수를 엄격하게 대문자 또는 소문자로 만들어야 할 경우에는 매번 케이스 변환 함수를 실행할 필요가 없습니다. 대신, 다음 예시와 같이 내장된 declare 명령을 사용하여 특정 변수에 케이스 속성을 추가할 수 있습니다:

```js
#!/bin/bash

declare -l ver1
declare -u ver2

ver1="V4.02.2"
ver2="v2.22.1"

echo $ver1 # v4.02.2
echo $ver2 # V2.22.1
```

<div class="content-ad"></div>

위의 ver1 및 ver2 변수는 선언 시 case 속성을 받기 때문에 특정 변수에 값을 할당할 때마다 Bash는 변수 속성을 기반으로 텍스트 case를 변환합니다.

# 문자열 분할 (문자열을 배열로 변환하기)

Bash는 declare 내장을 사용하여 색인 배열과 연관 배열을 정의할 수 있습니다. 대부분의 범용 프로그래밍 언어는 문자열 객체의 분할 메서드나 표준 라이브러리 함수를 통해 분할 기능을 제공합니다 (예: Go의 strings.Split 함수). Bash에서는 다양한 방법으로 문자열을 분할하고 배열을 생성할 수 있습니다. 예를 들어 필요한 구분 기호를 IFS로 변경하고 read 내장을 사용할 수 있습니다. 또는 tr 명령어를 루프와 함께 사용하여 배열을 구성할 수도 있습니다. 내장 매개변수 확장을 사용하는 방법도 있습니다. Bash에서는 문자열을 분할하는 다양한 방법이 있습니다.

IFS와 read를 사용하는 것은 문자열을 분할하는 가장 간단하고 오류가 적은 방법 중 하나입니다.

<div class="content-ad"></div>

```bash
#!/bin/bash

str="C,C++,JavaScript,Python,Bash"

IFS=',' read -ra arr <<< "$str"

echo "${#arr[@]}" # 5
echo "${arr[0]}" # C
echo "${arr[4]}" # Bash
```

위의 코드 스니펫은 쉼표를 구분자로 사용하며 read 내장 명령어를 사용하여 IFS를 기반으로 배열을 생성합니다.

read를 사용하지 않고 쉽게 분할할 수 있는 방법이 있더라도, 숨겨진 문제가 없는지 확인해야 합니다. 예를 들어, 다음 분할 구현은 매우 간단하지만 \* (현재 디렉토리의 내용으로 확장)을 요소로 포함하고 구분 기호로 공백을 사용하는 경우에 작동하지 않습니다:

```bash
#!/bin/bash

# 경고: 이 코드에는 여러 숨겨진 문제가 있습니다.

str="C,Bash,*"

arr=(${str//,/ })

echo "${#arr[@]}" # 현재 디렉토리의 내용이 포함되어 있음
```

<div class="content-ad"></div>


지금까지 읽어 주셔서 감사합니다.

# 레벨 업 코딩

우리 커뮤니티의 일원이 되어 주셔서 감사합니다! 마지막으로 하고 가기 전에:


<div class="content-ad"></div>

- 👏 이야기에 박수를 보내고 저자를 팔로우하세요 👉
- 📰 Level Up Coding 게시물에서 더 많은 콘텐츠 확인하기
- 💰 무료 코딩 면접 코스 ⇒ 코스 보기
- 🔔 팔로우하기: Twitter | LinkedIn | 뉴스레터

🚀👉 Level Up 팀의 멤버가 되어 멋진 직업을 찾아보세요
