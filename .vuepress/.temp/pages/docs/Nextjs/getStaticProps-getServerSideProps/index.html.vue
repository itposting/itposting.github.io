<template>
  <div>
    <h1 id="getstaticprops-getserversideprops-적절한-사용-방법" tabindex="-1">
      <a class="header-anchor" href="#getstaticprops-getserversideprops-적절한-사용-방법" aria-hidden="true">#</a> getStaticProps, getServersideProps 적절한 사용 방법
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">목표</p>
      <p>getStaticProps, getServerSideProps, getStaticPaths를 각각 어느 상황에 사용해야하는지 정리해보려고 합니다.</p>
    </div>
    <p>세가지 시나리오에 따라서 적절한 상황에 맞추어서 사용할 수 있습니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_1-외부-데이터가-필요-없는-경우" tabindex="-1"><a class="header-anchor" href="#_1-외부-데이터가-필요-없는-경우" aria-hidden="true">#</a> 1. 외부 데이터가 필요 없는 경우</h2>
    <p>가장 기본적인 경우로, 외부 데이터가 필요 없는 경우라면 아래와 같이 <strong>getStaticProps, getServerSideProps, getStaticPaths를 사용하지 않고 컴포넌트를 구성할 수 있다.</strong></p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token keyword">function</span> <span class="token function">Test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">Test</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Test<span class="token punctuation">;</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <h2 id="_2-페이지-내용이-외부-데이터에-의존하는-경우" tabindex="-1">
      <a class="header-anchor" href="#_2-페이지-내용이-외부-데이터에-의존하는-경우" aria-hidden="true">#</a> 2. 페이지 내용이 외부 데이터에 의존하는 경우
    </h2>
    <p>이런 경우는 보통 블로그와 같은 페이지에서 사용됩니다.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token comment">// Blog컴포넌트는 posts라는 데이터를 API 요청을 통해서 얻어와야합니다.</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">Blog</span><span class="token punctuation">(</span><span class="token punctuation">{</span> posts <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span>posts<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>post<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token punctuation">{</span>post<span class="token punctuation">.</span>title<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>
      <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
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
      </div>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>
      위와 같이 <strong>렌더링 되기 전에 API요청으로 원하는 데이터(posts)를 불러와야하는 경우에 <code v-pre>getStaticProps</code> 를 사용합니다.</strong>
    </p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">Blog</span><span class="token punctuation">(</span><span class="token punctuation">{</span> posts <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Render posts...</span>
<span class="token punctuation">}</span>

<span class="token comment">// 이 함수는 빌드시에 한번만 호출됩니다.</span>
<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">getStaticProps</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 내부에 원하는 API 요청을 작성합니다.</span>
  <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">"https://.../posts"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> posts <span class="token operator">=</span> <span class="token keyword">await</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// return 을 통해서 Blog 컴포넌트에 원하는 posts props를 내려줄 수 있습니다.</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      posts<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
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
    <h2 id="_3-페이지-경로가-외부-데이터에-의존하는-경우" tabindex="-1">
      <a class="header-anchor" href="#_3-페이지-경로가-외부-데이터에-의존하는-경우" aria-hidden="true">#</a> 3. 페이지 경로가 외부 데이터에 의존하는 경우
    </h2>
    <p>
      세번째로는 페이지의 경로(path)가 외부 데이터에 의존하는 경우인데요. 예를 들어 블로그 포스트들을 API요청을 통해 불러오고 해당 블로그 포스팅 id로 path를 결정해야하는 경우에 아래와 같이 <code v-pre>getStaticPaths</code>를
      사용합니다.
    </p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token comment">// 이 함수는 페이지 빌드시에 호출됩니다.</span>
<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">getStaticPaths</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 내부에 외부 API를 호출합니다.</span>
  <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">"https://.../posts"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> posts <span class="token operator">=</span> <span class="token keyword">await</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 받아온 posts를 통해서 paths를 만들어 줍니다.</span>
  <span class="token keyword">const</span> paths <span class="token operator">=</span> posts<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>post<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
    params<span class="token operator">:</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> post<span class="token punctuation">.</span>id <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// return 값으로 paths를 내려줌으로써 paths값을 결정할 수 있습니다.</span>
  <span class="token comment">// { fallback: false } 은 paths 값에 없는 나머지 경로들은 404처리를 하겠다는 의미입니다.</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span> paths<span class="token punctuation">,</span> fallback<span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
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
      </div>
    </div>
    <p>그리고 아래와 같이 <code v-pre>getStaticPaths</code>와 <code v-pre>getStaticProps</code>를 같은 컴포넌트에서 사용할 수 있는데요.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">Post</span><span class="token punctuation">(</span><span class="token punctuation">{</span> post <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Render post...</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">getStaticPaths</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>component</span> <span class="token attr-name">is</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>script<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686<span class="token punctuation">"</span></span> <span class="token attr-name">crossorigin</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>anonymous<span class="token punctuation">"</span></span> <span class="token attr-name">async</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>component</span><span class="token punctuation">></span></span>

<span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> ui<span class="token operator">-</span>log 수평형 <span class="token operator">--</span><span class="token operator">></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ins</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>adsbygoogle<span class="token punctuation">"</span></span>
     <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value css language-css"><span class="token property">display</span><span class="token punctuation">:</span>block</span><span class="token punctuation">"</span></span></span>
     <span class="token attr-name">data-ad-client</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ca-pub-4877378276818686<span class="token punctuation">"</span></span>
     <span class="token attr-name">data-ad-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>9743150776<span class="token punctuation">"</span></span>
     <span class="token attr-name">data-ad-format</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>auto<span class="token punctuation">"</span></span>
     <span class="token attr-name">data-full-width-responsive</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ins</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>component</span> <span class="token attr-name">is</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>script<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token plain-text">
(adsbygoogle = window.adsbygoogle || []).push(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token plain-text">);
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>component</span><span class="token punctuation">></span></span>

<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">getStaticProps</span><span class="token punctuation">(</span><span class="token punctuation">{</span> params <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// params에는 post의 id를 포함하고 있기 때문에 아래와 같이 포스트 정보를 요청 받을 수 있습니다.</span>
  <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">https://.../posts/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>params<span class="token punctuation">.</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> post <span class="token operator">=</span> <span class="token keyword">await</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// post 정보를 props를 통해서 내려줍니다.</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span> props<span class="token operator">:</span> <span class="token punctuation">{</span> post <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
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
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <p>위와 같은 시나리오의 경우들은 아래와 같은 페이지들에서 유용하게 사용될 수 있습니다.</p>
    <ul>
      <li>마케팅 및 랜딩 홍보 페이지</li>
      <li>블로그 페이지 및 Docs 페이지와 같은 문서를 담은 페이지</li>
      <li>이커머스 마켓 상품 페이지들</li>
    </ul>
    <h2 id="getserversideprops" tabindex="-1"><a class="header-anchor" href="#getserversideprops" aria-hidden="true">#</a> getServerSideProps</h2>
    <p>server-side rendering의 경우는 static generation과 다르게 html을 매 요청마다 생성하는데요.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">Page</span><span class="token punctuation">(</span><span class="token punctuation">{</span> data <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Render data...</span>
<span class="token punctuation">}</span>

<span class="token comment">// This gets called on every request</span>
<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">getServerSideProps</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Fetch data from external API</span>
  <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">https://.../data</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token keyword">await</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Pass data to the page via props</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span> props<span class="token operator">:</span> <span class="token punctuation">{</span> data <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
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
      </div>
    </div>
    <p>사용방법은 위와 같이 기존 Static 함수들과 동일합니다. 차이점은 아래와 같습니다.</p>
    <p>::: static : 빌드시에 한번만 호출 server-side : request를 할 때마다 호출함. :::</p>
    <p>
      위와 같은 차이점이 있기 때문에 상황에 맞게 사용해야합니다. 데이터의 업데이트가 자주 발생하는 페이지의 경우에는 <code v-pre>getServerSideProps</code>를 사용하고 위에서 말한 것처럼 문서, 블로그, 상품 페이지와 같이 데이터의
      변경이 잦지 않은 페이지에서는 <code v-pre>getStaticProps</code>를 사용하는 것이 효율적입니다.
    </p>
    <p>
      Nextjs 13.x 의 공식문서에서는 Static Generation을 추천하고 있는데 그 이유는 성능상으로도 Static Generation가 높기 때문입니다. 필요에 의해서 <code v-pre>getServerSideProps</code>를 사용할지 말지는 개발자의 선택이 필요할 것
      같습니다.
    </p>
  </div>
</template>
