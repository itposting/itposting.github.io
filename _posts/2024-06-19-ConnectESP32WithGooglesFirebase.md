---
title: "ESP32를 Google의 Firebase와 연결하기"
description: ""
coverImage: "/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_0.png"
date: 2024-06-19 05:32
ogImage: 
  url: /assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_0.png
tag: Tech
originalTitle: "Connect ESP32 With Google’s Firebase"
link: "https://medium.com/@zalamayank2005/connect-esp32-with-googles-firebase-efb98b7b8eaa"
---


## 이 기사에서📜는 ESP32를 Google Firebase에 가장 빠르게⚡ 연결하는 방법을 보여드리겠습니다. 기대되시나요? 🤩

# ➡️ 하드웨어 요구 사항:

ESP32 개발 보드, LED💡, 브레드보드,

습도 센서 (DHT11)⛅

<div class="content-ad"></div>

# ➡️ Firebase에서 백엔드 설정:

우리는 백엔드로 Google의 Firebase를 사용할 것입니다. 시작하려면 Firebase로 이동해서 Google 계정으로 로그인하세요.

새 프로젝트를 만들려면 프로젝트 추가 옵션을 선택하세요. 프로젝트 이름을 입력하라는 요청이 표시됩니다. 적절한 이름을 입력한 후 계속 버튼을 눌러주세요.

![이미지](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_0.png)

<div class="content-ad"></div>

해당 프로젝트에 대해 "Google Analytics 사용" 옵션을 비활성화하세요. 이 프로젝트에는 필요하지 않습니다.

마지막으로, '프로젝트 생성'을 선택하세요.

![이미지](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_1.png)

Firebase가 프로젝트 설정을 시작합니다. 설정이 완료되면 '계속'을 선택하고, Firebase 콘솔의 프로젝트 개요 페이지로 이동하게 됩니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_2.png" />

# ➡️Authentication Setup :

우리가 먼저 해야 할 일은 프로젝트의 인증 옵션을 설정하는 것입니다. 왼쪽 상단의 인증 메뉴 옵션을 선택하면 인증 페이지로 이동됩니다. 시작하기 버튼을 선택하세요.

<img src="/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_3.png" />


<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_4.png" />

<img src="/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_5.png" />

우리는 ESP32 장치를 위해 익명 로그인을 사용하여 시작할 것이며, 후에 자세한 튜토리얼에서 더 스마트한 로그인 방법을 고안할 것입니다. 상단 사진과 같이 익명 로그인을 활성화하고 저장 옵션을 선택하십시오.

# ➡️실시간 데이터베이스 설정:

<div class="content-ad"></div>

다음으로는 모든 센서 데이터를 보유할 데이터베이스를 만들어야 합니다. 이를 위해 왼쪽 상단의 실시간 데이터베이스 메뉴 옵션을 선택하면 실시간 데이터베이스 페이지로 이동됩니다. 데이터베이스 생성 메뉴를 초기화하려면 데이터베이스 만들기 버튼을 선택하세요.

![이미지](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_6.png)

![이미지](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_7.png)

데이터베이스 생성 메뉴에서 가장 가까운 위치를 선택하고 다음을 선택하세요. 데이터베이스를 잠긴 모드 또는 테스트 모드로 초기화할 수 있는 옵션이 표시됩니다. 일단 테스트 모드를 선택하세요. 주요 차이점은 테스트 모드에서는 30일 동안 데이터베이스에 대한 무단 액세스를 허용하는 데이터베이스 액세스 규칙이 적용된다는 것입니다. 프로젝트를 본격적으로 운용할 계획이라면 향후에 이 기능을 비활성화해야 합니다. 활성화 버튼을 선택하세요.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_8.png)

Rule을 클릭하고 아래 그림에 표시된 대로 코드를 변경하세요.

그리고 Publish 버튼을 누르세요.

![image](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_9.png)


<div class="content-ad"></div>

# ➡️ C 언어로 Arduino IDE 설정 및 코드 설명:

우리가 해야 할 첫 번째 작업은 ESP32 개발 환경을 설정하는 것입니다. 이를 위해 Arduino IDE를 사용합니다. 이미 설치하지 않았다면 여기서 다운로드하고 설치해 주세요. 그리고 제대로 설정해 주세요.

마지막으로, 우리가 프로젝트에서 사용할 모비즈트 라이브러리를 추가해야 합니다. 홈페이지에서 라이브러리 페이지로 이동하여 FirebaseESP32 라이브러리를 검색합니다.

우리가 해야 할 첫 번째 작업은 응용 프로그램에서 필요한 모든 라이브러리를 가져오는 것입니다. Arduino 라이브러리는 기본적으로 이미 설치되어 있어야 합니다.

<div class="content-ad"></div>

```js
#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
```

다음으로 FirebaseESP32 라이브러리에서 사용되는 몇 가지 도우미 라이브러리를 추가해야 합니다. TokenHelper 라이브러리는 토큰 생성 프로세스를 관리하는 데 사용되며, RTDBHelper 라이브러리는 Firebase Realtime Database에서 오는 데이터를 인쇄하는 도우미 함수를 제공합니다.

```js
//토큰 생성 프로세스 정보 제공.
#include "addons/TokenHelper.h"
//RTDB 페이로드 인쇄 정보 및 기타 도우미 함수 제공.
#include "addons/RTDBHelper.h"
```

