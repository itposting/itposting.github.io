---
title: "웹 스크래핑으로 데이터 파이프라인 구축하기 단계별 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-BuildingDataPipelineswithWebScrapingAStep-by-StepGuide_0.png"
date: 2024-06-23 20:10
ogImage: 
  url: /assets/img/2024-06-23-BuildingDataPipelineswithWebScrapingAStep-by-StepGuide_0.png
tag: Tech
originalTitle: "Building Data Pipelines with Web Scraping: A Step-by-Step Guide"
link: "https://medium.com/@pillaigreesh16/building-data-pipelines-with-web-scraping-a-step-by-step-guide-3ab712f1412b"
---


웹 스크레이핑은 웹을 거대한 데이터 광산으로 변신시키는 기술이에요. 여기에는 모든 정보가 발굴되기를 기다리는 잠재적 보석이 숨어 있답니다.

웹 스크레이핑 또는 데이터 스크래핑은 인터넷에서 콘텐츠와 정보를 수집하는 편리한 방법이에요. 기본적으로 소프트웨어나 봇을 사용해 웹사이트를 방문하고 페이지를 가져와 필요한 데이터를 추출하는 과정을 말해요. 이 프로세스를 자동화함으로써 이러한 봇은 아주 빠르게 다량의 데이터를 수집할 수 있어요.

어떤 도구를 사용하든, 웹 스크레이핑 도구의 작동 방식은 아래와 같아요:

단계 1: 서버로 HTTP 요청을 보내는 것부터 시작돼요.

<div class="content-ad"></div>

단계 2: 그런 다음, 웹 사이트의 코드를 추출하고 분해합니다.

단계 3: 마지막으로, 중요한 데이터를 로컬로 저장합니다.

웹 스크레이퍼는 사이트에 액세스할 수 있는 권한이 필요합니다. 따라서 먼저 하는 일은 대상 사이트로 HTTP 요청을 보내는 것입니다. 사이트가 승인하면 스크레이퍼가 해당 사이트의 HTML 또는 XML 코드를 읽고 추출할 수 있습니다. 이 코드는 사이트의 콘텐츠와 구조에 대한 청사진과 같습니다.

스크레이퍼는 그런 다음 코드를 구문 분석합니다. 이는 기본적으로 코드를 부분으로 나누어 특정 요소나 객체를 식별하고 원하는 특정 요소나 정보를 가져올 수 있도록 하는 것을 의미합니다. 이것은 특정 텍스트, 평점, 클래스, 태그, ID 또는 필요한 다른 정보와 같은 것들일 수 있습니다.

<div class="content-ad"></div>

웹 크롤러가 HTML 또는 XML에 접근하여 데이터를 가져오고 구문 분석한 후, 해당 데이터를 로컬로 저장합니다. 이미 봇에게 수집하길 원하는 내용을 알려줬으니, 무엇을 찾아야 하는지 알고 있어요. 이 데이터는 주로 구조화된 형식으로 저장되며, .csv 또는 .xls과 같은 Excel 파일 형식으로 저장합니다.

## 이것이 웹 스크래핑의 기본 아이디어입니다!

먼저, 어떤 웹사이트(들)를 스크래핑하고 어떤 특정 데이터를 추출하려는지 결정해야 합니다. 그런 다음, 이 데이터가 웹사이트의 백엔드 코드에서 어디에 위치하는지 찾아야 합니다. 여러분의 목표는 관련 콘텐츠를 감싸고 있는 고유한 태그를 찾는 것입니다. 예를 들면 `div` 태그 같은 거죠.

이러한 태그들을 식별했다면, 이를 선호하는 스크래핑 소프트웨어에 입력해야 합니다. 이렇게 하면 봇이 정확히 어디를 봐야 하는지와 무엇을 추출해야 하는지 알게 됩니다. 다음 단계는 스크래핑 프로세스를 실행하는 것이죠. 여기서 스크래퍼는 사이트에 액세스 권한을 요청하고, 데이터를 추출하며, 구문 분석합니다.

<div class="content-ad"></div>

데이터를 추출하고 구문 분석하고 수집한 후에는 저장해야합니다. 이제 필요한 데이터를 가지고 있으므로 자유롭게 다루고 원하는 대로 사용할 수 있습니다.

웹 스크래핑에 많이 사용되는 여러 도구와 라이브러리가 있으며, 각각의 특징과 장점이 있습니다. 인기있는 몇 가지 도구는 다음과 같습니다:

- Beautiful Soup:

HTML 및 XML 문서를 구문 분석하는 파이썬 라이브러리입니다. HTML 페이지를 구문 분석하고 데이터를 추출하기 위한 파싱 트리를 생성합니다.

<div class="content-ad"></div>

사용 사례: 간단한 스크래핑 작업 및 데이터 추출.

- Scrapy:

웹 스크레이퍼를 구축하기 위한 오픈 소스 Python 프레임워크입니다. Beautiful Soup보다 더 강력하고 견고하며 더 복잡한 스크래핑 작업에 좋습니다.

사용 사례: 대규모 스크래핑 프로젝트 및 데이터 추출 워크플로우.

<div class="content-ad"></div>

- Selenium:

웹 브라우저를 자동화하는 도구입니다. 주로 웹 애플리케이션을 테스트하는 데 사용되지만 JavaScript와 상호 작용이 필요한 동적 콘텐츠를 스크래핑하는 데도 사용할 수 있습니다.

