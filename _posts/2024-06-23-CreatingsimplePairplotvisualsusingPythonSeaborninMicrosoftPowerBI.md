---
title: "Microsoft Power BI에서 Python Seaborn으로 간단한 Pairplot 시각화하기 방법"
description: ""
coverImage: "/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_0.png"
date: 2024-06-23 16:04
ogImage: 
  url: /assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_0.png
tag: Tech
originalTitle: "Creating simple Pairplot visuals using Python Seaborn in Microsoft Power BI"
link: "https://medium.com/@sumanthsistlas/creating-simple-pairplot-visuals-using-python-seaborn-in-microsoft-power-bi-ab9384726e88"
---


시본(Seaborn): 시본은 파이썬에서 통계 플로팅에 사용되는 라이브러리입니다. 시본은 맷플롯립을 기반으로 구축되어 있으며, 통계 플롯을 보다 매력적으로 만드는 멋진 시각화에 널리 사용됩니다. 시본에 대해 더 알고 싶으신가요?

Power BI에서 파이썬 설정하기:

단계 01: Power BI Desktop을 엽니다. 파일 → 옵션 및 설정 → 옵션 → Python 스크립팅으로 이동합니다.

단계 02: Python 설치 여부를 확인하려면 'Python 설치 방법' 링크를 클릭하여 Python 설치를 안내하는 단계를 따르세요.

<div class="content-ad"></div>


![Python Power BI Step 1](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_0.png)

To connect to Python from Power BI:
1. Click on “Get Data” under “Data Sources”.
2. Select the “Python Script” connector.
3. Click OK.
4. A Popup window will appear, allowing you to write your Python Script.

![Python Power BI Step 2](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_1.png)

![Python Power BI Step 3](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_2.png)


<div class="content-ad"></div>

한 번 matplotlib과 seaborn 라이브러리를 가져온 후 Seaborn을 사용하여 데이터를 로드합니다. 데이터 세트의 이름은 "tips"이지만, 제가 "Data"로 이름을 변경했습니다. 로컬에 저장된 데이터 세트를 읽고 싶다면 pandas 라이브러리를 가져와서 pd.read_csv()를 사용하여 파일을 읽을 수 있습니다. Python 스크립트 작성이 완료되면 확인을 클릭해주세요. 데이터를 Power BI로 로드하세요.

![이미지](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_3.png)

시각화 캔버스에서 Python Visual을 선택해주세요.

![이미지](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_4.png)

<div class="content-ad"></div>

Python Visual을 클릭하면 Microsoft Power BI의 Python Script 편집기에 필요한 시각화를 만들 Python 스크립트를 작성해야 합니다.

![image](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_5.png)

아래 스크린샷은 Power BI 대시보드에 완벽하게 맞춘 Pairplot을 보여줍니다.

![image](/assets/img/2024-06-23-CreatingsimplePairplotvisualsusingPythonSeaborninMicrosoftPowerBI_6.png)

<div class="content-ad"></div>

이렇게 하면 Seaborn과 matplotlib을 사용하여 멋진 시각화를 쉽게 만들 수 있어요.

Power BI에 대한 더 많은 통찰력을 얻으려면 저를 팔로우해 주세요. 친구들과 공유하는 걸 잊지 마세요.

감사합니다,

수만트 시슬라