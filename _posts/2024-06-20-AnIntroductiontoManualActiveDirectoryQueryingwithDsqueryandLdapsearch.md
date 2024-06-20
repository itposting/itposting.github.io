---
title: "DSQuery 및 LDAPSearch를 사용한 수동 Active Directory 쿼리 소개"
description: ""
coverImage: "/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_0.png"
date: 2024-06-20 14:47
ogImage: 
  url: /assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_0.png
tag: Tech
originalTitle: "An Introduction to Manual Active Directory Querying with Dsquery and Ldapsearch"
link: "https://medium.com/specter-ops-posts/an-introduction-to-manual-active-directory-querying-with-dsquery-and-ldapsearch-84943c13d7eb"
---


# 소개

정직하게 말하자면, BloodHound와 PowerView는 Active Directory(AD)를 조회하고 열거하며 조사하는 데 객관적으로 더 나은 도구입니다. 이 도구들은 더 효율적이고 직관적이며 BloodHound를 사용하면 쿼리를 쉽게 추적할 수 있습니다. 또한 파워뷰에서 -v 플래그를 사용하면 실행 중인 쿼리를 볼 수 있어 시간을 절약할 수 있습니다. 그러나 최근 평가에서 내가 한 대상에게 들을 수 없는 상황에 처했을 수도 있습니다. 그런 경우에 팀은 호스트에서 어느 도구도 실행할 수 없었고 도구를 프록시로 사용하는 데 어려움을 겪었습니다. 이 도구를 사용하기 위한 해결책을 찾느라 사투를 벌이는 동안에도 여전히 목표를 달성해야했습니다. 따라서 앞서 얻은 자격 증명을 사용하여 수동으로 쿼리를 수행하기로 결정했습니다. *nix 시스템에서는 ldapsearch를 사용하여 수동 LDAP 검색을 수행할 수 있고, Windows 시스템에서는 dsquery를 사용할 수 있습니다.

이 블로그에서는 자격 증명이나 쿼리를 시작할 컨텍스트를 어떻게 얻을지에 대한 제안은 제공하지 않겠지만, 이미 필수적인 정보를 가지고 있다고 가정하겠습니다. 대신, 이 도구들로 쿼리를 작성하는 방법과 다른 해결책을 찾아내는 동안 어떻게 시작해야 하는지에 중점을 둘 것입니다.

# 도구

<div class="content-ad"></div>

좋아요, BloodHound, PowerView 및 다른 합리적인 옵션이 작동하지 않을 때 수동으로 AD 쿼리를 시작해야 하는 상황에 있습니다. 시작할 수 있는 두 가지 도구를 살펴보겠습니다. Dsquery와 ldapsearch는 AD를 쿼리하는 데 사용되는 도구이며, 공격적인 AD 상황인식에 사용할 수 있습니다.

먼저, Windows 이진 파일인 dsquery에 대해 이야기하겠습니다. 따라서 목표에 (있는 경우) 이미 존재하지 않은 경우 너무 많은 경고를 일으키지 않고도 업로드할 수 있습니다. dsquery.dll은 기본적으로 대부분 또는 모든 Windows 시스템의 C:\Windows\System32\dsquery.dll에 있습니다.

![그림](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_0.png)

바이너리 dsquery.exe는 일부 서버에 이미 C:\Windows\System32\dsquery.exe에 존재할 수 있습니다. Dsquery는 Windows 원격 서버 관리 도구(RSAT) 패키지의 일부이며 Microsoft에서 여기서 다운로드할 수 있습니다. 또한 해당 위치에서 Microsoft가 설명하길 "Windows 10 2018년 10월 업데이트부터 RSAT는 자체 Windows 10의 "기능 요청" 세트로 포함되어 있습니다." 해당 지침에 따라 상황에 따라 목표에 필요한 항목을 얻을 수 있는 옵션이 있을 수 있습니다. Dsquery는 명령줄 유틸리티이며 다음이 필요합니다:

<div class="content-ad"></div>

