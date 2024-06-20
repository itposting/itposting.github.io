---
title: "시스템디 systemd를 사용하여 리눅스 서비스 만들기"
description: ""
coverImage: "/assets/img/2024-06-20-CreatingaLinuxservicewithsystemd_0.png"
date: 2024-06-20 14:19
ogImage: 
  url: /assets/img/2024-06-20-CreatingaLinuxservicewithsystemd_0.png
tag: Tech
originalTitle: "Creating a Linux service with systemd"
link: "https://medium.com/@benmorel/creating-a-linux-service-with-systemd-611b5c8b91d6"
---



![이미지](/assets/img/2024-06-20-CreatingaLinuxservicewithsystemd_0.png)

웹 애플리케이션을 작성하는 동안, 계산이 많이 드는 작업을 비동기식 작업자 스크립트로 옮기거나 나중에 작업을 예약하거나, 심지어 클라이언트와 직접 통신하기 위해 소켓을 수신하는 데몬을 작성해야 하는 경우가 종종 있습니다.

가끔 더 나은 도구가 있을 수도 있지만—항상 기존 소프트웨어를 먼저 사용하는 것을 고려하십시오—직접 서비스를 작성함으로써 제약사항에 바인딩되어 있을 때 얻을 수 없는 유연성을 얻을 수 있습니다.

멋진 점은 리눅스 서비스를 만들기가 상당히 쉽다는 것입니다: 원하는 프로그래밍 언어로 장기 실행 프로그램을 작성하고, systemd를 사용하여 서비스로 변환하십시오.


<div class="content-ad"></div>

# 프로그램

PHP를 사용하여 작은 서버를 만들어 봅시다. 놀라실 거예요, 하지만 상당히 잘 작동합니다. UDP 포트 10000에서 수신 대기하고, 받은 메시지를 ROT13 변환하여 반환할 거에요.

시작해 볼까요?

```js
$ php server.php
```

<div class="content-ad"></div>

그리고 다른 터미널에서 테스트해보세요:

```js
$ nc -u 127.0.0.1 10000
Hello, world!
Uryyb, jbeyq!
```

와우, 잘 작동하네요. 이제 우리는 이 스크립트가 항상 실행되도록 하고, 실패(예기치 않은 종료)할 경우 다시 시작되며 서버 재부팅 후에도 살아남을 수 있기를 원합니다. 그럴 때 systemd가 필요합니다.

# 서비스로 변경

<div class="content-ad"></div>

/etc/systemd/system/rot13.service이라는 파일을 만들어보겠습니다:

```js
[Unit]
Description=ROT13 데모 서비스
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=여러분의_사용자이름
ExecStart=/usr/bin/env php /스크립트/경로/server.php

[Install]
WantedBy=multi-user.target
```

다음을 수행해야 합니다:
- User= 뒤에 실제 사용자 이름 설정하기
- ExecStart=에 스크립트의 적절한 경로 설정하기

<div class="content-ad"></div>

그게 다에요. 이제 서비스를 시작할 수 있어요:

```js
$ systemctl start rot13
```

그리고 부팅 시 자동으로 시작되도록 설정할 수 있어요:

```js
$ systemctl enable rot13
```

<div class="content-ad"></div>

# 더 나아가기

이제 서비스가 (아마도) 작동되므로 구성 옵션을 조금 더 심층적으로 탐색하여 항상 예상대로 작동하는지 확인하는 것이 중요할 수 있습니다.

## 올바른 순서로 시작하기

After= 지시문이 무엇을 하는 지 궁금해할 수도 있습니다. 이는 단순히 서비스가 네트워크가 준비되자마자 시작되어야 한다는 것을 의미합니다. 만약 프로그램이 MySQL 서버가 가동되고 작동 중인 것을 기대한다면 다음을 추가해야 합니다:

<div class="content-ad"></div>


## 종료 시 재시작

기본적으로 systemd는 프로그램이 어떤 이유로든 종료되면 서비스를 다시 시작하지 않습니다. 일반적으로 항상 사용 가능해야 하는 서비스에 대해 원하는 동작이 아니므로 종료 시 항상 다시 시작하도록 지시합니다:

```js
Restart=always
``` 

<div class="content-ad"></div>

테이블 태그를 마크다운 형식으로 바꿀 수도 있어요.

<div class="content-ad"></div>

저는 개인적으로 이 부분에 두 번 이상 빠져들었어요. 기본적으로 우리가 하는 것처럼 Restart=always를 설정하면 systemd가 서비스가 10초 간격 내에 5번 이상 시작하지 못하면 다시 시작하는 것을 포기합니다. 영원히요.

이에 대한 두 가지 [Unit] 구성 옵션이 있어요:

```js
StartLimitBurst=5
StartLimitIntervalSec=10
```

또한 RestartSec 지시문은 결과에 영향을 줍니다: 3초 후에 다시 시작하도록 설정하면 10초 내에 5번의 실패한 재시도에 도달할 수 없어요.

<div class="content-ad"></div>

항상 작동하는 간단한 해결책은 StartLimitIntervalSec=0로 설정하는 것입니다. 그렇게 하면 systemd가 서비스를 영원히 다시 시작하려고 시도할 것입니다.

그러나 너무 많은 스트레스를 서버에 가하지 않기 위해 RestartSec를 적어도 1초로 설정하는 것이 좋습니다.

대안으로는 기본 설정을 그대로 두고 StartLimitAction=reboot를 사용하여 시작 제한이 도달했을 때 systemd에 서버를 다시 시작하도록 요청할 수 있습니다.

# 정말 그게 다인가요?

<div class="content-ad"></div>

요즘에는 RHEL/CentOS, Fedora, Ubuntu, Debian 등에서 systemd가 기본 init 시스템으로 사용되고 있으므로, 아마도 귀하의 서버는 홈브류 서비스를 호스팅할 준비가 되어 있을 겁니다!