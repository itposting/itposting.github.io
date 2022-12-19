<template>
  <div>
    <h1 id="getstaticprops-getserversideprops-getstaticpaths" tabindex="-1">
      <a class="header-anchor" href="#getstaticprops-getserversideprops-getstaticpaths" aria-hidden="true">#</a> getStaticProps, getServerSideProps, getStaticPaths
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">목표</p>
      <p>Intel Mac에 nvm을 설치하는 방법을 M1 Mac에 하면 에러가 발생하는데, M1 Mac에 nvm을 설치하는 방법에 대해 알 수 있습니다.</p>
    </div>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h2 id="_1-nvm-설치" tabindex="-1"><a class="header-anchor" href="#_1-nvm-설치" aria-hidden="true">#</a> 1. nvm 설치</h2>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code>brew <span class="token function">install</span> nvm
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <p>위와 같이 설치를 해주고 난 후에 인텔 Mac과 동일하게 nvm환경변수 설정을 해주어야합니다.</p>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">mkdir</span> ~/.nvm
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <p>여기가 인텔 Mac과 다른 부분인데요. 여러분 각자 사용하는 shell 설정 파일을 열어줍니다 .</p>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code><span class="token function">vi</span> ~/.bash_profile
<span class="token function">vi</span> ~/.zshrc // 저는 이거 사용
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <p>위에 열어둔 파일 맨 아래에 아래 변경된 설정을 복사 붙혀넣기 해줍니다. **M1 Mac은 nvm 환경변수 설정하는 경로가 다르기 때문에 인텔 맥과 차이가 있습니다. **</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre
        v-pre
        class="language-bash"
      ><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">NVM_DIR</span><span class="token operator">=</span><span class="token string">"<span class="token environment constant">$HOME</span>/.nvm"</span>
  <span class="token punctuation">[</span> -s <span class="token string">"/opt/homebrew/opt/nvm/nvm.sh"</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\</span>. <span class="token string">"/opt/homebrew/opt/nvm/nvm.sh"</span>  <span class="token comment"># This loads nvm</span>
  <span class="token punctuation">[</span> -s <span class="token string">"/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\</span>. <span class="token string">"/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"</span>  <span class="token comment"># This loads nvm bash_completion</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <h2 id="설치-확인" tabindex="-1"><a class="header-anchor" href="#설치-확인" aria-hidden="true">#</a> 설치 확인</h2>
    <p>설정이 다 끝났다면 아래 명령어로 nvm이 잘 설치되었는지 확인해줍니다.</p>
    <div class="language-text ext-text line-numbers-mode">
      <pre v-pre class="language-text"><code>nvm -v
// 0.39.2
</code></pre>
      <div class="line-numbers" aria-hidden="true">
        <div class="line-number"></div>
        <div class="line-number"></div>
      </div>
    </div>
    <h2 id="원하는-node-버전-설치" tabindex="-1"><a class="header-anchor" href="#원하는-node-버전-설치" aria-hidden="true">#</a> 원하는 Node 버전 설치</h2>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code>nvm <span class="token function">install</span> <span class="token number">16.17</span>.0
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h2 id="설치된-node-버전-확인" tabindex="-1"><a class="header-anchor" href="#설치된-node-버전-확인" aria-hidden="true">#</a> 설치된 Node 버전 확인</h2>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code>nvm <span class="token function">ls</span>
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <img src="@source/docs/Setting/m1-nvm/img/1.png" alt="" />
    <h2 id="원하는-node-버전으로-변경" tabindex="-1"><a class="header-anchor" href="#원하는-node-버전으로-변경" aria-hidden="true">#</a> 원하는 Node 버전으로 변경</h2>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code>nvm use <span class="token number">16.17</span>.0
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <h2 id="default-node-버전-설정" tabindex="-1"><a class="header-anchor" href="#default-node-버전-설정" aria-hidden="true">#</a> default Node 버전 설정</h2>
    <p>이렇게 해두면 원하지 않는 Node 버전이 기본적으로 설정되어있을 수 있습니니다.</p>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code>nvm <span class="token builtin class-name">alias</span> default <span class="token number">16.17</span>.0
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <p>위와 같이 작성해주면 기본 Node 버전을 지정해서 사용할 수 있습니다.</p>
  </div>
</template>
