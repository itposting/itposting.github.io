<template><div><h1 id="코드-생성-유틸-yarn-generate" tabindex="-1"><a class="header-anchor" href="#코드-생성-유틸-yarn-generate" aria-hidden="true">#</a> 코드 생성 유틸 <code v-pre>yarn generate</code></h1>
<p>미리 정의한 템플릿(generator)을 기반으로 정해진 규칙에 따라 코드를 생성합니다.</p>
<h2 id="사용법" tabindex="-1"><a class="header-anchor" href="#사용법" aria-hidden="true">#</a> 사용법</h2>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ yarn generate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>(모바일 UI 컴포넌트 코드 생성 예시)
<img src="@source/scripts/generators/docs/yarngenerate.gif" alt=""></p>
<h2 id="제공하는-generator" tabindex="-1"><a class="header-anchor" href="#제공하는-generator" aria-hidden="true">#</a> 제공하는 generator</h2>
<p><code v-pre>yarn generate</code> 후 generator 를 선택하거나, <code v-pre>yarn generate ${generator}</code> 를 실행하면 해당하는 generator 를 이용해 코드를 생성할 수 있습니다.</p>
<ul>
<li><code v-pre>pc ui</code> : <code v-pre>src/pc/components/ui</code> 에 모바일 UI 컴포넌트를 생성합니다.</li>
<li><code v-pre>mobile ui</code> : <code v-pre>src/mobile/components/ui</code> 에 모바일 UI 컴포넌트를 생성합니다.</li>
<li><code v-pre>inapp ui</code> : <code v-pre>src/inapp/components/ui</code> 에 모바일 UI 컴포넌트를 생성합니다.</li>
</ul>
<h2 id="참고-문서" tabindex="-1"><a class="header-anchor" href="#참고-문서" aria-hidden="true">#</a> 참고 문서</h2>
<ul>
<li>PLOP (사용된 라이브러리) : https://plopjs.com/documentation/</li>
</ul>
</div></template>
