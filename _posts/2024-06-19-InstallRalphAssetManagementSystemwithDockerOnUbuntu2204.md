---
title: "우분투 2204에 도커를 사용하여 Ralph 자산 관리 시스템 설치하기"
description: ""
coverImage: "/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_0.png"
date: 2024-06-19 15:04
ogImage: 
  url: /assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_0.png
tag: Tech
originalTitle: "Install Ralph Asset Management System with Docker On Ubuntu 22.04"
link: "https://medium.com/@hasanudin31113/install-ralph-asset-management-system-with-docker-on-ubuntu-22-04-26494ea6bf76"
---


<img src="/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_0.png" />

Ralph는 IT 자산 및 데이터 센터 자원을 관리하고 추적하는 데 특별히 설계된 오픈 소스 자산 관리 도구입니다. 이는 조직이 하드웨어, 소프트웨어, 라이선스 및 다른 인프라 구성 요소를 전 과정에 걸쳐 자세히 추적할 수 있도록 돕습니다. Ralph의 주요 기능은 다음과 같습니다:

1. 자산 관리: 서버, 컴퓨터, 네트워크 장치 및 다른 하드웨어를 포함한 IT 자산을 추적하고 관리합니다.

2. 라이선스 관리: 소프트웨어 라이선스를 관리하며 사용량을 추적하고 라이선스 계약을 준수하는 것을 보장합니다.

<div class="content-ad"></div>

3. 재고 추적: 자산의 물리적 위치, 상태 및 이력을 포함한 재고의 실시간 추적을 제공합니다.

4. 데이터 센터 관리: 랙, 장치 및 연결을 포함한 데이터 센터 자원을 관리하여 데이터 센터 인프라의 종합적인 전망을 제공합니다.

5. 통합: 도움데스크, 모니터링 도구 및 구성 관리 시스템과 같은 다른 시스템과 통합하여 운영을 간소화하고 효율성을 향상시킵니다.

6. 보고 및 분석: 정확하고 최신의 자산 데이터를 기반으로 한 결정 과정을 지원하기 위해 자세한 보고서와 분석을 생성합니다.

<div class="content-ad"></div>

7. 문서화: 자산과 관련된 매뉴얼, 보증 정보 및 유지보수 계약과 같은 문서를 저장하고 관리하세요.

8. 다중 사용자 지원: 다양한 액세스 수준과 권한을 가진 여러 사용자가 협업하여 자산을 효과적으로 관리할 수 있도록 지원하세요.

9. API: 자산 관리 프로세스를 더 효율적으로 통합하고 자동화하기 위한 API를 제공하세요.

Ralph는 IT 팀과 자원 활용을 최적화하고 자산을 효율적으로 관리하며 정책 및 규정을 준수하는 것을 목표로 하는 조직에 특히 유용합니다. 포괄적이고 유연한 자산 관리 솔루션을 제공함으로써 Ralph는 조직이 운영 효율성을 향상시키고 IT 인프라에 대한 정보 기반 결정을 내릴 수 있도록 돕습니다.

<div class="content-ad"></div>

시작하기 전에 시스템을 최신 버전으로 업데이트해야 해요.

```js
apt-get update -y

apt-get upgrade -y
```

# Docker 및 Docker Compose 설치

아래 명령어를 실행하여 설치할 수 있어요 :

<div class="content-ad"></div>

```js
apt-get install docker.io docker-compose -y
```

![Instructions Screenshot](/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_1.png)

After the installation is complete, start the Docker service and check its status. Ensure everything is running normally.

```js
systemctl start docker
systemctl enable docker
systemctl status docker
```

<div class="content-ad"></div>

마크다운 형식으로 테이블 태그를 변경하면 됩니다.

<div class="content-ad"></div>

# 도커를 사용하여 Ralph 설치하기

Ralph를 설치하기 전에 Git 패키지를 설치하고 해당 저장소에서 다운로드하세요.

```js
apt-get install git -y
git clone https://github.com/allegro/ralph.git
```

![이미지](/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_4.png)

<div class="content-ad"></div>

라우트를 ralph/docker로 변경한 후, Ralph를 위한 컨테이너를 다운로드하고 빌드해보세요.

```bash
cd ralph/docker
docker-compose run web init
docker-compose up -d
```

<img src="/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_5.png" />

작업이 완료되면 웹 브라우저를 열고 http://ip-address-server을 입력하세요. 기본 사용자 이름 "ralph"과 비밀번호 "ralph"로 로그인하고 로그인 버튼을 클릭하세요.

<div class="content-ad"></div>


아래는 Markdown 형식으로 변환되었습니다:


![Initial Ralph dashboard screen](/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_6.png)

You will see the initial Ralph dashboard screen.

![Change the default password by clicking on the profile](/assets/img/2024-06-19-InstallRalphAssetManagementSystemwithDockerOnUbuntu2204_7.png)


<div class="content-ad"></div>

마크다운 형식으로 테이블 태그를 변경해주세요.

| Column 1 Header | Column 2 Header | Column 3 Header |
|-----------------|-----------------|-----------------|
| Row 1 Column 1  | Row 1 Column 2  | Row 1 Column 3  |
| Row 2 Column 1  | Row 2 Column 2  | Row 2 Column 3  |