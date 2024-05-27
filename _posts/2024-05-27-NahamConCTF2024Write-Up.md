---
title: "NahamCon CTF 2024 리뷰"
description: ""
coverImage: "/assets/img/2024-05-27-NahamConCTF2024Write-Up_0.png"
date: 2024-05-27 15:31
ogImage:
  url: /assets/img/2024-05-27-NahamConCTF2024Write-Up_0.png
tag: Tech
originalTitle: "NahamCon CTF 2024 Write-Up"
link: "https://medium.com/@ELJoOker/nahamcon-ctf-2024-write-ups-3e24354dc2c6"
---

## 다시 한번 여러분 안녕하세요! 이 글은 나는 NahamCon CTF 대회에서 해결한 일부 Reverse Engineering 및 Forensics 도전 과제들을 위한 것이다.

# 먼저, 나는 놀라운 "프리 팔레스타인" 팀의 일원으로 참여할 수 있어 영광으로 생각합니다. 전 세계 2500개 이상의 팀 중 3등을 석권했습니다. 모든 훌륭한 사고력에 대해 감사를 표합니다

![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_0.png)

이제 시작하겠습니다.

<div class="content-ad"></div>

## 테일러의 초 스위프트 (쉬움)

설명: 와! 테일러 스위프트의 이름을 따서 프로그래밍 언어를 만들었다는 소리 들었어요?

먼저, 쉬운 감지를 위해 보세요.

![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_1.png)

<div class="content-ad"></div>

macOS 실행 파일(ARM64 아키텍처)이에요. IDA Pro를 사용합시다. 파일을 로드한 후 main 함수로 이동해볼게요.

![이미지 1](/assets/img/2024-05-27-NahamConCTF2024Write-Up_2.png)

![이미지 2](/assets/img/2024-05-27-NahamConCTF2024Write-Up_3.png)

<div class="content-ad"></div>

간단한 논리, 입력 함수에서 플래그를 확인하는 로직을 보자. 디컴파일된 코드를 살펴보면


<img src="/assets/img/2024-05-27-NahamConCTF2024Write-Up_4.png" />


변수들의 표시 형식을 약간 수정한 후에

XOR 함수와 키, 그리고 base64 문자열이 나타납니다. 직관적으로 CyberChef를 사용해 봅시다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_5.png)

## IPromise (쉬움)

설명: 다음 아이폰을 만드는 대신, 나는 이 도전 과제를 만들었어. 하지만 난 진실된 약속을 한단다...

이 도전 과제를 위해 ELF 실행 파일을 얻었으니, IDA를 열어보자


<div class="content-ad"></div>


![Image 1](/assets/img/2024-05-27-NahamConCTF2024Write-Up_6.png)

우리는 아무 동작도 하지 않는 간단한 main 함수를 볼 수 있습니다. 그저 puts 함수만 있는 것뿐이에요.
하지만 프로그램 안에는 호출되지 않을 다른 함수들도 있습니다.

이 경우에는 간단합니다. 디버거를 사용하여 이 명령어로 직접 이동하면 됩니다. 저는 edb 디버거를 사용했습니다.

![Image 2](/assets/img/2024-05-27-NahamConCTF2024Write-Up_7.png)


<div class="content-ad"></div>

무척 간단하네요. 깃발은 그냥 여기 있네요 :D

## 잠긴 상자 (중급)

설명: 상자는 있지만 열쇠를 잃어버린 것 같아요.

이 도전 과제를 위해 Makeself로 생성된 쉘 스크립트가 있습니다

<div class="content-ad"></div>

이 종류의 파일을 검색하고 그 기능에 대해 조사해 보았어요. 이 파일은 자체 압축 아카이브입니다.

노트패드++에서 여는 것은 처음으로 발견한 것은 이겁니다.

![image](/assets/img/2024-05-27-NahamConCTF2024Write-Up_8.png)

MD5 해시에 2개의 NUL 바이트가 있군요. 그래도 그냥 실행해 봐야겠죠?

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-NahamConCTF2024Write-Up_9.png)

