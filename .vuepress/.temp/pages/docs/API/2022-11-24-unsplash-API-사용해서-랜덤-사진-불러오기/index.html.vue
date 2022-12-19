<template>
  <div>
    <h1 id="unsplash-api-사용해서-랜덤-사진-불러오기" tabindex="-1">
      <a class="header-anchor" href="#unsplash-api-사용해서-랜덤-사진-불러오기" aria-hidden="true">#</a> unsplash API 사용해서 랜덤 사진 불러오기
    </h1>
    <p>unsplash를 사용하면 아래처럼 멋진 사진들을 사용할 수 있습니다.</p>
    <p><img src="@source/docs/API/2022-11-24-unsplash-API-사용해서-랜덤-사진-불러오기/img/1.png" alt="" /></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <h3 id="unsplash-source-api" tabindex="-1"><a class="header-anchor" href="#unsplash-source-api" aria-hidden="true">#</a> unsplash source API</h3>
    <p>unsplash에는 <strong>source API가 존재했는데 현재는 deprecated 된 상태입니다.</strong></p>
    <p><img src="@source/docs/API/2022-11-24-unsplash-API-사용해서-랜덤-사진-불러오기/img/2.png" alt="" /></p>
    <p>아래 url을 통해 get 요청을 하게 되면 현재도 사용을 할 수 는 있습니다. <code v-pre>?code</code> 는 사진의 키워드로 원하는 키워드를 넣어주면 됩니다.</p>
    <h3 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h3>
    <div class="language-bash ext-sh line-numbers-mode">
      <pre v-pre class="language-bash"><code>https://source.unsplash.com/500x500/?code
</code></pre>
      <div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div>
    </div>
    <p>위 방법은 공식 문서에는 deprecated되었다고 나와있기 때문에 언제 중지될지 모릅니다.</p>
    <p>사진 관련된 서비스를 사용하려면 정식 API를 사용하시는 것을 추천드립니다.</p>
    <h3 id="unsplash-new-api-2022년-최신" tabindex="-1"><a class="header-anchor" href="#unsplash-new-api-2022년-최신" aria-hidden="true">#</a> unsplash New API (2022년 최신)</h3>
    <p>unsplash의 API를 사용하기 위해 <strong>아래 사이트로 방문해서 회원 가입을 진행해줍니다.</strong></p>
    <p>
      <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer">https://unsplash.com/developers<ExternalLinkIcon /></a>
    </p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p><img src="@source/docs/API/2022-11-24-unsplash-API-사용해서-랜덤-사진-불러오기/img/3.png" alt="" /></p>
    <h3 id="_3-앱-생성" tabindex="-1"><a class="header-anchor" href="#_3-앱-생성" aria-hidden="true">#</a> 3. 앱 생성</h3>
    <p>앱 생성을 눌러줍니다.</p>
    <p><img src="@source/docs/API/2022-11-24-unsplash-API-사용해서-랜덤-사진-불러오기/img/4.png" alt="" /></p>
    <p>앱 이름을 입력해줍니다.</p>
    <p><img src="@source/docs/API/2022-11-24-unsplash-API-사용해서-랜덤-사진-불러오기/img/5.png" alt="" /></p>
    <p>앱 생성을 해주면 앱 사용 여부를 검토해준다는 메세지를 확인할 수 있습니다. <strong>5일에서 10일정도 소요된다고 하니 기다려주시면 될 것 같습니다.</strong></p>
    <p><img src="@source/docs/API/2022-11-24-unsplash-API-사용해서-랜덤-사진-불러오기/img/6.png" alt="" /></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <p>현재 저도 심사를 받는 중이라 심사 완료되면 업데이트 하도록 하겠습니다(22/11/24)</p>
    <p>심사를 받기 전에는 1시간에 50번의 호출만 가능하기 때문에 개발용으로 사용하기도 부족해보이네요.</p>
    <p>source API는 deprecated되었으니 안전한 API 사용하셔서 개발하시면 될 것 같습니다.</p>
  </div>
</template>
