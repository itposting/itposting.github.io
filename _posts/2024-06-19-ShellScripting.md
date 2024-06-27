---
title: "쉘 스크립팅"
description: ""
coverImage: "/assets/img/2024-06-19-ShellScripting_0.png"
date: 2024-06-19 01:00
ogImage: 
  url: /assets/img/2024-06-19-ShellScripting_0.png
tag: Tech
originalTitle: "Shell Scripting"
link: "https://medium.com/@roddamgokul1999/shell-scripting-32368465e51c"
---


셸 스크립팅이란 무엇인가요?

터미널에 리눅스 명령어를 입력하는 것과 마찬가지로, 텍스트 파일에 명령어들을 나열하고 그 파일의 확장자를 .sh로 지정하여 실행할 수 있습니다.

셸 스크립팅을 사용하면 파일 관리 작업 등 리눅스의 작업을 자동화할 수 있습니다.

서버에서 파일을 백업하는 것과 같이 일상적인 작업에서 인간의 노력을 줄여줄 수 있습니다.

<div class="content-ad"></div>

종류별 쉘:

보른 쉘(sh):

일부 시스템에서 기본 해석기지만, 많은 현대 리눅스 배포판에서는 "dash" 등 다른 쉘로의 심볼릭 링크로 대체됩니다.

이식 가능하고 대부분 선호되는 쉘입니다. 그러나 산술 및 논리 표현 처리 등 일부 고급 기능이 부족합니다.

<div class="content-ad"></div>

C 셸 (csh):

C 언어에서 영감을 받았지만 bash보다는 오늘날에는 사용량이 적습니다. 그러나 일부 사용자들은 그 문법을 선호합니다.

TENEX C 셸 (tcsh):

철자 교정 및 프로그래밍 가능한 단어 완성과 같은 고급 기능을 갖춘 C 셸의 확장판입니다.

<div class="content-ad"></div>

C 셸 사용자에게 친숙한 경험을 제공하면서 추가 기능이 있습니다.

Z 셸:

더 많은 고급 기능 및 플러그인 지원과 더 많은 사용자 정의 옵션을 갖춘 bash 셸의 확장입니다.

효율적인 셸과 매우 구성 가능한 환경을 원하는 사용자들 사이에서 인기가 있습니다.

<div class="content-ad"></div>

셸의 여러 종류가 있어요. 우리의 필요와 선호에 따라 그 중에서 선택할 수 있어요.

셸 스크립팅 기초:

사용자 입력을 어떻게 받을까요?

![이미지](/assets/img/2024-06-19-ShellScripting_0.png)

<div class="content-ad"></div>

위 이미지에서 볼 수 있듯이, 우리는 사용자로부터 입력을 받기 위해 "read"를 사용할 수 있습니다.

이 스크립트는 두 개의 숫자를 입력으로 받고 그것들을 출력으로 출력합니다.

입력으로 어떤 숫자를 주면, 그들은 변수 num1과 num2에 저장됩니다.

echo 명령어에서 변수를 출력하려면 변수 앞에 "$" 기호를 사용해야 합니다.

<div class="content-ad"></div>


![스크립트 실행 전 사용자 입력을 받을 수 있습니다](/assets/img/2024-06-19-ShellScripting_1.png)

스크립트 실행 전에 사용자 입력을 받을 수 있습니다.:

![스크립트 실행 전 사용자 입력 받기](/assets/img/2024-06-19-ShellScripting_2.png)

여기서 num1=$1은, 우리가 bash scriptname.sh라는 명령어로 스크립트를 실행할 때 변수에 값을 제공할 것으로 예상됩니다.


<div class="content-ad"></div>

저의 스크립트 이름을 med.sh로 지었기 때문에 이 bash med.sh value1 value2를 따를 수 있어요. 이렇게 하면 두 값이 num1과 num2에 할당됩니다.

![image](./assets/img/2024-06-19-ShellScripting_3.png)

변수의 또 다른 사용 사례를 살펴보죠:

