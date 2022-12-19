<template>
  <div>
    <h1 id="slack-api-incoming-webhooks-사용해서-메세지-보내는-방법-2022년-12월-최신" tabindex="-1">
      <a class="header-anchor" href="#slack-api-incoming-webhooks-사용해서-메세지-보내는-방법-2022년-12월-최신" aria-hidden="true">#</a> Slack API - incoming webhooks 사용해서 메세지 보내는 방법 (2022년 12월
      최신)
    </h1>
    <div class="custom-container tip">
      <p class="custom-container-title">💡이 포스팅을 읽으면</p>
      <p>Slack API를 활용해 메세지를 보낼 수 있습니다.</p>
    </div>
    <p>
      slack은 API를 이용해서 채널 ID를 가져와서 채널에 메세지를 보낼 수 있지만 <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer">incoming webhooks<ExternalLinkIcon /></a>을 사용하면 매우
      쉽게 메세지를 보낼 수 있습니다.
    </p>
    <h2 id="_1-슬랙-앱-만들기" tabindex="-1"><a class="header-anchor" href="#_1-슬랙-앱-만들기" aria-hidden="true">#</a> 1. 슬랙 앱 만들기</h2>
    <p>가장 먼저 슬랙 앱을 만들어주어야합니다.</p>
    <p>slack api 사이트에 접속해주신 후에 우측 상단의 Your apps를 눌러줍니다. <strong>create your first app을 눌러줍니다.</strong></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/1.png" />
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/2.png" />
    <p>from scratch를 눌러서 앱을 생성해줍니다.</p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/3.png" />
    <p>이름과 workspace를 선택해야되는 창이 나오는데, <strong>앱을 사용할 워크스페이스를 지정해줍니다.</strong></p>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/4.png" />
    <p>아래와 같은 화면이 나오면 incoming webhooks를 눌러줍니다.</p>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/5.png" />
    <p>activate incoming webhooks 를 눌러 웹훅 사용을 활성화시킵니다.</p>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/6.png" />
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/7.png" />
    <p>이제 앱을 사용할 채널을 지정해줍니다. 슬랙의 경우 api를 사용할 때 앱을 채널에 설치해서 그 채널에서 앱을 통한 api를 사용할 수 있도록 하고 있습니다.</p>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/8.png" />
    <p>앱을 지정해주면 아래와 같이 샘플 코드가 나오는데요. 이 코드를 활용해서 슬랙 메세지를 보낼 수 있습니다.</p>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/9.png" />
    <p>저는 아래처럼 <strong>sendMessage라는 함수를 만들어서 슬랙 메세지를 채널에 보내도록 작성했습니다.</strong></p>
    <component is="script" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" crossorigin="anonymous" async></component>
    <!-- itposting 수평형 -->
    <p><ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-4877378276818686" data-ad-slot="9743150776" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
    <component is="script"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
    <div class="language-javascript ext-js line-numbers-mode">
      <pre
        v-pre
        class="language-javascript"
      ><code><span class="token keyword">const</span> axios <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"axios"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> headers <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token string-property property">"Content-Type"</span><span class="token operator">:</span> <span class="token string">"application/json"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">WEBHOOK_SLACK_KEY</span> <span class="token operator">=</span> <span class="token string">"XXXXXX"</span><span class="token punctuation">;</span>

<span class="token comment">// 문의 사항 슬랙으로 메세지 보내는 함수</span>
<span class="token keyword">const</span> <span class="token function-variable function">sendMessage</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> text<span class="token punctuation">,</span> title <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> data <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"post"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">https://hooks.slack.com/services/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token constant">WEBHOOK_SLACK_KEY</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
      headers<span class="token punctuation">,</span>
      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">text</span><span class="token operator">:</span> title<span class="token punctuation">,</span>
        <span class="token literal-property property">blocks</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"section"</span><span class="token punctuation">,</span>
            <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"mrkdwn"</span><span class="token punctuation">,</span>
              text<span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> data<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

exports<span class="token punctuation">.</span>sendMessage <span class="token operator">=</span> sendMessage<span class="token punctuation">;</span>
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
    <h2 id="결과" tabindex="-1"><a class="header-anchor" href="#결과" aria-hidden="true">#</a> 결과</h2>
    <p>위 함수를 호출하면 아래와 같이 지정한 webhook-test 채널에 메세지가 오는 것을 확인할 수 있습니다.</p>
    <img src="@source/docs/API/2022-12-19-Slack-API-사용법-(2022최신)/img/11.png" />
  </div>
</template>