- Active Directory Domain Services (AD DS) 서버 역할이 설치되어 있어야 합니다 (즉, 쿼리할 도메인이 있어야 함)
- 승격된 명령 프롬프트(즉, NT AUTHORITY\SYSTEM 컨텍스트)

두 번째 도구는 macOS 및 *nix 시스템에 기본으로 있으며 ldapsearch입니다. 이미 시스템에 설치되어 있을 수 있지만 ldap-utils 패키지를 설치하여 설치할 수 있습니다. macOS에서는 이미 설치되어 있지 않다면 brew를 통해 openldap 패키지를 설치할 수 있습니다. ldapsearch 쿼리를 실행하려면 AD를 쿼리할 수 있는 유효한 AD 계정의 자격 증명이 필요합니다. 제가 찾은 가장 좋은 가이드(맨 페이지 외)는 이 웹사이트에 있습니다. 여기서의 ldapsearch 쿼리 컨텍스트는 Ubuntu Windows Subsystem for Linux에 도메인 서비스 계정의 평문 자격 증명을 사용합니다.

# 쿼리 구조화

Dsquery와 ldapsearch는 유사한 쿼리 구조를 가지고 있으므로 둘 사이를 이동하기 쉽습니다. 출력 형식은 다르지만 대부분 동일한 정보를 제공할 것입니다. 또한 동일한 결과를 얻을 수 있는 여러 가지 방법이 있지만, 제가 선호하는 방법을 설명하겠습니다. 두 도구 모두 수행할 작업에 따라 다양한 명령 줄 옵션이 있습니다. 본 블로그에서는 과거에 사용해본 일반적인 옵션 몇 가지를 다룰 것이나, 사용 사례의 빈틈을 막기 위해 문서를 참고할 것을 권장합니다.

<div class="content-ad"></div>

## Dsquery 구조

dsquery의 기본 구조는 다음과 같습니다:

dsquery `대상 유형` `필터` `옵션`

대상 유형에는 다음 옵션이 있습니다:

<div class="content-ad"></div>

- 컴퓨터
- 연락처
- 그룹
- OU
- 사이트
- 서버
- 사용자
- 할당량
- 파티션
- * (와일드카드)

첫 번째 매개변수로 객체 유형을 지정하거나 와일드카드 검색의 필터에 객체 유형을 지정하거나 모든 객체 유형을 열어두실 수 있습니다. 객체 유형을 지정하거나 와일드카드를 사용할 때 필터와 출력 결과가 다릅니다. 대개 다른 객체 유형은 많은 정보를 제공하지 않기 때문에 저는 객체 유형에 와일드카드 옵션을 주로 사용합니다. 이는 개인적인 선호도이며 처음 시작할 때는 둘 다 작동합니다. 아래 예시에서는 객체 유형으로 사용자가 지정된 쿼리와 객체 유형 및 테스트 도메인의 사용자에 대한 objectclass 필터가 지정된 쿼리를 확인할 수 있습니다 (PLANETEXPRESS).

![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_1.png)

dsquery user

<div class="content-ad"></div>

이 예에서는 도메인 사용자에 대한 간단한 쿼리를 사용하면 도메인의 모든 사용자의 식별 이름이 표시됩니다. 이 방법은 매우 쉽고 간결하지만 정보가 많이 부족한 점이 있습니다. 와일드카드를 사용한 예제를 살펴보고 결과를 하나의 사용자로 제한해 봅시다.

![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_2.png)

dsquery * -filter "(objectclass=user)" -attr * -limit 1

이전 것과 비교했을 때 이 필터는 훨씬 길고 비교적 복잡하지만 더 많은 정보를 얻을 수 있습니다. 예를 들어 사용자의 그룹 멤버십, 설명 및 이름을 모두 볼 수 있습니다. 두 쿼리 사이에는 조금 다른 결과가 나오지만 이에 대해 뒤에서 더 자세히 설명하겠습니다. 한 가지 빠른 팁: 대소문자 구분은 대부분 중요하지 않습니다. 원하면 적절한 형식을 사용할 수 있지만 결과에 큰 영향을 미치지 않을 것입니다. 결과에 영향을 준다고 판단되면 한 객체에 대한 모든 속성을 가져와 이름을 올바른 형식으로 복사하는 것이 좋습니다. dsquery를 사용한 쿼리의 경우 쿼리의 컨텍스트는 도메인에 가입된 호스트의 NT AUTHORITY\SYSTEM 명령 프롬프트에 있을 것입니다.