다음으로 Wi-Fi 자격 증명을 캡처해야 합니다. WIFI_AP를 Wi-Fi 식별자로, WIFI_PASSWORD를 Wi-Fi 암호로 대체하세요.


<div class="content-ad"></div>

참고: 임베디드 애플리케이션에 패스워드 정보를 하드코딩하는 것은 좋지 않은 아이디어입니다. 실제 제품 케이스의 경우 안전한 장치 등록 프로세스를 포함한 장치 프로비저닝 전략을 적용해야 합니다.

```js
#define WIFI_SSID "WIFI_AP"
#define WIFI_PASSWORD "WIFI_PASSWORD"
```

다음으로 API 키를 저장할 상수를 추가해야 합니다. Firebase 프로젝트 API 키는 프로젝트 설정 페이지에서 가져올 수 있습니다. API_KEY를 본인의 API 키로 바꿔주세요. 또한 Firebase 실시간 데이터베이스 URL을 포함하려면 URL을 자신의 것으로 바꿔주세요.

![이미지](/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_10.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ConnectESP32WithGooglesFirebase_11.png" />

```js
// Firebase 프로젝트 웹 API 키
#define API_KEY "API_KEY"
// Firebase 실시간 데이터베이스 URL
#define DATABASE_URL "Database_url"
```

이제 FirebaseESP32 라이브러리에서 가져온 3개의 객체를 초기화합니다. 이 객체들은 애플리케이션을 Firebase와 연결하는 데 중요합니다.

```js
FirebaseData fbdo,fbdo_s1,fbdo_s2;
FirebaseAuth auth;
FirebaseConfig config;
```

<div class="content-ad"></div>

다음으로 유용한 몇 가지 전역 변수를 정의합니다.

```js
bool signUpOK=false;
unsigned long sendDataPrevMillis = 0;
bool ledStatus=false;
float temp=0;
float humidity=0;
#define LED_PIN 22 // for led pin 

#include <DHT.h>  // for humidity sensor
DHT dht(26,DHT11);
```

이제 setup() 함수에 다음 코드를 복사하여 붙여넣으세요:

```js
void setup() {
  
  Serial.begin(115200);
  dht.begin();
  pinMode(LED_PIN,OUTPUT);
  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  Serial.print("Wi-Fi에 연결 중");

  while(WiFi.status()!= WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }

  Serial.println();
  Serial.print("IP 주소로 연결됨: ");
  Serial.println(WiFi.localIP());
  Serial.println();
 config.api_key=API_KEY;
 config.database_url=DATABASE_URL;

 if(Firebase.signUp(&config,&auth, "", "")){
     Serial.println("가입 성공");
     signUpOK=true;
 }

config.token_status_callback=tokenStatusCallback;

Firebase.begin(&config,&auth);
Firebase.reconnectWiFi(true);

if(!Firebase.RTDB.beginStream(&fbdo_s1,"/LED/digital")){

  Serial.println("실패: "+fbdo_s1.errorReason());
}
 
}
```

<div class="content-ad"></div>

void loop() 함수 안에 아래 코드를 복사하여 붙여넣기 해주세요:

```js
void loop() {

// DHT 센서
    if(Firebase.ready() && signUpOK && (millis()-sendDataPrevMillis>5000 || sendDataPrevMillis == 0)){
      sendDataPrevMillis =millis();
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();

  if(Firebase.RTDB.setFloat(&fbdo,"Sensor/temp_data",temp)){
   Serial.println();
   Serial.print(temp);
   Serial.println("-"+fbdo.dataPath()+"에 성공적으로 저장되었습니다.");
   Serial.println("("+fbdo.dataType()+")");
    }

    else{
      Serial.println("실패 : "+fbdo.errorReason());
    }
  
    if(Firebase.RTDB.setFloat(&fbdo,"Sensor/humidity_data",humidity)){
   Serial.println();
   Serial.print(humidity);
   Serial.println("-"+fbdo.dataPath()+"에 성공적으로 저장되었습니다.");
   Serial.println("("+fbdo.dataType()+")");
    }

    else {
      Serial.println("실패 : "+fbdo.errorReason());
    }
    }
// LED를 위한 스팀 빌더    

if(Firebase.ready() && signUpOK){

    
  if(!Firebase.RTDB.readStream(&fbdo_s1)){
 
    Serial.println("실패 : "+fbdo_s1.errorReason());
  }
     
     if(fbdo_s1.streamAvailable()){
     if(fbdo_s1.dataType()== "boolean"){
    ledStatus=fbdo_s1.boolData();
Serial.println("성공적으로 읽어왔습니다: "+fbdo_s1.dataPath()+ " - ("+fbdo_s1.dataType()+")");
      if(ledStatus==true){
      digitalWrite(LED_PIN,HIGH);  
      }
      else{
        digitalWrite(LED_PIN,LOW);
      }

      }
      else{
      Serial.println("실패 : "+fbdo_s1.errorReason());
    }
    }

    } 

}
```

이제 회로를 코드와 지시 사항대로 브레드보드에 연결하고,

ESP32에 코드를 업로드하세요.

<div class="content-ad"></div>

# ➡️ 다음 부분:

플러터 앱을 Firebase와 어떻게 연결할까요? 🙋‍♂️ 다음 글에서 설명하겠습니다.

의문이 있으면 언제든지 물어보세요. 🆘