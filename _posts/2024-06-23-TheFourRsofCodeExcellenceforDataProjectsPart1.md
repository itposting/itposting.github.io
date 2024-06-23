---
title: "데이터 프로젝트의 코드 우수성을 위한 4가지 R 1부"
description: ""
coverImage: "/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_0.png"
date: 2024-06-23 16:22
ogImage: 
  url: /assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_0.png
tag: Tech
originalTitle: "The Four R’s of Code Excellence for Data Projects (Part 1)"
link: "https://medium.com/towards-data-science/the-four-rs-of-code-excellence-for-data-projects-part-1-3a390deacff4"
---


![이미지](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_0.png)

# 소개

어떤 데이터 과학 프로젝트도 성공에 중요한 키패드 요소는 고품질의 코드입니다. 단순한 데이터 분석부터 복잡한 머신 러닝 파이프라인에 이르기까지, 코드 품질은 프로젝트의 정확성, 효율성 및 유지 보수성을 보장하기 위해 항상 최우선 사항입니다. 잘 쓰여진 코드는 작업이 다른 사람(포함하여 미래의 본인)에 의해 쉽게 이해되고 수정 및 확장될 수 있도록 합니다. 버그와 오류의 가능성을 최소화하고 데이터 및 머신 러닝 프로젝트를 효율적이고 효과적이며 견고하게 만들어줍니다. 그러나 고품질의 코드를 작성하는 것은 항상 쉬운 일이 아닙니다.

우리 모두는 낮은 품질의 코드를 본 적이 있습니다. 그리고 제가 '본다'고 말할 때, 실제로는 '쓴다'는 것을 의미합니다!

<div class="content-ad"></div>

알고 계시죠: 빠른 분석과 증명 개념 모델링 연습에 도전하셨습니다. 그래서 데이터 세트를 CSV 파일로 덤프하고 노트북을 열어서 두 번 실행하면 오류를 발생시키는 암호화된 42개 셀을 만들었어요. 그 결과, 알수 없는 함수 이름, 덮어쓴 변수, 해독할 수 없는 차트, 결국 자신의 머리가 폭발하는지 EC2 인스턴스의 메모리가 폭발하는지 혼란의 소용돌이 속에 빠지게 되었어요.

하지만 물론, 훌륭한 POC 모델은 충분히 작동하기 때문에 어디에 있게 될까요? 바로 프로덕션 환경이죠!

저주받은 일이 생기면, 항상 그렇듯이, 몇 달 후에 다시 자신의 작업을 돌아보면서 정확히 무엇을 했는지 그리고 첫 번째로 어떻게 작동했는지 이해하려고 애를 쓰게 되는 상황이죠.

네, 우리 모두 그런 경험을 해봤지만, 더 이상 그럴 필요가 없어요!

<div class="content-ad"></div>

이 다부분 선언에서는 데이터 프로젝트를 위한 탁월한 코드를 작성하는 데 도움이 되는 4가지 개념(우연히도 모두 'R'로 시작)을 안내하겠습니다. 이 네 가지 R에 기반한 코드베이스를 구축하여 머신러닝 파이프라인 및 정신 건강을 모두 지킬 수 있기를 희망합니다!

참고: 더 간단하게 하기 위해, 이 글의 범위는 데이터 프로젝트를 위한 파이썬 코드 개발로 한정되었지만, 일반적인 개념은 다른 언어로 확장 가능해야 합니다.

# 첫 번째 R: 가독성

![image](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_1.png)

<div class="content-ad"></div>

남이 읽을 걸 감안하고 코드를 작성하세요.

아니, 더 나은 한 가지를 해볼게요:

남이 읽을 걸 염두에 두고 코드를 작성하세요. 좋은 코드라면, 결국 누군가가 읽을 거에요.

가독성은 다른 사람들(미래의 나 포함)이 코드를 읽는 시점과 장소에 관계없이 쉽게 이해하고 해석할 수 있어야 한다는 걸 의미해요.

<div class="content-ad"></div>

