---
title: "2023년에 Windows 환경에서 DVWA를 설치하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_0.png"
date: 2024-06-19 04:55
ogImage: 
  url: /assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_0.png
tag: Tech
originalTitle: "How to Install DVWA In 2023 On Windows Environment"
link: "https://medium.com/geekculture/how-to-install-dvwa-in-2023-on-windows-environment-8a26a1fe9668"
---


<img src="/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_0.png" />

어이쿠! 취약한 웹 앱 (DVWA)은 해킹에 대해 배울 때 중요한 도구입니다, 특히 펜 테스팅에서는 더욱 그렇습니다. 이 글은 제 친구 중 한 명이 DVWA 설치에 대한 가장 간단한 튜토리얼이 무엇인지 물어 볼 때 한 번에 작성할 것입니다. 셋업/설치를 할 때 단계별로 만들기를 좋아하기 때문에 즐겁게 도와드릴 수 있어요. 자, Windows 환경에 설치하려고 합니다. DVWA를 설치하기 전에 알아야 할 몇 가지 사항이 있습니다.

# 요구 사항

컴퓨터에 DVWA를 설치하는 여러 가지 방법이 있습니다; 저는 그 중 두 가지만 알고 있습니다. 첫 번째는 가장 쉬운 방법입니다: `.ova` 버전을 다운로드하여 VirtualBox/VMware를 사용하여 실행하면 시스템이 실행됩니다. 그러나 그 방식은 크기가 크고 최소한의 디버깅 프로세스가 필요하기 때문에 그 방법을 선호하지는 않습니다. 그럼, Windows 환경에 DVWA를 설치하는 방법을 알려드리겠습니다.

<div class="content-ad"></div>

DVWA는 이미 약 10년 전에 만들어진 웹 애플리케이션입니다. 그래서 여전히 작동을 위해 몇 가지 구성해야 할 것이 많은 오래된 종속성들이 있습니다. 그래서 나는 이야기 제목에 2023을 추가했습니다. Windows 환경에서 실행하려면 XAMPP를 다운로드하여 설치해야 합니다. 모든 요구 사항을 충족시키는 데 도움을 드리기 위해 구글 드라이브에 파일이 이미 포함되어 있으므로 이곳에서 모든 요구 사항을 다운로드하면 됩니다:

- XAMPP: 링크
- DVWA: 링크

![2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_1.png](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_1.png)

# 단계 1 — XAMPP 구성하기

<div class="content-ad"></div>

모든 파일을 다운로드한 후, 다음 단계는 XAMPP를 설치해야 합니다. 정말 쉬울 거라고 믿어요. 그럼, XAMPP 디렉토리에서 htdocs 디렉토리를 찾아보세요. 디스크 D에 설치했다면 D:\xampp\htdocs에 있을 거에요. 새 디렉토리를 만들어서 이름을 dvwa로 지어주세요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_2.png)

그리고 나서 .github 파일을 제외한 zip 파일 안의 모든 파일을 dvwa 폴더로 옮기세요. (.github 파일은 필요 없으니 무시해도 괜찮아요)

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_3.png)

<div class="content-ad"></div>

추출 후에는 dvwa 디렉터리가 이렇게 보여야 합니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_4.png)

XAMPP 제어판을 열고 Apache와 MySQL 모듈을 시작해야 합니다. 모습은 이렇게 되어야 해요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_5.png)

<div class="content-ad"></div>

로컬호스트/dvwa에 액세스하면 이러한 오류가 표시됩니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_6.png)

축하합니다! 단계 1을 완료했습니다. 오류이긴 하지만 다음 단계에서는 이를 수정할 것이기 때문에 오래 지속되지 않을 겁니다.

# 단계 2 — DVWA 구성

<div class="content-ad"></div>

먼저 D:\xampp\htdocs\dvwa\config 폴더로 이동하면 config.inc.php.dist라는 파일 하나가 있을 겁니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_7.png)

해당 파일을 복사해서 config.inc.php로 이름을 변경하세요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_8.png)

<div class="content-ad"></div>

지금은 페이지를 새로 고침하면 에러와 함께 .../login.php로 리디렉션됩니다. 

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_9.png)

걱정하지 마세요. 솔직히, 현재 위치가 잘못된 곳에 있습니다 😂. 지금은 localhost/dvwa/setup.php로 이동하세요. 화면은 이렇게 보일 것입니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_10.png)

<div class="content-ad"></div>

저의 경우에는 여기 몇 군데 빨간색 텍스트가 있습니다. DVWA를 실행하려면 이를 초록색으로 변경해야 합니다. 먼저 php.ini 파일로 이동하세요. 이 파일은 D:\xampp\php 내에 있습니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_11.png)

또는 이 단계를 사용하여 쉽게 php.ini 파일에 액세스할 수 있습니다. (아파치 섹션의 Config를 열면 됩니다. 아래 이미지처럼) 

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_12.png)

<div class="content-ad"></div>

파일을 열고 allow_url_include을 찾아보세요. Off로 설정되어 있어야 합니다.

![Allow Url Include Off](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_13.png)

Off를 On으로 변경하세요.