아래 이미지처럼 쉘에서 "t"라는 변수를 값 10으로 초기화해 봅시다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ShellScripting_4.png)

출력할 수 있을까요? echo 명령어로 시도해 봅시다:

![이미지](/assets/img/2024-06-19-ShellScripting_5.png)

echo 문이 작동하고 변수 값이 출력된 것을 확인할 수 있었어요. 이제 스크립트로 시도해 볼게요:


<div class="content-ad"></div>


![ShellScripting_6](/assets/img/2024-06-19-ShellScripting_6.png)

![ShellScripting_7](/assets/img/2024-06-19-ShellScripting_7.png)

It gives nothing, because variable "t" is not global. So, to make it global, we should export the variable with the command `export t`.

![ShellScripting_8](/assets/img/2024-06-19-ShellScripting_8.png)


<div class="content-ad"></div>

위와 같이 보시다시피, 스크립트 내 echo 문은 "t" 값을 출력할 수 있습니다.

For 루프:

![이미지](/assets/img/2024-06-19-ShellScripting_9.png)

여기에서 for 루프는 C 언어로 작성한 것과 동일합니다. 이 스크립트는 변수 n의 값들을 출력합니다. 매 반복마다 조건 n≤5를 확인하며, 참이면 해당 값을 출력합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ShellScripting_10.png)

bash 배열을 만드는 방법은 무엇인가요?

Bash 배열은 매우 특별합니다. 다른 프로그래밍 언어와 달리 문자열, 정수 등과 같은 다양한 유형의 요소를 저장할 수 있습니다.

구문: array_name=()


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ShellScripting_11.png" />

여기에서 우리는 gokul이라는 배열을 만들었고, 그 안에 값을 넣었습니다.

그리고 for 루프를 사용하여 배열을 반복하고 해당 값을 출력할 수 있습니다.

'gokul[@]'은:

<div class="content-ad"></div>

gokul은 우리가 참조하는 배열 이름입니다. @는 중괄호 내부에 있는 특수한 자리 표시자로, 배열을 공백으로 구분된 개별 요소로 확장하는 역할을 합니다. 'gokul[*]'도 사용할 수 있습니다.

![image](/assets/img/2024-06-19-ShellScripting_12.png)

함수:

함수를 사용하여 입력된 숫자를 더하고 빼고 나누는 스크립트를 만들어 봅시다.

<div class="content-ad"></div>


syntax : function_name()' — — — — — Code — — — — -'

function_name 함수를 통해 해당 함수를 필요한 곳 어디서든 호출할 수 있습니다.

<img src="/assets/img/2024-06-19-ShellScripting_13.png" />

저희는 각각 덧셈, 뺄셈, 나눗셈을 위한 sum, sub, div 3개의 함수를 생성했습니다.


<div class="content-ad"></div>

위 함수 안에는 위 스크립트에 표시된 대로 논리 연산을 수행하는 논리가 포함되어 있습니다. 그리고 결과가 출력됩니다.

read 명령어를 사용하여 입력값으로 2개의 숫자를 받고, read 명령어에 -p를 사용하여 콘솔에 인쇄할 메시지를 호출할 수 있습니다.

그리고 입력 받은 두 변수를 모든 함수에 전달하기 위해 각각의 이름을 호출합니다.

![이미지](/assets/img/2024-06-19-ShellScripting_14.png)

<div class="content-ad"></div>

Case :

테이블 태그를 마크다운 형식으로 변경하면 됩니다.

\
It allows you to compare an expression against a list of patterns and execute specific code blocks based on the match.
\

Lets see example below.

![Shell Scripting Example](/assets/img/2024-06-19-ShellScripting_15.png)

<div class="content-ad"></div>

스크립트는 기분 조건을 인수로 사용합니다.

- case 문은 기분 변수를 다른 패턴과 비교합니다.
- "Happy", "Sad", 또는 "Depressed"와 일치하는 경우 해당 코드 블록이 실행됩니다.

그리고 "esac"은 case의 반대로, case 블록의 끝을 나타냅니다.