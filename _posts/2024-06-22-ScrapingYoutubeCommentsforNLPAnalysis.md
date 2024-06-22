---
title: "NLP 분석을 위한 Youtube 댓글 스크래핑 방법"
description: ""
coverImage: "/assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_0.png"
date: 2024-06-22 16:44
ogImage: 
  url: /assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_0.png
tag: Tech
originalTitle: "Scraping Youtube Comments for NLP Analysis"
link: "https://medium.com/@ashwinsingaram579/scraping-youtube-comments-for-nlp-20a7d25331cc"
---


![image](/assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_0.png)

간단한 NLP 프로젝트를 시도해보고자 했는데, 유튜브 동영상에서 댓글을 가져와 분석해보려고 합니다.

사실 향수에 대해 연구 중이었는데, 인스타그램을 무심코 스크롤하다가 향수 광고에 끌려들어가게 되었습니다. 그렇게해서 향수 리뷰 동영상들을 찾게 되었고, Demi Rawling의 향수 리뷰 동영상을 발견하게 되었습니다... (너무 핫하네요).

유튜브 링크 - https://youtu.be/oJqc2tLMObg

<div class="content-ad"></div>

이 동영상은 탑 10 톰 포드 향수에 관한 것입니다. 다소 오래된 동영상이긴 하지만(4년 전 영상입니다)

먼저, 만약 설치되어 있지 않다면 이곳에서 ChromeDriver를 설치해주세요. 저는 VS Code에서 실행을 시도해봤어요. 필요한 라이브러리는 다음과 같아요...

```js
import sys
import time
import pandas as pd
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
```

그런 다음 스크래핑 부분이 나옵니다...

<div class="content-ad"></div>

```python
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys
from datetime import datetime

# WebDriver를 초기화하고 성능을 향상시키기 위한 옵션 설정
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # 헤드리스 모드로 실행
options.add_argument("--disable-gpu")  # GPU 렌더링 비활성화
options.add_argument("--no-sandbox")  # OS 보안 모델 우회
options.add_argument("--disable-dev-shm-usage")  # 제한된 리소스 문제 극복
options.add_argument("--start-maximized")  # 창 최대화

driver = webdriver.Chrome(options=options)

data = []
youtube_video_url = "https://youtu.be/oJqc2tLMObg"
wait = WebDriverWait(driver, 30) 

# YouTube 비디오 URL 열기
driver.get(youtube_video_url)
print("YouTube URL을 열었습니다.")

# 댓글을 로드하기 위해 스크롤 다운
for item in range(150):  # 여기에 스크롤 횟수 정의
    try:
        body = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "body")))
        body.send_keys(Keys.END)
        sys.stdout.write(f"\r{item + 1}번 스크롤 중")
        sys.stdout.flush()
        time.sleep(1.5)  # 로딩을 위한 시간 증가
    except Exception as e:
        print(f"스크롤 중 예외 발생: {e}")
        break

# 댓글 추출
try:
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#contents #contents")))
    comments = driver.find_elements(By.CSS_SELECTOR, "#content #content-text")
    print(f"\n{len(comments)}개의 댓글 요소를 찾았습니다.")

    user_id = 1  # 고유한 사용자 ID 초기화
    for comment in comments:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data.append({"사용자 ID": user_id, "댓글": comment.text, "타임스탬프": timestamp})
        user_id += 1

    # 중복 제거
    data = [dict(t) for t in {tuple(d.items()) for d in data}]
    print(f"캡처된 댓글 수: {len(data)}")
except Exception as e:
    print(f"댓글 추출 중 예외 발생: {e}")

driver.quit()

# DataFrame 생성
df = pd.DataFrame(data, columns=["사용자 ID", "댓글", "타임스탬프"])

# DataFrame 표시
print(df)

# DataFrame을 CSV 파일로 저장 (선택 사항)
df.to_csv("youtube_comments.csv", index=False)
``` 

여기서 댓글을 스크래핑하기 위해 스크롤 수를 사용했어요. 댓글 수의 최대값으로 변환할 수도 있지만, 현재 이 방법이 가장 잘 작동합니다.

그래서 이 몇 가지 가정과 제약들이 있어요.

가정과 제약사항: 각 댓글의 사용자 이름을 스크래핑하여 하나의 작성자가 여러 번 댓글을 작성했을 때 합칠 수 있도록 시도했지만 크롬 드라이버에서 많은 시간이 소요되고 있는 것을 고려하여 무모하게 반복된 댓글이 작성되지는 않았을 것이라고 가정하고, 추출된 날짜를 추가한 각 댓글을 고유한 것으로 간주했어요.


<div class="content-ad"></div>

크롬 드라이버를 헤드리스 모드로 실행하여 응답 속도를 높였어요. 코드에서 주석 처리하고 실행해보셔도 돼요. 만약 더 빠른 스크래핑 방법을 찾으시면 댓글로 알려주세요. François St-Amant의 코드를 참고했어요.

