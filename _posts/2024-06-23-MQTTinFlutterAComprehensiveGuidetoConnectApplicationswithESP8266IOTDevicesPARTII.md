---
title: "Flutter에서 MQTT 사용하여 ESP8266 IoT 기기 연결하는 완벽 가이드  PART II"
description: ""
coverImage: "/assets/img/2024-06-23-MQTTinFlutterAComprehensiveGuidetoConnectApplicationswithESP8266IOTDevicesPARTII_0.png"
date: 2024-06-23 16:56
ogImage:
  url: /assets/img/2024-06-23-MQTTinFlutterAComprehensiveGuidetoConnectApplicationswithESP8266IOTDevicesPARTII_0.png
tag: Tech
originalTitle: "MQTT in Flutter: A Comprehensive Guide to Connect Applications with ESP8266 IOT Devices — PART II"
link: "https://medium.com/@punnyarthabanerjee/mqtt-in-flutter-a-comprehensive-guide-to-connect-applications-with-esp8266-iot-devices-part-ii-2a0c909e01e8"
---

지난 글에서는 Esp8266을 MQTT 브로커에 연결하도록 구성하는 방법에 대해 논의했습니다. 아직 확인하지 않으셨다면, 먼저 그 글을 읽는 것을 적극 권장합니다.

<img src="/assets/img/2024-06-23-MQTTinFlutterAComprehensiveGuidetoConnectApplicationswithESP8266IOTDevicesPARTII_0.png" />

## 파트 3: Flutter 애플리케이션 만들기

먼저 Flutter 앱을 생성하고 원하는 이름으로 지어보세요.

<div class="content-ad"></div>

애플리케이션의 상태를 수정하고 주제를 게시하거나 구독하는 다양한 더 좋은 방법이 있지만, 여기서는 StreamBuilder를 사용하여 간단하게 유지하려고 합니다. 다른 해결책으로는 Bloc, Provider 등이 있을 수 있습니다.

다음 라이브러리/패키지를 설치하십시오.

그런 다음 프로젝트에 위젯을 만드십시오.

```js
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {


  @override
  Widget build(BuildContext context) {
    return Container(); // 이 부분은 나준에 업데이트할 예정입니다.
  }
}
```

<div class="content-ad"></div>

MQTTServerClient 객체를 만들고 Future 객체를 초기화합니다.

```js
class HomePage extends StatefulWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  late MqttServerClient client; // 참고: 브라우저용 MqttBrowserClient도 있습니다

  late Future _onConnect; // 브로커에 연결되었는지 확인하기 위해 사용합니다

  @override
  Widget build(BuildContext context) {
    return Container(); // 이 부분은 나중에 업데이트할 것입니다
  }
}
```

다음으로 연결을 위한 라이프사이클 함수를 만들어보겠습니다.

```js
Future<void> onConnected() async {
  Logger().i("Connected"); // print를 사용하거나 Logger 라이브러리를 설치하여 사용할 수 있습니다

  // "test" 토픽에 구독합니다
  client.subscribe("test", MqttQos.atLeastOnce);

  Logger().i("Subscribed");
}

Future<void> connect() async {
  try {
    Logger().i("Connection Initiated");

    await client.connect("test2", "testpass123A");

  } catch (e) {
    Logger().e(e);
  }
}
```

<div class="content-ad"></div>

그럼 initState 메소드를 작성합니다.

```js
@override
  void initState() {
    super.initState();

    try{
      client = MqttServerClient.withPort("<MQTT 호스트>","<임의의 이름>",<포트 번호 예: 8883>);

      client.secure = true;

      Logger().i("클라이언트가 생성되었습니다");


    Logger().i("프로토콜이 설정되었습니다");

    client.logging(on: true);

    Logger().i("로깅이 설정되었습니다");

    client.onConnected = onConnected;

    _onConnect = connect();

    }catch(e){
      Logger().e(e);
    }

  }
```

마지막으로 위젯을 작성합니다.

