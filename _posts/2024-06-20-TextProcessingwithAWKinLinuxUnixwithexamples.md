---
title: "리눅스 Unix에서 예제를 활용한 AWK를 이용한 텍스트 처리"
description: ""
coverImage: "/assets/img/2024-06-20-TextProcessingwithAWKinLinuxUnixwithexamples_0.png"
date: 2024-06-20 14:11
ogImage: 
  url: /assets/img/2024-06-20-TextProcessingwithAWKinLinuxUnixwithexamples_0.png
tag: Tech
originalTitle: "Text Processing with AWK in Linux Unix with examples"
link: "https://medium.com/@ahmedmansouri/text-processing-with-awk-in-linux-unix-with-examples-26b7b1f1f5d3"
---



![Image](/assets/img/2024-06-20-TextProcessingwithAWKinLinuxUnixwithexamples_0.png)

awk은 패턴 스캔 및 처리를 위한 강력한 프로그래밍 언어이자 명령 줄 유틸리티입니다. 주로 텍스트 처리에 사용되며 데이터 추출 및 보고 도구로 사용됩니다. 본 안내서는 awk의 기본 개념을 이해하는 데 도움을 주고 Linux/Unix 환경에서 효과적으로 사용하는 방법을 보여줄 것입니다.

# awk 소개

awk은 창안자 Alfred Aho, Peter Weinberger, Brian Kernighan의 이름에서 따왔습니다. 사용자가 지정한 패턴과 작업을 적용하여 텍스트를 한 줄씩 처리합니다.


<div class="content-ad"></div>

# 기본 구문

awk의 기본 구문은 다음과 같습니다:


awk '패턴 { 동작 }' 파일


- 패턴: 일치시킬 조건을 지정합니다.
- 동작: 패턴이 일치할 때 무엇을 할지 지정합니다.

<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경할 수도 있어요.

```js
echo "text" | awk 'pattern { action }'
```

# 주요 사용 사례 및 예시

data.txt라는 파일을 고려해보세요.

<div class="content-ad"></div>

```js
John Doe 30 180
Jane Smith 25 165
Alice Johnson 35 170
Bob Brown 28 175
Charlie White 32 160
```

<img src="/assets/img/2024-06-20-TextProcessingwithAWKinLinuxUnixwithexamples_1.png" />

## 1. Printing Specific Columns separated by space

To print the first names (1st field) and ages (3rd field) separated by space:

<div class="content-ad"></div>

```js
awk '{ print $1, $3 }' data.txt


----- 출력 결과 -----

John 30
Jane 25
Alice 35
Bob 28
Charlie 32
```

## 2. 특정 문자로 구분된 특정 열 출력

이름(첫 번째 열)과 나이(세 번째 열)을 세미콜론으로 구분하여 출력하는 방법:

```js
awk '{ print $1 ";" $3 }' data.txt


----- 출력 결과 -----

John;30
Jane;25
Alice;35
Bob;28
Charlie;32
```

<div class="content-ad"></div>

## 3. 조건에 따라 행 필터링하기

네 번째 열이 169보다 큰 경우 모든 행 출력합니다.

```js
awk '$4 > 169' data.txt


----- 결과 -----

John Doe 30 180
Alice Johnson 35 170
Bob Brown 28 175
```

## 4. 특정 단어를 포함하는 행 출력

<div class="content-ad"></div>

"John"이라는 단어를 포함하는 줄을 출력합니다.

```js
awk '/John/' data.txt


----- 출력결과 -----

John Doe 30 180
Alice Johnson 35 170
```

로그 파일을 처리하고 "Error" 또는 "Warning"과 같은 키워드를 포함하는 줄을 검색할 때 유용하게 사용할 수 있습니다.

## 5. 열을 합산하기

<div class="content-ad"></div>

각 줄의 3번째와 4번째 열의 합계를 출력합니다.

```js
awk '{ print $3 + $4 }' data.txt


----- 결과 -----

210
190
205
203
192
```

- 다른 방법 (변수 사용)

```js
awk '{ sum=$3+$4 ; print sum }' data.txt
```

<div class="content-ad"></div>

## 6. 합계 값

세 번째 열의 값을 합산하고 총합을 출력합니다.

```js
awk '{ sum+=$3 } END { print sum }' data.txt


----- 출력 결과 -----

150
```

## 7. 평균 계산

<div class="content-ad"></div>

평균 연령을 계산하려면 (세 번째 필드):

```js
awk '{ sum += $3; count++ } END { print sum / count }' data.txt


## 8. 라인 번호 출력

각 라인에 라인 번호를 추가하고 출력합니다.

<div class="content-ad"></div>

awk '{print NR, $0}' data.txt

----- 출력 -----

1 John Doe 30 180
2 Jane Smith 25 165
3 Alice Johnson 35 170
4 Bob Brown 28 175
5 Charlie White 32 160

## 9. 필드 수 출력

각 줄의 필드 수를 출력합니다.

awk '{ print "Number of fields:", NF }' data.txt

----- 출력 -----

Number of fields: 4
Number of fields: 4
Number of fields: 4
Number of fields: 4
Number of fields: 4

<div class="content-ad"></div>

## 10. 첫 번째 및 마지막 필드 인쇄

awk '{ print $1, $NF }' data.txt


----- 출력 -----

John 180
Jane 165
Alice 170
Bob 175
Charlie 160

## 11. 대문자로 필드 인쇄

첫 번째 필드를 대문자로 출력

<div class="content-ad"></div>

awk '{ print toupper($1) }' data.txt


### 결과

JOHN
JANE
ALICE
BOB
CHARLIE

## 12. 필드로부터 하위 문자열 추출

2번째 필드에서 하위 문자열 추출: 1번째 문자부터 3번째 문자까지

awk '{print substr($2,1,3)}' data.txt


### 결과

Doe
Smi
Joh
Bro
Whi

<div class="content-ad"></div>

## 13. 각 줄의 필드 길이 출력

각 줄의 2번째 필드의 길이를 출력합니다.

awk '{ print length($2) }' data.txt


----- 출력 결과 -----

3
5
7
5
5

## 14. 사용자 정의 함수

<div class="content-ad"></div>

보다 복잡한 작업을 위해 awk 스크립트 내에서 함수를 정의할 수 있어요:

awk '
function square(x) { return x * x }
{ print $3, " --> square :" , square($3) }
' data.txt


----- 출력 -----

30  --> square : 900
25  --> square : 625
35  --> square : 1225
28  --> square : 784
32  --> square : 1024

# 결론

awk는 여러 가지 방식으로 텍스트 파일을 조작하고 분석하는 데 도움이 되는 다재다능한 도구입니다. 데이터 추출, 계산 수행, 또는 텍스트 변환 등이 목적이라면 awk가 작업을 간소화하는 강력한 기능 세트를 제공합니다.

<div class="content-ad"></div>

awk 명령어를 실험해보세요! 이를 통해 Linux/Unix에서 더 효율적인 텍스트 처리를 위한 워크플로에 효과적으로 통합할 수 있습니다.