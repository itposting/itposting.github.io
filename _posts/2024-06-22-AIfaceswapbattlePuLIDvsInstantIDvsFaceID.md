---
title: "AI 얼굴 스왑 배틀 PuLID vs InstantID vs FaceID"
description: ""
coverImage: "/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_0.png"
date: 2024-06-22 21:45
ogImage: 
  url: /assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_0.png
tag: Tech
originalTitle: "AI face swap battle: PuLID vs InstantID vs FaceID"
link: "https://medium.com/design-bootcamp/ai-face-swap-battle-pulid-vs-instantid-vs-faceid-2f08db230509"
---


오늘은 ComfyUI 워크플로우를 사용하여 PuLID, InstantID 및 IP-Adapter의 FaceID-V2와 같은 세 가지 AI 얼굴 교체 기술을 비교해보려고 해요. 이러한 기술은 얼굴 인식, 얼굴 감지 및 얼굴 정렬을 위해 설계된 깊은 얼굴 분석 라이브러리 인 InsightFace를 기반으로 합니다. InsightFace는 상업적 라이센스가 필요하다는 점을 유의해 주세요.

IP-Adapter FaceID는 이러한 기술 중에서 처음에 소개되었고, 그 뒤를 이어 InstantID가 나왔으며, 가장 최근에 PuLID가 나왔어요.

각각의 프로그램은 얼굴 참조 이미지가 필요하기 때문에 교체된 얼굴의 효과는 제공하는 참조 이미지의 품질과 적합성에 크게 의존합니다.

<div class="content-ad"></div>

다음 세 가지 얼굴 교체 방법의 결과를 ComfyUI 워크플로우를 사용하여 비교할 것입니다. 여기서 다운로드할 수 있어요.

먼저, 이 워크플로우의 사용 방법을 보여드리겠습니다. 그런 다음, 효과를 평가하기 위해 4 세트의 이미지를 생성하고 평가할 것입니다.

![이미지](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_1.png)

비디오 콘텐츠와 함께 Stable Diffusion에 더 자세히 파고들고 싶은 분들을 위해 이 글에 부가된 매력적인 비디오 튜토리얼을 확인하실 수 있어요.

<div class="content-ad"></div>

# ComfyUI Workflow 설정하기

1️⃣ 노드 다운로드 및 불러오기:

- 필요한 모든 노드가 있는지 확인해주세요. 누락된 노드는 ComfyUI 관리자를 통해 설치한 후 ComfyUI를 재시작하면 됩니다.
- 노드를 설치하기 전에 ComfyUI를 업그레이드하여 누락된 노드로 인한 문제를 피해주세요.

![이미지](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_2.png)

<div class="content-ad"></div>

# 2️⃣ 필요한 모델 설치하기:

모델의 다운로드 주소와 저장 경로는 각 노드의 GitHub 홈페이지에 자세히 나와 있습니다.

- PuLID: [GitHub 링크](GitHub Link)
- InstantID: [GitHub 링크](GitHub Link)
- IP-Adapter: [GitHub 링크](GitHub Link)

예를 들어 PuLID의 경우, 미리 학습된 모델을 다운로드하여 ComfyUI/models/pulid/ 폴더에 위치시킵니다. 첫 실행 시 추가 모델을 자동으로 다운로드합니다.

<div class="content-ad"></div>

# Workflow Structure

1️⃣ Shared Nodes:

At the bottom, these nodes are common to PuLID, InstantID, and FaceID. They use identical dimensions for checkpoint, prompt, latent image, and fixed seed, facilitating easy comparison.

![Image](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_3.png)

<div class="content-ad"></div>

2️⃣ 모델 노드 그룹:

더 위에, 세 개의 노드 그룹이 있습니다. 왼쪽부터 오른쪽으로: PuLID, InstantID, 그리고 IP-Adapter-FaceID입니다. 저자들은 이를 직관적으로 조직했습니다.

![이미지](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_4.png)

3️⃣ 참조 이미지 노드:

<div class="content-ad"></div>

위에 있는 "Face" 노드("Load Image" 노드)는 세 기술 모두에 사용되는 참조 사진을 로드합니다.

![이미지](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_5.png)

# Workflow 실행 및 결과 비교

## 진행 방법

<div class="content-ad"></div>

- 모든 노드 및 모델이 올바르게 설치되고 구성되었는지 확인하십시오.
- 워크플로를 가져오고 노드 연결 및 구성을 확인하십시오.
- 참조 이미지를 로드하여 이미지 경로와 형식을 확인하십시오.
- 워크플로를 실행하여 세 가지 기술을 위한 효과 이미지를 생성하십시오.
- PuLID, InstantID 및 IP-Adapter FaceID의 차이, 장단점을 평가하기 위해 생성된 이미지를 비교하십시오.

## 평가 기준

다음 차원에 따라 네 개의 이미지 세트를 생성하고 다음과 같이 점수를 매기세요 (각각 1-3점):

- 빠른 적합성: 이미지가 프롬프트 설명과 얼마나 잘 일치하는지.
- 얼굴 밝기: 얼굴의 빛과 그림자의 자연스러움.
- 얼굴 유사성: 생성된 이미지와 참조 이미지 사이의 닮은 정도.
- 얼굴 세부 사항: 얼굴의 질감과 세부 풍부함.

<div class="content-ad"></div>

## 비교 분석

💠 첫 번째 이미지 세트

![First set of pictures](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_6.png)

💠 두 번째 이미지 세트

<div class="content-ad"></div>


![Image 1](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_7.png)

💠Third set of pictures

![Image 2](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_8.png)

💠Fourth set of pictures


<div class="content-ad"></div>


![image](/assets/img/2024-06-22-AIfaceswapbattlePuLIDvsInstantIDvsFaceID_9.png)

Finally, let’s calculate the total score:

From my observations:

- InstantID scores the highest overall, followed closely by FaceID.
- PuLID lags behind the other two.


<div class="content-ad"></div>

InstantID는 최고의 결과를 제공하지만, 가장 많은 자원을 사용합니다. 최종적으로 최선의 선택은 귀하의 특정한 요구 사항에 달렸습니다.

귀하는 직접 테스트를 수행하고 결과를 댓글 섹션에서 공유하는 것을 장려합니다.

💡 더 깊은 탐구를 원하십니까? 제 스테이블 디퓨전 컬렉션이 기다리고 있습니다.

## 기사가 마음에 드셨나요?

<div class="content-ad"></div>

그렇다면:

- 댓글 남기기
- 업데이트 팔로우하기
- 무료 이메일 알림