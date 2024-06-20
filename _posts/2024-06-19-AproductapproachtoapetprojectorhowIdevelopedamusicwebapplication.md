---
title: "애완동물 프로젝트에 적용한 제품 접근 방식, 또는 음악 웹 애플리케이션 개발 이야기"
description: ""
coverImage: "/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_0.png"
date: 2024-06-19 02:36
ogImage: 
  url: /assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_0.png
tag: Tech
originalTitle: "A product approach to a pet project, or how I developed a music web application"
link: "https://medium.com/@iamandreyburov/a-product-approach-to-a-pet-project-or-how-i-developed-a-music-web-application-2565cc64d8d6"
---


<img src="/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_0.png" />

음악을 좋아하고 개발을 결합하면 무엇이 일어날까요? 제 경우에는 음악 스트리밍 웹 애플리케이션을 만들기 위한 펫 프로젝트로 이어졌습니다. 저는 "Nexway"에서 프론트엔드 개발자로 일하는 Andrey입니다. 이제 펫 프로젝트 개발에 대한 효율적인 학습 방법을 설명하겠습니다.

모든 기술을 업무를 통해 습득할 수 없다는 사실은 명확합니다. 이때 펫 프로젝트가 유용하게 활용됩니다. 펫 프로젝트를 통해 새로운 것을 시도할 수 있을 뿐만 아니라 아이디어와 기술을 제한 없이 실험할 수 있는 기회를 제공합니다.

펫 프로젝트를 실험실 연습이 아닌 미래 제품으로 본다면, 전체 개발 주기를 더 잘 이해할 수 있습니다. 이 접근 방식으로 먼저 고객의 역할을 맡아 문제를 해결하는 방법과 가장 좋은 방법을 결정하고, 원하는 기술을 구현하는 데 가장 용이한 기술을 선택하는 방법을 생각할 수 있습니다.

<div class="content-ad"></div>

제품 접근 방식은 개발 프로세스를 작은 단위로 바라볼 수 있게 해줍니다. 직접 우선 순위를 정하고 작업이 어디에서 비롯되었는지 이해하는 데 도움이 됩니다. 아키텍처를 어떻게 구축할지와 새로운 기능을 추가하기 쉽게 만들기 위해 어떤 기술 스택을 선택할지에 대해 질문을 시작합니다 (응용 프로그램이 성장할수록 새로운 기능을 추가하려는 욕구도 커진다고 고려합니다).

이제 제 애왽 프로젝트 개발에 대해 이 방법을 사용하여 얻은 경험에 대해 이야기하겠습니다.

프로젝트 소개

저는 Spotify, Apple Music 등 음악 스트리밍 애플리케이션에서 영감을 받아 이 프로젝트를 시작하기로 결심했습니다. 브라우저의 기능을 활용하여 음악 파일을 사용하기를 원했기 때문에 음악 주제가 가까웠고 zaycev.net의 나만의 버전을 만들고 싶었습니다.

<div class="content-ad"></div>

이 시점에서는 고객이 있는 것처럼 프로젝트 요구 사항을 구체화하는 것이 중요합니다 (실제로는 본인이어도 좋습니다). 요구 사항은 업무 계획을 작성하고 자신이 관심 있는 기능을 구현하는 데 집중할 수 있도록 도와줍니다. 이렇게 하면 프로젝트를 완료하기 위한 자신에 대한 약속을 만들 수 있습니다.

펫 프로젝트를 제품 프로토 타입으로 살펴보고 있기 때문에 이를 사용할 수 있는 사람들에 대해 고민하는 것이 좋습니다. 애플리케이션의 잠재적 사용자는 누구나 일 수 있고, 사용자 커뮤니티가 공통 음악 라이브러리를 확대할 수 있도록 할 예정입니다. 또한 응용 프로그램은 인디 아티스트들을 대상으로 하며, 새로운 청취자를 발견하고 광고를 무료로 진행할 수 있는 기회를 제공할 것입니다.

아래에는 프로젝트에 대해 개요를 작성한 요구 사항들이 있습니다:

<div class="content-ad"></div>

친화적인 톤으로 번역해보겠습니다.

사용성:

- 직접 UI 컴포넌트 라이브러리(UI 킷)를 사용하여 인터페이스를 구현하십시오.
- 볼륨 조절, 재생, 이전 또는 다음 트랙으로 전환하는 버튼 및 일시 정지 기능이 있는 기능적 플레이어를 구현하십시오.
- 언어 전환 및 어두운/밝은 테마로 사용자의 기호에 맞게 인터페이스를 사용자 정의할 수 있는 기능을 추가하십시오.

기술적 요구사항:

- Web Audio API를 기반으로 구현된 자체 음악 플레이어를 사용하여 음악 트랙 및 라디오를 재생하십시오.
- 사용자가 등록할 때 "인간"임을 확인하기 위해 확인 코드가 포함된 이메일을 보내는 방식으로 등록을 검증하십시오.
- CI/CD를 설정하여 초기 사용자가 기능이 추가될 때 즉시 새로운 기능을 볼 수 있도록 하십시오.

<div class="content-ad"></div>

사용자 중심:

- 전 세계의 라디오 방송을들을 수 있게 합니다.
- 사용자 커뮤니티에게 음악 라이브러리를 확장할 수 있는 기회를 제공합니다.
- 소셜 미디어 및 메신저 앱에서 애플리케이션을 공유할 수 있는 기능 추가
- 아티스트, 제목, 라디오 이름, 국가, 장르로 음악을 검색할 수 있는 자동완성 제안 기능 제공
- 사용자가 선호하는 음악과 라디오 방송 추가 가능
- 사용자가 음악 트랙을 컴퓨터로 다운로드할 수 있는 기능 추가
- 이메일로 리셋 코드를 보내 비밀번호를 재설정할 수 있는 기능 제공

아키텍처 설계

컨셉을 설명하고 요구 사항을 수집한 후, 미래 응용 프로그램의 아키텍처를 설명합니다. 제 경우에는 다음과 같습니다:

<div class="content-ad"></div>


![Web Application](/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_2.png)

기술 스택 선택

프론트엔드: 어플리케이션의 클라이언트 측 구현을 위해 가장 익숙한 기술 스택을 선택했습니다 — React, Redux Tool Kit, Typescript, Webpack.

그 후에는 실험을 하기로 결정하고 Webpack 대신 Vite를 사용하기로 했습니다. HMR을 통해 개발 속도가 향상되고, 빌드 구성을 몇 분 안에 작성할 수 있다는 점이 이유입니다. 다국어 처리를 위해 i18next를 사용했고, 스타일 작업에는 SCSS를 선택했습니다. Tailwind도 고려했지만, 어플리케이션의 일반 디자인 시스템을 설명하고자 했기 때문에 전역 변수와 중첩 작업이 편리했기 때문에 SCSS를 선택했습니다.


<div class="content-ad"></div>

UI 킷: 컴포넌트 라이브러리의 경우, 나는 Storybook, React, Typescript, SCSS, Webpack까지만 진행하기로 결정했습니다. 라이브러리를 개발해본 경험이 없었기 때문에 빌더의 선택이 중요했는데, Webpack에서 많은 자료와 코드 예제를 찾을 수 있었습니다.

백엔드: 여기서는 Express.js와 Nest.js 사이에서 오랫동않 고민했습니다. Nest.js에서는 객체 지향적인 접근 방식을 좋아했고, Express.js에서는 간단한 서버를 빠르게 작성할 수 있는 능력과 이미 약간의 경험을 가지고 있었습니다. 결과적으로 Express.js에서 결정하기로 했습니다. 또한 이전에 작업해 본 적이 없었던 클라우드가 트랙을 저장하는 데 필요할 것이라는 것도 분명했습니다. 작은 검색 결과, 클라우드와 쉽게 상호 작용할 수 있게 해주는 라이브러리를 발견했습니다. 인증에는 세션+쿠키 접근 방식을 사용하기로 결정했습니다. 파일 처리에는 multer를 사용했는데, 문서의 명확성과 클라우드로 전송하기 전에 파일을 메모리에 저장할 수 있는 기능이 마음에 들었습니다. 클라이언트와 서버 간의 통신은 REST API를 통해 이루어져야 했습니다.

기술적 설계 디자인

인터페이스 컴포넌트와 데이터베이스 테이블의 상호 작용을 설명합니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_3.png)

![이미지](/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_4.png)

사용자 디자인 설계

안타깝게도 UX/UI 디자인에 대해 얕은 지식만 가지고 있어서 처음부터 사용자 인터페이스를 만들 수 없었습니다. 그래서 인터넷에서 적절한 준비된 디자인을 찾아 구현했습니다.

<div class="content-ad"></div>

기능 구현

이 섹션에서는 애플리케이션을 배포하는 모든 단계를 자세히 설명하고 싶지는 않습니다. 대신, 흥미로운 기능을 더 자세히 설명하겠습니다. 동시에 초보자들에게 더욱 유용하고 완전한 기사를 만들기 위해 프로젝트의 소스 코드 저장소 링크를 뒤에 첨부했습니다.

예를 들어 Sequelize 트랜잭션을 사용하여 클라우드에 트랙을 업로드하는 Express 컨트롤러의 구현 방법은 다음과 같습니다. 먼저 클라우드 업로드 서비스를 호출한 다음 데이터베이스 쓰기 서비스를 호출하고 변경 사항을 저장하도록 합니다. 오류 발생 시 모든 변경 사항이 롤백되어 데이터가 일관되게 유지되며 작업이 원자적으로 수행됩니다.

```js
tracksController.post(
   '/uploadTrack',
   authChecker,
   upload.fields([
       { name: 'cover', maxCount: 1 },
       { name: 'track', maxCount: 1 }
   ]),
   async (req, res, next) => {
       const t = await sequelize.transaction()
       try {
           const { trackName, artist } = req.body

           const cover = req.files?.cover[0]?.buffer
           const track = req.files?.track[0]?.buffer

           const { img, mp3 } = await cloudService.upload({
               track,
               cover
           })
           await tracksService.addTrack({
               artist,
               trackName,
               img,
               mp3,
               moderated: false
           })
           await t.commit()
           res.sendStatus(200)
       } catch (e) {
           await t.rollback()
           next(e)
       }
   }
)
```

<div class="content-ad"></div>

```js
const s3 = new S3({
   auth: {
       accessKeyId: process.env.ACCESS_KEY_ID,
       secretAccessKey: process.env.SECRET_ACCESS_KEY
   },
   Bucket: 'nirvana-tracks',
   debug: false
})

async function upload({ track, cover }) {
   try {
       let mp3 = await s3.Upload(
           {
               buffer: track
           },
           '/mp3/'
       )
       let img = await s3.Upload(
           {
               buffer: cover
           },
           '/img/'
       )
       if (mp3 && track) {
           return { img: img.Location, mp3: mp3.Location }
       } else {
           throw new Error('업로드할 수 없습니다.')
       }
   } catch (e) {
       console.error(e)
       throw e
   }
}

module.exports = {
   upload
}
```

라디오 브라우저 라이브러리를 외부 API로부터 더 독립적으로 만들기 위해 집합 요청을 수행하여 라이브러리의 모든 라디오 스테이션에 대한 단일 요청을 만들어 데이터베이스를 시드로 채웠습니다. 여기에서도 커버 링크가 유효한지 확인했습니다.

```js
const RadioBrowser = require('radio-browser')
const { v4: uuidv4 } = require('uuid')
const checkImage = require('../../web/utils/checkImage')

module.exports = {
   async up(queryInterface, Sequelize) {
       const radios = await RadioBrowser.getStations({ limit: 100 })
       const radiosWithUsefulFields = await Promise.all(
           radios.map(async el => {
               return {
                   id: uuidv4(),
                   name: el.name,
                   url: el.url,
                   votes: el.votes,
                   country: el.country,
                   favicon: (await checkImage(el.favicon)) ? el.favicon : '',
                   tags: el.tags,
                   lastcheckoktime: el.lastcheckoktime
               }
           })
       )
       await queryInterface.bulkInsert('Radios', radiosWithUsefulFields, {})
   },

   async down(queryInterface, Sequelize) {
       await queryInterface.bulkDelete('Radios', null, {})
   }
}
```

```js
async function checkImage(url) {
   return fetch(url)
       .then(response => {
           if (response.ok) {
               return true
           } else {
               return false
           }
       })
       .catch(error => {
           return false
       })
}

module.exports = checkImage
```

<div class="content-ad"></div>

