---
title: "오픈SCAD에서 3D 프린팅을 위한 다중 엑스트루더 디자인 생성하기"
description: ""
coverImage: "/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_0.png"
date: 2024-06-19 02:14
ogImage: 
  url: /assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_0.png
tag: Tech
originalTitle: "Creating Multi-Extruder Designs in OpenSCAD for 3D Printing"
link: "https://medium.com/@nextjeff/creating-multi-extruder-designs-in-openscad-for-3d-printing-6c43a002ef64"
---


작년부터 OpenSCAD를 사용하여 흥미로운 기하학적 패턴을 디자인하고 Prusa MK4 프린터를 사용하여 직물에 출력해 왔어요.

최근에 더 크고 더 강력한 Prusa XL이 도착했기 때문에, 여러 색상과 재료로 디자인하고 출력하는 방법을 찾고 싶었어요. 몇 가지 실험 끝에 저는 기존 작업 방식과 잘 어울리며 깔끔하고 간단한 방법을 개발했어요. 여기 제 첫 번째 출력물 중 하나가 있어요:

![다중 분사 디자인 만들기](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_0.png)

이 작업은 거의 수동으로 하지 않았어요 — 5개의 STL 파일을 OpenSCAD에서 생성하여 PrusaSlicer에 모두 불러오고, 슬라이스 처리를 한 다음 프린팅을 시작했어요.

<div class="content-ad"></div>

본문에서 배경 정보를 소개하고 첫 번째 실패한 경험을 공유하며 마지막 기술을 소개하고 추가 개발 아이디어를 제시하고 싶습니다. 여러분의 피드백을 받아보고 이 기술을 더 나아가는 방법이 있는지 확인하고 싶습니다.

# PrusaSlicer 다중 소재 페인팅

PrusaSlicer에는 모델을 가져와 다중 색상 또는 다중 소재 프린팅을 위해 페인팅할 수 있는 매우 훌륭한 기능이 있습니다:

![이미지](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_1.png)

<div class="content-ad"></div>

The painting tool works well, but it didn't quite meet my needs:

- Painting manually for a model with numerous objects to color would be very time-consuming and difficult to replicate if any changes were made to the model.
- The tool not only changes surface colors but also tries hard to penetrate the interior with colors. While this can be useful, it may result in unnecessary color changes that are not visible in the final print, slowing down the printing process.
- The tool can paint on a triangle-by-triangle basis, aligning with how 3D objects are represented in STL files and PrusaSlicer. However, the mapping from the original 3D object to triangles, though geometrically correct, can sometimes make it challenging to color specific areas precisely.

![Image](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_2.png)

Please know that I don't intend this feedback as criticism of PrusaSlicer—the painting tool is impressive and robust. We are facing a situation where popular file formats and tools have somewhat restricted us. STL files lack color information, while other less-known formats do include it, but unfortunately, I lack the tools to work with them.

<div class="content-ad"></div>

조금 더 추상적인 수준에서, 전체적인 OpenSCAD 객체 - 큐브, 구, 원기둥 등과 같은 것들 -을 영역이나 삼각형이 아닌 부분을 색칠할 수 있어야 한다는 것이 분명해졌습니다.

# 첫 번째 접근 방법

이 모든 것을 고려한 후, 슬라이싱 시간이 아닌 설계 시간에 문제를 해결하기로 결정했습니다. OpenSCAD의 color 함수는 설계 시간에 작동하지만, STL 파일은 색상 정보를 전달하지 않기 때문에 미리보기로만 유용합니다:

![](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_3.png)

<div class="content-ad"></div>

PrusaSlicer에 여러 개의 STL 파일을 쉽게 가져올 수 있어요. 처음에는 OpenSCAD를 수정하여 특정 색상의 객체만 선택적으로 렌더링하고, 각 색상에 대해 하나의 STL 파일을 생성하도록 반복하기로 생각했어요. 실제로 OpenSCAD 소스를 깊이 파헤쳐서 이 작업을 어떻게 수행할 수 있는지 알아내려고 시간을 보냈어요.

# 유레카의 순간

OpenSCAD 서브레딧의 관련 없는 게시물을 읽는 도중 children 함수에 대해 알게 되었어요. 사용자 정의 OpenSCAD 모듈 내에서 사용할 경우, 해당 모듈이 모듈 내 다른 객체에 대해 작동하거나 (또는 작동하지 않도록) 할 수 있게 해줘요. 예를 들어, MakeItBlue 모듈을 정의할 수 있고, 이 모듈은 색상을 사용하여 정육면체의 색상을 설정할 수 있어요:

![이미지](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_4.png)

<div class="content-ad"></div>

방금 언급한 "또는 실행하지 않을"-부분이 핵심인 것 같아요. OpenSCAD 커스터마이저 내에서 설정할 수 있는 값을 기반으로 자식 객체를 렌더링할지 결정하는 보다 복잡한 모듈을 만들었어요:

![이미지](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_5.png)

개발 중에 DoColor를 "all"로 설정한 후 "red", "green", "blue"로 설정하여 렌더링(F6) 및 저장(F7)을 할 때마다 반복했어요. 결과로 세 개의 STL 파일이 나왔어요. 세 파일을 PrusaSlicer에 모두 한 번에 가져와서 답변을 "예"로 했어요:

![이미지](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_6.png)

<div class="content-ad"></div>

그럼 작업을 완료하고 준비를 마쳤어요:

![image](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_7.png)

