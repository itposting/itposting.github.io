<template><div><h1 id="image-set-속성으로-반응형-background-image-사용하기" tabindex="-1"><a class="header-anchor" href="#image-set-속성으로-반응형-background-image-사용하기" aria-hidden="true">#</a> image-set 속성으로 반응형 background-image 사용하기</h1>
<div class="custom-container tip"><p class="custom-container-title">목표</p>
<p><code v-pre>image-set</code> 속성을 사용해서 아래와 같이 브라우저 및 디바이스마다 다른 이미지를 적용하는 방법에 대해 알 수 있습니다.</p>
</div>
<img src="https://user-images.githubusercontent.com/46010705/199180122-3b69bb91-75b2-4b7e-9f62-ac80bde4a81b.gif" width="700">
<hr>
<h2 id="_1-srcset" tabindex="-1"><a class="header-anchor" href="#_1-srcset" aria-hidden="true">#</a> 1. srcset</h2>
<p><code v-pre>image-set</code> 속성에 대해서 소개해 드리기 전에 기존에 자주 사용하는 <code v-pre>srcset</code> 대해서 간략히 설명하고 넘어가도록 하겠습니다.</p>
<p>코드 작성을 하다 보면 아래와 같이 이미지를 사용하는 경우가 많이 있는데요.</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./img/large-landscape_2048x1365.jpeg<span class="token punctuation">"</span></span> <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>2048<span class="token punctuation">"</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>1365<span class="token punctuation">"</span></span> <span class="token attr-name">alt</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">img</span> <span class="token punctuation">{</span>
  <span class="token property">max-width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>코드를 위와 같이 작성하면 브라우저에서 아래와 같이 보입니다.</p>
<img src="https://user-images.githubusercontent.com/46010705/199177264-f4e1c114-740c-49a1-b357-4ad8987acc16.png" width="500">
<p>고해상도의 이미지를 사용하는 것은 큰 브라우저에서는 의미가 있지만 아래처럼 핸드폰 화면에서도 엄청나게 큰 사이즈의 이미지 파일을 보여주는 것은 낭비가 됩니다.</p>
<img src="https://user-images.githubusercontent.com/46010705/199177660-777e3efa-a51a-48c8-b96b-de45bc07a6a2.JPG" width="500">
<p>핸드폰 화면같이 작은 경우에서는 상대적으로 작은 이미지를 보여주더라도 문제가 없습니다.</p>
<h3 id="사용-방법" tabindex="-1"><a class="header-anchor" href="#사용-방법" aria-hidden="true">#</a> 사용 방법</h3>
<p>이러한 개념으로 나오게 된 <code v-pre>srcset</code>은 아래와 같이 사용하고 있습니다.
w(너비)가 750 이하인 경우에는 작은 사진을 보여주도록 작성한 코드입니다.</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./img/large-landscape_2048x1365.jpeg<span class="token punctuation">"</span></span> <span class="token attr-name">srcset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./img/small-landscape_799x533.jpeg 750w, ./img/large-landscape_2048x1365.jpeg 2048w<span class="token punctuation">"</span></span> <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>2048<span class="token punctuation">"</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>1536<span class="token punctuation">"</span></span> <span class="token attr-name">alt</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="결과" tabindex="-1"><a class="header-anchor" href="#결과" aria-hidden="true">#</a> 결과</h3>
<p>잘 동작하는지는 브라우저에서 확인해 보겠습니다.</p>
<img src="https://user-images.githubusercontent.com/46010705/199180122-3b69bb91-75b2-4b7e-9f62-ac80bde4a81b.gif" width="700">
<p>너비에 따라서 명시한 이미지 소스대로 보이는 것을 볼 수 있습니다.</p>
<blockquote>
<p>여기서는 확인을 위해서 small, large에 서로 비율이 다른 이미지를 사용했지만,<br> <code v-pre>srcset</code> 속성은 비율이 같고 다양한 사이즈의 크기를 갖는 이미지들을 사용하고 싶을 때 적합한 속성이고 만약 비율이 다른 이미지를 사용하고 싶다면 <code v-pre>@media</code> 미디어쿼리를 사용하는 것이 적합합니다.</p>
</blockquote>
<p>추가로, 크롬 브라우저에서 테스트 시 아래 gif처럼 브라우저 사이즈 조건을 만족하는 상황에서 새로고침을 해도 <code v-pre>srcset</code>이 적용이 안되는 경우가 있는데요.</p>
<img src="https://user-images.githubusercontent.com/46010705/199181357-b59f14e0-ec15-4b8d-be5f-6f853879acfb.gif" width="700">
<p>이것은 크롬브라우저의 이미지 캐시에 의해서 발생하는 이슈로 개발자도구 옵션의 Network 탭에서 'Disable cache' 를 활성화해주면 정상적으로 동작하는 것을 확인하실 수 있습니다.</p>
<img src="https://user-images.githubusercontent.com/46010705/199181626-07917403-e6e3-45cb-9bfc-4747199200e2.png" width="700">
<h2 id="_2-image-set" tabindex="-1"><a class="header-anchor" href="#_2-image-set" aria-hidden="true">#</a> 2. image-set</h2>
<p><code v-pre>image-set</code> 속성은 <code v-pre>srcset</code> 속성과 같은 목적이고 사용법도 거의 동일합니다.<br> 다만 img태그에 사용하는지 <code v-pre>background-image</code>에 사용하는지에 따라 다를 뿐 입니다.</p>
<h3 id="사용방법" tabindex="-1"><a class="header-anchor" href="#사용방법" aria-hidden="true">#</a> 사용방법</h3>
<p><strong>As-is</strong></p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/large-landscape_2048x1365.jpeg"</span><span class="token punctuation">)</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>To-be</strong></p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">image-set</span><span class="token punctuation">(</span><span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/large-landscape_2048x1365.jpeg"</span><span class="token punctuation">)</span></span> 1x<span class="token punctuation">,</span> <span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/small-landscape_799x533.jpeg"</span><span class="token punctuation">)</span></span> 2x<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>크롬 브라우저에서는 <code v-pre>-webkit-</code> prefix를 붙혀야 정상 동작합니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">-webkit-image-set</span><span class="token punctuation">(</span><span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/large-landscape_2048x1365.jpeg"</span><span class="token punctuation">)</span></span> 1x<span class="token punctuation">,</span> <span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/small-landscape_799x533.jpeg"</span><span class="token punctuation">)</span></span> 2x<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">image-set</span><span class="token punctuation">(</span><span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/large-landscape_2048x1365.jpeg"</span><span class="token punctuation">)</span></span> 1x<span class="token punctuation">,</span> <span class="token url"><span class="token function">url</span><span class="token punctuation">(</span><span class="token string url">"./img/small-landscape_799x533.jpeg"</span><span class="token punctuation">)</span></span> 2x<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="결과-1" tabindex="-1"><a class="header-anchor" href="#결과-1" aria-hidden="true">#</a> 결과</h3>
<p>브라우저에서 테스트해보면 아래 gif처럼 PC인 경우에 large이미지가 MW인 경우에는 small 이미지가 적용되는 것을 보실 수 있습니다.</p>
<img src="https://user-images.githubusercontent.com/46010705/199197725-c52d111e-6815-4393-bf47-b3c3619d4ac1.gif" width="700">
<p>모바일 기기에서도 small 이미지가 정상적으로 적용됩니다.</p>
<img src="https://user-images.githubusercontent.com/46010705/199198274-2dfba72a-ae23-434a-803d-107ebe7da8d9.JPG" width="500">
<h2 id="지원범위" tabindex="-1"><a class="header-anchor" href="#지원범위" aria-hidden="true">#</a> 지원범위</h2>
<img src="https://user-images.githubusercontent.com/46010705/199199878-dc0221d9-5c04-430e-bc0d-30cce82b23c3.png" width="700">
<ul>
<li>
<p>IE는 지원하지 않고 다른 최신 브라우저에서도 완벽히 동작하지는 않기 때문에 사용에 제약은 있을 것으로 보입니다.</p>
</li>
<li>
<p><code v-pre>image-set</code>은 <code v-pre>srcset</code>과 달리 'x' 단위만 사용 가능하고 'w', 'h' 단위는 지원 예정입니다. <a href="https://drafts.csswg.org/css-images-4/#issue-372ac642" target="_blank" rel="noopener noreferrer">MDN<ExternalLinkIcon/></a></p>
</li>
</ul>
<h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>작업할 때 보통 기획에 따라서 img를 사용할지 <code v-pre>background-image</code>를 사용할지 결정이 되는 경우가 많은데요. <br> img 요소 속성들과 <code v-pre>background-image</code>의 값들이 기능적으로 공통되는 부분이 많아지면 UI개발을 함에 있어서 작업 방식을 선택할 때 보다 수월해지지 않을까 하는 생각이 들었습니다.</p>
</div></template>