활용 사례: 양식 작성 및 버튼 클릭과 같이 상호 작용이 필요한 웹 사이트에서 동적 콘텐츠를 스크래핑하는 것.

- Puppeteer:

<div class="content-ad"></div>

Node.js 라이브러리인 Puppeteer는 Chrome 또는 Chromium을 DevTools 프로토콜을 통해 제어하기 위한 고수준 API를 제공합니다. Selenium과 유사하지만 특히 Chrome을 위한 것입니다.

사용 사례: 동적 웹사이트 스크래핑 및 자동 브라우저 작업 수행.

Beautiful Soup와 Scrapy는 Python 사용자에게 훌륭한 도구입니다.

아래는 웹 스크래핑에 관한 프로젝트이며, 아래 웹사이트는 저에게 기초 학습을 도와주었습니다: Web Scraping & NLP in Python | DataCamp

<div class="content-ad"></div>

여기서 Project Gutenberg 웹사이트에서 책 정보를 가져올 것입니다.

Project Gutenberg는 60,000권 이상의 무료 eBook을 제공하는 자원 봉사자 주도의 디지털 도서관입니다. 1971년 Michael S. Hart에 의해 설립되어 세계에서 가장 오래된 디지털 도서관입니다. 이 컬렉션은 무료로 공개적으로 이용 가능합니다. 여기에는 고전 문학, 참고 자료 및 기타 문화적으로 중요한 텍스트들이 포함되어 있습니다. 책은 일반 텍스트, HTML 및 ePub 형식으로 제공되며, 다양한 기기에서 접근할 수 있습니다. Project Gutenberg의 목표는 eBook의 창작과 배포를 촉진하고 이러한 작품들을 미래 세대를 위해 보존하는 것입니다.

스크레이핑을 위해 Python 패키지 requests를 사용하여 이 웹 데이터에서 소설을 추출할 것입니다. 그런 다음 Natural Language ToolKit (nltk)을 사용하여 소설을 분석해볼 것입니다.

아래는 'Dead Men Tell No Tales'라는 epub을 스크랩하는 예시입니다.

<div class="content-ad"></div>

## 1. 라이브러리 설치

```js
# !pip install html5lib
# !pip install contractions
# !pip install spacy
# python -m spacy download en_core_web_sm (명령 프롬프트에서 실행)
```

html5lib은 HTML 및 XHTML 문서를 구문 분석하기 위한 순수한 Python 라이브러리입니다.

contractions은 텍스트에서 축약어를 확장하는 데 사용됩니다 (예: "don`t"를 "do not"로 바꿉니다).

<div class="content-ad"></div>

스파시는 파이썬에서 고급 자연어 처리(NLP)를 위한 오픈 소스 라이브러리입니다.

## 2. 필요한 모든 파이썬 라이브러리와 모듈을 임포트하세요

```js
import re  #정규 표현식을 위해
import bs4  #HTML 및 XML 문서를 구문 분석하기 위해
import nltk  #자연어 처리 (NLP) 작업을 위해
import spacy  #고급 NLP 작업을 위해
import string  #일반적인 문자열 작업을 위해
import requests  #HTTP 요청을 만들기 위해
import contractions  #텍스트 내 축약어 확장을 위해
import seaborn as sns  #통계적 데이터 시각화를 위해
from nltk.util import ngrams  #n-그램 생성을 위해
from bs4 import BeautifulSoup  #HTML 및 XML을 구문 분석하기 위해
from collections import Counter  #해시 가능한 객체를 계산하기 위해
import matplotlib.pyplot as plt  #데이터 플로팅을 위해
from nltk.corpus import stopwords  #일반적인 불용어에 액세스하기 위해
from nltk.tokenize import RegexpTokenizer
from nltk.tokenize import word_tokenize,sent_tokenize #텍스트 토큰화를 위해

nltk.download('punkt')
nltk.download('words')
nltk.download('stopwords')
nltk.download('maxent_ne_chunker')
nltk.download('averaged_perceptron_tagger')
```

NLTK 자원 다운로드하기:

<div class="content-ad"></div>

- 그런 다음 코드는 여러 필수 NLTK 자원을 다운로드합니다:
    - punkt: 텍스트를 문장이나 단어 목록으로 분할하는 토크나이저입니다.
    - words: 영어 단어 목록입니다.
    - stopwords: 영어에서 흔히 사용되는 불용어 목록입니다.
    - maxent_ne_chunker: 미리 훈련된 개체명 청커입니다.
    - averaged_perceptron_tagger: 품사 태거입니다.

이 설정을 통해 다양한 NLP 및 텍스트 처리 작업을 수행하기 위해 필요한 모든 라이브러리와 자원이 제공됩니다.

## 3. URL에서 HTML 콘텐츠를 가져와 표시하기

```js
# URL 저장
url = 'https://www.gutenberg.org/cache/epub/1703/pg1703-images.html'
# 요청 보내고 객체 유형 확인
r = requests.get(url, verify=False)
# 응답 객체에서 HTML 추출하고 출력
html = r.text
print(html)
```

<div class="content-ad"></div>

```js
# 출력 예시:
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><style>
#pg-header div, #pg-footer div {
    all: initial;
    display: block;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 2em;
}
#pg-footer div.agate {
    font-size: 90%;
    margin-top: 0;
    margin-bottom: 0;
    text-align: center;
}
#pg-footer li {
    all: initial;
    display: block;
    margin-top: 1em;
    margin-bottom: 1em;
    text-indent: -0.6em;
}
#pg-footer div.secthead {
    font-size: 110%;
    font-weight: bold;
```

