<template>
  <div>
    <h1 id="css-말줄임-처리-방법" tabindex="-1"><a class="header-anchor" href="#css-말줄임-처리-방법" aria-hidden="true">#</a> CSS 말줄임 처리 방법</h1>
    <div class="custom-container tip">
      <p class="custom-container-title">목표</p>
      <p>아래 처럼 한줄 말줄임 혹은 여러줄 말줄임을 처리할 수 있습니다.</p>
    </div>
    <img src="@source/docs/CSS/2022-12-06-CSS-말줄임-처리-방법/img/1.png" width="300" />
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_1-한-줄-말줄임" tabindex="-1"><a class="header-anchor" href="#_1-한-줄-말줄임" aria-hidden="true">#</a> 1. 한 줄 말줄임</h2>
    <p>말줄임 처리는 한 줄과 여러줄 말줄임 처리 방식으로 나뉩니다. <strong>한줄 말줄임 처리는 아래 css로 해결할 수 있습니다.</strong></p>
    <div class="language-css ext-css line-numbers-mode">
      <pre v-pre class="language-css"><code><span class="token selector">.ellipsis</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
  <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
  <span class="token property">white-space</span><span class="token punctuation">:</span> nowrap<span class="token punctuation">;</span>
  <span class="token property">text-overflow</span><span class="token punctuation">:</span> ellipsis<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <h3 id="_1-1-한-줄-말줄임-처리-순서" tabindex="-1"><a class="header-anchor" href="#_1-1-한-줄-말줄임-처리-순서" aria-hidden="true">#</a> 1-1. 한 줄 말줄임 처리 순서</h3>
    <ol>
      <li>
        <p>
          <code v-pre>white-space: nowrap;</code> : 텍스트가 부모 요소의 너비를 초과할 경우 기본적으로 개행되는데 <strong>nowrap으로 지정하면 개행되지 않고 한줄로 표시됩니다</strong>. <br />
          <img src="@source/docs/CSS/2022-12-06-CSS-말줄임-처리-방법/img/2.png" width="350" />
        </p>
      </li>
      <li>
        <p>
          <code v-pre>overflow: hidden</code> : 한줄로 노출되는 텍스트를 카드 영역을 넘치지 않도록 추가해줍니다. <br />
          <img src="@source/docs/CSS/2022-12-06-CSS-말줄임-처리-방법/img/3.png" width="300" />
        </p>
      </li>
      <li>
        <p>
          <code v-pre>text-overflow</code> : 텍스트가 넘칠 때 어떻게 처리할 것인가에 대한 속성으로 ellipsis를 추가해주면 한 줄 말줄임 처리가 완성됩니다. <br />
          <img src="@source/docs/CSS/2022-12-06-CSS-말줄임-처리-방법/img/4.png" width="350" />
        </p>
      </li>
    </ol>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_2-여러줄-말줄임" tabindex="-1"><a class="header-anchor" href="#_2-여러줄-말줄임" aria-hidden="true">#</a> 2. 여러줄 말줄임</h2>
    <p>여러줄 말줄임 처리는 아래 css로 적용할 수 있습니다.</p>
    <div class="language-css ext-css line-numbers-mode">
      <pre v-pre class="language-css"><code><span class="token property">display</span><span class="token punctuation">:</span> -webkit-box<span class="token punctuation">;</span>
<span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
<span class="token property">text-overflow</span><span class="token punctuation">:</span> ellipsis<span class="token punctuation">;</span>
<span class="token property">-webkit-line-clamp</span><span class="token punctuation">:</span> 2<span class="token punctuation">;</span> <span class="token comment">/* 말줄임 줄 수 */</span>
<span class="token property">-webkit-box-orient</span><span class="token punctuation">:</span> vertical<span class="token punctuation">;</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
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
    <h3 id="_2-1-여러줄-말줄임-처리-순서" tabindex="-1"><a class="header-anchor" href="#_2-1-여러줄-말줄임-처리-순서" aria-hidden="true">#</a> 2-1. 여러줄 말줄임 처리 순서</h3>
    <ol>
      <li>
        <p>
          <code v-pre>-webkit-line-clamp: 2;</code> : 웹킷 박스의 말줄임 줄 수를 정하는 속성입니다. <br />
          <img src="@source/docs/CSS/2022-12-06-CSS-말줄임-처리-방법/img/5.png" width="350" />
        </p>
      </li>
      <li>
        <p>
          <code v-pre>overflow: hidden</code> : 카드 영역을 넘치지 않도록 추가해줍니다. <br />
          <img src="@source/docs/CSS/2022-12-06-CSS-말줄임-처리-방법/img/6.png" width="300" />
        </p>
      </li>
    </ol>
    <h2 id="마무리" tabindex="-1"><a class="header-anchor" href="#마무리" aria-hidden="true">#</a> 마무리</h2>
    <p>위 속성을 아래처럼 믹스인으로 만들어서 사용하면 더 편리합니다.</p>
    <div class="language-scss ext-scss line-numbers-mode">
      <pre v-pre class="language-scss"><code><span class="token keyword">@mixin</span> <span class="token selector">ellipsis </span><span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
  <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
  <span class="token property">white-space</span><span class="token punctuation">:</span> nowrap<span class="token punctuation">;</span>
  <span class="token property">text-overflow</span><span class="token punctuation">:</span> ellipsis<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">@mixin</span> <span class="token function">multiEllipsis</span><span class="token punctuation">(</span><span class="token variable">$line</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> -webkit-box<span class="token punctuation">;</span>
  <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
  <span class="token property">text-overflow</span><span class="token punctuation">:</span> ellipsis<span class="token punctuation">;</span>
  <span class="token property">-webkit-line-clamp</span><span class="token punctuation">:</span> <span class="token variable">$line</span><span class="token punctuation">;</span>
  <span class="token property">-webkit-box-orient</span><span class="token punctuation">:</span> vertical<span class="token punctuation">;</span>
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
      </div>
    </div>
  </div>
</template>