원하는 오류가 발생했습니다. 올바른 해시 값이 아니지만 올바른 해시 값이 있으니 변경해 봅시다.

그런데, 텍스트 편집기에서 널 바이트를 변경하면 파일이 손상될 수 있으므로 HxD에서 이 해시를 수정합시다.

![image](/assets/img/2024-05-27-NahamConCTF2024Write-Up_10.png)


<div class="content-ad"></div>

두 교란된 바이트가 보입니다. 올바른 16진수 값으로 수정하겠습니다.
"f"에 대한 0x66 | "7"에 대한 0x37입니다.

<img src="/assets/img/2024-05-27-NahamConCTF2024Write-Up_11.png" />

## 상자 안에는 무엇이 있을까요? (중급)

설명: 상자를 가지고 있는데, 그 안에 깃발이 들어있다는 것만 알고 있어요.

<div class="content-ad"></div>

우리가 또 다른 makeself 셸 파일을 받았어요.

실행하고 나서 이상한 오류가 발생했는데, 임시로 추출된 파이썬 스크립트를 실행하는 것처럼 보였어요.

![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_12.png)

requests 패키지가 있음에도 불구하고 그 오류가 발생해서 어떻게 해야할 지 고민했어요.

<div class="content-ad"></div>

일부 조사를 한 후 가능한 옵션을 찾아보았어요. 그래서 추출 디렉토리를 지정하는 옵션을 사용해 보았는데,

![image 1](/assets/img/2024-05-27-NahamConCTF2024Write-Up_13.png)

그리고 이 파일들을 받았어요.

![image 2](/assets/img/2024-05-27-NahamConCTF2024Write-Up_14.png)

<div class="content-ad"></div>

파이썬 스크립트 파일을 1000개의 조건부 분기 대신 1개로 가지고 있네요! 대단하네요! :)

![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_15.png)

스크립트 마지막에 몇 가지 핑 체크와 핀이 있어요.

이걸 바로 실행해 봐요.

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_16.png)

## 브레스 오브 더 와일드 (쉬움)

설명: 내가 좋아하는 비디오 게임을 위한 멋진 데스크톱 배경을 받았지만, 이제 더 원해요! 문제는 이전 것을 다운로드한 곳을 잊어버렸다는 것이죠... 이 오래된 것은 어디서 다운로드했는지 기억하도록 도와줄 수 있나요?
여기 제 배경화면의 모든 백업이 있어요. 보안을 위해 드라이브 암호를 videogames로 설정했어요.

이 도전에 대한 파일은 확장자가 없지만 파일의 매직 바이트를 살펴보면 vhdx(Windows 가상 하드 드라이브) 파일인 것 같아요.

<div class="content-ad"></div>

![/assets/img/2024-05-27-NahamConCTF2024Write-Up_17.png](https://example.com/assets/img/2024-05-27-NahamConCTF2024Write-Up_17.png)

Let's use that extension, mount the drive, and open it using "videogames" as a password.

![/assets/img/2024-05-27-NahamConCTF2024Write-Up_18.png](https://example.com/assets/img/2024-05-27-NahamConCTF2024Write-Up_18.png)

We have a lot of images on this disk, so,

<div class="content-ad"></div>

우선, 이 이미지들의 이름이 나를 놀라게 했고, 어떤 base64 조합이 있는 줄 알았는데, 결국 헛된 노력이었네요.

그런 다음, 그 디스크에서 autoSpy를 사용했는데, 도전 과제 설명에서 링크를 찾아야 한다고 생각해서 웹으로 이동했더니, 다른 링크가 있는 이미지 하나가 있었어요.

아래는 인코딩된 URL 같네요. 사이버셰프를 열어보죠!

<div class="content-ad"></div>

md
![이미지](/assets/img/2024-05-27-NahamConCTF2024Write-Up_20.png)

여기에 우리의 플래그가 있어요.

항상 궁금한 점이나 의겄나 내용이 있으면 LinkedIn - Discord - GitHub을 통해 저에게 연락해주세요.

