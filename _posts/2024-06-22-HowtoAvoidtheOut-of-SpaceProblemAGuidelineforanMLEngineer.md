---
title: "ML 엔지니어를 위한 저장 공간 부족 문제 피하는 방법 가이드라인"
description: ""
coverImage: "/assets/img/2024-06-22-HowtoAvoidtheOut-of-SpaceProblemAGuidelineforanMLEngineer_0.png"
date: 2024-06-22 19:50
ogImage: 
  url: /assets/img/2024-06-22-HowtoAvoidtheOut-of-SpaceProblemAGuidelineforanMLEngineer_0.png
tag: Tech
originalTitle: "How to Avoid the Out-of-Space Problem: A Guideline for an ML Engineer"
link: "https://medium.com/codenlp/free-up-your-disk-space-regularly-guideline-for-an-ml-engineer-c1a9eb94439b"
---


체크포인트, 도커 이미지, Python 환경, HF 모델 및 pip 캐시는 귀하가 완전한 인식 없이 시간이 지남에 따라 성장하여 디스크 공간을 더 많이 차지할 수 있습니다. 공간 부족 문제에 빠지지 않도록 주의하십시오.

# 소개

하드 드라이브가 얼마나 큰지 상관없이 언젠가는 공간 부족 문제에 직면하게 될 것입니다. 머신러닝 엔지니어 또는 데이터 과학자로서, 홈 폴더, 시스템 구조 또는 작업 공간 내 특정 위치가 시간이 지남에 따라 성장합니다. 이들은 주로 작업을 가속화하는 캐시이거나 특정 데이터의 전역 위치입니다. 이 글에서는 디스크의 일부 공간을 확보하기 위해 점검하고 조사해야 할 일반적인 위치 몇 군데를 모았습니다.

아래는 여러 달 동안 큰 정기 청소 없이 작업한 후 공간 사용 현황을 이해하기 위해 위치별로 나눈 것입니다.

<div class="content-ad"></div>


600G - 모델 체크포인트
290G - Docker 이미지, 컨테이너 및 캐시
231G - ~/miniconda3/envs
 87G - ~/.cache/huggingface
 41G - ~/miniconda3/pkgs
 15G - ~/.cache/pip


동일한 분할을 파이 차트로도 제시했습니다:

데이터 1TB는 많지 않아 보일 수 있습니다. HDD 디스크는 비교적 저렴하며, 4-8TB 디스크를 가지는 것은 비싸지 않을 수 있습니다. 그러나 GPU를 사용한 컴퓨팅을 허용하는 Macbook M1/2/3/4 칩을 갖고 있는 노트북의 경우 비쌔 일 수 있습니다. 그러므로 주의와 정기적인 저장 공간 정리가 도움이 될 수 있습니다.

# 모델 체크포인트


<div class="content-ad"></div>

transformers 라이브러리를 사용하여 ML 모델을 매일 훈련한다면, 알지 못할 수도 있는 많은 체크포인트를 얻게 될 수 있습니다. 체크포인트는 훈련 과정 중에 모델의 중간 복사본으로 생성되어, 훈련 중단의 경우 모델을 백업하는 역할을 합니다. 훈련이 완료되면 체크포인트를 제거해야 합니다. 하지만 이러한 체크포인트는 종종 무심코 하드 드라이브에 남아 있는 경우가 있습니다.

사용 중인 체크포인트의 개수에 대해 궁금하다면, 다음을 실행해 보세요.

```js
find . -name "checkpoint-*" | wc -l
```

제 경우에는 509개의 체크포인트가 있었습니다. 그들이 차지하는 용량을 확인해보겠습니다:

<div class="content-ad"></div>

```sh
find . -name "checkpoint-*" | \
  xargs -I {} du --bytes {} | \
  awk '{ print; total += $1 }; END { print "Total: " total/1024/1024/1024 " GB" }'
```

오버 600GB이네요. 상당한 용량이에요!

간단히 bash 스크립트를 설명하면:

- find — 모델 체크포인트의 기본 이름인 "checkpoint-"로 시작하는 폴더 목록을 생성합니다.
- xargs — 각 폴더를 du 명령어에 전달합니다. du 명령어는 find로 반환된 각 폴더에 대해 실행됩니다.
- du — 바이트 단위로 폴더의 총 크기를 계산합니다.
- awk — du에서 크기를 추출하여 합하여 단일 값으로 출력합니다.

<div class="content-ad"></div>

가장 큰 체크포인트부터 순서대로 나열하려면 다음 명령을 사용하면 됩니다:

```js
find . -name "checkpoint-*" | \
  xargs -I {} du --bytes {} | \
  sort -n | \
  awk '{ print $1/1024/1024/1024 " GB " $2 }'
```

이 명령을 실행하면 다음과 같이 출력됩니다 (가독성을 위해 경로는 체크포인트 이름으로 줄였습니다):

