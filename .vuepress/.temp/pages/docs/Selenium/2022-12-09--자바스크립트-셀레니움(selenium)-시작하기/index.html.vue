<template>
  <div>
    <h1 id="셀레니움-selenium-으로-자동화-프로그램-제작하기-1" tabindex="-1">
      <a class="header-anchor" href="#셀레니움-selenium-으로-자동화-프로그램-제작하기-1" aria-hidden="true">#</a> 셀레니움(selenium)으로 자동화 프로그램 제작하기(1)
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">💡이 포스팅을 읽으면</p>
      <p>셀레니움으로 자동화 프로그램을 제작할 수 있습니다. 이번 글에서는 셀레니움을 실행하는 방법에 대해서 정리하겠습니다.</p>
    </div>
    <p>
      크롤링을 하는 방법에는 다양한 방법이 있지만 실제 유저가 동작하는 것처럼 하기 위해서는 셀레니움(selenium)을 사용해야합니다.
      <strong>셀레니움은 파이썬 자바 자바스크립트 등 다양한 언어로 사용할 수 있지만 자바스크립트로 사용하는 방법에 대해서 공유합니다.</strong>
    </p>
    <h2 id="_1-selenium-webdriver-설치" tabindex="-1"><a class="header-anchor" href="#_1-selenium-webdriver-설치" aria-hidden="true">#</a> 1. selenium-webdriver 설치</h2>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">npm</span> i selenium-webdriver
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h2 id="_2-크롬-실행" tabindex="-1"><a class="header-anchor" href="#_2-크롬-실행" aria-hidden="true">#</a> 2. 크롬 실행</h2>
    <p>크롬 셀레니움을 사용하기 위해선 chromeOption들을 설정해 주어야 합니다.</p>
    <div class="language-javascript ext-js line-numbers-mode">
      <pre
        v-pre
        class="language-javascript"
      ><code><span class="token keyword">const</span> webdriver <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"selenium-webdriver"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> chrome <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"selenium-webdriver/chrome"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> Builder<span class="token punctuation">,</span> By<span class="token punctuation">,</span> Key<span class="token punctuation">,</span> until<span class="token punctuation">,</span> Capabilities <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"selenium-webdriver"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> userAgent <span class="token operator">=</span> <span class="token string">"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">driver</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">forBrowser</span><span class="token punctuation">(</span><span class="token string">"chrome"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">setChromeOptions</span><span class="token punctuation">(</span>
      <span class="token keyword">new</span> <span class="token class-name">chrome<span class="token punctuation">.</span>Options</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--headless"</span><span class="token punctuation">)</span> <span class="token comment">// 백그라운드로 실행</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--disable-gpu"</span><span class="token punctuation">)</span> <span class="token comment">// gpu 비활성화</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--no-sandbox"</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--disable-dev-shm-usage"</span><span class="token punctuation">)</span> <span class="token comment">// 공유 메모리를 사용하지 않겠다는 의미</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"window-size=1280,800"</span><span class="token punctuation">)</span> <span class="token comment">// 윈도우 사이즈 지정</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--disable-blink-features=AutomationControlled"</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">user-agent==</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>userAgent<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// 유저 에이전트를 지정할 수 있음</span>
        <span class="token punctuation">.</span><span class="token function">setUserPreferences</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token string-property property">"download.default_directory"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token comment">// 다운로드할 경우 디폴트 경로를 지정할 수 있음</span>
          <span class="token string-property property">"profile.default_content_setting_values.automatic_downloads"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> driver<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"https://www.naver.com/"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 네이버 홈페이지 열기</span>
<span class="token keyword">await</span> driver<span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000000000</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 타임 슬립</span>
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
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>위에 주석처리해둔 속성들을 보고 필요한 속성을 적용하여 사용할 수 있습니다. 위와 같이 index.js를 작성해서 실행하면 아무런 결과도 나오지 않는데요.</p>
    <p><strong>그 이유는 백그라운드로 실행했기 때문입니다.</strong> 아래 부분을 주석처리하거나 제거하고 실행시켜야합니다.</p>
    <div class="language-javascript ext-js line-numbers-mode">
      <pre
        v-pre
        class="language-javascript"
      ><code><span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--headless"</span><span class="token punctuation">)</span> <span class="token comment">// 백그라운드로 실행</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <img src="@source/docs/Selenium/2022-12-09--자바스크립트-셀레니움(selenium)-시작하기/img/1.png" width="700" />
    <h2 id="_3-셀레니움-파이어폭스-실행" tabindex="-1"><a class="header-anchor" href="#_3-셀레니움-파이어폭스-실행" aria-hidden="true">#</a> 3. 셀레니움 파이어폭스 실행</h2>
    <p>크롬이 아닌 파이어폭스도 실행할 수 있는데요. 셀레니움을 사용하다보면 특정 브라우저에서는 동작하지 않는 경우가 있어서 다른 브라우저도 사용해야할 경우가 발생합니다.</p>
    <p>firefox도 크롬과 동일하게 headless를 통해 백그라운드로 실행 여부를 결정하는데요.</p>
    <p>아래처럼 함수를 만들어두면 필요에 따라 headless를 설정할 수 있습니다.</p>
    <div class="language-javascript ext-js line-numbers-mode">
      <pre
        v-pre
        class="language-javascript"
      ><code><span class="token keyword">const</span> <span class="token function-variable function">firefoxBuild</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">headless <span class="token operator">=</span> <span class="token boolean">true</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>headless<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forBrowser</span><span class="token punctuation">(</span><span class="token string">"firefox"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setFirefoxOptions</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">firefox<span class="token punctuation">.</span>Options</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addArguments</span><span class="token punctuation">(</span><span class="token string">"--headless"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forBrowser</span><span class="token punctuation">(</span><span class="token string">"firefox"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setFirefoxOptions</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">firefox<span class="token punctuation">.</span>Options</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
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
      </div>
    </div>
    <p>이제 셀레니움을 실행해서 브라우저를 키는데 까지 성공했습니다. 셀레니움을 이용하면 클릭, 스크롤, 다운로드 등등 사람이 동작하는 것과 동일하게 동작을 수행할 수 있습니다.</p>
    <p>셀레니움을 활용하면 정말 다양한 동작을 자동화할 수 있는데요.</p>
    <p>다음 글에서는 셀레니움의 기본 명령어들에 대해서 알아보겠습니다.</p>
  </div>
</template>
