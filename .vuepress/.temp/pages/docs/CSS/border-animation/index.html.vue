<template><div><h1 id="linear-gradient를-활용한-여러가지-border-애니메이션-5가지" tabindex="-1"><a class="header-anchor" href="#linear-gradient를-활용한-여러가지-border-애니메이션-5가지" aria-hidden="true">#</a> linear-gradient를 활용한 여러가지 border 애니메이션 5가지</h1>
<div class="custom-container tip"><p class="custom-container-title">목표</p>
<p><code v-pre>linear-gradient</code>, <code v-pre>conic-gradient</code>,<code v-pre>hue-rotate</code> 등을 활용해 아래 5가지 border 애니메이션을 만드는 방법에 대해서 공유합니다.
단순 코드 공유가 아닌 결과물을 보고 애니메이션을 만들어가는 과정을 담아보려고 합니다.</p>
</div>
<p><strong>1. 길이가 변하는 border 애니메이션</strong>
<img src="@source/docs/CSS/border-animation/img/double_border.gif" alt="2">
<strong>2. 움직이는 점선 border 애니메이션</strong>
<img src="@source/docs/CSS/border-animation/img/dotted_box.gif" alt="1">
<strong>3. 무지개 border 애니메이션</strong>
<img src="@source/docs/CSS/border-animation/img/rotated_rainbow_box.gif" alt="3">
<strong>4. 빛나는 border 애니메이션</strong>
<img src="@source/docs/CSS/border-animation/img/rotated_conic_box.gif" alt="4">
<strong>5. 색깔이 변하는 border 애니메이션</strong>
<img src="@source/docs/CSS/border-animation/img/hue_box.gif" alt="5"></p>
<hr>
<h2 id="_1-길이가-변하는-border-애니메이션" tabindex="-1"><a class="header-anchor" href="#_1-길이가-변하는-border-애니메이션" aria-hidden="true">#</a> 1. 길이가 변하는 border 애니메이션</h2>
<p><img src="@source/docs/CSS/border-animation/img/double_border.gif" alt="2">
첫 번째로 만들어볼 것은 마우스 오버 시 border 길이가 변하는 박스인데요.
좌측 상단과 우측 하단의 선의 길이가 변하는 것처럼 보이지만
아래 박스처럼 좌측 상단과 우측 하단의 사각형이 커졌다 작아졌다 하는 구조로 만들 수 있습니다.
<img src="@source/docs/CSS/border-animation/img/double_box_real.gif" alt="6"></p>
<p>여기서 적절한 위치의 border만 사용하면 원하는 결과를 얻을 수 있을 것 같습니다.
그리고 좌상단, 우하단 두 개의 사각형만 추가로 필요하므로 <code v-pre>::after</code>, <code v-pre>::before</code> 가상 요소만 사용하여 깔끔하게 작업할 수 있을 것 같습니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.double_box</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #0f0<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>

  <span class="token selector">&amp;::before,
  &amp;::after</span> <span class="token punctuation">{</span>
    <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">""</span><span class="token punctuation">;</span>
    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">transition</span><span class="token punctuation">:</span> 0.2s ease-in-out<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token selector">&amp;::before</span> <span class="token punctuation">{</span>
    <span class="token property">top</span><span class="token punctuation">:</span> -5px<span class="token punctuation">;</span>
    <span class="token property">left</span><span class="token punctuation">:</span> -5px<span class="token punctuation">;</span>
    <span class="token property">border-top</span><span class="token punctuation">:</span> 1px solid #0f0<span class="token punctuation">;</span>
    <span class="token property">border-left</span><span class="token punctuation">:</span> 1px solid #0f0<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token selector">&amp;::after</span> <span class="token punctuation">{</span>
    <span class="token property">right</span><span class="token punctuation">:</span> -5px<span class="token punctuation">;</span>
    <span class="token property">bottom</span><span class="token punctuation">:</span> -5px<span class="token punctuation">;</span>
    <span class="token property">border-bottom</span><span class="token punctuation">:</span> 1px solid #0f0<span class="token punctuation">;</span>
    <span class="token property">border-right</span><span class="token punctuation">:</span> 1px solid #0f0<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token selector">&amp;:hover::before,
  &amp;:hover::after</span> <span class="token punctuation">{</span>
    <span class="token property">width</span><span class="token punctuation">:</span> <span class="token function">calc</span><span class="token punctuation">(</span>100% + 9px<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> <span class="token function">calc</span><span class="token punctuation">(</span>100% + 9px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="결과" tabindex="-1"><a class="header-anchor" href="#결과" aria-hidden="true">#</a> 결과</h3>
<p><code v-pre>::before</code>, <code v-pre>::after</code> 가상 요소의 border와 사이즈를 변경해서 아래와 같은 길이가 변하는 border 애니메이션을 구현할 수 있습니다.</p>
<iframe height="307.078125" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/13akstjq/embed/yLEgPNe?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/13akstjq/pen/yLEgPNe">
  Untitled</a> by 13akstjq (<a href="https://codepen.io/13akstjq">@13akstjq</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
<h2 id="_2-움직이는-점선-애니메이션" tabindex="-1"><a class="header-anchor" href="#_2-움직이는-점선-애니메이션" aria-hidden="true">#</a> 2. 움직이는 점선 애니메이션</h2>
<p><img src="@source/docs/CSS/border-animation/img/dotted_box.gif" alt="1"></p>
<p>두 번째로 만들어볼 것은 움직이는 점선 애니메이션인데요.
우선 점선 박스를 만들기 위해 border 속성 값인 dotted를 사용해 보겠습니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token property">border</span><span class="token punctuation">:</span> 1px dotted #333<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/dotted-box.png" alt="1"></p>
<p>하지만 border는 따로 animation을 제공하지 않기 때문에 움직이는 점선 애니메이션을 만들 수 없습니다.
그렇기 때문에 다른 방법으로 점선을 구현해야 합니다. 점선은 <code v-pre>linear-gradient</code> 로 아래와 같이 구현할 수 있습니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.dotted_box</span> <span class="token punctuation">{</span>
  <span class="token property">background</span><span class="token punctuation">:</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>90deg<span class="token punctuation">,</span> #333 50%<span class="token punctuation">,</span> transparent 50%<span class="token punctuation">)</span> 0 0 / 4px 1px repeat-x<span class="token punctuation">,</span> <span class="token comment">/* 상 */</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>90deg<span class="token punctuation">,</span> #333 50%<span class="token punctuation">,</span> transparent 50%<span class="token punctuation">)</span> 0 100% / 4px 1px repeat-x<span class="token punctuation">,</span>
    <span class="token comment">/* 하 */</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>0<span class="token punctuation">,</span> #333 50%<span class="token punctuation">,</span> transparent 50%<span class="token punctuation">)</span> 0 0 / 1px 4px repeat-y<span class="token punctuation">,</span> <span class="token comment">/* 좌 */</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>0<span class="token punctuation">,</span> #333 50%<span class="token punctuation">,</span> transparent 50%<span class="token punctuation">)</span> 100% 0 / 1px 4px repeat-y<span class="token punctuation">;</span> <span class="token comment">/* 우 */</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/dotted-box.png" alt="1"></p>
<p>점선 박스를 만들었으면 점선을 이동시켜서 움직이는 것처럼 애니메이션을 작성해야 합니다.
시계방향으로 회전하는 애니메이션을 만들고 싶다면 아래 애니메이션 \처럼 <code v-pre>background-position</code>을 각각 이동시켜주면 됩니다.</p>
<p><strong>시계 방향</strong></p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token atrule"><span class="token rule">@keyframes</span> linearGradientMove</span> <span class="token punctuation">{</span>
  <span class="token selector">100%</span> <span class="token punctuation">{</span>
    <span class="token comment">/* 상  ,    하    ,   좌   ,  우    */</span>
    <span class="token property">background-position</span><span class="token punctuation">:</span> 4px 0<span class="token punctuation">,</span> -4px 100%<span class="token punctuation">,</span> 0 -4px<span class="token punctuation">,</span> 100% 4px<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>반시계 방향</strong>
반시계 방향이라면 아래와 같이 작성하면 됩니다.
복잡해보이지만 직접 작성해보면 어떻게 동작하는지 이해가 쉽게 됩니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token atrule"><span class="token rule">@keyframes</span> linearGradientMove</span> <span class="token punctuation">{</span>
  <span class="token selector">100%</span> <span class="token punctuation">{</span>
    <span class="token comment">/* 상  ,    하    ,   좌   ,  우    */</span>
    <span class="token property">background-position</span><span class="token punctuation">:</span> -4px 0<span class="token punctuation">,</span> 4px 100%<span class="token punctuation">,</span> 0 4px<span class="token punctuation">,</span> 100% -4px<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="결과-1" tabindex="-1"><a class="header-anchor" href="#결과-1" aria-hidden="true">#</a> 결과</h3>
<p>border 속성으로는 지원하지 않지만 <code v-pre>linear-gradient</code>로 아래와 같이 움직이는 점선 애니메이션을 구현할 수 있습니다.</p>
<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/13akstjq/embed/zYaNPMR?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/13akstjq/pen/zYaNPMR">
  Untitled</a> by 13akstjq (<a href="https://codepen.io/13akstjq">@13akstjq</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
<h2 id="_3-무지개-border-애니메이션" tabindex="-1"><a class="header-anchor" href="#_3-무지개-border-애니메이션" aria-hidden="true">#</a> 3. 무지개 border 애니메이션</h2>
<p><img src="@source/docs/CSS/border-animation/img/rotated_rainbow_box.gif" alt="3"></p>
<p>세 번째로는 무지개 border 애니메이션을 구현해 보겠습니다.
가장 먼저 기본적인 css 속성으로 해결할 수 있는지 판단해 볼 텐데요.
위와 같은 스펙을 지원하는 css 속성은 없으니 다른 방법으로 만들어야겠다는 생각이 듭니다.
이번에도 테두리만 보이지만 사각형을 활용해 볼 수 있을 것 같습니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.rotated_box</span> <span class="token punctuation">{</span>
  <span class="token selector">&amp;::before</span> <span class="token punctuation">{</span>
    <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">""</span><span class="token punctuation">;</span>
    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
    <span class="token property">left</span><span class="token punctuation">:</span> 0%<span class="token punctuation">;</span>
    <span class="token property">top</span><span class="token punctuation">:</span> 0%<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
    <span class="token property">background-repeat</span><span class="token punctuation">:</span> no-repeat<span class="token punctuation">;</span>
    <span class="token property">background-size</span><span class="token punctuation">:</span> 50% 50%<span class="token punctuation">;</span>
    <span class="token property">background-position</span><span class="token punctuation">:</span> 0 0<span class="token punctuation">,</span> 100% 0<span class="token punctuation">,</span> 100% 100%<span class="token punctuation">,</span> 0 100%<span class="token punctuation">;</span>
    <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#399953<span class="token punctuation">,</span> #399953<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#fbb300<span class="token punctuation">,</span> #fbb300<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#d53e33<span class="token punctuation">,</span> #d53e33<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#377af5<span class="token punctuation">,</span> #377af5<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token property">animation</span><span class="token punctuation">:</span> rotate 3s linear infinite<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/rainbow_box.png" alt="3"></p>
<p><code v-pre>linear-gradient</code> 활용해 <code v-pre>::before</code> 요소에 위와 같이 4개의 사각형을 만들어줍니다.
그리고 회전을 시켜주면 테두리가 비슷한 모습이 나올 것 같습니다.</p>
<p><img src="@source/docs/CSS/border-animation/img/rainbow_box2.gif" alt="3"></p>
<p>회전을 시켜보니 위 영상처럼 빈 공간이 노출되는데요.
이 부분은 <code v-pre>::before</code>의 사이즈를 키워서 해결할 수 있습니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.rotated_box</span> <span class="token punctuation">{</span>
  <span class="token selector">&amp;::before</span> <span class="token punctuation">{</span>
    <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">""</span><span class="token punctuation">;</span>
    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
    <span class="token property">left</span><span class="token punctuation">:</span> -50%<span class="token punctuation">;</span>
    <span class="token property">top</span><span class="token punctuation">:</span> -50%<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 200%<span class="token punctuation">;</span> <span class="token comment">/* 2배 */</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 200%<span class="token punctuation">;</span> <span class="token comment">/* 2배 */</span>
    <span class="token property">background-repeat</span><span class="token punctuation">:</span> no-repeat<span class="token punctuation">;</span>
    <span class="token property">background-size</span><span class="token punctuation">:</span> 50% 50%<span class="token punctuation">;</span>
    <span class="token property">background-position</span><span class="token punctuation">:</span> 0 0<span class="token punctuation">,</span> 100% 0<span class="token punctuation">,</span> 100% 100%<span class="token punctuation">,</span> 0 100%<span class="token punctuation">;</span>
    <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#399953<span class="token punctuation">,</span> #399953<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#fbb300<span class="token punctuation">,</span> #fbb300<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#d53e33<span class="token punctuation">,</span> #d53e33<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#377af5<span class="token punctuation">,</span> #377af5<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token property">animation</span><span class="token punctuation">:</span> rotate 3s linear infinite<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/rainbow_box3.gif" alt="3"></p>
<p>이런 형태까지 만들었으니 이제 <code v-pre>::after</code> 요소를 이용해서 내부 영역을 흰색으로 채워주면 됩니다.</p>
<h3 id="결과-2" tabindex="-1"><a class="header-anchor" href="#결과-2" aria-hidden="true">#</a> 결과</h3>
<p>예시에서는 4개만 사용했지만 더 다양한 색깔로 나누어서도 구현이 가능할 것 같습니다.</p>
<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/13akstjq/embed/KKeaZay?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/13akstjq/pen/KKeaZay">
  Untitled</a> by 13akstjq (<a href="https://codepen.io/13akstjq">@13akstjq</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
<h2 id="_4-빛나는-border-애니메이션" tabindex="-1"><a class="header-anchor" href="#_4-빛나는-border-애니메이션" aria-hidden="true">#</a> 4. 빛나는 border 애니메이션</h2>
<p><img src="@source/docs/CSS/border-animation/img/rotated_conic_box.gif" alt="4"></p>
<p>다음으로 만들어 볼 것은 테두리가 빛나는 애니메이션입니다.
이 애니메이션 또한 기본 css 속성이 존재하지 않기 때문에 다른 방법으로 구현해야 하는데요.</p>
<p>이번엔 <code v-pre>linear-gradient</code>가 아니라 <code v-pre>conic-gradient</code>를 이용해서 구현해 보겠습니다.</p>
<p><code v-pre>linear-gradient</code>가 직선 형태의 그라데이션이라면 <code v-pre>conic-gradient</code>는 중심점을 기준으로 원형으로 그라데이션을 그리는 속성입니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.rotated_one_conic_box</span> <span class="token punctuation">{</span>
  <span class="token selector">&amp;::before</span> <span class="token punctuation">{</span>
    <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">""</span><span class="token punctuation">;</span>
    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
    <span class="token property">left</span><span class="token punctuation">:</span> -50%<span class="token punctuation">;</span>
    <span class="token property">top</span><span class="token punctuation">:</span> -50%<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 200%<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 200%<span class="token punctuation">;</span>
    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token function">conic-gradient</span><span class="token punctuation">(</span>transparent<span class="token punctuation">,</span> <span class="token function">rgba</span><span class="token punctuation">(</span>168<span class="token punctuation">,</span> 239<span class="token punctuation">,</span> 255<span class="token punctuation">,</span> 1<span class="token punctuation">)</span><span class="token punctuation">,</span> transparent 30%<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/conic_box1.png" alt="4"></p>
<p>이제 이 <code v-pre>::before</code> 가상 요소를 무지개 애니메이션 때와 같이 회전시켜주고 <code v-pre>::after</code> 요소를 이용해 내부 컨텐츠를 채워주면 됩니다.</p>
<h3 id="결과-3" tabindex="-1"><a class="header-anchor" href="#결과-3" aria-hidden="true">#</a> 결과</h3>
<iframe height="300" style="width: 100%;" scrolling="no" title="conic-box" src="https://codepen.io/13akstjq/embed/GRGrVZg?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/13akstjq/pen/GRGrVZg">
  conic-box</a> by 13akstjq (<a href="https://codepen.io/13akstjq">@13akstjq</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
<h2 id="_5-색깔이-변하는-border-애니메이션" tabindex="-1"><a class="header-anchor" href="#_5-색깔이-변하는-border-애니메이션" aria-hidden="true">#</a> 5. 색깔이 변하는 border 애니메이션</h2>
<p><img src="@source/docs/CSS/border-animation/img/hue_box.gif" alt="5"></p>
<p>색깔이 변하는 border 애니메이션은 그라데이션 border만 만들 수 있다면 쉽게 적용할 수 있습니다.
그라데이션 border 관련해서는 <a href="https://yobi.navercorp.com/UIDEV-Team3-Works/posts/238?referrerId=368655786" target="_blank" rel="noopener noreferrer">재원님이 작성한 포스트<ExternalLinkIcon/></a>를 참고하였습니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">.rotated_gradient_box</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 7px auto 0<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 21px<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> 10px solid transparent<span class="token punctuation">;</span>
  <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>#444<span class="token punctuation">,</span> #444<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">linear-gradient</span><span class="token punctuation">(</span>to left<span class="token punctuation">,</span> #37a9fa<span class="token punctuation">,</span> #5951f3<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">background-clip</span><span class="token punctuation">:</span> content-box<span class="token punctuation">,</span> border-box<span class="token punctuation">;</span>
  <span class="token property">background-origin</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/gradient-box1.png" alt="5"></p>
<p>이렇게 그라디언트 border를 적용 했으면 <code v-pre>hue-rotate</code> 속성과 애니메이션으로 색상을 변경해 주면 됩니다.
<code v-pre>hue-rotate</code>는 각도 값을 넣어주면 되며, 아래 사진과 같은 색상환에 따라서 색상이 노출됩니다.</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token function">hue-ratote</span><span class="token punctuation">(</span>angle<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/docs/CSS/border-animation/img/hue-rotate.png" alt="5"></p>
<h3 id="결과-4" tabindex="-1"><a class="header-anchor" href="#결과-4" aria-hidden="true">#</a> 결과</h3>
<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/13akstjq/embed/MWXJNXX?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/13akstjq/pen/MWXJNXX">
  Untitled</a> by 13akstjq (<a href="https://codepen.io/13akstjq">@13akstjq</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
<h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>점점 인터렉티브한 웹사이트가 많아지면서 기존 속성들로 해결하기 어려운 경우들이 많이 있는데요.
그럴 때는 전혀 다른 용도로 사용되는 속성을 이용하거나, 도형, 마스크 등등 다양한 방법으로 구현해야 합니다. 스펙을 조정하는 방법도 있겠지만 다양한 아이디어로 스펙을 구현해 보는 것도 좋을 것 같습니다.</p>
</div></template>