<div class="content-ad"></div>

## Ldapsearch 구조

Ldapsearch는 쿼리를 어떻게 구성할 지에 대해 더 많은 유연성을 제공합니다. 이 블로그 전체를 일관성 있게 유지하기 위해 사용할 형식은 다음과 같습니다:

ldapsearch `형식 옵션` `인증 옵션` `도메인 옵션` `쿼리 필터` `속성 목록`

아마도 이것이 완전히 정확하지는 않겠지만, 이것이 내가 이 논의를 구성하고 "시작하기" 방법으로 생각할 것을 권장하는 방식입니다. 모든 옵션을 설명하지는 않겠지만, 모두들 매뉴얼 페이지를 읽거나 여기 추가 옵션을 검토하도록 장려합니다. 일관성을 위해 dsquery로 모든 사용자를 나열하는 동일한 쿼리를 사용합시다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_3.png" />


ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(objectClass=user)” dn


안녕하세요! Ldapsearch는 더 복잡할 것입니다. 종종, 필요한 옵션을 갖춘 첫 번째 쿼리를 작성한 다음 필터와 필요한 속성 목록을 조정하기 위해 마지막 두 부분을 수정합니다. 중요한 점은 이곳에서 전제로 한 것은 AD에 액세스할 수 있는 계정의 일반 텍스트 자격 증명을 가지고 있다는 것입니다. 이 쿼리에 대해, 제목 계정에 대한 일반 텍스트 사용자 이름과 암호를 사용했으며 이는 손상된 서비스 계정을 시뮬레이션합니다. 사용자 이름과 암호는 반드시 필요하지 않을 수 있지만 어떤 종류의 인증이 필요할 것입니다. 이 블로그에서는 이러한 방식으로 쿼리를 작성할 것이며, "옵션" 섹션에서 다른 방법에 대해 설명하겠습니다.

# 쿼리 작성하기

<div class="content-ad"></div>

## 복합 필터

복합 필터는 성공적인 쿼리를 위해 꼭 필요해요. 이를 사용하면 찾고자 하는 대상의 범위를 크게 좁히고 시간을 낭비하지 않게 도와줄 수 있어요.

복합 필터는 다음과 같이 보일 거에요:

“(&(attribute1=value1)(attribute2=value2))”

<div class="content-ad"></div>

여기에서 &는 복합 필터임을 나타내고, 어떤 결과도 해당 속성에 대해 두 가지 값을 가져야 합니다. ! 기호를 사용하여 필터에서 항목을 제외할 수 있지만 괄호로 감싸야 합니다. 다음과 같이 몇 가지 결과를 제외할 수도 있습니다:

"(&(attribute1=value1)(!(attribute2=value2)))"

이 필터는 attribute1에 대한 값이 value1이고 attribute2에 대한 값이 value2가 아닌 결과 목록을 생성합니다. 이러한 필터는 dsquery와 ldapsearch 간에 동일하게 작동합니다. 사용 중인 명령 줄 도구에 따라 ! 기호를 사용하는 데 어려움이 있을 수 있습니다.

## 와일드카드

<div class="content-ad"></div>

이 도구를 사용한 모든 쿼리는 와일드카드 검색입니다. 처음 시작할 때 환경에 적응하고 방향을 잡을 때 굉장히 유용합니다. 일반적으로 저의 접근 방식은 매우 넓게 시작하여 찾은 것을 기반으로 쿼리를 좁히는 것입니다. 이름이나 구절을 별표로 감싸거나 구절의 시작 또는 끝에 두는 등 여러 방법으로 쿼리를 구체화할 수 있습니다.

