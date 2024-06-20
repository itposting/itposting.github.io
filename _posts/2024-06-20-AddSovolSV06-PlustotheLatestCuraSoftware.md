---
title: "최신 Cura 소프트웨어에 Sovol SV06-Plus 추가하기"
description: ""
coverImage: "/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_0.png"
date: 2024-06-20 16:42
ogImage: 
  url: /assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_0.png
tag: Tech
originalTitle: "Add Sovol SV06-Plus to the Latest Cura Software"
link: "https://medium.com/@drjonesy/add-sovol-sv06-plus-to-the-latest-cura-software-88f44dd4d415"
---


<img src="/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_0.png" />
요즘 소벌 SV06-Plus 3D 프린터를 4학년 학생들을 위한 교실에 구입했는데, 처음 몇 개의 인쇄물에서 문제가 발생했습니다. 몇 차례 시행착오 끝에, 문제는 Ultimaker Cura 슬라이싱 소프트웨어 구성과 관련되어 있음을 깨달았습니다.

소벌은 Cura 소프트웨어의 버전을 제공하지만 5개의 버전이 뒤떨어져 있고 윈도우 사용자만을 대상으로 합니다. 나머지들을 위해서는 스스로 해결해야 한다는 생각 같습니다. 다소 짜증이 나는 부분이지만, 몇 차례 시도와 나쁜 출력물 끝에, 최신 Ultimaker Cura 슬라이싱 소프트웨어에 SV06-Plus 프로필을 추가하는 방법을 Reddit의 게시물에서 찾아 성공적으로 진행하고 있습니다. 다른 사람들이 이 정보를 찾을 수 있도록, 원래 방법의 그래픽 버전을 작성했습니다. 기술에 능통하다면, 원본을 살펴보세요. 매우 쉽습니다.

# 튜토리얼 시작

<div class="content-ad"></div>

이 튜토리얼은 두 부분으로 나뉩니다. 먼저, 절대 초보자를 위해 설치 과정을 안내합니다. 이미 최신 버전의 Ultimaker Cura를 설치한 경우에는 'The Sovol SV06-Plus Profile 추가' 섹션으로 건너뛰세요.

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_1.png)

# 설치

## Cura Version 5 + Sovol SV06 Plus

<div class="content-ad"></div>

공식 웹사이트: [https://sovol3d.com/products/sovol-sv06-plus](https://sovol3d.com/products/sovol-sv06-plus)

![Sovol SV06 Plus](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_2.png)

## [테스트 완료] 다음 컴퓨터 시스템에서

- MacOs Ventura 13.3, Apple M2
- Windows 10
- Windows 11

<div class="content-ad"></div>

1 — https://ultimaker.com/에 방문해 보세요.

2 — 네비게이션에서 Software 위로 커서를 올려 UltiMaker Cura를 선택하세요.

![UltiMaker Cura](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_3.png)

3 — 이후에 Download For Free 버튼을 클릭하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_4.png" />

1. 4번 - 운영 체제를 선택하세요.

2. 5번 - .dmg 파일이 다운로드되기 시작해야 합니다. 파일 이름은 다음과 같을 것입니다: UltiMaker-Cura-#.#.#-mac.dmg. 여기서 #.#.#은 소프트웨어 버전 번호일 것입니다. 예: 5.3.1

3. 6번 - .dmg 파일을 두 번 클릭하여 설치하세요.

<div class="content-ad"></div>

7 - 창이 나타납니다. 약관에 동의하고 설치를 계속하세요.

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_5.png)

8 - 다음 창에서 Ultimaker Cura를 애플리케이션 폴더로 끌어다 놓으세요.

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_6.png)

<div class="content-ad"></div>

9. 컴퓨터 속도에 따라 진행 표시 막대를 볼 수 있을 수 있습니다.

![image](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_7.png)

10. 8단계의 설치 팝업 창을 닫습니다.

11. Ultimaker Cura 애플리케이션을 엽니다.

<div class="content-ad"></div>

12 — Cura를 열고 싶어하는지 물어보는 팝업이 나타날 수 있습니다. 이것은 인터넷에서 다운로드한 앱이라는 것을 알려줍니다. '열기'를 클릭하세요.

![image](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_8.png)

13 — Cura를 처음 열면 '시작하기' 버튼이 보일 것입니다.

14 — 클릭하고 동의하세요!

<div class="content-ad"></div>

15 - 다음을 클릭하세요.

16 - 마지막으로, Ultimaker는 [건너뛰기], [무료 Ultimaker 계정 생성], 또는 [로그인]을 원하는지 물을 것입니다. 이 튜토리얼에서는 일단 [건너뛰기]를 선택하겠습니다.

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_9.png)

