---
title: "IP-Adapter-FaceID-PlusV2-0 샷 페이스 전송  자동 설치 프로그램, 그라디오 앱  집적화된 컴퓨팅, 런팟, 캐글, 윈도우"
description: ""
coverImage: "/assets/img/2024-05-27-IP-Adapter-FaceID-PlusV20ShotFaceTransferAutoInstallerGradioAppMassedComputeRunPodKaggleWindows_0.png"
date: 2024-05-27 15:21
ogImage: 
  url: /assets/img/2024-05-27-IP-Adapter-FaceID-PlusV20ShotFaceTransferAutoInstallerGradioAppMassedComputeRunPodKaggleWindows_0.png
tag: Tech
originalTitle: "IP-Adapter-FaceID-PlusV2–0 Shot Face Transfer — Auto Installer , Gradio App — Massed Compute, RunPod, Kaggle, Windows"
link: "https://medium.com/@furkangozukara/ip-adapter-faceid-plusv2-0-shot-face-transfer-auto-installer-gradio-app-massed-compute-8b4e203e9408"
---


위의 ZIP 파일에는 Windows, RunPod, Massed Compute 및 무료 Kaggle 계정 노트북용 설치 프로그램이 포함되어 있습니다.

이것은 VENV를 생성하고 그 안에 모든 것을 설치합니다. Python 3.10.x와 함께 작동합니다 — 3.10.11을 권장합니다.

또한 C++ 도구와 Git이 필요합니다. 모두 설치하는 방법은 다음 동영상을 참고하시면 됩니다 : https://youtu.be/-NjNy7afOQ0

2024년 5월 27일 최신 정보 : https://www.patreon.com/posts/95759342

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-IP-Adapter-FaceID-PlusV20ShotFaceTransferAutoInstallerGradioAppMassedComputeRunPodKaggleWindows_0.png" />

2024년 1월 21일 업데이트
SDXL 모델이 ip-adapter-faceid-plusv2_sd15로 업그레이드되었습니다.
Kaggle 노트북도 V3로 업그레이드되어 이제 SDXL을 지원합니다.

우선 이 놀라운 모델을 제공해 주셔서 너무 감사드립니다.

저는 Gradio를 코딩하고 비디오를 준비하는 데 1주일 이상 소요했습니다. 이 스레드를 유지하고 Readme 파일에 추가해 주시기를 희망합니다.

<div class="content-ad"></div>

비디오가 게시된 후 얼굴 임베딩 캐싱 메커니즘도 추가했어요. 그래서 이제 이미지당 얼굴 임베딩 벡터를 한 번만 계산하므로 이미지 생성 속도가 엄청나게 빨라졌어요.

IP-어댑터-얼굴ID를 사용하여 즉각적으로 얼굴 전송: Windows용 전체 튜토리얼 및 GUI, RunPod 및 Kaggle

![이미지](/assets/img/2024-05-27-IP-Adapter-FaceID-PlusV20ShotFaceTransferAutoInstallerGradioAppMassedComputeRunPodKaggleWindows_1.png)

다음과 같은 장들이 있어요.

<div class="content-ad"></div>

'''
0:00 IP-Adapter-FaceID 풀 튜토리얼 소개
2:19 IP-Adapter-FaceID Gradio 웹 앱 사용 요구 사항
2:45 Windows에서 Hugging Face 모델이 기본적으로 다운로드되는 위치
3:12 Hugging Face 모델이 다운로드되고 캐시되는 폴더 경로 변경 방법
3:39 IP-Adapter-FaceID Gradio 웹 앱 설치 및 Windows에서 사용하는 방법
5:35 설치 후 IP-Adapter-FaceID 웹 UI 시작 방법
5:46 IP-Adapter-FaceID와 Stable Diffusion XL (SDXL) 모델 사용 방법
5:56 입력 얼굴 선택 및 0샷 얼굴 이동 이미지 생성 시작 방법
6:06 웹 UI의 각 옵션이 하는 일 설명
6:44 드롭다운 메뉴 모델 및 의미 설명
7:50 사용자 정의 및 로컬 모델을 사용하는 방법 및 사용자 정의 모델 경로 설정 방법
8:09 사용자 정의 모델 및 로컬 모델을 영구적으로 웹 UI 드롭다운 메뉴에 추가하는 방법
8:52 IP-Adapter-FaceID 웹 앱에서 CivitAI 모델 사용 방법
9:17 CKPT 또는 Safetensors 모델 파일을 확산기 형식으로 변환하는 방법
10:05 사용자 정의 모델 경로 입력에 내보낸 확산기 모델 사용하는 방법
10:24 생성된 이미지 다운로드 및 이미지 저장 위치
10:40 SDXL 모드 사용 방법
11:37 사용자 정의 로컬 모델을 영구적으로 웹 앱 모델 드롭다운 목록에 추가하는 방법
13:28 RunPod에 IP-Adapter-FaceID Gradio 웹 앱 설치 및 사용하는 방법
15:39 설치 후 RunPod에서 IP-Adapter-FaceID Gradio 웹 앱 시작하는 방법
16:02 RunPod 또는 Kaggle에서 사용 시 주의해야 할 사항
16:43 Pod 간에 영구적으로 저장하는 방법
17:17 RunPod에서 웹 앱 편집 및 UI에 모델 영구적으로 추가하는 방법
17:46 RunPod에서 시작된 웹 UI 인스턴스 종료하는 방법
18:08 RunPod에 fuser 명령어 설치하는 방법
19:01 RunPod에서 IP-Adapter-FaceID와 사용자 정의 CivitAI 모델 사용 방법
20:00 CivitAI에서 wget 방법이 실패할 경우 RunPod 또는 Kaggle에서 작동하는 방법
20:34 RunPod에서 파일을 올바르게 삭제하는 방법
20:58 RunPod에서 CKPT 또는 Safetensors 체크포인트를 확산기로 변환하는 방법
22:58 RunPod에서 SD 1.5 모델 변환 예시 표시
24:18 무료 Kaggle 노트북에서 IP-Adapter-FaceID Gradio 웹 앱 설치 및 사용하는 방법
26:10 Kaggle의 temp 디렉토리에 사용할 사용자 정의 모델 다운로드하는 방법
26:47 Kaggle에서 Gradio 앱을 사용하기 위해 토큰을 받고 활성화하는 방법
27:05 인증 토큰 설정 후 Kaggle에서 웹 UI 시작하는 방법
28:26 Kaggle에서 사용할 수 있도록 사용자 정의 CivitAI 또는 모델을 확산기로 변환하는 방법
29:23 1클릭으로 Kaggle 노트북에서 생성된 모든 이미지 다운로드하는 방법
30:12 Discord 채널 링크: https://discord.com/servers/software-engineering-courses-secourses-772774097734074388
'''
