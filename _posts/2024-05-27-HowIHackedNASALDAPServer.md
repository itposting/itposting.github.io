---
title: "NASA LDAP 서버를 해킹한 방법"
description: ""
coverImage: "/assets/img/2024-05-27-HowIHackedNASALDAPServer_0.png"
date: 2024-05-27 15:34
ogImage:
  url: /assets/img/2024-05-27-HowIHackedNASALDAPServer_0.png
tag: Tech
originalTitle: "How I Hacked NASA LDAP Server"
link: "https://medium.com/@maxcyber882/how-i-hacked-nasa-ldap-server-b7cbb8cd0eee"
---

<img src="/assets/img/2024-05-27-HowIHackedNASALDAPServer_0.png" />

안녕하세요, 해커 친구들,

이것은 NASA의 LDAP 서버를 해킹하여 이름, 성, 직위, 직원 세부 정보와 같은 조직 민감 정보를 가져올 수 있었던 두 번째 글입니다. 시간을 낭비하지 않고 바로 시작하겠습니다.

LDAP에 대해 잘 모르는 사람들을 위해 간단히 설명하겠습니다.

<div class="content-ad"></div>

LDAP은 (Lightweight Directory Access Protocol)의 약자입니다. 이는 열린, 공급업체 중립적인, 분산 디렉터리 정보 서비스에 접근하고 유지하는 업계 표준 응용 프로그램 프로토콜으로서 인터넷 프로토콜(IP) 네트워크 상에서 사용됩니다. LDAP은 사용자 이름과 암호를 저장할 중앙 위치를 제공하고, 응용 프로그램이 이 디렉터리에 연결하여 사용자를 확인할 수 있도록 해줍니다.

따라서 Shodan에서 검색을 하던 중, NASA를 해킹해보면 큰 성취감을 느낄 수 있다고 생각하여 NASA를 해킹하고 신고해보자고 생각했습니다. 그래서 Shodan을 살펴보기 시작했습니다.

사용한 Dork는 (ssl:nasa.gov)이었고, 모든 결과를 검색한 후에 IP 주소를 얻었고 여기서 389번 포트에서 실행 중인 IP 주소를 확인했습니다. 기본적으로 LDAP 서비스는 636번 포트와 389번 포트를 사용하므로 389번 포트가 열려 있는지 확인하기 위해 nmap을 실행하여 연결된 개방 포트를 확인했고, 익명 바인드 상태의 개방 포트를 찾았습니다.

![이미지](/assets/img/2024-05-27-HowIHackedNASALDAPServer_1.png)

<div class="content-ad"></div>

여기서 내가 이용한 취약점은 LDAP 익명 null 바인드였고, 이 취약점을 이용하기 위해 파이썬 스크립트 코드를 사용했어.

이 코드를 실행한 후에 나는 다음과 같은 네이밍 컨텍스트를 얻었어.

![이미지](/assets/img/2024-05-27-HowIHackedNASALDAPServer_2.png)

네이밍 컨텍스트의 결과를 얻은 후에 나는 마지막 코드를 사용하기로 결정했어.

<div class="content-ad"></div>


![NASALDAPServer](/assets/img/2024-05-27-HowIHackedNASALDAPServer_3.png)

그리고 결국, 조직 부서, 직원 세부 정보, 직원 지정 등 많은 정보를 얻었고 제 반응은 예에요.

![reaction](https://miro.medium.com/v2/resize:fit:768/1*0j6wn-iPK5dB6G_i6FXbDg.gif)

이제 여기서 멈추기로 결정했고 개인 정보 침해 및 정책 위반으로 더 이상 악용하지 않기로 하고 NASA에 보고했으며 3일 이내에 보안팀으로부터 응답을 받았어요.


<div class="content-ad"></div>

그리고 마침내 감사 편지를 받았어요

![Letter of appreciation](/assets/img/2024-05-27-HowIHackedNASALDAPServer_4.png)

읽어 주셔서 감사합니다...
