---
title: "지도를 3D로 출력하는 방법 - 블렌더로 GIS 산책하기 - 완전한 해설"
description: ""
coverImage: "/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_0.png"
date: 2024-06-19 17:21
ogImage: 
  url: /assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_0.png
tag: Tech
originalTitle: "How to 3D Print Maps — GIS with Blender — A complete walkthrough."
link: "https://medium.com/stackademic/how-to-3d-print-maps-gis-with-blender-a-complete-walkthrough-c6414240ceb2"
---


# 저자

![이미지](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_0.png)

# 시작해 봅시다...

요즘 저는 블렌더(Blender)용 애드온을 시도해 보는 것에 열정을 느끼고 있어요. 이 애드온을 사용하면 지도를 쉽게 다운로드하고 3D로 출력할 수 있어요. 3D 프린팅 이외에도 발표 자료, 비디오 제작, VR 등 다양한 용도로 활용할 수 있어요.

<div class="content-ad"></div>

단계 1:

Blender 3.6 또는 4.02을 다운로드하세요.

단계 2:

https://github.com/domlysz/BlenderGIS.git을 다운로드하세요.

<div class="content-ad"></div>

Step 3:

`Preferences` Add-ons을 편집하세요.
* 전체 Zip 파일을 가져오고 푸지 마세요.
* 가져온 후에는 이미지에 있는대로 확인 표시를 클릭해야 합니다.

![이미지](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_1.png)

단계 4:

<div class="content-ad"></div>

Step 5:

![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_2.png)

Step 6:

<div class="content-ad"></div>

구글 지도가 열리면 원하는 곳으로 확대하고 선택을 마쳤을 때 'E'를 눌러주세요 🙂

![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_4.png)

7단계:

고도 데이터를 가져오기

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_5.png)

![Image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_6.png)

*Always remember to select the map indicated by the orange contour around the map area, as shown in the image below.*

![Image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_7.png)


<div class="content-ad"></div>

8단계:

고도를 변경하면서 강도를 조절해보세요

![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_8.png)

1과 2의 순서대로 수락하세요.

<div class="content-ad"></div>


Step 9:

좌측 상단 모드를 편집 모드로 변경한 후 맵을 우클릭하여 하위 분할을 선택하고 좌측 하단 메뉴에서 10개로 선택하세요.
* 변경을 수락하거나 적용할 필요가 없습니다. 변경 사항이 자동으로 적용됩니다.


<div class="content-ad"></div>

Step 10:

지금은 지도 아래에 볼륨을 만들고 z축으로 추출하여 인쇄할 수 있게끔 합니다. 그렇지 않으면 인쇄할 수 없습니다.

<div class="content-ad"></div>

현재 무언가를 클릭하기 전에 지금 하는 것을 멈추고 마우스나 키보드로 아무 것도 클릭하기 전에 아래 내용을 꼭 읽어 주세요.

![이미지](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_13.png)

익스트루더를 누른 후에 엣지만 선택된 상태에서 다음 순서대로 눌러 주세요:
S - Z - 0

<div class="content-ad"></div>

이 작업을 수행하면 아래쪽이 평평해집니다.

*이 조합을 잘못하면 CTRL-Z를 눌러 처음부터 다시 시작하세요.

![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_14.png)

작업을 마치면 마우스로 왼쪽 클릭한 후 가운데 버튼을 사용하여 맵을 회전시킵니다. 여전히 선택된 가장자리로 F (면)를 누르고 F3를 눌러 poke face를 검색합니다.

<div class="content-ad"></div>

이것이 최종 결과입니다.

![이미지](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_15.png)

단계 11:

다음을 삭제하세요

<div class="content-ad"></div>

아래는 Markdown 형식으로 표기된 문장입니다.


![이미지](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_16.png)

클릭 ` A `, 모든 지도를 선택합니다.

![이미지](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_17.png)

파일로 이동하여 `Export` > `STL`을 클릭하세요.


<div class="content-ad"></div>


![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_18.png)

Tick Selection Only and Scale it to 0.01

![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_19.png)

Click on Export STL


<div class="content-ad"></div>


![Step 12](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_20.png)

Open Bambu Studio

![Image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_21.png)


<div class="content-ad"></div>


![image](/assets/img/2024-06-19-Howto3DPrintMapsGISwithBlenderAcompletewalkthrough_22.png)

그게 다야, 비만항문 문제와 같은 몇 가지 주제들을 더 다룰 수 있겠지만, 그건 다른 안내서를 위한 자료야. 이 주제에 대한 더 많은 안내서가 필요하다면 Linkedin과 Medium에서 팔로우해주세요.

# Stackademic 🎓

끝까지 읽어 주셔서 감사합니다. 떠나시기 전에:


<div class="content-ad"></div>

- 작가에게 박수를 보내고 팔로우를 부탁드려요! 👏
- 팔로우하기: X | LinkedIn | YouTube | Discord
- 다른 플랫폼 방문하기: In Plain English | CoFeed | Venture | Cubed
- 더 많은 콘텐츠: Stackademic.com