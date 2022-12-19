<template>
  <div>
    <h1 id="html2canvas로-html-요소-캡쳐해서-이미지로-다운로드-받기" tabindex="-1">
      <a class="header-anchor" href="#html2canvas로-html-요소-캡쳐해서-이미지로-다운로드-받기" aria-hidden="true">#</a> html2canvas로 html 요소 캡쳐해서 이미지로 다운로드 받기
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">💡이 포스팅을 읽으면</p>
      <p>html2canvas를 이용해 특정 html 태그를 캡쳐해서 이미지로 다운로드 받을 수 있는 방법에 대해서 알 수 있습니다.</p>
    </div>
    <h2 id="_1-html2canvas-설치" tabindex="-1"><a class="header-anchor" href="#_1-html2canvas-설치" aria-hidden="true">#</a> 1. html2canvas 설치</h2>
    <p>아래 명령어를 입력해서 설치해줍니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">npm</span> i html2canvas
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h3 id="canvas로-변환하는-함수" tabindex="-1"><a class="header-anchor" href="#canvas로-변환하는-함수" aria-hidden="true">#</a> canvas로 변환하는 함수</h3>
    <p>html2canvas 함수의 <strong>첫번째 인자에 캡쳐를 원하는 DOM요소를 넣어줍니다.</strong></p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token keyword">import</span> html2canvas <span class="token keyword">from</span> <span class="token string">"html2canvas"</span><span class="token punctuation">;</span>

<span class="token comment">// canvas로 변환하는 함수</span>
<span class="token keyword">const</span> <span class="token function-variable function">download</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> thumbnail<span class="token operator">:</span> <span class="token builtin">any</span> <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">"#thumbnail"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">/*
    allowTaint : cors 이미지
    useCORS : cors 이미지
    */</span>
  <span class="token function">html2canvas</span><span class="token punctuation">(</span>thumbnail<span class="token punctuation">,</span> <span class="token punctuation">{</span> allowTaint<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> useCORS<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span>canvas<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span>log<span class="token punctuation">;</span>
    <span class="token function">saveAs</span><span class="token punctuation">(</span>canvas<span class="token punctuation">.</span><span class="token function">toDataURL</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"thumbnail_img.jpg"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// document.body.appendChild(canvas);</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
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
      </div>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h3 id="다운로드-받는-함수" tabindex="-1"><a class="header-anchor" href="#다운로드-받는-함수" aria-hidden="true">#</a> 다운로드 받는 함수</h3>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre v-pre class="language-tsx"><code><span class="token comment">// 변환된 canvas를 이미지로 다운로드 받는 함수</span>
<span class="token keyword">const</span> <span class="token function-variable function">saveAs</span> <span class="token operator">=</span> <span class="token punctuation">(</span>uri<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> filename<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> link <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">"a"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> link<span class="token punctuation">.</span>download <span class="token operator">===</span> <span class="token string">"string"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    link<span class="token punctuation">.</span>href <span class="token operator">=</span> uri<span class="token punctuation">;</span>
    link<span class="token punctuation">.</span>download <span class="token operator">=</span> filename<span class="token punctuation">;</span>

    <span class="token comment">//Firefox requires the link to be in the body</span>
    document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>link<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//simulate click</span>
    link<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//remove the link when done</span>
    document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>link<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    window<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span><span class="token punctuation">;</span>
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
    <h2 id="결과-화면" tabindex="-1"><a class="header-anchor" href="#결과-화면" aria-hidden="true">#</a> 결과 화면</h2>
    <p>위와 같이 작성해서 <strong>버튼 클릭 이벤트에 연결하면 아래처럼 다운로드 버튼 클릭시 특정 html요소를 이미지로 만들어 다운로드 받을 수 있습니다.</strong></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <img src="@source/docs/Library/2022-12-09-html2canvas로-html-요소-캡쳐해서-이미지로-다운로드-받기/img/1.gif" width="500" />
    <p>파일의 이름도 지정할 수 있고, 특정 요소르 이미지로 다운로드 받을 수 있으니 다양하게 활용할 수 있을 것 같다.</p>
  </div>
</template>
