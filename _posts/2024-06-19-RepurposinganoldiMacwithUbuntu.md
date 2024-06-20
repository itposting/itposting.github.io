---
title: "구형 iMac을 Ubuntu로 다시 활용하기"
description: ""
coverImage: "/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_0.png"
date: 2024-06-19 04:50
ogImage: 
  url: /assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_0.png
tag: Tech
originalTitle: "Repurposing an old iMac with Ubuntu"
link: "https://medium.com/@esantana_io/repurposing-an-old-imac-with-ubuntu-650d97a138c5"
---



![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_0.png)

2011년, 제 주요 작업 기계는 21.5인치 iMac (Mid-2011)이었는데, 정말 멋진 하드웨어였습니다. 그 때 대부분의 작업은 Linux로 하다가 Mac OS X로 전환했는데, 아름다운 그래픽 사용자 인터페이스와 터미널을 제공했습니다. High Sierra(10.13)가 이 iMac에서 공식으로 지원되는 마지막 macOS 버전이었습니다. 더 최신 macOS 버전을 비공식으로 설치하려고 했지만 많은 문제가 발생했습니다. 결국, 그냥 보관하고 잊어버렸죠.

![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_1.png)

2024년으로 빠르게 이동했을 때, Action Retro의 YouTube 비디오에서 16년 된 iMac에 Ubuntu를 설치하는 것을 보았습니다. 이를 영감받아 똑같이 해보기로 결심했고, 경험은 정말 놀라울 정도로 멋졌습니다. 참고로, 이 iMac을 이전에 500GB SSD와 12GB RAM으로 업그레이드한 적이 있어서 Ubuntu를 실행하는 데 원활한 성능에 크게 기여한다고 생각합니다.


<div class="content-ad"></div>

우분투 설치는 정말 쉬웠어요. USB 드라이브를 가져와서 최신 데스크톱 버전 (64-bit)을 다운로드하면 돼요. 저는 우분투 24.04 LTS를 선택했어요. 

![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_2.png)

업데이트된 설치 가이드는 예전보다 훨씬 나아졌고, 옵션들도 더 직관적이에요. 그냥 가이드에 따라 따라하다 보면 재부팅할 수 있어요.

![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_3.png)

<div class="content-ad"></div>

확인하세요!  
홍어!  
![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_4.png)

<div class="content-ad"></div>

블루투스 키보드와 마우스? 체크!

![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_5.png)

SD 카드 리더? 체크!

![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_6.png)

<div class="content-ad"></div>

슈퍼드라이브? 확인!

![이미지](/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_7.png)

이 시스템은 가벼운 일상 작업에 잘 작동합니다. 사진에서 보듯이, 이 기사는 iMac을 사용하여 썼어요. 문제없이 비디오도 시청할 수 있어요. 비디오 재생에 필요한 코덱을 추가하려면 우분투 제한된 엑스트라를 설치하세요.

```js
sudo apt install ubuntu-restricted-extras
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_8.png" />

이 맥은 디스크릿한 AMD 그래픽 카드가 탑재되어 있어요. 더불어 Ubuntu를 사용하면 앱을 사용하는데 따라 전용 GPU와 통합 그래픽을 전환할 수 있어요.

<img src="/assets/img/2024-06-19-RepurposinganoldiMacwithUbuntu_9.png" />

모든 macOS 사용자를 위한 팁: "Quick Look" 기능이 그리워진다면, Ubuntu 파일 관리자에서 같은 기능을 얻을 수 있는 Gnome-Sushi라는 앱을 설치할 수 있어요.

<div class="content-ad"></div>

```js
sudo apt-get install gnome-sushi
```

우분투는 가끔 독특한 문제들이 있습니다. 가끔씩 파이어폭스와 비디오 재생과 관련된 이상한 현상이 있었어요. 하지만 전반적으로 우분투는 이 오래된 시스템에 새로운 활력을 불어넣어줬어요. 하드웨어를 아주 잘 다루는 방법에 감탄하고 있어요. 이런 오래된 시스템을 현대적이고 사용하기 편한 운영체제로 유지하는 방법에 찬사를 보냅니다.

이 기사를 즐겁게 보셨기를 바랍니다. 좋았다면 박수를 보내주세요. 그렇지 않았다면 박수를 보내주세요.

고맙습니다. 즐거운 하루 보내세요.
