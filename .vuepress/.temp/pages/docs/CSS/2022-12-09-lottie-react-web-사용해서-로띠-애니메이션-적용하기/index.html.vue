<template>
  <div>
    <h1 id="lottie-react-web-사용해서-로띠-애니메이션-적용하기" tabindex="-1">
      <a class="header-anchor" href="#lottie-react-web-사용해서-로띠-애니메이션-적용하기" aria-hidden="true">#</a> lottie-react-web 사용해서 로띠 애니메이션 적용하기
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">💡이 포스팅을 읽으면</p>
      <p>리액트 프로젝트에 lottie-react-web를 이용해 아래와 같은 로띠 애니메이션을 쉽게 적용할 수 있습니다.</p>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <img src="@source/docs/CSS/2022-12-09-lottie-react-web-사용해서-로띠-애니메이션-적용하기/img/1.gif" width="500" />
    <h2 id="로띠-lottie-란" tabindex="-1"><a class="header-anchor" href="#로띠-lottie-란" aria-hidden="true">#</a> 로띠(lottie)란?</h2>
    <p><strong>웹 개발을 할 때 애니메이션을 적용하는 방식에는 여러가지가 있는데요.</strong></p>
    <ol>
      <li>동영상</li>
      <li>gif</li>
      <li>svg</li>
      <li>lottie</li>
    </ol>
    <p>그 중에서 성능면에서도 좋고 요즘 많이 사용하고 있는 로띠를 이용해 애니메이션을 적용해보려고 합니다.</p>
    <p>리액트 프로젝트에 손쉽게 적용할 수 있답니다.</p>
    <h2 id="_1-lottie-react-web-설치" tabindex="-1"><a class="header-anchor" href="#_1-lottie-react-web-설치" aria-hidden="true">#</a> 1. lottie-react-web 설치</h2>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>먼저 lottie-react-web를 설치해줍니다.</p>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">add</span> lottie-react-web
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h2 id="_2-lottie-react-web-적용" tabindex="-1"><a class="header-anchor" href="#_2-lottie-react-web-적용" aria-hidden="true">#</a> 2. lottie-react-web 적용</h2>
    <p>적용하는 방법은 굉장히 간단합니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token punctuation">{</span><span class="token operator">...</span> 중략<span class="token punctuation">}</span>

<span class="token keyword">import</span> Lottie <span class="token keyword">from</span> <span class="token string">"lottie-react-web"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> IconChick <span class="token keyword">from</span> <span class="token string">"./assets/chick.json"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> lottieOptions <span class="token operator">=</span> <span class="token punctuation">{</span>
  loop<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 반복재생</span>
  autoplay<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 자동재생</span>
  animationData<span class="token operator">:</span> IconChick<span class="token punctuation">,</span> <span class="token comment">// 로띠 파일</span>
  rendererSettings<span class="token operator">:</span> <span class="token punctuation">{</span>
    preserveAspectRatio<span class="token operator">:</span> <span class="token string">"xMidYMid slice"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Lottie</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Lottie</span></span> <span class="token attr-name">options</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>lottieOptions<span class="token punctuation">}</span></span> <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token number">200</span><span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token number">200</span><span class="token punctuation">}</span></span> <span class="token attr-name">isStopped</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token boolean">false</span><span class="token punctuation">}</span></span> <span class="token attr-name">ariaLabel</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token string">""</span><span class="token punctuation">}</span></span> <span class="token attr-name">ariaRole</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token string">"img"</span><span class="token punctuation">}</span></span> <span class="token punctuation">/></span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <p><strong>위와 같이 작성하면 이렇게 모이를 쪼는 병아리 애니메이션을 적용할 수 있습니다.</strong></p>
    <img src="@source/docs/CSS/2022-12-09-lottie-react-web-사용해서-로띠-애니메이션-적용하기/img/1.gif" width="500" />
    <p>위 코드처럼 lottieOptions를 따로 만들어서 반복되게 할 것인가 브라우저 접근시 자동 재생되게 할 것인가를 지정할 수 있습니다.</p>
    <p>또한 <code v-pre>&lt;Lottie /&gt;</code> 컴포넌트를 통해 width, height를 지정할 수 있는데요. 로띠의 장점은 svg처럼 사이즈를 키우더라도 깨지지 않는다는 장점이 있습니다.</p>
    <p>
      로띠 파일은 디자이너가 제작해서 주는 경우가 많기 때문에 연습용으로 테스트를 해보고 싶으시다면 테스트용 파일을 받을 수 있는
      <a href="https://lottiefiles.com/kr" target="_blank" rel="noopener noreferrer">LottieFiles<ExternalLinkIcon /></a> 에서 다운로드 받아서 사용해보시면 됩니다.
    </p>
  </div>
</template>