내가 커스텀 플레이어의 구현 방법을 설명해 줄게. 기본적으로 useRef를 사용해서 오디오 요소에 대한 참조를 가져와 웹 오디오 API에 액세스했어. 그런 다음 오디오 API에서 가져온 데이터를 React 상태와 연결해서 리렌더링을 트리거하도록 했어. 이 접근법으로 기능을 확장하기 시작했고, 트랙 전환, 드래그 앤 드롭 되감기, 볼륨 제어, 일시 정지 등을 구현했어.

```js
return (
       <>
           <audio
               src={currentTrack?.url}
               ref={audioElem as LegacyRef<HTMLAudioElement>}
               onTimeUpdate={() => {
                   onPlaying({
                       audioElem:
                           audioElem as MutableRefObject<HTMLAudioElement>,
                       setCurrentTrack,
                       currentTrack
                   })
               }
           />
```

트랙 선택 시 자동으로 트랙을 시작하는 커스텀 훅 구현 예제야.

```js
import { useLayoutEffect } from 'react'


import { usePlayOnMountArgs } from './types'


export function usePlayOnMount({
   tracks,
   setCurrentTrack,
   position,
   audioElem,
   setIsPlaying
}: usePlayOnMountArgs) {
   useLayoutEffect(() => {
       setCurrentTrack(tracks[position])
       const timeoutId = setTimeout(() => {
           audioElem?.current?.play()
           setIsPlaying(true)
       }, 500)
       return () => {
           clearTimeout(timeoutId)
       }
   }, [tracks, position])
}
```

<div class="content-ad"></div>

사용자가 노래를 들으며 더 몰입할 수 있도록 레이아웃을 약간 보완하기로 했어요. 그리고 어플리케이션의 이름(Nirvana)이 정당하다는 느낌을 주도록 했어요.

이를 위해, 플레이어의 배경에 트랙 커버의 색상으로 흐릿한 안개를 만들었는데, 해당 안개가 반짝거리도록 했어요. 그리고 어떤 이유로 인해 커버가 없는 경우에는 어플리케이션의 색상으로 안개를 만들었어요. 이런 효과를 이런 식으로 구현했어요:

```js
<div
	className={styles.playerBg}
	style={{
		backgroundImage:
			currentTrack.img && `url(${currentTrack.img})`
	}}
></div>
```

```js
@import '../../constants/colors.scss';

.playerBg {
	z-index: 0;
	height: 20%;
	width: 120vw;
	opacity: 0.85;
	position: fixed;
	bottom: -5%;
	left: -5vw;
	background-image: linear-gradient(
		90deg,
		rgba(243, 243, 243, 1) 0%,
		rgba(94, 233, 191, 1) 19%,
		rgba(47, 105, 255, 1) 54%,
		rgba(99, 96, 255, 1) 82%,
		rgba(161, 106, 232, 1) 100%
	);
	filter: blur(30px);
	background-repeat: no-repeat;
	background-size: 300% 300%;
	animation: AnimateBG 100s ease-in-out infinite;
}

@keyframes AnimateBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_5.png" />

CI/CD

어플리케이션에 대한 자동화된 테스트가 없었습니다. 대신에 프로젝트 링크를 모든 친구들과 지인들에게 보내어 피드백을 받고 버그를 발견하는 데 도움을 받았습니다. 이 프로세스를 가속화하기 위해 GitHub Actions를 사용한 간단한 CI 파이프라인을 작성하기로 결정했습니다.

```js
name: onPush
run-name: Actions on push
on: [push]
jobs:
   init:
       runs-on: ubuntu-latest
       strategy:
           matrix:
               node-version: [21.x]
       steps:
           - uses: actions/checkout@v3
           - name: Staring Node.js ${matrix.node-version}
             uses: actions/setup-node@v3
             with:
                 node-version: ${matrix.node-version}
           - name: install modules
             run: npm install
           - name: install prettier
             run: npm install --global prettier
           - name: formatting code
             run: prettier . -w
           - name: build project
             run: npm run build
