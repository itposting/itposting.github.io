---
title: "오픈 소스 프로젝트가 왜 많은 경쟁을 하는 걸까요"
description: ""
coverImage: "/assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_0.png"
date: 2024-06-19 08:33
ogImage: 
  url: /assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_0.png
tag: Tech
originalTitle: "Why Are There So Many Competing Open Source Projects?"
link: "https://medium.com/pragmatic-programmers/why-are-there-so-many-competing-open-source-projects-e69c12de1aed"
---



![2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_0.png](/assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_0.png)

![2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_1.png](/assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_1.png)

우리 모두에게 일어난 일이죠. 문제를 해결할 소프트웨어 패키지를 찾아보면 멋진 오픈 소스 프로젝트를 발견하곤 합니다. 그리고 또 다른 프로젝트를 찾게 됩니다. 그 이유는 무엇일까요?

# 고양이를 쓰다듬는 방법은 다양합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_2.png" />

가끔은 동일한 문제를 해결하기 위해 여러 프로젝트가 존재하는 이유는 다양한 접근 방식 때문입니다. 이러한 방식은 기술적 가치나 스타일적 선택 사항에 따라 다를 수 있습니다. 왜 소켓 렌치와 박스엔드 렌치 둘 다 자가 있어야 할까요? 둘 다 볼트를 돌리는 도구지만 서로 다른 기능을 가지고 있습니다.

예를 들어, KDE Plasma와 LXQt는 모두 Qt 기반 데스크톱 환경입니다. 그러나 Plasma는 더 기능이 풍부한 경험을 위해 설계되었고, LXQt는 가벼운 환경을 제공합니다. GNOME 데스크톱의 3버전이 출시되면서, 일부 사람들은 2버전 스타일을 선호하여 MATE 데스크톱으로 계속 개발했습니다.

Apache HTTPD와 NGINX는 가장 널리 사용되는 두 웹 서버입니다. 둘 다 왜 있을까요? Apache는 일부 사용 사례에 중요한 유연한 사용자 정의를 제공합니다. 그러나 NGINX의 아키텍처는 리소스 풋프린트를 줄여줍니다. 특정 사례에서 올바른 선택은 필요한 것에 따라 달라집니다.

<div class="content-ad"></div>

한 번 생각해 봐요: 대부분의 개발자들은 여러 프로그래밍 언어를 알고 필요에 따라 사용합니다. 텍스트를 많이 구문 분석해야 할 때는 Perl을 사용해요. 몇 가지 명령어를 연결해야 할 때는 셸 스크립트가 구원의 천사죠. 버그 데이터 또는 설문 결과를 분석할 때는 Python의 pandas 라이브러리가 제 선택이에요.

# 이 코드를 가져가서 분기해 보세요!

![image](/assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_3.png)

경쟁 프로젝트는 커뮤니티 일부가 코드를 가져가서 다른 곳으로 이동하기로 결정할 때 발생할 수 있어요. 이를 포크(fork)라고 해요. 이 종류의 포크는 GitHub에서 프로젝트에 기여할 때 만드는 포크와 혼동하면 안 돼요. 기본적으로 메커니즘은 비슷하지만, GitHub 포크는 일반적으로 일시적이에요. 우리가 이 섹션에서 이야기하는 포크는 영구적이에요.

<div class="content-ad"></div>

포크도 친절할 수 있어요. 친절한 포크는 원본 프로젝트에 변화를 기여하고자 만들어졌거나 실험을 하기 위해 만들어진 것이에요. 친절한 포크의 한 예시로 네오오피스 프로젝트가 있어요. 이 프로젝트는 인기 있는 오픈 오피스 스위트의 OS X 네이티브 버전을 개발하기 위해 만들어졌어요. 리눅스 배포의 소프트웨어 패키지는 종종 친절한 포크인데, 원본이 아직 수정되지 않은 버그나 빌드 문제를 해결하기 위한 패치가 포함되어 있어요.

반면에, 포크가 혼란스러워질 수도 있어요. 리브레오피스는 오라클이 선 마이크로시스템즈(그리고 오픈 오피스)를 인수한 이후에 오픈 오피스로부터 포크되었어요. 커뮤니티가 오라클을 믿지 않았기 때문에 코드를 가져가 새로운 프로젝트를 시작했어요. 개발자가 커뮤니티를 떠나도록 요청받거나(또는 스스로 결정한다면), 과거 프로젝트의 적대적인 포크를 만들 수도 있어요.

<div class="content-ad"></div>

프로젝트 설립자들은 대개 이유를 공개하지 않지만, 때로는 경쟁 프로젝트를 시작하는 이유가 그들이 그것이 자신들의 것이 되기를 원하기 때문일 수도 있습니다. 이 이유는 특별히 설득력이 있는 것은 아니기 때문에 보통 "기존 프로젝트에 제가 정말 필요한 것이 없다"는 핑계 속에 숨겨져 있습니다. 저는 그 누구의 이름도 여기서 언급하여 남들을 부끄러워하지는 않겠습니다. 여러분들도 필요한 예를 직접 찾아보실 수 있을 거라고 확신합니다.

주목할 만한 "우리가 만들지 않은 것" 프로젝트 중에는 취미 또는 학습 프로젝트로 시작하여 크게 성장한 것들도 있습니다. 리누스 토발즈는 리눅스를 "gnu처럼 크고 전문적이지 않을 취미"로 소개했습니다. 오늘날 당연히 리눅스 커널은 다른 어떤 장치보다도 많은 곳에서 실행됩니다.

# 이게... 좋은 건가요?

![이미지](/assets/img/2024-06-19-WhyAreThereSoManyCompetingOpenSourceProjects_5.png)

<div class="content-ad"></div>

한편, 경쟁 프로젝트들이 혼란스러운 상황을 초래한다는 점이 있습니다. 새로운 사용자는 간단히 리눅스를 설치할 수 없습니다. 먼저, 수십 가지의 배포판 중 어떤 것을 설치할지 결정해야 합니다. 그리고 우분투나 페도라와 같은 대형 배포판을 선택하더라도, 해당 그룹 내에서도 더 많은 변종을 선택해야 합니다.

이 분열은 많은 어려움을 야기합니다. 표준화의 부재가 리눅스 데스크톱의 주류 채택을 제한한다는 주장도 있습니다.

그러나 분열은 기회를 제공하기도 합니다. 경쟁하는 프로젝트들은 아이디어와 개발자들을 공유하면서 협력합니다. 코드가 공개되어 있기 때문에 서로의 성공과 실패에서 교훈을 얻을 수 있습니다. 문제 해결에 대한 다양한 접근 방식을 시도하면 가장 좋은 방법을 찾아낼 수 있습니다. 때로는 명확한 우승자가 나타나서 사실상의 표준이 됩니다. 그렇지 않다면, 당신의 요구 사항과 취향에 맞는 오픈 소스 프로젝트를 찾을 수 있을 것입니다. 만약 찾지 못한다면, 당신이 하나를 창시할지도 모릅니다.

저자 Ben Cotton의 책을 The Pragmatic Bookshelf에서 확인해보세요. open_source_2022 프로모션 코드로 2022년 11월 15일까지 현재 구매에서 35%를 할인 받을 수 있습니다. 프로모션 코드는 이전 구매에는 적용되지 않습니다.