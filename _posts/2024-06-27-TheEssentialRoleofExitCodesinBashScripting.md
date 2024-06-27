---
title: "Bash 스크립트에서 Exit Code의 필수 역할"
description: ""
coverImage: "/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_0.png"
date: 2024-06-27 18:35
ogImage: 
  url: /assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_0.png
tag: Tech
originalTitle: "The Essential Role of Exit Codes in Bash Scripting"
link: "https://medium.com/devops-dev/the-essential-role-of-exit-codes-in-bash-scripting-ca87b03340b2"
---


## 파트 4: if 문과 함께 종료 코드 사용하기, 종료 코드를 강제로 조작하기.

![이미지](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_0.png)

## 리눅스에서의 종료 코드란:

리눅스 및 유닉스와 유사한 시스템에서는 종료 코드(exit code)란 명령어나 스크립트가 완료된 후에 반환되는 숫자 값입니다. 해당 코드는 명령어나 스크립트 실행의 성공 또는 실패를 나타냅니다.

<div class="content-ad"></div>

여기 몇 가지가 있습니다:

- 0: 성공. 명령 또는 스크립트가 오류 없이 성공적으로 실행되었습니다.
- 1: 일반 오류. 명령이나 스크립트에서 오류가 발생했습니다.
- 2: 쉘 내장 명령의 오용 (Bash 문서에 따라).
- 127: 명령을 찾을 수 없음. 시스템의 PATH에서 찾으려는 명령을 찾을 수 없을 때 발생합니다.

모든 0이 아닌 종료 코드는 일종의 실패로 간주될 수 있습니다.

![이미지](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_1.png)

<div class="content-ad"></div>

```bash
#!/bin/bash

app=randomtext

sudo apt install $app

echo "The installation status for $app is: $?"
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_3.png)

## 작업 수행을 위한 종료 코드 사용:

결과에 따라 조건문과 종료 코드를 사용해서 특정 작업을 수행할 수 있습니다.
예를 들어, 하나가 실패할 경우 diff 명령어를 실행할 수 있습니다.

```bash
#!/bin/bash

app=curly

sudo apt install $app

#echo "The installation status for $app is: $?"

if [ $? -eq 0 ]
then
        echo "$app이(가) 설치되었습니다."
        which $app
else
        echo "$app이(가) 설치에 실패했습니다. 스크립트를 확인해주세요."
fi
```


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_4.png)

종료 상태를 확인할 때는 올바른 위치에 확인을 배치해야 합니다.

예를 들어, 위 스크립트에서 echo 문을 주석 처리를 해제하면 결과가 다릅니다.

![이미지](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_5.png)


<div class="content-ad"></div>

이 스크립트는 일반적인 apt 오류가 해당 패키지를 찾을 수 없다고 말하더라도 "curly was installed"를 출력합니다.

왜냐하면? 이전 echo 문이 그렇습니다. echo의 실행이 성공적이었고 상태가 0으로 변경되었습니다. 이제 우리는 echo 이후의 상태를 확인하기 때문에 조건이 일치합니다.

## 종료 상태 강제하기:

"exit" 키워드를 사용하여 스크립트가 특정 종료 코드로 실행되도록 강제할 수 있습니다.

<div class="content-ad"></div>

```bash
#!/bin/bash

echo "Hello World"

echo "위 명령문에 대한 정상 종료 코드는: $?, 'echo \$?'로 확인하세요"

exit 155

echo "Hi"
```

이 스크립트는 처음 두 개의 echo 문을 출력하고 종료 코드는 설정한 값이 될 것입니다.

![이미지](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_6.png)

exit 문은 설정한 값에 관계없이 스크립트 실행을 종료합니다.

<div class="content-ad"></div>

비슷하게, 종료 코드를 0으로 설정했을 경우에는 명령 실패에도 상태가 0이 됩니다.

```bash
#!/bin/bash

xyz

echo "위 명령문의 일반적인 종료 코드는: $?, 'echo \$?'로 확인하세요"

exit 0

echo "안녕"
```

![이미지](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_7.png)

if 블록 내부에서의 종료도 블록만 종료하는 것이 아니라 전체 스크립트를 종료합니다.

<div class="content-ad"></div>

```bash
a=5 # try 7

if [ $a -eq 5 ]
then
   echo "condition is true"
   exit 0
else
    echo "condition is false"
    exit 1
    echo "end else"
fi
echo "the end"
```

![Image](/assets/img/2024-06-27-TheEssentialRoleofExitCodesinBashScripting_8.png)

참고: 코드가 없는 상태의 exit문도 스크립트를 종료합니다.

이상으로 모두 설명했습니다.


<div class="content-ad"></div>

참고 자료: LearnLinuxTV

더 많은 내용을 보시려면 Bash를 참조하세요: