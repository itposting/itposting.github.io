---
title: "Working With STL Files On ThreeJSThreeJS에서 STL 파일 다루기제목처럼 ThreeJS에서 STL 파일 작업하기"
description: ""
coverImage: "/assets/img/2024-05-27-WorkingWithSTLFilesOnThreeJS_0.png"
date: 2024-05-27 13:29
ogImage: 
  url: /assets/img/2024-05-27-WorkingWithSTLFilesOnThreeJS_0.png
tag: Tech
originalTitle: "Working With .STL Files On Three.JS"
link: "https://medium.com/@atakandonmez/working-with-stl-files-on-three-js-faf94988493b"
---


![image](/assets/img/2024-05-27-WorkingWithSTLFilesOnThreeJS_0.png)

최근에 Three.js를 사용하여 .stl 파일을 표시할 수 있는 기본 웹 앱을 개발했어요. Three.js에 대한 경험 공유를 시작하기 전에 먼저 소개하려고 해요.

GitHub, Pioneer, Oculus, 심지어 NASA와 같은 거대 회사들이 3D 애니메이션을 만들기 위해 사용하고 있어요. 여기 https://threejs.org/ 에서 확인할 수 있는 멋진 예시들이 많이 있어요.

문서가 라이브러리의 많은 부분을 다루고 있고, 인터넷에도 많은 정보가 공유되어 있지만, 일반적이지 않은 방법을 찾기 어려울 수 있어요. 그래서 개발 과정 중 필요한 것을 찾기 위해 많은 조사를 해야 했어요. 그래서 여기서 일부를 공유하기로 결정했어요. 시작해볼까요?

<div class="content-ad"></div>

## 설치

공식 사이트의 설치 부분을 보면 npm 및 기타 빌드 도구를 사용하거나 CDN을 이용하여 Three.js를 설치할 수 있습니다. 저는 로컬 환경(브라우저를 직접 사용하여 HTML을 표시)에서 모듈 번들러(예: Webpack)를 사용하지 않고 작업했습니다. 그래서 불러오기 지정자(import specifier)를 사용할 수 없었습니다. 그래서 Three.js의 r127 버전 이후로, node_modules에서 모듈을 웹 앱에 로드하는 지원이 제거되었습니다. 대신 import map 방법을 사용하기로 결정했습니다. import map이 무엇인지 모른다면:

다음과 같이 사용됩니다:

```js
// HTML에서 아래 코드 삽입
<script type="importmap">
    {
      "imports": {
        "nameOfImport": "location",
        "nameOfSecondImport": "secondLocation"
        }      
    }
  </script>
```

<div class="content-ad"></div>


다양한 프로젝트에서 이 설치의 예시를 공식 웹사이트에서 찾아볼 수 있어요.

## 로컬 사용

외부 파일에서 텍스처나 객체를 사용하려면 로컬 웹 서버를 사용해야 해요. VSCode를 사용하면 이 목적으로 확장 프로그램을 쉽게 설치할 수 있어요. 그렇지 않으면 Apache와 같은 것을 사용하거나 Python 서버를 설정할 수도 있어요. 외부 파일을 사용할 계획이 없다면 HTML 파일을 더블 클릭한 후 어떠한 문제 없이 작동시킬 수 있어요.

## WebGL

<div class="content-ad"></div>

Three.JS은 WebGL을 사용하기 때문에 귀하의 작업 환경도 이를 지원해야 합니다. 다음 코드로 브라우저와 장치가 해당 기능을 지원하는지 확인할 수 있습니다.

```js
if (WebGL.isWebGLAvailable()) {
    console.log("사용 가능함")
}
```

## 사용법

여기에서 공식 보일러 플레이트로 시작할 수 있습니다.

<div class="content-ad"></div>

상면 , 카메라, 렌더러 및 애니메이션 된 개체가 포함되어 있습니다. 여기서 원하는 방향으로 나아가 카메라나 장면을 조정할 수 있습니다. 커서를 사용하여 대상 개체를 중심으로 회전하려면 프로젝트에 OrbitControls를 추가할 수 있습니다. 이러한 사용된 기능 및 클래스에 대한 자세한 내용은 해당 공식 문서에서 설명됩니다.

## 외부 파일에서 객체 로드

기하 구조를 만드는 대신 .stl 파일을 사용하여 응용 프로그램에 개체를 로드할 것입니다. .stl 파일은 3D 프린터와 함께 일반적으로 사용됩니다. CAD 응용 프로그램 대신 일상적으로 사용하는 브라우저에서 인쇄할 개체를 표시할 수 있습니다. 우리는 우리의 개체를 렌더링 프로세스 이전에 준비할 로더가 필요합니다. 이 문제에 대해 STLLoader를 사용할 것입니다. 다음과 같이 가져올 수 있습니다;

그리고 이렇게 구현할 수 있습니다;

<div class="content-ad"></div>

STL 파일의 경로를 변경해서, ./uploads/screw.stl로 설정하고, 이 loadObject 함수를 처음에 실행되는 init() 함수에 호출해주세요.

그 순간에 화면에서 물체가 렌더링되는 것을 확인할 수 있어야 합니다. 그렇지 않다면 브라우저 콘솔에서 오류를 확인할 수 있습니다.

## GUI

Three.JS에는 사용자 인터페이스를 만들고 해당 인터페이스 요소를 듣는 코드 핸들러를 만들 수 있는 GUI 모듈이 있습니다. 제 예제에서는 세 가지 가능한 축을 기준으로 물체를 회전하고 이동시킬 수 있는 버튼을 추가했습니다.

<div class="content-ad"></div>

“gui”: “./node_modules/three/examples/jsm/libs/lil-gui.module.min.js”

위의 코드는 three 모듈에 포함된 예제 파일에서 찾을 수 있습니다.

내가 작성한 함수는 가져온 모듈을 사용하여 새 GUI를 만들고 각각 다른 구성 객체에 대한 핸들러를 만드는 역할을 합니다. InguiEvents 배열에 이벤트 작업을 추가했습니다. 카메라 보기를 변경하거나 객체 또는 장면의 색상을 변경하거나 안개를 추가하거나 강도를 조절하는 등의 작업을 수행할 수 있습니다. 이 경우에는 내가 결정한 양만큼 그룹을 회전시켰습니다.

여기서 그룹이 필요한 이유는 그룹과 연관되지 않고 메시를 회전시키는 것이 내가 원하는 방식으로 할 수 없었기 때문입니다. 그래서 온라인에서 검색하다가 이러한 해결책을 찾았습니다. GUI를 사용하여 그룹 없이 객체를 회전시키는 다른 방법이 있을 수 있습니다.

<div class="content-ad"></div>

<img src="https://miro.medium.com/v2/resize:fit:1400/1*QT2uHwTmjn9Pb760V3NZlQ.gif" />

## 결론

이것이 Three.JS 애플리케이션에 .stl 객체를로드하는 데 필요한 몇 가지 단계입니다. 제가 언급했듯이 공식 문서에는 포함되지 않은 기능 및 구현이 많아서 발행된 예제에서 해결책을 찾아야 합니다. 이것은 배우고 새로운 것을 시도해 볼만한 멋진 라이브러리입니다. 여유 시간을 내어 시도해보기를 추천합니다.

읽어 주셔서 감사합니다.