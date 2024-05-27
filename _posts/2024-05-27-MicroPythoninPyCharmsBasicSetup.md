---
title: "마이크로파이썬PyCharms로 시작하기 기본 설정"
description: ""
coverImage: "/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_0.png"
date: 2024-05-27 13:41
ogImage:
  url: /assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_0.png
tag: Tech
originalTitle: "MicroPython in PyCharms: Basic Setup"
link: "https://medium.com/@andymule/micropython-in-pycharms-basic-setup-9169b497ec8a"
---

지난 기사에서는 ESP32에 Python을 설치하고 실행하는 방법을 안내했어요. 하지만 해당 기사는 Thonny를 Python 코드를 마이크로컨트롤러에 작성하는 데 사용할 수 있는 편집기로 소개하며 끝이 났죠. 이는 기초 학습 및 신속하게 시작하는 데에는 훌륭한 도구이지만, 진정한 현대 IDE의 모든 기능을 제공하지는 못합니다. 만약 "진짜" 작업을 수행하고 싶다면 가능한 모든 도움이 필요할 거예요. 이 기사에서는 PyCharm에 대해 알아보도록 할게요. 다음 기사에서는 프로세스를 완전히 자동화하여 놀라운 효율성으로 작업할 수 있도록 할 것이에요.

# JetBrains PyCharm, 파이썬의 최고봉

<img src="/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_0.png" />

JetBrains PyCharm을 소개합니다. 오늘날 파이썬 코딩을 위한 최고의 IDE입니다. 여러분이 전체 잠재력을 발휘할 수 있도록 도와주는 인상적인 기능 범위를 제공합니다. 설정에 큰 부담을 주지 않으면서 최대한의 도움을 받을 수 있어요. (Python 확장 프로그램이 있는 VSCode도 훌륭하지만, 개인적으로는 상당히 초보자 친화적이지 않다고 생각해요.) 여기서 Community 버전을 다운로드하세요. 지금 당장 해보세요.

<div class="content-ad"></div>

# 파이참에 MicroPython 플러그인 설치하기