```js
4.59175 GB (...)/checkpoint-19960-epoch-2
4.59175 GB (...)/checkpoint-29940-epoch-3
4.59175 GB (...)/checkpoint-39920-epoch-4
4.59175 GB (...)/checkpoint-9980-epoch-1
4.60686 GB (...)/checkpoint-20000
4.60687 GB (...)/checkpoint-12000
4.60687 GB (...)/checkpoint-13000
4.60688 GB (...)/checkpoint-17000
6.52057 GB (...)/checkpoint-6605
6.52059 GB (...)/checkpoint-2310
9.16658 GB (...)/checkpoint-21139
9.16682 GB (...)/checkpoint-42278
```

<div class="content-ad"></div>

이 목록을 사용하여 각 체크포인트를 검토하고 유지 또는 제거할지 결정할 수 있습니다.

# Docker 이미지

도커 컨테이너는 ML 모델을 포함한 다양한 응용 프로그램을 배포하는 편리한 방법입니다. 도커 이미지를 만들거나 외부 레지스트리에서 가져올 수 있습니다. 이미지를 빌드하거나 가져오면 작업 스테이션에 그대로 남아 있습니다. 시간이 지남에 따라 가지고 있는 이미지의 수와 차지하는 디스크 공간의 양에 놀라게 될 수 있습니다.

도커가 사용한 공간을 확인하려면 다음 명령어를 실행하세요 [2]:

<div class="content-ad"></div>

```js
도커 시스템 df
```

위 명령어를 실행하면 다음과 같은 결과가 출력됩니다:

```js
TYPE TOTAL ACTIVE SIZE RECLAIMABLE
Images 133 69 264.4GB 180.6GB (68%)
Containers 160 3 11.54GB 9.582GB (83%)
Local Volumes 6 4 256.9MB 5.419kB (0%)
Build Cache 473 0 14.56GB 14.56GB
```

여기서, 우리는 도커 이미지의 총 크기에만 초점을 맞출 것입니다. 제 경우에는 180GB가 넘습니다.

<div class="content-ad"></div>

도커 정리를 처리하는 한 가지 방법은 프룬 명령어를 사용하는 것입니다 [3]. 문서에 따르면:

이 명령은 직접적인 경우만 제거합니다. 이미지를 개별적으로 확인하고 남은 것이 여전히 필요한지 결정해야 할 것입니다. 한 번만 시도해본 이미지거나 더 이상 필요하지 않은 이미지가 있을 수도 있습니다. 제거할 수 있는 더 오래된 이미지 버전도 있을 수 있습니다. 다른 경우에는 더 오래된 버전을 남겨두어 더 최신 버전과 비교하고 싶을 수도 있습니다.

이미지를 크기순으로 나열하기 위해 다음 명령어를 사용하세요:

```js
docker image ls --format "{.Size} {.ID} {.Repository}:{.Tag}" | \
  LANG=en_US sort -h | \
  column -t
```

<div class="content-ad"></div>

아래와 같이 출력됩니다:

```js
(...)
9.43GB  8ab26e6b7035  mczuk/poldeepner2:kpwr_timex_1.0
9.58GB  8b50a5264fa1  mczuk/poldeepner2:nkjp_base_sq
9.74GB  46d6ea3f8fea  nvidia/cuda:11.8.0-cudnn8-devel-ubuntu20.04
10.5GB  9788da8da088  <none>:<none>
10.8GB  484fc54f67e7  <none>:<none>
10.8GB  b9bb30fe2458  <none>:<none>
11.3GB  d37700724b89  <none>:<none>
18.3GB  1d9a58a6fcf5  nvcr.io/nvidia/pytorch:22.12-py3
```

특정 도커 이미지를 제거하려면 docker image rm ID [4]를 사용합니다.

# Miniconda 환경

<div class="content-ad"></div>

각 프로젝트마다 별도의 Python 환경을 실행하는 것은 좋은 습관입니다. 이렇게 하면 라이브러리 의존성 간 충돌을 피하거나 두 개 이상의 프로젝트가 동일한 환경을 공유하는 상황을 방지할 수 있습니다. 한 프로젝트를 업데이트하면 다른 프로젝트가 작동을 중지하는 일도 없어집니다.

Python 환경을 관리하는 인기 있는 솔루션 중 하나는 Miniconda입니다. Miniconda는 모든 환경을 한 곳에 유지함으로써, 보유한 환경 수와 사용 용량을 확인하기 쉽습니다. 환경은 ~/miniconda3/envs에 저장됩니다. 여러 환경을 보유하는 것은 문제가 되지 않을 수 있지만, GPU를 사용한 ML 모델 학습이나 추론을 할 때 NVidia 라이브러리(CUDA, cuDNN, cuBLAS 등)를 사용하는 경우가 많습니다. 이들은 상당히 많은 용량을 차지하고 있습니다. 기본 설정만 해도 약 10GB가 필요하며, 다른 의존성을 고려하지 않았습니다. Miniconda에서는 각 환경이 모듈의 복사본을 가지고 있기 때문에 공간 사용량이 더해지게 됩니다.

저의 경우, miniconda3/envs 폴더는 230GB를 차지하고 있으며 100개 이상의 환경이 있습니다. 이미 일부 환경을 용량 부족으로 제거했었죠 ;-)