웹페이지의 URL은 url 변수에 저장되어 있습니다. 이 URL은 'Dead Men Tell No Lies' 책의 온라인 epub 버전을 얻을 수 있는 페이지를 가리킵니다.
requests.get 메서드는 지정한 URL로 HTTP GET 요청을 보냅니다.

verify=False는 SSL 인증서 확인을 비활성화하는 데 사용됩니다(운영 환경에서 사용하지 않는 것이 좋음).

<div class="content-ad"></div>

응답의 HTML 콘텐츠는 r.text를 사용하여 추출됩니다.

## 4. BeautifulSoup를 사용하여 HTML 구문 분석하기

```js
# HTML에서 BeautifulSoup 객체 생성
soup = BeautifulSoup(html, "html.parser")
# soup 제목 가져오기
soup.title

#출력
<title>
      Dead Men Tell No Tales, by E. W. Hornung
    </title>
```

이 코드는 "html.parser"를 사용하여 HTML 콘텐츠를 구문 분석하는 BeautifulSoup 객체를 초기화합니다. 그런 다음 이 웹 페이지의 제목인 "Dead Men Tell No Tales, by E. W. Hornung"을 추출하고 출력합니다.

<div class="content-ad"></div>

```js
# 문자열로 된 스프 타이틀 가져오기
soup.title.string

#결과
'\r\n      Dead Men Tell No Tales, by E. W. Hornung\r\n    '
```

이 코드는 타이틀 태그의 텍스트 내용을 문자열로 추출합니다. 결과에는 웹 페이지의 제목이 포함되며, 앞뒤의 공백 문자도 포함되어 있습니다.

## 5. BeautifulSoup로 하이퍼링크 추출하기

```js
# 스프에서 하이퍼링크 가져오기 및 처음 몇 개 확인하기
soup.findAll('a')[:8]

# 결과
[<a class="reference external" href="https://www.gutenberg.org">www.gutenberg.org</a>,
 <a class="pginternal" href="#link2HCH0001"> CHAPTER I. </a>,
 <a class="pginternal" href="#link2HCH0002"> CHAPTER II. </a>,
 <a class="pginternal" href="#link2HCH0003"> CHAPTER III. </a>,
 <a class="pginternal" href="#link2HCH0004"> CHAPTER IV. </a>,
 <a class="pginternal" href="#link2HCH0005"> CHAPTER V. </a>,
 <a class="pginternal" href="#link2HCH0006"> CHAPTER VI. </a>,
 <a class="pginternal" href="#link2HCH0007"> CHAPTER VII. </a>]
```

<div class="content-ad"></div>

이 코드는 HTML에서 모든 앵커(`a`) 태그를 찾아 처음 여덟 개를 출력합니다. 각 앵커 태그에는 하이퍼링크(href 속성)와 관련된 텍스트가 포함되어 있습니다.

## 6. HTML에서 텍스트 내용 추출 및 인쇄

```js
# 뷰티풀수프에서 텍스트를 추출하고 인쇄합니다
text = soup.get_text()
print(text)
```

```js
#출력: 예시
   Dead Men Tell No Tales, by E. W. Hornung

The Project Gutenberg eBook of Dead Men Tell No Tales
This ebook is for the use of anyone anywhere in the United States and
most other parts of the world at no cost and with almost no restrictions
whatsoever. You may copy it, give it away or re-use it under the terms
of the Project Gutenberg License included with this ebook or online
at www.gutenberg.org. If you are not located in the United States,
you will have to check the laws of the country where you are located
before using this eBook.
Title: Dead Men Tell No Tales

Author: E. W. Hornung

Release date: April 1, 1999 [eBook #1703]
                Most recently updated: June 10, 2022
Language: English
Credits: Produced by An Anonymous Project Gutenberg Volunteer, and David Widger

*** START OF THE PROJECT GUTENBERG EBOOK DEAD MEN TELL NO TALES ***

      DEAD MEN TELL NO TALES

      By E. W. Hornung
```

<div class="content-ad"></div>

이 코드는 파싱된 HTML 문서에서 모든 텍스트 콘텐츠를 추출하기 위해 get_text() 메서드를 사용합니다. 그런 다음 print 문은 이 텍스트 콘텐츠를 콘솔에 출력하여 HTML 태그없이 웹페이지의 전체 텍스트 콘텐츠를 표시합니다.

## 7. 추출된 텍스트 정리

```js
def clean_text(text):
    # 비 문자 숫자 문자를 제거합니다 (공백 및 구두점 제외)
    text = re.sub(r'[^a-zA-Z0-9\s\.\,]', '', text)
    # 여러 공백을 단일 공백으로 대체합니다
    text = re.sub(r'\s+', ' ', text)
    # 모든 숫자를 공백으로 대체합니다
    text = re.sub(r'\d+', '', text)
    text = contractions.fix(text)
    text = text.lower()
    return  " ".join(text.split())


# 'text' 열에 정리 함수를 적용합니다
text_c = clean_text(text)
text_c
```

이 코드는 다음과 같은 정리 단계를 수행합니다:

<div class="content-ad"></div>