이것은 명확한 구조, 의미 있는 변수 이름, 객체 간 간단하고 논리적인 관계, 그리고 충분한 주석과 문서화가 포함됩니다. 가독성은 간단한 이유로 고품질 코드의 가장 중요한 측면입니다:

코드는 쓰여지는 횟수보다 읽히는 횟수가 더 많습니다. 오늘 쓰고 있는 코드를 읽을 사람은 아마도 여러분들 중 어느 누군가가 여섯 달 뒤에 새로운 기능을 추가하거나 코드베이스에서 버그를 추적할 때 일 것입니다. 가독성을 우선시함으로써 여러분의 코드가 다른 사람들이 이해하기 쉬워지는데 그치지 않고, 장래의 여러분들이 정확히 무엇을 했는지 기억하려고 소중한 시간을 낭비하지 않아도 된다는 점에서 장래의 여러분의 시간을 아낄 수 있습니다.

우리 모두가 조금 더 나은 가독성의 코드를 작성하는 데 시간을 투자한다면, 서로의 코드를 읽는 동안 머리를 긁는 시간을 줄일 수 있습니다. 따라서 높은 기준을 유지하고 동료에게 모범되는 행동을 보인다면, 개선된 효율성, 명확한 커뮤니케이션, 더 나은 협업을 통해 모두가 혜택을 받을 수 있습니다. 저는 개인적으로 대략 72%의 시간을 깨끗하고 가독성 있는 코드를 작성합니다. 여러분들은 제게 비해서 더 나은 결과를 얻을 수 있습니다!

가독성 있는 코드를 작성하는 실용적인 팁은 다음과 같습니다:

<div class="content-ad"></div>

## 코딩에 들어가기 전에 잠깐 멈춰보세요

![Image](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_2.png)

코드를 작성하기 전에 생각하는 시간을 가지세요. 떠오르는 첫 번째 해결책이 문제에 대한 가장 좋은 해결책은 아닐 가능성이 높습니다. 올바른 알고리즘을 사용하고 계십니까? 가장 효율적인 데이터 구조를 사용하고 있나요? 필요 없는 중복 변수를 사용하고 있진 않나요? 코드로 작성하기 전에 단순한 영어로 논리를 설명할 수 있나요?

문제를 개념화하지 않고 코드를 작성하면, 대부분 부적절하거나 완전히 잘못된 것을 작성하게 될 것입니다. 그러면 나중에 반드시 되돌아가서 수정해야 할 것입니다. 하지만 코드를 처음부터 다시 쓸 필요는 없습니다. 아니요, 아니요, 필요한 이유가 있기 때문에 이미 이러한 잘못된 해결책을 만드는 데 수십 시간을 투자했으니까요. 그러므로 처음부터 다시 시작하는 대신에 이제 작동하지 않는 솔루션에 수정을 강요하고, 그 외에 대비하기 위해 어떤 패치를 상위에 올려야 할지 고려해야 합니다. 그리고 그것이 아무도 39.5피트 막대로 만지기 싫어하는 나쁜 코드를 만들어내는 완벽한 요리 비법입니다.

<div class="content-ad"></div>

시간을 내어 생각해보세요. 무엇을 할 것인지 고려해보세요. 주변을 한번 두루 둘러보세요. 그리고 모두가 분명해지면, 뛰어들 준비가 돼 있나요?!

## 명확하고 명시적인 변수와 함수 이름을 선택하세요

![이미지](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_3.png)

이번에 대해 내가 말할 것을 이미 알고 있으니 말할 필요는 없어요. 제목이 모두 설명해주고 있으니까요. 왜냐하면 매우 명확하고 명시적이기 때문이죠!

<div class="content-ad"></div>

안타깝게도, 저는 대부분의 경우 코드를 작성할 때 이렇게 작성하게 됩니다. 특히 급하게 할 때는요.

```js
# 나쁜 코드를 보여드리는 중
df = pd.read_csv('customer_data.csv')
df_2 = df[df['age'] > 30]
```

