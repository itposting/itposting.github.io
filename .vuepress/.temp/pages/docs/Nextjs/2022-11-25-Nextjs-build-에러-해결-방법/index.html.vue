<template>
  <div>
    <h1 id="nextjs-build-에러-해결-방법-only-set-one-of-children-or-props-dangerouslysetinnerhtml-react-no-danger-with-children" tabindex="-1">
      <a class="header-anchor" href="#nextjs-build-에러-해결-방법-only-set-one-of-children-or-props-dangerouslysetinnerhtml-react-no-danger-with-children" aria-hidden="true">#</a> Nextjs build 에러 해결 방법 (Only set one
      of children or props.dangerouslySetInnerHTML react/no-danger-with-children)
    </h1>
    <div class="custom-container tip"><p class="custom-container-title">목표</p></div>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">yarn</span>  build
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <p>위 명령어로 빌드를 했을 때 아래와 같이 빌드 에러가 발생하는 경우가 있는데요.</p>
    <p><img src="@source/docs/Nextjs/2022-11-25-Nextjs-build-에러-해결-방법/img/1.png" alt="" /></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>Only set one of children or props.dangerouslySetInnerHTML react/no-danger-with-children 이 에러는 dangerouslySetInnerHTML을 사용하는 요소는 한개의 children만 가져야된다는 에러입니다.</p>
    <p>저는 아래와 같이 작성했었는데 이렇게 작성할 경우 <code v-pre>{}</code> 를 다른 자식으로 인식하기 때문에 발생했던 에러였습니다.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">dangerouslySetInnerHTML</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> __html<span class="token operator">:</span> titleText <span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h2 id="해결방법" tabindex="-1"><a class="header-anchor" href="#해결방법" aria-hidden="true">#</a> 해결방법</h2>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>아래와 같이 <code v-pre>{}</code>를 제거하고 다시 빌드를 하게 되면 에러가 해결됩니다. <code v-pre>{}</code>외에도 <code v-pre> </code>같은 공백으로도 빌들에러가 발생하게 되니 참고하시기 바랍니다.</p>
    <div class="language-tsx ext-tsx line-numbers-mode">
      <pre
        v-pre
        class="language-tsx"
      ><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">dangerouslySetInnerHTML</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> __html<span class="token operator">:</span> titleText <span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
  </div>
</template>
