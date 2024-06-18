---
title: "macOS 사용자들 주의하세요 AMOS Trojan"
description: ""
coverImage: "/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_0.png"
date: 2024-06-19 04:46
ogImage: 
  url: /assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_0.png
tag: Tech
originalTitle: "MacOS users beware! AMOS Trojan"
link: "https://medium.com/xaviemirmon/macos-users-beware-amos-trojan-2f03c0848b1f"
---


며칠 전, 전에 경험한 일이 있었어요 — MacOS에서 트로이 목마에 감염된 적이 있었는데, 정말 좋지 않았어요...

저는 평생 MacOS 사용자로서 항상 해커들이 일반적으로 Windows를 MacOS보다 공격한다는 사실에 안심하며 쉬어왔어요. 그럼에도 불구하고, 웹 개발을 하는 저 같은 사람에게는 종종 OS에 대한 추가 저수준 액세스가 필요하기 때문에 안전성 프로그램을 설치하는 습관은 항상 가지고 있었어요.

최근 프로젝트를 위해 자신을 준비하기로 결정하여 Notion 앱을 사용하기로 했어요. 평소와 같이 Google에 가서 "Notion Mac 앱"을 입력했어요. 결과 목록에는 후원 링크가 있었는데, 그것을 클릭하여 .dmg 설치 파일을 다운로드했어요.

<div class="content-ad"></div>

인스톨러를 열었더니 브랜딩의 일부가 빠져 있어서 이상하게 보였지만, 크게 신경 쓰지 않고 설치했어요.

![이미지](/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_1.png)

보일랑 설치되었죠? 아니에요—이게 바로 진짜 공포와 충격이 시작된 곳이에요!

터미널 창이 열리고 오류가 표시되는 걸 보고 뭔가 이상하다고 생각했어요. 이런 행동은 표준 MacOS 인스톨러에서 전혀 예상되지 않는 행동이에요.

<div class="content-ad"></div>

# 파일 조사 중

무언가가 이상하다고 느껴져서 내 백신이 최신 상태인지 확인하고 이 파일을 스캔했지만 결과가 없었습니다. 그 후 내가 좋아하는 팟캐스트 중 하나인 '다크넷 다이어리'에서 새로운 바이러스 시그니처를 업로드할 수 있는 도구인 '바이러스 토탈'이 있다는 것을 기억했습니다. 그곳에 설치 파일을 업로드하니 'trojan.stealer/amos' 라벨이 붙어왔어요. 그래서 제가 피해를 입은 것을 입증할 증거가 생겼죠.

# 바이러스 제거

상당히 놀라운 일이지만, 2023년 8월 21일에 이 피해를 입은 시점에서 언제나 그랬듯이 백신 도구가 두 가지밖에 설치되어 있지 않았습니다 (2023년 4월에 뉴스에 소개되었음에도 불구하고). Avast와 AVG 도구가 스캔에 포함되어 있었는데, 후자를 설치하기로 결정하고 트로이 목마를 제거하는 데에 성공했습니다.

<div class="content-ad"></div>

# 어떻게 속았을까요?

바이러스를 안전하게 제거한 후에는, 어떻게 다운로드했는지 궁금해졌어요. 방문한 페이지는 Notion 홈페이지와 똑같이 생겼었어요. 운이 좋게도 웹페이지가 아직 열려 있어서, 경고 신호가 있는지 확인해 보기로 했어요. 젠장! URL이 https://notio.pw/?utm_campaign=CjwKCAjwloynBhBbEiwAGY25dEvBN5EbUsSvZIuvi2NQTrQH9IT9lsN2e3ztaoaiqXd1C_H3SYAoAhoCzvQQAvD_BwE&utm_term='keyword'&utm_medium=tm&lpurl=https://www.notion.so/help/guides 였어요. Notion 도메인인 https://notion.so 가 아니었어요.

## Notion 사이트가 침해되었나요?

https://notion.so로 향하는 링크를 클릭하면서 .pw로 향하는 것이 어떻게 사기꾼의 사이트에 도착했는지 궁금해졌어요. Notion 사이트를 살펴보니, Next.js와 Contentful을 사용하여 구축되었는데, 이것은 상대적으로 안전한 설정이지만 결코 완전히 취약하지는 않아요. 거기서 왔다고 생각되지는 않지만, 오히려 광고 자체와 구글이 링크가 올바른 도메인을 가리키고 있는지 제대로 확인하지 않았을 수도 있어요. Malwarebytes에서 나온 기사는 내가 경험한 것이 정확하다고 보여주며, 패키지가 '악성 광고'를 통해 확산된다고 합니다. 그 의심을 더하려면, 위의 URL에는 끝에 'lpurl=https://www.notion.so/help/guides'이라는 쿼리 매개변수가 포함되어 있어요. "lpurl"은 내가 클릭한 Google 광고에 표시된 것으로, 그것은 저를 침해된 사이트로 리디렉트하기 전에 유효한 Notion URL이었어요.