dsquery를 사용하여, 모든 Windows 기기의 이름과 sAMAccountName을 가져오고 싶은 예시를 살펴보겠습니다.

![image](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_4.png)

dsquery * -filter “(&(objectclass=computer)(name=*win*))” -attr name samaccountname -d 192.168.88.195

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_5.png)

ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(&(objectclass=computer)(name=*win*))” name samaccountname

실제로 이를 시작할 때는 앞으로 진행하기 위해 필요한 속성만 반환하는 것이 좋습니다. 대규모 AD 환경에서는 많은 결과를 반환할 수 있으며, OPSEC 고려사항과 AD 개체를 통해 읽을 때의 주의 기준에 따라 더 적은 속성이 더 좋을 수 있습니다. 잠재적인 대상을 좁힐 때, 구체적인 결과를 얻기 위해 와일드카드를 사용하지 않고 이동할 가능성이 높습니다.

와일드카드를 사용하는 또 다른 이점은 찾고 있는 내용을 알아보기 어렵게 만들기 위해 부분 단어를 사용할 수 있다는 것입니다. 예를 들어, password 또는 administrator를 검색하는 대신 *sword* 또는 *minis*와 같이 검색할 수 있습니다.


<div class="content-ad"></div>

## 사용자

AD에서 사용자를 찾는 것은 복잡할 수 있습니다. 특히 도메인이 사용자 이름 대신 사용자명을 사용하지 않을 때는 더욱 그렇습니다. 많은 경우에, 사용자들은 입사할 때 이름과 직접적으로 연결되지 않는 고유한 식별자를 부여받습니다. 사용자를 쿼리할 때 명심해야 할 중요한 점은 컴퓨터 객체도 사용자로 간주된다는 것입니다. 쿼리에 따라 결과에서 컴퓨터를 제외해야 할 수도 있습니다.

이 예에서는 w가 이름에 포함된 모든 사용자 객체를 반환하는 쿼리를 보여줍니다:

![image](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_6.png)

<div class="content-ad"></div>


dsquery * -filter “(&(objectclass=user)(!(objectclass=computer)(name=*W*)))” -attr name samaccountname -d 192.168.88.195

시스템 관리자가 관리 기능과 일상적인 사용을 위한 서로 다른 계정을 가지는 것이 일반적입니다. 이와 같은 쿼리를 사용하면 -sa 또는 -da와 같은 추가 권한을 나타내는 이름을 가진 계정을 찾을 수 있습니다.

![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_7.png)

ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(&(objectclass=user)(name=*W*))” name samaccountname


<div class="content-ad"></div>

이 ldapsearch 예제에서 보듯이 컴퓨터 개체가 사용자와 함께 반환되었습니다. ldapsearch에서 객체를 제외하는 것은 어렵기 때문에 *nix 시스템에서 ! 연산자는 특정한 의미를 갖습니다. 저는 이를 escape 하는데 성공한 방법을 찾지 못했습니다 (\! 그리고 다른 여러 시도한 것들이 잘못된 필터를 반환했습니다).

## 그룹

그룹을 수동으로 찾고 추적하는 것은 매우 어려울 수 있습니다. 잘 구조화된 AD 환경에서는 세부적인 권한을 갖는 그룹들이 있을 것이며, 사용자들은 작업 요구에 따라 그룹에 배치될 것입니다. 또한, 또다른 복잡성 수준을 추가하는 중첩 그룹을 발견하기도 합니다. 특정 권한을 가진 그룹을 찾는 것은 명명 규칙과 용어를 모르는 경우 어려울 수 있습니다.

dsquery에서는, 그룹 개체 유형을 사용하여 이름별로 그룹을 빠르게 찾을 수 있습니다. 와일드카드 개체 유형을 사용하면 사용자를 찾을 때 필요한 속성이 더 많이 반환됩니다. 아래는 이름에 *admin*이 포함된 그룹이 그룹 개체 유형을 사용하여 나열된 쿼리들입니다. 그런 다음, 그룹 이름에 *admin*이 포함된 그룹을 열거하는 와일드카드 유형을 사용하는 쿼리가 옵니다. 마지막으로, 특정 그룹인 Domains Admins가 선택되고 해당 그룹의 멤버가 (이 경우에는 한 명만) 나열됩니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_8.png)

