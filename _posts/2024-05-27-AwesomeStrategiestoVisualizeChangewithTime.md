---
title: "시간에 따른 변화를 시각화하는 멋진 전략들"
description: ""
coverImage: "/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_0.png"
date: 2024-05-27 12:44
ogImage:
  url: /assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_0.png
tag: Tech
originalTitle: "Awesome Strategies to Visualize Change with Time"
link: "https://medium.com/@yuanbo.faith/awesome-strategies-to-visualize-change-with-time-f8a7fa8362f2"
---

이 기사는 두 시점을 대조하는 효과적인 전략을 시각화하는 방법을 요약하고, 영감을 주는 그래픽 예시(소스 코드 링크 포함)로 설명합니다.

더 많은 흥미로운 데이터 시각화는 DataBrewer.co에서 찾아볼 수 있습니다. 이는 R 및 Python에서 데이터 분석과 데이터 시각화 기술을 공유하는 훌륭한 플랫폼입니다.

# 두 시간대 비교에 선분 사용하기

다음 그래프는 각 나라의 1800년과 2015년 인간의 수명 기대값, 인구 규모, 그리고 일인당 GDP를 비교합니다. 포인트는 다른 나라의 특정 시점을 나타내며, 선분은 각 나라에서 변화의 시각적 궤적을 제공합니다. 더불어 연한 회색 사각형의 사용은 두 시기 간의 차이를 강조하는 데 사용됩니다.

<div class="content-ad"></div>


![그래프](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_0.png)

이 그래프는 Lisa Charlotte Rost가 Datawrapper로 원래 만들었습니다. 이 작품을 R ggplot2로 재현한 것을 찾으려면 여기를 확인하세요.

# 방향별 변경 강조를 위해 화살표 사용하기

선분 외에도 화살표는 한 시점에서 다른 시점으로의 변화 방향을 강조하는 특징적인 요소입니다. 아래 그래프는 2000년부터 2020년까지 국회에서 여성들이 보유한 의석 변화를 보여주기 위해 이 전략을 사용하고 있습니다.


<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_1.png)

# 연속적인 변화를 나타내는 선 활용하기

선은 데이터 포인트의 연속적인 변화를 직관적으로 보여주는 지표입니다. 아래 그래프는 1880년대부터 2000년대까지 주요 서양 국가들에서 흡연 인기의 동향을 보여주며, 미국, 독일 및 프랑스의 변화를 선명한 색상으로 강조했습니다.

![이미지](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_2.png)


<div class="content-ad"></div>

각 나라에서 시간에 따라 변화 추적하는 것 이외에도, 평균 추세선과 변동성 리본을 추가하여 시각 정보를 풍부하게 할 수 있습니다. 다음 그림에서는 각 나라의 인간 기대수명 변화를 나타냅니다. 대륙별로, 중앙 두꺼운 선은 평균 수명을 보여주고, 음영 처리된 리본은 이 평균 추세 주변의 변동성을 나타냅니다. 여기에는 평균을 중심으로 평균을 중심으로 한 표준편차의 값이 있습니다.

![이미지](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_3.png)

# 각 시점에서의 총 값들을 나타내는 리본 사용하기

위의 선 그래프는 각 나라의 동적인 변화를 보여주었습니다. 각 시간별 y 값의 누적 합이 관심사일 때, 영역 그래프를 사용하여 이 목표를 달성할 수 있습니다. 영역 그래프는 기본적으로 쌓인 선 플롯이며, 선들 사이를 채운 색깔로 연속적인 밴드나 리본을 형성합니다.

<div class="content-ad"></div>

다음 그래프는 지난 200년 동안 전 세계에서 미국으로의 이민 인구 변동을 나타냅니다. 각 시간 지점마다 국가별 및 총 인구 수를 보여줍니다.

![Migration Population Dynamics](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_4.png)

위 그래프는 Mirko Lorenz가 Datawrapper를 사용하여 처음 만들었습니다. 이 작품을 R ggplot2를 이용하여 ggalluvial 패키지를 사용해 재현한 것을 여기에서 찾아볼 수 있습니다.

면적/알류비움 그래프의 변형인 스트림 플롯은 미적 강화를 더해줍니다. 다음 그래프는 지난 4개 십년 동안 영화 장르의 인기 변화를 보여줍니다. 멋진 R ggstream 패키지를 사용하여 만든 이 작품의 세부 사항은 David Sjoberg의 훌륭한 블로그 기사를 확인하세요.

<div class="content-ad"></div>


![Heatmap](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_5.png)

# 시간 변화를 시각화하는 멋진 전략

히트맵은 시간에 따른 변화를 보여주는 매력적인 도구로, 숫자 값을 색상 척도에 매핑합니다. 아래 그림은 백신 도입 전후 미국 주별 여덟 가지 감염병의 연간 발병 건수를 시각화한 것입니다. 백신이 병의 확산을 통제하는 능력을 인상적으로 보여줍니다.

![Yearly Incidences](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_6.png)


<div class="content-ad"></div>

표는 원래 Tynan DeBold와 Dov Friedman에 의해 WSJ에서 발표되었습니다. R ggplot2에서 이 작업의 재현을 보려면 여기를 확인하십시오.

색상이 변화의 전반적인 추세를 효과적으로 반영하지만 단순한 y-축과 비교했을 때 정확한 숫자 값에 대해 해석하기가 쉽지 않습니다. 히트맵에 축을 한 방향 또는 다른 방향으로 보강하는 것이 도움이 될 수 있습니다. 다음 히트맵은 지난 200년 동안의 월별 태양 흑점 활동을 보여줍니다. 히트맵 옆에 동기화된 선 플롯이 있어 y-축을 따라 태양 흑점 활동의 변화를 연속적으로 나타내어 흑점 활동 변동을 보다 직관적으로 해석할 수 있습니다.

![이미지](/assets/img/2024-05-27-AwesomeStrategiestoVisualizeChangewithTime_7.png)

# 애니메이션을 통한 변화 시각화

<div class="content-ad"></div>

2007년 한스 로슬링이 전설적인 TED 토크 '당신이 본 적 없는 최고의 통계'에서 데이터 애니메이션을 유명하게 만들었습니다. 그럼에도 오늘날에도 데이터를 애니메이션으로 렌더링하는 것은 많은 데이터 분석가들에게 끔찍한 작업으로 여겨집니다. 그러나 괜찮아요! 멋진 R gganimate 패키지를 사용하면 정적 플롯을 애니메이션으로 렌더링하는 것은 시간 변수를 기반으로 데이터 집합을 "faceting"하는 추가 단일 코드 라인을 추가하는 것만큼 간단할 수 있습니다.

다음의 애니메이션 인구 피라미드는 독일의 과거(어두운 색상)와 모의 데이터를 사용한 미래(밝은 색상)의 인구 구조를 보여줍니다. R ggplot2를 사용하여 이 애니메이션을 만드는 지침을 자세히 알고 싶다면 여기를 확인하세요.

위에 소개된 모든 그래픽은 R ggplot2에서 만들었습니다. 시각화 및 데이터 과학 분야에서 패러다임을 바꾸는 도구입니다. 만일 당신이 시스템적이고 재미있는 방법으로 ggplot2를 배우고 싶다면, 내 책으로 ggplot2에서 만들어진 코믹 스타일 ebook을 확인해 보는 것을 권유합니다. 나의 책에서 배운 내용을 놀랍도록 빠르게 당신만의 멋진 시각화로 변환하는 것을 경험할 수 있을 거예요!
