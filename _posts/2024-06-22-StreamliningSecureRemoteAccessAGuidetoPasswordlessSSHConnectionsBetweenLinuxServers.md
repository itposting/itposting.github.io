---
title: "안전한 원격 접속 간소화 리눅스 서버 간 패스워드 없는 SSH 연결 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-StreamliningSecureRemoteAccessAGuidetoPasswordlessSSHConnectionsBetweenLinuxServers_0.png"
date: 2024-06-22 16:10
ogImage: 
  url: /assets/img/2024-06-22-StreamliningSecureRemoteAccessAGuidetoPasswordlessSSHConnectionsBetweenLinuxServers_0.png
tag: Tech
originalTitle: "Streamlining Secure Remote Access: A Guide to Passwordless SSH Connections Between Linux Servers"
link: "https://medium.com/@prateek.malhotra004/streamlining-secure-remote-access-a-guide-to-passwordless-ssh-connections-between-linux-servers-8c26bb008af9"
---


---markdown
![SSH Connection](/assets/img/2024-06-22-StreamliningSecureRemoteAccessAGuidetoPasswordlessSSHConnectionsBetweenLinuxServers_0.png)

두 대의 Linux 서버 간에 비밀번호 없는 SSH 연결을 설정하는 것은 안전한 원격 액세스를 간편하게하는 일반적인 방법입니다. 본 자습서는 비밀번호 없는 SSH 인증을 설정하는 단계를 안내하며, 연결이 예상대로 작동하지 않을 경우 해결 방법을 제공합니다.

# 전제 조건

- 두 대의 Linux 서버 (서버 A 및 서버 B)
- 두 서버 모두에 대한 관리 액세스
---

<div class="content-ad"></div>

# 단계 1: 서버 A에서 SSH 키 쌍 생성하기

- SSH 또는 물리적으로 서버 A에 로그인합니다.
- 터미널 창을 엽니다.
- 다음 명령을 실행하여 SSH 키 쌍을 생성합니다:

```js
ssh-keygen -t rsa
```

키 쌍의 기본 위치를 사용하려면 Enter를 누르시고, 인증을 위해 암호를 비워둘 경우 비밀번호 없는 인증을 사용할 수 있습니다.

<div class="content-ad"></div>

4. Enter 키를 눌러 키 생성을 확인해주세요.

5. 이 작업은 ~/.ssh/ 디렉토리에 개인 키 (id_rsa) 및 공개 키 (id_rsa.pub)를 생성합니다.

## 단계 2: 공개 키를 서버 B로 복사

- ssh-copy-id 명령어를 사용하여 공개 키를 서버 B로 복사하세요:

<div class="content-ad"></div>

```js
ssh-copy-id user@serverB_IP
```

- 사용자를 서버 B의 사용자 이름으로, serverB_IP를 서버 B의 IP 주소 또는 호스트 이름으로 바꿔주세요.
- 서버 B의 사용자 계정 암호를 입력하라는 메시지가 표시됩니다.
- 공개 키를 성공적으로 복사한 후, 키가 추가되었음을 확인하는 메시지가 표시됩니다.

# 단계 3: 무비밀번호 연결 테스트

서버 A에서 서버 B로 SSH 연결을 시도해보세요:

<div class="content-ad"></div>

```js
ssh user@serverB_IP
```

이제 암호를 묻지 않고 서버 B에 액세스할 수 있어야 합니다.

# 문제 해결 팁

암호없는 연결이 작동하지 않는 경우, 다음 문제 해결 단계를 따라주세요:

<div class="content-ad"></div>

- 권한 확인: Server A 및 Server B의 .ssh 디렉토리가 올바른 권한을 가지고 있는지 확인해주세요. 사용자의 소유이어야 하며 제한된 권한을 가져야 합니다:

```js
chmod 700 ~/.ssh 
chmod 600 ~/.ssh/authorized_keys
```

- 키 파일 이름: 기본 키 이름(id_rsa 및 id_rsa.pub) 또는 키 생성 중에 지정한 이름을 사용하는지 확인하세요.
- SSH 에이전트: Server A에서 프라이빗 키를 SSH 에이전트에 추가했는지 확인해주세요. 다음 명령을 사용하여 추가할 수 있습니다:

```js
ssh-add ~/.ssh/id_rsa
```

<div class="content-ad"></div>

3. 방화벽 및 SELinux: 각 서버의 방화벽이 SSH 액세스를 차단하는지 확인하고 SELinux 권한이 문제를 일으키지 않도록 합니다.

4. 로그: Server B의 SSH 서버 로그에서 오류 메시지를 확인하세요:

```js
tail -f /var/log/auth.log  # Ubuntu/Debian에서
tail -f /var/log/secure    # CentOS/RHEL에서
```

5. 디버깅 모드: 더 많은 정보를 얻기 위해 SSH를 디버깅 모드로 실행할 수 있습니다:

<div class="content-ad"></div>

```js
ssh -v user@serverB_IP
```

이 명령어는 자세한 디버그 출력을 제공하여 문제의 원인을 파악하는 데 도움이 될 것입니다.

이러한 단계를 따르고 문제 해결 팁을 고려한다면, Linux 서버간의 안전하고 편리한 원격 액세스를 위한 비밀번호 없는 SSH 연결을 설정할 수 있을 것입니다.