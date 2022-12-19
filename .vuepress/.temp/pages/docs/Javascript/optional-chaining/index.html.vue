<template>
  <div>
    <h1 id="알아두면-유용한-optional-chaining-과-nullish-coalescing" tabindex="-1">
      <a class="header-anchor" href="#알아두면-유용한-optional-chaining-과-nullish-coalescing" aria-hidden="true">#</a> 알아두면 유용한 optional chaining 과 nullish coalescing
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">목표</p>
      <p>optional chaining(<code v-pre>?.</code>), nullish coalescing(<code v-pre>??</code>)를 이용해 변수에 따른 조건 분기 처리를 하는 여러 방법에 대해서 정리해 보려고 합니다.</p>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_1-optional-chaining" tabindex="-1"><a class="header-anchor" href="#_1-optional-chaining" aria-hidden="true">#</a> 1. optional chaining(<code v-pre>?.</code>)</h2>
    <p>React와 Typescript로 UI개발을 하다 보면 컴포넌트의 props의 타입이 <code v-pre>?: number</code>와 같이 nullable 한 경우가 많이 있습니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width<span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>imageList와 image의 width, height를 부모 props에서 전달해 주지 않았을 때 UI개발 시 대응하는 과정으로 설명드리겠습니다.</p>
    <h4 id="_1-imagelist가-존재할-때만-이미지-리스트-노출" tabindex="-1">
      <a class="header-anchor" href="#_1-imagelist가-존재할-때만-이미지-리스트-노출" aria-hidden="true">#</a> 1) imageList가 존재할 때만 이미지 리스트 노출
    </h4>
    <p>가장 기본적으로 <code v-pre>var ? a : b</code> 문법을 사용해서 아래와 같이 imageList가 존재할 때만 리스트를 노출하도록 표현할 수 있습니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList <span class="token operator">?</span> imageList<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width<span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	) : </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">></span></span><span class="token plain-text">}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>위와 같이 작성했을 때는 imageList가 존재하지 않을 때 <code v-pre>&lt;&gt;&lt;/&gt;</code> Fragment 요소를 불필요하게 false 조건에 사용해 주어야 하는데요.</p>
    <p>이런 부분을 optional chaining(<code v-pre>?.</code>) 을 통해서 아래와 같이 개선할 수 있습니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width<span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>optional chaining은 <code v-pre>?.</code> 좌측 값이 null, undefined인 경우 undefined를 리턴합니다.</p>
    <p>위와 같은 방식으로 각 image에도 optional chaining을 적용해 보도록 하겠습니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token operator">?.</span>width<span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token operator">?.</span>height<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>image가 존재할 때만 image의 width, height를 사용하는 형태로 작성해 보았는데요.</p>
    <p>
      사실 위와 같이 작성하는 것은 의미가 없습니다. 위에서도 말했듯이 optional chaining은 <code v-pre>?.</code> 좌측 값이 nullable 한 경우에 의미가 있는 문법이기 때문입니다. 각 image는 width, height 값이 nullable할 뿐 객체
      형식이기 때문에 <code v-pre>?.</code>를 사용하지 않아도 됩니다.
    </p>
    <p>같은 의미에서 만약 아래와 같이 imageList가 nullable한 값이 아니라면 imageList에도 optional chaining이 필요하지 않게 됩니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">imageList</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width<span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>다시 본론으로 돌아와서, image는 객체 형태로 존재하더라도 image의 width, height는 여전히 nullable한 값입니다.</p>
    <h2 id="_2-nullish-coalescing" tabindex="-1"><a class="header-anchor" href="#_2-nullish-coalescing" aria-hidden="true">#</a> 2. nullish coalescing(<code v-pre>??</code>)</h2>
    <p>image의 width, height 값이 없을 경우 기본 사이즈를 노출하는 과정을 nullish coalescing(<code v-pre>??</code>)를 통해서 설명해 드리도록 하겠습니다.</p>
    <p>imageList 때와 동일하게 가장 기본적인 방법인 <code v-pre>var ? a : b</code>를 사용해서 width, height의 기본 값을 아래와 같이 지정할 수 있습니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width <span class="token operator">?</span> image<span class="token punctuation">.</span>width <span class="token operator">:</span> <span class="token number">200</span> <span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height <span class="token operator">?</span> image<span class="token punctuation">.</span>height <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>image의 width, height가 없을 경우에 기본 이미지 사이즈를 지정했지만 코드가 굉장히 길어지게 되었습니다.</p>
    <p>
      이렇게 작성하면 코드가 길어지는 점 외에 다른 문제가 발생하는데요. 바로 width, height 값이 0인 경우에도 기본 이미지 사이즈로 지정한다는 점입니다. <code v-pre>var ? a : b</code>는 자바스크립트의 신기한 특성 때문에 null,
      undefined 외에도 0, '', false에서도 결과값으로 b를 갖게 됩니다.
    </p>
    <p>0이란 값이 들어왔을 때 0을 그대로 사용하고 싶다면 아래와 같이 조건이 하나 더 추가되어야 합니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width <span class="token operator">?</span> image<span class="token punctuation">.</span>width <span class="token operator">:</span> image<span class="token punctuation">.</span>width <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">?</span> image<span class="token punctuation">.</span>width <span class="token operator">:</span> <span class="token number">200</span>  <span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height <span class="token operator">?</span> image<span class="token punctuation">.</span>height <span class="token operator">:</span> image<span class="token punctuation">.</span>height <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">?</span> image<span class="token punctuation">.</span>height <span class="token operator">:</span>  <span class="token number">200</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>0에 대한 처리를 하기 위해 더 복잡해진 것을 보실 수 있습니다. 이번엔 OR(<code v-pre>||</code>) 연산자를 사용해서 기본 이미지 사이즈를 지정해 보겠습니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width <span class="token operator">||</span> <span class="token number">200</span> <span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <p>
      <code v-pre>var ? a : b</code>를 사용했을 때 보다 <code v-pre>||</code>를 사용했을 때 더 간결하게 작성할 수 있는데요. 하지만 <code v-pre>||</code>도 <code v-pre>var ? a : b</code>와 동일하게 width 값이 0이 들어오면 200을
      리턴합니다.
    </p>
    <p>이렇게 0, &quot;&quot;, false를 제외한 null 혹은 undefined 값에 대해서만 거짓 판별을 하고 싶을 때 사용하는 것이 nullish coalescing(<code v-pre>??</code>) 입니다.</p>
    <div class="language-jsx ext-jsx line-numbers-mode">
      <pre v-pre class="language-jsx"><code><span class="token punctuation">{</span><span class="token operator">...</span>중략<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">ImageListViewProps</span> <span class="token punctuation">{</span>
  imageList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    width<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
    height<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">ImageListView</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>imageList<span class="token punctuation">}</span> <span class="token operator">:</span>  ImageListViewProps</span><span class="token punctuation">)</span>  <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
	</span><span class="token punctuation">{</span>imageList<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">image<span class="token punctuation">,</span>i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
	    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
		</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span>  <span class="token attr-name">width</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>width <span class="token operator">??</span> <span class="token number">200</span> <span class="token punctuation">}</span></span> <span class="token attr-name">height</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>image<span class="token punctuation">.</span>height <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">
	    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span><span class="token plain-text">
	)}
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span><span class="token plain-text">
}
</span></code></pre>
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
      </div>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>위와 같이 작성하면 image의 width, height 값이 null 혹은 undefined이 들어왔을 때만 기본 사이즈인 200x200의 이미지를 만들 수 있게 됩니다.</p>
    <h2 id="정리" tabindex="-1"><a class="header-anchor" href="#정리" aria-hidden="true">#</a> 정리</h2>
    <p><code v-pre>var ? a : b</code>, <code v-pre>||</code>, <code v-pre>??</code> 세 가지 케이스를 정리해 보면 아래와 같습니다.</p>
    <div class="language-javascript ext-js line-numbers-mode">
      <pre v-pre class="language-javascript"><code><span class="token keyword">let</span> height1 <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> height2 <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> height3 <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> height4 <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> height5 <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> height6 <span class="token operator">=</span> <span class="token number">50</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height1 <span class="token operator">?</span> height1 <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height2 <span class="token operator">?</span> height2 <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height3 <span class="token operator">?</span> height3 <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height4 <span class="token operator">?</span> height4 <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height5 <span class="token operator">?</span> height5 <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height6 <span class="token operator">?</span> height6 <span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//  50</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height1 <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height2 <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height3 <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height4 <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height5 <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height6 <span class="token operator">||</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//  50</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height1 <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height2 <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 200</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height3 <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//  ''</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height4 <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//   0</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height5 <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// false</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>height6 <span class="token operator">??</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//  50</span>
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
    <h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
    <p>
      각 문법들이 옳고 그름이 있는 것은 아니다 보니 상황에 맞게 적절한 것을 사용하는 것이 좋을 것 같습니다. 또한 개발코드와 연관이 되어있는 부분이기 때문에 협업하는 조직에 따라서도 스타일이 달라질 수 있어 이 부분도 고려하시면 좋을
      것 같습니다.
    </p>
  </div>
</template>
