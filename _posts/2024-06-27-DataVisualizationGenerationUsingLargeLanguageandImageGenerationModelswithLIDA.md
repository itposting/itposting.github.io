---
title: "LIDA를 활용한 대규모 언어 및 이미지 생성 모델 사용 데이터 시각화 방법"
description: ""
coverImage: "/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_0.png"
date: 2024-06-27 19:07
ogImage: 
  url: /assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_0.png
tag: Tech
originalTitle: "Data Visualization Generation Using Large Language and Image Generation Models with LIDA"
link: "https://medium.com/towards-data-science/data-visualization-generation-using-large-language-and-image-generation-models-with-lida-69fcf95866ee"
---


## LIDA 라이브러리 개요, 시작하는 방법, 예시 및 앞으로 고려 사항

최근에 LIDA라는 라이브러리를 발견했어요 - 문법에 구애받지 않는 라이브러리로, 대형 언어 모델(Large Language Models, LLMs)과 이미지 생성 모델(Image Generation Models, IGMs)을 사용하여 데이터 시각화 및 인포그래픽을 자동으로 생성합니다. LIDA는 OpenAI와 Hugging Face와 같은 다양한 대형 언어 모델 제공 업체와 함께 작동합니다. 이 게시물에서는 이 라이브러리에 대한 고수준 개요를 제공하고 시작하는 방법을 안내하며 몇 가지 예시를 강조하고, 데이터 시각화 및 비즈니스 인텔리전스(Business Intelligence, BI) 분야에서 LLMs 및 IGMs의 사용에 대한 생각과 고려 사항을 공유할 거에요.

![데이터 시각화 및 인포그래픽 생성에 대한 이미지](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_0.png)

# 개요¹

<div class="content-ad"></div>

데이터 시각화를 만드는 것은 종종 복잡한 작업입니다. 데이터 조작, 코딩 및 디자인 기술이 필요한 작업이죠. LIDA는 개발 시간, 오류 발생 횟수, 그리고 전반적인 복잡성을 줄여주는 오픈 소스 라이브러리입니다.

LIDA는 다음 이미지에 표시된대로 4개의 모듈로 구성되어 있습니다. 각 모듈은 본격적인 시각화 생성 과정에서 고유한 목적을 가지고 있습니다.

![LIDA Modules](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_1.png)

- **SUMMARIZER**: 이 모듈은 데이터를 자연어로 요약합니다. 요약은 두 단계로 이루어집니다. 첫 번째 단계인 `Base Summary Generation`에서는 pandas 라이브러리를 사용하여 데이터 집합에서 속성을 추출하는 규칙을 적용하고 일반 통계를 생성하며, 데이터 집합의 각 열에 대해 몇 가지 샘플을 추출합니다. 두 번째 단계인 `Summary enrichment`에서는 `LLM`이나 사용자를 통해 기본 요약 단계의 내용을 보완하여 데이터 집합과 필드에 대한 의미적 설명을 포함합니다.
- **GOAL EXPLORER**: 이 모듈은 `SUMMARIZER` 모듈이 생성한 요약을 기반으로 데이터 탐색 목표를 생성합니다. 이 모듈에서 생성된 목표는 JSON 데이터 구조로 표시되며, 해당 목표에 대한 질문, 해당 질문에 대한 시각화 및 논리적 근거를 포함합니다.
- **VIZ GENERATOR**: 이 모듈은 3개의 하위 모듈(코드 프레임워크 생성기, 코드 생성기 및 코드 실행기)로 구성되어 있습니다. 이 모듈의 목표는 `GOAL EXPLORER` 모듈에서 나온 데이터 시각화 목표 또는 사용자가 생성한 새로운 시각화 목표에 따라 시각화 코드를 생성, 평가, 수리, 필터링 및 실행하는 것입니다.
- **INFOGRAPHER**: 이 모듈은 `VIZ GENERATOR` 모듈의 출력 및 시각화, 스타일 프롬프트를 기반으로 IGM을 활용하여 스타일이 적용된 인포그래픽을 생성합니다.

<div class="content-ad"></div>

