---
title: "이메일 OSINT"
description: ""
coverImage: "/assets/img/2024-06-19-EmailOSINT_0.png"
date: 2024-06-19 21:46
ogImage: 
  url: /assets/img/2024-06-19-EmailOSINT_0.png
tag: Tech
originalTitle: "Email OSINT"
link: "https://medium.com/@snoop-ghost/email-osint-95004481b72a"
---


## 안녕하세요 여러분 !!!

- 여러분의 이메일이나 비밀번호가 공개되어 있는지 궁금한 적이 있었나요?

혹은 여러분의 데이터가 유출된 웹사이트, 패스트빈, 또는 텔레그램 그룹에 공개적으로 혹은 유료로 게시되었나요?

그렇다면 계속 읽는 것이 도움이 될 것입니다. 저는 이에 대한 완벽한 도구를 소개하겠습니다. 또한 이 도구들은 OSINT, 사이버 보안 전문가, 해커, 그리고 그들의 동료들이 모두의 정보를 수집하고 이메일과 관련된 모든 정보를 수집하여 대상의 프로필을 작성하는 데 사용하는 도구입니다.

<div class="content-ad"></div>

시작하기 전에, 알지 못하는 분들을 위해 온라인 안전을 유지할 수 있는 몇 가지 사이버-위생 도구와 주의사항을 공유하고 싶어요.

# 복잡한 암호 및 2단계 인증 앱 사용하기!

확실하게 말하자면, 최고 수준의 2단계 인증 앱을 사용하더라도, 웹사이트나 다른 보안 방법을 사용하는 경우에도 만약 누군가가 호스트 (예: 구글, 페이스북, 혹은 지역 가게)를 해킹한다면, 모든 노력이 물거품이 될 수 있어요. 그럼에도 불구하고, 포기하지 말아야 합니다. 왜냐하면 종종 한 계정을 해킹해 권한을 높이는 과정으로 시작하기 때문이에요.

# 모든 계정에 같은 이메일 주소를 사용하는 것을 피해주세요.

<div class="content-ad"></div>

왜요? 해커가 당신의 모든 계정에 대한 단일 이메일 주소를 가지고 있는 서버로 침입한다고 상상해봅시다. 오직 한 개의 이메일 주소 뿐이라면, 그가 이 주소와 연결된 모든 계정 및 데이터를 발견하기까지 시간 문제입니다. 이것은 무수히 많은 가능한 연결된 시나리오 중 하나에 불과합니다.

# 가리기, 전달 및 임시 이메일 서비스 사용하기

가령 가리기, 전달 또는 임시 이메일 서비스를 잘 활용하면 좋은 수준의 개인 정보 보호를 효과적으로 유지할 수 있습니다. 더불어 이들은 단일 이메일 주소에 대한 OSINT 또는 추적 도구를 강화할 수 있습니다. 다음은 몇 가지 옵션입니다. 더 많은 옵션이 필요하다면, 이메일 및 기타 도구에 대한 무수히 많은 도구 모음을 위한 마지막 링크를 클릭하세요. (진행 중인 내용)

- 발행 전에 여러 링크를 삭제해야 해서 놓친 것이 있을 수 있습니다. 부족한 부분은 아래에서 찾아볼 수 있습니다:

<div class="content-ad"></div>

OOSINT [https://start.me/p/ME7aRA/oosint](https://start.me/p/ME7aRA/oosint)

이메일 주소를 다룰 때 기억해야 할 몇 가지 기본 사항들입니다. 이제 OSINT 웹사이트와 앱으로부터 어떤 정보를 수집할 수 있는지 살펴볼 수 있습니다.

# Epieos

- [https://epieos.com](https://epieos.com)

<div class="content-ad"></div>

간단한 웹사이트로 이메일 주소 또는 전화 번호에 관한 기본 정보를 수집합니다. Google, Email Checker(+200개 사이트), Skype, LinkedIn, Nike Run Club, Fitbit, GitHub, Duolingo, Asics Runkeeper, Adidas Runtastic, Strava, Vivino, Facebook, Proton Mail, Phone Checker, Etsy, Have I Been Pwned?, Dropbox, Foursquare, Flickr, Chess.com, Substack, Trello, Notion, Gravatar 등의 결과를 제공합니다.

데이터를 수집할 때 유용한 도구이며, 무료 버전도 몇 초 안에 기본 결과를 제공합니다.

- [가격 정보 보러가기](https://epieos.com/pricing)

# Dehashed

<div class="content-ad"></div>

- https://dehashed.com

이 웹 사이트는 IP 주소, 이메일, 휴대전화 등과 관련된 정보를 찾는 데 이상적입니다. 무료 버전은 흐릿한 결과를 제공하지만 프로 버전은 합리적인 가격으로 완전한 가시성을 제공합니다. 탈락한 자격 증명을 확인하려는 개인 또는 비즈니스, 대상을 감시하는 프로페셔널 조사관 또는 윤리적 해커 등에 적합합니다. 전반적으로 이 분야에서 최고의 웹 사이트로 여겨집니다.

- https://dehashed.com

# IRBIS

<div class="content-ad"></div>

- https://irbis.espysys.com

이 플랫폼은 모바일 및 이메일을 포함한 다양한 채널에서 온라인 데이터를 수집하는 데 중요하고 포괄적인 소스를 제공합니다. 소셜 미디어 인텔리전스(SOCMINT)에 초점을 맞추며 사용자에게 다양한 정보 소스에 대한 액세스를 부여합니다. 구독료가 있지만, 새로 가입한 사용자는 대개 처음 계정을 열 때 무료 검색 크레딧을 받습니다. 온라인을 탐험할 때 들르고 싶은 곳입니다.

# IntelX.io

- https://intelx.io

<div class="content-ad"></div>

이 플랫폼은 폭넓은 온라인 데이터 스크래핑 도구를 제공합니다. 무료 버전은 완전한 데이터셋을 제공하지는 않을 수 있지만, 위반 파일 이름을 노출하여 사용자가 추가적인 특정 검색을 수행할 수 있도록 합니다. 이 웹사이트는 이메일, 전화번호, 비트코인 지갑 등 다양한 소스에서 데이터를 추출할 수 있어서 중요한 대상 정보에 접근할 수 있도록 합니다.

# 다른 유사한 웹사이트:

- https://haveibeenpwned.com

- https://www.voilanorbert.com

<div class="content-ad"></div>

- [https://app.orbitly.io](https://app.orbitly.io)
- [https://www.maltego.com](https://www.maltego.com)
- [https://intel471.com/solutions/attack-surface-protection](https://intel471.com/solutions/attack-surface-protection)
- [https://www.emailsherlock.com](https://www.emailsherlock.com)

<div class="content-ad"></div>

## 또한, 이제는 터미널, 클라우드 인스턴스, 도커, CLI OS 또는 가상 머신에 이상적인 GitHub 도구들을 확인해보겠습니다.

<div class="content-ad"></div>

# 블랙 타이거

- https://github.com/VirusZzHkP/The-Black-Tiger

블랙 타이거 도구는 다양한 영역의 OSINT에 초점을 맞추고 있습니다. 사람, 닉네임, 소셜 네트워크, 이메일, 전화 번호, 웹 페이지, 공개 IP 및 이미지를 포함합니다. 이 도구의 아이디어는 가장 고급 OSINT 기술을 한 곳에 수집하고 자동화해 효율적이고 편리하게 만드는 것이었습니다. 이 도구는 몇 번의 클릭으로 정보를 조직적으로 수집하고 제시합니다. 각 섹션은 특정 유형의 정보를 추출하기 위한 부분으로 나눠지지만, 이용 가능한 모든 데이터를 추출할 수도 있습니다.

# 홀히

<div class="content-ad"></div>

- [https://github.com/megadose/holehe](https://github.com/megadose/holehe)

안녕하세요! "Holehe"는 특정 이메일 주소와 연결된 등록된 계정을 효율적으로 식별하기 위해 설계된 도구입니다. 이 도구는 해당 이메일이 Twitter, Instagram, Imgur 및 120개 이상의 다른 인기 웹사이트에 연결되어 있는지 확인할 수 있습니다. 이 도구는 이러한 플랫폼의 비밀번호를 잊었을 때의 정보를 검색합니다. 또한 Python 3에서 실행되도록 구축되어 최신 프로그래밍 환경과 호환됩니다.

# Poastal

- [https://github.com/jakecreps/poastal](https://github.com/jakecreps/poastal)

<div class="content-ad"></div>

"P
oastal"은 어떤 이메일 주소에 대해 포괄적인 정보를 제공하는 필수적인 이메일 OSINT(Open Source Intelligence) 도구입니다. 이 강력한 도구를 사용하면 이메일 소유자의 이름을 알아낼 수 있고, 전달 가능 여부를 확인하며, 일회용으로 사용되거나 스팸으로 간주되는지 확인하고, Facebook, Twitter, Snapchat 등 여러 인기 플랫폼에 등록되어 있는지도 확인할 수 있습니다. 이는 이메일 주소와 관련된 중요한 정보를 수집하는 데 유용한 자원입니다.

# GHunt

- https://github.com/mxrch/GHunt

G
Hunt (v2)는 효율적인 진화에 중점을 둔 최신 안전 구글 프레임워크입니다. 이 도구는 현재 OSINT(Open Source Intelligence)에 특화되어 있지만 다양한 구글 관련 용도로 적용할 수 있습니다. 이 도구의 특징은 CLI 사용 및 모듈, Python 라이브러리 통합, 원활한 작동을 위한 전체 비동기 지원, JSON 내보내기 기능 및 간결한 로그인 절차를 위한 편리한 브라우저 확장 프로그램을 포함하고 있습니다.

<div class="content-ad"></div>

# Seekr

- https://github.com/seekr-osint/seekr

Seekr은 사용자 친화적인 OSINT(Open Source Intelligence) 데이터를 수집하고 관리하기 위한 툴킷입니다. 선호하는 OSINT 도구를 모두 통합한 데스크톱 화면을 제공합니다. 백엔드는 Go로 개발되었으며 데이터베이스로 BadgerDB를 사용하여 다양한 데이터 수집, 조직 및 분석 기능을 제공합니다. Seekr은 연구원, 조사원 또는 정보 수집을 하는 개인에게 필요한 데이터를 찾고 관리하는 것을 간편하게 만들어줍니다. 여러분의 OSINT 작업을 어떻게 개선할 수 있는지 확인해 보세요!

# 다른 옵션들...

<div class="content-ad"></div>

더 많은 옵션을 원하시면 `https://start.me/p/ME7aRA/oosint`를 방문해보세요.

# 아니면

이제 왜 계정마다 동일한 이메일 주소를 사용하는 것을 피해야 하는지 알게 되셨죠. 이렇게 하면 불허한 접근과 잠재적인 데이터 유출 위험이 높아집니다. 일시적, 전달 및 마스킹 이메일 서비스를 활용하면 악의적인 목적에서 민감한 정보를 보호하기 위한 추가적인 방어층을 더할 수 있습니다. 온라인 보안과 개인정보 보호를 우선시하며 잠재적인 위험을 완화하기 위해 이러한 조치를 항상 고려하는 것이 중요합니다.

# 아직 궁금한 점이 있으신가요? ¡

<div class="content-ad"></div>

아래에, 아마 당신이 좋아할만한 것들이 있을 거에요! 😊