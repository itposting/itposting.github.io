<template>
  <div>
    <h1 id="nextjs-static-html-사이트-배포하는-방법" tabindex="-1">
      <a class="header-anchor" href="#nextjs-static-html-사이트-배포하는-방법" aria-hidden="true">#</a> Nextjs Static HTML 사이트 배포하는 방법
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">💡목표</p>
      <p>웹사이트를 만들다보면 DB를 사용하지 않는 정적 웹 사이트를 만드는 경우가 있는데요. Nextjs를 활용해 정적 웹사이트 배포하는 방법에 대해서 소개합니다. 정적 웹 사이트 배포는 Netlify를 통해서 진행합니다.</p>
    </div>
    <h3 id="scripts-변경" tabindex="-1"><a class="header-anchor" href="#scripts-변경" aria-hidden="true">#</a> scripts 변경</h3>
    <p>Nextjs 저장소의 package.json에 있는 build 명령어를 아래와 같이 바꿔줍니다.</p>
    <div class="language-javascript ext-js line-numbers-mode">
      <pre v-pre class="language-javascript"><code><span class="token string-property property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token string-property property">"build"</span><span class="token operator">:</span> <span class="token string">"next build &amp;&amp; next export"</span>
<span class="token punctuation">}</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <h3 id="build" tabindex="-1"><a class="header-anchor" href="#build" aria-hidden="true">#</a> build</h3>
    <p>아래 명령어로 프로젝트를 빌드해줍니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">yarn</span> build
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h3 id="정적-사이트-출력물" tabindex="-1"><a class="header-anchor" href="#정적-사이트-출력물" aria-hidden="true">#</a> 정적 사이트 출력물</h3>
    <p>next export 명령어로 인해 <code v-pre>out/</code> 디렉토리가 생기고 하위에 아래와 같은 파일들이 생긴 것을 보실 수 있습니다.</p>
    <img width="447" alt="1" src="https://user-images.githubusercontent.com/46010705/203996982-3d261ae7-7a8e-4f65-b09e-0258197ff1a4.png" />
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h3 id="netlify-배포" tabindex="-1"><a class="header-anchor" href="#netlify-배포" aria-hidden="true">#</a> Netlify 배포</h3>
    <p>
      이 out 폴더를 그대로 배포할건데요. 저는 <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Netlify<ExternalLinkIcon /></a>를 이용해서 정적 html 사이트를 배포할겁니다.
    </p>
    <p>사이트를 방문해주시고 로그인 해주시면 아래와 같이 드래그앤드롭으로 폴더를 업로드 할 수 있는 영역이 보이는데요.</p>
    <img width="1194" alt="2" src="https://user-images.githubusercontent.com/46010705/203996990-a09ce2fc-35c6-4283-b6aa-3ab63da1710c.png" />
    <p>업로드를 해줍니다.</p>
    <img width="1188" alt="3" src="https://user-images.githubusercontent.com/46010705/203997008-9247ab72-ab4a-48fd-a856-bd04be6b1296.png" />
    <p>업로드를 완료하면 아래와 같이 static html 사이트가 배포되었는데요. 기본적으로 설정되어있는 사이트 url은 복잡하게 되어있으니 원하는 url로 변경해줍니다!</p>
    <img width="1220" alt="4" src="https://user-images.githubusercontent.com/46010705/203997016-001f68d4-68f5-4956-86a7-817f10587aa1.png" />
    <img width="1261" alt="5" src="https://user-images.githubusercontent.com/46010705/203997171-df283c4d-476f-4221-9d58-8a4269649f34.png" />
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h3 id="사이트-접속" tabindex="-1"><a class="header-anchor" href="#사이트-접속" aria-hidden="true">#</a> 사이트 접속</h3>
    <p>나와있는 url로 접속하면 내가 만든 정적 웹 사이트가 배포된 것을 보실 수 있습니다. Netlify외에도 다양한 정적 웹 사이트 배포 서비스가 많이 있는데요. 앞으로 다른 서비스도 사용해보도록 하겠습니다.</p>
    <img width="500" alt="6" src="https://user-images.githubusercontent.com/46010705/203997438-5566b47c-5bc7-46e1-a8b4-46feb558a925.png" />
    <p>위 사이트는 블로그 포스팅 썸네일을 조금 쉽게 만들 수 있도록 만들고 있는 사이트인데요. 배포를 위해서 구색만 맞춰놨는데 앞으로 조금씩 기능을 추가해보도록 하겠습니다.</p>
  </div>
</template>