LIDA는 LLM(Large Language Model)의 두 가지 핵심 능력을 활용합니다:

- 언어 모델링 — 이러한 능력은 의미 있는 시각화 목표 생성을 돕습니다.¹
- 코드 쓰기(즉, 코드 생성) — 이러한 능력은 데이터 시각화를 만드는 데 도움을 주며, 그 후에는 DALL-E나 잠재 확산(Latent Diffusion)과 같은 이미지 생성 모델에 입력으로 사용됩니다. 이 모델들은 스타일화된 인포그래픽을 생성합니다.¹

또한, LIDA 도구 내에서 프롬프트 엔지니어링이 사용됩니다.

"프롬프트 엔지니어링은 AI 언어 모델과의 상호작용을 위해 설계, 최적화 및 개선된 프롬프트를 사용하는 프로세스입니다. 프롬프트란 AI 시스템에 입력되어 특정 응답이나 출력을 유발하기 위한 질문, 진술 또는 요청입니다."²

<div class="content-ad"></div>

LIDA에 프롬프트 엔지니어링 기능을 통합하는 몇 가지 방법 중 하나는 프롬프트를 사용하여 6 가지 평가 차원을 생성하고 정의하는 것이며, 사용자가 시각화를 포맷하는 스타일 프롬프트를 지정할 수 있는 능력을 가지고 있습니다.

이 게시물의 나중에 나오는 예제는 이 섹션에서 언급된 몇 가지 기능에 대한 자세한 내용을 더 보여줍니다. 그리고 LIDA에 대해 더 많은 정보를 읽을 수 있습니다.

# 시작하기

LIDA를 시작하는 방법은 2가지가 있습니다. 파이썬 API를 통해 시작하거나 하이브리드 사용자 인터페이스를 통해 시작할 수 있습니다. 이 섹션에서는 LIDA 라이브러리의 선택적 번들 UI 및 웹 API를 사용하여 로컬 기기에서 사용자 인터페이스를 시작하는 방법을 보여줍니다.

<div class="content-ad"></div>

참고: 이 예시에서는 OpenAI를 사용하고 있습니다. 다른 LLM 제공 업체를 사용하거나 Python API를 사용하려면 여기 있는 GitHub 문서를 확인해보세요.

## 단계 1: 필요한 라이브러리 설치

컴퓨터에 다음 라이브러리를 설치하세요.

```js
pip install lida
```

<div class="content-ad"></div>

```js
pip install -U llmx openai
```

## 단계 2: OpenAI API 키를 저장할 변수 생성하기

OpenAI API 키를 만들려면 프로필로 이동하여 `사용자 API 키` 항목을 선택한 다음 + 새 비밀 키 만들기를 선택하십시오.

![이미지](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_2.png)


<div class="content-ad"></div>

API 키를 복사하세요. 새 터미널 창에서 다음과 같은 변수인 OPENAI_API_KEY에 API 키를 저장하세요.

```js
export OPENAI_API_KEY=""
```

## 단계 3: UI 웹 앱 시작하기

터미널 창에서 다음 명령어로 LIDA UI 웹 앱을 시작하세요.

<div class="content-ad"></div>

```bash
lida ui --port=8080 --docs
```

웹 브라우저에서 "localhost:8080"으로 이동하면 시작 준비가 완료됩니다! 라이브 데모 또는 데모 탭 중 하나를 선택하여 웹 앱을 확인할 수 있습니다.

![웹 앱 예시](https://miro.medium.com/v2/resize:fit:1400/1*yfIcWLTjCfhmJbeuD4jtOw.gif)

# 웹 앱 예시


<div class="content-ad"></div>

이 섹션에서는 Kaggle의 Top 10 Films US Box Office 데이터 세트³를 사용한 몇 가지 예제와 팁을 살펴봅니다.

## 단계 1: 시각화 라이브러리/언어 선택

데이터 시각화 또는 요약을 생성하기 전에 사용할 시각화 라이브러리를 선택하세요. 선택할 수 있는 옵션은 4가지가 있습니다: Altair, Matplotlib, Seaborn, 그리고 GGPlot. 시작하기 전에, Matplotlib을 기반으로 하는 데이터 시각화용 Python 라이브러리인 Seaborn을 선택하세요.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*6iWPYsaP7Cm-dkerFG_ooQ.gif)