dsquery group -name *admin* -d 192.168.88.195

dsquery * -filter “(&(objectclass=group)(name=*admin*))” -attr name samaccountname -d 192.168.88.195

dsquery * -filter “(&(objectclass=group)(samaccountname=도메인 관리자))” -attr name samaccountname member -d 192.168.88.195


<div class="content-ad"></div>

ldapsearch에서는 구문이 dsquery와 매우 유사합니다. 아래는 이름에 *admin*이 포함된 그룹을 찾는 ldapsearch 구문입니다.


ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(&(objectclass=group)(name=*admin*))” name samaccountname


그룹에 대한 운영 참고 사항으로, 목록을 좁힐 때는 적은 속성으로 시작하고 확장하는 것이 좋습니다. 또한 그룹의 설명을 확인하는 것도 좋은 아이디어입니다. 그룹 이름에 사용된 약어나 줄임말에 대한 자세한 내용이 그룹 설명에 포함되어 있는 경우가 많습니다. 그룹 설명에서 약어나 줄임말을 설명하는 경우가 종종 있습니다.

<div class="content-ad"></div>

## 컴퓨터

내 경험상, 특정 컴퓨터를 찾거나 그룹 컴퓨터를 찾을 때는 일반적으로 이미 검색을 뒷받침할 정보가 있습니다. 다행히 컴퓨터를 찾는 것은 사용자를 찾는 것보다 쉽습니다.

dsquery에서 컴퓨터 객체 유형이나 와일드카드를 사용할 수 있습니다. 컴퓨터 객체 유형을 사용하면 컴퓨터를 필터링하는 데 사용할 수 있는 여러 옵션이 있지만, 이 블로그에서는 이를 자세히 다루지는 않겠습니다. 와일드카드 객체 유형을 사용하면 출력이나 필터에 운영 체제(operatingsystem 속성)를 추가하는 것이 좋습니다. 이렇게 하면 시스템을 대상으로 선택할 때 매우 유용한 정보를 얻을 수 있습니다.

아래 예시는 dsquery에서 이름에 DC가 포함된 컴퓨터 객체를 검색하는 방법을 보여줍니다. 가정은 도메인 컨트롤러가 환경에 표시되어 있다는 것입니다. 이 환경은 도메인 컨트롤러가 하나뿐이지만, 더 큰 환경에서는 많은 도메인 컨트롤러가 있을 수 있습니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_10.png" />

dsquery computer -name *DC* -d 192.168.88.195

dsquery * -filter “(&(objectclass=computer)(name=*DC*))” -attr name samaccountname operatingsystem -d 192.168.88.195

Ldapquery will be very similar, and again, I recommend adding the operating system attribute to the filter or output.


<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_11.png" />


ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D 'PLANETEXPRESS\SService' -w 'L1feD3@thSeamlessContinuum' -b 'DC=PLANETEXPRESS,DC=LOCAL' "(&(objectclass=computer)(name=*DC*))" name samaccountname operatingsystem


대부분의 쿼리와 마찬가지로, 컴퓨터에 대한 모든 속성을 나열한 후 타겟팅하는 것을 권장합니다. 또한, 컴퓨터의 sAMAccountName은 이름에 $가 추가된 것입니다. 명령행을 사용할 때, 이것이 무슨 일을 하느냐에 따라 문제를 일으킬 수 있습니다.

## 설명

<div class="content-ad"></div>

도메인에서 잠재적인 대상에 대해 자세히 알아보는 좋은 방법은 설명으로 검색하는 것입니다. 종종 약어 및 머릿글이 설명에 나온다는 것을 알면 유용하며, 제한된 정보가 주어졌을 때 도움이 됩니다. 때로는 비밀번호가 설명에 심지어 포함되어 있을 수도 있습니다.