```

<div class="content-ad"></div>

Render에 배포하기로 결정했어요. 거기서 데이터베이스, 백엔드, 그리고 클라이언트를 쉽게 배포할 수 있고 Render가 GitHub 저장소에서 변경 사항도 가져온다는 점이 마음에 들었어요.

내가 마주한 어려움

주요 어려움은 저작권 문제에서 생겼어요. 라디오 섹션을 관리자만 이용할 수 있게 만들어야 했고, 업로드된 트랙은 관리자가 확인한 후에만 일반 피드에 추가되도록 해야 했어요 (지금은 데이터베이스를 통해서만 확인할 수 있어요).

가끔씩 재생과 일시정지를 자주 바꿀 때 브라우저 API가 "play() 요청이 pause() 호출에 의해 중단되었습니다"라는 오류를 던지는 이유도 완전히 명확하지는 않았어요. 그러나 나는 커스텀 debounce 훅과 lodash의 해당 함수를 사용하여 이 문제를 해결할 수 있었어요. 아래는 이 문제에 대한 내 해결책이에요.

<div class="content-ad"></div>

```js
import { useEffect } from 'react'
import { useDebounceOnPlayPauseArgs } from './types'


export function useDebounceOnPlayPause({
   audioElem,
   isPlaying
}: useDebounceOnPlayPauseArgs) {
   useEffect(() => {
       const timeoutId = setTimeout(() => {
           if (isPlaying) {
               audioElem?.current?.play()
           } else {
               audioElem?.current?.pause()
           }
       }, 500)
       return () => {
           clearTimeout(timeoutId)
       }
   }, [isPlaying])
}
```

그리고 모바일 적응에 많은 시간을 들였으며 UI를 과다하게 로드하지 않기 위해 일부 기능을 포기해야 했습니다. 어느 시점에서 최소한의 버튼을 사용하고 터치에 집중하기로 결정했습니다. 예를 들어, 트랙 목록을 스와이프로 스크롤하거나 캐러셀과 상호 작용할 수 있습니다. 저는 react-swipeable을 사용하여 이를 구현했습니다. 프로젝트 작업의 마지막 단계에서는 친구, 프론트엔드 및 노드.js 백엔드 개발자에게 코드 검토를 요청하여 일부 수정을 하였습니다. 새로운 관점을 통해 논리를 더 잘 분해할 수 있었습니다. 배포 후 친구들이 버그를 지적하고 UX를 개선하기 위한 조언을 해주었습니다.

프로젝트의 현재 상태는 어떻습니까?

이 프로젝트는 Lighthouse에 따르면 꽤 양호한 성능 지표를 보여줍니다.

<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-AproductapproachtoapetprojectorhowIdevelopedamusicwebapplication_6.png" />

소스 코드는 GitHub를 통해 공개되어 있어 관심 있는 누구든지 확인할 수 있습니다.

https://github.com/ABurov30/nirvana-ui
https://github.com/ABurov30/nirvana-client
https://github.com/ABurov30/nirvana-server

UI 킷은 npm에 발행되었습니다.


<div class="content-ad"></div>

https://www.npmjs.com/package/nirvana-uikit

결론 도출

이 이른바 펫 프로젝트 덕분에 고객과 실행자 모두의 역할을 맡아 제품 접근 방식을 적용하고, 독립적으로 애플리케이션 개발 프로세스를 처음부터 구축했습니다. 기술 스택을 결정하는 방법을 배우고, 클라우드와 Web Audio API를 활용했으며, 자체 UI 라이브러리를 개발하고 새로운 기술을 시도해 보았습니다.

앞으로는 이 프로젝트를 기반으로 새로운 기술을 도입하여 애플리케이션에 기능을 추가해 보려고 합니다. 예를 들어, 세 가지 프로젝트로 마이크로 프론트엔드를 만들어 보려고 합니다:

<div class="content-ad"></div>

리액트, Vite, Redux로 만든 주요 Nirvana 음악 애플리케이션

Next.js로 만든 애플리케이션의 주요 프로모션 페이지

Vue, Socket.io, Graph Ql을 사용하여 만든 애플리케이션 내의 채팅 (jotai나 zustand와 같이 명확하지 않은 상태 관리자를 사용할 수도 있어요).

그리고 사용자가 업로드한 콘텐츠를 수동으로 확인하는 것은 상당히 어려우므로 저작권 자동 유효성 검사를 추가하고 싶어요, 이 과정을 자동화하고 싶어요.