하지만 여러분은 저처럼 하지 마세요. 객체와 변수(이 경우 판다스 데이터프레임)에 의미 있는 이름을 선택하세요.

모든 데이터프레임을 df라고 부르는 것은 쉽지만 좋은 생각은 아닙니다. 이 예제에서는 데이터프레임 df에 어떤 데이터가 있고 df_2가 무엇을 나타내는지 즉시 알 수 없습니다. 조금 더 나아지도록 해보겠습니다:

<div class="content-ad"></div>


# 이 코드는 약간 더 나은 코드입니다
customer_data = pd.read_csv('customer_data.csv')
customer_over_30 = customer_data[customer_data['age'] > 30]


이 예제에서는 고객 데이터를 포함하는 원본 데이터프레임의 이름이 더 명확하고, 30세 이상인 고객을 참조하는 두 번째 데이터프레임인 customer_over_30이 더 명확합니다. 훨씬 나아 보이죠? 

하지만 과도하게 하는 것은 중요하지 않습니다. 변수 이름을 customers_over_30_active_today_purchased_under_100처럼 길게 지으면 안 됩니다. 이름은 이유당창기술상개발자의 에코메모리에 쉽게 들어맞을 수 있을만큼 짧아야 합니다. 코드를 읽고 변수를 for 루프와 if 문을 통해 추적할 다른 개발자는 빨리 잊지 않을 겁니다. 이름이 모호하면 추적해야 할 것이 무엇인지 곧 잊어버릴 것입니다. 이름이 너무 길 경우 그것이 무엇을 나타내는지 오용하거나 혼란스러울 수 있습니다.

## PEP 8 코딩 스타일을 따르세요


<div class="content-ad"></div>


![2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_4.png](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_4.png)

PEP 8은 이미 알지 못하는 경우를 대비한 Python 코드의 공식 스타일 가이드입니다. 이것은 Python 코드의 가독성을 최대화하기 위한 서식 규칙 세트로, 네이밍 규칙, 공백 사용 여부, 모듈 가져오는 방법 및 순서 등이 포함됩니다.

이 코드 단편은 PEP8 스타일 가이드를 따르지 않습니다.

```python
# 이 코드는 좋지 않아
from sklearn.ensemble import RandomForestClassifier

import pandas as pd
from sklearn.model_selection import *

def loadData(file_path):
    return pd.read_csv(file_path)
def splitData(df):
    return train_test_split(df.drop('target',1),df['target'])
def train_Model(X_train,Y_train):
    return RandomForestClassifier().fit(X_train,Y_train)
df = loadData('some_data.csv')

X_train, X_test, Y_train, Y_test = splitData(df)
model = trainModel(X_train, Y_train)
```

<div class="content-ad"></div>

여기 많은 주황색 깃발이 있어요! 함수 이름이 snake_case로 되어 있지 않아요. 쉼표 뒤나 연산자 주변에 공백이 없어요. 함수들 사이에는 충분한 공백이나 너무 많은 공백이 있어서 코드를 읽기 어려워요. 전반적으로 말하면, 이 코드는 보기 싫은 코드에요.

여기 PEP 8을 따르는 개선된 버전이 있어요.

```js
# 이 코드가 더 좋아요
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def load_data(file_path):
    return pd.read_csv(file_path)


def split_data(df):
    return train_test_split(df.drop('target', axis=1), df['target'])


def train_model(features_train, target_train):
    return RandomForestClassifier().fit(features_train, target_train)


df = load_data('some_data.csv')
features_train, features_test, target_train, target_test = split_data(df)
model = train_model(features_train, target_train)
```

함수 이름은 snake_case로 되어 있고, 쉼표 뒤와 연산자 주변에 공백이 있어요. 함수들 사이에는 두 줄의 공백이 있어요. 추가로 변수 이름이 약간 더 유의미하도록 변경되었어요.

<div class="content-ad"></div>

