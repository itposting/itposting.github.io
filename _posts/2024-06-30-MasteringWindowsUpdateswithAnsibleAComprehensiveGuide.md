---
title: "Ansible로 윈도우 업데이트 마스터하기 종합 가이드"
description: ""
coverImage: "/assets/img/2024-06-30-MasteringWindowsUpdateswithAnsibleAComprehensiveGuide_0.png"
date: 2024-06-30 23:20
ogImage: 
  url: /assets/img/2024-06-30-MasteringWindowsUpdateswithAnsibleAComprehensiveGuide_0.png
tag: Tech
originalTitle: "Mastering Windows Updates with Ansible: A Comprehensive Guide"
link: "https://medium.com/@krishnendubhowmick/mastering-windows-updates-with-ansible-a-comprehensive-guide-6272bc13d58b"
---


윈도우 시스템에서 업데이트를 관리하는 것은 여러 대의 서버가 있는 환경에서 특히 어려울 수 있습니다. 일반적으로 윈도우 업데이트는 GUI를 통해 관리되어왔는데, 이는 시간이 많이 소요되고 오류가 발생하기 쉽습니다. 그러나 Ansible을 사용하면 전체 프로세스를 자동화하여 최소한의 노력으로 시스템이 최신 상태를 유지할 수 있습니다. 이 블로그에서는 Ansible을 사용하여 윈도우 업데이트를 설정하고 관리하는 과정을 안내해 드리겠습니다.

![이미지](/assets/img/2024-06-30-MasteringWindowsUpdateswithAnsibleAComprehensiveGuide_0.png)

## 사전 준비 사항

Ansible 구성으로 진입하기 전에 필요한 사전 준비 사항이 갖춰져 있는지 확인해 보겠습니다:

<div class="content-ad"></div>

- Ansible 제어 머신: 제어 머신에 Ansible이 설치되어 있는지 확인해주세요. 그렇지 않은 경우, 다음 명령을 사용하여 설치할 수 있습니다:

```js
pip install ansible
```

2. Windows 시스템: Windows 시스템이 WinRM(Windows 원격 관리)이 활성화되어 있고 올바르게 구성되어 있는지 확인해주세요. 이는 Ansible이 Windows 호스트와 통신할 수 있게 합니다.

3. Ansible Windows Collection: Windows 업데이트를 관리하기 위한 필요한 모듈이 있는지 확인하기 위해 ansible.windows 컬렉션을 설치해주세요.

<div class="content-ad"></div>

```js
ansible-galaxy collection install ansible.windows
```

## Windows에서 WinRM 구성하기

Windows 업데이트를 관리하기 위해 Ansible이 각 Windows 머신에서 올바르게 구성되어야 합니다. Windows 시스템에서 WinRM을 구성하기 위해 실행할 수 있는 스크립트가 있습니다:

```js
# PSRemoting 활성화
Enable-PSRemoting -Force

# 암호화되지 않은 트래픽 허용
Set-Item -Path WSMan:\localhost\Service\AllowUnencrypted -Value $true

# 기본 인증 허용
Set-Item -Path WSMan:\localhost\Service\Auth\Basic -Value $true

# TrustedHosts 설정
Set-Item WSMan:\localhost\Client\TrustedHosts -Value “*” -Force

# WinRM 트래픽을 허용하는 방화벽 규칙 생성
New-NetFirewallRule -Name “Allow WinRM HTTP-In” -DisplayName “Allow WinRM HTTP-In” -Protocol TCP -LocalPort 5985 -Action Allow -Profile Any
New-NetFirewallRule -Name “Allow WinRM HTTPS-In” -DisplayName “Allow WinRM HTTPS-In” -Protocol TCP -LocalPort 5986 -Action Allow -Profile Any

# 자체 서명 인증서 생성
$cert = New-SelfSignedCertificate -DnsName “localhost” -CertStoreLocation Cert:\LocalMachine\My

# 새 인증서를 사용하여 WinRM을 HTTPS로 구성
winrm create winrm/config/Listener?Address=*+Transport=HTTPS “@{Hostname=`”localhost`”;CertificateThumbprint=`”$($cert.Thumbprint)`”}”

# WinRM 서비스 재시작
Restart-Service -Name “WinRM"
```

<div class="content-ad"></div>

## Ansible 인벤토리 설정

다음으로는 Ansible 인벤토리를 구성하여 Windows 호스트를 포함해야합니다. 다음은 인벤토리 파일(inventory.ini)의 예시입니다:

```js
[windows]
win_host1 ansible_host=192.168.1.100
win_host2 ansible_host=192.168.1.101

[windows:vars]
ansible_user=your_username
ansible_password=your_password
ansible_port=5986
ansible_connection=winrm
ansible_winrm_transport=basic
ansible_winrm_server_cert_validation=ignore
```

<div class="content-ad"></div>

이제 Windows 호스트에서 업데이트를 확인하고 설치하는 Ansible 플레이북을 만들어봅시다. win_updates.yaml이라는 파일을 생성하고 다음 내용을 추가하세요:

```yaml
---
- name: Check and print installed and pending updates on Windows 10
  hosts: windows
  gather_facts: no
  tasks:
    - name: Gather facts
      ansible.windows.setup

    - name: Check for installed updates
      win_updates:
        category_names: []
        state: installed
      register: installed_updates
      retries: 3
      delay: 5
      until: installed_updates is succeeded

    - name: Print installed updates
      debug:
        msg: "Installed updates: { installed_updates.updates }"

    - name: Check for pending updates
      win_updates:
        category_names: []
        state: searched
      register: pending_updates
      retries: 3
      delay: 5
      until: pending_updates is succeeded

    - name: Print pending updates
      debug:
        msg: "Pending updates: { pending_updates.updates }"
```

이 플레이북은 다음 작업을 수행합니다:

- 정보 수집: Windows 호스트에 대한 기본 정보를 수집합니다.
- 설치된 업데이트 확인: win_updates 모듈을 사용하여 모든 설치된 업데이트를 나열합니다.
- 설치된 업데이트 출력: 설치된 업데이트 목록을 출력합니다.
- 대기 중인 업데이트 확인: win_updates 모듈을 사용하여 대기 중인 업데이트를 검색합니다.
- 대기 중인 업데이트 출력: 대기 중인 업데이트 목록을 출력합니다.

<div class="content-ad"></div>

## Playbook 실행 방법

플레이북을 실행하려면 다음 명령어를 사용하십시오:

```js
ansible-playbook -i inventory.ini win_updates.yaml -l win_host1
```

이 명령어는 지정된 호스트(win_host1)에서 플레이북을 실행합니다. -l 옵션을 생략하여 모든 Windows 호스트에서 실행할 수도 있습니다.

<div class="content-ad"></div>

## 문제 해결

Playbook 실행 중 문제가 발생하면 자세한 오류 메시지를 얻기 위해 상세도를 높일 수 있습니다:

```js
ansible-playbook -i inventory.ini win_updates.yaml -l win_host1 -vvv
```

# 결론

<div class="content-ad"></div>

이 가이드를 따라하면 Ansible을 사용하여 Windows 시스템에서 업데이트를 확인하고 설치하는 프로세스를 자동화할 수 있습니다. 이는 시간을 절약하는 뿐만 아니라 환경 전반에 걸쳐 일관성을 보장합니다. Ansible의 강력한 자동화 기능은 혼합된 환경을 관리하는 시스템 관리자 및 DevOps 엔지니어에게 귀중한 도구가 됩니다.

특정 요구 사항에 맞게 이 플레이북을 수정하고 확장하십시오. 즐거운 자동화하세요!