링크 — [여기](https://towardsdatascience.com/how-to-scrape-youtube-comments-with-python-61ff197115d)

```python
import pandas as pd
df = pd.DataFrame(data, columns=['comment'])
df.head()
```

![이미지](/assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_1.png)

<div class="content-ad"></div>

지금은 Perplexity.ai와 함께 이 동영상에서 언급된 향수 목록을 두 번째 데이터프레임으로 가지고 있어요. 이 목록은 수동으로 가져왔지만 파이썬을 사용하여 동영상을 구문 분석하여 수행할 수도 있지만 그것은 다른 날을 위해 저장합시다. 또한 이에 대한 YouTube 동영상 요약기를 확인할 수도 있는데, 이것은 제 친구 Priyanshu Shukla가 만들었어요 – https://medium.com/@priyanshu-shkl7/implementing-generative-ai-into-your-apps-web-scraping-with-genai-f08711a404cb

![이미지](/assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_2.png)

이제 NLP 부분으로 넘어가볼게요. 간단히 말씀드리면, 댓글 내에서 언급된 Tom Ford의 다양한 향수들을 얻으려고 노력 중이에요. 기본적으로 언급에 따라 각 향수를 지정하고 활동이 가장 많은 순서대로 정렬 중이에요.

이를 달성하기 위해 다양한 방법이 있지만, 저는 NLTK(Natural Language Toolkit)를 사용했어요. NLTK는 파이썬에서 인간의 언어 데이터를 처리하는 강력한 라이브러리예요. 이는 자연어 처리(NLP) 작업에 널리 사용되며, 의미론적 키워드 일치 및 감성 분석과 같은 작업에 적합해요.

<div class="content-ad"></div>

HuggingFace에서 제공하는 최고의 sentence transformers 중 하나를 사용하여 의미론적 문자열 매칭을 수행하거나 사용할 수 있습니다. 또한, 동일한 작업을 수행하기 위해 사용 가능한 LLM들을 사용할 수도 있지만 대규모 데이터셋에 대한 프로덕션 배포의 경우 sentence transformers가 가장 적합할 것입니다.

```python
!pip install nltk
import nltk
nltk.download('vader_lexicon')
```

```python
import pandas as pd
from nltk.sentiment import SentimentIntensityAnalyzer

def calculate_sentiment_scores(comments, perfumes):
    sentiment_scores = {str(perfume): [] for perfume in perfumes}
    
    sid = SentimentIntensityAnalyzer()
    
    for _, row in comments.iterrows():
        comment = str(row['Comment'])
        user_id = row['User ID']
        sentiment_dict = sid.polarity_scores(comment)
        
        compound_score = sentiment_dict['compound']
        
        for perfume in perfumes:
            if str(perfume).lower() in comment.lower():
                sentiment_scores[str(perfume)].append((user_id, comment, compound_score))
    
    return sentiment_scores

# Load the comments DataFrame
df_comments = df

# Load the perfumes DataFrame
df_perfumes = df2

# Extract perfumes from df_perfumes
perfumes = df2.iloc[:, 0].tolist()

# Calculate sentiment scores for each perfume in the comments
sentiment_scores = calculate_sentiment_scores(df_comments, perfumes)

# Create a new DataFrame with 'user_id', 'comment', 'perfume', and 'sentiment_score' columns
data = []
for perfume, user_comment_list in sentiment_scores.items():
    for user_id, comment, sentiment_score in user_comment_list:
        data.append([user_id, comment, perfume, sentiment_score])

df_result = pd.DataFrame(data, columns=['user_id', 'comment', 'perfume', 'sentiment_score'])

# Print the resulting DataFrame
print("User Comments with Sentiment Scores:")
df_result
```

![YouTube Comments](/assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_3.png)


<div class="content-ad"></div>

위에서 보듯이, 각 댓글에는 때때로 하나 이상의 향수가 언급되어서 각 향수에 대한 점수가 계산됩니다. 그래서 "나는 블랙 오키드를 소유하고 있다"는 댓글은 Beau de jour를 가지고 있습니다. 그래서 Beau de jour와 black orchid 각각 한 번씩 나타납니다.

하지만 이에 더해, 만일 우리가 이 감정 분석과 키워드 일치를 확인해야 한다면, 이를 위해 Tableau로 간단한 대시보드를 구축했습니다. Tableau 대시보드를 사용하면 빠르게 향수들과 그들의 감정 점수를 필터링할 수 있습니다.

[![테이블로 대시보드](/assets/img/2024-06-22-ScrapingYoutubeCommentsforNLPAnalysis_4.png)](https://public.tableau.com/views/YoutubeSentimentAnalysis/YoutubeComments-NLPAnalysis?:language=en-GB&:sid=&:display_count=n&:origin=viz_share_link)

<div class="content-ad"></div>

어떤 생각이든 자유롭게 공유해 주시고, 댓글을 남기셔서 제 소식을 받아보세요! 읽어 주셔서 감사합니다!