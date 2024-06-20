---
title: "F-16, G-LOC, AUTO-GCAS 및 Python에 대해 알아보기"
description: ""
coverImage: "/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_0.png"
date: 2024-06-19 15:46
ogImage: 
  url: /assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_0.png
tag: Tech
originalTitle: "AN F-16, G-LOC, AUTO-GCAS AND THE PYTHON"
link: "https://medium.com/@smtrsln8/an-f-16-g-loc-auto-gcas-and-the-python-7f06d9297521"
---


유튜브에는 군용 항공 및 전투기를 밀접히 주시하는 많은 사람이 알아 볼 수 있는 분류되지 않은 HUD(Head-Up Display) 비디오가 있습니다. 이 비디오에서는 F-16 전투기에서 고속 기동을 수행하면서 학습 비행사가 G-LOC(G-induced Loss of Consciousness)를 경험하는 장면이 담겨 있습니다. 이 비디오에서 전투기가 17,000피트에서 4,500피트로 몇 초 사이에 하강하는 동안, 비행기의 통합 AUTO-GCAS(Automatic Ground Collision Avoidance System)가 제어를 인계하고 비행기와 비행사의 생명을 구하는 기동을 합니다. 이 비디오가 최근에 다시 제 유튜브 피드에 나타나자, 이 일 분짜리 장면을 Python을 사용하여 분석하고 시각화하는 아이디어가 생겼습니다. 이어지는 섹션에서는 제가 이를 어떻게 하였는지 설명하겠습니다. 그 전에, G-LOC와 AUTO-GCAS에 대해 조금 이야기해보겠습니다.

G-LOC란 무엇인가요?

전투기에서, G-LOC(G-induced Loss of Consciousness)는 조종사가 고 G-힘에 노출되어 의식을 잃는 상황을 나타냅니다. 이 상황은 비행 중에 발생하며, 특히 급한 기동, 갑작스러운 가속 또는 감속으로 인해 높은 가속을 경험할 때 발생합니다. G-LOC 중에는 혈액이 몸 전체로 제대로 분배되지 않아 뇌로의 혈류가 부족해지게 됩니다. 결과적으로, 뇌는 산소 부족으로 잠시 멈추게 되고 조종사는 의식을 잃습니다.

조종사들은 일반적으로 G-LOC를 상쇄하기 위해 특별히 디자인된 G-슈트를 입습니다. G-슈트는 슈트 일부인 밸브를 통해 비행기의 압력 시스템에 연결됩니다. 이 연결로 인해 공기 압력이 조종사의 다리와 배에 가해져 하체에 혈액이 모이는 것을 막고 이를 다시 머리쪽으로 상쇄시킵니다. 이 시점에서 G-슈트는 비행기의 G-힘 센서(G-센서)와 협조합니다. 비행기가 높은 G-힘을 겪으면 센서가 이 조건을 감지하여 슈트의 공기 블래더를 팽창시킵니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_0.png" />

그 반면에 우리가 언급한 의식 상실을 방지하기 위해 전투기 조종사들은 Anti-G Straining Maneuver (AGSM)를 보편적으로 수행합니다. 이 기동은 고 G-힘에 노출될 때 조종사들이 사용하는 특별한 호흡과 근육 긴장 기술입니다. 이 기술은 몸 속의 혈액을 적절하게 분배하여 뇌로의 충분한 혈류를 유지합니다. 간단히 말해, 이 특별한 기술을 통해 조종사는 폐량을 더 효율적으로 사용하여 산소 공급이 부족해지는 것을 방지하여 몸과 두뇌가 산소 공급을 받지 못하도록 합니다.

AUTO-GCAS (자동 지면 충돌 회피 시스템)란 무엇인가요?

