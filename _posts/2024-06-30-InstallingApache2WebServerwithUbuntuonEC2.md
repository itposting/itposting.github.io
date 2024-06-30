---
title: "EC2에 Ubuntu로 Apache 2 웹 서버 설치하는 방법"
description: ""
coverImage: "/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_0.png"
date: 2024-06-30 23:07
ogImage: 
  url: /assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_0.png
tag: Tech
originalTitle: "Installing Apache 2 Web Server with Ubuntu on EC2"
link: "https://medium.com/@brettidykes/installing-apache-2-web-server-with-ubuntu-on-ec2-80e18964943d"
---


# 시나리오:

Level Up Bank의 클라우드 엔지니어로서, 저희 팀은 Amazon Linux 2를 사용하여 새 웹 서버를 생성하는 작업을 맡게 되었습니다. Amazon Linux 2는 웹 서버로 널리 사용되는 오픈 소스 Linux 배포판입니다. 이 웹 서버는 Level Up Bank의 웹 사이트를 호스팅하며, 서비스에 대한 정보를 제공하고 고객이 온라인으로 계좌에 액세스할 수 있도록 합니다.

# 장애/목표:

현재 우리의 AWS EC2 인스턴스에는 웹 서버가 실행되고 있지 않습니다. 우리 팀은 해당 웹 서버를 설치해야 하며, 올바른 보안 권한을 확인하고 웹 서버에 읽기/쓰기할 수 있는 능력을 검증하며, 공개적으로 읽을 수 있는지 확인하고, 웹 서버가 회사가 원하는대로 작동하는지 문제 해결해야 합니다.

<div class="content-ad"></div>

# 작업:

## 1. 우분투에서 모든 패키지 업데이트하기

새로 시작하는 우분투 가상 머신에서는 모든 것이 최신 상태인지 확인하고 싶습니다. 우분투 AMI(Amazon 이미지)에 SSH를 사용하여 원격으로 연결한 후, 명령줄에서 'sudo apt update'를 사용하여 머신을 업데이트할 수 있습니다.