PEP 8 스타일을 따르는 코드를 보장해주는 서식 지원 도구가 있습니다(린팅 및 서식 지정 부분을 참조하세요), 하지만 처음부터 깔끔하고 가독성이 좋은 코드를 작성하기 위한 가장 중요한 규칙을 알고 있어야 합니다.

## 가능한 한 코드에 내부 문서를 추가하세요

![image](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_5.png)

깔끔한 코드는 문서의 자리 표시자가 아닙니다. 항상 코드에 두 가지 유형의 내부 문서를 추가해야 합니다: (1) 코드가 의도한 작업, (2) 코드를 사용하는 방법. 파이썬에서는 일반적으로 인라인 주석과 독스트링의 조합으로 제공됩니다.

<div class="content-ad"></div>

여기는 잘 문서화된 코드 예시입니다:

```js
# 이 코드가 훨씬 좋아졌어요
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
```

```js
def load_data(file_path):
    """
    csv 파일에서 데이터를 불러옵니다.

    Parameters:
        file_path (str): csv 파일의 경로.

    Returns:
        DataFrame: 불러온 데이터를 pandas DataFrame으로 반환합니다.
    """
    
    # pandas의 read_csv 함수를 사용하여 csv 파일에서 데이터를 불러옵니다.
    loaded_data = pd.read_csv(file_path)
    
    return loaded_data


def split_data(df, test_size=0.2):
    """
    데이터를 훈련 및 테스트 세트로 나누는 함수입니다.

    Parameters:
        df (DataFrame): 나눌 데이터.
        test_size (float): 테스트 세트의 비율.

    Returns:
        X_train, X_test, y_train, y_test (DataFrame, DataFrame, Series, Series): 
            훈련 및 테스트 데이터가 특징과 대상으로 분할됩니다.
    """
    
    # sklearn의 train_test_split 함수를 사용하여 데이터를 
    # 훈련 및 테스트 세트로 나눕니다.
    X_train, X_test, y_train, y_test = \
      train_test_split(df.drop('target', axis=1), 
                       df['target'], 
                       test_size=test_size, 
                       random_state=42,
                       )
    
    return X_train, X_test, y_train, y_test


def train_model(features_train, target_train):
    """
    RandomForestClassifier 모델을 훈련시키는 함수입니다.

    Parameters:
        features_train (DataFrame): 훈련 특징.
        target_train (Series): 훈련 대상.

    Returns:
        RandomForestClassifier: 훈련된 모델.
    """
    
    # RandomForestClassifier를 인스턴스화하고 훈련 데이터에 맞춥니다.
    model = RandomForestClassifier().fit(features_train, target_train)
    
    return model


# csv 파일에서 데이터를 불러옵니다.
df = load_data('some_data.csv')

# 불러온 데이터를 훈련 및 테스트 세트로 나눕니다.
features_train, features_test, target_train, target_test = split_data(df)

# 훈련 데이터로 RandomForestClassifier 모델을 훈련합니다.
model = train_model(features_train, target_train)
```

직업 생활을 하면서 본 뛰어난 품질의 코드들은 대개 자세한 설명과 함께 함수 또는 클래스의 목적, 매개변수 및 반환 값에 대한 문서화 문자열(docstring)이 포함되어 있습니다(예시가 포함되어 있으면 더 좋습니다!). 그러나 코드 자체에 인라인 주석이 부족하다는 점에 항상 실망합니다. 이러한 주석은 특정 코드 라인의 의도를 명확히 하기에 중요하며, 코드베이스를 더 이해하기 쉽고 유지보수하기 용이하며, 무엇보다도 확장 가능하게 만들어 줍니다. 인라인 주석을 쓰는 데 너무 많다고 두려워하지 마세요. 코드를 인라인 문서화로 설명하는 데 공간이 너무 많을 순 없습니다.

<div class="content-ad"></div>

좋은 실천 방법은 당신이 이루고자 하는 로직을 설명하는 한 줄씩 주석을 작성하고 이를 가짜 코드로 취급한 후 실제 코드가 이어지도록 하는 것일 수 있습니다. 예를 들어:

```js
# 초기화된 결과를 저장할 빈 리스트를 만듭니다
results = []

# 0부터 10까지의 범위를 반복합니다
for i in range(10):
    # 숫자가 짝수인지 확인합니다
    if i % 2 == 0:
        # 숫자가 짝수인 경우 결과 리스트에 추가합니다
        results.append(i)

print(results)
# 출력: [0, 2, 4, 6, 8]
```

여기서 실수를 발견했나요?

0부터 10까지 반복하려 했지만 결과는 8까지만 보입니다. 무슨 일이 일어났을까요?

<div class="content-ad"></div>

오, 저희는 10을 포함하지 않는 range(10)을 사용했네요. 어이가 없네요!

코드는 괜찮아요. 매우 가독성이 좋아요. 그 안에 명백한 오류가 없어요. 유일한 문제는 프로그래머가 그것을 수행하려고 의도한 대로 동작하지 않는다는 점이에요.

여기서 문제의 심각성은 분명히 지나치게 과장되었지만, 이 간단한 예제를 사용하여 한 가지 사실을 설명하려고 해요.

코드 라인은 프로그램이 하는 일을 보여줍니다. 인라인 코멘트는 프로그래머가 그것을 수행하려고 의도한 것을 보여줍니다. 의도와 현실 간에 불일치가 있는 경우 인라인 코멘트를 통해 코드의 맨 끝으로 스크롤하는 것보다 그 간극을 식별하고 깨다리는 데 훨씬 빨리 도와줄 수 있어요.

<div class="content-ad"></div>

코드에 주석과 문서를 작성하는 것은 항상 부담스러울 수 있습니다. 특히 이미 깨끗한 코드를 작성하는 데 많은 노력을 기울이고 있을 때 더 그렇습니다. 코드가 매우 가독성이 높고 이해하기 쉽다면, 무슨 일을 하는지 설명하는 주석을 작성할 필요가 없다고 주장할 수 있습니다. 간단한 경우에는 사실이 될 수 있지만, 다소 복잡한 알고리즘을 구현할 때는 문제가 생길 수 있습니다. 깨끗한 코드와 깨끗한 문서는 서로 다른 목적을 위해 필요하며 놀라운 데이터 프로젝트를 위해 둘 다 필요합니다.

참고: 여기서 말씀드리는 것은 사용자 및 개발자가 코드 일부를 이해하는 데 도움이 되도록 함수 또는 클래스 수준에서 제공해야 하는 최소한의 내부 문서에 대한 것입니다. 이는 (가능한 경우) 모듈/패키지 수준의 (잠재적으로 외부) 문서와는 별개이며 사용자에게 어떻게 연결되는지에 대해 높은 수준에서 설명하는 데 필요한 것입니다.

## 다른 사람에게 코드를 읽어보라고 요청하세요 (가능하다면)

![이미지](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_6.png)

<div class="content-ad"></div>

코드가 가독성이 좋은지 알아보는 가장 좋은 방법은요... 맞죠, 당신이 예상한 대로: 그것을 읽어보는 겁니다!

일반적으로 협업 중에는 코드 리뷰를 통해 이루어집니다(GitHub 및 Bitbucket의 풀 리퀘스트 또는 GitLab의 병합 리퀘스트를 통해). 여기서의 도전 과제는 사람들이 일반적으로 코드 리뷰를 하는 걸 좋아하지 않는다는 점입니다. 솔직히 말해서, 코드 리뷰는 지루할 수 있어요. 하지만, 코드 리뷰는 큰 선배 개발자들에 의한 코드 기여를 검토할 때 학습 경험이 될 수도 있고, 주니어 개발자들이 작성한 코드를 검토할 때 가르침의 기회가 될 수도 있어요.

코드를 검토할 때는 긍정적이고 지지적인 태도를 가지는 것이 정말 중요해요. 여러분의 코멘트가 그것을 읽는 사람에게 영향을 줄 수 있다는 걸 명심하고, 가혹한 비판보다 건설적인 피드백을 제공하려 노력해 보세요. 기억하세요, 여러분은 개발자가 아니라 코드를 검토하는 중이에요.