이 쿼리를 위한 필터를 만들 때, 필요한 경우가 아니라면 개체 유형을 명시적으로 지정하지 않습니다. 결과가 조금 더 열리고 예상치 못한 상황이나 설정을 발견할 수 있습니다. 또한, 해당 속성으로 출력하는 설명을 반드시 포함해야 합니다. 왜냐하면 검색 중인 키워드나 구문이 있을 수는 있지만, 도움이 되지 않는 맥락 속에 있을 수도 있기 때문입니다.

다음은 dsquery에서 password와 admin이 설명에 포함된 개체를 검색하는 몇 가지 예시입니다.

![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_12.png)

<div class="content-ad"></div>

아래는 표와 동일한 내용을 Markdown 형식으로 작성한 것입니다.


dsquery * -filter “(description=*password*)” -attr name description -d 192.168.88.195

dsquery * -filter “(description=*admin*)” -attr name description -d 192.168.88.195

주의할 점은 출력물이 조금 더 길어진다는 점입니다. 이제 같은 쿼리를 ldapsearch로 살펴봅시다.


위 내용을 참고해주시고, 필요하시면 질문해주시기 바랍니다.

<div class="content-ad"></div>


ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(description=*password*)” name description

![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_14.png)

![이미지](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_15.png)

ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(description=*admin*)” name description


<div class="content-ad"></div>

상황에 따라서 약어만 주어지고 전체 이름을 알고 싶다면 그 설명에 약어가 나와있지 않을 수 있습니다.

## 비밀번호 마지막 설정

pwdLastSet 속성은 대상이 되는 계정을 찾을 때 도움이 될 수 있습니다. 서비스 계정은 때때로 특정 기능에 필요하며 해당 기능에 따라 변경하기 어려울 수 있으므로 오래되고 간단한 암호를 가지고 있을 수도 있습니다. 이는 조직의 암호 정책이 제대로 시행되었는지를 빠르게 확인할 때도 유용합니다.

Dsquery 및 ldapsearch는 동일(=)이외의 비교를 허용합니다. 이 경우에는 pwdLastSet 속성이 특정한 양보다 작은 개체를 찾아야 합니다. 이 값은 에포크 시간에 저장돼 있기 때문에 읽기가 어렵습니다.

<div class="content-ad"></div>

비록 이 도메인이 새롭지만, 여전히 dsquery에서 이 쿼리가 어떻게 보이는지 살펴볼 수 있습니다. 단순히 `를 사용한 쿼리는 작동하지 않으므로 `=가 필요합니다.

![image](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_16.png)

