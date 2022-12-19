<template><div><h1 id="nextjs에서-svg-사용하는-방법" tabindex="-1"><a class="header-anchor" href="#nextjs에서-svg-사용하는-방법" aria-hidden="true">#</a> Nextjs에서 svg 사용하는 방법</h1>
<div class="custom-container tip"><p class="custom-container-title">목표</p>
<p>create-react-app에서는 기본적으로 svg를 사용할 수 있도록 내장되어있지만
Nextjs에서는 따로 설정을 해주어야하는데요. 그 내용에 대해서 알아봅니다.</p>
</div>
<p>CRA에서는 아래와 같이 코드를 작성하면 svg파일을 불러올 수 있는데요.</p>
<div class="language-tsx ext-tsx line-numbers-mode"><pre v-pre class="language-tsx"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>ReactComponent <span class="token keyword">as</span> Svg<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./button.svg'</span><span class="token punctuation">;</span>
<span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">const</span> <span class="token function-variable function">Component</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Svg</span></span> <span class="token punctuation">/></span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>아쉽게도 Nextjs에서는 따로 설정을 해주어야합니다.</p>
<h2 id="설정방법" tabindex="-1"><a class="header-anchor" href="#설정방법" aria-hidden="true">#</a> 설정방법</h2>
<p>nextjs에서 svg를 사용하기 위해서는 <code v-pre>@svgr/webpack</code> 모듈을 설치해주어야합니다.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>npm i -D @svgr/webpack
yarn add -D @svgr/webpack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>설치를 마쳤다면 next.config.js 파일을 수정해주어야합니다.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token doc-comment comment">/** <span class="token keyword">@type</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">'next'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>NextConfig<span class="token punctuation">}</span></span> */</span>
<span class="token keyword">const</span> nextConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">reactStrictMode</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">swcMinify</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token function-variable function">webpack</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">config</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 아래를 추가합니다.</span>
    config<span class="token punctuation">.</span>module<span class="token punctuation">.</span>rules<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.svg$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">issuer</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.[jt]sx?$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"@svgr/webpack"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> config<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> nextConfig<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>위와 같이 설정을 마치면 아래처럼 Nextjs에서도 svg를 사용할 수 있습니다.</p>
<div class="language-tsx ext-tsx line-numbers-mode"><pre v-pre class="language-tsx"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>ReactComponent <span class="token keyword">as</span> Svg<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./button.svg'</span><span class="token punctuation">;</span>
<span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">const</span> <span class="token function-variable function">Component</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Svg</span></span> <span class="token punctuation">/></span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>
