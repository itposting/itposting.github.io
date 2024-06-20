---
title: "마이크로소프트 엑셀에서 대시보드 만들기  단계별 방법 제1부"
description: ""
coverImage: "/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_0.png"
date: 2024-06-19 15:53
ogImage: 
  url: /assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_0.png
tag: Tech
originalTitle: "Create Dashboard in Microsoft Excel — Step by Step Method (Part 1)"
link: "https://medium.com/@chandravi.kala/creating-dashboard-in-excel-step-by-step-method-10042150a8e4"
---



<img src="/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_0.png" />

아래에서 사용된 데이터 세트는 Tableau 커뮤니티에서 제공되는 Superstore 데이터 세트입니다.

Microsoft Excel에서 대시보드를 만드는 단계

- 새 엑셀 워크북 열기


<div class="content-ad"></div>

시트1을 대시보드로 변경해주세요.

시트2를 데이터로 변경해주세요.

![이미지](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_1.png)

· 데이터를 작업용 문서의 데이터 시트에 복사해주세요.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_2.png)

Select the data and click insert Pivot Table

1. Click the option - From table/Range

2. Leave the table range as is and click new worksheet. A new sheet will be created, and rename it as Analyze


<div class="content-ad"></div>


![Step3](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_3.png)

![Step4](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_4.png)

3. 오른쪽에는 피벗 테이블 필드가 나타날 것입니다. 필터, 열, 행, 값으로 구성된 네 가지 섹션이 있을 것입니다. 매출을 값으로 드래그하여 매출의 합계(집계)로 표시하고, 하위 범주를 행으로 이동시킵니다. 새로운 피벗 테이블 데이터가 생성됩니다.

![Step5](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_5.png)


<div class="content-ad"></div>

4. 대시보드 시트에 표시해야 하는 3가지 KPI입니다. 이제, 피벗 테이블 데이터를 새 셀에 복사하여 붙여넣으세요.

5. 모든 섹션에서 필드를 제거하고 하위 범주를 행 섹션에 추가하고 매출을 값을 섹션에 추가하세요.

![이미지1](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_6.png)

![이미지2](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_7.png)

<div class="content-ad"></div>

· 피벗 테이블(하위 카테고리/판매)을 선택하고 삽입을 클릭한 후, 권장 차트를 선택하여 막대 차트를 클릭하세요.

· 하위 카테고리별 판매 차트가 생성됩니다.

![판매 부문 차트](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_8.png)

차트 형식을 조정하세요.

<div class="content-ad"></div>


![Dashboard](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_9.png)

- Edit the title and right-click on the bar to sort it.
- Hide all remaining buttons.
- Remove the gridlines.


<div class="content-ad"></div>

· 다시 데이터 분석 시트로 이동하여 피벗 테이블을 복사하고 새 셀에 붙여넣기 해주세요.

이제 오른쪽에 다른 피벗 테이블 필드가 나타날 것입니다. 모든 섹션에서 필드를 제거하고 지역을 행 섹션으로, 매출을 값 섹션으로 추가해주세요.

· 이 피벗 테이블을 선택한 후 삽입을 클릭하고 권장 차트를 선택하여 파이 차트를 클릭해주세요.

· 차트를 서식을 지정해주세요.

<div class="content-ad"></div>

이미지 태그를 아래와 같이 변경해 주세요:

![Create Dashboard in Microsoft Excel Step by Step Method Part 1](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_10.png)

<div class="content-ad"></div>

동일한 단계를 따라서 또 다른 차트를 생성해 보세요. 월간 판매를 나타내는 선 그래프를 만들어 보겠습니다.

행 부분에 월(주문 날짜)을 추가해 주세요.

· 차트 서식 설정

o 제목 편집

<div class="content-ad"></div>

모든 버튼을 숨기세요

그리드 라인을 제거하세요

![이미지](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_11.png)

워크북의 대시보드 시트 서식 설정

<div class="content-ad"></div>

먼저 대시보드의 구조를 그려 봅시다.

- 모양에서 텍스트 상자를 삽입하고 선택한 후, 제목을 작성하고 상자를 채우고 가운데 정렬하세요.

![이미지](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_12.png)

마찬가지로 KPI 지표와 차트를 위한 자리 표시자를 만들어보세요.

<div class="content-ad"></div>

- KPI 값 추가하기. "총 매출" 상자를 클릭한 후, "총 매출" 텍스트 끝에서 엔터 키를 누르세요. 이제 커서가 아래 셀에 위치해 있습니다. 새 텍스트 상자를 추가한 후, 아래 공식을 사용하여 매출 금액을 입력하세요. 그리고 해당 KPI 상자 형식으로 텍스트 상자를 서식 지정해 주세요.

`=Analyze!A4`

![이미지](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_13.png)

- 차트를 각각의 자리에 추가하고 서식을 설정하세요.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-CreateDashboardinMicrosoftExcelStepbyStepMethodPart1_14.png)

참고 :
[마이크로소프트 공식 문서](https://support.microsoft.com/en-us/office/create-and-share-a-dashboard-with-excel-and-microsoft-groups-ad92a34d-38d0-4fdd-b8b1-58379aae746e#ID0EBBJ=Create_a_dashboard)