![Allow Url Include On](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_14.png)

<div class="content-ad"></div>

`config.inc.php` 파일로 돌아가서 열어보세요; 선택한 텍스트 편집기로 열 수 있어요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_15.png)

`$_DVWA['recaptcha_public_key'];`를 찾아보세요; 값이 비어 있을 거에요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_16.png)

<div class="content-ad"></div>


Fill it with this 6LdK7xITAAzzAAJQTfL7fu6I-0aPl8KHHieAT_yJg, both of them will look like this.

![Image 17](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_17.png)

Click the Stop Button and Start again for the Apache. (Restart it)

![Image 18](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_18.png)


<div class="content-ad"></div>

DVWA 설정 페이지를 새로고침하면 빨간 텍스트가 줄어듭니다. 저는 PHP 모듈 gd에 오류가 있었습니다; 빠져 있었어요. 이 모듈은 captcha를 다루는 데 사용됩니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_19.png)

설치 여부를 확인하려면 http://localhost/dashboard/phpinfo.php로 이동하여 gd 텍스트를 찾아보세요. gd 섹션이 없다면 섹션이 나타나지 않습니다. 섹션은 PHP Credits와 같은 것이에요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_20.png)

<div class="content-ad"></div>

php.ini 파일을 다시 열어보세요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_21.png)

파일 내부에서 extension=gd 텍스트를 찾아보세요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_22.png)

<div class="content-ad"></div>

다음과 같이 수정해주세요.


<img src="/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_23.png" />

XAMPP를 다시 시작하세요

<img src="/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_24.png" />


<div class="content-ad"></div>

http://localhost/dashboard/phpinfo.php을 다시 열어서 gd를 찾아보세요. 타다~! 이제 설치되어 있을 거에요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_25.png)

잘 했어요. 모든 과정이 끝났네요. 어디를 눌러도 모두 초록색이죠. 클릭해서 데이터베이스를 생성/재설정하세요. 😇

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_26.png)

<div class="content-ad"></div>

와우, 축하해요! 또 에러를 찾으셨네요. 😂

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_27.png)

두 번째 에러를 발견하신 걸 축하드려요. 새 데이터베이스를 만드는 과정에서 설정이 잘못되었군요. 이제 최종 단계에 한 발짝 더 다가가고 있습니다, 친구야. 화이팅! 

# 단계 3 — 데이터베이스 구성하기

<div class="content-ad"></div>

DVWA에는 시스템 내에 설치되는 데이터베이스가 포함되어 있습니다. 이 데이터베이스는 해킹 기술 향상을 돕는 데 사용됩니다. 만약 localhost/phpmyadmin을 확인하면 dvwa 데이터베이스가 여기에 없다는 것을 알 수 있을 겁니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_28.png)

이 문제는 데이터베이스를 생성할 때 사용자와 비밀번호를 구성하는 것을 잊었기 때문에 발생했습니다. 이 구성은 D:\xampp\htdocs\dvwa\config\config.inc.php 안에 있습니다. 20번째 줄과 21번째 줄을 확인해보세요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_29.png)

<div class="content-ad"></div>

코드가 dvwa라는 새 데이터베이스를 만들려고 시도할 것입니다. 데이터베이스를 만들기 위해 MySQL 서버에 로그인할 것이며, 원래 코드는 사용자 이름을 dvwa로 하고 비밀번호를 p@ssw0rd로 확인합니다. 제공된 파일을 사용하고 있으므로 사용자는 root이고 비밀번호는 ''(없음)입니다. 이렇게 변경하세요.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_30.png)

현재 설정은 다음과 같이 보입니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_31.png)

<div class="content-ad"></div>

"데이터베이스 생성/초기화를 클릭하면 성공적으로 처리되며 다음과 같은 알림이 표시됩니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_32.png)

관심이 있다면, 지금 생성된 phpMyAdmin 페이지와 dvwa 데이터베이스를 확인할 수 있습니다.

![이미지](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_33.png)"

<div class="content-ad"></div>

지금 localhost/dvwa를 열어보세요; 그러면 login.php로 리디렉트됩니다.

![DVWA Login Page](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_34.png)

사용자 이름 admin과 비밀번호 password로 DVWA에 로그인할 수 있습니다.

![DVWA Login Credentials](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_35.png)

<div class="content-ad"></div>

Tadaaaa, 이제 DVWA 페이지에 왔어요.

![DVWA](/assets/img/2024-06-19-HowtoInstallDVWAIn2023OnWindowsEnvironment_36.png)

# 결론

이 이야기에서, DVWA 설치 단계별 안내를 이미 전해 드렸어요. 이 기사에서 특별한 점은 없지만, 디버깅 섹션으로 DVWA를 설치하는 데 도움이 되는 유일한 기사라고 믿어요. 이 기사가 마음에 들기를 바라고, 행복한 디버깅과 해킹되세요. 읽어 주셔서 감사합니다.

<div class="content-ad"></div>

# 관련 콘텐츠

만약 윈도우 환경을 개선하는 데 흥미를 느낀다면, Windows에 관한 다른 이야기들도 읽어보세요.