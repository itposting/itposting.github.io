---
title: "쉘 트랩과 POSIX 신호 쉽게 이해하기"
description: ""
coverImage: "/assets/img/2024-06-22-ShellTrapsandPOSIXSignals_0.png"
date: 2024-06-22 00:22
ogImage: 
  url: /assets/img/2024-06-22-ShellTrapsandPOSIXSignals_0.png
tag: Tech
originalTitle: "Shell Traps and POSIX Signals"
link: "https://medium.com/@benweidig/shell-traps-and-posix-signals-e2b453c04db6"
---



![Shell traps](/assets/img/2024-06-22-ShellTrapsandPOSIXSignals_0.png)

Shell traps catch POSIX signals (and more) to allow asynchronous inter-process communication to inform any process or particular thread of various events and do some work.

But do you know about all the different signals and ways to use the `trap` command?