- 알파벳 숫자만 남기기: 문자, 숫자, 공백, 마침표 및 쉼표만 유지합니다.
- 공백 정규화: 여러 개의 공백을 단일 공백으로 대체합니다.
- 숫자 제거: 텍스트에서 모든 숫자를 제거합니다.
- 축약형 풀기: 축약형을 전체 형태로 확장합니다(예: "don't"를 "do not"로) contractions 라이브러리를 사용하여.
- 소문자로 변환: 모든 문자를 소문자로 변환합니다.
- 추가 공백 제거: 단어 사이에 선행, 후행 또는 추가 공백이 없는지 확인합니다.

정리된 텍스트는 text_c 변수에 저장됩니다.

```js
#출력

'dead men tell no tales, by e. w. hornung the project gutenberg ebook of dead men tell no tales this ebook is for the use of anyone anywhere in the united states and most other parts of the world at no cost and with almost no restrictions whatsoever. you may copy it, give it away or reuse it under the terms of the project gutenberg license included with this ebook or online at www.gutenberg.org. if you are not located in the united states, you will have to check the laws of the country where you are located before using this ebook. title dead men tell no tales author e. w. hornung release date april , ebook most recently updated june , language english credits produced by an anonymous project gutenberg volunteer, and david widger start of the project gutenberg ebook dead men tell no tales dead men tell no tales by e. w. hornung contents chapter i. love on the ocean chapter ii. the mysterious cargo chapter iii. to the waters edge chapter iv. the silent sea chapter v. my reward chapter vi. the sole survivor chapter vii. i find a friend chapter viii. a small precaution chapter ix. my convalescent home chapter x. wine and weakness chapter xi. i live again chapter xii. my ladys bidding chapter xiii. the longest day of my life chapter xiv. in the garden chapter xv. first blood chapter xvi. a deadlock chapter xvii. thieves fall out chapter xviii. a man of many murders chapter xix. my great hour chapter xx. the statement of francis rattray chapter i. love on the ocean nothing is so easy as falling in love on a long sea voyage, except falling out of love. especially was this the case in the days when the wooden clippers did finely to land you in sydney or in melbourne under the four full months. we all saw far too much of each other, unless, indeed, we were to see still more. our superficial attractions mutually exhausted, we lost heart and patience in the disappointing strata which lie between the surface and the bedrock of most natures. my own experience was confined to the round voyage of the lady jermyn, in the year . it was no common experience, as was only too well known at the time. and i may add that i for my part had not the faintest intention of falling in love on board nay, after all these years, let me confess that i had good because to hold myself proof against such weakness.
```

## 8. 정제된 텍스트 토큰화

<div class="content-ad"></div>

```js
# 토크나이저 생성
tokenizer = RegexpTokenizer('\w+')

# 토큰 생성
tokens = tokenizer.tokenize(text_c)
tokens[:8]
```

이 코드는 다음 단계를 수행합니다:

토크나이저 생성:

- 알파벳 및 숫자(문자와 숫자) 시퀀스를 캡처하는 정규 표현식 \w+를 사용하여 단어와 일치하는 RegexpTokenizer를 초기화합니다.

<div class="content-ad"></div>

토크나이저를 사용하여 정제된 텍스트(text_c)를 토큰(개별 단어)으로 분할합니다.

첫 번째 몇 개의 토큰을 표시합니다:

토큰화된 출력물을 간략히 보기 위해 처음 여덟 개의 토큰을 표시합니다.

<div class="content-ad"></div>

이 과정은 텍스트를 단어 목록으로 변환하여 추가 텍스트 분석 및 처리에 사용할 수 있습니다.

```js
#출력:
['dead', 'men', 'tell', 'no', 'tales', 'by', 'e', 'w']
```

## 9. 토큰에서 불용어 제거

```js
sw = set(stopwords.words('english'))

# 추가 불용어 추가
additional_stopwords = {'could', 'said', 'must', 'would', 'should', 'might', 'gutenberg','project'}
sw.update(additional_stopwords)
# 새로운 목록 초기화
words_ns = []

# words_ns에 tokens에 있는 단어 중 sw에 없는 모든 단어 추가
for word in tokens:
    if word not in sw:
        words_ns.append(word)

# 상식적인 확인을 위해 몇 가지 항목 출력
words_ns[:5]
```

<div class="content-ad"></div>

Stopwords 불러오기:

- NLTK의 영어 말뭉치에서 stopwords.words('english')를 사용하여 stopwords를 가져옵니다. Stopwords란 "the", "and", "is" 등과 같은 일반적이고 종종 텍스트의 의미에 크게 기여하지 않는 단어를 말합니다.

추가적인 Stopwords 추가하기:

- 컨텍스트에 특정한 추가적인 stopwords를 포함하는 additional_stopwords 집합을 정의합니다. 이러한 단어들은 update()를 사용하여 sw 집합에 추가됩니다.

<div class="content-ad"></div>

비어 있는 리스트 초기화:

- 비어 있는 단어 목록인 words_ns를 초기화합니다.

불용어 제거:

- 토큰 목록에서 각 단어를 반복합니다.
- 단어가 불용어 세트(sw set)에 없는지 확인합니다(즉, 불용어가 아닌지 확인합니다).
- 만약 단어가 불용어가 아니라면, words_ns 목록에 추가됩니다.

<div class="content-ad"></div>

정신을 차리세요:

- words_ns 목록에서 처음 다섯 항목을 인쇄하여 불용어가 성공적으로 제거되었는지 확인합니다.