<div class="content-ad"></div>

팁: 어떤 라이브러리부터 시작해야 할지 잘 모르겠으면 하나를 선택하고 나중에 바꿀 수 있어요! 데이터를 업로드한 후에도 시각화 라이브러리/문법을 나중에 바꿀 수 있어요. 데이터를 로드한 후에 바꾸려고 하면 오류가 발생할 수 있는데, 간단히 새로고침하면 문제가 해결될 거예요.

## 단계 2: 생성 설정 검토

오른쪽에 생성 설정을 수정할 수 있는 옵션이 있어요. 여기서 모델 제공 업체를 선택하고 생성에 사용할 모델을 선택하며, 최대 토큰, 온도, 메시지 수 등의 다른 필드를 조정할 수 있어요. 지금은 기본 설정을 유지해 주세요.

![이미지](https://miro.medium.com/v2/resize:fit:1400/1*fJ8MRGf7ip2ATKfAKARs9A.gif)

<div class="content-ad"></div>

## 단계 3: 데이터 업로드

기본 매개변수를 설정한 후 데이터 세트를 업로드하세요. 파일을 클릭하거나 드래그하여 웹 앱에 데이터 세트를 업로드할 수 있습니다. 또는 제공된 샘플 파일 중 하나를 사용할 수도 있습니다.

![image](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_3.png)

팁: 파일을 업로드하려고 할 때 오류가 발생하면 선택한 모델 공급 업체의 사용량 및 결제 액세스를 확인해보세요. 액세스 문제는 LIDA에서 데이터 파일 업로드 문제로 이어질 수 있습니다. 또한, 터미널 창에 에러 메시지가 표시됩니다. 문제 해결에 유용한 경우가 있습니다.

<div class="content-ad"></div>

주의: LIDA 홈페이지로 다시 전환하는 경우 현재 화면의 작업이 손실될 수 있으니 유의하시기 바랍니다!

## 단계 4: 데이터 요약 확인

데이터 요약 섹션은 데이터 세트에 대한 설명과 열 유형, 고유 값 수, 열 설명, 샘플 값 등을 요약한 내용을 제공합니다. 이 결과물은 이전에 언급된 SUMMARIZER 모듈의 결과입니다.

다음 이미지는 미국 박스 오피스 최상위 10개 영화 데이터 세트에 대한 데이터 요약을 보여줍니다. 데이터 세트 전체에 대한 설명과 데이터 세트의 9개 열에 대한 설명이 포함되어 있습니다.

<div class="content-ad"></div>

![2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_4](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_4.png)

JSON 딕셔너리 형식으로 데이터 요약을 보려면 View raw summary?를 선택하세요.

![Data Visualization](https://miro.medium.com/v2/resize:fit:1400/1*sRCct7rrQbHdof0_esW-qw.gif)

## 단계 5: 목표 탐색 검토

<div class="content-ad"></div>

이 섹션에는 업로드된 데이터셋을 기반으로 자동으로 생성된 목표 또는 가설 목록이 표시됩니다. 각 목표는 질문으로 제시되며, 시각화가 무엇을 표시할지 설명이 포함되어 있습니다. 이 출력물은 이전에 언급된 GOAL EXPLORER 모듈의 결과입니다.

여기서 여러 가설을 읽어볼 수 있고, Visualization Generation 섹션에서 시각화할 항목을 선택할 수 있습니다.

![이미지](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_5.png)

## 단계 6: 시각화 생성

<div class="content-ad"></div>

이전 섹션에서 선택한 목표, Goal Exploration에 따라, 해당 목표를 시각화하는데 사용된 Python 코드와 함께 시각화를 볼 수 있습니다.

다음 이미지는 "영화 발매 월별 분포는 무엇인가?"라는 목표에 대한 결과를 보여줍니다. 왼쪽에는 시각화인 수직 막대 차트가 있고, 오른쪽에는 시각화를 생성하는 데 사용된 Python 코드가 있습니다. 이 코드 조각은 외부 사용을 위해 복사할 수 있습니다.

![Visualization](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_6.png)

또는 Goal Exploration 섹션에 나열된 목표 이외에도 새로운 시각화 목표를 입력할 수 있습니다.

<div class="content-ad"></div>

예를 들어, 다음 이미지는 "가장 큰 평균 예산을 갖는 상위 5개 장르는 무엇인가요?"에 대한 결과를 보여줍니다.

![image](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_7.png)

참고: 목표 오른쪽에 있는 '생성' 버튼을 선택하면 시각화가 새로 고침됩니다. 이는 색 구성이 변경되는 등의 약간의 변화를 일으킬 수 있습니다.

## 단계 7: 시각화 수정 및 평가

<div class="content-ad"></div>

시각화가 생성되면 사용할 수 있는 4개의 탭이 있습니다: 개선(Refine), 설명(Explain), 평가(Evaluate) 및 추천(Recommend).

![image](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_8.png)

첫 번째 탭인 개선(Refine)은 자연어 명령을 사용하여 차트를 수정합니다.

다음 이미지는 "월별 영화 개봉 분포가 어떻게 되는가?"라는 차트를 개선 탭을 사용하여 수정한 내용을 보여줍니다. 차트는 월을 날짜 순서대로 정렬하고, 수평 막대 차트로 값을 표시하고, 각 막대에 계수 값을 추가하는 자연어 명령을 사용하여 수정되었습니다.

<div class="content-ad"></div>


![Data Visualization Generation Using Large Language and Image Generation Models with LIDA](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_9.png)

팁: 스타일 프롬프트가 명확하고 간결하며 구체적인지 확인하세요! 그렇지 않으면 왜곡된 시각화, 예상치 못한 결과 또는 자연어 명령이 차트로 렌더링되지 않을 수 있습니다. 프롬프트 작성은 예술이므로 효과적인 스타일 프롬프트를 작성하려면 일부 수정이 필요할 수 있습니다.

일부 스타일 프롬프트가 예상대로 나오지 않았다면 몇 가지 스타일 프롬프트 후 시각화를 재설정해야 한다면 시갤 채팅 기록 버튼을 사용하여 시갤 불러오기.

![Data Visualization Generation Using Large Language and Image Generation Models with LIDA](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_10.png)

<div class="content-ad"></div>

두 번째 탭 '설명'은 시각화가 어떻게 만들어졌는지에 대한 텍스트 설명을 제공합니다. 데이터 변환, 차트 요소, 코드 등을 설명합니다.

![이미지](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_11.png)

세 번째 탭 '평가'는 생성된 차트를 6가지 차원에서 평가합니다: 버그, 변환, 준수, 유형, 인코딩 및 미적 감각. 각 차원은 5점 만점으로 평가되며, 해당 등급을 받은 이유에 대한 설명이 포함되어 있습니다.

![이미지](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_12.png)

<div class="content-ad"></div>

위의 이미지에서 볼 수 있듯이, 차트를 자동으로 수정하는 옵션이 있습니다. 오른쪽 하단에 있는 버튼인 "차트 자동 수정"을 사용할 수 있습니다. 차트 평가에서 제공된 권장 사항에 동의한다면, 이것은 수정을 적용하는 좋고 빠른 방법입니다! 아래 이미지는 심미성 평가를 기반으로 차트를 자동으로 수정한 후 업데이트된 차트를 보여줍니다.

![image](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_13.png)

네 번째 탭인 "추천!"은 유사한 차트와 해당 코드 조각을 생성하며, 초기 목표에 얽매이지 않습니다. 이는 데이터로부터 얻을 수 있는 기타 차트나 통찰을 떠올리는 데 유용할 수 있습니다.

![image](/assets/img/2024-06-27-DataVisualizationGenerationUsingLargeLanguageandImageGenerationModelswithLIDA_14.png)

<div class="content-ad"></div>

# 생각과 고려사항

이 섹션에서는 데이터 시각화 및 비즈니스 인텔리전스 분야에서 LLMs 및 IGMs의 사용에 대한 몇 가지 고려 사항을 강조합니다. 이는 자동 데이터 시각화 생성을 포함하나 이에 한정되지는 않습니다.

## 평가 지표

LIDA는 2가지 지표를 사용합니다 — 시각화 오류율(VER)과 자가평가 시각화 품질(SEVQ).

<div class="content-ad"></div>

VER는 생성된 시각화 중 코드 컴파일 오류를 의미하는 백분율을 보여줍니다.

SEVQ는 GPT-4와 같은 LLMs를 사용하여 생성된 시각화의 품질을 평가합니다. 코드 정확성, 데이터 변환, 목표 부합성, 시각화 유형, 데이터 인코딩 및 미적 요소라는 6가지 차원의 평균 점수를 제공합니다. 이러한 차원들은 각각 LLM에 제공된 프롬프트를 기반으로 점수가 생성됩니다. 다음은 사용된 프롬프트의 스케치를 확인할 수 있는 논문 링크입니다¹. LIDA 웹 앱의 평가 탭에 이러한 차원들이 나오는 것을 기억하실 겁니다.

이러한 측정 항목은 시각화 생성을 평가하며, 중요한 점을 제기합니다. LLMs와 IGMs를 데이터 시갖화와 BI 도구에 사용하는 방식을 평가할 때는 이 점을 주의해야 합니다. 이 분야가 계속 발전함에 따라, 실무자들은 조직을 위해 데이터 시갖화와 BI 솔루션에 LLMs와 IGMs를 도입할 때 이러한 점을 염두에 두어야 하며, 앞으로 고려해야 할 메트릭이 무엇인지, 어떤 프로세스가 구축되어야 하는지, 출력물이 정확하고 신뢰할 수 있으며 설명 가능하며 통제되는지를 어떻게 보장할지 스스로에게 물어보아야 합니다.

## 배포 — 환경 설정 고려 사항

<div class="content-ad"></div>

조직 내 데이터 시각화에 LLM 및 IGM을 활용할 때는 배포에 관련된 몇 가지 사항을 고려해야 합니다.

데이터 시각화를 위해 이러한 모델을 사용하거나 일반적으로 사용할 경우, 모델 크기, 데이터셋 크기, 사용자 수 등과 같은 요소에 따라 많은 리소스가 필요할 수 있습니다. 이를 올바르게 계획하고 효율적으로 수행하지 않으면 높은 비용이 발생할 수 있습니다. 원활한 구현을 위해 올바른 인프라가 마련되어 있는지 확인하는 것이 중요합니다. 특정 사용 사례에 보다 정밀한 LLM을 테스트하면 전반적인 영향을 줄일 수도 있습니다.

또한 데이터 시각화를 위해 LLM 및 IGM을 사용할 때 데이터 보안과 거버넌스가 중요합니다. 어떤 도구를 사용하더라도 도구 내에서 데이터가 안전하고 사용 중에 거버넌스가 지속되도록 보장하는 것이 중요합니다.

## 차트 설명

<div class="content-ad"></div>

이전 예제에서 보듯이, LIDA 내에서 생성된 차트 설명은 차트가 생성된 방식에 대한 세부 정보에 초점을 맞추고 있습니다. 데이터 변환, 차트 요소 및 생성된 코드에 대한 내용입니다. 이는 데이터 세트와 함께 차트를 만드는 개발자에게 도움이 됩니다. 그러나 비즈니스 사용자들에게는 이러한 유형의 문맥이 유익하지 않습니다. 비즈니스 사용자와 분석가는 시각화 내 데이터 포인트에 대한 통찰을 포함하는 차트 설명에서 혜택을 받을 것입니다. 그뿐만이 아니라 차트 요소와 구조뿐만 아니라 시각화 내 데이터 포인트에 대한 통찰을 제공하는 자연 언어 텍스트는 개인의 역할과 관계없이 데이터 시각화에서 중요한 통찰력을 제공하는 것에 도움이 될 수 있습니다.

비즈니스 인텔리전스(BI) 도구에 통합 가능한 일부 자연어 생성(NLG) 도구가 오늘날에 개발되어 있습니다. LLMs, IGMs 및 데이터 시각화 솔루션이 계속 발전하는 공간을 관찰하는 것이 흥미로울 것입니다.

BI와 NLG를 함께 본 적이 없나요? 간단한 소개를 보려면 이 GitHub 페이지를 확인해보세요.

앞으로 나아가면서, 최종 사용자를 고려하고 그들의 목표와 관심사에 기반하여 해당 관객에게 적합한 LLM + IGM + 데이터 시각화 솔루션을 고려하는 것이 중요합니다.

<div class="content-ad"></div>

## 프롬프트를 사용한 차트 디자인

이전 예시에서는 LLMs와 IGMs를 사용하여 데이터 시각화를 생성하는 방법을 보여주었습니다. 이러한 차트들은 자동으로 생성되지만, 여전히 완벽하게 디자인되도록 수정이 필요합니다. 종종 첫 번째 차트를 그대로 두지 못할 수도 있습니다. 이때는 LIDA의 Auto Repair 기능이 필요한데, 이 기능은 수정해야 하는 내용 중 일부만 캡처하며, 데이터 시각화 도메인에서의 경험과 지식이 필요한 스타일 프롬프트를 포함합니다.

이러한 스타일 프롬프트는 사용자가 자연어로 입력하며, 차트 제목 수정, 차트 색상 변경, 차트 값 정렬 등의 요청이 포함될 수 있습니다.

이러한 스타일 프롬프트를 사용하면 차트를 개발하는 데 필요한 시간을 절약할 수 있습니다. 코드 작성 시간을 줄이고, 코드 디버그와 형식 지정 시간을 줄일 수 있습니다.

<div class="content-ad"></div>

하지만 데이터 시각화 생성 중 프롬프트가 소개되면, 좋은 프롬프트가 무엇인지 이해하는 것이 중요해집니다. 명확하고 간결하며 구체적인 프롬프트는 다른 것보다 더 나은 결과를 얻게 됩니다. 명확하지 않은 요청은 부적합한 시각화나 예기치 않은 결과를 초래할 수 있습니다.

하지만 이것은 데이터 시각화 생성에서 프롬프트를 활용해서는 안 된다는 것을 의미하지는 않습니다. 대신, 시작할 때 학습 곡선이 존재할 수 있다는 것을 지적하는 것입니다. 적절한 프롬프트를 찾는 것은 일부 테스트를 필요로하며, 명확히 작성된 명령이 필요합니다.

전반적으로, LIDA는 LLMs, IGMs, & 데이터 시각화 분야의 일부 진보를 배우는 데 좋은 오픈 소스 도구입니다. Victor Dibia의 전체 논문을 여기에서 확인하고 웹 앱이나 Python API를 사용하여 LLMs 및 IGMs가 데이터 시각화 생성 방식을 바꾸고 있는 방법을 더 알아보세요.

Payal은 데이터 및 인공 지능 전문가입니다. 여가 시간에는 읽기, 여행, Medium에 글 쓰기를 즐깁니다. 그녀의 작품을 좋아하신다면, 그녀의 목록을 팔로우하거나 구독하여 이야기를 놓치지 마세요!

<div class="content-ad"></div>

상기 기사는 개인적인 의견이며 IBM의 입장, 전략 또는 의견을 반영하는 것은 아닙니다.

참고 자료

[1]: Dibia, Victor. LIDA: A Tool for Automatic Generation of Grammar-Agnostic Visualizations and Infographics Using Large Language Models, Microsoft Research, 8 May 2023, aclanthology.org/2023.acl-demo.11.pdf.

[2]: Vagh, Avinash. “NLP and Prompt Engineering: Understanding the Basics.” DEV Community, DEV Community, 6 Apr. 2023, dev.to/avinashvagh/understanding-the-concept-of-natural-language-processing-nlp-and-prompt-engineering-35hg.

<div class="content-ad"></div>

[3]: Films, Will’s. “Top 10 Films at the US Box Office 2000–2023.” Kaggle, 20 Mar. 2024, www.kaggle.com/datasets/willsfilms/top-10-films-at-the-us-box-office-2000-2023. (CC0)