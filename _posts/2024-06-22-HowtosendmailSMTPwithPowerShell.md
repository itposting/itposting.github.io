---
title: "PowerShell을 사용해 SMTP로 메일 보내는 방법"
description: ""
coverImage: "/assets/img/2024-06-22-HowtosendmailSMTPwithPowerShell_0.png"
date: 2024-06-22 16:32
ogImage: 
  url: /assets/img/2024-06-22-HowtosendmailSMTPwithPowerShell_0.png
tag: Tech
originalTitle: "How to send mail SMTP with PowerShell"
link: "https://medium.com/@devopslite/how-to-send-mail-smtp-with-powershell-b0eba44a59eb"
---


파워셸로 이메일을 SMTP로 보내는 방법은 어떻게 해야 하나요? 오랜 시간 리눅스 사용자인 저에게 윈도우로 돌아오는 것은 새로운 경험이죠.

작업 중에 애플리케이션이 이메일을 보내지 못하는 이유를 알 수 없어 곤란할 때가 종종 있죠. 컴퓨터에서 메일 연결을 테스트하여 제대로 작동하는지 확인하고 싶을 것입니다.

자, 이제 PowerShell을 사용하여 인증된 SMTP로 메일을 보내는 테스트를 해볼 거에요.


# 먼저 SMTP 정보를 가져오세요


<div class="content-ad"></div>

우선, 이메일 SMTP를 테스트하여 메일 서버를 인증하는 계정으로 전송할 것입니다. 따라서 아래와 같은 정보를 얻어야 합니다:

- 사용자 이름: 메일 서버에 로그인하는 데 사용되는 사용자 이름.
- 암호: 메일 서버에 로그인하는 데 사용되는 암호.
- SMTP 서버: 메일 서버의 주소.
- SMTP 포트: 이메일을 전송하는 데 사용할 포트.

예를 들어, 다음과 같이 얻었습니다:

- 사용자 이름: usertest
- 암호: Passtest123
- SMTP 서버: retail.smtp.com (smtp.com을 사용)
- SMTP 포트: 25

<div class="content-ad"></div>

# PowerShell을 사용하여 이메일 SMTP 전송하기

![이미지](/assets/img/2024-06-22-HowtosendmailSMTPwithPowerShell_0.png)

이제 아래 명령어를 실행하기 전에 값을 본인에 맞게 변경해 주세요:

```javascript
$username = 'usertest'
$password = 'Passtest123'
$secpasswd = ConvertTo-SecureString $password -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ($username, $secpasswd)
Send-MailMessage -Credential $mycreds -SmtpServer retail.smtp.com -Port 25 -From usertest@devopslite.com -To ghost@gmail.com -Subject test -Body test
```

<div class="content-ad"></div>

- $username: 이 줄은 사용자 이름을 정의합니다.
- $password: 이 줄은 암호를 정의합니다.
- $secpasswd: 일반 텍스트 암호를 비밀 문자열로 변환하는 함수를 호출합니다.
- $mycreds: 사용자 이름과 비밀 암호로 새 객체를 만들어, Send-MailMessage 명령어에 전달됩니다.
- Send-MailMessage: 이 명령은 주소 usertest@devopslite.com에서 ghost@gmail.com으로 이메일을 보내는 데 사용됩니다. -Subject 및 -Body 옵션을 따라 내용을 변경할 수도 있습니다.

만약 smtp 포트 25를 사용하지 않는다면, 위 명령을 TLS 연결을 사용하는 포트 587을 사용하도록 변경할 수 있습니다.

```js
$username = 'usertest'
$password = 'Passtest123'
$secpasswd = ConvertTo-SecureString $password -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ($username, $secpasswd)
Send-MailMessage -Credential $mycreds -SmtpServer retail.smtp.com -Port 587 -UseSsl -From usertest@devopslite.com -To ghost@gmail.com -Subject test -Body test
```

# 결론

<div class="content-ad"></div>

간단한 명령어 몇 개만 사용하면 Windows에서 PowerShell을 사용하여 SMTP로 이메일을 보낼 수 있어요. 제 데모에서는 Windows 11 OS를 사용하고 있어서 다른 OS에서도 잘 동작할 거예요.

원본 게시물: https://devopslite.com/how-to-send-mail-smtp-with-powershell/