AUTO-GCAS는 전투기 및 일부 다른 항공기에 사용되는 자동 지면 충돌 회피 시스템입니다. 이 시스템은 조종사의 실수나 의식 상실(G-LOC) 경우 항공기가 지면과 충돌하는 것을 방지하기 위해 설계되었습니다. 이 기사의 주제인 비디오에서 확인할 수 있듯이, AUTO-GCAS는 비행 안전성을 향상시켜 사고를 예방하는 데 중요한 역할을 합니다. 현재 F-16 항공기에서 활발히 사용되고 있으며, 향후 F-35에서도 사용될 예정입니다.

<div class="content-ad"></div>

AUTO-GCAS는 현대 항공에서 조종사들과 항공기의 안전을 보장하는 중요한 기술입니다. 이 시스템은 선진 알고리즘과 실시간 데이터 처리를 사용하여 항공기의 위치, 속도, 고도 및 방향 정보를 활용하여 지형 및 장애물 데이터를 분석합니다. 이 분석을 기밠으로, 시스템은 충돌 위험이 있는지를 판단하고, 처음에는 조종사에게 청각 및 시각적 경고로 알립니다. 조종사가 이러한 경고에 적시에 반응하지 않으면, 시스템이 자동으로 이를 맡아 필요한 기동을 수행합니다.

자, 이제 우리 기사의 주제인 동영상을 시청해볼까요:

동영상에서 볼 수 있듯이, 조종사는 고속 기동 중 약 8.5G의 힘을 경험하며 의식을 잃습니다. 17,000피트에서 급강하하는 F-16은 단 10초 만에 4,500피트로 내려가게 됩니다. 이 시점에서, 조종사가 의식을 잃어 수정 기동을 할 수 없을 때, AUTO-GCAS 시스템은 문제 발생을 감지하고 활성화되며 항공기를 12,000피트로 다시 올리는 9G의 조치를 취합니다.

Python / Matplotlib를 사용하여 고도 및 속도 변화 분석

<div class="content-ad"></div>

데이터셋을 준비하는 것부터 시작했어요. 동영상에서 G-포스, 속도, 고도 및 시간 정보를 Excel로 옮겨야 했는데, 매초 동영상을 일시 중지하여 데이터를 정확히 캡처하기 위해 " . " 및 " , " 키를 사용해 동영상 프레임을 앞뒤로 이동하는 데 도움이 많이 되었어요.

![이미지1](/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_1.png)

![이미지2](/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_2.png)

데이터 분석 및 시각화를 위해 Pandas DataFrame, Numpy 및 Matplotlib과 같은 Python 라이브러리를 사용했어요. 먼저, 이전에 만든 Excel 파일을 가져와 데이터프레임을 생성해볼게요.

<div class="content-ad"></div>

다음으로, 'TIME' 열을 "datetime" 형식으로 변환하겠습니다.

마지막으로, 데이터 유형이 올바른지 확인해보겠습니다.

<div class="content-ad"></div>


![그림](/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_5.png)

이제 Matplotlib을 사용하여 고도 손실이 어떻게 변하는지 확인해 봅시다. 그래프를 보면 F-16이 약 18,000피트에서 급속히 다이빙합니다. AUTO-GCAS 시스템은 17:26:23에 작동되어 4,500피트에서 비행기를 12,000피트 이상까지 다시 올립니다.

![그림](/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_6.png)

이어서, 탈고한 고도에 따라 다이빙 중 속도가 어떻게 변하는지 살펴봅시다:


<div class="content-ad"></div>

![Image 1](/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_7.png)

![Image 2](/assets/img/2024-06-19-ANF-16G-LOCAUTO-GCASANDTHEPYTHON_8.png)

현재 AUTO-GCAS 시스템은 F-16에서 활발히 사용되고 있습니다. 제공된 데이터에 따르면, 이 시스템은 CFIT(구동 비행대상지표면에 비행) 사건에서 항공기 손실의 26%와 모든 F-16 조종사의 75%를 예방했습니다. 본 시스템은 현재 F-35 전투기에서 수동적으로 사용되고 있으며(Manual GCAS), 2019년에 F-35용 AUTO-GCAS 시험을 시작했으며, 향후 활발하게 사용될 것입니다.

참고문헌: