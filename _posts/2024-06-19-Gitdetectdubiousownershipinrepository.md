---
title: "깃에서 의심스러운 소유권을 감지하기"
description: ""
coverImage: "/assets/img/2024-06-19-Gitdetectdubiousownershipinrepository_0.png"
date: 2024-06-19 09:13
ogImage: 
  url: /assets/img/2024-06-19-Gitdetectdubiousownershipinrepository_0.png
tag: Tech
originalTitle: "Git detect dubious ownership in repository"
link: "https://medium.com/@thecodinganalyst/git-detect-dubious-ownership-in-repository-e7f33037a8f"
---


<img src="/assets/img/2024-06-19-Gitdetectdubiousownershipinrepository_0.png" />

회사 환경에서 작업할 때, 우리는 일반적으로 각 인증된 사용자마다 컴퓨터에서 지정된 사용자 공간을 갖습니다. 예를 들어, Windows에서 우리의 사용자 이름이 abc이면, C:\Users 폴더에 abc라는 이름의 폴더가 있습니다. 즉, 모든 사용자 abc의 파일을 위한 C:\Users\abc 폴더가 있습니다. 그리고 이 폴더에 git 리포지토리를 넣으면, git status와 같은 git 작업을 수행할 때 다음과 같은 오류 메시지가 나올 수 있습니다.

```js
fatal: detected dubious ownership in repository at 'C:/Users/abc/Projects/my-awesome-project'
'C:/Users/abc/Projects/my-awesome-project' is owned by:
        'S-1-5-32-544'
but the current user is:
        'S-1-12-1-1347659835-1128888854-2982737882-1111120199'
To add an exception for this directory, call:
        git config --global --add safe.directory C:/Users/abc/Projects/my-awesome-project
```

오류 메시지에 해결책이 내장되어 있어서 좋지만, 이게 무슨 뜻이며 왜 발생하는 걸까요? 그리고 사용자 이름에 있는 모든 숫자들은 무엇을 의미할까요?

<div class="content-ad"></div>

먼저, 오류 메시지의 원인은 현재 사용자가 git 리포지토리 폴더의 소유자인지 확인하고, 현재 사용자가 소유자가 아닌 경우 위와 같은 오류 메시지를 생성합니다. 이는 git이 .git 폴더로 직접 이동하여 여기서 일부 파일을 실행하기 때문에 발생합니다. 예를 들어 C:\Users\abc\Projects\my-awesome-project\.git입니다. 이는 폴더가 현재 사용자에 의해 소유되지 않으면 보안 위험이 발생할 수 있고 다른 사람으로부터 악성 파일이 여기에 배치될 수 있어 컴퓨터를 실행할 때 위험을 초래할 수 있습니다. 이는 https://github.com/git-for-windows/git/security/advisories/GHSA-gf48-x3vr-j5c3에서 설명되어 있으며, 해당 확인을 추가한 커밋은 https://github.com/git/git/commit/8959555cee7ec045958f9b6dd62e541affb7e7d9에서 확인할 수 있으며, git for windows v2.35.2 이상에서 사용할 수 있습니다.

따라서 우리의 경우 C:\Users\abc 폴더는 시스템에 의해 생성되었으며 현재 사용자 S-1-12-1-1347659835-1128888854-2982737882-1111120199의 소유자가 아니라 S-1-5-32-544가 소유합니다. 따라서 오류 메시지가 표시됩니다.

git이 제공한 해결책은 현재 폴더를 safe.directory 전역 변수에 추가하여 git이 해당 폴더를 안전한 것으로 간주하도록하는 것입니다. 따라서 해결책은 git config --global --add safe.directory C:/Users/abc/Projects/my-awesome-project입니다. 참고로 윈도우 환경에서도 백슬래시 \ 대신 슬래시 / 를 사용해야 합니다. 그런 다음 git config --global --list를 실행할 때 변수를 볼 수 있어야 합니다. safe directory는 멀티-value 변수이므로 필요한 모든 폴더 리포지토리를 추가할 수 있습니다.

사용자 이름에 있는 숫자에 대해 알아봅시다. 이들은 사실 SID로, 사용자 계정의 ID와 같은 역할을 합니다. SID에 대한 자세한 정보는 https://www.techtarget.com/searchsecurity/definition/security-identifier에서 확인할 수 있습니다. 현재 사용자의 SID는 whoami /user 명령을 실행하여 얻을 수 있습니다. 출력물은 다음과 같이 표시됩니다.

<div class="content-ad"></div>


사용자 정보
----------------
사용자 이름  SID
========= ====================================================
ads\abc    S-1-12-1-1347659835-1128888854-2982737882-1111120199


그럼 S-1-5-32-544는 누구일까요? 이것은 잘 알려진 SID로 내장 관리자 그룹을 참조한다고 합니다. 또한 Microsoft 사이트에도 게시되어 있습니다.

이것으로 설명이 되었기를 바랍니다! 계속해서 궁금증을 품어보세요!
