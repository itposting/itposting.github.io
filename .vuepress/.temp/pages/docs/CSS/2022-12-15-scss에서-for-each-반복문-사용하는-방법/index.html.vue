<template>
  <div>
    <h1 id="scss에서-for-each-반복문-사용하는-방법" tabindex="-1">
      <a class="header-anchor" href="#scss에서-for-each-반복문-사용하는-방법" aria-hidden="true">#</a> scss에서 @for @each 반복문 사용하는 방법
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">💡이 포스팅을 읽으면</p>
      <p>scss에서 for, each 반복문을 작성할 수 있습니다.</p>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_1-for-i-from-start-to-end" tabindex="-1"><a class="header-anchor" href="#_1-for-i-from-start-to-end" aria-hidden="true">#</a> 1. for ${i} from ${start} to ${end}</h2>
    <p>for문의 가장 기본적인 방법으로</p>
    <p><code v-pre>for ${i} from ${start} to ${end}</code>로 작성하면 i를 인덱스로 하고 start부터 end <strong>미만</strong>까지 반복합니다. 이하가 아니라 미만이라는 점만 참고하시면 됩니다.</p>
    <div class="language-scss ext-scss line-numbers-mode">
      <pre
        v-pre
        class="language-scss"
      ><code><span class="token property"><span class="token variable">$colorList</span></span><span class="token punctuation">:</span> #e74c3c<span class="token punctuation">,</span> #e67e22<span class="token punctuation">,</span> #f1c40f<span class="token punctuation">,</span> #2ecc71<span class="token punctuation">,</span> #c0392b<span class="token punctuation">,</span> #3498db<span class="token punctuation">,</span> #2c3e50<span class="token punctuation">,</span> #9b59b6<span class="token punctuation">,</span> #bdc3c7<span class="token punctuation">,</span> #7f8c8d<span class="token punctuation">,</span> #2980b9<span class="token punctuation">;</span>