```js
sudo apt update
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_0.png" />

<img src="/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_1.png" />

## 2. Apache HTTP 웹 서버 설치

이제 Apache를 설치해야 합니다. 이를 위해 다음 명령을 실행하겠습니다:

<div class="content-ad"></div>

```js
sudo apt install apache2
```

![Installing Apache2 Web Server](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_2.png)

![Installing Apache2 Web Server](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_3.png)

## 3. Enable Apache Web Server

<div class="content-ad"></div>

Apache 웹 서버를 설치했습니다. 이제 이를 활성화하고 실행 중인지 확인해야 합니다. 아래 명령어를 실행하여 확인할 수 있어요:

```js
sudo systemctl enable apache2
#그리고
sudo systemctl status apache2
#실행 중인지 확인하기 위해
```

![이미지1](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_4.png)

![이미지2](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_5.png)

<div class="content-ad"></div>


![2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_6.png](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_6.png)



![2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_7.png](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_7.png)


## 4. 웹 서버의 IP 주소 확인 및 공개 읽기 가능 여부 확인

이제 웹 브라우저를 통해 웹 서버에 액세스할 수 있는지 확인해보겠습니다. 웹 서버의 IP를 가져와서 웹 브라우저에서 연결을 시도해 봅시다. 이를 위해서 다음 명령을 실행하세요.

<div class="content-ad"></div>

```js
curl -4 icanhazip.com
```

![Image 1](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_8.png)

![Image 2](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_9.png)

![Image 3](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_10.png)


<div class="content-ad"></div>


![Apache Web Server](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_11.png)

성공입니다. 이제 웹에서 우리의 웹 서버가 공개적으로 볼 수 있습니다.

## 5. AWS 보안 그룹에서 HTTP 포트 연결 (포트 80) 확인

Ubuntu 머신을 EC2 인스턴스에 설정할 때 이미 보안 그룹을 통해 HTTP 연결을 활성화했습니다. 연결할 때 오류가 발생하는 경우 HTTP 액세스가 활성화되지 않았을 수 있습니다.


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_12.png)

## 6. Apache2 웹 서버의 index.html 파일 편집, 사용자 정의 코드 입력, 웹 서버의 읽기/쓰기 권한 확인.

접속한 서버의 초기 화면은 Apache2가 성공적으로 연결되었음을 보여주기 위해 제공하는 기본 페이지입니다. 그러나 이것은 은행 웹사이트로는 부족합니다. 인덱스 파일의 위치를 찾아서 원하는 변경을 가해봅시다.

기본 인덱스 파일의 위치: /var/www/html

<div class="content-ad"></div>

이 디렉토리에 액세스하려면 다음 명령을 실행합니다:

```js
#루트 폴더에 이미 있는 경우
cd /var/www/html
```

<img src="/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_13.png" />

이제 파일을 편집하는 동안 실수를 했을 경우에 대비하여 먼저 백업 복사본을 만들어봅시다. 다음 명령을 실행하세요:

<div class="content-ad"></div>

```shell
sudo cp index.html indexbackup.html
```

![Screenshot](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_14.png)

Now that we have our backup, let's access the original, erase it, and input our own code:

To access the file, run the command:

<div class="content-ad"></div>

```js
sudo nano /var/www/html/index.html
```

![Image 1](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_15.png)

이제 내부로 들어가시면 코드를 한 줄씩 삭제할 때 빠르게 제거하려면 Ctrl + Shift + K를 누르세요.

![Image 2](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_16.png)


<div class="content-ad"></div>

제가 만든 간단한 .html 문서에는 일부 css가 포함되어 있어서 시험 페이지가 더 매력적으로 보이도록 되어 있어요:

```js
<!DOCTYPE html>
<html>
<head>
    <title>Welcome Page</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f06, #4a90e2);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        h1 {
            background-color: rgba(0, 0, 0, 0.5);
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <h1>Welcome to LUIT - Silver Team</h1>
</body>
</html>
```

<div class="content-ad"></div>

이제 새로운 .html/css가 파일 안에 들어 있으니 웹 페이지를 새로고침해서 변경 내용이 표시되는지 확인해 봅시다:

![image](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_19.png)

## 7. 사용자가 오류를 보고하는 경우; 로그가 저장된 위치를 찾아서 액세스하기

모든 웹사이트나 애플리케이션은 오류를 가지고 있습니다. 사용자가 오류를 보고할 때 문제를 파악하기 위해 로그에 접근해야 합니다. 우선 로그를 찾아야 합니다. Ubuntu에서는 로그가 /var/log/apache2/access.log에 위치한다고 빠른 구글 검색 결과에 나옵니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_20.png" />

이제 로그가 어디에 있는지 확인했으므로 'cat' 명령어를 사용하여 파일 내용을 볼 수 있습니다:

<img src="/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_21.png" />

```js
cat access.log
cat error.log
```

<div class="content-ad"></div>

## 8. 최신 15개 항목만 포함하도록 로그 파일을 새 파일로 리디렉션합니다.

에러 로그 및 액세스 로그 출력을 새 파일로 리디렉션하고 최신 15개 항목만 포함하도록 합시다. 약간 복잡해 보일 수 있으니 하나씩 설명해 드리겠습니다.

![이미지](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_22.png)

여기서 최신 15개 항목을 새 파일 AccessLogsJune29.txt로 리디렉션하기 위해 `tail -n 15 access.log > AccessLogsJune29.txt` 명령어를 사용했습니다. 그러나 권한 문제가 발생했습니다.

<div class="content-ad"></div>

일반적으로 'sudo' 명령어는 작동하지만, 저희 터미널 내의 구문은 sudo가 전체 명령어에 적용되도록 만들어야 합니다. 다음 줄에 어떻게 하는지 확인해보세요.

```js
sudo sh -c 'tail -n 15 /path/to/source_log.txt > /path/to/new_log.txt'
```

명령어 설명:

- `sudo sh -c 'command'`: 이 명령어는 `sudo`가 포함된 새 셸에서 명령어를 실행하여, 리다이렉션을 포함한 전체 명령어에 `sudo`가 적용되도록 합니다.
- `tail -n 15 /path/to/source_log.txt`: 지정된 로그 파일의 마지막 15줄을 가져옵니다.
- `` /path/to/new_log.txt`: 이 출력 결과를 `new_log.txt`로 리다이렉트하여 해당 내용을 덮어씁니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_23.png)

![image](/assets/img/2024-06-30-InstallingApache2WebServerwithUbuntuonEC2_24.png)

Now we have two new txt files which report the latest 15 entries for both our access logs and our error logs.

# Result:


<div class="content-ad"></div>

저희는 작동 중인 Apache 2 웹 서버를 소유하고 있습니다. 이 서버는 비공개로 쓰기가 가능하고 공개적으로 읽을 수 있습니다. 웹 사이트의 랜딩 페이지를 우리만의 코드로 편집할 수 있었습니다. 또한 에러 및 접근 로그에 액세스할 수 있었고, 이를 우리 자신의 파일로 리다이렉트할 수도 있었습니다.