---
title: "VeraCrypt로 언제 어디서나 데이터를 암호화하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-EncryptYourDataAnytimeandAnywherewithVeraCrypt_0.png"
date: 2024-06-23 15:29
ogImage: 
  url: /assets/img/2024-06-23-EncryptYourDataAnytimeandAnywherewithVeraCrypt_0.png
tag: Tech
originalTitle: "Encrypt Your Data Anytime and Anywhere with VeraCrypt"
link: "https://medium.com/@_olsi/encrypt-your-data-anytime-and-anywhere-with-veracrypt-430d37a38b63"
---


<img src="/assets/img/2024-06-23-EncryptYourDataAnytimeandAnywherewithVeraCrypt_0.png" />

눈에 띄는 개발자님! 민감한 정보를 안전하게 보호하는 것은 매우 중요합니다. 이 기사에서는 암호화된 볼륨을 만드는 실용적인 측면에 초점을 맞추어 몇 가지 명령만 있으면 매우 쉽게 가능하다는 것을 보여드릴 거에요.

가능한 사용 사례:

- 클라우드에 업로드하기 전 개인 사진, 비디오 데이터, 문서를 암호화하기;
- 비밀 정보, 예를 들어 비밀번호나 기타 민감한 데이터가 포함된 메모를 암호화하기;
- 특히 사용자 프로필 데이터가 있는 데이터베이스 백업을 암호화하기.

<div class="content-ad"></div>

# VeraCrypt 설치

오늘은 GUI가 아닌 터미널 버전에 초점을 맞추고 있습니다. 이는 개념을 더 잘 이해하고 그래픽 및 비그래픽 인터페이스 모두에 적용하는 데 도움이 될 것입니다.

또한, 올바른 명령을 얻은 후에는 UI 버튼을 클릭하는 것보다 메모에서 터미널로 복사하여 붙여넣는 것이 훨씬 빠릅니다.

## 설치 프로그램 다운로드

<div class="content-ad"></div>

우분투 / 데비안 예시

```js
# From https://launchpad.net/veracrypt/
# Arm version
wget https://launchpad.net/veracrypt/trunk/1.25.9/+download/veracrypt-console-1.25.9-Debian-10-arm64.deb
# Amd / Intel version
wget https://launchpad.net/veracrypt/trunk/1.25.9/+download/veracrypt-console-1.25.9-Ubuntu-22.04-amd64.deb
```

맥OS의 경우 GUI 버전을 설치하고 명령줄 호출을 위한 별칭을 추가하세요. 아래 내용을 참고해주세요 ⤵️

```js
echo "alias veracrypt='/Applications/VeraCrypt.app/Contents/MacOS/VeraCrypt --text'" >> ~/.zshrc
source ~/.zshrc
```

<div class="content-ad"></div>

# 암호화된 볼륨 생성하기 (데이터를 담는 그릇)

우선, 여기서 볼륨이란 무엇인가요? 그저 암호화된 형식으로 모든 데이터를 포함하는 파일(일반적으로 50GB 이상이며 필요에 따라 다르겠지요)입니다.

암호화된 파일에 접근하거나 새로운 파일을 추가하려면 해당 볼륨을 폴더에 마운트해야 합니다. 그렇게 하면 모든 데이터가 자동으로 복호화되어 일반적인 PC 폴더처럼 작업할 수 있습니다.

```js
# 100 기가바이트 크기의 볼륨 생성 및 
# 현재 폴더에 my_100gb_secured라는 파일명으로 저장
veracrypt --text --create my_100gb_secured --size 100G --encryption AES --hash SHA-256 --random-source /dev/random --pim 0 --volume-type normal --keyfiles="" --filesystem exfat 
# 볼륨에 대한 암호를 입력하라는 메시지가 나타납니다...
```

<div class="content-ad"></div>

이 명령을 조각조각 나눠보겠습니다:

