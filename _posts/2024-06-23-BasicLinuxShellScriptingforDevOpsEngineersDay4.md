---
title: "DevOps 엔지니어를 위한 기본적인 리눅스 쉘 스크립팅 Day 4"
description: ""
coverImage: "/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_0.png"
date: 2024-06-23 15:28
ogImage: 
  url: /assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_0.png
tag: Tech
originalTitle: "Basic Linux Shell Scripting for DevOps Engineers (Day4)"
link: "https://medium.com/@araizbinsaqib/day-4-task-basic-linux-shell-scripting-for-devops-engineers-c5b867bc8960"
---


안녕하세요 여러분!
이전 토론에서는 AWS에서 데브옵스 엔지니어를 위한 Linux를 다루었습니다. 아직 확인하지 않으셨다면 [여기]에서 확인해보세요.

오늘은 Linux 셸 스크립팅에 대해 알아볼 것입니다. 지금은 SSH를 사용하여 내 로컬 머신에서 원격으로 AWS의 Ubuntu Linux 서버(프리티어)에 접속하고 있습니다. Secure Shell Protocol (SSH)을 통해 원격 Linux 서버에 안전하게 접속하고 관리할 수 있습니다.

## 데브옵스를 위한 셸 스크립팅이란?

데브옵스를 위한 셸 스크립팅은 Bash (Bourne Again Shell) 또는 다른 호환되는 셸과 같은 셸 언어를 사용하여 개발 및 운영과 관련된 작업을 자동화하는 스크립트를 작성하는 것을 말합니다. 이러한 작업은 시스템 구성 및 관리부터 배포 및 모니터링 프로세스까지 데브옵스 환경에서 가능합니다.

<div class="content-ad"></div>

## #!/bin/bash은 무엇인가요?

#!/bin/bash은 셰뱅 또는 해시뱅 라인이라고 불립니다. 이는 스크립트의 시작 부분에 사용되며 스크립트를 실행하기 위해 사용되어야 하는 해석기를 지정하는 데 사용됩니다. 이 경우, #!/bin/bash은 스크립트가 Bash 쉘에 의해 해석되어야 함을 나타냅니다. 네, #!/bin/sh를 작성하여 시스템의 기본 쉘에 의해 (Bash 또는 Bourne 쉘과 호환되는 다른 쉘일 수도 있음) 스크립트가 해석되도록 할 수도 있습니다.

# Day 4-Task: Linux Shell Scripting:-

오늘은 AWS Ubuntu Linux 서버에서 실행된 명령어 몇 가지를 살펴보겠습니다. 여기에 몇 가지 예시가 있습니다:

<div class="content-ad"></div>

## 메시지 출력:

간단한 셸 스크립트입니다. "내가 #90DaysOfDevOps 챌린지를 완료할 것이다"를 출력합니다.

```js
#!/bin/bash
echo "I will complete #90DaysOfDevOps challenge"
```

예시

<div class="content-ad"></div>


![이미지1](/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_0.png)

![이미지2](/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_1.png)

## 사용자 입력 및 인수

사용자 입력과 인수를 활용하여 Shell Script를 작성하고 변수를 출력합니다.


<div class="content-ad"></div>

```bash
#!/bin/bash
# 이것은 셰뱅 라인입니다. 시스템에 이 스크립트를 해석할 때 Bash 쉘을 사용하라는 것을 나타냅니다.

echo "나는 #90DaysOfDevOps 챌린지를 완료할 것입니다."

# 변수:
name="Araiz"
echo "안녕하세요 ${name}, 나이를 입력해 주세요."

# 사용자 입력 받기:
read age
echo "나의 나이는 ${age}세 입니다."

# 첫 번째 인자 전달($1):
echo "안녕하세요, 저는 $1입니다."
```

예시

![image1](/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_2.png)

![image2](/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_3.png)


<div class="content-ad"></div>

## If-Else Example

두 숫자를 비교하여 쉘 스크립팅에서 If else 예제를 작성해보세요.

```js
#!/bin/bash

num1=5
num2=10

if [ $num1 -gt $num2 ]; then
    echo "$num1가 $num2보다 큽니다"
elif [ $num1 -lt $num2 ]; then
    echo "$num1가 $num2보다 작습니다"
else
    echo "$num1와 $num2는 같습니다"
fi
```

예제

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_4.png)

![Image 2](/assets/img/2024-06-23-BasicLinuxShellScriptingforDevOpsEngineersDay4_5.png)
