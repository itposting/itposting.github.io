<template>
  <div>
    <h1 id="react-hook-useeffect-has-missing-dependencies-해결-방법" tabindex="-1">
      <a class="header-anchor" href="#react-hook-useeffect-has-missing-dependencies-해결-방법" aria-hidden="true">#</a> React Hook useEffect has missing dependencies 해결 방법
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">목표</p>
      <p>React 사용시 무조건 만나게 되는 Warning인 react-hooks/exhaustive-deps warning 해결 방법에 대해서 정리합니다.</p>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p><img src="@source/docs/Nextjs/2022-11-25-React-Hook-useEffect-has-missing-dependencies-해결-방법/img/1.png" alt="" /></p>
    <p>react-hooks/exhaustive-deps는 React 훅을 사용할 때 그 중에서도 useEffect를 사용할 때 주로 발생하는데요.</p>
    <p>보통 이런 식으로 경고 메세지를 띄워줍니다.</p>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre
        v-pre
        class="language-bash"
      ><code>React Hook useEffect has missing dependencies: <span class="token string">''</span> and <span class="token string">''</span><span class="token builtin class-name">.</span> Either include them or remove the dependency array.
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h2 id="해결-방법" tabindex="-1"><a class="header-anchor" href="#해결-방법" aria-hidden="true">#</a> 해결 방법</h2>
    <p>react-hooks/exhaustive-deps 해결 방법은 useEffect에서 사용되는 state를 useEffect의 배열 []에 넣어주면 됩니다.</p>
    <p>예를 들어 아래와 같이 작업이 되어있을 때는 경고메세지가 뜨는데요.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">getThumbnailBg</span><span class="token punctuation">(</span>backgroundKeyword<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <p>useEffect에서 사용중인 State인 <code v-pre>backgroundKeyword</code> 를 <code v-pre>[]</code>에 넣어주게 되면 경고를 발생시키지 않는 것을 확인할 수 있습니다.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">getThumbnailBg</span><span class="token punctuation">(</span>backgroundKeyword<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>backgroundKeyword<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <p>
      정리해보면, useEffect를 사용할 때는 useEffect내에서 사용되는 State를 []에 넣어주면 됩니다. 이런 경고가 발생하는 이유는 useEffect내부에서 사용되는 State의 변경이 감지되었을 때를 대비하기 위함이라고 생각하시면 될 것 같습니다.
    </p>
  </div>
</template>