이 순간에 유크레아가 찾아왔어요. OpenSCAD에서 슬라이스 작업이 끝나고, 슬라이서에서 각 큐브의 색상을 수동으로 설정할 필요 없이 준비가 된 모습이었죠.

# 프로토타입부터 본격 생산화

<div class="content-ad"></div>

조금 시간을 들여 접근 방식을 다듬었고, 테스트로 랜덤한 높이의 랜덤 사각형 그리드를 만들기로 결정했습니다. 이 과정에서 색상 대신 첨가물을 참조하도록 일반화함으로써, 다중 재료 프린트로 전환해도 여전히 의미가 통할 수 있도록 했습니다.

tile.scad에서 코드를 찾을 수 있으며 다운로드하여 즐기실 수 있습니다. 주요 부분을 검토해 봅시다. 첫 번째 단계는 어떤 첨가물을 렌더링할지 지정하는 것입니다. 이 값을 커스터마이저에 표시하려면 파일의 모듈 정의보다 이 문이 앞에 와야 합니다:

```js
// 렌더할 첨가물
_WhichExtruder = "All"; // ["All", 1, 2, 3, 4, 5]
```

다음으로, 첨가물의 값을 OpenSCAD 내에서 렌더링에 사용할 색상으로 매핑합니다. 실제 프린트와는 무관하며, 개발 중에 서로를 구별하기 위한 것입니다:

<div class="content-ad"></div>

```js
// _WhichExtruder의 값을 OpenSCAD 색상으로 매핑하는 함수
함수 ExtruderColor(Extruder) =
  (Extruder == 1  ) ? "red"    :
  (Extruder == 2  ) ? "green"  :
  (Extruder == 3  ) ? "blue"   :
  (Extruder == 4  ) ? "pink"   :
  (Extruder == 5  ) ? "yellow" :
                      "purple" ;
```

그런 다음 Extruder 모듈은 _WhichExtruder의 값에 따라 자식 노드를 렌더링하거나 렌더링하지 않습니다:

```js
// _WhichExtruder가 "All"인 경우 또는 "All"이 아니고 요청된 엑스트루더와 일치하는 경우 자식 노드 렌더링

모듈 Extruder(DoExtruder)
{
   색상(ExtruderColor(DoExtruder))
   {
     if (_WhichExtruder == "All" || DoExtruder == _WhichExtruder)
     {
       children();
     }
   }
}
```

실제 그리기 코드는 Extruder 모듈을 사용하여 원하는 엑스트루더를 설정합니다:


<div class="content-ad"></div>

```js
Extruder(Ex)
{
   cube([_SquareWidth, _SquareDepth, Hi], center=false);
}
```

그게 다에요!

할 일은 _WhichExtruder를 다섯 가지 값 중 하나로 설정하고 렌더링하고 저장하는 것 뿐이에요. 이 과정은 일괄 처리나 스크립트 파일을 사용하여 더 자동화할 수 있어요. 아래는 저의 매우 간단한 스크립트 파일이에요:

```js
@ECHO OFF 
REM 주어진 OpenSCAD 파일의 5개의 레이어 모두 렌더링합니다.
REM 파일 이름에 .scad 확장자가 있거나 없을 수 있습니다.

set BASE=%~n1% 
set OSC="C:\Program Files\OpenSCAD\openscad.exe"

echo %OSC% 
echo %BASE% 

REM 5번 반복
%OSC% -D "_WhichExtruder=1" %BASE%.scad -o %BASE%_1.stl
%OSC% -D "_WhichExtruder=2" %BASE%.scad -o %BASE%_2.stl
%OSC% -D "_WhichExtruder=3" %BASE%.scad -o %BASE%_3.stl
%OSC% -D "_WhichExtruder=4" %BASE%.scad -o %BASE%_4.stl
%OSC% -D "_WhichExtruder=5" %BASE%.scad -o %BASE%_5.stl
```

<div class="content-ad"></div>

아래는 다섯 가지 STL 파일이 어떻게 조합되는지에 대한 설명이 있습니다:

![STLs](https://miro.medium.com/v2/resize:fit:1400/1*O6wHDBWO6m3bdy54NMMYNQ.gif)

다시 한 번 강조하자면, 다섯 개의 STL 파일을 PrusaSlicer에 동시에 로드한 다음 조각내어 출력합니다. 이 기술을 활용하여 제작한 몇 가지 다른 작품을 아래 이미지를 통해 확인할 수 있습니다:

![STLs](/assets/img/2024-06-19-CreatingMulti-ExtruderDesignsinOpenSCADfor3DPrinting_8.png)

<div class="content-ad"></div>

# 중요한 안전 팁

하나 아주 중요한 팁이 있어요. OpenSCAD의 의사 난수 발생기 함수 (rands)는 코드가 실행될 때마다 고유한 시드 값을 사용하기 시작합니다. 시드 값을 제공하지 않는 한, 기본 방식으로 사용하면 패턴이 반복되지 않고 실제로 함께 맞지 않을 수도 있습니다. 해결책은 시드 값을 사용하고 모든 필요한 수를 한 번에 생성하는 것입니다. 이를 수행하는 방법은 내 코드를 살펴보면 확인할 수 있어요.

# 더 나아가기

이게 현재 나의 위치입니다. 아직 탐험 중이며, 이 기술을 극한까지 발전시키는 것을 기대하고 있어요.

<div class="content-ad"></div>

어떻게 생각하시는지 알려주세요! 그리고 만들어 보신 것을 보여주세요!