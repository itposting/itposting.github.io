---
title: "리눅스 도구 Sed 40 기본 명령어 입문"
description: ""
coverImage: "/assets/img/2024-06-27-LinuxToolsSed40CommandsIntro_0.png"
date: 2024-06-27 18:59
ogImage: 
  url: /assets/img/2024-06-27-LinuxToolsSed40CommandsIntro_0.png
tag: Tech
originalTitle: "LinuxTools:Sed:4.0:Commands:Intro"
link: "https://medium.com/@junkybirdbath/linuxtools-sed-4-0-commands-intro-2632c4f2181e"
---


이 노트 세트에서는 다양한 Sed 명령에 대해 논의를 시작하겠습니다. 그 명령들이 많기 때문에 명령에 대한 논의를 몇 개의 다른 게시물로 나눌 것입니다. 이 게시물에는 다음 내용이 포함됩니다:

- Sed 명령 구문
- Sed 스크립트 및 실행 방법
- 명령 대상 지정, 구분자 및 그룹화

명령 구문

모든 다른 프로그래밍 언어와 마찬가지로 Sed에는 구문이 있습니다.

<div class="content-ad"></div>

설명서에 따르면 Sed 명령의 구문은 다음과 같습니다:

[주소]X[명령 옵션]

X는 한 글자 명령입니다. 모든 Sed 명령은 한 글자로만 구성됩니다.

[주소]는 명령 또는 명령 그룹 앞에 나오는 선택적 조건입니다. [주소]는 숫자, 정규 표현식 또는 이전에 설명한 둘 중 하나의 범위일 수 있습니다.

<div class="content-ad"></div>

[command options]은 명령어 X를 제어하는 옵션입니다.

Sed 스크립트

저에게 Sed 스크립트는 단순히 프로그래머가 설정한 순서대로 실행되는 하나 이상의 Sed 명령어 목록입니다. Sed는 호출될 때 하나 이상의 스크립트를 실행할 수 있습니다.

Sed 스크립트는 명령줄에 직접 제공하거나 하나 이상의 파일에 포함하여 Sed에 제공할 수 있습니다. 명령줄에서는 여러 스크립트를 -e 스크립트 또는 --expression=스크립트 명령줄 옵션으로 구분합니다. Sed는 -f 스크립트 | --file=스크립트 명령줄 옵션을 사용하여 파일에서 스크립트를 읽을 수도 있습니다.

<div class="content-ad"></div>

한 행에 여러 명령을 사용하려면 스크립트 내에서 ; 문자를 사용하여 구분합니다. 스크립트가 파일에 저장된 경우 \n도 명령 구분자로 작동합니다.

간단한 예제 몇 가지를 보여드리겠습니다:

```js
$ ## A string
$ declare s="L1\nL2\nL3\n"
$ ## Here Sed executes multiple Sed commands.  A
$ ## single script is entered on the command line.
$ ## Since only 1 script is present, there isn't
$ ## a need for the -e option.
$ ## The script prints each line of the string
$ ## 2 times.  The commands are separated
$ ## with a ';' character.
$ printf "${s}" | sed -n "/L1/p; /L2/p; /L3/p"
L1
L2
L3
$ ## You can also enter 1 or more commands 
$ ## as separate scripts using the -e option
$ printf "${s}" | sed -n -e "/L1/p" -e "/L2/p; /L3/p"
L1
L2
L3 
```

Sed 스크립트가 들어 있는 파일도 만들 수 있습니다:

<div class="content-ad"></div>

```js
# 이것은 demo.sed라는 파일에 저장된 Sed 스크립트입니다.
# # 부호는 주석의 시작을 나타냅니다.
# 여기에 명령어가 있습니다.
/L1/p
/L2/p
/L3/p
# demo.sed의 끝
```

다음과 같이 명령 줄에서 호출할 수 있습니다.

```js
$ printf "${s}" | sed -nEf demo.sed
L1
L2
L3
```

실행 가능한 Sed 스크립트 실행하기


<div class="content-ad"></div>

표 태그를 Markdown 형식으로 변경할 수 있어요.

```js
#!/bin/sed -nEf
##################
# Sed 스크립트 파일: demo.sed
# -n - 자동 출력 비활성화
# -E - 확장 정규 표현식 사용 가능
# -f - 
/L1/p
/L2/p; /L3/p
/L3/ { s/(.*)/\1\nThat's All Folks!!!/; p}
### demo.sed 끝
```

아래와 같이 파일 내에 저장된 Sed 스크립트를 작성하고 실행할 수 있어요:

```js
$ ## 실행 가능하도록 변경
$ chmod 755 ./demo.sed
$ ## 문자열 선언
$ declare s="L1\nL2\nL3\n"
$ ## 실행
$ printf "${s}" | ./demo.sed
L1
L2
L3
That's All Folks!!!!
$ ## 파일에 텍스트 저장
$ printf "${s}" > ./f1.txt
$ ## 이후 처리 가능
$ cat ./f1.txt | ./demo.sed
L1
L2
L3
That's All Folks!!!!
$ ## 또는
$ ./demo.sed ./f1.txt
L1
L2
L3
That's All Folks!!!!
$ ## 정말 그게 다에요
```

<div class="content-ad"></div>

조건문과 주소 지정

만약 [주소]가 없다면, 명령 또는 명령 그룹이 무조건 실행됩니다. 만약 [주소]가 존재한다면, 해당 조건이 명령을 실행하기 위해 충족되어야 합니다. 조건은 숫자 주소나 정규 표현식으로 구성됩니다. 범위 및 기타 표현식도 포함될 수 있으며, 다른 곳에서 논의된 내용일 수 있습니다. 가끔 여기저기 "not"을 사용하기도 합니다.

명령 그룹화

다음 명명 방식을 사용하여 명령을 그룹화할 수 있습니다:

<div class="content-ad"></div>

**address** ' **address1** X1; **address2** X2; ... **addressn** Xn '

들어 가 있는 ''문자는 그룹을 구분하고, [address]는 전체 그룹을 선택합니다. 그룹은 다음과 같이 중첩될 수도 있습니다:

**address_outer**' **address_inner**' **addr1**X1; **addr2**X2 '; **addr3**X3 '

이렇게 함으로써 if-elseif-else 유형의 구조가 포함된 Sed 스크립트를 작성할 수 있습니다.

<div class="content-ad"></div>

유용한 명령줄 옵션과 별명

```js
$ ## -n|--silent|--quite - 자동 인쇄 비활성화
$ ## -E|-r|--regexp-extended - 확장 정규 표현식 활성화
$ ## 일반적으로 다음과 같은 별명을 사용합니다
$ alias sed='sed -E'
$ alias sedn='sed -E -n'
```

다음 자료의 예제를 이해하는 데 충분한 정보입니다.