오래된, 사용하지 않는 환경은 신중히 제거해야 합니다. 일부 오래된 프로젝트는 문제없이 함께 작동하는 라이브러리 조합을 가질 수 있습니다. 대부분의 프로젝트들은 환경을 생성할 수 있는 필수 라이브러리 목록(requirements.txt 또는 pyproject.toml)을 갖고 있어야 합니다. 그러나 몇 가지 모듈은 요구사항 목록이나 사용하는 라이브러리 중 하나에 특정 버전이 누락될 수 있습니다. 이러한 경우 정확한 라이브러리 조합을 다시 만드는 것이 어려울 수 있습니다. 이에 대한 해결책으로 pip freeze 명령을 사용하여 라이브러리의 정확한 버전을 덤프하고 나중에 검증할 수 있습니다. 기억해야 할 점은, 심지어 작은 변경이나 패치라도 라이브러리 간의 호환성에 일부 문제를 초래할 수 있는 일반적인 문제입니다. 해서서는 안 되지만 그렇게 됩니다.

<div class="content-ad"></div>

# Miniconda 패키지

Miniconda는 conda install 명령어로 설치된 패키지를 캐시합니다. 캐시는 ~/miniconda3/pkgs 폴더에 위치해 있습니다. 제 경우엔 62GB입니다. 해당 폴더를 열어보면 여러 버전의 패키지가 몇 개만 있는 것을 볼 수 있습니다. 예전 버전은 종종 필요하지 않을 수 있어 쉽게 삭제할 수 있습니다.

# Huggingface 모델 및 데이터셋

Huggingface는 transformers 라이브러리를 통해 사용하는 모델 및 데이터셋을 모두 캐시합니다. 제 캐시의 분석을 통해 알 수 있는 정보가 여기에 있습니다.

<div class="content-ad"></div>

허깅페이스 캐시에서 모델을 제거하는 것이 이전 파이썬 환경을 제거하는 것보다 안전합니다. 모델은 리포지토리에서 다시 다운로드할 수 있습니다. (단, 리포지토리에서 제거되지 않은 경우) 그럼에도 불구하고 캐시에는 기억하지 못하는 모델이 많이 있음을 알게 될 것입니다.

# 파이썬 pip 캐시

마지막 위치는 pip 캐시로, pip로 설치된 파이썬 모듈을 보관합니다. 캐시에 대한 정보를 표시하려면 pip cache info [6]를 사용할 수 있습니다. 아래와 같이 출력됩니다:

```js
패키지 인덱스 페이지 캐시 위치 (pip v23.3+): /home/czuk/.cache/pip/http-v2
패키지 인덱스 페이지 캐시 위치 (이전 버전 pips): /home/czuk/.cache/pip/http
패키지 인덱스 페이지 캐시 크기: 18297.6 MB
HTTP 파일 수: 3025
로컬 빌드된 휠 위치: /home/czuk/.cache/pip/wheels
로컬 빌드된 휠 크기: 457 kB
로컬 빌드된 휠 수: 5
```

<div class="content-ad"></div>

저의 경우에는 18 GB입니다. pip 캐시를 정리하기 위해 pip cache purge 명령을 사용할 수 있습니다.

# 결론

정기적인 디스크 사용량 관리는 공간 부족 오류로부터 자신을 보호하는 데 중요합니다. 급한 계산을 해야 할 때 메시지가 나타나면 정말 골치 아플 수 있습니다. 그런데 공간이 부족해서 계산 작업을 완료할 수 없는 경우가 발생할 수 있습니다. 로컬 워크스테이션이 아닌 워크스테이션에서 모델 훈련이나 다른 계산을 수행하고 있을 때 심지어 작업이 중단될 수도 있습니다.

클라우드 서비스를 사용할 때는 디스크 사용량 관리가 특히 중요합니다. 원격 인스턴스나 SageMaker와 같은 ML 플랫폼을 사용할 때 공간을 사용하면 요금이 청구됩니다. 로컬 워크스테이션에서 공간이 부족한 메시지가 나타날 수 있습니다. 클라우드에서는 저장 용량이 거의 무한합니다.

<div class="content-ad"></div>

# 참고 자료

- [바 그래프 도구](https://www.rapidtables.com/tools/bar-graph.html)
- [도커 CLI 시스템 리소스 확인](https://docs.docker.com/reference/cli/docker/system/df/)
- [도커 자원 정리 설정](https://docs.docker.com/config/pruning/)

<div class="content-ad"></div>

[4] https://docs.docker.com/reference/cli/docker/image/rm/

[5] https://docs.anaconda.com/

[6] https://pip.pypa.io/en/stable/cli/pip_cache/

[7] https://aws.amazon.com/pm/sagemaker

<div class="content-ad"></div>

[8] [https://medium.com/codenlp/6-things-about-sagemaker-i-wish-i-had-known-earlier-revision-2-e90511d58ca5#beed](https://medium.com/codenlp/6-things-about-sagemaker-i-wish-i-had-known-earlier-revision-2-e90511d58ca5#beed)