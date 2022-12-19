<template><div><h1 id="netlify에-github-저장소-연결하는-방법" tabindex="-1"><a class="header-anchor" href="#netlify에-github-저장소-연결하는-방법" aria-hidden="true">#</a> Netlify에 github 저장소 연결하는 방법</h1>
<p>이전에는 Netlify에 static HTML 웹사이트 파일을 업로드해서 호스팅하는 방법에 대해서 알아보았었는데요.</p>
<p>오늘은 github 저장소와 연결하여 원격 저장소에 push하면 자동으로 빌드가 되어 배포되는 방법을 알아보겠습니다.</p>
<h2 id="github-저장소-연결" tabindex="-1"><a class="header-anchor" href="#github-저장소-연결" aria-hidden="true">#</a> Github 저장소 연결</h2>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-github-저장소-연결하는-방법/img/1.png" alt=""></p>
<p>build &amp; deploy 메뉴에 들어가서 link repository 버튼을 클릭해줍니다.</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-github-저장소-연결하는-방법/img/2.png" alt=""></p>
<p>Github을 선택해줍니다.</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-github-저장소-연결하는-방법/img/3.png" alt=""></p>
<p>권한 승인을 해줍니다.</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-github-저장소-연결하는-방법/img/4.png" alt=""></p>
<p>원하는 저장소를 선택해줍니다.</p>
<p><img src="@source/docs/ETC/2022-11-28-Netlify에-github-저장소-연결하는-방법/img/5.png" alt=""></p>
<p>배포할 브랜치와 베이스 디렉토리 publish directory 등 배포에 필요한 설정을 할 수 있습니다.</p>
<p>Nextjs 저장소의 경우 .next와 out 두 개의 배포 방법이 있기 때문에 이 내용은 아래 포스팅에서 확인하실 수 있습니다.</p>
<p>이렇게 Github 저장소에 있는 프로젝트를 Netlify에 연결하여 push하는 것만으로도 자동으로 호스팅이 되도록 작업했습니다.</p>
<p>Netlify외에도 다양한 호스팅 서비스들이 많기 때문에 각자 상황에 맞는 것을 사용하시면 좋을 것 같습니다.</p>
</div></template>