이 과정을 통해 words_ns 목록에 원본 토큰화된 텍스트에서 일반적인 불용어 및 추가 지정된 단어를 제외하고 의미 있는 단어만 포함되도록 확인합니다.

```js
#출력
['dead', 'men', 'tell', 'tales', 'e']
```

<div class="content-ad"></div>

## 10. 단어 빈도 시각화

```js
# 그림을 인라인으로 설정하고 시각화 스타일을 설정합니다
%matplotlib inline
sns.set()

# 빈도 분포를 생성하고 플롯합니다
freqdist1 = nltk.FreqDist(words_ns)
freqdist1.plot(20)
```

인라인 플로팅 활성화:

- %matplotlib inline은 주피터 노트북에서 사용되는 매직 커맨드로, 플롯이 노트북 내에서 인라인으로 나타날 수 있게 합니다.

<div class="content-ad"></div>

표 태그를 마크다운 형식으로 바꿔주세요.

| 설정 시각화 스타일:
- sns.set()은 plot에 대한 Seaborn의 기본 미학 매개변수를 설정합니다.

| 빈도 분포 생성:
- nltk.FreqDist(words_ns)는 words_ns 리스트의 단어들을 빈도 분포로 생성합니다. 각 단어의 빈도수가 계산됩니다.

<div class="content-ad"></div>

아래는 Frequency Distribution을 시각화합니다:

- freqdist1.plot(20)은 frequency distribution인 freqdist1에서 가장 빈도가 높은 상위 20개의 단어를 시각화합니다.

이 시각화는 정제 및 처리된 텍스트에서 가장 빈번하게 발생하는 단어를 이해하는 데 도움이 되며, 문서의 내용과 초점에 대한 통찰을 제공합니다.

![Frequency Distribution Plot](/assets/img/2024-06-23-BuildingDataPipelineswithWebScrapingAStep-by-StepGuide_0.png)

<div class="content-ad"></div>

만약 추가적인 불용어를 추가하지 않는다면 어떻게 되는지 예시가 아래에 나와 있어요.

![이미지](/assets/img/2024-06-23-BuildingDataPipelineswithWebScrapingAStep-by-StepGuide_1.png)

여기가 웹사이트가 가르치는 내용을 마치는 곳이에요. 이제 우리는 다른 URL로 시도해보고 다른 책들을 스크래핑하여 또 다른 빈도 분포를 생성해 볼 수 있어요.

## 11. 바이그램(bigrams)과 트라이그램(trigrams) 추출

<div class="content-ad"></div>

빅램과 트리그램은 주어진 텍스트나 음성 샘플에서 n개의 항목으로 이루어진 연속적인 시퀀스인 n-그램의 한 유형입니다. 자연어 처리(NLP)에서 이러한 항목은 일반적으로 단어입니다.

빅램:

- 빅램은 두 연이은 단어의 시퀀스입니다.
- 예를 들어, “I love programming”이라는 문장에서 빅램은 다음과 같습니다:
- “I love”
- “love programming”

트리그램:

<div class="content-ad"></div>

- Trigrams은 연이은 세 개의 단어 시퀀스입니다.
- 예를 들어, "I love programming"이라는 문장에서 trigrams는 다음과 같습니다:
- "I love programming"

## NLP에서의 사용:

- Bigrams와 trigrams은 다음과 같은 다양한 NLP 작업에 사용됩니다:
- 텍스트 분석: 단어 사이의 문맥과 관계를 이해하는 데 사용됩니다.
- 언어 모델링: 시퀀스에서 다음 단어를 예측하는 데 사용됩니다.
- 정보 검색: 단어 쌍이나 세 번씩 고려함으로써 검색 알고리즘을 개선하는 데 사용됩니다.
- 감성 분석: 문구의 감정을 이해하는 데 도움이 되는 단일 단어보다 문맥을 더 잘 포착합니다.

```js
bigrams = list(ngrams(words_ns, 2))
trigrams = list(ngrams(words_ns, 3))

# 빈도 분석
bigram_freq = Counter(bigrams)
trigram_freq = Counter(trigrams)

# 상위 10개의 bigram과 trigram 표시
print("상위 10개 Bigrams:")
for bigram, freq in bigram_freq.most_common(10):
    print(bigram, freq)

print("\n상위 10개 Trigrams:")
for trigram, freq in trigram_freq.most_common(10):
    print(trigram, freq)
```

<div class="content-ad"></div>

Bigrams과 Trigrams을 사용하면 개별 단어(일그램)를 사용하는 것보다 텍스트에서 더 많은 맥락과 의미를 포착할 수 있어요.

```js
#결과

상위 10개의 Bigrams:
('lady', 'jermyn') 33
('mr', 'cole') 23
('eva', 'denison') 19
('miss', 'denison') 17
('electronic', 'works') 16
('united', 'states') 15
('captain', 'harris') 14
('literary', 'archive') 13
('archive', 'foundation') 13
('electronic', 'work') 11

상위 10개의 Trigrams:
('literary', 'archive', 'foundation') 13
('dead', 'men', 'tell') 6
('men', 'tell', 'tales') 6
('never', 'shall', 'forget') 5
('protected', 'copyright', 'law') 4
('e', 'w', 'hornung') 3
('ebook', 'dead', 'men') 3
('located', 'united', 'states') 3
('united', 'states', 'check') 3
('states', 'check', 'laws') 3
```

## 12. Trigrams와 Bigrams 그래프 작성:

```js
# ngram 빈도수를 그리는 함수
def plot_ngrams(ngram_freq, title, xlabel, ylabel):
    ngrams, freqs = zip(*ngram_freq.most_common(10))
    ngrams = [' '.join(ngram) for ngram in ngrams]
    
    # 리스트로 변환
    ngrams = list(ngrams)
    freqs = list(freqs)
    
    # 디버깅: 타입 및 내용 출력
    print("freqs의 타입:", type(freqs))
    print("ngrams의 타입:", type(ngrams))
    print("freqs의 내용:", freqs)
    print("ngrams의 내용:", ngrams)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x=freqs, y=ngrams)
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.show()


# 상위 10개의 Bigrams 그래프로 나타내기
plot_ngrams(bigram_freq, '상위 10개의 Bigrams', '빈도수', 'Bigrams')

# 상위 10개의 Trigrams 그래프로 나타내기
plot_ngrams(trigram_freq, '상위 10개의 Trigrams', '빈도수', 'Trigrams')
```

<div class="content-ad"></div>

## 13. POS 태그 생성

```js
def preprocess_text(text): 
    sentences = sent_tokenize(text) 
    sentences = [nltk.pos_tag(word_tokenize(sent)) for sent in sentences]
    
    return sentences

sent_text = preprocess_text(text)

# 디버깅: 토큰화 및 POS 태그가 지정된 문장 출력
print("토큰화 및 POS 태그가 지정된 문장:")
for sent in sent_text:
    print(sent)
```

- nltk.pos_tag는 문장의 각 단어에 대해 품사를 태깅합니다.
- 이 함수는 각 문장이 (단어, POS 태그) 튜플을 포함하는 리스트인 문장의 리스트를 반환합니다.

텍스트 입력에 대한 출력은 각 문장을 (단어, POS 태그) 튜플의 리스트로 나타낸 문장의 리스트가 됩니다.

<div class="content-ad"></div>

```js
#출력

토큰화 및 품사 태깅된 문장:
[('Dead', 'JJ'), ('Men', 'NNP'), ('Tell', 'NNP'), ('No', 'NNP'), ('Tales', 'NNP'), (',', ','), ('by', 'IN'), ('E.', 'NNP'), ('W.', 'NNP'), ('Hornung', 'NNP'), ('The', 'DT'), ('Project', 'NNP'), ('Gutenberg', 'NNP'), ('eBook', 'NN'), ('of', 'IN'), ('Dead', 'JJ'), ('Men', 'NNP'), ('Tell', 'NNP'), ('No', 'NNP'), ('Tales', 'NNP'), ('This', 'DT'), ('ebook', 'NN'), ('is', 'VBZ'), ('for', 'IN'), ('the', 'DT'), ('use', 'NN'), ('of', 'IN'), ('anyone', 'NN'), ('anywhere', 'RB'), ('in', 'IN'), ('the', 'DT'), ('United', 'NNP'), ('States', 'NNPS'), ('and', 'CC'), ('most', 'JJS'), ('other', 'JJ'), ('parts', 'NNS'), ('of', 'IN'), ('the', 'DT'), ('world', 'NN'), ('at', 'IN'), ('no', 'DT'), ('cost', 'NN'), ('and', 'CC'), ('with', 'IN'), ('almost', 'RB'), ('no', 'DT'), ('restrictions', 'NNS'), ('whatsoever', 'RB'), ('.', '.')]
[('You', 'PRP'), ('may', 'MD'), ('copy', 'VB'), ('it', 'PRP'), (',', ','), ('give', 'VB'), ('it', 'PRP'), ('away', 'RB'), ('or', 'CC'), ('re-use', 'VB'), ('it', 'PRP'), ('under', 'IN'), ('the', 'DT'), ('terms', 'NNS'), ('of', 'IN'), ('the', 'DT'), ('Project', 'NNP'), ('Gutenberg', 'NNP'), ('License', 'NNP'), ('included', 'VBD'), ('with', 'IN'), ('this', 'DT'), ('ebook', 'NN'), ('or', 'CC'), ('online', 'NN'), ('at', 'IN'), ('www.gutenberg.org', 'NN'), ('.', '.')]
[('If', 'IN'), ('you', 'PRP'), ('are', 'VBP'), ('not', 'RB'), ('located', 'VBN'), ('in', 'IN'), ('the', 'DT'), ('United', 'NNP'), ('States', 'NNPS'), (',', ','), ('you', 'PRP'), ('will', 'MD'), ('have', 'VB'), ('to', 'TO'), ('check', 'VB'), ('the', 'DT'), ('laws', 'NNS'), ('of', 'IN'), ('the', 'DT'), ('country', 'NN'), ('where', 'WRB'), ('you', 'PRP'), ('are', 'VBP'), ('located', 'VBN'), ('before', 'IN'), ('using', 'VBG'), ('this', 'DT'), ('eBook', 'NN'), ('.', '.')]
```

이 전처리 단계는 명명된 엔터티 인식, 구문 분석 및 의미 분석과 같은 NLP 작업에 유용합니다.

## 14. 명명된 엔터티 추출