<span class="token comment">// 1~10까지 반복</span>
<span class="token keyword">@for</span> <span class="token variable">$i</span> <span class="token keyword">from</span> <span class="token selector">1 to 11 </span><span class="token punctuation">{</span>
  &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token function">nth</span><span class="token punctuation">(</span><span class="token variable">$colorList</span><span class="token punctuation">,</span> <span class="token variable">$i</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
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
      </div>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>여기서 nth는 기본 내장 함수로서 scss의 배열에서 특정 값을 알아낼 수 있는 함수입니다. 자바스크립트로 치면 <code v-pre>colorList[i]</code> 와 같은 개념이겠죠.</p>
    <h2 id="_2-for-i-from-start-through-end" tabindex="-1"><a class="header-anchor" href="#_2-for-i-from-start-through-end" aria-hidden="true">#</a> 2. for ${i} from ${start} through ${end}</h2>
    <p>첫번째 for문과의 차이점은 to가 through로 변경되었다는 점 뿐인데요. start부터 end<strong>이하</strong> 까지 반복합니다.</p>
    <div class="language-scss ext-scss line-numbers-mode">
      <pre
        v-pre
        class="language-scss"
      ><code><span class="token property"><span class="token variable">$colorList</span></span><span class="token punctuation">:</span> #e74c3c<span class="token punctuation">,</span> #e67e22<span class="token punctuation">,</span> #f1c40f<span class="token punctuation">,</span> #2ecc71<span class="token punctuation">,</span> #c0392b<span class="token punctuation">,</span> #3498db<span class="token punctuation">,</span> #2c3e50<span class="token punctuation">,</span> #9b59b6<span class="token punctuation">,</span> #bdc3c7<span class="token punctuation">,</span> #7f8c8d<span class="token punctuation">,</span> #2980b9<span class="token punctuation">;</span>

<span class="token comment">// 1~11까지 반복</span>
<span class="token keyword">@for</span> <span class="token variable">$i</span> <span class="token keyword">from</span> <span class="token selector">1 to 11 </span><span class="token punctuation">{</span>
  &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token function">nth</span><span class="token punctuation">(</span><span class="token variable">$colorList</span><span class="token punctuation">,</span> <span class="token variable">$i</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
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
      </div>
    </div>
    <h2 id="_3-each-item-in-list" tabindex="-1"><a class="header-anchor" href="#_3-each-item-in-list" aria-hidden="true">#</a> 3. @each ${item} in ${list}</h2>
    <p>다음은 @each 문법인데요. 자바스크립트의 for each 문법과 동일한 방식이라고 생각해주시면 됩니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-scss ext-scss line-numbers-mode">
      <pre v-pre class="language-scss"><code><span class="token comment">// index 찾는 방법</span>
<span class="token keyword">@each</span> <span class="token selector"><span class="token variable">$color</span> in <span class="token variable">$colorList</span> </span><span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <p>위와 같이 작성할 수 있을텐데요.</p>
    <p>each문의 문제는 index를알 수 없다는 점인데요. 그 부분은 이렇게 해결할 수 있습니다.</p>
    <div class="language-scss ext-scss line-numbers-mode">
      <pre
        v-pre
        class="language-scss"
      ><code><span class="token keyword">@each</span> <span class="token selector"><span class="token variable">$color</span> in <span class="token variable">$colorList</span> </span><span class="token punctuation">{</span>
  <span class="token property"><span class="token variable">$i</span></span><span class="token punctuation">:</span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token variable">$colorList</span><span class="token punctuation">,</span> <span class="token variable">$color</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token variable">#{$color}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
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
    <p>index라는 내장 함수를 통해서 배열의 특정 값이 몇번째에 있는 값인지를 알아낼 수 있습니다.</p>
    <p>그렇게 알아낸 $i 값으로 nth-child에 넣어주면서 사용할 수 있죠.</p>
    <h2 id="_4-map-형태의-for-a-b-in-map" tabindex="-1"><a class="header-anchor" href="#_4-map-형태의-for-a-b-in-map" aria-hidden="true">#</a> 4. Map 형태의 for ${a},${b} in ${map}</h2>
    <p>index 내장함수를 통해서 index를 알아낼 수도 있지만 아래와 같이 map형태로 배열을 저장한다면 별도의 내장함수 없이 바로 each문을 통해서 스타일을 지정할 수 있습니다.</p>
    <div class="language-scss ext-scss line-numbers-mode">
      <pre v-pre class="language-scss"><code><span class="token property"><span class="token variable">$colors</span></span><span class="token punctuation">:</span> <span class="token punctuation">(</span>
  <span class="token property">1</span><span class="token punctuation">:</span> #e74c3c<span class="token punctuation">,</span>
  <span class="token property">2</span><span class="token punctuation">:</span> #e67e22<span class="token punctuation">,</span>
  <span class="token property">3</span><span class="token punctuation">:</span> #f1c40f<span class="token punctuation">,</span>
  <span class="token property">4</span><span class="token punctuation">:</span> #2ecc71<span class="token punctuation">,</span>
  <span class="token property">5</span><span class="token punctuation">:</span> #c0392b<span class="token punctuation">,</span>
  <span class="token property">6</span><span class="token punctuation">:</span> #3498db<span class="token punctuation">,</span>
  <span class="token property">7</span><span class="token punctuation">:</span> #2c3e50<span class="token punctuation">,</span>
  <span class="token property">8</span><span class="token punctuation">:</span> #9b59b6<span class="token punctuation">,</span>
  <span class="token property">9</span><span class="token punctuation">:</span> #bdc3c7<span class="token punctuation">,</span>
  <span class="token property">10</span><span class="token punctuation">:</span> #7f8c8d<span class="token punctuation">,</span>
  <span class="token property">11</span><span class="token punctuation">:</span> #2980b9<span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">@each</span> <span class="token selector"><span class="token variable">$i</span>, <span class="token variable">$color</span> in <span class="token variable">$colors</span> </span><span class="token punctuation">{</span>
  &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token variable">#{$color}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
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
      </div>
    </div>
    <p>@each 뒤에 오는 값에 map의 key, value로 할당하면 그 값을 반복문에서 사용할 수 있습니다. 그래서 별도로 index를 지정하지 않고도 nth-child에 인덱스 값을 넣을 수 있습니다.</p>
    <p>오늘은 scss의 for문을 사용하는 방법에 대해서 알아보았습니다. 다음에는 다른 scss 문법에 대해서 알아보도록 하겠습니다.</p>
  </div>
</template>
