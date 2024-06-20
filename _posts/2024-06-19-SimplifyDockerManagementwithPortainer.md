---
title: "Portainer로 Docker 관리를 간단히 하기"
description: ""
coverImage: "/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_0.png"
date: 2024-06-19 00:45
ogImage: 
  url: /assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_0.png
tag: Tech
originalTitle: "Simplify Docker Management with Portainer."
link: "https://medium.com/@sagarkpanda/simplify-docker-management-with-portainer-f6783fa56fed"
---


## 도커용 포트에이너 설정. 이미지와 컨테이너 관리를 위한 GUI 사용.

![Portainer](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_0.png)

## 포트에이너란:

포트에이너는 도커 환경을 관리하는 데 도움이 되는 유틸리티입니다. GUI를 통해 모든 도커 작업을 간편하게 관리할 수 있습니다.

<div class="content-ad"></div>

## 준비 사항:

도커

## 도커에서 Portainer 실행하기:

먼저 Portainer를 위한 볼륨을 생성하세요.

<div class="content-ad"></div>

```js
도커 볼륨을 생성하려면 다음 명령어를 실행하세요.

docker volume create portainer_volume

위 볼륨을 마운트하여 포테이너 도커 이미지를 실행하세요.

docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

→ -v /var/run/docker.sock:/var/run/docker.sock
```

<div class="content-ad"></div>

- Portainer 컨테이너는 호스트에서 실행 중인 Docker 데몬과 통신합니다.

→ -v portainer_data:/data

- 이 볼륨은 Portainer 데이터를 지속적으로 유지하는 데 사용됩니다.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_1.png)

<div class="content-ad"></div>

포트 노출된 앱을 둘러보세요.

일정 시간 이내에 상호 작용하지 않으면 이 위자드가 만료되어 포테이너 컨테이너를 다시 시작해야 합니다.

![Portainer Image](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_2.png)

시작하기를 클릭하고 Live connect를 클릭하여 로컬 도커에 연결하세요.

<div class="content-ad"></div>


![2024-06-19-SimplifyDockerManagementwithPortainer_3](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_3.png)

![2024-06-19-SimplifyDockerManagementwithPortainer_4](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_4.png)

그리고 모든 데이터가 있는 대시보드가 나타납니다.

왼쪽 패널의 메뉴를 탐색하면 App 템플릿, 컨테이너, 이미지 등이 있습니다.


<div class="content-ad"></div>

아래는 활성 컨테이너 목록이 나타납니다. 새로운 컨테이너를 추가해보세요.

'컨테이너 추가'를 클릭하세요. 이 페이지에서 Docker 허브도 검색할 수 있습니다.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_6.png)

<div class="content-ad"></div>

컨테이너에 이름을 지정하고, 위의 방법처럼 무작위 포트를 할당하거나 직접 설정할 수 있습니다.

앱을 둘러보세요:

![Screenshot](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_7.png)

모든 컨테이너와 상태를 볼 수 있습니다 (docker ps -a). 상태 뱃지 옆에는 로그 보기, 검사 또는 컨테이너로 실행하는 버튼이 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_8.png)

컨테이너를 선택하시고, 이제 중지, 시작, 재시작 또는 제거 등의 조작을 할 수 있습니다.

이미지도 마찬가지로 모든 이미지를 리스트업합니다 (docker image ls), 태그 등.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_9.png)


<div class="content-ad"></div>

해당 이미지에 대한 컨테이너가 존재하지 않으면 사용되지 않음을 보여줍니다.

코드를 업로드하고 편집기를 사용하여 이미지를 빌드하는 옵션입니다.

App Templates를 사용하면 준비된 컨테이너를 시작하거나 사용자 정의 템플릿을 만들 수 있습니다.

![Portainer Image](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_10.png)

<div class="content-ad"></div>

## 원격 Docker 환경에 연결하기:

여기는 Docker가 설치되어 있고 nginx 컨테이너가 실행 중인 또 다른 기계입니다.

Environment를 클릭하고 Environment 추가를 선택한 다음 환경을 선택하세요 (나의 경우에는 docker).

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_11.png)

<div class="content-ad"></div>

에이전트를 선택하고 두 번째 기계에 명령 스니펫을 복사하여 붙여넣으세요. 이름을 지정하고 IP를 사용하며, 포테이너 에이전트 포트와 연결하세요.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_12.png)

이는 '포테이너 에이전트'라는 컨테이너를 실행하며, 이를 사용하여 환경과 통신할 수 있습니다.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_13.png)

<div class="content-ad"></div>

이제 홈페이지로 이동하여 2번 환경에서 연결을 클릭해주세요.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_14.png)

이렇게하면 환경이 전환되어 2번 컴퓨터에있는 모든 이미지와 컨테이너가 표시됩니다.

![이미지](/assets/img/2024-06-19-SimplifyDockerManagementwithPortainer_15.png)

<div class="content-ad"></div>

에지 에이전트를 통해 연결하면 IP를 입력할 필요가 없습니다. 그냥 코드를 복사해서 원격 기기에서 실행해보세요.

## 마무리:

깔끔한 UI로 도커 관리를 쉽게 할 수 있는 훌륭한 유틸리티입니다. 도커 컴포즈 관리와 같은 스택을 더 탐구해보거나 k8s와 같은 다른 환경에 연결해보세요.

참고: Portainer.io