반면에 코드 리뷰 중에 피드백을 받을 때는 목표가 개인적으로 비판하는 게 아니라 코드의 품질을 향상시키는 데 있다는 것을 염두에 두세요. 자존심을 버리세요. 여러분과 여러분의 코드 둘 다 완벽하지 않다는 걸 기억하세요. 따라서 다른 시각을 수용할 수 있도록 열려 있으며, 이를 통해 훨씬 더 나은 해결책으로 이끌 수 있어요. 또한, 여러분의 시간과 피드백에 감사를 표하는 것을 잊지 말고 항상 감사해하세요. 그들은 자신들의 시간을 더 즐거운 일에 할애할 수도 있지만, 여러분과 여러분의 코드의 품질에 전념하기로 결정했기 때문이에요.

<div class="content-ad"></div>

## Linting 및 형식 지정 도구 사용

<img src="/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_7.png" />

Linting 및 형식 지정은 코드를 더 읽기 쉽게 만드는 데 매우 도움이 될 수 있습니다 (또한 견고성을 높입니다). 그러나 이들은 정확히 무엇일까요?

Linting은 코드를 분석하고 잠재적인 오류와 불일치를 식별하는 프로그램을 실행하는 프로세스입니다. 일반적으로 사용자 정의할 수 있는 일정한 코드 품질 수준을 유지하는 데 도움을 줍니다. 예를 들어, numpy를 가져왔지만 실제로 사용하지 않는 경우, 린터는 이를 감지하고 가져오기 문을 제거할 수 있도록 알려줍니다. 이는 잠재적인 오류와 "음성" 버그를 피하는 데 도움이 됩니다. 예를 들어 변수를 None과 비교할 때 x == None 대신 x is None을 사용하지 않아 코드가 실패하는 상황이 있었습니다. 코드가 왜 나를 싫어하는지 두 날 동안 골머리를 썼었죠. Linting은 그런 머리 아픔을 방지할 수 있습니다.

<div class="content-ad"></div>

포맷팅은 코드를 읽기 쉽고 세련되게 만드는 데 관련된 것이에요. 이는 코드를 특정한 미리 정의된 규칙이나 표준에 따라 조직화하거나 조정하는 것을 포함해요. 예를 들어, 슈퍼 멋진 데이터 처리 모듈을 작성했지만 보기에 정말 추한 느낌이었고, 다른 사람들과 공유하기가 조금 부끄러웠던 적이 있나요?

코드 포맷팅은 그런 부분을 다루는 데 도움이 될 수 있어요.여러분의 코드가 깔끔하게 정리되면 좋은 점이죠.

```js
# 데이터 처리 함수의 극악적인 가상 예시...
# 집에서 시도하지 마세요!
def process_data(
    data_source,
    filter_function,
    transform_function,
    group_function,
    aggregate_function,
    normalize_function,
    save_function,
    destination,
):
    data = load_data(data_source)
    
    data = filter_function(data)
    data = transform_function(data)
    data = group_function(data)
    data = aggregate_function(data)
    data = normalize_function(data)
    save_function(data, destination)
```

코드의 형식을 잘 맞춰주면 이렇게 변할 수 있어요.

<div class="content-ad"></div>

인기 있는 코드 린터인 pylint와 flake8, 그리고 코드 가독성을 향상시키는 Black 같은 포매터 등이 있습니다. 저는 개인적으로 linting과 formatting을 위해 Ruff를 사용합니다. Ruff는 빠르고 매우 유연하여 코드 가독성을 유지하는 데 좋은 도구로 CI/CD 파이프라인에 추가할 수 있습니다. Ruff를 사용하는 방법에 대해 더 알고 싶다면 댓글에서 알려주세요. 나중에 이에 대한 글을 쓸지도 모르겠어요.

## 지겹은 일은 AI 비서에게 맡기세요

