---
title: "맥북 프로 2012에서 소노마 업데이트 후 안드로이드 스튜디오가 충돌하는 문제 해결 방법"
description: ""
coverImage: "/assets/img/2024-06-19-AndroidStudiocrashesonMacBookPro2012afterSonomaUpdateSOLVED_0.png"
date: 2024-06-19 08:44
ogImage: 
  url: /assets/img/2024-06-19-AndroidStudiocrashesonMacBookPro2012afterSonomaUpdateSOLVED_0.png
tag: Tech
originalTitle: "Android Studio crashes on MacBook Pro 2012 after Sonoma Update [SOLVED]"
link: "https://medium.com/@xabaras/android-studio-crashes-on-macbook-pro-2012-after-sonoma-update-solved-3fa7c42998fb"
---


2012년식 맥북 프로를 사용 중입니다. 일상적인 사용 및 모바일 개발에 아주 좋은 성능을 발휘하고 있어요. 이렇게 오래된 기기를 여전히 잘 사용할 수 있는 것은 바로 OpenCore Legacy Patcher 프로젝트 덕분이에요.

하지만 최신 macOS로 업데이트한 이후로 안드로이드 스튜디오가 갑자기 다운되기 시작했어요.

처음에는 원인을 찾지 못했지만 결국 문제를 이해하게 되었어요. 맥북에 외부 모니터를 연결하면 안드로이드 스튜디오가 전혀 시작되지 않고, 외부 모니터를 연결하면 다운되는 현상이 발생한 거예요.

문제를 해결하기 위해 몇 차례 시도를 거쳐 시스템 로그를 확인하고 인터넷 검색을 했지만 결국 해결책을 찾을 수 있었어요.

<div class="content-ad"></div>

맥북 프로의 금속 GPU로 인한 충돌 문제를 해결하려고 Android Studio를 명령줄을 통해 시작해야 했고 다음 JVM 매개변수를 추가해야 했습니다: -Dsun.java2d.metal=false

Android Studio를 사용할 때마다 명령줄에서 시작해야 한다는 것은 적어도 귀찮은 일이라는 데 동의하실 거예요. 하지만 해결책이 가까이에 있다는 것을 발견할 겁니다.

당신의 Android Studio 버전을 위한 studio.vmoptions 파일을 찾아보세요. 제 버전은 다음 경로에 있었습니다


/Users/[내_사용자_이름]/Library/Application Support/Google/AndroidStudio2024.1/


<div class="content-ad"></div>

다음과 같은 JVM 매개변수를 파일 상단에 추가하십시오:

<!-- ![Alt text](/assets/img/2024-06-19-AndroidStudiocrashesonMacBookPro2012afterSonomaUpdateSOLVED_0.png) -->

이거 간단합니다! 😜

댓글에서 여러분의 경험과 의견을 공유해주세요.