---
title: "Ubuntu에서 웹사이트 구축하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_0.png"
date: 2024-06-23 18:21
ogImage: 
  url: /assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_0.png
tag: Tech
originalTitle: "Building your own website in Ubuntu"
link: "https://medium.com/@timothy.halim/setting-up-web-server-in-ubuntu-8ac1a3b36a7d"
---


요즘 오렌지 파이를 샀는데 취미로 웹 서버를 만들어보기로 결정했어요. 만약 당신의 ISP가 공인 IP를 허용한다면, 온라인으로 접속할 수도 있을 거에요.

# 프레임워크

첫 번째로 해야 할 일은 서버를 실행할 웹 프레임워크를 설정하는 것이에요. 이 경우 빠른 테스트를 위해 파이썬을 사용하여 플라스크를 선택했어요. 다른 프레임워크인 장고, 노드.js나 다른 것을 이미 알고 계시다면 그것을 사용해도 돼요.

저는 루트 디렉토리에 폴더를 만들어 시작하는 것부터 시작해요.

<div class="content-ad"></div>

```shell
cd /
sudo mkdir sww
cd /sww
mkdir scripts
cd /sww/scripts
mkdir webserver
cd /sww/scripts/webserver
```

다음으로 아래를 실행하여 파이썬 가상 환경을 만들 수 있어요

```shell
python3 -m venv .venv
```

다음으로 원하는 IDE(통합 개발 환경)나 텍스트 편집기를 사용할 수 있어요. 저는 Visual Studio Code를 사용해서 폴더를 여는 게 좋아요.

<div class="content-ad"></div>

```js
code .
```

방금 만든 Python 가상 환경을 사용하도록 vscode를 설정할 거에요. ctrl+shift+p를 눌러 Python: Select Interpreter를 선택하면 이렇게 선택 목록이 열릴 거예요.

![image](/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_0.png)

현재 폴더에 있는 가상 환경을 선택한 후 터미널을 열면 (ctrl+shift+`) 이 접두사가 나와야 해요 (.venv)

<div class="content-ad"></div>

아래는 Markdown 형식으로 표현된 코드입니다.


<img src="/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_1.png" />

다음은 터미널에서 이 코드를 실행하여 flask를 설치하는 방법입니다.

```python
python -m pip install flask
```

이 가이드를 따라하여 hello.py 파일을 생성합니다. 파일 내용은 아래와 같습니다.


<div class="content-ad"></div>

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

그런 다음 이 명령어를 실행하여 플라스크를 시작하십시오.

```bash
flask run --app hello
```

웹 브라우저에서 localhost:5000을 열어주세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_2.png" />

대박! 잘 됐어요! 안녕, 세계여!

# Nginx

다음으로는 Nginx를 설정하여 역방향 프록시를 처리할 거에요

<div class="content-ad"></div>

첫 번째 단계는 Nginx를 설치하는 것입니다.

```js
sudo apt update
sudo apt install nginx
sudo nginx -V
```

또한 웹 브라우저에서 localhost 또는 로컬 IP를 열어서 작동 여부를 확인할 수도 있습니다.

![이미지](/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_3.png)

<div class="content-ad"></div>

반드시 보안을 위해 방화벽을 설치하는 것을 잊지 마세요.

```js
sudo apt install ufw
sudo ufw enable
sudo ufw allow from <router_ip> to any port 80
sudo ufw allow from <router_ip> to any port 443
```

라우터 IP를 입력해야 보안을 높일 수 있지만, 확실하지 않다면 'any'로 설정할 수 있어요. 어쨌든 나중에 액세스하려면 라우터 IP가 필요하답니다.

다음으로, 서버를 온라인에서 액세스할 수 있도록 포트를 열어야 해요. 라우터 IP 주소로 이동해서 로컬 머신 IP 주소를 찾으세요. 저의 경우에는 192.168.20.4예요.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_4.png" />

그런 다음 라우터가 가지고 있는 포트 포워딩 또는 NAT(라우터에 따라 다를 수 있음) 중 하나로 이동합니다.

<img src="/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_5.png" />

서비스 이름, 로컬 머신 IP 주소 및 포트를 입력한 후 저장을 누릅니다.


<div class="content-ad"></div>


![Screenshot](/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_6.png)

Once done, it should look like this. Please note that the display may vary depending on the router and brand.

# Test

After setting up nginx and opening the port, you can test accessing your machine online by searching for your public IP on Google as shown below:


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_7.png)

만약 작동하면 nginx 환영 페이지를 가리켜야합니다.

# Nginx 사이트

Nginx가 작동하면 사이트를 설정할 수 있습니다.


<div class="content-ad"></div>


```js
cd /etc/nginx/sites-enabled
sudo touch webserver
sudo gedit webserver
```

위 명령을 입력하면 gedit 텍스트 편집기에서 webserver 파일이 열릴 겁니다. 아래 코드를 입력하고 저장하세요.

```js
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /sww/scripts/webserver;

    location / {
        proxy_pass http://localhost:5000/;
        proxy_buffering off;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;
    }
}
```

그런 다음 Nginx 서버를 재시작하고 브라우저를 새로고침하세요.


<div class="content-ad"></div>


sudo systemctl restart nginx.service


![Building your own website in Ubuntu](/assets/img/2024-06-23-BuildingyourownwebsiteinUbuntu_8.png)

지금은 플라스크 웹 서버를 가리키도록 설정되어 있습니다. 그러면 계속 작업을 계속할 수 있어요 :)

다음 단계는 기억에 남을 주소로 이를 도메인에 연결하는 것인데, 이에 대해 다른 문서에서 다룰 것입니다. 그때까지 안녕히 계세요! 👋
