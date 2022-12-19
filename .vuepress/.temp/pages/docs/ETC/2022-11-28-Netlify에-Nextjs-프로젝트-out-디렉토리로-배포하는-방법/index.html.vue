<template><div><h1 id="netlify에-nextjs-프로젝트-배포하는-두-가지-방법-next-out" tabindex="-1"><a class="header-anchor" href="#netlify에-nextjs-프로젝트-배포하는-두-가지-방법-next-out" aria-hidden="true">#</a> Netlify에 Nextjs 프로젝트 배포하는 두 가지 방법 (.next , out)</h1>
<p>Nextjs 프로젝트는 두가지 형식의 사이트로 사용되는데요.
첫번째는 <code v-pre>.next</code> 디렉토리의 일반적인 Nextjs 프로젝트
두번째는 <code v-pre>out</code> 디렉토리로 생성되는 정적 HTML 웹사이트입니다.</p>
<p>이 포스팅에서는 각 방식에 따라 Netlify build configuration 설정 방법과 에러 해결 방법에 대해서 정리합니다.</p>
<h2 id="_1-정적-웹-사이트-out-경로-배포" tabindex="-1"><a class="header-anchor" href="#_1-정적-웹-사이트-out-경로-배포" aria-hidden="true">#</a> 1. 정적 웹 사이트 (out) 경로 배포</h2>
<p>Netlify를 통해서 Nextjs를 배포할 때는 위 두가지 중 어떤 것으로 배포하냐에 따라 빌드 설정이 달라지게 됩니다.
빌드 설정을 잘못하게 되면 아래와 같은 에러가 발생합니다.</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/1.png" alt=""></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token number">12</span>:48:25 PM:   Error message
<span class="token number">12</span>:48:25 PM:   Error: Detected that <span class="token string">"next export"</span> was run, but site is incorrectly publishing the <span class="token string">".next"</span> directory.
<span class="token number">12</span>:48:25 PM:   The publish directory should be <span class="token builtin class-name">set</span> to <span class="token string">"out"</span>, and you should <span class="token builtin class-name">set</span> the environment variable NETLIFY_NEXT_PLUGIN_SKIP to <span class="token string">"true"</span><span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>위 에러는 <code v-pre>next export</code> 명령어를 통해 static 웹사이트를 만들었는데 netlify의 publish directory가 <code v-pre>.next</code> 로 되어있어서 발생한 오류인데요.</p>
<p>publish directory를 정적 웹사이트가 있는 <code v-pre>out</code>으로 수정해주고 <code v-pre>NETLIFY_NEXT_PLUGIN_SKIP</code> 를 true로 바꾸어주어야합니다.</p>
<p>정적웹사이트를 배포하는 과정에서는 Netlify에서 Nextjs 플러그인을 빌드할 필요가 없기 때문에 skip에 true를 넣어주는 것이죠.<a href="https://docs.netlify.com/integrations/frameworks/#next-js" target="_blank" rel="noopener noreferrer">참고<ExternalLinkIcon/></a></p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/2.png" alt=""></p>
<p>netlify의 환경변수에서 <code v-pre>NETLIFY_NEXT_PLUGIN_SKIP</code>를 살펴보면 아래와 같이 설명되어있습니다. 이 값을 true로 변경하면 next.js 런타임을 사용하지 않는 것이고 next export를 이용해서 static html를 생성한다고 나와있습니다.</p>
<p>:::
NETLIFY_NEXT_PLUGIN_SKIP: when set to true for a Next.js site, the build doesn’t use the Next.js Runtime. Use this variable with projects that generate static HTML using next export.
:::</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/3.png" alt=""></p>
<h3 id="netlify-환경변수-추가방법" tabindex="-1"><a class="header-anchor" href="#netlify-환경변수-추가방법" aria-hidden="true">#</a> Netlify 환경변수 추가방법</h3>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/4.png" alt=""></p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/7.png" alt=""></p>
<p>위와 같이 환경변수를 추가해줍니다. <strong>소문자 true로 작성해야합니다</strong></p>
<h3 id="publish-directory-변경" tabindex="-1"><a class="header-anchor" href="#publish-directory-변경" aria-hidden="true">#</a> publish directory 변경</h3>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/6.png" alt=""></p>
<p>위와 같이 publish directory를 <code v-pre>out</code>으로 변경해줍니다.</p>
<h3 id="build-명령어-수정" tabindex="-1"><a class="header-anchor" href="#build-명령어-수정" aria-hidden="true">#</a> build 명령어 수정</h3>
<p>static HTML 사이트를 배포할 것이기 때문에 저장소 build 명령어를 아래와 같이 수정해야합니다.</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"next build &amp;&amp; next export"</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="git-push" tabindex="-1"><a class="header-anchor" href="#git-push" aria-hidden="true">#</a> git push</h3>
<p>위와 같이 설정을 다 마쳤다면 git push 를 통해 원격 저장소에 푸시해줍니다.</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-Nextjs-프로젝트-out-디렉토리로-배포하는-방법/img/8.png" alt=""></p>
<p>이제 정상적으로 published된 것을 확인하실 수 있습니다.</p>
<p>위와 같이 진행했는데도 계속 실패가 발생한다면 환경변수 설정을 파일 기반 설정으로 변경해보시기 바랍니다.</p>
<h2 id="_2-next-경로-배포" tabindex="-1"><a class="header-anchor" href="#_2-next-경로-배포" aria-hidden="true">#</a> 2. .next 경로 배포</h2>
<p><code v-pre>.next</code> 경로는 out에서 추가했던 환경변수를 제거하고 빌드 명령어도 <code v-pre>next build</code>로 수정한 후에 원격 저장소에 푸시하면 정상적으로 배포되는 것을 확인하실 수 있습니다.</p>
</div></template>