![AI assistants](/assets/img/2024-06-23-TheFourRsofCodeExcellenceforDataProjectsPart1_8.png)

AI 비서를 활용하면 수고스러운 코딩 작업을 자동화하고 동시에 코드를 더 가독성 있게 만들 수 있습니다. 아니, ChatGPT를 사용하여 코드를 작성하는 게 아닙니다. 간단한 유틸리티 함수나 판다스 데이터 작업이 필요하다면 AI에 맡기세요. 그렇게 하고 새로운 시간을 활용하여 푸어 오버 커피 한 잔을 즐기세요.

<div class="content-ad"></div>

AI를 사용하여 보일러플레이트 코드를 많이 작성하고 인라인 주석을 작성하며 코드에 대한 문서를 생성하는 것에 대해 이야기하고 있어요. GitHub Copilot과 같은 AI 어시스턴트는 타이핑하는 시간을 많이 절약할 수 있어요. 솔직히 말하면, 작성할 코드 중 많은 부분이 반드시 창의적이지 않아요. 이는 보일러플레이트 코드, 루틴 작업 및 반복 요소를 포함하고 있어요. 특히 유틸리티 함수에 대한 독스트링과 간단한 단위 테스트에 대해 이는 특히 사실이에요. Copilot은 이러한 일상적인 작업을 빠르게 처리할 수 있어요. 그래서 코드의 복잡하고 창의적인 측면에 더 많은 시간을 쏟을 수 있게 되고, 다른 사람 개발자들에게도 논리가 이해하기 쉽고 따라가기 쉽도록 만들어주게 되요.

지금까지 Copilot을 사용하면서, 내가 의도한 대로 복잡한 논리가 들어간 탄탄한 코드를 작성하는 데 어려움이 있어요(아니면 내가 그냥 나쁜 프롬프트 엔지니어인지 모르겠어요). 그러나 인라인 주석, 독스트링 및 보일러플레이트 코드에 대한 자동 완성을 제안하는 데 놀랍도록 훌륭한 일을 합니다. 그래서 늘 뇌를 아끼지는 못하지만, 확실히 키보드 작업 시간을 많이 아낄 수 있고 — 보너스로 코드를 더 읽기 쉽게 만들어줍니다.

어시스턴트로 사용하되, 그것을 지팡이로 만들지 않도록 주의하세요. 코드 작성을 위해 AI에 너무 의존하는 것에 대해 신중해지세요. 왜냐하면 어떤 근육이든 꾸준히 사용하지 않으면 그 근육은 분명히 약화되기 마련이기 때문이에요.

저는 데이터 프로젝트의 코드 훌륭성을 위한 네 가지 R 중 첫 번째인 코드 가독성에 집중한 이 부분이 유용하고 실용적이었으면 좋겠어요. 여기서 공유한 팁들이 더 나은 코드를 작성하고 더 견고한 머신러닝 파이프라인을 구축하는 데 도움이 되기를 바랍니다.

<div class="content-ad"></div>

지금 두 번째 R이 무엇을 의미하는지 추측할 수 있나요?

다음 파트도 계속 기대해주세요!

향후 게시글을 업데이트하려면 Medium에서 저를 팔로우해주십시오. 이 시리즈의 두 번째 부분 또한 포함될 예정입니다. 이 글에 대한 여러분의 생각을 듣고 싶으니 아래나 옆에 댓글을 남겨주세요. 또는 여러분의 장치에서 댓글 섹션이 있는 곳에 남겨주세요. 추가로 논의하고 싶은 질문이나 사항이 있으면 LinkedIn에서 연락주세요. 여러분을 만나 기뻐할 것입니다!

기억하세요, 학습의 여정은 길고 계속됩니다. 기술을 능숙하게 유지하고 지식을 최신 상태로 유지하며 시야를 넓혀가세요. 더 나은 코드를 작성하고 독특하며 탁월한 데이터 및 머신러닝 프로젝트를 구축하는 데 건배해봅시다! 🍻