```js
# NER 수행
def extract_named_entities(sentences):
    named_entities = []
    for sent in sentences:
        # nltk의 ne_chunk를 사용하여 NER 수행
        tree = nltk.ne_chunk(sent, binary=False)
        print(tree)
        for subtree in tree:
            if hasattr(subtree, 'label'):
                entity_name = ' '.join([child[0] for child in subtree.leaves()])
                entity_type = subtree.label()
                named_entities.append((entity_name, entity_type))
    return named_entities

named_entities = extract_named_entities(sent_text)

# 추출된 명명된 엔터티 출력
for entity in named_entities:
    print(entity)
```

<div class="content-ad"></div>

이 코드 블록은 NLTK를 사용하여 토큰화 및 POS 태깅된 문장에 대해 Named Entity Recognition(NER)을 수행하고 명명된 엔티티를 추출하여 출력하는 함수를 정의합니다.

여기서는 각 문장에 대해 NER을 수행하기 위해 NLTK의 ne_chunk 함수를 사용합니다. binary=False 매개변수는 엔티티가 특정 유형(예: PERSON, ORGANIZATION 등)으로 분류되어야 함을 지정합니다.

```js
#OUTPUT
(S
  Dead/JJ
  Men/NNP
  (ORGANIZATION Tell/NNP No/NNP Tales/NNP)
  ,/,
  by/IN
  E./NNP
  W./NNP
  Hornung/NNP
  The/DT
  (ORGANIZATION Project/NNP Gutenberg/NNP)
  eBook/NN
  of/IN
  (ORGANIZATION Dead/JJ Men/NNP Tell/NNP No/NNP Tales/NNP)
  This/DT
  ebook/NN
  is/VBZ
  for/IN
  the/DT
  use/NN
  of/IN
  anyone/NN
  anywhere/RB
  in/IN
  the/DT
  (GPE United/NNP States/NNPS)
  and/CC
  most/JJS
  other/JJ
  parts/NNS
  of/IN
  the/DT
  world/NN
  at/IN
  no/DT
  cost/NN
  and/CC
  with/IN
  almost/RB
  no/DT
  restrictions/NNS
  whatsoever/RB
  ./.)
(S
  You/PRP
  may/MD
  copy/VB
  it/PRP
  ,/,
  give/VB
  it/PRP
  away/RB
  or/CC
  re-use/VB
  it/PRP
  under/IN
  the/DT
  terms/NNS
  of/IN
  the/DT
  (ORGANIZATION Project/NNP Gutenberg/NNP License/NNP)
  included/VBD
  with/IN
  this/DT
  ebook/NN
  or/CC
  online/NN
  at/IN
  www.gutenberg.org/NN
  ./.)
and so on...
```

이 과정은 텍스트 내의 인물, 조직 및 위치와 같은 명명된 엔티티를 식별하고 분류하여 다양한 NLP 애플리케이션에 유용한 정보를 제공합니다.

<div class="content-ad"></div>

```js
print(named_entities)
```

```js
#OUTPUT
[('Tell No Tales', 'ORGANIZATION'),
 ('Project Gutenberg', 'ORGANIZATION'),
 ('Dead Men Tell No Tales', 'ORGANIZATION'),
 ('United States', 'GPE'),
 ('Project Gutenberg License', 'ORGANIZATION'),
 ('United States', 'GPE'),
 ('Title', 'GPE'),
 ('Tell No Tales', 'ORGANIZATION'),
 ('Hornung Release', 'PERSON'),
 ('David Widger', 'PERSON'),
 ('THE', 'ORGANIZATION'),
 ('PROJECT', 'ORGANIZATION'),
 ('TELL', 'ORGANIZATION'),
 ('TELL', 'ORGANIZATION'),
 ('Hornung', 'PERSON'),
 ('CONTENTS', 'ORGANIZATION'),
 ('LOVE', 'ORGANIZATION'),
 ('OCEAN', 'ORGANIZATION'),
 ('MYSTERIOUS', 'ORGANIZATION'),
 ('THE', 'ORGANIZATION'),
 ('WATER', 'ORGANIZATION'),
 ('EDGE', 'ORGANIZATION'),
 ('SILENT', 'ORGANIZATION'),
 ('REWARD', 'ORGANIZATION'),
 ('SOLE', 'ORGANIZATION'),
 ('FRIEND', 'ORGANIZATION'),
 ('SMALL', 'ORGANIZATION'),
 ('CONVALESCENT', 'ORGANIZATION'),
 ('WINE', 'ORGANIZATION'),
 ('AND', 'ORGANIZATION'),
 ('WEAKNESS', 'ORGANIZATION'),
 ('AGAIN', 'ORGANIZATION'),
 ('BIDDING', 'ORGANIZATION'),
.......
```

## NER entities plotting:

```js
# Frequency analysis
entity_freq = Counter([entity_type for entity_name, entity_type in named_entities])

# Display top 10 named entities
print("Top 10 Named Entities:")
for entity, freq in entity_freq.most_common(10):
    print(entity, freq)

#OUTPUT
Top 10 Named Entities:
PERSON 505
ORGANIZATION 257
GPE 254
```

<div class="content-ad"></div>

```python
# 엔티티 빈도수를 그리는 함수
def plot_entity_frequency(entity_freq, title, xlabel, ylabel):
    entities, freqs = zip(*entity_freq.most_common(10))
    # seaborn과 호환성을 보장하기 위해 리스트로 변환
    entities = list(entities)
    freqs = list(freqs)
    
    # 디버깅: 타입과 내용 출력
    print("freqs의 타입:", type(freqs))
    print("entities의 타입:", type(entities))
    print("freqs의 내용:", freqs)
    print("entities의 내용:", entities)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x=freqs, y=entities)
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.show()

# 상위 10개의 명명된 엔티티 그래프로 나타내기
plot_entity_frequency(entity_freq, '상위 10개 명명된 엔티티', '빈도수', '엔티티')
```