dsquery * -filter “(&(objectclass=user)(pwdlastset`=132655849658851779))” -attr name pwdlastset -d 192.168.88.195

ldapsearch에서도 쿼리를 수행할 때 `=를 사용해야 할 것입니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_17.png" />

ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(&(objectclass=user)(pwdlastset`=132655849658851779))” name pwdlastset

설명: 주로 시간을 얻는 데 관련된 운영 참고 사항이 있습니다. 온라인 변환기를 사용하여 시간을 얻고 변환할 수 있습니다. 또한 PowerShell 또는 Windows 명령 줄 (dsquery 예제에 표시된대로 w32tm.exe /ntte `에포크 시간`)을 사용하여 사람이 읽을 수 있는 버전을 얻을 수도 있습니다. 이전에 언급된 바와 같이, 이것은 클라이언트의 결과를 개선하는 데 확인하는 빠른 확인 사항이 될 수도 있습니다.

## Member Of


<div class="content-ad"></div>

멤버오브 속성으로 검색하는 것은 이미 약간의 정보가 있는 경우에 가장 적합합니다. 그룹 멤버십에 기반한 사용자를 찾는 데 매우 도움이 됩니다. 이미 그룹의 이름을 알고 있다면 당연히 속성에 그룹의 구성원을 나열할 수 있습니다. 그러나 필터를 결합하여 여러 그룹의 구성원인지 사용자를 확인할 수도 있습니다. 예를 들어 Domain Admins 및 Server Operators와 같이 여러 그룹의 구성원인 사용자가 있는지 확인할 수 있습니다.

dsquery를 사용하여 그룹의 구성원인 사용자를 쿼리하는 방법은 다음과 같습니다:


<img src="/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_18.png" />

dsquery * -filter “(&(memberof=CN=Staff,DC=PLANETEXPRESS,DC=LOCAl)(memberof=CN=ShipCrew,DC=PLANETEXPRESS,DC=LOCAL))” -attr name memberof -d 192.168.88.195


<div class="content-ad"></div>

쿼리를 위해 그룹의 완전한 distinguishedName이 필요할 수 있습니다. ldapsearch에서 비슷한 쿼리를 작성할 것입니다.

![image](/assets/img/2024-06-20-AnIntroductiontoManualActiveDirectoryQueryingwithDsqueryandLdapsearch_19.png)

```plaintext
ldapsearch -LLL -x -h DC-THESHIP.PLANETEXPRESS.LOCAL -p 389 -D ‘PLANETEXPRESS\SService’ -w ‘L1feD3@thSeamlessContinuum’ -b ‘DC=PLANETEXPRESS,DC=LOCAL’ “(&(memberof=CN=Staff,DC=PLANETEXPRESS,DC=LOCAl)(memberof=CN=ShipCrew,DC=PLANETEXPRESS,DC=LOCAL))” name memberof
```

쿼리 중에 이 정보를 터미널이나 어플리케이션 외부에 저장하는 것이 중요합니다. 쿼리는 많은 공간을 차지할 수 있고 정보를 저장하면 추가 쿼리를 다시 실행할 필요가 없습니다.

<div class="content-ad"></div>

# 옵션들

## Dsquery

쿼리 끝에 추가할 수 있는 여러 옵션이 있습니다. 위 쿼리에서 사용된 옵션들이거나 저가 가장 자주 사용하는 옵션들입니다.

-attr

<div class="content-ad"></div>

이것은 와일드카드 유형으로 사용할 수 있는 속성 필터입니다. -attr *을 사용하면 객체의 모든 속성을 출력할 수 있습니다. 특정 속성을 얻으려면 AD의 속성 이름(예: sAMAccountName, pwdLastSet 등)을 쉼표로 구분된 목록에 사용하면 됩니다. 일반적으로 저는 매우 넓은 범위의 객체 필터로 시작하여 속성을 좁혀 나갑니다. 대상 객체의 목록을 좁히는 동안 속성을 더 개방하여 추가 정보를 얻습니다. 매우 큰 AD 환경에 있을 때, 그리고 사용하는 C2 플랫폼에 따라 실제로 시간을 절약할 수 있습니다. 일반적으로 시작할 때는 아주 넓은 범위의 네트를 던져두고 더 많은 정보를 알게 되면 좁혀나갑니다.

-d

이것은 도메인 플래그이며 큰 도메인 환경에서 작업할 때 매우 유용할 수 있습니다. FQDN 또는 IP 주소로 쿼리할 서버를 지정할 수 있으며 환경이 허용된다면 다른 도메인으로 쿼리하는 데 사용할 수 있습니다. 다른 도메인 컨트롤러를 쿼리하면 흥미로운 데이터 점이 제공될 수 있습니다. 대부분의 데이터가 도메인 컨트롤러 간에 복제되지만 최종 로그인은 항상 복제되지 않는 경우가 있습니다. 특정 사용자 또는 사용자가 마지막으로 로그인한 시간을 찾고 있다면, 인증한 도메인 컨트롤러에 따라 다른 답을 얻을 수 있습니다.

-u -p

<div class="content-ad"></div>

이 두 가지 플래그는 AD 쿼리에 사용할 사용자 이름과 비밀번호를 지정하는 데 사용할 수 있어요.

-limit

큰 도메인에서 작업할 때 유용한 다른 옵션입니다. 기본적으로 dsquery의 결과는 처음 100개로 제한됩니다. 0으로 설정하면 쿼리 결과가 모두 반환됩니다. 제가 이를 운영에 사용하는 다른 방법은 한 번에 결과를 반환하기 전에 리미트를 1로 설정해서 필터와 옵션이 올바르게 설정되었는지 확인하는 것이에요.

## Ldapsearch

<div class="content-ad"></div>

Ldapsearch에는 블로그를 작성할 만큼 충분한 옵션이 있습니다. 여기에서 사용되거나 더 유용한 옵션에도 초점을 맞출 것입니다.

- L(L)(L)

이 옵션은 제 모든 ldapsearch 명령어의 시작 부분에 있습니다. 출력에서 일반 LDAP 정보를 제거합니다. 세 가지 레벨이 있으며, 일반적으로 모든 정보를 제거하는 것을 선택하였습니다. 정보를 제거하면 출력물이 더 간결해지기 때문입니다.

- x

<div class="content-ad"></div>

간단한 인증 (즉, 사용자 이름 및 비밀번호)을 사용하므로 Simple Authentication and Security Layer (SASL)이 아닙니다. 이 예시에서는 사용자 이름과 비밀번호를 사용해야 했지만 항상 해당 사례가 아닐 수 있습니다.

-h

질의를 실행할 대상 호스트를 지정하는 데 사용합니다. 예시로 사용된 환경에서는 도메인 컨트롤러가 하나만 있어 일관성이 있었습니다.

-p

<div class="content-ad"></div>

일반적으로 LDAP 서버가 청취하는 포트 번호를 지정하세요. LDAPS의 경우 보통 389 또는 636입니다만, 확인이나 문제 해결 중에는 미리 확인하는 것이 좋습니다.

-D

이는 LDAP 디렉토리에 바인딩할 distinguishedName입니다. -x 옵션을 사용하지 않는 경우 서버는 이 값을 무시할 것입니다.

-w -W -y

<div class="content-ad"></div>

모두 비밀번호 관련 사항입니다. 예제에서 -w를 사용한 이유는 C2를 통해 사용 중이시라면 이것이 필요한 옵션이기 때문입니다. C2를 사용할 때 비밀번호를 입력할 방법이 없는 경우가 많기 때문입니다. 명령을 통해 평문 비밀번호를 보내는 것은 좋은 실천 방법이 아니지만, 비밀번호를 입력할 수 있는 방법이 없으면 쿼리가 완료되지 않을 수 있습니다. 상호 작용하는 경우 -W 옵션을 사용하여 비밀번호를 요청할 수도 있습니다. 또는 비밀번호 파일을 사용할 수 있는 -y 옵션을 사용할 수도 있습니다.

-b

쿼리의 검색 베이스를 지정하는 데 사용됩니다. 일반적으로 도메인에 대한 식별 이름이겠지만 쿼리에 따라 더 세부적으로 좁힐 수도 있습니다.

# 결론

<div class="content-ad"></div>

이것은 AD를 질의하는 가장 쉬운 방법도 가장 최적의 방법도 아닙니다. 시작부터 이렇게 말씀드리듯이 BloodHound나 PowerView와 같은 도구들이 이에 더 적합합니다. dsquery나 ldapsearch를 사용해야 하는 상황에 처했을 때, 이 안내서가 여러분이 이러한 쿼리를 어떻게 만들어야 하는지 연구하는 시간을 조금이나마 절약할 수 있도록 도와줄 것입니다. 이 두 도구에 대해서 다뤄야 할 쿼리와 옵션은 훨씬 더 많습니다. 나는 내 자신의 도메인 설정을 마무리하고 이 블로그를 쓰고 정신건강을 유지하려고 노력하는 힘든 경험을 견디고 나면, 추가 정보를 포함한 후속 글을 작성할 수도 있습니다.

여기서 찾고 계신 것을 찾지 못하셨나요? 트위터로 연락 주시거나 SpecterOps에 연락 주세요. 추가 정보를 포함한 후속 블로그가 언젠가 공개될 예정이며, 여러분의 제안을 환영합니다.