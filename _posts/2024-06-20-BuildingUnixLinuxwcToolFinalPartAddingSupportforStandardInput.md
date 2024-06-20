---
title: "유닉스 리눅스 wc 도구 만들기 최종 파트 표준 입력 지원 추가하기"
description: ""
coverImage: "/assets/img/2024-06-20-BuildingUnixLinuxwcToolFinalPartAddingSupportforStandardInput_0.png"
date: 2024-06-20 14:20
ogImage: 
  url: /assets/img/2024-06-20-BuildingUnixLinuxwcToolFinalPartAddingSupportforStandardInput_0.png
tag: Tech
originalTitle: "Building Unix Linux wc Tool Final Part: Adding Support for Standard Input"
link: "https://medium.com/@jonathanzihindula95/building-unix-linux-wc-tool-final-part-adding-support-for-standard-input-7daeb9978ba4"
---


<img src="/assets/img/2024-06-20-BuildingUnixLinuxwcToolFinalPartAddingSupportforStandardInput_0.png" />

지금까지 시리즈의 이전 부분을 읽지 않으셨다면, 먼저 읽어보시는 것을 권장합니다 :)

1. Part I: 이 부분에서는 wccommand의 기본 구성, 파일 크기 계산만을 지원하는 데 중점을 뒀습니다.
   
2. Part II: Part II에서는 라인 카운터 플래그를 지원하도록 추가하는 데 중점을 뒀습니다.

<div class="content-ad"></div>

3. Part III: 이번 글은 최신 글로, 단어 카운터 플래그를 지원하는 데 초점을 맞추었습니다.

이제 현재 목표로 돌아가 봅시다. 이 목표에는 두 단계가 있습니다:

- 기본 옵션을 지원하는 것, 즉 어떤 옵션이 제공되지 않았을 때입니다. 이는 -c, -l 및 -w 옵션과 동등합니다.

```js
go run main test.txt
// 결과: 7145   58164  342190 test.txt
```

<div class="content-ad"></div>

- 입력 파일 이름이 지정되지 않은 경우 표준 입력에서 읽어 들일 수 있는 지원 추가

```js
cat test.txt | go run main.go -l
// 결과: 7145
```

## 1. 기본 옵션 지원

파일 내 라인 수, 단어 수 등을 얻는 서로 다른 로직을 처리하는 함수가 이미 있었습니다. 이 목표를 달성하기 위한 접근 방법은 ProcessFile 함수에 콜백 함수를 전달하여 파일의 바이트 수, 파일 내 라인 수 및 파일 내 단어 수를 얻는 데 책임이 있는 세 가지 함수를 호출하고 그 결과를 출력하는 것이었습니다.

<div class="content-ad"></div>

```js
ProcessFile(args[0], func(s string) {
    byteNumber := getByteNumber(&s, nil)
    lineNumber := getNumberOfLines(&s, nil)
    wordNumber := countWords(s)

    fmt.Println(byteNumber, lineNumber, wordNumber, s)
})
```

## 2. 표준 입력 지원

이 목표를 달성하는 것은 조금 복잡했습니다. 이전 구현에서 빈 플래그를 가져올 수 없는 이유를 알아내려고 몇 시간을 보냈습니다.

다음 코드를 고려해보겠습니다. 이 코드는 파일의 바이트 수를 얻는 데 사용되는 c 플래그를 생성합니다.

<div class="content-ad"></div>

```js
byteNumber := flag.String(byteNumberFlag, "", "파일 바이트 수를 얻는 플래그")
```

만약 플래그에 어떤 인자도 전달하지 않는다면, 해당 플래그의 기본값을 빈 문자열로 설정했기 때문에 빈 문자열이 반환될 것으로 생각했습니다. 그러나 실제 상황은 다릅니다. 파싱 로직에서, 플래그에 인자가 없는 경우 flag.Parse는 자동으로 도움말 플래그가 있는 경우 해당 플래그를 반환하거나, 2의 종료 상태를 갖는 패닉을 발생시키도록 구현되어 있습니다.

이 문제에 직면하여, 파싱하기 전에 인수에 액세스할 다른 방법을 찾았습니다. 표준 라이브러리인 os의 도움을 통해 예상보다 쉽게 해결했습니다. 접근 방식은 다음과 같습니다:

- 입력 파일을 스캔하고 해당 내용을 반환합니다.
- 전달된 인수를 가져옵니다.
- 전달된 인수의 길이를 확인합니다.
- 길이가 하나인 경우, 다른 플래그와 비교합니다.
- 각 플래그에 대해 해당 함수를 실행합니다.

<div class="content-ad"></div>

```go
// 명령줄 인수 가져오기
args := os.Args[1:]

if len(args) == 1 { // 정확히 하나의 인수가 제공되었는지 확인
    // 플래그의 "-" 문자를 피하기 위해 단일 인수의 마지막 문자를 가져와서 플래그를 결정
    flag_ := args[0][len(args[0])-1:]

    // 플래그 값에 따라 다른 경우 처리
    switch flag_ {
    case byteNumberFlag: // 바이트 수 세는 경우
        // 표준 입력에서 읽기
        stdin := handleStandardInput()
        fmt.Println(getByteNumber(nil, &stdin))
    case linesCounterFlag: // 줄 수 세는 경우
        stdin := handleStandardInput()
        fmt.Println(getNumberOfLines(nil, &stdin))
    case wordsCounterFlag: // 단어 수 세는 경우
        stdin := handleStandardInput()
        wordsSlice := strings.Fields(stdin)
        fmt.Println(len(wordsSlice))
    case characterCounterFlag: // 문자 수 세는 경우
        stdin := handleStandardInput()
        // 입력의 UTF-8 룬 수 세기
        runes := utf8.RuneCountInString(stdin)
        fmt.Println(runes)
    default: // 파일 처리의 기본 경우
        ProcessFile(args[0], func(s string) {
            byteNumber := getByteNumber(&s, nil)
            lineNumber := getNumberOfLines(&s, nil)
            wordNumber := countWords(s)

            // 바이트, 줄, 단어 수를 문자열과 함께 출력
            fmt.Println(byteNumber, lineNumber, wordNumber, s)
        })
    }
    return // 인수 처리 후 종료
}
```

참고: 이 마지막 단계를 작동하도록 도우미 함수에 일부 변경을 가했습니다.

읽어주셔서 감사합니다! 다음 도전에 주목해주세요. 이 도전의 전체 소스 코드는 여기에서, 도전 설명은 여기에서 찾을 수 있습니다.