- --text — 터미널에서 창이 뜨지 않고 텍스트 모드로 실행하고 싶습니다.
- --create my_100gb_secured — my_100gb_secured라는 이름의 볼륨(파일)을 생성합니다.
- --size 100G — 데이터를 저장할 용량으로 100G이 필요하다고 알려줍니다. 따라서 볼륨 파일도 100G의 크기가 될 것입니다. 하드 드라이브에 충분한 공간이 있는지 확인하세요.
- --encryption AES --hash SHA-256 — 암호화 유형은 AES입니다(비밀번호를 사용하여 데이터를 암호화하기 위해 암호학에서 널리 사용되는 알고리즘입니다). SHA-256은 흔히 사용되는 해싱 함수 이름이며 SHA-512를 선택할 수도 있지만 더 느리게 작동합니다.
- --random-source /dev/random — 암호화를 개선하기 위한 임의의 기호입니다. 이 명령에서 --random-source /dev/random 부분을 제거하면 Vera Crypt는 키보드로 임의의 기호를 입력하도록 강요할 것입니다.
- --pim 0 — 이 값은 해싱 함수에 의해 사용되는 반복 횟수를 증가시킵니다. 이는 보안을 높일 수 있지만 마운트 시간이 길어지는 대가로 이루어집니다. 0은 기본 권장 값을 사용한다는 것을 의미합니다.
- --volume-type normal — 전통적인 파일 기반의 볼륨입니다. 숨겨진 볼륨 모드도 있지만 이 글에서 다루지 않겠습니다. 숨겨진 옵션을 사용하면 명시적인 파일 작성 없이 하드 드라이브의 일부를 암호화할 수 있습니다. 그러나 클라우드나 로컬 장치와 작업할 때는 단순히 이동하거나 삭제할 수 있는 평범한 파일로서의 볼륨으로 작업하는 것이 훨씬 쉽고 명확합니다.
- --keyfiles="" — 추가적인 보안층으로, 비밀번호를 해제할 때 키 파일이 필요하게 지정할 수 있습니다. 그러나 여기서는 필요하지 않고 비밀번호만으로 의존할 것입니다.
- --filesystem exfat — 중요한 부분으로 이 곳에서 볼륨을위한 파일 시스템을 지정해야하기 때문에 현명한 선택을 해야합니다. 가능한 값들은 다음과 같습니다…

![이미지](/assets/img/2024-06-23-EncryptYourDataAnytimeandAnywherewithVeraCrypt_1.png)

## 파일 시스템 선택

<div class="content-ad"></div>

fat32은 호환성이 좋고 모든 운영 체제에서 기본 지원되는 파일 시스템입니다. 이는 휴대폰과 카메라의 SD 및 microSD 카드에 사용되는 동일한 파일 시스템입니다. 단점은 fat32의 각 파일의 최대 크기가 4GB로 제한된다는 것입니다.

exfat은 좋고 호환성이 좋은 파일 시스템으로, 파일 크기 제한이 없으며 대용량의 SD 및 microSD 카드에도 사용됩니다. 단점은 Docker 환경에서 일부 드물게 지원되지 않는 경우가 있다는 것입니다.

NTFS는 macOS에서 지원되지 않는 유일한 단점이 있지만, 뛰어난 파일 시스템입니다.

다른 옵션들도 있지만 특정 운영 체제에 특화되어 있으므로 macOS와 얼마나 자주 작업하는지에 따라 exfat과 NTFS 중 선택하는 것이 좋습니다. Windows 및 Linux가 기본 장치인 경우 NTFS가 좋은 선택이 될 수 있습니다. 확실하지 않고 가능한 한 유연하게 사용하고 싶다면 exfat을 선택하는 것이 좋습니다.

<div class="content-ad"></div>

암호화된 볼륨을 마운트하기

우리의 볼륨을 사용하려면 폴더에 마운트해야 합니다.

```js
# 마운팅에 사용할 디렉토리 생성
mkdir ~/my_100gb_directory
```

```js
# 현재 폴더에 있는 my_100gb_secured 파일을 my_100gb_directory로 마운트
veracrypt --text --mount --keyfiles="" --pim 0 my_100gb_secured ~/my_100gb_directory
```

<div class="content-ad"></div>

폴더를 건너뛰고 VeraCrypt가 볼륨을 하드 드라이브로 마운트합니다 (폴더에 마운트하는 것이 작동하지 않으면, 특히 macOS에서 일부 ~/my_100gb_directory를 제외하고 다시 시도해보세요)

![이미지](/assets/img/2024-06-23-EncryptYourDataAnytimeandAnywherewithVeraCrypt_2.png)

# 비밀 상자를 분리하세요

작업을 마친 후 — 모든 마운트된 볼륨을 비활성화하려면 다음을 입력하세요:

<div class="content-ad"></div>

```bash
veracrypt -d
```

![VeraCrypt](/assets/img/2024-06-23-EncryptYourDataAnytimeandAnywherewithVeraCrypt_3.png)

여기까지입니다. 이제 VeraCrypt를 사용하여 암호화된 볼륨을 생성하고 관리하여 민감한 데이터를 안전하게 저장하는 방법을 배웠습니다.

보너스로, 필요할 경우에 대비해 몇 가지 더 많은 VeraCrypt 명령어 플래그를 여기에 나열해두었습니다:

<div class="content-ad"></div>

테이블 태그를 마크다운 형식으로 변경해주세요.