17 - 다음으로, 프린터 추가를 요청합니다. 우리는 아직 SVO6 Plus를 위한 프로필 구성 파일을 가져오지 않았기 때문에, 임시 커스텀 프린터를 만들겠습니다.

<div class="content-ad"></div>

18 — 선택하세요: UltiMaker 프린터가 아닌 프린터

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_10.png)

19 — 이번에는 선택하세요: 네트워크에 연결되지 않은 프린터 추가

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_11.png)

<div class="content-ad"></div>

20 — 다음으로 UltiMaker가 선택된 브랜드 목록을 볼 수 있습니다. 다음 브랜드인 Custom으로 스크롤하여 선택하세요: Custom FFF

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_12.png)

21 — 우리가 SV06 Plus 프린터를 추가한 후에 이 프린터의 이름을 지정하지 마세요. 현재는 [다음]을 클릭하세요.

22 — 기계 설정에 대해 [다음]을 클릭하세요.

<div class="content-ad"></div>

23 — 새로운 내용을 보려면 건너뛰기를 클릭하세요

24 — 마지막으로, [완료]를 선택하세요

25 — 이제 Cura 애플리케이션 창이 표시됩니다. 아래 스크린샷과 비슷한 모습입니다.

![Cura 애플리케이션 창](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_13.png)

<div class="content-ad"></div>

# + Sovol SV06-Plus 프로필 추가하기

우선, 파일 및 원본 지시 사항을 제공해준 Reddit 사용자 vgergo에게 감사의 말씀을 전합니다. 원본 Reddit 게시물 — 그는 Cura 프로필을 더 잘 이해하기 위한 자세한 자습서를 작성했습니다.

1 — 다음 zip 폴더를 다운로드하세요: Sovol SV06 Plus Configuration Files.zip

2 — 이제 폴더를 추출/해제하십시오. 추출된 폴더에는 다음과 같은 폴더와 파일이 포함되어 있어야 합니다.

<div class="content-ad"></div>


```json
definition > SV06_Plus.def.json
extruders  > SV06_extruder_0.def.json 
images     > sovolbackplate.png 
meshes     > sovol_300_300_platform.obj
```

3. Cura가 실행 중이거나 열려 있는지 확인해 주세요.

4. 상단 네비게이션에서 '도움말'을 찾고 선택해주세요.

5. 드롭다운이 나타납니다. '설정 폴더 표시'를 선택해주세요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_14.png)

6 — 이제 Cura 구성 파일이 모두 저장된 디렉토리가 표시됩니다.

7 — 추출/압축 해제된 폴더를 Cura 구성 파일 옆으로 이동하세요.

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_15.png)


<div class="content-ad"></div>

8 - 이제 파일을 드래그 앤 드롭하거나 복사하여 붙여 넣으세요.

```js
' /definitions/' 로 'SV06_Plus.def.json' 파일을 복사
' /extruders/' 로 'SV06_extruder_0.def.json' 파일을 복사
```

<img src="/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_16.png" />

```js
# 이미지 및 메쉬 폴더는 복사할 때까지 존재하지 않습니다.

'/5.3/images'로 '/images'를 복사
'/5.3/meshes'로 '/meshes'를 복사
```

<div class="content-ad"></div>

9. Cura 애플리케이션을 닫고 다시 열어주세요.

10. 새로운 Sovol SV06 Plus 프린터를 추가해 봅시다. 두 가지 방법으로 진행할 수 있어요. [Custom] 버튼을 클릭하거나 상단 네비게이션에서 다음을 선택하세요:
설정 ` 프린터 ` 프린터 추가

![2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_17.png](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_17.png)

![2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_18.png](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_18.png)

<div class="content-ad"></div>

11— 이제 이전과 마찬가지로 선택하세요:

- 울티메이커 프린터가 아님
- 네트워크에 연결되지 않은 프린터를 추가하세요

12 — 이번에는 리스트가 나타나면 Sovol 브랜드가 나타날 때까지 아래로 스크롤하고 확장하세요. 이제 프린터 목록에 Sovol-SV06 Plus가 나타날 것입니다.

![이미지](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_19.png)

<div class="content-ad"></div>

13 - 그것을 선택하면 동일한 이름을 부여받습니다. 그런 다음 [추가]를 클릭하세요.

14 - 이제 Sovol SV06 Plus와 유사한 외관과 올바른 크기를 가진 사용자 정의 빌드 플랫폼이 표시됩니다. 아래 스크린샷을 참조하세요.

![스크린샷](/assets/img/2024-06-20-AddSovolSV06-PlustotheLatestCuraSoftware_20.png)

GitHub에서 확인하실 수 있습니다: https://github.com/drjonesy/CuraSovol3D#add_sv06_plus