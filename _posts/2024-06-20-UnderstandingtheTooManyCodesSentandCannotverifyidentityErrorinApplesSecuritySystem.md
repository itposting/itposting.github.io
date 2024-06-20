---
title: "애플의 보안 시스템에서 발생하는 코드가 너무 많이 전송됨 및 신원을 확인할 수 없음 오류 이해하기"
description: ""
coverImage: "/assets/img/2024-06-20-UnderstandingtheTooManyCodesSentandCannotverifyidentityErrorinApplesSecuritySystem_0.png"
date: 2024-06-20 14:30
ogImage: 
  url: /assets/img/2024-06-20-UnderstandingtheTooManyCodesSentandCannotverifyidentityErrorinApplesSecuritySystem_0.png
tag: Tech
originalTitle: "Understanding the “Too Many Codes Sent” and “Cannot verify identity” Error in Apple’s Security System"
link: "https://medium.com/@arthuqa/understanding-the-too-many-codes-sent-and-cannot-verify-identity-error-in-apples-security-c86d2ed33e4f"
---


![Understanding the Too Many Codes Sent and Cannot verify identity Error in Apple's Security System](/assets/img/2024-06-20-UnderstandingtheTooManyCodesSentandCannotverifyidentityErrorinApplesSecuritySystem_0.png)

애플은 사용자 보안 및 개인 정보 보호에 대한 헌신으로 인정받았으며, 사용자 계정이 보호되도록 다양한 메커니즘을 채택하고 있습니다. 이러한 보안 조치 중에서 이중 인증(2FA)은 특히 여행을 자주 다니거나 VPN을 사용하는 사용자들에게 중요한 역할을 합니다. 이 기사에서는 애플 제품 사용자들이 특정 상황에서 직면하는 "신원을 확인할 수 없습니다. 너무 많은 확인 코드가 보내졌습니다. 마지막으로 받은 코드를 입력하거나 나중에 다시 시도하십시오."라는 오류에 대해 다루며, 그 원인, 함의 및 해결책에 대해 집중적으로 살펴봅니다.

## 이중 인증의 역할

이중 인증은 사용자의 비밀번호와 사용자 이름 뿐만 아니라, SMS로 전송되는 확인 코드나 신뢰할 수 있는 장치에 표시되는 확인 코드와 같이 사용자만 액세스할 수 있는 것을 요구함으로써 추가적인 보안 계층을 추가합니다. 애플 사용자들에게는, 새로운 장치에서 애플 계정에 로그인하려고 할 때 사용자의 전화번호나 MacBook과 같은 자신의 Apple ID에 연결된 장치 중 하나로 전송되는 확인 코드를 의미합니다.

<div class="content-ad"></div>

## "너무 많은 코드 전송" 오류 설명

"너무 많은 코드 전송" 오류는 애플 시스템이 단기간 내에 인증 코드를 수십 차례 수신하려는 시도를 감지할 때 발생합니다. 이 보안 장치는 귀하의 계정에 무단 액세스 시도를 방지하기 위해 설계되었습니다. 그러나 이는 특정 조건 하에서 자신의 계정에 액세스하려는 합법적인 사용자들에게 심각한 장애물이 될 수 있습니다. 이러한 조건으로는 다음이 있습니다:

- 자주 여행하는 사람들: 자주 여러 나라를 오가는 사람들은 SIM 카드를 바꾸거나 다른 전화번호를 사용하므로 이 문제에 직면할 수 있습니다.
- VPN 사용자: VPN을 사용하면 IP 주소가 갑자기 한 장소에서 다른 장소로 이동하는 것처럼 보여 애플의 생태계 내에서 보안 경고를 일으킬 수 있습니다.

## 잠금 해제를 피하는 중요한 단계

<div class="content-ad"></div>

“신원을 확인할 수 없습니다. 너무 많은 확인 코드가 전송되었습니다. 마지막으로 받은 코드를 입력하거나 나중에 다시 시도하십시오.” 딜레마를 우회하려면 사용자들은 자신의 확인 코드를 다루는 데 주의 깊은 접근 방식을 채택해야 합니다:

- 마지막 코드 기억하거나 안전하게 보관하기: 마지막으로 받은 확인 코드를 기억하거나 안전한 기록으로 보관하는 것이 중요합니다. Apple의 보안 시스템은 특정 상황에서 새 코드를 보내는 대신 사용된 마지막 코드를 요구할 수 있습니다. 특히 시스템이 로그인 시도가 너무 많아 계정을 신호하는 경우 이 사실이 특히 중요합니다.
- 스크린샷 촬영하거나 코드 적기: 사소해 보일 수 있지만, 스크린샷을 찍거나 확인 코드를 메모하는 것은 새로운 코드를 받을 수 없을 때 특히 생명 구원자가 될 수 있습니다.
- Apple의 확인 논리 이해하기: 계정에 로그인을 시도하고 확인 코드를 입력하라는 프롬프트를 받은 경우, 신뢰할 수 있는 장치(예: 맥북)에 마지막으로 받은 코드를 입력하는 것이 중요합니다. 새로운 SMS 코드를 받을 수 없더라도 마지막으로 받은 코드를 입력해야 합니다.

## 오류 발생 시 대처 방법

“너무 많은 코드가 전송되었습니다.” 메시지가 표시되면, 즉시 신뢰할 수 있는 장치에 받은 마지막 확인 코드를 입력하는 것이 해결책입니다. 이 코드를 기억하거나 찾을 수 없는 경우, 잠시 기다렸다가 다시 시도해야 할 수도 있습니다. Apple은 일반적으로 추가 보안 잠금을 방지하기 위해 쿨다운 기간을 제안합니다.

<div class="content-ad"></div>

## 결론

애플의 엄격한 보안 조치인 "코드가 너무 많이 전송됨" 오류는 사용자 계정을 무단 접근으로부터 보호하기 위해 설계되었습니다. 이러한 조치는 때로는 합법적인 사용자에게 불편을 줄 수 있지만, 이러한 보안 프로토콜을 이해하고 준비하는 것은 잠재적인 접근 문제를 크게 완화시킬 수 있습니다. 마지막 인증 코드를 기록해 두고 애플의 보안 메커니즘을 인지하는 것은 여행이나 VPN 서비스를 사용할 때도 애플 계정에 끊김없이 액세스할 수 있도록 보장합니다.