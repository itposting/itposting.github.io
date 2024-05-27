---
title: "인도 투데이 구독 2년간 무료로 이용하기 "
description: ""
coverImage: "/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_0.png"
date: 2024-05-27 15:35
ogImage:
  url: /assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_0.png
tag: Tech
originalTitle: "How I Hacked India Today Subscription for 2 years 😅🥳🤑"
link: "https://medium.com/@anudeep-vysyaraju/how-i-hacked-india-today-subscription-for-2-years-4e49701fa7c8"
---

블로그에 들어가기 전에...

커뮤니티의 해커들을 위한 나의 속담...

"여자들보다 버그 바운티 프로그램에 집중해; 프로그램은 노력을 인정하지만 여자들은 그렇지 않아요. 😉"

![이미지](/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_0.png)

<div class="content-ad"></div>

시작해 봅시다…

인도 오늘에 대해 간단히 소개하자면...

인도 오늘은 리빙 미디아 인도 주식회사가 발행하는 매주 발행되는 인도의 영어 언어 뉴스 매거진입니다. 이 매거진은 인도에서 가장 널리 유통되는 매체로, 약 800만 명의 독자들이 있습니다.

상황을 다시 만들어 봅시다!!

<div class="content-ad"></div>

친구야, 인터넷에서 어떤 공중인물에 대한 기사를 읽으려고 검색하고 있었는데 갑자기 매거진에 가입하라는 팝업이 뜨면 누가 좋아하겠어요? (저는 더 미워해요 😅😂) 실수로 팝업을 닫는 대신에 눌러 버리는 바람에 뭔가 의심스러운 것을 느꼈고, 삽질을 시작했죠.

그런 식으로 취약점을 찾아내는 과정이 시작되었습니다 😈😈

이제 해킹을 시작합시다!!!!

사이트를 여니까 스크롤을 내리고 거기서 빠르게 나를 위한 계정을 만들었어요. 이제 웹사이트에서 제게 여러 종류의 매거진과 구독 요금제를 보여주고, 우르르 😞😞 이렇게 나타나죠. 그래서 웹사이트의 기능 같은 최소한의 것을 확인하고 사이트를 작게 탐색 👨‍💻👨‍💻 하고 있어요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_1.png)

그래서 나는 모든 일반적인 것들을 시도해봤어, 매개변조 및 인터넷과 체크리스트에서 비즈니스 로직 버그 등 모두😁. 전자 상거래 웹사이트이기 때문에 취약점을 악용할 수 있는 좋은 기회를 얻지 못했어 🥹🥹

웹사이트를 살펴보니 여러 결제 게이트웨이를 사용하며, 흥미로운 점은 웹사이트가 결제 게이트웨이로 Billdesk를 사용한다는 것을 알게 되었어. 그래서 내 모든 관심이 Billdesk에 집중되었어, 이를 우회해 본 적이 없었거든 😅😉😃

이제 몇 가지 무작위 구독을 장바구니에 추가하고 Paytm과 ICICI Bank와 Billdesk와 같은 모든 결제 옵션을 확인했어.


<div class="content-ad"></div>

기존의 다른 결제 게이트웨이 시도가 여러 번 실패한 후, 휴식을 취하고 Billdesk를 테스트하기 시작했어요 ⚡🙃

Billdesk를 결제 게이트웨이로 선택하고 주문을 확인했어요.

<img src="/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_2.png" />

주문을 확인한 후, 이제 사이트가 결제 게이트웨이 페이지로 리디렉션되었어요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_3.png)

이제 Burpsuite로 열었고 프록시를 설정했습니다... 게이트웨이를 해킹할 준비가 다 되었어요. 이 작업을 하기 전에 Billdesk 결제 게이트웨이 API 코드 및 응답을 참조해서 게이트웨이를 더 잘 이해하려고 했어요. 왜냐하면 말했듯이 나도 결제 게이트웨이에 대해 처음이라서요. 아래에서 결제 게이트웨이 API 응답 코드에 대한 초보자를 위한 간단한 정보를 제공합니다. 😁😁😁

결제 게이트웨이 API 응답 코드란 무엇인가요??

게이트웨이 응답 코드는 거래가 거부되었는지 승인되었는지를 식별하는 여러 자리 숫자 코드입니다. 이 코드들은 거래를 다시 시도해야 하는 경우 어떤 조치를 취해야 하는지 나타내줍니다.


<div class="content-ad"></div>

첨부된 문서를 참고하시면 Billdesk 결제 게이트웨이에 대한 아이디어를 얻을 수 있어요.

이제 Burp를 열고 프록시 탭으로 이동하여 인터셉트를 켜세요. 켜 놓은 후에는 취소 버튼을 눌러 트랜잭션을 취소하세요. 또한 필요한 데이터를 입력하고 트랜잭션을 중단하세요.

![이미지](/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_4.png)

이제 Burp에서 몇 가지 요청과 응답을 받았는데, 이 요청 덕분에 빠져버렸네요 😅😍

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_5.png" />

요청에서 msg가 거래 상태와 응답 코드를 표시한다는 것을 관찰했어요. 그래서 이 요청이 전송될 것이고, 나는 메시지 필드의 응답을 변경하기로 생각했어요.

아래와 같이,
“0300”은 성공을 의미하며, 성공적인 거래를 의미해요.
“0399”은 은행에서의 유효하지 않은 인증을 나타내며 거래 실패를 의미해요.

이제 나는 거래 상태 코드와 메시지를 변경하거나 조작하기로 했어요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_6.png)

응답 코드와 메시지를 변경한 후에 요청을 Burpsuite로 전달했습니다. 그 후에 이 응답을 받았어요. 이제 이 요청이 주문을 업데이트하기 위해 POST 방식을 사용하고 성공처럼 보이는 걸 알았어요 🥳🥳

![이미지](/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_7.png)

계속해서 요청과 응답을 전달하다가 이것을 보았어요 😉😉😁😁


<div class="content-ad"></div>

부아아아아아아암, 화면에 성공 메시지가 나와서 놀랐어요 🥳🎉🥳🎉

<img src="/assets/img/2024-05-27-HowIHackedIndiaTodaySubscriptionfor2years_8.png" />

이 글은 지식 전달 목적으로 공유되었으며 버그를 사용하려고 시도하지 마십시오.

또한 Mayur Parmar, Hemant Patidar, Tarun Tandon, Pavan Kumar Chinta에게 특별히 감사드립니다.

<div class="content-ad"></div>

위 글을 즐겁게 읽어주셨기를 바랍니다. 괜찮은 정보를 얻었으면 좋겠네요. 궁금한 점이나 도움이 필요하면 제 프로필을 방문해주시고 LinkedIn에서 연락 주세요.

또한, 저를 Medium에서 팔로우하실 수도 있습니다.

감사합니다. 그럼 안녕! 해킹을 즐기고 함께 해킹해요! 👨‍💻😈
