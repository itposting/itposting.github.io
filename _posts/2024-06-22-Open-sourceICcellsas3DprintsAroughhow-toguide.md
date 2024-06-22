---
title: "오픈소스 IC 셀을 3D 프린터로 출력하는 방법 간단 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_0.png"
date: 2024-06-22 18:39
ogImage: 
  url: /assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_0.png
tag: Tech
originalTitle: "Open-source IC cells as 3D prints. A rough how-to guide."
link: "https://medium.com/@thorstenknoll/open-source-ic-cells-as-3d-prints-a-rough-how-to-guide-90a8bc8b3b57"
---


![이미지](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_0.png)

## 아이디어와 어떤 배경:

집적 회로(IC)와 오픈 소스가 한 문장에? 수십 년 동안 칩 디자인은 라이선스 수수료, 사용 요금, 비밀 유지 계약(NDA) 및 생산에 매우 높은 초기 재정적 장벽을 포함하는 폐쇄 도구의 영역이었습니다. 이것은 천천히 오픈 소스 도구 및 공유 생산 비용 방향으로 바뀌고 있지만, 여전히 오픈 소스 칩 디자인(오픈 소스 EDA)의 초기에 있습니다.

Google과 Skywater Technology가 발표한 오픈 소스 프로세스 디자인 키트(PDK) "SKY130" 이후로 모든 사람이 실제 마이크로칩을 생산하기 위한 "실제 표준 셀"들을 더 깊이 살펴볼 수 있게 되었습니다. 여러분은 어떠한 NDA를 위반하는 걱정없이 그들에 대해 이야기하고 쓸 수 있습니다. 우리는 심지어 이 셀들을 3D 프린터로 출력할 수도 있습니다. 그리고 저는 그렇게 했습니다.

<div class="content-ad"></div>

내가 인쇄한 3D 세포의 사진을 몇 개 트윗한 후 How-to 가이드를 작성하라는 요청을 받았어요. 이 안내서는 몇 단계로 나뉜 대략적인 계획으로, "혼자서 아주 쉽게 5분 안에 따라 할 수 있는" 가이드는 아니니까요. 이 점 주의하세요! 3D 프린터에 답답함을 느낄 수도 있고, 성공하기 위해 실리콘 칩의 구조에 대해 배워야 할 수도 있습니다.

그리고, 제가 한 것처럼 손가락을 실수로 초고리액으로 붙이지 말아 주세요.

모든 경고에도 불구하고: 즐기세요.

## 테스트 완료:

<div class="content-ad"></div>

- 노트북 우분투 22.04
- Ultimaker S5 + 자재 창고

# 1: SKY130 OpenPDK에서 셀 선택하기

SKY130 PDK 문서를 살펴보세요, 특히 7개의 SKY130 셀 라이브러리 개요를 살펴보고 라이브러리 중 하나를 선택하세요. 이 안내서에서는 고밀도 라이브러리 sky130_fd_sc_hd를 선택하겠습니다.

인쇄할 표준 셀을 결정하세요. 쉬운 셀부터 시작하는 것이 좋습니다. 예를 들어 인버터입니다. 간단한 CMOS 인버터 셀은 두 개의 트랜지스터를 포함하고 다음과 같이 보입니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_1.png)

PDKs Github Repository에서 선택한 셀의 .gds 파일을 다운로드하세요. 단일 인버터의 경우 sky130_fd_sc_hd__inv_1.gds 파일입니다:

# 2. GDS3D를 사용하여 셀의 .gds 파일 검토

셀의 .gds 파일을 조사 가능한 3D 렌더링으로 보려면 Viewer 소프트웨어가 필요합니다. trilomix의 GDS3D를 사용하는 것을 제안합니다:


<div class="content-ad"></div>

저장소를 다운로드하거나 복제하세요. /linux 폴더에는 미리 컴파일된 우분투 버전의 GDS3D가 있습니다. 실행 가능하게 만드세요:

```js
chmod +x linux/GDS3D
```

SKY130 셀과 함께 GDS3D를 실행하려면 프로세스 정의 파일이 필요합니다. 이를 위해 /techfiles 폴더 내의 sky130.txt 파일을 사용하세요. 이들을 결합하여 아래와 같은 콘솔 시작 명령어를 얻을 수 있습니다:

```js
./linux/GDS3D -p techfiles/sky130.txt -i <gds-파일_경로>
```

<div class="content-ad"></div>

GDS3D 창에서 인버터 셀을 3D 모델로 표시해야 합니다. 마우스로 이를 이동, 회전 및 확대할 수 있습니다. 이는 위의 3D 프린트 사진과 동일한 셀 (sky130_fd_sc_hd__inv_1.gds)입니다.

<img src="/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_2.png" />

이제 SKY130 오픈 소스 PDK에서 표준 셀을 고르고 GDS3D에서 볼 수 있는 방법을 알게 되었습니다. 혹시 이 가이드를 계속하기 전에 화면에서 몇 가지 더 많은 셀들 (AND 게이트, XOR, 더하기기, 멀티플렉서 등)을 둘러보고 싶을 수도 있습니다.

# 3. .gds를 .stl로 변환하기: gdsiistl

<div class="content-ad"></div>

3D 프린팅을 위해서 GDS 파일을 프린트 가능한 .stl 파일 세트로 변환해야 합니다. mbalestrini가 SKY130 PDK용으로 적용한 gdsiistl 버전이 있습니다:

저장소를 다운로드하거나 복제하여 README를 확인하여 gdsiistl 사용 방법을 참조하세요. 이는 Python으로 작성되어 있어 실행하기 어렵지 않을 것입니다. 저는 다음과 같이 진행했습니다 (python 3.10):

```js
pip install numpy
pip install gdspy
pip install numpy-stl
pip install triangle
python gdsiistl.py <path_to_gds_file>
```

gdsiistl을 실행한 결과는 프로세스 레이어의 일부를 이름에 접미사로 가진 .stl 파일 세트가 생성됩니다 ( _diff, _li1, _licon, _mcon, _met1, _nwell 및 _poly).

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_3.png" />

이 .stl 파일들은 이미 3D 프린트가 가능합니다. 하지만 프린트 버튼을 누르기 전에 세포의 3D 모델을 인쇄하고 조립하는 방법을 탐색해보고 싶을 것입니다.

# 4: .stl 파일 쌓아서 인쇄하기

여기서부터는 좋아하는 소프트웨어를 실행하여 .stl 파일을 보고, 편집하고, 슬라이스하고 인쇄해야 합니다. 저는 Tinkercad와 Cuda의 조합을 사용합니다. 하지만 이는 완전히 당신과 당신의 3D 프린터에 달렸습니다. 오픈 소스 솔루션을 선호할 수도 있습니다.

<div class="content-ad"></div>

여기는 방금 .stl 파일로 받은 레이어들과 실제 마이크로칩에 어떻게 "쌓이는지" 보여주는 다이어그램이 있습니다. 이 다이어그램의 출처는 SKY 130 PDK 문서입니다.

![다이어그램](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_4.png)

그리고 여기는 위의 다이어그램처럼 쌓인 .stl 파일들의 분해된 렌더링입니다:

![렌더링](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_5.png)

<div class="content-ad"></div>

선택을 해야 할 시점이 도래했습니다. 세포의 3D 모델에 대한 다음 단계는 실제 칩 생산 과정과 프린터의 출력 가능성 또는 제한 사항과의 정확성 등급에 달려 있습니다. 제가 그림과 함께 다음 문제를 설명하겠습니다.

## 라이콘 레이어:

.stl 렌더링의 라이콘 레이어를 GDS3D 렌더링과 비교하십시오. 그런 다음 내 모델에서 라이콘 레이어를 어떻게 출력했는지 살펴보십시오 (위의 사진 참조). 라이콘 레이어는 적어도 li1, poly 및 확산을 함께 연결합니다. 어떻게 출력할지 결정해야 합니다. 제 의견으로는 라이콘이 poly나 확산의 하단에서 나오지 않아야 하며(li1 레이어와만 연결), 두 레이어를 위쪽으로만 연결해야 합니다.

![이미지](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_6.png)

<div class="content-ad"></div>

## 부족한 기판층:

.stl 파일 세트에 기판층이 포함되어 있지 않습니다. GDS3D에서는 큰 검은 상자로 렌더링됩니다. 내 세포 모델에서는 AND-Gate의 최상단 사진처럼 큰 흰 판을 출력합니다.

![이미지](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_7.png)

## 확산을 nwell로 하위 기판에 포함하시겠습니까?

<div class="content-ad"></div>

세 낮은 층을 서로 쌓지 않고 내포된 구조로 만들었어요: 확산이 엔웰(nwell)로 스며들어 p-기판으로 들어가요.

![이미지](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_8.png)

내 모델에서는 확산을 엔웰로 내포시키고 그것을 기판 위에 쌓습니다.

![이미지](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_9.png)

<div class="content-ad"></div>

## 하나 또는 두 개의 프린트 헤드? 색상?

프린터에 따라 한 번의 인쇄량으로 두 개의 층을 함께 출력할 수 있습니다. 두 개의 헤드와 따라서 두 색상으로 인쇄할 경우 층을 다음과 같이 병합했습니다:

![image](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_10.png)

각 인쇄 작업에는 두 개 이상의 색상이 없으며 서포트 채움이 없습니다. 층을 인쇄한 후에는 슈퍼 접착제를 사용하여 단일 모델로 결합합니다.

<div class="content-ad"></div>

## 입력 및 출력 레이블:

다른 프린트 작업으로 인해, 입력 및 출력, 전원 및 접지 레일에 대한 레이블이 많이 만들어졌어요.

![이미지](/assets/img/2024-06-22-Open-sourceICcellsas3DprintsAroughhow-toguide_11.png)

# 5: 조립

<div class="content-ad"></div>

첫 번째: 손가락을 서로 붙이지 마세요!

두 번째: AND 셀 조립의 단계별 사진 몇 장

지금까지는 가이드가 이 만큼이에요. 즐겁게 만들고 인쇄된 셀로 행운을 빕니다. 만약 인쇄했다면 저에게 알려주세요 (트위터?!)!

# 이제는...

<div class="content-ad"></div>

- ...모델을 축척에 맞추어 출력하는 중입니다. 그리고 그 축척은 무엇인가요?
- ... `SKY130 PDK에 200개 더 레이어가 있습니다.
- ... 셀이 실리콘에서 실제로 어떻게 보이는지.
- ... 내가 잊거나 그냥 모르는 모든 것들 (많습니다!).

## 크레딧 (완벽하지는 않지만 시작):

매튜 벤(Matthew Venn)과 그의 환상적인 제로에서 ASIC으로 코스.

Hochschule RheinMain (Ultimaker S5)

<div class="content-ad"></div>

스테펜 라이테가 이런 미친 짓을 할 수 있도록 도와줘서 고마워요.