```js
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder(
        future: _onConnect,
        builder: (context, snapshot) {

          // 연결이 진행 중인 경우 로딩 화면을 표시합니다
          if(snapshot.connectionState == ConnectionState.waiting){
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          return StreamBuilder<List<MqttReceivedMessage<MqttMessage?>>>(

            stream: client.updates,

            builder: (context, snapshot) {

              if(snapshot.hasData){
                // "test" 토픽에서 Esp8266에서 전송한 데이터를 읽습니다
                final message = snapshot.data!.first.payload as MqttPublishMessage;

                final payload = MqttPublishPayload.bytesToStringAsString(message.payload.message);

                Logger().i(payload);

                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const Text("센서 데이터"),
                      Text(payload),
                    ],
                  ),
                );
              }

              return const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text("데이터 없음"),
                  ],
                ),
              );
            },
          );
        }
      ),
    );
  }
```

<div class="content-ad"></div>

전체 코드

```js
import 'package:flutter/material.dart';
import 'package:logger/web.dart';
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({key});

  // 애플리케이션의 루트인 위젯입니다.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late MqttServerClient client;

  Future<void> onConnected() async {
    Logger().i("Connected");

    // "test" 주제에 구독합니다.
    client.subscribe("test", MqttQos.atLeastOnce);

    Logger().i("Subscribed");
  }

  Future<void> connect() async {
    try {
      Logger().i("Connection Initiated");

      await client.connect("test2","testpass123A");
    } catch(e) {
      Logger().e(e);
    }
  }

  late Future _onConnect;

  @override
  void initState() {
    super.initState();

    try {
      client = MqttServerClient.withPort("<MQTT HOST>","<ANY NAME>",<PORT like 8883>);

      client.secure = true;
      Logger().i("Client created");

      Logger().i("Protocol set");

      client.logging(on: true);
      Logger().i("Logging set");

      client.onConnected = onConnected;

      _onConnect = connect();

    } catch(e) {
      Logger().e(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder(
        future: _onConnect,
        builder: (context, snapshot) {
          if(snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          return StreamBuilder<List<MqttReceivedMessage<MqttMessage?>>>(
            stream: client.updates,
            builder: (context, snapshot) {
              if(snapshot.hasData) {
                // "test" 주제에서 Esp8266이 보낸 데이터를 읽습니다.
                final message = snapshot.data!.first.payload as MqttPublishMessage;
                final payload = MqttPublishPayload.bytesToStringAsString(message.payload.message);
                Logger().i(payload);

                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const Text("Sensor Data"),
                      Text(payload),
                    ],
                  ),
                );
              }

              return const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text("No data"),
                  ],
                ),
              );
            },
          );
        }
      ),
    );
  }
}
```

이제 Esp8266을 전원에 연결하고 앱을 실행하세요.

다음과 같은 화면이 나타납니다.

<div class="content-ad"></div>

![이미지](https://miro.medium.com/v2/resize:fit:1200/1*SWHkvNtFqG3cDvk6oGLxew.gif)

# 우하하 !! 우리가 MQTT를 사용하여 Esp8266에서 앱으로 데이터 성공적으로 전송했어요 !

## 마지막으로

대부분의 경우에는 IOT 디바이스에서 모바일 앱으로 데이터를 직접 전송하는 것은 유용하지 않을 수 있습니다. 센서 데이터와 관련된 많은 처리가 필요하기 때문입니다. 이를 위해 센서에서 데이터를 가져오기 위해 브로커에 연결할 전용 백엔드가 필요하며, 그런 다음 처리된 데이터를 다른 주제에 발행하여 이를 모바일 애플리케이션이 구독하게 할 수 있습니다. 나는 미래에 IOT의 전체 인프라에 대한 자세한 기사를 쓸지도 모르겠어요.

<div class="content-ad"></div>

감사합니다. 궁금한 점이 있으면 언제든지 말해주세요!

만약 유용하다고 느끼신다면 LinkedIn에서 저를 팔로우해 주세요.

<img src="/assets/img/2024-06-23-MQTTinFlutterAComprehensiveGuidetoConnectApplicationswithESP8266IOTDevicesPARTII_1.png" />
