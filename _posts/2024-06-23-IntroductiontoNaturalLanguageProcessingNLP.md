---
title: "자연어 처리NLP 입문 기본 개념과 활용 방법"
description: ""
coverImage: "/assets/img/2024-06-23-IntroductiontoNaturalLanguageProcessingNLP_0.png"
date: 2024-06-23 20:04
ogImage: 
  url: /assets/img/2024-06-23-IntroductiontoNaturalLanguageProcessingNLP_0.png
tag: Tech
originalTitle: "Introduction to Natural Language Processing (NLP)"
link: "https://medium.com/@aidevhub/introduction-to-natural-language-processing-nlp-771c45686e2f"
---


![image](/assets/img/2024-06-23-IntroductiontoNaturalLanguageProcessingNLP_0.png)

# 자연 언어 처리(NLP) 및 응용 프로그램 개요

자연 언어 처리(NLP)는 인공 지능(AI)의 하위 분야로, 컴퓨터와 인간 간의 자연 언어를 통한 상호 작용에 중점을 둡니다. 이는 자연 언어와 음성을 분석하고 합성하기 위해 계산 기술을 적용하는 것을 의미합니다. NLP는 컴퓨터 과학, 언어학 및 기계 학습을 결합하여 컴퓨터가 인간의 언어를 이해하고 해석하며 생산할 수 있도록 합니다.

# NLP의 응용 프로그램

<div class="content-ad"></div>

NLP는 다음과 같은 다양한 응용 프로그램을 포함하고 있습니다:

- 텍스트 분류: 스팸 메일 감지, 감성 분석 및 주제 분류와 같이 미리 정의된 범주로 텍스트를 자동으로 분류합니다.
- 명명된 엔티티 인식 (NER): 텍스트에서 사람, 조직, 위치, 날짜 등과 같은 엔티티를 식별하고 분류합니다.
- 기계 번역: 한 언어에서 다른 언어로 텍스트를 번역합니다. 구글 번역과 같은 서비스가 여기에 해당합니다.
- 감성 분석: 소셜 미디어 게시물에서 표현된 감정을 판별합니다. 긍정적, 부정적 또는 중립적인 감정을 분석합니다.
- 텍스트 요약: 긴 텍스트의 간결한 요약을 자동으로 생성합니다.
- 질의 응답: 자연 언어로 제기된 질문에 답변할 수 있는 시스템을 구축합니다.

<img src="/assets/img/2024-06-23-IntroductiontoNaturalLanguageProcessingNLP_1.png" />

# 기본 NLP 작업

<div class="content-ad"></div>

텍스트 분류 모델 구축에 들어가기 전에 몇 가지 기본 NLP 작업을 이해하는 것이 중요합니다: 토큰화, 어간 추출 및 표제어 추출.

# 토큰화

토큰화는 텍스트를 개별 단어 또는 토큰으로 분해하는 과정입니다. 이는 텍스트 처리의 첫 번째 단계입니다.

```python
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize

text = "Natural Language Processing is fascinating."
tokens = word_tokenize(text)
print(tokens)
```

<div class="content-ad"></div>

# 어간 추출

어간 추출은 단어를 그 뿌리 형태로 줄입니다. 예를들어, "running"은 "run"이 됩니다.

```js
from nltk.stem import PorterStemmer

stemmer = PorterStemmer()
words = ["running", "ran", "runs"]
stemmed_words = [stemmer.stem(word) for word in words]
print(stemmed_words)
```

# 표제어 추출

<div class="content-ad"></div>

표 태그를 마크다운 형식으로 변경해주세요.

`js`
```python
from nltk.stem import WordNetLemmatizer
nltk.download('wordnet')
nltk.download('omw-1.4')

lemmatizer = WordNetLemmatizer()
words = ["running", "ran", "runs"]
lemmatized_words = [lemmatizer.lemmatize(word, pos='v') for word in words]
print(lemmatized_words)
```

## 간단한 텍스트 분류 모델 구축

이 섹션에서는 파이썬을 사용하여 간단한 텍스트 분류 모델을 구축할 것입니다. 머신러닝 모델을 사용하여 영화 리뷰를 긍정적 또는 부정적으로 분류할 것입니다. 이를 위해 sklearn 라이브러리를 사용할 것입니다.

<div class="content-ad"></div>

# 단계 1: 라이브러리 및 데이터셋 불러오기

먼저, 필요한 라이브러리를 가져와서 데이터셋을 로드해보겠습니다. 영화 리뷰 데이터셋을 다운로드하기 위해 nltk 라이브러리를 사용할 것입니다.

```python
import nltk
from sklearn.datasets import load_files
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report

# 영화 리뷰 데이터셋 다운로드
nltk.download('movie_reviews')
from nltk.corpus import movie_reviews
# 데이터셋 로드
documents = [(movie_reviews.raw(fileid), category)
             for category in movie_reviews.categories()
             for fileid in movie_reviews.fileids(category)]
```

# 단계 2: 데이터셋 준비하기

<div class="content-ad"></div>

데이터 세트를 학습 및 테스트 세트로 분할해야 합니다.

```js
# 데이터 세트를 텍스트와 레이블로 분할합니다
텍스트, 레이블 = zip(*문서)

# 학습 및 테스트 세트로 분할합니다
X_학습, X_테스트, y_학습, y_테스트 = train_test_split(텍스트, 레이블, test_size=0.2, random_state=42)
```

# 단계 3: 텍스트 전처리

텍스트 데이터를 숫자 벡터로 변환하기 위해 TfidfVectorizer를 사용할 것입니다.

<div class="content-ad"></div>

```js
# 텍스트 데이터를 TF-IDF 특성으로 변환합니다
vectorizer = TfidfVectorizer(stop_words='english')
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)
```

# 단계 4: 모델 훈련

텍스트 분류 모델을 훈련하는 데 Naive Bayes 알고리즘을 사용할 것입니다.

```js
# 나이브 베이즈 분류기를 훈련합니다
classifier = MultinomialNB()
classifier.fit(X_train_tfidf, y_train)
```

<div class="content-ad"></div>

# 단계 5: 모델 평가하기

이제 테스트 데이터에서 모델을 평가해 봅시다.

```js
# 테스트 세트에 대한 레이블 예측
y_pred = classifier.predict(X_test_tfidf)

# 정확도 계산
accuracy = accuracy_score(y_test, y_pred)
print(f'정확도: {accuracy * 100:.2f}%')
# 분류 보고서 출력
print(classification_report(y_test, y_pred))
```

이 블로그에서 소개된 단계를 따르면, 이제 자연어 처리에 대한 기본적인 이해력과 기본적인 텍스트 분류 모델을 구축할 수 있는 능력이 생겼을 것입니다. 이것은 시작에 불과합니다. 자연어 처리 분야에서 더 많은 고급 기술과 모델을 탐험할 수 있습니다.

<div class="content-ad"></div>

이러한 기술과 도구를 활용해 더 정교한 NLP 애플리케이션을 구축해보세요. 즐거운 코딩 되세요!