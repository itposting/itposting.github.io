<template>
  <div>
    <h1 id="nextjs-zustand-text-content-does-not-match-server-rendered-html-에러-해결-방법-react-hydration-error" tabindex="-1">
      <a class="header-anchor" href="#nextjs-zustand-text-content-does-not-match-server-rendered-html-에러-해결-방법-react-hydration-error" aria-hidden="true">#</a> Nextjs + Zustand, &quot;Text content does not match
      server-rendered HTML.&quot; 에러 해결 방법 (React Hydration Error)
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">목표</p>
      <p>Nextjs와 Zustand를 같이 사용할 때 아래와 같은 에러가 발생할 때 해결할 수 있습니다. &quot;Text content does not match server-rendered HTML.&quot;</p>
    </div>
    <p><img src="@source/docs/Nextjs/zustand-react-hydration-error/img/1.png" alt="1" /></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_1-persist-제거" tabindex="-1"><a class="header-anchor" href="#_1-persist-제거" aria-hidden="true">#</a> 1. Persist 제거</h2>
    <p>기본적으로 zustand로 store를 만든다면 아래와 같이 만들 수 있는데요.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">"react"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> create <span class="token keyword">from</span> <span class="token string">"zustand"</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> devtools<span class="token punctuation">,</span> persist <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zustand/middleware"</span><span class="token punctuation">;</span>

<span class="token keyword">interface</span> <span class="token class-name">CountState</span> <span class="token punctuation">{</span>
  count<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  <span class="token function-variable function">increase</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
  <span class="token function-variable function">decrease</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> useCountStore <span class="token operator">=</span> <span class="token generic-function"><span class="token function">create</span><span class="token generic class-name"><span class="token operator">&lt;</span>CountState<span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>
  <span class="token function">devtools</span><span class="token punctuation">(</span>
    <span class="token function">persist</span><span class="token punctuation">(</span>
      <span class="token punctuation">(</span>set<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
        count<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
        <span class="token function-variable function">increase</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token function-variable function">decrease</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">-</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        name<span class="token operator">:</span> <span class="token string">"bear-storage"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> useCountStore<span class="token punctuation">;</span>
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
      </div>
    </div>
    <p>위 코드에서 persist를 제거해주면 &quot;Text content does not match server-rendered HTML.&quot; 에러가 더이상 발생하지 않는 것을 보실 수 있습니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">"react"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> create <span class="token keyword">from</span> <span class="token string">"zustand"</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> devtools<span class="token punctuation">,</span> persist <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zustand/middleware"</span><span class="token punctuation">;</span>

<span class="token keyword">interface</span> <span class="token class-name">CountState</span> <span class="token punctuation">{</span>
  count<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  <span class="token function-variable function">increase</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
  <span class="token function-variable function">decrease</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> useCountStore <span class="token operator">=</span> <span class="token generic-function"><span class="token function">create</span><span class="token generic class-name"><span class="token operator">&lt;</span>CountState<span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>
  <span class="token function">devtools</span><span class="token punctuation">(</span>
      <span class="token punctuation">(</span>set<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
        count<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
        <span class="token function-variable function">increase</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token function-variable function">decrease</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">-</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> useCountStore<span class="token punctuation">;</span>

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
      </div>
    </div>
    <h2 id="_2-persist-name-변경" tabindex="-1"><a class="header-anchor" href="#_2-persist-name-변경" aria-hidden="true">#</a> 2. Persist name 변경</h2>
    <p>persist에 대해서 더 깊게 공부해보지는 않았지만, persist의 name을 변경해주는 것 만으로도 React Hydration Error 에러가 발생하지 않았는데요.</p>
    <p>이 부분에 대한 이유는 Zustand를 더 공부해서 추가하도록 하겠습니다.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">"react"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> create <span class="token keyword">from</span> <span class="token string">"zustand"</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> devtools<span class="token punctuation">,</span> persist <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zustand/middleware"</span><span class="token punctuation">;</span>

<span class="token keyword">interface</span> <span class="token class-name">CountState</span> <span class="token punctuation">{</span>
  count<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  <span class="token function-variable function">increase</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
  <span class="token function-variable function">decrease</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> useCountStore <span class="token operator">=</span> <span class="token generic-function"><span class="token function">create</span><span class="token generic class-name"><span class="token operator">&lt;</span>CountState<span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>
  <span class="token function">devtools</span><span class="token punctuation">(</span>
    <span class="token function">persist</span><span class="token punctuation">(</span>
      <span class="token punctuation">(</span>set<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
        count<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
        <span class="token function-variable function">increase</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token function-variable function">decrease</span><span class="token operator">:</span> <span class="token punctuation">(</span>by<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">-</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        name<span class="token operator">:</span> <span class="token string">"test"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> useCountStore<span class="token punctuation">;</span>
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
      </div>
    </div>
  </div>
</template>
