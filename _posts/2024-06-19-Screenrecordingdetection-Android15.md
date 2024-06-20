---
title: "화면 녹화 감지 - 안드로이드 15"
description: ""
coverImage: "/assets/img/2024-06-19-Screenrecordingdetection-Android15_0.png"
date: 2024-06-19 21:34
ogImage: 
  url: /assets/img/2024-06-19-Screenrecordingdetection-Android15_0.png
tag: Tech
originalTitle: "Screen recording detection-Android 15"
link: "https://medium.com/@navczydev/screen-recording-detection-android-15-26ee709b66b4"
---


![이미지](/assets/img/2024-06-19-Screenrecordingdetection-Android15_0.png)

안드로이드 15에는 여러 개인 정보 보호 기능이 제공됩니다. 이 기사에서는 이 중 하나인 화면 녹화 감지에 대해 논의할 것입니다 ⏺

# 모든 것이 예상대로 작동되도록 하는 4단계 절차

# 1️⃣. — install-time 권한을 앱의 AndroidManifest.xml 파일에 추가하기

<div class="content-ad"></div>

```java
<uses-permission android:name="android.permission.DETECT_SCREEN_RECORDING" />
```

# 2️⃣. — 스크린 녹화 콜백 정의

```java
private val screenRecordingCallback = { state: Int ->
    when (state) {

        SCREEN_RECORDING_STATE_VISIBLE -> {
            // 녹화 중이에요 - 사용자에게 알림
           
        }

        else -> {
            // 녹화 중이 아닙니다
        }
    }
}
```

# 3️⃣. — 콜백 추가 — WindowManager


<div class="content-ad"></div>

- WindowManager.addScreenRecordingCallback()을 사용할 것입니다. 이 함수는 2개의 필수 매개변수를 필요로합니다:

  - Executor,
  - Consumer<Integer>

```kotlin
@RequiresApi(35)
override fun onStart() {
    //...
    val initialState =
        windowManager.addScreenRecordingCallback(
            mainExecutor, 
            screenRecordingCallback
        )
    
    Log.d("MainActivity", "onStart: Initial state: $initialState")
    
    // 초기 상태로 콜백을 트리거합니다
    screenRecordingCallback.invoke(initialState)
}
```

# 4️⃣. — 콜백 제거 — WindowManager

<div class="content-ad"></div>

- 활동이 활성 상태일 때만 콜백을 수신하도록 활동의 onStop 메서드가 호출될 때 콜백을 제거해야 합니다.
- WindowManager.removeScreenRecordingCallback() 메서드를 사용하여 콜백을 제거합니다. 이 메서드는 단일 비널 매개변수 `Consumer<Integer>`를 사용합니다.

```js
/** 활동의 화면 녹화 감지 모니터링을 중지합니다 */
@RequiresApi(35)
override fun onStop() {
    // ...
    windowManager.removeScreenRecordingCallback(screenRecordingCallback)
}
```

## 오늘은 여기까지입니다. 새로운 것을 배워서 좋았으면 좋겠어요

# 연락을 유지해주세요

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-Screenrecordingdetection-Android15_1.png" />

# 참고 자료