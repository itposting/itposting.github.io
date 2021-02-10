---
layout: post
title: "macOS Big Sur 11.2.1 루트 액세스 Sudo 버그 수정"
author: 'itposting'
thumbnail: https://images.macrumors.com/t/2390Ic9NBS40WAGmhH5VUq4YQFc=/2500x0/filters:no_upscale():quality(90)/article-new/2021/02/sudo-bug-macos-feature.jpg
---


애플이 오늘 공개한 macOS Big Sur 11.2.1 업데이트에서는 공격자가 mac에 루트 액세스 권한을 얻을 수 있는 sudo 보안 취약성을 수정했습니다.

![sudo bug macos](https://images.macrumors.com/t/mfH92kRjGIMnP4ivojQCBz9X73o=/2500x0/filters:no_upscale():quality(90)/article-new/2021/02/sudo-bug-macos.jpg)

Apple 보안 지원 문서에 따르면 업데이트에서 CVE-2021-3156 버그는 버전 1.9.5p2를 sudo하도록 업데이트하여 처리되었습니다. 애플은 또한 macOS Catalina 10.15.7과 macOS Mojave 10.14.6에 사용할 수 있는 보충 업데이트의 버그를 수정하였다.

업데이트는 또한 앱이 커널 권한으로 임의 코드를 실행할 수 있는 두 개의 버그에 대한 수정도 포함합니다.

지난 주에 발견된 이 취약성은 현재 사용자의 권한을 변경하여 루트 수준 액세스를 사용하도록 설정하고 공격자가 전체 시스템에 액세스할 수 있도록 하는 "heap 오버플로" sudo를 트리거합니다.