---
title: "파이썬에서 return을 사용할 때 발생하는 잘못된 구문 오류 해결하기"
description: ""
coverImage: "/assets/img/2024-05-27-PythonReturnInvalidSyntaxError_0.png"
date: 2024-05-27 13:53
ogImage: 
  url: /assets/img/2024-05-27-PythonReturnInvalidSyntaxError_0.png
tag: Tech
originalTitle: "Python Return Invalid Syntax Error"
link: "https://medium.com/@fixitblog/solved-python-return-invalid-syntax-error-b44078761163"
---


라즈베리 파이에서 간단한 파이썬 프로그램을 작성 중이며 파이썬 프로그래밍이 처음이라고 하셨군요. GetMessage라는 매개변수가 없고 data라는 변수를 반환하는 함수를 정의했는데, 다음과 같은 오류가 발생하고 있다고 하셨군요.

```js
^
```

해당 오류가 발생하는 이유와 어떻게 해결할 수 있는지 알려드리겠습니다.

<div class="content-ad"></div>

수정 사항: 전역 변수로 데이터를 정의했고, 지금 발생한 오류는

```js
^
```

# 해결 방법

코드에 여러 구문 문제가 있습니다. 코드 구문을 이해하지 못할 때 발생하는 SyntaxError 예외의 특성 때문에 오류 메시지가 문제의 원인인 적절한 줄을 식별하지 못할 수 있습니다.

<div class="content-ad"></div>

제가 먼저 발견한 구문 오류는 GetMessage 함수에서 반복문 내에 없는 상태에서 break를 사용하고 있다는 것입니다. break 문은 for 또는 while 블록 내에서만 유용하며, 다른 곳에서 사용하는 것은 구문 오류입니다.

다음으로 발견된 오류는 누락된 콜론과 관련이 있습니다. DecodeInput 및 SetPower의 각 조건 분기가 조건 뒤에 콜론이 있어야 합니다: if 조건1:, elif 조건2:, else:

또한 elif 대신 else if를 사용하는 것은 오류입니다 (별도의 if 문을 사용하여 일부 조정을 했다고 한다면 작동할 수 있지만, 공간을 낭비하게 될 것입니다).

추가 문제들도 있지만 구문 오류는 아닙니다. 예를 들어, 함수를 정의하기 전에 상위 코드에서 함수를 호출하는 것이 있으며, DecodeInput에는 아무 작업도 수행하지 않는 SetPower 표현이 있는데, 아마도 인수를 전달하여 SetPower를 호출하길 원할 것입니다.

<div class="content-ad"></div>

희망을 가질 때 올바른 방향으로 나아갈 수 있기를 바랍니다.

답변 작성자 - Blckknght

답변 확인자 - Marilyn (FixIt 자원봉사자)

해당 내용은 스택 오버플로우에서 수집되었으며, cc by-sa 2.5, cc by-sa 3.0 및 cc by-sa 4.0로 라이선스가 부여되어 있습니다.