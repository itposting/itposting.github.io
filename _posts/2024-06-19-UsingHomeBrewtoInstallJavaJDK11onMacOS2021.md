---
title: "HomeBrew를 사용하여 MacOS2021에 Java JDK11을 설치하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-UsingHomeBrewtoInstallJavaJDK11onMacOS2021_0.png"
date: 2024-06-19 08:59
ogImage: 
  url: /assets/img/2024-06-19-UsingHomeBrewtoInstallJavaJDK11onMacOS2021_0.png
tag: Tech
originalTitle: "Using HomeBrew to Install Java JDK11 on MacOS (2021)"
link: "https://medium.com/@kirebyte/using-homebrew-to-install-java-jdk11-on-macos-2021-4a90aa276f1c"
---


제목이 정확히 같은 게시물이 있지만 조금 오래됐기 때문에 최신 솔루션을 구글링하는 사람들을 위해 약간 수정된 버전을 게시하고 싶습니다.

## 단계 1: Homebrew 설치 (아직 하지 않은 경우)

```js
$ /bin/bash -c “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)” 
```

## 단계 2: 업데이트 (아직 하지 않은 경우)

<div class="content-ad"></div>

```js
$ brew update
```

## 단계 3: Java11 설치

```js
$ brew install java11
```

## 단계 4: Symlink 설정하기

<div class="content-ad"></div>

만약 이 단계를 건너뛰면 시스템이 사용할 자바 런타임을 찾지 못할 수 있어요.

```js
sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
```

## 단계 5: 테스트

버전 플래그를 사용하여 명령을 입력한 후 비슷한 내용을 보신다면 성공적으로 진행된 거예요! 🙂

<div class="content-ad"></div>

```js
$ java --version
openjdk 11.0.10 2021-01-19
OpenJDK Runtime Environment (build 11.0.10+9)
OpenJDK 64-Bit Server VM (build 11.0.10+9, mixed mode)
```

문제가 발생하면 저에게 알려주시면 이 안내서를 업데이트할 수 있습니다. 좋은 하루 보내세요!
