---
title: "Ubuntu에서 기본 커널 변경 및 설정하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_0.png"
date: 2024-06-23 15:23
ogImage: 
  url: /assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_0.png
tag: Tech
originalTitle: "How do you change and set the default Kernel in Ubuntu Machine?"
link: "https://medium.com/@mnzel/how-do-you-change-and-set-the-default-kernel-in-ubuntu-machine-7ad1107e1b6f"
---


우분투 머신의 기본 커널을 변경하고 다른 커널로 전환해야하는 상황에 처해본 적이 있나요?

![이미지](/assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_0.png)

저 또한 이 상황을 마주했는데, 시간을 보내며 원하는 우분투 커널로 변경하는 간단한 방법을 찾게 되었습니다.

본 글에서는 AWS에서 운영 중인 우분투 18.04 머신을 사용하고 있습니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_1.png" />

우분투 머신의 커널을 확인하려면 터미널을 사용하여 머신에 SSH로 연결하세요. 현재 커널 버전을 확인하려면 다음 명령을 사용하세요.

```js
ubuntu@ip-172–32–11–86:~$ uname -r
5.4.0-1103-aws
```

이 우분투 머신에 설치된 커널 목록을 보려면 터미널에서 다음 명령을 사용하세요


<div class="content-ad"></div>


위 명령을 사용하면 Ubuntu 머신에 설치된 커널 목록을 얻을 수 있어요. 원하는 커널을 선택하고 아래 명령을 사용하여 설치하세요.

```js
ubuntu@ip-172–32–11–86:~$ sudo apt install linux-image-unsigned-4.15.0-136-lowlatency
```

<img src="/assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_2.png" /> 


<div class="content-ad"></div>

다음 단계는 Grub 기본 커널을 설정하는 것입니다. 두 부분으로 나뉩니다. 먼저 다음 명령어를 사용하여 $menuentry_id_option을 가져와야 합니다.

```js
ubuntu@ip-172-31-11-86:~$ grep submenu /boot/grub/grub.cfg
submenu 'Advanced options for Ubuntu' $menuentry_id_option 'gnulinux-advanced-9cf7073a-6786-43dc-895e-8bbebe712a1e' {
```

`gnulinux-advanced-9cf7073a-6786–43dc-895e-8bbebe712a1e`을 복사해 주세요.

둘째로, 지정된 커널 버전을 얻어야 합니다.

<div class="content-ad"></div>

```plaintext
ubuntu@ip-172-31-11-86:~$ grep 4.15.0-136 /boot/grub/grub.cfg
```

여기서 제가 설치된 커널 목록에서 커널 버전만 복사했습니다.

아래 이미지를 참고해주세요:

![그림](/assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_3.png)

녹색으로 강조된 gnulinux-4.15.0–136-lowlatency-advanced-9cf7073a-6786–43dc-895e-8bbebe712a1e를 복사해주세요.


<div class="content-ad"></div>

기본 GRUB을 설정하려면 선택한 편집기(vim, nano 등)를 사용하여 grub 파일인 /etc/default/grub을 엽니다. 두 개의 복사된 문자열을 역따옴표(`)로 연결하고 grub 파일의 GRUB_DEFAULT로 설정합니다.

gnulinux-advanced-9cf7073a-6786-43dc-895e-8bbebe712a1e`gnulinux-4.15.0-136-lowlatency-advanced-9cf7073a-6786-43dc-895e-8bbebe712a1e

![이미지](/assets/img/2024-06-23-HowdoyouchangeandsetthedefaultKernelinUbuntuMachine_4.png)

파일을 저장하고 grub을 업데이트하는 다음 명령을 사용하세요.

<div class="content-ad"></div>

```bash
ubuntu@ip-172-31-11-86:~$ sudo update-grub
ubuntu@ip-172-31-11-86:~$ sudo reboot
```

머신이 다시 부팅되면, 기본 커널로 설정된 커널을 선택할 수 있게 됩니다 ✅

==============================================================

이 이야기가 도움이 되었다면 비슷한 이야기를 보고 싶다면, 가상 커피로 저를 지원해주시면 감사하겠습니다 😉👇🏻


<div class="content-ad"></div>

☕ https://ko-fi.com/mnzel1 ☕