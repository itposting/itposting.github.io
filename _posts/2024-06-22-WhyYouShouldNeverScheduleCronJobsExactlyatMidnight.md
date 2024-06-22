---
title: "자정에 크론 작업을 절대 예약하면 안 되는 이유"
description: ""
coverImage: "/assets/img/2024-06-22-WhyYouShouldNeverScheduleCronJobsExactlyatMidnight_0.png"
date: 2024-06-22 16:11
ogImage: 
  url: /assets/img/2024-06-22-WhyYouShouldNeverScheduleCronJobsExactlyatMidnight_0.png
tag: Tech
originalTitle: "Why You Should Never Schedule Cron Jobs Exactly at Midnight"
link: "https://medium.com/@akhaerov/why-you-should-never-schedule-cron-jobs-exactly-at-midnight-8f11650f79f8"
---


제 개발자로서, 제가 직접 체험한 바에 의하면 새벽 정각에(0 0 * * *) cron 작업을 예약하는 것이 일으킬 수 있는 혼란에 대해 알고 있습니다. 왜 그렇게 하는 것이 좋지 않은지, 그리고 보다 효과적으로 cron 작업을 예약하는 방법에 대한 팁을 소개하겠습니다.

![Why You Should Never Schedule Cron Jobs Exactly at Midnight](/assets/img/2024-06-22-WhyYouShouldNeverScheduleCronJobsExactlyatMidnight_0.png)

새벽의 신비

이전 직무 중 하나에서, 우리 팀은 심각한 시스템 업데이트를 밤 12시에 예약했을 때 수수께끼 같은 문제에 직면했습니다. 작업이 무작위로 실패하고 시스템이 크게 느려져 서비스 중단을 야기했습니다. 수없이 많은 디버깅 시간 끝에, 우리는 여러 작업이 밤 12시에 실행되도록 설정되어 있음을 발견했습니다. 동시에 발생한 부하로 리소스 충돌과 예측할 수 없는 동작이 발생하여 근본 원인을 식별하는 데 매우 어려워졌습니다.

<div class="content-ad"></div>

## 배운 교훈

## 크론 작업 예약을 위한 최상의 실천 방법

1. 일정 시간을 무작위로 설정: 작업을 동시에 설정하는 대신 무작위 시간을 사용하여 부하를 분산시킵니다. 이렇게 하면 사용량이 많은 시기를 피할 수 있고 충돌 가능성을 줄일 수 있습니다.

2. 지수 백오프 및 지터 사용: 지수 백오프와 지터를 사용하여 재시도를 구현하면 크론 작업이 능률적으로 수행될 수 있습니다. Marc Brooker의 AWS에서 제공하는 멋진 '지수 백오프와 지터' 아티클을 확인해보세요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-WhyYouShouldNeverScheduleCronJobsExactlyatMidnight_1.png)

3. 라이브러리 활용: 파이썬을 사용한다면, Tenacity 라이브러리를 사용하여 백오프와 지터 지연을 가진 재시도를 고려해보세요. 이는 프로세스를 간단화하고 크론 작업을 더욱 강화할 수 있습니다.

# 주기적인 작업을 더 견고하게 만들기

크론 작업은 작업을 자동화하는 데 좋지만 부적절한 예약은 큰 문제를 일으킬 수 있습니다. 자정 예약을 피하고 이러한 팁을 따른다면 더욱 신뢰성이 높고 효율적인 작업 실행을 보장할 수 있습니다. 기억하세요, 약간의 무작위성은 "0 0 * * *"의 함정을 피하는 데 큰 도움이 됩니다.
