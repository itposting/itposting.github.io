---
title: "undefined"
description: ""
coverImage: "/assets/img/undefined_0.png"
date: 2024-05-18 15:18
ogImage: 
  url: /assets/img/undefined_0.png
tag: Tech
originalTitle: "undefined"
link: "https://medium.com/@asbahishaq/freeze-in-ruby-what-exactly-is-it-used-for-defbbd523e48"
---


Ruby에서 freeze는 무엇에 사용되는 거죠?

우리는 루비에서 이렇게 대문자로 상수를 생성할 수 있어요:

```js
class DemoClass
  FIRST_CONSTANT = "constant 1"
end
```

이제 여기 문제점이 있는데, 실제로는 상수가 아니에요. 적어도 오래된 루비에는 그렇지 않아요.

<div class="content-ad"></div>

동결이 어디에 들어가는 걸까요?

![이미지](/assets/img/undefined_0.png)

## 상수는 무엇인가요? 어떻게 정의하나요?

상수라는 단어 자체가 변하지 않는 것을 의미합니다. 하지만 위의 예제에서 FIRST_CONSTANT은 변경할 수 없는 것일까요? 새로운 루비 버전에서는 기본적으로 상수지만, 이전 버전에서는 상수로 만들려면 .freeze를 사용해야 합니다.

<div class="content-ad"></div>

## 메서드 내에서 상수를 정의하면 어떻게 됩니까?

```js
def test_method
  FIRST_CONSTANT = "constant 1"
end
```

위 예제와 같이 메서드 내에서 상수를 정의하려고 하면 오류가 발생합니다: 동적 상수 할당

메서드 내에 상수를 정의하려고 시도하면 해당 메서드가 호출될 때마다 생성되기 때문에 오류가 발생합니다.

<div class="content-ad"></div>

## 메소드 안에서 변수를 어떻게 동결하면 될까요?

```ruby
def test_method
  first_variable = "상수 1".freeze
end
```

이제 이렇게 하면 오류가 발생하지는 않지만, first_variable이 이제 상수인 것은 아닙니다. 이렇게 하면 값인 "상수 1"을 동결시키는 것 뿐입니다. 변수의 값을 변경하더라도 오류 없이 수행됩니다.

```ruby
def test_method
  first_variable = "상수 1".freeze

  first_variable = "새 값"
  puts first_variable
end
```

<div class="content-ad"></div>

위의 코드는 새로운 값을 출력할 것입니다.

값을 "동결"한다는 것은 무엇을 의미할까요? 문자열 상수 1이 어떻게 동결되는 걸까요?

test_method 메서드가 호출될 때마다, 루비는 상수 1에 대한 새 문자열 객체를 생성하지만, 이를 동결하면 루비는 한 번만 생성하고 메모리에 저장합니다. 이렇게 하면 객체를 생성하는 데 소요되는 시간이 단축되어 코드 실행 속도가 더 빨라집니다.

이제 상수 1이 어떻게 동결되는지 설명해 드리겠습니다.

<div class="content-ad"></div>

```js
def test_method
  first_variable = "constant 1".freeze

  first_variable << "append value"
  puts first_variable
end
```

위의 코드를 실행하면 'can`t modify frozen string'라는 오류가 발생합니다. constant 1로 지정된 문자열은 동결되어 있지만 변수인 first_variable은 다른 값으로 지정될 수 있습니다.