파이참을 설치하고 열었으면, File`Settings`Plugins`Marketplace로 이동하여 MicroPython을 검색하고 설치하세요.

<img src="/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_1.png" />

# 새로운 프로젝트 시작, Micro으로 설정

<div class="content-ad"></div>

![마이크로파이썬 프로젝트 설정](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_2.png)

설치가 완료되면(파이참을 재시작해야 하는지 확인해야 하나요? 그렇다면 분명히 알려줄거에요), 이제 우리는 마이크로파이썬 프로젝트를 시작할 준비가 되었어요! `파일` - `새 프로젝트`로 이동하여 프로젝트 이름을 마음대로 지어보세요. 저는 멋진 이름 MicroTest를 선택했지만, 실제로는 중요하지 않아요. 즐거운 시간을 가지세요. 이 페이지에서 유일하게 확장 가능한 항목인 프로젝트 인터프리터를 확장하면(아마도) 이전에 설치된 파이썬이 자동으로 감지된 것을 보게 될 거에요. 원하는 건 그것뿐이에요. 그냥 컴퓨터 능력을 찬양하고, 그리고 CREATE를 클릭하세요. 파이썬 프로젝트를 만들었어요!

우리가 아름다운 $3 WiFi 듀얼코어 컴퓨터에서 실행할 수 있게 만들어볼까요. 파이참에서 `파일` - `설정` - `언어 및 프레임워크` - `마이크로파이썬`으로 이동하세요. 마이크로파이썬 지원 활성화를 확인하고, 장치 유형으로 ESP8266을 드롭다운에서 선택하세요. 그리고 정말 멋진 DETECT 버튼을 누르는 게 좋겠죠? 음, 그 결과가 좋지 않아요. 왜냐하면 장치를 감지하기 어려울 겁니다. 시도해보세요, 행운아일지도 몰라요. 그렇지 않으면 기기 관리자를 열어서 포트를 직접 찾아야 해요. 이 작업을 어떻게 하는 지 기억이 나지 않는다면, 지난 글의 "USB에서 보드가 표시되는지 확인하기" 섹션을 참조하세요. Device path란에 COM 및 #을 입력하세요. 제 기기는 COM4에요. Apply 버튼을 누르세요, 그러나 이 창은 열어둬야 해요...

![장치 포트 찾기](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_3.png)

<div class="content-ad"></div>

아직 설정 창에 있습니다. Project: YourName`Project Structure`로 이동합니다. .idea를 마우스 오른쪽 버튼으로 클릭하고 "제외됨"으로 표시하세요. 이 .idea 폴더 안의 파일은 PyCharm을 위한 특정 설정 파일이므로 제외하면 이 파일이 ESP32로 복사되는 것을 방지하게 됩니다. 그렇게 하면 이 파일들이 무용한 공간을 차지하지 않게 됩니다. 그것들에 목적을 부여하고 그대로 두어보세요.

<img src="/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_4.png" />

이제 OK를 누르고 설정 창을 닫을 수 있습니다.

# 프로젝트에 추가하세요, 미친놈 같은^^

<div class="content-ad"></div>

프로젝트 구조를 확인하고 싶다면, 파일 탐색기를 보려면, 아래쪽 왼쪽에 있는 1:Project 버튼을 클릭하거나, Alt + 1을 눌러서 마법 같이 나타나게 합니다. 프로젝트와 동일한 이름을 가진 폴더를 보세요. 제 경우에는 MicroTest입니다. 이 곳에 ESP32에 전송할 파일을 만들어야 합니다. 그러면 시작해보죠.

폴더 이름을 마우스 오른쪽 버튼 클릭하여 New Python File로 이동하세요. 그리고 main.py로 이름 짓기.

<div class="content-ad"></div>

특정 파일이 ESP가 시작될 때마다 자동으로 실행됩니다. 이것은 당신의 주요 큰 소년, 당신의 흔듬, 삼바 파트너, 그리고 2k30 스퀴즈 마스터입니다. 이제 그것을 만드세요. 에디터에서 열기

![이미지](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_7.png)

이제 뭐죠? 필요한 패키지가 있나요? 여기 (언제나) PyCharm이 손을 잡아 주고 미래의 땅으로 안내해줄 것입니다. 그 경고의 오른쪽에 있는 "요구 사항 설치"를 클릭하세요. 에디터 창 하단에서 진행 상황을 확인할 수 있고 팝업 창이 나올 때까지 기다리세요.

![이미지](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_8.png)

<div class="content-ad"></div>

# 프로그램 업로드

![이미지](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_9.png)

이 파일 안에 print(“Hello charming world”)를 넣고 저장해 봅시다. 프로그램이 만들어졌어요. 기기로 어떻게 옮기나요?

왼쪽의 프로젝트 브라우저(숨겨져 있으면 alt+1)에서 main.py 파일을 마우스 오른쪽 버튼으로 클릭하고 'Flash main.py'을 선택하세요.

<div class="content-ad"></div>

`<img src="/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_10.png" />`

장치가 연결되고 업로드되고 부드러운 다시 시작이 출력된 것을 볼 수 있습니다. 프로그램을 디바이스에 넣기만 하면 됩니다!

`<img src="/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_11.png" />`

# 장치에 연결하여 프로그램이 컴퓨터 작업을 수행하는 것을 확인하세요

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_12.png)

PyCharm에서 Tools -> MicroPython -> MicroPython REPL로 이동하십시오. 이렇게 하면 화면 하단에 시리얼 연결이 열립니다. 여기에서 상호 작용하는 것은 실제로 ESP32 내부에서 실행되는 MicroPython입니다. 여기에 내용을 입력하고 실제로 장치에서 작업을 수행하는 것을 볼 수 있습니다. LED가 있다면 GPIO 핀을 알고 있다면 해당 내용을 여기에 입력하고 깜박임을 볼 수 있습니다.

![image](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_13.png)

![image](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_14.png)


<div class="content-ad"></div>

연결된 상태라면 기기에 리셋 버튼이 있다면 지금 눌러보세요. 그러면 부팅 중인 다양한 "쓰레기"가 화면에 나타날 거에요. 이를 '하드 리부트'라고 해요, 잠깐 동안 전원을 끄고 다시 시작하는 것이거든요.

일반적으로 이 정도는 너무 복잡할 수 있어요. 더 가벼우면서 더 빠른 소프트 리부트를 위해 CTRL-D를 누르세요.

이 둘 다에서 화면에 놀라운 온전하게 찍힌 텍스트를 볼 수 있을 거예요. 여보세요, 매력적인 세상!

<div class="content-ad"></div>

# 시리얼 연결에 관한 몇 가지 매우 중요한 참고 사항

- 하이랜더처럼 COM 포트 당 하나의 시리얼 연결만 가능합니다.

이 사실을 기억하는 것이 정말 중요합니다. 마지막 단계 초반처럼 또 다른 MicroPython REPL을 열어보려고 하지 마세요. 임베디드 프로그래밍 생활에서 이런 메시지를 수백만 번이나 보게 될 것입니다:

![이미지](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_16.png)

<div class="content-ad"></div>

이는 거의 항상 다른 장치가 어딘가에 여전히 연결되어 있음을 의미합니다. PyCharm에는 이를 해결하는 훌륭한 기능이 있습니다. 간단히 마우스 오른쪽 버튼을 클릭하고 "모두 닫기"를 선택하면 됩니다. 다시 시도하면 성공적으로 연결될 것입니다. 간단죠!

![이미지](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_17.png)

2. 이 터미널에 문제가 있습니다.

![이미지](/assets/img/2024-05-27-MicroPythoninPyCharmsBasicSetup_18.png)

<div class="content-ad"></div>

아마 이미 보셨을 거에요. 백스페이스 처리를 정말 잘 못하죠. 사실 엄청 잘 처리하고 있긴 한데, 보여지는 건 우리가 이상한 쓰레기를 본답니다 ?[. 짜증나죠, 근데 우리는 여기서 타이핑을 할 기회가 많지 않을 거에요, 그래서 필요할 때 그냥 감수해야 해요.

# 일단 가능하지만 완전히 강화되지는 않음

이것은 사실 마이크로파이썬을 PyCharm에서 설정하는 표준적인 방법이에요. 모든 것을 할 수는 있지만, 아직도 우리가 효율적으로 반복하고 개발할 수 있도록 방해하는 심각한 문제가 있어요. 다음 기사에서는 마이크로파이썬을 오늘 가장 효율적으로 작업할 수 있는 개인 스크립트, 설정, 팁을 보여드릴 거에요. 그리고 모든 COM 포트를 닫는 단추 시스템을 만들고, 모든 파일을 장치로 플래싱하고, 디버깅 출력을 볼 수 있는 콘솔을 열 수 있도록 하는 방법을 안내할 거에요.
