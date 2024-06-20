---
title: "프로젝트 proxymity 파트 III - 로봇 제어 메커니즘"
description: ""
coverImage: "/assets/img/2024-06-19-projectproxymitypartIIIRobotControlmechanism_0.png"
date: 2024-06-19 02:31
ogImage: 
  url: /assets/img/2024-06-19-projectproxymitypartIIIRobotControlmechanism_0.png
tag: Tech
originalTitle: "project proxy.mity: part III — Robot Control mechanism"
link: "https://medium.com/@saharsh-sinha-career/project-proxy-mity-robot-control-mechanism-7691fa67a6cb"
---


로봇을 이동시키고 제어 신호를 해석하기

제어 신호 스트림을 기반으로 로봇을 이동시키기 위해 시도한 두 가지 방법이 있었습니다. 각각의 신호를 포함하는 개별 패킷들과 관련된 네트워크 속도 문제를 해소하는 것이 주요 과제였죠.

두 가지 방법 중 어떤 것이 더 나은지 알아봅시다. 아래 애니메이션의 구조를 간략히 살펴보면 미묘한 차이를 이해하는 데 도움이 될 것입니다.

![로봇 제어 메커니즘](/assets/img/2024-06-19-projectproxymitypartIIIRobotControlmechanism_0.png)

<div class="content-ad"></div>

**접근 방법 1 (구현하기 쉽지만 움직임이 떨리는 움직임을 일으킴)**

첫 번째 방법은 로봇을 빵갈루루에서 제어 신호를 받을 때마다 짧은 거리만 이동시키는 것이었습니다. 따라서 로봇이 연속적으로 "8"을 받아 "전진" 명령을 20번 수신하면 조금씩 20번 전진했습니다. 이는 네트워크를 통해 수신되는 신호가 균일하게 도착하지 않아 매우 불안정한 움직임을 유발했습니다. 이것은 약간의 전진 Arduino 코드로 완화되지 않을까 생각하지만 더 탐구해봐야 할 것 같습니다.

[2024-06-19-projectproxymitypartIIIRobotControlmechanism_1](/assets/img/2024-06-19-projectproxymitypartIIIRobotControlmechanism_1.png)

**접근 방법 2(조금 더 다루기 어려움이 있으나 더 부드러움이 필요함)**

<div class="content-ad"></div>

네트워크 속도와 대역폭의 예측할 수 없는 문제를 극복하기 위한 다른 방법은 로봇을 다른 신호를 받을 때까지 계속 이동시키거나 신호를 받지 않는 상태로 유지하는 것이었습니다.

![로봇 제어 메커니즘](/assets/img/2024-06-19-projectproxymitypartIIIRobotControlmechanism_2.png)

두 번째 방법이 더 나은 결과를 얻을 수 있었던 이유는 설정된 시간(예: 1초)동안 이동을 시작하고 다른 신호가 수신될 때까지 계속 이동하는 것이기 때문이었습니다. 신호를 받지 못했을 경우, 이동이 만료되고 로봇이 멈출 것이었습니다. 이 방법은 훨씬 부드럽고 더 유연한 사용자 경험을 제공했습니다.

주로 다음 코드를 사용하여 C# 레이어에서 대부분 구현되었습니다.

<div class="content-ad"></div>

아래는 Markdown 형식으로 변경한 내용입니다.


![Projects](/assets/img/2024-06-19-projectproxymitypartIIIRobotControlmechanism_3.png)

이 프로젝트에는 개선할 점이 많이 있습니다. 내 방식으로 조금씩 계속 개선해 나갈 예정입니다. 인도 휴가 동안에도 작업할 계획입니다.

Build and Introduction

Part I — AI Vision Control


<div class="content-ad"></div>

제 II 부 — 신호 전송

제 III 부 — 로봇 제어 메커니즘 (이 이야기)