<div class="content-ad"></div>

# AMOS Stealer란 무엇인가요?

Atomic MacOS (AMOS) 스틸러는 저장된 비밀번호, 브라우저 히스토리/세션 및 암호화폐 지갑을 노린 고급 트로이 목마 바이러스입니다. 

이는 트레이딩 뷰, 노션, 포토샵 CC와 같은 인기 앱들로 위장합니다.

AMOS는 매월 $1,000에 어울리는 프라이빗 텔레그램 채널을 통해 라이선스가 부여됩니다.

![AMOS Trojan](/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_2.png)

<div class="content-ad"></div>

"9-to-5 Mac" 논문은 AMOS와 관련된 모든 것을 잘 보여줍니다.

# 피해를 최소화하기

내가 침해를 당했다는 것을 알고, 바이러스를 제거하는 것만으로 충분하지 않았습니다. 피해를 최소화하기 위해 몇 가지 추가 단계가 필요했습니다.

## 광고 신고하기

<div class="content-ad"></div>

가장 먼저 해야 했던 일은 구글에 광고를 삭제해 달라는 것이었습니다. 이를 위해 제가 한 일은 후원된 결과의 점 세 개 아이콘을 클릭하는 것이었습니다.

![이미지](/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_3.png)

그런 다음 광고를 구글에 신고했습니다.

![이미지](/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_4.png)

<div class="content-ad"></div>

## WHOIS 및 남용 신고 수행

DomainTools에서 WHOIS 조회를 수행하여 도메인/서버의 악의적 활동을 호스트에 신고해 볼 수 있습니다.

![이미지](/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_5.png)

등록기관에 이메일을 보낼 때, ProtonMail과 같은 익명 이메일 서비스를 사용하는 것을 권장합니다. 상대방이 누구인지 확신할 수 없기 때문입니다.

<div class="content-ad"></div>

## 암호를 변경하고 TFA 활성화하기

운이 좋게도 나는 암호를 관리하기 위해 1Password를 사용합니다. 이는 나의 암호가 보관소에 안전하게 암호화되어 있음을 의미합니다. 그러나 MacOS 키체인이나 Chrome 자동 입력에 저장된 내용을 알지 못한 채로 모두 재설정했습니다. 추가적인 예방 조치로, 지원하는 사이트에 이중 인증을 추가했습니다.

# 페이스북에 대한 간단한 메모...🤬

Facebook 광고가 작성되었고 사용자가 내 계정에 추가되었음을 알았습니다. 이와 같은 이메일로 덮쳐졌습니다.

<div class="content-ad"></div>

![표](/assets/img/2024-06-19-MacOSusersbewareAMOSTrojan_6.png)

TFA를 활성화한 후에 사용자 추가 흐름이 멈추었습니다. 이는 저의 모든 비밀번호를 변경하고 세션을 재설정했음에도 소 compromise에 포함된 활성 세션이 여전히 계속되고 있다는 것을 나타냅니다.

생성된 광고는 베트남의 비즈니스를 위한 것이었는데, 지리적으로 저와는 가능한 한 멀리 떨어진 곳이었고, 그 이후로도 이전에나 이후에 상호작용한 적이 없었습니다. 이 사기 행위는 거의 4주 뒤에 메타로부터 이러한 응답을 받았습니다.

유감스럽게도, 저는 번복을 하였음에도 불구하고 그들이 제 요청을 닫았고, 이 문제를 해결하기 위해 직접 은행에 가야 했습니다.

<div class="content-ad"></div>

# 결론

MacOS에는 이제 더 이상 악성 소프트웨어가 없는 것은 아닙니다. AMOS Stealer가 등장하여 상당히 해로울 수 있습니다. Apple 제품을 사용하는 사용자들은 이제 악성 소프트웨어로부터 안전하게 유지하기 위해 특히 주의해야 합니다. 저는 스스로 기술에 능숙하다고 생각했지만, 이 악질함에 걸렸습니다. 지금 내가 시행하는 몇 가지 주의사항이 있습니다:

- 사이트의 URL을 재확인합니다.
- 이상하게 보이면 설치하지 마세요!
- 좋은 안티바이러스 소프트웨어를 설치하세요 (이 경우 AVG 또는 Avast).
- 쉬고 있는 상태에서 암호를 보관하는 전용 매니저를 사용합니다 (Bitwarden 또는 1Password 사용을 권장합니다).
- 이중 인증을 활성화하세요.
- 가능한 경우 Facebook 계정을 잠그세요. 앱 액세스, 저장된 신용 카드 정보, 광고 계정을 삭제하세요.
- Google에서 벗어나 다른 검색 엔진을 사용하세요.

이것이 MacOS 사용자들에게 경고가 될 것을 기대하며, Mac을 사용하는 경우 설치를 클릭하기 전에 두 번 생각해보시기 바랍니다.