![그림](/assets/img/2024-06-23-BuildingDataPipelineswithWebScrapingAStep-by-StepGuide_2.png)

## 15. spaCy를 이용한 명명된 엔티티 인식 개선하기

NLTK 기반의 명명된 엔티티 인식 (NER) 방법은 일반적으로 잘 작동하지만 가끔 일반 단어를 엔티티로 잘못 분류할 수 있습니다. 예를 들어, "Contents," "Love," "Ocean," 그리고 "Friend"와 같은 단어들이 기관으로 잘못 식별되었는데, 이는 분명히 정확하지 않습니다.


<div class="content-ad"></div>

더 정확한 결과를 얻기 위해 spaCy 라이브러리를 사용하도록 변경하겠습니다. spaCy는 강력하고 현대적인 NLP 라이브러리로, NER을 더 정확하게 처리하기 위해 설계되었습니다. SpaCy의 미리 훈련된 모델은 텍스트의 명명된 엔티티를 인식하는 데 매우 효과적으로 작용하여 이러한 잘못된 분류를 최소화합니다.

```python
# spaCy 모델을 불러오기
nlp = spacy.load("en_core_web_sm")

# spaCy를 사용하여 텍스트 처리
doc = nlp(text_c)

# 명명된 엔티티 추출 및 출력
for ent in doc.ents:
    print(ent.text, ent.label_)
```

spaCy의 출력:

```python
e. w. hornung PERSON
the united states GPE
the united states GPE
e. w. hornung PERSON
june DATE
english NORP
david PERSON
e. w. hornung PERSON
chapter i. love ORG
chapter vii LAW
chapter x. LAW
the longest day DATE
first ORDINAL
francis rattray chapter i. love ORG
the days DATE
the four full months DATE
the year DATE
eva denison PERSON
more than nineteen years of age DATE
first ORDINAL
her years DATE
denison PERSON
two CARDINAL
january DATE
the beginning of the following july DATE
the most odious weeks DATE
black hill LOC
as much as four CARDINAL
half CARDINAL
london GPE
first ORDINAL
five CARDINAL
five pounds QUANTITY
australia GPE
one CARDINAL
only five CARDINAL
any minute of the day TIME
the hour TIME
denison PERSON
one CARDINAL
sixty CARDINAL
joaquin santos PERSON
first ORDINAL
denison PERSON
a few months later DATE
denison PERSON
england GPE
africa LOC
second ORDINAL
eva denison PERSON
```

<div class="content-ad"></div>

## Plotting Spacy 파생 엔티티

```js
# 엔티티 타입 카운트
entity_types = [ent.label_ for ent in doc.ents]
entity_type_freq = Counter(entity_types)

# 시본을 사용한 플로팅
plt.figure(figsize=(8, 5))
sns.barplot(x=list(entity_type_freq.keys()), y=list(entity_type_freq.values()))
plt.title('엔티티 타입 및 빈도')
plt.xlabel('엔티티 타입')
plt.ylabel('빈도')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

<img src="/assets/img/2024-06-23-BuildingDataPipelineswithWebScrapingAStep-by-StepGuide_3.png" />

# 결론

<div class="content-ad"></div>

이 연습에서는 온라인 소스에서 텍스트 데이터를 추출하고 분석하는 과정을 탐색했습니다. 우리는 먼저 웹페이지의 HTML 내용을 가져와 BeautifulSoup로 구문 분석하고 추출된 텍스트를 정리하여 원치 않는 문자와 불용어를 제거했습니다. 그런 다음 텍스트를 토큰화하고 NLTK를 사용하여 초기 Named Entity Recognition(NER)을 수행했습니다.

NLTK 기반의 NER은 텍스트에 존재하는 엔티티에 대한 기본적인 이해를 제공했지만 공통 단어를 명명된 엔티티로 오분류하는 등의 한계가 있었습니다. 이러한 부정확성에 대응하기 위해 보다 고급이고 정확한 NER 접근 방식을 제공하는 spaCy 라이브러리를 소개했습니다.

spaCy를 사용하여 우리는 더 나은 결과를 얻을 수 있었고, 자연어 처리 작업에 적합한 올바른 도구를 선택하는 중요성을 입증했습니다. spaCy를 사용하여 명명된 엔티티를 인식하는 향상된 정밀도는 텍스트 데이터로부터 신뢰할 수 있는 통찰을 제공하는 가치를 강조합니다.

이 단계를 따라가면 큰 양의 텍스트를 효율적으로 처리하고 분석하여 의미 있는 정보를 추출하고 내용에 대한 깊은 통찰을 얻을 수 있습니다. 이 접근 방식은 데이터 과학, 연구 및 비즈니스 인텔리전스의 다양한 응용 분야에 중요합니다.

<div class="content-ad"></div>

# 참고 자료

- Web Scraping & NLP in Python | DataCamp
- What Is Web Scraping? [A Complete Step-by-Step Guide] (careerfoundry.com)

일부 설명은 chatGPT의 도움을 받아 작성되었습니다.